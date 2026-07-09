import type { BatchId, CausationId, CommandId, CorrelationId, EventId, GameId } from "./ids.js";
import type { GamePhase } from "./game-phase.js";
import type { PhaseTransitionReason } from "./phase-transition-policy.js";
import type { CharacterAssignmentSet } from "./character-assignment.js";
import type { FirstNightTaskPlan } from "./first-night-task-plan.js";
import type { ScheduledTaskSettledPayload } from "./first-night-task-plan.js";
import type {
  FirstNightActionOpportunityCreatedPayload,
  PhilosopherActionDeferredPayload
} from "./first-night-action-opportunity.js";
import type {
  AbilityImpairmentAppliedPayload,
  FirstNightTaskInsertedPayload,
  PhilosopherAbilityChosenPayload,
  PhilosopherAbilityGrantedPayload
} from "./philosopher-ability.js";
import type {
  DemonInformationDeliveredPayload,
  MinionInformationDeliveredPayload
} from "./first-night-team-information.js";
import type { InitialOwnCharacterKnowledgeEntry } from "./initial-private-knowledge.js";
import type { PlayerRoster } from "./player-roster.js";
import type { GeneratedSetup, SupportedEdition } from "./setup-types.js";

export type { ScheduledTaskSettledPayload } from "./first-night-task-plan.js";
export type {
  FirstNightActionOpportunityCreatedPayload,
  PhilosopherActionDeferredPayload
} from "./first-night-action-opportunity.js";
export type {
  AbilityImpairmentAppliedPayload,
  FirstNightTaskInsertedPayload,
  PhilosopherAbilityChosenPayload,
  PhilosopherAbilityGrantedPayload
} from "./philosopher-ability.js";
export type {
  DemonInformationDeliveredPayload,
  MinionInformationDeliveredPayload
} from "./first-night-team-information.js";

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

export type DomainEventPayloadByType = {
  readonly GameCreated: GameCreatedPayload;
  readonly ScriptSelected: ScriptSelectedPayload;
  readonly SetupGenerated: SetupGeneratedPayload;
  readonly PlayerRosterCreated: PlayerRosterCreatedPayload;
  readonly CharactersAssigned: CharactersAssignedPayload;
  readonly PhaseTransitioned: PhaseTransitionedPayload;
  readonly FirstNightInitialized: FirstNightInitializedPayload;
  readonly InitialPrivateKnowledgeEstablished: InitialPrivateKnowledgeEstablishedPayload;
  readonly FirstNightTaskPlanCreated: FirstNightTaskPlanCreatedPayload;
  readonly FirstNightActionOpportunityCreated: FirstNightActionOpportunityCreatedPayload;
  readonly PhilosopherActionDeferred: PhilosopherActionDeferredPayload;
  readonly PhilosopherAbilityChosen: PhilosopherAbilityChosenPayload;
  readonly PhilosopherAbilityGranted: PhilosopherAbilityGrantedPayload;
  readonly AbilityImpairmentApplied: AbilityImpairmentAppliedPayload;
  readonly FirstNightTaskInserted: FirstNightTaskInsertedPayload;
  readonly MinionInformationDelivered: MinionInformationDeliveredPayload;
  readonly DemonInformationDelivered: DemonInformationDeliveredPayload;
  readonly ScheduledTaskSettled: ScheduledTaskSettledPayload;
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
