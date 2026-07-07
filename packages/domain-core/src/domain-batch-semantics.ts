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

const validateIntegratedSetupGenerationBatch = (
  currentState: GameState | undefined,
  setupGenerated: DomainEventEnvelope<"SetupGenerated">,
  phaseTransitioned: DomainEventEnvelope<"PhaseTransitioned">
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "GenerateSetup batch requires an existing current state");
  }

  const state = currentState;
  if (state.phase !== "SETUP_GENERATION" || state.selectedScript === undefined || state.setup !== undefined) {
    reject("GenerateSetup batch requires SETUP_GENERATION with selected script and no existing setup");
  }

  assertSharedBatchMetadata(setupGenerated, phaseTransitioned);

  if (
    phaseTransitioned.payload.fromPhase !== "SETUP_GENERATION" ||
    phaseTransitioned.payload.toPhase !== "CHARACTER_ASSIGNMENT" ||
    phaseTransitioned.payload.transitionReason !== "SETUP_GENERATED"
  ) {
    reject("GenerateSetup batch must transition SETUP_GENERATION to CHARACTER_ASSIGNMENT with SETUP_GENERATED");
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
    reject("Only GameCreated, integrated SelectScript, and integrated GenerateSetup batches are currently supported");
  }

  if (third !== undefined) {
    reject("Integrated two-event batches must not contain a third domain event");
  }

  if (first.eventType === "ScriptSelected" && second !== undefined && second.eventType === "PhaseTransitioned") {
    validateIntegratedScriptSelectionBatch(currentState, first, second);
    return;
  }

  if (first.eventType === "SetupGenerated" && second !== undefined && second.eventType === "PhaseTransitioned") {
    validateIntegratedSetupGenerationBatch(currentState, first, second);
    return;
  }

  reject("Integrated two-event batch must contain a supported fact event followed by PhaseTransitioned");
};
