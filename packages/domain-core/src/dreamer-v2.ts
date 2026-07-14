import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import { isCanonicalDataValue, sameCanonicalDataValue } from "./canonical-data.js";
import type { DreamerInformationDeliveredPayload, DreamerTargetChosenPayload } from "./dreamer.js";
import { validateDreamerInformationDeliveredV1PayloadShape, validateDreamerTargetChosenV1PayloadShape } from "./dreamer.js";
import { DomainError } from "./errors.js";
import type {
  AbilityImpairmentId,
  ActionOpportunityId,
  PlayerId,
  RoleId,
  RoleTenureId,
  ScheduledTaskId
} from "./ids.js";
import { hasExactEnumerableKeys, hasExactRoleSetupSnapshotShape, isPlainRecord } from "./initial-private-knowledge.js";
import type { SeatNumber } from "./player-roster.js";
import type { RoleCatalogSnapshot, RoleSetupSnapshot } from "./setup-types.js";
import type { FirstNightAbilityInstanceProvenance } from "./first-night-ability-outcome-ledger.js";
import { validateDreamerV2SourceContractShapeForInternalUse } from "./dreamer-v2-contract-internal.js";
import type { ScheduledTaskSettlement } from "./first-night-task-plan.js";

const BASE_DREAMER_V2_TASK_ID_PATTERN = /^first-night-v1:DREAMER_ACTION:seat-(0[1-9]|1[0-2])$/;

export type ParsedCanonicalDreamerV2TaskId = {
  readonly valid: true;
  readonly taskId: ScheduledTaskId;
  readonly sourceKind: "BASE";
  readonly seatNumber: SeatNumber;
};

export const parseCanonicalDreamerV2TaskId = (
  value: unknown
): ParsedCanonicalDreamerV2TaskId | { readonly valid: false; readonly reason: string } => {
  if (typeof value !== "string") return { valid: false, reason: "Dreamer task ID must be a string" };
  const base = BASE_DREAMER_V2_TASK_ID_PATTERN.exec(value);
  if (base?.[1] !== undefined) {
    return { valid: true, taskId: value as ScheduledTaskId, sourceKind: "BASE", seatNumber: Number(base[1]) as SeatNumber };
  }
  return { valid: false, reason: "Dreamer task ID is not canonical" };
};

export const DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION = "dreamer-first-night-action-v2" as const;
export const DREAMER_V2_RESOLUTION_CAPABILITY_VERSION = "dreamer-first-night-resolution-capability-v2" as const;
export const DREAMER_V2_SOURCE_CONTRACT_VERSION = "dreamer-source-contract-v2" as const;
export const DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION = "dreamer-target-choice-v2" as const;
export const DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION = "dreamer-information-delivery-v2" as const;
export const DREAMER_V2_INFORMATION_MODEL_VERSION = "dreamer-information-model-v2" as const;
export const DREAMER_V2_RESOLUTION_MODEL_VERSION = "dreamer-resolution-model-v2" as const;
export const DREAMER_V2_CANDIDATE_DOMAIN_VERSION = "dreamer-candidate-domain-v2" as const;
export const DREAMER_V2_SIMULATION_POLICY_VERSION = "dreamer-smallest-legal-role-code-unit-v1" as const;
export const DREAMER_V2_INFORMATION_STAGE = "DREAMER_INFORMATION" as const;
export const DREAMER_V2_CANONICAL_CONTEXT_VERSION = "dreamer-canonical-context-v2" as const;
export const DREAMER_V2_PIPELINE_FINGERPRINT_VERSION = "dreamer-pipeline-state-fingerprint-v2" as const;
export const DREAMER_V2_RESOLUTION_BOUNDARY_VERSION = "dreamer-resolution-boundary-v2" as const;
export const DREAMER_V2_PROJECTION_TRUST_VERSION = "dreamer-projection-trust-v2" as const;

export type DreamerV2TargetChoiceId = string & { readonly __brand: "DreamerV2TargetChoiceId" };
export type DreamerV2DeliveryId = string & { readonly __brand: "DreamerV2DeliveryId" };
export type DreamerV2ResolutionBoundary = {
  readonly boundaryVersion: typeof DREAMER_V2_RESOLUTION_BOUNDARY_VERSION;
  readonly stage: "PRE_TARGET" | "PRE_DELIVERY" | "PRE_SETTLEMENT";
  readonly opportunityId: ActionOpportunityId;
  readonly targetPlayerId: PlayerId;
  readonly targetChoiceId: DreamerV2TargetChoiceId | null;
  readonly deliveryId: DreamerV2DeliveryId | null;
};

export type DreamerV2RoleTenureSnapshot = {
  readonly roleTenureId: RoleTenureId;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: RoleId;
  readonly acquiredCharacterStateRevision: number;
  readonly endedCharacterStateRevision: number | null;
  readonly statusAtEvaluation: "ACTIVE";
};

export type DreamerV2RepresentedImpairment = {
  readonly impairmentId: AbilityImpairmentId;
  readonly impairmentKind: "DRUNK" | "POISONED";
  readonly sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" | "SNAKE_CHARMER_DEMON_HIT";
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRoleId: RoleId;
  readonly affectedRole: RoleSetupSnapshot;
  readonly appliedCharacterStateRevision: number;
};

export type DreamerV2SourceEffectiveness =
  | { readonly kind: "EFFECTIVE"; readonly representedImpairments: readonly [] }
  | { readonly kind: "KNOWN_DRUNK"; readonly representedImpairments: readonly [DreamerV2RepresentedImpairment] }
  | { readonly kind: "KNOWN_POISONED"; readonly representedImpairments: readonly [DreamerV2RepresentedImpairment] };

type DreamerV2SourceBase = {
  readonly sourceContractVersion: typeof DREAMER_V2_SOURCE_CONTRACT_VERSION;
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly abilityRole: RoleSetupSnapshot;
  readonly sourceRoleTenure: DreamerV2RoleTenureSnapshot;
  readonly opportunityCharacterStateRevision: number;
  readonly abilityInstance: FirstNightAbilityInstanceProvenance;
};

export type BaseDreamerV2SourceContract = DreamerV2SourceBase & {
  readonly kind: "BASE_DREAMER_V2";
  readonly abilityInstance: Extract<FirstNightAbilityInstanceProvenance, { readonly kind: "BASE_ROLE_TASK" }>;
};

export type DreamerV2SourceContract = BaseDreamerV2SourceContract;

export type DreamerActionOpportunityVisibilityV2 = {
  readonly visibilitySchemaVersion: typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly resolutionCapabilityVersion: typeof DREAMER_V2_RESOLUTION_CAPABILITY_VERSION;
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER";
};

export type DreamerActionOpportunityV2 = {
  readonly opportunitySchemaVersion: typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: "OPEN" | "CLOSED";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly visibility: DreamerActionOpportunityVisibilityV2;
};

export type DreamerV2TargetTruth = {
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly targetCharacterStateRevision: number;
  readonly targetTrueRole: RoleSetupSnapshot;
  readonly targetNativeSide: "GOOD" | "EVIL";
};

export type DreamerV2VortoxConstraint =
  | { readonly kind: "NONE_NO_CURRENT_VORTOX"; readonly evaluatedCharacterStateRevision: number; readonly aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT" }
  | {
      readonly kind: "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT";
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleSnapshot: RoleSetupSnapshot;
      readonly vortoxRoleTenure: DreamerV2RoleTenureSnapshot;
      readonly representedImpairments: readonly [DreamerV2RepresentedImpairment];
    }
  | {
      readonly kind: "VORTOX_FALSE_REQUIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT";
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleSnapshot: RoleSetupSnapshot;
      readonly vortoxRoleTenure: DreamerV2RoleTenureSnapshot;
    };

export type DreamerV2CandidateDomainSnapshot = {
  readonly candidateDomainVersion: typeof DREAMER_V2_CANDIDATE_DOMAIN_VERSION;
  readonly roleCatalogVersion: string;
  readonly roleCatalogSignature: string;
  readonly roleCatalogCanonicalSignature: string;
  readonly goodCandidates: readonly RoleSetupSnapshot[];
  readonly evilCandidates: readonly RoleSetupSnapshot[];
};

export type DreamerV2InformationReliability =
  | "RULE_CORRECT"
  | "DETERMINISTIC_TRUE_WITH_KNOWN_DRUNKENNESS"
  | "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"
  | "DETERMINISTIC_TRUE_WITH_KNOWN_POISONING"
  | "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING"
  | "VORTOX_CONSTRAINED_FALSE";

export type DreamerV2CandidateResolution =
  | {
      readonly kind: "READY";
      readonly candidateDomain: DreamerV2CandidateDomainSnapshot;
      readonly selectedGoodRole: RoleSetupSnapshot;
      readonly selectedEvilRole: RoleSetupSnapshot;
      readonly truthOutcome: "TARGET_INCLUDED" | "TARGET_EXCLUDED";
      readonly informationReliability: DreamerV2InformationReliability;
    }
  | {
      readonly kind: "DEPENDENCY_FAILURE";
      readonly failureCode:
        | "INVALID_ROLE_CATALOG_SNAPSHOT"
        | "SPARSE_ROLE_CATALOG"
        | "DUPLICATE_ROLE_ID"
        | "UNKNOWN_TARGET_ROLE"
        | "ROLE_NATIVE_SIDE_MISMATCH"
        | "NO_GOOD_CANDIDATE"
        | "NO_EVIL_CANDIDATE"
        | "NO_VORTOX_FALSE_GOOD_CANDIDATE"
        | "NO_VORTOX_FALSE_EVIL_CANDIDATE";
      readonly message: string;
    };

const codeUnitCompare = (left: RoleSetupSnapshot, right: RoleSetupSnapshot): number =>
  left.roleId === right.roleId ? 0 : left.roleId < right.roleId ? -1 : 1;
const dense = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) if (!Object.hasOwn(value, index)) return false;
  return true;
};
const dependency = (
  failureCode: Extract<DreamerV2CandidateResolution, { readonly kind: "DEPENDENCY_FAILURE" }>["failureCode"],
  message: string
): DreamerV2CandidateResolution => ({ kind: "DEPENDENCY_FAILURE", failureCode, message });

export const resolveDreamerV2Candidates = (input: {
  readonly roleCatalogSnapshot: RoleCatalogSnapshot;
  readonly roleCatalogSignature: string;
  readonly targetTruth: DreamerV2TargetTruth;
  readonly sourceEffectiveness: DreamerV2SourceEffectiveness;
  readonly vortoxConstraint: DreamerV2VortoxConstraint;
}): DreamerV2CandidateResolution => {
  const roles: readonly RoleSetupSnapshot[] = input.roleCatalogSnapshot.roles;
  if (!dense(roles) || roles.some((role) => !hasExactRoleSetupSnapshotShape(role))) {
    return dependency(!dense(roles) ? "SPARSE_ROLE_CATALOG" : "INVALID_ROLE_CATALOG_SNAPSHOT", "Dreamer candidate catalog is invalid");
  }
  if (new Set(roles.map((role) => role.roleId)).size !== roles.length) {
    return dependency("DUPLICATE_ROLE_ID", "Dreamer candidate catalog contains duplicate roles");
  }
  const target = roles.find((role) => role.roleId === input.targetTruth.targetTrueRole.roleId);
  if (target === undefined) return dependency("UNKNOWN_TARGET_ROLE", "Dreamer target role is absent from the signed catalog");
  const nativeSide = target.defaultAlignment;
  if (nativeSide !== input.targetTruth.targetNativeSide) {
    return dependency("ROLE_NATIVE_SIDE_MISMATCH", "Dreamer target native side does not match the signed catalog");
  }
  const good = roles.filter((role) => role.defaultAlignment === "GOOD").sort(codeUnitCompare);
  const evil = roles.filter((role) => role.defaultAlignment === "EVIL").sort(codeUnitCompare);
  if (good.length === 0) return dependency("NO_GOOD_CANDIDATE", "Dreamer candidate catalog has no GOOD role");
  if (evil.length === 0) return dependency("NO_EVIL_CANDIDATE", "Dreamer candidate catalog has no EVIL role");
  const vortox = input.vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED";
  const impaired = input.sourceEffectiveness.kind !== "EFFECTIVE";
  const native = nativeSide === "GOOD" ? good : evil;
  const opposite = nativeSide === "GOOD" ? evil : good;
  const falseNative = native.find((role) => role.roleId !== target.roleId);
  if (vortox && falseNative === undefined) {
    return dependency(nativeSide === "GOOD" ? "NO_VORTOX_FALSE_GOOD_CANDIDATE" : "NO_VORTOX_FALSE_EVIL_CANDIDATE", "Dreamer Vortox false native-side candidate is unavailable");
  }
  const selectedNative = vortox || impaired && falseNative !== undefined ? falseNative! : target;
  const selectedOpposite = opposite[0];
  if (selectedOpposite === undefined) {
    return dependency(nativeSide === "GOOD" ? "NO_EVIL_CANDIDATE" : "NO_GOOD_CANDIDATE", "Dreamer opposite-side candidate is unavailable");
  }
  const truthOutcome = selectedNative.roleId === target.roleId ? "TARGET_INCLUDED" : "TARGET_EXCLUDED";
  const suffix = truthOutcome === "TARGET_INCLUDED" ? "TRUE" : "FALSE";
  const informationReliability: DreamerV2InformationReliability = vortox
    ? "VORTOX_CONSTRAINED_FALSE"
    : input.sourceEffectiveness.kind === "KNOWN_DRUNK"
      ? `DETERMINISTIC_${suffix}_WITH_KNOWN_DRUNKENNESS`
      : input.sourceEffectiveness.kind === "KNOWN_POISONED"
        ? `DETERMINISTIC_${suffix}_WITH_KNOWN_POISONING`
        : "RULE_CORRECT";
  return {
    kind: "READY",
    candidateDomain: {
      candidateDomainVersion: DREAMER_V2_CANDIDATE_DOMAIN_VERSION,
      roleCatalogVersion: input.roleCatalogSnapshot.roleCatalogVersion,
      roleCatalogSignature: input.roleCatalogSignature,
      roleCatalogCanonicalSignature: input.roleCatalogSnapshot.canonicalSignature,
      goodCandidates: good.map(cloneRoleSetupSnapshot),
      evilCandidates: evil.map(cloneRoleSetupSnapshot)
    },
    selectedGoodRole: cloneRoleSetupSnapshot(nativeSide === "GOOD" ? selectedNative : selectedOpposite),
    selectedEvilRole: cloneRoleSetupSnapshot(nativeSide === "EVIL" ? selectedNative : selectedOpposite),
    truthOutcome,
    informationReliability
  };
};

export const formatDreamerV2TargetChoiceId = (taskId: ScheduledTaskId): DreamerV2TargetChoiceId => {
  if (!parseCanonicalDreamerV2TaskId(taskId).valid) {
    throw new DomainError("InvalidDreamerV2TargetChoiceId", "Dreamer V2 target choice requires a canonical task ID");
  }
  return `dreamer-target-choice-v2:${taskId}` as DreamerV2TargetChoiceId;
};
export const formatDreamerV2DeliveryId = (taskId: ScheduledTaskId): DreamerV2DeliveryId => {
  if (!parseCanonicalDreamerV2TaskId(taskId).valid) {
    throw new DomainError("InvalidDreamerV2DeliveryId", "Dreamer V2 delivery requires a canonical task ID");
  }
  return `dreamer-delivery-v2:${taskId}` as DreamerV2DeliveryId;
};
type ParsedDreamerV2AssociatedId = ParsedCanonicalDreamerV2TaskId;
const parseDreamerV2AssociatedId = (
  value: unknown,
  prefix: "dreamer-target-choice-v2:" | "dreamer-delivery-v2:",
  reason: string
): ParsedDreamerV2AssociatedId | { readonly valid: false; readonly reason: string } => {
  if (typeof value !== "string" || !value.startsWith(prefix)) return { valid: false, reason };
  const task = parseCanonicalDreamerV2TaskId(value.slice(prefix.length));
  if (!task.valid || value !== `${prefix}${task.taskId}`) return { valid: false, reason };
  return task;
};
export const parseDreamerV2TargetChoiceId = (
  value: unknown
): ParsedDreamerV2AssociatedId | { readonly valid: false; readonly reason: string } =>
  parseDreamerV2AssociatedId(value, "dreamer-target-choice-v2:", "Dreamer V2 target choice ID is not canonical");
export const parseDreamerV2DeliveryId = (
  value: unknown
): ParsedDreamerV2AssociatedId | { readonly valid: false; readonly reason: string } =>
  parseDreamerV2AssociatedId(value, "dreamer-delivery-v2:", "Dreamer V2 delivery ID is not canonical");

export type DreamerTargetChosenV2Payload = {
  readonly rulesBaselineVersion: string;
  readonly targetChoiceSchemaVersion: typeof DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly targetChoiceId: DreamerV2TargetChoiceId;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourceContract: DreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly settlementCharacterStateRevision: number;
};

export type DreamerInformationDeliveredV2Payload = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion: typeof DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly targetChoiceId: DreamerV2TargetChoiceId;
  readonly deliveryId: DreamerV2DeliveryId;
  readonly sourceContract: DreamerV2SourceContract;
  readonly targetTruth: DreamerV2TargetTruth;
  readonly candidateDomain: DreamerV2CandidateDomainSnapshot;
  readonly selectedGoodRole: RoleSetupSnapshot;
  readonly selectedEvilRole: RoleSetupSnapshot;
  readonly truthOutcome: "TARGET_INCLUDED" | "TARGET_EXCLUDED";
  readonly sourceEffectiveness: DreamerV2SourceEffectiveness;
  readonly vortoxConstraint: DreamerV2VortoxConstraint;
  readonly informationReliability: DreamerV2InformationReliability;
  readonly resolutionModelVersion: typeof DREAMER_V2_RESOLUTION_MODEL_VERSION;
  readonly simulationPolicyVersion: typeof DREAMER_V2_SIMULATION_POLICY_VERSION;
  readonly knowledgeModelVersion: typeof DREAMER_V2_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_V2_INFORMATION_STAGE;
  readonly settlementCharacterStateRevision: number;
};

export type DreamerTargetChoice = DreamerTargetChosenPayload | DreamerTargetChosenV2Payload;
export type DreamerInformationDelivery = DreamerInformationDeliveredPayload | DreamerInformationDeliveredV2Payload;
export type DreamerTargetChoiceSet = { readonly choices: readonly DreamerTargetChoice[] };
export type DreamerInformationSet = { readonly deliveries: readonly DreamerInformationDelivery[] };

export const isDreamerTargetChosenV2Payload = (value: unknown): value is DreamerTargetChosenV2Payload =>
  isPlainRecord(value) && value.targetChoiceSchemaVersion === DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION;
export const isDreamerInformationDeliveredV2Payload = (value: unknown): value is DreamerInformationDeliveredV2Payload =>
  isPlainRecord(value) && value.deliverySchemaVersion === DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION;

const targetKeys = ["decisionKind","nightNumber","opportunityId","rulesBaselineVersion","settlementCharacterStateRevision","sourceContract","targetChoiceId","targetChoiceSchemaVersion","targetPlayerId","targetSeatNumber","taskId","taskType"] as const;
const deliveryKeys = ["candidateDomain","deliveryId","deliverySchemaVersion","informationReliability","knowledgeModelVersion","knowledgeStage","nightNumber","opportunityId","resolutionModelVersion","selectedEvilRole","selectedGoodRole","settlementCharacterStateRevision","simulationPolicyVersion","sourceContract","sourceEffectiveness","targetChoiceId","targetTruth","taskId","taskType","truthOutcome","vortoxConstraint","rulesBaselineVersion"] as const;
export type DreamerV2ValidationResult = { readonly valid: true } | { readonly valid: false; readonly reason: string };
const invalid = (reason: string): DreamerV2ValidationResult => ({ valid: false, reason });

const hasExactDataProperties = (value: unknown, expectedKeys: readonly string[]): value is Record<string, unknown> => {
  if (!isPlainRecord(value)) return false;
  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.length !== expectedKeys.length || ownKeys.some((key) => typeof key !== "string" || !expectedKeys.includes(key))) {
    return false;
  }
  return expectedKeys.every((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    return descriptor !== undefined && descriptor.enumerable === true && "value" in descriptor;
  });
};

const hasExactDreamerRoleShape = (value: unknown): value is RoleSetupSnapshot =>
  hasExactDataProperties(value, ["roleId", "characterType", "defaultAlignment", "edition", "setupModifier"]) &&
  hasExactDataProperties(value.setupModifier, ["outsiderDelta", "townsfolkDelta"]) &&
  hasExactRoleSetupSnapshotShape(value);

const isCanonicalString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0 && value.trim() === value &&
  ![...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });
const isSeat = (value: unknown): value is SeatNumber =>
  typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 12;
const isRevision = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 1;

const validateDreamerV2TenureShape = (value: unknown): boolean =>
  hasExactDataProperties(value, ["roleTenureId", "playerId", "seatNumber", "roleId", "acquiredCharacterStateRevision", "endedCharacterStateRevision", "statusAtEvaluation"]) &&
  isCanonicalString(value.roleTenureId) && isCanonicalString(value.playerId) && isSeat(value.seatNumber) &&
  isCanonicalString(value.roleId) && isRevision(value.acquiredCharacterStateRevision) &&
  (value.endedCharacterStateRevision === null || isRevision(value.endedCharacterStateRevision)) &&
  value.statusAtEvaluation === "ACTIVE";

const validateDreamerV2ImpairmentShape = (value: unknown): value is DreamerV2RepresentedImpairment =>
  hasExactDataProperties(value, ["impairmentId", "impairmentKind", "sourceKind", "sourcePlayerId", "affectedPlayerId", "affectedSeatNumber", "affectedRoleId", "affectedRole", "appliedCharacterStateRevision"]) &&
  isCanonicalString(value.impairmentId) && (value.impairmentKind === "DRUNK" || value.impairmentKind === "POISONED") &&
  (value.sourceKind === "PHILOSOPHER_CHOSEN_DUPLICATE" || value.sourceKind === "SNAKE_CHARMER_DEMON_HIT") &&
  isCanonicalString(value.sourcePlayerId) && isCanonicalString(value.affectedPlayerId) && isSeat(value.affectedSeatNumber) &&
  isCanonicalString(value.affectedRoleId) && hasExactDreamerRoleShape(value.affectedRole) &&
  value.affectedRole.roleId === value.affectedRoleId && isRevision(value.appliedCharacterStateRevision);

const validateDreamerV2SourceEffectivenessShape = (value: unknown): value is DreamerV2SourceEffectiveness => {
  if (!hasExactDataProperties(value, ["kind", "representedImpairments"]) || !Array.isArray(value.representedImpairments) || !dense(value.representedImpairments)) return false;
  if (value.kind === "EFFECTIVE") return value.representedImpairments.length === 0;
  if (value.kind !== "KNOWN_DRUNK" && value.kind !== "KNOWN_POISONED") return false;
  return value.representedImpairments.length === 1 && validateDreamerV2ImpairmentShape(value.representedImpairments[0]) &&
    value.representedImpairments[0].impairmentKind === (value.kind === "KNOWN_DRUNK" ? "DRUNK" : "POISONED");
};

const validateDreamerV2TargetTruthShape = (value: unknown): value is DreamerV2TargetTruth =>
  hasExactDataProperties(value, ["targetPlayerId", "targetSeatNumber", "targetCharacterStateRevision", "targetTrueRole", "targetNativeSide"]) &&
  isCanonicalString(value.targetPlayerId) && isSeat(value.targetSeatNumber) && isRevision(value.targetCharacterStateRevision) &&
  hasExactDreamerRoleShape(value.targetTrueRole) && value.targetNativeSide === value.targetTrueRole.defaultAlignment;

const validateDreamerV2CandidateDomainShape = (value: unknown): value is DreamerV2CandidateDomainSnapshot => {
  if (!hasExactDataProperties(value, ["candidateDomainVersion", "roleCatalogVersion", "roleCatalogSignature", "roleCatalogCanonicalSignature", "goodCandidates", "evilCandidates"]) ||
      value.candidateDomainVersion !== DREAMER_V2_CANDIDATE_DOMAIN_VERSION || !isCanonicalString(value.roleCatalogVersion) ||
      !isCanonicalString(value.roleCatalogSignature) || !isCanonicalString(value.roleCatalogCanonicalSignature) ||
      !Array.isArray(value.goodCandidates) || !Array.isArray(value.evilCandidates) || !dense(value.goodCandidates) || !dense(value.evilCandidates)) return false;
  return value.goodCandidates.every((role) => hasExactDreamerRoleShape(role) && role.defaultAlignment === "GOOD") &&
    value.evilCandidates.every((role) => hasExactDreamerRoleShape(role) && role.defaultAlignment === "EVIL");
};

const validateDreamerV2VortoxConstraintShape = (value: unknown): value is DreamerV2VortoxConstraint => {
  if (!isPlainRecord(value)) return false;
  const base = ["kind", "evaluatedCharacterStateRevision", "aliveEvidence"] as const;
  const falseKeys = [...base, "vortoxPlayerId", "vortoxSeatNumber", "vortoxRoleSnapshot", "vortoxRoleTenure"] as const;
  const impairedKeys = [...falseKeys, "representedImpairments"] as const;
  if (value.kind === "NONE_NO_CURRENT_VORTOX") {
    return hasExactDataProperties(value, base) && isRevision(value.evaluatedCharacterStateRevision) && value.aliveEvidence === "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT";
  }
  if (value.kind !== "VORTOX_FALSE_REQUIRED" && value.kind !== "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED") return false;
  if (!hasExactDataProperties(value, value.kind === "VORTOX_FALSE_REQUIRED" ? falseKeys : impairedKeys) ||
      !isRevision(value.evaluatedCharacterStateRevision) || value.aliveEvidence !== "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT" ||
      !isCanonicalString(value.vortoxPlayerId) || !isSeat(value.vortoxSeatNumber) || !hasExactDreamerRoleShape(value.vortoxRoleSnapshot) ||
      value.vortoxRoleSnapshot.roleId !== "vortox" || !validateDreamerV2TenureShape(value.vortoxRoleTenure)) return false;
  return value.kind === "VORTOX_FALSE_REQUIRED" ||
    (Array.isArray(value.representedImpairments) && dense(value.representedImpairments) && value.representedImpairments.length === 1 &&
      validateDreamerV2ImpairmentShape(value.representedImpairments[0]));
};

export const validateDreamerTargetChosenV2PayloadShape = (value: unknown): DreamerV2ValidationResult => {
  if (!hasExactDataProperties(value, targetKeys)) return invalid("DreamerTargetChosenV2 payload must have exact runtime shape");
  if (value.targetChoiceSchemaVersion !== DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION || value.nightNumber !== 1 ||
      value.taskType !== "DREAMER_ACTION" || value.decisionKind !== "CHOOSE_PLAYER" ||
      typeof value.rulesBaselineVersion !== "string" || typeof value.taskId !== "string" ||
      typeof value.opportunityId !== "string" || typeof value.targetPlayerId !== "string" ||
      typeof value.targetSeatNumber !== "number" || !Number.isInteger(value.targetSeatNumber) ||
      value.targetSeatNumber < 1 || value.targetSeatNumber > 12 ||
      !isRevision(value.settlementCharacterStateRevision) ||
      !validateDreamerV2SourceContractShapeForInternalUse(value.sourceContract).valid) {
    return invalid("DreamerTargetChosenV2 payload contains invalid values");
  }
  const task = parseCanonicalDreamerV2TaskId(value.taskId);
  const choice = parseDreamerV2TargetChoiceId(value.targetChoiceId);
  const sourceContract = value.sourceContract as DreamerV2SourceContract;
  if (!task.valid || !choice.valid || choice.taskId !== task.taskId || choice.sourceKind !== task.sourceKind ||
      sourceContract.taskId !== task.taskId) {
    return invalid("DreamerTargetChosenV2 payload identities do not match its task");
  }
  return { valid: true };
};

export const validateDreamerInformationDeliveredV2PayloadShape = (value: unknown): DreamerV2ValidationResult => {
  if (!hasExactDataProperties(value, deliveryKeys)) return invalid("DreamerInformationDeliveredV2 payload must have exact runtime shape");
  if (value.deliverySchemaVersion !== DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION || value.nightNumber !== 1 ||
      value.taskType !== "DREAMER_ACTION" || value.resolutionModelVersion !== DREAMER_V2_RESOLUTION_MODEL_VERSION ||
      value.simulationPolicyVersion !== DREAMER_V2_SIMULATION_POLICY_VERSION ||
      value.knowledgeModelVersion !== DREAMER_V2_INFORMATION_MODEL_VERSION || value.knowledgeStage !== DREAMER_V2_INFORMATION_STAGE ||
      !isCanonicalString(value.rulesBaselineVersion) || !isCanonicalString(value.taskId) || !isCanonicalString(value.opportunityId) ||
      !isRevision(value.settlementCharacterStateRevision) || !validateDreamerV2SourceContractShapeForInternalUse(value.sourceContract).valid ||
      !validateDreamerV2TargetTruthShape(value.targetTruth) || !validateDreamerV2CandidateDomainShape(value.candidateDomain) ||
      !validateDreamerV2SourceEffectivenessShape(value.sourceEffectiveness) || !validateDreamerV2VortoxConstraintShape(value.vortoxConstraint) ||
      !hasExactDreamerRoleShape(value.selectedGoodRole) || !hasExactDreamerRoleShape(value.selectedEvilRole) ||
      value.selectedGoodRole.defaultAlignment !== "GOOD" || value.selectedEvilRole.defaultAlignment !== "EVIL" ||
      (value.truthOutcome !== "TARGET_INCLUDED" && value.truthOutcome !== "TARGET_EXCLUDED")) {
    return invalid("DreamerInformationDeliveredV2 payload contains invalid values");
  }
  const task = parseCanonicalDreamerV2TaskId(value.taskId);
  const choice = parseDreamerV2TargetChoiceId(value.targetChoiceId);
  const delivery = parseDreamerV2DeliveryId(value.deliveryId);
  const sourceContract = value.sourceContract as DreamerV2SourceContract;
  if (!task.valid || !choice.valid || !delivery.valid || choice.taskId !== task.taskId || delivery.taskId !== task.taskId ||
      choice.sourceKind !== task.sourceKind || delivery.sourceKind !== task.sourceKind || sourceContract.taskId !== task.taskId) {
    return invalid("DreamerInformationDeliveredV2 payload identities do not match its task");
  }
  return { valid: true };
};

const cloneCanonical = <T>(value: T): T => structuredClone(value);

export const cloneDreamerTargetChoiceSetV1V2 = (
  state: DreamerTargetChoiceSet | undefined
): DreamerTargetChoiceSet => ({ choices: state?.choices.map(cloneCanonical) ?? [] });

export const cloneDreamerInformationSetV1V2 = (
  state: DreamerInformationSet | undefined
): DreamerInformationSet => ({ deliveries: state?.deliveries.map(cloneCanonical) ?? [] });

export const appendDreamerTargetChoiceV2 = (
  state: DreamerTargetChoiceSet | undefined,
  payload: DreamerTargetChosenV2Payload
): DreamerTargetChoiceSet => ({
  choices: [...cloneDreamerTargetChoiceSetV1V2(state).choices, cloneCanonical(payload)]
});

export const appendDreamerTargetChoiceV1V2 = (
  state: DreamerTargetChoiceSet | undefined,
  payload: DreamerTargetChoice
): DreamerTargetChoiceSet => ({
  choices: [...cloneDreamerTargetChoiceSetV1V2(state).choices, cloneCanonical(payload)]
});

export const appendDreamerInformationDeliveryV2 = (
  state: DreamerInformationSet | undefined,
  payload: DreamerInformationDeliveredV2Payload
): DreamerInformationSet => ({
  deliveries: [...cloneDreamerInformationSetV1V2(state).deliveries, cloneCanonical(payload)]
});

export const appendDreamerInformationDeliveryV1V2 = (
  state: DreamerInformationSet | undefined,
  payload: DreamerInformationDelivery
): DreamerInformationSet => ({
  deliveries: [...cloneDreamerInformationSetV1V2(state).deliveries, cloneCanonical(payload)]
});

export const hasDreamerInformationForSettlementV1V2 = (
  deliveries: DreamerInformationSet | undefined,
  settlement: Pick<ScheduledTaskSettlement, "taskId" | "taskType" | "outcomeType" | "characterStateRevision">
): boolean => settlement.taskType === "DREAMER_ACTION" && settlement.outcomeType === "DREAMER_INFORMATION_DELIVERED" &&
  (deliveries?.deliveries.some((delivery) => delivery.taskId === settlement.taskId &&
    (isDreamerInformationDeliveredV2Payload(delivery)
      ? delivery.settlementCharacterStateRevision
      : delivery.sourceCharacterStateRevision) === settlement.characterStateRevision) ?? false);

export const validateDreamerTargetChoiceSetV1V2 = (value: unknown): DreamerV2ValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["choices"]) || !Array.isArray(value.choices) ||
      !isCanonicalDataValue(value.choices)) return invalid("Dreamer target choice set must be one dense canonical choices array");
  const identities = new Set<string>();
  const taskIds = new Set<string>();
  for (const choice of value.choices as readonly unknown[]) {
    const v1Validation = validateDreamerTargetChosenV1PayloadShape(choice);
    const v2Validation = validateDreamerTargetChosenV2PayloadShape(choice);
    if (v1Validation.valid === v2Validation.valid) return invalid("Dreamer target choice must match exactly one V1 or V2 variant");
    const variant = v2Validation.valid
      ? choice as DreamerTargetChosenV2Payload
      : choice as DreamerTargetChosenPayload;
    const taskId = variant.taskId;
    if (taskIds.has(taskId)) return invalid("Dreamer target choice tasks must be unique across V1 and V2");
    taskIds.add(taskId);
    const identity = v2Validation.valid
      ? (variant as DreamerTargetChosenV2Payload).targetChoiceId
      : `${variant.taskId}:${variant.opportunityId}`;
    if (identities.has(identity)) return invalid("Dreamer target choice identities must be unique");
    identities.add(identity);
  }
  return { valid: true };
};

export const validateDreamerInformationSetV1V2 = (value: unknown): DreamerV2ValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["deliveries"]) || !Array.isArray(value.deliveries) ||
      !isCanonicalDataValue(value.deliveries)) return invalid("Dreamer information set must be one dense canonical deliveries array");
  const identities = new Set<string>();
  const taskIds = new Set<string>();
  const sourceIdentities = new Set<string>();
  for (const delivery of value.deliveries as readonly unknown[]) {
    const v1Validation = validateDreamerInformationDeliveredV1PayloadShape(delivery);
    const v2Validation = validateDreamerInformationDeliveredV2PayloadShape(delivery);
    if (v1Validation.valid === v2Validation.valid) return invalid("Dreamer delivery must match exactly one V1 or V2 variant");
    const variant = v2Validation.valid
      ? delivery as DreamerInformationDeliveredV2Payload
      : delivery as DreamerInformationDeliveredPayload;
    const taskId = variant.taskId;
    if (taskIds.has(taskId)) return invalid("Dreamer delivery tasks must be unique across V1 and V2");
    taskIds.add(taskId);
    const sourcePlayerId = v2Validation.valid
      ? (variant as DreamerInformationDeliveredV2Payload).sourceContract.sourcePlayerId
      : (variant as DreamerInformationDeliveredPayload).sourcePlayerId;
    if (sourcePlayerId !== undefined) {
      if (sourceIdentities.has(sourcePlayerId)) return invalid("Dreamer delivery source identities must be unique");
      sourceIdentities.add(sourcePlayerId);
    }
    const identity = v2Validation.valid
      ? (variant as DreamerInformationDeliveredV2Payload).deliveryId
      : `${variant.taskId}:${variant.opportunityId}`;
    if (identities.has(identity)) return invalid("Dreamer delivery identities must be unique");
    identities.add(identity);
  }
  return { valid: true };
};

export const sameDreamerTargetChosenV2Payload = (
  left: DreamerTargetChosenV2Payload,
  right: DreamerTargetChosenV2Payload
): boolean => sameCanonicalDataValue(left, right);

export const sameDreamerInformationDeliveredV2Payload = (
  left: DreamerInformationDeliveredV2Payload,
  right: DreamerInformationDeliveredV2Payload
): boolean => sameCanonicalDataValue(left, right);
