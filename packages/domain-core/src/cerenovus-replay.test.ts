import { describe, expect, it } from "vitest";
import {
  DomainError,
  RULES_BASELINE_VERSION,
  SUPPORTED_DOMAIN_EVENT_VERSION,
  actionOpportunityId,
  applyDomainEventBatch,
  batchId,
  commandId,
  createCerenovusChoiceRecordedPayload,
  createCerenovusMadnessInstructionDeliveredPayload,
  createCerenovusMadnessMarkedPayload,
  createCerenovusScheduledTaskSettlement,
  eventId,
  formatCerenovusAbilityInstanceId,
  formatRoleTenureId,
  playerId,
  rebuildGameState,
  roleId,
  scheduledTaskId,
  seatNumber
} from "./index.js";
import type {
  AnyDomainEventEnvelope,
  CerenovusActionOpportunity,
  DomainEventEnvelope,
  GameState
} from "./index.js";
import {
  charactersAssignedEvent,
  charactersAssignedPhaseTransitionedEvent,
  firstNightInitializedEvent,
  firstNightTaskPlanCreatedEvent,
  gameCreatedEvent,
  initialPrivateKnowledgeEstablishedEvent,
  phaseTransitionedEvent,
  playerRosterCreatedEvent,
  scriptSelectedEvent,
  setupGeneratedEvent,
  setupPhaseTransitionedEvent
} from "@botc/test-harness";

const baseState = (): GameState => rebuildGameState([
  gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent(), setupGeneratedEvent(), setupPhaseTransitionedEvent(),
  playerRosterCreatedEvent(), charactersAssignedEvent(), charactersAssignedPhaseTransitionedEvent(),
  firstNightInitializedEvent(), initialPrivateKnowledgeEstablishedEvent(), firstNightTaskPlanCreatedEvent()
]);

const fixture = (): { readonly state: GameState; readonly opportunity: CerenovusActionOpportunity } => {
  const base = baseState();
  const plan = base.firstNightTaskPlan;
  const task = plan?.tasks.find((entry) => entry.taskType === "CERENOVUS_ACTION");
  if (plan === undefined || task === undefined || task.source.kind !== "ROLE" || base.currentCharacterState === undefined ||
      base.seamstressRoleTenureState === undefined) throw new Error("Expected canonical Cerenovus replay fixture");
  const source = task.source;
  const tenure = base.seamstressRoleTenureState.records.find((entry) =>
    entry.playerId === source.playerId && entry.seatNumber === source.seatNumber && entry.roleId === "cerenovus"
  );
  if (tenure === undefined) throw new Error("Expected canonical Cerenovus tenure");
  const opportunity: CerenovusActionOpportunity = {
    nightNumber: 1, taskId: task.taskId, taskType: "CERENOVUS_ACTION",
    opportunityId: actionOpportunityId(`${task.taskId}:opportunity-01`),
    opportunityKind: "CERENOVUS_FIRST_NIGHT_ACTION", opportunityStatus: "OPEN",
    sourcePlayerId: source.playerId, sourceSeatNumber: source.seatNumber, sourceRole: source.role,
    sourceCharacterStateRevision: base.currentCharacterState.revision, sourceRoleTenureId: tenure.roleTenureId,
    sourceAbilityInstanceId: formatCerenovusAbilityInstanceId({ roleTenureId: tenure.roleTenureId }),
    abilitySource: { kind: "ROLE_TENURE", abilityRoleId: "cerenovus", roleTenureId: tenure.roleTenureId, acquiredCharacterStateRevision: tenure.acquiredCharacterStateRevision },
    visibility: { canChooseTarget: true, canChooseCharacter: true, supportedDecisionKinds: ["CHOOSE_PLAYER_AND_CHARACTER"], targetSchema: "ANY_MODELED_ROSTER_PLAYER", characterSchema: "ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER" }
  };
  const cerenovusIndex = plan.tasks.findIndex((entry) => entry.taskId === task.taskId);
  const priorSettlements = plan.tasks.slice(0, cerenovusIndex).map((entry) => ({
    nightNumber: 1 as const, taskId: entry.taskId, taskType: entry.taskType,
    settlementVersion: "scheduled-task-settlement-v1" as const,
    outcomeType: "PHILOSOPHER_DEFERRED" as const, characterStateRevision: base.currentCharacterState!.revision
  }));
  return {
    state: { ...base, gameVersion: 10, lastEventSequence: 20,
      firstNightTaskProgress: { settlements: priorSettlements }, firstNightActionOpportunities: { opportunities: [opportunity] } },
    opportunity
  };
};

const batch = (): readonly [
  DomainEventEnvelope<"CerenovusChoiceRecorded">,
  DomainEventEnvelope<"CerenovusMadnessMarked">,
  DomainEventEnvelope<"CerenovusMadnessInstructionDelivered">,
  DomainEventEnvelope<"ScheduledTaskSettled">
] => {
  const { state, opportunity } = fixture();
  if (state.roster === undefined || state.setup === undefined || state.currentCharacterState === undefined) throw new Error("Expected source facts");
  const target = state.roster.entries.find((entry) => entry.playerId !== opportunity.sourcePlayerId);
  const selectedRole = state.setup.roleCatalogSnapshot.roles.find((entry) => entry.characterType === "TOWNSFOLK");
  if (target === undefined || selectedRole === undefined) throw new Error("Expected target and legal role");
  const choice = createCerenovusChoiceRecordedPayload({ rulesBaselineVersion: RULES_BASELINE_VERSION, opportunity,
    settlementCharacterStateRevision: state.currentCharacterState.revision, targetPlayerId: target.playerId,
    chosenRoleId: selectedRole.roleId, roster: state.roster.entries, setup: state.setup });
  const marker = createCerenovusMadnessMarkedPayload(choice);
  const instruction = createCerenovusMadnessInstructionDeliveredPayload(choice, marker);
  const settlement = { rulesBaselineVersion: RULES_BASELINE_VERSION, ...createCerenovusScheduledTaskSettlement(choice) };
  const common = { category: "domain" as const, gameId: state.gameId, batchId: batchId("cerenovus-batch"), gameVersion: 11,
    eventVersion: SUPPORTED_DOMAIN_EVENT_VERSION as 1, rulesBaselineVersion: RULES_BASELINE_VERSION, commandId: commandId("cerenovus-command"),
    createdAt: "2026-07-11T00:00:00.000Z", correlationId: gameCreatedEvent().correlationId, causationId: gameCreatedEvent().causationId };
  return [
    { ...common, eventId: eventId("cerenovus-choice"), eventSequence: 21, eventType: "CerenovusChoiceRecorded", payload: choice },
    { ...common, eventId: eventId("cerenovus-marker"), eventSequence: 22, eventType: "CerenovusMadnessMarked", payload: marker },
    { ...common, eventId: eventId("cerenovus-instruction"), eventSequence: 23, eventType: "CerenovusMadnessInstructionDelivered", payload: instruction },
    { ...common, eventId: eventId("cerenovus-settlement"), eventSequence: 24, eventType: "ScheduledTaskSettled", payload: settlement }
  ];
};

const invalid = (events: readonly AnyDomainEventEnvelope[], current = fixture().state): void => {
  expect(() => applyDomainEventBatch(current, events)).toThrowError(DomainError);
};

const permutations = <T>(values: readonly T[]): readonly (readonly T[])[] =>
  values.length === 0
    ? [[]]
    : values.flatMap((value, index) => permutations(values.filter((_, candidateIndex) => candidateIndex !== index))
      .map((suffix) => [value, ...suffix]));

const resequence = (events: readonly AnyDomainEventEnvelope[]): readonly AnyDomainEventEnvelope[] =>
  events.map((event, index) => ({ ...event, eventSequence: 21 + index }));

describe("Cerenovus effective replay", () => {
  it("exact effective replay", () => {
    const replayed = applyDomainEventBatch(fixture().state, batch());
    expect(replayed.cerenovusChoices?.choices).toHaveLength(1);
    expect(replayed.cerenovusMadnessMarkers?.markers).toHaveLength(1);
    expect(replayed.cerenovusMadnessInstructions?.deliveries).toHaveLength(1);
    expect(replayed.firstNightActionOpportunities?.opportunities.find((entry) => entry.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION")?.opportunityStatus).toBe("CLOSED");
  });

  it("rejects each naked Cerenovus event", () => {
    for (const event of batch()) invalid([event]);
  });

  it("rejects all 23 noncanonical Cerenovus event permutations", () => {
    const events = batch();
    const candidates = permutations(events);
    expect(candidates).toHaveLength(24);
    let accepted = 0;
    for (const candidate of candidates) {
      const ordered = resequence(candidate);
      if (candidate.every((event, index) => event.eventType === events[index]?.eventType)) {
        expect(() => applyDomainEventBatch(fixture().state, ordered)).not.toThrow();
        accepted += 1;
      } else {
        invalid(ordered);
      }
    }
    expect(accepted).toBe(1);
  });

  it("rejects independent Cerenovus batch command version and all four sequence metadata mutations", () => {
    const events = batch();
    invalid([events[0], { ...events[1], batchId: batchId("other") }, events[2], events[3]]);
    invalid([events[0], { ...events[1], commandId: commandId("other") }, events[2], events[3]]);
    invalid([events[0], { ...events[1], gameVersion: 12 }, events[2], events[3]]);
    for (const index of [0, 1, 2, 3] as const) {
      invalid(events.map((event, eventIndex) => eventIndex === index ? { ...event, eventSequence: 30 + index } : event));
    }
  });

  it("rejects a metadata-aligned real PhaseTransitioned lifecycle event mixed into a Cerenovus batch", () => {
    const events = batch();
    const lifecycle = phaseTransitionedEvent({
      gameId: events[0].gameId, batchId: events[0].batchId, gameVersion: events[0].gameVersion,
      commandId: events[0].commandId, correlationId: events[0].correlationId, causationId: events[0].causationId,
      rulesBaselineVersion: events[0].rulesBaselineVersion, eventSequence: 25, eventId: eventId("forbidden-phase-transition")
    });
    invalid([...events, lifecycle]);
  });

  it("rejects a duplicate Cerenovus settlement independently", () => {
    const events = batch();
    invalid([...events, { ...events[3], eventId: eventId("duplicate-settlement"), eventSequence: 25 }]);
  });

  it("rejects every Cerenovus choice provenance field independently and in combination", () => {
    const events = batch();
    const choice = events[0];
    const otherTenure = formatRoleTenureId({ seatNumber: seatNumber(2), roleId: "cerenovus", acquiredCharacterStateRevision: 1 });
    const payloads = [
      { ...choice.payload, rulesBaselineVersion: "wrong" },
      { ...choice.payload, nightNumber: 2 as never },
      { ...choice.payload, taskId: scheduledTaskId("first-night-v1:CERENOVUS_ACTION:seat-02") },
      { ...choice.payload, taskType: "WITCH_ACTION" as never },
      { ...choice.payload, opportunityId: actionOpportunityId("first-night-v1:CERENOVUS_ACTION:seat-02:opportunity-01") },
      { ...choice.payload, sourcePlayerId: playerId("forged") },
      { ...choice.payload, sourceSeatNumber: events[2].payload.recipientSeatNumber },
      { ...choice.payload, sourceRole: { ...choice.payload.sourceRole, roleId: roleId("witch") } },
      { ...choice.payload, sourceRoleTenureId: otherTenure },
      { ...choice.payload, sourceAbilityInstanceId: "wrong-instance" as never },
      { ...choice.payload, abilitySource: { ...choice.payload.abilitySource, kind: "PHILOSOPHER_GRANT" as never } },
      { ...choice.payload, abilitySource: { ...choice.payload.abilitySource, abilityRoleId: "witch" as never } },
      { ...choice.payload, abilitySource: { ...choice.payload.abilitySource, roleTenureId: otherTenure } },
      { ...choice.payload, abilitySource: { ...choice.payload.abilitySource, acquiredCharacterStateRevision: 2 } },
      { ...choice.payload, opportunityCharacterStateRevision: 2 },
      { ...choice.payload, settlementCharacterStateRevision: 2 },
      { ...choice.payload, sourcePlayerId: playerId("forged"), sourceSeatNumber: events[2].payload.recipientSeatNumber }
    ];
    expect(payloads).toHaveLength(17);
    for (const payload of payloads) invalid([{ ...choice, payload }, events[1], events[2], events[3]]);
  });

  it("settles Cerenovus only after one exact complete effective chain", () => {
    const events = batch();
    invalid(events.slice(0, 3));
    invalid([events[0], events[1], events[3]]);
    invalid([events[0], events[2], events[3]]);
  });

  it("rejects each stored Cerenovus opportunity source binding embedded seat duplicate status and revision mutation", () => {
    const valid = fixture();
    const mismatchedId = actionOpportunityId("first-night-v1:CERENOVUS_ACTION:seat-02:opportunity-01");
    const mutations: readonly CerenovusActionOpportunity[] = [
      { ...valid.opportunity, sourcePlayerId: playerId("wrong-opportunity-source") },
      { ...valid.opportunity, sourceSeatNumber: seatNumber(2) },
      { ...valid.opportunity, sourceRole: { ...valid.opportunity.sourceRole, roleId: roleId("witch") } },
      { ...valid.opportunity, opportunityId: mismatchedId }
    ];
    for (const opportunity of mutations) {
      invalid(batch(), { ...valid.state, firstNightActionOpportunities: { opportunities: [opportunity] } });
    }
    invalid(batch(), { ...valid.state, firstNightActionOpportunities: { opportunities: [{ ...valid.opportunity, opportunityStatus: "CLOSED" }] } });
    invalid(batch(), { ...valid.state, firstNightActionOpportunities: { opportunities: [valid.opportunity, valid.opportunity] } });
    invalid(batch(), { ...valid.state, currentCharacterState: { ...valid.state.currentCharacterState!, revision: 2 } });
  });

  it("uses constructed impairment only as test state and never appends AbilityImpairmentApplied history", () => {
    expect(batch().map((event) => event.eventType)).not.toContain("AbilityImpairmentApplied");
  });

  it("rejects actual-source impairment replay even when payload forges an unaffected source", () => {
    const valid = fixture();
    const events = batch();
    const impaired: GameState = { ...valid.state, abilityImpairments: { impairments: [{
      impairmentId: "constructed-poison" as never, kind: "POISONED", sourceKind: "SNAKE_CHARMER_DEMON_HIT",
      sourcePlayerId: playerId("constructed-source"), affectedPlayerId: valid.opportunity.sourcePlayerId,
      affectedSeatNumber: valid.opportunity.sourceSeatNumber, affectedRole: valid.opportunity.sourceRole, sourceCharacterStateRevision: 1
    }] } };
    invalid(events, impaired);
    invalid([{ ...events[0], payload: { ...events[0].payload, sourcePlayerId: playerId("unaffected") } }, events[1], events[2], events[3]], impaired);
  });
});
