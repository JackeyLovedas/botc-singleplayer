import { GameApplicationService } from "@botc/application";
import {
  commandId,
  rebuildOptionalGameState,
  roleId
} from "@botc/domain-core";
import type {
  AnyDomainEventEnvelope,
  GameState
} from "@botc/domain-core";
import {
  assignCharactersCommand,
  createGameCommand,
  createPlayerRosterCommand,
  generateSetupCommand,
  initializeFirstNightCommand,
  openFirstNightRoleActionOpportunityCommand,
  planFirstNightTasksCommand,
  selectScriptCommand,
  settleEvilTwinSetupCommand,
  settleFirstNightSystemTaskCommand,
  submitDreamerActionCommand,
  submitSnakeCharmerActionCommand,
  submitWitchActionCommand
} from "./builders.js";
import {
  FixedClock,
  FixedIdGenerator
} from "./fixed-generators.js";
import { MemoryCommandCommitStore } from "./memory-stores.js";
import {
  ids,
  testAssignmentGenerator,
  testFirstNightSystemInformationResolver,
  testFirstNightTaskCatalog,
  testFirstNightTaskPlanner,
  testInitialPrivateKnowledgeBuilder,
  testSetupGenerator
} from "./builders.js";

const BASE_DREAMER_NORMAL_ROLE_IDS = [
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

const requireState = async (store: MemoryCommandCommitStore): Promise<GameState> => {
  const state = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
  if (state === undefined) throw new Error("Expected accepted Dreamer V3 harness state");
  return state;
};

const requireAccepted = async (
  service: GameApplicationService,
  command: Parameters<GameApplicationService["execute"]>[0]
): Promise<void> => {
  const result = await service.execute(command);
  if (result.status !== "accepted") {
    throw new Error(`Dreamer V3 harness command was not accepted: ${JSON.stringify(result)}`);
  }
};

export type AcceptedDreamerV3StreamCapture = {
  readonly events: readonly AnyDomainEventEnvelope[];
  readonly finalState: GameState;
  readonly targetEventIndex: number;
  readonly deliveryEventIndex: number;
  readonly settlementEventIndex: number;
};

export const captureAcceptedBaseDreamerV3NormalStream = async (): Promise<AcceptedDreamerV3StreamCapture> => {
  const store = new MemoryCommandCommitStore();
  const service = new GameApplicationService({
    commandStore: store,
    ids: new FixedIdGenerator(),
    clock: new FixedClock(),
    setupGenerator: testSetupGenerator,
    characterAssignmentGenerator: testAssignmentGenerator,
    initialPrivateKnowledgeBuilder: testInitialPrivateKnowledgeBuilder,
    firstNightTaskPlanner: testFirstNightTaskPlanner,
    firstNightTaskCatalogSnapshot: testFirstNightTaskCatalog,
    firstNightSystemInformationResolver: testFirstNightSystemInformationResolver
  });

  await requireAccepted(service, createGameCommand());
  await requireAccepted(service, selectScriptCommand());
  await requireAccepted(service, generateSetupCommand({
    payload: { commandType: "GenerateSetup", constraints: { exactRoleIds: BASE_DREAMER_NORMAL_ROLE_IDS } }
  }));
  await requireAccepted(service, createPlayerRosterCommand());
  await requireAccepted(service, assignCharactersCommand());
  await requireAccepted(service, initializeFirstNightCommand());
  await requireAccepted(service, planFirstNightTasksCommand());

  for (const taskType of ["MINION_INFO", "DEMON_INFO"] as const) {
    const state = await requireState(store);
    const task = state.firstNightTaskPlan?.tasks[state.firstNightTaskProgress?.settlements.length ?? 0];
    if (task?.taskType !== taskType) throw new Error(`Expected ${taskType} in Dreamer V3 harness`);
    await requireAccepted(service, settleFirstNightSystemTaskCommand({
      commandId: commandId(`capture-${taskType.toLowerCase()}`),
      expectedGameVersion: state.gameVersion,
      payload: { commandType: "SettleFirstNightSystemTask", taskId: task.taskId }
    }));
  }

  const snakeBefore = await requireState(store);
  const snakeTask = snakeBefore.firstNightTaskPlan?.tasks[snakeBefore.firstNightTaskProgress?.settlements.length ?? 0];
  if (snakeTask?.taskType !== "SNAKE_CHARMER_ACTION") throw new Error("Expected Snake Charmer in Dreamer V3 harness");
  await requireAccepted(service, openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("capture-open-snake"), expectedGameVersion: snakeBefore.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: snakeTask.taskId }
  }));
  const snakeOpen = await requireState(store);
  const snakeOpportunity = snakeOpen.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === snakeTask.taskId);
  const snakeTarget = snakeOpen.currentCharacterState?.entries.find((entry) =>
    entry.playerId !== snakeOpportunity?.sourcePlayerId && entry.role.characterType !== "DEMON");
  if (snakeOpportunity === undefined || snakeTarget === undefined) throw new Error("Expected Snake Charmer target in Dreamer V3 harness");
  await requireAccepted(service, submitSnakeCharmerActionCommand({
    commandId: commandId("capture-submit-snake"), expectedGameVersion: snakeOpen.gameVersion,
    actor: { kind: "ai", playerId: snakeOpportunity.sourcePlayerId },
    payload: { commandType: "SubmitSnakeCharmerAction", taskId: snakeTask.taskId,
      opportunityId: snakeOpportunity.opportunityId, decision: { kind: "CHOOSE_PLAYER", targetPlayerId: snakeTarget.playerId } }
  }));

  const twinBefore = await requireState(store);
  const twinTask = twinBefore.firstNightTaskPlan?.tasks[twinBefore.firstNightTaskProgress?.settlements.length ?? 0];
  if (twinTask?.taskType !== "EVIL_TWIN_SETUP") throw new Error("Expected Evil Twin in Dreamer V3 harness");
  await requireAccepted(service, settleEvilTwinSetupCommand({
    commandId: commandId("capture-settle-twin"), expectedGameVersion: twinBefore.gameVersion,
    payload: { commandType: "SettleEvilTwinSetup", taskId: twinTask.taskId }
  }));

  const witchBefore = await requireState(store);
  const witchTask = witchBefore.firstNightTaskPlan?.tasks[witchBefore.firstNightTaskProgress?.settlements.length ?? 0];
  if (witchTask?.taskType !== "WITCH_ACTION") throw new Error("Expected Witch in Dreamer V3 harness");
  await requireAccepted(service, openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("capture-open-witch"), expectedGameVersion: witchBefore.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: witchTask.taskId }
  }));
  const witchOpen = await requireState(store);
  const witchOpportunity = witchOpen.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === witchTask.taskId);
  const witchTarget = witchOpen.roster?.entries.find((entry) => entry.playerId !== witchOpportunity?.sourcePlayerId);
  if (witchOpportunity === undefined || witchTarget === undefined) throw new Error("Expected Witch target in Dreamer V3 harness");
  await requireAccepted(service, submitWitchActionCommand({
    commandId: commandId("capture-submit-witch"), expectedGameVersion: witchOpen.gameVersion,
    actor: { kind: "ai", playerId: witchOpportunity.sourcePlayerId },
    payload: { commandType: "SubmitWitchAction", taskId: witchTask.taskId,
      opportunityId: witchOpportunity.opportunityId, decision: { kind: "CHOOSE_PLAYER", targetPlayerId: witchTarget.playerId } }
  }));

  const dreamerBefore = await requireState(store);
  const dreamerTask = dreamerBefore.firstNightTaskPlan?.tasks[dreamerBefore.firstNightTaskProgress?.settlements.length ?? 0];
  if (dreamerTask?.taskType !== "DREAMER_ACTION") throw new Error("Expected Dreamer in Dreamer V3 harness");
  await requireAccepted(service, openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("capture-open-dreamer"), expectedGameVersion: dreamerBefore.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: dreamerTask.taskId }
  }));
  const dreamerOpen = await requireState(store);
  const dreamerOpportunity = dreamerOpen.firstNightActionOpportunities?.opportunities.find((entry) =>
    entry.taskId === dreamerTask.taskId && entry.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3");
  const dreamerTarget = dreamerOpen.roster?.entries.find((entry) => entry.playerId !== dreamerOpportunity?.sourcePlayerId);
  if (dreamerOpportunity === undefined || dreamerTarget === undefined) throw new Error("Expected Dreamer V3 target in harness");
  await requireAccepted(service, submitDreamerActionCommand({
    commandId: commandId("capture-submit-dreamer"), expectedGameVersion: dreamerOpen.gameVersion,
    actor: { kind: "ai", playerId: dreamerOpportunity.sourcePlayerId },
    payload: { commandType: "SubmitDreamerAction", taskId: dreamerTask.taskId,
      opportunityId: dreamerOpportunity.opportunityId, decision: { kind: "CHOOSE_PLAYER", targetPlayerId: dreamerTarget.playerId } }
  }));

  const events = await store.loadDomainEvents(ids.game);
  const targetEventIndex = events.findIndex((event) => event.eventType === "DreamerTargetChosen" &&
    "targetSchemaVersion" in event.payload);
  const deliveryEventIndex = events.findIndex((event) => event.eventType === "DreamerInformationDelivered" &&
    "deliverySchemaVersion" in event.payload);
  const settlementEventIndex = events.findIndex((event, index) => index > deliveryEventIndex &&
    event.eventType === "ScheduledTaskSettled" && event.payload.taskType === "DREAMER_ACTION");
  if (targetEventIndex < 0 || deliveryEventIndex !== targetEventIndex + 1 || settlementEventIndex !== deliveryEventIndex + 1) {
    throw new Error("Expected captured exact Dreamer V3 three-event batch");
  }
  return {
    events: structuredClone(events),
    finalState: await requireState(store),
    targetEventIndex,
    deliveryEventIndex,
    settlementEventIndex
  };
};
