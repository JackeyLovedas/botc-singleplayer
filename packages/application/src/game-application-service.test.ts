import { describe, expect, it } from "vitest";
import {
  RULES_BASELINE_VERSION,
  DomainError,
  actionOpportunityId,
  batchId,
  cloneFirstNightTaskCatalogSnapshot,
  commandId,
  correlationId,
  playerId,
  rebuildOptionalGameState,
  roleId,
  scheduledTaskId
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
  GameId,
  GeneratedCharacterAssignment
} from "@botc/domain-core";
import { GameApplicationService, accepted, rejected } from "@botc/application";
import type {
  CharacterAssignmentGeneratorPort,
  CommandAccepted,
  CommandExecutionFailed,
  CommandReceiptResult,
  CommandRejected,
  CommandResult,
  FirstNightSystemInformationResolverPort,
  FirstNightTaskPlannerPort,
  InitialPrivateKnowledgeBuilderPort,
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
  submitPhilosopherActionCommand,
  submitSnakeCharmerActionCommand,
  storytellerActor,
  testAssignmentGenerator,
  testFirstNightTaskCatalog,
  testFirstNightSystemInformationResolver,
  testFirstNightTaskPlanner,
  testInitialPrivateKnowledgeBuilder,
  testSetupGenerator,
  systemActor
} from "@botc/test-harness";

const makeService = (
  commandStore = new MemoryCommandCommitStore(),
  setupGenerator: SetupGeneratorPort = testSetupGenerator,
  idGenerator = new FixedIdGenerator(),
  clock = new FixedClock(),
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

const expectAcceptedResult: (result: CommandResult) => asserts result is CommandAccepted = (result) => {
  expect(result.status).toBe("accepted");
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

const philosopherGainedSnakeCharmerTaskId = scheduledTaskId("first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-snake_charmer");
const philosopherGainedSnakeCharmerOpportunityId = actionOpportunityId(
  "first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-snake_charmer:opportunity-01"
);

const reachOpenPhilosopherGainedSnakeCharmerOpportunity = async (service: GameApplicationService): Promise<void> => {
  await reachOpenPhilosopherActionOpportunity(service);
  await service.execute(choosePhilosopherRoleCommand("snake_charmer", { commandId: commandId("choose-snake-charmer-for-action") }));
  await service.execute(openFirstNightRoleActionOpportunityCommand({
    commandId: commandId("open-snake-charmer-for-action"),
    expectedGameVersion: 9,
    payload: {
      commandType: "OpenFirstNightRoleActionOpportunity",
      taskId: philosopherGainedSnakeCharmerTaskId
    }
  }));
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

const reachNoPhilosopherFirstNightTaskPlan = async (service: GameApplicationService): Promise<void> => {
  await service.execute(createGameCommand());
  await service.execute(selectScriptCommand());
  await service.execute(generateSetupCommand({
    payload: {
      commandType: "GenerateSetup",
      constraints: {
        exactRoleIds: noPhilosopherExactRoleIds
      }
    }
  }));
  await service.execute(createPlayerRosterCommand());
  await service.execute(assignCharactersCommand());
  await service.execute(initializeFirstNightCommand());
  await service.execute(planFirstNightTasksCommand());
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

class FaultInjectingIdGenerator extends FixedIdGenerator {
  public failNextBatchId = false;
  public failEventCallNumber: number | undefined;
  private eventCallCount = 0;

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
  expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(10);
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
  expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);

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
  expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);
  expect(commandStore.getGameVersion(command.gameId)).toBe(7);
  expect(commandStore.rejectedCount).toBe(0);

  return failedResult;
};

describe("GameApplicationService", () => {
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

    expect(first).toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch", idempotent: false });
    expect(second).toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch", idempotent: true });
    expect(events).toHaveLength(0);
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(3);
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
    expect(result.events).toHaveLength(2);
    expect(events).toHaveLength(3);
    expect(events[1]).toMatchObject({
      eventType: "ScriptSelected",
      eventSequence: 2,
      gameVersion: 2,
      commandId: selectScriptCommand().commandId
    });
    expect(events[2]).toMatchObject({
      eventType: "PhaseTransitioned",
      eventSequence: 3,
      gameVersion: 2,
      commandId: selectScriptCommand().commandId
    });
    expect(events[1]?.batchId).toBe(events[2]?.batchId);
    expect(events[1]?.commandId).toBe(events[2]?.commandId);
    expect(events[1]?.gameVersion).toBe(events[2]?.gameVersion);
    expect(state?.selectedScript).toMatchObject({ scriptId: "sects-and-violets" });
    expect(state?.phase).toBe("SETUP_GENERATION");
    expect(state?.gameVersion).toBe(2);
    expect(state?.lastEventSequence).toBe(3);
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
    expect(events).toHaveLength(3);
    expect(events[1]?.eventType).toBe("ScriptSelected");
    expect(events[2]?.eventType).toBe("PhaseTransitioned");
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
    expect(events).toHaveLength(3);
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

    expect(events).toHaveLength(3);
    expect(events[1]?.eventSequence).toBe(2);
    expect(events[2]?.eventSequence).toBe(3);
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(3);
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
    expect(events).toHaveLength(5);
    expect(events[3]).toMatchObject({ eventType: "SetupGenerated", eventSequence: 4, gameVersion: 3 });
    expect(events[4]).toMatchObject({ eventType: "PhaseTransitioned", eventSequence: 5, gameVersion: 3 });
    expect(events[3]?.batchId).toBe(events[4]?.batchId);
    expect(events[3]?.commandId).toBe(events[4]?.commandId);
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(3);

    const fixed = makeService(commandStore, testSetupGenerator, idGenerator, clock);
    const retried = await fixed.service.execute(command);
    const receipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(3);
    expect(receipt?.result.status).toBe("accepted");
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(5);
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(3);

    const fixed = makeService(commandStore, testSetupGenerator, idGenerator, clock);
    const retried = await fixed.service.execute(command);
    const receipt = await commandStore.findCommandReceipt(command.gameId, command.commandId);

    expectAcceptedResult(retried);
    expect(retried.gameVersion).toBe(3);
    expect(receipt?.result.status).toBe("accepted");
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(5);
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
    expect(events).toHaveLength(3);
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(3);
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
    expect(events).toHaveLength(5);
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(6);
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(6);

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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(6);
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

  it("keeps second nextEventId failures in two-event batches retryable without partial events", async () => {
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(3);
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
    expect(retried.events).toHaveLength(2);
    expect(eventsAfterRetry).toHaveLength(3);
    expect(eventsAfterRetry[1]?.eventType).toBe("ScriptSelected");
    expect(eventsAfterRetry[2]?.eventType).toBe("PhaseTransitioned");
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
      eventSequence: 9,
      gameVersion: 6,
      commandId: command.commandId
    });
    expect(result.events[1]).toMatchObject({
      eventType: "InitialPrivateKnowledgeEstablished",
      eventSequence: 10,
      gameVersion: 6,
      commandId: command.commandId
    });
    expect(result.events[0]?.batchId).toBe(result.events[1]?.batchId);
    expect(events).toHaveLength(10);
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(10);
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(10);
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(8);

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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(8);
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
      eventSequence: 11,
      gameVersion: 7,
      commandId: command.commandId
    });
    expect(result.events.map((event) => event.eventType)).not.toContain("PhaseTransitioned");
    expect(state?.phase).toBe("FIRST_NIGHT");
    expect(state?.nightNumber).toBe(1);
    expect(state?.dayNumber).toBe(0);
    expect(state?.firstNightTaskPlan?.taskPlanVersion).toBe("first-night-task-plan-v1");
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(11);
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(10);

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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(10);
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(10);
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(10);
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(10);
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
    expect(events).toHaveLength(11);
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
      eventSequence: 12,
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
    expect(events).toHaveLength(12);
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
    expect(await actorStore.loadDomainEvents(ids.game)).toHaveLength(11);
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(12);

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
      eventSequence: 13,
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
      eventSequence: 14,
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
    expect(events).toHaveLength(14);
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
    expect(await mismatchStore.loadDomainEvents(ids.game)).toHaveLength(12);
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
      "FirstNightTaskInserted",
      "ScheduledTaskSettled"
    ]);
    expect((await commandStore.findCommandReceipt(choose.gameId, choose.commandId))?.result.status).toBe("accepted");
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(17);

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
    expect(await otherStore.loadDomainEvents(ids.game)).toHaveLength(12);
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
      expect(await store.loadDomainEvents(ids.game), testCase.name).toHaveLength(12);
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

  it("records drunkenness for an in-play good role and inserts gained first-night tasks before MINION_INFO", async () => {
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
      "FirstNightTaskInserted",
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
      taskId: "first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-10:from-snake_charmer",
      taskType: "SNAKE_CHARMER_ACTION",
      taskClass: "ROLE_ACTION",
      orderKey: {
        baseOrder: 100,
        insertionOrder: 1
      },
      status: "PENDING",
      settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT",
      insertionReason: "PHILOSOPHER_GAINED_ABILITY",
      insertedByOpportunityId: "first-night-v1:PHILOSOPHER_ACTION:seat-10:opportunity-01"
    });
    expect(state?.firstNightTaskPlan?.tasks.slice(0, 3).map((task) => task.taskType)).toStrictEqual([
      "PHILOSOPHER_ACTION",
      "SNAKE_CHARMER_ACTION",
      "MINION_INFO"
    ]);
    expect(state?.firstNightTaskPlan?.taskCatalogSnapshot.definitions).toHaveLength(testFirstNightTaskCatalog.definitions.length);
    expect(state?.firstNightTaskProgress?.settlements).toHaveLength(1);

    const minionResult = await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("blocked-minion-after-inserted-snake"),
      expectedGameVersion: 9
    }));
    expect(minionResult).toMatchObject({
      status: "rejected",
      code: "NextTaskRequiresRoleExecution",
      currentGameVersion: 9
    });
  });

  it("opens a deterministic Philosopher gained Snake Charmer opportunity with safe visibility", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherActionOpportunity(service);
    await service.execute(choosePhilosopherRoleCommand("snake_charmer", { commandId: commandId("choose-snake-before-open") }));

    const command = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-philosopher-gained-snake-charmer"),
      expectedGameVersion: 9,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: philosopherGainedSnakeCharmerTaskId
      }
    });
    const result = await service.execute(command);
    const events = await commandStore.loadDomainEvents(ids.game);
    const state = rebuildOptionalGameState(events);

    expectAcceptedResult(result);
    expect(result).toMatchObject({ status: "accepted", gameVersion: 10, idempotent: false });
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      eventSequence: 18,
      gameVersion: 10,
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
    expect(state?.firstNightActionOpportunities?.opportunities[1]).toMatchObject({
      opportunityId: philosopherGainedSnakeCharmerOpportunityId,
      opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN"
    });
    expect(state?.firstNightTaskProgress?.settlements).toHaveLength(1);

    const duplicate = openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("duplicate-open-philosopher-gained-snake"),
      expectedGameVersion: 10,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: philosopherGainedSnakeCharmerTaskId
      }
    });
    await expect(service.execute(duplicate)).resolves.toMatchObject({
      status: "rejected",
      code: "ActionOpportunityAlreadyOpen",
      currentGameVersion: 10
    });
    expect((await commandStore.findCommandReceipt(duplicate.gameId, duplicate.commandId))?.result.status).toBe("rejected");
  });

  it("allows only system or Storyteller actors to open the gained Snake Charmer opportunity", async () => {
    const storytellerStore = new MemoryCommandCommitStore();
    const { service: storytellerService } = makeService(storytellerStore);
    await reachOpenPhilosopherActionOpportunity(storytellerService);
    await storytellerService.execute(choosePhilosopherRoleCommand("snake_charmer", { commandId: commandId("choose-snake-storyteller-open") }));
    await expect(storytellerService.execute(openFirstNightRoleActionOpportunityCommand({
      actor: storytellerActor,
      commandId: commandId("storyteller-open-philosopher-gained-snake"),
      expectedGameVersion: 9,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: philosopherGainedSnakeCharmerTaskId
      }
    }))).resolves.toMatchObject({ status: "accepted", gameVersion: 10 });

    const actorStore = new MemoryCommandCommitStore();
    const { service: actorService } = makeService(actorStore);
    await reachOpenPhilosopherActionOpportunity(actorService);
    await actorService.execute(choosePhilosopherRoleCommand("snake_charmer", { commandId: commandId("choose-snake-actor-open") }));
    const humanCommand = openFirstNightRoleActionOpportunityCommand({
      actor: humanActor,
      commandId: commandId("human-open-philosopher-gained-snake"),
      expectedGameVersion: 9,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: philosopherGainedSnakeCharmerTaskId
      }
    });
    const aiCommand = openFirstNightRoleActionOpportunityCommand({
      actor: aiActor,
      commandId: commandId("ai-open-philosopher-gained-snake"),
      expectedGameVersion: 9,
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

  it("rejects unsupported inserted and base Snake Charmer opportunities", async () => {
    const dreamerStore = new MemoryCommandCommitStore();
    const { service: dreamerService } = makeService(dreamerStore);
    await reachOpenPhilosopherActionOpportunity(dreamerService);
    await dreamerService.execute(choosePhilosopherRoleCommand("dreamer", { commandId: commandId("choose-dreamer-before-open") }));
    const dreamerTaskId = scheduledTaskId("first-night-v1:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-10:from-dreamer");
    await expect(dreamerService.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-gained-dreamer-unsupported"),
      expectedGameVersion: 9,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: dreamerTaskId
      }
    }))).resolves.toMatchObject({
      status: "rejected",
      code: "UnsupportedRoleActionOpportunity",
      currentGameVersion: 9
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

    await expect(baseSnakeService.execute(openFirstNightRoleActionOpportunityCommand({
      commandId: commandId("open-base-snake-unsupported"),
      expectedGameVersion: 9,
      payload: {
        commandType: "OpenFirstNightRoleActionOpportunity",
        taskId: baseSnakeTask.taskId
      }
    }))).resolves.toMatchObject({
      status: "rejected",
      code: "UnsupportedRoleActionOpportunity",
      currentGameVersion: 9
    });
  });

  it("settles Philosopher gained Snake Charmer non-Demon targets without leaking target role facts", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(service);
    const beforeEvents = await commandStore.loadDomainEvents(ids.game);
    const beforeState = rebuildOptionalGameState(beforeEvents);
    const target = beforeState?.currentCharacterState?.entries.find((entry) => entry.role.characterType !== "DEMON");
    if (target === undefined) {
      throw new Error("Expected non-Demon target");
    }

    const result = await service.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("snake-charmer-non-demon-no-swap"),
      expectedGameVersion: 10,
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
    expect(result).toMatchObject({ status: "accepted", gameVersion: 11, idempotent: false });
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "SnakeCharmerTargetChosen",
      "SnakeCharmerNoSwapResolved",
      "ScheduledTaskSettled"
    ]);
    expect(result.events.map((event) => event.eventSequence)).toStrictEqual([19, 20, 21]);
    expect(new Set(result.events.map((event) => event.gameVersion))).toStrictEqual(new Set([11]));
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
    expect(state?.firstNightTaskProgress?.settlements.map((settlement) => settlement.outcomeType)).toStrictEqual([
      "PHILOSOPHER_ABILITY_CHOSEN",
      "SNAKE_CHARMER_NON_DEMON_NO_SWAP"
    ]);
    expect(state?.firstNightTaskPlan && state.firstNightTaskProgress
      ? state.firstNightTaskPlan.tasks[state.firstNightTaskProgress.settlements.length]?.taskType
      : undefined).toBe("MINION_INFO");
    expect(state?.currentCharacterState).toStrictEqual(beforeState?.currentCharacterState);
    expect(state?.assignment).toStrictEqual(beforeState?.assignment);

    const minionResult = await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-minion-after-snake-no-swap"),
      expectedGameVersion: 11
    }));
    expectAcceptedResult(minionResult);
    const demonResult = await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-demon-after-snake-no-swap"),
      expectedGameVersion: 12,
      payload: {
        commandType: "SettleFirstNightSystemTask",
        taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system")
      }
    }));
    expectAcceptedResult(demonResult);
  });

  it("settles Snake Charmer Demon targets by swapping current character state and poisoning the old Demon", async () => {
    const { service, commandStore } = makeService();
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(service);
    const beforeEvents = await commandStore.loadDomainEvents(ids.game);
    const beforeState = rebuildOptionalGameState(beforeEvents);
    const sourceBefore = beforeState?.currentCharacterState?.entries.find((entry) => entry.role.roleId === "philosopher");
    const demon = beforeState?.currentCharacterState?.entries.find((entry) => entry.role.characterType === "DEMON");
    if (sourceBefore === undefined || demon === undefined) {
      throw new Error("Expected Philosopher source and Demon target");
    }

    const result = await service.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("snake-charmer-demon-hit-swap"),
      expectedGameVersion: 10,
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
    expect(result).toMatchObject({ status: "accepted", gameVersion: 11, idempotent: false });
    expect(result.events.map((event) => event.eventType)).toStrictEqual([
      "SnakeCharmerTargetChosen",
      "SnakeCharmerDemonSwapApplied",
      "AbilityImpairmentApplied",
      "ScheduledTaskSettled"
    ]);
    expect(result.events.map((event) => event.eventSequence)).toStrictEqual([19, 20, 21, 22]);
    expect(new Set(result.events.map((event) => event.gameVersion))).toStrictEqual(new Set([11]));
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
    expect(afterState?.firstNightTaskProgress?.settlements.map((settlement) => settlement.outcomeType)).toStrictEqual([
      "PHILOSOPHER_ABILITY_CHOSEN",
      "SNAKE_CHARMER_DEMON_HIT_SWAP"
    ]);
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

    const minionResult = await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-minion-after-snake-demon-hit"),
      expectedGameVersion: 11
    }));
    expectAcceptedResult(minionResult);
    const minionInfoEvent = minionResult.events[0];
    if (minionInfoEvent?.eventType !== "MinionInformationDelivered") {
      throw new Error("Expected MINION_INFO delivery after Snake Charmer swap");
    }
    expect(minionInfoEvent.payload.resolvedEvilTeam.characterStateRevision).toBe(2);
    expect(minionInfoEvent.payload.resolvedEvilTeam.demon).toStrictEqual({
      playerId: sourceBefore.playerId,
      seatNumber: sourceBefore.seatNumber
    });
    expect(minionInfoEvent.payload.entries.filter((entry) => entry.kind === "DEMON_IDENTITY").map((entry) => entry.demon)).toStrictEqual([
      { playerId: sourceBefore.playerId, seatNumber: sourceBefore.seatNumber },
      { playerId: sourceBefore.playerId, seatNumber: sourceBefore.seatNumber }
    ]);

    const demonResult = await service.execute(settleFirstNightSystemTaskCommand({
      commandId: commandId("settle-demon-after-snake-demon-hit"),
      expectedGameVersion: 12,
      payload: {
        commandType: "SettleFirstNightSystemTask",
        taskId: scheduledTaskId("first-night-v1:DEMON_INFO:system")
      }
    }));
    expectAcceptedResult(demonResult);
    const demonInfoEvent = demonResult.events[0];
    if (demonInfoEvent?.eventType !== "DemonInformationDelivered") {
      throw new Error("Expected DEMON_INFO delivery after Snake Charmer swap");
    }
    expect(demonInfoEvent.payload.resolvedEvilTeam.characterStateRevision).toBe(2);
    expect(demonInfoEvent.payload.resolvedEvilTeam.demon).toStrictEqual({
      playerId: sourceBefore.playerId,
      seatNumber: sourceBefore.seatNumber
    });
    expect(demonInfoEvent.payload.entries).toHaveLength(2);
    expect(demonInfoEvent.payload.entries.every((entry) => entry.recipientPlayerId === sourceBefore.playerId)).toBe(true);
    expect(demonInfoEvent.payload.entries.some((entry) => entry.recipientPlayerId === demon.playerId)).toBe(false);
  });

  it("enforces Snake Charmer submit actor and payload boundaries", async () => {
    const aiStore = new MemoryCommandCommitStore();
    const { service: aiService } = makeService(aiStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(aiService);
    const aiState = rebuildOptionalGameState(await aiStore.loadDomainEvents(ids.game));
    const sourceOpportunity = aiState?.firstNightActionOpportunities?.opportunities.find((opportunity) =>
      opportunity.opportunityId === philosopherGainedSnakeCharmerOpportunityId
    );
    const nonDemon = aiState?.currentCharacterState?.entries.find((entry) => entry.role.characterType !== "DEMON");
    if (sourceOpportunity === undefined || nonDemon === undefined) {
      throw new Error("Expected Snake Charmer opportunity and non-Demon target");
    }
    await expect(aiService.execute(submitSnakeCharmerActionCommand({
      actor: { kind: "ai", playerId: sourceOpportunity.sourcePlayerId },
      commandId: commandId("source-ai-submit-snake"),
      expectedGameVersion: 10,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: nonDemon.playerId
        }
      }
    }))).resolves.toMatchObject({ status: "accepted", gameVersion: 11 });

    const mismatchStore = new MemoryCommandCommitStore();
    const { service: mismatchService } = makeService(mismatchStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(mismatchService);
    const mismatchCommand = submitSnakeCharmerActionCommand({
      actor: humanActor,
      commandId: commandId("wrong-human-submit-snake"),
      expectedGameVersion: 10
    });
    await expect(mismatchService.execute(mismatchCommand)).resolves.toMatchObject({
      status: "rejected",
      code: "ActorPlayerMismatch",
      currentGameVersion: 10
    });
    expect((await mismatchStore.findCommandReceipt(mismatchCommand.gameId, mismatchCommand.commandId))?.result.status).toBe("rejected");

    const invalidStore = new MemoryCommandCommitStore();
    const { service: invalidService } = makeService(invalidStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(invalidService);
    const extraDecision = submitSnakeCharmerActionCommand({
      commandId: commandId("extra-snake-decision-field"),
      expectedGameVersion: 10,
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
      currentGameVersion: 10
    });

    const unknownTarget = submitSnakeCharmerActionCommand({
      commandId: commandId("unknown-snake-target"),
      expectedGameVersion: 10,
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
      currentGameVersion: 10
    });
  });

  it("rejects missing, wrong, and closed Snake Charmer opportunities deterministically", async () => {
    const missingStore = new MemoryCommandCommitStore();
    const { service: missingService } = makeService(missingStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(missingService);
    await expect(missingService.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("missing-snake-opportunity"),
      expectedGameVersion: 10,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-11:from-snake_charmer:opportunity-01"),
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: playerId("player-ai-1")
        }
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "ActionOpportunityNotFound", currentGameVersion: 10 });

    const wrongTaskStore = new MemoryCommandCommitStore();
    const { service: wrongTaskService } = makeService(wrongTaskStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(wrongTaskService);
    await expect(wrongTaskService.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("wrong-snake-task-id"),
      expectedGameVersion: 10,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: scheduledTaskId("first-night-v1:MINION_INFO:system"),
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: playerId("player-ai-1")
        }
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "ScheduledTaskNotNext", currentGameVersion: 10 });

    const closedStore = new MemoryCommandCommitStore();
    const { service: closedService } = makeService(closedStore);
    await reachOpenPhilosopherGainedSnakeCharmerOpportunity(closedService);
    const closedState = rebuildOptionalGameState(await closedStore.loadDomainEvents(ids.game));
    const nonDemon = closedState?.currentCharacterState?.entries.find((entry) => entry.role.characterType !== "DEMON");
    if (nonDemon === undefined) {
      throw new Error("Expected non-Demon target");
    }
    await closedService.execute(submitSnakeCharmerActionCommand({
      commandId: commandId("close-snake-opportunity"),
      expectedGameVersion: 10,
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
      expectedGameVersion: 11,
      payload: {
        commandType: "SubmitSnakeCharmerAction",
        taskId: philosopherGainedSnakeCharmerTaskId,
        opportunityId: philosopherGainedSnakeCharmerOpportunityId,
        decision: {
          kind: "CHOOSE_PLAYER",
          targetPlayerId: nonDemon.playerId
        }
      }
    }))).resolves.toMatchObject({ status: "rejected", code: "ActionOpportunityAlreadyClosed", currentGameVersion: 11 });
  });

  it("inserts each supported Philosopher gained first-night task deterministically", async () => {
    const cases = [
      ["clockmaker", "CLOCKMAKER_INFORMATION"],
      ["dreamer", "DREAMER_ACTION"],
      ["snake_charmer", "SNAKE_CHARMER_ACTION"],
      ["seamstress", "SEAMSTRESS_ACTION"],
      ["mathematician", "MATHEMATICIAN_INFORMATION"]
    ] as const;

    for (const [chosenRole, taskType] of cases) {
      const store = new MemoryCommandCommitStore();
      const { service } = makeService(store);
      await reachOpenPhilosopherActionOpportunity(service);

      const result = await service.execute(choosePhilosopherRoleCommand(chosenRole, {
        commandId: commandId(`choose-${chosenRole}-insert-task`)
      }));
      const state = rebuildOptionalGameState(await store.loadDomainEvents(ids.game));

      expectAcceptedResult(result);
      expect(state?.firstNightTaskInsertions?.insertions[0]).toMatchObject({
        taskId: `first-night-v1:PHILOSOPHER_GAINED:${taskType}:seat-10:from-${chosenRole}`,
        taskType
      });
    }
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(14);
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
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(11);
  });

  it("does not persist receipts or events when role action opportunity construction throws a DomainError", async () => {
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
      failureStage: "first-night-role-action",
      currentGameVersion: 7,
      retryable: true
    });
    expect(failedResult.message).not.toContain("DomainValidationFailed");
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(11);
  });

  it("does not persist receipts or events when Philosopher DEFER construction throws a DomainError", async () => {
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
      failureStage: "first-night-role-action",
      currentGameVersion: 8,
      retryable: true
    });
    expect(failedResult.message).not.toContain("DomainValidationFailed");
    expect(await commandStore.findCommandReceipt(command.gameId, command.commandId)).toBeUndefined();
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(12);
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
    expect(events).toHaveLength(18);
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
      eventSequence: 12,
      gameVersion: 8,
      eventType: "MinionInformationDelivered"
    });
    expect(result.events[1]).toMatchObject({
      eventSequence: 13,
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
    expect(events).toHaveLength(13);
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
    expect(events).toHaveLength(15);
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(13);
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
    expect(await noPhilosopherStore.loadDomainEvents(earlyDemon.gameId)).toHaveLength(11);

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
    expect(await commandStore.loadDomainEvents(roleCommand.gameId)).toHaveLength(11);
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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);

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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);

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
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(11);
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
