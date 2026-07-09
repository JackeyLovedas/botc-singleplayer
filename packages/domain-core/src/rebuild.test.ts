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
  createPhilosopherAbilityChosenPayload,
  createPhilosopherAbilityChosenScheduledTaskSettlement,
  createPhilosopherAbilityGrantedPayload,
  getNextUnsettledFirstNightTask,
  cloneCurrentCharacterStateSet,
  eventId,
  expectedDemonInformationEntries,
  expectedMinionInformationEntries,
  firstNightTaskTypeForPhilosopherChoice,
  applyDomainEventBatch,
  playerId,
  resolveCurrentEvilTeam,
  roleId,
  scheduledTaskId,
  scheduledTaskFromFirstNightTaskInsertedPayload,
  rebuildGameState,
  validateFirstNightTaskPlanCreatedPayload,
  validateFirstNightTaskPlanRuntimeState,
  validateFirstNightTaskProgress,
  validateInitialCurrentCharacterStateSet,
  validateDomainEventStream
} from "@botc/domain-core";
import type {
  AnyDomainEventEnvelope,
  CharactersAssignedPayload,
  DomainErrorCode,
  DomainEventEnvelope,
  FirstNightInitializedPayload,
  FirstNightTaskPlanCreatedPayload,
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
  "clockmaker",
  "dreamer",
  "snake_charmer",
  "mathematician",
  "flowergirl",
  "town_crier",
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

  it("rebuilds Philosopher DEFER followed by scheduled task settlement", () => {
    const state = rebuildGameState([
      ...firstNightTaskPlanEventStream(),
      philosopherActionOpportunityCreatedEvent(),
      philosopherActionDeferredEvent(),
      philosopherTaskSettledEvent()
    ]);

    expect(state.firstNightActionOpportunities?.opportunities[0]?.opportunityStatus).toBe("CLOSED");
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

  it("rebuilds Philosopher ability choice grant without impairment or insertion for an absent GOOD role", () => {
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
});
