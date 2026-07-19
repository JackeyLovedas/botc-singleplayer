import { describe, expect, it } from "vitest";
import {
  DREAMER_BASE_SOURCE_CONTRACT_VERSION,
  DREAMER_PHILOSOPHER_GAINED_SOURCE_CONTRACT_VERSION,
  DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION,
  DREAMER_V2_VISIBILITY_SCHEMA_VERSION,
  DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
  DREAMER_V3_VISIBILITY_SCHEMA_VERSION,
  DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION,
  DREAMER_V4_VISIBILITY_SCHEMA_VERSION,
  cloneFirstNightActionOpportunityState,
  formatBaseDreamerV2FirstNightActionOpportunityId,
  hasExactPhilosopherGainedDreamerSourceContractV1Shape,
  parseBaseDreamerV2FirstNightActionOpportunityId,
  sameOpportunityCore,
  validateFirstNightActionOpportunityStateShape
} from "./first-night-action-opportunity.js";
import type {
  DreamerActionOpportunityV2,
  DreamerActionOpportunityV3,
  DreamerActionOpportunityV4
} from "./first-night-action-opportunity.js";
import {
  formatBaseFirstNightAbilityInstanceId,
  formatPhilosopherGainedV2AbilityInstanceId,
  parseFirstNightAbilityInstanceId
} from "./first-night-ability-outcome-ledger.js";
import { actionOpportunityId, grantedAbilityId, playerId, roleId, scheduledTaskId } from "./ids.js";
import {
  formatPhilosopherGainedFirstNightTaskIdV2,
  formatPhilosopherGrantId
} from "./philosopher-ability.js";
import { seatNumber } from "./player-roster.js";
import { formatRoleTenureId } from "./seamstress.js";

const taskId = scheduledTaskId("first-night-v1:DREAMER_ACTION:seat-01");
const dreamerRole = {
  roleId: roleId("dreamer"),
  characterType: "TOWNSFOLK",
  defaultAlignment: "GOOD",
  edition: "sects-and-violets",
  setupModifier: { outsiderDelta: 0, townsfolkDelta: 0 }
} as const;

const philosopherRole = {
  ...dreamerRole,
  roleId: roleId("philosopher")
} as const;

const canonicalV3 = (): DreamerActionOpportunityV3 => ({
  opportunitySchemaVersion: DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
  nightNumber: 1,
  opportunityId: formatBaseDreamerV2FirstNightActionOpportunityId({ seatNumber: seatNumber(1) }),
  opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V3",
  opportunityStatus: "OPEN",
  taskId,
  taskType: "DREAMER_ACTION",
  sourcePlayerId: playerId("dreamer-player"),
  sourceSeatNumber: seatNumber(1),
  sourceRole: dreamerRole,
  sourceCharacterStateRevision: 1,
  sourceContract: {
    sourceContractVersion: DREAMER_BASE_SOURCE_CONTRACT_VERSION,
    kind: "BASE",
    taskPlanVersion: "first-night-task-plan-v2",
    taskId,
    taskType: "DREAMER_ACTION",
    sourcePlayerId: playerId("dreamer-player"),
    sourceSeatNumber: seatNumber(1),
    sourceRoleId: "dreamer",
    sourceRoleTenureId: formatRoleTenureId({ seatNumber: seatNumber(1), roleId: "dreamer", acquiredCharacterStateRevision: 1 }),
    sourceCharacterStateRevision: 1,
    sourceAbilityInstanceId: formatBaseFirstNightAbilityInstanceId(taskId)
  },
  visibility: {
    visibilitySchemaVersion: DREAMER_V3_VISIBILITY_SCHEMA_VERSION,
    canChooseTarget: true,
    supportedDecisionKinds: ["CHOOSE_PLAYER"],
    futureUnsupportedDecisionKinds: [],
    targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER"
  }
});

const canonicalV2 = (): DreamerActionOpportunityV2 => {
  const v3 = canonicalV3();
  return {
    ...v3,
    opportunitySchemaVersion: DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION,
    opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V2",
    visibility: {
      visibilitySchemaVersion: DREAMER_V2_VISIBILITY_SCHEMA_VERSION,
      canChooseTarget: false,
      supportedDecisionKinds: [],
      futureUnsupportedDecisionKinds: ["CHOOSE_PLAYER"],
      futureTargetSchema: "OTHER_NON_TRAVELLER_PLAYER"
    }
  };
};

const valid = (value: unknown): boolean => validateFirstNightActionOpportunityStateShape({ opportunities: [value] }).valid;

const gainedTaskId = scheduledTaskId("first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-01:from-dreamer");
const philosopherOpportunityId = actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-01:opportunity-01");
const dreamerGrantId = grantedAbilityId("philosopher-grant-v1:seat-01:from-dreamer");
const gainedAbilityInstanceId = formatPhilosopherGainedV2AbilityInstanceId({
  taskId: gainedTaskId,
  grantId: dreamerGrantId
});

const canonicalV4 = (): DreamerActionOpportunityV4 => ({
  opportunitySchemaVersion: DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION,
  nightNumber: 1,
  opportunityId: actionOpportunityId(`${gainedTaskId}:opportunity-01`),
  opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V4",
  opportunityStatus: "OPEN",
  taskId: gainedTaskId,
  taskType: "DREAMER_ACTION",
  sourcePlayerId: playerId("philosopher-player"),
  sourceSeatNumber: seatNumber(1),
  sourceRole: philosopherRole,
  sourceCharacterStateRevision: 1,
  sourceContract: {
    sourceContractVersion: DREAMER_PHILOSOPHER_GAINED_SOURCE_CONTRACT_VERSION,
    kind: "PHILOSOPHER_GAINED_V2",
    taskPlanVersion: "first-night-task-plan-v2",
    schedulingVersion: "philosopher-gained-first-night-scheduling-v2",
    taskId: gainedTaskId,
    taskType: "DREAMER_ACTION",
    taskSourceKind: "PHILOSOPHER_GAINED_ABILITY",
    sourcePlayerId: playerId("philosopher-player"),
    sourceSeatNumber: seatNumber(1),
    sourceRoleId: "philosopher",
    chosenRoleId: "dreamer",
    sourceRoleTenureId: formatRoleTenureId({
      seatNumber: seatNumber(1),
      roleId: "philosopher",
      acquiredCharacterStateRevision: 1
    }),
    sourceCharacterStateRevision: 1,
    philosopherOpportunityId,
    grantId: dreamerGrantId,
    sourceAbilityInstanceId: gainedAbilityInstanceId,
    abilityInstance: {
      provenanceVersion: "first-night-ability-instance-provenance-v1",
      kind: "PHILOSOPHER_GAINED_TASK_V2",
      abilityInstanceId: gainedAbilityInstanceId,
      abilityRoleId: "dreamer",
      taskId: gainedTaskId,
      sourcePlayerId: playerId("philosopher-player"),
      sourceSeatNumber: seatNumber(1),
      philosopherOpportunityId,
      grantId: dreamerGrantId,
      sourceCharacterStateRevision: 1,
      schedulingVersion: "philosopher-gained-first-night-scheduling-v2"
    },
    grantReference: {
      kind: "PHILOSOPHER_GRANT_V1",
      grantId: dreamerGrantId,
      philosopherOpportunityId,
      sourcePlayerId: playerId("philosopher-player"),
      sourceSeatNumber: seatNumber(1),
      sourceRoleId: "philosopher",
      chosenRoleId: "dreamer",
      sourceCharacterStateRevision: 1
    },
    taskInsertionReference: {
      kind: "FIRST_NIGHT_TASK_INSERTION_V2",
      taskId: gainedTaskId,
      taskPlanVersion: "first-night-task-plan-v2",
      schedulingVersion: "philosopher-gained-first-night-scheduling-v2",
      philosopherOpportunityId,
      grantId: dreamerGrantId,
      sourcePlayerId: playerId("philosopher-player"),
      sourceSeatNumber: seatNumber(1),
      sourceRoleId: "philosopher",
      chosenRoleId: "dreamer",
      sourceCharacterStateRevision: 1
    }
  },
  visibility: {
    visibilitySchemaVersion: DREAMER_V4_VISIBILITY_SCHEMA_VERSION,
    canChooseTarget: true,
    supportedDecisionKinds: ["CHOOSE_PLAYER"],
    futureUnsupportedDecisionKinds: [],
    targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER"
  }
});

describe("base Dreamer V3 action opportunity", () => {
  it("[2B19A2-C04] enforces the exact closed V3 opportunity, visibility, and source-contract shape", () => {
    const base = canonicalV3();
    expect(valid(base)).toBe(true);
    expect(valid({ ...base, opportunityStatus: "CLOSED" })).toBe(true);
    expect(valid(canonicalV2())).toBe(true);
    expect(valid({ ...canonicalV2(), opportunityStatus: "CLOSED" })).toBe(false);

    for (const key of Object.keys(base)) {
      const copy = { ...base } as Record<string, unknown>;
      delete copy[key];
      expect(valid(copy), `missing top-level ${key}`).toBe(false);
    }
    for (const key of Object.keys(base.visibility)) {
      const visibility = { ...base.visibility } as Record<string, unknown>;
      delete visibility[key];
      expect(valid({ ...base, visibility }), `missing visibility ${key}`).toBe(false);
    }
    for (const key of Object.keys(base.sourceContract)) {
      const sourceContract = { ...base.sourceContract } as Record<string, unknown>;
      delete sourceContract[key];
      expect(valid({ ...base, sourceContract }), `missing sourceContract ${key}`).toBe(false);
    }

    const topLevelWrongValues: readonly unknown[] = [
      { ...base, extra: true },
      { ...base, opportunitySchemaVersion: "dreamer-first-night-action-opportunity-v2" },
      { ...base, nightNumber: 2 },
      { ...base, opportunityId: "first-night-v2:DREAMER_ACTION:seat-02:opportunity-01" },
      { ...base, opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V2" },
      { ...base, opportunityStatus: "INVALID" },
      { ...base, taskId: scheduledTaskId("first-night-v1:DREAMER_ACTION:seat-02") },
      { ...base, taskType: "WITCH_ACTION" },
      { ...base, sourcePlayerId: playerId("other") },
      { ...base, sourceSeatNumber: seatNumber(2) },
      { ...base, sourceRole: { ...base.sourceRole, roleId: roleId("artist") } },
      { ...base, sourceCharacterStateRevision: 2 }
    ];
    for (const value of topLevelWrongValues) expect(valid(value)).toBe(false);

    const sparseSupported: unknown[] = [];
    sparseSupported.length = 1;
    const sparseFuture: unknown[] = [];
    sparseFuture.length = 1;
    const visibilityWrongValues: readonly unknown[] = [
      { ...base.visibility, extra: true },
      { ...base.visibility, visibilitySchemaVersion: "dreamer-first-night-action-visibility-v2" },
      { ...base.visibility, canChooseTarget: false },
      { ...base.visibility, supportedDecisionKinds: [] },
      { ...base.visibility, supportedDecisionKinds: ["DEFER"] },
      { ...base.visibility, supportedDecisionKinds: sparseSupported },
      { ...base.visibility, futureUnsupportedDecisionKinds: ["CHOOSE_PLAYER"] },
      { ...base.visibility, futureUnsupportedDecisionKinds: sparseFuture },
      { ...base.visibility, targetSchema: "OTHER_NON_TRAVELLER_PLAYER" }
    ];
    for (const visibility of visibilityWrongValues) expect(valid({ ...base, visibility })).toBe(false);

    const sourceContractWrongValues: readonly unknown[] = [
      { ...base.sourceContract, extra: true },
      { ...base.sourceContract, sourceContractVersion: "dreamer-base-source-contract-v2" },
      { ...base.sourceContract, kind: "PHILOSOPHER_GAINED" },
      { ...base.sourceContract, taskPlanVersion: "first-night-task-plan-v1" },
      { ...base.sourceContract, taskId: scheduledTaskId("first-night-v1:DREAMER_ACTION:seat-02") },
      { ...base.sourceContract, taskType: "WITCH_ACTION" },
      { ...base.sourceContract, sourcePlayerId: playerId("other") },
      { ...base.sourceContract, sourceSeatNumber: seatNumber(2) },
      { ...base.sourceContract, sourceRoleId: "artist" },
      { ...base.sourceContract, sourceRoleTenureId: "role-tenure-v1:seat-02:role-dreamer:acquired-revision-1" },
      { ...base.sourceContract, sourceCharacterStateRevision: 2 },
      { ...base.sourceContract, sourceAbilityInstanceId: "first-night-ability-instance-v1:BASE:task-invalid" }
    ];
    for (const sourceContract of sourceContractWrongValues) expect(valid({ ...base, sourceContract })).toBe(false);

    const accessor = <T extends object>(value: T, key: keyof T): T => {
      const copy = { ...value };
      const captured = copy[key];
      Object.defineProperty(copy, key, { enumerable: true, get: () => captured });
      return copy;
    };
    const withSymbol = <T extends object>(value: T): T => {
      const copy = { ...value };
      Object.defineProperty(copy, Symbol("hidden"), { enumerable: true, value: true });
      return copy;
    };
    const withCycle = <T extends object>(value: T): T => {
      const copy = { ...value } as T & { cycle?: unknown };
      copy.cycle = copy;
      return copy;
    };
    const throwing = <T extends object>(value: T): T => new Proxy({ ...value }, {
      ownKeys: () => { throw new Error("hostile"); }
    });
    const nonPlain = new (class NonPlain {})();
    for (const opportunity of [null, [], nonPlain, accessor(base, "opportunityKind"), withSymbol(base), withCycle(base), throwing(base)]) {
      expect(valid(opportunity)).toBe(false);
    }
    for (const visibility of [null, [], nonPlain, accessor(base.visibility, "canChooseTarget"),
      withSymbol(base.visibility), withCycle(base.visibility), throwing(base.visibility)]) {
      expect(valid({ ...base, visibility })).toBe(false);
    }
    for (const sourceContract of [null, [], nonPlain, accessor(base.sourceContract, "kind"),
      withSymbol(base.sourceContract), withCycle(base.sourceContract), throwing(base.sourceContract)]) {
      expect(valid({ ...base, sourceContract })).toBe(false);
    }

    const sparseOpportunities: unknown[] = [];
    sparseOpportunities.length = 1;
    expect(validateFirstNightActionOpportunityStateShape({ opportunities: sparseOpportunities }).valid).toBe(false);
  });

  it("[2B19A2-C05] round-trips the canonical V2 identity grammar and rejects aliases", () => {
    for (const seat of [1, 9, 10, 12] as const) {
      const canonical = formatBaseDreamerV2FirstNightActionOpportunityId({ seatNumber: seatNumber(seat) });
      expect(parseBaseDreamerV2FirstNightActionOpportunityId(canonical)).toMatchObject({
        valid: true,
        canonicalId: canonical,
        taskType: "DREAMER_ACTION",
        seatNumber: seat,
        opportunityIndex: 1
      });
    }
    for (const alias of [
      "first-night-v2:DREAMER_ACTION:seat-1:opportunity-01",
      "first-night-v2:DREAMER_ACTION:seat-01:opportunity-1",
      "first-night-v2:DREAMER_ACTION:seat-01:opportunity-02",
      "first-night-v1:DREAMER_ACTION:seat-01:opportunity-01",
      " first-night-v2:DREAMER_ACTION:seat-01:opportunity-01"
    ]) expect(parseBaseDreamerV2FirstNightActionOpportunityId(alias)).toMatchObject({ valid: false });
  });
});

describe("Phase 3 Slice 2B19B gained Dreamer V4 opportunity contract", () => {
  it("[2B19B-C04/C05/C11] round-trips canonical gained task, grant, and ability identities", () => {
    const formattedTaskId = formatPhilosopherGainedFirstNightTaskIdV2({
      taskType: "DREAMER_ACTION",
      sourceSeatNumber: seatNumber(1),
      chosenRoleId: roleId("dreamer")
    });
    const formattedGrantId = formatPhilosopherGrantId({
      sourceSeatNumber: seatNumber(1),
      chosenRoleId: roleId("dreamer")
    });
    const formattedAbilityId = formatPhilosopherGainedV2AbilityInstanceId({
      taskId: formattedTaskId,
      grantId: formattedGrantId
    });

    expect(formattedTaskId).toBe(gainedTaskId);
    expect(formattedGrantId).toBe(dreamerGrantId);
    expect(parseFirstNightAbilityInstanceId(formattedAbilityId)).toStrictEqual({
      valid: true,
      canonicalId: formattedAbilityId,
      kind: "PHILOSOPHER_GAINED_TASK_V2",
      taskId: formattedTaskId,
      grantId: formattedGrantId,
      generation: "V2",
      taskType: "DREAMER_ACTION",
      embeddedSeat: 1,
      embeddedRoleId: "dreamer"
    });
    expect(parseFirstNightAbilityInstanceId(formatPhilosopherGainedV2AbilityInstanceId({
      taskId: formattedTaskId,
      grantId: grantedAbilityId("philosopher-grant-v1:seat-02:from-dreamer")
    }))).toMatchObject({ valid: false });
  });

  it("[2B19B-C06/C08/C55/C56-S01/S02/S03/S04/S05/S06/S10/S11/S13/S16] accepts only the exact closed V4 chain", () => {
    const base = canonicalV4();
    expect(valid(base)).toBe(true);
    expect(valid({ ...base, opportunityStatus: "CLOSED" })).toBe(true);
    expect(Object.keys(base)).toHaveLength(13);
    expect(Object.keys(base.sourceContract)).toHaveLength(19);
    expect(Object.keys(base.sourceContract.abilityInstance)).toHaveLength(11);
    expect(Object.keys(base.sourceContract.grantReference)).toHaveLength(8);
    expect(Object.keys(base.sourceContract.taskInsertionReference)).toHaveLength(11);
    expect(Object.keys(base.visibility)).toHaveLength(5);
    expect(hasExactPhilosopherGainedDreamerSourceContractV1Shape(base.sourceContract)).toBe(true);

    for (const key of Object.keys(base)) {
      const missing = structuredClone(base) as unknown as Record<string, unknown>;
      delete missing[key];
      expect(valid(missing), `opportunity.${key}`).toBe(false);
    }
    expect(valid({ ...base, extra: true })).toBe(false);

    for (const [name, record] of [
      ["sourceContract", base.sourceContract],
      ["abilityInstance", base.sourceContract.abilityInstance],
      ["grantReference", base.sourceContract.grantReference],
      ["taskInsertionReference", base.sourceContract.taskInsertionReference],
      ["visibility", base.visibility]
    ] as const) {
      for (const key of Object.keys(record)) {
        const mutated = structuredClone(base) as unknown as Record<string, unknown>;
        const sourceContract = mutated.sourceContract as Record<string, unknown>;
        const target = name === "sourceContract"
          ? sourceContract
          : name === "visibility"
            ? mutated.visibility as Record<string, unknown>
            : sourceContract[name] as Record<string, unknown>;
        delete target[key];
        expect(valid(mutated), `${name}.${key}`).toBe(false);
      }
      const mutated = structuredClone(base) as unknown as Record<string, unknown>;
      const sourceContract = mutated.sourceContract as Record<string, unknown>;
      const target = name === "sourceContract"
        ? sourceContract
        : name === "visibility"
          ? mutated.visibility as Record<string, unknown>
          : sourceContract[name] as Record<string, unknown>;
      target.extra = true;
      expect(valid(mutated), `${name}.extra`).toBe(false);
    }

    for (const candidate of [
      { ...base, opportunitySchemaVersion: DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION },
      { ...base, opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V3" },
      { ...base, opportunityId: actionOpportunityId(`${gainedTaskId}:opportunity-02`) },
      { ...base, taskId: scheduledTaskId("first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-02:from-dreamer") },
      { ...base, sourceRole: dreamerRole },
      { ...base, sourceSeatNumber: 0 },
      { ...base, sourceCharacterStateRevision: Number.MAX_SAFE_INTEGER + 1 },
      { ...base, visibility: { ...base.visibility, canChooseTarget: false } },
      { ...base, visibility: { ...base.visibility, supportedDecisionKinds: ["DEFER"] } },
      { ...base, sourceContract: { ...base.sourceContract, kind: "BASE" } },
      { ...base, sourceContract: { ...base.sourceContract, chosenRoleId: "artist" } },
      { ...base, sourceContract: { ...base.sourceContract,
        abilityInstance: { ...base.sourceContract.abilityInstance, abilityRoleId: "artist" } } },
      { ...base, sourceContract: { ...base.sourceContract,
        grantReference: { ...base.sourceContract.grantReference, grantId: grantedAbilityId("other") } } },
      { ...base, sourceContract: { ...base.sourceContract,
        taskInsertionReference: { ...base.sourceContract.taskInsertionReference,
          philosopherOpportunityId: actionOpportunityId("other") } } }
    ]) expect(valid(candidate)).toBe(false);

    expect(valid(canonicalV3())).toBe(true);
    expect(valid({ ...canonicalV3(), sourceContract: base.sourceContract })).toBe(false);
    expect(valid({ ...base, sourceContract: canonicalV3().sourceContract })).toBe(false);
  });

  it("[2B19B-S12] fails closed for hostile V4 objects without invoking getters", () => {
    const base = canonicalV4();
    let getterCalls = 0;
    const withAccessor = (path: "top" | "source" | "ability" | "visibility"): unknown => {
      const value = structuredClone(base) as unknown as Record<string, unknown>;
      const target = path === "top" ? value
        : path === "visibility" ? value.visibility as Record<string, unknown>
        : path === "source" ? value.sourceContract as Record<string, unknown>
        : (value.sourceContract as Record<string, unknown>).abilityInstance as Record<string, unknown>;
      const key = path === "top" ? "opportunityKind" : path === "visibility" ? "canChooseTarget"
        : path === "source" ? "kind" : "abilityRoleId";
      Object.defineProperty(target, key, { enumerable: true, get: () => {
        getterCalls += 1;
        throw new Error("getter");
      } });
      return value;
    };
    const throwing = new Proxy(base, { ownKeys: () => { throw new Error("proxy"); } });
    const revoked = Proxy.revocable(base, {}); revoked.revoke();
    const symbol = structuredClone(base);
    Object.defineProperty(symbol, Symbol("hidden"), { enumerable: true, value: true });
    const cycle = structuredClone(base) as unknown as Record<string, unknown>;
    cycle.self = cycle;
    const nonplain = Object.assign(Object.create({ inherited: true }) as object, base);
    for (const candidate of [throwing, revoked.proxy, symbol, cycle, nonplain,
      withAccessor("top"), withAccessor("source"), withAccessor("ability"), withAccessor("visibility")]) {
      expect(valid(candidate)).toBe(false);
    }
    expect(getterCalls).toBe(0);
  });

  it("[2B19B-S14/S15] clones every nested V4 record and compares every source field", () => {
    const base = canonicalV4();
    const clone = cloneFirstNightActionOpportunityState({ opportunities: [base] }).opportunities[0];
    expect(clone).toStrictEqual(base);
    expect(clone).not.toBe(base);
    if (clone?.opportunityKind !== "DREAMER_FIRST_NIGHT_ACTION_V4") throw new Error("Expected V4 clone");
    expect(clone.sourceContract).not.toBe(base.sourceContract);
    expect(clone.sourceContract.abilityInstance).not.toBe(base.sourceContract.abilityInstance);
    expect(clone.sourceContract.grantReference).not.toBe(base.sourceContract.grantReference);
    expect(clone.sourceContract.taskInsertionReference).not.toBe(base.sourceContract.taskInsertionReference);
    expect(clone.visibility).not.toBe(base.visibility);
    expect(sameOpportunityCore(base, clone)).toBe(true);

    for (const [section, record] of [
      ["sourceContract", base.sourceContract],
      ["abilityInstance", base.sourceContract.abilityInstance],
      ["grantReference", base.sourceContract.grantReference],
      ["taskInsertionReference", base.sourceContract.taskInsertionReference]
    ] as const) {
      for (const key of Object.keys(record)) {
        const mutated = structuredClone(base) as unknown as Record<string, unknown>;
        const contract = mutated.sourceContract as Record<string, unknown>;
        const target = section === "sourceContract" ? contract : contract[section] as Record<string, unknown>;
        const original = target[key];
        target[key] = typeof original === "number" ? original + 1 : `${String(original)}-mutated`;
        expect(sameOpportunityCore(base, mutated as unknown as DreamerActionOpportunityV4), `${section}.${key}`).toBe(false);
      }
    }
    const closed = { ...base, opportunityStatus: "CLOSED" } as const;
    expect(sameOpportunityCore(base, closed)).toBe(false);
  });
});
