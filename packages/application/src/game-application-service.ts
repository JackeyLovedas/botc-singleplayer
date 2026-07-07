import {
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  causationIdFromCommandId,
  rebuildOptionalGameState
} from "@botc/domain-core";
import type {
  BatchId,
  CommandEnvelope,
  CommandId,
  CreateGameCommandPayload,
  DomainEventBatch,
  AnyDomainEventEnvelope,
  EventId,
  GameId,
  ScriptSelectedPayload,
  SelectScriptCommandPayload
} from "@botc/domain-core";
import type { CommandReceiptStore } from "./ports/command-receipt-store.js";
import type { DomainEventStore } from "./ports/domain-event-store.js";
import { accepted, markIdempotent, rejected } from "./command-result.js";
import type { CommandResult } from "./command-result.js";

export type IdGenerator = {
  readonly nextEventId: () => EventId;
  readonly nextBatchId: () => BatchId;
};

export type Clock = {
  readonly now: () => string;
};

export type GameApplicationServiceDependencies = {
  readonly domainEventStore: DomainEventStore;
  readonly commandReceiptStore: CommandReceiptStore;
  readonly ids: IdGenerator;
  readonly clock: Clock;
};

export type CreateGameCommandEnvelope = CommandEnvelope<CreateGameCommandPayload & { readonly commandType: "CreateGame" }>;
export type SelectScriptCommandEnvelope = CommandEnvelope<SelectScriptCommandPayload & { readonly commandType: "SelectScript" }>;
export type SupportedCommandEnvelope = CreateGameCommandEnvelope | SelectScriptCommandEnvelope;

export class GameApplicationService {
  public constructor(private readonly dependencies: GameApplicationServiceDependencies) {}

  public async execute(command: SupportedCommandEnvelope): Promise<CommandResult> {
    const existingReceipt = await this.dependencies.commandReceiptStore.find(command.commandId);
    if (existingReceipt !== undefined) {
      return markIdempotent(existingReceipt.result);
    }

    const events = await this.dependencies.domainEventStore.loadDomainEvents(command.gameId);
    const state = rebuildOptionalGameState(events);
    const currentGameVersion = state?.gameVersion ?? 0;

    if (command.expectedGameVersion !== currentGameVersion) {
      return this.recordRejected(
        command.commandId,
        command.gameId,
        rejected(
          command.gameId,
          "ExpectedGameVersionMismatch",
          `Expected version ${command.expectedGameVersion} but current version is ${currentGameVersion}`,
          currentGameVersion
        )
      );
    }

    const validation = this.validate(command, state !== undefined);
    if (validation !== undefined) {
      return this.recordRejected(command.commandId, command.gameId, rejected(command.gameId, validation.code, validation.message, currentGameVersion));
    }

    const batch = this.createBatch(command, events.length, currentGameVersion);

    try {
      await this.dependencies.domainEventStore.appendDomainEventBatch(currentGameVersion, batch);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown event store failure";
      return rejected(command.gameId, "EventStoreAppendFailed", message, currentGameVersion);
    }

    const result = accepted(command.gameId, batch.committedGameVersion, batch.events);
    await this.dependencies.commandReceiptStore.recordAccepted({ commandId: command.commandId, gameId: command.gameId, result });
    return result;
  }

  private validate(
    command: SupportedCommandEnvelope,
    gameExists: boolean
  ): { readonly code: "InvalidCreateGameCounts" | "GameAlreadyCreated" | "GameNotCreated"; readonly message: string } | undefined {
    switch (command.payload.commandType) {
      case "CreateGame": {
        if (gameExists) {
          return { code: "GameAlreadyCreated", message: "Game already exists" };
        }

        if (
          command.payload.playerCount !== 12 ||
          command.payload.humanPlayerCount !== 1 ||
          command.payload.aiPlayerCount !== 11 ||
          command.payload.storytellerCount !== 1
        ) {
          return {
            code: "InvalidCreateGameCounts",
            message: "First release requires 12 players, 1 human, 11 AI, and 1 Storyteller"
          };
        }

        return undefined;
      }

      case "SelectScript": {
        if (!gameExists) {
          return { code: "GameNotCreated", message: "SelectScript requires an existing game" };
        }

        return undefined;
      }
    }
  }

  private createBatch(
    command: SupportedCommandEnvelope,
    existingEventCount: number,
    currentGameVersion: number
  ): DomainEventBatch {
    const newVersion = currentGameVersion + 1;
    const batch = this.dependencies.ids.nextBatchId();
    const eventSequence = existingEventCount + 1;
    const event = this.createEvent(command, batch, eventSequence, newVersion);

    return {
      batchId: batch,
      gameId: command.gameId,
      commandId: command.commandId,
      expectedGameVersion: currentGameVersion,
      committedGameVersion: newVersion,
      events: [event]
    };
  }

  private createEvent(
    command: SupportedCommandEnvelope,
    eventBatchId: BatchId,
    eventSequence: number,
    gameVersion: number
  ): AnyDomainEventEnvelope {
    const common = {
      category: "domain" as const,
      eventId: this.dependencies.ids.nextEventId(),
      gameId: command.gameId,
      eventSequence,
      batchId: eventBatchId,
      gameVersion,
      eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      commandId: command.commandId,
      createdAt: this.dependencies.clock.now(),
      correlationId: command.correlationId,
      causationId: causationIdFromCommandId(command.commandId)
    } as const;

    switch (command.payload.commandType) {
      case "CreateGame":
        return {
          ...common,
          eventType: "GameCreated",
          payload: {
            gameId: command.gameId,
            rootSeed: command.payload.rootSeed,
            rulesBaselineVersion: command.payload.rulesBaselineVersion,
            playerCount: command.payload.playerCount,
            humanPlayerCount: command.payload.humanPlayerCount,
            aiPlayerCount: command.payload.aiPlayerCount,
            storytellerCount: command.payload.storytellerCount
          }
        };

      case "SelectScript":
        return {
          ...common,
          eventType: "ScriptSelected",
          payload: {
            scriptId: command.payload.scriptId,
            scriptName: command.payload.scriptName,
            edition: command.payload.edition
          } satisfies ScriptSelectedPayload
        };
    }
  }

  private async recordRejected(commandIdValue: CommandId, gameIdValue: GameId, result: CommandResult): Promise<CommandResult> {
    await this.dependencies.commandReceiptStore.recordRejected({
      commandId: commandIdValue,
      gameId: gameIdValue,
      result
    });

    return result;
  }
}
