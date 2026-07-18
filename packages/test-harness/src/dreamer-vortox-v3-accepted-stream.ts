import { GameApplicationService } from "@botc/application";
import type {
  CommandCommitStore,
  CommandReceipt,
  CommitAcceptedCommandInput,
  IdGenerator,
  RecordRejectedCommandInput
} from "@botc/application";
import {
  batchId,
  commandId,
  eventId,
  rebuildGameState,
  rebuildOptionalGameState,
  roleId,
  validateDomainBatchSemantics,
  validateDomainEventStream
} from "@botc/domain-core";
import type {
  AnyDomainEventEnvelope,
  BatchId,
  CommandId,
  EventId,
  GameId,
  GameState
} from "@botc/domain-core";
import {
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
  submitSnakeCharmerActionCommand,
  submitWitchActionCommand,
  testAssignmentGenerator,
  testFirstNightSystemInformationResolver,
  testFirstNightTaskCatalog,
  testFirstNightTaskPlanner,
  testInitialPrivateKnowledgeBuilder,
  testSetupGenerator
} from "./builders.js";
import { FixedClock, FixedIdGenerator } from "./fixed-generators.js";
import { MemoryCommandCommitStore } from "./memory-stores.js";

const VORTOX_ROLE_IDS = [
  "dreamer", "snake_charmer", "mathematician", "flowergirl", "town_crier", "seamstress",
  "mutant", "sweetheart", "artist", "evil_twin", "witch", "vortox"
].map(roleId);

export type AcceptedDreamerVortoxV3StreamCapture = {
  readonly events: readonly AnyDomainEventEnvelope[];
  readonly finalState: GameState;
  readonly opportunityEventIndex: number;
  readonly targetEventIndex: number;
  readonly deliveryEventIndex: number;
  readonly settlementEventIndex: number;
};

export type AcceptedDreamerVortoxV3OpenPrefixCapture = {
  readonly events: readonly AnyDomainEventEnvelope[];
  readonly finalState: GameState;
  readonly opportunityEventIndex: number;
};

class ContinuedFixedIdGenerator implements IdGenerator {
  private eventCounter: number;
  private batchCounter: number;

  public constructor(events: readonly AnyDomainEventEnvelope[]) {
    this.eventCounter = events.length;
    this.batchCounter = new Set(events.map((event) => event.batchId)).size;
  }

  public nextEventId(): EventId {
    this.eventCounter += 1;
    return eventId(`event-${this.eventCounter}`);
  }

  public nextBatchId(): BatchId {
    this.batchCounter += 1;
    return batchId(`batch-${this.batchCounter}`);
  }
}

class AcceptedPrefixCommandStore implements CommandCommitStore {
  private events: AnyDomainEventEnvelope[];
  private readonly receipts = new Map<string, CommandReceipt>();

  public constructor(events: readonly AnyDomainEventEnvelope[]) {
    this.events = [...structuredClone(events)];
  }

  public loadDomainEvents(gameId: GameId): Promise<readonly AnyDomainEventEnvelope[]> {
    return Promise.resolve(this.events.filter((event) => event.gameId === gameId));
  }

  public findCommandReceipt(gameId: GameId, requestedCommandId: CommandId): Promise<CommandReceipt | undefined> {
    return Promise.resolve(this.receipts.get(`${gameId}\u0000${requestedCommandId}`));
  }

  public commitAcceptedCommand(input: CommitAcceptedCommandInput): Promise<void> {
    try {
      const currentVersion = this.events.at(-1)?.gameVersion ?? 0;
      if (currentVersion !== input.expectedGameVersion) {
        throw new Error("Accepted prefix store version mismatch");
      }
      validateDomainBatchSemantics(rebuildOptionalGameState(this.events), input.eventBatch.events);
      const stagedEvents = [...this.events, ...input.eventBatch.events];
      validateDomainEventStream(stagedEvents);
      rebuildGameState(stagedEvents);
      this.events = stagedEvents;
      this.receipts.set(
        `${input.receipt.gameId}\u0000${input.receipt.commandId}`,
        input.receipt
      );
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error instanceof Error ? error : new Error("Unknown accepted prefix store failure"));
    }
  }

  public recordRejectedCommand(input: RecordRejectedCommandInput): Promise<void> {
    this.receipts.set(`${input.gameId}\u0000${input.commandId}`, input.receipt);
    return Promise.resolve();
  }
}

const requireState = async (store: CommandCommitStore): Promise<GameState> => {
  const state = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));
  if (state === undefined) throw new Error("Expected accepted Dreamer Vortox harness state");
  return state;
};

const createService = (
  store: CommandCommitStore,
  idGenerator: IdGenerator
): GameApplicationService => new GameApplicationService({
  commandStore: store,
  ids: idGenerator,
  clock: new FixedClock(),
  setupGenerator: testSetupGenerator,
  characterAssignmentGenerator: testAssignmentGenerator,
  initialPrivateKnowledgeBuilder: testInitialPrivateKnowledgeBuilder,
  firstNightTaskPlanner: testFirstNightTaskPlanner,
  firstNightTaskCatalogSnapshot: testFirstNightTaskCatalog,
  firstNightSystemInformationResolver: testFirstNightSystemInformationResolver
});

const executeAccepted = async (
  service: GameApplicationService,
  command: Parameters<GameApplicationService["execute"]>[0]
): Promise<void> => {
  const result = await service.execute(command);
  if (result.status !== "accepted") {
    throw new Error(`Dreamer Vortox harness command failed: ${JSON.stringify(result)}`);
  }
};

const captureAcceptedBaseDreamerVortoxV3OpenPrefixUncached = async (
): Promise<AcceptedDreamerVortoxV3OpenPrefixCapture> => {
  const store = new MemoryCommandCommitStore();
  const service = createService(store, new FixedIdGenerator());
  const execute = (command: Parameters<GameApplicationService["execute"]>[0]): Promise<void> =>
    executeAccepted(service, command);

  await execute(createGameCommand());
  await execute(selectScriptCommand());
  await execute(generateSetupCommand({ payload: { commandType: "GenerateSetup", constraints: { exactRoleIds: VORTOX_ROLE_IDS } } }));
  await execute(createPlayerRosterCommand());
  await execute(assignCharactersCommand());
  await execute(initializeFirstNightCommand());
  await execute(planFirstNightTasksCommand());

  for (;;) {
    const state = await requireState(store);
    const task = state.firstNightTaskPlan?.tasks[state.firstNightTaskProgress?.settlements.length ?? 0];
    if (task === undefined) throw new Error("Expected task before Dreamer Vortox settlement");
    if (task.taskType === "DREAMER_ACTION") break;
    if (task.taskType === "MINION_INFO" || task.taskType === "DEMON_INFO") {
      await execute(settleFirstNightSystemTaskCommand({
        commandId: commandId(`vortox-settle-${task.taskType.toLowerCase()}`), expectedGameVersion: state.gameVersion,
        payload: { commandType: "SettleFirstNightSystemTask", taskId: task.taskId }
      }));
      continue;
    }
    if (task.taskType === "EVIL_TWIN_SETUP") {
      await execute(settleEvilTwinSetupCommand({
        commandId: commandId("vortox-settle-evil-twin"), expectedGameVersion: state.gameVersion,
        payload: { commandType: "SettleEvilTwinSetup", taskId: task.taskId }
      }));
      continue;
    }
    if (task.taskType !== "SNAKE_CHARMER_ACTION" && task.taskType !== "WITCH_ACTION") {
      throw new Error(`Unexpected pre-Dreamer task ${task.taskType}`);
    }
    await execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId(`vortox-open-${task.taskType.toLowerCase()}`), expectedGameVersion: state.gameVersion,
      payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: task.taskId }
    }));
    const opened = await requireState(store);
    const opportunity = opened.firstNightActionOpportunities?.opportunities.find((entry) => entry.taskId === task.taskId);
    if (opportunity === undefined) throw new Error("Expected pre-Dreamer opportunity");
    if (task.taskType === "SNAKE_CHARMER_ACTION") {
      const target = opened.currentCharacterState?.entries.find((entry) =>
        entry.playerId !== opportunity.sourcePlayerId && entry.role.characterType !== "DEMON");
      if (target === undefined) throw new Error("Expected non-Demon Snake Charmer target");
      await execute(submitSnakeCharmerActionCommand({
        commandId: commandId("vortox-submit-snake"), expectedGameVersion: opened.gameVersion,
        actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
        payload: { commandType: "SubmitSnakeCharmerAction", taskId: task.taskId, opportunityId: opportunity.opportunityId,
          decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } }
      }));
    } else {
      const target = opened.roster?.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
      if (target === undefined) throw new Error("Expected Witch target");
      await execute(submitWitchActionCommand({
        commandId: commandId("vortox-submit-witch"), expectedGameVersion: opened.gameVersion,
        actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
        payload: { commandType: "SubmitWitchAction", taskId: task.taskId, opportunityId: opportunity.opportunityId,
          decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } }
      }));
    }
  }

  const before = await requireState(store);
  const task = before.firstNightTaskPlan?.tasks[before.firstNightTaskProgress?.settlements.length ?? 0];
  if (task?.taskType !== "DREAMER_ACTION") throw new Error("Expected Dreamer task");
  await execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("vortox-open-dreamer"), expectedGameVersion: before.gameVersion,
    payload: { commandType: "OpenFirstNightRoleActionOpportunity", taskId: task.taskId }
  }));
  const opened = await requireState(store);
  const events = await store.loadDomainEvents(ids.game);
  const opportunityEventIndex = events.findIndex((event) =>
    event.eventType === "FirstNightActionOpportunityCreated" &&
    event.payload.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3"
  );
  if (opportunityEventIndex < 0) {
    throw new Error("Expected real-command Dreamer Vortox V3 OPEN prefix");
  }
  return {
    events: structuredClone(events),
    finalState: structuredClone(opened),
    opportunityEventIndex
  };
};

let acceptedOpenPrefixPromise: Promise<AcceptedDreamerVortoxV3OpenPrefixCapture> | undefined;

export const captureAcceptedBaseDreamerVortoxV3OpenPrefix = async (
): Promise<AcceptedDreamerVortoxV3OpenPrefixCapture> => {
  acceptedOpenPrefixPromise ??= captureAcceptedBaseDreamerVortoxV3OpenPrefixUncached();
  return structuredClone(await acceptedOpenPrefixPromise);
};

export const captureAcceptedBaseDreamerVortoxV3Stream = async (
  targetKind: "VORTOX" | "GOOD" | "NON_VORTOX_EVIL" = "GOOD"
): Promise<AcceptedDreamerVortoxV3StreamCapture> => {
  const prefix = await captureAcceptedBaseDreamerVortoxV3OpenPrefix();
  const store = new AcceptedPrefixCommandStore(prefix.events);
  const service = createService(store, new ContinuedFixedIdGenerator(prefix.events));
  const opened = prefix.finalState;
  const task = opened.firstNightTaskPlan?.tasks[opened.firstNightTaskProgress?.settlements.length ?? 0];
  if (task?.taskType !== "DREAMER_ACTION") {
    throw new Error("Expected cached Dreamer Vortox task");
  }
  const opportunity = opened.firstNightActionOpportunities?.opportunities.find((entry) =>
    entry.taskId === task.taskId && entry.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3");
  const target = opened.currentCharacterState?.entries.find((entry) =>
    entry.playerId !== opportunity?.sourcePlayerId &&
    (targetKind === "VORTOX"
      ? entry.role.roleId === "vortox"
      : targetKind === "NON_VORTOX_EVIL"
        ? entry.role.defaultAlignment === "EVIL" && entry.role.roleId !== "vortox"
        : entry.role.defaultAlignment === "GOOD"));
  if (opportunity === undefined || target === undefined) throw new Error("Expected Dreamer Vortox target");
  await executeAccepted(service, submitDreamerActionCommand({
    commandId: commandId(`vortox-submit-dreamer-${targetKind.toLowerCase()}`), expectedGameVersion: opened.gameVersion,
    actor: { kind: "ai", playerId: opportunity.sourcePlayerId },
    payload: { commandType: "SubmitDreamerAction", taskId: task.taskId, opportunityId: opportunity.opportunityId,
      decision: { kind: "CHOOSE_PLAYER", targetPlayerId: target.playerId } }
  }));

  const events = await store.loadDomainEvents(ids.game);
  const opportunityEventIndex = prefix.opportunityEventIndex;
  const targetEventIndex = events.findIndex((event) => event.eventType === "DreamerTargetChosen" && "targetSchemaVersion" in event.payload);
  const deliveryEventIndex = events.findIndex((event) => event.eventType === "DreamerInformationDelivered" &&
    "deliverySchemaVersion" in event.payload && event.payload.deliverySchemaVersion === "dreamer-information-delivered-v3");
  const settlementEventIndex = events.findIndex((event, index) => index > deliveryEventIndex &&
    event.eventType === "ScheduledTaskSettled" && event.payload.taskType === "DREAMER_ACTION");
  if (opportunityEventIndex < 0 || targetEventIndex < 0 || deliveryEventIndex !== targetEventIndex + 1 || settlementEventIndex !== deliveryEventIndex + 1) {
    throw new Error("Expected exact Dreamer Vortox V3 accepted batch");
  }
  return { events: structuredClone(events), finalState: await requireState(store), opportunityEventIndex,
    targetEventIndex, deliveryEventIndex, settlementEventIndex };
};
