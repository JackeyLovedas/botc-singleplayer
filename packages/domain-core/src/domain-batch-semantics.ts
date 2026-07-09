import { DomainError } from "./errors.js";
import type { AnyDomainEventEnvelope, DomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";
import { isIntegratedTransitionReason } from "./phase-transition-policy.js";
import { firstNightTaskTypeForPhilosopherChoice } from "./philosopher-ability.js";
import { evaluateSnakeCharmerEffectiveness } from "./snake-charmer.js";
import type { SnakeCharmerEffectivenessResult } from "./snake-charmer.js";

type IneffectiveSnakeCharmerEffectiveness = Extract<SnakeCharmerEffectivenessResult, { readonly effective: false }>;

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
        event.payload.sourceKind !== "PHILOSOPHER_CHOSEN_DUPLICATE" ||
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

const assertSnakeCharmerSourceEffective = (
  currentState: GameState,
  targetChosen: DomainEventEnvelope<"SnakeCharmerTargetChosen">
): void => {
  const effectiveness = evaluateSnakeCharmerEffectiveness({
    sourcePlayerId: targetChosen.payload.sourcePlayerId,
    abilityImpairments: currentState.abilityImpairments
  });

  if (!effectiveness.effective) {
    reject("Snake Charmer mechanical resolution requires an effective source");
  }
};

const validateIntegratedSnakeCharmerNoSwapBatch = (
  currentState: GameState | undefined,
  events: readonly AnyDomainEventEnvelope[]
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "Snake Charmer no-swap batch requires an existing current state");
  }

  const state = currentState;
  if (
    state.phase !== "FIRST_NIGHT" ||
    state.nightNumber !== 1 ||
    state.dayNumber !== 0 ||
    state.firstNightTaskPlan === undefined ||
    state.currentCharacterState === undefined
  ) {
    reject("Snake Charmer no-swap batch requires FIRST_NIGHT night 1 with task plan and current character state");
  }

  if (events.length !== 3) {
    reject("Snake Charmer no-swap batch must contain exactly three events");
  }

  assertSharedBatchMetadataForAll(events);

  const [first, second, third] = events;
  if (
    first === undefined ||
    second === undefined ||
    third === undefined ||
    first.eventType !== "SnakeCharmerTargetChosen" ||
    second.eventType !== "SnakeCharmerNoSwapResolved" ||
    third.eventType !== "ScheduledTaskSettled"
  ) {
    reject("Snake Charmer no-swap batch must be TargetChosen, NoSwapResolved, ScheduledTaskSettled");
  }

  const targetChosen = first as DomainEventEnvelope<"SnakeCharmerTargetChosen">;
  const noSwap = second as DomainEventEnvelope<"SnakeCharmerNoSwapResolved">;
  const settlement = third as DomainEventEnvelope<"ScheduledTaskSettled">;
  assertSnakeCharmerSourceEffective(state, targetChosen);

  if (
    noSwap.payload.taskId !== targetChosen.payload.taskId ||
    noSwap.payload.taskType !== targetChosen.payload.taskType ||
    noSwap.payload.opportunityId !== targetChosen.payload.opportunityId ||
    noSwap.payload.sourcePlayerId !== targetChosen.payload.sourcePlayerId ||
    noSwap.payload.sourceSeatNumber !== targetChosen.payload.sourceSeatNumber ||
    noSwap.payload.sourceCharacterStateRevision !== targetChosen.payload.sourceCharacterStateRevision ||
    noSwap.payload.targetPlayerId !== targetChosen.payload.targetPlayerId ||
    noSwap.payload.targetSeatNumber !== targetChosen.payload.targetSeatNumber ||
    noSwap.payload.outcomeType !== "NON_DEMON_TARGET_NO_SWAP"
  ) {
    reject("SnakeCharmerNoSwapResolved must match the preceding target choice");
  }

  if (
    settlement.payload.taskId !== noSwap.payload.taskId ||
    settlement.payload.taskType !== noSwap.payload.taskType ||
    settlement.payload.characterStateRevision !== noSwap.payload.sourceCharacterStateRevision ||
    settlement.payload.outcomeType !== "SNAKE_CHARMER_NON_DEMON_NO_SWAP"
  ) {
    reject("ScheduledTaskSettled must match the Snake Charmer no-swap resolution");
  }
};

const validateIntegratedSnakeCharmerIneffectiveBatch = (
  currentState: GameState | undefined,
  events: readonly AnyDomainEventEnvelope[]
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "Snake Charmer ineffective batch requires an existing current state");
  }

  const state = currentState;
  if (
    state.phase !== "FIRST_NIGHT" ||
    state.nightNumber !== 1 ||
    state.dayNumber !== 0 ||
    state.firstNightTaskPlan === undefined ||
    state.currentCharacterState === undefined
  ) {
    reject("Snake Charmer ineffective batch requires FIRST_NIGHT night 1 with task plan and current character state");
  }

  if (events.length !== 3) {
    reject("Snake Charmer ineffective batch must contain exactly three events");
  }

  assertSharedBatchMetadataForAll(events);

  const [first, second, third] = events;
  if (
    first === undefined ||
    second === undefined ||
    third === undefined ||
    first.eventType !== "SnakeCharmerTargetChosen" ||
    second.eventType !== "SnakeCharmerIneffectiveResolved" ||
    third.eventType !== "ScheduledTaskSettled"
  ) {
    reject("Snake Charmer ineffective batch must be TargetChosen, IneffectiveResolved, ScheduledTaskSettled");
  }

  const targetChosen = first as DomainEventEnvelope<"SnakeCharmerTargetChosen">;
  const ineffective = second as DomainEventEnvelope<"SnakeCharmerIneffectiveResolved">;
  const settlement = third as DomainEventEnvelope<"ScheduledTaskSettled">;
  const effectiveness = evaluateSnakeCharmerEffectiveness({
    sourcePlayerId: targetChosen.payload.sourcePlayerId,
    abilityImpairments: state.abilityImpairments
  });
  if (effectiveness.effective === true) {
    reject("Snake Charmer ineffective batch requires an impaired source");
  }
  const ineffectiveResult = effectiveness as IneffectiveSnakeCharmerEffectiveness;

  if (
    ineffective.payload.taskId !== targetChosen.payload.taskId ||
    ineffective.payload.taskType !== targetChosen.payload.taskType ||
    ineffective.payload.opportunityId !== targetChosen.payload.opportunityId ||
    ineffective.payload.sourcePlayerId !== targetChosen.payload.sourcePlayerId ||
    ineffective.payload.sourceSeatNumber !== targetChosen.payload.sourceSeatNumber ||
    ineffective.payload.sourceCharacterStateRevision !== targetChosen.payload.sourceCharacterStateRevision ||
    ineffective.payload.targetPlayerId !== targetChosen.payload.targetPlayerId ||
    ineffective.payload.targetSeatNumber !== targetChosen.payload.targetSeatNumber ||
    ineffective.payload.outcomeType !== "SOURCE_IMPAIRED_NO_EFFECT" ||
    ineffective.payload.reason !== ineffectiveResult.reason ||
    ineffective.payload.sourceImpairmentId !== ineffectiveResult.impairmentId ||
    ineffective.payload.sourceImpairmentKind !== ineffectiveResult.impairmentKind
  ) {
    reject("SnakeCharmerIneffectiveResolved must match the preceding target choice and active source impairment");
  }

  if (
    settlement.payload.taskId !== ineffective.payload.taskId ||
    settlement.payload.taskType !== ineffective.payload.taskType ||
    settlement.payload.characterStateRevision !== ineffective.payload.sourceCharacterStateRevision ||
    settlement.payload.outcomeType !== "SNAKE_CHARMER_INEFFECTIVE"
  ) {
    reject("ScheduledTaskSettled must match the Snake Charmer ineffective resolution");
  }
};

const sameCurrentStateEntryPayload = (
  left: DomainEventEnvelope<"SnakeCharmerDemonSwapApplied">["payload"]["sourceBefore"],
  right: DomainEventEnvelope<"SnakeCharmerDemonSwapApplied">["payload"]["sourceBefore"]
): boolean =>
  left.playerId === right.playerId &&
  left.seatNumber === right.seatNumber &&
  left.currentAlignment === right.currentAlignment &&
  sameRoleSnapshot(left.role, right.role);

const validateIntegratedSnakeCharmerDemonHitBatch = (
  currentState: GameState | undefined,
  events: readonly AnyDomainEventEnvelope[]
): void => {
  if (currentState === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "Snake Charmer Demon-hit batch requires an existing current state");
  }

  const state = currentState;
  if (
    state.phase !== "FIRST_NIGHT" ||
    state.nightNumber !== 1 ||
    state.dayNumber !== 0 ||
    state.firstNightTaskPlan === undefined
  ) {
    reject("Snake Charmer Demon-hit batch requires FIRST_NIGHT night 1 with task plan and current character state");
  }

  if (state.currentCharacterState === undefined) {
    throw new DomainError(
      "InvalidDomainBatchSemantics",
      "Snake Charmer Demon-hit batch requires FIRST_NIGHT night 1 with task plan and current character state"
    );
  }
  const currentCharacterState = state.currentCharacterState;

  if (events.length !== 4) {
    reject("Snake Charmer Demon-hit batch must contain exactly four events");
  }

  assertSharedBatchMetadataForAll(events);

  const [first, second, third, fourth] = events;
  if (
    first === undefined ||
    second === undefined ||
    third === undefined ||
    fourth === undefined ||
    first.eventType !== "SnakeCharmerTargetChosen" ||
    second.eventType !== "SnakeCharmerDemonSwapApplied" ||
    third.eventType !== "AbilityImpairmentApplied" ||
    fourth.eventType !== "ScheduledTaskSettled"
  ) {
    reject("Snake Charmer Demon-hit batch must be TargetChosen, DemonSwapApplied, AbilityImpairmentApplied, ScheduledTaskSettled");
  }

  const targetChosen = first as DomainEventEnvelope<"SnakeCharmerTargetChosen">;
  const swap = second as DomainEventEnvelope<"SnakeCharmerDemonSwapApplied">;
  const poison = third as DomainEventEnvelope<"AbilityImpairmentApplied">;
  const settlement = fourth as DomainEventEnvelope<"ScheduledTaskSettled">;
  assertSnakeCharmerSourceEffective(state, targetChosen);

  const targetChoice = targetChosen.payload;
  const swapPayload = swap.payload;
  const sourceBefore = currentCharacterState.entries.find((entry) =>
    entry.playerId === targetChoice.sourcePlayerId &&
    entry.seatNumber === targetChoice.sourceSeatNumber
  );
  const targetBefore = currentCharacterState.entries.find((entry) =>
    entry.playerId === targetChoice.targetPlayerId &&
    entry.seatNumber === targetChoice.targetSeatNumber
  );

  if (sourceBefore === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "Snake Charmer Demon-hit batch target must be the current Demon");
  }

  if (targetBefore === undefined) {
    throw new DomainError("InvalidDomainBatchSemantics", "Snake Charmer Demon-hit batch target must be the current Demon");
  }

  const sourceEntry = sourceBefore;
  const targetEntry = targetBefore;

  if (targetEntry.role.characterType !== "DEMON") {
    reject("Snake Charmer Demon-hit batch target must be the current Demon");
  }

  if (
    swapPayload.taskId !== targetChoice.taskId ||
    swapPayload.taskType !== targetChoice.taskType ||
    swapPayload.opportunityId !== targetChoice.opportunityId ||
    swapPayload.sourcePlayerId !== targetChoice.sourcePlayerId ||
    swapPayload.sourceSeatNumber !== targetChoice.sourceSeatNumber ||
    swapPayload.targetPlayerId !== targetChoice.targetPlayerId ||
    swapPayload.targetSeatNumber !== targetChoice.targetSeatNumber ||
    swapPayload.previousCharacterStateRevision !== targetChoice.sourceCharacterStateRevision ||
    swapPayload.previousCharacterStateRevision !== currentCharacterState.revision ||
    swapPayload.nextCharacterStateRevision !== swapPayload.previousCharacterStateRevision + 1 ||
    swapPayload.swapReason !== "SNAKE_CHARMER_DEMON_HIT" ||
    !sameCurrentStateEntryPayload(swapPayload.sourceBefore, sourceEntry) ||
    !sameCurrentStateEntryPayload(swapPayload.targetBefore, targetEntry) ||
    swapPayload.sourceAfter.playerId !== sourceEntry.playerId ||
    swapPayload.sourceAfter.seatNumber !== sourceEntry.seatNumber ||
    !sameRoleSnapshot(swapPayload.sourceAfter.role, targetEntry.role) ||
    swapPayload.sourceAfter.currentAlignment !== targetEntry.currentAlignment ||
    swapPayload.targetAfter.playerId !== targetEntry.playerId ||
    swapPayload.targetAfter.seatNumber !== targetEntry.seatNumber ||
    !sameRoleSnapshot(swapPayload.targetAfter.role, sourceEntry.role) ||
    swapPayload.targetAfter.currentAlignment !== sourceEntry.currentAlignment
  ) {
    reject("SnakeCharmerDemonSwapApplied must match the preceding target choice and current Demon swap");
  }

  if (
    poison.payload.kind !== "POISONED" ||
    poison.payload.sourceKind !== "SNAKE_CHARMER_DEMON_HIT" ||
    poison.payload.sourcePlayerId !== swapPayload.sourcePlayerId ||
    poison.payload.affectedPlayerId !== swapPayload.targetPlayerId ||
    poison.payload.affectedSeatNumber !== swapPayload.targetSeatNumber ||
    !sameRoleSnapshot(poison.payload.affectedRole, swapPayload.targetAfter.role) ||
    poison.payload.sourceCharacterStateRevision !== swapPayload.nextCharacterStateRevision
  ) {
    reject("AbilityImpairmentApplied must poison the old Demon after Snake Charmer swap");
  }

  if (
    settlement.payload.taskId !== swapPayload.taskId ||
    settlement.payload.taskType !== swapPayload.taskType ||
    settlement.payload.characterStateRevision !== swapPayload.nextCharacterStateRevision ||
    settlement.payload.outcomeType !== "SNAKE_CHARMER_DEMON_HIT_SWAP"
  ) {
    reject("ScheduledTaskSettled must match the Snake Charmer Demon-hit swap");
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

  if (first.eventType === "SnakeCharmerTargetChosen") {
    if (second?.eventType === "SnakeCharmerNoSwapResolved") {
      validateIntegratedSnakeCharmerNoSwapBatch(currentState, batchEvents);
      return;
    }

    if (second?.eventType === "SnakeCharmerDemonSwapApplied") {
      validateIntegratedSnakeCharmerDemonHitBatch(currentState, batchEvents);
      return;
    }

    if (second?.eventType === "SnakeCharmerIneffectiveResolved") {
      validateIntegratedSnakeCharmerIneffectiveBatch(currentState, batchEvents);
      return;
    }

    reject("Snake Charmer batch must continue with NoSwapResolved, DemonSwapApplied, or IneffectiveResolved");
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
