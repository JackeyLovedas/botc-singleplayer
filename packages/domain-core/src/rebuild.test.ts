import { describe, expect, it } from "vitest";
import {
  applyDomainEvent,
  DomainError,
  DEMON_INFORMATION_KNOWLEDGE_STAGE,
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  MINION_INFORMATION_KNOWLEDGE_STAGE,
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION,
  CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION,
  SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_ROLE_CATALOG_SIGNATURE,
  SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM,
  SUPPORTED_ROSTER_VERSION,
  actionOpportunityId,
  batchId,
  calculateRoleCatalogSignature,
  compareRoleSetupSnapshot,
  commandId,
  compareStableId,
  createAbilityImpairmentAppliedPayload,
  createFirstNightTaskInsertedPayload,
  createFirstNightTaskInsertedV2Payload,
  createFirstNightRoleActionOpportunity,
  createLegacySeamstressFirstNightActionOpportunity,
  createPhilosopherAbilityChosenPayload,
  createPhilosopherAbilityChosenScheduledTaskSettlement,
  createPhilosopherAbilityGrantedPayload,
  createSnakeCharmerDemonHitScheduledTaskSettlement,
  createSnakeCharmerDemonSwapAppliedPayload,
  createEvilTwinInformationDeliveredPayload,
  createEvilTwinPairEstablishedPayload,
  createEvilTwinPairEstablishedScheduledTaskSettlement,
  createSnakeCharmerIneffectiveResolvedPayload,
  createSnakeCharmerIneffectiveScheduledTaskSettlement,
  createSnakeCharmerNoSwapResolvedPayload,
  createSnakeCharmerNoSwapScheduledTaskSettlement,
  createSnakeCharmerPoisonedImpairmentPayload,
  createSnakeCharmerTargetChosenPayload,
  createWitchDeathPendingMarkedPayload,
  createWitchDeathPendingScheduledTaskSettlement,
  createWitchIneffectiveResolvedPayload,
  createWitchIneffectiveScheduledTaskSettlement,
  createWitchTargetChosenPayload,
  createDreamerInformationDeliveredPayload,
  createDreamerInformationDeliveredScheduledTaskSettlement,
  createDreamerTargetChosenPayload,
  createSeamstressDeferredScheduledTaskSettlement,
  evaluateDreamerEffectiveness,
  evaluateSnakeCharmerEffectiveness,
  evaluateWitchEffectiveness,
  getNextUnsettledFirstNightTask,
  cloneCurrentCharacterStateSet,
  abilityImpairmentId,
  eventId,
  formatRoleTenureTransitionFactId,
  expectedDemonInformationEntries,
  expectedMinionInformationEntries,
  firstNightTaskTypeForPhilosopherChoice,
  applyDomainEventBatch,
  playerId,
  resolveCurrentEvilTeam,
  roleId,
  scheduledTaskId,
  seatNumber,
  scheduledTaskFromFirstNightTaskInsertedPayload,
  rebuildGameState,
  validateFirstNightTaskPlanCreatedPayload,
  validateFirstNightTaskPlanRuntimeState,
  validateFirstNightTaskProgress,
  validateInitialCurrentCharacterStateSet,
  validateDomainEventStream
} from "@botc/domain-core";
import {
  deriveFirstNightAbilityOutcomeFact,
  validateFirstNightAbilityOutcomeFactShape
} from "./first-night-ability-outcome-ledger.js";
import { assertRebuiltCanonicalRoleTenureState } from "./role-tenure-replay.js";
import type {
  AnyDomainEventEnvelope,
  AbilityImpairmentSet,
  CharactersAssignedPayload,
  DomainErrorCode,
  DomainEventEnvelope,
  FirstNightInitializedPayload,
  FirstNightTaskPlanCreatedPayload,
  GameState,
  InitialPrivateKnowledgeEstablishedPayload,
  RoleCatalogSnapshot,
  RoleId,
  RoleSetupSnapshot,
  SetupGeneratedPayload
} from "@botc/domain-core";
import {
  auditEvent,
  charactersAssignedEvent,
  charactersAssignedPhaseTransitionedEvent,
  firstNightInitializedEvent,
  firstNightTaskPlanCreatedEvent,
  gameCreatedEvent,
  infrastructureEvent,
  initialPrivateKnowledgeEstablishedEvent,
  otherGameId,
  phaseTransitionedEvent,
  playerRosterCreatedEvent,
  scriptSelectedEvent,
  setupGeneratedEvent,
  setupPhaseTransitionedEvent,
  testAssignmentGenerator,
  testFirstNightTaskCatalog,
  testFirstNightTaskPlanner,
  testInitialPrivateKnowledgeBuilder,
  testSetupGenerator
} from "@botc/test-harness";

type FirstNightPayload = ReturnType<typeof firstNightInitializedEvent>["payload"];
type InitialKnowledgePayload = ReturnType<typeof initialPrivateKnowledgeEstablishedEvent>["payload"];
type FirstNightTaskPlanPayload = ReturnType<typeof firstNightTaskPlanCreatedEvent>["payload"];

const captureDomainError = (action: () => void, code: DomainErrorCode): DomainError => {
  let caught: unknown;
  try {
    action();
  } catch (error) {
    caught = error;
  }

  expect(caught).toBeInstanceOf(DomainError);
  expect((caught as DomainError).code).toBe(code);
  return caught as DomainError;
};

const expectDomainCode = (action: () => void, code: DomainErrorCode): void => {
  void captureDomainError(action, code);
};

const setupEventStream = (setupEvent = setupGeneratedEvent()): readonly AnyDomainEventEnvelope[] => [
  gameCreatedEvent(),
  scriptSelectedEvent(),
  phaseTransitionedEvent(),
  setupEvent,
  setupPhaseTransitionedEvent()
];

const rosterEventStream = (rosterEvent = playerRosterCreatedEvent()): readonly AnyDomainEventEnvelope[] => [
  ...setupEventStream(),
  rosterEvent
];

const assignmentEventStream = (
  assignmentEvent = charactersAssignedEvent(),
  transitionEvent = charactersAssignedPhaseTransitionedEvent()
): readonly AnyDomainEventEnvelope[] => [
  ...rosterEventStream(),
  assignmentEvent,
  transitionEvent
];

const firstNightEventStream = (
  firstNightEvent = firstNightInitializedEvent(),
  knowledgeEvent = initialPrivateKnowledgeEstablishedEvent()
): readonly AnyDomainEventEnvelope[] => [
  ...assignmentEventStream(),
  firstNightEvent,
  knowledgeEvent
];

const firstNightTaskPlanEventStream = (
  taskPlanEvent = firstNightTaskPlanCreatedEvent()
): readonly AnyDomainEventEnvelope[] => [
  ...firstNightEventStream(),
  taskPlanEvent
];

const noPhilosopherExactRoleIds = [
  "dreamer",
  "snake_charmer",
  "mathematician",
  "flowergirl",
  "town_crier",
  "seamstress",
  "mutant",
  "sweetheart",
  "barber",
  "evil_twin",
  "witch",
  "fang_gu"
].map(roleId);

const noPhilosopherSetupGeneratedEvent = (): DomainEventEnvelope<"SetupGenerated"> =>
  setupGeneratedEvent({ payload: generatedPayloadFor({ exactRoleIds: noPhilosopherExactRoleIds }) });

const noPhilosopherCharactersAssignedPayload = (): CharactersAssignedPayload => {
  const setup = noPhilosopherSetupGeneratedEvent().payload;
  const roster = playerRosterCreatedEvent().payload;
  const result = testAssignmentGenerator.generate({
    rootSeed: gameCreatedEvent().payload.rootSeed,
    rosterVersion: roster.rosterVersion,
    roster: roster.entries,
    actualRoles: setup.actualRoles,
    roleCatalogSignature: setup.roleCatalogSignature
  });
  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...result.assignment
  };
};

const noPhilosopherCharactersAssignedEvent = (): DomainEventEnvelope<"CharactersAssigned"> =>
  charactersAssignedEvent({ payload: noPhilosopherCharactersAssignedPayload() });

const noPhilosopherFirstNightPayload = (): FirstNightInitializedPayload => ({
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  initializationVersion: SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  nightNumber: 1,
  rosterVersion: SUPPORTED_ROSTER_VERSION,
  assignmentAlgorithmVersion: noPhilosopherCharactersAssignedEvent().payload.assignmentAlgorithmVersion,
  roleCatalogSignature: noPhilosopherSetupGeneratedEvent().payload.roleCatalogSignature
});

const noPhilosopherFirstNightInitializedEvent = (): DomainEventEnvelope<"FirstNightInitialized"> =>
  firstNightInitializedEvent({ payload: noPhilosopherFirstNightPayload() });

const noPhilosopherInitialKnowledgePayload = (): InitialPrivateKnowledgeEstablishedPayload => {
  const setup = noPhilosopherSetupGeneratedEvent().payload;
  const assignment = noPhilosopherCharactersAssignedEvent().payload;
  const result = testInitialPrivateKnowledgeBuilder.generate({
    roster: playerRosterCreatedEvent().payload.entries,
    assignment: assignment.assignments,
    setup
  });
  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    knowledgeModelVersion: SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
    knowledgeStage: INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
    rosterVersion: SUPPORTED_ROSTER_VERSION,
    assignmentAlgorithmVersion: assignment.assignmentAlgorithmVersion,
    roleCatalogSignature: setup.roleCatalogSignature,
    entries: result.knowledge.entries
  };
};

const noPhilosopherInitialPrivateKnowledgeEstablishedEvent = (): DomainEventEnvelope<"InitialPrivateKnowledgeEstablished"> =>
  initialPrivateKnowledgeEstablishedEvent({ payload: noPhilosopherInitialKnowledgePayload() });

const noPhilosopherTaskPlanPayload = (): FirstNightTaskPlanCreatedPayload => {
  const setup = noPhilosopherSetupGeneratedEvent().payload;
  const assignment = noPhilosopherCharactersAssignedEvent().payload;
  const firstNight = noPhilosopherFirstNightInitializedEvent().payload;
  const initialPrivateKnowledge = noPhilosopherInitialPrivateKnowledgeEstablishedEvent().payload;
  const result = testFirstNightTaskPlanner.generate({
    nightNumber: 1,
    setup,
    roster: playerRosterCreatedEvent().payload.entries,
    assignment: assignment.assignments,
    firstNight,
    initialPrivateKnowledge,
    taskCatalogSnapshot: testFirstNightTaskCatalog
  });
  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    nightNumber: 1,
    taskPlanVersion: SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION,
    taskCatalogVersion: result.taskPlan.taskCatalogVersion,
    taskCatalogSignatureAlgorithm: result.taskPlan.taskCatalogSignatureAlgorithm,
    taskCatalogSignature: result.taskPlan.taskCatalogSignature,
    taskCatalogSnapshot: result.taskPlan.taskCatalogSnapshot,
    rosterVersion: result.taskPlan.rosterVersion,
    assignmentAlgorithmVersion: result.taskPlan.assignmentAlgorithmVersion,
    roleCatalogSignature: result.taskPlan.roleCatalogSignature,
    knowledgeModelVersion: result.taskPlan.knowledgeModelVersion,
    knowledgeStage: result.taskPlan.knowledgeStage,
    tasks: result.taskPlan.tasks
  };
};

const noPhilosopherFirstNightTaskPlanCreatedEvent = (): DomainEventEnvelope<"FirstNightTaskPlanCreated"> =>
  firstNightTaskPlanCreatedEvent({ payload: noPhilosopherTaskPlanPayload() });

const noPhilosopherTaskPlanEventStream = (): readonly AnyDomainEventEnvelope[] => [
  gameCreatedEvent(),
  scriptSelectedEvent(),
  phaseTransitionedEvent(),
  noPhilosopherSetupGeneratedEvent(),
  setupPhaseTransitionedEvent(),
  playerRosterCreatedEvent(),
  noPhilosopherCharactersAssignedEvent(),
  charactersAssignedPhaseTransitionedEvent(),
  noPhilosopherFirstNightInitializedEvent(),
  noPhilosopherInitialPrivateKnowledgeEstablishedEvent(),
  noPhilosopherFirstNightTaskPlanCreatedEvent()
];

const minionInformationDeliveredEvent = (
  overrides: Partial<DomainEventEnvelope<"MinionInformationDelivered">> = {}
): DomainEventEnvelope<"MinionInformationDelivered"> => {
  const state = rebuildGameState(noPhilosopherTaskPlanEventStream());
  if (state.currentCharacterState === undefined || state.roster === undefined || state.setup === undefined) {
    throw new Error("Expected first-night system information source facts");
  }
  const team = resolveCurrentEvilTeam({
    currentCharacterState: state.currentCharacterState,
    roster: state.roster.entries
  });
  if (team.status === "failure") {
    throw new Error(team.message);
  }

  return {
    category: "domain",
    eventId: eventId("event-12"),
    gameId: gameCreatedEvent().gameId,
    eventSequence: 12,
    batchId: batchId("batch-8"),
    gameVersion: 8,
    eventType: "MinionInformationDelivered",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-8"),
    createdAt: "2026-07-07T00:00:07.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      nightNumber: 1,
      taskId: scheduledTaskId("first-night-v1:MINION_INFO:system"),
      taskType: "MINION_INFO",
      knowledgeModelVersion: SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
      knowledgeStage: MINION_INFORMATION_KNOWLEDGE_STAGE,
      characterStateRevision: team.team.characterStateRevision,
      resolvedEvilTeam: team.team,
      rosterVersion: state.roster.rosterVersion,
      roleCatalogSignature: state.setup.roleCatalogSignature,
      entries: expectedMinionInformationEntries(team.team.demon, team.team.minions)
    },
    ...overrides
  };
};

const minionTaskSettledEvent = (
  overrides: Partial<DomainEventEnvelope<"ScheduledTaskSettled">> = {}
): DomainEventEnvelope<"ScheduledTaskSettled"> => ({
  category: "domain",
  eventId: eventId("event-13"),
  gameId: gameCreatedEvent().gameId,
  eventSequence: 13,
  batchId: batchId("batch-8"),
  gameVersion: 8,
  eventType: "ScheduledTaskSettled",
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: commandId("command-8"),
  createdAt: "2026-07-07T00:00:07.000Z",
  correlationId: gameCreatedEvent().correlationId,
  causationId: gameCreatedEvent().causationId,
  payload: {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    nightNumber: 1,
    taskId: scheduledTaskId("first-night-v1:MINION_INFO:system"),
    taskType: "MINION_INFO",
    settlementVersion: "scheduled-task-settlement-v1",
    outcomeType: "MINION_INFORMATION_DELIVERED",
    characterStateRevision: 1
  },
  ...overrides
});

const demonInformationDeliveredEvent = (
  overrides: Partial<DomainEventEnvelope<"DemonInformationDelivered">> = {}
): DomainEventEnvelope<"DemonInformationDelivered"> => {
  const state = rebuildGameState([
    ...noPhilosopherTaskPlanEventStream(),
    minionInformationDeliveredEvent(),
    minionTaskSettledEvent()
  ]);
  if (state.currentCharacterState === undefined || state.roster === undefined || state.setup === undefined) {
    throw new Error("Expected first-night system information source facts");
  }
  const team = resolveCurrentEvilTeam({
    currentCharacterState: state.currentCharacterState,
    roster: state.roster.entries
  });
  if (team.status === "failure") {
    throw new Error(team.message);
  }

  return {
    category: "domain",
    eventId: eventId("event-14"),
    gameId: gameCreatedEvent().gameId,
    eventSequence: 14,
    batchId: batchId("batch-9"),
    gameVersion: 9,
    eventType: "DemonInformationDelivered",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-9"),
    createdAt: "2026-07-07T00:00:08.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      nightNumber: 1,
      taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system"),
      taskType: "DEMON_INFO",
      knowledgeModelVersion: SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
      knowledgeStage: DEMON_INFORMATION_KNOWLEDGE_STAGE,
      characterStateRevision: team.team.characterStateRevision,
      resolvedEvilTeam: team.team,
      rosterVersion: state.roster.rosterVersion,
      roleCatalogSignature: state.setup.roleCatalogSignature,
      entries: expectedDemonInformationEntries(team.team.demon, team.team.minions, state.setup.demonBluffs)
    },
    ...overrides
  };
};

const demonTaskSettledEvent = (
  overrides: Partial<DomainEventEnvelope<"ScheduledTaskSettled">> = {}
): DomainEventEnvelope<"ScheduledTaskSettled"> => ({
  category: "domain",
  eventId: eventId("event-15"),
  gameId: gameCreatedEvent().gameId,
  eventSequence: 15,
  batchId: batchId("batch-9"),
  gameVersion: 9,
  eventType: "ScheduledTaskSettled",
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: commandId("command-9"),
  createdAt: "2026-07-07T00:00:08.000Z",
  correlationId: gameCreatedEvent().correlationId,
  causationId: gameCreatedEvent().causationId,
  payload: {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    nightNumber: 1,
    taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system"),
    taskType: "DEMON_INFO",
    settlementVersion: "scheduled-task-settlement-v1",
    outcomeType: "DEMON_INFORMATION_DELIVERED",
    characterStateRevision: 1
  },
  ...overrides
});

const philosopherActionOpportunityCreatedEvent = (
  overrides: Partial<DomainEventEnvelope<"FirstNightActionOpportunityCreated">> = {}
): DomainEventEnvelope<"FirstNightActionOpportunityCreated"> => {
  const state = rebuildGameState(firstNightTaskPlanEventStream());
  const task = state.firstNightTaskPlan?.tasks.find((candidate) => candidate.taskType === "PHILOSOPHER_ACTION");
  const source = task?.source;
  if (task === undefined || source === undefined || source.kind !== "ROLE" || state.currentCharacterState === undefined) {
    throw new Error("Expected Philosopher task source facts");
  }

  const currentEntry = state.currentCharacterState.entries.find((entry) => entry.playerId === source.playerId);
  if (currentEntry === undefined) {
    throw new Error("Expected current Philosopher state entry");
  }

  return {
    category: "domain",
    eventId: eventId("event-12"),
    gameId: gameCreatedEvent().gameId,
    eventSequence: 12,
    batchId: batchId("batch-8"),
    gameVersion: 8,
    eventType: "FirstNightActionOpportunityCreated",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-8"),
    createdAt: "2026-07-07T00:00:07.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      nightNumber: 1,
      opportunityId: actionOpportunityId(`first-night-v1:PHILOSOPHER_ACTION:seat-${String(currentEntry.seatNumber).padStart(2, "0")}:opportunity-01`),
      opportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: task.taskId,
      taskType: "PHILOSOPHER_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: currentEntry.role,
      sourceCharacterStateRevision: state.currentCharacterState.revision,
      visibility: {
        canDefer: true,
        supportedDecisionKinds: ["DEFER", "CHOOSE_GOOD_CHARACTER"],
        futureUnsupportedDecisionKinds: []
      }
    },
    ...overrides
  };
};

const philosopherActionDeferredEvent = (
  overrides: Partial<DomainEventEnvelope<"PhilosopherActionDeferred">> = {}
): DomainEventEnvelope<"PhilosopherActionDeferred"> => {
  const opportunity = philosopherActionOpportunityCreatedEvent().payload;
  return {
    category: "domain",
    eventId: eventId("event-13"),
    gameId: gameCreatedEvent().gameId,
    eventSequence: 13,
    batchId: batchId("batch-9"),
    gameVersion: 9,
    eventType: "PhilosopherActionDeferred",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-9"),
    createdAt: "2026-07-07T00:00:08.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      nightNumber: 1,
      taskId: opportunity.taskId,
      taskType: "PHILOSOPHER_ACTION",
      opportunityId: opportunity.opportunityId,
      decisionKind: "DEFER",
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceSeatNumber: opportunity.sourceSeatNumber,
      sourceRole: opportunity.sourceRole,
      sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision
    },
    ...overrides
  };
};

const philosopherTaskSettledEvent = (
  overrides: Partial<DomainEventEnvelope<"ScheduledTaskSettled">> = {}
): DomainEventEnvelope<"ScheduledTaskSettled"> => {
  const deferred = philosopherActionDeferredEvent().payload;
  return {
    category: "domain",
    eventId: eventId("event-14"),
    gameId: gameCreatedEvent().gameId,
    eventSequence: 14,
    batchId: batchId("batch-9"),
    gameVersion: 9,
    eventType: "ScheduledTaskSettled",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-9"),
    createdAt: "2026-07-07T00:00:08.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      nightNumber: 1,
      taskId: deferred.taskId,
      taskType: "PHILOSOPHER_ACTION",
      settlementVersion: "scheduled-task-settlement-v1",
      outcomeType: "PHILOSOPHER_DEFERRED",
      characterStateRevision: deferred.sourceCharacterStateRevision
    },
    ...overrides
  };
};

const defaultPhilosopherAbilityBatchState = () => rebuildGameState([
  ...firstNightTaskPlanEventStream(),
  philosopherActionOpportunityCreatedEvent()
]);

const roleSnapshotById = (roleIdValue: string): RoleSetupSnapshot => {
  const role = setupGeneratedEvent().payload.roleCatalogSnapshot.roles.find((candidate) => candidate.roleId === roleIdValue);
  if (role === undefined) {
    throw new Error(`Expected ${roleIdValue} in role catalog`);
  }

  return role;
};

const absentNonInsertingGoodRole = (): RoleSetupSnapshot => {
  const setup = setupGeneratedEvent().payload;
  const actualRoleIds = new Set(setup.actualRoles.map((role) => role.roleId));
  const role = setup.roleCatalogSnapshot.roles.find((candidate) =>
    candidate.defaultAlignment === "GOOD" &&
    candidate.characterType !== "MINION" &&
    candidate.characterType !== "DEMON" &&
    !actualRoleIds.has(candidate.roleId) &&
    firstNightTaskTypeForPhilosopherChoice(candidate.roleId) === undefined
  );

  if (role === undefined) {
    throw new Error("Expected an absent non-inserting good role in the Sects & Violets catalog");
  }

  return role;
};

const philosopherAbilityEventEnvelope = <EventType extends AnyDomainEventEnvelope["eventType"]>(
  eventType: EventType,
  payload: DomainEventEnvelope<EventType>["payload"],
  sequence: number
): DomainEventEnvelope<EventType> => ({
  category: "domain",
  eventId: eventId(`event-${sequence}`),
  gameId: gameCreatedEvent().gameId,
  eventSequence: sequence,
  batchId: batchId("batch-9"),
  gameVersion: 9,
  eventType,
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: commandId("command-9"),
  createdAt: "2026-07-07T00:00:08.000Z",
  correlationId: gameCreatedEvent().correlationId,
  causationId: gameCreatedEvent().causationId,
  payload
});

const philosopherAbilityChoiceBatchEvents = (input: {
  readonly chosenRole?: RoleSetupSnapshot;
  readonly includeImpairment?: boolean;
  readonly includeInsertion?: boolean;
} = {}): readonly AnyDomainEventEnvelope[] => {
  const state = defaultPhilosopherAbilityBatchState();
  const opportunity = state.firstNightActionOpportunities?.opportunities[0];
  if (
    opportunity === undefined ||
    state.setup === undefined ||
    state.currentCharacterState === undefined ||
    state.firstNightTaskPlan === undefined
  ) {
    throw new Error("Expected Philosopher opportunity, setup, current state, and task plan");
  }

  const chosenRole = input.chosenRole ?? absentNonInsertingGoodRole();
  const choice = createPhilosopherAbilityChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    opportunityId: opportunity.opportunityId,
    taskId: opportunity.taskId,
    chosenRole,
    setup: state.setup,
    firstNightActionOpportunities: state.firstNightActionOpportunities
  });
  const grant = createPhilosopherAbilityGrantedPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    choice
  });
  const impairment = input.includeImpairment === true
    ? createAbilityImpairmentAppliedPayload({
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      choice,
      currentCharacterState: state.currentCharacterState
    })
    : undefined;
  const insertion = input.includeInsertion === true
    ? createFirstNightTaskInsertedPayload({
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      choice,
      firstNightTaskPlan: state.firstNightTaskPlan
    })
    : undefined;
  const settlement = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...createPhilosopherAbilityChosenScheduledTaskSettlement({
    taskId: choice.taskId,
    characterStateRevision: choice.sourceCharacterStateRevision
    })
  };

  const payloads: readonly [
    DomainEventEnvelope<"PhilosopherAbilityChosen">,
    DomainEventEnvelope<"PhilosopherAbilityGranted">,
    ...AnyDomainEventEnvelope[]
  ] = [
    philosopherAbilityEventEnvelope("PhilosopherAbilityChosen", choice, 13),
    philosopherAbilityEventEnvelope("PhilosopherAbilityGranted", grant, 14)
  ];
  const events = [...payloads];

  if (input.includeImpairment === true) {
    if (impairment === undefined) {
      throw new Error("Expected Philosopher duplicate impairment payload");
    }
    events.push(philosopherAbilityEventEnvelope("AbilityImpairmentApplied", impairment, 13 + events.length));
  }

  if (input.includeInsertion === true) {
    if (insertion === undefined) {
      throw new Error("Expected Philosopher gained first-night task insertion payload");
    }
    events.push(philosopherAbilityEventEnvelope("FirstNightTaskInserted", insertion, 13 + events.length));
  }

  events.push(philosopherAbilityEventEnvelope("ScheduledTaskSettled", settlement, 13 + events.length));
  return events;
};

const gainedSnakeCharmerTaskStream = (): readonly AnyDomainEventEnvelope[] => [
  ...firstNightTaskPlanEventStream(),
  philosopherActionOpportunityCreatedEvent(),
  ...philosopherAbilityChoiceBatchEvents({
    chosenRole: roleSnapshotById("snake_charmer"),
    includeImpairment: true,
    includeInsertion: true
  })
];

const snakeCharmerActionOpportunityCreatedEvent = (
  overrides: Partial<DomainEventEnvelope<"FirstNightActionOpportunityCreated">> = {}
): DomainEventEnvelope<"FirstNightActionOpportunityCreated"> => {
  const state = rebuildGameState(gainedSnakeCharmerTaskStream());
  const task = state.firstNightTaskPlan?.tasks.find((candidate) =>
    candidate.taskId === scheduledTaskId("first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-snake_charmer")
  );
  if (task === undefined || state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined) {
    throw new Error("Expected gained Snake Charmer task state");
  }

  const opportunity = createFirstNightRoleActionOpportunity({
    taskId: task.taskId,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress,
    currentCharacterState: state.currentCharacterState,
    firstNightActionOpportunities: state.firstNightActionOpportunities
  });

  return {
    category: "domain",
    eventId: eventId("event-18"),
    gameId: gameCreatedEvent().gameId,
    eventSequence: 18,
    batchId: batchId("batch-10"),
    gameVersion: 10,
    eventType: "FirstNightActionOpportunityCreated",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-10"),
    createdAt: "2026-07-07T00:00:09.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      ...opportunity
    },
    ...overrides
  };
};

const openSnakeCharmerStream = (): readonly AnyDomainEventEnvelope[] => [
  ...gainedSnakeCharmerTaskStream(),
  snakeCharmerActionOpportunityCreatedEvent()
];

const baseSnakeCharmerTaskStream = (): readonly AnyDomainEventEnvelope[] => [
  ...noPhilosopherTaskPlanEventStream(),
  minionInformationDeliveredEvent(),
  minionTaskSettledEvent(),
  demonInformationDeliveredEvent(),
  demonTaskSettledEvent()
];

const baseSnakeCharmerActionOpportunityCreatedEvent = (
  overrides: Partial<DomainEventEnvelope<"FirstNightActionOpportunityCreated">> = {}
): DomainEventEnvelope<"FirstNightActionOpportunityCreated"> => {
  const state = rebuildGameState(baseSnakeCharmerTaskStream());
  const task = state.firstNightTaskPlan?.tasks.find((candidate) =>
    candidate.taskType === "SNAKE_CHARMER_ACTION" &&
    candidate.source.kind === "ROLE" &&
    candidate.source.role.roleId === "snake_charmer"
  );
  if (task === undefined || state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined) {
    throw new Error("Expected base Snake Charmer task state");
  }

  const opportunity = createFirstNightRoleActionOpportunity({
    taskId: task.taskId,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress,
    currentCharacterState: state.currentCharacterState,
    firstNightActionOpportunities: state.firstNightActionOpportunities
  });

  return {
    category: "domain",
    eventId: eventId("event-16"),
    gameId: gameCreatedEvent().gameId,
    eventSequence: 16,
    batchId: batchId("batch-10"),
    gameVersion: 10,
    eventType: "FirstNightActionOpportunityCreated",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-10"),
    createdAt: "2026-07-07T00:00:09.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      ...opportunity
    },
    ...overrides
  };
};

const openBaseSnakeCharmerStream = (): readonly AnyDomainEventEnvelope[] => [
  ...baseSnakeCharmerTaskStream(),
  baseSnakeCharmerActionOpportunityCreatedEvent()
];

const snakeCharmerBatchEnvelope = <EventType extends AnyDomainEventEnvelope["eventType"]>(
  eventType: EventType,
  payload: DomainEventEnvelope<EventType>["payload"],
  offset: number
): DomainEventEnvelope<EventType> => ({
  category: "domain",
  eventId: eventId(`event-${19 + offset}`),
  gameId: gameCreatedEvent().gameId,
  eventSequence: 19 + offset,
  batchId: batchId("batch-11"),
  gameVersion: 11,
  eventType,
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: commandId("command-11"),
  createdAt: "2026-07-07T00:00:10.000Z",
  correlationId: gameCreatedEvent().correlationId,
  causationId: gameCreatedEvent().causationId,
  payload
});

const baseSnakeCharmerBatchEnvelope = <EventType extends AnyDomainEventEnvelope["eventType"]>(
  eventType: EventType,
  payload: DomainEventEnvelope<EventType>["payload"],
  offset: number
): DomainEventEnvelope<EventType> => ({
  category: "domain",
  eventId: eventId(`event-${17 + offset}`),
  gameId: gameCreatedEvent().gameId,
  eventSequence: 17 + offset,
  batchId: batchId("batch-11"),
  gameVersion: 11,
  eventType,
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: commandId("command-11"),
  createdAt: "2026-07-07T00:00:10.000Z",
  correlationId: gameCreatedEvent().correlationId,
  causationId: gameCreatedEvent().causationId,
  payload
});

const snakeCharmerNoSwapBatchEvents = (input: {
  readonly targetKind?: "non-demon" | "demon";
} = {}): readonly [
  DomainEventEnvelope<"SnakeCharmerTargetChosen">,
  DomainEventEnvelope<"SnakeCharmerNoSwapResolved">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const state = rebuildGameState(openSnakeCharmerStream());
  const opportunity = state.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION"
  );
  const target = state.currentCharacterState?.entries.find((entry) =>
    input.targetKind === "demon"
      ? entry.role.characterType === "DEMON"
      : entry.role.characterType !== "DEMON"
  );
  if (opportunity === undefined || target === undefined || state.roster === undefined) {
    throw new Error("Expected open Snake Charmer opportunity and target");
  }

  const targetChosen = createSnakeCharmerTargetChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId: opportunity.taskId,
    opportunityId: opportunity.opportunityId,
    targetPlayerId: target.playerId,
    firstNightActionOpportunities: state.firstNightActionOpportunities,
    roster: state.roster.entries
  });
  const noSwap = createSnakeCharmerNoSwapResolvedPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    targetChoice: targetChosen
  });
  const settlement = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...createSnakeCharmerNoSwapScheduledTaskSettlement({
      taskId: opportunity.taskId,
      characterStateRevision: opportunity.sourceCharacterStateRevision
    })
  };

  return [
    snakeCharmerBatchEnvelope("SnakeCharmerTargetChosen", targetChosen, 0),
    snakeCharmerBatchEnvelope("SnakeCharmerNoSwapResolved", noSwap, 1),
    snakeCharmerBatchEnvelope("ScheduledTaskSettled", settlement, 2)
  ];
};

const baseSnakeCharmerNoSwapBatchEvents = (): readonly [
  DomainEventEnvelope<"SnakeCharmerTargetChosen">,
  DomainEventEnvelope<"SnakeCharmerNoSwapResolved">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const state = rebuildGameState(openBaseSnakeCharmerStream());
  const opportunity = state.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION" &&
    candidate.taskType === "SNAKE_CHARMER_ACTION"
  );
  const target = state.currentCharacterState?.entries.find((entry) =>
    entry.role.characterType !== "DEMON" &&
    entry.playerId !== opportunity?.sourcePlayerId
  );
  if (opportunity === undefined || target === undefined || state.roster === undefined) {
    throw new Error("Expected open base Snake Charmer opportunity, non-Demon target, and roster");
  }

  const targetChosen = createSnakeCharmerTargetChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId: opportunity.taskId,
    opportunityId: opportunity.opportunityId,
    targetPlayerId: target.playerId,
    firstNightActionOpportunities: state.firstNightActionOpportunities,
    roster: state.roster.entries
  });
  const noSwap = createSnakeCharmerNoSwapResolvedPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    targetChoice: targetChosen
  });
  const settlement = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...createSnakeCharmerNoSwapScheduledTaskSettlement({
      taskId: opportunity.taskId,
      characterStateRevision: opportunity.sourceCharacterStateRevision
    })
  };

  return [
    baseSnakeCharmerBatchEnvelope("SnakeCharmerTargetChosen", targetChosen, 0),
    baseSnakeCharmerBatchEnvelope("SnakeCharmerNoSwapResolved", noSwap, 1),
    baseSnakeCharmerBatchEnvelope("ScheduledTaskSettled", settlement, 2)
  ];
};

const evilTwinReadyStream = (): readonly AnyDomainEventEnvelope[] => [
  ...openBaseSnakeCharmerStream(),
  ...baseSnakeCharmerNoSwapBatchEvents()
];

const evilTwinBatchEnvelope = <EventType extends AnyDomainEventEnvelope["eventType"]>(
  eventType: EventType,
  payload: DomainEventEnvelope<EventType>["payload"],
  offset: number
): DomainEventEnvelope<EventType> => ({
  category: "domain",
  eventId: eventId(`event-${20 + offset}`),
  gameId: gameCreatedEvent().gameId,
  eventSequence: 20 + offset,
  batchId: batchId("batch-12"),
  gameVersion: 12,
  eventType,
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: commandId("command-12"),
  createdAt: "2026-07-07T00:00:11.000Z",
  correlationId: gameCreatedEvent().correlationId,
  causationId: gameCreatedEvent().causationId,
  payload
});

const evilTwinSetupBatchEvents = (): readonly [
  DomainEventEnvelope<"EvilTwinPairEstablished">,
  DomainEventEnvelope<"EvilTwinInformationDelivered">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const state = rebuildGameState(evilTwinReadyStream());
  const task = getNextUnsettledFirstNightTask(state.firstNightTaskPlan ?? { tasks: [] }, state.firstNightTaskProgress);
  if (task === undefined || task.taskType !== "EVIL_TWIN_SETUP" || state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined) {
    throw new Error("Expected next Evil Twin setup task");
  }

  const pair = createEvilTwinPairEstablishedPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId: task.taskId,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress,
    currentCharacterState: state.currentCharacterState
  });
  const information = createEvilTwinInformationDeliveredPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    pair
  });
  const settlement = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...createEvilTwinPairEstablishedScheduledTaskSettlement({
      taskId: pair.taskId,
      characterStateRevision: pair.characterStateRevision
    })
  };

  return [
    evilTwinBatchEnvelope("EvilTwinPairEstablished", pair, 0),
    evilTwinBatchEnvelope("EvilTwinInformationDelivered", information, 1),
    evilTwinBatchEnvelope("ScheduledTaskSettled", settlement, 2)
  ];
};

const witchReadyStream = (): readonly AnyDomainEventEnvelope[] => [
  ...evilTwinReadyStream(),
  ...evilTwinSetupBatchEvents()
];

const witchActionOpportunityCreatedEvent = (
  overrides: Partial<DomainEventEnvelope<"FirstNightActionOpportunityCreated">> = {}
): DomainEventEnvelope<"FirstNightActionOpportunityCreated"> => {
  const state = rebuildGameState(witchReadyStream());
  const task = getNextUnsettledFirstNightTask(state.firstNightTaskPlan ?? { tasks: [] }, state.firstNightTaskProgress);
  if (task === undefined || task.taskType !== "WITCH_ACTION" || state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined) {
    throw new Error("Expected next Witch action task");
  }

  const opportunity = createFirstNightRoleActionOpportunity({
    taskId: task.taskId,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress,
    currentCharacterState: state.currentCharacterState,
    firstNightActionOpportunities: state.firstNightActionOpportunities
  });

  return {
    category: "domain",
    eventId: eventId("event-23"),
    gameId: gameCreatedEvent().gameId,
    eventSequence: 23,
    batchId: batchId("batch-13"),
    gameVersion: 13,
    eventType: "FirstNightActionOpportunityCreated",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-13"),
    createdAt: "2026-07-07T00:00:12.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      ...opportunity
    },
    ...overrides
  };
};

const openWitchActionStream = (): readonly AnyDomainEventEnvelope[] => [
  ...witchReadyStream(),
  witchActionOpportunityCreatedEvent()
];

const witchBatchEnvelope = <EventType extends AnyDomainEventEnvelope["eventType"]>(
  eventType: EventType,
  payload: DomainEventEnvelope<EventType>["payload"],
  offset: number
): DomainEventEnvelope<EventType> => ({
  category: "domain",
  eventId: eventId(`event-${24 + offset}`),
  gameId: gameCreatedEvent().gameId,
  eventSequence: 24 + offset,
  batchId: batchId("batch-14"),
  gameVersion: 14,
  eventType,
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: commandId("command-14"),
  createdAt: "2026-07-07T00:00:13.000Z",
  correlationId: gameCreatedEvent().correlationId,
  causationId: gameCreatedEvent().causationId,
  payload
});

const witchDeathPendingBatchEvents = (input: {
  readonly targetSelf?: boolean;
} = {}): readonly [
  DomainEventEnvelope<"WitchTargetChosen">,
  DomainEventEnvelope<"WitchDeathPendingMarked">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const state = rebuildGameState(openWitchActionStream());
  const opportunity = state.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.opportunityKind === "WITCH_FIRST_NIGHT_ACTION"
  );
  const target = state.roster?.entries.find((entry) =>
    input.targetSelf === true
      ? entry.playerId === opportunity?.sourcePlayerId
      : entry.playerId !== opportunity?.sourcePlayerId
  );
  if (opportunity === undefined || target === undefined || state.roster === undefined) {
    throw new Error("Expected open Witch opportunity and target");
  }

  const targetChosen = createWitchTargetChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId: opportunity.taskId,
    opportunityId: opportunity.opportunityId,
    targetPlayerId: target.playerId,
    firstNightActionOpportunities: state.firstNightActionOpportunities,
    roster: state.roster.entries
  });
  const pendingDeath = createWitchDeathPendingMarkedPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    targetChoice: targetChosen
  });
  const settlement = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...createWitchDeathPendingScheduledTaskSettlement({
      taskId: opportunity.taskId,
      characterStateRevision: opportunity.sourceCharacterStateRevision
    })
  };

  return [
    witchBatchEnvelope("WitchTargetChosen", targetChosen, 0),
    witchBatchEnvelope("WitchDeathPendingMarked", pendingDeath, 1),
    witchBatchEnvelope("ScheduledTaskSettled", settlement, 2)
  ];
};

const impairedWitchState = (kind: "DRUNK" | "POISONED" = "POISONED") => {
  const state = rebuildGameState(openWitchActionStream());
  const opportunity = state.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.opportunityKind === "WITCH_FIRST_NIGHT_ACTION"
  );
  if (opportunity === undefined) {
    throw new Error("Expected open Witch opportunity");
  }

  const abilityImpairments: AbilityImpairmentSet = {
    impairments: [
      kind === "DRUNK"
        ? {
          impairmentId: abilityImpairmentId("ability-impairment-v1:a-drunk-witch"),
          kind: "DRUNK",
          sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
          sourcePlayerId: playerId("player-ai-10"),
          affectedPlayerId: opportunity.sourcePlayerId,
          affectedSeatNumber: opportunity.sourceSeatNumber,
          affectedRole: opportunity.sourceRole,
          chosenRoleId: roleId("witch"),
          sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision
        }
        : {
          impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned-witch"),
          kind: "POISONED",
          sourceKind: "SNAKE_CHARMER_DEMON_HIT",
          sourcePlayerId: playerId("player-ai-4"),
          affectedPlayerId: opportunity.sourcePlayerId,
          affectedSeatNumber: opportunity.sourceSeatNumber,
          affectedRole: opportunity.sourceRole,
          sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision
        }
    ]
  };

  return {
    ...state,
    abilityImpairments
  };
};

const witchIneffectiveBatchEvents = (kind: "DRUNK" | "POISONED" = "POISONED"): readonly [
  DomainEventEnvelope<"WitchTargetChosen">,
  DomainEventEnvelope<"WitchIneffectiveResolved">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const state = impairedWitchState(kind);
  const opportunity = state.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.opportunityKind === "WITCH_FIRST_NIGHT_ACTION"
  );
  const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity?.sourcePlayerId);
  if (opportunity === undefined || target === undefined || state.roster === undefined) {
    throw new Error("Expected impaired Witch opportunity and target");
  }

  const targetChosen = createWitchTargetChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId: opportunity.taskId,
    opportunityId: opportunity.opportunityId,
    targetPlayerId: target.playerId,
    firstNightActionOpportunities: state.firstNightActionOpportunities,
    roster: state.roster.entries
  });
  const effectiveness = evaluateWitchEffectiveness({
    sourcePlayerId: targetChosen.sourcePlayerId,
    abilityImpairments: state.abilityImpairments
  });
  const ineffective = createWitchIneffectiveResolvedPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    targetChoice: targetChosen,
    effectiveness
  });
  const settlement = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...createWitchIneffectiveScheduledTaskSettlement({
      taskId: opportunity.taskId,
      characterStateRevision: opportunity.sourceCharacterStateRevision
    })
  };

  return [
    witchBatchEnvelope("WitchTargetChosen", targetChosen, 0),
    witchBatchEnvelope("WitchIneffectiveResolved", ineffective, 1),
    witchBatchEnvelope("ScheduledTaskSettled", settlement, 2)
  ];
};

const dreamerReadyStream = (): readonly AnyDomainEventEnvelope[] => [
  ...openWitchActionStream(),
  ...witchDeathPendingBatchEvents()
];

const dreamerActionOpportunityCreatedEvent = (
  overrides: Partial<DomainEventEnvelope<"FirstNightActionOpportunityCreated">> = {}
): DomainEventEnvelope<"FirstNightActionOpportunityCreated"> => {
  const state = rebuildGameState(dreamerReadyStream());
  const task = getNextUnsettledFirstNightTask(state.firstNightTaskPlan ?? { tasks: [] }, state.firstNightTaskProgress);
  if (task === undefined || task.taskType !== "DREAMER_ACTION" || state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined) {
    throw new Error("Expected next Dreamer action task");
  }

  const opportunity = createFirstNightRoleActionOpportunity({
    taskId: task.taskId,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress,
    currentCharacterState: state.currentCharacterState,
    firstNightActionOpportunities: state.firstNightActionOpportunities
  });

  return {
    category: "domain",
    eventId: eventId("event-27"),
    gameId: gameCreatedEvent().gameId,
    eventSequence: 27,
    batchId: batchId("batch-15"),
    gameVersion: 15,
    eventType: "FirstNightActionOpportunityCreated",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-15"),
    createdAt: "2026-07-07T00:00:14.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      ...opportunity
    },
    ...overrides
  };
};

const openDreamerActionStream = (): readonly AnyDomainEventEnvelope[] => [
  ...dreamerReadyStream(),
  dreamerActionOpportunityCreatedEvent()
];

const dreamerBatchEnvelope = <EventType extends AnyDomainEventEnvelope["eventType"]>(
  eventType: EventType,
  payload: DomainEventEnvelope<EventType>["payload"],
  offset: number
): DomainEventEnvelope<EventType> => ({
  category: "domain",
  eventId: eventId(`event-${28 + offset}`),
  gameId: gameCreatedEvent().gameId,
  eventSequence: 28 + offset,
  batchId: batchId("batch-16"),
  gameVersion: 16,
  eventType,
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: commandId("command-16"),
  createdAt: "2026-07-07T00:00:15.000Z",
  correlationId: gameCreatedEvent().correlationId,
  causationId: gameCreatedEvent().causationId,
  payload
});

const dreamerInformationBatchEvents = (
  targetAlignment: "GOOD" | "EVIL" = "GOOD",
  sourceState?: GameState
): readonly [
  DomainEventEnvelope<"DreamerTargetChosen">,
  DomainEventEnvelope<"DreamerInformationDelivered">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const state = sourceState ?? rebuildGameState(openDreamerActionStream());
  const opportunity = state.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION"
  );
  const target = state.currentCharacterState?.entries.find((entry) =>
    entry.playerId !== opportunity?.sourcePlayerId &&
    entry.role.defaultAlignment === targetAlignment
  );
  if (
    opportunity === undefined ||
    target === undefined ||
    state.roster === undefined ||
    state.currentCharacterState === undefined ||
    state.setup === undefined
  ) {
    throw new Error("Expected open Dreamer opportunity and target");
  }

  const targetChosen = createDreamerTargetChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId: opportunity.taskId,
    opportunityId: opportunity.opportunityId,
    targetPlayerId: target.playerId,
    firstNightActionOpportunities: state.firstNightActionOpportunities,
    roster: state.roster.entries,
    currentCharacterState: state.currentCharacterState
  });
  const effectiveness = evaluateDreamerEffectiveness({
    sourcePlayerId: targetChosen.sourcePlayerId,
    abilityImpairments: state.abilityImpairments
  });
  const information = createDreamerInformationDeliveredPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    targetChoice: targetChosen,
    setup: state.setup,
    currentCharacterState: state.currentCharacterState,
    effectiveness
  });
  const settlement = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...createDreamerInformationDeliveredScheduledTaskSettlement({
      taskId: opportunity.taskId,
      characterStateRevision: opportunity.sourceCharacterStateRevision
    })
  };

  return [
    dreamerBatchEnvelope("DreamerTargetChosen", targetChosen, 0),
    dreamerBatchEnvelope("DreamerInformationDelivered", information, 1),
    dreamerBatchEnvelope("ScheduledTaskSettled", settlement, 2)
  ];
};

const seamstressReadyStream = (): readonly AnyDomainEventEnvelope[] => {
  const dreamerStream = openDreamerActionStream();
  const dreamerState = rebuildGameState(dreamerStream);
  return [
    ...dreamerStream,
    ...dreamerInformationBatchEvents("GOOD", dreamerState)
  ];
};

const seamstressActionOpportunityCreatedEvent = (
  overrides: Partial<DomainEventEnvelope<"FirstNightActionOpportunityCreated">> = {},
  sourceState?: GameState
): DomainEventEnvelope<"FirstNightActionOpportunityCreated"> => {
  const state = sourceState ?? rebuildGameState(seamstressReadyStream());
  const task = getNextUnsettledFirstNightTask(state.firstNightTaskPlan ?? { tasks: [] }, state.firstNightTaskProgress);
  if (task === undefined || task.taskType !== "SEAMSTRESS_ACTION" || state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined) {
    throw new Error("Expected next Seamstress action task");
  }

  const opportunity = createLegacySeamstressFirstNightActionOpportunity({
    taskId: task.taskId,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: state.firstNightTaskProgress,
    currentCharacterState: state.currentCharacterState,
    firstNightActionOpportunities: state.firstNightActionOpportunities
  });

  return {
    category: "domain",
    eventId: eventId("event-31"),
    gameId: gameCreatedEvent().gameId,
    eventSequence: 31,
    batchId: batchId("batch-17"),
    gameVersion: 17,
    eventType: "FirstNightActionOpportunityCreated",
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    commandId: commandId("command-17"),
    createdAt: "2026-07-07T00:00:16.000Z",
    correlationId: gameCreatedEvent().correlationId,
    causationId: gameCreatedEvent().causationId,
    payload: {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      ...opportunity
    },
    ...overrides
  };
};

const openSeamstressActionStream = (): readonly AnyDomainEventEnvelope[] => {
  const readyStream = seamstressReadyStream();
  const readyState = rebuildGameState(readyStream);
  return [
    ...readyStream,
    seamstressActionOpportunityCreatedEvent({}, readyState)
  ];
};

const seamstressBatchEnvelope = <EventType extends AnyDomainEventEnvelope["eventType"]>(
  eventType: EventType,
  payload: DomainEventEnvelope<EventType>["payload"],
  offset: number
): DomainEventEnvelope<EventType> => ({
  category: "domain",
  eventId: eventId(`event-${32 + offset}`),
  gameId: gameCreatedEvent().gameId,
  eventSequence: 32 + offset,
  batchId: batchId("batch-18"),
  gameVersion: 18,
  eventType,
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: commandId("command-18"),
  createdAt: "2026-07-07T00:00:17.000Z",
  correlationId: gameCreatedEvent().correlationId,
  causationId: gameCreatedEvent().causationId,
  payload
});

const seamstressDeferredBatchEvents = (sourceState?: GameState): readonly [
  DomainEventEnvelope<"SeamstressActionDeferred">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const state = sourceState ?? rebuildGameState(openSeamstressActionStream());
  const opportunity = state.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.opportunityKind === "SEAMSTRESS_FIRST_NIGHT_ACTION"
  );
  if (opportunity === undefined) {
    throw new Error("Expected open Seamstress opportunity");
  }

  const deferred = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    nightNumber: 1 as const,
    taskId: opportunity.taskId,
    taskType: "SEAMSTRESS_ACTION" as const,
    opportunityId: opportunity.opportunityId,
    decisionKind: "DEFER" as const,
    sourcePlayerId: opportunity.sourcePlayerId,
    sourceSeatNumber: opportunity.sourceSeatNumber,
    sourceRole: opportunity.sourceRole,
    sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision
  };
  const settlement = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...createSeamstressDeferredScheduledTaskSettlement({
      taskId: opportunity.taskId,
      characterStateRevision: opportunity.sourceCharacterStateRevision
    })
  };

  return [
    seamstressBatchEnvelope("SeamstressActionDeferred", deferred, 0),
    seamstressBatchEnvelope("ScheduledTaskSettled", settlement, 1)
  ];
};

const snakeCharmerDemonHitBatchEvents = (): readonly [
  DomainEventEnvelope<"SnakeCharmerTargetChosen">,
  DomainEventEnvelope<"SnakeCharmerDemonSwapApplied">,
  DomainEventEnvelope<"AbilityImpairmentApplied">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const state = rebuildGameState(openSnakeCharmerStream());
  const opportunity = state.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION"
  );
  const target = state.currentCharacterState?.entries.find((entry) => entry.role.characterType === "DEMON");
  if (
    opportunity === undefined ||
    target === undefined ||
    state.roster === undefined ||
    state.currentCharacterState === undefined
  ) {
    throw new Error("Expected open Snake Charmer opportunity, Demon target, roster, and current state");
  }

  const targetChosen = createSnakeCharmerTargetChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId: opportunity.taskId,
    opportunityId: opportunity.opportunityId,
    targetPlayerId: target.playerId,
    firstNightActionOpportunities: state.firstNightActionOpportunities,
    roster: state.roster.entries
  });
  const swap = createSnakeCharmerDemonSwapAppliedPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    targetChoice: targetChosen,
    currentCharacterState: state.currentCharacterState
  });
  const poison = createSnakeCharmerPoisonedImpairmentPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    swap
  });
  const settlement = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...createSnakeCharmerDemonHitScheduledTaskSettlement({
      taskId: opportunity.taskId,
      characterStateRevision: swap.nextCharacterStateRevision
    })
  };

  return [
    snakeCharmerBatchEnvelope("SnakeCharmerTargetChosen", targetChosen, 0),
    snakeCharmerBatchEnvelope("SnakeCharmerDemonSwapApplied", swap, 1),
    snakeCharmerBatchEnvelope("AbilityImpairmentApplied", poison, 2),
    snakeCharmerBatchEnvelope("ScheduledTaskSettled", settlement, 3)
  ];
};

const poisonedBaseSnakeCharmerState = () => {
  const state = rebuildGameState(openBaseSnakeCharmerStream());
  const opportunity = state.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION" &&
    candidate.taskType === "SNAKE_CHARMER_ACTION"
  );
  if (opportunity === undefined || state.currentCharacterState === undefined) {
    throw new Error("Expected open base Snake Charmer opportunity");
  }

  const abilityImpairments: AbilityImpairmentSet = {
    impairments: [{
      impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned-base-snake"),
      kind: "POISONED",
      sourceKind: "SNAKE_CHARMER_DEMON_HIT",
      sourcePlayerId: playerId("player-ai-1"),
      affectedPlayerId: opportunity.sourcePlayerId,
      affectedSeatNumber: opportunity.sourceSeatNumber,
      affectedRole: opportunity.sourceRole,
      sourceCharacterStateRevision: state.currentCharacterState.revision
    }]
  };

  return {
    ...state,
    abilityImpairments
  };
};

const baseSnakeCharmerIneffectiveBatchEvents = (): readonly [
  DomainEventEnvelope<"SnakeCharmerTargetChosen">,
  DomainEventEnvelope<"SnakeCharmerIneffectiveResolved">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const state = poisonedBaseSnakeCharmerState();
  const opportunity = state.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION" &&
    candidate.taskType === "SNAKE_CHARMER_ACTION"
  );
  const target = state.currentCharacterState?.entries.find((entry) => entry.role.characterType === "DEMON");
  if (opportunity === undefined || target === undefined || state.roster === undefined) {
    throw new Error("Expected poisoned base Snake Charmer opportunity, Demon target, and roster");
  }

  const targetChosen = createSnakeCharmerTargetChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId: opportunity.taskId,
    opportunityId: opportunity.opportunityId,
    targetPlayerId: target.playerId,
    firstNightActionOpportunities: state.firstNightActionOpportunities,
    roster: state.roster.entries
  });
  const effectiveness = evaluateSnakeCharmerEffectiveness({
    sourcePlayerId: targetChosen.sourcePlayerId,
    abilityImpairments: state.abilityImpairments
  });
  const ineffective = createSnakeCharmerIneffectiveResolvedPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    targetChoice: targetChosen,
    effectiveness
  });
  const settlement = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...createSnakeCharmerIneffectiveScheduledTaskSettlement({
      taskId: opportunity.taskId,
      characterStateRevision: opportunity.sourceCharacterStateRevision
    })
  };

  return [
    baseSnakeCharmerBatchEnvelope("SnakeCharmerTargetChosen", targetChosen, 0),
    baseSnakeCharmerBatchEnvelope("SnakeCharmerIneffectiveResolved", ineffective, 1),
    baseSnakeCharmerBatchEnvelope("ScheduledTaskSettled", settlement, 2)
  ];
};

const resequenceSnakeCharmerBatch = (
  events: readonly AnyDomainEventEnvelope[]
): readonly AnyDomainEventEnvelope[] =>
  events.map((event, index) => ({
    ...event,
    eventId: eventId(`event-${19 + index}-${event.eventType}`),
    eventSequence: 19 + index
  }));

const expectInitialKnowledgePayloadRejected = (payload: unknown): DomainError =>
  captureDomainError(
    () => rebuildGameState(firstNightEventStream(
      firstNightInitializedEvent(),
      initialPrivateKnowledgeEstablishedEvent({ payload: payload as InitialKnowledgePayload })
    )),
    "InvalidInitialPrivateKnowledgeEstablishedPayload"
  );

const expectFirstNightPayloadRejected = (payload: unknown): DomainError =>
  captureDomainError(
    () => rebuildGameState(firstNightEventStream(
      firstNightInitializedEvent({ payload: payload as FirstNightPayload }),
      initialPrivateKnowledgeEstablishedEvent()
    )),
    "InvalidFirstNightInitializedPayload"
  );

const expectFirstNightTaskPlanPayloadRejected = (payload: unknown): DomainError =>
  captureDomainError(
    () => rebuildGameState(firstNightTaskPlanEventStream(
      firstNightTaskPlanCreatedEvent({ payload: payload as FirstNightTaskPlanPayload })
    )),
    "InvalidFirstNightTaskPlanCreatedPayload"
  );

const generatedPayloadFor = (constraints: Parameters<typeof testSetupGenerator.generate>[0]["constraints"]): SetupGeneratedPayload => {
  const result = testSetupGenerator.generate({
    scriptId: "sects-and-violets",
    rootSeed: "seed-1",
    playerCount: 12,
    constraints
  });

  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...result.setup
  };
};

const mutateSetupPayload = (
  mutate: (payload: SetupGeneratedPayload) => SetupGeneratedPayload
): ReturnType<typeof setupGeneratedEvent> => setupGeneratedEvent({ payload: mutate(setupGeneratedEvent().payload) });

const mutateCharactersAssignedPayload = (
  mutate: (payload: CharactersAssignedPayload) => CharactersAssignedPayload
): ReturnType<typeof charactersAssignedEvent> => charactersAssignedEvent({ payload: mutate(charactersAssignedEvent().payload) });

const setupRoleIds = (roles: readonly RoleSetupSnapshot[]): readonly RoleId[] =>
  roles.map((role) => role.roleId).sort(compareStableId);

const cloneRoleSnapshot = (role: RoleSetupSnapshot): RoleSetupSnapshot => ({
  ...role,
  setupModifier: { ...role.setupModifier }
});

const roleCatalogWithRoles = (
  payload: SetupGeneratedPayload,
  roles: readonly RoleSetupSnapshot[]
): RoleCatalogSnapshot => {
  const snapshotWithoutSignature = {
    scriptId: payload.roleCatalogSnapshot.scriptId,
    edition: payload.roleCatalogSnapshot.edition,
    roleCatalogVersion: payload.roleCatalogSnapshot.roleCatalogVersion,
    roles: roles.map(cloneRoleSnapshot)
  };

  return {
    ...snapshotWithoutSignature,
    canonicalSignature: calculateRoleCatalogSignature(snapshotWithoutSignature)
  };
};

const payloadWithCatalogRoles = (
  payload: SetupGeneratedPayload,
  roles: readonly RoleSetupSnapshot[]
): SetupGeneratedPayload => {
  const roleCatalogSnapshot = roleCatalogWithRoles(payload, roles);

  return {
    ...payload,
    roleCatalogSnapshot,
    roleCatalogSignature: roleCatalogSnapshot.canonicalSignature
  };
};

const absentRoleId = (payload: SetupGeneratedPayload): RoleId => {
  const actualRoleIds = new Set(payload.actualRoles.map((role) => role.roleId));
  const candidates = [
    "clockmaker",
    "dreamer",
    "snake_charmer",
    "mathematician",
    "flowergirl",
    "town_crier",
    "oracle",
    "savant",
    "seamstress",
    "philosopher",
    "artist",
    "juggler",
    "sage",
    "mutant",
    "sweetheart",
    "barber",
    "klutz"
  ].map(roleId);
  const candidate = candidates.find((roleIdValue) => !actualRoleIds.has(roleIdValue));
  if (candidate === undefined) {
    throw new Error("Expected at least one absent role candidate");
  }

  return candidate;
};

describe("domain event rebuild", () => {
  it("has explicit empty event stream behavior", () => {
    expectDomainCode(() => rebuildGameState([]), "EmptyEventStream");
    expect(() => rebuildGameState([])).toThrow("empty domain event stream");
  });

  it("applies GameCreated into minimal canonical state", () => {
    const state = rebuildGameState([gameCreatedEvent()]);

    expect(state).toMatchObject({
      gameVersion: 1,
      lastEventSequence: 1,
      created: true,
      rootSeed: "seed-1",
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      phase: "SCRIPT_SELECTION",
      dayNumber: 0,
      nightNumber: 0,
      playerCounts: {
        playerCount: 12,
        humanPlayerCount: 1,
        aiPlayerCount: 11,
        storytellerCount: 1
      }
    });
  });

  it("rebuilds the initial phase and counters after GameCreated", () => {
    const state = rebuildGameState([gameCreatedEvent()]);

    expect(state.phase).toBe("SCRIPT_SELECTION");
    expect(state.dayNumber).toBe(0);
    expect(state.nightNumber).toBe(0);
    expect(rebuildGameState([gameCreatedEvent()])).toStrictEqual(state);
  });

  it("requires ScriptSelected to follow GameCreated", () => {
    const event = scriptSelectedEvent({ eventSequence: 1, gameVersion: 1 });

    expectDomainCode(() => rebuildGameState([event]), "MissingGameCreated");
  });

  it("rejects duplicate GameCreated", () => {
    const duplicate = gameCreatedEvent({
      eventId: eventId("event-2"),
      eventSequence: 2,
      batchId: scriptSelectedEvent().batchId,
      commandId: scriptSelectedEvent().commandId,
      gameVersion: 2
    });
    const state = rebuildGameState([gameCreatedEvent()]);

    expectDomainCode(() => applyDomainEvent(state, duplicate), "DuplicateGameCreated");
  });

  it("rejects event sequence jumps", () => {
    const jumped = scriptSelectedEvent({ eventSequence: 3 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), jumped]), "EventSequenceJump");
  });

  it("rejects repeated event sequences", () => {
    const repeated = scriptSelectedEvent({ eventSequence: 1 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), repeated]), "EventSequenceJump");
  });

  it("rejects unsupported event versions", () => {
    const unsupported = {
      ...gameCreatedEvent(),
      eventVersion: 2
    } as unknown as AnyDomainEventEnvelope;

    expectDomainCode(() => rebuildGameState([unsupported]), "UnsupportedEventVersion");
  });

  it("rebuilds the same event stream deterministically", () => {
    const events = [gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()];

    expect(rebuildGameState(events)).toStrictEqual(rebuildGameState(events));
  });

  it("does not mutate input events", () => {
    const events = [gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()];
    const before = JSON.stringify(events);

    rebuildGameState(events);

    expect(JSON.stringify(events)).toBe(before);
  });

  it("rejects a first event whose gameVersion is not 1", () => {
    const event = gameCreatedEvent({ gameVersion: 2 });

    expectDomainCode(() => validateDomainEventStream([event]), "EventGameVersionMismatch");
  });

  it("rejects gameVersion jumps between batches", () => {
    const event = scriptSelectedEvent({ gameVersion: 3 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), event]), "EventGameVersionMismatch");
  });

  it("rejects gameVersion retreat between batches", () => {
    const event = scriptSelectedEvent({ gameVersion: 0 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), event]), "EventGameVersionMismatch");
  });

  it("rejects different gameVersion values inside one batch", () => {
    const created = gameCreatedEvent();
    const selected = scriptSelectedEvent({
      batchId: created.batchId,
      commandId: created.commandId,
      eventSequence: 2,
      gameVersion: 2
    });

    expectDomainCode(() => rebuildGameState([created, selected]), "EventGameVersionMismatch");
  });

  it("rejects different commandId values inside one batch", () => {
    const created = gameCreatedEvent();
    const selected = scriptSelectedEvent({
      batchId: created.batchId,
      eventSequence: 2,
      gameVersion: 1,
      commandId: commandId("other-command")
    });

    expectDomainCode(() => rebuildGameState([created, selected]), "EventCommandMismatch");
  });

  it("rejects different gameId values inside one stream", () => {
    const created = gameCreatedEvent();
    const selected = scriptSelectedEvent({
      batchId: created.batchId,
      commandId: created.commandId,
      eventSequence: 2,
      gameVersion: 1,
      gameId: otherGameId()
    });

    expectDomainCode(() => rebuildGameState([created, selected]), "EventGameMismatch");
  });

  it("rejects rules baseline changes inside one stream", () => {
    const selected = scriptSelectedEvent({
      rulesBaselineVersion: "Phase One v0",
      payload: {
        ...scriptSelectedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "EventRulesBaselineMismatch");
  });

  it("rejects duplicate event ids", () => {
    const selected = scriptSelectedEvent({ eventId: gameCreatedEvent().eventId });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "DuplicateEventId");
  });

  it("rejects one commandId associated with two successful batches", () => {
    const selected = scriptSelectedEvent({ commandId: gameCreatedEvent().commandId });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "DuplicateCommandBatch");
  });

  it("rejects event metadata rules baseline that differs from payload", () => {
    const event = gameCreatedEvent({
      payload: {
        ...gameCreatedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([event]), "EventRulesBaselineMismatch");
  });

  it("rejects ScriptSelected when its rules baseline differs from GameState", () => {
    const selected = scriptSelectedEvent({
      rulesBaselineVersion: "Phase One v0",
      payload: {
        ...scriptSelectedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "EventRulesBaselineMismatch");
  });

  it("rebuilds a legal SelectScript multi-event batch", () => {
    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);

    expect(state.gameVersion).toBe(2);
    expect(state.lastEventSequence).toBe(3);
    expect(state.selectedScript).toMatchObject({ scriptId: "sects-and-violets" });
    expect(state.phase).toBe("SETUP_GENERATION");
  });

  it("applies PhaseTransitioned into SETUP_GENERATION after ScriptSelected", () => {
    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);

    expect(state.phase).toBe("SETUP_GENERATION");
    expect(state.dayNumber).toBe(0);
    expect(state.nightNumber).toBe(0);
    expect(state.gameVersion).toBe(2);
    expect(state.lastEventSequence).toBe(3);
  });

  it("rejects ScriptSelected after the game has already reached SETUP_GENERATION", () => {
    const duplicate = scriptSelectedEvent({
      eventId: eventId("event-4"),
      eventSequence: 4,
      batchId: batchId("batch-3"),
      commandId: commandId("command-3"),
      gameVersion: 3
    });

    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);

    expectDomainCode(() => applyDomainEvent(state, duplicate), "InvalidScriptSelectedPhase");
  });

  it("rejects two ScriptSelected events in one stream before phase transition", () => {
    const duplicate = scriptSelectedEvent({
      eventId: eventId("event-3"),
      eventSequence: 3,
      batchId: batchId("batch-3"),
      commandId: commandId("command-3"),
      gameVersion: 3
    });

    const state = applyDomainEvent(rebuildGameState([gameCreatedEvent()]), scriptSelectedEvent());

    expectDomainCode(() => applyDomainEvent(state, duplicate), "DuplicateScriptSelected");
  });

  it("rejects PhaseTransitioned when reasonCode does not match policy", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        transitionReason: "SETUP_GENERATED"
      }
    });

    const state = applyDomainEvent(rebuildGameState([gameCreatedEvent()]), scriptSelectedEvent());

    expectDomainCode(() => applyDomainEvent(state, event), "InvalidPhaseTransitionReason");
  });

  it("keeps transitionReason as a typed replay fact", () => {
    const event = phaseTransitionedEvent();
    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), event]);

    expect(event.payload.transitionReason).toBe("SCRIPT_SELECTED");
    expect(state.phase).toBe("SETUP_GENERATION");
  });

  it("rejects semantically invalid prospective batches without mutating inputs", () => {
    const currentState = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);
    const invalid = [scriptSelectedEvent({
      eventId: eventId("event-4"),
      eventSequence: 4,
      batchId: batchId("batch-3"),
      commandId: commandId("command-3"),
      gameVersion: 3
    })];
    const stateBefore = JSON.stringify(currentState);
    const eventsBefore = JSON.stringify(invalid);

    expectDomainCode(() => applyDomainEventBatch(currentState, invalid), "InvalidDomainBatchSemantics");
    expect(JSON.stringify(currentState)).toBe(stateBefore);
    expect(JSON.stringify(invalid)).toBe(eventsBefore);
  });

  it("does not allow arbitrary transitionReason strings at the type boundary", () => {
    const event = phaseTransitionedEvent();
    // @ts-expect-error transitionReason must be a PhaseTransitionReason value
    const invalid: typeof event.payload.transitionReason = "SCRIPT_SELECTION_TO_SETUP_GENERATION";

    void invalid;
    expect(event.payload.transitionReason).toBe("SCRIPT_SELECTED");
  });

  it("rejects PhaseTransitioned when fromPhase does not match state", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        fromPhase: "DAY_DISCUSSION"
      }
    });

    const state = applyDomainEvent(rebuildGameState([gameCreatedEvent()]), scriptSelectedEvent());

    expectDomainCode(() => applyDomainEvent(state, event), "InvalidPhaseTransition");
  });

  it("rejects negative phase counters", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        dayNumberAfter: -1
      }
    });

    const state = applyDomainEvent(rebuildGameState([gameCreatedEvent()]), scriptSelectedEvent());

    expectDomainCode(() => applyDomainEvent(state, event), "InvalidPhaseCounter");
  });

  it("rejects illegal phase jumps", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        toPhase: "FIRST_NIGHT"
      }
    });

    const state = applyDomainEvent(rebuildGameState([gameCreatedEvent()]), scriptSelectedEvent());

    expectDomainCode(() => applyDomainEvent(state, event), "InvalidPhaseTransition");
  });

  it("rejects PhaseTransitioned rules baseline mismatch", () => {
    const event = phaseTransitionedEvent({
      rulesBaselineVersion: "Phase One v0",
      payload: {
        ...phaseTransitionedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), event]), "EventRulesBaselineMismatch");
  });

  it("rebuilds a legal GenerateSetup batch into CHARACTER_ASSIGNMENT", () => {
    const state = rebuildGameState([
      gameCreatedEvent(),
      scriptSelectedEvent(),
      phaseTransitionedEvent(),
      setupGeneratedEvent(),
      setupPhaseTransitionedEvent()
    ]);

    expect(state.phase).toBe("CHARACTER_ASSIGNMENT");
    expect(state.gameVersion).toBe(3);
    expect(state.lastEventSequence).toBe(5);
  });

  it("rebuilds setup while leaving assignment absent", () => {
    const state = rebuildGameState([
      gameCreatedEvent(),
      scriptSelectedEvent(),
      phaseTransitionedEvent(),
      setupGeneratedEvent(),
      setupPhaseTransitionedEvent()
    ]);

    expect(state.setup?.actualRoles).toHaveLength(12);
    expect("assignment" in state).toBe(false);
  });

  it("rejects SETUP_GENERATED transition when setup fact is missing", () => {
    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);

    expectDomainCode(() => applyDomainEvent(state, setupPhaseTransitionedEvent({ eventSequence: 4 })), "MissingTransitionPrerequisite");
  });

  it("rejects damaged SetupGenerated payloads during replay", () => {
    const damaged = setupGeneratedEvent({
      payload: {
        ...setupGeneratedEvent().payload,
        actualRoles: setupGeneratedEvent().payload.actualRoles.slice(1)
      }
    });

    expectDomainCode(
      () => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent(), damaged, setupPhaseTransitionedEvent()]),
      "InvalidSetupGeneratedPayload"
    );
  });

  it("accepts a legal complete role catalog snapshot", () => {
    const state = rebuildGameState(setupEventStream());

    expect(state.setup?.roleCatalogSnapshot.roles).toHaveLength(25);
    expect(state.setup?.roleCatalogSignature).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
    expect(state.setup?.roleCatalogSignatureAlgorithm).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM);
  });

  it("rejects roleCatalogSnapshot when one role is missing", () => {
    const damaged = mutateSetupPayload((payload) => payloadWithCatalogRoles(payload, payload.roleCatalogSnapshot.roles.slice(1)));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects roleCatalogSnapshot when an extra role is present", () => {
    const damaged = mutateSetupPayload((payload) => {
      const firstRole = payload.roleCatalogSnapshot.roles[0];
      if (firstRole === undefined) {
        throw new Error("Expected catalog role");
      }

      return payloadWithCatalogRoles(payload, [
        ...payload.roleCatalogSnapshot.roles,
        {
          ...cloneRoleSnapshot(firstRole),
          roleId: roleId("extra_role")
        }
      ]);
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects duplicate role ids in roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map(cloneRoleSnapshot);
      const firstRole = roles[0];
      const secondRole = roles[1];
      if (firstRole === undefined || secondRole === undefined) {
        throw new Error("Expected catalog roles");
      }
      roles[1] = {
        ...secondRole,
        roleId: firstRole.roleId
      };

      return payloadWithCatalogRoles(payload, roles);
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects roleCatalogSnapshot outside canonical order", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map(cloneRoleSnapshot);
      const firstRole = roles[0];
      const secondRole = roles[1];
      if (firstRole === undefined || secondRole === undefined) {
        throw new Error("Expected catalog roles");
      }
      roles[0] = secondRole;
      roles[1] = firstRole;

      return payloadWithCatalogRoles(payload, roles);
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects a wrong roleCatalogSignature", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      roleCatalogSignature: "canonical-role-catalog-v1:00000000"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects a wrong roleCatalogSignatureAlgorithm", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      roleCatalogSignatureAlgorithm: "other-catalog-signature-v1"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects roleCatalogSignature mismatches with catalog content", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map(cloneRoleSnapshot);
      const fangGuIndex = roles.findIndex((role) => role.roleId === roleId("fang_gu"));
      const fangGu = roles[fangGuIndex];
      if (fangGu === undefined) {
        throw new Error("Expected Fang Gu");
      }
      roles[fangGuIndex] = {
        ...fangGu,
        setupModifier: {
          outsiderDelta: -1,
          townsfolkDelta: 1
        }
      };

      return {
        ...payload,
        roleCatalogSnapshot: {
          ...payload.roleCatalogSnapshot,
          roles
        }
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects actualRoles containing a role absent from roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role, index) =>
        index === 0
          ? {
              ...role,
              roleId: roleId("aaa_unknown_actual_role")
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demonBluffs containing a role absent from roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      demonBluffs: payload.demonBluffs.map((role, index) =>
        index === 0
          ? {
              ...role,
              roleId: roleId("aaa_unknown_bluff_role")
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects excludedRoleIds containing a role absent from roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        excludedRoleIds: [roleId("unknown_excluded_role")]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects lockedRoleIds containing a role absent from roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        lockedRoleIds: [roleId("unknown_locked_role")]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects exactRoleIds containing a role absent from roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        lockedRoleIds: [],
        excludedRoleIds: [],
        exactRoleIds: [roleId("unknown_exact_role"), ...setupRoleIds(payload.actualRoles).slice(1)].sort(compareStableId)
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects actualRoles whose known role type differs from the catalog", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role, index) =>
        index === 0
          ? {
              ...role,
              characterType: "OUTSIDER" as const
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects actualRoles whose known role alignment differs from the catalog", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role, index) =>
        index === 0
          ? {
              ...role,
              defaultAlignment: "EVIL" as const
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects actualRoles whose known role modifier differs from the catalog", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role, index) =>
        index === 0
          ? {
              ...role,
              setupModifier: {
                outsiderDelta: 1,
                townsfolkDelta: -1
              }
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demonBluff snapshots that differ from the catalog", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      demonBluffs: payload.demonBluffs.map((role, index) =>
        index === 0
          ? {
              ...role,
              defaultAlignment: "EVIL" as const
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demonRole snapshots that differ from the catalog", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      demonRole: {
        ...payload.demonRole,
        setupModifier: {
          outsiderDelta: payload.demonRole.setupModifier.outsiderDelta + 1,
          townsfolkDelta: payload.demonRole.setupModifier.townsfolkDelta - 1
        }
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects Vortox carrying Fang Gu setup modifiers in the catalog", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map((role) =>
        role.roleId === roleId("vortox")
          ? {
              ...cloneRoleSnapshot(role),
              setupModifier: {
                outsiderDelta: 1,
                townsfolkDelta: -1
              }
            }
          : cloneRoleSnapshot(role)
      );

      return payloadWithCatalogRoles(payload, roles);
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects No Dashii carrying Vigormortis setup modifiers in the catalog", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map((role) =>
        role.roleId === roleId("no_dashii")
          ? {
              ...cloneRoleSnapshot(role),
              setupModifier: {
                outsiderDelta: -1,
                townsfolkDelta: 1
              }
            }
          : cloneRoleSnapshot(role)
      );

      return payloadWithCatalogRoles(payload, roles);
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects fake catalog roles even when generic type counts remain legal", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map((role) =>
        role.roleId === roleId("clockmaker")
          ? {
              ...cloneRoleSnapshot(role),
              roleId: roleId("clockmaker_fake")
            }
          : cloneRoleSnapshot(role)
      );

      return payloadWithCatalogRoles(payload, roles.sort(compareRoleSetupSnapshot));
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("accepts SetupGenerated when demonRole deeply matches the actual demon snapshot", () => {
    const state = rebuildGameState(setupEventStream());
    const actualDemon = state.setup?.actualRoles.find((role) => role.characterType === "DEMON");

    expect(state.phase).toBe("CHARACTER_ASSIGNMENT");
    expect(state.setup?.demonRole).toStrictEqual(actualDemon);
  });

  it("rejects demonRole reusing a townsfolk roleId while claiming to be a demon", () => {
    const damaged = mutateSetupPayload((payload) => {
      const townsfolk = payload.actualRoles.find((role) => role.characterType === "TOWNSFOLK");
      if (townsfolk === undefined) {
        throw new Error("Expected townsfolk in setup");
      }

      return {
        ...payload,
        demonRole: {
          ...townsfolk,
          characterType: "DEMON",
          defaultAlignment: "EVIL"
        }
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demonRole modifier values that differ from the actual demon snapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      demonRole: {
        ...payload.demonRole,
        setupModifier: {
          outsiderDelta: payload.demonRole.setupModifier.outsiderDelta + 1,
          townsfolkDelta: payload.demonRole.setupModifier.townsfolkDelta - 1
        }
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects townsfolk snapshots with EVIL default alignment", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role) =>
        role.characterType === "TOWNSFOLK" ? { ...role, defaultAlignment: "EVIL" as const } : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demon snapshots with GOOD default alignment", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role) =>
        role.characterType === "DEMON" ? { ...role, defaultAlignment: "GOOD" as const } : role
      ),
      demonRole: {
        ...payload.demonRole,
        defaultAlignment: "GOOD" as const
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects non-demon role snapshots carrying setup modifiers", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role) =>
        role.characterType === "TOWNSFOLK"
          ? {
              ...role,
              setupModifier: {
                outsiderDelta: 1,
                townsfolkDelta: -1
              }
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects zero-modifier demons with setupModifiersApplied records", () => {
    const payload = generatedPayloadFor({ lockedRoleIds: [roleId("no_dashii")] });
    const damaged = setupGeneratedEvent({
      payload: {
        ...payload,
        setupModifiersApplied: [{
          roleId: roleId("no_dashii"),
          outsiderDelta: 0,
          townsfolkDelta: 0
        }]
      }
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects non-zero demon modifiers with extra zero-value records", () => {
    const payload = generatedPayloadFor({ lockedRoleIds: [roleId("fang_gu")] });
    const damaged = setupGeneratedEvent({
      payload: {
        ...payload,
        setupModifiersApplied: [
          ...payload.setupModifiersApplied,
          {
            roleId: roleId("clockmaker"),
            outsiderDelta: 0,
            townsfolkDelta: 0
          }
        ]
      }
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects locked roles that did not enter actualRoles", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        lockedRoleIds: [absentRoleId(payload)]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects excluded roles that appear in actualRoles", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        excludedRoleIds: [payload.actualRoles[0]?.roleId ?? roleId("clockmaker")]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects excluded roles that appear as demon bluffs", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        excludedRoleIds: [payload.demonBluffs[0]?.roleId ?? roleId("clockmaker")]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects exactRoleIds that do not match actualRoles", () => {
    const damaged = mutateSetupPayload((payload) => {
      const actualRoleIds = setupRoleIds(payload.actualRoles);
      const replacement = payload.demonBluffs[0]?.roleId;
      if (replacement === undefined) {
        throw new Error("Expected demon bluff");
      }

      return {
        ...payload,
        constraintsSnapshot: {
          lockedRoleIds: [],
          excludedRoleIds: [],
          exactRoleIds: [...actualRoleIds.slice(1), replacement].sort(compareStableId)
        }
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects duplicate role ids inside constraintsSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        lockedRoleIds: [payload.actualRoles[0]?.roleId ?? roleId("clockmaker"), payload.actualRoles[0]?.roleId ?? roleId("clockmaker")]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects locked and excluded constraint overlap", () => {
    const damaged = mutateSetupPayload((payload) => {
      const lockedRoleId = payload.actualRoles[0]?.roleId ?? roleId("clockmaker");

      return {
        ...payload,
        constraintsSnapshot: {
          lockedRoleIds: [lockedRoleId],
          excludedRoleIds: [lockedRoleId],
          exactRoleIds: []
        }
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects unsupported setup algorithm versions", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      setupAlgorithmVersion: "snv-12-setup-v0"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects unsupported random algorithm versions", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      randomAlgorithmVersion: "xmur3-custom-v0"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects unsupported random streams", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      randomStream: "setup/other"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects unsupported role catalog versions", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      roleCatalogVersion: "snv-role-catalog-v0"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects actualRoles outside canonical order", () => {
    const damaged = mutateSetupPayload((payload) => {
      const actualRoles = [...payload.actualRoles];
      const first = actualRoles[0];
      const second = actualRoles[1];
      if (first === undefined || second === undefined) {
        throw new Error("Expected at least two actual roles");
      }
      actualRoles[0] = second;
      actualRoles[1] = first;

      return {
        ...payload,
        actualRoles
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demonBluffs outside canonical roleId order", () => {
    const damaged = mutateSetupPayload((payload) => {
      const demonBluffs = [...payload.demonBluffs];
      const first = demonBluffs[0];
      const second = demonBluffs[1];
      if (first === undefined || second === undefined) {
        throw new Error("Expected at least two demon bluffs");
      }
      demonBluffs[0] = second;
      demonBluffs[1] = first;

      return {
        ...payload,
        demonBluffs
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rebuilds a legal SetupGenerated event stream into CHARACTER_ASSIGNMENT", () => {
    const state = rebuildGameState(setupEventStream());

    expect(state.phase).toBe("CHARACTER_ASSIGNMENT");
    expect(state.setup?.actualRoles).toHaveLength(12);
    expect(state.setup?.demonBluffs).toHaveLength(3);
  });

  it("rebuilds a legal PlayerRosterCreated event stream while staying in CHARACTER_ASSIGNMENT", () => {
    const state = rebuildGameState(rosterEventStream());

    expect(state.phase).toBe("CHARACTER_ASSIGNMENT");
    expect(state.roster?.rosterVersion).toBe(SUPPORTED_ROSTER_VERSION);
    expect(state.roster?.entries).toHaveLength(12);
    expect(state.roster?.entries.filter((entry) => entry.playerKind === "HUMAN")).toHaveLength(1);
    expect(state.roster?.entries.filter((entry) => entry.playerKind === "AI")).toHaveLength(11);
    expect(state.assignment).toBeUndefined();
  });

  it("rejects PlayerRosterCreated with an unsupported roster version", () => {
    const damaged = playerRosterCreatedEvent({
      payload: {
        ...playerRosterCreatedEvent().payload,
        rosterVersion: "unsupported-roster-version"
      }
    });

    expectDomainCode(() => rebuildGameState(rosterEventStream(damaged)), "InvalidPlayerRosterCreatedPayload");
  });

  it("rejects PlayerRosterCreated with an incomplete roster", () => {
    const damaged = playerRosterCreatedEvent({
      payload: {
        ...playerRosterCreatedEvent().payload,
        entries: playerRosterCreatedEvent().payload.entries.slice(1)
      }
    });

    expectDomainCode(() => rebuildGameState(rosterEventStream(damaged)), "InvalidPlayerRosterCreatedPayload");
  });

  it("rejects PlayerRosterCreated with untrimmed display names", () => {
    const damaged = playerRosterCreatedEvent({
      payload: {
        ...playerRosterCreatedEvent().payload,
        entries: playerRosterCreatedEvent().payload.entries.map((entry, index) =>
          index === 0 ? { ...entry, displayName: ` ${entry.displayName}` } : entry
        )
      }
    });

    expectDomainCode(() => rebuildGameState(rosterEventStream(damaged)), "InvalidPlayerRosterCreatedPayload");
  });

  it("rejects duplicate PlayerRosterCreated facts", () => {
    const state = rebuildGameState(rosterEventStream());

    expectDomainCode(() => applyDomainEvent(state, playerRosterCreatedEvent({ eventSequence: 7 })), "DuplicatePlayerRosterCreated");
  });

  it("rejects CharactersAssigned when a roster is missing", () => {
    const state = rebuildGameState(setupEventStream());

    expectDomainCode(() => applyDomainEvent(state, charactersAssignedEvent({ eventSequence: 6 })), "InvalidCharactersAssignedPayload");
  });

  it("rebuilds a legal CharactersAssigned event stream into FIRST_NIGHT", () => {
    const state = rebuildGameState(assignmentEventStream());

    expect(state.phase).toBe("FIRST_NIGHT");
    expect(state.dayNumber).toBe(0);
    expect(state.nightNumber).toBe(1);
    expect(state.roster?.entries).toHaveLength(12);
    expect(state.assignment?.assignments).toHaveLength(12);
    expect(state.assignment?.assignments.map((assignment) => assignment.seatNumber)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("[D19T-025, D19T-027..030] deterministically derives initial Dreamer tenure from legacy accepted assignment history", () => {
    const events = assignmentEventStream();
    const first = rebuildGameState(events);
    const second = rebuildGameState(events);
    const assignedDreamer = first.assignment?.assignments.find((entry) => entry.role.roleId === "dreamer");
    const dreamerTenure = first.seamstressRoleTenureState?.records.find((entry) => entry.roleId === "dreamer");

    expect(assignedDreamer).toBeDefined();
    expect(dreamerTenure).toMatchObject({
      playerId: assignedDreamer?.playerId,
      seatNumber: assignedDreamer?.seatNumber,
      acquiredCharacterStateRevision: 1,
      startedBy: {
        kind: "CHARACTERS_ASSIGNED",
        sourceEventId: charactersAssignedEvent().eventId,
        sourceEventSequence: charactersAssignedEvent().eventSequence
      }
    });
    expect(first.seamstressRoleTenureState).toStrictEqual(second.seamstressRoleTenureState);
    const trackedRoles = first.assignment?.assignments
      .filter((entry) => ["cerenovus", "dreamer", "mathematician", "philosopher", "seamstress", "vortox"].includes(entry.role.roleId))
      .map((entry) => entry.role.roleId) ?? [];
    expect(first.seamstressRoleTenureState?.records.map((entry) => entry.roleId)).toStrictEqual(trackedRoles);
    expect(first.seamstressAbilityState?.instances).toHaveLength(trackedRoles.filter((role) => role === "seamstress").length);
  });

  it("[D19T-016..017, D19T-043] rejects orphan processed IDs and transition-started tenures as state failures", () => {
    const events = assignmentEventStream();
    const state = rebuildGameState(events);
    const factId = formatRoleTenureTransitionFactId({
      sourceEventSequence: 999,
      seatNumber: seatNumber(12),
      nextCharacterStateRevision: 2
    });
    const orphanProcessed: GameState = {
      ...state,
      seamstressRoleTenureState: {
        records: state.seamstressRoleTenureState?.records ?? [],
        processedTransitionFactIds: [factId]
      }
    };
    expectDomainCode(() => assertRebuiltCanonicalRoleTenureState(events, orphanProcessed), "InvalidRoleTenureState");

    const untracked = state.currentCharacterState?.entries.find((entry) =>
      !["cerenovus", "dreamer", "mathematician", "philosopher", "seamstress", "vortox"].includes(entry.role.roleId));
    if (untracked === undefined || state.seamstressRoleTenureState === undefined) {
      throw new Error("Expected untracked current character and role tenure state");
    }
    const orphanTenure: GameState = {
      ...state,
      seamstressRoleTenureState: {
        records: [...state.seamstressRoleTenureState.records, {
          roleTenureId: `role-tenure-v1:seat-${String(untracked.seatNumber).padStart(2, "0")}:role-dreamer:acquired-revision-2` as never,
          playerId: untracked.playerId,
          seatNumber: untracked.seatNumber,
          roleId: "dreamer" as const,
          acquiredCharacterStateRevision: 2,
          startedBy: {
            kind: "ROLE_TENURE_TRANSITION" as const,
            transitionFactId: factId,
            sourceEventId: eventId("orphan-transition"),
            sourceEventSequence: 999,
            previousCharacterStateRevision: 1,
            nextCharacterStateRevision: 2
          }
        }].sort((left, right) => left.acquiredCharacterStateRevision - right.acquiredCharacterStateRevision || left.seatNumber - right.seatNumber),
        processedTransitionFactIds: [factId]
      }
    };
    expectDomainCode(() => assertRebuiltCanonicalRoleTenureState(events, orphanTenure), "InvalidRoleTenureState");
  });

  it("[D19T-019] rejects accepted-history tenure provenance mismatches", () => {
    const events = assignmentEventStream();
    const state = rebuildGameState(events);
    if (state.assignment === undefined) throw new Error("Expected assignment authority");
    const assignmentMismatch: GameState = {
      ...state,
      assignment: {
        ...state.assignment,
        randomStream: `${state.assignment.randomStream}:tampered`
      }
    };
    expectDomainCode(
      () => assertRebuiltCanonicalRoleTenureState(events, assignmentMismatch),
      "InvalidRoleTenureState"
    );
    const records = state.seamstressRoleTenureState?.records;
    const dreamerIndex = records?.findIndex((entry) => entry.roleId === "dreamer") ?? -1;
    if (records === undefined || dreamerIndex < 0) throw new Error("Expected Dreamer tenure");
    const dreamer = records[dreamerIndex]!;
    const mutations = [
      { ...dreamer, playerId: playerId("provenance-mismatch") },
      { ...dreamer, seatNumber: seatNumber(dreamer.seatNumber === 1 ? 2 : 1) },
      { ...dreamer, roleId: "seamstress" as const },
      { ...dreamer, acquiredCharacterStateRevision: 2 },
      { ...dreamer, startedBy: { ...dreamer.startedBy, sourceEventId: eventId("provenance-mismatch") } },
      { ...dreamer, startedBy: { ...dreamer.startedBy, sourceEventSequence: 999 } }
    ];
    for (const mutation of mutations) {
      const tampered: GameState = {
        ...state,
        seamstressRoleTenureState: {
          records: records.map((record, index) => index === dreamerIndex ? mutation : record),
          processedTransitionFactIds: state.seamstressRoleTenureState?.processedTransitionFactIds ?? []
        }
      };
      expectDomainCode(() => assertRebuiltCanonicalRoleTenureState(events, tampered), "InvalidRoleTenureState");
    }
  });

  it("derives initial current character state from CharactersAssigned without changing the event payload", () => {
    const state = rebuildGameState(assignmentEventStream());

    expect(state.currentCharacterState?.revision).toBe(1);
    expect(state.currentCharacterState?.entries).toHaveLength(12);
    expect(state.currentCharacterState?.entries.map((entry) => entry.seatNumber)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(state.currentCharacterState?.entries.map((entry) => entry.currentAlignment)).toStrictEqual(
      state.assignment?.assignments.map((assignment) => assignment.role.defaultAlignment)
    );
    expect(state.currentCharacterState?.entries.map((entry) => entry.role)).toStrictEqual(
      state.assignment?.assignments.map((assignment) => assignment.role)
    );
    expect(Object.keys(charactersAssignedEvent().payload).sort()).not.toContain("currentCharacterState");
  });

  it("validates initial current character state against roster, setup, and assignment facts", () => {
    const state = rebuildGameState(assignmentEventStream());

    if (state.currentCharacterState === undefined || state.roster === undefined || state.assignment === undefined || state.setup === undefined) {
      throw new Error("Expected current character state source facts");
    }

    expect(validateInitialCurrentCharacterStateSet({
      currentCharacterState: state.currentCharacterState,
      roster: state.roster.entries,
      assignment: state.assignment.assignments,
      setup: state.setup
    })).toStrictEqual({ valid: true });
  });

  it("clones current character state without mutating assignment snapshots", () => {
    const state = rebuildGameState(assignmentEventStream());
    if (state.currentCharacterState === undefined || state.assignment === undefined) {
      throw new Error("Expected current character state and assignment");
    }

    const clone = cloneCurrentCharacterStateSet(state.currentCharacterState);
    const firstClonedRole = clone.entries[0]?.role;
    if (firstClonedRole === undefined) {
      throw new Error("Expected cloned current character state entry");
    }

    (firstClonedRole.setupModifier as { townsfolkDelta: number }).townsfolkDelta = 99;

    expect(state.currentCharacterState.entries[0]?.role.setupModifier.townsfolkDelta).not.toBe(99);
    expect(state.assignment.assignments[0]?.role.setupModifier.townsfolkDelta).not.toBe(99);
  });

  it("resolves the current evil team from current character state", () => {
    const state = rebuildGameState(assignmentEventStream());
    if (state.currentCharacterState === undefined || state.roster === undefined) {
      throw new Error("Expected current character state and roster");
    }

    const result = resolveCurrentEvilTeam({
      currentCharacterState: state.currentCharacterState,
      roster: state.roster.entries
    });

    expect(result.status).toBe("success");
    if (result.status === "failure") {
      throw new Error(result.message);
    }
    expect(result.team.characterStateRevision).toBe(1);
    expect(result.team.demon.playerId).toBe(state.currentCharacterState.entries.find((entry) => entry.role.characterType === "DEMON")?.playerId);
    expect(result.team.minions).toHaveLength(2);
    expect(result.team.minions.map((minion) => minion.seatNumber)).toStrictEqual(
      [...result.team.minions].map((minion) => minion.seatNumber).sort((left, right) => left - right)
    );
  });

  it("resolves a simulated current role swap from current character state instead of assignment", () => {
    const state = rebuildGameState(assignmentEventStream());
    if (state.currentCharacterState === undefined || state.roster === undefined) {
      throw new Error("Expected current character state and roster");
    }

    const originalDemon = state.currentCharacterState.entries.find((entry) => entry.role.characterType === "DEMON");
    const originalMinion = state.currentCharacterState.entries.find((entry) => entry.role.characterType === "MINION");
    if (originalDemon === undefined || originalMinion === undefined) {
      throw new Error("Expected demon and minion current character states");
    }

    const swapped = {
      revision: 2,
      entries: state.currentCharacterState.entries.map((entry) => {
        if (entry.playerId === originalDemon.playerId) {
          return { ...entry, role: originalMinion.role, currentAlignment: originalMinion.role.defaultAlignment };
        }
        if (entry.playerId === originalMinion.playerId) {
          return { ...entry, role: originalDemon.role, currentAlignment: originalDemon.role.defaultAlignment };
        }
        return entry;
      })
    };

    const result = resolveCurrentEvilTeam({
      currentCharacterState: swapped,
      roster: state.roster.entries
    });

    expect(result.status).toBe("success");
    if (result.status === "failure") {
      throw new Error(result.message);
    }
    expect(result.team.characterStateRevision).toBe(2);
    expect(result.team.demon.playerId).toBe(originalMinion.playerId);
    expect(result.team.demon.playerId).not.toBe(originalDemon.playerId);
  });

  it("rebuilds first night initialization and initial private knowledge while staying in FIRST_NIGHT", () => {
    const state = rebuildGameState(firstNightEventStream());

    expect(state.phase).toBe("FIRST_NIGHT");
    expect(state.dayNumber).toBe(0);
    expect(state.nightNumber).toBe(1);
    expect(state.gameVersion).toBe(6);
    expect(state.lastEventSequence).toBe(10);
    expect(state.firstNight?.initializationVersion).toBe("first-night-initialization-v1");
    expect(state.initialPrivateKnowledge?.knowledgeModelVersion).toBe("initial-own-character-knowledge-v1");
    expect(state.initialPrivateKnowledge?.knowledgeStage).toBe("OWN_CHARACTER_BOOTSTRAP");
    expect(state.initialPrivateKnowledge?.entries).toHaveLength(12);
    expect(state.initialPrivateKnowledge?.entries.filter((entry) => entry.kind === "OWN_CHARACTER")).toHaveLength(12);
    expect(JSON.stringify(state.initialPrivateKnowledge?.entries)).not.toContain("DEMON_IDENTITY");
    expect(JSON.stringify(state.initialPrivateKnowledge?.entries)).not.toContain("MINION_IDENTITIES");
    expect(JSON.stringify(state.initialPrivateKnowledge?.entries)).not.toContain("DEMON_BLUFFS");
  });

  it("rejects bare first night initialization during replay", () => {
    expectDomainCode(
      () => rebuildGameState([...assignmentEventStream(), firstNightInitializedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects initial private knowledge without FirstNightInitialized during replay", () => {
    const knowledge = initialPrivateKnowledgeEstablishedEvent({
      eventId: eventId("event-9-private-knowledge"),
      eventSequence: 9
    });

    expectDomainCode(() => rebuildGameState([...assignmentEventStream(), knowledge]), "InvalidDomainBatchSemantics");
  });

  it("rejects reversed first night initialization event order during replay", () => {
    const knowledge = initialPrivateKnowledgeEstablishedEvent({
      eventId: eventId("event-9-private-knowledge"),
      eventSequence: 9
    });
    const initialized = firstNightInitializedEvent({
      eventId: eventId("event-10-first-night"),
      eventSequence: 10
    });

    expectDomainCode(() => rebuildGameState([...assignmentEventStream(), knowledge, initialized]), "InvalidDomainBatchSemantics");
  });

  it("rejects first night metadata that does not match assignment facts", () => {
    const initialized = firstNightInitializedEvent({
      payload: {
        ...firstNightInitializedEvent().payload,
        assignmentAlgorithmVersion: "unsupported-assignment"
      }
    });

    expectDomainCode(
      () => rebuildGameState(firstNightEventStream(initialized)),
      "InvalidFirstNightInitializedPayload"
    );
  });

  it("rejects non-canonical initial private knowledge entry order", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const first = payload.entries[0];
    const second = payload.entries[1];
    if (first === undefined || second === undefined) {
      throw new Error("Expected initial private knowledge entries");
    }

    const knowledge = initialPrivateKnowledgeEstablishedEvent({
      payload: {
        ...payload,
        entries: [second, first, ...payload.entries.slice(2)]
      }
    });

    expectDomainCode(() => rebuildGameState(firstNightEventStream(firstNightInitializedEvent(), knowledge)), "InvalidInitialPrivateKnowledgeEstablishedPayload");
  });

  it("rejects OWN_CHARACTER entries that do not match character assignment", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const firstOwnIndex = payload.entries.findIndex((entry) => entry.kind === "OWN_CHARACTER");
    const secondOwn = payload.entries.find((entry, index) => index !== firstOwnIndex && entry.kind === "OWN_CHARACTER");
    const firstOwn = payload.entries[firstOwnIndex];
    if (firstOwn === undefined || firstOwn.kind !== "OWN_CHARACTER" || secondOwn === undefined || secondOwn.kind !== "OWN_CHARACTER") {
      throw new Error("Expected two own-character entries");
    }

    const entries = [...payload.entries];
    entries[firstOwnIndex] = {
      ...firstOwn,
      role: secondOwn.role
    };
    const knowledge = initialPrivateKnowledgeEstablishedEvent({
      payload: {
        ...payload,
        entries
      }
    });

    expectDomainCode(() => rebuildGameState(firstNightEventStream(firstNightInitializedEvent(), knowledge)), "InvalidInitialPrivateKnowledgeEstablishedPayload");
  });

  it("rejects DEMON_IDENTITY during own-character bootstrap even with hidden role fields", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const demon = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "DEMON");
    const minion = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "MINION");
    if (demon === undefined || minion === undefined) {
      throw new Error("Expected demon and minion assignments");
    }

    const entries = [...payload.entries] as unknown[];
    const targetIndex = payload.entries.findIndex((entry) => entry.recipientPlayerId === minion.playerId);
    entries[targetIndex] = {
      kind: "DEMON_IDENTITY",
      recipientPlayerId: minion.playerId,
      demon: {
        playerId: demon.playerId,
        seatNumber: demon.seatNumber,
        roleId: roleId("vigormortis")
      }
    };

    expectInitialKnowledgePayloadRejected({ ...payload, entries });
  });

  it("rejects DEMON_BLUFFS during own-character bootstrap even when structurally valid", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const demon = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "DEMON");
    if (demon === undefined) {
      throw new Error("Expected demon assignment");
    }

    const entries = [...payload.entries] as unknown[];
    const targetIndex = payload.entries.findIndex((entry) => entry.recipientPlayerId === demon.playerId);
    entries[targetIndex] = {
      kind: "DEMON_BLUFFS",
      recipientPlayerId: demon.playerId,
      roles: setupGeneratedEvent().payload.demonBluffs
    };

    expectInitialKnowledgePayloadRejected({ ...payload, entries });
  });

  it.each([
    [
      "DEMON_IDENTITY",
      (payload: InitialKnowledgePayload): readonly unknown[] => {
        const demon = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "DEMON");
        const minion = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "MINION");
        if (demon === undefined || minion === undefined) {
          throw new Error("Expected demon and minion assignments");
        }

        const entries = [...payload.entries] as unknown[];
        const targetIndex = payload.entries.findIndex((entry) => entry.recipientPlayerId === minion.playerId);
        entries[targetIndex] = {
          kind: "DEMON_IDENTITY",
          recipientPlayerId: minion.playerId,
          demon: { playerId: demon.playerId, seatNumber: demon.seatNumber }
        };
        return entries;
      }
    ],
    [
      "MINION_IDENTITIES",
      (payload: InitialKnowledgePayload): readonly unknown[] => {
        const minions = charactersAssignedEvent().payload.assignments.filter((assignment) => assignment.role.characterType === "MINION");
        const [recipient, visible] = minions;
        if (recipient === undefined || visible === undefined) {
          throw new Error("Expected two minion assignments");
        }

        const entries = [...payload.entries] as unknown[];
        const targetIndex = payload.entries.findIndex((entry) => entry.recipientPlayerId === recipient.playerId);
        entries[targetIndex] = {
          kind: "MINION_IDENTITIES",
          recipientPlayerId: recipient.playerId,
          minions: [{ playerId: visible.playerId, seatNumber: visible.seatNumber }]
        };
        return entries;
      }
    ],
    [
      "DEMON_BLUFFS",
      (payload: InitialKnowledgePayload): readonly unknown[] => {
        const demon = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "DEMON");
        if (demon === undefined) {
          throw new Error("Expected demon assignment");
        }

        const entries = [...payload.entries] as unknown[];
        const targetIndex = payload.entries.findIndex((entry) => entry.recipientPlayerId === demon.playerId);
        entries[targetIndex] = {
          kind: "DEMON_BLUFFS",
          recipientPlayerId: demon.playerId,
          roles: setupGeneratedEvent().payload.demonBluffs
        };
        return entries;
      }
    ]
  ])("rejects structurally valid but not-yet-delivered %s during own-character bootstrap", (_kind, buildEntries) => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const error = expectInitialKnowledgePayloadRejected({
      ...payload,
      entries: buildEntries(payload)
    });

    expect(error.message).toContain("not yet delivered");
  });

  it.each([
    [
      "FULL_SECRET_DUMP replay",
      (payload: InitialKnowledgePayload): readonly unknown[] => [
        {
          kind: "FULL_SECRET_DUMP",
          recipientPlayerId: payload.entries[0]?.recipientPlayerId,
          fullAssignments: charactersAssignedEvent().payload.assignments
        },
        ...payload.entries
      ]
    ],
    [
      "unknown kind in a legal recipient block",
      (payload: InitialKnowledgePayload): readonly unknown[] => [
        payload.entries[0],
        {
          kind: "FULL_SECRET_DUMP",
          recipientPlayerId: payload.entries[0]?.recipientPlayerId,
          debugSecrets: setupGeneratedEvent().payload.roleCatalogSnapshot
        },
        ...payload.entries.slice(1)
      ]
    ],
    [
      "unknown kind at entries end",
      (payload: InitialKnowledgePayload): readonly unknown[] => [
        ...payload.entries,
        {
          kind: "FULL_SECRET_DUMP",
          recipientPlayerId: payload.entries.at(-1)?.recipientPlayerId,
          storytellerView: setupGeneratedEvent().payload
        }
      ]
    ],
    [
      "unknown kind before sorting",
      (payload: InitialKnowledgePayload): readonly unknown[] => [
        payload.entries[0],
        {
          kind: "ZZZ_SECRET_KIND",
          recipientPlayerId: payload.entries[0]?.recipientPlayerId
        },
        ...payload.entries.slice(1)
      ]
    ]
  ])("rejects unknown initial private knowledge kind: %s", (_name, buildEntries) => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const error = expectInitialKnowledgePayloadRejected({
      ...payload,
      entries: buildEntries(payload)
    });

    expect(error.message).toContain("unknown initial private knowledge kind");
  });

  it("returns DomainError instead of TypeError for unknown initial private knowledge kind", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const error = expectInitialKnowledgePayloadRejected({
      ...payload,
      entries: [
        {
          kind: "FULL_SECRET_DUMP",
          recipientPlayerId: payload.entries[0]?.recipientPlayerId
        },
        ...payload.entries
      ]
    });

    expect(error).toBeInstanceOf(DomainError);
    expect(error.name).toBe("DomainError");
  });

  it.each([
    ["null entry", null],
    ["string entry", "not-an-entry"],
    ["array entry", []],
    ["missing kind", { recipientPlayerId: playerRosterCreatedEvent().payload.entries[0]?.playerId }],
    ["missing recipientPlayerId", { kind: "OWN_CHARACTER", role: charactersAssignedEvent().payload.assignments[0]?.role }]
  ])("rejects damaged initial private knowledge entry: %s", (_name, damagedEntry) => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    expectInitialKnowledgePayloadRejected({
      ...payload,
      entries: [damagedEntry, ...payload.entries.slice(1)]
    });
  });

  it("rejects sparse initial private knowledge entries arrays", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const entries = new Array<unknown>(payload.entries.length);
    for (const [index, entry] of payload.entries.entries()) {
      if (index !== 1) {
        entries[index] = entry;
      }
    }

    expectInitialKnowledgePayloadRejected({
      ...payload,
      entries
    });
  });

  it.each([
    [
      "DEMON_IDENTITY demonRole",
      (payload: InitialKnowledgePayload): readonly unknown[] => {
        const demon = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "DEMON");
        const minion = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "MINION");
        if (demon === undefined || minion === undefined) {
          throw new Error("Expected demon and minion assignments");
        }

        const entries = [...payload.entries] as unknown[];
        const targetIndex = payload.entries.findIndex((entry) => entry.recipientPlayerId === minion.playerId);
        entries[targetIndex] = {
          kind: "DEMON_IDENTITY",
          recipientPlayerId: minion.playerId,
          demon: { playerId: demon.playerId, seatNumber: demon.seatNumber },
          demonRole: demon.role
        };
        return entries;
      }
    ],
    [
      "MINION_IDENTITIES minionRoles",
      (payload: InitialKnowledgePayload): readonly unknown[] => {
        const minions = charactersAssignedEvent().payload.assignments.filter((assignment) => assignment.role.characterType === "MINION");
        const [recipient, visible] = minions;
        if (recipient === undefined || visible === undefined) {
          throw new Error("Expected two minion assignments");
        }

        const entries = [...payload.entries] as unknown[];
        const targetIndex = payload.entries.findIndex((entry) => entry.recipientPlayerId === recipient.playerId);
        entries[targetIndex] = {
          kind: "MINION_IDENTITIES",
          recipientPlayerId: recipient.playerId,
          minions: [{ playerId: visible.playerId, seatNumber: visible.seatNumber }],
          minionRoles: minions.map((assignment) => assignment.role)
        };
        return entries;
      }
    ],
    [
      "OWN_CHARACTER allAssignments",
      (payload: InitialKnowledgePayload): readonly unknown[] => payload.entries.map((entry) =>
        entry.kind === "OWN_CHARACTER"
          ? { ...entry, allAssignments: charactersAssignedEvent().payload.assignments }
          : entry
      )
    ],
    [
      "DEMON_BLUFFS storytellerNotes",
      (payload: InitialKnowledgePayload): readonly unknown[] => {
        const demon = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "DEMON");
        if (demon === undefined) {
          throw new Error("Expected demon assignment");
        }

        const entries = [...payload.entries] as unknown[];
        const targetIndex = payload.entries.findIndex((entry) => entry.recipientPlayerId === demon.playerId);
        entries[targetIndex] = {
          kind: "DEMON_BLUFFS",
          recipientPlayerId: demon.playerId,
          roles: setupGeneratedEvent().payload.demonBluffs,
          storytellerNotes: "hidden note"
        };
        return entries;
      }
    ],
    [
      "KnownPlayerReference roleId",
      (payload: InitialKnowledgePayload): readonly unknown[] => {
        const demon = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "DEMON");
        const minion = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "MINION");
        if (demon === undefined || minion === undefined) {
          throw new Error("Expected demon and minion assignments");
        }

        const entries = [...payload.entries] as unknown[];
        const targetIndex = payload.entries.findIndex((entry) => entry.recipientPlayerId === minion.playerId);
        entries[targetIndex] = {
          kind: "DEMON_IDENTITY",
          recipientPlayerId: minion.playerId,
          demon: { playerId: demon.playerId, seatNumber: demon.seatNumber, roleId: roleId("vigormortis") }
        };
        return entries;
      }
    ],
    [
      "RoleSetupSnapshot actualAlignment",
      (payload: InitialKnowledgePayload): readonly unknown[] => payload.entries.map((entry) =>
        entry.kind === "OWN_CHARACTER"
          ? { ...entry, role: { ...entry.role, actualAlignment: "EVIL" } }
          : entry
      )
    ],
    [
      "setupModifier unknown field",
      (payload: InitialKnowledgePayload): readonly unknown[] => payload.entries.map((entry) =>
        entry.kind === "OWN_CHARACTER"
          ? { ...entry, role: { ...entry.role, setupModifier: { ...entry.role.setupModifier, leakedDelta: 1 } } }
          : entry
      )
    ]
  ])("rejects extra hidden field in private knowledge shape: %s", (_name, buildEntries) => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;

    expectInitialKnowledgePayloadRejected({
      ...payload,
      entries: buildEntries(payload)
    });
  });

  it.each([
    ["null KnownPlayerReference", null],
    ["string KnownPlayerReference", "ai-seat-01"],
    ["array KnownPlayerReference", []],
    ["missing seatNumber", { playerId: playerRosterCreatedEvent().payload.entries[0]?.playerId }],
    ["wrong seatNumber", { playerId: playerRosterCreatedEvent().payload.entries[0]?.playerId, seatNumber: 13 }]
  ])("rejects damaged KnownPlayerReference shape: %s", (_name, damagedReference) => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const minion = charactersAssignedEvent().payload.assignments.find((assignment) => assignment.role.characterType === "MINION");
    if (minion === undefined) {
      throw new Error("Expected minion assignment");
    }
    const entries = [...payload.entries] as unknown[];
    const targetIndex = payload.entries.findIndex((entry) => entry.recipientPlayerId === minion.playerId);
    entries[targetIndex] = {
      kind: "DEMON_IDENTITY",
      recipientPlayerId: minion.playerId,
      demon: damagedReference
    };

    expectInitialKnowledgePayloadRejected({
      ...payload,
      entries
    });
  });

  it("rejects InitialPrivateKnowledgeEstablished payloads with extra hidden fields", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;

    expectInitialKnowledgePayloadRejected({
      ...payload,
      fullAssignments: charactersAssignedEvent().payload.assignments
    });
  });

  it("rejects InitialPrivateKnowledgeEstablished payloads with missing required fields", () => {
    const payloadWithoutEntries = Object.fromEntries(
      Object.entries(initialPrivateKnowledgeEstablishedEvent().payload).filter(([key]) => key !== "entries")
    );

    expectInitialKnowledgePayloadRejected(payloadWithoutEntries);
  });

  it("rejects FirstNightInitialized payloads with extra hidden fields", () => {
    const payload = firstNightInitializedEvent().payload;

    expectFirstNightPayloadRejected({
      ...payload,
      debugSecrets: setupGeneratedEvent().payload
    });
  });

  it("rejects FirstNightInitialized payloads with missing required fields", () => {
    const payloadWithoutSignature = Object.fromEntries(
      Object.entries(firstNightInitializedEvent().payload).filter(([key]) => key !== "roleCatalogSignature")
    );

    expectFirstNightPayloadRejected(payloadWithoutSignature);
  });

  it("rejects CHARACTERS_ASSIGNED transition when assignment fact is missing", () => {
    const state = rebuildGameState(rosterEventStream());

    expectDomainCode(
      () => applyDomainEvent(state, charactersAssignedPhaseTransitionedEvent({ eventSequence: 7 })),
      "MissingTransitionPrerequisite"
    );
  });

  it("rejects duplicate CharactersAssigned facts", () => {
    const assignedState = applyDomainEvent(rebuildGameState(rosterEventStream()), charactersAssignedEvent());

    expectDomainCode(() => applyDomainEvent(assignedState, charactersAssignedEvent({ eventSequence: 8 })), "DuplicateCharactersAssigned");
  });

  it("rejects CharactersAssigned with an unsupported assignment algorithm version", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => ({
      ...payload,
      assignmentAlgorithmVersion: "unsupported-assignment-version"
    }));

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned with an unsupported random stream", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => ({
      ...payload,
      randomStream: "unsupported-assignment-stream"
    }));

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned with a role catalog signature mismatch", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => ({
      ...payload,
      roleCatalogSignature: "tampered-role-catalog-signature"
    }));

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned when rosterVersion differs from the applied roster", () => {
    const state = rebuildGameState(rosterEventStream());
    if (state.roster === undefined) {
      throw new Error("Expected roster state");
    }

    const stateWithFutureRosterVersion = {
      ...state,
      roster: {
        ...state.roster,
        rosterVersion: "future-roster-version"
      }
    };

    expectDomainCode(() => applyDomainEvent(stateWithFutureRosterVersion, charactersAssignedEvent()), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned when player and seat do not match the roster", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => {
      const [first, ...rest] = payload.assignments;
      if (first === undefined) {
        throw new Error("test assignment missing first entry");
      }

      return {
        ...payload,
        assignments: [
          {
            ...first,
            playerId: playerId("unknown-player")
          },
          ...rest
        ]
      };
    });

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned with duplicate role ids", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => {
      const first = payload.assignments[0];
      const second = payload.assignments[1];
      if (first === undefined || second === undefined) {
        throw new Error("test assignment missing entries");
      }

      return {
        ...payload,
        assignments: [first, { ...second, role: first.role }, ...payload.assignments.slice(2)]
      };
    });

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned with role snapshots that do not match setup.actualRoles", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => {
      const [first, ...rest] = payload.assignments;
      if (first === undefined) {
        throw new Error("test assignment missing first entry");
      }

      return {
        ...payload,
        assignments: [
          {
            ...first,
            role: {
              ...first.role,
              setupModifier: {
                ...first.role.setupModifier,
                outsiderDelta: first.role.setupModifier.outsiderDelta + 1
              }
            }
          },
          ...rest
        ]
      };
    });

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned when assignments are not sorted by seat", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => {
      const first = payload.assignments[0];
      const second = payload.assignments[1];
      if (first === undefined || second === undefined) {
        throw new Error("test assignment missing entries");
      }

      return {
        ...payload,
        assignments: [second, first, ...payload.assignments.slice(2)]
      };
    });

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rebuilds FirstNightTaskPlanCreated and keeps the game in FIRST_NIGHT", () => {
    const state = rebuildGameState(firstNightTaskPlanEventStream());

    expect(state.firstNightTaskPlan).toBeDefined();
    expect(state.firstNightTaskPlan?.tasks.map((task) => task.status)).toEqual(expect.arrayContaining(["PENDING"]));
    expect(state.phase).toBe("FIRST_NIGHT");
    expect(state.nightNumber).toBe(1);
    expect(state.dayNumber).toBe(0);
  });

  it("rejects FirstNightTaskPlanCreated before first-night knowledge exists", () => {
    expectDomainCode(
      () => rebuildGameState([
        ...assignmentEventStream(),
        firstNightTaskPlanCreatedEvent({
          eventSequence: 9,
          batchId: batchId("batch-invalid-task-plan"),
          gameVersion: 6
        })
      ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects duplicate FirstNightTaskPlanCreated facts", () => {
    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        firstNightTaskPlanCreatedEvent({
          eventId: eventId("event-12"),
          eventSequence: 12,
          batchId: batchId("batch-8"),
          gameVersion: 8
        })
      ]),
      "DuplicateCommandBatch"
    );
  });

  it("rejects FirstNightTaskPlanCreated payloads with extra fields or sparse tasks", () => {
    const payload = firstNightTaskPlanCreatedEvent().payload;

    expectFirstNightTaskPlanPayloadRejected({ ...payload, currentTask: "forbidden" });

    const sparseTasks = new Array(payload.tasks.length) as unknown[];
    for (const [index, task] of payload.tasks.entries()) {
      if (index !== 1) {
        sparseTasks[index] = task;
      }
    }
    expectFirstNightTaskPlanPayloadRejected({ ...payload, tasks: sparseTasks });
  });

  it("rejects task catalog signature, missing system task, duplicate system task, and malformed task ids", () => {
    const payload = firstNightTaskPlanCreatedEvent().payload;
    const minionTask = payload.tasks.find((task) => task.taskType === "MINION_INFO");
    const demonTask = payload.tasks.find((task) => task.taskType === "DEMON_INFO");
    if (minionTask === undefined || demonTask === undefined) {
      throw new Error("test plan missing system tasks");
    }

    expectFirstNightTaskPlanPayloadRejected({ ...payload, taskCatalogSignature: "canonical-first-night-task-catalog-v1:00000000" });
    expectFirstNightTaskPlanPayloadRejected({ ...payload, tasks: payload.tasks.filter((task) => task.taskType !== "MINION_INFO") });
    expectFirstNightTaskPlanPayloadRejected({
      ...payload,
      tasks: payload.tasks.map((task) => task.taskType === "DEMON_INFO" ? { ...minionTask, taskId: "first-night-v1:MINION_INFO:system-copy" } : task)
    });
    expectFirstNightTaskPlanPayloadRejected({
      ...payload,
      tasks: payload.tasks.map((task) => task.taskType === "MINION_INFO" ? { ...task, taskId: "bad-task-id" } : task)
    });
  });

  it("rejects role task omission, role source mismatch, and tasks for unsupported in-play roles", () => {
    const payload = firstNightTaskPlanCreatedEvent().payload;
    const roleTask = payload.tasks.find((task) => task.source.kind === "ROLE");
    if (roleTask === undefined || roleTask.source.kind !== "ROLE") {
      throw new Error("test plan missing role task");
    }

    const roleSource = roleTask.source;
    const plannedRoleIds = new Set(payload.tasks
      .filter((task) => task.source.kind === "ROLE")
      .map((task) => task.source.kind === "ROLE" ? task.source.role.roleId : ""));
    const unsupportedAssignment = charactersAssignedEvent().payload.assignments.find((assignment) => !plannedRoleIds.has(assignment.role.roleId));
    if (unsupportedAssignment === undefined) {
      throw new Error("test assignment missing unsupported role");
    }

    expectFirstNightTaskPlanPayloadRejected({ ...payload, tasks: payload.tasks.filter((task) => task.taskType !== roleTask.taskType) });
    expectFirstNightTaskPlanPayloadRejected({
      ...payload,
      tasks: payload.tasks.map((task) => task.taskId === roleTask.taskId
        ? { ...task, source: { ...roleSource, seatNumber: roleSource.seatNumber === 1 ? 2 : 1 } }
        : task)
    });
    expectFirstNightTaskPlanPayloadRejected({
      ...payload,
      tasks: [
        ...payload.tasks,
        {
          ...roleTask,
          taskId: `first-night-v1:${roleTask.taskType}:seat-${String(unsupportedAssignment.seatNumber).padStart(2, "0")}`,
          source: {
            kind: "ROLE",
            playerId: unsupportedAssignment.playerId,
            seatNumber: unsupportedAssignment.seatNumber,
            role: unsupportedAssignment.role
          }
        }
      ]
    });
  });

  it("rejects system task hidden recipients, duplicate ids, wrong order, nonzero insertion, non-PENDING status, and task extra fields", () => {
    const payload = firstNightTaskPlanCreatedEvent().payload;
    const [firstTask, secondTask] = payload.tasks;
    const systemTask = payload.tasks.find((task) => task.source.kind === "SYSTEM");
    if (firstTask === undefined || secondTask === undefined || systemTask === undefined) {
      throw new Error("test plan missing tasks");
    }

    expectFirstNightTaskPlanPayloadRejected({
      ...payload,
      tasks: payload.tasks.map((task) => task.taskId === systemTask.taskId
        ? { ...task, source: { ...task.source, playerId: "player-hidden" } }
        : task)
    });
    expectFirstNightTaskPlanPayloadRejected({
      ...payload,
      tasks: payload.tasks.map((task) => task.taskId === systemTask.taskId
        ? { ...task, source: { ...task.source, recipientPlayerIds: ["player-hidden"] } }
        : task)
    });
    expectFirstNightTaskPlanPayloadRejected({ ...payload, tasks: [firstTask, { ...secondTask, taskId: firstTask.taskId }, ...payload.tasks.slice(2)] });
    expectFirstNightTaskPlanPayloadRejected({ ...payload, tasks: [secondTask, firstTask, ...payload.tasks.slice(2)] });
    expectFirstNightTaskPlanPayloadRejected({
      ...payload,
      tasks: payload.tasks.map((task) => task.taskId === firstTask.taskId ? { ...task, orderKey: { ...task.orderKey, insertionOrder: 1 } } : task)
    });
    expectFirstNightTaskPlanPayloadRejected({
      ...payload,
      tasks: payload.tasks.map((task) => task.taskId === firstTask.taskId ? { ...task, status: "SETTLED" } : task)
    });
    expectFirstNightTaskPlanPayloadRejected({
      ...payload,
      tasks: payload.tasks.map((task) => task.taskId === firstTask.taskId ? { ...task, finalLegalTargets: [] } : task)
    });
  });

  it("rebuilds settled MINION_INFO and DEMON_INFO as ordered two-event batches", () => {
    const state = rebuildGameState([
      ...noPhilosopherTaskPlanEventStream(),
      minionInformationDeliveredEvent(),
      minionTaskSettledEvent(),
      demonInformationDeliveredEvent(),
      demonTaskSettledEvent()
    ]);

    expect(state.phase).toBe("FIRST_NIGHT");
    expect(state.minionInformation?.entries).toHaveLength(4);
    expect(state.demonInformation?.entries).toHaveLength(2);
    expect(state.firstNightTaskProgress?.settlements.map((settlement) => settlement.taskType)).toStrictEqual([
      "MINION_INFO",
      "DEMON_INFO"
    ]);
    expect(state.gameVersion).toBe(9);
    expect(state.lastEventSequence).toBe(15);
  });

  it("rebuilds Philosopher first-night action opportunity creation without settling the task", () => {
    const state = rebuildGameState([
      ...firstNightTaskPlanEventStream(),
      philosopherActionOpportunityCreatedEvent()
    ]);

    expect(state.firstNightActionOpportunities?.opportunities).toHaveLength(1);
    expect(state.firstNightActionOpportunities?.opportunities[0]).toMatchObject({
      opportunityId: "first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01",
      opportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: "first-night-v1:PHILOSOPHER_ACTION:seat-10",
      taskType: "PHILOSOPHER_ACTION",
      sourceSeatNumber: 10,
      sourceCharacterStateRevision: 1,
      visibility: {
        canDefer: true,
        supportedDecisionKinds: ["DEFER", "CHOOSE_GOOD_CHARACTER"],
        futureUnsupportedDecisionKinds: []
      }
    });
    expect(state.firstNightTaskProgress?.settlements).toBeUndefined();
  });

  it("[R4-T01] emits a PhilosopherActionDeferred ledger SOURCE_EVENT fact", () => {
    const state = rebuildGameState([
      ...firstNightTaskPlanEventStream(),
      philosopherActionOpportunityCreatedEvent(),
      philosopherActionDeferredEvent(),
      philosopherTaskSettledEvent()
    ]);

    expect(state.firstNightActionOpportunities?.opportunities[0]?.opportunityStatus).toBe("CLOSED");
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)?.evidenceReferences.find((entry) => entry.kind === "SOURCE_EVENT"))
      .toMatchObject({ kind: "SOURCE_EVENT", eventType: "PhilosopherActionDeferred" });
    expect(state.firstNightTaskProgress?.settlements).toStrictEqual([
      {
        taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-10"),
        taskType: "PHILOSOPHER_ACTION",
        nightNumber: 1,
        settlementVersion: "scheduled-task-settlement-v1",
        outcomeType: "PHILOSOPHER_DEFERRED",
        characterStateRevision: 1
      }
    ]);
    expect(state.gameVersion).toBe(9);
    expect(state.lastEventSequence).toBe(14);
  });

  it("[R4-T02] emits a PhilosopherAbilityGranted ledger SOURCE_EVENT fact", () => {
    const chosenRole = absentNonInsertingGoodRole();
    const state = rebuildGameState([
      ...firstNightTaskPlanEventStream(),
      philosopherActionOpportunityCreatedEvent(),
      ...philosopherAbilityChoiceBatchEvents({ chosenRole })
    ]);

    expect(state.philosopherAbilityChoices?.choices[0]).toMatchObject({
      taskId: "first-night-v1:PHILOSOPHER_ACTION:seat-10",
      decisionKind: "CHOOSE_GOOD_CHARACTER",
      sourceSeatNumber: 10,
      chosenRoleId: chosenRole.roleId
    });
    expect(state.philosopherGrantedAbilities?.abilities[0]).toMatchObject({
      grantId: `philosopher-grant-v1:seat-10:from-${chosenRole.roleId}`,
      chosenRoleId: chosenRole.roleId,
      grantedAtTaskId: "first-night-v1:PHILOSOPHER_ACTION:seat-10"
    });
    expect(state.abilityImpairments?.impairments).toBeUndefined();
    expect(state.firstNightTaskInsertions?.insertions).toBeUndefined();
    expect(state.firstNightActionOpportunities?.opportunities[0]?.opportunityStatus).toBe("CLOSED");
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)?.evidenceReferences.find((entry) => entry.kind === "SOURCE_EVENT"))
      .toMatchObject({ kind: "SOURCE_EVENT", eventType: "PhilosopherAbilityGranted" });
    expect(state.firstNightTaskProgress?.settlements).toStrictEqual([
      {
        taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-10"),
        taskType: "PHILOSOPHER_ACTION",
        nightNumber: 1,
        settlementVersion: "scheduled-task-settlement-v1",
        outcomeType: "PHILOSOPHER_ABILITY_CHOSEN",
        characterStateRevision: 1
      }
    ]);
    expect(state.currentCharacterState?.entries.find((entry) => entry.seatNumber === 10)?.role.roleId).toBe("philosopher");
    expect(state.assignment?.assignments.find((entry) => entry.seatNumber === 10)?.role.roleId).toBe("philosopher");
    expect(state.gameVersion).toBe(9);
    expect(state.lastEventSequence).toBe(15);
  });

  it("rebuilds Philosopher duplicate impairment and gained first-night task insertion", () => {
    const state = rebuildGameState([
      ...firstNightTaskPlanEventStream(),
      philosopherActionOpportunityCreatedEvent(),
      ...philosopherAbilityChoiceBatchEvents({
        chosenRole: roleSnapshotById("snake_charmer"),
        includeImpairment: true,
        includeInsertion: true
      })
    ]);

    expect(state.abilityImpairments?.impairments[0]).toMatchObject({
      kind: "DRUNK",
      sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
      chosenRoleId: "snake_charmer",
      sourceCharacterStateRevision: 1
    });
    expect(state.firstNightTaskInsertions?.insertions[0]).toMatchObject({
      taskId: "first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-snake_charmer",
      taskType: "SNAKE_CHARMER_ACTION",
      taskClass: "ROLE_ACTION",
      status: "PENDING",
      insertionReason: "PHILOSOPHER_GAINED_ABILITY",
      insertedByOpportunityId: "first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01"
    });
    expect(state.firstNightTaskPlan?.tasks.slice(0, 3).map((task) => task.taskType)).toStrictEqual([
      "PHILOSOPHER_ACTION",
      "SNAKE_CHARMER_ACTION",
      "MINION_INFO"
    ]);
    expect(state.firstNightTaskProgress?.settlements[0]?.outcomeType).toBe("PHILOSOPHER_ABILITY_CHOSEN");
    expect(state.currentCharacterState?.entries.find((entry) => entry.seatNumber === 10)?.role.roleId).toBe("philosopher");
    expect(state.assignment?.assignments.find((entry) => entry.seatNumber === 10)?.role.roleId).toBe("philosopher");
    expect(state.lastEventSequence).toBe(17);
  });

  it("validates runtime first-night task plans with only real inserted tasks", () => {
    const state = rebuildGameState([
      ...firstNightTaskPlanEventStream(),
      philosopherActionOpportunityCreatedEvent(),
      ...philosopherAbilityChoiceBatchEvents({
        chosenRole: roleSnapshotById("snake_charmer"),
        includeImpairment: true,
        includeInsertion: true
      })
    ]);
    if (
      state.setup === undefined ||
      state.roster === undefined ||
      state.assignment === undefined ||
      state.firstNight === undefined ||
      state.initialPrivateKnowledge === undefined ||
      state.firstNightTaskPlan === undefined ||
      state.firstNightTaskInsertions?.insertions[0] === undefined
    ) {
      throw new Error("Expected runtime first-night task plan facts");
    }

    const sourceFacts = {
      setup: state.setup,
      roster: state.roster.entries,
      assignment: state.assignment.assignments,
      firstNight: state.firstNight,
      initialPrivateKnowledge: state.initialPrivateKnowledge
    };
    const insertedTask = scheduledTaskFromFirstNightTaskInsertedPayload(state.firstNightTaskInsertions.insertions[0]);

    expect(validateFirstNightTaskPlanCreatedPayload(state.firstNightTaskPlan, sourceFacts)).toMatchObject({
      valid: false
    });
    expect(validateFirstNightTaskPlanRuntimeState(state.firstNightTaskPlan, {
      sourceFacts,
      insertedTasks: [insertedTask]
    })).toStrictEqual({ valid: true });

    const forgedPlan = {
      ...state.firstNightTaskPlan,
      tasks: state.firstNightTaskPlan.tasks
    };
    expect(validateFirstNightTaskPlanRuntimeState(forgedPlan, {
      sourceFacts,
      insertedTasks: []
    })).toMatchObject({ valid: false });

    const wrongOrderPlan = {
      ...state.firstNightTaskPlan,
      tasks: [
        ...state.firstNightTaskPlan.tasks.filter((task) => task.taskId !== insertedTask.taskId),
        insertedTask
      ]
    };
    expect(validateFirstNightTaskPlanRuntimeState(wrongOrderPlan, {
      sourceFacts,
      insertedTasks: [insertedTask]
    })).toMatchObject({ valid: false });

    const wrongIdPlan = {
      ...state.firstNightTaskPlan,
      tasks: state.firstNightTaskPlan.tasks.map((task) =>
        task.taskId === insertedTask.taskId
          ? {
            ...task,
            taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-dreamer")
          }
          : task
      )
    };
    expect(validateFirstNightTaskPlanRuntimeState(wrongIdPlan, {
      sourceFacts,
      insertedTasks: [insertedTask]
    })).toMatchObject({ valid: false });

    const extraSourceFieldPlan = {
      ...state.firstNightTaskPlan,
      tasks: state.firstNightTaskPlan.tasks.map((task) =>
        task.taskId === insertedTask.taskId
          ? {
            ...task,
            source: {
              ...task.source,
              targetRoleId: "fang_gu"
            }
          }
          : task
      )
    };
    expect(validateFirstNightTaskPlanRuntimeState(extraSourceFieldPlan, {
      sourceFacts,
      insertedTasks: [insertedTask]
    })).toMatchObject({ valid: false });

    const multipleInsertionPlan = {
      ...state.firstNightTaskPlan,
      tasks: [
        ...state.firstNightTaskPlan.tasks,
        {
          ...insertedTask,
          taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-10:from-snake_charmer")
        }
      ]
    };
    expect(validateFirstNightTaskPlanRuntimeState(multipleInsertionPlan, {
      sourceFacts,
      insertedTasks: [insertedTask]
    })).toMatchObject({ valid: false });

    expect(getNextUnsettledFirstNightTask(state.firstNightTaskPlan, state.firstNightTaskProgress)?.taskType).toBe("SNAKE_CHARMER_ACTION");
    expect(validateFirstNightTaskProgress(state.firstNightTaskPlan, state.firstNightTaskProgress)).toStrictEqual({ valid: true });
  });

  it("[R4-T03] emits a SnakeCharmerNoSwapResolved ledger SOURCE_EVENT fact", () => {
    const before = rebuildGameState(openSnakeCharmerStream());
    const state = rebuildGameState([
      ...openSnakeCharmerStream(),
      ...snakeCharmerNoSwapBatchEvents()
    ]);

    expect(state.snakeCharmerTargetChoices?.choices[0]).toMatchObject({
      taskId: "first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-snake_charmer",
      taskType: "SNAKE_CHARMER_ACTION",
      decisionKind: "CHOOSE_PLAYER",
      sourceSeatNumber: 10,
      sourceCharacterStateRevision: 1
    });
    expect(state.snakeCharmerNoSwapResolutions?.resolutions[0]).toMatchObject({
      taskType: "SNAKE_CHARMER_ACTION",
      outcomeType: "NON_DEMON_TARGET_NO_SWAP",
      sourceCharacterStateRevision: 1
    });
    expect(state.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION"
    )?.opportunityStatus).toBe("CLOSED");
    expect(state.firstNightTaskProgress?.settlements.map((settlement) => settlement.outcomeType)).toStrictEqual([
      "PHILOSOPHER_ABILITY_CHOSEN",
      "SNAKE_CHARMER_NON_DEMON_NO_SWAP"
    ]);
    expect(state.firstNightTaskPlan?.tasks[state.firstNightTaskProgress?.settlements.length ?? -1]?.taskType).toBe("MINION_INFO");
    expect(state.currentCharacterState).toStrictEqual(before.currentCharacterState);
    expect(state.assignment).toStrictEqual(before.assignment);
    expect(state.lastEventSequence).toBe(21);
    expect(state.gameVersion).toBe(11);
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
      abilityRoleId:"snake_charmer",abilityInstance:{kind:"PHILOSOPHER_GAINED_TASK_V1"},outcomeStatus:"NORMAL"
    });
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)?.evidenceReferences.find((entry) => entry.kind === "SOURCE_EVENT"))
      .toMatchObject({ kind: "SOURCE_EVENT", eventType: "SnakeCharmerNoSwapResolved" });
  });

  it("rebuilds Evil Twin setup pair, mutual knowledge, and scheduled settlement", () => {
    const before = rebuildGameState(evilTwinReadyStream());
    const [pair, information, settlement] = evilTwinSetupBatchEvents();
    const state = rebuildGameState([
      ...evilTwinReadyStream(),
      pair,
      information,
      settlement
    ]);
    const { rulesBaselineVersion: _rulesBaselineVersion, ...storedPair } = pair.payload;
    void _rulesBaselineVersion;

    expect(state.evilTwinPairs?.pairs).toStrictEqual([storedPair]);
    expect(state.evilTwinInformation).toStrictEqual(information.payload);
    expect(information.payload.entries).toStrictEqual([
      {
        recipientPlayerId: pair.payload.evilTwinPlayer.playerId,
        kind: "EVIL_TWIN_PAIR",
        counterpart: pair.payload.goodTwinPlayer
      },
      {
        recipientPlayerId: pair.payload.goodTwinPlayer.playerId,
        kind: "EVIL_TWIN_PAIR",
        counterpart: pair.payload.evilTwinPlayer
      }
    ]);
    expect(state.firstNightTaskProgress?.settlements.at(-1)).toStrictEqual({
      taskId: pair.payload.taskId,
      taskType: "EVIL_TWIN_SETUP",
      nightNumber: 1,
      settlementVersion: "scheduled-task-settlement-v1",
      outcomeType: "EVIL_TWIN_PAIR_ESTABLISHED",
      characterStateRevision: pair.payload.characterStateRevision
    });
    expect(getNextUnsettledFirstNightTask(state.firstNightTaskPlan ?? { tasks: [] }, state.firstNightTaskProgress)?.taskType).toBe("WITCH_ACTION");
    expect(state.currentCharacterState).toStrictEqual(before.currentCharacterState);
    expect(state.assignment).toStrictEqual(before.assignment);
    expect(state.setup).toStrictEqual(before.setup);
    expect(state.firstNightTaskPlan).toStrictEqual(before.firstNightTaskPlan);
    expect(state.lastEventSequence).toBe(22);
    expect(state.gameVersion).toBe(12);
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
      abilityRoleId:"evil_twin",abilityInstance:{kind:"BASE_ROLE_TASK"},outcomeStatus:"NORMAL",causeKind:"NO_OTHER_CHARACTER_ABILITY"
    });
  });

  it("rejects malformed Evil Twin setup replay batches", () => {
    const baseStream = evilTwinReadyStream();
    const [pair, information, settlement] = evilTwinSetupBatchEvents();
    const [evilTwinEntry, goodTwinEntry] = information.payload.entries;
    if (evilTwinEntry === undefined || goodTwinEntry === undefined) {
      throw new Error("Expected Evil Twin information entries");
    }

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        pair
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        {
          ...information,
          eventId: eventId("event-20-reversed-info"),
          eventSequence: 20
        },
        {
          ...pair,
          eventId: eventId("event-21-reversed-pair"),
          eventSequence: 21
        },
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        pair,
        {
          ...information,
          payload: {
            ...information.payload,
            pairId: "evil-twin-pair-v1:wrong"
          }
        },
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        pair,
        {
          ...information,
          payload: {
            ...information.payload,
            entries: [evilTwinEntry]
          }
        },
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        pair,
        {
          ...information,
          payload: {
            ...information.payload,
            entries: [
              evilTwinEntry,
              {
                ...goodTwinEntry,
                counterpart: pair.payload.goodTwinPlayer
              }
            ]
          }
        },
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        pair,
        information,
        {
          ...settlement,
          payload: {
            ...settlement.payload,
            outcomeType: "DEMON_INFORMATION_DELIVERED"
          } as never
        }
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        pair,
        information,
        {
          ...settlement,
          payload: {
            ...settlement.payload,
            characterStateRevision: pair.payload.characterStateRevision + 1
          }
        }
      ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects Evil Twin setup when current source or legal GOOD candidates no longer match the event", () => {
    const before = rebuildGameState(evilTwinReadyStream());
    const [pair, information, settlement] = evilTwinSetupBatchEvents();
    if (before.currentCharacterState === undefined) {
      throw new Error("Expected current character state");
    }

    const sourceChangedState = {
      ...before,
      currentCharacterState: {
        ...before.currentCharacterState,
        entries: before.currentCharacterState.entries.map((entry) =>
          entry.playerId === pair.payload.evilTwinPlayer.playerId
            ? {
              ...entry,
              role: roleSnapshotById("witch")
            }
            : entry
        )
      }
    };
    expectDomainCode(
      () => applyDomainEventBatch(sourceChangedState, [pair, information, settlement]),
      "InvalidEvilTwinPairEstablishedPayload"
    );

    const noGoodState = {
      ...before,
      currentCharacterState: {
        ...before.currentCharacterState,
        entries: before.currentCharacterState.entries.map((entry) => ({
          ...entry,
          currentAlignment: "EVIL" as const
        }))
      }
    };
    expectDomainCode(
      () => applyDomainEventBatch(noGoodState, [pair, information, settlement]),
      "InvalidEvilTwinPairEstablishedPayload"
    );
  });

  it("[R4-T06] emits a WitchDeathPendingMarked ledger SOURCE_EVENT fact", () => {
    const before = rebuildGameState(openWitchActionStream());
    const [targetChosen, pendingDeath, settlement] = witchDeathPendingBatchEvents();
    const state = rebuildGameState([
      ...openWitchActionStream(),
      targetChosen,
      pendingDeath,
      settlement
    ]);

    expect(state.witchTargetChoices?.choices).toStrictEqual([targetChosen.payload]);
    expect(state.witchDeathPending?.pendingDeaths).toStrictEqual([pendingDeath.payload]);
    expect(state.witchIneffectiveResolutions).toBeUndefined();
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
      sourceEventId: pendingDeath.eventId,
      outcomeStatus: "NORMAL",
      causeKind: "NO_OTHER_CHARACTER_ABILITY",
      abilityRoleId: "witch"
    });
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)?.evidenceReferences.find((entry) => entry.kind === "SOURCE_EVENT"))
      .toMatchObject({ kind: "SOURCE_EVENT", eventType: "WitchDeathPendingMarked" });
    expect(pendingDeath.payload).toMatchObject({
      taskId: targetChosen.payload.taskId,
      taskType: "WITCH_ACTION",
      opportunityId: targetChosen.payload.opportunityId,
      targetPlayerId: targetChosen.payload.targetPlayerId,
      targetSeatNumber: targetChosen.payload.targetSeatNumber,
      trigger: "TARGET_NOMINATES_TOMORROW",
      markerVersion: "witch-death-pending-v1"
    });
    expect(state.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityId === targetChosen.payload.opportunityId
    )?.opportunityStatus).toBe("CLOSED");
    expect(state.firstNightTaskProgress?.settlements.at(-1)).toStrictEqual({
      taskId: targetChosen.payload.taskId,
      taskType: "WITCH_ACTION",
      nightNumber: 1,
      settlementVersion: "scheduled-task-settlement-v1",
      outcomeType: "WITCH_DEATH_PENDING_MARKED",
      characterStateRevision: targetChosen.payload.sourceCharacterStateRevision
    });
    expect(getNextUnsettledFirstNightTask(state.firstNightTaskPlan ?? { tasks: [] }, state.firstNightTaskProgress)?.taskType).toBe("DREAMER_ACTION");
    expect(state.currentCharacterState).toStrictEqual(before.currentCharacterState);
    expect(state.assignment).toStrictEqual(before.assignment);
    expect(state.firstNightTaskPlan).toStrictEqual(before.firstNightTaskPlan);
    expect(JSON.stringify(targetChosen.payload)).not.toContain("willDie");
    expect(JSON.stringify(targetChosen.payload)).not.toContain("isEffective");
    expect(JSON.stringify(pendingDeath.payload)).not.toContain("targetRole");
    expect(JSON.stringify(pendingDeath.payload)).not.toContain("targetAlignment");
    expect(state.lastEventSequence).toBe(26);
    expect(state.gameVersion).toBe(14);
  });

  it("[R4-T07] emits a WitchIneffectiveResolved ledger SOURCE_EVENT fact", () => {
    const before = impairedWitchState("POISONED");
    const [targetChosen, ineffective, settlement] = witchIneffectiveBatchEvents("POISONED");
    const state = applyDomainEventBatch(before, [
      targetChosen,
      ineffective,
      settlement
    ]);

    expect(state.witchTargetChoices?.choices.at(-1)).toStrictEqual(targetChosen.payload);
    expect(state.witchIneffectiveResolutions?.resolutions.at(-1)).toMatchObject({
      taskId: targetChosen.payload.taskId,
      taskType: "WITCH_ACTION",
      opportunityId: targetChosen.payload.opportunityId,
      targetPlayerId: targetChosen.payload.targetPlayerId,
      outcomeType: "SOURCE_IMPAIRED_NO_EFFECT",
      reason: "SOURCE_POISONED",
      sourceImpairmentId: ineffective.payload.sourceImpairmentId,
      sourceImpairmentKind: "POISONED"
    });
    expect(state.witchDeathPending).toBeUndefined();
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
      sourceEventId: ineffective.eventId,
      outcomeStatus: "PENDING_TRIGGER",
      causeKind: "SOURCE_POISONING",
      abilityRoleId: "witch"
    });
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)?.evidenceReferences.find((entry) => entry.kind === "SOURCE_EVENT"))
      .toMatchObject({ kind: "SOURCE_EVENT", eventType: "WitchIneffectiveResolved" });
    expect(state.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityId === targetChosen.payload.opportunityId
    )?.opportunityStatus).toBe("CLOSED");
    expect(state.firstNightTaskProgress?.settlements.at(-1)).toMatchObject({
      taskType: "WITCH_ACTION",
      outcomeType: "WITCH_INEFFECTIVE",
      characterStateRevision: targetChosen.payload.sourceCharacterStateRevision
    });
    expect(getNextUnsettledFirstNightTask(state.firstNightTaskPlan ?? { tasks: [] }, state.firstNightTaskProgress)?.taskType).toBe("DREAMER_ACTION");
    expect(state.currentCharacterState).toStrictEqual(before.currentCharacterState);
    expect(state.assignment).toStrictEqual(before.assignment);
  });

  it("rejects malformed Witch target, pending death, and ineffective replay batches", () => {
    const baseStream = openWitchActionStream();
    const [targetChosen, pendingDeath, settlement] = witchDeathPendingBatchEvents();
    const [ineffectiveTarget, ineffective, ineffectiveSettlement] = witchIneffectiveBatchEvents("POISONED");

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        {
          ...pendingDeath,
          eventId: eventId("event-24-reversed-witch-pending"),
          eventSequence: 24
        },
        {
          ...targetChosen,
          eventId: eventId("event-25-reversed-witch-target"),
          eventSequence: 25
        },
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen,
        {
          ...pendingDeath,
          payload: {
            ...pendingDeath.payload,
            targetPlayerId: playerId("different-witch-target")
          }
        },
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ineffectiveTarget,
        ineffective,
        ineffectiveSettlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => applyDomainEventBatch(impairedWitchState("DRUNK"), [
        targetChosen,
        pendingDeath,
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => applyDomainEventBatch(impairedWitchState("POISONED"), [
        ineffectiveTarget,
        {
          ...ineffective,
          payload: {
            ...ineffective.payload,
            sourceImpairmentId: abilityImpairmentId("ability-impairment-v1:wrong-witch")
          }
        },
        ineffectiveSettlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen,
        pendingDeath,
        {
          ...settlement,
          payload: {
            ...settlement.payload,
            outcomeType: "WITCH_INEFFECTIVE"
          } as never
        }
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        {
          ...targetChosen,
          payload: {
            ...targetChosen.payload,
            targetRoleId: "fang_gu"
          } as never
        },
        pendingDeath,
        settlement
      ]),
      "InvalidWitchTargetChosenPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen,
        pendingDeath,
        {
          ...phaseTransitionedEvent(),
          eventId: eventId("event-26-mixed-witch-transition"),
          eventSequence: 26,
          batchId: targetChosen.batchId,
          commandId: targetChosen.commandId,
          gameVersion: targetChosen.gameVersion
        }
      ]),
      "InvalidDomainBatchSemantics"
    );
  }, 15_000);

  it("[R4-T09] emits a DreamerInformationDelivered ledger SOURCE_EVENT fact", () => {
    const before = rebuildGameState(openDreamerActionStream());
    const [targetChosen, information, settlement] = dreamerInformationBatchEvents("GOOD");
    const state = rebuildGameState([
      ...openDreamerActionStream(),
      targetChosen,
      information,
      settlement
    ]);

    expect(state.dreamerTargetChoices?.choices).toStrictEqual([targetChosen.payload]);
    expect(state.dreamerInformation?.deliveries).toStrictEqual([information.payload]);
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
      sourceEventId: information.eventId,
      outcomeStatus: "NORMAL",
      causeKind: "NO_OTHER_CHARACTER_ABILITY",
      abilityRoleId: "dreamer"
    });
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)?.evidenceReferences.find((entry) => entry.kind === "SOURCE_EVENT"))
      .toMatchObject({ kind: "SOURCE_EVENT", eventType: "DreamerInformationDelivered" });
    expect(information.payload).toMatchObject({
      taskId: targetChosen.payload.taskId,
      taskType: "DREAMER_ACTION",
      opportunityId: targetChosen.payload.opportunityId,
      targetPlayerId: targetChosen.payload.targetPlayerId,
      targetSeatNumber: targetChosen.payload.targetSeatNumber,
      knowledgeModelVersion: "dreamer-information-model-v1",
      knowledgeStage: "DREAMER_INFORMATION",
      informationReliability: { kind: "EFFECTIVE" },
      falseRolePolicyVersion: "dreamer-false-role-policy-v1"
    });
    expect(state.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityId === targetChosen.payload.opportunityId
    )?.opportunityStatus).toBe("CLOSED");
    expect(state.firstNightTaskProgress?.settlements.at(-1)).toStrictEqual({
      taskId: targetChosen.payload.taskId,
      taskType: "DREAMER_ACTION",
      nightNumber: 1,
      settlementVersion: "scheduled-task-settlement-v1",
      outcomeType: "DREAMER_INFORMATION_DELIVERED",
      characterStateRevision: targetChosen.payload.sourceCharacterStateRevision
    });
    expect(getNextUnsettledFirstNightTask(state.firstNightTaskPlan ?? { tasks: [] }, state.firstNightTaskProgress)?.taskType).toBe("SEAMSTRESS_ACTION");
    expect(state.currentCharacterState).toStrictEqual(before.currentCharacterState);
    expect(state.assignment).toStrictEqual(before.assignment);
    expect(state.firstNightTaskPlan).toStrictEqual(before.firstNightTaskPlan);
    expect(JSON.stringify(targetChosen.payload)).not.toContain("targetRole");
    expect(JSON.stringify(information.payload)).not.toContain("correctRole");
    expect(state.lastEventSequence).toBe(30);
    expect(state.gameVersion).toBe(16);
  }, 15_000);

  it("rebuilds Dreamer information for an EVIL target with the target role in the EVIL slot", () => {
    const [targetChosen, information, settlement] = dreamerInformationBatchEvents("EVIL");
    const state = rebuildGameState([
      ...openDreamerActionStream(),
      targetChosen,
      information,
      settlement
    ]);
    const targetEntry = state.currentCharacterState?.entries.find((entry) =>
      entry.playerId === targetChosen.payload.targetPlayerId
    );
    if (targetEntry === undefined) {
      throw new Error("Expected Dreamer target current state");
    }

    expect(targetEntry.role.defaultAlignment).toBe("EVIL");
    expect(information.payload.evilRole).toStrictEqual(targetEntry.role);
    expect(information.payload.goodRole.defaultAlignment).toBe("GOOD");
  }, 15_000);

  it("rejects malformed Dreamer replay batches", () => {
    const baseStream = openDreamerActionStream();
    const [targetChosen, information, settlement] = dreamerInformationBatchEvents();

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        {
          ...information,
          eventId: eventId("event-28-reversed-dreamer-info"),
          eventSequence: 28
        },
        {
          ...targetChosen,
          eventId: eventId("event-29-reversed-dreamer-target"),
          eventSequence: 29
        },
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen,
        {
          ...information,
          payload: {
            ...information.payload,
            targetPlayerId: playerId("different-dreamer-target")
          }
        },
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen,
        information,
        {
          ...settlement,
          payload: {
            ...settlement.payload,
            outcomeType: "WITCH_DEATH_PENDING_MARKED"
          } as never
        }
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        {
          ...targetChosen,
          payload: {
            ...targetChosen.payload,
            targetRoleId: "fang_gu"
          } as never
        },
        information,
        settlement
      ]),
      "InvalidDreamerTargetChosenPayload"
    );
  }, 15_000);

  it("rejects malformed Seamstress opportunity ids and visibility schemas", () => {
    const readyStream = seamstressReadyStream();
    const readyState = rebuildGameState(readyStream);
    const opportunityCreated = seamstressActionOpportunityCreatedEvent({}, readyState);

    expectDomainCode(
      () => rebuildGameState([
        ...readyStream,
        {
          ...opportunityCreated,
          payload: {
            ...opportunityCreated.payload,
            opportunityId: actionOpportunityId("first-night-v1:SEAMSTRESS_ACTION:seat-99:opportunity-01")
          }
        }
      ]),
      "InvalidFirstNightActionOpportunityCreatedPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...readyStream,
        {
          ...opportunityCreated,
          payload: {
            ...opportunityCreated.payload,
            visibility: {
              canDefer: true,
              supportedDecisionKinds: ["DEFER"],
              futureUnsupportedDecisionKinds: []
            }
          } as never
        }
      ]),
      "InvalidFirstNightActionOpportunityCreatedPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...readyStream,
        {
          ...opportunityCreated,
          payload: {
            ...opportunityCreated.payload,
            visibility: {
              ...opportunityCreated.payload.visibility,
              answer: true
            }
          } as never
        }
      ]),
      "InvalidFirstNightActionOpportunityCreatedPayload"
    );
  }, 15_000);

  it("rebuilds exact Seamstress DEFER settlement without choice, information, spend, or unrelated state mutation", () => {
    const baseStream = openSeamstressActionStream();
    const before = rebuildGameState(baseStream);
    const [deferred, settlement] = seamstressDeferredBatchEvents(before);
    const state = rebuildGameState([
      ...baseStream,
      deferred,
      settlement
    ]);

    expect(deferred.payload).toStrictEqual({
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      nightNumber: 1,
      taskId: deferred.payload.taskId,
      taskType: "SEAMSTRESS_ACTION",
      opportunityId: deferred.payload.opportunityId,
      decisionKind: "DEFER",
      sourcePlayerId: deferred.payload.sourcePlayerId,
      sourceSeatNumber: deferred.payload.sourceSeatNumber,
      sourceRole: deferred.payload.sourceRole,
      sourceCharacterStateRevision: "sourceCharacterStateRevision" in deferred.payload
        ? deferred.payload.sourceCharacterStateRevision
        : deferred.payload.opportunityCharacterStateRevision
    });
    expect(state.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityId === deferred.payload.opportunityId
    )?.opportunityStatus).toBe("CLOSED");
    expect(state.firstNightTaskProgress?.settlements.at(-1)).toStrictEqual({
      taskId: deferred.payload.taskId,
      taskType: "SEAMSTRESS_ACTION",
      nightNumber: 1,
      settlementVersion: "scheduled-task-settlement-v1",
      outcomeType: "SEAMSTRESS_DEFERRED",
      characterStateRevision: "sourceCharacterStateRevision" in deferred.payload
        ? deferred.payload.sourceCharacterStateRevision
        : deferred.payload.settlementCharacterStateRevision
    });
    expect(getNextUnsettledFirstNightTask(state.firstNightTaskPlan ?? { tasks: [] }, state.firstNightTaskProgress)?.taskType)
      .toBe("MATHEMATICIAN_INFORMATION");
    expect(state.currentCharacterState).toStrictEqual(before.currentCharacterState);
    expect(state.assignment).toStrictEqual(before.assignment);
    expect(state.setup).toStrictEqual(before.setup);
    expect(state.firstNightTaskPlan).toStrictEqual(before.firstNightTaskPlan);
    expect(state.abilityImpairments).toStrictEqual(before.abilityImpairments);
    expect(state.initialPrivateKnowledge).toStrictEqual(before.initialPrivateKnowledge);
    expect(state.dreamerInformation).toStrictEqual(before.dreamerInformation);
    expect(state.lastEventSequence).toBe(33);
    expect(state.gameVersion).toBe(18);

    const serialized = JSON.stringify([deferred.payload, settlement.payload]);
    expect(serialized).not.toContain("selectedPlayer");
    expect(serialized).not.toContain("sameAlignment");
    expect(serialized).not.toContain("answer");
    expect(serialized).not.toContain("abilitySpent");
    expect(serialized).not.toContain("informationReliability");
  }, 15_000);

  it("rejects malformed, incomplete, reordered, overlong, and mixed Seamstress replay batches", () => {
    const baseStream = openSeamstressActionStream();
    const baseState = rebuildGameState(baseStream);
    const [deferred, settlement] = seamstressDeferredBatchEvents(baseState);

    expectDomainCode(
      () => rebuildGameState([...baseStream, deferred]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        {
          ...settlement,
          eventId: eventId("event-32-reversed-seamstress-settlement"),
          eventSequence: 32
        },
        {
          ...deferred,
          eventId: eventId("event-33-reversed-seamstress-deferred"),
          eventSequence: 33
        }
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        deferred,
        settlement,
        {
          ...phaseTransitionedEvent(),
          eventId: eventId("event-34-overlong-seamstress"),
          eventSequence: 34,
          batchId: deferred.batchId,
          commandId: deferred.commandId,
          gameVersion: deferred.gameVersion
        }
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        deferred,
        {
          ...settlement,
          payload: {
            ...settlement.payload,
            taskId: scheduledTaskId("first-night-v1:SEAMSTRESS_ACTION:seat-99")
          }
        }
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        deferred,
        {
          ...settlement,
          payload: {
            ...settlement.payload,
            outcomeType: "DREAMER_INFORMATION_DELIVERED"
          } as never
        }
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        {
          ...deferred,
          payload: {
            ...deferred.payload,
            sourceCharacterStateRevision: ("sourceCharacterStateRevision" in deferred.payload
              ? deferred.payload.sourceCharacterStateRevision
              : deferred.payload.opportunityCharacterStateRevision) + 1
          }
        },
        {
          ...settlement,
          payload: {
            ...settlement.payload,
            characterStateRevision: settlement.payload.characterStateRevision + 1
          }
        }
      ]),
      "InvalidSeamstressActionDeferredPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        {
          ...deferred,
          payload: {
            ...deferred.payload,
            answer: true
          } as never
        },
        settlement
      ]),
      "InvalidSeamstressActionDeferredPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        deferred,
        {
          ...phaseTransitionedEvent(),
          eventId: settlement.eventId,
          eventSequence: settlement.eventSequence,
          batchId: deferred.batchId,
          commandId: deferred.commandId,
          gameVersion: deferred.gameVersion
        }
      ]),
      "InvalidDomainBatchSemantics"
    );
  }, 15_000);

  it("rejects malformed Snake Charmer no-swap replay batches", () => {
    const baseStream = openSnakeCharmerStream();
    const [targetChosen, noSwap, settlement] = snakeCharmerNoSwapBatchEvents();

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        {
          ...noSwap,
          eventId: eventId("event-19"),
          eventSequence: 19
        },
        {
          ...targetChosen,
          eventId: eventId("event-20"),
          eventSequence: 20
        },
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen,
        {
          ...noSwap,
          payload: {
            ...noSwap.payload,
            targetPlayerId: playerId("different-target")
          }
        },
        settlement
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen,
        noSwap,
        {
          ...settlement,
          payload: {
            ...settlement.payload,
            outcomeType: "PHILOSOPHER_DEFERRED"
          } as never
        }
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        targetChosen,
        {
          ...noSwap,
          payload: {
            ...noSwap.payload,
            targetRoleId: "fang_gu"
          } as never
        },
        settlement
      ]),
      "InvalidSnakeCharmerNoSwapResolvedPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...snakeCharmerNoSwapBatchEvents({ targetKind: "demon" })
      ]),
      "InvalidSnakeCharmerNoSwapResolvedPayload"
    );
  });

  it("[R4-T04, D19T-026] emits a SnakeCharmer swap ledger fact and reconstructs exact tenure provenance", () => {
    const before = rebuildGameState(openSnakeCharmerStream());
    const [targetChosen, swap, poison, settlement] = snakeCharmerDemonHitBatchEvents();
    const state = rebuildGameState([
      ...openSnakeCharmerStream(),
      targetChosen,
      swap,
      poison,
      settlement
    ]);

    expect(state.snakeCharmerTargetChoices?.choices[0]).toMatchObject({
      taskId: targetChosen.payload.taskId,
      taskType: "SNAKE_CHARMER_ACTION",
      targetPlayerId: targetChosen.payload.targetPlayerId,
      sourceCharacterStateRevision: 1
    });
    expect(state.snakeCharmerDemonSwaps?.swaps[0]).toStrictEqual(swap.payload);
    expect(state.seamstressRoleTenureState?.processedTransitionFactIds).toHaveLength(2);
    expect(state.seamstressRoleTenureState?.records.filter((record) =>
      record.startedBy.kind === "ROLE_TENURE_TRANSITION")).toHaveLength(1);
    expect(state.seamstressRoleTenureState?.records.find((record) =>
      record.startedBy.kind === "ROLE_TENURE_TRANSITION")?.startedBy).toMatchObject({
        sourceEventId: swap.eventId,
        sourceEventSequence: swap.eventSequence,
        previousCharacterStateRevision: swap.payload.previousCharacterStateRevision,
        nextCharacterStateRevision: swap.payload.nextCharacterStateRevision
      });
    expect(state.abilityImpairments?.impairments).toContainEqual(expect.objectContaining({
      affectedPlayerId: swap.payload.targetPlayerId,
      affectedRole: swap.payload.targetAfter.role,
      affectedSeatNumber: swap.payload.targetSeatNumber,
      impairmentId: poison.payload.impairmentId,
      kind: "POISONED",
      sourceCharacterStateRevision: swap.payload.nextCharacterStateRevision,
      sourceKind: "SNAKE_CHARMER_DEMON_HIT",
      sourcePlayerId: swap.payload.sourcePlayerId
    }));
    expect(state.currentCharacterState?.revision).toBe(swap.payload.nextCharacterStateRevision);
    expect(state.currentCharacterState?.entries.find((entry) => entry.playerId === swap.payload.sourcePlayerId)).toStrictEqual(
      swap.payload.sourceAfter
    );
    expect(state.currentCharacterState?.entries.find((entry) => entry.playerId === swap.payload.targetPlayerId)).toStrictEqual(
      swap.payload.targetAfter
    );
    expect(state.assignment).toStrictEqual(before.assignment);
    expect(state.setup).toStrictEqual(before.setup);
    expect(state.firstNightTaskPlan).toStrictEqual(before.firstNightTaskPlan);
    expect(state.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION"
    )?.opportunityStatus).toBe("CLOSED");
    expect(state.firstNightTaskProgress?.settlements.map((candidate) => candidate.outcomeType)).toStrictEqual([
      "PHILOSOPHER_ABILITY_CHOSEN",
      "SNAKE_CHARMER_DEMON_HIT_SWAP"
    ]);
    expect(state.firstNightTaskPlan?.tasks[state.firstNightTaskProgress?.settlements.length ?? -1]?.taskType).toBe("MINION_INFO");
    expect(state.lastEventSequence).toBe(22);
    expect(state.gameVersion).toBe(11);
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)?.evidenceReferences.find((entry) => entry.kind === "SOURCE_EVENT"))
      .toMatchObject({ kind: "SOURCE_EVENT", eventType: "SnakeCharmerDemonSwapApplied" });
  });

  it("[R4-T05] emits a SnakeCharmerIneffectiveResolved ledger SOURCE_EVENT fact", () => {
    const before = poisonedBaseSnakeCharmerState();
    const [targetChosen, ineffective, settlement] = baseSnakeCharmerIneffectiveBatchEvents();
    const state = applyDomainEventBatch(before, [
      targetChosen,
      ineffective,
      settlement
    ]);

    expect(state.snakeCharmerTargetChoices?.choices.at(-1)).toMatchObject({
      taskId: targetChosen.payload.taskId,
      taskType: "SNAKE_CHARMER_ACTION",
      targetPlayerId: targetChosen.payload.targetPlayerId,
      sourceCharacterStateRevision: 1
    });
    expect(state.snakeCharmerIneffectiveResolutions?.resolutions.at(-1)).toMatchObject({
      taskId: targetChosen.payload.taskId,
      outcomeType: "SOURCE_IMPAIRED_NO_EFFECT",
      reason: "SOURCE_POISONED",
      sourceImpairmentId: ineffective.payload.sourceImpairmentId,
      sourceImpairmentKind: "POISONED"
    });
    expect(state.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityId === targetChosen.payload.opportunityId
    )?.opportunityStatus).toBe("CLOSED");
    expect(state.firstNightTaskProgress?.settlements.at(-1)).toMatchObject({
      taskType: "SNAKE_CHARMER_ACTION",
      outcomeType: "SNAKE_CHARMER_INEFFECTIVE",
      characterStateRevision: 1
    });
    expect(state.currentCharacterState).toStrictEqual(before.currentCharacterState);
    expect(state.assignment).toStrictEqual(before.assignment);
    expect(state.snakeCharmerDemonSwaps).toBeUndefined();
    expect(state.firstNightAbilityOutcomeLedger?.facts.at(-1)?.evidenceReferences.find((entry) => entry.kind === "SOURCE_EVENT"))
      .toMatchObject({ kind: "SOURCE_EVENT", eventType: "SnakeCharmerIneffectiveResolved" });
  });

  it("rejects mechanical Snake Charmer resolution when the source is impaired", () => {
    const before = poisonedBaseSnakeCharmerState();
    const [targetChosen] = baseSnakeCharmerIneffectiveBatchEvents();
    const noSwap = createSnakeCharmerNoSwapResolvedPayload({
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      targetChoice: targetChosen.payload
    });
    const settlement = {
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      ...createSnakeCharmerNoSwapScheduledTaskSettlement({
        taskId: targetChosen.payload.taskId,
        characterStateRevision: targetChosen.payload.sourceCharacterStateRevision
      })
    };

    expectDomainCode(
      () => applyDomainEventBatch(before, [
        targetChosen,
        baseSnakeCharmerBatchEnvelope("SnakeCharmerNoSwapResolved", noSwap, 1),
        baseSnakeCharmerBatchEnvelope("ScheduledTaskSettled", settlement, 2)
      ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects malformed Snake Charmer Demon-hit replay batches", () => {
    const baseStream = openSnakeCharmerStream();
    const [targetChosen, swap, poison, settlement] = snakeCharmerDemonHitBatchEvents();
    const [nonDemonTargetChosen] = snakeCharmerNoSwapBatchEvents();

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([swap, poison, settlement])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([targetChosen, swap, settlement])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([targetChosen, swap, poison])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([targetChosen, poison, swap, settlement])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([
          nonDemonTargetChosen,
          {
            ...swap,
            payload: {
              ...swap.payload,
              targetPlayerId: nonDemonTargetChosen.payload.targetPlayerId,
              targetSeatNumber: nonDemonTargetChosen.payload.targetSeatNumber
            }
          },
          poison,
          settlement
        ])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([
          targetChosen,
          {
            ...swap,
            payload: {
              ...swap.payload,
              sourceAfter: {
                ...swap.payload.sourceAfter,
                role: swap.payload.sourceBefore.role
              }
            }
          },
          poison,
          settlement
        ])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([
          targetChosen,
          {
            ...swap,
            payload: {
              ...swap.payload,
              targetAfter: {
                ...swap.payload.targetAfter,
                role: swap.payload.targetBefore.role
              }
            }
          },
          poison,
          settlement
        ])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([
          targetChosen,
          {
            ...swap,
            payload: {
              ...swap.payload,
              nextCharacterStateRevision: swap.payload.nextCharacterStateRevision + 1
            }
          },
          poison,
          settlement
        ])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([
          targetChosen,
          swap,
          {
            ...poison,
            payload: {
              ...poison.payload,
              affectedPlayerId: swap.payload.sourcePlayerId
            }
          },
          settlement
        ])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([
          targetChosen,
          swap,
          {
            ...poison,
            payload: {
              ...poison.payload,
              affectedRole: swap.payload.targetBefore.role
            }
          },
          settlement
        ])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([
          targetChosen,
          swap,
          poison,
          {
            ...settlement,
            payload: {
              ...settlement.payload,
              outcomeType: "SNAKE_CHARMER_NON_DEMON_NO_SWAP"
            } as never
          }
        ])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([
          targetChosen,
          swap,
          poison,
          {
            ...settlement,
            payload: {
              ...settlement.payload,
              characterStateRevision: swap.payload.previousCharacterStateRevision
            }
          }
        ])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([
          targetChosen,
          swap,
          poison,
          {
            ...phaseTransitionedEvent(),
            batchId: targetChosen.batchId,
            commandId: targetChosen.commandId,
            gameVersion: targetChosen.gameVersion
          }
        ])
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...resequenceSnakeCharmerBatch([
          targetChosen,
          {
            ...swap,
            payload: {
              ...swap.payload,
              extra: "not-allowed"
            } as never
          },
          poison,
          settlement
        ])
      ]),
      "InvalidSnakeCharmerDemonSwapAppliedPayload"
    );
  });

  it("rejects naked, reversed, incomplete, and mixed Philosopher ability choice batches", () => {
    const baseStream = [
      ...firstNightTaskPlanEventStream(),
      philosopherActionOpportunityCreatedEvent()
    ];
    const absentChoiceBatch = philosopherAbilityChoiceBatchEvents({ chosenRole: absentNonInsertingGoodRole() });
    const snakeChoiceBatch = philosopherAbilityChoiceBatchEvents({
      chosenRole: roleSnapshotById("snake_charmer"),
      includeImpairment: true,
      includeInsertion: true
    });

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        absentChoiceBatch[0] as AnyDomainEventEnvelope
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        {
          ...(absentChoiceBatch[1] as AnyDomainEventEnvelope),
          eventId: eventId("event-13"),
          eventSequence: 13
        },
        {
          ...(absentChoiceBatch[0] as AnyDomainEventEnvelope),
          eventId: eventId("event-14"),
          eventSequence: 14
        },
        absentChoiceBatch[2] as AnyDomainEventEnvelope
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...philosopherAbilityChoiceBatchEvents({
          chosenRole: roleSnapshotById("snake_charmer"),
          includeInsertion: true
        })
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        ...philosopherAbilityChoiceBatchEvents({
          chosenRole: roleSnapshotById("snake_charmer"),
          includeImpairment: true
        })
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        absentChoiceBatch[0] as AnyDomainEventEnvelope,
        absentChoiceBatch[1] as AnyDomainEventEnvelope,
        minionInformationDeliveredEvent({
          batchId: batchId("batch-9"),
          commandId: commandId("command-9"),
          eventId: eventId("event-15"),
          eventSequence: 15,
          gameVersion: 9
        }),
        {
          ...(absentChoiceBatch[2] as AnyDomainEventEnvelope),
          eventId: eventId("event-16"),
          eventSequence: 16
        }
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        absentChoiceBatch[0] as AnyDomainEventEnvelope,
        absentChoiceBatch[1] as AnyDomainEventEnvelope,
        {
          ...(absentChoiceBatch[2] as DomainEventEnvelope<"ScheduledTaskSettled">),
          payload: {
            ...(absentChoiceBatch[2] as DomainEventEnvelope<"ScheduledTaskSettled">).payload,
            outcomeType: "PHILOSOPHER_DEFERRED"
          }
        }
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...baseStream,
        snakeChoiceBatch[0] as AnyDomainEventEnvelope,
        snakeChoiceBatch[1] as AnyDomainEventEnvelope,
        snakeChoiceBatch[2] as AnyDomainEventEnvelope,
        {
          ...(snakeChoiceBatch[3] as DomainEventEnvelope<"FirstNightTaskInserted">),
          payload: {
            ...(snakeChoiceBatch[3] as DomainEventEnvelope<"FirstNightTaskInserted">).payload,
            taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-10:from-snake_charmer")
          }
        },
        snakeChoiceBatch[4] as AnyDomainEventEnvelope
      ]),
      "InvalidFirstNightTaskInsertedPayload"
    );
  });

  it("rejects V1 and V2 Philosopher insertion generations in both mixed-plan directions", () => {
    const snakeChoiceBatch = philosopherAbilityChoiceBatchEvents({
      chosenRole: roleSnapshotById("snake_charmer"),
      includeImpairment: true,
      includeInsertion: true
    });
    const choice = snakeChoiceBatch.find((event): event is DomainEventEnvelope<"PhilosopherAbilityChosen"> =>
      event.eventType === "PhilosopherAbilityChosen"
    );
    const grantEvent = snakeChoiceBatch.find((event): event is DomainEventEnvelope<"PhilosopherAbilityGranted"> =>
      event.eventType === "PhilosopherAbilityGranted"
    );
    const legacyInsertion = snakeChoiceBatch.find((event): event is DomainEventEnvelope<"FirstNightTaskInserted"> =>
      event.eventType === "FirstNightTaskInserted"
    );
    if (choice === undefined || grantEvent === undefined || legacyInsertion === undefined) {
      throw new Error("Expected complete legacy Philosopher insertion batch");
    }
    const legacyState = defaultPhilosopherAbilityBatchState();
    if (legacyState.firstNightTaskPlan === undefined) throw new Error("Expected legacy task plan");
    const v2Plan = {
      ...legacyState.firstNightTaskPlan,
      taskPlanVersion: CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION
    };
    const v2InsertionPayload = createFirstNightTaskInsertedV2Payload({
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      choice: choice.payload,
      grant: grantEvent.payload,
      firstNightTaskPlan: v2Plan
    });
    if (v2InsertionPayload === undefined) throw new Error("Expected V2 Philosopher insertion payload");
    const v2Insertion = philosopherAbilityEventEnvelope(
      "FirstNightTaskInsertedV2",
      v2InsertionPayload,
      legacyInsertion.eventSequence
    );
    const batchWithV2Insertion = snakeChoiceBatch.map((event) =>
      event.eventType === "FirstNightTaskInserted" ? v2Insertion : event
    );

    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        philosopherActionOpportunityCreatedEvent(),
        ...batchWithV2Insertion
      ]),
      "InvalidDomainBatchSemantics"
    );

    const v2PlanEvent = firstNightTaskPlanCreatedEvent({
      payload: {
        ...firstNightTaskPlanCreatedEvent().payload,
        taskPlanVersion: CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION
      }
    });
    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(v2PlanEvent),
        philosopherActionOpportunityCreatedEvent(),
        ...snakeChoiceBatch
      ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects naked, reversed, mismatched, and overlong Philosopher settlement batches", () => {
    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        philosopherActionDeferredEvent({
          batchId: batchId("batch-8"),
          commandId: commandId("command-8"),
          eventId: eventId("event-12"),
          eventSequence: 12,
          gameVersion: 8
        })
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        philosopherActionOpportunityCreatedEvent(),
        philosopherTaskSettledEvent({ eventId: eventId("event-13"), eventSequence: 13 }),
        philosopherActionDeferredEvent({ eventId: eventId("event-14"), eventSequence: 14 })
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        philosopherActionOpportunityCreatedEvent(),
        philosopherActionDeferredEvent(),
        philosopherTaskSettledEvent({
          payload: {
            ...philosopherTaskSettledEvent().payload,
            taskId: scheduledTaskId("first-night-v1:MINION_INFO:system")
          }
        })
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        philosopherActionOpportunityCreatedEvent(),
        philosopherActionDeferredEvent(),
        philosopherTaskSettledEvent(),
        minionInformationDeliveredEvent({
          batchId: batchId("batch-9"),
          commandId: commandId("command-9"),
          eventId: eventId("event-15"),
          eventSequence: 15,
          gameVersion: 9
        })
      ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects malformed Philosopher opportunity and defer payloads", () => {
    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        philosopherActionOpportunityCreatedEvent({
          payload: {
            ...philosopherActionOpportunityCreatedEvent().payload,
            visibility: {
              ...philosopherActionOpportunityCreatedEvent().payload.visibility,
              taskId: "hidden"
            }
          } as never
        })
      ]),
      "InvalidFirstNightActionOpportunityCreatedPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        philosopherActionOpportunityCreatedEvent({
          payload: {
            ...philosopherActionOpportunityCreatedEvent().payload,
            opportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-06:opportunity-01")
          }
        })
      ]),
      "InvalidFirstNightActionOpportunityCreatedPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        philosopherActionOpportunityCreatedEvent(),
        philosopherActionDeferredEvent({
          payload: {
            ...philosopherActionDeferredEvent().payload,
            decisionKind: "CHOOSE_GOOD_CHARACTER"
          } as never
        }),
        philosopherTaskSettledEvent()
      ]),
      "InvalidPhilosopherActionDeferredPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        philosopherActionOpportunityCreatedEvent(),
        philosopherActionDeferredEvent({
          payload: {
            ...philosopherActionDeferredEvent().payload,
            hidden: true
          } as never
        }),
        philosopherTaskSettledEvent()
      ]),
      "InvalidPhilosopherActionDeferredPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...firstNightTaskPlanEventStream(),
        philosopherActionOpportunityCreatedEvent(),
        philosopherActionDeferredEvent(),
        philosopherTaskSettledEvent({
          payload: {
            ...philosopherTaskSettledEvent().payload,
            outcomeType: "MINION_INFORMATION_DELIVERED"
          } as never
        })
      ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects naked team information and naked scheduled task settlement events", () => {
    expectDomainCode(
      () => rebuildGameState([
        ...noPhilosopherTaskPlanEventStream(),
        minionInformationDeliveredEvent()
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...noPhilosopherTaskPlanEventStream(),
        minionTaskSettledEvent({ eventId: eventId("event-12"), eventSequence: 12 })
      ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects reversed and mismatched system information settlement batches", () => {
    expectDomainCode(
      () => rebuildGameState([
        ...noPhilosopherTaskPlanEventStream(),
        minionTaskSettledEvent({ eventId: eventId("event-12"), eventSequence: 12 }),
        minionInformationDeliveredEvent({ eventId: eventId("event-13"), eventSequence: 13 })
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...noPhilosopherTaskPlanEventStream(),
        minionInformationDeliveredEvent(),
        minionTaskSettledEvent({
          payload: {
            ...minionTaskSettledEvent().payload,
            taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system")
          }
        })
      ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects team information events whose delivered evil team snapshot is missing or revision-mismatched", () => {
    const payloadWithoutSnapshot = { ...minionInformationDeliveredEvent().payload } as Record<string, unknown>;
    delete payloadWithoutSnapshot.resolvedEvilTeam;
    expectDomainCode(
      () => rebuildGameState([
        ...noPhilosopherTaskPlanEventStream(),
        minionInformationDeliveredEvent({
          payload: payloadWithoutSnapshot as never
        }),
        minionTaskSettledEvent()
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...noPhilosopherTaskPlanEventStream(),
        minionInformationDeliveredEvent({
          payload: {
            ...minionInformationDeliveredEvent().payload,
            resolvedEvilTeam: {
              ...minionInformationDeliveredEvent().payload.resolvedEvilTeam,
              characterStateRevision: 2
            }
          }
        }),
        minionTaskSettledEvent()
      ]),
      "InvalidDomainBatchSemantics"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...noPhilosopherTaskPlanEventStream(),
        minionInformationDeliveredEvent(),
        minionTaskSettledEvent({
          payload: {
            ...minionTaskSettledEvent().payload,
            characterStateRevision: 2
          }
        })
      ]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects delivered evil team snapshots with unknown, duplicate, or unsorted player references", () => {
    const basePayload = minionInformationDeliveredEvent().payload;
    const [firstMinion, secondMinion] = basePayload.resolvedEvilTeam.minions;
    if (firstMinion === undefined || secondMinion === undefined) {
      throw new Error("Expected two minions");
    }

    const invalidSnapshots = [
      {
        ...basePayload.resolvedEvilTeam,
        demon: {
          playerId: playerId("missing-player"),
          seatNumber: basePayload.resolvedEvilTeam.demon.seatNumber
        }
      },
      {
        ...basePayload.resolvedEvilTeam,
        minions: [firstMinion, firstMinion]
      },
      {
        ...basePayload.resolvedEvilTeam,
        minions: [secondMinion, firstMinion]
      }
    ];

    for (const resolvedEvilTeam of invalidSnapshots) {
      expectDomainCode(
        () => rebuildGameState([
          ...noPhilosopherTaskPlanEventStream(),
          minionInformationDeliveredEvent({
            payload: {
              ...basePayload,
              resolvedEvilTeam
            }
          }),
          minionTaskSettledEvent()
        ]),
        "InvalidMinionInformationDeliveredPayload"
      );
    }
  });

  it("rejects sparse, noncanonical, and duplicate system information settlement facts", () => {
    const sparseEntries = new Array(minionInformationDeliveredEvent().payload.entries.length) as unknown[];
    sparseEntries[0] = minionInformationDeliveredEvent().payload.entries[0];
    expectDomainCode(
      () => rebuildGameState([
        ...noPhilosopherTaskPlanEventStream(),
        minionInformationDeliveredEvent({
          payload: {
            ...minionInformationDeliveredEvent().payload,
            entries: sparseEntries as never
          }
        }),
        minionTaskSettledEvent()
      ]),
      "InvalidMinionInformationDeliveredPayload"
    );

    const reversedEntries = [...minionInformationDeliveredEvent().payload.entries].reverse();
    expectDomainCode(
      () => rebuildGameState([
        ...noPhilosopherTaskPlanEventStream(),
        minionInformationDeliveredEvent({
          payload: {
            ...minionInformationDeliveredEvent().payload,
            entries: reversedEntries
          }
        }),
        minionTaskSettledEvent()
      ]),
      "InvalidMinionInformationDeliveredPayload"
    );

    expectDomainCode(
      () => rebuildGameState([
        ...noPhilosopherTaskPlanEventStream(),
        minionInformationDeliveredEvent(),
        minionTaskSettledEvent(),
        minionInformationDeliveredEvent({
          eventId: eventId("event-14"),
          eventSequence: 14,
          batchId: batchId("batch-9"),
          gameVersion: 9,
          commandId: commandId("command-9")
        }),
        minionTaskSettledEvent({
          eventId: eventId("event-15"),
          eventSequence: 15,
          batchId: batchId("batch-9"),
          gameVersion: 9,
          commandId: commandId("command-9")
        })
      ]),
      "DuplicateMinionInformationDelivered"
    );
  });

  it("does not allow AuditEvent streams at the type boundary", () => {
    const auditEvents = [auditEvent()];
    // @ts-expect-error audit events are not domain events and cannot rebuild canonical state
    const rejectedDomainEvents: Parameters<typeof rebuildGameState>[0] = auditEvents;

    void rejectedDomainEvents;
    expect(auditEvents[0]?.category).toBe("audit");
  });

  it("does not allow InfrastructureEvent streams at the type boundary", () => {
    const infrastructureEvents = [infrastructureEvent()];
    // @ts-expect-error infrastructure events are not domain events and cannot rebuild canonical state
    const rejectedDomainEvents: Parameters<typeof rebuildGameState>[0] = infrastructureEvents;

    void rejectedDomainEvents;
    expect(infrastructureEvents[0]?.category).toBe("infrastructure");
  });

  describe("Round 4 direct gained V1 ledger adapter matrix", () => {
    const fixture = () => {
      const events = snakeCharmerNoSwapBatchEvents();
      const stateBefore = applyDomainEvent(rebuildGameState(openSnakeCharmerStream()), events[0]);
      return { stateBefore, terminal: events[1] };
    };
    const derive = (state: GameState, terminal: DomainEventEnvelope<"SnakeCharmerNoSwapResolved">) =>
      deriveFirstNightAbilityOutcomeFact({ stateBefore: state, event: terminal });
    const record = (value: unknown): Record<string, unknown> => value as Record<string, unknown>;
    const records = (value: unknown): Record<string, unknown>[] => value as Record<string, unknown>[];
    const insertions = (draft: Record<string, unknown>) => records(record(draft.firstNightTaskInsertions).insertions);
    const grants = (draft: Record<string, unknown>) => records(record(draft.philosopherGrantedAbilities).abilities);
    const tasks = (draft: Record<string, unknown>) => records(record(draft.firstNightTaskPlan).tasks);
    const opportunities = (draft: Record<string, unknown>) => records(record(draft.firstNightActionOpportunities).opportunities);
    const mutateState = (mutate: (draft: Record<string, unknown>) => void): { stateBefore: GameState; terminal: DomainEventEnvelope<"SnakeCharmerNoSwapResolved"> } => {
      const { stateBefore, terminal } = fixture();
      const draft = structuredClone(stateBefore) as unknown as Record<string, unknown>;
      mutate(draft);
      return { stateBefore: draft as unknown as GameState, terminal };
    };
    const historicalRevisionFixture = () => {
      const value = mutateState((draft) => {
        record(draft.currentCharacterState).revision = 3;
        const gainedTask = tasks(draft).find((entry) => record(entry.source).kind === "PHILOSOPHER_GAINED_ABILITY")!;
        record(gainedTask.source).sourceCharacterStateRevision = 2;
        records(record(draft.philosopherAbilityChoices).choices)[0]!.sourceCharacterStateRevision = 2;
        grants(draft)[0]!.sourceCharacterStateRevision = 2;
        const insertion = insertions(draft)[0]!;
        insertion.sourceCharacterStateRevision = 2;
        record(insertion.source).sourceCharacterStateRevision = 2;
        for (const opportunity of opportunities(draft)) opportunity.sourceCharacterStateRevision = 2;
      });
      return {
        stateBefore: value.stateBefore,
        terminal: {
          ...value.terminal,
          payload: { ...value.terminal.payload, sourceCharacterStateRevision: 2 }
        } as DomainEventEnvelope<"SnakeCharmerNoSwapResolved">
      };
    };
    const expectHistoricalRevisionMismatchRejected = (terminalRevision: 1 | 3) => {
      const baseline = historicalRevisionFixture();
      const baselineFact = derive(baseline.stateBefore, baseline.terminal)!;
      expect(baselineFact).toMatchObject({
        evaluatedCharacterStateRevision: 3,
        abilityInstance: { kind: "PHILOSOPHER_GAINED_TASK_V1", sourceCharacterStateRevision: 2 }
      });
      const forgedFact = {
        ...baselineFact,
        evidenceReferences: baselineFact.evidenceReferences.map((entry) =>
          entry.kind === "ACTION_OPPORTUNITY" && entry.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION"
            ? { ...entry, sourceCharacterStateRevision: terminalRevision }
            : entry
        )
      };
      expect(validateFirstNightAbilityOutcomeFactShape(forgedFact)).toMatchObject({ valid: false });
      const tampered = structuredClone(baseline.stateBefore);
      const terminalOpportunity = tampered.firstNightActionOpportunities!.opportunities.find((entry) =>
        entry.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION"
      )!;
      record(terminalOpportunity).sourceCharacterStateRevision = terminalRevision;
      expect(terminalOpportunity.sourceCharacterStateRevision).toBeGreaterThan(0);
      expect(terminalOpportunity.sourceCharacterStateRevision).toBeLessThanOrEqual(tampered.currentCharacterState!.revision);
      const restored = structuredClone(tampered);
      record(restored.firstNightActionOpportunities!.opportunities.find((entry) =>
        entry.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION"
      )!).sourceCharacterStateRevision = 2;
      expect(restored).toStrictEqual(baseline.stateBefore);
      expect(() => derive(tampered, baseline.terminal)).toThrowError(
        "Gained terminal opportunity revision must equal canonical Philosopher grant revision"
      );
    };

    it("[R4-13] derives the complete accepted gained V1 Snake Charmer chain", () => {
      const { stateBefore, terminal } = fixture();
      const result = derive(stateBefore, terminal);
      expect(result?.abilityInstance).toMatchObject({ kind: "PHILOSOPHER_GAINED_TASK_V1" });
      expect(result?.evidenceReferences.filter((entry) => entry.kind === "ACTION_OPPORTUNITY")).toHaveLength(2);
    });
    it("[R5-V1-POSITIVE] accepts canonical gained revision N=2 with evaluated revision M=3", () => {
      const value = historicalRevisionFixture();
      const result = derive(value.stateBefore, value.terminal);
      expect(result).toMatchObject({
        evaluatedCharacterStateRevision: 3,
        abilityInstance: { kind: "PHILOSOPHER_GAINED_TASK_V1", sourceCharacterStateRevision: 2 }
      });
      expect(result?.evidenceReferences).toEqual(expect.arrayContaining([
        expect.objectContaining({ kind: "PHILOSOPHER_GRANT", sourceCharacterStateRevision: 2 }),
        expect.objectContaining({ kind: "ACTION_OPPORTUNITY", opportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION", sourceCharacterStateRevision: 2 }),
        expect.objectContaining({ kind: "ACTION_OPPORTUNITY", opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION", sourceCharacterStateRevision: 2 })
      ]));
    });
    it("[R5-V1-STALE] rejects an in-range stale gained V1 terminal opportunity revision", () => {
      expectHistoricalRevisionMismatchRejected(1);
    });
    it("[R5-V1-LATER] rejects a later in-range gained V1 terminal opportunity revision", () => {
      expectHistoricalRevisionMismatchRejected(3);
    });
    it("[R4-14] rejects a missing V1 insertion", () => {
      const value = mutateState((draft) => { draft.firstNightTaskInsertions = undefined; });
      expect(() => derive(value.stateBefore, value.terminal)).toThrowError(DomainError);
    });
    it("[R4-15] rejects duplicate V1 insertions", () => {
      const value = mutateState((draft) => { const values=insertions(draft);values.push(structuredClone(values[0]!)); });
      expect(() => derive(value.stateBefore, value.terminal)).toThrowError(DomainError);
    });
    it("[R4-16] rejects a V1 runtime task identity rewritten to V2", () => {
      const value = mutateState((draft) => { const task=tasks(draft).find((entry)=>record(entry.source).kind==="PHILOSOPHER_GAINED_ABILITY")!;task.taskId=String(task.taskId).replace("first-night-v1:","first-night-v2:"); });
      expect(() => derive(value.stateBefore, { ...value.terminal, payload: { ...value.terminal.payload, taskId: scheduledTaskId(String(value.terminal.payload.taskId).replace("first-night-v1:", "first-night-v2:")) } })).toThrowError(DomainError);
    });
    it("[R4-17] rejects a V1 insertion rewritten with V2 fields", () => {
      const value = mutateState((draft) => { const insertion=insertions(draft)[0]!; insertion.schedulingVersion="philosopher-gained-first-night-scheduling-v2"; insertion.grantId=grants(draft)[0]!.grantId; });
      expect(() => derive(value.stateBefore, value.terminal)).toThrowError(DomainError);
    });
    it("[R4-18] rejects a grant identity mismatch", () => {
      const value = mutateState((draft) => { grants(draft)[0]!.grantId="philosopher-grant-v1:seat-10:from-dreamer"; });
      expect(() => derive(value.stateBefore, value.terminal)).toThrowError(DomainError);
    });
    it("[R4-19] rejects a grant chosen-role mismatch", () => {
      const value = mutateState((draft) => { grants(draft)[0]!.chosenRoleId="dreamer"; });
      expect(() => derive(value.stateBefore, value.terminal)).toThrowError(DomainError);
    });
    it("[R4-20] rejects an original Philosopher opportunity task mismatch", () => {
      const value = mutateState((draft) => { const opportunity=opportunities(draft).find((entry)=>entry.opportunityKind==="PHILOSOPHER_FIRST_NIGHT_ACTION")!; opportunity.taskId="first-night-v1:DREAMER_ACTION:seat-10"; });
      expect(() => derive(value.stateBefore, value.terminal)).toThrowError(DomainError);
    });
    it("[R4-21] rejects a gained-role action opportunity mismatch", () => {
      const value = mutateState((draft) => { const opportunity=opportunities(draft).find((entry)=>entry.opportunityKind==="SNAKE_CHARMER_FIRST_NIGHT_ACTION")!; opportunity.taskId="first-night-v1:SNAKE_CHARMER_ACTION:seat-10"; });
      expect(() => derive(value.stateBefore, value.terminal)).toThrowError(DomainError);
    });
    it("[R4-22] rejects a future gained-role opportunity revision", () => {
      const value = mutateState((draft) => { const opportunity=opportunities(draft).find((entry)=>entry.opportunityKind==="SNAKE_CHARMER_FIRST_NIGHT_ACTION")!; opportunity.sourceCharacterStateRevision=Number(opportunity.sourceCharacterStateRevision)+1; });
      expect(() => derive(value.stateBefore, value.terminal)).toThrowError(DomainError);
    });
    it("[R4-23] rejects a gained-role opportunity source seat mismatch", () => {
      const value = mutateState((draft) => { const opportunity=opportunities(draft).find((entry)=>entry.opportunityKind==="SNAKE_CHARMER_FIRST_NIGHT_ACTION")!; opportunity.sourceSeatNumber = 9; });
      expect(() => derive(value.stateBefore, value.terminal)).toThrowError(DomainError);
    });
  });
});
