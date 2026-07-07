import type { AnyDomainEventEnvelope, CommandId, DomainEventBatch, GameId } from "@botc/domain-core";
import type { CommandReceiptResult } from "../command-result.js";

export type CommandReceipt = {
  readonly commandId: CommandId;
  readonly gameId: GameId;
  readonly result: CommandReceiptResult;
};

export type CommitAcceptedCommandInput = {
  readonly expectedGameVersion: number;
  readonly eventBatch: DomainEventBatch;
  readonly receipt: CommandReceipt;
};

export type RecordRejectedCommandInput = {
  readonly gameId: GameId;
  readonly commandId: CommandId;
  readonly receipt: CommandReceipt;
};

export type CommandCommitStore = {
  readonly loadDomainEvents: (gameId: GameId) => Promise<readonly AnyDomainEventEnvelope[]>;
  readonly findCommandReceipt: (gameId: GameId, commandId: CommandId) => Promise<CommandReceipt | undefined>;
  readonly commitAcceptedCommand: (input: CommitAcceptedCommandInput) => Promise<void>;
  readonly recordRejectedCommand: (input: RecordRejectedCommandInput) => Promise<void>;
};
