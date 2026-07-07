import type { RoleId } from "./ids.js";

export const SUPPORTED_SCRIPT_ID = "sects-and-violets" as const;
export const SUPPORTED_SCRIPT_NAME = "Sects & Violets" as const;
export const SUPPORTED_SCRIPT_EDITION = "sects-and-violets" as const;

export type SupportedScriptId = typeof SUPPORTED_SCRIPT_ID;
export type SupportedScriptName = typeof SUPPORTED_SCRIPT_NAME;
export type SupportedEdition = typeof SUPPORTED_SCRIPT_EDITION;

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

export const isSupportedScriptMetadata = (
  scriptId: string,
  scriptName: string,
  edition: string
): scriptId is SupportedScriptId =>
  scriptId === SUPPORTED_SCRIPT_ID && scriptName === SUPPORTED_SCRIPT_NAME && edition === SUPPORTED_SCRIPT_EDITION;
