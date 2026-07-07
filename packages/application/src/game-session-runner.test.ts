import { describe, expect, it } from "vitest";
import { gameId } from "@botc/domain-core";
import { GameSessionRunner } from "@botc/application";

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

describe("GameSessionRunner", () => {
  it("serializes commands for the same game", async () => {
    const runner = new GameSessionRunner();
    const order: number[] = [];
    const game = gameId("same-game");

    await Promise.all([
      runner.enqueue(game, async () => {
        await delay(20);
        order.push(1);
      }),
      runner.enqueue(game, () => {
        order.push(2);
        return Promise.resolve();
      })
    ]);

    expect(order).toStrictEqual([1, 2]);
  });

  it("does not share state between different games", async () => {
    const runner = new GameSessionRunner();
    const order: string[] = [];

    await Promise.all([
      runner.enqueue(gameId("game-a"), async () => {
        await delay(20);
        order.push("a");
      }),
      runner.enqueue(gameId("game-b"), () => {
        order.push("b");
        return Promise.resolve();
      })
    ]);

    expect(order).toStrictEqual(["b", "a"]);
  });

  it("continues processing after a command throws", async () => {
    const runner = new GameSessionRunner();
    const game = gameId("recovering-game");

    await expect(
      runner.enqueue(game, () => Promise.reject(new Error("boom")))
    ).rejects.toThrow("boom");

    await expect(runner.enqueue(game, () => Promise.resolve("next"))).resolves.toBe("next");
  });
});
