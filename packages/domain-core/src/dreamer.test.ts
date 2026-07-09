import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  DREAMER_FALSE_ROLE_POLICY_VERSION,
  DREAMER_INFORMATION_STAGE,
  SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
  createDreamerInformationDeliveredPayload,
  evaluateDreamerEffectiveness
} from "./dreamer.js";
import { DomainError } from "./errors.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import { abilityImpairmentId, actionOpportunityId, playerId, roleId, scheduledTaskId } from "./ids.js";
import type { AbilityImpairmentSet } from "./philosopher-ability.js";
import { seatNumber } from "./player-roster.js";
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

const dreamerRole = role("dreamer", "TOWNSFOLK", "GOOD");
const flowergirlRole = role("flowergirl", "TOWNSFOLK", "GOOD");
const snakeCharmerRole = role("snake_charmer", "TOWNSFOLK", "GOOD");
const witchRole = role("witch", "MINION", "EVIL");
const fangGuRole = role("fang_gu", "DEMON", "EVIL");

const setup = (roles: readonly RoleSetupSnapshot[]): Pick<GeneratedSetup, "roleCatalogSnapshot"> => ({
  roleCatalogSnapshot: {
    scriptId: "sects-and-violets",
    edition: "sects-and-violets",
    roleCatalogVersion: "snv-role-catalog-v1",
    canonicalSignature: "test-signature",
    roles
  }
});

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

  it("includes a GOOD target current role and lowest EVIL catalog role when effective", () => {
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

  it("includes an EVIL target current role and lowest GOOD catalog role when effective", () => {
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

  it("throws a DomainError when no deterministic false role candidate exists", () => {
    expect(() => createDreamerInformationDeliveredPayload({
      rulesBaselineVersion: "Phase One v2.1",
      targetChoice,
      setup: setup([dreamerRole, flowergirlRole]),
      currentCharacterState: currentState(flowergirlRole),
      effectiveness: { effective: true }
    })).toThrowError(DomainError);
  });
});
