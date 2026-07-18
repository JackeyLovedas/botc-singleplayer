import { describe, expect, it } from "vitest";
import {
  DomainError,
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  actionOpportunityId,
  applyDomainEvent,
  batchId,
  commandId,
  createSeamstressResolutionCapabilityDeclaredPayload,
  evaluatePhaseTransition,
  eventId,
  rebuildGameState,
  scheduledTaskId,
  validateDomainBatchSemantics
} from "@botc/domain-core";
import type { AnyDomainEventEnvelope, DomainErrorCode, DomainEventEnvelope } from "@botc/domain-core";
import {
  gameCreatedEvent,
  charactersAssignedEvent,
  charactersAssignedPhaseTransitionedEvent,
  firstNightInitializedEvent,
  firstNightTaskPlanCreatedEvent,
  phaseTransitionedEvent,
  initialPrivateKnowledgeEstablishedEvent,
  playerRosterCreatedEvent,
  scriptSelectedEvent,
  setupGeneratedEvent,
  setupPhaseTransitionedEvent
} from "@botc/test-harness";
import { loadAcceptedBaseDreamerVortoxV3StreamFixture } from "../../test-harness/src/dreamer-vortox-v3-accepted-stream-fixture.js";

const expectDomainCode = (action: () => void, code: DomainErrorCode): void => {
  let caught: unknown;
  try {
    action();
  } catch (error) {
    caught = error;
  }

  expect(caught).toBeInstanceOf(DomainError);
  expect((caught as DomainError).code).toBe(code);
};

const createdState = () => rebuildGameState([gameCreatedEvent()]);

const seamstressCapabilityDeclaredEvent = (
  overrides: Partial<DomainEventEnvelope<"SeamstressResolutionCapabilityDeclared">> = {}
): DomainEventEnvelope<"SeamstressResolutionCapabilityDeclared"> => {
  const selected = scriptSelectedEvent();
  return {
    category: "domain",
    eventId: eventId("event-seamstress-resolution-capability"),
    gameId: selected.gameId,
    batchId: selected.batchId,
    gameVersion: selected.gameVersion,
    eventSequence: 3,
    eventType: "SeamstressResolutionCapabilityDeclared",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: selected.commandId,
    createdAt: selected.createdAt,
    correlationId: selected.correlationId,
    causationId: selected.causationId,
    payload: createSeamstressResolutionCapabilityDeclaredPayload(RULES_BASELINE_VERSION),
    ...overrides
  };
};
const setupGenerationState = () => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);
const characterAssignmentState = () =>
  rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent(), setupGeneratedEvent(), setupPhaseTransitionedEvent()]);
const rosterCreatedState = () => rebuildGameState([...characterAssignmentStateEvents(), playerRosterCreatedEvent()]);
const firstNightState = () => rebuildGameState([
  ...characterAssignmentStateEvents(),
  playerRosterCreatedEvent(),
  charactersAssignedEvent(),
  charactersAssignedPhaseTransitionedEvent()
]);
const firstNightTaskPlanState = () => rebuildGameState([
  ...characterAssignmentStateEvents(),
  playerRosterCreatedEvent(),
  charactersAssignedEvent(),
  charactersAssignedPhaseTransitionedEvent(),
  firstNightInitializedEvent(),
  initialPrivateKnowledgeEstablishedEvent(),
  firstNightTaskPlanCreatedEvent()
]);

const seamstressDeferredBatch = (): readonly [
  DomainEventEnvelope<"SeamstressActionDeferred">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const state = firstNightTaskPlanState();
  const source = state.currentCharacterState?.entries[0];
  if (source === undefined) {
    throw new Error("Expected current character state source");
  }

  const taskId = scheduledTaskId(`first-night-v1:SEAMSTRESS_ACTION:seat-${String(source.seatNumber).padStart(2, "0")}`);
  const opportunityId = actionOpportunityId(`${taskId}:opportunity-01`);
  const shared = {
    category: "domain" as const,
    gameId: state.gameId,
    batchId: batchId("batch-seamstress-defer"),
    gameVersion: state.gameVersion + 1,
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION as 1,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-seamstress-defer"),
    createdAt: "2026-07-10T00:00:00.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId
  };

  return [
    {
      ...shared,
      eventId: eventId("event-seamstress-deferred"),
      eventSequence: state.lastEventSequence + 1,
      eventType: "SeamstressActionDeferred",
      payload: {
        rulesBaselineVersion: RULES_BASELINE_VERSION,
        nightNumber: 1,
        taskId,
        taskType: "SEAMSTRESS_ACTION",
        opportunityId,
        decisionKind: "DEFER",
        sourcePlayerId: source.playerId,
        sourceSeatNumber: source.seatNumber,
        sourceRole: source.role,
        sourceCharacterStateRevision: state.currentCharacterState?.revision ?? 1
      }
    },
    {
      ...shared,
      eventId: eventId("event-seamstress-settled"),
      eventSequence: state.lastEventSequence + 2,
      eventType: "ScheduledTaskSettled",
      payload: {
        rulesBaselineVersion: RULES_BASELINE_VERSION,
        taskId,
        taskType: "SEAMSTRESS_ACTION",
        nightNumber: 1,
        settlementVersion: "scheduled-task-settlement-v1",
        outcomeType: "SEAMSTRESS_DEFERRED",
        characterStateRevision: state.currentCharacterState?.revision ?? 1
      }
    }
  ];
};

const characterAssignmentStateEvents = (): readonly AnyDomainEventEnvelope[] => [
  gameCreatedEvent(),
  scriptSelectedEvent(),
  phaseTransitionedEvent(),
  setupGeneratedEvent(),
  setupPhaseTransitionedEvent()
];

describe("domain batch semantic validation", () => {
  it("accepts a legal CreateGame single-event batch", () => {
    expect(() => validateDomainBatchSemantics(undefined, [gameCreatedEvent()])).not.toThrow();
  });

  it("accepts a legal SelectScript two-event batch", () => {
    expect(() => validateDomainBatchSemantics(createdState(), [scriptSelectedEvent(), phaseTransitionedEvent()])).not.toThrow();
  });

  it("accepts the exact three-event SelectScript capability batch", () => {
    const capability = seamstressCapabilityDeclaredEvent();
    const transitioned = phaseTransitionedEvent({ eventSequence: 4 });

    expect(() => validateDomainBatchSemantics(createdState(), [scriptSelectedEvent(), capability, transitioned])).not.toThrow();
  });

  it.each(["sects_and_violets", "Sects-And-Violets", " sects-and-violets "])(
    "rejects noncanonical Seamstress capability script literal %s",
    (scriptId) => {
      const capability = seamstressCapabilityDeclaredEvent({
        payload: {
          ...createSeamstressResolutionCapabilityDeclaredPayload(RULES_BASELINE_VERSION),
          scriptId
        } as never
      });
      expectDomainCode(
        () => validateDomainBatchSemantics(createdState(), [
          scriptSelectedEvent(),
          capability,
          phaseTransitionedEvent({ eventSequence: 4 })
        ]),
        "InvalidDomainBatchSemantics"
      );
    }
  );

  it("replays the exact capability fact and rejects a literal-tampered stream", () => {
    const exact = [
      gameCreatedEvent(),
      scriptSelectedEvent(),
      seamstressCapabilityDeclaredEvent(),
      phaseTransitionedEvent({ eventSequence: 4 })
    ];
    expect(() => rebuildGameState(exact)).not.toThrow();
    const tampered = exact.map((event) => event.eventType === "SeamstressResolutionCapabilityDeclared"
      ? {
          ...event,
          payload: { ...event.payload, scriptId: "sects_and_violets" }
        } as AnyDomainEventEnvelope
      : event);
    expect(() => rebuildGameState(tampered)).toThrow();
  });

  it("rejects bare, reordered, and mismatched Seamstress capability facts", () => {
    const capability = seamstressCapabilityDeclaredEvent();
    const transitioned = phaseTransitionedEvent({ eventSequence: 4 });
    expectDomainCode(() => validateDomainBatchSemantics(createdState(), [capability]), "InvalidDomainBatchSemantics");
    expectDomainCode(
      () => validateDomainBatchSemantics(createdState(), [scriptSelectedEvent(), transitioned, capability]),
      "InvalidDomainBatchSemantics"
    );
    expectDomainCode(
      () => validateDomainBatchSemantics(createdState(), [scriptSelectedEvent(), {
        ...capability,
        batchId: batchId("other-capability-batch")
      }, transitioned]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects a bare ScriptSelected event", () => {
    expectDomainCode(() => validateDomainBatchSemantics(createdState(), [scriptSelectedEvent()]), "InvalidDomainBatchSemantics");
  });

  it("rejects a bare PhaseTransitioned(SCRIPT_SELECTED) event", () => {
    expectDomainCode(
      () => validateDomainBatchSemantics(createdState(), [phaseTransitionedEvent({ eventSequence: 2 })]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects reversed SelectScript batch order", () => {
    expectDomainCode(
      () => validateDomainBatchSemantics(createdState(), [phaseTransitionedEvent({ eventSequence: 2 }), scriptSelectedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects SelectScript batch events with different batchId values", () => {
    const selected = scriptSelectedEvent();
    const transitioned = phaseTransitionedEvent({ batchId: batchId("other-batch") });

    expectDomainCode(
      () => validateDomainBatchSemantics(createdState(), [selected, transitioned]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects SCRIPT_SELECTED transitions without a ScriptSelected fact", () => {
    const transitioned = phaseTransitionedEvent({ eventSequence: 2 });
    const filler = gameCreatedEvent({
      eventId: eventId("unrelated-game-created"),
      eventSequence: 3,
      batchId: transitioned.batchId,
      commandId: transitioned.commandId,
      gameVersion: transitioned.gameVersion
    }) as unknown as AnyDomainEventEnvelope;

    expectDomainCode(() => validateDomainBatchSemantics(createdState(), [transitioned, filler]), "InvalidDomainBatchSemantics");
  });

  it("rejects ScriptSelected without the paired PhaseTransitioned fact", () => {
    expectDomainCode(() => validateDomainBatchSemantics(createdState(), [scriptSelectedEvent()]), "InvalidDomainBatchSemantics");
  });

  it("rejects unrelated third domain events inside the SelectScript batch", () => {
    const unrelated = scriptSelectedEvent({
      eventId: eventId("third-event"),
      eventSequence: 4,
      batchId: scriptSelectedEvent().batchId,
      commandId: scriptSelectedEvent().commandId
    });

    expectDomainCode(
      () => validateDomainBatchSemantics(createdState(), [scriptSelectedEvent(), phaseTransitionedEvent(), unrelated]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects bare SETUP_GENERATED transitions without a SetupGenerated fact", () => {
    const futureTransition = setupPhaseTransitionedEvent({
      eventSequence: 4,
      payload: {
        ...setupPhaseTransitionedEvent().payload,
        fromPhase: "SETUP_GENERATION",
        toPhase: "CHARACTER_ASSIGNMENT",
        transitionReason: "SETUP_GENERATED"
      }
    });

    expectDomainCode(() => validateDomainBatchSemantics(setupGenerationState(), [futureTransition]), "InvalidDomainBatchSemantics");
  });

  it("keeps GAME_ENDED evaluable in pure policy while rejecting it from the current event log", () => {
    expect(evaluatePhaseTransition({ fromPhase: "DAY_DISCUSSION", toPhase: "GAME_ENDED", dayNumber: 1, nightNumber: 1 })).toMatchObject({
      allowed: true,
      reasonCode: "GAME_ENDED"
    });

    const gameEnded = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        fromPhase: "DAY_DISCUSSION",
        toPhase: "GAME_ENDED",
        transitionReason: "GAME_ENDED",
        dayNumberBefore: 1,
        dayNumberAfter: 1,
        nightNumberBefore: 1,
        nightNumberAfter: 1
      }
    });

    expectDomainCode(() => validateDomainBatchSemantics(createdState(), [gameEnded]), "PhaseTransitionNotIntegrated");
  });

  it("keeps the event applier protected against SCRIPT_SELECTED without selectedScript", () => {
    expectDomainCode(
      () => applyDomainEvent(createdState(), phaseTransitionedEvent({ eventSequence: 2 })),
      "MissingTransitionPrerequisite"
    );
  });

  it("rejects empty semantic batches", () => {
    expectDomainCode(() => validateDomainBatchSemantics(createdState(), []), "EmptyEventBatch");
  });

  it("rejects SelectScript semantics when the current state is already past script selection", () => {
    const setupState = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);
    const selected = scriptSelectedEvent({
      eventId: eventId("new-script-selected"),
      eventSequence: 4,
      batchId: batchId("new-select-batch"),
      commandId: commandId("new-select-command"),
      gameVersion: 3
    });
    const transitioned = phaseTransitionedEvent({
      eventId: eventId("new-phase-transitioned"),
      eventSequence: 5,
      batchId: selected.batchId,
      commandId: selected.commandId,
      gameVersion: selected.gameVersion
    });

    expectDomainCode(() => validateDomainBatchSemantics(setupState, [selected, transitioned]), "InvalidDomainBatchSemantics");
  });

  it("accepts a legal GenerateSetup two-event batch", () => {
    expect(() =>
      validateDomainBatchSemantics(setupGenerationState(), [setupGeneratedEvent(), setupPhaseTransitionedEvent()])
    ).not.toThrow();
  });

  it("rejects a bare SetupGenerated event", () => {
    expectDomainCode(
      () => validateDomainBatchSemantics(setupGenerationState(), [setupGeneratedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects reversed GenerateSetup batch order", () => {
    expectDomainCode(
      () => validateDomainBatchSemantics(setupGenerationState(), [setupPhaseTransitionedEvent(), setupGeneratedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects GenerateSetup batch metadata mismatch", () => {
    expectDomainCode(
      () =>
        validateDomainBatchSemantics(setupGenerationState(), [
          setupGeneratedEvent(),
          setupPhaseTransitionedEvent({ batchId: batchId("other-setup-batch") })
        ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects GenerateSetup transition with incorrect from and to phases", () => {
    expectDomainCode(
      () =>
        validateDomainBatchSemantics(setupGenerationState(), [
          setupGeneratedEvent(),
          setupPhaseTransitionedEvent({
            payload: {
              ...setupPhaseTransitionedEvent().payload,
              fromPhase: "SCRIPT_SELECTION"
            }
          })
        ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("accepts a legal CreatePlayerRoster single-event batch", () => {
    expect(() => validateDomainBatchSemantics(characterAssignmentState(), [playerRosterCreatedEvent()])).not.toThrow();
  });

  it("rejects CreatePlayerRoster before setup exists", () => {
    expectDomainCode(() => validateDomainBatchSemantics(setupGenerationState(), [playerRosterCreatedEvent()]), "InvalidDomainBatchSemantics");
  });

  it("rejects CreatePlayerRoster when a roster already exists", () => {
    expectDomainCode(() => validateDomainBatchSemantics(rosterCreatedState(), [playerRosterCreatedEvent()]), "InvalidDomainBatchSemantics");
  });

  it("rejects CreatePlayerRoster batches with extra events", () => {
    expectDomainCode(
      () => validateDomainBatchSemantics(characterAssignmentState(), [playerRosterCreatedEvent(), playerRosterCreatedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("accepts a legal AssignCharacters two-event batch", () => {
    expect(() =>
      validateDomainBatchSemantics(rosterCreatedState(), [charactersAssignedEvent(), charactersAssignedPhaseTransitionedEvent()])
    ).not.toThrow();
  });

  it("rejects a bare CharactersAssigned event", () => {
    expectDomainCode(() => validateDomainBatchSemantics(rosterCreatedState(), [charactersAssignedEvent()]), "InvalidDomainBatchSemantics");
  });

  it("rejects a bare CHARACTERS_ASSIGNED transition", () => {
    expectDomainCode(
      () => validateDomainBatchSemantics(rosterCreatedState(), [charactersAssignedPhaseTransitionedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects reversed AssignCharacters batch order", () => {
    expectDomainCode(
      () => validateDomainBatchSemantics(rosterCreatedState(), [charactersAssignedPhaseTransitionedEvent(), charactersAssignedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects AssignCharacters batch metadata mismatch", () => {
    expectDomainCode(
      () =>
        validateDomainBatchSemantics(rosterCreatedState(), [
          charactersAssignedEvent(),
          charactersAssignedPhaseTransitionedEvent({ batchId: batchId("other-assignment-batch") })
        ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects AssignCharacters before a roster exists", () => {
    expectDomainCode(
      () => validateDomainBatchSemantics(characterAssignmentState(), [charactersAssignedEvent(), charactersAssignedPhaseTransitionedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects AssignCharacters transition with incorrect from and to phases", () => {
    expectDomainCode(
      () =>
        validateDomainBatchSemantics(rosterCreatedState(), [
          charactersAssignedEvent(),
          charactersAssignedPhaseTransitionedEvent({
            payload: {
              ...charactersAssignedPhaseTransitionedEvent().payload,
              fromPhase: "SETUP_GENERATION"
            }
          })
        ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("accepts a legal InitializeFirstNight two-event batch", () => {
    expect(() =>
      validateDomainBatchSemantics(firstNightState(), [firstNightInitializedEvent(), initialPrivateKnowledgeEstablishedEvent()])
    ).not.toThrow();
  });

  it("rejects a bare FirstNightInitialized event", () => {
    expectDomainCode(() => validateDomainBatchSemantics(firstNightState(), [firstNightInitializedEvent()]), "InvalidDomainBatchSemantics");
  });

  it("rejects a bare InitialPrivateKnowledgeEstablished event", () => {
    expectDomainCode(
      () => validateDomainBatchSemantics(firstNightState(), [initialPrivateKnowledgeEstablishedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects reversed InitializeFirstNight batch order", () => {
    expectDomainCode(
      () => validateDomainBatchSemantics(firstNightState(), [initialPrivateKnowledgeEstablishedEvent(), firstNightInitializedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects InitializeFirstNight batch metadata mismatch", () => {
    expectDomainCode(
      () =>
        validateDomainBatchSemantics(firstNightState(), [
          firstNightInitializedEvent(),
          initialPrivateKnowledgeEstablishedEvent({ batchId: batchId("other-first-night-batch") })
        ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects third events in the InitializeFirstNight batch", () => {
    expectDomainCode(
      () =>
        validateDomainBatchSemantics(firstNightState(), [
          firstNightInitializedEvent(),
          initialPrivateKnowledgeEstablishedEvent(),
          initialPrivateKnowledgeEstablishedEvent({
            eventId: eventId("third-first-night-event"),
            eventSequence: 11,
            batchId: firstNightInitializedEvent().batchId,
            commandId: firstNightInitializedEvent().commandId,
            gameVersion: firstNightInitializedEvent().gameVersion
          })
        ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("accepts only the exact SeamstressActionDeferred plus matching settlement batch", () => {
    const [deferred, settlement] = seamstressDeferredBatch();

    expect(() => validateDomainBatchSemantics(firstNightTaskPlanState(), [deferred, settlement])).not.toThrow();
  });

  it("rejects incomplete, reordered, overlong, metadata-mismatched, and cross-field-mismatched Seamstress batches", () => {
    const state = firstNightTaskPlanState();
    const [deferred, settlement] = seamstressDeferredBatch();

    expectDomainCode(
      () => validateDomainBatchSemantics(state, [deferred]),
      "InvalidDomainBatchSemantics"
    );
    expectDomainCode(
      () => validateDomainBatchSemantics(state, [settlement, deferred]),
      "InvalidDomainBatchSemantics"
    );
    expectDomainCode(
      () => validateDomainBatchSemantics(state, [deferred, settlement, {
        ...settlement,
        eventId: eventId("event-third-seamstress"),
        eventSequence: settlement.eventSequence + 1
      }]),
      "InvalidDomainBatchSemantics"
    );
    expectDomainCode(
      () => validateDomainBatchSemantics(state, [deferred, {
        ...settlement,
        batchId: batchId("other-seamstress-batch")
      }]),
      "InvalidDomainBatchSemantics"
    );
    expectDomainCode(
      () => validateDomainBatchSemantics(state, [deferred, {
        ...settlement,
        payload: {
          ...settlement.payload,
          taskId: scheduledTaskId("first-night-v1:SEAMSTRESS_ACTION:seat-99")
        }
      }]),
      "InvalidDomainBatchSemantics"
    );
    expectDomainCode(
      () => validateDomainBatchSemantics(state, [deferred, {
        ...settlement,
        payload: {
          ...settlement.payload,
          outcomeType: "DREAMER_INFORMATION_DELIVERED"
        } as never
      }]),
      "InvalidDomainBatchSemantics"
    );
    expectDomainCode(
      () => validateDomainBatchSemantics(state, [deferred, {
        ...settlement,
        payload: {
          ...settlement.payload,
          characterStateRevision: ("sourceCharacterStateRevision" in deferred.payload
            ? deferred.payload.sourceCharacterStateRevision
            : deferred.payload.opportunityCharacterStateRevision) + 1
        }
      }]),
      "InvalidDomainBatchSemantics"
    );
  });
});

describe("Phase 3 Slice 2B19A3A Vortox Dreamer batch semantics", () => {
  it("[2B19A3A-S23/S24/S25/S26/S27/S28/S29] rejects naked, partial, reordered, duplicate, split, cross-batch, and mismatched metadata", () => {
    const captured = loadAcceptedBaseDreamerVortoxV3StreamFixture("GOOD");
    const state = rebuildGameState(captured.events.slice(0, captured.targetEventIndex));
    const target = captured.events[captured.targetEventIndex];
    const delivery = captured.events[captured.deliveryEventIndex];
    const settlement = captured.events[captured.settlementEventIndex];
    if (target?.eventType !== "DreamerTargetChosen" || delivery?.eventType !== "DreamerInformationDelivered" ||
        settlement?.eventType !== "ScheduledTaskSettled") throw new Error("Expected V3 Dreamer batch");
    expect(() => validateDomainBatchSemantics(state, [target, delivery, settlement])).not.toThrow();
    const hostile: readonly (readonly AnyDomainEventEnvelope[])[] = [
      [delivery],
      [target, delivery],
      [delivery, target, settlement],
      [target, delivery, delivery, settlement],
      [target],
      [target, { ...delivery, batchId: batchId("cross-batch") }, settlement],
      [target, { ...delivery, commandId: commandId("other-command") }, settlement]
    ];
    for (const candidate of hostile) {
      expect(() => validateDomainBatchSemantics(state, candidate)).toThrowError(DomainError);
    }
  }, 15_000);
});
