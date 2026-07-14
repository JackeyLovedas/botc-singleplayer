import {
  rebuildGameState,
  rebuildOptionalCompleteAcceptedGameState,
  validateDomainBatchSemantics,
  validateDomainEventStream
} from "@botc/domain-core";
import type {
  AnyDomainEventEnvelope,
  CommandId,
  GameId
} from "@botc/domain-core";
import type {
  CommandCommitStore,
  CommandReceipt,
  CommitAcceptedCommandInput,
  RecordRejectedCommandInput
} from "@botc/application";
import { validateCommandFingerprint } from "@botc/application";

const compositeCommandKey = (gameId: GameId, commandId: CommandId): string => `${gameId}\u0000${commandId}`;

export class MemoryCommandCommitStore implements CommandCommitStore {
  private readonly events = new Map<GameId, AnyDomainEventEnvelope[]>();
  private readonly receipts = new Map<string, CommandReceipt>();
  private readonly gameVersions = new Map<GameId, number>();

  public failBeforeCommit = false;
  public failDuringCommit = false;
  public failReceiptRead = false;
  public failEventLoad = false;
  public failRejectedReceiptWrite = false;
  public acceptedCount = 0;
  public rejectedCount = 0;

  public loadDomainEvents(gameId: GameId): Promise<readonly AnyDomainEventEnvelope[]> {
    if (this.failEventLoad) {
      this.failEventLoad = false;
      return Promise.reject(new Error("Injected domain event load failure"));
    }

    return Promise.resolve([...(this.events.get(gameId) ?? [])]);
  }

  public findCommandReceipt(gameId: GameId, commandId: CommandId): Promise<CommandReceipt | undefined> {
    if (this.failReceiptRead) {
      this.failReceiptRead = false;
      return Promise.reject(new Error("Injected command receipt read failure"));
    }

    return Promise.resolve(this.receipts.get(compositeCommandKey(gameId, commandId)));
  }

  public commitAcceptedCommand(input: CommitAcceptedCommandInput): Promise<void> {
    if (this.failBeforeCommit) {
      this.failBeforeCommit = false;
      return Promise.reject(new Error("Injected failure before commit"));
    }

    try {
      this.validateAcceptedInput(input);
      const existing = this.events.get(input.eventBatch.gameId) ?? [];
      validateDomainBatchSemantics(rebuildOptionalCompleteAcceptedGameState(existing), input.eventBatch.events);
      const stagedEvents = [...existing, ...input.eventBatch.events];
      validateDomainEventStream(stagedEvents);
      rebuildGameState(stagedEvents);

      if (this.failDuringCommit) {
        this.failDuringCommit = false;
        return Promise.reject(new Error("Injected failure during commit"));
      }

      this.events.set(input.eventBatch.gameId, stagedEvents);
      this.receipts.set(compositeCommandKey(input.receipt.gameId, input.receipt.commandId), input.receipt);
      this.gameVersions.set(input.eventBatch.gameId, input.eventBatch.committedGameVersion);
      this.acceptedCount += 1;
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error instanceof Error ? error : new Error("Unknown commit failure"));
    }
  }

  public recordRejectedCommand(input: RecordRejectedCommandInput): Promise<void> {
    if (this.failRejectedReceiptWrite) {
      this.failRejectedReceiptWrite = false;
      return Promise.reject(new Error("Injected rejected receipt write failure"));
    }

    if (input.receipt.gameId !== input.gameId || input.receipt.commandId !== input.commandId) {
      return Promise.reject(new Error("Rejected receipt key must match recordRejectedCommand input"));
    }

    if (input.receipt.result.status !== "rejected") {
      return Promise.reject(new Error("recordRejectedCommand requires a rejected command result"));
    }

    if (!validateCommandFingerprint(input.receipt.commandFingerprint)) {
      return Promise.reject(new Error("Rejected receipt requires a valid command fingerprint"));
    }

    const key = compositeCommandKey(input.gameId, input.commandId);
    const existing = this.receipts.get(key);
    if (existing !== undefined) {
      return Promise.reject(new Error("Cannot overwrite an existing command receipt"));
    }

    this.receipts.set(key, input.receipt);
    this.rejectedCount += 1;
    return Promise.resolve();
  }

  public getGameVersion(gameId: GameId): number {
    return this.gameVersions.get(gameId) ?? 0;
  }

  public getReceiptCount(): number {
    return this.receipts.size;
  }

  private validateAcceptedInput(input: CommitAcceptedCommandInput): void {
    const { eventBatch, expectedGameVersion, receipt } = input;

    if (receipt.result.status !== "accepted") {
      throw new Error("commitAcceptedCommand requires an accepted command result");
    }

    if (!validateCommandFingerprint(receipt.commandFingerprint)) {
      throw new Error("Accepted receipt requires a valid command fingerprint");
    }

    if (receipt.gameId !== eventBatch.gameId || receipt.commandId !== eventBatch.commandId) {
      throw new Error("Accepted receipt key must match event batch key");
    }

    if (receipt.result.gameId !== eventBatch.gameId || receipt.result.gameVersion !== eventBatch.committedGameVersion) {
      throw new Error("Accepted receipt result must match committed batch");
    }

    if (eventBatch.expectedGameVersion !== expectedGameVersion) {
      throw new Error("Batch expectedGameVersion must match commit input");
    }

    if (eventBatch.committedGameVersion !== expectedGameVersion + 1) {
      throw new Error("Batch committedGameVersion must be expectedGameVersion + 1");
    }

    if (eventBatch.events.length === 0) {
      throw new Error("Domain event batch must not be empty");
    }

    if (receipt.result.eventDisclosure === "EVENT_TYPES_ONLY") {
      const exactKeys = ["eventCount", "eventDisclosure", "eventTypes", "gameId", "gameVersion", "idempotent", "resultSchemaVersion", "status"];
      const actualKeys = Object.keys(receipt.result).sort();
      if (actualKeys.length !== exactKeys.length || actualKeys.some((key, index) => key !== exactKeys[index]) ||
          Object.hasOwn(receipt.result, "events") || receipt.result.eventCount !== eventBatch.events.length ||
          !Array.isArray(receipt.result.eventTypes) || receipt.result.eventTypes.length !== eventBatch.events.length) {
        throw new Error("Accepted event summary must have the exact redacted shape");
      }
      for (let index = 0; index < receipt.result.eventTypes.length; index += 1) {
        if (!Object.hasOwn(receipt.result.eventTypes, index) || receipt.result.eventTypes[index] !== eventBatch.events[index]?.eventType) {
          throw new Error("Accepted event summary must exactly match the canonical event batch");
        }
      }
    }

    const existingEvents = this.events.get(eventBatch.gameId) ?? [];
    const currentGameVersion = this.gameVersions.get(eventBatch.gameId) ?? existingEvents.at(-1)?.gameVersion ?? 0;
    if (currentGameVersion !== expectedGameVersion) {
      throw new Error(`Expected version ${expectedGameVersion} but current version is ${currentGameVersion}`);
    }

    if (this.receipts.has(compositeCommandKey(eventBatch.gameId, eventBatch.commandId))) {
      throw new Error("Command has already been committed for this game");
    }

    if (existingEvents.some((event) => event.commandId === eventBatch.commandId)) {
      throw new Error("Command id already has a successful batch for this game");
    }

    const currentLastSequence = existingEvents.at(-1)?.eventSequence ?? 0;
    eventBatch.events.forEach((event, index) => {
      if (event.gameId !== eventBatch.gameId) {
        throw new Error("Batch gameId must match every event");
      }

      if (event.commandId !== eventBatch.commandId) {
        throw new Error("Batch commandId must match every event");
      }

      if (event.batchId !== eventBatch.batchId) {
        throw new Error("Batch batchId must match every event");
      }

      if (event.gameVersion !== eventBatch.committedGameVersion) {
        throw new Error("Every event gameVersion must match committedGameVersion");
      }

      if (event.eventSequence !== currentLastSequence + index + 1) {
        throw new Error("Batch event sequences must continue from the current stream");
      }
    });
  }
}
