import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  DREAMER_FALSE_ROLE_POLICY_VERSION,
  DREAMER_INFORMATION_STAGE,
  SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
  createDreamerTargetChosenPayload,
  createDreamerInformationDeliveredPayload,
  evaluateDreamerEffectiveness,
  resolveBaseDreamerV2NormalCapability,
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
import { abilityImpairmentId, actionOpportunityId, eventId, playerId, roleId, scheduledTaskId } from "./ids.js";
import type { AbilityImpairmentSet } from "./philosopher-ability.js";
import { seatNumber } from "./player-roster.js";
import type { PlayerRoster } from "./player-roster.js";
import {
  DREAMER_BASE_SOURCE_CONTRACT_VERSION,
  DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
  DREAMER_V3_VISIBILITY_SCHEMA_VERSION,
  formatBaseDreamerV2FirstNightActionOpportunityId
} from "./first-night-action-opportunity.js";
import type { DreamerActionOpportunityV3 } from "./first-night-action-opportunity.js";
import { formatBaseFirstNightAbilityInstanceId } from "./first-night-ability-outcome-ledger.js";
import { formatRoleTenureId } from "./seamstress.js";
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
