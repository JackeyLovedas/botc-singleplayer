import { DomainError } from "./errors.js";
import { SUPPORTED_DOMAIN_EVENT_VERSION } from "./events.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { BatchId, CommandId, EventId, GameId } from "./ids.js";

type BatchMetadata = {
  readonly batchId: BatchId;
  readonly gameId: GameId;
  readonly commandId: CommandId;
  readonly gameVersion: number;
  readonly rulesBaselineVersion: string;
};

export const validateDomainEventStream = (events: readonly AnyDomainEventEnvelope[]): void => {
  if (events.length === 0) {
    throw new DomainError("EmptyEventStream", "Cannot validate an empty domain event stream");
  }

  const first = events[0];
  if (first === undefined) {
    throw new DomainError("EmptyEventStream", "Cannot validate an empty domain event stream");
  }

  if (first.eventType !== "GameCreated") {
    throw new DomainError("MissingGameCreated", "First domain event must be GameCreated");
  }

  if (first.eventSequence !== 1) {
    throw new DomainError("EventSequenceJump", "First domain event sequence must be 1");
  }

  if (first.gameVersion !== 1) {
    throw new DomainError("EventGameVersionMismatch", "First domain event gameVersion must be 1");
  }

  const streamGameId = first.gameId;
  const streamRulesBaselineVersion = first.rulesBaselineVersion;
  const eventIds = new Set<EventId>();
  const closedBatchIds = new Set<BatchId>();
  const commandBatches = new Map<CommandId, BatchId>();
  let currentBatch: BatchMetadata | undefined;
  let previousBatchVersion = 0;

  for (const [index, event] of events.entries()) {
    if (event.eventVersion !== SUPPORTED_DOMAIN_EVENT_VERSION) {
      throw new DomainError("UnsupportedEventVersion", "Unsupported domain event version");
    }

    if (event.gameId !== streamGameId) {
      throw new DomainError("EventGameMismatch", "All domain events in a stream must share one game id");
    }

    if (event.rulesBaselineVersion !== streamRulesBaselineVersion) {
      throw new DomainError("EventRulesBaselineMismatch", "All domain events in a stream must share one rules baseline");
    }

    if (event.rulesBaselineVersion !== event.payload.rulesBaselineVersion) {
      throw new DomainError("EventRulesBaselineMismatch", "Event rules baseline metadata must match payload");
    }

    if (event.eventSequence !== index + 1) {
      throw new DomainError("EventSequenceJump", "Domain event sequence must be strictly continuous");
    }

    if (eventIds.has(event.eventId)) {
      throw new DomainError("DuplicateEventId", "Domain event ids must be unique within a stream");
    }
    eventIds.add(event.eventId);

    if (currentBatch === undefined || event.batchId !== currentBatch.batchId) {
      if (currentBatch !== undefined) {
        closedBatchIds.add(currentBatch.batchId);
      }

      if (closedBatchIds.has(event.batchId)) {
        throw new DomainError("NonContiguousBatch", "Events in the same batch must be contiguous");
      }

      if (event.gameVersion !== previousBatchVersion + 1) {
        throw new DomainError("EventGameVersionMismatch", "New event batches must increment gameVersion by 1");
      }

      const existingBatchForCommand = commandBatches.get(event.commandId);
      if (existingBatchForCommand !== undefined && existingBatchForCommand !== event.batchId) {
        throw new DomainError("DuplicateCommandBatch", "A command id cannot be committed in two successful batches");
      }

      commandBatches.set(event.commandId, event.batchId);
      previousBatchVersion = event.gameVersion;
      currentBatch = {
        batchId: event.batchId,
        gameId: event.gameId,
        commandId: event.commandId,
        gameVersion: event.gameVersion,
        rulesBaselineVersion: event.rulesBaselineVersion
      };
      continue;
    }

    if (event.gameId !== currentBatch.gameId) {
      throw new DomainError("EventGameMismatch", "Events in one batch must share one game id");
    }

    if (event.commandId !== currentBatch.commandId) {
      throw new DomainError("EventCommandMismatch", "Events in one batch must share one command id");
    }

    if (event.gameVersion !== currentBatch.gameVersion) {
      throw new DomainError("EventGameVersionMismatch", "Events in one batch must share one gameVersion");
    }

    if (event.rulesBaselineVersion !== currentBatch.rulesBaselineVersion) {
      throw new DomainError("EventRulesBaselineMismatch", "Events in one batch must share one rules baseline");
    }
  }
};
