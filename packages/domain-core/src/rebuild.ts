import { DomainError } from "./errors.js";
import { applyDomainEvent } from "./event-applier.js";
import { validateDomainEventStream } from "./event-stream-validator.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";

export const rebuildGameState = (events: readonly AnyDomainEventEnvelope[]): GameState => {
  const eventList = [...events];

  if (eventList.length === 0) {
    throw new DomainError("EmptyEventStream", "Cannot rebuild game state from an empty domain event stream");
  }

  validateDomainEventStream(eventList);

  let state: GameState | undefined;

  for (const event of eventList) {
    state = applyDomainEvent(state, event);
  }

  if (state === undefined) {
    throw new DomainError("EmptyEventStream", "Cannot rebuild game state from an empty domain event stream");
  }

  return state;
};

export const rebuildOptionalGameState = (events: readonly AnyDomainEventEnvelope[]): GameState | undefined => {
  const eventList = [...events];

  if (eventList.length === 0) {
    return undefined;
  }

  return rebuildGameState(eventList);
};
