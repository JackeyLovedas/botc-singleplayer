import { describe, expect, it } from "vitest";
import * as domainCore from "@botc/domain-core";
import {
  RULES_BASELINE_VERSION,
  DomainError,
  abilityImpairmentId,
  actionOpportunityId,
  batchId,
  cloneFirstNightTaskCatalogSnapshot,
  commandId,
  correlationId,
  eventId,
  isSeamstressActionOpportunityV2,
  playerId,
  rebuildOptionalGameState,
  roleId,
  scheduledTaskId,
  validateDomainBatchSemantics,
  validateDomainEventStream,
  validateFirstNightAbilityOutcomeFactShape
} from "@botc/domain-core";
import type {
  AnyDomainEventEnvelope,
  BatchId,
  EventId,
  FirstNightSystemInformationResolutionResult,
  FirstNightTaskCatalogSnapshot,
  FirstNightTaskPlan,
  FirstNightTaskPlanningFailure,
  FirstNightTaskPlanningResult,
  GameState,
  GameId,
  GeneratedCharacterAssignment,
  SupportedCommandEnvelope,
  AbilityImpairmentSet,
  DomainEventBatch,
  SettleClockmakerInformationCommand
} from "@botc/domain-core";
import {
  GameApplicationService,
  accepted,
  captureSupportedCommand,
  rejected,
  validateCommandFingerprint
} from "@botc/application";
import type {
  CharacterAssignmentGeneratorPort,
  CommandExecutionFailed,
  CommandReceipt,
  CommandReceiptResult,
  CommandRejected,
  CommandResult,
  EventSummaryCommandAccepted,
  FullEventCommandAccepted,
  FirstNightSystemInformationResolverPort,
  FirstNightTaskPlannerPort,
  InitialPrivateKnowledgeBuilderPort,
  IdGenerator,
  Clock,
  SetupGeneratorPort
} from "@botc/application";
import {
  FixedClock,
  FixedIdGenerator,
  MemoryCommandCommitStore,
  aiActor,
  assignCharactersCommand,
  createGameCommand,
  createPlayerRosterCommand,
  generateSetupCommand,
  humanActor,
  ids,
  initializeFirstNightCommand,
  openFirstNightRoleActionOpportunityCommand,
  otherGameId,
  planFirstNightTasksCommand,
  scriptSelectedEvent,
  selectScriptCommand,
  settleFirstNightSystemTaskCommand,
  settleEvilTwinSetupCommand,
  submitPhilosopherActionCommand,
  submitSnakeCharmerActionCommand,
  submitDreamerActionCommand,
  submitSeamstressActionCommand,
  submitWitchActionCommand,
  storytellerActor,
  testAssignmentGenerator,
  testFirstNightTaskCatalog,
  testFirstNightSystemInformationResolver,
  testFirstNightTaskPlanner,
  testInitialPrivateKnowledgeBuilder,
  testSetupGenerator,
  systemActor
} from "@botc/test-harness";
import { buildAiPrivateKnowledgeView, buildPlayerPrivateKnowledgeView } from "@botc/projections";
import { deriveFirstNightAbilityOutcomeFact } from "../../domain-core/src/first-night-ability-outcome-ledger.js";

const makeService = (
  commandStore = new MemoryCommandCommitStore(),
  setupGenerator: SetupGeneratorPort = testSetupGenerator,
  idGenerator: IdGenerator = new FixedIdGenerator(),
  clock: Clock = new FixedClock(),
  characterAssignmentGenerator: CharacterAssignmentGeneratorPort = testAssignmentGenerator,
  initialPrivateKnowledgeBuilder: InitialPrivateKnowledgeBuilderPort = testInitialPrivateKnowledgeBuilder,
  firstNightTaskPlanner: FirstNightTaskPlannerPort = testFirstNightTaskPlanner,
  firstNightTaskCatalogSnapshot: FirstNightTaskCatalogSnapshot = testFirstNightTaskCatalog,
  firstNightSystemInformationResolver: FirstNightSystemInformationResolverPort = testFirstNightSystemInformationResolver
) => {
  const service = new GameApplicationService({
    commandStore,
    ids: idGenerator,
    clock,
    setupGenerator,
    characterAssignmentGenerator,
    initialPrivateKnowledgeBuilder,
    firstNightTaskPlanner,
    firstNightTaskCatalogSnapshot,
    firstNightSystemInformationResolver
  });

  return { service, commandStore };
};

const makeServiceWithoutFirstNightSystemInformationResolver = (
  commandStore = new MemoryCommandCommitStore(),
  idGenerator = new FixedIdGenerator(),
  clock = new FixedClock()
) => {
  const service = new GameApplicationService({
    commandStore,
    ids: idGenerator,
    clock,
    setupGenerator: testSetupGenerator,
    characterAssignmentGenerator: testAssignmentGenerator,
    initialPrivateKnowledgeBuilder: testInitialPrivateKnowledgeBuilder,
    firstNightTaskPlanner: testFirstNightTaskPlanner,
    firstNightTaskCatalogSnapshot: testFirstNightTaskCatalog
  });

  return { service, commandStore };
};

const makeServiceWithoutSetupGenerator = (
  commandStore = new MemoryCommandCommitStore(),
  idGenerator = new FixedIdGenerator(),
  clock = new FixedClock()
) => {
  const service = new GameApplicationService({
    commandStore,
    ids: idGenerator,
    clock
  });

  return { service, commandStore };
};

const makeServiceWithoutAssignmentGenerator = (
  commandStore = new MemoryCommandCommitStore(),
  idGenerator = new FixedIdGenerator(),
  clock = new FixedClock()
) => {
  const service = new GameApplicationService({
    commandStore,
    ids: idGenerator,
    clock,
    setupGenerator: testSetupGenerator
  });

  return { service, commandStore };
};

const makeServiceWithoutInitialPrivateKnowledgeBuilder = (
  commandStore = new MemoryCommandCommitStore(),
  idGenerator = new FixedIdGenerator(),
  clock = new FixedClock()
) => {
  const service = new GameApplicationService({
    commandStore,
    ids: idGenerator,
    clock,
    setupGenerator: testSetupGenerator,
    characterAssignmentGenerator: testAssignmentGenerator
  });

  return { service, commandStore };
};

const makeServiceWithoutFirstNightTaskPlanner = (
  commandStore = new MemoryCommandCommitStore(),
  idGenerator = new FixedIdGenerator(),
  clock = new FixedClock()
) => {
  const service = new GameApplicationService({
    commandStore,
    ids: idGenerator,
    clock,
    setupGenerator: testSetupGenerator,
    characterAssignmentGenerator: testAssignmentGenerator,
    initialPrivateKnowledgeBuilder: testInitialPrivateKnowledgeBuilder
  });

  return { service, commandStore };
};

const expectAcceptedResult: (result: CommandResult) => asserts result is FullEventCommandAccepted = (result) => {
  expect(result.status, JSON.stringify(result)).toBe("accepted");
  expect("events" in result).toBe(true);
};

const expectEventSummaryAcceptedResult: (
  result: CommandResult
) => asserts result is EventSummaryCommandAccepted = (result) => {
  expect(result.status, JSON.stringify(result)).toBe("accepted");
  expect("eventTypes" in result).toBe(true);
  expect("events" in result).toBe(false);
};

const expectFailedResult: (result: CommandResult) => asserts result is CommandExecutionFailed = (result) => {
  expect(result.status).toBe("failed");
};

const reachFirstNight = async (service: GameApplicationService): Promise<void> => {
  await service.execute(createGameCommand());
  await service.execute(selectScriptCommand());
  await service.execute(generateSetupCommand());
  await service.execute(createPlayerRosterCommand());
  await service.execute(assignCharactersCommand());
};

const reachFirstNightKnowledge = async (service: GameApplicationService): Promise<void> => {
  await reachFirstNight(service);
  await service.execute(initializeFirstNightCommand());
};

const reachFirstNightTaskPlan = async (service: GameApplicationService): Promise<void> => {
  await reachFirstNightKnowledge(service);
  await service.execute(planFirstNightTasksCommand());
};

const reachOpenPhilosopherActionOpportunity = async (service: GameApplicationService): Promise<void> => {
  await reachFirstNightTaskPlan(service);
  await service.execute(openFirstNightRoleActionOpportunityCommand());
};

const philosopherGainedSnakeCharmerTaskId = scheduledTaskId("first-night-v2:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-snake_charmer");
const philosopherGainedSnakeCharmerOpportunityId = actionOpportunityId(
  "first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-snake_charmer:opportunity-01"
);

const advancePastSystemInformation = async (
  service: GameApplicationService,
  store: MemoryCommandCommitStore,
  prefix: string
): Promise<void> => {
  for (const taskType of ["MINION_INFO", "DEMON_INFO"] as const) {
    const state = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
    const next = state?.firstNightTaskPlan?.tasks[state.firstNightTaskProgress?.settlements.length ?? 0];
    if (state === undefined || next?.taskType !== taskType) {
      throw new Error(`Expected ${taskType} while advancing V2 task order`);
    }
    const result = await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId(`${prefix}-${taskType.toLowerCase()}`),
      expectedGameVersion: state.gameVersion,
      payload: { commandType: "SettleFirstNightSystemTask", taskId: next.taskId }
    }));
    expectAcceptedResult(result);
  }
};

const reachNextPhilosopherGainedSnakeCharmerTask = async (
  service: GameApplicationService,
  store: MemoryCommandCommitStore,
  prefix: string
): Promise<GameState> => {
  await advancePastSystemInformation(service, store, prefix);
  const beforeBase = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
  const baseTask = beforeBase?.firstNightTaskPlan?.tasks[beforeBase.firstNightTaskProgress?.settlements.length ?? 0];
  if (beforeBase === undefined || baseTask?.taskType !== "SNAKE_CHARMER_ACTION" || baseTask.source.kind !== "ROLE") {
    throw new Error("Expected base Snake Charmer before Philosopher-gained Snake Charmer");
  }
  const opened = await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId(`${prefix}-open-base-snake`),
    expectedGameVersion: beforeBase.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: baseTask.taskId }
  }));
  expectAcceptedResult(opened);
  const openState = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
  const opportunity = openState?.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === baseTask.taskId);
  const target = openState?.currentCharacterState?.entries.find(
    (entry) => entry.playerId !== opportunity?.sourcePlayerId && entry.role.characterType !== "DEMON"
  );
  if (openState === undefined || opportunity === undefined || target === undefined) {
    throw new Error("Expected base Snake Charmer source and non-Demon target");
  }
  const settled = await service.execute(submitSnakeCharmerActionCommand({
    commandId: commandId(`${prefix}-settle-base-snake`),
    expectedGameVersion: openState.gameVersion,
    actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
    payload: {
      commandType: "SubmitSnakeCharmerAction",
      taskId: baseTask.taskId,
      opportunityId: opportunity.opportunityId,
      decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId }
    }
  }));
  expectAcceptedResult(settled);
  const ready = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
  const next = ready?.firstNightTaskPlan?.tasks[ready.firstNightTaskProgress?.settlements.length ?? 0];
  if (ready === undefined || next?.taskId !== philosopherGainedSnakeCharmerTaskId) {
    throw new Error("Expected Philosopher-gained Snake Charmer after the base task");
  }
  return ready;
};

const reachOpenPhilosopherGainedSnakeCharmerOpportunity = async (
  service: GameApplicationService,
  store: MemoryCommandCommitStore
): Promise<void> => {
  await reachOpenPhilosopherActionOpportunity(service);
  const choice = await service.execute(choosePhilosopherRoleCommand("snake_charmer", { commandId: commandId("choose-snake-charmer-for-action") }));
  expectAcceptedResult(choice);
  const ready = await reachNextPhilosopherGainedSnakeCharmerTask(service, store, "advance-gained-snake");
  const opened = await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("open-snake-charmer-for-action"),
    expectedGameVersion: ready.gameVersion,
    payload: {
      commandType: "OpenFirstNightRoleActionOpportunity",
      taskId: philosopherGainedSnakeCharmerTaskId
    }
  }));
  expectAcceptedResult(opened);
};

const choosePhilosopherRoleCommand = (
  chosenRoleId: string,
  overrides: Parameters<typeof submitPhilosopherActionCommand>[0] = {}
) => submitPhilosopherActionCommand({
  commandId: commandId(`choose-${chosenRoleId}`),
  payload: {
    commandType: "SubmitPhilosopherAction",
    taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-10"),
    opportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01"),
    decision: {
      kind: "CHOOSE_GOOD_CHARACTER",
      roleId: roleId(chosenRoleId)
    }
  },
  ...overrides
});

const convertStoredFirstNightPlanToAcceptedV1 = async (
  store: MemoryCommandCommitStore
): Promise<readonly AnyDomainEventEnvelope[]> => {
  const events = await store.loadDomainEvents(ids.game);
  const planCreated = events.find((event) => event.eventType === "FirstNightTaskPlanCreated");
  if (planCreated === undefined) {
    throw new Error("Expected a stored first-night task plan");
  }
  (planCreated.payload as { taskPlanVersion: "first-night-task-plan-v1" | "first-night-task-plan-v2" }).taskPlanVersion =
    "first-night-task-plan-v1";
  validateDomainEventStream(events);
  return events;
};

const reachOpenExactPhilosopherOpportunity = async (
  service: GameApplicationService,
  store: MemoryCommandCommitStore
) => {
  await reachNoPhilosopherFirstNightTaskPlan(service, philosopherClockmakerExactRoleIds);
  const planned = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
  const task = planned?.firstNightTaskPlan?.tasks.find((entry) => entry.taskType === "PHILOSOPHER_ACTION");
  if (planned === undefined || task === undefined) throw new Error("Expected exact Philosopher task");
  const opened = await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("open-exact-philosopher"), expectedGameVersion: planned.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: task.taskId }
  }));
  expectAcceptedResult(opened);
  const state = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
  const opportunity = state?.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === task.taskId);
  if (state === undefined || opportunity === undefined) throw new Error("Expected exact Philosopher opportunity");
  return { state, task, opportunity };
};

const chooseExactPhilosopherRole = (
  chosenRoleId: string,
  context: Awaited<ReturnType<typeof reachOpenExactPhilosopherOpportunity>>,
  commandIdValue: string
) => submitPhilosopherActionCommand({
  commandId: commandId(commandIdValue), expectedGameVersion: context.state.gameVersion, actor: systemActor,
  payload: {
    commandType: "SubmitPhilosopherAction", taskId: context.task.taskId,
    opportunityId: context.opportunity.opportunityId,
    decision: { kind: "CHOOSE_GOOD_CHARACTER", roleId: roleId(chosenRoleId) }
  }
});

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

const noPhilosopherVortoxExactRoleIds = noPhilosopherExactRoleIds.map((id) =>
  id === "fang_gu" ? roleId("vortox") : id === "barber" ? roleId("artist") : id
);
const noPhilosopherNoDashiiExactRoleIds = noPhilosopherExactRoleIds.map((id) =>
  id === "fang_gu" ? roleId("no_dashii") : id === "barber" ? roleId("artist") : id
);
const cerenovusExactRoleIds = noPhilosopherExactRoleIds.map((id) =>
  id === "evil_twin" ? roleId("cerenovus") : id
);
const clockmakerExactRoleIds = noPhilosopherExactRoleIds.map((id) =>
  id === "mathematician" ? roleId("clockmaker") : id
);
const clockmakerVortoxExactRoleIds = clockmakerExactRoleIds.map((id) =>
  id === "fang_gu" ? roleId("vortox") : id === "barber" ? roleId("artist") : id
);
const philosopherClockmakerExactRoleIds = clockmakerExactRoleIds.map((id) =>
  id === "flowergirl" ? roleId("philosopher") : id
);
const philosopherClockmakerVortoxExactRoleIds = philosopherClockmakerExactRoleIds.map((id) =>
  id === "fang_gu" ? roleId("vortox") : id === "barber" ? roleId("artist") : id
);

const reachNextCerenovusActionTask = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore
) => {
  const { baseTask, opportunity: snakeOpportunity, state: snakeState } =
    await reachOpenBaseSnakeCharmerOpportunity(service, commandStore, cerenovusExactRoleIds);
  const snakeTarget = snakeState.currentCharacterState?.entries.find((entry) =>
    entry.playerId !== snakeOpportunity.sourcePlayerId && entry.role.characterType !== "DEMON"
  );
  if (snakeTarget === undefined) throw new Error("Expected Cerenovus fixture Snake Charmer target");
  await service.execute(submitSnakeCharmerActionCommand({
    commandId: commandId("settle-snake-before-cerenovus"), expectedGameVersion: snakeState.gameVersion,
    actor: { kind: "ai", playerId: snakeOpportunity.sourcePlayerId },
    payload: { commandType: "SubmitSnakeCharmerAction", taskId: baseTask.taskId, opportunityId: snakeOpportunity.opportunityId,
      decision: { kind: "CHOOSE_PLAYER", targetPlayerId: snakeTarget.playerId } }
  }));
  const beforeWitch = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const witchTask = beforeWitch?.firstNightTaskPlan?.tasks.find((task) => task.taskType === "WITCH_ACTION");
  if (beforeWitch === undefined || witchTask === undefined) throw new Error("Expected Witch before Cerenovus");
  await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("open-witch-before-cerenovus"), expectedGameVersion: beforeWitch.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: witchTask.taskId }
  }));
  const witchOpen = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const witchOpportunity = witchOpen?.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === witchTask.taskId);
  const witchTarget = witchOpen?.roster?.entries.find((entry) => entry.playerId !== witchOpportunity?.sourcePlayerId);
  if (witchOpen === undefined || witchOpportunity === undefined || witchTarget === undefined) throw new Error("Expected open Witch before Cerenovus");
  await service.execute(submitWitchActionCommand({
    commandId: commandId("settle-witch-before-cerenovus"), expectedGameVersion: witchOpen.gameVersion,
    actor: { kind: "ai", playerId: witchOpportunity.sourcePlayerId },
    payload: { commandType: "SubmitWitchAction", taskId: witchTask.taskId, opportunityId: witchOpportunity.opportunityId,
      decision: { kind: "CHOOSE_PLAYER", targetPlayerId: witchTarget.playerId } }
  }));
  const beforeCerenovus = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const task = beforeCerenovus?.firstNightTaskPlan?.tasks.find((entry) => entry.taskType === "CERENOVUS_ACTION");
  if (beforeCerenovus === undefined || task === undefined) throw new Error("Expected Cerenovus task");
  return { state: beforeCerenovus, task };
};

const reachOpenCerenovusActionOpportunity = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore
) => {
  const { state: beforeCerenovus, task } = await reachNextCerenovusActionTask(service, commandStore);
  await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("open-cerenovus"), expectedGameVersion: beforeCerenovus.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: task.taskId }
  }));
  const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const opportunity = state?.firstNightActionOpportunities?.opportunities.find((entry) =>
    entry.taskId === task.taskId && entry.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION"
  );
  if (state === undefined || opportunity === undefined) throw new Error("Expected open Cerenovus opportunity");
  return { state, task, opportunity };
};

const reachNoPhilosopherFirstNightTaskPlan = async (
  service: GameApplicationService,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = noPhilosopherExactRoleIds
): Promise<void> => {
  await service.execute(createGameCommand());
  await service.execute(selectScriptCommand());
  await service.execute(generateSetupCommand({
    payload: {
      commandType: "GenerateSetup",
      constraints: {
        exactRoleIds
      }
    }
  }));
  await service.execute(createPlayerRosterCommand());
  await service.execute(assignCharactersCommand());
  await service.execute(initializeFirstNightCommand());
  await service.execute(planFirstNightTasksCommand());
};

const reachOpenBaseSnakeCharmerOpportunity = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = noPhilosopherExactRoleIds
) => {
  await reachNoPhilosopherFirstNightTaskPlan(service, exactRoleIds);
  await service.execute(settleFirstNightSystemTaskCommand({
    commandId: commandId("settle-minion-before-base-snake"),
    expectedGameVersion: 7
  }));
  await service.execute(settleFirstNightSystemTaskCommand({
    commandId: commandId("settle-demon-before-base-snake"),
    expectedGameVersion: 8,
    payload: {
      commandType: "SettleFirstNightSystemTask",
      taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system")
    }
  }));
  const beforeOpenState = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const baseTask = beforeOpenState?.firstNightTaskPlan?.tasks.find((task) =>
    task.taskType === "SNAKE_CHARMER_ACTION" &&
    task.source.kind === "ROLE" &&
    task.source.role.roleId === "snake_charmer"
  );
  if (baseTask === undefined) {
    throw new Error("Expected base Snake Charmer task");
  }

  const openResult = await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("open-base-snake-action"),
    expectedGameVersion: 9,
    payload: {
      commandType: "OpenFirstNightRoleActionOpportunity",
      taskId: baseTask.taskId
    }
  }));
  expectAcceptedResult(openResult);

  const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const opportunity = state?.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.taskId === baseTask.taskId &&
    candidate.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION"
  );
  if (state === undefined || opportunity === undefined) {
    throw new Error("Expected open base Snake Charmer opportunity");
  }

  return { baseTask, opportunity, state };
};

const reachEvilTwinSetupTask = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = noPhilosopherExactRoleIds
) => {
  const { baseTask, opportunity, state } = await reachOpenBaseSnakeCharmerOpportunity(service, commandStore, exactRoleIds);
  const target = state.currentCharacterState?.entries.find((entry) =>
    entry.role.characterType !== "DEMON" &&
    entry.playerId !== opportunity.sourcePlayerId
  );
  if (target === undefined) {
    throw new Error("Expected base Snake Charmer non-Demon target");
  }

  const snakeResult = await service.execute(submitSnakeCharmerActionCommand({
    commandId: commandId("settle-base-snake-before-evil-twin"),
    expectedGameVersion: 10,
    payload: {
      commandType: "SubmitSnakeCharmerAction",
      taskId: baseTask.taskId,
      opportunityId: opportunity.opportunityId,
      decision: {
        kind: "CHOOSE_PLAYER",
        targetPlayerId: target.playerId
      }
    }
  }));
  expectAcceptedResult(snakeResult);

  const beforeEvilTwin = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const evilTwinTask = beforeEvilTwin?.firstNightTaskPlan?.tasks.find((task) => task.taskType === "EVIL_TWIN_SETUP");
  if (beforeEvilTwin === undefined || evilTwinTask === undefined) {
    throw new Error("Expected Evil Twin setup task");
  }

  expect(beforeEvilTwin.firstNightTaskProgress?.settlements.map((settlement) => settlement.taskType)).toStrictEqual([
    "MINION_INFO",
    "DEMON_INFO",
    "SNAKE_CHARMER_ACTION"
  ]);
  expect(beforeEvilTwin.firstNightTaskPlan && beforeEvilTwin.firstNightTaskProgress
    ? beforeEvilTwin.firstNightTaskPlan.tasks[beforeEvilTwin.firstNightTaskProgress.settlements.length]?.taskType
    : undefined
  ).toBe("EVIL_TWIN_SETUP");

  return { beforeEvilTwin, evilTwinTask };
};

const reachWitchActionTask = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = noPhilosopherExactRoleIds
) => {
  const { evilTwinTask } = await reachEvilTwinSetupTask(service, commandStore, exactRoleIds);
  const evilTwinResult = await service.execute(settleEvilTwinSetupCommand({
    commandId: commandId("settle-evil-twin-before-witch"),
    expectedGameVersion: 11,
    payload: {
      commandType: "SettleEvilTwinSetup",
      taskId: evilTwinTask.taskId
    }
  }));
  expectAcceptedResult(evilTwinResult);

  const beforeWitch = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const witchTask = beforeWitch?.firstNightTaskPlan?.tasks.find((task) => task.taskType === "WITCH_ACTION");
  if (beforeWitch === undefined || witchTask === undefined) {
    throw new Error("Expected Witch action task");
  }

  expect(beforeWitch.firstNightTaskPlan && beforeWitch.firstNightTaskProgress
    ? beforeWitch.firstNightTaskPlan.tasks[beforeWitch.firstNightTaskProgress.settlements.length]?.taskType
    : undefined
  ).toBe("WITCH_ACTION");

  return { beforeWitch, witchTask };
};

const reachOpenWitchActionOpportunity = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = noPhilosopherExactRoleIds
) => {
  const { beforeWitch, witchTask } = await reachWitchActionTask(service, commandStore, exactRoleIds);
  const openResult = await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("open-witch-action"),
    expectedGameVersion: 12,
    payload: {
      commandType: "OpenFirstNightRoleActionOpportunity",
      taskId: witchTask.taskId
    }
  }));
  expectAcceptedResult(openResult);

  const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const opportunity = state?.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.taskId === witchTask.taskId &&
    candidate.opportunityKind === "WITCH_FIRST_NIGHT_ACTION"
  );
  if (state === undefined || opportunity === undefined) {
    throw new Error("Expected open Witch opportunity");
  }

  return { beforeWitch, witchTask, opportunity, state };
};

const reachClockmakerInformationTask = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = clockmakerExactRoleIds
) => {
  const { witchTask, opportunity, state } = await reachOpenWitchActionOpportunity(service, commandStore, exactRoleIds);
  const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
  if (target === undefined) throw new Error("Expected Witch target before Clockmaker");
  const result = await service.execute(submitWitchActionCommand({
    commandId: commandId("settle-witch-before-clockmaker"), expectedGameVersion: state.gameVersion,
    payload: { commandType: "SubmitWitchAction", taskId: witchTask.taskId, opportunityId: opportunity.opportunityId,
      decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } }
  }));
  expectAcceptedResult(result);
  const ready = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const task = ready?.firstNightTaskPlan?.tasks.find((entry) => entry.taskType === "CLOCKMAKER_INFORMATION");
  if (ready === undefined || task === undefined) throw new Error("Expected Clockmaker information task");
  expect(ready.firstNightTaskPlan?.tasks[ready.firstNightTaskProgress?.settlements.length ?? 0]?.taskId).toBe(task.taskId);
  return { state: ready, task };
};

const settleClockmakerCommand = (
  state: GameState,
  taskIdValue: ReturnType<typeof scheduledTaskId>,
  overrides: Partial<SettleClockmakerInformationCommand> = {}
): SettleClockmakerInformationCommand => ({
  commandId: commandId("settle-clockmaker"), gameId: ids.game, expectedGameVersion: state.gameVersion, actor: systemActor,
  issuedAt: "2026-07-11T09:00:00.000Z", correlationId: correlationId("settle-clockmaker"),
  payload: { commandType: "SettleClockmakerInformation", taskId: taskIdValue }, ...overrides
});

const advanceToNextClockmaker = async (
  service: GameApplicationService,
  store: MemoryCommandCommitStore,
  chooseSnakeDemon = false,
  idPrefix = "advance-clockmaker"
): Promise<{ readonly state: GameState; readonly task: NonNullable<GameState["firstNightTaskPlan"]>["tasks"][number] }> => {
  for (let step = 0; step < 12; step += 1) {
    const state = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
    const next = state?.firstNightTaskPlan?.tasks[state.firstNightTaskProgress?.settlements.length ?? 0];
    if (state === undefined || next === undefined) throw new Error("Expected next task while advancing Clockmaker");
    if (next.taskType === "CLOCKMAKER_INFORMATION") return { state, task: next };
    if (next.taskType === "MINION_INFO" || next.taskType === "DEMON_INFO") {
      await service.execute(settleFirstNightSystemTaskCommand({ commandId: commandId(`${idPrefix}-${step}`), expectedGameVersion: state.gameVersion,
        payload: { commandType: "SettleFirstNightSystemTask", taskId: next.taskId } }));
      continue;
    }
    if (next.taskType === "SNAKE_CHARMER_ACTION") {
      await service.execute(openFirstNightRoleActionOpportunityCommand({ commandId: commandId(`${idPrefix}-open-snake-${step}`), expectedGameVersion: state.gameVersion,
        payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: next.taskId } }));
      const opened = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
      const opportunity = opened?.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === next.taskId);
      const target = opened?.currentCharacterState?.entries.find((entry) => entry.playerId !== opportunity?.sourcePlayerId &&
        (chooseSnakeDemon ? entry.role.characterType === "DEMON" : entry.role.characterType !== "DEMON"));
      if (opened === undefined || opportunity === undefined || target === undefined) throw new Error("Expected Snake Charmer advance target");
      await service.execute(submitSnakeCharmerActionCommand({ commandId: commandId(`${idPrefix}-snake-${step}`), expectedGameVersion: opened.gameVersion,
        actor: { kind: "ai", playerId: opportunity.sourcePlayerId }, payload: { commandType: "SubmitSnakeCharmerAction", taskId: next.taskId,
          opportunityId: opportunity.opportunityId, decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } } }));
      continue;
    }
    if (next.taskType === "EVIL_TWIN_SETUP") {
      await service.execute(settleEvilTwinSetupCommand({ commandId: commandId(`${idPrefix}-evil-twin-${step}`), expectedGameVersion: state.gameVersion,
        payload: { commandType: "SettleEvilTwinSetup", taskId: next.taskId } }));
      continue;
    }
    if (next.taskType === "WITCH_ACTION") {
      await service.execute(openFirstNightRoleActionOpportunityCommand({ commandId: commandId(`${idPrefix}-open-witch-${step}`), expectedGameVersion: state.gameVersion,
        payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: next.taskId } }));
      const opened = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
      const opportunity = opened?.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === next.taskId);
      const target = opened?.roster?.entries.find((entry) => entry.playerId !== opportunity?.sourcePlayerId);
      if (opened === undefined || opportunity === undefined || target === undefined) throw new Error("Expected Witch advance target");
      await service.execute(submitWitchActionCommand({ commandId: commandId(`${idPrefix}-witch-${step}`), expectedGameVersion: opened.gameVersion,
        actor: { kind: "ai", playerId: opportunity.sourcePlayerId }, payload: { commandType: "SubmitWitchAction", taskId: next.taskId,
          opportunityId: opportunity.opportunityId, decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } } }));
      continue;
    }
    throw new Error(`Unsupported advance task ${next.taskType}`);
  }
  throw new Error("Clockmaker advance exceeded bounded steps");
};

const advanceToScheduledTask = async (
  service: GameApplicationService,
  store: MemoryCommandCommitStore,
  targetTaskId: ReturnType<typeof scheduledTaskId>,
  idPrefix: string
): Promise<GameState> => {
  for (let step = 0; step < 24; step += 1) {
    const state = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
    const next = state?.firstNightTaskPlan?.tasks[state.firstNightTaskProgress?.settlements.length ?? 0];
    if (state === undefined || next === undefined) throw new Error("Expected next task while advancing V2 schedule");
    if (next.taskId === targetTaskId) return state;
    if (next.taskType === "MINION_INFO" || next.taskType === "DEMON_INFO") {
      const result = await service.execute(settleFirstNightSystemTaskCommand({
        commandId: commandId(`${idPrefix}-system-${step}`), expectedGameVersion: state.gameVersion,
        payload: { commandType: "SettleFirstNightSystemTask", taskId: next.taskId }
      }));
      expectAcceptedResult(result);
      continue;
    }
    if (next.taskType === "SNAKE_CHARMER_ACTION" || next.taskType === "WITCH_ACTION" || next.taskType === "DREAMER_ACTION" || next.taskType === "SEAMSTRESS_ACTION") {
      const opened = await service.execute(openFirstNightRoleActionOpportunityCommand({
        commandId: commandId(`${idPrefix}-open-${step}`), expectedGameVersion: state.gameVersion,
        payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: next.taskId }
      }));
      expectAcceptedResult(opened);
      const openState = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
      const opportunity = openState?.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === next.taskId);
      if (openState === undefined || opportunity === undefined) throw new Error("Expected opened role opportunity while advancing V2 schedule");
      if (next.taskType === "SEAMSTRESS_ACTION") {
        const result = await service.execute(submitSeamstressActionCommand({
          commandId: commandId(`${idPrefix}-seamstress-${step}`), expectedGameVersion: openState.gameVersion,
          actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
          payload: { commandType: "SubmitSeamstressAction", taskId: next.taskId, opportunityId: opportunity.opportunityId, decision: { kind: "DEFER" } }
        }));
        expectEventSummaryAcceptedResult(result);
        continue;
      }
      const target = openState.currentCharacterState?.entries.find((entry) =>
        entry.playerId !== opportunity.sourcePlayerId && (next.taskType !== "SNAKE_CHARMER_ACTION" || entry.role.characterType !== "DEMON")
      );
      if (target === undefined) throw new Error("Expected role-action target while advancing V2 schedule");
      const result = next.taskType === "SNAKE_CHARMER_ACTION"
        ? await service.execute(submitSnakeCharmerActionCommand({
            commandId: commandId(`${idPrefix}-snake-${step}`), expectedGameVersion: openState.gameVersion,
            actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
            payload: { commandType: "SubmitSnakeCharmerAction", taskId: next.taskId, opportunityId: opportunity.opportunityId,
              decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } }
          }))
        : next.taskType === "WITCH_ACTION"
          ? await service.execute(submitWitchActionCommand({
              commandId: commandId(`${idPrefix}-witch-${step}`), expectedGameVersion: openState.gameVersion,
              actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
              payload: { commandType: "SubmitWitchAction", taskId: next.taskId, opportunityId: opportunity.opportunityId,
                decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } }
            }))
          : await service.execute(submitDreamerActionCommand({
              commandId: commandId(`${idPrefix}-dreamer-${step}`), expectedGameVersion: openState.gameVersion,
              actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
              payload: { commandType: "SubmitDreamerAction", taskId: next.taskId, opportunityId: opportunity.opportunityId,
                decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } }
            }));
      expectAcceptedResult(result);
      continue;
    }
    if (next.taskType === "EVIL_TWIN_SETUP") {
      const result = await service.execute(settleEvilTwinSetupCommand({
        commandId: commandId(`${idPrefix}-evil-twin-${step}`), expectedGameVersion: state.gameVersion,
        payload: { commandType: "SettleEvilTwinSetup", taskId: next.taskId }
      }));
      expectAcceptedResult(result);
      continue;
    }
    if (next.taskType === "CLOCKMAKER_INFORMATION") {
      const result = await service.execute(settleClockmakerCommand(state, next.taskId, {
        commandId: commandId(`${idPrefix}-clockmaker-${step}`)
      }));
      expectEventSummaryAcceptedResult(result);
      continue;
    }
    if (next.taskType === "CERENOVUS_ACTION") {
      const opened = await service.execute(openFirstNightRoleActionOpportunityCommand({
        commandId: commandId(`${idPrefix}-open-cerenovus-${step}`), expectedGameVersion: state.gameVersion,
        payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: next.taskId }
      }));
      expectAcceptedResult(opened);
      const openState = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
      const opportunity = openState?.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === next.taskId);
      const target = openState?.roster?.entries.find((entry) => entry.playerId !== opportunity?.sourcePlayerId);
      if (openState === undefined || opportunity === undefined || target === undefined) {
        throw new Error("Expected Cerenovus source and target while advancing V2 schedule");
      }
      const result = await service.execute({
        commandId: commandId(`${idPrefix}-cerenovus-${step}`), gameId: ids.game, expectedGameVersion: openState.gameVersion,
        actor: { kind: "ai", playerId: opportunity.sourcePlayerId }, issuedAt: "2026-07-12T00:00:00.000Z",
        correlationId: correlationId(`${idPrefix}-cerenovus-${step}`),
        payload: { commandType: "SubmitCerenovusAction", taskId: next.taskId, opportunityId: opportunity.opportunityId,
          decision: { kind: "CHOOSE_PLAYER_AND_CHARACTER", targetPlayerId: target.playerId, chosenRoleId: roleId("dreamer") } }
      });
      expectEventSummaryAcceptedResult(result);
      continue;
    }
    throw new Error(`Unsupported V2 advancement task ${next.taskType}`);
  }
  throw new Error("V2 schedule advancement exceeded bounded steps");
};

const reachGainedClockmakerTask = async (
  service: GameApplicationService,
  store: MemoryCommandCommitStore,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = philosopherClockmakerExactRoleIds
) => {
  await reachNoPhilosopherFirstNightTaskPlan(service, exactRoleIds);
  const planned = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
  const philosopherTask = planned?.firstNightTaskPlan?.tasks[0];
  if (planned === undefined || philosopherTask?.taskType !== "PHILOSOPHER_ACTION") throw new Error("Expected Philosopher first");
  await service.execute(openFirstNightRoleActionOpportunityCommand({ commandId: commandId("open-philosopher-clockmaker"), expectedGameVersion: planned.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: philosopherTask.taskId } }));
  const opened = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
  const opportunity = opened?.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === philosopherTask.taskId);
  if (opened === undefined || opportunity === undefined) throw new Error("Expected Philosopher Clockmaker opportunity");
  await service.execute(submitPhilosopherActionCommand({ commandId: commandId("choose-clockmaker"), expectedGameVersion: opened.gameVersion, actor: systemActor,
    payload: { commandType: "SubmitPhilosopherAction", taskId: philosopherTask.taskId, opportunityId: opportunity.opportunityId,
      decision: { kind: "CHOOSE_GOOD_CHARACTER", roleId: roleId("clockmaker") } } }));
  const firstClockmaker = await advanceToNextClockmaker(service, store, false, "advance-gained-clockmaker");
  if (firstClockmaker.task.source.kind === "ROLE") {
    const baseResult = await service.execute(settleClockmakerCommand(
      firstClockmaker.state,
      firstClockmaker.task.taskId,
      { commandId: commandId("settle-base-before-gained-clockmaker") }
    ));
    expectEventSummaryAcceptedResult(baseResult);
  }
  const gained = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
  const task = gained?.firstNightTaskPlan?.tasks[gained.firstNightTaskProgress?.settlements.length ?? 0];
  if (gained === undefined || task?.taskType !== "CLOCKMAKER_INFORMATION" || task.source.kind !== "PHILOSOPHER_GAINED_ABILITY") throw new Error("Expected gained Clockmaker task");
  return { state: gained, task };
};

const reachDreamerActionTask = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = noPhilosopherExactRoleIds
) => {
  const { witchTask, opportunity, state } = await reachOpenWitchActionOpportunity(service, commandStore, exactRoleIds);
  const witchTarget = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
  if (witchTarget === undefined) {
    throw new Error("Expected Witch target before Dreamer");
  }

  const witchResult = await service.execute(submitWitchActionCommand({
    commandId: commandId("settle-witch-before-dreamer"),
    expectedGameVersion: 13,
    payload: {
      commandType: "SubmitWitchAction",
      taskId: witchTask.taskId,
      opportunityId: opportunity.opportunityId,
      decision: {
        kind: "CHOOSE_PLAYER",
        targetPlayerId: witchTarget.playerId
      }
    }
  }));
  expectAcceptedResult(witchResult);

  const beforeDreamer = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const dreamerTask = beforeDreamer?.firstNightTaskPlan?.tasks.find((task) => task.taskType === "DREAMER_ACTION");
  if (beforeDreamer === undefined || dreamerTask === undefined) {
    throw new Error("Expected Dreamer action task");
  }

  expect(beforeDreamer.firstNightTaskPlan && beforeDreamer.firstNightTaskProgress
    ? beforeDreamer.firstNightTaskPlan.tasks[beforeDreamer.firstNightTaskProgress.settlements.length]?.taskType
    : undefined
  ).toBe("DREAMER_ACTION");

  return { beforeDreamer, dreamerTask };
};

const reachOpenDreamerActionOpportunity = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = noPhilosopherExactRoleIds
) => {
  const { beforeDreamer, dreamerTask } = await reachDreamerActionTask(service, commandStore, exactRoleIds);
  const openResult = await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("open-dreamer-action"),
    expectedGameVersion: 14,
    payload: {
      commandType: "OpenFirstNightRoleActionOpportunity",
      taskId: dreamerTask.taskId
    }
  }));
  expectAcceptedResult(openResult);

  const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const opportunity = state?.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.taskId === dreamerTask.taskId &&
    candidate.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION"
  );
  if (state === undefined || opportunity === undefined) {
    throw new Error("Expected open Dreamer opportunity");
  }

  return { beforeDreamer, dreamerTask, opportunity, state };
};

const reachSeamstressActionTask = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = noPhilosopherExactRoleIds
) => {
  const { dreamerTask, opportunity, state } = await reachOpenDreamerActionOpportunity(service, commandStore, exactRoleIds);
  const dreamerTarget = state.currentCharacterState?.entries.find((entry) =>
    entry.playerId !== opportunity.sourcePlayerId
  );
  if (dreamerTarget === undefined) {
    throw new Error("Expected Dreamer target before Seamstress");
  }

  const dreamerResult = await service.execute(submitDreamerActionCommand({
    commandId: commandId("settle-dreamer-before-seamstress"),
    expectedGameVersion: 15,
    payload: {
      commandType: "SubmitDreamerAction",
      taskId: dreamerTask.taskId,
      opportunityId: opportunity.opportunityId,
      decision: {
        kind: "CHOOSE_PLAYER",
        targetPlayerId: dreamerTarget.playerId
      }
    }
  }));
  expectAcceptedResult(dreamerResult);

  const beforeSeamstress = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const seamstressTask = beforeSeamstress?.firstNightTaskPlan?.tasks.find((task) =>
    task.taskType === "SEAMSTRESS_ACTION"
  );
  if (beforeSeamstress === undefined || seamstressTask === undefined) {
    throw new Error("Expected Seamstress action task");
  }

  expect(beforeSeamstress.firstNightTaskPlan && beforeSeamstress.firstNightTaskProgress
    ? beforeSeamstress.firstNightTaskPlan.tasks[beforeSeamstress.firstNightTaskProgress.settlements.length]?.taskType
    : undefined
  ).toBe("SEAMSTRESS_ACTION");

  return { beforeSeamstress, seamstressTask };
};

const reachOpenSeamstressActionOpportunity = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore,
  exactRoleIds: readonly ReturnType<typeof roleId>[] = noPhilosopherExactRoleIds
) => {
  const { beforeSeamstress, seamstressTask } = await reachSeamstressActionTask(service, commandStore, exactRoleIds);
  const openResult = await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("open-seamstress-action"),
    expectedGameVersion: 16,
    payload: {
      commandType: "OpenFirstNightRoleActionOpportunity",
      taskId: seamstressTask.taskId
    }
  }));
  expectAcceptedResult(openResult);

  const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const opportunity = state?.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.taskId === seamstressTask.taskId &&
    candidate.opportunityKind === "SEAMSTRESS_FIRST_NIGHT_ACTION"
  );
  if (state === undefined || opportunity === undefined) {
    throw new Error("Expected open Seamstress opportunity");
  }

  return { beforeSeamstress, seamstressTask, opportunity, state };
};

const reachOpenDrunkBaseSnakeCharmerOpportunity = async (
  service: GameApplicationService,
  commandStore: MemoryCommandCommitStore
) => {
  await reachOpenPhilosopherActionOpportunity(service);
  const choice = await service.execute(choosePhilosopherRoleCommand("snake_charmer", {
    commandId: commandId("choose-snake-charmer-before-drunk-base")
  }));
  expectAcceptedResult(choice);
  await advancePastSystemInformation(service, commandStore, "advance-drunk-base-snake");
  const beforeOpenState = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const baseTask = beforeOpenState?.firstNightTaskPlan?.tasks[beforeOpenState.firstNightTaskProgress?.settlements.length ?? 0];
  if (beforeOpenState === undefined || baseTask?.taskType !== "SNAKE_CHARMER_ACTION" || baseTask.source.kind !== "ROLE") {
    throw new Error("Expected base Snake Charmer task");
  }

  const openResult = await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("open-drunk-base-snake-action"),
    expectedGameVersion: beforeOpenState.gameVersion,
    payload: {
      commandType: "OpenFirstNightRoleActionOpportunity",
      taskId: baseTask.taskId
    }
  }));
  expectAcceptedResult(openResult);

  const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
  const opportunity = state?.firstNightActionOpportunities?.opportunities.find((candidate) =>
    candidate.taskId === baseTask.taskId &&
    candidate.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION"
  );
  if (state === undefined || opportunity === undefined) {
    throw new Error("Expected open drunk base Snake Charmer opportunity");
  }

  return { baseTask, opportunity, state };
};

class FakeLengthCommandStore extends MemoryCommandCommitStore {
  public override async loadDomainEvents(gameIdValue: GameId): Promise<readonly AnyDomainEventEnvelope[]> {
    const events = await super.loadDomainEvents(gameIdValue);
    if (events.length === 0) {
      return events;
    }

    return {
      length: 99,
      [Symbol.iterator]: function* iterateEvents() {
        yield* events;
      }
    } as unknown as readonly AnyDomainEventEnvelope[];
  }
}

class ThrowingCanonicalStreamCommandStore extends MemoryCommandCommitStore {
  public override async loadDomainEvents(gameIdValue: GameId): Promise<readonly AnyDomainEventEnvelope[]> {
    const events = await super.loadDomainEvents(gameIdValue);
    if (events.length === 0) {
      return events;
    }

    return {
      length: events.length,
      [Symbol.iterator]: () => {
        throw new Error("Injected canonical stream iteration failure");
      }
    } as unknown as readonly AnyDomainEventEnvelope[];
  }
}

class ReceiptOverrideCommandStore extends MemoryCommandCommitStore {
  public receiptOverride: CommandReceipt | undefined;

  public override findCommandReceipt(gameIdValue: GameId, commandIdValue: ReturnType<typeof commandId>): Promise<CommandReceipt | undefined> {
    if (this.receiptOverride?.gameId === gameIdValue && this.receiptOverride.commandId === commandIdValue) {
      return Promise.resolve(this.receiptOverride);
    }
    return super.findCommandReceipt(gameIdValue, commandIdValue);
  }
}

class FaultInjectingIdGenerator extends FixedIdGenerator {
  public failNextBatchId = false;
  public failEventCallNumber: number | undefined;
  private eventCallCount = 0;

  public failEventAfter(offset: number): void {
    this.failEventCallNumber = this.eventCallCount + offset;
  }

  public override nextBatchId(): BatchId {
    if (this.failNextBatchId) {
      this.failNextBatchId = false;
      throw new Error("injected batch id failure");
    }

    return super.nextBatchId();
  }

  public override nextEventId(): EventId {
    this.eventCallCount += 1;
    if (this.failEventCallNumber === this.eventCallCount) {
      this.failEventCallNumber = undefined;
      throw new Error(`injected event id failure ${this.eventCallCount}`);
    }

    return super.nextEventId();
  }
}

class FaultInjectingClock extends FixedClock {
  public failClockCallNumber: number | undefined;
  private clockCallCount = 0;

  public failClockAfter(offset: number): void {
    this.failClockCallNumber = this.clockCallCount + offset;
  }

  public override now(): string {
    this.clockCallCount += 1;
    if (this.failClockCallNumber === this.clockCallCount) {
      this.failClockCallNumber = undefined;
      throw new Error(`injected clock failure ${this.clockCallCount}`);
    }

    return super.now();
  }
}

const taskPlanningFailure = (
  failureCode: FirstNightTaskPlanningFailure["failureCode"]
): FirstNightTaskPlanningFailure => ({
  status: "failure",
  failureCode,
  message: `${failureCode} injected`,
  conflictingTaskIds: [scheduledTaskId("first-night-v1:WITCH_ACTION:seat-08")],
  conflictingRoleIds: [roleId("witch")]
});

const expectRetryableFirstNightTaskPlanningFailureWithoutWrites = async (
  planner: FirstNightTaskPlannerPort,
  commandIdValue: string,
  expectedMessagePart: string
): Promise<CommandExecutionFailed> => {
  const commandStore = new MemoryCommandCommitStore();
  const idGenerator = new FixedIdGenerator();
  const clock = new FixedClock();
  const failing = makeService(
    commandStore,
    testSetupGenerator,
    idGenerator,
    clock,
    testAssignmentGenerator,
    testInitialPrivateKnowledgeBuilder,
    planner
  );
  const command = planFirstNightTasksCommand({ commandId: commandId(commandIdValue) });

  await reachFirstNightKnowledge(failing.service);
  const failedResult = await failing.service.execute(command);

  expectFailedResult(failedResult);
  expect(failedResult).toMatchObject({
    code: "DependencyExecutionFailed",
    failureStage: "first-night-task-planning",
    currentGameVersion: 6,
    retryable: true
  });
  expect(failedResult.message).toContain(expectedMessagePart);
  expect(failedResult.message).not.toContain("DomainValidationFailed");
  expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
  expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);
  expect(commandStore.getGameVersion(command.gameId)).toBe(6);
  expect(commandStore.rejectedCount).toBe(0);

  const fixed = makeService(
    commandStore,
    testSetupGenerator,
    idGenerator,
    clock,
    testAssignmentGenerator,
    testInitialPrivateKnowledgeBuilder,
    testFirstNightTaskPlanner
  );
  const retried = await fixed.service.execute(command);

  expectAcceptedResult(retried);
  expect(retried.gameVersion).toBe(7);
  expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(12);

  return failedResult;
};

const expectRetryableFirstNightSystemInformationFailureWithoutWrites = async (
  resolver: FirstNightSystemInformationResolverPort,
  commandIdValue: string,
  expectedMessagePart: string
): Promise<CommandExecutionFailed> => {
  const commandStore = new MemoryCommandCommitStore();
  const idGenerator = new FixedIdGenerator();
  const clock = new FixedClock();
  const failing = makeService(
    commandStore,
    testSetupGenerator,
    idGenerator,
    clock,
    testAssignmentGenerator,
    testInitialPrivateKnowledgeBuilder,
    testFirstNightTaskPlanner,
    testFirstNightTaskCatalog,
    resolver
  );
  const command = settleFirstNightSystemTaskCommand({ commandId: commandId(commandIdValue) });

  await reachNoPhilosopherFirstNightTaskPlan(failing.service);
  const failedResult = await failing.service.execute(command);

  expectFailedResult(failedResult);
  expect(failedResult).toMatchObject({
    code: "DependencyExecutionFailed",
    failureStage: "first-night-system-information",
    currentGameVersion: 7,
    retryable: true
  });
  expect(failedResult.message).toContain(expectedMessagePart);
  expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
  expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(12);
  expect(commandStore.getGameVersion(command.gameId)).toBe(7);
  expect(commandStore.rejectedCount).toBe(0);

  return failedResult;
};

type ApplicationServiceTestShard =
  | "core"
  | "role-actions"
  | "information-and-later-actions"
  | "compatibility-and-failure-boundaries";

const describeApplicationServiceShard = (
  shard: ApplicationServiceTestShard,
  name: string,
  factory: () => void
): void => {
  const configuredShard = process.env.BOTC_APPLICATION_SERVICE_TEST_SHARD;
  if (configuredShard === undefined || configuredShard === shard) {
    describe(name, factory);
  }
};

describeApplicationServiceShard("core", "GameApplicationService", () => {
  it("creates a game with an accepted receipt and one atomic domain event batch", async () => {
    const { service, commandStore } = makeService();
    const command = createGameCommand();

    const result = await service.execute(command);
    const events = await commandStore.loadDomainEvents(command.gameId);
    const receipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expectAcceptedResult(result);
    expect(result.gameId).toBe(command.gameId);
    expect(result.gameVersion).toBe(1);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      eventType: "GameCreated",
      eventSequence: 1,
      gameVersion: 1,
      batchId: result.events[0]?.batchId,
      commandId: command.commandId
    });
    expect(receipt?.result.status).toBe("accepted");
    expect(commandStore.acceptedCount).toBe(1);
    expect(commandStore.rejectedCount).toBe(0);
    expect(commandStore.getGameVersion(command.gameId)).toBe(1);
  });

  it("isolates command receipts by game id while preserving same-game idempotency", async () => {
    const { service, commandStore } = makeService();
    const sharedCommandId = commandId("shared-command");
    const gameA = ids.game;
    const gameB = otherGameId();
    const commandA = createGameCommand({ gameId: gameA, commandId: sharedCommandId });
    const commandB = createGameCommand({
      gameId: gameB,
      commandId: sharedCommandId,
      correlationId: correlationId("correlation-game-b"),
      payload: {
        ...createGameCommand().payload,
        rootSeed: "seed-game-b"
      }
    });

    const firstA = await service.execute(commandA);
    const firstB = await service.execute(commandB);
    const secondA = await service.execute(commandA);

    expect(firstA).toMatchObject({ status: "accepted", gameId: gameA, idempotent: false });
    expect(firstB).toMatchObject({ status: "accepted", gameId: gameB, idempotent: false });
    expect(secondA).toMatchObject({ status: "accepted", gameId: gameA, idempotent: true });
    expect(await commandStore.loadDomainEvents(gameA)).toHaveLength(1);
    expect(await commandStore.loadDomainEvents(gameB)).toHaveLength(1);
    expect(await commandStore.findCommandReceipt(gameA, sharedCommandId)).toBeDefined();
    expect(await commandStore.findCommandReceipt(gameB, sharedCommandId)).toBeDefined();
    expect(commandStore.acceptedCount).toBe(2);
  });

  it("records rejected commands by game id without changing canonical state", async () => {
    const { service, commandStore } = makeService();
    const command = createGameCommand({ expectedGameVersion: 5 });

    const first = await service.execute(command);
    const second = await service.execute(command);
    const events = await commandStore.loadDomainEvents(command.gameId);
    const receipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expect(first).toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch", idempotent: false });
    expect(second).toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch", idempotent: true });
    expect(events).toHaveLength(0);
    expect(receipt?.result).toStrictEqual(first);
    expect(validateCommandFingerprint(receipt?.commandFingerprint)).toBe(true);
    expect(JSON.stringify(first)).not.toContain("canonicalCommandJson");
    expect(JSON.stringify(first)).not.toContain("digestHex");
    expect(commandStore.acceptedCount).toBe(0);
    expect(commandStore.rejectedCount).toBe(1);
    expect(commandStore.getGameVersion(command.gameId)).toBe(0);
  });

  it("returns retryable failure when command receipt read fails and allows retry", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore);
    const command = createGameCommand({ commandId: commandId("receipt-read-retry") });
    commandStore.failReceiptRead = true;

    const failed = await service.execute(command);

    expectFailedResult(failed);
    expect(failed).toMatchObject({
      code: "CommandStoreReadFailed",
      failureStage: "receipt-read",
      retryable: true
    });
    expect("currentGameVersion" in failed).toBe(false);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(0);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(commandStore.acceptedCount).toBe(0);
    expect(commandStore.rejectedCount).toBe(0);
    expect(commandStore.getGameVersion(command.gameId)).toBe(0);

    const retried = await service.execute(command);

    expectAcceptedResult(retried);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
    expect((await commandStore.findCommandReceipt(command.gameId, command.commandId))?.result.status).toBe("accepted");
  });

  it("returns retryable failure when domain event loading fails and allows retry", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore);
    const command = createGameCommand({ commandId: commandId("event-load-retry") });
    commandStore.failEventLoad = true;

    const failed = await service.execute(command);

    expectFailedResult(failed);
    expect(failed).toMatchObject({
      code: "CommandStoreReadFailed",
      failureStage: "event-load",
      retryable: true
    });
    expect("currentGameVersion" in failed).toBe(false);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(0);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(commandStore.acceptedCount).toBe(0);
    expect(commandStore.rejectedCount).toBe(0);
    expect(commandStore.getGameVersion(command.gameId)).toBe(0);

    const retried = await service.execute(command);

    expectAcceptedResult(retried);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
    expect((await commandStore.findCommandReceipt(command.gameId, command.commandId))?.result.status).toBe("accepted");
  });

  it("contains DomainError canonical rebuild failures without saving receipts or appending events", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore);
    await service.execute(createGameCommand());
    const storedEvents = await commandStore.loadDomainEvents(ids.game);
    const created = storedEvents[0] as { eventSequence: number } | undefined;
    if (created === undefined) {
      throw new Error("Expected GameCreated event");
    }
    created.eventSequence = 2;
    const command = selectScriptCommand({ commandId: commandId("state-rebuild-domain-error-retry") });

    const failed = await service.execute(command);

    expectFailedResult(failed);
    expect(failed).toMatchObject({
      code: "CanonicalStateRebuildFailed",
      failureStage: "state-rebuild",
      retryable: true
    });
    expect("currentGameVersion" in failed).toBe(false);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
    expect(commandStore.acceptedCount).toBe(1);
    expect(commandStore.rejectedCount).toBe(0);

    created.eventSequence = 1;
    const retried = await service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(2);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(4);
    expect((await commandStore.findCommandReceipt(command.gameId, command.commandId))?.result.status).toBe("accepted");
  });

  it("contains unknown canonical rebuild exceptions as retryable failures without receipts", async () => {
    const commandStore = new ThrowingCanonicalStreamCommandStore();
    const { service } = makeService(commandStore);
    await service.execute(createGameCommand());
    const command = selectScriptCommand({ commandId: commandId("state-rebuild-unknown-error") });

    const failed = await service.execute(command);

    expectFailedResult(failed);
    expect(failed).toMatchObject({
      code: "CanonicalStateRebuildFailed",
      failureStage: "state-rebuild",
      message: "Injected canonical stream iteration failure",
      retryable: true
    });
    expect("currentGameVersion" in failed).toBe(false);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(commandStore.acceptedCount).toBe(1);
    expect(commandStore.rejectedCount).toBe(0);
  });

  it("returns retryable failure when rejected receipt writing fails and preserves retry semantics", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore);
    const command = createGameCommand({ commandId: commandId("rejected-write-retry"), expectedGameVersion: 5 });
    commandStore.failRejectedReceiptWrite = true;

    const failed = await service.execute(command);

    expectFailedResult(failed);
    expect(failed).toMatchObject({
      code: "CommandReceiptWriteFailed",
      failureStage: "rejected-receipt-write",
      currentGameVersion: 0,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(0);
    expect(commandStore.acceptedCount).toBe(0);
    expect(commandStore.rejectedCount).toBe(0);

    const retried = await service.execute(command);
    const idempotent = await service.execute(command);

    expect(retried).toMatchObject({
      status: "rejected",
      code: "ExpectedGameVersionMismatch",
      idempotent: false
    });
    expect(idempotent).toMatchObject({
      status: "rejected",
      code: "ExpectedGameVersionMismatch",
      idempotent: true
    });
    expect(commandStore.rejectedCount).toBe(1);
  });

  it("enforces setup-generation rejection details at the type boundary", () => {
    const setupFailure = {
      status: "failure" as const,
      failureCode: "NoLegalSetup" as const,
      message: "No legal setup exists",
      conflictingRoleIds: [],
      requestedCounts: undefined,
      availableCounts: undefined,
      constraintsSnapshot: {
        lockedRoleIds: [],
        excludedRoleIds: [],
        exactRoleIds: []
      }
    };
    const validSetupRejected: CommandRejected = {
      status: "rejected",
      gameId: ids.game,
      code: "SetupGenerationFailed",
      message: "No legal setup exists",
      currentGameVersion: 2,
      idempotent: false,
      details: {
        kind: "setup-generation",
        failure: setupFailure
      }
    };
    // @ts-expect-error SetupGenerationFailed must include setup-generation details.
    const missingDetails: CommandRejected = {
      status: "rejected",
      gameId: ids.game,
      code: "SetupGenerationFailed",
      message: "No legal setup exists",
      currentGameVersion: 2,
      idempotent: false
    };
    const invalidGeneralRejected: CommandRejected = {
      status: "rejected",
      gameId: ids.game,
      code: "GameNotCreated",
      message: "Game not created",
      currentGameVersion: 0,
      idempotent: false,
      details: {
        // @ts-expect-error General command rejections must not carry setup-generation details.
        kind: "setup-generation",
        failure: setupFailure
      }
    };
    const retryableFailure: CommandExecutionFailed = {
      status: "failed",
      gameId: ids.game,
      code: "ApplicationNotConfigured",
      message: "Dependency missing",
      failureStage: "setup-generation",
      currentGameVersion: 2,
      retryable: true
    };
    const appendFailure: CommandExecutionFailed = {
      status: "failed",
      gameId: ids.game,
      code: "EventStoreAppendFailed",
      message: "Append failed",
      failureStage: "accepted-commit",
      currentGameVersion: 2,
      retryable: true
    };
    // @ts-expect-error ApplicationNotConfigured cannot be a rejected receipt.
    rejected(ids.game, "ApplicationNotConfigured", "Dependency missing", 0);
    // @ts-expect-error DependencyExecutionFailed cannot be a rejected receipt.
    rejected(ids.game, "DependencyExecutionFailed", "Dependency failed", 0);
    // @ts-expect-error CommandStoreReadFailed cannot be a rejected receipt.
    rejected(ids.game, "CommandStoreReadFailed", "Read failed", 0);
    // @ts-expect-error CanonicalStateRebuildFailed cannot be a rejected receipt.
    rejected(ids.game, "CanonicalStateRebuildFailed", "Rebuild failed", 0);
    // @ts-expect-error CommandReceiptWriteFailed cannot be a rejected receipt.
    rejected(ids.game, "CommandReceiptWriteFailed", "Write failed", 0);
    // @ts-expect-error MetadataGenerationFailed cannot be a rejected receipt.
    rejected(ids.game, "MetadataGenerationFailed", "Metadata failed", 0);
    // @ts-expect-error EventStoreAppendFailed cannot be a rejected receipt.
    rejected(ids.game, "EventStoreAppendFailed", "Append failed", 0);
    // @ts-expect-error Planning dependency failure cannot be a rejected receipt.
    rejected(ids.game, "FirstNightTaskPlanningFailed", "Planning failed", 6, false, {
      kind: "first-night-task-planning",
      failure: {
        status: "failure",
        failureCode: "InvalidTaskPlan",
        message: "Generated task plan was not canonical",
        conflictingTaskIds: [],
        conflictingRoleIds: []
      }
    });
    // @ts-expect-error Obsolete philosopher not-implemented code must not be a command rejection.
    rejected(ids.game, "PhilosopherAbilityChoiceNotImplemented", "Obsolete rejection", 8, false);
    // @ts-expect-error Obsolete Snake Charmer demon-hit not-implemented code must not be a command rejection.
    rejected(ids.game, "SnakeCharmerDemonHitNotImplemented", "Obsolete rejection", 10, false);
    // @ts-expect-error Retryable runtime failures must not be persisted as command receipts.
    const failedReceiptResult: CommandReceiptResult = retryableFailure;
    // @ts-expect-error EventStoreAppendFailed must not be persisted as a command receipt.
    const appendFailureReceiptResult: CommandReceiptResult = appendFailure;

    void validSetupRejected;
    void missingDetails;
    void invalidGeneralRejected;
    void failedReceiptResult;
    void appendFailureReceiptResult;
  });

  it("rejects invalid create-game counts without appending events", async () => {
    const { service, commandStore } = makeService();

    const result = await service.execute(
      createGameCommand({
        payload: {
          ...createGameCommand().payload,
          playerCount: 10
        }
      })
    );

    expect(result).toMatchObject({ status: "rejected", code: "InvalidCreateGameCounts" });
    expect(await commandStore.loadDomainEvents(createGameCommand().gameId)).toHaveLength(0);
    expect(commandStore.rejectedCount).toBe(1);
    expect(commandStore.getGameVersion(createGameCommand().gameId)).toBe(0);
  });

  it("rejects unsupported rules baselines and uses the constant baseline for accepted events", async () => {
    const { service, commandStore } = makeService();
    const rejectedResult = await service.execute(
      createGameCommand({
        payload: {
          ...createGameCommand().payload,
          rulesBaselineVersion: "Phase One v0"
        }
      })
    );

    expect(rejectedResult).toMatchObject({ status: "rejected", code: "UnsupportedRulesBaseline" });
    expect(await commandStore.loadDomainEvents(createGameCommand().gameId)).toHaveLength(0);

    const acceptedResult = await service.execute(createGameCommand({ commandId: commandId("good-rules-command") }));
    const events = await commandStore.loadDomainEvents(createGameCommand().gameId);

    expect(acceptedResult.status).toBe("accepted");
    expect(events[0]?.rulesBaselineVersion).toBe(RULES_BASELINE_VERSION);
    expect(events[0]?.payload.rulesBaselineVersion).toBe(RULES_BASELINE_VERSION);
  });

  it("rejects SelectScript when the game does not exist", async () => {
    const { service, commandStore } = makeService();
    const command = selectScriptCommand({ expectedGameVersion: 0 });

    const result = await service.execute(command);

    expect(result).toMatchObject({ status: "rejected", code: "GameNotCreated" });
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(0);
    expect(commandStore.rejectedCount).toBe(1);
  });

  it("selects script after game creation and advances sequence from rebuilt state", async () => {
    const { service, commandStore } = makeService();

    await service.execute(createGameCommand());
    const result = await service.execute(selectScriptCommand());
    const events = await commandStore.loadDomainEvents(createGameCommand().gameId);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result.events).toHaveLength(3);
    expect(events).toHaveLength(4);
    expect(events[1]).toMatchObject({
      eventType: "ScriptSelected",
      eventSequence: 2,
      gameVersion: 2,
      commandId: selectScriptCommand().commandId
    });
    expect(events[2]).toMatchObject({
      eventType: "SeamstressResolutionCapabilityDeclared",
      eventSequence: 3,
      gameVersion: 2,
      commandId: selectScriptCommand().commandId,
      payload: { scriptId: "sects-and-violets" }
    });
    expect(events[3]).toMatchObject({
      eventType: "PhaseTransitioned",
      eventSequence: 4,
      gameVersion: 2,
      commandId: selectScriptCommand().commandId
    });
    expect(events[1]?.batchId).toBe(events[3]?.batchId);
    expect(events[1]?.commandId).toBe(events[3]?.commandId);
    expect(events[1]?.gameVersion).toBe(events[3]?.gameVersion);
    expect(state?.selectedScript).toMatchObject({ scriptId: "sects-and-violets" });
    expect(state?.phase).toBe("SETUP_GENERATION");
    expect(state?.gameVersion).toBe(2);
    expect(state?.lastEventSequence).toBe(4);
    expect(commandStore.acceptedCount).toBe(2);
  });

  it("returns the original accepted SelectScript result on retry without appending another batch", async () => {
    const { service, commandStore } = makeService();
    const command = selectScriptCommand();

    await service.execute(createGameCommand());
    const first = await service.execute(command);
    const second = await service.execute(command);
    const events = await commandStore.loadDomainEvents(command.gameId);

    expectAcceptedResult(first);
    expectAcceptedResult(second);
    expect(second).toMatchObject({ status: "accepted", idempotent: true, gameId: command.gameId });
    expect(second.events).toStrictEqual(first.events);
    expect(events).toHaveLength(4);
    expect(events[1]?.eventType).toBe("ScriptSelected");
    expect(events[2]?.eventType).toBe("SeamstressResolutionCapabilityDeclared");
    expect(events[3]?.eventType).toBe("PhaseTransitioned");
    expect(commandStore.acceptedCount).toBe(2);
    expect(commandStore.getGameVersion(command.gameId)).toBe(2);
  });

  it("rejects custom SelectScript edition without recording domain events", async () => {
    const { service, commandStore } = makeService();

    await service.execute(createGameCommand());
    const result = await service.execute(selectScriptCommand({
      payload: {
        ...selectScriptCommand().payload,
        edition: "custom"
      }
    }));

    expect(result).toMatchObject({ status: "rejected", code: "UnsupportedScript" });
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(1);
  });

  it("rejects unsupported SelectScript scriptId", async () => {
    const { service } = makeService();

    await service.execute(createGameCommand());
    await expect(service.execute(selectScriptCommand({
      payload: {
        ...selectScriptCommand().payload,
        scriptId: "custom-script"
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "UnsupportedScript" });
  });

  it("rejects unsupported SelectScript scriptName", async () => {
    const { service } = makeService();

    await service.execute(createGameCommand());
    await expect(service.execute(selectScriptCommand({
      payload: {
        ...selectScriptCommand().payload,
        scriptName: "Custom Script"
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "UnsupportedScript" });
  });

  it("rejects a second SelectScript with a new commandId and current gameVersion", async () => {
    const { service, commandStore } = makeService();

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    const secondSelect = selectScriptCommand({
      commandId: commandId("second-script-command"),
      expectedGameVersion: 2,
      payload: {
        ...selectScriptCommand().payload,
        scriptId: "custom-script",
        scriptName: "Custom Script",
        edition: "custom"
      }
    });

    const result = await service.execute(secondSelect);
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expect(result).toMatchObject({ status: "rejected", code: "ScriptAlreadySelected", currentGameVersion: 2 });
    expect(events).toHaveLength(4);
    expect(commandStore.getGameVersion(ids.game)).toBe(2);
    expect(state?.selectedScript).toMatchObject({ scriptId: "sects-and-violets" });
    expect(state?.phase).toBe("SETUP_GENERATION");
  });

  it("does not use the loaded event array length as the sequence authority", async () => {
    const commandStore = new FakeLengthCommandStore();
    const { service } = makeService(commandStore);

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    const events = await MemoryCommandCommitStore.prototype.loadDomainEvents.call(commandStore, ids.game);

    expect(events).toHaveLength(4);
    expect(events[1]?.eventSequence).toBe(2);
    expect(events[2]?.eventSequence).toBe(3);
    expect(events[3]?.eventSequence).toBe(4);
  });

  it("rejects GenerateSetup when the game does not exist", async () => {
    const { service, commandStore } = makeService();
    const command = generateSetupCommand({ expectedGameVersion: 0 });

    const result = await service.execute(command);

    expect(result).toMatchObject({ status: "rejected", code: "GameNotCreated" });
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(0);
  });

  it("rejects GenerateSetup before script selection", async () => {
    const { service, commandStore } = makeService();

    await service.execute(createGameCommand());
    const result = await service.execute(generateSetupCommand({ expectedGameVersion: 1 }));

    expect(result).toMatchObject({ status: "rejected", code: "ScriptNotSelected" });
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(1);
  });

  it("rejects Human and AI actors for GenerateSetup", async () => {
    const { service, commandStore } = makeService();

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());

    await expect(service.execute(generateSetupCommand({
      commandId: commandId("human-setup"),
      actor: humanActor
    }))).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(service.execute(generateSetupCommand({
      commandId: commandId("ai-setup"),
      actor: aiActor
    }))).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(4);
  });

  it("allows System actors to GenerateSetup with a two-event batch", async () => {
    const { service, commandStore } = makeService();

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    const result = await service.execute(generateSetupCommand());
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result.events).toHaveLength(2);
    expect(result.gameVersion).toBe(3);
    expect(events).toHaveLength(6);
    expect(events[4]).toMatchObject({ eventType: "SetupGenerated", eventSequence: 5, gameVersion: 3 });
    expect(events[5]).toMatchObject({ eventType: "PhaseTransitioned", eventSequence: 6, gameVersion: 3 });
    expect(events[4]?.batchId).toBe(events[5]?.batchId);
    expect(events[4]?.commandId).toBe(events[5]?.commandId);
    expect(state?.phase).toBe("CHARACTER_ASSIGNMENT");
    expect(state?.setup?.actualRoles).toHaveLength(12);
    expect("assignment" in (state ?? {})).toBe(false);
  });

  it("allows Storyteller actors to GenerateSetup", async () => {
    const { service } = makeService();

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    await expect(service.execute(generateSetupCommand({ actor: storytellerActor }))).resolves.toMatchObject({
      status: "accepted",
      gameVersion: 3
    });
  });

  it("returns ApplicationNotConfigured for missing SetupGenerator without saving a receipt and allows retry", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const missing = makeServiceWithoutSetupGenerator(commandStore, idGenerator, clock);
    const command = generateSetupCommand({ commandId: commandId("retry-missing-setup-generator") });

    await missing.service.execute(createGameCommand());
    await missing.service.execute(selectScriptCommand());
    const failedResult = await missing.service.execute(command);
    const failedReceipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "ApplicationNotConfigured",
      failureStage: "setup-generation",
      currentGameVersion: 2,
      retryable: true
    });
    expect(failedReceipt).toBeUndefined();
    expect(commandStore.rejectedCount).toBe(0);
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(4);

    const fixed = makeService(commandStore, testSetupGenerator, idGenerator, clock);
    const retried = await fixed.service.execute(command);
    const receipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(3);
    expect(receipt?.result.status).toBe("accepted");
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(6);
  });

  it("returns DependencyExecutionFailed when SetupGenerator throws without saving a receipt and allows retry", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const throwingSetupGenerator: SetupGeneratorPort = {
      generate: () => {
        throw new Error("injected setup generator failure");
      }
    };
    const failing = makeService(commandStore, throwingSetupGenerator, idGenerator, clock);
    const command = generateSetupCommand({ commandId: commandId("retry-throwing-setup-generator") });

    await failing.service.execute(createGameCommand());
    await failing.service.execute(selectScriptCommand());
    const failedResult = await failing.service.execute(command);
    const failedReceipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "setup-generation",
      message: "injected setup generator failure",
      currentGameVersion: 2,
      retryable: true
    });
    expect(failedReceipt).toBeUndefined();
    expect(commandStore.rejectedCount).toBe(0);
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(4);

    const fixed = makeService(commandStore, testSetupGenerator, idGenerator, clock);
    const retried = await fixed.service.execute(command);
    const receipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(3);
    expect(receipt?.result.status).toBe("accepted");
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(6);
  });

  it("rejects unsolvable GenerateSetup without appending events or increasing gameVersion", async () => {
    const { service, commandStore } = makeService();
    const command = generateSetupCommand({
      payload: {
        commandType: "GenerateSetup",
        constraints: { exactRoleIds: [roleId("clockmaker")] }
      }
    });

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    const result = await service.execute(command);
    const events = await commandStore.loadDomainEvents(ids.game);
    const receipt = await commandStore.findCommandReceipt(ids.game, command.commandId);

    expect(result).toMatchObject({ status: "rejected", code: "SetupGenerationFailed", currentGameVersion: 2 });
    expect(events).toHaveLength(4);
    expect(commandStore.getGameVersion(ids.game)).toBe(2);
    expect(receipt?.result.status).toBe("rejected");
  });

  it("preserves structured setup generation failures through receipts and idempotent retry", async () => {
    const structuredFailure = {
      status: "failure" as const,
      failureCode: "InsufficientCandidates" as const,
      message: "Not enough candidates are available for the demon plan",
      conflictingRoleIds: [roleId("clockmaker")],
      requestedCounts: {
        TOWNSFOLK: 8,
        OUTSIDER: 1,
        MINION: 2,
        DEMON: 1
      },
      availableCounts: {
        TOWNSFOLK: 6,
        OUTSIDER: 1,
        MINION: 2,
        DEMON: 1
      },
      constraintsSnapshot: {
        lockedRoleIds: [roleId("clockmaker")],
        excludedRoleIds: [roleId("dreamer")],
        exactRoleIds: []
      }
    };
    const failingSetupGenerator: SetupGeneratorPort = {
      generate: () => structuredFailure
    };
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore, failingSetupGenerator);
    const command = generateSetupCommand({ commandId: commandId("structured-setup-failure") });

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    const first = await service.execute(command);
    const second = await service.execute(command);
    const receipt = await commandStore.findCommandReceipt(ids.game, command.commandId);

    expect(first).toMatchObject({
      status: "rejected",
      code: "SetupGenerationFailed",
      idempotent: false,
      details: {
        kind: "setup-generation",
        failure: structuredFailure
      }
    });
    expect(second).toMatchObject({
      status: "rejected",
      code: "SetupGenerationFailed",
      idempotent: true,
      details: {
        kind: "setup-generation",
        failure: structuredFailure
      }
    });
    expect(receipt?.result).toMatchObject({
      status: "rejected",
      details: {
        kind: "setup-generation",
        failure: structuredFailure
      }
    });
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(4);
  });

  it("returns the original accepted GenerateSetup result on retry", async () => {
    const { service, commandStore } = makeService();
    const command = generateSetupCommand();

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    const first = await service.execute(command);
    const second = await service.execute(command);
    const events = await commandStore.loadDomainEvents(ids.game);

    expectAcceptedResult(first);
    expectAcceptedResult(second);
    expect(second).toMatchObject({ status: "accepted", idempotent: true, gameVersion: 3 });
    expect(second.events).toStrictEqual(first.events);
    expect(events).toHaveLength(6);
  });

  it("rejects stale GenerateSetup expectedGameVersion", async () => {
    const { service } = makeService();

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    await expect(service.execute(generateSetupCommand({ expectedGameVersion: 1 }))).resolves.toMatchObject({
      status: "rejected",
      code: "ExpectedGameVersionMismatch",
      currentGameVersion: 2
    });
  });

  it("rejects GenerateSetup after setup already exists", async () => {
    const { service } = makeService();

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    await service.execute(generateSetupCommand());
    await expect(service.execute(generateSetupCommand({
      commandId: commandId("second-setup"),
      expectedGameVersion: 3
    }))).resolves.toMatchObject({ status: "rejected", code: "SetupAlreadyGenerated" });
  });

  it("creates a fixed player roster from Human or System actors and rejects invalid roster commands", async () => {
    const { service, commandStore } = makeService();

    await expect(service.execute(createPlayerRosterCommand({
      commandId: commandId("roster-before-game"),
      expectedGameVersion: 0
    }))).resolves.toMatchObject({
      status: "rejected",
      code: "GameNotCreated"
    });

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    await expect(service.execute(createPlayerRosterCommand({
      commandId: commandId("roster-before-setup"),
      expectedGameVersion: 2
    }))).resolves.toMatchObject({ status: "rejected", code: "SetupNotGenerated" });

    await service.execute(generateSetupCommand());
    await expect(service.execute(createPlayerRosterCommand({
      commandId: commandId("roster-ai"),
      actor: aiActor
    }))).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(service.execute(createPlayerRosterCommand({
      commandId: commandId("roster-storyteller"),
      actor: storytellerActor
    }))).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(service.execute(createPlayerRosterCommand({
      commandId: commandId("roster-human-mismatch"),
      actor: humanActor,
      payload: {
        ...createPlayerRosterCommand().payload,
        humanPlayerId: playerId("other-human")
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "ActorPlayerMismatch" });
    await expect(service.execute(createPlayerRosterCommand({
      commandId: commandId("roster-empty-name"),
      payload: {
        ...createPlayerRosterCommand().payload,
        humanDisplayName: " "
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "InvalidPlayerRoster" });

    const humanRoster = await service.execute(createPlayerRosterCommand({
      actor: humanActor,
      payload: {
        ...createPlayerRosterCommand().payload,
        humanDisplayName: "  Alice  "
      }
    }));
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(humanRoster);
    expect(humanRoster.events).toHaveLength(1);
    expect(humanRoster.events[0]?.eventType).toBe("PlayerRosterCreated");
    expect(state?.roster?.entries).toHaveLength(12);
    expect(state?.roster?.entries.filter((entry) => entry.playerKind === "HUMAN")).toHaveLength(1);
    expect(state?.roster?.entries[4]).toMatchObject({ playerKind: "HUMAN", seatNumber: 5, displayName: "Alice" });

    await expect(service.execute(createPlayerRosterCommand({
      commandId: commandId("roster-duplicate"),
      expectedGameVersion: 4
    }))).resolves.toMatchObject({ status: "rejected", code: "PlayerRosterAlreadyCreated" });
  });

  it("assigns characters deterministically and transitions to FIRST_NIGHT", async () => {
    const { service, commandStore } = makeService();
    const command = assignCharactersCommand();

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    await service.execute(generateSetupCommand());
    await expect(service.execute(assignCharactersCommand({
      commandId: commandId("assign-before-roster"),
      expectedGameVersion: 3
    }))).resolves.toMatchObject({ status: "rejected", code: "PlayerRosterNotCreated" });

    await service.execute(createPlayerRosterCommand());
    await expect(service.execute(assignCharactersCommand({
      commandId: commandId("assign-human"),
      actor: humanActor
    }))).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(service.execute(assignCharactersCommand({
      commandId: commandId("assign-ai"),
      actor: aiActor
    }))).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });

    const first = await service.execute(command);
    const second = await service.execute(command);
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(first);
    expectAcceptedResult(second);
    expect(first.events.map((event) => event.eventType)).toStrictEqual(["CharactersAssigned", "PhaseTransitioned"]);
    expect(first.gameVersion).toBe(5);
    expect(second).toMatchObject({ status: "accepted", idempotent: true, gameVersion: 5 });
    expect(second.events).toStrictEqual(first.events);
    expect(state?.phase).toBe("FIRST_NIGHT");
    expect(state?.dayNumber).toBe(0);
    expect(state?.nightNumber).toBe(1);
    expect(state?.assignment?.assignments).toHaveLength(12);
    expect(commandStore.acceptedCount).toBe(5);

    await expect(service.execute(assignCharactersCommand({
      commandId: commandId("assign-stale"),
      expectedGameVersion: 4
    }))).resolves.toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch" });
  });

  it("allows Storyteller actors to AssignCharacters", async () => {
    const { service } = makeService();

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    await service.execute(generateSetupCommand());
    await service.execute(createPlayerRosterCommand());
    await expect(service.execute(assignCharactersCommand({ actor: storytellerActor }))).resolves.toMatchObject({
      status: "accepted",
      gameVersion: 5
    });
  });

  it("keeps retryable assignment dependency failures out of command receipts", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const missing = makeServiceWithoutAssignmentGenerator(commandStore, idGenerator, clock);
    const command = assignCharactersCommand({ commandId: commandId("retry-missing-assignment-generator") });

    await missing.service.execute(createGameCommand());
    await missing.service.execute(selectScriptCommand());
    await missing.service.execute(generateSetupCommand());
    await missing.service.execute(createPlayerRosterCommand());
    const failedResult = await missing.service.execute(command);
    const failedReceipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "ApplicationNotConfigured",
      failureStage: "assignment-generation",
      retryable: true
    });
    expect(failedReceipt).toBeUndefined();
    expect(commandStore.rejectedCount).toBe(0);

    const fixed = makeService(commandStore, testSetupGenerator, idGenerator, clock, testAssignmentGenerator);
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(5);
    expect((await commandStore.findCommandReceipt(command.gameId, command.commandId))?.result.status).toBe("accepted");
  });

  it("keeps thrown assignment dependency failures out of command receipts", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const throwingAssignmentGenerator: CharacterAssignmentGeneratorPort = {
      generate: () => {
        throw new Error("injected assignment generator failure");
      }
    };
    const failing = makeService(commandStore, testSetupGenerator, idGenerator, clock, throwingAssignmentGenerator);
    const command = assignCharactersCommand({ commandId: commandId("retry-throwing-assignment-generator") });

    await failing.service.execute(createGameCommand());
    await failing.service.execute(selectScriptCommand());
    await failing.service.execute(generateSetupCommand());
    await failing.service.execute(createPlayerRosterCommand());
    const failedResult = await failing.service.execute(command);
    const failedReceipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "assignment-generation",
      message: "injected assignment generator failure",
      retryable: true
    });
    expect(failedReceipt).toBeUndefined();

    const fixed = makeService(commandStore, testSetupGenerator, idGenerator, clock, testAssignmentGenerator);
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(5);
  });

  it("preserves deterministic assignment generation failures through receipts and idempotent retry", async () => {
    const assignmentFailure = {
      status: "failure" as const,
      failureCode: "InvalidAssignment" as const,
      message: "No deterministic assignment can be produced",
      conflictingPlayerIds: [playerId("human-1")],
      conflictingRoleIds: [roleId("clockmaker")]
    };
    const failingAssignmentGenerator: CharacterAssignmentGeneratorPort = {
      generate: () => assignmentFailure
    };
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore, testSetupGenerator, new FixedIdGenerator(), new FixedClock(), failingAssignmentGenerator);
    const command = assignCharactersCommand({ commandId: commandId("structured-assignment-failure") });

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    await service.execute(generateSetupCommand());
    await service.execute(createPlayerRosterCommand());
    const first = await service.execute(command);
    const second = await service.execute(command);
    const receipt = await commandStore.findCommandReceipt(ids.game, command.commandId);

    expect(first).toMatchObject({
      status: "rejected",
      code: "AssignmentGenerationFailed",
      idempotent: false,
      details: {
        kind: "assignment-generation",
        failure: assignmentFailure
      }
    });
    expect(second).toMatchObject({
      status: "rejected",
      code: "AssignmentGenerationFailed",
      idempotent: true,
      details: {
        kind: "assignment-generation",
        failure: assignmentFailure
      }
    });
    expect(receipt?.result).toMatchObject({
      status: "rejected",
      details: {
        kind: "assignment-generation",
        failure: assignmentFailure
      }
    });
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(7);
  });

  it("keeps unknown batch construction failures retryable without saving DomainValidationFailed receipts", async () => {
    const throwingAssignmentGenerator: CharacterAssignmentGeneratorPort = {
      generate: (input) => {
        const result = testAssignmentGenerator.generate(input);
        if (result.status === "failure") {
          return result;
        }

        const assignment: Partial<GeneratedCharacterAssignment> = {
          rosterVersion: result.assignment.rosterVersion,
          assignmentAlgorithmVersion: result.assignment.assignmentAlgorithmVersion,
          randomAlgorithmVersion: result.assignment.randomAlgorithmVersion,
          randomStream: result.assignment.randomStream,
          roleCatalogSignature: result.assignment.roleCatalogSignature
        };
        Object.defineProperty(assignment, "assignments", {
          enumerable: true,
          get: () => {
            throw new Error("injected assignment payload construction failure");
          }
        });

        return {
          status: "success",
          assignment: assignment as GeneratedCharacterAssignment
        };
      }
    };
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const failing = makeService(commandStore, testSetupGenerator, idGenerator, clock, throwingAssignmentGenerator);
    const command = assignCharactersCommand({ commandId: commandId("unknown-batch-construction-retry") });

    await failing.service.execute(createGameCommand());
    await failing.service.execute(selectScriptCommand());
    await failing.service.execute(generateSetupCommand());
    await failing.service.execute(createPlayerRosterCommand());
    const failed = await failing.service.execute(command);

    expectFailedResult(failed);
    expect(failed).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "command-validation",
      currentGameVersion: 4,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(7);

    const fixed = makeService(commandStore, testSetupGenerator, idGenerator, clock, testAssignmentGenerator);
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(5);
  });

  it("persists true DomainError validation failures as deterministic rejected receipts", async () => {
    const invalidAssignmentGenerator: CharacterAssignmentGeneratorPort = {
      generate: (input) => {
        const result = testAssignmentGenerator.generate(input);
        if (result.status === "failure") {
          return result;
        }

        const first = result.assignment.assignments[0];
        const second = result.assignment.assignments[1];
        if (first === undefined || second === undefined) {
          throw new Error("Expected two assignments");
        }

        return {
          status: "success",
          assignment: {
            ...result.assignment,
            assignments: [first, { ...second, role: first.role }, ...result.assignment.assignments.slice(2)]
          }
        };
      }
    };
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore, testSetupGenerator, new FixedIdGenerator(), new FixedClock(), invalidAssignmentGenerator);
    const command = assignCharactersCommand({ commandId: commandId("domain-error-assignment-rejection") });

    await service.execute(createGameCommand());
    await service.execute(selectScriptCommand());
    await service.execute(generateSetupCommand());
    await service.execute(createPlayerRosterCommand());
    const first = await service.execute(command);
    const second = await service.execute(command);
    const receipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expect(first).toMatchObject({
      status: "rejected",
      code: "DomainValidationFailed",
      idempotent: false,
      currentGameVersion: 4
    });
    expect(second).toMatchObject({
      status: "rejected",
      code: "DomainValidationFailed",
      idempotent: true,
      currentGameVersion: 4
    });
    expect(receipt?.result.status).toBe("rejected");
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(7);
  });

  it("keeps nextBatchId failures retryable without events or receipts", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FaultInjectingIdGenerator();
    const { service } = makeService(commandStore, testSetupGenerator, idGenerator);
    const command = createGameCommand({ commandId: commandId("metadata-batch-retry") });
    idGenerator.failNextBatchId = true;

    const failed = await service.execute(command);

    expectFailedResult(failed);
    expect(failed).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 0,
      retryable: true
    });
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(0);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(commandStore.getGameVersion(command.gameId)).toBe(0);

    const retried = await service.execute(command);

    expectAcceptedResult(retried);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
  });

  it("keeps first nextEventId failures retryable without events or receipts", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FaultInjectingIdGenerator();
    const { service } = makeService(commandStore, testSetupGenerator, idGenerator);
    const command = createGameCommand({ commandId: commandId("metadata-first-event-retry") });
    idGenerator.failEventCallNumber = 1;

    const failed = await service.execute(command);

    expectFailedResult(failed);
    expect(failed).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 0,
      retryable: true
    });
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(0);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(commandStore.getGameVersion(command.gameId)).toBe(0);

    const retried = await service.execute(command);

    expectAcceptedResult(retried);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
  });

  it("keeps later nextEventId failures in multi-event batches retryable without partial events", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FaultInjectingIdGenerator();
    const { service } = makeService(commandStore, testSetupGenerator, idGenerator);
    const command = selectScriptCommand({ commandId: commandId("metadata-second-event-retry") });

    await service.execute(createGameCommand());
    idGenerator.failEventCallNumber = 3;
    const failed = await service.execute(command);

    expectFailedResult(failed);
    expect(failed).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 1,
      retryable: true
    });
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(commandStore.getGameVersion(command.gameId)).toBe(1);

    const retried = await service.execute(command);

    expectAcceptedResult(retried);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(4);
  });

  it("keeps clock failures retryable without events or receipts", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const clock = new FaultInjectingClock();
    const { service } = makeService(commandStore, testSetupGenerator, new FixedIdGenerator(), clock);
    const command = createGameCommand({ commandId: commandId("metadata-clock-retry") });
    clock.failClockCallNumber = 1;

    const failed = await service.execute(command);

    expectFailedResult(failed);
    expect(failed).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 0,
      retryable: true
    });
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(0);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(commandStore.getGameVersion(command.gameId)).toBe(0);

    const retried = await service.execute(command);

    expectAcceptedResult(retried);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
  });

  it("leaves no partial writes when atomic accepted commit fails before commit", async () => {
    const { service, commandStore } = makeService();
    commandStore.failBeforeCommit = true;

    const result = await service.execute(createGameCommand());

    expect(result).toMatchObject({
      status: "failed",
      code: "EventStoreAppendFailed",
      failureStage: "accepted-commit",
      currentGameVersion: 0,
      retryable: true
    });
    expect(await commandStore.loadDomainEvents(createGameCommand().gameId)).toHaveLength(0);
    expect(await commandStore.findCommandReceipt(createGameCommand().gameId, createGameCommand().commandId)).toBeUndefined();
    expect(commandStore.acceptedCount).toBe(0);
    expect(commandStore.getGameVersion(createGameCommand().gameId)).toBe(0);
  });

  it("leaves no partial writes when atomic accepted commit fails during commit and allows retry", async () => {
    const { service, commandStore } = makeService();
    const command = createGameCommand();
    commandStore.failDuringCommit = true;

    const failed = await service.execute(command);
    const retried = await service.execute(command);
    const events = await commandStore.loadDomainEvents(command.gameId);
    const receipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expect(failed).toMatchObject({
      status: "failed",
      code: "EventStoreAppendFailed",
      failureStage: "accepted-commit",
      currentGameVersion: 0,
      retryable: true
    });
    expect(retried).toMatchObject({ status: "accepted", idempotent: false, gameVersion: 1 });
    expect(events).toHaveLength(1);
    expect(receipt?.result.status).toBe("accepted");
    expect(commandStore.acceptedCount).toBe(1);
    expect(commandStore.getGameVersion(command.gameId)).toBe(1);
  });

  it("returns the original accepted result on retry without appending a second batch", async () => {
    const { service, commandStore } = makeService();
    const command = createGameCommand();

    const first = await service.execute(command);
    const second = await service.execute(command);
    const events = await commandStore.loadDomainEvents(command.gameId);

    expectAcceptedResult(first);
    expectAcceptedResult(second);
    expect(second).toMatchObject({ status: "accepted", idempotent: true, gameId: command.gameId });
    expect(second.events).toStrictEqual(first.events);
    expect(events).toHaveLength(1);
    expect(commandStore.acceptedCount).toBe(1);
    expect(commandStore.getReceiptCount()).toBe(1);
  });

  it("leaves no partial SelectScript events when atomic accepted commit fails", async () => {
    const { service, commandStore } = makeService();

    await service.execute(createGameCommand());
    commandStore.failDuringCommit = true;
    const failed = await service.execute(selectScriptCommand());
    const eventsAfterFailure = await commandStore.loadDomainEvents(ids.game);
    const retried = await service.execute(selectScriptCommand());
    const eventsAfterRetry = await commandStore.loadDomainEvents(ids.game);

    expect(failed).toMatchObject({
      status: "failed",
      code: "EventStoreAppendFailed",
      failureStage: "accepted-commit",
      currentGameVersion: 1,
      retryable: true
    });
    expect(eventsAfterFailure).toHaveLength(1);
    expect(eventsAfterFailure[0]?.eventType).toBe("GameCreated");
    expectAcceptedResult(retried);
    expect(retried.events).toHaveLength(3);
    expect(eventsAfterRetry).toHaveLength(4);
    expect(eventsAfterRetry[1]?.eventType).toBe("ScriptSelected");
    expect(eventsAfterRetry[2]?.eventType).toBe("SeamstressResolutionCapabilityDeclared");
    expect(eventsAfterRetry[3]?.eventType).toBe("PhaseTransitioned");
  });

  it("does not allow the commit store to accept a second successful batch for one game command", async () => {
    const { service, commandStore } = makeService();
    const command = createGameCommand();

    await service.execute(command);
    const duplicateEvent = scriptSelectedEvent({
      eventSequence: 2,
      batchId: batchId("duplicate-batch"),
      gameVersion: 2,
      commandId: command.commandId
    });
    const captured = captureSupportedCommand(command);
    if (!captured.valid) throw new Error(captured.reason);

    await expect(
      commandStore.commitAcceptedCommand({
        expectedGameVersion: 1,
        eventBatch: {
          batchId: duplicateEvent.batchId,
          gameId: command.gameId,
          commandId: command.commandId,
          expectedGameVersion: 1,
          committedGameVersion: 2,
          events: [duplicateEvent]
        },
        receipt: {
          commandId: command.commandId,
          gameId: command.gameId,
          commandFingerprint: captured.captured.fingerprint,
          result: accepted(command.gameId, 2, [duplicateEvent])
        }
      })
    ).rejects.toThrow("already");

    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
    expect(commandStore.acceptedCount).toBe(1);
  });

  it("initializes first night private knowledge with one atomic two-event batch", async () => {
    const { service, commandStore } = makeService();
    const command = initializeFirstNightCommand();

    await reachFirstNight(service);
    const result = await service.execute(command);
    const events = await commandStore.loadDomainEvents(command.gameId);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(6);
    expect(result.events).toHaveLength(2);
    expect(result.events[0]).toMatchObject({
      eventType: "FirstNightInitialized",
      eventSequence: 10,
      gameVersion: 6,
      commandId: command.commandId
    });
    expect(result.events[1]).toMatchObject({
      eventType: "InitialPrivateKnowledgeEstablished",
      eventSequence: 11,
      gameVersion: 6,
      commandId: command.commandId
    });
    expect(result.events[0]?.batchId).toBe(result.events[1]?.batchId);
    expect(events).toHaveLength(11);
    expect(state?.phase).toBe("FIRST_NIGHT");
    expect(state?.nightNumber).toBe(1);
    expect(state?.dayNumber).toBe(0);
    expect(state?.firstNight?.initializationVersion).toBe("first-night-initialization-v1");
    expect(state?.initialPrivateKnowledge?.knowledgeModelVersion).toBe("initial-own-character-knowledge-v1");
    expect(state?.initialPrivateKnowledge?.knowledgeStage).toBe("OWN_CHARACTER_BOOTSTRAP");
    expect(state?.initialPrivateKnowledge?.entries.filter((entry) => entry.kind === "OWN_CHARACTER")).toHaveLength(12);
    expect(state?.initialPrivateKnowledge?.entries).toHaveLength(12);
    expect(commandStore.getGameVersion(command.gameId)).toBe(6);
  });

  it("returns the accepted first-night initialization result on retry without appending events", async () => {
    const { service, commandStore } = makeService();
    const command = initializeFirstNightCommand({ commandId: commandId("idempotent-first-night") });

    await reachFirstNight(service);
    const first = await service.execute(command);
    const second = await service.execute(command);

    expectAcceptedResult(first);
    expectAcceptedResult(second);
    expect(second).toMatchObject({ status: "accepted", idempotent: true, gameVersion: 6 });
    expect(second.events).toStrictEqual(first.events);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);
  });

  it("rejects InitializeFirstNight before setup, roster, assignment, or FIRST_NIGHT prerequisites exist", async () => {
    const { service } = makeService();

    await expect(service.execute(initializeFirstNightCommand({ expectedGameVersion: 0 }))).resolves.toMatchObject({
      status: "rejected",
      code: "GameNotCreated"
    });
    await service.execute(createGameCommand());
    await expect(service.execute(initializeFirstNightCommand({ commandId: commandId("first-night-no-setup"), expectedGameVersion: 1 })))
      .resolves.toMatchObject({ status: "rejected", code: "SetupNotGenerated" });
    await service.execute(selectScriptCommand());
    await service.execute(generateSetupCommand());
    await expect(service.execute(initializeFirstNightCommand({ commandId: commandId("first-night-no-roster"), expectedGameVersion: 3 })))
      .resolves.toMatchObject({ status: "rejected", code: "PlayerRosterNotCreated" });
    await service.execute(createPlayerRosterCommand());
    await expect(service.execute(initializeFirstNightCommand({ commandId: commandId("first-night-no-assignment"), expectedGameVersion: 4 })))
      .resolves.toMatchObject({ status: "rejected", code: "CharacterAssignmentNotCreated" });
  });

  it("rejects human and AI actors for InitializeFirstNight", async () => {
    const { service } = makeService();
    await reachFirstNight(service);

    await expect(
      service.execute(initializeFirstNightCommand({ commandId: commandId("human-first-night"), actor: humanActor }))
    ).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(
      service.execute(initializeFirstNightCommand({ commandId: commandId("ai-first-night"), actor: aiActor }))
    ).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(
      service.execute(initializeFirstNightCommand({ commandId: commandId("storyteller-first-night"), actor: storytellerActor }))
    ).resolves.toMatchObject({ status: "accepted" });
  });

  it("rejects reinitialization after first-night private knowledge exists", async () => {
    const { service, commandStore } = makeService();
    await reachFirstNight(service);
    await service.execute(initializeFirstNightCommand());

    const result = await service.execute(initializeFirstNightCommand({
      commandId: commandId("duplicate-first-night"),
      expectedGameVersion: 6
    }));

    expect(result).toMatchObject({
      status: "rejected",
      code: "FirstNightAlreadyInitialized",
      currentGameVersion: 6
    });
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(11);
  });

  it("keeps missing initial private knowledge builder failures retryable without receipts", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const failing = makeServiceWithoutInitialPrivateKnowledgeBuilder(commandStore, idGenerator, clock);
    const command = initializeFirstNightCommand({ commandId: commandId("missing-initial-knowledge-builder") });

    await reachFirstNight(failing.service);
    const failedResult = await failing.service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "ApplicationNotConfigured",
      failureStage: "initial-knowledge-generation",
      currentGameVersion: 5,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(9);

    const fixed = makeService(commandStore, testSetupGenerator, idGenerator, clock, testAssignmentGenerator, testInitialPrivateKnowledgeBuilder);
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(6);
  });

  it("keeps thrown initial private knowledge builder failures retryable without receipts", async () => {
    const throwingBuilder: InitialPrivateKnowledgeBuilderPort = {
      generate: () => {
        throw new Error("injected initial knowledge failure");
      }
    };
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const failing = makeService(commandStore, testSetupGenerator, idGenerator, clock, testAssignmentGenerator, throwingBuilder);
    const command = initializeFirstNightCommand({ commandId: commandId("throwing-initial-knowledge-builder") });

    await reachFirstNight(failing.service);
    const failedResult = await failing.service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "initial-knowledge-generation",
      message: "injected initial knowledge failure",
      currentGameVersion: 5,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();

    const fixed = makeService(commandStore, testSetupGenerator, idGenerator, clock, testAssignmentGenerator, testInitialPrivateKnowledgeBuilder);
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(6);
  });

  it("persists deterministic initial private knowledge generation failures through receipts", async () => {
    const generationFailure = {
      status: "failure" as const,
      failureCode: "InvalidKnowledgeResult" as const,
      message: "Generated knowledge was not canonical",
      conflictingPlayerIds: [playerId("human-1")],
      conflictingRoleIds: []
    };
    const failingBuilder: InitialPrivateKnowledgeBuilderPort = {
      generate: () => generationFailure
    };
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore, testSetupGenerator, new FixedIdGenerator(), new FixedClock(), testAssignmentGenerator, failingBuilder);
    const command = initializeFirstNightCommand({ commandId: commandId("structured-initial-knowledge-failure") });

    await reachFirstNight(service);
    const first = await service.execute(command);
    const second = await service.execute(command);

    expect(first).toMatchObject({
      status: "rejected",
      code: "InitialPrivateKnowledgeGenerationFailed",
      idempotent: false,
      details: {
        kind: "initial-private-knowledge-generation",
        failure: generationFailure
      }
    });
    expect(second).toMatchObject({
      status: "rejected",
      code: "InitialPrivateKnowledgeGenerationFailed",
      idempotent: true,
      details: {
        kind: "initial-private-knowledge-generation",
        failure: generationFailure
      }
    });
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(9);
  });

  it("plans first-night tasks with one event and leaves phase at FIRST_NIGHT", async () => {
    const { service, commandStore } = makeService();
    const command = planFirstNightTasksCommand();

    await reachFirstNightKnowledge(service);
    const result = await service.execute(command);
    const events = await commandStore.loadDomainEvents(command.gameId);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(7);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      eventType: "FirstNightTaskPlanCreated",
      eventSequence: 12,
      gameVersion: 7,
      commandId: command.commandId
    });
    expect(result.events.map((event) => event.eventType)).not.toContain("PhaseTransitioned");
    expect(state?.phase).toBe("FIRST_NIGHT");
    expect(state?.nightNumber).toBe(1);
    expect(state?.dayNumber).toBe(0);
    expect(state?.firstNightTaskPlan?.taskPlanVersion).toBe("first-night-task-plan-v2");
    expect(state?.firstNightTaskPlan?.tasks.every((task) => task.status === "PENDING")).toBe(true);
    expect(commandStore.getGameVersion(command.gameId)).toBe(7);
  });

  it("returns the accepted first-night task plan result on retry without appending events", async () => {
    const { service, commandStore } = makeService();
    const command = planFirstNightTasksCommand({ commandId: commandId("idempotent-task-plan") });

    await reachFirstNightKnowledge(service);
    const first = await service.execute(command);
    const second = await service.execute(command);

    expectAcceptedResult(first);
    expectAcceptedResult(second);
    expect(second).toMatchObject({ status: "accepted", idempotent: true, gameVersion: 7 });
    expect(second.events).toStrictEqual(first.events);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(12);
  });

  it("rejects PlanFirstNightTasks before setup, roster, assignment, first night, or own-character knowledge exists", async () => {
    const { service } = makeService();

    await expect(service.execute(planFirstNightTasksCommand({ expectedGameVersion: 0 }))).resolves.toMatchObject({
      status: "rejected",
      code: "GameNotCreated"
    });
    await service.execute(createGameCommand());
    await expect(service.execute(planFirstNightTasksCommand({ commandId: commandId("plan-no-setup"), expectedGameVersion: 1 })))
      .resolves.toMatchObject({ status: "rejected", code: "SetupNotGenerated" });
    await service.execute(selectScriptCommand());
    await service.execute(generateSetupCommand());
    await expect(service.execute(planFirstNightTasksCommand({ commandId: commandId("plan-no-roster"), expectedGameVersion: 3 })))
      .resolves.toMatchObject({ status: "rejected", code: "PlayerRosterNotCreated" });
    await service.execute(createPlayerRosterCommand());
    await expect(service.execute(planFirstNightTasksCommand({ commandId: commandId("plan-no-assignment"), expectedGameVersion: 4 })))
      .resolves.toMatchObject({ status: "rejected", code: "CharacterAssignmentNotCreated" });
    await service.execute(assignCharactersCommand());
    await expect(service.execute(planFirstNightTasksCommand({ commandId: commandId("plan-no-first-night"), expectedGameVersion: 5 })))
      .resolves.toMatchObject({ status: "rejected", code: "FirstNightNotInitialized" });
    await service.execute(initializeFirstNightCommand());
    await expect(service.execute(planFirstNightTasksCommand({ commandId: commandId("plan-success-after-knowledge"), expectedGameVersion: 6 })))
      .resolves.toMatchObject({ status: "accepted" });
  });

  it("rejects human and AI actors for PlanFirstNightTasks and allows Storyteller", async () => {
    const { service, commandStore } = makeService();
    await reachFirstNightKnowledge(service);

    const humanCommand = planFirstNightTasksCommand({ commandId: commandId("human-task-plan"), actor: humanActor });
    const aiCommand = planFirstNightTasksCommand({ commandId: commandId("ai-task-plan"), actor: aiActor });
    const storytellerCommand = planFirstNightTasksCommand({ commandId: commandId("storyteller-task-plan"), actor: storytellerActor });

    await expect(service.execute(humanCommand))
      .resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(service.execute(aiCommand))
      .resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    expect((await commandStore.findCommandReceipt(humanCommand.gameId, humanCommand.commandId))?.result.status).toBe("rejected");
    expect((await commandStore.findCommandReceipt(aiCommand.gameId, aiCommand.commandId))?.result.status).toBe("rejected");

    await expect(service.execute(storytellerCommand))
      .resolves.toMatchObject({ status: "accepted" });
  });

  it("rejects duplicate first-night task planning and stale expected versions", async () => {
    const { service, commandStore } = makeService();
    await reachFirstNightKnowledge(service);

    await service.execute(planFirstNightTasksCommand());
    const duplicateCommand = planFirstNightTasksCommand({
      commandId: commandId("duplicate-task-plan"),
      expectedGameVersion: 7
    });
    const staleCommand = planFirstNightTasksCommand({
      commandId: commandId("stale-task-plan"),
      expectedGameVersion: 6
    });

    await expect(service.execute(duplicateCommand)).resolves.toMatchObject({
      status: "rejected",
      code: "FirstNightTaskPlanAlreadyCreated",
      currentGameVersion: 7
    });
    await expect(service.execute(staleCommand)).resolves.toMatchObject({
      status: "rejected",
      code: "ExpectedGameVersionMismatch",
      currentGameVersion: 7
    });
    expect((await commandStore.findCommandReceipt(duplicateCommand.gameId, duplicateCommand.commandId))?.result.status).toBe("rejected");
    expect((await commandStore.findCommandReceipt(staleCommand.gameId, staleCommand.commandId))?.result.status).toBe("rejected");
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(12);
  });

  it("keeps missing first-night task planner failures retryable without receipts", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const failing = makeServiceWithoutFirstNightTaskPlanner(commandStore, idGenerator, clock);
    const command = planFirstNightTasksCommand({ commandId: commandId("missing-task-planner") });

    await reachFirstNightKnowledge(failing.service);
    const failedResult = await failing.service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "ApplicationNotConfigured",
      failureStage: "first-night-task-planning",
      currentGameVersion: 6,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);

    const fixed = makeService(
      commandStore,
      testSetupGenerator,
      idGenerator,
      clock,
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      testFirstNightTaskPlanner
    );
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(7);
  });

  it("keeps thrown first-night task planner failures retryable without receipts", async () => {
    const throwingPlanner: FirstNightTaskPlannerPort = {
      generate: () => {
        throw new Error("injected task planner failure");
      }
    };
    const commandStore = new MemoryCommandCommitStore();
    const failing = makeService(
      commandStore,
      testSetupGenerator,
      new FixedIdGenerator(),
      new FixedClock(),
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      throwingPlanner
    );
    const command = planFirstNightTasksCommand({ commandId: commandId("throwing-task-planner") });

    await reachFirstNightKnowledge(failing.service);
    const failedResult = await failing.service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "first-night-task-planning",
      message: "injected task planner failure",
      currentGameVersion: 6,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
  });

  it("keeps invalid application task catalogs retryable without calling the planner, receipts, or events", async () => {
    const invalidCatalog = {
      ...cloneFirstNightTaskCatalogSnapshot(testFirstNightTaskCatalog),
      taskCatalogSignature: "canonical-first-night-task-catalog-v1:00000000"
    };
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    let plannerCalls = 0;
    const countingPlanner: FirstNightTaskPlannerPort = {
      generate: (input) => {
        plannerCalls += 1;
        return testFirstNightTaskPlanner.generate(input);
      }
    };
    const failing = makeService(
      commandStore,
      testSetupGenerator,
      idGenerator,
      clock,
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      countingPlanner,
      invalidCatalog
    );
    const command = planFirstNightTasksCommand({ commandId: commandId("invalid-application-task-catalog") });

    await reachFirstNightKnowledge(failing.service);
    const failedResult = await failing.service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "ApplicationNotConfigured",
      failureStage: "first-night-task-planning",
      currentGameVersion: 6,
      retryable: true
    });
    expect(failedResult.message).toContain("Invalid first-night task catalog dependency");
    expect(plannerCalls).toBe(0);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);
    expect(commandStore.acceptedCount).toBe(6);
    expect(commandStore.rejectedCount).toBe(0);

    const fixed = makeService(
      commandStore,
      testSetupGenerator,
      idGenerator,
      clock,
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      countingPlanner,
      testFirstNightTaskCatalog
    );
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(7);
    expect(plannerCalls).toBe(1);
  });

  it.each([
    ["InvalidTaskCatalog", "ApplicationNotConfigured"],
    ["InvalidFirstNightState", "DependencyExecutionFailed"],
    ["InvalidTaskPlan", "DependencyExecutionFailed"]
  ] as const)("keeps planner %s failures retryable without command receipts", async (failureCode, expectedCode) => {
    const failure = taskPlanningFailure(failureCode);
    const failingPlanner: FirstNightTaskPlannerPort = {
      generate: () => failure
    };
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const failing = makeService(
      commandStore,
      testSetupGenerator,
      idGenerator,
      clock,
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      failingPlanner
    );
    const command = planFirstNightTasksCommand({ commandId: commandId(`planner-${failureCode}`) });

    await reachFirstNightKnowledge(failing.service);
    const failedResult = await failing.service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: expectedCode,
      failureStage: "first-night-task-planning",
      currentGameVersion: 6,
      retryable: true
    });
    expect(failedResult.message).toContain(failure.failureCode);
    expect(failedResult.message).toContain(failure.message);
    expect(failedResult.message).toContain("first-night-v1:WITCH_ACTION:seat-08");
    expect(failedResult.message).toContain("witch");
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);
    expect(commandStore.rejectedCount).toBe(0);

    const fixed = makeService(
      commandStore,
      testSetupGenerator,
      idGenerator,
      clock,
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      testFirstNightTaskPlanner
    );
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(7);
  });

  it.each([
    [
      "success result without taskPlan",
      "malformed-planner-success-missing-task-plan",
      () => ({ status: "success" }) as unknown as FirstNightTaskPlanningResult,
      "taskPlan is missing"
    ],
    [
      "success result with undefined taskPlan",
      "malformed-planner-success-undefined-task-plan",
      () => ({ status: "success", taskPlan: undefined }) as unknown as FirstNightTaskPlanningResult,
      "taskPlan must be a non-null plain object"
    ],
    [
      "null result",
      "malformed-planner-null-result",
      () => null as unknown as FirstNightTaskPlanningResult,
      "result must be a non-null plain object"
    ],
    [
      "unknown status",
      "malformed-planner-unknown-status",
      () => ({ status: "unknown" }) as unknown as FirstNightTaskPlanningResult,
      "status must be success or failure"
    ],
    [
      "failure result missing conflict arrays",
      "malformed-planner-failure-missing-arrays",
      () =>
        ({
          status: "failure",
          failureCode: "InvalidTaskPlan",
          message: "missing arrays"
        }) as unknown as FirstNightTaskPlanningResult,
      "conflictingTaskIds must be a dense string array"
    ]
  ] as const)("keeps malformed planner runtime %s retryable without command receipts or events", async (_name, commandIdValue, makeResult, message) => {
    const malformedPlanner: FirstNightTaskPlannerPort = {
      generate: () => makeResult()
    };

    await expectRetryableFirstNightTaskPlanningFailureWithoutWrites(malformedPlanner, commandIdValue, message);
  });

  it("keeps taskPlan property DomainError retryable without command receipts or events", async () => {
    const result = { status: "success" };
    Object.defineProperty(result, "taskPlan", {
      enumerable: true,
      get: () => {
        throw new DomainError("InvalidDomainBatchSemantics", "injected taskPlan getter failure");
      }
    });
    const malformedPlanner: FirstNightTaskPlannerPort = {
      generate: () => result as unknown as FirstNightTaskPlanningResult
    };

    await expectRetryableFirstNightTaskPlanningFailureWithoutWrites(
      malformedPlanner,
      "malformed-planner-task-plan-getter-domain-error",
      "injected taskPlan getter failure"
    );
  });

  it("keeps missing plans discovered during event creation retryable without DomainValidationFailed receipts", async () => {
    const transientPlanner: FirstNightTaskPlannerPort = {
      generate: (input) => {
        const result = testFirstNightTaskPlanner.generate(input);
        if (result.status === "failure") {
          return result;
        }

        let taskPlanReads = 0;
        return Object.defineProperty({ status: "success" }, "taskPlan", {
          enumerable: true,
          get: () => {
            taskPlanReads += 1;
            return taskPlanReads === 1 ? result.taskPlan : undefined;
          }
        }) as unknown as FirstNightTaskPlanningResult;
      }
    };

    await expectRetryableFirstNightTaskPlanningFailureWithoutWrites(
      transientPlanner,
      "missing-plan-during-event-creation",
      "PlanFirstNightTasks event creation requires first-night source facts and a generated task plan"
    );
  });

  it("keeps task plan DomainErrors during event creation retryable without command receipts or events", async () => {
    const getterPlanner: FirstNightTaskPlannerPort = {
      generate: (input) => {
        const result = testFirstNightTaskPlanner.generate(input);
        if (result.status === "failure") {
          return result;
        }

        const taskPlan = { ...result.taskPlan };
        Object.defineProperty(taskPlan, "nightNumber", {
          enumerable: true,
          get: () => {
            throw new DomainError("InvalidDomainBatchSemantics", "injected task plan event construction failure");
          }
        });

        return {
          status: "success",
          taskPlan
        };
      }
    };

    await expectRetryableFirstNightTaskPlanningFailureWithoutWrites(
      getterPlanner,
      "task-plan-event-construction-domain-error",
      "injected task plan event construction failure"
    );
  });

  it("keeps PlanFirstNightTasks metadata generation failures classified independently", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FaultInjectingIdGenerator();
    const { service } = makeService(commandStore, testSetupGenerator, idGenerator);
    const command = planFirstNightTasksCommand({ commandId: commandId("task-planning-metadata-failure") });

    await reachFirstNightKnowledge(service);
    idGenerator.failNextBatchId = true;
    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 6,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);
    expect(commandStore.getGameVersion(command.gameId)).toBe(6);
    expect(commandStore.rejectedCount).toBe(0);
  });

  it("keeps internally damaged generated task plans retryable at prospective validation", async () => {
    const corruptingPlanner: FirstNightTaskPlannerPort = {
      generate: (input) => {
        const result = testFirstNightTaskPlanner.generate(input);
        if (result.status === "failure") {
          return result;
        }

        const damagedPlan: FirstNightTaskPlan = {
          ...result.taskPlan,
          tasks: result.taskPlan.tasks.map((task, index) =>
            index === 0 ? { ...task, status: "SETTLED" as unknown as "PENDING" } : task
          )
        };

        return {
          status: "success",
          taskPlan: damagedPlan
        };
      }
    };
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const failing = makeService(
      commandStore,
      testSetupGenerator,
      idGenerator,
      clock,
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      corruptingPlanner
    );
    const command = planFirstNightTasksCommand({ commandId: commandId("corrupt-generated-task-plan") });

    await reachFirstNightKnowledge(failing.service);
    const failedResult = await failing.service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "prospective-validation",
      currentGameVersion: 6,
      retryable: true
    });
    expect(failedResult.message).not.toContain("DomainValidationFailed");
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(11);
    expect(commandStore.rejectedCount).toBe(0);

    const fixed = makeService(
      commandStore,
      testSetupGenerator,
      idGenerator,
      clock,
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      testFirstNightTaskPlanner
    );
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(7);
  });

  it("keeps golden MINION_INFO blocked while Philosopher is the next unsettled task", async () => {
    const { service, commandStore } = makeService();
    await reachFirstNightTaskPlan(service);

    const command = settleFirstNightSystemTaskCommand();
    const result = await service.execute(command);
    const events = await commandStore.loadDomainEvents(command.gameId);
    const state = rebuildOptionalGameState(events);

    expect(result).toMatchObject({
      status: "rejected",
      code: "NextTaskRequiresRoleExecution",
      currentGameVersion: 7
    });
    expect(state?.firstNightTaskPlan?.tasks.slice(0, 3).map((task) => task.taskType)).toStrictEqual([
      "PHILOSOPHER_ACTION",
      "MINION_INFO",
      "DEMON_INFO"
    ]);
    expect(state?.minionInformation).toBeUndefined();
    expect(state?.demonInformation).toBeUndefined();
    expect(state?.firstNightTaskProgress).toBeUndefined();
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeDefined();
    expect(events).toHaveLength(12);
  });

  it("opens a deterministic Philosopher first-night action opportunity without settling the task", async () => {
    const { service, commandStore } = makeService();
    await reachFirstNightTaskPlan(service);

    const result = await service.execute(openFirstNightRoleActionOpportunityCommand());
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result).toMatchObject({ status: "accepted", gameVersion: 8, idempotent: false });
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      eventSequence: 13,
      gameVersion: 8,
      eventType: "FirstNightActionOpportunityCreated",
      payload: {
        opportunityId: "first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01",
        opportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION",
        opportunityStatus: "OPEN",
        taskId: "first-night-v1:PHILOSOPHER_ACTION:seat-10",
        taskType: "PHILOSOPHER_ACTION",
        sourceSeatNumber: 10,
        sourceRole: {
          roleId: "philosopher"
        },
        sourceCharacterStateRevision: 1,
        visibility: {
          canDefer: true,
          supportedDecisionKinds: ["DEFER", "CHOOSE_GOOD_CHARACTER"],
          futureUnsupportedDecisionKinds: []
        }
      }
    });
    expect(state?.firstNightActionOpportunities?.opportunities[0]?.opportunityStatus).toBe("OPEN");
    expect(state?.firstNightTaskProgress).toBeUndefined();
    expect(state?.minionInformation).toBeUndefined();
    expect(events).toHaveLength(13);
  });

  it("allows Storyteller to open the Philosopher opportunity and rejects human or AI open attempts with receipts", async () => {
    const storytellerStore = new MemoryCommandCommitStore();
    const { service: storytellerService } = makeService(storytellerStore);
    await reachFirstNightTaskPlan(storytellerService);
    await expect(storytellerService.execute(openFirstNightRoleActionOpportunityCommand({
      actor: storytellerActor
    }))).resolves.toMatchObject({ status: "accepted", gameVersion: 8 });

    const actorStore = new MemoryCommandCommitStore();
    const { service: actorService } = makeService(actorStore);
    await reachFirstNightTaskPlan(actorService);
    const humanCommand = openFirstNightRoleActionOpportunityCommand({ commandId: commandId("human-open-role-action"), actor: humanActor });
    const aiCommand = openFirstNightRoleActionOpportunityCommand({ commandId: commandId("ai-open-role-action"), actor: aiActor });

    await expect(actorService.execute(humanCommand)).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(actorService.execute(aiCommand)).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    expect((await actorStore.findCommandReceipt(humanCommand.gameId, humanCommand.commandId))?.result.status).toBe("rejected");
    expect((await actorStore.findCommandReceipt(aiCommand.gameId, aiCommand.commandId))?.result.status).toBe("rejected");
    expect(await actorStore.loadDomainEvents(ids.game)).toHaveLength(12);
  });

  it("rejects duplicate, wrong-task, and unsupported role action opportunity opening with saved receipts", async () => {
    const { service, commandStore } = makeService();
    await reachFirstNightTaskPlan(service);
    await service.execute(openFirstNightRoleActionOpportunityCommand());

    const duplicate = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("duplicate-open-philosopher-action"),
      expectedGameVersion: 8
    });
    await expect(service.execute(duplicate)).resolves.toMatchObject({
      status: "rejected",
      code: "ActionOpportunityAlreadyOpen",
      currentGameVersion: 8
    });
    expect((await commandStore.findCommandReceipt(duplicate.gameId, duplicate.commandId))?.result.status).toBe("rejected");
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(13);

    const wrongOrderStore = new MemoryCommandCommitStore();
    const { service: wrongOrderService } = makeService(wrongOrderStore);
    await reachFirstNightTaskPlan(wrongOrderService);
    const wrongOrder = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-minion-before-philosopher"),
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: scheduledTaskId("first-night-v1:MINION_INFO:system")
      }
    });
    await expect(wrongOrderService.execute(wrongOrder)).resolves.toMatchObject({
      status: "rejected",
      code: "ScheduledTaskNotNext",
      currentGameVersion: 7
    });

    const unsupportedStore = new MemoryCommandCommitStore();
    const { service: unsupportedService } = makeService(unsupportedStore);
    await reachNoPhilosopherFirstNightTaskPlan(unsupportedService);
    const unsupported = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-system-info-as-role-action"),
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: scheduledTaskId("first-night-v1:MINION_INFO:system")
      }
    });
    await expect(unsupportedService.execute(unsupported)).resolves.toMatchObject({
      status: "rejected",
      code: "UnsupportedRoleActionOpportunity",
      currentGameVersion: 7
    });
    expect((await unsupportedStore.findCommandReceipt(unsupported.gameId, unsupported.commandId))?.result.status).toBe("rejected");
  });

  it("defers Philosopher action atomically and closes the opportunity without consuming the ability", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherActionOpportunity(service);

    const result = await service.execute(submitPhilosopherActionCommand());
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(9);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "PhilosopherActionDeferred",
      "ScheduledTaskSettled"
    ]);
    expect(result.events[0]).toMatchObject({
      eventSequence: 14,
      gameVersion: 9,
      eventType: "PhilosopherActionDeferred",
      payload: {
        taskId: "first-night-v1:PHILOSOPHER_ACTION:seat-10",
        taskType: "PHILOSOPHER_ACTION",
        opportunityId: "first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01",
        decisionKind: "DEFER",
        sourceSeatNumber: 10,
        sourceCharacterStateRevision: 1
      }
    });
    expect(result.events[1]).toMatchObject({
      eventSequence: 15,
      gameVersion: 9,
      eventType: "ScheduledTaskSettled",
      payload: {
        taskId: "first-night-v1:PHILOSOPHER_ACTION:seat-10",
        taskType: "PHILOSOPHER_ACTION",
        outcomeType: "PHILOSOPHER_DEFERRED",
        characterStateRevision: 1
      }
    });
    expect(state?.firstNightActionOpportunities?.opportunities[0]?.opportunityStatus).toBe("CLOSED");
    expect(state?.firstNightTaskProgress?.settlements[0]).toMatchObject({
      taskType: "PHILOSOPHER_ACTION",
      outcomeType: "PHILOSOPHER_DEFERRED"
    });
    expect(state?.currentCharacterState?.revision).toBe(1);
    expect(state?.minionInformation).toBeUndefined();
    expect(state?.demonInformation).toBeUndefined();
    expect(events).toHaveLength(15);
  });

  it("allows the source player, Storyteller, and System to submit DEFER but rejects non-source players", async () => {
    const sourceStore = new MemoryCommandCommitStore();
    const { service: sourceService } = makeService(sourceStore);
    await reachOpenPhilosopherActionOpportunity(sourceService);
    const sourceState = rebuildOptionalGameState(await sourceStore.loadDomainEvents(ids.game));
    const sourcePlayerId = sourceState?.firstNightActionOpportunities?.opportunities[0]?.sourcePlayerId;
    if (sourcePlayerId === undefined) {
      throw new Error("Expected open Philosopher action opportunity");
    }
    await expect(sourceService.execute(submitPhilosopherActionCommand({
      actor: { kind: "ai", playerId: sourcePlayerId },
      commandId: commandId("source-ai-defer")
    }))).resolves.toMatchObject({ status: "accepted", gameVersion: 9 });

    const storytellerStore = new MemoryCommandCommitStore();
    const { service: storytellerService } = makeService(storytellerStore);
    await reachOpenPhilosopherActionOpportunity(storytellerService);
    await expect(storytellerService.execute(submitPhilosopherActionCommand({
      actor: storytellerActor,
      commandId: commandId("storyteller-defer")
    }))).resolves.toMatchObject({ status: "accepted", gameVersion: 9 });

    const mismatchStore = new MemoryCommandCommitStore();
    const { service: mismatchService } = makeService(mismatchStore);
    await reachOpenPhilosopherActionOpportunity(mismatchService);
    const humanCommand = submitPhilosopherActionCommand({
      actor: humanActor,
      commandId: commandId("wrong-human-defer")
    });
    const aiCommand = submitPhilosopherActionCommand({
      actor: aiActor,
      commandId: commandId("wrong-ai-defer")
    });

    await expect(mismatchService.execute(humanCommand)).resolves.toMatchObject({
      status: "rejected",
      code: "ActorPlayerMismatch",
      currentGameVersion: 8
    });
    await expect(mismatchService.execute(aiCommand)).resolves.toMatchObject({
      status: "rejected",
      code: "ActorPlayerMismatch",
      currentGameVersion: 8
    });
    expect((await mismatchStore.findCommandReceipt(humanCommand.gameId, humanCommand.commandId))?.result.status).toBe("rejected");
    expect((await mismatchStore.findCommandReceipt(aiCommand.gameId, aiCommand.commandId))?.result.status).toBe("rejected");
    expect(await mismatchStore.loadDomainEvents(ids.game)).toHaveLength(13);
  });

  it("accepts Philosopher ability choice and rejects missing opportunities before role action settlement", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherActionOpportunity(service);

    const choose = submitPhilosopherActionCommand({
      commandId: commandId("choose-dreamer-good-character"),
      payload: {
        commandType: "SubmitPhilosopherAction",
        taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-10"),
        opportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01"),
        decision: {
          kind: "CHOOSE_GOOD_CHARACTER",
          roleId: roleId("dreamer")
        }
      }
    });
    const chooseResult = await service.execute(choose);
    expectAcceptedResult(chooseResult);
    expect(chooseResult.events.map((event) => event.eventType)).toStrictEqual([
      "PhilosopherAbilityChosen",
      "PhilosopherAbilityGranted",
      "AbilityImpairmentApplied",
      "FirstNightTaskInsertedV2",
      "ScheduledTaskSettled"
    ]);
    expect((await commandStore.findCommandReceipt(choose.gameId, choose.commandId))?.result.status).toBe("accepted");
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(18);

    const otherStore = new MemoryCommandCommitStore();
    const { service: otherService } = makeService(otherStore);
    await reachOpenPhilosopherActionOpportunity(otherService);
    const wrongOpportunity = submitPhilosopherActionCommand({
      commandId: commandId("missing-opportunity-defer"),
      payload: {
        commandType: "SubmitPhilosopherAction",
        taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-10"),
        opportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-06:opportunity-01"),
        decision: {
          kind: "DEFER"
        }
      }
    });
    await expect(otherService.execute(wrongOpportunity)).resolves.toMatchObject({
      status: "rejected",
      code: "ActionOpportunityNotFound",
      currentGameVersion: 8
    });
    expect((await otherStore.findCommandReceipt(wrongOpportunity.gameId, wrongOpportunity.commandId))?.result.status).toBe("rejected");
    expect(await otherStore.loadDomainEvents(ids.game)).toHaveLength(13);
  });

  it("rejects invalid Philosopher ability choices with saved receipts", async () => {
    const cases = [
      {
        name: "unknown",
        command: choosePhilosopherRoleCommand("not_a_role", { commandId: commandId("choose-unknown-role") }),
        code: "InvalidPhilosopherAbilityChoice"
      },
      {
        name: "demon",
        command: choosePhilosopherRoleCommand("fang_gu", { commandId: commandId("choose-demon-role") }),
        code: "InvalidPhilosopherAbilityChoice"
      },
      {
        name: "minion",
        command: choosePhilosopherRoleCommand("evil_twin", { commandId: commandId("choose-minion-role") }),
        code: "InvalidPhilosopherAbilityChoice"
      },
      {
        name: "extra-field",
        command: submitPhilosopherActionCommand({
          commandId: commandId("choose-extra-field"),
          payload: {
            commandType: "SubmitPhilosopherAction",
            taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-10"),
            opportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01"),
            decision: {
              kind: "CHOOSE_GOOD_CHARACTER",
              roleId: roleId("artist"),
              hidden: true
            } as never
          }
        }),
        code: "InvalidPhilosopherAbilityChoice"
      },
      {
        name: "unsupported-kind",
        command: submitPhilosopherActionCommand({
          commandId: commandId("choose-unsupported-kind"),
          payload: {
            commandType: "SubmitPhilosopherAction",
            taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-10"),
            opportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01"),
            decision: {
              kind: "CHOOSE_PLAYER",
              playerId: playerId("player-1")
            } as never
          }
        }),
        code: "UnsupportedPhilosopherAbilityChoice"
      }
    ] as const;

    for (const testCase of cases) {
      const store = new MemoryCommandCommitStore();
      const { service } = makeService(store);
      await reachOpenPhilosopherActionOpportunity(service);

      await expect(service.execute(testCase.command)).resolves.toMatchObject({
        status: "rejected",
        code: testCase.code,
        currentGameVersion: 8
      });
      expect((await store.findCommandReceipt(testCase.command.gameId, testCase.command.commandId))?.result.status, testCase.name).toBe("rejected");
      expect(await store.loadDomainEvents(ids.game), testCase.name).toHaveLength(13);
    }
  });

  it("grants a legal non-inserting good ability without changing role or assignment", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherActionOpportunity(service);

    const result = await service.execute(choosePhilosopherRoleCommand("klutz", { commandId: commandId("choose-klutz-no-insert") }));
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "PhilosopherAbilityChosen",
      "PhilosopherAbilityGranted",
      "ScheduledTaskSettled"
    ]);
    expect(state?.philosopherGrantedAbilities?.abilities).toHaveLength(1);
    expect(state?.philosopherGrantedAbilities?.abilities[0]).toMatchObject({
      grantId: "philosopher-grant-v1:seat-10:from-klutz",
      chosenRoleId: "klutz",
      grantedAtTaskId: "first-night-v1:PHILOSOPHER_ACTION:seat-10",
      grantedAtOpportunityId: "first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01"
    });
    expect(state?.abilityImpairments?.impairments).toBeUndefined();
    expect(state?.firstNightTaskInsertions?.insertions).toBeUndefined();
    expect(state?.firstNightActionOpportunities?.opportunities[0]?.opportunityStatus).toBe("CLOSED");
    expect(state?.firstNightTaskProgress?.settlements[0]).toMatchObject({
      taskType: "PHILOSOPHER_ACTION",
      outcomeType: "PHILOSOPHER_ABILITY_CHOSEN"
    });
    expect(state?.currentCharacterState?.entries.find((entry) => entry.seatNumber === 10)?.role.roleId).toBe("philosopher");
    expect(state?.assignment?.assignments.find((entry) => entry.seatNumber === 10)?.role.roleId).toBe("philosopher");

    const minionResult = await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-minion-after-klutz-choice"),
      expectedGameVersion: 9
    }));
    expectAcceptedResult(minionResult);
  });

  it("records drunkenness and schedules the gained task at its catalog position after system information", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherActionOpportunity(service);

    const result = await service.execute(choosePhilosopherRoleCommand("snake_charmer", { commandId: commandId("choose-snake-charmer-insert") }));
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "PhilosopherAbilityChosen",
      "PhilosopherAbilityGranted",
      "AbilityImpairmentApplied",
      "FirstNightTaskInsertedV2",
      "ScheduledTaskSettled"
    ]);
    expect(state?.abilityImpairments?.impairments[0]).toMatchObject({
      kind: "DRUNK",
      sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
      sourcePlayerId: state?.firstNightActionOpportunities?.opportunities[0]?.sourcePlayerId,
      chosenRoleId: "snake_charmer",
      sourceCharacterStateRevision: 1
    });
    expect(state?.firstNightTaskInsertions?.insertions[0]).toMatchObject({
      schedulingVersion: "philosopher-gained-first-night-scheduling-v2",
      taskPlanVersion: "first-night-task-plan-v2",
      taskId: "first-night-v2:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-snake_charmer",
      taskType: "SNAKE_CHARMER_ACTION",
      taskClass: "ROLE_ACTION",
      targetCatalogBaseOrder: 400,
      effectiveBaseOrder: 400,
      tieBreakPolicy: "BASE_THEN_GAINED_BY_SOURCE_SEAT_THEN_TASK_ID_CODE_UNIT",
      tieBreakSourceSeatNumber: 10,
      status: "PENDING",
      settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT",
      insertionReason: "PHILOSOPHER_GAINED_ABILITY",
      philosopherOpportunityId: "first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01"
    });
    expect(state?.firstNightTaskPlan?.tasks.slice(0, 4).map((task) => task.taskType)).toStrictEqual([
      "PHILOSOPHER_ACTION",
      "MINION_INFO",
      "DEMON_INFO",
      "SNAKE_CHARMER_ACTION"
    ]);
    const snakeTasks = state?.firstNightTaskPlan?.tasks.filter((task) => task.taskType === "SNAKE_CHARMER_ACTION") ?? [];
    expect(snakeTasks.map((task) => task.source.kind)).toStrictEqual(["ROLE", "PHILOSOPHER_GAINED_ABILITY"]);
    expect(state?.firstNightTaskPlan?.taskCatalogSnapshot.definitions).toHaveLength(testFirstNightTaskCatalog.definitions.length);
    expect(state?.firstNightTaskProgress?.settlements).toHaveLength(1);

    const minionResult = await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("blocked-minion-after-inserted-snake"),
      expectedGameVersion: 9
    }));
    expectAcceptedResult(minionResult);
  });

  it("opens a deterministic Philosopher gained Snake Charmer opportunity with safe visibility", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherActionOpportunity(service);
    const choice = await service.execute(choosePhilosopherRoleCommand("snake_charmer", { commandId: commandId("choose-snake-before-open") }));
    expectAcceptedResult(choice);
    const ready = await reachNextPhilosopherGainedSnakeCharmerTask(service, commandStore, "safe-visibility");

    const command = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-philosopher-gained-snake-charmer"),
      expectedGameVersion: ready.gameVersion,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: philosopherGainedSnakeCharmerTaskId
      }
    });
    const result = await service.execute(command);
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result).toMatchObject({ status: "accepted", gameVersion: ready.gameVersion + 1, idempotent: false });
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      gameVersion: ready.gameVersion + 1,
      eventType: "FirstNightActionOpportunityCreated",
      payload: {
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION",
        opportunityStatus: "OPEN",
        taskId: philosopherGainedSnakeCharmerTaskId,
        taskType: "SNAKE_CHARMER_ACTION",
        sourceSeatNumber: 10,
        sourceRole: {
          roleId: "philosopher"
        },
        sourceCharacterStateRevision: 1,
        visibility: {
          canChooseTarget: true,
          supportedDecisionKinds: ["CHOOSE_PLAYER"],
          targetSchema: "ANY_LIVING_PLAYER"
        }
      }
    });
    expect(result.events[0]?.payload).not.toHaveProperty("targetRoleId");
    expect(result.events[0]?.payload).not.toHaveProperty("isDemon");
    expect(state?.firstNightActionOpportunities?.opportunities.find((entry) =>
      entry.opportunityId === philosopherGainedSnakeCharmerOpportunityId
    )).toMatchObject({
      opportunityId: philosopherGainedSnakeCharmerOpportunityId,
      opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN"
    });
    expect(state?.firstNightTaskProgress?.settlements.map((entry) => entry.taskType)).toStrictEqual([
      "PHILOSOPHER_ACTION",
      "MINION_INFO",
      "DEMON_INFO",
      "SNAKE_CHARMER_ACTION"
    ]);

    const duplicate = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("duplicate-open-philosopher-gained-snake"),
      expectedGameVersion: state?.gameVersion ?? 0,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: philosopherGainedSnakeCharmerTaskId
      }
    });
    await expect(service.execute(duplicate)).resolves.toMatchObject({
      status: "rejected",
      code: "ActionOpportunityAlreadyOpen",
      currentGameVersion: state?.gameVersion
    });
    expect((await commandStore.findCommandReceipt(duplicate.gameId, duplicate.commandId))?.result.status).toBe("rejected");
  });

  it("allows only system or Storyteller actors to open the gained Snake Charmer opportunity", async () => {
    const storytellerStore = new MemoryCommandCommitStore();
    const { service: storytellerService } = makeService(storytellerStore);
    await reachOpenPhilosopherActionOpportunity(storytellerService);
    const storytellerChoice = await storytellerService.execute(choosePhilosopherRoleCommand("snake_charmer", { commandId: commandId("choose-snake-storyteller-open") }));
    expectAcceptedResult(storytellerChoice);
    const storytellerReady = await reachNextPhilosopherGainedSnakeCharmerTask(storytellerService, storytellerStore, "storyteller-open");
    await expect(storytellerService.execute(openFirstNightRoleActionOpportunityCommand({
      actor: storytellerActor,
      commandId: commandId("storyteller-open-philosopher-gained-snake"),
      expectedGameVersion: storytellerReady.gameVersion,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: philosopherGainedSnakeCharmerTaskId
      }
    }))).resolves.toMatchObject({ status: "accepted", gameVersion: storytellerReady.gameVersion + 1 });

    const actorStore = new MemoryCommandCommitStore();
    const { service: actorService } = makeService(actorStore);
    await reachOpenPhilosopherActionOpportunity(actorService);
    const actorChoice = await actorService.execute(choosePhilosopherRoleCommand("snake_charmer", { commandId: commandId("choose-snake-actor-open") }));
    expectAcceptedResult(actorChoice);
    const actorReady = await reachNextPhilosopherGainedSnakeCharmerTask(actorService, actorStore, "actor-open");
    const humanCommand = openFirstNightRoleActionOpportunityCommand({
      actor: humanActor,
      commandId: commandId("human-open-philosopher-gained-snake"),
      expectedGameVersion: actorReady.gameVersion,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: philosopherGainedSnakeCharmerTaskId
      }
    });
    const aiCommand = openFirstNightRoleActionOpportunityCommand({
      actor: aiActor,
      commandId: commandId("ai-open-philosopher-gained-snake"),
      expectedGameVersion: actorReady.gameVersion,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: philosopherGainedSnakeCharmerTaskId
      }
    });

    await expect(actorService.execute(humanCommand)).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(actorService.execute(aiCommand)).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    expect((await actorStore.findCommandReceipt(humanCommand.gameId, humanCommand.commandId))?.result.status).toBe("rejected");
    expect((await actorStore.findCommandReceipt(aiCommand.gameId, aiCommand.commandId))?.result.status).toBe("rejected");
  });

  it("rejects unsupported inserted role opportunities and opens base Snake Charmer opportunities", async () => {
    const dreamerStore = new MemoryCommandCommitStore();
    const { service: dreamerService } = makeService(dreamerStore);
    await reachOpenPhilosopherActionOpportunity(dreamerService);
    await dreamerService.execute(choosePhilosopherRoleCommand("dreamer", { commandId: commandId("choose-dreamer-before-open") }));
    const dreamerTaskId = scheduledTaskId("first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-10:from-dreamer");
    const dreamerReady = await advanceToScheduledTask(dreamerService, dreamerStore, dreamerTaskId, "advance-gained-dreamer");
    await expect(dreamerService.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-gained-dreamer-unsupported"),
      expectedGameVersion: dreamerReady.gameVersion,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: dreamerTaskId
      }
    }))).resolves.toMatchObject({
      status: "rejected",
      code: "UnsupportedRoleActionOpportunity",
      currentGameVersion: dreamerReady.gameVersion
    });

    const baseSnakeStore = new MemoryCommandCommitStore();
    const { service: baseSnakeService } = makeService(baseSnakeStore);
    await reachNoPhilosopherFirstNightTaskPlan(baseSnakeService);
    await baseSnakeService.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-minion-before-base-snake-open"),
      expectedGameVersion: 7
    }));
    await baseSnakeService.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-demon-before-base-snake-open"),
      expectedGameVersion: 8,
      payload: {
        commandType: "SettleFirstNightSystemTask",
        taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system")
      }
    }));
    const baseSnakeState = rebuildOptionalGameState(await baseSnakeStore.loadDomainEvents(ids.game));
    const baseSnakeTask = baseSnakeState?.firstNightTaskPlan?.tasks.find((task) => task.taskType === "SNAKE_CHARMER_ACTION");
    if (baseSnakeTask === undefined) {
      throw new Error("Expected base Snake Charmer task");
    }

    const result = await baseSnakeService.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-base-snake-supported"),
      expectedGameVersion: 9,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: baseSnakeTask.taskId
      }
    }));
    const afterState = rebuildOptionalGameState(await baseSnakeStore.loadDomainEvents(ids.game));
    expectAcceptedResult(result);
    expect(result).toMatchObject({ status: "accepted", gameVersion: 10 });
    expect(result.events[0]).toMatchObject({
      eventType: "FirstNightActionOpportunityCreated",
      payload: {
        taskId: baseSnakeTask.taskId,
        taskType: "SNAKE_CHARMER_ACTION",
        opportunityId: `first-night-v1:SNAKE_CHARMER_ACTION:seat-${String(baseSnakeTask.source.kind === "ROLE" ? baseSnakeTask.source.seatNumber : 0).padStart(2, "0")}:opportunity-01`,
        opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION",
        opportunityStatus: "OPEN",
        sourceRole: {
          roleId: "snake_charmer"
        },
        sourceCharacterStateRevision: 1,
        visibility: {
          canChooseTarget: true,
          supportedDecisionKinds: ["CHOOSE_PLAYER"],
          targetSchema: "ANY_LIVING_PLAYER"
        }
      }
    });
    expect(afterState?.firstNightActionOpportunities?.opportunities.at(-1)?.opportunityStatus).toBe("OPEN");
  });

});

describeApplicationServiceShard("role-actions", "GameApplicationService", () => {
  it("settles base Snake Charmer non-Demon targets through the existing no-swap path", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore);
    const { baseTask, opportunity, state: beforeState } = await reachOpenBaseSnakeCharmerOpportunity(service, commandStore);
    const target = beforeState.currentCharacterState?.entries.find((entry) =>
      entry.role.characterType !== "DEMON" &&
      entry.playerId !== opportunity.sourcePlayerId
    );
    if (target === undefined) {
      throw new Error("Expected non-Demon target");
    }

    const result = await service.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("base-snake-non-demon-no-swap"),
      expectedGameVersion: beforeState?.gameVersion ?? 0,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: baseTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      }
    }));
    const afterState = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));

    expectAcceptedResult(result);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "SnakeCharmerTargetChosen",
      "SnakeCharmerNoSwapResolved",
      "ScheduledTaskSettled"
    ]);
    expect(result.events[0]?.payload).toMatchObject({
      taskId: baseTask.taskId,
      opportunityId: opportunity.opportunityId,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceRole: { roleId: "snake_charmer" },
      targetPlayerId: target.playerId
    });
    expect(result.events[2]?.payload).toMatchObject({
      outcomeType: "SNAKE_CHARMER_NON_DEMON_NO_SWAP",
      characterStateRevision: 1
    });
    expect(afterState?.currentCharacterState).toStrictEqual(beforeState.currentCharacterState);
    expect(afterState?.assignment).toStrictEqual(beforeState.assignment);
    expect(afterState?.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
      abilityRoleId:"snake_charmer",abilityInstance:{kind:"BASE_ROLE_TASK"},outcomeStatus:"NORMAL",causeKind:"NO_OTHER_CHARACTER_ABILITY"
    });
  });

  it("settles base Snake Charmer Demon targets through the existing swap path", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore);
    const { baseTask, opportunity, state: beforeState } = await reachOpenBaseSnakeCharmerOpportunity(service, commandStore);
    const sourceBefore = beforeState.currentCharacterState?.entries.find((entry) => entry.playerId === opportunity.sourcePlayerId);
    const demon = beforeState.currentCharacterState?.entries.find((entry) => entry.role.characterType === "DEMON");
    if (sourceBefore === undefined || demon === undefined) {
      throw new Error("Expected base Snake Charmer source and Demon target");
    }

    const result = await service.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("base-snake-demon-hit-swap"),
      expectedGameVersion: beforeState.gameVersion,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: baseTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: demon.playerId
        }
      }
    }));
    const afterState = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));

    expectAcceptedResult(result);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "SnakeCharmerTargetChosen",
      "SnakeCharmerDemonSwapApplied",
      "AbilityImpairmentApplied",
      "ScheduledTaskSettled"
    ]);
    expect(result.events[0]?.payload).toMatchObject({
      taskId: baseTask.taskId,
      sourceRole: { roleId: "snake_charmer" },
      targetPlayerId: demon.playerId
    });
    expect(result.events[1]?.payload).toMatchObject({
      sourceBefore,
      targetBefore: demon,
      previousCharacterStateRevision: 1,
      nextCharacterStateRevision: 2
    });
    expect(result.events[3]?.payload).toMatchObject({
      outcomeType: "SNAKE_CHARMER_DEMON_HIT_SWAP",
      characterStateRevision: 2
    });
    expect(afterState?.assignment).toStrictEqual(beforeState.assignment);
    expect(afterState?.currentCharacterState?.revision).toBe(2);
  });

  it("settles impaired base Snake Charmer choices as ineffective without swapping or adding poison", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const { service } = makeService(commandStore);
    const { baseTask, opportunity, state: beforeState } = await reachOpenDrunkBaseSnakeCharmerOpportunity(service, commandStore);
    const demon = beforeState.currentCharacterState?.entries.find((entry) => entry.role.characterType === "DEMON");
    const impairment = beforeState.abilityImpairments?.impairments.find((candidate) =>
      candidate.affectedPlayerId === opportunity.sourcePlayerId &&
      candidate.kind === "DRUNK"
    );
    if (demon === undefined || impairment === undefined) {
      throw new Error("Expected Demon target and drunk base Snake Charmer source");
    }

    const result = await service.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("drunk-base-snake-demon-ineffective"),
      expectedGameVersion: beforeState.gameVersion,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: baseTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: demon.playerId
        }
      }
    }));
    const afterEvents = await commandStore.loadDomainEvents(ids.game);
    const afterState = rebuildOptionalGameState(afterEvents);

    expectAcceptedResult(result);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "SnakeCharmerTargetChosen",
      "SnakeCharmerIneffectiveResolved",
      "ScheduledTaskSettled"
    ]);
    expect(result.events.map((event) => event.eventType)).not.toContain("SnakeCharmerDemonSwapApplied");
    expect(result.events.map((event) => event.eventType)).not.toContain("AbilityImpairmentApplied");
    expect(result.events[0]?.payload).toMatchObject({
      taskId: baseTask.taskId,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceRole: { roleId: "snake_charmer" },
      targetPlayerId: demon.playerId,
      targetSeatNumber: demon.seatNumber
    });
    expect(result.events[1]?.payload).toMatchObject({
      taskId: baseTask.taskId,
      opportunityId: opportunity.opportunityId,
      sourcePlayerId: opportunity.sourcePlayerId,
      targetPlayerId: demon.playerId,
      outcomeType: "SOURCE_IMPAIRED_NO_EFFECT",
      reason: "SOURCE_DRUNK",
      sourceImpairmentId: impairment.impairmentId,
      sourceImpairmentKind: "DRUNK"
    });
    expect(result.events[2]?.payload).toMatchObject({
      taskId: baseTask.taskId,
      outcomeType: "SNAKE_CHARMER_INEFFECTIVE",
      characterStateRevision: 1
    });
    expect(afterState?.currentCharacterState).toStrictEqual(beforeState.currentCharacterState);
    expect(afterState?.assignment).toStrictEqual(beforeState.assignment);
    expect(afterState?.abilityImpairments?.impairments).toHaveLength(beforeState.abilityImpairments?.impairments.length ?? 0);
    expect(afterState?.snakeCharmerDemonSwaps?.swaps ?? []).toHaveLength(0);
    expect(afterState?.snakeCharmerIneffectiveResolutions?.resolutions.at(-1)).toMatchObject({
      reason: "SOURCE_DRUNK",
      sourceImpairmentId: impairment.impairmentId
    });
    expect(afterState?.firstNightTaskProgress?.settlements.map((settlement) => settlement.outcomeType)).toContain("SNAKE_CHARMER_INEFFECTIVE");
  });

  const gainedV2LedgerAdapterFixture = async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(service, commandStore);
    const stateBefore = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    const sourceOpportunity = stateBefore?.firstNightActionOpportunities?.opportunities.find((entry) =>
      entry.opportunityId === philosopherGainedSnakeCharmerOpportunityId
    );
    const target = stateBefore?.currentCharacterState?.entries.find((entry) =>
      entry.role.characterType !== "DEMON" && entry.playerId !== sourceOpportunity?.sourcePlayerId
    );
    if (stateBefore === undefined || target === undefined) throw new Error("Expected gained V2 ledger adapter fixture");
    const result = await service.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("snake-charmer-v2-ledger-fixture"),
      expectedGameVersion: stateBefore.gameVersion,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId }
      }
    }));
    expectAcceptedResult(result);
    const terminal = result.events.find((event) => event.eventType === "SnakeCharmerNoSwapResolved");
    if (terminal?.eventType !== "SnakeCharmerNoSwapResolved") throw new Error("Expected gained V2 terminal event");
    return { stateBefore, terminal };
  };
  const historicalGainedV2RevisionFixture = async () => {
    const value = await gainedV2LedgerAdapterFixture();
    const draft = structuredClone(value.stateBefore) as unknown as Record<string, unknown>;
    const record = (candidate: unknown): Record<string, unknown> => candidate as Record<string, unknown>;
    const records = (candidate: unknown): Record<string, unknown>[] => candidate as Record<string, unknown>[];
    record(draft.currentCharacterState).revision = 3;
    const gainedTask = records(record(draft.firstNightTaskPlan).tasks).find((entry) =>
      entry.taskId === philosopherGainedSnakeCharmerTaskId
    )!;
    record(gainedTask.source).sourceCharacterStateRevision = 2;
    records(record(draft.philosopherAbilityChoices).choices)[0]!.sourceCharacterStateRevision = 2;
    records(record(draft.philosopherGrantedAbilities).abilities)[0]!.sourceCharacterStateRevision = 2;
    records(record(draft.firstNightTaskInsertions).insertions)[0]!.sourceCharacterStateRevision = 2;
    for (const opportunity of records(record(draft.firstNightActionOpportunities).opportunities)) {
      opportunity.sourceCharacterStateRevision = 2;
    }
    return {
      stateBefore: draft as unknown as GameState,
      terminal: {
        ...value.terminal,
        payload: { ...value.terminal.payload, sourceCharacterStateRevision: 2 }
      }
    };
  };
  const expectHistoricalGainedV2RevisionMismatchRejected = async (terminalRevision: 1 | 3) => {
    const baseline = await historicalGainedV2RevisionFixture();
    const baselineFact = deriveFirstNightAbilityOutcomeFact({ stateBefore: baseline.stateBefore, event: baseline.terminal })!;
    expect(baselineFact).toMatchObject({
      evaluatedCharacterStateRevision: 3,
      abilityInstance: { kind: "PHILOSOPHER_GAINED_TASK_V2", sourceCharacterStateRevision: 2 }
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
      entry.opportunityId === philosopherGainedSnakeCharmerOpportunityId
    )!;
    (terminalOpportunity as unknown as Record<string, unknown>).sourceCharacterStateRevision = terminalRevision;
    expect(terminalOpportunity.sourceCharacterStateRevision).toBeGreaterThan(0);
    expect(terminalOpportunity.sourceCharacterStateRevision).toBeLessThanOrEqual(tampered.currentCharacterState!.revision);
    const restored = structuredClone(tampered);
    (restored.firstNightActionOpportunities!.opportunities.find((entry) =>
      entry.opportunityId === philosopherGainedSnakeCharmerOpportunityId
    )! as unknown as Record<string, unknown>).sourceCharacterStateRevision = 2;
    expect(restored).toStrictEqual(baseline.stateBefore);
    expect(() => deriveFirstNightAbilityOutcomeFact({ stateBefore: tampered, event: baseline.terminal })).toThrowError(
      "Gained terminal opportunity revision must equal canonical Philosopher grant revision"
    );
  };

  it("[R5-V2-POSITIVE] accepts canonical gained revision N=2 with evaluated revision M=3", async () => {
    const value = await historicalGainedV2RevisionFixture();
    const result = deriveFirstNightAbilityOutcomeFact({ stateBefore: value.stateBefore, event: value.terminal });
    expect(result).toMatchObject({
      evaluatedCharacterStateRevision: 3,
      abilityInstance: { kind: "PHILOSOPHER_GAINED_TASK_V2", sourceCharacterStateRevision: 2 }
    });
    expect(result?.evidenceReferences).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "PHILOSOPHER_GRANT", sourceCharacterStateRevision: 2 }),
      expect.objectContaining({ kind: "ACTION_OPPORTUNITY", opportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION", sourceCharacterStateRevision: 2 }),
      expect.objectContaining({ kind: "ACTION_OPPORTUNITY", opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION", sourceCharacterStateRevision: 2 })
    ]));
  });

  it("[R5-V2-STALE] rejects an in-range stale gained V2 terminal opportunity revision", async () => {
    await expectHistoricalGainedV2RevisionMismatchRejected(1);
  });

  it("[R5-V2-LATER] rejects a later in-range gained V2 terminal opportunity revision", async () => {
    await expectHistoricalGainedV2RevisionMismatchRejected(3);
  });

  it("settles Philosopher gained Snake Charmer non-Demon targets without leaking target role facts", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(service, commandStore);
    const beforeEvents = await commandStore.loadDomainEvents(ids.game);
    const beforeState = rebuildOptionalGameState(beforeEvents);
    const sourceOpportunity = beforeState?.firstNightActionOpportunities?.opportunities.find((entry) =>
      entry.opportunityId === philosopherGainedSnakeCharmerOpportunityId
    );
    const target = beforeState?.currentCharacterState?.entries.find((entry) =>
      entry.role.characterType !== "DEMON" && entry.playerId !== sourceOpportunity?.sourcePlayerId
    );
    if (target === undefined) {
      throw new Error("Expected non-Demon target");
    }

    const result = await service.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("snake-charmer-non-demon-no-swap"),
      expectedGameVersion: beforeState?.gameVersion ?? 0,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      }
    }));
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result).toMatchObject({ status: "accepted", gameVersion: (beforeState?.gameVersion ?? 0) + 1, idempotent: false });
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "SnakeCharmerTargetChosen",
      "SnakeCharmerNoSwapResolved",
      "ScheduledTaskSettled"
    ]);
    expect(result.events.map((event) => event.eventSequence)).toStrictEqual([
      result.events[0]!.eventSequence,
      result.events[0]!.eventSequence + 1,
      result.events[0]!.eventSequence + 2
    ]);
    const repeatedState = rebuildOptionalGameState(events);
    expect(new Set(result.events.map((event) => event.gameVersion))).toStrictEqual(new Set([result.gameVersion]));
    expect(result.events[0]?.payload).toMatchObject({
      taskId: philosopherGainedSnakeCharmerTaskId,
      taskType: "SNAKE_CHARMER_ACTION",
      opportunityId: philosopherGainedSnakeCharmerOpportunityId,
      decisionKind: "CHOOSE_PLAYER",
      sourceSeatNumber: 10,
      sourceRole: {
        roleId: "philosopher"
      },
      sourceCharacterStateRevision: 1,
      targetPlayerId: target.playerId,
      targetSeatNumber: target.seatNumber
    });
    expect(result.events[1]?.payload).toMatchObject({
      taskId: philosopherGainedSnakeCharmerTaskId,
      taskType: "SNAKE_CHARMER_ACTION",
      opportunityId: philosopherGainedSnakeCharmerOpportunityId,
      sourceSeatNumber: 10,
      sourceCharacterStateRevision: 1,
      targetPlayerId: target.playerId,
      targetSeatNumber: target.seatNumber,
      outcomeType: "NON_DEMON_TARGET_NO_SWAP"
    });
    expect(result.events[2]?.payload).toMatchObject({
      taskType: "SNAKE_CHARMER_ACTION",
      outcomeType: "SNAKE_CHARMER_NON_DEMON_NO_SWAP",
      characterStateRevision: 1
    });
    for (const event of result.events.slice(0, 2)) {
      expect(event.payload).not.toHaveProperty("targetRole");
      expect(event.payload).not.toHaveProperty("targetRoleId");
      expect(event.payload).not.toHaveProperty("targetCharacterType");
      expect(event.payload).not.toHaveProperty("targetAlignment");
      expect(event.payload).not.toHaveProperty("isDemon");
    }
    expect(state?.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityId === philosopherGainedSnakeCharmerOpportunityId
    )?.opportunityStatus).toBe("CLOSED");
    expect(state?.firstNightTaskProgress?.settlements.at(-1)?.outcomeType).toBe("SNAKE_CHARMER_NON_DEMON_NO_SWAP");
    expect(state?.firstNightTaskPlan && state.firstNightTaskProgress
      ? state.firstNightTaskPlan.tasks[state.firstNightTaskProgress.settlements.length]?.taskType
      : undefined).not.toBe("MINION_INFO");
    expect(state?.currentCharacterState).toStrictEqual(beforeState?.currentCharacterState);
    expect(state?.assignment).toStrictEqual(beforeState?.assignment);
    expect(repeatedState?.firstNightAbilityOutcomeLedger).toStrictEqual(state?.firstNightAbilityOutcomeLedger);
    const keyReorderedEvents=events.map((event)=>event.eventId===result.events[1]?.eventId
      ? {...event,payload:Object.fromEntries(Object.entries(event.payload).reverse())} as AnyDomainEventEnvelope
      : event);
    expect(rebuildOptionalGameState(keyReorderedEvents)?.firstNightAbilityOutcomeLedger).toStrictEqual(state?.firstNightAbilityOutcomeLedger);
    const ledgerFact = state?.firstNightAbilityOutcomeLedger?.facts.find((fact) => fact.sourceEventId === result.events[1]?.eventId);
    expect(ledgerFact?.abilityInstance).toMatchObject({
      kind: "PHILOSOPHER_GAINED_TASK_V2",
      taskId: philosopherGainedSnakeCharmerTaskId,
      schedulingVersion: "philosopher-gained-first-night-scheduling-v2"
    });
    expect(ledgerFact?.evidenceReferences.filter((entry) => entry.kind === "ACTION_OPPORTUNITY")).toHaveLength(2);
    expect(ledgerFact?.evidenceReferences).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "PHILOSOPHER_GRANT", chosenRoleId: "snake_charmer" })
    ]));
    const v2InsertionEvidence=ledgerFact?.evidenceReferences.find((entry)=>entry.kind==="FIRST_NIGHT_TASK_INSERTION");
    expect(v2InsertionEvidence?.kind==="FIRST_NIGHT_TASK_INSERTION"?v2InsertionEvidence.generation.kind:undefined).toBe("V2");

    if (beforeState === undefined || result.events[1]?.eventType !== "SnakeCharmerNoSwapResolved") throw new Error("Expected V2 ledger adapter fixture");
    const terminal = result.events[1];
    const mutate = (change: (draft: Record<string, unknown>) => void) => {
      const draft = structuredClone(beforeState) as unknown as Record<string, unknown>;
      change(draft);
      return () => deriveFirstNightAbilityOutcomeFact({ stateBefore: draft as unknown as GameState, event: terminal });
    };
    const record = (value: unknown): Record<string, unknown> => value as Record<string, unknown>;
    const records = (value: unknown): Record<string, unknown>[] => value as Record<string, unknown>[];
    const insertionRecords = (draft: Record<string, unknown>) => records(record(draft.firstNightTaskInsertions).insertions);
    const taskRecords = (draft: Record<string, unknown>) => records(record(draft.firstNightTaskPlan).tasks);
    const opportunityRecords = (draft: Record<string, unknown>) => records(record(draft.firstNightActionOpportunities).opportunities);

    expect(mutate((draft) => { draft.firstNightTaskInsertions = undefined; }), "[R4-25] missing V2 insertion").toThrowError(DomainError);
    expect(mutate((draft) => { const insertions=insertionRecords(draft);insertions.push(structuredClone(insertions[0]!)); }), "[R4-26] duplicate V2 insertion").toThrowError(DomainError);
    expect(mutate((draft) => { const task=taskRecords(draft).find((entry)=>entry.taskId===philosopherGainedSnakeCharmerTaskId)!;task.taskId=String(task.taskId).replace("first-night-v2:","first-night-v1:"); }), "[R4-27] V2 task changed to V1").toThrowError(DomainError);
    expect(mutate((draft) => { const insertion=insertionRecords(draft)[0]!;delete insertion.schedulingVersion;delete insertion.grantId;insertion.taskPlanVersion="first-night-task-plan-v1"; }), "[R4-28] V2 insertion changed to V1").toThrowError(DomainError);
    expect(mutate((draft) => { insertionRecords(draft)[0]!.schedulingVersion="other"; }), "[R4-29] schedulingVersion mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { insertionRecords(draft)[0]!.grantId="philosopher-grant-v1:seat-10:from-dreamer"; }), "[R4-30] insertion grant mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { insertionRecords(draft)[0]!.taskCatalogSignature="forged"; }), "[R4-31] catalog signature mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { insertionRecords(draft)[0]!.effectiveBaseOrder=401; }), "[R4-32] base order mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { insertionRecords(draft)[0]!.taskClass="ROLE_INFORMATION"; }), "[R4-33] task class mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { insertionRecords(draft)[0]!.settlementPolicy="OTHER"; }), "[R4-34] settlement policy mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { opportunityRecords(draft).find((entry)=>entry.opportunityKind==="PHILOSOPHER_FIRST_NIGHT_ACTION")!.taskId="first-night-v1:DREAMER_ACTION:seat-10"; }), "[R4-35] Philosopher opportunity mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { opportunityRecords(draft).find((entry)=>entry.opportunityId===philosopherGainedSnakeCharmerOpportunityId)!.taskId="first-night-v1:SNAKE_CHARMER_ACTION:seat-10"; }), "[R4-36] gained opportunity mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { taskRecords(draft).find((entry)=>entry.taskId===philosopherGainedSnakeCharmerTaskId)!.taskId="first-night-v2:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-dreamer"; }), "[R4-37] gained role segment mismatch").toThrowError(DomainError);

  });

  it("settles Snake Charmer Demon targets by swapping current character state and poisoning the old Demon", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(service, commandStore);
    const beforeEvents = await commandStore.loadDomainEvents(ids.game);
    const beforeState = rebuildOptionalGameState(beforeEvents);
    const sourceBefore = beforeState?.currentCharacterState?.entries.find((entry) => entry.role.roleId === "philosopher");
    const demon = beforeState?.currentCharacterState?.entries.find((entry) => entry.role.characterType === "DEMON");
    if (sourceBefore === undefined || demon === undefined) {
      throw new Error("Expected Philosopher source and Demon target");
    }

    const result = await service.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("snake-charmer-demon-hit-swap"),
      expectedGameVersion: beforeState?.gameVersion ?? 0,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: demon.playerId
        }
      }
    }));
    const afterEvents = await commandStore.loadDomainEvents(ids.game);
    const afterState = rebuildOptionalGameState(afterEvents);

    expectAcceptedResult(result);
    expect(result).toMatchObject({ status: "accepted", gameVersion: (beforeState?.gameVersion ?? 0) + 1, idempotent: false });
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "SnakeCharmerTargetChosen",
      "SnakeCharmerDemonSwapApplied",
      "AbilityImpairmentApplied",
      "ScheduledTaskSettled"
    ]);
    expect(result.events.map((event) => event.eventSequence)).toStrictEqual([
      result.events[0]!.eventSequence,
      result.events[0]!.eventSequence + 1,
      result.events[0]!.eventSequence + 2,
      result.events[0]!.eventSequence + 3
    ]);
    expect(new Set(result.events.map((event) => event.gameVersion))).toStrictEqual(new Set([result.gameVersion]));
    const targetChosenEvent = result.events[0];
    const swapEvent = result.events[1];
    const poisonEvent = result.events[2];
    const settlementEvent = result.events[3];
    if (
      targetChosenEvent?.eventType !== "SnakeCharmerTargetChosen" ||
      swapEvent?.eventType !== "SnakeCharmerDemonSwapApplied" ||
      poisonEvent?.eventType !== "AbilityImpairmentApplied" ||
      settlementEvent?.eventType !== "ScheduledTaskSettled"
    ) {
      throw new Error("Expected Snake Charmer Demon-hit event sequence");
    }

    expect(targetChosenEvent.payload).toMatchObject({
      taskId: philosopherGainedSnakeCharmerTaskId,
      taskType: "SNAKE_CHARMER_ACTION",
      opportunityId: philosopherGainedSnakeCharmerOpportunityId,
      decisionKind: "CHOOSE_PLAYER",
      sourcePlayerId: sourceBefore.playerId,
      sourceSeatNumber: sourceBefore.seatNumber,
      sourceRole: { roleId: "philosopher" },
      sourceCharacterStateRevision: 1,
      targetPlayerId: demon.playerId,
      targetSeatNumber: demon.seatNumber
    });
    expect(targetChosenEvent.payload).not.toHaveProperty("targetRole");
    expect(targetChosenEvent.payload).not.toHaveProperty("targetRoleId");
    expect(targetChosenEvent.payload).not.toHaveProperty("targetCharacterType");
    expect(targetChosenEvent.payload).not.toHaveProperty("targetAlignment");
    expect(targetChosenEvent.payload).not.toHaveProperty("isDemon");
    expect(targetChosenEvent.payload).not.toHaveProperty("willSwap");

    expect(swapEvent.payload).toMatchObject({
      taskId: philosopherGainedSnakeCharmerTaskId,
      taskType: "SNAKE_CHARMER_ACTION",
      opportunityId: philosopherGainedSnakeCharmerOpportunityId,
      sourcePlayerId: sourceBefore.playerId,
      sourceSeatNumber: sourceBefore.seatNumber,
      targetPlayerId: demon.playerId,
      targetSeatNumber: demon.seatNumber,
      previousCharacterStateRevision: 1,
      nextCharacterStateRevision: 2,
      swapReason: "SNAKE_CHARMER_DEMON_HIT",
      sourceBefore,
      targetBefore: demon,
      sourceAfter: {
        playerId: sourceBefore.playerId,
        seatNumber: sourceBefore.seatNumber,
        role: demon.role,
        currentAlignment: demon.currentAlignment
      },
      targetAfter: {
        playerId: demon.playerId,
        seatNumber: demon.seatNumber,
        role: sourceBefore.role,
        currentAlignment: sourceBefore.currentAlignment
      }
    });
    expect(poisonEvent.payload).toMatchObject({
      kind: "POISONED",
      sourceKind: "SNAKE_CHARMER_DEMON_HIT",
      sourcePlayerId: sourceBefore.playerId,
      affectedPlayerId: demon.playerId,
      affectedSeatNumber: demon.seatNumber,
      affectedRole: sourceBefore.role,
      sourceCharacterStateRevision: 2
    });
    expect(poisonEvent.payload).not.toHaveProperty("chosenRoleId");
    expect(settlementEvent.payload).toMatchObject({
      taskType: "SNAKE_CHARMER_ACTION",
      outcomeType: "SNAKE_CHARMER_DEMON_HIT_SWAP",
      characterStateRevision: 2
    });
    expect(afterEvents).toHaveLength(beforeEvents.length + 4);
    expect(afterState?.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityId === philosopherGainedSnakeCharmerOpportunityId
    )?.opportunityStatus).toBe("CLOSED");
    expect(afterState?.firstNightTaskProgress?.settlements.at(-1)?.outcomeType).toBe("SNAKE_CHARMER_DEMON_HIT_SWAP");
    expect(afterState?.currentCharacterState?.revision).toBe(2);
    expect(afterState?.currentCharacterState?.entries.find((entry) => entry.playerId === sourceBefore.playerId)).toMatchObject({
      playerId: sourceBefore.playerId,
      seatNumber: sourceBefore.seatNumber,
      role: demon.role,
      currentAlignment: demon.currentAlignment
    });
    expect(afterState?.currentCharacterState?.entries.find((entry) => entry.playerId === demon.playerId)).toMatchObject({
      playerId: demon.playerId,
      seatNumber: demon.seatNumber,
      role: sourceBefore.role,
      currentAlignment: sourceBefore.currentAlignment
    });
    expect(afterState?.assignment).toStrictEqual(beforeState?.assignment);
    expect(afterState?.setup).toStrictEqual(beforeState?.setup);
    expect(afterState?.firstNightTaskPlan).toStrictEqual(beforeState?.firstNightTaskPlan);
    expect(afterState?.abilityImpairments?.impairments).toContainEqual(expect.objectContaining({
      affectedPlayerId: demon.playerId,
      affectedRole: sourceBefore.role,
      affectedSeatNumber: demon.seatNumber,
      impairmentId: poisonEvent.payload.impairmentId,
      kind: "POISONED",
      sourceCharacterStateRevision: 2,
      sourceKind: "SNAKE_CHARMER_DEMON_HIT",
      sourcePlayerId: sourceBefore.playerId
    }));

  });

  it("enforces Snake Charmer submit actor and payload boundaries", async () => {
    const aiStore = new MemoryCommandCommitStore();
    const { service: aiService } = makeService(aiStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(aiService, aiStore);
    const aiState = rebuildOptionalGameState(await aiStore.loadDomainEvents(ids.game));
    const sourceOpportunity = aiState?.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityId === philosopherGainedSnakeCharmerOpportunityId
    );
    const nonDemon = aiState?.currentCharacterState?.entries.find((entry) =>
      entry.role.characterType !== "DEMON" && entry.playerId !== sourceOpportunity?.sourcePlayerId
    );
    if (sourceOpportunity === undefined || nonDemon === undefined) {
      throw new Error("Expected Snake Charmer opportunity and non-Demon target");
    }
    await expect(aiService.execute(submitSnakeCharmerActionCommand({
      actor: { kind: "ai", playerId: sourceOpportunity.sourcePlayerId },
      commandId: commandId("source-ai-submit-snake"),
      expectedGameVersion: aiState?.gameVersion ?? 0,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: nonDemon.playerId
        }
      }
    }))).resolves.toMatchObject({ status: "accepted", gameVersion: (aiState?.gameVersion ?? 0) + 1 });

    const mismatchStore = new MemoryCommandCommitStore();
    const { service: mismatchService } = makeService(mismatchStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(mismatchService, mismatchStore);
    const mismatchState = rebuildOptionalGameState(await mismatchStore.loadDomainEvents(ids.game));
    const mismatchCommand = submitSnakeCharmerActionCommand({
      actor: humanActor,
      commandId: commandId("wrong-human-submit-snake"),
      expectedGameVersion: mismatchState?.gameVersion ?? 0,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: { kind: "CHOOSE_PLAYER", targetPlayerId: playerId("player-ai-1") }
      }
    });
    await expect(mismatchService.execute(mismatchCommand)).resolves.toMatchObject({
      status: "rejected",
      code: "ActorPlayerMismatch",
      currentGameVersion: mismatchState?.gameVersion
    });
    expect((await mismatchStore.findCommandReceipt(mismatchCommand.gameId, mismatchCommand.commandId))?.result.status).toBe("rejected");

    const invalidStore = new MemoryCommandCommitStore();
    const { service: invalidService } = makeService(invalidStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(invalidService, invalidStore);
    const invalidState = rebuildOptionalGameState(await invalidStore.loadDomainEvents(ids.game));
    const extraDecision = submitSnakeCharmerActionCommand({
      commandId: commandId("extra-snake-decision-field"),
      expectedGameVersion: invalidState?.gameVersion ?? 0,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: nonDemon.playerId,
          isDemon: false
        }
      } as never
    });
    await expect(invalidService.execute(extraDecision)).resolves.toMatchObject({
      status: "rejected",
      code: "InvalidSnakeCharmerTarget",
      currentGameVersion: invalidState?.gameVersion
    });

    const unknownTarget = submitSnakeCharmerActionCommand({
      commandId: commandId("unknown-snake-target"),
      expectedGameVersion: invalidState?.gameVersion ?? 0,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: playerId("missing-player")
        }
      }
    });
    await expect(invalidService.execute(unknownTarget)).resolves.toMatchObject({
      status: "rejected",
      code: "InvalidSnakeCharmerTarget",
      currentGameVersion: invalidState?.gameVersion
    });
  });

  it("rejects missing, wrong, and closed Snake Charmer opportunities deterministically", async () => {
    const missingStore = new MemoryCommandCommitStore();
    const { service: missingService } = makeService(missingStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(missingService, missingStore);
    const missingState = rebuildOptionalGameState(await missingStore.loadDomainEvents(ids.game));
    await expect(missingService.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("missing-snake-opportunity"),
      expectedGameVersion: missingState?.gameVersion ?? 0,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-11:from-snake_charmer:opportunity-01"),
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: playerId("player-ai-1")
        }
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "ActionOpportunityNotFound", currentGameVersion: missingState?.gameVersion });

    const wrongTaskStore = new MemoryCommandCommitStore();
    const { service: wrongTaskService } = makeService(wrongTaskStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(wrongTaskService, wrongTaskStore);
    const wrongTaskState = rebuildOptionalGameState(await wrongTaskStore.loadDomainEvents(ids.game));
    await expect(wrongTaskService.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("wrong-snake-task-id"),
      expectedGameVersion: wrongTaskState?.gameVersion ?? 0,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: scheduledTaskId("first-night-v1:MINION_INFO:system"),
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: playerId("player-ai-1")
        }
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "ScheduledTaskNotNext", currentGameVersion: wrongTaskState?.gameVersion });

    const closedStore = new MemoryCommandCommitStore();
    const { service: closedService } = makeService(closedStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(closedService, closedStore);
    const closedState = rebuildOptionalGameState(await closedStore.loadDomainEvents(ids.game));
    const closedOpportunity = closedState?.firstNightActionOpportunities?.opportunities.find((entry) =>
      entry.opportunityId === philosopherGainedSnakeCharmerOpportunityId
    );
    const nonDemon = closedState?.currentCharacterState?.entries.find((entry) =>
      entry.role.characterType !== "DEMON" && entry.playerId !== closedOpportunity?.sourcePlayerId
    );
    if (nonDemon === undefined) {
      throw new Error("Expected non-Demon target");
    }
    await closedService.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("close-snake-opportunity"),
      expectedGameVersion: closedState?.gameVersion ?? 0,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: nonDemon.playerId
        }
      }
    }));
    await expect(closedService.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("submit-closed-snake-opportunity"),
      expectedGameVersion: (closedState?.gameVersion ?? 0) + 1,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: nonDemon.playerId
        }
      }
    }))).resolves.toMatchObject({
      status: "rejected",
      code: "ActionOpportunityAlreadyClosed",
      currentGameVersion: (closedState?.gameVersion ?? 0) + 1
    });
  });

  it("inserts each supported Philosopher gained first-night task deterministically", async () => {
    const cases = [
      ["snake_charmer", "SNAKE_CHARMER_ACTION", 400, "DEMON_INFO", "EVIL_TWIN_SETUP"],
      ["clockmaker", "CLOCKMAKER_INFORMATION", 800, "CERENOVUS_ACTION", "DREAMER_ACTION"],
      ["dreamer", "DREAMER_ACTION", 900, "CLOCKMAKER_INFORMATION", "SEAMSTRESS_ACTION"],
      ["seamstress", "SEAMSTRESS_ACTION", 1000, "DREAMER_ACTION", "MATHEMATICIAN_INFORMATION"],
      ["mathematician", "MATHEMATICIAN_INFORMATION", 1100, "SEAMSTRESS_ACTION", undefined]
    ] as const;

    for (const [chosenRole, taskType, baseOrder, precedingType, followingType] of cases) {
      const store = new MemoryCommandCommitStore();
      const { service } = makeService(store);
      await reachOpenPhilosopherActionOpportunity(service);

      const result = await service.execute(choosePhilosopherRoleCommand(chosenRole, {
        commandId: commandId(`choose-${chosenRole}-insert-task`)
      }));
      const state = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));

      expectAcceptedResult(result);
      expect(state?.firstNightTaskInsertions?.insertions[0]).toMatchObject({
        taskId: `first-night-v2:PHILOSOPHER_GAINED:${taskType}:seat-10:from-${chosenRole}`,
        taskType,
        targetCatalogBaseOrder: baseOrder,
        effectiveBaseOrder: baseOrder,
        tieBreakSourceSeatNumber: 10
      });
      const tasks = state?.firstNightTaskPlan?.tasks ?? [];
      const gainedIndex = tasks.findIndex((task) => task.taskId === `first-night-v2:PHILOSOPHER_GAINED:${taskType}:seat-10:from-${chosenRole}`);
      const precedingOrder = state?.firstNightTaskPlan?.taskCatalogSnapshot.definitions.find((entry) => entry.taskType === precedingType)?.baseOrder;
      const followingOrder = followingType === undefined
        ? undefined
        : state?.firstNightTaskPlan?.taskCatalogSnapshot.definitions.find((entry) => entry.taskType === followingType)?.baseOrder;
      expect(tasks[gainedIndex]?.orderKey).toStrictEqual({ baseOrder, insertionOrder: 10 });
      expect(precedingOrder).toBeLessThan(baseOrder);
      if (followingOrder === undefined) expect(baseOrder).toBe(1100);
      else expect(baseOrder).toBeLessThan(followingOrder);
      expect(tasks[state?.firstNightTaskProgress?.settlements.length ?? 0]?.taskType).toBe("MINION_INFO");
    }
  });

  it("advances gained Mathematician to its catalog position and fails execution closed without information state", async () => {
    const store = new MemoryCommandCommitStore();
    const { service } = makeService(store);
    await reachNoPhilosopherFirstNightTaskPlan(service, philosopherClockmakerExactRoleIds);
    const planned = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
    const philosopherTask = planned?.firstNightTaskPlan?.tasks.find((task) => task.taskType === "PHILOSOPHER_ACTION");
    if (planned === undefined || philosopherTask === undefined) throw new Error("Expected Philosopher task for gained Mathematician fixture");
    const openedResult = await service.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-philosopher-for-mathematician"), expectedGameVersion: planned.gameVersion,
      payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: philosopherTask.taskId }
    }));
    expectAcceptedResult(openedResult);
    const opened = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
    const opportunity = opened?.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === philosopherTask.taskId);
    if (opened === undefined || opportunity === undefined) throw new Error("Expected Philosopher opportunity for gained Mathematician fixture");
    const choiceResult = await service.execute(submitPhilosopherActionCommand({
      commandId: commandId("choose-mathematician-for-fail-closed"), expectedGameVersion: opened.gameVersion,
      actor: systemActor,
      payload: { commandType: "SubmitPhilosopherAction", taskId: philosopherTask.taskId, opportunityId: opportunity.opportunityId,
        decision: { kind: "CHOOSE_GOOD_CHARACTER", roleId: roleId("mathematician") } }
    }));
    expectAcceptedResult(choiceResult);
    const inserted = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
    const gainedTask = inserted?.firstNightTaskPlan?.tasks.find((task) =>
      task.taskType === "MATHEMATICIAN_INFORMATION" && task.source.kind === "PHILOSOPHER_GAINED_ABILITY"
    );
    if (gainedTask === undefined) throw new Error("Expected gained Mathematician task");

    const ready = await advanceToScheduledTask(service, store, gainedTask.taskId, "advance-gained-mathematician");
    expect(ready.firstNightTaskPlan?.tasks[ready.firstNightTaskProgress?.settlements.length ?? 0]?.taskId).toBe(gainedTask.taskId);
    expect(gainedTask.orderKey).toStrictEqual({ baseOrder: 1100, insertionOrder: opportunity.sourceSeatNumber });
    expect(ready.firstNightAbilityOutcomeLedger?.facts).toContainEqual(expect.objectContaining({
      abilityRoleId: "philosopher",
      outcomeStatus: "NORMAL",
      causeKind: "NO_OTHER_CHARACTER_ABILITY"
    }));
    expect(ready.firstNightAbilityOutcomeLedger?.facts.some((fact) =>
      fact.evidenceReferences.some((evidence) => evidence.kind === "PHILOSOPHER_GRANT" && evidence.chosenRoleId === "mathematician")
    )).toBe(true);
    expect("resolveFirstNightMathematicianTrueCountFromState" in domainCore).toBe(false);
    expect("validateMathematicianCountResolution" in domainCore).toBe(false);
    expect("cloneMathematicianCountResolution" in domainCore).toBe(false);
    const beforeEvents = await store.loadDomainEvents(ids.game);
    const beforeReceiptCount = store.getReceiptCount();

    const openAttempt = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-unimplemented-gained-mathematician"), expectedGameVersion: ready.gameVersion,
      payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: gainedTask.taskId }
    });
    await expect(service.execute(openAttempt)).resolves.toMatchObject({
      status: "failed", code: "ApplicationNotConfigured", failureStage: "first-night-role-information",
      retryable: true, currentGameVersion: ready.gameVersion
    });
    const settlementAttempt = settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-unimplemented-gained-mathematician"), expectedGameVersion: ready.gameVersion,
      payload: { commandType: "SettleFirstNightSystemTask", taskId: gainedTask.taskId }
    });
    await expect(service.execute(settlementAttempt)).resolves.toMatchObject({
      status: "failed", code: "ApplicationNotConfigured", failureStage: "first-night-role-information",
      retryable: true, currentGameVersion: ready.gameVersion
    });
    expect(await store.loadDomainEvents(ids.game)).toStrictEqual(beforeEvents);
    expect(store.getReceiptCount()).toBe(beforeReceiptCount);
    expect(await store.findCommandReceipt(openAttempt.gameId, openAttempt.commandId)).toBeUndefined();
    expect(await store.findCommandReceipt(settlementAttempt.gameId, settlementAttempt.commandId)).toBeUndefined();
    const after = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
    expect(after?.gameVersion).toBe(ready.gameVersion);
    expect(after?.firstNightTaskProgress?.settlements.some((entry) => entry.taskId === gainedTask.taskId)).toBe(false);
    expect((after as unknown as Record<string, unknown>).mathematicianInformation).toBeUndefined();
    expect(beforeEvents.some((event) => event.eventType.includes("Mathematician"))).toBe(false);
  });

  it("rejects an injected legacy V1 planner result at the planning boundary without writing", async () => {
    const legacyPlanner: FirstNightTaskPlannerPort = {
      generate: (input) => {
        const result = testFirstNightTaskPlanner.generate(input);
        return result.status === "failure"
          ? result
          : { ...result, taskPlan: { ...result.taskPlan, taskPlanVersion: "first-night-task-plan-v1" } };
      }
    };
    const store = new MemoryCommandCommitStore();
    const { service } = makeService(store, testSetupGenerator, new FixedIdGenerator(), new FixedClock(),
      testAssignmentGenerator, testInitialPrivateKnowledgeBuilder, legacyPlanner);
    await reachFirstNightKnowledge(service);
    const before = await store.loadDomainEvents(ids.game);
    const command = planFirstNightTasksCommand({ commandId: commandId("reject-injected-legacy-plan") });
    await expect(service.execute(command)).resolves.toMatchObject({
      status: "failed", code: "DependencyExecutionFailed", failureStage: "first-night-task-planning", retryable: true,
      currentGameVersion: 6
    });
    expect(await store.loadDomainEvents(ids.game)).toStrictEqual(before);
    expect(await store.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
  });

  it("continues a writable accepted V1 history for a no-insertion Artist choice", async () => {
    const store = new MemoryCommandCommitStore();
    const { service } = makeService(store);
    const context = await reachOpenExactPhilosopherOpportunity(service, store);
    const acceptedV1History = await convertStoredFirstNightPlanToAcceptedV1(store);
    const beforeState = rebuildOptionalGameState(acceptedV1History);
    if (beforeState === undefined) throw new Error("Expected accepted V1 state");
    const command = chooseExactPhilosopherRole("artist", { ...context, state: beforeState }, "legacy-history-no-insertion-artist");
    const result = await service.execute(command);
    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(beforeState.gameVersion + 1);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "PhilosopherAbilityChosen", "PhilosopherAbilityGranted", "ScheduledTaskSettled"
    ]);
    expect(() => validateDomainBatchSemantics(beforeState, result.events)).not.toThrow();
    const afterEvents = await store.loadDomainEvents(ids.game);
    expect(afterEvents.filter((event) =>
      event.eventType === "FirstNightTaskInserted" || event.eventType === "FirstNightTaskInsertedV2"
    )).toHaveLength(0);
    expect(afterEvents.filter((event) => event.eventType === "AbilityImpairmentApplied")).toHaveLength(0);
    expect(() => validateDomainEventStream(afterEvents)).not.toThrow();
    const afterState = rebuildOptionalGameState(afterEvents);
    expect(afterState?.gameVersion).toBe(beforeState.gameVersion + 1);
    expect(afterState?.firstNightActionOpportunities?.opportunities[0]?.opportunityStatus).toBe("CLOSED");
    expect(afterState?.firstNightTaskProgress?.settlements[0]).toMatchObject({
      taskType: "PHILOSOPHER_ACTION", outcomeType: "PHILOSOPHER_ABILITY_CHOSEN"
    });
    expect(afterState?.firstNightTaskPlan?.tasks[afterState.firstNightTaskProgress?.settlements.length ?? 0]?.taskType)
      .toBe("MINION_INFO");
    expect((await store.findCommandReceipt(command.gameId, command.commandId))?.result.status).toBe("accepted");
    const eventCount = afterEvents.length;
    const retry = await service.execute(command);
    expect(retry).toStrictEqual({ ...result, idempotent: true });
    expect(await store.loadDomainEvents(ids.game)).toHaveLength(eventCount);
    expect(store.acceptedCount).toBe(9);
  });

  it("continues accepted V1 duplicate no-insertion grants with DRUNK and unchanged projection boundaries", async () => {
    const store = new MemoryCommandCommitStore();
    const { service } = makeService(store);
    const context = await reachOpenExactPhilosopherOpportunity(service, store);
    const acceptedV1History = await convertStoredFirstNightPlanToAcceptedV1(store);
    const beforeState = rebuildOptionalGameState(acceptedV1History);
    if (beforeState === undefined) throw new Error("Expected accepted V1 duplicate state");
    const result = await service.execute(chooseExactPhilosopherRole(
      "town_crier", { ...context, state: beforeState }, "legacy-history-duplicate-town-crier"
    ));
    expectAcceptedResult(result);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "PhilosopherAbilityChosen", "PhilosopherAbilityGranted", "AbilityImpairmentApplied", "ScheduledTaskSettled"
    ]);
    const acceptedEvents = await store.loadDomainEvents(ids.game);
    const acceptedState = rebuildOptionalGameState(acceptedEvents);
    expect(acceptedState?.abilityImpairments?.impairments).toHaveLength(1);
    expect(acceptedState?.abilityImpairments?.impairments[0]).toMatchObject({
      kind: "DRUNK", sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE", chosenRoleId: "town_crier"
    });
    expect(acceptedState?.firstNightTaskInsertions?.insertions).toBeUndefined();
    expect(() => validateDomainEventStream(acceptedEvents)).not.toThrow();
    const holder = acceptedState?.currentCharacterState?.entries.find((entry) => entry.role.roleId === roleId("town_crier"));
    if (acceptedState === undefined || holder === undefined) throw new Error("Expected Town Crier holder");
    for (const view of [
      buildPlayerPrivateKnowledgeView(acceptedState, holder.playerId),
      buildAiPrivateKnowledgeView(acceptedState, holder.playerId)
    ]) {
      expect(view).not.toHaveProperty("firstNightTaskInsertions");
      expect(view).not.toHaveProperty("philosopherGrantedAbilities");
      expect(view).not.toHaveProperty("abilityImpairments");
    }
  });

  it.each(["snake_charmer", "clockmaker", "dreamer", "seamstress", "mathematician"])(
    "keeps mapped legacy V1 Philosopher choice %s fail closed without writing",
    async (chosenRole) => {
    const store = new MemoryCommandCommitStore();
    const { service } = makeService(store);
    const context = await reachOpenExactPhilosopherOpportunity(service, store);
    const acceptedV1History = await convertStoredFirstNightPlanToAcceptedV1(store);
    const beforeState = rebuildOptionalGameState(acceptedV1History);
    if (beforeState === undefined) throw new Error("Expected accepted V1 mapped state");
    const beforeReceiptCount = store.getReceiptCount();
    const command = chooseExactPhilosopherRole(
      chosenRole, { ...context, state: beforeState }, `legacy-history-mapped-${chosenRole}`
    );
    await expect(service.execute(command)).resolves.toMatchObject({
      status: "failed", code: "ApplicationNotConfigured", failureStage: "first-night-role-action", retryable: true,
      currentGameVersion: beforeState.gameVersion
    });
    expect(await store.loadDomainEvents(ids.game)).toStrictEqual(acceptedV1History);
    expect(await store.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(store.getReceiptCount()).toBe(beforeReceiptCount);
    const afterState = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
    expect(afterState?.gameVersion).toBe(beforeState.gameVersion);
    expect(afterState?.firstNightActionOpportunities?.opportunities[0]?.opportunityStatus).toBe("OPEN");
  });

  it("allows source player, Storyteller, and System to choose a good character but rejects non-source actors", async () => {
    const sourceStore = new MemoryCommandCommitStore();
    const { service: sourceService } = makeService(sourceStore);
    await reachOpenPhilosopherActionOpportunity(sourceService);
    const sourceState = rebuildOptionalGameState(await sourceStore.loadDomainEvents(ids.game));
    const sourcePlayerId = sourceState?.firstNightActionOpportunities?.opportunities[0]?.sourcePlayerId;
    if (sourcePlayerId === undefined) {
      throw new Error("Expected Philosopher source player");
    }

    await expect(sourceService.execute(choosePhilosopherRoleCommand("artist", {
      actor: { kind: "ai", playerId: sourcePlayerId },
      commandId: commandId("source-ai-choose-artist")
    }))).resolves.toMatchObject({ status: "accepted", gameVersion: 9 });

    const storytellerStore = new MemoryCommandCommitStore();
    const { service: storytellerService } = makeService(storytellerStore);
    await reachOpenPhilosopherActionOpportunity(storytellerService);
    await expect(storytellerService.execute(choosePhilosopherRoleCommand("artist", {
      actor: storytellerActor,
      commandId: commandId("storyteller-choose-artist")
    }))).resolves.toMatchObject({ status: "accepted", gameVersion: 9 });

    const humanSeatStore = new MemoryCommandCommitStore();
    const { service: humanSeatService } = makeService(humanSeatStore);
    await humanSeatService.execute(createGameCommand());
    await humanSeatService.execute(selectScriptCommand());
    await humanSeatService.execute(generateSetupCommand());
    await humanSeatService.execute(createPlayerRosterCommand({
      payload: {
        commandType: "CreatePlayerRoster",
        humanPlayerId: humanActor.playerId,
        humanDisplayName: "Human",
        humanSeatNumber: 10
      }
    }));
    await humanSeatService.execute(assignCharactersCommand());
    await humanSeatService.execute(initializeFirstNightCommand());
    await humanSeatService.execute(planFirstNightTasksCommand());
    await humanSeatService.execute(openFirstNightRoleActionOpportunityCommand());
    await expect(humanSeatService.execute(choosePhilosopherRoleCommand("artist", {
      actor: { kind: "human", playerId: humanActor.playerId },
      commandId: commandId("source-human-choose-artist")
    }))).resolves.toMatchObject({ status: "accepted", gameVersion: 9 });

    const mismatchStore = new MemoryCommandCommitStore();
    const { service: mismatchService } = makeService(mismatchStore);
    await reachOpenPhilosopherActionOpportunity(mismatchService);
    await expect(mismatchService.execute(choosePhilosopherRoleCommand("artist", {
      actor: humanActor,
      commandId: commandId("wrong-human-choose-artist")
    }))).resolves.toMatchObject({
      status: "rejected",
      code: "ActorPlayerMismatch",
      currentGameVersion: 8
    });
  });

  it("keeps Philosopher DEFER idempotent and rejects later opportunity reuse with saved receipts", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherActionOpportunity(service);
    const command = submitPhilosopherActionCommand({ commandId: commandId("idempotent-philosopher-defer") });

    const first = await service.execute(command);
    const second = await service.execute(command);
    expectAcceptedResult(first);
    expectAcceptedResult(second);
    expect(second).toMatchObject({ status: "accepted", idempotent: true, gameVersion: 9 });
    expect(second.events).toStrictEqual(first.events);

    const submitAgain = submitPhilosopherActionCommand({
      commandId: commandId("closed-opportunity-submit"),
      expectedGameVersion: 9
    });
    await expect(service.execute(submitAgain)).resolves.toMatchObject({
      status: "rejected",
      code: "ActionOpportunityAlreadyClosed",
      currentGameVersion: 9
    });

    const openAgain = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("closed-opportunity-open"),
      expectedGameVersion: 9
    });
    await expect(service.execute(openAgain)).resolves.toMatchObject({
      status: "rejected",
      code: "ActionOpportunityAlreadyClosed",
      currentGameVersion: 9
    });
    expect((await commandStore.findCommandReceipt(submitAgain.gameId, submitAgain.commandId))?.result.status).toBe("rejected");
    expect((await commandStore.findCommandReceipt(openAgain.gameId, openAgain.commandId))?.result.status).toBe("rejected");
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(15);
  });

  it("keeps role action metadata generation failures classified independently without receipts", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FaultInjectingIdGenerator();
    const clock = new FixedClock();
    const { service } = makeService(commandStore, testSetupGenerator, idGenerator, clock);
    const command = openFirstNightRoleActionOpportunityCommand({ commandId: commandId("role-action-metadata-failure") });

    await reachFirstNightTaskPlan(service);
    idGenerator.failNextBatchId = true;
    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 7,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(12);
  });

  it("rejects role-action command accessors before receipt or event work", async () => {
    const { service, commandStore } = makeService();
    await reachFirstNightTaskPlan(service);
    let taskIdReads = 0;
    const command = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("mutating-open-role-action-task"),
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        get taskId() {
          taskIdReads += 1;
          return taskIdReads === 1
            ? scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-10")
            : scheduledTaskId("first-night-v1:MINION_INFO:system");
        }
      } as never
    });

    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "command-validation",
      retryable: true
    });
    expect(failedResult.message).toContain("enumerable data properties");
    expect("currentGameVersion" in failedResult).toBe(false);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(12);
  });

  it("rejects Philosopher DEFER command accessors before receipt or event work", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherActionOpportunity(service);
    let opportunityIdReads = 0;
    const command = submitPhilosopherActionCommand({
      commandId: commandId("mutating-philosopher-opportunity"),
      payload: {
        commandType: "SubmitPhilosopherAction",
        taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-10"),
        get opportunityId() {
          opportunityIdReads += 1;
          return opportunityIdReads === 1
            ? actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01")
            : actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-06:opportunity-01");
        },
        decision: {
          kind: "DEFER"
        }
      } as never
    });

    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "command-validation",
      retryable: true
    });
    expect(failedResult.message).toContain("enumerable data properties");
    expect("currentGameVersion" in failedResult).toBe(false);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(13);
  });

  it("settles MINION_INFO and DEMON_INFO after Philosopher DEFER on the golden plan", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherActionOpportunity(service);
    await service.execute(submitPhilosopherActionCommand());

    const minionResult = await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-minion-after-philosopher-defer"),
      expectedGameVersion: 9
    }));
    const demonResult = await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-demon-after-philosopher-defer"),
      expectedGameVersion: 10,
      payload: {
        commandType: "SettleFirstNightSystemTask",
        taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system")
      }
    }));
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(minionResult);
    expectAcceptedResult(demonResult);
    expect(state?.firstNightTaskProgress?.settlements.map((settlement) => settlement.taskType)).toStrictEqual([
      "PHILOSOPHER_ACTION",
      "MINION_INFO",
      "DEMON_INFO"
    ]);
    expect(state?.firstNightTaskProgress?.settlements.map((settlement) => settlement.outcomeType)).toStrictEqual([
      "PHILOSOPHER_DEFERRED",
      "MINION_INFORMATION_DELIVERED",
      "DEMON_INFORMATION_DELIVERED"
    ]);
    expect(state?.minionInformation?.entries).toHaveLength(4);
    expect(state?.demonInformation?.entries).toHaveLength(2);
    expect(state?.firstNightTaskPlan?.tasks.slice(0, 6).map((task) => task.taskType)).toStrictEqual([
      "PHILOSOPHER_ACTION",
      "MINION_INFO",
      "DEMON_INFO",
      "SNAKE_CHARMER_ACTION",
      "WITCH_ACTION",
      "CERENOVUS_ACTION"
    ]);
    expect(events).toHaveLength(19);
  });

  it("settles MINION_INFO before DEMON_INFO on a no-Philosopher first-night plan", async () => {
    const { service, commandStore } = makeService();
    await reachNoPhilosopherFirstNightTaskPlan(service);

    const planState = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    expect(planState?.firstNightTaskPlan?.tasks.slice(0, 2).map((task) => task.taskType)).toStrictEqual([
      "MINION_INFO",
      "DEMON_INFO"
    ]);

    const result = await service.execute(settleFirstNightSystemTaskCommand());
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(8);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "MinionInformationDelivered",
      "ScheduledTaskSettled"
    ]);
    expect(result.events[0]).toMatchObject({
      eventSequence: 13,
      gameVersion: 8,
      eventType: "MinionInformationDelivered"
    });
    expect(result.events[1]).toMatchObject({
      eventSequence: 14,
      gameVersion: 8,
      eventType: "ScheduledTaskSettled"
    });
    expect(state?.phase).toBe("FIRST_NIGHT");
    expect(state?.nightNumber).toBe(1);
    expect(state?.dayNumber).toBe(0);
    expect(state?.minionInformation?.entries).toHaveLength(4);
    expect(state?.minionInformation?.resolvedEvilTeam.characterStateRevision).toBe(1);
    expect(state?.minionInformation?.characterStateRevision).toBe(state?.minionInformation?.resolvedEvilTeam.characterStateRevision);
    expect(state?.demonInformation).toBeUndefined();
    expect(state?.firstNightTaskProgress?.settlements).toHaveLength(1);
    expect(state?.firstNightTaskProgress?.settlements[0]).toMatchObject({
      taskId: "first-night-v1:MINION_INFO:system",
      taskType: "MINION_INFO",
      outcomeType: "MINION_INFORMATION_DELIVERED",
      settlementVersion: "scheduled-task-settlement-v1",
      characterStateRevision: state?.minionInformation?.resolvedEvilTeam.characterStateRevision
    });
    expect(commandStore.getGameVersion(ids.game)).toBe(8);
    expect(events).toHaveLength(14);
  });

  it("settles DEMON_INFO only after MINION_INFO has been settled", async () => {
    const { service, commandStore } = makeService();
    await reachNoPhilosopherFirstNightTaskPlan(service);
    await service.execute(settleFirstNightSystemTaskCommand());

    const command = settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-demon-info"),
      expectedGameVersion: 8,
      payload: {
        commandType: "SettleFirstNightSystemTask",
        taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system")
      }
    });
    const result = await service.execute(command);
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(9);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "DemonInformationDelivered",
      "ScheduledTaskSettled"
    ]);
    expect(state?.phase).toBe("FIRST_NIGHT");
    expect(state?.demonInformation?.entries).toHaveLength(2);
    expect(state?.demonInformation?.resolvedEvilTeam.characterStateRevision).toBe(1);
    expect(state?.demonInformation?.characterStateRevision).toBe(state?.demonInformation?.resolvedEvilTeam.characterStateRevision);
    expect(state?.demonInformation?.entries.find((entry) => entry.kind === "DEMON_BLUFFS")).toMatchObject({
      kind: "DEMON_BLUFFS"
    });
    expect(state?.demonInformation?.entries.find((entry) => entry.kind === "DEMON_BLUFFS")?.roles).toHaveLength(3);
    expect(state?.firstNightTaskProgress?.settlements).toHaveLength(2);
    expect(state?.firstNightTaskProgress?.settlements[1]).toMatchObject({
      taskId: "first-night-v1:DEMON_INFO:system",
      taskType: "DEMON_INFO",
      outcomeType: "DEMON_INFORMATION_DELIVERED",
      characterStateRevision: state?.demonInformation?.resolvedEvilTeam.characterStateRevision
    });
    expect(events).toHaveLength(16);
  });

  it("returns accepted MINION_INFO settlement on retry without appending events", async () => {
    const { service, commandStore } = makeService();
    const command = settleFirstNightSystemTaskCommand({ commandId: commandId("idempotent-minion-info") });

    await reachNoPhilosopherFirstNightTaskPlan(service);
    const first = await service.execute(command);
    const second = await service.execute(command);

    expectAcceptedResult(first);
    expectAcceptedResult(second);
    expect(second).toMatchObject({ status: "accepted", idempotent: true, gameVersion: 8 });
    expect(second.events).toStrictEqual(first.events);
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(14);
  });

  it("rejects DEMON_INFO before MINION_INFO and unsupported role task settlement with saved receipts", async () => {
    const { service: noPhilosopherService, commandStore: noPhilosopherStore } = makeService();
    await reachNoPhilosopherFirstNightTaskPlan(noPhilosopherService);

    const earlyDemon = settleFirstNightSystemTaskCommand({
      commandId: commandId("early-demon-info"),
      payload: {
        commandType: "SettleFirstNightSystemTask",
        taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system")
      }
    });
    await expect(noPhilosopherService.execute(earlyDemon)).resolves.toMatchObject({
      status: "rejected",
      code: "ScheduledTaskNotNext",
      currentGameVersion: 7
    });
    expect((await noPhilosopherStore.findCommandReceipt(earlyDemon.gameId, earlyDemon.commandId))?.result.status).toBe("rejected");
    expect(await noPhilosopherStore.loadDomainEvents(earlyDemon.gameId)).toHaveLength(12);

    const { service, commandStore } = makeService();
    await reachFirstNightTaskPlan(service);
    const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    const roleTask = state?.firstNightTaskPlan?.tasks[0];
    if (roleTask === undefined) {
      throw new Error("Expected first-night role task");
    }
    const roleCommand = settleFirstNightSystemTaskCommand({
      commandId: commandId("unsupported-role-task-settlement"),
      payload: {
        commandType: "SettleFirstNightSystemTask",
        taskId: roleTask.taskId
      }
    });

    await expect(service.execute(roleCommand)).resolves.toMatchObject({
      status: "rejected",
      code: "UnsupportedSystemTaskSettlement",
      currentGameVersion: 7
    });
    expect((await commandStore.findCommandReceipt(roleCommand.gameId, roleCommand.commandId))?.result.status).toBe("rejected");
    expect(await commandStore.loadDomainEvents(roleCommand.gameId)).toHaveLength(12);
  });

  it("rejects missing, duplicate, stale-version, wrong-phase, and actor-invalid system task settlement with receipts", async () => {
    const { service, commandStore } = makeService();
    await reachNoPhilosopherFirstNightTaskPlan(service);

    const missing = settleFirstNightSystemTaskCommand({
      commandId: commandId("missing-system-task"),
      payload: {
        commandType: "SettleFirstNightSystemTask",
        taskId: scheduledTaskId("first-night-v1:MISSING_INFO:system")
      }
    });
    await expect(service.execute(missing)).resolves.toMatchObject({ status: "rejected", code: "ScheduledTaskNotFound" });

    await service.execute(settleFirstNightSystemTaskCommand());
    const duplicate = settleFirstNightSystemTaskCommand({
      commandId: commandId("duplicate-minion-info"),
      expectedGameVersion: 8
    });
    const stale = settleFirstNightSystemTaskCommand({
      commandId: commandId("stale-demon-info"),
      expectedGameVersion: 7,
      payload: {
        commandType: "SettleFirstNightSystemTask",
        taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system")
      }
    });
    await expect(service.execute(duplicate)).resolves.toMatchObject({ status: "rejected", code: "ScheduledTaskAlreadySettled" });
    await expect(service.execute(stale)).resolves.toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch" });
    expect((await commandStore.findCommandReceipt(missing.gameId, missing.commandId))?.result.status).toBe("rejected");
    expect((await commandStore.findCommandReceipt(duplicate.gameId, duplicate.commandId))?.result.status).toBe("rejected");
    expect((await commandStore.findCommandReceipt(stale.gameId, stale.commandId))?.result.status).toBe("rejected");

    const actorStore = new MemoryCommandCommitStore();
    const { service: actorService } = makeService(actorStore);
    await reachNoPhilosopherFirstNightTaskPlan(actorService);
    const humanCommand = settleFirstNightSystemTaskCommand({ commandId: commandId("human-settle-system-task"), actor: humanActor });
    const aiCommand = settleFirstNightSystemTaskCommand({ commandId: commandId("ai-settle-system-task"), actor: aiActor });
    await expect(actorService.execute(humanCommand)).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(actorService.execute(aiCommand)).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    expect((await actorStore.findCommandReceipt(humanCommand.gameId, humanCommand.commandId))?.result.status).toBe("rejected");
    expect((await actorStore.findCommandReceipt(aiCommand.gameId, aiCommand.commandId))?.result.status).toBe("rejected");

    const phaseStore = new MemoryCommandCommitStore();
    const { service: phaseService } = makeService(phaseStore);
    await phaseService.execute(createGameCommand());
    await phaseService.execute(selectScriptCommand());
    await phaseService.execute(generateSetupCommand());
    const phaseCommand = settleFirstNightSystemTaskCommand({
      commandId: commandId("wrong-phase-system-task"),
      expectedGameVersion: 3
    });
    await expect(phaseService.execute(phaseCommand)).resolves.toMatchObject({
      status: "rejected",
      code: "CommandNotAllowedInPhase",
      currentGameVersion: 3
    });
    expect((await phaseStore.findCommandReceipt(phaseCommand.gameId, phaseCommand.commandId))?.result.status).toBe("rejected");
  });

  it("keeps missing first-night system information resolver failures retryable without receipts", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const failing = makeServiceWithoutFirstNightSystemInformationResolver(commandStore, idGenerator, clock);
    const command = settleFirstNightSystemTaskCommand({ commandId: commandId("missing-system-information-resolver") });

    await reachNoPhilosopherFirstNightTaskPlan(failing.service);
    const failedResult = await failing.service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "ApplicationNotConfigured",
      failureStage: "first-night-system-information",
      currentGameVersion: 7,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(12);

    const fixed = makeService(
      commandStore,
      testSetupGenerator,
      idGenerator,
      clock,
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      testFirstNightTaskPlanner,
      testFirstNightTaskCatalog,
      testFirstNightSystemInformationResolver
    );
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(8);
  });

  it("keeps thrown first-night system information resolver failures retryable without receipts", async () => {
    const throwingResolver: FirstNightSystemInformationResolverPort = {
      resolve: () => {
        throw new Error("injected system information resolver failure");
      }
    };

    await expectRetryableFirstNightSystemInformationFailureWithoutWrites(
      throwingResolver,
      "throwing-system-information-resolver",
      "injected system information resolver failure"
    );
  });

  it.each([
    [
      "null result",
      "malformed-system-info-null-result",
      () => null as unknown as FirstNightSystemInformationResolutionResult,
      "result must be a non-null plain object"
    ],
    [
      "unknown status",
      "malformed-system-info-unknown-status",
      () => ({ status: "unknown" }) as unknown as FirstNightSystemInformationResolutionResult,
      "status must be success or failure"
    ],
    [
      "success result without resolution",
      "malformed-system-info-missing-resolution",
      () => ({ status: "success" }) as unknown as FirstNightSystemInformationResolutionResult,
      "resolution is missing"
    ],
    [
      "failure result missing conflict arrays",
      "malformed-system-info-failure-missing-arrays",
      () =>
        ({
          status: "failure",
          failureCode: "InvalidKnowledgeResult",
          message: "missing arrays"
        }) as unknown as FirstNightSystemInformationResolutionResult,
      "conflictingPlayerIds must be a dense string array"
    ]
  ] as const)("keeps malformed system information resolver runtime %s retryable without receipts or events", async (_name, commandIdValue, makeResult, message) => {
    const malformedResolver: FirstNightSystemInformationResolverPort = {
      resolve: () => makeResult()
    };

    await expectRetryableFirstNightSystemInformationFailureWithoutWrites(malformedResolver, commandIdValue, message);
  });

  it.each([
    [
      "missing delivered evil team snapshot",
      "malformed-system-info-missing-team-snapshot",
      (resolution: Record<string, unknown>) => {
        const withoutSnapshot = { ...resolution };
        delete withoutSnapshot.resolvedEvilTeam;
        return withoutSnapshot;
      }
    ],
    [
      "undefined delivered evil team snapshot",
      "malformed-system-info-undefined-team-snapshot",
      (resolution: Record<string, unknown>) => ({
        ...resolution,
        resolvedEvilTeam: undefined
      })
    ],
    [
      "revision-mismatched delivered evil team snapshot",
      "malformed-system-info-mismatched-team-snapshot-revision",
      (resolution: Record<string, unknown>) => ({
        ...resolution,
        resolvedEvilTeam: {
          ...(resolution.resolvedEvilTeam as Record<string, unknown>),
          characterStateRevision: 2
        }
      })
    ]
  ] as const)("keeps system information resolver success with %s retryable without receipts or events", async (_name, commandIdValue, mutateResolution) => {
    const malformedResolver: FirstNightSystemInformationResolverPort = {
      resolve: (input) => {
        const result = testFirstNightSystemInformationResolver.resolve(input);
        if (result.status === "failure") {
          return result;
        }

        return {
          status: "success",
          resolution: mutateResolution(result.resolution)
        } as unknown as FirstNightSystemInformationResolutionResult;
      }
    };

    await expectRetryableFirstNightSystemInformationFailureWithoutWrites(
      malformedResolver,
      commandIdValue,
      "resolution must have supported runtime shape"
    );
  });

  it("keeps sparse system information entries retryable at runtime validation without receipts or events", async () => {
    const sparseEntriesResolver: FirstNightSystemInformationResolverPort = {
      resolve: (input) => {
        const result = testFirstNightSystemInformationResolver.resolve(input);
        if (result.status === "failure") {
          return result;
        }

        const entries = new Array(result.resolution.entries.length) as unknown[];
        entries[0] = result.resolution.entries[0];
        return {
          status: "success",
          resolution: {
            ...result.resolution,
            entries
          }
        } as unknown as FirstNightSystemInformationResolutionResult;
      }
    };

    await expectRetryableFirstNightSystemInformationFailureWithoutWrites(
      sparseEntriesResolver,
      "sparse-system-information-entries",
      "resolution must have supported runtime shape"
    );
  });

  it("keeps malformed-but-present system information retryable at prospective validation without DomainValidationFailed receipts", async () => {
    const wrongEntriesResolver: FirstNightSystemInformationResolverPort = {
      resolve: (input) => {
        const result = testFirstNightSystemInformationResolver.resolve(input);
        if (result.status === "failure") {
          return result;
        }

        return {
          status: "success",
          resolution: {
            ...result.resolution,
            entries: []
          }
        };
      }
    };
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FixedIdGenerator();
    const clock = new FixedClock();
    const failing = makeService(
      commandStore,
      testSetupGenerator,
      idGenerator,
      clock,
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      testFirstNightTaskPlanner,
      testFirstNightTaskCatalog,
      wrongEntriesResolver
    );
    const command = settleFirstNightSystemTaskCommand({ commandId: commandId("wrong-system-information-entries") });

    await reachNoPhilosopherFirstNightTaskPlan(failing.service);
    const failedResult = await failing.service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "first-night-system-information",
      currentGameVersion: 7,
      retryable: true
    });
    expect(failedResult.message).not.toContain("DomainValidationFailed");
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(12);

    const fixed = makeService(
      commandStore,
      testSetupGenerator,
      idGenerator,
      clock,
      testAssignmentGenerator,
      testInitialPrivateKnowledgeBuilder,
      testFirstNightTaskPlanner,
      testFirstNightTaskCatalog,
      testFirstNightSystemInformationResolver
    );
    const retried = await fixed.service.execute(command);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(8);
  });

  it("keeps system information resolver structured failures retryable without receipts", async () => {
    const failingResolver: FirstNightSystemInformationResolverPort = {
      resolve: () => ({
        status: "failure",
        failureCode: "InvalidKnowledgeResult",
        message: "injected system information failure",
        conflictingPlayerIds: [playerId("player-ai-1")]
      })
    };

    await expectRetryableFirstNightSystemInformationFailureWithoutWrites(
      failingResolver,
      "structured-system-information-failure",
      "InvalidKnowledgeResult: injected system information failure"
    );
  });

  it("keeps SettleFirstNightSystemTask metadata generation failures classified independently", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FaultInjectingIdGenerator();
    const { service } = makeService(commandStore, testSetupGenerator, idGenerator);
    const command = settleFirstNightSystemTaskCommand({ commandId: commandId("system-information-metadata-failure") });

    await reachNoPhilosopherFirstNightTaskPlan(service);
    idGenerator.failNextBatchId = true;
    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 7,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(12);
  });

  it("settles EVIL_TWIN_SETUP as pair, private information, and scheduled settlement", async () => {
    const { service, commandStore } = makeService();
    const { evilTwinTask, beforeEvilTwin } = await reachEvilTwinSetupTask(service, commandStore);

    const result = await service.execute(settleEvilTwinSetupCommand({
      commandId: commandId("settle-evil-twin-setup"),
      expectedGameVersion: 11,
      payload: {
        commandType: "SettleEvilTwinSetup",
        taskId: evilTwinTask.taskId
      }
    }));
    const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));

    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(12);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "EvilTwinPairEstablished",
      "EvilTwinInformationDelivered",
      "ScheduledTaskSettled"
    ]);
    expect(result.events.map((event) => event.eventSequence)).toStrictEqual([21, 22, 23]);
    expect(state?.evilTwinPairs?.pairs).toHaveLength(1);
    expect(state?.evilTwinInformation?.entries).toHaveLength(2);
    expect(state?.evilTwinInformation?.entries.map((entry) => entry.kind)).toStrictEqual([
      "EVIL_TWIN_PAIR",
      "EVIL_TWIN_PAIR"
    ]);
    expect(state?.firstNightTaskProgress?.settlements.map((settlement) => settlement.taskType)).toStrictEqual([
      "MINION_INFO",
      "DEMON_INFO",
      "SNAKE_CHARMER_ACTION",
      "EVIL_TWIN_SETUP"
    ]);
    expect(state?.firstNightTaskProgress?.settlements.at(-1)).toMatchObject({
      taskType: "EVIL_TWIN_SETUP",
      outcomeType: "EVIL_TWIN_PAIR_ESTABLISHED",
      characterStateRevision: state?.evilTwinPairs?.pairs[0]?.characterStateRevision
    });
    expect(state?.firstNightTaskPlan && state.firstNightTaskProgress
      ? state.firstNightTaskPlan.tasks[state.firstNightTaskProgress.settlements.length]?.taskType
      : undefined
    ).toBe("WITCH_ACTION");
    expect(state?.currentCharacterState).toStrictEqual(beforeEvilTwin.currentCharacterState);
    expect(state?.assignment).toStrictEqual(beforeEvilTwin.assignment);
  });

  it("keeps EVIL_TWIN_SETUP pair deterministic and uses the lowest-seat GOOD candidate", async () => {
    const { service, commandStore } = makeService();
    const { evilTwinTask, beforeEvilTwin } = await reachEvilTwinSetupTask(service, commandStore);
    const result = await service.execute(settleEvilTwinSetupCommand({
      commandId: commandId("settle-deterministic-evil-twin"),
      expectedGameVersion: 11,
      payload: {
        commandType: "SettleEvilTwinSetup",
        taskId: evilTwinTask.taskId
      }
    }));
    const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    const pair = state?.evilTwinPairs?.pairs[0];
    const source = evilTwinTask.source;
    if (pair === undefined || source.kind !== "ROLE" || beforeEvilTwin.currentCharacterState === undefined) {
      throw new Error("Expected Evil Twin pair and source");
    }

    const expectedGood = beforeEvilTwin.currentCharacterState.entries.find((entry) =>
      entry.currentAlignment === "GOOD" &&
      entry.playerId !== source.playerId &&
      entry.seatNumber !== source.seatNumber
    );
    expectAcceptedResult(result);
    expect(pair.pairingPolicyVersion).toBe("evil-twin-pairing-policy-v1");
    expect(pair.pairId).toBe(`evil-twin-pair-v1:${evilTwinTask.taskId}:evil-seat-${String(source.seatNumber).padStart(2, "0")}:good-seat-${String(expectedGood?.seatNumber).padStart(2, "0")}`);
    expect(pair.evilTwinPlayer).toStrictEqual({
      playerId: source.playerId,
      seatNumber: source.seatNumber
    });
    expect(pair.evilTwinAlignment).toBe("EVIL");
    expect(pair.goodTwinAlignment).toBe("GOOD");
    expect(pair.goodTwinPlayer).toStrictEqual({
      playerId: expectedGood?.playerId,
      seatNumber: expectedGood?.seatNumber
    });
  });

  it("rejects unsupported, early, duplicate, actor-invalid, and stale Evil Twin setup commands with receipts", async () => {
    const { service, commandStore } = makeService();
    await reachNoPhilosopherFirstNightTaskPlan(service);
    const earlyState = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    const earlyEvilTwinTask = earlyState?.firstNightTaskPlan?.tasks.find((task) => task.taskType === "EVIL_TWIN_SETUP");
    if (earlyEvilTwinTask === undefined) {
      throw new Error("Expected planned Evil Twin setup task");
    }

    const early = settleEvilTwinSetupCommand({
      commandId: commandId("early-evil-twin-setup"),
      expectedGameVersion: 7,
      payload: {
        commandType: "SettleEvilTwinSetup",
        taskId: earlyEvilTwinTask.taskId
      }
    });
    await expect(service.execute(early)).resolves.toMatchObject({
      status: "rejected",
      code: "ScheduledTaskNotNext",
      currentGameVersion: 7
    });
    expect((await commandStore.findCommandReceipt(early.gameId, early.commandId))?.result.status).toBe("rejected");

    const unsupported = settleEvilTwinSetupCommand({
      commandId: commandId("unsupported-evil-twin-setup"),
      expectedGameVersion: 7,
      payload: {
        commandType: "SettleEvilTwinSetup",
        taskId: scheduledTaskId("first-night-v1:MINION_INFO:system")
      }
    });
    await expect(service.execute(unsupported)).resolves.toMatchObject({
      status: "rejected",
      code: "UnsupportedRoleSetupTask"
    });

    const { service: readyService, commandStore: readyStore } = makeService();
    const { evilTwinTask } = await reachEvilTwinSetupTask(readyService, readyStore);
    const human = settleEvilTwinSetupCommand({
      commandId: commandId("human-evil-twin-setup"),
      expectedGameVersion: 11,
      actor: humanActor,
      payload: {
        commandType: "SettleEvilTwinSetup",
        taskId: evilTwinTask.taskId
      }
    });
    await expect(readyService.execute(human)).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });

    await readyService.execute(settleEvilTwinSetupCommand({
      commandId: commandId("settle-before-duplicate-evil-twin"),
      expectedGameVersion: 11,
      payload: {
        commandType: "SettleEvilTwinSetup",
        taskId: evilTwinTask.taskId
      }
    }));
    const duplicate = settleEvilTwinSetupCommand({
      commandId: commandId("duplicate-evil-twin-setup"),
      expectedGameVersion: 12,
      payload: {
        commandType: "SettleEvilTwinSetup",
        taskId: evilTwinTask.taskId
      }
    });
    const stale = settleEvilTwinSetupCommand({
      commandId: commandId("stale-evil-twin-setup"),
      expectedGameVersion: 11,
      payload: {
        commandType: "SettleEvilTwinSetup",
        taskId: evilTwinTask.taskId
      }
    });
    await expect(readyService.execute(duplicate)).resolves.toMatchObject({ status: "rejected", code: "ScheduledTaskAlreadySettled" });
    await expect(readyService.execute(stale)).resolves.toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch" });
    expect((await readyStore.findCommandReceipt(human.gameId, human.commandId))?.result.status).toBe("rejected");
    expect((await readyStore.findCommandReceipt(duplicate.gameId, duplicate.commandId))?.result.status).toBe("rejected");
    expect((await readyStore.findCommandReceipt(stale.gameId, stale.commandId))?.result.status).toBe("rejected");
  });

  it("keeps SettleEvilTwinSetup metadata generation failures classified independently", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FaultInjectingIdGenerator();
    const { service } = makeService(commandStore, testSetupGenerator, idGenerator);
    const { evilTwinTask } = await reachEvilTwinSetupTask(service, commandStore);
    const command = settleEvilTwinSetupCommand({
      commandId: commandId("evil-twin-metadata-failure"),
      expectedGameVersion: 11,
      payload: {
        commandType: "SettleEvilTwinSetup",
        taskId: evilTwinTask.taskId
      }
    });

    idGenerator.failNextBatchId = true;
    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 11,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(20);
  });

  it("opens WITCH_ACTION as a safe deterministic first-night action opportunity", async () => {
    const { service, commandStore } = makeService();
    const { witchTask } = await reachWitchActionTask(service, commandStore);

    const result = await service.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-witch-safe-opportunity"),
      expectedGameVersion: 12,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: witchTask.taskId
      }
    }));
    const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    const opportunity = state?.firstNightActionOpportunities?.opportunities.find((candidate) =>
      candidate.taskId === witchTask.taskId
    );

    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(13);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]?.eventType).toBe("FirstNightActionOpportunityCreated");
    expect(opportunity).toMatchObject({
      opportunityId: actionOpportunityId(`first-night-v1:WITCH_ACTION:seat-${String(witchTask.source.kind === "ROLE" ? witchTask.source.seatNumber : 0).padStart(2, "0")}:opportunity-01`),
      opportunityKind: "WITCH_FIRST_NIGHT_ACTION",
      taskId: witchTask.taskId,
      taskType: "WITCH_ACTION",
      opportunityStatus: "OPEN",
      visibility: {
        canChooseTarget: true,
        supportedDecisionKinds: ["CHOOSE_PLAYER"],
        targetSchema: "ANY_PLAYER"
      }
    });

    const serialized = JSON.stringify(opportunity);
    expect(serialized).not.toContain("willDie");
    expect(serialized).not.toContain("isEffective");
    expect(serialized).not.toContain("targetRole");
    expect(serialized).not.toContain("targetAlignment");
    expect(serialized).not.toContain("currentCharacterState");
    expect(serialized).not.toContain("assignment");
  });

  it("rejects invalid WITCH_ACTION opportunity opening attempts with deterministic receipts", async () => {
    const { service, commandStore } = makeService();
    await reachWitchActionTask(service, commandStore);
    const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    const witchTask = state?.firstNightTaskPlan?.tasks.find((task) => task.taskType === "WITCH_ACTION");
    const dreamerTask = state?.firstNightTaskPlan?.tasks.find((task) => task.taskType === "DREAMER_ACTION");
    if (witchTask === undefined || dreamerTask === undefined) {
      throw new Error("Expected Witch and Dreamer tasks");
    }

    const humanOpen = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("human-open-witch"),
      expectedGameVersion: 12,
      actor: humanActor,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: witchTask.taskId
      }
    });
    await expect(service.execute(humanOpen)).resolves.toMatchObject({
      status: "rejected",
      code: "ActorNotAllowed"
    });

    const earlyDreamer = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("early-open-dreamer-before-witch"),
      expectedGameVersion: 12,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: dreamerTask.taskId
      }
    });
    await expect(service.execute(earlyDreamer)).resolves.toMatchObject({
      status: "rejected",
      code: "ScheduledTaskNotNext"
    });

    const open = await service.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-witch-before-duplicate"),
      expectedGameVersion: 12,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: witchTask.taskId
      }
    }));
    expectAcceptedResult(open);

    const duplicate = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("duplicate-open-witch"),
      expectedGameVersion: 13,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: witchTask.taskId
      }
    });
    await expect(service.execute(duplicate)).resolves.toMatchObject({
      status: "rejected",
      code: "ActionOpportunityAlreadyOpen"
    });
    expect((await commandStore.findCommandReceipt(duplicate.gameId, duplicate.commandId))?.result.status).toBe("rejected");
  });

  it("submits an effective Witch target choice and records a deferred death marker", async () => {
    const { service, commandStore } = makeService();
    const { witchTask, opportunity, state: beforeSubmit } = await reachOpenWitchActionOpportunity(service, commandStore);
    const target = beforeSubmit.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) {
      throw new Error("Expected Witch target");
    }

    const result = await service.execute(submitWitchActionCommand({
      commandId: commandId("submit-effective-witch-target"),
      expectedGameVersion: 13,
      actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
      payload: {
        commandType: "SubmitWitchAction",
        taskId: witchTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      }
    }));
    const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));

    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(14);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "WitchTargetChosen",
      "WitchDeathPendingMarked",
      "ScheduledTaskSettled"
    ]);
    expect(result.events.map((event) => event.eventSequence)).toStrictEqual([25, 26, 27]);
    expect(state?.witchTargetChoices?.choices).toHaveLength(1);
    expect(state?.witchDeathPending?.pendingDeaths).toHaveLength(1);
    expect(state?.witchIneffectiveResolutions).toBeUndefined();
    expect(state?.witchDeathPending?.pendingDeaths[0]).toMatchObject({
      taskId: witchTask.taskId,
      taskType: "WITCH_ACTION",
      opportunityId: opportunity.opportunityId,
      targetPlayerId: target.playerId,
      targetSeatNumber: target.seatNumber,
      pendingDeathId: `witch-death-pending-v1:${witchTask.taskId}:source-seat-${String(opportunity.sourceSeatNumber).padStart(2, "0")}:target-seat-${String(target.seatNumber).padStart(2, "0")}`,
      trigger: "TARGET_NOMINATES_TOMORROW",
      markerVersion: "witch-death-pending-v1"
    });
    expect(state?.firstNightTaskProgress?.settlements.at(-1)).toMatchObject({
      taskType: "WITCH_ACTION",
      outcomeType: "WITCH_DEATH_PENDING_MARKED",
      characterStateRevision: opportunity.sourceCharacterStateRevision
    });
    expect(state?.firstNightActionOpportunities?.opportunities.find((candidate) =>
      candidate.opportunityId === opportunity.opportunityId
    )?.opportunityStatus).toBe("CLOSED");
    expect(state?.firstNightTaskPlan && state.firstNightTaskProgress
      ? state.firstNightTaskPlan.tasks[state.firstNightTaskProgress.settlements.length]?.taskType
      : undefined
    ).toBe("DREAMER_ACTION");
    expect(state?.currentCharacterState).toStrictEqual(beforeSubmit.currentCharacterState);
    expect(state?.assignment).toStrictEqual(beforeSubmit.assignment);
    expect(state?.firstNightTaskPlan).toStrictEqual(beforeSubmit.firstNightTaskPlan);
    expect(JSON.stringify(result.events[0]?.payload)).not.toContain("targetRole");
    expect(JSON.stringify(result.events[1]?.payload)).not.toContain("targetAlignment");
  });

  it("accepts Storyteller, System, source Human, and self-target Witch submissions", async () => {
    const { service, commandStore } = makeService();
    const { witchTask, opportunity } = await reachOpenWitchActionOpportunity(service, commandStore);

    const result = await service.execute(submitWitchActionCommand({
      commandId: commandId("source-human-witch-self-target"),
      expectedGameVersion: 13,
      actor: { kind: "human", playerId: opportunity.sourcePlayerId },
      payload: {
        commandType: "SubmitWitchAction",
        taskId: witchTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: opportunity.sourcePlayerId
        }
      }
    }));
    expectAcceptedResult(result);

    for (const [actorName, actor] of [
      ["storyteller", storytellerActor],
      ["system", systemActor]
    ] as const) {
      const nextStore = new MemoryCommandCommitStore();
      const { service: nextService, commandStore: nextCommandStore } = makeService(nextStore);
      const next = await reachOpenWitchActionOpportunity(nextService, nextCommandStore);
      const nextTarget = next.state.roster?.entries.find((entry) => entry.playerId !== next.opportunity.sourcePlayerId);
      if (nextTarget === undefined) {
        throw new Error("Expected Witch target");
      }
      await expect(nextService.execute(submitWitchActionCommand({
        commandId: commandId(`${actorName}-witch-submit`),
        expectedGameVersion: 13,
        actor,
        payload: {
          commandType: "SubmitWitchAction",
          taskId: next.witchTask.taskId,
          opportunityId: next.opportunity.opportunityId,
          decision: {
            kind: "CHOOSE_PLAYER",
            targetPlayerId: nextTarget.playerId
          }
        }
      }))).resolves.toMatchObject({ status: "accepted", gameVersion: 14 });
    }
  });

});

describeApplicationServiceShard("information-and-later-actions", "GameApplicationService", () => {
  it("rejects invalid Witch submissions and opens the next Dreamer opportunity", async () => {
    const { service, commandStore } = makeService();
    const { witchTask, opportunity, state } = await reachOpenWitchActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) {
      throw new Error("Expected Witch target");
    }

    const nonSource = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (nonSource === undefined) {
      throw new Error("Expected non-source actor");
    }
    await expect(service.execute(submitWitchActionCommand({
      commandId: commandId("non-source-witch-submit"),
      expectedGameVersion: 13,
      actor: { kind: "ai", playerId: nonSource.playerId },
      payload: {
        commandType: "SubmitWitchAction",
        taskId: witchTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "ActorPlayerMismatch" });

    await expect(service.execute(submitWitchActionCommand({
      commandId: commandId("unknown-witch-target"),
      expectedGameVersion: 13,
      payload: {
        commandType: "SubmitWitchAction",
        taskId: witchTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: playerId("unknown-player")
        }
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "InvalidWitchTarget" });

    await expect(service.execute(submitWitchActionCommand({
      commandId: commandId("extra-field-witch-target"),
      expectedGameVersion: 13,
      payload: {
        commandType: "SubmitWitchAction",
        taskId: witchTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId,
          targetSeatNumber: target.seatNumber
        } as never
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "InvalidWitchTarget" });

    const acceptedWitch = await service.execute(submitWitchActionCommand({
      commandId: commandId("settle-witch-before-dreamer-rejection"),
      expectedGameVersion: 13,
      payload: {
        commandType: "SubmitWitchAction",
        taskId: witchTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      }
    }));
    expectAcceptedResult(acceptedWitch);
    const afterWitch = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    const dreamerTask = afterWitch?.firstNightTaskPlan?.tasks.find((task) =>
      task.taskType === "DREAMER_ACTION" &&
      afterWitch.firstNightTaskProgress !== undefined &&
      afterWitch.firstNightTaskPlan?.tasks[afterWitch.firstNightTaskProgress.settlements.length]?.taskId === task.taskId
    );
    if (dreamerTask === undefined) {
      throw new Error("Expected next Dreamer task");
    }

    const openDreamer = await service.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-dreamer-not-supported-yet"),
      expectedGameVersion: 14,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: dreamerTask.taskId
      }
    }));
    expectAcceptedResult(openDreamer);
    expect(openDreamer.events[0]).toMatchObject({
      eventType: "FirstNightActionOpportunityCreated",
      payload: {
        taskType: "DREAMER_ACTION",
        opportunityKind: "DREAMER_FIRST_NIGHT_ACTION",
        visibility: {
          canChooseTarget: true,
          supportedDecisionKinds: ["CHOOSE_PLAYER"],
          targetSchema: "OTHER_NON_TRAVELLER_PLAYER"
        }
      }
    });
  });

  it("submits an effective Dreamer choice for a GOOD target and delivers isolated role information", async () => {
    const { service, commandStore } = makeService();
    const { dreamerTask, opportunity, state: beforeSubmit } = await reachOpenDreamerActionOpportunity(service, commandStore);
    const target = beforeSubmit.currentCharacterState?.entries.find((entry) =>
      entry.playerId !== opportunity.sourcePlayerId &&
      entry.role.defaultAlignment === "GOOD"
    );
    const lowestEvilRole = beforeSubmit.setup?.roleCatalogSnapshot.roles
      .filter((role) => role.defaultAlignment === "EVIL")
      .sort((left, right) => left.roleId < right.roleId ? -1 : left.roleId > right.roleId ? 1 : 0)[0];
    if (target === undefined || lowestEvilRole === undefined) {
      throw new Error("Expected GOOD Dreamer target and EVIL false role");
    }

    const result = await service.execute(submitDreamerActionCommand({
      commandId: commandId("submit-effective-dreamer-good-target"),
      expectedGameVersion: 15,
      actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
      payload: {
        commandType: "SubmitDreamerAction",
        taskId: dreamerTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      }
    }));
    const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));

    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(16);
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "DreamerTargetChosen",
      "DreamerInformationDelivered",
      "ScheduledTaskSettled"
    ]);
    expect(result.events.map((event) => event.eventSequence)).toStrictEqual([29, 30, 31]);
    expect(state?.dreamerTargetChoices?.choices).toHaveLength(1);
    expect(state?.dreamerInformation?.deliveries).toHaveLength(1);
    expect(state?.dreamerInformation?.deliveries[0]).toMatchObject({
      taskId: dreamerTask.taskId,
      taskType: "DREAMER_ACTION",
      opportunityId: opportunity.opportunityId,
      knowledgeModelVersion: "dreamer-information-model-v1",
      knowledgeStage: "DREAMER_INFORMATION",
      targetPlayerId: target.playerId,
      targetSeatNumber: target.seatNumber,
      informationReliability: { kind: "EFFECTIVE" },
      goodRole: target.role,
      evilRole: lowestEvilRole,
      falseRolePolicyVersion: "dreamer-false-role-policy-v1"
    });
    expect(state?.firstNightTaskProgress?.settlements.at(-1)).toMatchObject({
      taskType: "DREAMER_ACTION",
      outcomeType: "DREAMER_INFORMATION_DELIVERED",
      characterStateRevision: opportunity.sourceCharacterStateRevision
    });
    expect(state?.firstNightActionOpportunities?.opportunities.find((candidate) =>
      candidate.opportunityId === opportunity.opportunityId
    )?.opportunityStatus).toBe("CLOSED");
    expect(state?.firstNightTaskPlan && state.firstNightTaskProgress
      ? state.firstNightTaskPlan.tasks[state.firstNightTaskProgress.settlements.length]?.taskType
      : undefined
    ).toBe("SEAMSTRESS_ACTION");
    expect(state?.currentCharacterState).toStrictEqual(beforeSubmit.currentCharacterState);
    expect(state?.assignment).toStrictEqual(beforeSubmit.assignment);
    expect(JSON.stringify(result.events[0]?.payload)).not.toContain("targetRole");
    expect(JSON.stringify(result.events[0]?.payload)).not.toContain("targetAlignment");
    expect(JSON.stringify(result.events[1]?.payload)).not.toContain("correctRole");
    expect(JSON.stringify(result.events[1]?.payload)).not.toContain("assignment");
    expect(state?.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
      abilityRoleId: "dreamer", outcomeStatus: "NORMAL", causeKind: "NO_OTHER_CHARACTER_ABILITY"
    });
  });

  it("submits an effective Dreamer choice for an EVIL target with the target role in the EVIL slot", async () => {
    const { service, commandStore } = makeService();
    const { dreamerTask, opportunity, state } = await reachOpenDreamerActionOpportunity(service, commandStore);
    const target = state.currentCharacterState?.entries.find((entry) =>
      entry.playerId !== opportunity.sourcePlayerId &&
      entry.role.defaultAlignment === "EVIL"
    );
    if (target === undefined) {
      throw new Error("Expected EVIL Dreamer target");
    }

    const result = await service.execute(submitDreamerActionCommand({
      commandId: commandId("submit-effective-dreamer-evil-target"),
      expectedGameVersion: 15,
      payload: {
        commandType: "SubmitDreamerAction",
        taskId: dreamerTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      }
    }));

    expectAcceptedResult(result);
    const information = result.events[1]?.payload as { readonly evilRole?: unknown; readonly goodRole?: unknown };
    expect(information.evilRole).toStrictEqual(target.role);
    expect(JSON.stringify(information)).not.toContain("targetAlignment");
  });

  it("rejects invalid Dreamer submissions with deterministic receipts", async () => {
    const { service, commandStore } = makeService();
    const { dreamerTask, opportunity, state } = await reachOpenDreamerActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    const nonSource = state.roster?.entries.find((entry) =>
      entry.playerId !== opportunity.sourcePlayerId &&
      entry.playerId !== target?.playerId
    );
    if (target === undefined || nonSource === undefined) {
      throw new Error("Expected Dreamer target and non-source actor");
    }

    await expect(service.execute(submitDreamerActionCommand({
      commandId: commandId("non-source-dreamer-submit"),
      expectedGameVersion: 15,
      actor: { kind: "ai", playerId: nonSource.playerId },
      payload: {
        commandType: "SubmitDreamerAction",
        taskId: dreamerTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "ActorPlayerMismatch" });

    await expect(service.execute(submitDreamerActionCommand({
      commandId: commandId("self-target-dreamer-submit"),
      expectedGameVersion: 15,
      payload: {
        commandType: "SubmitDreamerAction",
        taskId: dreamerTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: opportunity.sourcePlayerId
        }
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "InvalidDreamerTarget" });

    await expect(service.execute(submitDreamerActionCommand({
      commandId: commandId("unknown-dreamer-target"),
      expectedGameVersion: 15,
      payload: {
        commandType: "SubmitDreamerAction",
        taskId: dreamerTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: playerId("unknown-player")
        }
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "InvalidDreamerTarget" });

    await expect(service.execute(submitDreamerActionCommand({
      commandId: commandId("extra-field-dreamer-target"),
      expectedGameVersion: 15,
      payload: {
        commandType: "SubmitDreamerAction",
        taskId: dreamerTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId,
          targetSeatNumber: target.seatNumber
        } as never
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "InvalidDreamerTarget" });

    await expect(service.execute(submitDreamerActionCommand({
      commandId: commandId("hidden-payload-dreamer-target"),
      expectedGameVersion: 15,
      payload: {
        commandType: "SubmitDreamerAction",
        taskId: dreamerTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        },
        targetRoleId: roleId("fang_gu")
      } as never
    }))).resolves.toMatchObject({ status: "rejected", code: "InvalidDreamerTarget" });

    expect((await commandStore.findCommandReceipt(ids.game, commandId("hidden-payload-dreamer-target")))?.result.status).toBe("rejected");
  });

  it("keeps SubmitDreamerAction metadata generation failures classified independently", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FaultInjectingIdGenerator();
    const { service } = makeService(commandStore, testSetupGenerator, idGenerator);
    const { dreamerTask, opportunity, state } = await reachOpenDreamerActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) {
      throw new Error("Expected Dreamer target");
    }
    const command = submitDreamerActionCommand({
      commandId: commandId("dreamer-metadata-failure"),
      expectedGameVersion: 15,
      payload: {
        commandType: "SubmitDreamerAction",
        taskId: dreamerTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      }
    });

    idGenerator.failNextBatchId = true;
    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 15,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(28);
  });

  it("rejects SubmitDreamerAction accessors before receipt or event work", async () => {
    const { service, commandStore } = makeService();
    const { dreamerTask, opportunity, state } = await reachOpenDreamerActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) {
      throw new Error("Expected Dreamer target");
    }

    let opportunityIdReads = 0;
    const command = submitDreamerActionCommand({
      commandId: commandId("mutating-submit-dreamer-action"),
      expectedGameVersion: 15,
      payload: {
        commandType: "SubmitDreamerAction",
        taskId: dreamerTask.taskId,
        get opportunityId() {
          opportunityIdReads += 1;
          return opportunityIdReads === 1
            ? opportunity.opportunityId
            : actionOpportunityId("first-night-v1:DREAMER_ACTION:seat-99:opportunity-01");
        },
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      } as never
    });

    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "command-validation",
      retryable: true
    });
    expect(failedResult.message).toContain("enumerable data properties");
    expect("currentGameVersion" in failedResult).toBe(false);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(28);
  });

  it("opens base Seamstress as the next safe deterministic first-night DEFER opportunity", async () => {
    const { service, commandStore } = makeService();
    const { seamstressTask } = await reachSeamstressActionTask(service, commandStore);

    const result = await service.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-seamstress-safe-opportunity"),
      expectedGameVersion: 16,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: seamstressTask.taskId
      }
    }));
    const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    const opportunity = state?.firstNightActionOpportunities?.opportunities.find((candidate) =>
      candidate.taskId === seamstressTask.taskId
    );
    if (opportunity === undefined) throw new Error("Expected base Seamstress opportunity");

    expectAcceptedResult(result);
    expect(result.gameVersion).toBe(17);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      eventType: "FirstNightActionOpportunityCreated",
      payload: {
        opportunityId: actionOpportunityId(`first-night-v1:SEAMSTRESS_ACTION:seat-${String(seamstressTask.source.kind === "ROLE" ? seamstressTask.source.seatNumber : 0).padStart(2, "0")}:opportunity-01`),
        opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION",
        taskId: seamstressTask.taskId,
        taskType: "SEAMSTRESS_ACTION",
        opportunityStatus: "OPEN",
        visibility: {
          visibilitySchemaVersion: "seamstress-first-night-action-v2",
          resolutionCapabilityVersion: "seamstress-snv-first-night-resolution-v1",
          canDefer: true,
          canChooseTargets: true,
          supportedDecisionKinds: ["DEFER", "CHOOSE_TWO_PLAYERS"],
          futureUnsupportedDecisionKinds: [],
          targetSchema: "EXACTLY_TWO_DISTINCT_OTHER_MODELED_PLAYERS"
        }
      }
    });
    expect(opportunity).toMatchObject({
      opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION",
      taskId: seamstressTask.taskId,
      taskType: "SEAMSTRESS_ACTION",
      opportunityStatus: "OPEN",
      visibility: {
        visibilitySchemaVersion: "seamstress-first-night-action-v2",
        resolutionCapabilityVersion: "seamstress-snv-first-night-resolution-v1",
        canDefer: true,
        canChooseTargets: true,
        supportedDecisionKinds: ["DEFER", "CHOOSE_TWO_PLAYERS"],
        futureUnsupportedDecisionKinds: [],
        targetSchema: "EXACTLY_TWO_DISTINCT_OTHER_MODELED_PLAYERS"
      }
    });
    expect(isSeamstressActionOpportunityV2(opportunity)).toBe(true);

    const serialized = JSON.stringify(opportunity);
    expect(serialized).not.toContain("selectedPlayer");
    expect(serialized).not.toContain("sameAlignment");
    expect(serialized).not.toContain("answer");
    expect(serialized).not.toContain("abilitySpent");
    expect(serialized).not.toContain("currentCharacterState");
    expect(serialized).not.toContain("assignment");
  });

  it("rejects early and Human-opened Seamstress opportunities but opens Philosopher-gained V2", async () => {
    const { service, commandStore } = makeService();
    const { seamstressTask } = await reachSeamstressActionTask(service, commandStore);

    const humanOpen = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("human-open-seamstress"),
      expectedGameVersion: 16,
      actor: humanActor,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: seamstressTask.taskId
      }
    });
    await expect(service.execute(humanOpen)).resolves.toMatchObject({
      status: "rejected",
      code: "ActorNotAllowed",
      currentGameVersion: 16
    });

    const earlyStore = new MemoryCommandCommitStore();
    const { service: earlyService } = makeService(earlyStore);
    await reachDreamerActionTask(earlyService, earlyStore);
    await expect(earlyService.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("early-open-seamstress-before-dreamer"),
      expectedGameVersion: 14,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: seamstressTask.taskId
      }
    }))).resolves.toMatchObject({
      status: "rejected",
      code: "ScheduledTaskNotNext",
      currentGameVersion: 14
    });

    const gainedStore = new MemoryCommandCommitStore();
    const { service: gainedService } = makeService(gainedStore);
    await reachOpenPhilosopherActionOpportunity(gainedService);
    await gainedService.execute(choosePhilosopherRoleCommand("seamstress", {
      commandId: commandId("choose-seamstress-before-unsupported-open")
    }));
    const gainedTaskId = scheduledTaskId("first-night-v2:PHILOSOPHER_GAINED:SEAMSTRESS_ACTION:seat-10:from-seamstress");
    const gainedReady = await advanceToScheduledTask(gainedService, gainedStore, gainedTaskId, "advance-gained-seamstress");
    const gainedResult = await gainedService.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-gained-seamstress-unsupported"),
      expectedGameVersion: gainedReady.gameVersion,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: gainedTaskId
      }
    }));
    expectAcceptedResult(gainedResult);
    expect(gainedResult).toMatchObject({ status: "accepted", gameVersion: gainedReady.gameVersion + 1 });
    const gainedState = rebuildOptionalGameState(await gainedStore.loadDomainEvents(ids.game));
    const gainedOpportunity = gainedState?.firstNightActionOpportunities?.opportunities.find((candidate) =>
      candidate.taskId === gainedTaskId
    );
    if (gainedOpportunity === undefined) throw new Error("Expected Philosopher-gained Seamstress opportunity");
    expect(isSeamstressActionOpportunityV2(gainedOpportunity)).toBe(true);
    expect(gainedOpportunity).toMatchObject({
      opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION",
      sourceRole: { roleId: "philosopher" },
      abilitySource: { kind: "PHILOSOPHER_GRANT", abilityRoleId: "seamstress" },
      visibility: { supportedDecisionKinds: ["DEFER", "CHOOSE_TWO_PLAYERS"] }
    });
  });

  it("[R4-T10] emits a SeamstressInformationDelivered ledger SOURCE_EVENT fact for a V2 choice", async () => {
    const { service, commandStore } = makeService();
    const { seamstressTask, opportunity, state: beforeSubmit } = await reachOpenSeamstressActionOpportunity(service, commandStore);
    if (!isSeamstressActionOpportunityV2(opportunity) || beforeSubmit.currentCharacterState === undefined) {
      throw new Error("Expected a V2 Seamstress opportunity");
    }
    const targets = beforeSubmit.currentCharacterState.entries
      .filter((entry) => entry.playerId !== opportunity.sourcePlayerId)
      .slice(0, 3);
    if (targets[0] === undefined || targets[1] === undefined || targets[2] === undefined) {
      throw new Error("Expected three modeled players for Seamstress identity checks");
    }
    const command = submitSeamstressActionCommand({
      commandId: commandId("submit-seamstress-choice-v2"),
      expectedGameVersion: 17,
      actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
      payload: {
        commandType: "SubmitSeamstressAction",
        taskId: seamstressTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: { kind: "CHOOSE_TWO_PLAYERS", targetPlayerIds: [targets[1].playerId, targets[0].playerId] }
      }
    });

    const result = await service.execute(command);
    expectEventSummaryAcceptedResult(result);
    expect(result).toStrictEqual({
      status: "accepted",
      resultSchemaVersion: "accepted-event-summary-v1",
      eventDisclosure: "EVENT_TYPES_ONLY",
      gameId: command.gameId,
      gameVersion: 18,
      eventCount: 4,
      eventTypes: ["SeamstressTargetsChosen", "SeamstressAbilitySpent", "SeamstressInformationDelivered", "ScheduledTaskSettled"],
      idempotent: false
    });
    const committedStream = await commandStore.loadDomainEvents(command.gameId);
    const committed = committedStream.filter((event) => event.commandId === command.commandId);
    expect(committed.map((event) => event.eventType)).toStrictEqual(result.eventTypes);
    expect(committed[0]?.payload).toMatchObject({
      targetPlayerIds: [targets[0].playerId, targets[1].playerId],
      targetSeatNumbers: [targets[0].seatNumber, targets[1].seatNumber]
    });
    const state = rebuildOptionalGameState(await commandStore.loadDomainEvents(command.gameId));
    expect(state?.seamstressAbilityState?.entitlements.find((entry) =>
      entry.abilityUseEntitlementId === opportunity.abilityUseEntitlementId
    )?.status).toBe("SPENT");
    expect(state?.seamstressInformation?.deliveries).toHaveLength(1);
    expect(state?.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
      abilityRoleId: "seamstress", outcomeStatus: "NORMAL", causeKind: "NO_OTHER_CHARACTER_ABILITY"
    });
    expect(state?.firstNightAbilityOutcomeLedger?.facts.at(-1)?.evidenceReferences.find((entry) => entry.kind === "SOURCE_EVENT"))
      .toMatchObject({ kind: "SOURCE_EVENT", eventType: "SeamstressInformationDelivered" });
    const beforeSeamstressTerminal = domainCore.applyDomainEvent(domainCore.applyDomainEvent(beforeSubmit,committed[0]!),committed[1]!);
    const seamstressTerminal = committed[2]!;
    if(seamstressTerminal.eventType!=="SeamstressInformationDelivered")throw new Error("Expected direct Seamstress terminal");
    const directSeamstress=(kind:"DRUNK"|"POISONED",wrong:boolean,includeImpairment=true)=>{
      const source=beforeSeamstressTerminal.currentCharacterState!.entries.find((entry)=>entry.playerId===opportunity.sourcePlayerId)!;const impairmentId=abilityImpairmentId(`round4-seamstress-${kind.toLowerCase()}`);
      const stateWithImpairment=(includeImpairment?{...beforeSeamstressTerminal,abilityImpairments:{impairments:[{impairmentId,kind,sourceKind:"PHILOSOPHER_CHOSEN_DUPLICATE" as const,sourcePlayerId:source.playerId,affectedPlayerId:source.playerId,affectedSeatNumber:source.seatNumber,affectedRole:source.role,chosenRoleId:roleId("seamstress"),sourceCharacterStateRevision:source.role.roleId===opportunity.sourceRole.roleId?opportunity.sourceCharacterStateRevision:1}]}}:beforeSeamstressTerminal) as unknown as GameState;
      const evidence={impairmentId,impairmentKind:kind,impairmentSourceKind:"PHILOSOPHER_CHOSEN_DUPLICATE" as const,appliedCharacterStateRevision:opportunity.sourceCharacterStateRevision};
      const deliveredAnswer=wrong?(seamstressTerminal.payload.comparison.ruleCorrectAnswer==="YES"?"NO":"YES"):seamstressTerminal.payload.comparison.ruleCorrectAnswer;
      const event={...seamstressTerminal,payload:{...seamstressTerminal.payload,deliveredAnswer,sourceEffectiveness:{kind:"KNOWN_INEFFECTIVE" as const,representedImpairments:[evidence] as const,unresolvedEffectKinds:["CONTINUOUS_POISON_NOT_MODELED"] as const},informationReliability:"RULE_CORRECT_SELECTED_WITH_KNOWN_IMPAIRMENT" as const}};
      return deriveFirstNightAbilityOutcomeFact({stateBefore:stateWithImpairment,event});
    };
    expect(directSeamstress("DRUNK",false)).toMatchObject({outcomeStatus:"NORMAL",causeKind:"NO_OTHER_CHARACTER_ABILITY"});
    expect(directSeamstress("DRUNK",true)).toMatchObject({outcomeStatus:"ABNORMAL",causeKind:"SOURCE_DRUNKENNESS"});
    expect(directSeamstress("POISONED",true)).toMatchObject({outcomeStatus:"ABNORMAL",causeKind:"SOURCE_POISONING"});
    expect(()=>directSeamstress("DRUNK",true,false),"[R4-64] wrong answer without impairment").toThrowError(DomainError);
    const unknownTarget={...seamstressTerminal,payload:{...seamstressTerminal.payload,targetPlayerIds:[playerId("unknown-target"),seamstressTerminal.payload.targetPlayerIds[1]] as const}};
    expect(()=>deriveFirstNightAbilityOutcomeFact({stateBefore:beforeSeamstressTerminal,event:unknownTarget}),"[R4-66] target identity mismatch").toThrowError(DomainError);
    expect(() => validateDomainBatchSemantics(beforeSubmit, committed)).not.toThrow();
    expect(() => validateDomainEventStream(committedStream)).not.toThrow();

    const invalidBatches: readonly (readonly AnyDomainEventEnvelope[])[] = [
      committed.slice(0, 3),
      [committed[1]!, committed[0]!, committed[2]!, committed[3]!],
      [...committed, { ...committed[3]!, eventId: committed[2]!.eventId, eventSequence: committed[3]!.eventSequence + 1 }],
      [committed[0]!, committed[1]!, committed[1]!, committed[3]!],
      [
        committed[0]!,
        committed[1]!,
        {
          ...committed[2]!,
          payload: {
            ...committed[2]!.payload,
            settlementCharacterStateRevision: opportunity.sourceCharacterStateRevision + 1
          }
        } as AnyDomainEventEnvelope,
        committed[3]!
      ],
      [
        {
          ...committed[0]!,
          payload: {
            ...committed[0]!.payload,
            sourceRoleTenureId: "role-tenure-v1:seat-03:role-seamstress:acquired-revision-2"
          }
        } as AnyDomainEventEnvelope,
        committed[1]!,
        committed[2]!,
        committed[3]!
      ]
    ];
    for (const invalidBatch of invalidBatches) {
      expect(() => validateDomainBatchSemantics(beforeSubmit, invalidBatch)).toThrow();
    }

    const commandStart = committedStream.findIndex((event) => event.commandId === command.commandId);
    const incompleteStream = committedStream.filter((event) =>
      !(event.commandId === command.commandId && event.eventType === "SeamstressInformationDelivered")
    );
    const reorderedStream = [...committedStream];
    reorderedStream[commandStart] = committed[1]!;
    reorderedStream[commandStart + 1] = committed[0]!;
    expect(() => validateDomainEventStream(incompleteStream)).toThrow();
    expect(() => validateDomainEventStream(reorderedStream)).toThrow();

    const receipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);
    expect(receipt?.result).toStrictEqual(result);
    expect("events" in (receipt?.result ?? {})).toBe(false);
    const retry = await service.execute(command);
    expect(retry).toStrictEqual({ ...result, idempotent: true });

    const eventCountBeforeConflicts = (await commandStore.loadDomainEvents(command.gameId)).length;
    const conflictVariants = [
      submitSeamstressActionCommand({
        ...command,
        payload: {
          ...command.payload,
          decision: { kind: "CHOOSE_TWO_PLAYERS", targetPlayerIds: [targets[0].playerId, targets[1].playerId] }
        }
      }),
      submitSeamstressActionCommand({
        ...command,
        payload: {
          ...command.payload,
          decision: { kind: "CHOOSE_TWO_PLAYERS", targetPlayerIds: [targets[1].playerId, targets[2].playerId] }
        }
      }),
      submitSeamstressActionCommand({
        ...command,
        payload: { ...command.payload, decision: { kind: "DEFER" } }
      })
    ];
    for (const conflictCommand of conflictVariants) {
      await expect(service.execute(conflictCommand)).resolves.toStrictEqual({
        status: "rejected",
        gameId: command.gameId,
        code: "CommandIdempotencyConflict",
        message: "commandId is already associated with a different command",
        currentGameVersion: 18,
        idempotent: false
      });
    }
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(eventCountBeforeConflicts);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toStrictEqual(receipt);
  });

  it.each([
    ["No Dashii present without derived adjacency", noPhilosopherNoDashiiExactRoleIds, "NONE", "NOT_PROVEN"],
    ["effective Vortox", noPhilosopherVortoxExactRoleIds, "VORTOX_FALSE_REQUIRED", "NOT_PROVEN"]
  ] as const)(
    "keeps the four public event types and summary shape invariant for %s",
    async (_name, exactRoleIds, expectedConstraint, expectedEffectiveness) => {
      const commandStore = new MemoryCommandCommitStore();
      const { service } = makeService(commandStore);
      const { seamstressTask, opportunity, state } = await reachOpenSeamstressActionOpportunity(
        service,
        commandStore,
        exactRoleIds
      );
      const targets = state.currentCharacterState?.entries
        .filter((entry) => entry.playerId !== opportunity.sourcePlayerId)
        .slice(0, 2);
      if (targets?.[0] === undefined || targets[1] === undefined) throw new Error("Expected modifier-table targets");
      const command = submitSeamstressActionCommand({
        commandId: commandId(`modifier-table-${expectedConstraint.toLowerCase()}`),
        expectedGameVersion: 17,
        payload: {
          commandType: "SubmitSeamstressAction",
          taskId: seamstressTask.taskId,
          opportunityId: opportunity.opportunityId,
          decision: { kind: "CHOOSE_TWO_PLAYERS", targetPlayerIds: [targets[0].playerId, targets[1].playerId] }
        }
      });

      const result = await service.execute(command);
      expectEventSummaryAcceptedResult(result);
      expect(result).toStrictEqual({
        status: "accepted",
        resultSchemaVersion: "accepted-event-summary-v1",
        eventDisclosure: "EVENT_TYPES_ONLY",
        gameId: command.gameId,
        gameVersion: 18,
        eventCount: 4,
        eventTypes: ["SeamstressTargetsChosen", "SeamstressAbilitySpent", "SeamstressInformationDelivered", "ScheduledTaskSettled"],
        idempotent: false
      });
      const committed = (await commandStore.loadDomainEvents(command.gameId)).filter((event) =>
        event.commandId === command.commandId
      );
      expect(committed.map((event) => event.eventType)).toStrictEqual(result.eventTypes);
      const delivery = committed.find((event) => event.eventType === "SeamstressInformationDelivered");
      if (delivery?.eventType !== "SeamstressInformationDelivered") throw new Error("Expected modifier-table delivery");
      expect(delivery.payload.deliveryConstraint.kind).toBe(expectedConstraint);
      expect(delivery.payload.sourceEffectiveness.kind).toBe(expectedEffectiveness);
      const rebuilt = rebuildOptionalGameState(await commandStore.loadDomainEvents(command.gameId));
      const seamstressFact = rebuilt?.firstNightAbilityOutcomeLedger?.facts.at(-1);
      expect(seamstressFact).toMatchObject(expectedConstraint === "VORTOX_FALSE_REQUIRED"
        ? { abilityRoleId: "seamstress", outcomeStatus: "ABNORMAL", causeKind: "VORTOX_FALSE_INFORMATION" }
        : { abilityRoleId: "seamstress", outcomeStatus: "NORMAL", causeKind: "NO_OTHER_CHARACTER_ABILITY" });
      if (expectedConstraint === "NONE") {
        expect(delivery.payload.sourceEffectiveness).toMatchObject({
          kind: "NOT_PROVEN",
          unresolvedEffectKinds: ["CONTINUOUS_POISON_NOT_MODELED"]
        });
      }
      expect(JSON.stringify(result)).not.toContain("VORTOX");
      expect(JSON.stringify(result)).not.toContain("NOT_PROVEN");
      expect(JSON.stringify(result)).not.toContain("no_dashii");
    }
  );

  it.each(["sects_and_violets", "Sects-And-Violets", " sects-and-violets "])(
    "rejects noncanonical Seamstress capability script alias %s before event creation",
    async (scriptId) => {
      const { service, commandStore } = makeService();
      await service.execute(createGameCommand());
      const result = await service.execute(selectScriptCommand({
        payload: { ...selectScriptCommand().payload, scriptId }
      }));

      expect(result).toMatchObject({ status: "rejected", code: "UnsupportedScript" });
      expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(1);
    }
  );

});

describeApplicationServiceShard("compatibility-and-failure-boundaries", "GameApplicationService", () => {
  it("treats reordered own data properties as the same structural command", async () => {
    const { service, commandStore } = makeService();
    const original = createGameCommand();
    const reordered = {
      payload: {
        storytellerCount: original.payload.storytellerCount,
        aiPlayerCount: original.payload.aiPlayerCount,
        humanPlayerCount: original.payload.humanPlayerCount,
        playerCount: original.payload.playerCount,
        rulesBaselineVersion: original.payload.rulesBaselineVersion,
        rootSeed: original.payload.rootSeed,
        commandType: original.payload.commandType
      },
      correlationId: original.correlationId,
      issuedAt: original.issuedAt,
      actor: { systemId: "test", kind: "system" as const },
      expectedGameVersion: original.expectedGameVersion,
      gameId: original.gameId,
      commandId: original.commandId
    } satisfies typeof original;

    const first = await service.execute(original);
    const retry = await service.execute(reordered);

    expectAcceptedResult(first);
    expectAcceptedResult(retry);
    expect(retry).toStrictEqual({ ...first, idempotent: true });
    expect(await commandStore.loadDomainEvents(original.gameId)).toHaveLength(1);
    expect(commandStore.getReceiptCount()).toBe(1);
  });

  it.each([
    ["actor", (command: ReturnType<typeof createGameCommand>) => ({ ...command, actor: { kind: "system" as const, systemId: "other" } })],
    ["expected version", (command: ReturnType<typeof createGameCommand>) => ({ ...command, expectedGameVersion: 1 })],
    ["issuedAt", (command: ReturnType<typeof createGameCommand>) => ({ ...command, issuedAt: "2026-07-07T00:00:00.001Z" })],
    ["correlationId", (command: ReturnType<typeof createGameCommand>) => ({ ...command, correlationId: correlationId("other-correlation") })],
    ["payload field", (command: ReturnType<typeof createGameCommand>) => ({ ...command, payload: { ...command.payload, rootSeed: "other-seed" } })],
    ["extra envelope field", (command: ReturnType<typeof createGameCommand>) => ({ ...command, extra: true }) as unknown as typeof command],
    ["extra payload field", (command: ReturnType<typeof createGameCommand>) => ({
      ...command,
      payload: { ...command.payload, extra: true } as unknown as typeof command.payload
    })]
  ] as const)("returns an exact idempotency conflict when the same commandId changes %s", async (_name, mutate) => {
    const { service, commandStore } = makeService();
    const original = createGameCommand();
    const first = await service.execute(original);
    const originalReceipt = await commandStore.findCommandReceipt(original.gameId, original.commandId);
    const conflict = await service.execute(mutate(original) as SupportedCommandEnvelope);

    expectAcceptedResult(first);
    expect(conflict).toStrictEqual({
      status: "rejected",
      gameId: original.gameId,
      code: "CommandIdempotencyConflict",
      message: "commandId is already associated with a different command",
      currentGameVersion: 1,
      idempotent: false
    });
    expect(JSON.stringify(conflict)).not.toContain("canonicalCommandJson");
    expect(JSON.stringify(conflict)).not.toContain("digestHex");
    expect(await commandStore.loadDomainEvents(original.gameId)).toHaveLength(1);
    expect(await commandStore.findCommandReceipt(original.gameId, original.commandId)).toStrictEqual(originalReceipt);
    expect(commandStore.acceptedCount).toBe(1);
    expect(commandStore.rejectedCount).toBe(0);
  });

  it("fails closed for legacy, malformed, and digest-only-matching stored command fingerprints", async () => {
    const commandStore = new ReceiptOverrideCommandStore();
    const { service } = makeService(commandStore);
    const command = createGameCommand();
    const first = await service.execute(command);
    expectAcceptedResult(first);
    const originalReceipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);
    if (originalReceipt === undefined || originalReceipt.commandFingerprint === undefined) {
      throw new Error("Expected a fingerprinted receipt");
    }
    const incomingCapture = captureSupportedCommand(command);
    const differentCapture = captureSupportedCommand({ ...command, issuedAt: "different" });
    if (!incomingCapture.valid || !differentCapture.valid) throw new Error("Expected command captures");

    const malformedFingerprints = [
      {
        ...differentCapture.captured.fingerprint,
        digestHex: incomingCapture.captured.fingerprint.digestHex
      },
      { ...originalReceipt.commandFingerprint, digestHex: "0".repeat(64) },
      {
        ...originalReceipt.commandFingerprint,
        canonicalCommandJsonUtf8ByteLength: originalReceipt.commandFingerprint.canonicalCommandJsonUtf8ByteLength + 1
      },
      { ...originalReceipt.commandFingerprint, schemaVersion: "future-schema" },
      { ...originalReceipt.commandFingerprint, canonicalizationAlgorithm: "future-algorithm" },
      { ...originalReceipt.commandFingerprint, extra: true }
    ];

    const storedReceipts: CommandReceipt[] = [
      {
        commandId: originalReceipt.commandId,
        gameId: originalReceipt.gameId,
        result: originalReceipt.result
      },
      ...malformedFingerprints.map((commandFingerprint) => ({
        ...originalReceipt,
        commandFingerprint
      }) as unknown as CommandReceipt)
    ];

    for (const receipt of storedReceipts) {
      commandStore.receiptOverride = receipt;
      const conflict = await service.execute(command);
      expect(conflict).toStrictEqual({
        status: "rejected",
        gameId: command.gameId,
        code: "CommandIdempotencyConflict",
        message: "commandId is already associated with a different command",
        currentGameVersion: 1,
        idempotent: false
      });
    }

    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
    expect(commandStore.acceptedCount).toBe(1);
    expect(commandStore.rejectedCount).toBe(0);
  });

  it("resolves an exact nonpersisted idempotency conflict for a revoked stored fingerprint proxy", async () => {
    const commandStore = new ReceiptOverrideCommandStore();
    const { service } = makeService(commandStore);
    const command = createGameCommand();
    const first = await service.execute(command);
    expectAcceptedResult(first);
    const originalReceipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);
    if (originalReceipt?.commandFingerprint === undefined) throw new Error("Expected a fingerprinted receipt");
    const revocable = Proxy.revocable(originalReceipt.commandFingerprint, {});
    revocable.revoke();
    commandStore.receiptOverride = {
      ...originalReceipt,
      commandFingerprint: revocable.proxy
    };

    const expectedConflict = {
      status: "rejected",
      gameId: command.gameId,
      code: "CommandIdempotencyConflict",
      message: "commandId is already associated with a different command",
      currentGameVersion: 1,
      idempotent: false
    } as const;
    await expect(service.execute(command)).resolves.toStrictEqual(expectedConflict);

    commandStore.receiptOverride = undefined;
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toStrictEqual(originalReceipt);
    expect(commandStore.getReceiptCount()).toBe(1);
    expect(commandStore.acceptedCount).toBe(1);
    expect(commandStore.rejectedCount).toBe(0);
    expect(JSON.stringify(expectedConflict)).not.toContain("canonicalCommandJson");
    expect(JSON.stringify(expectedConflict)).not.toContain("digestHex");
    expect(JSON.stringify(expectedConflict)).not.toContain("details");
  });

  it("rejects a stored fingerprint Proxy that swaps command A to incoming command B on the equality read", async () => {
    const commandStore = new ReceiptOverrideCommandStore();
    const { service } = makeService(commandStore);
    const commandA = createGameCommand();
    const commandB = {
      ...commandA,
      issuedAt: "2026-07-07T00:00:00.001Z"
    } satisfies typeof commandA;
    const first = await service.execute(commandA);
    expectAcceptedResult(first);
    const originalReceipt = await commandStore.findCommandReceipt(commandA.gameId, commandA.commandId);
    if (originalReceipt?.commandFingerprint === undefined) throw new Error("Expected a fingerprinted receipt");
    const storedFingerprint = originalReceipt.commandFingerprint;
    const incomingCapture = captureSupportedCommand(commandB);
    if (!incomingCapture.valid) throw new Error("Expected incoming command capture");
    let canonicalReadsSinceValidationStarted = 0;
    const swapOnFinalReadProxy = new Proxy({ ...storedFingerprint }, {
      get: (target, property, receiver) => {
        if (property === "schemaVersion") canonicalReadsSinceValidationStarted = 0;
        if (property === "canonicalCommandJson") {
          canonicalReadsSinceValidationStarted += 1;
          return canonicalReadsSinceValidationStarted <= 4
            ? storedFingerprint.canonicalCommandJson
            : incomingCapture.captured.fingerprint.canonicalCommandJson;
        }
        return Reflect.get(target, property, receiver) as unknown;
      }
    });
    commandStore.receiptOverride = {
      ...originalReceipt,
      commandFingerprint: swapOnFinalReadProxy
    };

    const expectedConflict = {
      status: "rejected",
      gameId: commandA.gameId,
      code: "CommandIdempotencyConflict",
      message: "commandId is already associated with a different command",
      currentGameVersion: 1,
      idempotent: false
    } as const;
    const execution = service.execute(commandB);
    await expect(execution).resolves.toStrictEqual(expectedConflict);
    expect(await execution).not.toStrictEqual({ ...first, idempotent: true });

    commandStore.receiptOverride = undefined;
    expect(canonicalReadsSinceValidationStarted).toBe(0);
    expect(await commandStore.loadDomainEvents(commandA.gameId)).toHaveLength(1);
    expect(await commandStore.findCommandReceipt(commandA.gameId, commandA.commandId)).toStrictEqual(originalReceipt);
    expect(commandStore.getReceiptCount()).toBe(1);
    expect(commandStore.acceptedCount).toBe(1);
    expect(commandStore.rejectedCount).toBe(0);
    expect(JSON.stringify(expectedConflict)).not.toContain("canonicalCommandJson");
    expect(JSON.stringify(expectedConflict)).not.toContain("digestHex");
    expect(JSON.stringify(expectedConflict)).not.toContain("details");
  });

  it("defers Seamstress atomically without selecting players, producing information, or spending the ability", async () => {
    const { service, commandStore } = makeService();
    const { seamstressTask, opportunity, state: beforeSubmit } = await reachOpenSeamstressActionOpportunity(service, commandStore);
    const command = submitSeamstressActionCommand({
      commandId: commandId("submit-seamstress-defer"),
      expectedGameVersion: 17,
      actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
      payload: {
        commandType: "SubmitSeamstressAction",
        taskId: seamstressTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: { kind: "DEFER" }
      }
    });

    const result = await service.execute(command);
    const allEvents = await commandStore.loadDomainEvents(ids.game);
    const committed = allEvents.filter((event) => event.commandId === command.commandId);
    const state = rebuildOptionalGameState(allEvents);

    expectEventSummaryAcceptedResult(result);
    expect(result.gameVersion).toBe(18);
    expect(result.eventTypes).toStrictEqual([
      "SeamstressActionDeferred",
      "ScheduledTaskSettled"
    ]);
    expect(committed.map((event) => event.eventSequence)).toStrictEqual([33, 34]);
    if (!isSeamstressActionOpportunityV2(opportunity)) throw new Error("Expected V2 Seamstress opportunity");
    expect(committed[0]).toMatchObject({
      payload: {
        rulesBaselineVersion: RULES_BASELINE_VERSION,
        deferSchemaVersion: "seamstress-action-deferred-v2",
        nightNumber: 1,
        taskId: seamstressTask.taskId,
        taskType: "SEAMSTRESS_ACTION",
        opportunityId: opportunity.opportunityId,
        decisionKind: "DEFER",
        sourcePlayerId: opportunity.sourcePlayerId,
        sourceSeatNumber: opportunity.sourceSeatNumber,
        sourceRole: opportunity.sourceRole,
        sourceRoleTenureId: opportunity.sourceRoleTenureId,
        abilityInstanceId: opportunity.abilityInstanceId,
        abilityUseEntitlementId: opportunity.abilityUseEntitlementId,
        opportunityCharacterStateRevision: opportunity.sourceCharacterStateRevision,
        settlementCharacterStateRevision: opportunity.sourceCharacterStateRevision
      }
    });
    expect(committed[1]).toMatchObject({
      payload: {
        taskId: seamstressTask.taskId,
        taskType: "SEAMSTRESS_ACTION",
        outcomeType: "SEAMSTRESS_DEFERRED",
        characterStateRevision: opportunity.sourceCharacterStateRevision
      }
    });
    expect(committed[0]?.batchId).toBe(committed[1]?.batchId);
    expect(state?.firstNightActionOpportunities?.opportunities.find((candidate) =>
      candidate.opportunityId === opportunity.opportunityId
    )?.opportunityStatus).toBe("CLOSED");
    expect(state?.firstNightTaskProgress?.settlements.at(-1)).toMatchObject({
      taskId: seamstressTask.taskId,
      taskType: "SEAMSTRESS_ACTION",
      outcomeType: "SEAMSTRESS_DEFERRED",
      characterStateRevision: opportunity.sourceCharacterStateRevision
    });
    expect(state?.firstNightTaskPlan && state.firstNightTaskProgress
      ? state.firstNightTaskPlan.tasks[state.firstNightTaskProgress.settlements.length]?.taskType
      : undefined
    ).toBe("MATHEMATICIAN_INFORMATION");
    expect(state?.currentCharacterState).toStrictEqual(beforeSubmit.currentCharacterState);
    expect(state?.assignment).toStrictEqual(beforeSubmit.assignment);
    expect(state?.setup).toStrictEqual(beforeSubmit.setup);
    expect(state?.firstNightTaskPlan).toStrictEqual(beforeSubmit.firstNightTaskPlan);
    expect(state?.abilityImpairments).toStrictEqual(beforeSubmit.abilityImpairments);
    expect(state?.initialPrivateKnowledge).toStrictEqual(beforeSubmit.initialPrivateKnowledge);
    expect(state?.dreamerInformation).toStrictEqual(beforeSubmit.dreamerInformation);
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain("events");
    expect(serialized).not.toContain("selectedPlayer");
    expect(serialized).not.toContain("sameAlignment");
    expect(serialized).not.toContain("answer");
    expect(serialized).not.toContain("abilitySpent");
    expect(serialized).not.toContain("informationReliability");

    const duplicate = await service.execute(command);
    expect(duplicate).toStrictEqual({ ...result, idempotent: true });
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(34);
  });

  it("accepts Seamstress DEFER from source Human, source AI, Storyteller, and System actors", async () => {
    for (const [actorName, actorFactory] of [
      ["human", (sourcePlayerId: ReturnType<typeof playerId>) => ({ kind: "human", playerId: sourcePlayerId } as const)],
      ["ai", (sourcePlayerId: ReturnType<typeof playerId>) => ({ kind: "ai", playerId: sourcePlayerId } as const)],
      ["storyteller", () => storytellerActor],
      ["system", () => systemActor]
    ] as const) {
      const commandStore = new MemoryCommandCommitStore();
      const { service } = makeService(commandStore);
      const { seamstressTask, opportunity } = await reachOpenSeamstressActionOpportunity(service, commandStore);

      await expect(service.execute(submitSeamstressActionCommand({
        commandId: commandId(`${actorName}-seamstress-defer`),
        expectedGameVersion: 17,
        actor: actorFactory(opportunity.sourcePlayerId),
        payload: {
          commandType: "SubmitSeamstressAction",
          taskId: seamstressTask.taskId,
          opportunityId: opportunity.opportunityId,
          decision: { kind: "DEFER" }
        }
      }))).resolves.toMatchObject({
        status: "accepted",
        gameVersion: 18,
        eventDisclosure: "EVENT_TYPES_ONLY",
        eventCount: 2,
        eventTypes: ["SeamstressActionDeferred", "ScheduledTaskSettled"]
      });
    }
  });

  it("rejects malformed, future, mismatched, and non-source Seamstress submissions without domain events", async () => {
    const { service, commandStore } = makeService();
    const { seamstressTask, opportunity, state } = await reachOpenSeamstressActionOpportunity(service, commandStore);
    const nonSource = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    const dreamerTask = state.firstNightTaskPlan?.tasks.find((task) => task.taskType === "DREAMER_ACTION");
    if (nonSource === undefined || dreamerTask === undefined) {
      throw new Error("Expected non-source player and Dreamer task");
    }
    const beforeEvents = await commandStore.loadDomainEvents(ids.game);

    const cases = [
      {
        name: "non-source",
        command: submitSeamstressActionCommand({
          commandId: commandId("non-source-seamstress-defer"),
          expectedGameVersion: 17,
          actor: { kind: "ai", playerId: nonSource.playerId },
          payload: {
            commandType: "SubmitSeamstressAction",
            taskId: seamstressTask.taskId,
            opportunityId: opportunity.opportunityId,
            decision: { kind: "DEFER" }
          }
        }),
        code: "ActorPlayerMismatch"
      },
      {
        name: "malformed decision",
        command: submitSeamstressActionCommand({
          commandId: commandId("malformed-seamstress-decision"),
          expectedGameVersion: 17,
          payload: {
            commandType: "SubmitSeamstressAction",
            taskId: seamstressTask.taskId,
            opportunityId: opportunity.opportunityId,
            decision: {} as never
          }
        }),
        code: "InvalidSeamstressActionDecision"
      },
      {
        name: "extra decision field",
        command: submitSeamstressActionCommand({
          commandId: commandId("extra-field-seamstress-decision"),
          expectedGameVersion: 17,
          payload: {
            commandType: "SubmitSeamstressAction",
            taskId: seamstressTask.taskId,
            opportunityId: opportunity.opportunityId,
            decision: { kind: "DEFER", sameAlignment: true } as never
          }
        }),
        code: "InvalidSeamstressActionDecision"
      },
      {
        name: "malformed target choice",
        command: submitSeamstressActionCommand({
          commandId: commandId("unsupported-seamstress-choice"),
          expectedGameVersion: 17,
          payload: {
            commandType: "SubmitSeamstressAction",
            taskId: seamstressTask.taskId,
            opportunityId: opportunity.opportunityId,
            decision: {
              kind: "CHOOSE_TWO_PLAYERS",
              playerIds: [opportunity.sourcePlayerId, nonSource.playerId]
            } as never
          }
        }),
        code: "InvalidSeamstressTarget"
      },
      {
        name: "hidden payload field",
        command: submitSeamstressActionCommand({
          commandId: commandId("hidden-payload-seamstress-decision"),
          expectedGameVersion: 17,
          payload: {
            commandType: "SubmitSeamstressAction",
            taskId: seamstressTask.taskId,
            opportunityId: opportunity.opportunityId,
            decision: { kind: "DEFER" },
            selectedPlayerIds: [opportunity.sourcePlayerId, nonSource.playerId]
          } as never
        }),
        code: "InvalidSeamstressActionDecision"
      },
      {
        name: "wrong task",
        command: submitSeamstressActionCommand({
          commandId: commandId("wrong-task-seamstress-defer"),
          expectedGameVersion: 17,
          payload: {
            commandType: "SubmitSeamstressAction",
            taskId: dreamerTask.taskId,
            opportunityId: opportunity.opportunityId,
            decision: { kind: "DEFER" }
          }
        }),
        code: "ScheduledTaskNotNext"
      },
      {
        name: "wrong opportunity",
        command: submitSeamstressActionCommand({
          commandId: commandId("wrong-opportunity-seamstress-defer"),
          expectedGameVersion: 17,
          payload: {
            commandType: "SubmitSeamstressAction",
            taskId: seamstressTask.taskId,
            opportunityId: actionOpportunityId("first-night-v1:SEAMSTRESS_ACTION:seat-99:opportunity-01"),
            decision: { kind: "DEFER" }
          }
        }),
        code: "ActionOpportunityNotFound"
      }
    ] as const;

    for (const testCase of cases) {
      await expect(service.execute(testCase.command), testCase.name).resolves.toMatchObject({
        status: "rejected",
        code: testCase.code,
        currentGameVersion: 17
      });
      expect((await commandStore.findCommandReceipt(ids.game, testCase.command.commandId))?.result, testCase.name)
        .toMatchObject({ status: "rejected", code: testCase.code });
    }

    expect(await commandStore.loadDomainEvents(ids.game)).toStrictEqual(beforeEvents);
  });

  it("keeps SubmitSeamstressAction metadata and construction failures retryable without receipts or events", async () => {
    const metadataStore = new MemoryCommandCommitStore();
    const idGenerator = new FaultInjectingIdGenerator();
    const { service: metadataService } = makeService(metadataStore, testSetupGenerator, idGenerator);
    const metadataReady = await reachOpenSeamstressActionOpportunity(metadataService, metadataStore);
    const metadataCommand = submitSeamstressActionCommand({
      commandId: commandId("seamstress-metadata-failure"),
      expectedGameVersion: 17,
      payload: {
        commandType: "SubmitSeamstressAction",
        taskId: metadataReady.seamstressTask.taskId,
        opportunityId: metadataReady.opportunity.opportunityId,
        decision: { kind: "DEFER" }
      }
    });
    const metadataEvents = await metadataStore.loadDomainEvents(ids.game);

    idGenerator.failNextBatchId = true;
    const metadataFailure = await metadataService.execute(metadataCommand);

    expectFailedResult(metadataFailure);
    expect(metadataFailure).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 17,
      retryable: true
    });
    expect(await metadataStore.findCommandReceipt(ids.game, metadataCommand.commandId)).toBeUndefined();
    expect(await metadataStore.loadDomainEvents(ids.game)).toStrictEqual(metadataEvents);

    const constructionStore = new MemoryCommandCommitStore();
    const { service: constructionService } = makeService(constructionStore);
    const constructionReady = await reachOpenSeamstressActionOpportunity(constructionService, constructionStore);
    let opportunityIdReads = 0;
    const constructionCommand = submitSeamstressActionCommand({
      commandId: commandId("mutating-submit-seamstress-action"),
      expectedGameVersion: 17,
      payload: {
        commandType: "SubmitSeamstressAction",
        taskId: constructionReady.seamstressTask.taskId,
        get opportunityId() {
          opportunityIdReads += 1;
          return opportunityIdReads === 1
            ? constructionReady.opportunity.opportunityId
            : actionOpportunityId("first-night-v1:SEAMSTRESS_ACTION:seat-99:opportunity-01");
        },
        decision: { kind: "DEFER" }
      } as never
    });
    const constructionEvents = await constructionStore.loadDomainEvents(ids.game);

    const constructionFailure = await constructionService.execute(constructionCommand);

    expectFailedResult(constructionFailure);
    expect(constructionFailure).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "command-validation",
      retryable: true
    });
    expect(constructionFailure.message).toContain("enumerable data properties");
    expect("currentGameVersion" in constructionFailure).toBe(false);
    expect(await constructionStore.findCommandReceipt(ids.game, constructionCommand.commandId)).toBeUndefined();
    expect(await constructionStore.loadDomainEvents(ids.game)).toStrictEqual(constructionEvents);
  });

  it("keeps SubmitWitchAction metadata generation failures classified independently", async () => {
    const commandStore = new MemoryCommandCommitStore();
    const idGenerator = new FaultInjectingIdGenerator();
    const { service } = makeService(commandStore, testSetupGenerator, idGenerator);
    const { witchTask, opportunity, state } = await reachOpenWitchActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) {
      throw new Error("Expected Witch target");
    }
    const command = submitWitchActionCommand({
      commandId: commandId("witch-metadata-failure"),
      expectedGameVersion: 13,
      payload: {
        commandType: "SubmitWitchAction",
        taskId: witchTask.taskId,
        opportunityId: opportunity.opportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      }
    });

    idGenerator.failNextBatchId = true;
    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "MetadataGenerationFailed",
      failureStage: "event-metadata",
      currentGameVersion: 13,
      retryable: true
    });
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(24);
  });

  it("rejects Witch opportunity command accessors before receipt or event work", async () => {
    const { service, commandStore } = makeService();
    const { witchTask } = await reachWitchActionTask(service, commandStore);
    let taskIdReads = 0;
    const command = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("mutating-open-witch-action"),
      expectedGameVersion: 12,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        get taskId() {
          taskIdReads += 1;
          return taskIdReads === 1 ? witchTask.taskId : scheduledTaskId("first-night-v1:MINION_INFO:system");
        }
      } as never
    });

    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "command-validation",
      retryable: true
    });
    expect(failedResult.message).toContain("enumerable data properties");
    expect("currentGameVersion" in failedResult).toBe(false);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(23);
  });

  it("rejects SubmitWitchAction accessors before receipt or event work", async () => {
    const { service, commandStore } = makeService();
    const { witchTask, opportunity, state } = await reachOpenWitchActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) {
      throw new Error("Expected Witch target");
    }

    let opportunityIdReads = 0;
    const command = submitWitchActionCommand({
      commandId: commandId("mutating-submit-witch-action"),
      expectedGameVersion: 13,
      payload: {
        commandType: "SubmitWitchAction",
        taskId: witchTask.taskId,
        get opportunityId() {
          opportunityIdReads += 1;
          return opportunityIdReads === 1
            ? opportunity.opportunityId
            : actionOpportunityId("first-night-v1:WITCH_ACTION:seat-99:opportunity-01");
        },
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: target.playerId
        }
      } as never
    });

    const failedResult = await service.execute(command);

    expectFailedResult(failedResult);
    expect(failedResult).toMatchObject({
      code: "DependencyExecutionFailed",
      failureStage: "command-validation",
      retryable: true
    });
    expect(failedResult.message).toContain("enumerable data properties");
    expect("currentGameVersion" in failedResult).toBe(false);
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(24);
  });

  it("rejects AI and Storyteller actors for CreateGame and SelectScript", async () => {
    const { service, commandStore } = makeService();

    await expect(service.execute(createGameCommand({ actor: aiActor }))).resolves.toMatchObject({
      status: "rejected",
      code: "ActorNotAllowed"
    });
    await expect(
      service.execute(createGameCommand({ commandId: commandId("storyteller-create"), actor: storytellerActor }))
    ).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });

    await service.execute(createGameCommand({ commandId: commandId("system-create") }));

    await expect(
      service.execute(selectScriptCommand({ commandId: commandId("ai-select"), actor: aiActor }))
    ).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(
      service.execute(selectScriptCommand({ commandId: commandId("storyteller-select"), actor: storytellerActor }))
    ).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });

    expect(commandStore.acceptedCount).toBe(1);
    expect(commandStore.rejectedCount).toBe(4);
  });

  it("allows Human and System actors for supported commands", async () => {
    const { service, commandStore } = makeService();

    const createResult = await service.execute(createGameCommand({ actor: humanActor }));
    const selectResult = await service.execute(selectScriptCommand({ actor: systemActor }));

    expect(createResult.status).toBe("accepted");
    expect(selectResult.status).toBe("accepted");
    expect(commandStore.acceptedCount).toBe(2);
  });

});

describeApplicationServiceShard("information-and-later-actions", "GameApplicationService", () => {
  it("inserts gained Clockmaker at its catalog position after Cerenovus and before Dreamer", async () => {
    const store = new MemoryCommandCommitStore();
    const { service } = makeService(store);
    await reachOpenPhilosopherActionOpportunity(service);

    const result = await service.execute(choosePhilosopherRoleCommand("clockmaker", {
      commandId: commandId("choose-clockmaker-order")
    }));
    const state = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
    const tasks = state?.firstNightTaskPlan?.tasks ?? [];
    const gainedIndex = tasks.findIndex((task) => task.taskId === "first-night-v2:PHILOSOPHER_GAINED:CLOCKMAKER_INFORMATION:seat-10:from-clockmaker");
    const cerenovusIndex = tasks.findIndex((task) => task.taskType === "CERENOVUS_ACTION");
    const dreamerIndex = tasks.findIndex((task) => task.taskType === "DREAMER_ACTION");

    expectAcceptedResult(result);
    expect(gainedIndex).toBeGreaterThan(cerenovusIndex);
    expect(gainedIndex).toBeLessThan(dreamerIndex);
    expect(tasks[gainedIndex]?.orderKey).toStrictEqual({ baseOrder: 800, insertionOrder: 10 });
    expect(tasks[1]?.taskType).toBe("MINION_INFO");
    expect(tasks[2]?.taskType).toBe("DEMON_INFO");
  });

  describe("Clockmaker first-night information application", () => {
    it.each([
      ["System", systemActor],
      ["Storyteller", storytellerActor]
    ])("allows %s to settle the next base Clockmaker task with summary-only idempotency", async (_name, actor) => {
      const { service, commandStore } = makeService();
      const { state, task } = await reachClockmakerInformationTask(service, commandStore);
      const command = settleClockmakerCommand(state, task.taskId, { actor, commandId: commandId(`clockmaker-${actor.kind}`) });
      const before = (await commandStore.loadDomainEvents(ids.game)).length;
      const result = await service.execute(command);
      expectEventSummaryAcceptedResult(result);
      expect(result).toMatchObject({ eventCount: 2, eventTypes: ["ClockmakerInformationDelivered", "ScheduledTaskSettled"], idempotent: false });
      await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", idempotent: true, eventCount: 2 });
      expect((await commandStore.loadDomainEvents(ids.game)).length).toBe(before + 2);
      const rebuilt = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
      expect(rebuilt?.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
        abilityRoleId: "clockmaker", outcomeStatus: "NORMAL", causeKind: "NO_OTHER_CHARACTER_ABILITY"
      });
      await expect(service.execute({ ...command, payload: { ...command.payload, taskId: scheduledTaskId("first-night-v1:CLOCKMAKER_INFORMATION:seat-12") } }))
        .resolves.toMatchObject({ status: "rejected", code: "CommandIdempotencyConflict" });
    });

    it("rejects Human AI hidden malformed missing wrong early stale duplicate and outside-phase commands", async () => {
      const outside = makeService();
      await outside.service.execute(createGameCommand());
      await expect(outside.service.execute({ ...settleClockmakerCommand({ gameVersion: 1 } as GameState, scheduledTaskId("first-night-v1:CLOCKMAKER_INFORMATION:seat-01"), {
        commandId: commandId("clockmaker-outside"), expectedGameVersion: 1
      }) })).resolves.toMatchObject({ status: "rejected", code: "CommandNotAllowedInPhase" });
      const { service, commandStore } = makeService();
      await reachNoPhilosopherFirstNightTaskPlan(service, clockmakerExactRoleIds);
      const earlyState = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
      const task = earlyState?.firstNightTaskPlan?.tasks.find((entry) => entry.taskType === "CLOCKMAKER_INFORMATION");
      if (earlyState === undefined || task === undefined) throw new Error("Expected early Clockmaker task");
      await expect(service.execute(settleClockmakerCommand(earlyState, task.taskId))).resolves.toMatchObject({ status: "rejected", code: "ScheduledTaskNotNext" });
      const readyPair = makeService();
      const ready = await reachClockmakerInformationTask(readyPair.service, readyPair.commandStore);
      for (const [id, actor] of [["human", humanActor], ["ai", aiActor]] as const) {
        await expect(readyPair.service.execute(settleClockmakerCommand(ready.state, ready.task.taskId, { commandId: commandId(`clockmaker-${id}`), actor })))
          .resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
      }
      await expect(readyPair.service.execute({ ...settleClockmakerCommand(ready.state, ready.task.taskId, { commandId: commandId("clockmaker-hidden") }), payload: {
        commandType: "SettleClockmakerInformation", taskId: ready.task.taskId, answer: 3
      } } as unknown as SupportedCommandEnvelope)).resolves.toMatchObject({ status: "rejected", code: "InvalidClockmakerInformationCommand" });
      await expect(readyPair.service.execute(settleClockmakerCommand(ready.state, scheduledTaskId("first-night-v1:CLOCKMAKER_INFORMATION:seat-12"), { commandId: commandId("clockmaker-missing") })))
        .resolves.toMatchObject({ status: "rejected", code: "ScheduledTaskNotFound" });
      await expect(readyPair.service.execute(settleClockmakerCommand(ready.state, ready.task.taskId, { commandId: commandId("clockmaker-stale"), expectedGameVersion: ready.state.gameVersion - 1 })))
        .resolves.toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch" });
      const acceptedCommand = settleClockmakerCommand(ready.state, ready.task.taskId, { commandId: commandId("clockmaker-once") });
      await expect(readyPair.service.execute(acceptedCommand)).resolves.toMatchObject({ status: "accepted" });
      const after = rebuildOptionalGameState(await readyPair.commandStore.loadDomainEvents(ids.game));
      if (after === undefined) throw new Error("Expected settled Clockmaker state");
      await expect(readyPair.service.execute(settleClockmakerCommand(after, ready.task.taskId, { commandId: commandId("clockmaker-duplicate") })))
        .resolves.toMatchObject({ status: "rejected", code: "ScheduledTaskAlreadySettled" });
    });

    it("settles effective Vortox Clockmaker with false-only information", async () => {
      const { service, commandStore } = makeService();
      const { state, task } = await reachClockmakerInformationTask(service, commandStore, clockmakerVortoxExactRoleIds);
      const command = settleClockmakerCommand(state, task.taskId, { commandId: commandId("clockmaker-vortox") });
      const result = await service.execute(command);
      expectEventSummaryAcceptedResult(result);
      await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", idempotent: true, eventCount: 2 });
      const rebuilt = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
      const delivery = rebuilt?.clockmakerInformation?.deliveries[0];
      expect(delivery?.vortoxConstraint.kind).toBe("VORTOX_FALSE_REQUIRED");
      expect(delivery?.selectedDistance).not.toBe(delivery?.ruleCorrectDistance);
      expect(delivery?.legalCandidateDistances).not.toContain(delivery?.ruleCorrectDistance);
      expect(rebuilt?.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
        abilityRoleId: "clockmaker", outcomeStatus: "ABNORMAL", causeKind: "VORTOX_FALSE_INFORMATION"
      });
    });

    it.each([
      ["native", philosopherClockmakerExactRoleIds, false],
      ["Vortox", philosopherClockmakerVortoxExactRoleIds, true]
    ])("settles Philosopher-gained effective and original drunk Clockmaker with %s", async (_name, roles, withVortox) => {
      const { service, commandStore } = makeService();
      const gained = await reachGainedClockmakerTask(service, commandStore, roles);
      const gainedCommand = settleClockmakerCommand(gained.state, gained.task.taskId, { commandId: commandId(`gained-clockmaker-${_name}`) });
      const gainedResult = await service.execute(gainedCommand);
      expectEventSummaryAcceptedResult(gainedResult);
      expect(gainedResult.eventCount).toBe(2);
      await expect(service.execute(gainedCommand)).resolves.toMatchObject({ status: "accepted", idempotent: true });
      const rebuilt = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
      const deliveries = rebuilt?.clockmakerInformation?.deliveries ?? [];
      expect(deliveries).toHaveLength(2);
      expect(deliveries[0]?.sourceContract.kind).toBe("BASE_CLOCKMAKER");
      expect(deliveries[0]?.sourceEffectiveness.kind).toBe("KNOWN_DRUNK");
      expect(deliveries[1]?.sourceContract.kind).toBe("PHILOSOPHER_GAINED_CLOCKMAKER");
      expect(deliveries[1]?.sourceEffectiveness.kind).toBe("EFFECTIVE");
      const clockmakerFacts = rebuilt?.firstNightAbilityOutcomeLedger?.facts.filter((fact) => fact.abilityRoleId === "clockmaker") ?? [];
      expect(clockmakerFacts).toEqual(expect.arrayContaining([
        expect.objectContaining({ outcomeStatus: "ABNORMAL", causeKind: withVortox ? "VORTOX_FALSE_INFORMATION" : "SOURCE_DRUNKENNESS" }),
        expect.objectContaining({ outcomeStatus: withVortox ? "ABNORMAL" : "NORMAL", causeKind: withVortox ? "VORTOX_FALSE_INFORMATION" : "NO_OTHER_CHARACTER_ABILITY" })
      ]));
      expect(deliveries.every((entry) => entry.vortoxConstraint.kind === (withVortox ? "VORTOX_FALSE_REQUIRED" : "NONE"))).toBe(true);
      for (const entry of deliveries) {
        if (withVortox) expect(entry.selectedDistance).not.toBe(entry.ruleCorrectDistance);
      }
      const allEvents = await commandStore.loadDomainEvents(ids.game);
      const deliveryEvents = allEvents.filter((event): event is Extract<AnyDomainEventEnvelope,{eventType:"ClockmakerInformationDelivered"}> => event.eventType === "ClockmakerInformationDelivered");
      const deriveAt = (deliveryEvent: Extract<AnyDomainEventEnvelope,{eventType:"ClockmakerInformationDelivered"}>, change?: (draft: Record<string,unknown>)=>void) => {
        const index = allEvents.findIndex((event) => event.eventId === deliveryEvent.eventId);
        const beforeDelivery = rebuildOptionalGameState(allEvents.slice(0,index));
        if (beforeDelivery === undefined) throw new Error("Expected Clockmaker terminal pre-state");
        const draft = structuredClone(beforeDelivery) as unknown as Record<string,unknown>;
        change?.(draft);
        return deriveFirstNightAbilityOutcomeFact({stateBefore:draft as unknown as GameState,event:deliveryEvent});
      };
      const drunkEvent = deliveryEvents.find((event) => event.payload.sourceEffectiveness.kind === "KNOWN_DRUNK");
      if (drunkEvent === undefined) throw new Error("Expected original drunk Clockmaker event");
      expect(deriveAt(drunkEvent)).toMatchObject({outcomeStatus:"ABNORMAL",causeKind:withVortox?"VORTOX_FALSE_INFORMATION":"SOURCE_DRUNKENNESS"});
      expect(() => deriveAt(drunkEvent,(draft)=>{draft.abilityImpairments=undefined;}), "[R4-47] wrong answer without impairment").toThrowError(DomainError);
      if(!withVortox){const wrongKind = deriveAt(drunkEvent,(draft)=>{const impairments=(draft.abilityImpairments as {impairments:Record<string,unknown>[]}).impairments;impairments[0]!.kind="POISONED";});
      expect(validateFirstNightAbilityOutcomeFactShape(wrongKind), "[R4-48] impairment kind mismatch").toMatchObject({valid:false});}
      if(withVortox){
        const vortoxEvent=deliveryEvents.at(-1)!;
        expect(deriveAt(vortoxEvent)).toMatchObject({outcomeStatus:"ABNORMAL",causeKind:"VORTOX_FALSE_INFORMATION"});
        expect(()=>deriveAt(vortoxEvent,(draft)=>{draft.seamstressRoleTenureState={records:[]};}),"[R4-50] Vortox tenure mismatch").toThrowError(DomainError);
      }
    });

    it("settles base Clockmaker from the post-Snake-Charmer-swap current native Demon seat", async () => {
      const { service, commandStore } = makeService();
      await reachNoPhilosopherFirstNightTaskPlan(service, clockmakerExactRoleIds);
      const ready = await advanceToNextClockmaker(service, commandStore, true, "snake-swap-clockmaker");
      const command = settleClockmakerCommand(ready.state, ready.task.taskId, { commandId: commandId("clockmaker-after-swap") });
      await expect(service.execute(command))
        .resolves.toMatchObject({ status: "accepted", eventCount: 2 });
      await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", idempotent: true });
      const rebuilt = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
      const delivery = rebuilt?.clockmakerInformation?.deliveries[0];
      const demon = ready.state.currentCharacterState?.entries.find((entry) => entry.role.characterType === "DEMON");
      expect(delivery?.nativeDemonReferences[0].playerId).toBe(demon?.playerId);
      expect(delivery?.nativeDemonReferences[0].seatNumber).toBe(demon?.seatNumber);
    });

    it("maps metadata prospective and commit faults without appending or receipts", async () => {
      const base = makeService();
      const { state, task } = await reachClockmakerInformationTask(base.service, base.commandStore);
      const beforeEvents = (await base.commandStore.loadDomainEvents(ids.game)).length;
      const beforeReceipts = base.commandStore.getReceiptCount();
      const throwingIds = { nextBatchId: () => { throw new Error("metadata"); }, nextEventId: () => eventId("unused") };
      const metadataService = makeService(base.commandStore, testSetupGenerator, throwingIds).service;
      await expect(metadataService.execute(settleClockmakerCommand(state, task.taskId, { commandId: commandId("clockmaker-metadata") })))
        .resolves.toMatchObject({ status: "failed", code: "MetadataGenerationFailed", failureStage: "event-metadata" });
      for (const failurePosition of [1, 2]) {
        let calls = 0;
        const idsAtPosition: IdGenerator = { nextBatchId: () => batchId(`clockmaker-id-position-${failurePosition}`), nextEventId: () => {
          calls += 1;
          if (calls === failurePosition) throw new Error("event metadata");
          return eventId(`clockmaker-id-position-${failurePosition}-${calls}`);
        } };
        const service = makeService(base.commandStore, testSetupGenerator, idsAtPosition).service;
        await expect(service.execute(settleClockmakerCommand(state, task.taskId, { commandId: commandId(`clockmaker-event-id-fault-${failurePosition}`) })))
          .resolves.toMatchObject({ status: "failed", code: "MetadataGenerationFailed", failureStage: "event-metadata" });
      }
      for (const failurePosition of [1, 2]) {
        let calls = 0;
        const clock = { now: () => {
          calls += 1;
          if (calls === failurePosition) throw new Error("clock metadata");
          return "2026-07-11T09:00:00.000Z";
        } };
        const service = makeService(base.commandStore, testSetupGenerator, new FixedIdGenerator(), clock).service;
        await expect(service.execute(settleClockmakerCommand(state, task.taskId, { commandId: commandId(`clockmaker-clock-fault-${failurePosition}`) })))
          .resolves.toMatchObject({ status: "failed", code: "MetadataGenerationFailed", failureStage: "event-metadata" });
      }
      const duplicateIds = { nextBatchId: () => batchId("clockmaker-duplicate-batch"), nextEventId: () => eventId("clockmaker-duplicate-event") };
      const prospectiveService = makeService(base.commandStore, testSetupGenerator, duplicateIds).service;
      await expect(prospectiveService.execute(settleClockmakerCommand(state, task.taskId, { commandId: commandId("clockmaker-prospective") })))
        .resolves.toMatchObject({ status: "failed", code: "DependencyExecutionFailed", failureStage: "first-night-role-information" });
      base.commandStore.failBeforeCommit = true;
      await expect(base.service.execute(settleClockmakerCommand(state, task.taskId, { commandId: commandId("clockmaker-commit") })))
        .resolves.toMatchObject({ status: "failed", code: "EventStoreAppendFailed", failureStage: "accepted-commit" });
      expect((await base.commandStore.loadDomainEvents(ids.game)).length).toBe(beforeEvents);
      expect(base.commandStore.getReceiptCount()).toBe(beforeReceipts);
    });

    it("accepts key-reordered Clockmaker payloads at the application prospective boundary", async () => {
      const { service, commandStore } = makeService();
      const { state, task } = await reachClockmakerInformationTask(service, commandStore);
      const command = settleClockmakerCommand(state, task.taskId, { commandId: commandId("clockmaker-reordered-prospective") });
      const boundary = service as unknown as { createBatch: (...args: readonly unknown[]) => DomainEventBatch };
      const original = boundary.createBatch.bind(service);
      boundary.createBatch = (...args: readonly unknown[]): DomainEventBatch => {
        const created = original(...args);
        return { ...created, events: created.events.map((event) => event.eventType === "ClockmakerInformationDelivered"
          ? { ...event, payload: Object.fromEntries(Object.entries(event.payload).reverse()) as typeof event.payload }
          : event) };
      };
      await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", eventCount: 2 });
      boundary.createBatch = original;
    });
  });
});

describeApplicationServiceShard(
  "information-and-later-actions",
  "Slice 2B16 Cerenovus first-night integration",
  () => {
  const submitCerenovus = (
    state: NonNullable<ReturnType<typeof rebuildOptionalGameState>>,
    taskIdValue: ReturnType<typeof scheduledTaskId>,
    opportunityIdValue: ReturnType<typeof actionOpportunityId>,
    sourcePlayerId: ReturnType<typeof playerId>,
    targetPlayerId: ReturnType<typeof playerId>,
    chosenRoleId: ReturnType<typeof roleId>,
    overrides: Partial<SupportedCommandEnvelope> = {}
  ): SupportedCommandEnvelope => ({
    commandId: commandId("submit-cerenovus"), gameId: ids.game, expectedGameVersion: state.gameVersion,
    actor: { kind: "ai", playerId: sourcePlayerId }, issuedAt: "2026-07-10T00:00:00.000Z",
    correlationId: correlationId("correlation-submit-cerenovus"),
    payload: { commandType: "SubmitCerenovusAction", taskId: taskIdValue, opportunityId: opportunityIdValue,
      decision: { kind: "CHOOSE_PLAYER_AND_CHARACTER", targetPlayerId, chosenRoleId } },
    ...overrides
  } as SupportedCommandEnvelope);

  it("opens the Cerenovus opportunity only when its task is next", async () => {
    const { service, commandStore } = makeService();
    const { state, task } = await reachNextCerenovusActionTask(service, commandStore);
    const result = await service.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-next-only-cerenovus"), expectedGameVersion: state.gameVersion,
      actor: systemActor, payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: task.taskId }
    }));
    expectAcceptedResult(result);
    expect(result.events.map((event) => event.eventType)).toStrictEqual(["FirstNightActionOpportunityCreated"]);
  });

  it("rejects Human and AI Cerenovus opening attempts without event or opportunity creation", async () => {
    for (const actor of [humanActor, aiActor] as const) {
      const { service, commandStore } = makeService();
      const { state, task } = await reachNextCerenovusActionTask(service, commandStore);
      const before = await commandStore.loadDomainEvents(ids.game);
      await expect(service.execute(openFirstNightRoleActionOpportunityCommand({
        commandId: commandId(`reject-open-direct-${actor.kind}`), expectedGameVersion: state.gameVersion,
        actor, payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: task.taskId }
      }))).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
      expect(await commandStore.loadDomainEvents(ids.game)).toStrictEqual(before);
    }
  });

  it.each([
    ["accepts SubmitCerenovusAction from the source Human", "human"],
    ["accepts SubmitCerenovusAction from the source AI", "ai"]
  ] as const)("%s", async (_label, actorKind) => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus target");
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId, target.playerId, roleId("dreamer"), {
      commandId: commandId(`submit-cerenovus-source-${actorKind}`), actor: { kind: actorKind, playerId: opportunity.sourcePlayerId }
    });
    await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", eventCount: 4 });
  });

  it("rejects SubmitCerenovusAction from non-source Human and AI actors", async () => {
    for (const actorKind of ["human", "ai"] as const) {
      const { service, commandStore } = makeService();
      const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
      const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
      if (target === undefined) throw new Error("Expected non-source Cerenovus actor");
      const before = await commandStore.loadDomainEvents(ids.game);
      const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId, target.playerId, roleId("dreamer"), {
        commandId: commandId(`reject-cerenovus-non-source-${actorKind}`), actor: { kind: actorKind, playerId: target.playerId }
      });
      await expect(service.execute(command)).resolves.toMatchObject({ status: "rejected", code: "ActorPlayerMismatch" });
      expect(await commandStore.loadDomainEvents(ids.game)).toStrictEqual(before);
    }
  });

  it("rejects Storyteller and System SubmitCerenovusAction submissions", async () => {
    for (const actor of [storytellerActor, systemActor] as const) {
      const { service, commandStore } = makeService();
      const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
      const target = state.roster?.entries[0];
      if (target === undefined) throw new Error("Expected Cerenovus target");
      const before = await commandStore.loadDomainEvents(ids.game);
      const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId, target.playerId, roleId("dreamer"), {
        commandId: commandId(`reject-cerenovus-${actor.kind}`), actor
      });
      await expect(service.execute(command)).resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
      expect(await commandStore.loadDomainEvents(ids.game)).toStrictEqual(before);
    }
  });

  it("rejects an unknown Cerenovus target without append", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const before = await commandStore.loadDomainEvents(ids.game);
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId,
      playerId("unknown-cerenovus-target"), roleId("dreamer"), { commandId: commandId("reject-unknown-cerenovus-target") });
    await expect(service.execute(command)).resolves.toMatchObject({ status: "rejected", code: "InvalidCerenovusTarget" });
    expect(await commandStore.loadDomainEvents(ids.game)).toStrictEqual(before);
  });

  it("rejects actor-supplied Cerenovus source impairment effectiveness marker instruction execution Vortox and alignment outcomes", async () => {
    const forbidden = ["sourceImpairment", "effective", "marker", "instruction", "execution", "vortox", "alignment"] as const;
    for (const key of forbidden) {
      const { service, commandStore } = makeService();
      const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
      const target = state.roster?.entries[0];
      if (target === undefined) throw new Error("Expected Cerenovus target");
      const before = await commandStore.loadDomainEvents(ids.game);
      const base = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId, target.playerId, roleId("dreamer"));
      await expect(service.execute({ ...base, commandId: commandId(`forbidden-cerenovus-${key}`), payload: { ...base.payload, [key]: true } } as unknown as SupportedCommandEnvelope))
        .resolves.toMatchObject({ status: "rejected", code: "InvalidCerenovusActionDecision" });
      expect(await commandStore.loadDomainEvents(ids.game)).toStrictEqual(before);
    }
  });

  it("returns the exact no-write application boundary for constructed-noncanonical Cerenovus source impairment", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus target");
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId, target.playerId, roleId("dreamer"));
    const impaired: GameState = { ...state, abilityImpairments: { impairments: [{
      impairmentId: abilityImpairmentId("constructed-direct-cerenovus-poison"), kind: "POISONED",
      sourceKind: "SNAKE_CHARMER_DEMON_HIT", sourcePlayerId: playerId("constructed-source"),
      affectedPlayerId: opportunity.sourcePlayerId, affectedSeatNumber: opportunity.sourceSeatNumber,
      affectedRole: opportunity.sourceRole, sourceCharacterStateRevision: state.currentCharacterState?.revision ?? 1
    }] } };
    const boundary = service as unknown as { createBatchOrReject(commandValue: SupportedCommandEnvelope, stateValue: GameState, currentGameVersion: number): CommandResult };
    const before = await commandStore.loadDomainEvents(ids.game);
    expect(boundary.createBatchOrReject(command, impaired, state.gameVersion)).toMatchObject({
      status: "failed", code: "ApplicationNotConfigured", retryable: true
    });
    expect(await commandStore.findCommandReceipt(ids.game, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toStrictEqual(before);
  });

  it("keeps corrupted Cerenovus prospective failure atomic and retryable with the same command ID", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus target");
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId,
      target.playerId, roleId("dreamer"), { commandId: commandId("prospective-retry-cerenovus") });
    const boundary = service as unknown as { createBatch: (...args: readonly unknown[]) => DomainEventBatch };
    const original = boundary.createBatch.bind(service);
    boundary.createBatch = (...args: readonly unknown[]): DomainEventBatch => {
      const created = original(...args);
      return { ...created, events: created.events.map((event, index) => index === 0 && event.eventType === "CerenovusChoiceRecorded"
        ? { ...event, payload: { ...event.payload, sourcePlayerId: playerId("forged-prospective-source") } }
        : event) };
    };
    const before = await commandStore.loadDomainEvents(ids.game);
    await expect(service.execute(command)).resolves.toMatchObject({ status: "failed", retryable: true });
    expect(await commandStore.findCommandReceipt(ids.game, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toStrictEqual(before);
    expect(rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game))?.gameVersion).toBe(state.gameVersion);
    expect(rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game))?.firstNightActionOpportunities?.opportunities
      .find((entry) => entry.opportunityId === opportunity.opportunityId)?.opportunityStatus).toBe("OPEN");
    boundary.createBatch = original;
    await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", eventCount: 4 });
  });

  it("keeps every Cerenovus batch event and clock metadata position retryable without burning the command ID", async () => {
    const faults = [
      { name: "batch-id", code: "MetadataGenerationFailed", stage: "event-metadata", configure: (idsValue: FaultInjectingIdGenerator, clockValue: FaultInjectingClock, store: MemoryCommandCommitStore): void => { void clockValue; void store; idsValue.failNextBatchId = true; } },
      ...([1, 2, 3, 4] as const).map((position) => ({ name: `event-id-${position}`, code: "MetadataGenerationFailed", stage: "event-metadata",
        configure: (idsValue: FaultInjectingIdGenerator, clockValue: FaultInjectingClock, store: MemoryCommandCommitStore): void => { void clockValue; void store; idsValue.failEventAfter(position); } })),
      ...([1, 2, 3, 4] as const).map((position) => ({ name: `clock-${position}`, code: "MetadataGenerationFailed", stage: "event-metadata",
        configure: (idsValue: FaultInjectingIdGenerator, clockValue: FaultInjectingClock, store: MemoryCommandCommitStore): void => { void idsValue; void store; clockValue.failClockAfter(position); } })),
      { name: "before-commit", code: "EventStoreAppendFailed", stage: "accepted-commit", configure: (idsValue: FaultInjectingIdGenerator, clockValue: FaultInjectingClock, store: MemoryCommandCommitStore): void => { void idsValue; void clockValue; store.failBeforeCommit = true; } },
      { name: "during-commit", code: "EventStoreAppendFailed", stage: "accepted-commit", configure: (idsValue: FaultInjectingIdGenerator, clockValue: FaultInjectingClock, store: MemoryCommandCommitStore): void => { void idsValue; void clockValue; store.failDuringCommit = true; } }
    ] as const;
    for (const fault of faults) {
      const store = new MemoryCommandCommitStore();
      const idsGenerator = new FaultInjectingIdGenerator();
      const clock = new FaultInjectingClock();
      const { service } = makeService(store, testSetupGenerator, idsGenerator, clock);
      const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, store);
      const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
      if (target === undefined) throw new Error("Expected Cerenovus target");
      const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId,
        target.playerId, roleId("dreamer"), { commandId: commandId(`retry-${fault.name}-cerenovus`) });
      const before = await store.loadDomainEvents(ids.game);
      fault.configure(idsGenerator, clock, store);
      await expect(service.execute(command), fault.name).resolves.toMatchObject({ status: "failed", code: fault.code,
        failureStage: fault.stage, retryable: true, currentGameVersion: state.gameVersion });
      expect(await store.findCommandReceipt(ids.game, command.commandId)).toBeUndefined();
      expect(await store.loadDomainEvents(ids.game)).toStrictEqual(before);
      const failedState = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
      expect(failedState?.gameVersion, fault.name).toBe(state.gameVersion);
      expect(failedState?.firstNightActionOpportunities?.opportunities.find((entry) => entry.opportunityId === opportunity.opportunityId)?.opportunityStatus, fault.name).toBe("OPEN");
      await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", eventCount: 4 });
    }
  });

  it("keeps thrown Cerenovus event construction retryable without burning the command ID", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus target");
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId,
      target.playerId, roleId("dreamer"), { commandId: commandId("retry-construction-cerenovus") });
    const boundary = service as unknown as { createBatch: (...args: readonly unknown[]) => DomainEventBatch };
    const original = boundary.createBatch.bind(service);
    boundary.createBatch = (): DomainEventBatch => { throw new Error("injected Cerenovus event construction failure"); };
    const before = await commandStore.loadDomainEvents(ids.game);
    await expect(service.execute(command)).resolves.toMatchObject({ status: "failed", code: "DependencyExecutionFailed",
      failureStage: "command-validation", retryable: true, currentGameVersion: state.gameVersion });
    expect(await commandStore.findCommandReceipt(ids.game, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toStrictEqual(before);
    expect(rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game))?.firstNightActionOpportunities?.opportunities
      .find((entry) => entry.opportunityId === opportunity.opportunityId)?.opportunityStatus).toBe("OPEN");
    boundary.createBatch = original;
    await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", eventCount: 4 });
  });

  it("accepts and projects a complete self-targeted Cerenovus action", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId,
      opportunity.sourcePlayerId, roleId("dreamer"), { commandId: commandId("self-target-cerenovus") });
    await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", eventCount: 4 });
    const accepted = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    if (accepted === undefined) throw new Error("Expected self-targeted Cerenovus state");
    expect(buildPlayerPrivateKnowledgeView(accepted, opportunity.sourcePlayerId).cerenovusMadnessInstruction).toBeDefined();
  });

  it("[R4-T08] emits a CerenovusMadnessInstructionDelivered ledger SOURCE_EVENT fact", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus target");
    const before = await commandStore.loadDomainEvents(ids.game);
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId,
      target.playerId, roleId("dreamer"), { commandId: commandId("exact-four-cerenovus") });
    await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", eventCount: 4 });
    const appended = (await commandStore.loadDomainEvents(ids.game)).slice(before.length);
    expect(appended.map((event) => event.eventType)).toStrictEqual([
      "CerenovusChoiceRecorded", "CerenovusMadnessMarked", "CerenovusMadnessInstructionDelivered", "ScheduledTaskSettled"
    ]);
    const rebuilt = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    expect(rebuilt?.firstNightAbilityOutcomeLedger?.facts.at(-1)).toMatchObject({
      abilityRoleId: "cerenovus", outcomeStatus: "NORMAL", causeKind: "NO_OTHER_CHARACTER_ABILITY"
    });
    expect(rebuilt?.firstNightAbilityOutcomeLedger?.facts.at(-1)?.evidenceReferences.find((entry) => entry.kind === "SOURCE_EVENT"))
      .toMatchObject({ kind: "SOURCE_EVENT", eventType: "CerenovusMadnessInstructionDelivered" });
    const beforeTerminal = domainCore.applyDomainEvent(domainCore.applyDomainEvent(state, appended[0]!), appended[1]!);
    const terminal = appended[2]!;
    if (terminal.eventType !== "CerenovusMadnessInstructionDelivered") throw new Error("Expected direct Cerenovus ledger terminal");
    const mutate = (change: (draft: Record<string, unknown>, event: Record<string, unknown>) => void) => {
      const draft = structuredClone(beforeTerminal) as unknown as Record<string, unknown>;
      const event = structuredClone(terminal) as unknown as Record<string, unknown>;
      change(draft, event);
      return () => deriveFirstNightAbilityOutcomeFact({ stateBefore: draft as unknown as GameState, event: event as unknown as AnyDomainEventEnvelope });
    };
    const record = (value: unknown): Record<string, unknown> => value as Record<string, unknown>;
    const first = (draft: Record<string, unknown>, setName: string, field: string): Record<string, unknown> =>
      (record(record(draft[setName])[field]) as unknown as Record<string, unknown>[])[0]!;
    expect(mutate((draft) => { first(draft,"cerenovusChoices","choices").choiceId="other-choice"; }), "[R4-68] choiceId mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { first(draft,"cerenovusMadnessMarkers","markers").markerId="other-marker"; }), "[R4-69] markerId mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { first(draft,"cerenovusChoices","choices").chosenGoodRoleId="mutant"; }), "[R4-70] chosen role mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { first(draft,"cerenovusChoices","choices").targetPlayerId="player-12"; }), "[R4-71] target player mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { first(draft,"cerenovusChoices","choices").targetSeatNumber=12; }), "[R4-72] target seat mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { const opportunityRecord=(record(record(draft.firstNightActionOpportunities).opportunities) as unknown as Record<string, unknown>[]).find((entry)=>entry.opportunityId===opportunity.opportunityId)!;opportunityRecord.sourceCharacterStateRevision=2; }), "[R4-73] source revision mismatch").toThrowError(DomainError);
    expect(mutate((draft) => { const opportunityRecord=(record(record(draft.firstNightActionOpportunities).opportunities) as unknown as Record<string, unknown>[]).find((entry)=>entry.opportunityId===opportunity.opportunityId)!;opportunityRecord.sourceRoleTenureId="role-tenure-v1:seat-01:role-dreamer:acquired-revision-1"; }), "[R4-74] tenure mismatch").toThrowError(DomainError);
    const canonicalCerenovusFact = deriveFirstNightAbilityOutcomeFact({ stateBefore: beforeTerminal, event: terminal });
    if (canonicalCerenovusFact === undefined) throw new Error("Expected canonical Cerenovus fact");
    const wrongTerminalId = { ...canonicalCerenovusFact, evidenceReferences: canonicalCerenovusFact.evidenceReferences.map((entry) =>
      entry.kind === "CERENOVUS_INSTRUCTION" ? { ...entry, terminalEventId: eventId("other-terminal-event") } : entry) };
    expect(validateFirstNightAbilityOutcomeFactShape(wrongTerminalId), "[R4-75] terminal event ID mismatch").toMatchObject({ valid: false });
  });

  it("commits one Cerenovus batch with shared metadata and consecutive sequences", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus target");
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId,
      target.playerId, roleId("dreamer"), { commandId: commandId("metadata-cerenovus") });
    await service.execute(command);
    const events = (await commandStore.loadDomainEvents(ids.game)).slice(-4);
    expect(new Set(events.map((event) => event.batchId)).size).toBe(1);
    expect(new Set(events.map((event) => event.commandId)).size).toBe(1);
    expect(new Set(events.map((event) => event.gameVersion)).size).toBe(1);
    expect(events.map((event) => event.eventSequence)).toStrictEqual(events.map((_, index) => events[0]!.eventSequence + index));
  });

  it("exposes the next supported task after Cerenovus without a phase transition", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus target");
    await service.execute(submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId,
      target.playerId, roleId("dreamer"), { commandId: commandId("next-after-cerenovus") }));
    const accepted = rebuildOptionalGameState(await commandStore.loadDomainEvents(ids.game));
    expect(accepted?.phase).toBe("FIRST_NIGHT");
    expect(accepted?.firstNightTaskPlan?.tasks[accepted.firstNightTaskProgress?.settlements.length ?? -1]?.taskType).not.toBe("CERENOVUS_ACTION");
  });

  it("returns the stored Cerenovus event summary idempotently without append", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus target");
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId,
      target.playerId, roleId("dreamer"), { commandId: commandId("idempotent-cerenovus-direct") });
    await service.execute(command);
    const count = (await commandStore.loadDomainEvents(ids.game)).length;
    await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", idempotent: true, eventCount: 4 });
    expect((await commandStore.loadDomainEvents(ids.game)).length).toBe(count);
  });

  it("rejects a changed Cerenovus fingerprint on the same command ID", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus target");
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId,
      target.playerId, roleId("dreamer"), { commandId: commandId("fingerprint-cerenovus-direct") });
    await service.execute(command);
    await expect(service.execute({ ...command, payload: { ...command.payload, decision: {
      kind: "CHOOSE_PLAYER_AND_CHARACTER", targetPlayerId: target.playerId, chosenRoleId: roleId("mutant")
    } } } as SupportedCommandEnvelope)).resolves.toMatchObject({ status: "rejected", code: "CommandIdempotencyConflict" });
  });

  it.each([
    ["allows System to open the Cerenovus opportunity when its task is next", systemActor],
    ["allows Storyteller to open the Cerenovus opportunity when its task is next", storytellerActor]
  ] as const)("%s", async (label, actor) => {
    expect(label.length).toBeGreaterThan(0);
    const { service, commandStore } = makeService();
    const { state, task } = await reachNextCerenovusActionTask(service, commandStore);
    const beforeEvents = await commandStore.loadDomainEvents(ids.game);
    const result = await service.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId(`open-cerenovus-${actor.kind}`),
      expectedGameVersion: state.gameVersion,
      actor,
      payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: task.taskId }
    }));
    expectAcceptedResult(result);
    expect(result.events.map((event) => event.eventType)).toStrictEqual(["FirstNightActionOpportunityCreated"]);
    const afterEvents = await commandStore.loadDomainEvents(ids.game);
    expect(afterEvents).toHaveLength(beforeEvents.length + 1);
    const opened = rebuildOptionalGameState(afterEvents)?.firstNightActionOpportunities?.opportunities.filter((entry) =>
      entry.taskId === task.taskId && entry.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION"
    );
    expect(opened).toHaveLength(1);
    expect(opened?.[0]?.opportunityStatus).toBe("OPEN");
  });

  it.each([
    ["Human", humanActor],
    ["AI", aiActor]
  ] as const)("rejects %s attempts to open the Cerenovus opportunity without event or opportunity creation", async (label, actor) => {
    expect(label.length).toBeGreaterThan(0);
    const { service, commandStore } = makeService();
    const { state, task } = await reachNextCerenovusActionTask(service, commandStore);
    const beforeEvents = await commandStore.loadDomainEvents(ids.game);
    const result = await service.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId(`reject-open-cerenovus-${actor.kind}`),
      expectedGameVersion: state.gameVersion,
      actor,
      payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: task.taskId }
    }));
    expect(result).toMatchObject({ status: "rejected", code: "ActorNotAllowed", currentGameVersion: state.gameVersion });
    const afterEvents = await commandStore.loadDomainEvents(ids.game);
    expect(afterEvents).toStrictEqual(beforeEvents);
    expect(rebuildOptionalGameState(afterEvents)?.firstNightActionOpportunities?.opportunities.some((entry) =>
      entry.taskId === task.taskId && entry.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION"
    )).toBe(false);
  });

  it.each(["DRUNK", "POISONED"] as const)("returns the exact no-write application boundary for constructed-noncanonical %s source impairment", async (kind) => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus boundary target");
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId, target.playerId, roleId("dreamer"), {
      commandId: commandId(`constructed-noncanonical-${kind.toLowerCase()}-cerenovus-boundary`)
    });
    const constructedNoncanonicalImpairment: AbilityImpairmentSet["impairments"][number] = kind === "DRUNK"
      ? {
          impairmentId: abilityImpairmentId("constructed-noncanonical-cerenovus-drunk"), kind,
          sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE", sourcePlayerId: playerId("constructed-noncanonical-source"),
          affectedPlayerId: opportunity.sourcePlayerId, affectedSeatNumber: opportunity.sourceSeatNumber,
          affectedRole: opportunity.sourceRole, chosenRoleId: roleId("cerenovus"),
          sourceCharacterStateRevision: state.currentCharacterState?.revision ?? 1
        }
      : {
          impairmentId: abilityImpairmentId("constructed-noncanonical-cerenovus-poisoned"), kind,
          sourceKind: "SNAKE_CHARMER_DEMON_HIT", sourcePlayerId: playerId("constructed-noncanonical-source"),
          affectedPlayerId: opportunity.sourcePlayerId, affectedSeatNumber: opportunity.sourceSeatNumber,
          affectedRole: opportunity.sourceRole, sourceCharacterStateRevision: state.currentCharacterState?.revision ?? 1
        };
    const constructedState: GameState = {
      ...state,
      abilityImpairments: { impairments: [constructedNoncanonicalImpairment] }
    };
    let batchConstructionCalls = 0;
    const boundary = service as unknown as {
      createBatchOrReject(commandValue: SupportedCommandEnvelope, stateValue: GameState, currentGameVersion: number): CommandResult;
      createBatch(...args: readonly unknown[]): never;
    };
    boundary.createBatch = (): never => {
      batchConstructionCalls += 1;
      throw new Error("effective-only gate invoked batch construction");
    };
    const beforeEvents = await commandStore.loadDomainEvents(ids.game);
    const result = boundary.createBatchOrReject(command, constructedState, state.gameVersion);

    expectFailedResult(result);
    expect(result).toStrictEqual({
      status: "failed",
      gameId: ids.game,
      code: "ApplicationNotConfigured",
      message: "Cerenovus effective-only settlement is not configured for the current canonical state",
      failureStage: "first-night-role-action",
      retryable: true,
      currentGameVersion: state.gameVersion
    });
    expect(batchConstructionCalls).toBe(0);
    expect(opportunity.opportunityStatus).toBe("OPEN");
    expect(constructedState.firstNightActionOpportunities?.opportunities.find((entry) => entry.opportunityId === opportunity.opportunityId)?.opportunityStatus).toBe("OPEN");
    expect(result).not.toHaveProperty("events");
    expect(result).not.toHaveProperty("eventTypes");
    expect(result).not.toHaveProperty("receiptPolicy");
    expect(await commandStore.findCommandReceipt(ids.game, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toStrictEqual(beforeEvents);
  });

  it("appends the effective-only four-event chain, projects a target-only instruction, and preserves idempotency", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
    if (target === undefined) throw new Error("Expected Cerenovus target");
    const command = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId, target.playerId, roleId("dreamer"));
    const result = await service.execute(command);
    expectEventSummaryAcceptedResult(result);
    expect(result).toMatchObject({
      eventDisclosure: "EVENT_TYPES_ONLY", eventCount: 4, idempotent: false,
      eventTypes: ["CerenovusChoiceRecorded", "CerenovusMadnessMarked", "CerenovusMadnessInstructionDelivered", "ScheduledTaskSettled"]
    });
    const events = await commandStore.loadDomainEvents(ids.game);
    const chain = events.slice(-4);
    expect(chain.map((event) => event.eventType)).toStrictEqual([
      "CerenovusChoiceRecorded", "CerenovusMadnessMarked", "CerenovusMadnessInstructionDelivered", "ScheduledTaskSettled"
    ]);
    expect(chain[1]?.payload).toMatchObject({
      markerStatus: "ESTABLISHED",
      instructionWindow: "TOMORROW_DAY_AND_NIGHT",
      removalRule: "NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY",
      targetPlayerId: target.playerId,
      madAboutRoleId: roleId("dreamer"),
      sourceAbilityDependency: { permanentLossPolicy: "REMOVE_MARKER", reacquisitionPolicy: "NEW_INSTANCE_DOES_NOT_RESUME" }
    });
    expect(chain[2]?.payload).toMatchObject({
      recipientPlayerId: target.playerId,
      selectedByCharacter: "cerenovus",
      madAboutRoleId: roleId("dreamer"),
      instructionWindow: "TOMORROW_DAY_AND_NIGHT",
      deliveryStatus: "DELIVERED"
    });
    expect(chain[2]?.payload).not.toHaveProperty("sourcePlayerId");
    expect(chain[2]?.payload).not.toHaveProperty("sourceSeatNumber");
    expect(chain[3]?.payload).toMatchObject({ outcomeType: "CERENOVUS_MADNESS_MARKED" });
    const acceptedState = rebuildOptionalGameState(events);
    if (acceptedState === undefined) throw new Error("Expected accepted Cerenovus state");
    const playerView = buildPlayerPrivateKnowledgeView(acceptedState, target.playerId);
    const aiView = buildAiPrivateKnowledgeView(acceptedState, target.playerId);
    expect(playerView.cerenovusMadnessInstruction).toStrictEqual({
      selectedByCharacter: "cerenovus",
      madAboutRoleId: roleId("dreamer"),
      instructionWindow: "TOMORROW_DAY_AND_NIGHT"
    });
    expect(aiView).toStrictEqual(playerView);
    expect(playerView.deliveredKnowledgeStages).toContain("CERENOVUS_INFORMATION");
    expect(JSON.stringify(playerView)).not.toMatch(/impair|effective|requirement|marker|execution|sourceAbility|resolutionId/i);
    const nonTarget = acceptedState.roster?.entries.find((entry) => entry.playerId !== target.playerId);
    if (nonTarget === undefined) throw new Error("Expected non-target viewer");
    expect(buildPlayerPrivateKnowledgeView(acceptedState, nonTarget.playerId)).not.toHaveProperty("cerenovusMadnessInstruction");
    expect(() => buildPlayerPrivateKnowledgeView({
      ...acceptedState, cerenovusMadnessInstructions: { deliveries: [] }
    }, target.playerId)).toThrowError(/complete|one marker, instruction, and settlement|one-to-one/i);
    const instruction = acceptedState.cerenovusMadnessInstructions?.deliveries[0];
    if (instruction === undefined) throw new Error("Expected stored Cerenovus instruction");
    expect(() => buildPlayerPrivateKnowledgeView({
      ...acceptedState, cerenovusMadnessInstructions: { deliveries: [instruction, instruction] }
    }, target.playerId)).toThrowError(/unique|one-to-one/i);
    expect(() => buildPlayerPrivateKnowledgeView({
      ...acceptedState,
      cerenovusMadnessInstructions: { deliveries: [{ ...instruction, madAboutRoleId: roleId("mutant") }] }
    }, target.playerId)).toThrowError(/instruction|match/i);
    await expect(service.execute(command)).resolves.toMatchObject({ status: "accepted", idempotent: true, eventCount: 4 });
    expect((await commandStore.loadDomainEvents(ids.game)).length).toBe(events.length);
    await expect(service.execute({ ...command, payload: { ...command.payload, decision: {
      kind: "CHOOSE_PLAYER_AND_CHARACTER", targetPlayerId: target.playerId, chosenRoleId: roleId("mutant")
    } } } as SupportedCommandEnvelope)).resolves.toMatchObject({ status: "rejected", code: "CommandIdempotencyConflict" });
  });

  it("rejects privileged actors, hidden fields, and unsupported selected character types without appending", async () => {
    const { service, commandStore } = makeService();
    const { state, task, opportunity } = await reachOpenCerenovusActionOpportunity(service, commandStore);
    const target = state.roster?.entries[0];
    if (target === undefined) throw new Error("Expected Cerenovus target");
    const base = submitCerenovus(state, task.taskId, opportunity.opportunityId, opportunity.sourcePlayerId, target.playerId, roleId("dreamer"));
    const before = (await commandStore.loadDomainEvents(ids.game)).length;
    await expect(service.execute({ ...base, commandId: commandId("system-cerenovus"), actor: systemActor }))
      .resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(service.execute({ ...base, commandId: commandId("storyteller-cerenovus"), actor: storytellerActor }))
      .resolves.toMatchObject({ status: "rejected", code: "ActorNotAllowed" });
    await expect(service.execute({ ...base, commandId: commandId("minion-cerenovus"), payload: {
      ...base.payload, decision: { kind: "CHOOSE_PLAYER_AND_CHARACTER", targetPlayerId: target.playerId, chosenRoleId: roleId("witch") }
    } } as SupportedCommandEnvelope)).resolves.toMatchObject({ status: "rejected", code: "InvalidCerenovusCharacter" });
    await expect(service.execute({ ...base, commandId: commandId("hidden-cerenovus"), payload: {
      ...base.payload, effective: true
    } } as unknown as SupportedCommandEnvelope)).resolves.toMatchObject({ status: "rejected", code: "InvalidCerenovusActionDecision" });
    expect((await commandStore.loadDomainEvents(ids.game)).length).toBe(before);
  });
  }
);
