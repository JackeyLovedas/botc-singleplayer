import { DomainError } from "./errors.js";
import type { AnyDomainEventEnvelope, DomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";
import { isIntegratedTransitionReason } from "./phase-transition-policy.js";
import { firstNightTaskTypeForPhilosopherChoice } from "./philosopher-ability.js";

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
    reject("Integrated batch events must share batch metadata and have consecutive eventSequence values");
  }
};

const assertSharedBatchMetadataForAll = (
  events: readonly AnyDomainEventEnvelope[]
): void => {
  const [base, ...rest] = events;
  if (base === undefined) {
    reject("Integrated batch must contain at least one event");
  }

  const first = base as AnyDomainEventEnvelope;
  for (const [index, event] of rest.entries()) {
    if (
      first.batchId !== event.batchId ||
      first.commandId !== event.commandId ||
      first.gameVersion !== event.gameVersion ||
      first.rulesBaselineVersion !== event.rulesBaselineVersion ||
      event.eventSequence !== first.eventSequence + index + 1
    ) {
      reject("Integrated batch events must share batch metadata and have consecutive eventSequence values");
    }
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

const validatePlayerRosterCreatedBatch = (
  currentState: GameState | undefined,
  events: readonly AnyDomainEventEnvelope[]
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "CreatePlayerRoster batch requires an existing current state");
  }

  const state = currentState;
  if (state.phase !== "CHARACTER_ASSIGNMENT" || state.setup === undefined || state.roster !== undefined || state.assignment !== undefined) {
    reject("CreatePlayerRoster batch requires CHARACTER_ASSIGNMENT with setup and no existing roster or assignment");
  }

  if (events.length !== 1) {
    reject("CreatePlayerRoster batch must contain exactly one PlayerRosterCreated event");
  }
};

const validateIntegratedCharactersAssignedBatch = (
  currentState: GameState | undefined,
  charactersAssigned: DomainEventEnvelope<"CharactersAssigned">,
  phaseTransitioned: DomainEventEnvelope<"PhaseTransitioned">
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "AssignCharacters batch requires an existing current state");
  }

  const state = currentState;
  if (state.phase !== "CHARACTER_ASSIGNMENT" || state.setup === undefined || state.roster === undefined || state.assignment !== undefined) {
    reject("AssignCharacters batch requires CHARACTER_ASSIGNMENT with setup, roster, and no existing assignment");
  }

  assertSharedBatchMetadata(charactersAssigned, phaseTransitioned);

  if (
    phaseTransitioned.payload.fromPhase !== "CHARACTER_ASSIGNMENT" ||
    phaseTransitioned.payload.toPhase !== "FIRST_NIGHT" ||
    phaseTransitioned.payload.transitionReason !== "CHARACTERS_ASSIGNED"
  ) {
    reject("AssignCharacters batch must transition CHARACTER_ASSIGNMENT to FIRST_NIGHT with CHARACTERS_ASSIGNED");
  }
};

const validateIntegratedFirstNightInitializationBatch = (
  currentState: GameState | undefined,
  firstNightInitialized: DomainEventEnvelope<"FirstNightInitialized">,
  initialPrivateKnowledgeEstablished: DomainEventEnvelope<"InitialPrivateKnowledgeEstablished">
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "InitializeFirstNight batch requires an existing current state");
  }

  const state = currentState;
  if (
    state.phase !== "FIRST_NIGHT" ||
    state.nightNumber !== 1 ||
    state.dayNumber !== 0 ||
    state.setup === undefined ||
    state.roster === undefined ||
    state.assignment === undefined ||
    state.firstNight !== undefined ||
    state.initialPrivateKnowledge !== undefined
  ) {
    reject("InitializeFirstNight batch requires FIRST_NIGHT night 1 with setup, roster, assignment, and no existing first night facts");
  }

  assertSharedBatchMetadata(firstNightInitialized, initialPrivateKnowledgeEstablished);
};

const validateFirstNightTaskPlanCreatedBatch = (
  currentState: GameState | undefined,
  events: readonly AnyDomainEventEnvelope[]
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "PlanFirstNightTasks batch requires an existing current state");
  }

  const state = currentState;
  if (
    state.phase !== "FIRST_NIGHT" ||
    state.nightNumber !== 1 ||
    state.dayNumber !== 0 ||
    state.setup === undefined ||
    state.roster === undefined ||
    state.assignment === undefined ||
    state.firstNight === undefined ||
    state.initialPrivateKnowledge === undefined ||
    state.firstNightTaskPlan !== undefined
  ) {
    reject("PlanFirstNightTasks batch requires FIRST_NIGHT night 1 with setup, roster, assignment, first-night knowledge, and no existing task plan");
  }

  if (events.length !== 1) {
    reject("PlanFirstNightTasks batch must contain exactly one FirstNightTaskPlanCreated event");
  }
};

const validateFirstNightActionOpportunityCreatedBatch = (
  currentState: GameState | undefined,
  events: readonly AnyDomainEventEnvelope[]
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "First-night role action opportunity batch requires an existing current state");
  }

  const state = currentState;
  if (
    state.phase !== "FIRST_NIGHT" ||
    state.nightNumber !== 1 ||
    state.dayNumber !== 0 ||
    state.firstNightTaskPlan === undefined ||
    state.currentCharacterState === undefined
  ) {
    reject("First-night role action opportunity batch requires FIRST_NIGHT night 1 with task plan and current character state");
  }

  if (events.length !== 1) {
    reject("OpenFirstNightRoleActionOpportunity batch must contain exactly one FirstNightActionOpportunityCreated event");
  }
};

const validateIntegratedFirstNightSystemInformationBatch = (
  currentState: GameState | undefined,
  informationDelivered: DomainEventEnvelope<"MinionInformationDelivered"> | DomainEventEnvelope<"DemonInformationDelivered">,
  scheduledTaskSettled: DomainEventEnvelope<"ScheduledTaskSettled">
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "First-night system information batch requires an existing current state");
  }

  const state = currentState;
  if (
    state.phase !== "FIRST_NIGHT" ||
    state.nightNumber !== 1 ||
    state.dayNumber !== 0 ||
    state.firstNightTaskPlan === undefined ||
    state.currentCharacterState === undefined
  ) {
    reject("First-night system information batch requires FIRST_NIGHT night 1 with task plan and current character state");
  }

  assertSharedBatchMetadata(informationDelivered, scheduledTaskSettled);

  const deliveredSnapshotRevision = informationDelivered.payload.resolvedEvilTeam?.characterStateRevision;
  if (typeof deliveredSnapshotRevision !== "number") {
    reject("Team information event must include a delivered evil team snapshot revision");
  }

  if (
    scheduledTaskSettled.payload.taskId !== informationDelivered.payload.taskId ||
    scheduledTaskSettled.payload.taskType !== informationDelivered.payload.taskType ||
    scheduledTaskSettled.payload.characterStateRevision !== informationDelivered.payload.characterStateRevision ||
    scheduledTaskSettled.payload.characterStateRevision !== deliveredSnapshotRevision
  ) {
    reject("ScheduledTaskSettled must match the preceding team information event task identity and delivered evil team revision");
  }

  if (
    informationDelivered.eventType === "MinionInformationDelivered" &&
    scheduledTaskSettled.payload.outcomeType !== "MINION_INFORMATION_DELIVERED"
  ) {
    reject("MINION_INFO settlement must use MINION_INFORMATION_DELIVERED outcome");
  }

  if (
    informationDelivered.eventType === "DemonInformationDelivered" &&
    scheduledTaskSettled.payload.outcomeType !== "DEMON_INFORMATION_DELIVERED"
  ) {
    reject("DEMON_INFO settlement must use DEMON_INFORMATION_DELIVERED outcome");
  }
};

const validateIntegratedPhilosopherActionDeferredBatch = (
  currentState: GameState | undefined,
  philosopherActionDeferred: DomainEventEnvelope<"PhilosopherActionDeferred">,
  scheduledTaskSettled: DomainEventEnvelope<"ScheduledTaskSettled">
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "Philosopher action settlement batch requires an existing current state");
  }

  const state = currentState;
  if (
    state.phase !== "FIRST_NIGHT" ||
    state.nightNumber !== 1 ||
    state.dayNumber !== 0 ||
    state.firstNightTaskPlan === undefined ||
    state.currentCharacterState === undefined
  ) {
    reject("Philosopher action settlement batch requires FIRST_NIGHT night 1 with task plan and current character state");
  }

  assertSharedBatchMetadata(philosopherActionDeferred, scheduledTaskSettled);

  if (
    scheduledTaskSettled.payload.taskId !== philosopherActionDeferred.payload.taskId ||
    scheduledTaskSettled.payload.taskType !== philosopherActionDeferred.payload.taskType ||
    scheduledTaskSettled.payload.characterStateRevision !== philosopherActionDeferred.payload.sourceCharacterStateRevision
  ) {
    reject("ScheduledTaskSettled must match the preceding PhilosopherActionDeferred task identity and source revision");
  }

  if (scheduledTaskSettled.payload.outcomeType !== "PHILOSOPHER_DEFERRED") {
    reject("PHILOSOPHER_ACTION settlement must use PHILOSOPHER_DEFERRED outcome");
  }
};

const sameRoleSnapshot = (
  left: DomainEventEnvelope<"PhilosopherAbilityChosen">["payload"]["chosenRole"],
  right: DomainEventEnvelope<"PhilosopherAbilityChosen">["payload"]["chosenRole"]
): boolean =>
  left.roleId === right.roleId &&
  left.characterType === right.characterType &&
  left.defaultAlignment === right.defaultAlignment &&
  left.edition === right.edition &&
  left.setupModifier.outsiderDelta === right.setupModifier.outsiderDelta &&
  left.setupModifier.townsfolkDelta === right.setupModifier.townsfolkDelta;

const validateIntegratedPhilosopherAbilityChoiceBatch = (
  currentState: GameState | undefined,
  events: readonly AnyDomainEventEnvelope[]
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "Philosopher ability choice batch requires an existing current state");
  }

  const state = currentState;
  const currentCharacterState = state.currentCharacterState;
  if (currentCharacterState === undefined) {
    throw new DomainError(
      "InvalidDomainBatchSemantics",
      "Philosopher ability choice batch requires FIRST_NIGHT night 1 with task plan and current character state"
    );
  }

  if (
    state.phase !== "FIRST_NIGHT" ||
    state.nightNumber !== 1 ||
    state.dayNumber !== 0 ||
    state.firstNightTaskPlan === undefined
  ) {
    reject("Philosopher ability choice batch requires FIRST_NIGHT night 1 with task plan and current character state");
  }

  if (events.length < 3 || events.length > 5) {
    reject("Philosopher ability choice batches must contain three to five events");
  }

  assertSharedBatchMetadataForAll(events);

  const [first, second] = events;
  const last = events[events.length - 1];
  if (
    first === undefined ||
    second === undefined ||
    last === undefined ||
    first.eventType !== "PhilosopherAbilityChosen" ||
    second.eventType !== "PhilosopherAbilityGranted" ||
    last.eventType !== "ScheduledTaskSettled"
  ) {
    reject("Philosopher ability choice batch must start with choice and grant and end with settlement");
  }

  const choiceEvent = first as DomainEventEnvelope<"PhilosopherAbilityChosen">;
  const grantEvent = second as DomainEventEnvelope<"PhilosopherAbilityGranted">;
  const settlementEvent = last as DomainEventEnvelope<"ScheduledTaskSettled">;

  const middle = events.slice(2, -1);
  let seenImpairment = false;
  let seenInsertion = false;
  for (const event of middle) {
    if (event.eventType === "AbilityImpairmentApplied" && !seenImpairment && !seenInsertion) {
      seenImpairment = true;
      continue;
    }

    if (event.eventType === "FirstNightTaskInserted" && !seenInsertion) {
      seenInsertion = true;
      continue;
    }

    reject("Philosopher ability choice batch optional events must be impairment followed by insertion");
  }

  const choice = choiceEvent.payload;
  const grant = grantEvent.payload;
  const settlement = settlementEvent.payload;
  const chosenRoleCurrentlyInPlay = currentCharacterState.entries.some((entry) => entry.role.roleId === choice.chosenRoleId);
  const chosenRoleRequiresInsertion = firstNightTaskTypeForPhilosopherChoice(choice.chosenRoleId) !== undefined;

  if (chosenRoleCurrentlyInPlay !== seenImpairment) {
    reject("Philosopher ability choice batch must include impairment exactly when the chosen role is currently in play");
  }

  if (chosenRoleRequiresInsertion !== seenInsertion) {
    reject("Philosopher ability choice batch must include a gained task insertion exactly when the chosen role has a mapped first-night task");
  }

  if (
    grant.taskId !== choice.taskId ||
    grant.grantedAtTaskId !== choice.taskId ||
    grant.opportunityId !== choice.opportunityId ||
    grant.grantedAtOpportunityId !== choice.opportunityId ||
    grant.sourcePlayerId !== choice.sourcePlayerId ||
    grant.sourceSeatNumber !== choice.sourceSeatNumber ||
    !sameRoleSnapshot(grant.sourceRole, choice.sourceRole) ||
    grant.sourceCharacterStateRevision !== choice.sourceCharacterStateRevision ||
    grant.chosenRoleId !== choice.chosenRoleId ||
    !sameRoleSnapshot(grant.chosenRole, choice.chosenRole) ||
    grant.chosenRoleCatalogSignature !== choice.roleCatalogSignature
  ) {
    reject("PhilosopherAbilityGranted must match the preceding PhilosopherAbilityChosen event");
  }

  for (const event of middle) {
    if (event.eventType === "AbilityImpairmentApplied") {
      if (
        event.payload.sourcePlayerId !== choice.sourcePlayerId ||
        event.payload.chosenRoleId !== choice.chosenRoleId ||
        event.payload.sourceCharacterStateRevision !== choice.sourceCharacterStateRevision
      ) {
        reject("AbilityImpairmentApplied must match the Philosopher ability choice source and chosen role");
      }
    }

    if (event.eventType === "FirstNightTaskInserted") {
      if (
        event.payload.insertedByPlayerId !== choice.sourcePlayerId ||
        event.payload.insertedByOpportunityId !== choice.opportunityId ||
        event.payload.sourceCharacterStateRevision !== choice.sourceCharacterStateRevision ||
        !sameRoleSnapshot(event.payload.chosenRole, choice.chosenRole)
      ) {
        reject("FirstNightTaskInserted must match the Philosopher ability choice source and chosen role");
      }
    }
  }

  if (
    settlement.taskId !== choice.taskId ||
    settlement.taskType !== choice.taskType ||
    settlement.characterStateRevision !== choice.sourceCharacterStateRevision ||
    settlement.outcomeType !== "PHILOSOPHER_ABILITY_CHOSEN"
  ) {
    reject("ScheduledTaskSettled must close the Philosopher action as PHILOSOPHER_ABILITY_CHOSEN");
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

  if (first.eventType === "PlayerRosterCreated") {
    validatePlayerRosterCreatedBatch(currentState, batchEvents);
    return;
  }

  if (first.eventType === "FirstNightTaskPlanCreated") {
    validateFirstNightTaskPlanCreatedBatch(currentState, batchEvents);
    return;
  }

  if (first.eventType === "FirstNightActionOpportunityCreated") {
    validateFirstNightActionOpportunityCreatedBatch(currentState, batchEvents);
    return;
  }

  if (first.eventType === "PhilosopherAbilityChosen") {
    validateIntegratedPhilosopherAbilityChoiceBatch(currentState, batchEvents);
    return;
  }

  if (
    first.eventType === "PhilosopherActionDeferred" &&
    second !== undefined &&
    second.eventType === "ScheduledTaskSettled"
  ) {
    if (batchEvents.length !== 2 || third !== undefined) {
      reject("Philosopher action settlement batches must contain exactly two events");
    }

    validateIntegratedPhilosopherActionDeferredBatch(currentState, first, second);
    return;
  }

  if (
    (first.eventType === "MinionInformationDelivered" || first.eventType === "DemonInformationDelivered") &&
    second !== undefined &&
    second.eventType === "ScheduledTaskSettled"
  ) {
    if (batchEvents.length !== 2 || third !== undefined) {
      reject("First-night system information settlement batches must contain exactly two events");
    }

    validateIntegratedFirstNightSystemInformationBatch(currentState, first, second);
    return;
  }

  if (batchEvents.length !== 2) {
    reject("Only supported single-fact and integrated two-event batches are currently supported");
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

  if (first.eventType === "CharactersAssigned" && second !== undefined && second.eventType === "PhaseTransitioned") {
    validateIntegratedCharactersAssignedBatch(currentState, first, second);
    return;
  }

  if (
    first.eventType === "FirstNightInitialized" &&
    second !== undefined &&
    second.eventType === "InitialPrivateKnowledgeEstablished"
  ) {
    validateIntegratedFirstNightInitializationBatch(currentState, first, second);
    return;
  }

  reject("Integrated two-event batch must contain a supported fact event followed by its paired domain event");
};
