import { describe, expect, it } from "vitest";
import {
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  RULES_BASELINE_VERSION,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_ROSTER_VERSION,
  cloneFirstNightTaskCatalogSnapshot,
  createFixedPlayerRoster,
  playerId
} from "@botc/domain-core";
import type {
  FirstNightTaskCatalogSnapshot,
  FirstNightTaskPlannerInput,
  InitialPrivateKnowledgeEstablishedPayload
} from "@botc/domain-core";
import { FirstNightTaskPlanner } from "@botc/task-engine";
import {
  testAssignmentGenerator,
  testInitialPrivateKnowledgeBuilder,
  testFirstNightTaskCatalog,
  testSetupGenerator
} from "@botc/test-harness";

const plannerInput = (
  taskCatalogSnapshot: FirstNightTaskCatalogSnapshot = testFirstNightTaskCatalog
): FirstNightTaskPlannerInput => {
  const setupResult = testSetupGenerator.generate({
    scriptId: "sects-and-violets",
    rootSeed: "golden-seed",
    playerCount: 12,
    constraints: {}
  });
  if (setupResult.status === "failure") {
    throw new Error(setupResult.message);
  }

  const roster = createFixedPlayerRoster({
    humanPlayerId: playerId("player-human-1"),
    humanDisplayName: "Human Player",
    humanSeatNumber: 5
  });
  const assignmentResult = testAssignmentGenerator.generate({
    rootSeed: "golden-seed",
    rosterVersion: SUPPORTED_ROSTER_VERSION,
    roster,
    actualRoles: setupResult.setup.actualRoles,
    roleCatalogSignature: setupResult.setup.roleCatalogSignature
  });
  if (assignmentResult.status === "failure") {
    throw new Error(assignmentResult.message);
  }

  const firstNight = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    initializationVersion: SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
    nightNumber: 1,
    rosterVersion: SUPPORTED_ROSTER_VERSION,
    assignmentAlgorithmVersion: assignmentResult.assignment.assignmentAlgorithmVersion,
    roleCatalogSignature: setupResult.setup.roleCatalogSignature
  } as const;
  const knowledgeResult = testInitialPrivateKnowledgeBuilder.generate({
    roster,
    assignment: assignmentResult.assignment.assignments,
    setup: setupResult.setup
  });
  if (knowledgeResult.status === "failure") {
    throw new Error(knowledgeResult.message);
  }
  const initialPrivateKnowledge: InitialPrivateKnowledgeEstablishedPayload = {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    knowledgeModelVersion: SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
    knowledgeStage: INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
    rosterVersion: SUPPORTED_ROSTER_VERSION,
    assignmentAlgorithmVersion: assignmentResult.assignment.assignmentAlgorithmVersion,
    roleCatalogSignature: setupResult.setup.roleCatalogSignature,
    entries: knowledgeResult.knowledge.entries
  };

  return {
    nightNumber: 1,
    setup: setupResult.setup,
    roster,
    assignment: assignmentResult.assignment.assignments,
    firstNight,
    initialPrivateKnowledge,
    taskCatalogSnapshot
  };
};

const generatePlan = (planner = new FirstNightTaskPlanner(testFirstNightTaskCatalog)) => {
  const result = planner.generate(plannerInput());
  if (result.status === "failure") {
    throw new Error(result.message);
  }
  return result.taskPlan;
};

describe("FirstNightTaskPlanner", () => {
  it("creates the golden first-night task plan in canonical order", () => {
    const plan = generatePlan();

    expect(plan.taskPlanVersion).toBe("first-night-task-plan-v2");

    expect(plan.tasks.map((task) => [task.taskType, task.source.kind, task.source.kind === "ROLE" ? task.source.seatNumber : "system"])).toStrictEqual([
      ["PHILOSOPHER_ACTION", "ROLE", 5],
      ["MINION_INFO", "SYSTEM", "system"],
      ["DEMON_INFO", "SYSTEM", "system"],
      ["EVIL_TWIN_SETUP", "ROLE", 2],
      ["WITCH_ACTION", "ROLE", 8],
      ["DREAMER_ACTION", "ROLE", 12]
    ]);
    expect(plan.tasks.map((task) => task.taskId)).toStrictEqual([
      "first-night-v1:PHILOSOPHER_ACTION:seat-05",
      "first-night-v1:MINION_INFO:system",
      "first-night-v1:DEMON_INFO:system",
      "first-night-v1:EVIL_TWIN_SETUP:seat-02",
      "first-night-v1:WITCH_ACTION:seat-08",
      "first-night-v1:DREAMER_ACTION:seat-12"
    ]);
  });

  it("orders supported Snake Charmer before base Clockmaker before Dreamer", () => {
    const supportedOrder = testFirstNightTaskCatalog.definitions
      .filter((definition) =>
        definition.taskType === "SNAKE_CHARMER_ACTION" ||
        definition.taskType === "CLOCKMAKER_INFORMATION" ||
        definition.taskType === "DREAMER_ACTION"
      )
      .sort((left, right) => left.baseOrder - right.baseOrder)
      .map((definition) => [definition.taskType, definition.baseOrder]);

    expect(supportedOrder).toStrictEqual([
      ["SNAKE_CHARMER_ACTION", 400],
      ["CLOCKMAKER_INFORMATION", 800],
      ["DREAMER_ACTION", 900]
    ]);
  });

  it("always creates MINION_INFO and DEMON_INFO without frozen recipients", () => {
    const plan = generatePlan();
    const systemTasks = plan.tasks.filter((task) => task.source.kind === "SYSTEM");

    expect(systemTasks.map((task) => task.taskType)).toStrictEqual(["MINION_INFO", "DEMON_INFO"]);
    for (const task of systemTasks) {
      expect(task.settlementPolicy).toBe("RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT");
      expect(Object.keys(task.source).sort()).toStrictEqual(["kind", "systemTaskType"]);
    }
  });

  it("creates role tasks only for in-play roles with catalog definitions", () => {
    const plan = generatePlan();
    const roleIds = plan.tasks
      .filter((task) => task.source.kind === "ROLE")
      .map((task) => task.source.kind === "ROLE" ? task.source.role.roleId : "");

    expect(roleIds).toStrictEqual(["philosopher", "evil_twin", "witch", "dreamer"]);
    expect(roleIds).not.toContain("vigormortis");
    expect(roleIds).not.toContain("flowergirl");
    expect(roleIds).not.toContain("town_crier");
    expect(roleIds).not.toContain("oracle");
    expect(roleIds).not.toContain("juggler");
    expect(roleIds).not.toContain("pit_hag");
  });

  it("sets every base task to PENDING with insertionOrder 0 and source reevaluation for role tasks", () => {
    const plan = generatePlan();

    for (const task of plan.tasks) {
      expect(task.status).toBe("PENDING");
      expect(task.orderKey.insertionOrder).toBe(0);
      if (task.source.kind === "ROLE") {
        expect(task.settlementPolicy).toBe("REEVALUATE_SOURCE_AT_SETTLEMENT");
      }
    }
  });

  it("is deterministic and does not use Math.random", () => {
    const originalRandom = Math.random;
    Math.random = () => {
      throw new Error("Math.random must not be used");
    };

    try {
      const first = generatePlan();
      const second = generatePlan();

      expect(second).toStrictEqual(first);
    } finally {
      Math.random = originalRandom;
    }
  });

  it("does not mutate input objects and returns defensive copies", () => {
    const input = plannerInput();
    const before = JSON.stringify(input);
    const planner = new FirstNightTaskPlanner(input.taskCatalogSnapshot);
    const result = planner.generate(input);
    if (result.status === "failure") {
      throw new Error(result.message);
    }

    expect(JSON.stringify(input)).toBe(before);

    const mutablePlan = result.taskPlan as unknown as { tasks: { taskId: string }[] };
    mutablePlan.tasks[0] = { taskId: "mutated" };

    const regenerated = planner.generate(input);
    if (regenerated.status === "failure") {
      throw new Error(regenerated.message);
    }

    expect(regenerated.taskPlan.tasks[0]?.taskId).toBe("first-night-v1:PHILOSOPHER_ACTION:seat-05");
  });

  it("rejects an invalid task catalog without creating a partial plan", () => {
    const invalidCatalog = cloneFirstNightTaskCatalogSnapshot(testFirstNightTaskCatalog);
    const mutated = {
      ...invalidCatalog,
      taskCatalogSignature: "canonical-first-night-task-catalog-v1:00000000"
    };
    const planner = new FirstNightTaskPlanner(mutated);

    expect(planner.generate(plannerInput(mutated))).toMatchObject({
      status: "failure",
      failureCode: "InvalidTaskCatalog"
    });
  });

  it("rejects an input task catalog that does not match the injected catalog", () => {
    const mutatedInputCatalog = {
      ...cloneFirstNightTaskCatalogSnapshot(testFirstNightTaskCatalog),
      taskCatalogSignature: "canonical-first-night-task-catalog-v1:00000000"
    };
    const planner = new FirstNightTaskPlanner(testFirstNightTaskCatalog);

    expect(planner.generate(plannerInput(mutatedInputCatalog))).toMatchObject({
      status: "failure",
      failureCode: "InvalidTaskCatalog"
    });
  });
});
