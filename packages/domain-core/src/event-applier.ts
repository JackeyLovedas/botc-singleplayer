import { DomainError, assertNever } from "./errors.js";
import { RULES_BASELINE_VERSION, SUPPORTED_DOMAIN_EVENT_VERSION, isCanonicalPlayerCounts } from "./events.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";
import { evaluatePhaseTransition } from "./phase-transition-policy.js";

const validateEnvelope = (state: GameState | undefined, event: AnyDomainEventEnvelope): void => {
  if (event.eventVersion !== SUPPORTED_DOMAIN_EVENT_VERSION) {
    throw new DomainError("UnsupportedEventVersion", "Unsupported domain event version");
  }

  if (event.rulesBaselineVersion !== event.payload.rulesBaselineVersion) {
    throw new DomainError("EventRulesBaselineMismatch", "Event rules baseline metadata must match payload");
  }

  if (state === undefined) {
    if (event.eventSequence !== 1) {
      throw new DomainError("EventSequenceJump", "First domain event sequence must be 1");
    }

    if (event.eventType !== "GameCreated") {
      throw new DomainError("MissingGameCreated", "First domain event must be GameCreated");
    }

    return;
  }

  if (event.gameId !== state.gameId) {
    throw new DomainError("EventGameMismatch", "Domain event game id does not match rebuilt state");
  }

  if (event.eventSequence !== state.lastEventSequence + 1) {
    throw new DomainError("EventSequenceJump", "Domain event sequence must be continuous");
  }

  if (event.rulesBaselineVersion !== state.rulesBaselineVersion) {
    throw new DomainError("EventRulesBaselineMismatch", "Domain event rules baseline must match rebuilt state");
  }
};

export const applyDomainEvent = (state: GameState | undefined, event: AnyDomainEventEnvelope): GameState => {
  validateEnvelope(state, event);

  switch (event.eventType) {
    case "GameCreated": {
      if (state !== undefined) {
        throw new DomainError("DuplicateGameCreated", "GameCreated cannot be applied twice");
      }

      if (event.payload.gameId !== event.gameId) {
        throw new DomainError("InvalidGameCreatedPayload", "GameCreated payload game id must match event game id");
      }

      if (event.rulesBaselineVersion !== RULES_BASELINE_VERSION) {
        throw new DomainError("EventRulesBaselineMismatch", "GameCreated must use the supported rules baseline");
      }

      if (!isCanonicalPlayerCounts(event.payload)) {
        throw new DomainError("InvalidPlayerCounts", "First release requires 12 players, 1 human, 11 AI, and 1 Storyteller");
      }

      return {
        gameId: event.gameId,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        phase: "SCRIPT_SELECTION",
        dayNumber: 0,
        nightNumber: 0,
        created: true,
        rootSeed: event.payload.rootSeed,
        rulesBaselineVersion: event.payload.rulesBaselineVersion,
        playerCounts: {
          playerCount: event.payload.playerCount,
          humanPlayerCount: event.payload.humanPlayerCount,
          aiPlayerCount: event.payload.aiPlayerCount,
          storytellerCount: event.payload.storytellerCount
        }
      };
    }

    case "ScriptSelected": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "ScriptSelected requires an existing game");
      }

      if (event.payload.rulesBaselineVersion !== state.rulesBaselineVersion) {
        throw new DomainError("InvalidScriptSelectedPayload", "ScriptSelected payload rules baseline must match game state");
      }

      if (state.phase !== "SCRIPT_SELECTION") {
        throw new DomainError("InvalidScriptSelectedPhase", "ScriptSelected can only be applied during SCRIPT_SELECTION");
      }

      if (state.selectedScript !== undefined) {
        throw new DomainError("DuplicateScriptSelected", "ScriptSelected cannot overwrite an existing script selection");
      }

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        selectedScript: event.payload
      };
    }

    case "PhaseTransitioned": {
      if (state === undefined) {
        throw new DomainError("MissingGameCreated", "PhaseTransitioned requires an existing game");
      }

      if (event.payload.fromPhase !== state.phase) {
        throw new DomainError("InvalidPhaseTransition", "PhaseTransitioned fromPhase must match current game state");
      }

      if (
        event.payload.dayNumberBefore < 0 ||
        event.payload.dayNumberAfter < 0 ||
        event.payload.nightNumberBefore < 0 ||
        event.payload.nightNumberAfter < 0
      ) {
        throw new DomainError("InvalidPhaseCounter", "Phase day and night counters cannot be negative");
      }

      if (event.payload.dayNumberBefore !== state.dayNumber || event.payload.nightNumberBefore !== state.nightNumber) {
        throw new DomainError("InvalidPhaseCounter", "Phase counter before values must match current game state");
      }

      if (
        event.payload.transitionReason === "SCRIPT_SELECTED" &&
        event.payload.fromPhase === "SCRIPT_SELECTION" &&
        event.payload.toPhase === "SETUP_GENERATION" &&
        state.selectedScript === undefined
      ) {
        throw new DomainError("MissingTransitionPrerequisite", "SCRIPT_SELECTED transition requires a selected script fact");
      }

      const transition = evaluatePhaseTransition({
        fromPhase: event.payload.fromPhase,
        toPhase: event.payload.toPhase,
        dayNumber: state.dayNumber,
        nightNumber: state.nightNumber
      });

      if (!transition.allowed) {
        throw new DomainError("InvalidPhaseTransition", transition.reason);
      }

      if (event.payload.transitionReason !== transition.reasonCode) {
        throw new DomainError("InvalidPhaseTransitionReason", "PhaseTransitioned reason code must match transition policy");
      }

      if (event.payload.dayNumberAfter !== transition.dayNumber || event.payload.nightNumberAfter !== transition.nightNumber) {
        throw new DomainError("InvalidPhaseCounter", "Phase counter after values must match transition policy");
      }

      return {
        ...state,
        gameVersion: event.gameVersion,
        lastEventSequence: event.eventSequence,
        phase: event.payload.toPhase,
        dayNumber: event.payload.dayNumberAfter,
        nightNumber: event.payload.nightNumberAfter
      };
    }

    default:
      return assertNever(event);
  }
};
