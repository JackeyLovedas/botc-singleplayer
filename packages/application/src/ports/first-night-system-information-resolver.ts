import type {
  FirstNightSystemInformationResolverInput,
  FirstNightSystemInformationResolutionResult
} from "@botc/domain-core";

export type FirstNightSystemInformationResolverPort = {
  readonly resolve: (input: FirstNightSystemInformationResolverInput) => FirstNightSystemInformationResolutionResult;
};
