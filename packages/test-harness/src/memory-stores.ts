import type {
  CommandId,
  DomainEventBatch,
  AnyDomainEventEnvelope,
  GameId
} from "@botc/domain-core";
import type {
  CommandReceipt,
  CommandReceiptStore,
  DomainEventStore
} from "@botc/application";

export class MemoryDomainEventStore implements DomainEventStore {
  private readonly events = new Map<GameId, AnyDomainEventEnvelope[]>();
  public failNextAppend = false;

  public loadDomainEvents(gameId: GameId): Promise<readonly AnyDomainEventEnvelope[]> {
    return Promise.resolve([...(this.events.get(gameId) ?? [])]);
  }

  public appendDomainEventBatch(expectedGameVersion: number, batch: DomainEventBatch): Promise<void> {
    if (this.failNextAppend) {
      this.failNextAppend = false;
      return Promise.reject(new Error("Injected append failure"));
    }

    const existing = this.events.get(batch.gameId) ?? [];
    const currentVersion = existing.at(-1)?.gameVersion ?? 0;
    if (currentVersion !== expectedGameVersion) {
      throw new Error(`Expected version ${expectedGameVersion} but current version is ${currentVersion}`);
    }

    this.events.set(batch.gameId, [...existing, ...batch.events]);
    return Promise.resolve();
  }
}

export class MemoryCommandReceiptStore implements CommandReceiptStore {
  private readonly receipts = new Map<CommandId, CommandReceipt>();
  public acceptedCount = 0;
  public rejectedCount = 0;

  public find(commandId: CommandId): Promise<CommandReceipt | undefined> {
    return Promise.resolve(this.receipts.get(commandId));
  }

  public recordAccepted(receipt: CommandReceipt): Promise<void> {
    this.acceptedCount += 1;
    this.receipts.set(receipt.commandId, receipt);
    return Promise.resolve();
  }

  public recordRejected(receipt: CommandReceipt): Promise<void> {
    this.rejectedCount += 1;
    this.receipts.set(receipt.commandId, receipt);
    return Promise.resolve();
  }
}
