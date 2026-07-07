import { DomainError } from "./errors.js";
import type { AnyDomainEventEnvelope, DomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";
import { isIntegratedTransitionReason } from "./phase-transition-policy.js";

const reject = (message: string): never => {
  throw new DomainError("InvalidDomainBatchSemantics", message);
};

const assertSharedBatchMetadata = (
  first: AnyDomainEventEnvelope,
  second: AnyDomainEventEnvelope
): void => {
  if (
    first.batchId !== second.batchId ||
    first.commandId !== second.commandId ||
    first.gameVersion !== second.gameVersion ||
    first.rulesBaselineVersion !== second.rulesBaselineVersion ||
    second.eventSequence !== first.eventSequence + 1
  ) {
    reject("SelectScript batch events must share batch metadata and have consecutive eventSequence values");
  }
};

const validateCreateGameBatch = (
  currentState: GameState | undefined,
  events: readonly AnyDomainEventEnvelope[]
): void => {
  if (currentState !== undefined) {
    reject("GameCreated batch requires an empty current state");
  }

  if (events.length !== 1) {
    reject("GameCreated batch must contain exactly one GameCreated event");
  }
};

const validateIntegratedScriptSelectionBatch = (
  currentState: GameState | undefined,
  scriptSelected: DomainEventEnvelope<"ScriptSelected">,
  phaseTransitioned: DomainEventEnvelope<"PhaseTransitioned">
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "SelectScript batch requires an existing current state");
  }

  const state = currentState;
  if (state.phase !== "SCRIPT_SELECTION" || state.selectedScript !== undefined) {
    reject("SelectScript batch requires SCRIPT_SELECTION with no selected script");
  }

  assertSharedBatchMetadata(scriptSelected, phaseTransitioned);

  if (
    phaseTransitioned.payload.fromPhase !== "SCRIPT_SELECTION" ||
    phaseTransitioned.payload.toPhase !== "SETUP_GENERATION" ||
    phaseTransitioned.payload.transitionReason !== "SCRIPT_SELECTED"
  ) {
    reject("SelectScript batch must transition SCRIPT_SELECTION to SETUP_GENERATION with SCRIPT_SELECTED");
  }
};

export const validateDomainBatchSemantics = (
  currentState: GameState | undefined,
  events: readonly AnyDomainEventEnvelope[]
): void => {
  const batchEvents = [...events];

  if (batchEvents.length === 0) {
    throw new DomainError("EmptyEventBatch", "Cannot validate an empty domain event batch");
  }

  const phaseTransitions = batchEvents.filter(
    (event): event is DomainEventEnvelope<"PhaseTransitioned"> => event.eventType === "PhaseTransitioned"
  );
  const unintegratedTransition = phaseTransitions.find((event) => !isIntegratedTransitionReason(event.payload.transitionReason));
  if (unintegratedTransition !== undefined) {
    throw new DomainError(
      "PhaseTransitionNotIntegrated",
      `${unintegratedTransition.payload.transitionReason} is planned but not integrated into the event log yet`
    );
  }

  const [first, second, third] = batchEvents;
  if (first === undefined) {
    throw new DomainError("EmptyEventBatch", "Cannot validate an empty domain event batch");
  }

  if (first.eventType === "GameCreated") {
    validateCreateGameBatch(currentState, batchEvents);
    return;
  }

  if (batchEvents.length !== 2) {
    reject("Only GameCreated and integrated SelectScript batches are currently supported");
  }

  if (third !== undefined) {
    reject("Integrated SelectScript batch must not contain a third domain event");
  }

  if (first.eventType !== "ScriptSelected" || second === undefined || second.eventType !== "PhaseTransitioned") {
    reject("Integrated SelectScript batch must contain ScriptSelected followed by PhaseTransitioned");
  }

  const scriptSelected = first as DomainEventEnvelope<"ScriptSelected">;
  const phaseTransitioned = second as DomainEventEnvelope<"PhaseTransitioned">;
  validateIntegratedScriptSelectionBatch(currentState, scriptSelected, phaseTransitioned);
};
