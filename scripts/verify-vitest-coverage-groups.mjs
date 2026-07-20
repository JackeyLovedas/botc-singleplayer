import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import {
  OWNERSHIP_CONTRACTS,
  auditOwnershipContracts
} from "./vitest-ownership-contracts.mjs";

const EMPTY_TEST_NAME_PATTERN = "";
const DREAMER_VORTOX_CORE_PATTERN = "\\[(?:2B19A3A|2B19A3B1)-";
const DREAMER_VORTOX_GAINED_PATTERN = "\\[2B19B-";

const ORDINARY_GROUPS = Object.freeze([
  Object.freeze({ id: "domain-core-rebuild", projects: Object.freeze(["domain-core-rebuild"]) }),
  Object.freeze({ id: "domain-core-rest", projects: Object.freeze(["domain-core"]) }),
  Object.freeze({ id: "application", projects: Object.freeze(["application"]) }),
  Object.freeze({
    id: "application-service-core",
    projects: Object.freeze(["application-service-core"])
  }),
  Object.freeze({
    id: "application-service-role-actions",
    projects: Object.freeze(["application-service-role-actions"])
  }),
  Object.freeze({
    id: "application-service-information-and-later-actions",
    projects: Object.freeze(["application-service-information-and-later-actions"])
  }),
  Object.freeze({
    id: "application-service-compatibility-and-failure-boundaries",
    projects: Object.freeze(["application-service-compatibility-and-failure-boundaries"])
  }),
  Object.freeze({
    id: "application-service-dreamer-vortox",
    projects: Object.freeze(["application-service-dreamer-vortox"])
  }),
  Object.freeze({
    id: "engines-and-projections",
    projects: Object.freeze([
      "assignment-engine",
      "information-engine",
      "projections",
      "rules-snv",
      "setup-engine",
      "task-engine",
      "test-harness"
    ])
  })
]);

const COVERAGE_GROUPS = Object.freeze([
  ...ORDINARY_GROUPS.filter((group) => group.id !== "application-service-dreamer-vortox").map(
    (group) =>
      Object.freeze({
        id: group.id,
        projects: group.projects,
        testNamePattern: EMPTY_TEST_NAME_PATTERN
      })
  ),
  Object.freeze({
    id: "application-service-dreamer-vortox-core",
    projects: Object.freeze(["application-service-dreamer-vortox"]),
    testNamePattern: DREAMER_VORTOX_CORE_PATTERN
  }),
  Object.freeze({
    id: "application-service-dreamer-vortox-gained",
    projects: Object.freeze(["application-service-dreamer-vortox"]),
    testNamePattern: DREAMER_VORTOX_GAINED_PATTERN
  })
].sort((left, right) => {
  const ordinaryOrder = ORDINARY_GROUPS.map((group) => group.id);
  const order = [
    ...ordinaryOrder.slice(0, ordinaryOrder.indexOf("application-service-dreamer-vortox")),
    "application-service-dreamer-vortox-core",
    "application-service-dreamer-vortox-gained",
    ...ordinaryOrder.slice(ordinaryOrder.indexOf("application-service-dreamer-vortox") + 1)
  ];
  return order.indexOf(left.id) - order.indexOf(right.id);
}));

const LEGACY_APPLICATION_SERVICE_PROJECTS = Object.freeze([
  "application-service-core",
  "application-service-role-actions",
  "application-service-information-and-later-actions",
  "application-service-compatibility-and-failure-boundaries"
]);
function parseArguments(argv) {
  const options = {
    workspace: "vitest.workspace.ts",
    mergedReport: null,
    mergedGroupReports: [],
    output: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--workspace") {
      options.workspace = requireValue(argv, ++index, argument);
    } else if (argument === "--merged-report") {
      options.mergedReport = requireValue(argv, ++index, argument);
    } else if (argument === "--merged-group-report") {
      const value = requireValue(argv, ++index, argument);
      const separator = value.indexOf("=");
      if (separator <= 0 || separator === value.length - 1) {
        throw new Error(
          `Invalid --merged-group-report value (expected group=path): ${value}`
        );
      }
      options.mergedGroupReports.push({
        group: value.slice(0, separator),
        report: value.slice(separator + 1)
      });
    } else if (argument === "--output") {
      options.output = requireValue(argv, ++index, argument);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function requireValue(argv, index, option) {
  const value = argv[index];
  if (value === undefined || value.startsWith("--")) {
    throw new Error(`Missing value for ${option}`);
  }
  return value;
}

function normalizeTestFile(repoRoot, file) {
  const absolute = path.resolve(file);
  const relative = path.relative(repoRoot, absolute);
  if (relative === "" || relative === ".." || relative.startsWith(`..${path.sep}`)) {
    throw new Error(`Test file is outside the repository: ${file}`);
  }
  return relative.split(path.sep).join("/");
}

function splitTestName(name) {
  if (typeof name !== "string" || name.length === 0) {
    throw new Error("Vitest inventory contains an empty test name");
  }
  const segments = name.split(" > ");
  return {
    ancestorPath: segments.slice(0, -1),
    title: segments.at(-1)
  };
}

function canonicalizeInventoryEntry(repoRoot, entry) {
  if (
    entry === null ||
    typeof entry !== "object" ||
    typeof entry.projectName !== "string" ||
    typeof entry.file !== "string"
  ) {
    throw new Error("Vitest inventory contains an invalid entry");
  }
  const name = splitTestName(entry.name);
  return {
    project: entry.projectName,
    file: normalizeTestFile(repoRoot, entry.file),
    ancestorPath: name.ancestorPath,
    title: name.title
  };
}

function identityKey(identity) {
  return JSON.stringify([
    identity.project,
    identity.file,
    identity.ancestorPath,
    identity.title
  ]);
}

function semanticIdentityKey(identity) {
  return JSON.stringify([identity.file, identity.ancestorPath, identity.title]);
}

function coverageExecutionIdentityKey(group, identity) {
  return JSON.stringify([
    group.id,
    identity.project,
    group.testNamePattern,
    identity.file,
    identity.ancestorPath,
    identity.title
  ]);
}

function reportLookupKey(file, ancestorPath, title) {
  return JSON.stringify([file, [...ancestorPath, title].join(" > ")]);
}

function runVitestList(
  repoRoot,
  workspace,
  projects,
  destination,
  testNamePattern = EMPTY_TEST_NAME_PATTERN
) {
  const vitestCli = path.join(repoRoot, "node_modules", "vitest", "vitest.mjs");
  if (!existsSync(vitestCli)) {
    throw new Error(`Vitest CLI is not installed: ${vitestCli}`);
  }
  const arguments_ = [
    vitestCli,
    "list",
    "--workspace",
    workspace,
    `--json=${destination}`,
    ...projects.map((project) => `--project=${project}`),
    ...(testNamePattern === EMPTY_TEST_NAME_PATTERN
      ? []
      : [`--testNamePattern=${testNamePattern}`])
  ];
  const result = spawnSync(process.execPath, arguments_, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(
      `Vitest inventory command failed (${projects.join(", ") || "full workspace"}):\n${result.stdout}\n${result.stderr}`
    );
  }
  if (!existsSync(destination)) {
    throw new Error(`Vitest did not write inventory: ${destination}`);
  }
  const parsed = JSON.parse(readFileSync(destination, "utf8"));
  if (!Array.isArray(parsed)) {
    throw new Error(`Vitest inventory is not an array: ${destination}`);
  }
  return parsed.map((entry) => canonicalizeInventoryEntry(repoRoot, entry));
}

function increment(counts, key) {
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function keysWithCount(counts, predicate) {
  return [...counts.entries()]
    .filter(([, count]) => predicate(count))
    .map(([key]) => key)
    .sort();
}

function sha256Keys(keys) {
  return createHash("sha256").update([...keys].sort().join("\n"), "utf8").digest("hex");
}

function assertCompletePassedReport(report, context) {
  if (report === null || typeof report !== "object" || !Array.isArray(report.testResults)) {
    throw new Error(`${context} has an invalid shape`);
  }
  const exactZeroFields = [
    "numFailedTests",
    "numPendingTests",
    "numTodoTests",
    "numFailedTestSuites",
    "numPendingTestSuites"
  ];
  for (const field of exactZeroFields) {
    if (report[field] !== 0) {
      throw new Error(`${context} requires ${field}=0; received ${String(report[field])}`);
    }
  }
  if (
    report.success !== true ||
    !Number.isInteger(report.numTotalTests) ||
    report.numTotalTests < 0 ||
    report.numPassedTests !== report.numTotalTests ||
    !Number.isInteger(report.numTotalTestSuites) ||
    report.numTotalTestSuites < 0 ||
    report.numPassedTestSuites !== report.numTotalTestSuites
  ) {
    throw new Error(
      `${context} is not completely passed: success=${String(report.success)}, tests=${String(report.numPassedTests)}/${String(report.numTotalTests)}, suites=${String(report.numPassedTestSuites)}/${String(report.numTotalTestSuites)}`
    );
  }
  for (const suite of report.testResults) {
    if (
      suite === null ||
      typeof suite !== "object" ||
      suite.status !== "passed" ||
      !Array.isArray(suite.assertionResults)
    ) {
      throw new Error(`${context} contains a non-passed or invalid suite`);
    }
    for (const assertion of suite.assertionResults) {
      if (
        assertion === null ||
        typeof assertion !== "object" ||
        assertion.status !== "passed"
      ) {
        throw new Error(
          `${context} contains a non-passed or invalid assertion (${String(assertion?.status)})`
        );
      }
    }
  }
}

function preflightMergedReport(repoRoot, reportPath, context) {
  const absolute = path.resolve(repoRoot, reportPath);
  if (!existsSync(absolute)) {
    throw new Error(`${context} does not exist: ${absolute}`);
  }
  const report = JSON.parse(readFileSync(absolute, "utf8"));
  if (report === null || typeof report !== "object" || !Array.isArray(report.testResults)) {
    throw new Error(`${context} has an invalid shape`);
  }
}

function validateMergedReport(repoRoot, mergedReportPath, fullInventory) {
  const report = JSON.parse(readFileSync(path.resolve(repoRoot, mergedReportPath), "utf8"));
  assertCompletePassedReport(report, "Merged Vitest group report");

  const expectedByReportIdentity = new Map();
  for (const identity of fullInventory) {
    const lookupKey = reportLookupKey(identity.file, identity.ancestorPath, identity.title);
    const candidates = expectedByReportIdentity.get(lookupKey) ?? [];
    candidates.push(identity);
    expectedByReportIdentity.set(lookupKey, candidates);
  }

  const actualCounts = new Map();
  const unexpected = [];
  const ambiguous = [];
  let actualTotal = 0;
  for (const testResult of report.testResults) {
    if (
      testResult === null ||
      typeof testResult !== "object" ||
      typeof testResult.name !== "string" ||
      !Array.isArray(testResult.assertionResults) ||
      testResult.status !== "passed"
    ) {
      throw new Error("Merged Vitest group report contains a non-passed or invalid suite");
    }
    const file = normalizeTestFile(repoRoot, testResult.name);
    for (const assertion of testResult.assertionResults) {
      actualTotal += 1;
      if (
        assertion === null ||
        typeof assertion !== "object" ||
        !Array.isArray(assertion.ancestorTitles) ||
        !assertion.ancestorTitles.every((title) => typeof title === "string") ||
        typeof assertion.title !== "string"
      ) {
        throw new Error("Merged Vitest report contains an invalid assertion result");
      }
      if (assertion.status !== "passed") {
        throw new Error(
          `Merged Vitest group report contains a non-passed assertion (${String(assertion.status)}): ${String(assertion.fullName)}`
        );
      }
      const lookupKey = reportLookupKey(file, assertion.ancestorTitles, assertion.title);
      const candidates = expectedByReportIdentity.get(lookupKey) ?? [];
      if (candidates.length === 0) {
        unexpected.push(lookupKey);
        continue;
      }
      if (candidates.length !== 1) {
        ambiguous.push(lookupKey);
        continue;
      }
      increment(actualCounts, identityKey(candidates[0]));
    }
  }

  const expectedKeys = fullInventory.map(identityKey);
  const missing = expectedKeys.filter((key) => !actualCounts.has(key)).sort();
  const duplicate = keysWithCount(actualCounts, (count) => count > 1);
  if (
    actualTotal !== fullInventory.length ||
    report.numTotalTests !== fullInventory.length ||
    missing.length > 0 ||
    duplicate.length > 0 ||
    unexpected.length > 0 ||
    ambiguous.length > 0
  ) {
    throw new Error(
      `Merged test identity mismatch: expected=${fullInventory.length}, actual=${actualTotal}, report=${report.numTotalTests}, missing=${missing.length}, duplicate=${duplicate.length}, unexpected=${unexpected.length}, ambiguous=${ambiguous.length}`
    );
  }

  return {
    totalTests: actualTotal,
    failedTests: report.numFailedTests,
    missing: missing.length,
    duplicate: duplicate.length,
    unexpected: unexpected.length,
    ambiguous: ambiguous.length
  };
}

function validateMergedReportTotals(repoRoot, mergedReportPath, expectedTotal) {
  const report = JSON.parse(readFileSync(path.resolve(repoRoot, mergedReportPath), "utf8"));
  assertCompletePassedReport(report, "Merged Vitest global report");

  let actualTotal = 0;
  for (const testResult of report.testResults) {
    if (
      testResult === null ||
      typeof testResult !== "object" ||
      !Array.isArray(testResult.assertionResults) ||
      testResult.status !== "passed"
    ) {
      throw new Error("Merged Vitest global report contains a non-passed or invalid suite");
    }
    for (const assertion of testResult.assertionResults) {
      actualTotal += 1;
      if (
        assertion === null ||
        typeof assertion !== "object" ||
        assertion.status !== "passed"
      ) {
        throw new Error(
          `Merged Vitest global report contains a non-passed or invalid assertion (${String(assertion?.status)})`
        );
      }
    }
  }
  if (actualTotal !== expectedTotal || report.numTotalTests !== expectedTotal) {
    throw new Error(
      `Merged test total mismatch: expected=${expectedTotal}, actual=${actualTotal}, report=${report.numTotalTests}`
    );
  }
  return {
    totalTests: actualTotal,
    failedTests: report.numFailedTests
  };
}

function validateFilteredMergedReport(
  repoRoot,
  mergedReportPath,
  selectedInventory,
  skippedInventory
) {
  const report = JSON.parse(readFileSync(path.resolve(repoRoot, mergedReportPath), "utf8"));
  const context = "Filtered Vitest group report";
  if (report === null || typeof report !== "object" || !Array.isArray(report.testResults)) {
    throw new Error(`${context} has an invalid shape`);
  }
  for (const field of ["numFailedTests", "numTodoTests", "numFailedTestSuites", "numPendingTestSuites"]) {
    if (report[field] !== 0) {
      throw new Error(`${context} requires ${field}=0; received ${String(report[field])}`);
    }
  }
  if (
    report.success !== true ||
    report.numPassedTests !== selectedInventory.length ||
    report.numPendingTests !== skippedInventory.length ||
    report.numTotalTests !== selectedInventory.length + skippedInventory.length ||
    report.numPassedTestSuites !== report.numTotalTestSuites
  ) {
    throw new Error(
      `${context} totals mismatch: success=${String(report.success)}, passed=${String(report.numPassedTests)}/${selectedInventory.length}, skipped=${String(report.numPendingTests)}/${skippedInventory.length}, total=${String(report.numTotalTests)}/${selectedInventory.length + skippedInventory.length}`
    );
  }

  const selectedByReportIdentity = new Map();
  const skippedByReportIdentity = new Map();
  for (const [inventory, lookup] of [
    [selectedInventory, selectedByReportIdentity],
    [skippedInventory, skippedByReportIdentity]
  ]) {
    for (const identity of inventory) {
      const key = reportLookupKey(identity.file, identity.ancestorPath, identity.title);
      const candidates = lookup.get(key) ?? [];
      candidates.push(identity);
      lookup.set(key, candidates);
    }
  }

  const passedCounts = new Map();
  const skippedCounts = new Map();
  const unexpected = [];
  const ambiguous = [];
  for (const testResult of report.testResults) {
    if (
      testResult === null ||
      typeof testResult !== "object" ||
      typeof testResult.name !== "string" ||
      !Array.isArray(testResult.assertionResults) ||
      testResult.status !== "passed"
    ) {
      throw new Error(`${context} contains a non-passed or invalid suite`);
    }
    const file = normalizeTestFile(repoRoot, testResult.name);
    for (const assertion of testResult.assertionResults) {
      if (
        assertion === null ||
        typeof assertion !== "object" ||
        !Array.isArray(assertion.ancestorTitles) ||
        !assertion.ancestorTitles.every((title) => typeof title === "string") ||
        typeof assertion.title !== "string"
      ) {
        throw new Error(`${context} contains an invalid assertion result`);
      }
      const key = reportLookupKey(file, assertion.ancestorTitles, assertion.title);
      const lookup = assertion.status === "passed"
        ? selectedByReportIdentity
        : assertion.status === "skipped"
          ? skippedByReportIdentity
          : null;
      if (lookup === null) {
        throw new Error(
          `${context} contains forbidden assertion status ${String(assertion.status)}: ${String(assertion.fullName)}`
        );
      }
      const candidates = lookup.get(key) ?? [];
      if (candidates.length === 0) {
        unexpected.push(`${assertion.status}:${key}`);
        continue;
      }
      if (candidates.length !== 1) {
        ambiguous.push(`${assertion.status}:${key}`);
        continue;
      }
      increment(
        assertion.status === "passed" ? passedCounts : skippedCounts,
        semanticIdentityKey(candidates[0])
      );
    }
  }

  const expectedPassed = selectedInventory.map(semanticIdentityKey);
  const expectedSkipped = skippedInventory.map(semanticIdentityKey);
  const missingPassed = expectedPassed.filter((key) => !passedCounts.has(key));
  const missingSkipped = expectedSkipped.filter((key) => !skippedCounts.has(key));
  const duplicatePassed = keysWithCount(passedCounts, (count) => count !== 1);
  const duplicateSkipped = keysWithCount(skippedCounts, (count) => count !== 1);
  if (
    missingPassed.length > 0 ||
    missingSkipped.length > 0 ||
    duplicatePassed.length > 0 ||
    duplicateSkipped.length > 0 ||
    unexpected.length > 0 ||
    ambiguous.length > 0
  ) {
    throw new Error(
      `${context} identity mismatch: missingPassed=${missingPassed.length}, missingSkipped=${missingSkipped.length}, duplicatePassed=${duplicatePassed.length}, duplicateSkipped=${duplicateSkipped.length}, unexpected=${unexpected.length}, ambiguous=${ambiguous.length}`
    );
  }

  return {
    totalTests: selectedInventory.length,
    passedTests: selectedInventory.length,
    skippedComplement: skippedInventory.length,
    discoveredTests: selectedInventory.length + skippedInventory.length,
    failedTests: 0,
    missing: 0,
    duplicate: 0,
    unexpected: 0,
    ambiguous: 0
  };
}

function validateCoverageMergedReportCollision(
  repoRoot,
  mergedReportPath,
  fullInventory,
  dreamerVortoxFull,
  coreInventory,
  gainedInventory
) {
  const report = JSON.parse(readFileSync(path.resolve(repoRoot, mergedReportPath), "utf8"));
  const context = "Merged Vitest coverage report";
  if (report === null || typeof report !== "object" || !Array.isArray(report.testResults)) {
    throw new Error(`${context} has an invalid shape`);
  }
  for (const field of ["numFailedTests", "numTodoTests", "numFailedTestSuites", "numPendingTestSuites"]) {
    if (report[field] !== 0) {
      throw new Error(`${context} requires ${field}=0; received ${String(report[field])}`);
    }
  }
  if (report.success !== true || report.numPassedTestSuites !== report.numTotalTestSuites) {
    throw new Error(`${context} contains a failed suite or unsuccessful result`);
  }

  const expectedByReportIdentity = new Map();
  for (const identity of fullInventory) {
    const key = reportLookupKey(identity.file, identity.ancestorPath, identity.title);
    const candidates = expectedByReportIdentity.get(key) ?? [];
    candidates.push(identity);
    expectedByReportIdentity.set(key, candidates);
  }
  const statusCounts = new Map();
  const unexpected = [];
  const ambiguous = [];
  let assertionTotal = 0;
  let passedAssertions = 0;
  let skippedAssertions = 0;
  for (const testResult of report.testResults) {
    if (
      testResult === null ||
      typeof testResult !== "object" ||
      typeof testResult.name !== "string" ||
      !Array.isArray(testResult.assertionResults) ||
      testResult.status !== "passed"
    ) {
      throw new Error(`${context} contains a non-passed or invalid suite`);
    }
    const file = normalizeTestFile(repoRoot, testResult.name);
    for (const assertion of testResult.assertionResults) {
      assertionTotal += 1;
      if (
        assertion === null ||
        typeof assertion !== "object" ||
        !Array.isArray(assertion.ancestorTitles) ||
        typeof assertion.title !== "string" ||
        !["passed", "skipped"].includes(assertion.status)
      ) {
        throw new Error(`${context} contains an invalid assertion result`);
      }
      assertion.status === "passed" ? (passedAssertions += 1) : (skippedAssertions += 1);
      const key = reportLookupKey(file, assertion.ancestorTitles, assertion.title);
      const candidates = expectedByReportIdentity.get(key) ?? [];
      if (candidates.length === 0) {
        unexpected.push(key);
        continue;
      }
      if (candidates.length !== 1) {
        ambiguous.push(key);
        continue;
      }
      const semanticKey = semanticIdentityKey(candidates[0]);
      const counts = statusCounts.get(semanticKey) ?? { passed: 0, skipped: 0 };
      counts[assertion.status] += 1;
      statusCounts.set(semanticKey, counts);
    }
  }

  const dreamerKeys = new Set(dreamerVortoxFull.map(semanticIdentityKey));
  const coreKeys = coreInventory.map(semanticIdentityKey);
  const gainedKeys = gainedInventory.map(semanticIdentityKey);
  const missing = [];
  const invalid = [];
  for (const identity of fullInventory) {
    const key = semanticIdentityKey(identity);
    const counts = statusCounts.get(key);
    if (!counts) {
      missing.push(key);
      continue;
    }
    if (!dreamerKeys.has(key) && (counts.passed !== 1 || counts.skipped !== 0)) {
      invalid.push(key);
    }
  }
  const partitionSignature = (keys) => {
    const statuses = new Set(
      keys.map((key) => {
        const counts = statusCounts.get(key) ?? { passed: 0, skipped: 0 };
        return `${counts.passed}/${counts.skipped}`;
      })
    );
    return statuses.size === 1 ? [...statuses][0] : "MIXED";
  };
  const coreSignature = partitionSignature(coreKeys);
  const gainedSignature = partitionSignature(gainedKeys);
  const collisionSignatureValid =
    (coreSignature === "2/0" && gainedSignature === "0/2") ||
    (coreSignature === "0/2" && gainedSignature === "2/0");
  if (
    report.numTotalTests !== fullInventory.length + dreamerVortoxFull.length ||
    assertionTotal !== report.numTotalTests ||
    passedAssertions !== report.numPassedTests ||
    skippedAssertions !== report.numPendingTests ||
    missing.length > 0 ||
    invalid.length > 0 ||
    unexpected.length > 0 ||
    ambiguous.length > 0 ||
    !collisionSignatureValid
  ) {
    throw new Error(
      `${context} does not match the exact Vitest same-project task-ID collision: report=${String(report.numPassedTests)}/${String(report.numTotalTests)}, assertions=${passedAssertions}/${assertionTotal}, skipped=${skippedAssertions}, core=${coreSignature}, gained=${gainedSignature}, missing=${missing.length}, invalid=${invalid.length}, unexpected=${unexpected.length}, ambiguous=${ambiguous.length}`
    );
  }

  return {
    authoritative: false,
    classification: "KNOWN_VITEST_SAME_PROJECT_FILTERED_TASK_ID_COLLISION",
    discoveredTests: report.numTotalTests,
    passedAssertions,
    skippedAssertions,
    failedTests: report.numFailedTests,
    coreSignature,
    gainedSignature,
    semanticUnionAuthority: "EXACT_SINGLE_GROUP_REPORTS"
  };
}

function classifyDreamerVortoxMarker(identity) {
  const matches = [];
  if (identity.title.includes("[2B19A3A-")) {
    matches.push("2B19A3A");
  }
  if (identity.title.includes("[2B19A3B1-")) {
    matches.push("2B19A3B1");
  }
  if (identity.title.includes("[2B19B-")) {
    matches.push("2B19B");
  }
  if (matches.length !== 1) {
    throw new Error(
      `Dreamer-Vortox test must contain exactly one supported marker: ${identity.title}`
    );
  }
  return matches[0];
}

function assertExactKeySet(actualKeys, expectedKeys, context) {
  const actual = new Set(actualKeys);
  const expected = new Set(expectedKeys);
  const missing = [...expected].filter((key) => !actual.has(key)).sort();
  const unexpected = [...actual].filter((key) => !expected.has(key)).sort();
  if (
    actual.size !== actualKeys.length ||
    expected.size !== expectedKeys.length ||
    missing.length > 0 ||
    unexpected.length > 0
  ) {
    throw new Error(
      `${context} mismatch: expected=${expected.size}, actual=${actual.size}, missing=${missing.length}, unexpected=${unexpected.length}`
    );
  }
}

function selectMergedReportTopology(groupReports) {
  const actual = [...new Set(groupReports.map((entry) => entry.group))].sort();
  if (actual.length !== groupReports.length) {
    throw new Error("Duplicate merged group report");
  }
  const candidates = [
    { id: "ordinary", groups: ORDINARY_GROUPS },
    { id: "coverage", groups: COVERAGE_GROUPS }
  ].filter((candidate) => {
    const expected = candidate.groups.map((group) => group.id).sort();
    return (
      expected.length === actual.length &&
      expected.every((group, index) => group === actual[index])
    );
  });
  if (candidates.length !== 1) {
    throw new Error(
      `Merged group reports do not match exactly one supported topology: ${actual.join(",")}`
    );
  }
  return candidates[0];
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const repoRoot = process.cwd();
  const expectedProjects = ORDINARY_GROUPS.flatMap((group) => group.projects);
  if (new Set(expectedProjects).size !== expectedProjects.length) {
    throw new Error("Ordinary group definitions contain a duplicate project");
  }
  if (new Set(ORDINARY_GROUPS.map((group) => group.id)).size !== ORDINARY_GROUPS.length) {
    throw new Error("Ordinary group definitions contain a duplicate group ID");
  }
  if (new Set(COVERAGE_GROUPS.map((group) => group.id)).size !== COVERAGE_GROUPS.length) {
    throw new Error("Coverage group definitions contain a duplicate group ID");
  }
  for (const group of COVERAGE_GROUPS) {
    if (typeof group.testNamePattern !== "string") {
      throw new Error(`Coverage group ${group.id} has no explicit testNamePattern`);
    }
  }
  if (options.mergedReport) {
    preflightMergedReport(repoRoot, options.mergedReport, "Merged Vitest global report");
  }
  for (const groupReport of options.mergedGroupReports) {
    preflightMergedReport(
      repoRoot,
      groupReport.report,
      `Merged Vitest group report (${groupReport.group})`
    );
  }

  const tempRoot = path.resolve(tmpdir());
  const tempDirectory = mkdtempSync(path.join(tempRoot, "botc-vitest-inventory-"));
  try {
    const fullInventory = runVitestList(
      repoRoot,
      options.workspace,
      [],
      path.join(tempDirectory, "full.json")
    );
    const fullCounts = new Map();
    const fullSemanticCounts = new Map();
    for (const identity of fullInventory) {
      increment(fullCounts, identityKey(identity));
      increment(fullSemanticCounts, semanticIdentityKey(identity));
    }
    const duplicateInFullInventory = keysWithCount(fullCounts, (count) => count > 1);
    if (duplicateInFullInventory.length > 0) {
      throw new Error(
        `Full workspace inventory contains ${duplicateInFullInventory.length} duplicate canonical identities`
      );
    }
    const duplicateSemanticInventory = keysWithCount(
      fullSemanticCounts,
      (count) => count > 1
    );
    if (duplicateSemanticInventory.length > 0) {
      throw new Error(
        `Full workspace inventory contains ${duplicateSemanticInventory.length} duplicate semantic identities`
      );
    }

    const actualProjects = [...new Set(fullInventory.map((identity) => identity.project))].sort();
    const missingProjects = expectedProjects.filter((project) => !actualProjects.includes(project));
    const unexpectedProjects = actualProjects.filter((project) => !expectedProjects.includes(project));
    if (missingProjects.length > 0 || unexpectedProjects.length > 0) {
      throw new Error(
        `Workspace project mismatch: missing=${missingProjects.join(",") || "none"}; unexpected=${unexpectedProjects.join(",") || "none"}`
      );
    }

    const fullKeys = [...fullCounts.keys()];
    const fullSemanticKeys = [...fullSemanticCounts.keys()];
    const fullIdentityBySemanticKey = new Map(
      fullInventory.map((identity) => [semanticIdentityKey(identity), identity])
    );

    const ordinaryUnionCounts = new Map();
    const ordinaryGroupSummaries = [];
    const ordinaryGroupInventories = new Map();
    for (const group of ORDINARY_GROUPS) {
      const inventory = runVitestList(
        repoRoot,
        options.workspace,
        group.projects,
        path.join(tempDirectory, `ordinary-${group.id}.json`)
      );
      for (const identity of inventory) {
        if (!group.projects.includes(identity.project)) {
          throw new Error(
            `Ordinary group ${group.id} returned unexpected project ${identity.project}`
          );
        }
        increment(ordinaryUnionCounts, identityKey(identity));
      }
      ordinaryGroupSummaries.push({
        id: group.id,
        projects: [...group.projects],
        testNamePattern: EMPTY_TEST_NAME_PATTERN,
        tests: inventory.length
      });
      ordinaryGroupInventories.set(group.id, inventory);
    }

    const ordinaryMissing = fullKeys
      .filter((key) => !ordinaryUnionCounts.has(key))
      .sort();
    const ordinaryDuplicate = keysWithCount(
      ordinaryUnionCounts,
      (count) => count > 1
    );
    const ordinaryUnexpected = [...ordinaryUnionCounts.keys()]
      .filter((key) => !fullCounts.has(key))
      .sort();
    if (
      ordinaryMissing.length > 0 ||
      ordinaryDuplicate.length > 0 ||
      ordinaryUnexpected.length > 0
    ) {
      throw new Error(
        `Ordinary group inventory mismatch: missing=${ordinaryMissing.length}, duplicate=${ordinaryDuplicate.length}, unexpected=${ordinaryUnexpected.length}`
      );
    }

    const coverageSemanticCounts = new Map();
    const coverageExecutionCounts = new Map();
    const coverageGroupSummaries = [];
    const coverageGroupInventories = new Map();
    const wrongOwner = [];
    for (const group of COVERAGE_GROUPS) {
      const inventory = runVitestList(
        repoRoot,
        options.workspace,
        group.projects,
        path.join(tempDirectory, `coverage-${group.id}.json`),
        group.testNamePattern
      );
      for (const identity of inventory) {
        if (!group.projects.includes(identity.project)) {
          throw new Error(
            `Coverage group ${group.id} returned unexpected project ${identity.project}`
          );
        }
        const semanticKey = semanticIdentityKey(identity);
        const ordinaryIdentity = fullIdentityBySemanticKey.get(semanticKey);
        if (ordinaryIdentity && ordinaryIdentity.project !== identity.project) {
          wrongOwner.push(
            JSON.stringify([
              semanticKey,
              ordinaryIdentity.project,
              identity.project,
              group.id
            ])
          );
        }
        increment(coverageSemanticCounts, semanticKey);
        increment(coverageExecutionCounts, coverageExecutionIdentityKey(group, identity));
      }
      coverageGroupSummaries.push({
        id: group.id,
        projects: [...group.projects],
        testNamePattern: group.testNamePattern,
        tests: inventory.length
      });
      coverageGroupInventories.set(group.id, inventory);
    }

    const missing = fullSemanticKeys
      .filter((key) => !coverageSemanticCounts.has(key))
      .sort();
    const duplicate = keysWithCount(coverageSemanticCounts, (count) => count > 1);
    const unexpected = [...coverageSemanticCounts.keys()]
      .filter((key) => !fullSemanticCounts.has(key))
      .sort();
    const duplicateCoverageExecutions = keysWithCount(
      coverageExecutionCounts,
      (count) => count > 1
    );
    if (
      missing.length > 0 ||
      duplicate.length > 0 ||
      unexpected.length > 0 ||
      wrongOwner.length > 0 ||
      duplicateCoverageExecutions.length > 0
    ) {
      throw new Error(
        `Coverage group inventory mismatch: missing=${missing.length}, duplicate=${duplicate.length}, unexpected=${unexpected.length}, wrongOwner=${wrongOwner.length}, duplicateExecution=${duplicateCoverageExecutions.length}`
      );
    }

    const dreamerVortoxFull = fullInventory.filter(
      (identity) => identity.project === "application-service-dreamer-vortox"
    );
    const dreamerVortoxByMarker = new Map([
      ["2B19A3A", []],
      ["2B19A3B1", []],
      ["2B19B", []]
    ]);
    for (const identity of dreamerVortoxFull) {
      dreamerVortoxByMarker.get(classifyDreamerVortoxMarker(identity)).push(identity);
    }
    const expectedCoreKeys = [
      ...dreamerVortoxByMarker.get("2B19A3A"),
      ...dreamerVortoxByMarker.get("2B19A3B1")
    ].map(semanticIdentityKey);
    const expectedGainedKeys = dreamerVortoxByMarker
      .get("2B19B")
      .map(semanticIdentityKey);
    const actualCore = coverageGroupInventories.get(
      "application-service-dreamer-vortox-core"
    );
    const actualGained = coverageGroupInventories.get(
      "application-service-dreamer-vortox-gained"
    );
    assertExactKeySet(
      actualCore.map(semanticIdentityKey),
      expectedCoreKeys,
      "Dreamer-Vortox core filter"
    );
    assertExactKeySet(
      actualGained.map(semanticIdentityKey),
      expectedGainedKeys,
      "Dreamer-Vortox gained filter"
    );

    const physicalTestFiles = new Set(fullInventory.map((identity) => identity.file));
    const projectFileExecutions = new Set(
      fullInventory.map((identity) => JSON.stringify([identity.project, identity.file]))
    );
    const ownershipAudits = auditOwnershipContracts({
      repoRoot,
      contracts: OWNERSHIP_CONTRACTS,
      fullInventory,
      legacyApplicationServiceProjects: LEGACY_APPLICATION_SERVICE_PROJECTS
    });
    const ownership =
      ownershipAudits.length === 1
        ? Object.fromEntries(
            Object.entries(ownershipAudits[0]).filter(
              ([key]) => key !== "contractId"
            )
          )
        : { contracts: ownershipAudits };
    let mergedReport = null;
    if (options.mergedGroupReports.length > 0) {
      if (!options.mergedReport) {
        throw new Error("--merged-report is required when group reports are supplied");
      }
      const topology = selectMergedReportTopology(options.mergedGroupReports);
      const reportByGroup = new Map();
      for (const groupReport of options.mergedGroupReports) {
        reportByGroup.set(groupReport.group, groupReport.report);
      }
      const inventoryByGroup =
        topology.id === "ordinary"
          ? ordinaryGroupInventories
          : coverageGroupInventories;
      const topologyGroupById = new Map(
        topology.groups.map((group) => [group.id, group])
      );
      mergedReport = {
        topology: topology.id,
        full:
          topology.id === "ordinary"
            ? validateMergedReportTotals(repoRoot, options.mergedReport, fullInventory.length)
            : validateCoverageMergedReportCollision(
                repoRoot,
                options.mergedReport,
                fullInventory,
                dreamerVortoxFull,
                actualCore,
                actualGained
              ),
        groups: topology.groups.map((group) => {
          const topologyGroup = topologyGroupById.get(group.id);
          const selectedInventory = inventoryByGroup.get(group.id);
          const filtered =
            typeof topologyGroup?.testNamePattern === "string" &&
            topologyGroup.testNamePattern !== EMPTY_TEST_NAME_PATTERN;
          const selectedKeys = new Set(selectedInventory.map(semanticIdentityKey));
          const skippedInventory = filtered
            ? dreamerVortoxFull.filter(
                (identity) => !selectedKeys.has(semanticIdentityKey(identity))
              )
            : [];
          return {
            id: group.id,
            ...(filtered
              ? validateFilteredMergedReport(
                  repoRoot,
                  reportByGroup.get(group.id),
                  selectedInventory,
                  skippedInventory
                )
              : validateMergedReport(
                  repoRoot,
                  reportByGroup.get(group.id),
                  selectedInventory
                ))
          };
        })
      };
    } else if (options.mergedReport) {
      mergedReport = validateMergedReport(repoRoot, options.mergedReport, fullInventory);
    }

    const summary = {
      physicalTestFiles: physicalTestFiles.size,
      workspaceProjectFileExecutions: projectFileExecutions.size,
      totalTests: fullInventory.length,
      groups: coverageGroupSummaries,
      ordinaryGroups: ordinaryGroupSummaries,
      coverageGroups: coverageGroupSummaries,
      ordinaryProjectExecutionIdentity: {
        total: fullKeys.length,
        missing: ordinaryMissing.length,
        duplicate: ordinaryDuplicate.length,
        unexpected: ordinaryUnexpected.length,
        sha256: sha256Keys(fullKeys)
      },
      coverageGroupExecutionIdentity: {
        total: coverageExecutionCounts.size,
        duplicate: duplicateCoverageExecutions.length,
        sha256: sha256Keys([...coverageExecutionCounts.keys()])
      },
      semanticIdentity: {
        total: fullSemanticKeys.length,
        coverageUnion: coverageSemanticCounts.size,
        intersection: duplicate.length,
        missing: missing.length,
        duplicate: duplicate.length,
        unexpected: unexpected.length,
        wrongOwner: wrongOwner.length,
        sha256: sha256Keys(fullSemanticKeys)
      },
      dreamerVortoxPartition: {
        project: "application-service-dreamer-vortox",
        full: dreamerVortoxFull.length,
        core: actualCore.length,
        gained: actualGained.length,
        union: actualCore.length + actualGained.length,
        intersection: 0,
        markers: {
          "2B19A3A": dreamerVortoxByMarker.get("2B19A3A").length,
          "2B19A3B1": dreamerVortoxByMarker.get("2B19A3B1").length,
          "2B19B": dreamerVortoxByMarker.get("2B19B").length
        }
      },
      missing: missing.length,
      duplicate: duplicate.length,
      unexpected: unexpected.length,
      wrongOwner: wrongOwner.length,
      inventorySha256: sha256Keys(fullKeys),
      ownership,
      mergedReport
    };

    const serialized = `${JSON.stringify(summary, null, 2)}\n`;
    process.stdout.write(serialized);
    if (options.output) {
      writeFileSync(path.resolve(repoRoot, options.output), serialized, "utf8");
    }
  } finally {
    const resolvedTempDirectory = path.resolve(tempDirectory);
    if (!resolvedTempDirectory.startsWith(`${tempRoot}${path.sep}`)) {
      process.stderr.write(
        `Refusing to remove unexpected temporary path: ${resolvedTempDirectory}\n`
      );
      process.exitCode = 1;
    } else {
      rmSync(resolvedTempDirectory, { recursive: true, force: true });
    }
  }
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
