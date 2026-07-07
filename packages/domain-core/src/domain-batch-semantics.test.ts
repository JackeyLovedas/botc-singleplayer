import { describe, expect, it } from "vitest";
import {
  DomainError,
  applyDomainEvent,
  batchId,
  commandId,
  evaluatePhaseTransition,
  eventId,
  rebuildGameState,
  validateDomainBatchSemantics
} from "@botc/domain-core";
import type { AnyDomainEventEnvelope, DomainErrorCode } from "@botc/domain-core";
import { gameCreatedEvent, phaseTransitionedEvent, scriptSelectedEvent } from "@botc/test-harness";

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

describe("domain batch semantic validation", () => {
  it("accepts a legal CreateGame single-event batch", () => {
    expect(() => validateDomainBatchSemantics(undefined, [gameCreatedEvent()])).not.toThrow();
  });

  it("accepts a legal SelectScript two-event batch", () => {
    expect(() => validateDomainBatchSemantics(createdState(), [scriptSelectedEvent(), phaseTransitionedEvent()])).not.toThrow();
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

  it("rejects planned SETUP_GENERATED transitions before integration", () => {
    const futureTransition = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        fromPhase: "SETUP_GENERATION",
        toPhase: "CHARACTER_ASSIGNMENT",
        transitionReason: "SETUP_GENERATED"
      }
    });

    expectDomainCode(() => validateDomainBatchSemantics(createdState(), [futureTransition]), "PhaseTransitionNotIntegrated");
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
});
