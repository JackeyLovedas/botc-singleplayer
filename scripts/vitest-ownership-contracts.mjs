import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const CONTRACT_KEYS = Object.freeze([
  "applicationTestFile",
  "contractId",
  "criterionIds",
  "frozenBaseline",
  "markerPattern",
  "markerPrefix",
  "ownerProject",
  "status",
  "supportingAuthorityPrefix",
  "traceabilityFile"
]);

const BASELINE_KEYS = Object.freeze([
  "authorityInventorySha256",
  "currentProjectInventorySha256",
  "dynamicTestAuthorityRows",
  "nonMarkerOwnershipSha256",
  "nonOwnedInventoryPolicy",
  "physicalTestFileSetSha256",
  "projectExecutionsAfter",
  "projectExecutionsBefore",
  "projectInventorySha256",
  "semanticInventorySha256",
  "supportingAuthorityCount",
  "traceabilityRowCount"
]);

const ACTIVE_STATUS = "ACTIVE";
const NON_OWNED_POLICY =
  "GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS";
const SHA256_PATTERN = /^[0-9a-f]{64}$/u;
const CONTRACT_ID_PATTERN = /^2B[0-9A-Z]+$/u;
const CRITERION_ID_PATTERN = /^[A-Z][0-9]{2}$/u;
const SLICE_MARKER_PATTERN = /\[2B[0-9A-Z]+-/u;

export class OwnershipContractError extends Error {
  constructor(code, message) {
    super(`${code}: ${message}`);
    this.name = "OwnershipContractError";
    this.code = code;
  }
}

function fail(code, message) {
  throw new OwnershipContractError(code, message);
}

export function ordinalCompare(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function sha256CanonicalLines(lines) {
  return createHash("sha256")
    .update(`${[...lines].sort(ordinalCompare).join("\n")}\n`, "utf8")
    .digest("hex");
}

export const IDENTITY_ENCODING_VERSION =
  "vitest-semantic-identity-json-tuple-v1";

function assertCanonicalArray(value, code, context) {
  if (
    !Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Array.prototype
  ) {
    fail(code, `${context} must be a canonical array`);
  }
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const keys = Reflect.ownKeys(value);
  if (
    keys.some(
      (key) =>
        typeof key === "symbol" ||
        (key !== "length" && !/^(0|[1-9]\d*)$/u.test(key))
    )
  ) {
    fail(code, `${context} has an unexpected own key`);
  }
  for (let index = 0; index < value.length; index += 1) {
    const descriptor = descriptors[String(index)];
    if (
      descriptor === undefined ||
      !Object.prototype.hasOwnProperty.call(descriptor, "value")
    ) {
      fail(code, `${context} must be dense own data`);
    }
  }
}

function canonicalRepositoryFile(repoRoot, inputFile, code, context) {
  if (typeof inputFile !== "string" || inputFile.length === 0) {
    fail(code, `${context} file must be a nonempty string`);
  }
  const root = path.resolve(repoRoot);
  const absoluteFile = path.isAbsolute(inputFile)
    ? path.resolve(inputFile)
    : path.resolve(root, inputFile);
  const relative = path.relative(root, absoluteFile);
  if (
    relative.length === 0 ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    fail(code, `${context} file must be strictly inside the repository`);
  }
  const canonical = relative.split(path.sep).join("/");
  if (
    canonical.length === 0 ||
    canonical.split("/").some((segment) => segment === "" || segment === "." || segment === "..")
  ) {
    fail(code, `${context} file is not canonical`);
  }
  return canonical;
}

function validateStructuredIdentityRecord(repoRoot, value, context) {
  const code = "INVALID_STRUCTURED_VITEST_IDENTITY";
  const descriptors = assertExactPlainRecord(
    value,
    ["project", "file", "ancestorPath", "title"],
    context
  );
  const project = descriptorValue(descriptors, "project");
  const title = descriptorValue(descriptors, "title");
  if (typeof project !== "string" || project.length === 0) {
    fail(code, `${context}.project must be a nonempty string`);
  }
  if (typeof title !== "string" || title.length === 0 || title.includes("\0")) {
    fail(code, `${context}.title must be a nonempty NUL-free string`);
  }
  const ancestorPath = descriptorValue(descriptors, "ancestorPath");
  assertCanonicalArray(ancestorPath, code, `${context}.ancestorPath`);
  const canonicalAncestors = ancestorPath.map((ancestor, index) => {
    if (
      typeof ancestor !== "string" ||
      ancestor.length === 0 ||
      ancestor.includes("\0")
    ) {
      fail(code, `${context}.ancestorPath[${index}] is invalid`);
    }
    return ancestor;
  });
  return Object.freeze({
    project,
    file: canonicalRepositoryFile(
      repoRoot,
      descriptorValue(descriptors, "file"),
      code,
      context
    ),
    ancestorPath: Object.freeze(canonicalAncestors),
    title
  });
}

export function structuredIdentityTuple(identity) {
  return Object.freeze([
    identity.project,
    identity.file,
    Object.freeze([...identity.ancestorPath]),
    identity.title
  ]);
}

export function compactStructuredIdentityTuple(tuple) {
  return JSON.stringify(tuple);
}

export function canonicalizeStructuredVitestIdentities(repoRoot, input) {
  const code = "INVALID_STRUCTURED_VITEST_IDENTITY";
  assertCanonicalArray(input, code, "structured identities");
  const identities = input.map((identity, index) =>
    validateStructuredIdentityRecord(repoRoot, identity, `structured identities[${index}]`)
  );
  const keyed = identities.map((identity) => ({
    identity,
    tuple: structuredIdentityTuple(identity)
  }));
  keyed.sort((left, right) =>
    ordinalCompare(
      compactStructuredIdentityTuple(left.tuple),
      compactStructuredIdentityTuple(right.tuple)
    )
  );
  for (let index = 1; index < keyed.length; index += 1) {
    if (
      compactStructuredIdentityTuple(keyed[index - 1].tuple) ===
      compactStructuredIdentityTuple(keyed[index].tuple)
    ) {
      fail(
        "DUPLICATE_STRUCTURED_VITEST_IDENTITY",
        compactStructuredIdentityTuple(keyed[index].tuple)
      );
    }
  }
  return Object.freeze(keyed.map(({ identity }) => identity));
}

export function structuredInventoryBytes(identities) {
  const tuples = identities.map(structuredIdentityTuple);
  return Buffer.from(`${JSON.stringify(tuples)}\n`, "utf8");
}

export function structuredInventorySha256(identities) {
  return createHash("sha256").update(structuredInventoryBytes(identities)).digest("hex");
}

export function traceabilitySha256(repoRoot, traceabilityFile) {
  const raw = readFileSync(path.resolve(repoRoot, traceabilityFile), "utf8");
  if (raw.includes("\0")) {
    fail("INVALID_TRACEABILITY_BYTES", `${traceabilityFile} contains NUL`);
  }
  const normalized = raw.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n");
  const lines = normalized.split("\n");
  if (normalized.endsWith("\n")) lines.pop();
  return sha256CanonicalLines(lines);
}

export function canonicalizeRawVitestInventory(repoRoot, rawInventory) {
  const code = "INVALID_RAW_VITEST_INVENTORY";
  assertCanonicalArray(rawInventory, code, "raw inventory");
  const structured = rawInventory.map((entry, index) => {
    const descriptors = assertExactPlainRecord(
      entry,
      ["name", "file", "projectName"],
      `raw inventory[${index}]`
    );
    const name = descriptorValue(descriptors, "name");
    const project = descriptorValue(descriptors, "projectName");
    if (
      typeof name !== "string" ||
      name.length === 0 ||
      typeof project !== "string" ||
      project.length === 0 ||
      name.includes("\0") ||
      project.includes("\0")
    ) {
      fail(code, `raw inventory[${index}] has invalid string fields`);
    }
    const segments = name.split(" > ");
    if (segments.some((segment) => segment.length === 0)) {
      fail(code, `raw inventory[${index}] has an invalid name projection`);
    }
    return {
      project,
      file: descriptorValue(descriptors, "file"),
      ancestorPath: segments.slice(0, -1),
      title: segments.at(-1)
    };
  });
  return canonicalizeStructuredVitestIdentities(repoRoot, structured);
}

function assertDenseArray(value, context) {
  if (!Array.isArray(value)) {
    fail("INVALID_OWNERSHIP_CONTRACT_REGISTRY", `${context} must be an array`);
  }
  if (Object.getPrototypeOf(value) !== Array.prototype) {
    fail(
      "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
      `${context} must have the canonical array prototype`
    );
  }
  const ownKeys = Reflect.ownKeys(value);
  for (const key of ownKeys) {
    if (typeof key === "symbol") {
      fail("INVALID_OWNERSHIP_CONTRACT_REGISTRY", `${context} has a symbol key`);
    }
    if (key !== "length" && !/^(0|[1-9]\d*)$/u.test(key)) {
      fail(
        "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
        `${context} has an unexpected array key: ${key}`
      );
    }
  }
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) {
      fail("INVALID_OWNERSHIP_CONTRACT_REGISTRY", `${context} must be dense`);
    }
    if (!Object.prototype.hasOwnProperty.call(descriptors[String(index)], "value")) {
      fail(
        "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
        `${context}[${index}] must be a data property`
      );
    }
  }
}

function assertExactPlainRecord(value, expectedKeys, context) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Object.prototype
  ) {
    fail("INVALID_OWNERSHIP_CONTRACT_REGISTRY", `${context} must be a plain record`);
  }
  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.some((key) => typeof key === "symbol")) {
    fail("INVALID_OWNERSHIP_CONTRACT_REGISTRY", `${context} has a symbol key`);
  }
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const actualKeys = Object.keys(descriptors).sort(ordinalCompare);
  const sortedExpected = [...expectedKeys].sort(ordinalCompare);
  if (
    actualKeys.length !== sortedExpected.length ||
    actualKeys.some((key, index) => key !== sortedExpected[index])
  ) {
    fail(
      "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
      `${context} has an invalid key set: ${actualKeys.join(",") || "none"}`
    );
  }
  for (const key of actualKeys) {
    const descriptor = descriptors[key];
    if (!Object.prototype.hasOwnProperty.call(descriptor, "value")) {
      fail(
        "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
        `${context}.${key} must be a data property`
      );
    }
  }
  return descriptors;
}

function descriptorValue(descriptors, key) {
  return descriptors[key].value;
}

function assertNonEmptyString(value, context) {
  if (typeof value !== "string" || value.length === 0) {
    fail("INVALID_OWNERSHIP_CONTRACT_REGISTRY", `${context} must be non-empty`);
  }
  return value;
}

function assertCanonicalRepoPath(value, context) {
  assertNonEmptyString(value, context);
  if (
    value.includes("\\") ||
    value.startsWith("/") ||
    /^[A-Za-z]:/u.test(value) ||
    path.posix.normalize(value) !== value
  ) {
    fail(
      "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
      `${context} must be a canonical repository-relative path`
    );
  }
  const segments = value.split("/");
  if (segments.some((segment) => segment.length === 0 || segment === "." || segment === "..")) {
    fail(
      "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
      `${context} must be a canonical repository-relative path`
    );
  }
  return value;
}

function assertNonNegativeInteger(value, context) {
  if (!Number.isSafeInteger(value) || value < 0) {
    fail("INVALID_OWNERSHIP_CONTRACT_REGISTRY", `${context} must be non-negative`);
  }
  return value;
}

function assertSha256(value, context) {
  if (typeof value !== "string" || !SHA256_PATTERN.test(value)) {
    fail(
      "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
      `${context} must be a lowercase SHA-256`
    );
  }
  return value;
}

function expectedMarkerPattern(contractId) {
  return `^\\[${contractId}-[^\\]]+\\]`;
}

function freezeBaseline(baseline) {
  return Object.freeze({ ...baseline });
}

function freezeContract(contract) {
  return Object.freeze({
    ...contract,
    criterionIds: Object.freeze([...contract.criterionIds]),
    frozenBaseline: freezeBaseline(contract.frozenBaseline)
  });
}

function validateContractsInner(input, options) {
  assertDenseArray(input, "OWNERSHIP_CONTRACTS");
  if (input.length === 0) {
    fail("INVALID_OWNERSHIP_CONTRACT_REGISTRY", "registry must not be empty");
  }
  const repoRoot = path.resolve(options.repoRoot ?? process.cwd());
  const requireTraceabilityFiles = options.requireTraceabilityFiles !== false;
  const contracts = [];

  const registryIdentities = [];
  for (let index = 0; index < input.length; index += 1) {
    const context = `OWNERSHIP_CONTRACTS[${index}]`;
    const descriptors = assertExactPlainRecord(input[index], CONTRACT_KEYS, context);
    registryIdentities.push({
      contractId: assertNonEmptyString(
        descriptorValue(descriptors, "contractId"),
        `${context}.contractId`
      ),
      markerPrefix: assertNonEmptyString(
        descriptorValue(descriptors, "markerPrefix"),
        `${context}.markerPrefix`
      ),
      supportingAuthorityPrefix: assertNonEmptyString(
        descriptorValue(descriptors, "supportingAuthorityPrefix"),
        `${context}.supportingAuthorityPrefix`
      ),
      traceabilityFile: assertNonEmptyString(
        descriptorValue(descriptors, "traceabilityFile"),
        `${context}.traceabilityFile`
      )
    });
  }
  const contractIds = new Set();
  const markerPrefixes = new Set();
  const supportingPrefixes = new Set();
  const traceabilityFiles = new Set();
  for (const identity of registryIdentities) {
    if (contractIds.has(identity.contractId)) {
      fail("DUPLICATE_OWNERSHIP_CONTRACT_ID", identity.contractId);
    }
    if (markerPrefixes.has(identity.markerPrefix)) {
      fail("DUPLICATE_OWNERSHIP_MARKER_PREFIX", identity.markerPrefix);
    }
    if (supportingPrefixes.has(identity.supportingAuthorityPrefix)) {
      fail(
        "DUPLICATE_SUPPORTING_AUTHORITY_PREFIX",
        identity.supportingAuthorityPrefix
      );
    }
    if (traceabilityFiles.has(identity.traceabilityFile)) {
      fail(
        "DUPLICATE_OWNERSHIP_TRACEABILITY_FILE",
        identity.traceabilityFile
      );
    }
    contractIds.add(identity.contractId);
    markerPrefixes.add(identity.markerPrefix);
    supportingPrefixes.add(identity.supportingAuthorityPrefix);
    traceabilityFiles.add(identity.traceabilityFile);
  }
  for (let left = 0; left < registryIdentities.length; left += 1) {
    for (let right = left + 1; right < registryIdentities.length; right += 1) {
      const leftPrefix = registryIdentities[left].markerPrefix;
      const rightPrefix = registryIdentities[right].markerPrefix;
      if (leftPrefix.startsWith(rightPrefix) || rightPrefix.startsWith(leftPrefix)) {
        fail(
          "OVERLAPPING_OWNERSHIP_MARKER_PATTERNS",
          `${registryIdentities[left].contractId},${registryIdentities[right].contractId}`
        );
      }
    }
  }

  for (let index = 0; index < input.length; index += 1) {
    const context = `OWNERSHIP_CONTRACTS[${index}]`;
    const descriptors = assertExactPlainRecord(input[index], CONTRACT_KEYS, context);
    const contractId = assertNonEmptyString(
      descriptorValue(descriptors, "contractId"),
      `${context}.contractId`
    );
    if (!CONTRACT_ID_PATTERN.test(contractId)) {
      fail(
        "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
        `${context}.contractId is not canonical`
      );
    }
    const markerPrefix = assertNonEmptyString(
      descriptorValue(descriptors, "markerPrefix"),
      `${context}.markerPrefix`
    );
    if (markerPrefix !== `[${contractId}-`) {
      fail(
        "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
        `${context}.markerPrefix must be contract-specific`
      );
    }
    const markerPattern = assertNonEmptyString(
      descriptorValue(descriptors, "markerPattern"),
      `${context}.markerPattern`
    );
    if (markerPattern !== expectedMarkerPattern(contractId)) {
      fail(
        "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
        `${context}.markerPattern must be exact and contract-specific`
      );
    }
    try {
      void new RegExp(markerPattern, "u");
    } catch {
      fail(
        "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
        `${context}.markerPattern is invalid`
      );
    }
    const applicationTestFile = assertCanonicalRepoPath(
      descriptorValue(descriptors, "applicationTestFile"),
      `${context}.applicationTestFile`
    );
    const ownerProject = assertNonEmptyString(
      descriptorValue(descriptors, "ownerProject"),
      `${context}.ownerProject`
    );
    const traceabilityFile = assertCanonicalRepoPath(
      descriptorValue(descriptors, "traceabilityFile"),
      `${context}.traceabilityFile`
    );
    const status = descriptorValue(descriptors, "status");
    if (status !== ACTIVE_STATUS) {
      fail("INVALID_OWNERSHIP_CONTRACT_REGISTRY", `${context}.status must be ACTIVE`);
    }
    if (
      requireTraceabilityFiles &&
      !existsSync(path.resolve(repoRoot, traceabilityFile))
    ) {
      fail(
        "OWNERSHIP_TRACEABILITY_FILE_MISSING",
        `${contractId} traceability file does not exist: ${traceabilityFile}`
      );
    }
    const criterionIdsValue = descriptorValue(descriptors, "criterionIds");
    assertDenseArray(criterionIdsValue, `${context}.criterionIds`);
    if (criterionIdsValue.length === 0) {
      fail(
        "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
        `${context}.criterionIds must not be empty`
      );
    }
    const criterionIds = [];
    const seenCriterionIds = new Set();
    for (let criterionIndex = 0; criterionIndex < criterionIdsValue.length; criterionIndex += 1) {
      const criterionId = assertNonEmptyString(
        criterionIdsValue[criterionIndex],
        `${context}.criterionIds[${criterionIndex}]`
      );
      if (!CRITERION_ID_PATTERN.test(criterionId)) {
        fail(
          "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
          `${context} has invalid criterion ID ${criterionId}`
        );
      }
      if (seenCriterionIds.has(criterionId)) {
        fail(
          "DUPLICATE_OWNERSHIP_CRITERION_ID",
          `${contractId} repeats ${criterionId}`
        );
      }
      seenCriterionIds.add(criterionId);
      criterionIds.push(criterionId);
    }
    const supportingAuthorityPrefix = assertNonEmptyString(
      descriptorValue(descriptors, "supportingAuthorityPrefix"),
      `${context}.supportingAuthorityPrefix`
    );
    if (supportingAuthorityPrefix !== `SUP-${contractId}-`) {
      fail(
        "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
        `${context}.supportingAuthorityPrefix must be contract-specific`
      );
    }
    const baselineDescriptors = assertExactPlainRecord(
      descriptorValue(descriptors, "frozenBaseline"),
      BASELINE_KEYS,
      `${context}.frozenBaseline`
    );
    const frozenBaseline = {
      projectExecutionsBefore: assertNonNegativeInteger(
        descriptorValue(baselineDescriptors, "projectExecutionsBefore"),
        `${context}.frozenBaseline.projectExecutionsBefore`
      ),
      projectExecutionsAfter: assertNonNegativeInteger(
        descriptorValue(baselineDescriptors, "projectExecutionsAfter"),
        `${context}.frozenBaseline.projectExecutionsAfter`
      ),
      projectInventorySha256: assertSha256(
        descriptorValue(baselineDescriptors, "projectInventorySha256"),
        `${context}.frozenBaseline.projectInventorySha256`
      ),
      currentProjectInventorySha256: assertSha256(
        descriptorValue(baselineDescriptors, "currentProjectInventorySha256"),
        `${context}.frozenBaseline.currentProjectInventorySha256`
      ),
      semanticInventorySha256: assertSha256(
        descriptorValue(baselineDescriptors, "semanticInventorySha256"),
        `${context}.frozenBaseline.semanticInventorySha256`
      ),
      authorityInventorySha256: assertSha256(
        descriptorValue(baselineDescriptors, "authorityInventorySha256"),
        `${context}.frozenBaseline.authorityInventorySha256`
      ),
      nonOwnedInventoryPolicy: descriptorValue(
        baselineDescriptors,
        "nonOwnedInventoryPolicy"
      ),
      nonMarkerOwnershipSha256: assertSha256(
        descriptorValue(baselineDescriptors, "nonMarkerOwnershipSha256"),
        `${context}.frozenBaseline.nonMarkerOwnershipSha256`
      ),
      physicalTestFileSetSha256: assertSha256(
        descriptorValue(baselineDescriptors, "physicalTestFileSetSha256"),
        `${context}.frozenBaseline.physicalTestFileSetSha256`
      ),
      traceabilityRowCount: assertNonNegativeInteger(
        descriptorValue(baselineDescriptors, "traceabilityRowCount"),
        `${context}.frozenBaseline.traceabilityRowCount`
      ),
      dynamicTestAuthorityRows: assertNonNegativeInteger(
        descriptorValue(baselineDescriptors, "dynamicTestAuthorityRows"),
        `${context}.frozenBaseline.dynamicTestAuthorityRows`
      ),
      supportingAuthorityCount: assertNonNegativeInteger(
        descriptorValue(baselineDescriptors, "supportingAuthorityCount"),
        `${context}.frozenBaseline.supportingAuthorityCount`
      )
    };
    if (frozenBaseline.nonOwnedInventoryPolicy !== NON_OWNED_POLICY) {
      fail(
        "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
        `${context}.frozenBaseline.nonOwnedInventoryPolicy is invalid`
      );
    }
    contracts.push(
      freezeContract({
        contractId,
        markerPrefix,
        markerPattern,
        applicationTestFile,
        ownerProject,
        traceabilityFile,
        criterionIds,
        supportingAuthorityPrefix,
        frozenBaseline,
        status
      })
    );
  }

  const sorted = [...contracts].sort((left, right) =>
    ordinalCompare(left.contractId, right.contractId)
  );
  return Object.freeze(sorted);
}

export function validateOwnershipContracts(input, options = {}) {
  try {
    return validateContractsInner(input, options);
  } catch (error) {
    if (error instanceof OwnershipContractError) {
      throw error;
    }
    fail(
      "INVALID_OWNERSHIP_CONTRACT_REGISTRY",
      error instanceof Error ? error.message : String(error)
    );
  }
}

export function classifyOwnershipTitle(title, contracts) {
  if (typeof title !== "string" || title.length === 0) {
    fail("INVALID_OWNERSHIP_TEST_TITLE", "title must be non-empty");
  }
  const candidates = contracts.filter((contract) =>
    title.includes(contract.markerPrefix)
  );
  if (candidates.length > 1) {
    fail("AMBIGUOUS_SLICE_OWNERSHIP_MARKER", title);
  }
  if (candidates.length === 0) {
    if (SLICE_MARKER_PATTERN.test(title)) {
      return Object.freeze({
        contract: null,
        authorityMarker: null,
        unregisteredSliceMarker: true
      });
    }
    return null;
  }
  const contract = candidates[0];
  const match = new RegExp(contract.markerPattern, "u").exec(title);
  if (match === null || match.index !== 0) {
    fail("TITLE_HAS_NO_EXACT_AUTHORITY_MARKER", title);
  }
  return Object.freeze({
    contract,
    authorityMarker: match[0].slice(1, -1)
  });
}

function encodeFields(fields) {
  return fields.map((field) => `${field.length}:${field}`).join("|");
}

function semanticIdentityKey(identity) {
  return encodeFields([
    identity.file,
    encodeFields(identity.ancestorPath),
    identity.title
  ]);
}

function tabIdentity(identity, includeProject) {
  const fields = includeProject
    ? [identity.project, identity.file, identity.ancestorPath.join(" > "), identity.title]
    : [identity.file, identity.ancestorPath.join(" > "), identity.title];
  return fields.join("\t");
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

const APP_TEST_FILE =
  "packages/application/src/game-application-service.test.ts";
const SLICE_2B20A_ANCESTOR = Object.freeze([
  "Phase 3 Slice 2B19A3B1 canonical-drunk Vortox Dreamer"
]);
const GAS_ANCESTOR = Object.freeze(["GameApplicationService"]);
const DOMAIN_2B20A_ANCESTOR = Object.freeze([
  "Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer"
]);

const PRIMARY_2B20A_ROWS = [
  ["C01", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C01] proves the exact reachable source impairment and Fang Gu precondition snapshot"],
  ["C03", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C03] reaches a naturally selected TRUE V7 stream through the real command boundary"],
  ["C04", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C04] reaches a naturally selected FALSE V7 stream through the real command boundary"],
  ["C05", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C05] settles the base Dreamer task and closes its V3 opportunity atomically"],
  ["C06", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C06] derives TRUE as a normal base-Dreamer fact with zero contribution"],
  ["C07", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C07] derives FALSE as one abnormal base-Dreamer drunkenness contribution"],
  ["C10", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C10] records the exact nine existing evidence variants for V7"],
  ["C11", "application-service-information-and-later-actions", APP_TEST_FILE, GAS_ANCESTOR, "rejects invalid Dreamer submissions with deterministic receipts"],
  ["C12", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C12] rejects an unrepresented Traveller target id at the real command boundary"],
  ["C13", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C13] rejects a forged V3 opportunity id without appending a batch"],
  ["C14", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C14] preserves success receipt replay and fingerprint conflict semantics"],
  ["C15", "application-service-information-and-later-actions", APP_TEST_FILE, GAS_ANCESTOR, "keeps SubmitDreamerAction metadata generation failures classified independently"],
  ["C16", "domain-core", "packages/domain-core/src/dreamer.test.ts", DOMAIN_2B20A_ANCESTOR, "[2B20A-C16] constructs the complete raw-UTF16 ordered GOOD by EVIL candidate product"],
  ["C17", "domain-core", "packages/domain-core/src/dreamer.test.ts", DOMAIN_2B20A_ANCESTOR, "[2B20A-C17] selects the first candidate in the parity-selected truth class"],
  ["C18", "domain-core", "packages/domain-core/src/dreamer.test.ts", DOMAIN_2B20A_ANCESTOR, "[2B20A-C18] validates the exact 22-key V7 payload and selected top-level roles"],
  ["C19", "domain-core", "packages/domain-core/src/dreamer.test.ts", DOMAIN_2B20A_ANCESTOR, "[2B20A-C19] deep-clones and compares every V7 nested canonical decision"],
  ["C20", "domain-core", "packages/domain-core/src/dreamer.test.ts", DOMAIN_2B20A_ANCESTOR, "[2B20A-C20] rejects getter Proxy symbol cycle sparse and nonplain V7 inputs with zero getter calls"],
  ["C21", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C21] rebuilds the complete accepted V7 stream identically"],
  ["C22", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C22] rejects reordered or missing V7 batch members during replay"],
  ["C23", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C23] rejects persisted V7 candidate and policy mutations during replay"],
  ["C24", "domain-core-rebuild", "packages/domain-core/src/rebuild.test.ts", Object.freeze(["domain event rebuild"]), "rejects malformed Dreamer replay batches"],
  ["C25", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C25] projects the accepted V7 pair only to its source player"],
  ["C26", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C26] omits accepted V7 information from every other player"],
  ["C27", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C27] leaks no V7 impairment candidate policy Demon or ledger metadata"],
  ["C28", "projections", "packages/projections/src/private-knowledge-view.test.ts", Object.freeze([]), "[2B20A-C28] rejects state-only V7 for both player and AI projection authority"],
  ["C29", "projections", "packages/projections/src/private-knowledge-view.test.ts", Object.freeze([]), "[2B20A-C29] rejects hostile state-only V7 accessors and proxies without invoking getters"],
  ["C30", "domain-core-rebuild", "packages/domain-core/src/rebuild.test.ts", Object.freeze(["domain event rebuild"]), "[2B20A-C30] rebuilds accepted legacy Dreamer information for an EVIL target without reinterpretation"],
  ["C31", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C31] preserves Philosopher Dreamer Mathematician first-night order without phase transition"],
  ["C32", "STATIC_REPOSITORY", ".github/workflows/ci.yml", Object.freeze([]), "coverage / application-service-dreamer-vortox-core testNamePattern=\\[(?:2B19A3A|2B19A3B1|2B20A)-"],
  ["C33", "domain-core", "packages/domain-core/src/dreamer.test.ts", Object.freeze(["Dreamer information model"]), "does not use locale-based sorting in the Dreamer domain model"],
  ["C34", "domain-core", "packages/domain-core/src/dreamer.test.ts", DOMAIN_2B20A_ANCESTOR, "[2B20A-C34] resolves only the exact canonical-drunk Fang Gu capability"],
  ["C35", "application-service-dreamer-vortox", APP_TEST_FILE, GAS_ANCESTOR, "[2B20A-C35] accepts the reachable canonical-drunk base Dreamer through the real Philosopher chain"],
  ["C36", "application-service-information-and-later-actions", APP_TEST_FILE, GAS_ANCESTOR, "rejects SubmitDreamerAction accessors before receipt or event work"],
  ["C37", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C37] attributes the FALSE contribution to Dreamer and never to Philosopher"],
  ["C38", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C38] rejects direct malformed V7 ledger source cross-links fail closed"],
  ["C39", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C39] rejects coordinated persisted V7 source and impairment substitution"],
  ["C40", "application-service-dreamer-vortox", APP_TEST_FILE, SLICE_2B20A_ANCESTOR, "[2B20A-C40] leaves no delivery fact or contribution when the real No Dashii command fails"]
];

export const TWO_B20A_PRIMARY_IDENTITIES = Object.freeze(
  PRIMARY_2B20A_ROWS.map(
    ([criterionId, project, file, ancestorPath, title]) =>
      Object.freeze({
        criterionId,
        project,
        file,
        ancestorPath,
        title,
        kind:
          criterionId === "C32"
            ? "STATIC"
            : title.startsWith("[2B20A-")
              ? "DYNAMIC_MARKED"
              : "DYNAMIC_UNMARKED"
      })
  )
);

export const EXPLICIT_UNMARKED_2B20A_PRIMARIES = Object.freeze(
  TWO_B20A_PRIMARY_IDENTITIES.filter(
    (identity) => identity.kind === "DYNAMIC_UNMARKED"
  ).map(({ criterionId, file, ancestorPath, title }) =>
    Object.freeze({ criterionId, file, ancestorPath, title })
  )
);

const TWO_B20A_SUPPORT_TUPLES = Object.freeze({
  R: Object.freeze([
    "rule-researcher",
    "docs/rules/evidence/2B20A-resolved.md",
    "ACCEPTED",
    "NONE"
  ]),
  V: Object.freeze([
    "test-harness",
    "loadAcceptedBaseDreamerVortoxV3StreamFixture",
    "ACCEPTED",
    "NONE"
  ]),
  VC: Object.freeze([
    "test-harness",
    "loadAcceptedBaseDreamerVortoxV3StreamFixture",
    "ACCEPTED",
    "CLONE_MUTATED"
  ]),
  VP: Object.freeze([
    "test-harness",
    "loadAcceptedBaseDreamerVortoxV3StreamFixture",
    "ACCEPTED",
    "PERSISTED_OR_IMPORTED_MUTATED"
  ]),
  A2: Object.freeze([
    "accepted-history",
    "packages/application/src/game-application-service.test.ts@[2B19A2-C20]",
    "LEGACY",
    "NONE"
  ]),
  A3B1: Object.freeze([
    "accepted-history",
    "packages/application/src/game-application-service.test.ts@[2B19A3B1-C08/C30/C36-S14/S16/S17]",
    "LEGACY",
    "PERSISTED_OR_IMPORTED_MUTATED"
  ]),
  L: Object.freeze([
    "domain-core",
    "acceptedLegacyDreamerV1()",
    "LEGACY",
    "NONE"
  ]),
  B: Object.freeze([
    "accepted-history",
    "packages/domain-core/src/dreamer.test.ts@[2B19B-S20]",
    "LEGACY",
    "NONE"
  ]),
  W: Object.freeze([
    "repository",
    ".github/workflows/ci.yml",
    "ACCEPTED",
    "NONE"
  ]),
  S: Object.freeze([
    "accepted-history",
    "SUPR-2B20AP1-001+SUPR-2B20AP1-002+SUPR-2B20AP1-004",
    "LEGACY",
    "NONE"
  ])
});

const TWO_B20A_SUPPORT_ASSIGNMENTS = Object.freeze([
  ["C01", "R"], ["C03", "V"], ["C04", "V"], ["C05", "V"],
  ["C06", "V"], ["C07", "V"], ["C10", "V"], ["C11", "R"],
  ["C12", "R"], ["C13", "V"], ["C14", "V"], ["C15", "A2"],
  ["C16", "R"], ["C17", "R"], ["C18", "VC"], ["C19", "VC"],
  ["C20", "VC"], ["C21", "V"], ["C22", "VP"], ["C23", "VP"],
  ["C24", "A3B1"], ["C25", "V"], ["C26", "V"], ["C27", "V"],
  ["C28", "VC"], ["C29", "VC"], ["C30", "L"], ["C31", "V"],
  ["C32", "W"], ["C33", "B"], ["C34", "R"], ["C35", "S"],
  ["C36", "A2"], ["C37", "V"], ["C38", "VC"], ["C39", "VP"],
  ["C40", "V"]
]);

const EXPECTED_2B20A_SUPPORT_ROWS = new Map(
  TWO_B20A_SUPPORT_ASSIGNMENTS.map(([criterionId, tupleId], index) => {
    const [producer, source, status, disposition] =
      TWO_B20A_SUPPORT_TUPLES[tupleId];
    const supportId = `SUP-2B20A-${String(index + 1).padStart(3, "0")}`;
    return [
      supportId,
      [supportId, producer, source, status, criterionId, disposition]
    ];
  })
);

export function validate2B20APrimaryIdentities(repoRoot, inventory) {
  const canonicalInventory = canonicalizeStructuredVitestIdentities(
    repoRoot,
    inventory
  );
  const fullKeys = new Map();
  for (const identity of canonicalInventory) {
    const key = compactStructuredIdentityTuple(structuredIdentityTuple(identity));
    fullKeys.set(key, (fullKeys.get(key) ?? 0) + 1);
  }
  for (const primary of TWO_B20A_PRIMARY_IDENTITIES) {
    if (primary.kind === "STATIC") {
      const workflow = readFileSync(path.resolve(repoRoot, primary.file), "utf8");
      const runner = readFileSync(
        path.resolve(repoRoot, "scripts/run-vitest-logical-group.mjs"),
        "utf8"
      );
      const relationalCoverageWiring = [
        workflow.includes("application-service-dreamer-vortox-core"),
        runner.includes('"application-service-dreamer-vortox-core": ['),
        runner.includes(
          '["legacy", ["application-service-dreamer-vortox"], "\\\\[(?:2B19A3A|2B19A3B1)-"]'
        ),
        runner.includes(
          '["2b20a", ["application-service-dreamer-vortox"], "\\\\[2B20A-"]'
        )
      ];
      if (relationalCoverageWiring.some((present) => !present)) {
        fail("TWO_B20A_STATIC_WIRING_MISSING", primary.title);
      }
      continue;
    }
    const key = JSON.stringify([
      primary.project,
      primary.file,
      [...primary.ancestorPath],
      primary.title
    ]);
    if (fullKeys.get(key) !== 1) {
      fail(
        "TWO_B20A_PRIMARY_IDENTITY_MISMATCH",
        `${primary.criterionId}: expected exactly one, got ${fullKeys.get(key) ?? 0}`
      );
    }
  }
  const expectedMarked = new Set(
    TWO_B20A_PRIMARY_IDENTITIES.filter(
      (primary) => primary.kind === "DYNAMIC_MARKED"
    ).map((primary) =>
      JSON.stringify([
        primary.project,
        primary.file,
        [...primary.ancestorPath],
        primary.title
      ])
    )
  );
  const actualMarked = canonicalInventory.filter((identity) =>
    identity.title.startsWith("[2B20A-")
  );
  if (
    actualMarked.length !== expectedMarked.size ||
    actualMarked.some(
      (identity) =>
        !expectedMarked.has(
          compactStructuredIdentityTuple(structuredIdentityTuple(identity))
        )
    )
  ) {
    fail(
      "TWO_B20A_MARKED_PRIMARY_SET_MISMATCH",
      `expected=${expectedMarked.size}, actual=${actualMarked.length}`
    );
  }
  return canonicalInventory;
}

const VIRTUAL_ACCEPTED_PREDECESSORS = Object.freeze([
  Object.freeze({
    contractId: "2B19A3A",
    project: "application-service-dreamer-vortox",
    file: APP_TEST_FILE,
    ancestorPath: GAS_ANCESTOR,
    title:
      "[2B19A3A-C17] fails a represented DRUNK base Dreamer receipt-free through the real Philosopher chain",
    authorityMarker: "2B19A3A-C17"
  }),
  Object.freeze({
    contractId: "2B19A3B1",
    project: "application-service-dreamer-vortox",
    file: APP_TEST_FILE,
    ancestorPath: SLICE_2B20A_ANCESTOR,
    title:
      "[2B19A3B1-C18/C28] keeps canonical DRUNK without effective Vortox receipt-free, OPEN, and retryable",
    authorityMarker: "2B19A3B1-C18/C28"
  })
]);

const ACCEPTED_HEAD = "5a69c90f2d3947556ff45c15c467902b1e28ca43";
const ACCEPTED_APPLICATION_BLOB =
  "0ff733004899f17ff82b20b40b0f41b888ba85d0";
const SUCCESSOR_C35 = Object.freeze({
  contractId: "2B20A",
  criterionId: "C35",
  ownerProject: "application-service-dreamer-vortox",
  file: APP_TEST_FILE,
  ancestorPath: GAS_ANCESTOR,
  title:
    "[2B20A-C35] accepts the reachable canonical-drunk base Dreamer through the real Philosopher chain"
});

export const ACCEPTED_AUTHORITY_SUPERSESSIONS = Object.freeze([
  Object.freeze({
    supersessionId: "SUPR-2B20AP1-001",
    predecessor: Object.freeze({
      acceptedHead: ACCEPTED_HEAD,
      acceptedBlobOid: ACCEPTED_APPLICATION_BLOB,
      contractId: "2B19A3A",
      criterionId: "C17",
      ownerProject: "application-service-dreamer-vortox",
      file: APP_TEST_FILE,
      ancestorPath: GAS_ANCESTOR,
      title:
        "[2B19A3A-C17] fails a represented DRUNK base Dreamer receipt-free through the real Philosopher chain",
      historicalLocator: Object.freeze({
        kind: "EXACT_TEST_TITLE",
        titleOccurrence: 1
      })
    }),
    scope: "WHOLE_TEST",
    subcaseKey: null,
    disposition: "WHOLE_TEST_SEMANTIC_SUPERSESSION",
    successor: SUCCESSOR_C35,
    rationale:
      "The reachable canonical-drunk Philosopher chain now has one canonical 2B20A primary."
  }),
  Object.freeze({
    supersessionId: "SUPR-2B20AP1-002",
    predecessor: Object.freeze({
      acceptedHead: ACCEPTED_HEAD,
      acceptedBlobOid: ACCEPTED_APPLICATION_BLOB,
      contractId: "2B19A3B1",
      criterionId: "C18",
      ownerProject: "application-service-dreamer-vortox",
      file: APP_TEST_FILE,
      ancestorPath: SLICE_2B20A_ANCESTOR,
      title:
        "[2B19A3B1-C18/C28] keeps canonical DRUNK without effective Vortox receipt-free, OPEN, and retryable",
      historicalLocator: Object.freeze({
        kind: "EXACT_TEST_TITLE",
        titleOccurrence: 1
      })
    }),
    scope: "WHOLE_TEST",
    subcaseKey: null,
    disposition: "WHOLE_TEST_SEMANTIC_SUPERSESSION",
    successor: SUCCESSOR_C35,
    rationale:
      "The accepted predecessor is preserved virtually while current authority resolves to C35."
  }),
  Object.freeze({
    supersessionId: "SUPR-2B20AP1-003",
    predecessor: Object.freeze({
      acceptedHead: ACCEPTED_HEAD,
      acceptedBlobOid: ACCEPTED_APPLICATION_BLOB,
      contractId: "2B19A3B1",
      criterionId: "C28",
      ownerProject: "application-service-dreamer-vortox",
      file: APP_TEST_FILE,
      ancestorPath: SLICE_2B20A_ANCESTOR,
      title:
        "[2B19A3B1-C18/C28] keeps canonical DRUNK without effective Vortox receipt-free, OPEN, and retryable",
      historicalLocator: Object.freeze({
        kind: "EXACT_TEST_TITLE",
        titleOccurrence: 1
      })
    }),
    scope: "MARKER_ALIAS",
    subcaseKey: "C28",
    disposition: "RETIRED_NONPRIMARY_ALIAS",
    successor: Object.freeze({
      contractId: "2B19A3B1",
      criterionId: "C28",
      ownerProject: "application-service-dreamer-vortox",
      file: APP_TEST_FILE,
      ancestorPath: SLICE_2B20A_ANCESTOR,
      title:
        "[2B19A3B1-C28/C29] proves every V4 failure stage is atomic retryable and converges exactly once"
    }),
    rationale:
      "The obsolete compound C28 token resolves only to the preserved C28/C29 primary."
  }),
  Object.freeze({
    supersessionId: "SUPR-2B20AP1-004",
    predecessor: Object.freeze({
      acceptedHead: ACCEPTED_HEAD,
      acceptedBlobOid: ACCEPTED_APPLICATION_BLOB,
      contractId: "2B19A2",
      criterionId: "C20",
      ownerProject: "application-service-information-and-later-actions",
      file: APP_TEST_FILE,
      ancestorPath: GAS_ANCESTOR,
      title:
        "[2B19A2-C20] keeps every retryable unsupported or dependency path receipt-free and mutation-free",
      historicalLocator: Object.freeze({
        kind: "LF_BOUNDED_SOURCE_SHA256",
        wholeStart:
          "  it(\"[2B19A2-C20] keeps every retryable unsupported or dependency path receipt-free and mutation-free\", async () => {",
        wholeEndExclusive:
          "  it(\"[2B19A2-C21] retries the same command after a transient metadata dependency recovers\", async () => {",
        wholeChars: 5835,
        wholeSha256:
          "e06c3a7f9d4cb2ac2a2eed24f2082ff6cf5819b0af7388c11e47e478b0e34531",
        subcaseStart: "const drunk = makeService();",
        subcaseEndExclusive:
          "const dependencyStore = new OneShotDomainEventLoadFailureStore();",
        subcaseChars: 1746,
        subcaseSha256:
          "b5ccb8e06ca99b5e21bca2ce60806fcd6f2f9d7f509dece50d217dd3f7e6ae85"
      })
    }),
    scope: "SUBCASE",
    subcaseKey: "A2_C20_DRUNK_NO_CURRENT_VORTOX",
    disposition: "SUBCASE_SUPERSESSION",
    successor: SUCCESSOR_C35,
    rationale:
      "Only the canonical-drunk no-current-Vortox subcase is superseded; adjacent failures remain support."
  })
]);

export function validateAcceptedAuthoritySupersessionRegistry(input) {
  const code = "INVALID_ACCEPTED_AUTHORITY_SUPERSESSION_REGISTRY";
  assertCanonicalArray(input, code, "supersession registry");
  if (input.length !== 4) {
    fail(code, `expected four records, got ${input.length}`);
  }
  const knownContracts = new Set([
    "2B19A2",
    "2B19A3A",
    "2B19A3B1",
    "2B19A3B2",
    "2B19B",
    "2B20A"
  ]);
  const seenIds = new Set();
  const successorByPredecessor = new Map();
  const graph = new Map();
  const scopesByCriterion = new Map();
  for (let index = 0; index < input.length; index += 1) {
    const context = `supersession registry[${index}]`;
    const record = assertExactPlainRecord(
      input[index],
      [
        "supersessionId",
        "predecessor",
        "scope",
        "subcaseKey",
        "disposition",
        "successor",
        "rationale"
      ],
      context
    );
    const supersessionId = descriptorValue(record, "supersessionId");
    if (
      typeof supersessionId !== "string" ||
      !/^SUPR-2B20AP1-\d{3}$/u.test(supersessionId) ||
      seenIds.has(supersessionId)
    ) {
      fail(code, `${context}.supersessionId is invalid or duplicated`);
    }
    seenIds.add(supersessionId);
    const predecessor = assertExactPlainRecord(
      descriptorValue(record, "predecessor"),
      [
        "acceptedHead",
        "acceptedBlobOid",
        "contractId",
        "criterionId",
        "ownerProject",
        "file",
        "ancestorPath",
        "title",
        "historicalLocator"
      ],
      `${context}.predecessor`
    );
    const successor = assertExactPlainRecord(
      descriptorValue(record, "successor"),
      [
        "contractId",
        "criterionId",
        "ownerProject",
        "file",
        "ancestorPath",
        "title"
      ],
      `${context}.successor`
    );
    for (const [descriptors, side] of [
      [predecessor, "predecessor"],
      [successor, "successor"]
    ]) {
      const contractId = descriptorValue(descriptors, "contractId");
      if (!knownContracts.has(contractId)) {
        fail(code, `${context}.${side}.contractId is unknown`);
      }
      assertNonEmptyString(
        descriptorValue(descriptors, "criterionId"),
        `${context}.${side}.criterionId`
      );
      assertNonEmptyString(
        descriptorValue(descriptors, "ownerProject"),
        `${context}.${side}.ownerProject`
      );
      assertCanonicalRepoPath(
        descriptorValue(descriptors, "file"),
        `${context}.${side}.file`
      );
      assertNonEmptyString(
        descriptorValue(descriptors, "title"),
        `${context}.${side}.title`
      );
      const ancestors = descriptorValue(descriptors, "ancestorPath");
      assertCanonicalArray(ancestors, code, `${context}.${side}.ancestorPath`);
      for (const ancestor of ancestors) {
        assertNonEmptyString(ancestor, `${context}.${side}.ancestorPath`);
      }
    }
    for (const gitKey of ["acceptedHead", "acceptedBlobOid"]) {
      const value = descriptorValue(predecessor, gitKey);
      if (typeof value !== "string" || !/^[0-9a-f]{40}$/u.test(value)) {
        fail(code, `${context}.predecessor.${gitKey} is invalid`);
      }
    }
    const locator = descriptorValue(predecessor, "historicalLocator");
    if (
      locator === null ||
      typeof locator !== "object" ||
      Array.isArray(locator) ||
      Object.getPrototypeOf(locator) !== Object.prototype
    ) {
      fail(code, `${context} historical locator is invalid`);
    }
    const locatorKindDescriptor =
      Object.getOwnPropertyDescriptor(locator, "kind");
    if (
      locatorKindDescriptor === undefined ||
      !Object.prototype.hasOwnProperty.call(locatorKindDescriptor, "value")
    ) {
      fail(code, `${context} historical locator kind must be own data`);
    }
    const locatorKind = locatorKindDescriptor.value;
    if (locatorKind === "EXACT_TEST_TITLE") {
      const locatorDescriptors = assertExactPlainRecord(
        locator,
        ["kind", "titleOccurrence"],
        `${context}.predecessor.historicalLocator`
      );
      if (descriptorValue(locatorDescriptors, "titleOccurrence") !== 1) {
        fail(code, `${context} title occurrence must be one`);
      }
    } else if (locatorKind === "LF_BOUNDED_SOURCE_SHA256") {
      const locatorDescriptors = assertExactPlainRecord(
        locator,
        [
          "kind",
          "wholeStart",
          "wholeEndExclusive",
          "wholeChars",
          "wholeSha256",
          "subcaseStart",
          "subcaseEndExclusive",
          "subcaseChars",
          "subcaseSha256"
        ],
        `${context}.predecessor.historicalLocator`
      );
      for (const key of [
        "wholeStart",
        "wholeEndExclusive",
        "subcaseStart",
        "subcaseEndExclusive"
      ]) {
        assertNonEmptyString(
          descriptorValue(locatorDescriptors, key),
          `${context}.historicalLocator.${key}`
        );
      }
      for (const key of ["wholeChars", "subcaseChars"]) {
        assertNonNegativeInteger(
          descriptorValue(locatorDescriptors, key),
          `${context}.historicalLocator.${key}`
        );
      }
      for (const key of ["wholeSha256", "subcaseSha256"]) {
        assertSha256(
          descriptorValue(locatorDescriptors, key),
          `${context}.historicalLocator.${key}`
        );
      }
    } else {
      fail(code, `${context} historical locator is invalid`);
    }
    const scope = descriptorValue(record, "scope");
    const disposition = descriptorValue(record, "disposition");
    const subcaseKey = descriptorValue(record, "subcaseKey");
    const exactScopeDisposition = {
      WHOLE_TEST: "WHOLE_TEST_SEMANTIC_SUPERSESSION",
      SUBCASE: "SUBCASE_SUPERSESSION",
      MARKER_ALIAS: "RETIRED_NONPRIMARY_ALIAS"
    };
    if (
      exactScopeDisposition[scope] !== disposition ||
      (scope === "WHOLE_TEST"
        ? subcaseKey !== null
        : typeof subcaseKey !== "string" || subcaseKey.length === 0)
    ) {
      fail(code, `${context} scope/disposition/subcaseKey mismatch`);
    }
    assertNonEmptyString(
      descriptorValue(record, "rationale"),
      `${context}.rationale`
    );
    const node = (descriptors) =>
      encodeFields([
        descriptorValue(descriptors, "contractId"),
        descriptorValue(descriptors, "criterionId"),
        descriptorValue(descriptors, "file"),
        encodeFields(descriptorValue(descriptors, "ancestorPath")),
        descriptorValue(descriptors, "title")
      ]);
    const predecessorNode = node(predecessor);
    const successorNode = node(successor);
    if (
      predecessorNode === successorNode ||
      (successorByPredecessor.has(predecessorNode) &&
        successorByPredecessor.get(predecessorNode) !== successorNode)
    ) {
      fail(code, `${context} has a self edge or multiple successor`);
    }
    successorByPredecessor.set(predecessorNode, successorNode);
    graph.set(predecessorNode, successorNode);
    const criterionKey = [
      descriptorValue(predecessor, "contractId"),
      descriptorValue(predecessor, "criterionId")
    ].join("/");
    const existingScopes = scopesByCriterion.get(criterionKey) ?? new Set();
    if (
      (scope === "WHOLE_TEST" && existingScopes.has("SUBCASE")) ||
      (scope === "SUBCASE" && existingScopes.has("WHOLE_TEST"))
    ) {
      fail(code, `${context} overlaps whole and subcase scopes`);
    }
    existingScopes.add(scope);
    scopesByCriterion.set(criterionKey, existingScopes);
  }
  for (const start of graph.keys()) {
    const visited = new Set();
    let node = start;
    while (graph.has(node)) {
      if (visited.has(node)) fail(code, "supersession graph contains a cycle");
      visited.add(node);
      node = graph.get(node);
    }
  }
  return input;
}

export function validateAcceptedGitAuthority(
  repoRoot,
  acceptedHead,
  acceptedFile,
  acceptedBlobOid
) {
  const root = path.resolve(repoRoot);
  const repository = spawnSync(
    "git",
    ["rev-parse", "--is-inside-work-tree"],
    { cwd: root, encoding: "utf8", windowsHide: true, shell: false }
  );
  if (repository.error || repository.status !== 0 ||
      repository.stdout.trim() !== "true") {
    fail("GIT_COMMAND_FAILED", "repository validation");
  }
  const object = spawnSync(
    "git",
    ["cat-file", "-e", `${acceptedHead}^{commit}`],
    { cwd: root, encoding: "utf8", windowsHide: true, shell: false }
  );
  if (object.error) fail("GIT_COMMAND_FAILED", "accepted object validation");
  if (object.status !== 0) {
    fail("SUPERSESSION_ACCEPTED_HISTORY_UNAVAILABLE", acceptedHead);
  }
  const ancestor = spawnSync(
    "git",
    ["merge-base", "--is-ancestor", acceptedHead, "HEAD"],
    { cwd: root, encoding: "utf8", windowsHide: true, shell: false }
  );
  if (ancestor.error || (ancestor.status !== 0 && ancestor.status !== 1)) {
    fail("GIT_COMMAND_FAILED", "accepted ancestry validation");
  }
  if (ancestor.status === 1) {
    fail("SUPERSESSION_ACCEPTED_HEAD_NOT_ANCESTOR", acceptedHead);
  }
  const blob = spawnSync(
    "git",
    ["rev-parse", `${acceptedHead}:${acceptedFile}`],
    { cwd: root, encoding: "utf8", windowsHide: true, shell: false }
  );
  if (blob.error) fail("GIT_COMMAND_FAILED", "accepted blob validation");
  if (blob.status !== 0 || blob.stdout.trim() !== acceptedBlobOid) {
    fail(
      "SUPERSESSION_ACCEPTED_BLOB_MISMATCH",
      blob.stdout.trim() || "missing"
    );
  }
  return Object.freeze({
    acceptedHead,
    acceptedFile,
    acceptedBlobOid
  });
}

export function validateAcceptedAuthoritySupersessions(repoRoot, liveInventory = null) {
  const root = path.resolve(repoRoot);
  validateAcceptedAuthoritySupersessionRegistry(
    ACCEPTED_AUTHORITY_SUPERSESSIONS
  );
  validateAcceptedGitAuthority(
    root,
    ACCEPTED_HEAD,
    APP_TEST_FILE,
    ACCEPTED_APPLICATION_BLOB
  );
  const sourceResult = spawnSync(
    "git",
    ["show", `${ACCEPTED_HEAD}:${APP_TEST_FILE}`],
    { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }
  );
  if (sourceResult.status !== 0) {
    fail("SUPERSESSION_ACCEPTED_SOURCE_UNAVAILABLE", APP_TEST_FILE);
  }
  const source = sourceResult.stdout.replace(/\r\n/gu, "\n").replace(/\r/gu, "\n");
  for (const record of ACCEPTED_AUTHORITY_SUPERSESSIONS) {
    const locator = record.predecessor.historicalLocator;
    const occurrences = source.split(record.predecessor.title).length - 1;
    if (occurrences !== 1) {
      fail(
        "SUPERSESSION_PREDECESSOR_TITLE_MISMATCH",
        `${record.supersessionId}:${occurrences}`
      );
    }
    if (locator.kind === "LF_BOUNDED_SOURCE_SHA256") {
      const wholeStart = source.indexOf(locator.wholeStart);
      const wholeEnd = source.indexOf(locator.wholeEndExclusive);
      if (
        wholeStart < 0 ||
        wholeEnd <= wholeStart ||
        source.indexOf(locator.wholeStart, wholeStart + 1) >= 0 ||
        source.indexOf(locator.wholeEndExclusive, wholeEnd + 1) >= 0
      ) {
        fail("SUPERSESSION_SOURCE_BOUND_MISMATCH", record.supersessionId);
      }
      const whole = source.slice(wholeStart, wholeEnd);
      const subcaseStartToken = whole.indexOf(locator.subcaseStart);
      const subcaseEndToken = whole.indexOf(locator.subcaseEndExclusive);
      const subcaseStart = subcaseStartToken - 4;
      const subcaseEnd = subcaseEndToken - 4;
      const subcase = whole.slice(subcaseStart, subcaseEnd);
      if (
        whole.length !== locator.wholeChars ||
        createHash("sha256").update(whole, "utf8").digest("hex") !==
          locator.wholeSha256 ||
        subcaseStartToken < 0 ||
        subcaseEndToken < 0 ||
        whole.slice(subcaseStart, subcaseStartToken) !== "    " ||
        whole.slice(subcaseEnd, subcaseEndToken) !== "    " ||
        subcaseStart < 0 ||
        subcaseEnd <= subcaseStart ||
        subcase.length !== locator.subcaseChars ||
        createHash("sha256").update(subcase, "utf8").digest("hex") !==
          locator.subcaseSha256
      ) {
        fail("SUPERSESSION_SOURCE_HASH_MISMATCH", record.supersessionId);
      }
    }
  }
  const currentSource = readFileSync(path.resolve(root, APP_TEST_FILE), "utf8")
    .replace(/\r\n/gu, "\n")
    .replace(/\r/gu, "\n");
  for (const title of [
    SUCCESSOR_C35.title,
    "[2B19A3B1-C28/C29] proves every V4 failure stage is atomic retryable and converges exactly once"
  ]) {
    if (currentSource.split(title).length - 1 !== 1) {
      fail("SUPERSESSION_CURRENT_PRIMARY_MISMATCH", title);
    }
  }
  if (liveInventory !== null) {
    const required = [
      {
        project: SUCCESSOR_C35.ownerProject,
        file: SUCCESSOR_C35.file,
        ancestorPath: SUCCESSOR_C35.ancestorPath,
        title: SUCCESSOR_C35.title
      },
      {
        project: "application-service-dreamer-vortox",
        file: APP_TEST_FILE,
        ancestorPath: SLICE_2B20A_ANCESTOR,
        title:
          "[2B19A3B1-C28/C29] proves every V4 failure stage is atomic retryable and converges exactly once"
      }
    ];
    for (const identity of required) {
      const matches = liveInventory.filter(
        (candidate) =>
          candidate.project === identity.project &&
          candidate.file === identity.file &&
          JSON.stringify(candidate.ancestorPath) ===
            JSON.stringify(identity.ancestorPath) &&
          candidate.title === identity.title
      );
      if (matches.length !== 1) {
        fail(
          "SUPERSESSION_CURRENT_PRIMARY_MISMATCH",
          `${identity.title}:${matches.length}`
        );
      }
    }
  }
  return ACCEPTED_AUTHORITY_SUPERSESSIONS;
}

function parseSupportingAuthorityReference(value, contract) {
  if (value === "NONE") return null;
  const plainMatch = /^(SUP-[A-Z0-9]+-\d{3})$/u.exec(value);
  const codeMatch = /^`(SUP-[A-Z0-9]+-\d{3})`$/u.exec(value);
  const supportingAuthorityId = plainMatch?.[1] ?? codeMatch?.[1] ?? null;
  if (
    supportingAuthorityId === null ||
    !supportingAuthorityId.startsWith(contract.supportingAuthorityPrefix)
  ) {
    fail(
      "INVALID_SUPPORTING_AUTHORITY_REFERENCE",
      `${contract.contractId}: ${value || "empty"}`
    );
  }
  return supportingAuthorityId;
}

function splitMarkdownTableRow(line) {
  if (!line.startsWith("|") || !line.endsWith("|")) return [];
  const cells = [];
  let current = "";
  let escaped = false;
  for (let index = 1; index < line.length - 1; index += 1) {
    const character = line[index];
    if (character === "\\" && !escaped) {
      escaped = true;
      current += character;
      continue;
    }
    if (character === "|" && !escaped) {
      cells.push(current.trim().replace(/\\\|/gu, "|"));
      current = "";
      continue;
    }
    escaped = false;
    current += character;
  }
  cells.push(current.trim().replace(/\\\|/gu, "|"));
  return cells;
}

function parseTraceability(repoRoot, contract, semanticInventory, contracts) {
  const traceabilityPath = path.resolve(repoRoot, contract.traceabilityFile);
  if (!existsSync(traceabilityPath)) {
    fail(
      "OWNERSHIP_TRACEABILITY_FILE_MISSING",
      `${contract.contractId}: ${contract.traceabilityFile}`
    );
  }
  const traceabilityLines = readFileSync(traceabilityPath, "utf8").split(/\r?\n/u);
  const traceabilityRows = new Map();
  for (const line of traceabilityLines) {
    const cells = splitMarkdownTableRow(line);
    if (!CRITERION_ID_PATTERN.test(cells[0] ?? "")) continue;
    if (traceabilityRows.has(cells[0])) {
      fail("DUPLICATE_TRACEABILITY_CRITERION", `${contract.contractId}:${cells[0]}`);
    }
    traceabilityRows.set(cells[0], cells);
  }
  const missingIds = contract.criterionIds.filter((id) => !traceabilityRows.has(id));
  const unexpectedIds = [...traceabilityRows.keys()].filter(
    (id) => !contract.criterionIds.includes(id)
  );
  if (missingIds.length > 0 || unexpectedIds.length > 0) {
    fail(
      "TRACEABILITY_CRITERION_MISMATCH",
      `${contract.contractId}: missing=${missingIds.join(",") || "none"}; unexpected=${unexpectedIds.join(",") || "none"}`
    );
  }
  let dynamicTestAuthorityRows = 0;
  for (const id of contract.criterionIds) {
    const cells = traceabilityRows.get(id);
    if (cells.length !== 9 || cells[7] !== "PASS") {
      fail(
        "TRACEABILITY_MECHANISM_MISMATCH",
        `${contract.contractId}:${id} must have nine fields and MechanismMatch=PASS`
      );
    }
    const actualTestFile = extractCodeSpan(cells[1]);
    const actualTestTitle = extractCodeSpan(cells[2]);
    if (actualTestFile.length === 0 || actualTestTitle.length === 0) {
      fail("TRACEABILITY_BINDING_EMPTY", `${contract.contractId}:${id}`);
    }
    if (!actualTestFile.endsWith(".test.ts")) {
      if (contract.contractId === "2B20A" && id !== "C32") {
        fail("TRACEABILITY_STATIC_PRIMARY_MISMATCH", `${contract.contractId}:${id}`);
      }
      continue;
    }
    let expectedPrimary = null;
    if (contract.contractId === "2B20A") {
      expectedPrimary = TWO_B20A_PRIMARY_IDENTITIES.find(
        (primary) => primary.criterionId === id
      );
      if (
        expectedPrimary === undefined ||
        actualTestFile !== expectedPrimary.file ||
        actualTestTitle !== expectedPrimary.title ||
        cells[3] !== JSON.stringify(expectedPrimary.ancestorPath) ||
        cells[4] !== expectedPrimary.project
      ) {
        fail("TRACEABILITY_EXACT_IDENTITY_MISMATCH", `${contract.contractId}:${id}`);
      }
    }
    const candidates = [...semanticInventory.values()].filter(
      (identity) =>
        identity.file === actualTestFile &&
        traceTitleMatches(actualTestTitle, identity.title) &&
        (expectedPrimary === null ||
          (identity.project === expectedPrimary.project &&
            JSON.stringify(identity.ancestorPath) ===
              JSON.stringify(expectedPrimary.ancestorPath)))
    );
    const semanticCandidates = new Set(candidates.map(semanticIdentityKey));
    if (semanticCandidates.size !== 1) {
      fail(
        "TRACEABILITY_BINDING_NOT_UNIQUE",
        `${contract.contractId}:${id} resolves to ${semanticCandidates.size} tests`
      );
    }
    const semanticKey = [...semanticCandidates][0];
    const resolvedIdentity = semanticInventory.get(semanticKey);
    const classification = classifyOwnershipTitle(
      resolvedIdentity.title,
      contracts
    );
    const explicitlyUnmarked =
      contract.contractId === "2B20A" &&
      EXPLICIT_UNMARKED_2B20A_PRIMARIES.some(
        (primary) => primary.criterionId === id
      );
    if (
      (!explicitlyUnmarked &&
        (classification === null ||
          classification.unregisteredSliceMarker === true ||
          classification.contract.contractId !== contract.contractId)) ||
      (explicitlyUnmarked && classification !== null)
    ) {
      fail(
        "TRACEABILITY_BINDING_WRONG_OWNERSHIP_CONTRACT",
        `${contract.contractId}:${id} resolves to ${resolvedIdentity.title}`
      );
    }
    dynamicTestAuthorityRows += 1;
  }

  const escapedSupportingPrefix = contract.supportingAuthorityPrefix.replace(
    /[.*+?^$()|[\]\\]/gu,
    "\\$&"
  );
  const supportingPattern = new RegExp(
    `^${escapedSupportingPrefix}\\d{3}$`,
    "u"
  );
  const registryIds = new Set();
  const supportConsumers = new Map();
  let supersessionLinkCount = 0;
  for (const line of traceabilityLines) {
    const cells = splitMarkdownTableRow(line);
    const rawRegistryToken = cells[0] ?? "";
    if (!rawRegistryToken.includes("SUP-")) continue;
    if (
      contract.contractId === "2B20A" &&
      cells.length === 2 &&
      rawRegistryToken === "SUP-2B20A-032"
    ) {
      if (
        cells[1] !==
        "SUPR-2B20AP1-001,SUPR-2B20AP1-002,SUPR-2B20AP1-004"
      ) {
        fail(
          "SUPPORTING_AUTHORITY_SUPERSESSION_LINK_MISMATCH",
          cells[1]
        );
      }
      supersessionLinkCount += 1;
      continue;
    }
    const plainRegistryMatch = /^(SUP-[A-Z0-9]+-\d{3})$/u.exec(
      rawRegistryToken
    );
    const codeRegistryMatch = /^`(SUP-[A-Z0-9]+-\d{3})`$/u.exec(
      rawRegistryToken
    );
    const registryToken =
      plainRegistryMatch?.[1] ?? codeRegistryMatch?.[1] ?? null;
    if (registryToken === null || !supportingPattern.test(registryToken)) {
      fail(
        "INVALID_SUPPORTING_AUTHORITY_REGISTRY_ENTRY",
        `${contract.contractId}: ${rawRegistryToken}`
      );
    }
    if (registryIds.has(registryToken)) {
      fail(
        "DUPLICATE_SUPPORTING_AUTHORITY",
        `${contract.contractId}:${registryToken}`
      );
    }
    if (
      contract.contractId === "2B20A" &&
      (cells.length !== 6 ||
        !["ACCEPTED", "LEGACY", "HOSTILE"].includes(cells[3]) ||
        !["NONE", "CLONE_MUTATED", "PERSISTED_OR_IMPORTED_MUTATED"].includes(
          cells[5]
        ) ||
        !contract.criterionIds.includes(cells[4]))
    ) {
      fail(
        "INVALID_SUPPORTING_AUTHORITY_REGISTRY_ENTRY",
        `${contract.contractId}: ${registryToken}`
      );
    }
    if (
      contract.contractId === "2B20A" &&
      JSON.stringify(cells) !==
        JSON.stringify(EXPECTED_2B20A_SUPPORT_ROWS.get(registryToken))
    ) {
      fail(
        "SUPPORTING_AUTHORITY_EXACT_ROW_MISMATCH",
        `${contract.contractId}: ${registryToken}`
      );
    }
    registryIds.add(registryToken);
    supportConsumers.set(registryToken, cells[4]);
  }
  const referencedIds = new Set();
  for (const cells of traceabilityRows.values()) {
    const supportingAuthorityId = parseSupportingAuthorityReference(
      cells[6],
      contract
    );
    if (supportingAuthorityId !== null) referencedIds.add(supportingAuthorityId);
  }
  const missingSupportingIds = [...referencedIds].filter((id) => !registryIds.has(id));
  const unusedSupportingIds = [...registryIds].filter((id) => !referencedIds.has(id));
  if (missingSupportingIds.length > 0) {
    fail(
      "SUPPORTING_AUTHORITY_MISSING",
      `${contract.contractId}: ${missingSupportingIds.join(",")}`
    );
  }
  if (unusedSupportingIds.length > 0) {
    fail(
      "SUPPORTING_AUTHORITY_UNUSED",
      `${contract.contractId}: ${unusedSupportingIds.join(",")}`
    );
  }
  if (contract.contractId === "2B20A") {
    if (supersessionLinkCount !== 1) {
      fail(
        "SUPPORTING_AUTHORITY_SUPERSESSION_LINK_MISMATCH",
        `expected=1, actual=${supersessionLinkCount}`
      );
    }
    for (const [criterionId, cells] of traceabilityRows) {
      const supportId = parseSupportingAuthorityReference(cells[6], contract);
      if (supportConsumers.get(supportId) !== criterionId) {
        fail(
          "SUPPORTING_AUTHORITY_CONSUMER_MISMATCH",
          `${supportId}:${supportConsumers.get(supportId) ?? "none"}:${criterionId}`
        );
      }
    }
  }
  return {
    traceabilityRows: traceabilityRows.size,
    dynamicTestAuthorityRows,
    supportingAuthorityIds: registryIds.size
  };
}

export function auditOwnershipContracts({
  repoRoot,
  contracts,
  fullInventory,
  legacyApplicationServiceProjects
}) {
  const resolvedRoot = path.resolve(repoRoot);
  const validatedContracts = validateOwnershipContracts(contracts, {
    repoRoot: resolvedRoot
  });
  assertDenseArray(fullInventory, "fullInventory");
  assertDenseArray(
    legacyApplicationServiceProjects,
    "legacyApplicationServiceProjects"
  );
  if (
    validatedContracts.some((contract) => contract.contractId === "2B20A")
  ) {
    validate2B20APrimaryIdentities(resolvedRoot, fullInventory);
    validateAcceptedAuthoritySupersessions(resolvedRoot, fullInventory);
  }
  const applicationFiles = new Set(
    validatedContracts.map((contract) => contract.applicationTestFile)
  );
  const contractInventories = new Map(
    validatedContracts.map((contract) => [contract.contractId, []])
  );
  const nonMarkerInventory = [];
  for (const identity of fullInventory) {
    if (!applicationFiles.has(identity.file)) continue;
    const classification = classifyOwnershipTitle(identity.title, validatedContracts);
    if (classification === null) {
      nonMarkerInventory.push(identity);
      continue;
    }
    if (classification.unregisteredSliceMarker === true) {
      nonMarkerInventory.push(identity);
      continue;
    }
    if (identity.file !== classification.contract.applicationTestFile) {
      fail(
        "OWNERSHIP_MARKER_WRONG_TEST_FILE",
        `${classification.contract.contractId}: ${identity.file}`
      );
    }
    contractInventories.get(classification.contract.contractId).push({
      ...identity,
      authorityMarker: classification.authorityMarker
    });
  }
  for (const predecessor of VIRTUAL_ACCEPTED_PREDECESSORS.filter((candidate) =>
    contractInventories.has(candidate.contractId)
  )) {
    const inventory = contractInventories.get(predecessor.contractId);
    if (inventory === undefined) {
      fail("SUPERSESSION_PREDECESSOR_CONTRACT_MISSING", predecessor.contractId);
    }
    inventory.push({
      project: predecessor.project,
      file: predecessor.file,
      ancestorPath: predecessor.ancestorPath,
      title: predecessor.title,
      authorityMarker: predecessor.authorityMarker,
      virtualAcceptedPredecessor: true
    });
  }

  const nonMarkerOwners = new Map();
  for (const identity of nonMarkerInventory) {
    const key = semanticIdentityKey(identity);
    const entry = nonMarkerOwners.get(key) ?? { identity, owners: new Set() };
    entry.owners.add(identity.project);
    nonMarkerOwners.set(key, entry);
  }
  const nonMarkerLines = [...nonMarkerOwners.values()].map(({ identity, owners }) =>
    [
      identity.file,
      identity.ancestorPath.join(" > "),
      identity.title,
      [...owners].sort(ordinalCompare).join(",")
    ].join("\t")
  );
  const nonMarkerOwnershipSha256 = sha256CanonicalLines(nonMarkerLines);
  const physicalTestFileSetSha256 = sha256CanonicalLines(
    new Set(fullInventory.map((identity) => identity.file))
  );
  if (
    validatedContracts.some(
      (contract) =>
        contract.frozenBaseline.nonMarkerOwnershipSha256 !==
        nonMarkerOwnershipSha256
    )
  ) {
    fail(
      "UNREGISTERED_SLICE_OWNERSHIP_MARKER",
      "non-owned application inventory differs from the frozen accepted-history set"
    );
  }
  const semanticInventory = new Map();
  for (const identity of fullInventory) {
    semanticInventory.set(semanticIdentityKey(identity), identity);
  }
  for (const predecessor of VIRTUAL_ACCEPTED_PREDECESSORS.filter((candidate) =>
    contractInventories.has(candidate.contractId)
  )) {
    semanticInventory.set(semanticIdentityKey(predecessor), predecessor);
  }

  const audits = [];
  for (const contract of validatedContracts) {
    const inventory = contractInventories.get(contract.contractId);
    const semanticOwners = new Map();
    for (const identity of inventory) {
      const key = semanticIdentityKey(identity);
      const entry = semanticOwners.get(key) ?? { identity, owners: new Set() };
      entry.owners.add(identity.project);
      semanticOwners.set(key, entry);
    }
    for (const { identity, owners } of semanticOwners.values()) {
      if (owners.size !== 1 || !owners.has(contract.ownerProject)) {
        fail(
          "SEMANTIC_OWNERSHIP_MISMATCH",
          `${contract.contractId}:${identity.title}: ${[...owners].sort(ordinalCompare).join(",") || "none"}`
        );
      }
    }
    if (inventory.length !== semanticOwners.size) {
      fail(
        "SEMANTIC_OWNERSHIP_DUPLICATE_EXECUTION",
        `${contract.contractId}: semantic=${semanticOwners.size}, executions=${inventory.length}`
      );
    }
    const semanticInventorySha256 = sha256CanonicalLines(
      [...semanticOwners.values()].map(({ identity }) =>
        [identity.file, identity.ancestorPath.join(" > "), identity.title].join("\t")
      )
    );
    const authorityInventorySha256 = sha256CanonicalLines(
      new Set(inventory.map((identity) => identity.authorityMarker))
    );
    const currentProjectInventorySha256 = sha256CanonicalLines(
      inventory.map((identity) => tabIdentity(identity, true))
    );
    const baseline = contract.frozenBaseline;
    const exactComparisons = [
      [
        "semantic inventory",
        baseline.semanticInventorySha256,
        semanticInventorySha256
      ],
      [
        "authority inventory",
        baseline.authorityInventorySha256,
        authorityInventorySha256
      ],
      [
        "current project inventory",
        baseline.currentProjectInventorySha256,
        currentProjectInventorySha256
      ],
      [
        "non-marker ownership",
        baseline.nonMarkerOwnershipSha256,
        nonMarkerOwnershipSha256
      ],
      [
        "physical test-file set",
        baseline.physicalTestFileSetSha256,
        physicalTestFileSetSha256
      ]
    ];
    for (const [label, expected, actual] of exactComparisons) {
      if (expected !== actual) {
        fail(
          "OWNERSHIP_FROZEN_BASELINE_MISMATCH",
          `${contract.contractId} ${label}: expected=${expected}, actual=${actual}`
        );
      }
    }
    if (inventory.length !== baseline.projectExecutionsAfter) {
      fail(
        "OWNERSHIP_FROZEN_BASELINE_MISMATCH",
        `${contract.contractId} project executions: expected=${baseline.projectExecutionsAfter}, actual=${inventory.length}`
      );
    }
    const traceability = parseTraceability(
      resolvedRoot,
      contract,
      semanticInventory,
      validatedContracts
    );
    if (
      traceability.traceabilityRows !== baseline.traceabilityRowCount ||
      traceability.dynamicTestAuthorityRows !== baseline.dynamicTestAuthorityRows ||
      traceability.supportingAuthorityIds !== baseline.supportingAuthorityCount
    ) {
      fail(
        "OWNERSHIP_FROZEN_BASELINE_MISMATCH",
        `${contract.contractId} traceability/supporting baseline changed`
      );
    }
    const projectOrder = [
      ...legacyApplicationServiceProjects,
      contract.ownerProject
    ].filter((project, index, all) => all.indexOf(project) === index);
    const perProject = Object.fromEntries(
      projectOrder.map((project) => [
        project,
        inventory.filter((identity) => identity.project === project).length
      ])
    );
    for (const project of legacyApplicationServiceProjects) {
      if (project !== contract.ownerProject && perProject[project] !== 0) {
        fail(
          "SEMANTIC_OWNERSHIP_MISMATCH",
          `${project} owns ${perProject[project]} ${contract.contractId} tests`
        );
      }
    }
    audits.push({
      contractId: contract.contractId,
      semanticTests: semanticOwners.size,
      projectExecutionsBefore: baseline.projectExecutionsBefore,
      projectExecutionsAfter: inventory.length,
      removedDuplicateExecutions:
        baseline.projectExecutionsBefore - inventory.length,
      ownerProject: contract.ownerProject,
      perProject,
      baselineProjectInventorySha256: baseline.projectInventorySha256,
      currentProjectInventorySha256,
      semanticInventorySha256,
      authorityInventorySha256,
      nonMarkerOwnershipSha256,
      physicalTestFileSetSha256,
      traceabilityRows: traceability.traceabilityRows,
      traceabilityRowsResolved: contract.criterionIds.length,
      dynamicTestAuthorityRows: traceability.dynamicTestAuthorityRows,
      supportingAuthorityIds: traceability.supportingAuthorityIds
    });
  }
  return Object.freeze(
    audits
      .sort((left, right) => ordinalCompare(left.contractId, right.contractId))
      .map((audit) => Object.freeze(audit))
  );
}

const A3A_CRITERION_IDS = [];
for (let index = 1; index <= 53; index += 1) {
  A3A_CRITERION_IDS.push(`C${String(index).padStart(2, "0")}`);
}
for (let index = 1; index <= 39; index += 1) {
  A3A_CRITERION_IDS.push(`S${String(index).padStart(2, "0")}`);
}

const A3B1_CRITERION_IDS = [];
for (let index = 1; index <= 41; index += 1) {
  if (index !== 24) A3B1_CRITERION_IDS.push(`C${String(index).padStart(2, "0")}`);
}
for (let index = 1; index <= 20; index += 1) {
  A3B1_CRITERION_IDS.push(`S${String(index).padStart(2, "0")}`);
}

const A3B2_CRITERION_IDS = [];
for (let index = 1; index <= 46; index += 1) {
  A3B2_CRITERION_IDS.push(`C${String(index).padStart(2, "0")}`);
}
for (let index = 1; index <= 12; index += 1) {
  A3B2_CRITERION_IDS.push(`S${String(index).padStart(2, "0")}`);
}

const B19B_CRITERION_IDS = [];
for (let index = 1; index <= 60; index += 1) {
  B19B_CRITERION_IDS.push(`C${String(index).padStart(2, "0")}`);
}

const TWO_B20A_CRITERION_IDS = Object.freeze(
  TWO_B20A_PRIMARY_IDENTITIES.map((identity) => identity.criterionId)
);
for (let index = 1; index <= 20; index += 1) {
  B19B_CRITERION_IDS.push(`S${String(index).padStart(2, "0")}`);
}

const RAW_OWNERSHIP_CONTRACTS = Object.freeze([
  Object.freeze({
    contractId: "2B20A",
    markerPrefix: "[2B20A-",
    markerPattern: "^\\[2B20A-[^\\]]+\\]",
    applicationTestFile: APP_TEST_FILE,
    ownerProject: "application-service-dreamer-vortox",
    traceabilityFile:
      "docs/implementation/phase-3-slice-2b20a-test-traceability.md",
    criterionIds: TWO_B20A_CRITERION_IDS,
    supportingAuthorityPrefix: "SUP-2B20A-",
    frozenBaseline: Object.freeze({
      projectExecutionsBefore: 22,
      projectExecutionsAfter: 22,
      projectInventorySha256: "56d9e7f6c6cc39845d3aef4637e4545b3a03181ddfc67fe8df9b760b6a4644d0",
      currentProjectInventorySha256: "56d9e7f6c6cc39845d3aef4637e4545b3a03181ddfc67fe8df9b760b6a4644d0",
      semanticInventorySha256: "3d639f664458a11014774dc29c95c711ab8705bc20502d180d57abd6ce6db4c6",
      authorityInventorySha256: "edc6ae6c04dce5c4f19663152b97c96a9e1527cc81b18b551d95f906bd93c955",
      nonOwnedInventoryPolicy: NON_OWNED_POLICY,
      nonMarkerOwnershipSha256: "764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8",
      physicalTestFileSetSha256: "55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab",
      traceabilityRowCount: 37,
      dynamicTestAuthorityRows: 36,
      supportingAuthorityCount: 37
    }),
    status: ACTIVE_STATUS
  }),
  Object.freeze({
    contractId: "2B19A3B2",
    markerPrefix: "[2B19A3B2-",
    markerPattern: "^\\[2B19A3B2-[^\\]]+\\]",
    applicationTestFile:
      "packages/application/src/game-application-service.test.ts",
    ownerProject: "application-service-information-and-later-actions",
    traceabilityFile:
      "docs/implementation/phase-3-slice-2b19a3b2-test-traceability.md",
    criterionIds: Object.freeze(A3B2_CRITERION_IDS),
    supportingAuthorityPrefix: "SUP-2B19A3B2-",
    frozenBaseline: Object.freeze({
      projectExecutionsBefore: 9,
      projectExecutionsAfter: 9,
      projectInventorySha256: "57a203ad425956791886c56ea8b906b2252186aaf8c5a66be19e7bcf7b0d718e",
      currentProjectInventorySha256: "57a203ad425956791886c56ea8b906b2252186aaf8c5a66be19e7bcf7b0d718e",
      semanticInventorySha256: "3379844b47a12a8053869a7db73a300030c0e6029acee9cadf54e64d2500c147",
      authorityInventorySha256: "65adffd5fe6242cfc64d215629b39a0cf6c5f68bfbb30d1426fdb133f9c5a039",
      nonOwnedInventoryPolicy: NON_OWNED_POLICY,
      nonMarkerOwnershipSha256: "764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8",
      physicalTestFileSetSha256: "55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab",
      traceabilityRowCount: 58,
      dynamicTestAuthorityRows: 51,
      supportingAuthorityCount: 10
    }),
    status: ACTIVE_STATUS
  }),
  Object.freeze({
    contractId: "2B19B",
    markerPrefix: "[2B19B-",
    markerPattern: "^\\[2B19B-[^\\]]+\\]",
    applicationTestFile:
      "packages/application/src/game-application-service.test.ts",
    ownerProject: "application-service-dreamer-vortox",
    traceabilityFile:
      "docs/implementation/phase-3-slice-2b19b-test-traceability.md",
    criterionIds: Object.freeze(B19B_CRITERION_IDS),
    supportingAuthorityPrefix: "SUP-2B19B-",
    frozenBaseline: Object.freeze({
      projectExecutionsBefore: 10,
      projectExecutionsAfter: 10,
      projectInventorySha256: "92bcddf3603962ff040338874429f43b98f711a0dd4fa02adfbc0ed80bec32c8",
      currentProjectInventorySha256: "92bcddf3603962ff040338874429f43b98f711a0dd4fa02adfbc0ed80bec32c8",
      semanticInventorySha256: "8121c6d14bb462f9c0dfe31750bc77890f53d600ff542b1a13450d231e42f482",
      authorityInventorySha256: "e7e88b9d6be6771d351ac8665b05dcaec305516f402d1a92655b845cba942e81",
      nonOwnedInventoryPolicy: NON_OWNED_POLICY,
      nonMarkerOwnershipSha256: "764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8",
      physicalTestFileSetSha256: "55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab",
      traceabilityRowCount: 80,
      dynamicTestAuthorityRows: 78,
      supportingAuthorityCount: 10
    }),
    status: ACTIVE_STATUS
  }),
  Object.freeze({
    contractId: "2B19A3B1",
    markerPrefix: "[2B19A3B1-",
    markerPattern: "^\\[2B19A3B1-[^\\]]+\\]",
    applicationTestFile:
      "packages/application/src/game-application-service.test.ts",
    ownerProject: "application-service-dreamer-vortox",
    traceabilityFile:
      "docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md",
    criterionIds: Object.freeze(A3B1_CRITERION_IDS),
    supportingAuthorityPrefix: "SUP-2B19A3B1-",
    frozenBaseline: Object.freeze({
      projectExecutionsBefore: 6,
      projectExecutionsAfter: 6,
      projectInventorySha256: "9d8726005537db396683c3701546a85f0094b3e84ca062f1d7113a66b3eef189",
      currentProjectInventorySha256: "9d8726005537db396683c3701546a85f0094b3e84ca062f1d7113a66b3eef189",
      semanticInventorySha256: "bd194c778f83c42c4bc46307f028e1a289b01c50a49c2169ce2a07c267a317f4",
      authorityInventorySha256: "c42fc09726d54c1e9ea6f7d88756435340f7e329cd5fd45f00c9030979e574c6",
      nonOwnedInventoryPolicy: NON_OWNED_POLICY,
      nonMarkerOwnershipSha256: "764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8",
      physicalTestFileSetSha256: "55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab",
      traceabilityRowCount: 60,
      dynamicTestAuthorityRows: 58,
      supportingAuthorityCount: 4
    }),
    status: ACTIVE_STATUS
  }),
  Object.freeze({
    contractId: "2B19A3A",
    markerPrefix: "[2B19A3A-",
    markerPattern: "^\\[2B19A3A-[^\\]]+\\]",
    applicationTestFile:
      "packages/application/src/game-application-service.test.ts",
    ownerProject: "application-service-dreamer-vortox",
    traceabilityFile:
      "docs/implementation/phase-3-slice-2b19a3a-test-traceability.md",
    criterionIds: Object.freeze(A3A_CRITERION_IDS),
    supportingAuthorityPrefix: "SUP-2B19A3A-",
    frozenBaseline: Object.freeze({
      projectExecutionsBefore: 34,
      projectExecutionsAfter: 10,
      projectInventorySha256:
        "3829eb2a26e28e22a568d7e393e22c68aedb8979021a3e3b4522b9e53b6d3c8e",
      currentProjectInventorySha256:
        "147ad97c8e5169f135fd5eddbfc25dcb4f29adb0c0902023e80b0efcce0c466d",
      semanticInventorySha256:
        "5e544f734381f99f20ac715513b7af7e5a33af6726ca9cad8a0c6d8c1fe7b2cb",
      authorityInventorySha256:
        "e098696e88ed4f3d050b6d24511b05522aa26afed43d4f8d09d668c81309f676",
      nonOwnedInventoryPolicy: NON_OWNED_POLICY,
      nonMarkerOwnershipSha256:
        "764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8",
      physicalTestFileSetSha256:
        "55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab",
      traceabilityRowCount: 92,
      dynamicTestAuthorityRows: 83,
      supportingAuthorityCount: 2
    }),
    status: ACTIVE_STATUS
  })
]);

export const OWNERSHIP_CONTRACTS = validateOwnershipContracts(
  RAW_OWNERSHIP_CONTRACTS,
  { repoRoot: process.cwd() }
);

export const ACCEPTED_CONTRACT_BASELINES = Object.freeze(
  ["2B19A3A", "2B19A3B1", "2B19A3B2", "2B19B"].map((contractId) => {
    const contract = OWNERSHIP_CONTRACTS.find(
      (candidate) => candidate.contractId === contractId
    );
    if (contract === undefined) {
      fail("ACCEPTED_CONTRACT_BASELINE_MISSING", contractId);
    }
    return Object.freeze({
      contractId,
      frozenBaseline: contract.frozenBaseline
    });
  })
);

export function calculate2B20AFrozenBaseline(repoRoot, fullInventory) {
  const resolvedRoot = path.resolve(repoRoot);
  const canonicalInventory = validate2B20APrimaryIdentities(
    resolvedRoot,
    fullInventory
  );
  const contract = OWNERSHIP_CONTRACTS.find(
    (candidate) => candidate.contractId === "2B20A"
  );
  if (contract === undefined) {
    fail("TWO_B20A_CONTRACT_MISSING", "2B20A");
  }
  const applicationIdentities = canonicalInventory.filter(
    (identity) => identity.file === contract.applicationTestFile
  );
  const owned = [];
  const nonMarker = [];
  for (const identity of applicationIdentities) {
    const classification = classifyOwnershipTitle(identity.title, OWNERSHIP_CONTRACTS);
    if (
      classification !== null &&
      classification.unregisteredSliceMarker !== true &&
      classification.contract.contractId === "2B20A"
    ) {
      if (identity.project !== contract.ownerProject) {
        fail("SEMANTIC_OWNERSHIP_MISMATCH", `2B20A:${identity.title}`);
      }
      owned.push({
        ...identity,
        authorityMarker: classification.authorityMarker
      });
    } else if (classification === null || classification.unregisteredSliceMarker === true) {
      nonMarker.push(identity);
    }
  }
  const semanticOwners = new Map();
  for (const identity of owned) {
    const key = semanticIdentityKey(identity);
    if (semanticOwners.has(key)) {
      fail("SEMANTIC_OWNERSHIP_DUPLICATE_EXECUTION", `2B20A:${identity.title}`);
    }
    semanticOwners.set(key, identity);
  }
  if (owned.length !== 22 || semanticOwners.size !== 22) {
    fail(
      "TWO_B20A_APPLICATION_OWNERSHIP_COUNT_MISMATCH",
      `expected=22, actual=${owned.length}, semantic=${semanticOwners.size}`
    );
  }
  const nonMarkerOwners = new Map();
  for (const identity of nonMarker) {
    const key = semanticIdentityKey(identity);
    const entry = nonMarkerOwners.get(key) ?? { identity, owners: new Set() };
    entry.owners.add(identity.project);
    nonMarkerOwners.set(key, entry);
  }
  const nonMarkerLines = [...nonMarkerOwners.values()].map(({ identity, owners }) =>
    [
      identity.file,
      identity.ancestorPath.join(" > "),
      identity.title,
      [...owners].sort(ordinalCompare).join(",")
    ].join("\t")
  );
  const semanticInventory = new Map(
    canonicalInventory.map((identity) => [semanticIdentityKey(identity), identity])
  );
  const traceability = parseTraceability(
    resolvedRoot,
    contract,
    semanticInventory,
    OWNERSHIP_CONTRACTS
  );
  return Object.freeze({
    projectExecutionsBefore: 22,
    projectExecutionsAfter: 22,
    projectInventorySha256: sha256CanonicalLines(
      owned.map((identity) => tabIdentity(identity, true))
    ),
    currentProjectInventorySha256: sha256CanonicalLines(
      owned.map((identity) => tabIdentity(identity, true))
    ),
    semanticInventorySha256: sha256CanonicalLines(
      [...semanticOwners.values()].map((identity) =>
        [identity.file, identity.ancestorPath.join(" > "), identity.title].join("\t")
      )
    ),
    authorityInventorySha256: sha256CanonicalLines(
      new Set(owned.map((identity) => identity.authorityMarker))
    ),
    nonOwnedInventoryPolicy: NON_OWNED_POLICY,
    nonMarkerOwnershipSha256: sha256CanonicalLines(nonMarkerLines),
    physicalTestFileSetSha256: sha256CanonicalLines(
      new Set(canonicalInventory.map((identity) => identity.file))
    ),
    traceabilityRowCount: traceability.traceabilityRows,
    dynamicTestAuthorityRows: traceability.dynamicTestAuthorityRows,
    supportingAuthorityCount: traceability.supportingAuthorityIds
  });
}

export function build2B20ACandidate(repoRoot, fullInventory) {
  const canonicalInventory = canonicalizeStructuredVitestIdentities(
    repoRoot,
    fullInventory
  );
  if (canonicalInventory.length !== 1572) {
    fail(
      "STRUCTURED_IDENTITY_COUNT_MISMATCH",
      `expected=1572, actual=${canonicalInventory.length}`
    );
  }
  const lfIdentityCount = canonicalInventory.filter((identity) =>
    [identity.project, identity.file, ...identity.ancestorPath, identity.title].some(
      (field) => field.includes("\n")
    )
  ).length;
  if (lfIdentityCount !== 12) {
    fail(
      "LF_IDENTITY_COUNT_MISMATCH",
      `expected=12, actual=${lfIdentityCount}`
    );
  }
  const structuredIdentities = canonicalInventory.map((identity) => [
    identity.project,
    identity.file,
    [...identity.ancestorPath],
    identity.title
  ]);
  return {
    schemaVersion: "vitest-ownership-candidate-baseline-v2",
    contractId: "2B20A",
    identityEncodingVersion: IDENTITY_ENCODING_VERSION,
    structuredIdentityCount: canonicalInventory.length,
    lfIdentityCount,
    inventorySha256: structuredInventorySha256(canonicalInventory),
    traceabilitySha256: traceabilitySha256(
      repoRoot,
      "docs/implementation/phase-3-slice-2b20a-test-traceability.md"
    ),
    structuredIdentities,
    frozenBaseline: calculate2B20AFrozenBaseline(repoRoot, canonicalInventory),
    acceptedContractBaselines: ACCEPTED_CONTRACT_BASELINES
  };
}

export function candidateBytes(candidate) {
  return Buffer.from(`${JSON.stringify(candidate, null, 2)}\n`, "utf8");
}
