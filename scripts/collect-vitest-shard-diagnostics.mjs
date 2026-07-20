import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, posix, relative, resolve, sep } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const REQUIRED_ARGUMENTS = [
  "--group",
  "--projects",
  "--test-name-pattern",
  "--blob",
  "--coverage-json",
  "--output",
  "--pnpm-version",
  "--vitest-version",
  "--runner-os",
  "--vitest-max-forks",
  "--original-outcome",
];

const OUTCOMES = new Set(["success", "failure", "cancelled", "skipped"]);
const GROUP_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/u;
const PROJECT_PATTERN = /^--project=[A-Za-z0-9][A-Za-z0-9._-]*$/u;

function compareCodeUnits(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function fail(message) {
  throw new Error(message);
}

function isSingleLine(value) {
  return !value.includes("\u0000") && !value.includes("\r") && !value.includes("\n");
}

function isSingleNonEmptyLine(value) {
  return value.length > 0 && isSingleLine(value);
}

function parseArguments(argv) {
  if (argv.length === 1 && argv[0] === "--self-test") {
    return { selfTest: true };
  }
  if (argv.includes("--self-test")) {
    fail("--self-test must be the only argument");
  }
  if (argv.length % 2 !== 0) {
    fail("every argument must have exactly one value");
  }

  const allowed = new Set(REQUIRED_ARGUMENTS);
  const parsed = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index];
    const value = argv[index + 1];
    if (!allowed.has(name)) {
      fail(`unknown argument: ${String(name)}`);
    }
    if (parsed.has(name)) {
      fail(`duplicate argument: ${name}`);
    }
    if (
      typeof value !== "string" ||
      (value.length === 0 && name !== "--test-name-pattern")
    ) {
      fail(`missing value for argument: ${name}`);
    }
    parsed.set(name, value);
  }

  for (const name of REQUIRED_ARGUMENTS) {
    if (!parsed.has(name)) {
      fail(`missing required argument: ${name}`);
    }
  }

  return {
    selfTest: false,
    group: parsed.get("--group"),
    projects: parsed.get("--projects"),
    testNamePattern: parsed.get("--test-name-pattern"),
    blob: parsed.get("--blob"),
    coverageJson: parsed.get("--coverage-json"),
    output: parsed.get("--output"),
    pnpmVersion: parsed.get("--pnpm-version"),
    vitestVersion: parsed.get("--vitest-version"),
    runnerOs: parsed.get("--runner-os"),
    vitestMaxForks: parsed.get("--vitest-max-forks"),
    originalOutcome: parsed.get("--original-outcome"),
  };
}

function validateCanonicalRepositoryPath(value, name) {
  if (isAbsolute(value) || value.includes("\\") || value.includes("\u0000")) {
    fail(`${name} must be a canonical repository-relative POSIX path`);
  }
  const normalized = posix.normalize(value);
  if (
    normalized !== value ||
    normalized === "." ||
    normalized === ".." ||
    normalized.startsWith("../") ||
    normalized.startsWith("/")
  ) {
    fail(`${name} must be a canonical repository-relative POSIX path`);
  }
  return normalized;
}

function isWithin(root, candidate) {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot === "" || (!pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== "..");
}

function nearestExistingAncestor(candidate) {
  let current = candidate;
  while (!existsSync(current)) {
    const parent = dirname(current);
    if (parent === current) {
      fail(`cannot find an existing ancestor for ${candidate}`);
    }
    current = parent;
  }
  return current;
}

function resolveInsideRepository(repositoryRoot, repositoryRealRoot, repositoryPath, name) {
  const absolutePath = resolve(repositoryRoot, ...repositoryPath.split("/"));
  if (!isWithin(repositoryRoot, absolutePath)) {
    fail(`${name} resolves outside the repository`);
  }
  const ancestorRealPath = realpathSync(nearestExistingAncestor(absolutePath));
  if (!isWithin(repositoryRealRoot, ancestorRealPath)) {
    fail(`${name} traverses outside the repository through a symbolic link`);
  }
  return absolutePath;
}

function validateInvocation(options) {
  if (!GROUP_PATTERN.test(options.group)) {
    fail("--group contains unsupported characters");
  }
  const projectArguments = options.projects.trim().split(/\s+/u);
  if (projectArguments.length === 0 || projectArguments.some((item) => !PROJECT_PATTERN.test(item))) {
    fail("--projects must contain only one or more --project=<name> arguments");
  }
  if (!isSingleLine(options.testNamePattern)) {
    fail("--test-name-pattern must be one line without NUL characters");
  }
  for (const [name, value] of [
    ["--pnpm-version", options.pnpmVersion],
    ["--vitest-version", options.vitestVersion],
    ["--runner-os", options.runnerOs],
    ["--vitest-max-forks", options.vitestMaxForks],
  ]) {
    if (!isSingleNonEmptyLine(value)) {
      fail(`${name} must be a single non-empty line`);
    }
  }
  if (!OUTCOMES.has(options.originalOutcome)) {
    fail("--original-outcome must be success, failure, cancelled, or skipped");
  }

  return {
    ...options,
    blob: validateCanonicalRepositoryPath(options.blob, "--blob"),
    coverageJson: validateCanonicalRepositoryPath(options.coverageJson, "--coverage-json"),
    output: validateCanonicalRepositoryPath(options.output, "--output"),
    projectArguments,
  };
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function inspectRegularFile(absolutePath, repositoryPath) {
  if (!existsSync(absolutePath)) {
    return {
      path: repositoryPath,
      present: false,
      bytes: null,
      mtimeUtc: null,
      sha256: null,
    };
  }
  const fileStat = lstatSync(absolutePath);
  if (!fileStat.isFile() || fileStat.isSymbolicLink()) {
    fail(`${repositoryPath} exists but is not a regular file`);
  }
  const bytes = readFileSync(absolutePath);
  return {
    path: repositoryPath,
    present: true,
    bytes: bytes.byteLength,
    mtimeUtc: fileStat.mtime.toISOString(),
    sha256: sha256(bytes),
  };
}

function listDirectory(repositoryRoot, repositoryPath) {
  const absoluteRoot = resolve(repositoryRoot, ...repositoryPath.split("/"));
  if (!existsSync(absoluteRoot)) {
    return { root: repositoryPath, present: false, entries: [] };
  }
  const rootStat = lstatSync(absoluteRoot);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) {
    fail(`${repositoryPath} exists but is not a regular directory`);
  }

  const entries = [];
  const visit = (absoluteDirectory, relativeDirectory) => {
    const names = readdirSync(absoluteDirectory).sort(compareCodeUnits);
    for (const name of names) {
      const absoluteEntry = join(absoluteDirectory, name);
      const relativeEntry = relativeDirectory === "" ? name : `${relativeDirectory}/${name}`;
      const entryStat = lstatSync(absoluteEntry);
      if (entryStat.isSymbolicLink()) {
        entries.push({ path: relativeEntry, type: "symbolic-link", bytes: null });
      } else if (entryStat.isDirectory()) {
        entries.push({ path: relativeEntry, type: "directory", bytes: null });
        visit(absoluteEntry, relativeEntry);
      } else if (entryStat.isFile()) {
        entries.push({ path: relativeEntry, type: "file", bytes: entryStat.size });
      } else {
        entries.push({ path: relativeEntry, type: "other", bytes: null });
      }
    }
  };
  visit(absoluteRoot, "");
  return { root: repositoryPath, present: true, entries };
}

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (value !== null && typeof value === "object") {
    const result = {};
    for (const key of Object.keys(value).sort(compareCodeUnits)) {
      result[key] = stableValue(value[key]);
    }
    return result;
  }
  return value;
}

function stableJson(value) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

function collectDiagnostics(rawOptions, repositoryRoot = process.cwd()) {
  const options = validateInvocation(rawOptions);
  const normalizedRepositoryRoot = resolve(repositoryRoot);
  const repositoryRealRoot = realpathSync(normalizedRepositoryRoot);
  const blobAbsolute = resolveInsideRepository(
    normalizedRepositoryRoot,
    repositoryRealRoot,
    options.blob,
    "--blob",
  );
  const coverageJsonAbsolute = resolveInsideRepository(
    normalizedRepositoryRoot,
    repositoryRealRoot,
    options.coverageJson,
    "--coverage-json",
  );
  const outputAbsolute = resolveInsideRepository(
    normalizedRepositoryRoot,
    repositoryRealRoot,
    options.output,
    "--output",
  );

  if (
    isWithin(outputAbsolute, blobAbsolute) ||
    isWithin(blobAbsolute, outputAbsolute) ||
    isWithin(outputAbsolute, coverageJsonAbsolute) ||
    isWithin(coverageJsonAbsolute, outputAbsolute)
  ) {
    fail("--output must not overlap diagnostic input paths");
  }
  if (existsSync(outputAbsolute)) {
    const outputStat = lstatSync(outputAbsolute);
    if (!outputStat.isDirectory() || outputStat.isSymbolicLink() || readdirSync(outputAbsolute).length !== 0) {
      fail("--output must not exist or must be an empty regular directory");
    }
  } else {
    mkdirSync(outputAbsolute, { recursive: true });
  }

  const blob = inspectRegularFile(blobAbsolute, options.blob);
  const coverageJson = inspectRegularFile(coverageJsonAbsolute, options.coverageJson);
  const listingRoots = [...new Set([posix.dirname(options.blob), posix.dirname(options.coverageJson)])]
    .sort(compareCodeUnits)
    .map((root) => listDirectory(normalizedRepositoryRoot, root));

  let diagnosticBlobPath = null;
  if (blob.present) {
    const blobOutputDirectory = join(outputAbsolute, "blob");
    mkdirSync(blobOutputDirectory);
    const blobCopyAbsolute = join(blobOutputDirectory, basename(options.blob));
    copyFileSync(blobAbsolute, blobCopyAbsolute);
    const copiedBytes = readFileSync(blobCopyAbsolute);
    if (copiedBytes.byteLength !== blob.bytes || sha256(copiedBytes) !== blob.sha256) {
      fail("diagnostic blob copy does not match its source");
    }
    diagnosticBlobPath = `blob/${basename(options.blob)}`;
  }

  const manifest = {
    schemaVersion: 1,
    group: options.group,
    projectArguments: options.projectArguments,
    testNamePattern: options.testNamePattern,
    originalStepOutcome: options.originalOutcome,
    runtime: {
      nodeVersion: process.version,
      pnpmVersion: options.pnpmVersion,
      vitestVersion: options.vitestVersion,
      runnerOs: options.runnerOs,
    },
    nonSecretVitestConfig: {
      VITEST_MAX_FORKS: options.vitestMaxForks,
    },
    blob: {
      path: blob.path,
      blobPresent: blob.present,
      blobBytes: blob.bytes,
      blobMtimeUtc: blob.mtimeUtc,
      blobSha256: blob.sha256,
      diagnosticCopyPath: diagnosticBlobPath,
    },
    coverageJson: {
      path: coverageJson.path,
      coverageJsonPresent: coverageJson.present,
      coverageJsonBytes: coverageJson.bytes,
      coverageJsonMtimeUtc: coverageJson.mtimeUtc,
      coverageJsonSha256: coverageJson.sha256,
    },
    directoryListings: listingRoots,
    manifestIntegrity: {
      algorithm: "SHA-256",
      checksumFile: "manifest.sha256",
      covers: "exact UTF-8 bytes of manifest.json including its trailing LF",
    },
  };

  const manifestText = stableJson(manifest);
  const manifestBytes = Buffer.from(manifestText, "utf8");
  const manifestHash = sha256(manifestBytes);
  writeFileSync(join(outputAbsolute, "manifest.json"), manifestBytes);
  writeFileSync(join(outputAbsolute, "manifest.sha256"), `${manifestHash}  manifest.json\n`, "utf8");

  return { manifest, manifestText, manifestHash, outputAbsolute };
}

function expect(condition, message) {
  if (!condition) {
    fail(`self-test failed: ${message}`);
  }
}

function expectThrows(action, pattern, message) {
  try {
    action();
  } catch (error) {
    expect(error instanceof Error && pattern.test(error.message), message);
    return;
  }
  fail(`self-test failed: ${message}`);
}

function selfTest() {
  expectThrows(
    () => parseArguments(["--unknown", "value"]),
    /unknown argument/u,
    "unknown arguments must fail closed",
  );
  expectThrows(
    () => parseArguments(["--group", "one", "--group", "two"]),
    /duplicate argument/u,
    "duplicate arguments must fail closed",
  );
  expectThrows(
    () => parseArguments(["--group", "one"]),
    /missing required argument/u,
    "missing arguments must fail closed",
  );

  const temporaryRoot = mkdtempSync(join(tmpdir(), "botc-vitest-diagnostics-"));
  try {
    mkdirSync(join(temporaryRoot, ".vitest-coverage", "sample"), { recursive: true });
    mkdirSync(join(temporaryRoot, "coverage"), { recursive: true });
    const blobPath = join(temporaryRoot, ".vitest-coverage", "sample", "sample.blob");
    const coveragePath = join(temporaryRoot, "coverage", "coverage-final.json");
    const blobBytes = Buffer.from("blob-bytes\n", "utf8");
    const coverageBytes = Buffer.from('{"covered":true}\n', "utf8");
    writeFileSync(blobPath, blobBytes);
    writeFileSync(coveragePath, coverageBytes);
    const fixedMtime = new Date("2026-07-20T00:00:00.000Z");
    utimesSync(blobPath, fixedMtime, fixedMtime);
    utimesSync(coveragePath, fixedMtime, fixedMtime);

    const baseOptions = {
      selfTest: false,
      group: "sample",
      projects: "--project=alpha --project=beta",
      testNamePattern: "\\[(?:alpha|beta)-",
      blob: ".vitest-coverage/sample/sample.blob",
      coverageJson: "coverage/coverage-final.json",
      pnpmVersion: "11.7.0",
      vitestVersion: "vitest/self-test",
      runnerOs: "self-test",
      vitestMaxForks: "1",
      originalOutcome: "failure",
    };
    const first = collectDiagnostics(
      { ...baseOptions, output: ".diagnostics/first" },
      temporaryRoot,
    );
    const second = collectDiagnostics(
      { ...baseOptions, output: ".diagnostics/second" },
      temporaryRoot,
    );

    expect(first.manifest.blob.blobPresent === true, "present blob must be recorded");
    expect(first.manifest.blob.blobBytes === blobBytes.byteLength, "blob bytes must be exact");
    expect(first.manifest.blob.blobSha256 === sha256(blobBytes), "blob hash must be exact");
    expect(first.manifest.coverageJson.coverageJsonBytes === coverageBytes.byteLength, "coverage bytes must be exact");
    expect(first.manifest.coverageJson.coverageJsonSha256 === sha256(coverageBytes), "coverage hash must be exact");
    expect(first.manifest.originalStepOutcome === "failure", "non-success outcome must remain data");
    expect(
      first.manifest.testNamePattern === baseOptions.testNamePattern,
      "test-name pattern must be recorded exactly",
    );
    expect(first.manifestText === second.manifestText, "manifest serialization must be deterministic");
    expect(first.manifestHash === second.manifestHash, "manifest hashes must be deterministic");
    expect(first.manifestText.endsWith("\n") && !first.manifestText.endsWith("\n\n"), "manifest must have one trailing LF");
    const checksumText = readFileSync(join(first.outputAbsolute, "manifest.sha256"), "utf8");
    expect(checksumText === `${first.manifestHash}  manifest.json\n`, "checksum file must hash exact manifest bytes");
    expect(
      readFileSync(join(first.outputAbsolute, "blob", "sample.blob")).equals(blobBytes),
      "diagnostic blob copy must preserve bytes",
    );
    expect(readFileSync(blobPath).equals(blobBytes), "source blob bytes must not change");
    expect(readFileSync(coveragePath).equals(coverageBytes), "source coverage bytes must not change");
    expect(statSync(blobPath).mtime.toISOString() === fixedMtime.toISOString(), "source blob mtime must not change");
    expect(
      statSync(coveragePath).mtime.toISOString() === fixedMtime.toISOString(),
      "source coverage mtime must not change",
    );

    const missing = collectDiagnostics(
      {
        ...baseOptions,
        blob: ".vitest-coverage/sample/missing.blob",
        output: ".diagnostics/missing",
      },
      temporaryRoot,
    );
    expect(missing.manifest.blob.blobPresent === false, "missing blob must record blobPresent=false");
    expect(missing.manifest.blob.blobSha256 === null, "missing blob hash must be null");
    expect(missing.manifest.blob.diagnosticCopyPath === null, "missing blob must not claim a copy");

    const emptyFilter = collectDiagnostics(
      {
        ...baseOptions,
        testNamePattern: "",
        output: ".diagnostics/empty-filter",
      },
      temporaryRoot,
    );
    expect(
      emptyFilter.manifest.testNamePattern === "",
      "explicit empty test-name pattern must remain distinct diagnostic data",
    );

    expectThrows(
      () => validateCanonicalRepositoryPath("../outside", "--blob"),
      /canonical repository-relative/u,
      "path traversal must fail closed",
    );
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }

  process.stdout.write("collect-vitest-shard-diagnostics self-test: PASS\n");
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.selfTest) {
    selfTest();
    return;
  }
  const result = collectDiagnostics(options);
  process.stdout.write(`coverage diagnostic manifest: ${result.manifestHash}\n`);
}

const invokedPath = process.argv[1] === undefined ? "" : resolve(process.argv[1]);
if (invokedPath === resolve(fileURLToPath(import.meta.url))) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`collect-vitest-shard-diagnostics: ${message}\n`);
    process.exitCode = 1;
  }
}

export { collectDiagnostics, parseArguments, stableJson, validateCanonicalRepositoryPath };
