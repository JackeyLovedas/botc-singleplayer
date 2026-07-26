import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdtempSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
  writeSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { Writable } from "node:stream";
import { TextDecoder } from "node:util";
import { createVitest } from "vitest/node";
import {
  ACCEPTED_AUTHORITY_SUPERSESSIONS,
  ACCEPTED_CONTRACT_BASELINES,
  IDENTITY_ENCODING_VERSION,
  OwnershipContractError,
  auditOwnershipContracts,
  build2B20ACandidate,
  candidateBytes,
  canonicalizeStructuredVitestIdentities,
  sha256CanonicalLines,
  validateAcceptedAuthoritySupersessionRegistry,
  validateAcceptedAuthoritySupersessions,
  validateOwnershipContracts
} from "./vitest-ownership-contracts.mjs";

const APPLICATION_FILE = "packages/application/src/synthetic.test.ts";
const LEGACY_PROJECTS = Object.freeze(["legacy-a", "legacy-b"]);
const NON_OWNED_POLICY =
  "GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS";
const ZERO_SHA256 = "0".repeat(64);

class CandidateLifecycleError extends Error {
  constructor(code, details = "", diagnostics = []) {
    super(details.length === 0 ? code : `${code}: ${details}`);
    this.name = "CandidateLifecycleError";
    this.code = code;
    this.diagnostics = diagnostics;
  }
}

function candidateFail(code, details = "", diagnostics = []) {
  throw new CandidateLifecycleError(code, details, diagnostics);
}

const DIAGNOSTIC_KEYS = Object.freeze([
  "phase",
  "classification",
  "source",
  "ordinal",
  "name",
  "message"
]);
const DIAGNOSTIC_SOURCES = Object.freeze([
  "PUBLIC_PROMISE_REJECTION",
  "PUBLIC_INJECTED_STDERR",
  "PUBLIC_INJECTED_STDERR_CAPTURE"
]);

function safeDiagnosticMessage(value) {
  const rawMessage =
    value instanceof Error ? value.message : value === null ? "" : String(value);
  return rawMessage
    .replace(/\r\n/gu, "\n")
    .replace(/\r/gu, "\n")
    .replaceAll(path.resolve(process.cwd()), "<repo>")
    .replaceAll(path.resolve(tmpdir()), "<temp>")
    .slice(0, 500);
}

function lifecycleDiagnostic({
  phase,
  classification,
  source,
  ordinal,
  error = null,
  name,
  message
}) {
  if (
    typeof phase !== "string" ||
    phase.length === 0 ||
    typeof classification !== "string" ||
    classification.length === 0 ||
    !DIAGNOSTIC_SOURCES.includes(source) ||
    !Number.isSafeInteger(ordinal) ||
    ordinal < 0
  ) {
    throw new Error("Invalid lifecycle diagnostic");
  }
  return {
    phase,
    classification,
    source,
    ordinal,
    name: safeDiagnosticMessage(
      name ?? (error instanceof Error ? error.name : "")
    ),
    message: safeDiagnosticMessage(message ?? error)
  };
}

function lifecycleDiagnosticBytes(diagnostics) {
  const lines = diagnostics.map((diagnostic) => {
    if (
      Object.keys(diagnostic).join(",") !== DIAGNOSTIC_KEYS.join(",") ||
      !DIAGNOSTIC_SOURCES.includes(diagnostic.source)
    ) {
      throw new Error("Invalid external lifecycle diagnostic shape");
    }
    return JSON.stringify(diagnostic);
  });
  return Buffer.from(lines.length === 0 ? "" : `${lines.join("\n")}\n`, "utf8");
}

function writeLifecycleDiagnostics(diagnostics, writable = process.stderr) {
  const bytes = lifecycleDiagnosticBytes(diagnostics);
  if (bytes.length > 0) writable.write(bytes);
  return bytes;
}

function writeCandidateFailure(error, writable = process.stderr) {
  if (
    error instanceof CandidateLifecycleError &&
    error.diagnostics.length > 0
  ) {
    return writeLifecycleDiagnostics(error.diagnostics, writable);
  }
  const code = error?.code;
  const message =
    typeof code === "string"
      ? code
      : error instanceof Error
        ? error.stack ?? error.message
        : String(error);
  const bytes = Buffer.from(`${message}\n`, "utf8");
  writable.write(bytes);
  return bytes;
}

function createPhaseCapture(phaseState) {
  const records = [];
  let ordinal = 0;
  const writable = new Writable({
    write(chunk, encoding, callback) {
      let bytes;
      try {
        bytes =
          typeof chunk === "string"
            ? Buffer.from(chunk, encoding)
            : Buffer.isBuffer(chunk) || chunk instanceof Uint8Array
              ? Buffer.from(chunk)
              : null;
        records.push({
          ordinal,
          phase: phaseState.phase,
          bytes,
          encoding: typeof encoding === "string" ? encoding : "",
          sha256:
            bytes === null
              ? null
              : createHash("sha256").update(bytes).digest("hex")
        });
        ordinal += 1;
        callback();
      } catch (error) {
        callback(error);
      }
    }
  });
  return { records, writable };
}

function classifyClosingCapture(records) {
  const decoder = new TextDecoder("utf-8", { fatal: true });
  return records
    .filter((record) => record.phase === "CLOSING")
    .map((record) => {
      if (record.bytes === null) {
        return {
          ...record,
          classification: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID",
          source: "PUBLIC_INJECTED_STDERR_CAPTURE",
          text: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID",
          isCloseError: true
        };
      }
      let text;
      try {
        text = decoder.decode(record.bytes);
      } catch {
        return {
          ...record,
          classification: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID",
          source: "PUBLIC_INJECTED_STDERR_CAPTURE",
          text: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID",
          isCloseError: true
        };
      }
      const normalized = text
        .replace(/\r\n/gu, "\n")
        .replace(/\r/gu, "\n")
        .replace(/\n+$/gu, "");
      if (normalized.length === 0) {
        return {
          ...record,
          classification: "EMPTY_FORMATTING",
          source: "PUBLIC_INJECTED_STDERR",
          text: "",
          isCloseError: false
        };
      }
      if (
        normalized === "error during close" ||
        /^error during close(?: |\t|\n)/u.test(normalized)
      ) {
        return {
          ...record,
          classification: "CLOSE_FAILED",
          source: "PUBLIC_INJECTED_STDERR",
          text: normalized,
          isCloseError: true
        };
      }
      return {
        ...record,
        classification: "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC",
        source: "PUBLIC_INJECTED_STDERR",
        text: normalized,
        isCloseError: false
      };
    });
}

async function executeCandidateLifecycle({
  create,
  collect,
  validate,
  encode,
  publish
}) {
  const phaseState = { phase: "CREATING" };
  const stdoutCapture = createPhaseCapture(phaseState);
  const stderrCapture = createPhaseCapture(phaseState);
  let vitest;
  let encoded;
  let primaryDiagnostic = null;
  let primaryClassification = null;
  let closeDiagnostic = null;
  let closeInvocationCount = 0;
  try {
    vitest = await create({
      stdout: stdoutCapture.writable,
      stderr: stderrCapture.writable
    });
    phaseState.phase = "COLLECTING";
    const collected = await collect(vitest);
    phaseState.phase = "VALIDATING_OR_ENCODING";
    const validated = await validate(collected);
    encoded = await encode(validated);
  } catch (error) {
    primaryDiagnostic = error;
    primaryClassification =
      vitest === undefined
        ? "CREATE_FAILED"
        : phaseState.phase === "COLLECTING"
          ? "COLLECT_FAILED"
          : "VALIDATE_OR_ENCODE_FAILED";
  } finally {
    if (vitest !== undefined) {
      phaseState.phase = "CLOSING";
      closeInvocationCount += 1;
      try {
        await vitest.close();
      } catch (error) {
        closeDiagnostic = error;
      }
    }
  }
  const closingRecords = classifyClosingCapture(stderrCapture.records);
  const closeErrors = closingRecords.filter(
    (record) => record.isCloseError
  );
  const closeNonErrors = closingRecords.filter(
    (record) =>
      record.classification === "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC"
  );
  if (
    vitest !== undefined &&
    (closeInvocationCount !== 1 ||
      closeDiagnostic !== null ||
      closeErrors.length > 0)
  ) {
    encoded = undefined;
    const diagnostics = [];
    if (primaryDiagnostic !== null) {
      diagnostics.push(
        lifecycleDiagnostic({
          phase:
            primaryClassification === "CREATE_FAILED"
              ? "CREATING"
              : primaryClassification === "COLLECT_FAILED"
                ? "COLLECTING"
                : "VALIDATING_OR_ENCODING",
          classification: primaryClassification,
          source: "PUBLIC_PROMISE_REJECTION",
          ordinal: 0,
          error: primaryDiagnostic
        })
      );
    }
    if (closeDiagnostic !== null) {
      diagnostics.push(
        lifecycleDiagnostic({
          phase: "CLOSING",
          classification: "CLOSE_FAILED",
          source: "PUBLIC_PROMISE_REJECTION",
          ordinal: 0,
          error: closeDiagnostic
        })
      );
    }
    for (const [ordinal, record] of closeErrors.entries()) {
      diagnostics.push(
        lifecycleDiagnostic({
          phase: "CLOSING",
          classification: record.classification,
          source: record.source,
          ordinal,
          name:
            record.source === "PUBLIC_INJECTED_STDERR_CAPTURE"
              ? "PublicStderrCapture"
              : "PublicStderrRecord",
          message: record.text
        })
      );
    }
    for (const [ordinal, record] of closeNonErrors.entries()) {
      diagnostics.push(
        lifecycleDiagnostic({
          phase: "CLOSING",
          classification: record.classification,
          source: record.source,
          ordinal,
          name: "PublicStderrRecord",
          message: record.text
        })
      );
    }
    candidateFail(
      "CLOSE_FAILED",
      [
        closeDiagnostic instanceof Error ? closeDiagnostic.message : "",
        ...closeErrors.map((record) => record.text)
      ].filter(Boolean).join(" | "),
      diagnostics
    );
  }
  if (primaryDiagnostic !== null) {
    encoded = undefined;
    const diagnostics = [
      lifecycleDiagnostic({
        phase:
          primaryClassification === "CREATE_FAILED"
            ? "CREATING"
            : primaryClassification === "COLLECT_FAILED"
              ? "COLLECTING"
              : "VALIDATING_OR_ENCODING",
        classification: primaryClassification,
        source: "PUBLIC_PROMISE_REJECTION",
        ordinal: 0,
        error: primaryDiagnostic
      })
    ];
    for (const [ordinal, record] of closeNonErrors.entries()) {
      diagnostics.push(
        lifecycleDiagnostic({
          phase: "CLOSING",
          classification: record.classification,
          source: record.source,
          ordinal,
          name: "PublicStderrRecord",
          message: record.text
        })
      );
    }
    candidateFail(
      primaryClassification,
      primaryDiagnostic instanceof Error
        ? primaryDiagnostic.message
        : String(primaryDiagnostic),
      diagnostics
    );
  }
  if (!Buffer.isBuffer(encoded)) {
    candidateFail("VALIDATE_OR_ENCODE_FAILED", "candidate bytes are unavailable");
  }
  phaseState.phase = "PUBLISHING";
  await publish(encoded);
  phaseState.phase = "SUCCEEDED";
  return {
    bytes: encoded,
    closeInvocationCount,
    closingRecords,
    closeNonErrors,
    diagnostics: closeNonErrors.map((record, ordinal) =>
      lifecycleDiagnostic({
        phase: "CLOSING",
        classification: record.classification,
        source: record.source,
        ordinal,
        name: "PublicStderrRecord",
        message: record.text
      })
    ),
    stdoutRecords: stdoutCapture.records,
    stderrRecords: stderrCapture.records
  };
}

function canonicalModuleFile(repoRoot, moduleId) {
  if (typeof moduleId !== "string" || moduleId.length === 0) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "moduleId is missing"
    );
  }
  const absolute = path.resolve(moduleId);
  const relative = path.relative(repoRoot, absolute);
  if (
    relative.length === 0 ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      `module outside repository: ${moduleId}`
    );
  }
  return relative.split(path.sep).join("/");
}

function testAncestorPath(test, module) {
  const reversed = [];
  let parent = test.parent;
  const visited = new Set();
  while (parent !== module) {
    if (
      parent === undefined ||
      parent === null ||
      visited.has(parent) ||
      parent.type !== "suite" ||
      typeof parent.name !== "string" ||
      parent.name.length === 0
    ) {
      candidateFail(
        "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
        "malformed TestCase ancestor chain"
      );
    }
    visited.add(parent);
    reversed.push(parent.name);
    parent = parent.parent;
  }
  return reversed.reverse();
}

function assertPublicPendingTestCase(test) {
  if (
    test === null ||
    typeof test !== "object" ||
    typeof test.result !== "function"
  ) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "public TestCase.result is unavailable"
    );
  }
  let result;
  try {
    result = test.result();
  } catch {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "public TestCase.result threw"
    );
  }
  if (
    result === null ||
    typeof result !== "object" ||
    Array.isArray(result) ||
    result.state !== "pending"
  ) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "TestCase is not in the exact supported pending state"
    );
  }
  return result;
}

async function collectSemanticInventory(vitest, repoRoot) {
  if (typeof vitest.collect !== "function") {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "public collect is unavailable"
    );
  }
  const result = await vitest.collect([]);
  if (
    result === null ||
    typeof result !== "object" ||
    !Array.isArray(result.testModules) ||
    !Array.isArray(result.unhandledErrors) ||
    result.unhandledErrors.length !== 0
  ) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "malformed public collection result"
    );
  }
  const identities = [];
  const rawProjection = [];
  const seenTests = new Set();
  for (const module of result.testModules) {
    const moduleErrors =
      module !== null &&
      typeof module === "object" &&
      typeof module.errors === "function"
        ? module.errors()
        : null;
    if (
      module === null ||
      typeof module !== "object" ||
      typeof module.errors !== "function" ||
      !Array.isArray(moduleErrors) ||
      moduleErrors.length !== 0 ||
      module.children === null ||
      typeof module.children !== "object" ||
      typeof module.children.allTests !== "function"
    ) {
      candidateFail(
        "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
        "malformed TestModule"
      );
    }
    const tests = [...module.children.allTests()];
    for (const test of tests) {
      assertPublicPendingTestCase(test);
      if (
        seenTests.has(test) ||
        test.module !== module ||
        typeof test.name !== "string" ||
        test.name.length === 0 ||
        typeof test.fullName !== "string" ||
        typeof test.project?.name !== "string" ||
        test.project.name.length === 0
      ) {
        candidateFail(
          "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
          "malformed or executed TestCase"
        );
      }
      seenTests.add(test);
      const ancestorPath = testAncestorPath(test, module);
      const projectedName = [...ancestorPath, test.name].join(" > ");
      if (test.fullName !== projectedName) {
        candidateFail(
          "VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH",
          test.fullName
        );
      }
      const file = canonicalModuleFile(repoRoot, module.moduleId);
      identities.push({
        project: test.project.name,
        file,
        ancestorPath,
        title: test.name
      });
      rawProjection.push([
        test.project.name,
        file,
        test.fullName,
        test
      ]);
    }
  }
  if (identities.length !== 1572 || rawProjection.length !== identities.length) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      `expected=1572, actual=${identities.length}`
    );
  }
  const canonical = canonicalizeStructuredVitestIdentities(repoRoot, identities);
  for (const identity of canonical) {
    const nonTitleFields = [
      identity.project,
      identity.file,
      ...identity.ancestorPath
    ];
    if (
      nonTitleFields.some((field) => field.includes("\n")) ||
      [...nonTitleFields, identity.title].some((field) => field.includes("\r"))
    ) {
      candidateFail(
        "VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH",
        "LF must occur only in titles and CR is forbidden in the frozen inventory"
      );
    }
  }
  const lfTests = rawProjection.filter(([, , , test]) => test.name.includes("\n"));
  if (
    lfTests.length !== 12 ||
    lfTests.some(([, , , test]) => test.name.split("\n").length - 1 !== 2)
  ) {
    candidateFail(
      "VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH",
      `LF identities=${lfTests.length}`
    );
  }
  return canonical;
}

function assertCandidatePath(candidatePath, { mustExist }) {
  if (!path.isAbsolute(candidatePath)) {
    candidateFail("CANDIDATE_PATH_INVALID", "path must be absolute");
  }
  const resolved = path.resolve(candidatePath);
  if (path.dirname(resolved) !== path.resolve(tmpdir())) {
    candidateFail("CANDIDATE_PATH_INVALID", "parent must be the OS temp directory");
  }
  if (existsSync(resolved) !== mustExist) {
    candidateFail(
      mustExist ? "CANDIDATE_FILE_MISSING" : "CANDIDATE_OUTPUT_COLLISION",
      resolved
    );
  }
  return resolved;
}

function publishCandidateAtomically(
  finalPath,
  bytes,
  operations = {
    exists: existsSync,
    open: openSync,
    write: writeSync,
    fsync: fsyncSync,
    close: closeSync,
    rename: renameSync,
    unlink: unlinkSync
  }
) {
  const temporaryPath = path.join(
    path.dirname(finalPath),
    `.${path.basename(finalPath)}.2b20ap1.tmp`
  );
  if (operations.exists(temporaryPath)) {
    candidateFail("CANDIDATE_TEMP_COLLISION", temporaryPath);
  }
  let descriptor;
  try {
    descriptor = operations.open(temporaryPath, "wx");
    let offset = 0;
    while (offset < bytes.length) {
      const written = operations.write(
        descriptor,
        bytes,
        offset,
        bytes.length - offset
      );
      if (written <= 0) {
        candidateFail("PUBLISH_FAILED", "candidate write made no progress");
      }
      offset += written;
    }
    operations.fsync(descriptor);
    operations.close(descriptor);
    descriptor = undefined;
    operations.rename(temporaryPath, finalPath);
  } catch (error) {
    if (descriptor !== undefined) {
      try {
        operations.close(descriptor);
      } catch {
        // Preserve the primary publication error.
      }
    }
    if (operations.exists(temporaryPath)) operations.unlink(temporaryPath);
    candidateFail(
      "PUBLISH_FAILED",
      error instanceof Error ? error.message : String(error)
    );
  }
}

function parseCandidateArguments(argv) {
  if (
    argv.length === 7 &&
    argv[0] === "--emit-candidate-baseline" &&
    argv[1] === "2B20A" &&
    argv[2] === "--workspace" &&
    argv[3] === "vitest.workspace.ts" &&
    argv[4] === "--output"
  ) {
    return { mode: "emit", candidatePath: argv[5], trailing: argv[6] };
  }
  if (
    argv.length === 6 &&
    argv[0] === "--emit-candidate-baseline" &&
    argv[1] === "2B20A" &&
    argv[2] === "--workspace" &&
    argv[3] === "vitest.workspace.ts" &&
    argv[4] === "--output"
  ) {
    return { mode: "emit", candidatePath: argv[5] };
  }
  if (
    argv.length === 6 &&
    argv[0] === "--verify-candidate-baseline" &&
    argv[1] === "2B20A" &&
    argv[2] === "--workspace" &&
    argv[3] === "vitest.workspace.ts" &&
    argv[4] === "--candidate"
  ) {
    return { mode: "verify", candidatePath: argv[5] };
  }
  candidateFail("INVALID_CANDIDATE_ARGUMENTS");
}

async function runCandidateCommand(options) {
  if (options.trailing !== undefined) {
    candidateFail("INVALID_CANDIDATE_ARGUMENTS");
  }
  const repoRoot = path.resolve(process.cwd());
  const workspace = path.resolve(repoRoot, "vitest.workspace.ts");
  const candidatePath = assertCandidatePath(options.candidatePath, {
    mustExist: options.mode === "verify"
  });
  const result = await executeCandidateLifecycle({
    create: ({ stdout, stderr }) =>
      createVitest(
        "test",
        {
          root: repoRoot,
          workspace,
          run: true,
          watch: false,
          passWithNoTests: false,
          reporters: [],
          color: false
        },
        {},
        { stdout, stderr }
    ),
    collect: (vitest) => collectSemanticInventory(vitest, repoRoot),
    validate: (inventory) => inventory,
    encode: (inventory) => candidateBytes(build2B20ACandidate(repoRoot, inventory)),
    publish: async (bytes) => {
      if (options.mode === "emit") {
        publishCandidateAtomically(candidatePath, bytes);
        return;
      }
      const actual = readFileSync(candidatePath);
      if (!actual.equals(bytes)) {
        candidateFail("CANDIDATE_BASELINE_REPEAT_MISMATCH");
      }
    }
  });
  writeLifecycleDiagnostics(result.diagnostics);
  if (options.mode === "emit") process.stdout.write(result.bytes);
  else process.stdout.write("CANDIDATE_BASELINE_VERIFIED 2B20A\n");
}

function identity(project, title, ancestorPath = ["synthetic ownership"] ) {
  return { project, file: APPLICATION_FILE, ancestorPath, title };
}

function traceability(contractId, title, options = {}) {
  const criterion = options.criterion ?? "C01";
  const supportingReference = options.supportingReference ?? `SUP-${contractId}-001`;
  const mechanism = options.mechanism ?? "PASS";
  const criterionRows = options.criterionRows ?? [
    `| ${criterion} | \`${APPLICATION_FILE}\` | \`${title}\` | R1 | T1 | LAYER | ${supportingReference} | ${mechanism} | synthetic |`
  ];
  const registryRows = options.registryRows ?? [
    `| SUP-${contractId}-001 | synthetic supporting authority |`
  ];
  return `${[...criterionRows, ...registryRows].join("\n")}\n`;
}

function writeFixture(root, relative, content) {
  const destination = path.resolve(root, relative);
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, content, "utf8");
}

function encodeFields(fields) {
  return fields.map((field) => `${field.length}:${field}`).join("|");
}

function semanticKey(entry) {
  return encodeFields([
    entry.file,
    encodeFields(entry.ancestorPath),
    entry.title
  ]);
}

function makeContract({
  contractId,
  ownerProject,
  traceabilityFile,
  fullInventory,
  registeredContractIds,
  criterionIds = ["C01"],
  dynamicTestAuthorityRows = 1,
  supportingAuthorityCount = 1,
  traceabilityRowCount = criterionIds.length
}) {
  const markerPrefix = `[${contractId}-`;
  const owned = fullInventory.filter((entry) => entry.title.includes(markerPrefix));
  const semanticLines = new Map();
  for (const entry of owned) {
    semanticLines.set(
      semanticKey(entry),
      [entry.file, entry.ancestorPath.join(" > "), entry.title].join("\t")
    );
  }
  const nonOwned = fullInventory.filter(
    (entry) =>
      !registeredContractIds.some((id) => entry.title.includes(`[${id}-`))
  );
  const nonOwnedOwners = new Map();
  for (const entry of nonOwned) {
    const key = semanticKey(entry);
    const existing = nonOwnedOwners.get(key) ?? { entry, owners: new Set() };
    existing.owners.add(entry.project);
    nonOwnedOwners.set(key, existing);
  }
  const nonOwnedLines = [...nonOwnedOwners.values()].map(({ entry, owners }) =>
    [
      entry.file,
      entry.ancestorPath.join(" > "),
      entry.title,
      [...owners].sort((left, right) => (left < right ? -1 : left > right ? 1 : 0)).join(",")
    ].join("\t")
  );
  const projectLines = owned.map((entry) =>
    [entry.project, entry.file, entry.ancestorPath.join(" > "), entry.title].join("\t")
  );
  return {
    applicationTestFile: APPLICATION_FILE,
    contractId,
    criterionIds: [...criterionIds],
    frozenBaseline: {
      authorityInventorySha256: sha256CanonicalLines(
        new Set(owned.map((entry) => /^\[([^\]]+)\]/u.exec(entry.title)?.[1] ?? ""))
      ),
      currentProjectInventorySha256: sha256CanonicalLines(projectLines),
      dynamicTestAuthorityRows,
      nonMarkerOwnershipSha256: sha256CanonicalLines(nonOwnedLines),
      nonOwnedInventoryPolicy: NON_OWNED_POLICY,
      physicalTestFileSetSha256: sha256CanonicalLines(
        new Set(fullInventory.map((entry) => entry.file))
      ),
      projectExecutionsAfter: owned.length,
      projectExecutionsBefore: owned.length,
      projectInventorySha256: ZERO_SHA256,
      semanticInventorySha256: sha256CanonicalLines(semanticLines.values()),
      supportingAuthorityCount,
      traceabilityRowCount
    },
    markerPattern: `^\\[${contractId}-[^\\]]+\\]`,
    markerPrefix,
    ownerProject,
    status: "ACTIVE",
    supportingAuthorityPrefix: `SUP-${contractId}-`,
    traceabilityFile
  };
}

function expectCode(code, operation) {
  try {
    operation();
  } catch (error) {
    if (error instanceof OwnershipContractError && error.code === code) return;
    throw new Error(
      `expected ${code}; received ${error instanceof Error ? error.message : String(error)}`
    );
  }
  throw new Error(`expected ${code}; operation passed`);
}

function expectRejected(operation) {
  try {
    operation();
  } catch (error) {
    if (error instanceof OwnershipContractError) return;
    throw error;
  }
  throw new Error("expected ownership contract rejection; operation passed");
}

function audit(root, contracts, inventory) {
  return auditOwnershipContracts({
    repoRoot: root,
    contracts,
    fullInventory: inventory,
    legacyApplicationServiceProjects: LEGACY_PROJECTS
  });
}

function createFixture(root, ids = ["2BTESTA"], options = {}) {
  const legacy = identity("legacy-a", "[2BLEGACY-01] frozen accepted marker");
  const owned = ids.map((id, index) =>
    identity(`owner-${id}`, `[${id}-C01] synthetic ${index + 1}`)
  );
  const inventory = options.withoutLegacy ? [...owned] : [legacy, ...owned];
  const contracts = ids.map((id, index) => {
    const traceabilityFile = `trace/${id.toLowerCase()}.md`;
    writeFixture(root, traceabilityFile, traceability(id, owned[index].title));
    return makeContract({
      contractId: id,
      ownerProject: `owner-${id}`,
      traceabilityFile,
      fullInventory: inventory,
      registeredContractIds: ids
    });
  });
  return { contracts, inventory, legacy, owned };
}

function runSelfTest() {
  const root = mkdtempSync(path.join(tmpdir(), "botc-ownership-contracts-"));
  const results = [];
  const check = (name, operation) => {
    operation();
    results.push(name);
  };
  try {
    check("01 single contract and frozen legacy marker pass", () => {
      const fixture = createFixture(root);
      const result = audit(root, fixture.contracts, fixture.inventory);
      if (result.length !== 1 || result[0].semanticTests !== 1) {
        throw new Error("single-contract audit summary is incorrect");
      }
    });

    check("02 two non-overlapping contracts pass", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const result = audit(root, fixture.contracts, fixture.inventory);
      if (result.length !== 2) throw new Error("two-contract audit did not pass");
    });

    check("03 overlapping marker configuration rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const broad = { ...fixture.contracts[0], markerPrefix: "[2BTEST" };
      expectCode("OVERLAPPING_OWNERSHIP_MARKER_PATTERNS", () =>
        validateOwnershipContracts([broad, fixture.contracts[1]], {
          repoRoot: root
        })
      );
    });

    check("04 duplicate contractId rejects", () => {
      const fixture = createFixture(root);
      expectCode("DUPLICATE_OWNERSHIP_CONTRACT_ID", () =>
        validateOwnershipContracts([fixture.contracts[0], { ...fixture.contracts[0] }], {
          repoRoot: root
        })
      );
    });

    check("05 duplicate supporting prefix rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const hostile = {
        ...fixture.contracts[1],
        supportingAuthorityPrefix: fixture.contracts[0].supportingAuthorityPrefix
      };
      expectCode("DUPLICATE_SUPPORTING_AUTHORITY_PREFIX", () =>
        validateOwnershipContracts([fixture.contracts[0], hostile], {
          repoRoot: root
        })
      );
    });

    check("06 unknown marker addition and legacy mutation reject", () => {
      const fixture = createFixture(root);
      expectCode("UNREGISTERED_SLICE_OWNERSHIP_MARKER", () =>
        audit(root, fixture.contracts, [
          ...fixture.inventory,
          identity("legacy-a", "[2BUNKNOWN-01] new marker")
        ])
      );
      expectCode("UNREGISTERED_SLICE_OWNERSHIP_MARKER", () =>
        audit(root, fixture.contracts, [
          identity("legacy-a", "[2BLEGACY-02] changed accepted marker"),
          ...fixture.owned
        ])
      );
    });

    check("07 duplicate semantic project execution rejects", () => {
      const fixture = createFixture(root);
      expectCode("SEMANTIC_OWNERSHIP_MISMATCH", () =>
        audit(root, fixture.contracts, [
          ...fixture.inventory,
          { ...fixture.owned[0], project: "legacy-a" }
        ])
      );
    });

    check("08 wrong owner project rejects", () => {
      const fixture = createFixture(root);
      expectCode("SEMANTIC_OWNERSHIP_MISMATCH", () =>
        audit(root, fixture.contracts, [
          fixture.legacy,
          { ...fixture.owned[0], project: "legacy-a" }
        ])
      );
    });

    check("09 missing traceability file rejects", () => {
      const fixture = createFixture(root);
      const contract = {
        ...fixture.contracts[0],
        traceabilityFile: "trace/missing.md"
      };
      expectCode("OWNERSHIP_TRACEABILITY_FILE_MISSING", () =>
        audit(root, [contract], fixture.inventory)
      );
    });

    check("10 missing criterion rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        `| SUP-2BTESTA-001 | authority |\n`
      );
      expectCode("TRACEABILITY_CRITERION_MISMATCH", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("11 duplicate criterion rejects", () => {
      const fixture = createFixture(root);
      const row = `| C01 | \`${APPLICATION_FILE}\` | \`${fixture.owned[0].title}\` | R | T | L | SUP-2BTESTA-001 | PASS | note |`;
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        `${row}\n${row}\n| SUP-2BTESTA-001 | authority |\n`
      );
      expectCode("DUPLICATE_TRACEABILITY_CRITERION", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("12 missing supporting authority rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          supportingReference: "SUP-2BTESTA-002"
        })
      );
      expectCode("SUPPORTING_AUTHORITY_MISSING", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("13 unused supporting authority rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          registryRows: [
            "| SUP-2BTESTA-001 | authority |",
            "| SUP-2BTESTA-002 | unused |"
          ]
        })
      );
      expectCode("SUPPORTING_AUTHORITY_UNUSED", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("14 non-PASS MechanismMatch rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, { mechanism: "FAIL" })
      );
      expectCode("TRACEABILITY_MECHANISM_MISMATCH", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("15 non-leading authority marker rejects", () => {
      const title = "prefix [2BTESTA-C01] misplaced";
      const inventory = [identity("owner-2BTESTA", title)];
      const traceabilityFile = "trace/misplaced.md";
      writeFixture(root, traceabilityFile, traceability("2BTESTA", title));
      const contract = makeContract({
        contractId: "2BTESTA",
        ownerProject: "owner-2BTESTA",
        traceabilityFile,
        fullInventory: inventory,
        registeredContractIds: ["2BTESTA"]
      });
      expectCode("TITLE_HAS_NO_EXACT_AUTHORITY_MARKER", () =>
        audit(root, [contract], inventory)
      );
    });

    check("16 hostile and noncanonical registry shapes reject without getters", () => {
      const fixture = createFixture(root);
      const base = fixture.contracts[0];
      expectRejected(() =>
        validateOwnershipContracts([{ ...base, unknown: true }], {
          repoRoot: root
        })
      );
      let getterCalls = 0;
      const getterRecord = { ...base };
      Object.defineProperty(getterRecord, "ownerProject", {
        enumerable: true,
        get() {
          getterCalls += 1;
          return "owner-2BTESTA";
        }
      });
      expectRejected(() =>
        validateOwnershipContracts([getterRecord], { repoRoot: root })
      );
      if (getterCalls !== 0) throw new Error(`getter calls=${getterCalls}`);
      const symbolRecord = { ...base };
      symbolRecord[Symbol("hostile")] = true;
      expectRejected(() =>
        validateOwnershipContracts([symbolRecord], { repoRoot: root })
      );
      const sparse = [];
      sparse.length = 1;
      expectRejected(() =>
        validateOwnershipContracts(sparse, { repoRoot: root })
      );
      const keyedArray = [base];
      keyedArray.hostile = true;
      expectRejected(() =>
        validateOwnershipContracts(keyedArray, { repoRoot: root })
      );
      const inheritedArray = [base];
      Object.setPrototypeOf(inheritedArray, Object.create(Array.prototype));
      expectRejected(() =>
        validateOwnershipContracts(inheritedArray, { repoRoot: root })
      );
      const nonplain = Object.assign(Object.create(null), base);
      expectRejected(() =>
        validateOwnershipContracts([nonplain], { repoRoot: root })
      );
      const target = {};
      const revoked = Proxy.revocable(target, {});
      revoked.revoke();
      expectRejected(() =>
        validateOwnershipContracts(revoked.proxy, { repoRoot: root })
      );
    });

    check("17 output order is independent of registry input order", () => {
      const fixture = createFixture(root, ["2BTESTB", "2BTESTA"]);
      const forward = audit(root, fixture.contracts, fixture.inventory);
      const reverse = audit(root, [...fixture.contracts].reverse(), fixture.inventory);
      const forwardIds = forward.map((entry) => entry.contractId).join(",");
      const reverseIds = reverse.map((entry) => entry.contractId).join(",");
      if (forwardIds !== "2BTESTA,2BTESTB" || forwardIds !== reverseIds) {
        throw new Error(`unstable output order: ${forwardIds}; ${reverseIds}`);
      }
    });

    check("18 contract A cannot bind contract B semantic test", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[1].title)
      );
      expectCode("TRACEABILITY_BINDING_WRONG_OWNERSHIP_CONTRACT", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.legacy.title)
      );
      expectCode("TRACEABILITY_BINDING_WRONG_OWNERSHIP_CONTRACT", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("19 reciprocal cross-contract traceability swap rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[1].title)
      );
      writeFixture(
        root,
        fixture.contracts[1].traceabilityFile,
        traceability("2BTESTB", fixture.owned[0].title)
      );
      expectCode("TRACEABILITY_BINDING_WRONG_OWNERSHIP_CONTRACT", () =>
        audit(root, [...fixture.contracts].reverse(), fixture.inventory)
      );
    });

    check("20 registered foreign supporting authority rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          supportingReference: "SUP-2BTESTB-001"
        })
      );
      expectCode("INVALID_SUPPORTING_AUTHORITY_REFERENCE", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          registryRows: ["| SUP-2BTESTB-001 | foreign registry entry |"]
        })
      );
      expectCode("INVALID_SUPPORTING_AUTHORITY_REGISTRY_ENTRY", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("21 unregistered foreign mixed and unknown support never become zero", () => {
      const fixture = createFixture(root);
      const zeroSupportingContract = {
        ...fixture.contracts[0],
        frozenBaseline: {
          ...fixture.contracts[0].frozenBaseline,
          supportingAuthorityCount: 0
        }
      };
      for (const supportingReference of [
        "SUP-2BTESTB-001",
        "NONE SUP-2BTESTA-001",
        "UNKNOWN"
      ]) {
        writeFixture(
          root,
          zeroSupportingContract.traceabilityFile,
          traceability("2BTESTA", fixture.owned[0].title, {
            registryRows: [],
            supportingReference
          })
        );
        expectCode("INVALID_SUPPORTING_AUTHORITY_REFERENCE", () =>
          audit(root, [zeroSupportingContract], fixture.inventory)
        );
      }
    });

    check("22 duplicate active traceability file rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const duplicateFileContract = {
        ...fixture.contracts[1],
        traceabilityFile: fixture.contracts[0].traceabilityFile
      };
      expectCode("DUPLICATE_OWNERSHIP_TRACEABILITY_FILE", () =>
        validateOwnershipContracts(
          [fixture.contracts[0], duplicateFileContract],
          { repoRoot: root }
        )
      );
    });

    return results;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

async function runCompleteSelfTest() {
  const results = runSelfTest();
  const check = async (name, execute) => {
    await execute();
    results.push(name);
  };
  const expectLifecycleCode = async (code, execute) => {
    try {
      await execute();
    } catch (error) {
      if (error instanceof CandidateLifecycleError && error.code === code) {
        return error;
      }
      throw error;
    }
    throw new Error(`Expected lifecycle code ${code}`);
  };
  const parseDiagnosticBytes = (bytes) => {
    const text = bytes.toString("utf8");
    if (text.length === 0 || !text.endsWith("\n")) {
      throw new Error("diagnostic JSONL has no terminal LF");
    }
    return text.slice(0, -1).split("\n").map((line) => {
      const record = JSON.parse(line);
      if (
        Object.keys(record).join(",") !== DIAGNOSTIC_KEYS.join(",") ||
        !DIAGNOSTIC_SOURCES.includes(record.source)
      ) {
        throw new Error("diagnostic JSONL shape mismatch");
      }
      return record;
    });
  };
  const captureFailure = async (code, execute) => {
    const error = await expectLifecycleCode(code, execute);
    const chunks = [];
    const stderr = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      }
    });
    const direct = writeCandidateFailure(error, stderr);
    const captured = Buffer.concat(chunks);
    if (!captured.equals(direct)) {
      throw new Error("external diagnostic capture differs from serializer");
    }
    const records = parseDiagnosticBytes(captured);
    if (records.length !== error.diagnostics.length) {
      throw new Error("external diagnostic record count mismatch");
    }
    return { bytes: captured, error, records };
  };
  const assertDiagnostic = (actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(
        `diagnostic mismatch expected=${JSON.stringify(expected)} actual=${JSON.stringify(actual)}`
      );
    }
  };
  let realIntegrationPromise;
  let realIntegrationCollectEntries = 0;
  let realIntegrationPublishedBytes;
  const getRealIntegration = () => {
    realIntegrationPromise ??= executeCandidateLifecycle({
      create: ({ stdout, stderr }) =>
        createVitest(
          "test",
          {
            root: process.cwd(),
            workspace: path.resolve(process.cwd(), "vitest.workspace.ts"),
            run: true,
            watch: false,
            passWithNoTests: false,
            reporters: [],
            color: false
          },
          {},
          { stdout, stderr }
        ),
      collect: async (vitest) => {
        realIntegrationCollectEntries += 1;
        return collectSemanticInventory(vitest, process.cwd());
      },
      validate: (inventory) => inventory,
      encode: (inventory) =>
        candidateBytes(build2B20ACandidate(process.cwd(), inventory)),
      publish: async (bytes) => {
        realIntegrationPublishedBytes = Buffer.from(bytes);
      }
    });
    return realIntegrationPromise;
  };
  await check("23 exact supersession authority and Git provenance pass", async () => {
    if (
      ACCEPTED_AUTHORITY_SUPERSESSIONS.length !== 4 ||
      validateAcceptedAuthoritySupersessionRegistry(
        ACCEPTED_AUTHORITY_SUPERSESSIONS
      ).length !== 4 ||
      validateAcceptedAuthoritySupersessions(process.cwd()).length !== 4
    ) {
      throw new Error("supersession count mismatch");
    }
    const cloneSupersessions = () =>
      JSON.parse(JSON.stringify(ACCEPTED_AUTHORITY_SUPERSESSIONS));
    const extra = cloneSupersessions();
    extra[0].extra = true;
    let rejectedExtra = false;
    try {
      validateAcceptedAuthoritySupersessionRegistry(extra);
    } catch {
      rejectedExtra = true;
    }
    let getterCalls = 0;
    const hostile = cloneSupersessions();
    Object.defineProperty(hostile[0], "rationale", {
      enumerable: true,
      get() {
        getterCalls += 1;
        return "hostile";
      }
    });
    let rejectedGetter = false;
    try {
      validateAcceptedAuthoritySupersessionRegistry(hostile);
    } catch {
      rejectedGetter = true;
    }
    const selfEdge = cloneSupersessions();
    selfEdge[0].successor = {
      contractId: selfEdge[0].predecessor.contractId,
      criterionId: selfEdge[0].predecessor.criterionId,
      ownerProject: selfEdge[0].predecessor.ownerProject,
      file: selfEdge[0].predecessor.file,
      ancestorPath: [...selfEdge[0].predecessor.ancestorPath],
      title: selfEdge[0].predecessor.title
    };
    let rejectedSelfEdge = false;
    try {
      validateAcceptedAuthoritySupersessionRegistry(selfEdge);
    } catch {
      rejectedSelfEdge = true;
    }
    if (
      !rejectedExtra ||
      !rejectedGetter ||
      getterCalls !== 0 ||
      !rejectedSelfEdge
    ) {
      throw new Error("supersession negative validation mismatch");
    }
  });
  await check("24 candidate versions and immutable baseline order are exact", async () => {
    if (
      IDENTITY_ENCODING_VERSION !== "vitest-semantic-identity-json-tuple-v1" ||
      ACCEPTED_CONTRACT_BASELINES.map(({ contractId }) => contractId).join(",") !==
        "2B19A3A,2B19A3B1,2B19A3B2,2B19B"
    ) {
      throw new Error("candidate authority mismatch");
    }
  });
  await check("25 structured identity encoding preserves LF and ordinal order", async () => {
    const firstRoot = path.resolve(tmpdir(), "2b20ap1-self-root-a");
    const secondRoot = path.resolve(tmpdir(), "2b20ap1-self-root-b");
    const make = (root) => [
      {
        project: "p",
        file: path.join(root, "b.test.ts"),
        ancestorPath: [],
        title: "line 1\nline 2"
      },
      {
        project: "p",
        file: path.join(root, "a.test.ts"),
        ancestorPath: ["suite"],
        title: "plain"
      }
    ];
    const left = canonicalizeStructuredVitestIdentities(firstRoot, make(firstRoot));
    const right = canonicalizeStructuredVitestIdentities(secondRoot, make(secondRoot));
    const project = (value) =>
      value.map((identity) => [
        identity.project,
        identity.file,
        identity.ancestorPath,
        identity.title
      ]);
    if (JSON.stringify(project(left)) !== JSON.stringify(project(right))) {
      throw new Error("cross-root structured identities differ");
    }
  });
  await check("26 lifecycle group 1 create rejection", async () => {
    let collections = 0;
    let closes = 0;
    let publications = 0;
    const failure = await captureFailure("CREATE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => {
          throw new Error("create actual message");
        },
        collect: async () => {
          collections += 1;
          return [];
        },
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          publications += 1;
        }
      })
    );
    assertDiagnostic(failure.records[0], {
      phase: "CREATING",
      classification: "CREATE_FAILED",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "Error",
      message: "create actual message"
    });
    if (collections !== 0 || closes !== 0 || publications !== 0) {
      throw new Error("create rejection entered a later lifecycle boundary");
    }
  });
  await check("27 lifecycle group 2 create collect close success", async () => {
    let collectionEntries = 0;
    let closes = 0;
    let publications = 0;
    const clean = await executeCandidateLifecycle({
      create: async () => ({
        close: async () => {
          closes += 1;
        }
      }),
      collect: async () => {
        collectionEntries += 1;
        return [];
      },
      validate: (value) => value,
      encode: async () => Buffer.from("candidate\n"),
      publish: async () => {
        publications += 1;
      }
    });
    let warningPublications = 0;
    const warning = await executeCandidateLifecycle({
      create: async ({ stderr }) => ({
        close: async () => {
          stderr.write("ordinary close warning actual\n");
        }
      }),
      collect: async () => [],
      validate: (value) => value,
      encode: async () => Buffer.from("candidate\n"),
      publish: async () => {
        warningPublications += 1;
      }
    });
    const warningBytes = lifecycleDiagnosticBytes(warning.diagnostics);
    const warningRecords = parseDiagnosticBytes(warningBytes);
    assertDiagnostic(warningRecords[0], {
      phase: "CLOSING",
      classification: "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC",
      source: "PUBLIC_INJECTED_STDERR",
      ordinal: 0,
      name: "PublicStderrRecord",
      message: "ordinary close warning actual"
    });
    if (
      collectionEntries !== 1 ||
      closes !== 1 ||
      publications !== 1 ||
      warningPublications !== 1 ||
      clean.diagnostics.length !== 0
    ) {
      throw new Error("successful lifecycle count mismatch");
    }
  });
  await check("28 lifecycle group 3 collection failure", async () => {
    let closes = 0;
    let publications = 0;
    const failure = await captureFailure("COLLECT_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            closes += 1;
          }
        }),
        collect: async () => {
          throw new Error("collect actual message");
        },
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          publications += 1;
        }
      })
    );
    assertDiagnostic(failure.records[0], {
      phase: "COLLECTING",
      classification: "COLLECT_FAILED",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "Error",
      message: "collect actual message"
    });
    if (closes !== 1 || publications !== 0) {
      throw new Error("collection failure cleanup mismatch");
    }
  });
  await check("29 lifecycle group 4 validation failure", async () => {
    let closes = 0;
    let encodes = 0;
    const failure = await captureFailure("VALIDATE_OR_ENCODE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            closes += 1;
          }
        }),
        collect: async () => [],
        validate: async () => {
          throw new Error("validation actual message");
        },
        encode: async () => {
          encodes += 1;
          return Buffer.from("x");
        },
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    assertDiagnostic(failure.records[0], {
      phase: "VALIDATING_OR_ENCODING",
      classification: "VALIDATE_OR_ENCODE_FAILED",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "Error",
      message: "validation actual message"
    });
    if (closes !== 1 || encodes !== 0) {
      throw new Error("validation failure boundary mismatch");
    }
  });
  await check("30 lifecycle group 5 encoding failure", async () => {
    let closes = 0;
    let validations = 0;
    const failure = await captureFailure("VALIDATE_OR_ENCODE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            closes += 1;
          }
        }),
        collect: async () => [],
        validate: async (value) => {
          validations += 1;
          return value;
        },
        encode: async () => {
          throw new Error("encoding actual message");
        },
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    assertDiagnostic(failure.records[0], {
      phase: "VALIDATING_OR_ENCODING",
      classification: "VALIDATE_OR_ENCODE_FAILED",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "Error",
      message: "encoding actual message"
    });
    if (closes !== 1 || validations !== 1) {
      throw new Error("encoding failure boundary mismatch");
    }
  });
  await check("31 lifecycle group 6 close failure", async () => {
    const rejected = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            throw new Error("close promise actual message");
          }
        }),
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    assertDiagnostic(rejected.records[0], {
      phase: "CLOSING",
      classification: "CLOSE_FAILED",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "Error",
      message: "close promise actual message"
    });
    const sentinel = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr }) => ({
          close: async () => {
            stderr.write("error during close sentinel actual\r\n");
          }
        }),
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    assertDiagnostic(sentinel.records[0], {
      phase: "CLOSING",
      classification: "CLOSE_FAILED",
      source: "PUBLIC_INJECTED_STDERR",
      ordinal: 0,
      name: "PublicStderrRecord",
      message: "error during close sentinel actual"
    });
    const invalid = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr }) => ({
          close: async () => {
            stderr.write(Buffer.from([0xff]));
          }
        }),
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    assertDiagnostic(invalid.records[0], {
      phase: "CLOSING",
      classification: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID",
      source: "PUBLIC_INJECTED_STDERR_CAPTURE",
      ordinal: 0,
      name: "PublicStderrCapture",
      message: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID"
    });
    const boundary = classifyClosingCapture([
      {
        ordinal: 0,
        phase: "CLOSING",
        bytes: Buffer.from("prefix error during close"),
        encoding: "utf8",
        sha256: ""
      },
      {
        ordinal: 1,
        phase: "CLOSING",
        bytes: Buffer.from("Error during close"),
        encoding: "utf8",
        sha256: ""
      },
      {
        ordinal: 2,
        phase: "CLOSING",
        bytes: Buffer.from("error during close\tcause"),
        encoding: "utf8",
        sha256: ""
      }
    ]);
    if (
      boundary[0].classification !== "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC" ||
      boundary[1].classification !== "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC" ||
      boundary[2].classification !== "CLOSE_FAILED"
    ) {
      throw new Error("close sentinel classifier mismatch");
    }
  });
  await check("32 lifecycle group 7 primary plus close failure", async () => {
    const promise = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            throw new Error("close rejection after primary");
          }
        }),
        collect: async () => {
          throw new Error("primary collection");
        },
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    if (
      promise.records.map(({ classification }) => classification).join(",") !==
        "COLLECT_FAILED,CLOSE_FAILED" ||
      promise.records.map(({ source }) => source).join(",") !==
        "PUBLIC_PROMISE_REJECTION,PUBLIC_PROMISE_REJECTION"
    ) {
      throw new Error("primary plus close Promise diagnostics mismatch");
    }
    const stderr = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr: publicStderr }) => ({
          close: async () => {
            publicStderr.write("error during close after encoding");
          }
        }),
        collect: async () => [],
        validate: (value) => value,
        encode: async () => {
          throw new Error("primary encoding");
        },
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    if (
      stderr.records.map(({ classification }) => classification).join(",") !==
        "VALIDATE_OR_ENCODE_FAILED,CLOSE_FAILED" ||
      stderr.records.map(({ source }) => source).join(",") !==
        "PUBLIC_PROMISE_REJECTION,PUBLIC_INJECTED_STDERR"
    ) {
      throw new Error("primary plus close stderr diagnostics mismatch");
    }
    const both = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr: publicStderr }) => ({
          close: async () => {
            publicStderr.write("error during close both");
            throw new Error("close rejection both");
          }
        }),
        collect: async () => {
          throw new Error("primary both");
        },
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    if (
      both.records.map(({ classification }) => classification).join(",") !==
        "COLLECT_FAILED,CLOSE_FAILED,CLOSE_FAILED" ||
      both.records.map(({ ordinal }) => ordinal).join(",") !== "0,0,0"
    ) {
      throw new Error("primary plus both close channels mismatch");
    }
  });
  await check("33 lifecycle group 8 atomic candidate write failure", async () => {
    const bytes = Buffer.from("atomic candidate\n");
    for (const failureStage of ["write", "close", "rename"]) {
      const root = mkdtempSync(
        path.join(tmpdir(), `2b20ap1-${failureStage}-self-test-`)
      );
      const destination = path.join(root, "candidate.json");
      const temporary = path.join(root, ".candidate.json.2b20ap1.tmp");
      let closeInjectionPending = failureStage === "close";
      const operations = {
        exists: existsSync,
        open: openSync,
        write(descriptor, source, offset, length) {
          if (failureStage === "write") throw new Error("injected write");
          return writeSync(descriptor, source, offset, length);
        },
        fsync: fsyncSync,
        close(descriptor) {
          if (closeInjectionPending) {
            closeInjectionPending = false;
            closeSync(descriptor);
            throw new Error("injected close");
          }
          closeSync(descriptor);
        },
        rename(source, target) {
          if (failureStage === "rename") throw new Error("injected rename");
          renameSync(source, target);
        },
        unlink: unlinkSync
      };
      try {
        await expectLifecycleCode("PUBLISH_FAILED", async () =>
          publishCandidateAtomically(destination, bytes, operations)
        );
        if (existsSync(destination) || existsSync(temporary)) {
          throw new Error(`${failureStage} exposed a partial candidate`);
        }
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    }
  });
  await check("34 lifecycle group 9 deterministic repetition", async () => {
    const generate = async () => {
      let published;
      const result = await executeCandidateLifecycle({
        create: async () => ({ close: async () => {} }),
        collect: async () => ["stable"],
        validate: (value) => value,
        encode: async (value) =>
          candidateBytes({ schemaVersion: "self-test", value }),
        publish: async (bytes) => {
          published = Buffer.from(bytes);
        }
      });
      if (!result.bytes.equals(published)) {
        throw new Error("generated and published bytes differ");
      }
      return result.bytes;
    };
    const first = await generate();
    const second = await generate();
    const firstFailure = await captureFailure("CREATE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => {
          throw new Error("stable diagnostic");
        },
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {}
      })
    );
    const secondFailure = await captureFailure("CREATE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => {
          throw new Error("stable diagnostic");
        },
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {}
      })
    );
    if (
      !first.equals(second) ||
      !firstFailure.bytes.equals(secondFailure.bytes)
    ) {
      throw new Error("repeated candidate or diagnostic bytes differ");
    }
  });
  await check("35 lifecycle group 10 authoritative wrapper entry", async () => {
    let wrapperEntries = 0;
    await executeCandidateLifecycle({
      create: async () => ({ close: async () => {} }),
      collect: async () => {
        wrapperEntries += 1;
        return [];
      },
      validate: (value) => value,
      encode: async () => Buffer.from("x"),
      publish: async () => {}
    });
    const publicOnlyPending = {
      result() {
        return { state: "pending", errors: undefined };
      }
    };
    if (
      wrapperEntries !== 1 ||
      "task" in publicOnlyPending ||
      assertPublicPendingTestCase(publicOnlyPending).state !== "pending"
    ) {
      throw new Error("public wrapper-entry or pending result mismatch");
    }
    const invalidCases = [
      { result: undefined },
      { result: "not a function" },
      { result: () => { throw new Error("result failure"); } },
      { result: () => ({ state: "passed" }) },
      { result: () => ({ state: "failed" }) },
      { result: () => ({ state: "skipped" }) }
    ];
    for (const testCase of invalidCases) {
      await expectLifecycleCode(
        "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
        async () => assertPublicPendingTestCase(testCase)
      );
    }
    const privateAccessToken = [".", "task"].join("");
    if (
      collectSemanticInventory.toString().includes(privateAccessToken) ||
      assertPublicPendingTestCase.toString().includes(privateAccessToken)
    ) {
      throw new Error("candidate collection reads a private TestCase field");
    }
  });
  await check("36 lifecycle group 11 real Vitest 1572 and 12 LF", async () => {
    const result = await getRealIntegration();
    const candidate = JSON.parse(result.bytes.toString("utf8"));
    if (
      candidate.structuredIdentityCount !== 1572 ||
      candidate.lfIdentityCount !== 12 ||
      candidate.structuredIdentities.filter((tuple) =>
        tuple[3].includes("\n")
      ).length !== 12 ||
      !result.bytes.equals(realIntegrationPublishedBytes)
    ) {
      throw new Error("real structured inventory mismatch");
    }
  });
  await check("37 lifecycle group 12 real public close and natural exit", async () => {
    const result = await getRealIntegration();
    if (
      realIntegrationCollectEntries !== 1 ||
      result.closeInvocationCount !== 1 ||
      result.closingRecords.length !== 0 ||
      result.closeNonErrors.length !== 0 ||
      result.diagnostics.length !== 0
    ) {
      throw new Error("real public close integration mismatch");
    }
  });
  process.stdout.write(
    `${JSON.stringify(
      {
        verdict: "OWNERSHIP_CONTRACT_SELF_TEST_PASS",
        checksPassed: results.length,
        checksExpected: 37,
        checks: results
      },
      null,
      2
    )}\n`
  );
}

try {
  const argv = process.argv.slice(2);
  if (argv.length === 1 && argv[0] === "--self-test") {
    await runCompleteSelfTest();
  } else {
    await runCandidateCommand(parseCandidateArguments(argv));
  }
} catch (error) {
  writeCandidateFailure(error);
  process.exitCode = 1;
}
