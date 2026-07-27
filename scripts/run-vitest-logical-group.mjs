import { spawnSync } from "node:child_process";
import { Buffer } from "node:buffer";
import { copyFileSync, constants as fsConstants, existsSync, lstatSync, mkdirSync, openSync, readFileSync, realpathSync, readdirSync, renameSync, rmSync, statSync, writeSync, fsyncSync, closeSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { canonicalizeRawVitestInventory } from "./vitest-ownership-contracts.mjs";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(SCRIPT_PATH);
const EXPECTED_NODE = "24.15.0";
const EXPECTED_VITEST = "3.2.6";
const WORKSPACE = "vitest.workspace.ts";
const COVERAGE_INCLUDE = "packages/*/src/**/*.ts";
const APP_TEST = "packages/application/src/game-application-service.test.ts";
const REPORTER_SCHEMA = "botc-vitest-same-process-record-v1";
const DIAGNOSTIC_SCHEMA = "botc-vitest-singleton-diagnostic-v1";
const EVIDENCE_SCHEMA = "botc-vitest-segment-evidence-v1";
const LOGICAL_SCHEMA = "botc-vitest-logical-manifest-v1";
const GLOBAL_SCHEMA = "botc-vitest-global-manifest-v1";
const COMMAND_SCHEMA = "botc-vitest-command-v1";
const MAX_LOG_BYTES = 1_048_576;
const FAILURE_CODES = new Set([
  "SUPERSESSION_ACCEPTED_HISTORY_UNAVAILABLE", "SUPERSESSION_ACCEPTED_HEAD_NOT_ANCESTOR",
  "SUPERSESSION_ACCEPTED_BLOB_MISMATCH", "GIT_COMMAND_FAILED", "LOGICAL_GROUP_INVALID_ARGUMENTS",
  "UNKNOWN_MODE", "UNKNOWN_LOGICAL_GROUP", "UNKNOWN_PHYSICAL_BLOB", "NODE_VERSION_MISMATCH",
  "VITEST_PACKAGE_NOT_FOUND", "VITEST_PACKAGE_INVALID", "VITEST_PACKAGE_VERSION_MISMATCH",
  "VITEST_PUBLIC_BIN_INVALID", "VITEST_PUBLIC_BIN_ESCAPE", "VITEST_VERSION_MISMATCH",
  "REPOSITORY_ROOT_INVALID", "GITHUB_WORKSPACE_MISMATCH", "ARTIFACT_ROOT_INVALID",
  "ARTIFACT_ROOT_NOT_EMPTY", "ARTIFACT_PATH_ESCAPE", "ARTIFACT_SYMLINK", "ARTIFACT_JUNCTION",
  "ARTIFACT_UNEXPECTED_ENTRY", "ARTIFACT_CLEANUP_FAILED", "INVALID_SEGMENT_ID",
  "INVENTORY_LIST_FAILED", "INVENTORY_COUNT_MISMATCH", "INVENTORY_OVERLAP", "INVENTORY_MISSING",
  "INVENTORY_UNEXPECTED", "SUBRUN_SPAWN_FAILED", "SUBRUN_NONZERO_EXIT", "SUBRUN_SIGNALLED",
  "ASSERTION_FAILURE", "SELECTED_TEST_SKIPPED", "SELECTED_TEST_TODO", "GLOBAL_ERROR",
  "COVERAGE_MISSING", "SIDECAR_MISSING", "SIDECAR_EXTRA", "SIDECAR_RENAMED",
  "SIDECAR_PARSE_FAILED", "SIDECAR_SCHEMA_INVALID", "SIDECAR_COMMAND_IDENTITY_MISMATCH",
  "SIDECAR_PROFILE_MISMATCH", "SIDECAR_LOGICAL_GROUP_MISMATCH",
  "SIDECAR_PHYSICAL_BLOB_MISMATCH", "SIDECAR_SEGMENT_MISMATCH",
  "SIDECAR_PROCESS_MISMATCH", "MERGEABLE_BLOB_MISSING", "MERGEABLE_BLOB_EXTRA",
  "MERGEABLE_BLOB_RENAMED", "MERGEABLE_BLOB_INVALID", "MERGEABLE_BLOB_HASH_MISMATCH",
  "SINGLETON_STAGE_COLLISION", "SINGLETON_STAGE_HASH_MISMATCH", "SINGLETON_MERGE_FAILED",
  "SINGLETON_REPORT_INVALID", "SINGLETON_IDENTITY_MISMATCH", "SINGLETON_ASSERTION_MISMATCH",
  "RAW_DIAGNOSTIC_NOT_AUTHORITY", "MULTI_BLOB_TEST_IDENTITY_AUTHORITY_FORBIDDEN",
  "LOGICAL_MANIFEST_INVALID", "LOGICAL_IDENTITY_OVERLAP", "LOGICAL_IDENTITY_MISSING",
  "LOGICAL_IDENTITY_UNEXPECTED", "LOGICAL_IDENTITY_DUPLICATE",
  "ORDINARY_GLOBAL_TEST_MERGE_FORBIDDEN", "COVERAGE_MERGE_ROOT_INVALID",
  "COVERAGE_GLOBAL_MERGE_FAILED", "COVERAGE_MAP_MISSING", "COVERAGE_FINGERPRINT_MISMATCH",
  "COVERAGE_OBLIGATION_LOSS", "MERGED_TEST_REPORT_AUTHORITY_FORBIDDEN", "VERIFICATION_FAILED",
  "PROFILE_SOURCE_HEAD_INVALID", "PROFILE_CHILD_AS_SOURCE_HEAD", "PROFILE_NOT_APPEND_ONLY",
  "PROFILE_DELTA_EVIDENCE_INSUFFICIENT", "ATOMIC_WRITE_FAILED", "PARTIAL_ARTIFACT_PRESENT",
  "INTERNAL_ERROR"
]);

const ORDINARY = Object.freeze({
  "domain-core-rebuild": [["full", ["domain-core-rebuild"], null]],
  "domain-core-rest": [["full", ["domain-core"], null]],
  application: [["full", ["application"], null]],
  "application-service-core": [["full", ["application-service-core"], null]],
  "application-service-role-actions": [["full", ["application-service-role-actions"], null]],
  "application-service-information-and-later-actions": [
    ["full", ["application-service-information-and-later-actions"], null]
  ],
  "application-service-compatibility-and-failure-boundaries": [
    ["full", ["application-service-compatibility-and-failure-boundaries"], null]
  ],
  "application-service-dreamer-vortox": [
    ["legacy", ["application-service-dreamer-vortox"], "\\[(?:2B19A3A|2B19A3B1)-"],
    ["2b20a", ["application-service-dreamer-vortox"], "\\[2B20A-"],
    ["gained", ["application-service-dreamer-vortox"], "\\[2B19B-"]
  ],
  "engines-and-projections": [[
    "full",
    ["assignment-engine", "information-engine", "projections", "rules-snv", "setup-engine", "task-engine", "test-harness"],
    null
  ]]
});
const COVERAGE = Object.freeze({
  "domain-core-rebuild": [["full", ["domain-core-rebuild"], null]],
  "domain-core-rest": [["full", ["domain-core"], null]],
  application: [["full", ["application"], null]],
  "application-service-core": [["full", ["application-service-core"], null]],
  "application-service-role-actions": [["full", ["application-service-role-actions"], null]],
  "application-service-information-and-later-actions-base": [
    ["full", ["application-service-information-and-later-actions"], "^(?!.*\\[2B19A3B2-).*$"]
  ],
  "application-service-information-and-later-actions-a3b2": [
    ["full", ["application-service-information-and-later-actions"], "\\[2B19A3B2-"]
  ],
  "application-service-compatibility-and-failure-boundaries": [
    ["full", ["application-service-compatibility-and-failure-boundaries"], null]
  ],
  "application-service-dreamer-vortox-core": [
    ["legacy", ["application-service-dreamer-vortox"], "\\[(?:2B19A3A|2B19A3B1)-"],
    ["2b20a", ["application-service-dreamer-vortox"], "\\[2B20A-"]
  ],
  "application-service-dreamer-vortox-gained": [
    ["full", ["application-service-dreamer-vortox"], "\\[2B19B-"]
  ],
  "engines-and-projections": ORDINARY["engines-and-projections"]
});
const WINDOWS = Object.freeze({
  W7: ORDINARY["application-service-dreamer-vortox"]
});
const MODE_CONFIG = Object.freeze({ ordinary: ORDINARY, coverage: COVERAGE, windows: WINDOWS });
const ROOTS = Object.freeze({
  ordinary: ".vitest-test/segmented",
  coverage: ".vitest-coverage/segmented",
  windows: ".vitest-windows-application/segmented"
});
const GLOBAL_ROOTS = Object.freeze({
  ordinary: ".vitest-test/segmented-global",
  coverage: ".vitest-coverage/segmented-global"
});
const EXPECTED_TOTAL = Object.freeze({ ordinary: 1572, coverage: 1572, windows: 46 });
const EXPECTED_PHYSICAL = Object.freeze({ ordinary: 11, coverage: 12, windows: 3 });
const EXPECTED_LOGICAL = Object.freeze({ ordinary: 9, coverage: 11, windows: 1 });

export class VitestEvidenceError extends Error {
  constructor(code, detail) {
    super(`${code}: ${detail}`);
    this.name = "VitestEvidenceError";
    this.code = code;
  }
}

function fail(code, detail) {
  if (!FAILURE_CODES.has(code)) throw new Error(`unknown failure code: ${code}`);
  throw new VitestEvidenceError(code, detail);
}

function ordinal(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort(ordinal).map((key) => [key, stable(value[key])]));
  }
  return value;
}

function jsonBytes(value, preserveOrder = false) {
  return Buffer.from(`${JSON.stringify(preserveOrder ? value : stable(value), null, 2)}\n`, "utf8");
}

function assertExactKeys(value, keys, code, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) fail(code, `${label} must be object`);
  const actual = Object.keys(value);
  if (actual.length !== keys.length || actual.some((key, index) => key !== keys[index])) {
    fail(code, `${label} keys ${JSON.stringify(actual)}`);
  }
}

function relativePath(repoRoot, target) {
  const relative = path.relative(repoRoot, target);
  if (relative === "" || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    fail("ARTIFACT_PATH_ESCAPE", target);
  }
  return relative.split(path.sep).join("/");
}

function repositoryRoot() {
  const git = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: process.cwd(), encoding: "utf8", windowsHide: true, shell: false
  });
  if (git.error || git.status !== 0) fail("REPOSITORY_ROOT_INVALID", "git top-level unavailable");
  const root = realpathSync(git.stdout.trim());
  if (realpathSync(process.cwd()) !== root || realpathSync(SCRIPT_DIR) !== realpathSync(path.join(root, "scripts"))) {
    fail("REPOSITORY_ROOT_INVALID", "cwd/script mismatch");
  }
  for (const required of ["package.json", "pnpm-lock.yaml", WORKSPACE]) {
    const entry = path.join(root, required);
    if (!existsSync(entry) || !statSync(entry).isFile() || lstatSync(entry).isSymbolicLink()) {
      fail("REPOSITORY_ROOT_INVALID", required);
    }
  }
  if (process.env.GITHUB_WORKSPACE !== undefined && realpathSync(process.env.GITHUB_WORKSPACE) !== root) {
    fail("GITHUB_WORKSPACE_MISMATCH", process.env.GITHUB_WORKSPACE);
  }
  return root;
}

function inside(root, relative) {
  if (path.isAbsolute(relative) || relative.split(/[\\/]/u).includes("..")) fail("ARTIFACT_PATH_ESCAPE", relative);
  const target = path.resolve(root, relative);
  relativePath(root, target);
  let ancestor = target;
  while (!existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const realAncestor = realpathSync(ancestor);
  if (realAncestor !== root) relativePath(root, realAncestor);
  return target;
}

function rejectLinks(root, target) {
  let current = target;
  while (current !== root) {
    if (existsSync(current)) {
      const info = lstatSync(current);
      if (info.isSymbolicLink()) fail("ARTIFACT_SYMLINK", relativePath(root, current));
      if ((info.mode & 0x400) !== 0 && process.platform === "win32") fail("ARTIFACT_JUNCTION", relativePath(root, current));
    }
    current = path.dirname(current);
  }
}

function ensureDirectory(repoRoot, target) {
  rejectLinks(repoRoot, target);
  mkdirSync(target, { recursive: true });
  rejectLinks(repoRoot, target);
  if (!statSync(target).isDirectory()) fail("ARTIFACT_ROOT_INVALID", relativePath(repoRoot, target));
}

function safeResetDirectory(repoRoot, target, allowedNames = []) {
  rejectLinks(repoRoot, target);
  if (existsSync(target)) {
    for (const entry of readdirSync(target, { withFileTypes: true })) {
      if (!allowedNames.includes(entry.name) || entry.isSymbolicLink()) {
        fail("ARTIFACT_UNEXPECTED_ENTRY", `${relativePath(repoRoot, target)}/${entry.name}`);
      }
      rmSync(path.join(target, entry.name), { recursive: true, force: false });
    }
  }
  ensureDirectory(repoRoot, target);
}

function atomicWrite(target, bytes) {
  const temporary = `${target}.tmp`;
  if (existsSync(temporary)) rmSync(temporary, { force: true });
  let handle;
  try {
    handle = openSync(temporary, "wx", 0o600);
    writeSync(handle, bytes);
    fsyncSync(handle);
    closeSync(handle);
    handle = undefined;
    renameSync(temporary, target);
    if (sha256(readFileSync(target)) !== sha256(bytes)) fail("ATOMIC_WRITE_FAILED", target);
  } catch (error) {
    if (handle !== undefined) closeSync(handle);
    if (existsSync(temporary)) rmSync(temporary, { force: true });
    if (error instanceof VitestEvidenceError) throw error;
    fail("ATOMIC_WRITE_FAILED", error instanceof Error ? error.message : String(error));
  }
}

function resolveVitest(repoRoot) {
  if (process.versions.node !== EXPECTED_NODE) fail("NODE_VERSION_MISMATCH", process.versions.node);
  let packagePath;
  try {
    packagePath = createRequire(import.meta.url).resolve("vitest/package.json");
  } catch {
    fail("VITEST_PACKAGE_NOT_FOUND", "vitest/package.json");
  }
  const packageReal = realpathSync(packagePath);
  const packageRoot = realpathSync(path.dirname(packageReal));
  const dependencyRoot = realpathSync(path.join(repoRoot, "node_modules"));
  relativePath(dependencyRoot, packageRoot);
  const metadata = JSON.parse(readFileSync(packageReal, "utf8"));
  if (metadata.name !== "vitest" || metadata.version !== EXPECTED_VITEST) {
    fail("VITEST_PACKAGE_VERSION_MISMATCH", `${metadata.name}@${metadata.version}`);
  }
  if (metadata.bin?.vitest?.replace(/^\.\//u, "") !== "vitest.mjs") fail("VITEST_PACKAGE_INVALID", "public bin");
  const cli = realpathSync(path.resolve(packageRoot, metadata.bin.vitest));
  relativePath(packageRoot, cli);
  if (!statSync(cli).isFile() || lstatSync(cli).isSymbolicLink()) fail("VITEST_PUBLIC_BIN_INVALID", cli);
  const version = spawnSync(process.execPath, [cli, "--version"], {
    cwd: repoRoot, encoding: "utf8", windowsHide: true, shell: false
  });
  if (version.error || version.status !== 0 ||
      version.stdout.trim().split(/\s+/u)[0] !== `vitest/${EXPECTED_VITEST}`) {
    fail("VITEST_VERSION_MISMATCH", version.stdout.trim());
  }
  return cli;
}

function parseCli(argv) {
  if (argv.length === 1 && argv[0] === "--self-test") return { action: "self-test" };
  if (argv.length === 3 && argv[0] === "aggregate" && argv[1] === "--mode") {
    if (!["ordinary", "coverage"].includes(argv[2])) fail("UNKNOWN_MODE", argv[2]);
    return { action: "aggregate", mode: argv[2] };
  }
  if (argv.length === 5 && ["run", "verify"].includes(argv[0]) && argv[1] === "--mode" && argv[3] === "--logical-group-id") {
    const mode = argv[2];
    const logicalGroupId = argv[4];
    if (!Object.hasOwn(MODE_CONFIG, mode)) fail("UNKNOWN_MODE", mode);
    if (!Object.hasOwn(MODE_CONFIG[mode], logicalGroupId)) fail("UNKNOWN_LOGICAL_GROUP", `${mode}/${logicalGroupId}`);
    return { action: argv[0], mode, logicalGroupId };
  }
  fail("LOGICAL_GROUP_INVALID_ARGUMENTS", JSON.stringify(argv));
}

function rawInventory(repoRoot, cli, projects, pattern, destination) {
  const args = [cli, "list", "--workspace", WORKSPACE, `--json=${destination}`, ...projects.map((item) => `--project=${item}`)];
  if (pattern !== null) args.push(`--testNamePattern=${pattern}`);
  const result = spawnSync(process.execPath, args, {
    cwd: repoRoot, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, windowsHide: true, shell: false
  });
  if (result.error || result.status !== 0 || !existsSync(destination)) fail("INVENTORY_LIST_FAILED", result.stderr || result.stdout);
  const parsed = JSON.parse(readFileSync(destination, "utf8"));
  if (!Array.isArray(parsed)) fail("INVENTORY_LIST_FAILED", "not array");
  try {
    return canonicalizeRawVitestInventory(repoRoot, parsed).map((item) => [
      item.project, item.file, item.ancestorPath, item.title
    ]);
  } catch (error) {
    fail("INVENTORY_LIST_FAILED", error instanceof Error ? error.message : String(error));
  }
}

function identityKey(identity) {
  return JSON.stringify(identity);
}

function physicalId(logicalGroupId, segmentId) {
  return `${logicalGroupId}--${segmentId}`;
}

function commandIdentity(repoRoot, mode, logicalGroupId, segmentId, projects, pattern, paths) {
  const value = {
    schemaVersion: COMMAND_SCHEMA,
    mode,
    logicalGroupId,
    physicalBlobId: physicalId(logicalGroupId, segmentId),
    segmentId,
    workspace: WORKSPACE,
    projects,
    files: projects[0] === "application-service-dreamer-vortox" ? [APP_TEST] : [],
    testNamePattern: pattern,
    coverageEnabled: mode === "coverage",
    coverageInclude: mode === "coverage" ? [COVERAGE_INCLUDE] : [],
    reporters: ["blob", "scripts/run-vitest-logical-group.mjs"],
    normalizedOutputPaths: Object.fromEntries(Object.entries(paths).map(([key, value_]) => [key, relativePath(repoRoot, value_)])),
    nodeVersion: EXPECTED_NODE,
    vitestVersion: EXPECTED_VITEST
  };
  return sha256(jsonBytes(value, true));
}

function boundedLog(value) {
  const bytes = Buffer.from(value ?? "", "utf8");
  if (bytes.length <= MAX_LOG_BYTES) return { bytes, truncated: false };
  return { bytes: Buffer.concat([bytes.subarray(0, MAX_LOG_BYTES - 14), Buffer.from("\n<truncated>\n")]), truncated: true };
}

function safeError(error, index) {
  const text = error instanceof Error ? error : new Error(typeof error === "string" ? error : "Unhandled error");
  return {
    index,
    type: typeof error,
    name: String(text.name || "Error").slice(0, 100),
    message: String(text.message || "Unhandled error").replace(/[\r\n]+/gu, " ").slice(0, 500),
    redactedStack: String(text.stack || "").replace(/[A-Za-z]:[\\/][^\s)]+|\/[^\s)]+/gu, "<path>").slice(0, 2000)
  };
}

function reporterTasks(files) {
  const results = [];
  const visit = (task, file, ancestors) => {
    if (task.type === "test") {
      const raw = task.result?.state ?? task.mode;
      const state = raw === "pass" ? "PASS" : raw === "fail" ? "FAIL" : raw === "todo" ? "TODO" : "SKIP";
      results.push({
        identity: [
          file.projectName,
          file.filepath.replace(/\\/gu, "/").replace(/^.*?(packages\/)/u, "$1"),
          ancestors,
          task.name
        ],
        state
      });
      return;
    }
    for (const child of task.tasks ?? []) visit(child, file, task.type === "suite" && task !== file ? [...ancestors, task.name] : ancestors);
  };
  for (const file of files) visit(file, file, []);
  return results.sort((left, right) => ordinal(identityKey(left.identity), identityKey(right.identity)));
}

export default class BotcSameProcessReporter {
  async onFinished(files = [], errors = []) {
    const destination = process.env.BOTC_VITEST_REPORTER_RECORD;
    if (typeof destination !== "string" || !path.isAbsolute(destination)) throw new Error("BOTC reporter destination is invalid");
    const record = {
      schemaVersion: REPORTER_SCHEMA,
      commandIdentity: process.env.BOTC_VITEST_COMMAND_IDENTITY,
      mode: process.env.BOTC_VITEST_MODE,
      logicalGroupId: process.env.BOTC_VITEST_LOGICAL_GROUP_ID,
      physicalBlobId: process.env.BOTC_VITEST_PHYSICAL_BLOB_ID,
      segmentId: process.env.BOTC_VITEST_SEGMENT_ID,
      reporterProcess: { pid: process.pid, node: process.versions.node, platform: process.platform, arch: process.arch },
      taskResults: reporterTasks(files),
      globalErrors: errors.map(safeError)
    };
    atomicWrite(destination, jsonBytes(record, true));
  }
}

function validateReporter(record, expected, childPid) {
  assertExactKeys(record, ["schemaVersion", "commandIdentity", "mode", "logicalGroupId", "physicalBlobId", "segmentId", "reporterProcess", "taskResults", "globalErrors"], "SIDECAR_SCHEMA_INVALID", "reporter");
  for (const key of ["commandIdentity", "mode", "logicalGroupId", "physicalBlobId", "segmentId"]) {
    if (record[key] !== expected[key]) fail(key === "logicalGroupId" ? "SIDECAR_LOGICAL_GROUP_MISMATCH" : "SIDECAR_COMMAND_IDENTITY_MISMATCH", key);
  }
  assertExactKeys(record.reporterProcess, ["pid", "node", "platform", "arch"], "SIDECAR_SCHEMA_INVALID", "reporterProcess");
  if (record.reporterProcess.pid !== childPid) fail("SIDECAR_PROCESS_MISMATCH", `${record.reporterProcess.pid}/${childPid}`);
  if (!Array.isArray(record.taskResults) || !Array.isArray(record.globalErrors)) fail("SIDECAR_SCHEMA_INVALID", "arrays");
  return record;
}

function singletonFromJson(repoRoot, report, record, selected, commandIdentity_, physicalBlobId_, rawPath, rawHash) {
  if (report === null || typeof report !== "object" || !Array.isArray(report.testResults)) fail("SINGLETON_REPORT_INVALID", physicalBlobId_);
  const lookup = new Map(record.taskResults.map((item) => [
    JSON.stringify([item.identity[1], [...item.identity[2], item.identity[3]].join(" > ")]), item
  ]));
  let total = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let todo = 0;
  const taskIdentities = [];
  for (const file of report.testResults) {
    const canonicalFile = relativePath(repoRoot, path.resolve(file.name));
    for (const assertion of file.assertionResults ?? []) {
      total += 1;
      const key = JSON.stringify([canonicalFile, [...assertion.ancestorTitles, assertion.title].join(" > ")]);
      const sidecar = lookup.get(key);
      if (sidecar === undefined) fail("SINGLETON_IDENTITY_MISMATCH", key);
      taskIdentities.push(sidecar.identity);
      if (assertion.status === "passed") passed += 1;
      else if (assertion.status === "failed") failed += 1;
      else if (assertion.status === "todo") todo += 1;
      else skipped += 1;
    }
  }
  const selectedKeys = new Set(selected.map(identityKey));
  const observedSelected = record.taskResults.filter((item) => item.state === "PASS").map((item) => identityKey(item.identity));
  const consistent = failed === 0 && todo === 0 &&
    observedSelected.length === selectedKeys.size &&
    observedSelected.every((key) => selectedKeys.has(key)) &&
    record.taskResults.length === total;
  return {
    schemaVersion: DIAGNOSTIC_SCHEMA,
    commandIdentity: commandIdentity_,
    physicalBlobId: physicalBlobId_,
    rawReportPath: rawPath,
    rawReportSha256: rawHash,
    total, passed, failed, skipped, todo,
    taskIdentities: taskIdentities.sort((left, right) => ordinal(identityKey(left), identityKey(right))),
    result: consistent ? "CONSISTENT" : "INCONSISTENT"
  };
}

function runSegment(repoRoot, cli, mode, logicalGroupId, [segmentId, projects, pattern], root) {
  const id = physicalId(logicalGroupId, segmentId);
  const paths = {
    blob: path.join(root, "physical-blobs", `${id}.blob`),
    reporter: path.join(root, "reporter-records", `${id}.json`),
    singletonInput: path.join(root, "singleton-input", id),
    singletonRaw: path.join(root, "singleton-raw-reports", `${id}.json`),
    singletonDiagnostic: path.join(root, "singleton-diagnostics", `${id}.json`),
    evidence: path.join(root, "segment-evidence", `${id}.json`),
    stdout: path.join(root, "logs", `${id}.stdout.txt`),
    stderr: path.join(root, "logs", `${id}.stderr.txt`),
    inventory: path.join(root, "logs", `${id}.inventory.json`),
    coverage: path.join(root, "coverage", id, "coverage-final.json")
  };
  for (const directory of new Set(Object.values(paths).map(path.dirname))) ensureDirectory(repoRoot, directory);
  const selected = rawInventory(repoRoot, cli, projects, pattern, paths.inventory);
  const identity = commandIdentity(repoRoot, mode, logicalGroupId, segmentId, projects, pattern, paths);
  const args = [cli, "run", `--workspace=${WORKSPACE}`, ...projects.map((item) => `--project=${item}`)];
  if (projects[0] === "application-service-dreamer-vortox") args.push(APP_TEST);
  if (pattern !== null) args.push(`--testNamePattern=${pattern}`);
  args.push("--reporter=blob", `--reporter=${SCRIPT_PATH}`, `--outputFile.blob=${paths.blob}`);
  if (mode === "coverage") {
    args.push("--coverage", `--coverage.include=${COVERAGE_INCLUDE}`, "--coverage.reporter=json", `--coverage.reportsDirectory=${path.dirname(paths.coverage)}`);
  }
  const controlledEnvironment = {
    VITEST_MAX_FORKS: "1", FORCE_COLOR: "0", NO_COLOR: "1",
    BOTC_VITEST_REPORTER_RECORD: paths.reporter, BOTC_VITEST_COMMAND_IDENTITY: identity,
    BOTC_VITEST_MODE: mode, BOTC_VITEST_LOGICAL_GROUP_ID: logicalGroupId,
    BOTC_VITEST_PHYSICAL_BLOB_ID: id, BOTC_VITEST_SEGMENT_ID: segmentId
  };
  const started = Date.now();
  const child = spawnSync(process.execPath, args, {
    cwd: repoRoot, encoding: "utf8", maxBuffer: MAX_LOG_BYTES * 2,
    env: { ...process.env, ...controlledEnvironment }, windowsHide: true, shell: false
  });
  const ended = Date.now();
  const stdout = boundedLog(child.stdout);
  const stderr = boundedLog(child.stderr);
  atomicWrite(paths.stdout, stdout.bytes);
  atomicWrite(paths.stderr, stderr.bytes);
  const failureCodes = [];
  if (child.error) failureCodes.push("SUBRUN_SPAWN_FAILED");
  if (child.signal) failureCodes.push("SUBRUN_SIGNALLED");
  if (child.status !== 0) failureCodes.push("SUBRUN_NONZERO_EXIT");
  let record = null;
  let recordHash = null;
  try {
    if (!existsSync(paths.reporter)) fail("SIDECAR_MISSING", id);
    recordHash = sha256(readFileSync(paths.reporter));
    record = validateReporter(JSON.parse(readFileSync(paths.reporter, "utf8")), {
      commandIdentity: identity, mode, logicalGroupId, physicalBlobId: id, segmentId
    }, child.pid);
  } catch (error) {
    failureCodes.push(error instanceof VitestEvidenceError ? error.code : "SIDECAR_PARSE_FAILED");
  }
  let blobHash = null;
  let blobBytes = null;
  let diagnostic = null;
  let diagnosticHash = null;
  try {
    if (!existsSync(paths.blob)) fail("MERGEABLE_BLOB_MISSING", id);
    const blobInfo = lstatSync(paths.blob);
    if (!blobInfo.isFile() || blobInfo.isSymbolicLink() || blobInfo.size <= 0) fail("MERGEABLE_BLOB_INVALID", id);
    blobBytes = blobInfo.size;
    blobHash = sha256(readFileSync(paths.blob));
    ensureDirectory(repoRoot, paths.singletonInput);
    const staged = path.join(paths.singletonInput, `${id}.blob`);
    copyFileSync(paths.blob, staged, fsConstants.COPYFILE_EXCL);
    if (sha256(readFileSync(staged)) !== blobHash) fail("SINGLETON_STAGE_HASH_MISMATCH", id);
    const merged = spawnSync(process.execPath, [cli, `--merge-reports=${paths.singletonInput}`, "--reporter=json", `--outputFile=${paths.singletonRaw}`], {
      cwd: repoRoot, encoding: "utf8", maxBuffer: MAX_LOG_BYTES * 2, windowsHide: true, shell: false
    });
    if (merged.error || merged.status !== 0) fail("SINGLETON_MERGE_FAILED", merged.stderr || merged.stdout);
    const rawBytes = readFileSync(paths.singletonRaw);
    diagnostic = singletonFromJson(repoRoot, JSON.parse(rawBytes.toString("utf8")), record, selected, identity, id, relativePath(repoRoot, paths.singletonRaw), sha256(rawBytes));
    atomicWrite(paths.singletonDiagnostic, jsonBytes(diagnostic, true));
    diagnosticHash = sha256(readFileSync(paths.singletonDiagnostic));
    if (diagnostic.result !== "CONSISTENT") fail("SINGLETON_ASSERTION_MISMATCH", id);
  } catch (error) {
    failureCodes.push(error instanceof VitestEvidenceError ? error.code : "SINGLETON_REPORT_INVALID");
  }
  const selectedKeys = new Set(selected.map(identityKey));
  const observed = record?.taskResults.filter((item) => item.state === "PASS").map((item) => item.identity) ?? [];
  if (record?.taskResults.some((item) => item.state === "FAIL")) failureCodes.push("ASSERTION_FAILURE");
  if (record?.taskResults.some((item) => selectedKeys.has(identityKey(item.identity)) && item.state === "SKIP")) failureCodes.push("SELECTED_TEST_SKIPPED");
  if (record?.taskResults.some((item) => selectedKeys.has(identityKey(item.identity)) && item.state === "TODO")) failureCodes.push("SELECTED_TEST_TODO");
  if ((record?.globalErrors.length ?? 0) > 0) failureCodes.push("GLOBAL_ERROR");
  if (mode === "coverage" && !existsSync(paths.coverage)) failureCodes.push("COVERAGE_MISSING");
  const uniqueFailures = [...new Set(failureCodes)].sort(ordinal);
  const eligible = uniqueFailures.length === 0 && diagnostic?.result === "CONSISTENT" && observed.length === selected.length;
  const envelope = {
    schemaVersion: EVIDENCE_SCHEMA, commandIdentity: identity, mode, logicalGroupId,
    physicalBlobId: id, segmentId,
    command: {
      executable: process.execPath, cliPath: relativePath(repoRoot, cli), args: args.slice(1),
      cwd: "<repo-root>", controlledEnvironment
    },
    runtime: { node: process.versions.node, vitest: EXPECTED_VITEST, platform: process.platform, arch: process.arch },
    process: {
      pid: child.pid ?? null, exitCode: child.status, signal: child.signal ?? null,
      spawnError: child.error ? { code: child.error.code ?? null, message: String(child.error.message).slice(0, 500) } : null,
      startedAtUnixMs: started, endedAtUnixMs: ended, wallDurationMs: ended - started
    },
    reporterRecord: { path: relativePath(repoRoot, paths.reporter), sha256: recordHash, status: record === null ? (existsSync(paths.reporter) ? "INVALID" : "MISSING") : "AVAILABLE" },
    taskEvidence: diagnostic?.result === "CONSISTENT" && record !== null ? {
      expectedSelectedIdentities: selected,
      observedSelectedIdentities: observed.sort((left, right) => ordinal(identityKey(left), identityKey(right))),
      filteredComplementIdentities: record.taskResults.filter((item) => item.state === "SKIP").map((item) => item.identity),
      counts: {
        selected: selected.length, passed: observed.length,
        failed: record.taskResults.filter((item) => item.state === "FAIL").length,
        skipped: record.taskResults.filter((item) => item.state === "SKIP").length,
        todo: record.taskResults.filter((item) => item.state === "TODO").length,
        complementSkipped: record.taskResults.filter((item) => item.state === "SKIP").length
      },
      singletonConsistency: "CONSISTENT"
    } : null,
    globalErrors: record?.globalErrors ?? null,
    blob: { path: relativePath(repoRoot, paths.blob), sha256: blobHash, bytes: blobBytes, status: blobHash === null ? (existsSync(paths.blob) ? "INVALID" : "MISSING") : "AVAILABLE" },
    singletonDiagnostic: { path: relativePath(repoRoot, paths.singletonDiagnostic), sha256: diagnosticHash, status: diagnostic === null ? (existsSync(paths.singletonDiagnostic) ? "INVALID" : "MISSING") : "AVAILABLE" },
    coverage: {
      path: mode === "coverage" ? relativePath(repoRoot, paths.coverage) : null,
      sha256: mode === "coverage" && existsSync(paths.coverage) ? sha256(readFileSync(paths.coverage)) : null,
      status: mode !== "coverage" ? "NOT_APPLICABLE" : existsSync(paths.coverage) ? "AVAILABLE" : "MISSING"
    },
    stdout: { path: relativePath(repoRoot, paths.stdout), sha256: sha256(stdout.bytes), bytes: stdout.bytes.length, truncated: stdout.truncated },
    stderr: { path: relativePath(repoRoot, paths.stderr), sha256: sha256(stderr.bytes), bytes: stderr.bytes.length, truncated: stderr.truncated },
    evidenceStatus: eligible ? "COMPLETE" : mode === "coverage" && !existsSync(paths.coverage) ? "COVERAGE_EVIDENCE_INCOMPLETE" : "EVIDENCE_INCOMPLETE",
    mergeEligibility: eligible,
    failureCodes: uniqueFailures
  };
  atomicWrite(paths.evidence, jsonBytes(envelope, true));
  return envelope;
}

function initLogicalRoot(repoRoot, mode, logicalGroupId) {
  const base = inside(repoRoot, ROOTS[mode]);
  ensureDirectory(repoRoot, base);
  const root = path.join(base, logicalGroupId);
  safeResetDirectory(repoRoot, root, [
    "physical-blobs", "reporter-records", "singleton-input", "singleton-raw-reports",
    "singleton-diagnostics", "segment-evidence", "coverage", "logs", "logical-manifest.json", "verification.json"
  ]);
  for (const name of ["physical-blobs", "reporter-records", "singleton-input", "singleton-raw-reports", "singleton-diagnostics", "segment-evidence", "logs"]) {
    ensureDirectory(repoRoot, path.join(root, name));
  }
  if (mode === "coverage") ensureDirectory(repoRoot, path.join(root, "coverage"));
  return root;
}

function buildLogicalManifest(mode, logicalGroupId, envelopes) {
  const expectedIds = MODE_CONFIG[mode][logicalGroupId].map(([segment]) => physicalId(logicalGroupId, segment));
  const selected = [];
  const counts = new Map();
  for (const envelope of envelopes) {
    for (const identity of envelope.taskEvidence?.observedSelectedIdentities ?? []) {
      const key = identityKey(identity);
      counts.set(key, (counts.get(key) ?? 0) + 1);
      selected.push(identity);
    }
  }
  const duplicate = [...counts].filter(([, count]) => count > 1).map(([key]) => JSON.parse(key)).sort((a, b) => ordinal(identityKey(a), identityKey(b)));
  const failureCodes = [...new Set(envelopes.flatMap((item) => item.failureCodes))].sort(ordinal);
  if (duplicate.length) failureCodes.push("LOGICAL_IDENTITY_DUPLICATE");
  const eligible = envelopes.length === expectedIds.length && envelopes.every((item) => item.mergeEligibility) && duplicate.length === 0;
  return {
    schemaVersion: LOGICAL_SCHEMA, mode, logicalGroupId, expectedPhysicalBlobIds: expectedIds,
    segmentEvidence: envelopes.map((item) => ({
      physicalBlobId: item.physicalBlobId, commandIdentity: item.commandIdentity,
      evidenceStatus: item.evidenceStatus, mergeEligibility: item.mergeEligibility,
      failureCodes: item.failureCodes
    })),
    selectedIdentities: selected.sort((a, b) => ordinal(identityKey(a), identityKey(b))),
    totals: {
      physicalBlobs: envelopes.length, selected: selected.length,
      passed: envelopes.reduce((sum, item) => sum + (item.taskEvidence?.counts?.passed ?? 0), 0)
    },
    discrepancy: { intersection: duplicate, missing: [], unexpected: [], duplicate },
    evidenceStatus: eligible ? "COMPLETE" : "EVIDENCE_INCOMPLETE",
    mergeEligibility: eligible, failureCodes: [...new Set(failureCodes)].sort(ordinal)
  };
}

function verifyLogical(repoRoot, mode, logicalGroupId) {
  const root = inside(repoRoot, `${ROOTS[mode]}/${logicalGroupId}`);
  rejectLinks(repoRoot, root);
  const evidenceDir = path.join(root, "segment-evidence");
  const expectedIds = MODE_CONFIG[mode][logicalGroupId].map(([segment]) => physicalId(logicalGroupId, segment));
  const entries = readdirSync(evidenceDir).sort(ordinal);
  const expectedEntries = expectedIds.map((id) => `${id}.json`).sort(ordinal);
  if (JSON.stringify(entries) !== JSON.stringify(expectedEntries)) fail("SIDECAR_EXTRA", logicalGroupId);
  const envelopes = expectedIds.map((id) => JSON.parse(readFileSync(path.join(evidenceDir, `${id}.json`), "utf8")));
  const manifest = buildLogicalManifest(mode, logicalGroupId, envelopes);
  atomicWrite(path.join(root, "logical-manifest.json"), jsonBytes(manifest, true));
  atomicWrite(path.join(root, "verification.json"), jsonBytes({
    schemaVersion: "botc-vitest-logical-verification-v1",
    mode, logicalGroupId, result: manifest.mergeEligibility ? "PASS" : "FAIL",
    failureCodes: manifest.failureCodes
  }, true));
  if (!manifest.mergeEligibility) fail("VERIFICATION_FAILED", `${mode}/${logicalGroupId}`);
  return manifest;
}

function findLogicalManifests(repoRoot, mode) {
  const expected = Object.keys(MODE_CONFIG[mode]).sort(ordinal);
  const candidates = [];
  const localRoot = inside(repoRoot, ROOTS[mode]);
  if (existsSync(localRoot)) {
    for (const logical of expected) {
      const candidate = path.join(localRoot, logical, "logical-manifest.json");
      if (existsSync(candidate)) candidates.push(candidate);
    }
  }
  const globalRoot = inside(repoRoot, GLOBAL_ROOTS[mode]);
  const incoming = path.join(globalRoot, "incoming-evidence");
  if (existsSync(incoming)) {
    for (const artifact of readdirSync(incoming, { withFileTypes: true })) {
      if (!artifact.isDirectory() || artifact.isSymbolicLink()) fail("ARTIFACT_UNEXPECTED_ENTRY", artifact.name);
      const stack = [path.join(incoming, artifact.name)];
      while (stack.length) {
        const current = stack.pop();
        for (const entry of readdirSync(current, { withFileTypes: true })) {
          const candidate = path.join(current, entry.name);
          if (entry.isSymbolicLink()) fail("ARTIFACT_SYMLINK", candidate);
          if (entry.isDirectory()) stack.push(candidate);
          else if (entry.name === "logical-manifest.json") candidates.push(candidate);
        }
      }
    }
  }
  const byLogical = new Map();
  for (const candidate of candidates) {
    const value = JSON.parse(readFileSync(candidate, "utf8"));
    if (value.mode === mode && expected.includes(value.logicalGroupId)) {
      if (byLogical.has(value.logicalGroupId)) fail("LOGICAL_MANIFEST_INVALID", `duplicate ${value.logicalGroupId}`);
      byLogical.set(value.logicalGroupId, { path: candidate, value });
    }
  }
  if (byLogical.size !== expected.length) fail("LOGICAL_MANIFEST_INVALID", `expected ${expected.length}, got ${byLogical.size}`);
  return expected.map((logical) => byLogical.get(logical));
}

const COVERAGE_TUPLE_GROUPS = Object.freeze([
  "sourceFiles",
  "zeroHitStatements",
  "zeroHitFunctions",
  "zeroHitLines",
  "zeroHitBranchArms"
]);

function canonicalCoverageSourceFile(repoRoot, rawFile) {
  if (typeof rawFile !== "string") throw new Error("coverage source file must be a string");
  const normalized = rawFile.replaceAll("\\", "/");
  const packageMarker = "/packages/";
  const markerIndex = normalized.lastIndexOf(packageMarker);
  if (markerIndex >= 0) return normalized.slice(markerIndex + 1);
  const relative = path.relative(repoRoot, path.resolve(repoRoot, rawFile)).split(path.sep).join("/");
  if (relative === ".." || relative.startsWith("../") || path.isAbsolute(relative)) {
    throw new Error(`coverage source file is outside the repository and packages tree: ${rawFile}`);
  }
  return relative;
}

function assertCoverageObject(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertCoverageEntryShape(file, entry) {
  assertCoverageObject(entry, `coverage entry ${file}`);
  for (const key of ["statementMap", "fnMap", "branchMap", "s", "f", "b"]) {
    assertCoverageObject(entry[key], `coverage entry ${file}.${key}`);
  }
}

function canonicalCoveragePosition(position) {
  if (position === null || typeof position !== "object" ||
      !Number.isInteger(position.line) || !Number.isInteger(position.column)) {
    throw new Error("coverage location contains an invalid position");
  }
  return `${position.line}:${position.column}`;
}

function canonicalCoverageLocation(location) {
  if (location === null || typeof location !== "object") {
    throw new Error("coverage map contains an invalid location");
  }
  return `${canonicalCoveragePosition(location.start)}-${canonicalCoveragePosition(location.end)}`;
}

function numericCoverageHit(value, context) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`coverage map contains an invalid hit count: ${context}`);
  }
  return value;
}

function normalizeCoverageTupleSets(repoRoot, map) {
  assertCoverageObject(map, "coverage map");
  if (Object.keys(map).length === 0) throw new Error("coverage map must not be empty");
  const groups = Object.fromEntries(COVERAGE_TUPLE_GROUPS.map((name) => [name, new Set()]));
  for (const [rawFile, entry] of Object.entries(map)) {
    const file = canonicalCoverageSourceFile(repoRoot, rawFile);
    if (groups.sourceFiles.has(file)) {
      throw new Error(`coverage map contains duplicate canonical source file: ${file}`);
    }
    groups.sourceFiles.add(file);
    assertCoverageEntryShape(file, entry);
    const lineHits = new Map();
    for (const [statementId, location] of Object.entries(entry.statementMap)) {
      if (!Object.hasOwn(entry.s, statementId)) {
        throw new Error(`statement ${statementId} is missing its hit count in ${file}`);
      }
      const hits = numericCoverageHit(entry.s[statementId], `${file} statement ${statementId}`);
      const locationIdentity = canonicalCoverageLocation(location);
      if (hits === 0) groups.zeroHitStatements.add(`${file}|${locationIdentity}`);
      const line = location.start.line;
      lineHits.set(line, Math.max(lineHits.get(line) ?? 0, hits));
    }
    for (const [line, hits] of lineHits) {
      if (hits === 0) groups.zeroHitLines.add(`${file}|${line}`);
    }
    for (const [functionId, definition] of Object.entries(entry.fnMap)) {
      if (!Object.hasOwn(entry.f, functionId)) {
        throw new Error(`function ${functionId} is missing its hit count in ${file}`);
      }
      const hits = numericCoverageHit(entry.f[functionId], `${file} function ${functionId}`);
      if (definition === null || typeof definition !== "object" ||
          Array.isArray(definition) || typeof definition.name !== "string") {
        throw new Error(`function ${functionId} has an invalid definition in ${file}`);
      }
      if (hits === 0) {
        groups.zeroHitFunctions.add(
          `${file}|${JSON.stringify(definition.name)}|decl:${canonicalCoverageLocation(definition.decl)}|loc:${canonicalCoverageLocation(definition.loc)}`
        );
      }
    }
    for (const [branchId, definition] of Object.entries(entry.branchMap)) {
      const counts = entry.b[branchId];
      if (definition === null || typeof definition !== "object" ||
          Array.isArray(definition) || typeof definition.type !== "string" ||
          !Array.isArray(counts) || !Array.isArray(definition.locations)) {
        throw new Error(`branch ${branchId} has an invalid definition or count array in ${file}`);
      }
      if (counts.length !== definition.locations.length) {
        throw new Error(`branch ${branchId} count/location length mismatch in ${file}`);
      }
      const branchLocation = canonicalCoverageLocation(definition.loc);
      for (let armIndex = 0; armIndex < counts.length; armIndex += 1) {
        const hits = numericCoverageHit(counts[armIndex], `${file} branch ${branchId} arm ${armIndex}`);
        if (hits === 0) {
          const identity = `${file}|type:${JSON.stringify(definition.type)}|branch:${branchLocation}|arm:${armIndex}|location:${canonicalCoverageLocation(definition.locations[armIndex])}`;
          if (groups.zeroHitBranchArms.has(identity)) {
            throw new Error(`coverage map contains duplicate canonical uncovered branch-arm identity: ${identity}`);
          }
          groups.zeroHitBranchArms.add(identity);
        }
      }
    }
  }
  return groups;
}

function coverageTupleRecord(values) {
  const tuples = [...values].sort(ordinal);
  return { count: tuples.length, sha256: sha256(tuples.join("\n")), tuples };
}

function coverageTupleArtifact(groups) {
  return {
    schemaVersion: "botc-vitest-canonical-coverage-tuples-v1",
    groups: Object.fromEntries(COVERAGE_TUPLE_GROUPS.map((name) => [name, coverageTupleRecord(groups[name])]))
  };
}

function inspectCoverageTupleRecord(record, label) {
  assertCoverageObject(record, label);
  if (!Number.isInteger(record.count) || record.count < 0 ||
      typeof record.sha256 !== "string" || !/^[0-9a-f]{64}$/u.test(record.sha256) ||
      !Array.isArray(record.tuples) || record.tuples.some((tuple) => typeof tuple !== "string")) {
    throw new Error(`${label} has an invalid tuple record`);
  }
  const tuples = [...record.tuples].sort(ordinal);
  const unique = new Set(tuples);
  const actualCount = unique.size;
  const actualSha256 = sha256([...unique].sort(ordinal).join("\n"));
  return {
    declaredCount: record.count,
    declaredSha256: record.sha256,
    actualCount,
    actualSha256,
    tuples: unique,
    internallyConsistent:
      record.count === record.tuples.length &&
      record.count === actualCount &&
      record.sha256 === actualSha256
  };
}

function compareCoverageTupleRecords(baselineRecord, candidateRecord, name) {
  const baseline = inspectCoverageTupleRecord(baselineRecord, `${name} baseline`);
  const candidate = inspectCoverageTupleRecord(candidateRecord, `${name} candidate`);
  const added = [...candidate.tuples].filter((tuple) => !baseline.tuples.has(tuple)).sort(ordinal);
  const removed = [...baseline.tuples].filter((tuple) => !candidate.tuples.has(tuple)).sort(ordinal);
  const countEqual = baseline.declaredCount === candidate.declaredCount;
  const sha256Equal = baseline.declaredSha256 === candidate.declaredSha256;
  return {
    baselineCount: baseline.declaredCount,
    baselineSha256: baseline.declaredSha256,
    candidateCount: candidate.declaredCount,
    candidateSha256: candidate.declaredSha256,
    addedCount: added.length,
    removedCount: removed.length,
    added,
    removed,
    countEqual,
    sha256Equal,
    baselineInternallyConsistent: baseline.internallyConsistent,
    candidateInternallyConsistent: candidate.internallyConsistent,
    equal:
      baseline.internallyConsistent &&
      candidate.internallyConsistent &&
      countEqual &&
      sha256Equal &&
      added.length === 0 &&
      removed.length === 0
  };
}

function compareCoverageTupleArtifacts(baseline, candidate) {
  assertCoverageObject(baseline, "baseline coverage tuple artifact");
  assertCoverageObject(candidate, "candidate coverage tuple artifact");
  assertCoverageObject(baseline.groups, "baseline coverage tuple groups");
  assertCoverageObject(candidate.groups, "candidate coverage tuple groups");
  const groups = Object.fromEntries(COVERAGE_TUPLE_GROUPS.map((name) => [
    name,
    compareCoverageTupleRecords(baseline.groups[name], candidate.groups[name], name)
  ]));
  return { groups, equal: Object.values(groups).every((comparison) => comparison.equal) };
}

function aggregate(repoRoot, cli, mode) {
  const items = findLogicalManifests(repoRoot, mode);
  const logical = items.map((item) => item.value);
  if (logical.some((item) => !item.mergeEligibility)) fail("LOGICAL_MANIFEST_INVALID", "ineligible");
  const selected = logical.flatMap((item) => item.selectedIdentities);
  const counts = new Map();
  for (const identity of selected) counts.set(identityKey(identity), (counts.get(identityKey(identity)) ?? 0) + 1);
  const duplicate = [...counts].filter(([, count]) => count > 1).map(([key]) => JSON.parse(key));
  const failures = [];
  if (duplicate.length) failures.push("LOGICAL_IDENTITY_DUPLICATE");
  if (selected.length !== EXPECTED_TOTAL[mode]) failures.push("INVENTORY_COUNT_MISMATCH");
  const globalRoot = inside(repoRoot, GLOBAL_ROOTS[mode]);
  ensureDirectory(repoRoot, globalRoot);
  for (const name of ["logical-manifests", "coverage-merge-input", "coverage-merge-work", "coverage-output"]) {
    if (mode === "coverage" || name === "logical-manifests") {
      const target = path.join(globalRoot, name);
      if (existsSync(target)) rmSync(target, { recursive: true, force: true });
      ensureDirectory(repoRoot, target);
    }
  }
  for (const item of items) copyFileSync(item.path, path.join(globalRoot, "logical-manifests", `${item.value.logicalGroupId}.json`));
  let coverage = {
    status: "NOT_APPLICABLE", coverageFinalPath: null, coverageFinalSha256: null,
    coverageFinalSha256Authority: false, normalizedTupleSetsPath: null,
    normalizedTupleSetsSha256: null, normalizedTupleSets: null,
    normalizedTupleSetComparison: null, mergedTestDiagnosticPath: null,
    mergedTestDiagnosticSha256: null, mergedTestDiagnosticAuthority: false
  };
  if (mode === "coverage") {
    const mergeRoot = path.join(globalRoot, "coverage-merge-input");
    const envelopes = [];
    for (const item of items) {
      const manifestDirectory = path.dirname(item.path);
      const evidenceDirectory = path.join(manifestDirectory, "segment-evidence");
      for (const id of item.value.expectedPhysicalBlobIds) {
        const envelopePath = path.join(evidenceDirectory, `${id}.json`);
        if (!existsSync(envelopePath)) fail("COVERAGE_MERGE_ROOT_INVALID", id);
        const envelope = JSON.parse(readFileSync(envelopePath, "utf8"));
        envelopes.push(envelope);
        const sourceBlob = path.join(manifestDirectory, "physical-blobs", `${id}.blob`);
        if (!existsSync(sourceBlob)) fail("COVERAGE_MERGE_ROOT_INVALID", id);
        const targetBlob = path.join(mergeRoot, `${id}.blob`);
        copyFileSync(sourceBlob, targetBlob, fsConstants.COPYFILE_EXCL);
        if (sha256(readFileSync(targetBlob)) !== envelope.blob.sha256) fail("MERGEABLE_BLOB_HASH_MISMATCH", id);
      }
    }
    if (envelopes.length !== 12 || readdirSync(mergeRoot).length !== 12) fail("COVERAGE_MERGE_ROOT_INVALID", "not twelve");
    const work = path.join(globalRoot, "coverage-merge-work");
    const diagnostic = path.join(globalRoot, "merged-test-diagnostic.json");
    const merge = spawnSync(process.execPath, [
      cli, `--merge-reports=${mergeRoot}`, "--coverage", `--coverage.include=${COVERAGE_INCLUDE}`,
      "--coverage.reporter=json", `--coverage.reportsDirectory=${work}`,
      "--reporter=json", `--outputFile=${diagnostic}`
    ], { cwd: repoRoot, encoding: "utf8", maxBuffer: MAX_LOG_BYTES * 2, windowsHide: true, shell: false });
    if (merge.error || merge.status !== 0) fail("COVERAGE_GLOBAL_MERGE_FAILED", merge.stderr || merge.stdout);
    const produced = path.join(work, "coverage-final.json");
    if (!existsSync(produced)) fail("COVERAGE_MAP_MISSING", produced);
    const finalPath = path.join(globalRoot, "coverage-output", "coverage-final.json");
    atomicWrite(finalPath, readFileSync(produced));
    let normalized;
    try {
      const tupleSets = normalizeCoverageTupleSets(
        repoRoot,
        JSON.parse(readFileSync(finalPath, "utf8"))
      );
      const tupleArtifact = coverageTupleArtifact(tupleSets);
      const tuplePath = path.join(globalRoot, "coverage-output", "coverage-normalized-tuples.json");
      atomicWrite(tuplePath, jsonBytes(tupleArtifact, true));
      const persistedArtifact = JSON.parse(readFileSync(tuplePath, "utf8"));
      const comparison = compareCoverageTupleArtifacts(tupleArtifact, persistedArtifact);
      if (!comparison.equal) failures.push("COVERAGE_FINGERPRINT_MISMATCH");
      normalized = {
        tuplePath,
        tupleArtifact,
        tupleArtifactSha256: sha256(readFileSync(tuplePath)),
        comparison
      };
    } catch (error) {
      fail(
        "COVERAGE_FINGERPRINT_MISMATCH",
        error instanceof Error ? error.message : String(error)
      );
    }
    coverage = {
      status: failures.includes("COVERAGE_FINGERPRINT_MISMATCH") ? "INVALID" : "AVAILABLE",
      coverageFinalPath: relativePath(repoRoot, finalPath), coverageFinalSha256: sha256(readFileSync(finalPath)),
      coverageFinalSha256Authority: false,
      normalizedTupleSetsPath: relativePath(repoRoot, normalized.tuplePath),
      normalizedTupleSetsSha256: normalized.tupleArtifactSha256,
      normalizedTupleSets: Object.fromEntries(COVERAGE_TUPLE_GROUPS.map((name) => [
        name,
        {
          count: normalized.tupleArtifact.groups[name].count,
          sha256: normalized.tupleArtifact.groups[name].sha256
        }
      ])),
      normalizedTupleSetComparison: normalized.comparison,
      mergedTestDiagnosticPath: relativePath(repoRoot, diagnostic),
      mergedTestDiagnosticSha256: sha256(readFileSync(diagnostic)),
      mergedTestDiagnosticAuthority: false
    };
  }
  const manifest = {
    schemaVersion: GLOBAL_SCHEMA, mode,
    expectedLogicalGroupIds: Object.keys(MODE_CONFIG[mode]),
    expectedPhysicalBlobIds: logical.flatMap((item) => item.expectedPhysicalBlobIds),
    logicalManifests: logical.map((item) => ({
      logicalGroupId: item.logicalGroupId, selectedCount: item.selectedIdentities.length,
      mergeEligibility: item.mergeEligibility, failureCodes: item.failureCodes
    })),
    selectedIdentities: selected.sort((a, b) => ordinal(identityKey(a), identityKey(b))),
    topology: { physicalBlobCount: logical.reduce((sum, item) => sum + item.expectedPhysicalBlobIds.length, 0), logicalGroupCount: logical.length },
    discrepancy: { intersection: duplicate, missing: [], unexpected: [], duplicate },
    coverage,
    result: failures.length === 0 ? "PASS" : "FAIL",
    failureCodes: [...new Set(failures)].sort(ordinal)
  };
  atomicWrite(path.join(globalRoot, "global-manifest.json"), jsonBytes(manifest, true));
  atomicWrite(path.join(globalRoot, "verification.json"), jsonBytes({
    schemaVersion: "botc-vitest-global-verification-v1", mode,
    result: manifest.result, failureCodes: manifest.failureCodes
  }, true));
  if (manifest.topology.physicalBlobCount !== EXPECTED_PHYSICAL[mode] ||
      manifest.topology.logicalGroupCount !== EXPECTED_LOGICAL[mode] ||
      manifest.result !== "PASS") fail("VERIFICATION_FAILED", `${mode} aggregate`);
  return manifest;
}

function stableProjection(envelope) {
  const value = {
    schemaVersion: envelope.schemaVersion, commandIdentity: envelope.commandIdentity,
    mode: envelope.mode, logicalGroupId: envelope.logicalGroupId,
    physicalBlobId: envelope.physicalBlobId, segmentId: envelope.segmentId,
    taskEvidence: envelope.taskEvidence, globalErrors: envelope.globalErrors,
    evidenceStatus: envelope.evidenceStatus, mergeEligibility: envelope.mergeEligibility,
    failureCodes: envelope.failureCodes
  };
  return jsonBytes(value, true);
}

function selfTest() {
  let passed = 0;
  const check = (condition, name) => {
    if (!condition) throw new Error(`self-test failed: ${name}`);
    passed += 1;
  };
  check(FAILURE_CODES.has("SIDECAR_LOGICAL_GROUP_MISMATCH") && FAILURE_CODES.size === 82, "failure code registry");
  check(Object.keys(ORDINARY).length === 9 && Object.values(ORDINARY).flat().length === 11, "ordinary topology");
  check(Object.keys(COVERAGE).length === 11 && Object.values(COVERAGE).flat().length === 12, "coverage topology");
  check(Object.values(WINDOWS).flat().length === 3, "windows topology");
  for (const invalid of [[], ["--self-test", "x"], ["run", "--mode", "ordinary"], ["aggregate", "--mode", "windows"]]) {
    try {
      parseCli(invalid);
      check(false, "invalid CLI");
    } catch (error) {
      check(error instanceof VitestEvidenceError, "invalid CLI rejected");
    }
  }
  const identity = ["p", "packages/a.test.ts", ["suite"], "title"];
  const envelope = {
    schemaVersion: EVIDENCE_SCHEMA, commandIdentity: "a".repeat(64), mode: "ordinary",
    logicalGroupId: "x", physicalBlobId: "x--full", segmentId: "full",
    taskEvidence: { expectedSelectedIdentities: [identity], observedSelectedIdentities: [identity] },
    globalErrors: [], evidenceStatus: "COMPLETE", mergeEligibility: true, failureCodes: [],
    runtime: { node: "x" }, process: { pid: 1 }, stdout: { bytes: 1 }
  };
  const reversed = { ...envelope, taskEvidence: stable(envelope.taskEvidence) };
  check(stableProjection(envelope).equals(stableProjection(reversed)), "stable projection");
  check(!stableProjection(envelope).toString().includes("runtime"), "ephemeral fields omitted");
  const logical = buildLogicalManifest("windows", "W7", [
    { physicalBlobId: "W7--legacy", commandIdentity: "1", taskEvidence: { observedSelectedIdentities: [["p", "f", [], "a"]] }, failureCodes: [], mergeEligibility: true, evidenceStatus: "COMPLETE" },
    { physicalBlobId: "W7--2b20a", commandIdentity: "2", taskEvidence: { observedSelectedIdentities: [["p", "f", [], "b"]] }, failureCodes: [], mergeEligibility: true, evidenceStatus: "COMPLETE" },
    { physicalBlobId: "W7--gained", commandIdentity: "3", taskEvidence: { observedSelectedIdentities: [["p", "f", [], "c"]] }, failureCodes: [], mergeEligibility: true, evidenceStatus: "COMPLETE" }
  ]);
  check(logical.mergeEligibility && logical.selectedIdentities.length === 3, "pure union");
  const collision = buildLogicalManifest("windows", "W7", [
    { physicalBlobId: "W7--legacy", commandIdentity: "1", taskEvidence: { observedSelectedIdentities: [identity] }, failureCodes: [], mergeEligibility: true, evidenceStatus: "COMPLETE" },
    { physicalBlobId: "W7--2b20a", commandIdentity: "2", taskEvidence: { observedSelectedIdentities: [identity] }, failureCodes: [], mergeEligibility: true, evidenceStatus: "COMPLETE" },
    { physicalBlobId: "W7--gained", commandIdentity: "3", taskEvidence: { observedSelectedIdentities: [] }, failureCodes: [], mergeEligibility: true, evidenceStatus: "COMPLETE" }
  ]);
  check(!collision.mergeEligibility && collision.failureCodes.includes("LOGICAL_IDENTITY_DUPLICATE"), "collision rejected");
  const error = safeError(new Error("failure at C:\\secret\\token.txt"), 0);
  check(error.index === 0 && error.redactedStack.includes("<path>"), "global error redaction");
  check(jsonBytes({ b: 1, a: 2 }).toString() === "{\n  \"a\": 2,\n  \"b\": 1\n}\n", "canonical JSON");
  const location = (line, column, endLine = line, endColumn = column + 1) => ({
    start: { line, column },
    end: { line: endLine, column: endColumn }
  });
  const syntheticCoverage = (branchArmLocation) => ({
    [path.join(process.cwd(), "packages", "synthetic", "src", "sample.ts")]: {
      statementMap: {
        0: location(1, 0),
        1: location(1, 2),
        2: location(2, 0)
      },
      fnMap: {
        0: { name: "sample", decl: location(3, 0), loc: location(3, 0, 4, 1) }
      },
      branchMap: {
        0: {
          type: "if",
          loc: location(5, 0, 7, 1),
          locations: [branchArmLocation, location(6, 0)]
        }
      },
      s: { 0: 0, 1: 1, 2: 0 },
      f: { 0: 0 },
      b: { 0: [0, 1] }
    }
  });
  const baselineCoverage = coverageTupleArtifact(
    normalizeCoverageTupleSets(process.cwd(), syntheticCoverage(location(5, 0)))
  );
  const changedBranchCoverage = coverageTupleArtifact(
    normalizeCoverageTupleSets(process.cwd(), syntheticCoverage(location(5, 1)))
  );
  check(
    baselineCoverage.groups.zeroHitLines.tuples.length === 1 &&
      baselineCoverage.groups.zeroHitLines.tuples[0].endsWith("|2"),
    "line tuples use maximum statement hit"
  );
  const changedBranch = compareCoverageTupleArtifacts(baselineCoverage, changedBranchCoverage);
  check(
    !changedBranch.equal &&
      changedBranch.groups.zeroHitBranchArms.addedCount === 1 &&
      changedBranch.groups.zeroHitBranchArms.removedCount === 1,
    "changed branch tuple rejected"
  );
  const equalCountDifferentTuple = {
    ...baselineCoverage,
    groups: {
      ...baselineCoverage.groups,
      sourceFiles: coverageTupleRecord(new Set(["packages/replacement/src/sample.ts"]))
    }
  };
  const equalCountComparison = compareCoverageTupleArtifacts(
    baselineCoverage,
    equalCountDifferentTuple
  );
  check(
    !equalCountComparison.equal &&
      equalCountComparison.groups.sourceFiles.countEqual &&
      !equalCountComparison.groups.sourceFiles.sha256Equal &&
      equalCountComparison.groups.sourceFiles.addedCount === 1 &&
      equalCountComparison.groups.sourceFiles.removedCount === 1,
    "equal-count different tuple rejected"
  );
  const contradictory = JSON.parse(JSON.stringify(baselineCoverage));
  contradictory.groups.zeroHitFunctions.count += 1;
  check(
    !compareCoverageTupleArtifacts(baselineCoverage, contradictory).equal,
    "tuple metadata contradiction rejected"
  );
  const distinctRawCoverage = JSON.stringify(syntheticCoverage(location(5, 0)), null, 2);
  check(
    sha256(distinctRawCoverage) !== sha256(`${distinctRawCoverage}\n`) &&
      compareCoverageTupleArtifacts(baselineCoverage, baselineCoverage).equal,
    "raw coverage hash is diagnostic only"
  );
  const source = readFileSync(SCRIPT_PATH, "utf8");
  const historicalCounts = [8, 9].map((suffix) => `${18}0${suffix}`);
  const forbiddenExpectedName = ["expected", "Fingerprint"].join("");
  check(
    !source.includes(forbiddenExpectedName) &&
      historicalCounts.every((value) => !source.includes(value)),
    "historical coverage literals are non-authoritative"
  );
  process.stdout.write(`run-vitest-logical-group self-test: PASS ${passed}/${passed}\n`);
}

function runCommand(options) {
  const repoRoot = repositoryRoot();
  const cli = resolveVitest(repoRoot);
  if (options.action === "run") {
    const root = initLogicalRoot(repoRoot, options.mode, options.logicalGroupId);
    const envelopes = MODE_CONFIG[options.mode][options.logicalGroupId].map((segment) =>
      runSegment(repoRoot, cli, options.mode, options.logicalGroupId, segment, root)
    );
    const manifest = verifyLogical(repoRoot, options.mode, options.logicalGroupId);
    if (envelopes.some((item) => !item.mergeEligibility)) fail("VERIFICATION_FAILED", options.logicalGroupId);
    process.stdout.write(`${options.mode}/${options.logicalGroupId}: PASS ${manifest.selectedIdentities.length}\n`);
  } else if (options.action === "verify") {
    const manifest = verifyLogical(repoRoot, options.mode, options.logicalGroupId);
    process.stdout.write(`${options.mode}/${options.logicalGroupId}: VERIFY PASS ${manifest.selectedIdentities.length}\n`);
  } else {
    const manifest = aggregate(repoRoot, cli, options.mode);
    process.stdout.write(`${options.mode}: AGGREGATE PASS ${manifest.selectedIdentities.length}\n`);
  }
}

const invoked = process.argv[1] === undefined ? "" : path.resolve(process.argv[1]);
if (invoked === path.resolve(SCRIPT_PATH)) {
  try {
    const options = parseCli(process.argv.slice(2));
    if (options.action === "self-test") selfTest();
    else runCommand(options);
  } catch (error) {
    const code = error instanceof VitestEvidenceError ? error.code : "INTERNAL_ERROR";
    process.stderr.write(`${code}: ${error instanceof Error ? error.message : String(error)}\n`);
    const exit = code === "INTERNAL_ERROR" || ["ATOMIC_WRITE_FAILED", "PARTIAL_ARTIFACT_PRESENT", "ARTIFACT_CLEANUP_FAILED"].includes(code)
      ? 24
      : code.startsWith("LOGICAL_") || code.startsWith("COVERAGE_") || code.startsWith("PROFILE_") || code.includes("AUTHORITY_FORBIDDEN")
        ? 23
        : code.startsWith("INVENTORY_") ? 21
          : code.startsWith("VITEST_") || code.includes("ROOT") || code.includes("WORKSPACE") || code.includes("ARGUMENT") || code.startsWith("UNKNOWN_") ? 20
            : 22;
    process.exitCode = exit;
  }
}
