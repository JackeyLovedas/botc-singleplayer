import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import { DomainError } from "./errors.js";
import type { CerenovusActionOpportunity, FirstNightActionOpportunityState } from "./first-night-action-opportunity.js";
import type { ScheduledTaskSettlement } from "./first-night-task-plan.js";
import { abilityInstanceId } from "./ids.js";
import type { AbilityInstanceId, ActionOpportunityId, PlayerId, RoleId, RoleTenureId, ScheduledTaskId } from "./ids.js";
import { hasExactEnumerableKeys, hasExactRoleSetupSnapshotShape, isPlainRecord } from "./initial-private-knowledge.js";
import type { AbilityImpairmentSet } from "./philosopher-ability.js";
import type { PlayerRoster, SeatNumber } from "./player-roster.js";
import type { GeneratedSetup, RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";
import { parseRoleTenureId } from "./seamstress.js";

export const CERENOVUS_CHOICE_MODEL_VERSION = "cerenovus-choice-v1" as const;
export const CERENOVUS_MADNESS_MARKER_VERSION = "cerenovus-madness-marker-v1" as const;
export const CERENOVUS_MADNESS_INSTRUCTION_MODEL_VERSION = "cerenovus-madness-instruction-v1" as const;
export const CERENOVUS_INFORMATION_STAGE = "CERENOVUS_INFORMATION" as const;

export type CerenovusInstructionWindow = "TOMORROW_DAY_AND_NIGHT";
export type CerenovusMarkerRemovalRule = "NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY";

export type CerenovusActionDecision = {
  readonly kind: "CHOOSE_PLAYER_AND_CHARACTER";
  readonly targetPlayerId: PlayerId;
  readonly chosenRoleId: RoleId;
};

export type CerenovusAbilitySourceDescriptor = {
  readonly kind: "ROLE_TENURE";
  readonly abilityRoleId: "cerenovus";
  readonly roleTenureId: RoleTenureId;
  readonly acquiredCharacterStateRevision: number;
};

export type CerenovusEffectiveOnlyCapabilityGateResult =
  | { readonly supported: true }
  | {
      readonly supported: false;
      readonly reason: "SOURCE_IMPAIRMENT_UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY";
      readonly eventPolicy: "CREATE_NO_EVENTS";
      readonly receiptPolicy: "WRITE_NO_RECEIPT";
      readonly opportunityPolicy: "KEEP_OPEN";
    };

type CerenovusChoiceProvenance = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "CERENOVUS_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceAbilityInstanceId: AbilityInstanceId;
  readonly abilitySource: CerenovusAbilitySourceDescriptor;
  readonly opportunityCharacterStateRevision: number;
  readonly settlementCharacterStateRevision: number;
};

export type CerenovusChoiceRecordedPayload = CerenovusChoiceProvenance & {
  readonly modelVersion: typeof CERENOVUS_CHOICE_MODEL_VERSION;
  readonly choiceId: string;
  readonly decisionKind: "CHOOSE_PLAYER_AND_CHARACTER";
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly chosenGoodRoleId: RoleId;
  readonly chosenGoodRole: RoleSetupSnapshot;
  readonly roleCatalogSignature: string;
};

export type CerenovusMadnessMarkedPayload = {
  readonly rulesBaselineVersion: string;
  readonly markerVersion: typeof CERENOVUS_MADNESS_MARKER_VERSION;
  readonly nightNumber: 1;
  readonly appliedNightNumber: 1;
  readonly markerId: string;
  readonly choiceId: string;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "CERENOVUS_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceAbilityInstanceId: AbilityInstanceId;
  readonly abilitySource: CerenovusAbilitySourceDescriptor;
  readonly sourceCharacterStateRevision: number;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly madAboutRoleId: RoleId;
  readonly madAboutRole: RoleSetupSnapshot;
  readonly roleCatalogSignature: string;
  readonly markerStatus: "ESTABLISHED";
  readonly instructionWindow: CerenovusInstructionWindow;
  readonly removalRule: CerenovusMarkerRemovalRule;
  readonly sourceAbilityDependency: {
    readonly kind: "SOURCE_ABILITY_INSTANCE";
    readonly permanentLossPolicy: "REMOVE_MARKER";
    readonly reacquisitionPolicy: "NEW_INSTANCE_DOES_NOT_RESUME";
  };
};

export type CerenovusMadnessInstructionDeliveredPayload = {
  readonly rulesBaselineVersion: string;
  readonly modelVersion: typeof CERENOVUS_MADNESS_INSTRUCTION_MODEL_VERSION;
  readonly nightNumber: 1;
  readonly deliveryId: string;
  readonly choiceId: string;
  readonly markerId: string;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "CERENOVUS_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly recipientPlayerId: PlayerId;
  readonly recipientSeatNumber: SeatNumber;
  readonly selectedByCharacter: "cerenovus";
  readonly madAboutRoleId: RoleId;
  readonly madAboutRole: RoleSetupSnapshot;
  readonly roleCatalogSignature: string;
  readonly instructionWindow: CerenovusInstructionWindow;
  readonly deliveryCharacterStateRevision: number;
  readonly deliveryStatus: "DELIVERED";
};

export type CerenovusChoiceSet = { readonly choices: readonly CerenovusChoiceRecordedPayload[] };
export type CerenovusMadnessMarkerSet = { readonly markers: readonly CerenovusMadnessMarkedPayload[] };
export type CerenovusMadnessInstructionSet = { readonly deliveries: readonly CerenovusMadnessInstructionDeliveredPayload[] };
export type CerenovusValidationResult = { readonly valid: true } | { readonly valid: false; readonly reason: string };

const fail = (reason: string): CerenovusValidationResult => ({ valid: false, reason });
const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const positiveInteger = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) > 0;
const seatText = (seatNumber: SeatNumber): string => String(seatNumber).padStart(2, "0");
const canonicalJson = (value: unknown): string => {
  const normalize = (candidate: unknown): unknown => {
    if (Array.isArray(candidate)) return candidate.map(normalize);
    if (isPlainRecord(candidate)) {
      const normalized: Record<string, unknown> = {};
      for (const key of Object.keys(candidate).sort((left, right) => left === right ? 0 : left < right ? -1 : 1)) normalized[key] = normalize(candidate[key]);
      return normalized;
    }
    return candidate;
  };
  return JSON.stringify(normalize(value));
};

export const formatCerenovusAbilityInstanceId = (input: { readonly roleTenureId: RoleTenureId }): AbilityInstanceId => {
  const parsed = parseRoleTenureId(input.roleTenureId);
  if (!parsed.valid || parsed.roleId !== "cerenovus") throw new DomainError("InvalidRoleTenureId", "Cerenovus ability instance requires a canonical Cerenovus tenure");
  return abilityInstanceId(`cerenovus-ability-instance-v1:ROLE_TENURE:seat-${seatText(parsed.seatNumber)}:role-cerenovus:acquired-revision-${parsed.acquiredCharacterStateRevision}`);
};

export type ParsedCerenovusAbilityInstanceId =
  | { readonly valid: true; readonly roleTenureId: RoleTenureId; readonly seatNumber: SeatNumber; readonly acquiredCharacterStateRevision: number }
  | { readonly valid: false; readonly reason: string };

export const parseCerenovusAbilityInstanceId = (value: unknown): ParsedCerenovusAbilityInstanceId => {
  if (typeof value !== "string") return { valid: false, reason: "Cerenovus ability instance ID must be a string" };
  const match = /^cerenovus-ability-instance-v1:ROLE_TENURE:seat-(0[1-9]|1[0-2]):role-cerenovus:acquired-revision-([1-9][0-9]*)$/.exec(value);
  if (match === null) return { valid: false, reason: "Cerenovus ability instance ID is not canonical" };
  const tenureId = `role-tenure-v1:seat-${match[1]}:role-cerenovus:acquired-revision-${match[2]}` as RoleTenureId;
  const parsed = parseRoleTenureId(tenureId);
  if (!parsed.valid || parsed.roleId !== "cerenovus" || formatCerenovusAbilityInstanceId({ roleTenureId: tenureId }) !== value) return { valid: false, reason: "Cerenovus ability instance ID does not reproduce its tenure" };
  return { valid: true, roleTenureId: tenureId, seatNumber: parsed.seatNumber, acquiredCharacterStateRevision: parsed.acquiredCharacterStateRevision };
};

export const formatCerenovusChoiceId = (opportunityId: ActionOpportunityId): string => `${CERENOVUS_CHOICE_MODEL_VERSION}:${opportunityId}`;
export const formatCerenovusMarkerId = (opportunityId: ActionOpportunityId): string => `${CERENOVUS_MADNESS_MARKER_VERSION}:${opportunityId}`;
export const formatCerenovusInstructionDeliveryId = (opportunityId: ActionOpportunityId, seatNumber: SeatNumber): string =>
  `${CERENOVUS_MADNESS_INSTRUCTION_MODEL_VERSION}:${opportunityId}:recipient-seat-${seatText(seatNumber)}`;

export const validateCerenovusActionDecision = (decision: unknown): CerenovusValidationResult => {
  if (!isPlainRecord(decision) || !hasExactEnumerableKeys(decision, ["chosenRoleId", "kind", "targetPlayerId"])) return fail("Cerenovus decision must have the exact runtime shape");
  return decision.kind === "CHOOSE_PLAYER_AND_CHARACTER" && nonEmpty(decision.targetPlayerId) && nonEmpty(decision.chosenRoleId)
    ? { valid: true }
    : fail("Cerenovus decision fields are invalid");
};

const abilitySourceForOpportunity = (opportunity: CerenovusActionOpportunity): CerenovusAbilitySourceDescriptor => ({
  kind: "ROLE_TENURE", abilityRoleId: "cerenovus", roleTenureId: opportunity.sourceRoleTenureId,
  acquiredCharacterStateRevision: opportunity.abilitySource.acquiredCharacterStateRevision
});

export const evaluateCerenovusEffectiveOnlyCapability = (input: {
  readonly sourcePlayerId: PlayerId;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): CerenovusEffectiveOnlyCapabilityGateResult => {
  const unsupported = input.abilityImpairments?.impairments.some((impairment) =>
    impairment.affectedPlayerId === input.sourcePlayerId && (impairment.kind === "DRUNK" || impairment.kind === "POISONED")
  ) === true;
  return unsupported
    ? {
        supported: false,
        reason: "SOURCE_IMPAIRMENT_UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY",
        eventPolicy: "CREATE_NO_EVENTS",
        receiptPolicy: "WRITE_NO_RECEIPT",
        opportunityPolicy: "KEEP_OPEN"
      }
    : { supported: true };
};

export const createCerenovusChoiceRecordedPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly opportunity: CerenovusActionOpportunity;
  readonly settlementCharacterStateRevision: number;
  readonly targetPlayerId: PlayerId;
  readonly chosenRoleId: RoleId;
  readonly roster: PlayerRoster;
  readonly setup: GeneratedSetup;
}): CerenovusChoiceRecordedPayload => {
  const target = input.roster.find((entry) => entry.playerId === input.targetPlayerId);
  const role = input.setup.roleCatalogSnapshot.roles.find((entry) => entry.roleId === input.chosenRoleId);
  if (target === undefined) throw new DomainError("InvalidCerenovusChoiceRecordedPayload", "Cerenovus target must be in the modeled roster");
  if (role === undefined || (role.characterType !== "TOWNSFOLK" && role.characterType !== "OUTSIDER")) throw new DomainError("InvalidCerenovusChoiceRecordedPayload", "Cerenovus chosen role must be an on-script Townsfolk or Outsider");
  return {
    rulesBaselineVersion: input.rulesBaselineVersion, modelVersion: CERENOVUS_CHOICE_MODEL_VERSION, nightNumber: 1,
    choiceId: formatCerenovusChoiceId(input.opportunity.opportunityId), taskId: input.opportunity.taskId, taskType: "CERENOVUS_ACTION",
    opportunityId: input.opportunity.opportunityId, decisionKind: "CHOOSE_PLAYER_AND_CHARACTER",
    sourcePlayerId: input.opportunity.sourcePlayerId, sourceSeatNumber: input.opportunity.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(input.opportunity.sourceRole), sourceRoleTenureId: input.opportunity.sourceRoleTenureId,
    sourceAbilityInstanceId: input.opportunity.sourceAbilityInstanceId, abilitySource: abilitySourceForOpportunity(input.opportunity),
    opportunityCharacterStateRevision: input.opportunity.sourceCharacterStateRevision,
    settlementCharacterStateRevision: input.settlementCharacterStateRevision,
    targetPlayerId: target.playerId, targetSeatNumber: target.seatNumber,
    chosenGoodRoleId: role.roleId, chosenGoodRole: cloneRoleSetupSnapshot(role), roleCatalogSignature: input.setup.roleCatalogSignature
  };
};

export const createCerenovusMadnessMarkedPayload = (choice: CerenovusChoiceRecordedPayload): CerenovusMadnessMarkedPayload => ({
  rulesBaselineVersion: choice.rulesBaselineVersion, markerVersion: CERENOVUS_MADNESS_MARKER_VERSION,
  nightNumber: 1, appliedNightNumber: 1, markerId: formatCerenovusMarkerId(choice.opportunityId), choiceId: choice.choiceId,
  taskId: choice.taskId, taskType: "CERENOVUS_ACTION", opportunityId: choice.opportunityId,
  sourcePlayerId: choice.sourcePlayerId, sourceSeatNumber: choice.sourceSeatNumber, sourceRole: cloneRoleSetupSnapshot(choice.sourceRole),
  sourceRoleTenureId: choice.sourceRoleTenureId, sourceAbilityInstanceId: choice.sourceAbilityInstanceId,
  abilitySource: { ...choice.abilitySource }, sourceCharacterStateRevision: choice.settlementCharacterStateRevision,
  targetPlayerId: choice.targetPlayerId, targetSeatNumber: choice.targetSeatNumber,
  madAboutRoleId: choice.chosenGoodRoleId, madAboutRole: cloneRoleSetupSnapshot(choice.chosenGoodRole),
  roleCatalogSignature: choice.roleCatalogSignature, markerStatus: "ESTABLISHED",
  instructionWindow: "TOMORROW_DAY_AND_NIGHT", removalRule: "NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY",
  sourceAbilityDependency: { kind: "SOURCE_ABILITY_INSTANCE", permanentLossPolicy: "REMOVE_MARKER", reacquisitionPolicy: "NEW_INSTANCE_DOES_NOT_RESUME" }
});

export const createCerenovusMadnessInstructionDeliveredPayload = (
  choice: CerenovusChoiceRecordedPayload,
  marker: CerenovusMadnessMarkedPayload
): CerenovusMadnessInstructionDeliveredPayload => ({
  rulesBaselineVersion: choice.rulesBaselineVersion, modelVersion: CERENOVUS_MADNESS_INSTRUCTION_MODEL_VERSION,
  nightNumber: 1, deliveryId: formatCerenovusInstructionDeliveryId(choice.opportunityId, choice.targetSeatNumber),
  choiceId: choice.choiceId, markerId: marker.markerId, taskId: choice.taskId, taskType: "CERENOVUS_ACTION",
  opportunityId: choice.opportunityId, recipientPlayerId: choice.targetPlayerId, recipientSeatNumber: choice.targetSeatNumber,
  selectedByCharacter: "cerenovus", madAboutRoleId: choice.chosenGoodRoleId,
  madAboutRole: cloneRoleSetupSnapshot(choice.chosenGoodRole), roleCatalogSignature: choice.roleCatalogSignature,
  instructionWindow: marker.instructionWindow, deliveryCharacterStateRevision: choice.settlementCharacterStateRevision,
  deliveryStatus: "DELIVERED"
});

export const createCerenovusScheduledTaskSettlement = (choice: CerenovusChoiceRecordedPayload): ScheduledTaskSettlement => ({
  nightNumber: 1, taskId: choice.taskId, taskType: "CERENOVUS_ACTION", settlementVersion: "scheduled-task-settlement-v1",
  outcomeType: "CERENOVUS_MADNESS_MARKED", characterStateRevision: choice.settlementCharacterStateRevision
});

export const sameCerenovusMarkerPayload = (left: CerenovusMadnessMarkedPayload, right: CerenovusMadnessMarkedPayload): boolean => canonicalJson(left) === canonicalJson(right);
export const sameCerenovusInstructionPayload = (left: CerenovusMadnessInstructionDeliveredPayload, right: CerenovusMadnessInstructionDeliveredPayload): boolean => canonicalJson(left) === canonicalJson(right);

const PROVENANCE_KEYS = ["abilitySource", "nightNumber", "opportunityCharacterStateRevision", "opportunityId", "rulesBaselineVersion", "settlementCharacterStateRevision", "sourceAbilityInstanceId", "sourcePlayerId", "sourceRole", "sourceRoleTenureId", "sourceSeatNumber", "taskId", "taskType"] as const;
const CHOICE_KEYS = [...PROVENANCE_KEYS, "choiceId", "chosenGoodRole", "chosenGoodRoleId", "decisionKind", "modelVersion", "roleCatalogSignature", "targetPlayerId", "targetSeatNumber"] as const;
const MARKER_KEYS = ["abilitySource", "appliedNightNumber", "choiceId", "instructionWindow", "madAboutRole", "madAboutRoleId", "markerId", "markerStatus", "markerVersion", "nightNumber", "opportunityId", "removalRule", "roleCatalogSignature", "rulesBaselineVersion", "sourceAbilityDependency", "sourceAbilityInstanceId", "sourceCharacterStateRevision", "sourcePlayerId", "sourceRole", "sourceRoleTenureId", "sourceSeatNumber", "targetPlayerId", "targetSeatNumber", "taskId", "taskType"] as const;
const INSTRUCTION_KEYS = ["choiceId", "deliveryCharacterStateRevision", "deliveryId", "deliveryStatus", "instructionWindow", "madAboutRole", "madAboutRoleId", "markerId", "modelVersion", "nightNumber", "opportunityId", "recipientPlayerId", "recipientSeatNumber", "roleCatalogSignature", "rulesBaselineVersion", "selectedByCharacter", "taskId", "taskType"] as const;

const validAbilitySource = (value: unknown, roleTenureId: unknown, sourceAbilityInstanceId: unknown): boolean => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["abilityRoleId", "acquiredCharacterStateRevision", "kind", "roleTenureId"])) return false;
  const parsed = parseCerenovusAbilityInstanceId(sourceAbilityInstanceId);
  return value.kind === "ROLE_TENURE" && value.abilityRoleId === "cerenovus" && value.roleTenureId === roleTenureId && positiveInteger(value.acquiredCharacterStateRevision) && parsed.valid && parsed.roleTenureId === roleTenureId && parsed.acquiredCharacterStateRevision === value.acquiredCharacterStateRevision;
};

const validateChoiceProvenance = (value: Record<string, unknown>): CerenovusValidationResult =>
  nonEmpty(value.rulesBaselineVersion) && value.nightNumber === 1 && nonEmpty(value.taskId) && value.taskType === "CERENOVUS_ACTION" && nonEmpty(value.opportunityId) &&
  nonEmpty(value.sourcePlayerId) && positiveInteger(value.sourceSeatNumber) && hasExactRoleSetupSnapshotShape(value.sourceRole) && value.sourceRole.roleId === "cerenovus" &&
  nonEmpty(value.sourceRoleTenureId) && nonEmpty(value.sourceAbilityInstanceId) && validAbilitySource(value.abilitySource, value.sourceRoleTenureId, value.sourceAbilityInstanceId) &&
  positiveInteger(value.opportunityCharacterStateRevision) && positiveInteger(value.settlementCharacterStateRevision) &&
  value.settlementCharacterStateRevision >= value.opportunityCharacterStateRevision
    ? { valid: true } : fail("Cerenovus choice provenance is invalid");

export const validateCerenovusChoiceRecordedPayloadShape = (value: unknown): CerenovusValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, CHOICE_KEYS)) return fail("CerenovusChoiceRecorded must have exact keys");
  const provenance = validateChoiceProvenance(value);
  if (!provenance.valid) return provenance;
  return value.modelVersion === CERENOVUS_CHOICE_MODEL_VERSION && value.choiceId === formatCerenovusChoiceId(value.opportunityId as ActionOpportunityId) &&
    value.decisionKind === "CHOOSE_PLAYER_AND_CHARACTER" && nonEmpty(value.targetPlayerId) && positiveInteger(value.targetSeatNumber) &&
    nonEmpty(value.chosenGoodRoleId) && hasExactRoleSetupSnapshotShape(value.chosenGoodRole) && value.chosenGoodRole.roleId === value.chosenGoodRoleId &&
    (value.chosenGoodRole.characterType === "TOWNSFOLK" || value.chosenGoodRole.characterType === "OUTSIDER") && nonEmpty(value.roleCatalogSignature)
    ? { valid: true } : fail("CerenovusChoiceRecorded fields are invalid");
};

export const validateCerenovusMadnessMarkedPayloadShape = (value: unknown): CerenovusValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, MARKER_KEYS)) return fail("CerenovusMadnessMarked must have exact keys");
  if (!hasExactRoleSetupSnapshotShape(value.sourceRole) || !hasExactRoleSetupSnapshotShape(value.madAboutRole) || !isPlainRecord(value.sourceAbilityDependency)) return fail("CerenovusMadnessMarked embedded values are invalid");
  return nonEmpty(value.rulesBaselineVersion) && value.markerVersion === CERENOVUS_MADNESS_MARKER_VERSION && value.nightNumber === 1 && value.appliedNightNumber === 1 &&
    value.markerId === formatCerenovusMarkerId(value.opportunityId as ActionOpportunityId) && value.choiceId === formatCerenovusChoiceId(value.opportunityId as ActionOpportunityId) &&
    nonEmpty(value.taskId) && value.taskType === "CERENOVUS_ACTION" && nonEmpty(value.sourcePlayerId) && positiveInteger(value.sourceSeatNumber) && value.sourceRole.roleId === "cerenovus" &&
    nonEmpty(value.sourceRoleTenureId) && nonEmpty(value.sourceAbilityInstanceId) && validAbilitySource(value.abilitySource, value.sourceRoleTenureId, value.sourceAbilityInstanceId) && positiveInteger(value.sourceCharacterStateRevision) &&
    nonEmpty(value.targetPlayerId) && positiveInteger(value.targetSeatNumber) && nonEmpty(value.madAboutRoleId) && value.madAboutRole.roleId === value.madAboutRoleId &&
    (value.madAboutRole.characterType === "TOWNSFOLK" || value.madAboutRole.characterType === "OUTSIDER") && nonEmpty(value.roleCatalogSignature) &&
    value.markerStatus === "ESTABLISHED" && value.instructionWindow === "TOMORROW_DAY_AND_NIGHT" && value.removalRule === "NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY" &&
    hasExactEnumerableKeys(value.sourceAbilityDependency, ["kind", "permanentLossPolicy", "reacquisitionPolicy"]) && value.sourceAbilityDependency.kind === "SOURCE_ABILITY_INSTANCE" &&
    value.sourceAbilityDependency.permanentLossPolicy === "REMOVE_MARKER" && value.sourceAbilityDependency.reacquisitionPolicy === "NEW_INSTANCE_DOES_NOT_RESUME"
    ? { valid: true } : fail("CerenovusMadnessMarked fields are invalid");
};

export const validateCerenovusMadnessInstructionDeliveredPayloadShape = (value: unknown): CerenovusValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, INSTRUCTION_KEYS)) return fail("CerenovusMadnessInstructionDelivered must have exact keys");
  return nonEmpty(value.rulesBaselineVersion) && value.modelVersion === CERENOVUS_MADNESS_INSTRUCTION_MODEL_VERSION && value.nightNumber === 1 &&
    value.deliveryId === formatCerenovusInstructionDeliveryId(value.opportunityId as ActionOpportunityId, value.recipientSeatNumber as SeatNumber) &&
    value.choiceId === formatCerenovusChoiceId(value.opportunityId as ActionOpportunityId) && value.markerId === formatCerenovusMarkerId(value.opportunityId as ActionOpportunityId) &&
    nonEmpty(value.taskId) && value.taskType === "CERENOVUS_ACTION" && nonEmpty(value.recipientPlayerId) && positiveInteger(value.recipientSeatNumber) &&
    value.selectedByCharacter === "cerenovus" && nonEmpty(value.madAboutRoleId) && hasExactRoleSetupSnapshotShape(value.madAboutRole) && value.madAboutRole.roleId === value.madAboutRoleId &&
    (value.madAboutRole.characterType === "TOWNSFOLK" || value.madAboutRole.characterType === "OUTSIDER") && nonEmpty(value.roleCatalogSignature) &&
    value.instructionWindow === "TOMORROW_DAY_AND_NIGHT" && positiveInteger(value.deliveryCharacterStateRevision) && value.deliveryStatus === "DELIVERED"
    ? { valid: true } : fail("CerenovusMadnessInstructionDelivered fields are invalid");
};

export const validateCerenovusChoiceAgainstState = (input: { readonly choice: CerenovusChoiceRecordedPayload; readonly opportunity: CerenovusActionOpportunity; readonly roster: PlayerRoster; readonly setup: GeneratedSetup }): CerenovusValidationResult => {
  const shape = validateCerenovusChoiceRecordedPayloadShape(input.choice);
  if (!shape.valid) return shape;
  const target = input.roster.find((entry) => entry.playerId === input.choice.targetPlayerId && entry.seatNumber === input.choice.targetSeatNumber);
  const role = input.setup.roleCatalogSnapshot.roles.find((entry) => entry.roleId === input.choice.chosenGoodRoleId);
  return input.opportunity.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION" && input.opportunity.opportunityId === input.choice.opportunityId && input.opportunity.taskId === input.choice.taskId &&
    input.opportunity.sourceRoleTenureId === input.choice.sourceRoleTenureId && input.opportunity.sourceAbilityInstanceId === input.choice.sourceAbilityInstanceId &&
    input.opportunity.sourceCharacterStateRevision === input.choice.opportunityCharacterStateRevision && target !== undefined && role !== undefined &&
    (role.characterType === "TOWNSFOLK" || role.characterType === "OUTSIDER") && sameRoleSetupSnapshot(role, input.choice.chosenGoodRole) && input.setup.roleCatalogSignature === input.choice.roleCatalogSignature
    ? { valid: true } : fail("Cerenovus choice does not match canonical opportunity, roster, or catalog state");
};

export const validateCerenovusMarkerAgainstChoice = (choice: CerenovusChoiceRecordedPayload, marker: CerenovusMadnessMarkedPayload): CerenovusValidationResult => {
  const shape = validateCerenovusMadnessMarkedPayloadShape(marker);
  return shape.valid && sameCerenovusMarkerPayload(marker, createCerenovusMadnessMarkedPayload(choice))
    ? { valid: true } : fail(shape.valid ? "Cerenovus marker does not match its choice" : shape.reason);
};

export const validateCerenovusInstructionAgainstChain = (choice: CerenovusChoiceRecordedPayload, marker: CerenovusMadnessMarkedPayload, delivery: CerenovusMadnessInstructionDeliveredPayload): CerenovusValidationResult => {
  const shape = validateCerenovusMadnessInstructionDeliveredPayloadShape(delivery);
  return shape.valid && sameCerenovusInstructionPayload(delivery, createCerenovusMadnessInstructionDeliveredPayload(choice, marker))
    ? { valid: true } : fail(shape.valid ? "Cerenovus instruction does not match its choice and marker" : shape.reason);
};

export const appendCerenovusChoice = (state: CerenovusChoiceSet | undefined, payload: CerenovusChoiceRecordedPayload): CerenovusChoiceSet => ({ choices: [...(state?.choices ?? []), payload] });
export const appendCerenovusMarker = (state: CerenovusMadnessMarkerSet | undefined, payload: CerenovusMadnessMarkedPayload): CerenovusMadnessMarkerSet => ({ markers: [...(state?.markers ?? []), payload] });
export const appendCerenovusInstruction = (state: CerenovusMadnessInstructionSet | undefined, payload: CerenovusMadnessInstructionDeliveredPayload): CerenovusMadnessInstructionSet => ({ deliveries: [...(state?.deliveries ?? []), payload] });

export const hasCerenovusChainForSettlement = (input: { readonly choices: CerenovusChoiceSet | undefined; readonly markers: CerenovusMadnessMarkerSet | undefined; readonly instructions: CerenovusMadnessInstructionSet | undefined; readonly settlement: ScheduledTaskSettlement }): boolean => {
  const choices = input.choices?.choices.filter((entry) => entry.taskId === input.settlement.taskId) ?? [];
  if (choices.length !== 1 || choices[0] === undefined) return false;
  const markers = input.markers?.markers.filter((entry) => entry.choiceId === choices[0]!.choiceId) ?? [];
  const deliveries = input.instructions?.deliveries.filter((entry) => entry.choiceId === choices[0]!.choiceId) ?? [];
  return input.settlement.taskType === "CERENOVUS_ACTION" && input.settlement.outcomeType === "CERENOVUS_MADNESS_MARKED" &&
    input.settlement.characterStateRevision === choices[0].settlementCharacterStateRevision && markers.length === 1 && deliveries.length === 1;
};

export const findCerenovusOpportunity = (state: FirstNightActionOpportunityState | undefined, opportunityId: ActionOpportunityId): CerenovusActionOpportunity | undefined => {
  const opportunity = state?.opportunities.find((entry) => entry.opportunityId === opportunityId);
  return opportunity?.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION" ? opportunity : undefined;
};
