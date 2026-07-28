import { describe, expect, it } from "vitest";
import {
  DEMON_INFORMATION_KNOWLEDGE_STAGE,
  DREAMER_INFORMATION_STAGE,
  EVIL_TWIN_SETUP_KNOWLEDGE_STAGE,
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  MINION_INFORMATION_KNOWLEDGE_STAGE,
  PRIVATE_VIEW_SEAMSTRESS_MODEL_VERSION,
  RULES_BASELINE_VERSION,
  SEAMSTRESS_INFORMATION_STAGE,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
  SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_ROSTER_VERSION,
  abilityImpairmentId,
  actionOpportunityId,
  batchId,
  causationId,
  commandId,
  correlationId,
  eventId,
  DomainError,
  formatBaseSeamstressAbilityInstanceId,
  formatFirstNightActionOpportunityId,
  formatRoleTenureId,
  formatRoleTenureTransitionFactId,
  formatSeamstressAbilityUseEntitlementId,
  isSeamstressActionOpportunityV2,
  createEvilTwinInformationDeliveredPayload,
  createEvilTwinPairEstablishedPayload,
  createEvilTwinPairEstablishedScheduledTaskSettlement,
  createSeamstressAbilitySpentPayload,
  createSeamstressInformationDeliveredPayload,
  createSeamstressInformationDeliveredScheduledTaskSettlement,
  createSeamstressTargetsChosenPayload,
  expectedDemonInformationEntries,
  expectedMinionInformationEntries,
  playerId,
  rebuildGameState,
  resolveCurrentEvilTeam,
  roleId,
  scheduledTaskId
} from "@botc/domain-core";
import type {
  AnyDomainEventEnvelope,
  CharactersAssignedPayload,
  CurrentCharacterStateSet,
  DomainEventEnvelope,
  DreamerInformationDeliveredPayload,
  FirstNightInitializedPayload,
  FirstNightTaskPlanCreatedPayload,
  GameState,
  InitialPrivateKnowledgeEstablishedPayload,
  KnownPlayerReference,
  SeamstressActionOpportunityV2,
  SetupGeneratedPayload
} from "@botc/domain-core";
import {
  buildAiPrivateKnowledgeView,
  buildAiPrivateKnowledgeViewFromAcceptedEventStream,
  buildPlayerPrivateKnowledgeView,
  buildPlayerPrivateKnowledgeViewFromAcceptedEventStream
} from "@botc/projections";
import { loadAcceptedBaseDreamerVortoxV3StreamFixture } from "../../test-harness/src/dreamer-vortox-v3-accepted-stream-fixture.js";
import {
  charactersAssignedEvent,
  charactersAssignedPhaseTransitionedEvent,
  firstNightInitializedEvent,
  firstNightTaskPlanCreatedEvent,
  gameCreatedEvent,
  initialPrivateKnowledgeEstablishedEvent,
  phaseTransitionedEvent,
  playerRosterCreatedEvent,
  scriptSelectedEvent,
  setupGeneratedEvent,
  setupPhaseTransitionedEvent,
  loadAcceptedBaseDreamerV3NormalStreamFixture,
  testAssignmentGenerator,
  testFirstNightTaskCatalog,
  testFirstNightTaskPlanner,
  testInitialPrivateKnowledgeBuilder,
  testSetupGenerator,
} from "@botc/test-harness";

const stateWithPrivateKnowledge = (): GameState => rebuildGameState([
  gameCreatedEvent(),
  scriptSelectedEvent(),
  phaseTransitionedEvent(),
  setupGeneratedEvent(),
  setupPhaseTransitionedEvent(),
  playerRosterCreatedEvent(),
  charactersAssignedEvent(),
  charactersAssignedPhaseTransitionedEvent(),
  firstNightInitializedEvent(),
  initialPrivateKnowledgeEstablishedEvent()
]);

const stateWithTaskPlan = (): GameState => rebuildGameState([
  gameCreatedEvent(),
  scriptSelectedEvent(),
  phaseTransitionedEvent(),
  setupGeneratedEvent(),
  setupPhaseTransitionedEvent(),
  playerRosterCreatedEvent(),
  charactersAssignedEvent(),
  charactersAssignedPhaseTransitionedEvent(),
  firstNightInitializedEvent(),
  initialPrivateKnowledgeEstablishedEvent(),
  firstNightTaskPlanCreatedEvent()
]);

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

const noPhilosopherSetupPayload = (): SetupGeneratedPayload => {
  const result = testSetupGenerator.generate({
    scriptId: "sects-and-violets",
    rootSeed: gameCreatedEvent().payload.rootSeed,
    playerCount: 12,
    constraints: {
      exactRoleIds: noPhilosopherExactRoleIds
    }
  });
  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...result.setup
  };
};

const noPhilosopherSetupGeneratedEvent = (): DomainEventEnvelope<"SetupGenerated"> =>
  setupGeneratedEvent({ payload: noPhilosopherSetupPayload() });

const noPhilosopherAssignmentPayload = (): CharactersAssignedPayload => {
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
  charactersAssignedEvent({ payload: noPhilosopherAssignmentPayload() });

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

const noPhilosopherInitialPrivateKnowledgePayload = (): InitialPrivateKnowledgeEstablishedPayload => {
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
  initialPrivateKnowledgeEstablishedEvent({ payload: noPhilosopherInitialPrivateKnowledgePayload() });

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

const noPhilosopherTaskPlanEvents = (): readonly AnyDomainEventEnvelope[] => [
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

const stateWithNoPhilosopherTaskPlan = (): GameState => rebuildGameState(noPhilosopherTaskPlanEvents());

const minionInformationDeliveredEvent = (): DomainEventEnvelope<"MinionInformationDelivered"> => {
  const state = stateWithNoPhilosopherTaskPlan();
  if (state.currentCharacterState === undefined || state.roster === undefined || state.setup === undefined) {
    throw new Error("Expected state source facts");
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
    correlationId: correlationId("correlation-8"),
    causationId: causationId("command-8"),
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
    }
  };
};

const minionTaskSettledEvent = (): DomainEventEnvelope<"ScheduledTaskSettled"> => ({
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
  correlationId: correlationId("correlation-8"),
  causationId: causationId("command-8"),
  payload: {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    nightNumber: 1,
    taskId: scheduledTaskId("first-night-v1:MINION_INFO:system"),
    taskType: "MINION_INFO",
    settlementVersion: "scheduled-task-settlement-v1",
    outcomeType: "MINION_INFORMATION_DELIVERED",
    characterStateRevision: 1
  }
});

const demonInformationDeliveredEvent = (): DomainEventEnvelope<"DemonInformationDelivered"> => {
  const state = rebuildGameState([
    ...noPhilosopherTaskPlanEvents(),
    minionInformationDeliveredEvent(),
    minionTaskSettledEvent()
  ]);
  if (state.currentCharacterState === undefined || state.roster === undefined || state.setup === undefined) {
    throw new Error("Expected state source facts");
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
    correlationId: correlationId("correlation-9"),
    causationId: causationId("command-9"),
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
    }
  };
};

const demonTaskSettledEvent = (): DomainEventEnvelope<"ScheduledTaskSettled"> => ({
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
  correlationId: correlationId("correlation-9"),
  causationId: causationId("command-9"),
  payload: {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    nightNumber: 1,
    taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system"),
    taskType: "DEMON_INFO",
    settlementVersion: "scheduled-task-settlement-v1",
    outcomeType: "DEMON_INFORMATION_DELIVERED",
    characterStateRevision: 1
  }
});

const stateWithMinionInformation = (): GameState => rebuildGameState([
  ...noPhilosopherTaskPlanEvents(),
  minionInformationDeliveredEvent(),
  minionTaskSettledEvent()
]);

const stateWithDemonInformation = (): GameState => rebuildGameState([
  ...noPhilosopherTaskPlanEvents(),
  minionInformationDeliveredEvent(),
  minionTaskSettledEvent(),
  demonInformationDeliveredEvent(),
  demonTaskSettledEvent()
]);

const stateReadyForEvilTwinSetup = (): GameState => {
  const state = stateWithDemonInformation();
  const snakeTask = state.firstNightTaskPlan?.tasks.find((task) => task.taskType === "SNAKE_CHARMER_ACTION");
  if (snakeTask === undefined || state.firstNightTaskProgress === undefined) {
    throw new Error("Expected Snake Charmer task and progress");
  }

  return {
    ...state,
    firstNightTaskProgress: {
      settlements: [
        ...state.firstNightTaskProgress.settlements,
        {
          taskId: snakeTask.taskId,
          taskType: "SNAKE_CHARMER_ACTION",
          nightNumber: 1 as const,
          settlementVersion: "scheduled-task-settlement-v1" as const,
          outcomeType: "SNAKE_CHARMER_NON_DEMON_NO_SWAP" as const,
          characterStateRevision: 1
        }
      ]
    }
  };
};

const stateWithEvilTwinInformation = (): GameState => {
  const state = stateReadyForEvilTwinSetup();
  const task = state.firstNightTaskPlan?.tasks.find((candidate) => candidate.taskType === "EVIL_TWIN_SETUP");
  if (task === undefined || state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined || state.firstNightTaskProgress === undefined) {
    throw new Error("Expected Evil Twin setup source facts");
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
  const settlement = createEvilTwinPairEstablishedScheduledTaskSettlement({
    taskId: pair.taskId,
    characterStateRevision: pair.characterStateRevision
  });

  return {
    ...state,
    evilTwinPairs: {
      pairs: [pair]
    },
    evilTwinInformation: information,
    firstNightTaskProgress: {
      settlements: [
        ...state.firstNightTaskProgress.settlements,
        settlement
      ]
    }
  };
};

const stateWithDreamerInformation = (): GameState => {
  const state = stateWithDemonInformation();
  const dreamerTask = state.firstNightTaskPlan?.tasks.find((task) => task.taskType === "DREAMER_ACTION");
  const source = state.currentCharacterState?.entries.find((entry) => entry.role.roleId === "dreamer");
  const target = state.currentCharacterState?.entries.find((entry) =>
    entry.playerId !== source?.playerId &&
    entry.role.defaultAlignment === "GOOD"
  );
  const evilRole = state.setup?.roleCatalogSnapshot.roles
    .filter((role) => role.defaultAlignment === "EVIL")
    .sort((left, right) => left.roleId < right.roleId ? -1 : left.roleId > right.roleId ? 1 : 0)[0];
  if (
    dreamerTask === undefined ||
    dreamerTask.source.kind !== "ROLE" ||
    source === undefined ||
    target === undefined ||
    evilRole === undefined ||
    state.firstNightTaskProgress === undefined
  ) {
    throw new Error("Expected Dreamer projection source facts");
  }

  const delivery = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    nightNumber: 1 as const,
    taskId: dreamerTask.taskId,
    taskType: "DREAMER_ACTION" as const,
    opportunityId: actionOpportunityId(`first-night-v1:DREAMER_ACTION:seat-${String(source.seatNumber).padStart(2, "0")}:opportunity-01`),
    knowledgeModelVersion: SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
    knowledgeStage: DREAMER_INFORMATION_STAGE,
    sourcePlayerId: source.playerId,
    sourceSeatNumber: source.seatNumber,
    sourceCharacterStateRevision: state.currentCharacterState?.revision ?? 1,
    targetPlayerId: target.playerId,
    targetSeatNumber: target.seatNumber,
    informationReliability: {
      kind: "SOURCE_IMPAIRED" as const,
      reason: "SOURCE_POISONED" as const,
      sourceImpairmentId: abilityImpairmentId("ability-impairment-v1:projection-hidden"),
      sourceImpairmentKind: "POISONED" as const
    },
    goodRole: target.role,
    evilRole,
    falseRolePolicyVersion: "dreamer-false-role-policy-v1" as const
  };
  const targetChoice = {
    rulesBaselineVersion: delivery.rulesBaselineVersion,
    nightNumber: delivery.nightNumber,
    taskId: delivery.taskId,
    taskType: delivery.taskType,
    opportunityId: delivery.opportunityId,
    decisionKind: "CHOOSE_PLAYER" as const,
    sourcePlayerId: delivery.sourcePlayerId,
    sourceSeatNumber: delivery.sourceSeatNumber,
    sourceRole: dreamerTask.source.role,
    sourceCharacterStateRevision: delivery.sourceCharacterStateRevision,
    targetPlayerId: delivery.targetPlayerId,
    targetSeatNumber: delivery.targetSeatNumber
  };

  return {
    ...state,
    dreamerTargetChoices: {
      choices: [targetChoice]
    },
    dreamerInformation: {
      deliveries: [delivery]
    },
    firstNightTaskProgress: {
      settlements: [
        ...state.firstNightTaskProgress.settlements,
        {
          taskId: delivery.taskId,
          taskType: delivery.taskType,
          nightNumber: 1 as const,
          settlementVersion: "scheduled-task-settlement-v1" as const,
          outcomeType: "DREAMER_INFORMATION_DELIVERED" as const,
          characterStateRevision: delivery.sourceCharacterStateRevision
        }
      ]
    }
  };
};

const requireCurrentEvilTeam = (state: GameState) => {
  if (state.currentCharacterState === undefined || state.roster === undefined) {
    throw new Error("Expected current character state and roster");
  }

  const result = resolveCurrentEvilTeam({
    currentCharacterState: state.currentCharacterState,
    roster: state.roster.entries
  });
  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return result.team;
};

const stateWithRevisedCurrentEvilTeam = (state: GameState): GameState => {
  if (state.currentCharacterState === undefined) {
    throw new Error("Expected current character state");
  }

  const entries = state.currentCharacterState.entries;
  const oldDemon = entries.find((entry) => entry.role.characterType === "DEMON");
  const oldMinions = entries.filter((entry) => entry.role.characterType === "MINION");
  const goodTargets = entries.filter((entry) => entry.role.characterType !== "DEMON" && entry.role.characterType !== "MINION").slice(0, 3);
  if (oldDemon === undefined || oldMinions.length !== 2 || goodTargets.length !== 3) {
    throw new Error("Expected one demon, two minions, and three good targets");
  }

  const oldMinionOne = oldMinions[0];
  const oldMinionTwo = oldMinions[1];
  const newDemonTarget = goodTargets[0];
  const newMinionTargetOne = goodTargets[1];
  const newMinionTargetTwo = goodTargets[2];
  if (
    oldMinionOne === undefined ||
    oldMinionTwo === undefined ||
    newDemonTarget === undefined ||
    newMinionTargetOne === undefined ||
    newMinionTargetTwo === undefined
  ) {
    throw new Error("Expected revision targets");
  }

  const replacementRoles = new Map([
    [newDemonTarget.playerId, oldDemon.role],
    [newMinionTargetOne.playerId, oldMinionOne.role],
    [newMinionTargetTwo.playerId, oldMinionTwo.role],
    [oldDemon.playerId, newDemonTarget.role],
    [oldMinionOne.playerId, newMinionTargetOne.role],
    [oldMinionTwo.playerId, newMinionTargetTwo.role]
  ]);

  const currentCharacterState: CurrentCharacterStateSet = {
    revision: state.currentCharacterState.revision + 1,
    entries: entries.map((entry) => {
      const role = replacementRoles.get(entry.playerId) ?? entry.role;
      return {
        ...entry,
        role,
        currentAlignment: role.defaultAlignment
      };
    })
  };

  const revisedState = {
    ...state,
    currentCharacterState
  };
  const oldTeam = requireCurrentEvilTeam(state);
  const newTeam = requireCurrentEvilTeam(revisedState);
  expect(newTeam.characterStateRevision).toBe(oldTeam.characterStateRevision + 1);
  expect(newTeam.demon.playerId).not.toBe(oldTeam.demon.playerId);

  return revisedState;
};

const expectNoTeamKnowledge = (view: ReturnType<typeof buildPlayerPrivateKnowledgeView>): void => {
  expect("knownDemon" in view).toBe(false);
  expect(view.knownMinions).toStrictEqual([]);
  expect(view.demonBluffs).toStrictEqual([]);
  expect(view.teamKnowledgeModelVersion).toBeUndefined();
  expect(view.deliveredKnowledgeStages).toStrictEqual([INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE]);
};

const expectMinionKnowledgeFromSnapshot = (
  state: GameState,
  minion: KnownPlayerReference
): void => {
  const snapshot = state.minionInformation?.resolvedEvilTeam;
  if (snapshot === undefined) {
    throw new Error("Expected minion information snapshot");
  }

  const view = buildPlayerPrivateKnowledgeView(state, minion.playerId);
  expect(view.knownDemon).toStrictEqual(snapshot.demon);
  expect(view.knownMinions).toStrictEqual(snapshot.minions.filter((candidate) => candidate.playerId !== minion.playerId));
  expect(view.demonBluffs).toStrictEqual([]);
  expect(view.teamKnowledgeModelVersion).toBe(SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION);
  expect(view.deliveredKnowledgeStages).toStrictEqual([
    INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
    MINION_INFORMATION_KNOWLEDGE_STAGE
  ]);
};

const viewKeys = [
  "deliveredKnowledgeStages",
  "demonBluffs",
  "knownDemon",
  "knownMinions",
  "ownCharacter",
  "ownCharacterKnowledgeModelVersion",
  "teamKnowledgeModelVersion",
  "viewerDisplayName",
  "viewerPlayerId",
  "viewerSeatNumber"
];

const expectPrivateKnowledgeUnavailable = (action: () => void): void => {
  let caught: unknown;
  try {
    action();
  } catch (error) {
    caught = error;
  }

  expect(caught).toBeInstanceOf(DomainError);
  expect((caught as DomainError).code).toBe("PrivateKnowledgeUnavailable");
};

const requireDreamerDelivery = (state: GameState): DreamerInformationDeliveredPayload => {
  const delivery = state.dreamerInformation?.deliveries[0];
  if (delivery === undefined) {
    throw new Error("Expected stored Dreamer delivery");
  }

  return delivery;
};

const tamperDreamerDelivery = (
  state: GameState,
  tamper: (delivery: DreamerInformationDeliveredPayload) => unknown
): GameState => ({
  ...state,
  dreamerInformation: {
    deliveries: [tamper(requireDreamerDelivery(state))]
  }
} as unknown as GameState);

const dreamerProjectionTamperingCases: readonly [
  string,
  (state: GameState) => GameState
][] = [
  ["null delivery", (state) => tamperDreamerDelivery(state, () => null)],
  ["non-object delivery", (state) => tamperDreamerDelivery(state, () => "hidden")],
  ["correctRoleId", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    correctRoleId: delivery.goodRole.roleId
  }))],
  ["targetTrueRole", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    targetTrueRole: delivery.goodRole
  }))],
  ["targetAlignment", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    targetAlignment: "GOOD"
  }))],
  ["storytellerNotes", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    storytellerNotes: "hidden"
  }))],
  ["nested GOOD-role extra field", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    goodRole: { ...delivery.goodRole, correctRoleId: delivery.goodRole.roleId }
  }))],
  ["nested reliability extra field", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    informationReliability: { ...delivery.informationReliability, storytellerNotes: "hidden" }
  }))],
  ["rules baseline version", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    rulesBaselineVersion: "Phase One v2.0"
  }))],
  ["knowledge model version", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    knowledgeModelVersion: "dreamer-information-model-v2"
  }))],
  ["knowledge stage", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    knowledgeStage: "DREAMER_TRUTH"
  }))],
  ["false-role policy version", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    falseRolePolicyVersion: "dreamer-false-role-policy-v2"
  }))],
  ["GOOD role alignment", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    goodRole: delivery.evilRole
  }))],
  ["EVIL role alignment", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    evilRole: delivery.goodRole
  }))],
  ["role catalog snapshot binding", (state) => tamperDreamerDelivery(state, (delivery) => ({
    ...delivery,
    goodRole: { ...delivery.goodRole, edition: "tampered-edition" }
  }))],
  ["missing target choice", (state) => ({
    ...state,
    dreamerTargetChoices: undefined
  } as unknown as GameState)],
  ["mismatched target choice", (state) => ({
    ...state,
    dreamerTargetChoices: {
      choices: (state.dreamerTargetChoices?.choices ?? []).map((choice) => ({
        ...choice,
        targetPlayerId: playerId("mismatched-target")
      }))
    }
  })],
  ["target-choice extra field", (state) => ({
    ...state,
    dreamerTargetChoices: {
      choices: (state.dreamerTargetChoices?.choices ?? []).map((choice) => ({
        ...choice,
        targetTrueRole: requireDreamerDelivery(state).goodRole
      }))
    }
  })],
  ["missing planned task", (state) => {
    if (state.firstNightTaskPlan === undefined) {
      throw new Error("Expected first-night task plan");
    }
    return {
      ...state,
      firstNightTaskPlan: {
        ...state.firstNightTaskPlan,
        tasks: state.firstNightTaskPlan.tasks.filter((task) => task.taskType !== "DREAMER_ACTION")
      }
    };
  }],
  ["mismatched planned task source", (state) => {
    if (state.firstNightTaskPlan === undefined) {
      throw new Error("Expected first-night task plan");
    }
    return {
      ...state,
      firstNightTaskPlan: {
        ...state.firstNightTaskPlan,
        tasks: state.firstNightTaskPlan.tasks.map((task) =>
          task.taskType === "DREAMER_ACTION" && task.source.kind === "ROLE"
            ? {
                ...task,
                source: { ...task.source, playerId: playerId("mismatched-source") }
              }
            : task
        )
      }
    };
  }],
  ["missing settlement", (state) => {
    const delivery = requireDreamerDelivery(state);
    return {
      ...state,
      firstNightTaskProgress: {
        settlements: (state.firstNightTaskProgress?.settlements ?? []).filter((settlement) =>
          settlement.taskId !== delivery.taskId
        )
      }
    };
  }],
  ["duplicate settlement", (state) => {
    const delivery = requireDreamerDelivery(state);
    const settlements = state.firstNightTaskProgress?.settlements ?? [];
    const settlement = settlements.find((candidate) => candidate.taskId === delivery.taskId);
    if (settlement === undefined) {
      throw new Error("Expected Dreamer settlement");
    }
    return {
      ...state,
      firstNightTaskProgress: {
        settlements: [...settlements, settlement]
      }
    };
  }],
  ["wrong settlement outcome", (state) => {
    const delivery = requireDreamerDelivery(state);
    return {
      ...state,
      firstNightTaskProgress: {
        settlements: (state.firstNightTaskProgress?.settlements ?? []).map((settlement) =>
          settlement.taskId === delivery.taskId
            ? { ...settlement, outcomeType: "WITCH_INEFFECTIVE" as const }
            : settlement
        )
      }
    };
  }],
  ["wrong settlement task", (state) => {
    const delivery = requireDreamerDelivery(state);
    return {
      ...state,
      firstNightTaskProgress: {
        settlements: (state.firstNightTaskProgress?.settlements ?? []).map((settlement) =>
          settlement.taskId === delivery.taskId
            ? { ...settlement, taskId: scheduledTaskId("mismatched-dreamer-task") }
            : settlement
        )
      }
    };
  }],
  ["wrong settlement revision", (state) => {
    const delivery = requireDreamerDelivery(state);
    return {
      ...state,
      firstNightTaskProgress: {
        settlements: (state.firstNightTaskProgress?.settlements ?? []).map((settlement) =>
          settlement.taskId === delivery.taskId
            ? { ...settlement, characterStateRevision: delivery.sourceCharacterStateRevision + 1 }
            : settlement
        )
      }
    };
  }],
  ["settlement extra field", (state) => {
    const delivery = requireDreamerDelivery(state);
    return {
      ...state,
      firstNightTaskProgress: {
        settlements: (state.firstNightTaskProgress?.settlements ?? []).map((settlement) =>
          settlement.taskId === delivery.taskId
            ? { ...settlement, storytellerNotes: "hidden" }
            : settlement
        )
      }
    };
  }]
];

const stateWithSeamstressInformation = (): GameState => {
  const state = stateWithTaskPlan();
  const currentCharacterState = state.currentCharacterState;
  const seamstressRole = state.setup?.roleCatalogSnapshot.roles.find((entry) => entry.roleId === "seamstress");
  const source = currentCharacterState?.entries.find((entry) =>
    entry.role.roleId !== "philosopher" && entry.role.roleId !== "vortox"
  );
  const targets = currentCharacterState?.entries.filter((entry) => entry.playerId !== source?.playerId).slice(0, 2);
  if (currentCharacterState === undefined || seamstressRole === undefined || source === undefined ||
      targets?.[0] === undefined || targets[1] === undefined) {
    throw new Error("Expected projection Seamstress source facts");
  }
  const taskId = scheduledTaskId(`first-night-v1:SEAMSTRESS_ACTION:seat-${String(source.seatNumber).padStart(2, "0")}`);
  const sourceRoleTenureId = formatRoleTenureId({
    seatNumber: source.seatNumber,
    roleId: "seamstress",
    acquiredCharacterStateRevision: currentCharacterState.revision
  });
  const tenure = {
    roleTenureId: sourceRoleTenureId,
    playerId: source.playerId,
    seatNumber: source.seatNumber,
    roleId: "seamstress" as const,
    acquiredCharacterStateRevision: currentCharacterState.revision,
    startedBy: {
      kind: "CHARACTERS_ASSIGNED" as const,
      sourceEventId: eventId("projection-seamstress-tenure"),
      sourceEventSequence: 1,
      characterStateRevision: 1 as const
    }
  };
  const roleTenures = {
    records: [...(state.seamstressRoleTenureState?.records ?? []), tenure],
    processedTransitionFactIds: state.seamstressRoleTenureState?.processedTransitionFactIds ?? []
  };
  const abilityInstanceId = formatBaseSeamstressAbilityInstanceId(sourceRoleTenureId);
  const abilityUseEntitlementId = formatSeamstressAbilityUseEntitlementId(abilityInstanceId);
  const opportunity: SeamstressActionOpportunityV2 = {
    nightNumber: 1,
    opportunityId: actionOpportunityId(`${taskId}:opportunity-01`),
    opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION",
    opportunityStatus: "CLOSED",
    taskId,
    taskType: "SEAMSTRESS_ACTION",
    sourcePlayerId: source.playerId,
    sourceSeatNumber: source.seatNumber,
    sourceRole: seamstressRole,
    sourceCharacterStateRevision: currentCharacterState.revision,
    sourceRoleTenureId,
    abilitySource: {
      kind: "ROLE_TENURE",
      abilityRoleId: "seamstress",
      roleTenureId: sourceRoleTenureId,
      acquiredCharacterStateRevision: currentCharacterState.revision
    },
    abilityInstanceId,
    abilityUseEntitlementId,
    visibility: {
      visibilitySchemaVersion: "seamstress-first-night-action-v2",
      resolutionCapabilityVersion: "seamstress-snv-first-night-resolution-v1",
      canDefer: true,
      canChooseTargets: true,
      supportedDecisionKinds: ["DEFER", "CHOOSE_TWO_PLAYERS"],
      futureUnsupportedDecisionKinds: [],
      targetSchema: "EXACTLY_TWO_DISTINCT_OTHER_MODELED_PLAYERS"
    }
  };
  const choice = createSeamstressTargetsChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId,
    opportunityId: opportunity.opportunityId,
    abilityInstanceId,
    abilityUseEntitlementId,
    sourceRoleTenureId,
    sourcePlayerId: source.playerId,
    sourceSeatNumber: source.seatNumber,
    sourceRole: seamstressRole,
    opportunityCharacterStateRevision: currentCharacterState.revision,
    currentCharacterState,
    targetPlayerIds: [targets[1].playerId, targets[0].playerId]
  });
  const spend = createSeamstressAbilitySpentPayload(choice);
  const delivery = createSeamstressInformationDeliveredPayload({
    choice,
    currentCharacterState,
    sourceRoleTenure: tenure,
    roleTenures,
    abilityImpairments: state.abilityImpairments
  });
  const settlementPayload = createSeamstressInformationDeliveredScheduledTaskSettlement(delivery);
  const settlement = {
    taskId: settlementPayload.taskId,
    taskType: settlementPayload.taskType,
    nightNumber: settlementPayload.nightNumber,
    settlementVersion: settlementPayload.settlementVersion,
    outcomeType: settlementPayload.outcomeType,
    characterStateRevision: settlementPayload.characterStateRevision
  };

  return {
    ...state,
    seamstressRoleTenureState: roleTenures,
    seamstressAbilityState: {
      instances: [{
        abilityInstanceId,
        abilityRoleId: "seamstress",
        holderPlayerId: source.playerId,
        holderSeatNumber: source.seatNumber,
        sourceRoleTenureId,
        source: { ...opportunity.abilitySource },
        acquiredCharacterStateRevision: currentCharacterState.revision
      }],
      entitlements: [{
        abilityUseEntitlementId,
        abilityInstanceId,
        entitlementKind: "BASE_ONCE_PER_GAME",
        status: "SPENT"
      }]
    },
    firstNightActionOpportunities: { opportunities: [opportunity] },
    seamstressTargetChoices: { choices: [choice] },
    seamstressAbilitySpends: { spends: [spend] },
    seamstressInformation: { deliveries: [delivery] },
    firstNightTaskProgress: { settlements: [settlement] }
  };
};

const stateWithTwoSeamstressDeliveries = (): GameState => {
  const state = stateWithSeamstressInformation();
  const firstDelivery = state.seamstressInformation?.deliveries[0];
  const firstOpportunity = state.firstNightActionOpportunities?.opportunities[0];
  const currentCharacterState = state.currentCharacterState;
  const sourceTenure = state.seamstressRoleTenureState?.records.find((entry) =>
    entry.roleTenureId === firstDelivery?.sourceRoleTenureId
  );
  if (firstDelivery === undefined || firstOpportunity === undefined || !isSeamstressActionOpportunityV2(firstOpportunity) || currentCharacterState === undefined ||
      sourceTenure === undefined || state.seamstressRoleTenureState === undefined ||
      state.seamstressAbilityState === undefined) {
    throw new Error("Expected first Seamstress delivery chain");
  }
  const settlementState: CurrentCharacterStateSet = {
    revision: 2,
    entries: currentCharacterState.entries.map((entry) => ({ ...entry }))
  };
  const secondTenureId = formatRoleTenureId({
    seatNumber: sourceTenure.seatNumber,
    roleId: "seamstress",
    acquiredCharacterStateRevision: 2
  });
  const secondTenure = {
    ...sourceTenure,
    roleTenureId: secondTenureId,
    acquiredCharacterStateRevision: 2,
    startedBy: {
      kind: "ROLE_TENURE_TRANSITION" as const,
      transitionFactId: formatRoleTenureTransitionFactId({
        sourceEventSequence: 2,
        seatNumber: sourceTenure.seatNumber,
        nextCharacterStateRevision: 2
      }),
      sourceEventId: eventId("projection-seamstress-reacquired"),
      sourceEventSequence: 2,
      previousCharacterStateRevision: 1,
      nextCharacterStateRevision: 2
    }
  };
  const roleTenures = {
    records: [
      ...state.seamstressRoleTenureState.records.map((entry) => entry.roleTenureId === sourceTenure.roleTenureId
        ? { ...entry, endedCharacterStateRevision: 2 }
        : entry),
      secondTenure
    ],
    processedTransitionFactIds: state.seamstressRoleTenureState.processedTransitionFactIds
  };
  const abilityInstanceId = formatBaseSeamstressAbilityInstanceId(secondTenureId);
  const abilityUseEntitlementId = formatSeamstressAbilityUseEntitlementId(abilityInstanceId);
  const taskId = scheduledTaskId(`${firstDelivery.taskId}:reacquired-revision-2`);
  const opportunity: SeamstressActionOpportunityV2 = {
    ...firstOpportunity,
    opportunityId: formatFirstNightActionOpportunityId({
      taskType: "SEAMSTRESS_ACTION",
      seatNumber: firstDelivery.sourceSeatNumber,
      opportunityIndex: 2
    }),
    taskId,
    sourceCharacterStateRevision: 2,
    sourceRoleTenureId: secondTenureId,
    abilitySource: {
      kind: "ROLE_TENURE",
      abilityRoleId: "seamstress",
      roleTenureId: secondTenureId,
      acquiredCharacterStateRevision: 2
    },
    abilityInstanceId,
    abilityUseEntitlementId
  };
  const choice = createSeamstressTargetsChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId,
    opportunityId: opportunity.opportunityId,
    abilityInstanceId,
    abilityUseEntitlementId,
    sourceRoleTenureId: secondTenureId,
    sourcePlayerId: firstDelivery.sourcePlayerId,
    sourceSeatNumber: firstDelivery.sourceSeatNumber,
    sourceRole: firstDelivery.sourceRole,
    opportunityCharacterStateRevision: 2,
    currentCharacterState: settlementState,
    targetPlayerIds: [firstDelivery.targetPlayerIds[1], firstDelivery.targetPlayerIds[0]]
  });
  const spend = createSeamstressAbilitySpentPayload(choice);
  const delivery = createSeamstressInformationDeliveredPayload({
    choice,
    currentCharacterState: settlementState,
    sourceRoleTenure: secondTenure,
    roleTenures,
    abilityImpairments: state.abilityImpairments
  });
  const settlementPayload = createSeamstressInformationDeliveredScheduledTaskSettlement(delivery);
  const settlement = {
    taskId: settlementPayload.taskId,
    taskType: settlementPayload.taskType,
    nightNumber: settlementPayload.nightNumber,
    settlementVersion: settlementPayload.settlementVersion,
    outcomeType: settlementPayload.outcomeType,
    characterStateRevision: settlementPayload.characterStateRevision
  };

  return {
    ...state,
    currentCharacterState: settlementState,
    seamstressRoleTenureState: roleTenures,
    seamstressAbilityState: {
      instances: [...state.seamstressAbilityState.instances, {
        abilityInstanceId,
        abilityRoleId: "seamstress",
        holderPlayerId: firstDelivery.sourcePlayerId,
        holderSeatNumber: firstDelivery.sourceSeatNumber,
        sourceRoleTenureId: secondTenureId,
        source: { ...opportunity.abilitySource },
        acquiredCharacterStateRevision: 2
      }],
      entitlements: [...state.seamstressAbilityState.entitlements, {
        abilityUseEntitlementId,
        abilityInstanceId,
        entitlementKind: "BASE_ONCE_PER_GAME",
        status: "SPENT"
      }]
    },
    firstNightActionOpportunities: {
      opportunities: [...(state.firstNightActionOpportunities?.opportunities ?? []), opportunity]
    },
    seamstressTargetChoices: {
      choices: [...(state.seamstressTargetChoices?.choices ?? []), choice]
    },
    seamstressAbilitySpends: {
      spends: [...(state.seamstressAbilitySpends?.spends ?? []), spend]
    },
    seamstressInformation: {
      deliveries: [...(state.seamstressInformation?.deliveries ?? []), delivery]
    },
    firstNightTaskProgress: {
      settlements: [...(state.firstNightTaskProgress?.settlements ?? []), settlement]
    }
  };
};

describe("private knowledge projections", () => {
  it("gives good players only their own character and no evil-team private facts", () => {
    const state = stateWithPrivateKnowledge();
    const good = state.assignment?.assignments.find((assignment) => assignment.role.defaultAlignment === "GOOD");
    if (good === undefined) {
      throw new Error("Expected good assignment");
    }

    const view = buildPlayerPrivateKnowledgeView(state, good.playerId);

    expect(Object.keys(view).sort()).toStrictEqual(
      viewKeys.filter((key) => key !== "knownDemon" && key !== "teamKnowledgeModelVersion").sort()
    );
    expect(view.ownCharacter).toStrictEqual(good.role);
    expect(view.knownMinions).toStrictEqual([]);
    expect(view.demonBluffs).toStrictEqual([]);
    expect("knownDemon" in view).toBe(false);
    expect(view.ownCharacterKnowledgeModelVersion).toBe(SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION);
    expect(view.teamKnowledgeModelVersion).toBeUndefined();
    expect(view.deliveredKnowledgeStages).toStrictEqual([INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE]);
    expect(JSON.stringify(view)).not.toContain("assignments");
  });

  it("gives minions only their own role before MINION_INFO is delivered", () => {
    const state = stateWithPrivateKnowledge();
    const minions = state.assignment?.assignments.filter((assignment) => assignment.role.characterType === "MINION") ?? [];
    const minion = minions[0];
    if (minion === undefined) {
      throw new Error("Expected minion assignment");
    }

    const view = buildPlayerPrivateKnowledgeView(state, minion.playerId);

    expect(view.ownCharacter).toStrictEqual(minion.role);
    expect("knownDemon" in view).toBe(false);
    expect(view.knownMinions).toStrictEqual([]);
    expect(view.demonBluffs).toStrictEqual([]);
    expect(view.teamKnowledgeModelVersion).toBeUndefined();
    expect(view.deliveredKnowledgeStages).toStrictEqual([INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE]);
    for (const otherMinion of minions.filter((candidate) => candidate.playerId !== minion.playerId)) {
      expect(JSON.stringify(view)).not.toContain(otherMinion.playerId);
      expect(JSON.stringify(view)).not.toContain(otherMinion.role.roleId);
    }
  });

  it("gives the demon only their own role before DEMON_INFO is delivered", () => {
    const state = stateWithPrivateKnowledge();
    const demon = state.assignment?.assignments.find((assignment) => assignment.role.characterType === "DEMON");
    const minions = state.assignment?.assignments.filter((assignment) => assignment.role.characterType === "MINION") ?? [];
    if (demon === undefined) {
      throw new Error("Expected demon assignment");
    }

    const view = buildPlayerPrivateKnowledgeView(state, demon.playerId);

    expect(view.ownCharacter).toStrictEqual(demon.role);
    expect("knownDemon" in view).toBe(false);
    expect(view.knownMinions).toStrictEqual([]);
    expect(view.demonBluffs).toStrictEqual([]);
    expect(view.teamKnowledgeModelVersion).toBeUndefined();
    expect(view.deliveredKnowledgeStages).toStrictEqual([INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE]);
    for (const minion of minions) {
      expect(JSON.stringify(view)).not.toContain(minion.playerId);
      expect(JSON.stringify(view)).not.toContain(minion.role.roleId);
    }
    for (const bluff of state.setup?.demonBluffs ?? []) {
      expect(JSON.stringify(view)).not.toContain(bluff.roleId);
    }
  });

  it("builds the AI private knowledge view with the same leakage boundary as the player view", () => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.assignment?.assignments.find((assignment) => assignment.role.characterType === "DEMON");
    if (viewer === undefined) {
      throw new Error("Expected viewer");
    }

    expect(buildAiPrivateKnowledgeView(state, viewer.playerId)).toStrictEqual(buildPlayerPrivateKnowledgeView(state, viewer.playerId));
  });

  it("does not expose first-night task plans through player or AI private knowledge views", () => {
    const baseState = stateWithTaskPlan();
    const philosopherTask = baseState.firstNightTaskPlan?.tasks.find((task) => task.taskType === "PHILOSOPHER_ACTION");
    if (philosopherTask === undefined || philosopherTask.source.kind !== "ROLE" || baseState.currentCharacterState === undefined) {
      throw new Error("Expected Philosopher task source");
    }
    const state: GameState = {
      ...baseState,
      firstNightActionOpportunities: {
        opportunities: [{
          nightNumber: 1,
          opportunityId: actionOpportunityId(`first-night-v1:PHILOSOPHER_ACTION:seat-${String(philosopherTask.source.seatNumber).padStart(2, "0")}:opportunity-01`),
          opportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION",
          opportunityStatus: "OPEN",
          taskId: philosopherTask.taskId,
          taskType: "PHILOSOPHER_ACTION",
          sourcePlayerId: philosopherTask.source.playerId,
          sourceSeatNumber: philosopherTask.source.seatNumber,
          sourceRole: philosopherTask.source.role,
          sourceCharacterStateRevision: baseState.currentCharacterState.revision,
          visibility: {
            canDefer: true,
            supportedDecisionKinds: ["DEFER", "CHOOSE_GOOD_CHARACTER"],
            futureUnsupportedDecisionKinds: []
          }
        }]
      },
    firstNightAbilityOutcomeLedger: {
      ledgerVersion: "first-night-ability-outcome-ledger-v1",
      facts: [{ auditFactId: "secret-outcome-ledger-fact", evidenceReferences: ["secret-outcome-evidence"] }]
    } as never,
    philosopherAbilityChoices: {
      choices: [{
        eventType: "PhilosopherAbilityChosen",
        chosenRole: "snake_charmer"
      }]
    } as never,
    philosopherGrantedAbilities: {
      abilities: [{
        grantedAbility: "snake_charmer"
      }]
    } as never,
    abilityImpairments: {
      impairments: [
        {
          impairment: "PHILOSOPHER_CHOSEN_DUPLICATE"
        },
        {
          eventType: "AbilityImpairmentApplied",
          kind: "POISONED",
          sourceKind: "SNAKE_CHARMER_DEMON_HIT",
          affectedPlayerId: "secret-target",
          affectedRole: "secret-role"
        }
      ]
    } as never,
    firstNightTaskInsertions: {
      insertions: [{
        eventType: "FirstNightTaskInserted",
        insertedTask: "SNAKE_CHARMER_ACTION"
      }]
    } as never,
    snakeCharmerTargetChoices: {
      choices: [{
        eventType: "SnakeCharmerTargetChosen",
        targetPlayerId: "secret-target",
        opportunityId: "secret-opportunity",
        taskId: "secret-task",
        decisionKind: "CHOOSE_PLAYER"
      }]
    } as never,
    snakeCharmerNoSwapResolutions: {
      resolutions: [{
        eventType: "SnakeCharmerNoSwapResolved",
        targetPlayerId: "secret-target",
        opportunityId: "secret-opportunity",
        taskId: "secret-task",
        outcomeType: "NON_DEMON_TARGET_NO_SWAP"
      }]
    } as never,
    snakeCharmerDemonSwaps: {
      swaps: [{
        eventType: "SnakeCharmerDemonSwapApplied",
        targetPlayerId: "secret-target",
        opportunityId: "secret-opportunity",
        taskId: "secret-task",
        sourceBefore: "secret-source-before",
        targetBefore: "secret-target-before",
        sourceAfter: "secret-source-after",
        targetAfter: "secret-target-after"
      }]
    } as never,
    snakeCharmerIneffectiveResolutions: {
      resolutions: [{
        eventType: "SnakeCharmerIneffectiveResolved",
        targetPlayerId: "secret-target",
        opportunityId: "secret-opportunity",
        taskId: "secret-task",
        outcomeType: "SOURCE_IMPAIRED_NO_EFFECT",
        reason: "SOURCE_DRUNK",
        sourceImpairmentId: "secret-impairment"
      }]
    } as never,
    witchTargetChoices: {
      choices: [{
        eventType: "WitchTargetChosen",
        targetPlayerId: "secret-witch-target",
        opportunityId: "secret-witch-opportunity",
        taskId: "secret-witch-task",
        decisionKind: "CHOOSE_PLAYER"
      }]
    } as never,
    witchDeathPending: {
      pendingDeaths: [{
        eventType: "WitchDeathPendingMarked",
        targetPlayerId: "secret-witch-target",
        pendingDeathId: "secret-pending-death",
        trigger: "TARGET_NOMINATES_TOMORROW",
        opportunityId: "secret-witch-opportunity",
        taskId: "secret-witch-task"
      }]
    } as never,
    witchIneffectiveResolutions: {
      resolutions: [{
        eventType: "WitchIneffectiveResolved",
        targetPlayerId: "secret-witch-target",
        opportunityId: "secret-witch-opportunity",
        taskId: "secret-witch-task",
        outcomeType: "SOURCE_IMPAIRED_NO_EFFECT",
        reason: "SOURCE_POISONED",
        sourceImpairmentId: "secret-witch-impairment"
      }]
    } as never
  };
    const viewer = state.roster?.entries[0];
    if (viewer === undefined) {
      throw new Error("Expected viewer");
    }

    const playerView = buildPlayerPrivateKnowledgeView(state, viewer.playerId);
    const aiView = buildAiPrivateKnowledgeView(state, viewer.playerId);
    const playerSerialized = JSON.stringify(playerView);
    const aiSerialized = JSON.stringify(aiView);

    expect(Object.keys(playerView).sort()).toStrictEqual(
      viewKeys.filter((key) => key !== "knownDemon" && key !== "teamKnowledgeModelVersion").sort()
    );
    expect(Object.keys(aiView).sort()).toStrictEqual(Object.keys(playerView).sort());
    for (const serialized of [playerSerialized, aiSerialized]) {
      expect(serialized).not.toContain("taskPlan");
      expect(serialized).not.toContain("tasks");
      expect(serialized).not.toContain("taskId");
      expect(serialized).not.toContain("taskType");
      expect(serialized).not.toContain("opportunityId");
      expect(serialized).not.toContain("actionOpportunity");
      expect(serialized).not.toContain("openOpportunities");
      expect(serialized).not.toContain("availableActions");
      expect(serialized).not.toContain("sourcePlayerId");
      expect(serialized).not.toContain("canDefer");
      expect(serialized).not.toContain("supportedDecisionKinds");
      expect(serialized).not.toContain("futureUnsupportedDecisionKinds");
      expect(serialized).not.toContain("firstNightAbilityOutcomeLedger");
      expect(serialized).not.toContain("secret-outcome-ledger-fact");
      expect(serialized).not.toContain("secret-outcome-evidence");
      expect(serialized).not.toContain("DEFER");
      expect(serialized).not.toContain("CHOOSE_GOOD_CHARACTER");
      expect(serialized).not.toContain("CHOOSE_PLAYER");
      expect(serialized).not.toContain("targetPlayerId");
      expect(serialized).not.toContain("targetSeatNumber");
      expect(serialized).not.toContain("sourceBefore");
      expect(serialized).not.toContain("targetBefore");
      expect(serialized).not.toContain("sourceAfter");
      expect(serialized).not.toContain("targetAfter");
      expect(serialized).not.toContain("chosenRole");
      expect(serialized).not.toContain("grantedAbility");
      expect(serialized).not.toContain("impairment");
      expect(serialized).not.toContain("POISONED");
      expect(serialized).not.toContain("insertedTask");
      expect(serialized).not.toContain("PhilosopherAbilityChosen");
      expect(serialized).not.toContain("AbilityImpairmentApplied");
      expect(serialized).not.toContain("FirstNightTaskInserted");
      expect(serialized).not.toContain("SnakeCharmerTargetChosen");
      expect(serialized).not.toContain("SnakeCharmerNoSwapResolved");
      expect(serialized).not.toContain("SnakeCharmerDemonSwapApplied");
      expect(serialized).not.toContain("SnakeCharmerIneffectiveResolved");
      expect(serialized).not.toContain("WitchTargetChosen");
      expect(serialized).not.toContain("WitchDeathPendingMarked");
      expect(serialized).not.toContain("WitchIneffectiveResolved");
      expect(serialized).not.toContain("NON_DEMON_TARGET_NO_SWAP");
      expect(serialized).not.toContain("SOURCE_IMPAIRED_NO_EFFECT");
      expect(serialized).not.toContain("SOURCE_DRUNK");
      expect(serialized).not.toContain("secret-impairment");
      expect(serialized).not.toContain("secret-witch-target");
      expect(serialized).not.toContain("pendingDeathId");
      expect(serialized).not.toContain("secret-pending-death");
      expect(serialized).not.toContain("TARGET_NOMINATES_TOMORROW");
      expect(serialized).not.toContain("secret-witch-impairment");
      expect(serialized).not.toContain("pendingRoleTasks");
      expect(serialized).not.toContain("PHILOSOPHER_ACTION");
      expect(serialized).not.toContain("MINION_INFO");
      expect(serialized).not.toContain("DEMON_INFO");
    }
  });

  it("keeps player and AI projections unchanged after opening and deferring Seamstress", () => {
    const baseState = stateWithTaskPlan();
    const seamstressRole = baseState.setup?.roleCatalogSnapshot.roles.find((role) => role.roleId === "seamstress");
    const source = baseState.currentCharacterState?.entries.find((entry) => entry.role.roleId !== "seamstress");
    const viewer = baseState.roster?.entries.find((entry) =>
      entry.playerId !== source?.playerId &&
      baseState.assignment?.assignments.find((assignment) => assignment.playerId === entry.playerId)?.role.roleId !== "seamstress"
    );
    if (seamstressRole === undefined || source === undefined || viewer === undefined || baseState.currentCharacterState === undefined) {
      throw new Error("Expected projection-safe Seamstress source facts");
    }

    const taskId = scheduledTaskId(`first-night-v1:SEAMSTRESS_ACTION:seat-${String(source.seatNumber).padStart(2, "0")}`);
    const opportunityId = actionOpportunityId(`${taskId}:opportunity-01`);
    const opportunity = {
      nightNumber: 1 as const,
      opportunityId,
      opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION" as const,
      opportunityStatus: "OPEN" as const,
      taskId,
      taskType: "SEAMSTRESS_ACTION" as const,
      sourcePlayerId: source.playerId,
      sourceSeatNumber: source.seatNumber,
      sourceRole: seamstressRole,
      sourceCharacterStateRevision: baseState.currentCharacterState.revision,
      visibility: {
        canDefer: true as const,
        supportedDecisionKinds: ["DEFER"] as const,
        futureUnsupportedDecisionKinds: ["CHOOSE_TWO_PLAYERS"] as const
      }
    };
    const openState: GameState = {
      ...baseState,
      firstNightActionOpportunities: {
        opportunities: [opportunity]
      }
    };
    const deferredState: GameState = {
      ...openState,
      firstNightActionOpportunities: {
        opportunities: [{ ...opportunity, opportunityStatus: "CLOSED" }]
      },
      firstNightTaskProgress: {
        settlements: [{
          nightNumber: 1,
          taskId,
          taskType: "SEAMSTRESS_ACTION",
          settlementVersion: "scheduled-task-settlement-v1",
          outcomeType: "SEAMSTRESS_DEFERRED",
          characterStateRevision: baseState.currentCharacterState.revision
        }]
      }
    };

    const baselinePlayerView = buildPlayerPrivateKnowledgeView(baseState, viewer.playerId);
    const baselineAiView = buildAiPrivateKnowledgeView(baseState, viewer.playerId);

    for (const [stage, state] of [["open", openState], ["deferred", deferredState]] as const) {
      const playerView = buildPlayerPrivateKnowledgeView(state, viewer.playerId);
      const aiView = buildAiPrivateKnowledgeView(state, viewer.playerId);

      expect(playerView, stage).toStrictEqual(baselinePlayerView);
      expect(aiView, stage).toStrictEqual(baselineAiView);
      expect(aiView, stage).toStrictEqual(playerView);
      for (const serialized of [JSON.stringify(playerView), JSON.stringify(aiView)]) {
        expect(serialized, stage).not.toContain(taskId);
        expect(serialized, stage).not.toContain(opportunityId);
        expect(serialized, stage).not.toContain("SEAMSTRESS_ACTION");
        expect(serialized, stage).not.toContain("SEAMSTRESS_FIRST_NIGHT_ACTION");
        expect(serialized, stage).not.toContain("SeamstressActionDeferred");
        expect(serialized, stage).not.toContain("SEAMSTRESS_DEFERRED");
        expect(serialized, stage).not.toContain("DEFER");
        expect(serialized, stage).not.toContain("CHOOSE_TWO_PLAYERS");
        expect(serialized, stage).not.toContain(source.playerId);
        expect(serialized, stage).not.toContain("sourceCharacterStateRevision");
        expect(serialized, stage).not.toContain("sameAlignment");
        expect(serialized, stage).not.toContain("informationReliability");
        expect(serialized, stage).not.toContain("abilitySpent");
        expect(serialized, stage).not.toContain("\"seamstress\"");
      }
    }
  });

  it("projects settled MINION_INFO only to minions without leaking teammate roles", () => {
    const state = stateWithMinionInformation();
    if (state.currentCharacterState === undefined || state.roster === undefined) {
      throw new Error("Expected current character state and roster");
    }
    const team = resolveCurrentEvilTeam({
      currentCharacterState: state.currentCharacterState,
      roster: state.roster.entries
    });
    if (team.status === "failure") {
      throw new Error(team.message);
    }

    const demonState = state.currentCharacterState.entries.find((entry) => entry.playerId === team.team.demon.playerId);
    const goodState = state.currentCharacterState.entries.find((entry) => entry.currentAlignment === "GOOD");
    if (demonState === undefined || goodState === undefined) {
      throw new Error("Expected demon and good players");
    }

    for (const minion of team.team.minions) {
      const view = buildPlayerPrivateKnowledgeView(state, minion.playerId);
      const ownState = state.currentCharacterState.entries.find((entry) => entry.playerId === minion.playerId);
      if (ownState === undefined) {
        throw new Error("Expected minion state");
      }

      expect(view.knownDemon).toStrictEqual(team.team.demon);
      expect(view.knownMinions).toStrictEqual(team.team.minions.filter((candidate) => candidate.playerId !== minion.playerId));
      expect(view.demonBluffs).toStrictEqual([]);
      expect(view.teamKnowledgeModelVersion).toBe(SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION);
      expect(view.deliveredKnowledgeStages).toStrictEqual([
        INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
        MINION_INFORMATION_KNOWLEDGE_STAGE
      ]);
      expect(JSON.stringify(view)).not.toContain(demonState.role.roleId);
      for (const otherMinion of state.currentCharacterState.entries.filter((entry) =>
        team.team.minions.some((candidate) => candidate.playerId === entry.playerId) && entry.playerId !== minion.playerId
      )) {
        expect(JSON.stringify(view)).not.toContain(otherMinion.role.roleId);
      }
      expect(view.ownCharacter).toStrictEqual(ownState.role);
    }

    const demonView = buildPlayerPrivateKnowledgeView(state, demonState.playerId);
    expectNoTeamKnowledge(demonView);

    const goodView = buildPlayerPrivateKnowledgeView(state, goodState.playerId);
    expectNoTeamKnowledge(goodView);
  });

  it("projects settled DEMON_INFO only to the demon without leaking minion roles", () => {
    const state = stateWithDemonInformation();
    if (state.currentCharacterState === undefined || state.roster === undefined || state.setup === undefined) {
      throw new Error("Expected current character state, roster, and setup");
    }
    const team = resolveCurrentEvilTeam({
      currentCharacterState: state.currentCharacterState,
      roster: state.roster.entries
    });
    if (team.status === "failure") {
      throw new Error(team.message);
    }

    const demonState = state.currentCharacterState.entries.find((entry) => entry.playerId === team.team.demon.playerId);
    if (demonState === undefined) {
      throw new Error("Expected demon state");
    }

    const demonView = buildPlayerPrivateKnowledgeView(state, demonState.playerId);
    expect("knownDemon" in demonView).toBe(false);
    expect(demonView.knownMinions).toStrictEqual(team.team.minions);
    expect(demonView.demonBluffs).toStrictEqual([...state.setup.demonBluffs].sort((left, right) => left.roleId < right.roleId ? -1 : 1));
    expect(demonView.teamKnowledgeModelVersion).toBe(SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION);
    expect(demonView.deliveredKnowledgeStages).toStrictEqual([
      INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
      DEMON_INFORMATION_KNOWLEDGE_STAGE
    ]);
    for (const minion of state.currentCharacterState.entries.filter((entry) =>
      team.team.minions.some((candidate) => candidate.playerId === entry.playerId)
    )) {
      expect(JSON.stringify(demonView)).not.toContain(minion.role.roleId);
    }

    for (const minion of team.team.minions) {
      const minionView = buildPlayerPrivateKnowledgeView(state, minion.playerId);
      expect(minionView.knownDemon).toStrictEqual(team.team.demon);
      expect(minionView.knownMinions).toStrictEqual(team.team.minions.filter((candidate) => candidate.playerId !== minion.playerId));
      expect(minionView.demonBluffs).toStrictEqual([]);
      expect(minionView.deliveredKnowledgeStages).toStrictEqual([
        INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
        MINION_INFORMATION_KNOWLEDGE_STAGE
      ]);
    }
  });

  it("projects settled EVIL_TWIN_SETUP only to the twin pair without leaking roles or assignment", () => {
    const state = stateWithEvilTwinInformation();
    const pair = state.evilTwinPairs?.pairs[0];
    if (pair === undefined) {
      throw new Error("Expected Evil Twin pair");
    }

    const evilTwinView = buildPlayerPrivateKnowledgeView(state, pair.evilTwinPlayer.playerId);
    expect(evilTwinView.evilTwinCounterpart).toStrictEqual(pair.goodTwinPlayer);
    expect(evilTwinView.evilTwinKnowledgeModelVersion).toBe("evil-twin-knowledge-model-v1");
    expect(evilTwinView.deliveredKnowledgeStages).toStrictEqual([
      INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
      MINION_INFORMATION_KNOWLEDGE_STAGE,
      EVIL_TWIN_SETUP_KNOWLEDGE_STAGE
    ]);

    const goodTwinView = buildPlayerPrivateKnowledgeView(state, pair.goodTwinPlayer.playerId);
    expect(goodTwinView.evilTwinCounterpart).toStrictEqual(pair.evilTwinPlayer);
    expect(goodTwinView.evilTwinKnowledgeModelVersion).toBe("evil-twin-knowledge-model-v1");
    expect(goodTwinView.deliveredKnowledgeStages).toStrictEqual([
      INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
      EVIL_TWIN_SETUP_KNOWLEDGE_STAGE
    ]);

    const evilTwinSerialized = JSON.stringify(evilTwinView);
    const goodTwinSerialized = JSON.stringify(goodTwinView);
    expect(evilTwinSerialized).not.toContain(pair.goodTwinRole.roleId);
    expect(goodTwinSerialized).not.toContain(pair.evilTwinRole.roleId);
    expect(goodTwinSerialized).not.toContain("assignment");
    expect(goodTwinSerialized).not.toContain("pairingPolicyVersion");
    expect(goodTwinSerialized).not.toContain("evilTwinPairs");

    const other = state.roster?.entries.find((entry) =>
      entry.playerId !== pair.evilTwinPlayer.playerId &&
      entry.playerId !== pair.goodTwinPlayer.playerId
    );
    if (other === undefined) {
      throw new Error("Expected non-twin player");
    }
    const otherView = buildPlayerPrivateKnowledgeView(state, other.playerId);
    expect("evilTwinCounterpart" in otherView).toBe(false);
    expect("evilTwinKnowledgeModelVersion" in otherView).toBe(false);
    expect(otherView.deliveredKnowledgeStages).not.toContain(EVIL_TWIN_SETUP_KNOWLEDGE_STAGE);
  });

  it("projects Evil Twin knowledge identically to AI without leaking hidden pair facts", () => {
    const state = stateWithEvilTwinInformation();
    const pair = state.evilTwinPairs?.pairs[0];
    if (pair === undefined) {
      throw new Error("Expected Evil Twin pair");
    }

    const playerView = buildPlayerPrivateKnowledgeView(state, pair.goodTwinPlayer.playerId);
    const aiView = buildAiPrivateKnowledgeView(state, pair.goodTwinPlayer.playerId);

    expect(aiView).toStrictEqual(playerView);
    expect(JSON.stringify(aiView)).not.toContain(pair.evilTwinRole.roleId);
    expect(JSON.stringify(aiView)).not.toContain("currentCharacterState");
    expect(JSON.stringify(aiView)).not.toContain("evilTwinPlayer");
    expect(JSON.stringify(aiView)).not.toContain("goodTwinPlayer");
  });

  it("[2B19A3A-C03][2B19A2-C24] projects settled V1 DREAMER_INFORMATION only to the source player", () => {
    const state = stateWithDreamerInformation();
    const delivery = state.dreamerInformation?.deliveries[0];
    if (delivery === undefined) {
      throw new Error("Expected Dreamer delivery");
    }

    const dreamerView = buildPlayerPrivateKnowledgeView(state, delivery.sourcePlayerId);
    expect(dreamerView.dreamerInformation).toStrictEqual({
      target: {
        playerId: delivery.targetPlayerId,
        seatNumber: delivery.targetSeatNumber
      },
      goodRole: delivery.goodRole,
      evilRole: delivery.evilRole
    });
    expect(dreamerView.dreamerKnowledgeModelVersion).toBe(SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION);
    expect(dreamerView.deliveredKnowledgeStages).toContain(DREAMER_INFORMATION_STAGE);

    const serialized = JSON.stringify(dreamerView);
    expect(serialized).not.toContain("informationReliability");
    expect(serialized).not.toContain("SOURCE_POISONED");
    expect(serialized).not.toContain("sourceImpairmentId");
    expect(serialized).not.toContain("falseRolePolicyVersion");
    expect(serialized).not.toContain("currentCharacterState");
    expect(serialized).not.toContain("assignment");
    expect(serialized).not.toContain("currentAlignment");
  });

  it("[2B19A2-C26] omits Dreamer delivery from every non-source player and AI view", () => {
    const state = stateWithDreamerInformation();
    const delivery = state.dreamerInformation?.deliveries[0];
    const other = state.roster?.entries.find((entry) =>
      entry.playerId !== delivery?.sourcePlayerId &&
      entry.playerId !== delivery?.targetPlayerId
    );
    if (delivery === undefined || other === undefined) {
      throw new Error("Expected Dreamer delivery and other player");
    }

    const playerView = buildPlayerPrivateKnowledgeView(state, other.playerId);
    const aiView = buildAiPrivateKnowledgeView(state, other.playerId);

    expect("dreamerInformation" in playerView).toBe(false);
    expect("dreamerKnowledgeModelVersion" in playerView).toBe(false);
    expect(playerView.deliveredKnowledgeStages).not.toContain(DREAMER_INFORMATION_STAGE);
    expect(aiView).toStrictEqual(playerView);
    expect(JSON.stringify(aiView)).not.toContain("sourceImpairmentId");
    expect(JSON.stringify(aiView)).not.toContain(delivery.targetPlayerId);
  });

  it("[2B19A2-C25] projects validated Dreamer information identically to the source AI", () => {
    const state = stateWithDreamerInformation();
    const delivery = requireDreamerDelivery(state);

    const playerView = buildPlayerPrivateKnowledgeView(state, delivery.sourcePlayerId);
    const aiView = buildAiPrivateKnowledgeView(state, delivery.sourcePlayerId);

    expect(aiView).toStrictEqual(playerView);
    expect(aiView.dreamerInformation).toStrictEqual({
      target: {
        playerId: delivery.targetPlayerId,
        seatNumber: delivery.targetSeatNumber
      },
      goodRole: delivery.goodRole,
      evilRole: delivery.evilRole
    });
  });

  it("[2B19A2-C27] exposes no canonical truth, source effectiveness, contract, or impairment fields", () => {
    const state = stateWithDreamerInformation();
    const delivery = requireDreamerDelivery(state);
    const views = [
      buildPlayerPrivateKnowledgeView(state, delivery.sourcePlayerId),
      buildAiPrivateKnowledgeView(state, delivery.sourcePlayerId)
    ];
    const forbidden = new Set([
      "informationReliability", "sourceImpairmentId", "sourceImpairmentKind", "sourceContract",
      "sourceCharacterStateRevision", "targetTrueRole", "currentCharacterState", "currentAlignment",
      "falseRolePolicyVersion", "targetSchemaVersion", "deliverySchemaVersion"
    ]);
    const scan = (value: unknown): void => {
      if (Array.isArray(value)) {
        value.forEach(scan);
        return;
      }
      if (value !== null && typeof value === "object") {
        for (const [key, nested] of Object.entries(value)) {
          expect(forbidden.has(key), `forbidden projection key ${key}`).toBe(false);
          scan(nested);
        }
      }
    };
    views.forEach(scan);
  });

  it("[2B19A2-C28] preserves historical Dreamer delivery after later character and impairment changes", () => {
    const state = stateWithDreamerInformation();
    const delivery = requireDreamerDelivery(state);
    const currentCharacterState = state.currentCharacterState;
    const setup = state.setup;
    const replacementSourceRole = setup?.roleCatalogSnapshot.roles.find((role) =>
      role.defaultAlignment === "GOOD" && role.roleId !== "dreamer"
    );
    const replacementTargetRole = setup?.roleCatalogSnapshot.roles.find((role) => role.defaultAlignment === "EVIL");
    if (
      currentCharacterState === undefined ||
      replacementSourceRole === undefined ||
      replacementTargetRole === undefined
    ) {
      throw new Error("Expected later Dreamer projection source facts");
    }

    const laterRevision = currentCharacterState.revision + 1;
    const laterState = {
      ...state,
      currentCharacterState: {
        revision: laterRevision,
        entries: currentCharacterState.entries.map((entry) => {
          if (entry.playerId === delivery.sourcePlayerId) {
            return {
              ...entry,
              role: replacementSourceRole,
              currentAlignment: replacementSourceRole.defaultAlignment
            };
          }
          if (entry.playerId === delivery.targetPlayerId) {
            return {
              ...entry,
              role: replacementTargetRole,
              currentAlignment: replacementTargetRole.defaultAlignment
            };
          }
          return entry;
        })
      },
      abilityImpairments: {
        impairments: [{
          impairmentId: abilityImpairmentId("ability-impairment-v1:later-drunk"),
          kind: "DRUNK" as const,
          sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" as const,
          sourcePlayerId: delivery.targetPlayerId,
          affectedPlayerId: delivery.sourcePlayerId,
          affectedSeatNumber: delivery.sourceSeatNumber,
          affectedRole: replacementSourceRole,
          chosenRoleId: replacementSourceRole.roleId,
          sourceCharacterStateRevision: laterRevision
        }]
      }
    } satisfies GameState;

    const playerView = buildPlayerPrivateKnowledgeView(laterState, delivery.sourcePlayerId);
    const aiView = buildAiPrivateKnowledgeView(laterState, delivery.sourcePlayerId);

    expect(playerView.dreamerInformation).toStrictEqual({
      target: {
        playerId: delivery.targetPlayerId,
        seatNumber: delivery.targetSeatNumber
      },
      goodRole: delivery.goodRole,
      evilRole: delivery.evilRole
    });
    expect(aiView).toStrictEqual(playerView);
  });

  it.each(dreamerProjectionTamperingCases)(
    "fails closed for player and AI Dreamer projection tampering: %s",
    (_name, tamper) => {
      const state = stateWithDreamerInformation();
      const delivery = requireDreamerDelivery(state);
      const tamperedState = tamper(state);

      expectPrivateKnowledgeUnavailable(() =>
        buildPlayerPrivateKnowledgeView(tamperedState, delivery.sourcePlayerId)
      );
      expectPrivateKnowledgeUnavailable(() =>
        buildAiPrivateKnowledgeView(tamperedState, delivery.sourcePlayerId)
      );
    }
  );

  it("refuses Evil Twin projection when the delivered event has not been settled", () => {
    const state = stateWithEvilTwinInformation();
    const pair = state.evilTwinPairs?.pairs[0];
    if (pair === undefined || state.firstNightTaskProgress === undefined) {
      throw new Error("Expected Evil Twin pair and progress");
    }

    const tamperedState = {
      ...state,
      firstNightTaskProgress: {
        settlements: state.firstNightTaskProgress.settlements.filter((settlement) => settlement.taskType !== "EVIL_TWIN_SETUP")
      }
    } as GameState;

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(tamperedState, pair.evilTwinPlayer.playerId));
    expectPrivateKnowledgeUnavailable(() => buildAiPrivateKnowledgeView(tamperedState, pair.goodTwinPlayer.playerId));
  });

  it("preserves delivered MINION_INFO from its settlement snapshot after current evil team revision changes", () => {
    const state = stateWithRevisedCurrentEvilTeam(stateWithMinionInformation());
    const oldSnapshot = state.minionInformation?.resolvedEvilTeam;
    const newTeam = requireCurrentEvilTeam(state);
    if (oldSnapshot === undefined) {
      throw new Error("Expected delivered minion information snapshot");
    }

    expect(oldSnapshot.characterStateRevision).toBe(1);
    expect(newTeam.characterStateRevision).toBe(2);
    expect(newTeam.demon.playerId).not.toBe(oldSnapshot.demon.playerId);

    for (const oldMinion of oldSnapshot.minions) {
      expectMinionKnowledgeFromSnapshot(state, oldMinion);
    }

    for (const newMinion of newTeam.minions) {
      const view = buildPlayerPrivateKnowledgeView(state, newMinion.playerId);
      expectNoTeamKnowledge(view);
    }
  });

  it("preserves delivered DEMON_INFO from its settlement snapshot after current evil team revision changes", () => {
    const state = stateWithRevisedCurrentEvilTeam(stateWithDemonInformation());
    const oldSnapshot = state.demonInformation?.resolvedEvilTeam;
    const newTeam = requireCurrentEvilTeam(state);
    if (oldSnapshot === undefined || state.setup === undefined) {
      throw new Error("Expected delivered demon information snapshot and setup");
    }

    expect(oldSnapshot.characterStateRevision).toBe(1);
    expect(newTeam.characterStateRevision).toBe(2);
    expect(newTeam.demon.playerId).not.toBe(oldSnapshot.demon.playerId);

    const oldDemonView = buildPlayerPrivateKnowledgeView(state, oldSnapshot.demon.playerId);
    expect(oldDemonView.knownMinions).toStrictEqual(oldSnapshot.minions);
    expect(oldDemonView.demonBluffs).toStrictEqual([...state.setup.demonBluffs].sort((left, right) => left.roleId < right.roleId ? -1 : 1));
    expect(oldDemonView.teamKnowledgeModelVersion).toBe(SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION);
    expect(oldDemonView.deliveredKnowledgeStages).toStrictEqual([
      INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
      DEMON_INFORMATION_KNOWLEDGE_STAGE
    ]);

    const newDemonView = buildPlayerPrivateKnowledgeView(state, newTeam.demon.playerId);
    expectNoTeamKnowledge(newDemonView);
  });

  it("allows MINION_INFO and DEMON_INFO to keep different settlement revisions", () => {
    const minionState = stateWithMinionInformation();
    const revisionTwoState = stateWithRevisedCurrentEvilTeam(minionState);
    const revisionTwoTeam = requireCurrentEvilTeam(revisionTwoState);
    if (revisionTwoState.setup === undefined || revisionTwoState.firstNightTaskProgress === undefined) {
      throw new Error("Expected setup and task progress");
    }

    const state = {
      ...revisionTwoState,
      demonInformation: {
        rulesBaselineVersion: RULES_BASELINE_VERSION,
        nightNumber: 1 as const,
        taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system"),
        taskType: "DEMON_INFO" as const,
        knowledgeModelVersion: SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
        knowledgeStage: DEMON_INFORMATION_KNOWLEDGE_STAGE,
        characterStateRevision: revisionTwoTeam.characterStateRevision,
        resolvedEvilTeam: revisionTwoTeam,
        rosterVersion: SUPPORTED_ROSTER_VERSION,
        roleCatalogSignature: revisionTwoState.setup.roleCatalogSignature,
        entries: expectedDemonInformationEntries(revisionTwoTeam.demon, revisionTwoTeam.minions, revisionTwoState.setup.demonBluffs)
      },
      firstNightTaskProgress: {
        settlements: [
          ...revisionTwoState.firstNightTaskProgress.settlements,
          {
            nightNumber: 1 as const,
            taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system"),
            taskType: "DEMON_INFO" as const,
            settlementVersion: "scheduled-task-settlement-v1" as const,
            outcomeType: "DEMON_INFORMATION_DELIVERED" as const,
            characterStateRevision: revisionTwoTeam.characterStateRevision
          }
        ]
      }
    } satisfies GameState;

    expect(state.minionInformation?.resolvedEvilTeam.characterStateRevision).toBe(1);
    expect(state.demonInformation.resolvedEvilTeam.characterStateRevision).toBe(2);
    const oldMinion = state.minionInformation?.resolvedEvilTeam.minions[0];
    if (oldMinion === undefined) {
      throw new Error("Expected old minion");
    }

    expectMinionKnowledgeFromSnapshot(state, oldMinion);
    const newDemonView = buildPlayerPrivateKnowledgeView(state, revisionTwoTeam.demon.playerId);
    expect(newDemonView.knownMinions).toStrictEqual(revisionTwoTeam.minions);
    expect(newDemonView.deliveredKnowledgeStages).toStrictEqual([
      INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
      DEMON_INFORMATION_KNOWLEDGE_STAGE
    ]);
  });

  it("refuses team information projection when the delivered event has not been settled", () => {
    const state = {
      ...stateWithNoPhilosopherTaskPlan(),
      minionInformation: minionInformationDeliveredEvent().payload
    } as GameState;
    const minion = state.assignment?.assignments.find((assignment) => assignment.role.characterType === "MINION");
    if (minion === undefined) {
      throw new Error("Expected minion assignment");
    }

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(state, minion.playerId));
    expectPrivateKnowledgeUnavailable(() => buildAiPrivateKnowledgeView(state, minion.playerId));
  });

  it("fails before projection when canonical private knowledge contains an unknown entry kind", () => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.roster?.entries[0];
    if (viewer === undefined || state.initialPrivateKnowledge === undefined) {
      throw new Error("Expected viewer and private knowledge");
    }

    const tamperedState = {
      ...state,
      initialPrivateKnowledge: {
        ...state.initialPrivateKnowledge,
        entries: [
          ...state.initialPrivateKnowledge.entries,
          {
            kind: "FULL_SECRET_DUMP",
            recipientPlayerId: viewer.playerId,
            fullAssignments: state.assignment?.assignments
          }
        ]
      }
    } as unknown as GameState;

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(tamperedState, viewer.playerId));
    expectPrivateKnowledgeUnavailable(() => buildAiPrivateKnowledgeView(tamperedState, viewer.playerId));
  });

  it("fails before projection when canonical private knowledge carries extra secret fields", () => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.roster?.entries[0];
    if (viewer === undefined || state.initialPrivateKnowledge === undefined) {
      throw new Error("Expected viewer and private knowledge");
    }

    const tamperedState = {
      ...state,
      initialPrivateKnowledge: {
        ...state.initialPrivateKnowledge,
        entries: state.initialPrivateKnowledge.entries.map((entry) =>
          entry.kind === "OWN_CHARACTER" && entry.recipientPlayerId === viewer.playerId
            ? { ...entry, allAssignments: state.assignment?.assignments }
            : entry
        )
      }
    } as unknown as GameState;

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(tamperedState, viewer.playerId));
    expectPrivateKnowledgeUnavailable(() => buildAiPrivateKnowledgeView(tamperedState, viewer.playerId));
  });

  it.each([
    [
      "extra field",
      (state: GameState) => ({
        ...state.firstNight,
        storytellerNotes: "hidden"
      })
    ],
    [
      "unsupported initializationVersion",
      (state: GameState) => ({
        ...state.firstNight,
        initializationVersion: "unsupported-first-night"
      })
    ],
    [
      "rosterVersion mismatch",
      (state: GameState) => ({
        ...state.firstNight,
        rosterVersion: "wrong-roster-version"
      })
    ],
    [
      "assignmentAlgorithmVersion mismatch",
      (state: GameState) => ({
        ...state.firstNight,
        assignmentAlgorithmVersion: "wrong-assignment-version"
      })
    ],
    [
      "roleCatalogSignature mismatch",
      (state: GameState) => ({
        ...state.firstNight,
        roleCatalogSignature: "canonical-role-catalog-v1:deadbeef"
      })
    ]
  ])("fails before projection when FirstNightInitialized payload has %s", (_name, mutateFirstNight) => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.roster?.entries[0];
    if (viewer === undefined) {
      throw new Error("Expected viewer");
    }

    const tamperedState = {
      ...state,
      firstNight: mutateFirstNight(state)
    } as unknown as GameState;

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(tamperedState, viewer.playerId));
  });

  it("fails explicitly for an unknown viewer", () => {
    const state = stateWithPrivateKnowledge();

    expect(() => buildPlayerPrivateKnowledgeView(state, playerId("missing-player")))
      .toThrow(DomainError);
  });

  it("does not expose complete assignments, role catalog, truth labels, or storyteller internals", () => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.roster?.entries[0];
    if (viewer === undefined) {
      throw new Error("Expected viewer");
    }

    const serialized = JSON.stringify(buildPlayerPrivateKnowledgeView(state, viewer.playerId));

    expect(serialized).not.toContain("actualRoles");
    expect(serialized).not.toContain("roleCatalogSnapshot");
    expect(serialized).not.toContain("candidateSet");
    expect(serialized).not.toContain("semanticTruth");
    expect(serialized).not.toContain("reliability");
    expect(serialized).not.toContain("truthConstraint");
    expect(serialized).not.toContain("registrationDecision");
    expect(serialized).not.toContain("storyteller");
  });

  it("projects settled Seamstress target history and answer only to the source player and source AI", () => {
    const state = stateWithSeamstressInformation();
    const delivery = state.seamstressInformation?.deliveries[0];
    if (delivery === undefined) throw new Error("Expected stored Seamstress delivery");

    const playerView = buildPlayerPrivateKnowledgeView(state, delivery.sourcePlayerId);
    const aiView = buildAiPrivateKnowledgeView(state, delivery.sourcePlayerId);
    const expectedHistory = [{
      targets: [
        { playerId: delivery.targetPlayerIds[0], seatNumber: delivery.targetSeatNumbers[0] },
        { playerId: delivery.targetPlayerIds[1], seatNumber: delivery.targetSeatNumbers[1] }
      ],
      deliveredAnswer: delivery.deliveredAnswer
    }];

    expect(playerView.seamstressInformation).toStrictEqual(expectedHistory);
    expect(aiView.seamstressInformation).toStrictEqual(expectedHistory);
    expect(playerView.seamstressKnowledgeModelVersion).toBe(PRIVATE_VIEW_SEAMSTRESS_MODEL_VERSION);
    expect(playerView.deliveredKnowledgeStages).toContain(SEAMSTRESS_INFORMATION_STAGE);
    const serialized = JSON.stringify(playerView);
    for (const hidden of [
      "ruleCorrectAnswer",
      "sourceEffectiveness",
      "deliveryConstraint",
      "answerCandidateSet",
      "informationReliability",
      "simulationReason",
      "abilityInstanceId",
      "abilityUseEntitlementId",
      "sourceRoleTenureId"
    ]) expect(serialized).not.toContain(hidden);
  });

  it("preserves multiple validated Seamstress deliveries as an ordered history array", () => {
    const state = stateWithTwoSeamstressDeliveries();
    const deliveries = state.seamstressInformation?.deliveries;
    if (deliveries?.[0] === undefined || deliveries[1] === undefined) {
      throw new Error("Expected two Seamstress deliveries");
    }

    const view = buildPlayerPrivateKnowledgeView(state, deliveries[0].sourcePlayerId);
    expect(view.seamstressInformation).toHaveLength(2);
    expect(view.seamstressInformation?.map((entry) => entry.deliveredAnswer)).toStrictEqual(
      deliveries.map((delivery) => delivery.deliveredAnswer)
    );
    expect(view.seamstressInformation?.map((entry) => entry.targets.map((target) => target.playerId))).toStrictEqual(
      deliveries.map((delivery) => [...delivery.targetPlayerIds])
    );
  });

  it("fails player and AI projections closed for an exact duplicate Seamstress delivery chain", () => {
    const state = stateWithSeamstressInformation();
    const delivery = state.seamstressInformation?.deliveries[0];
    if (delivery === undefined) throw new Error("Expected stored Seamstress delivery");
    const tampered = {
      ...state,
      seamstressInformation: {
        ...state.seamstressInformation,
        deliveries: [delivery, delivery]
      }
    } as GameState;

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(tampered, delivery.sourcePlayerId));
    expectPrivateKnowledgeUnavailable(() => buildAiPrivateKnowledgeView(tampered, delivery.sourcePlayerId));
  });

  it.each([
    "opportunityId",
    "taskId",
    "abilityUseEntitlementId"
  ] as const)("fails player and AI projections closed when distinct deliveries cross-reuse %s", (chainKey) => {
    const state = stateWithTwoSeamstressDeliveries();
    const first = state.seamstressInformation?.deliveries[0];
    const second = state.seamstressInformation?.deliveries[1];
    if (first === undefined || second === undefined) throw new Error("Expected two stored Seamstress deliveries");
    const tampered = {
      ...state,
      seamstressInformation: {
        ...state.seamstressInformation,
        deliveries: [first, { ...second, [chainKey]: first[chainKey] }]
      }
    } as GameState;

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(tampered, first.sourcePlayerId));
    expectPrivateKnowledgeUnavailable(() => buildAiPrivateKnowledgeView(tampered, first.sourcePlayerId));
  });

  it("does not expose Seamstress targets, answer, or stage to any other player", () => {
    const state = stateWithSeamstressInformation();
    const delivery = state.seamstressInformation?.deliveries[0];
    const other = state.roster?.entries.find((entry) =>
      entry.playerId !== delivery?.sourcePlayerId && !delivery?.targetPlayerIds.includes(entry.playerId)
    );
    if (delivery === undefined || other === undefined) throw new Error("Expected Seamstress delivery and other viewer");

    const playerView = buildPlayerPrivateKnowledgeView(state, other.playerId);
    const aiView = buildAiPrivateKnowledgeView(state, other.playerId);
    expect(playerView.seamstressInformation).toBeUndefined();
    expect(playerView.seamstressKnowledgeModelVersion).toBeUndefined();
    expect(playerView.deliveredKnowledgeStages).not.toContain(SEAMSTRESS_INFORMATION_STAGE);
    expect(aiView.seamstressInformation).toBeUndefined();
    const serialized = JSON.stringify(playerView);
    expect(serialized).not.toContain(delivery.targetPlayerIds[0]);
    expect(serialized).not.toContain(delivery.targetPlayerIds[1]);
    expect(serialized).not.toContain("deliveredAnswer");
  });

  it("keeps delivered Seamstress history unchanged after later current role and alignment changes", () => {
    const state = stateWithSeamstressInformation();
    const delivery = state.seamstressInformation?.deliveries[0];
    if (delivery === undefined || state.currentCharacterState === undefined) throw new Error("Expected Seamstress history state");
    const before = buildPlayerPrivateKnowledgeView(state, delivery.sourcePlayerId).seamstressInformation;
    const changed: GameState = {
      ...state,
      currentCharacterState: {
        revision: state.currentCharacterState.revision + 1,
        entries: state.currentCharacterState.entries.map((entry) => ({
          ...entry,
          currentAlignment: entry.currentAlignment === "GOOD" ? "EVIL" : "GOOD"
        }))
      }
    };

    expect(buildPlayerPrivateKnowledgeView(changed, delivery.sourcePlayerId).seamstressInformation).toStrictEqual(before);
  });

  it.each([
    ["missing choice", (state: GameState) => ({ ...state, seamstressTargetChoices: undefined })],
    ["malformed choice collection", (state: GameState) => ({
      ...state,
      seamstressTargetChoices: { choices: null }
    })],
    ["duplicate choice", (state: GameState) => ({
      ...state,
      seamstressTargetChoices: { choices: [state.seamstressTargetChoices!.choices[0]!, state.seamstressTargetChoices!.choices[0]!] }
    })],
    ["missing spend", (state: GameState) => ({ ...state, seamstressAbilitySpends: undefined })],
    ["missing settlement", (state: GameState) => ({ ...state, firstNightTaskProgress: { settlements: [] } })],
    ["duplicate settlement", (state: GameState) => ({
      ...state,
      firstNightTaskProgress: {
        settlements: [state.firstNightTaskProgress!.settlements[0]!, state.firstNightTaskProgress!.settlements[0]!]
      }
    })],
    ["settlement extra field", (state: GameState) => ({
      ...state,
      firstNightTaskProgress: {
        settlements: [{ ...state.firstNightTaskProgress!.settlements[0]!, hidden: true }]
      }
    })],
    ["missing opportunity", (state: GameState) => ({ ...state, firstNightActionOpportunities: { opportunities: [] } })],
    ["cross-linked opportunity source seat", (state: GameState) => ({
      ...state,
      firstNightActionOpportunities: {
        opportunities: state.firstNightActionOpportunities!.opportunities.map((opportunity) =>
          opportunity.opportunityId === state.seamstressInformation!.deliveries[0]!.opportunityId
            ? { ...opportunity, sourceSeatNumber: opportunity.sourceSeatNumber === 12 ? 11 : 12 }
            : opportunity
        )
      }
    })],
    ["hybrid opportunity ability source", (state: GameState) => ({
      ...state,
      firstNightActionOpportunities: {
        opportunities: state.firstNightActionOpportunities!.opportunities.map((opportunity) =>
          opportunity.opportunityId === state.seamstressInformation!.deliveries[0]!.opportunityId &&
          isSeamstressActionOpportunityV2(opportunity)
            ? {
                ...opportunity,
                abilitySource: {
                  kind: "PHILOSOPHER_GRANT",
                  abilityRoleId: "seamstress",
                  grantId: "philosopher-grant-v1:seat-01:from-seamstress",
                  sourceRoleTenureId: opportunity.sourceRoleTenureId,
                  acquiredCharacterStateRevision: opportunity.sourceCharacterStateRevision
                }
              }
            : opportunity
        )
      }
    })],
    ["delivery source role mismatches tenure", (state: GameState) => ({
      ...state,
      seamstressInformation: {
        deliveries: [{
          ...state.seamstressInformation!.deliveries[0]!,
          sourceRole: state.currentCharacterState!.entries.find((entry) =>
            entry.playerId === state.seamstressInformation!.deliveries[0]!.targetPlayerIds[0]
          )!.role
        }]
      }
    })],
    ["historical chain rules baseline differs from canonical state", (state: GameState) => ({
      ...state,
      seamstressTargetChoices: {
        choices: state.seamstressTargetChoices!.choices.map((choice) => ({ ...choice, rulesBaselineVersion: "tampered-baseline" }))
      },
      seamstressAbilitySpends: {
        spends: state.seamstressAbilitySpends!.spends.map((spend) => ({ ...spend, rulesBaselineVersion: "tampered-baseline" }))
      },
      seamstressInformation: {
        deliveries: state.seamstressInformation!.deliveries.map((delivery) => ({
          ...delivery,
          rulesBaselineVersion: "tampered-baseline"
        }))
      }
    })],
    ["delivery extra field", (state: GameState) => ({
      ...state,
      seamstressInformation: {
        deliveries: [{ ...state.seamstressInformation!.deliveries[0]!, hidden: true }]
      }
    })]
  ] as const)("fails closed for malformed Seamstress historical chain: %s", (_name, tamper) => {
    const state = stateWithSeamstressInformation();
    const sourcePlayerId = state.seamstressInformation!.deliveries[0]!.sourcePlayerId;
    const tampered = tamper(state) as unknown as GameState;

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(tampered, sourcePlayerId));
    expectPrivateKnowledgeUnavailable(() => buildAiPrivateKnowledgeView(tampered, sourcePlayerId));
  });

  it("defensively copies projection results", () => {
    const state = stateWithPrivateKnowledge();
    const demon = state.assignment?.assignments.find((assignment) => assignment.role.characterType === "DEMON");
    if (demon === undefined) {
      throw new Error("Expected demon assignment");
    }

    const first = buildPlayerPrivateKnowledgeView(state, demon.playerId);
    (first.ownCharacter as { roleId: string }).roleId = "mutated-role";
    const bluff = first.demonBluffs[0];
    if (bluff !== undefined) {
      (bluff as { roleId: string }).roleId = "mutated-bluff";
    }
    const minionReference = first.knownMinions[0];
    if (minionReference !== undefined) {
      (minionReference as { playerId: string }).playerId = "mutated-player";
    }

    const second = buildPlayerPrivateKnowledgeView(state, demon.playerId);

    expect(second.ownCharacter.roleId).not.toBe("mutated-role");
    expect(second.demonBluffs[0]?.roleId).not.toBe("mutated-bluff");
    expect(second.knownMinions[0]?.playerId).not.toBe("mutated-player");
  });

  it("keeps pre-Clockmaker private views byte-shape compatible without the new stage or fields", () => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.roster?.entries[0];
    if (viewer === undefined) throw new Error("Expected viewer");
    const view = buildPlayerPrivateKnowledgeView(state, viewer.playerId);
    expect(view).not.toHaveProperty("clockmakerInformation");
    expect(view).not.toHaveProperty("clockmakerKnowledgeModelVersion");
    expect(view.deliveredKnowledgeStages).not.toContain("CLOCKMAKER_INFORMATION");
    expect(buildAiPrivateKnowledgeView(state, viewer.playerId)).toStrictEqual(view);
  });
});

describe("Phase 3 Slice 2B19A3A accepted-stream Dreamer projection", () => {
  it("[2B19A3B1-C30-PROJECTION] projects accepted V2 and V3 histories exactly without version reinterpretation", () => {
    for (const captured of [
      loadAcceptedBaseDreamerV3NormalStreamFixture(),
      loadAcceptedBaseDreamerVortoxV3StreamFixture("GOOD")
    ]) {
      const delivery = captured.events[captured.deliveryEventIndex];
      if (delivery?.eventType !== "DreamerInformationDelivered") throw new Error("Expected Dreamer delivery");
      const playerView = buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(
        captured.events, delivery.payload.sourcePlayerId
      );
      const aiView = buildAiPrivateKnowledgeViewFromAcceptedEventStream(
        captured.events, delivery.payload.sourcePlayerId
      );
      expect(playerView.dreamerInformation).toStrictEqual({
        target: { playerId: delivery.payload.targetPlayerId, seatNumber: delivery.payload.targetSeatNumber },
        goodRole: delivery.payload.goodRole,
        evilRole: delivery.payload.evilRole
      });
      expect(aiView).toStrictEqual(playerView);
      expect(JSON.stringify(playerView)).not.toMatch(/deliverySchemaVersion|informationReliability|vortoxConstraint/i);
    }
  }, 15_000);

  it("[2B19A3A-C04] keeps normal V2 history accepted by the state-only private projection", () => {
    const captured = loadAcceptedBaseDreamerV3NormalStreamFixture();
    const state = rebuildGameState(captured.events);
    const delivery = captured.events[captured.deliveryEventIndex];
    if (delivery?.eventType !== "DreamerInformationDelivered") throw new Error("Expected normal Dreamer delivery");
    const playerView = buildPlayerPrivateKnowledgeView(state, delivery.payload.sourcePlayerId);
    const aiView = buildAiPrivateKnowledgeView(state, delivery.payload.sourcePlayerId);
    expect(playerView.dreamerInformation).toStrictEqual({
      target: { playerId: delivery.payload.targetPlayerId, seatNumber: delivery.payload.targetSeatNumber },
      goodRole: delivery.payload.goodRole,
      evilRole: delivery.payload.evilRole
    });
    expect(aiView).toStrictEqual(playerView);
  });

  it("[2B19A3A-C40/C41/C42/C43/C45] reveals only the historical pair to the source player and AI", () => {
    const captured = loadAcceptedBaseDreamerVortoxV3StreamFixture("GOOD");
    const delivery = captured.events[captured.deliveryEventIndex];
    if (delivery?.eventType !== "DreamerInformationDelivered") throw new Error("Expected Dreamer delivery");
    const playerView = buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(captured.events, delivery.payload.sourcePlayerId);
    const aiView = buildAiPrivateKnowledgeViewFromAcceptedEventStream(captured.events, delivery.payload.sourcePlayerId);
    expect(playerView.dreamerInformation).toStrictEqual({
      target: { playerId: delivery.payload.targetPlayerId, seatNumber: delivery.payload.targetSeatNumber },
      goodRole: delivery.payload.goodRole,
      evilRole: delivery.payload.evilRole
    });
    expect(aiView).toStrictEqual(playerView);
    const otherView = buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(captured.events, delivery.payload.targetPlayerId);
    expect(otherView).not.toHaveProperty("dreamerInformation");
    const visible = playerView as unknown as Record<string, unknown>;
    expect(visible).not.toHaveProperty("vortoxConstraint");
    expect(visible).not.toHaveProperty("informationReliability");
    expect(JSON.stringify(playerView)).not.toContain("VORTOX_FORCED_FALSE");
  }, 15_000);

  it("[2B19A3A-C44] rejects V3 from the state-only projection boundary", () => {
    const captured = loadAcceptedBaseDreamerVortoxV3StreamFixture("GOOD");
    const delivery = captured.events[captured.deliveryEventIndex];
    if (delivery?.eventType !== "DreamerInformationDelivered") throw new Error("Expected Dreamer delivery");
    expect(() => buildPlayerPrivateKnowledgeView(captured.finalState, delivery.payload.sourcePlayerId))
      .toThrowError(DomainError);
    expect(() => buildAiPrivateKnowledgeView(captured.finalState, delivery.payload.sourcePlayerId))
      .toThrowError(DomainError);
  }, 15_000);

  it("[2B19A3A-C47] projection leaves accepted historical payload bytes unchanged", () => {
    const captured = loadAcceptedBaseDreamerVortoxV3StreamFixture("GOOD");
    const delivery = captured.events[captured.deliveryEventIndex];
    if (delivery?.eventType !== "DreamerInformationDelivered") throw new Error("Expected Dreamer delivery");
    const before = structuredClone(delivery.payload);
    buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(captured.events, delivery.payload.sourcePlayerId);
    expect(captured.events[captured.deliveryEventIndex]?.payload).toStrictEqual(before);
  }, 15_000);
  });

  it("[2B19A3B1-C38] rejects V4 from the state-only player and AI projection boundaries", () => {
    const captured = loadAcceptedBaseDreamerVortoxV3StreamFixture("GOOD");
    const state = structuredClone(captured.finalState);
    const delivery = state.dreamerInformation?.deliveries[0];
    if (delivery === undefined || !("deliverySchemaVersion" in delivery)) {
      throw new Error("Expected versioned Dreamer delivery");
    }
    (delivery as unknown as Record<string, unknown>).deliverySchemaVersion = "dreamer-information-delivered-v4";
    expect(() => buildPlayerPrivateKnowledgeView(state, delivery.sourcePlayerId))
      .toThrowError(DomainError);
    expect(() => buildAiPrivateKnowledgeView(state, delivery.sourcePlayerId))
      .toThrowError(DomainError);
  });

  it("[2B20A-C28] rejects state-only V7 for both player and AI projection authority", () => {
    const captured = loadAcceptedBaseDreamerVortoxV3StreamFixture("GOOD");
    const state = structuredClone(captured.finalState);
    const delivery = state.dreamerInformation?.deliveries[0];
    if (delivery === undefined || !("deliverySchemaVersion" in delivery)) throw new Error("Expected versioned delivery");
    (delivery as unknown as Record<string, unknown>).deliverySchemaVersion = "dreamer-information-delivered-v7";
    for (const project of [buildPlayerPrivateKnowledgeView, buildAiPrivateKnowledgeView]) {
      try {
        project(state, delivery.sourcePlayerId);
        throw new Error("Expected PrivateKnowledgeUnavailable");
      } catch (error) {
        expect(error).toMatchObject({ code: "PrivateKnowledgeUnavailable" });
      }
    }
  });

  it("[2B20A-C29] rejects hostile state-only V7 accessors and proxies without invoking getters", () => {
    const captured = loadAcceptedBaseDreamerVortoxV3StreamFixture("GOOD");
    const sourcePlayerId = captured.finalState.dreamerInformation?.deliveries[0]?.sourcePlayerId;
    if (sourcePlayerId === undefined) throw new Error("Expected Dreamer source");
    let getterCalls = 0;
    const accessorState = structuredClone(captured.finalState);
    const accessor = accessorState.dreamerInformation?.deliveries[0] as unknown as Record<string, unknown>;
    Object.defineProperty(accessor, "deliverySchemaVersion", { enumerable: true, get: () => {
      getterCalls += 1; throw new Error("getter");
    } });
    const proxyState = structuredClone(captured.finalState);
    const proxy = Proxy.revocable(proxyState.dreamerInformation!.deliveries[0]!, {}); proxy.revoke();
    (proxyState.dreamerInformation!.deliveries as unknown as unknown[])[0] = proxy.proxy;
    for (const state of [accessorState, proxyState]) {
      try {
        buildPlayerPrivateKnowledgeView(state, sourcePlayerId);
        throw new Error("Expected PrivateKnowledgeUnavailable");
      } catch (error) {
        expect(error).toMatchObject({ code: "PrivateKnowledgeUnavailable" });
      }
    }
    expect(getterCalls).toBe(0);
  });
