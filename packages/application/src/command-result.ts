import type { AnyDomainEventEnvelope, GameId, SetupGenerationFailure } from "@botc/domain-core";

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
  | "UnsupportedCommand"
  | "DomainValidationFailed"
  | "EventStoreAppendFailed";

export type CommandAccepted = {
  readonly status: "accepted";
  readonly gameId: GameId;
  readonly gameVersion: number;
  readonly events: readonly AnyDomainEventEnvelope[];
  readonly idempotent: boolean;
};

export type CommandRejectionDetails =
  | {
      readonly kind: "setup-generation";
      readonly failure: SetupGenerationFailure;
    };

export type CommandRejected = {
  readonly status: "rejected";
  readonly gameId: GameId;
  readonly code: CommandRejectionCode;
  readonly message: string;
  readonly currentGameVersion: number;
  readonly idempotent: boolean;
  readonly details?: CommandRejectionDetails;
};

export type CommandResult = CommandAccepted | CommandRejected;

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

export const rejected = (
  gameId: GameId,
  code: CommandRejectionCode,
  message: string,
  currentGameVersion: number,
  idempotent = false,
  details: CommandRejectionDetails | undefined = undefined
): CommandRejected => ({
  status: "rejected",
  gameId,
  code,
  message,
  currentGameVersion,
  idempotent,
  ...(details === undefined ? {} : { details })
});

export const markIdempotent = (result: CommandResult): CommandResult => {
  if (result.status === "accepted") {
    return { ...result, idempotent: true };
  }

  return { ...result, idempotent: true };
};
