import { describe, expect, it } from "vitest";
import {
  calculateClockmakerPairDistance,
  calculateClockmakerTruth,
  createClockmakerInformationDeliveredPayload,
  formatClockmakerDeliveryId,
  parseClockmakerDeliveryId,
  resolveClockmakerCandidates,
  resolveClockmakerNativeReferences,
  resolveClockmakerVortoxConstraint,
  validateBaseClockmakerSourceContract,
  validateClockmakerHistoricalVortoxBinding,
  validateClockmakerInformationDeliveredPayloadShape,
  validateClockmakerKnownDrunkBinding,
  validatePhilosopherGainedClockmakerSourceContract
} from "./clockmaker.js";
import type { ClockmakerInformationDeliveredPayload, ClockmakerNativeReference, ClockmakerVortoxConstraint } from "./clockmaker.js";
import { abilityImpairmentId, actionOpportunityId, eventId, grantedAbilityId, playerId, roleId, scheduledTaskId } from "./ids.js";
import { seatNumber } from "./player-roster.js";
import { formatPhilosopherGainedFirstNightTaskId, formatPhilosopherImpairmentId } from "./philosopher-ability.js";
import { formatRoleTenureId } from "./seamstress.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import type { FirstNightTaskPlan, ScheduledTask } from "./first-night-task-plan.js";
import type { PlayerRoster } from "./player-roster.js";
import type { AbilityImpairmentSet, FirstNightTaskInsertion, GrantedAbilitySet } from "./philosopher-ability.js";
import type { RoleTenureRecord, RoleTenureState } from "./seamstress.js";
import type { GeneratedSetup, RoleSetupSnapshot } from "./setup-types.js";
import { canActorSettleClockmakerInformation, validateSettleClockmakerInformationCommandPayload } from "./command.js";

const role = (id: string, characterType: RoleSetupSnapshot["characterType"] = "TOWNSFOLK", defaultAlignment: RoleSetupSnapshot["defaultAlignment"] = "GOOD"): RoleSetupSnapshot => ({
  roleId: roleId(id), characterType, defaultAlignment, edition: "sects-and-violets", setupModifier: { outsiderDelta: 0, townsfolkDelta: 0 }
});
const clockmaker = role("clockmaker");
const philosopher = role("philosopher");
const vortox = role("vortox", "DEMON", "EVIL");
const fangGu = role("fang_gu", "DEMON", "EVIL");
const witch = role("witch", "MINION", "EVIL");
const cerenovus = role("cerenovus", "MINION", "EVIL");
const filler = role("dreamer");
const setup: Pick<GeneratedSetup, "roleCatalogSnapshot"> = { roleCatalogSnapshot: {
  scriptId: "sects-and-violets", edition: "sects-and-violets", roleCatalogVersion: "snv-role-catalog-v1",
  canonicalSignature: "canonical-role-catalog-v1:60ac4718", roles: [clockmaker, philosopher, vortox, fangGu, witch, cerenovus, filler]
} };
const roster: PlayerRoster = Array.from({ length: 12 }, (_, index) => ({
  playerId: playerId(`player-${index + 1}`), seatNumber: seatNumber(index + 1), playerKind: index === 0 ? "HUMAN" as const : "AI" as const, displayName: `Player ${index + 1}`
}));
const state = (demonRole: RoleSetupSnapshot = vortox): CurrentCharacterStateSet => ({
  revision: 3,
  entries: roster.map((entry, index) => ({
    playerId: entry.playerId, seatNumber: entry.seatNumber,
    role: index === 0 ? clockmaker : index === 2 ? demonRole : index === 5 ? witch : index === 10 ? cerenovus : filler,
    currentAlignment: index === 2 || index === 5 || index === 10 ? "EVIL" as const : "GOOD" as const
  }))
});
const reference = (index: number, sourceRole: RoleSetupSnapshot): ClockmakerNativeReference => ({ playerId: roster[index]!.playerId, seatNumber: roster[index]!.seatNumber, role: sourceRole });
const vortoxTenure = (overrides: Partial<RoleTenureRecord> = {}): RoleTenureRecord => ({
  roleTenureId: formatRoleTenureId({ seatNumber: seatNumber(3), roleId: "vortox", acquiredCharacterStateRevision: 1 }),
  playerId: roster[2]!.playerId, seatNumber: seatNumber(3), roleId: "vortox", acquiredCharacterStateRevision: 1,
  startedBy: { kind: "CHARACTERS_ASSIGNED", sourceEventId: eventId("assigned"), sourceEventSequence: 1, characterStateRevision: 1 }, ...overrides
});
const tenures = (records: readonly RoleTenureRecord[] = [vortoxTenure()]): RoleTenureState => ({ records, processedTransitionFactIds: [] });
const baseContract = {
  kind: "BASE_CLOCKMAKER" as const, taskId: scheduledTaskId("first-night-v1:CLOCKMAKER_INFORMATION:seat-01"),
  sourcePlayerId: roster[0]!.playerId, sourceSeatNumber: seatNumber(1), sourceRole: clockmaker, taskPlanVersion: "first-night-task-plan-v1"
};
const delivery = (demonRole: RoleSetupSnapshot = vortox, constraint: ClockmakerVortoxConstraint = {
  kind: "VORTOX_FALSE_REQUIRED" as const, evaluatedCharacterStateRevision: 3, vortoxPlayerId: roster[2]!.playerId,
  vortoxSeatNumber: seatNumber(3), vortoxRoleTenureId: vortoxTenure().roleTenureId
}): ClockmakerInformationDeliveredPayload => createClockmakerInformationDeliveredPayload({
  rulesBaselineVersion: "phase-one-v2.1", sourceContract: baseContract, settlementCharacterStateRevision: 3,
  nativeDemonReferences: [reference(2, demonRole)], nativeMinionReferences: [reference(5, witch), reference(10, cerenovus)],
  sourceEffectiveness: { kind: "EFFECTIVE", representedImpairmentIds: [] }, vortoxConstraint: constraint
});
const reverseKeys = <T extends object>(value: T): T => Object.fromEntries(Object.entries(value).reverse()) as T;

describe("Clockmaker pure rules", () => {
  it("returns distance one for adjacent Demon and Minion seats", () => expect(calculateClockmakerPairDistance(1, 2)).toBe(1));
  it("keeps clockwise and counterclockwise wrap-around symmetric", () => {
    expect(calculateClockmakerPairDistance(12, 1)).toBe(1);
    expect(calculateClockmakerPairDistance(1, 12)).toBe(1);
  });
  it("returns distance six for opposite seats", () => expect(calculateClockmakerPairDistance(1, 7)).toBe(6));
  it("calculates both canonical Minion pairs and selects the nearest distance", () => expect(calculateClockmakerTruth(1, [4, 12])).toBe(1));
  it("rejects identical hostile and out-of-range seat values without throwing", () => {
    for (const value of [0, 13, 1.5, NaN, Infinity, "1", null]) expect(() => calculateClockmakerPairDistance(1, value)).toThrow(TypeError);
    expect(() => calculateClockmakerPairDistance(1, 1)).toThrow(TypeError);
  });
  it("effective source without Vortox permits and selects only truth", () => expect(resolveClockmakerCandidates({ truth: 3, source: "EFFECTIVE", vortoxFalseRequired: false })).toEqual({ legalCandidates: [3], selectedDistance: 3, reason: "RULE_CORRECT_REQUIRED" }));
  it("drunk source without Vortox retains every domain value including truth", () => {
    const result = resolveClockmakerCandidates({ truth: 0, source: "DRUNK", vortoxFalseRequired: false });
    expect(result.legalCandidates).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });
  it("drunk source selects the deterministic smallest false value", () => {
    const result = resolveClockmakerCandidates({ truth: 0, source: "DRUNK", vortoxFalseRequired: false });
    expect(result.selectedDistance).toBe(1);
  });
  it("pure poisoned helper retains truth and selects the smallest false value without Vortox", () => {
    const result = resolveClockmakerCandidates({ truth: 2, source: "POISONED", vortoxFalseRequired: false });
    expect(result.legalCandidates).toStrictEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(result.selectedDistance).toBe(0);
  });
  it.each([
    ["effective Vortox excludes truth", "EFFECTIVE"],
    ["drunk plus Vortox excludes truth", "DRUNK"],
    ["pure poisoned plus Vortox excludes truth", "POISONED"]
  ] as const)("%s", (_name, source) => {
    const result = resolveClockmakerCandidates({ truth: 2, source, vortoxFalseRequired: true });
    expect(result.legalCandidates).not.toContain(2);
    expect(result.selectedDistance).toBe(0);
  });
  it("defines the exact dense Clockmaker domain zero through six", () => {
    expect(delivery().outputDomain).toStrictEqual([0, 1, 2, 3, 4, 5, 6]);
  });
  it("rejects malformed sparse duplicate unordered and nonfinite candidate values", () => {
    const stored = delivery();
    const sparse: number[] = []; sparse.length = 1;
    for (const legalCandidateDistances of [sparse, [0, 0, 1, 2, 3, 4], [1, 0, 2, 3, 4, 5], [0, 1, 2, 3, 4, Infinity]]) {
      expect(validateClockmakerInformationDeliveredPayloadShape({ ...stored, legalCandidateDistances })).toMatchObject({ valid: false });
    }
  });
  it("rejects every sparse Clockmaker tuple, partial hole, and nonstandard array property", () => {
    const stored = delivery();
    const sparse = (length: number): unknown[] => new Array(length) as unknown[];
    const partial = sparse(2); partial[1] = stored.nativeMinionReferences[1];
    const extra = [...stored.outputDomain] as number[] & { hidden?: boolean }; extra.hidden = true;
    const mutations: unknown[] = [
      { ...stored, nativeDemonReferences: sparse(1) },
      { ...stored, nativeMinionReferences: sparse(2) },
      { ...stored, pairDistanceSnapshots: sparse(2) },
      { ...stored, outputDomain: sparse(7) },
      { ...stored, legalCandidateDistances: sparse(stored.legalCandidateDistances.length) },
      { ...stored, sourceEffectiveness: { kind: "KNOWN_DRUNK", sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE", representedImpairmentIds: sparse(1) } },
      { ...stored, nativeMinionReferences: partial },
      { ...stored, outputDomain: extra }
    ];
    for (const mutation of mutations) {
      expect(() => validateClockmakerInformationDeliveredPayloadShape(mutation)).not.toThrow();
      expect(validateClockmakerInformationDeliveredPayloadShape(mutation)).toMatchObject({ valid: false });
    }
    expect(() => calculateClockmakerTruth(1, sparse(2))).toThrow(TypeError);
  });

  it("accepts insertion-order-independent canonical objects while preserving array order", () => {
    const stored = delivery();
    const reordered = reverseKeys({
      ...stored,
      sourceContract: reverseKeys(stored.sourceContract),
      nativeDemonReferences: [reverseKeys({ ...stored.nativeDemonReferences[0], role: reverseKeys(stored.nativeDemonReferences[0].role) })],
      nativeMinionReferences: stored.nativeMinionReferences.map((entry) => reverseKeys({ ...entry, role: reverseKeys(entry.role) })),
      pairDistanceSnapshots: stored.pairDistanceSnapshots.map(reverseKeys),
      vortoxConstraint: reverseKeys(stored.vortoxConstraint)
    });
    expect(validateClockmakerInformationDeliveredPayloadShape(reordered)).toStrictEqual({ valid: true });
    expect(validateClockmakerInformationDeliveredPayloadShape({ ...reordered, pairDistanceSnapshots: [...reordered.pairDistanceSnapshots].reverse() })).toMatchObject({ valid: false });
    expect(validateClockmakerInformationDeliveredPayloadShape({ ...reordered, selectedDistance: reordered.ruleCorrectDistance })).toMatchObject({ valid: false });
    expect(validateClockmakerInformationDeliveredPayloadShape({ ...reordered, sourceContract: { ...reordered.sourceContract, extra: true } })).toMatchObject({ valid: false });
    const { taskId: _taskId, ...missing } = reordered.sourceContract; void _taskId;
    expect(validateClockmakerInformationDeliveredPayloadShape({ ...reordered, sourceContract: missing })).toMatchObject({ valid: false });
  });

  it("fails closed for Proxy accessor symbol cycle and nonplain hostile payloads without invoking getters", () => {
    const stored = delivery();
    let getterCalls = 0;
    const accessor = { ...stored } as Record<string, unknown>;
    Object.defineProperty(accessor, "selectedDistance", { enumerable: true, get: () => { getterCalls += 1; return stored.selectedDistance; } });
    const symbol = { ...stored } as Record<PropertyKey, unknown>; symbol[Symbol("hidden")] = true;
    const cycle = { ...stored } as Record<string, unknown>; cycle.sourceContract = cycle;
    const proxy = new Proxy(stored, {});
    const { proxy: revoked, revoke } = Proxy.revocable(stored, {}); revoke();
    const sparseWithGetter = new Array(2) as unknown[];
    Object.defineProperty(sparseWithGetter, 1, { enumerable: true, get: () => { getterCalls += 1; return stored.nativeMinionReferences[1]; } });
    for (const hostile of [proxy, revoked, accessor, symbol, cycle, new Date(), { ...stored, nativeMinionReferences: sparseWithGetter }]) {
      expect(() => validateClockmakerInformationDeliveredPayloadShape(hostile)).not.toThrow();
      expect(validateClockmakerInformationDeliveredPayloadShape(hostile)).toMatchObject({ valid: false });
    }
    expect(getterCalls).toBe(0);
  });

  it("accepts null-prototype records and frozen standard arrays while rejecting nonstandard prototypes and negative zero", () => {
    const stored = delivery();
    const nullPrototype = Object.assign(Object.create(null) as Record<string, unknown>, stored);
    expect(validateClockmakerInformationDeliveredPayloadShape(nullPrototype)).toStrictEqual({ valid: true });
    class DomainArray extends Array<number> {}
    const subclass = new DomainArray(...stored.outputDomain);
    const alteredPrototype = [...stored.outputDomain]; Object.setPrototypeOf(alteredPrototype, null);
    const frozen = Object.freeze([...stored.outputDomain]);
    expect(validateClockmakerInformationDeliveredPayloadShape({ ...stored, outputDomain: frozen })).toStrictEqual({ valid: true });
    const negativeZero = [...stored.outputDomain]; negativeZero[0] = -0;
    for (const outputDomain of [subclass, alteredPrototype, negativeZero]) {
      expect(() => validateClockmakerInformationDeliveredPayloadShape({ ...stored, outputDomain })).not.toThrow();
      expect(validateClockmakerInformationDeliveredPayloadShape({ ...stored, outputDomain })).toMatchObject({ valid: false });
    }
  });
  it("fails closed when a required false candidate set is empty", () => {
    const stored = delivery();
    expect(validateClockmakerInformationDeliveredPayloadShape({ ...stored, legalCandidateDistances: [] })).toMatchObject({ valid: false });
  });
  it("keeps truth effectiveness Vortox legality and simulation reason separate", () => {
    const stored = delivery();
    expect(stored.ruleCorrectDistance).toBe(3);
    expect(stored.sourceEffectiveness.kind).toBe("EFFECTIVE");
    expect(stored.vortoxConstraint.kind).toBe("VORTOX_FALSE_REQUIRED");
    expect(stored.legalCandidateDistances).not.toContain(stored.ruleCorrectDistance);
    expect(stored.simulationReason).toBe("VORTOX_FALSE_REQUIRED_SMALLEST");
  });
});

describe("Clockmaker source and historical contracts", () => {
  it("accepts only exact System or Storyteller settlement commands", () => {
    const payload = { commandType: "SettleClockmakerInformation", taskId: baseContract.taskId };
    expect(validateSettleClockmakerInformationCommandPayload(payload)).toMatchObject({ valid: true });
    expect(validateSettleClockmakerInformationCommandPayload({ ...payload, hidden: true })).toMatchObject({ valid: false });
    expect(validateSettleClockmakerInformationCommandPayload({ ...payload, taskId: "first-night-v1:CLOCKMAKER_INFORMATION:seat-1" })).toMatchObject({ valid: false });
    expect(canActorSettleClockmakerInformation({ kind: "system", systemId: "application" })).toBe(true);
    expect(canActorSettleClockmakerInformation({ kind: "storyteller" })).toBe(true);
    expect(canActorSettleClockmakerInformation({ kind: "human", playerId: roster[0]!.playerId })).toBe(false);
    expect(canActorSettleClockmakerInformation({ kind: "ai", playerId: roster[1]!.playerId })).toBe(false);
  });

  it("fails closed when direct source validation receives transparent or revoked Proxy contracts", () => {
    const task: ScheduledTask = { taskId: baseContract.taskId, taskType: "CLOCKMAKER_INFORMATION", taskClass: "ROLE_INFORMATION", orderKey: { baseOrder: 800, insertionOrder: 0 },
      source: { kind: "ROLE", playerId: roster[0]!.playerId, seatNumber: seatNumber(1), role: clockmaker }, status: "PENDING", settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT" };
    const input = { firstNightTaskPlan: { taskPlanVersion: "first-night-task-plan-v1" as const, tasks: [task] }, currentCharacterState: state(), setup };
    const transparent = new Proxy(baseContract, {});
    const revocable = Proxy.revocable(baseContract, {}); revocable.revoke();
    for (const contract of [transparent, revocable.proxy]) {
      expect(() => validateBaseClockmakerSourceContract({ contract, ...input })).not.toThrow();
      expect(validateBaseClockmakerSourceContract({ contract, ...input })).toMatchObject({ valid: false });
    }
  });

  it("reproduces canonical base gained and delivery identifiers", () => {
    const base = formatClockmakerDeliveryId({ taskId: baseContract.taskId, settlementCharacterStateRevision: 3 });
    expect(base).toBe("clockmaker-delivery-v1:first-night-v1:CLOCKMAKER_INFORMATION:seat-01:settlement-revision-3");
    expect(parseClockmakerDeliveryId(base)).toStrictEqual({ valid: true, taskId: baseContract.taskId, settlementCharacterStateRevision: 3 });
    const gainedTask = formatPhilosopherGainedFirstNightTaskId({ taskType: "CLOCKMAKER_INFORMATION", sourceSeatNumber: seatNumber(2), chosenRoleId: roleId("clockmaker") });
    const gained = formatClockmakerDeliveryId({ taskId: gainedTask, settlementCharacterStateRevision: 2 });
    expect(parseClockmakerDeliveryId(gained)).toMatchObject({ valid: true, taskId: gainedTask });
    for (const hostile of [null, 7, "clockmaker-delivery-v1:first-night-v1:CLOCKMAKER_INFORMATION:seat-1:settlement-revision-3", `${base}x`]) {
      expect(parseClockmakerDeliveryId(hostile)).toMatchObject({ valid: false });
    }
  });

  it("validates base source task role current source and encoded seat", () => {
    const task: ScheduledTask = {
      taskId: baseContract.taskId, taskType: "CLOCKMAKER_INFORMATION", taskClass: "ROLE_INFORMATION", orderKey: { baseOrder: 800, insertionOrder: 0 },
      source: { kind: "ROLE", playerId: roster[0]!.playerId, seatNumber: seatNumber(1), role: clockmaker }, status: "PENDING", settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT"
    };
    const plan = { taskPlanVersion: "first-night-task-plan-v1", tasks: [task] } as Pick<FirstNightTaskPlan, "taskPlanVersion" | "tasks">;
    expect(validateBaseClockmakerSourceContract({ contract: baseContract, firstNightTaskPlan: plan, currentCharacterState: state(), setup })).toStrictEqual({ valid: true });
    expect(validateBaseClockmakerSourceContract({ contract: { ...baseContract, sourceSeatNumber: seatNumber(2) }, firstNightTaskPlan: plan, currentCharacterState: state(), setup })).toMatchObject({ valid: false });
    expect(validateBaseClockmakerSourceContract({ contract: { ...baseContract, hidden: true }, firstNightTaskPlan: plan, currentCharacterState: state(), setup })).toMatchObject({ valid: false });
  });

  it("validates the exact Philosopher Clockmaker grant and insertion source; rejects independently mismatched gained grant insertion opportunity player seat role and revision", () => {
    const taskId = formatPhilosopherGainedFirstNightTaskId({ taskType: "CLOCKMAKER_INFORMATION", sourceSeatNumber: seatNumber(2), chosenRoleId: roleId("clockmaker") });
    const opportunityId = actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-02:opportunity-01");
    const grantId = grantedAbilityId("philosopher-grant-v1:seat-02:from-clockmaker");
    const task: ScheduledTask = {
      taskId, taskType: "CLOCKMAKER_INFORMATION", taskClass: "ROLE_INFORMATION", orderKey: { baseOrder: 100, insertionOrder: 1 },
      source: { kind: "PHILOSOPHER_GAINED_ABILITY", playerId: roster[1]!.playerId, seatNumber: seatNumber(2), sourceRole: philosopher, chosenRole: clockmaker, opportunityId, sourceCharacterStateRevision: 3 },
      status: "PENDING", settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT"
    };
    const grant = { grantId, sourcePlayerId: roster[1]!.playerId, sourceSeatNumber: seatNumber(2), sourceRole: philosopher, sourceCharacterStateRevision: 3, chosenRole: clockmaker,
      chosenRoleId: roleId("clockmaker"), chosenRoleCatalogSignature: "catalog", grantedAtTaskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-02"), grantedAtOpportunityId: opportunityId };
    const grants: GrantedAbilitySet = { abilities: [grant] };
    const gainedSource = task.source as Extract<ScheduledTask["source"], { kind: "PHILOSOPHER_GAINED_ABILITY" }>;
    const insertions: FirstNightTaskInsertion = { insertions: [{ rulesBaselineVersion: "phase-one-v2.1", nightNumber: 1, taskPlanVersion: "first-night-task-plan-v1",
      taskId, taskType: "CLOCKMAKER_INFORMATION", taskClass: "ROLE_INFORMATION", orderKey: { baseOrder: 100, insertionOrder: 1 }, source: gainedSource,
      status: "PENDING", settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT", insertionReason: "PHILOSOPHER_GAINED_ABILITY", insertedByPlayerId: roster[1]!.playerId,
      insertedByOpportunityId: opportunityId, sourceCharacterStateRevision: 3, chosenRole: clockmaker }] };
    const baseCurrent = state();
    const current: CurrentCharacterStateSet = { ...baseCurrent, entries: baseCurrent.entries.map((entry, index) => index === 1 ? { ...entry, role: philosopher } : entry) };
    const contract = { kind: "PHILOSOPHER_GAINED_CLOCKMAKER" as const, taskId, sourcePlayerId: roster[1]!.playerId, sourceSeatNumber: seatNumber(2), sourceRole: philosopher,
      gainedRole: clockmaker, grantId, grantedAtTaskId: grant.grantedAtTaskId, grantedAtOpportunityId: opportunityId, insertionCharacterStateRevision: 3 };
    const input = { contract, firstNightTaskPlan: { tasks: [task] }, currentCharacterState: current, setup, grants, insertions };
    expect(validatePhilosopherGainedClockmakerSourceContract(input)).toStrictEqual({ valid: true });
    for (const changed of [
      { ...contract, grantId: grantedAbilityId("wrong") },
      { ...contract, insertionCharacterStateRevision: 2 },
      { ...contract, sourcePlayerId: roster[3]!.playerId },
      { ...contract, sourceSeatNumber: seatNumber(3) },
      { ...contract, grantedAtOpportunityId: actionOpportunityId("wrong-opportunity") },
      { ...contract, sourceRole: filler },
      { ...contract, gainedRole: filler }
    ]) {
      expect(validatePhilosopherGainedClockmakerSourceContract({ ...input, contract: changed })).toMatchObject({ valid: false });
    }
  });

  it("orders references and pair snapshots numerically independent of input order", () => {
    const result = resolveClockmakerNativeReferences({ currentCharacterState: state(), roster, setup });
    expect(result.valid).toBe(true);
    if (!result.valid) return;
    expect(result.minions.map((entry) => entry.seatNumber)).toStrictEqual([6, 11]);
    expect(result.pairs.map((entry) => entry.minionSeatNumber)).toStrictEqual([6, 11]);
    expect(result.truth).toBe(3);
  });

  it("classifies a good Demon and excludes an evil Townsfolk by native character type", () => {
    const current = state();
    const changed: CurrentCharacterStateSet = { ...current, entries: current.entries.map((entry, index) =>
      index === 2 ? { ...entry, currentAlignment: "GOOD" } : index === 4 ? { ...entry, currentAlignment: "EVIL" } : entry) };
    const result = resolveClockmakerNativeReferences({ currentCharacterState: changed, roster, setup });
    expect(result).toMatchObject({ valid: true, demon: { playerId: roster[2]!.playerId } });
    if (result.valid) expect(result.minions.map((entry) => entry.playerId)).not.toContain(roster[4]!.playerId);
  });

  it("requires exactly one native Demon", () => {
    const current = state();
    const withoutDemon = { ...current, entries: current.entries.map((entry, index) => index === 2 ? { ...entry, role: filler } : entry) };
    expect(resolveClockmakerNativeReferences({ currentCharacterState: withoutDemon, roster, setup })).toMatchObject({ valid: false });
  });

  it("requires exactly two native Minions", () => {
    const current = state();
    const oneMinion = { ...current, entries: current.entries.map((entry, index) => index === 10 ? { ...entry, role: filler } : entry) };
    expect(resolveClockmakerNativeReferences({ currentCharacterState: oneMinion, roster, setup })).toMatchObject({ valid: false });
  });

  it("rejects duplicate player or seat native references", () => {
    const current = state();
    const duplicatePlayer = { ...current, entries: current.entries.map((entry, index) => index === 1 ? { ...entry, playerId: current.entries[0]!.playerId } : entry) };
    const duplicateSeat = { ...current, entries: current.entries.map((entry, index) => index === 1 ? { ...entry, seatNumber: current.entries[0]!.seatNumber } : entry) };
    expect(resolveClockmakerNativeReferences({ currentCharacterState: duplicatePlayer, roster, setup })).toMatchObject({ valid: false });
    expect(resolveClockmakerNativeReferences({ currentCharacterState: duplicateSeat, roster, setup })).toMatchObject({ valid: false });
  });

  it("fails closed for a state requiring registration", () => {
    const recluse = role("recluse", "OUTSIDER");
    const current = state();
    const registrationState = { ...current, entries: current.entries.map((entry, index) => index === 4 ? { ...entry, role: recluse } : entry) };
    expect(resolveClockmakerNativeReferences({ currentCharacterState: registrationState, roster, setup })).toMatchObject({ valid: false });
  });

  it("fails closed for no Demon or no Minion without fabricating a positive result", () => {
    const current = state();
    const noDemon = { ...current, entries: current.entries.map((entry) => entry.role.characterType === "DEMON" ? { ...entry, role: filler } : entry) };
    const noMinion = { ...current, entries: current.entries.map((entry) => entry.role.characterType === "MINION" ? { ...entry, role: filler } : entry) };
    expect(resolveClockmakerNativeReferences({ currentCharacterState: noDemon, roster, setup })).toMatchObject({ valid: false });
    expect(resolveClockmakerNativeReferences({ currentCharacterState: noMinion, roster, setup })).toMatchObject({ valid: false });
  });

  it("fails closed for multiple Demons or a noncanonical Minion count", () => {
    const current = state();
    const multipleDemons = { ...current, entries: current.entries.map((entry, index) => index === 4 ? { ...entry, role: fangGu } : entry) };
    const threeMinions = { ...current, entries: current.entries.map((entry, index) => index === 4 ? { ...entry, role: witch } : entry) };
    expect(resolveClockmakerNativeReferences({ currentCharacterState: multipleDemons, roster, setup })).toMatchObject({ valid: false });
    expect(resolveClockmakerNativeReferences({ currentCharacterState: threeMinions, roster, setup })).toMatchObject({ valid: false });
  });

  it("rejects a base source that no longer currently holds Clockmaker", () => {
    const task: ScheduledTask = { taskId: baseContract.taskId, taskType: "CLOCKMAKER_INFORMATION", taskClass: "ROLE_INFORMATION", orderKey: { baseOrder: 800, insertionOrder: 0 },
      source: { kind: "ROLE", playerId: roster[0]!.playerId, seatNumber: seatNumber(1), role: clockmaker }, status: "PENDING", settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT" };
    const current = state();
    const changed = { ...current, entries: current.entries.map((entry, index) => index === 0 ? { ...entry, role: filler } : entry) };
    expect(validateBaseClockmakerSourceContract({ contract: baseContract, firstNightTaskPlan: { taskPlanVersion: "first-night-task-plan-v1", tasks: [task] }, currentCharacterState: changed, setup })).toMatchObject({ valid: false });
  });

  it("creates the exact effective base delivery snapshot and validates every nested shape", () => {
    const stored = delivery();
    expect(validateClockmakerInformationDeliveredPayloadShape(stored)).toStrictEqual({ valid: true });
    expect(stored.ruleCorrectDistance).toBe(3);
    expect(stored.selectedDistance).not.toBe(3);
    expect(stored.informationReliability).toBe("VORTOX_CONSTRAINED_FALSE");
    expect(validateClockmakerInformationDeliveredPayloadShape({ ...stored, hidden: true })).toMatchObject({ valid: false });
    expect(validateClockmakerInformationDeliveredPayloadShape({ ...stored, nativeDemonReferences: [{ ...stored.nativeDemonReferences[0], hidden: true }] })).toMatchObject({ valid: false });
    expect(validateClockmakerInformationDeliveredPayloadShape({ ...stored, outputDomain: [0, 1, 3, 4, 5, 6] })).toMatchObject({ valid: false });
  });

  it("binds canonical DRUNK to one exact preserved Philosopher grant and impairment", () => {
    const impairmentId = formatPhilosopherImpairmentId({ sourceSeatNumber: seatNumber(2), affectedSeatNumber: seatNumber(1), chosenRoleId: roleId("clockmaker") });
    const drunk = createClockmakerInformationDeliveredPayload({
      rulesBaselineVersion: "phase-one-v2.1", sourceContract: baseContract, settlementCharacterStateRevision: 3,
      nativeDemonReferences: [reference(2, fangGu)], nativeMinionReferences: [reference(5, witch), reference(10, cerenovus)],
      sourceEffectiveness: { kind: "KNOWN_DRUNK", representedImpairmentIds: [impairmentId], sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" }, vortoxConstraint: { kind: "NONE" }
    });
    const grants: GrantedAbilitySet = { abilities: [{ grantId: grantedAbilityId("grant"), sourcePlayerId: roster[1]!.playerId, sourceSeatNumber: seatNumber(2), sourceRole: philosopher,
      sourceCharacterStateRevision: 2, chosenRole: clockmaker, chosenRoleId: roleId("clockmaker"), chosenRoleCatalogSignature: "catalog",
      grantedAtTaskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-02"), grantedAtOpportunityId: actionOpportunityId("opportunity") }] };
    const impairments: AbilityImpairmentSet = { impairments: [{ impairmentId, kind: "DRUNK", sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE", sourcePlayerId: roster[1]!.playerId,
      affectedPlayerId: roster[0]!.playerId, affectedSeatNumber: seatNumber(1), affectedRole: clockmaker, chosenRoleId: roleId("clockmaker"), sourceCharacterStateRevision: 2 }] };
    expect(validateClockmakerKnownDrunkBinding({ delivery: drunk, grants, impairments })).toStrictEqual({ valid: true });
    expect(validateClockmakerKnownDrunkBinding({ delivery: drunk, grants, impairments: { impairments: [] } })).toMatchObject({ valid: false });
    expect(validateClockmakerKnownDrunkBinding({ delivery: drunk, grants, impairments: { impairments: [{ ...impairments.impairments[0]!, affectedPlayerId: roster[3]!.playerId }] } })).toMatchObject({ valid: false });
  });

  it("fails closed when a current Vortox has no active tenure", () => {
    expect(resolveClockmakerVortoxConstraint({ currentCharacterState: state(), setup, roleTenures: tenures([]) })).toMatchObject({ valid: false });
  });

  it("fails closed for multiple or conflicting active Vortox tenures", () => {
    expect(resolveClockmakerVortoxConstraint({ currentCharacterState: state(), setup, roleTenures: tenures([vortoxTenure(), { ...vortoxTenure(), roleTenureId: formatRoleTenureId({ seatNumber: seatNumber(3), roleId: "vortox", acquiredCharacterStateRevision: 2 }), acquiredCharacterStateRevision: 2 }]) })).toMatchObject({ valid: false });
  });

  it("fails closed for malformed Vortox impairment and represented impaired Vortox", () => {
    const poison: AbilityImpairmentSet = { impairments: [{ impairmentId: abilityImpairmentId("poison"), kind: "POISONED", sourceKind: "SNAKE_CHARMER_DEMON_HIT", sourcePlayerId: roster[4]!.playerId,
      affectedPlayerId: roster[2]!.playerId, affectedSeatNumber: seatNumber(3), affectedRole: vortox, sourceCharacterStateRevision: 2 }] };
    expect(resolveClockmakerVortoxConstraint({ currentCharacterState: state(), setup, roleTenures: tenures(), abilityImpairments: poison })).toMatchObject({ valid: false });
    const malformed = { impairments: [{ ...poison.impairments[0]!, affectedRole: { ...vortox, characterType: "TOWNSFOLK" } }] } as unknown as AbilityImpairmentSet;
    expect(resolveClockmakerVortoxConstraint({ currentCharacterState: state(), setup, roleTenures: tenures(), abilityImpairments: malformed })).toMatchObject({ valid: false });
  });

  it("rejects native Vortox plus missing tenure plus constraint downgraded to NONE", () => {
    expect(validateClockmakerHistoricalVortoxBinding({ delivery: delivery(vortox, { kind: "NONE" }), setup, roleTenures: tenures([]) })).toMatchObject({ valid: false });
  });

  it("rejects native Vortox plus constraint cross-linked to another player or seat", () => {
    const stored = delivery();
    expect(validateClockmakerHistoricalVortoxBinding({ delivery: { ...stored, vortoxConstraint: { ...stored.vortoxConstraint as Extract<typeof stored.vortoxConstraint, { kind: "VORTOX_FALSE_REQUIRED" }>, vortoxPlayerId: roster[3]!.playerId } }, setup, roleTenures: tenures() })).toMatchObject({ valid: false });
    expect(validateClockmakerHistoricalVortoxBinding({ delivery: { ...stored, vortoxConstraint: { ...stored.vortoxConstraint as Extract<typeof stored.vortoxConstraint, { kind: "VORTOX_FALSE_REQUIRED" }>, vortoxSeatNumber: seatNumber(4) } }, setup, roleTenures: tenures() })).toMatchObject({ valid: false });
  });

  it("rejects non-Vortox native Demon plus forged VORTOX_FALSE_REQUIRED", () => {
    expect(validateClockmakerHistoricalVortoxBinding({ delivery: delivery(fangGu), setup, roleTenures: tenures() })).toMatchObject({ valid: false });
  });

  it("rejects a valid-looking tenure and constraint whose identity differs from the native Demon", () => {
    const stored = delivery();
    const crossLinked = vortoxTenure({ playerId: roster[3]!.playerId });
    expect(validateClockmakerHistoricalVortoxBinding({ delivery: stored, setup, roleTenures: tenures([crossLinked]) })).toMatchObject({ valid: false });
    const wrongSeat = vortoxTenure({ seatNumber: seatNumber(4) });
    expect(validateClockmakerHistoricalVortoxBinding({ delivery: stored, setup, roleTenures: tenures([wrongSeat]) })).toMatchObject({ valid: false });
  });
});
