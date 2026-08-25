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
      | "INVALID_OBJECT_SHAPE"
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

const exactDataKeys = (value: unknown, keys: readonly string[]): boolean => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const object = value;
  const prototype = Reflect.getPrototypeOf(object);
  if (prototype !== Object.prototype && prototype !== null) return false;
  const ownKeys = Object.getOwnPropertyNames(object);
  if (Object.getOwnPropertySymbols(object).length !== 0 || ownKeys.length !== keys.length) return false;
  const expected = new Set(keys);
  if (!ownKeys.every((key) => expected.has(key))) return false;
  return ownKeys.every((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(object, key);
    return descriptor !== undefined && "value" in descriptor && !descriptor.get && !descriptor.set && descriptor.enumerable;
  });
};

const isDenseDataArray = (value: unknown): value is readonly unknown[] => {
  if (!Array.isArray(value) || Reflect.getPrototypeOf(value) !== Array.prototype || Object.getOwnPropertySymbols(value).length !== 0) return false;
  const ownKeys = Object.getOwnPropertyNames(value);
  if (ownKeys.length !== value.length + 1 || !ownKeys.includes("length")) return false;
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (descriptor === undefined || !("value" in descriptor) || descriptor.get || descriptor.set || !descriptor.enumerable) return false;
  }
  return true;
};

const isDataOnlyGraph = (value: unknown, ancestors = new WeakSet<object>()): boolean => {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object") return false;
  const object = value;
  if (ancestors.has(object)) return false;
  ancestors.add(object);
  if (Array.isArray(object)) {
    if (!isDenseDataArray(object)) return false;
    for (const item of object) if (!isDataOnlyGraph(item, ancestors)) return false;
  } else {
    const prototype = Reflect.getPrototypeOf(object);
    if (prototype !== Object.prototype && prototype !== null) return false;
    if (Object.getOwnPropertySymbols(object).length !== 0) return false;
    for (const key of Object.getOwnPropertyNames(object)) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (descriptor === undefined || !("value" in descriptor) || descriptor.get || descriptor.set || !descriptor.enumerable) return false;
      if (!isDataOnlyGraph(descriptor.value, ancestors)) return false;
    }
  }
  ancestors.delete(object);
  return true;
};

const validateAdditiveInputRuntimeShape = (input: unknown): string | null => {
  if (!isDataOnlyGraph(input) || !exactDataKeys(input, ["baseline", "additions"])) {
    return "additive input must be an exact acyclic data record";
  }
  const candidateInput = input as { readonly baseline: unknown; readonly additions: unknown };
  if (!exactDataKeys(candidateInput.baseline, ["status", "candidate", "traversal", "uniqueGraphCensus", "expandedOccurrenceCensus", "health"])) {
    return "baseline must be an exact healthy authority record";
  }
  if ((candidateInput.baseline as { status: unknown }).status !== "HEALTHY") return "baseline must be healthy";
  if (!isDenseDataArray(candidateInput.additions)) return "additions must be an exact dense array";
  for (const addition of candidateInput.additions) {
    if (!exactDataKeys(addition, ["eventOrdinal", "eventType", "branchOrdinal", "branchId", "versionPolicy", "rootNodeId", "resultTypeName", "nodeBindings", "deltaBindings"])) {
      return "addition must be an exact data record";
    }
    const descriptor = addition as Record<string, unknown>;
    if (typeof descriptor.eventOrdinal !== "number" || !Number.isSafeInteger(descriptor.eventOrdinal) || descriptor.eventOrdinal < 1 || typeof descriptor.eventType !== "string" ||
      typeof descriptor.branchOrdinal !== "number" || !Number.isSafeInteger(descriptor.branchOrdinal) || descriptor.branchOrdinal < 1 || typeof descriptor.branchId !== "string" ||
      typeof descriptor.rootNodeId !== "string" || typeof descriptor.resultTypeName !== "string") {
      return "addition scalar fields are invalid";
    }
    const versionPolicy = descriptor.versionPolicy;
    if (exactDataKeys(versionPolicy, ["kind"])) {
      if ((versionPolicy as { kind: unknown }).kind !== "UNVERSIONED") return "version policy is invalid";
    } else if (exactDataKeys(versionPolicy, ["kind", "fieldName", "acceptedLiteral"])) {
      if ((versionPolicy as { kind: unknown }).kind !== "EXPLICIT_LITERAL" || typeof (versionPolicy as { fieldName: unknown }).fieldName !== "string") return "version policy is invalid";
    } else return "version policy is invalid";
    const nodeBindings = descriptor.nodeBindings;
    const deltaBindings = descriptor.deltaBindings;
    if (!isDenseDataArray(nodeBindings) || !isDenseDataArray(deltaBindings)) {
      return "node bindings and delta bindings must be dense";
    }
    for (const binding of nodeBindings) {
      if (!exactDataKeys(binding, ["nodeId", "node"]) || typeof (binding as { nodeId: unknown }).nodeId !== "string" || typeof (binding as { node: unknown }).node !== "object" || (binding as { node: object }).node === null) {
        return "node binding is invalid";
      }
    }
  }
  return null;
};

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
  let inputFailure: string | null;
  try {
    inputFailure = validateAdditiveInputRuntimeShape(input);
  } catch {
    return failure("INVALID_OBJECT_SHAPE", "additive input capture failed closed");
  }
  if (inputFailure !== null) return failure("INVALID_OBJECT_SHAPE", inputFailure);
  if (input.additions.some((addition) => addition.deltaBindings.length !== 0)) {
    return failure("INVALID_DELTA_BINDING", "additions.deltaBindings must be exactly empty");
  }
  const full = createFullC1StructuralSchemaAuthority();
  if (full.status === "UNHEALTHY") {
    return failure("INVALID_BRANCH_INVENTORY", "FULL_C1 authority is not healthy");
  }
  let baselineMatches = false;
  try {
    baselineMatches = input.baseline.status === "HEALTHY" && candidateProjectionEqual(input.baseline, full);
  } catch {
    return failure("INVALID_OBJECT_SHAPE", "baseline canonical projection failed closed");
  }
  if (!baselineMatches) {
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
