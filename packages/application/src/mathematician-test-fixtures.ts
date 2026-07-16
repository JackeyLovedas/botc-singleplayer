import {
  GameApplicationService
} from "./game-application-service.js";
import type { IdGenerator } from "./game-application-service.js";
import type { CommandResult } from "./command-result.js";
import type { CommandCommitStore } from "./ports/command-commit-store.js";
import {
  commandId,
  correlationId,
  formatFirstNightActionOpportunityId,
  rebuildGameState,
  roleId,
  seatNumber,
  validateDomainEventStream
} from "@botc/domain-core";
import type { GameState, ScheduledTask, SettleMathematicianInformationCommand } from "@botc/domain-core";
import {
  FixedClock,
  FixedIdGenerator,
  MemoryCommandCommitStore,
  assignCharactersCommand,
  createGameCommand,
  createPlayerRosterCommand,
  generateSetupCommand,
  ids,
  initializeFirstNightCommand,
  openFirstNightRoleActionOpportunityCommand,
  planFirstNightTasksCommand,
  selectScriptCommand,
  settleEvilTwinSetupCommand,
  settleFirstNightSystemTaskCommand,
  submitDreamerActionCommand,
  submitPhilosopherActionCommand,
  submitSeamstressActionCommand,
  submitSnakeCharmerActionCommand,
  submitWitchActionCommand,
  systemActor,
  testAssignmentGenerator,
  testFirstNightSystemInformationResolver,
  testFirstNightTaskCatalog,
  testFirstNightTaskPlanner,
  testInitialPrivateKnowledgeBuilder,
  testSetupGenerator
} from "@botc/test-harness";

const requireAccepted = (result: CommandResult): void => {
  if (result.status !== "accepted") throw new Error(`Expected accepted fixture command: ${JSON.stringify(result)}`);
};

export const mathematicianBaseExactRoleIds = [
  "dreamer", "snake_charmer", "mathematician", "flowergirl", "town_crier", "seamstress",
  "mutant", "sweetheart", "barber", "evil_twin", "witch", "fang_gu"
].map(roleId);

export const philosopherGainedMathematicianExactRoleIds = mathematicianBaseExactRoleIds.map((id) =>
  id === roleId("mathematician") ? roleId("philosopher") : id
);
export const philosopherAndBaseMathematicianExactRoleIds = mathematicianBaseExactRoleIds.map((id) =>
  id === roleId("flowergirl") ? roleId("philosopher") : id
);
export const mathematicianVortoxExactRoleIds = mathematicianBaseExactRoleIds.map((id) =>
  id === roleId("fang_gu") ? roleId("vortox") :
    id === roleId("barber") ? roleId("artist") :
      id === roleId("dreamer") ? roleId("savant") : id
);
export const mathematicianVortoxUnresolvedExactRoleIds = mathematicianBaseExactRoleIds.map((id) =>
  id === roleId("fang_gu") ? roleId("vortox") : id === roleId("barber") ? roleId("clockmaker") : id
);
export const philosopherAndBaseMathematicianVortoxExactRoleIds = mathematicianVortoxExactRoleIds.map((id) =>
  id === roleId("flowergirl") ? roleId("philosopher") : id
);

export const createMathematicianService = () => {
  const commandStore = new MemoryCommandCommitStore();
  return { ...createMathematicianServiceForStore(commandStore), commandStore };
};

export const createMathematicianServiceForStore = (
  commandStore: CommandCommitStore,
  idGenerator: IdGenerator = new FixedIdGenerator()
) => {
  const service = new GameApplicationService({
    commandStore,
    ids: idGenerator,
    clock: new FixedClock(),
    setupGenerator: testSetupGenerator,
    characterAssignmentGenerator: testAssignmentGenerator,
    initialPrivateKnowledgeBuilder: testInitialPrivateKnowledgeBuilder,
    firstNightTaskPlanner: testFirstNightTaskPlanner,
    firstNightTaskCatalogSnapshot: testFirstNightTaskCatalog,
    firstNightSystemInformationResolver: testFirstNightSystemInformationResolver
  });
  return { service, commandStore };
};

const current = async (store: MemoryCommandCommitStore): Promise<GameState> =>
  rebuildGameState(await store.loadDomainEvents(ids.game));

const advanceOne = async (
  service: GameApplicationService,
  store: MemoryCommandCommitStore,
  task: ScheduledTask,
  step: number
): Promise<void> => {
  const state = await current(store);
  if (task.taskType === "MINION_INFO" || task.taskType === "DEMON_INFO") {
    requireAccepted(await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId(`math-fixture-system-${step}`), expectedGameVersion: state.gameVersion,
      payload: { commandType: "SettleFirstNightSystemTask", taskId: task.taskId }
    })));
    return;
  }
  if (task.taskType === "EVIL_TWIN_SETUP") {
    requireAccepted(await service.execute(settleEvilTwinSetupCommand({
      commandId: commandId(`math-fixture-twin-${step}`), expectedGameVersion: state.gameVersion,
      payload: { commandType: "SettleEvilTwinSetup", taskId: task.taskId }
    })));
    return;
  }
  if (task.taskType === "CLOCKMAKER_INFORMATION") {
    requireAccepted(await service.execute({
      commandId: commandId(`math-fixture-clockmaker-${step}`), gameId: ids.game,
      expectedGameVersion: state.gameVersion, actor: systemActor,
      issuedAt: "2026-07-13T00:00:00.000Z", correlationId: correlationId(`math-fixture-clockmaker-${step}`),
      payload: { commandType: "SettleClockmakerInformation", taskId: task.taskId }
    }));
    return;
  }
  if (task.taskType !== "SNAKE_CHARMER_ACTION" && task.taskType !== "WITCH_ACTION" &&
      task.taskType !== "DREAMER_ACTION" && task.taskType !== "SEAMSTRESS_ACTION") {
    throw new Error(`Unsupported Mathematician fixture predecessor ${task.taskType}`);
  }
  requireAccepted(await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId(`math-fixture-open-${step}`), expectedGameVersion: state.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: task.taskId }
  })));
  let opened = await current(store);
  if (task.taskType === "DREAMER_ACTION") {
    const events = await store.loadDomainEvents(ids.game);
    const created = events.find((event) =>
      event.eventType === "FirstNightActionOpportunityCreated" && event.payload.taskId === task.taskId
    );
    if (created === undefined || created.eventType !== "FirstNightActionOpportunityCreated") {
      throw new Error("Expected Mathematician fixture Dreamer opportunity event");
    }
    const payload = created.payload as unknown as Record<string, unknown>;
    payload.opportunityId = formatFirstNightActionOpportunityId({
      taskType: "DREAMER_ACTION",
      seatNumber: seatNumber(payload.sourceSeatNumber as number),
      opportunityIndex: 1
    });
    payload.opportunityKind = "DREAMER_FIRST_NIGHT_ACTION";
    payload.visibility = {
      canChooseTarget: true,
      supportedDecisionKinds: ["CHOOSE_PLAYER"],
      targetSchema: "OTHER_NON_TRAVELLER_PLAYER"
    };
    delete payload.opportunitySchemaVersion;
    delete payload.sourceContract;
    validateDomainEventStream(events);
    opened = await current(store);
  }
  const opportunity = opened.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === task.taskId);
  if (opportunity === undefined) throw new Error("Expected Mathematician fixture opportunity");
  if (task.taskType === "SEAMSTRESS_ACTION") {
    requireAccepted(await service.execute(submitSeamstressActionCommand({
      commandId: commandId(`math-fixture-seamstress-${step}`), expectedGameVersion: opened.gameVersion,
      actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
      payload: { commandType: "SubmitSeamstressAction", taskId: task.taskId, opportunityId: opportunity.opportunityId, decision: { kind: "DEFER" } }
    })));
    return;
  }
  const target = opened.currentCharacterState?.entries.find((entry) =>
    entry.playerId !== opportunity.sourcePlayerId && (task.taskType !== "SNAKE_CHARMER_ACTION" || entry.role.characterType !== "DEMON")
  );
  if (target === undefined) throw new Error("Expected Mathematician fixture action target");
  const result = task.taskType === "SNAKE_CHARMER_ACTION"
    ? await service.execute(submitSnakeCharmerActionCommand({
        commandId: commandId(`math-fixture-snake-${step}`), expectedGameVersion: opened.gameVersion,
        actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
        payload: { commandType: "SubmitSnakeCharmerAction", taskId: task.taskId, opportunityId: opportunity.opportunityId,
          decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } }
      }))
    : task.taskType === "WITCH_ACTION"
      ? await service.execute(submitWitchActionCommand({
          commandId: commandId(`math-fixture-witch-${step}`), expectedGameVersion: opened.gameVersion,
          actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
          payload: { commandType: "SubmitWitchAction", taskId: task.taskId, opportunityId: opportunity.opportunityId,
            decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } }
        }))
      : await service.execute(submitDreamerActionCommand({
          commandId: commandId(`math-fixture-dreamer-${step}`), expectedGameVersion: opened.gameVersion,
          actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
          payload: { commandType: "SubmitDreamerAction", taskId: task.taskId, opportunityId: opportunity.opportunityId,
            decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } }
        }));
  requireAccepted(result);
};

export const reachBaseMathematicianTask = async (
  exactRoleIds = mathematicianBaseExactRoleIds
) => {
  const { service, commandStore } = createMathematicianService();
  requireAccepted(await service.execute(createGameCommand()));
  requireAccepted(await service.execute(selectScriptCommand()));
  requireAccepted(await service.execute(generateSetupCommand({ payload: { commandType: "GenerateSetup", constraints: { exactRoleIds } } })));
  requireAccepted(await service.execute(createPlayerRosterCommand()));
  requireAccepted(await service.execute(assignCharactersCommand()));
  requireAccepted(await service.execute(initializeFirstNightCommand()));
  requireAccepted(await service.execute(planFirstNightTasksCommand()));
  for (let step = 0; step < 20; step += 1) {
    const state = await current(commandStore);
    const task = state.firstNightTaskPlan?.tasks[state.firstNightTaskProgress?.settlements.length ?? 0];
    if (task === undefined) throw new Error("Mathematician fixture exhausted task plan");
    if (task.taskType === "MATHEMATICIAN_INFORMATION") return { service, commandStore, state, task };
    await advanceOne(service, commandStore, task, step);
  }
  throw new Error("Mathematician fixture exceeded bounded predecessor count");
};

export const settleBaseMathematician = async () => {
  const fixture = await reachBaseMathematicianTask();
  const command: SettleMathematicianInformationCommand = {
    commandId: commandId("settle-base-mathematician"), gameId: ids.game,
    expectedGameVersion: fixture.state.gameVersion, actor: systemActor,
    issuedAt: "2026-07-13T00:00:00.000Z", correlationId: correlationId("settle-base-mathematician"),
    payload: { commandType: "SettleMathematicianInformation", taskId: fixture.task.taskId }
  };
  const result = await fixture.service.execute(command);
  return { ...fixture, command, result, events: await fixture.commandStore.loadDomainEvents(ids.game) };
};

export const settleBaseMathematicianWithVortox = async () => {
  const fixture = await reachBaseMathematicianTask(mathematicianVortoxExactRoleIds);
  const command: SettleMathematicianInformationCommand = {
    commandId: commandId("settle-base-mathematician-vortox"), gameId: ids.game,
    expectedGameVersion: fixture.state.gameVersion, actor: systemActor,
    issuedAt: "2026-07-13T00:00:00.000Z", correlationId: correlationId("settle-base-mathematician-vortox"),
    payload: { commandType: "SettleMathematicianInformation", taskId: fixture.task.taskId }
  };
  const result = await fixture.service.execute(command);
  return { ...fixture, command, result, events: await fixture.commandStore.loadDomainEvents(ids.game) };
};

export const reachGainedMathematicianTaskV2 = async (
  exactRoleIds = philosopherGainedMathematicianExactRoleIds
) => {
  const { service, commandStore } = createMathematicianService();
  requireAccepted(await service.execute(createGameCommand()));
  requireAccepted(await service.execute(selectScriptCommand()));
  requireAccepted(await service.execute(generateSetupCommand({
    payload: { commandType: "GenerateSetup", constraints: { exactRoleIds } }
  })));
  requireAccepted(await service.execute(createPlayerRosterCommand()));
  requireAccepted(await service.execute(assignCharactersCommand()));
  requireAccepted(await service.execute(initializeFirstNightCommand()));
  requireAccepted(await service.execute(planFirstNightTasksCommand()));
  const planned = await current(commandStore);
  const philosopherTask = planned.firstNightTaskPlan?.tasks.find((task) => task.taskType === "PHILOSOPHER_ACTION");
  if (philosopherTask === undefined) throw new Error("Expected Philosopher task for gained Mathematician fixture");
  requireAccepted(await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("math-fixture-open-philosopher"), expectedGameVersion: planned.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: philosopherTask.taskId }
  })));
  const opened = await current(commandStore);
  const opportunity = opened.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === philosopherTask.taskId);
  if (opportunity === undefined) throw new Error("Expected open Philosopher opportunity");
  requireAccepted(await service.execute(submitPhilosopherActionCommand({
    commandId: commandId("math-fixture-choose-mathematician"), expectedGameVersion: opened.gameVersion,
    actor: systemActor,
    payload: { commandType: "SubmitPhilosopherAction", taskId: philosopherTask.taskId,
      opportunityId: opportunity.opportunityId,
      decision: { kind: "CHOOSE_GOOD_CHARACTER", roleId: roleId("mathematician") } }
  })));
  const eventsAfterChoice = await commandStore.loadDomainEvents(ids.game);
  for (let step = 0; step < 20; step += 1) {
    const state = await current(commandStore);
    const task = state.firstNightTaskPlan?.tasks[state.firstNightTaskProgress?.settlements.length ?? 0];
    if (task === undefined) throw new Error("Gained Mathematician fixture exhausted task plan");
    if (task.taskType === "MATHEMATICIAN_INFORMATION" && task.source.kind === "PHILOSOPHER_GAINED_ABILITY") {
      return { service, commandStore, state, task, eventsAfterChoice };
    }
    if (task.taskType === "MATHEMATICIAN_INFORMATION" && task.source.kind === "ROLE") {
      requireAccepted(await service.execute({
        commandId: commandId(`math-fixture-settle-base-before-gained-${step}`), gameId: ids.game,
        expectedGameVersion: state.gameVersion, actor: systemActor,
        issuedAt: "2026-07-13T00:00:00.000Z", correlationId: correlationId(`math-fixture-settle-base-before-gained-${step}`),
        payload: { commandType: "SettleMathematicianInformation", taskId: task.taskId }
      }));
      continue;
    }
    await advanceOne(service, commandStore, task, 100 + step);
  }
  throw new Error("Gained Mathematician fixture exceeded bounded predecessor count");
};

export const settleGainedMathematicianV2 = async () => {
  const fixture = await reachGainedMathematicianTaskV2();
  const command: SettleMathematicianInformationCommand = {
    commandId: commandId("settle-gained-mathematician-v2"), gameId: ids.game,
    expectedGameVersion: fixture.state.gameVersion, actor: systemActor,
    issuedAt: "2026-07-13T00:00:00.000Z", correlationId: correlationId("settle-gained-mathematician-v2"),
    payload: { commandType: "SettleMathematicianInformation", taskId: fixture.task.taskId }
  };
  const result = await fixture.service.execute(command);
  return { ...fixture, command, result, events: await fixture.commandStore.loadDomainEvents(ids.game) };
};

export const settleBaseAndGainedMathematicianV2 = async (
  exactRoleIds = philosopherAndBaseMathematicianExactRoleIds
) => {
  const fixture = await reachGainedMathematicianTaskV2(exactRoleIds);
  const command: SettleMathematicianInformationCommand = {
    commandId: commandId("settle-base-and-gained-mathematician-v2"), gameId: ids.game,
    expectedGameVersion: fixture.state.gameVersion, actor: systemActor,
    issuedAt: "2026-07-13T00:00:00.000Z", correlationId: correlationId("settle-base-and-gained-mathematician-v2"),
    payload: { commandType: "SettleMathematicianInformation", taskId: fixture.task.taskId }
  };
  const result = await fixture.service.execute(command);
  return { ...fixture, command, result, events: await fixture.commandStore.loadDomainEvents(ids.game) };
};
