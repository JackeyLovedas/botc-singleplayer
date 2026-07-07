import type { AnyDomainEventEnvelope, AssignmentGenerationFailure, GameId, SetupGenerationFailure } from "@botc/domain-core";

export type CommandRejectionCode =
  | "ExpectedGameVersionMismatch"
  | "InvalidCreateGameCounts"
  | "UnsupportedRulesBaseline"
  | "ActorNotAllowed"
  | "GameAlreadyCreated"
  | "GameNotCreated"
  | "CommandNotAllowedInPhase"
  | "ScriptNotSelected"
  | "ScriptAlreadySelected"
  | "UnsupportedScript"
  | "SetupAlreadyGenerated"
  | "SetupGenerationFailed"
  | "SetupNotGenerated"
  | "PlayerRosterAlreadyCreated"
  | "PlayerRosterNotCreated"
  | "InvalidPlayerRoster"
  | "ActorPlayerMismatch"
  | "CharacterAssignmentAlreadyCreated"
  | "AssignmentGenerationFailed"
  | "UnsupportedCommand"
  | "DomainValidationFailed"
  | "EventStoreAppendFailed";

export type SetupGenerationRejectionCode = "SetupGenerationFailed";
export type AssignmentGenerationRejectionCode = "AssignmentGenerationFailed";
export type StructuredCommandRejectionCode = SetupGenerationRejectionCode | AssignmentGenerationRejectionCode;
export type GeneralCommandRejectionCode = Exclude<CommandRejectionCode, StructuredCommandRejectionCode>;

export type CommandAccepted = {
  readonly status: "accepted";
  readonly gameId: GameId;
  readonly gameVersion: number;
  readonly events: readonly AnyDomainEventEnvelope[];
  readonly idempotent: boolean;
};

export type SetupGenerationRejectionDetails = {
  readonly kind: "setup-generation";
  readonly failure: SetupGenerationFailure;
};

export type AssignmentGenerationRejectionDetails = {
  readonly kind: "assignment-generation";
  readonly failure: AssignmentGenerationFailure;
};

export type CommandRejectionDetails = SetupGenerationRejectionDetails | AssignmentGenerationRejectionDetails;

export type SetupGenerationCommandRejected = {
  readonly status: "rejected";
  readonly gameId: GameId;
  readonly code: SetupGenerationRejectionCode;
  readonly message: string;
  readonly currentGameVersion: number;
  readonly idempotent: boolean;
  readonly details: SetupGenerationRejectionDetails;
};

export type AssignmentGenerationCommandRejected = {
  readonly status: "rejected";
  readonly gameId: GameId;
  readonly code: AssignmentGenerationRejectionCode;
  readonly message: string;
  readonly currentGameVersion: number;
  readonly idempotent: boolean;
  readonly details: AssignmentGenerationRejectionDetails;
};

export type GeneralCommandRejected = {
  readonly status: "rejected";
  readonly gameId: GameId;
  readonly code: GeneralCommandRejectionCode;
  readonly message: string;
  readonly currentGameVersion: number;
  readonly idempotent: boolean;
  readonly details?: never;
};

export type CommandRejected = SetupGenerationCommandRejected | AssignmentGenerationCommandRejected | GeneralCommandRejected;

export type CommandExecutionFailureCode =
  | "ApplicationNotConfigured"
  | "DependencyExecutionFailed"
  | "EventStoreAppendFailed";

export type CommandExecutionFailed = {
  readonly status: "failed";
  readonly gameId: GameId;
  readonly code: CommandExecutionFailureCode;
  readonly message: string;
  readonly currentGameVersion: number;
  readonly retryable: true;
};

export type CommandReceiptResult = CommandAccepted | CommandRejected;
export type CommandResult = CommandReceiptResult | CommandExecutionFailed;

export const accepted = (
  gameId: GameId,
  gameVersion: number,
  events: readonly AnyDomainEventEnvelope[],
  idempotent = false
): CommandAccepted => ({
  status: "accepted",
  gameId,
  gameVersion,
  events,
  idempotent
});

export const failed = (
  gameId: GameId,
  code: CommandExecutionFailureCode,
  message: string,
  currentGameVersion: number
): CommandExecutionFailed => ({
  status: "failed",
  gameId,
  code,
  message,
  currentGameVersion,
  retryable: true
});

export function rejected(
  gameId: GameId,
  code: SetupGenerationRejectionCode,
  message: string,
  currentGameVersion: number,
  idempotent: boolean,
  details: SetupGenerationRejectionDetails
): SetupGenerationCommandRejected;
export function rejected(
  gameId: GameId,
  code: AssignmentGenerationRejectionCode,
  message: string,
  currentGameVersion: number,
  idempotent: boolean,
  details: AssignmentGenerationRejectionDetails
): AssignmentGenerationCommandRejected;
export function rejected(
  gameId: GameId,
  code: GeneralCommandRejectionCode,
  message: string,
  currentGameVersion: number,
  idempotent?: boolean
): GeneralCommandRejected;
export function rejected(
  gameId: GameId,
  code: CommandRejectionCode,
  message: string,
  currentGameVersion: number,
  idempotent = false,
  details: CommandRejectionDetails | undefined = undefined
): CommandRejected {
  if (code === "SetupGenerationFailed") {
    if (details === undefined || details.kind !== "setup-generation") {
      throw new Error(`${code} requires structured rejection details`);
    }

    return {
      status: "rejected",
      gameId,
      code,
      message,
      currentGameVersion,
      idempotent,
      details
    };
  }

  if (code === "AssignmentGenerationFailed") {
    if (details === undefined || details.kind !== "assignment-generation") {
      throw new Error(`${code} requires structured rejection details`);
    }

    return {
      status: "rejected",
      gameId,
      code,
      message,
      currentGameVersion,
      idempotent,
      details
    };
  }

  return {
    status: "rejected",
    gameId,
    code,
    message,
    currentGameVersion,
    idempotent
  };
}

export const markIdempotent = (result: CommandResult): CommandResult => {
  if (result.status === "failed") {
    return result;
  }

  if (result.status === "accepted") {
    return { ...result, idempotent: true };
  }

  return { ...result, idempotent: true };
};
