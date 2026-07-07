import type { BatchId, CommandId, GameId } from "./ids.js";
import type { AnyDomainEventEnvelope } from "./events.js";

export type DomainEventBatch = {
  readonly batchId: BatchId;
  readonly gameId: GameId;
  readonly commandId: CommandId;
  readonly expectedGameVersion: number;
  readonly committedGameVersion: number;
  readonly events: readonly AnyDomainEventEnvelope[];
};
