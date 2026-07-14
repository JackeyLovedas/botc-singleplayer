import { DomainError } from "./errors.js";
import { applyDomainEvent } from "./event-applier.js";
import { validateDomainEventStream } from "./event-stream-validator.js";
import { validateDomainBatchSemantics } from "./domain-batch-semantics.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";

const groupConsecutiveBatches = (
  events: readonly AnyDomainEventEnvelope[]
): readonly (readonly AnyDomainEventEnvelope[])[] => {
  const batches: AnyDomainEventEnvelope[][] = [];

  for (const event of events) {
    const currentBatch = batches.at(-1);
    if (currentBatch === undefined || currentBatch[0]?.batchId !== event.batchId) {
      batches.push([event]);
      continue;
    }

    currentBatch.push(event);
  }

  return batches;
};

export const rebuildGameState = (events: readonly AnyDomainEventEnvelope[]): GameState => {
  const eventList = [...events];

  if (eventList.length === 0) {
    throw new DomainError("EmptyEventStream", "Cannot rebuild game state from an empty domain event stream");
  }

  validateDomainEventStream(eventList);

  let state: GameState | undefined;

  for (const batch of groupConsecutiveBatches(eventList)) {
    validateDomainBatchSemantics(state, batch);

    for (const event of batch) {
      state = applyDomainEvent(state, event);
    }
  }

  if (state === undefined) {
    throw new DomainError("EmptyEventStream", "Cannot rebuild game state from an empty domain event stream");
  }

  const initializationEvents = eventList.filter((event) => event.eventType === "FirstNightInitialized");
  if (initializationEvents.length > 0 || state.firstNightAbilityOutcomeLedger !== undefined || state.firstNightInitializationProvenance !== undefined) {
    const initialization = initializationEvents[0];
    const anchor = state.firstNightAbilityOutcomeLedger?.windowAnchor;
    const provenance = state.firstNightInitializationProvenance;
    if (initializationEvents.length !== 1 || initialization === undefined || anchor === undefined || provenance === undefined ||
        anchor.firstNightInitializedEventId !== initialization.eventId || anchor.startEventSequence !== initialization.eventSequence ||
        anchor.gameId !== initialization.gameId || anchor.rulesBaselineVersion !== initialization.rulesBaselineVersion ||
        provenance.eventId !== initialization.eventId || provenance.eventSequence !== initialization.eventSequence ||
        provenance.gameId !== initialization.gameId || provenance.rulesBaselineVersion !== initialization.rulesBaselineVersion) {
      throw new DomainError("InvalidFirstNightAbilityOutcomeLedger", "Rebuilt ledger anchor must equal the unique FirstNightInitialized event envelope");
    }
  }

  return state;
};

export const rebuildOptionalCompleteAcceptedGameState = (events: readonly AnyDomainEventEnvelope[]): GameState | undefined => {
  const eventList = [...events];

  if (eventList.length === 0) {
    return undefined;
  }

  return rebuildGameState(eventList);
};

export const rebuildOptionalGameState = rebuildOptionalCompleteAcceptedGameState;
