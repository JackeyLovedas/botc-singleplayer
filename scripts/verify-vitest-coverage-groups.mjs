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
