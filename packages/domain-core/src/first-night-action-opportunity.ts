import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import { DomainError } from "./errors.js";
import {
  SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  getNextUnsettledFirstNightTask,
  isFirstNightTaskSettled
} from "./first-night-task-plan.js";
import type {
  FirstNightTaskPlan,
  FirstNightTaskProgress,
  FirstNightTaskType,
  ScheduledTask,
  ScheduledTaskSettlement
} from "./first-night-task-plan.js";
import { actionOpportunityId } from "./ids.js";
import type { ActionOpportunityId, PlayerId, RoleId, ScheduledTaskId } from "./ids.js";
import {
  hasExactEnumerableKeys,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord
} from "./initial-private-knowledge.js";
import type { SeatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";

export type ActionOpportunityStatus = "OPEN" | "CLOSED";
export type ActionOpportunityKind = "PHILOSOPHER_FIRST_NIGHT_ACTION" | "SNAKE_CHARMER_FIRST_NIGHT_ACTION";
export type PhilosopherActionDecisionKind = "DEFER" | "CHOOSE_GOOD_CHARACTER";
export type SnakeCharmerActionDecisionKind = "CHOOSE_PLAYER";

export type PhilosopherActionDecision =
  | {
      readonly kind: "DEFER";
    }
  | {
      readonly kind: "CHOOSE_GOOD_CHARACTER";
      readonly roleId: RoleId;
    };

export type PhilosopherActionOpportunityVisibility = {
  readonly canDefer: true;
  readonly supportedDecisionKinds: readonly ["DEFER", "CHOOSE_GOOD_CHARACTER"];
  readonly futureUnsupportedDecisionKinds: readonly [];
};

export type SnakeCharmerActionOpportunityVisibility = {
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly targetSchema: "ANY_LIVING_PLAYER";
};

export type ActionOpportunityVisibility =
  | PhilosopherActionOpportunityVisibility
  | SnakeCharmerActionOpportunityVisibility;

export type PhilosopherActionOpportunitySource = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: "PHILOSOPHER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
};

export type SnakeCharmerActionOpportunitySource = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SNAKE_CHARMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
};

export type PhilosopherActionOpportunity = PhilosopherActionOpportunitySource & {
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly visibility: PhilosopherActionOpportunityVisibility;
};

export type SnakeCharmerActionOpportunity = SnakeCharmerActionOpportunitySource & {
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly visibility: SnakeCharmerActionOpportunityVisibility;
};

export type FirstNightActionOpportunity = PhilosopherActionOpportunity | SnakeCharmerActionOpportunity;

export type FirstNightActionOpportunityState = {
  readonly opportunities: readonly FirstNightActionOpportunity[];
};

export type FirstNightActionOpportunityCreatedPayload = FirstNightActionOpportunity & {
  readonly rulesBaselineVersion: string;
};

export type PhilosopherActionDeferredPayload = PhilosopherActionOpportunitySource & {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly decisionKind: "DEFER";
};

type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

type OpportunityValidationInput = {
  readonly taskId: ScheduledTaskId;
  readonly firstNightTaskPlan: Pick<FirstNightTaskPlan, "tasks">;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
};

type CreateOpportunityResult =
  | { readonly valid: true; readonly opportunity: FirstNightActionOpportunity }
  | { readonly valid: false; readonly reason: string };
type CreatePhilosopherOpportunityResult =
  | { readonly valid: true; readonly opportunity: PhilosopherActionOpportunity }
  | { readonly valid: false; readonly reason: string };
type CreateSnakeCharmerOpportunityResult =
  | { readonly valid: true; readonly opportunity: SnakeCharmerActionOpportunity }
  | { readonly valid: false; readonly reason: string };

const PHILOSOPHER_ACTION_OPPORTUNITY_VISIBILITY_KEYS = [
  "canDefer",
  "futureUnsupportedDecisionKinds",
  "supportedDecisionKinds"
] as const;
const SNAKE_CHARMER_ACTION_OPPORTUNITY_VISIBILITY_KEYS = [
  "canChooseTarget",
  "supportedDecisionKinds",
  "targetSchema"
] as const;
const FIRST_NIGHT_ACTION_OPPORTUNITY_KEYS = [
  "nightNumber",
  "opportunityId",
  "opportunityKind",
  "opportunityStatus",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "taskId",
  "taskType",
  "visibility"
] as const;
const FIRST_NIGHT_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS = [
  "nightNumber",
  "opportunityId",
  "opportunityKind",
  "opportunityStatus",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "taskId",
  "taskType",
  "visibility"
] as const;
const PHILOSOPHER_ACTION_DEFERRED_PAYLOAD_KEYS = [
  "decisionKind",
  "nightNumber",
  "opportunityId",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "taskId",
  "taskType"
] as const;

const PHILOSOPHER_ROLE_ID = "philosopher" as RoleId;
const SNAKE_CHARMER_ROLE_ID = "snake_charmer" as RoleId;
const FIRST_NIGHT_ACTION_OPPORTUNITY_ID_PATTERN =
  /^first-night-v1:(?:(PHILOSOPHER_ACTION|SNAKE_CHARMER_ACTION):seat-(0[1-9]|1[0-2]):opportunity-(0[1-9][0-9]*)|PHILOSOPHER_GAINED:(SNAKE_CHARMER_ACTION):seat-(0[1-9]|1[0-2]):from-snake_charmer:opportunity-(0[1-9][0-9]*))$/;

const fail = (reason: string): ValidationResult => ({ valid: false, reason });

const createPhilosopherActionOpportunityVisibility = (): PhilosopherActionOpportunityVisibility => ({
  canDefer: true,
  supportedDecisionKinds: ["DEFER", "CHOOSE_GOOD_CHARACTER"],
  futureUnsupportedDecisionKinds: []
});

const createSnakeCharmerActionOpportunityVisibility = (): SnakeCharmerActionOpportunityVisibility => ({
  canChooseTarget: true,
  supportedDecisionKinds: ["CHOOSE_PLAYER"],
  targetSchema: "ANY_LIVING_PLAYER"
});

const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      return false;
    }
  }

  return true;
};

const hasExactPhilosopherActionOpportunityVisibilityShape = (value: unknown): value is PhilosopherActionOpportunityVisibility =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, PHILOSOPHER_ACTION_OPPORTUNITY_VISIBILITY_KEYS) &&
  value.canDefer === true &&
  Array.isArray(value.supportedDecisionKinds) &&
  isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 2 &&
  value.supportedDecisionKinds[0] === "DEFER" &&
  value.supportedDecisionKinds[1] === "CHOOSE_GOOD_CHARACTER" &&
  Array.isArray(value.futureUnsupportedDecisionKinds) &&
  isDenseArray(value.futureUnsupportedDecisionKinds) &&
  value.futureUnsupportedDecisionKinds.length === 0;

const hasExactSnakeCharmerActionOpportunityVisibilityShape = (value: unknown): value is SnakeCharmerActionOpportunityVisibility =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, SNAKE_CHARMER_ACTION_OPPORTUNITY_VISIBILITY_KEYS) &&
  value.canChooseTarget === true &&
  Array.isArray(value.supportedDecisionKinds) &&
  isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 1 &&
  value.supportedDecisionKinds[0] === "CHOOSE_PLAYER" &&
  value.targetSchema === "ANY_LIVING_PLAYER";

const hasExactFirstNightActionOpportunityShape = (value: unknown): value is FirstNightActionOpportunity => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, FIRST_NIGHT_ACTION_OPPORTUNITY_KEYS)) {
    return false;
  }

  const commonFieldsValid =
    value.nightNumber === 1 &&
    typeof value.opportunityId === "string" &&
    parseFirstNightActionOpportunityId(actionOpportunityId(value.opportunityId)).valid &&
    (value.opportunityStatus === "OPEN" || value.opportunityStatus === "CLOSED") &&
    typeof value.taskId === "string" &&
    value.taskId.trim().length > 0 &&
    typeof value.sourcePlayerId === "string" &&
    value.sourcePlayerId.trim().length > 0 &&
    typeof value.sourceSeatNumber === "number" &&
    Number.isInteger(value.sourceSeatNumber) &&
    value.sourceSeatNumber >= 1 &&
    value.sourceSeatNumber <= 12 &&
    hasExactRoleSetupSnapshotShape(value.sourceRole) &&
    typeof value.sourceCharacterStateRevision === "number" &&
    Number.isInteger(value.sourceCharacterStateRevision) &&
    value.sourceCharacterStateRevision > 0;
  if (!commonFieldsValid) {
    return false;
  }

  const parsedId = parseFirstNightActionOpportunityId(actionOpportunityId(value.opportunityId as string));
  if (!parsedId.valid) {
    return false;
  }

  if (value.opportunityKind === "PHILOSOPHER_FIRST_NIGHT_ACTION") {
    return (
      value.taskType === "PHILOSOPHER_ACTION" &&
      parsedId.taskType === "PHILOSOPHER_ACTION" &&
      hasExactPhilosopherActionOpportunityVisibilityShape(value.visibility)
    );
  }

  if (value.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION") {
    return (
      value.taskType === "SNAKE_CHARMER_ACTION" &&
      parsedId.taskType === "SNAKE_CHARMER_ACTION" &&
      hasExactSnakeCharmerActionOpportunityVisibilityShape(value.visibility)
    );
  }

  return false;
};

const cloneVisibility = (visibility: ActionOpportunityVisibility): ActionOpportunityVisibility => ({
  ...(
    "canDefer" in visibility
      ? {
        canDefer: visibility.canDefer,
        supportedDecisionKinds: ["DEFER", "CHOOSE_GOOD_CHARACTER"] as const,
        futureUnsupportedDecisionKinds: []
      }
      : {
        canChooseTarget: visibility.canChooseTarget,
        supportedDecisionKinds: ["CHOOSE_PLAYER"] as const,
        targetSchema: visibility.targetSchema
      }
  )
});

const sameVisibility = (left: ActionOpportunityVisibility, right: ActionOpportunityVisibility): boolean => {
  if ("canDefer" in left || "canDefer" in right) {
    return "canDefer" in left &&
      "canDefer" in right &&
      left.canDefer === right.canDefer &&
      left.supportedDecisionKinds.length === 2 &&
      right.supportedDecisionKinds.length === 2 &&
      left.supportedDecisionKinds[0] === right.supportedDecisionKinds[0] &&
      left.supportedDecisionKinds[1] === right.supportedDecisionKinds[1] &&
      left.futureUnsupportedDecisionKinds.length === 0 &&
      right.futureUnsupportedDecisionKinds.length === 0;
  }

  return left.canChooseTarget === right.canChooseTarget &&
    left.supportedDecisionKinds.length === 1 &&
    right.supportedDecisionKinds.length === 1 &&
    left.supportedDecisionKinds[0] === right.supportedDecisionKinds[0] &&
    left.targetSchema === right.targetSchema;
};

const cloneFirstNightActionOpportunity = (
  opportunity: FirstNightActionOpportunity
): FirstNightActionOpportunity => {
  if (opportunity.opportunityKind === "PHILOSOPHER_FIRST_NIGHT_ACTION") {
    return {
      nightNumber: opportunity.nightNumber,
      opportunityId: opportunity.opportunityId,
      opportunityKind: opportunity.opportunityKind,
      opportunityStatus: opportunity.opportunityStatus,
      taskId: opportunity.taskId,
      taskType: opportunity.taskType,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceSeatNumber: opportunity.sourceSeatNumber,
      sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
      sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
      visibility: cloneVisibility(opportunity.visibility) as PhilosopherActionOpportunityVisibility
    };
  }

  return {
    nightNumber: opportunity.nightNumber,
    opportunityId: opportunity.opportunityId,
    opportunityKind: opportunity.opportunityKind,
    opportunityStatus: opportunity.opportunityStatus,
    taskId: opportunity.taskId,
    taskType: opportunity.taskType,
    sourcePlayerId: opportunity.sourcePlayerId,
    sourceSeatNumber: opportunity.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
    sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
    visibility: cloneVisibility(opportunity.visibility) as SnakeCharmerActionOpportunityVisibility
  };
};

const sameOpportunityCore = (
  left: FirstNightActionOpportunity,
  right: FirstNightActionOpportunity
): boolean =>
  left.nightNumber === right.nightNumber &&
  left.opportunityId === right.opportunityId &&
  left.opportunityKind === right.opportunityKind &&
  left.opportunityStatus === right.opportunityStatus &&
  left.taskId === right.taskId &&
  left.taskType === right.taskType &&
  left.sourcePlayerId === right.sourcePlayerId &&
  left.sourceSeatNumber === right.sourceSeatNumber &&
  sameRoleSetupSnapshot(left.sourceRole, right.sourceRole) &&
  left.sourceCharacterStateRevision === right.sourceCharacterStateRevision &&
  sameVisibility(left.visibility, right.visibility);

const currentPhilosopherEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (
    task.taskType !== "PHILOSOPHER_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    source.kind !== "ROLE" ||
    source.role.roleId !== PHILOSOPHER_ROLE_ID
  ) {
    return undefined;
  }

  const currentEntry = currentCharacterState.entries.find(
    (entry) =>
      entry.playerId === source.playerId &&
      entry.seatNumber === source.seatNumber
  );

  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== PHILOSOPHER_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.role)
  ) {
    return undefined;
  }

  return currentEntry;
};

const currentPhilosopherGainedSnakeCharmerEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (
    task.taskType !== "SNAKE_CHARMER_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    source.kind !== "PHILOSOPHER_GAINED_ABILITY" ||
    source.sourceRole.roleId !== PHILOSOPHER_ROLE_ID ||
    source.chosenRole.roleId !== SNAKE_CHARMER_ROLE_ID ||
    currentCharacterState.revision !== source.sourceCharacterStateRevision
  ) {
    return undefined;
  }

  const currentEntry = currentCharacterState.entries.find(
    (entry) =>
      entry.playerId === source.playerId &&
      entry.seatNumber === source.seatNumber
  );

  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== PHILOSOPHER_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.sourceRole)
  ) {
    return undefined;
  }

  return currentEntry;
};

const currentBaseSnakeCharmerEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (
    task.taskType !== "SNAKE_CHARMER_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    source.kind !== "ROLE" ||
    source.role.roleId !== SNAKE_CHARMER_ROLE_ID
  ) {
    return undefined;
  }

  const currentEntry = currentCharacterState.entries.find(
    (entry) =>
      entry.playerId === source.playerId &&
      entry.seatNumber === source.seatNumber
  );

  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== SNAKE_CHARMER_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.role)
  ) {
    return undefined;
  }

  return currentEntry;
};

export const formatFirstNightActionOpportunityId = (input: {
  readonly taskType: "PHILOSOPHER_ACTION" | "SNAKE_CHARMER_ACTION";
  readonly seatNumber: SeatNumber;
  readonly opportunityIndex?: number;
}): ActionOpportunityId => {
  const index = input.opportunityIndex ?? 1;
  if (!Number.isInteger(input.seatNumber) || input.seatNumber < 1 || input.seatNumber > 12) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", "ActionOpportunityId seat number must be 1 through 12");
  }

  if (!Number.isInteger(index) || index < 1) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", "ActionOpportunityId opportunity index must be positive");
  }

  const seatSegment = String(input.seatNumber).padStart(2, "0");
  const opportunitySegment = String(index).padStart(2, "0");
  return actionOpportunityId(`first-night-v1:${input.taskType}:seat-${seatSegment}:opportunity-${opportunitySegment}`);
};

export const formatPhilosopherGainedSnakeCharmerActionOpportunityId = (input: {
  readonly seatNumber: SeatNumber;
  readonly opportunityIndex?: number;
}): ActionOpportunityId => {
  const index = input.opportunityIndex ?? 1;
  if (!Number.isInteger(input.seatNumber) || input.seatNumber < 1 || input.seatNumber > 12) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", "ActionOpportunityId seat number must be 1 through 12");
  }

  if (!Number.isInteger(index) || index < 1) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", "ActionOpportunityId opportunity index must be positive");
  }

  const seatSegment = String(input.seatNumber).padStart(2, "0");
  const opportunitySegment = String(index).padStart(2, "0");
  return actionOpportunityId(`first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-${seatSegment}:from-snake_charmer:opportunity-${opportunitySegment}`);
};

export const parseFirstNightActionOpportunityId = (
  value: ActionOpportunityId
): {
  readonly valid: true;
  readonly taskType: "PHILOSOPHER_ACTION" | "SNAKE_CHARMER_ACTION";
  readonly seatNumber: SeatNumber;
  readonly opportunityIndex: number;
} | {
  readonly valid: false;
  readonly reason: string;
} => {
  const match = FIRST_NIGHT_ACTION_OPPORTUNITY_ID_PATTERN.exec(value);
  if (match === null) {
    return { valid: false, reason: "ActionOpportunityId must use a supported first-night action opportunity format" };
  }

  const taskType = (match[1] ?? match[4]) as "PHILOSOPHER_ACTION" | "SNAKE_CHARMER_ACTION";
  const seatNumber = Number(match[2] ?? match[5]);
  const opportunityIndex = Number(match[3] ?? match[6]);
  if (
    !Number.isInteger(seatNumber) ||
    seatNumber < 1 ||
    seatNumber > 12 ||
    !Number.isInteger(opportunityIndex) ||
    opportunityIndex < 1
  ) {
    return { valid: false, reason: "ActionOpportunityId contains an unsupported seat or opportunity index" };
  }

  return {
    valid: true,
    taskType,
    seatNumber: seatNumber as SeatNumber,
    opportunityIndex
  };
};

export const cloneFirstNightActionOpportunityState = (
  state: FirstNightActionOpportunityState | undefined
): FirstNightActionOpportunityState => ({
  opportunities: state?.opportunities.map(cloneFirstNightActionOpportunity) ?? []
});

export const findFirstNightActionOpportunityById = (
  state: FirstNightActionOpportunityState | undefined,
  opportunityIdValue: ActionOpportunityId
): FirstNightActionOpportunity | undefined =>
  state?.opportunities.find((opportunity) => opportunity.opportunityId === opportunityIdValue);

export const findFirstNightActionOpportunityForTask = (
  state: FirstNightActionOpportunityState | undefined,
  taskIdValue: ScheduledTaskId
): FirstNightActionOpportunity | undefined =>
  state?.opportunities.find((opportunity) => opportunity.taskId === taskIdValue);

export const createPhilosopherFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): PhilosopherActionOpportunity => {
  const result = tryCreatePhilosopherFirstNightActionOpportunity(input);
  if (!result.valid) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", result.reason);
  }

  return result.opportunity;
};

export const tryCreatePhilosopherFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreatePhilosopherOpportunityResult => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated must reference a task in the first-night task plan" };
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot target a settled task" };
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated must target the current next unsettled task" };
  }

  const currentEntry = currentPhilosopherEntryForTask(targetTask, input.currentCharacterState);
  if (currentEntry === undefined) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated source is no longer a current Philosopher" };
  }

  const existingOpportunity = findFirstNightActionOpportunityForTask(input.firstNightActionOpportunities, targetTask.taskId);
  if (existingOpportunity?.opportunityStatus === "OPEN") {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot create a duplicate open opportunity" };
  }

  if (existingOpportunity?.opportunityStatus === "CLOSED") {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot reopen a closed opportunity" };
  }

  return {
    valid: true,
    opportunity: {
      nightNumber: 1,
      opportunityId: formatFirstNightActionOpportunityId({
        taskType: "PHILOSOPHER_ACTION",
        seatNumber: currentEntry.seatNumber,
        opportunityIndex: 1
      }),
      opportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: targetTask.taskId,
      taskType: "PHILOSOPHER_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: cloneRoleSetupSnapshot(currentEntry.role),
      sourceCharacterStateRevision: input.currentCharacterState.revision,
      visibility: createPhilosopherActionOpportunityVisibility()
    }
  };
};

const validateCommonOpportunityTarget = (
  input: OpportunityValidationInput
): { readonly valid: true; readonly targetTask: ScheduledTask } | { readonly valid: false; readonly reason: string } => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated must reference a task in the first-night task plan" };
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot target a settled task" };
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated must target the current next unsettled task" };
  }

  const existingOpportunity = findFirstNightActionOpportunityForTask(input.firstNightActionOpportunities, targetTask.taskId);
  if (existingOpportunity?.opportunityStatus === "OPEN") {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot create a duplicate open opportunity" };
  }

  if (existingOpportunity?.opportunityStatus === "CLOSED") {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot reopen a closed opportunity" };
  }

  return { valid: true, targetTask };
};

export const tryCreateSnakeCharmerFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreateSnakeCharmerOpportunityResult => {
  const common = validateCommonOpportunityTarget(input);
  if (!common.valid) {
    return common;
  }

  const targetTask = common.targetTask;
  const baseCurrentEntry = currentBaseSnakeCharmerEntryForTask(targetTask, input.currentCharacterState);
  if (baseCurrentEntry !== undefined) {
    return {
      valid: true,
      opportunity: {
        nightNumber: 1,
        opportunityId: formatFirstNightActionOpportunityId({
          taskType: "SNAKE_CHARMER_ACTION",
          seatNumber: baseCurrentEntry.seatNumber,
          opportunityIndex: 1
        }),
        opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION",
        opportunityStatus: "OPEN",
        taskId: targetTask.taskId,
        taskType: "SNAKE_CHARMER_ACTION",
        sourcePlayerId: baseCurrentEntry.playerId,
        sourceSeatNumber: baseCurrentEntry.seatNumber,
        sourceRole: cloneRoleSetupSnapshot(baseCurrentEntry.role),
        sourceCharacterStateRevision: input.currentCharacterState.revision,
        visibility: createSnakeCharmerActionOpportunityVisibility()
      }
    };
  }

  const currentEntry = currentPhilosopherGainedSnakeCharmerEntryForTask(targetTask, input.currentCharacterState);
  if (currentEntry === undefined) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated source is not a current Snake Charmer or Philosopher gained snake_charmer task" };
  }

  return {
    valid: true,
    opportunity: {
      nightNumber: 1,
      opportunityId: formatPhilosopherGainedSnakeCharmerActionOpportunityId({
        seatNumber: currentEntry.seatNumber,
        opportunityIndex: 1
      }),
      opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: targetTask.taskId,
      taskType: "SNAKE_CHARMER_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: cloneRoleSetupSnapshot(currentEntry.role),
      sourceCharacterStateRevision: input.currentCharacterState.revision,
      visibility: createSnakeCharmerActionOpportunityVisibility()
    }
  };
};

export const tryCreateFirstNightRoleActionOpportunity = (
  input: OpportunityValidationInput
): CreateOpportunityResult => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask?.taskType === "PHILOSOPHER_ACTION") {
    return tryCreatePhilosopherFirstNightActionOpportunity(input);
  }

  if (targetTask?.taskType === "SNAKE_CHARMER_ACTION") {
    return tryCreateSnakeCharmerFirstNightActionOpportunity(input);
  }

  return { valid: false, reason: "FirstNightActionOpportunityCreated task type is not supported as a first-night role action opportunity" };
};

export const createFirstNightRoleActionOpportunity = (
  input: OpportunityValidationInput
): FirstNightActionOpportunity => {
  const result = tryCreateFirstNightRoleActionOpportunity(input);
  if (!result.valid) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", result.reason);
  }

  return result.opportunity;
};

export const validateFirstNightActionOpportunityCreatedPayload = (
  payload: unknown,
  input: OpportunityValidationInput
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, FIRST_NIGHT_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS)) {
    return fail("FirstNightActionOpportunityCreated payload must have exact runtime shape");
  }

  if (typeof payload.rulesBaselineVersion !== "string") {
    return fail("FirstNightActionOpportunityCreated rulesBaselineVersion must be a string");
  }

  if (!hasExactFirstNightActionOpportunityShape({
    nightNumber: payload.nightNumber,
    opportunityId: payload.opportunityId,
    opportunityKind: payload.opportunityKind,
    opportunityStatus: payload.opportunityStatus,
    sourceCharacterStateRevision: payload.sourceCharacterStateRevision,
    sourcePlayerId: payload.sourcePlayerId,
    sourceRole: payload.sourceRole,
    sourceSeatNumber: payload.sourceSeatNumber,
    taskId: payload.taskId,
    taskType: payload.taskType,
    visibility: payload.visibility
  })) {
    return fail("FirstNightActionOpportunityCreated fields must use supported primitive values");
  }

  if (payload.opportunityStatus !== "OPEN") {
    return fail("FirstNightActionOpportunityCreated must create an OPEN opportunity");
  }

  const expected = tryCreateFirstNightRoleActionOpportunity(input);
  if (!expected.valid) {
    return expected;
  }

  if (!sameOpportunityCore(payload as unknown as FirstNightActionOpportunity, expected.opportunity)) {
    return fail("FirstNightActionOpportunityCreated must match the current role action task source and deterministic opportunity id");
  }

  return { valid: true };
};

export const validatePhilosopherActionDeferredPayload = (
  payload: unknown,
  input: Omit<OpportunityValidationInput, "taskId"> & {
    readonly taskId: ScheduledTaskId;
  }
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, PHILOSOPHER_ACTION_DEFERRED_PAYLOAD_KEYS)) {
    return fail("PhilosopherActionDeferred payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    payload.taskType !== "PHILOSOPHER_ACTION" ||
    typeof payload.opportunityId !== "string" ||
    payload.opportunityId.trim().length === 0 ||
    payload.decisionKind !== "DEFER" ||
    typeof payload.sourcePlayerId !== "string" ||
    payload.sourcePlayerId.trim().length === 0 ||
    typeof payload.sourceSeatNumber !== "number" ||
    !Number.isInteger(payload.sourceSeatNumber) ||
    payload.sourceSeatNumber < 1 ||
    payload.sourceSeatNumber > 12 ||
    !hasExactRoleSetupSnapshotShape(payload.sourceRole) ||
    typeof payload.sourceCharacterStateRevision !== "number" ||
    !Number.isInteger(payload.sourceCharacterStateRevision) ||
    payload.sourceCharacterStateRevision <= 0
  ) {
    return fail("PhilosopherActionDeferred fields must use supported primitive values");
  }

  const parsedId = parseFirstNightActionOpportunityId(actionOpportunityId(payload.opportunityId));
  if (!parsedId.valid) {
    return parsedId;
  }

  const opportunity = findFirstNightActionOpportunityById(
    input.firstNightActionOpportunities,
    actionOpportunityId(payload.opportunityId)
  );
  if (opportunity === undefined || opportunity.opportunityStatus !== "OPEN") {
    return fail("PhilosopherActionDeferred must reference an OPEN first-night action opportunity");
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
    return fail("PhilosopherActionDeferred must match the referenced first-night action opportunity");
  }

  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return fail("PhilosopherActionDeferred must reference a task in the first-night task plan");
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return fail("PhilosopherActionDeferred cannot target a settled task");
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId || nextTask.taskType !== "PHILOSOPHER_ACTION") {
    return fail("PhilosopherActionDeferred must target the current next unsettled Philosopher task");
  }

  const currentEntry = currentPhilosopherEntryForTask(targetTask, input.currentCharacterState);
  if (
    currentEntry === undefined ||
    currentEntry.playerId !== opportunity.sourcePlayerId ||
    currentEntry.seatNumber !== opportunity.sourceSeatNumber ||
    input.currentCharacterState.revision !== opportunity.sourceCharacterStateRevision
  ) {
    return fail("PhilosopherActionDeferred source is no longer the same current Philosopher state");
  }

  return { valid: true };
};

export const appendFirstNightActionOpportunity = (
  state: FirstNightActionOpportunityState | undefined,
  payload: FirstNightActionOpportunityCreatedPayload
): FirstNightActionOpportunityState => ({
  opportunities: [
    ...cloneFirstNightActionOpportunityState(state).opportunities,
    cloneFirstNightActionOpportunity(payload)
  ]
});

export const closeFirstNightActionOpportunity = (
  state: FirstNightActionOpportunityState | undefined,
  payload: Pick<PhilosopherActionDeferredPayload, "opportunityId">
): FirstNightActionOpportunityState => {
  const opportunities = cloneFirstNightActionOpportunityState(state).opportunities;
  let found = false;
  const nextOpportunities = opportunities.map((opportunity) => {
    if (opportunity.opportunityId !== payload.opportunityId) {
      return opportunity;
    }

    found = true;
    return {
      ...opportunity,
      opportunityStatus: "CLOSED" as const
    };
  });

  if (!found) {
    throw new DomainError("InvalidPhilosopherActionDeferredPayload", "PhilosopherActionDeferred cannot close an unknown opportunity");
  }

  return {
    opportunities: nextOpportunities
  };
};

export const createPhilosopherDeferredScheduledTaskSettlement = (input: {
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): ScheduledTaskSettlement => ({
  taskId: input.taskId,
  taskType: "PHILOSOPHER_ACTION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "PHILOSOPHER_DEFERRED",
  characterStateRevision: input.characterStateRevision
});

export const hasClosedPhilosopherOpportunityForSettlement = (
  state: FirstNightActionOpportunityState | undefined,
  settlement: Pick<ScheduledTaskSettlement, "taskId" | "taskType" | "characterStateRevision">
): boolean =>
  state?.opportunities.some((opportunity) =>
    opportunity.opportunityStatus === "CLOSED" &&
    opportunity.taskId === settlement.taskId &&
    opportunity.taskType === settlement.taskType &&
    opportunity.sourceCharacterStateRevision === settlement.characterStateRevision
  ) ?? false;

export const isSupportedFirstNightRoleActionTaskType = (
  taskType: FirstNightTaskType
): taskType is "PHILOSOPHER_ACTION" | "SNAKE_CHARMER_ACTION" =>
  taskType === "PHILOSOPHER_ACTION" || taskType === "SNAKE_CHARMER_ACTION";

export const isSupportedFirstNightRoleActionTask = (
  task: ScheduledTask
): boolean =>
  task.taskType === "PHILOSOPHER_ACTION" ||
  (
    task.taskType === "SNAKE_CHARMER_ACTION" &&
    task.source.kind === "ROLE" &&
    task.source.role.roleId === SNAKE_CHARMER_ROLE_ID
  ) ||
  (
    task.taskType === "SNAKE_CHARMER_ACTION" &&
    task.source.kind === "PHILOSOPHER_GAINED_ABILITY" &&
    task.source.sourceRole.roleId === PHILOSOPHER_ROLE_ID &&
    task.source.chosenRole.roleId === SNAKE_CHARMER_ROLE_ID
  );
