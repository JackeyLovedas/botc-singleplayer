import type { InitialPrivateKnowledgeGenerationResult, InitialPrivateKnowledgeGeneratorInput } from "@botc/domain-core";

export type InitialPrivateKnowledgeBuilderPort = {
  readonly generate: (input: InitialPrivateKnowledgeGeneratorInput) => InitialPrivateKnowledgeGenerationResult;
};
