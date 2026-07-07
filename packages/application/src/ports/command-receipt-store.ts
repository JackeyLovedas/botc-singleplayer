import type { CommandId, GameId } from "@botc/domain-core";
import type { CommandResult } from "../command-result.js";

export type CommandReceipt = {
  readonly commandId: CommandId;
  readonly gameId: GameId;
  readonly result: CommandResult;
};

export type CommandReceiptStore = {
  readonly find: (commandId: CommandId) => Promise<CommandReceipt | undefined>;
  readonly recordAccepted: (receipt: CommandReceipt) => Promise<void>;
  readonly recordRejected: (receipt: CommandReceipt) => Promise<void>;
};
