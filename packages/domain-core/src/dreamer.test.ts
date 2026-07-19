import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { testFirstNightTaskCatalog } from "@botc/test-harness";
import {
  DREAMER_FALSE_ROLE_POLICY_VERSION,
  DREAMER_INFORMATION_STAGE,
  SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
  createDreamerTargetChosenPayload,
  createDreamerInformationDeliveredPayload,
  createDreamerCanonicalDrunkVortoxInformationDeliveredPayload,
  createPhilosopherGainedDreamerInformationDeliveredPayload,
  createPhilosopherGainedDreamerTargetChosenPayload,
  createDreamerVortoxInformationDeliveredPayload,
  cloneDreamerInformationSet,
  cloneDreamerTargetChoiceSet,
  evaluateDreamerEffectiveness,
  resolveBaseDreamerV2NormalCapability,
  resolvePhilosopherGainedDreamerCapability,
  sameDreamerInformationDelivery,
  validateDreamerInformationDeliveredPayload,
  validateDreamerTargetChosenPayload,
  validateStoredDreamerInformationDelivered
} from "./dreamer.js";
import type {
  DreamerEffectivenessResult,
  DreamerInformationDeliveredPayload
} from "./dreamer.js";
import { DomainError } from "./errors.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import type { FirstNightTaskPlan } from "./first-night-task-plan.js";
import {
  abilityImpairmentId,
  actionOpportunityId,
  eventId,
  grantedAbilityId,
  playerId,
  roleId,
  scheduledTaskId
} from "./ids.js";
import type { AbilityImpairmentSet } from "./philosopher-ability.js";
import { seatNumber } from "./player-roster.js";
import type { PlayerRoster } from "./player-roster.js";
import {
  DREAMER_BASE_SOURCE_CONTRACT_VERSION,
  DREAMER_PHILOSOPHER_GAINED_SOURCE_CONTRACT_VERSION,
  DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
  DREAMER_V3_VISIBILITY_SCHEMA_VERSION,
  DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION,
  DREAMER_V4_VISIBILITY_SCHEMA_VERSION,
  formatBaseDreamerV2FirstNightActionOpportunityId
} from "./first-night-action-opportunity.js";
import type { DreamerActionOpportunityV3, DreamerActionOpportunityV4 } from "./first-night-action-opportunity.js";
import {
  formatBaseFirstNightAbilityInstanceId,
  formatPhilosopherGainedV2AbilityInstanceId
} from "./first-night-ability-outcome-ledger.js";
import { formatRoleTenureId } from "./seamstress.js";
import type { RoleTenureState } from "./seamstress.js";
import type { GeneratedSetup, RoleSetupSnapshot } from "./setup-types.js";

const role = (
  id: string,
  characterType: RoleSetupSnapshot["characterType"],
  defaultAlignment: RoleSetupSnapshot["defaultAlignment"]
): RoleSetupSnapshot => ({
  roleId: roleId(id),
  characterType,
  defaultAlignment,
  edition: "sects-and-violets",
  setupModifier: {
    outsiderDelta: 0,
    townsfolkDelta: 0
  }
});

describe("Phase 3 Slice 2B19A3A Vortox payload contracts", () => {
  const validationInput = () => {
    const facts = v3VortoxFacts();
    return { facts, input: { choices: { choices: [facts.choice] }, deliveries: undefined, setup: facts.setup,
      currentCharacterState: facts.state, abilityImpairments: undefined,
      firstNightActionOpportunities: facts.opportunities, firstNightTaskPlan: facts.plan, roleTenures: facts.roleTenures } };
  };

  it("[2B19A3A-C05] validates the exact canonical V3 shape", () => {
    const { facts, input } = validationInput();
    expect(validateDreamerInformationDeliveredPayload(facts.delivery, input)).toStrictEqual({ valid: true });
    expect(Object.keys(facts.delivery)).toStrictEqual([
      "rulesBaselineVersion", "deliverySchemaVersion", "nightNumber", "taskId", "taskType", "opportunityId",
      "opportunitySchemaVersion", "knowledgeModelVersion", "knowledgeStage", "sourcePlayerId", "sourceSeatNumber",
      "sourceCharacterStateRevision", "sourceContract", "targetPlayerId", "targetSeatNumber", "informationReliability",
      "vortoxConstraint", "goodRole", "evilRole", "falseRolePolicyVersion"
    ]);
  });

  it("[2B19A3A-C12/C13/C14] selects deterministic native false roles independent of catalog order", () => {
    const first = v3VortoxFacts();
    const reversedSetup = setup([...first.setup.roleCatalogSnapshot.roles].reverse());
    const reversedCapability = resolveBaseDreamerV2NormalCapability({ opportunity: first.opportunity,
      firstNightTaskPlan: first.plan, firstNightActionOpportunities: first.opportunities,
      firstNightTaskProgress: undefined, currentCharacterState: first.state, setup: reversedSetup,
      roleTenures: first.roleTenures, abilityImpairments: undefined });
    if (reversedCapability.kind !== "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED") throw new Error("Expected Vortox capability");
    const reversed = createDreamerVortoxInformationDeliveredPayload({ rulesBaselineVersion: "Phase One v2.1",
      targetChoice: first.choice, setup: reversedSetup, currentCharacterState: first.state, capability: reversedCapability });
    expect(reversed.goodRole).toStrictEqual(first.delivery.goodRole);
    expect(reversed.evilRole).toStrictEqual(first.delivery.evilRole);
    expect(first.setup.roleCatalogSnapshot.roles.some((roleEntry) => roleEntry.roleId === first.delivery.goodRole.roleId)).toBe(true);
  });

  it("[2B19A3A-C18/C19] classifies impaired Dreamer or Vortox as non-V3", () => {
    const facts = v3VortoxFacts();
    const sourceImpairment = { impairments: [{ impairmentId: abilityImpairmentId("source-poison"), kind: "POISONED" as const,
      sourceKind: "SNAKE_CHARMER_DEMON_HIT" as const, sourcePlayerId: playerId("snake-player"),
      affectedPlayerId: playerId("dreamer-player"), affectedSeatNumber: seatNumber(1), affectedRole: dreamerRole,
      sourceCharacterStateRevision: 1 }] };
    expect(resolveBaseDreamerV2NormalCapability({ opportunity: facts.opportunity, firstNightTaskPlan: facts.plan,
      firstNightActionOpportunities: facts.opportunities, currentCharacterState: facts.state, setup: facts.setup,
      firstNightTaskProgress: undefined, roleTenures: facts.roleTenures,
      abilityImpairments: sourceImpairment })).toMatchObject({ kind: "SOURCE_REPRESENTED_IMPAIRED" });
    const vortoxImpairment = { impairments: [{ impairmentId: abilityImpairmentId("vortox-drunk"), kind: "DRUNK" as const,
      sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" as const, sourcePlayerId: playerId("philosopher-player"),
      affectedPlayerId: playerId("demon-player"), affectedSeatNumber: seatNumber(3), affectedRole: vortoxRole,
      chosenRoleId: roleId("vortox"), sourceCharacterStateRevision: 1 }] };
    expect(resolveBaseDreamerV2NormalCapability({ opportunity: facts.opportunity, firstNightTaskPlan: facts.plan,
      firstNightActionOpportunities: facts.opportunities, currentCharacterState: facts.state, setup: facts.setup,
      firstNightTaskProgress: undefined, roleTenures: facts.roleTenures, abilityImpairments: vortoxImpairment })).toMatchObject({
      kind: "EFFECTIVENESS_UNRESOLVED", reason: "VORTOX_EFFECTIVENESS_CONFLICT"
    });
  });

  it("[2B19A3A-C20] fails closed when a native false-role category has no candidate", () => {
    const facts = v3VortoxFacts();
    const starved = setup([dreamerRole, flowergirlRole, snakeCharmerRole, vortoxRole]);
    const vortoxChoice = createDreamerTargetChosenPayload({ rulesBaselineVersion: "Phase One v2.1", taskId: v3TaskId,
      opportunityId: facts.opportunity.opportunityId, targetPlayerId: playerId("demon-player"),
      firstNightActionOpportunities: facts.opportunities, roster: facts.roster, currentCharacterState: facts.state });
    if (!("targetSchemaVersion" in vortoxChoice)) throw new Error("Expected V2 target choice");
    expect(() => createDreamerVortoxInformationDeliveredPayload({ rulesBaselineVersion: "Phase One v2.1",
      targetChoice: vortoxChoice, setup: starved, currentCharacterState: facts.state, capability: facts.capability }))
      .toThrowError(DomainError);
  });

  it("[2B19A3A-C46] excludes the target role after a pre-delivery character change", () => {
    const before = v3VortoxFacts(flowergirlRole);
    const changedState: CurrentCharacterStateSet = {
      revision: 2,
      entries: before.state.entries.map((entry) => entry.playerId === before.choice.targetPlayerId
        ? { ...entry, role: witchRole, currentAlignment: witchRole.defaultAlignment }
        : entry)
    };
    const capability = resolveBaseDreamerV2NormalCapability({
      opportunity: before.opportunity,
      firstNightTaskPlan: before.plan,
      firstNightTaskProgress: undefined,
      firstNightActionOpportunities: before.opportunities,
      currentCharacterState: changedState,
      setup: before.setup,
      roleTenures: before.roleTenures,
      abilityImpairments: undefined
    });
    if (capability.kind !== "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED") {
      throw new Error("Expected Vortox capability after target character change");
    }
    const changedChoice = {
      ...before.choice,
      sourceCharacterStateRevision: 2,
      sourceContract: {
        ...before.choice.sourceContract,
        sourceCharacterStateRevision: 2
      }
    };
    const delivery = createDreamerVortoxInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice: changedChoice,
      setup: before.setup,
      currentCharacterState: changedState,
      capability
    });
    expect([delivery.goodRole.roleId, delivery.evilRole.roleId]).not.toContain(witchRole.roleId);
  });

  it("[2B19A3A-C49] preserves Dreamer at 61/80 between Clockmaker and Seamstress", () => {
    const definitions = testFirstNightTaskCatalog.definitions;
    const clockmakerIndex = definitions.findIndex((definition) => definition.taskType === "CLOCKMAKER_INFORMATION");
    const dreamerIndex = definitions.findIndex((definition) => definition.taskType === "DREAMER_ACTION");
    const seamstressIndex = definitions.findIndex((definition) => definition.taskType === "SEAMSTRESS_ACTION");

    expect([clockmakerIndex, dreamerIndex, seamstressIndex]).toStrictEqual([7, 8, 9]);
    expect(definitions.slice(clockmakerIndex, seamstressIndex + 1).map((definition) => ({
      taskType: definition.taskType,
      baseOrder: definition.baseOrder
    }))).toStrictEqual([
      { taskType: "CLOCKMAKER_INFORMATION", baseOrder: 800 },
      { taskType: "DREAMER_ACTION", baseOrder: 900 },
      { taskType: "SEAMSTRESS_ACTION", baseOrder: 1000 }
    ]);
  });

  it("[2B19A3A-C50] preserves Vortox without a first-night wake task", () => {
    expect(testFirstNightTaskCatalog.definitions.some((definition) =>
      definition.sourceKind === "ROLE" && definition.roleId === roleId("vortox")
    )).toBe(false);
  });

  it("[2B19A3A-S01/S02/S03] rejects missing, extra, and wrong-literal V3 payloads", () => {
    const { facts, input } = validationInput();
    const missing = structuredClone(facts.delivery) as unknown as Record<string, unknown>;
    delete missing.vortoxConstraint;
    expect(validateDreamerInformationDeliveredPayload(missing, input).valid).toBe(false);
    expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, hidden: true }, input).valid).toBe(false);
    expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, nightNumber: "1" }, input).valid).toBe(false);
  });

  it("[2B19A3A-S04/S05/S06/S07/S08/S09] rejects hostile records without invoking accessors", () => {
    const { facts, input } = validationInput();
    let getterCalls = 0;
    const accessor = structuredClone(facts.delivery) as unknown as Record<string, unknown>;
    Object.defineProperty(accessor, "goodRole", { enumerable: true, get: () => { getterCalls += 1; throw new Error("getter"); } });
    expect(validateDreamerInformationDeliveredPayload(accessor, input).valid).toBe(false);
    expect(getterCalls).toBe(0);
    const throwing = new Proxy(facts.delivery, { ownKeys: () => { throw new Error("proxy"); } });
    expect(validateDreamerInformationDeliveredPayload(throwing, input).valid).toBe(false);
    const revocable = Proxy.revocable(facts.delivery, {}); revocable.revoke();
    expect(validateDreamerInformationDeliveredPayload(revocable.proxy, input).valid).toBe(false);
    const symbol = structuredClone(facts.delivery) as typeof facts.delivery & { [key: symbol]: boolean };
    symbol[Symbol("hidden")] = true;
    expect(validateDreamerInformationDeliveredPayload(symbol, input).valid).toBe(false);
    const cyclic = structuredClone(facts.delivery) as unknown as Record<string, unknown>; cyclic.self = cyclic;
    expect(validateDreamerInformationDeliveredPayload(cyclic, input).valid).toBe(false);
    const nonplain = Object.assign(Object.create({ inherited: true }) as object, facts.delivery);
    expect(validateDreamerInformationDeliveredPayload(nonplain, input).valid).toBe(false);
  });

  it("[2B19A3A-S10] rejects a sparse canonical catalog array", () => {
    const { facts, input } = validationInput();
    const roles = [...facts.setup.roleCatalogSnapshot.roles];
    Reflect.deleteProperty(roles, "1");
    expect(validateDreamerInformationDeliveredPayload(facts.delivery, {
      ...input,
      setup: { roleCatalogSnapshot: { ...facts.setup.roleCatalogSnapshot, roles } }
    }).valid).toBe(false);
  });

  it("[2B19A3A-S30/S31/S32/S33] clones all versions independently and compares cross-version false", () => {
    const v1 = storedDelivery();
    const v2 = v3Facts().delivery;
    const v3 = v3VortoxFacts().delivery;
    const clones = cloneDreamerInformationSet({ deliveries: [v1, v2, v3] }).deliveries;
    expect(clones).toStrictEqual([v1, v2, v3]);
    expect(clones[0]).not.toBe(v1); expect(clones[1]).not.toBe(v2); expect(clones[2]).not.toBe(v3);
    expect(sameDreamerInformationDelivery(v1, v2)).toBe(false);
    expect(sameDreamerInformationDelivery(v1, v3)).toBe(false);
    expect(sameDreamerInformationDelivery(v2, v3)).toBe(false);
  });
});

describe("Phase 3 Slice 2B19A3B1 canonical-drunk Vortox payload contracts", () => {
  const validationInput = () => {
    const facts = v4VortoxFacts();
    return { facts, input: { choices: { choices: [facts.choice] }, deliveries: undefined,
      setup: facts.setup, currentCharacterState: facts.state, abilityImpairments: facts.abilityImpairments,
      firstNightActionOpportunities: facts.opportunities, firstNightTaskPlan: facts.plan,
      roleTenures: facts.roleTenures } };
  };

  it("[2B19A3B1-C06/C07/C11/C12/C13/C14/C15/C16/C17/C30/C32/C34/C35/C41-S01/S02/S03/S04/S05/S06/S07/S08/S12/S13/S15/S16/S19/S20] validates only the exact deterministic V4 contract", () => {
    const { facts, input } = validationInput();
    expect(validateDreamerInformationDeliveredPayload(facts.delivery, input)).toStrictEqual({ valid: true });
    expect(Object.keys(facts.delivery)).toHaveLength(22);
    for (const key of Object.keys(facts.delivery)) {
      const missing = structuredClone(facts.delivery) as unknown as Record<string, unknown>;
      delete missing[key];
      expect(validateDreamerInformationDeliveredPayload(missing, input).valid, key).toBe(false);
    }
    expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, extra: true }, input).valid).toBe(false);
    for (const [field, value] of [
      ["deliverySchemaVersion", "dreamer-information-delivered-v3"],
      ["nightNumber", 2], ["taskType", "SEAMSTRESS_ACTION"],
      ["opportunitySchemaVersion", "future"], ["knowledgeModelVersion", "future"],
      ["knowledgeStage", "future"], ["falseRolePolicyVersion", "future"]
    ] as const) {
      expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, [field]: value }, input).valid, field).toBe(false);
    }
    const nested = ["sourceContract", "informationReliability", "sourceImpairment", "vortoxConstraint"] as const;
    for (const field of nested) {
      const value = structuredClone(facts.delivery[field]) as unknown as Record<string, unknown>;
      const firstKey = Object.keys(value)[0]!;
      const missing = { ...facts.delivery, [field]: { ...value } } as unknown as Record<string, unknown>;
      delete (missing[field] as Record<string, unknown>)[firstKey];
      expect(validateDreamerInformationDeliveredPayload(missing, input).valid, `${field}-missing`).toBe(false);
      expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery,
        [field]: { ...value, extra: true } }, input).valid, `${field}-extra`).toBe(false);
    }
    for (const [field, value] of [
      ["impairmentId", abilityImpairmentId("wrong-impairment")],
      ["affectedPlayerId", playerId("wrong-player")],
      ["affectedSeatNumber", seatNumber(2)],
      ["affectedRole", flowergirlRole],
      ["sourceKind", "SNAKE_CHARMER_DEMON_HIT"],
      ["sourcePlayerId", playerId("wrong-source")],
      ["chosenRoleId", "artist"],
      ["sourceCharacterStateRevision", 0]
    ] as const) {
      expect(validateDreamerInformationDeliveredPayload({
        ...facts.delivery,
        sourceImpairment: { ...facts.delivery.sourceImpairment, [field]: value }
      }, input).valid, `sourceImpairment.${field}`).toBe(false);
    }
    for (const [field, value] of [
      ["vortoxPlayerId", playerId("wrong-vortox")],
      ["vortoxSeatNumber", seatNumber(2)],
      ["vortoxRoleTenureId", "role-tenure-v1:seat-02:vortox:revision-000001"],
      ["evaluatedCharacterStateRevision", 2]
    ] as const) {
      expect(validateDreamerInformationDeliveredPayload({
        ...facts.delivery,
        vortoxConstraint: { ...facts.delivery.vortoxConstraint, [field]: value }
      }, input).valid, `vortoxConstraint.${field}`).toBe(false);
    }
    const reversed = v4VortoxFacts([...facts.setup.roleCatalogSnapshot.roles].reverse());
    expect([reversed.delivery.goodRole, reversed.delivery.evilRole])
      .toStrictEqual([facts.delivery.goodRole, facts.delivery.evilRole]);
    const poisoned = { impairments: [{ ...facts.abilityImpairments.impairments[0]!, kind: "POISONED" as const,
      sourceKind: "SNAKE_CHARMER_DEMON_HIT" as const }] } as AbilityImpairmentSet;
    expect(resolveBaseDreamerV2NormalCapability({ opportunity: facts.opportunity, firstNightTaskPlan: facts.plan,
      firstNightTaskProgress: undefined, firstNightActionOpportunities: facts.opportunities,
      currentCharacterState: facts.state, setup: facts.setup, roleTenures: facts.roleTenures,
      abilityImpairments: poisoned })).not.toMatchObject({
        kind: "CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED"
      });
    const duplicate = { impairments: [facts.abilityImpairments.impairments[0]!,
      { ...facts.abilityImpairments.impairments[0]! }] } as AbilityImpairmentSet;
    expect(resolveBaseDreamerV2NormalCapability({ opportunity: facts.opportunity, firstNightTaskPlan: facts.plan,
      firstNightTaskProgress: undefined, firstNightActionOpportunities: facts.opportunities,
      currentCharacterState: facts.state, setup: facts.setup, roleTenures: facts.roleTenures,
      abilityImpairments: duplicate })).toMatchObject({
        kind: "EFFECTIVENESS_UNRESOLVED", reason: "SOURCE_IMPAIRMENT_CONFLICT"
      });
    const conflicting = { impairments: [facts.abilityImpairments.impairments[0]!,
      { ...facts.abilityImpairments.impairments[0]!, impairmentId: abilityImpairmentId("conflicting-poison"),
        kind: "POISONED" as const, sourceKind: "SNAKE_CHARMER_DEMON_HIT" as const }] } as AbilityImpairmentSet;
    expect(resolveBaseDreamerV2NormalCapability({ opportunity: facts.opportunity, firstNightTaskPlan: facts.plan,
      firstNightTaskProgress: undefined, firstNightActionOpportunities: facts.opportunities,
      currentCharacterState: facts.state, setup: facts.setup, roleTenures: facts.roleTenures,
      abilityImpairments: conflicting })).toMatchObject({
        kind: "EFFECTIVENESS_UNRESOLVED", reason: "SOURCE_IMPAIRMENT_CONFLICT"
      });
  });

  it("[2B19A3B1-C08-S09/S10/S11/S14/S17/S18] fails hostile inputs closed and keeps every version clone/equality isolated", () => {
    const { facts, input } = validationInput();
    let getterCalls = 0;
    const topAccessor = structuredClone(facts.delivery) as unknown as Record<string, unknown>;
    Object.defineProperty(topAccessor, "sourceImpairment", { enumerable: true,
      get: () => { getterCalls += 1; throw new Error("getter"); } });
    expect(validateDreamerInformationDeliveredPayload(topAccessor, input).valid).toBe(false);
    const nestedAccessor = structuredClone(facts.delivery) as unknown as Record<string, unknown>;
    Object.defineProperty(nestedAccessor.sourceImpairment as object, "impairmentId", { enumerable: true,
      get: () => { getterCalls += 1; throw new Error("getter"); } });
    expect(validateDreamerInformationDeliveredPayload(nestedAccessor, input).valid).toBe(false);
    expect(getterCalls).toBe(0);
    const throwing = new Proxy(facts.delivery, { ownKeys: () => { throw new Error("proxy"); } });
    expect(validateDreamerInformationDeliveredPayload(throwing, input).valid).toBe(false);
    const revoked = Proxy.revocable(facts.delivery, {}); revoked.revoke();
    expect(validateDreamerInformationDeliveredPayload(revoked.proxy, input).valid).toBe(false);
    const symbol = structuredClone(facts.delivery) as typeof facts.delivery & { [key: symbol]: boolean };
    symbol[Symbol("hidden")] = true;
    expect(validateDreamerInformationDeliveredPayload(symbol, input).valid).toBe(false);
    const cycle = structuredClone(facts.delivery) as unknown as Record<string, unknown>; cycle.self = cycle;
    expect(validateDreamerInformationDeliveredPayload(cycle, input).valid).toBe(false);
    expect(validateDreamerInformationDeliveredPayload(
      Object.assign(Object.create({ inherited: true }) as object, facts.delivery), input
    ).valid).toBe(false);
    const legacy = [storedDelivery(), v3Facts().delivery, v3VortoxFacts().delivery];
    const clones = cloneDreamerInformationSet({ deliveries: [...legacy, facts.delivery] }).deliveries;
    expect(clones).toStrictEqual([...legacy, facts.delivery]);
    expect(clones[3]).not.toBe(facts.delivery);
    expect((clones[3] as typeof facts.delivery).sourceImpairment).not.toBe(facts.delivery.sourceImpairment);
    expect(sameDreamerInformationDelivery(facts.delivery, structuredClone(facts.delivery))).toBe(true);
    expect(sameDreamerInformationDelivery(facts.delivery, {
      ...facts.delivery, evaluatedCharacterStateRevision: facts.delivery.evaluatedCharacterStateRevision + 1
    })).toBe(false);
    for (const prior of legacy) expect(sameDreamerInformationDelivery(facts.delivery, prior)).toBe(false);
  });
});

const dreamerRole = role("dreamer", "TOWNSFOLK", "GOOD");
const philosopherRole = role("philosopher", "TOWNSFOLK", "GOOD");
const flowergirlRole = role("flowergirl", "TOWNSFOLK", "GOOD");
const snakeCharmerRole = role("snake_charmer", "TOWNSFOLK", "GOOD");
const witchRole = role("witch", "MINION", "EVIL");
const fangGuRole = role("fang_gu", "DEMON", "EVIL");
const vortoxRole = role("vortox", "DEMON", "EVIL");

const v3TaskId = scheduledTaskId("first-night-v1:DREAMER_ACTION:seat-01");
const v3TenureId = formatRoleTenureId({ seatNumber: seatNumber(1), roleId: "dreamer", acquiredCharacterStateRevision: 1 });
const v3Opportunity = (): DreamerActionOpportunityV3 => ({
  opportunitySchemaVersion: DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
  nightNumber: 1,
  opportunityId: formatBaseDreamerV2FirstNightActionOpportunityId({ seatNumber: seatNumber(1) }),
  opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V3",
  opportunityStatus: "OPEN",
  taskId: v3TaskId,
  taskType: "DREAMER_ACTION",
  sourcePlayerId: playerId("dreamer-player"),
  sourceSeatNumber: seatNumber(1),
  sourceRole: dreamerRole,
  sourceCharacterStateRevision: 1,
  sourceContract: {
    sourceContractVersion: DREAMER_BASE_SOURCE_CONTRACT_VERSION,
    kind: "BASE",
    taskPlanVersion: "first-night-task-plan-v2",
    taskId: v3TaskId,
    taskType: "DREAMER_ACTION",
    sourcePlayerId: playerId("dreamer-player"),
    sourceSeatNumber: seatNumber(1),
    sourceRoleId: "dreamer",
    sourceRoleTenureId: v3TenureId,
    sourceCharacterStateRevision: 1,
    sourceAbilityInstanceId: formatBaseFirstNightAbilityInstanceId(v3TaskId)
  },
  visibility: {
    visibilitySchemaVersion: DREAMER_V3_VISIBILITY_SCHEMA_VERSION,
    canChooseTarget: true,
    supportedDecisionKinds: ["CHOOSE_PLAYER"],
    futureUnsupportedDecisionKinds: [],
    targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER"
  }
});

const v3Plan = (): FirstNightTaskPlan => ({
  nightNumber: 1,
  taskPlanVersion: "first-night-task-plan-v2",
  taskCatalogVersion: "snv-first-night-task-catalog-v1",
  taskCatalogSignatureAlgorithm: "canonical-first-night-task-catalog-v1",
  taskCatalogSignature: "test",
  taskCatalogSnapshot: {
    taskCatalogVersion: "snv-first-night-task-catalog-v1",
    taskCatalogSignatureAlgorithm: "canonical-first-night-task-catalog-v1",
    taskCatalogSignature: "test",
    definitions: []
  },
  rosterVersion: "test",
  assignmentAlgorithmVersion: "test",
  roleCatalogSignature: "test-signature",
  knowledgeModelVersion: "initial-own-character-knowledge-v1",
  knowledgeStage: "OWN_CHARACTER_BOOTSTRAP",
  tasks: [{
    taskId: v3TaskId,
    taskType: "DREAMER_ACTION",
    taskClass: "ROLE_ACTION",
    orderKey: { baseOrder: 900, insertionOrder: 0 },
    source: { kind: "ROLE", playerId: playerId("dreamer-player"), seatNumber: seatNumber(1), role: dreamerRole },
    status: "PENDING",
    settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT"
  }]
});

const v3State = (targetRole: RoleSetupSnapshot = flowergirlRole): CurrentCharacterStateSet => ({
  revision: 1,
  entries: [
    { playerId: playerId("dreamer-player"), seatNumber: seatNumber(1), role: dreamerRole, currentAlignment: "GOOD" },
    { playerId: playerId("target-player"), seatNumber: seatNumber(2), role: targetRole, currentAlignment: targetRole.defaultAlignment },
    { playerId: playerId("demon-player"), seatNumber: seatNumber(3), role: fangGuRole, currentAlignment: "EVIL" }
  ]
});

const v3Facts = (targetRole: RoleSetupSnapshot = flowergirlRole) => {
  const opportunity = v3Opportunity();
  const state = v3State(targetRole);
  const plan = v3Plan();
  const opportunities = { opportunities: [opportunity] } as const;
  const roster: PlayerRoster = state.entries.map((entry) => ({
    playerId: entry.playerId,
    seatNumber: entry.seatNumber,
    playerKind: entry.playerId === playerId("target-player") ? "AI" : "HUMAN",
    displayName: entry.playerId
  }));
  const roleTenures = { records: [{
    roleTenureId: v3TenureId,
    playerId: playerId("dreamer-player"),
    seatNumber: seatNumber(1),
    roleId: "dreamer",
    acquiredCharacterStateRevision: 1,
    startedBy: {
      kind: "CHARACTERS_ASSIGNED",
      sourceEventId: eventId("event-1"),
      sourceEventSequence: 1,
      characterStateRevision: 1
    }
  }], processedTransitionFactIds: [] } as const;
  const setupFacts = setup([dreamerRole, flowergirlRole, snakeCharmerRole, witchRole, fangGuRole]);
  const choice = createDreamerTargetChosenPayload({ rulesBaselineVersion: "Phase One v2.1", taskId: v3TaskId,
    opportunityId: opportunity.opportunityId, targetPlayerId: playerId("target-player"),
    firstNightActionOpportunities: opportunities, roster, currentCharacterState: state });
  const delivery = createDreamerInformationDeliveredPayload({ rulesBaselineVersion: "Phase One v2.1", targetChoice: choice,
    setup: setupFacts, currentCharacterState: state, effectiveness: { effective: true } });
  return { opportunity, state, plan, opportunities, roster, roleTenures, setup: setupFacts, choice, delivery };
};

const v3VortoxFacts = (targetRole: RoleSetupSnapshot = flowergirlRole) => {
  const opportunity = v3Opportunity();
  const vortoxTenureId = formatRoleTenureId({ seatNumber: seatNumber(3), roleId: "vortox", acquiredCharacterStateRevision: 1 });
  const state: CurrentCharacterStateSet = {
    revision: 1,
    entries: [
      { playerId: playerId("dreamer-player"), seatNumber: seatNumber(1), role: dreamerRole, currentAlignment: "GOOD" },
      { playerId: playerId("target-player"), seatNumber: seatNumber(2), role: targetRole, currentAlignment: targetRole.defaultAlignment },
      { playerId: playerId("demon-player"), seatNumber: seatNumber(3), role: vortoxRole, currentAlignment: "EVIL" }
    ]
  };
  const plan = v3Plan();
  const opportunities = { opportunities: [opportunity] } as const;
  const roleTenures = { records: [
    { roleTenureId: v3TenureId, playerId: playerId("dreamer-player"), seatNumber: seatNumber(1), roleId: "dreamer",
      acquiredCharacterStateRevision: 1, startedBy: { kind: "CHARACTERS_ASSIGNED" as const, sourceEventId: eventId("event-1"), sourceEventSequence: 1, characterStateRevision: 1 } },
    { roleTenureId: vortoxTenureId, playerId: playerId("demon-player"), seatNumber: seatNumber(3), roleId: "vortox",
      acquiredCharacterStateRevision: 1, startedBy: { kind: "CHARACTERS_ASSIGNED" as const, sourceEventId: eventId("event-1"), sourceEventSequence: 1, characterStateRevision: 1 } }
  ], processedTransitionFactIds: [] } as const;
  const setupFacts = setup([dreamerRole, flowergirlRole, snakeCharmerRole, witchRole, vortoxRole]);
  const roster: PlayerRoster = state.entries.map((entry) => ({ playerId: entry.playerId, seatNumber: entry.seatNumber,
    playerKind: "AI", displayName: entry.playerId }));
  const choice = createDreamerTargetChosenPayload({ rulesBaselineVersion: "Phase One v2.1", taskId: v3TaskId,
    opportunityId: opportunity.opportunityId, targetPlayerId: playerId("target-player"),
    firstNightActionOpportunities: opportunities, roster, currentCharacterState: state });
  if (!("targetSchemaVersion" in choice)) throw new Error("Expected V2 target choice");
  const capability = resolveBaseDreamerV2NormalCapability({ opportunity, firstNightTaskPlan: plan,
    firstNightTaskProgress: undefined, firstNightActionOpportunities: opportunities, currentCharacterState: state,
    setup: setupFacts, roleTenures, abilityImpairments: undefined });
  if (capability.kind !== "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED") throw new Error("Expected Vortox capability");
  const delivery = createDreamerVortoxInformationDeliveredPayload({ rulesBaselineVersion: "Phase One v2.1",
    targetChoice: choice, setup: setupFacts, currentCharacterState: state, capability });
  return { opportunity, state, plan, opportunities, roleTenures, setup: setupFacts, roster, choice, capability, delivery };
};

const v4VortoxFacts = (roles?: readonly RoleSetupSnapshot[]) => {
  const base = v3VortoxFacts();
  const setupFacts = setup(roles ?? base.setup.roleCatalogSnapshot.roles);
  const abilityImpairments: AbilityImpairmentSet = { impairments: [{
    impairmentId: abilityImpairmentId("philosopher-seat-04:drunks-dreamer-seat-01"),
    kind: "DRUNK",
    sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
    sourcePlayerId: playerId("philosopher-player"),
    affectedPlayerId: base.opportunity.sourcePlayerId,
    affectedSeatNumber: base.opportunity.sourceSeatNumber,
    affectedRole: dreamerRole,
    chosenRoleId: roleId("dreamer"),
    sourceCharacterStateRevision: 1
  }] };
  const capability = resolveBaseDreamerV2NormalCapability({
    opportunity: base.opportunity,
    firstNightTaskPlan: base.plan,
    firstNightTaskProgress: undefined,
    firstNightActionOpportunities: base.opportunities,
    currentCharacterState: base.state,
    setup: setupFacts,
    roleTenures: base.roleTenures,
    abilityImpairments
  });
  if (capability.kind !== "CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED") {
    throw new Error("Expected canonical-drunk Vortox capability");
  }
  const delivery = createDreamerCanonicalDrunkVortoxInformationDeliveredPayload({
    rulesBaselineVersion: "Phase One v2.1",
    targetChoice: base.choice,
    setup: setupFacts,
    currentCharacterState: base.state,
    capability
  });
  return { ...base, setup: setupFacts, abilityImpairments, capability, delivery };
};

const setup = (roles: readonly RoleSetupSnapshot[]): Pick<GeneratedSetup, "roleCatalogSnapshot"> => ({
  roleCatalogSnapshot: {
    scriptId: "sects-and-violets",
    edition: "sects-and-violets",
    roleCatalogVersion: "snv-role-catalog-v1",
    canonicalSignature: "test-signature",
    roles
  }
});

const gainedDreamerFacts = (withVortox: boolean, targetRole: RoleSetupSnapshot = flowergirlRole) => {
  const taskId = scheduledTaskId("first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-01:from-dreamer");
  const philosopherOpportunityId = actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-01:opportunity-01");
  const grantId = grantedAbilityId("philosopher-grant-v1:seat-01:from-dreamer");
  const abilityInstanceId = formatPhilosopherGainedV2AbilityInstanceId({ taskId, grantId });
  const philosopherTenureId = formatRoleTenureId({
    seatNumber: seatNumber(1),
    roleId: "philosopher",
    acquiredCharacterStateRevision: 1
  });
  const sourceContract = {
    sourceContractVersion: DREAMER_PHILOSOPHER_GAINED_SOURCE_CONTRACT_VERSION,
    kind: "PHILOSOPHER_GAINED_V2",
    taskPlanVersion: "first-night-task-plan-v2",
    schedulingVersion: "philosopher-gained-first-night-scheduling-v2",
    taskId,
    taskType: "DREAMER_ACTION",
    taskSourceKind: "PHILOSOPHER_GAINED_ABILITY",
    sourcePlayerId: playerId("philosopher-player"),
    sourceSeatNumber: seatNumber(1),
    sourceRoleId: "philosopher",
    chosenRoleId: "dreamer",
    sourceRoleTenureId: philosopherTenureId,
    sourceCharacterStateRevision: 1,
    philosopherOpportunityId,
    grantId,
    sourceAbilityInstanceId: abilityInstanceId,
    abilityInstance: {
      provenanceVersion: "first-night-ability-instance-provenance-v1",
      kind: "PHILOSOPHER_GAINED_TASK_V2",
      abilityInstanceId,
      abilityRoleId: "dreamer",
      taskId,
      sourcePlayerId: playerId("philosopher-player"),
      sourceSeatNumber: seatNumber(1),
      philosopherOpportunityId,
      grantId,
      sourceCharacterStateRevision: 1,
      schedulingVersion: "philosopher-gained-first-night-scheduling-v2"
    },
    grantReference: {
      kind: "PHILOSOPHER_GRANT_V1",
      grantId,
      philosopherOpportunityId,
      sourcePlayerId: playerId("philosopher-player"),
      sourceSeatNumber: seatNumber(1),
      sourceRoleId: "philosopher",
      chosenRoleId: "dreamer",
      sourceCharacterStateRevision: 1
    },
    taskInsertionReference: {
      kind: "FIRST_NIGHT_TASK_INSERTION_V2",
      taskId,
      taskPlanVersion: "first-night-task-plan-v2",
      schedulingVersion: "philosopher-gained-first-night-scheduling-v2",
      philosopherOpportunityId,
      grantId,
      sourcePlayerId: playerId("philosopher-player"),
      sourceSeatNumber: seatNumber(1),
      sourceRoleId: "philosopher",
      chosenRoleId: "dreamer",
      sourceCharacterStateRevision: 1
    }
  } as const;
  const opportunity: DreamerActionOpportunityV4 = {
    opportunitySchemaVersion: DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION,
    nightNumber: 1,
    opportunityId: actionOpportunityId(`${taskId}:opportunity-01`),
    opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V4",
    opportunityStatus: "OPEN",
    taskId,
    taskType: "DREAMER_ACTION",
    sourcePlayerId: playerId("philosopher-player"),
    sourceSeatNumber: seatNumber(1),
    sourceRole: philosopherRole,
    sourceCharacterStateRevision: 1,
    sourceContract,
    visibility: {
      visibilitySchemaVersion: DREAMER_V4_VISIBILITY_SCHEMA_VERSION,
      canChooseTarget: true,
      supportedDecisionKinds: ["CHOOSE_PLAYER"],
      futureUnsupportedDecisionKinds: [],
      targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER"
    }
  };
  const demonRole = withVortox ? vortoxRole : fangGuRole;
  const state: CurrentCharacterStateSet = {
    revision: 1,
    entries: [
      { playerId: playerId("philosopher-player"), seatNumber: seatNumber(1), role: philosopherRole,
        currentAlignment: "GOOD" },
      { playerId: playerId("target-player"), seatNumber: seatNumber(2), role: targetRole,
        currentAlignment: targetRole.defaultAlignment },
      { playerId: playerId("demon-player"), seatNumber: seatNumber(3), role: demonRole,
        currentAlignment: "EVIL" }
    ]
  };
  const roster: PlayerRoster = state.entries.map((entry) => ({
    playerId: entry.playerId,
    seatNumber: entry.seatNumber,
    playerKind: "AI",
    displayName: entry.playerId
  }));
  const task = {
    taskId,
    taskType: "DREAMER_ACTION",
    taskClass: "ROLE_ACTION",
    orderKey: { baseOrder: 900, insertionOrder: 1 },
    source: {
      kind: "PHILOSOPHER_GAINED_ABILITY",
      playerId: opportunity.sourcePlayerId,
      seatNumber: opportunity.sourceSeatNumber,
      sourceRole: philosopherRole,
      chosenRole: dreamerRole,
      opportunityId: philosopherOpportunityId,
      sourceCharacterStateRevision: 1
    },
    status: "PENDING",
    settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT"
  } as const;
  const plan: FirstNightTaskPlan = { ...v3Plan(), tasks: [task] };
  const vortoxTenureId = formatRoleTenureId({
    seatNumber: seatNumber(3),
    roleId: "vortox",
    acquiredCharacterStateRevision: 1
  });
  const roleTenures: RoleTenureState = {
    records: [
      {
        roleTenureId: philosopherTenureId,
        playerId: opportunity.sourcePlayerId,
        seatNumber: opportunity.sourceSeatNumber,
        roleId: "philosopher",
        acquiredCharacterStateRevision: 1,
        startedBy: { kind: "CHARACTERS_ASSIGNED", sourceEventId: eventId("event-1"),
          sourceEventSequence: 1, characterStateRevision: 1 }
      },
      ...(withVortox ? [{
        roleTenureId: vortoxTenureId,
        playerId: playerId("demon-player"),
        seatNumber: seatNumber(3),
        roleId: "vortox" as const,
        acquiredCharacterStateRevision: 1,
        startedBy: { kind: "CHARACTERS_ASSIGNED" as const, sourceEventId: eventId("event-1"),
          sourceEventSequence: 1, characterStateRevision: 1 as const }
      }] : [])
    ],
    processedTransitionFactIds: []
  };
  const setupFacts = setup([philosopherRole, dreamerRole, flowergirlRole, snakeCharmerRole, witchRole, demonRole]);
  const opportunities = { opportunities: [opportunity] } as const;
  const choice = createPhilosopherGainedDreamerTargetChosenPayload({
    rulesBaselineVersion: "Phase One v2.1",
    taskId,
    opportunityId: opportunity.opportunityId,
    targetPlayerId: playerId("target-player"),
    firstNightActionOpportunities: opportunities,
    roster,
    currentCharacterState: state
  });
  const capability = resolvePhilosopherGainedDreamerCapability({
    opportunity,
    currentCharacterState: state,
    setup: setupFacts,
    roleTenures,
    abilityImpairments: undefined
  });
  if (capability.kind !== (withVortox
    ? "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED"
    : "NORMAL_INFORMATION_SUPPORTED")) throw new Error("Expected gained Dreamer capability");
  if (capability.kind !== "NORMAL_INFORMATION_SUPPORTED" &&
      capability.kind !== "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED") throw new Error("Expected supported capability");
  const delivery = createPhilosopherGainedDreamerInformationDeliveredPayload({
    rulesBaselineVersion: "Phase One v2.1",
    targetChoice: choice,
    setup: setupFacts,
    currentCharacterState: state,
    capability
  });
  return { taskId, opportunity, opportunities, sourceContract, state, roster, task, plan, roleTenures,
    setup: setupFacts, choice, capability, delivery };
};

const currentState = (targetRole: RoleSetupSnapshot): CurrentCharacterStateSet => ({
  revision: 1,
  entries: [
    {
      playerId: playerId("dreamer-player"),
      seatNumber: seatNumber(1),
      role: dreamerRole,
      currentAlignment: "GOOD"
    },
    {
      playerId: playerId("target-player"),
      seatNumber: seatNumber(2),
      role: targetRole,
      currentAlignment: targetRole.defaultAlignment
    }
  ]
});

const targetChoice = {
  rulesBaselineVersion: "Phase One v2.1",
  nightNumber: 1,
  taskId: scheduledTaskId("first-night-v1:DREAMER_ACTION:seat-01"),
  taskType: "DREAMER_ACTION",
  opportunityId: actionOpportunityId("first-night-v1:DREAMER_ACTION:seat-01:opportunity-01"),
  decisionKind: "CHOOSE_PLAYER",
  sourcePlayerId: playerId("dreamer-player"),
  sourceSeatNumber: seatNumber(1),
  sourceRole: dreamerRole,
  sourceCharacterStateRevision: 1,
  targetPlayerId: playerId("target-player"),
  targetSeatNumber: seatNumber(2)
} as const;

const storedSetup = setup([dreamerRole, flowergirlRole, snakeCharmerRole, witchRole, fangGuRole]);
const storedRoster: PlayerRoster = [
  {
    playerId: targetChoice.sourcePlayerId,
    seatNumber: targetChoice.sourceSeatNumber,
    playerKind: "HUMAN",
    displayName: "Dreamer"
  },
  {
    playerId: targetChoice.targetPlayerId,
    seatNumber: targetChoice.targetSeatNumber,
    playerKind: "AI",
    displayName: "Target"
  }
];
const storedDreamerTask: FirstNightTaskPlan["tasks"][number] = {
  taskId: targetChoice.taskId,
  taskType: "DREAMER_ACTION",
  taskClass: "ROLE_ACTION",
  orderKey: {
    baseOrder: 900,
    insertionOrder: 0
  },
  source: {
    kind: "ROLE",
    playerId: targetChoice.sourcePlayerId,
    seatNumber: targetChoice.sourceSeatNumber,
    role: dreamerRole
  },
  status: "PENDING",
  settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT"
};

type StoredDreamerSourceFacts = Parameters<typeof validateStoredDreamerInformationDelivered>[1];

const storedDelivery = (
  targetRole: RoleSetupSnapshot = flowergirlRole,
  effectiveness: DreamerEffectivenessResult = { effective: true }
): DreamerInformationDeliveredPayload => createDreamerInformationDeliveredPayload({
  rulesBaselineVersion: "Phase One v2.1",
  targetChoice,
  setup: storedSetup,
  currentCharacterState: currentState(targetRole),
  effectiveness
});

const storedSourceFacts = (): StoredDreamerSourceFacts => ({
  rulesBaselineVersion: "Phase One v2.1",
  setup: storedSetup,
  roster: storedRoster,
  firstNightTaskPlan: {
    tasks: [storedDreamerTask]
  },
  choices: {
    choices: [targetChoice]
  },
  settlement: {
    taskId: targetChoice.taskId,
    taskType: "DREAMER_ACTION",
    nightNumber: 1,
    settlementVersion: "scheduled-task-settlement-v1",
    outcomeType: "DREAMER_INFORMATION_DELIVERED",
    characterStateRevision: targetChoice.sourceCharacterStateRevision
  }
});

const expectStoredDeliveryRejected = (
  payload: unknown,
  sourceFacts: StoredDreamerSourceFacts = storedSourceFacts()
): void => {
  const result = validateStoredDreamerInformationDelivered(payload, sourceFacts);
  expect(result.valid).toBe(false);
};

describe("Dreamer information model", () => {
  it("selects the lowest impairmentId using stable string order", () => {
    const abilityImpairments: AbilityImpairmentSet = {
      impairments: [
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:_poisoned"),
          kind: "POISONED",
          sourceKind: "SNAKE_CHARMER_DEMON_HIT",
          sourcePlayerId: playerId("snake-player"),
          affectedPlayerId: playerId("dreamer-player"),
          affectedSeatNumber: seatNumber(1),
          affectedRole: dreamerRole,
          sourceCharacterStateRevision: 1
        },
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:a-drunk"),
          kind: "DRUNK",
          sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
          sourcePlayerId: playerId("philosopher-player"),
          affectedPlayerId: playerId("dreamer-player"),
          affectedSeatNumber: seatNumber(1),
          affectedRole: dreamerRole,
          chosenRoleId: roleId("dreamer"),
          sourceCharacterStateRevision: 1
        },
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:Z-drunk"),
          kind: "DRUNK",
          sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
          sourcePlayerId: playerId("philosopher-player"),
          affectedPlayerId: playerId("dreamer-player"),
          affectedSeatNumber: seatNumber(1),
          affectedRole: dreamerRole,
          chosenRoleId: roleId("dreamer"),
          sourceCharacterStateRevision: 1
        }
      ]
    };

    expect(evaluateDreamerEffectiveness({
      sourcePlayerId: playerId("dreamer-player"),
      abilityImpairments
    })).toStrictEqual({
      effective: false,
      reason: "SOURCE_DRUNK",
      impairmentId: abilityImpairmentId("ability-impairment-v1:Z-drunk"),
      impairmentKind: "DRUNK"
    });
  });

  it("does not use locale-based sorting in the Dreamer domain model", () => {
    const source = readFileSync(new URL("./dreamer.ts", import.meta.url), "utf8");

    expect(source).not.toContain("localeCompare");
    expect(source).not.toContain("Intl.Collator");
  });

  it("[2B19A2-C08] includes a GOOD target current role and lowest EVIL catalog role when effective", () => {
    const payload = createDreamerInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice,
      setup: setup([witchRole, fangGuRole, dreamerRole, flowergirlRole]),
      currentCharacterState: currentState(flowergirlRole),
      effectiveness: { effective: true }
    });

    expect(payload).toMatchObject({
      knowledgeModelVersion: SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
      knowledgeStage: DREAMER_INFORMATION_STAGE,
      informationReliability: { kind: "EFFECTIVE" },
      goodRole: flowergirlRole,
      evilRole: fangGuRole,
      falseRolePolicyVersion: DREAMER_FALSE_ROLE_POLICY_VERSION
    });
  });

  it("[2B19A2-C09] includes an EVIL target current role and lowest GOOD catalog role when effective", () => {
    const payload = createDreamerInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice,
      setup: setup([witchRole, fangGuRole, snakeCharmerRole, flowergirlRole]),
      currentCharacterState: currentState(witchRole),
      effectiveness: { effective: true }
    });

    expect(payload.goodRole).toStrictEqual(flowergirlRole);
    expect(payload.evilRole).toStrictEqual(witchRole);
  });

  it("still delivers canonical unreliable GOOD and EVIL roles when source-impaired", () => {
    const payload = createDreamerInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice,
      setup: setup([witchRole, fangGuRole, snakeCharmerRole, flowergirlRole]),
      currentCharacterState: currentState(witchRole),
      effectiveness: {
        effective: false,
        reason: "SOURCE_POISONED",
        impairmentId: abilityImpairmentId("ability-impairment-v1:_poisoned"),
        impairmentKind: "POISONED"
      }
    });

    expect(payload.informationReliability).toStrictEqual({
      kind: "SOURCE_IMPAIRED",
      reason: "SOURCE_POISONED",
      sourceImpairmentId: abilityImpairmentId("ability-impairment-v1:_poisoned"),
      sourceImpairmentKind: "POISONED"
    });
    expect(payload.goodRole).toStrictEqual(flowergirlRole);
    expect(payload.evilRole).toStrictEqual(fangGuRole);
  });

  it("[2B19A2-C19] throws a DomainError when no deterministic opposite-alignment candidate exists", () => {
    expect(() => createDreamerInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice,
      setup: setup([dreamerRole, flowergirlRole]),
      currentCharacterState: currentState(flowergirlRole),
      effectiveness: { effective: true }
    })).toThrowError(DomainError);
  });

  it("[2B19A2-C10] selects the false role by stable code-unit roleId order", () => {
    const upper = role("Z_minion", "MINION", "EVIL");
    const underscore = role("_minion", "MINION", "EVIL");
    const lower = role("a_minion", "MINION", "EVIL");
    const payload = createDreamerInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice,
      setup: setup([lower, underscore, flowergirlRole, upper]),
      currentCharacterState: currentState(flowergirlRole),
      effectiveness: { effective: true }
    });
    expect(payload.evilRole.roleId).toBe(roleId("Z_minion"));
  });

  it("[2B19A2-C11] is invariant under every selected catalog permutation", () => {
    const roles = [witchRole, fangGuRole, dreamerRole, flowergirlRole] as const;
    const permutations = <T>(values: readonly T[]): T[][] => values.length === 0
      ? [[]]
      : values.flatMap((value, index) => permutations([...values.slice(0, index), ...values.slice(index + 1)])
        .map((suffix) => [value, ...suffix]));
    const pairs = permutations(roles).map((catalog) => {
      const payload = createDreamerInformationDeliveredPayload({ rulesBaselineVersion: "Phase One v2.1", targetChoice,
        setup: setup(catalog), currentCharacterState: currentState(flowergirlRole), effectiveness: { effective: true } });
      return [payload.goodRole.roleId, payload.evilRole.roleId];
    });
    expect(new Set(pairs.map((pair) => JSON.stringify(pair)))).toStrictEqual(new Set([JSON.stringify(["flowergirl", "fang_gu"])]));
  });

  it("[2B19A2-C16] returns the closed represented-POISONED capability branch", () => {
    const facts = v3Facts();
    expect(resolveBaseDreamerV2NormalCapability({
      opportunity: facts.opportunity,
      firstNightTaskPlan: facts.plan,
      firstNightTaskProgress: undefined,
      firstNightActionOpportunities: facts.opportunities,
      currentCharacterState: facts.state,
      setup: facts.setup,
      roleTenures: facts.roleTenures,
      abilityImpairments: { impairments: [{
        impairmentId: abilityImpairmentId("ability-impairment-v1:dreamer-poisoned"),
        kind: "POISONED",
        sourceKind: "SNAKE_CHARMER_DEMON_HIT",
        sourcePlayerId: playerId("snake-charmer-player"),
        affectedPlayerId: playerId("dreamer-player"),
        affectedSeatNumber: seatNumber(1),
        affectedRole: dreamerRole,
        sourceCharacterStateRevision: 1
      }] }
    })).toStrictEqual({
      kind: "SOURCE_REPRESENTED_IMPAIRED",
      impairmentId: abilityImpairmentId("ability-impairment-v1:dreamer-poisoned"),
      impairmentKind: "POISONED"
    });
  });

  it("[2B19A2-C31] produces the same deterministic vector under Windows and Ubuntu CI", () => {
    const facts = v3Facts();
    const vector = (roles: readonly RoleSetupSnapshot[]) => {
      const delivery = createDreamerInformationDeliveredPayload({ rulesBaselineVersion: "Phase One v2.1",
        targetChoice: facts.choice, setup: setup(roles), currentCharacterState: facts.state, effectiveness: { effective: true } });
      return JSON.stringify({ target: delivery.targetPlayerId, good: delivery.goodRole.roleId, evil: delivery.evilRole.roleId });
    };
    expect(vector([witchRole, fangGuRole, dreamerRole, flowergirlRole, snakeCharmerRole]))
      .toBe('{"target":"target-player","good":"flowergirl","evil":"fang_gu"}');
    expect(vector([snakeCharmerRole, flowergirlRole, dreamerRole, fangGuRole, witchRole]))
      .toBe('{"target":"target-player","good":"flowergirl","evil":"fang_gu"}');
  });

  it("[2B19A2-S01] rejects exhaustive V2 target, delivery, reliability, and source-contract shape mutations", () => {
    const facts = v3Facts();
    const targetInput = {
      taskId: v3TaskId,
      firstNightTaskPlan: facts.plan,
      firstNightTaskProgress: undefined,
      currentCharacterState: facts.state,
      firstNightActionOpportunities: facts.opportunities,
      roster: facts.roster
    };
    expect(validateDreamerTargetChosenPayload(facts.choice, targetInput)).toStrictEqual({ valid: true });
    const deliveryInput = {
      choices: { choices: [facts.choice] }, deliveries: undefined, setup: facts.setup,
      currentCharacterState: facts.state, abilityImpairments: undefined,
      firstNightActionOpportunities: facts.opportunities, firstNightTaskPlan: facts.plan,
      roleTenures: facts.roleTenures
    };
    expect(validateDreamerInformationDeliveredPayload(facts.delivery, deliveryInput)).toStrictEqual({ valid: true });

    for (const key of Object.keys(facts.choice)) {
      const copy = { ...facts.choice } as Record<string, unknown>;
      delete copy[key];
      expect(validateDreamerTargetChosenPayload(copy, targetInput).valid, `target missing ${key}`).toBe(false);
    }
    for (const key of Object.keys(facts.delivery)) {
      const copy = { ...facts.delivery } as Record<string, unknown>;
      delete copy[key];
      expect(validateDreamerInformationDeliveredPayload(copy, deliveryInput).valid, `delivery missing ${key}`).toBe(false);
    }
    for (const key of Object.keys(facts.opportunity.sourceContract)) {
      const sourceContract = { ...facts.opportunity.sourceContract } as Record<string, unknown>;
      delete sourceContract[key];
      expect(validateDreamerTargetChosenPayload({ ...facts.choice, sourceContract }, targetInput).valid,
        `target sourceContract missing ${key}`).toBe(false);
      expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, sourceContract }, deliveryInput).valid,
        `delivery sourceContract missing ${key}`).toBe(false);
    }
    expect(validateDreamerTargetChosenPayload({ ...facts.choice, extra: true }, targetInput).valid).toBe(false);
    expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, extra: true }, deliveryInput).valid).toBe(false);
    expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery,
      informationReliability: { kind: "EFFECTIVE", extra: true } }, deliveryInput).valid).toBe(false);
    expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery,
      informationReliability: { kind: "SOURCE_IMPAIRED" } }, deliveryInput).valid).toBe(false);

    const wrongType = (value: unknown): unknown => typeof value === "string"
      ? 0
      : typeof value === "number"
      ? "wrong-type"
      : typeof value === "boolean"
      ? "wrong-type"
      : "wrong-type";
    for (const key of Object.keys(facts.choice)) {
      const copy = { ...facts.choice, [key]: wrongType((facts.choice as unknown as Record<string, unknown>)[key]) };
      expect(validateDreamerTargetChosenPayload(copy, targetInput).valid, `target wrong type ${key}`).toBe(false);
    }
    for (const key of Object.keys(facts.delivery)) {
      const copy = { ...facts.delivery, [key]: wrongType((facts.delivery as unknown as Record<string, unknown>)[key]) };
      expect(validateDreamerInformationDeliveredPayload(copy, deliveryInput).valid, `delivery wrong type ${key}`).toBe(false);
    }

    const targetWrongLiterals: Readonly<Record<string, unknown>> = {
      targetSchemaVersion: "dreamer-target-chosen-v1",
      nightNumber: 2,
      taskType: "WITCH_ACTION",
      opportunitySchemaVersion: "dreamer-first-night-action-opportunity-v2",
      decisionKind: "DEFER"
    };
    for (const [key, value] of Object.entries(targetWrongLiterals)) {
      expect(validateDreamerTargetChosenPayload({ ...facts.choice, [key]: value }, targetInput).valid,
        `target wrong literal ${key}`).toBe(false);
    }
    const deliveryWrongLiterals: Readonly<Record<string, unknown>> = {
      deliverySchemaVersion: "dreamer-information-delivered-v1",
      nightNumber: 2,
      taskType: "WITCH_ACTION",
      opportunitySchemaVersion: "dreamer-first-night-action-opportunity-v2",
      knowledgeModelVersion: "dreamer-information-model-v2",
      knowledgeStage: "DREAMER_TRUTH",
      falseRolePolicyVersion: "dreamer-false-role-policy-v2"
    };
    for (const [key, value] of Object.entries(deliveryWrongLiterals)) {
      expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, [key]: value }, deliveryInput).valid,
        `delivery wrong literal ${key}`).toBe(false);
    }

    for (const key of Object.keys(facts.opportunity.sourceContract)) {
      const sourceContract = {
        ...facts.opportunity.sourceContract,
        [key]: wrongType((facts.opportunity.sourceContract as unknown as Record<string, unknown>)[key])
      };
      expect(validateDreamerTargetChosenPayload({ ...facts.choice, sourceContract }, targetInput).valid,
        `target sourceContract wrong type ${key}`).toBe(false);
      expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, sourceContract }, deliveryInput).valid,
        `delivery sourceContract wrong type ${key}`).toBe(false);
    }
    const sourceContractWrongLiterals: Readonly<Record<string, unknown>> = {
      sourceContractVersion: "dreamer-base-source-contract-v2",
      kind: "PHILOSOPHER_GAINED",
      taskPlanVersion: "first-night-task-plan-v1",
      taskType: "WITCH_ACTION",
      sourceRoleId: "artist",
      sourceRoleTenureId: "role-tenure-v1:seat-02:role-dreamer:acquired-revision-1",
      sourceAbilityInstanceId: "first-night-ability-instance-v1:BASE:task-invalid"
    };
    for (const [key, value] of Object.entries(sourceContractWrongLiterals)) {
      const sourceContract = { ...facts.opportunity.sourceContract, [key]: value };
      expect(validateDreamerTargetChosenPayload({ ...facts.choice, sourceContract }, targetInput).valid,
        `target sourceContract wrong literal ${key}`).toBe(false);
      expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, sourceContract }, deliveryInput).valid,
        `delivery sourceContract wrong literal ${key}`).toBe(false);
    }

    const reliabilityMatrix: readonly unknown[] = [
      null,
      [],
      {},
      { kind: 1 },
      { kind: "UNRELIABLE" },
      { kind: "EFFECTIVE", extra: true },
      { kind: "SOURCE_IMPAIRED" },
      {
        kind: "SOURCE_IMPAIRED",
        reason: "SOURCE_DRUNK",
        sourceImpairmentId: "ability-impairment-v1:test",
        sourceImpairmentKind: "DRUNK"
      },
      {
        kind: "SOURCE_IMPAIRED",
        reason: "SOURCE_POISONED",
        sourceImpairmentId: "ability-impairment-v1:test",
        sourceImpairmentKind: "POISONED"
      }
    ];
    for (const informationReliability of reliabilityMatrix) {
      expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, informationReliability }, deliveryInput).valid)
        .toBe(false);
    }

    let getterCalls = 0;
    const accessor = <T extends object>(value: T, key: keyof T): T => {
      const copy = { ...value };
      const captured = copy[key];
      Object.defineProperty(copy, key, {
        enumerable: true,
        get: () => {
          getterCalls += 1;
          return captured;
        }
      });
      return copy;
    };
    const withEnumerableSymbol = <T extends object>(value: T): T => {
      const copy = { ...value };
      Object.defineProperty(copy, Symbol("hostile"), { enumerable: true, value: true });
      return copy;
    };
    const withCycle = <T extends object>(value: T): T => {
      const copy = { ...value } as T & { cycle?: unknown };
      copy.cycle = copy;
      return copy;
    };
    const throwingProxy = <T extends object>(value: T): T => new Proxy({ ...value }, {
      ownKeys: () => { throw new Error("hostile ownKeys"); }
    });
    const getThrowingProxy = <T extends object>(value: T): T => new Proxy({ ...value }, {
      get: () => { throw new Error("hostile get"); }
    });
    const revokedTarget = Proxy.revocable({ ...facts.choice }, {});
    revokedTarget.revoke();
    const revokedDelivery = Proxy.revocable({ ...facts.delivery }, {});
    revokedDelivery.revoke();
    const targetHostiles: readonly unknown[] = [
      throwingProxy(facts.choice),
      getThrowingProxy(facts.choice),
      revokedTarget.proxy,
      accessor(facts.choice, "targetPlayerId"),
      { ...facts.choice, sourceContract: accessor(facts.opportunity.sourceContract, "kind") },
      withEnumerableSymbol(facts.choice),
      withCycle(facts.choice),
      Object.assign(new (class NonPlainTarget {})(), facts.choice)
    ];
    const deliveryHostiles: readonly unknown[] = [
      throwingProxy(facts.delivery),
      getThrowingProxy(facts.delivery),
      revokedDelivery.proxy,
      accessor(facts.delivery, "targetPlayerId"),
      { ...facts.delivery, informationReliability: accessor(facts.delivery.informationReliability, "kind") },
      withEnumerableSymbol(facts.delivery),
      withCycle(facts.delivery),
      Object.assign(new (class NonPlainDelivery {})(), facts.delivery)
    ];
    for (const hostile of targetHostiles) {
      expect(() => validateDreamerTargetChosenPayload(hostile, targetInput)).not.toThrow();
      expect(validateDreamerTargetChosenPayload(hostile, targetInput).valid).toBe(false);
    }
    for (const hostile of deliveryHostiles) {
      expect(() => validateDreamerInformationDeliveredPayload(hostile, deliveryInput)).not.toThrow();
      expect(validateDreamerInformationDeliveredPayload(hostile, deliveryInput).valid).toBe(false);
    }
    expect(getterCalls).toBe(0);
  });

  it.each([
    ["effective GOOD target", flowergirlRole, { effective: true }],
    ["effective EVIL target", witchRole, { effective: true }],
    [
      "source-impaired target",
      witchRole,
      {
        effective: false,
        reason: "SOURCE_POISONED",
        impairmentId: abilityImpairmentId("ability-impairment-v1:stored-poisoned"),
        impairmentKind: "POISONED"
      }
    ]
  ] as const)("validates a stored %s delivery from historical facts", (_name, targetRole, effectiveness) => {
    expect(validateStoredDreamerInformationDelivered(
      storedDelivery(targetRole, effectiveness),
      storedSourceFacts()
    )).toStrictEqual({ valid: true });
  });

  it.each([
    ["null", null],
    ["array", []],
    ["Date instance", new Date("2026-07-10T00:00:00.000Z")],
    ["class instance", new (class StoredDelivery {})()]
  ])("rejects a stored Dreamer delivery that is a non-plain %s", (_name, payload) => {
    expectStoredDeliveryRejected(payload);
  });

  it.each([
    "correctRoleId",
    "targetTrueRole",
    "targetAlignment",
    "storytellerNotes"
  ])("rejects stored Dreamer delivery hidden field %s", (field) => {
    const payload = storedDelivery();
    expectStoredDeliveryRejected({
      ...payload,
      [field]: "hidden"
    });
  });

  const payloadTamperingCases: readonly [
    string,
    (payload: DreamerInformationDeliveredPayload) => unknown
  ][] = [
    ["unsupported knowledge model", (payload) => ({ ...payload, knowledgeModelVersion: "dreamer-information-model-v2" })],
    ["unsupported knowledge stage", (payload) => ({ ...payload, knowledgeStage: "DREAMER_TRUTH" })],
    ["unsupported false-role policy", (payload) => ({ ...payload, falseRolePolicyVersion: "dreamer-false-role-policy-v2" })],
    ["extra reliability field", (payload) => ({
      ...payload,
      informationReliability: { ...payload.informationReliability, storytellerNotes: "hidden" }
    })],
    ["invalid reliability discriminant", (payload) => ({
      ...payload,
      informationReliability: { kind: "UNRELIABLE" }
    })],
    ["mismatched impaired reliability union", (payload) => ({
      ...payload,
      informationReliability: {
        kind: "SOURCE_IMPAIRED",
        reason: "SOURCE_DRUNK",
        sourceImpairmentId: abilityImpairmentId("ability-impairment-v1:mismatch"),
        sourceImpairmentKind: "POISONED"
      }
    })],
    ["extra GOOD role field", (payload) => ({
      ...payload,
      goodRole: { ...payload.goodRole, correctRoleId: payload.goodRole.roleId }
    })],
    ["extra EVIL role field", (payload) => ({
      ...payload,
      evilRole: { ...payload.evilRole, storytellerNotes: "hidden" }
    })],
    ["GOOD role with EVIL alignment", (payload) => ({ ...payload, goodRole: payload.evilRole })],
    ["EVIL role with GOOD alignment", (payload) => ({ ...payload, evilRole: payload.goodRole })],
    ["GOOD role catalog mismatch", (payload) => ({
      ...payload,
      goodRole: { ...payload.goodRole, edition: "tampered-edition" }
    })],
    ["EVIL role catalog mismatch", (payload) => ({
      ...payload,
      evilRole: { ...payload.evilRole, edition: "tampered-edition" }
    })]
  ];

  it.each(payloadTamperingCases)("rejects stored Dreamer payload tampering: %s", (_name, tamper) => {
    expectStoredDeliveryRejected(tamper(storedDelivery()));
  });

  const sourceFactTamperingCases: readonly [
    string,
    (sourceFacts: StoredDreamerSourceFacts) => StoredDreamerSourceFacts
  ][] = [
    ["rules baseline mismatch", (sourceFacts) => ({ ...sourceFacts, rulesBaselineVersion: "Phase One v2.0" })],
    ["missing planned task", (sourceFacts) => ({
      ...sourceFacts,
      firstNightTaskPlan: { tasks: [] }
    })],
    ["duplicate planned task", (sourceFacts) => ({
      ...sourceFacts,
      firstNightTaskPlan: { tasks: [storedDreamerTask, storedDreamerTask] }
    })],
    ["wrong planned task type", (sourceFacts) => ({
      ...sourceFacts,
      firstNightTaskPlan: {
        tasks: [{ ...storedDreamerTask, taskType: "WITCH_ACTION" }]
      }
    } as unknown as StoredDreamerSourceFacts)],
    ["wrong planned task source", (sourceFacts) => ({
      ...sourceFacts,
      firstNightTaskPlan: {
        tasks: [{
          ...storedDreamerTask,
          source: {
            ...storedDreamerTask.source,
            playerId: playerId("different-source")
          }
        }]
      }
    })],
    ["missing roster target", (sourceFacts) => ({
      ...sourceFacts,
      roster: sourceFacts.roster.filter((entry) => entry.playerId !== targetChoice.targetPlayerId)
    })],
    ["missing target choice", (sourceFacts) => ({ ...sourceFacts, choices: undefined })],
    ["duplicate target choice", (sourceFacts) => ({
      ...sourceFacts,
      choices: { choices: [targetChoice, targetChoice] }
    })],
    ["target choice extra field", (sourceFacts) => ({
      ...sourceFacts,
      choices: {
        choices: [{ ...targetChoice, targetTrueRole: flowergirlRole }]
      }
    } as unknown as StoredDreamerSourceFacts)],
    ["missing settlement", (sourceFacts) => ({ ...sourceFacts, settlement: undefined })],
    ["settlement extra field", (sourceFacts) => ({
      ...sourceFacts,
      settlement: { ...sourceFacts.settlement, storytellerNotes: "hidden" }
    } as unknown as StoredDreamerSourceFacts)],
    ["wrong settlement task id", (sourceFacts) => ({
      ...sourceFacts,
      settlement: { ...sourceFacts.settlement!, taskId: scheduledTaskId("wrong-task") }
    })],
    ["wrong settlement task type", (sourceFacts) => ({
      ...sourceFacts,
      settlement: { ...sourceFacts.settlement!, taskType: "WITCH_ACTION" }
    } as unknown as StoredDreamerSourceFacts)],
    ["wrong settlement outcome", (sourceFacts) => ({
      ...sourceFacts,
      settlement: { ...sourceFacts.settlement!, outcomeType: "WITCH_INEFFECTIVE" }
    })],
    ["wrong settlement revision", (sourceFacts) => ({
      ...sourceFacts,
      settlement: { ...sourceFacts.settlement!, characterStateRevision: 2 }
    })],
    ["wrong settlement version", (sourceFacts) => ({
      ...sourceFacts,
      settlement: { ...sourceFacts.settlement!, settlementVersion: "scheduled-task-settlement-v2" }
    } as unknown as StoredDreamerSourceFacts)],
    ["wrong settlement night", (sourceFacts) => ({
      ...sourceFacts,
      settlement: { ...sourceFacts.settlement!, nightNumber: 2 }
    } as unknown as StoredDreamerSourceFacts)]
  ];

  it.each(sourceFactTamperingCases)("rejects stored Dreamer source-fact tampering: %s", (_name, tamper) => {
    expectStoredDeliveryRejected(storedDelivery(), tamper(storedSourceFacts()));
  });
});

describe("Phase 3 Slice 2B19B gained Dreamer target and delivery contracts", () => {
  const targetInput = (facts: ReturnType<typeof gainedDreamerFacts>) => ({
    taskId: facts.taskId,
    firstNightTaskPlan: facts.plan,
    firstNightTaskProgress: undefined,
    currentCharacterState: facts.state,
    firstNightActionOpportunities: facts.opportunities,
    roster: facts.roster
  });
  const deliveryInput = (facts: ReturnType<typeof gainedDreamerFacts>) => ({
    choices: { choices: [facts.choice] },
    deliveries: undefined,
    setup: facts.setup,
    currentCharacterState: facts.state,
    abilityImpairments: undefined,
    firstNightActionOpportunities: facts.opportunities,
    firstNightTaskPlan: facts.plan,
    roleTenures: facts.roleTenures
  });

  it("[2B19B-C07/C08/C21/C22/C23/C24/C25/C26/C27/C28/C29/C55/C56-S07/S08/S09/S10/S11/S13/S16] validates exact V3/V5/V6 payloads and deterministic native categories", () => {
    const normalGood = gainedDreamerFacts(false, flowergirlRole);
    const normalEvil = gainedDreamerFacts(false, witchRole);
    const vortoxGood = gainedDreamerFacts(true, flowergirlRole);
    const vortoxEvil = gainedDreamerFacts(true, witchRole);
    expect(Object.keys(normalGood.choice)).toHaveLength(17);
    expect(Object.keys(normalGood.delivery)).toHaveLength(21);
    expect(Object.keys(vortoxGood.delivery)).toHaveLength(22);
    expect(validateDreamerTargetChosenPayload(normalGood.choice, targetInput(normalGood))).toStrictEqual({ valid: true });
    for (const facts of [normalGood, normalEvil, vortoxGood, vortoxEvil]) {
      expect(validateDreamerInformationDeliveredPayload(facts.delivery, deliveryInput(facts))).toStrictEqual({ valid: true });
    }
    expect(normalGood.delivery.deliverySchemaVersion).toBe("dreamer-information-delivered-v5");
    expect(normalGood.delivery.goodRole.roleId).toBe(flowergirlRole.roleId);
    expect(normalEvil.delivery.evilRole.roleId).toBe(witchRole.roleId);
    expect(vortoxGood.delivery.deliverySchemaVersion).toBe("dreamer-information-delivered-v6");
    expect([vortoxGood.delivery.goodRole.roleId, vortoxGood.delivery.evilRole.roleId]).not.toContain(flowergirlRole.roleId);
    expect([vortoxEvil.delivery.goodRole.roleId, vortoxEvil.delivery.evilRole.roleId]).not.toContain(witchRole.roleId);
    expect(vortoxGood.delivery.goodRole.characterType).toMatch(/^(TOWNSFOLK|OUTSIDER)$/u);
    expect(vortoxGood.delivery.evilRole.characterType).toMatch(/^(MINION|DEMON)$/u);

    for (const key of Object.keys(normalGood.choice)) {
      const missing = structuredClone(normalGood.choice) as unknown as Record<string, unknown>;
      delete missing[key];
      expect(validateDreamerTargetChosenPayload(missing, targetInput(normalGood)).valid, `target.${key}`).toBe(false);
    }
    expect(validateDreamerTargetChosenPayload({ ...normalGood.choice, extra: true }, targetInput(normalGood)).valid).toBe(false);

    for (const facts of [normalGood, vortoxGood]) {
      for (const key of Object.keys(facts.delivery)) {
        const missing = structuredClone(facts.delivery) as unknown as Record<string, unknown>;
        delete missing[key];
        expect(validateDreamerInformationDeliveredPayload(missing, deliveryInput(facts)).valid,
          `${facts.delivery.deliverySchemaVersion}.${key}`).toBe(false);
      }
      expect(validateDreamerInformationDeliveredPayload({ ...facts.delivery, extra: true }, deliveryInput(facts)).valid).toBe(false);
      for (const roleKey of Object.keys(facts.delivery.goodRole)) {
        const payload = structuredClone(facts.delivery) as unknown as Record<string, unknown>;
        delete (payload.goodRole as Record<string, unknown>)[roleKey];
        expect(validateDreamerInformationDeliveredPayload(payload, deliveryInput(facts)).valid,
          `${facts.delivery.deliverySchemaVersion}.goodRole.${roleKey}`).toBe(false);
      }
    }

    expect(validateDreamerInformationDeliveredPayload({
      ...normalGood.delivery,
      deliverySchemaVersion: "dreamer-information-delivered-v6"
    }, deliveryInput(normalGood)).valid).toBe(false);
    expect(validateDreamerInformationDeliveredPayload({
      ...vortoxGood.delivery,
      deliverySchemaVersion: "dreamer-information-delivered-v5"
    }, deliveryInput(vortoxGood)).valid).toBe(false);
    expect(validateDreamerTargetChosenPayload(v3Facts().choice, targetInput(normalGood)).valid).toBe(false);
    expect(validateDreamerTargetChosenPayload(normalGood.choice, {
      ...targetInput(normalGood), taskId: v3TaskId, firstNightTaskPlan: v3Plan()
    }).valid).toBe(false);

    const reversed = gainedDreamerFacts(true, flowergirlRole);
    const reverseSetup = setup([...reversed.setup.roleCatalogSnapshot.roles].reverse());
    const reverseDelivery = createPhilosopherGainedDreamerInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice: reversed.choice,
      setup: reverseSetup,
      currentCharacterState: reversed.state,
      capability: reversed.capability
    });
    expect([reverseDelivery.goodRole, reverseDelivery.evilRole])
      .toStrictEqual([reversed.delivery.goodRole, reversed.delivery.evilRole]);
    const starved = setup([philosopherRole, dreamerRole, flowergirlRole]);
    expect(() => createPhilosopherGainedDreamerInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice: normalGood.choice,
      setup: starved,
      currentCharacterState: normalGood.state,
      capability: normalGood.capability
    })).toThrowError(DomainError);
  });

  it("[2B19B-C19/C20] uses settlement-time target truth and rejects a represented Traveller policy input", () => {
    const opened = gainedDreamerFacts(false, flowergirlRole);
    const changedState: CurrentCharacterStateSet = {
      revision: 2,
      entries: opened.state.entries.map((entry) => entry.playerId === opened.choice.targetPlayerId
        ? { ...entry, role: witchRole, currentAlignment: "EVIL" }
        : entry)
    };
    const changedChoice = createPhilosopherGainedDreamerTargetChosenPayload({
      rulesBaselineVersion: "Phase One v2.1",
      taskId: opened.taskId,
      opportunityId: opened.opportunity.opportunityId,
      targetPlayerId: opened.choice.targetPlayerId,
      firstNightActionOpportunities: opened.opportunities,
      roster: opened.roster,
      currentCharacterState: changedState
    });
    const changedCapability = resolvePhilosopherGainedDreamerCapability({
      opportunity: opened.opportunity,
      currentCharacterState: changedState,
      setup: opened.setup,
      roleTenures: opened.roleTenures,
      abilityImpairments: undefined
    });
    if (changedCapability.kind !== "NORMAL_INFORMATION_SUPPORTED") throw new Error("Expected changed-state capability");
    const changedDelivery = createPhilosopherGainedDreamerInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice: changedChoice,
      setup: opened.setup,
      currentCharacterState: changedState,
      capability: changedCapability
    });
    expect(changedDelivery.evilRole.roleId).toBe(witchRole.roleId);
    expect(changedDelivery.evaluatedCharacterStateRevision).toBe(2);

    const representedTraveller = {
      ...flowergirlRole,
      roleId: roleId("represented_traveller"),
      characterType: "TRAVELLER"
    } as unknown as RoleSetupSnapshot;
    const travellerState: CurrentCharacterStateSet = {
      ...opened.state,
      entries: opened.state.entries.map((entry) => entry.playerId === opened.choice.targetPlayerId
        ? { ...entry, role: representedTraveller }
        : entry)
    };
    const travellerSetup = setup([...opened.setup.roleCatalogSnapshot.roles, representedTraveller]);
    const travellerChoice = createPhilosopherGainedDreamerTargetChosenPayload({
      rulesBaselineVersion: "Phase One v2.1",
      taskId: opened.taskId,
      opportunityId: opened.opportunity.opportunityId,
      targetPlayerId: opened.choice.targetPlayerId,
      firstNightActionOpportunities: opened.opportunities,
      roster: opened.roster,
      currentCharacterState: travellerState
    });
    const travellerCapability = resolvePhilosopherGainedDreamerCapability({
      opportunity: opened.opportunity,
      currentCharacterState: travellerState,
      setup: travellerSetup,
      roleTenures: opened.roleTenures,
      abilityImpairments: undefined
    });
    if (travellerCapability.kind !== "NORMAL_INFORMATION_SUPPORTED") throw new Error("Expected Traveller seam capability");
    expect(() => createPhilosopherGainedDreamerInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice: travellerChoice,
      setup: travellerSetup,
      currentCharacterState: travellerState,
      capability: travellerCapability
    })).toThrowError(DomainError);
  });

  it("[2B19B-C30/C31/C32/C33/C34/C35/C36-S12] fails hostile data and unsupported capability contexts closed", () => {
    const normal = gainedDreamerFacts(false);
    const vortox = gainedDreamerFacts(true);
    let getterCalls = 0;
    const accessor = (value: object, key: string): unknown => {
      const copy = structuredClone(value) as Record<string, unknown>;
      Object.defineProperty(copy, key, { enumerable: true, get: () => {
        getterCalls += 1;
        throw new Error("getter");
      } });
      return copy;
    };
    const hostile = (value: object): readonly unknown[] => {
      const throwing = new Proxy(value, { ownKeys: () => { throw new Error("proxy"); } });
      const revoked = Proxy.revocable(value, {}); revoked.revoke();
      const symbol = structuredClone(value);
      Object.defineProperty(symbol, Symbol("hidden"), { enumerable: true, value: true });
      const cycle = structuredClone(value) as Record<string, unknown>; cycle.self = cycle;
      const nonplain = Object.assign(Object.create({ inherited: true }) as object, value);
      return [throwing, revoked.proxy, symbol, cycle, nonplain];
    };
    for (const payload of [...hostile(normal.choice), accessor(normal.choice, "sourceContract")]) {
      expect(validateDreamerTargetChosenPayload(payload, targetInput(normal)).valid).toBe(false);
    }
    for (const payload of [...hostile(vortox.delivery), accessor(vortox.delivery, "sourceContract")]) {
      expect(validateDreamerInformationDeliveredPayload(payload, deliveryInput(vortox)).valid).toBe(false);
    }
    const nested = structuredClone(vortox.delivery) as unknown as Record<string, unknown>;
    Object.defineProperty(nested.sourceContract as object, "kind", { enumerable: true, get: () => {
      getterCalls += 1;
      throw new Error("getter");
    } });
    expect(validateDreamerInformationDeliveredPayload(nested, deliveryInput(vortox)).valid).toBe(false);
    expect(getterCalls).toBe(0);

    const sourceImpairment = (kind: "DRUNK" | "POISONED"): AbilityImpairmentSet => ({ impairments: [{
      impairmentId: abilityImpairmentId(`philosopher-${kind.toLowerCase()}`),
      kind,
      sourceKind: kind === "DRUNK" ? "PHILOSOPHER_CHOSEN_DUPLICATE" : "SNAKE_CHARMER_DEMON_HIT",
      sourcePlayerId: playerId("impairment-source"),
      affectedPlayerId: normal.opportunity.sourcePlayerId,
      affectedSeatNumber: normal.opportunity.sourceSeatNumber,
      affectedRole: philosopherRole,
      ...(kind === "DRUNK" ? { chosenRoleId: roleId("philosopher") } : {}),
      sourceCharacterStateRevision: 1
    }] } as AbilityImpairmentSet);
    for (const kind of ["DRUNK", "POISONED"] as const) {
      expect(resolvePhilosopherGainedDreamerCapability({ opportunity: normal.opportunity,
        currentCharacterState: normal.state, setup: normal.setup, roleTenures: normal.roleTenures,
        abilityImpairments: sourceImpairment(kind) })).toMatchObject({ kind: "SOURCE_REPRESENTED_IMPAIRED" });
    }
    const impairedVortox: AbilityImpairmentSet = { impairments: [{
      impairmentId: abilityImpairmentId("vortox-poisoned"),
      kind: "POISONED",
      sourceKind: "SNAKE_CHARMER_DEMON_HIT",
      sourcePlayerId: playerId("snake-player"),
      affectedPlayerId: playerId("demon-player"),
      affectedSeatNumber: seatNumber(3),
      affectedRole: vortoxRole,
      sourceCharacterStateRevision: 1
    }] };
    expect(resolvePhilosopherGainedDreamerCapability({ opportunity: vortox.opportunity,
      currentCharacterState: vortox.state, setup: vortox.setup, roleTenures: vortox.roleTenures,
      abilityImpairments: impairedVortox })).toMatchObject({ kind: "EFFECTIVENESS_UNRESOLVED" });
    const missingTenure = { ...normal.roleTenures, records: [] };
    expect(resolvePhilosopherGainedDreamerCapability({ opportunity: normal.opportunity,
      currentCharacterState: normal.state, setup: normal.setup, roleTenures: missingTenure,
      abilityImpairments: undefined })).toMatchObject({ kind: "EFFECTIVENESS_UNRESOLVED" });
  });

  it("[2B19B-S14/S15] deep-clones gained target and deliveries and compares every delivery field", () => {
    const normal = gainedDreamerFacts(false);
    const vortox = gainedDreamerFacts(true);
    const choiceClone = cloneDreamerTargetChoiceSet({ choices: [normal.choice] }).choices[0];
    const deliveryClones = cloneDreamerInformationSet({ deliveries: [normal.delivery, vortox.delivery] }).deliveries;
    expect(choiceClone).toStrictEqual(normal.choice);
    expect(choiceClone).not.toBe(normal.choice);
    expect(deliveryClones).toStrictEqual([normal.delivery, vortox.delivery]);
    expect(deliveryClones[0]).not.toBe(normal.delivery);
    expect(deliveryClones[1]).not.toBe(vortox.delivery);
    expect(sameDreamerInformationDelivery(normal.delivery, structuredClone(normal.delivery))).toBe(true);
    expect(sameDreamerInformationDelivery(vortox.delivery, structuredClone(vortox.delivery))).toBe(true);
    for (const delivery of [normal.delivery, vortox.delivery]) {
      for (const key of Object.keys(delivery)) {
        const mutated = structuredClone(delivery) as unknown as Record<string, unknown>;
        const original = mutated[key];
        mutated[key] = typeof original === "number" ? original + 1
          : typeof original === "string" ? `${original}-mutated`
            : key === "sourceContract"
              ? { ...(original as Record<string, unknown>), sourceCharacterStateRevision: 2 }
              : key === "informationReliability"
                ? { ...(original as Record<string, unknown>), kind: "mutated" }
                : key === "vortoxConstraint"
                  ? { ...(original as Record<string, unknown>), evaluatedCharacterStateRevision: 2 }
                  : { ...(original as Record<string, unknown>), roleId: roleId("mutated") };
        expect(sameDreamerInformationDelivery(delivery, mutated as never),
          `${delivery.deliverySchemaVersion}.${key}`).toBe(false);
      }
    }
  });
});
