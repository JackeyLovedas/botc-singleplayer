import { describe, expect, it } from "vitest";
import {
  accepted,
  acceptedWithEventSummary,
  createCommandFingerprintFromCanonicalJson,
  rejected
} from "@botc/application";
import { batchId, commandId, rebuildGameState } from "@botc/domain-core";
import type {
  CommandExecutionFailed,
  CommandReceiptResult,
  CommitAcceptedCommandInput,
  RecordRejectedCommandInput
} from "@botc/application";
import type { DomainEventBatch } from "@botc/domain-core";
import {
  MemoryCommandCommitStore,
  gameCreatedEvent,
  ids,
  phaseTransitionedEvent
} from "@botc/test-harness";

const commitInputFor = (batch: DomainEventBatch): CommitAcceptedCommandInput => {
  const receipt: CommitAcceptedCommandInput["receipt"] = {
    gameId: batch.gameId,
    commandId: batch.commandId,
    commandFingerprint: createCommandFingerprintFromCanonicalJson('["OBJECT",[]]'),
    result: accepted(batch.gameId, batch.committedGameVersion, batch.events)
  };

  return {
    expectedGameVersion: batch.expectedGameVersion,
    eventBatch: batch,
    receipt
  };
};

const summaryCommitInputFor = (batch: DomainEventBatch): CommitAcceptedCommandInput => ({
  expectedGameVersion: batch.expectedGameVersion,
  eventBatch: batch,
  receipt: {
    gameId: batch.gameId,
    commandId: batch.commandId,
    commandFingerprint: createCommandFingerprintFromCanonicalJson('["OBJECT",[]]'),
    result: acceptedWithEventSummary(batch.gameId, batch.committedGameVersion, batch.events)
  }
});

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
  it("keeps execution failures and opposite-status results outside receipt write types", () => {
    const batch = createGameBatch();
    const acceptedInput = commitInputFor(batch);
    const rejectedInput: RecordRejectedCommandInput = {
      gameId: ids.game,
      commandId: commandId("typed-rejected-command"),
      receipt: {
        gameId: ids.game,
        commandId: commandId("typed-rejected-command"),
        commandFingerprint: createCommandFingerprintFromCanonicalJson('["OBJECT",[]]'),
        result: rejected(ids.game, "GameAlreadyCreated", "already exists", 1)
      }
    };
    const failure: CommandExecutionFailed = {
      status: "failed",
      gameId: ids.game,
      code: "DependencyExecutionFailed",
      message: "retry",
      failureStage: "command-validation",
      retryable: true
    };
    // @ts-expect-error Retryable execution failures are not receipt results.
    const failedReceiptResult: CommandReceiptResult = failure;
    const rejectedAcceptedInput: CommitAcceptedCommandInput = {
      ...acceptedInput,
      receipt: {
        ...acceptedInput.receipt,
        // @ts-expect-error Accepted writes reject a rejected result.
        result: rejectedInput.receipt.result
      }
    };
    const acceptedRejectedInput: RecordRejectedCommandInput = {
      ...rejectedInput,
      receipt: {
        ...rejectedInput.receipt,
        // @ts-expect-error Rejected writes reject an accepted result.
        result: acceptedInput.receipt.result
      }
    };

    expect(failedReceiptResult).toBe(failure);
    expect(rejectedAcceptedInput.receipt.result.status).toBe("rejected");
    expect(acceptedRejectedInput.receipt.result.status).toBe("accepted");
  });

  it("commits events and accepted receipts atomically on valid input", async () => {
    const store = new MemoryCommandCommitStore();
    const batch = createGameBatch();

    await store.commitAcceptedCommand(commitInputFor(batch));

    expect(await store.loadDomainEvents(ids.game)).toHaveLength(1);
    expect(await store.findCommandReceipt(batch.gameId, batch.commandId)).toBeDefined();
    expect(store.getGameVersion(ids.game)).toBe(1);
  });

  it("commits an exact event-type summary while retaining full canonical events", async () => {
    const store = new MemoryCommandCommitStore();
    const batch = createGameBatch();

    await store.commitAcceptedCommand(summaryCommitInputFor(batch));

    const receipt = await store.findCommandReceipt(batch.gameId, batch.commandId);
    expect(receipt?.result).toStrictEqual({
      status: "accepted",
      resultSchemaVersion: "accepted-event-summary-v1",
      eventDisclosure: "EVENT_TYPES_ONLY",
      gameId: batch.gameId,
      gameVersion: 1,
      eventCount: 1,
      eventTypes: ["GameCreated"],
      idempotent: false
    });
    expect((await store.loadDomainEvents(batch.gameId))[0]).toStrictEqual(batch.events[0]);
  });

  it.each([
    ["count", { eventCount: 2 }],
    ["type-array length", { eventTypes: [] }],
    ["ordered type", { eventTypes: ["PhaseTransitioned"] }]
  ] as const)("rejects a summary with mismatched %s without partial writes", async (_name, resultOverride) => {
    const store = new MemoryCommandCommitStore();
    const batch = createGameBatch();
    const input = summaryCommitInputFor(batch);
    const invalid = {
      ...input,
      receipt: {
        ...input.receipt,
        result: { ...input.receipt.result, ...resultOverride }
      }
    } as CommitAcceptedCommandInput;

    await expect(store.commitAcceptedCommand(invalid)).rejects.toThrow("summary");
    expect(await store.loadDomainEvents(batch.gameId)).toHaveLength(0);
    expect(await store.findCommandReceipt(batch.gameId, batch.commandId)).toBeUndefined();
  });

  it("rejects malformed fingerprints on accepted and rejected writes", async () => {
    const acceptedStore = new MemoryCommandCommitStore();
    const batch = createGameBatch();
    const acceptedInput = commitInputFor(batch);
    const malformedFingerprint = {
      ...acceptedInput.receipt.commandFingerprint,
      digestHex: "0".repeat(64)
    };

    await expect(acceptedStore.commitAcceptedCommand({
      ...acceptedInput,
      receipt: { ...acceptedInput.receipt, commandFingerprint: malformedFingerprint }
    })).rejects.toThrow("valid command fingerprint");

    const rejectedStore = new MemoryCommandCommitStore();
    await expect(rejectedStore.recordRejectedCommand({
      gameId: ids.game,
      commandId: commandId("rejected-command"),
      receipt: {
        gameId: ids.game,
        commandId: commandId("rejected-command"),
        commandFingerprint: malformedFingerprint,
        result: rejected(ids.game, "GameAlreadyCreated", "already exists", 1)
      }
    })).rejects.toThrow("valid command fingerprint");
    expect(rejectedStore.getReceiptCount()).toBe(0);
  });

  it("stores a valid rejected fingerprint once and refuses receipt overwrite", async () => {
    const store = new MemoryCommandCommitStore();
    const command = commandId("rejected-command");
    const input = {
      gameId: ids.game,
      commandId: command,
      receipt: {
        gameId: ids.game,
        commandId: command,
        commandFingerprint: createCommandFingerprintFromCanonicalJson('["OBJECT",[["attempt",["INTEGER","1"]]]]'),
        result: rejected(ids.game, "GameAlreadyCreated", "already exists", 1)
      }
    };

    await store.recordRejectedCommand(input);
    await expect(store.recordRejectedCommand({
      ...input,
      receipt: {
        ...input.receipt,
        commandFingerprint: createCommandFingerprintFromCanonicalJson('["OBJECT",[["attempt",["INTEGER","2"]]]]')
      }
    })).rejects.toThrow("overwrite");

    expect((await store.findCommandReceipt(ids.game, command))?.commandFingerprint)
      .toStrictEqual(input.receipt.commandFingerprint);
    expect(store.rejectedCount).toBe(1);
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
    const invalidBatch: DomainEventBatch = {
      batchId: transition.batchId,
      gameId: ids.game,
      commandId: transition.commandId,
      expectedGameVersion: 1,
      committedGameVersion: 2,
      events: [transition]
    };

    await expect(store.commitAcceptedCommand(commitInputFor(invalidBatch))).rejects.toMatchObject({
      code: "InvalidDomainBatchSemantics"
    });

    const events = await store.loadDomainEvents(ids.game);
    expect(events).toHaveLength(1);
    expect(store.getGameVersion(ids.game)).toBe(1);
    expect(await store.findCommandReceipt(ids.game, transition.commandId)).toBeUndefined();
    expect(rebuildGameState(events).phase).toBe("SCRIPT_SELECTION");
  });
});
