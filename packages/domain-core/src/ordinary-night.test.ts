import { describe, expect, it } from "vitest";
import { createOrdinaryNightTaskPlan, deriveOrdinaryNightTarget, getNextUnsettledOrdinaryNightTask } from "./ordinary-night.js";
import { createTwoCAdditiveStructuralSchemaAuthority } from "./phase-3-slice-2c-structural-descriptors.js";
import type { GameState } from "./game-state.js";

const state = {
  rootSeed: "seed-1",
  assignment: {
    assignments: [
      { playerId: "p1", seatNumber: 1, role: { roleId: "mutant", characterType: "TOWNSFOLK" } },
      { playerId: "p2", seatNumber: 2, role: { roleId: "dreamer", characterType: "TOWNSFOLK" } },
      { playerId: "p3", seatNumber: 3, role: { roleId: "cerenovus", characterType: "MINION" } },
      { playerId: "p4", seatNumber: 4, role: { roleId: "vortox", characterType: "DEMON" } }
    ]
  },
  roster: { entries: [1, 2, 3, 4].map((seatNumber) => ({ playerId: `p${seatNumber}`, seatNumber })) }
} as unknown as GameState;

describe("bounded ordinary-night foundation", () => {
  it("plans the three bounded capability kinds and targets demon kill at seat 1", () => {
    const plan = createOrdinaryNightTaskPlan(state);
    expect(plan.tasks.map((task) => task.taskType)).toEqual(["DREAMER_ACTION", "CERENOVUS_ACTION", "GENERIC_DEMON_KILL"]);
    const demonTask = plan.tasks.find((task) => task.taskType === "GENERIC_DEMON_KILL");
    expect(demonTask).toBeDefined();
    expect(deriveOrdinaryNightTarget(demonTask!, state).targetPlayerId).toBe("p1");
    expect(deriveOrdinaryNightTarget(demonTask!, state).seed).toBe("seed-1");
    expect(getNextUnsettledOrdinaryNightTask(plan, { settlements: [] })?.taskId).toBe(plan.tasks[0]?.taskId);
  });

  it("keeps the historical C1 prefix and appends ten descriptor branches", () => {
    const authority = createTwoCAdditiveStructuralSchemaAuthority();
    expect(authority.status).toBe("HEALTHY");
    if (authority.status !== "HEALTHY") return;
    expect(authority.candidate.expectedEventCount).toBe(50);
    expect(authority.candidate.expectedBranchCount).toBe(69);
    expect(authority.candidate.deltaBindings).toEqual([
      expect.objectContaining({ deltaId: "B26_SEAMSTRESS_VARIADIC_DELTA" }),
      expect.objectContaining({ deltaId: "B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA" })
    ]);
  });
});
