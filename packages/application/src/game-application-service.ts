import {
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  SUPPORTED_ROSTER_VERSION,
  DomainError,
  applyDomainEventBatch,
  assertNever,
  causationIdFromCommandId,
  createFixedPlayerRoster,
  compareStableId,
  evaluatePhaseTransition,
  rebuildOptionalGameState,
  SUPPORTED_SCRIPT_EDITION,
  SUPPORTED_SCRIPT_ID,
  SUPPORTED_SCRIPT_NAME,
  validateDomainBatchSemantics
} from "@botc/domain-core";
import type {
  AssignmentGenerationFailure,
  BatchId,
  DomainEventBatch,
  AnyDomainEventEnvelope,
  DomainEventEnvelope,
  EventId,
  GeneratedCharacterAssignment,
  GeneratedSetup,
  GameState,
  CharactersAssignedPayload,
  PhaseTransitionedPayload,
  PlayerRosterCreatedPayload,
  SetupGeneratedPayload,
  SetupGenerationConstraints,
  SetupGenerationFailure,
  ScriptSelectedPayload,
  SupportedCommandEnvelope
} from "@botc/domain-core";
import { accepted, failed, markIdempotent, rejected } from "./command-result.js";
import type {
  AssignmentGenerationRejectionDetails,
  CommandExecutionFailed,
  CommandRejected,
  CommandResult,
  GeneralCommandRejectionCode,
  SetupGenerationRejectionDetails
} from "./command-result.js";
import type { CharacterAssignmentGeneratorPort } from "./ports/character-assignment-generator.js";
import type { CommandCommitStore, CommandReceipt } from "./ports/command-commit-store.js";
import type { SetupGeneratorPort } from "./ports/setup-generator.js";

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
  readonly setupGenerator?: SetupGeneratorPort;
  readonly characterAssignmentGenerator?: CharacterAssignmentGeneratorPort;
};

type DomainEventMetadata = Omit<DomainEventEnvelope, "eventType" | "payload">;

class EventMetadataGenerationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "EventMetadataGenerationError";
  }
}

const errorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export class GameApplicationService {
  public constructor(private readonly dependencies: GameApplicationServiceDependencies) {}

  public async execute(command: SupportedCommandEnvelope): Promise<CommandResult> {
    let existingReceipt;
    try {
      existingReceipt = await this.dependencies.commandStore.findCommandReceipt(command.gameId, command.commandId);
    } catch (error: unknown) {
      return failed(command.gameId, "CommandStoreReadFailed", errorMessage(error, "Unknown command receipt read failure"), "receipt-read");
    }

    if (existingReceipt !== undefined) {
      return markIdempotent(existingReceipt.result);
    }

    let events;
    try {
      events = await this.dependencies.commandStore.loadDomainEvents(command.gameId);
    } catch (error: unknown) {
      return failed(command.gameId, "CommandStoreReadFailed", errorMessage(error, "Unknown domain event load failure"), "event-load");
    }

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

    const batch = this.createBatchOrReject(command, state, currentGameVersion);
    if ("status" in batch) {
      return batch;
    }

    if ("code" in batch) {
      if (batch.code === "SetupGenerationFailed") {
        return this.recordRejected(command, rejected(command.gameId, batch.code, batch.message, currentGameVersion, false, batch.details));
      }

      if (batch.code === "AssignmentGenerationFailed") {
        return this.recordRejected(command, rejected(command.gameId, batch.code, batch.message, currentGameVersion, false, batch.details));
      }

      return this.recordRejected(command, rejected(command.gameId, batch.code, batch.message, currentGameVersion));
    }

    const prospective = this.validateProspectiveBatch(state, batch);
    if (prospective !== undefined) {
      if ("status" in prospective) {
        return prospective;
      }

      return this.recordRejected(command, rejected(command.gameId, prospective.code, prospective.message, currentGameVersion));
    }

    const result = accepted(command.gameId, batch.committedGameVersion, batch.events);
    const receipt: CommandReceipt = { commandId: command.commandId, gameId: command.gameId, result };

    try {
      await this.dependencies.commandStore.commitAcceptedCommand({
        expectedGameVersion: currentGameVersion,
        eventBatch: batch,
        receipt
      });
    } catch (error: unknown) {
      return failed(command.gameId, "EventStoreAppendFailed", errorMessage(error, "Unknown event store failure"), "accepted-commit", currentGameVersion);
    }

    return result;
  }

  private validate(
    command: SupportedCommandEnvelope,
    state: GameState | undefined
  ): { readonly code: GeneralCommandRejectionCode; readonly message: string } | undefined {
    switch (command.payload.commandType) {
      case "CreateGame": {
        if (command.actor.kind !== "human" && command.actor.kind !== "system") {
          return {
            code: "ActorNotAllowed",
            message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
          };
        }

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
        if (command.actor.kind !== "human" && command.actor.kind !== "system") {
          return {
            code: "ActorNotAllowed",
            message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
          };
        }

        if (state === undefined) {
          return { code: "GameNotCreated", message: "SelectScript requires an existing game" };
        }

        if (state.selectedScript !== undefined) {
          return { code: "ScriptAlreadySelected", message: "Script has already been selected" };
        }

        if (state.phase !== "SCRIPT_SELECTION") {
          return { code: "CommandNotAllowedInPhase", message: `SelectScript cannot execute during ${state.phase}` };
        }

        if (
          command.payload.scriptId !== SUPPORTED_SCRIPT_ID ||
          command.payload.scriptName !== SUPPORTED_SCRIPT_NAME ||
          command.payload.edition !== SUPPORTED_SCRIPT_EDITION
        ) {
          return {
            code: "UnsupportedScript",
            message: "First release only supports Sects & Violets script metadata"
          };
        }

        return undefined;
      }

      case "GenerateSetup": {
        if (command.actor.kind !== "system" && command.actor.kind !== "storyteller") {
          return {
            code: "ActorNotAllowed",
            message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
          };
        }

        if (state === undefined) {
          return { code: "GameNotCreated", message: "GenerateSetup requires an existing game" };
        }

        if (state.selectedScript === undefined) {
          return { code: "ScriptNotSelected", message: "GenerateSetup requires a selected script" };
        }

        if (state.setup !== undefined) {
          return { code: "SetupAlreadyGenerated", message: "Setup has already been generated" };
        }

        if (state.phase !== "SETUP_GENERATION") {
          return { code: "CommandNotAllowedInPhase", message: `GenerateSetup cannot execute during ${state.phase}` };
        }

        return undefined;
      }

      case "CreatePlayerRoster": {
        if (command.actor.kind !== "human" && command.actor.kind !== "system") {
          return {
            code: "ActorNotAllowed",
            message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
          };
        }

        if (command.actor.kind === "human" && command.actor.playerId !== command.payload.humanPlayerId) {
          return {
            code: "ActorPlayerMismatch",
            message: "Human actor playerId must match the requested humanPlayerId"
          };
        }

        if (state === undefined) {
          return { code: "GameNotCreated", message: "CreatePlayerRoster requires an existing game" };
        }

        if (state.setup === undefined) {
          return { code: "SetupNotGenerated", message: "CreatePlayerRoster requires generated setup" };
        }

        if (state.phase !== "CHARACTER_ASSIGNMENT") {
          return { code: "CommandNotAllowedInPhase", message: `CreatePlayerRoster cannot execute during ${state.phase}` };
        }

        if (state.roster !== undefined) {
          return { code: "PlayerRosterAlreadyCreated", message: "Player roster has already been created" };
        }

        if (state.assignment !== undefined) {
          return { code: "CharacterAssignmentAlreadyCreated", message: "Character assignment has already been created" };
        }

        try {
          createFixedPlayerRoster({
            humanPlayerId: command.payload.humanPlayerId,
            humanDisplayName: command.payload.humanDisplayName,
            humanSeatNumber: command.payload.humanSeatNumber
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Invalid player roster";
          return { code: "InvalidPlayerRoster", message };
        }

        return undefined;
      }

      case "AssignCharacters": {
        if (command.actor.kind !== "system" && command.actor.kind !== "storyteller") {
          return {
            code: "ActorNotAllowed",
            message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
          };
        }

        if (state === undefined) {
          return { code: "GameNotCreated", message: "AssignCharacters requires an existing game" };
        }

        if (state.setup === undefined) {
          return { code: "SetupNotGenerated", message: "AssignCharacters requires generated setup" };
        }

        if (state.roster === undefined) {
          return { code: "PlayerRosterNotCreated", message: "AssignCharacters requires a player roster" };
        }

        if (state.assignment !== undefined) {
          return { code: "CharacterAssignmentAlreadyCreated", message: "Character assignment has already been created" };
        }

        if (state.phase !== "CHARACTER_ASSIGNMENT") {
          return { code: "CommandNotAllowedInPhase", message: `AssignCharacters cannot execute during ${state.phase}` };
        }

        return undefined;
      }
    }

    return assertNever(command.payload);
  }

  private createBatchOrReject(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number
  ): DomainEventBatch | CommandExecutionFailed | { readonly code: GeneralCommandRejectionCode; readonly message: string } | {
    readonly code: "SetupGenerationFailed";
    readonly message: string;
    readonly details: SetupGenerationRejectionDetails;
  } | {
    readonly code: "AssignmentGenerationFailed";
    readonly message: string;
    readonly details: AssignmentGenerationRejectionDetails;
  } {
    try {
      const generatedSetup = this.generateSetupOrReject(command, state, currentGameVersion);
      if (generatedSetup !== undefined && "code" in generatedSetup) {
        return generatedSetup;
      }

      const generatedAssignment = this.generateAssignmentOrReject(command, state, currentGameVersion);
      if (generatedAssignment !== undefined && "code" in generatedAssignment) {
        return generatedAssignment;
      }

      return this.createBatch(command, state, currentGameVersion, generatedSetup, generatedAssignment);
    } catch (error: unknown) {
      if (error instanceof EventMetadataGenerationError) {
        return failed(command.gameId, "MetadataGenerationFailed", error.message, "event-metadata", currentGameVersion);
      }

      if (error instanceof DomainError) {
        return { code: "DomainValidationFailed", message: error.message };
      }

      return failed(command.gameId, "DependencyExecutionFailed", errorMessage(error, "Unknown batch construction failure"), "command-validation", currentGameVersion);
    }
  }

  private setupGenerationFailureDetails(
    failureCode: SetupGenerationFailure["failureCode"],
    message: string,
    constraints: SetupGenerationConstraints
  ): SetupGenerationRejectionDetails {
    return {
      kind: "setup-generation",
      failure: {
        status: "failure",
        failureCode,
        message,
        conflictingRoleIds: [],
        requestedCounts: undefined,
        availableCounts: undefined,
        constraintsSnapshot: {
          lockedRoleIds: [...(constraints.lockedRoleIds ?? [])].sort(compareStableId),
          excludedRoleIds: [...(constraints.excludedRoleIds ?? [])].sort(compareStableId),
          exactRoleIds: [...(constraints.exactRoleIds ?? [])].sort(compareStableId)
        }
      }
    };
  }

  private generateSetupOrReject(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number
  ): GeneratedSetup | CommandExecutionFailed | {
    readonly code: "SetupGenerationFailed";
    readonly message: string;
    readonly details: SetupGenerationRejectionDetails;
  } | undefined {
    if (command.payload.commandType !== "GenerateSetup") {
      return undefined;
    }

    if (state === undefined || state.selectedScript === undefined) {
      const message = "GenerateSetup requires an existing selected script state";
      return {
        code: "SetupGenerationFailed",
        message,
        details: this.setupGenerationFailureDetails("NoLegalSetup", message, command.payload.constraints)
      };
    }

    const setupGenerator = this.dependencies.setupGenerator;
    if (setupGenerator === undefined) {
      return failed(command.gameId, "ApplicationNotConfigured", "Setup generator dependency is not configured", "setup-generation", currentGameVersion);
    }

    let result;
    try {
      result = setupGenerator.generate({
        scriptId: state.selectedScript.scriptId,
        rootSeed: state.rootSeed,
        playerCount: state.playerCounts.playerCount,
        constraints: command.payload.constraints
      });
    } catch (error: unknown) {
      return failed(command.gameId, "DependencyExecutionFailed", errorMessage(error, "Unknown setup generator failure"), "setup-generation", currentGameVersion);
    }

    if (result.status === "failure") {
      return {
        code: "SetupGenerationFailed",
        message: `${result.failureCode}: ${result.message}`,
        details: {
          kind: "setup-generation",
          failure: result
        }
      };
    }

    return result.setup;
  }

  private assignmentGenerationFailureDetails(
    failure: AssignmentGenerationFailure
  ): AssignmentGenerationRejectionDetails {
    return {
      kind: "assignment-generation",
      failure
    };
  }

  private generateAssignmentOrReject(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number
  ): GeneratedCharacterAssignment | CommandExecutionFailed | {
    readonly code: "AssignmentGenerationFailed";
    readonly message: string;
    readonly details: AssignmentGenerationRejectionDetails;
  } | undefined {
    if (command.payload.commandType !== "AssignCharacters") {
      return undefined;
    }

    if (state === undefined || state.setup === undefined || state.roster === undefined) {
      return failed(command.gameId, "ApplicationNotConfigured", "AssignCharacters requires setup and roster state", "assignment-generation", currentGameVersion);
    }

    const assignmentGenerator = this.dependencies.characterAssignmentGenerator;
    if (assignmentGenerator === undefined) {
      return failed(command.gameId, "ApplicationNotConfigured", "Character assignment generator dependency is not configured", "assignment-generation", currentGameVersion);
    }

    let result;
    try {
      result = assignmentGenerator.generate({
        rootSeed: state.rootSeed,
        rosterVersion: state.roster.rosterVersion,
        roster: state.roster.entries,
        actualRoles: state.setup.actualRoles,
        roleCatalogSignature: state.setup.roleCatalogSignature
      });
    } catch (error: unknown) {
      return failed(command.gameId, "DependencyExecutionFailed", errorMessage(error, "Unknown character assignment generator failure"), "assignment-generation", currentGameVersion);
    }

    if (result.status === "failure") {
      return {
        code: "AssignmentGenerationFailed",
        message: `${result.failureCode}: ${result.message}`,
        details: this.assignmentGenerationFailureDetails(result)
      };
    }

    return result.assignment;
  }

  private createBatch(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number,
    generatedSetup: GeneratedSetup | undefined,
    generatedAssignment: GeneratedCharacterAssignment | undefined
  ): DomainEventBatch {
    const newVersion = currentGameVersion + 1;
    const batch = this.createBatchId();
    const eventSequence = (state?.lastEventSequence ?? 0) + 1;
    const events = this.createEvents(command, batch, eventSequence, newVersion, state, generatedSetup, generatedAssignment);

    return {
      batchId: batch,
      gameId: command.gameId,
      commandId: command.commandId,
      expectedGameVersion: currentGameVersion,
      committedGameVersion: newVersion,
      events
    };
  }

  private createEvents(
    command: SupportedCommandEnvelope,
    eventBatchId: BatchId,
    firstEventSequence: number,
    gameVersion: number,
    state: GameState | undefined,
    generatedSetup: GeneratedSetup | undefined,
    generatedAssignment: GeneratedCharacterAssignment | undefined
  ): readonly AnyDomainEventEnvelope[] {
    const common = (eventSequence: number) => this.createEventMetadata(command, eventBatchId, eventSequence, gameVersion);

    switch (command.payload.commandType) {
      case "CreateGame":
        return [{
          ...common(firstEventSequence),
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
        }];

      case "SelectScript": {
        if (state === undefined) {
          throw new DomainError("InvalidDomainBatchSemantics", "SelectScript event creation requires an existing game state");
        }

        const transition = evaluatePhaseTransition({
          fromPhase: state.phase,
          toPhase: "SETUP_GENERATION",
          dayNumber: state.dayNumber,
          nightNumber: state.nightNumber
        });

        if (!transition.allowed || transition.reasonCode === undefined) {
          throw new DomainError("InvalidDomainBatchSemantics", `SelectScript phase transition is not allowed: ${transition.reason}`);
        }

        const scriptSelectedEvent: DomainEventEnvelope<"ScriptSelected"> = {
          ...common(firstEventSequence),
          eventType: "ScriptSelected" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            scriptId: SUPPORTED_SCRIPT_ID,
            scriptName: SUPPORTED_SCRIPT_NAME,
            edition: SUPPORTED_SCRIPT_EDITION
          } satisfies ScriptSelectedPayload
        };

        const phaseTransitionedEvent: DomainEventEnvelope<"PhaseTransitioned"> = {
          ...common(firstEventSequence + 1),
          eventType: "PhaseTransitioned" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            fromPhase: state.phase,
            toPhase: transition.nextPhase,
            transitionReason: transition.reasonCode,
            dayNumberBefore: state.dayNumber,
            dayNumberAfter: transition.dayNumber,
            nightNumberBefore: state.nightNumber,
            nightNumberAfter: transition.nightNumber
          } satisfies PhaseTransitionedPayload
        };

        return [scriptSelectedEvent, phaseTransitionedEvent];
      }

      case "GenerateSetup": {
        if (state === undefined || generatedSetup === undefined) {
          throw new DomainError("InvalidDomainBatchSemantics", "GenerateSetup event creation requires current state and generated setup");
        }

        const transition = evaluatePhaseTransition({
          fromPhase: state.phase,
          toPhase: "CHARACTER_ASSIGNMENT",
          dayNumber: state.dayNumber,
          nightNumber: state.nightNumber
        });

        if (!transition.allowed || transition.reasonCode === undefined) {
          throw new DomainError("InvalidDomainBatchSemantics", `GenerateSetup phase transition is not allowed: ${transition.reason}`);
        }

        const setupGeneratedEvent: DomainEventEnvelope<"SetupGenerated"> = {
          ...common(firstEventSequence),
          eventType: "SetupGenerated" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            ...generatedSetup
          } satisfies SetupGeneratedPayload
        };

        const phaseTransitionedEvent: DomainEventEnvelope<"PhaseTransitioned"> = {
          ...common(firstEventSequence + 1),
          eventType: "PhaseTransitioned" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            fromPhase: state.phase,
            toPhase: transition.nextPhase,
            transitionReason: transition.reasonCode,
            dayNumberBefore: state.dayNumber,
            dayNumberAfter: transition.dayNumber,
            nightNumberBefore: state.nightNumber,
            nightNumberAfter: transition.nightNumber
          } satisfies PhaseTransitionedPayload
        };

        return [setupGeneratedEvent, phaseTransitionedEvent];
      }

      case "CreatePlayerRoster": {
        if (state === undefined) {
          throw new DomainError("InvalidDomainBatchSemantics", "CreatePlayerRoster event creation requires current state");
        }

        const playerRosterCreatedEvent: DomainEventEnvelope<"PlayerRosterCreated"> = {
          ...common(firstEventSequence),
          eventType: "PlayerRosterCreated" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            rosterVersion: SUPPORTED_ROSTER_VERSION,
            entries: createFixedPlayerRoster({
              humanPlayerId: command.payload.humanPlayerId,
              humanDisplayName: command.payload.humanDisplayName,
              humanSeatNumber: command.payload.humanSeatNumber
            })
          } satisfies PlayerRosterCreatedPayload
        };

        return [playerRosterCreatedEvent];
      }

      case "AssignCharacters": {
        if (state === undefined || generatedAssignment === undefined) {
          throw new DomainError("InvalidDomainBatchSemantics", "AssignCharacters event creation requires current state and generated assignment");
        }

        const transition = evaluatePhaseTransition({
          fromPhase: state.phase,
          toPhase: "FIRST_NIGHT",
          dayNumber: state.dayNumber,
          nightNumber: state.nightNumber
        });

        if (!transition.allowed || transition.reasonCode === undefined) {
          throw new DomainError("InvalidDomainBatchSemantics", `AssignCharacters phase transition is not allowed: ${transition.reason}`);
        }

        const charactersAssignedEvent: DomainEventEnvelope<"CharactersAssigned"> = {
          ...common(firstEventSequence),
          eventType: "CharactersAssigned" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            ...generatedAssignment
          } satisfies CharactersAssignedPayload
        };

        const phaseTransitionedEvent: DomainEventEnvelope<"PhaseTransitioned"> = {
          ...common(firstEventSequence + 1),
          eventType: "PhaseTransitioned" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            fromPhase: state.phase,
            toPhase: transition.nextPhase,
            transitionReason: transition.reasonCode,
            dayNumberBefore: state.dayNumber,
            dayNumberAfter: transition.dayNumber,
            nightNumberBefore: state.nightNumber,
            nightNumberAfter: transition.nightNumber
          } satisfies PhaseTransitionedPayload
        };

        return [charactersAssignedEvent, phaseTransitionedEvent];
      }
    }

    return assertNever(command.payload);
  }

  private validateProspectiveBatch(
    state: GameState | undefined,
    batch: DomainEventBatch
  ): CommandExecutionFailed | { readonly code: "DomainValidationFailed"; readonly message: string } | undefined {
    try {
      validateDomainBatchSemantics(state, batch.events);
      applyDomainEventBatch(state, batch.events);
      return undefined;
    } catch (error: unknown) {
      if (!(error instanceof DomainError)) {
        return failed(
          batch.gameId,
          "DependencyExecutionFailed",
          errorMessage(error, "Unknown prospective validation failure"),
          "prospective-validation",
          batch.expectedGameVersion
        );
      }

      return {
        code: "DomainValidationFailed",
        message: error.message
      };
    }
  }

  private createBatchId(): BatchId {
    try {
      return this.dependencies.ids.nextBatchId();
    } catch (error: unknown) {
      throw new EventMetadataGenerationError(errorMessage(error, "Unknown batch id generation failure"));
    }
  }

  private createEventMetadata(
    command: SupportedCommandEnvelope,
    eventBatchId: BatchId,
    eventSequence: number,
    gameVersion: number
  ): DomainEventMetadata {
    try {
      return {
        category: "domain",
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
      };
    } catch (error: unknown) {
      throw new EventMetadataGenerationError(errorMessage(error, "Unknown event metadata generation failure"));
    }
  }

  private async recordRejected(command: SupportedCommandEnvelope, result: CommandRejected): Promise<CommandResult> {
    try {
      await this.dependencies.commandStore.recordRejectedCommand({
        gameId: command.gameId,
        commandId: command.commandId,
        receipt: {
          commandId: command.commandId,
          gameId: command.gameId,
          result
        }
      });
    } catch (error: unknown) {
      return failed(
        command.gameId,
        "CommandReceiptWriteFailed",
        errorMessage(error, "Unknown rejected command receipt write failure"),
        "rejected-receipt-write",
        result.currentGameVersion
      );
    }

    return result;
  }
}
