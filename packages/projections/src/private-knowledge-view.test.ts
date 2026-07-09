import { describe, expect, it } from "vitest";
import {
  DEMON_INFORMATION_KNOWLEDGE_STAGE,
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  MINION_INFORMATION_KNOWLEDGE_STAGE,
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_ROSTER_VERSION,
  batchId,
  causationId,
  commandId,
  correlationId,
  eventId,
  DomainError,
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
  FirstNightInitializedPayload,
  FirstNightTaskPlanCreatedPayload,
  GameState,
  InitialPrivateKnowledgeEstablishedPayload,
  KnownPlayerReference,
  SetupGeneratedPayload
} from "@botc/domain-core";
import { buildAiPrivateKnowledgeView, buildPlayerPrivateKnowledgeView } from "@botc/projections";
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
    const state = stateWithTaskPlan();
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
      expect(serialized).not.toContain("taskType");
      expect(serialized).not.toContain("sourcePlayerId");
      expect(serialized).not.toContain("pendingRoleTasks");
      expect(serialized).not.toContain("PHILOSOPHER_ACTION");
      expect(serialized).not.toContain("MINION_INFO");
      expect(serialized).not.toContain("DEMON_INFO");
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
});
