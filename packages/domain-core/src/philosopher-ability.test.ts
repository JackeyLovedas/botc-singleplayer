import { describe, expect, it } from "vitest";
import { compareFirstNightTaskOrder } from "./first-night-task-plan.js";
import type { ScheduledTask } from "./first-night-task-plan.js";
import { actionOpportunityId, playerId, roleId, scheduledTaskId } from "./ids.js";
import { seatNumber } from "./player-roster.js";

const role = (id: string) => ({
  roleId: roleId(id),
  characterType: "TOWNSFOLK" as const,
  defaultAlignment: "GOOD" as const,
  edition: "sects-and-violets" as const,
  setupModifier: { outsiderDelta: 0, townsfolkDelta: 0 }
});

describe("Philosopher gained first-night task ordering", () => {
  it("inserts gained Clockmaker after Philosopher and before Minion information", () => {
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
});
