import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import * as domainCore from "@botc/domain-core";
import {
  MATHEMATICIAN_COUNT_DOMAIN,
  MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION,
  MATHEMATICIAN_FIXED_12_NUMBER_DOMAIN_VERSION,
  MATHEMATICIAN_INFORMATION_STAGE,
  MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION,
  MATHEMATICIAN_SMALLEST_FALSE_POLICY_VERSION,
  batchId,
  causationId,
  commandId,
  correlationId,
  createFirstNightTaskInsertedPayload,
  eventId,
  scheduledTaskId,
  applyDomainEvent,
  validateDomainBatchSemantics,
  formatFirstNightAbilityOutcomeFactId,
  parseMathematicianDeliveryId,
  rebuildGameState,
  validateFirstNightAbilityOutcomeFactShape,
  validateMathematicianInformationDeliveredPayloadShape
} from "@botc/domain-core";
import type { AnyDomainEventEnvelope, DomainEventEnvelope, GameState, MathematicianInformationDeliveredPayload } from "@botc/domain-core";
import {
  buildAiPrivateKnowledgeView,
  buildAiPrivateKnowledgeViewFromAcceptedEventStream,
  buildPlayerPrivateKnowledgeView,
  buildPlayerPrivateKnowledgeViewFromAcceptedEventStream
} from "@botc/projections";
import {
  applyMathematicianInformationDeliveredReplayAdapter,
  classifyValidatedMathematicianSupportStateForInternalValidation,
  classifyLegacyMathematicianSupport,
  mathematicianPipelineStatesMatchForInternalValidation,
  orderValidatedMathematicianGainedTasksForInternalValidation,
  resolveMathematicianCountFromValidatedFactsForInternalValidation,
  resolveMathematicianCandidatesForInternalValidation,
  resolveMathematicianInformationFromStateForInternalValidation,
  resolveMathematicianInformationDecisionFromAcceptedEventStream,
  resolveMathematicianVortoxConstraintForInternalValidation,
  replayTrustedMathematicianProjectionStream,
  validateStoredMathematicianInformationDelivered,
  validateProspectiveMathematicianInformationPair
} from "../../domain-core/src/mathematician-internal.js";
import {
  classifyMathematicianTerminalOutcomeForInternalValidation,
  deriveFirstNightAbilityOutcomeFact
} from "../../domain-core/src/first-night-ability-outcome-ledger.js";
import {
  settleBaseAndGainedMathematicianV2,
  philosopherAndBaseMathematicianVortoxExactRoleIds,
  settleBaseMathematician,
  settleBaseMathematicianWithVortox,
  mathematicianVortoxUnresolvedExactRoleIds,
  settleGainedMathematicianV2,
  reachBaseMathematicianTask
} from "./mathematician-test-fixtures.js";
import { createMathematicianServiceForStore } from "./mathematician-test-fixtures.js";
import type { CommandCommitStore, CommandReceipt } from "./ports/command-commit-store.js";

type Fixture = Awaited<ReturnType<typeof settleBaseMathematician>>;
let fixture: Fixture;
let deliveryEvent: DomainEventEnvelope<"MathematicianInformationDelivered">;
let settlementEvent: DomainEventEnvelope<"ScheduledTaskSettled">;
let delivery: MathematicianInformationDeliveredPayload;
let finalState: GameState;
const parsedDelivery = () => {
  const parsed = parseMathematicianDeliveryId(delivery.deliveryId);
  if (!parsed.valid) throw new Error(parsed.reason);
  return parsed;
};

const convertV2PhilosopherMathematicianChoiceStreamToV1 = (
  sourceEvents: readonly AnyDomainEventEnvelope[]
): readonly AnyDomainEventEnvelope[] => {
  const converted = structuredClone(sourceEvents) as AnyDomainEventEnvelope[];
  const planEvent = converted.find((event) => event.eventType === "FirstNightTaskPlanCreated");
  const choiceEvent = converted.find((event) => event.eventType === "PhilosopherAbilityChosen");
  const insertionIndex = converted.findIndex((event) => event.eventType === "FirstNightTaskInsertedV2");
  const insertionEvent = converted[insertionIndex];
  if (planEvent?.eventType !== "FirstNightTaskPlanCreated") throw new Error("Expected convertible plan");
  (planEvent.payload as unknown as { taskPlanVersion: string }).taskPlanVersion = "first-night-task-plan-v1";
  if (choiceEvent?.eventType === "PhilosopherAbilityChosen" && insertionEvent?.eventType === "FirstNightTaskInsertedV2") {
    const legacyInsertion = createFirstNightTaskInsertedPayload({
      rulesBaselineVersion: planEvent.rulesBaselineVersion,
      choice: choiceEvent.payload,
      firstNightTaskPlan: planEvent.payload
    });
    if (legacyInsertion === undefined) throw new Error("Expected legacy Math insertion");
    converted[insertionIndex] = { ...insertionEvent, eventType: "FirstNightTaskInserted", payload: legacyInsertion };
  }
  rebuildGameState(converted);
  return converted;
};

const preloadedStore = (initialEvents: readonly AnyDomainEventEnvelope[]) => {
  let events = [...initialEvents];
  const receipts = new Map<string, CommandReceipt>();
  let acceptedWrites = 0;
  let rejectedWrites = 0;
  const store: CommandCommitStore = {
    loadDomainEvents: () => Promise.resolve([...events]),
    findCommandReceipt: (_gameId, value) => Promise.resolve(receipts.get(value)),
    commitAcceptedCommand: (input) => {
      events = [...events, ...input.eventBatch.events];
      receipts.set(input.receipt.commandId, input.receipt);
      acceptedWrites += 1;
      return Promise.resolve();
    },
    recordRejectedCommand: (input) => {
      receipts.set(input.commandId, input.receipt);
      rejectedWrites += 1;
      return Promise.resolve();
    }
  };
  return { store, acceptedWrites: () => acceptedWrites, rejectedWrites: () => rejectedWrites };
};

const uniquePreloadedIds = () => {
  let eventNumber = 0;
  let batchNumber = 0;
  return {
    nextEventId: () => eventId(`preloaded-mathematician-event-${++eventNumber}`),
    nextBatchId: () => batchId(`preloaded-mathematician-batch-${++batchNumber}`)
  };
};

beforeAll(async () => {
  fixture = await settleBaseMathematician();
  if (fixture.result.status !== "accepted") throw new Error(`Mathematician settlement failed: ${JSON.stringify(fixture.result)}`);
  const deliveryCandidate = fixture.events.at(-2);
  const settlementCandidate = fixture.events.at(-1);
  if (deliveryCandidate?.eventType !== "MathematicianInformationDelivered" || settlementCandidate?.eventType !== "ScheduledTaskSettled") {
    throw new Error("Expected terminal Mathematician pair");
  }
  deliveryEvent = deliveryCandidate;
  settlementEvent = settlementCandidate;
  delivery = deliveryEvent.payload;
  finalState = rebuildGameState(fixture.events);
});

describe("Phase 3 Slice 2B18B Mathematician first-night information", () => {
  it("[APP-01] accepts the base Mathematician settlement", () => expect(fixture.result.status).toBe("accepted"));
  it("[APP-02] emits exactly the delivery and settlement summary", () => expect(fixture.result).toMatchObject({ eventTypes: ["MathematicianInformationDelivered", "ScheduledTaskSettled"] }));
  it("[RSP-03] rebuilds the accepted complete stream", () => expect(finalState.mathematicianInformation?.deliveries).toHaveLength(1));
  it("[RSP-04] stores the exact accepted payload", () => expect(finalState.mathematicianInformation?.deliveries[0]).toStrictEqual(delivery));
  it("[RSP-05] settles the exact Math task", () => expect(finalState.firstNightTaskProgress?.settlements.at(-1)?.taskId).toBe(delivery.taskId));
  it("[RSP-06] uses the Math settlement outcome", () => expect(finalState.firstNightTaskProgress?.settlements.at(-1)?.outcomeType).toBe("MATHEMATICIAN_INFORMATION_DELIVERED"));
  it("[RSP-07] appends exactly one terminal ledger fact", () => expect(finalState.firstNightAbilityOutcomeLedger?.facts.at(-1)?.sourceEventId).toBe(deliveryEvent.eventId));
  it("[RSP-08] uses the canonical fact ID", () => expect(finalState.firstNightAbilityOutcomeLedger?.facts.at(-1)?.auditFactId).toBe(formatFirstNightAbilityOutcomeFactId(deliveryEvent.eventId)));
  it("[RSP-09] does not create a settlement fact", () => expect(finalState.firstNightAbilityOutcomeLedger?.facts.some((fact) => fact.sourceEventId === settlementEvent.eventId)).toBe(false));
  it("[CSI-10] Layer A resolves the accepted prior stream", () => expect(resolveMathematicianInformationDecisionFromAcceptedEventStream(fixture.events.slice(0, -2), delivery.taskId).kind).toBe("READY"));
  it("[CSI-11] Layer A payload equals the accepted delivery", () => {
    const result = resolveMathematicianInformationDecisionFromAcceptedEventStream(fixture.events.slice(0, -2), delivery.taskId);
    expect(result.kind === "READY" ? result.deliveryPayload : undefined).toStrictEqual(delivery);
  });
  it("[CSI-12] Layer B accepts the exact pair", () => expect(validateProspectiveMathematicianInformationPair({ priorAcceptedEvents: fixture.events.slice(0, -2), deliveryEvent, settlementEvent })).toStrictEqual({ valid: true }));
  it("[RSP-13] binds the window to the preceding event", () => expect(delivery.windowSnapshot.endEventSequence).toBe(deliveryEvent.eventSequence - 1));
  it("[RSP-14] excludes the current delivery from its own fact IDs", () => expect(delivery.qualifyingAbnormalFactIds).not.toContain(formatFirstNightAbilityOutcomeFactId(deliveryEvent.eventId)));
  it("[RSP-15] remains in FIRST_NIGHT", () => expect(finalState.phase).toBe("FIRST_NIGHT"));
  it("[RSP-16] remains on night one", () => expect(finalState.nightNumber).toBe(1));
  it("[RSP-17] remains before day one", () => expect(finalState.dayNumber).toBe(0));
  it("[SHAPE-18] validates the exact 31-key payload", () => expect(validateMathematicianInformationDeliveredPayloadShape(delivery)).toStrictEqual({ valid: true }));
  it("[SHAPE-19] has exactly 31 enumerable payload keys", () => expect(Object.keys(delivery)).toHaveLength(31));
  it("[SHAPE-20] delivery ID round-trips", () => expect(parseMathematicianDeliveryId(delivery.deliveryId)).toMatchObject({ valid: true, taskId: delivery.taskId, generation: "BASE" }));
  it("[COUNT-21] uses the exact count model", () => expect(delivery.resolutionModelVersion).toBe(MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION));
  it("[COUNT-22] exposes the exact 0..11 domain internally", () => expect(delivery.candidateDomain).toStrictEqual(MATHEMATICIAN_COUNT_DOMAIN));
  it("[COUNT-23] uses the fixed-domain version", () => expect(delivery.numberDomainVersion).toBe(MATHEMATICIAN_FIXED_12_NUMBER_DOMAIN_VERSION));
  it("[COUNT-24] uses the deterministic policy", () => expect(delivery.simulationPolicyVersion).toBe(MATHEMATICIAN_SMALLEST_FALSE_POLICY_VERSION));
  it("[COUNT-25] selects the truth for an effective non-Vortox source", () => expect(delivery.selectedCount).toBe(delivery.trueCount));
  it("[COUNT-26] labels effective information as rule-correct", () => expect(delivery.informationReliability).toBe("RULE_CORRECT"));
  it("[COUNT-27] has no represented impairment", () => expect(delivery.sourceEffectiveness).toStrictEqual({ kind: "EFFECTIVE", representedImpairments: [] }));
  it("[COUNT-28] has no current Vortox constraint", () => expect(delivery.vortoxConstraint.kind).toBe("NONE_NO_CURRENT_VORTOX"));
  it("[PROJ-29] state-only player projection fails closed", () => expect(() => buildPlayerPrivateKnowledgeView(finalState, delivery.sourceContract.sourcePlayerId)).toThrow(/State-only/));
  it("[PROJ-30] state-only AI projection fails closed", () => expect(() => buildAiPrivateKnowledgeView(finalState, delivery.sourceContract.sourcePlayerId)).toThrow(/State-only/));
  it("[PROJ-31] full-stream player projection reveals only count", () => expect(buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(fixture.events, delivery.sourceContract.sourcePlayerId).mathematicianInformation).toStrictEqual({ count: delivery.selectedCount }));
  it("[PROJ-32] full-stream AI projection reveals the same count", () => expect(buildAiPrivateKnowledgeViewFromAcceptedEventStream(fixture.events, delivery.sourceContract.sourcePlayerId).mathematicianInformation).toStrictEqual({ count: delivery.selectedCount }));
  it("[PROJ-33] full-stream view records the exact model", () => expect(buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(fixture.events, delivery.sourceContract.sourcePlayerId).mathematicianKnowledgeModelVersion).toBe(MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION));
  it("[PROJ-34] full-stream view records the exact stage", () => expect(buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(fixture.events, delivery.sourceContract.sourcePlayerId).deliveredKnowledgeStages).toContain(MATHEMATICIAN_INFORMATION_STAGE));
  it("[PROJ-35] another player receives no Math count", () => {
    const other = finalState.roster!.entries.find((entry) => entry.playerId !== delivery.sourceContract.sourcePlayerId)!;
    expect(buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(fixture.events, other.playerId).mathematicianInformation).toBeUndefined();
  });
  it("[EXP-36] root exports the public payload validator", () => expect(typeof domainCore.validateMathematicianInformationDeliveredPayloadShape).toBe("function"));
  it("[EXP-37] root does not export Layer A", () => expect("resolveMathematicianInformationDecisionFromAcceptedEventStream" in domainCore).toBe(false));
  it("[EXP-38] root does not export Layer B", () => expect("validateProspectiveMathematicianInformationPair" in domainCore).toBe(false));
  it("[EXP-39] root does not export Layer C", () => expect("applyMathematicianInformationDeliveredReplayAdapter" in domainCore).toBe(false));
  it("[EXP-40] root exposes Mathematician delivery as a domain event type at runtime handling", () => expect(deliveryEvent.eventType).toBe("MathematicianInformationDelivered"));
  it("[CSI-STREAM-02] rejects a sparse accepted stream", () => {
    const prior = fixture.events.slice(0, -2);
    const sparse = prior.filter((_event, index) => index !== 1);
    expect(resolveMathematicianInformationDecisionFromAcceptedEventStream(sparse, delivery.taskId).kind)
      .toBe("CANONICAL_HISTORY_INVALID");
  });
  it("[CSI-STREAM-04] rejects a duplicate accepted event identity", () => {
    const prior = structuredClone(fixture.events.slice(0, -2));
    prior[1] = { ...prior[1]!, eventId: prior[0]!.eventId };
    expect(resolveMathematicianInformationDecisionFromAcceptedEventStream(prior, delivery.taskId).kind)
      .toBe("CANONICAL_HISTORY_INVALID");
  });
  it("[CSI-STREAM-09] leaves the caller event stream byte-for-byte unchanged", () => {
    const prior = structuredClone(fixture.events.slice(0, -2));
    const before = structuredClone(prior);
    resolveMathematicianInformationDecisionFromAcceptedEventStream(prior, delivery.taskId);
    expect(prior).toStrictEqual(before);
  });
});

describe("2B18B canonical ledger count partition and window", () => {
  const allClassifiedIds = () => [
    ...delivery.qualifyingAbnormalFactIds,
    ...delivery.excludedResolvingSourceFactIds,
    ...delivery.excludedOwnAbilityFactIds,
    ...delivery.ignoredNormalFactIds,
    ...delivery.ignoredPendingFactIds,
    ...delivery.redundantUnresolvedFactIds
  ].sort();
  const priorFacts = () => fixture.state.firstNightAbilityOutcomeLedger?.facts ?? [];
  const factsFor = (ids: readonly string[]) => priorFacts().filter((fact) => ids.includes(fact.auditFactId));

  it("[LEDGER-COUNT-11] resolves an empty qualifying set to zero distinct players", () => {
    expect(delivery.distinctAbnormalPlayers).toStrictEqual([]);
    expect(delivery.trueCount).toBe(0);
  });
  it("[LEDGER-COUNT-12] classifies every earlier NORMAL fact as ignored", () => expect(
    factsFor(delivery.ignoredNormalFactIds).every((fact) => fact.outcomeStatus === "NORMAL")
  ).toBe(true));
  it("[LEDGER-COUNT-13] classifies every earlier PENDING_TRIGGER fact as ignored", () => expect(
    factsFor(delivery.ignoredPendingFactIds).every((fact) => fact.outcomeStatus === "PENDING_TRIGGER")
  ).toBe(true));
  it("[LEDGER-COUNT-14] counts neither NORMAL nor PENDING_TRIGGER facts", () => expect(delivery.trueCount).toBe(0));
  it("[LEDGER-COUNT-15] keeps system information outside the terminal role ledger", () => {
    const systemInformationEventIds = fixture.events.filter((event) =>
      event.eventType === "MinionInformationDelivered" || event.eventType === "DemonInformationDelivered"
    ).map((event) => event.eventId);
    expect(priorFacts().some((fact) => systemInformationEventIds.includes(fact.sourceEventId))).toBe(false);
  });
  it("[LEDGER-WINDOW-16] starts immediately after first-night initialization", () => expect(delivery.windowSnapshot.startEventSequence)
    .toBe(fixture.state.firstNightInitializationProvenance?.eventSequence));
  it("[LEDGER-WINDOW-17] contains every classified fact inside the frozen lower and upper boundaries", () => expect(
    priorFacts().filter((fact) => allClassifiedIds().includes(fact.auditFactId)).every((fact) =>
      fact.sourceEventSequence > delivery.windowSnapshot.startEventSequence &&
      fact.sourceEventSequence <= delivery.windowSnapshot.endEventSequence
    )
  ).toBe(true));
  it("[LEDGER-PARTITION-24] partitions every prior terminal fact exactly once", () => expect(allClassifiedIds())
    .toStrictEqual(priorFacts().map((fact) => fact.auditFactId).sort()));
  it("[LEDGER-PARTITION-25] source exclusions match the resolving source player", () => expect(
    factsFor(delivery.excludedResolvingSourceFactIds).every((fact) => fact.sourcePlayerId === delivery.sourceContract.sourcePlayerId)
  ).toBe(true));
  it("[LEDGER-PARTITION-26] own-instance exclusions match the resolving ability instance", () => expect(
    factsFor(delivery.excludedOwnAbilityFactIds).every((fact) =>
      fact.abilityInstance.abilityInstanceId === delivery.resolvingAbilityInstanceId
    )
  ).toBe(true));
  it("[LEDGER-PARTITION-27] every qualifying fact is caused abnormal information from another ability", () => expect(
    factsFor(delivery.qualifyingAbnormalFactIds).every((fact) =>
      fact.outcomeStatus === "ABNORMAL" && fact.causedByAnotherCharacterAbility
    )
  ).toBe(true));
});

describe("2B18B accepted effective Vortox constraint and terminal cause", () => {
  let vortoxFixture: Awaited<ReturnType<typeof settleBaseMathematicianWithVortox>>;
  let vortoxDelivery: MathematicianInformationDeliveredPayload;
  let vortoxDeliveryEvent: DomainEventEnvelope<"MathematicianInformationDelivered">;
  let vortoxState: GameState;

  beforeAll(async () => {
    vortoxFixture = await settleBaseMathematicianWithVortox();
    if (vortoxFixture.result.status !== "accepted") throw new Error(`Vortox Math settlement failed: ${JSON.stringify({
      result: vortoxFixture.result,
      decision: resolveMathematicianInformationDecisionFromAcceptedEventStream(vortoxFixture.events, vortoxFixture.task.taskId)
    })}`);
    const event = vortoxFixture.events.at(-2);
    if (event?.eventType !== "MathematicianInformationDelivered") throw new Error("Expected Vortox Math delivery");
    vortoxDeliveryEvent = event;
    vortoxDelivery = event.payload;
    vortoxState = rebuildGameState(vortoxFixture.events);
  });

  it("[VORTOX-56] resolves an effective current Vortox as false-required", () => expect(vortoxDelivery.vortoxConstraint.kind)
    .toBe("VORTOX_FALSE_REQUIRED"));
  it("[VORTOX-50] excludes the true count from legal candidates", () => expect(vortoxDelivery.legalCandidateCounts)
    .toStrictEqual(MATHEMATICIAN_COUNT_DOMAIN.filter((value) => value !== vortoxDelivery.trueCount)));
  it("[VORTOX-51-52] deterministically selects the smallest false count", () => expect(vortoxDelivery.selectedCount)
    .toBe(vortoxDelivery.trueCount === 0 ? 1 : 0));
  it("[VORTOX-RELIABILITY] labels the delivered value as Vortox-constrained false", () => expect(vortoxDelivery.informationReliability)
    .toBe("VORTOX_CONSTRAINED_FALSE"));
  it("[VORTOX-SOURCE] does not misclassify the Mathematician source as impaired", () => expect(vortoxDelivery.sourceEffectiveness.kind)
    .toBe("EFFECTIVE"));
  it("[VORTOX-112] records the exact abnormal terminal cause", () => expect(
    vortoxState.firstNightAbilityOutcomeLedger?.facts.find((fact) => fact.sourceEventId === vortoxDeliveryEvent.eventId)
  ).toMatchObject({ outcomeStatus: "ABNORMAL", causeKind: "VORTOX_FALSE_INFORMATION", causedByAnotherCharacterAbility: true }));
  it("[VORTOX-59] records Vortox role and active-tenure evidence", () => {
    const evidence = vortoxState.firstNightAbilityOutcomeLedger!.facts.find((fact) =>
      fact.sourceEventId === vortoxDeliveryEvent.eventId
    )!.evidenceReferences;
    expect(evidence.map((entry) => entry.kind)).toEqual(expect.arrayContaining(["PLAYER_ROLE_AT_REVISION", "ROLE_TENURE"]));
  });
  it("[ORIGINAL-60] leaves the Vortox constraint unresolved when its active tenure is missing", () => {
    const state = structuredClone(rebuildGameState(vortoxFixture.events.slice(0, -2)));
    const tenures = state.seamstressRoleTenureState!.records.filter((entry) => entry.roleId !== "vortox");
    (state.seamstressRoleTenureState as unknown as { records: typeof tenures }).records = tenures;
    expect(resolveMathematicianVortoxConstraintForInternalValidation(state)).toBeUndefined();
  });
  it("[ORIGINAL-61] leaves the Vortox constraint unresolved for conflicting current Vortox identities", () => {
    const state = structuredClone(rebuildGameState(vortoxFixture.events.slice(0, -2)));
    const vortox = state.currentCharacterState!.entries.find((entry) => entry.role.roleId === "vortox")!;
    const other = state.currentCharacterState!.entries.find((entry) => entry.playerId !== vortox.playerId)!;
    (state.currentCharacterState as unknown as { entries: unknown[] }).entries.push({
      ...structuredClone(vortox), playerId: other.playerId, seatNumber: other.seatNumber
    });
    expect(resolveMathematicianVortoxConstraintForInternalValidation(state)).toBeUndefined();
  });
  it("[VORTOX-62] projects only the selected count and hides the constraint", () => expect(
    buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(
      vortoxFixture.events, vortoxDelivery.sourceContract.sourcePlayerId
    ).mathematicianInformation
  ).toStrictEqual({ count: vortoxDelivery.selectedCount }));
  it("[VORTOX-REPLAY] validates the trusted historical checkpoint", () => {
    const replay = replayTrustedMathematicianProjectionStream(vortoxFixture.events);
    expect(validateStoredMathematicianInformationDelivered({
      acceptedEvents: vortoxFixture.events, checkpoint: replay.checkpoints[0]!, finalState: replay.finalState
    })).toStrictEqual({ valid: true });
  });
  it("[VORTOX-115] rejects a stored truth when Vortox requires false information", () => {
    const candidate = structuredClone(vortoxDeliveryEvent);
    (candidate.payload as unknown as { selectedCount: number }).selectedCount = candidate.payload.trueCount;
    expect(() => rebuildGameState([
      ...vortoxFixture.events.slice(0, -2),
      candidate,
      vortoxFixture.events.at(-1)!
    ])).toThrow();
  });
});

describe("2B18B receipt-free unresolved and dependency failures", () => {
  it("[APP-UNRESOLVED-85] returns retryable receipt-free failure for a blocking unresolved ledger fact", async () => {
    const ready = await reachBaseMathematicianTask(mathematicianVortoxUnresolvedExactRoleIds);
    const before = await ready.commandStore.loadDomainEvents(fixture.command.gameId);
    const command = {
      ...fixture.command,
      commandId: commandId("mathematician-ledger-unresolved"),
      expectedGameVersion: ready.state.gameVersion,
      payload: { commandType: "SettleMathematicianInformation" as const, taskId: ready.task.taskId }
    };
    const result = await ready.service.execute(command);
    expect(result).toMatchObject({
      status: "failed", code: "DependencyExecutionFailed", failureStage: "first-night-role-information", retryable: true
    });
    expect(await ready.commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await ready.commandStore.loadDomainEvents(command.gameId)).toStrictEqual(before);
  });

  it("[APP-METADATA-FAULT] returns retryable receipt-free failure when deterministic ID generation throws", async () => {
    const ready = await reachBaseMathematicianTask();
    const prior = await ready.commandStore.loadDomainEvents(fixture.command.gameId);
    const loaded = preloadedStore(prior);
    const service = createMathematicianServiceForStore(loaded.store, {
      nextEventId: () => { throw new Error("injected event ID failure"); },
      nextBatchId: () => { throw new Error("injected batch ID failure"); }
    }).service;
    const command = {
      ...fixture.command,
      commandId: commandId("mathematician-id-dependency-failure"),
      expectedGameVersion: ready.state.gameVersion,
      payload: { commandType: "SettleMathematicianInformation" as const, taskId: ready.task.taskId }
    };
    const result = await service.execute(command);
    expect(result).toMatchObject({ status: "failed", code: "MetadataGenerationFailed", retryable: true });
    expect(loaded.acceptedWrites()).toBe(0);
    expect(loaded.rejectedWrites()).toBe(0);
    expect(await loaded.store.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await loaded.store.loadDomainEvents(command.gameId)).toStrictEqual(prior);
  });

  it("[APP-DEPENDENCY-86] catches an unexpected Layer A canonical-capture dependency failure without a receipt", async () => {
    const ready = await reachBaseMathematicianTask();
    const prior = await ready.commandStore.loadDomainEvents(fixture.command.gameId);
    const nonCloneable = [...prior];
    nonCloneable[0] = {
      ...nonCloneable[0]!,
      injectedCanonicalCaptureFault: () => "not cloneable"
    } as unknown as AnyDomainEventEnvelope;
    const loaded = preloadedStore(nonCloneable);
    const service = createMathematicianServiceForStore(loaded.store, uniquePreloadedIds()).service;
    const command = {
      ...fixture.command,
      commandId: commandId("mathematician-layer-a-dependency-failure"),
      expectedGameVersion: ready.state.gameVersion,
      payload: { commandType: "SettleMathematicianInformation" as const, taskId: ready.task.taskId }
    };
    const result = await service.execute(command);
    expect(result).toMatchObject({
      status: "failed", code: "DependencyExecutionFailed", failureStage: "first-night-role-information", retryable: true
    });
    expect(loaded.acceptedWrites()).toBe(0);
    expect(loaded.rejectedWrites()).toBe(0);
    expect(await loaded.store.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await loaded.store.loadDomainEvents(command.gameId)).toStrictEqual(nonCloneable);
  });
});

describe("2B18B internal layer call-boundary contracts", () => {
  it("[LAYER-24] Layer A accepts exactly event stream and task ID", () => expect(
    resolveMathematicianInformationDecisionFromAcceptedEventStream.length
  ).toBe(2));
  it("[LAYER-25] Layer B accepts one prospective-pair carrier", () => expect(
    validateProspectiveMathematicianInformationPair.length
  ).toBe(1));
  it("[LAYER-15-27] Layer C accepts exactly pre-event state and current event", () => expect(
    applyMathematicianInformationDeliveredReplayAdapter.length
  ).toBe(2));
  it("[ORIGINAL-10] detects a Layer A versus pipeline rebuilt-state fingerprint mismatch", () => {
    const mismatched = structuredClone(fixture.state);
    (mismatched as unknown as { lastEventSequence: number }).lastEventSequence += 1;
    expect(mathematicianPipelineStatesMatchForInternalValidation(fixture.state, mismatched)).toBe(false);
  });
  it("[ROUND3-24] application uses event-stream Layer A and delegates prospective validation to Layer B", () => {
    const source = readFileSync(new URL("./game-application-service.ts", import.meta.url), "utf8");
    expect(source).toContain("resolveMathematicianInformationDecisionFromAcceptedEventStream(events, command.payload.taskId)");
    expect(source).toContain("validateProspectiveMathematicianInformationPair({");
    expect(source).not.toContain("resolveMathematicianInformationFromStateForInternalValidation");
  });
  it("[ROUND3-25] event applier routes Mathematician delivery only through Layer C", () => {
    const source = readFileSync(new URL("../../domain-core/src/event-applier.ts", import.meta.url), "utf8");
    expect(source).toContain("applyMathematicianInformationDeliveredReplayAdapter");
    expect(source).not.toContain("resolveMathematicianInformationDecisionFromAcceptedEventStream");
    expect(source).not.toContain("validateProspectiveMathematicianInformationPair");
  });
  it("[ROUND3-26] rebuild loop has no Layer A call", () => {
    const source = readFileSync(new URL("../../domain-core/src/rebuild.ts", import.meta.url), "utf8");
    expect(source).not.toContain("resolveMathematicianInformationDecisionFromAcceptedEventStream");
  });
  it("[ROUND3-27] Layer C has neither EventStore nor complete-stream access", () => {
    const source = readFileSync(new URL("../../domain-core/src/mathematician-internal.ts", import.meta.url), "utf8");
    const start = source.indexOf("export const applyMathematicianInformationDeliveredReplayAdapter");
    const end = source.indexOf("export const validateStoredMathematicianInformationDelivered", start);
    const layerC = source.slice(start, end);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    expect(layerC).not.toMatch(/EventStore|acceptedEvents|rebuildGameState/);
  });
});

describe("2B18B validated Option A classifier contract", () => {
  const baseTask = {} as never;
  const gainedChain = {} as never;
  const v1Insertion = {} as never;
  const v2Insertion = { schedulingVersion: "philosopher-gained-task-scheduling-v2" } as never;
  const classify = (input: Parameters<typeof classifyLegacyMathematicianSupport>[0]) =>
    classifyLegacyMathematicianSupport(input);

  it("[CLASSIFIER-01] identifies supported base-only", () => expect(classify({
    taskPlanVersion: "first-night-task-plan-v1", baseTasks: [baseTask], gainedV1Chains: [], gainedV2Chains: [], recordedInsertions: []
  })).toBe("SUPPORTED_BASE_ONLY"));
  it("[CLASSIFIER-02] identifies supported V1 gained-only", () => expect(classify({
    taskPlanVersion: "first-night-task-plan-v1", baseTasks: [], gainedV1Chains: [gainedChain], gainedV2Chains: [], recordedInsertions: [v1Insertion]
  })).toBe("SUPPORTED_V1_GAINED_ONLY"));
  it("[CLASSIFIER-03] identifies supported V2 gained-only", () => expect(classify({
    taskPlanVersion: "first-night-task-plan-v2", baseTasks: [], gainedV1Chains: [], gainedV2Chains: [gainedChain], recordedInsertions: [v2Insertion]
  })).toBe("SUPPORTED_V2_GAINED_ONLY"));
  it("[CLASSIFIER-04] identifies supported V2 base plus gained", () => expect(classify({
    taskPlanVersion: "first-night-task-plan-v2", baseTasks: [baseTask], gainedV1Chains: [], gainedV2Chains: [gainedChain], recordedInsertions: [v2Insertion]
  })).toBe("SUPPORTED_V2_BASE_AND_GAINED"));
  it("[CLASSIFIER-05] identifies unsupported V1 base plus gained", () => expect(classify({
    taskPlanVersion: "first-night-task-plan-v1", baseTasks: [baseTask], gainedV1Chains: [gainedChain], gainedV2Chains: [], recordedInsertions: [v1Insertion]
  })).toBe("UNSUPPORTED_V1_BASE_AND_GAINED"));
  it("[CLASSIFIER-06] identifies mixed-generation invalidity", () => expect(classify({
    taskPlanVersion: "first-night-task-plan-v1", baseTasks: [], gainedV1Chains: [], gainedV2Chains: [gainedChain], recordedInsertions: [v2Insertion]
  })).toBe("INVALID_MIXED_GENERATION"));
  it("[CLASSIFIER-45] ignores a noncontractual latest-holder-count field", () => {
    const input = {
      taskPlanVersion: "first-night-task-plan-v1" as const,
      baseTasks: [baseTask], gainedV1Chains: [gainedChain], gainedV2Chains: [], recordedInsertions: [v1Insertion]
    };
    const withLatestHolderNoise = { ...input, latestHolderCount: 99 };
    expect(classify(withLatestHolderNoise)).toBe(classify(input));
  });
  it("[ORIGINAL-70] orders multiple validated gained tasks by stable source-seat insertion order", () => {
    const template = fixture.state.firstNightTaskPlan!.tasks.find((task) => task.taskType === "MATHEMATICIAN_INFORMATION")!;
    const seatEight = { ...template, taskId: scheduledTaskId("math-gained-seat-8"), orderKey: { ...template.orderKey, insertionOrder: 8 } };
    const seatThree = { ...template, taskId: scheduledTaskId("math-gained-seat-3"), orderKey: { ...template.orderKey, insertionOrder: 3 } };
    const ordered = orderValidatedMathematicianGainedTasksForInternalValidation({
      taskPlanVersion: "first-night-task-plan-v2", baseTasks: [], gainedV1Chains: [],
      gainedV2Chains: [{ task: seatEight } as never, { task: seatThree } as never], recordedInsertions: []
    });
    expect(ordered.map((task) => task.orderKey.insertionOrder)).toStrictEqual([3, 8]);
  });
  it("[OPTION-A-41] breaks equal gained-task order keys by canonical task ID", () => {
    const template = fixture.state.firstNightTaskPlan!.tasks.find((task) => task.taskType === "MATHEMATICIAN_INFORMATION")!;
    const second = { ...template, taskId: scheduledTaskId("math-gained-b"), orderKey: { ...template.orderKey, insertionOrder: 3 } };
    const first = { ...template, taskId: scheduledTaskId("math-gained-a"), orderKey: { ...template.orderKey, insertionOrder: 3 } };
    const ordered = orderValidatedMathematicianGainedTasksForInternalValidation({
      taskPlanVersion: "first-night-task-plan-v2", baseTasks: [], gainedV1Chains: [],
      gainedV2Chains: [{ task: second } as never, { task: first } as never], recordedInsertions: []
    });
    expect(ordered.map((task) => task.taskId)).toStrictEqual([first.taskId, second.taskId]);
  });
});

describe("2B18B candidate and terminal-evidence hostile semantics", () => {
  it("[ROUND3-33] freezes the complete Mathematician terminal cause matrix", () => expect([
    classifyMathematicianTerminalOutcomeForInternalValidation(5, 5, "RULE_CORRECT"),
    classifyMathematicianTerminalOutcomeForInternalValidation(5, 0, "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"),
    classifyMathematicianTerminalOutcomeForInternalValidation(5, 0, "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING"),
    classifyMathematicianTerminalOutcomeForInternalValidation(5, 0, "VORTOX_CONSTRAINED_FALSE")
  ]).toStrictEqual([
    { outcomeStatus: "NORMAL", causeKind: "NO_OTHER_CHARACTER_ABILITY", causedByAnotherCharacterAbility: false },
    { outcomeStatus: "ABNORMAL", causeKind: "SOURCE_DRUNKENNESS", causedByAnotherCharacterAbility: true },
    { outcomeStatus: "ABNORMAL", causeKind: "SOURCE_POISONING", causedByAnotherCharacterAbility: true },
    { outcomeStatus: "ABNORMAL", causeKind: "VORTOX_FALSE_INFORMATION", causedByAnotherCharacterAbility: true }
  ]));
  it("[HRS-CANDIDATE-46] effective positive truth selects truth", () => expect(
    resolveMathematicianCandidatesForInternalValidation(5, "EFFECTIVE", "NONE_NO_CURRENT_VORTOX")
  ).toStrictEqual({ legalCandidateCounts: [5], selectedCount: 5, informationReliability: "RULE_CORRECT" }));
  it("[HRS-CANDIDATE-47] known drunk truth zero selects one from the full domain", () => expect(
    resolveMathematicianCandidatesForInternalValidation(0, "KNOWN_DRUNK", "NONE_NO_CURRENT_VORTOX")
  ).toStrictEqual({
    legalCandidateCounts: [...MATHEMATICIAN_COUNT_DOMAIN], selectedCount: 1,
    informationReliability: "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"
  }));
  it("[HRS-CANDIDATE-48-49] known drunk positive truth selects zero while truth remains legal", () => expect(
    resolveMathematicianCandidatesForInternalValidation(5, "KNOWN_DRUNK", "NONE_NO_CURRENT_VORTOX")
  ).toStrictEqual({
    legalCandidateCounts: [...MATHEMATICIAN_COUNT_DOMAIN], selectedCount: 0,
    informationReliability: "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"
  }));
  it("[HRS-POISON-58A] known poisoned truth zero selects one from the full domain", () => expect(
    resolveMathematicianCandidatesForInternalValidation(0, "KNOWN_POISONED", "NONE_NO_CURRENT_VORTOX")
  ).toStrictEqual({
    legalCandidateCounts: [...MATHEMATICIAN_COUNT_DOMAIN], selectedCount: 1,
    informationReliability: "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING"
  }));
  it("[HRS-POISON-58B] known poisoned positive truth selects zero", () => expect(
    resolveMathematicianCandidatesForInternalValidation(5, "KNOWN_POISONED", "NONE_NO_CURRENT_VORTOX")
  ).toStrictEqual({
    legalCandidateCounts: [...MATHEMATICIAN_COUNT_DOMAIN], selectedCount: 0,
    informationReliability: "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING"
  }));
  it("[HRS-VORTOX-POISON-57-58] Vortox false-required overrides poisoned full-domain choice", () => expect(
    resolveMathematicianCandidatesForInternalValidation(5, "KNOWN_POISONED", "VORTOX_FALSE_REQUIRED")
  ).toStrictEqual({
    legalCandidateCounts: MATHEMATICIAN_COUNT_DOMAIN.filter((value) => value !== 5), selectedCount: 0,
    informationReliability: "VORTOX_CONSTRAINED_FALSE"
  }));
  it("[CANDIDATE-53] rejects sparse legal candidates", () => {
    const candidate = structuredClone(delivery);
    Reflect.deleteProperty(candidate.legalCandidateCounts, "0");
    expect(validateMathematicianInformationDeliveredPayloadShape(candidate).valid).toBe(false);
  });
  it("[CANDIDATE-54] rejects out-of-range legal candidates", () => {
    const candidate = structuredClone(delivery) as unknown as { legalCandidateCounts: number[] };
    candidate.legalCandidateCounts = [12];
    expect(validateMathematicianInformationDeliveredPayloadShape(candidate).valid).toBe(false);
  });
  it("[CANDIDATE-55] rejects duplicate legal candidates", () => {
    const candidate = structuredClone(delivery) as unknown as { legalCandidateCounts: number[] };
    candidate.legalCandidateCounts = [delivery.trueCount, delivery.trueCount];
    expect(validateMathematicianInformationDeliveredPayloadShape(candidate).valid).toBe(false);
  });
  it("[TERMINAL-113] rejects false information labelled effective and rule-correct", () => {
    const candidate = structuredClone(deliveryEvent);
    (candidate.payload as unknown as { selectedCount: number }).selectedCount = delivery.trueCount === 0 ? 1 : 0;
    expect(() => rebuildGameState([...fixture.events.slice(0, -2), candidate, settlementEvent])).toThrow();
  });
  it("[TERMINAL-114] stored-chain validation rejects missing Math delivery evidence", () => {
    const replay = replayTrustedMathematicianProjectionStream(fixture.events);
    const checkpoint = structuredClone(replay.checkpoints[0]!);
    const fact = checkpoint.stateAfterDelivery.firstNightAbilityOutcomeLedger!.facts.at(-1)!;
    (fact as unknown as { evidenceReferences: unknown[] }).evidenceReferences = fact.evidenceReferences.filter((entry) =>
      entry.kind !== "MATHEMATICIAN_DELIVERY"
    );
    expect(validateStoredMathematicianInformationDelivered({
      acceptedEvents: fixture.events, checkpoint, finalState: replay.finalState
    })).toMatchObject({ valid: false });
  });
  it("[PROJ-HISTORY-130] a later current-role snapshot cannot rewrite the stored delivery", () => {
    const replay = replayTrustedMathematicianProjectionStream(fixture.events);
    const later = structuredClone(replay.finalState);
    const source = later.currentCharacterState!.entries.find((entry) =>
      entry.playerId === delivery.sourceContract.sourcePlayerId
    )!;
    const otherRole = later.currentCharacterState!.entries.find((entry) => entry.playerId !== source.playerId)!.role;
    (later.currentCharacterState as unknown as { revision: number }).revision += 1;
    (source as unknown as { role: typeof source.role }).role = structuredClone(otherRole);
    expect(validateStoredMathematicianInformationDelivered({
      acceptedEvents: fixture.events, checkpoint: replay.checkpoints[0]!, finalState: later
    })).toStrictEqual({ valid: true });
    expect(later.mathematicianInformation?.deliveries[0]).toStrictEqual(delivery);
  });
});

describe("2B18B accepted Philosopher-gained V2 chain", () => {
  let gained: Awaited<ReturnType<typeof settleGainedMathematicianV2>>;
  let gainedDelivery: DomainEventEnvelope<"MathematicianInformationDelivered">;
  let gainedSettlement: DomainEventEnvelope<"ScheduledTaskSettled">;

  beforeAll(async () => {
    gained = await settleGainedMathematicianV2();
    if (gained.result.status !== "accepted") throw new Error(`V2 gained settlement failed: ${JSON.stringify(gained.result)}`);
    const candidateDelivery = gained.events.at(-2);
    const candidateSettlement = gained.events.at(-1);
    if (candidateDelivery?.eventType !== "MathematicianInformationDelivered" || candidateSettlement?.eventType !== "ScheduledTaskSettled") {
      throw new Error("Expected V2 gained terminal pair");
    }
    gainedDelivery = candidateDelivery;
    gainedSettlement = candidateSettlement;
  });

  it("[V2-CSI-01] settles a complete accepted gained-only V2 chain", () => expect(gained.result.status).toBe("accepted"));
  it("[V2-CSI-02] retains the exact choice fact", () => expect(gained.events.filter((event) => event.eventType === "PhilosopherAbilityChosen")).toHaveLength(1));
  it("[V2-CSI-03] retains the exact grant fact", () => expect(gained.events.filter((event) => event.eventType === "PhilosopherAbilityGranted")).toHaveLength(1));
  it("[V2-CSI-04] retains the exact V2 insertion fact", () => expect(gained.events.filter((event) => event.eventType === "FirstNightTaskInsertedV2")).toHaveLength(1));
  it("[V2-CSI-05] Layer A accepts the complete chain", () => expect(
    resolveMathematicianInformationDecisionFromAcceptedEventStream(gained.events.slice(0, -2), gainedDelivery.payload.taskId).kind
  ).toBe("READY"));
  it("[V2-CSI-06] freezes the V2 gained source contract", () => expect(gainedDelivery.payload.sourceContract.kind).toBe("PHILOSOPHER_GAINED_MATHEMATICIAN_V2"));
  it("[V2-CSI-07] freezes the V2 gained ability instance", () => expect(gainedDelivery.payload.sourceContract.abilityInstance.kind).toBe("PHILOSOPHER_GAINED_TASK_V2"));
  it("[V2-RSP-08] replays the complete accepted stream", () => expect(rebuildGameState(gained.events).mathematicianInformation?.deliveries).toHaveLength(1));
  it("[V2-RSP-09] captures and validates one trusted checkpoint", () => {
    const replay = replayTrustedMathematicianProjectionStream(gained.events);
    expect(replay.checkpoints).toHaveLength(1);
    expect(validateStoredMathematicianInformationDelivered({
      acceptedEvents: gained.events, checkpoint: replay.checkpoints[0]!, finalState: replay.finalState
    })).toStrictEqual({ valid: true });
  });
  it("[V2-APP-10] Layer B accepts the exact gained pair", () => expect(validateProspectiveMathematicianInformationPair({
    priorAcceptedEvents: gained.events.slice(0, -2), deliveryEvent: gainedDelivery, settlementEvent: gainedSettlement
  })).toStrictEqual({ valid: true }));
  it("[V2-PROJ-11] full-stream projection reveals only the selected count", () => expect(
    buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(gained.events, gainedDelivery.payload.sourceContract.sourcePlayerId).mathematicianInformation
  ).toStrictEqual({ count: gainedDelivery.payload.selectedCount }));
  it("[V2-HOSTILE-12] rejects a tampered choice-to-grant role cross-link", () => {
    const tampered = structuredClone(gained.events);
    const choice = tampered.find((event) => event.eventType === "PhilosopherAbilityChosen");
    if (choice?.eventType !== "PhilosopherAbilityChosen") throw new Error("Expected V2 choice");
    (choice.payload as unknown as { chosenRoleId: string }).chosenRoleId = "clockmaker";
    expect(resolveMathematicianInformationDecisionFromAcceptedEventStream(
      tampered.slice(0, -2), gainedDelivery.payload.taskId
    ).kind).toBe("CANONICAL_HISTORY_INVALID");
  });
});

describe("2B18B accepted Philosopher-gained V1 chain", () => {
  let priorEvents: readonly AnyDomainEventEnvelope[];
  let acceptedEvents: readonly AnyDomainEventEnvelope[];
  let v1Delivery: DomainEventEnvelope<"MathematicianInformationDelivered">;
  let v1Settlement: DomainEventEnvelope<"ScheduledTaskSettled">;

  beforeAll(async () => {
    const source = await settleGainedMathematicianV2();
    const converted = structuredClone(source.eventsAfterChoice) as AnyDomainEventEnvelope[];
    const planEvent = converted.find((event) => event.eventType === "FirstNightTaskPlanCreated");
    const choiceEvent = converted.find((event) => event.eventType === "PhilosopherAbilityChosen");
    const insertionIndex = converted.findIndex((event) => event.eventType === "FirstNightTaskInsertedV2");
    const insertionEvent = converted[insertionIndex];
    if (planEvent?.eventType !== "FirstNightTaskPlanCreated" || choiceEvent?.eventType !== "PhilosopherAbilityChosen" ||
        insertionEvent?.eventType !== "FirstNightTaskInsertedV2") throw new Error("Expected convertible V2 Philosopher chain");
    (planEvent.payload as unknown as { taskPlanVersion: string }).taskPlanVersion = "first-night-task-plan-v1";
    const legacyInsertion = createFirstNightTaskInsertedPayload({
      rulesBaselineVersion: planEvent.rulesBaselineVersion,
      choice: choiceEvent.payload,
      firstNightTaskPlan: planEvent.payload
    });
    if (legacyInsertion === undefined) throw new Error("Expected legacy Mathematician insertion");
    converted[insertionIndex] = {
      ...insertionEvent,
      eventType: "FirstNightTaskInserted",
      payload: legacyInsertion
    };
    const state = rebuildGameState(converted);
    const task = state.firstNightTaskPlan?.tasks[state.firstNightTaskProgress?.settlements.length ?? 0];
    if (task?.taskType !== "MATHEMATICIAN_INFORMATION" || task.source.kind !== "PHILOSOPHER_GAINED_ABILITY") {
      throw new Error("Expected V1 gained-only Mathematician as next task");
    }
    const decision = resolveMathematicianInformationDecisionFromAcceptedEventStream(converted, task.taskId);
    if (decision.kind !== "READY") throw new Error(`Expected V1 READY decision, got ${decision.kind}`);
    const last = converted.at(-1)!;
    const common = {
      category: "domain" as const,
      gameId: last.gameId,
      batchId: batchId("batch-mathematician-v1-gained"),
      gameVersion: last.gameVersion + 1,
      eventVersion: last.eventVersion,
      rulesBaselineVersion: last.rulesBaselineVersion,
      commandId: commandId("command-mathematician-v1-gained"),
      createdAt: "2026-07-13T00:00:00.000Z",
      correlationId: correlationId("correlation-mathematician-v1-gained"),
      causationId: causationId("causation-mathematician-v1-gained")
    };
    v1Delivery = {
      ...common,
      eventId: eventId("event-mathematician-v1-gained-delivery"),
      eventSequence: last.eventSequence + 1,
      eventType: "MathematicianInformationDelivered",
      payload: decision.deliveryPayload
    };
    v1Settlement = {
      ...common,
      eventId: eventId("event-mathematician-v1-gained-settlement"),
      eventSequence: last.eventSequence + 2,
      eventType: "ScheduledTaskSettled",
      payload: decision.settlementPayload
    };
    priorEvents = converted;
    acceptedEvents = [...converted, v1Delivery, v1Settlement];
    rebuildGameState(acceptedEvents);
  });

  it("[V1-CSI-01] accepts a canonical V1 gained-only history", () => expect(rebuildGameState(acceptedEvents).mathematicianInformation?.deliveries).toHaveLength(1));
  it("[V1-CSI-02] contains the original closed Philosopher opportunity", () => expect(priorEvents.filter((event) => event.eventType === "FirstNightActionOpportunityCreated")).toHaveLength(1));
  it("[V1-CSI-03] contains the exact choice", () => expect(priorEvents.filter((event) => event.eventType === "PhilosopherAbilityChosen")).toHaveLength(1));
  it("[V1-CSI-04] contains the exact grant", () => expect(priorEvents.filter((event) => event.eventType === "PhilosopherAbilityGranted")).toHaveLength(1));
  it("[V1-CSI-05] contains the exact V1 insertion", () => expect(priorEvents.filter((event) => event.eventType === "FirstNightTaskInserted")).toHaveLength(1));
  it("[V1-CSI-06] resolves through Layer A", () => expect(resolveMathematicianInformationDecisionFromAcceptedEventStream(priorEvents, v1Delivery.payload.taskId).kind).toBe("READY"));
  it("[V1-CSI-07] freezes the V1 gained source", () => expect(v1Delivery.payload.sourceContract.kind).toBe("PHILOSOPHER_GAINED_MATHEMATICIAN_V1"));
  it("[V1-CSI-08] freezes the canonical V1 ability instance", () => expect(v1Delivery.payload.sourceContract.abilityInstance.kind).toBe("PHILOSOPHER_GAINED_TASK_V1"));
  it("[V1-APP-09] validates the exact prospective pair", () => expect(validateProspectiveMathematicianInformationPair({
    priorAcceptedEvents: priorEvents, deliveryEvent: v1Delivery, settlementEvent: v1Settlement
  })).toStrictEqual({ valid: true }));
  it("[V1-RSP-10] validates the trusted replay checkpoint", () => {
    const replay = replayTrustedMathematicianProjectionStream(acceptedEvents);
    expect(replay.checkpoints).toHaveLength(1);
    expect(validateStoredMathematicianInformationDelivered({
      acceptedEvents, checkpoint: replay.checkpoints[0]!, finalState: replay.finalState
    })).toStrictEqual({ valid: true });
  });
  it("[V1-PROJ-11] projects only the selected count", () => expect(buildAiPrivateKnowledgeViewFromAcceptedEventStream(
    acceptedEvents, v1Delivery.payload.sourceContract.sourcePlayerId
  ).mathematicianInformation).toStrictEqual({ count: v1Delivery.payload.selectedCount }));
  it("[V1-HOSTILE-12] rejects a missing insertion instead of treating it as unsupported", () => {
    const missing = priorEvents.filter((event) => event.eventType !== "FirstNightTaskInserted").map((event, index) => ({
      ...event,
      eventSequence: index + 1
    })) as readonly AnyDomainEventEnvelope[];
    expect(resolveMathematicianInformationDecisionFromAcceptedEventStream(missing, v1Delivery.payload.taskId).kind).toBe("CANONICAL_HISTORY_INVALID");
  });
  it("[OPTION-A-44] rejects an invalid gained source only after supported inventory classification", () => {
    const state = structuredClone(rebuildGameState(priorEvents));
    const philosopherTenure = state.seamstressRoleTenureState!.records.find((entry) => entry.roleId === "philosopher")!;
    (philosopherTenure as unknown as { endedCharacterStateRevision: number | null }).endedCharacterStateRevision =
      state.currentCharacterState!.revision;
    const inventory = classifyValidatedMathematicianSupportStateForInternalValidation(state);
    const resolution = resolveMathematicianInformationFromStateForInternalValidation(state, v1Delivery.payload.taskId);
    expect({ classification: inventory.valid ? inventory.classification : "INVALID", resolution }).toMatchObject({
      classification: "SUPPORTED_V1_GAINED_ONLY",
      resolution: { kind: "DETERMINISTIC_REJECTION", code: "InformationSourceNoLongerValid" }
    });
  });
});

describe("2B18B Option A V1 base-only application", () => {
  let prior: readonly AnyDomainEventEnvelope[];
  let priorState: GameState;
  let result: Awaited<ReturnType<ReturnType<typeof createMathematicianServiceForStore>["service"]["execute"]>>;
  let afterEvents: readonly AnyDomainEventEnvelope[];

  beforeAll(async () => {
    const source = await reachBaseMathematicianTask();
    prior = convertV2PhilosopherMathematicianChoiceStreamToV1(await source.commandStore.loadDomainEvents(fixture.command.gameId));
    priorState = rebuildGameState(prior);
    const task = priorState.firstNightTaskPlan!.tasks[priorState.firstNightTaskProgress!.settlements.length]!;
    const loaded = preloadedStore(prior);
    const service = createMathematicianServiceForStore(loaded.store, uniquePreloadedIds()).service;
    result = await service.execute({ ...fixture.command, commandId: commandId("v1-base-only-settle"),
      expectedGameVersion: priorState.gameVersion, payload: { commandType: "SettleMathematicianInformation", taskId: task.taskId } });
    if (result.status !== "accepted") throw new Error(`V1 base-only settlement failed: ${JSON.stringify(result)}`);
    afterEvents = await loaded.store.loadDomainEvents(fixture.command.gameId);
  });

  it("[V1-BASE-01] uses a V1 plan", () => expect(priorState.firstNightTaskPlan?.taskPlanVersion).toBe("first-night-task-plan-v1"));
  it("[V1-BASE-02] contains one base Math task", () => expect(priorState.firstNightTaskPlan?.tasks.filter((task) => task.taskType === "MATHEMATICIAN_INFORMATION")).toHaveLength(1));
  it("[V1-BASE-03] requires no insertion", () => expect(prior.some((event) => event.eventType === "FirstNightTaskInserted")).toBe(false));
  it("[V1-BASE-04] preserves the historical base position", () => expect(priorState.firstNightTaskPlan?.tasks.find((task) => task.taskType === "MATHEMATICIAN_INFORMATION")?.orderKey.baseOrder).toBe(1100));
  it("[V1-BASE-05] settles successfully", () => expect(result.status).toBe("accepted"));
  it("[V1-BASE-06] writes delivery then settlement", () => expect(afterEvents.slice(-2).map((event) => event.eventType)).toStrictEqual(["MathematicianInformationDelivered", "ScheduledTaskSettled"]));
  it("[V1-BASE-07] freezes a BASE source contract", () => expect(rebuildGameState(afterEvents).mathematicianInformation?.deliveries[0]?.sourceContract.kind).toBe("BASE_MATHEMATICIAN"));
  it("[V1-BASE-08] creates one valid terminal fact", () => expect(rebuildGameState(afterEvents).firstNightAbilityOutcomeLedger?.facts.at(-1)?.abilityRoleId).toBe("mathematician"));
  it("[V1-BASE-09] projects only the count from the full stream", () => {
    const state = rebuildGameState(afterEvents);
    const sourcePlayer = state.mathematicianInformation!.deliveries[0]!.sourceContract.sourcePlayerId;
    expect(buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(afterEvents, sourcePlayer).mathematicianInformation)
      .toStrictEqual({ count: state.mathematicianInformation!.deliveries[0]!.selectedCount });
  });
});

describe("2B18B Option A V1 base-plus-gained receipt-free unsupported matrix", () => {
  let prior: readonly AnyDomainEventEnvelope[];
  let state: GameState;
  let gainedTaskId: MathematicianInformationDeliveredPayload["taskId"];
  let baseTaskId: MathematicianInformationDeliveredPayload["taskId"];
  let result: Awaited<ReturnType<ReturnType<typeof createMathematicianServiceForStore>["service"]["execute"]>>;
  let retry: typeof result;
  let loaded: ReturnType<typeof preloadedStore>;
  let command: typeof fixture.command;

  beforeAll(async () => {
    const source = await settleBaseAndGainedMathematicianV2();
    prior = convertV2PhilosopherMathematicianChoiceStreamToV1(source.eventsAfterChoice);
    state = rebuildGameState(prior);
    const tasks = state.firstNightTaskPlan!.tasks.filter((task) => task.taskType === "MATHEMATICIAN_INFORMATION");
    const gained = tasks.find((task) => task.source.kind === "PHILOSOPHER_GAINED_ABILITY")!;
    const base = tasks.find((task) => task.source.kind === "ROLE")!;
    gainedTaskId = gained.taskId;
    baseTaskId = base.taskId;
    loaded = preloadedStore(prior);
    const service = createMathematicianServiceForStore(loaded.store, uniquePreloadedIds()).service;
    command = { ...fixture.command, commandId: commandId("v1-duplicate-unsupported"), expectedGameVersion: state.gameVersion,
      payload: { commandType: "SettleMathematicianInformation", taskId: gainedTaskId } };
    result = await service.execute(command);
    retry = await service.execute(command);
  });

  it("[V1-DUP-01] validates one base and one gained V1 task", () => expect(state.firstNightTaskPlan?.tasks.filter((task) => task.taskType === "MATHEMATICIAN_INFORMATION")).toHaveLength(2));
  it("[V1-DUP-02] preserves gained as canonical next", () => expect(state.firstNightTaskPlan?.tasks[state.firstNightTaskProgress!.settlements.length]?.taskId).toBe(gainedTaskId));
  it("[V1-DUP-03] Layer A returns the exact unsupported variant", () => expect(resolveMathematicianInformationDecisionFromAcceptedEventStream(prior, gainedTaskId).kind).toBe("UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER"));
  it("[V1-DUP-04] internal diagnostic reason is exact", () => {
    const decision = resolveMathematicianInformationDecisionFromAcceptedEventStream(prior, gainedTaskId);
    expect(decision.kind === "UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER" ? decision.diagnostic.reason : undefined)
      .toBe("LEGACY_V1_DUPLICATE_MATHEMATICIAN_ORDER_UNSUPPORTED");
  });
  it("[V1-DUP-05] public failure is ApplicationNotConfigured", () => expect(result).toMatchObject({ status: "failed", code: "ApplicationNotConfigured" }));
  it("[V1-DUP-06] public failure stage is exact", () => expect(result).toMatchObject({ failureStage: "first-night-role-information" }));
  it("[V1-DUP-07] public failure is retryable", () => expect(result).toMatchObject({ retryable: true }));
  it("[V1-DUP-08] public shape has no diagnostic details", () => expect(result).not.toHaveProperty("details"));
  it("[V1-DUP-09] writes no accepted command", () => expect(loaded.acceptedWrites()).toBe(0));
  it("[V1-DUP-10] writes no rejected receipt", () => expect(loaded.rejectedWrites()).toBe(0));
  it("[V1-DUP-11] stores no receipt", async () => expect(await loaded.store.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined());
  it("[V1-DUP-12] appends no events", async () => expect(await loaded.store.loadDomainEvents(command.gameId)).toStrictEqual(prior));
  it("[V1-DUP-13] leaves gained unsettled", () => expect(state.firstNightTaskProgress?.settlements.some((entry) => entry.taskId === gainedTaskId)).toBe(false));
  it("[V1-DUP-14] leaves base unsettled", () => expect(state.firstNightTaskProgress?.settlements.some((entry) => entry.taskId === baseTaskId)).toBe(false));
  it("[V1-DUP-15] leaves game version unchanged", () => expect(result).toMatchObject({ currentGameVersion: state.gameVersion }));
  it("[V1-DUP-16] leaves ledger unchanged", () => expect(rebuildGameState(prior).firstNightAbilityOutcomeLedger).toStrictEqual(state.firstNightAbilityOutcomeLedger));
  it("[V1-DUP-17] leaves opportunity and progress unchanged", () => expect(rebuildGameState(prior).firstNightActionOpportunities).toStrictEqual(state.firstNightActionOpportunities));
  it("[V1-DUP-18] same command remains retryable without receipt", () => expect(retry).toStrictEqual(result));
  it("[V1-DUP-19] naming base cannot skip gained and returns the same unsupported classification", () => expect(resolveMathematicianInformationDecisionFromAcceptedEventStream(prior, baseTaskId).kind).toBe("UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER"));
  it("[V1-DUP-20] restart and rebuild preserve unsupported classification", () => expect(resolveMathematicianInformationDecisionFromAcceptedEventStream(structuredClone(prior), gainedTaskId).kind).toBe("UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER"));
  it("[V1-DUP-21] player projection exposes no Math limitation payload", () => expect(buildPlayerPrivateKnowledgeView(state, state.roster!.entries[0]!.playerId).mathematicianInformation).toBeUndefined());
  it("[V1-DUP-22] AI projection exposes no Math limitation payload", () => expect(buildAiPrivateKnowledgeView(state, state.roster!.entries[0]!.playerId).mathematicianInformation).toBeUndefined());
  it("[V1-DUP-23] Layer C throws the exact unsupported legacy replay DomainError", () => {
    const candidate = structuredClone(deliveryEvent);
    (candidate as unknown as { eventSequence: number }).eventSequence = state.lastEventSequence + 1;
    (candidate.payload as unknown as { taskId: typeof gainedTaskId }).taskId = gainedTaskId;
    let caught: unknown;
    try {
      applyMathematicianInformationDeliveredReplayAdapter(state, candidate);
    } catch (error: unknown) {
      caught = error;
    }
    expect(caught).toMatchObject({
      code: "UnsupportedLegacyV1MathematicianReplay",
      message: "Legacy V1 duplicate Mathematician delivery is not replayable"
    });
  });
  it("[OPTION-A-43] retains unsupported V1 duplicate classification after a later base-holder role change", () => {
    const changed = structuredClone(state);
    const baseTask = changed.firstNightTaskPlan!.tasks.find((task) => task.taskId === baseTaskId)!;
    if (baseTask.source.kind !== "ROLE") throw new Error("Expected base Mathematician task");
    const basePlayerId = baseTask.source.playerId;
    const baseHolder = changed.currentCharacterState!.entries.find((entry) => entry.playerId === basePlayerId)!;
    const replacement = changed.currentCharacterState!.entries.find((entry) => entry.playerId !== baseHolder.playerId)!.role;
    (baseHolder as unknown as { role: typeof replacement }).role = structuredClone(replacement);
    expect(classifyValidatedMathematicianSupportStateForInternalValidation(changed)).toMatchObject({
      valid: true, classification: "UNSUPPORTED_V1_BASE_AND_GAINED"
    });
  });
});

describe("2B18B V2 duplicate-holder temporal ordering", () => {
  let duplicate: Awaited<ReturnType<typeof settleBaseAndGainedMathematicianV2>>;
  let deliveries: readonly MathematicianInformationDeliveredPayload[];
  let nonNextStore: ReturnType<typeof preloadedStore>;
  let nonNextCommand: typeof fixture.command;
  let nonNextResult: Awaited<ReturnType<ReturnType<typeof createMathematicianServiceForStore>["service"]["execute"]>>;

  beforeAll(async () => {
    duplicate = await settleBaseAndGainedMathematicianV2();
    if (duplicate.result.status !== "accepted") throw new Error(`V2 duplicate settlement failed: ${JSON.stringify(duplicate.result)}`);
    deliveries = rebuildGameState(duplicate.events).mathematicianInformation?.deliveries ?? [];
    const stateAfterChoice = rebuildGameState(duplicate.eventsAfterChoice);
    const gainedTask = stateAfterChoice.firstNightTaskPlan!.tasks.find((task) =>
      task.taskType === "MATHEMATICIAN_INFORMATION" && task.source.kind === "PHILOSOPHER_GAINED_ABILITY"
    )!;
    nonNextStore = preloadedStore(duplicate.eventsAfterChoice);
    nonNextCommand = {
      ...fixture.command,
      commandId: commandId("supported-v2-gained-non-next"),
      expectedGameVersion: stateAfterChoice.gameVersion,
      payload: { commandType: "SettleMathematicianInformation", taskId: gainedTask.taskId }
    };
    nonNextResult = await createMathematicianServiceForStore(nonNextStore.store, uniquePreloadedIds()).service.execute(nonNextCommand);
  });

  it("[V2-DUP-01] accepts both V2 base and gained settlements", () => expect(deliveries).toHaveLength(2));
  it("[V2-DUP-02] orders the base delivery first", () => expect(deliveries[0]?.sourceContract.kind).toBe("BASE_MATHEMATICIAN"));
  it("[V2-DUP-03] orders the gained delivery second", () => expect(deliveries[1]?.sourceContract.kind).toBe("PHILOSOPHER_GAINED_MATHEMATICIAN_V2"));
  it("[V2-DUP-04] represents the duplicate-holder drunkenness on the base source", () => expect(deliveries[0]?.sourceEffectiveness.kind).toBe("KNOWN_DRUNK"));
  it("[V2-DUP-05] delivers deterministic false information to the drunk base source", () => expect(deliveries[0]?.selectedCount).not.toBe(deliveries[0]?.trueCount));
  it("[V2-DUP-06] lets the later gained holder count the earlier abnormal base holder", () => expect(deliveries[1]?.trueCount).toBe(1));
  it("[V2-DUP-07] binds the later count to the earlier terminal fact", () => expect(deliveries[1]?.qualifyingAbnormalFactIds).toContain(
    formatFirstNightAbilityOutcomeFactId(duplicate.events.find((event) =>
      event.eventType === "MathematicianInformationDelivered" && event.eventSequence === deliveries[0]?.deliveryEventSequence
    )!.eventId)
  ));
  it("[V2-DUP-08] does not let the earlier holder read the later delivery", () => expect(deliveries[0]?.windowSnapshot.endEventSequence).toBeLessThan(deliveries[1]!.deliveryEventSequence));
  it("[V2-DUP-09] validates both trusted checkpoints", () => expect(replayTrustedMathematicianProjectionStream(duplicate.events).checkpoints).toHaveLength(2));
  it("[V2-DUP-10] preserves two distinct canonical ability instances", () => expect(new Set(deliveries.map((entry) => entry.resolvingAbilityInstanceId)).size).toBe(2));
  it("[APP-NONNEXT-43] rejects a supported V2 gained task that is not next", () => expect(nonNextResult).toMatchObject({
    status: "rejected", code: "ScheduledTaskNotNext"
  }));
  it("[APP-NONNEXT-78] stores the deterministic non-next rejection receipt", async () => expect(
    await nonNextStore.store.findCommandReceipt(nonNextCommand.gameId, nonNextCommand.commandId)
  ).toBeDefined());
  it("[APP-NONNEXT-RECEIPT] writes exactly one rejected receipt", () => expect(nonNextStore.rejectedWrites()).toBe(1));
  it("[APP-NONNEXT-NO-APPEND] appends no events", async () => expect(
    await nonNextStore.store.loadDomainEvents(nonNextCommand.gameId)
  ).toStrictEqual(duplicate.eventsAfterChoice));
  it("[LEDGER-DRUNK-110] records the earlier drunk Math false result as abnormal drunkenness", () => {
    const firstDeliveryEvent = duplicate.events.find((event) =>
      event.eventType === "MathematicianInformationDelivered" && event.eventSequence === deliveries[0]?.deliveryEventSequence
    )!;
    const fact = rebuildGameState(duplicate.events).firstNightAbilityOutcomeLedger!.facts.find((entry) =>
      entry.sourceEventId === firstDeliveryEvent.eventId
    );
    expect(fact).toMatchObject({
      outcomeStatus: "ABNORMAL", causeKind: "SOURCE_DRUNKENNESS", causedByAnotherCharacterAbility: true
    });
  });
  it("[ORIGINAL-111] derives poisoned false information through the exact pre-event terminal seam", () => {
    const deliveryIndex = duplicate.events.findIndex((event) =>
      event.eventType === "MathematicianInformationDelivered" && event.eventSequence === deliveries[0]?.deliveryEventSequence
    );
    const original = duplicate.events[deliveryIndex];
    if (original?.eventType !== "MathematicianInformationDelivered") throw new Error("Expected first Math delivery");
    const stateBefore = structuredClone(rebuildGameState(duplicate.events.slice(0, deliveryIndex)));
    const impairment = stateBefore.abilityImpairments!.impairments.find((entry) =>
      entry.affectedPlayerId === original.payload.sourceContract.sourcePlayerId
    )!;
    Object.assign(impairment as unknown as Record<string, unknown>, {
      kind: "POISONED", sourceKind: "SNAKE_CHARMER_DEMON_HIT"
    });
    const candidate = structuredClone(original);
    const represented = candidate.payload.sourceEffectiveness.representedImpairments[0]!;
    Object.assign(represented as unknown as Record<string, unknown>, {
      kind: "POISONED", sourceKind: "SNAKE_CHARMER_DEMON_HIT"
    });
    (candidate.payload as unknown as { sourceEffectiveness: unknown; informationReliability: string }).sourceEffectiveness = {
      kind: "KNOWN_POISONED", representedImpairments: [represented]
    };
    (candidate.payload as unknown as { informationReliability: string }).informationReliability =
      "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING";
    const fact = deriveFirstNightAbilityOutcomeFact({ stateBefore, event: candidate });
    expect({ fact, shape: validateFirstNightAbilityOutcomeFactShape(fact) }).toMatchObject({
      fact: { outcomeStatus: "ABNORMAL", causeKind: "SOURCE_POISONING", causedByAnotherCharacterAbility: true },
      shape: { valid: true }
    });
  });
  it("[LEDGER-EVIDENCE-110] records the exact seven-key Mathematician delivery evidence", () => {
    const firstDeliveryEvent = duplicate.events.find((event) =>
      event.eventType === "MathematicianInformationDelivered" && event.eventSequence === deliveries[0]?.deliveryEventSequence
    )!;
    const evidence = rebuildGameState(duplicate.events).firstNightAbilityOutcomeLedger!.facts.find((entry) =>
      entry.sourceEventId === firstDeliveryEvent.eventId
    )!.evidenceReferences.find((entry) => entry.kind === "MATHEMATICIAN_DELIVERY")!;
    expect(Object.keys(evidence).sort()).toStrictEqual([
      "deliveryId", "kind", "selectedCount", "sourcePlayerId", "taskId", "terminalEventId", "trueCount"
    ]);
  });
  it("[LEDGER-SOURCE-25] excludes the gained holder's earlier Philosopher terminal fact", () => expect(
    deliveries[1]!.excludedResolvingSourceFactIds.length
  ).toBeGreaterThan(0));
  it("[ORIGINAL-19] deduplicates two abnormal incidents from the same player", () => {
    const fact = rebuildGameState(duplicate.events).firstNightAbilityOutcomeLedger!.facts.find((entry) =>
      entry.outcomeStatus === "ABNORMAL" && entry.abilityRoleId === "mathematician"
    )!;
    const second = structuredClone(fact);
    (second as unknown as { auditFactId: typeof fact.auditFactId }).auditFactId =
      formatFirstNightAbilityOutcomeFactId(eventId("math-count-same-player-second"));
    const result = resolveMathematicianCountFromValidatedFactsForInternalValidation(
      [fact, second], deliveries[1]!.sourceContract.sourcePlayerId, deliveries[1]!.resolvingAbilityInstanceId
    );
    expect(result).toMatchObject({ trueCount: 1, distinctAbnormalPlayers: [{ playerId: fact.sourcePlayerId }] });
  });
  it("[ORIGINAL-20] counts abnormal incidents from two different players", () => {
    const fact = rebuildGameState(duplicate.events).firstNightAbilityOutcomeLedger!.facts.find((entry) =>
      entry.outcomeStatus === "ABNORMAL" && entry.abilityRoleId === "mathematician"
    )!;
    const otherRosterEntry = duplicate.state.roster!.entries.find((entry) =>
      entry.playerId !== fact.sourcePlayerId && entry.playerId !== deliveries[1]!.sourceContract.sourcePlayerId
    )!;
    const other = structuredClone(fact);
    Object.assign(other as unknown as Record<string, unknown>, {
      auditFactId: formatFirstNightAbilityOutcomeFactId(eventId("math-count-other-player")),
      sourcePlayerId: otherRosterEntry.playerId,
      sourceSeatNumber: otherRosterEntry.seatNumber
    });
    const result = resolveMathematicianCountFromValidatedFactsForInternalValidation(
      [fact, other], deliveries[1]!.sourceContract.sourcePlayerId, deliveries[1]!.resolvingAbilityInstanceId
    );
    expect(result).toMatchObject({ trueCount: 2 });
  });
  it("[ORIGINAL-21] treats same-player unresolved evidence as redundant after an abnormal fact", () => {
    const fact = rebuildGameState(duplicate.events).firstNightAbilityOutcomeLedger!.facts.find((entry) =>
      entry.outcomeStatus === "ABNORMAL" && entry.abilityRoleId === "mathematician"
    )!;
    const unresolved = structuredClone(fact);
    Object.assign(unresolved as unknown as Record<string, unknown>, {
      auditFactId: formatFirstNightAbilityOutcomeFactId(eventId("math-count-redundant-unresolved")),
      outcomeStatus: "UNRESOLVED",
      causeKind: "CAUSE_NOT_PROVEN",
      causedByAnotherCharacterAbility: false
    });
    const result = resolveMathematicianCountFromValidatedFactsForInternalValidation(
      [fact, unresolved], deliveries[1]!.sourceContract.sourcePlayerId, deliveries[1]!.resolvingAbilityInstanceId
    );
    expect(result).toMatchObject({ trueCount: 1, redundantUnresolvedFactIds: [unresolved.auditFactId], blocking: [] });
  });
  it("[ORIGINAL-26] excludes an earlier fact from the same canonical ability instance", () => {
    const fact = rebuildGameState(duplicate.events).firstNightAbilityOutcomeLedger!.facts.find((entry) =>
      entry.outcomeStatus === "ABNORMAL" && entry.abilityRoleId === "mathematician"
    )!;
    const own = structuredClone(fact);
    Object.assign(own, { abilityInstance: {
      ...own.abilityInstance,
      abilityInstanceId: deliveries[1]!.resolvingAbilityInstanceId
    } });
    const result = resolveMathematicianCountFromValidatedFactsForInternalValidation(
      [own], deliveries[1]!.sourceContract.sourcePlayerId, deliveries[1]!.resolvingAbilityInstanceId
    );
    expect(result).toMatchObject({ trueCount: 0, excludedOwnAbilityFactIds: [own.auditFactId] });
  });
  it("[PROJ-HISTORY-129] fails closed when a stored delivery is tampered", () => {
    const candidate = structuredClone(duplicate.events) as AnyDomainEventEnvelope[];
    const event = candidate.find((entry) => entry.eventType === "MathematicianInformationDelivered")!;
    if (event.eventType !== "MathematicianInformationDelivered") throw new Error("Expected Math delivery");
    (event.payload as unknown as { selectedCount: number }).selectedCount = (event.payload.selectedCount + 1) % 12;
    expect(() => buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(
      candidate, deliveries[0]!.sourceContract.sourcePlayerId
    )).toThrow();
  });
  it("[PROJ-HISTORY-131] later ledger facts never recompute an earlier delivered count", () => {
    const firstSettlementIndex = duplicate.events.findIndex((event) =>
      event.eventType === "ScheduledTaskSettled" && event.payload.taskId === deliveries[0]!.taskId
    );
    const early = buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(
      duplicate.events.slice(0, firstSettlementIndex + 1), deliveries[0]!.sourceContract.sourcePlayerId
    ).mathematicianInformation;
    const afterLaterFacts = buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(
      duplicate.events, deliveries[0]!.sourceContract.sourcePlayerId
    ).mathematicianInformation;
    expect(afterLaterFacts).toStrictEqual(early);
  });
});

describe("2B18B accepted V2 gained chain under Vortox with duplicate-holder drunkenness", () => {
  let deliveries: readonly MathematicianInformationDeliveredPayload[];

  beforeAll(async () => {
    const result = await settleBaseAndGainedMathematicianV2(philosopherAndBaseMathematicianVortoxExactRoleIds);
    if (result.result.status !== "accepted") throw new Error(`Vortox duplicate settlement failed: ${JSON.stringify(result.result)}`);
    deliveries = rebuildGameState(result.events).mathematicianInformation?.deliveries ?? [];
  });

  it("[ORIGINAL-57] keeps the accepted Vortox-plus-drunk duplicate-holder gained chain on false information", () => expect(
    deliveries.map((entry) => ({ source: entry.sourceContract.kind, effectiveness: entry.sourceEffectiveness.kind,
      vortox: entry.vortoxConstraint.kind, false: entry.selectedCount !== entry.trueCount }))
  ).toStrictEqual([
    { source: "BASE_MATHEMATICIAN", effectiveness: "KNOWN_DRUNK", vortox: "VORTOX_FALSE_REQUIRED", false: true },
    { source: "PHILOSOPHER_GAINED_MATHEMATICIAN_V2", effectiveness: "EFFECTIVE", vortox: "VORTOX_FALSE_REQUIRED", false: true }
  ]));
  it("[ORIGINAL-66] counts the earlier Vortox-false holder for the later gained holder", () => expect(
    deliveries[1]
  ).toMatchObject({ trueCount: 1, distinctAbnormalPlayers: [{ playerId: deliveries[0]!.sourceContract.sourcePlayerId }] }));
});

describe("2B18B gained-chain hostile validation priority", () => {
  let prior: readonly AnyDomainEventEnvelope[];
  let taskId: MathematicianInformationDeliveredPayload["taskId"];

  beforeAll(async () => {
    const gained = await settleGainedMathematicianV2();
    const event = gained.events.at(-2);
    if (event?.eventType !== "MathematicianInformationDelivered") throw new Error("Expected hostile fixture delivery");
    prior = gained.events.slice(0, -2);
    taskId = event.payload.taskId;
  });

  const decisionKindAfter = (mutate: (events: AnyDomainEventEnvelope[]) => void) => {
    const candidate = structuredClone(prior) as AnyDomainEventEnvelope[];
    mutate(candidate);
    return resolveMathematicianInformationDecisionFromAcceptedEventStream(candidate, taskId).kind;
  };

  it("[HOSTILE-CHAIN-01] missing grant is canonical-invalid, never unsupported", () => expect(decisionKindAfter((events) => {
    const index = events.findIndex((event) => event.eventType === "PhilosopherAbilityGranted");
    events.splice(index, 1);
    events.forEach((event, eventIndex) => (event as unknown as { eventSequence: number }).eventSequence = eventIndex + 1);
  })).toBe("CANONICAL_HISTORY_INVALID"));
  it("[HOSTILE-CHAIN-02] missing original opportunity is canonical-invalid, never unsupported", () => expect(decisionKindAfter((events) => {
    const index = events.findIndex((event) => event.eventType === "FirstNightActionOpportunityCreated");
    events.splice(index, 1);
    events.forEach((event, eventIndex) => (event as unknown as { eventSequence: number }).eventSequence = eventIndex + 1);
  })).toBe("CANONICAL_HISTORY_INVALID"));
  it("[HOSTILE-CHAIN-03] grant revision tamper is canonical-invalid", () => expect(decisionKindAfter((events) => {
    const grant = events.find((event) => event.eventType === "PhilosopherAbilityGranted");
    if (grant?.eventType !== "PhilosopherAbilityGranted") throw new Error("Expected grant");
    (grant.payload as unknown as { sourceCharacterStateRevision: number }).sourceCharacterStateRevision += 1;
  })).toBe("CANONICAL_HISTORY_INVALID"));
  it("[HOSTILE-CHAIN-04] insertion seat tamper is canonical-invalid", () => expect(decisionKindAfter((events) => {
    const insertion = events.find((event) => event.eventType === "FirstNightTaskInsertedV2");
    if (insertion?.eventType !== "FirstNightTaskInsertedV2") throw new Error("Expected insertion");
    (insertion.payload as unknown as { sourceSeatNumber: number }).sourceSeatNumber = 12;
  })).toBe("CANONICAL_HISTORY_INVALID"));
  it("[HOSTILE-CHAIN-05] opportunity source-role tamper is canonical-invalid", () => expect(decisionKindAfter((events) => {
    const opportunity = events.find((event) => event.eventType === "FirstNightActionOpportunityCreated");
    if (opportunity?.eventType !== "FirstNightActionOpportunityCreated") throw new Error("Expected opportunity");
    (opportunity.payload.sourceRole as unknown as { roleId: string }).roleId = "mathematician";
  })).toBe("CANONICAL_HISTORY_INVALID"));
  it("[HOSTILE-CHAIN-06] V1 plan plus V2 insertion is mixed-generation canonical invalidity before support classification", () => expect(decisionKindAfter((events) => {
    const plan = events.find((event) => event.eventType === "FirstNightTaskPlanCreated");
    if (plan?.eventType !== "FirstNightTaskPlanCreated") throw new Error("Expected plan");
    (plan.payload as unknown as { taskPlanVersion: string }).taskPlanVersion = "first-night-task-plan-v1";
  })).toBe("CANONICAL_HISTORY_INVALID"));
});

describe("2B18B application receipt, actor, metadata, and idempotency contracts", () => {
  it("[APP-CONTRACT-01] accepts Storyteller settlement", async () => {
    const ready = await reachBaseMathematicianTask();
    const result = await ready.service.execute({
      commandId: commandId("math-storyteller"), gameId: fixture.command.gameId,
      expectedGameVersion: ready.state.gameVersion, actor: { kind: "storyteller" },
      issuedAt: "2026-07-13T00:00:00.000Z", correlationId: correlationId("math-storyteller"),
      payload: { commandType: "SettleMathematicianInformation", taskId: ready.task.taskId }
    });
    expect(result.status).toBe("accepted");
  });

  it.each(["human", "ai"] as const)("[APP-CONTRACT-actor-%s] rejects an unprivileged actor with a receipt", async (kind) => {
    const ready = await reachBaseMathematicianTask();
    const actorPlayer = ready.state.roster!.entries[0]!.playerId;
    const command = {
      commandId: commandId(`math-${kind}-rejected`), gameId: fixture.command.gameId,
      expectedGameVersion: ready.state.gameVersion, actor: { kind, playerId: actorPlayer },
      issuedAt: "2026-07-13T00:00:00.000Z", correlationId: correlationId(`math-${kind}-rejected`),
      payload: { commandType: "SettleMathematicianInformation" as const, taskId: ready.task.taskId }
    };
    const result = await ready.service.execute(command);
    expect(result.status).toBe("rejected");
    expect(await ready.commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeDefined();
  });

  it("[APP-CONTRACT-04] rejects a missing task with a durable receipt", async () => {
    const ready = await reachBaseMathematicianTask();
    const command = { ...fixture.command, commandId: commandId("math-missing-task"), expectedGameVersion: ready.state.gameVersion,
      payload: { commandType: "SettleMathematicianInformation" as const,
        taskId: scheduledTaskId("first-night-v1:MATHEMATICIAN_INFORMATION:seat-12") } };
    const result = await ready.service.execute(command);
    expect(result).toMatchObject({ status: "rejected", code: "ScheduledTaskNotFound" });
    expect(await ready.commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeDefined();
  });

  it("[APP-CONTRACT-05] rejects a wrong task type with a durable receipt", async () => {
    const ready = await reachBaseMathematicianTask();
    const wrong = ready.state.firstNightTaskPlan!.tasks.find((task) => task.taskType !== "MATHEMATICIAN_INFORMATION")!;
    const command = { ...fixture.command, commandId: commandId("math-wrong-type"), expectedGameVersion: ready.state.gameVersion,
      payload: { commandType: "SettleMathematicianInformation" as const, taskId: wrong.taskId } };
    const result = await ready.service.execute(command);
    expect(result).toMatchObject({ status: "rejected", code: "InvalidMathematicianInformationCommand" });
    expect(await ready.commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeDefined();
  });

  it("[APP-CONTRACT-06] rejects an already settled task with a durable receipt", async () => {
    const settled = await settleBaseMathematician();
    const command = { ...settled.command, commandId: commandId("math-settled-again"), expectedGameVersion: rebuildGameState(settled.events).gameVersion };
    const result = await settled.service.execute(command);
    expect(result).toMatchObject({ status: "rejected", code: "ScheduledTaskAlreadySettled" });
    expect(await settled.commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeDefined();
  });

  it("[APP-CONTRACT-07] rejects stale expected version with a durable receipt", async () => {
    const ready = await reachBaseMathematicianTask();
    const command = { ...fixture.command, commandId: commandId("math-stale-version"), expectedGameVersion: ready.state.gameVersion - 1 };
    const result = await ready.service.execute(command);
    expect(result).toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch" });
    expect(await ready.commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeDefined();
  });

  it("[APP-CONTRACT-08] increments game version exactly once", () => expect(fixture.result.status === "accepted" ? fixture.result.gameVersion : -1).toBe(fixture.state.gameVersion + 1));
  it("[APP-CONTRACT-09] commits exactly two Math events", () => expect(fixture.events.filter((event) => event.commandId === fixture.command.commandId)).toHaveLength(2));
  it("[APP-CONTRACT-10] commits shared batch, command, version, timestamp, correlation, and causation metadata", () => {
    const pair = fixture.events.filter((event) => event.commandId === fixture.command.commandId);
    expect(pair.map((event) => [event.batchId, event.commandId, event.gameVersion, event.createdAt, event.correlationId, event.causationId]))
      .toStrictEqual([0, 1].map(() => [pair[0]!.batchId, pair[0]!.commandId, pair[0]!.gameVersion, pair[0]!.createdAt, pair[0]!.correlationId, pair[0]!.causationId]));
  });
  it("[APP-CONTRACT-11] returns a summary without hidden payloads", () => expect(fixture.result).not.toHaveProperty("events"));
  it("[APP-CONTRACT-12] stores the successful command receipt", async () => expect(await fixture.commandStore.findCommandReceipt(fixture.command.gameId, fixture.command.commandId)).toBeDefined());
  it("[APP-CONTRACT-13] retries the successful command idempotently without append", async () => {
    const before = fixture.events.length;
    const retry = await fixture.service.execute(fixture.command);
    expect(retry).toStrictEqual({ ...fixture.result, idempotent: true });
    expect(await fixture.commandStore.loadDomainEvents(fixture.command.gameId)).toHaveLength(before);
  });
});

describe("2B18B structural batch and replay tamper contracts", () => {
  it("[BATCH-01] rejects naked delivery", () => expect(() => validateDomainBatchSemantics(fixture.state, [deliveryEvent])).toThrow());
  it("[BATCH-02] rejects naked settlement", () => expect(() => validateDomainBatchSemantics(fixture.state, [settlementEvent])).toThrow());
  it("[BATCH-03] rejects reversed delivery and settlement", () => expect(() => validateDomainBatchSemantics(fixture.state, [settlementEvent, deliveryEvent])).toThrow());
  it("[BATCH-04] rejects a third event", () => expect(() => validateDomainBatchSemantics(fixture.state, [deliveryEvent, settlementEvent, {
    ...settlementEvent, eventId: eventId("math-third-event"), eventSequence: settlementEvent.eventSequence + 1
  }])).toThrow());
  it("[BATCH-MIXED-108] rejects a delivery paired with a phase transition", () => {
    const mixed = {
      ...settlementEvent,
      eventType: "PhaseTransitioned",
      payload: {
        rulesBaselineVersion: settlementEvent.rulesBaselineVersion,
        fromPhase: "FIRST_NIGHT",
        toPhase: "DAY",
        transitionReason: "FIRST_NIGHT_COMPLETED",
        dayNumberAfter: 1,
        nightNumberAfter: 1
      }
    } as unknown as AnyDomainEventEnvelope;
    expect(() => validateDomainBatchSemantics(fixture.state, [deliveryEvent, mixed])).toThrow();
  });
  it("[BATCH-05] applies delivery while task remains pending and fact already exists", () => {
    const after = applyDomainEvent(fixture.state, deliveryEvent);
    expect(after.firstNightTaskProgress?.settlements.some((entry) => entry.taskId === delivery.taskId)).toBe(false);
    expect(after.firstNightAbilityOutcomeLedger?.facts.some((fact) => fact.sourceEventId === deliveryEvent.eventId)).toBe(true);
  });
  it("[BATCH-06] settlement succeeds only after delivery", () => {
    const after = applyDomainEvent(applyDomainEvent(fixture.state, deliveryEvent), settlementEvent);
    expect(after.firstNightTaskProgress?.settlements.some((entry) => entry.taskId === delivery.taskId)).toBe(true);
  });

  const tamperCases: readonly (readonly [string, (payload: Record<string, unknown>) => void])[] = [
    ["task", (payload) => { payload.taskId = "first-night-v1:MATHEMATICIAN_INFORMATION:seat-12"; }],
    ["source", (payload) => { (payload.sourceContract as Record<string, unknown>).sourcePlayerId = "wrong-player"; }],
    ["window", (payload) => { (payload.windowSnapshot as Record<string, unknown>).endEventSequence = delivery.windowSnapshot.endEventSequence + 1; }],
    ["truth", (payload) => { payload.trueCount = (delivery.trueCount + 1) % 12; }],
    ["abnormal players", (payload) => { payload.distinctAbnormalPlayers = [{ playerId: "wrong", seatNumber: 1, supportingFactIds: [] }]; }],
    ["fact IDs", (payload) => { payload.qualifyingAbnormalFactIds = ["wrong-fact"]; }],
    ["selected count", (payload) => { payload.selectedCount = (delivery.selectedCount + 1) % 12; }],
    ["candidates", (payload) => { payload.legalCandidateCounts = [11]; }],
    ["source effectiveness", (payload) => { payload.sourceEffectiveness = { kind: "KNOWN_DRUNK", representedImpairments: [] }; }],
    ["Vortox variant", (payload) => { payload.vortoxConstraint = { kind: "NONE_NO_CURRENT_VORTOX", evaluatedCharacterStateRevision: delivery.settlementCharacterStateRevision + 1 }; }],
    ["policy", (payload) => { payload.simulationPolicyVersion = "wrong-policy"; }],
    ["extra field", (payload) => { payload.unexpected = true; }]
  ];
  it.each(tamperCases)("[REPLAY-TAMPER-%s] rejects stored %s tampering", (_label, mutate) => {
    const candidate = structuredClone(deliveryEvent);
    mutate(candidate.payload);
    expect(() => rebuildGameState([...fixture.events.slice(0, -2), candidate, settlementEvent])).toThrow();
  });
  it("[REPLAY-TAMPER-sparse] rejects a sparse payload array", () => {
    const candidate = structuredClone(deliveryEvent);
    Reflect.deleteProperty(candidate.payload.candidateDomain, "0");
    expect(() => rebuildGameState([...fixture.events.slice(0, -2), candidate, settlementEvent])).toThrow();
  });
  it("[REPLAY-TAMPER-duplicate] rejects duplicate delivery identity", () => {
    const duplicate = { ...deliveryEvent, eventId: eventId("duplicate-math-delivery"), eventSequence: deliveryEvent.eventSequence + 1 };
    expect(() => validateDomainBatchSemantics(fixture.state, [deliveryEvent, duplicate, settlementEvent])).toThrow();
  });
  it("[UPPER-01] requires the replay pre-state boundary", () => expect(fixture.state.lastEventSequence).toBe(deliveryEvent.eventSequence - 1));
  it("[UPPER-02] rejects a window containing the current delivery", () => {
    const candidate = structuredClone(deliveryEvent);
    (candidate.payload.windowSnapshot as unknown as { endEventSequence: number }).endEventSequence = candidate.eventSequence;
    expect(() => applyDomainEvent(fixture.state, candidate)).toThrow();
  });
  it("[UPPER-03] rejects a window ending one event early", () => {
    const candidate = structuredClone(deliveryEvent);
    (candidate.payload.windowSnapshot as unknown as { endEventSequence: number }).endEventSequence -= 1;
    expect(() => applyDomainEvent(fixture.state, candidate)).toThrow();
  });
});

const deliveryKeys = [
  "rulesBaselineVersion", "nightNumber", "taskId", "taskType", "deliveryId", "deliveryEventSequence", "sourceContract",
  "resolutionModelVersion", "windowSnapshot", "ledgerVersion", "auditModelVersion", "resolvingAbilityInstanceId",
  "qualifyingAbnormalFactIds", "distinctAbnormalPlayers", "excludedResolvingSourceFactIds", "excludedOwnAbilityFactIds",
  "ignoredNormalFactIds", "ignoredPendingFactIds", "redundantUnresolvedFactIds", "trueCount", "numberDomainVersion",
  "candidateDomain", "legalCandidateCounts", "selectedCount", "sourceEffectiveness", "vortoxConstraint",
  "simulationPolicyVersion", "informationReliability", "knowledgeModelVersion", "knowledgeStage",
  "settlementCharacterStateRevision"
] as const;

const exactBaseSourceKeys = [
  "abilityInstance", "kind", "settlementCharacterStateRevision", "sourcePlayerId", "sourceRole",
  "sourceRoleAtSettlement", "sourceRoleTenure", "sourceSeatNumber", "taskId", "taskPlanVersion"
] as const;

describe("2B18B original 140-test exact-contract matrix", () => {
  it.each(deliveryKeys.map((key, index) => [index + 1, key] as const))(
    "[ORIGINAL-%i] rejects a payload missing %s",
    (_number, key) => {
      const candidate = structuredClone(delivery) as unknown as Record<string, unknown>;
      delete candidate[key];
      expect(validateMathematicianInformationDeliveredPayloadShape(candidate).valid).toBe(false);
    }
  );

  it.each(deliveryKeys.map((key, index) => [index + 32, key, `unexpected_${key}`] as const))(
    "[ORIGINAL-%i] rejects the extra field derived from %s",
    (_number, _key, extraKey) => {
      const candidate = structuredClone(delivery) as unknown as Record<string, unknown>;
      candidate[extraKey] = true;
      expect(validateMathematicianInformationDeliveredPayloadShape(candidate).valid).toBe(false);
    }
  );

  it.each(deliveryKeys.map((key, index) => [index + 63, key] as const))(
    "[ORIGINAL-%i] rejects undefined for %s",
    (_number, key) => {
      const candidate = structuredClone(delivery) as unknown as Record<string, unknown>;
      candidate[key] = undefined;
      expect(validateMathematicianInformationDeliveredPayloadShape(candidate).valid).toBe(false);
    }
  );

  it.each(deliveryKeys.map((key, index) => [index + 94, key] as const))(
    "[ORIGINAL-%i] rejects null for %s",
    (_number, key) => {
      const candidate = structuredClone(delivery) as unknown as Record<string, unknown>;
      candidate[key] = null;
      expect(validateMathematicianInformationDeliveredPayloadShape(candidate).valid).toBe(false);
    }
  );

  const terminalChecks = [
    [125, "delivery precedes settlement", () => deliveryEvent.eventSequence + 1, () => settlementEvent.eventSequence],
    [126, "pair shares batch", () => deliveryEvent.batchId, () => settlementEvent.batchId],
    [127, "pair shares command", () => deliveryEvent.commandId, () => settlementEvent.commandId],
    [128, "pair shares version", () => deliveryEvent.gameVersion, () => settlementEvent.gameVersion],
    [129, "pair shares timestamp", () => deliveryEvent.createdAt, () => settlementEvent.createdAt],
    [130, "task identity is preserved", () => settlementEvent.payload.taskId, () => delivery.taskId],
    [131, "task type is Math", () => settlementEvent.payload.taskType, () => "MATHEMATICIAN_INFORMATION"],
    [132, "outcome is Math delivery", () => settlementEvent.payload.outcomeType, () => "MATHEMATICIAN_INFORMATION_DELIVERED"],
    [133, "revision is preserved", () => settlementEvent.payload.characterStateRevision, () => delivery.settlementCharacterStateRevision],
    [134, "delivery sequence is embedded", () => delivery.deliveryEventSequence, () => deliveryEvent.eventSequence],
    [135, "window starts exclusive", () => delivery.windowSnapshot.startBoundary, () => "EXCLUSIVE"],
    [136, "window ends inclusive", () => delivery.windowSnapshot.endBoundary, () => "INCLUSIVE"],
    [137, "knowledge stage is exact", () => delivery.knowledgeStage, () => "MATHEMATICIAN_INFORMATION"],
    [138, "domain starts at zero", () => delivery.candidateDomain[0], () => 0],
    [139, "domain ends at eleven", () => delivery.candidateDomain.at(-1), () => 11],
    [140, "base source is canonical", () => delivery.sourceContract.kind, () => "BASE_MATHEMATICIAN"]
  ] satisfies readonly (readonly [number, string, () => unknown, () => unknown])[];
  it.each(terminalChecks)("[ORIGINAL-%i] %s", (_number, _label, actual, expected) => expect(actual()).toBe(expected()));
});

describe("2B18B Option A 45-test support-boundary matrix", () => {
  it.each(exactBaseSourceKeys.map((key, index) => [index + 1, key] as const))(
    "[OPTION-A-%i] base source contains exact key %s",
    (_number, key) => expect(Object.hasOwn(delivery.sourceContract, key)).toBe(true)
  );

  it.each(exactBaseSourceKeys.map((key, index) => [index + 11, key] as const))(
    "[OPTION-A-%i] base source rejects missing key %s",
    (_number, key) => {
      const candidate = structuredClone(delivery) as unknown as Record<string, unknown>;
      const source = candidate.sourceContract as Record<string, unknown>;
      delete source[key];
      expect(validateMathematicianInformationDeliveredPayloadShape(candidate).valid).toBe(false);
    }
  );

  const invalidIds = [
    "", " mathematician-delivery-v1:", "mathematician-delivery-v1:",
    "mathematician-delivery-v2:first-night-v1:MATHEMATICIAN_INFORMATION:seat-03",
    "mathematician-delivery-v1:first-night-v1:MATHEMATICIAN_INFORMATION:seat-00",
    "mathematician-delivery-v1:first-night-v1:MATHEMATICIAN_INFORMATION:seat-13",
    "mathematician-delivery-v1:first-night-v1:MATHEMATICIAN_INFORMATION:seat-3",
    "mathematician-delivery-v1:first-night-v1:CLOCKMAKER_INFORMATION:seat-03",
    "mathematician-delivery-v1:first-night-v1:PHILOSOPHER_GAINED:MATHEMATICIAN_INFORMATION:seat-03:from-clockmaker",
    "mathematician-delivery-v1:first-night-v3:PHILOSOPHER_GAINED:MATHEMATICIAN_INFORMATION:seat-03:from-mathematician"
  ] as const;
  it.each(invalidIds.map((id, index) => [index + 21, id] as const))(
    "[OPTION-A-%i] rejects noncanonical delivery ID %s",
    (_number, id) => expect(parseMathematicianDeliveryId(id).valid).toBe(false)
  );

  const optionChecks: readonly [number, string, () => unknown, () => unknown][] = [
    [31, "base generation", () => parsedDelivery().generation, () => "BASE"],
    [32, "base task plan version", () => delivery.sourceContract.taskPlanVersion, () => "first-night-task-plan-v2"],
    [33, "source role Math", () => delivery.sourceContract.sourceRole.roleId, () => "mathematician"],
    [34, "settlement role Math", () => delivery.sourceContract.sourceRoleAtSettlement.roleId, () => "mathematician"],
    [35, "tenure role Math", () => delivery.sourceContract.sourceRoleTenure.roleId, () => "mathematician"],
    [36, "instance base kind", () => delivery.sourceContract.abilityInstance.kind, () => "BASE_ROLE_TASK"],
    [37, "instance task link", () => delivery.sourceContract.abilityInstance.taskId, () => delivery.taskId],
    [38, "instance player link", () => delivery.sourceContract.abilityInstance.sourcePlayerId, () => delivery.sourceContract.sourcePlayerId],
    [39, "instance seat link", () => delivery.sourceContract.abilityInstance.sourceSeatNumber, () => delivery.sourceContract.sourceSeatNumber],
    [40, "instance role link", () => delivery.sourceContract.abilityInstance.abilityRoleId, () => "mathematician"],
    [41, "tenure player link", () => delivery.sourceContract.sourceRoleTenure.playerId, () => delivery.sourceContract.sourcePlayerId],
    [42, "tenure seat link", () => delivery.sourceContract.sourceRoleTenure.seatNumber, () => delivery.sourceContract.sourceSeatNumber],
    [43, "tenure active", () => delivery.sourceContract.sourceRoleTenure.endedCharacterStateRevision, () => null],
    [44, "settlement revision link", () => delivery.sourceContract.settlementCharacterStateRevision, () => delivery.settlementCharacterStateRevision],
    [45, "delivery task link", () => parsedDelivery().taskId, () => delivery.taskId]
  ];
  it.each(optionChecks)("[OPTION-A-%i] %s", (_number, _label, actual, expected) => expect(actual()).toBe(expected()));
});
