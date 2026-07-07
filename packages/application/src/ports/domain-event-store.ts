import type { AnyDomainEventEnvelope, DomainEventBatch, GameId } from "@botc/domain-core";

export type DomainEventStore = {
  readonly loadDomainEvents: (gameId: GameId) => Promise<readonly AnyDomainEventEnvelope[]>;
  readonly appendDomainEventBatch: (
    expectedGameVersion: number,
    batch: DomainEventBatch
  ) => Promise<void>;
};
