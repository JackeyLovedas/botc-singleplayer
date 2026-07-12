import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CurrentCharacterState, CurrentCharacterStateSet } from "./current-character-state.js";
import { DomainError } from "./errors.js";
import type { FirstNightActionOpportunityState } from "./first-night-action-opportunity.js";
import {
  findFirstNightActionOpportunityById,
  hasClosedPhilosopherOpportunityForSettlement
} from "./first-night-action-opportunity.js";
import type {
  FirstNightTaskPlanVersion,
  FirstNightTaskPlan,
  FirstNightTaskProgress,
  FirstNightTaskType,
  PhilosopherGainedAbilityTaskSource,
  ScheduledTask,
  ScheduledTaskClass,
  ScheduledTaskSettlement,
  ScheduledTaskSettlementPolicy
} from "./first-night-task-plan.js";
import {
  CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION,
  LEGACY_FIRST_NIGHT_TASK_PLAN_VERSION,
  SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  cloneFirstNightTaskPlan,
  compareFirstNightTaskOrder,
  getNextUnsettledFirstNightTask,
  isFirstNightTaskSettled
} from "./first-night-task-plan.js";
import {
  abilityImpairmentId,
  grantedAbilityId,
  roleId,
  scheduledTaskId
} from "./ids.js";
import type {
  AbilityImpairmentId,
  ActionOpportunityId,
  GrantedAbilityId,
  PlayerId,
  RoleId,
  ScheduledTaskId
} from "./ids.js";
import {
  hasExactEnumerableKeys,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord
} from "./initial-private-knowledge.js";
import type { SeatNumber } from "./player-roster.js";
import type { GeneratedSetup, RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";

export type PhilosopherAbilityChoiceDecision = {
  readonly kind: "CHOOSE_GOOD_CHARACTER";
  readonly roleId: RoleId;
};

export type GrantedAbilitySource = {
  readonly sourceKind: "PHILOSOPHER_ACTION_OPPORTUNITY";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
};

export type PhilosopherAbilityChosenPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "PHILOSOPHER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly decisionKind: "CHOOSE_GOOD_CHARACTER";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly chosenRole: RoleSetupSnapshot;
  readonly chosenRoleId: RoleId;
  readonly roleCatalogSignature: string;
};

export type PhilosopherGrantedAbility = {
  readonly grantId: GrantedAbilityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly chosenRole: RoleSetupSnapshot;
  readonly chosenRoleId: RoleId;
  readonly chosenRoleCatalogSignature: string;
  readonly grantedAtTaskId: ScheduledTaskId;
  readonly grantedAtOpportunityId: ActionOpportunityId;
};

export type PhilosopherAbilityGrantedPayload = PhilosopherGrantedAbility & {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
};

export type GrantedAbilitySet = {
  readonly abilities: readonly PhilosopherGrantedAbility[];
};

export type PhilosopherDuplicateAbilityImpairment = {
  readonly impairmentId: AbilityImpairmentId;
  readonly kind: "DRUNK";
  readonly sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE";
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRole: RoleSetupSnapshot;
  readonly chosenRoleId: RoleId;
  readonly sourceCharacterStateRevision: number;
};

export type SnakeCharmerPoisonedAbilityImpairment = {
  readonly impairmentId: AbilityImpairmentId;
  readonly kind: "POISONED";
  readonly sourceKind: "SNAKE_CHARMER_DEMON_HIT";
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
};

export type AbilityImpairment =
  | PhilosopherDuplicateAbilityImpairment
  | SnakeCharmerPoisonedAbilityImpairment;

export type PhilosopherDuplicateAbilityImpairmentAppliedPayload = PhilosopherDuplicateAbilityImpairment & {
  readonly rulesBaselineVersion: string;
};

export type SnakeCharmerPoisonedAbilityImpairmentAppliedPayload = SnakeCharmerPoisonedAbilityImpairment & {
  readonly rulesBaselineVersion: string;
};

export type AbilityImpairmentAppliedPayload =
  | PhilosopherDuplicateAbilityImpairmentAppliedPayload
  | SnakeCharmerPoisonedAbilityImpairmentAppliedPayload;

export type AbilityImpairmentSet = {
  readonly impairments: readonly AbilityImpairment[];
};

export type FirstNightTaskInsertionReason = "PHILOSOPHER_GAINED_ABILITY";

export type InsertedFirstNightTask = {
  readonly taskPlanVersion: string;
  readonly taskId: ScheduledTaskId;
  readonly taskType: FirstNightTaskType;
  readonly taskClass: ScheduledTaskClass;
  readonly orderKey: {
    readonly baseOrder: 100;
    readonly insertionOrder: 1;
  };
  readonly source: PhilosopherGainedAbilityTaskSource;
  readonly status: "PENDING";
  readonly settlementPolicy: ScheduledTaskSettlementPolicy;
  readonly insertionReason: FirstNightTaskInsertionReason;
  readonly insertedByPlayerId: PlayerId;
  readonly insertedByOpportunityId: ActionOpportunityId;
  readonly sourceCharacterStateRevision: number;
  readonly chosenRole: RoleSetupSnapshot;
};

export type FirstNightTaskInsertedPayload = InsertedFirstNightTask & {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
};

export const PHILOSOPHER_GAINED_FIRST_NIGHT_SCHEDULING_VERSION =
  "philosopher-gained-first-night-scheduling-v2" as const;
export const PHILOSOPHER_GAINED_TASK_TIE_BREAK_POLICY =
  "BASE_THEN_GAINED_BY_SOURCE_SEAT_THEN_TASK_ID_CODE_UNIT" as const;

export type FirstNightTaskInsertedV2Payload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly schedulingVersion: typeof PHILOSOPHER_GAINED_FIRST_NIGHT_SCHEDULING_VERSION;
  readonly taskPlanVersion: typeof CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION;
  readonly taskCatalogVersion: string;
  readonly taskCatalogSignatureAlgorithm: string;
  readonly taskCatalogSignature: string;
  readonly taskId: ScheduledTaskId;
  readonly taskType: FirstNightTaskType;
  readonly taskClass: ScheduledTaskClass;
  readonly targetRoleId: RoleId;
  readonly targetCatalogBaseOrder: number;
  readonly effectiveBaseOrder: number;
  readonly tieBreakPolicy: typeof PHILOSOPHER_GAINED_TASK_TIE_BREAK_POLICY;
  readonly tieBreakSourceSeatNumber: SeatNumber;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly chosenRole: RoleSetupSnapshot;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly grantId: GrantedAbilityId;
  readonly sourceCharacterStateRevision: number;
  readonly status: "PENDING";
  readonly settlementPolicy: ScheduledTaskSettlementPolicy;
  readonly insertionReason: FirstNightTaskInsertionReason;
};

export type AnyFirstNightTaskInsertedPayload = FirstNightTaskInsertedPayload | FirstNightTaskInsertedV2Payload;

export type FirstNightTaskInsertion = {
  readonly insertions: readonly AnyFirstNightTaskInsertedPayload[];
};

export type PhilosopherAbilityChoiceSet = {
  readonly choices: readonly PhilosopherAbilityChosenPayload[];
};

type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

export type PhilosopherAbilityChoiceValidationResult =
  | { readonly valid: true; readonly chosenRole: RoleSetupSnapshot }
  | {
      readonly valid: false;
      readonly code: "InvalidPhilosopherAbilityChoice" | "UnsupportedPhilosopherAbilityChoice";
      readonly reason: string;
    };

type PhilosopherAbilityInput = {
  readonly taskId: ScheduledTaskId;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSignature" | "roleCatalogSnapshot">;
};

const PHILOSOPHER_ROLE_ID = "philosopher" as RoleId;

const PHILOSOPHER_ABILITY_CHOSEN_PAYLOAD_KEYS = [
  "chosenRole",
  "chosenRoleId",
  "decisionKind",
  "nightNumber",
  "opportunityId",
  "roleCatalogSignature",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "taskId",
  "taskType"
] as const;
const PHILOSOPHER_ABILITY_GRANTED_PAYLOAD_KEYS = [
  "chosenRole",
  "chosenRoleCatalogSignature",
  "chosenRoleId",
  "grantId",
  "grantedAtOpportunityId",
  "grantedAtTaskId",
  "nightNumber",
  "opportunityId",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "taskId"
] as const;
const ABILITY_IMPAIRMENT_APPLIED_PAYLOAD_KEYS = [
  "affectedPlayerId",
  "affectedRole",
  "affectedSeatNumber",
  "chosenRoleId",
  "impairmentId",
  "kind",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourceKind",
  "sourcePlayerId"
] as const;
const SNAKE_CHARMER_POISONED_IMPAIRMENT_APPLIED_PAYLOAD_KEYS = [
  "affectedPlayerId",
  "affectedRole",
  "affectedSeatNumber",
  "impairmentId",
  "kind",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourceKind",
  "sourcePlayerId"
] as const;
const PHILOSOPHER_GAINED_ABILITY_TASK_SOURCE_KEYS = [
  "chosenRole",
  "kind",
  "opportunityId",
  "playerId",
  "seatNumber",
  "sourceCharacterStateRevision",
  "sourceRole"
] as const;
const FIRST_NIGHT_TASK_INSERTED_PAYLOAD_KEYS = [
  "chosenRole",
  "insertedByOpportunityId",
  "insertedByPlayerId",
  "insertionReason",
  "nightNumber",
  "orderKey",
  "rulesBaselineVersion",
  "settlementPolicy",
  "source",
  "sourceCharacterStateRevision",
  "status",
  "taskClass",
  "taskId",
  "taskPlanVersion",
  "taskType"
] as const;
const FIRST_NIGHT_TASK_INSERTED_V2_PAYLOAD_KEYS = [
  "chosenRole",
  "effectiveBaseOrder",
  "grantId",
  "insertionReason",
  "nightNumber",
  "philosopherOpportunityId",
  "rulesBaselineVersion",
  "schedulingVersion",
  "settlementPolicy",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "status",
  "targetCatalogBaseOrder",
  "targetRoleId",
  "taskCatalogSignature",
  "taskCatalogSignatureAlgorithm",
  "taskCatalogVersion",
  "taskClass",
  "taskId",
  "taskPlanVersion",
  "taskType",
  "tieBreakPolicy",
  "tieBreakSourceSeatNumber"
] as const;
const ORDER_KEY_KEYS = ["baseOrder", "insertionOrder"] as const;

export const PHILOSOPHER_GAINED_TASK_BY_ROLE_ID: Readonly<Partial<Record<string, FirstNightTaskType>>> = {
  clockmaker: "CLOCKMAKER_INFORMATION",
  dreamer: "DREAMER_ACTION",
  snake_charmer: "SNAKE_CHARMER_ACTION",
  seamstress: "SEAMSTRESS_ACTION",
  mathematician: "MATHEMATICIAN_INFORMATION"
} as const;

export const PHILOSOPHER_GOOD_ROLE_IDS_WITHOUT_FIRST_NIGHT_INSERTION: readonly string[] = [
  "artist",
  "savant",
  "juggler",
  "flowergirl",
  "town_crier",
  "oracle",
  "sage",
  "mutant",
  "sweetheart",
  "barber",
  "klutz",
  "philosopher"
] as const;

const fail = (reason: string): ValidationResult => ({ valid: false, reason });

const cloneChoice = (choice: PhilosopherAbilityChosenPayload): PhilosopherAbilityChosenPayload => ({
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
  chosenRole: cloneRoleSetupSnapshot(choice.chosenRole),
  chosenRoleId: choice.chosenRoleId,
  roleCatalogSignature: choice.roleCatalogSignature
});

const cloneGrant = (grant: PhilosopherGrantedAbility): PhilosopherGrantedAbility => ({
  grantId: grant.grantId,
  sourcePlayerId: grant.sourcePlayerId,
  sourceSeatNumber: grant.sourceSeatNumber,
  sourceRole: cloneRoleSetupSnapshot(grant.sourceRole),
  sourceCharacterStateRevision: grant.sourceCharacterStateRevision,
  chosenRole: cloneRoleSetupSnapshot(grant.chosenRole),
  chosenRoleId: grant.chosenRoleId,
  chosenRoleCatalogSignature: grant.chosenRoleCatalogSignature,
  grantedAtTaskId: grant.grantedAtTaskId,
  grantedAtOpportunityId: grant.grantedAtOpportunityId
});

const cloneImpairment = (impairment: AbilityImpairment): AbilityImpairment => {
  if (impairment.sourceKind === "SNAKE_CHARMER_DEMON_HIT") {
    return {
      impairmentId: impairment.impairmentId,
      kind: impairment.kind,
      sourceKind: impairment.sourceKind,
      sourcePlayerId: impairment.sourcePlayerId,
      affectedPlayerId: impairment.affectedPlayerId,
      affectedSeatNumber: impairment.affectedSeatNumber,
      affectedRole: cloneRoleSetupSnapshot(impairment.affectedRole),
      sourceCharacterStateRevision: impairment.sourceCharacterStateRevision
    };
  }

  return {
    impairmentId: impairment.impairmentId,
    kind: impairment.kind,
    sourceKind: impairment.sourceKind,
    sourcePlayerId: impairment.sourcePlayerId,
    affectedPlayerId: impairment.affectedPlayerId,
    affectedSeatNumber: impairment.affectedSeatNumber,
    affectedRole: cloneRoleSetupSnapshot(impairment.affectedRole),
    sourceCharacterStateRevision: impairment.sourceCharacterStateRevision,
    chosenRoleId: impairment.chosenRoleId
  };
};

const cloneLegacyInsertion = (insertion: FirstNightTaskInsertedPayload): FirstNightTaskInsertedPayload => ({
  rulesBaselineVersion: insertion.rulesBaselineVersion,
  nightNumber: insertion.nightNumber,
  taskPlanVersion: insertion.taskPlanVersion,
  taskId: insertion.taskId,
  taskType: insertion.taskType,
  taskClass: insertion.taskClass,
  orderKey: {
    baseOrder: insertion.orderKey.baseOrder,
    insertionOrder: insertion.orderKey.insertionOrder
  },
  source: {
    kind: insertion.source.kind,
    playerId: insertion.source.playerId,
    seatNumber: insertion.source.seatNumber,
    sourceRole: cloneRoleSetupSnapshot(insertion.source.sourceRole),
    chosenRole: cloneRoleSetupSnapshot(insertion.source.chosenRole),
    opportunityId: insertion.source.opportunityId,
    sourceCharacterStateRevision: insertion.source.sourceCharacterStateRevision
  },
  status: insertion.status,
  settlementPolicy: insertion.settlementPolicy,
  insertionReason: insertion.insertionReason,
  insertedByPlayerId: insertion.insertedByPlayerId,
  insertedByOpportunityId: insertion.insertedByOpportunityId,
  sourceCharacterStateRevision: insertion.sourceCharacterStateRevision,
  chosenRole: cloneRoleSetupSnapshot(insertion.chosenRole)
});

const cloneV2Insertion = (insertion: FirstNightTaskInsertedV2Payload): FirstNightTaskInsertedV2Payload => ({
  rulesBaselineVersion: insertion.rulesBaselineVersion,
  nightNumber: insertion.nightNumber,
  schedulingVersion: insertion.schedulingVersion,
  taskPlanVersion: insertion.taskPlanVersion,
  taskCatalogVersion: insertion.taskCatalogVersion,
  taskCatalogSignatureAlgorithm: insertion.taskCatalogSignatureAlgorithm,
  taskCatalogSignature: insertion.taskCatalogSignature,
  taskId: insertion.taskId,
  taskType: insertion.taskType,
  taskClass: insertion.taskClass,
  targetRoleId: insertion.targetRoleId,
  targetCatalogBaseOrder: insertion.targetCatalogBaseOrder,
  effectiveBaseOrder: insertion.effectiveBaseOrder,
  tieBreakPolicy: insertion.tieBreakPolicy,
  tieBreakSourceSeatNumber: insertion.tieBreakSourceSeatNumber,
  sourcePlayerId: insertion.sourcePlayerId,
  sourceSeatNumber: insertion.sourceSeatNumber,
  sourceRole: cloneRoleSetupSnapshot(insertion.sourceRole),
  chosenRole: cloneRoleSetupSnapshot(insertion.chosenRole),
  philosopherOpportunityId: insertion.philosopherOpportunityId,
  grantId: insertion.grantId,
  sourceCharacterStateRevision: insertion.sourceCharacterStateRevision,
  status: insertion.status,
  settlementPolicy: insertion.settlementPolicy,
  insertionReason: insertion.insertionReason
});

const isV2Insertion = (insertion: AnyFirstNightTaskInsertedPayload): insertion is FirstNightTaskInsertedV2Payload =>
  "schedulingVersion" in insertion;

const cloneInsertion = (insertion: AnyFirstNightTaskInsertedPayload): AnyFirstNightTaskInsertedPayload =>
  isV2Insertion(insertion) ? cloneV2Insertion(insertion) : cloneLegacyInsertion(insertion);

export const clonePhilosopherAbilityChoiceSet = (
  state: PhilosopherAbilityChoiceSet | undefined
): PhilosopherAbilityChoiceSet => ({
  choices: state?.choices.map(cloneChoice) ?? []
});

export const cloneGrantedAbilitySet = (
  state: GrantedAbilitySet | undefined
): GrantedAbilitySet => ({
  abilities: state?.abilities.map(cloneGrant) ?? []
});

export const cloneAbilityImpairmentSet = (
  state: AbilityImpairmentSet | undefined
): AbilityImpairmentSet => ({
  impairments: state?.impairments.map(cloneImpairment) ?? []
});

export const cloneFirstNightTaskInsertion = (
  state: FirstNightTaskInsertion | undefined
): FirstNightTaskInsertion => ({
  insertions: state?.insertions.map(cloneInsertion) ?? []
});

export const formatPhilosopherGrantId = (input: {
  readonly sourceSeatNumber: SeatNumber;
  readonly chosenRoleId: RoleId;
}): GrantedAbilityId =>
  grantedAbilityId(`philosopher-grant-v1:seat-${String(input.sourceSeatNumber).padStart(2, "0")}:from-${input.chosenRoleId}`);

export const formatPhilosopherImpairmentId = (input: {
  readonly sourceSeatNumber: SeatNumber;
  readonly affectedSeatNumber: SeatNumber;
  readonly chosenRoleId: RoleId;
}): AbilityImpairmentId =>
  abilityImpairmentId(
    `ability-impairment-v1:PHILOSOPHER_CHOSEN_DUPLICATE:seat-${String(input.sourceSeatNumber).padStart(2, "0")}:affects-seat-${String(
      input.affectedSeatNumber
    ).padStart(2, "0")}:from-${input.chosenRoleId}`
  );

export const formatPhilosopherGainedFirstNightTaskId = (input: {
  readonly taskType: FirstNightTaskType;
  readonly sourceSeatNumber: SeatNumber;
  readonly chosenRoleId: RoleId;
}): ScheduledTaskId =>
  scheduledTaskId(
    `first-night-v1:PHILOSOPHER_GAINED:${input.taskType}:seat-${String(input.sourceSeatNumber).padStart(2, "0")}:from-${input.chosenRoleId}`
  );

export const formatPhilosopherGainedFirstNightTaskIdV2 = (input: {
  readonly taskType: FirstNightTaskType;
  readonly sourceSeatNumber: SeatNumber;
  readonly chosenRoleId: RoleId;
}): ScheduledTaskId =>
  scheduledTaskId(
    `first-night-v2:PHILOSOPHER_GAINED:${input.taskType}:seat-${String(input.sourceSeatNumber).padStart(2, "0")}:from-${input.chosenRoleId}`
  );

const findCatalogRole = (
  setup: Pick<GeneratedSetup, "roleCatalogSnapshot">,
  candidateRoleId: RoleId
): RoleSetupSnapshot | undefined =>
  setup.roleCatalogSnapshot.roles.find((role) => role.roleId === candidateRoleId);

export const validatePhilosopherGoodCharacterChoice = (
  decision: unknown,
  setup: Pick<GeneratedSetup, "roleCatalogSnapshot">
): PhilosopherAbilityChoiceValidationResult => {
  if (!isPlainRecord(decision)) {
    return {
      valid: false,
      code: "InvalidPhilosopherAbilityChoice",
      reason: "Philosopher ability choice must be a non-null plain object"
    };
  }

  if (decision.kind !== "CHOOSE_GOOD_CHARACTER") {
    return {
      valid: false,
      code: "UnsupportedPhilosopherAbilityChoice",
      reason: "Philosopher ability choice kind is not supported in this slice"
    };
  }

  if (
    !hasExactEnumerableKeys(decision, ["kind", "roleId"] as const) ||
    typeof decision.roleId !== "string" ||
    decision.roleId.trim().length === 0
  ) {
    return {
      valid: false,
      code: "InvalidPhilosopherAbilityChoice",
      reason: "CHOOSE_GOOD_CHARACTER requires exactly kind and roleId"
    };
  }

  const chosenRole = findCatalogRole(setup, roleId(decision.roleId));
  if (chosenRole === undefined) {
    return {
      valid: false,
      code: "InvalidPhilosopherAbilityChoice",
      reason: `Unknown roleId ${decision.roleId}`
    };
  }

  if (
    chosenRole.defaultAlignment !== "GOOD" ||
    chosenRole.characterType === "MINION" ||
    chosenRole.characterType === "DEMON"
  ) {
    return {
      valid: false,
      code: "InvalidPhilosopherAbilityChoice",
      reason: `Role ${chosenRole.roleId} is not a legal good character choice`
    };
  }

  return {
    valid: true,
    chosenRole: cloneRoleSetupSnapshot(chosenRole)
  };
};

const sameOpportunitySource = (
  payload: Pick<
    PhilosopherAbilityChosenPayload,
    "taskId" | "taskType" | "opportunityId" | "sourcePlayerId" | "sourceSeatNumber" | "sourceRole" | "sourceCharacterStateRevision"
  >,
  input: PhilosopherAbilityInput
): ValidationResult => {
  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, payload.opportunityId);
  if (opportunity === undefined || opportunity.opportunityStatus !== "OPEN") {
    return fail("Philosopher ability choice must reference an OPEN first-night action opportunity");
  }

  if (
    opportunity.taskId !== payload.taskId ||
    opportunity.taskId !== input.taskId ||
    opportunity.taskType !== payload.taskType ||
    opportunity.sourcePlayerId !== payload.sourcePlayerId ||
    opportunity.sourceSeatNumber !== payload.sourceSeatNumber ||
    !sameRoleSetupSnapshot(opportunity.sourceRole, payload.sourceRole) ||
    opportunity.sourceCharacterStateRevision !== payload.sourceCharacterStateRevision
  ) {
    return fail("Philosopher ability choice must match the referenced action opportunity");
  }

  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return fail("Philosopher ability choice must reference a task in the first-night task plan");
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return fail("Philosopher ability choice cannot target a settled task");
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId || nextTask.taskType !== "PHILOSOPHER_ACTION") {
    return fail("Philosopher ability choice must target the current next unsettled Philosopher task");
  }

  const currentEntry = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === opportunity.sourcePlayerId &&
    entry.seatNumber === opportunity.sourceSeatNumber
  );

  if (
    currentEntry === undefined ||
    input.currentCharacterState.revision !== opportunity.sourceCharacterStateRevision ||
    currentEntry.role.roleId !== PHILOSOPHER_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, opportunity.sourceRole)
  ) {
    return fail("Philosopher ability choice source is no longer the same current Philosopher state");
  }

  return { valid: true };
};

export const createPhilosopherAbilityChosenPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly opportunityId: ActionOpportunityId;
  readonly taskId: ScheduledTaskId;
  readonly chosenRole: RoleSetupSnapshot;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSignature">;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
}): PhilosopherAbilityChosenPayload => {
  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, input.opportunityId);
  if (opportunity === undefined || opportunity.opportunityStatus !== "OPEN") {
    throw new DomainError("InvalidPhilosopherAbilityChosenPayload", "PhilosopherAbilityChosen requires an open opportunity");
  }

  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    nightNumber: 1,
    taskId: input.taskId,
    taskType: "PHILOSOPHER_ACTION",
    opportunityId: opportunity.opportunityId,
    decisionKind: "CHOOSE_GOOD_CHARACTER",
    sourcePlayerId: opportunity.sourcePlayerId,
    sourceSeatNumber: opportunity.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
    sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
    chosenRole: cloneRoleSetupSnapshot(input.chosenRole),
    chosenRoleId: input.chosenRole.roleId,
    roleCatalogSignature: input.setup.roleCatalogSignature
  };
};

export const createPhilosopherAbilityGrantedPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly choice: PhilosopherAbilityChosenPayload;
}): PhilosopherAbilityGrantedPayload => ({
  rulesBaselineVersion: input.rulesBaselineVersion,
  nightNumber: 1,
  grantId: formatPhilosopherGrantId({
    sourceSeatNumber: input.choice.sourceSeatNumber,
    chosenRoleId: input.choice.chosenRoleId
  }),
  sourcePlayerId: input.choice.sourcePlayerId,
  sourceSeatNumber: input.choice.sourceSeatNumber,
  sourceRole: cloneRoleSetupSnapshot(input.choice.sourceRole),
  sourceCharacterStateRevision: input.choice.sourceCharacterStateRevision,
  chosenRole: cloneRoleSetupSnapshot(input.choice.chosenRole),
  chosenRoleId: input.choice.chosenRoleId,
  chosenRoleCatalogSignature: input.choice.roleCatalogSignature,
  grantedAtTaskId: input.choice.taskId,
  grantedAtOpportunityId: input.choice.opportunityId,
  taskId: input.choice.taskId,
  opportunityId: input.choice.opportunityId
});

export const currentHolderOfChosenRole = (input: {
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly chosenRoleId: RoleId;
}): {
  readonly status: "none";
} | {
  readonly status: "single";
  readonly holder: CurrentCharacterState;
} | {
  readonly status: "duplicate";
  readonly holders: readonly CurrentCharacterState[];
} => {
  const holders = input.currentCharacterState.entries.filter((entry) => entry.role.roleId === input.chosenRoleId);
  if (holders.length === 0) {
    return { status: "none" };
  }

  if (holders.length === 1) {
    const holder = holders[0];
    if (holder === undefined) {
      return { status: "none" };
    }
    return { status: "single", holder };
  }

  return { status: "duplicate", holders };
};

export const createAbilityImpairmentAppliedPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly choice: PhilosopherAbilityChosenPayload;
  readonly currentCharacterState: CurrentCharacterStateSet;
}): AbilityImpairmentAppliedPayload | undefined => {
  const holder = currentHolderOfChosenRole({
    currentCharacterState: input.currentCharacterState,
    chosenRoleId: input.choice.chosenRoleId
  });

  if (holder.status === "none") {
    return undefined;
  }

  if (holder.status === "duplicate") {
    throw new DomainError("InvalidAbilityImpairmentAppliedPayload", "Multiple current players hold the chosen role");
  }

  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    impairmentId: formatPhilosopherImpairmentId({
      sourceSeatNumber: input.choice.sourceSeatNumber,
      affectedSeatNumber: holder.holder.seatNumber,
      chosenRoleId: input.choice.chosenRoleId
    }),
    kind: "DRUNK",
    sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
    sourcePlayerId: input.choice.sourcePlayerId,
    affectedPlayerId: holder.holder.playerId,
    affectedSeatNumber: holder.holder.seatNumber,
    affectedRole: cloneRoleSetupSnapshot(holder.holder.role),
    chosenRoleId: input.choice.chosenRoleId,
    sourceCharacterStateRevision: input.choice.sourceCharacterStateRevision
  };
};

export const firstNightTaskTypeForPhilosopherChoice = (
  chosenRoleId: RoleId
): FirstNightTaskType | undefined => PHILOSOPHER_GAINED_TASK_BY_ROLE_ID[chosenRoleId];

export const createFirstNightTaskInsertedPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly choice: PhilosopherAbilityChosenPayload;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
}): FirstNightTaskInsertedPayload | undefined => {
  if (input.firstNightTaskPlan.taskPlanVersion !== LEGACY_FIRST_NIGHT_TASK_PLAN_VERSION) {
    throw new DomainError("InvalidFirstNightTaskInsertedPayload", "Legacy insertion requires first-night-task-plan-v1");
  }
  const insertedTaskType = firstNightTaskTypeForPhilosopherChoice(input.choice.chosenRoleId);
  if (insertedTaskType === undefined) {
    return undefined;
  }

  const definition = input.firstNightTaskPlan.taskCatalogSnapshot.definitions.find(
    (candidate) => candidate.taskType === insertedTaskType
  );
  if (definition === undefined || definition.sourceKind !== "ROLE") {
    throw new DomainError("InvalidFirstNightTaskInsertedPayload", "Inserted task type must exist as a role task definition");
  }

  const source: PhilosopherGainedAbilityTaskSource = {
    kind: "PHILOSOPHER_GAINED_ABILITY",
    playerId: input.choice.sourcePlayerId,
    seatNumber: input.choice.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(input.choice.sourceRole),
    chosenRole: cloneRoleSetupSnapshot(input.choice.chosenRole),
    opportunityId: input.choice.opportunityId,
    sourceCharacterStateRevision: input.choice.sourceCharacterStateRevision
  };

  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    nightNumber: 1,
    taskPlanVersion: input.firstNightTaskPlan.taskPlanVersion,
    taskId: formatPhilosopherGainedFirstNightTaskId({
      taskType: insertedTaskType,
      sourceSeatNumber: input.choice.sourceSeatNumber,
      chosenRoleId: input.choice.chosenRoleId
    }),
    taskType: insertedTaskType,
    taskClass: definition.taskClass,
    orderKey: {
      baseOrder: 100,
      insertionOrder: 1
    },
    source,
    status: "PENDING",
    settlementPolicy: definition.settlementPolicy,
    insertionReason: "PHILOSOPHER_GAINED_ABILITY",
    insertedByPlayerId: input.choice.sourcePlayerId,
    insertedByOpportunityId: input.choice.opportunityId,
    sourceCharacterStateRevision: input.choice.sourceCharacterStateRevision,
    chosenRole: cloneRoleSetupSnapshot(input.choice.chosenRole)
  };
};

export const createFirstNightTaskInsertedV2Payload = (input: {
  readonly rulesBaselineVersion: string;
  readonly choice: PhilosopherAbilityChosenPayload;
  readonly grant: PhilosopherGrantedAbility;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
}): FirstNightTaskInsertedV2Payload | undefined => {
  const insertedTaskType = firstNightTaskTypeForPhilosopherChoice(input.choice.chosenRoleId);
  if (insertedTaskType === undefined) {
    return undefined;
  }

  if (input.firstNightTaskPlan.taskPlanVersion !== CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION) {
    throw new DomainError("InvalidFirstNightTaskInsertedV2Payload", "V2 insertion requires first-night-task-plan-v2");
  }

  const definition = input.firstNightTaskPlan.taskCatalogSnapshot.definitions.find(
    (candidate) => candidate.taskType === insertedTaskType
  );
  if (
    definition === undefined ||
    definition.sourceKind !== "ROLE" ||
    definition.roleId !== input.choice.chosenRoleId
  ) {
    throw new DomainError("InvalidFirstNightTaskInsertedV2Payload", "V2 inserted task must match a role task catalog definition");
  }

  if (
    input.grant.grantId !== formatPhilosopherGrantId({
      sourceSeatNumber: input.choice.sourceSeatNumber,
      chosenRoleId: input.choice.chosenRoleId
    }) ||
    input.grant.grantedAtOpportunityId !== input.choice.opportunityId ||
    input.grant.sourcePlayerId !== input.choice.sourcePlayerId ||
    input.grant.sourceSeatNumber !== input.choice.sourceSeatNumber ||
    input.grant.sourceCharacterStateRevision !== input.choice.sourceCharacterStateRevision ||
    input.grant.chosenRoleId !== input.choice.chosenRoleId
  ) {
    throw new DomainError("InvalidFirstNightTaskInsertedV2Payload", "V2 insertion grant must match the Philosopher choice");
  }

  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    nightNumber: 1,
    schedulingVersion: PHILOSOPHER_GAINED_FIRST_NIGHT_SCHEDULING_VERSION,
    taskPlanVersion: CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION,
    taskCatalogVersion: input.firstNightTaskPlan.taskCatalogVersion,
    taskCatalogSignatureAlgorithm: input.firstNightTaskPlan.taskCatalogSignatureAlgorithm,
    taskCatalogSignature: input.firstNightTaskPlan.taskCatalogSignature,
    taskId: formatPhilosopherGainedFirstNightTaskIdV2({
      taskType: insertedTaskType,
      sourceSeatNumber: input.choice.sourceSeatNumber,
      chosenRoleId: input.choice.chosenRoleId
    }),
    taskType: insertedTaskType,
    taskClass: definition.taskClass,
    targetRoleId: definition.roleId,
    targetCatalogBaseOrder: definition.baseOrder,
    effectiveBaseOrder: definition.baseOrder,
    tieBreakPolicy: PHILOSOPHER_GAINED_TASK_TIE_BREAK_POLICY,
    tieBreakSourceSeatNumber: input.choice.sourceSeatNumber,
    sourcePlayerId: input.choice.sourcePlayerId,
    sourceSeatNumber: input.choice.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(input.choice.sourceRole),
    chosenRole: cloneRoleSetupSnapshot(input.choice.chosenRole),
    philosopherOpportunityId: input.choice.opportunityId,
    grantId: input.grant.grantId,
    sourceCharacterStateRevision: input.choice.sourceCharacterStateRevision,
    status: "PENDING",
    settlementPolicy: definition.settlementPolicy,
    insertionReason: "PHILOSOPHER_GAINED_ABILITY"
  };
};

export const createPhilosopherAbilityChosenScheduledTaskSettlement = (input: {
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): ScheduledTaskSettlement => ({
  taskId: input.taskId,
  taskType: "PHILOSOPHER_ACTION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "PHILOSOPHER_ABILITY_CHOSEN",
  characterStateRevision: input.characterStateRevision
});

export const validatePhilosopherAbilityChosenPayload = (
  payload: unknown,
  input: PhilosopherAbilityInput
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, PHILOSOPHER_ABILITY_CHOSEN_PAYLOAD_KEYS)) {
    return fail("PhilosopherAbilityChosen payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    payload.taskType !== "PHILOSOPHER_ACTION" ||
    typeof payload.opportunityId !== "string" ||
    payload.opportunityId.trim().length === 0 ||
    payload.decisionKind !== "CHOOSE_GOOD_CHARACTER" ||
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
    !hasExactRoleSetupSnapshotShape(payload.chosenRole) ||
    typeof payload.chosenRoleId !== "string" ||
    payload.chosenRoleId.trim().length === 0 ||
    typeof payload.roleCatalogSignature !== "string"
  ) {
    return fail("PhilosopherAbilityChosen fields must use supported primitive values");
  }

  const sourceValidation = sameOpportunitySource(payload as unknown as PhilosopherAbilityChosenPayload, input);
  if (!sourceValidation.valid) {
    return sourceValidation;
  }

  const chosenRole = findCatalogRole(input.setup, roleId(payload.chosenRoleId));
  if (
    chosenRole === undefined ||
    payload.roleCatalogSignature !== input.setup.roleCatalogSignature ||
    payload.chosenRoleId !== payload.chosenRole.roleId ||
    !sameRoleSetupSnapshot(payload.chosenRole, chosenRole) ||
    chosenRole.defaultAlignment !== "GOOD" ||
    chosenRole.characterType === "MINION" ||
    chosenRole.characterType === "DEMON"
  ) {
    return fail("PhilosopherAbilityChosen must choose a GOOD role from the current role catalog");
  }

  return { valid: true };
};

const findChoiceByOpportunity = (
  state: PhilosopherAbilityChoiceSet | undefined,
  opportunityId: ActionOpportunityId
): PhilosopherAbilityChosenPayload | undefined =>
  state?.choices.find((choice) => choice.opportunityId === opportunityId);

const findGrantBySourcePlayer = (
  state: GrantedAbilitySet | undefined,
  sourcePlayerId: PlayerId
): PhilosopherGrantedAbility | undefined =>
  state?.abilities.find((grant) => grant.sourcePlayerId === sourcePlayerId);

export const validatePhilosopherAbilityGrantedPayload = (
  payload: unknown,
  input: {
    readonly choices: PhilosopherAbilityChoiceSet | undefined;
    readonly grants: GrantedAbilitySet | undefined;
  }
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, PHILOSOPHER_ABILITY_GRANTED_PAYLOAD_KEYS)) {
    return fail("PhilosopherAbilityGranted payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    typeof payload.grantId !== "string" ||
    payload.grantId.trim().length === 0 ||
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
    !hasExactRoleSetupSnapshotShape(payload.chosenRole) ||
    typeof payload.chosenRoleId !== "string" ||
    payload.chosenRoleId.trim().length === 0 ||
    typeof payload.chosenRoleCatalogSignature !== "string" ||
    typeof payload.grantedAtTaskId !== "string" ||
    payload.grantedAtTaskId.trim().length === 0 ||
    typeof payload.grantedAtOpportunityId !== "string" ||
    payload.grantedAtOpportunityId.trim().length === 0 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    typeof payload.opportunityId !== "string" ||
    payload.opportunityId.trim().length === 0
  ) {
    return fail("PhilosopherAbilityGranted fields must use supported primitive values");
  }

  const choice = findChoiceByOpportunity(input.choices, payload.opportunityId as ActionOpportunityId);
  if (choice === undefined) {
    return fail("PhilosopherAbilityGranted must follow a matching PhilosopherAbilityChosen event");
  }

  if (findGrantBySourcePlayer(input.grants, choice.sourcePlayerId) !== undefined) {
    return fail("Each Philosopher source player can have at most one active granted ability");
  }

  const expected = createPhilosopherAbilityGrantedPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    choice
  });
  const candidate = payload as unknown as PhilosopherAbilityGrantedPayload;
  if (
    candidate.grantId !== expected.grantId ||
    candidate.sourcePlayerId !== expected.sourcePlayerId ||
    candidate.sourceSeatNumber !== expected.sourceSeatNumber ||
    !sameRoleSetupSnapshot(candidate.sourceRole, expected.sourceRole) ||
    candidate.sourceCharacterStateRevision !== expected.sourceCharacterStateRevision ||
    !sameRoleSetupSnapshot(candidate.chosenRole, expected.chosenRole) ||
    candidate.chosenRoleId !== expected.chosenRoleId ||
    candidate.chosenRoleCatalogSignature !== expected.chosenRoleCatalogSignature ||
    candidate.grantedAtTaskId !== expected.grantedAtTaskId ||
    candidate.grantedAtOpportunityId !== expected.grantedAtOpportunityId ||
    candidate.taskId !== expected.taskId ||
    candidate.opportunityId !== expected.opportunityId
  ) {
    return fail("PhilosopherAbilityGranted must match the preceding ability choice");
  }

  return { valid: true };
};

export const validateAbilityImpairmentAppliedPayload = (
  payload: unknown,
  input: {
    readonly currentCharacterState: CurrentCharacterStateSet;
    readonly grants: GrantedAbilitySet | undefined;
  }
): ValidationResult => {
  if (!isPlainRecord(payload)) {
    return fail("AbilityImpairmentApplied payload must have exact runtime shape");
  }

  if (payload.sourceKind === "SNAKE_CHARMER_DEMON_HIT") {
    if (
      !hasExactEnumerableKeys(payload, SNAKE_CHARMER_POISONED_IMPAIRMENT_APPLIED_PAYLOAD_KEYS) ||
      typeof payload.rulesBaselineVersion !== "string" ||
      typeof payload.impairmentId !== "string" ||
      payload.impairmentId.trim().length === 0 ||
      payload.kind !== "POISONED" ||
      typeof payload.sourcePlayerId !== "string" ||
      payload.sourcePlayerId.trim().length === 0 ||
      typeof payload.affectedPlayerId !== "string" ||
      payload.affectedPlayerId.trim().length === 0 ||
      typeof payload.affectedSeatNumber !== "number" ||
      !Number.isInteger(payload.affectedSeatNumber) ||
      payload.affectedSeatNumber < 1 ||
      payload.affectedSeatNumber > 12 ||
      !hasExactRoleSetupSnapshotShape(payload.affectedRole) ||
      typeof payload.sourceCharacterStateRevision !== "number" ||
      !Number.isInteger(payload.sourceCharacterStateRevision) ||
      payload.sourceCharacterStateRevision <= 0
    ) {
      return fail("AbilityImpairmentApplied poisoned fields must use supported primitive values");
    }

    return { valid: true };
  }

  if (!hasExactEnumerableKeys(payload, ABILITY_IMPAIRMENT_APPLIED_PAYLOAD_KEYS)) {
    return fail("AbilityImpairmentApplied payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    typeof payload.impairmentId !== "string" ||
    payload.impairmentId.trim().length === 0 ||
    payload.kind !== "DRUNK" ||
    payload.sourceKind !== "PHILOSOPHER_CHOSEN_DUPLICATE" ||
    typeof payload.sourcePlayerId !== "string" ||
    payload.sourcePlayerId.trim().length === 0 ||
    typeof payload.affectedPlayerId !== "string" ||
    payload.affectedPlayerId.trim().length === 0 ||
    typeof payload.affectedSeatNumber !== "number" ||
    !Number.isInteger(payload.affectedSeatNumber) ||
    payload.affectedSeatNumber < 1 ||
    payload.affectedSeatNumber > 12 ||
    !hasExactRoleSetupSnapshotShape(payload.affectedRole) ||
    typeof payload.chosenRoleId !== "string" ||
    payload.chosenRoleId.trim().length === 0 ||
    typeof payload.sourceCharacterStateRevision !== "number" ||
    !Number.isInteger(payload.sourceCharacterStateRevision) ||
    payload.sourceCharacterStateRevision <= 0
  ) {
    return fail("AbilityImpairmentApplied fields must use supported primitive values");
  }

  const grant = findGrantBySourcePlayer(input.grants, payload.sourcePlayerId as PlayerId);
  if (grant === undefined || grant.chosenRoleId !== payload.chosenRoleId) {
    return fail("AbilityImpairmentApplied must follow a matching PhilosopherAbilityGranted event");
  }

  const holder = currentHolderOfChosenRole({
    currentCharacterState: input.currentCharacterState,
    chosenRoleId: grant.chosenRoleId
  });
  if (holder.status === "duplicate") {
    return fail("AbilityImpairmentApplied cannot resolve duplicate current holders for the chosen role");
  }

  if (holder.status === "none") {
    return fail("AbilityImpairmentApplied cannot exist when the chosen role is not currently in play");
  }

  const expected = createAbilityImpairmentAppliedPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    choice: {
      rulesBaselineVersion: payload.rulesBaselineVersion,
      nightNumber: 1,
      taskId: grant.grantedAtTaskId,
      taskType: "PHILOSOPHER_ACTION",
      opportunityId: grant.grantedAtOpportunityId,
      decisionKind: "CHOOSE_GOOD_CHARACTER",
      sourcePlayerId: grant.sourcePlayerId,
      sourceSeatNumber: grant.sourceSeatNumber,
      sourceRole: grant.sourceRole,
      sourceCharacterStateRevision: grant.sourceCharacterStateRevision,
      chosenRole: grant.chosenRole,
      chosenRoleId: grant.chosenRoleId,
      roleCatalogSignature: grant.chosenRoleCatalogSignature
    },
    currentCharacterState: input.currentCharacterState
  });
  const candidate = payload as unknown as PhilosopherDuplicateAbilityImpairmentAppliedPayload;
  if (
    expected === undefined ||
    candidate.impairmentId !== expected.impairmentId ||
    candidate.kind !== expected.kind ||
    candidate.sourceKind !== expected.sourceKind ||
    candidate.sourcePlayerId !== expected.sourcePlayerId ||
    candidate.affectedPlayerId !== expected.affectedPlayerId ||
    candidate.affectedSeatNumber !== expected.affectedSeatNumber ||
    !sameRoleSetupSnapshot(candidate.affectedRole, expected.affectedRole) ||
    candidate.chosenRoleId !== expected.chosenRoleId ||
    candidate.sourceCharacterStateRevision !== expected.sourceCharacterStateRevision
  ) {
    return fail("AbilityImpairmentApplied must match the current holder of the chosen role");
  }

  return { valid: true };
};

const hasExactOrderKeyShape = (value: unknown): boolean =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, ORDER_KEY_KEYS) &&
  value.baseOrder === 100 &&
  value.insertionOrder === 1;

const hasExactPhilosopherGainedTaskSourceShape = (value: unknown): value is PhilosopherGainedAbilityTaskSource =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, PHILOSOPHER_GAINED_ABILITY_TASK_SOURCE_KEYS) &&
  value.kind === "PHILOSOPHER_GAINED_ABILITY" &&
  typeof value.playerId === "string" &&
  value.playerId.trim().length > 0 &&
  typeof value.seatNumber === "number" &&
  Number.isInteger(value.seatNumber) &&
  value.seatNumber >= 1 &&
  value.seatNumber <= 12 &&
  hasExactRoleSetupSnapshotShape(value.sourceRole) &&
  hasExactRoleSetupSnapshotShape(value.chosenRole) &&
  typeof value.opportunityId === "string" &&
  value.opportunityId.trim().length > 0 &&
  typeof value.sourceCharacterStateRevision === "number" &&
  Number.isInteger(value.sourceCharacterStateRevision) &&
  value.sourceCharacterStateRevision > 0;

export const validateFirstNightTaskInsertedPayload = (
  payload: unknown,
  input: {
    readonly firstNightTaskPlan: FirstNightTaskPlan;
    readonly grants: GrantedAbilitySet | undefined;
    readonly insertions: FirstNightTaskInsertion | undefined;
  }
): ValidationResult => {
  if (input.firstNightTaskPlan.taskPlanVersion !== LEGACY_FIRST_NIGHT_TASK_PLAN_VERSION) {
    return fail("FirstNightTaskInserted requires first-night-task-plan-v1");
  }

  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, FIRST_NIGHT_TASK_INSERTED_PAYLOAD_KEYS)) {
    return fail("FirstNightTaskInserted payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    payload.taskPlanVersion !== input.firstNightTaskPlan.taskPlanVersion ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    typeof payload.taskType !== "string" ||
    typeof payload.taskClass !== "string" ||
    !hasExactOrderKeyShape(payload.orderKey) ||
    !hasExactPhilosopherGainedTaskSourceShape(payload.source) ||
    payload.status !== "PENDING" ||
    typeof payload.settlementPolicy !== "string" ||
    payload.insertionReason !== "PHILOSOPHER_GAINED_ABILITY" ||
    typeof payload.insertedByPlayerId !== "string" ||
    payload.insertedByPlayerId.trim().length === 0 ||
    typeof payload.insertedByOpportunityId !== "string" ||
    payload.insertedByOpportunityId.trim().length === 0 ||
    typeof payload.sourceCharacterStateRevision !== "number" ||
    !Number.isInteger(payload.sourceCharacterStateRevision) ||
    payload.sourceCharacterStateRevision <= 0 ||
    !hasExactRoleSetupSnapshotShape(payload.chosenRole)
  ) {
    return fail("FirstNightTaskInserted fields must use supported primitive values");
  }

  if ((input.insertions?.insertions.length ?? 0) > 0) {
    return fail("Only one Philosopher gained first-night task insertion is supported in this slice");
  }

  if (input.firstNightTaskPlan.tasks.some((task) => task.taskId === payload.taskId)) {
    return fail("FirstNightTaskInserted cannot duplicate an existing scheduled task id");
  }

  const grant = findGrantBySourcePlayer(input.grants, payload.insertedByPlayerId as PlayerId);
  if (grant === undefined || grant.grantedAtOpportunityId !== payload.insertedByOpportunityId) {
    return fail("FirstNightTaskInserted must follow a matching PhilosopherAbilityGranted event");
  }

  const expected = createFirstNightTaskInsertedPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    choice: {
      rulesBaselineVersion: payload.rulesBaselineVersion,
      nightNumber: 1,
      taskId: grant.grantedAtTaskId,
      taskType: "PHILOSOPHER_ACTION",
      opportunityId: grant.grantedAtOpportunityId,
      decisionKind: "CHOOSE_GOOD_CHARACTER",
      sourcePlayerId: grant.sourcePlayerId,
      sourceSeatNumber: grant.sourceSeatNumber,
      sourceRole: grant.sourceRole,
      sourceCharacterStateRevision: grant.sourceCharacterStateRevision,
      chosenRole: grant.chosenRole,
      chosenRoleId: grant.chosenRoleId,
      roleCatalogSignature: grant.chosenRoleCatalogSignature
    },
    firstNightTaskPlan: input.firstNightTaskPlan
  });
  const candidate = payload as unknown as FirstNightTaskInsertedPayload;
  if (
    expected === undefined ||
    candidate.taskId !== expected.taskId ||
    candidate.taskType !== expected.taskType ||
    candidate.taskClass !== expected.taskClass ||
    candidate.orderKey.baseOrder !== expected.orderKey.baseOrder ||
    candidate.orderKey.insertionOrder !== expected.orderKey.insertionOrder ||
    candidate.status !== expected.status ||
    candidate.settlementPolicy !== expected.settlementPolicy ||
    candidate.insertionReason !== expected.insertionReason ||
    candidate.insertedByPlayerId !== expected.insertedByPlayerId ||
    candidate.insertedByOpportunityId !== expected.insertedByOpportunityId ||
    candidate.sourceCharacterStateRevision !== expected.sourceCharacterStateRevision ||
    !sameRoleSetupSnapshot(candidate.chosenRole, expected.chosenRole) ||
    candidate.source.kind !== expected.source.kind ||
    candidate.source.playerId !== expected.source.playerId ||
    candidate.source.seatNumber !== expected.source.seatNumber ||
    !sameRoleSetupSnapshot(candidate.source.sourceRole, expected.source.sourceRole) ||
    !sameRoleSetupSnapshot(candidate.source.chosenRole, expected.source.chosenRole) ||
    candidate.source.opportunityId !== expected.source.opportunityId ||
    candidate.source.sourceCharacterStateRevision !== expected.source.sourceCharacterStateRevision
  ) {
    return fail("FirstNightTaskInserted must match the deterministic Philosopher gained task insertion");
  }

  return { valid: true };
};

export const validateFirstNightTaskInsertedV2Payload = (
  payload: unknown,
  input: {
    readonly firstNightTaskPlan: FirstNightTaskPlan;
    readonly grants: GrantedAbilitySet | undefined;
    readonly insertions: FirstNightTaskInsertion | undefined;
  }
): ValidationResult => {
  if (input.firstNightTaskPlan.taskPlanVersion !== CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION) {
    return fail("FirstNightTaskInsertedV2 requires first-night-task-plan-v2");
  }

  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, FIRST_NIGHT_TASK_INSERTED_V2_PAYLOAD_KEYS)) {
    return fail("FirstNightTaskInsertedV2 payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    payload.schedulingVersion !== PHILOSOPHER_GAINED_FIRST_NIGHT_SCHEDULING_VERSION ||
    payload.taskPlanVersion !== CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION ||
    typeof payload.taskCatalogVersion !== "string" ||
    typeof payload.taskCatalogSignatureAlgorithm !== "string" ||
    typeof payload.taskCatalogSignature !== "string" ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    typeof payload.taskType !== "string" ||
    typeof payload.taskClass !== "string" ||
    typeof payload.targetRoleId !== "string" ||
    payload.targetRoleId.trim().length === 0 ||
    typeof payload.targetCatalogBaseOrder !== "number" ||
    !Number.isInteger(payload.targetCatalogBaseOrder) ||
    payload.targetCatalogBaseOrder < 0 ||
    typeof payload.effectiveBaseOrder !== "number" ||
    !Number.isInteger(payload.effectiveBaseOrder) ||
    payload.effectiveBaseOrder < 0 ||
    payload.tieBreakPolicy !== PHILOSOPHER_GAINED_TASK_TIE_BREAK_POLICY ||
    typeof payload.tieBreakSourceSeatNumber !== "number" ||
    !Number.isInteger(payload.tieBreakSourceSeatNumber) ||
    payload.tieBreakSourceSeatNumber < 1 ||
    payload.tieBreakSourceSeatNumber > 12 ||
    typeof payload.sourcePlayerId !== "string" ||
    payload.sourcePlayerId.trim().length === 0 ||
    typeof payload.sourceSeatNumber !== "number" ||
    !Number.isInteger(payload.sourceSeatNumber) ||
    payload.sourceSeatNumber < 1 ||
    payload.sourceSeatNumber > 12 ||
    !hasExactRoleSetupSnapshotShape(payload.sourceRole) ||
    !hasExactRoleSetupSnapshotShape(payload.chosenRole) ||
    typeof payload.philosopherOpportunityId !== "string" ||
    payload.philosopherOpportunityId.trim().length === 0 ||
    typeof payload.grantId !== "string" ||
    payload.grantId.trim().length === 0 ||
    typeof payload.sourceCharacterStateRevision !== "number" ||
    !Number.isInteger(payload.sourceCharacterStateRevision) ||
    payload.sourceCharacterStateRevision <= 0 ||
    payload.status !== "PENDING" ||
    typeof payload.settlementPolicy !== "string" ||
    payload.insertionReason !== "PHILOSOPHER_GAINED_ABILITY"
  ) {
    return fail("FirstNightTaskInsertedV2 fields must use supported primitive values");
  }

  if (
    payload.taskCatalogVersion !== input.firstNightTaskPlan.taskCatalogVersion ||
    payload.taskCatalogSignatureAlgorithm !== input.firstNightTaskPlan.taskCatalogSignatureAlgorithm ||
    payload.taskCatalogSignature !== input.firstNightTaskPlan.taskCatalogSignature
  ) {
    return fail("FirstNightTaskInsertedV2 catalog metadata must match the active plan snapshot");
  }

  const existingInsertions = input.insertions?.insertions ?? [];
  if (existingInsertions.some((insertion) => !isV2Insertion(insertion))) {
    return fail("FirstNightTaskInsertedV2 cannot mix with legacy insertion facts");
  }
  if (existingInsertions.some((insertion) => insertion.taskId === payload.taskId)) {
    return fail("FirstNightTaskInsertedV2 cannot duplicate a scheduled task id");
  }
  if (input.firstNightTaskPlan.tasks.some((task) => task.taskId === payload.taskId)) {
    return fail("FirstNightTaskInsertedV2 cannot duplicate an existing scheduled task id");
  }

  const grants = input.grants?.abilities.filter((candidate) => candidate.grantId === payload.grantId) ?? [];
  const grant = grants[0];
  if (grants.length !== 1 || grant === undefined) {
    return fail("FirstNightTaskInsertedV2 requires exactly one matching PhilosopherAbilityGranted fact");
  }

  const expected = createFirstNightTaskInsertedV2Payload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    choice: {
      rulesBaselineVersion: payload.rulesBaselineVersion,
      nightNumber: 1,
      taskId: grant.grantedAtTaskId,
      taskType: "PHILOSOPHER_ACTION",
      opportunityId: grant.grantedAtOpportunityId,
      decisionKind: "CHOOSE_GOOD_CHARACTER",
      sourcePlayerId: grant.sourcePlayerId,
      sourceSeatNumber: grant.sourceSeatNumber,
      sourceRole: grant.sourceRole,
      sourceCharacterStateRevision: grant.sourceCharacterStateRevision,
      chosenRole: grant.chosenRole,
      chosenRoleId: grant.chosenRoleId,
      roleCatalogSignature: grant.chosenRoleCatalogSignature
    },
    grant,
    firstNightTaskPlan: input.firstNightTaskPlan
  });
  const candidate = payload as unknown as FirstNightTaskInsertedV2Payload;
  if (
    expected === undefined ||
    candidate.schedulingVersion !== expected.schedulingVersion ||
    candidate.taskPlanVersion !== expected.taskPlanVersion ||
    candidate.taskCatalogVersion !== expected.taskCatalogVersion ||
    candidate.taskCatalogSignatureAlgorithm !== expected.taskCatalogSignatureAlgorithm ||
    candidate.taskCatalogSignature !== expected.taskCatalogSignature ||
    candidate.taskId !== expected.taskId ||
    candidate.taskType !== expected.taskType ||
    candidate.taskClass !== expected.taskClass ||
    candidate.targetRoleId !== expected.targetRoleId ||
    candidate.targetCatalogBaseOrder !== expected.targetCatalogBaseOrder ||
    candidate.effectiveBaseOrder !== expected.effectiveBaseOrder ||
    candidate.tieBreakPolicy !== expected.tieBreakPolicy ||
    candidate.tieBreakSourceSeatNumber !== expected.tieBreakSourceSeatNumber ||
    candidate.sourcePlayerId !== expected.sourcePlayerId ||
    candidate.sourceSeatNumber !== expected.sourceSeatNumber ||
    !sameRoleSetupSnapshot(candidate.sourceRole, expected.sourceRole) ||
    !sameRoleSetupSnapshot(candidate.chosenRole, expected.chosenRole) ||
    candidate.philosopherOpportunityId !== expected.philosopherOpportunityId ||
    candidate.grantId !== expected.grantId ||
    candidate.sourceCharacterStateRevision !== expected.sourceCharacterStateRevision ||
    candidate.status !== expected.status ||
    candidate.settlementPolicy !== expected.settlementPolicy ||
    candidate.insertionReason !== expected.insertionReason
  ) {
    return fail("FirstNightTaskInsertedV2 must match the deterministic catalog-bound insertion");
  }

  return { valid: true };
};

export const appendPhilosopherAbilityChoice = (
  state: PhilosopherAbilityChoiceSet | undefined,
  payload: PhilosopherAbilityChosenPayload
): PhilosopherAbilityChoiceSet => ({
  choices: [...clonePhilosopherAbilityChoiceSet(state).choices, cloneChoice(payload)]
});

export const appendPhilosopherGrantedAbility = (
  state: GrantedAbilitySet | undefined,
  payload: PhilosopherAbilityGrantedPayload
): GrantedAbilitySet => ({
  abilities: [...cloneGrantedAbilitySet(state).abilities, cloneGrant(payload)]
});

export const appendAbilityImpairment = (
  state: AbilityImpairmentSet | undefined,
  payload: AbilityImpairmentAppliedPayload
): AbilityImpairmentSet => ({
  impairments: [...cloneAbilityImpairmentSet(state).impairments, cloneImpairment(payload)]
});

export const appendFirstNightTaskInsertion = (
  state: FirstNightTaskInsertion | undefined,
  payload: AnyFirstNightTaskInsertedPayload
): FirstNightTaskInsertion => ({
  insertions: [...cloneFirstNightTaskInsertion(state).insertions, cloneInsertion(payload)]
});

export const scheduledTaskFromFirstNightTaskInsertedPayload = (
  payload: AnyFirstNightTaskInsertedPayload
): ScheduledTask => ({
  taskId: payload.taskId,
  taskType: payload.taskType,
  taskClass: payload.taskClass,
  orderKey: {
    baseOrder: isV2Insertion(payload) ? payload.effectiveBaseOrder : payload.orderKey.baseOrder,
    insertionOrder: isV2Insertion(payload) ? payload.tieBreakSourceSeatNumber : payload.orderKey.insertionOrder
  },
  source: {
    kind: "PHILOSOPHER_GAINED_ABILITY",
    playerId: isV2Insertion(payload) ? payload.sourcePlayerId : payload.source.playerId,
    seatNumber: isV2Insertion(payload) ? payload.sourceSeatNumber : payload.source.seatNumber,
    sourceRole: cloneRoleSetupSnapshot(isV2Insertion(payload) ? payload.sourceRole : payload.source.sourceRole),
    chosenRole: cloneRoleSetupSnapshot(isV2Insertion(payload) ? payload.chosenRole : payload.source.chosenRole),
    opportunityId: isV2Insertion(payload) ? payload.philosopherOpportunityId : payload.source.opportunityId,
    sourceCharacterStateRevision: payload.sourceCharacterStateRevision
  },
  status: payload.status,
  settlementPolicy: payload.settlementPolicy
});

export const applyFirstNightTaskInsertionToPlan = (
  plan: FirstNightTaskPlan,
  payload: AnyFirstNightTaskInsertedPayload
): FirstNightTaskPlan => {
  const payloadVersion: FirstNightTaskPlanVersion = isV2Insertion(payload)
    ? CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION
    : LEGACY_FIRST_NIGHT_TASK_PLAN_VERSION;
  if (plan.taskPlanVersion !== payloadVersion) {
    throw new DomainError("InvalidFirstNightTaskInsertedPayload", "Insertion generation must match the active first-night task plan");
  }
  const clonedPlan = cloneFirstNightTaskPlan(plan);
  const insertedTask = scheduledTaskFromFirstNightTaskInsertedPayload(payload);

  if (clonedPlan.tasks.some((task) => task.taskId === insertedTask.taskId)) {
    throw new DomainError("InvalidFirstNightTaskInsertedPayload", "FirstNightTaskInserted cannot duplicate a scheduled task id");
  }

  return {
    ...clonedPlan,
    tasks: [...clonedPlan.tasks, insertedTask].sort(compareFirstNightTaskOrder)
  };
};

export const hasPhilosopherAbilityGrantForSettlement = (
  grants: GrantedAbilitySet | undefined,
  settlement: Pick<ScheduledTaskSettlement, "taskId" | "taskType" | "characterStateRevision">,
  opportunities: FirstNightActionOpportunityState | undefined
): boolean =>
  settlement.taskType === "PHILOSOPHER_ACTION" &&
  hasClosedPhilosopherOpportunityForSettlement(opportunities, settlement) &&
  (grants?.abilities.some((grant) =>
    grant.grantedAtTaskId === settlement.taskId &&
    grant.sourceCharacterStateRevision === settlement.characterStateRevision
  ) ?? false);
