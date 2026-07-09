import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  abilityImpairmentId,
  evaluateSnakeCharmerEffectiveness,
  evaluateWitchEffectiveness,
  playerId,
  roleId,
  seatNumber
} from "@botc/domain-core";
import type { AbilityImpairmentSet, RoleSetupSnapshot } from "@botc/domain-core";

const witchRole: RoleSetupSnapshot = {
  roleId: roleId("witch"),
  characterType: "MINION",
  defaultAlignment: "EVIL",
  edition: "sects-and-violets",
  setupModifier: {
    outsiderDelta: 0,
    townsfolkDelta: 0
  }
};

const sourcePlayerId = playerId("player-ai-8");

describe("Witch effectiveness gate", () => {
  it("treats a source without active impairment as effective", () => {
    expect(evaluateWitchEffectiveness({
      sourcePlayerId,
      abilityImpairments: undefined
    })).toStrictEqual({ effective: true });
  });

  it("treats a DRUNK source as ineffective", () => {
    const abilityImpairments: AbilityImpairmentSet = {
      impairments: [{
        impairmentId: abilityImpairmentId("ability-impairment-v1:b-drunk-witch"),
        kind: "DRUNK",
        sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
        sourcePlayerId: playerId("player-ai-10"),
        affectedPlayerId: sourcePlayerId,
        affectedSeatNumber: seatNumber(8),
        affectedRole: witchRole,
        sourceCharacterStateRevision: 1,
        chosenRoleId: roleId("witch")
      }]
    };

    expect(evaluateWitchEffectiveness({
      sourcePlayerId,
      abilityImpairments
    })).toStrictEqual({
      effective: false,
      reason: "SOURCE_DRUNK",
      impairmentId: abilityImpairmentId("ability-impairment-v1:b-drunk-witch"),
      impairmentKind: "DRUNK"
    });
  });

  it("treats a POISONED source as ineffective", () => {
    const abilityImpairments: AbilityImpairmentSet = {
      impairments: [{
        impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned-witch"),
        kind: "POISONED",
        sourceKind: "SNAKE_CHARMER_DEMON_HIT",
        sourcePlayerId: playerId("player-ai-4"),
        affectedPlayerId: sourcePlayerId,
        affectedSeatNumber: seatNumber(8),
        affectedRole: witchRole,
        sourceCharacterStateRevision: 2
      }]
    };

    expect(evaluateWitchEffectiveness({
      sourcePlayerId,
      abilityImpairments
    })).toStrictEqual({
      effective: false,
      reason: "SOURCE_POISONED",
      impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned-witch"),
      impairmentKind: "POISONED"
    });
  });

  it("uses the lowest impairmentId when multiple active impairments affect the source", () => {
    const abilityImpairments: AbilityImpairmentSet = {
      impairments: [
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:z-drunk-witch"),
          kind: "DRUNK",
          sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
          sourcePlayerId: playerId("player-ai-10"),
          affectedPlayerId: sourcePlayerId,
          affectedSeatNumber: seatNumber(8),
          affectedRole: witchRole,
          sourceCharacterStateRevision: 1,
          chosenRoleId: roleId("witch")
        },
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned-witch"),
          kind: "POISONED",
          sourceKind: "SNAKE_CHARMER_DEMON_HIT",
          sourcePlayerId: playerId("player-ai-4"),
          affectedPlayerId: sourcePlayerId,
          affectedSeatNumber: seatNumber(8),
          affectedRole: witchRole,
          sourceCharacterStateRevision: 2
        }
      ]
    };

    expect(evaluateWitchEffectiveness({
      sourcePlayerId,
      abilityImpairments
    })).toMatchObject({
      effective: false,
      reason: "SOURCE_POISONED",
      impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned-witch")
    });
  });

  it("uses stable ASCII impairmentId order without locale-sensitive collation", () => {
    const abilityImpairments: AbilityImpairmentSet = {
      impairments: [
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:a-drunk"),
          kind: "DRUNK",
          sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
          sourcePlayerId: playerId("player-ai-10"),
          affectedPlayerId: sourcePlayerId,
          affectedSeatNumber: seatNumber(8),
          affectedRole: witchRole,
          sourceCharacterStateRevision: 1,
          chosenRoleId: roleId("witch")
        },
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:_poisoned"),
          kind: "POISONED",
          sourceKind: "SNAKE_CHARMER_DEMON_HIT",
          sourcePlayerId: playerId("player-ai-4"),
          affectedPlayerId: sourcePlayerId,
          affectedSeatNumber: seatNumber(8),
          affectedRole: witchRole,
          sourceCharacterStateRevision: 2
        },
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:Z-drunk"),
          kind: "DRUNK",
          sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
          sourcePlayerId: playerId("player-ai-10"),
          affectedPlayerId: sourcePlayerId,
          affectedSeatNumber: seatNumber(8),
          affectedRole: witchRole,
          sourceCharacterStateRevision: 1,
          chosenRoleId: roleId("witch")
        },
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:9-poisoned"),
          kind: "POISONED",
          sourceKind: "SNAKE_CHARMER_DEMON_HIT",
          sourcePlayerId: playerId("player-ai-4"),
          affectedPlayerId: sourcePlayerId,
          affectedSeatNumber: seatNumber(8),
          affectedRole: witchRole,
          sourceCharacterStateRevision: 2
        }
      ]
    };

    expect("ability-impairment-v1:9-poisoned" < "ability-impairment-v1:Z-drunk").toBe(true);
    expect("ability-impairment-v1:Z-drunk" < "ability-impairment-v1:_poisoned").toBe(true);
    expect("ability-impairment-v1:_poisoned" < "ability-impairment-v1:a-drunk").toBe(true);

    expect(evaluateWitchEffectiveness({
      sourcePlayerId,
      abilityImpairments
    })).toStrictEqual({
      effective: false,
      reason: "SOURCE_POISONED",
      impairmentId: abilityImpairmentId("ability-impairment-v1:9-poisoned"),
      impairmentKind: "POISONED"
    });
  });

  it("does not reintroduce locale-sensitive Witch impairment ordering", () => {
    const source = readFileSync(new URL("./witch.ts", import.meta.url), "utf8");
    const localeSensitiveComparatorName = "locale" + "Compare";
    const runtimeCollatorName = "Intl" + ".Collator";

    expect(source).not.toContain(localeSensitiveComparatorName);
    expect(source).not.toContain(runtimeCollatorName);
  });

  it("leaves Snake Charmer effectiveness ordering unchanged", () => {
    const abilityImpairments: AbilityImpairmentSet = {
      impairments: [
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:z-drunk"),
          kind: "DRUNK",
          sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
          sourcePlayerId: playerId("player-ai-10"),
          affectedPlayerId: sourcePlayerId,
          affectedSeatNumber: seatNumber(8),
          affectedRole: witchRole,
          sourceCharacterStateRevision: 1,
          chosenRoleId: roleId("snake_charmer")
        },
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned"),
          kind: "POISONED",
          sourceKind: "SNAKE_CHARMER_DEMON_HIT",
          sourcePlayerId: playerId("player-ai-4"),
          affectedPlayerId: sourcePlayerId,
          affectedSeatNumber: seatNumber(8),
          affectedRole: witchRole,
          sourceCharacterStateRevision: 2
        }
      ]
    };

    expect(evaluateSnakeCharmerEffectiveness({
      sourcePlayerId,
      abilityImpairments
    })).toStrictEqual({
      effective: false,
      reason: "SOURCE_POISONED",
      impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned"),
      impairmentKind: "POISONED"
    });
  });
});
