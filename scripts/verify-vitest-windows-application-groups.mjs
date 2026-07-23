import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, resolve, sep } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const APPLICATION_SERVICE_TEST = "packages/application/src/game-application-service.test.ts";
const BASELINE_FILES = [
  "packages/application/src/game-command-bus.test.ts",
  APPLICATION_SERVICE_TEST,
  "packages/application/src/game-session-runner.test.ts"
];
const A3B2_PATTERN = "\\[2B19A3B2-";
const GROUPS = [
  {
    id: "W1",
    project: "application",
    filters: [
      "--project=application",
      "packages/application/src/game-command-bus.test.ts",
      "packages/application/src/game-session-runner.test.ts"
    ]
  },
  { id: "W2", project: "application-service-core", filters: ["--project=application-service-core", APPLICATION_SERVICE_TEST] },
  { id: "W3", project: "application-service-role-actions", filters: ["--project=application-service-role-actions", APPLICATION_SERVICE_TEST] },
  {
    id: "W4",
    project: "application-service-information-and-later-actions",
    filters: [
      "--project=application-service-information-and-later-actions",
      APPLICATION_SERVICE_TEST,
      `--testNamePattern=^(?!.*${A3B2_PATTERN})`
    ]
  },
  {
    id: "W5",
    project: "application-service-information-and-later-actions",
    filters: [
      "--project=application-service-information-and-later-actions",
      APPLICATION_SERVICE_TEST,
      `--testNamePattern=${A3B2_PATTERN}`
    ]
  },
  {
    id: "W6",
    project: "application-service-compatibility-and-failure-boundaries",
    filters: ["--project=application-service-compatibility-and-failure-boundaries", APPLICATION_SERVICE_TEST]
  },
  {
    id: "W7",
    project: "application-service-dreamer-vortox",
    filters: ["--project=application-service-dreamer-vortox", APPLICATION_SERVICE_TEST]
  }
];

const compareCodeUnits = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const sha256 = (values) => createHash("sha256").update(`${values.join("\n")}\n`, "utf8").digest("hex");

function parseCli(argv) {
  const valid = argv.length === 3 && (
    (argv[0] === "inventory" && argv[1] === "--output") ||
    ((argv[0] === "run" || argv[0] === "verify") && argv[1] === "--output-dir")
  );
  if (!valid) {
    throw new Error(
      "Usage: node scripts/verify-vitest-windows-application-groups.mjs " +
      "<inventory --output ABSOLUTE_JSON | run|verify --output-dir ABSOLUTE_DIR>"
    );
  }
  if (!isAbsolute(argv[2])) throw new Error(`${argv[1]} must be an absolute path`);
  return { mode: argv[0], target: argv[2] };
}

function resolvePnpm() {
  if (process.platform !== "win32") return { command: "pnpm", prefix: [] };
  const direct = process.env.npm_execpath;
  if (direct && /pnpm\.(?:cjs|mjs)$/i.test(direct) && existsSync(direct)) {
    return { command: process.execPath, prefix: [direct] };
  }
  const located = spawnSync("where.exe", ["pnpm.cmd"], { encoding: "utf8", windowsHide: true });
  if (located.status !== 0) throw new Error("Unable to locate pnpm.cmd on PATH");
  for (const shim of located.stdout.split(/\r?\n/u).filter(Boolean)) {
    const text = readFileSync(shim, "utf8");
    for (const match of text.matchAll(/["'](%~?dp0%?[^"']*?pnpm\.(?:cjs|mjs))["']/giu)) {
      const expanded = match[1]
        .replace(/^%~dp0/iu, `${dirname(shim)}${sep}`)
        .replace(/^%dp0%/iu, `${dirname(shim)}${sep}`)
        .replace(/[\\/]/gu, sep);
      const entry = resolve(expanded);
      if (existsSync(entry)) return { command: process.execPath, prefix: [entry] };
    }
  }
  throw new Error("Unable to resolve the pnpm JavaScript entry point without a shell");
}

function canonicalFile(rawFile) {
  const normalized = rawFile.replace(/\\/gu, "/");
  const marker = "/packages/";
  const index = normalized.indexOf(marker);
  if (index >= 0) return normalized.slice(index + 1);
  if (normalized.startsWith("packages/")) return normalized;
  throw new Error(`Vitest returned a test file outside packages/: ${rawFile}`);
}

function parseInventory(path, label) {
  const value = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(value)) throw new Error(`${label} Vitest JSON must be an array`);
  return value.map((item, index) => {
    if (!item || typeof item.name !== "string" || typeof item.file !== "string" || typeof item.projectName !== "string") {
      throw new Error(`${label} Vitest JSON item ${index} does not match {name,file,projectName}`);
    }
    const nameParts = item.name.split(" > ");
    const canonical = {
      project: item.projectName,
      file: canonicalFile(item.file),
      ancestorPath: nameParts.slice(0, -1),
      testTitle: nameParts.at(-1)
    };
    return { ...canonical, key: JSON.stringify(canonical) };
  }).sort((left, right) => compareCodeUnits(left.key, right.key));
}

function duplicateKeys(items) {
  const counts = new Map();
  for (const item of items) counts.set(item.key, (counts.get(item.key) ?? 0) + 1);
  return [...counts].filter(([, count]) => count > 1).map(([key]) => key).sort(compareCodeUnits);
}

function publicIdentity(item) {
  return {
    project: item.project,
    file: item.file,
    ancestorPath: item.ancestorPath,
    testTitle: item.testTitle
  };
}

function runList(pnpm, tempRoot, label, filters) {
  const output = resolve(tempRoot, `${label}.json`);
  const args = ["exec", "vitest", "list", "--workspace", "vitest.workspace.ts", ...filters, "--json", output];
  const result = spawnSync(pnpm.command, [...pnpm.prefix, ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" },
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${label} failed (${result.error?.message ?? `exit ${result.status}`}):\n${result.stderr || result.stdout}`);
  }
  return parseInventory(output, label);
}

function artifactNames(groupId) {
  return {
    report: `${groupId}-report.json`,
    stdout: `${groupId}-stdout.txt`,
    stderr: `${groupId}-stderr.txt`
  };
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalizeLf(value) {
  return (value ?? "").replace(/\r\n?/gu, "\n");
}

function countLiteral(value, needle) {
  return value.split(needle).length - 1;
}

function riskStrings(stdout, stderr) {
  const combined = `${stdout}\n${stderr}`;
  return {
    onTaskUpdate: countLiteral(combined, "onTaskUpdate"),
    Timeout: countLiteral(combined, "Timeout"),
    Unhandled: countLiteral(combined, "Unhandled")
  };
}

function captureExpectedInventory(pnpm, outputDir) {
  const tempRoot = mkdtempSync(resolve(tmpdir(), "botc-vitest-windows-expected-"));
  const issues = [];
  let baseline = [];
  const grouped = new Map(GROUPS.map((group) => [group.id, []]));
  try {
    try {
      baseline = runList(pnpm, tempRoot, "baseline", BASELINE_FILES);
    } catch (error) {
      issues.push(`baseline inventory failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    for (const group of GROUPS) {
      try {
        grouped.set(group.id, runList(pnpm, tempRoot, group.id, group.filters));
      } catch (error) {
        issues.push(`${group.id} inventory failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
  writeJson(resolve(outputDir, "expected-inventory.json"), {
    schemaVersion: "vitest-windows-application-groups-expected-inventory-v1",
    baseline: baseline.map(publicIdentity),
    groups: Object.fromEntries(GROUPS.map((group) => [group.id, grouped.get(group.id).map(publicIdentity)])),
    issues
  });
}

function runGroups(outputDir) {
  mkdirSync(outputDir, { recursive: true });
  const pnpm = resolvePnpm();
  const manifestGroups = [];
  rmSync(resolve(outputDir, "manifest.json"), { force: true });
  rmSync(resolve(outputDir, "verification.json"), { force: true });
  rmSync(resolve(outputDir, "expected-inventory.json"), { force: true });
  captureExpectedInventory(pnpm, outputDir);
  for (const group of GROUPS) {
    const names = artifactNames(group.id);
    const reportPath = resolve(outputDir, names.report);
    rmSync(reportPath, { force: true });
    const args = [
      "exec", "vitest", "run", "--workspace", "vitest.workspace.ts", ...group.filters,
      "--reporter=json", `--outputFile=${reportPath}`
    ];
    const started = process.hrtime.bigint();
    const result = spawnSync(pnpm.command, [...pnpm.prefix, ...args], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1", VITEST_MAX_FORKS: "1" },
      maxBuffer: 32 * 1024 * 1024,
      windowsHide: true
    });
    const wallMs = Math.round(Number(process.hrtime.bigint() - started) / 1_000_000);
    writeFileSync(resolve(outputDir, names.stdout), normalizeLf(result.stdout), "utf8");
    writeFileSync(resolve(outputDir, names.stderr), normalizeLf(result.stderr), "utf8");
    manifestGroups.push({
      id: group.id,
      project: group.project,
      command: ["pnpm", ...args.map((arg) => arg === `--outputFile=${reportPath}` ? `--outputFile=${names.report}` : arg)],
      report: names.report,
      stdout: names.stdout,
      stderr: names.stderr,
      exitCode: result.status,
      signal: result.signal ?? null,
      spawnErrorCode: typeof result.error?.code === "string" ? result.error.code : null,
      wallMs
    });
  }
  const manifest = {
    schemaVersion: "vitest-windows-application-groups-run-v1",
    groupOrder: GROUPS.map((group) => group.id),
    groups: manifestGroups
  };
  writeJson(resolve(outputDir, "manifest.json"), manifest);
  return manifest;
}

function parseRuntimeReport(value, group, label, issues) {
  const requiredCounts = [
    "numTotalTests", "numPassedTests", "numFailedTests", "numPendingTests", "numTodoTests"
  ];
  if (!value || typeof value !== "object" || !Array.isArray(value.testResults)) {
    throw new Error(`${label} does not match the Vitest JSON reporter schema`);
  }
  for (const field of requiredCounts) {
    if (!Number.isInteger(value[field]) || value[field] < 0) throw new Error(`${label}.${field} must be a nonnegative integer`);
  }
  const passedItems = [];
  const skippedItems = [];
  const statuses = { passed: 0, failed: 0, pending: 0, todo: 0, skipped: 0 };
  for (const [fileIndex, fileResult] of value.testResults.entries()) {
    if (!fileResult || typeof fileResult.name !== "string" || !Array.isArray(fileResult.assertionResults)) {
      throw new Error(`${label}.testResults[${fileIndex}] is malformed`);
    }
    for (const [testIndex, assertion] of fileResult.assertionResults.entries()) {
      if (!assertion || typeof assertion.title !== "string" || !Array.isArray(assertion.ancestorTitles) ||
        assertion.ancestorTitles.some((title) => typeof title !== "string") || typeof assertion.status !== "string") {
        throw new Error(`${label} assertion ${fileIndex}:${testIndex} is malformed`);
      }
      if (!(assertion.status in statuses)) {
        issues.push(`${group.id} has unknown assertion status ${JSON.stringify(assertion.status)}`);
      } else {
        statuses[assertion.status] += 1;
      }
      const canonical = {
        project: group.project,
        file: canonicalFile(fileResult.name),
        ancestorPath: assertion.ancestorTitles,
        testTitle: assertion.title
      };
      const item = { ...canonical, key: JSON.stringify(canonical) };
      if (assertion.status === "passed") passedItems.push(item);
      if (assertion.status === "skipped") skippedItems.push(item);
    }
  }
  passedItems.sort((left, right) => compareCodeUnits(left.key, right.key));
  skippedItems.sort((left, right) => compareCodeUnits(left.key, right.key));
  const assertionCount = Object.values(statuses).reduce((total, count) => total + count, 0);
  if (value.numTotalTests !== assertionCount) issues.push(`${group.id} numTotalTests does not match assertions`);
  if (value.numPassedTests !== statuses.passed) issues.push(`${group.id} numPassedTests does not match assertions`);
  if (value.numFailedTests !== statuses.failed) issues.push(`${group.id} numFailedTests does not match assertions`);
  if (value.numPendingTests !== statuses.pending + statuses.skipped) {
    issues.push(`${group.id} numPendingTests does not match pending/skipped assertions`);
  }
  if (value.numTodoTests !== statuses.todo) issues.push(`${group.id} numTodoTests does not match assertions`);
  if (value.numFailedTests !== 0 || value.numTodoTests !== 0 || statuses.failed !== 0 ||
    statuses.pending !== 0 || statuses.todo !== 0 || value.success !== true) {
    issues.push(`${group.id} report contains a failed, pending, todo, unknown, or unsuccessful result`);
  }
  return {
    passedItems,
    skippedItems,
    counts: {
      total: value.numPassedTests,
      passed: value.numPassedTests,
      failed: value.numFailedTests,
      pending: statuses.pending,
      todo: statuses.todo,
      skipped: 0,
      discoveredTotal: value.numTotalTests,
      filteredComplement: statuses.skipped
    },
    rawReportCounts: {
      total: value.numTotalTests,
      passed: value.numPassedTests,
      failed: value.numFailedTests,
      pending: value.numPendingTests,
      todo: value.numTodoTests,
      skippedAssertions: statuses.skipped
    }
  };
}

function buildReport(baseline, grouped) {
  const baselineByKey = new Map(baseline.map((item) => [item.key, item]));
  const assignments = new Map();
  for (const group of GROUPS) {
    for (const item of grouped.get(group.id)) {
      const owners = assignments.get(item.key) ?? [];
      owners.push(group.id);
      assignments.set(item.key, owners);
    }
  }
  const missingKeys = [...baselineByKey.keys()].filter((key) => !assignments.has(key)).sort(compareCodeUnits);
  const unexpectedKeys = [...assignments.keys()].filter((key) => !baselineByKey.has(key)).sort(compareCodeUnits);
  const duplicateAssignmentKeys = [...assignments]
    .filter(([, owners]) => new Set(owners).size > 1)
    .map(([key]) => key)
    .sort(compareCodeUnits);
  const intersections = [];
  for (let left = 0; left < GROUPS.length; left += 1) {
    const leftKeys = new Set(grouped.get(GROUPS[left].id).map((item) => item.key));
    for (let right = left + 1; right < GROUPS.length; right += 1) {
      const keys = [...new Set(grouped.get(GROUPS[right].id).map((item) => item.key))]
        .filter((key) => leftKeys.has(key))
        .sort(compareCodeUnits);
      intersections.push({ groups: [GROUPS[left].id, GROUPS[right].id], count: keys.length, identities: keys.map(JSON.parse) });
    }
  }
  const a3b2 = baseline.filter((item) => item.testTitle.includes("[2B19A3B2-"));
  const a3b2Violations = [];
  for (const item of a3b2) {
    const owners = [...new Set(assignments.get(item.key) ?? [])].sort(compareCodeUnits);
    if (owners.length !== 1 || owners[0] !== "W5") a3b2Violations.push({ identity: publicIdentity(item), groups: owners });
  }
  for (const item of grouped.get("W5")) {
    if (!item.testTitle.includes("[2B19A3B2-")) a3b2Violations.push({ identity: publicIdentity(item), groups: ["W5"] });
  }
  const foundation = baseline.filter((item) =>
    item.project === "application-service-compatibility-and-failure-boundaries" && /^C(?:09|1[0-4])\b/u.test(item.testTitle)
  );
  const foundationViolations = foundation.flatMap((item) => {
    const owners = [...new Set(assignments.get(item.key) ?? [])].sort(compareCodeUnits);
    return owners.length === 1 && owners[0] === "W6" ? [] : [{ identity: publicIdentity(item), groups: owners }];
  });
  const internalDuplicates = Object.fromEntries([
    ["baseline", duplicateKeys(baseline)],
    ...GROUPS.map((group) => [group.id, duplicateKeys(grouped.get(group.id))])
  ]);
  const failed = missingKeys.length > 0 || unexpectedKeys.length > 0 || duplicateAssignmentKeys.length > 0 ||
    intersections.some((entry) => entry.count > 0) || Object.values(internalDuplicates).some((keys) => keys.length > 0) ||
    a3b2.length === 0 || a3b2Violations.length > 0 || foundation.length === 0 || foundationViolations.length > 0;
  return {
    schemaVersion: "vitest-windows-application-groups-inventory-v1",
    baselineCount: baseline.length,
    baselineIdentitySha256: sha256(baseline.map((item) => item.key)),
    groupCounts: Object.fromEntries(GROUPS.map((group) => [group.id, grouped.get(group.id).length])),
    groups: Object.fromEntries(GROUPS.map((group) => [group.id, {
      project: group.project,
      identitySha256: sha256(grouped.get(group.id).map((item) => item.key))
    }])),
    differences: {
      missing: { count: missingKeys.length, identities: missingKeys.map(JSON.parse) },
      duplicate: { count: duplicateAssignmentKeys.length, identities: duplicateAssignmentKeys.map(JSON.parse) },
      unexpected: { count: unexpectedKeys.length, identities: unexpectedKeys.map(JSON.parse) },
      internalDuplicates,
      pairwiseIntersections: intersections
    },
    markers: {
      a3b2: { baselineCount: a3b2.length, requiredGroup: "W5", violations: a3b2Violations },
      foundationProxy: { baselineCount: foundation.length, requiredGroup: "W6", violations: foundationViolations }
    },
    verdict: failed ? "FAIL" : "PASS"
  };
}

function readArtifact(path, label, issues) {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    issues.push(`${label} unavailable: ${error instanceof Error ? error.message : String(error)}`);
    return "";
  }
}

function compareIdentitySets(actual, expected, label, issues) {
  const actualCounts = new Map();
  for (const item of actual) actualCounts.set(item.key, (actualCounts.get(item.key) ?? 0) + 1);
  const expectedKeys = new Set(expected.map((item) => item.key));
  const missing = [...expectedKeys].filter((key) => !actualCounts.has(key));
  const unexpected = [...actualCounts.keys()].filter((key) => !expectedKeys.has(key));
  const duplicate = [...actualCounts.values()].filter((count) => count !== 1);
  if (missing.length > 0 || unexpected.length > 0 || duplicate.length > 0 || expectedKeys.size !== expected.length) {
    issues.push(
      `${label} identity mismatch: missing=${missing.length}, unexpected=${unexpected.length}, ` +
      `duplicate=${duplicate.length}, expectedDuplicate=${expected.length - expectedKeys.size}`
    );
  }
}

function hydrateStoredIdentities(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return value.map((item, index) => {
    if (!item || typeof item.project !== "string" || typeof item.file !== "string" ||
      !Array.isArray(item.ancestorPath) || item.ancestorPath.some((part) => typeof part !== "string") ||
      typeof item.testTitle !== "string") {
      throw new Error(`${label}[${index}] is malformed`);
    }
    const canonical = {
      project: item.project,
      file: canonicalFile(item.file),
      ancestorPath: item.ancestorPath,
      testTitle: item.testTitle
    };
    return { ...canonical, key: JSON.stringify(canonical) };
  }).sort((left, right) => compareCodeUnits(left.key, right.key));
}

function verifyDirectory(outputDir) {
  const issues = [];
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(resolve(outputDir, "manifest.json"), "utf8"));
  } catch (error) {
    issues.push(`manifest unavailable or invalid: ${error instanceof Error ? error.message : String(error)}`);
    manifest = null;
  }
  const expectedOrder = GROUPS.map((group) => group.id);
  if (!manifest || manifest.schemaVersion !== "vitest-windows-application-groups-run-v1" ||
    JSON.stringify(manifest.groupOrder) !== JSON.stringify(expectedOrder) || !Array.isArray(manifest.groups) ||
    manifest.groups.length !== GROUPS.length) {
    issues.push("manifest schema or stable W1-W7 order is invalid");
  }
  const runtime = new Map();
  const outcomes = {};
  for (const [index, group] of GROUPS.entries()) {
    const names = artifactNames(group.id);
    const entry = manifest?.groups?.[index];
    if (!entry || entry.id !== group.id || entry.project !== group.project || entry.report !== names.report ||
      entry.stdout !== names.stdout || entry.stderr !== names.stderr) {
      issues.push(`${group.id} manifest entry is missing or malformed`);
    }
    if (entry?.exitCode !== 0 || entry?.signal != null || entry?.spawnErrorCode != null) {
      issues.push(`${group.id} process did not record a real zero exit`);
    }
    if (!Number.isInteger(entry?.wallMs) || entry.wallMs < 0) issues.push(`${group.id} wallMs is invalid`);
    const stdout = readArtifact(resolve(outputDir, names.stdout), `${group.id} stdout`, issues);
    const stderr = readArtifact(resolve(outputDir, names.stderr), `${group.id} stderr`, issues);
    const risks = riskStrings(stdout, stderr);
    if (Object.values(risks).some((count) => count !== 0)) issues.push(`${group.id} contains runner risk strings`);
    let parsed = { passedItems: [], skippedItems: [], counts: null, rawReportCounts: null };
    try {
      const report = JSON.parse(readFileSync(resolve(outputDir, names.report), "utf8"));
      parsed = parseRuntimeReport(report, group, `${group.id} report`, issues);
    } catch (error) {
      issues.push(`${group.id} report unavailable or invalid: ${error instanceof Error ? error.message : String(error)}`);
    }
    runtime.set(group.id, parsed);
    outcomes[group.id] = {
      exitCode: entry?.exitCode ?? null,
      signal: entry?.signal ?? null,
      wallMs: entry?.wallMs ?? null,
      counts: parsed.counts,
      rawReportCounts: parsed.rawReportCounts,
      riskStrings: risks
    };
  }
  let baseline = [];
  const expectedGrouped = new Map(GROUPS.map((group) => [group.id, []]));
  try {
    const expected = JSON.parse(readFileSync(resolve(outputDir, "expected-inventory.json"), "utf8"));
    if (!expected || expected.schemaVersion !== "vitest-windows-application-groups-expected-inventory-v1" ||
      !expected.groups || !Array.isArray(expected.issues)) {
      throw new Error("expected inventory schema is invalid");
    }
    baseline = hydrateStoredIdentities(expected.baseline, "expected baseline");
    for (const group of GROUPS) {
      expectedGrouped.set(group.id, hydrateStoredIdentities(expected.groups[group.id], `expected ${group.id}`));
    }
    for (const issue of expected.issues) issues.push(`expected inventory capture: ${String(issue)}`);
  } catch (error) {
    issues.push(`expected inventory unavailable or invalid: ${error instanceof Error ? error.message : String(error)}`);
  }
  const grouped = new Map();
  for (const group of GROUPS) {
    const selected = expectedGrouped.get(group.id);
    const selectedKeys = new Set(selected.map((item) => item.key));
    const complement = baseline.filter((item) => item.project === group.project && !selectedKeys.has(item.key));
    const actual = runtime.get(group.id);
    compareIdentitySets(actual.passedItems, selected, `${group.id} passed selection`, issues);
    compareIdentitySets(actual.skippedItems, complement, `${group.id} skipped complement`, issues);
    outcomes[group.id].expectedFilteredComplement = complement.length;
    if (actual.counts && actual.counts.filteredComplement !== complement.length) {
      issues.push(`${group.id} filtered complement count does not match inventory`);
    }
    grouped.set(group.id, actual.passedItems);
  }
  const inventory = buildReport(baseline, grouped);
  if (inventory.verdict !== "PASS") issues.push("runtime canonical inventory does not partition the baseline");
  const verification = {
    schemaVersion: "vitest-windows-application-groups-verification-v1",
    groupOrder: expectedOrder,
    groups: outcomes,
    inventory,
    issues,
    verdict: issues.length === 0 ? "PASS" : "FAIL"
  };
  writeJson(resolve(outputDir, "verification.json"), verification);
  return verification;
}

function main() {
  const { mode, target } = parseCli(process.argv.slice(2));
  if (mode === "inventory") {
    const tempRoot = mkdtempSync(resolve(tmpdir(), "botc-vitest-windows-inventory-"));
    try {
      const pnpm = resolvePnpm();
      const baseline = runList(pnpm, tempRoot, "baseline", BASELINE_FILES);
      const grouped = new Map(GROUPS.map((group) => [group.id, runList(pnpm, tempRoot, group.id, group.filters)]));
      const report = buildReport(baseline, grouped);
      mkdirSync(dirname(target), { recursive: true });
      writeJson(target, report);
      process.stdout.write(`${report.verdict}: baseline=${report.baselineCount} groups=${JSON.stringify(report.groupCounts)} output=${target}\n`);
      if (report.verdict !== "PASS") process.exitCode = 1;
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
    return;
  }
  if (mode === "run") runGroups(target);
  const verification = verifyDirectory(target);
  const walls = Object.fromEntries(GROUPS.map((group) => [group.id, verification.groups[group.id].wallMs]));
  const risks = Object.fromEntries(GROUPS.map((group) => [group.id, verification.groups[group.id].riskStrings]));
  process.stdout.write(
    `${verification.verdict}: groups=${JSON.stringify(verification.inventory.groupCounts)} ` +
    `wallsMs=${JSON.stringify(walls)} risks=${JSON.stringify(risks)} outputDir=${target}\n`
  );
  if (verification.verdict !== "PASS") process.exitCode = 1;
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
