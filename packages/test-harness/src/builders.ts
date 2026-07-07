import {
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  batchId,
  causationId,
  commandId,
  correlationId,
  eventId,
  gameId,
  playerId
} from "@botc/domain-core";
import type {
  AuditEventEnvelope,
  CreateGameCommand,
  CreateGameCommandPayload,
  DomainEventEnvelope,
  GameId,
  InfrastructureEventEnvelope,
  SelectScriptCommand,
  SelectScriptCommandPayload
} from "@botc/domain-core";

export const ids = {
  game: gameId("game-1"),
  command: commandId("command-1"),
  correlation: correlationId("correlation-1")
};

export const systemActor = { kind: "system", systemId: "test" } as const;
export const humanActor = { kind: "human", playerId: playerId("player-human-1") } as const;
export const aiActor = { kind: "ai", playerId: playerId("player-ai-1") } as const;
export const storytellerActor = { kind: "storyteller" } as const;

export const createGamePayload = {
  commandType: "CreateGame",
  rootSeed: "seed-1",
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  playerCount: 12,
  humanPlayerCount: 1,
  aiPlayerCount: 11,
  storytellerCount: 1
} as const satisfies CreateGameCommandPayload;

export const selectScriptPayload = {
  commandType: "SelectScript",
  scriptId: "sects-and-violets",
  scriptName: "Sects & Violets",
  edition: "sects-and-violets"
} as const satisfies SelectScriptCommandPayload;

export const createGameCommand = (
  overrides: Partial<CreateGameCommand> = {}
): CreateGameCommand => ({
  commandId: ids.command,
  gameId: ids.game,
  expectedGameVersion: 0,
  actor: systemActor,
  issuedAt: "2026-07-07T00:00:00.000Z",
  correlationId: ids.correlation,
  payload: createGamePayload,
  ...overrides
});

export const selectScriptCommand = (
  overrides: Partial<SelectScriptCommand> = {}
): SelectScriptCommand => ({
  commandId: commandId("command-2"),
  gameId: ids.game,
  expectedGameVersion: 1,
  actor: systemActor,
  issuedAt: "2026-07-07T00:00:01.000Z",
  correlationId: correlationId("correlation-2"),
  payload: selectScriptPayload,
  ...overrides
});

export const gameCreatedEvent = (
  overrides: Partial<DomainEventEnvelope<"GameCreated">> = {}
): DomainEventEnvelope<"GameCreated"> => ({
  category: "domain",
  eventId: eventId("event-1"),
  gameId: ids.game,
  eventSequence: 1,
  batchId: batchId("batch-1"),
  gameVersion: 1,
  eventType: "GameCreated",
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: ids.command,
  createdAt: "2026-07-07T00:00:00.000Z",
  correlationId: ids.correlation,
  causationId: causationId("command-1"),
  payload: {
    gameId: ids.game,
    rootSeed: "seed-1",
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    playerCount: 12,
    humanPlayerCount: 1,
    aiPlayerCount: 11,
    storytellerCount: 1
  },
  ...overrides
});

export const scriptSelectedEvent = (
  overrides: Partial<DomainEventEnvelope<"ScriptSelected">> = {}
): DomainEventEnvelope<"ScriptSelected"> => ({
  category: "domain",
  eventId: eventId("event-2"),
  gameId: ids.game,
  eventSequence: 2,
  batchId: batchId("batch-2"),
  gameVersion: 2,
  eventType: "ScriptSelected",
  eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION,
  rulesBaselineVersion: RULES_BASELINE_VERSION,
  commandId: commandId("command-2"),
  createdAt: "2026-07-07T00:00:01.000Z",
  correlationId: correlationId("correlation-2"),
  causationId: causationId("command-2"),
  payload: {
    scriptId: "sects-and-violets",
    scriptName: "Sects & Violets",
    edition: "sects-and-violets",
    rulesBaselineVersion: RULES_BASELINE_VERSION
  },
  ...overrides
});

export const auditEvent = (): AuditEventEnvelope => ({
  category: "audit",
  auditType: "InvalidCommandRejected",
  eventId: eventId("audit-1"),
  gameId: ids.game,
  commandId: ids.command,
  createdAt: "2026-07-07T00:00:00.000Z",
  correlationId: ids.correlation,
  payload: {}
});

export const infrastructureEvent = (): InfrastructureEventEnvelope => ({
  category: "infrastructure",
  infrastructureType: "SnapshotSaved",
  eventId: eventId("infra-1"),
  gameId: ids.game,
  createdAt: "2026-07-07T00:00:00.000Z",
  correlationId: ids.correlation,
  payload: {}
});

export const otherGameId = (value = "game-2"): GameId => gameId(value);
export const humanPlayerId = playerId("player-human-1");
