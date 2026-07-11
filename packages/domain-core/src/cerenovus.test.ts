import { describe, expect, it } from "vitest";
import {
  RULES_BASELINE_VERSION,
  abilityImpairmentId,
  actionOpportunityId,
  createCerenovusChoiceRecordedPayload,
  createCerenovusMadnessInstructionDeliveredPayload,
  createCerenovusMadnessMarkedPayload,
  createCerenovusScheduledTaskSettlement,
  evaluateCerenovusEffectiveOnlyCapability,
  formatCerenovusAbilityInstanceId,
  formatCerenovusChoiceId,
  formatCerenovusInstructionDeliveryId,
  formatCerenovusMarkerId,
  formatRoleTenureId,
  hasCerenovusChainForSettlement,
  parseCerenovusAbilityInstanceId,
  playerId,
  roleId,
  seatNumber,
  scheduledTaskId,
  validateCerenovusActionDecision,
  validateCerenovusActionOpportunityShape,
  validateCerenovusChoiceAgainstState,
  validateCerenovusChoiceRecordedPayloadShape,
  validateCerenovusInstructionAgainstChain,
  validateCerenovusMadnessInstructionDeliveredPayloadShape,
  validateCerenovusMadnessMarkedPayloadShape,
  validateCerenovusMarkerAgainstChoice
} from "./index.js";
import type { AbilityImpairmentSet, CerenovusActionOpportunity, CerenovusChoiceRecordedPayload, GeneratedSetup, PlayerRoster, RoleSetupSnapshot, RoleTenureState } from "./index.js";

const role = (id: string, characterType: RoleSetupSnapshot["characterType"], defaultAlignment: RoleSetupSnapshot["defaultAlignment"]): RoleSetupSnapshot => ({
  roleId: roleId(id), characterType, defaultAlignment, edition: "sects-and-violets",
  setupModifier: { outsiderDelta: 0, townsfolkDelta: 0 }
});
const cerenovus = role("cerenovus", "MINION", "EVIL");
const dreamer = role("dreamer", "TOWNSFOLK", "GOOD");
const mutant = role("mutant", "OUTSIDER", "GOOD");
const fangGu = role("fang_gu", "DEMON", "EVIL");
const sourcePlayerId = playerId("player-source");
const targetPlayerId = playerId("player-target");
const tenureId = formatRoleTenureId({ seatNumber: seatNumber(1), roleId: "cerenovus", acquiredCharacterStateRevision: 1 });
const opportunity: CerenovusActionOpportunity = {
  nightNumber: 1, taskId: scheduledTaskId("first-night-v1:CERENOVUS_ACTION:seat-01"), taskType: "CERENOVUS_ACTION",
  opportunityId: actionOpportunityId("first-night-v1:CERENOVUS_ACTION:seat-01:opportunity-01"),
  opportunityKind: "CERENOVUS_FIRST_NIGHT_ACTION", opportunityStatus: "OPEN", sourcePlayerId, sourceSeatNumber: seatNumber(1),
  sourceRole: cerenovus, sourceCharacterStateRevision: 1, sourceRoleTenureId: tenureId,
  sourceAbilityInstanceId: formatCerenovusAbilityInstanceId({ roleTenureId: tenureId }),
  abilitySource: { kind: "ROLE_TENURE", abilityRoleId: "cerenovus", roleTenureId: tenureId, acquiredCharacterStateRevision: 1 },
  visibility: { canChooseTarget: true, canChooseCharacter: true, supportedDecisionKinds: ["CHOOSE_PLAYER_AND_CHARACTER"], targetSchema: "ANY_MODELED_ROSTER_PLAYER", characterSchema: "ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER" }
};
const roster: PlayerRoster = [
  { playerId: sourcePlayerId, seatNumber: seatNumber(1), displayName: "Source", playerKind: "AI" },
  { playerId: targetPlayerId, seatNumber: seatNumber(2), displayName: "Target", playerKind: "HUMAN" }
];
const setup: GeneratedSetup = {
  setupAlgorithmVersion: "test-setup-v1", randomAlgorithmVersion: "test-random-v1", randomStream: "test",
  roleCatalogVersion: "test-catalog-v1", roleCatalogSignature: "catalog-signature", scriptId: "sects-and-violets",
  roleCatalogSignatureAlgorithm: "test-signature-v1", constraintsSnapshot: { lockedRoleIds: [], excludedRoleIds: [], exactRoleIds: [] },
  preModifierCounts: { TOWNSFOLK: 1, OUTSIDER: 0, MINION: 0, DEMON: 1 }, postModifierCounts: { TOWNSFOLK: 1, OUTSIDER: 0, MINION: 0, DEMON: 1 },
  actualRoles: [cerenovus, dreamer], demonBluffs: [], demonRole: fangGu, setupModifiersApplied: [],
  validationSummary: { actualRoleCount: 2, demonBluffCount: 0, roleIdsUnique: true, demonRoleCount: 1, minionRoleCount: 1, actualRolesMatchPostModifierCounts: true },
  roleCatalogSnapshot: { scriptId: "sects-and-violets", edition: "sects-and-violets", roleCatalogVersion: "test-catalog-v1", roles: [cerenovus, dreamer, mutant, fangGu], canonicalSignature: "catalog-signature" }
};
const choice = (chosenRoleId = roleId("dreamer")) => createCerenovusChoiceRecordedPayload({
  rulesBaselineVersion: RULES_BASELINE_VERSION, opportunity, settlementCharacterStateRevision: 1,
  targetPlayerId, chosenRoleId, roster, setup
});
const roleTenures: RoleTenureState = {
  records: [{
    roleTenureId: tenureId,
    playerId: sourcePlayerId,
    seatNumber: seatNumber(1),
    roleId: "cerenovus",
    acquiredCharacterStateRevision: 1,
    startedBy: { kind: "CHARACTERS_ASSIGNED", sourceEventId: "event-assigned" as never, sourceEventSequence: 1, characterStateRevision: 1 }
  }],
  processedTransitionFactIds: []
};

const impairment = (kind: "DRUNK" | "POISONED"): AbilityImpairmentSet => ({ impairments: [kind === "DRUNK" ? {
  impairmentId: abilityImpairmentId("constructed-drunk"), kind, sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
  sourcePlayerId: playerId("constructed-source"), affectedPlayerId: sourcePlayerId, affectedSeatNumber: seatNumber(1),
  affectedRole: cerenovus, chosenRoleId: roleId("cerenovus"), sourceCharacterStateRevision: 1
} : {
  impairmentId: abilityImpairmentId("constructed-poisoned"), kind, sourceKind: "SNAKE_CHARMER_DEMON_HIT",
  sourcePlayerId: playerId("constructed-source"), affectedPlayerId: sourcePlayerId, affectedSeatNumber: seatNumber(1),
  affectedRole: cerenovus, sourceCharacterStateRevision: 1
}] });

describe("Cerenovus effective-only first-night facts", () => {
  it("rejects a syntactically canonical Cerenovus opportunity ID with mismatched embedded source seat", () => {
    const mismatched = {
      ...opportunity,
      opportunityId: actionOpportunityId("first-night-v1:CERENOVUS_ACTION:seat-02:opportunity-01")
    };
    expect(validateCerenovusActionOpportunityShape(mismatched)).toMatchObject({ valid: false });
  });

  it("rejects syntactically canonical choice and marker IDs with mismatched embedded source seat", () => {
    const recorded = choice();
    const mismatchedOpportunityId = actionOpportunityId("first-night-v1:CERENOVUS_ACTION:seat-02:opportunity-01");
    const mismatchedChoice = {
      ...recorded,
      opportunityId: mismatchedOpportunityId,
      choiceId: formatCerenovusChoiceId(mismatchedOpportunityId)
    };
    expect(validateCerenovusChoiceRecordedPayloadShape(mismatchedChoice)).toMatchObject({ valid: false });
    expect(validateCerenovusChoiceAgainstState({ choice: mismatchedChoice, opportunity: { ...opportunity, opportunityId: mismatchedOpportunityId }, roster, setup, roleTenures })).toMatchObject({ valid: false });
    const marker = createCerenovusMadnessMarkedPayload(recorded);
    const mismatchedMarker = {
      ...marker,
      opportunityId: mismatchedOpportunityId,
      choiceId: formatCerenovusChoiceId(mismatchedOpportunityId),
      markerId: formatCerenovusMarkerId(mismatchedOpportunityId)
    };
    expect(validateCerenovusMadnessMarkedPayloadShape(mismatchedMarker)).toMatchObject({ valid: false });
  });

  it("rejects a syntactically canonical instruction ID cross-linked to another source-seat chain", () => {
    const recorded = choice();
    const marker = createCerenovusMadnessMarkedPayload(recorded);
    const instruction = createCerenovusMadnessInstructionDeliveredPayload(recorded, marker);
    const otherOpportunityId = actionOpportunityId("first-night-v1:CERENOVUS_ACTION:seat-02:opportunity-01");
    const crossLinked = {
      ...instruction,
      opportunityId: otherOpportunityId,
      choiceId: formatCerenovusChoiceId(otherOpportunityId),
      markerId: formatCerenovusMarkerId(otherOpportunityId),
      deliveryId: formatCerenovusInstructionDeliveryId(otherOpportunityId, instruction.recipientSeatNumber)
    };
    expect(validateCerenovusMadnessInstructionDeliveredPayloadShape(crossLinked)).toEqual({ valid: true });
    expect(validateCerenovusInstructionAgainstChain(recorded, marker, crossLinked)).toMatchObject({ valid: false });
  });

  it("accepts every modeled roster player without consulting life state", () => {
    for (const target of roster) {
      expect(() => createCerenovusChoiceRecordedPayload({ rulesBaselineVersion: RULES_BASELINE_VERSION, opportunity,
        settlementCharacterStateRevision: 1, targetPlayerId: target.playerId, chosenRoleId: roleId("dreamer"), roster, setup })).not.toThrow();
    }
  });

  it("accepts an on-script Townsfolk selected character", () => {
    expect(validateCerenovusChoiceRecordedPayloadShape(choice(roleId("dreamer")))).toEqual({ valid: true });
  });

  it("accepts an on-script Outsider selected character", () => {
    expect(validateCerenovusChoiceRecordedPayloadShape(choice(roleId("mutant")))).toEqual({ valid: true });
  });

  it("accepts a legal selected character absent from assignments", () => {
    expect(setup.actualRoles.some((entry) => entry.roleId === "mutant")).toBe(false);
    expect(validateCerenovusChoiceRecordedPayloadShape(choice(roleId("mutant")))).toEqual({ valid: true });
  });

  it("rejects an ordinary Minion selected character", () => {
    expect(() => choice(roleId("cerenovus"))).toThrow("on-script Townsfolk or Outsider");
  });

  it("rejects an ordinary Demon selected character", () => {
    expect(() => choice(roleId("fang_gu"))).toThrow("on-script Townsfolk or Outsider");
  });

  it("rejects Traveller Fabled off-script and unsupported Goblin selections", () => {
    for (const selected of ["traveller", "fabled", "off_script", "goblin"]) {
      expect(() => choice(roleId(selected))).toThrow("on-script Townsfolk or Outsider");
    }
  });

  it("rejects malformed extra-key and hostile-primitive Cerenovus decisions without throwing", () => {
    const candidates: readonly unknown[] = [undefined, null, false, 0, 1, "", {}, [],
      { kind: "CHOOSE_PLAYER_AND_CHARACTER", targetPlayerId, chosenRoleId: roleId("dreamer"), effective: true }];
    for (const candidate of candidates) {
      expect(() => validateCerenovusActionDecision(candidate)).not.toThrow();
      expect(validateCerenovusActionDecision(candidate).valid).toBe(false);
    }
  });

  it("records the exact effective Cerenovus marker window and removal policy", () => {
    expect(createCerenovusMadnessMarkedPayload(choice())).toMatchObject({ markerStatus: "ESTABLISHED",
      instructionWindow: "TOMORROW_DAY_AND_NIGHT", removalRule: "NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY" });
  });

  it("records the exact target instruction without source or internal fields", () => {
    const recorded = choice();
    const instruction = createCerenovusMadnessInstructionDeliveredPayload(recorded, createCerenovusMadnessMarkedPayload(recorded));
    expect(instruction).toMatchObject({ recipientPlayerId: targetPlayerId, selectedByCharacter: "cerenovus" });
    expect(JSON.stringify(instruction)).not.toMatch(/sourcePlayer|sourceSeat|abilityInstance|impair|execution|vortox/i);
  });

  it("keeps Vortox and alignment-change runtime out of scope and Cerenovus coverage PARTIAL", () => {
    const serialized = JSON.stringify(choice());
    expect(serialized).not.toMatch(/vortox|alignmentChange|alignment-change/i);
  });

  it("accepts only the exact decision surface and deterministic ability identity", () => {
    expect(validateCerenovusActionDecision({ kind: "CHOOSE_PLAYER_AND_CHARACTER", targetPlayerId, chosenRoleId: roleId("dreamer") })).toEqual({ valid: true });
    expect(validateCerenovusActionDecision({ kind: "CHOOSE_PLAYER_AND_CHARACTER", targetPlayerId, chosenRoleId: roleId("dreamer"), effective: true }).valid).toBe(false);
    expect(formatCerenovusAbilityInstanceId({ roleTenureId: tenureId })).toBe("cerenovus-ability-instance-v1:ROLE_TENURE:seat-01:role-cerenovus:acquired-revision-1");
  });

  it("accepts self/other and on-script Townsfolk/Outsider while rejecting unsupported roles", () => {
    expect(validateCerenovusChoiceRecordedPayloadShape(choice())).toEqual({ valid: true });
    expect(validateCerenovusChoiceRecordedPayloadShape(createCerenovusChoiceRecordedPayload({ rulesBaselineVersion: RULES_BASELINE_VERSION, opportunity, settlementCharacterStateRevision: 1, targetPlayerId: sourcePlayerId, chosenRoleId: roleId("mutant"), roster, setup }))).toEqual({ valid: true });
    expect(() => choice(roleId("fang_gu"))).toThrow("on-script Townsfolk or Outsider");
    expect(() => choice(roleId("goblin"))).toThrow("on-script Townsfolk or Outsider");
  });

  it("creates the exact marker and privacy-minimal instruction", () => {
    const recorded = choice();
    const marker = createCerenovusMadnessMarkedPayload(recorded);
    const instruction = createCerenovusMadnessInstructionDeliveredPayload(recorded, marker);
    expect(validateCerenovusMadnessMarkedPayloadShape(marker)).toEqual({ valid: true });
    expect(marker).toMatchObject({ markerStatus: "ESTABLISHED", instructionWindow: "TOMORROW_DAY_AND_NIGHT", removalRule: "NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY", madAboutRoleId: roleId("dreamer") });
    expect(validateCerenovusMadnessInstructionDeliveredPayloadShape(instruction)).toEqual({ valid: true });
    expect(instruction).toMatchObject({ recipientPlayerId: targetPlayerId, selectedByCharacter: "cerenovus", madAboutRoleId: roleId("dreamer"), instructionWindow: "TOMORROW_DAY_AND_NIGHT" });
    expect(instruction).not.toHaveProperty("sourcePlayerId");
    expect(instruction).not.toHaveProperty("sourceSeatNumber");
  });

  it.each(["DRUNK", "POISONED"] as const)("fails closed for constructed noncanonical %s gate input", (kind) => {
    expect(evaluateCerenovusEffectiveOnlyCapability({ sourcePlayerId, abilityImpairments: impairment(kind) })).toEqual({
      supported: false,
      reason: "SOURCE_IMPAIRMENT_UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY",
      eventPolicy: "CREATE_NO_EVENTS", receiptPolicy: "WRITE_NO_RECEIPT", opportunityPolicy: "KEEP_OPEN"
    });
  });

  it("fails closed for constructed noncanonical DRUNK Cerenovus capability input", () => {
    expect(evaluateCerenovusEffectiveOnlyCapability({ sourcePlayerId, abilityImpairments: impairment("DRUNK") })).toMatchObject({
      supported: false, eventPolicy: "CREATE_NO_EVENTS", receiptPolicy: "WRITE_NO_RECEIPT", opportunityPolicy: "KEEP_OPEN"
    });
  });

  it("fails closed for constructed noncanonical POISONED Cerenovus capability input", () => {
    expect(evaluateCerenovusEffectiveOnlyCapability({ sourcePlayerId, abilityImpairments: impairment("POISONED") })).toMatchObject({
      supported: false, eventPolicy: "CREATE_NO_EVENTS", receiptPolicy: "WRITE_NO_RECEIPT", opportunityPolicy: "KEEP_OPEN"
    });
  });

  it("allows healthy represented state without claiming immunity", () => {
    expect(evaluateCerenovusEffectiveOnlyCapability({ sourcePlayerId, abilityImpairments: undefined })).toEqual({ supported: true });
  });

  it.each([
    undefined,
    null,
    {},
    { kind: "DEFER" },
    { kind: "CHOOSE_PLAYER_AND_CHARACTER", targetPlayerId, chosenRoleId: roleId("dreamer"), marker: true },
    { kind: "CHOOSE_PLAYER_AND_CHARACTER", targetPlayerId: "", chosenRoleId: roleId("dreamer") }
  ])("rejects malformed or expanded decision surface %#", (candidate) => {
    expect(validateCerenovusActionDecision(candidate).valid).toBe(false);
  });

  it.each([
    [sourcePlayerId, roleId("dreamer")],
    [targetPlayerId, roleId("mutant")]
  ] as const)("accepts modeled target %s with legal character %s", (selectedPlayerId, selectedRoleId) => {
    const recorded = createCerenovusChoiceRecordedPayload({
      rulesBaselineVersion: RULES_BASELINE_VERSION, opportunity, settlementCharacterStateRevision: 1,
      targetPlayerId: selectedPlayerId, chosenRoleId: selectedRoleId, roster, setup
    });
    expect(validateCerenovusChoiceRecordedPayloadShape(recorded)).toEqual({ valid: true });
  });

  it.each([
    [roleId("cerenovus"), "MINION"],
    [roleId("fang_gu"), "DEMON"],
    [roleId("goblin"), "off-script"]
  ] as const)("rejects unsupported selected role %s (%s)", (selectedRoleId, reason) => {
    expect(reason.length).toBeGreaterThan(0);
    expect(() => choice(selectedRoleId)).toThrow("on-script Townsfolk or Outsider");
  });

  it("reproduces every deterministic Cerenovus identifier", () => {
    const abilityId = formatCerenovusAbilityInstanceId({ roleTenureId: tenureId });
    expect(parseCerenovusAbilityInstanceId(abilityId)).toMatchObject({ valid: true, roleTenureId: tenureId, seatNumber: 1, acquiredCharacterStateRevision: 1 });
    expect(formatCerenovusChoiceId(opportunity.opportunityId)).toBe(`cerenovus-choice-v1:${opportunity.opportunityId}`);
    expect(formatCerenovusMarkerId(opportunity.opportunityId)).toBe(`cerenovus-madness-marker-v1:${opportunity.opportunityId}`);
    expect(formatCerenovusInstructionDeliveryId(opportunity.opportunityId, seatNumber(2))).toBe(`cerenovus-madness-instruction-v1:${opportunity.opportunityId}:recipient-seat-02`);
  });

  it.each([
    ["markerVersion", "wrong"],
    ["markerId", "wrong"],
    ["markerStatus", "PENDING"],
    ["instructionWindow", "TONIGHT"],
    ["removalRule", "NEVER"],
    ["targetPlayerId", playerId("wrong-target")],
    ["madAboutRoleId", roleId("mutant")],
    ["sourceCharacterStateRevision", 2]
  ] as const)("rejects marker tampering of %s", (key, value) => {
    const recorded = choice();
    const marker = { ...createCerenovusMadnessMarkedPayload(recorded), [key]: value };
    expect(validateCerenovusMarkerAgainstChoice(recorded, marker as never).valid).toBe(false);
  });

  it.each([
    ["modelVersion", "wrong"],
    ["deliveryId", "wrong"],
    ["markerId", "wrong"],
    ["recipientPlayerId", playerId("wrong-target")],
    ["selectedByCharacter", "witch"],
    ["madAboutRoleId", roleId("mutant")],
    ["instructionWindow", "TONIGHT"]
  ] as const)("rejects instruction tampering of %s", (key, value) => {
    const recorded = choice();
    const marker = createCerenovusMadnessMarkedPayload(recorded);
    const instruction = { ...createCerenovusMadnessInstructionDeliveredPayload(recorded, marker), [key]: value };
    expect(validateCerenovusInstructionAgainstChain(recorded, marker, instruction as never).valid).toBe(false);
  });

  it("requires the complete marker and instruction chain for settlement", () => {
    const recorded = choice();
    const marker = createCerenovusMadnessMarkedPayload(recorded);
    const instruction = createCerenovusMadnessInstructionDeliveredPayload(recorded, marker);
    const settlement = createCerenovusScheduledTaskSettlement(recorded);
    expect(hasCerenovusChainForSettlement({
      choices: { choices: [recorded] }, markers: { markers: [marker] }, instructions: { deliveries: [instruction] }, settlement
    })).toBe(true);
    expect(hasCerenovusChainForSettlement({
      choices: { choices: [recorded] }, markers: { markers: [] }, instructions: { deliveries: [instruction] }, settlement
    })).toBe(false);
    expect(settlement.outcomeType).toBe("CERENOVUS_MADNESS_MARKED");
  });

  it("rejects extra runtime keys on every stored effective-only payload", () => {
    const recorded = choice();
    const marker = createCerenovusMadnessMarkedPayload(recorded);
    const instruction = createCerenovusMadnessInstructionDeliveredPayload(recorded, marker);
    expect(validateCerenovusChoiceRecordedPayloadShape({ ...recorded, hidden: true }).valid).toBe(false);
    expect(validateCerenovusMadnessMarkedPayloadShape({ ...marker, hidden: true }).valid).toBe(false);
    expect(validateCerenovusMadnessInstructionDeliveredPayloadShape({ ...instruction, hidden: true }).valid).toBe(false);
  });

  it("does not match impairments for another player", () => {
    expect(evaluateCerenovusEffectiveOnlyCapability({
      sourcePlayerId: playerId("unaffected-player"), abilityImpairments: impairment("DRUNK")
    })).toEqual({ supported: true });
  });

  it("binds every choice source field to the referenced opportunity", () => {
    const recorded = choice();
    expect(validateCerenovusChoiceAgainstState({ choice: recorded, opportunity, roster, setup, roleTenures })).toEqual({ valid: true });
    const mutations: readonly [string, CerenovusChoiceRecordedPayload][] = [
      ["sourcePlayerId", { ...recorded, sourcePlayerId: playerId("forged-source") }],
      ["sourceSeatNumber", { ...recorded, sourceSeatNumber: seatNumber(2) }],
      ["sourceRole", { ...recorded, sourceRole: { ...recorded.sourceRole, roleId: roleId("witch") } }],
      ["abilitySource.kind", { ...recorded, abilitySource: { ...recorded.abilitySource, kind: "PHILOSOPHER_GRANT" as never } }],
      ["abilitySource.role", { ...recorded, abilitySource: { ...recorded.abilitySource, abilityRoleId: "witch" as never } }],
      ["abilitySource.tenure", { ...recorded, abilitySource: { ...recorded.abilitySource, roleTenureId: formatRoleTenureId({ seatNumber: seatNumber(2), roleId: "cerenovus", acquiredCharacterStateRevision: 1 }) } }],
      ["abilitySource.acquisition", { ...recorded, abilitySource: { ...recorded.abilitySource, acquiredCharacterStateRevision: 2 } }]
    ];
    for (const [label, forged] of mutations) {
      expect(validateCerenovusChoiceAgainstState({ choice: forged, opportunity, roster, setup, roleTenures }), label).toMatchObject({ valid: false });
    }
  });

  it("binds the opportunity and choice to exactly one canonical active base Cerenovus tenure and ability instance", () => {
    const recorded = choice();
    const invalidTenures: readonly [string, RoleTenureState][] = [
      ["missing", { records: [], processedTransitionFactIds: [] }],
      ["duplicate", { records: [roleTenures.records[0]!, roleTenures.records[0]!], processedTransitionFactIds: [] }],
      ["player", { ...roleTenures, records: [{ ...roleTenures.records[0]!, playerId: playerId("wrong") }] }],
      ["seat", { ...roleTenures, records: [{ ...roleTenures.records[0]!, seatNumber: seatNumber(2) }] }],
      ["role", { ...roleTenures, records: [{ ...roleTenures.records[0]!, roleId: "philosopher" }] }],
      ["acquisition", { ...roleTenures, records: [{ ...roleTenures.records[0]!, acquiredCharacterStateRevision: 2 }] }]
    ];
    for (const [label, candidate] of invalidTenures) {
      expect(validateCerenovusChoiceAgainstState({ choice: recorded, opportunity, roster, setup, roleTenures: candidate }), label).toMatchObject({ valid: false });
    }
  });

  it("rejects hostile opportunityId and recipient-seat primitives malformed canonical IDs and extra payload keys without throwing", () => {
    const recorded = choice();
    const marker = createCerenovusMadnessMarkedPayload(recorded);
    const instruction = createCerenovusMadnessInstructionDeliveredPayload(recorded, marker);
    const hostile: readonly unknown[] = [undefined, null, false, 0, 1, {}, [], "", " ", "bad", "first-night-v1:WITCH_ACTION:seat-01:opportunity-01", "first-night-v1:CERENOVUS_ACTION:seat-00:opportunity-01", "first-night-v1:CERENOVUS_ACTION:seat-01:opportunity-00"];
    for (const opportunityId of hostile) {
      expect(() => validateCerenovusChoiceRecordedPayloadShape({ ...recorded, opportunityId, choiceId: `cerenovus-choice-v1:${String(opportunityId)}` })).not.toThrow();
      expect(validateCerenovusChoiceRecordedPayloadShape({ ...recorded, opportunityId, choiceId: `cerenovus-choice-v1:${String(opportunityId)}` }).valid).toBe(false);
      expect(() => validateCerenovusMadnessMarkedPayloadShape({ ...marker, opportunityId, choiceId: `cerenovus-choice-v1:${String(opportunityId)}`, markerId: `cerenovus-madness-marker-v1:${String(opportunityId)}` })).not.toThrow();
      expect(validateCerenovusMadnessMarkedPayloadShape({ ...marker, opportunityId, choiceId: `cerenovus-choice-v1:${String(opportunityId)}`, markerId: `cerenovus-madness-marker-v1:${String(opportunityId)}` }).valid).toBe(false);
      expect(() => validateCerenovusMadnessInstructionDeliveredPayloadShape({ ...instruction, opportunityId, choiceId: `cerenovus-choice-v1:${String(opportunityId)}`, markerId: `cerenovus-madness-marker-v1:${String(opportunityId)}` })).not.toThrow();
      expect(validateCerenovusMadnessInstructionDeliveredPayloadShape({ ...instruction, opportunityId, choiceId: `cerenovus-choice-v1:${String(opportunityId)}`, markerId: `cerenovus-madness-marker-v1:${String(opportunityId)}` }).valid).toBe(false);
    }
    for (const recipientSeatNumber of [undefined, null, false, 0, 13, {}, []]) {
      expect(() => validateCerenovusMadnessInstructionDeliveredPayloadShape({ ...instruction, recipientSeatNumber })).not.toThrow();
      expect(validateCerenovusMadnessInstructionDeliveredPayloadShape({ ...instruction, recipientSeatNumber }).valid).toBe(false);
    }
  });
});
