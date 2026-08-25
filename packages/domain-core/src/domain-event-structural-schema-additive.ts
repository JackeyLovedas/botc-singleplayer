import {
  createFullC1StructuralSchemaAuthority,
  createStructuralSchemaAuthority,
  type HealthyStructuralSchemaAuthorityV1,
  type StructuralSchemaAuthorityResultV1,
  type StructuralSchemaCandidateV1,
  type StructuralSchemaNodeBindingV1,
  type StructuralSchemaRootV1
} from "./domain-event-structural-schema-ast.js";
import { createCanonicalSchemaArtifact } from "./domain-event-structural-schema-catalog.js";

export type C1AdditiveDescriptorV1 = {
  readonly eventOrdinal: number;
  readonly eventType: string;
  readonly branchOrdinal: number;
  readonly branchId: string;
  readonly versionPolicy: StructuralSchemaRootV1["versionPolicy"];
  readonly rootNodeId: string;
  readonly resultTypeName: string;
  readonly nodeBindings: readonly StructuralSchemaNodeBindingV1[];
  readonly deltaBindings: readonly [];
};

export type C1AdditiveDescriptorInputV1 = {
  readonly baseline: HealthyStructuralSchemaAuthorityV1;
  readonly additions: readonly C1AdditiveDescriptorV1[];
};

export type C1AdditiveDescriptorFailureV1 = {
  readonly ok: false;
  readonly diagnostic: {
    readonly code:
      | "INVALID_BRANCH_INVENTORY"
      | "NODE_BINDING_MISMATCH"
      | "DUPLICATE_NODE_ID"
      | "INVALID_DELTA_BINDING"
      | "ORDINAL_LIMIT_EXCEEDED";
    readonly detail: string;
    readonly failClosed: true;
  };
};

export type C1AdditiveDescriptorResultV1 =
  | { readonly ok: true; readonly candidate: StructuralSchemaCandidateV1 }
  | C1AdditiveDescriptorFailureV1;

const failure = (
  code: C1AdditiveDescriptorFailureV1["diagnostic"]["code"],
  detail: string
): C1AdditiveDescriptorFailureV1 => ({
  ok: false,
  diagnostic: Object.freeze({ code, detail, failClosed: true })
});

const candidateProjectionEqual = (
  left: HealthyStructuralSchemaAuthorityV1,
  right: HealthyStructuralSchemaAuthorityV1
): boolean => {
  const leftArtifact = createCanonicalSchemaArtifact(left);
  const rightArtifact = createCanonicalSchemaArtifact(right);
  return (
    leftArtifact.byteLength === rightArtifact.byteLength &&
    leftArtifact.sha256 === rightArtifact.sha256 &&
    leftArtifact.lines.length === rightArtifact.lines.length &&
    leftArtifact.lines.every((line, index) => line === rightArtifact.lines[index])
  );
};

const isDenseAppend = (
  additions: readonly C1AdditiveDescriptorV1[],
  baseline: HealthyStructuralSchemaAuthorityV1
): boolean => {
  let nextBranchOrdinal = baseline.candidate.expectedBranchCount + 1;
  let nextEventOrdinal = baseline.candidate.expectedEventCount + 1;
  let currentEventOrdinal: number | undefined;
  let currentEventType: string | undefined;
  for (const addition of additions) {
    if (addition.branchOrdinal !== nextBranchOrdinal) return false;
    nextBranchOrdinal += 1;
    if (currentEventOrdinal === undefined) {
      currentEventOrdinal = addition.eventOrdinal;
      currentEventType = addition.eventType;
      if (addition.eventOrdinal !== nextEventOrdinal) return false;
      nextEventOrdinal += 1;
    } else if (addition.eventOrdinal !== currentEventOrdinal) {
      if (addition.eventOrdinal !== nextEventOrdinal) return false;
      currentEventOrdinal = addition.eventOrdinal;
      currentEventType = addition.eventType;
      nextEventOrdinal += 1;
    } else if (addition.eventType !== currentEventType) {
      return false;
    }
  }
  return true;
};

const countNewEvents = (additions: readonly C1AdditiveDescriptorV1[]): number =>
  new Set(additions.map((addition) => addition.eventOrdinal)).size;

export const createC1AdditiveStructuralSchemaCandidate = (
  input: C1AdditiveDescriptorInputV1
): C1AdditiveDescriptorResultV1 => {
  const full = createFullC1StructuralSchemaAuthority();
  if (full.status === "UNHEALTHY") {
    return failure("INVALID_BRANCH_INVENTORY", "FULL_C1 authority is not healthy");
  }
  if (input.baseline.status !== "HEALTHY" || !candidateProjectionEqual(input.baseline, full)) {
    return failure("NODE_BINDING_MISMATCH", "baseline is not the exact accepted FULL_C1 projection");
  }
  if (!isDenseAppend(input.additions, input.baseline)) {
    return failure("INVALID_BRANCH_INVENTORY", "additions are not dense event/branch append");
  }

  const baselineNodeIds = new Set(input.baseline.candidate.nodeBindings.map((binding) => binding.nodeId));
  const additionNodeIds = new Set<string>();
  const branchIds = new Set(input.baseline.candidate.roots.map((root) => root.branchId));
  for (const addition of input.additions) {
    if (addition.deltaBindings.length !== 0) {
      return failure("INVALID_DELTA_BINDING", "additions.deltaBindings must be exactly empty");
    }
    if (branchIds.has(addition.branchId)) {
      return failure("INVALID_BRANCH_INVENTORY", `duplicate branch ID ${addition.branchId}`);
    }
    branchIds.add(addition.branchId);
    for (const binding of addition.nodeBindings) {
      if (baselineNodeIds.has(binding.nodeId) || additionNodeIds.has(binding.nodeId)) {
        return failure("DUPLICATE_NODE_ID", `duplicate node ID ${binding.nodeId}`);
      }
      if (binding.nodeId !== binding.node.nodeId) {
        return failure("NODE_BINDING_MISMATCH", `node binding ${binding.nodeId} differs from node identity`);
      }
      additionNodeIds.add(binding.nodeId);
    }
  }

  const additions = input.additions.map((addition) => ({
    branchOrdinal: addition.branchOrdinal,
    branchId: addition.branchId,
    eventOrdinal: addition.eventOrdinal,
    eventType: addition.eventType,
    versionPolicy: addition.versionPolicy,
    rootNodeId: addition.rootNodeId,
    resultTypeName: addition.resultTypeName
  } satisfies StructuralSchemaRootV1));
  const candidate: StructuralSchemaCandidateV1 = {
    ...input.baseline.candidate,
    expectedEventCount: input.baseline.candidate.expectedEventCount + countNewEvents(input.additions),
    expectedBranchCount: input.baseline.candidate.expectedBranchCount + additions.length,
    expectedExplicitVersionBranchCount:
      input.baseline.candidate.expectedExplicitVersionBranchCount +
      additions.filter((addition) => addition.versionPolicy.kind === "EXPLICIT_LITERAL").length,
    expectedUnversionedBranchCount:
      input.baseline.candidate.expectedUnversionedBranchCount +
      additions.filter((addition) => addition.versionPolicy.kind === "UNVERSIONED").length,
    roots: [...input.baseline.candidate.roots, ...additions],
    nodeBindings: [
      ...input.baseline.candidate.nodeBindings,
      ...input.additions.flatMap((addition) => addition.nodeBindings)
    ],
    deltaBindings: input.baseline.candidate.deltaBindings
  };
  return { ok: true, candidate };
};

export const createC1AdditiveStructuralSchemaAuthority = (
  input: C1AdditiveDescriptorInputV1
): StructuralSchemaAuthorityResultV1 => {
  const result = createC1AdditiveStructuralSchemaCandidate(input);
  if (!result.ok) {
    return {
      status: "UNHEALTHY",
      diagnostic: {
        code: result.diagnostic.code,
        phase: "C1_ADDITIVE_PREFLIGHT",
        nodeId: null,
        detail: result.diagnostic.detail,
        failClosed: true
      }
    };
  }
  return createStructuralSchemaAuthority(result.candidate);
};
