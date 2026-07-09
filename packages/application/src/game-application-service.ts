import {
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  DEMON_INFORMATION_KNOWLEDGE_STAGE,
  MINION_INFORMATION_KNOWLEDGE_STAGE,
  SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_ROSTER_VERSION,
  DomainError,
  applyDomainEventBatch,
  assertNever,
  causationIdFromCommandId,
  cloneDeliveredEvilTeamSnapshot,
  createFixedPlayerRoster,
  compareStableId,
  cloneFirstNightTaskCatalogSnapshot,
  createPhilosopherDeferredScheduledTaskSettlement,
  createAbilityImpairmentAppliedPayload,
  createFirstNightTaskInsertedPayload,
  createPhilosopherAbilityChosenPayload,
  createPhilosopherAbilityChosenScheduledTaskSettlement,
  createPhilosopherAbilityGrantedPayload,
  createFirstNightRoleActionOpportunity,
  findFirstNightActionOpportunityById,
  findFirstNightActionOpportunityForTask,
  getNextUnsettledFirstNightTask,
  isFirstNightTaskSettled,
  isSupportedFirstNightRoleActionTask,
  tryCreateFirstNightRoleActionOpportunity,
  evaluatePhaseTransition,
  rebuildOptionalGameState,
  sameRoleSetupSnapshot,
  SUPPORTED_SCRIPT_EDITION,
  SUPPORTED_SCRIPT_ID,
  SUPPORTED_SCRIPT_NAME,
  validateFirstNightTaskCatalogSnapshot,
  validatePhilosopherGoodCharacterChoice,
  validateDomainBatchSemantics
} from "@botc/domain-core";
import type {
  AssignmentGenerationFailure,
  BatchId,
  DomainEventBatch,
  AnyDomainEventEnvelope,
  DomainEventEnvelope,
  EventId,
  FirstNightActionOpportunityCreatedPayload,
  AbilityImpairmentAppliedPayload,
  FirstNightTaskInsertedPayload,
  GeneratedCharacterAssignment,
  GeneratedSetup,
  GameState,
  CharactersAssignedPayload,
  DemonInformationDeliveredPayload,
  DemonInformationEntry,
  FirstNightInitializedPayload,
  PhilosopherActionDeferredPayload,
  FirstNightTaskCatalogSnapshot,
  FirstNightTaskPlan,
  FirstNightTaskPlanCreatedPayload,
  FirstNightTaskPlanningFailure,
  FirstNightTaskPlanningResult,
  FirstNightSystemInformationFailureCode,
  FirstNightSystemInformationResolution,
  FirstNightSystemInformationResolutionResult,
  InitialPrivateKnowledge,
  InitialPrivateKnowledgeEstablishedPayload,
  InitialPrivateKnowledgeGenerationFailure,
  MinionInformationDeliveredPayload,
  MinionInformationEntry,
  PhaseTransitionedPayload,
  PhilosopherAbilityChosenPayload,
  PhilosopherAbilityGrantedPayload,
  PlayerRosterCreatedPayload,
  ScheduledTaskSettledPayload,
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
import type { FirstNightSystemInformationResolverPort } from "./ports/first-night-system-information-resolver.js";
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
  readonly firstNightSystemInformationResolver?: FirstNightSystemInformationResolverPort;
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

const hasExactEnumerableKeys = (value: Record<string, unknown>, keys: readonly string[]): boolean => {
  const actualKeys = Object.keys(value).sort();
  const expectedKeys = [...keys].sort();
  return actualKeys.length === expectedKeys.length && actualKeys.every((key, index) => key === expectedKeys[index]);
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

type FirstNightSystemInformationRuntimeValidationResult =
  | {
      readonly valid: true;
      readonly result: FirstNightSystemInformationResolutionResult;
    }
  | {
      readonly valid: false;
      readonly message: string;
    };

const isFirstNightSystemInformationFailureCode = (value: unknown): value is FirstNightSystemInformationFailureCode =>
  value === "InvalidCurrentCharacterState" ||
  value === "InvalidTaskType" ||
  value === "InvalidRoster" ||
  value === "InvalidSetup" ||
  value === "InvalidEvilTeam" ||
  value === "InvalidKnowledgeResult";

const invalidSystemInformationResult = (message: string): FirstNightSystemInformationRuntimeValidationResult => ({
  valid: false,
  message
});

const KNOWN_PLAYER_REFERENCE_KEYS = ["playerId", "seatNumber"] as const;
const DELIVERED_EVIL_TEAM_SNAPSHOT_KEYS = ["characterStateRevision", "demon", "minions"] as const;
const FIRST_NIGHT_SYSTEM_INFORMATION_RESOLUTION_KEYS = [
  "characterStateRevision",
  "entries",
  "knowledgeModelVersion",
  "knowledgeStage",
  "resolvedEvilTeam",
  "taskId",
  "taskType"
] as const;

const hasExactKnownPlayerReferenceShape = (value: unknown): boolean =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, KNOWN_PLAYER_REFERENCE_KEYS) &&
  typeof value.playerId === "string" &&
  value.playerId.trim().length > 0 &&
  typeof value.seatNumber === "number" &&
  Number.isInteger(value.seatNumber) &&
  value.seatNumber >= 1 &&
  value.seatNumber <= 12;

const sameKnownPlayerReference = (left: Record<string, unknown>, right: Record<string, unknown>): boolean =>
  left.playerId === right.playerId && left.seatNumber === right.seatNumber;

const hasExactDeliveredEvilTeamSnapshotShape = (value: unknown, characterStateRevision: number): boolean => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, DELIVERED_EVIL_TEAM_SNAPSHOT_KEYS)) {
    return false;
  }

  if (
    value.characterStateRevision !== characterStateRevision ||
    !hasExactKnownPlayerReferenceShape(value.demon) ||
    !Array.isArray(value.minions) ||
    !isDenseArray(value.minions) ||
    value.minions.length !== 2 ||
    value.minions.some((minion) => !hasExactKnownPlayerReferenceShape(minion))
  ) {
    return false;
  }

  const demon = value.demon as Record<string, unknown>;
  const minions = value.minions as readonly Record<string, unknown>[];
  if (!minions.every((minion, index) => index === 0 || (minions[index - 1]?.seatNumber as number) < (minion.seatNumber as number))) {
    return false;
  }

  const references = [demon, ...minions];
  const playerIds = new Set(references.map((reference) => reference.playerId));
  const seatNumbers = new Set(references.map((reference) => reference.seatNumber));
  if (playerIds.size !== references.length || seatNumbers.size !== references.length) {
    return false;
  }

  return minions.every((minion) => !sameKnownPlayerReference(minion, demon));
};

const validateFirstNightSystemInformationResolutionRuntimeShape = (value: unknown): boolean => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, FIRST_NIGHT_SYSTEM_INFORMATION_RESOLUTION_KEYS)) {
    return false;
  }

  if (
    typeof value.taskId !== "string" ||
    value.taskId.trim().length === 0 ||
    (value.taskType !== "MINION_INFO" && value.taskType !== "DEMON_INFO") ||
    typeof value.characterStateRevision !== "number" ||
    !Number.isInteger(value.characterStateRevision) ||
    value.characterStateRevision <= 0 ||
    !hasExactDeliveredEvilTeamSnapshotShape(value.resolvedEvilTeam, value.characterStateRevision) ||
    value.knowledgeModelVersion !== SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION ||
    !Array.isArray(value.entries) ||
    !isDenseArray(value.entries) ||
    value.entries.some((entry) => !isPlainRecord(entry))
  ) {
    return false;
  }

  return value.taskType === "MINION_INFO"
    ? value.knowledgeStage === MINION_INFORMATION_KNOWLEDGE_STAGE
    : value.knowledgeStage === DEMON_INFORMATION_KNOWLEDGE_STAGE;
};

const validateFirstNightSystemInformationResolverRuntimeResultShape = (
  value: unknown
): FirstNightSystemInformationRuntimeValidationResult => {
  if (!isPlainRecord(value)) {
    return invalidSystemInformationResult("First-night system information resolver returned a malformed result: result must be a non-null plain object");
  }

  if (value.status === "failure") {
    if (!isFirstNightSystemInformationFailureCode(value.failureCode)) {
      return invalidSystemInformationResult("First-night system information resolver returned a malformed failure result: failureCode is invalid");
    }

    if (typeof value.message !== "string") {
      return invalidSystemInformationResult("First-night system information resolver returned a malformed failure result: message must be a string");
    }

    if (!validateStringDenseArray(value.conflictingPlayerIds)) {
      return invalidSystemInformationResult(
        "First-night system information resolver returned a malformed failure result: conflictingPlayerIds must be a dense string array"
      );
    }

    return { valid: true, result: value as unknown as FirstNightSystemInformationResolutionResult };
  }

  if (value.status === "success") {
    if (!Object.hasOwn(value, "resolution")) {
      return invalidSystemInformationResult("First-night system information resolver returned a malformed success result: resolution is missing");
    }

    let resolution: unknown;
    try {
      resolution = value.resolution;
    } catch (error: unknown) {
      return invalidSystemInformationResult(
        `First-night system information resolver returned a malformed success result: resolution access failed: ${errorMessage(
          error,
          "Unknown resolution access failure"
        )}`
      );
    }

    if (!validateFirstNightSystemInformationResolutionRuntimeShape(resolution)) {
      return invalidSystemInformationResult(
        "First-night system information resolver returned a malformed success result: resolution must have supported runtime shape"
      );
    }

    return { valid: true, result: value as unknown as FirstNightSystemInformationResolutionResult };
  }

  return invalidSystemInformationResult("First-night system information resolver returned a malformed result: status must be success or failure");
};

const validateFirstNightSystemInformationResolverRuntimeResult = (
  value: unknown
): FirstNightSystemInformationRuntimeValidationResult => {
  try {
    return validateFirstNightSystemInformationResolverRuntimeResultShape(value);
  } catch (error: unknown) {
    return invalidSystemInformationResult(
      `First-night system information resolver returned a malformed result: runtime validation failed: ${errorMessage(
        error,
        "Unknown system information result validation failure"
      )}`
    );
  }
};

const firstNightSystemInformationFailureMessage = (
  failure: Extract<FirstNightSystemInformationResolutionResult, { readonly status: "failure" }>
): string =>
  [
    `${failure.failureCode}: ${failure.message}`,
    `conflictingPlayerIds=[${failure.conflictingPlayerIds.join(",")}]`
  ].join("; ");

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

      case "SettleFirstNightSystemTask": {
        if (command.actor.kind !== "system" && command.actor.kind !== "storyteller") {
          return {
            code: "ActorNotAllowed",
            message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
          };
        }

        if (state === undefined) {
          return { code: "GameNotCreated", message: "SettleFirstNightSystemTask requires an existing game" };
        }

        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: `SettleFirstNightSystemTask cannot execute during ${state.phase}` };
        }

        if (state.firstNight === undefined) {
          return { code: "FirstNightNotInitialized", message: "SettleFirstNightSystemTask requires first night initialization" };
        }

        if (state.initialPrivateKnowledge === undefined) {
          return {
            code: "InitialPrivateKnowledgeNotEstablished",
            message: "SettleFirstNightSystemTask requires initial own-character knowledge"
          };
        }

        if (state.firstNightTaskPlan === undefined) {
          return { code: "FirstNightTaskPlanNotCreated", message: "SettleFirstNightSystemTask requires a first-night task plan" };
        }

        if (state.currentCharacterState === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "SettleFirstNightSystemTask requires current character state" };
        }

        const requestedTaskId = command.payload.taskId;
        const targetTask = state.firstNightTaskPlan.tasks.find((task) => task.taskId === requestedTaskId);
        if (targetTask === undefined) {
          return { code: "ScheduledTaskNotFound", message: `Scheduled task ${requestedTaskId} does not exist in the first-night task plan` };
        }

        if (isFirstNightTaskSettled(state.firstNightTaskProgress, requestedTaskId)) {
          return { code: "ScheduledTaskAlreadySettled", message: `Scheduled task ${requestedTaskId} is already settled` };
        }

        const nextTask = getNextUnsettledFirstNightTask(state.firstNightTaskPlan, state.firstNightTaskProgress);
        if (nextTask === undefined) {
          return { code: "ScheduledTaskAlreadySettled", message: "All first-night tasks are already settled" };
        }

        if (nextTask.taskId !== targetTask.taskId) {
          if (nextTask.taskClass !== "SYSTEM_INFORMATION" || (nextTask.taskType !== "MINION_INFO" && nextTask.taskType !== "DEMON_INFO")) {
            return {
              code: "NextTaskRequiresRoleExecution",
              message: `Cannot settle ${targetTask.taskType} before required role task ${nextTask.taskType}`
            };
          }

          return {
            code: "ScheduledTaskNotNext",
            message: `Scheduled task ${targetTask.taskId} is not the next unsettled first-night task`
          };
        }

        if (
          targetTask.source.kind !== "SYSTEM" ||
          targetTask.taskClass !== "SYSTEM_INFORMATION" ||
          (targetTask.taskType !== "MINION_INFO" && targetTask.taskType !== "DEMON_INFO")
        ) {
          return {
            code: "UnsupportedSystemTaskSettlement",
            message: `SettleFirstNightSystemTask cannot settle ${targetTask.taskType}`
          };
        }

        return undefined;
      }

      case "OpenFirstNightRoleActionOpportunity": {
        if (command.actor.kind !== "system" && command.actor.kind !== "storyteller") {
          return {
            code: "ActorNotAllowed",
            message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
          };
        }

        if (state === undefined) {
          return { code: "GameNotCreated", message: "OpenFirstNightRoleActionOpportunity requires an existing game" };
        }

        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return {
            code: "CommandNotAllowedInPhase",
            message: `OpenFirstNightRoleActionOpportunity cannot execute during ${state.phase}`
          };
        }

        if (state.firstNight === undefined) {
          return { code: "FirstNightNotInitialized", message: "OpenFirstNightRoleActionOpportunity requires first night initialization" };
        }

        if (state.firstNightTaskPlan === undefined) {
          return { code: "FirstNightTaskPlanNotCreated", message: "OpenFirstNightRoleActionOpportunity requires a first-night task plan" };
        }

        if (state.currentCharacterState === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "OpenFirstNightRoleActionOpportunity requires current character state" };
        }

        const requestedTaskId = command.payload.taskId;
        const targetTask = state.firstNightTaskPlan.tasks.find((task) => task.taskId === requestedTaskId);
        if (targetTask === undefined) {
          return { code: "ScheduledTaskNotFound", message: `Scheduled task ${requestedTaskId} does not exist in the first-night task plan` };
        }

        const existingOpportunity = findFirstNightActionOpportunityForTask(state.firstNightActionOpportunities, targetTask.taskId);
        if (existingOpportunity?.opportunityStatus === "OPEN") {
          return {
            code: "ActionOpportunityAlreadyOpen",
            message: `Action opportunity for scheduled task ${targetTask.taskId} is already open`
          };
        }

        if (existingOpportunity?.opportunityStatus === "CLOSED") {
          return {
            code: "ActionOpportunityAlreadyClosed",
            message: `Action opportunity for scheduled task ${targetTask.taskId} is already closed`
          };
        }

        if (isFirstNightTaskSettled(state.firstNightTaskProgress, requestedTaskId)) {
          return { code: "ScheduledTaskAlreadySettled", message: `Scheduled task ${requestedTaskId} is already settled` };
        }

        const nextTask = getNextUnsettledFirstNightTask(state.firstNightTaskPlan, state.firstNightTaskProgress);
        if (nextTask === undefined) {
          return { code: "ScheduledTaskAlreadySettled", message: "All first-night tasks are already settled" };
        }

        if (nextTask.taskId !== targetTask.taskId) {
          return {
            code: "ScheduledTaskNotNext",
            message: `Scheduled task ${targetTask.taskId} is not the next unsettled first-night task`
          };
        }

        if (!isSupportedFirstNightRoleActionTask(targetTask)) {
          return {
            code: "UnsupportedRoleActionOpportunity",
            message: `OpenFirstNightRoleActionOpportunity cannot open ${targetTask.taskType}`
          };
        }

        const sourceValidation = tryCreateFirstNightRoleActionOpportunity({
          taskId: requestedTaskId,
          firstNightTaskPlan: state.firstNightTaskPlan,
          firstNightTaskProgress: state.firstNightTaskProgress,
          currentCharacterState: state.currentCharacterState,
          firstNightActionOpportunities: state.firstNightActionOpportunities
        });
        if (!sourceValidation.valid) {
          return {
            code: "ActionSourceNoLongerValid",
            message: sourceValidation.reason
          };
        }

        return undefined;
      }

      case "SubmitPhilosopherAction": {
        if (state === undefined) {
          return { code: "GameNotCreated", message: "SubmitPhilosopherAction requires an existing game" };
        }

        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: `SubmitPhilosopherAction cannot execute during ${state.phase}` };
        }

        if (state.firstNight === undefined) {
          return { code: "FirstNightNotInitialized", message: "SubmitPhilosopherAction requires first night initialization" };
        }

        if (state.firstNightTaskPlan === undefined) {
          return { code: "FirstNightTaskPlanNotCreated", message: "SubmitPhilosopherAction requires a first-night task plan" };
        }

        if (state.currentCharacterState === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "SubmitPhilosopherAction requires current character state" };
        }

        const requestedTaskId = command.payload.taskId;
        const targetTask = state.firstNightTaskPlan.tasks.find((task) => task.taskId === requestedTaskId);
        if (targetTask === undefined) {
          return { code: "ScheduledTaskNotFound", message: `Scheduled task ${requestedTaskId} does not exist in the first-night task plan` };
        }

        const opportunity = findFirstNightActionOpportunityById(state.firstNightActionOpportunities, command.payload.opportunityId);
        if (opportunity === undefined) {
          return {
            code: "ActionOpportunityNotFound",
            message: `Action opportunity ${command.payload.opportunityId} does not exist`
          };
        }

        if ((command.actor.kind === "human" || command.actor.kind === "ai") && command.actor.playerId !== opportunity.sourcePlayerId) {
          return {
            code: "ActorPlayerMismatch",
            message: "SubmitPhilosopherAction actor must match the action opportunity source player"
          };
        }

        const decision = command.payload.decision as unknown;
        if (!isPlainRecord(decision) || typeof decision.kind !== "string") {
          return {
            code: "InvalidPhilosopherAbilityChoice",
            message: "SubmitPhilosopherAction decision must be a non-null plain object with a supported kind"
          };
        }

        if (decision.kind !== "DEFER" && decision.kind !== "CHOOSE_GOOD_CHARACTER") {
          return {
            code: "UnsupportedPhilosopherAbilityChoice",
            message: "SubmitPhilosopherAction decision kind is not supported in this slice"
          };
        }

        if (decision.kind === "DEFER" && !hasExactEnumerableKeys(decision, ["kind"])) {
          return {
            code: "InvalidPhilosopherAbilityChoice",
            message: "DEFER decision must not include extra fields"
          };
        }

        if (opportunity.opportunityStatus === "CLOSED") {
          return {
            code: "ActionOpportunityAlreadyClosed",
            message: `Action opportunity ${command.payload.opportunityId} is already closed`
          };
        }

        if (opportunity.taskId !== requestedTaskId) {
          return {
            code: "ScheduledTaskNotNext",
            message: "SubmitPhilosopherAction taskId must match the referenced action opportunity"
          };
        }

        if (isFirstNightTaskSettled(state.firstNightTaskProgress, requestedTaskId)) {
          return { code: "ScheduledTaskAlreadySettled", message: `Scheduled task ${requestedTaskId} is already settled` };
        }

        const nextTask = getNextUnsettledFirstNightTask(state.firstNightTaskPlan, state.firstNightTaskProgress);
        if (nextTask === undefined) {
          return { code: "ScheduledTaskAlreadySettled", message: "All first-night tasks are already settled" };
        }

        if (nextTask.taskId !== targetTask.taskId) {
          return {
            code: "ScheduledTaskNotNext",
            message: `Scheduled task ${targetTask.taskId} is not the next unsettled first-night task`
          };
        }

        if (targetTask.taskType !== "PHILOSOPHER_ACTION" || opportunity.opportunityKind !== "PHILOSOPHER_FIRST_NIGHT_ACTION") {
          return {
            code: "UnsupportedRoleActionOpportunity",
            message: `SubmitPhilosopherAction cannot settle ${targetTask.taskType}`
          };
        }

        const currentSourceEntry = state.currentCharacterState.entries.find((entry) =>
          entry.playerId === opportunity.sourcePlayerId &&
          entry.seatNumber === opportunity.sourceSeatNumber
        );

        if (
          opportunity.sourceCharacterStateRevision !== state.currentCharacterState.revision ||
          targetTask.source.kind !== "ROLE" ||
          targetTask.source.playerId !== opportunity.sourcePlayerId ||
          targetTask.source.seatNumber !== opportunity.sourceSeatNumber ||
          targetTask.source.role.roleId !== "philosopher" ||
          currentSourceEntry === undefined ||
          currentSourceEntry.role.roleId !== "philosopher" ||
          !sameRoleSetupSnapshot(currentSourceEntry.role, opportunity.sourceRole)
        ) {
          return {
            code: "ActionSourceNoLongerValid",
            message: "SubmitPhilosopherAction source is no longer the same current Philosopher state"
          };
        }

        if (decision.kind === "CHOOSE_GOOD_CHARACTER") {
          if (state.setup === undefined) {
            return { code: "SetupNotGenerated", message: "SubmitPhilosopherAction ability choice requires setup role catalog" };
          }

          const choiceValidation = validatePhilosopherGoodCharacterChoice(decision, state.setup);
          if (!choiceValidation.valid) {
            return {
              code: choiceValidation.code,
              message: choiceValidation.reason
            };
          }
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

      const firstNightSystemInformation = this.resolveFirstNightSystemInformationOrReject(command, state, currentGameVersion);
      if (firstNightSystemInformation !== undefined && "code" in firstNightSystemInformation) {
        return firstNightSystemInformation;
      }

      return this.createBatch(
        command,
        state,
        currentGameVersion,
        generatedSetup,
        generatedAssignment,
        initialPrivateKnowledge,
        firstNightTaskPlan,
        firstNightSystemInformation
      );
    } catch (error: unknown) {
      if (error instanceof EventMetadataGenerationError) {
        return failed(command.gameId, "MetadataGenerationFailed", error.message, "event-metadata", currentGameVersion);
      }

      if (error instanceof DomainError) {
        if (
          command.payload.commandType === "PlanFirstNightTasks" ||
          command.payload.commandType === "SettleFirstNightSystemTask" ||
          command.payload.commandType === "OpenFirstNightRoleActionOpportunity" ||
          command.payload.commandType === "SubmitPhilosopherAction"
        ) {
          const failureStage = command.payload.commandType === "PlanFirstNightTasks"
            ? "first-night-task-planning"
            : command.payload.commandType === "SettleFirstNightSystemTask"
              ? "first-night-system-information"
              : "first-night-role-action";
          return failed(
            command.gameId,
            "DependencyExecutionFailed",
            error.message,
            failureStage,
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

  private resolveFirstNightSystemInformationOrReject(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number
  ): FirstNightSystemInformationResolution | CommandExecutionFailed | undefined {
    if (command.payload.commandType !== "SettleFirstNightSystemTask") {
      return undefined;
    }

    if (
      state === undefined ||
      state.setup === undefined ||
      state.roster === undefined ||
      state.currentCharacterState === undefined ||
      state.firstNightTaskPlan === undefined
    ) {
      return failed(
        command.gameId,
        "ApplicationNotConfigured",
        "SettleFirstNightSystemTask requires setup, roster, current character state, and first-night task plan",
        "first-night-system-information",
        currentGameVersion
      );
    }

    const requestedTaskId = command.payload.taskId;
    const targetTask = state.firstNightTaskPlan.tasks.find((task) => task.taskId === requestedTaskId);
    if (targetTask === undefined || (targetTask.taskType !== "MINION_INFO" && targetTask.taskType !== "DEMON_INFO")) {
      return failed(
        command.gameId,
        "ApplicationNotConfigured",
        "SettleFirstNightSystemTask requires a supported system information task",
        "first-night-system-information",
        currentGameVersion
      );
    }

    const resolver = this.dependencies.firstNightSystemInformationResolver;
    if (resolver === undefined) {
      return failed(
        command.gameId,
        "ApplicationNotConfigured",
        "First-night system information resolver dependency is not configured",
        "first-night-system-information",
        currentGameVersion
      );
    }

    let result;
    try {
      result = resolver.resolve({
        taskType: targetTask.taskType,
        taskId: targetTask.taskId,
        currentCharacterState: state.currentCharacterState,
        roster: state.roster.entries,
        setup: state.setup
      });
    } catch (error: unknown) {
      return failed(
        command.gameId,
        "DependencyExecutionFailed",
        errorMessage(error, "Unknown first-night system information resolver failure"),
        "first-night-system-information",
        currentGameVersion
      );
    }

    const runtimeValidation = validateFirstNightSystemInformationResolverRuntimeResult(result);
    if (!runtimeValidation.valid) {
      return failed(
        command.gameId,
        "DependencyExecutionFailed",
        runtimeValidation.message,
        "first-night-system-information",
        currentGameVersion
      );
    }

    result = runtimeValidation.result;

    if (result.status === "failure") {
      return failed(
        command.gameId,
        "DependencyExecutionFailed",
        firstNightSystemInformationFailureMessage(result),
        "first-night-system-information",
        currentGameVersion
      );
    }

    return result.resolution;
  }

  private createBatch(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number,
    generatedSetup: GeneratedSetup | undefined,
    generatedAssignment: GeneratedCharacterAssignment | undefined,
    initialPrivateKnowledge: InitialPrivateKnowledge | undefined,
    firstNightTaskPlan: FirstNightTaskPlan | undefined,
    firstNightSystemInformation: FirstNightSystemInformationResolution | undefined
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
      firstNightTaskPlan,
      firstNightSystemInformation
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
    firstNightTaskPlan: FirstNightTaskPlan | undefined,
    firstNightSystemInformation: FirstNightSystemInformationResolution | undefined
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

      case "OpenFirstNightRoleActionOpportunity": {
        if (
          state === undefined ||
          state.firstNightTaskPlan === undefined ||
          state.currentCharacterState === undefined
        ) {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "OpenFirstNightRoleActionOpportunity event creation requires task plan and current character state"
          );
        }

        const opportunity = createFirstNightRoleActionOpportunity({
          taskId: command.payload.taskId,
          firstNightTaskPlan: state.firstNightTaskPlan,
          firstNightTaskProgress: state.firstNightTaskProgress,
          currentCharacterState: state.currentCharacterState,
          firstNightActionOpportunities: state.firstNightActionOpportunities
        });

        const firstNightActionOpportunityCreatedEvent: DomainEventEnvelope<"FirstNightActionOpportunityCreated"> = {
          ...common(firstEventSequence),
          eventType: "FirstNightActionOpportunityCreated" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            ...opportunity
          } satisfies FirstNightActionOpportunityCreatedPayload
        };

        return [firstNightActionOpportunityCreatedEvent];
      }

      case "SubmitPhilosopherAction": {
        if (
          state === undefined ||
          state.firstNightTaskPlan === undefined ||
          state.currentCharacterState === undefined
        ) {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "SubmitPhilosopherAction event creation requires task plan and current character state"
          );
        }

        const opportunity = findFirstNightActionOpportunityById(
          state.firstNightActionOpportunities,
          command.payload.opportunityId
        );
        if (opportunity === undefined || opportunity.opportunityStatus !== "OPEN") {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "SubmitPhilosopherAction event creation requires an open action opportunity"
          );
        }
        if (opportunity.opportunityKind !== "PHILOSOPHER_FIRST_NIGHT_ACTION" || opportunity.taskType !== "PHILOSOPHER_ACTION") {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "SubmitPhilosopherAction event creation requires a Philosopher action opportunity"
          );
        }

        if (command.payload.decision.kind === "CHOOSE_GOOD_CHARACTER") {
          if (state.setup === undefined) {
            throw new DomainError(
              "InvalidPhilosopherAbilityChosenPayload",
              "SubmitPhilosopherAction ability choice event creation requires setup role catalog"
            );
          }

          const choiceValidation = validatePhilosopherGoodCharacterChoice(command.payload.decision, state.setup);
          if (!choiceValidation.valid) {
            throw new DomainError("InvalidPhilosopherAbilityChosenPayload", choiceValidation.reason);
          }

          const choicePayload = createPhilosopherAbilityChosenPayload({
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            opportunityId: opportunity.opportunityId,
            taskId: opportunity.taskId,
            chosenRole: choiceValidation.chosenRole,
            setup: state.setup,
            firstNightActionOpportunities: state.firstNightActionOpportunities
          });

          const philosopherAbilityChosenEvent: DomainEventEnvelope<"PhilosopherAbilityChosen"> = {
            ...common(firstEventSequence),
            eventType: "PhilosopherAbilityChosen" as const,
            payload: choicePayload satisfies PhilosopherAbilityChosenPayload
          };

          const grantPayload = createPhilosopherAbilityGrantedPayload({
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            choice: choicePayload
          });

          const philosopherAbilityGrantedEvent: DomainEventEnvelope<"PhilosopherAbilityGranted"> = {
            ...common(firstEventSequence + 1),
            eventType: "PhilosopherAbilityGranted" as const,
            payload: grantPayload satisfies PhilosopherAbilityGrantedPayload
          };

          const optionalEvents: AnyDomainEventEnvelope[] = [];
          const impairmentPayload = createAbilityImpairmentAppliedPayload({
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            choice: choicePayload,
            currentCharacterState: state.currentCharacterState
          });
          if (impairmentPayload !== undefined) {
            optionalEvents.push({
              ...common(firstEventSequence + 2 + optionalEvents.length),
              eventType: "AbilityImpairmentApplied" as const,
              payload: impairmentPayload satisfies AbilityImpairmentAppliedPayload
            });
          }

          const insertionPayload = createFirstNightTaskInsertedPayload({
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            choice: choicePayload,
            firstNightTaskPlan: state.firstNightTaskPlan
          });
          if (insertionPayload !== undefined) {
            optionalEvents.push({
              ...common(firstEventSequence + 2 + optionalEvents.length),
              eventType: "FirstNightTaskInserted" as const,
              payload: insertionPayload satisfies FirstNightTaskInsertedPayload
            });
          }

          const settlement = createPhilosopherAbilityChosenScheduledTaskSettlement({
            taskId: opportunity.taskId,
            characterStateRevision: opportunity.sourceCharacterStateRevision
          });

          const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
            ...common(firstEventSequence + 2 + optionalEvents.length),
            eventType: "ScheduledTaskSettled" as const,
            payload: {
              rulesBaselineVersion: RULES_BASELINE_VERSION,
              ...settlement
            } satisfies ScheduledTaskSettledPayload
          };

          return [
            philosopherAbilityChosenEvent,
            philosopherAbilityGrantedEvent,
            ...optionalEvents,
            scheduledTaskSettledEvent
          ];
        }

        const philosopherActionDeferredEvent: DomainEventEnvelope<"PhilosopherActionDeferred"> = {
          ...common(firstEventSequence),
          eventType: "PhilosopherActionDeferred" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            nightNumber: 1,
            taskId: opportunity.taskId,
            taskType: opportunity.taskType,
            opportunityId: opportunity.opportunityId,
            decisionKind: "DEFER",
            sourcePlayerId: opportunity.sourcePlayerId,
            sourceSeatNumber: opportunity.sourceSeatNumber,
            sourceRole: opportunity.sourceRole,
            sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision
          } satisfies PhilosopherActionDeferredPayload
        };

        const settlement = createPhilosopherDeferredScheduledTaskSettlement({
          taskId: opportunity.taskId,
          characterStateRevision: opportunity.sourceCharacterStateRevision
        });

        const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
          ...common(firstEventSequence + 1),
          eventType: "ScheduledTaskSettled" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            ...settlement
          } satisfies ScheduledTaskSettledPayload
        };

        return [philosopherActionDeferredEvent, scheduledTaskSettledEvent];
      }

      case "SettleFirstNightSystemTask": {
        if (
          state === undefined ||
          state.setup === undefined ||
          state.roster === undefined ||
          state.currentCharacterState === undefined ||
          firstNightSystemInformation === undefined
        ) {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "SettleFirstNightSystemTask event creation requires source facts and resolved system information"
          );
        }

        const outcomeType = firstNightSystemInformation.taskType === "MINION_INFO"
          ? "MINION_INFORMATION_DELIVERED"
          : "DEMON_INFORMATION_DELIVERED";

        const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
          ...common(firstEventSequence + 1),
          eventType: "ScheduledTaskSettled" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            nightNumber: 1,
            taskId: firstNightSystemInformation.taskId,
            taskType: firstNightSystemInformation.taskType,
            settlementVersion: "scheduled-task-settlement-v1",
            outcomeType,
            characterStateRevision: firstNightSystemInformation.characterStateRevision
          } satisfies ScheduledTaskSettledPayload
        };

        if (firstNightSystemInformation.taskType === "MINION_INFO") {
          const minionInformationDeliveredEvent: DomainEventEnvelope<"MinionInformationDelivered"> = {
            ...common(firstEventSequence),
            eventType: "MinionInformationDelivered" as const,
            payload: {
              rulesBaselineVersion: RULES_BASELINE_VERSION,
              nightNumber: 1,
              taskId: firstNightSystemInformation.taskId,
              taskType: "MINION_INFO",
              knowledgeModelVersion: firstNightSystemInformation.knowledgeModelVersion,
              knowledgeStage: MINION_INFORMATION_KNOWLEDGE_STAGE,
              characterStateRevision: firstNightSystemInformation.characterStateRevision,
              resolvedEvilTeam: cloneDeliveredEvilTeamSnapshot(firstNightSystemInformation.resolvedEvilTeam),
              rosterVersion: state.roster.rosterVersion,
              roleCatalogSignature: state.setup.roleCatalogSignature,
              entries: firstNightSystemInformation.entries as readonly MinionInformationEntry[]
            } satisfies MinionInformationDeliveredPayload
          };

          return [minionInformationDeliveredEvent, scheduledTaskSettledEvent];
        }

        const demonInformationDeliveredEvent: DomainEventEnvelope<"DemonInformationDelivered"> = {
          ...common(firstEventSequence),
          eventType: "DemonInformationDelivered" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            nightNumber: 1,
            taskId: firstNightSystemInformation.taskId,
            taskType: "DEMON_INFO",
            knowledgeModelVersion: firstNightSystemInformation.knowledgeModelVersion,
            knowledgeStage: DEMON_INFORMATION_KNOWLEDGE_STAGE,
            characterStateRevision: firstNightSystemInformation.characterStateRevision,
            resolvedEvilTeam: cloneDeliveredEvilTeamSnapshot(firstNightSystemInformation.resolvedEvilTeam),
            rosterVersion: state.roster.rosterVersion,
            roleCatalogSignature: state.setup.roleCatalogSignature,
            entries: firstNightSystemInformation.entries as readonly DemonInformationEntry[]
          } satisfies DemonInformationDeliveredPayload
        };

        return [demonInformationDeliveredEvent, scheduledTaskSettledEvent];
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

      if (command.payload.commandType === "SettleFirstNightSystemTask") {
        return failed(
          batch.gameId,
          "DependencyExecutionFailed",
          error.message,
          "first-night-system-information",
          batch.expectedGameVersion
        );
      }

      if (
        command.payload.commandType === "OpenFirstNightRoleActionOpportunity" ||
        command.payload.commandType === "SubmitPhilosopherAction"
      ) {
        return failed(
          batch.gameId,
          "DependencyExecutionFailed",
          error.message,
          "first-night-role-action",
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
