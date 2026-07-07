import type { RoleId } from "./ids.js";

export const SUPPORTED_SCRIPT_ID = "sects-and-violets" as const;
export const SUPPORTED_SCRIPT_NAME = "Sects & Violets" as const;
export const SUPPORTED_SCRIPT_EDITION = "sects-and-violets" as const;
export const SUPPORTED_SETUP_ALGORITHM_VERSION = "snv-12-setup-v1" as const;
export const SUPPORTED_RANDOM_ALGORITHM_VERSION = "xmur3-sfc32-rejection-v1" as const;
export const SUPPORTED_SETUP_RANDOM_STREAM = "setup/sects-and-violets/12/v1" as const;
export const SUPPORTED_ROLE_CATALOG_VERSION = "snv-role-catalog-v1" as const;
export const SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM = "canonical-role-catalog-v1" as const;
export const SUPPORTED_ROLE_CATALOG_SIGNATURE = "canonical-role-catalog-v1:60ac4718" as const;

export type SupportedScriptId = typeof SUPPORTED_SCRIPT_ID;
export type SupportedScriptName = typeof SUPPORTED_SCRIPT_NAME;
export type SupportedEdition = typeof SUPPORTED_SCRIPT_EDITION;
export type SupportedSetupAlgorithmVersion = typeof SUPPORTED_SETUP_ALGORITHM_VERSION;
export type SupportedRandomAlgorithmVersion = typeof SUPPORTED_RANDOM_ALGORITHM_VERSION;
export type SupportedSetupRandomStream = typeof SUPPORTED_SETUP_RANDOM_STREAM;
export type SupportedRoleCatalogVersion = typeof SUPPORTED_ROLE_CATALOG_VERSION;
export type SupportedRoleCatalogSignatureAlgorithm = typeof SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM;

export type CharacterType = "TOWNSFOLK" | "OUTSIDER" | "MINION" | "DEMON";
export type DefaultAlignment = "GOOD" | "EVIL";
export type VerificationStatus = "VERIFIED_CORE" | "PARTIAL";

export type SetupModifier = {
  readonly outsiderDelta: number;
  readonly townsfolkDelta: number;
};

export type RoleDefinition = {
  readonly roleId: RoleId;
  readonly nameZh: string;
  readonly nameEn: string;
  readonly edition: SupportedEdition;
  readonly characterType: CharacterType;
  readonly defaultAlignment: DefaultAlignment;
  readonly setupModifier: SetupModifier;
  readonly sourceDocument: string;
  readonly verificationStatus: VerificationStatus;
};

export type ScriptDefinition = {
  readonly scriptId: SupportedScriptId;
  readonly scriptName: SupportedScriptName;
  readonly edition: SupportedEdition;
  readonly roles: readonly RoleDefinition[];
};

export type RoleSetupSnapshot = {
  readonly roleId: RoleId;
  readonly characterType: CharacterType;
  readonly defaultAlignment: DefaultAlignment;
  readonly edition: SupportedEdition;
  readonly setupModifier: SetupModifier;
};

export type RoleCatalogSnapshot = {
  readonly scriptId: SupportedScriptId;
  readonly edition: SupportedEdition;
  readonly roleCatalogVersion: string;
  readonly roles: readonly RoleSetupSnapshot[];
  readonly canonicalSignature: string;
};

export type RoleCountSet = {
  readonly TOWNSFOLK: number;
  readonly OUTSIDER: number;
  readonly MINION: number;
  readonly DEMON: number;
};

export type SetupGenerationConstraints = {
  readonly lockedRoleIds?: readonly RoleId[];
  readonly excludedRoleIds?: readonly RoleId[];
  readonly exactRoleIds?: readonly RoleId[];
};

export type SetupGenerationConstraintsSnapshot = {
  readonly lockedRoleIds: readonly RoleId[];
  readonly excludedRoleIds: readonly RoleId[];
  readonly exactRoleIds: readonly RoleId[];
};

export type SetupModifierApplied = {
  readonly roleId: RoleId;
  readonly outsiderDelta: number;
  readonly townsfolkDelta: number;
};

export type SetupValidationSummary = {
  readonly actualRoleCount: number;
  readonly demonBluffCount: number;
  readonly roleIdsUnique: boolean;
  readonly demonRoleCount: number;
  readonly minionRoleCount: number;
  readonly actualRolesMatchPostModifierCounts: boolean;
};

export type GeneratedSetup = {
  readonly scriptId: SupportedScriptId;
  readonly setupAlgorithmVersion: string;
  readonly randomAlgorithmVersion: string;
  readonly randomStream: string;
  readonly roleCatalogVersion: string;
  readonly roleCatalogSnapshot: RoleCatalogSnapshot;
  readonly roleCatalogSignature: string;
  readonly roleCatalogSignatureAlgorithm: string;
  readonly constraintsSnapshot: SetupGenerationConstraintsSnapshot;
  readonly preModifierCounts: RoleCountSet;
  readonly postModifierCounts: RoleCountSet;
  readonly actualRoles: readonly RoleSetupSnapshot[];
  readonly demonRole: RoleSetupSnapshot;
  readonly setupModifiersApplied: readonly SetupModifierApplied[];
  readonly demonBluffs: readonly RoleSetupSnapshot[];
  readonly validationSummary: SetupValidationSummary;
};

export type SetupFailureCode =
  | "UnknownRole"
  | "DuplicateConstraintRole"
  | "LockedAndExcludedConflict"
  | "ExactSetupCannotUseOtherConstraints"
  | "ExactSetupWrongSize"
  | "TooManyLockedRolesForType"
  | "MultipleLockedDemons"
  | "InsufficientCandidates"
  | "InvalidModifierResult"
  | "InsufficientDemonBluffs"
  | "NoLegalSetup";

export type SetupGenerationFailure = {
  readonly status: "failure";
  readonly failureCode: SetupFailureCode;
  readonly message: string;
  readonly conflictingRoleIds: readonly RoleId[];
  readonly requestedCounts: RoleCountSet | undefined;
  readonly availableCounts: RoleCountSet | undefined;
  readonly constraintsSnapshot: SetupGenerationConstraintsSnapshot;
};

export type SetupGenerationSuccess = {
  readonly status: "success";
  readonly setup: GeneratedSetup;
};

export type SetupGenerationResult = SetupGenerationSuccess | SetupGenerationFailure;

export type SetupGeneratorInput = {
  readonly scriptId: string;
  readonly rootSeed: string;
  readonly playerCount: number;
  readonly constraints: SetupGenerationConstraints;
};

export const BASE_TWELVE_PLAYER_COUNTS: RoleCountSet = {
  TOWNSFOLK: 7,
  OUTSIDER: 2,
  MINION: 2,
  DEMON: 1
};

export const ZERO_SETUP_MODIFIER: SetupModifier = {
  outsiderDelta: 0,
  townsfolkDelta: 0
};

export const CHARACTER_TYPES: readonly CharacterType[] = ["TOWNSFOLK", "OUTSIDER", "MINION", "DEMON"];

const CHARACTER_TYPE_ORDER: Readonly<Record<CharacterType, number>> = {
  TOWNSFOLK: 0,
  OUTSIDER: 1,
  MINION: 2,
  DEMON: 3
};

export const compareStableId = (left: string, right: string): number => {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
};

export const compareRoleSetupSnapshot = (left: RoleSetupSnapshot, right: RoleSetupSnapshot): number => {
  const typeOrder = CHARACTER_TYPE_ORDER[left.characterType] - CHARACTER_TYPE_ORDER[right.characterType];
  if (typeOrder !== 0) {
    return typeOrder;
  }

  return compareStableId(left.roleId, right.roleId);
};

export const expectedAlignmentForCharacterType = (characterType: CharacterType): DefaultAlignment =>
  characterType === "MINION" || characterType === "DEMON" ? "EVIL" : "GOOD";

export const isZeroSetupModifier = (modifier: SetupModifier): boolean =>
  modifier.outsiderDelta === 0 && modifier.townsfolkDelta === 0;

const isIntegerModifier = (modifier: SetupModifier): boolean =>
  Number.isInteger(modifier.outsiderDelta) && Number.isInteger(modifier.townsfolkDelta);

const countTotal = (counts: RoleCountSet): number => counts.TOWNSFOLK + counts.OUTSIDER + counts.MINION + counts.DEMON;

const applySetupModifierToBaseCounts = (modifier: SetupModifier): RoleCountSet => ({
  TOWNSFOLK: BASE_TWELVE_PLAYER_COUNTS.TOWNSFOLK + modifier.townsfolkDelta,
  OUTSIDER: BASE_TWELVE_PLAYER_COUNTS.OUTSIDER + modifier.outsiderDelta,
  MINION: BASE_TWELVE_PLAYER_COUNTS.MINION,
  DEMON: BASE_TWELVE_PLAYER_COUNTS.DEMON
});

const modifierPreservesTotal = (modifier: SetupModifier): boolean =>
  modifier.outsiderDelta + modifier.townsfolkDelta === 0;

const modifierHasValidPostCounts = (modifier: SetupModifier): boolean => {
  const postCounts = applySetupModifierToBaseCounts(modifier);
  return countTotal(postCounts) === 12 && CHARACTER_TYPES.every((type) => postCounts[type] >= 0);
};

export const validateRoleSetupSnapshot = (snapshot: RoleSetupSnapshot): boolean =>
  snapshot.roleId.trim().length > 0 &&
  snapshot.edition === SUPPORTED_SCRIPT_EDITION &&
  snapshot.defaultAlignment === expectedAlignmentForCharacterType(snapshot.characterType) &&
  isIntegerModifier(snapshot.setupModifier) &&
  modifierPreservesTotal(snapshot.setupModifier) &&
  (snapshot.characterType === "DEMON"
    ? modifierHasValidPostCounts(snapshot.setupModifier)
    : isZeroSetupModifier(snapshot.setupModifier));

export const sameRoleSetupSnapshot = (left: RoleSetupSnapshot, right: RoleSetupSnapshot): boolean =>
  left.roleId === right.roleId &&
  left.characterType === right.characterType &&
  left.defaultAlignment === right.defaultAlignment &&
  left.edition === right.edition &&
  left.setupModifier.outsiderDelta === right.setupModifier.outsiderDelta &&
  left.setupModifier.townsfolkDelta === right.setupModifier.townsfolkDelta;

export const isStableRoleIdList = (roleIds: readonly RoleId[]): boolean =>
  roleIds.every((roleIdValue, index) => index === 0 || compareStableId(roleIds[index - 1] ?? "", roleIdValue) < 0);

const roleCountsByType = (roles: readonly Pick<RoleDefinition, "characterType">[]): RoleCountSet => ({
  TOWNSFOLK: roles.filter((role) => role.characterType === "TOWNSFOLK").length,
  OUTSIDER: roles.filter((role) => role.characterType === "OUTSIDER").length,
  MINION: roles.filter((role) => role.characterType === "MINION").length,
  DEMON: roles.filter((role) => role.characterType === "DEMON").length
});

const sameCounts = (left: RoleCountSet, right: RoleCountSet): boolean =>
  CHARACTER_TYPES.every((type) => left[type] === right[type]);

const snapshotFromRole = (role: RoleDefinition): RoleSetupSnapshot => ({
  roleId: role.roleId,
  characterType: role.characterType,
  defaultAlignment: role.defaultAlignment,
  edition: role.edition,
  setupModifier: {
    outsiderDelta: role.setupModifier.outsiderDelta,
    townsfolkDelta: role.setupModifier.townsfolkDelta
  }
});

type RoleCatalogSignatureInput = {
  readonly scriptId: string;
  readonly edition: string;
  readonly roleCatalogVersion?: string;
  readonly roles: readonly (RoleDefinition | RoleSetupSnapshot)[];
};

const toRoleSetupSnapshot = (role: RoleDefinition | RoleSetupSnapshot): RoleSetupSnapshot => ({
  roleId: role.roleId,
  characterType: role.characterType,
  defaultAlignment: role.defaultAlignment,
  edition: role.edition,
  setupModifier: {
    outsiderDelta: role.setupModifier.outsiderDelta,
    townsfolkDelta: role.setupModifier.townsfolkDelta
  }
});

export const createCanonicalRoleCatalogRoles = (
  roles: readonly (RoleDefinition | RoleSetupSnapshot)[]
): readonly RoleSetupSnapshot[] => roles.map(toRoleSetupSnapshot).sort(compareRoleSetupSnapshot);

export const serializeRoleCatalogCanonical = (catalog: RoleCatalogSignatureInput): string => {
  const roleCatalogVersion = catalog.roleCatalogVersion ?? SUPPORTED_ROLE_CATALOG_VERSION;
  const roleLines = createCanonicalRoleCatalogRoles(catalog.roles).map((role) => [
    role.roleId,
    role.characterType,
    role.defaultAlignment,
    role.edition,
    String(role.setupModifier.outsiderDelta),
    String(role.setupModifier.townsfolkDelta)
  ].join("|"));

  return [
    `scriptId|${catalog.scriptId}`,
    `edition|${catalog.edition}`,
    `roleCatalogVersion|${roleCatalogVersion}`,
    ...roleLines
  ].join("\n");
};

export const calculateRoleCatalogSignature = (catalog: RoleCatalogSignatureInput): string => {
  const serialized = serializeRoleCatalogCanonical(catalog);
  let hash = 0x811c9dc5;
  for (let index = 0; index < serialized.length; index += 1) {
    hash = Math.imul(hash ^ serialized.charCodeAt(index), 0x01000193) >>> 0;
  }

  return `${SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM}:${hash.toString(16).padStart(8, "0")}`;
};

export const createRoleCatalogSnapshot = (script: ScriptDefinition): RoleCatalogSnapshot => {
  const snapshotWithoutSignature = {
    scriptId: script.scriptId,
    edition: script.edition,
    roleCatalogVersion: SUPPORTED_ROLE_CATALOG_VERSION,
    roles: createCanonicalRoleCatalogRoles(script.roles)
  } satisfies Omit<RoleCatalogSnapshot, "canonicalSignature">;

  return {
    ...snapshotWithoutSignature,
    canonicalSignature: calculateRoleCatalogSignature(snapshotWithoutSignature)
  };
};

export const validateScriptDefinitionForSetup = (script: ScriptDefinition): void => {
  if (!isSupportedScriptMetadata(script.scriptId, script.scriptName, script.edition)) {
    throw new Error("Setup generator only supports Sects & Violets script metadata");
  }

  if (script.roles.length !== 25) {
    throw new Error("Setup generator requires a complete 25-role Sects & Violets catalog");
  }

  const roleIds = script.roles.map((role) => role.roleId);
  if (new Set(roleIds).size !== roleIds.length || roleIds.some((roleIdValue) => roleIdValue.trim().length === 0)) {
    throw new Error("Setup generator requires unique non-empty role ids");
  }

  if (script.roles.some((role) => role.nameZh.trim().length === 0 || role.nameEn.trim().length === 0)) {
    throw new Error("Setup generator requires non-empty role names");
  }

  const expectedCounts: RoleCountSet = {
    TOWNSFOLK: 13,
    OUTSIDER: 4,
    MINION: 4,
    DEMON: 4
  };
  if (!sameCounts(roleCountsByType(script.roles), expectedCounts)) {
    throw new Error("Setup generator requires 13/4/4/4 Sects & Violets role counts");
  }

  if (!script.roles.every((role) => validateRoleSetupSnapshot(snapshotFromRole(role)))) {
    throw new Error("Setup generator received invalid role setup metadata");
  }
};

export const isSupportedScriptMetadata = (
  scriptId: string,
  scriptName: string,
  edition: string
): scriptId is SupportedScriptId =>
  scriptId === SUPPORTED_SCRIPT_ID && scriptName === SUPPORTED_SCRIPT_NAME && edition === SUPPORTED_SCRIPT_EDITION;
