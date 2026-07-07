import type { GameId } from "@botc/domain-core";

export class GameSessionRunner {
  private readonly queues = new Map<GameId, Promise<void>>();

  public enqueue<TResult>(gameId: GameId, task: () => Promise<TResult>): Promise<TResult> {
    const previous = this.queues.get(gameId) ?? Promise.resolve();

    const runAfterPrevious = previous.catch(() => undefined).then(task);
    const tracked = runAfterPrevious.then(
      () => undefined,
      () => undefined
    );

    this.queues.set(gameId, tracked);

    return runAfterPrevious.finally(() => {
      if (this.queues.get(gameId) === tracked) {
        this.queues.delete(gameId);
      }
    });
  }
}
