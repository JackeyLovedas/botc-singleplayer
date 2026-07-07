import type { SetupGenerationResult, SetupGeneratorInput } from "@botc/domain-core";

export type SetupGeneratorPort = {
  readonly generate: (input: SetupGeneratorInput) => SetupGenerationResult;
};
