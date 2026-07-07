import type { BatchId, CausationId, CommandId, CorrelationId, EventId, GameId } from "./ids.js";
import type { GamePhase } from "./game-phase.js";
import type { PhaseTransitionReason } from "./phase-transition-policy.js";
import type { GeneratedSetup, SupportedEdition } from "./setup-types.js";

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

export type DomainEventPayloadByType = {
  readonly GameCreated: GameCreatedPayload;
  readonly ScriptSelected: ScriptSelectedPayload;
  readonly SetupGenerated: SetupGeneratedPayload;
  readonly PhaseTransitioned: PhaseTransitionedPayload;
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
