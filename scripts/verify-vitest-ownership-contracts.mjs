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

function safeDiagnostic(error, channel, classification, extra = {}) {
  const rawMessage =
    error instanceof Error ? error.message : error === null ? "" : String(error);
  const message = rawMessage
    .replaceAll(path.resolve(process.cwd()), "<repo>")
    .replaceAll(path.resolve(tmpdir()), "<temp>")
    .slice(0, 500);
  return {
    channel,
    classification,
    name: error instanceof Error ? error.name : "Error",
    message,
    ...extra
  };
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
          classification: "CLOSE_ERROR",
          text: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID"
        };
      }
      let text;
      try {
        text = decoder.decode(record.bytes);
      } catch {
        return {
          ...record,
          classification: "CLOSE_ERROR",
          text: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID"
        };
      }
      const normalized = text
        .replace(/\r\n/gu, "\n")
        .replace(/\r/gu, "\n")
        .replace(/\n+$/gu, "");
      if (normalized.length === 0) {
        return { ...record, classification: "EMPTY_FORMATTING", text: "" };
      }
      if (
        normalized === "error during close" ||
        /^error during close(?: |\t|\n)/u.test(normalized)
      ) {
        return { ...record, classification: "CLOSE_ERROR", text: normalized };
      }
      return {
        ...record,
        classification: "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC",
        text: normalized
      };
    });
}

async function executeCandidateLifecycle({
  create,
  collect,
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
    encoded = await encode(collected);
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
    (record) => record.classification === "CLOSE_ERROR"
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
        safeDiagnostic(
          primaryDiagnostic,
          "PRIMARY",
          primaryClassification
        )
      );
    }
    if (closeDiagnostic !== null) {
      diagnostics.push(
        safeDiagnostic(closeDiagnostic, "CLOSE_PROMISE", "CLOSE_FAILED")
      );
    }
    for (const record of closeErrors) {
      diagnostics.push({
        channel: "CLOSE_STDERR",
        classification: "CLOSE_FAILED",
        name: "PublicStderrRecord",
        message: record.text,
        ordinal: record.ordinal,
        sha256: record.sha256
      });
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
    candidateFail(
      primaryClassification,
      primaryDiagnostic instanceof Error
        ? primaryDiagnostic.message
        : String(primaryDiagnostic),
      [
        safeDiagnostic(
          primaryDiagnostic,
          "PRIMARY",
          primaryClassification
        )
      ]
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
      if (
        seenTests.has(test) ||
        test.module !== module ||
        typeof test.name !== "string" ||
        test.name.length === 0 ||
        typeof test.fullName !== "string" ||
        typeof test.project?.name !== "string" ||
        test.project.name.length === 0 ||
        ["passed", "failed"].includes(test.task?.result?.state)
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

function publishCandidateAtomically(finalPath, bytes) {
  const temporaryPath = path.join(
    path.dirname(finalPath),
    `.${path.basename(finalPath)}.2b20ap1.tmp`
  );
  if (existsSync(temporaryPath)) {
    candidateFail("CANDIDATE_TEMP_COLLISION", temporaryPath);
  }
  let descriptor;
  try {
    descriptor = openSync(temporaryPath, "wx");
    let offset = 0;
    while (offset < bytes.length) {
      const written = writeSync(
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
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = undefined;
    renameSync(temporaryPath, finalPath);
  } catch (error) {
    if (descriptor !== undefined) {
      try {
        closeSync(descriptor);
      } catch {
        // Preserve the primary publication error.
      }
    }
    if (existsSync(temporaryPath)) unlinkSync(temporaryPath);
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
  if (result.closeNonErrors.length > 0) {
    for (const record of result.closeNonErrors) {
      process.stderr.write(
        `${JSON.stringify({
          channel: "CLOSE_STDERR",
          classification: "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC",
          name: "PublicStderrRecord",
          message: "",
          ordinal: record.ordinal,
          sha256: record.sha256
        })}\n`
      );
    }
  }
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
      if (error instanceof CandidateLifecycleError && error.code === code) return;
      throw error;
    }
    throw new Error(`Expected lifecycle code ${code}`);
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
  await check("26 create failure has no close or publication", async () => {
    let published = 0;
    await expectLifecycleCode("CREATE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => {
          throw new Error("create");
        },
        collect: async () => [],
        encode: async () => Buffer.from("x"),
        publish: async () => {
          published += 1;
        }
      })
    );
    if (published !== 0) throw new Error("published after create failure");
  });
  await check("27 collection failure closes once and does not publish", async () => {
    let closes = 0;
    let published = 0;
    await expectLifecycleCode("COLLECT_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({ close: async () => { closes += 1; } }),
        collect: async () => {
          throw new Error("collect");
        },
        encode: async () => Buffer.from("x"),
        publish: async () => {
          published += 1;
        }
      })
    );
    if (closes !== 1 || published !== 0) throw new Error("collection cleanup mismatch");
  });
  await check("28 validation failure closes once and does not publish", async () => {
    let closes = 0;
    await expectLifecycleCode("VALIDATE_OR_ENCODE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({ close: async () => { closes += 1; } }),
        collect: async () => [],
        encode: async () => {
          throw new Error("encode");
        },
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    if (closes !== 1) throw new Error("validation cleanup mismatch");
  });
  await check("29 public close rejection is CLOSE_FAILED", async () => {
    await expectLifecycleCode("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({ close: async () => { throw new Error("close"); } }),
        collect: async () => [],
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
  });
  await check("30 fulfilled close with sentinel stderr is CLOSE_FAILED", async () => {
    let published = 0;
    await expectLifecycleCode("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr }) => ({
          close: async () => {
            stderr.write("error during close reason\r\n");
          }
        }),
        collect: async () => [],
        encode: async () => Buffer.from("x"),
        publish: async () => {
          published += 1;
        }
      })
    );
    if (published !== 0) throw new Error("published after close stderr failure");
  });
  await check("31 unrelated close stderr is retained and does not fabricate failure", async () => {
    let published = 0;
    const result = await executeCandidateLifecycle({
      create: async ({ stderr }) => ({
        close: async () => {
          stderr.write("ordinary close warning\n");
        }
      }),
      collect: async () => [],
      encode: async () => Buffer.from("x"),
      publish: async () => {
        published += 1;
      }
    });
    if (published !== 1 || result.closeNonErrors.length !== 1) {
      throw new Error("non-error close diagnostic mismatch");
    }
  });
  await check("32 close sentinel matching is anchored and case-sensitive", async () => {
    const records = classifyClosingCapture([
      { ordinal: 0, phase: "CLOSING", bytes: Buffer.from("prefix error during close"), encoding: "utf8", sha256: "" },
      { ordinal: 1, phase: "CLOSING", bytes: Buffer.from("Error during close"), encoding: "utf8", sha256: "" },
      { ordinal: 2, phase: "CLOSING", bytes: Buffer.from("error during close\tcause"), encoding: "utf8", sha256: "" }
    ]);
    if (
      records[0].classification !== "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC" ||
      records[1].classification !== "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC" ||
      records[2].classification !== "CLOSE_ERROR"
    ) {
      throw new Error("close sentinel classifier mismatch");
    }
  });
  await check("33 clean lifecycle publishes exactly once after close", async () => {
    let closes = 0;
    let published = 0;
    const result = await executeCandidateLifecycle({
      create: async () => ({ close: async () => { closes += 1; } }),
      collect: async () => [],
      encode: async () => Buffer.from("candidate\n"),
      publish: async () => {
        published += 1;
      }
    });
    if (
      closes !== 1 ||
      published !== 1 ||
      result.closingRecords.length !== 0
    ) {
      throw new Error("clean lifecycle mismatch");
    }
  });
  await check("34 invalid UTF-8 close capture is CLOSE_FAILED", async () => {
    await expectLifecycleCode("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr }) => ({
          close: async () => {
            stderr.write(Buffer.from([0xff]));
          }
        }),
        collect: async () => [],
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
  });
  await check("35 empty close formatting is audited but permits publication", async () => {
    let published = 0;
    const result = await executeCandidateLifecycle({
      create: async ({ stderr }) => ({
        close: async () => {
          stderr.write("\r\n");
        }
      }),
      collect: async () => [],
      encode: async () => Buffer.from("x"),
      publish: async () => {
        published += 1;
      }
    });
    if (
      published !== 1 ||
      result.closingRecords.length !== 1 ||
      result.closingRecords[0].classification !== "EMPTY_FORMATTING"
    ) {
      throw new Error("empty formatting classification mismatch");
    }
  });
  await check("36 primary plus close stderr failure retains both channels", async () => {
    try {
      await executeCandidateLifecycle({
        create: async ({ stderr }) => ({
          close: async () => {
            stderr.write("error during close combined");
          }
        }),
        collect: async () => {
          throw new Error("primary");
        },
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      });
      throw new Error("Expected combined close failure");
    } catch (error) {
      if (
        !(error instanceof CandidateLifecycleError) ||
        error.code !== "CLOSE_FAILED" ||
        error.diagnostics.map(({ channel }) => channel).join(",") !==
          "PRIMARY,CLOSE_STDERR"
      ) {
        throw error;
      }
    }
  });
  await check("37 candidate publication is exact and atomic", async () => {
    const root = mkdtempSync(path.join(tmpdir(), "2b20ap1-publish-self-test-"));
    const destination = path.join(root, "candidate.json");
    const bytes = candidateBytes({
      schemaVersion: "self-test",
      acceptedContractBaselines: ACCEPTED_CONTRACT_BASELINES
    });
    try {
      publishCandidateAtomically(destination, bytes);
      if (!readFileSync(destination).equals(bytes)) {
        throw new Error("published candidate bytes differ");
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
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
  const code = error?.code;
  if (error instanceof CandidateLifecycleError) {
    for (const diagnostic of error.diagnostics) {
      process.stderr.write(`${JSON.stringify(diagnostic)}\n`);
    }
  }
  const message =
    typeof code === "string"
      ? code
      : error instanceof Error
        ? error.stack ?? error.message
        : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
