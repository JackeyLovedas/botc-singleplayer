import { describe, expect, it } from "vitest";
import {
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  abilityImpairmentId,
  actionOpportunityId,
  applyDomainEvent,
  applyDomainEventBatch,
  batchId,
  commandId,
  correlationId,
  createClockmakerInformationDeliveredPayload,
  createClockmakerInformationDeliveredScheduledTaskSettlement,
  DomainError,
  causationId,
  eventId,
  grantedAbilityId,
  hasClockmakerInformationForSettlement,
  rebuildGameState,
  resolveClockmakerNativeReferences,
  resolveClockmakerVortoxConstraint,
  roleId,
  validateDomainBatchSemantics,
  validateDomainEventStream
} from "@botc/domain-core";
import type {
  AnyDomainEventEnvelope,
  CharactersAssignedPayload,
  ClockmakerInformationDeliveredPayload,
  DomainEventEnvelope,
  FirstNightInitializedPayload,
  FirstNightTaskPlanCreatedPayload,
  GameState,
  InitialPrivateKnowledgeEstablishedPayload,
  SetupGeneratedPayload
} from "@botc/domain-core";
import {
  charactersAssignedEvent,
  charactersAssignedPhaseTransitionedEvent,
  firstNightInitializedEvent,
  firstNightTaskPlanCreatedEvent,
  gameCreatedEvent,
  initialPrivateKnowledgeEstablishedEvent,
  phaseTransitionedEvent,
  playerRosterCreatedEvent,
  scriptSelectedEvent,
  setupGeneratedEvent,
  setupPhaseTransitionedEvent,
  testAssignmentGenerator,
  testFirstNightTaskCatalog,
  testFirstNightTaskPlanner,
  testInitialPrivateKnowledgeBuilder,
  testSetupGenerator
} from "@botc/test-harness";

const exactRoleIds = [
  "clockmaker", "dreamer", "snake_charmer", "mathematician", "flowergirl", "town_crier", "seamstress",
  "mutant", "sweetheart", "witch", "cerenovus", "vortox"
].map(roleId);

const setupPayload = (): SetupGeneratedPayload => {
  const result = testSetupGenerator.generate({ scriptId: "sects-and-violets", rootSeed: gameCreatedEvent().payload.rootSeed, playerCount: 12, constraints: { exactRoleIds } });
  if (result.status === "failure") throw new Error(result.message);
  return { rulesBaselineVersion: RULES_BASELINE_VERSION, ...result.setup };
};
const assignmentPayload = (): CharactersAssignedPayload => {
  const setup = setupPayload();
  const roster = playerRosterCreatedEvent().payload;
  const result = testAssignmentGenerator.generate({ rootSeed: gameCreatedEvent().payload.rootSeed, rosterVersion: roster.rosterVersion, roster: roster.entries, actualRoles: setup.actualRoles, roleCatalogSignature: setup.roleCatalogSignature });
  if (result.status === "failure") throw new Error(result.message);
  return { rulesBaselineVersion: RULES_BASELINE_VERSION, ...result.assignment };
};
const firstNightPayload = (): FirstNightInitializedPayload => ({
  rulesBaselineVersion: RULES_BASELINE_VERSION, initializationVersion: SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION, nightNumber: 1,
  rosterVersion: playerRosterCreatedEvent().payload.rosterVersion, assignmentAlgorithmVersion: assignmentPayload().assignmentAlgorithmVersion,
  roleCatalogSignature: setupPayload().roleCatalogSignature
});
const knowledgePayload = (): InitialPrivateKnowledgeEstablishedPayload => {
  const result = testInitialPrivateKnowledgeBuilder.generate({ roster: playerRosterCreatedEvent().payload.entries, assignment: assignmentPayload().assignments, setup: setupPayload() });
  if (result.status === "failure") throw new Error(result.message);
  return { rulesBaselineVersion: RULES_BASELINE_VERSION, knowledgeModelVersion: SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
    knowledgeStage: INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE, rosterVersion: playerRosterCreatedEvent().payload.rosterVersion,
    assignmentAlgorithmVersion: assignmentPayload().assignmentAlgorithmVersion, roleCatalogSignature: setupPayload().roleCatalogSignature, entries: result.knowledge.entries };
};
const planPayload = (): FirstNightTaskPlanCreatedPayload => {
  const result = testFirstNightTaskPlanner.generate({ nightNumber: 1, setup: setupPayload(), roster: playerRosterCreatedEvent().payload.entries,
    assignment: assignmentPayload().assignments, firstNight: firstNightPayload(), initialPrivateKnowledge: knowledgePayload(), taskCatalogSnapshot: testFirstNightTaskCatalog });
  if (result.status === "failure") throw new Error(result.message);
  return { rulesBaselineVersion: RULES_BASELINE_VERSION, nightNumber: 1, taskPlanVersion: SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION,
    taskCatalogVersion: result.taskPlan.taskCatalogVersion, taskCatalogSignatureAlgorithm: result.taskPlan.taskCatalogSignatureAlgorithm,
    taskCatalogSignature: result.taskPlan.taskCatalogSignature, taskCatalogSnapshot: result.taskPlan.taskCatalogSnapshot,
    rosterVersion: result.taskPlan.rosterVersion, assignmentAlgorithmVersion: result.taskPlan.assignmentAlgorithmVersion,
    roleCatalogSignature: result.taskPlan.roleCatalogSignature, knowledgeModelVersion: result.taskPlan.knowledgeModelVersion,
    knowledgeStage: result.taskPlan.knowledgeStage, tasks: result.taskPlan.tasks };
};

const canonicalStream = (): readonly AnyDomainEventEnvelope[] => [
  gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent(), setupGeneratedEvent({ payload: setupPayload() }), setupPhaseTransitionedEvent(),
  playerRosterCreatedEvent(), charactersAssignedEvent({ payload: assignmentPayload() }), charactersAssignedPhaseTransitionedEvent(),
  firstNightInitializedEvent({ payload: firstNightPayload() }), initialPrivateKnowledgeEstablishedEvent({ payload: knowledgePayload() }),
  firstNightTaskPlanCreatedEvent({ payload: planPayload() })
];

const readyState = (): GameState => {
  const state = rebuildGameState(canonicalStream());
  const taskIndex = state.firstNightTaskPlan?.tasks.findIndex((task) => task.taskType === "CLOCKMAKER_INFORMATION") ?? -1;
  if (taskIndex < 0 || state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined || state.roster === undefined || state.setup === undefined || state.seamstressRoleTenureState === undefined) throw new Error("Expected canonical Clockmaker state");
  return { ...state, firstNightTaskProgress: { settlements: state.firstNightTaskPlan.tasks.slice(0, taskIndex).map((task) => ({
    taskId: task.taskId, taskType: task.taskType, nightNumber: 1, settlementVersion: "scheduled-task-settlement-v1",
    outcomeType: "PHILOSOPHER_DEFERRED", characterStateRevision: state.currentCharacterState!.revision
  })) } };
};

const canonicalDelivery = (state: GameState): ClockmakerInformationDeliveredPayload => {
  const task = state.firstNightTaskPlan?.tasks.find((candidate) => candidate.taskType === "CLOCKMAKER_INFORMATION");
  if (task === undefined || task.source.kind !== "ROLE" || state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined || state.roster === undefined || state.setup === undefined || state.seamstressRoleTenureState === undefined) throw new Error("Expected base Clockmaker task");
  const native = resolveClockmakerNativeReferences({ currentCharacterState: state.currentCharacterState, roster: state.roster.entries, setup: state.setup });
  const constraint = resolveClockmakerVortoxConstraint({ currentCharacterState: state.currentCharacterState, setup: state.setup, roleTenures: state.seamstressRoleTenureState });
  if (!native.valid) throw new Error(native.reason);
  if (!constraint.valid) throw new Error(constraint.reason);
  return createClockmakerInformationDeliveredPayload({ rulesBaselineVersion: RULES_BASELINE_VERSION,
    sourceContract: { kind: "BASE_CLOCKMAKER", taskId: task.taskId, sourcePlayerId: task.source.playerId, sourceSeatNumber: task.source.seatNumber,
      sourceRole: task.source.role, taskPlanVersion: state.firstNightTaskPlan.taskPlanVersion }, settlementCharacterStateRevision: state.currentCharacterState.revision,
    nativeDemonReferences: [native.demon], nativeMinionReferences: native.minions, sourceEffectiveness: { kind: "EFFECTIVE", representedImpairmentIds: [] }, vortoxConstraint: constraint.constraint });
};

const envelope = <T extends "ClockmakerInformationDelivered" | "ScheduledTaskSettled">(state: GameState, eventType: T, payload: DomainEventEnvelope<T>["payload"], offset: number): DomainEventEnvelope<T> => ({
  category: "domain", eventId: eventId(`clockmaker-event-${offset}`), gameId: state.gameId, eventSequence: state.lastEventSequence + offset,
  batchId: batchId("clockmaker-batch"), gameVersion: state.gameVersion + 1, eventType, eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION, commandId: commandId("clockmaker-command"), createdAt: "2026-07-11T08:00:00.000Z",
  correlationId: gameCreatedEvent().correlationId, causationId: gameCreatedEvent().causationId, payload
});
const batch = (state = readyState()) => {
  const delivery = canonicalDelivery(state);
  return [envelope(state, "ClockmakerInformationDelivered", delivery, 1), envelope(state, "ScheduledTaskSettled", createClockmakerInformationDeliveredScheduledTaskSettlement(delivery), 2)] as const;
};
const reverseKeys = <T extends object>(value: T): T => Object.fromEntries(Object.entries(value).reverse()) as T;

describe("Clockmaker replay and atomic batch semantics", () => {
  it("applies exactly InformationDelivered then ScheduledTaskSettled against pre-event state", () => {
    const state = readyState();
    const events = batch(state);
    expect(validateDomainBatchSemantics(state, events)).toBeUndefined();
    const rebuilt = applyDomainEventBatch(state, events);
    expect(rebuilt.clockmakerInformation?.deliveries).toStrictEqual([events[0].payload]);
    expect(rebuilt.firstNightTaskProgress?.settlements.at(-1)).toStrictEqual({
      taskId: events[1].payload.taskId, taskType: events[1].payload.taskType, nightNumber: 1,
      settlementVersion: events[1].payload.settlementVersion, outcomeType: events[1].payload.outcomeType,
      characterStateRevision: events[1].payload.characterStateRevision
    });
    expect(validateDomainEventStream([...canonicalStream(), ...events])).toBeUndefined();
  });

  it("accepts semantically identical reversed key order through replay and prospective validation", () => {
    const state = readyState();
    const events = batch(state);
    const payload = reverseKeys({
      ...events[0].payload,
      sourceContract: reverseKeys(events[0].payload.sourceContract),
      nativeDemonReferences: [reverseKeys(events[0].payload.nativeDemonReferences[0])],
      nativeMinionReferences: events[0].payload.nativeMinionReferences.map(reverseKeys),
      pairDistanceSnapshots: events[0].payload.pairDistanceSnapshots.map(reverseKeys),
      vortoxConstraint: reverseKeys(events[0].payload.vortoxConstraint)
    }) as unknown as ClockmakerInformationDeliveredPayload;
    const reordered: DomainEventEnvelope<"ClockmakerInformationDelivered"> = { ...events[0], payload };
    expect(validateDomainBatchSemantics(state, [reordered, events[1]])).toBeUndefined();
    expect(() => applyDomainEventBatch(state, [reordered, events[1]])).not.toThrow();
    expect(validateDomainEventStream([...canonicalStream(), reordered, events[1]])).toBeUndefined();
  });

  it("turns sparse and hostile replay payloads into stable domain validation failures", () => {
    const state = readyState();
    const events = batch(state);
    const sparse = new Array(2);
    const proxy = new Proxy(events[0].payload, {});
    for (const payload of [{ ...events[0].payload, pairDistanceSnapshots: sparse }, proxy]) {
      const hostile = { ...events[0], payload } as DomainEventEnvelope<"ClockmakerInformationDelivered">;
      expect(() => validateDomainBatchSemantics(state, [hostile, events[1]])).toThrow();
      expect(() => applyDomainEvent(state, hostile)).toThrow();
    }
  });

  it("prospectively rejects the complete corrupted batch without mutating pre-event state", () => {
    const state = readyState();
    const before = structuredClone(state);
    const events = batch(state);
    const corrupted = { ...events[0], payload: { ...events[0].payload, selectedDistance: events[0].payload.ruleCorrectDistance } };
    expect(() => applyDomainEventBatch(state, [corrupted, events[1]])).toThrow();
    expect(state).toStrictEqual(before);
    expect(state.clockmakerInformation).toBeUndefined();
  });

  it("rejects naked reversed partial duplicate extra and PhaseTransitioned batch shapes", () => {
    const state = readyState();
    const events = batch(state);
    const phase = { ...setupPhaseTransitionedEvent(), eventSequence: state.lastEventSequence + 3, gameVersion: state.gameVersion + 1,
      batchId: events[0].batchId, commandId: events[0].commandId, gameId: state.gameId };
    for (const candidate of [[events[0]], [events[1]], [events[1], events[0]], [events[0], events[0]], [...events, events[1]], [...events, phase]]) {
      expect(() => validateDomainBatchSemantics(state, candidate as readonly AnyDomainEventEnvelope[])).toThrow();
    }
  });

  it("rejects nonconsecutive and mixed batch command version and rules metadata", () => {
    const state = readyState();
    const events = batch(state);
    for (const second of [
      { ...events[1], eventSequence: events[1].eventSequence + 1 }, { ...events[1], batchId: batchId("other") },
      { ...events[1], commandId: commandId("other") }, { ...events[1], gameVersion: events[1].gameVersion + 1 },
      { ...events[1], rulesBaselineVersion: "other" }
    ]) expect(() => validateDomainBatchSemantics(state, [events[0], second])).toThrow();
  });

  it("rejects source revision native pair truth candidate policy and Vortox corruptions", () => {
    const state = readyState();
    const events = batch(state);
    const delivery = events[0].payload;
    const mutations: ClockmakerInformationDeliveredPayload[] = [
      { ...delivery, sourceContract: { ...delivery.sourceContract, sourcePlayerId: delivery.nativeMinionReferences[0].playerId } },
      { ...delivery, settlementCharacterStateRevision: delivery.settlementCharacterStateRevision + 1 },
      { ...delivery, nativeMinionReferences: [delivery.nativeMinionReferences[1], delivery.nativeMinionReferences[0]] },
      { ...delivery, pairDistanceSnapshots: [delivery.pairDistanceSnapshots[1], delivery.pairDistanceSnapshots[0]] },
      { ...delivery, ruleCorrectDistance: (delivery.ruleCorrectDistance === 1 ? 2 : 1) },
      { ...delivery, selectedDistance: delivery.ruleCorrectDistance },
      { ...delivery, simulationReason: "RULE_CORRECT_REQUIRED" },
      { ...delivery, vortoxConstraint: { kind: "NONE" } }
      ,{ ...delivery, sourceEffectiveness: { kind: "KNOWN_DRUNK", representedImpairmentIds: [abilityImpairmentId("forged")], sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" } }
      ,{ ...delivery, sourceContract: { kind: "PHILOSOPHER_GAINED_CLOCKMAKER", taskId: delivery.taskId, sourcePlayerId: delivery.sourceContract.sourcePlayerId,
        sourceSeatNumber: delivery.sourceContract.sourceSeatNumber, sourceRole: delivery.sourceContract.sourceRole, gainedRole: delivery.sourceContract.sourceRole,
        grantId: grantedAbilityId("forged"), grantedAtTaskId: delivery.taskId, grantedAtOpportunityId: actionOpportunityId("forged"), insertionCharacterStateRevision: 1 } }
    ];
    for (const payload of mutations) {
      const corrupted = envelope(state, "ClockmakerInformationDelivered", payload, 1);
      expect(() => validateDomainBatchSemantics(state, [corrupted, events[1]])).toThrow();
      expect(() => applyDomainEvent(state, corrupted)).toThrow();
    }
  });

  it("rejects Clockmaker-specific envelope identity timestamp correlation and causation corruption", () => {
    const state = readyState();
    const events = batch(state);
    for (const second of [
      { ...events[1], eventId: events[0].eventId }, { ...events[1], createdAt: "2026-07-11T08:00:01.000Z" },
      { ...events[1], correlationId: correlationId("other") }, { ...events[1], causationId: causationId("other") }
    ]) expect(() => validateDomainBatchSemantics(state, [events[0], second])).toThrow();
  });

  it("rejects duplicate replay and settlement linkage corruption", () => {
    const state = readyState();
    const events = batch(state);
    const delivered = applyDomainEvent(state, events[0]);
    expect(() => applyDomainEvent(delivered, { ...events[0], eventSequence: delivered.lastEventSequence + 1 })).toThrow();
    for (const payload of [
      { ...events[1].payload, taskId: state.firstNightTaskPlan!.tasks[0]!.taskId },
      { ...events[1].payload, outcomeType: "DREAMER_INFORMATION_DELIVERED" as const },
      { ...events[1].payload, characterStateRevision: events[1].payload.characterStateRevision + 1 }
    ]) expect(() => validateDomainBatchSemantics(state, [events[0], { ...events[1], payload }])).toThrow();
  });

  it("guards every stored Clockmaker delivery collection read before duplicate and settlement linkage iteration", () => {
    const state = readyState();
    const events = batch(state);
    const matching = events[0].payload;
    let getterCalls = 0;
    const partialWithLaterMatch = new Array(2) as ClockmakerInformationDeliveredPayload[];
    partialWithLaterMatch[1] = matching;
    const extraKey = [matching] as ClockmakerInformationDeliveredPayload[] & { extra?: boolean };
    extraKey.extra = true;
    const transparent = new Proxy([matching], {});
    const revocable = Proxy.revocable([matching], {}); revocable.revoke();
    const indexedGetter = new Array(2) as ClockmakerInformationDeliveredPayload[];
    Object.defineProperty(indexedGetter, 1, { enumerable: true, get: () => { getterCalls += 1; return matching; } });
    const hostileCollections = [partialWithLaterMatch, extraKey, transparent, revocable.proxy, indexedGetter];

    for (const deliveries of hostileCollections) {
      const malformedSet = { deliveries } as unknown as NonNullable<GameState["clockmakerInformation"]>;
      expect(hasClockmakerInformationForSettlement(malformedSet, events[1].payload)).toBe(false);

      const beforeDelivery = { ...state, clockmakerInformation: malformedSet };
      expect(() => applyDomainEvent(beforeDelivery, events[0])).toThrowError(DomainError);

      const delivered = applyDomainEvent(state, events[0]);
      const beforeSettlement = { ...delivered, clockmakerInformation: malformedSet };
      expect(() => applyDomainEvent(beforeSettlement, events[1])).toThrowError(DomainError);
    }
    expect(getterCalls).toBe(0);
  });
});
