import { isCanonicalDataValue, isDenseCanonicalArray, sameCanonicalDataValue } from "./canonical-data.js";
import type {
  FirstNightAbilityInstanceId,
  FirstNightAbilityInstanceProvenance,
  FirstNightAbilityOutcomeFactId
} from "./first-night-ability-outcome-ledger.js";
import {
  FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,
  FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION,
  FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION,
  validateFirstNightAbilityInstanceProvenanceShape
} from "./first-night-ability-outcome-ledger.js";
import type { FirstNightTaskPlanVersion, ScheduledTaskSettledPayload } from "./first-night-task-plan.js";
import { SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION } from "./first-night-task-plan.js";
import type {
  AbilityImpairmentId,
  EventId,
  GameId,
  PlayerId,
  RoleTenureId,
  ScheduledTaskId
} from "./ids.js";
import { hasExactEnumerableKeys, hasExactRoleSetupSnapshotShape, isPlainRecord } from "./initial-private-knowledge.js";
import type { SeatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";

export const MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION =
  "mathematician-first-night-count-resolution-v1" as const;
export const MATHEMATICIAN_FIXED_12_NUMBER_DOMAIN_VERSION =
  "mathematician-fixed-12-number-domain-v1" as const;
export const MATHEMATICIAN_SMALLEST_FALSE_POLICY_VERSION =
  "mathematician-smallest-false-policy-v1" as const;
export const MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION = "mathematician-knowledge-v1" as const;
export const MATHEMATICIAN_INFORMATION_STAGE = "MATHEMATICIAN_INFORMATION" as const;

export type MathematicianCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export const MATHEMATICIAN_COUNT_DOMAIN = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const satisfies readonly MathematicianCount[];

export type MathematicianDeliveryId = string & { readonly __brand: "MathematicianDeliveryId" };

export type FirstNightMathematicianCountWindow = {
  readonly windowVersion: typeof FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION;
  readonly gameId: GameId;
  readonly nightNumber: 1;
  readonly rulesBaselineVersion: string;
  readonly firstNightInitializedEventId: EventId;
  readonly startEventSequence: number;
  readonly startBoundary: "EXCLUSIVE";
  readonly endEventSequence: number;
  readonly endBoundary: "INCLUSIVE";
};

export type MathematicianAbnormalPlayer = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly supportingFactIds: readonly FirstNightAbilityOutcomeFactId[];
};

export type MathematicianRoleTenureSnapshot = {
  readonly roleTenureId: RoleTenureId;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: "mathematician" | "philosopher" | "vortox";
  readonly acquiredCharacterStateRevision: number;
  readonly endedCharacterStateRevision: number | null;
};

type MathematicianSourceBase = {
  readonly taskPlanVersion: FirstNightTaskPlanVersion;
  readonly taskId: ScheduledTaskId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceRoleAtSettlement: RoleSetupSnapshot;
  readonly sourceRoleTenure: MathematicianRoleTenureSnapshot;
  readonly settlementCharacterStateRevision: number;
};

export type BaseMathematicianSourceContract = MathematicianSourceBase & {
  readonly kind: "BASE_MATHEMATICIAN";
  readonly abilityInstance: FirstNightAbilityInstanceProvenance & { readonly kind: "BASE_ROLE_TASK" };
};

type PhilosopherGainedMathematicianSourceBase = MathematicianSourceBase & {
  readonly chosenRole: RoleSetupSnapshot;
  readonly philosopherTaskId: ScheduledTaskId;
  readonly philosopherOpportunityId: import("./ids.js").ActionOpportunityId;
  readonly grantId: import("./ids.js").GrantedAbilityId;
  readonly sourceCharacterStateRevision: number;
};

export type PhilosopherGainedMathematicianV1SourceContract = PhilosopherGainedMathematicianSourceBase & {
  readonly kind: "PHILOSOPHER_GAINED_MATHEMATICIAN_V1";
  readonly taskPlanVersion: "first-night-task-plan-v1";
  readonly abilityInstance: FirstNightAbilityInstanceProvenance & { readonly kind: "PHILOSOPHER_GAINED_TASK_V1" };
};

export type PhilosopherGainedMathematicianV2SourceContract = PhilosopherGainedMathematicianSourceBase & {
  readonly kind: "PHILOSOPHER_GAINED_MATHEMATICIAN_V2";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly schedulingVersion: "philosopher-gained-first-night-scheduling-v2";
  readonly abilityInstance: FirstNightAbilityInstanceProvenance & { readonly kind: "PHILOSOPHER_GAINED_TASK_V2" };
};

export type MathematicianSourceContract =
  | BaseMathematicianSourceContract
  | PhilosopherGainedMathematicianV1SourceContract
  | PhilosopherGainedMathematicianV2SourceContract;

export type MathematicianRepresentedImpairment = {
  readonly impairmentId: AbilityImpairmentId;
  readonly kind: "DRUNK" | "POISONED";
  readonly sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" | "SNAKE_CHARMER_DEMON_HIT";
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRoleId: import("./ids.js").RoleId;
  readonly affectedRole: RoleSetupSnapshot;
  readonly appliedCharacterStateRevision: number;
  readonly appliedByEventId: EventId;
  readonly appliedByEventSequence: number;
};

export type MathematicianSourceEffectiveness =
  | { readonly kind: "EFFECTIVE"; readonly representedImpairments: readonly [] }
  | { readonly kind: "KNOWN_DRUNK"; readonly representedImpairments: readonly [MathematicianRepresentedImpairment] }
  | { readonly kind: "KNOWN_POISONED"; readonly representedImpairments: readonly [MathematicianRepresentedImpairment] };

export type MathematicianVortoxConstraint =
  | { readonly kind: "NONE_NO_CURRENT_VORTOX"; readonly evaluatedCharacterStateRevision: number }
  | {
      readonly kind: "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleSnapshot: RoleSetupSnapshot;
      readonly vortoxRoleTenure: MathematicianRoleTenureSnapshot;
      readonly impairment: MathematicianRepresentedImpairment;
    }
  | {
      readonly kind: "VORTOX_FALSE_REQUIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleSnapshot: RoleSetupSnapshot;
      readonly vortoxRoleTenure: MathematicianRoleTenureSnapshot;
    };

export type MathematicianInformationReliability =
  | "RULE_CORRECT"
  | "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"
  | "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING"
  | "VORTOX_CONSTRAINED_FALSE";

export type MathematicianInformationDeliveredPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "MATHEMATICIAN_INFORMATION";
  readonly deliveryId: MathematicianDeliveryId;
  readonly deliveryEventSequence: number;
  readonly sourceContract: MathematicianSourceContract;
  readonly resolutionModelVersion: typeof MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION;
  readonly windowSnapshot: FirstNightMathematicianCountWindow;
  readonly ledgerVersion: typeof FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION;
  readonly auditModelVersion: typeof FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION;
  readonly resolvingAbilityInstanceId: FirstNightAbilityInstanceId;
  readonly qualifyingAbnormalFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly distinctAbnormalPlayers: readonly MathematicianAbnormalPlayer[];
  readonly excludedResolvingSourceFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly excludedOwnAbilityFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredNormalFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredPendingFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly redundantUnresolvedFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly trueCount: MathematicianCount;
  readonly numberDomainVersion: typeof MATHEMATICIAN_FIXED_12_NUMBER_DOMAIN_VERSION;
  readonly candidateDomain: typeof MATHEMATICIAN_COUNT_DOMAIN;
  readonly legalCandidateCounts: readonly MathematicianCount[];
  readonly selectedCount: MathematicianCount;
  readonly sourceEffectiveness: MathematicianSourceEffectiveness;
  readonly vortoxConstraint: MathematicianVortoxConstraint;
  readonly simulationPolicyVersion: typeof MATHEMATICIAN_SMALLEST_FALSE_POLICY_VERSION;
  readonly informationReliability: MathematicianInformationReliability;
  readonly knowledgeModelVersion: typeof MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION;
  readonly knowledgeStage: typeof MATHEMATICIAN_INFORMATION_STAGE;
  readonly settlementCharacterStateRevision: number;
};

export type MathematicianInformationState = {
  readonly deliveries: readonly MathematicianInformationDeliveredPayload[];
};

export type PlayerMathematicianInformationView = { readonly count: MathematicianCount };

export type MathematicianImpairmentEventProvenance = {
  readonly impairmentId: AbilityImpairmentId;
  readonly eventId: EventId;
  readonly eventSequence: number;
  readonly batchId: import("./ids.js").BatchId;
};
export type MathematicianImpairmentEventProvenanceState = {
  readonly entries: readonly MathematicianImpairmentEventProvenance[];
};

type ValidationResult = { readonly valid: true } | { readonly valid: false; readonly reason: string };
const fail = (reason: string): ValidationResult => ({ valid: false, reason });
const nonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0 && value.trim() === value &&
  ![...value].some((character) => character.charCodeAt(0) <= 31 || character.charCodeAt(0) === 127);
const positive = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const seat = (value: unknown): value is SeatNumber => typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 12;
const isCount = (value: unknown): value is MathematicianCount =>
  typeof value === "number" && MATHEMATICIAN_COUNT_DOMAIN.includes(value as MathematicianCount);
const denseUniqueStrings = (value: unknown): value is readonly string[] =>
  isDenseCanonicalArray(value) && value.every(nonEmpty) && new Set(value).size === value.length;
const codeUnitOrderedStrings = (value: readonly string[]): boolean =>
  value.every((entry, index) => index === 0 || value[index - 1]! < entry);

export const formatMathematicianDeliveryId = (taskId: ScheduledTaskId): MathematicianDeliveryId => {
  const parsed = parseMathematicianTaskId(taskId);
  if (!parsed.valid) throw new TypeError(parsed.reason);
  return `mathematician-delivery-v1:${taskId}` as MathematicianDeliveryId;
};

type ParsedTaskId =
  | { readonly valid: true; readonly taskId: ScheduledTaskId; readonly generation: "BASE" | "V1" | "V2" }
  | { readonly valid: false; readonly reason: string };

const parseMathematicianTaskId = (value: unknown): ParsedTaskId => {
  if (!nonEmpty(value)) return { valid: false, reason: "Mathematician task ID must be a canonical string" };
  if (/^first-night-v1:MATHEMATICIAN_INFORMATION:seat-(0[1-9]|1[0-2])$/.test(value)) {
    return { valid: true, taskId: value as ScheduledTaskId, generation: "BASE" };
  }
  if (/^first-night-v1:PHILOSOPHER_GAINED:MATHEMATICIAN_INFORMATION:seat-(0[1-9]|1[0-2]):from-mathematician$/.test(value)) {
    return { valid: true, taskId: value as ScheduledTaskId, generation: "V1" };
  }
  if (/^first-night-v2:PHILOSOPHER_GAINED:MATHEMATICIAN_INFORMATION:seat-(0[1-9]|1[0-2]):from-mathematician$/.test(value)) {
    return { valid: true, taskId: value as ScheduledTaskId, generation: "V2" };
  }
  return { valid: false, reason: "Mathematician task ID does not match a supported canonical grammar" };
};

export type ParsedMathematicianDeliveryId =
  | { readonly valid: true; readonly canonicalId: MathematicianDeliveryId; readonly taskId: ScheduledTaskId; readonly generation: "BASE" | "V1" | "V2" }
  | { readonly valid: false; readonly reason: string };

export const parseMathematicianDeliveryId = (value: unknown): ParsedMathematicianDeliveryId => {
  if (!nonEmpty(value) || !value.startsWith("mathematician-delivery-v1:")) {
    return { valid: false, reason: "Mathematician delivery ID must use the canonical prefix" };
  }
  const task = parseMathematicianTaskId(value.slice("mathematician-delivery-v1:".length));
  if (!task.valid) return task;
  const canonicalId = `mathematician-delivery-v1:${task.taskId}` as MathematicianDeliveryId;
  if (canonicalId !== value) return { valid: false, reason: "Mathematician delivery ID is not canonical" };
  return { valid: true, canonicalId, taskId: task.taskId, generation: task.generation };
};

const TENURE_KEYS = ["acquiredCharacterStateRevision", "endedCharacterStateRevision", "playerId", "roleId", "roleTenureId", "seatNumber"] as const;
const validTenure = (value: unknown): value is MathematicianRoleTenureSnapshot =>
  isPlainRecord(value) && hasExactEnumerableKeys(value, TENURE_KEYS) && nonEmpty(value.roleTenureId) &&
  nonEmpty(value.playerId) && seat(value.seatNumber) &&
  (value.roleId === "mathematician" || value.roleId === "philosopher" || value.roleId === "vortox") &&
  positive(value.acquiredCharacterStateRevision) &&
  (value.endedCharacterStateRevision === null ||
    positive(value.endedCharacterStateRevision) && value.endedCharacterStateRevision >= value.acquiredCharacterStateRevision);

const IMPAIRMENT_KEYS = [
  "affectedPlayerId", "affectedRole", "affectedRoleId", "affectedSeatNumber", "appliedByEventId",
  "appliedByEventSequence", "appliedCharacterStateRevision", "impairmentId", "kind", "sourceKind", "sourcePlayerId"
] as const;
const validImpairment = (value: unknown): value is MathematicianRepresentedImpairment =>
  isPlainRecord(value) && hasExactEnumerableKeys(value, IMPAIRMENT_KEYS) && nonEmpty(value.impairmentId) &&
  (value.kind === "DRUNK" || value.kind === "POISONED") &&
  (value.sourceKind === "PHILOSOPHER_CHOSEN_DUPLICATE" || value.sourceKind === "SNAKE_CHARMER_DEMON_HIT") &&
  nonEmpty(value.sourcePlayerId) && nonEmpty(value.affectedPlayerId) && seat(value.affectedSeatNumber) &&
  nonEmpty(value.affectedRoleId) && hasExactRoleSetupSnapshotShape(value.affectedRole) &&
  value.affectedRole.roleId === value.affectedRoleId && positive(value.appliedCharacterStateRevision) &&
  nonEmpty(value.appliedByEventId) && positive(value.appliedByEventSequence);

const BASE_SOURCE_KEYS = ["abilityInstance", "kind", "settlementCharacterStateRevision", "sourcePlayerId", "sourceRole", "sourceRoleAtSettlement", "sourceRoleTenure", "sourceSeatNumber", "taskId", "taskPlanVersion"] as const;
const GAINED_V1_KEYS = ["abilityInstance", "chosenRole", "grantId", "kind", "philosopherOpportunityId", "philosopherTaskId", "settlementCharacterStateRevision", "sourceCharacterStateRevision", "sourcePlayerId", "sourceRole", "sourceRoleAtSettlement", "sourceRoleTenure", "sourceSeatNumber", "taskId", "taskPlanVersion"] as const;
const GAINED_V2_KEYS = [...GAINED_V1_KEYS, "schedulingVersion"] as const;

const validSource = (value: unknown): value is MathematicianSourceContract => {
  if (!isPlainRecord(value) ||
      !hasExactEnumerableKeys(value, value.kind === "BASE_MATHEMATICIAN" ? BASE_SOURCE_KEYS :
        value.kind === "PHILOSOPHER_GAINED_MATHEMATICIAN_V1" ? GAINED_V1_KEYS : GAINED_V2_KEYS)) return false;
  if (!nonEmpty(value.taskId) || !nonEmpty(value.sourcePlayerId) || !seat(value.sourceSeatNumber) ||
      !hasExactRoleSetupSnapshotShape(value.sourceRole) || !hasExactRoleSetupSnapshotShape(value.sourceRoleAtSettlement) ||
      !validTenure(value.sourceRoleTenure) || !positive(value.settlementCharacterStateRevision) ||
      !validateFirstNightAbilityInstanceProvenanceShape(value.abilityInstance).valid) return false;
  const abilityInstance = value.abilityInstance as FirstNightAbilityInstanceProvenance;
  const task = parseMathematicianTaskId(value.taskId);
  if (!task.valid || abilityInstance.taskId !== value.taskId || abilityInstance.sourcePlayerId !== value.sourcePlayerId ||
      abilityInstance.sourceSeatNumber !== value.sourceSeatNumber || abilityInstance.abilityRoleId !== "mathematician" ||
      value.sourceRoleTenure.playerId !== value.sourcePlayerId || value.sourceRoleTenure.seatNumber !== value.sourceSeatNumber ||
      value.sourceRoleTenure.acquiredCharacterStateRevision > value.settlementCharacterStateRevision ||
      (value.sourceRoleTenure.endedCharacterStateRevision !== null &&
        value.sourceRoleTenure.endedCharacterStateRevision <= value.settlementCharacterStateRevision)) return false;
  if (value.kind === "BASE_MATHEMATICIAN") {
    return task.generation === "BASE" && abilityInstance.kind === "BASE_ROLE_TASK" &&
      (value.taskPlanVersion === "first-night-task-plan-v1" || value.taskPlanVersion === "first-night-task-plan-v2") &&
      value.sourceRole.roleId === "mathematician" && value.sourceRoleAtSettlement.roleId === "mathematician" &&
      value.sourceRoleTenure.roleId === "mathematician";
  }
  if (!hasExactRoleSetupSnapshotShape(value.chosenRole) || value.chosenRole.roleId !== "mathematician" ||
      value.sourceRole.roleId !== "philosopher" || value.sourceRoleAtSettlement.roleId !== "philosopher" ||
      value.sourceRoleTenure.roleId !== "philosopher" || !nonEmpty(value.philosopherTaskId) ||
      !nonEmpty(value.philosopherOpportunityId) || !nonEmpty(value.grantId) || !positive(value.sourceCharacterStateRevision)) return false;
  return value.kind === "PHILOSOPHER_GAINED_MATHEMATICIAN_V1"
    ? task.generation === "V1" && value.taskPlanVersion === "first-night-task-plan-v1" && abilityInstance.kind === "PHILOSOPHER_GAINED_TASK_V1"
    : value.kind === "PHILOSOPHER_GAINED_MATHEMATICIAN_V2" && task.generation === "V2" &&
      value.taskPlanVersion === "first-night-task-plan-v2" && abilityInstance.kind === "PHILOSOPHER_GAINED_TASK_V2" &&
      value.schedulingVersion === "philosopher-gained-first-night-scheduling-v2";
};

const validEffectiveness = (value: unknown): value is MathematicianSourceEffectiveness => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["kind", "representedImpairments"]) ||
      !isDenseCanonicalArray(value.representedImpairments)) return false;
  if (value.kind === "EFFECTIVE") return value.representedImpairments.length === 0;
  if (value.kind !== "KNOWN_DRUNK" && value.kind !== "KNOWN_POISONED") return false;
  return value.representedImpairments.length === 1 && validImpairment(value.representedImpairments[0]) &&
    value.representedImpairments[0].kind === (value.kind === "KNOWN_DRUNK" ? "DRUNK" : "POISONED");
};

const validVortox = (value: unknown): value is MathematicianVortoxConstraint => {
  if (!isPlainRecord(value)) return false;
  if (value.kind === "NONE_NO_CURRENT_VORTOX") {
    return hasExactEnumerableKeys(value, ["evaluatedCharacterStateRevision", "kind"]) && positive(value.evaluatedCharacterStateRevision);
  }
  const baseKeys = ["evaluatedCharacterStateRevision", "kind", "vortoxPlayerId", "vortoxRoleSnapshot", "vortoxRoleTenure", "vortoxSeatNumber"] as const;
  const keys = value.kind === "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED" ? [...baseKeys, "impairment"] as const : baseKeys;
  if ((value.kind !== "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED" && value.kind !== "VORTOX_FALSE_REQUIRED") ||
      !hasExactEnumerableKeys(value, keys) || !positive(value.evaluatedCharacterStateRevision) || !nonEmpty(value.vortoxPlayerId) ||
      !seat(value.vortoxSeatNumber) || !hasExactRoleSetupSnapshotShape(value.vortoxRoleSnapshot) ||
      value.vortoxRoleSnapshot.roleId !== "vortox" || !validTenure(value.vortoxRoleTenure) ||
      value.vortoxRoleTenure.roleId !== "vortox" || value.vortoxRoleTenure.playerId !== value.vortoxPlayerId ||
      value.vortoxRoleTenure.seatNumber !== value.vortoxSeatNumber ||
      value.vortoxRoleTenure.acquiredCharacterStateRevision > value.evaluatedCharacterStateRevision ||
      (value.vortoxRoleTenure.endedCharacterStateRevision !== null &&
        value.vortoxRoleTenure.endedCharacterStateRevision <= value.evaluatedCharacterStateRevision)) return false;
  return value.kind !== "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED" ||
    validImpairment(value.impairment) && value.impairment.kind !== undefined &&
    value.impairment.affectedPlayerId === value.vortoxPlayerId &&
    value.impairment.affectedSeatNumber === value.vortoxSeatNumber && value.impairment.affectedRoleId === "vortox" &&
    sameCanonicalDataValue(value.impairment.affectedRole, value.vortoxRoleSnapshot) &&
    value.vortoxRoleTenure.acquiredCharacterStateRevision <= value.impairment.appliedCharacterStateRevision &&
    value.impairment.appliedCharacterStateRevision <= value.evaluatedCharacterStateRevision;
};

const validWindow = (value: unknown): value is FirstNightMathematicianCountWindow =>
  isPlainRecord(value) && hasExactEnumerableKeys(value, ["endBoundary", "endEventSequence", "firstNightInitializedEventId", "gameId", "nightNumber", "rulesBaselineVersion", "startBoundary", "startEventSequence", "windowVersion"]) &&
  value.windowVersion === FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION && nonEmpty(value.gameId) && value.nightNumber === 1 &&
  nonEmpty(value.rulesBaselineVersion) && nonEmpty(value.firstNightInitializedEventId) && positive(value.startEventSequence) &&
  value.startBoundary === "EXCLUSIVE" && positive(value.endEventSequence) && value.endEventSequence >= value.startEventSequence &&
  value.endBoundary === "INCLUSIVE";

const validAbnormalPlayers = (value: unknown): value is readonly MathematicianAbnormalPlayer[] => {
  if (!isDenseCanonicalArray(value)) return false;
  const players = new Set<string>();
  let previousSeat = 0;
  let previousPlayerId = "";
  for (const entry of value) {
    if (!isPlainRecord(entry) || !hasExactEnumerableKeys(entry, ["playerId", "seatNumber", "supportingFactIds"]) ||
        !nonEmpty(entry.playerId) || !seat(entry.seatNumber) || !denseUniqueStrings(entry.supportingFactIds) ||
        !codeUnitOrderedStrings(entry.supportingFactIds) || entry.supportingFactIds.length === 0 ||
        players.has(entry.playerId) || entry.seatNumber < previousSeat ||
        (entry.seatNumber === previousSeat && entry.playerId <= previousPlayerId)) return false;
    players.add(entry.playerId); previousSeat = entry.seatNumber; previousPlayerId = entry.playerId;
  }
  return true;
};

const DELIVERY_KEYS = [
  "auditModelVersion", "candidateDomain", "deliveryEventSequence", "deliveryId", "distinctAbnormalPlayers",
  "excludedOwnAbilityFactIds", "excludedResolvingSourceFactIds", "ignoredNormalFactIds", "ignoredPendingFactIds",
  "informationReliability", "knowledgeModelVersion", "knowledgeStage", "ledgerVersion", "legalCandidateCounts",
  "nightNumber", "numberDomainVersion", "qualifyingAbnormalFactIds", "redundantUnresolvedFactIds", "resolutionModelVersion",
  "resolvingAbilityInstanceId", "rulesBaselineVersion", "selectedCount", "settlementCharacterStateRevision", "simulationPolicyVersion",
  "sourceContract", "sourceEffectiveness", "taskId", "taskType", "trueCount", "vortoxConstraint", "windowSnapshot"
] as const;

export const validateMathematicianInformationDeliveredPayloadShape = (value: unknown): ValidationResult => {
  try {
    if (!isCanonicalDataValue(value) || !isPlainRecord(value) || !hasExactEnumerableKeys(value, DELIVERY_KEYS) ||
        !nonEmpty(value.rulesBaselineVersion) || value.nightNumber !== 1 || value.taskType !== "MATHEMATICIAN_INFORMATION" ||
        !nonEmpty(value.taskId) || !nonEmpty(value.deliveryId) || !positive(value.deliveryEventSequence) ||
        value.resolutionModelVersion !== MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION ||
        value.ledgerVersion !== FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION ||
        value.auditModelVersion !== FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION ||
        value.numberDomainVersion !== MATHEMATICIAN_FIXED_12_NUMBER_DOMAIN_VERSION ||
        value.simulationPolicyVersion !== MATHEMATICIAN_SMALLEST_FALSE_POLICY_VERSION ||
        value.knowledgeModelVersion !== MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION || value.knowledgeStage !== MATHEMATICIAN_INFORMATION_STAGE ||
        !validSource(value.sourceContract) || value.sourceContract.taskId !== value.taskId ||
        !validWindow(value.windowSnapshot) || value.windowSnapshot.rulesBaselineVersion !== value.rulesBaselineVersion ||
        value.windowSnapshot.endEventSequence !== value.deliveryEventSequence - 1 ||
        !nonEmpty(value.resolvingAbilityInstanceId) || value.resolvingAbilityInstanceId !== value.sourceContract.abilityInstance.abilityInstanceId ||
        !denseUniqueStrings(value.qualifyingAbnormalFactIds) || !validAbnormalPlayers(value.distinctAbnormalPlayers) ||
        !denseUniqueStrings(value.excludedResolvingSourceFactIds) || !denseUniqueStrings(value.excludedOwnAbilityFactIds) ||
        !denseUniqueStrings(value.ignoredNormalFactIds) || !denseUniqueStrings(value.ignoredPendingFactIds) ||
        !denseUniqueStrings(value.redundantUnresolvedFactIds) || !isCount(value.trueCount) ||
        !isDenseCanonicalArray(value.candidateDomain) || value.candidateDomain.length !== MATHEMATICIAN_COUNT_DOMAIN.length ||
        value.candidateDomain.some((candidate, index) => candidate !== MATHEMATICIAN_COUNT_DOMAIN[index]) ||
        !isDenseCanonicalArray(value.legalCandidateCounts) || value.legalCandidateCounts.length === 0 ||
        value.legalCandidateCounts.some((candidate) => !isCount(candidate)) || new Set(value.legalCandidateCounts).size !== value.legalCandidateCounts.length ||
        (value.legalCandidateCounts as readonly number[]).some((candidate, index, candidates) => index > 0 && candidate <= candidates[index - 1]!) ||
        !isCount(value.selectedCount) || !value.legalCandidateCounts.includes(value.selectedCount) ||
        !validEffectiveness(value.sourceEffectiveness) || !validVortox(value.vortoxConstraint) ||
        !positive(value.settlementCharacterStateRevision) || value.sourceContract.settlementCharacterStateRevision !== value.settlementCharacterStateRevision) {
      return fail("Mathematician information delivery must have the exact canonical 31-key shape");
    }
    const parsed = parseMathematicianDeliveryId(value.deliveryId);
    if (!parsed.valid || parsed.taskId !== value.taskId || value.deliveryId !== formatMathematicianDeliveryId(value.taskId as ScheduledTaskId)) {
      return fail("Mathematician delivery identity must round-trip to its task");
    }
    const falseRequired = value.vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED";
    const impaired = value.sourceEffectiveness.kind !== "EFFECTIVE";
    const expectedReliability: MathematicianInformationReliability = falseRequired ? "VORTOX_CONSTRAINED_FALSE" :
      value.sourceEffectiveness.kind === "KNOWN_DRUNK" ? "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS" :
      value.sourceEffectiveness.kind === "KNOWN_POISONED" ? "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING" : "RULE_CORRECT";
    if (value.informationReliability !== expectedReliability ||
        (!falseRequired && !impaired && (value.legalCandidateCounts.length !== 1 || value.selectedCount !== value.trueCount)) ||
        (falseRequired && (value.legalCandidateCounts.includes(value.trueCount) || value.selectedCount === value.trueCount)) ||
        (!falseRequired && impaired && value.legalCandidateCounts.length !== MATHEMATICIAN_COUNT_DOMAIN.length)) {
      return fail("Mathematician candidates and reliability must satisfy the exact effectiveness/Vortox matrix");
    }
    return { valid: true };
  } catch {
    return fail("Mathematician information delivery validation failed closed");
  }
};

export const isMathematicianInformationStateShape = (value: unknown): value is MathematicianInformationState => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["deliveries"]) || !isDenseCanonicalArray(value.deliveries)) return false;
  const deliveryIds = new Set<string>(); const taskIds = new Set<string>(); const instanceIds = new Set<string>();
  let sequence = 0;
  for (const candidate of value.deliveries) {
    const delivery = candidate as MathematicianInformationDeliveredPayload;
    if (!validateMathematicianInformationDeliveredPayloadShape(delivery).valid || delivery.deliveryEventSequence <= sequence ||
        deliveryIds.has(delivery.deliveryId) || taskIds.has(delivery.taskId) || instanceIds.has(delivery.resolvingAbilityInstanceId)) return false;
    sequence = delivery.deliveryEventSequence; deliveryIds.add(delivery.deliveryId); taskIds.add(delivery.taskId); instanceIds.add(delivery.resolvingAbilityInstanceId);
  }
  return true;
};

export const appendMathematicianInformationDelivery = (
  state: MathematicianInformationState | undefined,
  payload: MathematicianInformationDeliveredPayload
): MathematicianInformationState => {
  const shape = validateMathematicianInformationDeliveredPayloadShape(payload);
  if (!shape.valid) throw new TypeError(shape.reason);
  const next = { deliveries: [...(state?.deliveries ?? []), structuredClone(payload)] };
  if (!isMathematicianInformationStateShape(next)) throw new TypeError("Mathematician information state is not canonical");
  return next;
};

export const createMathematicianInformationDeliveredScheduledTaskSettlement = (
  delivery: MathematicianInformationDeliveredPayload
): ScheduledTaskSettledPayload => ({
  rulesBaselineVersion: delivery.rulesBaselineVersion,
  taskId: delivery.taskId,
  taskType: "MATHEMATICIAN_INFORMATION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "MATHEMATICIAN_INFORMATION_DELIVERED",
  characterStateRevision: delivery.settlementCharacterStateRevision
});

export const hasMathematicianInformationForSettlement = (
  state: MathematicianInformationState | undefined,
  settlement: ScheduledTaskSettledPayload
): boolean => isMathematicianInformationStateShape(state) && state.deliveries.some((delivery) =>
  settlement.taskId === delivery.taskId && settlement.taskType === "MATHEMATICIAN_INFORMATION" &&
  settlement.outcomeType === "MATHEMATICIAN_INFORMATION_DELIVERED" && settlement.nightNumber === 1 &&
  settlement.characterStateRevision === delivery.settlementCharacterStateRevision &&
  settlement.rulesBaselineVersion === delivery.rulesBaselineVersion
);

export const validateMathematicianImpairmentEventProvenanceStateShape = (value: unknown): ValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["entries"]) || !isDenseCanonicalArray(value.entries)) return fail("Mathematician impairment provenance state must have exact shape");
  const impairmentIds = new Set<string>(); const eventIds = new Set<string>(); const sequences = new Set<number>(); let previousSequence = 0;
  for (const entry of value.entries) {
    if (!isPlainRecord(entry) || !hasExactEnumerableKeys(entry, ["batchId", "eventId", "eventSequence", "impairmentId"]) ||
        !nonEmpty(entry.impairmentId) || !nonEmpty(entry.eventId) || !nonEmpty(entry.batchId) || !positive(entry.eventSequence) ||
        entry.eventSequence <= previousSequence || impairmentIds.has(entry.impairmentId) || eventIds.has(entry.eventId) || sequences.has(entry.eventSequence)) {
      return fail("Mathematician impairment provenance entries must be canonical, unique, and ordered");
    }
    previousSequence = entry.eventSequence; impairmentIds.add(entry.impairmentId); eventIds.add(entry.eventId); sequences.add(entry.eventSequence);
  }
  return { valid: true };
};

export const appendMathematicianImpairmentEventProvenance = (
  state: MathematicianImpairmentEventProvenanceState | undefined,
  entry: MathematicianImpairmentEventProvenance
): MathematicianImpairmentEventProvenanceState => {
  const next = { entries: [...(state?.entries ?? []), { ...entry }] };
  const validation = validateMathematicianImpairmentEventProvenanceStateShape(next);
  if (!validation.valid) throw new TypeError(validation.reason);
  return next;
};
