import type { AnyDomainEventEnvelope, CommandId, DomainEventBatch, GameId } from "@botc/domain-core";
import type { CommandAccepted, CommandReceiptResult, CommandRejected } from "../command-result.js";
import type { CommandFingerprint } from "../command-fingerprint.js";

export type LegacyCommandReceipt = {
  readonly commandId: CommandId;
  readonly gameId: GameId;
  readonly result: CommandReceiptResult;
  readonly commandFingerprint?: never;
};

export type FingerprintedCommandReceipt<
  TResult extends CommandReceiptResult = CommandReceiptResult
> = {
  readonly commandId: CommandId;
  readonly gameId: GameId;
  readonly commandFingerprint: CommandFingerprint;
  readonly result: TResult;
};

export type CommandReceipt = LegacyCommandReceipt | FingerprintedCommandReceipt;

export type CommitAcceptedCommandInput = {
  readonly expectedGameVersion: number;
  readonly eventBatch: DomainEventBatch;
  readonly receipt: FingerprintedCommandReceipt<CommandAccepted>;
};

export type RecordRejectedCommandInput = {
  readonly gameId: GameId;
  readonly commandId: CommandId;
  readonly receipt: FingerprintedCommandReceipt<CommandRejected>;
};

export type CommandCommitStore = {
  readonly loadDomainEvents: (gameId: GameId) => Promise<readonly AnyDomainEventEnvelope[]>;
  readonly findCommandReceipt: (gameId: GameId, commandId: CommandId) => Promise<CommandReceipt | undefined>;
  readonly commitAcceptedCommand: (input: CommitAcceptedCommandInput) => Promise<void>;
  readonly recordRejectedCommand: (input: RecordRejectedCommandInput) => Promise<void>;
};
