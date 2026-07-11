import { describe, expect, it } from "vitest";
import {
  RULES_BASELINE_VERSION,
  actionOpportunityId,
  createCerenovusChoiceRecordedPayload,
  createCerenovusMadnessInstructionDeliveredPayload,
  createCerenovusMadnessMarkedPayload,
  createCerenovusScheduledTaskSettlement,
  formatCerenovusAbilityInstanceId,
  playerId,
  rebuildGameState,
  roleId
} from "@botc/domain-core";
import type { CerenovusActionOpportunity, GameState } from "@botc/domain-core";
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
import { buildAiPrivateKnowledgeView, buildPlayerPrivateKnowledgeView } from "./index.js";

const completed = (selfTarget = false): { readonly state: GameState; readonly sourcePlayerId: ReturnType<typeof playerId>; readonly targetPlayerId: ReturnType<typeof playerId> } => {
  const base = rebuildGameState([
    gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent(), setupGeneratedEvent(), setupPhaseTransitionedEvent(),
    playerRosterCreatedEvent(), charactersAssignedEvent(), charactersAssignedPhaseTransitionedEvent(),
    firstNightInitializedEvent(), initialPrivateKnowledgeEstablishedEvent(), firstNightTaskPlanCreatedEvent()
  ]);
  const task = base.firstNightTaskPlan?.tasks.find((entry) => entry.taskType === "CERENOVUS_ACTION");
  if (task === undefined || task.source.kind !== "ROLE" || base.seamstressRoleTenureState === undefined ||
      base.currentCharacterState === undefined || base.roster === undefined || base.setup === undefined) throw new Error("Expected Cerenovus projection fixture");
  const source = task.source;
  const tenure = base.seamstressRoleTenureState.records.find((entry) => entry.playerId === source.playerId && entry.roleId === "cerenovus");
  const other = base.roster.entries.find((entry) => entry.playerId !== source.playerId);
  const selectedRole = base.setup.roleCatalogSnapshot.roles.find((entry) => entry.characterType === "TOWNSFOLK");
  if (tenure === undefined || other === undefined || selectedRole === undefined) throw new Error("Expected Cerenovus projection source facts");
  const targetPlayerId = selfTarget ? source.playerId : other.playerId;
  const opportunity: CerenovusActionOpportunity = {
    nightNumber: 1, taskId: task.taskId, taskType: "CERENOVUS_ACTION",
    opportunityId: actionOpportunityId(`${task.taskId}:opportunity-01`), opportunityKind: "CERENOVUS_FIRST_NIGHT_ACTION",
    opportunityStatus: "CLOSED", sourcePlayerId: source.playerId, sourceSeatNumber: source.seatNumber,
    sourceRole: source.role, sourceCharacterStateRevision: base.currentCharacterState.revision,
    sourceRoleTenureId: tenure.roleTenureId, sourceAbilityInstanceId: formatCerenovusAbilityInstanceId({ roleTenureId: tenure.roleTenureId }),
    abilitySource: { kind: "ROLE_TENURE", abilityRoleId: "cerenovus", roleTenureId: tenure.roleTenureId, acquiredCharacterStateRevision: tenure.acquiredCharacterStateRevision },
    visibility: { canChooseTarget: true, canChooseCharacter: true, supportedDecisionKinds: ["CHOOSE_PLAYER_AND_CHARACTER"], targetSchema: "ANY_MODELED_ROSTER_PLAYER", characterSchema: "ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER" }
  };
  const choice = createCerenovusChoiceRecordedPayload({ rulesBaselineVersion: RULES_BASELINE_VERSION, opportunity,
    settlementCharacterStateRevision: base.currentCharacterState.revision, targetPlayerId, chosenRoleId: selectedRole.roleId,
    roster: base.roster.entries, setup: base.setup });
  const marker = createCerenovusMadnessMarkedPayload(choice);
  const instruction = createCerenovusMadnessInstructionDeliveredPayload(choice, marker);
  return {
    sourcePlayerId: source.playerId, targetPlayerId,
    state: { ...base, firstNightActionOpportunities: { opportunities: [opportunity] }, cerenovusChoices: { choices: [choice] },
      cerenovusMadnessMarkers: { markers: [marker] }, cerenovusMadnessInstructions: { deliveries: [instruction] },
      firstNightTaskProgress: { settlements: [createCerenovusScheduledTaskSettlement(choice)] } }
  };
};

describe("Cerenovus private knowledge", () => {
  it("projects the Cerenovus instruction only to the selected target", () => {
    const fixture = completed();
    expect(buildPlayerPrivateKnowledgeView(fixture.state, fixture.targetPlayerId).cerenovusMadnessInstruction).toMatchObject({ selectedByCharacter: "cerenovus" });
  });

  it("projects the Cerenovus instruction to the source only when self-targeted", () => {
    const fixture = completed(true);
    expect(buildPlayerPrivateKnowledgeView(fixture.state, fixture.sourcePlayerId).cerenovusMadnessInstruction).toBeDefined();
  });

  it("hides the Cerenovus instruction from a non-target source", () => {
    const fixture = completed();
    expect(buildPlayerPrivateKnowledgeView(fixture.state, fixture.sourcePlayerId).cerenovusMadnessInstruction).toBeUndefined();
  });

  it("hides the Cerenovus instruction from every other player", () => {
    const fixture = completed();
    for (const viewer of fixture.state.roster?.entries ?? []) {
      if (viewer.playerId !== fixture.targetPlayerId) expect(buildPlayerPrivateKnowledgeView(fixture.state, viewer.playerId).cerenovusMadnessInstruction).toBeUndefined();
    }
  });

  it("keeps Cerenovus player and AI private views identical", () => {
    const fixture = completed();
    expect(buildAiPrivateKnowledgeView(fixture.state, fixture.targetPlayerId)).toStrictEqual(buildPlayerPrivateKnowledgeView(fixture.state, fixture.targetPlayerId));
  });

  it("hides every Cerenovus source canonical internal impairment execution Vortox and alignment field", () => {
    const fixture = completed();
    const serialized = JSON.stringify(buildPlayerPrivateKnowledgeView(fixture.state, fixture.targetPlayerId).cerenovusMadnessInstruction);
    expect(serialized).not.toMatch(/sourcePlayer|sourceSeat|tenure|abilityInstance|impair|effective|execution|vortox|alignment/i);
  });

  it("couples Cerenovus stage value and model version in canonical order", () => {
    const fixture = completed();
    const view = buildPlayerPrivateKnowledgeView(fixture.state, fixture.targetPlayerId);
    expect(view.cerenovusKnowledgeModelVersion).toBe("cerenovus-madness-instruction-v1");
    expect(view.deliveredKnowledgeStages).toContain("CERENOVUS_INFORMATION");
  });

  it("validates one complete Cerenovus choice marker instruction settlement opportunity task and tenure chain", () => {
    const fixture = completed();
    expect(() => buildPlayerPrivateKnowledgeView(fixture.state, fixture.targetPlayerId)).not.toThrow();
  });

  it("rejects every missing Cerenovus choice marker instruction settlement opportunity and task position", () => {
    const fixture = completed();
    const candidates: readonly GameState[] = [
      { ...fixture.state, cerenovusChoices: { choices: [] } },
      { ...fixture.state, cerenovusMadnessMarkers: { markers: [] } },
      { ...fixture.state, cerenovusMadnessInstructions: { deliveries: [] } },
      { ...fixture.state, firstNightTaskProgress: { settlements: [] } },
      { ...fixture.state, firstNightActionOpportunities: { opportunities: [] } },
      { ...fixture.state, firstNightTaskPlan: { ...fixture.state.firstNightTaskPlan!, tasks: fixture.state.firstNightTaskPlan!.tasks.filter((entry) => entry.taskType !== "CERENOVUS_ACTION") } }
    ];
    for (const state of candidates) expect(() => buildPlayerPrivateKnowledgeView(state, fixture.targetPlayerId)).toThrow();
  });

  it("rejects duplicate Cerenovus choice marker instruction settlement opportunity and task links", () => {
    const fixture = completed();
    const choice = fixture.state.cerenovusChoices!.choices[0]!;
    const marker = fixture.state.cerenovusMadnessMarkers!.markers[0]!;
    const instruction = fixture.state.cerenovusMadnessInstructions!.deliveries[0]!;
    const opportunity = fixture.state.firstNightActionOpportunities!.opportunities[0]!;
    for (const state of [
      { ...fixture.state, cerenovusChoices: { choices: [choice, choice] } },
      { ...fixture.state, cerenovusMadnessMarkers: { markers: [marker, marker] } },
      { ...fixture.state, cerenovusMadnessInstructions: { deliveries: [instruction, instruction] } },
      { ...fixture.state, firstNightActionOpportunities: { opportunities: [opportunity, opportunity] } }
    ]) expect(() => buildPlayerPrivateKnowledgeView(state, fixture.targetPlayerId)).toThrow();
  });

  it("rejects sparse Cerenovus choice marker and instruction collections", () => {
    const fixture = completed();
    const sparse = new Array(1);
    expect(() => buildPlayerPrivateKnowledgeView({ ...fixture.state, cerenovusChoices: { choices: sparse as never } }, fixture.targetPlayerId)).toThrow();
    expect(() => buildPlayerPrivateKnowledgeView({ ...fixture.state, cerenovusMadnessMarkers: { markers: sparse as never } }, fixture.targetPlayerId)).toThrow();
    expect(() => buildPlayerPrivateKnowledgeView({ ...fixture.state, cerenovusMadnessInstructions: { deliveries: sparse as never } }, fixture.targetPlayerId)).toThrow();
  });

  it("does not recompute historical Cerenovus instruction from later character impairment Vortox or alignment state", () => {
    const fixture = completed();
    const targetEntry = fixture.state.currentCharacterState!.entries.find((entry) => entry.playerId === fixture.targetPlayerId)!;
    const later: GameState = { ...fixture.state, currentCharacterState: { revision: 2, entries: fixture.state.currentCharacterState!.entries.map((entry) =>
      entry.playerId === fixture.targetPlayerId ? { ...targetEntry, role: { ...targetEntry.role, roleId: roleId("vortox") }, currentAlignment: "EVIL" } : entry) } };
    expect(buildPlayerPrivateKnowledgeView(later, fixture.targetPlayerId).cerenovusMadnessInstruction)
      .toStrictEqual(buildPlayerPrivateKnowledgeView(fixture.state, fixture.targetPlayerId).cerenovusMadnessInstruction);
  });

  it("rejects independently and jointly cross-linked Cerenovus source target catalog tenure ability marker and delivery facts", () => {
    const fixture = completed();
    const instruction = fixture.state.cerenovusMadnessInstructions!.deliveries[0]!;
    expect(() => buildPlayerPrivateKnowledgeView({ ...fixture.state,
      cerenovusMadnessInstructions: { deliveries: [{ ...instruction, recipientPlayerId: playerId("cross-linked") }] }
    }, fixture.targetPlayerId)).toThrow();
    expect(() => buildPlayerPrivateKnowledgeView({ ...fixture.state,
      seamstressRoleTenureState: { records: [], processedTransitionFactIds: [] },
      cerenovusMadnessInstructions: { deliveries: [{ ...instruction, madAboutRoleId: roleId("mutant") }] }
    }, fixture.targetPlayerId)).toThrow();
  });
});
