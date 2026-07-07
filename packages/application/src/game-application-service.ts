import {
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  assertNever,
  causationIdFromCommandId,
  rebuildOptionalGameState
} from "@botc/domain-core";
import type {
  BatchId,
  DomainEventBatch,
  AnyDomainEventEnvelope,
  EventId,
  GameState,
  ScriptSelectedPayload,
  SupportedCommandEnvelope
} from "@botc/domain-core";
import { accepted, markIdempotent, rejected } from "./command-result.js";
import type { CommandRejectionCode, CommandResult } from "./command-result.js";
import type { CommandCommitStore, CommandReceipt } from "./ports/command-commit-store.js";

export type IdGenerator = {
  readonly nextEventId: () => EventId;
  readonly nextBatchId: () => BatchId;
};

export type Clock = {
  readonly now: () => string;
};

export type GameApplicationServiceDependencies = {
  readonly commandStore: CommandCommitStore;
  readonly ids: IdGenerator;
  readonly clock: Clock;
};

export class GameApplicationService {
  public constructor(private readonly dependencies: GameApplicationServiceDependencies) {}

  public async execute(command: SupportedCommandEnvelope): Promise<CommandResult> {
    const existingReceipt = await this.dependencies.commandStore.findCommandReceipt(command.gameId, command.commandId);
    if (existingReceipt !== undefined) {
      return markIdempotent(existingReceipt.result);
    }

    const events = await this.dependencies.commandStore.loadDomainEvents(command.gameId);
    const state = rebuildOptionalGameState(events);
    const currentGameVersion = state?.gameVersion ?? 0;

    if (command.expectedGameVersion !== currentGameVersion) {
      return this.recordRejected(
        command,
        rejected(
          command.gameId,
          "ExpectedGameVersionMismatch",
          `Expected version ${command.expectedGameVersion} but current version is ${currentGameVersion}`,
          currentGameVersion
        )
      );
    }

    const validation = this.validate(command, state);
    if (validation !== undefined) {
      return this.recordRejected(command, rejected(command.gameId, validation.code, validation.message, currentGameVersion));
    }

    const batch = this.createBatch(command, state, currentGameVersion);
    const result = accepted(command.gameId, batch.committedGameVersion, batch.events);
    const receipt: CommandReceipt = { commandId: command.commandId, gameId: command.gameId, result };

    try {
      await this.dependencies.commandStore.commitAcceptedCommand({
        expectedGameVersion: currentGameVersion,
        eventBatch: batch,
        receipt
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown event store failure";
      return rejected(command.gameId, "EventStoreAppendFailed", message, currentGameVersion);
    }

    return result;
  }

  private validate(
    command: SupportedCommandEnvelope,
    state: GameState | undefined
  ): { readonly code: CommandRejectionCode; readonly message: string } | undefined {
    if (command.actor.kind !== "human" && command.actor.kind !== "system") {
      return {
        code: "ActorNotAllowed",
        message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
      };
    }

    switch (command.payload.commandType) {
      case "CreateGame": {
        if (state !== undefined) {
          return { code: "GameAlreadyCreated", message: "Game already exists" };
        }

        if (command.payload.rulesBaselineVersion !== RULES_BASELINE_VERSION) {
          return {
            code: "UnsupportedRulesBaseline",
            message: `Unsupported rules baseline ${command.payload.rulesBaselineVersion}`
          };
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
        if (state === undefined) {
          return { code: "GameNotCreated", message: "SelectScript requires an existing game" };
        }

        return undefined;
      }
    }

    return assertNever(command.payload);
  }

  private createBatch(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number
  ): DomainEventBatch {
    const newVersion = currentGameVersion + 1;
    const batch = this.dependencies.ids.nextBatchId();
    const eventSequence = (state?.lastEventSequence ?? 0) + 1;
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
            rulesBaselineVersion: RULES_BASELINE_VERSION,
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
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            scriptId: command.payload.scriptId,
            scriptName: command.payload.scriptName,
            edition: command.payload.edition
          } satisfies ScriptSelectedPayload
        };
    }

    return assertNever(command.payload);
  }

  private async recordRejected(command: SupportedCommandEnvelope, result: CommandResult): Promise<CommandResult> {
    await this.dependencies.commandStore.recordRejectedCommand({
      gameId: command.gameId,
      commandId: command.commandId,
      receipt: {
        commandId: command.commandId,
        gameId: command.gameId,
        result
      }
    });

    return result;
  }
}
