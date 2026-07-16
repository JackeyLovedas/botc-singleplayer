import { describe, expect, it } from "vitest";
import {
  DREAMER_BASE_SOURCE_CONTRACT_VERSION,
  DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION,
  DREAMER_V2_VISIBILITY_SCHEMA_VERSION,
  DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
  DREAMER_V3_VISIBILITY_SCHEMA_VERSION,
  formatBaseDreamerV2FirstNightActionOpportunityId,
  parseBaseDreamerV2FirstNightActionOpportunityId,
  validateFirstNightActionOpportunityStateShape
} from "./first-night-action-opportunity.js";
import type { DreamerActionOpportunityV2, DreamerActionOpportunityV3 } from "./first-night-action-opportunity.js";
import { formatBaseFirstNightAbilityInstanceId } from "./first-night-ability-outcome-ledger.js";
import { playerId, roleId, scheduledTaskId } from "./ids.js";
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
