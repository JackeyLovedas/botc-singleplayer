import { sameCanonicalDataValue } from "./canonical-data.js";
import { DomainError } from "./errors.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";
import {
  applyRoleTenureTransitionFact,
  bootstrapRoleTenuresFromCharactersAssigned,
  roleTenureTransitionFactsFromSnakeCharmerDemonSwap,
  validateRoleTenureStateAgainstCurrentCharacterState,
  validateRoleTenureStateExact
} from "./seamstress.js";

const REPLAY_REASONS = {
  missing: "Rebuilt canonical role tenure state is missing",
  assignment: "Rebuilt role tenure assignment authority does not match accepted history",
  transitions: "Rebuilt role tenure transitions do not match accepted history",
  processed: "Rebuilt processed role tenure transition IDs do not match accepted history",
  records: "Rebuilt role tenure records do not match accepted history",
  current: "Rebuilt role tenure state does not match current character state"
} as const;

const invalid = (reason: string): never => {
  throw new DomainError("InvalidRoleTenureState", reason);
};

export const assertRebuiltCanonicalRoleTenureState = (
  events: readonly AnyDomainEventEnvelope[],
  state: GameState
): void => {
  const actual = state.seamstressRoleTenureState ?? invalid(REPLAY_REASONS.missing);
  const actualValidation = validateRoleTenureStateExact(actual);
  if (!actualValidation.valid) invalid(actualValidation.reason);

  const assignmentEvents = events.filter((event) => event.eventType === "CharactersAssigned");
  if (assignmentEvents.length !== 1) return invalid(REPLAY_REASONS.assignment);
  const assignmentEvent = assignmentEvents[0] ?? invalid(REPLAY_REASONS.assignment);
  if (state.assignment === undefined ||
      !sameCanonicalDataValue(state.assignment, assignmentEvent.payload)) {
    return invalid(REPLAY_REASONS.assignment);
  }

  let expected = actual;
  try {
    expected = bootstrapRoleTenuresFromCharactersAssigned({
      assignments: assignmentEvent.payload.assignments,
      sourceEventId: assignmentEvent.eventId,
      sourceEventSequence: assignmentEvent.eventSequence
    });
  } catch {
    return invalid(REPLAY_REASONS.assignment);
  }

  const transitionEvents = events.filter((event) => event.eventType === "SnakeCharmerDemonSwapApplied");
  const rebuiltSwaps = state.snakeCharmerDemonSwaps?.swaps ?? [];
  if (rebuiltSwaps.length !== transitionEvents.length || transitionEvents.some((event, index) =>
      !sameCanonicalDataValue(rebuiltSwaps[index], event.payload))) {
    return invalid(REPLAY_REASONS.transitions);
  }

  try {
    for (const event of transitionEvents) {
      for (const fact of roleTenureTransitionFactsFromSnakeCharmerDemonSwap({
        eventId: event.eventId,
        eventSequence: event.eventSequence,
        payload: event.payload
      })) {
        expected = applyRoleTenureTransitionFact(expected, fact);
      }
    }
  } catch {
    return invalid(REPLAY_REASONS.transitions);
  }

  if (!sameCanonicalDataValue(actual.processedTransitionFactIds, expected.processedTransitionFactIds)) {
    invalid(REPLAY_REASONS.processed);
  }
  if (!sameCanonicalDataValue(actual.records, expected.records)) {
    invalid(REPLAY_REASONS.records);
  }
  if (state.currentCharacterState === undefined ||
      !validateRoleTenureStateAgainstCurrentCharacterState({
        roleTenures: actual,
        currentCharacterState: state.currentCharacterState
      }).valid) {
    invalid(REPLAY_REASONS.current);
  }
};
