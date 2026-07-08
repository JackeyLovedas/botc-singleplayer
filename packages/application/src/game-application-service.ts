import {
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_ROSTER_VERSION,
  DomainError,
  applyDomainEventBatch,
  assertNever,
  causationIdFromCommandId,
  createFixedPlayerRoster,
  compareStableId,
  cloneFirstNightTaskCatalogSnapshot,
  evaluatePhaseTransition,
  rebuildOptionalGameState,
  SUPPORTED_SCRIPT_EDITION,
  SUPPORTED_SCRIPT_ID,
  SUPPORTED_SCRIPT_NAME,
  validateFirstNightTaskCatalogSnapshot,
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
  FirstNightInitializedPayload,
  FirstNightTaskCatalogSnapshot,
  FirstNightTaskPlan,
  FirstNightTaskPlanCreatedPayload,
  FirstNightTaskPlanningFailure,
  FirstNightTaskPlanningResult,
  InitialPrivateKnowledge,
  InitialPrivateKnowledgeEstablishedPayload,
  InitialPrivateKnowledgeGenerationFailure,
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
  InitialPrivateKnowledgeGenerationRejectionDetails,
  SetupGenerationRejectionDetails
} from "./command-result.js";
import type { CharacterAssignmentGeneratorPort } from "./ports/character-assignment-generator.js";
import type { CommandCommitStore, CommandReceipt } from "./ports/command-commit-store.js";
import type { FirstNightTaskPlannerPort } from "./ports/first-night-task-planner.js";
import type { InitialPrivateKnowledgeBuilderPort } from "./ports/initial-private-knowledge-builder.js";
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
  readonly initialPrivateKnowledgeBuilder?: InitialPrivateKnowledgeBuilderPort;
  readonly firstNightTaskPlanner?: FirstNightTaskPlannerPort;
  readonly firstNightTaskCatalogSnapshot?: FirstNightTaskCatalogSnapshot;
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

const firstNightTaskPlanningFailureMessage = (failure: FirstNightTaskPlanningFailure): string =>
  [
    `${failure.failureCode}: ${failure.message}`,
    `conflictingTaskIds=[${failure.conflictingTaskIds.join(",")}]`,
    `conflictingRoleIds=[${failure.conflictingRoleIds.join(",")}]`
  ].join("; ");

type FirstNightTaskPlannerRuntimeValidationResult =
  | {
      readonly valid: true;
      readonly result: FirstNightTaskPlanningResult;
    }
  | {
      readonly valid: false;
      readonly message: string;
    };

const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value) as unknown;
  return prototype === Object.prototype || prototype === null;
};

const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      return false;
    }
  }

  return true;
};

const isFirstNightTaskPlanningFailureCode = (value: unknown): value is FirstNightTaskPlanningFailure["failureCode"] =>
  value === "InvalidTaskCatalog" || value === "InvalidFirstNightState" || value === "InvalidTaskPlan";

const validateStringDenseArray = (value: unknown): boolean =>
  Array.isArray(value) && isDenseArray(value) && value.every((entry) => typeof entry === "string");

const invalidPlannerResult = (message: string): FirstNightTaskPlannerRuntimeValidationResult => ({
  valid: false,
  message
});

const validateFirstNightTaskPlannerRuntimeResultShape = (value: unknown): FirstNightTaskPlannerRuntimeValidationResult => {
  if (!isPlainRecord(value)) {
    return invalidPlannerResult("First-night task planner returned a malformed result: result must be a non-null plain object");
  }

  if (value.status === "failure") {
    if (!isFirstNightTaskPlanningFailureCode(value.failureCode)) {
      return invalidPlannerResult("First-night task planner returned a malformed failure result: failureCode is invalid");
    }

    if (typeof value.message !== "string") {
      return invalidPlannerResult("First-night task planner returned a malformed failure result: message must be a string");
    }

    if (!validateStringDenseArray(value.conflictingTaskIds)) {
      return invalidPlannerResult(
        "First-night task planner returned a malformed failure result: conflictingTaskIds must be a dense string array"
      );
    }

    if (!validateStringDenseArray(value.conflictingRoleIds)) {
      return invalidPlannerResult(
        "First-night task planner returned a malformed failure result: conflictingRoleIds must be a dense string array"
      );
    }

    return { valid: true, result: value as unknown as FirstNightTaskPlanningResult };
  }

  if (value.status === "success") {
    if (!Object.hasOwn(value, "taskPlan")) {
      return invalidPlannerResult("First-night task planner returned a malformed success result: taskPlan is missing");
    }

    let taskPlan: unknown;
    try {
      taskPlan = value.taskPlan;
    } catch (error: unknown) {
      return invalidPlannerResult(
        `First-night task planner returned a malformed success result: taskPlan access failed: ${errorMessage(
          error,
          "Unknown taskPlan access failure"
        )}`
      );
    }

    if (!isPlainRecord(taskPlan)) {
      return invalidPlannerResult(
        "First-night task planner returned a malformed success result: taskPlan must be a non-null plain object"
      );
    }

    return { valid: true, result: value as unknown as FirstNightTaskPlanningResult };
  }

  return invalidPlannerResult("First-night task planner returned a malformed result: status must be success or failure");
};

const validateFirstNightTaskPlannerRuntimeResult = (value: unknown): FirstNightTaskPlannerRuntimeValidationResult => {
  try {
    return validateFirstNightTaskPlannerRuntimeResultShape(value);
  } catch (error: unknown) {
    return invalidPlannerResult(
      `First-night task planner returned a malformed result: runtime validation failed: ${errorMessage(
        error,
        "Unknown planner result validation failure"
      )}`
    );
  }
};

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

    let state;
    try {
      state = rebuildOptionalGameState(events);
    } catch (error: unknown) {
      return failed(command.gameId, "CanonicalStateRebuildFailed", errorMessage(error, "Unknown canonical state rebuild failure"), "state-rebuild");
    }

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

      if (batch.code === "InitialPrivateKnowledgeGenerationFailed") {
        return this.recordRejected(command, rejected(command.gameId, batch.code, batch.message, currentGameVersion, false, batch.details));
      }

      return this.recordRejected(command, rejected(command.gameId, batch.code, batch.message, currentGameVersion));
    }

    const prospective = this.validateProspectiveBatch(command, state, batch);
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

      case "InitializeFirstNight": {
        if (command.actor.kind !== "system" && command.actor.kind !== "storyteller") {
          return {
            code: "ActorNotAllowed",
            message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
          };
        }

        if (state === undefined) {
          return { code: "GameNotCreated", message: "InitializeFirstNight requires an existing game" };
        }

        if (state.setup === undefined) {
          return { code: "SetupNotGenerated", message: "InitializeFirstNight requires generated setup" };
        }

        if (state.roster === undefined) {
          return { code: "PlayerRosterNotCreated", message: "InitializeFirstNight requires a player roster" };
        }

        if (state.assignment === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "InitializeFirstNight requires character assignment" };
        }

        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: `InitializeFirstNight cannot execute during ${state.phase}` };
        }

        if (state.firstNight !== undefined) {
          return { code: "FirstNightAlreadyInitialized", message: "First night has already been initialized" };
        }

        if (state.initialPrivateKnowledge !== undefined) {
          return {
            code: "InitialPrivateKnowledgeAlreadyEstablished",
            message: "Initial private knowledge has already been established"
          };
        }

        return undefined;
      }

      case "PlanFirstNightTasks": {
        if (command.actor.kind !== "system" && command.actor.kind !== "storyteller") {
          return {
            code: "ActorNotAllowed",
            message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
          };
        }

        if (state === undefined) {
          return { code: "GameNotCreated", message: "PlanFirstNightTasks requires an existing game" };
        }

        if (state.setup === undefined) {
          return { code: "SetupNotGenerated", message: "PlanFirstNightTasks requires generated setup" };
        }

        if (state.roster === undefined) {
          return { code: "PlayerRosterNotCreated", message: "PlanFirstNightTasks requires a player roster" };
        }

        if (state.assignment === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "PlanFirstNightTasks requires character assignment" };
        }

        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: `PlanFirstNightTasks cannot execute during ${state.phase}` };
        }

        if (state.firstNight === undefined) {
          return { code: "FirstNightNotInitialized", message: "PlanFirstNightTasks requires first night initialization" };
        }

        if (
          state.initialPrivateKnowledge === undefined ||
          state.initialPrivateKnowledge.knowledgeStage !== INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE
        ) {
          return {
            code: "InitialPrivateKnowledgeNotEstablished",
            message: "PlanFirstNightTasks requires initial own-character knowledge"
          };
        }

        if (state.firstNightTaskPlan !== undefined) {
          return { code: "FirstNightTaskPlanAlreadyCreated", message: "First-night task plan has already been created" };
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
  } | {
    readonly code: "InitialPrivateKnowledgeGenerationFailed";
    readonly message: string;
    readonly details: InitialPrivateKnowledgeGenerationRejectionDetails;
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

      const initialPrivateKnowledge = this.generateInitialPrivateKnowledgeOrReject(command, state, currentGameVersion);
      if (initialPrivateKnowledge !== undefined && "code" in initialPrivateKnowledge) {
        return initialPrivateKnowledge;
      }

      const firstNightTaskPlan = this.generateFirstNightTaskPlanOrReject(command, state, currentGameVersion);
      if (firstNightTaskPlan !== undefined && "code" in firstNightTaskPlan) {
        return firstNightTaskPlan;
      }

      return this.createBatch(command, state, currentGameVersion, generatedSetup, generatedAssignment, initialPrivateKnowledge, firstNightTaskPlan);
    } catch (error: unknown) {
      if (error instanceof EventMetadataGenerationError) {
        return failed(command.gameId, "MetadataGenerationFailed", error.message, "event-metadata", currentGameVersion);
      }

      if (error instanceof DomainError) {
        if (command.payload.commandType === "PlanFirstNightTasks") {
          return failed(
            command.gameId,
            "DependencyExecutionFailed",
            error.message,
            "first-night-task-planning",
            currentGameVersion
          );
        }

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

  private initialPrivateKnowledgeGenerationFailureDetails(
    failure: InitialPrivateKnowledgeGenerationFailure
  ): InitialPrivateKnowledgeGenerationRejectionDetails {
    return {
      kind: "initial-private-knowledge-generation",
      failure
    };
  }

  private generateInitialPrivateKnowledgeOrReject(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number
  ): InitialPrivateKnowledge | CommandExecutionFailed | {
    readonly code: "InitialPrivateKnowledgeGenerationFailed";
    readonly message: string;
    readonly details: InitialPrivateKnowledgeGenerationRejectionDetails;
  } | undefined {
    if (command.payload.commandType !== "InitializeFirstNight") {
      return undefined;
    }

    if (state === undefined || state.setup === undefined || state.roster === undefined || state.assignment === undefined) {
      return failed(
        command.gameId,
        "ApplicationNotConfigured",
        "InitializeFirstNight requires setup, roster, and assignment state",
        "initial-knowledge-generation",
        currentGameVersion
      );
    }

    const builder = this.dependencies.initialPrivateKnowledgeBuilder;
    if (builder === undefined) {
      return failed(
        command.gameId,
        "ApplicationNotConfigured",
        "Initial private knowledge builder dependency is not configured",
        "initial-knowledge-generation",
        currentGameVersion
      );
    }

    let result;
    try {
      result = builder.generate({
        roster: state.roster.entries,
        assignment: state.assignment.assignments,
        setup: state.setup
      });
    } catch (error: unknown) {
      return failed(
        command.gameId,
        "DependencyExecutionFailed",
        errorMessage(error, "Unknown initial private knowledge builder failure"),
        "initial-knowledge-generation",
        currentGameVersion
      );
    }

    if (result.status === "failure") {
      return {
        code: "InitialPrivateKnowledgeGenerationFailed",
        message: `${result.failureCode}: ${result.message}`,
        details: this.initialPrivateKnowledgeGenerationFailureDetails(result)
      };
    }

    return result.knowledge;
  }

  private generateFirstNightTaskPlanOrReject(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number
  ): FirstNightTaskPlan | CommandExecutionFailed | undefined {
    if (command.payload.commandType !== "PlanFirstNightTasks") {
      return undefined;
    }

    if (
      state === undefined ||
      state.setup === undefined ||
      state.roster === undefined ||
      state.assignment === undefined ||
      state.firstNight === undefined ||
      state.initialPrivateKnowledge === undefined
    ) {
      return failed(
        command.gameId,
        "ApplicationNotConfigured",
        "PlanFirstNightTasks requires setup, roster, assignment, first night, and initial private knowledge state",
        "first-night-task-planning",
        currentGameVersion
      );
    }

    const planner = this.dependencies.firstNightTaskPlanner;
    if (planner === undefined) {
      return failed(
        command.gameId,
        "ApplicationNotConfigured",
        "First-night task planner dependency is not configured",
        "first-night-task-planning",
        currentGameVersion
      );
    }

    const taskCatalogSnapshot = this.dependencies.firstNightTaskCatalogSnapshot;
    if (taskCatalogSnapshot === undefined) {
      return failed(
        command.gameId,
        "ApplicationNotConfigured",
        "First-night task catalog dependency is not configured",
        "first-night-task-planning",
        currentGameVersion
      );
    }

    const catalogValidation = validateFirstNightTaskCatalogSnapshot(taskCatalogSnapshot);
    if (!catalogValidation.valid) {
      return failed(
        command.gameId,
        "ApplicationNotConfigured",
        `Invalid first-night task catalog dependency: ${catalogValidation.reason}`,
        "first-night-task-planning",
        currentGameVersion
      );
    }

    const taskCatalogSnapshotCopy = cloneFirstNightTaskCatalogSnapshot(taskCatalogSnapshot);
    let result;
    try {
      result = planner.generate({
        nightNumber: 1,
        setup: state.setup,
        roster: state.roster.entries,
        assignment: state.assignment.assignments,
        firstNight: state.firstNight,
        initialPrivateKnowledge: state.initialPrivateKnowledge,
        taskCatalogSnapshot: taskCatalogSnapshotCopy
      });
    } catch (error: unknown) {
      return failed(
        command.gameId,
        "DependencyExecutionFailed",
        errorMessage(error, "Unknown first-night task planner failure"),
        "first-night-task-planning",
        currentGameVersion
      );
    }

    const runtimeValidation = validateFirstNightTaskPlannerRuntimeResult(result);
    if (!runtimeValidation.valid) {
      return failed(
        command.gameId,
        "DependencyExecutionFailed",
        runtimeValidation.message,
        "first-night-task-planning",
        currentGameVersion
      );
    }

    result = runtimeValidation.result;

    if (result.status === "failure") {
      return failed(
        command.gameId,
        result.failureCode === "InvalidTaskCatalog" ? "ApplicationNotConfigured" : "DependencyExecutionFailed",
        firstNightTaskPlanningFailureMessage(result),
        "first-night-task-planning",
        currentGameVersion
      );
    }

    return result.taskPlan;
  }

  private createBatch(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number,
    generatedSetup: GeneratedSetup | undefined,
    generatedAssignment: GeneratedCharacterAssignment | undefined,
    initialPrivateKnowledge: InitialPrivateKnowledge | undefined,
    firstNightTaskPlan: FirstNightTaskPlan | undefined
  ): DomainEventBatch {
    const newVersion = currentGameVersion + 1;
    const batch = this.createBatchId();
    const eventSequence = (state?.lastEventSequence ?? 0) + 1;
    const events = this.createEvents(
      command,
      batch,
      eventSequence,
      newVersion,
      state,
      generatedSetup,
      generatedAssignment,
      initialPrivateKnowledge,
      firstNightTaskPlan
    );

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
    generatedAssignment: GeneratedCharacterAssignment | undefined,
    initialPrivateKnowledge: InitialPrivateKnowledge | undefined,
    firstNightTaskPlan: FirstNightTaskPlan | undefined
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

      case "InitializeFirstNight": {
        if (
          state === undefined ||
          state.setup === undefined ||
          state.roster === undefined ||
          state.assignment === undefined ||
          initialPrivateKnowledge === undefined
        ) {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "InitializeFirstNight event creation requires setup, roster, assignment, and generated private knowledge"
          );
        }

        const firstNightInitializedEvent: DomainEventEnvelope<"FirstNightInitialized"> = {
          ...common(firstEventSequence),
          eventType: "FirstNightInitialized" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            initializationVersion: SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
            nightNumber: 1,
            rosterVersion: state.roster.rosterVersion,
            assignmentAlgorithmVersion: state.assignment.assignmentAlgorithmVersion,
            roleCatalogSignature: state.setup.roleCatalogSignature
          } satisfies FirstNightInitializedPayload
        };

        const initialPrivateKnowledgeEstablishedEvent: DomainEventEnvelope<"InitialPrivateKnowledgeEstablished"> = {
          ...common(firstEventSequence + 1),
          eventType: "InitialPrivateKnowledgeEstablished" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            knowledgeModelVersion: SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
            knowledgeStage: initialPrivateKnowledge.knowledgeStage,
            rosterVersion: state.roster.rosterVersion,
            assignmentAlgorithmVersion: state.assignment.assignmentAlgorithmVersion,
            roleCatalogSignature: state.setup.roleCatalogSignature,
            entries: initialPrivateKnowledge.entries
          } satisfies InitialPrivateKnowledgeEstablishedPayload
        };

        return [firstNightInitializedEvent, initialPrivateKnowledgeEstablishedEvent];
      }

      case "PlanFirstNightTasks": {
        if (
          state === undefined ||
          state.setup === undefined ||
          state.roster === undefined ||
          state.assignment === undefined ||
          state.firstNight === undefined ||
          state.initialPrivateKnowledge === undefined ||
          firstNightTaskPlan === undefined
        ) {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "PlanFirstNightTasks event creation requires first-night source facts and a generated task plan"
          );
        }

        const firstNightTaskPlanCreatedEvent: DomainEventEnvelope<"FirstNightTaskPlanCreated"> = {
          ...common(firstEventSequence),
          eventType: "FirstNightTaskPlanCreated" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            nightNumber: firstNightTaskPlan.nightNumber,
            taskPlanVersion: firstNightTaskPlan.taskPlanVersion,
            taskCatalogVersion: firstNightTaskPlan.taskCatalogVersion,
            taskCatalogSignatureAlgorithm: firstNightTaskPlan.taskCatalogSignatureAlgorithm,
            taskCatalogSignature: firstNightTaskPlan.taskCatalogSignature,
            taskCatalogSnapshot: firstNightTaskPlan.taskCatalogSnapshot,
            rosterVersion: firstNightTaskPlan.rosterVersion,
            assignmentAlgorithmVersion: firstNightTaskPlan.assignmentAlgorithmVersion,
            roleCatalogSignature: firstNightTaskPlan.roleCatalogSignature,
            knowledgeModelVersion: firstNightTaskPlan.knowledgeModelVersion,
            knowledgeStage: firstNightTaskPlan.knowledgeStage,
            tasks: firstNightTaskPlan.tasks
          } satisfies FirstNightTaskPlanCreatedPayload
        };

        return [firstNightTaskPlanCreatedEvent];
      }
    }

    return assertNever(command.payload);
  }

  private validateProspectiveBatch(
    command: SupportedCommandEnvelope,
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

      if (command.payload.commandType === "PlanFirstNightTasks") {
        return failed(
          batch.gameId,
          "DependencyExecutionFailed",
          error.message,
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
