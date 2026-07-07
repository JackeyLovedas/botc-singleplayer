export type DomainErrorCode =
  | "EmptyEventStream"
  | "EventGameMismatch"
  | "EventSequenceJump"
  | "DuplicateGameCreated"
  | "MissingGameCreated"
  | "UnsupportedEventVersion"
  | "InvalidPlayerCounts"
  | "InvalidGameCreatedPayload";

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
