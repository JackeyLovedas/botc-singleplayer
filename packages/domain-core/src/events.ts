import type { BatchId, CausationId, CommandId, CorrelationId, EventId, GameId } from "./ids.js";
import type { GamePhase } from "./game-phase.js";
import type { PhaseTransitionReason } from "./phase-transition-policy.js";
import type { CharacterAssignmentSet } from "./character-assignment.js";
import type { FirstNightTaskPlan } from "./first-night-task-plan.js";
import type { ScheduledTaskSettledPayload } from "./first-night-task-plan.js";
import type {
  FirstNightActionOpportunityCreatedPayload,
  PhilosopherActionDeferredPayload,
  SeamstressActionDeferredPayload
} from "./first-night-action-opportunity.js";
import type {
  AbilityImpairmentAppliedPayload,
  FirstNightTaskInsertedPayload,
  FirstNightTaskInsertedV2Payload,
  PhilosopherAbilityChosenPayload,
  PhilosopherAbilityGrantedPayload
} from "./philosopher-ability.js";
import type {
  SnakeCharmerDemonSwapAppliedPayload,
  SnakeCharmerIneffectiveResolvedPayload,
  SnakeCharmerNoSwapResolvedPayload,
  SnakeCharmerTargetChosenPayload
} from "./snake-charmer.js";
import type {
  WitchDeathPendingPayload,
  WitchIneffectiveResolvedPayload,
  WitchTargetChosenPayload
} from "./witch.js";
import type {
  DreamerInformationDeliveredPayload,
  DreamerTargetChosenPayload
} from "./dreamer.js";
import type {
  CerenovusChoiceRecordedPayload,
  CerenovusMadnessInstructionDeliveredPayload,
  CerenovusMadnessMarkedPayload
} from "./cerenovus.js";
import type {
  SeamstressAbilitySpentPayload,
  SeamstressInformationDeliveredPayload,
  SeamstressResolutionCapabilityDeclaredPayload,
  SeamstressTargetsChosenPayload
} from "./seamstress.js";
import type { ClockmakerInformationDeliveredPayload } from "./clockmaker.js";
import type { MathematicianInformationDeliveredPayload } from "./mathematician.js";
import type {
  DemonInformationDeliveredPayload,
  MinionInformationDeliveredPayload
} from "./first-night-team-information.js";
import type {
  EvilTwinInformationDeliveredPayload,
  EvilTwinPairEstablishedPayload
} from "./evil-twin.js";
import type { InitialOwnCharacterKnowledgeEntry } from "./initial-private-knowledge.js";
import type { PlayerRoster } from "./player-roster.js";
import type { GeneratedSetup, SupportedEdition } from "./setup-types.js";

export type { ScheduledTaskSettledPayload } from "./first-night-task-plan.js";
export type {
  FirstNightActionOpportunityCreatedPayload,
  PhilosopherActionDeferredPayload,
  SeamstressActionDeferredPayload
} from "./first-night-action-opportunity.js";
export type {
  AbilityImpairmentAppliedPayload,
  FirstNightTaskInsertedPayload,
  FirstNightTaskInsertedV2Payload,
  PhilosopherAbilityChosenPayload,
  PhilosopherAbilityGrantedPayload
} from "./philosopher-ability.js";
export type {
  SnakeCharmerDemonSwapAppliedPayload,
  SnakeCharmerIneffectiveResolvedPayload,
  SnakeCharmerNoSwapResolvedPayload,
  SnakeCharmerTargetChosenPayload
} from "./snake-charmer.js";
export type {
  WitchDeathPendingPayload,
  WitchIneffectiveResolvedPayload,
  WitchTargetChosenPayload
} from "./witch.js";
export type {
  DreamerInformationDeliveredPayload,
  DreamerTargetChosenPayload
} from "./dreamer.js";
export type {
  CerenovusChoiceRecordedPayload,
  CerenovusMadnessInstructionDeliveredPayload,
  CerenovusMadnessMarkedPayload
} from "./cerenovus.js";
export type {
  SeamstressAbilitySpentPayload,
  SeamstressInformationDeliveredPayload,
  SeamstressResolutionCapabilityDeclaredPayload,
  SeamstressTargetsChosenPayload
} from "./seamstress.js";
export type { ClockmakerInformationDeliveredPayload } from "./clockmaker.js";
export type { MathematicianInformationDeliveredPayload } from "./mathematician.js";
export type {
  DemonInformationDeliveredPayload,
  MinionInformationDeliveredPayload
} from "./first-night-team-information.js";
export type {
  EvilTwinInformationDeliveredPayload,
  EvilTwinPairEstablishedPayload
} from "./evil-twin.js";

export const SUPPORTED_DOMAIN_EVENT_VERSION = 1;
export const RULES_BASELINE_VERSION = "Phase One v2.1";

export type PlayerCounts = {
  readonly playerCount: 12;
  readonly humanPlayerCount: 1;
  readonly aiPlayerCount: 11;
  readonly storytellerCount: 1;
};

export type GameCreatedPayload = {
  readonly gameId: GameId;
  readonly rootSeed: string;
  readonly rulesBaselineVersion: string;
  readonly playerCount: number;
  readonly humanPlayerCount: number;
  readonly aiPlayerCount: number;
  readonly storytellerCount: number;
};

export type ScriptSelectedPayload = {
  readonly rulesBaselineVersion: string;
  readonly scriptId: string;
  readonly scriptName: string;
  readonly edition: SupportedEdition;
};

export type SetupGeneratedPayload = GeneratedSetup & {
  readonly rulesBaselineVersion: string;
};

export type PlayerRosterCreatedPayload = {
  readonly rulesBaselineVersion: string;
  readonly rosterVersion: string;
  readonly entries: PlayerRoster;
};

export type CharactersAssignedPayload = {
  readonly rulesBaselineVersion: string;
  readonly rosterVersion: string;
  readonly assignmentAlgorithmVersion: string;
  readonly randomAlgorithmVersion: string;
  readonly randomStream: string;
  readonly roleCatalogSignature: string;
  readonly assignments: CharacterAssignmentSet;
};

export type PhaseTransitionedPayload = {
  readonly rulesBaselineVersion: string;
  readonly fromPhase: GamePhase;
  readonly toPhase: GamePhase;
  readonly transitionReason: PhaseTransitionReason;
  readonly dayNumberBefore: number;
  readonly dayNumberAfter: number;
  readonly nightNumberBefore: number;
  readonly nightNumberAfter: number;
};

export type FirstNightInitializedPayload = {
  readonly rulesBaselineVersion: string;
  readonly initializationVersion: string;
  readonly nightNumber: 1;
  readonly rosterVersion: string;
  readonly assignmentAlgorithmVersion: string;
  readonly roleCatalogSignature: string;
};

export type InitialPrivateKnowledgeEstablishedPayload = {
  readonly rulesBaselineVersion: string;
  readonly knowledgeModelVersion: string;
  readonly knowledgeStage: string;
  readonly rosterVersion: string;
  readonly assignmentAlgorithmVersion: string;
  readonly roleCatalogSignature: string;
  readonly entries: readonly InitialOwnCharacterKnowledgeEntry[];
};

export type FirstNightTaskPlanCreatedPayload = FirstNightTaskPlan & {
  readonly rulesBaselineVersion: string;
};

export type NominationDeclaredPayload = { readonly rulesBaselineVersion: string; readonly nominationId: string; readonly nominatorPlayerId: string; readonly nomineePlayerId: string; readonly dayNumber: number; readonly nominationOrdinal: number };
export type VoteCastPayload = { readonly rulesBaselineVersion: string; readonly voteId: string; readonly nominationId: string; readonly voterPlayerId: string; readonly voterSeatNumber: number; readonly choice: "YES" | "NO"; readonly ghostVoteConsumed: boolean };
export type BlockStateUpdatedPayload = { readonly rulesBaselineVersion: string; readonly nominationId: string; readonly dayNumber: number; readonly livingPlayerCount: number; readonly threshold: number; readonly leaderNominationId: string | null; readonly leaderVoteCount: number; readonly tied: boolean };
export type ExecutionDeclaredPayload = { readonly rulesBaselineVersion: string; readonly executionId: string; readonly blockId: string; readonly targetPlayerId: string; readonly dayNumber: number };
export type PlayerDiedPayload = {
  readonly rulesBaselineVersion: string;
  readonly deathId: string;
  readonly executionId: string | null;
  readonly playerId: string;
  readonly deadSeatNumber: number;
  readonly dayNumber: number;
  readonly nightNumber: number;
  readonly phase: "EXECUTION_RESOLUTION" | "NIGHT_TASKS";
  readonly cause: "EXECUTION" | "GENERIC_DEMON_KILL";
  readonly causeEventId: string;
  readonly causeEventType: "ExecutionResolved" | "OrdinaryNightTargetDerived";
  readonly sourcePlayerId: string | null;
  readonly sourceRoleId: "vortox" | null;
  readonly characterStateRevision: number;
};
export type ExecutionResolvedPayload = { readonly rulesBaselineVersion: string; readonly executionId: string; readonly targetPlayerId: string; readonly dayNumber: number; readonly resolution: "EXECUTED"; readonly deathOutcome: "DIED" | "DID_NOT_DIE" };
export type DayClosedWithoutExecutionPayload = { readonly rulesBaselineVersion: string; readonly dayNumber: number; readonly blockId: string | null; readonly reason: "NO_EXECUTABLE_CANDIDATE" };
export type OrdinaryNightTaskPlanCreatedPayload = import("./ordinary-night.js").OrdinaryNightTaskPlan & { readonly rulesBaselineVersion: string };
export type OrdinaryNightTargetDerivedPayload = import("./ordinary-night.js").OrdinaryNightTarget & { readonly rulesBaselineVersion: string };
export type OrdinaryNightTaskSettledPayload = import("./ordinary-night.js").OrdinaryNightTaskSettlement & { readonly rulesBaselineVersion: string };

export type DomainEventPayloadByType = {
  readonly GameCreated: GameCreatedPayload;
  readonly ScriptSelected: ScriptSelectedPayload;
  readonly SeamstressResolutionCapabilityDeclared: SeamstressResolutionCapabilityDeclaredPayload;
  readonly SetupGenerated: SetupGeneratedPayload;
  readonly PlayerRosterCreated: PlayerRosterCreatedPayload;
  readonly CharactersAssigned: CharactersAssignedPayload;
  readonly PhaseTransitioned: PhaseTransitionedPayload;
  readonly FirstNightInitialized: FirstNightInitializedPayload;
  readonly InitialPrivateKnowledgeEstablished: InitialPrivateKnowledgeEstablishedPayload;
  readonly FirstNightTaskPlanCreated: FirstNightTaskPlanCreatedPayload;
  readonly FirstNightActionOpportunityCreated: FirstNightActionOpportunityCreatedPayload;
  readonly PhilosopherActionDeferred: PhilosopherActionDeferredPayload;
  readonly SeamstressActionDeferred: SeamstressActionDeferredPayload;
  readonly SeamstressTargetsChosen: SeamstressTargetsChosenPayload;
  readonly SeamstressAbilitySpent: SeamstressAbilitySpentPayload;
  readonly SeamstressInformationDelivered: SeamstressInformationDeliveredPayload;
  readonly PhilosopherAbilityChosen: PhilosopherAbilityChosenPayload;
  readonly PhilosopherAbilityGranted: PhilosopherAbilityGrantedPayload;
  readonly AbilityImpairmentApplied: AbilityImpairmentAppliedPayload;
  readonly FirstNightTaskInserted: FirstNightTaskInsertedPayload;
  readonly FirstNightTaskInsertedV2: FirstNightTaskInsertedV2Payload;
  readonly SnakeCharmerTargetChosen: SnakeCharmerTargetChosenPayload;
  readonly SnakeCharmerDemonSwapApplied: SnakeCharmerDemonSwapAppliedPayload;
  readonly SnakeCharmerNoSwapResolved: SnakeCharmerNoSwapResolvedPayload;
  readonly SnakeCharmerIneffectiveResolved: SnakeCharmerIneffectiveResolvedPayload;
  readonly WitchTargetChosen: WitchTargetChosenPayload;
  readonly WitchDeathPendingMarked: WitchDeathPendingPayload;
  readonly WitchIneffectiveResolved: WitchIneffectiveResolvedPayload;
  readonly CerenovusChoiceRecorded: CerenovusChoiceRecordedPayload;
  readonly CerenovusMadnessMarked: CerenovusMadnessMarkedPayload;
  readonly CerenovusMadnessInstructionDelivered: CerenovusMadnessInstructionDeliveredPayload;
  readonly DreamerTargetChosen: DreamerTargetChosenPayload;
  readonly DreamerInformationDelivered: DreamerInformationDeliveredPayload;
  readonly ClockmakerInformationDelivered: ClockmakerInformationDeliveredPayload;
  readonly MathematicianInformationDelivered: MathematicianInformationDeliveredPayload;
  readonly EvilTwinPairEstablished: EvilTwinPairEstablishedPayload;
  readonly EvilTwinInformationDelivered: EvilTwinInformationDeliveredPayload;
  readonly MinionInformationDelivered: MinionInformationDeliveredPayload;
  readonly DemonInformationDelivered: DemonInformationDeliveredPayload;
  readonly ScheduledTaskSettled: ScheduledTaskSettledPayload;
  readonly NominationDeclared: NominationDeclaredPayload;
  readonly VoteCast: VoteCastPayload;
  readonly BlockStateUpdated: BlockStateUpdatedPayload;
  readonly ExecutionDeclared: ExecutionDeclaredPayload;
  readonly PlayerDied: PlayerDiedPayload;
  readonly ExecutionResolved: ExecutionResolvedPayload;
  readonly DayClosedWithoutExecution: DayClosedWithoutExecutionPayload;
  readonly OrdinaryNightTaskPlanCreated: OrdinaryNightTaskPlanCreatedPayload;
  readonly OrdinaryNightTargetDerived: OrdinaryNightTargetDerivedPayload;
  readonly OrdinaryNightTaskSettled: OrdinaryNightTaskSettledPayload;
};

export type DomainEventType = keyof DomainEventPayloadByType;

export type DomainEventEnvelope<TType extends DomainEventType = DomainEventType> = {
  readonly category: "domain";
  readonly eventId: EventId;
  readonly gameId: GameId;
  readonly eventSequence: number;
  readonly batchId: BatchId;
  readonly gameVersion: number;
  readonly eventType: TType;
  readonly eventVersion: typeof SUPPORTED_DOMAIN_EVENT_VERSION;
  readonly rulesBaselineVersion: string;
  readonly commandId: CommandId;
  readonly createdAt: string;
  readonly correlationId: CorrelationId;
  readonly causationId: CausationId;
  readonly payload: DomainEventPayloadByType[TType];
};

export type AnyDomainEventEnvelope = {
  readonly [TType in DomainEventType]: DomainEventEnvelope<TType>;
}[DomainEventType];

export type AuditEventType =
  | "AICommandCandidateReceived"
  | "AICommandCandidateRejected"
  | "InvalidCommandRejected"
  | "DuplicateCommandIgnored"
  | "ExpectedVersionMismatchRejected"
  | "ProjectionLeakageCheckFailed";

export type AuditEventEnvelope<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  readonly category: "audit";
  readonly auditType: AuditEventType;
  readonly eventId: EventId;
  readonly gameId: GameId;
  readonly commandId: CommandId;
  readonly createdAt: string;
  readonly correlationId: CorrelationId;
  readonly payload: TPayload;
};

export type InfrastructureEventType =
  | "SnapshotSaved"
  | "SnapshotSaveFailed"
  | "DatabaseMigrated"
  | "ExportCreated";

export type InfrastructureEventEnvelope<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  readonly category: "infrastructure";
  readonly infrastructureType: InfrastructureEventType;
  readonly eventId: EventId;
  readonly gameId: GameId;
  readonly createdAt: string;
  readonly correlationId: CorrelationId;
  readonly payload: TPayload;
};

export const isCanonicalPlayerCounts = (payload: GameCreatedPayload): payload is GameCreatedPayload & PlayerCounts =>
  payload.playerCount === 12 &&
  payload.humanPlayerCount === 1 &&
  payload.aiPlayerCount === 11 &&
  payload.storytellerCount === 1;
