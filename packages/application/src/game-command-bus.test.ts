import { describe, expect, it } from "vitest";
import { commandId, correlationId } from "@botc/domain-core";
import { GameApplicationService, GameCommandBus } from "@botc/application";
import type { CommandResult } from "@botc/application";
import type { SupportedCommandEnvelope } from "@botc/domain-core";
import {
  FixedClock,
  FixedIdGenerator,
  MemoryCommandCommitStore,
  createGameCommand,
  ids,
  otherGameId,
  selectScriptCommand
} from "@botc/test-harness";

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const makeBus = (commandStore = new MemoryCommandCommitStore()) => {
  const service = new GameApplicationService({
    commandStore,
    ids: new FixedIdGenerator(),
    clock: new FixedClock()
  });
  const bus = new GameCommandBus(service);

  return { bus, commandStore };
};

class RecordingService extends GameApplicationService {
  public readonly order: string[] = [];

  public constructor(private readonly delayFirstCommand = false) {
    super({
      commandStore: new MemoryCommandCommitStore(),
      ids: new FixedIdGenerator(),
      clock: new FixedClock()
    });
  }

  public override async execute(command: SupportedCommandEnvelope): Promise<CommandResult> {
    if (this.delayFirstCommand && command.commandId === commandId("slow-command")) {
      await delay(20);
    }

    this.order.push(`${command.gameId}:${command.commandId}`);

    if (command.commandId === commandId("throwing-command")) {
      throw new Error("injected command failure");
    }

    return {
      status: "rejected",
      gameId: command.gameId,
      code: "UnsupportedCommand",
      message: "recording service does not execute domain commands",
      currentGameVersion: command.expectedGameVersion,
      idempotent: false
    };
  }
}

describe("GameCommandBus", () => {
  it("serializes concurrent commands for the same game in enqueue order", async () => {
    const service = new RecordingService(true);
    const bus = new GameCommandBus(service);
    const slow = createGameCommand({ commandId: commandId("slow-command") });
    const fast = createGameCommand({ commandId: commandId("fast-command") });

    await Promise.all([bus.execute(slow), bus.execute(fast)]);

    expect(service.order).toStrictEqual([
      `${ids.game}:slow-command`,
      `${ids.game}:fast-command`
    ]);
  });

  it("allows different games to execute independently", async () => {
    const service = new RecordingService(true);
    const bus = new GameCommandBus(service);
    const slow = createGameCommand({ commandId: commandId("slow-command"), gameId: ids.game });
    const other = createGameCommand({
      commandId: commandId("other-game-command"),
      gameId: otherGameId(),
      correlationId: correlationId("other-game-correlation")
    });

    await Promise.all([bus.execute(slow), bus.execute(other)]);

    expect(service.order[0]).toBe(`${other.gameId}:other-game-command`);
    expect(service.order[1]).toBe(`${ids.game}:slow-command`);
  });

  it("continues processing after one command throws", async () => {
    const service = new RecordingService();
    const bus = new GameCommandBus(service);
    const throwing = createGameCommand({ commandId: commandId("throwing-command") });
    const next = createGameCommand({ commandId: commandId("next-command") });

    await expect(bus.execute(throwing)).rejects.toThrow("injected command failure");
    await expect(bus.execute(next)).resolves.toMatchObject({ gameId: ids.game });

    expect(service.order).toStrictEqual([
      `${ids.game}:throwing-command`,
      `${ids.game}:next-command`
    ]);
  });

  it("preserves command idempotency through the bus", async () => {
    const { bus, commandStore } = makeBus();
    const command = createGameCommand();

    const first = await bus.execute(command);
    const second = await bus.execute(command);

    expect(first).toMatchObject({ status: "accepted", idempotent: false });
    expect(second).toMatchObject({ status: "accepted", idempotent: true });
    expect(await commandStore.loadDomainEvents(command.gameId)).toHaveLength(1);
  });

  it("rejects stale expectedGameVersion according to serialized execution order", async () => {
    const { bus, commandStore } = makeBus();
    const create = createGameCommand();
    const stale = createGameCommand({ commandId: commandId("stale-command") });

    const [created, staleResult] = await Promise.all([bus.execute(create), bus.execute(stale)]);

    expect(created.status).toBe("accepted");
    expect(staleResult).toMatchObject({ status: "rejected", code: "ExpectedGameVersionMismatch" });
    expect(await commandStore.loadDomainEvents(ids.game)).toHaveLength(1);
    expect(commandStore.rejectedCount).toBe(1);
  });

  it("does not require production callers to manage GameSessionRunner directly", async () => {
    const { bus } = makeBus();

    await bus.execute(createGameCommand());
    const result = await bus.execute(selectScriptCommand());

    expect(result).toMatchObject({ status: "accepted", gameVersion: 2 });
  });
});
