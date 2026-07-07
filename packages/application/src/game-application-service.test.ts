import { describe, expect, it } from "vitest";
import { commandId, correlationId, rebuildOptionalGameState } from "@botc/domain-core";
import { GameApplicationService } from "@botc/application";
import {
  FixedClock,
  FixedIdGenerator,
  MemoryCommandReceiptStore,
  MemoryDomainEventStore,
  createGameCommand,
  selectScriptCommand
} from "@botc/test-harness";

const makeService = () => {
  const domainEventStore = new MemoryDomainEventStore();
  const commandReceiptStore = new MemoryCommandReceiptStore();
  const service = new GameApplicationService({
    domainEventStore,
    commandReceiptStore,
    ids: new FixedIdGenerator(),
    clock: new FixedClock()
  });

  return { service, domainEventStore, commandReceiptStore };
};

describe("GameApplicationService", () => {
  it("creates a game with one atomic domain event batch", async () => {
    const { service, domainEventStore } = makeService();

    const result = await service.execute(createGameCommand());
    const events = await domainEventStore.loadDomainEvents(createGameCommand().gameId);

    expect(result.status).toBe("accepted");
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe("GameCreated");
  });

  it("increments gameVersion once for one committed batch", async () => {
    const { service, domainEventStore } = makeService();

    await service.execute(createGameCommand());
    const state = rebuildOptionalGameState(await domainEventStore.loadDomainEvents(createGameCommand().gameId));

    expect(state?.gameVersion).toBe(1);
  });

  it("does not settle duplicate commandId twice", async () => {
    const { service, domainEventStore, commandReceiptStore } = makeService();

    const first = await service.execute(createGameCommand());
    const second = await service.execute(createGameCommand());
    const events = await domainEventStore.loadDomainEvents(createGameCommand().gameId);

    expect(first.status).toBe("accepted");
    expect(second.status).toBe("accepted");
    expect(second.idempotent).toBe(true);
    expect(events).toHaveLength(1);
    expect(commandReceiptStore.acceptedCount).toBe(1);
  });

  it("rejects expectedGameVersion mismatch without appending events", async () => {
    const { service, domainEventStore, commandReceiptStore } = makeService();

    const result = await service.execute(createGameCommand({ expectedGameVersion: 5 }));
    const events = await domainEventStore.loadDomainEvents(createGameCommand().gameId);

    expect(result).toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch" });
    expect(events).toHaveLength(0);
    expect(commandReceiptStore.rejectedCount).toBe(1);
  });

  it("records rejected commands without changing canonical state", async () => {
    const { service, domainEventStore, commandReceiptStore } = makeService();

    const result = await service.execute(
      createGameCommand({
        payload: {
          ...createGameCommand().payload,
          playerCount: 10
        }
      })
    );

    expect(result).toMatchObject({ status: "rejected", code: "InvalidCreateGameCounts" });
    expect(await domainEventStore.loadDomainEvents(createGameCommand().gameId)).toHaveLength(0);
    expect(commandReceiptStore.rejectedCount).toBe(1);
  });

  it("rejects SelectScript when the game does not exist", async () => {
    const { service, domainEventStore } = makeService();

    const result = await service.execute(selectScriptCommand({ expectedGameVersion: 0 }));

    expect(result).toMatchObject({ status: "rejected", code: "GameNotCreated" });
    expect(await domainEventStore.loadDomainEvents(selectScriptCommand().gameId)).toHaveLength(0);
  });

  it("selects script after game creation", async () => {
    const { service, domainEventStore } = makeService();

    await service.execute(createGameCommand());
    const result = await service.execute(selectScriptCommand());
    const state = rebuildOptionalGameState(await domainEventStore.loadDomainEvents(createGameCommand().gameId));

    expect(result.status).toBe("accepted");
    expect(state?.selectedScript).toMatchObject({ scriptId: "sects-and-violets" });
    expect(state?.gameVersion).toBe(2);
  });

  it("does not record successful receipt when event storage fails", async () => {
    const { service, domainEventStore, commandReceiptStore } = makeService();
    domainEventStore.failNextAppend = true;

    const result = await service.execute(createGameCommand());

    expect(result).toMatchObject({ status: "rejected", code: "EventStoreAppendFailed" });
    expect(commandReceiptStore.acceptedCount).toBe(0);
    expect(commandReceiptStore.rejectedCount).toBe(0);
  });

  it("returns the same rejected result for duplicate rejected commandId", async () => {
    const { service, commandReceiptStore } = makeService();
    const command = createGameCommand({
      commandId: commandId("bad-command"),
      correlationId: correlationId("bad-correlation"),
      expectedGameVersion: 7
    });

    const first = await service.execute(command);
    const second = await service.execute(command);

    expect(first).toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch", idempotent: false });
    expect(second).toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch", idempotent: true });
    expect(commandReceiptStore.rejectedCount).toBe(1);
  });
});
