import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import { DomainError } from "./errors.js";
import type { FirstNightActionOpportunityState } from "./first-night-action-opportunity.js";
import {
  findFirstNightActionOpportunityById
} from "./first-night-action-opportunity.js";
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
import type { ActionOpportunityId, PlayerId, ScheduledTaskId } from "./ids.js";
import {
  hasExactEnumerableKeys,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord
} from "./initial-private-knowledge.js";
import type { PlayerRoster, SeatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";

export type SnakeCharmerActionDecision = {
  readonly kind: "CHOOSE_PLAYER";
  readonly targetPlayerId: PlayerId;
};

export type SnakeCharmerNoSwapOutcomeType = "NON_DEMON_TARGET_NO_SWAP";

export type SnakeCharmerTargetChosenPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SNAKE_CHARMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
};

export type SnakeCharmerNoSwapResolvedPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SNAKE_CHARMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly outcomeType: SnakeCharmerNoSwapOutcomeType;
};

export type SnakeCharmerTargetChoiceSet = {
  readonly choices: readonly SnakeCharmerTargetChosenPayload[];
};

export type SnakeCharmerNoSwapResolutionSet = {
  readonly resolutions: readonly SnakeCharmerNoSwapResolvedPayload[];
};

type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

type SnakeCharmerActionInput = {
  readonly taskId: ScheduledTaskId;
  readonly firstNightTaskPlan: Pick<FirstNightTaskPlan, "tasks">;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  readonly roster: PlayerRoster;
};

const SNAKE_CHARMER_TARGET_CHOSEN_PAYLOAD_KEYS = [
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
const SNAKE_CHARMER_NO_SWAP_RESOLVED_PAYLOAD_KEYS = [
  "nightNumber",
  "opportunityId",
  "outcomeType",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceSeatNumber",
  "targetPlayerId",
  "targetSeatNumber",
  "taskId",
  "taskType"
] as const;
const SNAKE_CHARMER_DECISION_KEYS = ["kind", "targetPlayerId"] as const;
const PHILOSOPHER_ROLE_ID = "philosopher";
const SNAKE_CHARMER_ROLE_ID = "snake_charmer";

const fail = (reason: string): ValidationResult => ({ valid: false, reason });

const cloneTargetChoice = (choice: SnakeCharmerTargetChosenPayload): SnakeCharmerTargetChosenPayload => ({
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

const cloneNoSwapResolution = (resolution: SnakeCharmerNoSwapResolvedPayload): SnakeCharmerNoSwapResolvedPayload => ({
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
  outcomeType: resolution.outcomeType
});

export const cloneSnakeCharmerTargetChoiceSet = (
  state: SnakeCharmerTargetChoiceSet | undefined
): SnakeCharmerTargetChoiceSet => ({
  choices: state?.choices.map(cloneTargetChoice) ?? []
});

export const cloneSnakeCharmerNoSwapResolutionSet = (
  state: SnakeCharmerNoSwapResolutionSet | undefined
): SnakeCharmerNoSwapResolutionSet => ({
  resolutions: state?.resolutions.map(cloneNoSwapResolution) ?? []
});

export const validateSnakeCharmerActionDecision = (decision: unknown): ValidationResult => {
  if (
    !isPlainRecord(decision) ||
    !hasExactEnumerableKeys(decision, SNAKE_CHARMER_DECISION_KEYS) ||
    decision.kind !== "CHOOSE_PLAYER" ||
    typeof decision.targetPlayerId !== "string" ||
    decision.targetPlayerId.trim().length === 0
  ) {
    return fail("SubmitSnakeCharmerAction decision must be exactly CHOOSE_PLAYER with targetPlayerId");
  }

  return { valid: true };
};

const targetRosterEntry = (
  roster: PlayerRoster,
  targetPlayerId: PlayerId
) => roster.find((entry) => entry.playerId === targetPlayerId);

const validateSnakeCharmerTaskSource = (
  input: SnakeCharmerActionInput
): ValidationResult => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return fail("Snake Charmer action must reference a task in the first-night task plan");
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return fail("Snake Charmer action cannot target a settled task");
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId || nextTask.taskType !== "SNAKE_CHARMER_ACTION") {
    return fail("Snake Charmer action must target the current next unsettled Snake Charmer task");
  }

  const source = targetTask.source;
  if (
    targetTask.taskType !== "SNAKE_CHARMER_ACTION" ||
    source.kind !== "PHILOSOPHER_GAINED_ABILITY" ||
    source.sourceRole.roleId !== PHILOSOPHER_ROLE_ID ||
    source.chosenRole.roleId !== SNAKE_CHARMER_ROLE_ID ||
    source.sourceCharacterStateRevision !== input.currentCharacterState.revision
  ) {
    return fail("Snake Charmer action requires a Philosopher gained snake_charmer task source");
  }

  const currentSource = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === source.playerId &&
    entry.seatNumber === source.seatNumber
  );
  if (
    currentSource === undefined ||
    currentSource.role.roleId !== PHILOSOPHER_ROLE_ID ||
    !sameRoleSetupSnapshot(currentSource.role, source.sourceRole)
  ) {
    return fail("Snake Charmer action source is no longer the same current Philosopher state");
  }

  return { valid: true };
};

const findTargetChoice = (
  state: SnakeCharmerTargetChoiceSet | undefined,
  payload: Pick<SnakeCharmerNoSwapResolvedPayload, "taskId" | "opportunityId" | "targetPlayerId">
): SnakeCharmerTargetChosenPayload | undefined =>
  state?.choices.find((choice) =>
    choice.taskId === payload.taskId &&
    choice.opportunityId === payload.opportunityId &&
    choice.targetPlayerId === payload.targetPlayerId
  );

export const createSnakeCharmerTargetChosenPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly targetPlayerId: PlayerId;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  readonly roster: PlayerRoster;
}): SnakeCharmerTargetChosenPayload => {
  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, input.opportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    opportunity.opportunityKind !== "SNAKE_CHARMER_FIRST_NIGHT_ACTION" ||
    opportunity.taskId !== input.taskId ||
    opportunity.taskType !== "SNAKE_CHARMER_ACTION"
  ) {
    throw new DomainError("InvalidSnakeCharmerTargetChosenPayload", "SnakeCharmerTargetChosen requires an open Snake Charmer action opportunity");
  }

  const target = targetRosterEntry(input.roster, input.targetPlayerId);
  if (target === undefined) {
    throw new DomainError("InvalidSnakeCharmerTargetChosenPayload", "SnakeCharmerTargetChosen target must exist in the roster");
  }

  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    nightNumber: 1,
    taskId: input.taskId,
    taskType: "SNAKE_CHARMER_ACTION",
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

export const createSnakeCharmerNoSwapResolvedPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: SnakeCharmerTargetChosenPayload;
}): SnakeCharmerNoSwapResolvedPayload => ({
  rulesBaselineVersion: input.rulesBaselineVersion,
  nightNumber: 1,
  taskId: input.targetChoice.taskId,
  taskType: input.targetChoice.taskType,
  opportunityId: input.targetChoice.opportunityId,
  sourcePlayerId: input.targetChoice.sourcePlayerId,
  sourceSeatNumber: input.targetChoice.sourceSeatNumber,
  sourceCharacterStateRevision: input.targetChoice.sourceCharacterStateRevision,
  targetPlayerId: input.targetChoice.targetPlayerId,
  targetSeatNumber: input.targetChoice.targetSeatNumber,
  outcomeType: "NON_DEMON_TARGET_NO_SWAP"
});

export const createSnakeCharmerNoSwapScheduledTaskSettlement = (input: {
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): ScheduledTaskSettlement => ({
  taskId: input.taskId,
  taskType: "SNAKE_CHARMER_ACTION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "SNAKE_CHARMER_NON_DEMON_NO_SWAP",
  characterStateRevision: input.characterStateRevision
});

export const validateSnakeCharmerTargetChosenPayload = (
  payload: unknown,
  input: SnakeCharmerActionInput
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, SNAKE_CHARMER_TARGET_CHOSEN_PAYLOAD_KEYS)) {
    return fail("SnakeCharmerTargetChosen payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    payload.taskType !== "SNAKE_CHARMER_ACTION" ||
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
    return fail("SnakeCharmerTargetChosen fields must use supported primitive values");
  }

  const sourceValidation = validateSnakeCharmerTaskSource(input);
  if (!sourceValidation.valid) {
    return sourceValidation;
  }

  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, payload.opportunityId as ActionOpportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    opportunity.opportunityKind !== "SNAKE_CHARMER_FIRST_NIGHT_ACTION" ||
    opportunity.taskId !== payload.taskId ||
    opportunity.taskId !== input.taskId ||
    opportunity.taskType !== payload.taskType ||
    opportunity.sourcePlayerId !== payload.sourcePlayerId ||
    opportunity.sourceSeatNumber !== payload.sourceSeatNumber ||
    !sameRoleSetupSnapshot(opportunity.sourceRole, payload.sourceRole) ||
    opportunity.sourceCharacterStateRevision !== payload.sourceCharacterStateRevision
  ) {
    return fail("SnakeCharmerTargetChosen must match the referenced Snake Charmer action opportunity");
  }

  const target = targetRosterEntry(input.roster, payload.targetPlayerId as PlayerId);
  const targetState = input.currentCharacterState.entries.find((entry) => entry.playerId === payload.targetPlayerId);
  if (
    target === undefined ||
    targetState === undefined ||
    target.seatNumber !== payload.targetSeatNumber ||
    targetState.seatNumber !== payload.targetSeatNumber
  ) {
    return fail("SnakeCharmerTargetChosen target must exist in roster and current character state");
  }

  const expected = createSnakeCharmerTargetChosenPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    taskId: input.taskId,
    opportunityId: payload.opportunityId as ActionOpportunityId,
    targetPlayerId: payload.targetPlayerId as PlayerId,
    firstNightActionOpportunities: input.firstNightActionOpportunities,
    roster: input.roster
  });
  const candidate = payload as unknown as SnakeCharmerTargetChosenPayload;
  if (
    candidate.taskId !== expected.taskId ||
    candidate.taskType !== expected.taskType ||
    candidate.opportunityId !== expected.opportunityId ||
    candidate.decisionKind !== expected.decisionKind ||
    candidate.sourcePlayerId !== expected.sourcePlayerId ||
    candidate.sourceSeatNumber !== expected.sourceSeatNumber ||
    !sameRoleSetupSnapshot(candidate.sourceRole, expected.sourceRole) ||
    candidate.sourceCharacterStateRevision !== expected.sourceCharacterStateRevision ||
    candidate.targetPlayerId !== expected.targetPlayerId ||
    candidate.targetSeatNumber !== expected.targetSeatNumber
  ) {
    return fail("SnakeCharmerTargetChosen must match the open opportunity and target roster entry");
  }

  return { valid: true };
};

export const validateSnakeCharmerNoSwapResolvedPayload = (
  payload: unknown,
  input: {
    readonly choices: SnakeCharmerTargetChoiceSet | undefined;
    readonly resolutions: SnakeCharmerNoSwapResolutionSet | undefined;
    readonly currentCharacterState: CurrentCharacterStateSet;
    readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  }
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, SNAKE_CHARMER_NO_SWAP_RESOLVED_PAYLOAD_KEYS)) {
    return fail("SnakeCharmerNoSwapResolved payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    payload.taskType !== "SNAKE_CHARMER_ACTION" ||
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
    payload.outcomeType !== "NON_DEMON_TARGET_NO_SWAP"
  ) {
    return fail("SnakeCharmerNoSwapResolved fields must use supported primitive values");
  }

  if (
    input.resolutions?.resolutions.some((resolution) =>
      resolution.taskId === payload.taskId &&
      resolution.opportunityId === payload.opportunityId
    ) === true
  ) {
    return fail("SnakeCharmerNoSwapResolved cannot resolve the same opportunity twice");
  }

  const choice = findTargetChoice(input.choices, {
    taskId: payload.taskId as ScheduledTaskId,
    opportunityId: payload.opportunityId as ActionOpportunityId,
    targetPlayerId: payload.targetPlayerId as PlayerId
  });
  if (choice === undefined) {
    return fail("SnakeCharmerNoSwapResolved must follow a matching SnakeCharmerTargetChosen event");
  }

  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, choice.opportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    opportunity.opportunityKind !== "SNAKE_CHARMER_FIRST_NIGHT_ACTION" ||
    opportunity.taskId !== choice.taskId
  ) {
    return fail("SnakeCharmerNoSwapResolved must close a matching OPEN Snake Charmer action opportunity");
  }

  const targetState = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === choice.targetPlayerId &&
    entry.seatNumber === choice.targetSeatNumber
  );
  if (targetState === undefined) {
    return fail("SnakeCharmerNoSwapResolved target must still exist in current character state");
  }

  if (targetState.role.characterType === "DEMON") {
    return fail("SnakeCharmerNoSwapResolved cannot resolve no-swap for a Demon target");
  }

  const expected = createSnakeCharmerNoSwapResolvedPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    targetChoice: choice
  });
  const candidate = payload as unknown as SnakeCharmerNoSwapResolvedPayload;
  if (
    candidate.taskId !== expected.taskId ||
    candidate.taskType !== expected.taskType ||
    candidate.opportunityId !== expected.opportunityId ||
    candidate.sourcePlayerId !== expected.sourcePlayerId ||
    candidate.sourceSeatNumber !== expected.sourceSeatNumber ||
    candidate.sourceCharacterStateRevision !== expected.sourceCharacterStateRevision ||
    candidate.targetPlayerId !== expected.targetPlayerId ||
    candidate.targetSeatNumber !== expected.targetSeatNumber ||
    candidate.outcomeType !== expected.outcomeType
  ) {
    return fail("SnakeCharmerNoSwapResolved must match the preceding target choice");
  }

  return { valid: true };
};

export const appendSnakeCharmerTargetChoice = (
  state: SnakeCharmerTargetChoiceSet | undefined,
  payload: SnakeCharmerTargetChosenPayload
): SnakeCharmerTargetChoiceSet => ({
  choices: [...cloneSnakeCharmerTargetChoiceSet(state).choices, cloneTargetChoice(payload)]
});

export const appendSnakeCharmerNoSwapResolution = (
  state: SnakeCharmerNoSwapResolutionSet | undefined,
  payload: SnakeCharmerNoSwapResolvedPayload
): SnakeCharmerNoSwapResolutionSet => ({
  resolutions: [...cloneSnakeCharmerNoSwapResolutionSet(state).resolutions, cloneNoSwapResolution(payload)]
});

export const hasSnakeCharmerNoSwapResolutionForSettlement = (
  resolutions: SnakeCharmerNoSwapResolutionSet | undefined,
  settlement: Pick<ScheduledTaskSettlement, "taskId" | "taskType" | "characterStateRevision">
): boolean =>
  settlement.taskType === "SNAKE_CHARMER_ACTION" &&
  settlement.characterStateRevision > 0 &&
  (resolutions?.resolutions.some((resolution) =>
    resolution.taskId === settlement.taskId &&
    resolution.taskType === settlement.taskType &&
    resolution.sourceCharacterStateRevision === settlement.characterStateRevision &&
    resolution.outcomeType === "NON_DEMON_TARGET_NO_SWAP"
  ) ?? false);
