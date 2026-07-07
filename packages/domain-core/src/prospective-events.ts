import { DomainError } from "./errors.js";
import { applyDomainEvent } from "./event-applier.js";
import { validateDomainBatchSemantics } from "./domain-batch-semantics.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";

export const applyDomainEventBatch = (
  currentState: GameState | undefined,
  events: readonly AnyDomainEventEnvelope[]
): GameState => {
  const candidateEvents = [...events];

  if (candidateEvents.length === 0) {
    throw new DomainError("EmptyEventBatch", "Cannot apply an empty domain event batch");
  }

  validateDomainBatchSemantics(currentState, candidateEvents);

  let state = currentState;
  for (const event of candidateEvents) {
    state = applyDomainEvent(state, event);
  }

  if (state === undefined) {
    throw new DomainError("EmptyEventBatch", "Cannot apply an empty domain event batch");
  }

  return state;
};
