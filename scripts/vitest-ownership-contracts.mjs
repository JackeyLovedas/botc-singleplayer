import { createHash } from "node:crypto";
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
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
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
    if (!actualTestFile.endsWith(".test.ts")) continue;
    const candidates = [...semanticInventory.values()].filter(
      (identity) =>
        identity.file === actualTestFile &&
        traceTitleMatches(actualTestTitle, identity.title)
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
    if (
      classification === null ||
      classification.unregisteredSliceMarker === true ||
      classification.contract.contractId !== contract.contractId
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
  for (const line of traceabilityLines) {
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    const rawRegistryToken = cells[0] ?? "";
    if (!rawRegistryToken.includes("SUP-")) continue;
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
    registryIds.add(registryToken);
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

const RAW_OWNERSHIP_CONTRACTS = Object.freeze([
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
      nonMarkerOwnershipSha256: "92f7e4197bf07f2186bb98e0ce5627964189ceff6f56e286a5a091166f74852c",
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
        "92f7e4197bf07f2186bb98e0ce5627964189ceff6f56e286a5a091166f74852c",
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
