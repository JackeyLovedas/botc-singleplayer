export type DomainErrorCode =
  | "EmptyEventStream"
  | "EventGameMismatch"
  | "EventSequenceJump"
  | "EventGameVersionMismatch"
  | "EventBatchMismatch"
  | "EventCommandMismatch"
  | "EventRulesBaselineMismatch"
  | "DuplicateEventId"
  | "DuplicateCommandBatch"
  | "NonContiguousBatch"
  | "DuplicateGameCreated"
  | "MissingGameCreated"
  | "UnsupportedEventVersion"
  | "InvalidPlayerCounts"
  | "InvalidGameCreatedPayload"
  | "InvalidScriptSelectedPayload"
  | "InvalidPhaseTransition"
  | "InvalidPhaseCounter";

export class DomainError extends Error {
  public constructor(
    public readonly code: DomainErrorCode,
    message: string
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export const assertNever = (_value: never): never => {
  void _value;
  throw new DomainError("UnsupportedEventVersion", "Unexpected value");
};
