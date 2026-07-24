import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import { DomainError } from "./errors.js";
import type { FirstNightActionOpportunityState } from "./first-night-action-opportunity.js";
import type {
  BaseDreamerV2SourceContract,
  DreamerActionOpportunityV3,
  DreamerActionOpportunityV4,
  PhilosopherGainedDreamerSourceContractV1
} from "./first-night-action-opportunity.js";
import {
  DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
  DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION,
  findFirstNightActionOpportunityById,
  isDreamerActionOpportunityV3,
  isDreamerActionOpportunityV4,
  hasExactPhilosopherGainedDreamerSourceContractV1Shape,
  parseBaseDreamerV2FirstNightActionOpportunityId,
  validateFirstNightActionOpportunityStateShape
} from "./first-night-action-opportunity.js";
import {
  SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  getNextUnsettledFirstNightTask,
  isFirstNightTaskSettled,
  roleScheduledTaskId,
  validateFirstNightTaskProgress
} from "./first-night-task-plan.js";
import type {
  FirstNightTaskPlan,
  FirstNightTaskProgress,
  ScheduledTaskSettlement
} from "./first-night-task-plan.js";
import type { AbilityImpairmentId, ActionOpportunityId, PlayerId, RoleId, RoleTenureId, ScheduledTaskId } from "./ids.js";
import type { KnownPlayerReference } from "./initial-private-knowledge.js";
import {
  hasExactEnumerableKeys,
  hasExactKnownPlayerReferenceShape,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord
} from "./initial-private-knowledge.js";
import type { AbilityImpairmentSet } from "./philosopher-ability.js";
import type { PlayerRoster, SeatNumber } from "./player-roster.js";
import type { DefaultAlignment, GeneratedSetup, RoleSetupSnapshot } from "./setup-types.js";
import { compareStableId, sameRoleSetupSnapshot } from "./setup-types.js";
import {
  findUniqueActiveRoleTenure,
  isRoleTenureContinuousAcross,
  parseRoleTenureId,
  validateRoleTenureStateExact
} from "./seamstress.js";
import type { RoleTenureRecord, RoleTenureState } from "./seamstress.js";
import {
  formatBaseFirstNightAbilityInstanceId,
  parseFirstNightAbilityInstanceId
} from "./first-night-ability-outcome-ledger.js";
import type { FirstNightAbilityInstanceId } from "./first-night-ability-outcome-ledger.js";

export const SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION = "dreamer-information-model-v1" as const;
export const DREAMER_INFORMATION_STAGE = "DREAMER_INFORMATION" as const;
export const DREAMER_FALSE_ROLE_POLICY_VERSION = "dreamer-false-role-policy-v1" as const;
export const DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION = "dreamer-target-chosen-v2" as const;
export const DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION = "dreamer-target-chosen-v3" as const;
export const DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION = "dreamer-information-delivered-v2" as const;
export const DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION = "dreamer-information-delivered-v3" as const;
export const DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION = "dreamer-information-delivered-v4" as const;
export const DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION = "dreamer-information-delivered-v5" as const;
export const DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION = "dreamer-information-delivered-v6" as const;
export const DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION = "dreamer-information-delivered-v7" as const;
export const DREAMER_APPARENT_PAIR_CANDIDATE_MODEL_VERSION = "dreamer-apparent-pair-candidate-model-v1" as const;
export const DREAMER_CANONICAL_DRUNK_PAIR_SELECTION_POLICY_VERSION = "dreamer-canonical-drunk-pair-selection-policy-v1" as const;
export const DREAMER_NON_VORTOX_CURRENT_DEMON_CONSTRAINT_VERSION = "dreamer-non-vortox-current-demon-constraint-v1" as const;
export const DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION = "dreamer-base-source-effectiveness-v1" as const;
export const DREAMER_VORTOX_CONSTRAINT_VERSION = "dreamer-vortox-constraint-v1" as const;

const isExceptionSafeCanonicalDreamerData = (value: unknown): boolean => {
  const visited = new WeakSet<object>();
  const inspect = (candidate: unknown): boolean => {
    if (candidate === null) return true;
    if (typeof candidate === "string" || typeof candidate === "boolean") return true;
    if (typeof candidate === "number") return Number.isFinite(candidate);
    if (typeof candidate !== "object") return false;
    if (visited.has(candidate)) return false;

    try {
      if (Array.isArray(candidate)) {
        visited.add(candidate);
        for (let index = 0; index < candidate.length; index += 1) {
          if (!Object.hasOwn(candidate, index) || !inspect(candidate[index])) return false;
        }
        return Reflect.ownKeys(candidate).every((key) =>
          key === "length" || typeof key === "string" && /^\d+$/.test(key));
      }
      const prototype = Object.getPrototypeOf(candidate) as unknown;
      if (prototype !== Object.prototype && prototype !== null) return false;
      const keys = Reflect.ownKeys(candidate);
      if (keys.some((key) => typeof key === "symbol")) return false;
      visited.add(candidate);
      for (const key of keys) {
        const descriptor = Object.getOwnPropertyDescriptor(candidate, key);
        if (descriptor === undefined || !descriptor.enumerable || !("value" in descriptor) ||
            !inspect(descriptor.value)) return false;
      }
      return true;
    } catch {
      return false;
    }
  };
  return inspect(value);
};

export type DreamerActionDecision = {
  readonly kind: "CHOOSE_PLAYER";
  readonly targetPlayerId: PlayerId;
};

export type DreamerIneffectiveReason = "SOURCE_DRUNK" | "SOURCE_POISONED";

export type DreamerInformationReliability =
  | {
      readonly kind: "EFFECTIVE";
    }
  | {
      readonly kind: "SOURCE_IMPAIRED";
      readonly reason: DreamerIneffectiveReason;
      readonly sourceImpairmentId: AbilityImpairmentId;
      readonly sourceImpairmentKind: "DRUNK" | "POISONED";
    };

export type DreamerTargetChosenPayloadV1 = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
};

export type DreamerTargetChosenPayloadV2 = {
  readonly rulesBaselineVersion: string;
  readonly targetSchemaVersion: typeof DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion: typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
};

export type DreamerTargetChosenPayloadV3 = {
  readonly rulesBaselineVersion: string;
  readonly targetSchemaVersion: typeof DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion: typeof DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceContract: PhilosopherGainedDreamerSourceContractV1;
  readonly abilityRoleId: "dreamer";
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
};

export type DreamerTargetChosenPayload = DreamerTargetChosenPayloadV1 | DreamerTargetChosenPayloadV2 | DreamerTargetChosenPayloadV3;

export type DreamerInformationDeliveredPayloadV1 = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly knowledgeModelVersion: typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: DreamerInformationReliability;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: typeof DREAMER_FALSE_ROLE_POLICY_VERSION;
};

export type DreamerInformationDeliveredPayloadV2 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion: typeof DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion: typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly knowledgeModelVersion: typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: { readonly kind: "EFFECTIVE" };
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: typeof DREAMER_FALSE_ROLE_POLICY_VERSION;
};

export type DreamerVortoxInformationReliability = {
  readonly kind: "VORTOX_FORCED_FALSE";
};

export type DreamerVortoxConstraint = {
  readonly constraintVersion: typeof DREAMER_VORTOX_CONSTRAINT_VERSION;
  readonly kind: "VORTOX_FORCED_FALSE_REQUIRED";
  readonly vortoxPlayerId: PlayerId;
  readonly vortoxSeatNumber: SeatNumber;
  readonly vortoxRoleId: "vortox";
  readonly vortoxRoleTenureId: RoleTenureId;
  readonly evaluatedCharacterStateRevision: number;
};

export type DreamerInformationDeliveredPayloadV3 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion: typeof DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion: typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly knowledgeModelVersion: typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: DreamerVortoxInformationReliability;
  readonly vortoxConstraint: DreamerVortoxConstraint;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: typeof DREAMER_FALSE_ROLE_POLICY_VERSION;
};

export type DreamerCanonicalPhilosopherDrunkSourceImpairment = {
  readonly impairmentId: AbilityImpairmentId;
  readonly kind: "DRUNK";
  readonly sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE";
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRole: RoleSetupSnapshot;
  readonly chosenRoleId: "dreamer";
  readonly sourceCharacterStateRevision: number;
};

export type DreamerCanonicalDrunkVortoxInformationReliability = {
  readonly kind: "VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK";
};

export type DreamerInformationDeliveredPayloadV4 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion: typeof DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion: typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly knowledgeModelVersion: typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: DreamerCanonicalDrunkVortoxInformationReliability;
  readonly sourceImpairment: DreamerCanonicalPhilosopherDrunkSourceImpairment;
  readonly vortoxConstraint: DreamerVortoxConstraint;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: typeof DREAMER_FALSE_ROLE_POLICY_VERSION;
};

export type PhilosopherGainedDreamerEffectiveReliability = {
  readonly kind: "PHILOSOPHER_GAINED_EFFECTIVE";
};

export type PhilosopherGainedDreamerVortoxReliability = {
  readonly kind: "VORTOX_FORCED_FALSE";
};

export type DreamerInformationDeliveredPayloadV5 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion: typeof DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion: typeof DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION;
  readonly knowledgeModelVersion: typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceContract: PhilosopherGainedDreamerSourceContractV1;
  readonly abilityRoleId: "dreamer";
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: PhilosopherGainedDreamerEffectiveReliability;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: typeof DREAMER_FALSE_ROLE_POLICY_VERSION;
};

export type DreamerInformationDeliveredPayloadV6 = Omit<DreamerInformationDeliveredPayloadV5,
  "deliverySchemaVersion" | "informationReliability"> & {
  readonly deliverySchemaVersion: typeof DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION;
  readonly informationReliability: PhilosopherGainedDreamerVortoxReliability;
  readonly vortoxConstraint: DreamerVortoxConstraint;
};

export type DreamerApparentPairCandidateId = string & {
  readonly __brand: "DreamerApparentPairCandidateId";
};

export type DreamerApparentPairCandidate = {
  readonly candidateId: DreamerApparentPairCandidateId;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly truthClassification: "TRUE" | "FALSE";
};

export type DreamerApparentPairDecision = {
  readonly candidateModelVersion: typeof DREAMER_APPARENT_PAIR_CANDIDATE_MODEL_VERSION;
  readonly simulationPolicyVersion: typeof DREAMER_CANONICAL_DRUNK_PAIR_SELECTION_POLICY_VERSION;
  readonly legalCandidates: readonly DreamerApparentPairCandidate[];
  readonly selectedCandidateId: DreamerApparentPairCandidateId;
};

export type DreamerNonVortoxCurrentDemonConstraint = {
  readonly constraintVersion: typeof DREAMER_NON_VORTOX_CURRENT_DEMON_CONSTRAINT_VERSION;
  readonly kind: "UNIQUE_CURRENT_FANG_GU";
  readonly demonPlayerId: PlayerId;
  readonly demonSeatNumber: SeatNumber;
  readonly demonRole: RoleSetupSnapshot;
  readonly evaluatedCharacterStateRevision: number;
};

export type DreamerCanonicalDrunkApparentInformationReliability = {
  readonly kind: "CANONICAL_SOURCE_DRUNK_APPARENT_INFORMATION";
};

export type DreamerInformationDeliveredPayloadV7 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion: typeof DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion: typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly knowledgeModelVersion: typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: DreamerCanonicalDrunkApparentInformationReliability;
  readonly sourceImpairment: DreamerCanonicalPhilosopherDrunkSourceImpairment;
  readonly currentDemonConstraint: DreamerNonVortoxCurrentDemonConstraint;
  readonly apparentPairDecision: DreamerApparentPairDecision;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
};

export type DreamerInformationDeliveredPayload =
  | DreamerInformationDeliveredPayloadV1
  | DreamerInformationDeliveredPayloadV2
  | DreamerInformationDeliveredPayloadV3
  | DreamerInformationDeliveredPayloadV4
  | DreamerInformationDeliveredPayloadV5
  | DreamerInformationDeliveredPayloadV6
  | DreamerInformationDeliveredPayloadV7;

export type DreamerIneffectiveInformationDeliveredPayload = DreamerInformationDeliveredPayloadV1 & {
  readonly informationReliability: Extract<DreamerInformationReliability, { readonly kind: "SOURCE_IMPAIRED" }>;
};

export type BaseDreamerV2NormalCapability =
  | {
      readonly kind: "NORMAL_INFORMATION_SUPPORTED";
      readonly evaluationModelVersion: typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
    }
  | {
      readonly kind: "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
      readonly evaluationModelVersion: typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
      readonly vortoxConstraint: DreamerVortoxConstraint;
    }
  | {
      readonly kind: "CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
      readonly evaluationModelVersion: typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
      readonly sourceImpairment: DreamerCanonicalPhilosopherDrunkSourceImpairment;
      readonly vortoxConstraint: DreamerVortoxConstraint;
    }
  | {
      readonly kind: "CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED";
      readonly evaluationModelVersion: typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
      readonly sourceImpairment: DreamerCanonicalPhilosopherDrunkSourceImpairment;
      readonly currentDemonConstraint: DreamerNonVortoxCurrentDemonConstraint;
    }
  | { readonly kind: "SOURCE_REPRESENTED_IMPAIRED"; readonly impairmentId: AbilityImpairmentId; readonly impairmentKind: "DRUNK" | "POISONED" }
  | { readonly kind: "NO_DASHII_EFFECT_UNRESOLVED"; readonly noDashiiPlayerId: PlayerId; readonly noDashiiSeatNumber: SeatNumber }
  | {
      readonly kind: "EFFECTIVENESS_UNRESOLVED";
      readonly reason:
        | "SOURCE_PROVENANCE_INVALID"
        | "SOURCE_IMPAIRMENT_CONFLICT"
        | "CURRENT_DEMON_IDENTITY_NOT_UNIQUE"
        | "CURRENT_DEMON_CATALOG_MISMATCH"
        | "VORTOX_TENURE_MISSING_OR_INCONSISTENT"
        | "VORTOX_EFFECTIVENESS_CONFLICT";
    };

export type PhilosopherGainedDreamerCapability =
  | {
      readonly kind: "NORMAL_INFORMATION_SUPPORTED";
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
    }
  | {
      readonly kind: "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
      readonly vortoxConstraint: DreamerVortoxConstraint;
    }
  | { readonly kind: "SOURCE_REPRESENTED_IMPAIRED" }
  | { readonly kind: "EFFECTIVENESS_UNRESOLVED" };

export type DreamerInformationEntry = {
  readonly sourcePlayerId: PlayerId;
  readonly target: KnownPlayerReference;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
};

export type DreamerTargetChoiceSet = {
  readonly choices: readonly DreamerTargetChosenPayload[];
};

export type DreamerInformationSet = {
  readonly deliveries: readonly DreamerInformationDeliveredPayload[];
};

export type DreamerEffectivenessResult =
  | {
      readonly effective: true;
    }
  | {
      readonly effective: false;
      readonly reason: DreamerIneffectiveReason;
      readonly impairmentId: AbilityImpairmentId;
      readonly impairmentKind: "DRUNK" | "POISONED";
    };

type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

type DreamerInformationPayloadShapeResult =
  | { readonly valid: true; readonly payload: DreamerInformationDeliveredPayload }
  | { readonly valid: false; readonly reason: string };

type DreamerActionInput = {
  readonly taskId: ScheduledTaskId;
  readonly firstNightTaskPlan: Pick<FirstNightTaskPlan, "tasks">;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  readonly roster: PlayerRoster;
};

const DREAMER_ROLE_ID = "dreamer" as RoleId;
const DREAMER_DECISION_KEYS = ["kind", "targetPlayerId"] as const;
const DREAMER_TARGET_CHOSEN_PAYLOAD_KEYS = [
  "decisionKind",
  "nightNumber",
  "opportunityId",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSeatNumber",
  "taskId",
  "taskType"
] as const;
const DREAMER_TARGET_CHOSEN_V2_PAYLOAD_KEYS = [
  "decisionKind",
  "nightNumber",
  "opportunityId",
  "opportunitySchemaVersion",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourceContract",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSchemaVersion",
  "targetSeatNumber",
  "taskId",
  "taskType"
] as const;
const DREAMER_TARGET_CHOSEN_V3_PAYLOAD_KEYS = [
  "abilityRoleId",
  "decisionKind",
  "evaluatedCharacterStateRevision",
  "nightNumber",
  "opportunityId",
  "opportunitySchemaVersion",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourceContract",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSchemaVersion",
  "targetSeatNumber",
  "taskId",
  "taskType"
] as const;
const DREAMER_EFFECTIVE_RELIABILITY_KEYS = ["kind"] as const;
const DREAMER_IMPAIRED_RELIABILITY_KEYS = [
  "kind",
  "reason",
  "sourceImpairmentId",
  "sourceImpairmentKind"
] as const;
const DREAMER_VORTOX_RELIABILITY_KEYS = ["kind"] as const;
const DREAMER_CANONICAL_DRUNK_VORTOX_RELIABILITY_KEYS = ["kind"] as const;
const DREAMER_INFORMATION_DELIVERED_PAYLOAD_KEYS = [
  "evilRole",
  "falseRolePolicyVersion",
  "goodRole",
  "informationReliability",
  "knowledgeModelVersion",
  "knowledgeStage",
  "nightNumber",
  "opportunityId",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSeatNumber",
  "taskId",
  "taskType"
] as const;
const DREAMER_INFORMATION_DELIVERED_V2_PAYLOAD_KEYS = [
  "deliverySchemaVersion",
  "evilRole",
  "falseRolePolicyVersion",
  "goodRole",
  "informationReliability",
  "knowledgeModelVersion",
  "knowledgeStage",
  "nightNumber",
  "opportunityId",
  "opportunitySchemaVersion",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourceContract",
  "sourcePlayerId",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSeatNumber",
  "taskId",
  "taskType"
] as const;
const DREAMER_INFORMATION_DELIVERED_V3_PAYLOAD_KEYS = [
  "deliverySchemaVersion",
  "evilRole",
  "falseRolePolicyVersion",
  "goodRole",
  "informationReliability",
  "knowledgeModelVersion",
  "knowledgeStage",
  "nightNumber",
  "opportunityId",
  "opportunitySchemaVersion",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourceContract",
  "sourcePlayerId",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSeatNumber",
  "taskId",
  "taskType",
  "vortoxConstraint"
] as const;
const DREAMER_INFORMATION_DELIVERED_V4_PAYLOAD_KEYS = [
  "deliverySchemaVersion",
  "evaluatedCharacterStateRevision",
  "evilRole",
  "falseRolePolicyVersion",
  "goodRole",
  "informationReliability",
  "knowledgeModelVersion",
  "knowledgeStage",
  "nightNumber",
  "opportunityId",
  "opportunitySchemaVersion",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourceContract",
  "sourceImpairment",
  "sourcePlayerId",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSeatNumber",
  "taskId",
  "taskType",
  "vortoxConstraint"
] as const;
const DREAMER_INFORMATION_DELIVERED_V5_PAYLOAD_KEYS = [
  "abilityRoleId",
  "deliverySchemaVersion",
  "evaluatedCharacterStateRevision",
  "evilRole",
  "falseRolePolicyVersion",
  "goodRole",
  "informationReliability",
  "knowledgeModelVersion",
  "knowledgeStage",
  "nightNumber",
  "opportunityId",
  "opportunitySchemaVersion",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourceContract",
  "sourcePlayerId",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSeatNumber",
  "taskId",
  "taskType"
] as const;
const DREAMER_INFORMATION_DELIVERED_V6_PAYLOAD_KEYS = [
  ...DREAMER_INFORMATION_DELIVERED_V5_PAYLOAD_KEYS,
  "vortoxConstraint"
] as const;
const DREAMER_INFORMATION_DELIVERED_V7_PAYLOAD_KEYS = [
  "apparentPairDecision",
  "currentDemonConstraint",
  "deliverySchemaVersion",
  "evaluatedCharacterStateRevision",
  "evilRole",
  "goodRole",
  "informationReliability",
  "knowledgeModelVersion",
  "knowledgeStage",
  "nightNumber",
  "opportunityId",
  "opportunitySchemaVersion",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourceContract",
  "sourceImpairment",
  "sourcePlayerId",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSeatNumber",
  "taskId",
  "taskType"
] as const;
const DREAMER_APPARENT_PAIR_CANDIDATE_KEYS = ["candidateId", "evilRole", "goodRole", "truthClassification"] as const;
const DREAMER_APPARENT_PAIR_DECISION_KEYS = [
  "candidateModelVersion", "legalCandidates", "selectedCandidateId", "simulationPolicyVersion"
] as const;
const DREAMER_NON_VORTOX_CURRENT_DEMON_CONSTRAINT_KEYS = [
  "constraintVersion", "demonPlayerId", "demonRole", "demonSeatNumber", "evaluatedCharacterStateRevision", "kind"
] as const;
const PHILOSOPHER_GAINED_DREAMER_EFFECTIVE_RELIABILITY_KEYS = ["kind"] as const;
const PHILOSOPHER_GAINED_DREAMER_VORTOX_RELIABILITY_KEYS = ["kind"] as const;
const DREAMER_CANONICAL_DRUNK_SOURCE_IMPAIRMENT_KEYS = [
  "affectedPlayerId",
  "affectedRole",
  "affectedSeatNumber",
  "chosenRoleId",
  "impairmentId",
  "kind",
  "sourceCharacterStateRevision",
  "sourceKind",
  "sourcePlayerId"
] as const;
const DREAMER_VORTOX_CONSTRAINT_KEYS = [
  "constraintVersion",
  "evaluatedCharacterStateRevision",
  "kind",
  "vortoxPlayerId",
  "vortoxRoleId",
  "vortoxRoleTenureId",
  "vortoxSeatNumber"
] as const;
const DREAMER_SETTLEMENT_KEYS = [
  "characterStateRevision",
  "nightNumber",
  "outcomeType",
  "settlementVersion",
  "taskId",
  "taskType"
] as const;

const fail = (reason: string): ValidationResult => ({ valid: false, reason });
const shapeFail = (reason: string): DreamerInformationPayloadShapeResult => ({ valid: false, reason });

const clonePhilosopherGainedDreamerSourceContract = (
  source: PhilosopherGainedDreamerSourceContractV1
): PhilosopherGainedDreamerSourceContractV1 => ({
  ...source,
  abilityInstance: { ...source.abilityInstance },
  grantReference: { ...source.grantReference },
  taskInsertionReference: { ...source.taskInsertionReference }
});

const cloneTargetChoice = (choice: DreamerTargetChosenPayload): DreamerTargetChosenPayload =>
  "targetSchemaVersion" in choice
    ? choice.targetSchemaVersion === DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION
      ? {
        rulesBaselineVersion: choice.rulesBaselineVersion,
        targetSchemaVersion: choice.targetSchemaVersion,
        nightNumber: choice.nightNumber,
        taskId: choice.taskId,
        taskType: choice.taskType,
        opportunityId: choice.opportunityId,
        opportunitySchemaVersion: choice.opportunitySchemaVersion,
        decisionKind: choice.decisionKind,
        sourcePlayerId: choice.sourcePlayerId,
        sourceSeatNumber: choice.sourceSeatNumber,
        sourceRole: cloneRoleSetupSnapshot(choice.sourceRole),
        sourceCharacterStateRevision: choice.sourceCharacterStateRevision,
        evaluatedCharacterStateRevision: choice.evaluatedCharacterStateRevision,
        sourceContract: clonePhilosopherGainedDreamerSourceContract(choice.sourceContract),
        abilityRoleId: choice.abilityRoleId,
        targetPlayerId: choice.targetPlayerId,
        targetSeatNumber: choice.targetSeatNumber
      }
      : {
        rulesBaselineVersion: choice.rulesBaselineVersion,
        targetSchemaVersion: choice.targetSchemaVersion,
        nightNumber: choice.nightNumber,
        taskId: choice.taskId,
        taskType: choice.taskType,
        opportunityId: choice.opportunityId,
        opportunitySchemaVersion: choice.opportunitySchemaVersion,
        decisionKind: choice.decisionKind,
        sourcePlayerId: choice.sourcePlayerId,
        sourceSeatNumber: choice.sourceSeatNumber,
        sourceRole: cloneRoleSetupSnapshot(choice.sourceRole),
        sourceCharacterStateRevision: choice.sourceCharacterStateRevision,
        sourceContract: { ...choice.sourceContract },
        targetPlayerId: choice.targetPlayerId,
        targetSeatNumber: choice.targetSeatNumber
      }
    : {
        rulesBaselineVersion: choice.rulesBaselineVersion,
        nightNumber: choice.nightNumber,
        taskId: choice.taskId,
        taskType: choice.taskType,
        opportunityId: choice.opportunityId,
        decisionKind: choice.decisionKind,
        sourcePlayerId: choice.sourcePlayerId,
        sourceSeatNumber: choice.sourceSeatNumber,
        sourceRole: cloneRoleSetupSnapshot(choice.sourceRole),
        sourceCharacterStateRevision: choice.sourceCharacterStateRevision,
        targetPlayerId: choice.targetPlayerId,
        targetSeatNumber: choice.targetSeatNumber
      };

const cloneReliability = (reliability: DreamerInformationReliability): DreamerInformationReliability =>
  reliability.kind === "EFFECTIVE"
    ? { kind: "EFFECTIVE" }
    : {
        kind: "SOURCE_IMPAIRED",
        reason: reliability.reason,
        sourceImpairmentId: reliability.sourceImpairmentId,
        sourceImpairmentKind: reliability.sourceImpairmentKind
      };

const cloneApparentPairCandidate = (
  candidate: DreamerApparentPairCandidate
): DreamerApparentPairCandidate => ({
  candidateId: candidate.candidateId,
  goodRole: cloneRoleSetupSnapshot(candidate.goodRole),
  evilRole: cloneRoleSetupSnapshot(candidate.evilRole),
  truthClassification: candidate.truthClassification
});

const cloneInformationDelivery = (delivery: DreamerInformationDeliveredPayload): DreamerInformationDeliveredPayload =>
  "deliverySchemaVersion" in delivery && delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION
    ? {
        ...delivery,
        sourceContract: { ...delivery.sourceContract },
        informationReliability: { kind: "CANONICAL_SOURCE_DRUNK_APPARENT_INFORMATION" },
        sourceImpairment: {
          ...delivery.sourceImpairment,
          affectedRole: cloneRoleSetupSnapshot(delivery.sourceImpairment.affectedRole)
        },
        currentDemonConstraint: {
          ...delivery.currentDemonConstraint,
          demonRole: cloneRoleSetupSnapshot(delivery.currentDemonConstraint.demonRole)
        },
        apparentPairDecision: {
          ...delivery.apparentPairDecision,
          legalCandidates: delivery.apparentPairDecision.legalCandidates.map(cloneApparentPairCandidate)
        },
        goodRole: cloneRoleSetupSnapshot(delivery.goodRole),
        evilRole: cloneRoleSetupSnapshot(delivery.evilRole)
      }
    : "deliverySchemaVersion" in delivery && delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION
    ? {
        ...delivery,
        sourceContract: clonePhilosopherGainedDreamerSourceContract(delivery.sourceContract),
        informationReliability: { kind: "VORTOX_FORCED_FALSE" },
        vortoxConstraint: { ...delivery.vortoxConstraint },
        goodRole: cloneRoleSetupSnapshot(delivery.goodRole),
        evilRole: cloneRoleSetupSnapshot(delivery.evilRole)
      }
    : "deliverySchemaVersion" in delivery && delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION
    ? {
        ...delivery,
        sourceContract: clonePhilosopherGainedDreamerSourceContract(delivery.sourceContract),
        informationReliability: { kind: "PHILOSOPHER_GAINED_EFFECTIVE" },
        goodRole: cloneRoleSetupSnapshot(delivery.goodRole),
        evilRole: cloneRoleSetupSnapshot(delivery.evilRole)
      }
    : "deliverySchemaVersion" in delivery && delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION
    ? {
        rulesBaselineVersion: delivery.rulesBaselineVersion,
        deliverySchemaVersion: delivery.deliverySchemaVersion,
        nightNumber: delivery.nightNumber,
        taskId: delivery.taskId,
        taskType: delivery.taskType,
        opportunityId: delivery.opportunityId,
        opportunitySchemaVersion: delivery.opportunitySchemaVersion,
        knowledgeModelVersion: delivery.knowledgeModelVersion,
        knowledgeStage: delivery.knowledgeStage,
        sourcePlayerId: delivery.sourcePlayerId,
        sourceSeatNumber: delivery.sourceSeatNumber,
        sourceCharacterStateRevision: delivery.sourceCharacterStateRevision,
        evaluatedCharacterStateRevision: delivery.evaluatedCharacterStateRevision,
        sourceContract: { ...delivery.sourceContract },
        targetPlayerId: delivery.targetPlayerId,
        targetSeatNumber: delivery.targetSeatNumber,
        informationReliability: { kind: "VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK" },
        sourceImpairment: {
          impairmentId: delivery.sourceImpairment.impairmentId,
          kind: delivery.sourceImpairment.kind,
          sourceKind: delivery.sourceImpairment.sourceKind,
          sourcePlayerId: delivery.sourceImpairment.sourcePlayerId,
          affectedPlayerId: delivery.sourceImpairment.affectedPlayerId,
          affectedSeatNumber: delivery.sourceImpairment.affectedSeatNumber,
          affectedRole: cloneRoleSetupSnapshot(delivery.sourceImpairment.affectedRole),
          chosenRoleId: delivery.sourceImpairment.chosenRoleId,
          sourceCharacterStateRevision: delivery.sourceImpairment.sourceCharacterStateRevision
        },
        vortoxConstraint: { ...delivery.vortoxConstraint },
        goodRole: cloneRoleSetupSnapshot(delivery.goodRole),
        evilRole: cloneRoleSetupSnapshot(delivery.evilRole),
        falseRolePolicyVersion: delivery.falseRolePolicyVersion
      }
    : "deliverySchemaVersion" in delivery && delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION
    ? {
        rulesBaselineVersion: delivery.rulesBaselineVersion,
        deliverySchemaVersion: delivery.deliverySchemaVersion,
        nightNumber: delivery.nightNumber,
        taskId: delivery.taskId,
        taskType: delivery.taskType,
        opportunityId: delivery.opportunityId,
        opportunitySchemaVersion: delivery.opportunitySchemaVersion,
        knowledgeModelVersion: delivery.knowledgeModelVersion,
        knowledgeStage: delivery.knowledgeStage,
        sourcePlayerId: delivery.sourcePlayerId,
        sourceSeatNumber: delivery.sourceSeatNumber,
        sourceCharacterStateRevision: delivery.sourceCharacterStateRevision,
        sourceContract: { ...delivery.sourceContract },
        targetPlayerId: delivery.targetPlayerId,
        targetSeatNumber: delivery.targetSeatNumber,
        informationReliability: { kind: "VORTOX_FORCED_FALSE" },
        vortoxConstraint: { ...delivery.vortoxConstraint },
        goodRole: cloneRoleSetupSnapshot(delivery.goodRole),
        evilRole: cloneRoleSetupSnapshot(delivery.evilRole),
        falseRolePolicyVersion: delivery.falseRolePolicyVersion
      }
    : "deliverySchemaVersion" in delivery
    ? {
        rulesBaselineVersion: delivery.rulesBaselineVersion,
        deliverySchemaVersion: delivery.deliverySchemaVersion,
        nightNumber: delivery.nightNumber,
        taskId: delivery.taskId,
        taskType: delivery.taskType,
        opportunityId: delivery.opportunityId,
        opportunitySchemaVersion: delivery.opportunitySchemaVersion,
        knowledgeModelVersion: delivery.knowledgeModelVersion,
        knowledgeStage: delivery.knowledgeStage,
        sourcePlayerId: delivery.sourcePlayerId,
        sourceSeatNumber: delivery.sourceSeatNumber,
        sourceCharacterStateRevision: delivery.sourceCharacterStateRevision,
        sourceContract: { ...delivery.sourceContract },
        targetPlayerId: delivery.targetPlayerId,
        targetSeatNumber: delivery.targetSeatNumber,
        informationReliability: { kind: "EFFECTIVE" },
        goodRole: cloneRoleSetupSnapshot(delivery.goodRole),
        evilRole: cloneRoleSetupSnapshot(delivery.evilRole),
        falseRolePolicyVersion: delivery.falseRolePolicyVersion
      }
    : {
        rulesBaselineVersion: delivery.rulesBaselineVersion,
        nightNumber: delivery.nightNumber,
        taskId: delivery.taskId,
        taskType: delivery.taskType,
        opportunityId: delivery.opportunityId,
        knowledgeModelVersion: delivery.knowledgeModelVersion,
        knowledgeStage: delivery.knowledgeStage,
        sourcePlayerId: delivery.sourcePlayerId,
        sourceSeatNumber: delivery.sourceSeatNumber,
        sourceCharacterStateRevision: delivery.sourceCharacterStateRevision,
        targetPlayerId: delivery.targetPlayerId,
        targetSeatNumber: delivery.targetSeatNumber,
        informationReliability: cloneReliability(delivery.informationReliability),
        goodRole: cloneRoleSetupSnapshot(delivery.goodRole),
        evilRole: cloneRoleSetupSnapshot(delivery.evilRole),
        falseRolePolicyVersion: delivery.falseRolePolicyVersion
      };

export const cloneDreamerTargetChoiceSet = (state: DreamerTargetChoiceSet | undefined): DreamerTargetChoiceSet => ({
  choices: state?.choices.map(cloneTargetChoice) ?? []
});

export const cloneDreamerInformationSet = (state: DreamerInformationSet | undefined): DreamerInformationSet => ({
  deliveries: state?.deliveries.map(cloneInformationDelivery) ?? []
});

const sameKnownPlayerReference = (left: KnownPlayerReference, right: KnownPlayerReference): boolean =>
  left.playerId === right.playerId && left.seatNumber === right.seatNumber;

export const cloneDreamerInformationEntry = (entry: DreamerInformationEntry): DreamerInformationEntry => ({
  sourcePlayerId: entry.sourcePlayerId,
  target: {
    playerId: entry.target.playerId,
    seatNumber: entry.target.seatNumber
  },
  goodRole: cloneRoleSetupSnapshot(entry.goodRole),
  evilRole: cloneRoleSetupSnapshot(entry.evilRole)
});

export const dreamerInformationEntryFromDelivery = (
  delivery: DreamerInformationDeliveredPayload
): DreamerInformationEntry => ({
  sourcePlayerId: delivery.sourcePlayerId,
  target: {
    playerId: delivery.targetPlayerId,
    seatNumber: delivery.targetSeatNumber
  },
  goodRole: cloneRoleSetupSnapshot(delivery.goodRole),
  evilRole: cloneRoleSetupSnapshot(delivery.evilRole)
});

export const validateDreamerActionDecision = (decision: unknown): ValidationResult => {
  if (
    !isPlainRecord(decision) ||
    !hasExactEnumerableKeys(decision, DREAMER_DECISION_KEYS) ||
    decision.kind !== "CHOOSE_PLAYER" ||
    typeof decision.targetPlayerId !== "string" ||
    decision.targetPlayerId.trim().length === 0
  ) {
    return fail("SubmitDreamerAction decision must be exactly CHOOSE_PLAYER with targetPlayerId");
  }

  return { valid: true };
};

const currentDreamerEntryForTask = (input: DreamerActionInput) => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return undefined;
  }

  const source = targetTask.source;
  if (targetTask.taskType !== "DREAMER_ACTION" || targetTask.taskClass !== "ROLE_ACTION") {
    return undefined;
  }

  if (source.kind === "PHILOSOPHER_GAINED_ABILITY") {
    if (source.sourceRole.roleId !== "philosopher" || source.chosenRole.roleId !== DREAMER_ROLE_ID) return undefined;
  } else if (source.kind !== "ROLE" || source.role.roleId !== DREAMER_ROLE_ID) return undefined;

  const currentEntry = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === (source.kind === "ROLE" || source.kind === "PHILOSOPHER_GAINED_ABILITY" ? source.playerId : "") &&
    entry.seatNumber === (source.kind === "ROLE" || source.kind === "PHILOSOPHER_GAINED_ABILITY" ? source.seatNumber : -1)
  );
  if (
    currentEntry === undefined ||
    (source.kind === "PHILOSOPHER_GAINED_ABILITY"
      ? currentEntry.role.roleId !== "philosopher" || !sameRoleSetupSnapshot(currentEntry.role, source.sourceRole)
      : source.kind !== "ROLE" || currentEntry.role.roleId !== DREAMER_ROLE_ID || !sameRoleSetupSnapshot(currentEntry.role, source.role))
  ) {
    return undefined;
  }

  return currentEntry;
};

const validateDreamerTaskSource = (input: DreamerActionInput): ValidationResult => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return fail("Dreamer action must reference a task in the first-night task plan");
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return fail("Dreamer action cannot target a settled task");
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId || nextTask.taskType !== "DREAMER_ACTION") {
    return fail("Dreamer action must target the current next unsettled Dreamer task");
  }

  const currentEntry = currentDreamerEntryForTask(input);
  if (currentEntry === undefined) {
    return fail("Dreamer action source is no longer the current canonical ability holder");
  }

  return { valid: true };
};

const findDreamerTargetChoice = (
  state: DreamerTargetChoiceSet | undefined,
  payload: Pick<DreamerTargetChosenPayload, "taskId" | "opportunityId" | "targetPlayerId">
): DreamerTargetChosenPayload | undefined =>
  state?.choices.find((choice) =>
    choice.taskId === payload.taskId &&
    choice.opportunityId === payload.opportunityId &&
    choice.targetPlayerId === payload.targetPlayerId
  );

const compareRoleId = (left: RoleSetupSnapshot, right: RoleSetupSnapshot): number =>
  compareStableId(left.roleId, right.roleId);

const roleFromCatalog = (
  setup: Pick<GeneratedSetup, "roleCatalogSnapshot">,
  role: RoleSetupSnapshot
): RoleSetupSnapshot | undefined => {
  const catalogRole = setup.roleCatalogSnapshot.roles.find((candidate) => candidate.roleId === role.roleId);
  if (catalogRole === undefined || !sameRoleSetupSnapshot(catalogRole, role)) {
    return undefined;
  }

  return catalogRole;
};

const selectLowestCatalogRoleByAlignment = (
  setup: Pick<GeneratedSetup, "roleCatalogSnapshot">,
  alignment: DefaultAlignment,
  excludedRoleId: RoleId | undefined
): RoleSetupSnapshot | undefined =>
  [...setup.roleCatalogSnapshot.roles]
    .filter((role) => role.defaultAlignment === alignment && role.roleId !== excludedRoleId)
    .sort(compareRoleId)
    .map(cloneRoleSetupSnapshot)[0];

const selectLowestCatalogRoleByNativeCategory = (
  setup: Pick<GeneratedSetup, "roleCatalogSnapshot">,
  category: "GOOD" | "EVIL",
  excludedRoleId: RoleId
): RoleSetupSnapshot | undefined =>
  [...setup.roleCatalogSnapshot.roles]
    .filter((role) => role.roleId !== excludedRoleId && (category === "GOOD"
      ? role.characterType === "TOWNSFOLK" || role.characterType === "OUTSIDER"
      : role.characterType === "MINION" || role.characterType === "DEMON"))
    .sort(compareRoleId)
    .map(cloneRoleSetupSnapshot)[0];

const sameBaseDreamerSourceContract = (
  left: BaseDreamerV2SourceContract,
  right: BaseDreamerV2SourceContract
): boolean =>
  left.sourceContractVersion === right.sourceContractVersion &&
  left.kind === right.kind &&
  left.taskPlanVersion === right.taskPlanVersion &&
  left.taskId === right.taskId &&
  left.taskType === right.taskType &&
  left.sourcePlayerId === right.sourcePlayerId &&
  left.sourceSeatNumber === right.sourceSeatNumber &&
  left.sourceRoleId === right.sourceRoleId &&
  left.sourceRoleTenureId === right.sourceRoleTenureId &&
  left.sourceCharacterStateRevision === right.sourceCharacterStateRevision &&
  left.sourceAbilityInstanceId === right.sourceAbilityInstanceId;

const samePhilosopherGainedDreamerSourceContract = (
  left: PhilosopherGainedDreamerSourceContractV1,
  right: PhilosopherGainedDreamerSourceContractV1
): boolean =>
  left.sourceContractVersion === right.sourceContractVersion && left.kind === right.kind &&
  left.taskPlanVersion === right.taskPlanVersion && left.schedulingVersion === right.schedulingVersion &&
  left.taskId === right.taskId && left.taskType === right.taskType && left.taskSourceKind === right.taskSourceKind &&
  left.sourcePlayerId === right.sourcePlayerId && left.sourceSeatNumber === right.sourceSeatNumber &&
  left.sourceRoleId === right.sourceRoleId && left.chosenRoleId === right.chosenRoleId &&
  left.sourceRoleTenureId === right.sourceRoleTenureId &&
  left.sourceCharacterStateRevision === right.sourceCharacterStateRevision &&
  left.philosopherOpportunityId === right.philosopherOpportunityId && left.grantId === right.grantId &&
  left.sourceAbilityInstanceId === right.sourceAbilityInstanceId &&
  left.abilityInstance.provenanceVersion === right.abilityInstance.provenanceVersion &&
  left.abilityInstance.kind === right.abilityInstance.kind &&
  left.abilityInstance.abilityInstanceId === right.abilityInstance.abilityInstanceId &&
  left.abilityInstance.abilityRoleId === right.abilityInstance.abilityRoleId &&
  left.abilityInstance.taskId === right.abilityInstance.taskId &&
  left.abilityInstance.sourcePlayerId === right.abilityInstance.sourcePlayerId &&
  left.abilityInstance.sourceSeatNumber === right.abilityInstance.sourceSeatNumber &&
  left.abilityInstance.philosopherOpportunityId === right.abilityInstance.philosopherOpportunityId &&
  left.abilityInstance.grantId === right.abilityInstance.grantId &&
  left.abilityInstance.sourceCharacterStateRevision === right.abilityInstance.sourceCharacterStateRevision &&
  left.abilityInstance.schedulingVersion === right.abilityInstance.schedulingVersion &&
  left.grantReference.kind === right.grantReference.kind && left.grantReference.grantId === right.grantReference.grantId &&
  left.grantReference.philosopherOpportunityId === right.grantReference.philosopherOpportunityId &&
  left.grantReference.sourcePlayerId === right.grantReference.sourcePlayerId &&
  left.grantReference.sourceSeatNumber === right.grantReference.sourceSeatNumber &&
  left.grantReference.sourceRoleId === right.grantReference.sourceRoleId &&
  left.grantReference.chosenRoleId === right.grantReference.chosenRoleId &&
  left.grantReference.sourceCharacterStateRevision === right.grantReference.sourceCharacterStateRevision &&
  left.taskInsertionReference.kind === right.taskInsertionReference.kind &&
  left.taskInsertionReference.taskId === right.taskInsertionReference.taskId &&
  left.taskInsertionReference.taskPlanVersion === right.taskInsertionReference.taskPlanVersion &&
  left.taskInsertionReference.schedulingVersion === right.taskInsertionReference.schedulingVersion &&
  left.taskInsertionReference.philosopherOpportunityId === right.taskInsertionReference.philosopherOpportunityId &&
  left.taskInsertionReference.grantId === right.taskInsertionReference.grantId &&
  left.taskInsertionReference.sourcePlayerId === right.taskInsertionReference.sourcePlayerId &&
  left.taskInsertionReference.sourceSeatNumber === right.taskInsertionReference.sourceSeatNumber &&
  left.taskInsertionReference.sourceRoleId === right.taskInsertionReference.sourceRoleId &&
  left.taskInsertionReference.chosenRoleId === right.taskInsertionReference.chosenRoleId &&
  left.taskInsertionReference.sourceCharacterStateRevision === right.taskInsertionReference.sourceCharacterStateRevision;

const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) return false;
  }
  return true;
};

const isDenseScheduledTaskArray = (value: unknown): value is FirstNightTaskPlan["tasks"] =>
  Array.isArray(value) && isDenseArray(value);

const hasExactAbilityImpairmentShape = (value: unknown): boolean => {
  if (!isPlainRecord(value) || !hasExactRoleSetupSnapshotShape(value.affectedRole)) return false;
  const common = typeof value.impairmentId === "string" && value.impairmentId.length > 0 &&
    (value.kind === "DRUNK" || value.kind === "POISONED") &&
    typeof value.sourcePlayerId === "string" && value.sourcePlayerId.length > 0 &&
    typeof value.affectedPlayerId === "string" && value.affectedPlayerId.length > 0 &&
    Number.isSafeInteger(value.affectedSeatNumber) && (value.affectedSeatNumber as number) >= 1 &&
    (value.affectedSeatNumber as number) <= 12 && Number.isSafeInteger(value.sourceCharacterStateRevision) &&
    (value.sourceCharacterStateRevision as number) > 0;
  if (!common) return false;
  if (value.sourceKind === "PHILOSOPHER_CHOSEN_DUPLICATE") {
    return value.kind === "DRUNK" && hasExactEnumerableKeys(value, [
      "affectedPlayerId", "affectedRole", "affectedSeatNumber", "chosenRoleId", "impairmentId",
      "kind", "sourceCharacterStateRevision", "sourceKind", "sourcePlayerId"
    ]) && typeof value.chosenRoleId === "string" && value.chosenRoleId.length > 0;
  }
  return value.sourceKind === "SNAKE_CHARMER_DEMON_HIT" && value.kind === "POISONED" &&
    hasExactEnumerableKeys(value, [
      "affectedPlayerId", "affectedRole", "affectedSeatNumber", "impairmentId", "kind",
      "sourceCharacterStateRevision", "sourceKind", "sourcePlayerId"
    ]);
};

const applicableImpairmentsForTenure = (input: {
  readonly impairments: AbilityImpairmentSet;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly role: RoleSetupSnapshot;
  readonly tenure: RoleTenureRecord;
  readonly openingRevision: number;
  readonly settlementRevision: number;
}) => input.impairments.impairments.filter((marker) =>
  marker.affectedPlayerId === input.playerId &&
  marker.affectedSeatNumber === input.seatNumber &&
  marker.affectedRole.roleId === input.role.roleId &&
  sameRoleSetupSnapshot(marker.affectedRole, input.role) &&
  (marker.kind === "DRUNK" || marker.kind === "POISONED") &&
  (marker.sourceKind === "PHILOSOPHER_CHOSEN_DUPLICATE" || marker.sourceKind === "SNAKE_CHARMER_DEMON_HIT") &&
  marker.sourceCharacterStateRevision >= input.tenure.acquiredCharacterStateRevision &&
  marker.sourceCharacterStateRevision >= input.openingRevision &&
  marker.sourceCharacterStateRevision <= input.settlementRevision &&
  isRoleTenureContinuousAcross(input.tenure, input.openingRevision, input.settlementRevision) &&
  (input.tenure.endedCharacterStateRevision === undefined ||
    input.tenure.endedCharacterStateRevision > input.settlementRevision)
);

export const resolveBaseDreamerV2NormalCapability = (input: {
  readonly opportunity: DreamerActionOpportunityV3;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly roleTenures: RoleTenureState;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): BaseDreamerV2NormalCapability => {
  const unresolved = (reason: Extract<BaseDreamerV2NormalCapability, { readonly kind: "EFFECTIVENESS_UNRESOLVED" }>['reason']): BaseDreamerV2NormalCapability =>
    ({ kind: "EFFECTIVENESS_UNRESOLVED", reason });
  try {
    const { opportunity, firstNightTaskPlan: plan, firstNightTaskProgress: progress } = input;
    const rawTasks: unknown = plan.tasks;
    if (plan.taskPlanVersion !== "first-night-task-plan-v2" || plan.nightNumber !== 1 ||
        !isDenseScheduledTaskArray(rawTasks) ||
        !validateFirstNightTaskProgress(plan, progress ?? { settlements: [] }).valid ||
        !validateFirstNightActionOpportunityStateShape(input.firstNightActionOpportunities).valid ||
        !validateRoleTenureStateExact(input.roleTenures).valid || !isDreamerActionOpportunityV3(opportunity)) {
      return unresolved("SOURCE_PROVENANCE_INVALID");
    }
    const taskMatches = rawTasks.filter((task) => task.taskId === opportunity.taskId);
    const task = taskMatches[0];
    const storedById = input.firstNightActionOpportunities.opportunities.filter((candidate) => candidate.opportunityId === opportunity.opportunityId);
    const storedByTask = input.firstNightActionOpportunities.opportunities.filter((candidate) => candidate.taskId === opportunity.taskId);
    const stored = storedById[0];
    if (taskMatches.length !== 1 || task === undefined || isFirstNightTaskSettled(progress, task.taskId) ||
        getNextUnsettledFirstNightTask(plan, progress)?.taskId !== task.taskId || task.taskType !== "DREAMER_ACTION" ||
        task.taskClass !== "ROLE_ACTION" || task.source.kind !== "ROLE" || task.source.role.roleId !== DREAMER_ROLE_ID ||
        task.taskId !== roleScheduledTaskId("DREAMER_ACTION", opportunity.sourceSeatNumber) ||
        storedById.length !== 1 || storedByTask.length !== 1 || stored === undefined || !isDreamerActionOpportunityV3(stored) ||
        stored.opportunityStatus !== "OPEN" || stored !== opportunity && (
          stored.opportunitySchemaVersion !== opportunity.opportunitySchemaVersion ||
          stored.opportunityId !== opportunity.opportunityId ||
          !sameBaseDreamerSourceContract(stored.sourceContract, opportunity.sourceContract)
        )) return unresolved("SOURCE_PROVENANCE_INVALID");
    const contract = opportunity.sourceContract;
    const sourceEntries = input.currentCharacterState.entries.filter((entry) => entry.playerId === contract.sourcePlayerId && entry.seatNumber === contract.sourceSeatNumber);
    const source = sourceEntries[0];
    const catalogSource = input.setup.roleCatalogSnapshot.roles.filter((role) => role.roleId === DREAMER_ROLE_ID);
    if (sourceEntries.length !== 1 || source === undefined || catalogSource.length !== 1 || catalogSource[0] === undefined ||
        !sameRoleSetupSnapshot(source.role, catalogSource[0]) || !sameRoleSetupSnapshot(opportunity.sourceRole, catalogSource[0]) ||
        !sameRoleSetupSnapshot(task.source.role, catalogSource[0]) || task.source.playerId !== source.playerId ||
        task.source.seatNumber !== source.seatNumber || opportunity.sourcePlayerId !== source.playerId ||
        opportunity.sourceSeatNumber !== source.seatNumber || contract.taskId !== task.taskId ||
        contract.taskType !== "DREAMER_ACTION" || contract.sourcePlayerId !== source.playerId ||
        contract.sourceSeatNumber !== source.seatNumber || contract.sourceRoleId !== DREAMER_ROLE_ID ||
        contract.sourceCharacterStateRevision !== opportunity.sourceCharacterStateRevision ||
        input.currentCharacterState.revision < contract.sourceCharacterStateRevision ||
        !parseBaseDreamerV2FirstNightActionOpportunityId(opportunity.opportunityId).valid) {
      return unresolved("SOURCE_PROVENANCE_INVALID");
    }
    const tenure = findUniqueActiveRoleTenure({
      state: input.roleTenures, playerId: source.playerId, seatNumber: source.seatNumber,
      roleId: "dreamer", revision: input.currentCharacterState.revision
    });
    const parsedTenure = tenure === undefined ? undefined : parseRoleTenureId(tenure.roleTenureId);
    const expectedAbility = formatBaseFirstNightAbilityInstanceId(task.taskId);
    const parsedAbility = parseFirstNightAbilityInstanceId(contract.sourceAbilityInstanceId);
    if (tenure === undefined || tenure.roleTenureId !== contract.sourceRoleTenureId || !parsedTenure?.valid ||
        !isRoleTenureContinuousAcross(tenure, contract.sourceCharacterStateRevision, input.currentCharacterState.revision) ||
        contract.sourceAbilityInstanceId !== expectedAbility || !parsedAbility.valid || parsedAbility.kind !== "BASE_ROLE_TASK" ||
        parsedAbility.generation !== "BASE" || parsedAbility.taskId !== task.taskId || parsedAbility.taskType !== "DREAMER_ACTION" ||
        parsedAbility.embeddedSeat !== source.seatNumber) return unresolved("SOURCE_PROVENANCE_INVALID");

    const impairments = input.abilityImpairments ?? { impairments: [] };
    if (!isPlainRecord(impairments) || !hasExactEnumerableKeys(impairments, ["impairments"]) ||
        !Array.isArray(impairments.impairments) || !isDenseArray(impairments.impairments) ||
        impairments.impairments.some((marker) => !hasExactAbilityImpairmentShape(marker))) {
      return unresolved("SOURCE_IMPAIRMENT_CONFLICT");
    }
    const sourceImpairments = applicableImpairmentsForTenure({
      impairments, playerId: source.playerId, seatNumber: source.seatNumber, role: source.role, tenure,
      openingRevision: contract.sourceCharacterStateRevision, settlementRevision: input.currentCharacterState.revision
    });
    if (sourceImpairments.length > 1 || new Set(sourceImpairments.map((marker) => marker.impairmentId)).size !== sourceImpairments.length) {
      return unresolved("SOURCE_IMPAIRMENT_CONFLICT");
    }
    const sourceImpairment = sourceImpairments[0];
    const canonicalDrunk = sourceImpairment?.kind === "DRUNK" &&
      sourceImpairment.sourceKind === "PHILOSOPHER_CHOSEN_DUPLICATE" &&
      sourceImpairment.chosenRoleId === "dreamer"
      ? {
          impairmentId: sourceImpairment.impairmentId,
          kind: sourceImpairment.kind,
          sourceKind: sourceImpairment.sourceKind,
          sourcePlayerId: sourceImpairment.sourcePlayerId,
          affectedPlayerId: sourceImpairment.affectedPlayerId,
          affectedSeatNumber: sourceImpairment.affectedSeatNumber,
          affectedRole: cloneRoleSetupSnapshot(sourceImpairment.affectedRole),
          chosenRoleId: "dreamer",
          sourceCharacterStateRevision: sourceImpairment.sourceCharacterStateRevision
        } satisfies DreamerCanonicalPhilosopherDrunkSourceImpairment
      : undefined;
    if (sourceImpairment !== undefined && canonicalDrunk === undefined) {
      return { kind: "SOURCE_REPRESENTED_IMPAIRED", impairmentId: sourceImpairment.impairmentId, impairmentKind: sourceImpairment.kind };
    }

    const demons = input.currentCharacterState.entries.filter((entry) => entry.role.characterType === "DEMON");
    const demon = demons[0];
    if (demons.length !== 1 || demon === undefined) return unresolved("CURRENT_DEMON_IDENTITY_NOT_UNIQUE");
    const catalogDemons = input.setup.roleCatalogSnapshot.roles.filter((role) => role.roleId === demon.role.roleId);
    if (catalogDemons.length !== 1 || catalogDemons[0] === undefined || !sameRoleSetupSnapshot(catalogDemons[0], demon.role)) {
      return unresolved("CURRENT_DEMON_CATALOG_MISMATCH");
    }
    if (demon.role.roleId === "no_dashii") {
      return { kind: "NO_DASHII_EFFECT_UNRESOLVED", noDashiiPlayerId: demon.playerId, noDashiiSeatNumber: demon.seatNumber };
    }
    if (demon.role.roleId === "vortox") {
      const vortoxTenure = findUniqueActiveRoleTenure({ state: input.roleTenures, playerId: demon.playerId, seatNumber: demon.seatNumber, roleId: "vortox", revision: input.currentCharacterState.revision });
      const parsedVortoxTenure = vortoxTenure === undefined ? undefined : parseRoleTenureId(vortoxTenure.roleTenureId);
      if (vortoxTenure === undefined || !parsedVortoxTenure?.valid || parsedVortoxTenure.roleId !== "vortox" ||
          parsedVortoxTenure.seatNumber !== demon.seatNumber || vortoxTenure.playerId !== demon.playerId ||
          vortoxTenure.seatNumber !== demon.seatNumber || vortoxTenure.roleId !== "vortox" ||
          !isRoleTenureContinuousAcross(vortoxTenure, vortoxTenure.acquiredCharacterStateRevision, input.currentCharacterState.revision)) {
        return unresolved("VORTOX_TENURE_MISSING_OR_INCONSISTENT");
      }
      const vortoxImpairments = applicableImpairmentsForTenure({
        impairments, playerId: demon.playerId, seatNumber: demon.seatNumber, role: demon.role, tenure: vortoxTenure,
        openingRevision: vortoxTenure.acquiredCharacterStateRevision, settlementRevision: input.currentCharacterState.revision
      });
      if (vortoxImpairments.length > 1 || new Set(vortoxImpairments.map((marker) => marker.impairmentId)).size !== vortoxImpairments.length) {
        return unresolved("VORTOX_EFFECTIVENESS_CONFLICT");
      }
      if (vortoxImpairments.length === 0) {
        if (canonicalDrunk !== undefined) {
          return {
            kind: "CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED",
            evaluationModelVersion: DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION,
            evaluatedCharacterStateRevision: input.currentCharacterState.revision,
            sourceRoleTenureId: tenure.roleTenureId,
            sourceAbilityInstanceId: expectedAbility,
            sourceImpairment: canonicalDrunk,
            vortoxConstraint: {
              constraintVersion: DREAMER_VORTOX_CONSTRAINT_VERSION,
              kind: "VORTOX_FORCED_FALSE_REQUIRED",
              vortoxPlayerId: demon.playerId,
              vortoxSeatNumber: demon.seatNumber,
              vortoxRoleId: "vortox",
              vortoxRoleTenureId: vortoxTenure.roleTenureId,
              evaluatedCharacterStateRevision: input.currentCharacterState.revision
            }
          };
        }
        return {
          kind: "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED",
          evaluationModelVersion: DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION,
          evaluatedCharacterStateRevision: input.currentCharacterState.revision,
          sourceRoleTenureId: tenure.roleTenureId,
          sourceAbilityInstanceId: expectedAbility,
          vortoxConstraint: {
            constraintVersion: DREAMER_VORTOX_CONSTRAINT_VERSION,
            kind: "VORTOX_FORCED_FALSE_REQUIRED",
            vortoxPlayerId: demon.playerId,
            vortoxSeatNumber: demon.seatNumber,
            vortoxRoleId: "vortox",
            vortoxRoleTenureId: vortoxTenure.roleTenureId,
            evaluatedCharacterStateRevision: input.currentCharacterState.revision
          }
        };
      }
      return unresolved("VORTOX_EFFECTIVENESS_CONFLICT");
    }
    if (demon.role.roleId === "fang_gu") {
      if (canonicalDrunk !== undefined) {
        return {
          kind: "CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED",
          evaluationModelVersion: DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION,
          evaluatedCharacterStateRevision: input.currentCharacterState.revision,
          sourceRoleTenureId: tenure.roleTenureId,
          sourceAbilityInstanceId: expectedAbility,
          sourceImpairment: canonicalDrunk,
          currentDemonConstraint: {
            constraintVersion: DREAMER_NON_VORTOX_CURRENT_DEMON_CONSTRAINT_VERSION,
            kind: "UNIQUE_CURRENT_FANG_GU",
            demonPlayerId: demon.playerId,
            demonSeatNumber: demon.seatNumber,
            demonRole: cloneRoleSetupSnapshot(demon.role),
            evaluatedCharacterStateRevision: input.currentCharacterState.revision
          }
        };
      }
      return {
        kind: "NORMAL_INFORMATION_SUPPORTED",
        evaluationModelVersion: DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION,
        evaluatedCharacterStateRevision: input.currentCharacterState.revision,
        sourceRoleTenureId: tenure.roleTenureId,
        sourceAbilityInstanceId: expectedAbility
      };
    }
    if (canonicalDrunk !== undefined) {
      return {
        kind: "SOURCE_REPRESENTED_IMPAIRED",
        impairmentId: canonicalDrunk.impairmentId,
        impairmentKind: "DRUNK"
      };
    }
    return unresolved("CURRENT_DEMON_CATALOG_MISMATCH");
  } catch {
    return unresolved("SOURCE_PROVENANCE_INVALID");
  }
};

export const resolvePhilosopherGainedDreamerCapability = (input: {
  readonly opportunity: DreamerActionOpportunityV4;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly roleTenures: RoleTenureState;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): PhilosopherGainedDreamerCapability => {
  try {
    const { opportunity, currentCharacterState, roleTenures } = input;
    if (!isDreamerActionOpportunityV4(opportunity) ||
        !hasExactPhilosopherGainedDreamerSourceContractV1Shape(opportunity.sourceContract) ||
        !validateRoleTenureStateExact(roleTenures).valid) return { kind: "EFFECTIVENESS_UNRESOLVED" };
    const contract = opportunity.sourceContract;
    const sourceEntries = currentCharacterState.entries.filter((entry) =>
      entry.playerId === contract.sourcePlayerId && entry.seatNumber === contract.sourceSeatNumber);
    const source = sourceEntries[0];
    const catalogPhilosopher = input.setup.roleCatalogSnapshot.roles.filter((role) => role.roleId === "philosopher");
    if (sourceEntries.length !== 1 || source === undefined || catalogPhilosopher.length !== 1 ||
        catalogPhilosopher[0] === undefined || !sameRoleSetupSnapshot(source.role, catalogPhilosopher[0]) ||
        !sameRoleSetupSnapshot(opportunity.sourceRole, source.role) || contract.sourceRoleId !== "philosopher" ||
        contract.chosenRoleId !== "dreamer" || contract.sourcePlayerId !== source.playerId ||
        contract.sourceSeatNumber !== source.seatNumber || contract.sourceCharacterStateRevision !== opportunity.sourceCharacterStateRevision ||
        currentCharacterState.revision < opportunity.sourceCharacterStateRevision) return { kind: "EFFECTIVENESS_UNRESOLVED" };
    const tenure = findUniqueActiveRoleTenure({ state: roleTenures, playerId: source.playerId,
      seatNumber: source.seatNumber, roleId: "philosopher", revision: currentCharacterState.revision });
    if (tenure === undefined || tenure.roleTenureId !== contract.sourceRoleTenureId ||
        !isRoleTenureContinuousAcross(tenure, contract.sourceCharacterStateRevision, currentCharacterState.revision)) {
      return { kind: "EFFECTIVENESS_UNRESOLVED" };
    }
    const impairments = input.abilityImpairments ?? { impairments: [] };
    if (!isPlainRecord(impairments) || !hasExactEnumerableKeys(impairments, ["impairments"]) ||
        !Array.isArray(impairments.impairments) || !isDenseArray(impairments.impairments) ||
        impairments.impairments.some((marker) => !hasExactAbilityImpairmentShape(marker))) {
      return { kind: "EFFECTIVENESS_UNRESOLVED" };
    }
    const sourceImpairments = applicableImpairmentsForTenure({ impairments, playerId: source.playerId,
      seatNumber: source.seatNumber, role: source.role, tenure,
      openingRevision: contract.sourceCharacterStateRevision, settlementRevision: currentCharacterState.revision });
    if (sourceImpairments.length !== 0) return { kind: "SOURCE_REPRESENTED_IMPAIRED" };

    const demons = currentCharacterState.entries.filter((entry) => entry.role.characterType === "DEMON");
    const demon = demons[0];
    if (demons.length !== 1 || demon === undefined || roleFromCatalog(input.setup, demon.role) === undefined) {
      return { kind: "EFFECTIVENESS_UNRESOLVED" };
    }
    if (demon.role.roleId !== "vortox") {
      return { kind: "NORMAL_INFORMATION_SUPPORTED", evaluatedCharacterStateRevision: currentCharacterState.revision,
        sourceRoleTenureId: tenure.roleTenureId, sourceAbilityInstanceId: contract.sourceAbilityInstanceId };
    }
    const vortoxTenure = findUniqueActiveRoleTenure({ state: roleTenures, playerId: demon.playerId,
      seatNumber: demon.seatNumber, roleId: "vortox", revision: currentCharacterState.revision });
    if (vortoxTenure === undefined || !isRoleTenureContinuousAcross(vortoxTenure,
        vortoxTenure.acquiredCharacterStateRevision, currentCharacterState.revision)) return { kind: "EFFECTIVENESS_UNRESOLVED" };
    const vortoxImpairments = applicableImpairmentsForTenure({ impairments, playerId: demon.playerId,
      seatNumber: demon.seatNumber, role: demon.role, tenure: vortoxTenure,
      openingRevision: vortoxTenure.acquiredCharacterStateRevision, settlementRevision: currentCharacterState.revision });
    if (vortoxImpairments.length !== 0) return { kind: "EFFECTIVENESS_UNRESOLVED" };
    return {
      kind: "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED",
      evaluatedCharacterStateRevision: currentCharacterState.revision,
      sourceRoleTenureId: tenure.roleTenureId,
      sourceAbilityInstanceId: contract.sourceAbilityInstanceId,
      vortoxConstraint: {
        constraintVersion: DREAMER_VORTOX_CONSTRAINT_VERSION,
        kind: "VORTOX_FORCED_FALSE_REQUIRED",
        vortoxPlayerId: demon.playerId,
        vortoxSeatNumber: demon.seatNumber,
        vortoxRoleId: "vortox",
        vortoxRoleTenureId: vortoxTenure.roleTenureId,
        evaluatedCharacterStateRevision: currentCharacterState.revision
      }
    };
  } catch {
    return { kind: "EFFECTIVENESS_UNRESOLVED" };
  }
};

const reliabilityFromEffectiveness = (effectiveness: DreamerEffectivenessResult): DreamerInformationReliability =>
  effectiveness.effective
    ? { kind: "EFFECTIVE" }
    : {
        kind: "SOURCE_IMPAIRED",
        reason: effectiveness.reason,
        sourceImpairmentId: effectiveness.impairmentId,
        sourceImpairmentKind: effectiveness.impairmentKind
      };

const hasExactReliabilityShape = (value: unknown): value is DreamerInformationReliability => {
  if (!isPlainRecord(value)) {
    return false;
  }

  if (value.kind === "EFFECTIVE") {
    return hasExactEnumerableKeys(value, DREAMER_EFFECTIVE_RELIABILITY_KEYS);
  }

  return (
    value.kind === "SOURCE_IMPAIRED" &&
    hasExactEnumerableKeys(value, DREAMER_IMPAIRED_RELIABILITY_KEYS) &&
    (value.reason === "SOURCE_DRUNK" || value.reason === "SOURCE_POISONED") &&
    typeof value.sourceImpairmentId === "string" &&
    value.sourceImpairmentId.trim().length > 0 &&
    (value.sourceImpairmentKind === "DRUNK" || value.sourceImpairmentKind === "POISONED") &&
    ((value.reason === "SOURCE_DRUNK" && value.sourceImpairmentKind === "DRUNK") ||
      (value.reason === "SOURCE_POISONED" && value.sourceImpairmentKind === "POISONED"))
  );
};

const hasExactVortoxReliabilityShape = (value: unknown): value is DreamerVortoxInformationReliability =>
  isPlainRecord(value) && hasExactEnumerableKeys(value, DREAMER_VORTOX_RELIABILITY_KEYS) &&
  value.kind === "VORTOX_FORCED_FALSE";

const hasExactPhilosopherGainedEffectiveReliabilityShape = (
  value: unknown
): value is PhilosopherGainedDreamerEffectiveReliability =>
  isPlainRecord(value) && hasExactEnumerableKeys(value, PHILOSOPHER_GAINED_DREAMER_EFFECTIVE_RELIABILITY_KEYS) &&
  value.kind === "PHILOSOPHER_GAINED_EFFECTIVE";

const hasExactPhilosopherGainedVortoxReliabilityShape = (
  value: unknown
): value is PhilosopherGainedDreamerVortoxReliability =>
  isPlainRecord(value) && hasExactEnumerableKeys(value, PHILOSOPHER_GAINED_DREAMER_VORTOX_RELIABILITY_KEYS) &&
  value.kind === "VORTOX_FORCED_FALSE";

const hasExactCanonicalDrunkVortoxReliabilityShape = (
  value: unknown
): value is DreamerCanonicalDrunkVortoxInformationReliability =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, DREAMER_CANONICAL_DRUNK_VORTOX_RELIABILITY_KEYS) &&
  value.kind === "VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK";

const hasExactCanonicalDrunkSourceImpairmentShape = (
  value: unknown
): value is DreamerCanonicalPhilosopherDrunkSourceImpairment =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, DREAMER_CANONICAL_DRUNK_SOURCE_IMPAIRMENT_KEYS) &&
  typeof value.impairmentId === "string" && value.impairmentId.trim().length > 0 &&
  value.kind === "DRUNK" && value.sourceKind === "PHILOSOPHER_CHOSEN_DUPLICATE" &&
  typeof value.sourcePlayerId === "string" && value.sourcePlayerId.trim().length > 0 &&
  typeof value.affectedPlayerId === "string" && value.affectedPlayerId.trim().length > 0 &&
  Number.isSafeInteger(value.affectedSeatNumber) && (value.affectedSeatNumber as number) >= 1 &&
  (value.affectedSeatNumber as number) <= 12 && hasExactRoleSetupSnapshotShape(value.affectedRole) &&
  value.affectedRole.roleId === DREAMER_ROLE_ID && value.chosenRoleId === "dreamer" &&
  Number.isSafeInteger(value.sourceCharacterStateRevision) &&
  (value.sourceCharacterStateRevision as number) > 0;

const hasExactDreamerVortoxConstraintShape = (value: unknown): value is DreamerVortoxConstraint => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, DREAMER_VORTOX_CONSTRAINT_KEYS)) return false;
  const parsedTenure = parseRoleTenureId(value.vortoxRoleTenureId);
  return value.constraintVersion === DREAMER_VORTOX_CONSTRAINT_VERSION &&
    value.kind === "VORTOX_FORCED_FALSE_REQUIRED" && typeof value.vortoxPlayerId === "string" &&
    value.vortoxPlayerId.trim().length > 0 && Number.isSafeInteger(value.vortoxSeatNumber) &&
    (value.vortoxSeatNumber as number) >= 1 && (value.vortoxSeatNumber as number) <= 12 &&
    value.vortoxRoleId === "vortox" && parsedTenure.valid && parsedTenure.roleId === "vortox" &&
    parsedTenure.seatNumber === value.vortoxSeatNumber &&
    Number.isSafeInteger(value.evaluatedCharacterStateRevision) &&
    (value.evaluatedCharacterStateRevision as number) > 0;
};

const isCanonicalCandidateRoleId = (value: unknown): value is RoleId => {
  if (typeof value !== "string" || value.length === 0 || value.includes(":")) return false;
  return ![...value].some((character) => {
    const codeUnit = character.charCodeAt(0);
    return codeUnit <= 0x1f || codeUnit === 0x7f;
  });
};

export const formatDreamerApparentPairCandidateId = (
  goodRoleId: RoleId,
  evilRoleId: RoleId
): DreamerApparentPairCandidateId => {
  if (!isCanonicalCandidateRoleId(goodRoleId) || !isCanonicalCandidateRoleId(evilRoleId)) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "Dreamer apparent-pair role IDs must be canonical");
  }
  return `dreamer-apparent-pair-v1:good:${goodRoleId}:evil:${evilRoleId}` as DreamerApparentPairCandidateId;
};

export const parseDreamerApparentPairCandidateId = (
  value: unknown
): { readonly valid: true; readonly goodRoleId: RoleId; readonly evilRoleId: RoleId } | { readonly valid: false } => {
  if (typeof value !== "string") return { valid: false };
  const match = /^dreamer-apparent-pair-v1:good:([^:]+):evil:([^:]+)$/.exec(value);
  if (match === null || !isCanonicalCandidateRoleId(match[1]) || !isCanonicalCandidateRoleId(match[2])) {
    return { valid: false };
  }
  try {
    return formatDreamerApparentPairCandidateId(match[1], match[2]) === value
      ? { valid: true, goodRoleId: match[1], evilRoleId: match[2] }
      : { valid: false };
  } catch {
    return { valid: false };
  }
};

const compareRawUtf16 = (left: string, right: string): number => {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const difference = left.charCodeAt(index) - right.charCodeAt(index);
    if (difference !== 0) return difference;
  }
  return left.length - right.length;
};

const hasExactApparentPairCandidateShape = (
  value: unknown,
  setup: Pick<GeneratedSetup, "roleCatalogSnapshot">,
  targetRoleId: RoleId | undefined
): value is DreamerApparentPairCandidate => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, DREAMER_APPARENT_PAIR_CANDIDATE_KEYS) ||
      !hasExactRoleSetupSnapshotShape(value.goodRole) || !hasExactRoleSetupSnapshotShape(value.evilRole) ||
      !(value.goodRole.characterType === "TOWNSFOLK" || value.goodRole.characterType === "OUTSIDER") ||
      !(value.evilRole.characterType === "MINION" || value.evilRole.characterType === "DEMON") ||
      roleFromCatalog(setup, value.goodRole) === undefined || roleFromCatalog(setup, value.evilRole) === undefined ||
      (value.truthClassification !== "TRUE" && value.truthClassification !== "FALSE")) return false;
  const parsed = parseDreamerApparentPairCandidateId(value.candidateId);
  const expectedTruth = targetRoleId === undefined ? value.truthClassification :
    value.goodRole.roleId === targetRoleId || value.evilRole.roleId === targetRoleId ? "TRUE" : "FALSE";
  return parsed.valid && parsed.goodRoleId === value.goodRole.roleId && parsed.evilRoleId === value.evilRole.roleId &&
    value.truthClassification === expectedTruth;
};

const hasExactApparentPairDecisionShape = (
  value: unknown,
  setup: Pick<GeneratedSetup, "roleCatalogSnapshot">,
  targetRoleId: RoleId | undefined
): value is DreamerApparentPairDecision => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, DREAMER_APPARENT_PAIR_DECISION_KEYS) ||
      value.candidateModelVersion !== DREAMER_APPARENT_PAIR_CANDIDATE_MODEL_VERSION ||
      value.simulationPolicyVersion !== DREAMER_CANONICAL_DRUNK_PAIR_SELECTION_POLICY_VERSION ||
      !Array.isArray(value.legalCandidates) || value.legalCandidates.length === 0 ||
      typeof value.selectedCandidateId !== "string") return false;
  const candidates: readonly unknown[] = value.legalCandidates;
  if (!candidates.every((candidate): candidate is DreamerApparentPairCandidate =>
    hasExactApparentPairCandidateShape(candidate, setup, targetRoleId))) return false;
  const ids = candidates.map((candidate) => candidate.candidateId);
  if (new Set(ids).size !== ids.length ||
      ids.some((id, index) => index > 0 && compareRawUtf16(ids[index - 1]!, id) >= 0) ||
      !candidates.some((candidate) => candidate.truthClassification === "TRUE") ||
      !candidates.some((candidate) => candidate.truthClassification === "FALSE") ||
      candidates.filter((candidate) => candidate.candidateId === value.selectedCandidateId).length !== 1) return false;
  const goodCount = setup.roleCatalogSnapshot.roles.filter((role) =>
    role.characterType === "TOWNSFOLK" || role.characterType === "OUTSIDER").length;
  const evilCount = setup.roleCatalogSnapshot.roles.filter((role) =>
    role.characterType === "MINION" || role.characterType === "DEMON").length;
  const expectedIds = setup.roleCatalogSnapshot.roles
    .filter((role) => role.characterType === "TOWNSFOLK" || role.characterType === "OUTSIDER")
    .flatMap((goodRole) => setup.roleCatalogSnapshot.roles
      .filter((role) => role.characterType === "MINION" || role.characterType === "DEMON")
      .map((evilRole) => formatDreamerApparentPairCandidateId(goodRole.roleId, evilRole.roleId)))
    .sort(compareRawUtf16);
  return candidates.length === goodCount * evilCount &&
    ids.every((id, index) => id === expectedIds[index]);
};

const hasExactNonVortoxCurrentDemonConstraintShape = (
  value: unknown,
  setup: Pick<GeneratedSetup, "roleCatalogSnapshot">
): value is DreamerNonVortoxCurrentDemonConstraint =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, DREAMER_NON_VORTOX_CURRENT_DEMON_CONSTRAINT_KEYS) &&
  value.constraintVersion === DREAMER_NON_VORTOX_CURRENT_DEMON_CONSTRAINT_VERSION &&
  value.kind === "UNIQUE_CURRENT_FANG_GU" &&
  typeof value.demonPlayerId === "string" && value.demonPlayerId.length > 0 &&
  Number.isSafeInteger(value.demonSeatNumber) && (value.demonSeatNumber as number) >= 1 &&
  (value.demonSeatNumber as number) <= 12 &&
  hasExactRoleSetupSnapshotShape(value.demonRole) && value.demonRole.roleId === "fang_gu" &&
  roleFromCatalog(setup, value.demonRole) !== undefined &&
  Number.isSafeInteger(value.evaluatedCharacterStateRevision) &&
  (value.evaluatedCharacterStateRevision as number) > 0;

const apparentPairDecisionSelectsRoles = (
  decision: unknown,
  goodRole: unknown,
  evilRole: unknown
): boolean =>
  isPlainRecord(decision) && Array.isArray(decision.legalCandidates) &&
  hasExactRoleSetupSnapshotShape(goodRole) && hasExactRoleSetupSnapshotShape(evilRole) &&
  decision.legalCandidates.some((candidate) =>
    isPlainRecord(candidate) && candidate.candidateId === decision.selectedCandidateId &&
    hasExactRoleSetupSnapshotShape(candidate.goodRole) &&
    hasExactRoleSetupSnapshotShape(candidate.evilRole) &&
    sameRoleSetupSnapshot(candidate.goodRole, goodRole) &&
    sameRoleSetupSnapshot(candidate.evilRole, evilRole));

const validateDreamerInformationPayloadShape = (
  payload: unknown,
  setup: Pick<GeneratedSetup, "roleCatalogSnapshot">
): DreamerInformationPayloadShapeResult => {
  if (!isExceptionSafeCanonicalDreamerData(payload)) {
    return shapeFail("DreamerInformationDelivered payload must use exception-safe canonical data");
  }
  if (!isPlainRecord(payload)) {
    return shapeFail("DreamerInformationDelivered payload must have exact runtime shape");
  }
  const hasVersion = Object.hasOwn(payload, "deliverySchemaVersion");
  const v2 = hasVersion && payload.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION;
  const v3 = hasVersion && payload.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION;
  const v4 = hasVersion && payload.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION;
  const v5 = hasVersion && payload.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION;
  const v6 = hasVersion && payload.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION;
  const v7 = hasVersion && payload.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION;
  if ((hasVersion && !v2 && !v3 && !v4 && !v5 && !v6 && !v7) || !hasExactEnumerableKeys(payload, v7
      ? DREAMER_INFORMATION_DELIVERED_V7_PAYLOAD_KEYS
      : v6
      ? DREAMER_INFORMATION_DELIVERED_V6_PAYLOAD_KEYS
      : v5 ? DREAMER_INFORMATION_DELIVERED_V5_PAYLOAD_KEYS
      : v4
      ? DREAMER_INFORMATION_DELIVERED_V4_PAYLOAD_KEYS
      : v3 ? DREAMER_INFORMATION_DELIVERED_V3_PAYLOAD_KEYS
      : v2 ? DREAMER_INFORMATION_DELIVERED_V2_PAYLOAD_KEYS : DREAMER_INFORMATION_DELIVERED_PAYLOAD_KEYS)) {
    return shapeFail("DreamerInformationDelivered payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.rulesBaselineVersion.trim().length === 0 ||
    payload.nightNumber !== 1 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    payload.taskType !== "DREAMER_ACTION" ||
    typeof payload.opportunityId !== "string" ||
    payload.opportunityId.trim().length === 0 ||
    payload.knowledgeModelVersion !== SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION ||
    payload.knowledgeStage !== DREAMER_INFORMATION_STAGE ||
    typeof payload.sourcePlayerId !== "string" ||
    payload.sourcePlayerId.trim().length === 0 ||
    typeof payload.sourceSeatNumber !== "number" ||
    !Number.isInteger(payload.sourceSeatNumber) ||
    payload.sourceSeatNumber < 1 ||
    payload.sourceSeatNumber > 12 ||
    typeof payload.sourceCharacterStateRevision !== "number" ||
    !Number.isInteger(payload.sourceCharacterStateRevision) ||
    payload.sourceCharacterStateRevision <= 0 ||
    typeof payload.targetPlayerId !== "string" ||
    payload.targetPlayerId.trim().length === 0 ||
    typeof payload.targetSeatNumber !== "number" ||
    !Number.isInteger(payload.targetSeatNumber) ||
    payload.targetSeatNumber < 1 ||
    payload.targetSeatNumber > 12 ||
    !(v7 ? isPlainRecord(payload.informationReliability) &&
        hasExactEnumerableKeys(payload.informationReliability, ["kind"]) &&
        payload.informationReliability.kind === "CANONICAL_SOURCE_DRUNK_APPARENT_INFORMATION" :
      v6 ? hasExactPhilosopherGainedVortoxReliabilityShape(payload.informationReliability) :
      v5 ? hasExactPhilosopherGainedEffectiveReliabilityShape(payload.informationReliability) :
      v4 ? hasExactCanonicalDrunkVortoxReliabilityShape(payload.informationReliability) :
      v3 ? hasExactVortoxReliabilityShape(payload.informationReliability) :
      hasExactReliabilityShape(payload.informationReliability)) ||
    !hasExactRoleSetupSnapshotShape(payload.goodRole) ||
    !hasExactRoleSetupSnapshotShape(payload.evilRole) ||
    (!v7 && payload.falseRolePolicyVersion !== DREAMER_FALSE_ROLE_POLICY_VERSION) ||
    ((v2 || v3 || v4 || v5 || v6 || v7) && (
      payload.opportunitySchemaVersion !== (v5 || v6 ? DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION : DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION) ||
      (v5 || v6
        ? !hasExactPhilosopherGainedDreamerSourceContractV1Shape(payload.sourceContract)
        : !hasExactBaseDreamerSourceContractShape(payload.sourceContract)) ||
      !isPlainRecord(payload.informationReliability) ||
      !hasExactEnumerableKeys(payload.informationReliability, ["kind"]) ||
      (v5 ? payload.informationReliability.kind !== "PHILOSOPHER_GAINED_EFFECTIVE" :
       v6 ? payload.informationReliability.kind !== "VORTOX_FORCED_FALSE" :
       v7 ? payload.informationReliability.kind !== "CANONICAL_SOURCE_DRUNK_APPARENT_INFORMATION" :
       v2 ? payload.informationReliability.kind !== "EFFECTIVE" : v3
        ? payload.informationReliability.kind !== "VORTOX_FORCED_FALSE"
        : payload.informationReliability.kind !== "VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK") ||
      ((v3 || v4 || v6) && (!hasExactDreamerVortoxConstraintShape(payload.vortoxConstraint) ||
        payload.vortoxConstraint.evaluatedCharacterStateRevision !== payload.sourceCharacterStateRevision)) ||
      ((v4 || v5 || v6 || v7) && (!Number.isSafeInteger(payload.evaluatedCharacterStateRevision) ||
        (payload.evaluatedCharacterStateRevision as number) <= 0 ||
        payload.evaluatedCharacterStateRevision !== payload.sourceCharacterStateRevision)) ||
      ((v4 || v7) && !hasExactCanonicalDrunkSourceImpairmentShape(payload.sourceImpairment)) ||
      (v7 && (!hasExactNonVortoxCurrentDemonConstraintShape(payload.currentDemonConstraint, setup) ||
        payload.currentDemonConstraint.evaluatedCharacterStateRevision !== payload.evaluatedCharacterStateRevision ||
        !hasExactApparentPairDecisionShape(payload.apparentPairDecision, setup, undefined) ||
        !apparentPairDecisionSelectsRoles(payload.apparentPairDecision, payload.goodRole, payload.evilRole))) ||
      ((v5 || v6) && payload.abilityRoleId !== "dreamer")))
  ) {
    return shapeFail("DreamerInformationDelivered fields must use supported primitive values");
  }

  if (v3 || v4 || v5 || v6 || v7
    ? !((payload.goodRole.characterType === "TOWNSFOLK" || payload.goodRole.characterType === "OUTSIDER") &&
        (payload.evilRole.characterType === "MINION" || payload.evilRole.characterType === "DEMON"))
    : payload.goodRole.defaultAlignment !== "GOOD" || payload.evilRole.defaultAlignment !== "EVIL") {
    return shapeFail("DreamerInformationDelivered must include one GOOD role and one EVIL role");
  }

  if (roleFromCatalog(setup, payload.goodRole) === undefined || roleFromCatalog(setup, payload.evilRole) === undefined) {
    return shapeFail("DreamerInformationDelivered roles must exist in the role catalog");
  }

  return {
    valid: true,
    payload: payload as unknown as DreamerInformationDeliveredPayload
  };
};

const sameReliability = (left: DreamerInformationReliability, right: DreamerInformationReliability): boolean => {
  if (left.kind !== right.kind) {
    return false;
  }

  if (left.kind === "EFFECTIVE" && right.kind === "EFFECTIVE") {
    return true;
  }

  return (
    left.kind === "SOURCE_IMPAIRED" &&
    right.kind === "SOURCE_IMPAIRED" &&
    left.reason === right.reason &&
    left.sourceImpairmentId === right.sourceImpairmentId &&
    left.sourceImpairmentKind === right.sourceImpairmentKind
  );
};

const sameVortoxConstraint = (left: DreamerVortoxConstraint, right: DreamerVortoxConstraint): boolean =>
  left.constraintVersion === right.constraintVersion && left.kind === right.kind &&
  left.vortoxPlayerId === right.vortoxPlayerId && left.vortoxSeatNumber === right.vortoxSeatNumber &&
  left.vortoxRoleId === right.vortoxRoleId && left.vortoxRoleTenureId === right.vortoxRoleTenureId &&
  left.evaluatedCharacterStateRevision === right.evaluatedCharacterStateRevision;

const sameCanonicalDrunkSourceImpairment = (
  left: DreamerCanonicalPhilosopherDrunkSourceImpairment,
  right: DreamerCanonicalPhilosopherDrunkSourceImpairment
): boolean =>
  left.impairmentId === right.impairmentId && left.kind === right.kind &&
  left.sourceKind === right.sourceKind && left.sourcePlayerId === right.sourcePlayerId &&
  left.affectedPlayerId === right.affectedPlayerId && left.affectedSeatNumber === right.affectedSeatNumber &&
  sameRoleSetupSnapshot(left.affectedRole, right.affectedRole) && left.chosenRoleId === right.chosenRoleId &&
  left.sourceCharacterStateRevision === right.sourceCharacterStateRevision;

const sameNonVortoxCurrentDemonConstraint = (
  left: DreamerNonVortoxCurrentDemonConstraint,
  right: DreamerNonVortoxCurrentDemonConstraint
): boolean =>
  left.constraintVersion === right.constraintVersion && left.kind === right.kind &&
  left.demonPlayerId === right.demonPlayerId && left.demonSeatNumber === right.demonSeatNumber &&
  sameRoleSetupSnapshot(left.demonRole, right.demonRole) &&
  left.evaluatedCharacterStateRevision === right.evaluatedCharacterStateRevision;

const sameApparentPairDecision = (
  left: DreamerApparentPairDecision,
  right: DreamerApparentPairDecision
): boolean =>
  left.candidateModelVersion === right.candidateModelVersion &&
  left.simulationPolicyVersion === right.simulationPolicyVersion &&
  left.selectedCandidateId === right.selectedCandidateId &&
  left.legalCandidates.length === right.legalCandidates.length &&
  left.legalCandidates.every((candidate, index) => {
    const other = right.legalCandidates[index];
    return other !== undefined && candidate.candidateId === other.candidateId &&
      candidate.truthClassification === other.truthClassification &&
      sameRoleSetupSnapshot(candidate.goodRole, other.goodRole) &&
      sameRoleSetupSnapshot(candidate.evilRole, other.evilRole);
  });

const sameTargetChoice = (left: DreamerTargetChosenPayload, right: DreamerTargetChosenPayload): boolean =>
  (("targetSchemaVersion" in left && "targetSchemaVersion" in right &&
      left.targetSchemaVersion === right.targetSchemaVersion &&
      left.opportunitySchemaVersion === right.opportunitySchemaVersion &&
      (left.targetSchemaVersion === DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION &&
       right.targetSchemaVersion === DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION
        ? samePhilosopherGainedDreamerSourceContract(left.sourceContract, right.sourceContract) &&
          left.evaluatedCharacterStateRevision === right.evaluatedCharacterStateRevision &&
          left.abilityRoleId === right.abilityRoleId
        : left.targetSchemaVersion === DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION &&
          right.targetSchemaVersion === DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION &&
          sameBaseDreamerSourceContract(left.sourceContract, right.sourceContract))) ||
    (!("targetSchemaVersion" in left) && !("targetSchemaVersion" in right))) &&
  left.rulesBaselineVersion === right.rulesBaselineVersion &&
  left.nightNumber === right.nightNumber &&
  left.taskId === right.taskId &&
  left.taskType === right.taskType &&
  left.opportunityId === right.opportunityId &&
  left.decisionKind === right.decisionKind &&
  left.sourcePlayerId === right.sourcePlayerId &&
  left.sourceSeatNumber === right.sourceSeatNumber &&
  sameRoleSetupSnapshot(left.sourceRole, right.sourceRole) &&
  left.sourceCharacterStateRevision === right.sourceCharacterStateRevision &&
  left.targetPlayerId === right.targetPlayerId &&
  left.targetSeatNumber === right.targetSeatNumber;

export const sameDreamerInformationDelivery = (
  left: DreamerInformationDeliveredPayload,
  right: DreamerInformationDeliveredPayload
): boolean => {
  const leftVersion = "deliverySchemaVersion" in left ? left.deliverySchemaVersion : undefined;
  const rightVersion = "deliverySchemaVersion" in right ? right.deliverySchemaVersion : undefined;
  if (leftVersion !== rightVersion) return false;
  if (leftVersion === DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION) {
    if (!("deliverySchemaVersion" in left) || left.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION ||
        !("deliverySchemaVersion" in right) || right.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION ||
        !sameBaseDreamerSourceContract(left.sourceContract, right.sourceContract) ||
        !sameCanonicalDrunkSourceImpairment(left.sourceImpairment, right.sourceImpairment) ||
        !sameNonVortoxCurrentDemonConstraint(left.currentDemonConstraint, right.currentDemonConstraint) ||
        !sameApparentPairDecision(left.apparentPairDecision, right.apparentPairDecision) ||
        left.informationReliability.kind !== right.informationReliability.kind ||
        left.opportunitySchemaVersion !== right.opportunitySchemaVersion ||
        left.evaluatedCharacterStateRevision !== right.evaluatedCharacterStateRevision) return false;
  } else if (leftVersion === DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION) {
    if (!("deliverySchemaVersion" in left) || left.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION ||
        !("deliverySchemaVersion" in right) || right.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION ||
        !samePhilosopherGainedDreamerSourceContract(left.sourceContract, right.sourceContract) ||
        !sameVortoxConstraint(left.vortoxConstraint, right.vortoxConstraint) ||
        left.informationReliability.kind !== right.informationReliability.kind || left.abilityRoleId !== right.abilityRoleId ||
        left.opportunitySchemaVersion !== right.opportunitySchemaVersion ||
        left.evaluatedCharacterStateRevision !== right.evaluatedCharacterStateRevision) return false;
  } else if (leftVersion === DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION) {
    if (!("deliverySchemaVersion" in left) || left.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION ||
        !("deliverySchemaVersion" in right) || right.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION ||
        !samePhilosopherGainedDreamerSourceContract(left.sourceContract, right.sourceContract) ||
        left.informationReliability.kind !== right.informationReliability.kind || left.abilityRoleId !== right.abilityRoleId ||
        left.opportunitySchemaVersion !== right.opportunitySchemaVersion ||
        left.evaluatedCharacterStateRevision !== right.evaluatedCharacterStateRevision) return false;
  } else if (leftVersion === DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION) {
    if (!("deliverySchemaVersion" in left) || left.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION ||
        !("deliverySchemaVersion" in right) || right.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION ||
        !sameBaseDreamerSourceContract(left.sourceContract, right.sourceContract) ||
        !sameCanonicalDrunkSourceImpairment(left.sourceImpairment, right.sourceImpairment) ||
        !sameVortoxConstraint(left.vortoxConstraint, right.vortoxConstraint) ||
        left.informationReliability.kind !== right.informationReliability.kind ||
        left.evaluatedCharacterStateRevision !== right.evaluatedCharacterStateRevision) return false;
  } else if (leftVersion === DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION) {
    if (!("deliverySchemaVersion" in left) || left.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION ||
        !("deliverySchemaVersion" in right) || right.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION ||
        !sameBaseDreamerSourceContract(left.sourceContract, right.sourceContract) ||
        !sameVortoxConstraint(left.vortoxConstraint, right.vortoxConstraint) ||
        left.informationReliability.kind !== right.informationReliability.kind) return false;
  } else if (leftVersion === DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION) {
    if (!("deliverySchemaVersion" in left) || left.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION ||
        !("deliverySchemaVersion" in right) || right.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION ||
        !sameBaseDreamerSourceContract(left.sourceContract, right.sourceContract) ||
        !sameReliability(left.informationReliability, right.informationReliability)) return false;
  } else if (!("deliverySchemaVersion" in left) && !("deliverySchemaVersion" in right)) {
    if (!sameReliability(left.informationReliability, right.informationReliability)) return false;
  } else return false;
  return left.rulesBaselineVersion === right.rulesBaselineVersion && left.nightNumber === right.nightNumber &&
    left.taskId === right.taskId && left.taskType === right.taskType && left.opportunityId === right.opportunityId &&
    left.knowledgeModelVersion === right.knowledgeModelVersion && left.knowledgeStage === right.knowledgeStage &&
    left.sourcePlayerId === right.sourcePlayerId && left.sourceSeatNumber === right.sourceSeatNumber &&
    left.sourceCharacterStateRevision === right.sourceCharacterStateRevision &&
    left.targetPlayerId === right.targetPlayerId && left.targetSeatNumber === right.targetSeatNumber &&
    sameRoleSetupSnapshot(left.goodRole, right.goodRole) && sameRoleSetupSnapshot(left.evilRole, right.evilRole) &&
    (leftVersion === DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION ||
      ("falseRolePolicyVersion" in left && "falseRolePolicyVersion" in right &&
        left.falseRolePolicyVersion === right.falseRolePolicyVersion));
};

export const evaluateDreamerEffectiveness = (input: {
  readonly sourcePlayerId: PlayerId;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): DreamerEffectivenessResult => {
  const impairment = [...(input.abilityImpairments?.impairments ?? [])]
    .filter((candidate) =>
      candidate.affectedPlayerId === input.sourcePlayerId &&
      (candidate.kind === "DRUNK" || candidate.kind === "POISONED")
    )
    .sort((left, right) => compareStableId(left.impairmentId, right.impairmentId))[0];

  if (impairment === undefined) {
    return { effective: true };
  }

  return {
    effective: false,
    reason: impairment.kind === "DRUNK" ? "SOURCE_DRUNK" : "SOURCE_POISONED",
    impairmentId: impairment.impairmentId,
    impairmentKind: impairment.kind
  };
};

export const createDreamerTargetChosenPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly targetPlayerId: PlayerId;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  readonly roster: PlayerRoster;
  readonly currentCharacterState: CurrentCharacterStateSet;
}): DreamerTargetChosenPayloadV1 | DreamerTargetChosenPayloadV2 => {
  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, input.opportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    (opportunity.opportunityKind !== "DREAMER_FIRST_NIGHT_ACTION" &&
      opportunity.opportunityKind !== "DREAMER_FIRST_NIGHT_ACTION_V3") ||
    opportunity.taskId !== input.taskId ||
    opportunity.taskType !== "DREAMER_ACTION"
  ) {
    throw new DomainError("InvalidDreamerTargetChosenPayload", "DreamerTargetChosen requires an open Dreamer action opportunity");
  }

  const targets = input.roster.filter((entry) => entry.playerId === input.targetPlayerId);
  const targetStates = input.currentCharacterState.entries.filter((entry) => entry.playerId === input.targetPlayerId);
  const target = targets[0];
  const targetState = targetStates[0];
  if (
    targets.length !== 1 || targetStates.length !== 1 || target === undefined ||
    targetState === undefined ||
    target.seatNumber !== targetState.seatNumber
  ) {
    throw new DomainError("InvalidDreamerTargetChosenPayload", "DreamerTargetChosen target must exist in the roster and current character state");
  }

  if (target.playerId === opportunity.sourcePlayerId) {
    throw new DomainError("InvalidDreamerTargetChosenPayload", "DreamerTargetChosen target must not be the Dreamer source");
  }

  const common = {
    rulesBaselineVersion: input.rulesBaselineVersion,
    nightNumber: 1,
    taskId: opportunity.taskId,
    taskType: "DREAMER_ACTION",
    opportunityId: opportunity.opportunityId,
    decisionKind: "CHOOSE_PLAYER",
    sourcePlayerId: opportunity.sourcePlayerId,
    sourceSeatNumber: opportunity.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
    sourceCharacterStateRevision: opportunity.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3"
      ? input.currentCharacterState.revision
      : opportunity.sourceCharacterStateRevision,
    targetPlayerId: target.playerId,
    targetSeatNumber: target.seatNumber
  } as const;
  return opportunity.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3"
    ? {
        ...common,
        targetSchemaVersion: DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION,
        opportunitySchemaVersion: DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
        sourceContract: { ...opportunity.sourceContract }
      }
    : common;
};

export const createPhilosopherGainedDreamerTargetChosenPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly targetPlayerId: PlayerId;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState;
  readonly roster: PlayerRoster;
  readonly currentCharacterState: CurrentCharacterStateSet;
}): DreamerTargetChosenPayloadV3 => {
  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, input.opportunityId);
  const rosterTargets = input.roster.filter((entry) => entry.playerId === input.targetPlayerId);
  const currentTargets = input.currentCharacterState.entries.filter((entry) => entry.playerId === input.targetPlayerId);
  const target = rosterTargets[0];
  const targetState = currentTargets[0];
  if (opportunity === undefined || !isDreamerActionOpportunityV4(opportunity) || opportunity.opportunityStatus !== "OPEN" ||
      opportunity.taskId !== input.taskId || rosterTargets.length !== 1 || currentTargets.length !== 1 ||
      target === undefined || targetState === undefined || target.seatNumber !== targetState.seatNumber ||
      target.playerId === opportunity.sourcePlayerId) {
    throw new DomainError("InvalidDreamerTargetChosenPayload", "Gained Dreamer target requires one matching open V4 opportunity and one other modeled player");
  }
  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    targetSchemaVersion: DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION,
    nightNumber: 1,
    taskId: opportunity.taskId,
    taskType: "DREAMER_ACTION",
    opportunityId: opportunity.opportunityId,
    opportunitySchemaVersion: DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION,
    decisionKind: "CHOOSE_PLAYER",
    sourcePlayerId: opportunity.sourcePlayerId,
    sourceSeatNumber: opportunity.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
    sourceCharacterStateRevision: input.currentCharacterState.revision,
    evaluatedCharacterStateRevision: input.currentCharacterState.revision,
    sourceContract: clonePhilosopherGainedDreamerSourceContract(opportunity.sourceContract),
    abilityRoleId: "dreamer",
    targetPlayerId: target.playerId,
    targetSeatNumber: target.seatNumber
  };
};

const hasExactBaseDreamerSourceContractShape = (value: unknown): value is BaseDreamerV2SourceContract => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, [
    "kind", "sourceAbilityInstanceId", "sourceCharacterStateRevision", "sourceContractVersion",
    "sourcePlayerId", "sourceRoleId", "sourceRoleTenureId", "sourceSeatNumber", "taskId",
    "taskPlanVersion", "taskType"
  ])) return false;
  const parsedTenure = parseRoleTenureId(value.sourceRoleTenureId);
  const parsedAbility = parseFirstNightAbilityInstanceId(value.sourceAbilityInstanceId);
  return value.sourceContractVersion === "dreamer-base-source-contract-v1" && value.kind === "BASE" &&
    value.taskPlanVersion === "first-night-task-plan-v2" && typeof value.taskId === "string" &&
    value.taskType === "DREAMER_ACTION" && typeof value.sourcePlayerId === "string" &&
    Number.isSafeInteger(value.sourceSeatNumber) && (value.sourceSeatNumber as number) >= 1 &&
    (value.sourceSeatNumber as number) <= 12 && value.sourceRoleId === DREAMER_ROLE_ID &&
    Number.isSafeInteger(value.sourceCharacterStateRevision) && (value.sourceCharacterStateRevision as number) > 0 &&
    parsedTenure.valid && parsedTenure.roleId === "dreamer" && parsedTenure.seatNumber === value.sourceSeatNumber &&
    parsedAbility.valid && parsedAbility.kind === "BASE_ROLE_TASK" && parsedAbility.generation === "BASE" &&
    parsedAbility.taskId === value.taskId && parsedAbility.taskType === "DREAMER_ACTION" &&
    parsedAbility.embeddedSeat === value.sourceSeatNumber &&
    value.sourceAbilityInstanceId === formatBaseFirstNightAbilityInstanceId(value.taskId as ScheduledTaskId);
};

export const createDreamerInformationDeliveredPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: DreamerTargetChosenPayloadV1 | DreamerTargetChosenPayloadV2;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly effectiveness: DreamerEffectivenessResult;
}): DreamerInformationDeliveredPayload => {
  const targetEntry = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === input.targetChoice.targetPlayerId &&
    entry.seatNumber === input.targetChoice.targetSeatNumber
  );
  if (targetEntry === undefined) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "DreamerInformationDelivered requires a current target character state");
  }

  const targetRole = roleFromCatalog(input.setup, targetEntry.role);
  if (targetRole === undefined) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "DreamerInformationDelivered target role must exist in the role catalog");
  }

  let goodRole: RoleSetupSnapshot | undefined;
  let evilRole: RoleSetupSnapshot | undefined;
  if (input.effectiveness.effective) {
    if (targetRole.defaultAlignment === "GOOD") {
      goodRole = cloneRoleSetupSnapshot(targetRole);
      evilRole = selectLowestCatalogRoleByAlignment(input.setup, "EVIL", targetRole.roleId);
    } else {
      goodRole = selectLowestCatalogRoleByAlignment(input.setup, "GOOD", targetRole.roleId);
      evilRole = cloneRoleSetupSnapshot(targetRole);
    }
  } else {
    goodRole = selectLowestCatalogRoleByAlignment(input.setup, "GOOD", undefined);
    evilRole = selectLowestCatalogRoleByAlignment(input.setup, "EVIL", undefined);
  }

  if (goodRole === undefined || evilRole === undefined) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "DreamerInformationDelivered requires deterministic GOOD and EVIL role candidates");
  }

  const common = {
    rulesBaselineVersion: input.rulesBaselineVersion,
    nightNumber: 1,
    taskId: input.targetChoice.taskId,
    taskType: "DREAMER_ACTION",
    opportunityId: input.targetChoice.opportunityId,
    knowledgeModelVersion: SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
    knowledgeStage: DREAMER_INFORMATION_STAGE,
    sourcePlayerId: input.targetChoice.sourcePlayerId,
    sourceSeatNumber: input.targetChoice.sourceSeatNumber,
    sourceCharacterStateRevision: input.targetChoice.sourceCharacterStateRevision,
    targetPlayerId: input.targetChoice.targetPlayerId,
    targetSeatNumber: input.targetChoice.targetSeatNumber,
    informationReliability: reliabilityFromEffectiveness(input.effectiveness),
    goodRole,
    evilRole,
    falseRolePolicyVersion: DREAMER_FALSE_ROLE_POLICY_VERSION
  } as const;
  if ("targetSchemaVersion" in input.targetChoice) {
    if (!input.effectiveness.effective) {
      throw new DomainError("InvalidDreamerInformationDeliveredPayload", "V3 Dreamer normal delivery requires proven effective source");
    }
    return {
      ...common,
      deliverySchemaVersion: DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION,
      opportunitySchemaVersion: DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
      sourceContract: { ...input.targetChoice.sourceContract },
      informationReliability: { kind: "EFFECTIVE" }
    };
  }
  return common;
};

export const createDreamerCanonicalDrunkApparentInformationDeliveredPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: DreamerTargetChosenPayloadV2;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly capability: Extract<BaseDreamerV2NormalCapability, {
    readonly kind: "CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED";
  }>;
}): DreamerInformationDeliveredPayloadV7 => {
  if (![input.rulesBaselineVersion, input.targetChoice, input.setup, input.currentCharacterState, input.capability]
    .every(isExceptionSafeCanonicalDreamerData)) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "Dreamer V7 builder requires canonical input data");
  }
  const { targetChoice: choice, capability } = input;
  const sourceEntries = input.currentCharacterState.entries.filter((entry) =>
    entry.playerId === choice.sourcePlayerId && entry.seatNumber === choice.sourceSeatNumber);
  const targetEntries = input.currentCharacterState.entries.filter((entry) =>
    entry.playerId === choice.targetPlayerId && entry.seatNumber === choice.targetSeatNumber);
  const demonEntries = input.currentCharacterState.entries.filter((entry) => entry.role.characterType === "DEMON");
  const source = sourceEntries[0];
  const target = targetEntries[0];
  const demon = demonEntries[0];
  const targetRole = target === undefined ? undefined : roleFromCatalog(input.setup, target.role);
  const catalogIds = input.setup.roleCatalogSnapshot.roles.map((role) => role.roleId);
  const impairment = capability.sourceImpairment;
  if (sourceEntries.length !== 1 || targetEntries.length !== 1 || demonEntries.length !== 1 ||
      source === undefined || target === undefined || demon === undefined || targetRole === undefined ||
      new Set(catalogIds).size !== catalogIds.length ||
      input.setup.roleCatalogSnapshot.roles.some((role) => !hasExactRoleSetupSnapshotShape(role)) ||
      !hasExactBaseDreamerSourceContractShape(choice.sourceContract) ||
      !hasExactCanonicalDrunkSourceImpairmentShape(impairment) ||
      !hasExactNonVortoxCurrentDemonConstraintShape(capability.currentDemonConstraint, input.setup) ||
      source.role.roleId !== "dreamer" || roleFromCatalog(input.setup, source.role) === undefined ||
      capability.evaluationModelVersion !== DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION ||
      capability.evaluatedCharacterStateRevision !== input.currentCharacterState.revision ||
      capability.evaluatedCharacterStateRevision !== choice.sourceCharacterStateRevision ||
      capability.sourceRoleTenureId !== choice.sourceContract.sourceRoleTenureId ||
      capability.sourceAbilityInstanceId !== choice.sourceContract.sourceAbilityInstanceId ||
      impairment.affectedPlayerId !== source.playerId || impairment.affectedSeatNumber !== source.seatNumber ||
      !sameRoleSetupSnapshot(impairment.affectedRole, source.role) ||
      impairment.sourceCharacterStateRevision < choice.sourceContract.sourceCharacterStateRevision ||
      impairment.sourceCharacterStateRevision > capability.evaluatedCharacterStateRevision ||
      demon.playerId !== capability.currentDemonConstraint.demonPlayerId ||
      demon.seatNumber !== capability.currentDemonConstraint.demonSeatNumber ||
      !sameRoleSetupSnapshot(demon.role, capability.currentDemonConstraint.demonRole) ||
      capability.currentDemonConstraint.evaluatedCharacterStateRevision !== input.currentCharacterState.revision) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload",
      "Dreamer V7 requires exact source, target, impairment, tenure, revision, and Fang Gu facts");
  }
  const goodRoles = input.setup.roleCatalogSnapshot.roles.filter((role) =>
    role.characterType === "TOWNSFOLK" || role.characterType === "OUTSIDER");
  const evilRoles = input.setup.roleCatalogSnapshot.roles.filter((role) =>
    role.characterType === "MINION" || role.characterType === "DEMON");
  const legalCandidates = goodRoles.flatMap((goodRole) => evilRoles.map((evilRole) => ({
    candidateId: formatDreamerApparentPairCandidateId(goodRole.roleId, evilRole.roleId),
    goodRole: cloneRoleSetupSnapshot(goodRole),
    evilRole: cloneRoleSetupSnapshot(evilRole),
    truthClassification: goodRole.roleId === targetRole.roleId || evilRole.roleId === targetRole.roleId
      ? "TRUE" as const : "FALSE" as const
  }))).sort((left, right) => compareRawUtf16(left.candidateId, right.candidateId));
  if (legalCandidates.length === 0 || !legalCandidates.some((candidate) => candidate.truthClassification === "TRUE") ||
      !legalCandidates.some((candidate) => candidate.truthClassification === "FALSE")) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload",
      "Dreamer V7 requires complete TRUE and FALSE apparent-pair candidates");
  }
  const material = `${impairment.impairmentId}\0${target.playerId}\0${targetRole.roleId}`;
  let sum = 0;
  for (let index = 0; index < material.length; index += 1) sum += material.charCodeAt(index);
  const selected = legalCandidates.find((candidate) =>
    candidate.truthClassification === (sum % 2 === 0 ? "TRUE" : "FALSE"));
  if (selected === undefined) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "Dreamer V7 deterministic selection failed");
  }
  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    deliverySchemaVersion: DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION,
    nightNumber: 1,
    taskId: choice.taskId,
    taskType: "DREAMER_ACTION",
    opportunityId: choice.opportunityId,
    opportunitySchemaVersion: DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
    knowledgeModelVersion: SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
    knowledgeStage: DREAMER_INFORMATION_STAGE,
    sourcePlayerId: choice.sourcePlayerId,
    sourceSeatNumber: choice.sourceSeatNumber,
    sourceCharacterStateRevision: choice.sourceCharacterStateRevision,
    evaluatedCharacterStateRevision: capability.evaluatedCharacterStateRevision,
    sourceContract: { ...choice.sourceContract },
    targetPlayerId: choice.targetPlayerId,
    targetSeatNumber: choice.targetSeatNumber,
    informationReliability: { kind: "CANONICAL_SOURCE_DRUNK_APPARENT_INFORMATION" },
    sourceImpairment: { ...impairment, affectedRole: cloneRoleSetupSnapshot(impairment.affectedRole) },
    currentDemonConstraint: {
      ...capability.currentDemonConstraint,
      demonRole: cloneRoleSetupSnapshot(capability.currentDemonConstraint.demonRole)
    },
    apparentPairDecision: {
      candidateModelVersion: DREAMER_APPARENT_PAIR_CANDIDATE_MODEL_VERSION,
      simulationPolicyVersion: DREAMER_CANONICAL_DRUNK_PAIR_SELECTION_POLICY_VERSION,
      legalCandidates: legalCandidates.map(cloneApparentPairCandidate),
      selectedCandidateId: selected.candidateId
    },
    goodRole: cloneRoleSetupSnapshot(selected.goodRole),
    evilRole: cloneRoleSetupSnapshot(selected.evilRole)
  };
};

export const createPhilosopherGainedDreamerInformationDeliveredPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: DreamerTargetChosenPayloadV3;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly capability: Extract<PhilosopherGainedDreamerCapability, {
    readonly kind: "NORMAL_INFORMATION_SUPPORTED" | "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
  }>;
}): DreamerInformationDeliveredPayloadV5 | DreamerInformationDeliveredPayloadV6 => {
  const { targetChoice: choice, capability } = input;
  const targetEntries = input.currentCharacterState.entries.filter((entry) =>
    entry.playerId === choice.targetPlayerId && entry.seatNumber === choice.targetSeatNumber);
  const target = targetEntries[0];
  const targetRole = target === undefined ? undefined : roleFromCatalog(input.setup, target.role);
  if (targetEntries.length !== 1 || target === undefined || targetRole === undefined ||
      !hasExactPhilosopherGainedDreamerSourceContractV1Shape(choice.sourceContract) ||
      capability.evaluatedCharacterStateRevision !== input.currentCharacterState.revision ||
      capability.evaluatedCharacterStateRevision !== choice.evaluatedCharacterStateRevision ||
      capability.sourceRoleTenureId !== choice.sourceContract.sourceRoleTenureId ||
      capability.sourceAbilityInstanceId !== choice.sourceContract.sourceAbilityInstanceId) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "Gained Dreamer information requires canonical source, target, and capability facts");
  }
  const forcedFalse = capability.kind === "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
  const nativeGood = targetRole.characterType === "TOWNSFOLK" || targetRole.characterType === "OUTSIDER";
  const nativeEvil = targetRole.characterType === "MINION" || targetRole.characterType === "DEMON";
  if (!nativeGood && !nativeEvil) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "Gained Dreamer target must have a native GOOD or EVIL category");
  }
  const goodRole = forcedFalse
    ? selectLowestCatalogRoleByNativeCategory(input.setup, "GOOD", targetRole.roleId)
    : nativeGood ? cloneRoleSetupSnapshot(targetRole) : selectLowestCatalogRoleByNativeCategory(input.setup, "GOOD", targetRole.roleId);
  const evilRole = forcedFalse
    ? selectLowestCatalogRoleByNativeCategory(input.setup, "EVIL", targetRole.roleId)
    : nativeEvil ? cloneRoleSetupSnapshot(targetRole) : selectLowestCatalogRoleByNativeCategory(input.setup, "EVIL", targetRole.roleId);
  if (goodRole === undefined || evilRole === undefined) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "Gained Dreamer information requires deterministic GOOD and EVIL candidates");
  }
  const common = {
    rulesBaselineVersion: input.rulesBaselineVersion,
    nightNumber: 1,
    taskId: choice.taskId,
    taskType: "DREAMER_ACTION",
    opportunityId: choice.opportunityId,
    opportunitySchemaVersion: DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION,
    knowledgeModelVersion: SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
    knowledgeStage: DREAMER_INFORMATION_STAGE,
    sourcePlayerId: choice.sourcePlayerId,
    sourceSeatNumber: choice.sourceSeatNumber,
    sourceCharacterStateRevision: choice.sourceCharacterStateRevision,
    evaluatedCharacterStateRevision: capability.evaluatedCharacterStateRevision,
    sourceContract: clonePhilosopherGainedDreamerSourceContract(choice.sourceContract),
    abilityRoleId: "dreamer",
    targetPlayerId: choice.targetPlayerId,
    targetSeatNumber: choice.targetSeatNumber,
    goodRole,
    evilRole,
    falseRolePolicyVersion: DREAMER_FALSE_ROLE_POLICY_VERSION
  } as const;
  return forcedFalse
    ? {
        ...common,
        deliverySchemaVersion: DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION,
        informationReliability: { kind: "VORTOX_FORCED_FALSE" },
        vortoxConstraint: { ...capability.vortoxConstraint }
      }
    : {
        ...common,
        deliverySchemaVersion: DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION,
        informationReliability: { kind: "PHILOSOPHER_GAINED_EFFECTIVE" }
      };
};

export const createDreamerVortoxInformationDeliveredPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: DreamerTargetChosenPayloadV2;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly capability: Extract<BaseDreamerV2NormalCapability, {
    readonly kind: "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
  }>;
}): DreamerInformationDeliveredPayloadV3 => {
  const { targetChoice: choice, capability } = input;
  const source = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === choice.sourcePlayerId && entry.seatNumber === choice.sourceSeatNumber);
  const target = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === choice.targetPlayerId && entry.seatNumber === choice.targetSeatNumber);
  const vortox = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === capability.vortoxConstraint.vortoxPlayerId &&
    entry.seatNumber === capability.vortoxConstraint.vortoxSeatNumber);
  const targetRole = target === undefined ? undefined : roleFromCatalog(input.setup, target.role);
  const sourceRole = source === undefined ? undefined : roleFromCatalog(input.setup, source.role);
  const vortoxRole = vortox === undefined ? undefined : roleFromCatalog(input.setup, vortox.role);
  if (!hasExactBaseDreamerSourceContractShape(choice.sourceContract) || source === undefined || target === undefined ||
      vortox === undefined || sourceRole?.roleId !== DREAMER_ROLE_ID || targetRole === undefined ||
      vortoxRole?.roleId !== "vortox" || capability.evaluationModelVersion !== DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION ||
      capability.evaluatedCharacterStateRevision !== input.currentCharacterState.revision ||
      capability.evaluatedCharacterStateRevision !== choice.sourceCharacterStateRevision ||
      capability.sourceRoleTenureId !== choice.sourceContract.sourceRoleTenureId ||
      capability.sourceAbilityInstanceId !== choice.sourceContract.sourceAbilityInstanceId ||
      capability.vortoxConstraint.evaluatedCharacterStateRevision !== input.currentCharacterState.revision ||
      capability.vortoxConstraint.vortoxRoleId !== "vortox") {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "Dreamer Vortox information requires canonical source, target, and Vortox facts");
  }
  const goodRole = selectLowestCatalogRoleByNativeCategory(input.setup, "GOOD", targetRole.roleId);
  const evilRole = selectLowestCatalogRoleByNativeCategory(input.setup, "EVIL", targetRole.roleId);
  if (goodRole === undefined || evilRole === undefined) {
    throw new DomainError("InvalidDreamerInformationDeliveredPayload", "Dreamer Vortox information requires deterministic false GOOD and EVIL role candidates");
  }
  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    deliverySchemaVersion: DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION,
    nightNumber: 1,
    taskId: choice.taskId,
    taskType: "DREAMER_ACTION",
    opportunityId: choice.opportunityId,
    opportunitySchemaVersion: DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
    knowledgeModelVersion: SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
    knowledgeStage: DREAMER_INFORMATION_STAGE,
    sourcePlayerId: choice.sourcePlayerId,
    sourceSeatNumber: choice.sourceSeatNumber,
    sourceCharacterStateRevision: choice.sourceCharacterStateRevision,
    sourceContract: { ...choice.sourceContract },
    targetPlayerId: choice.targetPlayerId,
    targetSeatNumber: choice.targetSeatNumber,
    informationReliability: { kind: "VORTOX_FORCED_FALSE" },
    vortoxConstraint: { ...capability.vortoxConstraint },
    goodRole,
    evilRole,
    falseRolePolicyVersion: DREAMER_FALSE_ROLE_POLICY_VERSION
  };
};

export const createDreamerCanonicalDrunkVortoxInformationDeliveredPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: DreamerTargetChosenPayloadV2;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly capability: Extract<BaseDreamerV2NormalCapability, {
    readonly kind: "CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
  }>;
}): DreamerInformationDeliveredPayloadV4 => {
  const { targetChoice: choice, capability } = input;
  const source = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === choice.sourcePlayerId && entry.seatNumber === choice.sourceSeatNumber);
  const target = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === choice.targetPlayerId && entry.seatNumber === choice.targetSeatNumber);
  const vortox = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === capability.vortoxConstraint.vortoxPlayerId &&
    entry.seatNumber === capability.vortoxConstraint.vortoxSeatNumber);
  const targetRole = target === undefined ? undefined : roleFromCatalog(input.setup, target.role);
  const sourceRole = source === undefined ? undefined : roleFromCatalog(input.setup, source.role);
  const vortoxRole = vortox === undefined ? undefined : roleFromCatalog(input.setup, vortox.role);
  const impairment = capability.sourceImpairment;
  if (!hasExactBaseDreamerSourceContractShape(choice.sourceContract) ||
      !hasExactCanonicalDrunkSourceImpairmentShape(impairment) ||
      source === undefined || target === undefined || vortox === undefined ||
      sourceRole?.roleId !== DREAMER_ROLE_ID || targetRole === undefined || vortoxRole?.roleId !== "vortox" ||
      capability.evaluationModelVersion !== DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION ||
      capability.evaluatedCharacterStateRevision !== input.currentCharacterState.revision ||
      capability.evaluatedCharacterStateRevision !== choice.sourceCharacterStateRevision ||
      capability.sourceRoleTenureId !== choice.sourceContract.sourceRoleTenureId ||
      capability.sourceAbilityInstanceId !== choice.sourceContract.sourceAbilityInstanceId ||
      capability.vortoxConstraint.evaluatedCharacterStateRevision !== input.currentCharacterState.revision ||
      capability.vortoxConstraint.vortoxRoleId !== "vortox" ||
      impairment.affectedPlayerId !== source.playerId ||
      impairment.affectedSeatNumber !== source.seatNumber ||
      !sameRoleSetupSnapshot(impairment.affectedRole, source.role) ||
      impairment.sourceCharacterStateRevision < choice.sourceContract.sourceCharacterStateRevision ||
      impairment.sourceCharacterStateRevision > capability.evaluatedCharacterStateRevision) {
    throw new DomainError(
      "InvalidDreamerInformationDeliveredPayload",
      "Dreamer canonical-drunk Vortox information requires exact source, impairment, target, and Vortox facts"
    );
  }
  const goodRole = selectLowestCatalogRoleByNativeCategory(input.setup, "GOOD", targetRole.roleId);
  const evilRole = selectLowestCatalogRoleByNativeCategory(input.setup, "EVIL", targetRole.roleId);
  if (goodRole === undefined || evilRole === undefined) {
    throw new DomainError(
      "InvalidDreamerInformationDeliveredPayload",
      "Dreamer canonical-drunk Vortox information requires deterministic false GOOD and EVIL role candidates"
    );
  }
  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    deliverySchemaVersion: DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION,
    nightNumber: 1,
    taskId: choice.taskId,
    taskType: "DREAMER_ACTION",
    opportunityId: choice.opportunityId,
    opportunitySchemaVersion: DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
    knowledgeModelVersion: SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
    knowledgeStage: DREAMER_INFORMATION_STAGE,
    sourcePlayerId: choice.sourcePlayerId,
    sourceSeatNumber: choice.sourceSeatNumber,
    sourceCharacterStateRevision: choice.sourceCharacterStateRevision,
    evaluatedCharacterStateRevision: capability.evaluatedCharacterStateRevision,
    sourceContract: { ...choice.sourceContract },
    targetPlayerId: choice.targetPlayerId,
    targetSeatNumber: choice.targetSeatNumber,
    informationReliability: { kind: "VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK" },
    sourceImpairment: {
      impairmentId: impairment.impairmentId,
      kind: impairment.kind,
      sourceKind: impairment.sourceKind,
      sourcePlayerId: impairment.sourcePlayerId,
      affectedPlayerId: impairment.affectedPlayerId,
      affectedSeatNumber: impairment.affectedSeatNumber,
      affectedRole: cloneRoleSetupSnapshot(impairment.affectedRole),
      chosenRoleId: "dreamer",
      sourceCharacterStateRevision: impairment.sourceCharacterStateRevision
    },
    vortoxConstraint: { ...capability.vortoxConstraint },
    goodRole,
    evilRole,
    falseRolePolicyVersion: DREAMER_FALSE_ROLE_POLICY_VERSION
  };
};

export const createDreamerInformationDeliveredScheduledTaskSettlement = (input: {
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): ScheduledTaskSettlement => ({
  taskId: input.taskId,
  taskType: "DREAMER_ACTION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "DREAMER_INFORMATION_DELIVERED",
  characterStateRevision: input.characterStateRevision
});

const validateDreamerTargetChosenPayloadInternal = (
  payload: unknown,
  input: DreamerActionInput
): ValidationResult => {
  if (!isExceptionSafeCanonicalDreamerData(payload)) {
    return fail("DreamerTargetChosen payload must use exception-safe canonical data");
  }
  if (!isPlainRecord(payload)) {
    return fail("DreamerTargetChosen payload must have exact runtime shape");
  }
  const hasVersion = Object.hasOwn(payload, "targetSchemaVersion");
  const v2 = hasVersion && payload.targetSchemaVersion === DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION;
  const v3 = hasVersion && payload.targetSchemaVersion === DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION;
  if ((hasVersion && !v2 && !v3) || !hasExactEnumerableKeys(payload, v3
      ? DREAMER_TARGET_CHOSEN_V3_PAYLOAD_KEYS
      : v2 ? DREAMER_TARGET_CHOSEN_V2_PAYLOAD_KEYS
      : DREAMER_TARGET_CHOSEN_PAYLOAD_KEYS)) {
    return fail("DreamerTargetChosen payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    payload.taskType !== "DREAMER_ACTION" ||
    typeof payload.opportunityId !== "string" ||
    payload.opportunityId.trim().length === 0 ||
    payload.decisionKind !== "CHOOSE_PLAYER" ||
    typeof payload.sourcePlayerId !== "string" ||
    payload.sourcePlayerId.trim().length === 0 ||
    typeof payload.sourceSeatNumber !== "number" ||
    !Number.isInteger(payload.sourceSeatNumber) ||
    payload.sourceSeatNumber < 1 ||
    payload.sourceSeatNumber > 12 ||
    !hasExactRoleSetupSnapshotShape(payload.sourceRole) ||
    typeof payload.sourceCharacterStateRevision !== "number" ||
    !Number.isInteger(payload.sourceCharacterStateRevision) ||
    payload.sourceCharacterStateRevision <= 0 ||
    typeof payload.targetPlayerId !== "string" ||
    payload.targetPlayerId.trim().length === 0 ||
    typeof payload.targetSeatNumber !== "number" ||
    !Number.isInteger(payload.targetSeatNumber) ||
    payload.targetSeatNumber < 1 ||
    payload.targetSeatNumber > 12 ||
    (v2 && (payload.opportunitySchemaVersion !== DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION ||
      !hasExactBaseDreamerSourceContractShape(payload.sourceContract))) ||
    (v3 && (payload.opportunitySchemaVersion !== DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION ||
      !Number.isSafeInteger(payload.evaluatedCharacterStateRevision) ||
      payload.evaluatedCharacterStateRevision !== payload.sourceCharacterStateRevision ||
      payload.abilityRoleId !== "dreamer" ||
      !hasExactPhilosopherGainedDreamerSourceContractV1Shape(payload.sourceContract)))
  ) {
    return fail("DreamerTargetChosen fields must use supported primitive values");
  }

  const sourceValidation = validateDreamerTaskSource(input);
  if (!sourceValidation.valid) {
    return sourceValidation;
  }

  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, payload.opportunityId as ActionOpportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    opportunity.opportunityKind !== (v3 ? "DREAMER_FIRST_NIGHT_ACTION_V4" : v2 ? "DREAMER_FIRST_NIGHT_ACTION_V3" : "DREAMER_FIRST_NIGHT_ACTION") ||
    opportunity.taskId !== payload.taskId ||
    opportunity.taskType !== "DREAMER_ACTION" ||
    opportunity.sourcePlayerId !== payload.sourcePlayerId ||
    opportunity.sourceSeatNumber !== payload.sourceSeatNumber ||
    !sameRoleSetupSnapshot(opportunity.sourceRole, payload.sourceRole) ||
    (v3
      ? (!isDreamerActionOpportunityV4(opportunity) ||
        !samePhilosopherGainedDreamerSourceContract(opportunity.sourceContract,
          payload.sourceContract as PhilosopherGainedDreamerSourceContractV1) ||
        payload.sourceCharacterStateRevision !== input.currentCharacterState.revision ||
        payload.evaluatedCharacterStateRevision !== input.currentCharacterState.revision)
      : v2
      ? (!isDreamerActionOpportunityV3(opportunity) ||
        !sameBaseDreamerSourceContract(opportunity.sourceContract, payload.sourceContract as BaseDreamerV2SourceContract) ||
        payload.sourceCharacterStateRevision !== input.currentCharacterState.revision ||
        (payload.sourceContract as BaseDreamerV2SourceContract).sourceCharacterStateRevision !== opportunity.sourceCharacterStateRevision)
      : opportunity.sourceCharacterStateRevision !== payload.sourceCharacterStateRevision)
  ) {
    return fail("DreamerTargetChosen must match the referenced Dreamer action opportunity");
  }

  const target = input.roster.find((entry) => entry.playerId === payload.targetPlayerId);
  const targetState = input.currentCharacterState.entries.find((entry) => entry.playerId === payload.targetPlayerId);
  if (
    target === undefined ||
    targetState === undefined ||
    target.seatNumber !== payload.targetSeatNumber ||
    targetState.seatNumber !== payload.targetSeatNumber
  ) {
    return fail("DreamerTargetChosen target must exist in roster and current character state");
  }

  if (target.playerId === payload.sourcePlayerId) {
    return fail("DreamerTargetChosen target must not be the source Dreamer");
  }

  const expected = v3 ? createPhilosopherGainedDreamerTargetChosenPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    taskId: payload.taskId as ScheduledTaskId,
    opportunityId: payload.opportunityId as ActionOpportunityId,
    targetPlayerId: payload.targetPlayerId as PlayerId,
    firstNightActionOpportunities: input.firstNightActionOpportunities ?? { opportunities: [] },
    roster: input.roster,
    currentCharacterState: input.currentCharacterState
  }) : createDreamerTargetChosenPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    taskId: payload.taskId as ScheduledTaskId,
    opportunityId: payload.opportunityId as ActionOpportunityId,
    targetPlayerId: payload.targetPlayerId as PlayerId,
    firstNightActionOpportunities: input.firstNightActionOpportunities,
    roster: input.roster,
    currentCharacterState: input.currentCharacterState
  });

  if (!sameTargetChoice(payload as unknown as DreamerTargetChosenPayload, expected)) {
    return fail("DreamerTargetChosen must match the open opportunity and target facts");
  }

  return { valid: true };
};

export const validateDreamerTargetChosenPayload = (
  payload: unknown,
  input: DreamerActionInput
): ValidationResult => {
  try {
    return validateDreamerTargetChosenPayloadInternal(payload, input);
  } catch {
    return fail("DreamerTargetChosen payload validation failed closed");
  }
};

const validateDreamerInformationDeliveredPayloadInternal = (
  payload: unknown,
  input: {
    readonly choices: DreamerTargetChoiceSet | undefined;
    readonly deliveries: DreamerInformationSet | undefined;
    readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
    readonly currentCharacterState: CurrentCharacterStateSet;
    readonly abilityImpairments: AbilityImpairmentSet | undefined;
    readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
    readonly firstNightTaskPlan?: FirstNightTaskPlan;
    readonly firstNightTaskProgress?: FirstNightTaskProgress;
    readonly roleTenures?: RoleTenureState;
  }
): ValidationResult => {
  const shapeValidation = validateDreamerInformationPayloadShape(payload, input.setup);
  if (!shapeValidation.valid) {
    return shapeValidation;
  }
  const delivery = shapeValidation.payload;
  const v2 = "deliverySchemaVersion" in delivery &&
    delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION;
  const v3 = "deliverySchemaVersion" in delivery &&
    delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION;
  const v4 = "deliverySchemaVersion" in delivery &&
    delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION;
  const v5 = "deliverySchemaVersion" in delivery &&
    delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION;
  const v6 = "deliverySchemaVersion" in delivery &&
    delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION;
  const v7 = "deliverySchemaVersion" in delivery &&
    delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION;

  if (input.deliveries?.deliveries.some((candidate) => candidate.opportunityId === delivery.opportunityId) === true) {
    return fail("DreamerInformationDelivered cannot deliver the same opportunity twice");
  }

  const choice = findDreamerTargetChoice(input.choices, {
    taskId: delivery.taskId,
    opportunityId: delivery.opportunityId,
    targetPlayerId: delivery.targetPlayerId
  });
  if (choice === undefined) {
    return fail("DreamerInformationDelivered must follow a matching DreamerTargetChosen event");
  }

  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, choice.opportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    opportunity.opportunityKind !== (v5 || v6 ? "DREAMER_FIRST_NIGHT_ACTION_V4" :
      v2 || v3 || v4 || v7 ? "DREAMER_FIRST_NIGHT_ACTION_V3" : "DREAMER_FIRST_NIGHT_ACTION") ||
    opportunity.taskType !== "DREAMER_ACTION"
  ) {
    return fail("DreamerInformationDelivered must close a matching OPEN Dreamer action opportunity");
  }

  const targetReference = {
    playerId: delivery.targetPlayerId,
    seatNumber: delivery.targetSeatNumber
  };
  if (!hasExactKnownPlayerReferenceShape(targetReference) || !sameKnownPlayerReference(targetReference, {
    playerId: choice.targetPlayerId,
    seatNumber: choice.targetSeatNumber
  })) {
    return fail("DreamerInformationDelivered target must match the preceding target choice");
  }

  let expected: DreamerInformationDeliveredPayload;
  if (v5 || v6) {
    if (!("targetSchemaVersion" in choice) || choice.targetSchemaVersion !== DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION ||
        !isDreamerActionOpportunityV4(opportunity) || input.roleTenures === undefined ||
        !samePhilosopherGainedDreamerSourceContract(delivery.sourceContract, choice.sourceContract) ||
        !samePhilosopherGainedDreamerSourceContract(delivery.sourceContract, opportunity.sourceContract)) {
      return fail("Gained Dreamer delivery requires canonical V4 source provenance");
    }
    const capability = resolvePhilosopherGainedDreamerCapability({ opportunity,
      currentCharacterState: input.currentCharacterState, setup: input.setup,
      roleTenures: input.roleTenures, abilityImpairments: input.abilityImpairments });
    if ((v5 && capability.kind !== "NORMAL_INFORMATION_SUPPORTED") ||
        (v6 && capability.kind !== "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED")) {
      return fail("Gained Dreamer delivery requires the matching settlement-time capability");
    }
    expected = createPhilosopherGainedDreamerInformationDeliveredPayload({
      rulesBaselineVersion: delivery.rulesBaselineVersion,
      targetChoice: choice,
      setup: input.setup,
      currentCharacterState: input.currentCharacterState,
      capability: capability as Extract<PhilosopherGainedDreamerCapability, {
        readonly kind: "NORMAL_INFORMATION_SUPPORTED" | "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
      }>
    });
  } else if (v2 || v3 || v4 || v7) {
    if (!("targetSchemaVersion" in choice) || choice.targetSchemaVersion !== DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION ||
        !isDreamerActionOpportunityV3(opportunity) ||
        input.firstNightTaskPlan === undefined ||
        input.roleTenures === undefined || input.firstNightActionOpportunities === undefined ||
        !sameBaseDreamerSourceContract(delivery.sourceContract, choice.sourceContract) ||
        !sameBaseDreamerSourceContract(delivery.sourceContract, opportunity.sourceContract)) {
      return fail("DreamerInformationDelivered versioned delivery requires canonical V3 source provenance");
    }
    const baseChoice = choice;
    const capability = resolveBaseDreamerV2NormalCapability({
      opportunity,
      firstNightTaskPlan: input.firstNightTaskPlan,
      firstNightTaskProgress: input.firstNightTaskProgress,
      firstNightActionOpportunities: input.firstNightActionOpportunities,
      currentCharacterState: input.currentCharacterState,
      setup: input.setup,
      roleTenures: input.roleTenures,
      abilityImpairments: input.abilityImpairments
    });
    if (v2 && capability.kind !== "NORMAL_INFORMATION_SUPPORTED") {
      return fail("DreamerInformationDelivered V2 requires proven normal-information capability");
    }
    if (v3 && capability.kind !== "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED") {
      return fail("DreamerInformationDelivered V3 requires proven Vortox forced-false capability");
    }
    if (v4 && capability.kind !== "CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED") {
      return fail("DreamerInformationDelivered V4 requires proven canonical-drunk Vortox forced-false capability");
    }
    if (v7 && capability.kind !== "CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED") {
      return fail("DreamerInformationDelivered V7 requires proven canonical-drunk Fang Gu capability");
    }
    expected = v7
      ? createDreamerCanonicalDrunkApparentInformationDeliveredPayload({
          rulesBaselineVersion: delivery.rulesBaselineVersion,
          targetChoice: baseChoice,
          setup: input.setup,
          currentCharacterState: input.currentCharacterState,
          capability: capability as Extract<BaseDreamerV2NormalCapability, {
            readonly kind: "CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED";
          }>
        })
      : v4
      ? createDreamerCanonicalDrunkVortoxInformationDeliveredPayload({
          rulesBaselineVersion: delivery.rulesBaselineVersion,
          targetChoice: baseChoice,
          setup: input.setup,
          currentCharacterState: input.currentCharacterState,
          capability: capability as Extract<BaseDreamerV2NormalCapability, {
            readonly kind: "CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
          }>
        })
      : v3
      ? createDreamerVortoxInformationDeliveredPayload({
          rulesBaselineVersion: delivery.rulesBaselineVersion,
          targetChoice: baseChoice,
          setup: input.setup,
          currentCharacterState: input.currentCharacterState,
          capability: capability as Extract<BaseDreamerV2NormalCapability, {
            readonly kind: "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
          }>
        })
      : createDreamerInformationDeliveredPayload({
          rulesBaselineVersion: delivery.rulesBaselineVersion,
          targetChoice: baseChoice,
          setup: input.setup,
          currentCharacterState: input.currentCharacterState,
          effectiveness: { effective: true }
        });
  } else {
    const effectiveness = evaluateDreamerEffectiveness({
      sourcePlayerId: choice.sourcePlayerId,
      abilityImpairments: input.abilityImpairments
    });
    expected = createDreamerInformationDeliveredPayload({
      rulesBaselineVersion: delivery.rulesBaselineVersion,
      targetChoice: choice,
      setup: input.setup,
      currentCharacterState: input.currentCharacterState,
      effectiveness
    });
  }

  if (!sameDreamerInformationDelivery(delivery, expected)) {
    return fail("DreamerInformationDelivered must match the target choice, current role facts, source effectiveness, and deterministic false-role policy");
  }

  return { valid: true };
};

export const validateDreamerInformationDeliveredPayload = (
  payload: unknown,
  input: {
    readonly choices: DreamerTargetChoiceSet | undefined;
    readonly deliveries: DreamerInformationSet | undefined;
    readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
    readonly currentCharacterState: CurrentCharacterStateSet;
    readonly abilityImpairments: AbilityImpairmentSet | undefined;
    readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
    readonly firstNightTaskPlan?: FirstNightTaskPlan;
    readonly firstNightTaskProgress?: FirstNightTaskProgress;
    readonly roleTenures?: RoleTenureState;
  }
): ValidationResult => {
  try {
    return validateDreamerInformationDeliveredPayloadInternal(payload, input);
  } catch {
    return fail("DreamerInformationDelivered payload validation failed closed");
  }
};

export const validateStoredDreamerInformationDelivered = (
  payload: unknown,
  sourceFacts: {
    readonly rulesBaselineVersion: string;
    readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
    readonly roster: PlayerRoster;
    readonly firstNightTaskPlan: Pick<FirstNightTaskPlan, "tasks">;
    readonly choices: DreamerTargetChoiceSet | undefined;
    readonly settlement: ScheduledTaskSettlement | undefined;
  }
): ValidationResult => {
  const shapeValidation = validateDreamerInformationPayloadShape(payload, sourceFacts.setup);
  if (!shapeValidation.valid) {
    return fail(`Stored ${shapeValidation.reason}`);
  }
  const delivery = shapeValidation.payload;
  const gained = "deliverySchemaVersion" in delivery &&
    (delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION ||
     delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION);

  if (delivery.rulesBaselineVersion !== sourceFacts.rulesBaselineVersion) {
    return fail("Stored DreamerInformationDelivered rules baseline must match the game");
  }

  const matchingTasks = sourceFacts.firstNightTaskPlan.tasks.filter((candidate) => candidate.taskId === delivery.taskId);
  const task = matchingTasks[0];
  const plannedSourceValid = task !== undefined && (gained
    ? task.source.kind === "PHILOSOPHER_GAINED_ABILITY" && task.source.sourceRole.roleId === "philosopher" &&
      task.source.chosenRole.roleId === DREAMER_ROLE_ID &&
      roleFromCatalog(sourceFacts.setup, task.source.sourceRole) !== undefined
    : task.source.kind === "ROLE" && task.source.role.roleId === DREAMER_ROLE_ID &&
      roleFromCatalog(sourceFacts.setup, task.source.role) !== undefined);
  const sourceIdentityValid = task !== undefined && task.source.kind !== "SYSTEM" &&
    task.source.playerId === delivery.sourcePlayerId && task.source.seatNumber === delivery.sourceSeatNumber;
  if (
    matchingTasks.length !== 1 ||
    task === undefined ||
    task.taskType !== "DREAMER_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    !plannedSourceValid ||
    !sourceIdentityValid
  ) {
    return fail("Stored DreamerInformationDelivered must match a planned base Dreamer action task");
  }

  const source = sourceFacts.roster.find((entry) => entry.playerId === delivery.sourcePlayerId);
  const target = sourceFacts.roster.find((entry) => entry.playerId === delivery.targetPlayerId);
  if (
    source === undefined ||
    source.seatNumber !== delivery.sourceSeatNumber ||
    target === undefined ||
    target.seatNumber !== delivery.targetSeatNumber ||
    source.playerId === target.playerId
  ) {
    return fail("Stored DreamerInformationDelivered source and target must match the historical roster");
  }

  const matchingChoices = sourceFacts.choices?.choices.filter((choice) =>
    choice.taskId === delivery.taskId &&
    choice.opportunityId === delivery.opportunityId
  ) ?? [];
  const choice = matchingChoices[0];
  if (
    matchingChoices.length !== 1 ||
    choice === undefined ||
    !isPlainRecord(choice) ||
    !hasExactEnumerableKeys(choice, "targetSchemaVersion" in choice
      ? choice.targetSchemaVersion === DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION
        ? DREAMER_TARGET_CHOSEN_V3_PAYLOAD_KEYS
        : DREAMER_TARGET_CHOSEN_V2_PAYLOAD_KEYS
      : DREAMER_TARGET_CHOSEN_PAYLOAD_KEYS) ||
    choice.rulesBaselineVersion !== delivery.rulesBaselineVersion ||
    choice.nightNumber !== delivery.nightNumber ||
    choice.taskType !== delivery.taskType ||
    choice.decisionKind !== "CHOOSE_PLAYER" ||
    choice.sourcePlayerId !== delivery.sourcePlayerId ||
    choice.sourceSeatNumber !== delivery.sourceSeatNumber ||
    choice.sourceCharacterStateRevision !== delivery.sourceCharacterStateRevision ||
    choice.targetPlayerId !== delivery.targetPlayerId ||
    choice.targetSeatNumber !== delivery.targetSeatNumber ||
    !hasExactRoleSetupSnapshotShape(choice.sourceRole) ||
    !sameRoleSetupSnapshot(choice.sourceRole, task.source.kind === "ROLE" ? task.source.role :
      task.source.kind === "PHILOSOPHER_GAINED_ABILITY" ? task.source.sourceRole : choice.sourceRole) ||
    ("deliverySchemaVersion" in delivery && (!("targetSchemaVersion" in choice) ||
      choice.opportunitySchemaVersion !== delivery.opportunitySchemaVersion ||
      (gained
        ? choice.targetSchemaVersion !== DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION ||
          !("abilityRoleId" in choice) || choice.abilityRoleId !== "dreamer" ||
          !("evaluatedCharacterStateRevision" in choice) ||
          choice.evaluatedCharacterStateRevision !== delivery.evaluatedCharacterStateRevision ||
          !samePhilosopherGainedDreamerSourceContract(choice.sourceContract,
            delivery.sourceContract)
        : choice.targetSchemaVersion !== DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION ||
          !sameBaseDreamerSourceContract(choice.sourceContract,
            delivery.sourceContract))))
  ) {
    return fail("Stored DreamerInformationDelivered must match one exact historical DreamerTargetChosen fact");
  }

  const settlement = sourceFacts.settlement;
  if (
    settlement === undefined ||
    !isPlainRecord(settlement) ||
    !hasExactEnumerableKeys(settlement, DREAMER_SETTLEMENT_KEYS) ||
    settlement.taskId !== delivery.taskId ||
    settlement.taskType !== "DREAMER_ACTION" ||
    settlement.nightNumber !== 1 ||
    settlement.settlementVersion !== SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION ||
    settlement.outcomeType !== "DREAMER_INFORMATION_DELIVERED" ||
    settlement.characterStateRevision !== delivery.sourceCharacterStateRevision
  ) {
    return fail("Stored DreamerInformationDelivered requires one matching ScheduledTaskSettled fact");
  }

  return { valid: true };
};

export const appendDreamerTargetChoice = (
  state: DreamerTargetChoiceSet | undefined,
  payload: DreamerTargetChosenPayload
): DreamerTargetChoiceSet => ({
  choices: [...cloneDreamerTargetChoiceSet(state).choices, cloneTargetChoice(payload)]
});

export const appendDreamerInformationDelivery = (
  state: DreamerInformationSet | undefined,
  payload: DreamerInformationDeliveredPayload
): DreamerInformationSet => ({
  deliveries: [...cloneDreamerInformationSet(state).deliveries, cloneInformationDelivery(payload)]
});

export const hasDreamerInformationForSettlement = (
  deliveries: DreamerInformationSet | undefined,
  settlement: Pick<ScheduledTaskSettlement, "taskId" | "taskType" | "outcomeType" | "characterStateRevision">
): boolean =>
  settlement.taskType === "DREAMER_ACTION" &&
  settlement.outcomeType === "DREAMER_INFORMATION_DELIVERED" &&
  (deliveries?.deliveries.some((delivery) =>
    delivery.taskId === settlement.taskId &&
    delivery.taskType === settlement.taskType &&
    delivery.sourceCharacterStateRevision === settlement.characterStateRevision
  ) ?? false);
