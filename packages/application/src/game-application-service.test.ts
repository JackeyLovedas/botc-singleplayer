import { describe, expect, it } from "vitest";
import {
  RULES_BASELINE_VERSION,
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
  FirstNightTaskCatalogSnapshot,
  FirstNightTaskPlan,
  FirstNightTaskPlanningFailure,
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
  otherGameId,
  planFirstNightTasksCommand,
  scriptSelectedEvent,
  selectScriptCommand,
  storytellerActor,
  testAssignmentGenerator,
  testFirstNightTaskCatalog,
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
  firstNightTaskCatalogSnapshot: FirstNightTaskCatalogSnapshot = testFirstNightTaskCatalog
) => {
  const service = new GameApplicationService({
    commandStore,
    ids: idGenerator,
    clock,
    setupGenerator,
    characterAssignmentGenerator,
    initialPrivateKnowledgeBuilder,
    firstNightTaskPlanner,
    firstNightTaskCatalogSnapshot
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
