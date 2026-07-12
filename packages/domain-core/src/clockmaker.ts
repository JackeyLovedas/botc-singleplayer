import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import type { AbilityImpairmentId, ActionOpportunityId, GrantedAbilityId, PlayerId, RoleTenureId, ScheduledTaskId } from "./ids.js";
import { roleId } from "./ids.js";
import type { FirstNightTaskPlan, FirstNightTaskProgress, ScheduledTask, ScheduledTaskSettlement, ScheduledTaskSettledPayload } from "./first-night-task-plan.js";
import { getNextUnsettledFirstNightTask, roleScheduledTaskId, SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION, validateScheduledTaskSettlementShape } from "./first-night-task-plan.js";
import { hasExactEnumerableKeys, hasExactRoleSetupSnapshotShape, isPlainRecord } from "./initial-private-knowledge.js";
import type { PlayerRoster, SeatNumber } from "./player-roster.js";
import type { AbilityImpairmentSet, AnyFirstNightTaskInsertedPayload, FirstNightTaskInsertion, GrantedAbilitySet, PhilosopherAbilityChoiceSet } from "./philosopher-ability.js";
import { formatPhilosopherGainedFirstNightTaskId, formatPhilosopherGainedFirstNightTaskIdV2, formatPhilosopherImpairmentId } from "./philosopher-ability.js";
import type { RoleTenureRecord, RoleTenureState } from "./seamstress.js";
import { isRoleTenureActiveAt, parseRoleTenureId } from "./seamstress.js";
import type { GeneratedSetup, RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";
import { isCanonicalDataValue, isDenseCanonicalArray, sameCanonicalDataValue } from "./canonical-data.js";

export type ClockmakerDistance = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const CLOCKMAKER_DISTANCE_DOMAIN = [0, 1, 2, 3, 4, 5, 6] as const;

export type ClockmakerCandidateSource = "EFFECTIVE" | "DRUNK" | "POISONED";
export type ClockmakerSimulationReason =
  | "RULE_CORRECT_REQUIRED"
  | "DETERMINISTIC_SMALLEST_FALSE_HARMFUL_DEFAULT"
  | "VORTOX_FALSE_REQUIRED_SMALLEST";

const isSeat = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 1 && value <= 12;

export const calculateClockmakerPairDistance = (demonSeat: unknown, minionSeat: unknown): number => {
  if (!isSeat(demonSeat) || !isSeat(minionSeat) || demonSeat === minionSeat) {
    throw new TypeError("Clockmaker distance requires two distinct canonical seats");
  }
  const clockwise = (minionSeat - demonSeat + 12) % 12;
  const counterClockwise = (demonSeat - minionSeat + 12) % 12;
  return Math.min(clockwise, counterClockwise);
};

export const calculateClockmakerTruth = (
  demonSeat: unknown,
  minionSeats: readonly unknown[]
): number => {
  if (!isDenseCanonicalArray(minionSeats) || minionSeats.length !== 2) {
    throw new TypeError("Clockmaker canonical truth requires exactly two Minions");
  }
  const distances = minionSeats.map((seat) => calculateClockmakerPairDistance(demonSeat, seat));
  return Math.min(...distances);
};

export const resolveClockmakerCandidates = (input: {
  readonly truth: ClockmakerDistance;
  readonly source: ClockmakerCandidateSource;
  readonly vortoxFalseRequired: boolean;
}): {
  readonly legalCandidates: readonly ClockmakerDistance[];
  readonly selectedDistance: ClockmakerDistance;
  readonly reason: ClockmakerSimulationReason;
} => {
  if (!CLOCKMAKER_DISTANCE_DOMAIN.includes(input.truth)) throw new TypeError("Invalid Clockmaker truth");
  if (input.source === "EFFECTIVE" && !input.vortoxFalseRequired) {
    return { legalCandidates: [input.truth], selectedDistance: input.truth, reason: "RULE_CORRECT_REQUIRED" };
  }
  const legalCandidates = input.vortoxFalseRequired
    ? CLOCKMAKER_DISTANCE_DOMAIN.filter((value) => value !== input.truth)
    : [...CLOCKMAKER_DISTANCE_DOMAIN];
  const selectedDistance = legalCandidates.find((value) => value !== input.truth);
  if (selectedDistance === undefined) throw new TypeError("Clockmaker false candidate set is empty");
  return {
    legalCandidates,
    selectedDistance,
    reason: input.vortoxFalseRequired
      ? "VORTOX_FALSE_REQUIRED_SMALLEST"
      : "DETERMINISTIC_SMALLEST_FALSE_HARMFUL_DEFAULT"
  };
};

export const CLOCKMAKER_INFORMATION_MODEL_VERSION = "clockmaker-information-v1" as const;
export const CLOCKMAKER_SIMULATION_POLICY_VERSION = "clockmaker-distance-selection-v1" as const;

export type BaseClockmakerSourceContract = {
  readonly kind: "BASE_CLOCKMAKER";
  readonly taskId: ScheduledTaskId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly taskPlanVersion: string;
};

export type PhilosopherGainedClockmakerSourceContract = {
  readonly kind: "PHILOSOPHER_GAINED_CLOCKMAKER";
  readonly taskId: ScheduledTaskId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly gainedRole: RoleSetupSnapshot;
  readonly grantId: GrantedAbilityId;
  readonly grantedAtTaskId: ScheduledTaskId;
  readonly grantedAtOpportunityId: ActionOpportunityId;
  readonly insertionCharacterStateRevision: number;
};

export type ClockmakerSourceContract = BaseClockmakerSourceContract | PhilosopherGainedClockmakerSourceContract;

const matchesGainedClockmakerInsertion = (
  insertion: AnyFirstNightTaskInsertedPayload,
  task: ScheduledTask,
  contract: PhilosopherGainedClockmakerSourceContract
): boolean => {
  if ("schedulingVersion" in insertion) {
    return contract.taskId === formatPhilosopherGainedFirstNightTaskIdV2({
      taskType: "CLOCKMAKER_INFORMATION",
      sourceSeatNumber: contract.sourceSeatNumber,
      chosenRoleId: roleId("clockmaker")
    }) &&
      insertion.taskType === "CLOCKMAKER_INFORMATION" &&
      insertion.targetRoleId === "clockmaker" &&
      insertion.targetCatalogBaseOrder === insertion.effectiveBaseOrder &&
      task.orderKey.baseOrder === insertion.effectiveBaseOrder &&
      task.orderKey.insertionOrder === contract.sourceSeatNumber &&
      insertion.tieBreakSourceSeatNumber === contract.sourceSeatNumber &&
      insertion.sourcePlayerId === contract.sourcePlayerId &&
      insertion.sourceSeatNumber === contract.sourceSeatNumber &&
      insertion.philosopherOpportunityId === contract.grantedAtOpportunityId &&
      insertion.grantId === contract.grantId &&
      insertion.sourceCharacterStateRevision === contract.insertionCharacterStateRevision &&
      sameRoleSetupSnapshot(insertion.sourceRole, contract.sourceRole) &&
      sameRoleSetupSnapshot(insertion.chosenRole, contract.gainedRole);
  }

  return contract.taskId === formatPhilosopherGainedFirstNightTaskId({
    taskType: "CLOCKMAKER_INFORMATION",
    sourceSeatNumber: contract.sourceSeatNumber,
    chosenRoleId: roleId("clockmaker")
  }) &&
    task.orderKey.baseOrder === 100 &&
    task.orderKey.insertionOrder === 1 &&
    insertion.orderKey.baseOrder === 100 &&
    insertion.orderKey.insertionOrder === 1 &&
    insertion.insertedByOpportunityId === contract.grantedAtOpportunityId &&
    insertion.insertedByPlayerId === contract.sourcePlayerId &&
    insertion.sourceCharacterStateRevision === contract.insertionCharacterStateRevision &&
    insertion.source.kind === "PHILOSOPHER_GAINED_ABILITY" &&
    insertion.source.playerId === contract.sourcePlayerId &&
    sameRoleSetupSnapshot(insertion.source.sourceRole, contract.sourceRole) &&
    sameRoleSetupSnapshot(insertion.chosenRole, contract.gainedRole);
};
export type ClockmakerSourceEffectiveness =
  | { readonly kind: "EFFECTIVE"; readonly representedImpairmentIds: readonly [] }
  | {
      readonly kind: "KNOWN_DRUNK";
      readonly representedImpairmentIds: readonly [AbilityImpairmentId];
      readonly sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE";
    };
export type ClockmakerVortoxConstraint =
  | { readonly kind: "NONE" }
  | {
      readonly kind: "VORTOX_FALSE_REQUIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleTenureId: RoleTenureId;
    };
export type ClockmakerNativeReference = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly role: RoleSetupSnapshot;
};
export type ClockmakerPairDistanceSnapshot = {
  readonly demonPlayerId: PlayerId;
  readonly demonSeatNumber: SeatNumber;
  readonly minionPlayerId: PlayerId;
  readonly minionSeatNumber: SeatNumber;
  readonly clockwiseDistance: number;
  readonly counterClockwiseDistance: number;
  readonly nearestDistance: ClockmakerDistance;
};
export type ClockmakerInformationReliability =
  | "RULE_CORRECT_EFFECTIVE"
  | "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"
  | "VORTOX_CONSTRAINED_FALSE";
export type ClockmakerInformationDeliveredPayload = {
  readonly rulesBaselineVersion: string;
  readonly informationModelVersion: typeof CLOCKMAKER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: "CLOCKMAKER_INFORMATION";
  readonly deliveryId: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "CLOCKMAKER_INFORMATION";
  readonly sourceContract: ClockmakerSourceContract;
  readonly settlementCharacterStateRevision: number;
  readonly identityModel: "NATIVE_CHARACTER_TYPE_ONLY";
  readonly ringSeatCount: 12;
  readonly nativeDemonReferences: readonly [ClockmakerNativeReference];
  readonly nativeMinionReferences: readonly [ClockmakerNativeReference, ClockmakerNativeReference];
  readonly pairDistanceSnapshots: readonly [ClockmakerPairDistanceSnapshot, ClockmakerPairDistanceSnapshot];
  readonly ruleCorrectDistance: ClockmakerDistance;
  readonly sourceEffectiveness: ClockmakerSourceEffectiveness;
  readonly vortoxConstraint: ClockmakerVortoxConstraint;
  readonly outputDomain: typeof CLOCKMAKER_DISTANCE_DOMAIN;
  readonly legalCandidateDistances: readonly ClockmakerDistance[];
  readonly selectedDistance: ClockmakerDistance;
  readonly simulationPolicyVersion: typeof CLOCKMAKER_SIMULATION_POLICY_VERSION;
  readonly simulationReason: ClockmakerSimulationReason;
  readonly informationReliability: ClockmakerInformationReliability;
};
export type ClockmakerInformationSet = { readonly deliveries: readonly ClockmakerInformationDeliveredPayload[] };

type ValidationResult = { readonly valid: true } | { readonly valid: false; readonly reason: string };
const fail = (reason: string): ValidationResult => ({ valid: false, reason });
const positiveInteger = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const nonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const dense = (value: unknown): value is readonly unknown[] => isDenseCanonicalArray(value);

export const isClockmakerInformationSetShape = (value: unknown): value is ClockmakerInformationSet => {
  try {
    return isCanonicalDataValue(value) && isPlainRecord(value) && Object.keys(value).length === 1 &&
      Object.hasOwn(value, "deliveries") && isDenseCanonicalArray(value.deliveries);
  } catch {
    return false;
  }
};
const catalogRole = (setup: Pick<GeneratedSetup, "roleCatalogSnapshot">, roleId: string): RoleSetupSnapshot | undefined =>
  setup.roleCatalogSnapshot.roles.find((role) => role.roleId === roleId);

const exactClockmaker = (role: RoleSetupSnapshot, setup: Pick<GeneratedSetup, "roleCatalogSnapshot">): boolean => {
  const expected = catalogRole(setup, "clockmaker");
  return expected !== undefined && expected.characterType === "TOWNSFOLK" && sameRoleSetupSnapshot(role, expected);
};

export const formatClockmakerDeliveryId = (input: {
  readonly taskId: ScheduledTaskId;
  readonly settlementCharacterStateRevision: number;
}): string => {
  if (!nonEmptyString(input.taskId) || !positiveInteger(input.settlementCharacterStateRevision)) {
    throw new TypeError("Clockmaker delivery ID requires a task ID and positive settlement revision");
  }
  return `clockmaker-delivery-v1:${input.taskId}:settlement-revision-${input.settlementCharacterStateRevision}`;
};

export const parseClockmakerDeliveryId = (value: unknown):
  | { readonly valid: true; readonly taskId: ScheduledTaskId; readonly settlementCharacterStateRevision: number }
  | { readonly valid: false; readonly reason: string } => {
  if (typeof value !== "string") return { valid: false, reason: "Clockmaker delivery ID must be a string" };
  const match = /^clockmaker-delivery-v1:((?:first-night-v1:CLOCKMAKER_INFORMATION:seat-(?:0[1-9]|1[0-2])|first-night-v[12]:PHILOSOPHER_GAINED:CLOCKMAKER_INFORMATION:seat-(?:0[1-9]|1[0-2]):from-clockmaker)):settlement-revision-([1-9][0-9]*)$/.exec(value);
  if (match === null || match[1] === undefined || match[2] === undefined) return { valid: false, reason: "Clockmaker delivery ID has invalid grammar" };
  const revision = Number(match[2]);
  if (!Number.isSafeInteger(revision) || formatClockmakerDeliveryId({ taskId: match[1] as ScheduledTaskId, settlementCharacterStateRevision: revision }) !== value) {
    return { valid: false, reason: "Clockmaker delivery ID is not canonical" };
  }
  return { valid: true, taskId: match[1] as ScheduledTaskId, settlementCharacterStateRevision: revision };
};

const taskForContract = (plan: Pick<FirstNightTaskPlan, "tasks">, taskId: ScheduledTaskId): ScheduledTask | undefined =>
  plan.tasks.find((task) => task.taskId === taskId);

export const validateBaseClockmakerSourceContract = (input: {
  readonly contract: unknown;
  readonly firstNightTaskPlan: Pick<FirstNightTaskPlan, "taskPlanVersion" | "tasks">;
  readonly firstNightTaskProgress?: FirstNightTaskProgress;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
}): ValidationResult => {
  const keys = ["kind", "sourcePlayerId", "sourceRole", "sourceSeatNumber", "taskId", "taskPlanVersion"] as const;
  if (!isDenseCanonicalArray(input.firstNightTaskPlan.tasks) || !isDenseCanonicalArray(input.currentCharacterState.entries) ||
      !isDenseCanonicalArray(input.setup.roleCatalogSnapshot.roles) || input.firstNightTaskProgress !== undefined &&
      !isDenseCanonicalArray(input.firstNightTaskProgress.settlements)) return fail("Base Clockmaker source collections must be strict dense standard arrays");
  if (!isCanonicalDataValue(input.contract) || !isPlainRecord(input.contract) || !hasExactEnumerableKeys(input.contract, keys) || input.contract.kind !== "BASE_CLOCKMAKER" ||
      !nonEmptyString(input.contract.taskId) || !nonEmptyString(input.contract.sourcePlayerId) || !isSeat(input.contract.sourceSeatNumber) ||
      !hasExactRoleSetupSnapshotShape(input.contract.sourceRole) || input.contract.taskPlanVersion !== input.firstNightTaskPlan.taskPlanVersion) {
    return fail("Base Clockmaker source contract must have exact runtime shape and plan version");
  }
  const contract = input.contract as unknown as BaseClockmakerSourceContract;
  const task = taskForContract(input.firstNightTaskPlan, contract.taskId);
  const next = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (task === undefined || next?.taskId !== task.taskId || task.taskType !== "CLOCKMAKER_INFORMATION" || task.taskClass !== "ROLE_INFORMATION" ||
      task.source.kind !== "ROLE" || task.taskId !== roleScheduledTaskId("CLOCKMAKER_INFORMATION", task.source.seatNumber) ||
      task.source.playerId !== contract.sourcePlayerId || task.source.seatNumber !== contract.sourceSeatNumber ||
      !sameRoleSetupSnapshot(task.source.role, contract.sourceRole) || !exactClockmaker(contract.sourceRole, input.setup)) {
    return fail("Base Clockmaker source must bind the exact next canonical role-information task");
  }
  const current = input.currentCharacterState.entries.filter((entry) => entry.playerId === contract.sourcePlayerId && entry.seatNumber === contract.sourceSeatNumber);
  if (current.length !== 1 || current[0] === undefined || !sameRoleSetupSnapshot(current[0].role, contract.sourceRole)) {
    return fail("Base Clockmaker source must still be the exact current Clockmaker");
  }
  return { valid: true };
};

export const validatePhilosopherGainedClockmakerSourceContract = (input: {
  readonly contract: unknown;
  readonly firstNightTaskPlan: Pick<FirstNightTaskPlan, "tasks">;
  readonly firstNightTaskProgress?: FirstNightTaskProgress;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly grants: GrantedAbilitySet;
  readonly insertions: FirstNightTaskInsertion;
}): ValidationResult => {
  const keys = ["gainedRole", "grantId", "grantedAtOpportunityId", "grantedAtTaskId", "insertionCharacterStateRevision", "kind", "sourcePlayerId", "sourceRole", "sourceSeatNumber", "taskId"] as const;
  if (!isDenseCanonicalArray(input.firstNightTaskPlan.tasks) || !isDenseCanonicalArray(input.currentCharacterState.entries) ||
      !isDenseCanonicalArray(input.setup.roleCatalogSnapshot.roles) || !isDenseCanonicalArray(input.grants.abilities) ||
      !isDenseCanonicalArray(input.insertions.insertions) || input.firstNightTaskProgress !== undefined &&
      !isDenseCanonicalArray(input.firstNightTaskProgress.settlements)) return fail("Gained Clockmaker source collections must be strict dense standard arrays");
  if (!isCanonicalDataValue(input.contract) || !isPlainRecord(input.contract) || !hasExactEnumerableKeys(input.contract, keys) || input.contract.kind !== "PHILOSOPHER_GAINED_CLOCKMAKER" ||
      !nonEmptyString(input.contract.taskId) || !nonEmptyString(input.contract.sourcePlayerId) || !isSeat(input.contract.sourceSeatNumber) ||
      !hasExactRoleSetupSnapshotShape(input.contract.sourceRole) || !hasExactRoleSetupSnapshotShape(input.contract.gainedRole) ||
      !nonEmptyString(input.contract.grantId) || !nonEmptyString(input.contract.grantedAtTaskId) || !nonEmptyString(input.contract.grantedAtOpportunityId) ||
      !positiveInteger(input.contract.insertionCharacterStateRevision)) return fail("Gained Clockmaker source contract must have exact runtime shape");
  const contract = input.contract as unknown as PhilosopherGainedClockmakerSourceContract;
  const task = taskForContract(input.firstNightTaskPlan, contract.taskId);
  const next = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  const grants = input.grants.abilities.filter((grant) => grant.grantId === contract.grantId);
  const insertions = input.insertions.insertions.filter((insertion) => insertion.taskId === contract.taskId);
  const grant = grants[0];
  const insertion = insertions[0];
  const philosopher = catalogRole(input.setup, "philosopher");
  if (task === undefined || next?.taskId !== task.taskId || task.taskType !== "CLOCKMAKER_INFORMATION" || task.taskClass !== "ROLE_INFORMATION" ||
      task.source.kind !== "PHILOSOPHER_GAINED_ABILITY" || grants.length !== 1 || grant === undefined || insertions.length !== 1 || insertion === undefined ||
      !matchesGainedClockmakerInsertion(insertion, task, contract) ||
      task.source.playerId !== contract.sourcePlayerId || task.source.seatNumber !== contract.sourceSeatNumber ||
      !sameRoleSetupSnapshot(task.source.sourceRole, contract.sourceRole) || !sameRoleSetupSnapshot(task.source.chosenRole, contract.gainedRole) ||
      philosopher === undefined || !sameRoleSetupSnapshot(contract.sourceRole, philosopher) || !exactClockmaker(contract.gainedRole, input.setup) ||
      grant.sourcePlayerId !== contract.sourcePlayerId || grant.sourceSeatNumber !== contract.sourceSeatNumber || !sameRoleSetupSnapshot(grant.sourceRole, contract.sourceRole) ||
      !sameRoleSetupSnapshot(grant.chosenRole, contract.gainedRole) || grant.chosenRoleId !== "clockmaker" || grant.grantedAtTaskId !== contract.grantedAtTaskId ||
      grant.grantedAtOpportunityId !== contract.grantedAtOpportunityId ||
      grant.sourceCharacterStateRevision !== contract.insertionCharacterStateRevision) return fail("Gained Clockmaker source must bind one exact grant, insertion, task, and source");
  const current = input.currentCharacterState.entries.filter((entry) => entry.playerId === contract.sourcePlayerId && entry.seatNumber === contract.sourceSeatNumber);
  if (current.length !== 1 || current[0] === undefined || !sameRoleSetupSnapshot(current[0].role, contract.sourceRole)) return fail("Gained Clockmaker source must remain the bounded current Philosopher");
  return { valid: true };
};

export const resolveClockmakerNativeReferences = (input: {
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roster: PlayerRoster;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
}):
  | { readonly valid: true; readonly demon: ClockmakerNativeReference; readonly minions: readonly [ClockmakerNativeReference, ClockmakerNativeReference]; readonly pairs: readonly [ClockmakerPairDistanceSnapshot, ClockmakerPairDistanceSnapshot]; readonly truth: ClockmakerDistance }
  | { readonly valid: false; readonly reason: string } => {
  if (!isDenseCanonicalArray(input.currentCharacterState.entries) || !isDenseCanonicalArray(input.roster) ||
      !isDenseCanonicalArray(input.setup.roleCatalogSnapshot.roles) || !positiveInteger(input.currentCharacterState.revision) ||
      input.currentCharacterState.entries.length !== 12 || input.roster.length !== 12) return { valid: false, reason: "Clockmaker requires valid fixed current state and roster" };
  const rosterByPlayer = new Map(input.roster.map((entry) => [entry.playerId, entry]));
  const references: ClockmakerNativeReference[] = [];
  const seenPlayers = new Set<string>();
  const seenSeats = new Set<number>();
  for (const entry of input.currentCharacterState.entries) {
    const roster = rosterByPlayer.get(entry.playerId);
    const role = catalogRole(input.setup, entry.role.roleId);
    if (roster?.seatNumber !== entry.seatNumber || seenPlayers.has(entry.playerId) || seenSeats.has(entry.seatNumber) || role === undefined || !sameRoleSetupSnapshot(role, entry.role)) return { valid: false, reason: "Clockmaker current identity must match roster and exact setup catalog" };
    seenPlayers.add(entry.playerId); seenSeats.add(entry.seatNumber);
    if (entry.role.characterType === "DEMON" || entry.role.characterType === "MINION") references.push({ playerId: entry.playerId, seatNumber: entry.seatNumber, role: cloneRoleSetupSnapshot(entry.role) });
  }
  const demons = references.filter((reference) => reference.role.characterType === "DEMON");
  const minions = references.filter((reference) => reference.role.characterType === "MINION").sort((left, right) => left.seatNumber - right.seatNumber);
  if (demons.length !== 1 || demons[0] === undefined) return { valid: false, reason: "Clockmaker requires exactly one native Demon" };
  if (minions.length !== 2 || minions[0] === undefined || minions[1] === undefined) return { valid: false, reason: "Clockmaker requires exactly two native Minions" };
  const demon = demons[0];
  const pairFor = (minion: ClockmakerNativeReference): ClockmakerPairDistanceSnapshot => {
    const clockwise = (minion.seatNumber - demon.seatNumber + 12) % 12;
    const counterClockwise = (demon.seatNumber - minion.seatNumber + 12) % 12;
    return { demonPlayerId: demon.playerId, demonSeatNumber: demon.seatNumber, minionPlayerId: minion.playerId, minionSeatNumber: minion.seatNumber, clockwiseDistance: clockwise, counterClockwiseDistance: counterClockwise, nearestDistance: Math.min(clockwise, counterClockwise) as ClockmakerDistance };
  };
  const pairs = [pairFor(minions[0]), pairFor(minions[1])] as const;
  return { valid: true, demon, minions: [minions[0], minions[1]], pairs, truth: Math.min(pairs[0].nearestDistance, pairs[1].nearestDistance) as ClockmakerDistance };
};

const impairmentDisablesTenure = (impairments: AbilityImpairmentSet | undefined, tenure: RoleTenureRecord, revision: number): boolean =>
  (impairments?.impairments ?? []).some((impairment) => impairment.affectedPlayerId === tenure.playerId && impairment.affectedSeatNumber === tenure.seatNumber &&
    impairment.affectedRole.roleId === tenure.roleId && impairment.sourceCharacterStateRevision >= tenure.acquiredCharacterStateRevision &&
    impairment.sourceCharacterStateRevision <= revision && (tenure.endedCharacterStateRevision === undefined || impairment.sourceCharacterStateRevision < tenure.endedCharacterStateRevision));

export const resolveClockmakerVortoxConstraint = (input: {
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly roleTenures: RoleTenureState;
  readonly abilityImpairments?: AbilityImpairmentSet;
}): { readonly valid: true; readonly constraint: ClockmakerVortoxConstraint } | { readonly valid: false; readonly reason: string } => {
  if (!isDenseCanonicalArray(input.currentCharacterState.entries) || !isDenseCanonicalArray(input.setup.roleCatalogSnapshot.roles) ||
      !isDenseCanonicalArray(input.roleTenures.records) || input.abilityImpairments !== undefined &&
      !isDenseCanonicalArray(input.abilityImpairments.impairments)) return { valid: false, reason: "Clockmaker Vortox inputs must use strict dense standard arrays" };
  const expectedVortox = catalogRole(input.setup, "vortox");
  if (expectedVortox === undefined || expectedVortox.characterType !== "DEMON") return { valid: false, reason: "Clockmaker requires exact catalog Vortox" };
  const current = input.currentCharacterState.entries.filter((entry) => sameRoleSetupSnapshot(entry.role, expectedVortox));
  const activeVortox = input.roleTenures.records.filter((tenure) => tenure.roleId === "vortox" && isRoleTenureActiveAt(tenure, input.currentCharacterState.revision));
  if (current.length === 0) {
    if (activeVortox.length !== 0) return { valid: false, reason: "Active Vortox tenure conflicts with current native Demon absence" };
    return { valid: true, constraint: { kind: "NONE" } };
  }
  if (current.length !== 1 || current[0] === undefined) return { valid: false, reason: "Clockmaker requires exactly one current Vortox" };
  const vortox = current[0];
  const matches = activeVortox.filter((tenure) => tenure.playerId === vortox.playerId && tenure.seatNumber === vortox.seatNumber);
  if (matches.length !== 1 || activeVortox.length !== 1 || matches[0] === undefined) return { valid: false, reason: "Current Vortox requires one exact active tenure" };
  const tenure = matches[0];
  const parsed = parseRoleTenureId(tenure.roleTenureId);
  if (!parsed.valid || parsed.roleId !== "vortox" || parsed.seatNumber !== tenure.seatNumber || parsed.acquiredCharacterStateRevision !== tenure.acquiredCharacterStateRevision || impairmentDisablesTenure(input.abilityImpairments, tenure, input.currentCharacterState.revision)) return { valid: false, reason: "Vortox tenure must be canonical and effective at settlement" };
  return { valid: true, constraint: { kind: "VORTOX_FALSE_REQUIRED", evaluatedCharacterStateRevision: input.currentCharacterState.revision, vortoxPlayerId: vortox.playerId, vortoxSeatNumber: vortox.seatNumber, vortoxRoleTenureId: tenure.roleTenureId } };
};

const referenceKeys = ["playerId", "role", "seatNumber"] as const;
const pairKeys = ["clockwiseDistance", "counterClockwiseDistance", "demonPlayerId", "demonSeatNumber", "minionPlayerId", "minionSeatNumber", "nearestDistance"] as const;
const baseSourceKeys = ["kind", "sourcePlayerId", "sourceRole", "sourceSeatNumber", "taskId", "taskPlanVersion"] as const;
const gainedSourceKeys = ["gainedRole", "grantId", "grantedAtOpportunityId", "grantedAtTaskId", "insertionCharacterStateRevision", "kind", "sourcePlayerId", "sourceRole", "sourceSeatNumber", "taskId"] as const;
const deliveryKeys = [
  "deliveryId", "identityModel", "informationModelVersion", "informationReliability", "knowledgeStage", "legalCandidateDistances",
  "nativeDemonReferences", "nativeMinionReferences", "nightNumber", "outputDomain", "pairDistanceSnapshots", "ringSeatCount",
  "ruleCorrectDistance", "rulesBaselineVersion", "selectedDistance", "settlementCharacterStateRevision", "simulationPolicyVersion",
  "simulationReason", "sourceContract", "sourceEffectiveness", "taskId", "taskType", "vortoxConstraint"
] as const;

const validReferenceShape = (value: unknown): value is ClockmakerNativeReference => isPlainRecord(value) && hasExactEnumerableKeys(value, referenceKeys) &&
  nonEmptyString(value.playerId) && isSeat(value.seatNumber) && hasExactRoleSetupSnapshotShape(value.role);
const validPairShape = (value: unknown): value is ClockmakerPairDistanceSnapshot => isPlainRecord(value) && hasExactEnumerableKeys(value, pairKeys) &&
  nonEmptyString(value.demonPlayerId) && isSeat(value.demonSeatNumber) && nonEmptyString(value.minionPlayerId) && isSeat(value.minionSeatNumber) &&
  typeof value.clockwiseDistance === "number" && Number.isSafeInteger(value.clockwiseDistance) && value.clockwiseDistance >= 1 && value.clockwiseDistance <= 11 &&
  typeof value.counterClockwiseDistance === "number" && Number.isSafeInteger(value.counterClockwiseDistance) && value.counterClockwiseDistance >= 1 && value.counterClockwiseDistance <= 11 &&
  CLOCKMAKER_DISTANCE_DOMAIN.includes(value.nearestDistance as ClockmakerDistance);
const validSourceContractShape = (value: unknown): value is ClockmakerSourceContract => {
  if (!isPlainRecord(value)) return false;
  if (value.kind === "BASE_CLOCKMAKER") return hasExactEnumerableKeys(value, baseSourceKeys) && nonEmptyString(value.taskId) && nonEmptyString(value.sourcePlayerId) &&
    isSeat(value.sourceSeatNumber) && hasExactRoleSetupSnapshotShape(value.sourceRole) && nonEmptyString(value.taskPlanVersion);
  return value.kind === "PHILOSOPHER_GAINED_CLOCKMAKER" && hasExactEnumerableKeys(value, gainedSourceKeys) && nonEmptyString(value.taskId) &&
    nonEmptyString(value.sourcePlayerId) && isSeat(value.sourceSeatNumber) && hasExactRoleSetupSnapshotShape(value.sourceRole) &&
    hasExactRoleSetupSnapshotShape(value.gainedRole) && nonEmptyString(value.grantId) && nonEmptyString(value.grantedAtTaskId) &&
    nonEmptyString(value.grantedAtOpportunityId) && positiveInteger(value.insertionCharacterStateRevision);
};
const validEffectivenessShape = (value: unknown): value is ClockmakerSourceEffectiveness => {
  if (!isPlainRecord(value)) return false;
  if (value.kind === "EFFECTIVE") return hasExactEnumerableKeys(value, ["kind", "representedImpairmentIds"]) && Array.isArray(value.representedImpairmentIds) && value.representedImpairmentIds.length === 0;
  return value.kind === "KNOWN_DRUNK" && hasExactEnumerableKeys(value, ["kind", "representedImpairmentIds", "sourceKind"]) && value.sourceKind === "PHILOSOPHER_CHOSEN_DUPLICATE" &&
    Array.isArray(value.representedImpairmentIds) && dense(value.representedImpairmentIds) && value.representedImpairmentIds.length === 1 && nonEmptyString(value.representedImpairmentIds[0]);
};
const validConstraintShape = (value: unknown): value is ClockmakerVortoxConstraint => {
  if (!isPlainRecord(value)) return false;
  return value.kind === "NONE" ? hasExactEnumerableKeys(value, ["kind"]) : value.kind === "VORTOX_FALSE_REQUIRED" &&
    hasExactEnumerableKeys(value, ["evaluatedCharacterStateRevision", "kind", "vortoxPlayerId", "vortoxRoleTenureId", "vortoxSeatNumber"]) &&
    positiveInteger(value.evaluatedCharacterStateRevision) && nonEmptyString(value.vortoxPlayerId) && isSeat(value.vortoxSeatNumber) && nonEmptyString(value.vortoxRoleTenureId);
};

export const createClockmakerInformationDeliveredPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly sourceContract: ClockmakerSourceContract;
  readonly settlementCharacterStateRevision: number;
  readonly nativeDemonReferences: readonly [ClockmakerNativeReference];
  readonly nativeMinionReferences: readonly [ClockmakerNativeReference, ClockmakerNativeReference];
  readonly sourceEffectiveness: ClockmakerSourceEffectiveness;
  readonly vortoxConstraint: ClockmakerVortoxConstraint;
}): ClockmakerInformationDeliveredPayload => {
  const demon = input.nativeDemonReferences[0];
  const minions = [...input.nativeMinionReferences].sort((left, right) => left.seatNumber - right.seatNumber) as [ClockmakerNativeReference, ClockmakerNativeReference];
  const pair = (minion: ClockmakerNativeReference): ClockmakerPairDistanceSnapshot => ({
    demonPlayerId: demon.playerId, demonSeatNumber: demon.seatNumber, minionPlayerId: minion.playerId, minionSeatNumber: minion.seatNumber,
    clockwiseDistance: (minion.seatNumber - demon.seatNumber + 12) % 12,
    counterClockwiseDistance: (demon.seatNumber - minion.seatNumber + 12) % 12,
    nearestDistance: calculateClockmakerPairDistance(demon.seatNumber, minion.seatNumber) as ClockmakerDistance
  });
  const pairs = [pair(minions[0]), pair(minions[1])] as const;
  const truth = Math.min(pairs[0].nearestDistance, pairs[1].nearestDistance) as ClockmakerDistance;
  const source = input.sourceEffectiveness.kind === "KNOWN_DRUNK" ? "DRUNK" : "EFFECTIVE";
  const selection = resolveClockmakerCandidates({ truth, source, vortoxFalseRequired: input.vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED" });
  const reliability: ClockmakerInformationReliability = input.vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED" ? "VORTOX_CONSTRAINED_FALSE" :
    input.sourceEffectiveness.kind === "KNOWN_DRUNK" ? "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS" : "RULE_CORRECT_EFFECTIVE";
  return {
    rulesBaselineVersion: input.rulesBaselineVersion, informationModelVersion: CLOCKMAKER_INFORMATION_MODEL_VERSION,
    knowledgeStage: "CLOCKMAKER_INFORMATION", deliveryId: formatClockmakerDeliveryId({ taskId: input.sourceContract.taskId, settlementCharacterStateRevision: input.settlementCharacterStateRevision }),
    nightNumber: 1, taskId: input.sourceContract.taskId, taskType: "CLOCKMAKER_INFORMATION", sourceContract: structuredClone(input.sourceContract),
    settlementCharacterStateRevision: input.settlementCharacterStateRevision, identityModel: "NATIVE_CHARACTER_TYPE_ONLY", ringSeatCount: 12,
    nativeDemonReferences: [{ ...demon, role: cloneRoleSetupSnapshot(demon.role) }],
    nativeMinionReferences: minions.map((entry) => ({ ...entry, role: cloneRoleSetupSnapshot(entry.role) })) as [ClockmakerNativeReference, ClockmakerNativeReference],
    pairDistanceSnapshots: pairs, ruleCorrectDistance: truth, sourceEffectiveness: structuredClone(input.sourceEffectiveness), vortoxConstraint: { ...input.vortoxConstraint },
    outputDomain: [...CLOCKMAKER_DISTANCE_DOMAIN], legalCandidateDistances: [...selection.legalCandidates], selectedDistance: selection.selectedDistance,
    simulationPolicyVersion: CLOCKMAKER_SIMULATION_POLICY_VERSION, simulationReason: selection.reason, informationReliability: reliability
  };
};

export const validateClockmakerInformationDeliveredPayloadShape = (value: unknown): ValidationResult => {
  try {
  if (!isCanonicalDataValue(value) || !isPlainRecord(value) || !hasExactEnumerableKeys(value, deliveryKeys) || !nonEmptyString(value.rulesBaselineVersion) ||
      value.informationModelVersion !== CLOCKMAKER_INFORMATION_MODEL_VERSION || value.knowledgeStage !== "CLOCKMAKER_INFORMATION" ||
      value.nightNumber !== 1 || value.taskType !== "CLOCKMAKER_INFORMATION" || !nonEmptyString(value.taskId) || !positiveInteger(value.settlementCharacterStateRevision) ||
      value.identityModel !== "NATIVE_CHARACTER_TYPE_ONLY" || value.ringSeatCount !== 12 || !validSourceContractShape(value.sourceContract) ||
      value.sourceContract.taskId !== value.taskId || !nonEmptyString(value.deliveryId) || !parseClockmakerDeliveryId(value.deliveryId).valid ||
      !Array.isArray(value.nativeDemonReferences) || !dense(value.nativeDemonReferences) || value.nativeDemonReferences.length !== 1 || !validReferenceShape(value.nativeDemonReferences[0]) ||
      !Array.isArray(value.nativeMinionReferences) || !dense(value.nativeMinionReferences) || value.nativeMinionReferences.length !== 2 || value.nativeMinionReferences.some((entry) => !validReferenceShape(entry)) ||
      !Array.isArray(value.pairDistanceSnapshots) || !dense(value.pairDistanceSnapshots) || value.pairDistanceSnapshots.length !== 2 || value.pairDistanceSnapshots.some((entry) => !validPairShape(entry)) ||
      !CLOCKMAKER_DISTANCE_DOMAIN.includes(value.ruleCorrectDistance as ClockmakerDistance) || !validEffectivenessShape(value.sourceEffectiveness) || !validConstraintShape(value.vortoxConstraint) ||
      !Array.isArray(value.outputDomain) || !dense(value.outputDomain) || value.outputDomain.length !== 7 || value.outputDomain.some((entry, index) => entry !== index) ||
      !Array.isArray(value.legalCandidateDistances) || !dense(value.legalCandidateDistances) || value.legalCandidateDistances.length === 0 ||
      value.legalCandidateDistances.some((entry) => !CLOCKMAKER_DISTANCE_DOMAIN.includes(entry as ClockmakerDistance)) || new Set(value.legalCandidateDistances).size !== value.legalCandidateDistances.length ||
      value.legalCandidateDistances.some((entry, index, array) => index > 0 && (array[index - 1] as number) >= (entry as number)) ||
      !CLOCKMAKER_DISTANCE_DOMAIN.includes(value.selectedDistance as ClockmakerDistance) || !value.legalCandidateDistances.includes(value.selectedDistance) ||
      value.simulationPolicyVersion !== CLOCKMAKER_SIMULATION_POLICY_VERSION || !["RULE_CORRECT_REQUIRED", "DETERMINISTIC_SMALLEST_FALSE_HARMFUL_DEFAULT", "VORTOX_FALSE_REQUIRED_SMALLEST"].includes(value.simulationReason as string) ||
      !["RULE_CORRECT_EFFECTIVE", "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS", "VORTOX_CONSTRAINED_FALSE"].includes(value.informationReliability as string)) return fail("ClockmakerInformationDelivered must have exact canonical runtime shape");
  const parsed = parseClockmakerDeliveryId(value.deliveryId);
  if (!parsed.valid || parsed.taskId !== value.taskId || parsed.settlementCharacterStateRevision !== value.settlementCharacterStateRevision) return fail("Clockmaker delivery ID must reproduce task and settlement revision");
  const delivery = value as unknown as ClockmakerInformationDeliveredPayload;
  const demon = delivery.nativeDemonReferences[0];
  const [firstMinion, secondMinion] = delivery.nativeMinionReferences;
  if (delivery.sourceContract.kind === "BASE_CLOCKMAKER" && !/^first-night-v1:CLOCKMAKER_INFORMATION:seat-(0[1-9]|1[0-2])$/.test(delivery.taskId) ||
      delivery.sourceContract.kind === "PHILOSOPHER_GAINED_CLOCKMAKER" && !/^first-night-v[12]:PHILOSOPHER_GAINED:CLOCKMAKER_INFORMATION:seat-(0[1-9]|1[0-2]):from-clockmaker$/.test(delivery.taskId)) {
    return fail("Clockmaker source kind and task ID grammar must agree");
  }
  if (demon.role.characterType !== "DEMON" || firstMinion.role.characterType !== "MINION" || secondMinion.role.characterType !== "MINION" ||
      firstMinion.seatNumber >= secondMinion.seatNumber || new Set([demon.playerId, firstMinion.playerId, secondMinion.playerId]).size !== 3 ||
      new Set([demon.seatNumber, firstMinion.seatNumber, secondMinion.seatNumber]).size !== 3) return fail("Clockmaker native references must be one Demon and two sorted distinct Minions");
  const expectedPairs = [firstMinion, secondMinion].map((minion): ClockmakerPairDistanceSnapshot => ({
    demonPlayerId: demon.playerId, demonSeatNumber: demon.seatNumber, minionPlayerId: minion.playerId, minionSeatNumber: minion.seatNumber,
    clockwiseDistance: (minion.seatNumber - demon.seatNumber + 12) % 12, counterClockwiseDistance: (demon.seatNumber - minion.seatNumber + 12) % 12,
    nearestDistance: calculateClockmakerPairDistance(demon.seatNumber, minion.seatNumber) as ClockmakerDistance
  }));
  if (delivery.pairDistanceSnapshots.some((pair, index) => !sameCanonicalDataValue(pair, expectedPairs[index]))) return fail("Clockmaker pair snapshots must reproduce native geometry");
  const truth = Math.min(expectedPairs[0]!.nearestDistance, expectedPairs[1]!.nearestDistance) as ClockmakerDistance;
  if (delivery.ruleCorrectDistance !== truth) return fail("Clockmaker rule-correct distance must be the nearest native pair");
  const expectedSelection = resolveClockmakerCandidates({ truth, source: delivery.sourceEffectiveness.kind === "KNOWN_DRUNK" ? "DRUNK" : "EFFECTIVE", vortoxFalseRequired: delivery.vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED" });
  const expectedReliability: ClockmakerInformationReliability = delivery.vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED" ? "VORTOX_CONSTRAINED_FALSE" :
    delivery.sourceEffectiveness.kind === "KNOWN_DRUNK" ? "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS" : "RULE_CORRECT_EFFECTIVE";
  if (!sameCanonicalDataValue(delivery.legalCandidateDistances, expectedSelection.legalCandidates) || delivery.selectedDistance !== expectedSelection.selectedDistance ||
      delivery.simulationReason !== expectedSelection.reason || delivery.informationReliability !== expectedReliability ||
      delivery.vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED" && delivery.vortoxConstraint.evaluatedCharacterStateRevision !== delivery.settlementCharacterStateRevision) {
    return fail("Clockmaker candidates, selection, policy, reliability, and constraint revision must be reproducible");
  }
  return { valid: true };
  } catch {
    return fail("ClockmakerInformationDelivered must fail closed for hostile runtime values");
  }
};

export const validateClockmakerKnownDrunkBinding = (input: {
  readonly delivery: ClockmakerInformationDeliveredPayload;
  readonly grants: GrantedAbilitySet;
  readonly impairments: AbilityImpairmentSet;
}): ValidationResult => {
  const shape = validateClockmakerInformationDeliveredPayloadShape(input.delivery);
  if (!shape.valid) return shape;
  if (!isDenseCanonicalArray(input.grants.abilities) || !isDenseCanonicalArray(input.impairments.impairments)) return fail("KNOWN_DRUNK source collections must be strict dense standard arrays");
  if (input.delivery.sourceEffectiveness.kind !== "KNOWN_DRUNK") return { valid: true };
  if (input.delivery.sourceContract.kind !== "BASE_CLOCKMAKER") return fail("Only the original base Clockmaker may use KNOWN_DRUNK");
  const id = input.delivery.sourceEffectiveness.representedImpairmentIds[0];
  const represented = input.impairments.impairments.filter((entry) => entry.impairmentId === id);
  if (represented.length !== 1 || represented[0] === undefined) return fail("KNOWN_DRUNK must bind exactly one preserved impairment");
  const impairment = represented[0];
  if (impairment.kind !== "DRUNK" || impairment.sourceKind !== "PHILOSOPHER_CHOSEN_DUPLICATE" || impairment.affectedPlayerId !== input.delivery.sourceContract.sourcePlayerId ||
      impairment.affectedSeatNumber !== input.delivery.sourceContract.sourceSeatNumber || !sameRoleSetupSnapshot(impairment.affectedRole, input.delivery.sourceContract.sourceRole) ||
      impairment.chosenRoleId !== "clockmaker" || impairment.sourceCharacterStateRevision > input.delivery.settlementCharacterStateRevision) return fail("KNOWN_DRUNK impairment must exactly affect the base Clockmaker at settlement");
  const grants = input.grants.abilities.filter((grant) => grant.sourcePlayerId === impairment.sourcePlayerId && grant.sourceCharacterStateRevision === impairment.sourceCharacterStateRevision &&
    grant.chosenRoleId === "clockmaker" && sameRoleSetupSnapshot(grant.chosenRole, impairment.affectedRole));
  if (grants.length !== 1 || grants[0] === undefined || impairment.impairmentId !== formatPhilosopherImpairmentId({ sourceSeatNumber: grants[0].sourceSeatNumber, affectedSeatNumber: impairment.affectedSeatNumber, chosenRoleId: roleId("clockmaker") })) return fail("KNOWN_DRUNK must bind one exact Philosopher grant and reproducible impairment ID");
  return { valid: true };
};

export const validateClockmakerHistoricalVortoxBinding = (input: {
  readonly delivery: ClockmakerInformationDeliveredPayload;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly roleTenures: RoleTenureState;
  readonly abilityImpairments?: AbilityImpairmentSet;
}): ValidationResult => {
  const shape = validateClockmakerInformationDeliveredPayloadShape(input.delivery);
  if (!shape.valid) return shape;
  if (!isDenseCanonicalArray(input.roleTenures.records) || !isDenseCanonicalArray(input.setup.roleCatalogSnapshot.roles) ||
      input.abilityImpairments !== undefined && !isDenseCanonicalArray(input.abilityImpairments.impairments)) return fail("Stored Vortox source collections must be strict dense standard arrays");
  const demon = input.delivery.nativeDemonReferences[0];
  const expectedVortox = catalogRole(input.setup, "vortox");
  if (expectedVortox === undefined || expectedVortox.characterType !== "DEMON") return fail("Stored Clockmaker history requires exact catalog Vortox");
  const nativeIsVortox = sameRoleSetupSnapshot(demon.role, expectedVortox);
  const constrained = input.delivery.vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED";
  if (nativeIsVortox !== constrained) return fail("Stored native Demon and Vortox constraint must satisfy the strict biconditional");
  const activeVortox = input.roleTenures.records.filter((tenure) => tenure.roleId === "vortox" && isRoleTenureActiveAt(tenure, input.delivery.settlementCharacterStateRevision));
  if (!constrained) return activeVortox.length === 0 ? { valid: true } : fail("NONE forbids a conflicting active Vortox tenure at settlement");
  const constraint = input.delivery.vortoxConstraint;
  if (constraint.evaluatedCharacterStateRevision !== input.delivery.settlementCharacterStateRevision || constraint.vortoxPlayerId !== demon.playerId || constraint.vortoxSeatNumber !== demon.seatNumber) return fail("Vortox constraint must match native Demon player, seat, and settlement revision");
  const matching = activeVortox.filter((tenure) => tenure.roleTenureId === constraint.vortoxRoleTenureId);
  if (activeVortox.length !== 1 || matching.length !== 1 || matching[0] === undefined) return fail("Stored Vortox constraint requires one exact active tenure");
  const tenure = matching[0];
  const parsed = parseRoleTenureId(tenure.roleTenureId);
  if (tenure.playerId !== demon.playerId || tenure.seatNumber !== demon.seatNumber || tenure.roleId !== "vortox" || !parsed.valid || parsed.roleId !== "vortox" ||
      parsed.seatNumber !== demon.seatNumber || parsed.acquiredCharacterStateRevision !== tenure.acquiredCharacterStateRevision || impairmentDisablesTenure(input.abilityImpairments, tenure, input.delivery.settlementCharacterStateRevision)) return fail("Stored Vortox tenure must exactly match the native Demon and remain effective at settlement");
  return { valid: true };
};

export const createClockmakerInformationDeliveredScheduledTaskSettlement = (
  delivery: ClockmakerInformationDeliveredPayload
): ScheduledTaskSettledPayload => ({
  rulesBaselineVersion: delivery.rulesBaselineVersion,
  taskId: delivery.taskId,
  taskType: "CLOCKMAKER_INFORMATION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "CLOCKMAKER_INFORMATION_DELIVERED",
  characterStateRevision: delivery.settlementCharacterStateRevision
});

export const resolveClockmakerSourceEffectiveness = (input: {
  readonly contract: ClockmakerSourceContract;
  readonly settlementRevision: number;
  readonly grants: GrantedAbilitySet;
  readonly impairments?: AbilityImpairmentSet;
}): { readonly valid: true; readonly effectiveness: ClockmakerSourceEffectiveness } | { readonly valid: false; readonly reason: string } => {
  if (!isCanonicalDataValue(input.contract) || !isDenseCanonicalArray(input.grants.abilities) ||
      input.impairments !== undefined && !isDenseCanonicalArray(input.impairments.impairments)) return { valid: false, reason: "Clockmaker effectiveness inputs must use canonical dense data" };
  const relevant = (input.impairments?.impairments ?? []).filter((entry) =>
    entry.affectedPlayerId === input.contract.sourcePlayerId && entry.affectedSeatNumber === input.contract.sourceSeatNumber &&
    entry.sourceCharacterStateRevision <= input.settlementRevision &&
    sameRoleSetupSnapshot(entry.affectedRole, input.contract.kind === "BASE_CLOCKMAKER" ? input.contract.sourceRole : input.contract.gainedRole)
  );
  if (input.contract.kind === "PHILOSOPHER_GAINED_CLOCKMAKER") return relevant.length === 0
    ? { valid: true, effectiveness: { kind: "EFFECTIVE", representedImpairmentIds: [] } }
    : { valid: false, reason: "Impaired Philosopher-gained Clockmaker is unsupported" };
  if (relevant.length === 0) return { valid: true, effectiveness: { kind: "EFFECTIVE", representedImpairmentIds: [] } };
  if (relevant.length !== 1 || relevant[0] === undefined || relevant[0].kind !== "DRUNK" || relevant[0].sourceKind !== "PHILOSOPHER_CHOSEN_DUPLICATE") return { valid: false, reason: "Base Clockmaker impairment must be one exact Philosopher duplicate drunkenness" };
  const effectiveness: ClockmakerSourceEffectiveness = { kind: "KNOWN_DRUNK", representedImpairmentIds: [relevant[0].impairmentId], sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" };
  return { valid: true, effectiveness };
};

export const validateClockmakerInformationAgainstCanonicalState = (input: {
  readonly delivery: ClockmakerInformationDeliveredPayload;
  readonly firstNightTaskPlan: Pick<FirstNightTaskPlan, "taskPlanVersion" | "tasks">;
  readonly firstNightTaskProgress?: FirstNightTaskProgress;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roster: PlayerRoster;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly grants: GrantedAbilitySet;
  readonly insertions: FirstNightTaskInsertion;
  readonly roleTenures: RoleTenureState;
  readonly abilityImpairments?: AbilityImpairmentSet;
}): ValidationResult => {
  const shape = validateClockmakerInformationDeliveredPayloadShape(input.delivery);
  if (!shape.valid) return shape;
  const source = input.delivery.sourceContract.kind === "BASE_CLOCKMAKER"
    ? validateBaseClockmakerSourceContract({ contract: input.delivery.sourceContract, firstNightTaskPlan: input.firstNightTaskPlan, ...(input.firstNightTaskProgress === undefined ? {} : { firstNightTaskProgress: input.firstNightTaskProgress }), currentCharacterState: input.currentCharacterState, setup: input.setup })
    : validatePhilosopherGainedClockmakerSourceContract({ contract: input.delivery.sourceContract, firstNightTaskPlan: input.firstNightTaskPlan, ...(input.firstNightTaskProgress === undefined ? {} : { firstNightTaskProgress: input.firstNightTaskProgress }), currentCharacterState: input.currentCharacterState, setup: input.setup, grants: input.grants, insertions: input.insertions });
  if (!source.valid) return source;
  if (input.delivery.settlementCharacterStateRevision !== input.currentCharacterState.revision) return fail("Clockmaker settlement revision must equal current character state revision");
  const native = resolveClockmakerNativeReferences({ currentCharacterState: input.currentCharacterState, roster: input.roster, setup: input.setup });
  if (!native.valid) return native;
  const effectiveness = resolveClockmakerSourceEffectiveness({ contract: input.delivery.sourceContract, settlementRevision: input.currentCharacterState.revision, grants: input.grants, ...(input.abilityImpairments === undefined ? {} : { impairments: input.abilityImpairments }) });
  if (!effectiveness.valid) return effectiveness;
  const constraint = resolveClockmakerVortoxConstraint({ currentCharacterState: input.currentCharacterState, setup: input.setup, roleTenures: input.roleTenures, ...(input.abilityImpairments === undefined ? {} : { abilityImpairments: input.abilityImpairments }) });
  if (!constraint.valid) return constraint;
  const expected = createClockmakerInformationDeliveredPayload({
    rulesBaselineVersion: input.delivery.rulesBaselineVersion,
    sourceContract: input.delivery.sourceContract,
    settlementCharacterStateRevision: input.currentCharacterState.revision,
    nativeDemonReferences: [native.demon],
    nativeMinionReferences: native.minions,
    sourceEffectiveness: effectiveness.effectiveness,
    vortoxConstraint: constraint.constraint
  });
  if (!sameCanonicalDataValue(expected, input.delivery)) return fail("Clockmaker delivery must equal the complete canonical settlement-time resolution");
  const drunk = validateClockmakerKnownDrunkBinding({ delivery: input.delivery, grants: input.grants, impairments: input.abilityImpairments ?? { impairments: [] } });
  if (!drunk.valid) return drunk;
  return validateClockmakerHistoricalVortoxBinding({ delivery: input.delivery, setup: input.setup, roleTenures: input.roleTenures, ...(input.abilityImpairments === undefined ? {} : { abilityImpairments: input.abilityImpairments }) });
};

export const appendClockmakerInformationDelivery = (
  state: ClockmakerInformationSet | undefined,
  payload: ClockmakerInformationDeliveredPayload
): ClockmakerInformationSet => {
  const shape = validateClockmakerInformationDeliveredPayloadShape(payload);
  if (!shape.valid) throw new TypeError(shape.reason);
  if (state !== undefined && !isClockmakerInformationSetShape(state)) throw new TypeError("Clockmaker delivery collection must be one strict dense standard array");
  const current = state?.deliveries ?? [];
  if (current.some((entry) => entry.deliveryId === payload.deliveryId || entry.taskId === payload.taskId)) throw new TypeError("Clockmaker delivery and task must be unique");
  return { deliveries: [...current, structuredClone(payload)] };
};

export const hasClockmakerInformationForSettlement = (
  state: ClockmakerInformationSet | undefined,
  settlement: ScheduledTaskSettledPayload
): boolean => {
  if (state === undefined || !isClockmakerInformationSetShape(state)) return false;
  return state.deliveries.some((delivery) =>
    delivery.taskId === settlement.taskId && settlement.taskType === "CLOCKMAKER_INFORMATION" &&
    settlement.outcomeType === "CLOCKMAKER_INFORMATION_DELIVERED" && settlement.nightNumber === 1 &&
    delivery.settlementCharacterStateRevision === settlement.characterStateRevision &&
    delivery.rulesBaselineVersion === settlement.rulesBaselineVersion
  );
};

export const validateStoredClockmakerInformationDelivered = (input: {
  readonly rulesBaselineVersion: string;
  readonly delivery: unknown;
  readonly firstNightTaskPlan: Pick<FirstNightTaskPlan, "taskPlanVersion" | "tasks">;
  readonly roster: PlayerRoster;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly grants?: GrantedAbilitySet;
  readonly choices?: PhilosopherAbilityChoiceSet;
  readonly insertions?: FirstNightTaskInsertion;
  readonly impairments?: AbilityImpairmentSet;
  readonly roleTenures: RoleTenureState;
  readonly settlements: readonly unknown[];
}): ValidationResult => {
  const shape = validateClockmakerInformationDeliveredPayloadShape(input.delivery);
  if (!shape.valid) return shape;
  if (!isDenseCanonicalArray(input.firstNightTaskPlan.tasks) || !isDenseCanonicalArray(input.roster) ||
      !isDenseCanonicalArray(input.settlements) || !isDenseCanonicalArray(input.roleTenures.records) ||
      input.grants !== undefined && !isDenseCanonicalArray(input.grants.abilities) ||
      input.choices !== undefined && !isDenseCanonicalArray(input.choices.choices) ||
      input.insertions !== undefined && !isDenseCanonicalArray(input.insertions.insertions) ||
      input.impairments !== undefined && !isDenseCanonicalArray(input.impairments.impairments)) return fail("Stored Clockmaker collections must be strict dense standard arrays");
  const delivery = input.delivery as ClockmakerInformationDeliveredPayload;
  if (delivery.rulesBaselineVersion !== input.rulesBaselineVersion) return fail("Stored Clockmaker delivery rules baseline must match game state");
  const tasks = input.firstNightTaskPlan.tasks.filter((task) => task.taskId === delivery.taskId);
  const task = tasks[0];
  if (tasks.length !== 1 || task === undefined || task.taskType !== "CLOCKMAKER_INFORMATION" || task.taskClass !== "ROLE_INFORMATION") return fail("Stored Clockmaker delivery requires one exact planned information task");
  const contract = delivery.sourceContract;
  const expectedPhilosopher = catalogRole(input.setup, "philosopher");
  const expectedClockmaker = catalogRole(input.setup, "clockmaker");
  if (contract.kind === "BASE_CLOCKMAKER") {
    if (expectedClockmaker === undefined || !sameRoleSetupSnapshot(contract.sourceRole, expectedClockmaker) || task.source.kind !== "ROLE" ||
        contract.taskPlanVersion !== input.firstNightTaskPlan.taskPlanVersion || task.source.playerId !== contract.sourcePlayerId ||
        task.source.seatNumber !== contract.sourceSeatNumber || !sameRoleSetupSnapshot(task.source.role, contract.sourceRole) || contract.sourceRole.roleId !== "clockmaker") {
      return fail("Stored base Clockmaker source contract must match its exact historical task");
    }
  } else {
    if (expectedPhilosopher === undefined || expectedClockmaker === undefined || !sameRoleSetupSnapshot(contract.sourceRole, expectedPhilosopher) ||
        !sameRoleSetupSnapshot(contract.gainedRole, expectedClockmaker)) return fail("Stored gained Clockmaker contract requires exact catalog Philosopher and Clockmaker roles");
    if (task.source.kind !== "PHILOSOPHER_GAINED_ABILITY" || task.source.playerId !== contract.sourcePlayerId || task.source.seatNumber !== contract.sourceSeatNumber ||
        !sameRoleSetupSnapshot(task.source.sourceRole, contract.sourceRole) || !sameRoleSetupSnapshot(task.source.chosenRole, contract.gainedRole) ||
        task.source.opportunityId !== contract.grantedAtOpportunityId || task.source.sourceCharacterStateRevision !== contract.insertionCharacterStateRevision) {
      return fail("Stored gained Clockmaker source contract must match its exact historical task source");
    }
    const grants = input.grants?.abilities.filter((grant) => grant.grantId === contract.grantId) ?? [];
    const insertions = input.insertions?.insertions.filter((entry) => entry.taskId === contract.taskId) ?? [];
    const grant = grants[0]; const insertion = insertions[0];
    if (grants.length !== 1 || grant === undefined || insertions.length !== 1 || insertion === undefined ||
        grant.sourcePlayerId !== contract.sourcePlayerId || grant.sourceSeatNumber !== contract.sourceSeatNumber ||
        !sameRoleSetupSnapshot(grant.sourceRole, contract.sourceRole) || !sameRoleSetupSnapshot(grant.chosenRole, contract.gainedRole) || grant.chosenRoleId !== "clockmaker" ||
        grant.chosenRoleCatalogSignature !== input.setup.roleCatalogSnapshot.canonicalSignature ||
        grant.grantedAtTaskId !== contract.grantedAtTaskId || grant.grantedAtOpportunityId !== contract.grantedAtOpportunityId ||
        !matchesGainedClockmakerInsertion(insertion, task, contract)) {
      return fail("Stored gained Clockmaker delivery requires one exact grant and insertion chain");
    }
  }
  const rosterSource = input.roster.filter((entry) => entry.playerId === contract.sourcePlayerId && entry.seatNumber === contract.sourceSeatNumber);
  if (rosterSource.length !== 1) return fail("Stored Clockmaker source must match one historical roster entry");
  for (const reference of [...delivery.nativeDemonReferences, ...delivery.nativeMinionReferences]) {
    const rosterMatches = input.roster.filter((entry) => entry.playerId === reference.playerId && entry.seatNumber === reference.seatNumber);
    const catalog = catalogRole(input.setup, reference.role.roleId);
    if (rosterMatches.length !== 1 || catalog === undefined || !sameRoleSetupSnapshot(catalog, reference.role)) return fail("Stored Clockmaker native references must match roster and exact setup catalog snapshots");
  }
  const matchingSettlements = input.settlements.filter((candidate) => {
    const validation = validateScheduledTaskSettlementShape(candidate);
    return validation.valid && (candidate as ScheduledTaskSettlement).taskId === delivery.taskId;
  }) as readonly ScheduledTaskSettlement[];
  const settlement = matchingSettlements[0];
  if (matchingSettlements.length !== 1 || settlement === undefined || settlement.taskType !== "CLOCKMAKER_INFORMATION" ||
      settlement.outcomeType !== "CLOCKMAKER_INFORMATION_DELIVERED" || settlement.characterStateRevision !== delivery.settlementCharacterStateRevision) {
    return fail("Stored Clockmaker delivery requires one exact matching settlement");
  }
  const drunk = validateClockmakerKnownDrunkBinding({ delivery, grants: input.grants ?? { abilities: [] }, impairments: input.impairments ?? { impairments: [] } });
  if (!drunk.valid) return drunk;
  if (delivery.sourceEffectiveness.kind === "KNOWN_DRUNK") {
    const impairmentId = delivery.sourceEffectiveness.representedImpairmentIds[0];
    const impairment = input.impairments?.impairments.find((entry) => entry.impairmentId === impairmentId);
    const choices = input.choices?.choices.filter((choice) => choice.sourcePlayerId === impairment?.sourcePlayerId &&
      choice.sourceCharacterStateRevision === impairment.sourceCharacterStateRevision && choice.chosenRoleId === "clockmaker") ?? [];
    const choice = choices[0];
    const grants = input.grants?.abilities.filter((grant) => grant.sourcePlayerId === impairment?.sourcePlayerId &&
      grant.sourceCharacterStateRevision === impairment.sourceCharacterStateRevision && grant.chosenRoleId === "clockmaker") ?? [];
    const grant = grants[0];
    if (choices.length !== 1 || choice === undefined || grants.length !== 1 || grant === undefined ||
        grant.grantedAtTaskId !== choice.taskId || grant.grantedAtOpportunityId !== choice.opportunityId ||
        choice.roleCatalogSignature !== input.setup.roleCatalogSnapshot.canonicalSignature ||
        grant.chosenRoleCatalogSignature !== input.setup.roleCatalogSnapshot.canonicalSignature ||
        !sameRoleSetupSnapshot(grant.sourceRole, choice.sourceRole) || !sameRoleSetupSnapshot(grant.chosenRole, choice.chosenRole)) {
      return fail("Stored drunk Clockmaker requires one exact Philosopher choice, grant, and impairment chain");
    }
  }
  return validateClockmakerHistoricalVortoxBinding({ delivery, setup: input.setup, roleTenures: input.roleTenures,
    ...(input.impairments === undefined ? {} : { abilityImpairments: input.impairments }) });
};
