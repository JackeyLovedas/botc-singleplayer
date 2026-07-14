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
  createFirstNightTaskInsertedV2Payload,
  createPhilosopherAbilityChosenPayload,
  createPhilosopherAbilityChosenScheduledTaskSettlement,
  createPhilosopherAbilityGrantedPayload,
  createFirstNightRoleActionOpportunity,
  createSnakeCharmerDemonHitScheduledTaskSettlement,
  createSnakeCharmerDemonSwapAppliedPayload,
  createSnakeCharmerIneffectiveResolvedPayload,
  createSnakeCharmerIneffectiveScheduledTaskSettlement,
  createSnakeCharmerNoSwapResolvedPayload,
  createSnakeCharmerNoSwapScheduledTaskSettlement,
  createSnakeCharmerPoisonedImpairmentPayload,
  createSnakeCharmerTargetChosenPayload,
  createWitchDeathPendingMarkedPayload,
  createWitchDeathPendingScheduledTaskSettlement,
  createWitchIneffectiveResolvedPayload,
  createWitchIneffectiveScheduledTaskSettlement,
  createWitchTargetChosenPayload,
  createCerenovusChoiceRecordedPayload,
  createCerenovusMadnessInstructionDeliveredPayload,
  createCerenovusMadnessMarkedPayload,
  createCerenovusScheduledTaskSettlement,
  evaluateCerenovusEffectiveOnlyCapability,
  findCerenovusOpportunity,
  formatCerenovusAbilityInstanceId,
  createDreamerInformationDeliveredPayload,
  createDreamerInformationDeliveredScheduledTaskSettlement,
  createDreamerTargetChosenPayload,
  createSeamstressDeferredScheduledTaskSettlement,
  createSeamstressActionDeferredPayloadV2,
  createSeamstressTargetsChosenPayload,
  createSeamstressAbilitySpentPayload,
  createSeamstressInformationDeliveredPayload,
  createSeamstressInformationDeliveredScheduledTaskSettlement,
  createSeamstressResolutionCapabilityDeclaredPayload,
  canonicalizeSeamstressTargets,
  createEvilTwinInformationDeliveredPayload,
  createEvilTwinPairEstablishedPayload,
  createEvilTwinPairEstablishedScheduledTaskSettlement,
  evaluateSnakeCharmerEffectiveness,
  evaluateWitchEffectiveness,
  evaluateDreamerEffectiveness,
  findFirstNightActionOpportunityById,
  findFirstNightActionOpportunityForTask,
  getNextUnsettledFirstNightTask,
  firstNightTaskTypeForPhilosopherChoice,
  CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION,
  LEGACY_FIRST_NIGHT_TASK_PLAN_VERSION,
  isFirstNightTaskSettled,
  isSupportedFirstNightRoleActionTask,
  isSeamstressActionOpportunityV2,
  isDreamerActionOpportunityV2,
  isRoleTenureContinuousAcross,
  tryCreateFirstNightRoleActionOpportunity,
  evaluatePhaseTransition,
  rebuildOptionalGameState,
  sameRoleSetupSnapshot,
  SUPPORTED_SCRIPT_EDITION,
  SUPPORTED_SCRIPT_ID,
  SUPPORTED_SCRIPT_NAME,
  validateFirstNightTaskCatalogSnapshot,
  validatePhilosopherGoodCharacterChoice,
  validateSnakeCharmerActionDecision,
  validateWitchActionDecision,
  validateCerenovusActionDecision,
  validateCerenovusActionOpportunityShape,
  validateDreamerActionDecision,
  validateSeamstressActionDecisionForOpportunity,
  canActorSettleClockmakerInformation,
  validateSettleClockmakerInformationCommandPayload,
  canActorSettleMathematicianInformation,
  validateSettleMathematicianInformationCommandPayload,
  resolveClockmakerNativeReferences,
  resolveClockmakerSourceEffectiveness,
  resolveClockmakerVortoxConstraint,
  createClockmakerInformationDeliveredPayload,
  createClockmakerInformationDeliveredScheduledTaskSettlement,
  tryCreateEvilTwinPair,
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
  FirstNightTaskInsertedV2Payload,
  EvilTwinInformationDeliveredPayload,
  EvilTwinPairEstablishedPayload,
  GeneratedCharacterAssignment,
  GeneratedSetup,
  GameId,
  GameState,
  CharactersAssignedPayload,
  DemonInformationDeliveredPayload,
  DemonInformationEntry,
  FirstNightInitializedPayload,
  PhilosopherActionDeferredPayload,
  SeamstressActionDeferredPayload,
  SeamstressAbilitySpentPayload,
  SeamstressInformationDeliveredPayload,
  SeamstressTargetsChosenPayload,
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
  SnakeCharmerDemonSwapAppliedPayload,
  SnakeCharmerIneffectiveResolvedPayload,
  SnakeCharmerNoSwapResolvedPayload,
  SnakeCharmerTargetChosenPayload,
  DreamerInformationDeliveredPayload,
  DreamerTargetChosenPayload,
  DreamerInformationDeliveredV2Payload,
  DreamerTargetChosenV2Payload,
  WitchDeathPendingPayload,
  WitchIneffectiveResolvedPayload,
  WitchTargetChosenPayload,
  CerenovusChoiceRecordedPayload,
  CerenovusMadnessInstructionDeliveredPayload,
  CerenovusMadnessMarkedPayload,
  ClockmakerInformationDeliveredPayload,
  ClockmakerSourceContract,
  MathematicianInformationDeliveredPayload,
  SetupGeneratedPayload,
  SetupGenerationConstraints,
  SetupGenerationFailure,
  ScriptSelectedPayload,
  SupportedCommandEnvelope
} from "@botc/domain-core";
import {
  mathematicianPipelineStatesMatchForInternalValidation,
  resolveMathematicianInformationDecisionFromAcceptedEventStream,
  validateProspectiveMathematicianInformationPair
} from "../../domain-core/src/mathematician-internal.js";
import type { InternalMathematicianResolution } from "../../domain-core/src/mathematician-internal.js";
import {
  captureDreamerV2PipelineFingerprintForInternalApplication,
  createDreamerV2ActionOpportunityForInternalApplication
} from "../../domain-core/src/dreamer-v2-internal.js";
import {
  resolveDreamerV2FromAcceptedEventStream,
  validateProspectiveDreamerV2TripletForInternalApplication
} from "../../domain-core/src/dreamer-v2-replay.js";
import type { InternalDreamerV2Resolution } from "../../domain-core/src/dreamer-v2-replay.js";
import { DREAMER_V2_RESOLUTION_BOUNDARY_VERSION } from "../../domain-core/src/dreamer-v2.js";
import { accepted, acceptedWithEventSummary, failed, markIdempotent, rejected } from "./command-result.js";
import {
  captureSupportedCommand,
  commandFingerprintsRepresentSameCommand
} from "./command-fingerprint.js";
import type { CommandFingerprint } from "./command-fingerprint.js";
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
import type { CommandCommitStore, FingerprintedCommandReceipt } from "./ports/command-commit-store.js";
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
  readonly dreamerV2ProspectiveValidator?: typeof validateProspectiveDreamerV2TripletForInternalApplication;
};

export const mapDreamerV2DependencyFailureForInternalValidation = (input: {
  readonly gameId: GameId;
  readonly currentGameVersion: number;
  readonly message: string;
}): CommandExecutionFailed => failed(
  input.gameId,
  "DependencyExecutionFailed",
  input.message,
  "first-night-role-action",
  input.currentGameVersion
);

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

    if (taskPlan.taskPlanVersion !== CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION) {
      return invalidPlannerResult("First-night task planner must generate first-night-task-plan-v2");
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

  public async execute(incomingCommand: SupportedCommandEnvelope): Promise<CommandResult> {
    const capturedResult = captureSupportedCommand(incomingCommand);
    if (!capturedResult.valid) {
      const descriptor = Object.getOwnPropertyDescriptor(incomingCommand, "gameId");
      if (descriptor === undefined || !("value" in descriptor) || typeof descriptor.value !== "string") {
        throw new TypeError("GameApplicationService requires an own data-property gameId");
      }
      return failed(
        descriptor.value as SupportedCommandEnvelope["gameId"],
        "DependencyExecutionFailed",
        `Command snapshot validation failed: ${capturedResult.reason}`,
        "command-validation"
      );
    }
    const command = capturedResult.captured.snapshot;
    const commandFingerprint = capturedResult.captured.fingerprint;
    let existingReceipt;
    try {
      existingReceipt = await this.dependencies.commandStore.findCommandReceipt(command.gameId, command.commandId);
    } catch (error: unknown) {
      return failed(command.gameId, "CommandStoreReadFailed", errorMessage(error, "Unknown command receipt read failure"), "receipt-read");
    }

    if (existingReceipt !== undefined) {
      if (commandFingerprintsRepresentSameCommand(existingReceipt.commandFingerprint, commandFingerprint)) {
        return markIdempotent(existingReceipt.result);
      }
      let conflictEvents;
      try {
        conflictEvents = await this.dependencies.commandStore.loadDomainEvents(command.gameId);
      } catch (error: unknown) {
        return failed(command.gameId, "CommandStoreReadFailed", errorMessage(error, "Unknown domain event load failure"), "event-load");
      }
      try {
        const conflictState = rebuildOptionalGameState(conflictEvents);
        return rejected(
          command.gameId,
          "CommandIdempotencyConflict",
          "commandId is already associated with a different command",
          conflictState?.gameVersion ?? 0
        );
      } catch (error: unknown) {
        return failed(command.gameId, "CanonicalStateRebuildFailed", errorMessage(error, "Unknown canonical state rebuild failure"), "state-rebuild");
      }
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
        commandFingerprint,
        rejected(
          command.gameId,
          "ExpectedGameVersionMismatch",
          `Expected version ${command.expectedGameVersion} but current version is ${currentGameVersion}`,
          currentGameVersion
        )
      );
    }

    const nextFirstNightTask = state?.firstNightTaskPlan === undefined
      ? undefined
      : getNextUnsettledFirstNightTask(state.firstNightTaskPlan, state.firstNightTaskProgress);
    if (
      (command.payload.commandType === "OpenFirstNightRoleActionOpportunity" ||
        command.payload.commandType === "SettleFirstNightSystemTask") &&
      nextFirstNightTask?.taskId === command.payload.taskId &&
      nextFirstNightTask.taskType === "MATHEMATICIAN_INFORMATION"
    ) {
      return failed(
        command.gameId,
        "ApplicationNotConfigured",
        "Mathematician first-night information settlement is not implemented",
        "first-night-role-information",
        currentGameVersion
      );
    }

    if(command.payload.commandType==="SubmitDreamerAction"&&state!==undefined){
      const dreamerTaskId=command.payload.taskId;
      const opportunity=findFirstNightActionOpportunityById(state.firstNightActionOpportunities,command.payload.opportunityId);
      const task=state.firstNightTaskPlan?.tasks.find((entry)=>entry.taskId===dreamerTaskId);
      if(opportunity?.opportunityKind==="DREAMER_FIRST_NIGHT_ACTION"&&!isDreamerActionOpportunityV2(opportunity)){
        if(task?.source.kind==="PHILOSOPHER_GAINED_ABILITY")return failed(command.gameId,"ApplicationNotConfigured","Legacy V1 gained Dreamer settlement is unsupported","first-night-role-action",currentGameVersion);
        const currentVortoxCount=state.currentCharacterState?.entries.filter((entry)=>entry.role.roleId==="vortox").length??0;
        if(currentVortoxCount>0)return failed(command.gameId,"DependencyExecutionFailed","Legacy V1 Dreamer cannot represent current Vortox evidence","first-night-role-action",currentGameVersion);
      }
    }

    const validation = this.validate(command, state);
    if (validation !== undefined) {
      return this.recordRejected(command, commandFingerprint, rejected(command.gameId, validation.code, validation.message, currentGameVersion));
    }

    let mathematicianDecision: Extract<InternalMathematicianResolution, { readonly kind: "READY" }> | undefined;
    if (command.payload.commandType === "SettleMathematicianInformation") {
      let decision: InternalMathematicianResolution;
      try {
        decision = resolveMathematicianInformationDecisionFromAcceptedEventStream(events, command.payload.taskId);
      } catch (error: unknown) {
        return failed(
          command.gameId,
          "DependencyExecutionFailed",
          errorMessage(error, "Unknown Mathematician resolution dependency failure"),
          "first-night-role-information",
          currentGameVersion
        );
      }
      if ("rebuiltState" in decision && state !== undefined &&
          !mathematicianPipelineStatesMatchForInternalValidation(state, decision.rebuiltState)) {
        return failed(
          command.gameId,
          "CanonicalStateRebuildFailed",
          "Mathematician Layer A rebuilt state differs from the application pipeline state",
          "first-night-role-information",
          currentGameVersion
        );
      }
      if (decision.kind === "DETERMINISTIC_REJECTION") {
        return this.recordRejected(command, commandFingerprint, rejected(command.gameId, decision.code, decision.message, currentGameVersion));
      }
      if (decision.kind === "UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER") {
        return failed(command.gameId, "ApplicationNotConfigured", "Legacy V1 duplicate Mathematician settlement is not supported", "first-night-role-information", currentGameVersion);
      }
      if (decision.kind !== "READY") {
        return failed(command.gameId, "DependencyExecutionFailed", `Mathematician resolution failed closed: ${decision.kind}`, "first-night-role-information", currentGameVersion);
      }
      mathematicianDecision = decision;
    }

    let dreamerDecision:Extract<InternalDreamerV2Resolution,{readonly kind:"READY"}>|undefined;
    if(command.payload.commandType==="SubmitDreamerAction"&&state!==undefined){
      const opportunity=findFirstNightActionOpportunityById(state.firstNightActionOpportunities,command.payload.opportunityId);
      if(opportunity!==undefined&&isDreamerActionOpportunityV2(opportunity)){
        try{
          const fingerprint=captureDreamerV2PipelineFingerprintForInternalApplication({state,taskId:command.payload.taskId,boundary:{boundaryVersion:DREAMER_V2_RESOLUTION_BOUNDARY_VERSION,stage:"PRE_TARGET",opportunityId:command.payload.opportunityId,targetPlayerId:command.payload.decision.targetPlayerId,targetChoiceId:null,deliveryId:null}});
          const resolved=resolveDreamerV2FromAcceptedEventStream({acceptedEvents:events,pipelineStateFingerprint:fingerprint,taskId:command.payload.taskId,opportunityId:command.payload.opportunityId,targetPlayerId:command.payload.decision.targetPlayerId});
          if(resolved.kind!=="READY")return mapDreamerV2DependencyFailureForInternalValidation({gameId:command.gameId,currentGameVersion,message:resolved.message});
          dreamerDecision=resolved;
        }catch(error:unknown){return failed(command.gameId,"DependencyExecutionFailed",errorMessage(error,"Dreamer V2 resolution failed"),"first-night-role-action",currentGameVersion);}
      }
    }

    const batch = this.createBatchOrReject(command, state, currentGameVersion, mathematicianDecision,dreamerDecision);
    if ("status" in batch) {
      return batch;
    }

    if ("code" in batch) {
      if (batch.code === "SetupGenerationFailed") {
        return this.recordRejected(command, commandFingerprint, rejected(command.gameId, batch.code, batch.message, currentGameVersion, false, batch.details));
      }

      if (batch.code === "AssignmentGenerationFailed") {
        return this.recordRejected(command, commandFingerprint, rejected(command.gameId, batch.code, batch.message, currentGameVersion, false, batch.details));
      }

      if (batch.code === "InitialPrivateKnowledgeGenerationFailed") {
        return this.recordRejected(command, commandFingerprint, rejected(command.gameId, batch.code, batch.message, currentGameVersion, false, batch.details));
      }

      return this.recordRejected(command, commandFingerprint, rejected(command.gameId, batch.code, batch.message, currentGameVersion));
    }

    const prospective = this.validateProspectiveBatch(command, state, batch, events);
    if (prospective !== undefined) {
      if ("status" in prospective) {
        return prospective;
      }

      return this.recordRejected(command, commandFingerprint, rejected(command.gameId, prospective.code, prospective.message, currentGameVersion));
    }

    const result = command.payload.commandType === "SubmitSeamstressAction" ||
      command.payload.commandType === "SubmitCerenovusAction" ||
      command.payload.commandType === "SettleClockmakerInformation" ||
      command.payload.commandType === "SettleMathematicianInformation"
      ? acceptedWithEventSummary(command.gameId, batch.committedGameVersion, batch.events)
      : accepted(command.gameId, batch.committedGameVersion, batch.events);
    const receipt: FingerprintedCommandReceipt<typeof result> = {
      commandId: command.commandId,
      gameId: command.gameId,
      commandFingerprint,
      result
    };

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

      case "SettleClockmakerInformation": {
        if (!canActorSettleClockmakerInformation(command.actor)) {
          return { code: "ActorNotAllowed", message: `${command.actor.kind} actors cannot execute SettleClockmakerInformation` };
        }
        const payloadValidation = validateSettleClockmakerInformationCommandPayload(command.payload);
        if (!payloadValidation.valid) return { code: "InvalidClockmakerInformationCommand", message: payloadValidation.reason };
        if (state === undefined) return { code: "GameNotCreated", message: "SettleClockmakerInformation requires an existing game" };
        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: "SettleClockmakerInformation requires first night before day one" };
        }
        if (state.firstNight === undefined) return { code: "FirstNightNotInitialized", message: "Clockmaker settlement requires first-night initialization" };
        if (state.initialPrivateKnowledge === undefined) return { code: "InitialPrivateKnowledgeNotEstablished", message: "Clockmaker settlement requires initial private knowledge" };
        if (state.firstNightTaskPlan === undefined) return { code: "FirstNightTaskPlanNotCreated", message: "Clockmaker settlement requires a first-night task plan" };
        if (state.currentCharacterState === undefined || state.setup === undefined || state.roster === undefined || state.seamstressRoleTenureState === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "Clockmaker settlement requires complete canonical character state" };
        }
        const requestedTaskId = command.payload.taskId;
        const task = state.firstNightTaskPlan.tasks.find((entry) => entry.taskId === requestedTaskId);
        if (task === undefined) return { code: "ScheduledTaskNotFound", message: "Clockmaker task was not found" };
        if (isFirstNightTaskSettled(state.firstNightTaskProgress, task.taskId)) return { code: "ScheduledTaskAlreadySettled", message: "Clockmaker task is already settled" };
        const next = getNextUnsettledFirstNightTask(state.firstNightTaskPlan, state.firstNightTaskProgress);
        if (next?.taskId !== task.taskId) return { code: "ScheduledTaskNotNext", message: "Clockmaker task is not the next unsettled task" };
        if (task.taskType !== "CLOCKMAKER_INFORMATION" || task.taskClass !== "ROLE_INFORMATION" ||
            (task.source.kind !== "ROLE" && task.source.kind !== "PHILOSOPHER_GAINED_ABILITY")) {
          return { code: "UnsupportedClockmakerInformationTask", message: "Task is not a supported Clockmaker information task" };
        }
        const taskSource = task.source;
        const sourceRole = taskSource.kind === "ROLE" ? taskSource.role : taskSource.sourceRole;
        const source = state.currentCharacterState.entries.filter((entry) => entry.playerId === taskSource.playerId && entry.seatNumber === taskSource.seatNumber);
        if (source.length !== 1 || source[0] === undefined || !sameRoleSetupSnapshot(source[0].role, sourceRole) ||
            (taskSource.kind === "ROLE" ? sourceRole.roleId !== "clockmaker" : sourceRole.roleId !== "philosopher")) {
          return { code: "InformationSourceNoLongerValid", message: "Clockmaker information source no longer matches its bounded current character" };
        }
        return undefined;
      }

      case "SettleMathematicianInformation": {
        if (!canActorSettleMathematicianInformation(command.actor)) {
          return { code: "ActorNotAllowed", message: `${command.actor.kind} actors cannot execute SettleMathematicianInformation` };
        }
        const payloadValidation = validateSettleMathematicianInformationCommandPayload(command.payload);
        if (!payloadValidation.valid) return { code: "InvalidMathematicianInformationCommand", message: payloadValidation.reason };
        if (state === undefined) return { code: "GameNotCreated", message: "SettleMathematicianInformation requires an existing game" };
        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: "SettleMathematicianInformation requires first night before day one" };
        }
        if (state.firstNight === undefined) return { code: "FirstNightNotInitialized", message: "Mathematician settlement requires first-night initialization" };
        if (state.initialPrivateKnowledge === undefined) return { code: "InitialPrivateKnowledgeNotEstablished", message: "Mathematician settlement requires initial private knowledge" };
        if (state.firstNightTaskPlan === undefined || state.firstNightTaskProgress === undefined) {
          return { code: "FirstNightTaskPlanNotCreated", message: "Mathematician settlement requires a first-night task plan and progress" };
        }
        if (state.currentCharacterState === undefined || state.roster === undefined || state.seamstressRoleTenureState === undefined ||
            state.firstNightAbilityOutcomeLedger === undefined || state.firstNightInitializationProvenance === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "Mathematician settlement requires complete canonical character and outcome state" };
        }
        return undefined;
      }

      case "SettleEvilTwinSetup": {
        if (command.actor.kind !== "system" && command.actor.kind !== "storyteller") {
          return {
            code: "ActorNotAllowed",
            message: `${command.actor.kind} actors cannot execute ${command.payload.commandType}`
          };
        }

        if (state === undefined) {
          return { code: "GameNotCreated", message: "SettleEvilTwinSetup requires an existing game" };
        }

        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: `SettleEvilTwinSetup cannot execute during ${state.phase}` };
        }

        if (state.firstNight === undefined) {
          return { code: "FirstNightNotInitialized", message: "SettleEvilTwinSetup requires first night initialization" };
        }

        if (state.initialPrivateKnowledge === undefined) {
          return {
            code: "InitialPrivateKnowledgeNotEstablished",
            message: "SettleEvilTwinSetup requires initial own-character knowledge"
          };
        }

        if (state.firstNightTaskPlan === undefined) {
          return { code: "FirstNightTaskPlanNotCreated", message: "SettleEvilTwinSetup requires a first-night task plan" };
        }

        if (state.currentCharacterState === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "SettleEvilTwinSetup requires current character state" };
        }

        const result = tryCreateEvilTwinPair({
          taskId: command.payload.taskId,
          firstNightTaskPlan: state.firstNightTaskPlan,
          firstNightTaskProgress: state.firstNightTaskProgress,
          currentCharacterState: state.currentCharacterState
        });
        if (result.status === "failure") {
          return {
            code: result.failureCode,
            message: result.message
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

        let sourceValidation:{readonly valid:true}|{readonly valid:false;readonly reason:string};
        if(state.firstNightTaskPlan.taskPlanVersion===CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION&&targetTask.taskType==="DREAMER_ACTION"){
          try{createDreamerV2ActionOpportunityForInternalApplication(state,requestedTaskId);sourceValidation={valid:true};}
          catch(error:unknown){sourceValidation={valid:false,reason:errorMessage(error,"Dreamer V2 opportunity source is invalid")};}
        }else sourceValidation = tryCreateFirstNightRoleActionOpportunity({
          taskId: requestedTaskId,
          firstNightTaskPlan: state.firstNightTaskPlan,
          firstNightTaskProgress: state.firstNightTaskProgress,
          currentCharacterState: state.currentCharacterState,
          firstNightActionOpportunities: state.firstNightActionOpportunities,
          seamstressResolutionCapability: state.seamstressResolutionCapability,
          seamstressRoleTenureState: state.seamstressRoleTenureState,
          seamstressAbilityState: state.seamstressAbilityState,
          philosopherGrantedAbilities: state.philosopherGrantedAbilities
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

      case "SubmitSnakeCharmerAction": {
        if (state === undefined) {
          return { code: "GameNotCreated", message: "SubmitSnakeCharmerAction requires an existing game" };
        }

        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: `SubmitSnakeCharmerAction cannot execute during ${state.phase}` };
        }

        if (state.firstNight === undefined) {
          return { code: "FirstNightNotInitialized", message: "SubmitSnakeCharmerAction requires first night initialization" };
        }

        if (state.firstNightTaskPlan === undefined) {
          return { code: "FirstNightTaskPlanNotCreated", message: "SubmitSnakeCharmerAction requires a first-night task plan" };
        }

        if (state.currentCharacterState === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "SubmitSnakeCharmerAction requires current character state" };
        }

        if (state.roster === undefined) {
          return { code: "PlayerRosterNotCreated", message: "SubmitSnakeCharmerAction requires player roster" };
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

        if (opportunity.opportunityStatus === "CLOSED") {
          return {
            code: "ActionOpportunityAlreadyClosed",
            message: `Action opportunity ${command.payload.opportunityId} is already closed`
          };
        }

        if (
          opportunity.opportunityKind !== "SNAKE_CHARMER_FIRST_NIGHT_ACTION" ||
          opportunity.taskType !== "SNAKE_CHARMER_ACTION"
        ) {
          return {
            code: "UnsupportedRoleActionOpportunity",
            message: "SubmitSnakeCharmerAction requires a Snake Charmer action opportunity"
          };
        }

        if (command.actor.kind === "human" || command.actor.kind === "ai") {
          if (command.actor.playerId !== opportunity.sourcePlayerId) {
            return {
              code: "ActorPlayerMismatch",
              message: "SubmitSnakeCharmerAction actor must match the action opportunity source player"
            };
          }
        }

        const decisionValidation = validateSnakeCharmerActionDecision(command.payload.decision);
        if (!decisionValidation.valid) {
          return {
            code: "InvalidSnakeCharmerTarget",
            message: decisionValidation.reason
          };
        }

        if (opportunity.taskId !== requestedTaskId) {
          return {
            code: "ScheduledTaskNotNext",
            message: "SubmitSnakeCharmerAction taskId must match the referenced action opportunity"
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

        if (targetTask.taskType !== "SNAKE_CHARMER_ACTION") {
          return {
            code: "UnsupportedRoleActionOpportunity",
            message: "SubmitSnakeCharmerAction requires a Snake Charmer action task"
          };
        }

        const currentSourceEntry = state.currentCharacterState.entries.find((entry) =>
          entry.playerId === opportunity.sourcePlayerId &&
          entry.seatNumber === opportunity.sourceSeatNumber
        );
        const baseSnakeCharmerSourceValid =
          targetTask.source.kind === "ROLE" &&
          targetTask.source.role.roleId === "snake_charmer" &&
          targetTask.source.playerId === opportunity.sourcePlayerId &&
          targetTask.source.seatNumber === opportunity.sourceSeatNumber &&
          currentSourceEntry !== undefined &&
          currentSourceEntry.role.roleId === "snake_charmer" &&
          sameRoleSetupSnapshot(currentSourceEntry.role, targetTask.source.role) &&
          sameRoleSetupSnapshot(currentSourceEntry.role, opportunity.sourceRole) &&
          state.currentCharacterState.revision === opportunity.sourceCharacterStateRevision;
        const philosopherGainedSnakeCharmerSourceValid =
          targetTask.source.kind === "PHILOSOPHER_GAINED_ABILITY" &&
          targetTask.source.chosenRole.roleId === "snake_charmer" &&
          targetTask.source.sourceRole.roleId === "philosopher" &&
          targetTask.source.playerId === opportunity.sourcePlayerId &&
          targetTask.source.seatNumber === opportunity.sourceSeatNumber &&
          targetTask.source.sourceCharacterStateRevision === opportunity.sourceCharacterStateRevision &&
          currentSourceEntry !== undefined &&
          currentSourceEntry.role.roleId === "philosopher" &&
          sameRoleSetupSnapshot(currentSourceEntry.role, targetTask.source.sourceRole) &&
          sameRoleSetupSnapshot(currentSourceEntry.role, opportunity.sourceRole) &&
          state.currentCharacterState.revision === opportunity.sourceCharacterStateRevision;

        if (!baseSnakeCharmerSourceValid && !philosopherGainedSnakeCharmerSourceValid) {
          return {
            code: "ActionSourceNoLongerValid",
            message: "SubmitSnakeCharmerAction source is no longer the same current Snake Charmer-capable state"
          };
        }

        const snakeCharmerTargetPlayerId = command.payload.decision.targetPlayerId;
        const targetRosterEntry = state.roster.entries.find((entry) => entry.playerId === snakeCharmerTargetPlayerId);
        const targetStateEntry = state.currentCharacterState.entries.find((entry) => entry.playerId === snakeCharmerTargetPlayerId);
        if (
          targetRosterEntry === undefined ||
          targetStateEntry === undefined ||
          targetRosterEntry.seatNumber !== targetStateEntry.seatNumber
        ) {
          return {
            code: "InvalidSnakeCharmerTarget",
            message: "SubmitSnakeCharmerAction targetPlayerId must exist in roster and current character state"
          };
        }

        return undefined;
      }

      case "SubmitWitchAction": {
        if (state === undefined) {
          return { code: "GameNotCreated", message: "SubmitWitchAction requires an existing game" };
        }

        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: `SubmitWitchAction cannot execute during ${state.phase}` };
        }

        if (state.firstNight === undefined) {
          return { code: "FirstNightNotInitialized", message: "SubmitWitchAction requires first night initialization" };
        }

        if (state.firstNightTaskPlan === undefined) {
          return { code: "FirstNightTaskPlanNotCreated", message: "SubmitWitchAction requires a first-night task plan" };
        }

        if (state.currentCharacterState === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "SubmitWitchAction requires current character state" };
        }

        if (state.roster === undefined) {
          return { code: "PlayerRosterNotCreated", message: "SubmitWitchAction requires player roster" };
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

        if (opportunity.opportunityStatus === "CLOSED") {
          return {
            code: "ActionOpportunityAlreadyClosed",
            message: `Action opportunity ${command.payload.opportunityId} is already closed`
          };
        }

        if (
          opportunity.opportunityKind !== "WITCH_FIRST_NIGHT_ACTION" ||
          opportunity.taskType !== "WITCH_ACTION"
        ) {
          return {
            code: "UnsupportedRoleActionOpportunity",
            message: "SubmitWitchAction requires a Witch action opportunity"
          };
        }

        if (command.actor.kind === "human" || command.actor.kind === "ai") {
          if (command.actor.playerId !== opportunity.sourcePlayerId) {
            return {
              code: "ActorPlayerMismatch",
              message: "SubmitWitchAction actor must match the action opportunity source player"
            };
          }
        }

        const decisionValidation = validateWitchActionDecision(command.payload.decision);
        if (!decisionValidation.valid) {
          return {
            code: "InvalidWitchTarget",
            message: decisionValidation.reason
          };
        }

        if (opportunity.taskId !== requestedTaskId) {
          return {
            code: "ScheduledTaskNotNext",
            message: "SubmitWitchAction taskId must match the referenced action opportunity"
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

        if (targetTask.taskType !== "WITCH_ACTION") {
          return {
            code: "UnsupportedRoleActionOpportunity",
            message: "SubmitWitchAction requires a Witch action task"
          };
        }

        const currentSourceEntry = state.currentCharacterState.entries.find((entry) =>
          entry.playerId === opportunity.sourcePlayerId &&
          entry.seatNumber === opportunity.sourceSeatNumber
        );
        const witchSourceValid =
          targetTask.source.kind === "ROLE" &&
          targetTask.source.role.roleId === "witch" &&
          targetTask.source.playerId === opportunity.sourcePlayerId &&
          targetTask.source.seatNumber === opportunity.sourceSeatNumber &&
          currentSourceEntry !== undefined &&
          currentSourceEntry.role.roleId === "witch" &&
          sameRoleSetupSnapshot(currentSourceEntry.role, targetTask.source.role) &&
          sameRoleSetupSnapshot(currentSourceEntry.role, opportunity.sourceRole) &&
          state.currentCharacterState.revision === opportunity.sourceCharacterStateRevision;

        if (!witchSourceValid) {
          return {
            code: "ActionSourceNoLongerValid",
            message: "SubmitWitchAction source is no longer the same current Witch state"
          };
        }

        const witchTargetPlayerId = command.payload.decision.targetPlayerId;
        const targetRosterEntry = state.roster.entries.find((entry) => entry.playerId === witchTargetPlayerId);
        if (targetRosterEntry === undefined) {
          return {
            code: "InvalidWitchTarget",
            message: "SubmitWitchAction targetPlayerId must exist in roster"
          };
        }

        return undefined;
      }

      case "SubmitCerenovusAction": {
        const payload = command.payload;
        if (state === undefined) return { code: "GameNotCreated", message: "SubmitCerenovusAction requires an existing game" };
        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: `SubmitCerenovusAction cannot execute during ${state.phase}` };
        }
        if (state.firstNight === undefined) return { code: "FirstNightNotInitialized", message: "SubmitCerenovusAction requires first night initialization" };
        if (state.firstNightTaskPlan === undefined) return { code: "FirstNightTaskPlanNotCreated", message: "SubmitCerenovusAction requires a first-night task plan" };
        if (state.setup === undefined) return { code: "SetupNotGenerated", message: "SubmitCerenovusAction requires setup role catalog" };
        if (state.currentCharacterState === undefined) return { code: "CharacterAssignmentNotCreated", message: "SubmitCerenovusAction requires current character state" };
        if (state.roster === undefined) return { code: "PlayerRosterNotCreated", message: "SubmitCerenovusAction requires player roster" };
        if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, ["commandType", "decision", "opportunityId", "taskId"])) {
          return { code: "InvalidCerenovusActionDecision", message: "SubmitCerenovusAction payload must have exact runtime shape without hidden fields" };
        }
        if (command.actor.kind !== "human" && command.actor.kind !== "ai") {
          return { code: "ActorNotAllowed", message: `${command.actor.kind} actors cannot execute SubmitCerenovusAction` };
        }
        const decisionValidation = validateCerenovusActionDecision(payload.decision);
        if (!decisionValidation.valid) return { code: "InvalidCerenovusActionDecision", message: decisionValidation.reason };
        const targetTask = state.firstNightTaskPlan.tasks.find((task) => task.taskId === payload.taskId);
        if (targetTask === undefined) return { code: "ScheduledTaskNotFound", message: `Scheduled task ${payload.taskId} does not exist in the first-night task plan` };
        const opportunity = findCerenovusOpportunity(state.firstNightActionOpportunities, payload.opportunityId);
        if (opportunity === undefined) return { code: "ActionOpportunityNotFound", message: `Cerenovus opportunity ${payload.opportunityId} does not exist` };
        const opportunityShape = validateCerenovusActionOpportunityShape(opportunity);
        if (!opportunityShape.valid) return { code: "ActionSourceNoLongerValid", message: opportunityShape.reason };
        if (opportunity.opportunityStatus === "CLOSED") return { code: "ActionOpportunityAlreadyClosed", message: `Action opportunity ${payload.opportunityId} is already closed` };
        if (command.actor.playerId !== opportunity.sourcePlayerId) return { code: "ActorPlayerMismatch", message: "SubmitCerenovusAction actor must match the opportunity source player" };
        if (opportunity.taskId !== payload.taskId) return { code: "ScheduledTaskNotNext", message: "SubmitCerenovusAction taskId must match its opportunity" };
        if (isFirstNightTaskSettled(state.firstNightTaskProgress, payload.taskId)) return { code: "ScheduledTaskAlreadySettled", message: `Scheduled task ${payload.taskId} is already settled` };
        const nextTask = getNextUnsettledFirstNightTask(state.firstNightTaskPlan, state.firstNightTaskProgress);
        if (nextTask?.taskId !== targetTask.taskId) return { code: "ScheduledTaskNotNext", message: `Scheduled task ${targetTask.taskId} is not the next unsettled first-night task` };
        const currentSource = state.currentCharacterState.entries.find((entry) => entry.playerId === opportunity.sourcePlayerId && entry.seatNumber === opportunity.sourceSeatNumber);
        const tenure = state.seamstressRoleTenureState?.records.filter((entry) => entry.roleTenureId === opportunity.sourceRoleTenureId) ?? [];
        const sourceValid = targetTask.taskType === "CERENOVUS_ACTION" && targetTask.taskClass === "ROLE_ACTION" &&
          targetTask.source.kind === "ROLE" && targetTask.source.role.roleId === "cerenovus" &&
          targetTask.source.playerId === opportunity.sourcePlayerId && targetTask.source.seatNumber === opportunity.sourceSeatNumber &&
          sameRoleSetupSnapshot(targetTask.source.role, opportunity.sourceRole) && currentSource?.role.roleId === "cerenovus" &&
          currentSource !== undefined && sameRoleSetupSnapshot(currentSource.role, opportunity.sourceRole) && tenure.length === 1 && tenure[0] !== undefined &&
          tenure[0].playerId === opportunity.sourcePlayerId && tenure[0].seatNumber === opportunity.sourceSeatNumber &&
          tenure[0].roleId === "cerenovus" &&
          isRoleTenureContinuousAcross(tenure[0], opportunity.sourceCharacterStateRevision, state.currentCharacterState.revision) &&
          formatCerenovusAbilityInstanceId({ roleTenureId: tenure[0].roleTenureId }) === opportunity.sourceAbilityInstanceId &&
          opportunity.abilitySource.kind === "ROLE_TENURE" && opportunity.abilitySource.abilityRoleId === "cerenovus" &&
          opportunity.abilitySource.roleTenureId === tenure[0].roleTenureId &&
          opportunity.abilitySource.acquiredCharacterStateRevision === tenure[0].acquiredCharacterStateRevision;
        if (!sourceValid) return { code: "ActionSourceNoLongerValid", message: "SubmitCerenovusAction source tenure or ability instance is no longer the same active base Cerenovus" };
        if (!state.roster.entries.some((entry) => entry.playerId === payload.decision.targetPlayerId)) {
          return { code: "InvalidCerenovusTarget", message: "SubmitCerenovusAction target must be a modeled roster player" };
        }
        const selectedRole = state.setup.roleCatalogSnapshot.roles.find((role) => role.roleId === payload.decision.chosenRoleId);
        if (selectedRole === undefined || (selectedRole.characterType !== "TOWNSFOLK" && selectedRole.characterType !== "OUTSIDER")) {
          return { code: "InvalidCerenovusCharacter", message: "SubmitCerenovusAction character must be an on-script Townsfolk or Outsider" };
        }
        return undefined;
      }

      case "SubmitDreamerAction": {
        if (state === undefined) {
          return { code: "GameNotCreated", message: "SubmitDreamerAction requires an existing game" };
        }

        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: `SubmitDreamerAction cannot execute during ${state.phase}` };
        }

        if (state.firstNight === undefined) {
          return { code: "FirstNightNotInitialized", message: "SubmitDreamerAction requires first night initialization" };
        }

        if (state.firstNightTaskPlan === undefined) {
          return { code: "FirstNightTaskPlanNotCreated", message: "SubmitDreamerAction requires a first-night task plan" };
        }

        if (state.setup === undefined) {
          return { code: "SetupNotGenerated", message: "SubmitDreamerAction requires setup role catalog" };
        }

        if (state.currentCharacterState === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "SubmitDreamerAction requires current character state" };
        }

        if (state.roster === undefined) {
          return { code: "PlayerRosterNotCreated", message: "SubmitDreamerAction requires player roster" };
        }

        if (!isPlainRecord(command.payload) || !hasExactEnumerableKeys(command.payload, ["commandType", "decision", "opportunityId", "taskId"])) {
          return {
            code: "InvalidDreamerTarget",
            message: "SubmitDreamerAction payload must not include hidden fields"
          };
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

        if (opportunity.opportunityStatus === "CLOSED") {
          return {
            code: "ActionOpportunityAlreadyClosed",
            message: `Action opportunity ${command.payload.opportunityId} is already closed`
          };
        }

        if (
          opportunity.opportunityKind !== "DREAMER_FIRST_NIGHT_ACTION" ||
          opportunity.taskType !== "DREAMER_ACTION"
        ) {
          return {
            code: "UnsupportedRoleActionOpportunity",
            message: "SubmitDreamerAction requires a Dreamer action opportunity"
          };
        }

        if (command.actor.kind === "human" || command.actor.kind === "ai") {
          if (command.actor.playerId !== opportunity.sourcePlayerId) {
            return {
              code: "ActorPlayerMismatch",
              message: "SubmitDreamerAction actor must match the action opportunity source player"
            };
          }
        }

        const decisionValidation = validateDreamerActionDecision(command.payload.decision);
        if (!decisionValidation.valid) {
          return {
            code: "InvalidDreamerTarget",
            message: decisionValidation.reason
          };
        }

        if (opportunity.taskId !== requestedTaskId) {
          return {
            code: "ScheduledTaskNotNext",
            message: "SubmitDreamerAction taskId must match the referenced action opportunity"
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

        if (targetTask.taskType !== "DREAMER_ACTION") {
          return {
            code: "UnsupportedRoleActionOpportunity",
            message: "SubmitDreamerAction requires a Dreamer action task"
          };
        }

        const currentSourceEntry = state.currentCharacterState.entries.find((entry) =>
          entry.playerId === opportunity.sourcePlayerId &&
          entry.seatNumber === opportunity.sourceSeatNumber
        );
        const dreamerSourceValid = isDreamerActionOpportunityV2(opportunity)
          ? state.firstNightTaskPlan.taskPlanVersion===CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION&&
            targetTask.source.kind!=="SYSTEM"&&targetTask.source.playerId===opportunity.sourcePlayerId&&
            targetTask.source.seatNumber===opportunity.sourceSeatNumber&&currentSourceEntry!==undefined&&
            sameRoleSetupSnapshot(currentSourceEntry.role,opportunity.sourceRole)&&
            opportunity.sourceContract.taskId===targetTask.taskId&&
            opportunity.sourceContract.sourcePlayerId===opportunity.sourcePlayerId&&
            opportunity.sourceContract.sourceSeatNumber===opportunity.sourceSeatNumber
          : targetTask.source.kind === "ROLE" &&
            targetTask.source.role.roleId === "dreamer" &&
            targetTask.source.playerId === opportunity.sourcePlayerId &&
            targetTask.source.seatNumber === opportunity.sourceSeatNumber &&
            currentSourceEntry !== undefined &&
            currentSourceEntry.role.roleId === "dreamer" &&
            sameRoleSetupSnapshot(currentSourceEntry.role, targetTask.source.role) &&
            sameRoleSetupSnapshot(currentSourceEntry.role, opportunity.sourceRole) &&
            state.currentCharacterState.revision === opportunity.sourceCharacterStateRevision;

        if (!dreamerSourceValid) {
          return {
            code: "ActionSourceNoLongerValid",
            message: "SubmitDreamerAction source is no longer the same current Dreamer state"
          };
        }

        const dreamerTargetPlayerId = command.payload.decision.targetPlayerId;
        const targetRosterEntry = state.roster.entries.find((entry) => entry.playerId === dreamerTargetPlayerId);
        const targetStateEntry = state.currentCharacterState.entries.find((entry) => entry.playerId === dreamerTargetPlayerId);
        if (
          targetRosterEntry === undefined ||
          targetStateEntry === undefined ||
          targetRosterEntry.seatNumber !== targetStateEntry.seatNumber
        ) {
          return {
            code: "InvalidDreamerTarget",
            message: "SubmitDreamerAction targetPlayerId must exist in roster and current character state"
          };
        }

        if (dreamerTargetPlayerId === opportunity.sourcePlayerId) {
          return {
            code: "InvalidDreamerTarget",
            message: "SubmitDreamerAction targetPlayerId must not be the Dreamer source"
          };
        }

        return undefined;
      }

      case "SubmitSeamstressAction": {
        if (state === undefined) {
          return { code: "GameNotCreated", message: "SubmitSeamstressAction requires an existing game" };
        }

        if (state.phase !== "FIRST_NIGHT" || state.nightNumber !== 1 || state.dayNumber !== 0) {
          return { code: "CommandNotAllowedInPhase", message: `SubmitSeamstressAction cannot execute during ${state.phase}` };
        }

        if (state.firstNight === undefined) {
          return { code: "FirstNightNotInitialized", message: "SubmitSeamstressAction requires first night initialization" };
        }

        if (state.firstNightTaskPlan === undefined) {
          return { code: "FirstNightTaskPlanNotCreated", message: "SubmitSeamstressAction requires a first-night task plan" };
        }

        if (state.currentCharacterState === undefined) {
          return { code: "CharacterAssignmentNotCreated", message: "SubmitSeamstressAction requires current character state" };
        }

        if (!isPlainRecord(command.payload) || !hasExactEnumerableKeys(command.payload, ["commandType", "decision", "opportunityId", "taskId"])) {
          return {
            code: "InvalidSeamstressActionDecision",
            message: "SubmitSeamstressAction payload must have exact runtime shape without hidden fields"
          };
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

        if (opportunity.opportunityStatus === "CLOSED") {
          return {
            code: "ActionOpportunityAlreadyClosed",
            message: `Action opportunity ${command.payload.opportunityId} is already closed`
          };
        }

        if (
          opportunity.opportunityKind !== "SEAMSTRESS_FIRST_NIGHT_ACTION" ||
          opportunity.taskType !== "SEAMSTRESS_ACTION"
        ) {
          return {
            code: "UnsupportedRoleActionOpportunity",
            message: "SubmitSeamstressAction requires a Seamstress action opportunity"
          };
        }

        if (command.actor.kind === "human" || command.actor.kind === "ai") {
          if (command.actor.playerId !== opportunity.sourcePlayerId) {
            return {
              code: "ActorPlayerMismatch",
              message: "SubmitSeamstressAction actor must match the action opportunity source player"
            };
          }
        }

        const decisionValidation = validateSeamstressActionDecisionForOpportunity(command.payload.decision, opportunity);
        if (!decisionValidation.valid) {
          return {
            code: decisionValidation.code,
            message: decisionValidation.reason
          };
        }

        if (opportunity.taskId !== requestedTaskId) {
          return {
            code: "ScheduledTaskNotNext",
            message: "SubmitSeamstressAction taskId must match the referenced action opportunity"
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

        if (targetTask.taskType !== "SEAMSTRESS_ACTION") {
          return {
            code: "UnsupportedRoleActionOpportunity",
            message: "SubmitSeamstressAction requires a Seamstress action task"
          };
        }

        const currentSourceEntry = state.currentCharacterState.entries.find((entry) =>
          entry.playerId === opportunity.sourcePlayerId &&
          entry.seatNumber === opportunity.sourceSeatNumber
        );
        if (!isSeamstressActionOpportunityV2(opportunity)) {
          const legacySourceValid = targetTask.source.kind === "ROLE" && targetTask.source.role.roleId === "seamstress" &&
            targetTask.source.playerId === opportunity.sourcePlayerId && targetTask.source.seatNumber === opportunity.sourceSeatNumber &&
            currentSourceEntry !== undefined && currentSourceEntry.role.roleId === "seamstress" &&
            sameRoleSetupSnapshot(currentSourceEntry.role, targetTask.source.role) &&
            sameRoleSetupSnapshot(currentSourceEntry.role, opportunity.sourceRole) &&
            state.currentCharacterState.revision === opportunity.sourceCharacterStateRevision;
          return legacySourceValid ? undefined : {
            code: "ActionSourceNoLongerValid",
            message: "SubmitSeamstressAction legacy source is no longer the same base Seamstress state"
          };
        }

        const tenure = state.seamstressRoleTenureState?.records.find((record) => record.roleTenureId === opportunity.sourceRoleTenureId);
        const instance = state.seamstressAbilityState?.instances.find((entry) => entry.abilityInstanceId === opportunity.abilityInstanceId);
        const entitlement = state.seamstressAbilityState?.entitlements.find((entry) =>
          entry.abilityUseEntitlementId === opportunity.abilityUseEntitlementId
        );
        if (entitlement?.status === "SPENT") {
          return { code: "AbilityUseEntitlementAlreadySpent", message: "Seamstress ability entitlement is already spent" };
        }
        const abilitySource = opportunity.abilitySource;
        const taskSourceMatches = abilitySource.kind === "ROLE_TENURE"
          ? targetTask.source.kind === "ROLE" && targetTask.source.role.roleId === "seamstress" &&
            targetTask.source.playerId === opportunity.sourcePlayerId && targetTask.source.seatNumber === opportunity.sourceSeatNumber
          : targetTask.source.kind === "PHILOSOPHER_GAINED_ABILITY" && targetTask.source.sourceRole.roleId === "philosopher" &&
            targetTask.source.chosenRole.roleId === "seamstress" && targetTask.source.playerId === opportunity.sourcePlayerId &&
            targetTask.source.seatNumber === opportunity.sourceSeatNumber &&
            (state.philosopherGrantedAbilities?.abilities.some((grant) => grant.grantId === abilitySource.grantId &&
              grant.sourcePlayerId === opportunity.sourcePlayerId && grant.sourceSeatNumber === opportunity.sourceSeatNumber &&
              grant.chosenRoleId === "seamstress") ?? false);
        if (tenure === undefined || instance === undefined || entitlement === undefined || currentSourceEntry === undefined ||
            !isRoleTenureContinuousAcross(tenure, opportunity.sourceCharacterStateRevision, state.currentCharacterState.revision) ||
            instance.sourceRoleTenureId !== tenure.roleTenureId || instance.endedCharacterStateRevision !== undefined ||
            currentSourceEntry.role.roleId !== tenure.roleId || !sameRoleSetupSnapshot(currentSourceEntry.role, opportunity.sourceRole) ||
            !taskSourceMatches) {
          return { code: "ActionSourceNoLongerValid", message: "SubmitSeamstressAction source tenure or ability instance is no longer active" };
        }

        if (command.payload.decision.kind === "CHOOSE_TWO_PLAYERS") {
          const canonicalTargets = canonicalizeSeamstressTargets({
            sourcePlayerId: opportunity.sourcePlayerId,
            targetPlayerIds: command.payload.decision.targetPlayerIds,
            currentCharacterState: state.currentCharacterState
          });
          if (!canonicalTargets.valid || state.roster === undefined || canonicalTargets.targetPlayerIds.some((playerIdValue, index) => {
            const rosterEntry = state.roster?.entries.find((entry) => entry.playerId === playerIdValue);
            return rosterEntry === undefined || rosterEntry.seatNumber !== canonicalTargets.targetSeatNumbers[index];
          })) {
            return { code: "InvalidSeamstressTarget", message: canonicalTargets.valid
              ? "SubmitSeamstressAction targets must match the modeled roster"
              : canonicalTargets.reason };
          }
        }

        return undefined;
      }
    }

    return assertNever(command.payload);
  }

  private clockmakerSourceContract(state: GameState, taskId: ClockmakerInformationDeliveredPayload["taskId"]): ClockmakerSourceContract | undefined {
    const task = state.firstNightTaskPlan?.tasks.find((entry) => entry.taskId === taskId);
    if (task === undefined || task.taskType !== "CLOCKMAKER_INFORMATION" || task.taskClass !== "ROLE_INFORMATION") return undefined;
    if (task.source.kind === "ROLE") return {
      kind: "BASE_CLOCKMAKER", taskId: task.taskId, sourcePlayerId: task.source.playerId, sourceSeatNumber: task.source.seatNumber,
      sourceRole: task.source.role, taskPlanVersion: state.firstNightTaskPlan!.taskPlanVersion
    };
    if (task.source.kind !== "PHILOSOPHER_GAINED_ABILITY") return undefined;
    const gainedSource = task.source;
    const grants = state.philosopherGrantedAbilities?.abilities.filter((grant) =>
      grant.sourcePlayerId === gainedSource.playerId && grant.sourceSeatNumber === gainedSource.seatNumber &&
      grant.grantedAtOpportunityId === gainedSource.opportunityId && grant.sourceCharacterStateRevision === gainedSource.sourceCharacterStateRevision &&
      grant.chosenRoleId === "clockmaker" && sameRoleSetupSnapshot(grant.sourceRole, gainedSource.sourceRole) && sameRoleSetupSnapshot(grant.chosenRole, gainedSource.chosenRole)
    ) ?? [];
    const insertions = state.firstNightTaskInsertions?.insertions.filter((entry) =>
      entry.taskId === task.taskId &&
      ("schedulingVersion" in entry
        ? entry.philosopherOpportunityId === gainedSource.opportunityId &&
          entry.sourcePlayerId === gainedSource.playerId &&
          entry.grantId === grants[0]?.grantId
        : entry.insertedByOpportunityId === gainedSource.opportunityId && entry.insertedByPlayerId === gainedSource.playerId)
    ) ?? [];
    if (grants.length !== 1 || grants[0] === undefined || insertions.length !== 1 || insertions[0] === undefined) return undefined;
    return {
      kind: "PHILOSOPHER_GAINED_CLOCKMAKER", taskId: task.taskId, sourcePlayerId: gainedSource.playerId, sourceSeatNumber: gainedSource.seatNumber,
      sourceRole: gainedSource.sourceRole, gainedRole: gainedSource.chosenRole, grantId: grants[0].grantId,
      grantedAtTaskId: grants[0].grantedAtTaskId, grantedAtOpportunityId: grants[0].grantedAtOpportunityId,
      insertionCharacterStateRevision: insertions[0].sourceCharacterStateRevision
    };
  }

  private createBatchOrReject(
    command: SupportedCommandEnvelope,
    state: GameState | undefined,
    currentGameVersion: number,
    mathematicianDecision?: Extract<InternalMathematicianResolution, { readonly kind: "READY" }>,
    dreamerDecision?: Extract<InternalDreamerV2Resolution,{readonly kind:"READY"}>
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
      if (command.payload.commandType === "SettleClockmakerInformation" && state !== undefined) {
        const contract = this.clockmakerSourceContract(state, command.payload.taskId);
        const native = state.currentCharacterState === undefined || state.roster === undefined || state.setup === undefined
          ? { valid: false as const, reason: "Clockmaker native identity source state is unavailable" }
          : resolveClockmakerNativeReferences({ currentCharacterState: state.currentCharacterState, roster: state.roster.entries, setup: state.setup });
        const effectiveness = contract === undefined || state.currentCharacterState === undefined
          ? { valid: false as const, reason: "Clockmaker source contract is unavailable" }
          : resolveClockmakerSourceEffectiveness({ contract, settlementRevision: state.currentCharacterState.revision,
              grants: state.philosopherGrantedAbilities ?? { abilities: [] }, ...(state.abilityImpairments === undefined ? {} : { impairments: state.abilityImpairments }) });
        const constraint = state.currentCharacterState === undefined || state.setup === undefined || state.seamstressRoleTenureState === undefined
          ? { valid: false as const, reason: "Clockmaker Vortox source state is unavailable" }
          : resolveClockmakerVortoxConstraint({ currentCharacterState: state.currentCharacterState, setup: state.setup, roleTenures: state.seamstressRoleTenureState,
              ...(state.abilityImpairments === undefined ? {} : { abilityImpairments: state.abilityImpairments }) });
        if (!native.valid || !effectiveness.valid || !constraint.valid) {
          const reason = !native.valid ? native.reason : !effectiveness.valid ? effectiveness.reason : !constraint.valid ? constraint.reason : "unsupported";
          return failed(command.gameId, "ApplicationNotConfigured", reason, "first-night-role-information", currentGameVersion);
        }
      }
      if (command.payload.commandType === "SubmitCerenovusAction" && state !== undefined) {
        const opportunity = findCerenovusOpportunity(state.firstNightActionOpportunities, command.payload.opportunityId);
        if (opportunity !== undefined) {
          const capability = evaluateCerenovusEffectiveOnlyCapability({
            sourcePlayerId: opportunity.sourcePlayerId,
            abilityImpairments: state.abilityImpairments
          });
          if (!capability.supported) {
            return failed(
              command.gameId,
              "ApplicationNotConfigured",
              "Cerenovus effective-only settlement is not configured for the current canonical state",
              "first-night-role-action",
              currentGameVersion
            );
          }
        }
      }
      if (
        command.payload.commandType === "SubmitPhilosopherAction" &&
        command.payload.decision.kind === "CHOOSE_GOOD_CHARACTER" &&
        state?.firstNightTaskPlan?.taskPlanVersion === LEGACY_FIRST_NIGHT_TASK_PLAN_VERSION &&
        firstNightTaskTypeForPhilosopherChoice(command.payload.decision.roleId) !== undefined
      ) {
        return failed(
          command.gameId,
          "ApplicationNotConfigured",
          "Mapped Philosopher choices cannot insert tasks into a legacy first-night plan",
          "first-night-role-action",
          currentGameVersion
        );
      }
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
        firstNightSystemInformation,
        mathematicianDecision,
        dreamerDecision
      );
    } catch (error: unknown) {
      if (error instanceof EventMetadataGenerationError) {
        return failed(command.gameId, "MetadataGenerationFailed", error.message, "event-metadata", currentGameVersion);
      }

      if (error instanceof DomainError) {
        if (
          command.payload.commandType === "PlanFirstNightTasks" ||
          command.payload.commandType === "SettleFirstNightSystemTask" ||
          command.payload.commandType === "SettleEvilTwinSetup" ||
          command.payload.commandType === "OpenFirstNightRoleActionOpportunity" ||
          command.payload.commandType === "SubmitPhilosopherAction" ||
          command.payload.commandType === "SubmitSnakeCharmerAction" ||
          command.payload.commandType === "SubmitWitchAction" ||
          command.payload.commandType === "SubmitCerenovusAction" ||
          command.payload.commandType === "SubmitDreamerAction" ||
          command.payload.commandType === "SubmitSeamstressAction" ||
          command.payload.commandType === "SettleClockmakerInformation" ||
          command.payload.commandType === "SettleMathematicianInformation"
        ) {
          const failureStage = command.payload.commandType === "PlanFirstNightTasks"
            ? "first-night-task-planning"
            : command.payload.commandType === "SettleFirstNightSystemTask"
              ? "first-night-system-information"
              : command.payload.commandType === "SettleEvilTwinSetup"
                ? "first-night-role-setup"
              : command.payload.commandType === "SettleClockmakerInformation" || command.payload.commandType === "SettleMathematicianInformation"
                ? "first-night-role-information"
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
    firstNightSystemInformation: FirstNightSystemInformationResolution | undefined,
    mathematicianDecision?: Extract<InternalMathematicianResolution, { readonly kind: "READY" }>,
    dreamerDecision?: Extract<InternalDreamerV2Resolution,{readonly kind:"READY"}>
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
      firstNightSystemInformation,
      mathematicianDecision,
      dreamerDecision
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
    firstNightSystemInformation: FirstNightSystemInformationResolution | undefined,
    mathematicianDecision?: Extract<InternalMathematicianResolution, { readonly kind: "READY" }>,
    dreamerDecision?: Extract<InternalDreamerV2Resolution,{readonly kind:"READY"}>
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
          ...common(firstEventSequence + 2),
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

        const seamstressCapabilityEvent: DomainEventEnvelope<"SeamstressResolutionCapabilityDeclared"> = {
          ...common(firstEventSequence + 1),
          eventType: "SeamstressResolutionCapabilityDeclared" as const,
          payload: createSeamstressResolutionCapabilityDeclaredPayload(RULES_BASELINE_VERSION)
        };

        return [scriptSelectedEvent, seamstressCapabilityEvent, phaseTransitionedEvent];
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

        const opportunityTaskId=command.payload.taskId;
        const targetTask=state.firstNightTaskPlan.tasks.find((entry)=>entry.taskId===opportunityTaskId);
        const opportunity = state.firstNightTaskPlan.taskPlanVersion===CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION&&targetTask?.taskType==="DREAMER_ACTION"
          ? createDreamerV2ActionOpportunityForInternalApplication(state,opportunityTaskId)
          : createFirstNightRoleActionOpportunity({
          taskId: opportunityTaskId,
          firstNightTaskPlan: state.firstNightTaskPlan,
          firstNightTaskProgress: state.firstNightTaskProgress,
          currentCharacterState: state.currentCharacterState,
          firstNightActionOpportunities: state.firstNightActionOpportunities,
          seamstressResolutionCapability: state.seamstressResolutionCapability,
          seamstressRoleTenureState: state.seamstressRoleTenureState,
          seamstressAbilityState: state.seamstressAbilityState,
          philosopherGrantedAbilities: state.philosopherGrantedAbilities
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

          const insertionPayload = createFirstNightTaskInsertedV2Payload({
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            choice: choicePayload,
            grant: grantPayload,
            firstNightTaskPlan: state.firstNightTaskPlan
          });
          if (insertionPayload !== undefined) {
            optionalEvents.push({
              ...common(firstEventSequence + 2 + optionalEvents.length),
              eventType: "FirstNightTaskInsertedV2" as const,
              payload: insertionPayload satisfies FirstNightTaskInsertedV2Payload
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

      case "SubmitSnakeCharmerAction": {
        if (
          state === undefined ||
          state.firstNightTaskPlan === undefined ||
          state.currentCharacterState === undefined ||
          state.roster === undefined
        ) {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "SubmitSnakeCharmerAction event creation requires task plan, current character state, and roster"
          );
        }

        const opportunity = findFirstNightActionOpportunityById(
          state.firstNightActionOpportunities,
          command.payload.opportunityId
        );
        if (
          opportunity === undefined ||
          opportunity.opportunityStatus !== "OPEN" ||
          opportunity.opportunityKind !== "SNAKE_CHARMER_FIRST_NIGHT_ACTION" ||
          opportunity.taskType !== "SNAKE_CHARMER_ACTION"
        ) {
          throw new DomainError(
            "InvalidSnakeCharmerTargetChosenPayload",
            "SubmitSnakeCharmerAction event creation requires an open Snake Charmer action opportunity"
          );
        }

        const targetChoicePayload = createSnakeCharmerTargetChosenPayload({
          rulesBaselineVersion: RULES_BASELINE_VERSION,
          taskId: command.payload.taskId,
          opportunityId: command.payload.opportunityId,
          targetPlayerId: command.payload.decision.targetPlayerId,
          firstNightActionOpportunities: state.firstNightActionOpportunities,
          roster: state.roster.entries
        });

        const snakeCharmerTargetChosenEvent: DomainEventEnvelope<"SnakeCharmerTargetChosen"> = {
          ...common(firstEventSequence),
          eventType: "SnakeCharmerTargetChosen" as const,
          payload: targetChoicePayload satisfies SnakeCharmerTargetChosenPayload
        };

        const effectiveness = evaluateSnakeCharmerEffectiveness({
          sourcePlayerId: targetChoicePayload.sourcePlayerId,
          abilityImpairments: state.abilityImpairments
        });
        if (!effectiveness.effective) {
          const ineffectivePayload = createSnakeCharmerIneffectiveResolvedPayload({
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            targetChoice: targetChoicePayload,
            effectiveness
          });
          const snakeCharmerIneffectiveResolvedEvent: DomainEventEnvelope<"SnakeCharmerIneffectiveResolved"> = {
            ...common(firstEventSequence + 1),
            eventType: "SnakeCharmerIneffectiveResolved" as const,
            payload: ineffectivePayload satisfies SnakeCharmerIneffectiveResolvedPayload
          };
          const settlement = createSnakeCharmerIneffectiveScheduledTaskSettlement({
            taskId: opportunity.taskId,
            characterStateRevision: opportunity.sourceCharacterStateRevision
          });
          const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
            ...common(firstEventSequence + 2),
            eventType: "ScheduledTaskSettled" as const,
            payload: {
              rulesBaselineVersion: RULES_BASELINE_VERSION,
              ...settlement
            } satisfies ScheduledTaskSettledPayload
          };

          return [
            snakeCharmerTargetChosenEvent,
            snakeCharmerIneffectiveResolvedEvent,
            scheduledTaskSettledEvent
          ];
        }

        const targetStateEntry = state.currentCharacterState.entries.find((entry) =>
          entry.playerId === targetChoicePayload.targetPlayerId &&
          entry.seatNumber === targetChoicePayload.targetSeatNumber
        );
        if (targetStateEntry?.role.characterType === "DEMON") {
          const swapPayload = createSnakeCharmerDemonSwapAppliedPayload({
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            targetChoice: targetChoicePayload,
            currentCharacterState: state.currentCharacterState
          });
          const snakeCharmerDemonSwapAppliedEvent: DomainEventEnvelope<"SnakeCharmerDemonSwapApplied"> = {
            ...common(firstEventSequence + 1),
            eventType: "SnakeCharmerDemonSwapApplied" as const,
            payload: swapPayload satisfies SnakeCharmerDemonSwapAppliedPayload
          };

          const poisonPayload = createSnakeCharmerPoisonedImpairmentPayload({
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            swap: swapPayload
          });
          const poisonAppliedEvent: DomainEventEnvelope<"AbilityImpairmentApplied"> = {
            ...common(firstEventSequence + 2),
            eventType: "AbilityImpairmentApplied" as const,
            payload: poisonPayload satisfies AbilityImpairmentAppliedPayload
          };

          const settlement = createSnakeCharmerDemonHitScheduledTaskSettlement({
            taskId: opportunity.taskId,
            characterStateRevision: swapPayload.nextCharacterStateRevision
          });

          const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
            ...common(firstEventSequence + 3),
            eventType: "ScheduledTaskSettled" as const,
            payload: {
              rulesBaselineVersion: RULES_BASELINE_VERSION,
              ...settlement
            } satisfies ScheduledTaskSettledPayload
          };

          return [
            snakeCharmerTargetChosenEvent,
            snakeCharmerDemonSwapAppliedEvent,
            poisonAppliedEvent,
            scheduledTaskSettledEvent
          ];
        }

        const noSwapPayload = createSnakeCharmerNoSwapResolvedPayload({
          rulesBaselineVersion: RULES_BASELINE_VERSION,
          targetChoice: targetChoicePayload
        });

        const snakeCharmerNoSwapResolvedEvent: DomainEventEnvelope<"SnakeCharmerNoSwapResolved"> = {
          ...common(firstEventSequence + 1),
          eventType: "SnakeCharmerNoSwapResolved" as const,
          payload: noSwapPayload satisfies SnakeCharmerNoSwapResolvedPayload
        };

        const settlement = createSnakeCharmerNoSwapScheduledTaskSettlement({
          taskId: opportunity.taskId,
          characterStateRevision: opportunity.sourceCharacterStateRevision
        });

        const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
          ...common(firstEventSequence + 2),
          eventType: "ScheduledTaskSettled" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            ...settlement
          } satisfies ScheduledTaskSettledPayload
        };

        return [snakeCharmerTargetChosenEvent, snakeCharmerNoSwapResolvedEvent, scheduledTaskSettledEvent];
      }

      case "SubmitWitchAction": {
        if (
          state === undefined ||
          state.firstNightTaskPlan === undefined ||
          state.currentCharacterState === undefined ||
          state.roster === undefined
        ) {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "SubmitWitchAction event creation requires task plan, current character state, and roster"
          );
        }

        const opportunity = findFirstNightActionOpportunityById(
          state.firstNightActionOpportunities,
          command.payload.opportunityId
        );
        if (
          opportunity === undefined ||
          opportunity.opportunityStatus !== "OPEN" ||
          opportunity.opportunityKind !== "WITCH_FIRST_NIGHT_ACTION" ||
          opportunity.taskType !== "WITCH_ACTION"
        ) {
          throw new DomainError(
            "InvalidWitchTargetChosenPayload",
            "SubmitWitchAction event creation requires an open Witch action opportunity"
          );
        }

        const targetChoicePayload = createWitchTargetChosenPayload({
          rulesBaselineVersion: RULES_BASELINE_VERSION,
          taskId: command.payload.taskId,
          opportunityId: command.payload.opportunityId,
          targetPlayerId: command.payload.decision.targetPlayerId,
          firstNightActionOpportunities: state.firstNightActionOpportunities,
          roster: state.roster.entries
        });

        const witchTargetChosenEvent: DomainEventEnvelope<"WitchTargetChosen"> = {
          ...common(firstEventSequence),
          eventType: "WitchTargetChosen" as const,
          payload: targetChoicePayload satisfies WitchTargetChosenPayload
        };

        const effectiveness = evaluateWitchEffectiveness({
          sourcePlayerId: targetChoicePayload.sourcePlayerId,
          abilityImpairments: state.abilityImpairments
        });
        if (!effectiveness.effective) {
          const ineffectivePayload = createWitchIneffectiveResolvedPayload({
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            targetChoice: targetChoicePayload,
            effectiveness
          });
          const witchIneffectiveResolvedEvent: DomainEventEnvelope<"WitchIneffectiveResolved"> = {
            ...common(firstEventSequence + 1),
            eventType: "WitchIneffectiveResolved" as const,
            payload: ineffectivePayload satisfies WitchIneffectiveResolvedPayload
          };
          const settlement = createWitchIneffectiveScheduledTaskSettlement({
            taskId: opportunity.taskId,
            characterStateRevision: opportunity.sourceCharacterStateRevision
          });
          const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
            ...common(firstEventSequence + 2),
            eventType: "ScheduledTaskSettled" as const,
            payload: {
              rulesBaselineVersion: RULES_BASELINE_VERSION,
              ...settlement
            } satisfies ScheduledTaskSettledPayload
          };

          return [
            witchTargetChosenEvent,
            witchIneffectiveResolvedEvent,
            scheduledTaskSettledEvent
          ];
        }

        const deathPendingPayload = createWitchDeathPendingMarkedPayload({
          rulesBaselineVersion: RULES_BASELINE_VERSION,
          targetChoice: targetChoicePayload
        });
        const witchDeathPendingMarkedEvent: DomainEventEnvelope<"WitchDeathPendingMarked"> = {
          ...common(firstEventSequence + 1),
          eventType: "WitchDeathPendingMarked" as const,
          payload: deathPendingPayload satisfies WitchDeathPendingPayload
        };

        const settlement = createWitchDeathPendingScheduledTaskSettlement({
          taskId: opportunity.taskId,
          characterStateRevision: opportunity.sourceCharacterStateRevision
        });
        const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
          ...common(firstEventSequence + 2),
          eventType: "ScheduledTaskSettled" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            ...settlement
          } satisfies ScheduledTaskSettledPayload
        };

        return [
          witchTargetChosenEvent,
          witchDeathPendingMarkedEvent,
          scheduledTaskSettledEvent
        ];
      }

      case "SubmitCerenovusAction": {
        if (state === undefined || state.setup === undefined || state.currentCharacterState === undefined || state.roster === undefined) {
          throw new DomainError("InvalidDomainBatchSemantics", "SubmitCerenovusAction event creation requires setup, current character state, and roster");
        }
        const opportunity = findCerenovusOpportunity(state.firstNightActionOpportunities, command.payload.opportunityId);
        if (opportunity === undefined || opportunity.opportunityStatus !== "OPEN") {
          throw new DomainError("InvalidCerenovusChoiceRecordedPayload", "SubmitCerenovusAction requires one open Cerenovus opportunity");
        }
        const choice = createCerenovusChoiceRecordedPayload({
          rulesBaselineVersion: RULES_BASELINE_VERSION,
          opportunity,
          settlementCharacterStateRevision: state.currentCharacterState.revision,
          targetPlayerId: command.payload.decision.targetPlayerId,
          chosenRoleId: command.payload.decision.chosenRoleId,
          roster: state.roster.entries,
          setup: state.setup
        });
        const marker = createCerenovusMadnessMarkedPayload(choice);
        const instruction = createCerenovusMadnessInstructionDeliveredPayload(choice, marker);
        const settlement = createCerenovusScheduledTaskSettlement(choice);
        return [
          { ...common(firstEventSequence), eventType: "CerenovusChoiceRecorded", payload: choice satisfies CerenovusChoiceRecordedPayload },
          { ...common(firstEventSequence + 1), eventType: "CerenovusMadnessMarked", payload: marker satisfies CerenovusMadnessMarkedPayload },
          { ...common(firstEventSequence + 2), eventType: "CerenovusMadnessInstructionDelivered", payload: instruction satisfies CerenovusMadnessInstructionDeliveredPayload },
          { ...common(firstEventSequence + 3), eventType: "ScheduledTaskSettled", payload: { rulesBaselineVersion: RULES_BASELINE_VERSION, ...settlement } satisfies ScheduledTaskSettledPayload }
        ];
      }

      case "SubmitDreamerAction": {
        if (
          state === undefined ||
          state.setup === undefined ||
          state.firstNightTaskPlan === undefined ||
          state.currentCharacterState === undefined ||
          state.roster === undefined
        ) {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "SubmitDreamerAction event creation requires setup, task plan, current character state, and roster"
          );
        }

        const opportunity = findFirstNightActionOpportunityById(
          state.firstNightActionOpportunities,
          command.payload.opportunityId
        );
        if (
          opportunity === undefined ||
          opportunity.opportunityStatus !== "OPEN" ||
          opportunity.opportunityKind !== "DREAMER_FIRST_NIGHT_ACTION" ||
          opportunity.taskType !== "DREAMER_ACTION"
        ) {
          throw new DomainError(
            "InvalidDreamerTargetChosenPayload",
            "SubmitDreamerAction event creation requires an open Dreamer action opportunity"
          );
        }

        if(isDreamerActionOpportunityV2(opportunity)){
          if(dreamerDecision===undefined)throw new DomainError("InvalidDreamerTargetChosenV2Payload","SubmitDreamerAction V2 requires an accepted-stream decision");
          return [
            {...common(firstEventSequence),eventType:"DreamerTargetChosenV2",payload:dreamerDecision.targetPayload satisfies DreamerTargetChosenV2Payload},
            {...common(firstEventSequence+1),eventType:"DreamerInformationDeliveredV2",payload:dreamerDecision.deliveryPayload satisfies DreamerInformationDeliveredV2Payload},
            {...common(firstEventSequence+2),eventType:"ScheduledTaskSettled",payload:dreamerDecision.settlementPayload satisfies ScheduledTaskSettledPayload}
          ];
        }

        const targetChoicePayload = createDreamerTargetChosenPayload({
          rulesBaselineVersion: RULES_BASELINE_VERSION,
          taskId: command.payload.taskId,
          opportunityId: command.payload.opportunityId,
          targetPlayerId: command.payload.decision.targetPlayerId,
          firstNightActionOpportunities: state.firstNightActionOpportunities,
          roster: state.roster.entries,
          currentCharacterState: state.currentCharacterState
        });

        const dreamerTargetChosenEvent: DomainEventEnvelope<"DreamerTargetChosen"> = {
          ...common(firstEventSequence),
          eventType: "DreamerTargetChosen" as const,
          payload: targetChoicePayload satisfies DreamerTargetChosenPayload
        };

        const effectiveness = evaluateDreamerEffectiveness({
          sourcePlayerId: targetChoicePayload.sourcePlayerId,
          abilityImpairments: state.abilityImpairments
        });
        const informationPayload = createDreamerInformationDeliveredPayload({
          rulesBaselineVersion: RULES_BASELINE_VERSION,
          targetChoice: targetChoicePayload,
          setup: state.setup,
          currentCharacterState: state.currentCharacterState,
          effectiveness
        });

        const dreamerInformationDeliveredEvent: DomainEventEnvelope<"DreamerInformationDelivered"> = {
          ...common(firstEventSequence + 1),
          eventType: "DreamerInformationDelivered" as const,
          payload: informationPayload satisfies DreamerInformationDeliveredPayload
        };

        const settlement = createDreamerInformationDeliveredScheduledTaskSettlement({
          taskId: opportunity.taskId,
          characterStateRevision: opportunity.sourceCharacterStateRevision
        });
        const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
          ...common(firstEventSequence + 2),
          eventType: "ScheduledTaskSettled" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            ...settlement
          } satisfies ScheduledTaskSettledPayload
        };

        return [
          dreamerTargetChosenEvent,
          dreamerInformationDeliveredEvent,
          scheduledTaskSettledEvent
        ];
      }

      case "SubmitSeamstressAction": {
        if (
          state === undefined ||
          state.firstNightTaskPlan === undefined ||
          state.currentCharacterState === undefined
        ) {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "SubmitSeamstressAction event creation requires task plan and current character state"
          );
        }

        const opportunity = findFirstNightActionOpportunityById(
          state.firstNightActionOpportunities,
          command.payload.opportunityId
        );
        if (
          opportunity === undefined ||
          opportunity.opportunityStatus !== "OPEN" ||
          opportunity.opportunityKind !== "SEAMSTRESS_FIRST_NIGHT_ACTION" ||
          opportunity.taskType !== "SEAMSTRESS_ACTION"
        ) {
          throw new DomainError(
            "InvalidSeamstressActionDeferredPayload",
            "SubmitSeamstressAction event creation requires an open Seamstress action opportunity"
          );
        }

        if (command.payload.decision.kind === "DEFER") {
          const deferredPayload: SeamstressActionDeferredPayload = isSeamstressActionOpportunityV2(opportunity)
            ? createSeamstressActionDeferredPayloadV2({
                rulesBaselineVersion: RULES_BASELINE_VERSION,
                opportunity,
                settlementCharacterStateRevision: state.currentCharacterState.revision
              })
            : {
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
              };
          const seamstressActionDeferredEvent: DomainEventEnvelope<"SeamstressActionDeferred"> = {
            ...common(firstEventSequence),
            eventType: "SeamstressActionDeferred" as const,
            payload: deferredPayload
          };
          const settlementRevision = "deferSchemaVersion" in deferredPayload
            ? deferredPayload.settlementCharacterStateRevision
            : deferredPayload.sourceCharacterStateRevision;
          const settlement = createSeamstressDeferredScheduledTaskSettlement({
            taskId: opportunity.taskId,
            characterStateRevision: settlementRevision
          });
          const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
            ...common(firstEventSequence + 1),
            eventType: "ScheduledTaskSettled" as const,
            payload: { rulesBaselineVersion: RULES_BASELINE_VERSION, ...settlement } satisfies ScheduledTaskSettledPayload
          };
          return [seamstressActionDeferredEvent, scheduledTaskSettledEvent];
        }

        if (!isSeamstressActionOpportunityV2(opportunity) || state.seamstressRoleTenureState === undefined) {
          throw new DomainError("InvalidSeamstressTargetsChosenPayload", "Seamstress choice requires a V2 opportunity and role-tenure state");
        }
        const sourceRoleTenure = state.seamstressRoleTenureState.records.find((record) =>
          record.roleTenureId === opportunity.sourceRoleTenureId
        );
        if (sourceRoleTenure === undefined) {
          throw new DomainError("InvalidSeamstressTargetsChosenPayload", "Seamstress choice source tenure is missing");
        }
        const choicePayload = createSeamstressTargetsChosenPayload({
          rulesBaselineVersion: RULES_BASELINE_VERSION,
          taskId: opportunity.taskId,
          opportunityId: opportunity.opportunityId,
          abilityInstanceId: opportunity.abilityInstanceId,
          abilityUseEntitlementId: opportunity.abilityUseEntitlementId,
          sourceRoleTenureId: opportunity.sourceRoleTenureId,
          sourcePlayerId: opportunity.sourcePlayerId,
          sourceSeatNumber: opportunity.sourceSeatNumber,
          sourceRole: opportunity.sourceRole,
          opportunityCharacterStateRevision: opportunity.sourceCharacterStateRevision,
          currentCharacterState: state.currentCharacterState,
          targetPlayerIds: command.payload.decision.targetPlayerIds
        });
        const spendPayload = createSeamstressAbilitySpentPayload(choicePayload);
        const informationPayload = createSeamstressInformationDeliveredPayload({
          choice: choicePayload,
          currentCharacterState: state.currentCharacterState,
          sourceRoleTenure,
          roleTenures: state.seamstressRoleTenureState,
          abilityImpairments: state.abilityImpairments
        });
        const settlement = createSeamstressInformationDeliveredScheduledTaskSettlement(informationPayload);
        return [
          {
            ...common(firstEventSequence),
            eventType: "SeamstressTargetsChosen" as const,
            payload: choicePayload satisfies SeamstressTargetsChosenPayload
          },
          {
            ...common(firstEventSequence + 1),
            eventType: "SeamstressAbilitySpent" as const,
            payload: spendPayload satisfies SeamstressAbilitySpentPayload
          },
          {
            ...common(firstEventSequence + 2),
            eventType: "SeamstressInformationDelivered" as const,
            payload: informationPayload satisfies SeamstressInformationDeliveredPayload
          },
          {
            ...common(firstEventSequence + 3),
            eventType: "ScheduledTaskSettled" as const,
            payload: settlement satisfies ScheduledTaskSettledPayload
          }
        ];
      }

      case "SettleClockmakerInformation": {
        if (state === undefined || state.currentCharacterState === undefined || state.roster === undefined || state.setup === undefined || state.seamstressRoleTenureState === undefined) {
          throw new DomainError("InvalidDomainBatchSemantics", "Clockmaker event creation requires complete canonical state");
        }
        const contract = this.clockmakerSourceContract(state, command.payload.taskId);
        if (contract === undefined) throw new DomainError("InvalidClockmakerInformationDeliveredPayload", "Clockmaker source contract is unavailable");
        const native = resolveClockmakerNativeReferences({ currentCharacterState: state.currentCharacterState, roster: state.roster.entries, setup: state.setup });
        const effectiveness = resolveClockmakerSourceEffectiveness({ contract, settlementRevision: state.currentCharacterState.revision,
          grants: state.philosopherGrantedAbilities ?? { abilities: [] }, ...(state.abilityImpairments === undefined ? {} : { impairments: state.abilityImpairments }) });
        const constraint = resolveClockmakerVortoxConstraint({ currentCharacterState: state.currentCharacterState, setup: state.setup,
          roleTenures: state.seamstressRoleTenureState, ...(state.abilityImpairments === undefined ? {} : { abilityImpairments: state.abilityImpairments }) });
        if (!native.valid || !effectiveness.valid || !constraint.valid) throw new DomainError("InvalidClockmakerInformationDeliveredPayload", "Clockmaker canonical resolution is unsupported");
        const delivery = createClockmakerInformationDeliveredPayload({ rulesBaselineVersion: RULES_BASELINE_VERSION, sourceContract: contract,
          settlementCharacterStateRevision: state.currentCharacterState.revision, nativeDemonReferences: [native.demon], nativeMinionReferences: native.minions,
          sourceEffectiveness: effectiveness.effectiveness, vortoxConstraint: constraint.constraint });
        const settlement = createClockmakerInformationDeliveredScheduledTaskSettlement(delivery);
        const firstMetadata = common(firstEventSequence);
        const secondMetadata = common(firstEventSequence + 1);
        return [
          { ...firstMetadata, eventType: "ClockmakerInformationDelivered", payload: delivery satisfies ClockmakerInformationDeliveredPayload },
          { ...secondMetadata, createdAt: firstMetadata.createdAt, eventType: "ScheduledTaskSettled", payload: settlement satisfies ScheduledTaskSettledPayload }
        ];
      }

      case "SettleMathematicianInformation": {
        if (state === undefined || mathematicianDecision === undefined) {
          throw new DomainError("InvalidDomainBatchSemantics", "Mathematician event creation requires one complete accepted-stream READY decision");
        }
        const firstMetadata = common(firstEventSequence);
        const secondMetadata = common(firstEventSequence + 1);
        return [
          {
            ...firstMetadata,
            eventType: "MathematicianInformationDelivered",
            payload: mathematicianDecision.deliveryPayload satisfies MathematicianInformationDeliveredPayload
          },
          {
            ...secondMetadata,
            createdAt: firstMetadata.createdAt,
            eventType: "ScheduledTaskSettled",
            payload: mathematicianDecision.settlementPayload satisfies ScheduledTaskSettledPayload
          }
        ];
      }

      case "SettleEvilTwinSetup": {
        if (
          state === undefined ||
          state.firstNightTaskPlan === undefined ||
          state.currentCharacterState === undefined
        ) {
          throw new DomainError(
            "InvalidDomainBatchSemantics",
            "SettleEvilTwinSetup event creation requires task plan and current character state"
          );
        }

        const pairPayload = createEvilTwinPairEstablishedPayload({
          rulesBaselineVersion: RULES_BASELINE_VERSION,
          taskId: command.payload.taskId,
          firstNightTaskPlan: state.firstNightTaskPlan,
          firstNightTaskProgress: state.firstNightTaskProgress,
          currentCharacterState: state.currentCharacterState
        });

        const pairEstablishedEvent: DomainEventEnvelope<"EvilTwinPairEstablished"> = {
          ...common(firstEventSequence),
          eventType: "EvilTwinPairEstablished" as const,
          payload: pairPayload satisfies EvilTwinPairEstablishedPayload
        };

        const informationPayload = createEvilTwinInformationDeliveredPayload({
          rulesBaselineVersion: RULES_BASELINE_VERSION,
          pair: pairPayload
        });

        const informationDeliveredEvent: DomainEventEnvelope<"EvilTwinInformationDelivered"> = {
          ...common(firstEventSequence + 1),
          eventType: "EvilTwinInformationDelivered" as const,
          payload: informationPayload satisfies EvilTwinInformationDeliveredPayload
        };

        const settlement = createEvilTwinPairEstablishedScheduledTaskSettlement({
          taskId: pairPayload.taskId,
          characterStateRevision: pairPayload.characterStateRevision
        });

        const scheduledTaskSettledEvent: DomainEventEnvelope<"ScheduledTaskSettled"> = {
          ...common(firstEventSequence + 2),
          eventType: "ScheduledTaskSettled" as const,
          payload: {
            rulesBaselineVersion: RULES_BASELINE_VERSION,
            ...settlement
          } satisfies ScheduledTaskSettledPayload
        };

        return [pairEstablishedEvent, informationDeliveredEvent, scheduledTaskSettledEvent];
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
    batch: DomainEventBatch,
    priorAcceptedEvents: readonly AnyDomainEventEnvelope[]
  ): CommandExecutionFailed | { readonly code: "DomainValidationFailed"; readonly message: string } | undefined {
    try {
      if (command.payload.commandType === "SettleMathematicianInformation") {
        const deliveryEvent = batch.events[0];
        const settlementEvent = batch.events[1];
        if (batch.events.length !== 2 || deliveryEvent?.eventType !== "MathematicianInformationDelivered" ||
            settlementEvent?.eventType !== "ScheduledTaskSettled") {
          throw new DomainError("InvalidDomainBatchSemantics", "Mathematician success must be exactly delivery then settlement");
        }
        const validation = validateProspectiveMathematicianInformationPair({
          priorAcceptedEvents,
          deliveryEvent,
          settlementEvent
        });
        if (!validation.valid) throw new DomainError("InvalidDomainBatchSemantics", validation.reason);
      }
      if(command.payload.commandType==="SubmitDreamerAction"&&state!==undefined&&batch.events[0]?.eventType==="DreamerTargetChosenV2"){
        const [target,delivery,settlement]=batch.events;
        if(target?.eventType!=="DreamerTargetChosenV2"||delivery?.eventType!=="DreamerInformationDeliveredV2"||settlement?.eventType!=="ScheduledTaskSettled"||batch.events.length!==3)throw new DomainError("InvalidDomainBatchSemantics","Dreamer V2 success must be one exact triplet");
        const fingerprint=captureDreamerV2PipelineFingerprintForInternalApplication({state,taskId:target.payload.taskId,boundary:{boundaryVersion:DREAMER_V2_RESOLUTION_BOUNDARY_VERSION,stage:"PRE_TARGET",opportunityId:target.payload.opportunityId,targetPlayerId:target.payload.targetPlayerId,targetChoiceId:null,deliveryId:null}});
        const validator=this.dependencies.dreamerV2ProspectiveValidator??validateProspectiveDreamerV2TripletForInternalApplication;
        const validation=validator({priorAcceptedEvents,pipelineStateFingerprint:fingerprint,events:[target,delivery,settlement]});
        if(!validation.valid)throw new DomainError("InvalidDomainBatchSemantics",`${validation.code}: ${validation.reason}`);
      }
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

      if (command.payload.commandType === "SettleEvilTwinSetup") {
        return failed(
          batch.gameId,
          "DependencyExecutionFailed",
          error.message,
          "first-night-role-setup",
          batch.expectedGameVersion
        );
      }

      if (command.payload.commandType === "SettleClockmakerInformation") {
        return failed(batch.gameId, "DependencyExecutionFailed", error.message, "first-night-role-information", batch.expectedGameVersion);
      }

      if (command.payload.commandType === "SettleMathematicianInformation") {
        return failed(batch.gameId, "DependencyExecutionFailed", error.message, "prospective-validation", batch.expectedGameVersion);
      }

      if (
        command.payload.commandType === "OpenFirstNightRoleActionOpportunity" ||
        command.payload.commandType === "SubmitPhilosopherAction" ||
        command.payload.commandType === "SubmitSnakeCharmerAction" ||
        command.payload.commandType === "SubmitWitchAction" ||
        command.payload.commandType === "SubmitCerenovusAction" ||
        command.payload.commandType === "SubmitDreamerAction" ||
        command.payload.commandType === "SubmitSeamstressAction"
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

  private async recordRejected(
    command: SupportedCommandEnvelope,
    commandFingerprint: CommandFingerprint,
    result: CommandRejected
  ): Promise<CommandResult> {
    try {
      await this.dependencies.commandStore.recordRejectedCommand({
        gameId: command.gameId,
        commandId: command.commandId,
        receipt: {
          commandId: command.commandId,
          gameId: command.gameId,
          commandFingerprint,
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
