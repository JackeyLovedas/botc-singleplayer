import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import { DomainError } from "./errors.js";
import type { FirstNightActionOpportunityState } from "./first-night-action-opportunity.js";
import type {
  BaseDreamerV2SourceContract,
  DreamerActionOpportunityV3
} from "./first-night-action-opportunity.js";
import {
  DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
  findFirstNightActionOpportunityById,
  isDreamerActionOpportunityV3,
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
export const DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION = "dreamer-information-delivered-v2" as const;
export const DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION = "dreamer-base-source-effectiveness-v1" as const;

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

export type DreamerTargetChosenPayload = DreamerTargetChosenPayloadV1 | DreamerTargetChosenPayloadV2;

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

export type DreamerInformationDeliveredPayload = DreamerInformationDeliveredPayloadV1 | DreamerInformationDeliveredPayloadV2;

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
  | { readonly kind: "SOURCE_REPRESENTED_IMPAIRED"; readonly impairmentId: AbilityImpairmentId; readonly impairmentKind: "DRUNK" | "POISONED" }
  | { readonly kind: "VORTOX_FORCED_FALSE_UNSUPPORTED"; readonly vortoxPlayerId: PlayerId; readonly vortoxSeatNumber: SeatNumber; readonly vortoxRoleTenureId: RoleTenureId }
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
const DREAMER_EFFECTIVE_RELIABILITY_KEYS = ["kind"] as const;
const DREAMER_IMPAIRED_RELIABILITY_KEYS = [
  "kind",
  "reason",
  "sourceImpairmentId",
  "sourceImpairmentKind"
] as const;
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

const cloneTargetChoice = (choice: DreamerTargetChosenPayload): DreamerTargetChosenPayload =>
  "targetSchemaVersion" in choice
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

const cloneInformationDelivery = (delivery: DreamerInformationDeliveredPayload): DreamerInformationDeliveredPayload =>
  "deliverySchemaVersion" in delivery
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
  if (
    targetTask.taskType !== "DREAMER_ACTION" ||
    targetTask.taskClass !== "ROLE_ACTION" ||
    source.kind !== "ROLE" ||
    source.role.roleId !== DREAMER_ROLE_ID
  ) {
    return undefined;
  }

  const currentEntry = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === source.playerId &&
    entry.seatNumber === source.seatNumber
  );
  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== DREAMER_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.role)
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
    return fail("Dreamer action source is no longer a current Dreamer");
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
    if (sourceImpairments[0] !== undefined) {
      return { kind: "SOURCE_REPRESENTED_IMPAIRED", impairmentId: sourceImpairments[0].impairmentId, impairmentKind: sourceImpairments[0].kind };
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
      if (vortoxTenure === undefined || !isRoleTenureContinuousAcross(vortoxTenure, vortoxTenure.acquiredCharacterStateRevision, input.currentCharacterState.revision)) {
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
        return { kind: "VORTOX_FORCED_FALSE_UNSUPPORTED", vortoxPlayerId: demon.playerId, vortoxSeatNumber: demon.seatNumber, vortoxRoleTenureId: vortoxTenure.roleTenureId };
      }
    }
    return {
      kind: "NORMAL_INFORMATION_SUPPORTED",
      evaluationModelVersion: DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION,
      evaluatedCharacterStateRevision: input.currentCharacterState.revision,
      sourceRoleTenureId: tenure.roleTenureId,
      sourceAbilityInstanceId: expectedAbility
    };
  } catch {
    return unresolved("SOURCE_PROVENANCE_INVALID");
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

const validateDreamerInformationPayloadShape = (
  payload: unknown,
  setup: Pick<GeneratedSetup, "roleCatalogSnapshot">
): DreamerInformationPayloadShapeResult => {
  if (!isPlainRecord(payload)) {
    return shapeFail("DreamerInformationDelivered payload must have exact runtime shape");
  }
  const v2 = Object.hasOwn(payload, "deliverySchemaVersion");
  if (!hasExactEnumerableKeys(payload, v2
      ? DREAMER_INFORMATION_DELIVERED_V2_PAYLOAD_KEYS
      : DREAMER_INFORMATION_DELIVERED_PAYLOAD_KEYS)) {
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
    !hasExactReliabilityShape(payload.informationReliability) ||
    !hasExactRoleSetupSnapshotShape(payload.goodRole) ||
    !hasExactRoleSetupSnapshotShape(payload.evilRole) ||
    payload.falseRolePolicyVersion !== DREAMER_FALSE_ROLE_POLICY_VERSION ||
    (v2 && (payload.deliverySchemaVersion !== DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION ||
      payload.opportunitySchemaVersion !== DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION ||
      !hasExactBaseDreamerSourceContractShape(payload.sourceContract) ||
      !isPlainRecord(payload.informationReliability) ||
      !hasExactEnumerableKeys(payload.informationReliability, ["kind"]) ||
      payload.informationReliability.kind !== "EFFECTIVE"))
  ) {
    return shapeFail("DreamerInformationDelivered fields must use supported primitive values");
  }

  if (payload.goodRole.defaultAlignment !== "GOOD" || payload.evilRole.defaultAlignment !== "EVIL") {
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

const sameTargetChoice = (left: DreamerTargetChosenPayload, right: DreamerTargetChosenPayload): boolean =>
  (("targetSchemaVersion" in left && "targetSchemaVersion" in right &&
      left.targetSchemaVersion === right.targetSchemaVersion &&
      left.opportunitySchemaVersion === right.opportunitySchemaVersion &&
      sameBaseDreamerSourceContract(left.sourceContract, right.sourceContract)) ||
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
): boolean =>
  (("deliverySchemaVersion" in left && "deliverySchemaVersion" in right &&
      left.deliverySchemaVersion === right.deliverySchemaVersion &&
      left.opportunitySchemaVersion === right.opportunitySchemaVersion &&
      sameBaseDreamerSourceContract(left.sourceContract, right.sourceContract)) ||
    (!("deliverySchemaVersion" in left) && !("deliverySchemaVersion" in right))) &&
  left.rulesBaselineVersion === right.rulesBaselineVersion &&
  left.nightNumber === right.nightNumber &&
  left.taskId === right.taskId &&
  left.taskType === right.taskType &&
  left.opportunityId === right.opportunityId &&
  left.knowledgeModelVersion === right.knowledgeModelVersion &&
  left.knowledgeStage === right.knowledgeStage &&
  left.sourcePlayerId === right.sourcePlayerId &&
  left.sourceSeatNumber === right.sourceSeatNumber &&
  left.sourceCharacterStateRevision === right.sourceCharacterStateRevision &&
  left.targetPlayerId === right.targetPlayerId &&
  left.targetSeatNumber === right.targetSeatNumber &&
  sameReliability(left.informationReliability, right.informationReliability) &&
  sameRoleSetupSnapshot(left.goodRole, right.goodRole) &&
  sameRoleSetupSnapshot(left.evilRole, right.evilRole) &&
  left.falseRolePolicyVersion === right.falseRolePolicyVersion;

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
}): DreamerTargetChosenPayload => {
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

  const target = input.roster.find((entry) => entry.playerId === input.targetPlayerId);
  const targetState = input.currentCharacterState.entries.find((entry) => entry.playerId === input.targetPlayerId);
  if (
    target === undefined ||
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
  readonly targetChoice: DreamerTargetChosenPayload;
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

export const validateDreamerTargetChosenPayload = (
  payload: unknown,
  input: DreamerActionInput
): ValidationResult => {
  if (!isPlainRecord(payload)) {
    return fail("DreamerTargetChosen payload must have exact runtime shape");
  }
  const v2 = Object.hasOwn(payload, "targetSchemaVersion");
  if (!hasExactEnumerableKeys(payload, v2
      ? DREAMER_TARGET_CHOSEN_V2_PAYLOAD_KEYS
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
    (v2 && (payload.targetSchemaVersion !== DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION ||
      payload.opportunitySchemaVersion !== DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION ||
      !hasExactBaseDreamerSourceContractShape(payload.sourceContract)))
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
    opportunity.opportunityKind !== (v2 ? "DREAMER_FIRST_NIGHT_ACTION_V3" : "DREAMER_FIRST_NIGHT_ACTION") ||
    opportunity.taskId !== payload.taskId ||
    opportunity.taskType !== "DREAMER_ACTION" ||
    opportunity.sourcePlayerId !== payload.sourcePlayerId ||
    opportunity.sourceSeatNumber !== payload.sourceSeatNumber ||
    !sameRoleSetupSnapshot(opportunity.sourceRole, payload.sourceRole) ||
    (v2
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

  const expected = createDreamerTargetChosenPayload({
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
  const shapeValidation = validateDreamerInformationPayloadShape(payload, input.setup);
  if (!shapeValidation.valid) {
    return shapeValidation;
  }
  const delivery = shapeValidation.payload;
  const v2 = "deliverySchemaVersion" in delivery;

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
    opportunity.opportunityKind !== (v2 ? "DREAMER_FIRST_NIGHT_ACTION_V3" : "DREAMER_FIRST_NIGHT_ACTION") ||
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

  let effectiveness: DreamerEffectivenessResult;
  if (v2) {
    if (!("targetSchemaVersion" in choice) || !isDreamerActionOpportunityV3(opportunity) ||
        input.firstNightTaskPlan === undefined ||
        input.roleTenures === undefined || input.firstNightActionOpportunities === undefined ||
        !sameBaseDreamerSourceContract(delivery.sourceContract, choice.sourceContract) ||
        !sameBaseDreamerSourceContract(delivery.sourceContract, opportunity.sourceContract)) {
      return fail("DreamerInformationDelivered V2 requires canonical V3 source provenance");
    }
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
    if (capability.kind !== "NORMAL_INFORMATION_SUPPORTED") {
      return fail("DreamerInformationDelivered V2 requires proven normal-information capability");
    }
    effectiveness = { effective: true };
  } else {
    effectiveness = evaluateDreamerEffectiveness({
      sourcePlayerId: choice.sourcePlayerId,
      abilityImpairments: input.abilityImpairments
    });
  }
  const expected = createDreamerInformationDeliveredPayload({
    rulesBaselineVersion: delivery.rulesBaselineVersion,
    targetChoice: choice,
    setup: input.setup,
    currentCharacterState: input.currentCharacterState,
    effectiveness
  });

  if (!sameDreamerInformationDelivery(delivery, expected)) {
    return fail("DreamerInformationDelivered must match the target choice, current role facts, source effectiveness, and deterministic false-role policy");
  }

  return { valid: true };
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

  if (delivery.rulesBaselineVersion !== sourceFacts.rulesBaselineVersion) {
    return fail("Stored DreamerInformationDelivered rules baseline must match the game");
  }

  const matchingTasks = sourceFacts.firstNightTaskPlan.tasks.filter((candidate) => candidate.taskId === delivery.taskId);
  const task = matchingTasks[0];
  if (
    matchingTasks.length !== 1 ||
    task === undefined ||
    task.taskType !== "DREAMER_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    task.source.kind !== "ROLE" ||
    task.source.role.roleId !== DREAMER_ROLE_ID ||
    task.source.playerId !== delivery.sourcePlayerId ||
    task.source.seatNumber !== delivery.sourceSeatNumber ||
    roleFromCatalog(sourceFacts.setup, task.source.role) === undefined
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
      ? DREAMER_TARGET_CHOSEN_V2_PAYLOAD_KEYS
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
    !sameRoleSetupSnapshot(choice.sourceRole, task.source.role) ||
    ("deliverySchemaVersion" in delivery && (!("targetSchemaVersion" in choice) ||
      choice.targetSchemaVersion !== DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION ||
      choice.opportunitySchemaVersion !== delivery.opportunitySchemaVersion ||
      !sameBaseDreamerSourceContract(choice.sourceContract, delivery.sourceContract)))
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
