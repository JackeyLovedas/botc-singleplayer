import { describe, expect, it } from "vitest";
import {
  DomainError,
  RULES_BASELINE_VERSION,
  batchId,
  commandId,
  correlationId,
  eventId,
  applyDomainEventBatch,
  rebuildGameState,
  validateDomainEventStream
} from "@botc/domain-core";
import type { AnyDomainEventEnvelope, DomainErrorCode, DomainEventEnvelope, GamePhase, PhaseTransitionReason } from "@botc/domain-core";
import {
  auditEvent,
  gameCreatedEvent,
  infrastructureEvent,
  otherGameId,
  phaseTransitionedEvent,
  scriptSelectedEvent
} from "@botc/test-harness";

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

const phaseEvent = (
  eventSequence: number,
  fromPhase: GamePhase,
  toPhase: GamePhase,
  dayNumberBefore: number,
  dayNumberAfter: number,
  nightNumberBefore: number,
  nightNumberAfter: number,
  transitionReason: PhaseTransitionReason
): DomainEventEnvelope<"PhaseTransitioned"> =>
  phaseTransitionedEvent({
    eventId: eventId(`phase-event-${eventSequence}`),
    batchId: batchId(`phase-batch-${eventSequence}`),
    commandId: commandId(`phase-command-${eventSequence}`),
    correlationId: correlationId(`phase-correlation-${eventSequence}`),
    eventSequence,
    gameVersion: eventSequence,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      fromPhase,
      toPhase,
      transitionReason,
      dayNumberBefore,
      dayNumberAfter,
      nightNumberBefore,
      nightNumberAfter
    }
  });

describe("domain event rebuild", () => {
  it("has explicit empty event stream behavior", () => {
    expectDomainCode(() => rebuildGameState([]), "EmptyEventStream");
    expect(() => rebuildGameState([])).toThrow("empty domain event stream");
  });

  it("applies GameCreated into minimal canonical state", () => {
    const state = rebuildGameState([gameCreatedEvent()]);

    expect(state).toMatchObject({
      gameVersion: 1,
      lastEventSequence: 1,
      created: true,
      rootSeed: "seed-1",
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      phase: "SCRIPT_SELECTION",
      dayNumber: 0,
      nightNumber: 0,
      playerCounts: {
        playerCount: 12,
        humanPlayerCount: 1,
        aiPlayerCount: 11,
        storytellerCount: 1
      }
    });
  });

  it("rebuilds the initial phase and counters after GameCreated", () => {
    const state = rebuildGameState([gameCreatedEvent()]);

    expect(state.phase).toBe("SCRIPT_SELECTION");
    expect(state.dayNumber).toBe(0);
    expect(state.nightNumber).toBe(0);
    expect(rebuildGameState([gameCreatedEvent()])).toStrictEqual(state);
  });

  it("requires ScriptSelected to follow GameCreated", () => {
    const event = scriptSelectedEvent({ eventSequence: 1, gameVersion: 1 });

    expectDomainCode(() => rebuildGameState([event]), "MissingGameCreated");
  });

  it("rejects duplicate GameCreated", () => {
    const duplicate = gameCreatedEvent({
      eventId: eventId("event-2"),
      eventSequence: 2,
      batchId: scriptSelectedEvent().batchId,
      commandId: scriptSelectedEvent().commandId,
      gameVersion: 2
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), duplicate]), "DuplicateGameCreated");
  });

  it("rejects event sequence jumps", () => {
    const jumped = scriptSelectedEvent({ eventSequence: 3 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), jumped]), "EventSequenceJump");
  });

  it("rejects repeated event sequences", () => {
    const repeated = scriptSelectedEvent({ eventSequence: 1 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), repeated]), "EventSequenceJump");
  });

  it("rejects unsupported event versions", () => {
    const unsupported = {
      ...gameCreatedEvent(),
      eventVersion: 2
    } as unknown as AnyDomainEventEnvelope;

    expectDomainCode(() => rebuildGameState([unsupported]), "UnsupportedEventVersion");
  });

  it("rebuilds the same event stream deterministically", () => {
    const events = [gameCreatedEvent(), scriptSelectedEvent()];

    expect(rebuildGameState(events)).toStrictEqual(rebuildGameState(events));
  });

  it("does not mutate input events", () => {
    const events = [gameCreatedEvent(), scriptSelectedEvent()];
    const before = JSON.stringify(events);

    rebuildGameState(events);

    expect(JSON.stringify(events)).toBe(before);
  });

  it("rejects a first event whose gameVersion is not 1", () => {
    const event = gameCreatedEvent({ gameVersion: 2 });

    expectDomainCode(() => validateDomainEventStream([event]), "EventGameVersionMismatch");
  });

  it("rejects gameVersion jumps between batches", () => {
    const event = scriptSelectedEvent({ gameVersion: 3 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), event]), "EventGameVersionMismatch");
  });

  it("rejects gameVersion retreat between batches", () => {
    const event = scriptSelectedEvent({ gameVersion: 0 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), event]), "EventGameVersionMismatch");
  });

  it("rejects different gameVersion values inside one batch", () => {
    const created = gameCreatedEvent();
    const selected = scriptSelectedEvent({
      batchId: created.batchId,
      commandId: created.commandId,
      eventSequence: 2,
      gameVersion: 2
    });

    expectDomainCode(() => rebuildGameState([created, selected]), "EventGameVersionMismatch");
  });

  it("rejects different commandId values inside one batch", () => {
    const created = gameCreatedEvent();
    const selected = scriptSelectedEvent({
      batchId: created.batchId,
      eventSequence: 2,
      gameVersion: 1,
      commandId: commandId("other-command")
    });

    expectDomainCode(() => rebuildGameState([created, selected]), "EventCommandMismatch");
  });

  it("rejects different gameId values inside one stream", () => {
    const created = gameCreatedEvent();
    const selected = scriptSelectedEvent({
      batchId: created.batchId,
      commandId: created.commandId,
      eventSequence: 2,
      gameVersion: 1,
      gameId: otherGameId()
    });

    expectDomainCode(() => rebuildGameState([created, selected]), "EventGameMismatch");
  });

  it("rejects rules baseline changes inside one stream", () => {
    const selected = scriptSelectedEvent({
      rulesBaselineVersion: "Phase One v0",
      payload: {
        ...scriptSelectedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "EventRulesBaselineMismatch");
  });

  it("rejects duplicate event ids", () => {
    const selected = scriptSelectedEvent({ eventId: gameCreatedEvent().eventId });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "DuplicateEventId");
  });

  it("rejects one commandId associated with two successful batches", () => {
    const selected = scriptSelectedEvent({ commandId: gameCreatedEvent().commandId });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "DuplicateCommandBatch");
  });

  it("rejects event metadata rules baseline that differs from payload", () => {
    const event = gameCreatedEvent({
      payload: {
        ...gameCreatedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([event]), "EventRulesBaselineMismatch");
  });

  it("rejects ScriptSelected when its rules baseline differs from GameState", () => {
    const selected = scriptSelectedEvent({
      rulesBaselineVersion: "Phase One v0",
      payload: {
        ...scriptSelectedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "EventRulesBaselineMismatch");
  });

  it("rebuilds a legal multi-event batch", () => {
    const created = gameCreatedEvent();
    const selected = scriptSelectedEvent({
      batchId: created.batchId,
      commandId: created.commandId,
      eventSequence: 2,
      gameVersion: 1
    });

    const state = rebuildGameState([created, selected]);

    expect(state.gameVersion).toBe(1);
    expect(state.lastEventSequence).toBe(2);
    expect(state.selectedScript).toMatchObject({ scriptId: "sects-and-violets" });
  });

  it("applies PhaseTransitioned into SETUP_GENERATION after ScriptSelected", () => {
    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);

    expect(state.phase).toBe("SETUP_GENERATION");
    expect(state.dayNumber).toBe(0);
    expect(state.nightNumber).toBe(0);
    expect(state.gameVersion).toBe(2);
    expect(state.lastEventSequence).toBe(3);
  });

  it("rejects ScriptSelected after the game has already reached SETUP_GENERATION", () => {
    const duplicate = scriptSelectedEvent({
      eventId: eventId("event-4"),
      eventSequence: 4,
      batchId: batchId("batch-3"),
      commandId: commandId("command-3"),
      gameVersion: 3
    });

    expectDomainCode(
      () => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent(), duplicate]),
      "InvalidScriptSelectedPhase"
    );
  });

  it("rejects two ScriptSelected events in one stream before phase transition", () => {
    const duplicate = scriptSelectedEvent({
      eventId: eventId("event-3"),
      eventSequence: 3,
      batchId: batchId("batch-3"),
      commandId: commandId("command-3"),
      gameVersion: 3
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), duplicate]), "DuplicateScriptSelected");
  });

  it("rejects PhaseTransitioned when reasonCode does not match policy", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        transitionReason: "SETUP_GENERATED"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), event]), "InvalidPhaseTransitionReason");
  });

  it("keeps transitionReason as a typed replay fact", () => {
    const event = phaseTransitionedEvent();
    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), event]);

    expect(event.payload.transitionReason).toBe("SCRIPT_SELECTED");
    expect(state.phase).toBe("SETUP_GENERATION");
  });

  it("rejects semantically invalid prospective batches without mutating inputs", () => {
    const currentState = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);
    const invalid = [scriptSelectedEvent({
      eventId: eventId("event-4"),
      eventSequence: 4,
      batchId: batchId("batch-3"),
      commandId: commandId("command-3"),
      gameVersion: 3
    })];
    const stateBefore = JSON.stringify(currentState);
    const eventsBefore = JSON.stringify(invalid);

    expectDomainCode(() => applyDomainEventBatch(currentState, invalid), "InvalidScriptSelectedPhase");
    expect(JSON.stringify(currentState)).toBe(stateBefore);
    expect(JSON.stringify(invalid)).toBe(eventsBefore);
  });

  it("does not allow arbitrary transitionReason strings at the type boundary", () => {
    const event = phaseTransitionedEvent();
    // @ts-expect-error transitionReason must be a PhaseTransitionReason value
    const invalid: typeof event.payload.transitionReason = "SCRIPT_SELECTION_TO_SETUP_GENERATION";

    void invalid;
    expect(event.payload.transitionReason).toBe("SCRIPT_SELECTED");
  });

  it("rejects PhaseTransitioned when fromPhase does not match state", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        fromPhase: "DAY_DISCUSSION"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), event]), "InvalidPhaseTransition");
  });

  it("rejects negative phase counters", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        dayNumberAfter: -1
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), event]), "InvalidPhaseCounter");
  });

  it("rejects illegal phase jumps", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        toPhase: "FIRST_NIGHT"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), event]), "InvalidPhaseTransition");
  });

  it("does not allow GAME_ENDED to recover to an active phase", () => {
    const events = [
      gameCreatedEvent(),
      phaseEvent(2, "SCRIPT_SELECTION", "SETUP_GENERATION", 0, 0, 0, 0, "SCRIPT_SELECTED"),
      phaseEvent(3, "SETUP_GENERATION", "CHARACTER_ASSIGNMENT", 0, 0, 0, 0, "SETUP_GENERATED"),
      phaseEvent(4, "CHARACTER_ASSIGNMENT", "FIRST_NIGHT", 0, 0, 0, 1, "CHARACTERS_ASSIGNED"),
      phaseEvent(5, "FIRST_NIGHT", "DAWN_RESOLUTION", 0, 0, 1, 1, "FIRST_NIGHT_COMPLETED"),
      phaseEvent(6, "DAWN_RESOLUTION", "DAY_DISCUSSION", 0, 1, 1, 1, "DAWN_COMPLETED"),
      phaseEvent(7, "DAY_DISCUSSION", "NOMINATION_WINDOW", 1, 1, 1, 1, "NOMINATION_OPENED"),
      phaseEvent(8, "NOMINATION_WINDOW", "GAME_ENDED", 1, 1, 1, 1, "GAME_ENDED"),
      phaseEvent(9, "GAME_ENDED", "DAY_DISCUSSION", 1, 1, 1, 1, "DAWN_COMPLETED")
    ];

    expectDomainCode(() => rebuildGameState(events), "InvalidPhaseTransition");
  });

  it("rejects PhaseTransitioned rules baseline mismatch", () => {
    const event = phaseTransitionedEvent({
      rulesBaselineVersion: "Phase One v0",
      payload: {
        ...phaseTransitionedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), event]), "EventRulesBaselineMismatch");
  });

  it("does not allow AuditEvent streams at the type boundary", () => {
    const auditEvents = [auditEvent()];
    // @ts-expect-error audit events are not domain events and cannot rebuild canonical state
    const rejectedDomainEvents: Parameters<typeof rebuildGameState>[0] = auditEvents;

    void rejectedDomainEvents;
    expect(auditEvents[0]?.category).toBe("audit");
  });

  it("does not allow InfrastructureEvent streams at the type boundary", () => {
    const infrastructureEvents = [infrastructureEvent()];
    // @ts-expect-error infrastructure events are not domain events and cannot rebuild canonical state
    const rejectedDomainEvents: Parameters<typeof rebuildGameState>[0] = infrastructureEvents;

    void rejectedDomainEvents;
    expect(infrastructureEvents[0]?.category).toBe("infrastructure");
  });
});
