import {
  batchId,
  eventId
} from "@botc/domain-core";
import type { BatchId, EventId } from "@botc/domain-core";
import type { Clock, IdGenerator } from "@botc/application";

export class FixedIdGenerator implements IdGenerator {
  private eventCounter = 0;
  private batchCounter = 0;

  public nextEventId(): EventId {
    this.eventCounter += 1;
    return eventId(`event-${this.eventCounter}`);
  }

  public nextBatchId(): BatchId {
    this.batchCounter += 1;
    return batchId(`batch-${this.batchCounter}`);
  }
}

export class FixedClock implements Clock {
  public constructor(private readonly value = "2026-07-07T00:00:00.000Z") {}

  public now(): string {
    return this.value;
  }
}
