import { describe, expect, it } from "vitest";
import {
  DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION,
  DREAMER_V2_INFORMATION_MODEL_VERSION,
  DREAMER_V2_INFORMATION_STAGE,
  DREAMER_V2_RESOLUTION_MODEL_VERSION,
  DREAMER_V2_SIMULATION_POLICY_VERSION,
  DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION,
  formatDreamerV2DeliveryId,
  formatDreamerV2TargetChoiceId,
  orderDreamerV2GainedTasksForInternalValidation,
  parseCanonicalDreamerV2TaskId,
  parseDreamerV2DeliveryId,
  parseDreamerV2TargetChoiceId,
  resolveDreamerV2Candidates,
  validateDreamerInformationDeliveredV2PayloadShape,
  validateDreamerInformationSetV1V2,
  validateDreamerTargetChoiceSetV1V2,
  validateDreamerTargetChosenV2PayloadShape
} from "./dreamer-v2.js";
import type { BaseDreamerV2SourceContract, PhilosopherGainedDreamerV2SourceContract } from "./dreamer-v2.js";
import {
  resolveDreamerV2SourceEffectivenessForInternalValidation,
  resolveDreamerV2TargetTruthForInternalValidation,
  resolveDreamerV2VortoxConstraintForInternalValidation,
  validateDreamerV2SourceContinuityForInternalValidation
} from "./dreamer-v2-internal.js";
import { validateDreamerV2AliveEvidenceForInternalReplay } from "./dreamer-v2-replay.js";
import { validateDreamerV2SourceContractShapeForInternalUse } from "./dreamer-v2-contract-internal.js";
import {
  abilityOutcomeEvidenceRankForInternalValidation,
  classifyDreamerV2TerminalOutcomeForInternalValidation,
  formatBaseFirstNightAbilityInstanceId
} from "./first-night-ability-outcome-ledger.js";
import { abilityImpairmentId, actionOpportunityId, eventId, playerId, roleId, scheduledTaskId } from "./ids.js";
import { seatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import type { RoleTenureState } from "./seamstress.js";
import { formatRoleTenureId } from "./seamstress.js";
import {
  formatBaseDreamerV2ActionOpportunityId,
  formatPhilosopherGainedDreamerV2ActionOpportunityId,
  parseFirstNightActionOpportunityId,
  validateFirstNightActionOpportunityStateShape
} from "./first-night-action-opportunity.js";

const role = (
  id: string,
  characterType: RoleSetupSnapshot["characterType"],
  defaultAlignment: RoleSetupSnapshot["defaultAlignment"]
): RoleSetupSnapshot => ({
  roleId: roleId(id),
  characterType,
  defaultAlignment,
  edition: "sects-and-violets",
  setupModifier: { outsiderDelta: 0, townsfolkDelta: 0 }
});
const dreamer = role("dreamer", "TOWNSFOLK", "GOOD");
const philosopher = role("philosopher", "TOWNSFOLK", "GOOD");
const flowergirl = role("flowergirl", "TOWNSFOLK", "GOOD");
const witch = role("witch", "MINION", "EVIL");
const vortox = role("vortox", "DEMON", "EVIL");
const catalog = (roles: readonly RoleSetupSnapshot[]) => ({
  scriptId: "sects-and-violets" as const,
  edition: "sects-and-violets" as const,
  roleCatalogVersion: "snv-role-catalog-v1",
  canonicalSignature: "catalog-signature",
  roles
});
const targetTruth = (targetTrueRole: RoleSetupSnapshot) => ({
  targetPlayerId: playerId("target"),
  targetSeatNumber: seatNumber(2),
  targetCharacterStateRevision: 1,
  targetTrueRole,
  targetNativeSide: targetTrueRole.defaultAlignment
});
const noVortox = {
  kind: "NONE_NO_CURRENT_VORTOX" as const,
  evaluatedCharacterStateRevision: 1,
  aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT" as const
};
const activeVortox = {
  kind: "VORTOX_FALSE_REQUIRED" as const,
  evaluatedCharacterStateRevision: 1,
  aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT" as const,
  vortoxPlayerId: playerId("vortox"),
  vortoxSeatNumber: seatNumber(4),
  vortoxRoleSnapshot: vortox,
  vortoxRoleTenure: {
    roleTenureId: formatRoleTenureId({ seatNumber: seatNumber(4), roleId: "vortox", acquiredCharacterStateRevision: 1 }),
    playerId: playerId("vortox"),
    seatNumber: seatNumber(4),
    roleId: roleId("vortox"),
    acquiredCharacterStateRevision: 1,
    endedCharacterStateRevision: null,
    statusAtEvaluation: "ACTIVE" as const
  }
};
const sourceTenureId = formatRoleTenureId({ seatNumber: seatNumber(1), roleId: "dreamer", acquiredCharacterStateRevision: 1 });
const sourceTenures: RoleTenureState = {
  records: [{
    roleTenureId: sourceTenureId,
    playerId: playerId("source"),
    seatNumber: seatNumber(1),
    roleId: "dreamer",
    acquiredCharacterStateRevision: 1,
    startedBy: { kind: "CHARACTERS_ASSIGNED", sourceEventId: eventId("source-assigned"), sourceEventSequence: 1, characterStateRevision: 1 }
  }],
  processedTransitionFactIds: []
};
const baseTaskId = scheduledTaskId("first-night-v1:DREAMER_ACTION:seat-01");
const baseSourceContract: BaseDreamerV2SourceContract = {
  sourceContractVersion: "dreamer-source-contract-v2",
  kind: "BASE_DREAMER_V2",
  taskPlanVersion: "first-night-task-plan-v2",
  taskId: baseTaskId,
  taskType: "DREAMER_ACTION",
  sourcePlayerId: playerId("source"),
  sourceSeatNumber: seatNumber(1),
  sourceRole: dreamer,
  abilityRole: dreamer,
  sourceRoleTenure: {
    roleTenureId: sourceTenureId,
    playerId: playerId("source"),
    seatNumber: seatNumber(1),
    roleId: roleId("dreamer"),
    acquiredCharacterStateRevision: 1,
    endedCharacterStateRevision: null,
    statusAtEvaluation: "ACTIVE"
  },
  opportunityCharacterStateRevision: 1,
  abilityInstance: {
    provenanceVersion: "first-night-ability-instance-provenance-v1",
    kind: "BASE_ROLE_TASK",
    abilityInstanceId: formatBaseFirstNightAbilityInstanceId(baseTaskId),
    abilityRoleId: roleId("dreamer"),
    taskId: baseTaskId,
    sourcePlayerId: playerId("source"),
    sourceSeatNumber: seatNumber(1)
  }
};

describe("Dreamer V2 pure and hostile domain seams", () => {
  it("D19-032 PURE_POLICY_SEAM resolves the exact GOOD domain", () => {
    const result = resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([witch, flowergirl, dreamer, vortox]),
      roleCatalogSignature: "signed",
      targetTruth: targetTruth(dreamer),
      sourceEffectiveness: { kind: "EFFECTIVE", representedImpairments: [] },
      vortoxConstraint: noVortox
    });
    expect(result.kind).toBe("READY");
    if (result.kind === "READY") expect(result.candidateDomain.goodCandidates.map((entry) => entry.roleId)).toEqual(["dreamer", "flowergirl"]);
  });

  it("D19-033 PURE_POLICY_SEAM resolves the exact EVIL domain", () => {
    const result = resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([vortox, dreamer, witch, flowergirl]),
      roleCatalogSignature: "signed",
      targetTruth: targetTruth(witch),
      sourceEffectiveness: { kind: "EFFECTIVE", representedImpairments: [] },
      vortoxConstraint: noVortox
    });
    expect(result.kind).toBe("READY");
    if (result.kind === "READY") expect(result.candidateDomain.evilCandidates.map((entry) => entry.roleId)).toEqual(["vortox", "witch"]);
  });

  it("D19-034 PURE_POLICY_SEAM uses UTF-16 code-unit ordering", () => {
    const result = resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([role("z_role", "TOWNSFOLK", "GOOD"), role("A_role", "OUTSIDER", "GOOD"), witch]),
      roleCatalogSignature: "signed",
      targetTruth: targetTruth(role("z_role", "TOWNSFOLK", "GOOD")),
      sourceEffectiveness: { kind: "KNOWN_DRUNK", representedImpairments: [{
        impairmentId: abilityImpairmentId("drunk"), impairmentKind: "DRUNK", sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
        sourcePlayerId: playerId("philosopher"), affectedPlayerId: playerId("source"), affectedSeatNumber: seatNumber(1),
        affectedRoleId: roleId("dreamer"), affectedRole: dreamer, appliedCharacterStateRevision: 1
      }] },
      vortoxConstraint: noVortox
    });
    expect(result.kind === "READY" && result.selectedGoodRole.roleId).toBe("A_role");
  });

  it("D19-035 PURE_POLICY_SEAM normal effective information preserves target truth", () => {
    const result = resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([dreamer, flowergirl, witch, vortox]), roleCatalogSignature: "signed",
      targetTruth: targetTruth(dreamer), sourceEffectiveness: { kind: "EFFECTIVE", representedImpairments: [] }, vortoxConstraint: noVortox
    });
    expect(result.kind === "READY" && result.truthOutcome).toBe("TARGET_INCLUDED");
  });

  it("D19-036 PURE_POLICY_SEAM Vortox information excludes target truth", () => {
    const result = resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([dreamer, flowergirl, witch, vortox]), roleCatalogSignature: "signed",
      targetTruth: targetTruth(dreamer), sourceEffectiveness: { kind: "EFFECTIVE", representedImpairments: [] }, vortoxConstraint: activeVortox
    });
    expect(result.kind === "READY" && result.truthOutcome).toBe("TARGET_EXCLUDED");
  });

  it("D19-037 STRUCTURAL_VALIDATION rejects sparse catalogs", () => {
    const roles = Array<RoleSetupSnapshot>(3);
    roles[0] = dreamer;
    roles[2] = witch;
    expect(resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog(roles), roleCatalogSignature: "signed", targetTruth: targetTruth(dreamer),
      sourceEffectiveness: { kind: "EFFECTIVE", representedImpairments: [] }, vortoxConstraint: noVortox
    })).toMatchObject({ kind: "DEPENDENCY_FAILURE", failureCode: "SPARSE_ROLE_CATALOG" });
  });

  it("D19-038 STRUCTURAL_VALIDATION rejects duplicate candidates", () => {
    expect(resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([dreamer, dreamer, witch]), roleCatalogSignature: "signed", targetTruth: targetTruth(dreamer),
      sourceEffectiveness: { kind: "EFFECTIVE", representedImpairments: [] }, vortoxConstraint: noVortox
    })).toMatchObject({ kind: "DEPENDENCY_FAILURE", failureCode: "DUPLICATE_ROLE_ID" });
  });

  it("D19-039 STRUCTURAL_VALIDATION rejects an unknown target role", () => {
    expect(resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([flowergirl, witch]), roleCatalogSignature: "signed", targetTruth: targetTruth(dreamer),
      sourceEffectiveness: { kind: "EFFECTIVE", representedImpairments: [] }, vortoxConstraint: noVortox
    })).toMatchObject({ kind: "DEPENDENCY_FAILURE", failureCode: "UNKNOWN_TARGET_ROLE" });
  });

  it("D19-040 PURE_POLICY_SEAM is invariant to catalog input order", () => {
    const input = {
      roleCatalogSignature: "signed", targetTruth: targetTruth(dreamer),
      sourceEffectiveness: { kind: "EFFECTIVE" as const, representedImpairments: [] as const }, vortoxConstraint: noVortox
    };
    const first = resolveDreamerV2Candidates({ ...input, roleCatalogSnapshot: catalog([dreamer, flowergirl, witch, vortox]) });
    const second = resolveDreamerV2Candidates({ ...input, roleCatalogSnapshot: catalog([vortox, witch, flowergirl, dreamer]) });
    expect(first).toEqual(second);
  });

  it("D19-021 PURE_POLICY_SEAM applies gained-own impairment only to the Philosopher holder", () => {
    const gained = {
      ...baseSourceContract,
      kind: "PHILOSOPHER_GAINED_DREAMER_V2",
      sourcePlayerId: playerId("philosopher"),
      sourceRole: philosopher,
      sourceRoleTenure: { ...baseSourceContract.sourceRoleTenure, playerId: playerId("philosopher"), roleId: roleId("philosopher") },
      schedulingVersion: "philosopher-gained-first-night-scheduling-v2",
      gainedEntitlement: {},
      abilityInstance: { ...baseSourceContract.abilityInstance, kind: "PHILOSOPHER_GAINED_TASK_V2" }
    } as unknown as PhilosopherGainedDreamerV2SourceContract;
    const impairment = {
      impairmentId: abilityImpairmentId("gained-own"), kind: "DRUNK" as const,
      sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" as const, sourcePlayerId: playerId("other-philosopher"),
      affectedPlayerId: gained.sourcePlayerId, affectedSeatNumber: gained.sourceSeatNumber,
      affectedRole: philosopher, chosenRoleId: roleId("dreamer"), sourceCharacterStateRevision: 1
    };
    expect(resolveDreamerV2SourceEffectivenessForInternalValidation({
      sourceContract: gained, abilityImpairments: { impairments: [impairment] }
    })).toMatchObject({ kind: "KNOWN_DRUNK", representedImpairments: [{ affectedPlayerId: gained.sourcePlayerId }] });
    expect(resolveDreamerV2SourceEffectivenessForInternalValidation({
      sourceContract: baseSourceContract, abilityImpairments: { impairments: [impairment] }
    })).toEqual({ kind: "EFFECTIVE", representedImpairments: [] });
  });

  it("D19-004 PURE_POLICY_SEAM POISONED selects false when a legal alternative exists", () => {
    const poisoned = {
      impairmentId: abilityImpairmentId("poison"), impairmentKind: "POISONED" as const, sourceKind: "SNAKE_CHARMER_DEMON_HIT" as const,
      sourcePlayerId: playerId("snake"), affectedPlayerId: playerId("source"), affectedSeatNumber: seatNumber(1),
      affectedRoleId: roleId("dreamer"), affectedRole: dreamer, appliedCharacterStateRevision: 1
    };
    const result = resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([dreamer, flowergirl, witch, vortox]), roleCatalogSignature: "signed",
      targetTruth: targetTruth(dreamer), sourceEffectiveness: { kind: "KNOWN_POISONED", representedImpairments: [poisoned] }, vortoxConstraint: noVortox
    });
    expect(result).toMatchObject({ kind: "READY", truthOutcome: "TARGET_EXCLUDED", informationReliability: "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING" });
  });

  it("D19-008 PURE_POLICY_SEAM Vortox plus POISONED remains Vortox-constrained false", () => {
    const result = resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([dreamer, flowergirl, witch, vortox]), roleCatalogSignature: "signed",
      targetTruth: targetTruth(dreamer),
      sourceEffectiveness: { kind: "KNOWN_POISONED", representedImpairments: [{
        impairmentId: abilityImpairmentId("poison"), impairmentKind: "POISONED", sourceKind: "SNAKE_CHARMER_DEMON_HIT",
        sourcePlayerId: playerId("snake"), affectedPlayerId: playerId("source"), affectedSeatNumber: seatNumber(1),
        affectedRoleId: roleId("dreamer"), affectedRole: dreamer, appliedCharacterStateRevision: 1
      }] },
      vortoxConstraint: activeVortox
    });
    expect(result).toMatchObject({ kind: "READY", truthOutcome: "TARGET_EXCLUDED", informationReliability: "VORTOX_CONSTRAINED_FALSE" });
  });

  it("candidate shortage fails closed", () => {
    expect(resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([dreamer, witch]), roleCatalogSignature: "signed", targetTruth: targetTruth(dreamer),
      sourceEffectiveness: { kind: "EFFECTIVE", representedImpairments: [] }, vortoxConstraint: activeVortox
    })).toMatchObject({ kind: "DEPENDENCY_FAILURE", failureCode: "NO_VORTOX_FALSE_GOOD_CANDIDATE" });
  });

  it("D19-075 PURE_POLICY_SEAM impaired information falls back to truth when no false native candidate exists", () => {
    const result = resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([dreamer, witch]), roleCatalogSignature: "signed", targetTruth: targetTruth(dreamer),
      sourceEffectiveness: { kind: "KNOWN_DRUNK", representedImpairments: [{
        impairmentId: abilityImpairmentId("drunk"), impairmentKind: "DRUNK", sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
        sourcePlayerId: playerId("philosopher"), affectedPlayerId: playerId("source"), affectedSeatNumber: seatNumber(1),
        affectedRoleId: roleId("dreamer"), affectedRole: dreamer, appliedCharacterStateRevision: 1
      }] }, vortoxConstraint: noVortox
    });
    expect(result).toMatchObject({ kind: "READY", truthOutcome: "TARGET_INCLUDED", informationReliability: "DETERMINISTIC_TRUE_WITH_KNOWN_DRUNKENNESS" });
  });

  it("D19-025 PURE_POLICY_SEAM orders artificial gained tasks by source seat then task ID", () => {
    const task = (seat: number, id: string) => ({
      taskPlanVersion: "first-night-task-plan-v2", taskId: scheduledTaskId(id), taskType: "DREAMER_ACTION" as const,
      taskClass: "ROLE_ACTION" as const, orderKey: { baseOrder: 60, insertionOrder: 1 },
      source: { kind: "PHILOSOPHER_GAINED_ABILITY" as const, playerId: playerId(`p-${seat}`), seatNumber: seatNumber(seat),
        sourceRole: philosopher, chosenRole: dreamer, opportunityId: actionOpportunityId(`opp-${seat}`), sourceCharacterStateRevision: 1 },
      status: "PENDING" as const, settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT" as const
    });
    expect(orderDreamerV2GainedTasksForInternalValidation([task(2, "z"), task(1, "z"), task(1, "a")]).map((entry) => entry.taskId)).toEqual(["a", "z", "z"]);
  });

  it("D19-077 HOSTILE_REPLAY_REJECTION rejects missing Vortox tenure", () => {
    expect(() => resolveDreamerV2VortoxConstraintForInternalValidation({
      currentCharacterState: { revision: 1, entries: [{ playerId: playerId("v"), seatNumber: seatNumber(4), role: vortox, currentAlignment: "EVIL" }] },
      roleTenures: { records: [], processedTransitionFactIds: [] },
      abilityImpairments: { impairments: [] }
    })).toThrowError(/tenure/i);
  });

  it("D19-078 HOSTILE_REPLAY_REJECTION rejects conflicting current Vortox identities", () => {
    expect(() => resolveDreamerV2VortoxConstraintForInternalValidation({
      currentCharacterState: { revision: 1, entries: [
        { playerId: playerId("v1"), seatNumber: seatNumber(4), role: vortox, currentAlignment: "EVIL" },
        { playerId: playerId("v2"), seatNumber: seatNumber(5), role: vortox, currentAlignment: "EVIL" }
      ] },
      roleTenures: { records: [], processedTransitionFactIds: [] },
      abilityImpairments: { impairments: [] }
    })).toThrowError(/zero or one current Vortox/);
  });

  it("D19-076 PURE_POLICY_SEAM returns exact impaired-current-Vortox constraint", () => {
    const tenureId = formatRoleTenureId({ seatNumber: seatNumber(4), roleId: "vortox", acquiredCharacterStateRevision: 1 });
    const tenures: RoleTenureState = { records: [{
      roleTenureId: tenureId, playerId: playerId("v"), seatNumber: seatNumber(4), roleId: "vortox",
      acquiredCharacterStateRevision: 1, startedBy: { kind: "CHARACTERS_ASSIGNED", sourceEventId: eventId("e"), sourceEventSequence: 1, characterStateRevision: 1 }
    }], processedTransitionFactIds: [] };
    expect(resolveDreamerV2VortoxConstraintForInternalValidation({
      currentCharacterState: { revision: 1, entries: [{ playerId: playerId("v"), seatNumber: seatNumber(4), role: vortox, currentAlignment: "EVIL" }] },
      roleTenures: tenures,
      abilityImpairments: { impairments: [{
        impairmentId: abilityImpairmentId("drunk-v"), kind: "DRUNK", sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
        sourcePlayerId: playerId("philosopher"), affectedPlayerId: playerId("v"), affectedSeatNumber: seatNumber(4),
        affectedRole: vortox, chosenRoleId: roleId("vortox"), sourceCharacterStateRevision: 1
      }] }
    })).toMatchObject({ kind: "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED", vortoxRoleTenure: { roleTenureId: tenureId } });
  });

  it("[D19-083] rejects hostile Dreamer V2 canonical IDs and preserves formatter/parser round trips", () => {
    const gainedTaskId = scheduledTaskId("first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-09:from-dreamer");
    const baseChoiceId = formatDreamerV2TargetChoiceId(baseTaskId);
    const gainedChoiceId = formatDreamerV2TargetChoiceId(gainedTaskId);
    const baseDeliveryId = formatDreamerV2DeliveryId(baseTaskId);
    const gainedDeliveryId = formatDreamerV2DeliveryId(gainedTaskId);
    expect(parseDreamerV2TargetChoiceId(baseChoiceId)).toMatchObject({ valid: true, taskId: baseTaskId }); // 1
    expect(parseDreamerV2TargetChoiceId(gainedChoiceId)).toMatchObject({ valid: true, taskId: gainedTaskId }); // 2
    expect(parseDreamerV2DeliveryId(baseDeliveryId)).toMatchObject({ valid: true, taskId: baseTaskId }); // 3
    expect(parseDreamerV2DeliveryId(gainedDeliveryId)).toMatchObject({ valid: true, taskId: gainedTaskId }); // 4
    const opportunityId = formatBaseDreamerV2ActionOpportunityId({ seatNumber: seatNumber(1) });
    const targetPayload = { rulesBaselineVersion: "Phase One v2.1", targetChoiceSchemaVersion: DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION,
      nightNumber: 1 as const, taskId: baseTaskId, taskType: "DREAMER_ACTION" as const, opportunityId, targetChoiceId: baseChoiceId,
      decisionKind: "CHOOSE_PLAYER" as const, sourceContract: baseSourceContract, targetPlayerId: playerId("target"),
      targetSeatNumber: seatNumber(2), settlementCharacterStateRevision: 1 };
    const candidates = resolveDreamerV2Candidates({ roleCatalogSnapshot: catalog([dreamer, flowergirl, witch]), roleCatalogSignature: "catalog-signature",
      targetTruth: targetTruth(dreamer), sourceEffectiveness: { kind: "EFFECTIVE", representedImpairments: [] }, vortoxConstraint: noVortox });
    if (candidates.kind !== "READY") throw new Error("Expected candidate fixture");
    const deliveryPayload = { rulesBaselineVersion: "Phase One v2.1", deliverySchemaVersion: DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION,
      nightNumber: 1 as const, taskId: baseTaskId, taskType: "DREAMER_ACTION" as const, opportunityId, targetChoiceId: baseChoiceId,
      deliveryId: baseDeliveryId, sourceContract: baseSourceContract, targetTruth: targetTruth(dreamer), candidateDomain: candidates.candidateDomain,
      selectedGoodRole: candidates.selectedGoodRole, selectedEvilRole: candidates.selectedEvilRole, truthOutcome: candidates.truthOutcome,
      sourceEffectiveness: { kind: "EFFECTIVE" as const, representedImpairments: [] }, vortoxConstraint: noVortox,
      informationReliability: candidates.informationReliability, resolutionModelVersion: DREAMER_V2_RESOLUTION_MODEL_VERSION,
      simulationPolicyVersion: DREAMER_V2_SIMULATION_POLICY_VERSION, knowledgeModelVersion: DREAMER_V2_INFORMATION_MODEL_VERSION,
      knowledgeStage: DREAMER_V2_INFORMATION_STAGE, settlementCharacterStateRevision: 1 };
    expect(validateDreamerTargetChosenV2PayloadShape({ ...targetPayload, targetChoiceId: gainedChoiceId })).toMatchObject({ valid: false }); // 5
    expect(validateDreamerInformationDeliveredV2PayloadShape({ ...deliveryPayload, deliveryId: gainedDeliveryId })).toMatchObject({ valid: false }); // 6
    const nonDreamerTaskId = scheduledTaskId("first-night-v1:CLOCKMAKER_INFORMATION:seat-01");
    expect(() => formatDreamerV2TargetChoiceId(nonDreamerTaskId)).toThrow();
    expect(() => formatDreamerV2DeliveryId(nonDreamerTaskId)).toThrow(); // 7
    expect(parseCanonicalDreamerV2TaskId(`${baseTaskId}:suffix`)).toMatchObject({ valid: false }); // 8
    expect(parseCanonicalDreamerV2TaskId("first-night-v1:dreamer_action:seat-01")).toMatchObject({ valid: false }); // 9
    for (const hostile of [` ${baseTaskId}`, `${baseTaskId} `]) expect(parseCanonicalDreamerV2TaskId(hostile)).toMatchObject({ valid: false }); // 10
    expect(parseCanonicalDreamerV2TaskId(`${baseTaskId}:extra`)).toMatchObject({ valid: false }); // 11
    expect(parseDreamerV2TargetChoiceId(formatDreamerV2TargetChoiceId(baseTaskId))).toMatchObject({ valid: true, taskId: baseTaskId, sourceKind: "BASE" });
    expect(parseDreamerV2DeliveryId(formatDreamerV2DeliveryId(gainedTaskId))).toMatchObject({ valid: true, taskId: gainedTaskId, sourceKind: "PHILOSOPHER_GAINED" });
    for (const index of [1, 9, 10, 11, 99, 100]) { // 12-17
      const base = formatBaseDreamerV2ActionOpportunityId({ seatNumber: seatNumber(1), opportunityIndex: index });
      expect(parseFirstNightActionOpportunityId(base)).toMatchObject({ valid: true, generation: "V2", sourceKind: "BASE", opportunityIndex: index });
    }
    expect(parseFirstNightActionOpportunityId(formatPhilosopherGainedDreamerV2ActionOpportunityId({ seatNumber: seatNumber(9), opportunityIndex: 100 })))
      .toMatchObject({ valid: true, sourceKind: "PHILOSOPHER_GAINED", opportunityIndex: 100 }); // 18
    for (const token of ["00", "010", "0010", "+1", "1.0", "-1", "9007199254740992"]) { // 19-25
      expect(parseFirstNightActionOpportunityId(actionOpportunityId(`first-night-v2:DREAMER_ACTION:BASE:seat-01:opportunity-${token}`)))
        .toEqual(expect.objectContaining({ valid: false }));
    }
    expect(validateDreamerTargetChosenV2PayloadShape({ ...targetPayload,
      targetChoiceId: `${baseChoiceId}:extra` })).toMatchObject({ valid: false }); // 26
    expect(validateDreamerInformationDeliveredV2PayloadShape({ ...deliveryPayload,
      deliveryId: `wrong-prefix:${baseTaskId}` })).toMatchObject({ valid: false }); // 27
  });

  it("D19-018 STRUCTURAL_VALIDATION rejects opportunity role-segment mismatch", () => {
    expect(parseFirstNightActionOpportunityId(actionOpportunityId(
      "first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-01:from-seamstress:opportunity-01"
    ))).toEqual(expect.objectContaining({ valid: false }));
  });

  it("validates complete base Dreamer V2 source-contract identity and exact shape", () => {
    expect(validateDreamerV2SourceContractShapeForInternalUse(baseSourceContract)).toEqual({ valid: true });
    for (const hostile of [
      { ...baseSourceContract, taskId: scheduledTaskId("first-night-v1:DREAMER_ACTION:seat-02") },
      { ...baseSourceContract, sourceRoleTenure: { ...baseSourceContract.sourceRoleTenure, playerId: playerId("other") } },
      { ...baseSourceContract, abilityInstance: { ...baseSourceContract.abilityInstance, sourceSeatNumber: seatNumber(2) } },
      { ...baseSourceContract, extra: true }
    ]) {
      expect(validateDreamerV2SourceContractShapeForInternalUse(hostile)).toEqual(expect.objectContaining({ valid: false }));
    }
  });

  it("D19-084 STRUCTURAL_VALIDATION rejects extra payload keys", () => {
    const taskId = baseTaskId;
    const targetPayload = {
      rulesBaselineVersion: "Phase One v2.1", targetChoiceSchemaVersion: DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION,
      nightNumber: 1, taskId, taskType: "DREAMER_ACTION", opportunityId: actionOpportunityId("opp"),
      targetChoiceId: formatDreamerV2TargetChoiceId(taskId), decisionKind: "CHOOSE_PLAYER", sourceContract: {},
      targetPlayerId: playerId("target"), targetSeatNumber: seatNumber(2), settlementCharacterStateRevision: 1
    };
    expect(validateDreamerTargetChosenV2PayloadShape({ ...targetPayload, extra: true })).toEqual(expect.objectContaining({ valid: false }));
    expect(validateDreamerInformationDeliveredV2PayloadShape({
      deliverySchemaVersion: DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION,
      knowledgeModelVersion: DREAMER_V2_INFORMATION_MODEL_VERSION, knowledgeStage: DREAMER_V2_INFORMATION_STAGE,
      resolutionModelVersion: DREAMER_V2_RESOLUTION_MODEL_VERSION, simulationPolicyVersion: DREAMER_V2_SIMULATION_POLICY_VERSION,
      deliveryId: formatDreamerV2DeliveryId(taskId), extra: true
    })).toEqual(expect.objectContaining({ valid: false }));
    const accessor = { ...targetPayload };
    Object.defineProperty(accessor, "targetPlayerId", { enumerable: true, get: () => playerId("target") });
    expect(validateDreamerTargetChosenV2PayloadShape(accessor)).toEqual(expect.objectContaining({ valid: false }));
    const symbol = { ...targetPayload, [Symbol("hostile")]: true };
    expect(validateDreamerTargetChosenV2PayloadShape(symbol)).toEqual(expect.objectContaining({ valid: false }));
    const sparseChoices = Array(2);
    sparseChoices[0] = targetPayload;
    expect(validateDreamerTargetChoiceSetV1V2({ choices: sparseChoices })).toEqual(expect.objectContaining({ valid: false }));
    class HostilePayload {}
    const prototype: unknown = Object.assign(new HostilePayload(), targetPayload);
    expect(validateDreamerTargetChosenV2PayloadShape(prototype)).toEqual(expect.objectContaining({ valid: false }));
  });

  it("D19-051 STRUCTURAL_VALIDATION rejects extra fields across opportunity, choice, and delivery validators", () => {
    expect(validateFirstNightActionOpportunityStateShape({ opportunities: [{
      opportunitySchemaVersion: "dreamer-first-night-action-v2",
      nightNumber: 1,
      opportunityId: formatBaseDreamerV2ActionOpportunityId({ seatNumber: seatNumber(1) }),
      opportunityKind: "DREAMER_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: baseTaskId,
      taskType: "DREAMER_ACTION",
      sourcePlayerId: playerId("source"),
      sourceSeatNumber: seatNumber(1),
      sourceRole: dreamer,
      sourceCharacterStateRevision: 1,
      sourceContract: baseSourceContract,
      visibility: {
        visibilitySchemaVersion: "dreamer-first-night-action-v2",
        resolutionCapabilityVersion: "dreamer-first-night-resolution-capability-v2",
        canChooseTarget: true,
        supportedDecisionKinds: ["CHOOSE_PLAYER"],
        targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER"
      },
      extra: true
    }] })).toEqual(expect.objectContaining({ valid: false }));
  });

  it("D19-092 HOSTILE_SOURCE_CONTINUITY_SEAM rejects fabricated role, seat, and tenure discontinuity", () => {
    const current = { revision: 1, entries: [{
      playerId: playerId("source"), seatNumber: seatNumber(1), role: dreamer, currentAlignment: "GOOD" as const
    }] };
    expect(validateDreamerV2SourceContinuityForInternalValidation({
      sourceContract: baseSourceContract, currentCharacterState: current, roleTenures: sourceTenures
    })).toEqual({ valid: true });
    for (const hostile of [
      { currentCharacterState: { ...current, entries: [{ ...current.entries[0]!, role: flowergirl }] }, roleTenures: sourceTenures },
      { currentCharacterState: { ...current, entries: [{ ...current.entries[0]!, seatNumber: seatNumber(2) }] }, roleTenures: sourceTenures },
      { currentCharacterState: current, roleTenures: { records: [], processedTransitionFactIds: [] } }
    ]) {
      expect(() => validateDreamerV2SourceContinuityForInternalValidation({
        sourceContract: baseSourceContract,
        currentCharacterState: hostile.currentCharacterState,
        roleTenures: hostile.roleTenures
      })).toThrowError(/continuity/i);
    }
  });

  it("D19-056 PURE_POLICY_SEAM classifies POISONED false as SOURCE_POISONING", () => {
    expect(classifyDreamerV2TerminalOutcomeForInternalValidation("TARGET_INCLUDED", "RULE_CORRECT")).toEqual({
      outcomeStatus: "NORMAL", causeKind: "NO_OTHER_CHARACTER_ABILITY", causedByAnotherCharacterAbility: false
    });
    expect(classifyDreamerV2TerminalOutcomeForInternalValidation("TARGET_EXCLUDED", "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS")).toEqual({
      outcomeStatus: "ABNORMAL", causeKind: "SOURCE_DRUNKENNESS", causedByAnotherCharacterAbility: true
    });
    expect(classifyDreamerV2TerminalOutcomeForInternalValidation("TARGET_EXCLUDED", "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING")).toEqual({
      outcomeStatus: "ABNORMAL", causeKind: "SOURCE_POISONING", causedByAnotherCharacterAbility: true
    });
    expect(classifyDreamerV2TerminalOutcomeForInternalValidation("TARGET_EXCLUDED", "VORTOX_CONSTRAINED_FALSE")).toEqual({
      outcomeStatus: "ABNORMAL", causeKind: "VORTOX_FALSE_INFORMATION", causedByAnotherCharacterAbility: true
    });
  });

  it("D19-074 CROSS_PLATFORM_CI freezes canonical IDs, ordering, and evidence ranks", () => {
    expect(formatBaseDreamerV2ActionOpportunityId({ seatNumber: seatNumber(1) }))
      .toBe("first-night-v2:DREAMER_ACTION:BASE:seat-01:opportunity-01");
    expect(formatDreamerV2TargetChoiceId(baseTaskId)).toBe(`dreamer-target-choice-v2:${baseTaskId}`);
    expect(formatDreamerV2DeliveryId(baseTaskId)).toBe(`dreamer-delivery-v2:${baseTaskId}`);
    expect((["SOURCE_EVENT", "DREAMER_V2_ACTION_OPPORTUNITY", "DREAMER_V2_DELIVERY"] as const).map(
      (kind) => abilityOutcomeEvidenceRankForInternalValidation(kind)
    )).toEqual([0, 17, 18]);
  });

  it("D19-079 PURE_POLICY_SEAM alignment-only change does not change target truth", () => {
    const roster = [{ playerId: playerId("target"), seatNumber: seatNumber(2), displayName: "Target", playerKind: "AI" as const }];
    const resolve = (currentAlignment: "GOOD" | "EVIL") => resolveDreamerV2TargetTruthForInternalValidation({
      currentCharacterState: { revision: 2, entries: [{ playerId: playerId("target"), seatNumber: seatNumber(2), role: dreamer, currentAlignment }] },
      roster,
      targetPlayerId: playerId("target")
    });
    expect(resolve("GOOD")).toEqual(resolve("EVIL"));
    expect(resolve("EVIL")).toMatchObject({ targetTrueRole: dreamer, targetNativeSide: "GOOD" });
  });

  it("D19-082 PURE_POLICY_SEAM keeps an in-play false role legal", () => {
    const result = resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([dreamer, flowergirl, witch]), roleCatalogSignature: "signed",
      targetTruth: targetTruth(dreamer),
      sourceEffectiveness: { kind: "KNOWN_DRUNK", representedImpairments: [{
        impairmentId: abilityImpairmentId("drunk-in-play"), impairmentKind: "DRUNK", sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
        sourcePlayerId: playerId("philosopher"), affectedPlayerId: playerId("source"), affectedSeatNumber: seatNumber(1),
        affectedRoleId: roleId("dreamer"), affectedRole: dreamer, appliedCharacterStateRevision: 1
      }] },
      vortoxConstraint: noVortox
    });
    expect(result).toMatchObject({ kind: "READY", selectedGoodRole: { roleId: "flowergirl" }, truthOutcome: "TARGET_EXCLUDED" });
  });

  it("D19-091 HOSTILE_REPLAY_REJECTION rejects death-capable alive evidence", () => {
    expect(validateDreamerV2AliveEvidenceForInternalReplay([{ eventType: "WitchDeathPendingMarked" }])).toEqual({ valid: true });
    const result = validateDreamerV2AliveEvidenceForInternalReplay([{ eventType: "PlayerDied" }]);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain("does not support alive evidence");
  });

  it("D19-094 STRUCTURAL_VALIDATION preserves legacy evidence ranks and appends V2 ranks 17 and 18", () => {
    expect(abilityOutcomeEvidenceRankForInternalValidation("SOURCE_EVENT")).toBe(0);
    expect(abilityOutcomeEvidenceRankForInternalValidation("MATHEMATICIAN_DELIVERY")).toBe(16);
    expect(abilityOutcomeEvidenceRankForInternalValidation("DREAMER_V2_ACTION_OPPORTUNITY")).toBe(17);
    expect(abilityOutcomeEvidenceRankForInternalValidation("DREAMER_V2_DELIVERY")).toBe(18);
  });

  it("rejects mixed Dreamer V1/V2 state with same-source or same-delivery duplication", () => {
    const candidates = resolveDreamerV2Candidates({
      roleCatalogSnapshot: catalog([dreamer, flowergirl, witch]),
      roleCatalogSignature: "signed",
      targetTruth: targetTruth(dreamer),
      sourceEffectiveness: { kind: "EFFECTIVE", representedImpairments: [] },
      vortoxConstraint: noVortox
    });
    if (candidates.kind !== "READY") throw new Error("Expected mixed-history candidate fixture");
    const v2Choice = {
      rulesBaselineVersion: "Phase One v2.1", targetChoiceSchemaVersion: DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION,
      nightNumber: 1 as const, taskId: baseTaskId, taskType: "DREAMER_ACTION" as const,
      opportunityId: formatBaseDreamerV2ActionOpportunityId({ seatNumber: seatNumber(1) }),
      targetChoiceId: formatDreamerV2TargetChoiceId(baseTaskId), decisionKind: "CHOOSE_PLAYER" as const,
      sourceContract: baseSourceContract, targetPlayerId: playerId("target"), targetSeatNumber: seatNumber(2),
      settlementCharacterStateRevision: 1
    };
    const v2 = {
      rulesBaselineVersion: "Phase One v2.1",
      deliverySchemaVersion: DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION,
      nightNumber: 1 as const,
      taskId: baseTaskId,
      taskType: "DREAMER_ACTION" as const,
      opportunityId: formatBaseDreamerV2ActionOpportunityId({ seatNumber: seatNumber(1) }),
      targetChoiceId: formatDreamerV2TargetChoiceId(baseTaskId),
      deliveryId: formatDreamerV2DeliveryId(baseTaskId),
      sourceContract: baseSourceContract,
      targetTruth: targetTruth(dreamer),
      candidateDomain: candidates.candidateDomain,
      selectedGoodRole: candidates.selectedGoodRole,
      selectedEvilRole: candidates.selectedEvilRole,
      truthOutcome: candidates.truthOutcome,
      sourceEffectiveness: { kind: "EFFECTIVE" as const, representedImpairments: [] as const },
      vortoxConstraint: noVortox,
      informationReliability: candidates.informationReliability,
      resolutionModelVersion: DREAMER_V2_RESOLUTION_MODEL_VERSION,
      simulationPolicyVersion: DREAMER_V2_SIMULATION_POLICY_VERSION,
      knowledgeModelVersion: DREAMER_V2_INFORMATION_MODEL_VERSION,
      knowledgeStage: DREAMER_V2_INFORMATION_STAGE,
      settlementCharacterStateRevision: 1
    };
    const v1 = {
      rulesBaselineVersion: "Phase One v2.1",
      nightNumber: 1 as const,
      taskId: scheduledTaskId("first-night-v1:DREAMER_ACTION:seat-03"),
      taskType: "DREAMER_ACTION" as const,
      opportunityId: actionOpportunityId("first-night-v1:DREAMER_ACTION:seat-03:opportunity-01"),
      knowledgeModelVersion: "dreamer-information-model-v1" as const,
      knowledgeStage: "DREAMER_INFORMATION" as const,
      sourcePlayerId: playerId("legacy-source"),
      sourceSeatNumber: seatNumber(3),
      sourceCharacterStateRevision: 1,
      targetPlayerId: playerId("legacy-target"),
      targetSeatNumber: seatNumber(2),
      informationReliability: { kind: "EFFECTIVE" as const },
      goodRole: flowergirl,
      evilRole: witch,
      falseRolePolicyVersion: "dreamer-false-role-policy-v1" as const
    };
    const v1Choice = {
      rulesBaselineVersion: v1.rulesBaselineVersion, nightNumber: 1 as const, taskId: v1.taskId,
      taskType: "DREAMER_ACTION" as const, opportunityId: v1.opportunityId, decisionKind: "CHOOSE_PLAYER" as const,
      sourcePlayerId: v1.sourcePlayerId, sourceSeatNumber: v1.sourceSeatNumber, sourceRole: dreamer,
      sourceCharacterStateRevision: 1, targetPlayerId: v1.targetPlayerId, targetSeatNumber: v1.targetSeatNumber
    };
    expect(validateDreamerTargetChoiceSetV1V2({ choices: [v1Choice] })).toEqual({ valid: true });
    expect(validateDreamerTargetChoiceSetV1V2({ choices: [v2Choice] })).toEqual({ valid: true });
    expect(validateDreamerTargetChoiceSetV1V2({ choices: [v1Choice, v2Choice] })).toEqual({ valid: true });
    expect(validateDreamerTargetChoiceSetV1V2({ choices: [{ arbitraryCanonicalRecord: "unknown" }] }))
      .toEqual(expect.objectContaining({ valid: false }));
    expect(validateDreamerTargetChoiceSetV1V2({ choices: [{ ...v1Choice, extra: true }] }))
      .toEqual(expect.objectContaining({ valid: false }));
    expect(validateDreamerTargetChoiceSetV1V2({ choices: [{ ...v2Choice, targetChoiceSchemaVersion: undefined }] }))
      .toEqual(expect.objectContaining({ valid: false }));
    expect(validateDreamerTargetChoiceSetV1V2({ choices: [v1Choice, { ...v2Choice, taskId: v1Choice.taskId,
      targetChoiceId: formatDreamerV2TargetChoiceId(v1Choice.taskId) }] })).toEqual(expect.objectContaining({ valid: false }));
    expect(validateDreamerInformationSetV1V2({ deliveries: [v1, v2] })).toEqual({ valid: true });
    expect(validateDreamerInformationSetV1V2({ deliveries: [v1] })).toEqual({ valid: true });
    expect(validateDreamerInformationSetV1V2({ deliveries: [v2] })).toEqual({ valid: true });
    expect(validateDreamerInformationSetV1V2({ deliveries: [{ arbitraryCanonicalRecord: "unknown" }] }))
      .toEqual(expect.objectContaining({ valid: false }));
    expect(validateDreamerInformationSetV1V2({ deliveries: [v1, { ...v2, taskId: v1.taskId,
      targetChoiceId: formatDreamerV2TargetChoiceId(v1.taskId), deliveryId: formatDreamerV2DeliveryId(v1.taskId) }] }))
      .toEqual(expect.objectContaining({ valid: false }));
    expect(validateDreamerInformationSetV1V2({ deliveries: [v2, v2] })).toEqual(expect.objectContaining({ valid: false }));
    expect(validateDreamerInformationSetV1V2({
      deliveries: [v1, { ...v2, sourceContract: { ...v2.sourceContract, sourcePlayerId: v1.sourcePlayerId } }]
    })).toEqual(expect.objectContaining({ valid: false }));
  });
});
