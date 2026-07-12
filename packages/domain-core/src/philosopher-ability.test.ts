import { describe, expect, it } from "vitest";
import {
  CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION,
  SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM,
  SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION,
  compareFirstNightTaskOrder
} from "./first-night-task-plan.js";
import type { FirstNightTaskPlan, ScheduledTask } from "./first-night-task-plan.js";
import { actionOpportunityId, grantedAbilityId, playerId, roleId, scheduledTaskId } from "./ids.js";
import { seatNumber } from "./player-roster.js";
import type { PhilosopherAbilityChosenPayload, PhilosopherGrantedAbility } from "./philosopher-ability.js";
import {
  PHILOSOPHER_GAINED_FIRST_NIGHT_SCHEDULING_VERSION,
  PHILOSOPHER_GAINED_TASK_TIE_BREAK_POLICY,
  createFirstNightTaskInsertedV2Payload,
  validateFirstNightTaskInsertedV2Payload
} from "./philosopher-ability.js";

const role = (id: string) => ({
  roleId: roleId(id),
  characterType: "TOWNSFOLK" as const,
  defaultAlignment: "GOOD" as const,
  edition: "sects-and-violets" as const,
  setupModifier: { outsiderDelta: 0, townsfolkDelta: 0 }
});

describe("Philosopher gained first-night task ordering", () => {
  it("preserves the accepted V1 immediate-insertion order", () => {
    const philosopher = role("philosopher");
    const clockmaker = role("clockmaker");
    const sourcePlayerId = playerId("player-philosopher");
    const sourceSeatNumber = seatNumber(2);
    const tasks: ScheduledTask[] = [
      {
        taskId: scheduledTaskId("first-night-v1:MINION_INFO:system"), taskType: "MINION_INFO", taskClass: "SYSTEM_INFORMATION",
        orderKey: { baseOrder: 200, insertionOrder: 0 }, source: { kind: "SYSTEM", systemTaskType: "MINION_INFO" },
        status: "PENDING", settlementPolicy: "RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT"
      },
      {
        taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_GAINED:CLOCKMAKER_INFORMATION:seat-02:from-clockmaker"),
        taskType: "CLOCKMAKER_INFORMATION", taskClass: "ROLE_INFORMATION", orderKey: { baseOrder: 100, insertionOrder: 1 },
        source: { kind: "PHILOSOPHER_GAINED_ABILITY", playerId: sourcePlayerId, seatNumber: sourceSeatNumber, sourceRole: philosopher,
          chosenRole: clockmaker, opportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-02:opportunity-01"), sourceCharacterStateRevision: 1 },
        status: "PENDING", settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT"
      },
      {
        taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-02"), taskType: "PHILOSOPHER_ACTION", taskClass: "ROLE_ACTION",
        orderKey: { baseOrder: 100, insertionOrder: 0 }, source: { kind: "ROLE", playerId: sourcePlayerId, seatNumber: sourceSeatNumber, role: philosopher },
        status: "PENDING", settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT"
      }
    ];

    expect(tasks.sort(compareFirstNightTaskOrder).map((task) => task.taskType)).toStrictEqual([
      "PHILOSOPHER_ACTION",
      "CLOCKMAKER_INFORMATION",
      "MINION_INFO"
    ]);
  });

  it("orders V2 base first, then gained source seats, then task IDs by code unit", () => {
    const philosopher = role("philosopher");
    const clockmaker = role("clockmaker");
    const source = (seat: 2 | 10) => ({
      kind: "PHILOSOPHER_GAINED_ABILITY" as const,
      playerId: playerId(`player-${seat}`),
      seatNumber: seatNumber(seat),
      sourceRole: philosopher,
      chosenRole: clockmaker,
      opportunityId: actionOpportunityId(`opportunity-${seat}`),
      sourceCharacterStateRevision: 1
    });
    const gained = (id: string, seat: 2 | 10): ScheduledTask => ({
      taskId: scheduledTaskId(id), taskType: "CLOCKMAKER_INFORMATION", taskClass: "ROLE_INFORMATION",
      orderKey: { baseOrder: 800, insertionOrder: seat }, source: source(seat), status: "PENDING",
      settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT"
    });
    const base: ScheduledTask = {
      taskId: scheduledTaskId("first-night-v1:CLOCKMAKER_INFORMATION:seat-08"), taskType: "CLOCKMAKER_INFORMATION",
      taskClass: "ROLE_INFORMATION", orderKey: { baseOrder: 800, insertionOrder: 0 },
      source: { kind: "ROLE", playerId: playerId("base"), seatNumber: seatNumber(8), role: clockmaker },
      status: "PENDING", settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT"
    };
    const input = [
      gained("first-night-v2:z-seat-02", 2), gained("first-night-v2:a-seat-10", 10), base, gained("first-night-v2:a-seat-02", 2)
    ];
    const expected = [
      base.taskId,
      scheduledTaskId("first-night-v2:a-seat-02"),
      scheduledTaskId("first-night-v2:z-seat-02"),
      scheduledTaskId("first-night-v2:a-seat-10")
    ];
    const permutations = <T>(values: readonly T[]): readonly (readonly T[])[] =>
      values.length <= 1
        ? [values]
        : values.flatMap((value, index) =>
            permutations(values.filter((_, candidateIndex) => candidateIndex !== index)).map((tail) => [value, ...tail])
          );
    const normalizedOrders = permutations(input).map((candidate) =>
      [...candidate].sort(compareFirstNightTaskOrder).map((task) => task.taskId)
    );
    expect(normalizedOrders).toHaveLength(24);
    expect(normalizedOrders.every((order) => order.every((id, index) => id === expected[index]))).toBe(true);
  });

  it("creates and validates the exact catalog-bound V2 insertion contract", () => {
    const philosopher = role("philosopher");
    const clockmaker = role("clockmaker");
    const catalog = {
      taskCatalogVersion: SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION,
      taskCatalogSignatureAlgorithm: SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM,
      taskCatalogSignature: "test-signature",
      definitions: [{
        taskType: "CLOCKMAKER_INFORMATION" as const, taskClass: "ROLE_INFORMATION" as const, baseOrder: 800,
        sourceKind: "ROLE" as const, roleId: roleId("clockmaker"),
        settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT" as const
      }]
    };
    const plan: FirstNightTaskPlan = {
      nightNumber: 1, taskPlanVersion: CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION,
      taskCatalogVersion: catalog.taskCatalogVersion,
      taskCatalogSignatureAlgorithm: catalog.taskCatalogSignatureAlgorithm,
      taskCatalogSignature: catalog.taskCatalogSignature, taskCatalogSnapshot: catalog,
      rosterVersion: "roster-v1", assignmentAlgorithmVersion: "assignment-v1", roleCatalogSignature: "roles-v1",
      knowledgeModelVersion: "initial-own-character-knowledge-v1", knowledgeStage: "OWN_CHARACTER_BOOTSTRAP", tasks: []
    };
    const choice: PhilosopherAbilityChosenPayload = {
      rulesBaselineVersion: "phase-one-v2.1", nightNumber: 1,
      taskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-02"), taskType: "PHILOSOPHER_ACTION",
      opportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-02:opportunity-01"),
      decisionKind: "CHOOSE_GOOD_CHARACTER", sourcePlayerId: playerId("philosopher-player"), sourceSeatNumber: seatNumber(2),
      sourceRole: philosopher, sourceCharacterStateRevision: 1, chosenRole: clockmaker,
      chosenRoleId: roleId("clockmaker"), roleCatalogSignature: "roles-v1"
    };
    const grant: PhilosopherGrantedAbility = {
      grantId: grantedAbilityId("philosopher-grant-v1:seat-02:from-clockmaker"), sourcePlayerId: choice.sourcePlayerId,
      sourceSeatNumber: choice.sourceSeatNumber, sourceRole: philosopher, sourceCharacterStateRevision: 1,
      chosenRole: clockmaker, chosenRoleId: roleId("clockmaker"), chosenRoleCatalogSignature: "roles-v1",
      grantedAtTaskId: choice.taskId, grantedAtOpportunityId: choice.opportunityId
    };
    const payload = createFirstNightTaskInsertedV2Payload({
      rulesBaselineVersion: "phase-one-v2.1", choice, grant, firstNightTaskPlan: plan
    });
    expect(payload).toMatchObject({
      schedulingVersion: PHILOSOPHER_GAINED_FIRST_NIGHT_SCHEDULING_VERSION,
      taskPlanVersion: CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION,
      taskId: "first-night-v2:PHILOSOPHER_GAINED:CLOCKMAKER_INFORMATION:seat-02:from-clockmaker",
      targetCatalogBaseOrder: 800, effectiveBaseOrder: 800,
      tieBreakPolicy: PHILOSOPHER_GAINED_TASK_TIE_BREAK_POLICY, tieBreakSourceSeatNumber: 2,
      grantId: grant.grantId, philosopherOpportunityId: choice.opportunityId
    });
    if (payload === undefined) throw new Error("Expected V2 Clockmaker insertion payload");
    const context = { firstNightTaskPlan: plan, grants: { abilities: [grant] }, insertions: undefined };
    expect(validateFirstNightTaskInsertedV2Payload(payload, context)).toStrictEqual({ valid: true });

    const hostile = [
      { ...payload, extra: true },
      Object.fromEntries(Object.entries(payload).filter(([key]) => key !== "grantId")),
      { ...payload, taskId: scheduledTaskId("first-night-v2:PHILOSOPHER_GAINED:CLOCKMAKER_INFORMATION:seat-2:from-clockmaker") },
      { ...payload, tieBreakSourceSeatNumber: 3 },
      { ...payload, targetRoleId: roleId("dreamer") },
      { ...payload, targetCatalogBaseOrder: 900 },
      { ...payload, taskCatalogSignature: "wrong" },
      { ...payload, grantId: grantedAbilityId("wrong-grant") }
    ];
    for (const candidate of hostile) {
      expect(validateFirstNightTaskInsertedV2Payload(candidate, context)).toMatchObject({ valid: false });
    }
    expect(validateFirstNightTaskInsertedV2Payload(payload, {
      ...context,
      insertions: { insertions: [{ taskId: scheduledTaskId("first-night-v1:legacy") } as never] }
    })).toMatchObject({ valid: false });
  });
});
