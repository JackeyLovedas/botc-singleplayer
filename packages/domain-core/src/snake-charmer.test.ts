import { describe, expect, it } from "vitest";
import {
  abilityImpairmentId,
  evaluateSnakeCharmerEffectiveness,
  playerId,
  roleId,
  seatNumber
} from "@botc/domain-core";
import type { AbilityImpairmentSet, RoleSetupSnapshot } from "@botc/domain-core";

const snakeCharmerRole: RoleSetupSnapshot = {
  roleId: roleId("snake_charmer"),
  characterType: "TOWNSFOLK",
  defaultAlignment: "GOOD",
  edition: "sects-and-violets",
  setupModifier: {
    outsiderDelta: 0,
    townsfolkDelta: 0
  }
};

const sourcePlayerId = playerId("player-ai-3");

describe("Snake Charmer effectiveness gate", () => {
  it("treats a source without active impairment as effective", () => {
    expect(evaluateSnakeCharmerEffectiveness({
      sourcePlayerId,
      abilityImpairments: undefined
    })).toStrictEqual({ effective: true });
  });

  it("treats a DRUNK source as ineffective", () => {
    const abilityImpairments: AbilityImpairmentSet = {
      impairments: [{
        impairmentId: abilityImpairmentId("ability-impairment-v1:b-drunk"),
        kind: "DRUNK",
        sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
        sourcePlayerId: playerId("player-ai-10"),
        affectedPlayerId: sourcePlayerId,
        affectedSeatNumber: seatNumber(3),
        affectedRole: snakeCharmerRole,
        sourceCharacterStateRevision: 1,
        chosenRoleId: roleId("snake_charmer")
      }]
    };

    expect(evaluateSnakeCharmerEffectiveness({
      sourcePlayerId,
      abilityImpairments
    })).toStrictEqual({
      effective: false,
      reason: "SOURCE_DRUNK",
      impairmentId: abilityImpairmentId("ability-impairment-v1:b-drunk"),
      impairmentKind: "DRUNK"
    });
  });

  it("treats a POISONED source as ineffective", () => {
    const abilityImpairments: AbilityImpairmentSet = {
      impairments: [{
        impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned"),
        kind: "POISONED",
        sourceKind: "SNAKE_CHARMER_DEMON_HIT",
        sourcePlayerId: playerId("player-ai-4"),
        affectedPlayerId: sourcePlayerId,
        affectedSeatNumber: seatNumber(3),
        affectedRole: snakeCharmerRole,
        sourceCharacterStateRevision: 2
      }]
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

  it("uses the lowest impairmentId when multiple active impairments affect the source", () => {
    const abilityImpairments: AbilityImpairmentSet = {
      impairments: [
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:z-drunk"),
          kind: "DRUNK",
          sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
          sourcePlayerId: playerId("player-ai-10"),
          affectedPlayerId: sourcePlayerId,
          affectedSeatNumber: seatNumber(3),
          affectedRole: snakeCharmerRole,
          sourceCharacterStateRevision: 1,
          chosenRoleId: roleId("snake_charmer")
        },
        {
          impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned"),
          kind: "POISONED",
          sourceKind: "SNAKE_CHARMER_DEMON_HIT",
          sourcePlayerId: playerId("player-ai-4"),
          affectedPlayerId: sourcePlayerId,
          affectedSeatNumber: seatNumber(3),
          affectedRole: snakeCharmerRole,
          sourceCharacterStateRevision: 2
        }
      ]
    };

    expect(evaluateSnakeCharmerEffectiveness({
      sourcePlayerId,
      abilityImpairments
    })).toMatchObject({
      effective: false,
      reason: "SOURCE_POISONED",
      impairmentId: abilityImpairmentId("ability-impairment-v1:a-poisoned")
    });
  });
});
