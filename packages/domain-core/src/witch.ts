import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import { DomainError } from "./errors.js";
import type { FirstNightActionOpportunityState } from "./first-night-action-opportunity.js";
import { findFirstNightActionOpportunityById } from "./first-night-action-opportunity.js";
import {
  SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  getNextUnsettledFirstNightTask,
  isFirstNightTaskSettled
} from "./first-night-task-plan.js";
import type {
  FirstNightTaskPlan,
  FirstNightTaskProgress,
  ScheduledTaskSettlement
} from "./first-night-task-plan.js";
import type { AbilityImpairmentId, ActionOpportunityId, PlayerId, ScheduledTaskId } from "./ids.js";
import type { AbilityImpairmentSet } from "./philosopher-ability.js";
import type { PlayerRoster, SeatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";
import {
  hasExactEnumerableKeys,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord
} from "./initial-private-knowledge.js";

export const WITCH_PENDING_DEATH_MARKER_VERSION = "witch-death-pending-v1" as const;

export type WitchPendingDeathId = string;

export type WitchActionDecision = {
  readonly kind: "CHOOSE_PLAYER";
  readonly targetPlayerId: PlayerId;
};

export type WitchDeathPendingTrigger = "TARGET_NOMINATES_TOMORROW";
export type WitchIneffectiveOutcomeType = "SOURCE_IMPAIRED_NO_EFFECT";
export type WitchIneffectiveReason = "SOURCE_DRUNK" | "SOURCE_POISONED";

export type WitchTargetChosenPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "WITCH_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
};

export type WitchDeathPendingPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "WITCH_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly pendingDeathId: WitchPendingDeathId;
  readonly trigger: WitchDeathPendingTrigger;
  readonly markerVersion: typeof WITCH_PENDING_DEATH_MARKER_VERSION;
};

export type WitchIneffectiveResolvedPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "WITCH_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly outcomeType: WitchIneffectiveOutcomeType;
  readonly reason: WitchIneffectiveReason;
  readonly sourceImpairmentId: AbilityImpairmentId;
  readonly sourceImpairmentKind: "DRUNK" | "POISONED";
};

export type WitchTargetChoiceSet = {
  readonly choices: readonly WitchTargetChosenPayload[];
};

export type WitchDeathPendingSet = {
  readonly pendingDeaths: readonly WitchDeathPendingPayload[];
};

export type WitchIneffectiveResolutionSet = {
  readonly resolutions: readonly WitchIneffectiveResolvedPayload[];
};

export type WitchEffectivenessResult =
  | {
      readonly effective: true;
    }
  | {
      readonly effective: false;
      readonly reason: WitchIneffectiveReason;
      readonly impairmentId: AbilityImpairmentId;
      readonly impairmentKind: "DRUNK" | "POISONED";
    };

type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

type WitchActionInput = {
  readonly taskId: ScheduledTaskId;
  readonly firstNightTaskPlan: Pick<FirstNightTaskPlan, "tasks">;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  readonly roster: PlayerRoster;
};

const WITCH_ROLE_ID = "witch";
const WITCH_DECISION_KEYS = ["kind", "targetPlayerId"] as const;
const WITCH_TARGET_CHOSEN_PAYLOAD_KEYS = [
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
const WITCH_DEATH_PENDING_PAYLOAD_KEYS = [
  "markerVersion",
  "nightNumber",
  "opportunityId",
  "pendingDeathId",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSeatNumber",
  "taskId",
  "taskType",
  "trigger"
] as const;
const WITCH_INEFFECTIVE_RESOLVED_PAYLOAD_KEYS = [
  "nightNumber",
  "opportunityId",
  "outcomeType",
  "reason",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourceImpairmentId",
  "sourceImpairmentKind",
  "sourcePlayerId",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSeatNumber",
  "taskId",
  "taskType"
] as const;

const fail = (reason: string): ValidationResult => ({ valid: false, reason });

const cloneTargetChoice = (choice: WitchTargetChosenPayload): WitchTargetChosenPayload => ({
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
});

const cloneDeathPending = (pending: WitchDeathPendingPayload): WitchDeathPendingPayload => ({
  rulesBaselineVersion: pending.rulesBaselineVersion,
  nightNumber: pending.nightNumber,
  taskId: pending.taskId,
  taskType: pending.taskType,
  opportunityId: pending.opportunityId,
  sourcePlayerId: pending.sourcePlayerId,
  sourceSeatNumber: pending.sourceSeatNumber,
  sourceCharacterStateRevision: pending.sourceCharacterStateRevision,
  targetPlayerId: pending.targetPlayerId,
  targetSeatNumber: pending.targetSeatNumber,
  pendingDeathId: pending.pendingDeathId,
  trigger: pending.trigger,
  markerVersion: pending.markerVersion
});

const cloneIneffectiveResolution = (resolution: WitchIneffectiveResolvedPayload): WitchIneffectiveResolvedPayload => ({
  rulesBaselineVersion: resolution.rulesBaselineVersion,
  nightNumber: resolution.nightNumber,
  taskId: resolution.taskId,
  taskType: resolution.taskType,
  opportunityId: resolution.opportunityId,
  sourcePlayerId: resolution.sourcePlayerId,
  sourceSeatNumber: resolution.sourceSeatNumber,
  sourceCharacterStateRevision: resolution.sourceCharacterStateRevision,
  targetPlayerId: resolution.targetPlayerId,
  targetSeatNumber: resolution.targetSeatNumber,
  outcomeType: resolution.outcomeType,
  reason: resolution.reason,
  sourceImpairmentId: resolution.sourceImpairmentId,
  sourceImpairmentKind: resolution.sourceImpairmentKind
});

export const cloneWitchTargetChoiceSet = (state: WitchTargetChoiceSet | undefined): WitchTargetChoiceSet => ({
  choices: state?.choices.map(cloneTargetChoice) ?? []
});

export const cloneWitchDeathPendingSet = (state: WitchDeathPendingSet | undefined): WitchDeathPendingSet => ({
  pendingDeaths: state?.pendingDeaths.map(cloneDeathPending) ?? []
});

export const cloneWitchIneffectiveResolutionSet = (
  state: WitchIneffectiveResolutionSet | undefined
): WitchIneffectiveResolutionSet => ({
  resolutions: state?.resolutions.map(cloneIneffectiveResolution) ?? []
});

export const validateWitchActionDecision = (decision: unknown): ValidationResult => {
  if (
    !isPlainRecord(decision) ||
    !hasExactEnumerableKeys(decision, WITCH_DECISION_KEYS) ||
    decision.kind !== "CHOOSE_PLAYER" ||
    typeof decision.targetPlayerId !== "string" ||
    decision.targetPlayerId.trim().length === 0
  ) {
    return fail("SubmitWitchAction decision must be exactly CHOOSE_PLAYER with targetPlayerId");
  }

  return { valid: true };
};

const currentWitchEntryForTask = (
  input: WitchActionInput
) => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return undefined;
  }

  const source = targetTask.source;
  if (
    targetTask.taskType !== "WITCH_ACTION" ||
    targetTask.taskClass !== "ROLE_ACTION" ||
    source.kind !== "ROLE" ||
    source.role.roleId !== WITCH_ROLE_ID
  ) {
    return undefined;
  }

  const currentEntry = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === source.playerId &&
    entry.seatNumber === source.seatNumber
  );
  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== WITCH_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.role)
  ) {
    return undefined;
  }

  return currentEntry;
};

const validateWitchTaskSource = (input: WitchActionInput): ValidationResult => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return fail("Witch action must reference a task in the first-night task plan");
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return fail("Witch action cannot target a settled task");
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId || nextTask.taskType !== "WITCH_ACTION") {
    return fail("Witch action must target the current next unsettled Witch task");
  }

  const currentEntry = currentWitchEntryForTask(input);
  if (currentEntry === undefined) {
    return fail("Witch action source is no longer a current Witch");
  }

  return { valid: true };
};

const findWitchTargetChoice = (
  state: WitchTargetChoiceSet | undefined,
  payload: Pick<WitchTargetChosenPayload, "taskId" | "opportunityId" | "targetPlayerId">
): WitchTargetChosenPayload | undefined =>
  state?.choices.find((choice) =>
    choice.taskId === payload.taskId &&
    choice.opportunityId === payload.opportunityId &&
    choice.targetPlayerId === payload.targetPlayerId
  );

export const formatWitchPendingDeathId = (input: {
  readonly taskId: ScheduledTaskId;
  readonly sourceSeatNumber: SeatNumber;
  readonly targetSeatNumber: SeatNumber;
}): WitchPendingDeathId =>
  `${WITCH_PENDING_DEATH_MARKER_VERSION}:${input.taskId}:source-seat-${String(input.sourceSeatNumber).padStart(2, "0")}:target-seat-${String(input.targetSeatNumber).padStart(2, "0")}`;

export const createWitchTargetChosenPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly targetPlayerId: PlayerId;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  readonly roster: PlayerRoster;
}): WitchTargetChosenPayload => {
  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, input.opportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    opportunity.opportunityKind !== "WITCH_FIRST_NIGHT_ACTION" ||
    opportunity.taskId !== input.taskId ||
    opportunity.taskType !== "WITCH_ACTION"
  ) {
    throw new DomainError("InvalidWitchTargetChosenPayload", "WitchTargetChosen requires an open Witch action opportunity");
  }

  const target = input.roster.find((entry) => entry.playerId === input.targetPlayerId);
  if (target === undefined) {
    throw new DomainError("InvalidWitchTargetChosenPayload", "WitchTargetChosen target must exist in the roster");
  }

  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    nightNumber: 1,
    taskId: opportunity.taskId,
    taskType: "WITCH_ACTION",
    opportunityId: opportunity.opportunityId,
    decisionKind: "CHOOSE_PLAYER",
    sourcePlayerId: opportunity.sourcePlayerId,
    sourceSeatNumber: opportunity.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
    sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
    targetPlayerId: target.playerId,
    targetSeatNumber: target.seatNumber
  };
};

export const createWitchDeathPendingMarkedPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: WitchTargetChosenPayload;
}): WitchDeathPendingPayload => ({
  rulesBaselineVersion: input.rulesBaselineVersion,
  nightNumber: 1,
  taskId: input.targetChoice.taskId,
  taskType: "WITCH_ACTION",
  opportunityId: input.targetChoice.opportunityId,
  sourcePlayerId: input.targetChoice.sourcePlayerId,
  sourceSeatNumber: input.targetChoice.sourceSeatNumber,
  sourceCharacterStateRevision: input.targetChoice.sourceCharacterStateRevision,
  targetPlayerId: input.targetChoice.targetPlayerId,
  targetSeatNumber: input.targetChoice.targetSeatNumber,
  pendingDeathId: formatWitchPendingDeathId({
    taskId: input.targetChoice.taskId,
    sourceSeatNumber: input.targetChoice.sourceSeatNumber,
    targetSeatNumber: input.targetChoice.targetSeatNumber
  }),
  trigger: "TARGET_NOMINATES_TOMORROW",
  markerVersion: WITCH_PENDING_DEATH_MARKER_VERSION
});

export const createWitchIneffectiveResolvedPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: WitchTargetChosenPayload;
  readonly effectiveness: WitchEffectivenessResult;
}): WitchIneffectiveResolvedPayload => {
  if (input.effectiveness.effective) {
    throw new DomainError("InvalidWitchIneffectiveResolvedPayload", "WitchIneffectiveResolved requires an ineffective source");
  }

  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    nightNumber: 1,
    taskId: input.targetChoice.taskId,
    taskType: "WITCH_ACTION",
    opportunityId: input.targetChoice.opportunityId,
    sourcePlayerId: input.targetChoice.sourcePlayerId,
    sourceSeatNumber: input.targetChoice.sourceSeatNumber,
    sourceCharacterStateRevision: input.targetChoice.sourceCharacterStateRevision,
    targetPlayerId: input.targetChoice.targetPlayerId,
    targetSeatNumber: input.targetChoice.targetSeatNumber,
    outcomeType: "SOURCE_IMPAIRED_NO_EFFECT",
    reason: input.effectiveness.reason,
    sourceImpairmentId: input.effectiveness.impairmentId,
    sourceImpairmentKind: input.effectiveness.impairmentKind
  };
};

export const createWitchDeathPendingScheduledTaskSettlement = (input: {
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): ScheduledTaskSettlement => ({
  taskId: input.taskId,
  taskType: "WITCH_ACTION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "WITCH_DEATH_PENDING_MARKED",
  characterStateRevision: input.characterStateRevision
});

export const createWitchIneffectiveScheduledTaskSettlement = (input: {
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): ScheduledTaskSettlement => ({
  taskId: input.taskId,
  taskType: "WITCH_ACTION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "WITCH_INEFFECTIVE",
  characterStateRevision: input.characterStateRevision
});

export const evaluateWitchEffectiveness = (input: {
  readonly sourcePlayerId: PlayerId;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): WitchEffectivenessResult => {
  const impairment = [...(input.abilityImpairments?.impairments ?? [])]
    .filter((candidate) =>
      candidate.affectedPlayerId === input.sourcePlayerId &&
      (candidate.kind === "DRUNK" || candidate.kind === "POISONED")
    )
    .sort((left, right) => {
      if (left.impairmentId < right.impairmentId) {
        return -1;
      }

      if (left.impairmentId > right.impairmentId) {
        return 1;
      }

      return 0;
    })[0];

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

const sameTargetChoice = (left: WitchTargetChosenPayload, right: WitchTargetChosenPayload): boolean =>
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

const sameDeathPending = (left: WitchDeathPendingPayload, right: WitchDeathPendingPayload): boolean =>
  left.rulesBaselineVersion === right.rulesBaselineVersion &&
  left.nightNumber === right.nightNumber &&
  left.taskId === right.taskId &&
  left.taskType === right.taskType &&
  left.opportunityId === right.opportunityId &&
  left.sourcePlayerId === right.sourcePlayerId &&
  left.sourceSeatNumber === right.sourceSeatNumber &&
  left.sourceCharacterStateRevision === right.sourceCharacterStateRevision &&
  left.targetPlayerId === right.targetPlayerId &&
  left.targetSeatNumber === right.targetSeatNumber &&
  left.pendingDeathId === right.pendingDeathId &&
  left.trigger === right.trigger &&
  left.markerVersion === right.markerVersion;

const sameIneffectiveResolution = (left: WitchIneffectiveResolvedPayload, right: WitchIneffectiveResolvedPayload): boolean =>
  left.rulesBaselineVersion === right.rulesBaselineVersion &&
  left.nightNumber === right.nightNumber &&
  left.taskId === right.taskId &&
  left.taskType === right.taskType &&
  left.opportunityId === right.opportunityId &&
  left.sourcePlayerId === right.sourcePlayerId &&
  left.sourceSeatNumber === right.sourceSeatNumber &&
  left.sourceCharacterStateRevision === right.sourceCharacterStateRevision &&
  left.targetPlayerId === right.targetPlayerId &&
  left.targetSeatNumber === right.targetSeatNumber &&
  left.outcomeType === right.outcomeType &&
  left.reason === right.reason &&
  left.sourceImpairmentId === right.sourceImpairmentId &&
  left.sourceImpairmentKind === right.sourceImpairmentKind;

export const validateWitchTargetChosenPayload = (
  payload: unknown,
  input: WitchActionInput
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, WITCH_TARGET_CHOSEN_PAYLOAD_KEYS)) {
    return fail("WitchTargetChosen payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    payload.taskType !== "WITCH_ACTION" ||
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
    payload.targetSeatNumber > 12
  ) {
    return fail("WitchTargetChosen fields must use supported primitive values");
  }

  const sourceValidation = validateWitchTaskSource(input);
  if (!sourceValidation.valid) {
    return sourceValidation;
  }

  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, payload.opportunityId as ActionOpportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    opportunity.opportunityKind !== "WITCH_FIRST_NIGHT_ACTION" ||
    opportunity.taskId !== payload.taskId ||
    opportunity.taskType !== "WITCH_ACTION" ||
    opportunity.sourcePlayerId !== payload.sourcePlayerId ||
    opportunity.sourceSeatNumber !== payload.sourceSeatNumber ||
    !sameRoleSetupSnapshot(opportunity.sourceRole, payload.sourceRole) ||
    opportunity.sourceCharacterStateRevision !== payload.sourceCharacterStateRevision
  ) {
    return fail("WitchTargetChosen must match the referenced Witch action opportunity");
  }

  const target = input.roster.find((entry) => entry.playerId === payload.targetPlayerId);
  if (target === undefined || target.seatNumber !== payload.targetSeatNumber) {
    return fail("WitchTargetChosen target must exist in roster");
  }

  const expected = createWitchTargetChosenPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    taskId: payload.taskId as ScheduledTaskId,
    opportunityId: payload.opportunityId as ActionOpportunityId,
    targetPlayerId: payload.targetPlayerId as PlayerId,
    firstNightActionOpportunities: input.firstNightActionOpportunities,
    roster: input.roster
  });

  if (!sameTargetChoice(payload as unknown as WitchTargetChosenPayload, expected)) {
    return fail("WitchTargetChosen must match the open opportunity and target roster entry");
  }

  return { valid: true };
};

export const validateWitchDeathPendingMarkedPayload = (
  payload: unknown,
  input: {
    readonly choices: WitchTargetChoiceSet | undefined;
    readonly pendingDeaths: WitchDeathPendingSet | undefined;
    readonly abilityImpairments: AbilityImpairmentSet | undefined;
    readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  }
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, WITCH_DEATH_PENDING_PAYLOAD_KEYS)) {
    return fail("WitchDeathPendingMarked payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    payload.taskType !== "WITCH_ACTION" ||
    typeof payload.opportunityId !== "string" ||
    payload.opportunityId.trim().length === 0 ||
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
    typeof payload.pendingDeathId !== "string" ||
    payload.pendingDeathId.trim().length === 0 ||
    payload.trigger !== "TARGET_NOMINATES_TOMORROW" ||
    payload.markerVersion !== WITCH_PENDING_DEATH_MARKER_VERSION
  ) {
    return fail("WitchDeathPendingMarked fields must use supported primitive values");
  }

  if (input.pendingDeaths?.pendingDeaths.some((pending) => pending.pendingDeathId === payload.pendingDeathId) === true) {
    return fail("WitchDeathPendingMarked cannot duplicate pendingDeathId");
  }

  const choice = findWitchTargetChoice(input.choices, {
    taskId: payload.taskId as ScheduledTaskId,
    opportunityId: payload.opportunityId as ActionOpportunityId,
    targetPlayerId: payload.targetPlayerId as PlayerId
  });
  if (choice === undefined) {
    return fail("WitchDeathPendingMarked must follow a matching WitchTargetChosen event");
  }

  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, choice.opportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    opportunity.opportunityKind !== "WITCH_FIRST_NIGHT_ACTION" ||
    opportunity.taskType !== "WITCH_ACTION"
  ) {
    return fail("WitchDeathPendingMarked must close a matching OPEN Witch action opportunity");
  }

  const effectiveness = evaluateWitchEffectiveness({
    sourcePlayerId: choice.sourcePlayerId,
    abilityImpairments: input.abilityImpairments
  });
  if (!effectiveness.effective) {
    return fail("WitchDeathPendingMarked requires an effective Witch source");
  }

  const expected = createWitchDeathPendingMarkedPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    targetChoice: choice
  });
  if (!sameDeathPending(payload as unknown as WitchDeathPendingPayload, expected)) {
    return fail("WitchDeathPendingMarked must match the preceding target choice");
  }

  return { valid: true };
};

export const validateWitchIneffectiveResolvedPayload = (
  payload: unknown,
  input: {
    readonly choices: WitchTargetChoiceSet | undefined;
    readonly resolutions: WitchIneffectiveResolutionSet | undefined;
    readonly abilityImpairments: AbilityImpairmentSet | undefined;
    readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  }
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, WITCH_INEFFECTIVE_RESOLVED_PAYLOAD_KEYS)) {
    return fail("WitchIneffectiveResolved payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    payload.taskType !== "WITCH_ACTION" ||
    typeof payload.opportunityId !== "string" ||
    payload.opportunityId.trim().length === 0 ||
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
    payload.outcomeType !== "SOURCE_IMPAIRED_NO_EFFECT" ||
    (payload.reason !== "SOURCE_DRUNK" && payload.reason !== "SOURCE_POISONED") ||
    typeof payload.sourceImpairmentId !== "string" ||
    payload.sourceImpairmentId.trim().length === 0 ||
    (payload.sourceImpairmentKind !== "DRUNK" && payload.sourceImpairmentKind !== "POISONED")
  ) {
    return fail("WitchIneffectiveResolved fields must use supported primitive values");
  }

  if (
    (payload.reason === "SOURCE_DRUNK" && payload.sourceImpairmentKind !== "DRUNK") ||
    (payload.reason === "SOURCE_POISONED" && payload.sourceImpairmentKind !== "POISONED")
  ) {
    return fail("WitchIneffectiveResolved reason must match sourceImpairmentKind");
  }

  if (input.resolutions?.resolutions.some((resolution) => resolution.opportunityId === payload.opportunityId) === true) {
    return fail("WitchIneffectiveResolved cannot resolve the same opportunity twice");
  }

  const choice = findWitchTargetChoice(input.choices, {
    taskId: payload.taskId as ScheduledTaskId,
    opportunityId: payload.opportunityId as ActionOpportunityId,
    targetPlayerId: payload.targetPlayerId as PlayerId
  });
  if (choice === undefined) {
    return fail("WitchIneffectiveResolved must follow a matching WitchTargetChosen event");
  }

  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, choice.opportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    opportunity.opportunityKind !== "WITCH_FIRST_NIGHT_ACTION" ||
    opportunity.taskType !== "WITCH_ACTION"
  ) {
    return fail("WitchIneffectiveResolved must close a matching OPEN Witch action opportunity");
  }

  const effectiveness = evaluateWitchEffectiveness({
    sourcePlayerId: choice.sourcePlayerId,
    abilityImpairments: input.abilityImpairments
  });
  if (effectiveness.effective) {
    return fail("WitchIneffectiveResolved requires an impaired Witch source");
  }

  const expected = createWitchIneffectiveResolvedPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    targetChoice: choice,
    effectiveness
  });
  if (!sameIneffectiveResolution(payload as unknown as WitchIneffectiveResolvedPayload, expected)) {
    return fail("WitchIneffectiveResolved must match the preceding target choice and active source impairment");
  }

  return { valid: true };
};

export const appendWitchTargetChoice = (
  state: WitchTargetChoiceSet | undefined,
  payload: WitchTargetChosenPayload
): WitchTargetChoiceSet => ({
  choices: [...cloneWitchTargetChoiceSet(state).choices, cloneTargetChoice(payload)]
});

export const appendWitchDeathPending = (
  state: WitchDeathPendingSet | undefined,
  payload: WitchDeathPendingPayload
): WitchDeathPendingSet => ({
  pendingDeaths: [...cloneWitchDeathPendingSet(state).pendingDeaths, cloneDeathPending(payload)]
});

export const appendWitchIneffectiveResolution = (
  state: WitchIneffectiveResolutionSet | undefined,
  payload: WitchIneffectiveResolvedPayload
): WitchIneffectiveResolutionSet => ({
  resolutions: [...cloneWitchIneffectiveResolutionSet(state).resolutions, cloneIneffectiveResolution(payload)]
});

export const hasWitchDeathPendingForSettlement = (
  pendingDeaths: WitchDeathPendingSet | undefined,
  settlement: Pick<ScheduledTaskSettlement, "taskId" | "taskType" | "outcomeType" | "characterStateRevision">
): boolean =>
  settlement.taskType === "WITCH_ACTION" &&
  settlement.outcomeType === "WITCH_DEATH_PENDING_MARKED" &&
  (pendingDeaths?.pendingDeaths.some((pending) =>
    pending.taskId === settlement.taskId &&
    pending.taskType === settlement.taskType &&
    pending.sourceCharacterStateRevision === settlement.characterStateRevision
  ) ?? false);

export const hasWitchIneffectiveResolutionForSettlement = (
  resolutions: WitchIneffectiveResolutionSet | undefined,
  settlement: Pick<ScheduledTaskSettlement, "taskId" | "taskType" | "outcomeType" | "characterStateRevision">
): boolean =>
  settlement.taskType === "WITCH_ACTION" &&
  settlement.outcomeType === "WITCH_INEFFECTIVE" &&
  (resolutions?.resolutions.some((resolution) =>
    resolution.taskId === settlement.taskId &&
    resolution.taskType === settlement.taskType &&
    resolution.sourceCharacterStateRevision === settlement.characterStateRevision
  ) ?? false);
