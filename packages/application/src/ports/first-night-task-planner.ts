import type { FirstNightTaskPlannerInput, FirstNightTaskPlanningResult } from "@botc/domain-core";

export type FirstNightTaskPlannerPort = {
  readonly generate: (input: FirstNightTaskPlannerInput) => FirstNightTaskPlanningResult;
};
