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

const COVERAGE_GROUPS = Object.freeze([
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

const APPLICATION_SERVICE_TEST_FILE =
  "packages/application/src/game-application-service.test.ts";
const DREAMER_VORTOX_MARKER = "[2B19A3A-";
const DREAMER_VORTOX_OWNER_PROJECT = "application-service-dreamer-vortox";
const LEGACY_APPLICATION_SERVICE_PROJECTS = Object.freeze([
  "application-service-core",
  "application-service-role-actions",
  "application-service-information-and-later-actions",
  "application-service-compatibility-and-failure-boundaries"
]);
const TRACEABILITY_FILE =
  "docs/implementation/phase-3-slice-2b19a3a-test-traceability.md";
const FROZEN_BASELINE = Object.freeze({
  markerProjectExecutions: 34,
  markerProjectInventorySha256:
    "3829eb2a26e28e22a568d7e393e22c68aedb8979021a3e3b4522b9e53b6d3c8e",
  markerSemanticInventorySha256:
    "5e544f734381f99f20ac715513b7af7e5a33af6726ca9cad8a0c6d8c1fe7b2cb",
  markerAuthorityInventorySha256:
    "e098696e88ed4f3d050b6d24511b05522aa26afed43d4f8d09d668c81309f676",
  nonMarkerOwnershipSha256:
    "92f7e4197bf07f2186bb98e0ce5627964189ceff6f56e286a5a091166f74852c",
  physicalTestFileSetSha256:
    "55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab"
});

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

function ordinalCompare(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256CanonicalLines(lines) {
  return createHash("sha256")
    .update(`${[...lines].sort(ordinalCompare).join("\n")}\n`, "utf8")
    .digest("hex");
}

function tabIdentity(identity, includeProject) {
  const fields = includeProject
    ? [identity.project, identity.file, identity.ancestorPath.join(" > "), identity.title]
    : [identity.file, identity.ancestorPath.join(" > "), identity.title];
  return fields.join("\t");
}

function extractAuthorityMarker(title) {
  const match = /^\[([^\]]+)\]/u.exec(title);
  if (match === null || !match[1].includes("2B19A3A-")) {
    throw new Error(`2B19A3A title has no exact authority marker: ${title}`);
  }
  return match[1];
}

function extractCodeSpan(value) {
  const match = /`([^`]*)`/u.exec(value);
  return match?.[1] ?? value.trim();
}

function traceTitleMatches(actualTitle, inventoryTitle) {
  const fragments = actualTitle.split("...").filter((fragment) => fragment.length > 0);
  let offset = 0;
  for (const fragment of fragments) {
    const next = inventoryTitle.indexOf(fragment, offset);
    if (next < 0) return false;
    offset = next + fragment.length;
  }
  return true;
}

function expectedTraceabilityIds() {
  const ids = [];
  for (let index = 1; index <= 53; index += 1) {
    ids.push(`C${String(index).padStart(2, "0")}`);
  }
  for (let index = 1; index <= 39; index += 1) {
    ids.push(`S${String(index).padStart(2, "0")}`);
  }
  return ids;
}

function reportLookupKey(file, ancestorPath, title) {
  return JSON.stringify([file, [...ancestorPath, title].join(" > ")]);
}

function runVitestList(repoRoot, workspace, projects, destination) {
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
    ...projects.map((project) => `--project=${project}`)
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

function auditOwnershipAndTraceability(repoRoot, fullInventory) {
  const applicationInventory = fullInventory.filter(
    (identity) => identity.file === APPLICATION_SERVICE_TEST_FILE
  );
  const markerInventory = applicationInventory.filter((identity) =>
    identity.title.includes(DREAMER_VORTOX_MARKER)
  );
  const nonMarkerInventory = applicationInventory.filter(
    (identity) => !identity.title.includes(DREAMER_VORTOX_MARKER)
  );

  const markerSemanticOwners = new Map();
  for (const identity of markerInventory) {
    const key = semanticIdentityKey(identity);
    const owners = markerSemanticOwners.get(key) ?? new Set();
    owners.add(identity.project);
    markerSemanticOwners.set(key, owners);
  }
  for (const [key, owners] of markerSemanticOwners) {
    if (owners.size !== 1 || !owners.has(DREAMER_VORTOX_OWNER_PROJECT)) {
      throw new Error(
        `2B19A3A semantic ownership mismatch for ${key}: ${[...owners].sort(ordinalCompare).join(",") || "none"}`
      );
    }
  }
  if (markerInventory.length !== markerSemanticOwners.size) {
    throw new Error(
      `2B19A3A semantic execution mismatch: semantic=${markerSemanticOwners.size}, executions=${markerInventory.length}`
    );
  }

  const markerSemanticLines = [...markerSemanticOwners.keys()].map((key) => {
    const [file, ancestorPath, title] = JSON.parse(key);
    return [file, ancestorPath.join(" > "), title].join("\t");
  });
  const markerSemanticInventorySha256 = sha256CanonicalLines(markerSemanticLines);
  if (
    markerSemanticInventorySha256 !== FROZEN_BASELINE.markerSemanticInventorySha256
  ) {
    throw new Error(
      `2B19A3A physical semantic inventory changed: expected=${FROZEN_BASELINE.markerSemanticInventorySha256}, actual=${markerSemanticInventorySha256}`
    );
  }

  const markerAuthorities = new Set(
    markerInventory.map((identity) => extractAuthorityMarker(identity.title))
  );
  const markerAuthorityInventorySha256 = sha256CanonicalLines(markerAuthorities);
  if (
    markerAuthorityInventorySha256 !== FROZEN_BASELINE.markerAuthorityInventorySha256
  ) {
    throw new Error(
      `2B19A3A authority inventory changed: expected=${FROZEN_BASELINE.markerAuthorityInventorySha256}, actual=${markerAuthorityInventorySha256}`
    );
  }

  const nonMarkerOwners = new Map();
  for (const identity of nonMarkerInventory) {
    const key = semanticIdentityKey(identity);
    const owners = nonMarkerOwners.get(key) ?? new Set();
    owners.add(identity.project);
    nonMarkerOwners.set(key, owners);
  }
  const nonMarkerOwnershipLines = [...nonMarkerOwners].map(([key, owners]) => {
    const [file, ancestorPath, title] = JSON.parse(key);
    return [
      file,
      ancestorPath.join(" > "),
      title,
      [...owners].sort(ordinalCompare).join(",")
    ].join("\t");
  });
  const nonMarkerOwnershipSha256 = sha256CanonicalLines(nonMarkerOwnershipLines);
  if (nonMarkerOwnershipSha256 !== FROZEN_BASELINE.nonMarkerOwnershipSha256) {
    throw new Error(
      `Non-2B19A3A application ownership changed: expected=${FROZEN_BASELINE.nonMarkerOwnershipSha256}, actual=${nonMarkerOwnershipSha256}`
    );
  }

  const physicalTestFiles = new Set(fullInventory.map((identity) => identity.file));
  const physicalTestFileSetSha256 = sha256CanonicalLines(physicalTestFiles);
  if (physicalTestFileSetSha256 !== FROZEN_BASELINE.physicalTestFileSetSha256) {
    throw new Error(
      `Physical test-file inventory changed: expected=${FROZEN_BASELINE.physicalTestFileSetSha256}, actual=${physicalTestFileSetSha256}`
    );
  }

  const traceabilityPath = path.resolve(repoRoot, TRACEABILITY_FILE);
  if (!existsSync(traceabilityPath)) {
    throw new Error(`Traceability file does not exist: ${traceabilityPath}`);
  }
  const traceabilityLines = readFileSync(traceabilityPath, "utf8").split(/\r?\n/u);
  const traceabilityRows = new Map();
  for (const line of traceabilityLines) {
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (!/^[CS]\d{2}$/u.test(cells[0] ?? "")) continue;
    if (traceabilityRows.has(cells[0])) {
      throw new Error(`Duplicate traceability criterion row: ${cells[0]}`);
    }
    traceabilityRows.set(cells[0], cells);
  }
  const expectedIds = expectedTraceabilityIds();
  const missingTraceabilityIds = expectedIds.filter((id) => !traceabilityRows.has(id));
  const unexpectedTraceabilityIds = [...traceabilityRows.keys()].filter(
    (id) => !expectedIds.includes(id)
  );
  if (missingTraceabilityIds.length > 0 || unexpectedTraceabilityIds.length > 0) {
    throw new Error(
      `Traceability criterion mismatch: missing=${missingTraceabilityIds.join(",") || "none"}; unexpected=${unexpectedTraceabilityIds.join(",") || "none"}`
    );
  }

  const semanticInventory = new Map();
  for (const identity of fullInventory) {
    semanticInventory.set(semanticIdentityKey(identity), identity);
  }
  let dynamicTestAuthorityRows = 0;
  for (const id of expectedIds) {
    const cells = traceabilityRows.get(id);
    if (cells.length !== 9 || cells[7] !== "PASS") {
      throw new Error(
        `Traceability row ${id} must have nine fields and MechanismMatch=PASS`
      );
    }
    const actualTestFile = extractCodeSpan(cells[1]);
    const actualTestTitle = extractCodeSpan(cells[2]);
    if (actualTestFile.length === 0 || actualTestTitle.length === 0) {
      throw new Error(`Traceability row ${id} has an empty actual binding`);
    }
    if (!actualTestFile.endsWith(".test.ts")) continue;
    const candidates = [...semanticInventory.values()].filter(
      (identity) =>
        identity.file === actualTestFile &&
        traceTitleMatches(actualTestTitle, identity.title)
    );
    const semanticCandidates = new Set(candidates.map(semanticIdentityKey));
    if (semanticCandidates.size !== 1) {
      throw new Error(
        `Traceability row ${id} resolves to ${semanticCandidates.size} semantic tests in ${actualTestFile}`
      );
    }
    dynamicTestAuthorityRows += 1;
  }

  const registryIds = new Set();
  for (const line of traceabilityLines) {
    const match = /^\| `?(SUP-2B19A3A-\d{3})`? \|/u.exec(line);
    if (match === null) continue;
    if (registryIds.has(match[1])) {
      throw new Error(`Duplicate supporting authority registry row: ${match[1]}`);
    }
    registryIds.add(match[1]);
  }
  const referencedSupportingIds = new Set();
  for (const cells of traceabilityRows.values()) {
    for (const match of cells[6].matchAll(/SUP-2B19A3A-\d{3}/gu)) {
      referencedSupportingIds.add(match[0]);
    }
  }
  const missingSupportingIds = [...referencedSupportingIds].filter(
    (id) => !registryIds.has(id)
  );
  const unusedSupportingIds = [...registryIds].filter(
    (id) => !referencedSupportingIds.has(id)
  );
  if (missingSupportingIds.length > 0 || unusedSupportingIds.length > 0) {
    throw new Error(
      `Supporting authority mismatch: missing=${missingSupportingIds.join(",") || "none"}; unused=${unusedSupportingIds.join(",") || "none"}`
    );
  }

  const perProject = Object.fromEntries(
    [...LEGACY_APPLICATION_SERVICE_PROJECTS, DREAMER_VORTOX_OWNER_PROJECT].map(
      (project) => [
        project,
        markerInventory.filter((identity) => identity.project === project).length
      ]
    )
  );
  for (const project of LEGACY_APPLICATION_SERVICE_PROJECTS) {
    if (perProject[project] !== 0) {
      throw new Error(`${project} still owns ${perProject[project]} 2B19A3A tests`);
    }
  }

  return {
    semanticTests: markerSemanticOwners.size,
    projectExecutionsBefore: FROZEN_BASELINE.markerProjectExecutions,
    projectExecutionsAfter: markerInventory.length,
    removedDuplicateExecutions:
      FROZEN_BASELINE.markerProjectExecutions - markerInventory.length,
    ownerProject: DREAMER_VORTOX_OWNER_PROJECT,
    perProject,
    baselineProjectInventorySha256:
      FROZEN_BASELINE.markerProjectInventorySha256,
    currentProjectInventorySha256: sha256CanonicalLines(
      markerInventory.map((identity) => tabIdentity(identity, true))
    ),
    semanticInventorySha256: markerSemanticInventorySha256,
    authorityInventorySha256: markerAuthorityInventorySha256,
    nonMarkerOwnershipSha256,
    physicalTestFileSetSha256,
    traceabilityRows: traceabilityRows.size,
    traceabilityRowsResolved: expectedIds.length,
    dynamicTestAuthorityRows,
    supportingAuthorityIds: registryIds.size
  };
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
  assertCompletePassedReport(JSON.parse(readFileSync(absolute, "utf8")), context);
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

function main() {
  const options = parseArguments(process.argv.slice(2));
  const repoRoot = process.cwd();
  const expectedProjects = COVERAGE_GROUPS.flatMap((group) => group.projects);
  if (new Set(expectedProjects).size !== expectedProjects.length) {
    throw new Error("Coverage group definitions contain a duplicate project");
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
    for (const identity of fullInventory) {
      increment(fullCounts, identityKey(identity));
    }
    const duplicateInFullInventory = keysWithCount(fullCounts, (count) => count > 1);
    if (duplicateInFullInventory.length > 0) {
      throw new Error(
        `Full workspace inventory contains ${duplicateInFullInventory.length} duplicate canonical identities`
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

    const unionCounts = new Map();
    const groupSummaries = [];
    const groupInventories = new Map();
    for (const group of COVERAGE_GROUPS) {
      const inventory = runVitestList(
        repoRoot,
        options.workspace,
        group.projects,
        path.join(tempDirectory, `${group.id}.json`)
      );
      for (const identity of inventory) {
        if (!group.projects.includes(identity.project)) {
          throw new Error(
            `Coverage group ${group.id} returned unexpected project ${identity.project}`
          );
        }
        increment(unionCounts, identityKey(identity));
      }
      groupSummaries.push({
        id: group.id,
        projects: [...group.projects],
        tests: inventory.length
      });
      groupInventories.set(group.id, inventory);
    }

    const fullKeys = [...fullCounts.keys()];
    const missing = fullKeys.filter((key) => !unionCounts.has(key)).sort();
    const duplicate = keysWithCount(unionCounts, (count) => count > 1);
    const unexpected = [...unionCounts.keys()].filter((key) => !fullCounts.has(key)).sort();
    if (missing.length > 0 || duplicate.length > 0 || unexpected.length > 0) {
      throw new Error(
        `Coverage group inventory mismatch: missing=${missing.length}, duplicate=${duplicate.length}, unexpected=${unexpected.length}`
      );
    }

    const physicalTestFiles = new Set(fullInventory.map((identity) => identity.file));
    const projectFileExecutions = new Set(
      fullInventory.map((identity) => JSON.stringify([identity.project, identity.file]))
    );
    const ownership = auditOwnershipAndTraceability(repoRoot, fullInventory);
    let mergedReport = null;
    if (options.mergedGroupReports.length > 0) {
      if (!options.mergedReport) {
        throw new Error("--merged-report is required when group reports are supplied");
      }
      const reportByGroup = new Map();
      for (const groupReport of options.mergedGroupReports) {
        if (reportByGroup.has(groupReport.group)) {
          throw new Error(`Duplicate merged group report: ${groupReport.group}`);
        }
        reportByGroup.set(groupReport.group, groupReport.report);
      }
      const missingGroupReports = COVERAGE_GROUPS.filter(
        (group) => !reportByGroup.has(group.id)
      ).map((group) => group.id);
      const unexpectedGroupReports = [...reportByGroup.keys()].filter(
        (group) => !COVERAGE_GROUPS.some((definition) => definition.id === group)
      );
      if (missingGroupReports.length > 0 || unexpectedGroupReports.length > 0) {
        throw new Error(
          `Merged group report mismatch: missing=${missingGroupReports.join(",") || "none"}; unexpected=${unexpectedGroupReports.join(",") || "none"}`
        );
      }
      mergedReport = {
        full: validateMergedReportTotals(repoRoot, options.mergedReport, fullInventory.length),
        groups: COVERAGE_GROUPS.map((group) => ({
          id: group.id,
          ...validateMergedReport(
            repoRoot,
            reportByGroup.get(group.id),
            groupInventories.get(group.id)
          )
        }))
      };
    } else if (options.mergedReport) {
      mergedReport = validateMergedReport(repoRoot, options.mergedReport, fullInventory);
    }

    const summary = {
      physicalTestFiles: physicalTestFiles.size,
      workspaceProjectFileExecutions: projectFileExecutions.size,
      totalTests: fullInventory.length,
      groups: groupSummaries,
      missing: missing.length,
      duplicate: duplicate.length,
      unexpected: unexpected.length,
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
