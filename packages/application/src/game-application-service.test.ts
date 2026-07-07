import { describe, expect, it } from "vitest";
import {
  RULES_BASELINE_VERSION,
  batchId,
  commandId,
  correlationId,
  rebuildOptionalGameState,
  roleId
} from "@botc/domain-core";
import type { AnyDomainEventEnvelope, GameId } from "@botc/domain-core";
import { GameApplicationService, accepted } from "@botc/application";
import type { CommandAccepted, CommandResult, SetupGeneratorPort } from "@botc/application";
import {
  FixedClock,
  FixedIdGenerator,
  MemoryCommandCommitStore,
  aiActor,
  createGameCommand,
  generateSetupCommand,
  humanActor,
  ids,
  otherGameId,
  scriptSelectedEvent,
  selectScriptCommand,
  storytellerActor,
  testSetupGenerator,
  systemActor
} from "@botc/test-harness";

const makeService = (commandStore = new MemoryCommandCommitStore(), setupGenerator: SetupGeneratorPort = testSetupGenerator) => {
  const service = new GameApplicationService({
    commandStore,
    ids: new FixedIdGenerator(),
    clock: new FixedClock(),
    setupGenerator
  });

  return { service, commandStore };
};

const expectAcceptedResult: (result: CommandResult) => asserts result is CommandAccepted = (result) => {
  expect(result.status).toBe("accepted");
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

  it("leaves no partial writes when atomic accepted commit fails before commit", async () => {
    const { service, commandStore } = makeService();
    commandStore.failBeforeCommit = true;

    const result = await service.execute(createGameCommand());

    expect(result).toMatchObject({ status: "rejected", code: "EventStoreAppendFailed" });
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

    expect(failed).toMatchObject({ status: "rejected", code: "EventStoreAppendFailed" });
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

    expect(failed).toMatchObject({ status: "rejected", code: "EventStoreAppendFailed" });
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
