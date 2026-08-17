/* global Buffer, process, URL */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  closeSync,
  copyFileSync,
  existsSync,
  fsyncSync,
  lstatSync,
  mkdtempSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
  writeSync
} from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { inflateRawSync } from "node:zlib";

const CAPTURE_SCHEMA_VERSION = "2B20B-P2F1R-D2-capture-v1";
const ACQUISITION_SCHEMA_VERSION = "2B20B-P2F1R-D2-acquisition-v1";
const BUNDLE_SCHEMA_VERSION = "2B20B-P2F1R-D2-publication-evidence-v1";
const PARENT_ARTIFACT_HEAD = "0bf487afc49069f6191dd7409362d5c227aa50dc";
const PARENT_EVIDENCE_HEAD = "15b7e61682d3b34e45401cf132fa1a77b6347c22";
const SETTLED_BASELINE_HEAD = "8898f62ceb90433634cf02e83ad5d4ff95db4499";
const RULE_EVIDENCE_HEAD = "418b2fdb1c68578fa279fe915307efb802402247";
const ACCEPTED_PROFILE_SOURCE_HEAD = "4d576e205cb20c37ba913b923a1cd39e8d800d18";
const DESIGN_PATH =
  "docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md";
const CATALOG_PATH =
  "docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md";
const COMMAND_ARGV = Object.freeze([
  "node",
  "scripts/run-vitest-logical-group.mjs",
  "run",
  "--mode",
  "ordinary",
  "--logical-group-id",
  "domain-core-rest"
]);
const acquisitionFile = () => Object.freeze({ kind: "file" });
const acquisitionDirectory = (children, allowAdditionalChildren = false) =>
  Object.freeze({
    kind: "directory",
    children: Object.freeze(children),
    allowAdditionalChildren
  });
const ACQUISITION_FILESYSTEM_SCHEMA = acquisitionDirectory({
  "acquisition-manifest.json": acquisitionFile(),
  api: acquisitionDirectory({
    "run.json": acquisitionFile(),
    jobs: acquisitionDirectory({
      "linux.json": acquisitionFile(),
      "windows.json": acquisitionFile()
    }),
    "artifacts.json": acquisitionFile()
  }),
  downloads: acquisitionDirectory({
    artifacts: acquisitionDirectory({
      "linux.zip": acquisitionFile(),
      "windows.zip": acquisitionFile()
    }),
    logs: acquisitionDirectory({
      "linux.bin": acquisitionFile(),
      "windows.bin": acquisitionFile()
    })
  }),
  artifacts: acquisitionDirectory({
    linux: acquisitionDirectory({
      "d2-capture.json": acquisitionFile(),
      "runner-output": acquisitionDirectory({
        "logical-manifest.json": acquisitionFile(),
        "verification.json": acquisitionFile()
      }, true)
    }),
    windows: acquisitionDirectory({
      "d2-capture.json": acquisitionFile(),
      "runner-output": acquisitionDirectory({
        "logical-manifest.json": acquisitionFile(),
        "verification.json": acquisitionFile()
      }, true)
    })
  })
});
const SHA40 = /^[0-9a-f]{40}$/u;
const SHA256 = /^[0-9a-f]{64}$/u;
const DEC_ID = /^(?:[1-9][0-9]{0,19})$/u;
const UTC_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u;
const MAX_DEC_ID = 18_446_744_073_709_551_615n;
const CONFIGURED_MAX_VALID_JSON_NESTING_DEPTH = 5;
const JSON_DEPTH_AUTHORITY_SOURCE = "FROZEN_CLOSED_SCHEMA_CONSTRUCTORS";

class D2Error extends Error {
  constructor(code, detail = "") {
    super(detail);
    this.code = code;
  }
}

function fail(code, detail = "") {
  throw new D2Error(code, detail);
}

const KNOWN_EVIDENCE_FILESYSTEM_CODES = Object.freeze([
  "EACCES",
  "EBUSY",
  "EIO",
  "EISDIR",
  "ELOOP",
  "ENAMETOOLONG",
  "ENOENT",
  "ENOTDIR",
  "EPERM"
]);

function evidenceFilesystem(operation, code, context) {
  try {
    return operation();
  } catch (error) {
    if (
      error instanceof Error &&
      typeof error.code === "string" &&
      KNOWN_EVIDENCE_FILESYSTEM_CODES.includes(error.code)
    ) {
      fail(code, context);
    }
    throw error;
  }
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function canonicalBytes(value) {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function hasLoneSurrogate(value) {
  for (let index = 0; index < value.length; index += 1) {
    const unit = value.charCodeAt(index);
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (next < 0xdc00 || next > 0xdfff) return true;
      index += 1;
    } else if (unit >= 0xdc00 && unit <= 0xdfff) return true;
  }
  return false;
}

function validateString(value, predicate, label) {
  if (
    typeof value !== "string" ||
    hasLoneSurrogate(value) ||
    value.normalize("NFC") !== value ||
    !predicate(value)
  ) {
    fail("D2_TYPE_INVALID", label);
  }
  return value;
}

function validateSha40(value, label) {
  return validateString(value, (item) => SHA40.test(item), label);
}

function validateSha256(value, label) {
  return validateString(value, (item) => SHA256.test(item), label);
}

function validateDecId(value, label) {
  return validateString(
    value,
    (item) => DEC_ID.test(item) && BigInt(item) <= MAX_DEC_ID,
    label
  );
}

function validateSafeUInt(value, label, maximum = Number.MAX_SAFE_INTEGER, positive = false) {
  if (
    !Number.isSafeInteger(value) ||
    value < (positive ? 1 : 0) ||
    value > maximum ||
    Object.is(value, -0)
  ) {
    fail("D2_TYPE_INVALID", label);
  }
  return value;
}

function validateUtcTime(value, label) {
  validateString(value, (item) => UTC_TIME.test(item), label);
  const date = new Date(value);
  if (!Number.isFinite(date.valueOf()) || date.toISOString() !== value) {
    fail("D2_TYPE_INVALID", label);
  }
  return value;
}

function normalizeProviderTime(value, label) {
  if (typeof value !== "string") fail("D2_TYPE_INVALID", label);
  const date = new Date(value);
  if (!Number.isFinite(date.valueOf())) fail("D2_TYPE_INVALID", label);
  return date.toISOString();
}

function validatePrintable(value, label) {
  return validateString(
    value,
    (item) => Buffer.byteLength(item, "utf8") <= 512 && /^[\x20-\x7e]+$/u.test(item),
    label
  );
}

function validateHttpsUrl(value, label) {
  validateString(value, (item) => Buffer.byteLength(item, "utf8") <= 2048, label);
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    fail("D2_TYPE_INVALID", label);
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.hash) {
    fail("D2_TYPE_INVALID", label);
  }
  return value;
}

function validateRelPath(value, label) {
  return validateString(value, (item) => {
    if (
      item.length === 0 ||
      Buffer.byteLength(item, "utf8") > 512 ||
      isAbsolute(item) ||
      item.includes("\\") ||
      [...item].some((character) => character.codePointAt(0) <= 0x1f || character.codePointAt(0) === 0x7f)
    ) {
      return false;
    }
    return item.split("/").every((segment) => segment && segment !== "." && segment !== "..");
  }, label);
}

function exactKeys(value, keys, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    fail("D2_TYPE_INVALID", label);
  }
  const actual = Object.keys(value);
  for (const key of actual) {
    if (!keys.includes(key)) fail("D2_BUNDLE_UNEXPECTED_FIELD", `${label}.${key}`);
  }
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) fail("D2_BUNDLE_REQUIRED_FIELD_MISSING", `${label}.${key}`);
  }
  if (actual.join("\0") !== keys.join("\0")) fail("D2_ORDER_INVALID", label);
  return value;
}

function exactTuple(value, length, label) {
  if (!Array.isArray(value) || value.length !== length) fail("D2_CARDINALITY_INVALID", label);
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) fail("D2_TYPE_INVALID", `${label}[${index}]`);
  }
  return value;
}

function exactValue(value, expected, label) {
  if (value !== expected) fail("D2_ENUM_INVALID", label);
  return value;
}

function enumValue(value, values, label) {
  if (!values.includes(value)) fail("D2_ENUM_INVALID", label);
  return value;
}

function preflightRawJsonNestingDepth(
  text,
  label,
  maximumDepth = CONFIGURED_MAX_VALID_JSON_NESTING_DEPTH
) {
  let currentDepth = 0;
  let maxObservedDepth = 0;
  let inString = false;
  let escapeActive = false;
  for (let inputOffset = 0; inputOffset < text.length; inputOffset += 1) {
    const character = text[inputOffset];
    if (inString) {
      if (escapeActive) {
        escapeActive = false;
      } else if (character === "\\") {
        escapeActive = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }
    if (character === '"') {
      inString = true;
      continue;
    }
    if (character === "{" || character === "[") {
      currentDepth += 1;
      maxObservedDepth = Math.max(maxObservedDepth, currentDepth);
      if (currentDepth > maximumDepth) {
        fail("D2_TYPE_INVALID", `${label} json nesting depth`);
      }
    } else if ((character === "}" || character === "]") && currentDepth > 0) {
      currentDepth -= 1;
    }
  }
  return maxObservedDepth;
}

function scanJsonForDuplicateKeys(text) {
  let index = 0;
  const whitespace = () => {
    while (index < text.length && /[\t\n\r ]/u.test(text[index])) index += 1;
  };
  const stringToken = () => {
    const start = index;
    if (text[index] !== '"') fail("D2_TYPE_INVALID", "json string");
    index += 1;
    while (index < text.length) {
      if (text[index] === "\\") {
        index += 2;
        continue;
      }
      if (text[index] === '"') {
        index += 1;
        try {
          return JSON.parse(text.slice(start, index));
        } catch {
          fail("D2_TYPE_INVALID", "json string");
        }
      }
      index += 1;
    }
    fail("D2_TYPE_INVALID", "unterminated json string");
  };
  const value = () => {
    whitespace();
    if (text[index] === "{") {
      index += 1;
      whitespace();
      const keys = new Set();
      if (text[index] === "}") {
        index += 1;
        return;
      }
      for (;;) {
        whitespace();
        const key = stringToken();
        if (keys.has(key)) fail("D2_DUPLICATE_ID", `duplicate json key ${key}`);
        keys.add(key);
        whitespace();
        if (text[index] !== ":") fail("D2_TYPE_INVALID", "json colon");
        index += 1;
        value();
        whitespace();
        if (text[index] === "}") {
          index += 1;
          return;
        }
        if (text[index] !== ",") fail("D2_TYPE_INVALID", "json object comma");
        index += 1;
      }
    }
    if (text[index] === "[") {
      index += 1;
      whitespace();
      if (text[index] === "]") {
        index += 1;
        return;
      }
      for (;;) {
        value();
        whitespace();
        if (text[index] === "]") {
          index += 1;
          return;
        }
        if (text[index] !== ",") fail("D2_TYPE_INVALID", "json array comma");
        index += 1;
      }
    }
    if (text[index] === '"') {
      stringToken();
      return;
    }
    const remainder = text.slice(index);
    const match = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/u.exec(remainder);
    if (!match) fail("D2_TYPE_INVALID", "json scalar");
    index += match[0].length;
  };
  value();
  whitespace();
  if (index !== text.length) fail("D2_TYPE_INVALID", "json trailing bytes");
}

function parseJsonBytes(bytes, label, canonical) {
  if (!Buffer.isBuffer(bytes) || bytes.length === 0) fail("D2_TYPE_INVALID", label);
  const text = bytes.toString("utf8");
  if (!Buffer.from(text, "utf8").equals(bytes) || text.charCodeAt(0) === 0xfeff) {
    fail("D2_TYPE_INVALID", `${label} utf8`);
  }
  preflightRawJsonNestingDepth(text, label);
  try {
    scanJsonForDuplicateKeys(text);
  } catch (error) {
    if (error instanceof D2Error) fail(error.code, label);
    throw error;
  }
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    fail("D2_TYPE_INVALID", label);
  }
  if (canonical && !canonicalBytes(value).equals(bytes)) fail("D2_CANONICAL_JSON_INVALID", label);
  return value;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? process.cwd(),
    encoding: null,
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
    shell: false
  });
  if (result.error || result.status !== 0) {
    fail(options.code ?? "D2_TOOL_FAILURE", `${command} ${args.join(" ")}`);
  }
  return Buffer.from(result.stdout ?? Buffer.alloc(0));
}

function readPnpmVersion() {
  if (process.platform !== "win32") {
    const result = spawnSync("pnpm", ["--version"], {
      encoding: null,
      maxBuffer: 1024 * 1024,
      windowsHide: true,
      shell: false
    });
    if (!result.error && result.status === 0) return Buffer.from(result.stdout).toString("utf8").trim();
  }
  const candidates = [];
  const addCandidate = (path) => {
    if (existsSync(path) && lstatSync(path).isFile()) candidates.push(resolve(path));
  };
  const search = (root, depth) => {
    if (depth < 0 || !existsSync(root) || !lstatSync(root).isDirectory()) return;
    for (const name of readdirSync(root)) {
      const path = join(root, name);
      const info = lstatSync(path);
      if (info.isFile() && ["pnpm.cjs", "pnpm.mjs", "pnpm.js"].includes(name)) candidates.push(resolve(path));
      else if (info.isDirectory()) search(path, depth - 1);
    }
  };
  if (process.env.PNPM_HOME) search(process.env.PNPM_HOME, 5);
  for (const directory of (process.env.PATH ?? "").split(process.platform === "win32" ? ";" : ":")) {
    if (!directory) continue;
    addCandidate(join(directory, "node_modules", "pnpm", "bin", "pnpm.cjs"));
    addCandidate(join(directory, "node_modules", "pnpm", "bin", "pnpm.mjs"));
    addCandidate(resolve(directory, "..", "pnpm", "bin", "pnpm.cjs"));
    addCandidate(resolve(directory, "..", "pnpm", "bin", "pnpm.mjs"));
    addCandidate(resolve(directory, "..", "..", "node", "node_modules", "pnpm", "bin", "pnpm.mjs"));
  }
  const unique = [...new Set(candidates)];
  for (const entry of unique) {
    const result = spawnSync(process.execPath, [entry, "--version"], {
      encoding: null,
      maxBuffer: 1024 * 1024,
      windowsHide: true,
      shell: false
    });
    if (!result.error && result.status === 0) return Buffer.from(result.stdout).toString("utf8").trim();
  }
  fail("D2_TOOL_FAILURE", "pnpm --version");
}

function git(args, code = "D2_ANCESTRY_UNPROVABLE") {
  return run("git", args, { code }).toString("utf8").trim();
}

function gitObjectReadable(head) {
  const result = spawnSync("git", ["cat-file", "-e", `${head}^{commit}`], {
    encoding: null,
    windowsHide: true,
    shell: false
  });
  return !result.error && result.status === 0;
}

function gitAncestor(ancestor, descendant) {
  const result = spawnSync("git", ["merge-base", "--is-ancestor", ancestor, descendant], {
    encoding: null,
    windowsHide: true,
    shell: false
  });
  if (result.error || ![0, 1].includes(result.status)) fail("D2_ANCESTRY_UNPROVABLE", ancestor);
  return result.status === 0;
}

function gitParent(head) {
  const value = git(["show", "-s", "--format=%P", head]);
  if (!SHA40.test(value)) fail("D2_ANCESTRY_UNPROVABLE", `${head} parent`);
  return value;
}

function listTree(root, evidenceContext = undefined) {
  const resolvedRoot = resolve(root);
  const rootExists = evidenceContext === undefined
    ? existsSync(resolvedRoot)
    : evidenceFilesystem(
      () => existsSync(resolvedRoot),
      "D2_ARTIFACT_SHA_MISMATCH",
      evidenceContext
    );
  const rootInfo = rootExists
    ? (evidenceContext === undefined
      ? lstatSync(resolvedRoot)
      : evidenceFilesystem(
        () => lstatSync(resolvedRoot),
        "D2_ARTIFACT_SHA_MISMATCH",
        evidenceContext
      ))
    : undefined;
  if (!rootExists || !rootInfo.isDirectory()) {
    fail("D2_ARTIFACT_SHA_MISMATCH", evidenceContext ?? root);
  }
  const files = [];
  const collisions = new Set();
  const visit = (directory) => {
    const names = evidenceContext === undefined
      ? readdirSync(directory)
      : evidenceFilesystem(
        () => readdirSync(directory),
        "D2_ARTIFACT_SHA_MISMATCH",
        evidenceContext
      );
    for (const name of names) {
      const absolute = join(directory, name);
      const info = evidenceContext === undefined
        ? lstatSync(absolute)
        : evidenceFilesystem(
          () => lstatSync(absolute),
          "D2_ARTIFACT_SHA_MISMATCH",
          evidenceContext
        );
      if (info.isSymbolicLink()) {
        fail("D2_ARTIFACT_SHA_MISMATCH", evidenceContext ?? absolute);
      }
      if (info.isDirectory()) {
        visit(absolute);
      } else if (info.isFile()) {
        const path = relative(resolvedRoot, absolute).replaceAll("\\", "/");
        validateRelPath(path, "tree path");
        const collision = path.normalize("NFC").toLowerCase();
        if (collisions.has(collision)) fail("D2_ARTIFACT_SHA_MISMATCH", `path collision ${path}`);
        collisions.add(collision);
        const bytes = evidenceContext === undefined
          ? readFileSync(absolute)
          : evidenceFilesystem(
            () => readFileSync(absolute),
            "D2_ARTIFACT_SHA_MISMATCH",
            evidenceContext
          );
        files.push({ path, absolute, bytes, digest: sha256(bytes) });
      } else {
        fail("D2_ARTIFACT_SHA_MISMATCH", evidenceContext ?? absolute);
      }
    }
  };
  visit(resolvedRoot);
  files.sort((left, right) => Buffer.compare(Buffer.from(left.path), Buffer.from(right.path)));
  const hash = createHash("sha256");
  let byteLength = 0;
  for (const file of files) {
    const pathBytes = Buffer.from(file.path, "utf8");
    const pathLength = Buffer.alloc(4);
    pathLength.writeUInt32BE(pathBytes.length);
    const fileLength = Buffer.alloc(8);
    fileLength.writeBigUInt64BE(BigInt(file.bytes.length));
    hash.update(pathLength).update(pathBytes).update(Buffer.from([0])).update(fileLength);
    hash.update(Buffer.from(file.digest, "hex"));
    byteLength += file.bytes.length;
  }
  return {
    files,
    fileCount: files.length,
    byteLength,
    canonicalTreeSha256: hash.digest("hex")
  };
}

function copyTree(source, destination) {
  const tree = listTree(source);
  mkdirSync(destination, { recursive: true });
  for (const file of tree.files) {
    const target = join(destination, ...file.path.split("/"));
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(file.absolute, target);
  }
  return listTree(destination);
}

function assertCanonicalFile(path, validator, label, evidenceContext = undefined) {
  const bytes = evidenceContext === undefined
    ? readFileSync(path)
    : evidenceFilesystem(
      () => readFileSync(path),
      "D2_REQUIRED_JOB_MISSING",
      evidenceContext
    );
  const value = parseJsonBytes(bytes, label, true);
  validator(value);
  if (!canonicalBytes(value).equals(bytes)) fail("D2_CANONICAL_JSON_INVALID", label);
  return { bytes, value };
}

function validateCaptureGithub(value) {
  exactKeys(value, ["workflowName", "eventName", "runId", "runAttempt", "githubSha", "workflowJobId"], "capture.github");
  exactValue(value.workflowName, "CI", "capture.github.workflowName");
  exactValue(value.eventName, "push", "capture.github.eventName");
  validateDecId(value.runId, "capture.github.runId");
  validateSafeUInt(value.runAttempt, "capture.github.runAttempt", Number.MAX_SAFE_INTEGER, true);
  validateSha40(value.githubSha, "capture.github.githubSha");
  enumValue(value.workflowJobId, ["test-shard", "deterministic-windows"], "capture.github.workflowJobId");
}

function validateCaptureRunner(value) {
  exactKeys(value, ["os", "arch", "imageOs", "imageVersion"], "capture.runner");
  enumValue(value.os, ["Linux", "Windows"], "capture.runner.os");
  exactValue(value.arch, "X64", "capture.runner.arch");
  validatePrintable(value.imageOs, "capture.runner.imageOs");
  validatePrintable(value.imageVersion, "capture.runner.imageVersion");
}

function validateCaptureToolchain(value) {
  exactKeys(value, ["nodeVersion", "pnpmVersion", "vitestVersion"], "capture.toolchain");
  exactValue(value.nodeVersion, "v24.15.0", "capture.toolchain.nodeVersion");
  exactValue(value.pnpmVersion, "11.7.0", "capture.toolchain.pnpmVersion");
  exactValue(value.vitestVersion, "3.2.6", "capture.toolchain.vitestVersion");
}

function validateCaptureInvocation(value) {
  exactKeys(value, ["commandArgv", "mode", "logicalGroupId"], "capture.invocation");
  exactTuple(value.commandArgv, COMMAND_ARGV.length, "capture.invocation.commandArgv");
  COMMAND_ARGV.forEach((item, index) => exactValue(value.commandArgv[index], item, `capture.invocation.commandArgv[${index}]`));
  exactValue(value.mode, "ordinary", "capture.invocation.mode");
  exactValue(value.logicalGroupId, "domain-core-rest", "capture.invocation.logicalGroupId");
}

const ANCESTRY_KEYS = Object.freeze([
  "checkoutHead", "repositoryIsShallow", "sourceObjectReadable", "parentArtifactObjectReadable",
  "parentEvidenceObjectReadable", "settledBaselineObjectReadable", "ruleEvidenceObjectReadable",
  "acceptedProfileSourceObjectReadable", "parentArtifactIsAncestorOfSource",
  "parentEvidenceIsAncestorOfSource", "settledBaselineIsAncestorOfSource",
  "ruleEvidenceIsAncestorOfSource", "acceptedProfileSourceIsReachable",
  "evidenceParentEqualsArtifact", "artifactParentEqualsSettled"
]);

function validateAncestryBody(value, label) {
  exactKeys(value, ANCESTRY_KEYS, label);
  validateSha40(value.checkoutHead, `${label}.checkoutHead`);
  for (const key of ANCESTRY_KEYS.slice(1)) {
    const expected = key === "repositoryIsShallow" ? false : true;
    if (typeof value[key] !== "boolean") fail("D2_TYPE_INVALID", `${label}.${key}`);
    if (value[key] !== expected) fail("D2_ANCESTRY_UNPROVABLE", `${label}.${key}`);
  }
}

function validateCaptureResult(value) {
  exactKeys(value, [
    "startedAtUnixMs", "endedAtUnixMs", "processExitCode", "selectedIdentityCount",
    "selectedIdentitySha256", "failedCount", "skippedCount", "todoCount", "globalErrorCount",
    "manifestRelativePath", "manifestSha256", "verificationRelativePath", "verificationReportSha256"
  ], "capture.result");
  validateSafeUInt(value.startedAtUnixMs, "capture.result.startedAtUnixMs");
  validateSafeUInt(value.endedAtUnixMs, "capture.result.endedAtUnixMs");
  if (value.endedAtUnixMs < value.startedAtUnixMs) fail("D2_TYPE_INVALID", "capture result time order");
  for (const [key, expected] of [["processExitCode", 0], ["selectedIdentityCount", 503], ["failedCount", 0], ["skippedCount", 0], ["todoCount", 0], ["globalErrorCount", 0]]) {
    exactValue(value[key], expected, `capture.result.${key}`);
  }
  validateSha256(value.selectedIdentitySha256, "capture.result.selectedIdentitySha256");
  exactValue(value.manifestRelativePath, "logical-manifest.json", "capture.result.manifestRelativePath");
  validateSha256(value.manifestSha256, "capture.result.manifestSha256");
  exactValue(value.verificationRelativePath, "verification.json", "capture.result.verificationRelativePath");
  validateSha256(value.verificationReportSha256, "capture.result.verificationReportSha256");
}

function validateCaptureRunnerOutput(value) {
  exactKeys(value, ["relativeRoot", "fileCount", "byteLength", "canonicalTreeSha256"], "capture.runnerOutput");
  exactValue(value.relativeRoot, "runner-output", "capture.runnerOutput.relativeRoot");
  validateSafeUInt(value.fileCount, "capture.runnerOutput.fileCount", Number.MAX_SAFE_INTEGER, true);
  validateSafeUInt(value.byteLength, "capture.runnerOutput.byteLength");
  validateSha256(value.canonicalTreeSha256, "capture.runnerOutput.canonicalTreeSha256");
}

function validateCapture(value) {
  exactKeys(value, [
    "schemaVersion", "criterionComponent", "platform", "sourceHead", "parentArtifactHead",
    "parentEvidenceHead", "settledBaselineHead", "ruleEvidenceHead", "acceptedProfileSourceHead",
    "github", "runner", "toolchain", "invocation", "ancestry", "result", "runnerOutput", "captureVerdict"
  ], "capture");
  exactValue(value.schemaVersion, CAPTURE_SCHEMA_VERSION, "capture.schemaVersion");
  exactValue(value.criterionComponent, "D-C16A", "capture.criterionComponent");
  enumValue(value.platform, ["linux", "windows"], "capture.platform");
  validateSha40(value.sourceHead, "capture.sourceHead");
  exactValue(value.parentArtifactHead, PARENT_ARTIFACT_HEAD, "capture.parentArtifactHead");
  exactValue(value.parentEvidenceHead, PARENT_EVIDENCE_HEAD, "capture.parentEvidenceHead");
  exactValue(value.settledBaselineHead, SETTLED_BASELINE_HEAD, "capture.settledBaselineHead");
  exactValue(value.ruleEvidenceHead, RULE_EVIDENCE_HEAD, "capture.ruleEvidenceHead");
  exactValue(value.acceptedProfileSourceHead, ACCEPTED_PROFILE_SOURCE_HEAD, "capture.acceptedProfileSourceHead");
  validateCaptureGithub(value.github);
  validateCaptureRunner(value.runner);
  validateCaptureToolchain(value.toolchain);
  validateCaptureInvocation(value.invocation);
  validateAncestryBody(value.ancestry, "capture.ancestry");
  validateCaptureResult(value.result);
  validateCaptureRunnerOutput(value.runnerOutput);
  exactValue(value.captureVerdict, "D2_CAPTURE_VALID", "capture.captureVerdict");
  const linux = value.platform === "linux";
  if (
    value.github.workflowJobId !== (linux ? "test-shard" : "deterministic-windows") ||
    value.runner.os !== (linux ? "Linux" : "Windows")
  ) {
    fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", "capture platform");
  }
  if (value.sourceHead !== value.github.githubSha || value.sourceHead !== value.ancestry.checkoutHead) {
    fail("D2_SOURCE_HEAD_MISMATCH", "capture source binding");
  }
}

function acquisitionRecord(value, keys, constants, label) {
  exactKeys(value, keys, label);
  for (const [key, expected] of Object.entries(constants)) exactValue(value[key], expected, `${label}.${key}`);
  validateHttpsUrl(value.sourceUrl, `${label}.sourceUrl`);
  validateSafeUInt(value.byteLength, `${label}.byteLength`, Number.MAX_SAFE_INTEGER, true);
  validateSha256(value.sha256, `${label}.sha256`);
}

function validateAcquisitionManifest(value) {
  exactKeys(value, ["schemaVersion", "sourceHead", "acquiredAtUtc", "workflowApi", "jobApis", "artifactsApi", "artifactArchives", "artifactTrees", "jobLogs"], "acquisition");
  validateAcquisitionPlatformMappingPreflight(value);
  exactValue(value.schemaVersion, ACQUISITION_SCHEMA_VERSION, "acquisition.schemaVersion");
  validateSha40(value.sourceHead, "acquisition.sourceHead");
  validateUtcTime(value.acquiredAtUtc, "acquisition.acquiredAtUtc");
  acquisitionRecord(value.workflowApi, ["recordId", "relativePath", "sourceUrl", "byteLength", "sha256"], { recordId: "api-workflow", relativePath: "api/run.json" }, "acquisition.workflowApi");
  exactTuple(value.jobApis, 2, "acquisition.jobApis");
  acquisitionRecord(value.jobApis[0], ["recordId", "jobRef", "relativePath", "sourceUrl", "byteLength", "sha256"], { recordId: "api-job-linux", jobRef: "job-linux", relativePath: "api/jobs/linux.json" }, "acquisition.jobApis[0]");
  acquisitionRecord(value.jobApis[1], ["recordId", "jobRef", "relativePath", "sourceUrl", "byteLength", "sha256"], { recordId: "api-job-windows", jobRef: "job-windows", relativePath: "api/jobs/windows.json" }, "acquisition.jobApis[1]");
  acquisitionRecord(value.artifactsApi, ["recordId", "relativePath", "sourceUrl", "byteLength", "sha256"], { recordId: "api-artifacts", relativePath: "api/artifacts.json" }, "acquisition.artifactsApi");
  exactTuple(value.artifactArchives, 2, "acquisition.artifactArchives");
  acquisitionRecord(value.artifactArchives[0], ["recordId", "jobRef", "relativePath", "sourceUrl", "byteLength", "sha256"], { recordId: "archive-linux", jobRef: "job-linux", relativePath: "downloads/artifacts/linux.zip" }, "acquisition.artifactArchives[0]");
  acquisitionRecord(value.artifactArchives[1], ["recordId", "jobRef", "relativePath", "sourceUrl", "byteLength", "sha256"], { recordId: "archive-windows", jobRef: "job-windows", relativePath: "downloads/artifacts/windows.zip" }, "acquisition.artifactArchives[1]");
  exactTuple(value.artifactTrees, 2, "acquisition.artifactTrees");
  for (const [index, platform] of ["linux", "windows"].entries()) {
    const record = value.artifactTrees[index];
    exactKeys(record, ["recordId", "archiveRef", "relativeRoot", "fileCount", "byteLength", "canonicalTreeSha256"], `acquisition.artifactTrees[${index}]`);
    exactValue(record.recordId, `tree-${platform}`, `acquisition.artifactTrees[${index}].recordId`);
    exactValue(record.archiveRef, `archive-${platform}`, `acquisition.artifactTrees[${index}].archiveRef`);
    exactValue(record.relativeRoot, `artifacts/${platform}`, `acquisition.artifactTrees[${index}].relativeRoot`);
    validateSafeUInt(record.fileCount, `acquisition.artifactTrees[${index}].fileCount`, Number.MAX_SAFE_INTEGER, true);
    validateSafeUInt(record.byteLength, `acquisition.artifactTrees[${index}].byteLength`);
    validateSha256(record.canonicalTreeSha256, `acquisition.artifactTrees[${index}].canonicalTreeSha256`);
  }
  exactTuple(value.jobLogs, 2, "acquisition.jobLogs");
  acquisitionRecord(value.jobLogs[0], ["recordId", "jobRef", "relativePath", "sourceUrl", "byteLength", "sha256"], { recordId: "log-download-linux", jobRef: "job-linux", relativePath: "downloads/logs/linux.bin" }, "acquisition.jobLogs[0]");
  acquisitionRecord(value.jobLogs[1], ["recordId", "jobRef", "relativePath", "sourceUrl", "byteLength", "sha256"], { recordId: "log-download-windows", jobRef: "job-windows", relativePath: "downloads/logs/windows.bin" }, "acquisition.jobLogs[1]");
}

function validateAcquisitionPlatformMappingPreflight(value) {
  const pairs = [
    [value?.jobApis?.[0]?.jobRef, "job-windows"],
    [value?.jobApis?.[1]?.jobRef, "job-linux"],
    [value?.artifactArchives?.[0]?.jobRef, "job-windows"],
    [value?.artifactArchives?.[1]?.jobRef, "job-linux"],
    [value?.artifactTrees?.[0]?.archiveRef, "archive-windows"],
    [value?.artifactTrees?.[1]?.archiveRef, "archive-linux"],
    [value?.jobLogs?.[0]?.jobRef, "job-windows"],
    [value?.jobLogs?.[1]?.jobRef, "job-linux"]
  ];
  if (pairs.some(([actual, opposite]) => actual === opposite)) {
    fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", "acquisition platform reference swap");
  }
}

function verifyAcquisitionFile(root, record) {
  const absolute = resolve(root, ...record.relativePath.split("/"));
  if (!absolute.startsWith(`${resolve(root)}${process.platform === "win32" ? "\\" : "/"}`)) {
    fail("D2_ARTIFACT_SHA_MISMATCH", record.relativePath);
  }
  const bytes = evidenceFilesystem(
    () => readFileSync(absolute),
    "D2_REQUIRED_JOB_MISSING",
    `acquisition-input:${record.relativePath}`
  );
  validateAcquisitionBlob(record, bytes);
  return bytes;
}

function validateAcquisitionBlob(record, bytes) {
  if (bytes.length !== record.byteLength || sha256(bytes) !== record.sha256) {
    fail("D2_ARTIFACT_SHA_MISMATCH", record.relativePath);
  }
}

function enumerateRequiredAcquisitionPaths(
  schema = ACQUISITION_FILESYSTEM_SCHEMA,
  prefix = ""
) {
  const paths = [];
  for (const [name, node] of Object.entries(schema.children)) {
    const path = prefix ? `${prefix}/${name}` : name;
    paths.push(Object.freeze({ path, kind: node.kind }));
    if (node.kind === "directory") {
      paths.push(...enumerateRequiredAcquisitionPaths(node, path));
    }
  }
  return paths;
}

function compareUtf8(left, right) {
  return Buffer.compare(Buffer.from(left, "utf8"), Buffer.from(right, "utf8"));
}

function validateAcquisitionFilesystem(root) {
  const required = enumerateRequiredAcquisitionPaths();
  const requiredSet = new Set(required.map(({ path }) => path));
  const observed = [];
  const missing = [];
  const unexpected = [];
  const wrongKind = [];
  const duplicate = [];
  const logicalPaths = new Map();

  const observe = (path) => {
    observed.push(path);
    const key = path.normalize("NFC").toLowerCase();
    if (logicalPaths.has(key)) duplicate.push(path);
    else logicalPaths.set(key, path);
  };

  const readDirectory = (absolute, logical) =>
    evidenceFilesystem(
      () => readdirSync(absolute),
      "D2_REQUIRED_JOB_MISSING",
      `acquisition-census:${logical || "."}`
    ).sort(compareUtf8);

  const readNode = (absolute, logical) =>
    evidenceFilesystem(
      () => lstatSync(absolute),
      "D2_REQUIRED_JOB_MISSING",
      `acquisition-census:${logical}`
    );

  const walkDynamic = (absolute, logical) => {
    for (const name of readDirectory(absolute, logical)) {
      const path = `${logical}/${name}`;
      observe(path);
      const info = readNode(join(absolute, name), path);
      if (info.isDirectory()) walkDynamic(join(absolute, name), path);
      else if (!info.isFile()) wrongKind.push(path);
    }
  };

  const walk = (absolute, schema, prefix) => {
    let actualNames;
    try {
      actualNames = readDirectory(absolute, prefix);
    } catch (error) {
      if (error instanceof D2Error) {
        for (const { path } of required) {
          if (!prefix || path === prefix || path.startsWith(`${prefix}/`)) {
            missing.push(path);
          }
        }
        return;
      }
      throw error;
    }
    const actualSet = new Set(actualNames);
    for (const [name, node] of Object.entries(schema.children)) {
      const path = prefix ? `${prefix}/${name}` : name;
      if (!actualSet.has(name)) {
        for (const { path: requiredPath } of required) {
          if (requiredPath === path || requiredPath.startsWith(`${path}/`)) {
            missing.push(requiredPath);
          }
        }
        continue;
      }
      observe(path);
      const child = join(absolute, name);
      const info = readNode(child, path);
      const actualKind = info.isFile()
        ? "file"
        : info.isDirectory()
          ? "directory"
          : "other";
      if (actualKind !== node.kind) {
        wrongKind.push(path);
        continue;
      }
      if (node.kind === "directory") walk(child, node, path);
    }
    for (const name of actualNames) {
      if (Object.hasOwn(schema.children, name)) continue;
      const path = prefix ? `${prefix}/${name}` : name;
      observe(path);
      if (!schema.allowAdditionalChildren) {
        unexpected.push(path);
        continue;
      }
      const child = join(absolute, name);
      const info = readNode(child, path);
      if (info.isDirectory()) walkDynamic(child, path);
      else if (!info.isFile()) wrongKind.push(path);
    }
  };

  walk(root, ACQUISITION_FILESYSTEM_SCHEMA, "");
  observed.sort(compareUtf8);
  missing.sort(compareUtf8);
  unexpected.sort(compareUtf8);
  wrongKind.sort(compareUtf8);
  duplicate.sort(compareUtf8);

  const census = Object.freeze({
    acquisitionRootCount: Object.keys(ACQUISITION_FILESYSTEM_SCHEMA.children).length,
    requiredRecursivePathCount: required.length,
    observedRecursivePathCount: observed.length,
    missingRecursivePathCount: new Set(missing).size,
    unexpectedRecursivePathCount: unexpected.length,
    wrongKindPathCount: wrongKind.length,
    duplicatePathCount: duplicate.length,
    requiredPaths: Object.freeze(required),
    observedPaths: Object.freeze(observed)
  });
  if (duplicate.length > 0) {
    fail("D2_DUPLICATE_ID", `acquisition-census:${duplicate[0]}`);
  }
  if (unexpected.length > 0) {
    fail("D2_BUNDLE_UNEXPECTED_FIELD", `acquisition-census:${unexpected[0]}`);
  }
  if (wrongKind.length > 0) {
    fail("D2_TYPE_INVALID", `acquisition-census:${wrongKind[0]}`);
  }
  if (missing.length > 0) {
    fail("D2_REQUIRED_JOB_MISSING", `acquisition-census:${missing[0]}`);
  }
  if (
    requiredSet.size !== required.length ||
    census.missingRecursivePathCount !== 0 ||
    census.unexpectedRecursivePathCount !== 0 ||
    census.wrongKindPathCount !== 0 ||
    census.duplicatePathCount !== 0
  ) {
    fail("D2_INTERNAL_ERROR", "acquisition census invariant");
  }
  return census;
}

function readEnvironment(name) {
  const value = process.env[name];
  if (typeof value !== "string" || value.length === 0) fail("D2_TYPE_INVALID", `environment ${name}`);
  return value;
}

function buildAncestry(sourceHead) {
  const checkoutHead = git(["rev-parse", "HEAD"]);
  const repositoryIsShallow = git(["rev-parse", "--is-shallow-repository"]) === "true";
  const result = {
    checkoutHead,
    repositoryIsShallow,
    sourceObjectReadable: gitObjectReadable(sourceHead),
    parentArtifactObjectReadable: gitObjectReadable(PARENT_ARTIFACT_HEAD),
    parentEvidenceObjectReadable: gitObjectReadable(PARENT_EVIDENCE_HEAD),
    settledBaselineObjectReadable: gitObjectReadable(SETTLED_BASELINE_HEAD),
    ruleEvidenceObjectReadable: gitObjectReadable(RULE_EVIDENCE_HEAD),
    acceptedProfileSourceObjectReadable: gitObjectReadable(ACCEPTED_PROFILE_SOURCE_HEAD),
    parentArtifactIsAncestorOfSource: gitAncestor(PARENT_ARTIFACT_HEAD, sourceHead),
    parentEvidenceIsAncestorOfSource: gitAncestor(PARENT_EVIDENCE_HEAD, sourceHead),
    settledBaselineIsAncestorOfSource: gitAncestor(SETTLED_BASELINE_HEAD, sourceHead),
    ruleEvidenceIsAncestorOfSource: gitAncestor(RULE_EVIDENCE_HEAD, sourceHead),
    acceptedProfileSourceIsReachable: gitAncestor(ACCEPTED_PROFILE_SOURCE_HEAD, sourceHead),
    evidenceParentEqualsArtifact: gitParent(PARENT_EVIDENCE_HEAD) === PARENT_ARTIFACT_HEAD,
    artifactParentEqualsSettled: gitParent(PARENT_ARTIFACT_HEAD) === SETTLED_BASELINE_HEAD
  };
  validateAncestryBody(result, "capture.ancestry");
  return result;
}

function validateRunnerOutput(root) {
  if (resolve(root) !== resolve(".vitest-test/segmented/domain-core-rest")) {
    fail("D2_INVALID_ARGUMENTS", "runner output root");
  }
  const runnerScript = resolve("scripts/run-vitest-logical-group.mjs");
  run(process.execPath, [runnerScript, "verify", "--mode", "ordinary", "--logical-group-id", "domain-core-rest"], { code: "D2_TOOL_FAILURE" });
  const manifestPath = join(root, "logical-manifest.json");
  const verificationPath = join(root, "verification.json");
  const manifestBytes = readFileSync(manifestPath);
  const verificationBytes = readFileSync(verificationPath);
  const manifest = parseJsonBytes(manifestBytes, "logical manifest", true);
  const verification = parseJsonBytes(verificationBytes, "logical verification", true);
  if (
    manifest.schemaVersion !== "botc-vitest-logical-manifest-v1" ||
    manifest.mode !== "ordinary" ||
    manifest.logicalGroupId !== "domain-core-rest" ||
    manifest.mergeEligibility !== true ||
    manifest.evidenceStatus !== "COMPLETE" ||
    !Array.isArray(manifest.selectedIdentities) ||
    manifest.selectedIdentities.length !== 503 ||
    verification.schemaVersion !== "botc-vitest-logical-verification-v1" ||
    verification.mode !== "ordinary" ||
    verification.logicalGroupId !== "domain-core-rest" ||
    verification.result !== "PASS" ||
    !Array.isArray(verification.failureCodes) ||
    verification.failureCodes.length !== 0
  ) {
    fail("D2_TYPE_INVALID", "runner logical evidence");
  }
  const segmentDirectory = join(root, "segment-evidence");
  const segmentFiles = readdirSync(segmentDirectory).filter((name) => name.endsWith(".json"));
  if (segmentFiles.length === 0) fail("D2_TYPE_INVALID", "runner segment evidence");
  let startedAtUnixMs = Number.MAX_SAFE_INTEGER;
  let endedAtUnixMs = 0;
  const counts = { failed: 0, skipped: 0, todo: 0, globalErrors: 0 };
  for (const name of segmentFiles) {
    const segment = parseJsonBytes(readFileSync(join(segmentDirectory, name)), `segment ${name}`, true);
    validateSafeUInt(segment.process?.startedAtUnixMs, `${name}.startedAtUnixMs`);
    validateSafeUInt(segment.process?.endedAtUnixMs, `${name}.endedAtUnixMs`);
    exactValue(segment.process?.exitCode, 0, `${name}.exitCode`);
    const taskCounts = segment.taskEvidence?.counts;
    if (taskCounts === null || typeof taskCounts !== "object") fail("D2_TYPE_INVALID", `${name}.taskEvidence.counts`);
    for (const key of ["failed", "skipped", "todo"]) {
      validateSafeUInt(taskCounts[key], `${name}.${key}`);
      counts[key] += taskCounts[key];
    }
    if (!Array.isArray(segment.globalErrors)) fail("D2_TYPE_INVALID", `${name}.globalErrors`);
    counts.globalErrors += segment.globalErrors.length;
    startedAtUnixMs = Math.min(startedAtUnixMs, segment.process.startedAtUnixMs);
    endedAtUnixMs = Math.max(endedAtUnixMs, segment.process.endedAtUnixMs);
  }
  if (Object.values(counts).some((count) => count !== 0)) fail("D2_TYPE_INVALID", "runner failure counts");
  return {
    manifest,
    manifestBytes,
    verificationBytes,
    startedAtUnixMs,
    endedAtUnixMs,
    counts
  };
}

function parseOptions(argv, expected) {
  if (argv.length !== expected.length * 2) fail("D2_INVALID_ARGUMENTS");
  const options = Object.create(null);
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    if (!expected.includes(key) || Object.hasOwn(options, key) || typeof argv[index + 1] !== "string") {
      fail("D2_INVALID_ARGUMENTS");
    }
    options[key] = argv[index + 1];
  }
  for (const key of expected) if (!Object.hasOwn(options, key)) fail("D2_INVALID_ARGUMENTS");
  return options;
}

function runCaptureRunnerMode(argv) {
  const options = parseOptions(argv, ["--platform", "--source-head", "--parent-artifact-head", "--parent-evidence-head", "--runner-output", "--output"]);
  const platform = enumValue(options["--platform"], ["linux", "windows"], "platform");
  const sourceHead = validateSha40(options["--source-head"], "source head");
  exactValue(options["--parent-artifact-head"], PARENT_ARTIFACT_HEAD, "parent artifact head");
  exactValue(options["--parent-evidence-head"], PARENT_EVIDENCE_HEAD, "parent evidence head");
  exactValue(readEnvironment("GITHUB_WORKFLOW"), "CI", "GITHUB_WORKFLOW");
  exactValue(readEnvironment("GITHUB_EVENT_NAME"), "push", "GITHUB_EVENT_NAME");
  exactValue(readEnvironment("GITHUB_SHA"), sourceHead, "GITHUB_SHA");
  const expectedJob = platform === "linux" ? "test-shard" : "deterministic-windows";
  const expectedOs = platform === "linux" ? "Linux" : "Windows";
  exactValue(readEnvironment("GITHUB_JOB"), expectedJob, "GITHUB_JOB");
  exactValue(readEnvironment("RUNNER_OS"), expectedOs, "RUNNER_OS");
  exactValue(readEnvironment("RUNNER_ARCH"), "X64", "RUNNER_ARCH");
  const runnerRoot = resolve(options["--runner-output"]);
  const output = resolve(options["--output"]);
  if (basename(output) !== "d2-capture.json" || existsSync(dirname(output))) {
    fail("D2_OUTPUT_EXISTS", output);
  }
  const runner = validateRunnerOutput(runnerRoot);
  const ancestry = buildAncestry(sourceHead);
  const pnpmVersion = readPnpmVersion();
  const vitestPackage = JSON.parse(readFileSync(resolve("node_modules/vitest/package.json"), "utf8"));
  const artifactRoot = dirname(output);
  try {
    mkdirSync(artifactRoot, { recursive: true });
    const copiedTree = copyTree(runnerRoot, join(artifactRoot, "runner-output"));
    const capture = {
      schemaVersion: CAPTURE_SCHEMA_VERSION,
      criterionComponent: "D-C16A",
      platform,
      sourceHead,
      parentArtifactHead: PARENT_ARTIFACT_HEAD,
      parentEvidenceHead: PARENT_EVIDENCE_HEAD,
      settledBaselineHead: SETTLED_BASELINE_HEAD,
      ruleEvidenceHead: RULE_EVIDENCE_HEAD,
      acceptedProfileSourceHead: ACCEPTED_PROFILE_SOURCE_HEAD,
      github: {
        workflowName: "CI",
        eventName: "push",
        runId: validateDecId(readEnvironment("GITHUB_RUN_ID"), "GITHUB_RUN_ID"),
        runAttempt: Number.parseInt(readEnvironment("GITHUB_RUN_ATTEMPT"), 10),
        githubSha: sourceHead,
        workflowJobId: expectedJob
      },
      runner: {
        os: expectedOs,
        arch: "X64",
        imageOs: validatePrintable(readEnvironment("ImageOS"), "ImageOS"),
        imageVersion: validatePrintable(readEnvironment("ImageVersion"), "ImageVersion")
      },
      toolchain: { nodeVersion: process.version, pnpmVersion, vitestVersion: vitestPackage.version },
      invocation: { commandArgv: [...COMMAND_ARGV], mode: "ordinary", logicalGroupId: "domain-core-rest" },
      ancestry,
      result: {
        startedAtUnixMs: runner.startedAtUnixMs,
        endedAtUnixMs: runner.endedAtUnixMs,
        processExitCode: 0,
        selectedIdentityCount: 503,
        selectedIdentitySha256: sha256(Buffer.from(`${JSON.stringify(runner.manifest.selectedIdentities)}\n`, "utf8")),
        failedCount: 0,
        skippedCount: 0,
        todoCount: 0,
        globalErrorCount: 0,
        manifestRelativePath: "logical-manifest.json",
        manifestSha256: sha256(runner.manifestBytes),
        verificationRelativePath: "verification.json",
        verificationReportSha256: sha256(runner.verificationBytes)
      },
      runnerOutput: {
        relativeRoot: "runner-output",
        fileCount: copiedTree.fileCount,
        byteLength: copiedTree.byteLength,
        canonicalTreeSha256: copiedTree.canonicalTreeSha256
      },
      captureVerdict: "D2_CAPTURE_VALID"
    };
    validateCapture(capture);
    const bytes = canonicalBytes(capture);
    const descriptor = openSync(output, "wx");
    try {
      writeSync(descriptor, bytes);
      fsyncSync(descriptor);
    } finally {
      closeSync(descriptor);
    }
    const finalEntries = readdirSync(artifactRoot).sort();
    if (finalEntries.join("\0") !== ["d2-capture.json", "runner-output"].sort().join("\0")) {
      fail("D2_BUNDLE_UNEXPECTED_FIELD", "artifact root");
    }
    process.stdout.write(`D2_CAPTURE_OK ${platform} ${sourceHead} ${sha256(bytes)}\n`);
  } catch (error) {
    rmSync(artifactRoot, { recursive: true, force: true });
    throw error;
  }
}

const D16_EXPECTED = Object.freeze([
  Object.freeze({
    CriterionId: "D-C16",
    RuleClaim: "D2 public publication evidence grouping",
    CompletionCriterion: "D-C16A and D-C16B both PASS for the same sourceHead",
    RequiredEvidenceMechanism: "GROUPING_ONLY",
    ExpectedReachability: "R4_FUTURE_HYPOTHETICAL_STATE",
    ExpectedTrust: "T1_EXTERNAL_OR_PERSISTED_BOUNDARY",
    ExpectedPrimaryLayer: "NONE",
    ExpectedResult: "Both child criteria PASS atomically; no third primary",
    SupportingAuthorityRequirement: "NONE"
  }),
  Object.freeze({
    CriterionId: "D-C16A",
    RuleClaim: "One exact-H push run supplies Linux and Windows ordinary domain-core-rest publication evidence",
    CompletionCriterion: "One successful runId/runAttempt binds exact H, two required jobs, two captures, two artifacts, two raw job logs, complete ancestry, and identical 503-test identity SHA",
    RequiredEvidenceMechanism: "CROSS_PLATFORM_CI",
    ExpectedReachability: "R4_FUTURE_HYPOTHETICAL_STATE",
    ExpectedTrust: "T1_EXTERNAL_OR_PERSISTED_BOUNDARY",
    ExpectedPrimaryLayer: "CROSS_PLATFORM_CI",
    ExpectedResult: "The same successful push run proves both platform components without stale, partial, cross-swapped, or mixed-attempt evidence",
    SupportingAuthorityRequirement: "NONE"
  }),
  Object.freeze({
    CriterionId: "D-C16B",
    RuleClaim: "One offline T1 verifier validates and atomically issues the closed recursive D2 publication evidence bundle",
    CompletionCriterion: "The verifier accepts exact canonical capture, acquisition, Git/API/artifact/log bindings, recursive schema, reference graph, expected/actual mappings, catalog support facts, and D3 handoff, then atomically writes one bundle",
    RequiredEvidenceMechanism: "STRUCTURAL_VALIDATION",
    ExpectedReachability: "R4_FUTURE_HYPOTHETICAL_STATE",
    ExpectedTrust: "T1_EXTERNAL_OR_PERSISTED_BOUNDARY",
    ExpectedPrimaryLayer: "STRUCTURAL_VALIDATION",
    ExpectedResult: "One canonical bundle is issued only after all checks PASS; every malformed or failed input leaves no bundle and no Actual record",
    SupportingAuthorityRequirement: "NONE"
  })
]);

const EXPECTED_BINDING_KEYS = Object.freeze([
  "CriterionId", "RuleClaim", "CompletionCriterion", "RequiredEvidenceMechanism",
  "ExpectedReachability", "ExpectedTrust", "ExpectedPrimaryLayer", "ExpectedResult",
  "SupportingAuthorityRequirement"
]);
const ACTUAL_BINDING_KEYS = Object.freeze([
  "CriterionId", "ActualTestFile", "ActualTestTitle", "ActualPrimaryLayer",
  "ActualReachability", "ActualTrust", "SupportingAuthorityId", "MechanismMatch"
]);
function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function validateExpectedBinding(value, expected, label) {
  exactKeys(value, EXPECTED_BINDING_KEYS, label);
  for (const key of EXPECTED_BINDING_KEYS) exactValue(value[key], expected[key], `${label}.${key}`);
}

function constructIssuedActualBindings(bundle, instrumentation) {
  if (instrumentation !== undefined) {
    instrumentation.actualBuilderCalls += 1;
    instrumentation.actualRecordsConstructed += 2;
  }
  return [
    {
      CriterionId: "D-C16A",
      ActualTestFile: ".github/workflows/ci.yml",
      ActualTestTitle: `D-C16A GitHub push run ${bundle.workflow.runId}/${bundle.workflow.runAttempt} at ${bundle.sourceHead}: linux+windows domain-core-rest 503/503`,
      ActualPrimaryLayer: "CROSS_PLATFORM_CI",
      ActualReachability: "R4_FUTURE_HYPOTHETICAL_STATE",
      ActualTrust: "T1_EXTERNAL_OR_PERSISTED_BOUNDARY",
      SupportingAuthorityId: "NONE",
      MechanismMatch: "PASS"
    },
    {
      CriterionId: "D-C16B",
      ActualTestFile: "scripts/verify-p2f1r-d2-publication-evidence.mjs",
      ActualTestTitle: `D-C16B audit-bundle at ${bundle.sourceHead}: ${BUNDLE_SCHEMA_VERSION}`,
      ActualPrimaryLayer: "STRUCTURAL_VALIDATION",
      ActualReachability: "R4_FUTURE_HYPOTHETICAL_STATE",
      ActualTrust: "T1_EXTERNAL_OR_PERSISTED_BOUNDARY",
      SupportingAuthorityId: "NONE",
      MechanismMatch: "PASS"
    }
  ];
}

function expectedActualValue(criterionId, key, sourceHead, runId, runAttempt) {
  const common = {
    ActualReachability: "R4_FUTURE_HYPOTHETICAL_STATE",
    ActualTrust: "T1_EXTERNAL_OR_PERSISTED_BOUNDARY",
    SupportingAuthorityId: "NONE",
    MechanismMatch: "PASS"
  };
  if (Object.hasOwn(common, key)) return common[key];
  if (criterionId === "D-C16A") {
    if (key === "CriterionId") return "D-C16A";
    if (key === "ActualTestFile") return ".github/workflows/ci.yml";
    if (key === "ActualTestTitle") return `D-C16A GitHub push run ${runId}/${runAttempt} at ${sourceHead}: linux+windows domain-core-rest 503/503`;
    if (key === "ActualPrimaryLayer") return "CROSS_PLATFORM_CI";
  } else {
    if (key === "CriterionId") return "D-C16B";
    if (key === "ActualTestFile") return "scripts/verify-p2f1r-d2-publication-evidence.mjs";
    if (key === "ActualTestTitle") return `D-C16B audit-bundle at ${sourceHead}: ${BUNDLE_SCHEMA_VERSION}`;
    if (key === "ActualPrimaryLayer") return "STRUCTURAL_VALIDATION";
  }
  fail("D2_INTERNAL_ERROR", `unknown Actual field ${criterionId}.${key}`);
}

function validateActualBinding(value, criterionId, sourceHead, runId, runAttempt, label) {
  exactKeys(value, ACTUAL_BINDING_KEYS, label);
  validateRelPath(value.ActualTestFile, `${label}.ActualTestFile`);
  validatePrintable(value.ActualTestTitle, `${label}.ActualTestTitle`);
  enumValue(value.MechanismMatch, ["PASS", "FAIL"], `${label}.MechanismMatch`);
  for (const key of ACTUAL_BINDING_KEYS) {
    if (value[key] !== expectedActualValue(criterionId, key, sourceHead, runId, runAttempt)) {
      fail("D2_ACTUAL_BINDING_INVALID", `${label}.${key}`);
    }
  }
}

function validateWorkflow(value) {
  exactKeys(value, ["recordId", "workflowName", "event", "runId", "runAttempt", "headSha", "status", "conclusion", "htmlUrl", "createdAtUtc", "updatedAtUtc"], "bundle.workflow");
  exactValue(value.recordId, "workflow-ci-push", "bundle.workflow.recordId");
  exactValue(value.workflowName, "CI", "bundle.workflow.workflowName");
  exactValue(value.event, "push", "bundle.workflow.event");
  validateDecId(value.runId, "bundle.workflow.runId");
  validateSafeUInt(value.runAttempt, "bundle.workflow.runAttempt", Number.MAX_SAFE_INTEGER, true);
  validateSha40(value.headSha, "bundle.workflow.headSha");
  exactValue(value.status, "completed", "bundle.workflow.status");
  exactValue(value.conclusion, "success", "bundle.workflow.conclusion");
  validateHttpsUrl(value.htmlUrl, "bundle.workflow.htmlUrl");
  validateUtcTime(value.createdAtUtc, "bundle.workflow.createdAtUtc");
  validateUtcTime(value.updatedAtUtc, "bundle.workflow.updatedAtUtc");
  if (value.updatedAtUtc < value.createdAtUtc) fail("D2_TYPE_INVALID", "workflow time order");
}

function validateBundleAncestry(value) {
  exactKeys(value, ["recordId", "settledBaselineHead", "ruleEvidenceHead", "acceptedProfileSourceHead", "components"], "bundle.ancestry");
  exactValue(value.recordId, "ancestry-proof", "bundle.ancestry.recordId");
  exactValue(value.settledBaselineHead, SETTLED_BASELINE_HEAD, "bundle.ancestry.settledBaselineHead");
  exactValue(value.ruleEvidenceHead, RULE_EVIDENCE_HEAD, "bundle.ancestry.ruleEvidenceHead");
  exactValue(value.acceptedProfileSourceHead, ACCEPTED_PROFILE_SOURCE_HEAD, "bundle.ancestry.acceptedProfileSourceHead");
  exactTuple(value.components, 2, "bundle.ancestry.components");
  for (const [index, platform] of ["linux", "windows"].entries()) {
    const component = value.components[index];
    exactKeys(component, ["recordId", "jobRef", "platform", "checkoutHead", "githubSha", ...ANCESTRY_KEYS.slice(1)], `bundle.ancestry.components[${index}]`);
    exactValue(component.recordId, `ancestry-${platform}`, `bundle.ancestry.components[${index}].recordId`);
    exactValue(component.jobRef, `job-${platform}`, `bundle.ancestry.components[${index}].jobRef`);
    exactValue(component.platform, platform, `bundle.ancestry.components[${index}].platform`);
    validateAncestryBody(Object.fromEntries(ANCESTRY_KEYS.map((key) => [key, component[key]])), `bundle.ancestry.components[${index}].body`);
    validateSha40(component.githubSha, `bundle.ancestry.components[${index}].githubSha`);
  }
}

const JOB_KEYS = Object.freeze([
  "recordId", "workflowRef", "workflowJobId", "providerDisplayName", "jobDatabaseId", "platform",
  "runnerOs", "runnerArch", "imageOs", "imageVersion", "nodeVersion", "pnpmVersion",
  "vitestVersion", "commandArgv", "startedAtUtc", "completedAtUtc", "processStartedAtUnixMs",
  "processEndedAtUnixMs", "conclusion", "processExitCode", "logicalGroupId", "mode",
  "selectedIdentityCount", "selectedIdentitySha256", "failedCount", "skippedCount", "todoCount",
  "globalErrorCount", "manifestSha256", "verificationReportSha256", "captureSha256", "artifactRef", "logRef"
]);

function validateJob(value, platform) {
  const label = `bundle.job.${platform}`;
  exactKeys(value, JOB_KEYS, label);
  const linux = platform === "linux";
  exactValue(value.recordId, `job-${platform}`, `${label}.recordId`);
  exactValue(value.workflowRef, "workflow-ci-push", `${label}.workflowRef`);
  exactValue(value.workflowJobId, linux ? "test-shard" : "deterministic-windows", `${label}.workflowJobId`);
  validatePrintable(value.providerDisplayName, `${label}.providerDisplayName`);
  validateDecId(value.jobDatabaseId, `${label}.jobDatabaseId`);
  exactValue(value.platform, platform, `${label}.platform`);
  exactValue(value.runnerOs, linux ? "Linux" : "Windows", `${label}.runnerOs`);
  exactValue(value.runnerArch, "X64", `${label}.runnerArch`);
  validatePrintable(value.imageOs, `${label}.imageOs`);
  validatePrintable(value.imageVersion, `${label}.imageVersion`);
  exactValue(value.nodeVersion, "v24.15.0", `${label}.nodeVersion`);
  exactValue(value.pnpmVersion, "11.7.0", `${label}.pnpmVersion`);
  exactValue(value.vitestVersion, "3.2.6", `${label}.vitestVersion`);
  exactTuple(value.commandArgv, COMMAND_ARGV.length, `${label}.commandArgv`);
  COMMAND_ARGV.forEach((item, index) => exactValue(value.commandArgv[index], item, `${label}.commandArgv[${index}]`));
  validateUtcTime(value.startedAtUtc, `${label}.startedAtUtc`);
  validateUtcTime(value.completedAtUtc, `${label}.completedAtUtc`);
  if (value.completedAtUtc < value.startedAtUtc) fail("D2_TYPE_INVALID", `${label} time order`);
  validateSafeUInt(value.processStartedAtUnixMs, `${label}.processStartedAtUnixMs`);
  validateSafeUInt(value.processEndedAtUnixMs, `${label}.processEndedAtUnixMs`);
  if (value.processEndedAtUnixMs < value.processStartedAtUnixMs) fail("D2_TYPE_INVALID", `${label} process time order`);
  exactValue(value.conclusion, "success", `${label}.conclusion`);
  for (const [key, expected] of [["processExitCode", 0], ["selectedIdentityCount", 503], ["failedCount", 0], ["skippedCount", 0], ["todoCount", 0], ["globalErrorCount", 0]]) exactValue(value[key], expected, `${label}.${key}`);
  exactValue(value.logicalGroupId, "domain-core-rest", `${label}.logicalGroupId`);
  exactValue(value.mode, "ordinary", `${label}.mode`);
  for (const key of ["selectedIdentitySha256", "manifestSha256", "verificationReportSha256", "captureSha256"]) validateSha256(value[key], `${label}.${key}`);
  exactValue(value.artifactRef, `artifact-${platform}`, `${label}.artifactRef`);
  exactValue(value.logRef, `log-${platform}`, `${label}.logRef`);
}

function validateArtifact(value, platform, sourceHead) {
  const label = `bundle.artifact.${platform}`;
  exactKeys(value, ["recordId", "jobRef", "artifactId", "name", "sourceHead", "retentionDays", "expiresAtUtc", "sizeInBytes", "downloadedFileCount", "downloadedTreeSha256", "captureFileSha256"], label);
  exactValue(value.recordId, `artifact-${platform}`, `${label}.recordId`);
  exactValue(value.jobRef, `job-${platform}`, `${label}.jobRef`);
  validateDecId(value.artifactId, `${label}.artifactId`);
  exactValue(value.name, `d2-${platform}-domain-core-rest-${sourceHead}`, `${label}.name`);
  exactValue(value.sourceHead, sourceHead, `${label}.sourceHead`);
  exactValue(value.retentionDays, 7, `${label}.retentionDays`);
  validateUtcTime(value.expiresAtUtc, `${label}.expiresAtUtc`);
  validateSafeUInt(value.sizeInBytes, `${label}.sizeInBytes`, Number.MAX_SAFE_INTEGER, true);
  validateSafeUInt(value.downloadedFileCount, `${label}.downloadedFileCount`, Number.MAX_SAFE_INTEGER, true);
  validateSha256(value.downloadedTreeSha256, `${label}.downloadedTreeSha256`);
  validateSha256(value.captureFileSha256, `${label}.captureFileSha256`);
}

function validateLog(value, platform) {
  const label = `bundle.log.${platform}`;
  exactKeys(value, ["recordId", "jobRef", "jobDatabaseId", "downloadUrl", "byteLength", "downloadedBlobSha256"], label);
  exactValue(value.recordId, `log-${platform}`, `${label}.recordId`);
  exactValue(value.jobRef, `job-${platform}`, `${label}.jobRef`);
  validateDecId(value.jobDatabaseId, `${label}.jobDatabaseId`);
  validateHttpsUrl(value.downloadUrl, `${label}.downloadUrl`);
  validateSafeUInt(value.byteLength, `${label}.byteLength`, Number.MAX_SAFE_INTEGER, true);
  validateSha256(value.downloadedBlobSha256, `${label}.downloadedBlobSha256`);
}

function validateCatalogReconciliation(value) {
  exactKeys(value, ["recordId", "path", "blobOid", "rawLength", "rawSha256", "lfCount", "windowsCheckoutLength", "windowsCheckoutSha256", "classification", "runtimeAuthority"], "bundle.catalogReconciliation");
  const expected = {
    recordId: "catalog-support",
    path: CATALOG_PATH,
    blobOid: "4f9a376e56f19b241d76ce2a75be83b70859ae25",
    rawLength: 264855,
    rawSha256: "e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6",
    lfCount: 626,
    windowsCheckoutLength: 265481,
    windowsCheckoutSha256: "7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7",
    classification: "LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY",
    runtimeAuthority: false
  };
  for (const [key, expectedValue] of Object.entries(expected)) exactValue(value[key], expectedValue, `bundle.catalogReconciliation.${key}`);
}

function validateD3Handoff(value) {
  exactKeys(value, ["recordId", "designAuthorityPath", "designAuthorityCommit", "designAuthorityBlobSha256", "sourceHeadRef", "parentArtifactHeadRef", "parentEvidenceHeadRef", "workflowRef", "jobRefs", "artifactRefs", "logRefs", "bundleRef", "archiveCategories", "deleteAfterD3Categories", "keepOperationalAssetCount", "cleanupRequired"], "bundle.d3Handoff");
  exactValue(value.recordId, "d3-handoff", "bundle.d3Handoff.recordId");
  validateRelPath(value.designAuthorityPath, "bundle.d3Handoff.designAuthorityPath");
  if (value.designAuthorityPath !== DESIGN_PATH) {
    fail("D2_ACTUAL_BINDING_INVALID", "bundle.d3Handoff.designAuthorityPath");
  }
  validateSha40(value.designAuthorityCommit, "bundle.d3Handoff.designAuthorityCommit");
  validateSha256(value.designAuthorityBlobSha256, "bundle.d3Handoff.designAuthorityBlobSha256");
  for (const [key, expected] of [["sourceHeadRef", "source-head"], ["parentArtifactHeadRef", "parent-artifact-head"], ["parentEvidenceHeadRef", "parent-evidence-head"], ["workflowRef", "workflow-ci-push"], ["bundleRef", "d2-final-bundle"]]) exactValue(value[key], expected, `bundle.d3Handoff.${key}`);
  for (const [key, expected] of [["jobRefs", ["job-linux", "job-windows"]], ["artifactRefs", ["artifact-linux", "artifact-windows"]], ["logRefs", ["log-linux", "log-windows"]], ["archiveCategories", ["E2_FINAL_EVIDENCE_BUNDLE", "H_SOURCE_STATUS_RECORD", "FINAL_CODE_REVIEW_VERBATIM", "FINAL_RULE_REVIEW_VERBATIM"]], ["deleteAfterD3Categories", ["TEMPORARY_VERIFIER", "D2_WORKFLOW_STEPS_AND_CHECKOUT_DELTAS", "TEMPORARY_D2_BRANCH", "LOCAL_DOWNLOADED_ARTIFACTS", "RAW_JOB_LOGS", "TEMPORARY_WORKTREES", "ACQUISITION_ROOT_AND_MANIFEST", "SELF_TEST_NEGATIVE_FIXTURES"]]]) {
    exactTuple(value[key], expected.length, `bundle.d3Handoff.${key}`);
    expected.forEach((item, index) => exactValue(value[key][index], item, `bundle.d3Handoff.${key}[${index}]`));
  }
  exactValue(value.keepOperationalAssetCount, 0, "bundle.d3Handoff.keepOperationalAssetCount");
  exactValue(value.cleanupRequired, true, "bundle.d3Handoff.cleanupRequired");
}

const BUNDLE_DRAFT_KEYS = Object.freeze([
  "schemaVersion", "sourceHead", "parentArtifactHead", "parentEvidenceHead", "workflow",
  "ancestry", "jobs", "artifacts", "logs", "retention", "catalogReconciliation",
  "designExpectedBindings", "d3Handoff", "finalStructuralVerdict"
]);
const BUNDLE_ISSUED_KEYS = Object.freeze([
  ...BUNDLE_DRAFT_KEYS.slice(0, 12), "actualBindings", ...BUNDLE_DRAFT_KEYS.slice(12)
]);

function validateBundleShape(value, issued) {
  exactKeys(value, issued ? BUNDLE_ISSUED_KEYS : BUNDLE_DRAFT_KEYS, "bundle");
  exactValue(value.schemaVersion, BUNDLE_SCHEMA_VERSION, "bundle.schemaVersion");
  validateSha40(value.sourceHead, "bundle.sourceHead");
  exactValue(value.parentArtifactHead, PARENT_ARTIFACT_HEAD, "bundle.parentArtifactHead");
  exactValue(value.parentEvidenceHead, PARENT_EVIDENCE_HEAD, "bundle.parentEvidenceHead");
  validateWorkflow(value.workflow);
  validateBundleAncestry(value.ancestry);
  exactTuple(value.jobs, 2, "bundle.jobs");
  validateJob(value.jobs[0], "linux");
  validateJob(value.jobs[1], "windows");
  exactTuple(value.artifacts, 2, "bundle.artifacts");
  validateArtifact(value.artifacts[0], "linux", value.sourceHead);
  validateArtifact(value.artifacts[1], "windows", value.sourceHead);
  exactTuple(value.logs, 2, "bundle.logs");
  validateLog(value.logs[0], "linux");
  validateLog(value.logs[1], "windows");
  exactKeys(value.retention, ["policy", "retentionDays", "hostedAvailability", "historicalBinding"], "bundle.retention");
  exactValue(value.retention.policy, "GITHUB_ACTIONS_ARTIFACT_RETENTION", "bundle.retention.policy");
  exactValue(value.retention.retentionDays, 7, "bundle.retention.retentionDays");
  exactValue(value.retention.hostedAvailability, "EXPIRES_AFTER_RETENTION", "bundle.retention.hostedAvailability");
  exactValue(value.retention.historicalBinding, "HASH_REMAINS_AFTER_EXPIRY", "bundle.retention.historicalBinding");
  validateCatalogReconciliation(value.catalogReconciliation);
  exactTuple(value.designExpectedBindings, 3, "bundle.designExpectedBindings");
  D16_EXPECTED.forEach((expected, index) => validateExpectedBinding(value.designExpectedBindings[index], expected, `bundle.designExpectedBindings[${index}]`));
  if (issued) {
    exactTuple(value.actualBindings, 2, "bundle.actualBindings");
    if (
      value.actualBindings.every((item) => item !== null && typeof item === "object") &&
      new Set(value.actualBindings.map((item) => item.CriterionId)).size !== 2
    ) {
      fail("D2_CARDINALITY_INVALID", "bundle.actualBindings criteria");
    }
    validateActualBinding(value.actualBindings[0], "D-C16A", value.sourceHead, value.workflow.runId, value.workflow.runAttempt, "bundle.actualBindings[0]");
    validateActualBinding(value.actualBindings[1], "D-C16B", value.sourceHead, value.workflow.runId, value.workflow.runAttempt, "bundle.actualBindings[1]");
  }
  validateD3Handoff(value.d3Handoff);
  exactValue(value.finalStructuralVerdict, "D2_PUBLICATION_EVIDENCE_BUNDLE_VALID", "bundle.finalStructuralVerdict");
}

function validateBundleDraft(value) {
  validateBundleShape(value, false);
}

function validateIssuedBundle(value) {
  validateSourceHeadPreflight(value);
  validateRecordGraphPreflight(value);
  validatePlatformMappingPreflight(value);
  validateBundleShape(value, true);
  validateD16BRelations(value);
  if (value.actualBindings.some((item) => item.MechanismMatch !== "PASS")) {
    fail("D2_ACTUAL_BINDING_INVALID", "MechanismMatch");
  }
}

function validateD16A(bundle, captures) {
  exactTuple(captures, 2, "captures");
  exactTuple(bundle.jobs, 2, "bundle.jobs");
  exactTuple(bundle.artifacts, 2, "bundle.artifacts");
  exactTuple(bundle.logs, 2, "bundle.logs");
  exactTuple(bundle.ancestry.components, 2, "bundle.ancestry.components");
  if (bundle.sourceHead !== bundle.workflow.headSha) fail("D2_SOURCE_HEAD_MISMATCH", "workflow head");
  for (const [index, platform] of ["linux", "windows"].entries()) {
    const capture = captures[index];
    const job = bundle.jobs[index];
    const artifact = bundle.artifacts[index];
    const log = bundle.logs[index];
    const ancestry = bundle.ancestry.components[index];
    if (
      capture.platform !== platform ||
      capture.sourceHead !== bundle.sourceHead ||
      capture.github.runId !== bundle.workflow.runId ||
      capture.github.runAttempt !== bundle.workflow.runAttempt ||
      job.platform !== platform ||
      artifact.jobRef !== job.recordId ||
      log.jobRef !== job.recordId ||
      ancestry.jobRef !== job.recordId ||
      ancestry.platform !== platform ||
      job.workflowJobId !== capture.github.workflowJobId ||
      job.runnerOs !== capture.runner.os ||
      job.logicalGroupId !== capture.invocation.logicalGroupId ||
      (platform === "linux" && capture.github.workflowJobId !== "test-shard") ||
      (platform === "windows" && capture.github.workflowJobId !== "deterministic-windows") ||
      (platform === "linux" && capture.invocation.logicalGroupId !== "domain-core-rest") ||
      (platform === "windows" && capture.invocation.logicalGroupId !== "domain-core-rest")
    ) {
      fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", platform);
    }
    if (job.jobDatabaseId !== log.jobDatabaseId || !sameJson(Object.fromEntries(ANCESTRY_KEYS.map((key) => [key, ancestry[key]])), capture.ancestry)) {
      fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", `${platform} evidence binding`);
    }
    if (job.selectedIdentityCount !== 503) fail("D2_ARTIFACT_SHA_MISMATCH", `${platform} identity count`);
    validateArtifactHash(job.selectedIdentitySha256, capture.result.selectedIdentitySha256, `${platform} identity hash`);
    validateArtifactHash(job.manifestSha256, capture.result.manifestSha256, `${platform} manifest hash`);
    validateArtifactHash(job.verificationReportSha256, capture.result.verificationReportSha256, `${platform} verification hash`);
    validateArtifactHash(job.captureSha256, artifact.captureFileSha256, `${platform} capture hash`);
  }
  validateArtifactHash(bundle.jobs[0].selectedIdentitySha256, bundle.jobs[1].selectedIdentitySha256, "cross-platform identity hash");
  const created = Date.parse(bundle.workflow.createdAtUtc);
  const updated = Date.parse(bundle.workflow.updatedAtUtc);
  for (const job of bundle.jobs) {
    if (Date.parse(job.startedAtUtc) < created || Date.parse(job.completedAtUtc) > updated) {
      fail("D2_TYPE_INVALID", "job workflow time range");
    }
  }
  for (const artifact of bundle.artifacts) {
    if (Date.parse(artifact.expiresAtUtc) <= Date.parse(bundle.jobs.find((job) => job.recordId === artifact.jobRef).completedAtUtc)) {
      fail("D2_TYPE_INVALID", "artifact expiry");
    }
  }
}

function validateD16B(bundle) {
  validateSourceHeadPreflight(bundle);
  validateRecordGraphPreflight(bundle);
  validatePlatformMappingPreflight(bundle);
  validateBundleDraft(bundle);
  validateD16BRelations(bundle);
}

function validateD16BRelations(bundle) {
  if (bundle.sourceHead !== bundle.workflow.headSha) fail("D2_SOURCE_HEAD_MISMATCH", "bundle workflow head");
  for (const [index, platform] of ["linux", "windows"].entries()) {
    const ancestry = bundle.ancestry.components[index];
    const job = bundle.jobs[index];
    const artifact = bundle.artifacts[index];
    const log = bundle.logs[index];
    if (ancestry.checkoutHead !== bundle.sourceHead || ancestry.githubSha !== bundle.sourceHead) fail("D2_SOURCE_HEAD_MISMATCH", `${platform} ancestry head`);
    if (job.recordId !== `job-${platform}` || job.artifactRef !== artifact.recordId || job.logRef !== log.recordId || artifact.jobRef !== job.recordId || log.jobRef !== job.recordId || job.jobDatabaseId !== log.jobDatabaseId) fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", `${platform} reference graph`);
    if (artifact.sourceHead !== bundle.sourceHead) fail("D2_ARTIFACT_SHA_MISMATCH", `${platform} artifact source binding`);
    validateArtifactHash(job.captureSha256, artifact.captureFileSha256, `${platform} artifact capture binding`);
  }
  const ids = [bundle.workflow.recordId, bundle.ancestry.recordId, ...bundle.ancestry.components.map((item) => item.recordId), ...bundle.jobs.map((item) => item.recordId), ...bundle.artifacts.map((item) => item.recordId), ...bundle.logs.map((item) => item.recordId), bundle.catalogReconciliation.recordId, bundle.d3Handoff.recordId];
  if (new Set(ids).size !== ids.length) fail("D2_DUPLICATE_ID", "bundle record ids");
  const targets = new Set(["source-head", "parent-artifact-head", "parent-evidence-head", "workflow-ci-push", "job-linux", "job-windows", "artifact-linux", "artifact-windows", "log-linux", "log-windows", "d2-final-bundle"]);
  const refs = [bundle.d3Handoff.sourceHeadRef, bundle.d3Handoff.parentArtifactHeadRef, bundle.d3Handoff.parentEvidenceHeadRef, bundle.d3Handoff.workflowRef, ...bundle.d3Handoff.jobRefs, ...bundle.d3Handoff.artifactRefs, ...bundle.d3Handoff.logRefs, bundle.d3Handoff.bundleRef];
  if (refs.length !== targets.size || new Set(refs).size !== refs.length || refs.some((item) => !targets.has(item))) fail("D2_DANGLING_REF", "d3 handoff refs");
}

function validateSourceHeadPreflight(bundle) {
  const sourceHead = bundle?.sourceHead;
  if (!SHA40.test(sourceHead ?? "")) return;
  const directLeaves = [bundle.workflow?.headSha];
  const checkoutPairs = [];
  for (const component of Array.isArray(bundle.ancestry?.components) ? bundle.ancestry.components : []) {
    const checkout = component?.checkoutHead;
    const github = component?.githubSha;
    checkoutPairs.push([checkout, github]);
    directLeaves.push(checkout, github);
  }
  for (const artifact of Array.isArray(bundle.artifacts) ? bundle.artifacts : []) {
    directLeaves.push(artifact?.sourceHead);
    const match = /^d2-(?:linux|windows)-domain-core-rest-([0-9a-f]{40})$/u.exec(artifact?.name ?? "");
    if (match) directLeaves.push(match[1]);
  }
  for (const actual of Array.isArray(bundle.actualBindings) ? bundle.actualBindings : []) {
    const match = /(?: at |audit-bundle at )([0-9a-f]{40}):?/u.exec(actual?.ActualTestTitle ?? "");
    if (match) directLeaves.push(match[1]);
  }
  if (directLeaves.some((value) => SHA40.test(value ?? "") && value !== sourceHead)) {
    fail("D2_SOURCE_HEAD_MISMATCH", "bundle source-head leaf");
  }
  for (const [checkout, github] of checkoutPairs) validateCheckoutGithubEquality(checkout, github);
}

function validateCheckoutGithubEquality(checkout, github) {
  if (SHA40.test(checkout ?? "") && SHA40.test(github ?? "") && checkout !== github) {
    fail("D2_ANCESTRY_UNPROVABLE", "bundle checkout/GITHUB SHA mismatch");
  }
}

function validateRecordGraphPreflight(bundle) {
  const records = [
    bundle?.workflow,
    bundle?.ancestry,
    ...(Array.isArray(bundle?.ancestry?.components) ? bundle.ancestry.components : []),
    ...(Array.isArray(bundle?.jobs) ? bundle.jobs : []),
    ...(Array.isArray(bundle?.artifacts) ? bundle.artifacts : []),
    ...(Array.isArray(bundle?.logs) ? bundle.logs : []),
    bundle?.catalogReconciliation,
    bundle?.d3Handoff
  ];
  const ids = records.map((item) => item?.recordId).filter((item) => typeof item === "string");
  if (new Set(ids).size !== ids.length) fail("D2_DUPLICATE_ID", "bundle record ids");
  const d3 = bundle?.d3Handoff;
  const refGroups = [d3?.jobRefs, d3?.artifactRefs, d3?.logRefs];
  const scalars = [d3?.sourceHeadRef, d3?.parentArtifactHeadRef, d3?.parentEvidenceHeadRef, d3?.workflowRef, d3?.bundleRef];
  if (!refGroups.every((items) => Array.isArray(items) && items.length === 2 && items.every((item) => typeof item === "string")) || !scalars.every((item) => typeof item === "string")) return;
  const refs = [...scalars.slice(0, 4), ...refGroups.flat(), scalars[4]];
  const targets = new Set(["source-head", "parent-artifact-head", "parent-evidence-head", "workflow-ci-push", "job-linux", "job-windows", "artifact-linux", "artifact-windows", "log-linux", "log-windows", "d2-final-bundle"]);
  if (refs.length !== targets.size || new Set(refs).size !== refs.length || refs.some((item) => !targets.has(item))) {
    fail("D2_DANGLING_REF", "d3 handoff refs");
  }
}

function validatePlatformMappingPreflight(bundle) {
  const rows = [
    [bundle?.ancestry?.components?.[0], { recordId: "ancestry-linux", jobRef: "job-linux", platform: "linux" }],
    [bundle?.ancestry?.components?.[1], { recordId: "ancestry-windows", jobRef: "job-windows", platform: "windows" }],
    [bundle?.jobs?.[0], { recordId: "job-linux", workflowRef: "workflow-ci-push", workflowJobId: "test-shard", platform: "linux", runnerOs: "Linux", artifactRef: "artifact-linux", logRef: "log-linux" }],
    [bundle?.jobs?.[1], { recordId: "job-windows", workflowRef: "workflow-ci-push", workflowJobId: "deterministic-windows", platform: "windows", runnerOs: "Windows", artifactRef: "artifact-windows", logRef: "log-windows" }],
    [bundle?.artifacts?.[0], { recordId: "artifact-linux", jobRef: "job-linux" }],
    [bundle?.artifacts?.[1], { recordId: "artifact-windows", jobRef: "job-windows" }],
    [bundle?.logs?.[0], { recordId: "log-linux", jobRef: "job-linux" }],
    [bundle?.logs?.[1], { recordId: "log-windows", jobRef: "job-windows" }]
  ];
  const knownMappingValues = new Set(rows.flatMap(([, expected]) => Object.values(expected)));
  for (const [value, expected] of rows) {
    if (value === null || typeof value !== "object") continue;
    for (const [key, expectedValue] of Object.entries(expected)) {
      if (typeof value[key] === "string" && value[key] !== expectedValue && knownMappingValues.has(value[key])) {
        fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", `${key} mapping`);
      }
    }
  }
  if (Array.isArray(bundle?.actualBindings) && bundle.actualBindings.length === 2) {
    const criteria = bundle.actualBindings.map((item) => item?.CriterionId);
    if (criteria[0] === "D-C16B" && criteria[1] === "D-C16A") {
      fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", "Actual A/B swap");
    }
  }
  const d3Tuples = [
    [bundle?.d3Handoff?.jobRefs, ["job-linux", "job-windows"]],
    [bundle?.d3Handoff?.artifactRefs, ["artifact-linux", "artifact-windows"]],
    [bundle?.d3Handoff?.logRefs, ["log-linux", "log-windows"]]
  ];
  for (const [actual, expected] of d3Tuples) {
    if (Array.isArray(actual) && actual.length === 2 && actual.every((item) => typeof item === "string") && !sameJson(actual, expected)) {
      fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", "D3 platform reference order");
    }
  }
}

function getRequired(object, key, label) {
  if (object === null || typeof object !== "object" || !Object.hasOwn(object, key)) {
    fail("D2_BUNDLE_REQUIRED_FIELD_MISSING", `${label}.${key}`);
  }
  return object[key];
}

function providerRun(value, sourceHead) {
  const runId = String(getRequired(value, "id", "run"));
  validateDecId(runId, "run.id");
  const result = {
    recordId: "workflow-ci-push",
    workflowName: getRequired(value, "name", "run"),
    event: getRequired(value, "event", "run"),
    runId,
    runAttempt: getRequired(value, "run_attempt", "run"),
    headSha: getRequired(value, "head_sha", "run"),
    status: getRequired(value, "status", "run"),
    conclusion: getRequired(value, "conclusion", "run"),
    htmlUrl: getRequired(value, "html_url", "run"),
    createdAtUtc: normalizeProviderTime(getRequired(value, "created_at", "run"), "run.created_at"),
    updatedAtUtc: normalizeProviderTime(getRequired(value, "updated_at", "run"), "run.updated_at")
  };
  validateWorkflow(result);
  if (result.headSha !== sourceHead) fail("D2_SOURCE_HEAD_MISMATCH", "provider run head");
  return result;
}

function providerJob(value, platform, workflow, capture, captureSha256) {
  const linux = platform === "linux";
  const expectedWorkflowJobId = linux ? "test-shard" : "deterministic-windows";
  if (capture.github.workflowJobId !== expectedWorkflowJobId) {
    fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", `${platform} logical job id`);
  }
  const jobDatabaseId = String(getRequired(value, "id", `job ${platform}`));
  validateDecId(jobDatabaseId, `job ${platform}.id`);
  const runId = String(getRequired(value, "run_id", `job ${platform}`));
  if (runId !== workflow.runId) fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", `${platform} run id`);
  if (getRequired(value, "run_attempt", `job ${platform}`) !== workflow.runAttempt) fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", `${platform} run attempt`);
  if (getRequired(value, "head_sha", `job ${platform}`) !== workflow.headSha) fail("D2_SOURCE_HEAD_MISMATCH", `${platform} job head`);
  const name = getRequired(value, "name", `job ${platform}`);
  const status = getRequired(value, "status", `job ${platform}`);
  const conclusion = getRequired(value, "conclusion", `job ${platform}`);
  if (status !== "completed" || conclusion !== "success") fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", `${platform} job result`);
  const job = {
    recordId: `job-${platform}`,
    workflowRef: "workflow-ci-push",
    workflowJobId: capture.github.workflowJobId,
    providerDisplayName: validatePrintable(name, `job ${platform}.name`),
    jobDatabaseId,
    platform,
    runnerOs: capture.runner.os,
    runnerArch: capture.runner.arch,
    imageOs: capture.runner.imageOs,
    imageVersion: capture.runner.imageVersion,
    nodeVersion: capture.toolchain.nodeVersion,
    pnpmVersion: capture.toolchain.pnpmVersion,
    vitestVersion: capture.toolchain.vitestVersion,
    commandArgv: [...capture.invocation.commandArgv],
    startedAtUtc: normalizeProviderTime(getRequired(value, "started_at", `job ${platform}`), `${platform}.started_at`),
    completedAtUtc: normalizeProviderTime(getRequired(value, "completed_at", `job ${platform}`), `${platform}.completed_at`),
    processStartedAtUnixMs: capture.result.startedAtUnixMs,
    processEndedAtUnixMs: capture.result.endedAtUnixMs,
    conclusion: "success",
    processExitCode: 0,
    logicalGroupId: "domain-core-rest",
    mode: "ordinary",
    selectedIdentityCount: capture.result.selectedIdentityCount,
    selectedIdentitySha256: capture.result.selectedIdentitySha256,
    failedCount: capture.result.failedCount,
    skippedCount: capture.result.skippedCount,
    todoCount: capture.result.todoCount,
    globalErrorCount: capture.result.globalErrorCount,
    manifestSha256: capture.result.manifestSha256,
    verificationReportSha256: capture.result.verificationReportSha256,
    captureSha256,
    artifactRef: `artifact-${platform}`,
    logRef: `log-${platform}`
  };
  validateJob(job, platform);
  return job;
}

function findArtifacts(value, sourceHead, workflow) {
  const artifacts = getRequired(value, "artifacts", "artifacts api");
  if (!Array.isArray(artifacts)) fail("D2_TYPE_INVALID", "artifacts api.artifacts");
  return ["linux", "windows"].map((platform) => {
    const name = `d2-${platform}-domain-core-rest-${sourceHead}`;
    const matches = artifacts.filter((item) => item?.name === name);
    if (matches.length !== 1) fail("D2_CARDINALITY_INVALID", `artifact ${name}`);
    const item = matches[0];
    if (getRequired(item, "expired", name) !== false) fail("D2_ARTIFACT_SHA_MISMATCH", `${name} expired`);
    const workflowRun = getRequired(item, "workflow_run", name);
    if (String(getRequired(workflowRun, "id", `${name}.workflow_run`)) !== workflow.runId || getRequired(workflowRun, "head_sha", `${name}.workflow_run`) !== sourceHead) fail("D2_SOURCE_HEAD_MISMATCH", name);
    return {
      artifactId: String(getRequired(item, "id", name)),
      name,
      sizeInBytes: getRequired(item, "size_in_bytes", name),
      expired: false,
      expiresAtUtc: normalizeProviderTime(getRequired(item, "expires_at", name), `${name}.expires_at`),
      archiveDownloadUrl: getRequired(item, "archive_download_url", name)
    };
  });
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function parseZip(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 22) {
    fail("D2_ARTIFACT_SHA_MISMATCH", "acquisition-archive:zip");
  }
  const requireRange = (offset, length, label) => {
    if (
      !Number.isSafeInteger(offset) ||
      !Number.isSafeInteger(length) ||
      offset < 0 ||
      length < 0 ||
      offset + length > bytes.length
    ) {
      fail("D2_ARTIFACT_SHA_MISMATCH", `acquisition-archive:${label}`);
    }
  };
  const readUInt16 = (offset, label) => {
    requireRange(offset, 2, label);
    return bytes.readUInt16LE(offset);
  };
  const readUInt32 = (offset, label) => {
    requireRange(offset, 4, label);
    return bytes.readUInt32LE(offset);
  };
  let eocd = -1;
  for (let index = Math.max(0, bytes.length - 65_557); index <= bytes.length - 22; index += 1) {
    if (readUInt32(index, "eocd-scan") === 0x06054b50) eocd = index;
  }
  if (eocd < 0) {
    fail("D2_ARTIFACT_SHA_MISMATCH", "acquisition-archive:eocd");
  }
  const commentLength = readUInt16(eocd + 20, "eocd-comment");
  if (eocd + 22 + commentLength !== bytes.length) {
    fail("D2_ARTIFACT_SHA_MISMATCH", "acquisition-archive:eocd-length");
  }
  const disk = readUInt16(eocd + 4, "eocd-disk");
  const centralDisk = readUInt16(eocd + 6, "eocd-central-disk");
  const diskCount = readUInt16(eocd + 8, "eocd-disk-count");
  const count = readUInt16(eocd + 10, "eocd-entry-count");
  const centralSize = readUInt32(eocd + 12, "eocd-central-size");
  const centralOffset = readUInt32(eocd + 16, "eocd-central-offset");
  if (
    disk !== 0 ||
    centralDisk !== 0 ||
    diskCount !== count ||
    centralOffset + centralSize !== eocd
  ) {
    fail("D2_ARTIFACT_SHA_MISMATCH", "acquisition-archive:eocd-layout");
  }
  const files = new Map();
  let offset = centralOffset;
  for (let entryIndex = 0; entryIndex < count; entryIndex += 1) {
    requireRange(offset, 46, "central-entry");
    if (readUInt32(offset, "central-signature") !== 0x02014b50) {
      fail("D2_ARTIFACT_SHA_MISMATCH", "acquisition-archive:central-entry");
    }
    const flags = readUInt16(offset + 8, "central-flags");
    const method = readUInt16(offset + 10, "central-method");
    const expectedCrc = readUInt32(offset + 16, "central-crc");
    const compressedSize = readUInt32(offset + 20, "central-compressed-size");
    const uncompressedSize = readUInt32(offset + 24, "central-uncompressed-size");
    const nameLength = readUInt16(offset + 28, "central-name-length");
    const extraLength = readUInt16(offset + 30, "central-extra-length");
    const entryCommentLength = readUInt16(offset + 32, "central-comment-length");
    const externalAttributes = readUInt32(offset + 38, "central-attributes");
    const localOffset = readUInt32(offset + 42, "central-local-offset");
    const centralEntryLength = 46 + nameLength + extraLength + entryCommentLength;
    requireRange(offset, centralEntryLength, "central-entry-body");
    if (offset + centralEntryLength > eocd) {
      fail("D2_ARTIFACT_SHA_MISMATCH", "acquisition-archive:central-overrun");
    }
    const nameBytes = bytes.subarray(offset + 46, offset + 46 + nameLength);
    const decodedName = nameBytes.toString("utf8");
    if (!Buffer.from(decodedName, "utf8").equals(nameBytes)) {
      fail("D2_ARTIFACT_SHA_MISMATCH", "acquisition-archive:path-utf8");
    }
    const name = decodedName.replaceAll("\\", "/");
    offset += centralEntryLength;
    if ((flags & 1) !== 0 || ![0, 8].includes(method)) fail("D2_ARTIFACT_SHA_MISMATCH", `zip flags ${name}`);
    if (name.endsWith("/")) continue;
    validateRelPath(name, "zip path");
    if (((externalAttributes >>> 16) & 0xf000) === 0xa000) fail("D2_ARTIFACT_SHA_MISMATCH", `zip symlink ${name}`);
    if (files.has(name.toLowerCase())) fail("D2_ARTIFACT_SHA_MISMATCH", `zip duplicate ${name}`);
    requireRange(localOffset, 30, "local-entry");
    if (readUInt32(localOffset, "local-signature") !== 0x04034b50) fail("D2_ARTIFACT_SHA_MISMATCH", `zip local ${name}`);
    const localNameLength = readUInt16(localOffset + 26, "local-name-length");
    const localExtraLength = readUInt16(localOffset + 28, "local-extra-length");
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    requireRange(localOffset, 30 + localNameLength + localExtraLength, "local-header");
    requireRange(dataOffset, compressedSize, "local-content");
    const compressed = bytes.subarray(dataOffset, dataOffset + compressedSize);
    let content;
    if (method === 0) content = Buffer.from(compressed);
    else {
      try {
        content = inflateRawSync(compressed);
      } catch {
        fail("D2_ARTIFACT_SHA_MISMATCH", "acquisition-archive:deflate");
      }
    }
    if (
      content.length !== uncompressedSize ||
      crc32(content) !== expectedCrc
    ) {
      fail("D2_ARTIFACT_SHA_MISMATCH", "acquisition-archive:content");
    }
    files.set(name.toLowerCase(), { name, bytes: content });
  }
  if (offset !== eocd) {
    fail("D2_ARTIFACT_SHA_MISMATCH", "acquisition-archive:central-length");
  }
  return files;
}

function verifyZipMatchesTree(zipBytes, tree) {
  const zipFiles = parseZip(zipBytes);
  if (zipFiles.size !== tree.files.length) fail("D2_ARTIFACT_SHA_MISMATCH", "zip tree count");
  for (const file of tree.files) {
    const entry = zipFiles.get(file.path.toLowerCase());
    if (!entry || entry.name !== file.path || !entry.bytes.equals(file.bytes)) fail("D2_ARTIFACT_SHA_MISMATCH", `zip tree ${file.path}`);
  }
}

function verifyCatalog(sourceHead) {
  const oid = git(["rev-parse", `${sourceHead}:${CATALOG_PATH}`], "D2_ARTIFACT_SHA_MISMATCH");
  const raw = run("git", ["cat-file", "blob", oid], { code: "D2_ARTIFACT_SHA_MISMATCH" });
  const windows = Buffer.from(raw.toString("utf8").replaceAll("\n", "\r\n"), "utf8");
  const actual = {
    recordId: "catalog-support",
    path: CATALOG_PATH,
    blobOid: oid,
    rawLength: raw.length,
    rawSha256: sha256(raw),
    lfCount: raw.filter((byte) => byte === 0x0a).length,
    windowsCheckoutLength: windows.length,
    windowsCheckoutSha256: sha256(windows),
    classification: "LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY",
    runtimeAuthority: false
  };
  validateCatalogReconciliation(actual);
  return actual;
}

function resolveDesignAuthority(sourceHead) {
  const commit = git(["log", "-1", "--format=%H", sourceHead, "--", DESIGN_PATH], "D2_ANCESTRY_UNPROVABLE");
  validateSha40(commit, "design authority commit");
  if (commit === RULE_EVIDENCE_HEAD || !gitAncestor(commit, sourceHead)) fail("D2_SOURCE_HEAD_MISMATCH", "design authority commit");
  const atCommit = run("git", ["cat-file", "blob", `${commit}:${DESIGN_PATH}`], { code: "D2_ANCESTRY_UNPROVABLE" });
  const atSource = run("git", ["cat-file", "blob", `${sourceHead}:${DESIGN_PATH}`], { code: "D2_ANCESTRY_UNPROVABLE" });
  if (!atCommit.equals(atSource)) fail("D2_SOURCE_HEAD_MISMATCH", "design authority content");
  validateDesignAuthorityDocument(atCommit);
  return { commit, digest: sha256(atCommit) };
}

function validateDesignAuthorityDocument(bytes) {
  const text = bytes.toString("utf8");
  if (!Buffer.from(text, "utf8").equals(bytes)) {
    fail("D2_ACTUAL_BINDING_INVALID", "design authority UTF-8");
  }
  const requiredMarkers = [
    "designMaterializationStatus=COMPLETE",
    "designAuthorityBinding=EXTERNAL_GIT_COMMIT_AND_RAW_BLOB_SHA256",
    `designPath=${DESIGN_PATH}`,
    "requiredNextAction=FRESH_INDEPENDENT_RULE_DESIGN_REREVIEW"
  ];
  for (const marker of requiredMarkers) {
    if (text.split(marker).length !== 2) {
      fail("D2_ACTUAL_BINDING_INVALID", `design authority marker ${marker}`);
    }
  }
}

function validateDesignAuthorityBinding(bundle, authority) {
  if (bundle.d3Handoff.designAuthorityCommit !== authority.commit) {
    fail("D2_SOURCE_HEAD_MISMATCH", "design authority commit binding");
  }
  if (bundle.d3Handoff.designAuthorityBlobSha256 !== authority.digest) {
    fail("D2_ACTUAL_BINDING_INVALID", "design authority content binding");
  }
}

const MECHANISM_FUNCTION_LOCATORS = Object.freeze([
  "runSelfTestMode",
  "runCaptureRunnerMode",
  "runAuditBundleMode",
  "validateD16A",
  "validateD16B",
  "issueFinalBundleAtomically"
]);
const MECHANISM_STEP_LOCATORS = Object.freeze([
  ["test-shard", "d2-linux-domain-core-rest-capture"],
  ["deterministic-windows", "d2-windows-domain-core-rest-run"],
  ["deterministic-windows", "d2-windows-domain-core-rest-capture"]
]);

function sourceFunctionBlock(text, name) {
  const marker = `function ${name}(`;
  const start = text.indexOf(marker);
  if (start < 0 || text.indexOf(marker, start + marker.length) >= 0) {
    fail("D2_ACTUAL_BINDING_INVALID", `mechanism function locator ${name}`);
  }
  const next = text.indexOf("\nfunction ", start + marker.length);
  return text.slice(start, next < 0 ? text.length : next);
}

function validateMechanismLocators(verifierBytes, workflowBytes) {
  const verifier = verifierBytes.toString("utf8");
  const workflow = workflowBytes.toString("utf8");
  if (!Buffer.from(verifier, "utf8").equals(verifierBytes) || !Buffer.from(workflow, "utf8").equals(workflowBytes)) {
    fail("D2_ACTUAL_BINDING_INVALID", "mechanism locator UTF-8");
  }
  for (const name of MECHANISM_FUNCTION_LOCATORS) sourceFunctionBlock(verifier, name);
  const jobHeaders = [...workflow.matchAll(/^ {2}([A-Za-z0-9_-]+):\s*$/gmu)];
  for (const [job, step] of MECHANISM_STEP_LOCATORS) {
    const matches = [...workflow.matchAll(new RegExp(`^\\s+id: ${step}\\s*$`, "gmu"))];
    if (matches.length !== 1) fail("D2_ACTUAL_BINDING_INVALID", `workflow step locator ${step}`);
    const headerIndex = jobHeaders.findIndex((match) => match[1] === job);
    const jobStart = headerIndex < 0 ? -1 : jobHeaders[headerIndex].index;
    const jobEnd = headerIndex < 0 || headerIndex === jobHeaders.length - 1 ? workflow.length : jobHeaders[headerIndex + 1].index;
    const stepIndex = matches[0].index;
    if (jobStart < 0 || stepIndex < jobStart || stepIndex >= jobEnd) {
      fail("D2_ACTUAL_BINDING_INVALID", `workflow job locator ${job}.${step}`);
    }
  }
  const audit = sourceFunctionBlock(verifier, "runAuditBundleMode");
  const issue = sourceFunctionBlock(verifier, "issueFinalBundleAtomically");
  const builderMarker = ["constructIssued", "ActualBindings("].join("");
  if (audit.includes("actualBindings:") || audit.includes(builderMarker)) {
    fail("D2_ACTUAL_BINDING_INVALID", "runAuditBundleMode early Actual construction");
  }
  const aIndex = issue.indexOf("validateD16A(");
  const bIndex = issue.indexOf("validateD16B(");
  const builderIndex = issue.indexOf(builderMarker);
  if (aIndex < 0 || bIndex <= aIndex || builderIndex <= bIndex || issue.indexOf(builderMarker, builderIndex + 1) >= 0) {
    fail("D2_ACTUAL_BINDING_INVALID", "issuance mechanism order");
  }
  if (verifier.split(builderMarker).length !== 3 || [...verifier.matchAll(/^function constructIssuedActualBindings\(/gmu)].length !== 1) {
    fail("D2_ACTUAL_BINDING_INVALID", "Actual builder must have one declaration and one call");
  }
}

function resolveMechanismLocators(sourceHead) {
  const verifier = run("git", ["cat-file", "blob", `${sourceHead}:scripts/verify-p2f1r-d2-publication-evidence.mjs`], { code: "D2_ACTUAL_BINDING_INVALID" });
  const workflow = run("git", ["cat-file", "blob", `${sourceHead}:.github/workflows/ci.yml`], { code: "D2_ACTUAL_BINDING_INVALID" });
  validateMechanismLocators(verifier, workflow);
  return { verifier, workflow };
}

function completeBundleDraft(bundle, actualBindings) {
  const entries = Object.entries(bundle);
  const d3Index = entries.findIndex(([key]) => key === "d3Handoff");
  if (d3Index < 0) fail("D2_BUNDLE_REQUIRED_FIELD_MISSING", "bundle.d3Handoff");
  entries.splice(d3Index, 0, ["actualBindings", actualBindings]);
  return Object.fromEntries(entries);
}

function issueFinalBundleAtomically(output, bundle, captures, instrumentation) {
  if (existsSync(output)) fail("D2_OUTPUT_EXISTS", output);
  validateD16A(bundle, captures);
  validateD16B(bundle);
  validateDesignAuthorityBinding(bundle, resolveDesignAuthority(bundle.sourceHead));
  if (instrumentation?.mechanism === undefined) resolveMechanismLocators(bundle.sourceHead);
  else validateMechanismLocators(instrumentation.mechanism.verifier, instrumentation.mechanism.workflow);
  const actualBindings = constructIssuedActualBindings(bundle, instrumentation);
  const issuedBundle = completeBundleDraft(bundle, actualBindings);
  validateIssuedBundle(issuedBundle);
  const bytes = canonicalBytes(issuedBundle);
  const temporary = `${output}.tmp-${process.pid}`;
  if (existsSync(temporary)) fail("D2_OUTPUT_EXISTS", temporary);
  mkdirSync(dirname(output), { recursive: true });
  let descriptor;
  try {
    descriptor = openSync(temporary, "wx");
    writeSync(descriptor, bytes);
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = undefined;
    const reread = readFileSync(temporary);
    const value = parseJsonBytes(reread, "issued bundle", true);
    validateIssuedBundle(value);
    if (!reread.equals(bytes)) fail("D2_CANONICAL_JSON_INVALID", "issued bundle reread");
    renameSync(temporary, output);
    return { bytes, bundle: value };
  } catch (error) {
    if (descriptor !== undefined) closeSync(descriptor);
    if (existsSync(temporary)) unlinkSync(temporary);
    if (existsSync(output)) unlinkSync(output);
    throw error;
  }
}

function runAuditBundleMode(argv) {
  const options = parseOptions(argv, ["--source-head", "--parent-artifact-head", "--parent-evidence-head", "--acquisition-root", "--design-contract", "--output"]);
  const sourceHead = validateSha40(options["--source-head"], "source head");
  exactValue(options["--parent-artifact-head"], PARENT_ARTIFACT_HEAD, "parent artifact head");
  exactValue(options["--parent-evidence-head"], PARENT_EVIDENCE_HEAD, "parent evidence head");
  exactValue(options["--design-contract"].replaceAll("\\", "/"), DESIGN_PATH, "design contract");
  if (!isAbsolute(options["--acquisition-root"])) fail("D2_INVALID_ARGUMENTS", "acquisition root must be absolute");
  const root = resolve(options["--acquisition-root"]);
  const rootExists = evidenceFilesystem(
    () => existsSync(root),
    "D2_REQUIRED_JOB_MISSING",
    "acquisition-census:."
  );
  const rootInfo = rootExists
    ? evidenceFilesystem(
      () => lstatSync(root),
      "D2_REQUIRED_JOB_MISSING",
      "acquisition-census:."
    )
    : undefined;
  if (!rootExists) fail("D2_REQUIRED_JOB_MISSING", "acquisition-census:.");
  if (!rootInfo.isDirectory()) fail("D2_TYPE_INVALID", "acquisition-census:.");
  const expectedOutput = "docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json";
  exactValue(options["--output"].replaceAll("\\", "/"), expectedOutput, "output path");
  const output = resolve(options["--output"]);
  if (existsSync(output)) fail("D2_OUTPUT_EXISTS", output);
  validateAcquisitionFilesystem(root);
  const acquisitionRecord = assertCanonicalFile(
    join(root, "acquisition-manifest.json"),
    validateAcquisitionManifest,
    "acquisition manifest",
    "acquisition-input:acquisition-manifest.json"
  );
  const acquisition = acquisitionRecord.value;
  if (acquisition.sourceHead !== sourceHead) fail("D2_SOURCE_HEAD_MISMATCH", "acquisition source");
  const workflowBytes = verifyAcquisitionFile(root, acquisition.workflowApi);
  const jobBytes = acquisition.jobApis.map((record) => verifyAcquisitionFile(root, record));
  const artifactsApiBytes = verifyAcquisitionFile(root, acquisition.artifactsApi);
  const archiveBytes = acquisition.artifactArchives.map((record) => verifyAcquisitionFile(root, record));
  const logBytes = acquisition.jobLogs.map((record) => verifyAcquisitionFile(root, record));
  const workflowProvider = parseJsonBytes(workflowBytes, "provider run", false);
  const jobProviders = jobBytes.map((bytes, index) => parseJsonBytes(bytes, `provider job ${index}`, false));
  const artifactsProvider = parseJsonBytes(artifactsApiBytes, "provider artifacts", false);
  const workflow = providerRun(workflowProvider, sourceHead);
  if (Date.parse(acquisition.acquiredAtUtc) < Date.parse(workflow.updatedAtUtc)) fail("D2_TYPE_INVALID", "acquisition time precedes workflow completion");
  const providerArtifacts = findArtifacts(artifactsProvider, sourceHead, workflow);
  const captures = [];
  const trees = [];
  const captureRecords = [];
  for (const [index, platform] of ["linux", "windows"].entries()) {
    const treeRoot = join(root, "artifacts", platform);
    const tree = listTree(treeRoot, `acquisition-input:artifacts/${platform}`);
    trees.push(tree);
    const declaredTree = acquisition.artifactTrees[index];
    if (tree.fileCount !== declaredTree.fileCount || tree.byteLength !== declaredTree.byteLength) fail("D2_ARTIFACT_SHA_MISMATCH", `${platform} tree size`);
    validateArtifactHash(tree.canonicalTreeSha256, declaredTree.canonicalTreeSha256, `${platform} tree hash`);
    verifyZipMatchesTree(archiveBytes[index], tree);
    const captureRecord = assertCanonicalFile(
      join(treeRoot, "d2-capture.json"),
      validateCapture,
      `${platform} capture`,
      `acquisition-input:artifacts/${platform}/d2-capture.json`
    );
    captureRecords.push(captureRecord);
    const capture = captureRecord.value;
    captures.push(capture);
    if (capture.platform !== platform || capture.sourceHead !== sourceHead) fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", `${platform} capture`);
    const runnerTree = listTree(
      join(treeRoot, "runner-output"),
      `acquisition-input:artifacts/${platform}/runner-output`
    );
    if (runnerTree.fileCount !== capture.runnerOutput.fileCount || runnerTree.byteLength !== capture.runnerOutput.byteLength) fail("D2_ARTIFACT_SHA_MISMATCH", `${platform} runner tree size`);
    validateArtifactHash(runnerTree.canonicalTreeSha256, capture.runnerOutput.canonicalTreeSha256, `${platform} runner tree hash`);
    const manifestBytes = evidenceFilesystem(
      () => readFileSync(join(treeRoot, "runner-output", capture.result.manifestRelativePath)),
      "D2_REQUIRED_JOB_MISSING",
      `acquisition-input:artifacts/${platform}/runner-output/logical-manifest.json`
    );
    const verificationBytes = evidenceFilesystem(
      () => readFileSync(join(treeRoot, "runner-output", capture.result.verificationRelativePath)),
      "D2_REQUIRED_JOB_MISSING",
      `acquisition-input:artifacts/${platform}/runner-output/verification.json`
    );
    validateArtifactHash(sha256(manifestBytes), capture.result.manifestSha256, `${platform} manifest file hash`);
    validateArtifactHash(sha256(verificationBytes), capture.result.verificationReportSha256, `${platform} verification file hash`);
    const manifest = parseJsonBytes(manifestBytes, `${platform} logical manifest`, true);
    if (manifest.selectedIdentities.length !== 503 || sha256(Buffer.from(`${JSON.stringify(manifest.selectedIdentities)}\n`, "utf8")) !== capture.result.selectedIdentitySha256) fail("D2_ARTIFACT_SHA_MISMATCH", `${platform} identity sha`);
  }
  const jobs = jobProviders.map((provider, index) => providerJob(provider, index === 0 ? "linux" : "windows", workflow, captures[index], sha256(captureRecords[index].bytes)));
  const artifacts = ["linux", "windows"].map((platform, index) => {
    const provider = providerArtifacts[index];
    validateHttpsUrl(provider.archiveDownloadUrl, `${platform} archive URL`);
    if (provider.archiveDownloadUrl !== acquisition.artifactArchives[index].sourceUrl || provider.sizeInBytes !== acquisition.artifactArchives[index].byteLength || provider.sizeInBytes !== archiveBytes[index].length) fail("D2_ARTIFACT_SHA_MISMATCH", `${platform} archive metadata`);
    const artifact = {
      recordId: `artifact-${platform}`,
      jobRef: `job-${platform}`,
      artifactId: provider.artifactId,
      name: provider.name,
      sourceHead,
      retentionDays: 7,
      expiresAtUtc: provider.expiresAtUtc,
      sizeInBytes: provider.sizeInBytes,
      downloadedFileCount: trees[index].fileCount,
      downloadedTreeSha256: trees[index].canonicalTreeSha256,
      captureFileSha256: sha256(captureRecords[index].bytes)
    };
    validateArtifact(artifact, platform, sourceHead);
    return artifact;
  });
  const logs = ["linux", "windows"].map((platform, index) => ({
    recordId: `log-${platform}`,
    jobRef: `job-${platform}`,
    jobDatabaseId: jobs[index].jobDatabaseId,
    downloadUrl: acquisition.jobLogs[index].sourceUrl,
    byteLength: logBytes[index].length,
    downloadedBlobSha256: sha256(logBytes[index])
  }));
  logs.forEach((log, index) => {
    const platform = index === 0 ? "linux" : "windows";
    validateLog(log, platform);
    const path = new URL(log.downloadUrl).pathname;
    if (!path.endsWith(`/actions/jobs/${log.jobDatabaseId}/logs`)) fail("D2_PLATFORM_JOB_MAPPING_MISMATCH", `${platform} log url`);
  });
  const design = resolveDesignAuthority(sourceHead);
  const ancestry = buildAncestry(sourceHead);
  const bundle = {
    schemaVersion: BUNDLE_SCHEMA_VERSION,
    sourceHead,
    parentArtifactHead: PARENT_ARTIFACT_HEAD,
    parentEvidenceHead: PARENT_EVIDENCE_HEAD,
    workflow,
    ancestry: {
      recordId: "ancestry-proof",
      settledBaselineHead: SETTLED_BASELINE_HEAD,
      ruleEvidenceHead: RULE_EVIDENCE_HEAD,
      acceptedProfileSourceHead: ACCEPTED_PROFILE_SOURCE_HEAD,
      components: ["linux", "windows"].map((platform, index) => ({
        recordId: `ancestry-${platform}`,
        jobRef: `job-${platform}`,
        platform,
        checkoutHead: captures[index].ancestry.checkoutHead,
        githubSha: captures[index].github.githubSha,
        ...Object.fromEntries(ANCESTRY_KEYS.slice(1).map((key) => [key, captures[index].ancestry[key]]))
      }))
    },
    jobs,
    artifacts,
    logs,
    retention: {
      policy: "GITHUB_ACTIONS_ARTIFACT_RETENTION",
      retentionDays: 7,
      hostedAvailability: "EXPIRES_AFTER_RETENTION",
      historicalBinding: "HASH_REMAINS_AFTER_EXPIRY"
    },
    catalogReconciliation: verifyCatalog(sourceHead),
    designExpectedBindings: D16_EXPECTED.map((item) => ({ ...item })),
    d3Handoff: {
      recordId: "d3-handoff",
      designAuthorityPath: DESIGN_PATH,
      designAuthorityCommit: design.commit,
      designAuthorityBlobSha256: design.digest,
      sourceHeadRef: "source-head",
      parentArtifactHeadRef: "parent-artifact-head",
      parentEvidenceHeadRef: "parent-evidence-head",
      workflowRef: "workflow-ci-push",
      jobRefs: ["job-linux", "job-windows"],
      artifactRefs: ["artifact-linux", "artifact-windows"],
      logRefs: ["log-linux", "log-windows"],
      bundleRef: "d2-final-bundle",
      archiveCategories: ["E2_FINAL_EVIDENCE_BUNDLE", "H_SOURCE_STATUS_RECORD", "FINAL_CODE_REVIEW_VERBATIM", "FINAL_RULE_REVIEW_VERBATIM"],
      deleteAfterD3Categories: ["TEMPORARY_VERIFIER", "D2_WORKFLOW_STEPS_AND_CHECKOUT_DELTAS", "TEMPORARY_D2_BRANCH", "LOCAL_DOWNLOADED_ARTIFACTS", "RAW_JOB_LOGS", "TEMPORARY_WORKTREES", "ACQUISITION_ROOT_AND_MANIFEST", "SELF_TEST_NEGATIVE_FIXTURES"],
      keepOperationalAssetCount: 0,
      cleanupRequired: true
    },
    finalStructuralVerdict: "D2_PUBLICATION_EVIDENCE_BUNDLE_VALID"
  };
  if (!sameJson(ancestry, captures[0].ancestry) || !sameJson(ancestry, captures[1].ancestry)) fail("D2_ANCESTRY_UNPROVABLE", "local/capture ancestry");
  const issued = issueFinalBundleAtomically(output, bundle, captures);
  process.stdout.write(`D2_PUBLICATION_BUNDLE_OK ${sourceHead} ${workflow.runId} ${sha256(issued.bytes)}\n`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function selfTestAncestry(head) {
  return {
    checkoutHead: head,
    repositoryIsShallow: false,
    sourceObjectReadable: true,
    parentArtifactObjectReadable: true,
    parentEvidenceObjectReadable: true,
    settledBaselineObjectReadable: true,
    ruleEvidenceObjectReadable: true,
    acceptedProfileSourceObjectReadable: true,
    parentArtifactIsAncestorOfSource: true,
    parentEvidenceIsAncestorOfSource: true,
    settledBaselineIsAncestorOfSource: true,
    ruleEvidenceIsAncestorOfSource: true,
    acceptedProfileSourceIsReachable: true,
    evidenceParentEqualsArtifact: true,
    artifactParentEqualsSettled: true
  };
}

function selfTestCapture(platform, head) {
  const linux = platform === "linux";
  return {
    schemaVersion: CAPTURE_SCHEMA_VERSION,
    criterionComponent: "D-C16A",
    platform,
    sourceHead: head,
    parentArtifactHead: PARENT_ARTIFACT_HEAD,
    parentEvidenceHead: PARENT_EVIDENCE_HEAD,
    settledBaselineHead: SETTLED_BASELINE_HEAD,
    ruleEvidenceHead: RULE_EVIDENCE_HEAD,
    acceptedProfileSourceHead: ACCEPTED_PROFILE_SOURCE_HEAD,
    github: {
      workflowName: "CI",
      eventName: "push",
      runId: "123",
      runAttempt: 1,
      githubSha: head,
      workflowJobId: linux ? "test-shard" : "deterministic-windows"
    },
    runner: { os: linux ? "Linux" : "Windows", arch: "X64", imageOs: linux ? "ubuntu24" : "win25", imageVersion: "20260801.1" },
    toolchain: { nodeVersion: "v24.15.0", pnpmVersion: "11.7.0", vitestVersion: "3.2.6" },
    invocation: { commandArgv: [...COMMAND_ARGV], mode: "ordinary", logicalGroupId: "domain-core-rest" },
    ancestry: selfTestAncestry(head),
    result: {
      startedAtUnixMs: 1000,
      endedAtUnixMs: 2000,
      processExitCode: 0,
      selectedIdentityCount: 503,
      selectedIdentitySha256: "1".repeat(64),
      failedCount: 0,
      skippedCount: 0,
      todoCount: 0,
      globalErrorCount: 0,
      manifestRelativePath: "logical-manifest.json",
      manifestSha256: "2".repeat(64),
      verificationRelativePath: "verification.json",
      verificationReportSha256: "3".repeat(64)
    },
    runnerOutput: { relativeRoot: "runner-output", fileCount: 2, byteLength: 20, canonicalTreeSha256: "4".repeat(64) },
    captureVerdict: "D2_CAPTURE_VALID"
  };
}

function selfTestAcquisition(head) {
  const base = "https://api.github.com/repos/example/repository/actions";
  const value = {
    schemaVersion: ACQUISITION_SCHEMA_VERSION,
    sourceHead: head,
    acquiredAtUtc: "2026-08-07T00:00:00.000Z",
    workflowApi: { recordId: "api-workflow", relativePath: "api/run.json", sourceUrl: `${base}/runs/123`, byteLength: 1, sha256: "1".repeat(64) },
    jobApis: [
      { recordId: "api-job-linux", jobRef: "job-linux", relativePath: "api/jobs/linux.json", sourceUrl: `${base}/jobs/456`, byteLength: 1, sha256: "2".repeat(64) },
      { recordId: "api-job-windows", jobRef: "job-windows", relativePath: "api/jobs/windows.json", sourceUrl: `${base}/jobs/789`, byteLength: 1, sha256: "3".repeat(64) }
    ],
    artifactsApi: { recordId: "api-artifacts", relativePath: "api/artifacts.json", sourceUrl: `${base}/runs/123/artifacts`, byteLength: 1, sha256: "4".repeat(64) },
    artifactArchives: [
      { recordId: "archive-linux", jobRef: "job-linux", relativePath: "downloads/artifacts/linux.zip", sourceUrl: `${base}/artifacts/11/zip`, byteLength: 1, sha256: "5".repeat(64) },
      { recordId: "archive-windows", jobRef: "job-windows", relativePath: "downloads/artifacts/windows.zip", sourceUrl: `${base}/artifacts/12/zip`, byteLength: 1, sha256: "6".repeat(64) }
    ],
    artifactTrees: [
      { recordId: "tree-linux", archiveRef: "archive-linux", relativeRoot: "artifacts/linux", fileCount: 2, byteLength: 20, canonicalTreeSha256: "7".repeat(64) },
      { recordId: "tree-windows", archiveRef: "archive-windows", relativeRoot: "artifacts/windows", fileCount: 2, byteLength: 20, canonicalTreeSha256: "8".repeat(64) }
    ],
    jobLogs: [
      { recordId: "log-download-linux", jobRef: "job-linux", relativePath: "downloads/logs/linux.bin", sourceUrl: `${base}/jobs/456/logs`, byteLength: 1, sha256: "9".repeat(64) },
      { recordId: "log-download-windows", jobRef: "job-windows", relativePath: "downloads/logs/windows.bin", sourceUrl: `${base}/jobs/789/logs`, byteLength: 1, sha256: "a".repeat(64) }
    ]
  };
  for (const record of acquisitionBlobRecords(value)) {
    const bytes = selfTestAcquisitionBlob(record);
    record.byteLength = bytes.length;
    record.sha256 = sha256(bytes);
  }
  return value;
}

function acquisitionBlobRecords(value) {
  return [
    value.workflowApi,
    ...value.jobApis,
    value.artifactsApi,
    ...value.artifactArchives,
    ...value.jobLogs
  ];
}

function selfTestAcquisitionBlob(record) {
  return Buffer.from(`D2 self-test blob ${record.relativePath}\n`, "utf8");
}

function createStoredZip(files) {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;
  for (const file of [...files].sort((left, right) => compareUtf8(left.path, right.path))) {
    const name = Buffer.from(file.path, "utf8");
    const content = Buffer.from(file.bytes);
    const checksum = crc32(content);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(content.length, 18);
    local.writeUInt32LE(content.length, 22);
    local.writeUInt16LE(name.length, 26);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(content.length, 20);
    central.writeUInt32LE(content.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(localOffset, 42);
    localParts.push(local, name, content);
    centralParts.push(central, name);
    localOffset += local.length + name.length + content.length;
  }
  const centralBytes = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBytes.length, 12);
  eocd.writeUInt32LE(localOffset, 16);
  return Buffer.concat([...localParts, centralBytes, eocd]);
}

function writeSelfTestPath(root, relativePath, bytes) {
  const absolute = join(root, ...relativePath.split("/"));
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, bytes);
}

function materializePublicAuditFixture(root, head) {
  const captures = [
    selfTestCapture("linux", head),
    selfTestCapture("windows", head)
  ];
  const acquisition = selfTestAcquisition(head);
  acquisition.acquiredAtUtc = "2026-08-07T00:20:00.000Z";
  const selectedIdentities = Array.from(
    { length: 503 },
    (_, index) => `self-test-identity-${String(index).padStart(3, "0")}`
  );
  const archives = [];
  for (const [index, platform] of ["linux", "windows"].entries()) {
    const runnerRoot = join(root, "artifacts", platform, "runner-output");
    mkdirSync(runnerRoot, { recursive: true });
    const manifest = {
      schemaVersion: "botc-vitest-logical-manifest-v1",
      selectedIdentities
    };
    const verification = {
      schemaVersion: "botc-vitest-logical-verification-v1",
      result: "PASS"
    };
    const manifestBytes = canonicalBytes(manifest);
    const verificationBytes = canonicalBytes(verification);
    writeSelfTestPath(
      root,
      `artifacts/${platform}/runner-output/logical-manifest.json`,
      manifestBytes
    );
    writeSelfTestPath(
      root,
      `artifacts/${platform}/runner-output/verification.json`,
      verificationBytes
    );
    const runnerTree = listTree(runnerRoot);
    captures[index].result.selectedIdentitySha256 = sha256(
      Buffer.from(`${JSON.stringify(selectedIdentities)}\n`, "utf8")
    );
    captures[index].result.manifestSha256 = sha256(manifestBytes);
    captures[index].result.verificationReportSha256 = sha256(verificationBytes);
    captures[index].runnerOutput = {
      relativeRoot: "runner-output",
      fileCount: runnerTree.fileCount,
      byteLength: runnerTree.byteLength,
      canonicalTreeSha256: runnerTree.canonicalTreeSha256
    };
    writeSelfTestPath(
      root,
      `artifacts/${platform}/d2-capture.json`,
      canonicalBytes(captures[index])
    );
    const artifactTree = listTree(join(root, "artifacts", platform));
    acquisition.artifactTrees[index].fileCount = artifactTree.fileCount;
    acquisition.artifactTrees[index].byteLength = artifactTree.byteLength;
    acquisition.artifactTrees[index].canonicalTreeSha256 =
      artifactTree.canonicalTreeSha256;
    archives.push(createStoredZip(artifactTree.files));
  }

  const runProvider = {
    id: 123,
    name: "CI",
    event: "push",
    run_attempt: 1,
    head_sha: head,
    status: "completed",
    conclusion: "success",
    html_url: "https://github.com/example/repository/actions/runs/123",
    created_at: "2026-08-07T00:00:00.000Z",
    updated_at: "2026-08-07T00:10:00.000Z"
  };
  const jobProviders = ["linux", "windows"].map((platform) => ({
    id: platform === "linux" ? 456 : 789,
    run_id: 123,
    run_attempt: 1,
    head_sha: head,
    name: platform === "linux"
      ? "test shard (domain-core-rest)"
      : "deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice/snake-charmer/evil-twin/witch/dreamer/clockmaker",
    status: "completed",
    conclusion: "success",
    started_at: platform === "linux"
      ? "2026-08-07T00:01:00.000Z"
      : "2026-08-07T00:02:00.000Z",
    completed_at: platform === "linux"
      ? "2026-08-07T00:05:00.000Z"
      : "2026-08-07T00:06:00.000Z"
  }));
  const artifactsProvider = {
    artifacts: ["linux", "windows"].map((platform, index) => ({
      id: platform === "linux" ? 11 : 12,
      name: `d2-${platform}-domain-core-rest-${head}`,
      size_in_bytes: archives[index].length,
      expired: false,
      expires_at: "2026-08-14T00:00:00.000Z",
      archive_download_url:
        `https://api.github.com/repos/example/repository/actions/artifacts/${platform === "linux" ? "11" : "12"}/zip`,
      workflow_run: { id: 123, head_sha: head }
    }))
  };
  const blobs = new Map([
    ["api/run.json", canonicalBytes(runProvider)],
    ["api/jobs/linux.json", canonicalBytes(jobProviders[0])],
    ["api/jobs/windows.json", canonicalBytes(jobProviders[1])],
    ["api/artifacts.json", canonicalBytes(artifactsProvider)],
    ["downloads/artifacts/linux.zip", archives[0]],
    ["downloads/artifacts/windows.zip", archives[1]],
    ["downloads/logs/linux.bin", Buffer.from("linux self-test log\n", "utf8")],
    ["downloads/logs/windows.bin", Buffer.from("windows self-test log\n", "utf8")]
  ]);
  for (const record of acquisitionBlobRecords(acquisition)) {
    const bytes = blobs.get(record.relativePath);
    if (!bytes) fail("D2_INTERNAL_ERROR", "self-test fixture blob");
    record.byteLength = bytes.length;
    record.sha256 = sha256(bytes);
    writeSelfTestPath(root, record.relativePath, bytes);
  }
  writeSelfTestPath(
    root,
    "acquisition-manifest.json",
    canonicalBytes(acquisition)
  );
  const census = validateAcquisitionFilesystem(root);
  return { acquisition, captures, census };
}

function rewritePublicAuditBlob(root, relativePath, bytes) {
  const manifestPath = join(root, "acquisition-manifest.json");
  const acquisition = parseJsonBytes(
    readFileSync(manifestPath),
    "self-test acquisition manifest",
    true
  );
  const record = acquisitionBlobRecords(acquisition).find(
    (candidate) => candidate.relativePath === relativePath
  );
  if (!record) fail("D2_INTERNAL_ERROR", "self-test mutation record");
  writeSelfTestPath(root, relativePath, bytes);
  record.byteLength = bytes.length;
  record.sha256 = sha256(bytes);
  if (relativePath.startsWith("downloads/artifacts/")) {
    const index = relativePath.endsWith("linux.zip") ? 0 : 1;
    const artifactsPath = join(root, "api", "artifacts.json");
    const provider = parseJsonBytes(
      readFileSync(artifactsPath),
      "self-test artifacts provider",
      true
    );
    provider.artifacts[index].size_in_bytes = bytes.length;
    const providerBytes = canonicalBytes(provider);
    writeSelfTestPath(root, "api/artifacts.json", providerBytes);
    acquisition.artifactsApi.byteLength = providerBytes.length;
    acquisition.artifactsApi.sha256 = sha256(providerBytes);
  }
  writeFileSync(manifestPath, canonicalBytes(acquisition));
}

function publicAuditInvocation(root, head) {
  const outputRelative =
    "docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json";
  const output = resolve(outputRelative);
  if (existsSync(output)) unlinkSync(output);
  const result = spawnSync(process.execPath, [
    resolve("scripts/verify-p2f1r-d2-publication-evidence.mjs"),
    "audit-bundle",
    "--source-head",
    head,
    "--parent-artifact-head",
    PARENT_ARTIFACT_HEAD,
    "--parent-evidence-head",
    PARENT_EVIDENCE_HEAD,
    "--acquisition-root",
    root,
    "--design-contract",
    DESIGN_PATH,
    "--output",
    outputRelative
  ], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
    shell: false
  });
  return { result, output };
}

function assertPublicAuditRejection(root, head, expectedCode, expectedContext) {
  const { result, output } = publicAuditInvocation(root, head);
  const stderr = result.stderr ?? "";
  const stdout = result.stdout ?? "";
  const temporary = `${output}.tmp-${result.pid ?? ""}`;
  if (
    result.error ||
    result.status !== 1 ||
    stdout !== "" ||
    !stderr.startsWith(`${expectedCode} ${expectedContext}`) ||
    stderr.includes("D2_INTERNAL_ERROR") ||
    /(?:^|\n)\s*at\s/u.test(stderr) ||
    existsSync(output) ||
    (result.pid !== undefined && existsSync(temporary))
  ) {
    fail(
      "D2_SELF_TEST_FAILED",
      `public CLI rejection ${expectedCode} ${expectedContext}`
    );
  }
}

function assertPublicAuditAcceptance(root, head) {
  const { result, output } = publicAuditInvocation(root, head);
  try {
    const stderr = result.stderr ?? "";
    const stdout = result.stdout ?? "";
    if (
      result.error ||
      result.status !== 0 ||
      stderr !== "" ||
      !new RegExp(
        `^D2_PUBLICATION_BUNDLE_OK ${head} 123 [0-9a-f]{64}\\n$`,
        "u"
      ).test(stdout) ||
      !existsSync(output)
    ) {
      fail(
        "D2_SELF_TEST_FAILED",
        `public CLI acceptance status=${result.status} stdout=${JSON.stringify(stdout)} stderr=${JSON.stringify(stderr)}`
      );
    }
    const issued = parseJsonBytes(
      readFileSync(output),
      "self-test public issued bundle",
      true
    );
    validateIssuedBundle(issued);
  } finally {
    if (existsSync(output)) unlinkSync(output);
    const temporaryPrefix = `${output}.tmp-`;
    for (const name of readdirSync(dirname(output))) {
      const candidate = join(dirname(output), name);
      if (candidate.startsWith(temporaryPrefix) && existsSync(candidate)) {
        unlinkSync(candidate);
      }
    }
  }
}

function computeClosedSchemaMaximumJsonNestingDepth(values) {
  let maximum = 0;
  for (const [index, value] of values.entries()) {
    maximum = Math.max(
      maximum,
      preflightRawJsonNestingDepth(
        canonicalBytes(value).toString("utf8"),
        `closed schema witness ${index}`,
        Number.MAX_SAFE_INTEGER
      )
    );
  }
  return maximum;
}

function closedSchemaDepthWitnesses(head, captures, acquisition, draft, issuedBundle) {
  return [
    ...captures,
    acquisition,
    draft,
    issuedBundle,
    {
      artifacts: [
        {
          id: 11,
          name: `d2-linux-domain-core-rest-${head}`,
          size_in_bytes: 1,
          expired: false,
          expires_at: "2026-08-14T00:00:00.000Z",
          archive_download_url:
            "https://api.github.com/repos/example/repository/actions/artifacts/11/zip",
          workflow_run: { id: 123, head_sha: head }
        }
      ]
    },
    {
      schemaVersion: "botc-vitest-segment-evidence-v1",
      taskEvidence: {
        expectedSelectedIdentities: [
          ["domain-core", "example.test.ts", ["suite"], "case"]
        ]
      }
    }
  ];
}

function assertInternalErrorExitBoundary() {
  const result = spawnSync(
    process.execPath,
    [resolve("scripts/verify-p2f1r-d2-publication-evidence.mjs"), "self-test"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        ...process.env,
        BOTC_D2_SELF_TEST_INTERNAL_FAILURE: "1"
      },
      maxBuffer: 1024 * 1024,
      windowsHide: true,
      shell: false
    }
  );
  if (
    result.error ||
    result.status !== 2 ||
    result.stdout !== "" ||
    result.stderr !== "D2_INTERNAL_ERROR\n"
  ) {
    fail("D2_SELF_TEST_FAILED", "internal error exit boundary");
  }
}

function headContainsCurrentMechanismBytes(head) {
  for (const path of [
    "scripts/verify-p2f1r-d2-publication-evidence.mjs",
    ".github/workflows/ci.yml"
  ]) {
    const headBlob = spawnSync("git", ["rev-parse", `${head}:${path}`], {
      cwd: process.cwd(),
      encoding: "utf8",
      windowsHide: true,
      shell: false
    });
    const workingBlob = spawnSync(
      "git",
      ["hash-object", `--path=${path}`, path],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        windowsHide: true,
        shell: false
      }
    );
    if (
      headBlob.error ||
      workingBlob.error ||
      headBlob.status !== 0 ||
      workingBlob.status !== 0 ||
      headBlob.stdout.trim() !== workingBlob.stdout.trim()
    ) {
      return false;
    }
  }
  return true;
}

function withPublicAuditFixture(head, mutate, assert) {
  const root = mkdtempSync(join(tmpdir(), "botc-d2-public-audit-"));
  try {
    const fixture = materializePublicAuditFixture(root, head);
    mutate(root, fixture);
    assert(root, fixture);
  } finally {
    const output = resolve(
      "docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json"
    );
    if (existsSync(output)) unlinkSync(output);
    rmSync(root, { recursive: true, force: true });
  }
  if (existsSync(root)) fail("D2_SELF_TEST_FAILED", "public fixture residue");
}

function corruptStoredZipAsInvalidDeflate(bytes) {
  const result = Buffer.from(bytes);
  const eocd = result.length - 22;
  if (eocd < 0 || result.readUInt32LE(eocd) !== 0x06054b50) {
    fail("D2_INTERNAL_ERROR", "self-test zip eocd");
  }
  const centralOffset = result.readUInt32LE(eocd + 16);
  if (result.readUInt32LE(centralOffset) !== 0x02014b50) {
    fail("D2_INTERNAL_ERROR", "self-test zip central");
  }
  const localOffset = result.readUInt32LE(centralOffset + 42);
  if (result.readUInt32LE(localOffset) !== 0x04034b50) {
    fail("D2_INTERNAL_ERROR", "self-test zip local");
  }
  result.writeUInt16LE(8, centralOffset + 10);
  result.writeUInt16LE(8, localOffset + 8);
  return result;
}

function corruptStoredZipCentralSignature(bytes) {
  const result = Buffer.from(bytes);
  const eocd = result.length - 22;
  if (eocd < 0 || result.readUInt32LE(eocd) !== 0x06054b50) {
    fail("D2_INTERNAL_ERROR", "self-test zip eocd");
  }
  const centralOffset = result.readUInt32LE(eocd + 16);
  result.writeUInt32LE(0, centralOffset);
  return result;
}

function selfTestBundle(head, captures) {
  const workflow = {
    recordId: "workflow-ci-push",
    workflowName: "CI",
    event: "push",
    runId: "123",
    runAttempt: 1,
    headSha: head,
    status: "completed",
    conclusion: "success",
    htmlUrl: "https://github.com/example/repository/actions/runs/123",
    createdAtUtc: "2026-08-07T00:00:00.000Z",
    updatedAtUtc: "2026-08-07T00:10:00.000Z"
  };
  const jobs = ["linux", "windows"].map((platform, index) => {
    const capture = captures[index];
    return {
      recordId: `job-${platform}`,
      workflowRef: "workflow-ci-push",
      workflowJobId: platform === "linux" ? "test-shard" : "deterministic-windows",
      providerDisplayName: platform === "linux"
        ? "test shard (domain-core-rest)"
        : "deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice/snake-charmer/evil-twin/witch/dreamer/clockmaker",
      jobDatabaseId: platform === "linux" ? "456" : "789",
      platform,
      runnerOs: capture.runner.os,
      runnerArch: "X64",
      imageOs: capture.runner.imageOs,
      imageVersion: capture.runner.imageVersion,
      nodeVersion: "v24.15.0",
      pnpmVersion: "11.7.0",
      vitestVersion: "3.2.6",
      commandArgv: [...COMMAND_ARGV],
      startedAtUtc: platform === "linux" ? "2026-08-07T00:01:00.000Z" : "2026-08-07T00:02:00.000Z",
      completedAtUtc: platform === "linux" ? "2026-08-07T00:05:00.000Z" : "2026-08-07T00:06:00.000Z",
      processStartedAtUnixMs: 1000,
      processEndedAtUnixMs: 2000,
      conclusion: "success",
      processExitCode: 0,
      logicalGroupId: "domain-core-rest",
      mode: "ordinary",
      selectedIdentityCount: 503,
      selectedIdentitySha256: "1".repeat(64),
      failedCount: 0,
      skippedCount: 0,
      todoCount: 0,
      globalErrorCount: 0,
      manifestSha256: "2".repeat(64),
      verificationReportSha256: "3".repeat(64),
      captureSha256: platform === "linux" ? "5".repeat(64) : "6".repeat(64),
      artifactRef: `artifact-${platform}`,
      logRef: `log-${platform}`
    };
  });
  return {
    schemaVersion: BUNDLE_SCHEMA_VERSION,
    sourceHead: head,
    parentArtifactHead: PARENT_ARTIFACT_HEAD,
    parentEvidenceHead: PARENT_EVIDENCE_HEAD,
    workflow,
    ancestry: {
      recordId: "ancestry-proof",
      settledBaselineHead: SETTLED_BASELINE_HEAD,
      ruleEvidenceHead: RULE_EVIDENCE_HEAD,
      acceptedProfileSourceHead: ACCEPTED_PROFILE_SOURCE_HEAD,
      components: ["linux", "windows"].map((platform, index) => ({ recordId: `ancestry-${platform}`, jobRef: `job-${platform}`, platform, checkoutHead: head, githubSha: head, ...Object.fromEntries(ANCESTRY_KEYS.slice(1).map((key) => [key, captures[index].ancestry[key]])) }))
    },
    jobs,
    artifacts: ["linux", "windows"].map((platform, index) => ({
      recordId: `artifact-${platform}`,
      jobRef: `job-${platform}`,
      artifactId: platform === "linux" ? "11" : "12",
      name: `d2-${platform}-domain-core-rest-${head}`,
      sourceHead: head,
      retentionDays: 7,
      expiresAtUtc: "2026-08-14T00:00:00.000Z",
      sizeInBytes: 100,
      downloadedFileCount: 2,
      downloadedTreeSha256: index === 0 ? "7".repeat(64) : "8".repeat(64),
      captureFileSha256: jobs[index].captureSha256
    })),
    logs: ["linux", "windows"].map((platform, index) => ({ recordId: `log-${platform}`, jobRef: `job-${platform}`, jobDatabaseId: jobs[index].jobDatabaseId, downloadUrl: `https://api.github.com/repos/example/repository/actions/jobs/${jobs[index].jobDatabaseId}/logs`, byteLength: 100, downloadedBlobSha256: index === 0 ? "9".repeat(64) : "a".repeat(64) })),
    retention: { policy: "GITHUB_ACTIONS_ARTIFACT_RETENTION", retentionDays: 7, hostedAvailability: "EXPIRES_AFTER_RETENTION", historicalBinding: "HASH_REMAINS_AFTER_EXPIRY" },
    catalogReconciliation: { recordId: "catalog-support", path: CATALOG_PATH, blobOid: "4f9a376e56f19b241d76ce2a75be83b70859ae25", rawLength: 264855, rawSha256: "e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6", lfCount: 626, windowsCheckoutLength: 265481, windowsCheckoutSha256: "7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7", classification: "LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY", runtimeAuthority: false },
    designExpectedBindings: D16_EXPECTED.map((item) => ({ ...item })),
    d3Handoff: {
      recordId: "d3-handoff",
      designAuthorityPath: DESIGN_PATH,
      designAuthorityCommit: "b".repeat(40),
      designAuthorityBlobSha256: "c".repeat(64),
      sourceHeadRef: "source-head",
      parentArtifactHeadRef: "parent-artifact-head",
      parentEvidenceHeadRef: "parent-evidence-head",
      workflowRef: "workflow-ci-push",
      jobRefs: ["job-linux", "job-windows"],
      artifactRefs: ["artifact-linux", "artifact-windows"],
      logRefs: ["log-linux", "log-windows"],
      bundleRef: "d2-final-bundle",
      archiveCategories: ["E2_FINAL_EVIDENCE_BUNDLE", "H_SOURCE_STATUS_RECORD", "FINAL_CODE_REVIEW_VERBATIM", "FINAL_RULE_REVIEW_VERBATIM"],
      deleteAfterD3Categories: ["TEMPORARY_VERIFIER", "D2_WORKFLOW_STEPS_AND_CHECKOUT_DELTAS", "TEMPORARY_D2_BRANCH", "LOCAL_DOWNLOADED_ARTIFACTS", "RAW_JOB_LOGS", "TEMPORARY_WORKTREES", "ACQUISITION_ROOT_AND_MANIFEST", "SELF_TEST_NEGATIVE_FIXTURES"],
      keepOperationalAssetCount: 0,
      cleanupRequired: true
    },
    finalStructuralVerdict: "D2_PUBLICATION_EVIDENCE_BUNDLE_VALID"
  };
}

function selfTestIssuedBundleFixture(bundle) {
  const bindings = ["D-C16A", "D-C16B"].map((criterionId) => Object.fromEntries(
    ACTUAL_BINDING_KEYS.map((key) => [key, expectedActualValue(
      criterionId,
      key,
      bundle.sourceHead,
      bundle.workflow.runId,
      bundle.workflow.runAttempt
    )])
  ));
  return completeBundleDraft(clone(bundle), bindings);
}

function validateCanonicalFixture(value, validator, label) {
  const bytes = canonicalBytes(value);
  const parsed = parseJsonBytes(bytes, label, true);
  validator(parsed);
  if (!canonicalBytes(parsed).equals(bytes)) {
    fail("D2_SELF_TEST_FAILED", `${label} canonical reread`);
  }
  return parsed;
}

function validateArtifactHash(actual, expected, label) {
  validateSha256(actual, label);
  if (actual !== expected) fail("D2_ARTIFACT_SHA_MISMATCH", label);
}

function expectNegativeClass(category, expectedCode, runRow, diagnostics) {
  try {
    runRow();
    fail("D2_SELF_TEST_FAILED", `${category} unexpectedly accepted`);
  } catch (error) {
    if (!(error instanceof D2Error) || error.code !== expectedCode) {
      throw error;
    }
    diagnostics.push(`${category}\t${expectedCode}`);
  }
}

function expectIdentityFailure(label, runRow) {
  try {
    runRow();
    fail("D2_SELF_TEST_FAILED", `${label} unexpectedly accepted`);
  } catch (error) {
    if (!(error instanceof D2Error) || error.code !== "D2_PLATFORM_JOB_MAPPING_MISMATCH") {
      throw error;
    }
  }
}

function runSelfTestMode(argv) {
  if (argv.length !== 0) fail("D2_INVALID_ARGUMENTS");
  const head = git(["rev-parse", "HEAD"]);
  validateSha40(head, "self-test source head");
  const authority = resolveDesignAuthority(head);
  const designBytes = run(
    "git",
    ["cat-file", "blob", `${authority.commit}:${DESIGN_PATH}`],
    { code: "D2_ANCESTRY_UNPROVABLE" }
  );
  validateDesignAuthorityDocument(designBytes);

  const captures = [
    selfTestCapture("linux", head),
    selfTestCapture("windows", head)
  ];
  const acquisition = selfTestAcquisition(head);
  const draft = selfTestBundle(head, captures);
  draft.d3Handoff.designAuthorityCommit = authority.commit;
  draft.d3Handoff.designAuthorityBlobSha256 = authority.digest;
  acquisition.artifactTrees.forEach((tree, index) => {
    tree.canonicalTreeSha256 = draft.artifacts[index].downloadedTreeSha256;
  });
  acquisition.jobLogs.forEach((log, index) => {
    const bytes = selfTestAcquisitionBlob(log);
    draft.logs[index].downloadedBlobSha256 = sha256(bytes);
  });

  const verifierBytes = readFileSync(
    resolve("scripts/verify-p2f1r-d2-publication-evidence.mjs")
  );
  const workflowBytes = readFileSync(resolve(".github/workflows/ci.yml"));
  validateMechanismLocators(verifierBytes, workflowBytes);
  validateDesignAuthorityBinding(draft, authority);
  if (!sameJson(resolveDesignAuthority(head), authority)) {
    fail("D2_SELF_TEST_FAILED", "external design authority");
  }

  validateCanonicalFixture(captures[0], validateCapture, "positive Linux Capture");
  validateCanonicalFixture(captures[1], validateCapture, "positive Windows Capture");
  validateCanonicalFixture(
    acquisition,
    validateAcquisitionManifest,
    "positive AcquisitionManifest"
  );
  for (const record of acquisitionBlobRecords(acquisition)) {
    validateAcquisitionBlob(record, selfTestAcquisitionBlob(record));
  }
  validateCanonicalFixture(draft, validateBundleDraft, "positive Bundle draft");

  const root = mkdtempSync(join(tmpdir(), "botc-d2-self-test-minimal-"));
  const output = join(root, "d2-final-bundle.json");
  let issuedBundle;
  try {
    const instrumentation = {
      actualBuilderCalls: 0,
      actualRecordsConstructed: 0,
      mechanism: { verifier: verifierBytes, workflow: workflowBytes }
    };
    const issued = issueFinalBundleAtomically(
      output,
      clone(draft),
      clone(captures),
      instrumentation
    );
    issuedBundle = issued.bundle;
    if (
      instrumentation.actualBuilderCalls !== 1 ||
      instrumentation.actualRecordsConstructed !== 2 ||
      !canonicalBytes(issuedBundle).equals(readFileSync(output)) ||
      existsSync(`${output}.tmp-${process.pid}`)
    ) {
      fail("D2_SELF_TEST_FAILED", "positive atomic issuance");
    }
    const expectedActuals = selfTestIssuedBundleFixture(draft).actualBindings;
    if (!sameJson(issuedBundle.actualBindings, expectedActuals)) {
      fail("D2_SELF_TEST_FAILED", "positive exact A/B Actuals");
    }
    validateIssuedBundle(issuedBundle);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  if (existsSync(root)) fail("D2_SELF_TEST_FAILED", "positive root residue");

  const schemaMaxDepth = computeClosedSchemaMaximumJsonNestingDepth(
    closedSchemaDepthWitnesses(
      head,
      captures,
      acquisition,
      draft,
      issuedBundle
    )
  );
  if (schemaMaxDepth !== CONFIGURED_MAX_VALID_JSON_NESTING_DEPTH) {
    fail(
      "D2_SELF_TEST_FAILED",
      `json depth authority configured=${CONFIGURED_MAX_VALID_JSON_NESTING_DEPTH} computed=${schemaMaxDepth}`
    );
  }
  const depthBoundaryHead = head;
  const exactHeadPositiveBoundary = headContainsCurrentMechanismBytes(head);

  if (exactHeadPositiveBoundary) {
    withPublicAuditFixture(
      depthBoundaryHead,
      () => undefined,
      (fixtureRoot) =>
        assertPublicAuditAcceptance(fixtureRoot, depthBoundaryHead)
    );

    withPublicAuditFixture(
      depthBoundaryHead,
      (fixtureRoot) => {
        const path = join(fixtureRoot, "api", "run.json");
        const provider = parseJsonBytes(
          readFileSync(path),
          "self-test exact-max provider",
          true
        );
        provider.depthWitness = [[[[0]]]];
        provider.stringWitness =
          'brackets [[[]]] {{{}}} escaped quote \\" and backslash \\\\ remain text';
        const bytes = canonicalBytes(provider);
        const observedDepth = preflightRawJsonNestingDepth(
          bytes.toString("utf8"),
          "self-test exact-max provider"
        );
        if (observedDepth !== schemaMaxDepth) {
          fail("D2_SELF_TEST_FAILED", "exact max depth fixture");
        }
        rewritePublicAuditBlob(fixtureRoot, "api/run.json", bytes);
      },
      (fixtureRoot) =>
        assertPublicAuditAcceptance(fixtureRoot, depthBoundaryHead)
    );
  } else {
    const precommitExactMax = canonicalBytes({
      depthWitness: [[[[0]]]],
      stringWitness:
        'brackets [[[]]] {{{}}} escaped quote \\" and backslash \\\\ remain text'
    }).toString("utf8");
    if (
      preflightRawJsonNestingDepth(
        precommitExactMax,
        "self-test precommit exact-max provider"
      ) !== schemaMaxDepth
    ) {
      fail("D2_SELF_TEST_FAILED", "precommit exact max depth fixture");
    }
  }

  withPublicAuditFixture(
    depthBoundaryHead,
    (fixtureRoot) => {
      writeFileSync(
        join(fixtureRoot, "acquisition-manifest.json"),
        Buffer.from(
          `${"[".repeat(schemaMaxDepth + 1)}0${"]".repeat(schemaMaxDepth + 1)}\n`,
          "utf8"
        )
      );
    },
    (fixtureRoot) =>
      assertPublicAuditRejection(
        fixtureRoot,
        depthBoundaryHead,
        "D2_TYPE_INVALID",
        "acquisition manifest json nesting depth"
      )
  );

  withPublicAuditFixture(
    depthBoundaryHead,
    (fixtureRoot) => {
      const bytes = Buffer.from(
        `${"[".repeat(12_000)}0${"]".repeat(12_000)}\n`,
        "utf8"
      );
      rewritePublicAuditBlob(fixtureRoot, "api/run.json", bytes);
    },
    (fixtureRoot) =>
      assertPublicAuditRejection(
        fixtureRoot,
        depthBoundaryHead,
        "D2_TYPE_INVALID",
        "provider run json nesting depth"
      )
  );

  withPublicAuditFixture(
    depthBoundaryHead,
    (fixtureRoot) => {
      const path = join(fixtureRoot, "api", "run.json");
      const duplicate = readFileSync(path)
        .toString("utf8")
        .replace("{\n", '{\n  "id": 123,\n');
      rewritePublicAuditBlob(
        fixtureRoot,
        "api/run.json",
        Buffer.from(duplicate, "utf8")
      );
    },
    (fixtureRoot) =>
      assertPublicAuditRejection(
        fixtureRoot,
        depthBoundaryHead,
        "D2_DUPLICATE_ID",
        "provider run"
      )
  );

  assertInternalErrorExitBoundary();

  const diagnostics = [];
  expectNegativeClass("N1_WRONG_SOURCE_HEAD", "D2_SOURCE_HEAD_MISMATCH", () => {
    const value = clone(issuedBundle);
    value.workflow.headSha = "0".repeat(40);
    validateIssuedBundle(value);
  }, diagnostics);
  expectNegativeClass("N2_MISSING_REQUIRED_JOB", "D2_CARDINALITY_INVALID", () => {
    const value = clone(issuedBundle);
    value.jobs = [value.jobs[0]];
    validateBundleShape(value, true);
  }, diagnostics);
  expectNegativeClass("N3_WRONG_ARTIFACT_SHA", "D2_ARTIFACT_SHA_MISMATCH", () => {
    const value = clone(draft);
    value.jobs[0].manifestSha256 = "f".repeat(64);
    validateD16A(value, clone(captures));
  }, diagnostics);
  expectNegativeClass(
    "N4_WRONG_PLATFORM_JOB_MAPPING",
    "D2_PLATFORM_JOB_MAPPING_MISMATCH",
    () => {
      const value = clone(draft);
      value.jobs[0].platform = "windows";
      validateD16A(value, clone(captures));
    },
    diagnostics
  );
  expectNegativeClass("N5_SHALLOW_UNPROVABLE_ANCESTRY", "D2_ANCESTRY_UNPROVABLE", () => {
    const value = clone(captures[0]);
    value.ancestry.repositoryIsShallow = true;
    validateCapture(value);
  }, diagnostics);
  expectNegativeClass(
    "N6_MISSING_REQUIRED_FIELD",
    "D2_BUNDLE_REQUIRED_FIELD_MISSING",
    () => {
      const value = clone(issuedBundle);
      delete value.workflow.runId;
      validateIssuedBundle(value);
    },
    diagnostics
  );
  expectNegativeClass(
    "N7_UNEXPECTED_EXTRA_FIELD",
    "D2_BUNDLE_UNEXPECTED_FIELD",
    () => {
      const value = clone(issuedBundle);
      value.unexpected = true;
      validateIssuedBundle(value);
    },
    diagnostics
  );

  if (diagnostics.length !== 7) {
    fail("D2_SELF_TEST_FAILED", "negative class census");
  }

  const truncatedDisplayValue = clone(draft);
  truncatedDisplayValue.jobs[1].providerDisplayName =
    truncatedDisplayValue.jobs[1].providerDisplayName.slice(0, 100);
  validateD16A(truncatedDisplayValue, clone(captures));

  const wrongLogicalWithExpectedDisplay = clone(draft);
  wrongLogicalWithExpectedDisplay.jobs[1].workflowJobId = "test-shard";
  wrongLogicalWithExpectedDisplay.jobs[1].providerDisplayName =
    "deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice/snake-charmer/evil-twin/witch/dreamer/clockmaker";
  expectIdentityFailure("wrong logical job id", () =>
    validateD16A(wrongLogicalWithExpectedDisplay, clone(captures))
  );

  const wrongLogicalWithCorrectNumeric = clone(draft);
  wrongLogicalWithCorrectNumeric.jobs[1].workflowJobId = "test-shard";
  expectIdentityFailure("correct numeric id with wrong logical job id", () =>
    validateD16A(wrongLogicalWithCorrectNumeric, clone(captures))
  );

  const wrongPlatform = clone(draft);
  wrongPlatform.jobs[1].platform = "linux";
  expectIdentityFailure("wrong platform", () =>
    validateD16A(wrongPlatform, clone(captures))
  );

  const wrongMatrix = clone(draft);
  wrongMatrix.jobs[0].logicalGroupId = "domain-core-rebuild";
  expectIdentityFailure("wrong Linux matrix identity", () =>
    validateD16A(wrongMatrix, clone(captures))
  );

  const boundaryRows = [
    {
      category: "N2",
      code: "D2_REQUIRED_JOB_MISSING",
      context: "acquisition-census:api",
      mutate: (fixtureRoot) =>
        rmSync(join(fixtureRoot, "api"), { recursive: true, force: true })
    },
    {
      category: "N2",
      code: "D2_REQUIRED_JOB_MISSING",
      context: "acquisition-census:api/jobs/linux.json",
      mutate: (fixtureRoot) =>
        unlinkSync(join(fixtureRoot, "api", "jobs", "linux.json"))
    },
    {
      category: "N2",
      code: "D2_TYPE_INVALID",
      context: "acquisition-census:downloads/logs/linux.bin",
      mutate: (fixtureRoot) => {
        unlinkSync(join(fixtureRoot, "downloads", "logs", "linux.bin"));
        mkdirSync(join(fixtureRoot, "downloads", "logs", "linux.bin"));
      }
    },
    {
      category: "N2",
      code: "D2_TYPE_INVALID",
      context: "acquisition-census:api/jobs",
      mutate: (fixtureRoot) => {
        rmSync(join(fixtureRoot, "api", "jobs"), {
          recursive: true,
          force: true
        });
        writeFileSync(join(fixtureRoot, "api", "jobs"), "wrong kind\n");
      }
    },
    {
      category: "N2",
      code: "D2_TYPE_INVALID",
      context: "provider run",
      mutate: (fixtureRoot) =>
        rewritePublicAuditBlob(
          fixtureRoot,
          "api/run.json",
          Buffer.from("{broken-json\n", "utf8")
        )
    },
    {
      category: "N2",
      code: "D2_TYPE_INVALID",
      context: "acquisition.acquiredAtUtc",
      mutate: (fixtureRoot) => {
        const path = join(fixtureRoot, "acquisition-manifest.json");
        const value = parseJsonBytes(
          readFileSync(path),
          "self-test acquisition manifest",
          true
        );
        value.acquiredAtUtc = "2026-99-99T00:00:00.000Z";
        writeFileSync(path, canonicalBytes(value));
      }
    },
    {
      category: "N2",
      code: "D2_REQUIRED_JOB_MISSING",
      context:
        "acquisition-census:artifacts/windows/runner-output/logical-manifest.json",
      mutate: (fixtureRoot) =>
        unlinkSync(
          join(
            fixtureRoot,
            "artifacts",
            "windows",
            "runner-output",
            "logical-manifest.json"
          )
        )
    },
    {
      category: "N3",
      code: "D2_ARTIFACT_SHA_MISMATCH",
      context: "acquisition-archive:eocd",
      mutate: (fixtureRoot) => {
        const path = join(
          fixtureRoot,
          "downloads",
          "artifacts",
          "linux.zip"
        );
        const bytes = readFileSync(path);
        rewritePublicAuditBlob(
          fixtureRoot,
          "downloads/artifacts/linux.zip",
          bytes.subarray(0, bytes.length - 1)
        );
      }
    },
    {
      category: "N3",
      code: "D2_ARTIFACT_SHA_MISMATCH",
      context: "acquisition-archive:",
      mutate: (fixtureRoot) => {
        const bytes = readFileSync(
          join(fixtureRoot, "downloads", "artifacts", "linux.zip")
        );
        rewritePublicAuditBlob(
          fixtureRoot,
          "downloads/artifacts/linux.zip",
          corruptStoredZipAsInvalidDeflate(bytes)
        );
      }
    },
    {
      category: "N3",
      code: "D2_ARTIFACT_SHA_MISMATCH",
      context: "acquisition-archive:central-entry",
      mutate: (fixtureRoot) => {
        const bytes = readFileSync(
          join(fixtureRoot, "downloads", "artifacts", "linux.zip")
        );
        rewritePublicAuditBlob(
          fixtureRoot,
          "downloads/artifacts/linux.zip",
          corruptStoredZipCentralSignature(bytes)
        );
      }
    },
    ...["api", "downloads", "artifacts"].map((directory) => ({
      category: "N7",
      code: "D2_BUNDLE_UNEXPECTED_FIELD",
      context: `acquisition-census:${directory}/unexpected.bin`,
      mutate: (fixtureRoot) =>
        writeSelfTestPath(
          fixtureRoot,
          `${directory}/unexpected.bin`,
          Buffer.from("unexpected\n", "utf8")
        )
    }))
  ];
  const boundaryCounts = { N2: 0, N3: 0, N7: 0 };
  for (const row of boundaryRows) {
    withPublicAuditFixture(
      head,
      row.mutate,
      (fixtureRoot) =>
        assertPublicAuditRejection(
          fixtureRoot,
          head,
          row.code,
          row.context
        )
    );
    boundaryCounts[row.category] += 1;
  }

  const requiredPaths = enumerateRequiredAcquisitionPaths();
  let requiredPathMutationRejectedCount = 0;
  let requiredPathMutationInternalErrorCount = 0;
  for (const { path, kind } of requiredPaths) {
    withPublicAuditFixture(
      head,
      (fixtureRoot) => {
        const target = join(fixtureRoot, ...path.split("/"));
        if (kind === "file") unlinkSync(target);
        else {
          rmSync(target, { recursive: true, force: true });
          writeFileSync(target, "wrong kind\n");
        }
      },
      (fixtureRoot) => {
        try {
          assertPublicAuditRejection(
            fixtureRoot,
            head,
            kind === "file"
              ? "D2_REQUIRED_JOB_MISSING"
              : "D2_TYPE_INVALID",
            `acquisition-census:${path}`
          );
          requiredPathMutationRejectedCount += 1;
        } catch (error) {
          if (
            error instanceof D2Error &&
            error.message.includes("D2_INTERNAL_ERROR")
          ) {
            requiredPathMutationInternalErrorCount += 1;
          }
          throw error;
        }
      }
    );
  }
  if (
    requiredPathMutationRejectedCount !== requiredPaths.length ||
    requiredPathMutationInternalErrorCount !== 0
  ) {
    fail("D2_SELF_TEST_FAILED", "required path mutation census");
  }

  let acquisitionCensus;
  withPublicAuditFixture(
    head,
    () => undefined,
    (_fixtureRoot, fixture) => {
      acquisitionCensus = fixture.census;
      if (
        acquisitionCensus.acquisitionRootCount !== 4 ||
        acquisitionCensus.requiredRecursivePathCount !== 25 ||
        acquisitionCensus.observedRecursivePathCount !== 25
      ) {
        fail(
          "D2_SELF_TEST_FAILED",
          `positive acquisition census roots=${acquisitionCensus.acquisitionRootCount} required=${acquisitionCensus.requiredRecursivePathCount} observed=${acquisitionCensus.observedRecursivePathCount}`
        );
      }
    }
  );

  process.stdout.write("D2_SELF_TEST_OK\n");
  process.stdout.write("verifierModeCount=3\n");
  process.stdout.write("negativeClassCount=7\n");
  process.stdout.write("negativeMatrixPass=7/7\n");
  process.stdout.write("unexpectedBehaviorClassCount=0\n");
  process.stdout.write(
    `acquisitionRootCount=${acquisitionCensus.acquisitionRootCount}\n`
  );
  process.stdout.write(
    `requiredRecursivePathCount=${acquisitionCensus.requiredRecursivePathCount}\n`
  );
  process.stdout.write(
    `observedRecursivePathCount=${acquisitionCensus.observedRecursivePathCount}\n`
  );
  process.stdout.write(
    `missingRecursivePathCount=${acquisitionCensus.missingRecursivePathCount}\n`
  );
  process.stdout.write(
    `unexpectedRecursivePathCount=${acquisitionCensus.unexpectedRecursivePathCount}\n`
  );
  process.stdout.write(
    `wrongKindPathCount=${acquisitionCensus.wrongKindPathCount}\n`
  );
  process.stdout.write(
    `duplicatePathCount=${acquisitionCensus.duplicatePathCount}\n`
  );
  process.stdout.write(
    `requiredPathMutationCount=${requiredPaths.length}\n`
  );
  process.stdout.write(
    `requiredPathMutationRejectedCount=${requiredPathMutationRejectedCount}\n`
  );
  process.stdout.write(
    `requiredPathMutationInternalErrorCount=${requiredPathMutationInternalErrorCount}\n`
  );
  process.stdout.write(`N2Boundary=${boundaryCounts.N2}/7\n`);
  process.stdout.write(`N3Boundary=${boundaryCounts.N3}/3\n`);
  process.stdout.write(`N7Boundary=${boundaryCounts.N7}/3\n`);
  process.stdout.write(`depthAuthoritySource=${JSON_DEPTH_AUTHORITY_SOURCE}\n`);
  process.stdout.write(`schemaMaxDepth=${schemaMaxDepth}\n`);
  process.stdout.write(
    `configuredMaxDepth=${CONFIGURED_MAX_VALID_JSON_NESTING_DEPTH}\n`
  );
  process.stdout.write("maxDepthEqualityAudit=PASS\n");
  process.stdout.write("depthScannerRecursive=false\n");
  process.stdout.write("depthScannerBeforeDuplicateScan=true\n");
  process.stdout.write("depthScannerBeforeJsonParse=true\n");
  process.stdout.write("depthScannerBeforeSchemaTraversal=true\n");
  process.stdout.write(
    `standardFixtureBoundary=${exactHeadPositiveBoundary ? "PASS_PUBLIC_CLI" : "PENDING_EXACT_HEAD_COMMIT"}\n`
  );
  process.stdout.write(
    `maxDepthValidBoundary=${exactHeadPositiveBoundary ? "PASS_PUBLIC_CLI" : "PASS_PREFLIGHT_PENDING_EXACT_HEAD_COMMIT"}\n`
  );
  process.stdout.write("maxDepthPlusOneBoundary=PASS_EXIT1\n");
  process.stdout.write("deep12000Boundary=PASS_EXIT1\n");
  process.stdout.write(
    `stringBracketEscapeBoundary=${exactHeadPositiveBoundary ? "PASS_PUBLIC_CLI" : "PASS_PREFLIGHT_PENDING_EXACT_HEAD_COMMIT"}\n`
  );
  process.stdout.write("duplicateKeyRegression=PASS_EXIT1\n");
  process.stdout.write("malformedJsonRegression=PASS_EXIT1\n");
  process.stdout.write("internalErrorExit2Regression=PASS\n");
  process.stdout.write("depthFailureSemanticCode=D2_TYPE_INVALID\n");
  process.stdout.write("depthFailurePhase=RESOURCE_BOUNDARY_ADMISSION\n");
  process.stdout.write("depthFailureExitCode=1\n");
  process.stdout.write("deepInputLeaksStack=false\n");
  process.stdout.write("semanticFailureBranchCount=1\n");
  process.stdout.write("internalFailureBranchCount=1\n");
  process.stdout.write(
    `knownInputFailuresMappedToExit1=${boundaryRows.length + requiredPaths.length + 3}\n`
  );
  process.stdout.write("knownInputFailuresReachingExit2=0\n");
  process.stdout.write(`bundleSchemaVersion=${BUNDLE_SCHEMA_VERSION}\n`);
  process.stdout.write("logicalJobIdentityAudit=PASS\n");
  process.stdout.write("numericJobInstanceIdAudit=PASS\n");
  process.stdout.write("providerDisplayNameNonAuthorityAudit=PASS\n");
  process.stdout.write("truncatedDisplayNameCase=PASS\n");
  process.stdout.write("wrongLogicalJobCase=FAIL_CLOSED\n");
  process.stdout.write("correctNumericWrongLogicalCase=FAIL_CLOSED\n");
  process.stdout.write("wrongPlatformCase=FAIL_CLOSED\n");
  process.stdout.write("wrongMatrixCase=FAIL_CLOSED\n");
  process.stdout.write("prefixMatchingAllowed=false\n");
  process.stdout.write("displayNameNormalizationAllowed=false\n");
  process.stdout.write("canonicalSerialization=PASS\n");
  process.stdout.write(
    `D2_SELF_TEST_DIAGNOSTICS ${sha256(
      Buffer.from(`${diagnostics.join("\n")}\n`, "utf8")
    )}\n`
  );
}

function main() {
  const [mode, ...argv] = process.argv.slice(2);
  if (
    mode === "self-test" &&
    process.env.BOTC_D2_SELF_TEST_INTERNAL_FAILURE === "1"
  ) {
    throw new Error("self-test internal failure injection");
  }
  if (mode === "self-test") runSelfTestMode(argv);
  else if (mode === "capture-runner") runCaptureRunnerMode(argv);
  else if (mode === "audit-bundle") runAuditBundleMode(argv);
  else fail("D2_INVALID_ARGUMENTS");
}

try {
  main();
} catch (error) {
  if (error instanceof D2Error) {
    process.stderr.write(
      `${error.code}${error.message ? ` ${error.message}` : ""}\n`
    );
    process.exitCode = 1;
  } else {
    process.stderr.write("D2_INTERNAL_ERROR\n");
    process.exitCode = 2;
  }
}
