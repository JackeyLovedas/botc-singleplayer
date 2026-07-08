import type { AssignmentGenerationResult, AssignmentGeneratorInput } from "@botc/domain-core";

export type CharacterAssignmentGeneratorPort = {
  readonly generate: (input: AssignmentGeneratorInput) => AssignmentGenerationResult;
};
