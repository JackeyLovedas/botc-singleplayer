import {
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  cloneFirstNightTaskCatalogSnapshot,
  cloneFirstNightTaskPlan,
  cloneRoleSetupSnapshot,
  compareFirstNightTaskOrder,
  roleScheduledTaskId,
  serializeFirstNightTaskCatalogCanonical,
  systemScheduledTaskId,
  validateFirstNightTaskCatalogSnapshot,
  validateFirstNightTaskPlanCreatedPayload
} from "@botc/domain-core";
import type {
  FirstNightTaskCatalogSnapshot,
  FirstNightTaskDefinition,
  FirstNightTaskPlannerInput,
  FirstNightTaskPlanningFailure,
  FirstNightTaskPlanningResult,
  FirstNightTaskPlan,
  RoleFirstNightTaskDefinition,
  ScheduledTask,
  ScheduledTaskId
} from "@botc/domain-core";

const failure = (
  failureCode: FirstNightTaskPlanningFailure["failureCode"],
  message: string,
  conflictingTaskIds: readonly ScheduledTaskId[] = [],
  conflictingRoleIds: FirstNightTaskPlanningFailure["conflictingRoleIds"] = []
): FirstNightTaskPlanningFailure => ({
  status: "failure",
  failureCode,
  message,
  conflictingTaskIds,
  conflictingRoleIds
});

const roleDefinitionsByRoleId = (
  snapshot: FirstNightTaskCatalogSnapshot
): ReadonlyMap<string, RoleFirstNightTaskDefinition> => {
  const entries = snapshot.definitions
    .filter((definition): definition is RoleFirstNightTaskDefinition => definition.sourceKind === "ROLE")
    .map((definition) => [definition.roleId, definition] as const);

  return new Map(entries);
};

const systemDefinition = (
  snapshot: FirstNightTaskCatalogSnapshot,
  taskType: "MINION_INFO" | "DEMON_INFO"
): FirstNightTaskDefinition | undefined =>
  snapshot.definitions.find((definition) => definition.sourceKind === "SYSTEM" && definition.taskType === taskType);

const sameCatalogSnapshot = (
  left: FirstNightTaskCatalogSnapshot,
  right: FirstNightTaskCatalogSnapshot
): boolean =>
  left.taskCatalogVersion === right.taskCatalogVersion &&
  left.taskCatalogSignatureAlgorithm === right.taskCatalogSignatureAlgorithm &&
  left.taskCatalogSignature === right.taskCatalogSignature &&
  serializeFirstNightTaskCatalogCanonical(left) === serializeFirstNightTaskCatalogCanonical(right);

export class FirstNightTaskPlanner {
  private readonly taskCatalogSnapshot: FirstNightTaskCatalogSnapshot;

  public constructor(taskCatalogSnapshot: FirstNightTaskCatalogSnapshot) {
    this.taskCatalogSnapshot = cloneFirstNightTaskCatalogSnapshot(taskCatalogSnapshot);
  }

  public generate(input: FirstNightTaskPlannerInput): FirstNightTaskPlanningResult {
    const catalogValidation = validateFirstNightTaskCatalogSnapshot(this.taskCatalogSnapshot);
    if (!catalogValidation.valid) {
      return failure("InvalidTaskCatalog", catalogValidation.reason);
    }

    const inputCatalog = cloneFirstNightTaskCatalogSnapshot(input.taskCatalogSnapshot);
    const inputCatalogValidation = validateFirstNightTaskCatalogSnapshot(inputCatalog);
    if (!inputCatalogValidation.valid) {
      return failure("InvalidTaskCatalog", inputCatalogValidation.reason);
    }

    if (!sameCatalogSnapshot(this.taskCatalogSnapshot, inputCatalog)) {
      return failure("InvalidTaskCatalog", "Planner input task catalog must match the injected task catalog snapshot");
    }

    if (input.nightNumber !== 1) {
      return failure("InvalidFirstNightState", "First-night task planning requires nightNumber 1");
    }

    const catalog = inputCatalog;
    const tasks: ScheduledTask[] = [];

    const minionInfo = systemDefinition(catalog, "MINION_INFO");
    const demonInfo = systemDefinition(catalog, "DEMON_INFO");
    if (minionInfo === undefined || demonInfo === undefined || minionInfo.sourceKind !== "SYSTEM" || demonInfo.sourceKind !== "SYSTEM") {
      return failure("InvalidTaskCatalog", "First-night task catalog must include MINION_INFO and DEMON_INFO system definitions");
    }

    tasks.push({
      taskId: systemScheduledTaskId("MINION_INFO"),
      taskType: "MINION_INFO",
      taskClass: minionInfo.taskClass,
      orderKey: {
        baseOrder: minionInfo.baseOrder,
        insertionOrder: 0
      },
      source: {
        kind: "SYSTEM",
        systemTaskType: "MINION_INFO"
      },
      status: "PENDING",
      settlementPolicy: minionInfo.settlementPolicy
    });
    tasks.push({
      taskId: systemScheduledTaskId("DEMON_INFO"),
      taskType: "DEMON_INFO",
      taskClass: demonInfo.taskClass,
      orderKey: {
        baseOrder: demonInfo.baseOrder,
        insertionOrder: 0
      },
      source: {
        kind: "SYSTEM",
        systemTaskType: "DEMON_INFO"
      },
      status: "PENDING",
      settlementPolicy: demonInfo.settlementPolicy
    });

    const definitionsByRoleId = roleDefinitionsByRoleId(catalog);
    for (const assignment of input.assignment) {
      const definition = definitionsByRoleId.get(assignment.role.roleId);
      if (definition === undefined) {
        continue;
      }

      tasks.push({
        taskId: roleScheduledTaskId(definition.taskType, assignment.seatNumber),
        taskType: definition.taskType,
        taskClass: definition.taskClass,
        orderKey: {
          baseOrder: definition.baseOrder,
          insertionOrder: 0
        },
        source: {
          kind: "ROLE",
          playerId: assignment.playerId,
          seatNumber: assignment.seatNumber,
          role: cloneRoleSetupSnapshot(assignment.role)
        },
        status: "PENDING",
        settlementPolicy: definition.settlementPolicy
      });
    }

    const orderedTasks = [...tasks].sort(compareFirstNightTaskOrder);
    const taskPlan: FirstNightTaskPlan = {
      nightNumber: 1,
      taskPlanVersion: CURRENT_FIRST_NIGHT_TASK_PLAN_VERSION,
      taskCatalogVersion: catalog.taskCatalogVersion,
      taskCatalogSignatureAlgorithm: catalog.taskCatalogSignatureAlgorithm,
      taskCatalogSignature: catalog.taskCatalogSignature,
      taskCatalogSnapshot: catalog,
      rosterVersion: input.firstNight.rosterVersion,
      assignmentAlgorithmVersion: input.firstNight.assignmentAlgorithmVersion,
      roleCatalogSignature: input.firstNight.roleCatalogSignature,
      knowledgeModelVersion: SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
      knowledgeStage: INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
      tasks: orderedTasks
    };

    const planValidation = validateFirstNightTaskPlanCreatedPayload({
      rulesBaselineVersion: input.initialPrivateKnowledge.rulesBaselineVersion,
      ...taskPlan
    }, {
      setup: input.setup,
      roster: input.roster,
      assignment: input.assignment,
      firstNight: input.firstNight,
      initialPrivateKnowledge: input.initialPrivateKnowledge
    });
    if (!planValidation.valid) {
      return failure("InvalidTaskPlan", planValidation.reason);
    }

    return {
      status: "success",
      taskPlan: cloneFirstNightTaskPlan(taskPlan)
    };
  }
}
