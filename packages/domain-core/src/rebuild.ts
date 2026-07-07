import { DomainError } from "./errors.js";
import { applyDomainEvent } from "./event-applier.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";

export const rebuildGameState = (events: readonly AnyDomainEventEnvelope[]): GameState => {
  if (events.length === 0) {
    throw new DomainError("EmptyEventStream", "Cannot rebuild game state from an empty domain event stream");
  }

  let state: GameState | undefined;

  for (const event of events) {
    state = applyDomainEvent(state, event);
  }

  if (state === undefined) {
    throw new DomainError("EmptyEventStream", "Cannot rebuild game state from an empty domain event stream");
  }

  return state;
};

export const rebuildOptionalGameState = (events: readonly AnyDomainEventEnvelope[]): GameState | undefined => {
  if (events.length === 0) {
    return undefined;
  }

  return rebuildGameState(events);
};
