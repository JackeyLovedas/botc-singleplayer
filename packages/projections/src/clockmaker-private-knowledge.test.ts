import { describe, expect, it } from "vitest";
import {
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  RULES_BASELINE_VERSION,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  abilityImpairmentId,
  actionOpportunityId,
  createClockmakerInformationDeliveredPayload,
  createClockmakerInformationDeliveredScheduledTaskSettlement,
  formatPhilosopherGainedFirstNightTaskId,
  formatPhilosopherGrantId,
  formatPhilosopherImpairmentId,
  playerId,
  rebuildGameState,
  resolveClockmakerNativeReferences,
  resolveClockmakerVortoxConstraint,
  roleId,
  seatNumber
} from "@botc/domain-core";
import type {
  AnyDomainEventEnvelope,
  CharactersAssignedPayload,
  ClockmakerInformationDeliveredPayload,
  FirstNightInitializedPayload,
  FirstNightTaskPlanCreatedPayload,
  GameState,
  InitialPrivateKnowledgeEstablishedPayload,
  SetupGeneratedPayload
} from "@botc/domain-core";
import { buildAiPrivateKnowledgeView, buildPlayerPrivateKnowledgeView } from "@botc/projections";
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
  setupPhaseTransitionedEvent,
  testAssignmentGenerator,
  testFirstNightTaskCatalog,
  testFirstNightTaskPlanner,
  testInitialPrivateKnowledgeBuilder,
  testSetupGenerator
} from "@botc/test-harness";

const roles = ["clockmaker", "dreamer", "snake_charmer", "mathematician", "philosopher", "town_crier", "seamstress", "mutant", "sweetheart", "witch", "cerenovus", "vortox"].map(roleId);
const setupPayload = (): SetupGeneratedPayload => {
  const result = testSetupGenerator.generate({ scriptId: "sects-and-violets", rootSeed: gameCreatedEvent().payload.rootSeed, playerCount: 12, constraints: { exactRoleIds: roles } });
  if (result.status === "failure") throw new Error(result.message);
  return { rulesBaselineVersion: RULES_BASELINE_VERSION, ...result.setup };
};
const assignmentPayload = (): CharactersAssignedPayload => {
  const setup = setupPayload(); const roster = playerRosterCreatedEvent().payload;
  const result = testAssignmentGenerator.generate({ rootSeed: gameCreatedEvent().payload.rootSeed, rosterVersion: roster.rosterVersion, roster: roster.entries, actualRoles: setup.actualRoles, roleCatalogSignature: setup.roleCatalogSignature });
  if (result.status === "failure") throw new Error(result.message);
  return { rulesBaselineVersion: RULES_BASELINE_VERSION, ...result.assignment };
};
const firstNightPayload = (): FirstNightInitializedPayload => ({ rulesBaselineVersion: RULES_BASELINE_VERSION,
  initializationVersion: SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION, nightNumber: 1, rosterVersion: playerRosterCreatedEvent().payload.rosterVersion,
  assignmentAlgorithmVersion: assignmentPayload().assignmentAlgorithmVersion, roleCatalogSignature: setupPayload().roleCatalogSignature });
const knowledgePayload = (): InitialPrivateKnowledgeEstablishedPayload => {
  const result = testInitialPrivateKnowledgeBuilder.generate({ roster: playerRosterCreatedEvent().payload.entries, assignment: assignmentPayload().assignments, setup: setupPayload() });
  if (result.status === "failure") throw new Error(result.message);
  return { rulesBaselineVersion: RULES_BASELINE_VERSION, knowledgeModelVersion: SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
    knowledgeStage: INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE, rosterVersion: playerRosterCreatedEvent().payload.rosterVersion,
    assignmentAlgorithmVersion: assignmentPayload().assignmentAlgorithmVersion, roleCatalogSignature: setupPayload().roleCatalogSignature, entries: result.knowledge.entries };
};
const planPayload = (): FirstNightTaskPlanCreatedPayload => {
  const result = testFirstNightTaskPlanner.generate({ nightNumber: 1, setup: setupPayload(), roster: playerRosterCreatedEvent().payload.entries,
    assignment: assignmentPayload().assignments, firstNight: firstNightPayload(), initialPrivateKnowledge: knowledgePayload(), taskCatalogSnapshot: testFirstNightTaskCatalog });
  if (result.status === "failure") throw new Error(result.message);
  return { rulesBaselineVersion: RULES_BASELINE_VERSION, nightNumber: 1, taskPlanVersion: SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION,
    taskCatalogVersion: result.taskPlan.taskCatalogVersion, taskCatalogSignatureAlgorithm: result.taskPlan.taskCatalogSignatureAlgorithm,
    taskCatalogSignature: result.taskPlan.taskCatalogSignature, taskCatalogSnapshot: result.taskPlan.taskCatalogSnapshot,
    rosterVersion: result.taskPlan.rosterVersion, assignmentAlgorithmVersion: result.taskPlan.assignmentAlgorithmVersion,
    roleCatalogSignature: result.taskPlan.roleCatalogSignature, knowledgeModelVersion: result.taskPlan.knowledgeModelVersion,
    knowledgeStage: result.taskPlan.knowledgeStage, tasks: result.taskPlan.tasks };
};
const stream = (): readonly AnyDomainEventEnvelope[] => [gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent(),
  setupGeneratedEvent({ payload: setupPayload() }), setupPhaseTransitionedEvent(), playerRosterCreatedEvent(),
  charactersAssignedEvent({ payload: assignmentPayload() }), charactersAssignedPhaseTransitionedEvent(),
  firstNightInitializedEvent({ payload: firstNightPayload() }), initialPrivateKnowledgeEstablishedEvent({ payload: knowledgePayload() }),
  firstNightTaskPlanCreatedEvent({ payload: planPayload() })];

const clockmakerState = (): GameState => {
  const state = rebuildGameState(stream());
  const task = state.firstNightTaskPlan?.tasks.find((entry) => entry.taskType === "CLOCKMAKER_INFORMATION");
  if (task === undefined || task.source.kind !== "ROLE" || state.firstNightTaskPlan === undefined || state.currentCharacterState === undefined || state.roster === undefined || state.setup === undefined || state.seamstressRoleTenureState === undefined) throw new Error("Expected Clockmaker fixture");
  const native = resolveClockmakerNativeReferences({ currentCharacterState: state.currentCharacterState, roster: state.roster.entries, setup: state.setup });
  const constraint = resolveClockmakerVortoxConstraint({ currentCharacterState: state.currentCharacterState, setup: state.setup, roleTenures: state.seamstressRoleTenureState });
  if (!native.valid) throw new Error(native.reason); if (!constraint.valid) throw new Error(constraint.reason);
  const delivery = createClockmakerInformationDeliveredPayload({ rulesBaselineVersion: RULES_BASELINE_VERSION,
    sourceContract: { kind: "BASE_CLOCKMAKER", taskId: task.taskId, sourcePlayerId: task.source.playerId, sourceSeatNumber: task.source.seatNumber,
      sourceRole: task.source.role, taskPlanVersion: state.firstNightTaskPlan.taskPlanVersion }, settlementCharacterStateRevision: state.currentCharacterState.revision,
    nativeDemonReferences: [native.demon], nativeMinionReferences: native.minions, sourceEffectiveness: { kind: "EFFECTIVE", representedImpairmentIds: [] }, vortoxConstraint: constraint.constraint });
  const settlement = createClockmakerInformationDeliveredScheduledTaskSettlement(delivery);
  const { rulesBaselineVersion: _rules, ...storedSettlement } = settlement;
  void _rules;
  return { ...state, clockmakerInformation: { deliveries: [delivery] }, firstNightTaskProgress: { settlements: [storedSettlement] } };
};

const deliveryOf = (state: GameState): ClockmakerInformationDeliveredPayload => {
  const delivery = state.clockmakerInformation?.deliveries[0];
  if (delivery === undefined) throw new Error("Expected Clockmaker delivery");
  return delivery;
};
const reverseKeys = <T extends object>(value: T): T => Object.fromEntries(Object.entries(value).reverse()) as T;

const philosopherChain = (state: GameState) => {
  const source = state.currentCharacterState!.entries.find((entry) => entry.role.roleId === "philosopher")!;
  const clockmaker = state.setup!.roleCatalogSnapshot.roles.find((entry) => entry.roleId === "clockmaker")!;
  const task = state.firstNightTaskPlan!.tasks.find((entry) => entry.taskType === "PHILOSOPHER_ACTION")!;
  const opportunityId = actionOpportunityId(`first-night-v1:PHILOSOPHER_ACTION:seat-${String(source.seatNumber).padStart(2, "0")}:opportunity-01`);
  const grantId = formatPhilosopherGrantId({ sourceSeatNumber: source.seatNumber, chosenRoleId: roleId("clockmaker") });
  const choice = { rulesBaselineVersion: RULES_BASELINE_VERSION, nightNumber: 1 as const, taskId: task.taskId, taskType: "PHILOSOPHER_ACTION" as const,
    opportunityId, decisionKind: "CHOOSE_GOOD_CHARACTER" as const, sourcePlayerId: source.playerId, sourceSeatNumber: source.seatNumber,
    sourceRole: source.role, sourceCharacterStateRevision: 1, chosenRole: clockmaker, chosenRoleId: roleId("clockmaker"), roleCatalogSignature: state.setup!.roleCatalogSignature };
  const grant = { grantId, sourcePlayerId: source.playerId, sourceSeatNumber: source.seatNumber, sourceRole: source.role, sourceCharacterStateRevision: 1,
    chosenRole: clockmaker, chosenRoleId: roleId("clockmaker"), chosenRoleCatalogSignature: state.setup!.roleCatalogSignature,
    grantedAtTaskId: task.taskId, grantedAtOpportunityId: opportunityId };
  return { source, clockmaker, task, opportunityId, grantId, choice, grant };
};

const withOnlyClockmakerSettlement = (state: GameState, delivery: ClockmakerInformationDeliveredPayload): GameState => {
  const { rulesBaselineVersion: _rules, ...settlement } = createClockmakerInformationDeliveredScheduledTaskSettlement(delivery); void _rules;
  return { ...state, clockmakerInformation: { deliveries: [delivery] }, firstNightTaskProgress: { settlements: [settlement] } };
};

const gainedClockmakerState = (): GameState => {
  const base = clockmakerState(); const nativeDelivery = deliveryOf(base); const chain = philosopherChain(base);
  const taskId = formatPhilosopherGainedFirstNightTaskId({ taskType: "CLOCKMAKER_INFORMATION", sourceSeatNumber: chain.source.seatNumber, chosenRoleId: roleId("clockmaker") });
  const gainedTask = { taskPlanVersion: base.firstNightTaskPlan!.taskPlanVersion, taskId, taskType: "CLOCKMAKER_INFORMATION" as const,
    taskClass: "ROLE_INFORMATION" as const, orderKey: { baseOrder: 100 as const, insertionOrder: 1 as const },
    source: { kind: "PHILOSOPHER_GAINED_ABILITY" as const, playerId: chain.source.playerId, seatNumber: chain.source.seatNumber,
      sourceRole: chain.source.role, chosenRole: chain.clockmaker, opportunityId: chain.opportunityId, sourceCharacterStateRevision: 1 },
    status: "PENDING" as const, settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT" as const, insertionReason: "PHILOSOPHER_GAINED_ABILITY" as const,
    insertedByPlayerId: chain.source.playerId, insertedByOpportunityId: chain.opportunityId, sourceCharacterStateRevision: 1, chosenRole: chain.clockmaker };
  const delivery = createClockmakerInformationDeliveredPayload({ rulesBaselineVersion: RULES_BASELINE_VERSION,
    sourceContract: { kind: "PHILOSOPHER_GAINED_CLOCKMAKER", taskId, sourcePlayerId: chain.source.playerId, sourceSeatNumber: chain.source.seatNumber,
      sourceRole: chain.source.role, gainedRole: chain.clockmaker, grantId: chain.grantId, grantedAtTaskId: chain.task.taskId,
      grantedAtOpportunityId: chain.opportunityId, insertionCharacterStateRevision: 1 }, settlementCharacterStateRevision: 1,
    nativeDemonReferences: nativeDelivery.nativeDemonReferences, nativeMinionReferences: nativeDelivery.nativeMinionReferences,
    sourceEffectiveness: { kind: "EFFECTIVE", representedImpairmentIds: [] }, vortoxConstraint: nativeDelivery.vortoxConstraint });
  return withOnlyClockmakerSettlement({ ...base, firstNightTaskPlan: { ...base.firstNightTaskPlan!, tasks: [gainedTask, ...base.firstNightTaskPlan!.tasks] },
    philosopherAbilityChoices: { choices: [chain.choice] }, philosopherGrantedAbilities: { abilities: [chain.grant] },
    firstNightTaskInsertions: { insertions: [{ rulesBaselineVersion: RULES_BASELINE_VERSION, nightNumber: 1, ...gainedTask }] } }, delivery);
};

const drunkClockmakerState = (): GameState => {
  const base = clockmakerState(); const original = deliveryOf(base); const chain = philosopherChain(base);
  const impairmentId = formatPhilosopherImpairmentId({ sourceSeatNumber: chain.source.seatNumber,
    affectedSeatNumber: original.sourceContract.sourceSeatNumber, chosenRoleId: roleId("clockmaker") });
  const impairment = { impairmentId, kind: "DRUNK" as const, sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" as const,
    sourcePlayerId: chain.source.playerId, affectedPlayerId: original.sourceContract.sourcePlayerId,
    affectedSeatNumber: original.sourceContract.sourceSeatNumber, affectedRole: original.sourceContract.sourceRole,
    chosenRoleId: roleId("clockmaker"), sourceCharacterStateRevision: 1 };
  const delivery = createClockmakerInformationDeliveredPayload({ rulesBaselineVersion: RULES_BASELINE_VERSION,
    sourceContract: original.sourceContract, settlementCharacterStateRevision: 1, nativeDemonReferences: original.nativeDemonReferences,
    nativeMinionReferences: original.nativeMinionReferences, sourceEffectiveness: { kind: "KNOWN_DRUNK", representedImpairmentIds: [impairmentId], sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" },
    vortoxConstraint: original.vortoxConstraint });
  return withOnlyClockmakerSettlement({ ...base, philosopherAbilityChoices: { choices: [chain.choice] },
    philosopherGrantedAbilities: { abilities: [chain.grant] }, abilityImpairments: { impairments: [impairment] } }, delivery);
};

describe("Clockmaker private knowledge projection", () => {
  it("shows only distance model and stage to the source in identical player and AI views", () => {
    const state = clockmakerState(); const delivery = deliveryOf(state); const source = delivery.sourceContract.sourcePlayerId;
    const playerView = buildPlayerPrivateKnowledgeView(state, source);
    expect(buildAiPrivateKnowledgeView(state, source)).toStrictEqual(playerView);
    expect(playerView.clockmakerInformation).toStrictEqual({ distance: delivery.selectedDistance });
    expect(playerView.clockmakerKnowledgeModelVersion).toBe("clockmaker-information-v1");
    expect(playerView.deliveredKnowledgeStages).toContain("CLOCKMAKER_INFORMATION");
    expect(JSON.stringify(playerView)).not.toMatch(/nativeDemon|nativeMinion|pairDistance|ruleCorrect|vortox|impairment|taskId|sourceContract/i);
    const other = state.roster?.entries.find((entry) => entry.playerId !== source);
    if (other === undefined) throw new Error("Expected non-source viewer");
    expect(buildPlayerPrivateKnowledgeView(state, other.playerId)).not.toHaveProperty("clockmakerInformation");
  });

  it("validates and projects the exact Philosopher gained task grant insertion chain", () => {
    const state = gainedClockmakerState(); const delivery = deliveryOf(state); const source = delivery.sourceContract.sourcePlayerId;
    expect(buildPlayerPrivateKnowledgeView(state, source).clockmakerInformation).toStrictEqual({ distance: delivery.selectedDistance });
    for (const corrupted of [
      { ...state, philosopherGrantedAbilities: { abilities: [] } },
      { ...state, firstNightTaskInsertions: { insertions: [] } },
      { ...state, philosopherGrantedAbilities: { abilities: [{ ...state.philosopherGrantedAbilities!.abilities[0]!, grantedAtOpportunityId: actionOpportunityId("cross-linked") }] } }
    ]) expect(() => buildPlayerPrivateKnowledgeView(corrupted, source)).toThrow();
  });

  it("validates KNOWN_DRUNK against one exact preserved choice grant and impairment chain", () => {
    const state = drunkClockmakerState(); const delivery = deliveryOf(state); const source = delivery.sourceContract.sourcePlayerId;
    expect(buildPlayerPrivateKnowledgeView(state, source).clockmakerInformation).toStrictEqual({ distance: delivery.selectedDistance });
    for (const corrupted of [
      { ...state, philosopherAbilityChoices: { choices: [] } },
      { ...state, philosopherGrantedAbilities: { abilities: [] } },
      { ...state, abilityImpairments: { impairments: [] } },
      { ...state, abilityImpairments: { impairments: [{ ...state.abilityImpairments!.impairments[0]!, affectedPlayerId: playerId("cross-linked") }] } }
    ]) expect(() => buildPlayerPrivateKnowledgeView(corrupted, source)).toThrow();
  });

  it("fails closed for orphan duplicate sparse extra version and cross-linked stored chains", () => {
    const state = clockmakerState(); const delivery = deliveryOf(state); const settlement = state.firstNightTaskProgress!.settlements[0]!;
    const { clockmakerInformation: _removed, ...withoutDelivery } = state; void _removed;
    const sparse: ClockmakerInformationDeliveredPayload[] = []; sparse.length = 1;
    const corruptions: GameState[] = [
      { ...state, firstNightTaskProgress: { settlements: [] } },
      withoutDelivery,
      { ...state, clockmakerInformation: { deliveries: [delivery, delivery] } },
      { ...state, clockmakerInformation: { deliveries: sparse } },
      { ...state, clockmakerInformation: { deliveries: [delivery], hidden: true } } as unknown as GameState,
      { ...state, clockmakerInformation: { deliveries: [{ ...delivery, informationModelVersion: "wrong" as typeof delivery.informationModelVersion }] } },
      { ...state, clockmakerInformation: { deliveries: [{ ...delivery, sourceContract: { ...delivery.sourceContract, sourcePlayerId: playerId("cross-linked") } }] } },
      { ...state, firstNightTaskProgress: { settlements: [{ ...settlement, characterStateRevision: settlement.characterStateRevision + 1 }] } }
    ];
    for (const corrupted of corruptions) expect(() => buildPlayerPrivateKnowledgeView(corrupted, delivery.sourceContract.sourcePlayerId)).toThrow();
  });

  it("accepts reordered stored facts but rejects hostile stored delivery collections", () => {
    const state = clockmakerState();
    const delivery = deliveryOf(state);
    const reordered = reverseKeys({ ...delivery, sourceContract: reverseKeys(delivery.sourceContract),
      nativeDemonReferences: [reverseKeys(delivery.nativeDemonReferences[0])],
      nativeMinionReferences: delivery.nativeMinionReferences.map(reverseKeys),
      pairDistanceSnapshots: delivery.pairDistanceSnapshots.map(reverseKeys),
      vortoxConstraint: reverseKeys(delivery.vortoxConstraint) }) as unknown as ClockmakerInformationDeliveredPayload;
    const accepted: GameState = { ...state, clockmakerInformation: { deliveries: [reordered] } };
    expect(buildPlayerPrivateKnowledgeView(accepted, delivery.sourceContract.sourcePlayerId).clockmakerInformation)
      .toStrictEqual({ distance: delivery.selectedDistance });
    const extra = [delivery] as ClockmakerInformationDeliveredPayload[] & { extra?: boolean }; extra.extra = true;
    const proxy = new Proxy([delivery], {});
    for (const deliveries of [extra, proxy]) {
      expect(() => buildPlayerPrivateKnowledgeView({ ...state, clockmakerInformation: { deliveries } },
        delivery.sourceContract.sourcePlayerId)).toThrow();
    }
    const settlementProxy = new Proxy(state.firstNightTaskProgress!.settlements, {});
    for (const settlements of [settlementProxy]) {
      expect(() => buildPlayerPrivateKnowledgeView({ ...state, firstNightTaskProgress: { settlements } },
        delivery.sourceContract.sourcePlayerId)).toThrow();
    }
  });

  it("rejects pair truth candidate policy and all four independent Vortox identity corruptions", () => {
    const state = clockmakerState(); const delivery = deliveryOf(state);
    if (delivery.vortoxConstraint.kind !== "VORTOX_FALSE_REQUIRED") throw new Error("Expected Vortox delivery");
    const other = state.roster!.entries.find((entry) => entry.playerId !== delivery.nativeDemonReferences[0].playerId)!;
    const semanticPayloads: ClockmakerInformationDeliveredPayload[] = [
      { ...delivery, pairDistanceSnapshots: [delivery.pairDistanceSnapshots[1], delivery.pairDistanceSnapshots[0]] },
      { ...delivery, ruleCorrectDistance: delivery.ruleCorrectDistance === 1 ? 2 : 1 },
      { ...delivery, selectedDistance: delivery.ruleCorrectDistance },
      { ...delivery, simulationReason: "RULE_CORRECT_REQUIRED" }
    ];
    for (const payload of semanticPayloads) expect(() => buildPlayerPrivateKnowledgeView({ ...state, clockmakerInformation: { deliveries: [payload] } }, delivery.sourceContract.sourcePlayerId)).toThrow();
    const fangGu = state.setup!.roleCatalogSnapshot.roles.find((role) => role.roleId === "fang_gu");
    if (fangGu === undefined) throw new Error("Expected catalog Fang Gu");
    const tenure = state.seamstressRoleTenureState!.records.find((entry) => entry.roleId === "vortox");
    if (tenure === undefined) throw new Error("Expected Vortox tenure");
    const corruptions: GameState[] = [
      { ...state, clockmakerInformation: { deliveries: [{ ...delivery, vortoxConstraint: { kind: "NONE" } }] },
        seamstressRoleTenureState: { ...state.seamstressRoleTenureState!, records: state.seamstressRoleTenureState!.records.filter((entry) => entry.roleId !== "vortox") } },
      { ...state, clockmakerInformation: { deliveries: [{ ...delivery, vortoxConstraint: { ...delivery.vortoxConstraint, vortoxPlayerId: other.playerId } }] } },
      { ...state, clockmakerInformation: { deliveries: [{ ...delivery, nativeDemonReferences: [{ ...delivery.nativeDemonReferences[0], role: fangGu }] }] } },
      { ...state, seamstressRoleTenureState: { ...state.seamstressRoleTenureState!, records: state.seamstressRoleTenureState!.records.map((entry) =>
        entry.roleTenureId === tenure.roleTenureId ? { ...entry, playerId: other.playerId } : entry) } }
    ];
    for (const corrupted of corruptions) expect(() => buildPlayerPrivateKnowledgeView(corrupted, delivery.sourceContract.sourcePlayerId)).toThrow();
  });

  it("rejects native Vortox with missing tenure when its constraint is downgraded to NONE", () => {
    const state = clockmakerState(); const delivery = deliveryOf(state);
    const corrupted = { ...state, clockmakerInformation: { deliveries: [{ ...delivery, vortoxConstraint: { kind: "NONE" as const } }] },
      seamstressRoleTenureState: { ...state.seamstressRoleTenureState!, records: state.seamstressRoleTenureState!.records.filter((entry) => entry.roleId !== "vortox") } };
    expect(() => buildPlayerPrivateKnowledgeView(corrupted, delivery.sourceContract.sourcePlayerId)).toThrow();
  });

  it("rejects native Vortox whose constraint is cross-linked to another player or seat", () => {
    const state = clockmakerState(); const delivery = deliveryOf(state);
    if (delivery.vortoxConstraint.kind !== "VORTOX_FALSE_REQUIRED") throw new Error("Expected Vortox delivery");
    const other = state.roster!.entries.find((entry) => entry.playerId !== delivery.nativeDemonReferences[0].playerId)!;
    const wrongPlayer = { ...delivery, vortoxConstraint: { ...delivery.vortoxConstraint, vortoxPlayerId: other.playerId } };
    const wrongSeat = { ...delivery, vortoxConstraint: { ...delivery.vortoxConstraint, vortoxSeatNumber: other.seatNumber } };
    expect(() => buildPlayerPrivateKnowledgeView({ ...state, clockmakerInformation: { deliveries: [wrongPlayer] } }, delivery.sourceContract.sourcePlayerId)).toThrow();
    expect(() => buildPlayerPrivateKnowledgeView({ ...state, clockmakerInformation: { deliveries: [wrongSeat] } }, delivery.sourceContract.sourcePlayerId)).toThrow();
  });

  it("rejects forged VORTOX_FALSE_REQUIRED when the stored native Demon is not Vortox", () => {
    const state = clockmakerState(); const delivery = deliveryOf(state);
    const fangGu = state.setup!.roleCatalogSnapshot.roles.find((entry) => entry.roleId === "fang_gu");
    if (fangGu === undefined) throw new Error("Expected Fang Gu");
    const corrupted: ClockmakerInformationDeliveredPayload = { ...delivery, nativeDemonReferences: [{ ...delivery.nativeDemonReferences[0], role: fangGu }] };
    expect(() => buildPlayerPrivateKnowledgeView({ ...state, clockmakerInformation: { deliveries: [corrupted] } }, delivery.sourceContract.sourcePlayerId)).toThrow();
  });

  it("rejects valid-looking Vortox tenure and constraint whose player seat or role differs from the stored native Demon", () => {
    const state = clockmakerState(); const delivery = deliveryOf(state);
    const tenure = state.seamstressRoleTenureState!.records.find((entry) => entry.roleId === "vortox");
    const other = state.roster!.entries.find((entry) => entry.playerId !== delivery.nativeDemonReferences[0].playerId);
    if (tenure === undefined || other === undefined) throw new Error("Expected Vortox tenure and other player");
    const corrupted = { ...state, seamstressRoleTenureState: { ...state.seamstressRoleTenureState!, records: state.seamstressRoleTenureState!.records.map((entry) =>
      entry.roleTenureId === tenure.roleTenureId ? { ...entry, playerId: other.playerId, seatNumber: other.seatNumber } : entry) } };
    expect(() => buildPlayerPrivateKnowledgeView(corrupted, delivery.sourceContract.sourcePlayerId)).toThrow();
  });

  it("does not recompute delivered information from later role alignment or unrelated post-settlement impairment", () => {
    const state = clockmakerState(); const delivery = deliveryOf(state); const later = state.currentCharacterState!;
    const dreamer = state.setup!.roleCatalogSnapshot.roles.find((role) => role.roleId === "dreamer")!;
    const changed = { ...state, currentCharacterState: { revision: later.revision + 1, entries: later.entries.map((entry) => entry.playerId === delivery.sourceContract.sourcePlayerId
      ? { ...entry, role: dreamer, currentAlignment: entry.currentAlignment === "GOOD" ? "EVIL" as const : "GOOD" as const }
      : entry) }, abilityImpairments: { impairments: [{ impairmentId: abilityImpairmentId("later-unrelated"), kind: "POISONED", sourceKind: "SNAKE_CHARMER_DEMON_HIT",
        sourcePlayerId: playerId("later-source"), affectedPlayerId: playerId("later-target"), affectedSeatNumber: seatNumber(12),
        affectedRole: state.setup!.roleCatalogSnapshot.roles.find((role) => role.roleId === "dreamer")!, sourceCharacterStateRevision: later.revision + 1 }] } } satisfies GameState;
    expect(buildPlayerPrivateKnowledgeView(changed, delivery.sourceContract.sourcePlayerId).clockmakerInformation).toStrictEqual({ distance: delivery.selectedDistance });
  });
});
