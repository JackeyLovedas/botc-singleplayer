import { describe, expect, it } from "vitest";
import {
  abilityImpairmentId,
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
});
