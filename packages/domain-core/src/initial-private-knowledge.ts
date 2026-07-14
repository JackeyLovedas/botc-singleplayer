import type { CharacterAssignmentSet } from "./character-assignment.js";
import { cloneRoleSetupSnapshot, validateCharacterAssignments } from "./character-assignment.js";
import { assertNever } from "./errors.js";
import type { PlayerId, RoleId } from "./ids.js";
import type { PlayerRoster } from "./player-roster.js";
import { validatePlayerRoster } from "./player-roster.js";
import type { GeneratedSetup, RoleCatalogSnapshot, RoleSetupSnapshot } from "./setup-types.js";
import {
  CHARACTER_TYPES,
  SUPPORTED_ROLE_CATALOG_SIGNATURE,
  SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM,
  calculateRoleCatalogSignature,
  compareStableId,
  sameRoleSetupSnapshot,
  validateRoleSetupSnapshot
} from "./setup-types.js";
import type { SeatNumber } from "./player-roster.js";
import type { PlayerMathematicianInformationView } from "./mathematician.js";

export const SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION = "first-night-initialization-v1" as const;
export const SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION = "initial-own-character-knowledge-v1" as const;
export const INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE = "OWN_CHARACTER_BOOTSTRAP" as const;
export const INITIAL_KNOWLEDGE_KINDS = [
  "OWN_CHARACTER",
  "DEMON_IDENTITY",
  "MINION_IDENTITIES",
  "DEMON_BLUFFS"
] as const;

export type SupportedFirstNightInitializationVersion = typeof SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION;
export type SupportedInitialKnowledgeModelVersion = typeof SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION;
export type InitialOwnCharacterKnowledgeStage = typeof INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE;
export type PlayerPrivateKnowledgeStage =
  | typeof INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE
  | "MINION_INFORMATION"
  | "DEMON_INFORMATION"
  | "EVIL_TWIN_SETUP_INFORMATION"
  | "CERENOVUS_INFORMATION"
  | "CLOCKMAKER_INFORMATION"
  | "DREAMER_INFORMATION"
  | "SEAMSTRESS_INFORMATION"
  | "MATHEMATICIAN_INFORMATION";

export type FirstNightSession = {
  readonly initializationVersion: SupportedFirstNightInitializationVersion;
  readonly nightNumber: 1;
  readonly rosterVersion: string;
  readonly assignmentAlgorithmVersion: string;
  readonly roleCatalogSignature: string;
};

export type KnownPlayerReference = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
};

export type OwnCharacterKnowledge = {
  readonly kind: "OWN_CHARACTER";
  readonly recipientPlayerId: PlayerId;
  readonly role: RoleSetupSnapshot;
};

export type DemonIdentityKnowledge = {
  readonly kind: "DEMON_IDENTITY";
  readonly recipientPlayerId: PlayerId;
  readonly demon: KnownPlayerReference;
};

export type MinionIdentitiesKnowledge = {
  readonly kind: "MINION_IDENTITIES";
  readonly recipientPlayerId: PlayerId;
  readonly minions: readonly KnownPlayerReference[];
};

export type DemonBluffsKnowledge = {
  readonly kind: "DEMON_BLUFFS";
  readonly recipientPlayerId: PlayerId;
  readonly roles: readonly RoleSetupSnapshot[];
};

export type InitialKnowledgeEntry =
  | OwnCharacterKnowledge
  | DemonIdentityKnowledge
  | MinionIdentitiesKnowledge
  | DemonBluffsKnowledge;

export type InitialOwnCharacterKnowledgeEntry = OwnCharacterKnowledge;

export type DeferredFirstNightTeamKnowledgeEntry =
  | DemonIdentityKnowledge
  | MinionIdentitiesKnowledge
  | DemonBluffsKnowledge;

export type InitialPrivateKnowledge = {
  readonly knowledgeModelVersion: SupportedInitialKnowledgeModelVersion;
  readonly knowledgeStage: InitialOwnCharacterKnowledgeStage;
  readonly entries: readonly InitialOwnCharacterKnowledgeEntry[];
};

export type PlayerPrivateKnowledgeView = {
  readonly viewerPlayerId: PlayerId;
  readonly viewerSeatNumber: SeatNumber;
  readonly viewerDisplayName: string;
  readonly ownCharacter: RoleSetupSnapshot;
  readonly knownDemon?: KnownPlayerReference;
  readonly knownMinions: readonly KnownPlayerReference[];
  readonly evilTwinCounterpart?: KnownPlayerReference;
  readonly cerenovusMadnessInstruction?: PlayerCerenovusMadnessInstructionView;
  readonly dreamerInformation?: PlayerDreamerInformationView;
  readonly clockmakerInformation?: PlayerClockmakerInformationView;
  readonly seamstressInformation?: readonly PlayerSeamstressInformationView[];
  readonly mathematicianInformation?: PlayerMathematicianInformationView;
  readonly demonBluffs: readonly RoleSetupSnapshot[];
  readonly ownCharacterKnowledgeModelVersion: SupportedInitialKnowledgeModelVersion;
  readonly teamKnowledgeModelVersion?: string;
  readonly evilTwinKnowledgeModelVersion?: string;
  readonly cerenovusKnowledgeModelVersion?: "cerenovus-madness-instruction-v1";
  readonly dreamerKnowledgeModelVersion?: string;
  readonly clockmakerKnowledgeModelVersion?: "clockmaker-information-v1";
  readonly seamstressKnowledgeModelVersion?: "seamstress-private-knowledge-v1";
  readonly mathematicianKnowledgeModelVersion?: "mathematician-knowledge-v1";
  readonly deliveredKnowledgeStages: readonly PlayerPrivateKnowledgeStage[];
};

export type PlayerCerenovusMadnessInstructionView = {
  readonly selectedByCharacter: "cerenovus";
  readonly madAboutRoleId: RoleId;
  readonly instructionWindow: "TOMORROW_DAY_AND_NIGHT";
};

export type PlayerDreamerInformationView = {
  readonly target: KnownPlayerReference;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
};

export type PlayerClockmakerInformationView = { readonly distance: 0 | 1 | 2 | 3 | 4 | 5 | 6 };
export type PlayerSeamstressInformationView = {
  readonly targets: readonly [KnownPlayerReference, KnownPlayerReference];
  readonly deliveredAnswer: "YES" | "NO";
};

export type InitialPrivateKnowledgeGenerationFailureCode =
  | "InvalidRoster"
  | "InvalidAssignment"
  | "InvalidSetup"
  | "MissingDemon"
  | "InvalidDemonCount"
  | "InvalidMinionCount"
  | "InvalidDemonBluffs"
  | "InvalidKnowledgeResult";

export type InitialPrivateKnowledgeGenerationFailure = {
  readonly status: "failure";
  readonly failureCode: InitialPrivateKnowledgeGenerationFailureCode;
  readonly message: string;
  readonly conflictingPlayerIds: readonly PlayerId[];
  readonly conflictingRoleIds: readonly RoleId[];
};

export type InitialPrivateKnowledgeGenerationSuccess = {
  readonly status: "success";
  readonly knowledge: InitialPrivateKnowledge;
};

export type InitialPrivateKnowledgeGenerationResult =
  | InitialPrivateKnowledgeGenerationSuccess
  | InitialPrivateKnowledgeGenerationFailure;

export type InitialPrivateKnowledgeGeneratorInput = {
  readonly roster: PlayerRoster;
  readonly assignment: CharacterAssignmentSet;
  readonly setup: GeneratedSetup;
};

export type InitialKnowledgeSourceFacts = {
  readonly roster: unknown;
  readonly assignment: unknown;
  readonly setup: unknown;
  readonly rosterVersion?: unknown;
  readonly assignmentAlgorithmVersion?: unknown;
  readonly roleCatalogSignature?: unknown;
};

export type InitialPrivateKnowledgeValidationInput = InitialKnowledgeSourceFacts & {
  readonly entries: unknown;
};

export type InitialPrivateKnowledgeValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

const KNOWLEDGE_KIND_ORDER: Readonly<Record<InitialKnowledgeEntry["kind"], number>> = {
  OWN_CHARACTER: 0,
  DEMON_IDENTITY: 1,
  MINION_IDENTITIES: 2,
  DEMON_BLUFFS: 3
};

const asciiCompare = (left: string, right: string): number => {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
};

export const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value) as unknown;
  return prototype === Object.prototype || prototype === null;
};

export const hasExactEnumerableKeys = (
  value: Record<string, unknown>,
  expectedKeys: readonly string[]
): boolean => {
  const actual = Object.keys(value).sort(asciiCompare);
  const expected = [...expectedKeys].sort(asciiCompare);
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
};

export const isInitialKnowledgeKind = (value: unknown): value is InitialKnowledgeEntry["kind"] =>
  typeof value === "string" && (INITIAL_KNOWLEDGE_KINDS as readonly string[]).includes(value);

const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      return false;
    }
  }

  return true;
};

const isKnownCharacterType = (value: unknown): value is RoleSetupSnapshot["characterType"] =>
  typeof value === "string" && (CHARACTER_TYPES as readonly string[]).includes(value);

const isKnownDefaultAlignment = (value: unknown): value is RoleSetupSnapshot["defaultAlignment"] =>
  value === "GOOD" || value === "EVIL";

const ROLE_SETUP_SNAPSHOT_KEYS = [
  "roleId",
  "characterType",
  "defaultAlignment",
  "edition",
  "setupModifier"
] as const;
const SETUP_MODIFIER_KEYS = ["outsiderDelta", "townsfolkDelta"] as const;
const KNOWN_PLAYER_REFERENCE_KEYS = ["playerId", "seatNumber"] as const;
const OWN_CHARACTER_KEYS = ["kind", "recipientPlayerId", "role"] as const;
const DEMON_IDENTITY_KEYS = ["kind", "recipientPlayerId", "demon"] as const;
const MINION_IDENTITIES_KEYS = ["kind", "recipientPlayerId", "minions"] as const;
const DEMON_BLUFFS_KEYS = ["kind", "recipientPlayerId", "roles"] as const;
const FIRST_NIGHT_INITIALIZED_PAYLOAD_KEYS = [
  "rulesBaselineVersion",
  "initializationVersion",
  "nightNumber",
  "rosterVersion",
  "assignmentAlgorithmVersion",
  "roleCatalogSignature"
] as const;
const INITIAL_PRIVATE_KNOWLEDGE_PAYLOAD_KEYS = [
  "rulesBaselineVersion",
  "knowledgeModelVersion",
  "knowledgeStage",
  "rosterVersion",
  "assignmentAlgorithmVersion",
  "roleCatalogSignature",
  "entries"
] as const;
const PLAYER_PRIVATE_KNOWLEDGE_VIEW_BASE_KEYS = [
  "deliveredKnowledgeStages",
  "demonBluffs",
  "knownMinions",
  "ownCharacter",
  "ownCharacterKnowledgeModelVersion",
  "viewerDisplayName",
  "viewerPlayerId",
  "viewerSeatNumber"
] as const;
const PLAYER_PRIVATE_KNOWLEDGE_STAGE_ORDER = [
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  "MINION_INFORMATION",
  "DEMON_INFORMATION",
  "EVIL_TWIN_SETUP_INFORMATION",
  "CERENOVUS_INFORMATION",
  "CLOCKMAKER_INFORMATION",
  "DREAMER_INFORMATION",
  "SEAMSTRESS_INFORMATION",
  "MATHEMATICIAN_INFORMATION"
] as const;
const SUPPORTED_PRIVATE_VIEW_TEAM_KNOWLEDGE_MODEL_VERSION = "first-night-team-knowledge-v1" as const;
const SUPPORTED_PRIVATE_VIEW_EVIL_TWIN_KNOWLEDGE_MODEL_VERSION = "evil-twin-knowledge-model-v1" as const;
const SUPPORTED_PRIVATE_VIEW_CERENOVUS_KNOWLEDGE_MODEL_VERSION = "cerenovus-madness-instruction-v1" as const;
const SUPPORTED_PRIVATE_VIEW_DREAMER_KNOWLEDGE_MODEL_VERSION = "dreamer-information-model-v1" as const;
const SUPPORTED_PRIVATE_VIEW_DREAMER_V2_KNOWLEDGE_MODEL_VERSION = "dreamer-information-model-v2" as const;
const SUPPORTED_PRIVATE_VIEW_CLOCKMAKER_KNOWLEDGE_MODEL_VERSION = "clockmaker-information-v1" as const;
const SUPPORTED_PRIVATE_VIEW_SEAMSTRESS_KNOWLEDGE_MODEL_VERSION = "seamstress-private-knowledge-v1" as const;
const SUPPORTED_PRIVATE_VIEW_MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION = "mathematician-knowledge-v1" as const;

export const hasExactRoleSetupSnapshotShape = (value: unknown): value is RoleSetupSnapshot => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ROLE_SETUP_SNAPSHOT_KEYS)) {
    return false;
  }

  const setupModifier = value.setupModifier;
  if (!isPlainRecord(setupModifier) || !hasExactEnumerableKeys(setupModifier, SETUP_MODIFIER_KEYS)) {
    return false;
  }

  if (
    typeof value.roleId !== "string" ||
    value.roleId.trim().length === 0 ||
    !isKnownCharacterType(value.characterType) ||
    !isKnownDefaultAlignment(value.defaultAlignment) ||
    typeof value.edition !== "string" ||
    typeof setupModifier.outsiderDelta !== "number" ||
    typeof setupModifier.townsfolkDelta !== "number"
  ) {
    return false;
  }

  return validateRoleSetupSnapshot(value as RoleSetupSnapshot);
};

export const hasExactKnownPlayerReferenceShape = (value: unknown): value is KnownPlayerReference => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, KNOWN_PLAYER_REFERENCE_KEYS)) {
    return false;
  }

  return (
    typeof value.playerId === "string" &&
    value.playerId.trim().length > 0 &&
    typeof value.seatNumber === "number" &&
    Number.isInteger(value.seatNumber) &&
    value.seatNumber >= 1 &&
    value.seatNumber <= 12
  );
};

const roleListIsAsciiSorted = (roles: readonly RoleSetupSnapshot[]): boolean =>
  roles.every((role, index) => index === 0 || compareStableId(roles[index - 1]?.roleId ?? "", role.roleId) < 0);

export const cloneKnownPlayerReference = (reference: KnownPlayerReference): KnownPlayerReference => ({
  playerId: reference.playerId,
  seatNumber: reference.seatNumber
});

export const cloneInitialKnowledgeEntry = (entry: InitialKnowledgeEntry): InitialKnowledgeEntry => {
  switch (entry.kind) {
    case "OWN_CHARACTER":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        role: cloneRoleSetupSnapshot(entry.role)
      };

    case "DEMON_IDENTITY":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        demon: cloneKnownPlayerReference(entry.demon)
      };

    case "MINION_IDENTITIES":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        minions: entry.minions.map(cloneKnownPlayerReference)
      };

    case "DEMON_BLUFFS":
      return {
        kind: entry.kind,
        recipientPlayerId: entry.recipientPlayerId,
        roles: entry.roles.map(cloneRoleSetupSnapshot)
      };

    default:
      return assertNever(entry);
  }
};

export const cloneInitialOwnCharacterKnowledgeEntry = (
  entry: InitialOwnCharacterKnowledgeEntry
): InitialOwnCharacterKnowledgeEntry => ({
  kind: entry.kind,
  recipientPlayerId: entry.recipientPlayerId,
  role: cloneRoleSetupSnapshot(entry.role)
});

export const cloneInitialPrivateKnowledge = (knowledge: InitialPrivateKnowledge): InitialPrivateKnowledge => ({
  knowledgeModelVersion: knowledge.knowledgeModelVersion,
  knowledgeStage: knowledge.knowledgeStage,
  entries: knowledge.entries.map(cloneInitialOwnCharacterKnowledgeEntry)
});

const fail = (reason: string): InitialPrivateKnowledgeValidationResult => ({ valid: false, reason });

const knownPlayerReferencesAreSortedAndUnique = (references: readonly KnownPlayerReference[]): boolean => {
  const playerIds = new Set<PlayerId>();
  const seatNumbers = new Set<SeatNumber>();
  for (const [index, reference] of references.entries()) {
    if (index > 0 && (references[index - 1]?.seatNumber ?? 0) >= reference.seatNumber) {
      return false;
    }

    if (playerIds.has(reference.playerId) || seatNumbers.has(reference.seatNumber)) {
      return false;
    }

    playerIds.add(reference.playerId);
    seatNumbers.add(reference.seatNumber);
  }

  return true;
};

const validatePrivateKnowledgeViewStages = (
  stages: unknown,
  hasTeamKnowledgeModelVersion: boolean,
  hasEvilTwinKnowledgeModelVersion: boolean,
  hasEvilTwinCounterpart: boolean,
  hasCerenovusKnowledgeModelVersion: boolean,
  hasCerenovusMadnessInstruction: boolean,
  hasClockmakerKnowledgeModelVersion: boolean,
  hasClockmakerInformation: boolean,
  hasDreamerKnowledgeModelVersion: boolean,
  hasDreamerInformation: boolean,
  hasSeamstressKnowledgeModelVersion: boolean,
  hasSeamstressInformation: boolean,
  hasMathematicianKnowledgeModelVersion: boolean,
  hasMathematicianInformation: boolean
): InitialPrivateKnowledgeValidationResult => {
  if (!Array.isArray(stages) || !isDenseArray(stages)) {
    return fail("PlayerPrivateKnowledgeView deliveredKnowledgeStages must be a dense array");
  }

  const stageValues = stages as readonly unknown[];
  if (
    stageValues.length === 0 ||
    stageValues.some((stage) => !PLAYER_PRIVATE_KNOWLEDGE_STAGE_ORDER.includes(stage as PlayerPrivateKnowledgeStage))
  ) {
    return fail("PlayerPrivateKnowledgeView deliveredKnowledgeStages contains unsupported values");
  }

  if (stageValues[0] !== INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE) {
    return fail("PlayerPrivateKnowledgeView deliveredKnowledgeStages must start with OWN_CHARACTER_BOOTSTRAP");
  }

  const uniqueStages = new Set(stageValues);
  if (uniqueStages.size !== stageValues.length) {
    return fail("PlayerPrivateKnowledgeView deliveredKnowledgeStages must not contain duplicates");
  }

  for (const [index, stage] of stageValues.entries()) {
    const previous = stageValues[index - 1];
    if (
      previous !== undefined &&
      PLAYER_PRIVATE_KNOWLEDGE_STAGE_ORDER.indexOf(previous as PlayerPrivateKnowledgeStage) >=
        PLAYER_PRIVATE_KNOWLEDGE_STAGE_ORDER.indexOf(stage as PlayerPrivateKnowledgeStage)
    ) {
      return fail("PlayerPrivateKnowledgeView deliveredKnowledgeStages must use canonical order");
    }
  }

  const hasTeamStages = stageValues.some((stage) => stage === "MINION_INFORMATION" || stage === "DEMON_INFORMATION");
  if (hasTeamKnowledgeModelVersion !== hasTeamStages) {
    return fail("PlayerPrivateKnowledgeView teamKnowledgeModelVersion must be present exactly when team stages are delivered");
  }

  const hasEvilTwinStage = stageValues.some((stage) => stage === "EVIL_TWIN_SETUP_INFORMATION");
  if (hasEvilTwinKnowledgeModelVersion !== hasEvilTwinStage || hasEvilTwinCounterpart !== hasEvilTwinStage) {
    return fail("PlayerPrivateKnowledgeView Evil Twin counterpart and model version must be present exactly when Evil Twin information is delivered");
  }

  const hasDreamerStage = stageValues.some((stage) => stage === "DREAMER_INFORMATION");
  if (hasDreamerKnowledgeModelVersion !== hasDreamerStage || hasDreamerInformation !== hasDreamerStage) {
    return fail("PlayerPrivateKnowledgeView Dreamer information and model version must be present exactly when Dreamer information is delivered");
  }

  const hasClockmakerStage = stageValues.some((stage) => stage === "CLOCKMAKER_INFORMATION");
  if (hasClockmakerKnowledgeModelVersion !== hasClockmakerStage || hasClockmakerInformation !== hasClockmakerStage) {
    return fail("PlayerPrivateKnowledgeView Clockmaker information and model version must be present exactly when Clockmaker information is delivered");
  }

  const hasCerenovusStage = stageValues.some((stage) => stage === "CERENOVUS_INFORMATION");
  if (hasCerenovusKnowledgeModelVersion !== hasCerenovusStage || hasCerenovusMadnessInstruction !== hasCerenovusStage) {
    return fail("PlayerPrivateKnowledgeView Cerenovus notification and model version must be present exactly when Cerenovus information is delivered");
  }

  const hasSeamstressStage = stageValues.some((stage) => stage === "SEAMSTRESS_INFORMATION");
  if (hasSeamstressKnowledgeModelVersion !== hasSeamstressStage || hasSeamstressInformation !== hasSeamstressStage) {
    return fail("PlayerPrivateKnowledgeView Seamstress information and model version must be present exactly when Seamstress information is delivered");
  }

  const hasMathematicianStage = stageValues.some((stage) => stage === "MATHEMATICIAN_INFORMATION");
  if (hasMathematicianKnowledgeModelVersion !== hasMathematicianStage || hasMathematicianInformation !== hasMathematicianStage) {
    return fail("PlayerPrivateKnowledgeView Mathematician information and model version must be present exactly when Mathematician information is delivered");
  }

  return { valid: true };
};

const hasExactDreamerInformationViewShape = (value: unknown): value is PlayerDreamerInformationView => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["evilRole", "goodRole", "target"])) {
    return false;
  }

  return (
    hasExactKnownPlayerReferenceShape(value.target) &&
    hasExactRoleSetupSnapshotShape(value.goodRole) &&
    hasExactRoleSetupSnapshotShape(value.evilRole) &&
    value.goodRole.defaultAlignment === "GOOD" &&
    value.evilRole.defaultAlignment === "EVIL"
  );
};

const hasExactClockmakerInformationViewShape = (value: unknown): value is PlayerClockmakerInformationView =>
  isPlainRecord(value) && hasExactEnumerableKeys(value, ["distance"]) && typeof value.distance === "number" &&
  Number.isSafeInteger(value.distance) && value.distance >= 0 && value.distance <= 6;

const hasExactMathematicianInformationViewShape = (value: unknown): value is PlayerMathematicianInformationView =>
  isPlainRecord(value) && hasExactEnumerableKeys(value, ["count"]) && typeof value.count === "number" &&
  Number.isSafeInteger(value.count) && value.count >= 0 && value.count <= 11;

const hasExactCerenovusMadnessInstructionViewShape = (value: unknown): value is PlayerCerenovusMadnessInstructionView => {
  return isPlainRecord(value) &&
    hasExactEnumerableKeys(value, ["instructionWindow", "madAboutRoleId", "selectedByCharacter"]) &&
    value.selectedByCharacter === "cerenovus" &&
    typeof value.madAboutRoleId === "string" && value.madAboutRoleId.length > 0 &&
    value.instructionWindow === "TOMORROW_DAY_AND_NIGHT";
};

const hasExactSeamstressInformationHistoryShape = (
  value: unknown,
  viewerPlayerId: unknown,
  viewerSeatNumber: unknown
): value is readonly PlayerSeamstressInformationView[] => {
  if (!Array.isArray(value) || !isDenseArray(value) || value.length === 0) return false;
  return value.every((entry) => {
    if (!isPlainRecord(entry) || !hasExactEnumerableKeys(entry, ["deliveredAnswer", "targets"]) ||
        (entry.deliveredAnswer !== "YES" && entry.deliveredAnswer !== "NO") ||
        !Array.isArray(entry.targets) || !isDenseArray(entry.targets) || entry.targets.length !== 2 ||
        !hasExactKnownPlayerReferenceShape(entry.targets[0]) || !hasExactKnownPlayerReferenceShape(entry.targets[1])) return false;
    const first = entry.targets[0];
    const second = entry.targets[1];
    return first.playerId !== second.playerId && first.seatNumber < second.seatNumber &&
      first.playerId !== viewerPlayerId && second.playerId !== viewerPlayerId &&
      first.seatNumber !== viewerSeatNumber && second.seatNumber !== viewerSeatNumber;
  });
};

export const validatePlayerPrivateKnowledgeViewShape = (
  value: unknown
): InitialPrivateKnowledgeValidationResult => {
  if (!isPlainRecord(value)) {
    return fail("PlayerPrivateKnowledgeView must be a non-null plain object");
  }

  const optionalKeys = [
    ...(Object.hasOwn(value, "knownDemon") ? ["knownDemon"] : []),
    ...(Object.hasOwn(value, "teamKnowledgeModelVersion") ? ["teamKnowledgeModelVersion"] : []),
    ...(Object.hasOwn(value, "evilTwinCounterpart") ? ["evilTwinCounterpart"] : []),
    ...(Object.hasOwn(value, "evilTwinKnowledgeModelVersion") ? ["evilTwinKnowledgeModelVersion"] : []),
    ...(Object.hasOwn(value, "cerenovusMadnessInstruction") ? ["cerenovusMadnessInstruction"] : []),
    ...(Object.hasOwn(value, "cerenovusKnowledgeModelVersion") ? ["cerenovusKnowledgeModelVersion"] : []),
    ...(Object.hasOwn(value, "dreamerInformation") ? ["dreamerInformation"] : []),
    ...(Object.hasOwn(value, "dreamerKnowledgeModelVersion") ? ["dreamerKnowledgeModelVersion"] : []),
    ...(Object.hasOwn(value, "clockmakerInformation") ? ["clockmakerInformation"] : []),
    ...(Object.hasOwn(value, "clockmakerKnowledgeModelVersion") ? ["clockmakerKnowledgeModelVersion"] : []),
    ...(Object.hasOwn(value, "seamstressInformation") ? ["seamstressInformation"] : []),
    ...(Object.hasOwn(value, "seamstressKnowledgeModelVersion") ? ["seamstressKnowledgeModelVersion"] : [])
    ,...(Object.hasOwn(value, "mathematicianInformation") ? ["mathematicianInformation"] : [])
    ,...(Object.hasOwn(value, "mathematicianKnowledgeModelVersion") ? ["mathematicianKnowledgeModelVersion"] : [])
  ];
  if (!hasExactEnumerableKeys(value, [...PLAYER_PRIVATE_KNOWLEDGE_VIEW_BASE_KEYS, ...optionalKeys])) {
    return fail("PlayerPrivateKnowledgeView must have exact runtime shape");
  }

  if (
    typeof value.viewerPlayerId !== "string" ||
    value.viewerPlayerId.trim().length === 0 ||
    typeof value.viewerSeatNumber !== "number" ||
    !Number.isInteger(value.viewerSeatNumber) ||
    value.viewerSeatNumber < 1 ||
    value.viewerSeatNumber > 12 ||
    typeof value.viewerDisplayName !== "string" ||
    value.viewerDisplayName.trim().length === 0 ||
    !hasExactRoleSetupSnapshotShape(value.ownCharacter) ||
    value.ownCharacterKnowledgeModelVersion !== SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION
  ) {
    return fail("PlayerPrivateKnowledgeView primitive fields must use supported values");
  }

  if (Object.hasOwn(value, "knownDemon") && !hasExactKnownPlayerReferenceShape(value.knownDemon)) {
    return fail("PlayerPrivateKnowledgeView knownDemon must have exact runtime shape");
  }

  if (Object.hasOwn(value, "evilTwinCounterpart") && !hasExactKnownPlayerReferenceShape(value.evilTwinCounterpart)) {
    return fail("PlayerPrivateKnowledgeView evilTwinCounterpart must have exact runtime shape");
  }

  if (Object.hasOwn(value, "dreamerInformation") && !hasExactDreamerInformationViewShape(value.dreamerInformation)) {
    return fail("PlayerPrivateKnowledgeView dreamerInformation must have exact runtime shape");
  }

  if (Object.hasOwn(value, "clockmakerInformation") && !hasExactClockmakerInformationViewShape(value.clockmakerInformation)) {
    return fail("PlayerPrivateKnowledgeView clockmakerInformation must have exact runtime shape");
  }

  if (Object.hasOwn(value, "mathematicianInformation") && !hasExactMathematicianInformationViewShape(value.mathematicianInformation)) {
    return fail("PlayerPrivateKnowledgeView mathematicianInformation must have exact runtime shape");
  }

  if (Object.hasOwn(value, "cerenovusMadnessInstruction") && !hasExactCerenovusMadnessInstructionViewShape(value.cerenovusMadnessInstruction)) {
    return fail("PlayerPrivateKnowledgeView cerenovusMadnessInstruction must have exact runtime shape");
  }

  if (Object.hasOwn(value, "seamstressInformation") &&
      !hasExactSeamstressInformationHistoryShape(value.seamstressInformation, value.viewerPlayerId, value.viewerSeatNumber)) {
    return fail("PlayerPrivateKnowledgeView seamstressInformation must be a dense non-empty exact history");
  }

  if (
    Object.hasOwn(value, "evilTwinCounterpart") &&
    ((value.evilTwinCounterpart as KnownPlayerReference).playerId === value.viewerPlayerId ||
      (value.evilTwinCounterpart as KnownPlayerReference).seatNumber === value.viewerSeatNumber)
  ) {
    return fail("PlayerPrivateKnowledgeView evilTwinCounterpart must not be the viewer");
  }

  if (
    Object.hasOwn(value, "dreamerInformation") &&
    (((value.dreamerInformation as PlayerDreamerInformationView).target.playerId === value.viewerPlayerId) ||
      ((value.dreamerInformation as PlayerDreamerInformationView).target.seatNumber === value.viewerSeatNumber))
  ) {
    return fail("PlayerPrivateKnowledgeView dreamerInformation target must not be the viewer");
  }

  if (
    !Array.isArray(value.knownMinions) ||
    !isDenseArray(value.knownMinions) ||
    value.knownMinions.length > 2 ||
    value.knownMinions.some((minion) => !hasExactKnownPlayerReferenceShape(minion)) ||
    !knownPlayerReferencesAreSortedAndUnique(value.knownMinions as readonly KnownPlayerReference[])
  ) {
    return fail("PlayerPrivateKnowledgeView knownMinions must be dense, sorted, and unique known player references");
  }

  if (
    Object.hasOwn(value, "knownDemon") &&
    (value.knownMinions as readonly KnownPlayerReference[]).some((minion) =>
      minion.playerId === (value.knownDemon as KnownPlayerReference).playerId ||
      minion.seatNumber === (value.knownDemon as KnownPlayerReference).seatNumber
    )
  ) {
    return fail("PlayerPrivateKnowledgeView knownDemon must not appear in knownMinions");
  }

  if (
    !Array.isArray(value.demonBluffs) ||
    !isDenseArray(value.demonBluffs) ||
    value.demonBluffs.length > 3 ||
    value.demonBluffs.some((role) => !hasExactRoleSetupSnapshotShape(role)) ||
    !roleListIsAsciiSorted(value.demonBluffs as readonly RoleSetupSnapshot[])
  ) {
    return fail("PlayerPrivateKnowledgeView demonBluffs must be dense, sorted, and exact role snapshots");
  }

  const hasTeamKnowledgeModelVersion = Object.hasOwn(value, "teamKnowledgeModelVersion");
  if (
    hasTeamKnowledgeModelVersion &&
    value.teamKnowledgeModelVersion !== SUPPORTED_PRIVATE_VIEW_TEAM_KNOWLEDGE_MODEL_VERSION
  ) {
    return fail("PlayerPrivateKnowledgeView teamKnowledgeModelVersion must be supported");
  }

  const hasEvilTwinKnowledgeModelVersion = Object.hasOwn(value, "evilTwinKnowledgeModelVersion");
  if (
    hasEvilTwinKnowledgeModelVersion &&
    value.evilTwinKnowledgeModelVersion !== SUPPORTED_PRIVATE_VIEW_EVIL_TWIN_KNOWLEDGE_MODEL_VERSION
  ) {
    return fail("PlayerPrivateKnowledgeView evilTwinKnowledgeModelVersion must be supported");
  }

  const hasDreamerKnowledgeModelVersion = Object.hasOwn(value, "dreamerKnowledgeModelVersion");
  if (
    hasDreamerKnowledgeModelVersion &&
    value.dreamerKnowledgeModelVersion !== SUPPORTED_PRIVATE_VIEW_DREAMER_KNOWLEDGE_MODEL_VERSION &&
    value.dreamerKnowledgeModelVersion !== SUPPORTED_PRIVATE_VIEW_DREAMER_V2_KNOWLEDGE_MODEL_VERSION
  ) {
    return fail("PlayerPrivateKnowledgeView dreamerKnowledgeModelVersion must be supported");
  }

  const hasClockmakerKnowledgeModelVersion = Object.hasOwn(value, "clockmakerKnowledgeModelVersion");
  if (hasClockmakerKnowledgeModelVersion && value.clockmakerKnowledgeModelVersion !== SUPPORTED_PRIVATE_VIEW_CLOCKMAKER_KNOWLEDGE_MODEL_VERSION) {
    return fail("PlayerPrivateKnowledgeView clockmakerKnowledgeModelVersion must be supported");
  }

  const hasCerenovusKnowledgeModelVersion = Object.hasOwn(value, "cerenovusKnowledgeModelVersion");
  if (hasCerenovusKnowledgeModelVersion &&
      value.cerenovusKnowledgeModelVersion !== SUPPORTED_PRIVATE_VIEW_CERENOVUS_KNOWLEDGE_MODEL_VERSION) {
    return fail("PlayerPrivateKnowledgeView cerenovusKnowledgeModelVersion must be supported");
  }

  const hasSeamstressKnowledgeModelVersion = Object.hasOwn(value, "seamstressKnowledgeModelVersion");
  if (hasSeamstressKnowledgeModelVersion &&
      value.seamstressKnowledgeModelVersion !== SUPPORTED_PRIVATE_VIEW_SEAMSTRESS_KNOWLEDGE_MODEL_VERSION) {
    return fail("PlayerPrivateKnowledgeView seamstressKnowledgeModelVersion must be supported");
  }

  const hasMathematicianKnowledgeModelVersion = Object.hasOwn(value, "mathematicianKnowledgeModelVersion");
  if (hasMathematicianKnowledgeModelVersion &&
      value.mathematicianKnowledgeModelVersion !== SUPPORTED_PRIVATE_VIEW_MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION) {
    return fail("PlayerPrivateKnowledgeView mathematicianKnowledgeModelVersion must be supported");
  }

  return validatePrivateKnowledgeViewStages(
    value.deliveredKnowledgeStages,
    hasTeamKnowledgeModelVersion,
    hasEvilTwinKnowledgeModelVersion,
    Object.hasOwn(value, "evilTwinCounterpart"),
    hasCerenovusKnowledgeModelVersion,
    Object.hasOwn(value, "cerenovusMadnessInstruction"),
    hasClockmakerKnowledgeModelVersion,
    Object.hasOwn(value, "clockmakerInformation"),
    hasDreamerKnowledgeModelVersion,
    Object.hasOwn(value, "dreamerInformation"),
    hasSeamstressKnowledgeModelVersion,
    Object.hasOwn(value, "seamstressInformation"),
    hasMathematicianKnowledgeModelVersion,
    Object.hasOwn(value, "mathematicianInformation")
  );
};

type InitialKnowledgeEntryShapeValidationResult =
  | { readonly valid: true; readonly entries: readonly InitialKnowledgeEntry[] }
  | { readonly valid: false; readonly reason: string };

export const parsePrivateKnowledgeEntryShape = (
  entry: unknown
): InitialKnowledgeEntry | InitialPrivateKnowledgeValidationResult => {
  if (!isPlainRecord(entry)) {
    return fail("initial private knowledge entry must be a non-null plain object");
  }

  if (typeof entry.kind !== "string") {
    return fail("initial private knowledge entry kind must be a string");
  }

  if (!isInitialKnowledgeKind(entry.kind)) {
    return fail("unknown initial private knowledge kind");
  }

  switch (entry.kind) {
    case "OWN_CHARACTER":
      if (
        !hasExactEnumerableKeys(entry, OWN_CHARACTER_KEYS) ||
        typeof entry.recipientPlayerId !== "string" ||
        entry.recipientPlayerId.trim().length === 0 ||
        !hasExactRoleSetupSnapshotShape(entry.role)
      ) {
        return fail("OWN_CHARACTER entry must have exact runtime shape");
      }
      return entry as unknown as OwnCharacterKnowledge;

    case "DEMON_IDENTITY":
      if (
        !hasExactEnumerableKeys(entry, DEMON_IDENTITY_KEYS) ||
        typeof entry.recipientPlayerId !== "string" ||
        entry.recipientPlayerId.trim().length === 0 ||
        !hasExactKnownPlayerReferenceShape(entry.demon)
      ) {
        return fail("DEMON_IDENTITY entry must have exact runtime shape");
      }
      return entry as unknown as DemonIdentityKnowledge;

    case "MINION_IDENTITIES":
      if (
        !hasExactEnumerableKeys(entry, MINION_IDENTITIES_KEYS) ||
        typeof entry.recipientPlayerId !== "string" ||
        entry.recipientPlayerId.trim().length === 0 ||
        !Array.isArray(entry.minions) ||
        !isDenseArray(entry.minions) ||
        entry.minions.some((reference) => !hasExactKnownPlayerReferenceShape(reference))
      ) {
        return fail("MINION_IDENTITIES entry must have exact runtime shape");
      }
      return entry as unknown as MinionIdentitiesKnowledge;

    case "DEMON_BLUFFS":
      if (
        !hasExactEnumerableKeys(entry, DEMON_BLUFFS_KEYS) ||
        typeof entry.recipientPlayerId !== "string" ||
        entry.recipientPlayerId.trim().length === 0 ||
        !Array.isArray(entry.roles) ||
        !isDenseArray(entry.roles) ||
        entry.roles.some((role) => !hasExactRoleSetupSnapshotShape(role))
      ) {
        return fail("DEMON_BLUFFS entry must have exact runtime shape");
      }
      return entry as unknown as DemonBluffsKnowledge;

    default:
      return assertNever(entry.kind);
  }
};

const parseInitialKnowledgeEntryShapes = (entries: unknown): InitialKnowledgeEntryShapeValidationResult => {
  if (!Array.isArray(entries)) {
    return { valid: false, reason: "initial private knowledge entries must be a real array" };
  }

  if (!isDenseArray(entries)) {
    return { valid: false, reason: "initial private knowledge entries array must not contain sparse holes" };
  }

  const parsed: InitialKnowledgeEntry[] = [];
  for (const entry of entries) {
    const result = parsePrivateKnowledgeEntryShape(entry);
    if ("valid" in result) {
      if (result.valid) {
        return { valid: false, reason: "initial private knowledge entry parser returned no entry" };
      }

      return result;
    }

    parsed.push(result);
  }

  return { valid: true, entries: parsed };
};

const hasExactRosterEntryShape = (value: unknown): boolean => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["displayName", "playerId", "playerKind", "seatNumber"])) {
    return false;
  }

  return (
    typeof value.playerId === "string" &&
    value.playerId.trim().length > 0 &&
    typeof value.displayName === "string" &&
    (value.playerKind === "HUMAN" || value.playerKind === "AI") &&
    typeof value.seatNumber === "number" &&
    Number.isInteger(value.seatNumber) &&
    value.seatNumber >= 1 &&
    value.seatNumber <= 12
  );
};

const hasExactAssignmentShape = (value: unknown): boolean => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["playerId", "role", "seatNumber"])) {
    return false;
  }

  return (
    typeof value.playerId === "string" &&
    value.playerId.trim().length > 0 &&
    typeof value.seatNumber === "number" &&
    Number.isInteger(value.seatNumber) &&
    value.seatNumber >= 1 &&
    value.seatNumber <= 12 &&
    hasExactRoleSetupSnapshotShape(value.role)
  );
};

const validateRoleSetupSnapshotArray = (
  value: unknown,
  label: string
): InitialPrivateKnowledgeValidationResult => {
  if (!Array.isArray(value)) {
    return fail(`${label} must be a real array`);
  }

  if (!isDenseArray(value)) {
    return fail(`${label} must not contain sparse holes`);
  }

  for (const role of value) {
    if (!hasExactRoleSetupSnapshotShape(role)) {
      return fail(`${label} must contain exact RoleSetupSnapshot objects`);
    }
  }

  return { valid: true };
};

const requireCatalogRole = (
  catalogByRoleId: ReadonlyMap<RoleId, RoleSetupSnapshot>,
  role: RoleSetupSnapshot,
  message: string
): InitialPrivateKnowledgeValidationResult => {
  const catalogRole = catalogByRoleId.get(role.roleId);
  if (catalogRole === undefined || !sameRoleSetupSnapshot(role, catalogRole)) {
    return fail(message);
  }

  return { valid: true };
};

export const validateInitialKnowledgeSourceFacts = (
  sourceFacts: InitialKnowledgeSourceFacts
): InitialPrivateKnowledgeValidationResult => {
  if (!Array.isArray(sourceFacts.roster) || !isDenseArray(sourceFacts.roster)) {
    return fail("roster must be a dense array");
  }

  if (sourceFacts.roster.some((entry) => !hasExactRosterEntryShape(entry))) {
    return fail("roster entries must have exact runtime shape");
  }

  const roster = sourceFacts.roster as PlayerRoster;
  const rosterValidation = validatePlayerRoster(roster);
  if (!rosterValidation.valid) {
    return fail(rosterValidation.reason);
  }

  if (!isPlainRecord(sourceFacts.setup)) {
    return fail("setup must be a non-null plain object");
  }

  const setupRecord = sourceFacts.setup;
  if (
    typeof setupRecord.roleCatalogSignature !== "string" ||
    typeof setupRecord.roleCatalogSignatureAlgorithm !== "string" ||
    !isPlainRecord(setupRecord.roleCatalogSnapshot)
  ) {
    return fail("setup role catalog metadata must have exact runtime shape");
  }

  const roleCatalogSnapshot = setupRecord.roleCatalogSnapshot;
  if (
    typeof roleCatalogSnapshot.scriptId !== "string" ||
    typeof roleCatalogSnapshot.edition !== "string" ||
    typeof roleCatalogSnapshot.roleCatalogVersion !== "string" ||
    typeof roleCatalogSnapshot.canonicalSignature !== "string"
  ) {
    return fail("roleCatalogSnapshot metadata must have exact runtime shape");
  }

  const catalogRolesValidation = validateRoleSetupSnapshotArray(roleCatalogSnapshot.roles, "roleCatalogSnapshot.roles");
  if (!catalogRolesValidation.valid) {
    return catalogRolesValidation;
  }

  const actualRolesValidation = validateRoleSetupSnapshotArray(setupRecord.actualRoles, "setup.actualRoles");
  if (!actualRolesValidation.valid) {
    return actualRolesValidation;
  }

  if (!hasExactRoleSetupSnapshotShape(setupRecord.demonRole)) {
    return fail("setup.demonRole must have exact RoleSetupSnapshot shape");
  }

  const demonBluffsValidation = validateRoleSetupSnapshotArray(setupRecord.demonBluffs, "setup.demonBluffs");
  if (!demonBluffsValidation.valid) {
    return demonBluffsValidation;
  }

  const setup = sourceFacts.setup as GeneratedSetup;
  const recalculatedSignature = calculateRoleCatalogSignature(roleCatalogSnapshot as unknown as RoleCatalogSnapshot);
  if (
    setup.roleCatalogSignatureAlgorithm !== SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM ||
    setup.roleCatalogSignature !== SUPPORTED_ROLE_CATALOG_SIGNATURE ||
    roleCatalogSnapshot.canonicalSignature !== setup.roleCatalogSignature ||
    recalculatedSignature !== setup.roleCatalogSignature
  ) {
    return fail("setup role catalog signature must match the supported exact catalog");
  }

  const catalogByRoleId = new Map<RoleId, RoleSetupSnapshot>(setup.roleCatalogSnapshot.roles.map((role) => [role.roleId, role]));
  for (const role of setup.actualRoles) {
    const catalogValidation = requireCatalogRole(catalogByRoleId, role, "setup.actualRoles must match roleCatalogSnapshot");
    if (!catalogValidation.valid) {
      return catalogValidation;
    }
  }

  const demonCatalogValidation = requireCatalogRole(catalogByRoleId, setup.demonRole, "setup.demonRole must match roleCatalogSnapshot");
  if (!demonCatalogValidation.valid) {
    return demonCatalogValidation;
  }

  for (const role of setup.demonBluffs) {
    const catalogValidation = requireCatalogRole(catalogByRoleId, role, "setup.demonBluffs must match roleCatalogSnapshot");
    if (!catalogValidation.valid) {
      return catalogValidation;
    }
  }

  if (!Array.isArray(sourceFacts.assignment) || !isDenseArray(sourceFacts.assignment)) {
    return fail("assignment must be a dense array");
  }

  if (sourceFacts.assignment.some((assignment) => !hasExactAssignmentShape(assignment))) {
    return fail("assignment entries must have exact runtime shape");
  }

  const assignmentValidation = validateCharacterAssignments({
    assignments: sourceFacts.assignment as CharacterAssignmentSet,
    roster,
    actualRoles: setup.actualRoles,
    roleCatalogRoles: setup.roleCatalogSnapshot.roles
  });
  if (!assignmentValidation.valid) {
    return fail(assignmentValidation.reason);
  }

  return { valid: true };
};

export const validateFirstNightInitializedPayloadShape = (
  value: unknown
): InitialPrivateKnowledgeValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, FIRST_NIGHT_INITIALIZED_PAYLOAD_KEYS)) {
    return fail("FirstNightInitialized payload must have exact runtime shape");
  }

  if (
    typeof value.rulesBaselineVersion !== "string" ||
    typeof value.initializationVersion !== "string" ||
    value.nightNumber !== 1 ||
    typeof value.rosterVersion !== "string" ||
    typeof value.assignmentAlgorithmVersion !== "string" ||
    typeof value.roleCatalogSignature !== "string"
  ) {
    return fail("FirstNightInitialized payload fields must have supported primitive types");
  }

  return { valid: true };
};

export const validateInitialOwnCharacterKnowledgePayload = (
  value: unknown,
  sourceFacts: InitialKnowledgeSourceFacts
): InitialPrivateKnowledgeValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, INITIAL_PRIVATE_KNOWLEDGE_PAYLOAD_KEYS)) {
    return fail("InitialPrivateKnowledgeEstablished payload must have exact runtime shape");
  }

  if (
    typeof value.rulesBaselineVersion !== "string" ||
    typeof value.knowledgeModelVersion !== "string" ||
    typeof value.knowledgeStage !== "string" ||
    typeof value.rosterVersion !== "string" ||
    typeof value.assignmentAlgorithmVersion !== "string" ||
    typeof value.roleCatalogSignature !== "string"
  ) {
    return fail("InitialPrivateKnowledgeEstablished payload fields must have supported primitive types");
  }

  if (value.knowledgeModelVersion !== SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION) {
    return fail("InitialPrivateKnowledgeEstablished knowledge model version must be supported");
  }

  if (value.knowledgeStage !== INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE) {
    return fail("InitialPrivateKnowledgeEstablished knowledgeStage must be OWN_CHARACTER_BOOTSTRAP");
  }

  if (
    (sourceFacts.rosterVersion !== undefined && value.rosterVersion !== sourceFacts.rosterVersion) ||
    (sourceFacts.assignmentAlgorithmVersion !== undefined && value.assignmentAlgorithmVersion !== sourceFacts.assignmentAlgorithmVersion) ||
    (sourceFacts.roleCatalogSignature !== undefined && value.roleCatalogSignature !== sourceFacts.roleCatalogSignature)
  ) {
    return fail("InitialPrivateKnowledgeEstablished metadata must match roster, assignment, and setup facts");
  }

  return validateInitialOwnCharacterKnowledgeEntries({
    ...sourceFacts,
    entries: value.entries
  });
};

const validateDemonBluffs = (setup: GeneratedSetup): InitialPrivateKnowledgeValidationResult => {
  if (setup.demonBluffs.length !== 3) {
    return fail("setup.demonBluffs must contain exactly 3 roles");
  }

  if (!roleListIsAsciiSorted(setup.demonBluffs)) {
    return fail("setup.demonBluffs must use ASCII roleId order");
  }

  const actualRoleIds = new Set(setup.actualRoles.map((role) => role.roleId));
  const bluffRoleIds = new Set<string>();
  for (const bluff of setup.demonBluffs) {
    if (actualRoleIds.has(bluff.roleId)) {
      return fail("demon bluffs must not be actual roles");
    }

    if (bluff.defaultAlignment !== "GOOD" || bluff.characterType === "MINION" || bluff.characterType === "DEMON") {
      return fail("demon bluffs must be good roles");
    }

    if (bluffRoleIds.has(bluff.roleId)) {
      return fail("demon bluffs must be unique");
    }
    bluffRoleIds.add(bluff.roleId);
  }

  return { valid: true };
};

const validateKnowledgeOrdering = (
  entries: readonly InitialKnowledgeEntry[],
  seatByPlayerId: ReadonlyMap<PlayerId, SeatNumber>
): InitialPrivateKnowledgeValidationResult => {
  for (const [index, entry] of entries.entries()) {
    const seat = seatByPlayerId.get(entry.recipientPlayerId);
    if (seat === undefined) {
      return fail("knowledge recipient must exist in roster");
    }

    if (index === 0) {
      continue;
    }

    const previous = entries[index - 1];
    if (previous === undefined) {
      return fail("knowledge ordering comparison failed");
    }

    const previousSeat = seatByPlayerId.get(previous.recipientPlayerId);
    if (previousSeat === undefined) {
      return fail("knowledge recipient must exist in roster");
    }

    if (
      previousSeat > seat ||
      (previousSeat === seat && KNOWLEDGE_KIND_ORDER[previous.kind] >= KNOWLEDGE_KIND_ORDER[entry.kind])
    ) {
      return fail("initial private knowledge entries must use canonical recipient and kind order");
    }
  }

  return { valid: true };
};

export const validateInitialOwnCharacterKnowledgeEntries = (
  input: InitialPrivateKnowledgeValidationInput
): InitialPrivateKnowledgeValidationResult => {
  const entriesShapeValidation = parseInitialKnowledgeEntryShapes(input.entries);
  if (!entriesShapeValidation.valid) {
    return entriesShapeValidation;
  }

  const sourceValidation = validateInitialKnowledgeSourceFacts(input);
  if (!sourceValidation.valid) {
    return sourceValidation;
  }

  const roster = input.roster as PlayerRoster;
  const assignment = input.assignment as CharacterAssignmentSet;
  const setup = input.setup as GeneratedSetup;
  const entries = entriesShapeValidation.entries;

  const bluffValidation = validateDemonBluffs(setup);
  if (!bluffValidation.valid) {
    return bluffValidation;
  }

  const seatByPlayerId = new Map<PlayerId, SeatNumber>(roster.map((entry) => [entry.playerId, entry.seatNumber]));
  const assignmentByPlayerId = new Map(assignment.map((currentAssignment) => [currentAssignment.playerId, currentAssignment]));
  const catalogByRoleId = new Map(setup.roleCatalogSnapshot.roles.map((role) => [role.roleId, role]));

  if (entries.length !== roster.length) {
    return fail("initial own-character knowledge must contain exactly one OWN_CHARACTER entry per roster player");
  }

  const ownEntries: InitialOwnCharacterKnowledgeEntry[] = [];
  for (const entry of entries) {
    if (entry.kind !== "OWN_CHARACTER") {
      return fail(`${entry.kind} is defined but not yet delivered by initial own-character bootstrap`);
    }
    ownEntries.push(entry);
  }

  const orderingValidation = validateKnowledgeOrdering(ownEntries, seatByPlayerId);
  if (!orderingValidation.valid) {
    return orderingValidation;
  }

  const ownByRecipient = new Map<PlayerId, OwnCharacterKnowledge>();

  for (const entry of ownEntries) {
    if (ownByRecipient.has(entry.recipientPlayerId)) {
      return fail("each player must receive exactly one OWN_CHARACTER entry");
    }
    ownByRecipient.set(entry.recipientPlayerId, entry);
  }

  if (ownByRecipient.size !== roster.length) {
    return fail("every player must receive exactly one OWN_CHARACTER entry");
  }

  for (const rosterEntry of roster) {
    const own = ownByRecipient.get(rosterEntry.playerId);
    const assignment = assignmentByPlayerId.get(rosterEntry.playerId);
    if (own === undefined || assignment === undefined) {
      return fail("OWN_CHARACTER entries must cover every roster player");
    }

    const catalogRole = catalogByRoleId.get(own.role.roleId);
    if (
      !sameRoleSetupSnapshot(own.role, assignment.role) ||
      catalogRole === undefined ||
      !sameRoleSetupSnapshot(own.role, catalogRole)
    ) {
      return fail("OWN_CHARACTER role must match assignment and setup catalog");
    }
  }

  return { valid: true };
};
