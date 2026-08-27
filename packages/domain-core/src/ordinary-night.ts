import type { PlayerId, RoleId } from "./ids.js";
import type { GameState } from "./game-state.js";

export const ORDINARY_NIGHT_PLAN_VERSION = "ordinary-night-v1" as const;
export const ORDINARY_NIGHT_WINDOW = "OTHER_NIGHT" as const;
export const ORDINARY_NIGHT_CAPABILITY_KINDS = ["DREAMER_ACTION", "CERENOVUS_ACTION", "GENERIC_DEMON_KILL"] as const;
const ORDINARY_NIGHT_SCHEDULE_ORDER: Readonly<Record<OrdinaryNightCapabilityKind, number>> = {
  CERENOVUS_ACTION: 28,
  GENERIC_DEMON_KILL: 47,
  DREAMER_ACTION: 79
};
export type OrdinaryNightCapabilityKind = (typeof ORDINARY_NIGHT_CAPABILITY_KINDS)[number];
export type OrdinaryNightTaskStatus = "PENDING" | "SETTLED";
export type OrdinaryNightTask = {
  readonly taskId: string;
  readonly taskType: OrdinaryNightCapabilityKind;
  readonly sourcePlayerId: PlayerId;
  readonly sourceRoleId: RoleId;
  readonly sourceSeatNumber: number;
  readonly status: OrdinaryNightTaskStatus;
};
export type OrdinaryNightTaskPlan = {
  readonly planVersion: typeof ORDINARY_NIGHT_PLAN_VERSION;
  readonly window: typeof ORDINARY_NIGHT_WINDOW;
  readonly nightNumber: 2;
  readonly taskCount: number;
  readonly tasks: readonly OrdinaryNightTask[];
};
export type OrdinaryNightTaskProgress = {
  readonly settlements: readonly string[];
};
export type OrdinaryNightTarget = {
  readonly taskId: string;
  readonly taskType: OrdinaryNightCapabilityKind;
  readonly sourcePlayerId: PlayerId;
  readonly targetPlayerId: PlayerId;
  readonly candidateSet: readonly PlayerId[];
  readonly selectionIndex: number;
  readonly seed: string;
  readonly transferOutcome: "NONE";
};
export type OrdinaryNightTaskSettlement = {
  readonly planVersion: typeof ORDINARY_NIGHT_PLAN_VERSION;
  readonly window: typeof ORDINARY_NIGHT_WINDOW;
  readonly nightNumber: 2;
  readonly taskId: string;
  readonly taskType: OrdinaryNightCapabilityKind;
  readonly sourcePlayerId: PlayerId;
  readonly targetPlayerId: PlayerId;
  readonly settlement: "RESOLVED";
  readonly transferOutcome: "NONE";
};

const exactKeys = (value: unknown, keys: readonly string[]): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const own = Object.keys(value);
  return own.length === keys.length && keys.every((key) => own.includes(key));
};

const nonEmptyString = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const positiveInteger = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value > 0;

export const ordinaryNightTaskId = (taskType: OrdinaryNightCapabilityKind, seatNumber: number): string =>
  `ordinary-night-v1:${taskType}:night-02:seat-${String(seatNumber).padStart(2, "0")}`;

export const createOrdinaryNightTaskPlan = (state: GameState): OrdinaryNightTaskPlan => {
  if (state.assignment === undefined || state.roster === undefined) throw new Error("ordinary-night plan requires assignment and roster");
  const byRole = (roleId: string): OrdinaryNightTask | undefined => {
    const assignment = state.assignment?.assignments.find((entry) => entry.role.roleId === roleId);
    if (assignment === undefined) return undefined;
    return {
      taskId: ordinaryNightTaskId(roleId === "dreamer" ? "DREAMER_ACTION" : "CERENOVUS_ACTION", assignment.seatNumber),
      taskType: roleId === "dreamer" ? "DREAMER_ACTION" : "CERENOVUS_ACTION",
      sourcePlayerId: assignment.playerId,
      sourceRoleId: assignment.role.roleId,
      sourceSeatNumber: assignment.seatNumber,
      status: "PENDING"
    };
  };
  const tasks: OrdinaryNightTask[] = [];
  const dreamer = byRole("dreamer");
  if (dreamer !== undefined) tasks.push(dreamer);
  const cerenovus = byRole("cerenovus");
  if (cerenovus !== undefined) tasks.push(cerenovus);
  const demon = state.assignment.assignments.find((entry) => entry.role.characterType === "DEMON");
  if (demon !== undefined) {
    tasks.push({
      taskId: ordinaryNightTaskId("GENERIC_DEMON_KILL", demon.seatNumber),
      taskType: "GENERIC_DEMON_KILL",
      sourcePlayerId: demon.playerId,
      sourceRoleId: demon.role.roleId,
      sourceSeatNumber: demon.seatNumber,
      status: "PENDING"
    });
  }
  tasks.sort((left, right) => {
    const orderDelta = ORDINARY_NIGHT_SCHEDULE_ORDER[left.taskType] - ORDINARY_NIGHT_SCHEDULE_ORDER[right.taskType];
    if (orderDelta !== 0) return orderDelta;
    const seatDelta = left.sourceSeatNumber - right.sourceSeatNumber;
    if (seatDelta !== 0) return seatDelta;
    return left.taskId < right.taskId ? -1 : left.taskId === right.taskId ? 0 : 1;
  });
  return { planVersion: ORDINARY_NIGHT_PLAN_VERSION, window: ORDINARY_NIGHT_WINDOW, nightNumber: 2, taskCount: tasks.length, tasks };
};

export const getNextUnsettledOrdinaryNightTask = (plan: OrdinaryNightTaskPlan, progress: OrdinaryNightTaskProgress): OrdinaryNightTask | undefined => {
  const settled = new Set(progress.settlements);
  return plan.tasks.find((task) => !settled.has(task.taskId));
};

export const validateOrdinaryNightTaskPlan = (value: unknown): value is OrdinaryNightTaskPlan => {
  if (!exactKeys(value, ["planVersion", "window", "nightNumber", "taskCount", "tasks"])) return false;
  if (value.planVersion !== ORDINARY_NIGHT_PLAN_VERSION || value.window !== ORDINARY_NIGHT_WINDOW || value.nightNumber !== 2 || !positiveInteger(value.taskCount) || !Array.isArray(value.tasks) || value.taskCount !== value.tasks.length) return false;
  return value.tasks.every((task) => exactKeys(task, ["taskId", "taskType", "sourcePlayerId", "sourceRoleId", "sourceSeatNumber", "status"]) && nonEmptyString(task.taskId) && ORDINARY_NIGHT_CAPABILITY_KINDS.includes(task.taskType as OrdinaryNightCapabilityKind) && nonEmptyString(task.sourcePlayerId) && nonEmptyString(task.sourceRoleId) && positiveInteger(task.sourceSeatNumber) && (task.status === "PENDING" || task.status === "SETTLED"));
};

export const deriveOrdinaryNightTarget = (task: OrdinaryNightTask, state: GameState): OrdinaryNightTarget => {
  if (state.roster === undefined) throw new Error("ordinary-night target requires roster");
  const dead = new Set([...(state.deadPlayerIds ?? []), ...(state.deaths ?? []).map((death) => death.playerId)]);
  const candidates = state.roster.entries.filter((entry) => entry.playerId !== task.sourcePlayerId && !dead.has(entry.playerId)).sort((left, right) => (left.seatNumber - right.seatNumber)).map((entry) => entry.playerId);
  if (candidates.length === 0) throw new Error("ordinary-night target candidate set is empty");
  const selectionIndex = task.taskType === "GENERIC_DEMON_KILL"
    ? candidates.findIndex((playerId) => state.roster?.entries.find((entry) => entry.playerId === playerId)?.seatNumber === 1)
    : 0;
  if (selectionIndex < 0) throw new Error("ordinary-night demon target seat 1 is unavailable");
  return { taskId: task.taskId, taskType: task.taskType, sourcePlayerId: task.sourcePlayerId, targetPlayerId: candidates[selectionIndex]!, candidateSet: candidates, selectionIndex, seed: state.rootSeed, transferOutcome: "NONE" };
};
