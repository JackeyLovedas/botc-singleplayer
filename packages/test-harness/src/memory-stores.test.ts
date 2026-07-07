import { describe, expect, it } from "vitest";
import { accepted } from "@botc/application";
import { batchId, commandId, rebuildGameState } from "@botc/domain-core";
import type { CommandReceipt, CommitAcceptedCommandInput } from "@botc/application";
import type { DomainEventBatch } from "@botc/domain-core";
import {
  MemoryCommandCommitStore,
  gameCreatedEvent,
  ids,
  phaseTransitionedEvent,
  scriptSelectedEvent
} from "@botc/test-harness";

const commitInputFor = (batch: DomainEventBatch): CommitAcceptedCommandInput => {
  const receipt: CommandReceipt = {
    gameId: batch.gameId,
    commandId: batch.commandId,
    result: accepted(batch.gameId, batch.committedGameVersion, batch.events)
  };

  return {
    expectedGameVersion: batch.expectedGameVersion,
    eventBatch: batch,
    receipt
  };
};

const createGameBatch = (overrides: Partial<DomainEventBatch> = {}): DomainEventBatch => {
  const event = gameCreatedEvent();

  return {
    batchId: event.batchId,
    gameId: event.gameId,
    commandId: event.commandId,
    expectedGameVersion: 0,
    committedGameVersion: 1,
    events: [event],
    ...overrides
  };
};

describe("MemoryCommandCommitStore batch contract", () => {
  it("commits events and accepted receipts atomically on valid input", async () => {
    const store = new MemoryCommandCommitStore();
    const batch = createGameBatch();

    await store.commitAcceptedCommand(commitInputFor(batch));

    expect(await store.loadDomainEvents(ids.game)).toHaveLength(1);
    expect(await store.findCommandReceipt(batch.gameId, batch.commandId)).toBeDefined();
    expect(store.getGameVersion(ids.game)).toBe(1);
  });

  it("rejects empty batches without partial writes", async () => {
    const store = new MemoryCommandCommitStore();
    const batch = createGameBatch({ events: [] });

    await expect(store.commitAcceptedCommand(commitInputFor(batch))).rejects.toThrow("must not be empty");

    expect(await store.loadDomainEvents(ids.game)).toHaveLength(0);
    expect(await store.findCommandReceipt(batch.gameId, batch.commandId)).toBeUndefined();
    expect(store.getGameVersion(ids.game)).toBe(0);
  });

  it("rejects event metadata that does not match the batch", async () => {
    const store = new MemoryCommandCommitStore();
    const event = gameCreatedEvent({ batchId: batchId("event-batch") });
    const batch = createGameBatch({ batchId: batchId("batch-mismatch"), events: [event] });

    await expect(store.commitAcceptedCommand(commitInputFor(batch))).rejects.toThrow("batchId");

    expect(await store.loadDomainEvents(ids.game)).toHaveLength(0);
  });

  it("rejects mismatched expected game versions", async () => {
    const store = new MemoryCommandCommitStore();
    const batch = createGameBatch();
    const input = {
      ...commitInputFor(batch),
      expectedGameVersion: 1
    };

    await expect(store.commitAcceptedCommand(input)).rejects.toThrow("expectedGameVersion");

    expect(await store.loadDomainEvents(ids.game)).toHaveLength(0);
  });

  it("rejects event sequences that do not continue from the current stream", async () => {
    const store = new MemoryCommandCommitStore();
    const event = gameCreatedEvent({ eventSequence: 2 });
    const batch = createGameBatch({ events: [event] });

    await expect(store.commitAcceptedCommand(commitInputFor(batch))).rejects.toThrow("sequences");

    expect(await store.loadDomainEvents(ids.game)).toHaveLength(0);
  });

  it("rejects structurally valid but semantically invalid staged streams without partial writes", async () => {
    const store = new MemoryCommandCommitStore();
    await store.commitAcceptedCommand(commitInputFor(createGameBatch()));

    const transition = phaseTransitionedEvent({
      eventSequence: 2,
      gameVersion: 2,
      batchId: batchId("phase-batch"),
      commandId: commandId("phase-command")
    });
    await store.commitAcceptedCommand(commitInputFor({
      batchId: transition.batchId,
      gameId: ids.game,
      commandId: transition.commandId,
      expectedGameVersion: 1,
      committedGameVersion: 2,
      events: [transition]
    }));

    const invalidScript = scriptSelectedEvent({
      eventSequence: 3,
      gameVersion: 3,
      batchId: batchId("semantic-invalid-batch"),
      commandId: commandId("semantic-invalid-command")
    });
    const invalidBatch: DomainEventBatch = {
      batchId: invalidScript.batchId,
      gameId: ids.game,
      commandId: invalidScript.commandId,
      expectedGameVersion: 2,
      committedGameVersion: 3,
      events: [invalidScript]
    };

    await expect(store.commitAcceptedCommand(commitInputFor(invalidBatch))).rejects.toThrow("ScriptSelected");

    const events = await store.loadDomainEvents(ids.game);
    expect(events).toHaveLength(2);
    expect(store.getGameVersion(ids.game)).toBe(2);
    expect(await store.findCommandReceipt(ids.game, invalidScript.commandId)).toBeUndefined();
    expect(rebuildGameState(events).phase).toBe("SETUP_GENERATION");
  });
});
