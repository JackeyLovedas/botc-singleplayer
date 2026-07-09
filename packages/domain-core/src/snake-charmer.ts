import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CurrentCharacterState, CurrentCharacterStateSet } from "./current-character-state.js";
import { hasExactCurrentCharacterStateShape } from "./current-character-state.js";
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
import {
  hasExactEnumerableKeys,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord
} from "./initial-private-knowledge.js";
import type { AbilityImpairmentId, ActionOpportunityId, PlayerId, ScheduledTaskId } from "./ids.js";
import { abilityImpairmentId } from "./ids.js";
import type { AbilityImpairmentSet, SnakeCharmerPoisonedAbilityImpairmentAppliedPayload } from "./philosopher-ability.js";
import type { PlayerRoster, SeatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";

export type SnakeCharmerActionDecision = {
  readonly kind: "CHOOSE_PLAYER";
  readonly targetPlayerId: PlayerId;
};

export type SnakeCharmerNoSwapOutcomeType = "NON_DEMON_TARGET_NO_SWAP";
export type SnakeCharmerIneffectiveReason = "SOURCE_DRUNK" | "SOURCE_POISONED";

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

export type SnakeCharmerDemonSwapReason = "SNAKE_CHARMER_DEMON_HIT";

export type SnakeCharmerDemonSwapAppliedPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SNAKE_CHARMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly previousCharacterStateRevision: number;
  readonly nextCharacterStateRevision: number;
  readonly sourceBefore: CurrentCharacterState;
  readonly targetBefore: CurrentCharacterState;
  readonly sourceAfter: CurrentCharacterState;
  readonly targetAfter: CurrentCharacterState;
  readonly swapReason: SnakeCharmerDemonSwapReason;
};

export type SnakeCharmerTargetChoiceSet = {
  readonly choices: readonly SnakeCharmerTargetChosenPayload[];
};

export type SnakeCharmerNoSwapResolutionSet = {
  readonly resolutions: readonly SnakeCharmerNoSwapResolvedPayload[];
};

export type SnakeCharmerDemonSwapSet = {
  readonly swaps: readonly SnakeCharmerDemonSwapAppliedPayload[];
};

export type SnakeCharmerEffectivenessResult =
  | {
      readonly effective: true;
    }
  | {
      readonly effective: false;
      readonly reason: SnakeCharmerIneffectiveReason;
      readonly impairmentId: AbilityImpairmentId;
      readonly impairmentKind: "DRUNK" | "POISONED";
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
const SNAKE_CHARMER_DEMON_SWAP_APPLIED_PAYLOAD_KEYS = [
  "nextCharacterStateRevision",
  "nightNumber",
  "opportunityId",
  "previousCharacterStateRevision",
  "rulesBaselineVersion",
  "sourceAfter",
  "sourceBefore",
  "sourcePlayerId",
  "sourceSeatNumber",
  "swapReason",
  "targetAfter",
  "targetBefore",
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

const cloneCurrentStateEntry = (entry: CurrentCharacterState): CurrentCharacterState => ({
  playerId: entry.playerId,
  seatNumber: entry.seatNumber,
  role: cloneRoleSetupSnapshot(entry.role),
  currentAlignment: entry.currentAlignment
});

const cloneDemonSwap = (swap: SnakeCharmerDemonSwapAppliedPayload): SnakeCharmerDemonSwapAppliedPayload => ({
  rulesBaselineVersion: swap.rulesBaselineVersion,
  nightNumber: swap.nightNumber,
  taskId: swap.taskId,
  taskType: swap.taskType,
  opportunityId: swap.opportunityId,
  sourcePlayerId: swap.sourcePlayerId,
  sourceSeatNumber: swap.sourceSeatNumber,
  targetPlayerId: swap.targetPlayerId,
  targetSeatNumber: swap.targetSeatNumber,
  previousCharacterStateRevision: swap.previousCharacterStateRevision,
  nextCharacterStateRevision: swap.nextCharacterStateRevision,
  sourceBefore: cloneCurrentStateEntry(swap.sourceBefore),
  targetBefore: cloneCurrentStateEntry(swap.targetBefore),
  sourceAfter: cloneCurrentStateEntry(swap.sourceAfter),
  targetAfter: cloneCurrentStateEntry(swap.targetAfter),
  swapReason: swap.swapReason
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

export const cloneSnakeCharmerDemonSwapSet = (
  state: SnakeCharmerDemonSwapSet | undefined
): SnakeCharmerDemonSwapSet => ({
  swaps: state?.swaps.map(cloneDemonSwap) ?? []
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
  if (targetTask.taskType !== "SNAKE_CHARMER_ACTION") {
    return fail("Snake Charmer action requires a Snake Charmer action task");
  }

  if (source.kind === "ROLE") {
    const currentSource = input.currentCharacterState.entries.find((entry) =>
      entry.playerId === source.playerId &&
      entry.seatNumber === source.seatNumber
    );
    if (
      source.role.roleId !== SNAKE_CHARMER_ROLE_ID ||
      currentSource === undefined ||
      currentSource.role.roleId !== SNAKE_CHARMER_ROLE_ID ||
      !sameRoleSetupSnapshot(currentSource.role, source.role)
    ) {
      return fail("Snake Charmer action source is no longer the same current Snake Charmer state");
    }

    return { valid: true };
  }

  if (
    source.kind !== "PHILOSOPHER_GAINED_ABILITY" ||
    source.sourceRole.roleId !== PHILOSOPHER_ROLE_ID ||
    source.chosenRole.roleId !== SNAKE_CHARMER_ROLE_ID ||
    source.sourceCharacterStateRevision !== input.currentCharacterState.revision
  ) {
    return fail("Snake Charmer action requires a base Snake Charmer or Philosopher gained snake_charmer task source");
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

const findCurrentCharacterStateEntry = (
  currentCharacterState: CurrentCharacterStateSet,
  playerId: PlayerId,
  seatNumber: SeatNumber
): CurrentCharacterState | undefined =>
  currentCharacterState.entries.find((entry) => entry.playerId === playerId && entry.seatNumber === seatNumber);

export const createSnakeCharmerDemonSwapAppliedPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: SnakeCharmerTargetChosenPayload;
  readonly currentCharacterState: CurrentCharacterStateSet;
}): SnakeCharmerDemonSwapAppliedPayload => {
  const sourceBefore = findCurrentCharacterStateEntry(
    input.currentCharacterState,
    input.targetChoice.sourcePlayerId,
    input.targetChoice.sourceSeatNumber
  );
  const targetBefore = findCurrentCharacterStateEntry(
    input.currentCharacterState,
    input.targetChoice.targetPlayerId,
    input.targetChoice.targetSeatNumber
  );

  if (sourceBefore === undefined || targetBefore === undefined) {
    throw new DomainError("InvalidSnakeCharmerDemonSwapAppliedPayload", "SnakeCharmerDemonSwapApplied requires current source and target entries");
  }

  if (targetBefore.role.characterType !== "DEMON") {
    throw new DomainError("InvalidSnakeCharmerDemonSwapAppliedPayload", "SnakeCharmerDemonSwapApplied requires a Demon target");
  }

  const previousCharacterStateRevision = input.currentCharacterState.revision;
  const nextCharacterStateRevision = previousCharacterStateRevision + 1;
  const sourceAfter: CurrentCharacterState = {
    playerId: sourceBefore.playerId,
    seatNumber: sourceBefore.seatNumber,
    role: cloneRoleSetupSnapshot(targetBefore.role),
    currentAlignment: targetBefore.currentAlignment
  };
  const targetAfter: CurrentCharacterState = {
    playerId: targetBefore.playerId,
    seatNumber: targetBefore.seatNumber,
    role: cloneRoleSetupSnapshot(sourceBefore.role),
    currentAlignment: sourceBefore.currentAlignment
  };

  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    nightNumber: 1,
    taskId: input.targetChoice.taskId,
    taskType: input.targetChoice.taskType,
    opportunityId: input.targetChoice.opportunityId,
    sourcePlayerId: input.targetChoice.sourcePlayerId,
    sourceSeatNumber: input.targetChoice.sourceSeatNumber,
    targetPlayerId: input.targetChoice.targetPlayerId,
    targetSeatNumber: input.targetChoice.targetSeatNumber,
    previousCharacterStateRevision,
    nextCharacterStateRevision,
    sourceBefore: cloneCurrentStateEntry(sourceBefore),
    targetBefore: cloneCurrentStateEntry(targetBefore),
    sourceAfter,
    targetAfter,
    swapReason: "SNAKE_CHARMER_DEMON_HIT"
  };
};

export const formatSnakeCharmerPoisonImpairmentId = (input: {
  readonly sourceSeatNumber: SeatNumber;
  readonly affectedSeatNumber: SeatNumber;
  readonly nextCharacterStateRevision: number;
}): AbilityImpairmentId =>
  abilityImpairmentId(
    `ability-impairment-v1:SNAKE_CHARMER_DEMON_HIT:seat-${String(input.sourceSeatNumber).padStart(2, "0")}:poisons-seat-${String(
      input.affectedSeatNumber
    ).padStart(2, "0")}:revision-${String(input.nextCharacterStateRevision).padStart(2, "0")}`
  );

export const createSnakeCharmerPoisonedImpairmentPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly swap: SnakeCharmerDemonSwapAppliedPayload;
}): SnakeCharmerPoisonedAbilityImpairmentAppliedPayload => ({
  rulesBaselineVersion: input.rulesBaselineVersion,
  impairmentId: formatSnakeCharmerPoisonImpairmentId({
    sourceSeatNumber: input.swap.sourceSeatNumber,
    affectedSeatNumber: input.swap.targetSeatNumber,
    nextCharacterStateRevision: input.swap.nextCharacterStateRevision
  }),
  kind: "POISONED",
  sourceKind: "SNAKE_CHARMER_DEMON_HIT",
  sourcePlayerId: input.swap.sourcePlayerId,
  affectedPlayerId: input.swap.targetPlayerId,
  affectedSeatNumber: input.swap.targetSeatNumber,
  affectedRole: cloneRoleSetupSnapshot(input.swap.targetAfter.role),
  sourceCharacterStateRevision: input.swap.nextCharacterStateRevision
});

export const createSnakeCharmerDemonHitScheduledTaskSettlement = (input: {
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): ScheduledTaskSettlement => ({
  taskId: input.taskId,
  taskType: "SNAKE_CHARMER_ACTION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "SNAKE_CHARMER_DEMON_HIT_SWAP",
  characterStateRevision: input.characterStateRevision
});

export const evaluateSnakeCharmerEffectiveness = (input: {
  readonly sourcePlayerId: PlayerId;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): SnakeCharmerEffectivenessResult => {
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

const findTargetChoiceForDemonSwap = (
  state: SnakeCharmerTargetChoiceSet | undefined,
  payload: Pick<SnakeCharmerDemonSwapAppliedPayload, "taskId" | "opportunityId" | "targetPlayerId">
): SnakeCharmerTargetChosenPayload | undefined =>
  state?.choices.find((choice) =>
    choice.taskId === payload.taskId &&
    choice.opportunityId === payload.opportunityId &&
    choice.targetPlayerId === payload.targetPlayerId
  );

const sameCurrentStateEntry = (left: CurrentCharacterState, right: CurrentCharacterState): boolean =>
  left.playerId === right.playerId &&
  left.seatNumber === right.seatNumber &&
  left.currentAlignment === right.currentAlignment &&
  sameRoleSetupSnapshot(left.role, right.role);

export const validateSnakeCharmerDemonSwapAppliedPayload = (
  payload: unknown,
  input: {
    readonly choices: SnakeCharmerTargetChoiceSet | undefined;
    readonly swaps: SnakeCharmerDemonSwapSet | undefined;
    readonly currentCharacterState: CurrentCharacterStateSet;
    readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  }
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, SNAKE_CHARMER_DEMON_SWAP_APPLIED_PAYLOAD_KEYS)) {
    return fail("SnakeCharmerDemonSwapApplied payload must have exact runtime shape");
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
    typeof payload.targetPlayerId !== "string" ||
    payload.targetPlayerId.trim().length === 0 ||
    typeof payload.targetSeatNumber !== "number" ||
    !Number.isInteger(payload.targetSeatNumber) ||
    payload.targetSeatNumber < 1 ||
    payload.targetSeatNumber > 12 ||
    typeof payload.previousCharacterStateRevision !== "number" ||
    !Number.isInteger(payload.previousCharacterStateRevision) ||
    payload.previousCharacterStateRevision <= 0 ||
    typeof payload.nextCharacterStateRevision !== "number" ||
    !Number.isInteger(payload.nextCharacterStateRevision) ||
    payload.nextCharacterStateRevision !== payload.previousCharacterStateRevision + 1 ||
    !hasExactCurrentCharacterStateShape(payload.sourceBefore) ||
    !hasExactCurrentCharacterStateShape(payload.targetBefore) ||
    !hasExactCurrentCharacterStateShape(payload.sourceAfter) ||
    !hasExactCurrentCharacterStateShape(payload.targetAfter) ||
    payload.swapReason !== "SNAKE_CHARMER_DEMON_HIT"
  ) {
    return fail("SnakeCharmerDemonSwapApplied fields must use supported primitive values");
  }

  if (
    input.swaps?.swaps.some((swap) =>
      swap.taskId === payload.taskId &&
      swap.opportunityId === payload.opportunityId
    ) === true
  ) {
    return fail("SnakeCharmerDemonSwapApplied cannot resolve the same opportunity twice");
  }

  const choice = findTargetChoiceForDemonSwap(input.choices, {
    taskId: payload.taskId as ScheduledTaskId,
    opportunityId: payload.opportunityId as ActionOpportunityId,
    targetPlayerId: payload.targetPlayerId as PlayerId
  });
  if (choice === undefined) {
    return fail("SnakeCharmerDemonSwapApplied must follow a matching SnakeCharmerTargetChosen event");
  }

  const opportunity = findFirstNightActionOpportunityById(input.firstNightActionOpportunities, choice.opportunityId);
  if (
    opportunity === undefined ||
    opportunity.opportunityStatus !== "OPEN" ||
    opportunity.opportunityKind !== "SNAKE_CHARMER_FIRST_NIGHT_ACTION" ||
    opportunity.taskId !== choice.taskId
  ) {
    return fail("SnakeCharmerDemonSwapApplied must close a matching OPEN Snake Charmer action opportunity");
  }

  if (payload.previousCharacterStateRevision !== input.currentCharacterState.revision) {
    return fail("SnakeCharmerDemonSwapApplied previous revision must match current character state revision");
  }

  const expected = createSnakeCharmerDemonSwapAppliedPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    targetChoice: choice,
    currentCharacterState: input.currentCharacterState
  });
  const candidate = payload as unknown as SnakeCharmerDemonSwapAppliedPayload;
  if (
    candidate.taskId !== expected.taskId ||
    candidate.taskType !== expected.taskType ||
    candidate.opportunityId !== expected.opportunityId ||
    candidate.sourcePlayerId !== expected.sourcePlayerId ||
    candidate.sourceSeatNumber !== expected.sourceSeatNumber ||
    candidate.targetPlayerId !== expected.targetPlayerId ||
    candidate.targetSeatNumber !== expected.targetSeatNumber ||
    candidate.previousCharacterStateRevision !== expected.previousCharacterStateRevision ||
    candidate.nextCharacterStateRevision !== expected.nextCharacterStateRevision ||
    !sameCurrentStateEntry(candidate.sourceBefore, expected.sourceBefore) ||
    !sameCurrentStateEntry(candidate.targetBefore, expected.targetBefore) ||
    !sameCurrentStateEntry(candidate.sourceAfter, expected.sourceAfter) ||
    !sameCurrentStateEntry(candidate.targetAfter, expected.targetAfter) ||
    candidate.swapReason !== expected.swapReason
  ) {
    return fail("SnakeCharmerDemonSwapApplied must match the current Demon target swap");
  }

  return { valid: true };
};

export const applySnakeCharmerDemonSwapToCurrentCharacterState = (
  currentCharacterState: CurrentCharacterStateSet,
  payload: SnakeCharmerDemonSwapAppliedPayload
): CurrentCharacterStateSet => ({
  revision: payload.nextCharacterStateRevision,
  entries: currentCharacterState.entries
    .map((entry) => {
      if (entry.playerId === payload.sourcePlayerId) {
        return cloneCurrentStateEntry(payload.sourceAfter);
      }

      if (entry.playerId === payload.targetPlayerId) {
        return cloneCurrentStateEntry(payload.targetAfter);
      }

      return cloneCurrentStateEntry(entry);
    })
    .sort((left, right) => left.seatNumber - right.seatNumber)
});

export const validateSnakeCharmerPoisonedImpairmentPayload = (
  payload: SnakeCharmerPoisonedAbilityImpairmentAppliedPayload,
  input: {
    readonly swaps: SnakeCharmerDemonSwapSet | undefined;
  }
): ValidationResult => {
  const swap = input.swaps?.swaps.find((candidate) =>
    candidate.sourcePlayerId === payload.sourcePlayerId &&
    candidate.targetPlayerId === payload.affectedPlayerId &&
    candidate.targetSeatNumber === payload.affectedSeatNumber &&
    candidate.nextCharacterStateRevision === payload.sourceCharacterStateRevision
  );
  if (swap === undefined) {
    return fail("Snake Charmer poisoned impairment must follow a matching Demon swap");
  }

  const expected = createSnakeCharmerPoisonedImpairmentPayload({
    rulesBaselineVersion: payload.rulesBaselineVersion,
    swap
  });
  if (
    payload.impairmentId !== expected.impairmentId ||
    payload.kind !== expected.kind ||
    payload.sourceKind !== expected.sourceKind ||
    payload.sourcePlayerId !== expected.sourcePlayerId ||
    payload.affectedPlayerId !== expected.affectedPlayerId ||
    payload.affectedSeatNumber !== expected.affectedSeatNumber ||
    !sameRoleSetupSnapshot(payload.affectedRole, expected.affectedRole) ||
    payload.sourceCharacterStateRevision !== expected.sourceCharacterStateRevision
  ) {
    return fail("Snake Charmer poisoned impairment must match the old Demon after swap");
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

export const appendSnakeCharmerDemonSwap = (
  state: SnakeCharmerDemonSwapSet | undefined,
  payload: SnakeCharmerDemonSwapAppliedPayload
): SnakeCharmerDemonSwapSet => ({
  swaps: [...cloneSnakeCharmerDemonSwapSet(state).swaps, cloneDemonSwap(payload)]
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

export const hasSnakeCharmerDemonSwapForSettlement = (
  swaps: SnakeCharmerDemonSwapSet | undefined,
  settlement: Pick<ScheduledTaskSettlement, "taskId" | "taskType" | "characterStateRevision" | "outcomeType">
): boolean =>
  settlement.taskType === "SNAKE_CHARMER_ACTION" &&
  settlement.outcomeType === "SNAKE_CHARMER_DEMON_HIT_SWAP" &&
  (swaps?.swaps.some((swap) =>
    swap.taskId === settlement.taskId &&
    swap.taskType === settlement.taskType &&
    swap.nextCharacterStateRevision === settlement.characterStateRevision
  ) ?? false);
