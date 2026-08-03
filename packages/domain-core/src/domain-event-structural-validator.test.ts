import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_IDS,
  DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY,
  DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE,
  DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY,
  DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY_TUPLE,
  DOMAIN_EVENT_STRUCTURAL_FAILURE_CONTEXT_IDS,
  boundDomainEventStructuralPath,
  createDomainEventStructuralDiagnostic,
  readStructurallyValidatedDomainEvent
} from "./canonical-domain-event.js";
import {
  DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION,
  DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
  DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION,
  DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION,
  STRUCTURAL_ID_ALIASES_V1,
  STRUCTURAL_SCHEMA_NODE_KINDS,
  createFullC1StructuralSchemaAuthority,
  createStructuralSchemaAuthorityForTestCandidate
} from "./domain-event-structural-schema-ast.js";
import type {
  HealthyStructuralSchemaAuthorityV1,
  StructuralSchemaCandidateV1,
  StructuralSchemaNodeV1,
  StructuralSchemaRootV1
} from "./domain-event-structural-schema-ast.js";
import {
  admitC1Authority,
  inspectDefaultDomainEventStructuralAuthorityForTest,
  validateCapturedDomainEventStructureWithObservationForTest,
  validateDomainEventStructuralNodeForTest,
  validateDomainEventStructuralRefinementForTest,
  validateDomainEventStructure,
  validateDomainEventStructureWithObservationForTest
} from "./domain-event-structural-validator.js";

const authorityResult = createFullC1StructuralSchemaAuthority();
if (authorityResult.status !== "HEALTHY") {
  throw new Error("C1 authority must be healthy for C tests");
}
const authority: HealthyStructuralSchemaAuthorityV1 = authorityResult;
const nodesById = new Map(
  authority.candidate.nodeBindings.map((binding) => [
    binding.nodeId,
    binding.node
  ] as const)
);

const node = (nodeId: string): StructuralSchemaNodeV1 => {
  const value = nodesById.get(nodeId);
  if (value === undefined) {
    throw new Error("missing test authority node");
  }
  return value;
};

const sampleForNode = (nodeId: string): unknown => {
  const schema = node(nodeId);
  switch (schema.kind) {
    case "NULL":
      return null;
    case "BOOLEAN":
      return false;
    case "SAFE_INTEGER":
      return 1;
    case "STRING":
      return "value";
    case "LITERAL":
      return schema.value;
    case "ENUM":
      return schema.values[0];
    case "NULLABLE":
      return null;
    case "EXACT_RECORD":
      return Object.fromEntries(
        schema.fields.map((field) => [
          field.fieldName,
          sampleForNode(field.childNodeId)
        ])
      );
    case "ARRAY":
      return [];
    case "NON_EMPTY_ARRAY":
      return [sampleForNode(schema.elementNodeId)];
    case "BOUNDED_ARRAY":
      return Array.from({ length: schema.minItems }, () =>
        sampleForNode(schema.elementNodeId)
      );
    case "TUPLE":
      return schema.elementNodeIds.map(sampleForNode);
    case "TAGGED_UNION": {
      const branch = schema.branches[0];
      if (branch === undefined) {
        throw new Error("empty tagged union in healthy authority");
      }
      const value = sampleForNode(branch.childNodeId);
      if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
      ) {
        throw new Error("tagged branch must produce a record");
      }
      return { ...value, [schema.tagField]: branch.tagLiteral };
    }
    case "CLOSED_UNION": {
      const first = schema.branchNodeIds[0];
      if (first === undefined) {
        throw new Error("empty closed union in healthy authority");
      }
      return sampleForNode(first);
    }
    case "REFINEMENT":
      return schema.refinementKind === "ID_STRING" ? "id" : "value";
  }
};

type PublicAstMutationMode =
  | "RECORD_MISSING"
  | "RECORD_EXTRA"
  | "KIND_MISMATCH"
  | "LITERAL_MISMATCH"
  | "CARDINALITY_MISMATCH"
  | "CLOSED_UNION_ZERO"
  | "REFINEMENT_REJECTED";

type PublicAstMutation = {
  readonly value: unknown;
  readonly matched: boolean;
  readonly mutationPath: string;
};

const mutatePublicAstSample = (
  nodeId: string,
  mode: PublicAstMutationMode,
  targetTaggedContext: boolean,
  activeTaggedContext = false,
  path = nodeId
): PublicAstMutation => {
  const schema = node(nodeId);
  const contextMatches = activeTaggedContext === targetTaggedContext;
  if (contextMatches && mode === "RECORD_MISSING" && schema.kind === "EXACT_RECORD") {
    const required = schema.fields.find((field) => field.required);
    if (required !== undefined) {
      const value = cloneRecord(sampleForNode(nodeId));
      delete value[required.fieldName];
      return { value, matched: true, mutationPath: `${path}.${required.fieldName}` };
    }
  }
  if (contextMatches && mode === "RECORD_EXTRA" && schema.kind === "EXACT_RECORD") {
    return {
      value: { ...cloneRecord(sampleForNode(nodeId)), __c_extra: true },
      matched: true,
      mutationPath: `${path}.__c_extra`
    };
  }
  if (contextMatches && mode === "KIND_MISMATCH" && schema.kind === "STRING") {
    return { value: {}, matched: true, mutationPath: path };
  }
  if (
    contextMatches &&
    mode === "LITERAL_MISMATCH" &&
    schema.kind === "LITERAL" &&
    typeof schema.value === "string"
  ) {
    return { value: "__C_UNKNOWN_LITERAL__", matched: true, mutationPath: path };
  }
  if (
    contextMatches &&
    mode === "CARDINALITY_MISMATCH" &&
    (schema.kind === "NON_EMPTY_ARRAY" ||
      schema.kind === "BOUNDED_ARRAY" ||
      schema.kind === "TUPLE")
  ) {
    const value =
      schema.kind === "NON_EMPTY_ARRAY"
        ? []
        : schema.kind === "TUPLE"
          ? [...schema.elementNodeIds.map(sampleForNode), null]
          : schema.minItems > 0
            ? []
            : Array.from(
                { length: schema.maxItems + 1 },
                () => sampleForNode(schema.elementNodeId)
              );
    return { value, matched: true, mutationPath: path };
  }
  if (
    contextMatches &&
    mode === "CLOSED_UNION_ZERO" &&
    schema.kind === "CLOSED_UNION"
  ) {
    return {
      value: { __c_closed_union_no_match: true },
      matched: true,
      mutationPath: path
    };
  }
  if (contextMatches && mode === "REFINEMENT_REJECTED" && schema.kind === "REFINEMENT") {
    return { value: "   ", matched: true, mutationPath: path };
  }

  switch (schema.kind) {
    case "NULL":
    case "BOOLEAN":
    case "SAFE_INTEGER":
    case "STRING":
    case "LITERAL":
    case "ENUM":
      return { value: sampleForNode(nodeId), matched: false, mutationPath: path };
    case "NULLABLE": {
      const child = mutatePublicAstSample(
        schema.childNodeId,
        mode,
        targetTaggedContext,
        activeTaggedContext,
        `${path}.nullable`
      );
      return child.matched
        ? child
        : { value: sampleForNode(nodeId), matched: false, mutationPath: path };
    }
    case "EXACT_RECORD": {
      const value = cloneRecord(sampleForNode(nodeId));
      for (const field of schema.fields) {
        const child = mutatePublicAstSample(
          field.childNodeId,
          mode,
          targetTaggedContext,
          activeTaggedContext,
          `${path}.${field.fieldName}`
        );
        if (child.matched) {
          value[field.fieldName] = child.value;
          return { value, matched: true, mutationPath: child.mutationPath };
        }
      }
      return { value, matched: false, mutationPath: path };
    }
    case "ARRAY":
    case "NON_EMPTY_ARRAY":
    case "BOUNDED_ARRAY": {
      const child = mutatePublicAstSample(
        schema.elementNodeId,
        mode,
        targetTaggedContext,
        activeTaggedContext,
        `${path}[0]`
      );
      if (!child.matched) {
        return { value: sampleForNode(nodeId), matched: false, mutationPath: path };
      }
      const length = schema.kind === "ARRAY" ? 1 : Math.max(1, schema.minItems);
      const value = Array.from({ length }, () => sampleForNode(schema.elementNodeId));
      value[0] = child.value;
      return { value, matched: true, mutationPath: child.mutationPath };
    }
    case "TUPLE": {
      const value = schema.elementNodeIds.map(sampleForNode);
      for (let index = 0; index < schema.elementNodeIds.length; index += 1) {
        const childNodeId = schema.elementNodeIds[index];
        if (childNodeId === undefined) continue;
        const child = mutatePublicAstSample(
          childNodeId,
          mode,
          targetTaggedContext,
          activeTaggedContext,
          `${path}[${index}]`
        );
        if (child.matched) {
          value[index] = child.value;
          return { value, matched: true, mutationPath: child.mutationPath };
        }
      }
      return { value, matched: false, mutationPath: path };
    }
    case "TAGGED_UNION": {
      if (!targetTaggedContext) {
        return { value: sampleForNode(nodeId), matched: false, mutationPath: path };
      }
      for (const branch of schema.branches) {
        const child = mutatePublicAstSample(
          branch.childNodeId,
          mode,
          true,
          true,
          `${path}<${branch.branchOrdinal}>`
        );
        if (child.matched) {
          const value = cloneRecord(child.value);
          value[schema.tagField] = branch.tagLiteral;
          return { value, matched: true, mutationPath: child.mutationPath };
        }
      }
      return { value: sampleForNode(nodeId), matched: false, mutationPath: path };
    }
    case "CLOSED_UNION": {
      for (const branchNodeId of schema.branchNodeIds) {
        const child = mutatePublicAstSample(
          branchNodeId,
          mode,
          targetTaggedContext,
          activeTaggedContext,
          `${path}|${branchNodeId}`
        );
        if (child.matched) return child;
      }
      return { value: sampleForNode(nodeId), matched: false, mutationPath: path };
    }
    case "REFINEMENT": {
      const child = mutatePublicAstSample(
        schema.baseNodeId,
        mode,
        targetTaggedContext,
        activeTaggedContext,
        `${path}.base`
      );
      return child.matched
        ? child
        : { value: sampleForNode(nodeId), matched: false, mutationPath: path };
    }
  }
};

const mutateFirstTaggedDiscriminator = (
  nodeId: string,
  mode: "MISSING" | "WRONG_KIND" | "UNKNOWN",
  path = nodeId
): PublicAstMutation => {
  const schema = node(nodeId);
  if (schema.kind === "TAGGED_UNION") {
    const value = cloneRecord(sampleForNode(nodeId));
    if (mode === "MISSING") delete value[schema.tagField];
    else if (mode === "WRONG_KIND") value[schema.tagField] = {};
    else value[schema.tagField] = "__C_UNKNOWN_TAG__";
    return {
      value,
      matched: true,
      mutationPath: `${path}.${schema.tagField}`
    };
  }
  switch (schema.kind) {
    case "EXACT_RECORD": {
      const value = cloneRecord(sampleForNode(nodeId));
      for (const field of schema.fields) {
        const child = mutateFirstTaggedDiscriminator(
          field.childNodeId,
          mode,
          `${path}.${field.fieldName}`
        );
        if (child.matched) {
          value[field.fieldName] = child.value;
          return { value, matched: true, mutationPath: child.mutationPath };
        }
      }
      break;
    }
    case "ARRAY":
    case "NON_EMPTY_ARRAY":
    case "BOUNDED_ARRAY": {
      const child = mutateFirstTaggedDiscriminator(
        schema.elementNodeId,
        mode,
        `${path}[0]`
      );
      if (child.matched) {
        const length = schema.kind === "ARRAY" ? 1 : Math.max(1, schema.minItems);
        const value = Array.from({ length }, () => sampleForNode(schema.elementNodeId));
        value[0] = child.value;
        return { value, matched: true, mutationPath: child.mutationPath };
      }
      break;
    }
    case "TUPLE": {
      const value = schema.elementNodeIds.map(sampleForNode);
      for (let index = 0; index < schema.elementNodeIds.length; index += 1) {
        const childNodeId = schema.elementNodeIds[index];
        if (childNodeId === undefined) continue;
        const child = mutateFirstTaggedDiscriminator(
          childNodeId,
          mode,
          `${path}[${index}]`
        );
        if (child.matched) {
          value[index] = child.value;
          return { value, matched: true, mutationPath: child.mutationPath };
        }
      }
      break;
    }
    case "NULLABLE":
      return mutateFirstTaggedDiscriminator(schema.childNodeId, mode, `${path}.nullable`);
    case "CLOSED_UNION":
      for (const branchNodeId of schema.branchNodeIds) {
        const child = mutateFirstTaggedDiscriminator(
          branchNodeId,
          mode,
          `${path}|${branchNodeId}`
        );
        if (child.matched) return child;
      }
      break;
    case "REFINEMENT":
      return mutateFirstTaggedDiscriminator(schema.baseNodeId, mode, `${path}.base`);
    default:
      break;
  }
  return { value: sampleForNode(nodeId), matched: false, mutationPath: path };
};

const rootByOrdinal = (ordinal: number): StructuralSchemaRootV1 => {
  const root = authority.candidate.roots.find(
    (candidate) => candidate.branchOrdinal === ordinal
  );
  if (root === undefined) {
    throw new Error("missing test root");
  }
  return root;
};

const nodeFixtureAuthority = (
  nodes: readonly StructuralSchemaNodeV1[],
  rootNodeId: string
) =>
  createStructuralSchemaAuthorityForTestCandidate({
    astVersion: DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION,
    traversalVersion: DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION,
    normalizationVersion: DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION,
    expectedEventCount: 1,
    expectedBranchCount: 1,
    expectedExplicitVersionBranchCount: 0,
    expectedUnversionedBranchCount: 1,
    roots: [
      {
        branchOrdinal: 1,
        branchId: "fixture-branch",
        eventOrdinal: 1,
        eventType: "FixtureEvent",
        versionPolicy: { kind: "UNVERSIONED" },
        rootNodeId,
        resultTypeName: "FixturePayload"
      }
    ],
    nodeBindings: nodes.map((fixtureNode) => ({
      nodeId: fixtureNode.nodeId,
      node: fixtureNode
    })),
    deltaBindings: []
  } satisfies StructuralSchemaCandidateV1);

const envelopeForRoot = (
  root: StructuralSchemaRootV1,
  payload: unknown = sampleForNode(root.rootNodeId)
): Record<string, unknown> => ({
  category: "domain",
  eventId: " event-id ",
  gameId: " game-id ",
  eventSequence: 1,
  batchId: " batch-id ",
  gameVersion: 1,
  eventType: root.eventType,
  eventVersion: 1,
  rulesBaselineVersion: "",
  commandId: " command-id ",
  createdAt: "   ",
  correlationId: " correlation-id ",
  causationId: " causation-id ",
  payload
});

const expectFailureCode = (
  value: unknown,
  code: string
): DomainEventStructuralValidationResultFailure => {
  const result = validateDomainEventStructure(value);
  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error("expected structural failure");
  }
  expect(result.diagnostic.code).toBe(code);
  return result;
};

type DomainEventStructuralValidationResultFailure = Extract<
  ReturnType<typeof validateDomainEventStructure>,
  { readonly ok: false }
>;

const cloneRecord = (value: unknown): Record<string, unknown> => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("expected test record");
  }
  return structuredClone(value) as Record<string, unknown>;
};

const productionSource = (): string =>
  readFileSync(
    fileURLToPath(
      new URL("./domain-event-structural-validator.ts", import.meta.url)
    ),
    "utf8"
  );

const traceabilitySource = (): string =>
  readFileSync(
    fileURLToPath(
      new URL(
        "../../../docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md",
        import.meta.url
      )
    ),
    "utf8"
  );

const EXPECTED_DIAGNOSTIC_POLICY_MATRIX = [
  ["F01", "C1_AUTHORITY_UNHEALTHY", "AUTHORITY_ADMISSION", "AUTHORITY_UNAVAILABLE", true, "AFTER_PROCESS_RESTART", "admit-authority"],
  ["F02", "CAPTURE_REJECTED", "CAPTURE", "INPUT_CAPTURE_FAILED", false, "AFTER_INPUT_CORRECTION", "translate-correctable-capture"],
  ["F03", "CAPTURE_REJECTED", "CAPTURE", "INPUT_CAPTURE_FAILED", true, "AFTER_INPUT_CORRECTION", "translate-hostile-capture"],
  ["F04", "CAPTURE_REJECTED", "CAPTURE", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "translate-internal-capture"],
  ["F05", "INVALID_CAPTURE_TOKEN", "BACKING_AUTHENTICATION", "CAPTURE_TOKEN_REJECTED", true, "NEVER", "authenticate-capture-token"],
  ["F06", "INTERNAL_STRUCTURAL_VALIDATION_FAILURE", "BACKING_AUTHENTICATION", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "read-capture-backing"],
  ["F07", "INVALID_ENVELOPE", "ENVELOPE", "ENVELOPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "require-envelope-object"],
  ["F08", "MISSING_REQUIRED_FIELD", "ENVELOPE", "ENVELOPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "require-envelope-field"],
  ["F09", "EXTRA_FIELD", "ENVELOPE", "ENVELOPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "reject-envelope-extra"],
  ["F10", "INVALID_FIELD_TYPE", "ENVELOPE", "ENVELOPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-envelope-kind"],
  ["F11", "INVALID_FIELD_VALUE", "ENVELOPE", "ENVELOPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-envelope-value"],
  ["F12", "UNKNOWN_EVENT_TYPE", "EVENT_DISPATCH", "EVENT_TYPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "lookup-event-type"],
  ["F13", "UNSUPPORTED_EVENT_VERSION", "VERSION_DISPATCH", "EVENT_VERSION_REJECTED", false, "NEVER", "validate-envelope-version"],
  ["F14", "INVALID_FIELD_TYPE", "PAYLOAD_ACQUISITION", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "require-payload-object"],
  ["F15", "INVALID_PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT_REJECTED", false, "AFTER_INPUT_CORRECTION", "require-discriminator"],
  ["F16", "INVALID_PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-discriminator-kind"],
  ["F17", "INVALID_PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-discriminator-literal"],
  ["F18", "INVALID_PAYLOAD_BRANCH", "PAYLOAD_DISCRIMINANT", "PAYLOAD_BRANCH_REJECTED", false, "AFTER_INPUT_CORRECTION", "reject-zero-branch"],
  ["F19", "INVALID_PAYLOAD_BRANCH", "PAYLOAD_DISCRIMINANT", "AMBIGUOUS_BRANCH", true, "NEVER", "reject-multiple-branches"],
  ["F20", "INVALID_AST_NODE", "INTERNAL", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "resolve-ast-node"],
  ["F21", "MISSING_REQUIRED_FIELD", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "require-ast-field"],
  ["F22", "EXTRA_FIELD", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "reject-ast-extra"],
  ["F23", "INVALID_FIELD_TYPE", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-ast-kind"],
  ["F24", "INVALID_FIELD_VALUE", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-ast-literal"],
  ["F25", "INVALID_PAYLOAD_STRUCTURE", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-cardinality"],
  ["F26", "INVALID_PAYLOAD_STRUCTURE", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "select-tagged-union"],
  ["F27", "INVALID_PAYLOAD_STRUCTURE", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "reject-zero-union-match"],
  ["F28", "AMBIGUOUS_UNION", "AST_TRAVERSAL", "PAYLOAD_REJECTED", true, "NEVER", "reject-multiple-union-match"],
  ["F29", "INVALID_REFINEMENT", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "apply-refinement-predicate"],
  ["F30", "INVALID_REFINEMENT", "INTERNAL", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "validate-refinement-metadata"],
  ["F31", "VALIDATED_BACKING_CONSTRUCTION_FAILED", "BACKING_CONSTRUCTION", "BACKING_CONSTRUCTION_FAILED", true, "AFTER_PROCESS_RESTART", "construct-detached-backing"],
  ["F32", "INTERNAL_STRUCTURAL_VALIDATION_FAILURE", "TOKEN_ISSUE", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "issue-structural-token"],
  ["F33", "INVALID_STRUCTURAL_TOKEN", "TOKEN_CONSUMPTION", "STRUCTURAL_TOKEN_REJECTED", true, "NEVER", "consume-structural-token"],
  ["F34", "INTERNAL_STRUCTURAL_VALIDATION_FAILURE", "INTERNAL", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "contain-internal-failure"]
] as const;

describe("P2F1R-C domain event structural validation", () => {
  it("C-C01 captures unknown input exactly once and maps hostile inputs without raw C access", () => {
    const target = Object.create(null) as Record<string, unknown>;
    Object.defineProperty(target, "category", {
      enumerable: true,
      get: () => "domain"
    });
    const observed =
      validateDomainEventStructureWithObservationForTest(target);
    expect(observed.result).toMatchObject({
      ok: false,
      diagnostic: { code: "CAPTURE_REJECTED" }
    });
    expect(observed.observation).toMatchObject({
      authorityChecked: true,
      captureEntered: true,
      payloadKeyPresenceChecked: false,
      payloadKeyPresent: false,
      envelopeFieldReads: 0,
      payloadNodeAcquired: false,
      payloadContentReads: 0,
      tokenIssued: false
    });
    const { proxy, revoke } = Proxy.revocable({}, {});
    revoke();
    expectFailureCode(proxy, "CAPTURE_REJECTED");
  });

  it("C-C02 preserves the exact 14-field accepted envelope runtime language", () => {
    const root = rootByOrdinal(1);
    const baseline = envelopeForRoot(root);
    const envelopeFields = [
      "category",
      "eventId",
      "gameId",
      "eventSequence",
      "batchId",
      "gameVersion",
      "eventType",
      "eventVersion",
      "rulesBaselineVersion",
      "commandId",
      "createdAt",
      "correlationId",
      "causationId",
      "payload"
    ] as const;
    expect(Object.keys(baseline)).toEqual(envelopeFields);
    expect(validateDomainEventStructure(baseline).ok).toBe(true);

    type EnvelopeCase = {
      readonly name: string;
      readonly value?: unknown;
      readonly delete?: true;
      readonly code?: string;
      readonly accepted?: true;
      readonly supplementary?: true;
    };
    const idCases: readonly EnvelopeCase[] = [
      { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
      { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
      { name: "empty", value: "", code: "INVALID_FIELD_VALUE" },
      { name: "whitespace", value: " \t\n ", code: "INVALID_FIELD_VALUE" },
      { name: "wrong type", value: 1, code: "INVALID_FIELD_TYPE" },
      { name: "leading and trailing whitespace", value: " value ", accepted: true }
    ];
    const integerCases: readonly EnvelopeCase[] = [
      { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
      { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
      { name: "wrong type", value: "1", code: "INVALID_FIELD_TYPE" },
      { name: "valid", value: 1, accepted: true },
      { name: "negative supplement", value: -1, accepted: true, supplementary: true },
      { name: "zero supplement", value: 0, accepted: true, supplementary: true }
    ];
    const casesByField: Readonly<Record<(typeof envelopeFields)[number], readonly EnvelopeCase[]>> = {
      category: [
        { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
        { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
        { name: "empty", value: "", code: "INVALID_FIELD_VALUE" },
        { name: "whitespace", value: " ", code: "INVALID_FIELD_VALUE" },
        { name: "wrong type", value: 1, code: "INVALID_FIELD_TYPE" },
        { name: "literal", value: "domain", accepted: true },
        { name: "wrong literal supplement", value: "audit", code: "INVALID_FIELD_VALUE", supplementary: true }
      ],
      eventId: idCases,
      gameId: idCases,
      eventSequence: integerCases,
      batchId: idCases,
      gameVersion: integerCases,
      eventType: [
        { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
        { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
        { name: "empty", value: "", code: "UNKNOWN_EVENT_TYPE" },
        { name: "whitespace", value: " ", code: "UNKNOWN_EVENT_TYPE" },
        { name: "wrong type", value: 1, code: "INVALID_FIELD_TYPE" },
        { name: "known", value: root.eventType, accepted: true }
      ],
      eventVersion: [
        { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
        { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
        { name: "wrong type", value: "1", code: "INVALID_FIELD_TYPE" },
        { name: "supported", value: 1, accepted: true },
        { name: "unsupported supplement", value: 2, code: "UNSUPPORTED_EVENT_VERSION", supplementary: true }
      ],
      rulesBaselineVersion: [
        { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
        { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
        { name: "empty", value: "", accepted: true },
        { name: "whitespace", value: " ", accepted: true },
        { name: "wrong type", value: 1, code: "INVALID_FIELD_TYPE" },
        { name: "normal string", value: "rules-v1", accepted: true }
      ],
      commandId: idCases,
      createdAt: [
        { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
        { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
        { name: "empty", value: "", accepted: true },
        { name: "whitespace", value: " ", accepted: true },
        { name: "wrong type", value: 1, code: "INVALID_FIELD_TYPE" },
        { name: "normal string", value: "2026-01-01T00:00:00Z", accepted: true }
      ],
      correlationId: idCases,
      causationId: idCases,
      payload: [
        { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
        { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
        { name: "empty object reaches AST", value: {}, code: "MISSING_REQUIRED_FIELD" },
        { name: "wrong primitive", value: "payload", code: "INVALID_FIELD_TYPE" },
        { name: "authentic object", value: sampleForNode(root.rootNodeId), accepted: true }
      ]
    };

    let executedCases = 0;
    let applicableLogicalCells = 0;
    let supplementaryVectors = 0;
    for (const [index, field] of envelopeFields.entries()) {
      const fieldCases = casesByField[field];
      for (const fieldCase of fieldCases) {
        executedCases += 1;
        if (fieldCase.supplementary === true) supplementaryVectors += 1;
        else applicableLogicalCells += 1;
        const candidate = envelopeForRoot(root);
        if (fieldCase.delete === true) delete candidate[field];
        else candidate[field] = fieldCase.value;
        const first = validateDomainEventStructureWithObservationForTest(candidate);
        const second = validateDomainEventStructureWithObservationForTest(candidate);
        expect(first, `${field}:${fieldCase.name}:repeat`).toEqual(second);
        if (fieldCase.accepted === true) {
          expect(first.result.ok, `${field}:${fieldCase.name}`).toBe(true);
          if (!first.result.ok) throw new Error("expected accepted envelope vector");
          expect(first.observation).toEqual({
            diagnosticLeafId: null,
            authorityChecked: true,
            captureEntered: true,
            envelopeKeySetChecked: true,
            envelopeFieldReads: 13,
            eventTypeReads: 1,
            eventVersionReads: 1,
            payloadKeyPresenceChecked: true,
            payloadKeyPresent: true,
            payloadNodeAcquired: true,
            payloadDiscriminatorReads: 0,
            payloadContentReads: 7,
            astTraversalEntered: true,
            validatedBackingConstructed: true,
            tokenIssued: true
          });
          const read = readStructurallyValidatedDomainEvent(first.result.token);
          expect(read.ok, `${field}:${fieldCase.name}:readback`).toBe(true);
          if (!read.ok) throw new Error("expected authentic structural token");
          expect(
            (read.value.event as unknown as Record<string, unknown>)[field],
            `${field}:${fieldCase.name}:preserved`
          ).toEqual(candidate[field]);
          continue;
        }
        expect(first.result.ok, `${field}:${fieldCase.name}`).toBe(false);
        if (first.result.ok) throw new Error("expected envelope matrix failure");
        expect(first.result.diagnostic.code, `${field}:${fieldCase.name}`).toBe(fieldCase.code);
        const expectedPath =
          field === "payload" && fieldCase.name === "empty object reaches AST"
            ? [{ kind: "PAYLOAD_FIELD_ORDINAL", ordinal: 1 }]
            : [{ kind: "ENVELOPE_FIELD_ORDINAL", ordinal: index + 1 }];
        expect(first.result.diagnostic.path, `${field}:${fieldCase.name}`).toEqual(expectedPath);
        expect(first.result.diagnostic).toEqual({
          code: fieldCase.code,
          phase:
            field === "eventType" && (fieldCase.name === "empty" || fieldCase.name === "whitespace")
              ? "EVENT_DISPATCH"
              : field === "eventVersion" && fieldCase.name === "unsupported supplement"
                ? "VERSION_DISPATCH"
                : field === "payload" && fieldCase.delete !== true && fieldCase.name !== "empty object reaches AST"
                  ? "PAYLOAD_ACQUISITION"
                  : field === "payload" && fieldCase.name === "empty object reaches AST"
                    ? "AST_TRAVERSAL"
                    : "ENVELOPE",
          path: expectedPath,
          safeSummary:
            field === "eventType" && (fieldCase.name === "empty" || fieldCase.name === "whitespace")
              ? "EVENT_TYPE_REJECTED"
              : field === "eventVersion" && fieldCase.name === "unsupported supplement"
                ? "EVENT_VERSION_REJECTED"
                : field === "payload" && fieldCase.delete !== true && fieldCase.name !== "empty object reaches AST"
                  ? "PAYLOAD_REJECTED"
                  : field === "payload" && fieldCase.name === "empty object reaches AST"
                    ? "PAYLOAD_REJECTED"
                    : "ENVELOPE_REJECTED",
          quarantineRecommended: false,
          retryability:
            field === "eventVersion" && fieldCase.name === "unsupported supplement"
              ? "NEVER"
              : "AFTER_INPUT_CORRECTION",
          taggedUnionCoordinate: null,
          failClosed: true
        });
        const reachesDispatch =
          (field === "eventType" && (fieldCase.name === "empty" || fieldCase.name === "whitespace")) ||
          (field === "eventVersion" && fieldCase.name === "unsupported supplement");
        const reachesPayload = field === "payload" && fieldCase.delete !== true;
        const envelopeReads = reachesDispatch || reachesPayload
          ? 13
          : fieldCase.delete === true
            ? 0
            : index + 1;
        expect(first.observation).toEqual({
          diagnosticLeafId:
            fieldCase.code === "MISSING_REQUIRED_FIELD"
              ? field === "payload" && fieldCase.name === "empty object reaches AST"
                ? "L26_F21_RECORD_MISSING_PLAIN"
                : "L08_F08_ENVELOPE_FIELD_MISSING"
              : fieldCase.code === "INVALID_FIELD_TYPE"
                ? field === "payload"
                  ? "L14_F14_PAYLOAD_NOT_OBJECT"
                  : "L10_F10_ENVELOPE_FIELD_WRONG_KIND"
                : fieldCase.code === "UNKNOWN_EVENT_TYPE"
                  ? "L12_F12_EVENT_TYPE_UNKNOWN"
                  : fieldCase.code === "UNSUPPORTED_EVENT_VERSION"
                    ? "L13_F13_EVENT_VERSION_UNSUPPORTED"
                    : "L11_F11_ENVELOPE_FIELD_INVALID_VALUE",
          authorityChecked: true,
          captureEntered: true,
          envelopeKeySetChecked: true,
          envelopeFieldReads: envelopeReads,
          eventTypeReads: reachesDispatch || reachesPayload ? 1 : 0,
          eventVersionReads:
            reachesPayload || (field === "eventVersion" && fieldCase.name === "unsupported supplement") ? 1 : 0,
          payloadKeyPresenceChecked: true,
          payloadKeyPresent: field !== "payload" || fieldCase.delete !== true,
          payloadNodeAcquired: reachesPayload,
          payloadDiscriminatorReads: 0,
          payloadContentReads:
            field === "payload" && fieldCase.name === "empty object reaches AST" ? 0 : 0,
          astTraversalEntered:
            field === "payload" && fieldCase.name === "empty object reaches AST",
          validatedBackingConstructed: false,
          tokenIssued: false
        });
        const serialized = JSON.stringify(first.result.diagnostic);
        expect(serialized).not.toContain("audit");
        expect(serialized).not.toContain("payload");
        expect(serialized).not.toContain("value");
        expect(first.result.diagnostic).not.toHaveProperty("message");
        expect(first.result.diagnostic).not.toHaveProperty("stack");
      }
    }
    expect(applicableLogicalCells).toBe(77);
    expect(supplementaryVectors).toBe(6);
    expect(executedCases).toBe(83);
    expect([
      "eventSequence:empty",
      "eventSequence:whitespace",
      "gameVersion:empty",
      "gameVersion:whitespace",
      "eventVersion:empty",
      "eventVersion:whitespace",
      "payload:whitespace"
    ]).toHaveLength(7);
  });

  it("C-C03c admits one complete authority and dispatches only after admission", () => {
    expect(inspectDefaultDomainEventStructuralAuthorityForTest()).toEqual({
      status: "HEALTHY",
      eventCount: 40,
      branchCount: 59,
      explicitVersionBranchCount: 13,
      unversionedBranchCount: 46,
      envelopeResolvableBranchCount: 35,
      payloadDiscriminatedBranchCount: 24,
      discriminatorPathCount: 7,
      refinementAliasCount: 16,
      astNodeKindCount: 15
    });
    const observed = validateDomainEventStructureWithObservationForTest(
      envelopeForRoot(rootByOrdinal(1))
    );
    expect(observed.result.ok).toBe(true);
    expect(observed.observation).toMatchObject({
      authorityChecked: true,
      captureEntered: true,
      envelopeKeySetChecked: true,
      payloadNodeAcquired: true,
      astTraversalEntered: true,
      validatedBackingConstructed: true,
      tokenIssued: true
    });
  });

  it("C-C03a derives the exact 40/59/13/46 and 35/24 C1 admission census", () => {
    const admitted = admitC1Authority(authorityResult);
    expect(admitted).toMatchObject({
      status: "HEALTHY",
      eventCount: 40,
      branchCount: 59,
      explicitVersionBranchCount: 13,
      unversionedBranchCount: 46,
      envelopeResolvableBranchCount: 35,
      payloadDiscriminatedBranchCount: 24,
      discriminatorPathCount: 7,
      refinementAliasCount: 16
    });
  });

  it("C-C03b fails an unhealthy C1 admission closed without manufacturing public reachability", () => {
    const admitted = admitC1Authority({
      status: "UNHEALTHY",
      diagnostic: {
        code: "INVALID_BRANCH_INVENTORY",
        phase: "test",
        nodeId: null,
        detail: "not retained by C",
        failClosed: true
      }
    });
    expect(admitted).toEqual({ status: "UNHEALTHY" });
    expect(DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY.F01).toMatchObject({
      code: "C1_AUTHORITY_UNHEALTHY",
      phase: "AUTHORITY_ADMISSION",
      quarantineRecommended: true,
      retryability: "AFTER_PROCESS_RESTART"
    });
  });

  it("C-C04 groups all 40 known event identities deterministically", () => {
    const events = new Set(
      authority.candidate.roots.map((root) => root.eventType)
    );
    expect(events.size).toBe(40);
    for (const eventType of events) {
      const root = authority.candidate.roots.find(
        (candidate) => candidate.eventType === eventType
      );
      expect(root).toBeDefined();
      if (root !== undefined) {
        expect(validateDomainEventStructure(envelopeForRoot(root)).ok).toBe(
          true
        );
      }
    }
  });

  it("C-C05 performs zero C payload reads for every pre-payload rejection gate", () => {
    const root = rootByOrdinal(1);
    const missingPayload = envelopeForRoot(root);
    delete missingPayload.payload;
    const hostile = Object.create(null) as Record<string, unknown>;
    Object.defineProperty(hostile, "category", {
      enumerable: true,
      get: () => "domain"
    });
    const candidates = [
      {
        name: "F02 correctable capture rejection",
        candidate: undefined,
        expectedLeafId: "L02_F02_CAPTURE_CORRECTABLE",
        expected: {
          envelopeKeySetChecked: false,
          payloadKeyPresenceChecked: false,
          payloadKeyPresent: false,
          envelopeFieldReads: 0,
          eventTypeReads: 0,
          eventVersionReads: 0
        }
      },
      {
        name: "F03 hostile capture rejection",
        candidate: hostile,
        expectedLeafId: "L03_F03_CAPTURE_HOSTILE",
        expected: {
          envelopeKeySetChecked: false,
          payloadKeyPresenceChecked: false,
          payloadKeyPresent: false,
          envelopeFieldReads: 0,
          eventTypeReads: 0,
          eventVersionReads: 0
        }
      },
      {
        name: "F07 non-record envelope",
        candidate: null,
        expectedLeafId: "L07_F07_ENVELOPE_NOT_OBJECT",
        expected: {
          envelopeKeySetChecked: false,
          payloadKeyPresenceChecked: false,
          payloadKeyPresent: false,
          envelopeFieldReads: 0,
          eventTypeReads: 0,
          eventVersionReads: 0
        }
      },
      {
        name: "F08 missing envelope field",
        candidate: missingPayload,
        expectedLeafId: "L08_F08_ENVELOPE_FIELD_MISSING",
        expected: {
          envelopeKeySetChecked: true,
          payloadKeyPresenceChecked: true,
          payloadKeyPresent: false,
          envelopeFieldReads: 0,
          eventTypeReads: 0,
          eventVersionReads: 0
        }
      },
      {
        name: "F09 extra envelope field",
        candidate: { ...envelopeForRoot(root), extra: true },
        expectedLeafId: "L09_F09_ENVELOPE_FIELD_EXTRA",
        expected: {
          envelopeKeySetChecked: true,
          payloadKeyPresenceChecked: true,
          payloadKeyPresent: true,
          envelopeFieldReads: 0,
          eventTypeReads: 0,
          eventVersionReads: 0
        }
      },
      {
        name: "F10 envelope field kind",
        candidate: { ...envelopeForRoot(root), eventSequence: "1" },
        expectedLeafId: "L10_F10_ENVELOPE_FIELD_WRONG_KIND",
        expected: {
          envelopeKeySetChecked: true,
          payloadKeyPresenceChecked: true,
          payloadKeyPresent: true,
          envelopeFieldReads: 4,
          eventTypeReads: 0,
          eventVersionReads: 0
        }
      },
      {
        name: "F11 envelope field value",
        candidate: { ...envelopeForRoot(root), category: "audit" },
        expectedLeafId: "L11_F11_ENVELOPE_FIELD_INVALID_VALUE",
        expected: {
          envelopeKeySetChecked: true,
          payloadKeyPresenceChecked: true,
          payloadKeyPresent: true,
          envelopeFieldReads: 1,
          eventTypeReads: 0,
          eventVersionReads: 0
        }
      },
      {
        name: "F12 unknown event type",
        candidate: { ...envelopeForRoot(root), eventType: "FutureEvent" },
        expectedLeafId: "L12_F12_EVENT_TYPE_UNKNOWN",
        expected: {
          envelopeKeySetChecked: true,
          payloadKeyPresenceChecked: true,
          payloadKeyPresent: true,
          envelopeFieldReads: 13,
          eventTypeReads: 1,
          eventVersionReads: 0
        }
      },
      {
        name: "F13 unsupported event version",
        candidate: { ...envelopeForRoot(root), eventVersion: 2 },
        expectedLeafId: "L13_F13_EVENT_VERSION_UNSUPPORTED",
        expected: {
          envelopeKeySetChecked: true,
          payloadKeyPresenceChecked: true,
          payloadKeyPresent: true,
          envelopeFieldReads: 13,
          eventTypeReads: 1,
          eventVersionReads: 1
        }
      }
    ];
    for (const { name, candidate, expectedLeafId, expected } of candidates) {
      const observed =
        validateDomainEventStructureWithObservationForTest(candidate);
      expect(observed.result.ok, name).toBe(false);
      const { diagnosticLeafId, ...observerWithoutLeaf } = observed.observation;
      expect(diagnosticLeafId, name).toBe(expectedLeafId);
      expect(observerWithoutLeaf, name).toEqual({
        authorityChecked: true,
        captureEntered: true,
        ...expected,
        payloadNodeAcquired: false,
        payloadDiscriminatorReads: 0,
        payloadContentReads: 0,
        astTraversalEntered: false,
        validatedBackingConstructed: false,
        tokenIssued: false
      });
    }
    const fakeToken =
      validateCapturedDomainEventStructureWithObservationForTest({});
    expect(fakeToken.result.ok).toBe(false);
    expect(fakeToken.observation).toEqual({
      diagnosticLeafId: "L05_F05_CAPTURE_TOKEN_INVALID",
      authorityChecked: true,
      captureEntered: false,
      envelopeKeySetChecked: false,
      payloadKeyPresenceChecked: false,
      payloadKeyPresent: false,
      envelopeFieldReads: 0,
      eventTypeReads: 0,
      eventVersionReads: 0,
      payloadNodeAcquired: false,
      payloadDiscriminatorReads: 0,
      payloadContentReads: 0,
      astTraversalEntered: false,
      validatedBackingConstructed: false,
      tokenIssued: false
    });
  });

  it("C-C06b selects each of the 59 C1 roots exactly once without fallback", () => {
    const rootsByEvent = new Map<string, StructuralSchemaRootV1[]>();
    for (const root of authority.candidate.roots) {
      const roots = rootsByEvent.get(root.eventType) ?? [];
      roots.push(root);
      rootsByEvent.set(root.eventType, roots);
    }
    const singletonRoots = authority.candidate.roots.filter(
      (root) => rootsByEvent.get(root.eventType)?.length === 1
    );
    const discriminatorRoots = authority.candidate.roots.filter(
      (root) => (rootsByEvent.get(root.eventType)?.length ?? 0) > 1
    );
    expect(singletonRoots).toHaveLength(35);
    expect(discriminatorRoots).toHaveLength(24);

    const selected = new Set<string>();
    for (const root of authority.candidate.roots) {
      const result = validateDomainEventStructure(envelopeForRoot(root));
      expect(result).toMatchObject({
        ok: true,
        payloadBranchId: root.branchId,
        payloadSchemaIdentity: root.rootNodeId
      });
      if (result.ok) selected.add(result.payloadBranchId);

      const negative = validateDomainEventStructure(
        envelopeForRoot(root, {})
      );
      expect(negative.ok, `negative ${root.branchId}`).toBe(false);
    }
    expect(selected.size).toBe(59);
  });

  it("C-C06a bounds all seven payload discriminator paths before AST traversal", () => {
    const rootCountByEvent = new Map<string, number>();
    for (const candidate of authority.candidate.roots) {
      rootCountByEvent.set(
        candidate.eventType,
        (rootCountByEvent.get(candidate.eventType) ?? 0) + 1
      );
    }
    const singletonRoots = authority.candidate.roots.filter(
      (candidate) => rootCountByEvent.get(candidate.eventType) === 1
    );
    expect(singletonRoots).toHaveLength(35);
    for (const singleton of singletonRoots) {
      const observed = validateDomainEventStructureWithObservationForTest(
        envelopeForRoot(singleton)
      );
      expect(observed.result.ok, singleton.branchId).toBe(true);
      expect(
        observed.observation.payloadDiscriminatorReads,
        singleton.branchId
      ).toBe(0);
      expect(observed.observation.astTraversalEntered, singleton.branchId).toBe(
        true
      );
    }
    const expectedReadsByOrdinal = new Map<number, number>([
      ...[11, 12, 13, 14, 15].map((ordinal) => [ordinal, 2] as const),
      ...[16, 17, 18].map((ordinal) => [ordinal, 1] as const),
      ...[19, 20].map((ordinal) => [ordinal, 3] as const),
      ...[22, 23, 29, 30, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52].map(
        (ordinal) => [ordinal, 1] as const
      )
    ]);
    expect(expectedReadsByOrdinal.size).toBe(24);
    for (const [ordinal, reads] of expectedReadsByOrdinal) {
      const observed = validateDomainEventStructureWithObservationForTest(
        envelopeForRoot(rootByOrdinal(ordinal))
      );
      expect(observed.result.ok).toBe(true);
      expect(observed.observation.payloadDiscriminatorReads).toBe(reads);
    }

    const assertDiscriminatorFailure = (
      ordinal: number,
      field: string,
      value: unknown,
      reads: number
    ): void => {
      const payload = cloneRecord(sampleForNode(rootByOrdinal(ordinal).rootNodeId));
      if (value === undefined) delete payload[field];
      else payload[field] = value;
      const observed = validateDomainEventStructureWithObservationForTest(
        envelopeForRoot(rootByOrdinal(ordinal), payload)
      );
      expect(observed.result).toMatchObject({
        ok: false,
        diagnostic: { code: "INVALID_PAYLOAD_DISCRIMINANT" }
      });
      expect(observed.observation).toMatchObject({
        payloadDiscriminatorReads: reads,
        payloadContentReads: 0,
        astTraversalEntered: false,
        validatedBackingConstructed: false,
        tokenIssued: false
      });
    };

    for (const value of [undefined, {}, "FUTURE"] as const) {
      assertDiscriminatorFailure(11, "opportunityKind", value, 2);
      assertDiscriminatorFailure(29, "kind", value, 1);
    }
    for (const value of [{}, "FUTURE"] as const) {
      assertDiscriminatorFailure(22, "deferSchemaVersion", value, 1);
      assertDiscriminatorFailure(43, "targetSchemaVersion", value, 1);
      assertDiscriminatorFailure(46, "deliverySchemaVersion", value, 1);
    }
  });

  it("C-C07 reports deterministic first missing envelope and AST fields", () => {
    const envelope = envelopeForRoot(rootByOrdinal(1));
    delete envelope.eventId;
    expect(expectFailureCode(envelope, "MISSING_REQUIRED_FIELD").diagnostic.path)
      .toEqual([{ kind: "ENVELOPE_FIELD_ORDINAL", ordinal: 2 }]);
    const root = rootByOrdinal(1);
    const payload = cloneRecord(sampleForNode(root.rootNodeId));
    delete payload[Object.keys(payload)[0] as string];
    expectFailureCode(envelopeForRoot(root, payload), "MISSING_REQUIRED_FIELD");
  });

  it("C-C08 rejects deterministic envelope and payload extra entries", () => {
    const envelope = envelopeForRoot(rootByOrdinal(1));
    envelope.attack = "hidden";
    expectFailureCode(envelope, "EXTRA_FIELD");
    const root = rootByOrdinal(1);
    const payload = cloneRecord(sampleForNode(root.rootNodeId));
    payload.attack = "hidden";
    expectFailureCode(envelopeForRoot(root, payload), "EXTRA_FIELD");
  });

  it("C-C09b rejects primitive coercion, symbols, getters, proxies, cycles, and nonplain values", () => {
    const root = rootByOrdinal(1);
    const payload = sampleForNode(root.rootNodeId);
    const coercing = envelopeForRoot(root, payload);
    coercing.eventSequence = {
      valueOf: () => 1,
      toString: () => "1"
    };
    expectFailureCode(coercing, "CAPTURE_REJECTED");
    const withSymbol = envelopeForRoot(root, payload);
    Object.defineProperty(withSymbol, Symbol("attack"), {
      enumerable: true,
      value: true
    });
    expectFailureCode(withSymbol, "CAPTURE_REJECTED");
    const cyclic = envelopeForRoot(root, payload);
    cyclic.payload = cyclic;
    expectFailureCode(cyclic, "CAPTURE_REJECTED");
    expectFailureCode(new Date(), "CAPTURE_REJECTED");
  });

  it("C-C09a executes both refinements through captured intrinsic trim and the closed alias set", () => {
    expect(
      validateDomainEventStructuralRefinementForTest(
        {
          refinementVersion: DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
          refinementKind: "NON_EMPTY_TRIMMED_STRING",
          baseNodeKind: "STRING"
        },
        " value "
      )
    ).toEqual({ ok: true, value: " value " });
    expect(
      validateDomainEventStructuralRefinementForTest(
        {
          refinementVersion: DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
          refinementKind: "ID_STRING",
          baseNodeKind: "STRING",
          alias: "PlayerId"
        },
        "player"
      )
    ).toEqual({ ok: true, value: "player" });
    expect(
      validateDomainEventStructuralRefinementForTest(
        {
          refinementVersion: DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
          refinementKind: "ID_STRING",
          baseNodeKind: "STRING",
          alias: "PlayerId"
        },
        " player "
      )
    ).toMatchObject({
      ok: false,
      diagnostic: { code: "INVALID_REFINEMENT" }
    });
    expect(
      validateDomainEventStructuralRefinementForTest(
        {
          refinementVersion: DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
          refinementKind: "NON_EMPTY_TRIMMED_STRING",
          baseNodeKind: "STRING"
        },
        " \t\n "
      )
    ).toMatchObject({
      ok: false,
      diagnostic: { code: "INVALID_REFINEMENT" }
    });
    for (const alias of STRUCTURAL_ID_ALIASES_V1) {
      expect(
        validateDomainEventStructuralRefinementForTest(
          {
            refinementVersion: DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
            refinementKind: "ID_STRING",
            baseNodeKind: "STRING",
            alias
          },
          "identifier"
        ),
        alias
      ).toEqual({ ok: true, value: "identifier" });
      expect(
        validateDomainEventStructuralRefinementForTest(
          {
            refinementVersion: DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
            refinementKind: "ID_STRING",
            baseNodeKind: "STRING",
            alias
          },
          " identifier "
        ),
        alias
      ).toMatchObject({
        ok: false,
        diagnostic: { code: "INVALID_REFINEMENT" }
      });
    }

    const trimDescriptor = Object.getOwnPropertyDescriptor(
      String.prototype,
      "trim"
    );
    let dynamicTrimCalls = 0;
    Object.defineProperty(String.prototype, "trim", {
      configurable: true,
      writable: true,
      value: () => {
        dynamicTrimCalls += 1;
        throw new Error("dynamic trim must not be called");
      }
    });
    try {
      expect(
        validateDomainEventStructuralRefinementForTest(
          {
            refinementVersion: DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
            refinementKind: "NON_EMPTY_TRIMMED_STRING",
            baseNodeKind: "STRING"
          },
          " captured "
        )
      ).toEqual({ ok: true, value: " captured " });
      expect(dynamicTrimCalls).toBe(0);
    } finally {
      if (trimDescriptor !== undefined) {
        Object.defineProperty(String.prototype, "trim", trimDescriptor);
      }
    }
    expect(
      validateDomainEventStructuralRefinementForTest(
        {
          refinementVersion: DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
          refinementKind: "FUTURE_REFINEMENT",
          baseNodeKind: "STRING"
        },
        "player"
      )
    ).toMatchObject({
      ok: false,
      diagnostic: { code: "INVALID_REFINEMENT", phase: "INTERNAL" }
    });
  });

  it("C-C10 traverses the complete 15-kind C1 algebra with real captured values", () => {
    const kinds = new Set(
      authority.candidate.nodeBindings.map((binding) => binding.node.kind)
    );
    expect([...kinds].sort()).toEqual(
      STRUCTURAL_SCHEMA_NODE_KINDS.filter(
        (kind) => kind !== "NULL" && kind !== "BOUNDED_ARRAY"
      ).sort()
    );
    for (const root of authority.candidate.roots) {
      expect(validateDomainEventStructure(envelopeForRoot(root)).ok).toBe(
        true
      );
    }
    const fixtures: readonly [
      string,
      readonly StructuralSchemaNodeV1[],
      unknown
    ][] = [
      ["NULL", [{ nodeId: "root", kind: "NULL" }], null],
      ["BOOLEAN", [{ nodeId: "root", kind: "BOOLEAN" }], true],
      ["SAFE_INTEGER", [{ nodeId: "root", kind: "SAFE_INTEGER" }], 1],
      ["STRING", [{ nodeId: "root", kind: "STRING" }], "value"],
      ["LITERAL", [{ nodeId: "root", kind: "LITERAL", value: "x" }], "x"],
      ["ENUM", [{ nodeId: "root", kind: "ENUM", values: ["a", "b"] }], "a"],
      [
        "NULLABLE",
        [
          { nodeId: "root", kind: "NULLABLE", childNodeId: "text" },
          { nodeId: "text", kind: "STRING" }
        ],
        "value"
      ],
      ["EXACT_RECORD", [{ nodeId: "root", kind: "EXACT_RECORD", fields: [] }], {}],
      [
        "ARRAY",
        [
          { nodeId: "root", kind: "ARRAY", elementNodeId: "text" },
          { nodeId: "text", kind: "STRING" }
        ],
        ["value"]
      ],
      [
        "NON_EMPTY_ARRAY",
        [
          {
            nodeId: "root",
            kind: "NON_EMPTY_ARRAY",
            minItems: 1,
            maxItems: null,
            elementNodeId: "text"
          },
          { nodeId: "text", kind: "STRING" }
        ],
        ["value"]
      ],
      [
        "BOUNDED_ARRAY",
        [
          {
            nodeId: "root",
            kind: "BOUNDED_ARRAY",
            minItems: 0,
            maxItems: 1,
            elementNodeId: "text"
          },
          { nodeId: "text", kind: "STRING" }
        ],
        ["value"]
      ],
      [
        "TUPLE",
        [
          { nodeId: "root", kind: "TUPLE", elementNodeIds: ["text"] },
          { nodeId: "text", kind: "STRING" }
        ],
        ["value"]
      ],
      [
        "TAGGED_UNION",
        [
          {
            nodeId: "root",
            kind: "TAGGED_UNION",
            tagField: "kind",
            branches: [
              { branchOrdinal: 1, tagLiteral: "A", childNodeId: "record" }
            ]
          },
          {
            nodeId: "record",
            kind: "EXACT_RECORD",
            fields: [
              {
                fieldOrdinal: 1,
                fieldName: "kind",
                required: true,
                optional: false,
                childNodeId: "literal"
              }
            ]
          },
          { nodeId: "literal", kind: "LITERAL", value: "A" }
        ],
        { kind: "A" }
      ],
      [
        "CLOSED_UNION",
        [
          {
            nodeId: "root",
            kind: "CLOSED_UNION",
            selection: "EXACTLY_ONE",
            branchNodeIds: ["boolean", "text"]
          },
          { nodeId: "boolean", kind: "BOOLEAN" },
          { nodeId: "text", kind: "STRING" }
        ],
        true
      ],
      [
        "REFINEMENT",
        [
          {
            nodeId: "root",
            kind: "REFINEMENT",
            refinementVersion: DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
            refinementKind: "NON_EMPTY_TRIMMED_STRING",
            baseNodeId: "text"
          },
          { nodeId: "text", kind: "STRING" }
        ],
        "value"
      ]
    ];
    for (const [kind, nodes, input] of fixtures) {
      const testAuthority = nodeFixtureAuthority(nodes, "root");
      expect(testAuthority.status, kind).toBe("HEALTHY");
      expect(
        validateDomainEventStructuralNodeForTest(testAuthority, "root", input),
        kind
      ).toMatchObject({ ok: true });
    }

    const taggedNodes: readonly StructuralSchemaNodeV1[] = [
      {
        nodeId: "tagged",
        kind: "TAGGED_UNION",
        tagField: "zKind",
        branches: [
          { branchOrdinal: 1, tagLiteral: "A", childNodeId: "tagged-record" }
        ]
      },
      {
        nodeId: "tagged-record",
        kind: "EXACT_RECORD",
        fields: [
          {
            fieldOrdinal: 1,
            fieldName: "aValue",
            required: true,
            optional: false,
            childNodeId: "text"
          },
          {
            fieldOrdinal: 2,
            fieldName: "zKind",
            required: true,
            optional: false,
            childNodeId: "kind-a"
          }
        ]
      },
      { nodeId: "text", kind: "STRING" },
      { nodeId: "kind-a", kind: "LITERAL", value: "A" }
    ];
    const taggedAuthority = nodeFixtureAuthority(taggedNodes, "tagged");
    expect(taggedAuthority.status).toBe("HEALTHY");
    const taggedNodeOrdinal =
      taggedAuthority.status === "HEALTHY"
        ? taggedAuthority.traversal.uniqueNodes.find(
            (entry) => entry.nodeId === "tagged"
          )?.nodeOrdinal
        : undefined;
    expect(taggedNodeOrdinal).toBeDefined();
    for (const [input, state, field] of [
      [{ aValue: "x" }, "MISSING_DISCRIMINANT", null],
      [
        { aValue: "x", zKind: {} },
        "INVALID_DISCRIMINANT_TYPE",
        { containerPath: [], canonicalObjectEntryOrdinal: 2 }
      ],
      [
        { aValue: "x", zKind: "FUTURE" },
        "UNKNOWN_DISCRIMINANT_VALUE",
        { containerPath: [], canonicalObjectEntryOrdinal: 2 }
      ]
    ] as const) {
      const result = validateDomainEventStructuralNodeForTest(
        taggedAuthority,
        "tagged",
        input
      );
      expect(result).toMatchObject({
        ok: false,
        diagnostic: {
          code: "INVALID_PAYLOAD_STRUCTURE",
          path: [],
          taggedUnionCoordinate: {
            eventBranchOrdinal: 1,
            astNodeOrdinal: taggedNodeOrdinal,
            taggedUnionPath: [],
            field,
            state
          }
        }
      });
    }

    const nestedNodes: readonly StructuralSchemaNodeV1[] = [
      ...taggedNodes,
      { nodeId: "literal-one", kind: "LITERAL", value: 1 },
      { nodeId: "literal-two", kind: "LITERAL", value: 2 },
      {
        nodeId: "nested-root",
        kind: "EXACT_RECORD",
        fields: [
          {
            fieldOrdinal: 1,
            fieldName: "first",
            required: true,
            optional: false,
            childNodeId: "literal-one"
          },
          {
            fieldOrdinal: 2,
            fieldName: "second",
            required: true,
            optional: false,
            childNodeId: "literal-two"
          },
          {
            fieldOrdinal: 3,
            fieldName: "wrapper",
            required: true,
            optional: false,
            childNodeId: "tagged"
          }
        ]
      }
    ];
    const nestedAuthority = nodeFixtureAuthority(nestedNodes, "nested-root");
    expect(nestedAuthority.status).toBe("HEALTHY");
    for (const [wrapper, state, field] of [
      [{ aValue: "x" }, "MISSING_DISCRIMINANT", null],
      [
        { aValue: "x", zKind: {} },
        "INVALID_DISCRIMINANT_TYPE",
        {
          containerPath: [
            { kind: "PAYLOAD_FIELD_ORDINAL", ordinal: 3 }
          ],
          canonicalObjectEntryOrdinal: 2
        }
      ],
      [
        { aValue: "x", zKind: "FUTURE" },
        "UNKNOWN_DISCRIMINANT_VALUE",
        {
          containerPath: [
            { kind: "PAYLOAD_FIELD_ORDINAL", ordinal: 3 }
          ],
          canonicalObjectEntryOrdinal: 2
        }
      ]
    ] as const) {
      const result = validateDomainEventStructuralNodeForTest(
        nestedAuthority,
        "nested-root",
        { first: 1, second: 2, wrapper }
      );
      expect(result).toMatchObject({
        ok: false,
        diagnostic: {
          code: "INVALID_PAYLOAD_STRUCTURE",
          path: [{ kind: "PAYLOAD_FIELD_ORDINAL", ordinal: 3 }],
          taggedUnionCoordinate: { state, field }
        }
      });
    }
  });

  it("C-C11 keeps the authentic legacy B31 payload structurally representable", () => {
    const root = rootByOrdinal(31);
    const authenticPayload = cloneRecord(sampleForNode(root.rootNodeId));
    expect(validateDomainEventStructure(envelopeForRoot(root))).toMatchObject({
      ok: true,
      payloadBranchId: "C-B31-TASK-INSERTED-LEGACY-U"
    });
    const missing = cloneRecord(authenticPayload);
    delete missing.chosenRole;
    expectFailureCode(envelopeForRoot(root, missing), "MISSING_REQUIRED_FIELD");
    const wrongType = cloneRecord(authenticPayload);
    wrongType.chosenRole = {};
    expect(validateDomainEventStructure(envelopeForRoot(root, wrongType)).ok).toBe(
      false
    );
    const extra = cloneRecord(authenticPayload);
    extra.unacceptedField = true;
    expectFailureCode(envelopeForRoot(root, extra), "EXTRA_FIELD");
  });

  it("C-C12c preserves current version-aware families and rejects discriminator failures", () => {
    const explicitRoots = authority.candidate.roots.filter(
      (root) => root.versionPolicy.kind === "EXPLICIT_LITERAL"
    );
    expect(explicitRoots.map((root) => root.branchOrdinal)).toEqual([
      16, 17, 18, 23, 24, 44, 45, 47, 48, 49, 50, 51, 52
    ]);
    for (const root of explicitRoots) {
      expect(
        validateDomainEventStructure(envelopeForRoot(root)).ok,
        root.branchId
      ).toBe(true);
      if (root.versionPolicy.kind !== "EXPLICIT_LITERAL") {
        throw new Error("filtered explicit root lost its policy");
      }
      const wrongType = cloneRecord(sampleForNode(root.rootNodeId));
      wrongType[root.versionPolicy.fieldName] = {};
      expectFailureCode(
        envelopeForRoot(root, wrongType),
        root.branchOrdinal === 24
          ? "INVALID_FIELD_TYPE"
          : "INVALID_PAYLOAD_DISCRIMINANT"
      );
      const unknown = cloneRecord(sampleForNode(root.rootNodeId));
      unknown[root.versionPolicy.fieldName] = "future-version";
      expectFailureCode(
        envelopeForRoot(root, unknown),
        root.branchOrdinal === 24
          ? "INVALID_FIELD_VALUE"
          : "INVALID_PAYLOAD_DISCRIMINANT"
      );
    }
  });

  it("C-C12a preserves B26 non-empty variadic impairments through generic AST traversal", () => {
    const root = rootByOrdinal(26);
    const base = cloneRecord(sampleForNode(root.rootNodeId));
    const rootNode = node(root.rootNodeId);
    if (rootNode.kind !== "EXACT_RECORD") {
      throw new Error("B26 root must be an exact record");
    }
    const effectivenessField = rootNode.fields.find(
      (field) => field.fieldName === "sourceEffectiveness"
    );
    if (effectivenessField === undefined) {
      throw new Error("B26 source effectiveness field missing");
    }
    const effectivenessUnion = node(effectivenessField.childNodeId);
    if (effectivenessUnion.kind !== "TAGGED_UNION") {
      throw new Error("B26 source effectiveness must be tagged");
    }
    const ineffectiveBranch = effectivenessUnion.branches.find(
      (branch) => branch.tagLiteral === "KNOWN_INEFFECTIVE"
    );
    if (ineffectiveBranch === undefined) {
      throw new Error("B26 ineffective branch missing");
    }
    const ineffective = cloneRecord(sampleForNode(ineffectiveBranch.childNodeId));
    const represented = ineffective.representedImpairments;
    expect(Array.isArray(represented)).toBe(true);
    const first: unknown = Array.isArray(represented)
      ? (represented as unknown[])[0]
      : undefined;
    expect(first).toBeDefined();
    expect(
      validateDomainEventStructure(
        envelopeForRoot(root, {
          ...base,
          sourceEffectiveness: {
            ...ineffective,
            representedImpairments: [first]
          }
        })
      ).ok
    ).toBe(true);
    expect(
      validateDomainEventStructure(
        envelopeForRoot(root, {
          ...base,
          sourceEffectiveness: {
            ...ineffective,
            representedImpairments: [first, structuredClone(first)]
          }
        })
      ).ok
    ).toBe(true);
    expectFailureCode(
      envelopeForRoot(root, {
        ...base,
        sourceEffectiveness: { ...ineffective, representedImpairments: [] }
      }),
      "INVALID_PAYLOAD_STRUCTURE"
    );
  });

  it("C-C12b preserves only the three normalized B54 source-contract survivors", () => {
    const root = rootByOrdinal(54);
    const rootNode = node(root.rootNodeId);
    if (rootNode.kind !== "EXACT_RECORD") {
      throw new Error("B54 root must be an exact record");
    }
    const sourceField = rootNode.fields.find(
      (field) => field.fieldName === "sourceContract"
    );
    if (sourceField === undefined) {
      throw new Error("B54 source contract field missing");
    }
    const union = node(sourceField.childNodeId);
    if (union.kind !== "TAGGED_UNION") {
      throw new Error("B54 source contract must be a tagged union");
    }
    const base = cloneRecord(sampleForNode(root.rootNodeId));
    expect(union.branches).toHaveLength(3);
    for (const branch of union.branches) {
      expect(
        validateDomainEventStructure(
          envelopeForRoot(root, {
            ...base,
            sourceContract: sampleForNode(branch.childNodeId)
          })
        ).ok
      ).toBe(true);
    }
    const invalid = cloneRecord(base.sourceContract);
    invalid.kind = "R1";
    expectFailureCode(
      envelopeForRoot(root, { ...base, sourceContract: invalid }),
      "INVALID_PAYLOAD_STRUCTURE"
    );
    delete invalid.kind;
    expectFailureCode(
      envelopeForRoot(root, { ...base, sourceContract: invalid }),
      "INVALID_PAYLOAD_STRUCTURE"
    );
    expectFailureCode(
      envelopeForRoot(root, {
        ...base,
        sourceContract: {
          ...cloneRecord(
            sampleForNode(union.branches[0]?.childNodeId ?? "")
          ),
          extra: true
        }
      }),
      "EXTRA_FIELD"
    );
  });

  it("C-C13 issues only authentic process-local C tokens and reads detached frozen backing", () => {
    const result = validateDomainEventStructure(
      envelopeForRoot(rootByOrdinal(1))
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const read = readStructurallyValidatedDomainEvent(result.token);
    expect(read.ok).toBe(true);
    if (read.ok) {
      expect(Object.isFrozen(read.value)).toBe(true);
      expect(Object.isFrozen(read.value.event)).toBe(true);
      expect(Object.isFrozen(read.value.event.payload)).toBe(true);
      expect(Object.getPrototypeOf(read.value.event)).toBeNull();
    }
    expect(readStructurallyValidatedDomainEvent({})).toMatchObject({
      ok: false,
      diagnostic: { code: "INVALID_STRUCTURAL_TOKEN" }
    });
  });

  it("C-C14 invalidates token spread, JSON, structuredClone, and Proxy wrappers", () => {
    const result = validateDomainEventStructure(
      envelopeForRoot(rootByOrdinal(1))
    );
    if (!result.ok) throw new Error("expected token");
    const copies = [
      { ...result.token },
      JSON.parse(JSON.stringify(result.token)) as unknown,
      structuredClone(result.token),
      new Proxy(result.token, {})
    ];
    for (const copy of copies) {
      expect(readStructurallyValidatedDomainEvent(copy)).toMatchObject({
        ok: false,
        diagnostic: { code: "INVALID_STRUCTURAL_TOKEN" }
      });
    }
  });

  it("C-C15a proves the 47-leaf policy census and compatible F01-F34 public matrix", () => {
    expect(DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_IDS).toHaveLength(47);
    expect(new Set(DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_IDS).size).toBe(47);
    expect(DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE).toHaveLength(
      47
    );
    expect(
      Object.keys(DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY).sort()
    ).toEqual([...DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_IDS].sort());
    expect(
      DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE.filter(
        (entry) => entry.evidenceKind === "CALLABLE_PRIMARY_TEST"
      )
    ).toHaveLength(31);
    expect(
      DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE.filter(
        (entry) => entry.evidenceKind === "STATIC_BRANCH_BINDING"
      )
    ).toHaveLength(16);
    expect(
      new Set(
        DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE.map(
          (entry) => entry.exactSourceBinding
        )
      ).size
    ).toBe(47);
    const traceability = traceabilitySource();
    const tableRows = (start: string, end: string) => {
      const section = traceability.split(start)[1]?.split(end)[0];
      if (section === undefined) throw new Error(`missing traceability section ${start}`);
      return section
        .split(/\r?\n/u)
        .filter((line) => /^\| C-C/u.test(line))
        .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
    };
    const groupingRows = tableRows(
      "## Grouping inventory",
      "## Active criterion bindings"
    );
    const activeRows = tableRows(
      "## Active criterion bindings",
      "## Deterministic closure audit"
    );
    expect(activeRows).toHaveLength(28);
    expect(groupingRows).toHaveLength(5);
    expect(groupingRows.every((row) => row.length === 9)).toBe(true);
    expect(activeRows.every((row) => row.length === 19)).toBe(true);
    expect(activeRows.every((row) => row[18] === "PASS")).toBe(true);
    expect(activeRows.every((row) => row[17] === "`NONE`")).toBe(true);
    expect(traceability).not.toMatch(/SUP-2B20B-P2F1R-C/u);
    const staticRows = activeRows.filter((row) => row[0] === "C-C15d");
    expect(staticRows).toEqual([
      expect.arrayContaining([
        "C-C15d",
        "`scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs`",
        "`STATIC_C_C15D_16_EXACT_AST_BINDINGS`",
        "`NONE`",
        "PASS"
      ])
    ]);
    const vitestRows = activeRows.filter((row) => row[0] !== "C-C15d");
    expect(vitestRows).toHaveLength(27);
    expect(
      vitestRows.every(
        (row) =>
          row[9] ===
          "`packages/domain-core/src/domain-event-structural-validator.test.ts`"
      )
    ).toBe(true);
    const actualTitles = vitestRows.map((row) =>
      (row[10] ?? "").replaceAll("`", "")
    );
    expect(new Set(actualTitles).size).toBe(27);
    const testSource = readFileSync(fileURLToPath(import.meta.url), "utf8");
    for (const title of actualTitles) {
      expect(testSource).toContain(`it("${title}"`);
    }
    const collectedTitles = [
      ...testSource.matchAll(/^\s*it\("([^"]+)", \(\) => \{/gmu)
    ].map((match) => match[1] as string);
    expect(collectedTitles).toHaveLength(28);
    expect(new Set(collectedTitles).size).toBe(28);
    expect(collectedTitles).toContain(
      "C-C15d binds all 16 static leaves to exact fail-closed source guards"
    );
    const inventory = collectedTitles
      .map((title) => [
        "domain-core",
        "packages/domain-core/src/domain-event-structural-validator.test.ts",
        ["P2F1R-C domain event structural validation"],
        title
      ] as const)
      .sort((left, right) => {
        const leftKey = JSON.stringify(left);
        const rightKey = JSON.stringify(right);
        return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
      });
    const inventorySha256 = createHash("sha256")
      .update(`${JSON.stringify(inventory)}\n`)
      .digest("hex");
    expect(inventorySha256).toBe(
      "dc7acb226c45a39932ebf27c3928e1ad9a51566172221071470b2ea4bd43e720"
    );
    const primaryIdentities = activeRows.map((row) => `${row[9]}\u0000${row[10]}`);
    expect(new Set(primaryIdentities).size).toBe(28);
    expect(traceability).toContain(
      "`ap1AncestorPath`: `[\"P2F1R-C domain event structural validation\"]`"
    );
    expect(traceability).toContain(
      "`ap1CollectedVitestInventorySha256`: `dc7acb226c45a39932ebf27c3928e1ad9a51566172221071470b2ea4bd43e720`"
    );
    expect(traceability).toContain("`R1`: `[]`");
    expect(traceability).toContain("`R2`: `[]`");
    expect(
      traceability.match(/`mechanismMatch`: `28\/28 PASS`/u)
    ).not.toBeNull();
    expect(DOMAIN_EVENT_STRUCTURAL_FAILURE_CONTEXT_IDS).toHaveLength(34);
    expect(new Set(DOMAIN_EVENT_STRUCTURAL_FAILURE_CONTEXT_IDS).size).toBe(
      34
    );
    expect(DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY_TUPLE).toHaveLength(34);
    expect(
      new Set(
        DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY_TUPLE.map(
          (entry) => entry.directBranchBinding
        )
      ).size
    ).toBe(34);
    expect(
      Object.keys(DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY).sort()
    ).toEqual([...DOMAIN_EVENT_STRUCTURAL_FAILURE_CONTEXT_IDS].sort());
    expect(
      DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY_TUPLE.map((entry) => [
        entry.contextId,
        entry.code,
        entry.phase,
        entry.safeSummary,
        entry.quarantineRecommended,
        entry.retryability,
        entry.directBranchBinding
      ])
    ).toEqual(EXPECTED_DIAGNOSTIC_POLICY_MATRIX);

    for (const [
      contextId,
      code,
      phase,
      safeSummary,
      quarantineRecommended,
      retryability,
      directBranchBinding
    ] of EXPECTED_DIAGNOSTIC_POLICY_MATRIX) {
      const policy = DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY[contextId];
      expect(Object.keys(policy).sort()).toEqual([
        "code",
        "contextId",
        "directBranchBinding",
        "phase",
        "quarantineRecommended",
        "retryability",
        "safeSummary"
      ]);
      expect(policy).toEqual({
        contextId,
        code,
        phase,
        safeSummary,
        quarantineRecommended,
        retryability,
        directBranchBinding
      });
      const leaf = DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE.find(
        (entry) => entry.publicContextId === contextId
      );
      if (leaf === undefined) throw new Error("missing diagnostic leaf");
      const first = createDomainEventStructuralDiagnostic(leaf.leafId);
      const second = createDomainEventStructuralDiagnostic(leaf.leafId);
      expect(first).toEqual(second);
      expect(first).toEqual({
        code,
        phase,
        path: [],
        safeSummary,
        quarantineRecommended,
        retryability,
        taggedUnionCoordinate: null,
        failClosed: true
      });
      expect(Object.keys(first).sort()).toEqual([
        "code",
        "failClosed",
        "path",
        "phase",
        "quarantineRecommended",
        "retryability",
        "safeSummary",
        "taggedUnionCoordinate"
      ]);
      expect(Object.isFrozen(first)).toBe(true);
      expect(first).not.toHaveProperty("message");
      expect(first).not.toHaveProperty("stack");
      expect(first).not.toHaveProperty("input");
      expect(first).not.toHaveProperty("value");
      expect(first).not.toHaveProperty("detail");
      expect(JSON.stringify(first)).not.toContain("SECRET_HOSTILE_VALUE");
    }
    const longPath = Array.from({ length: 40 }, (_, ordinal) => ({
      kind: "PAYLOAD_FIELD_ORDINAL" as const,
      ordinal: ordinal + 1
    }));
    const bounded = boundDomainEventStructuralPath(longPath);
    expect(bounded).toHaveLength(32);
    expect(bounded[31]).toEqual({ kind: "TRUNCATED" });
  });

  it("C-C15b binds all 31 callable diagnostic leaves to real failure entry points", () => {
    const P = (ordinal: number) => ({ kind: "PAYLOAD_FIELD_ORDINAL" as const, ordinal });
    const U = (ordinal: number) => ({ kind: "UNION_BRANCH_ORDINAL" as const, ordinal });
    const X = (ordinal: number) => ({ kind: "PAYLOAD_EXTRA_ENTRY_ORDINAL" as const, ordinal });
    const E = (ordinal: number) => ({ kind: "ENVELOPE_FIELD_ORDINAL" as const, ordinal });
    const D = (ordinal: number) => ({ kind: "PAYLOAD_DISCRIMINANT_ORDINAL" as const, ordinal });
    const A = (index: number) => ({ kind: "ARRAY_INDEX" as const, index });
    const observation = (
      diagnosticLeafId: (typeof DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_IDS)[number],
      reads: readonly [number, number, number, number, number],
      flags: string,
      payloadPresent = flags.includes("p")
    ) => ({
      diagnosticLeafId,
      authorityChecked: flags.includes("A"),
      captureEntered: flags.includes("C"),
      envelopeKeySetChecked: flags.includes("K"),
      envelopeFieldReads: reads[0],
      eventTypeReads: reads[1],
      eventVersionReads: reads[2],
      payloadKeyPresenceChecked: flags.includes("P"),
      payloadKeyPresent: payloadPresent,
      payloadNodeAcquired: flags.includes("N"),
      payloadDiscriminatorReads: reads[3],
      payloadContentReads: reads[4],
      astTraversalEntered: flags.includes("T"),
      validatedBackingConstructed: flags.includes("B"),
      tokenIssued: flags.includes("I")
    });
    const astInput = (
      rootOrdinal: number,
      mode: PublicAstMutationMode,
      tagged: boolean
    ): Record<string, unknown> => {
      const root = rootByOrdinal(rootOrdinal);
      const mutation = mutatePublicAstSample(root.rootNodeId, mode, tagged);
      expect(mutation.matched, `${rootOrdinal}:${mode}:${tagged}`).toBe(true);
      return envelopeForRoot(root, mutation.value);
    };
    const taggedInput = (
      mode: "MISSING" | "WRONG_KIND" | "UNKNOWN"
    ): Record<string, unknown> => {
      const root = rootByOrdinal(20);
      const mutation = mutateFirstTaggedDiscriminator(root.rootNodeId, mode);
      expect(mutation.matched, mode).toBe(true);
      return envelopeForRoot(root, mutation.value);
    };
    const discriminatedInput = (value: unknown, remove = false) => {
      const root = rootByOrdinal(11);
      const payload = cloneRecord(sampleForNode(root.rootNodeId));
      if (remove) delete payload.opportunityKind;
      else payload.opportunityKind = value;
      return envelopeForRoot(root, payload);
    };
    const taggedPath20 = [P(2)];
    const knownCoordinate20 = (entryOrdinal: number) => ({
      eventBranchOrdinal: 20,
      astNodeOrdinal: 161,
      taggedUnionPath: taggedPath20,
      field: { containerPath: taggedPath20, canonicalObjectEntryOrdinal: entryOrdinal },
      state: "KNOWN_VARIANT" as const,
      taggedVariantOrdinal: 1
    });
    const knownCoordinate53 = {
      eventBranchOrdinal: 53,
      astNodeOrdinal: 336,
      taggedUnionPath: [P(20)],
      field: { containerPath: [P(20)], canonicalObjectEntryOrdinal: 1 },
      state: "KNOWN_VARIANT" as const,
      taggedVariantOrdinal: 1
    };
    let hostileGetterCalls = 0;
    const hostile = Object.create(null) as Record<string, unknown>;
    Object.defineProperty(hostile, "category", {
      enumerable: true,
      get: () => {
        hostileGetterCalls += 1;
        return "SECRET_HOSTILE_VALUE";
      }
    });
    const missingPayload = () => {
      const value = envelopeForRoot(rootByOrdinal(1));
      delete value.payload;
      return value;
    };
    const callableCases = [
      { leafId: "L02_F02_CAPTURE_CORRECTABLE", publicContextId: "F02", entry: "UNKNOWN", input: () => undefined, path: [], observation: observation("L02_F02_CAPTURE_CORRECTABLE", [0, 0, 0, 0, 0], "AC"), budget: "A_ONLY", nonleak: ["undefined"] },
      { leafId: "L03_F03_CAPTURE_HOSTILE", publicContextId: "F03", entry: "UNKNOWN", input: () => hostile, path: [{ kind: "CAPTURE_OBJECT_KEY_ORDINAL" as const, ordinal: 0 }], observation: observation("L03_F03_CAPTURE_HOSTILE", [0, 0, 0, 0, 0], "AC"), budget: "A_ONLY", nonleak: ["SECRET_HOSTILE_VALUE", "category"] },
      { leafId: "L05_F05_CAPTURE_TOKEN_INVALID", publicContextId: "F05", entry: "CAPTURED", input: () => ({}), path: [], observation: observation("L05_F05_CAPTURE_TOKEN_INVALID", [0, 0, 0, 0, 0], "A"), budget: "ZERO", nonleak: ["capture token"] },
      { leafId: "L07_F07_ENVELOPE_NOT_OBJECT", publicContextId: "F07", entry: "UNKNOWN", input: () => null, path: [], observation: observation("L07_F07_ENVELOPE_NOT_OBJECT", [0, 0, 0, 0, 0], "AC"), budget: "NO_PAYLOAD", nonleak: ["SECRET_NULL_INPUT"] },
      { leafId: "L08_F08_ENVELOPE_FIELD_MISSING", publicContextId: "F08", entry: "UNKNOWN", input: missingPayload, path: [E(14)], observation: observation("L08_F08_ENVELOPE_FIELD_MISSING", [0, 0, 0, 0, 0], "ACKP", false), budget: "NO_PAYLOAD", nonleak: ["payload"] },
      { leafId: "L09_F09_ENVELOPE_FIELD_EXTRA", publicContextId: "F09", entry: "UNKNOWN", input: () => ({ ...envelopeForRoot(rootByOrdinal(1)), extra: "SECRET_EXTRA" }), path: [{ kind: "ENVELOPE_EXTRA_ENTRY_ORDINAL" as const, ordinal: 11 }], observation: observation("L09_F09_ENVELOPE_FIELD_EXTRA", [0, 0, 0, 0, 0], "ACKPp"), budget: "NO_PAYLOAD", nonleak: ["extra", "SECRET_EXTRA"] },
      { leafId: "L10_F10_ENVELOPE_FIELD_WRONG_KIND", publicContextId: "F10", entry: "UNKNOWN", input: () => ({ ...envelopeForRoot(rootByOrdinal(1)), eventSequence: "SECRET_SEQUENCE" }), path: [E(4)], observation: observation("L10_F10_ENVELOPE_FIELD_WRONG_KIND", [4, 0, 0, 0, 0], "ACKPp"), budget: "NO_PAYLOAD", nonleak: ["SECRET_SEQUENCE", "eventSequence"] },
      { leafId: "L11_F11_ENVELOPE_FIELD_INVALID_VALUE", publicContextId: "F11", entry: "UNKNOWN", input: () => ({ ...envelopeForRoot(rootByOrdinal(1)), category: "audit" }), path: [E(1)], observation: observation("L11_F11_ENVELOPE_FIELD_INVALID_VALUE", [1, 0, 0, 0, 0], "ACKPp"), budget: "NO_PAYLOAD", nonleak: ["audit", "category"] },
      { leafId: "L12_F12_EVENT_TYPE_UNKNOWN", publicContextId: "F12", entry: "UNKNOWN", input: () => ({ ...envelopeForRoot(rootByOrdinal(1)), eventType: "SECRET_FUTURE_EVENT" }), path: [E(7)], observation: observation("L12_F12_EVENT_TYPE_UNKNOWN", [13, 1, 0, 0, 0], "ACKPp"), budget: "NO_PAYLOAD", nonleak: ["SECRET_FUTURE_EVENT", "eventType"] },
      { leafId: "L13_F13_EVENT_VERSION_UNSUPPORTED", publicContextId: "F13", entry: "UNKNOWN", input: () => ({ ...envelopeForRoot(rootByOrdinal(1)), eventVersion: 2 }), path: [E(8)], observation: observation("L13_F13_EVENT_VERSION_UNSUPPORTED", [13, 1, 1, 0, 0], "ACKPp"), budget: "NO_PAYLOAD", nonleak: ["eventVersion"] },
      { leafId: "L14_F14_PAYLOAD_NOT_OBJECT", publicContextId: "F14", entry: "UNKNOWN", input: () => envelopeForRoot(rootByOrdinal(1), "SECRET_PAYLOAD"), path: [E(14)], observation: observation("L14_F14_PAYLOAD_NOT_OBJECT", [13, 1, 1, 0, 0], "ACKPpN"), budget: "NODE_ONLY", nonleak: ["SECRET_PAYLOAD", "payload"] },
      { leafId: "L15_F15_ROOT_DISCRIMINATOR_MISSING", publicContextId: "F15", entry: "UNKNOWN", input: () => discriminatedInput(undefined, true), path: [E(14), D(2)], observation: observation("L15_F15_ROOT_DISCRIMINATOR_MISSING", [13, 1, 1, 2, 0], "ACKPpN"), budget: "DISCRIMINATOR_ONLY", nonleak: ["opportunityKind"] },
      { leafId: "L16_F16_ROOT_DISCRIMINATOR_WRONG_KIND", publicContextId: "F16", entry: "UNKNOWN", input: () => discriminatedInput({ secret: "SECRET_KIND" }), path: [E(14), D(2)], observation: observation("L16_F16_ROOT_DISCRIMINATOR_WRONG_KIND", [13, 1, 1, 2, 0], "ACKPpN"), budget: "DISCRIMINATOR_ONLY", nonleak: ["SECRET_KIND", "opportunityKind"] },
      { leafId: "L17_F17_ROOT_DISCRIMINATOR_UNKNOWN", publicContextId: "F17", entry: "UNKNOWN", input: () => discriminatedInput("SECRET_UNKNOWN_KIND"), path: [E(14), D(2)], observation: observation("L17_F17_ROOT_DISCRIMINATOR_UNKNOWN", [13, 1, 1, 2, 0], "ACKPpN"), budget: "DISCRIMINATOR_ONLY", nonleak: ["SECRET_UNKNOWN_KIND", "opportunityKind"] },
      { leafId: "L26_F21_RECORD_MISSING_PLAIN", publicContextId: "F21", entry: "UNKNOWN", input: () => astInput(1, "RECORD_MISSING", false), path: [P(1)], observation: observation("L26_F21_RECORD_MISSING_PLAIN", [13, 1, 1, 0, 0], "ACKPpNT"), budget: "SELECTED_AST", nonleak: ["aiPlayerCount", "C1.SHA256"] },
      { leafId: "L28_F22_RECORD_EXTRA_PLAIN", publicContextId: "F22", entry: "UNKNOWN", input: () => astInput(1, "RECORD_EXTRA", false), path: [X(1)], observation: observation("L28_F22_RECORD_EXTRA_PLAIN", [13, 1, 1, 0, 0], "ACKPpNT"), budget: "SELECTED_AST", nonleak: ["__c_extra", "C1.SHA256"] },
      { leafId: "L30_F23_KIND_MISMATCH_PLAIN", publicContextId: "F23", entry: "UNKNOWN", input: () => astInput(1, "KIND_MISMATCH", false), path: [P(2)], observation: observation("L30_F23_KIND_MISMATCH_PLAIN", [13, 1, 1, 0, 2], "ACKPpNT"), budget: "SELECTED_AST", nonleak: ["gameId", "C1.SHA256"] },
      { leafId: "L32_F24_LITERAL_MISMATCH_PLAIN", publicContextId: "F24", entry: "UNKNOWN", input: () => astInput(2, "LITERAL_MISMATCH", false), path: [P(1)], observation: observation("L32_F24_LITERAL_MISMATCH_PLAIN", [13, 1, 1, 0, 1], "ACKPpNT"), budget: "SELECTED_AST", nonleak: ["__C_UNKNOWN_LITERAL__", "edition", "C1.SHA256"] },
      { leafId: "L34_F25_CARDINALITY_MISMATCH_PLAIN", publicContextId: "F25", entry: "UNKNOWN", input: () => astInput(11, "CARDINALITY_MISMATCH", false), path: [P(12), P(2)], observation: observation("L34_F25_CARDINALITY_MISMATCH_PLAIN", [13, 1, 1, 2, 20], "ACKPpNT"), budget: "SELECTED_AST", nonleak: ["futureUnsupportedDecisionKinds", "C1.SHA256"] },
      { leafId: "L39_F27_CLOSED_UNION_ZERO_MATCH", publicContextId: "F27", entry: "UNKNOWN", input: () => astInput(10, "CLOSED_UNION_ZERO", false), path: [P(10), P(1), A(0)], observation: observation("L39_F27_CLOSED_UNION_ZERO_MATCH", [13, 1, 1, 0, 12], "ACKPpNT"), budget: "ALL_CLOSED_BRANCHES", nonleak: ["__c_closed_union_no_match", "C1.SHA256"] },
      { leafId: "L41_F29_REFINEMENT_REJECTED_PLAIN", publicContextId: "F29", entry: "UNKNOWN", input: () => astInput(1, "REFINEMENT_REJECTED", false), path: [P(2)], observation: observation("L41_F29_REFINEMENT_REJECTED_PLAIN", [13, 1, 1, 0, 2], "ACKPpNT"), budget: "ONE_PREDICATE", nonleak: ["gameId", "C1.SHA256"] },
      { leafId: "L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT", publicContextId: "F21", entry: "UNKNOWN", input: () => astInput(20, "RECORD_MISSING", true), path: [P(2), U(1), P(1)], coordinate: knownCoordinate20(3), observation: observation("L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT", [13, 1, 1, 3, 2], "ACKPpNT"), budget: "SELECTED_CHILD", nonleak: ["abilityRoleId", "C1.SHA256"] },
      { leafId: "L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT", publicContextId: "F22", entry: "UNKNOWN", input: () => astInput(20, "RECORD_EXTRA", true), path: [P(2), U(1), X(1)], coordinate: knownCoordinate20(5), observation: observation("L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT", [13, 1, 1, 3, 2], "ACKPpNT"), budget: "SELECTED_CHILD", nonleak: ["__c_extra", "C1.SHA256"] },
      { leafId: "L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT", publicContextId: "F23", entry: "UNKNOWN", input: () => astInput(20, "KIND_MISMATCH", true), path: [P(2), U(1), P(3)], coordinate: knownCoordinate20(4), observation: observation("L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT", [13, 1, 1, 3, 5], "ACKPpNT"), budget: "SELECTED_CHILD", nonleak: ["grantId", "C1.SHA256"] },
      { leafId: "L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT", publicContextId: "F24", entry: "UNKNOWN", input: () => astInput(20, "LITERAL_MISMATCH", true), path: [P(2), U(1), P(1)], coordinate: knownCoordinate20(4), observation: observation("L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT", [13, 1, 1, 3, 3], "ACKPpNT"), budget: "SELECTED_CHILD", nonleak: ["__C_UNKNOWN_LITERAL__", "abilityRoleId", "C1.SHA256"] },
      { leafId: "L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT", publicContextId: "F25", entry: "UNKNOWN", input: () => astInput(53, "CARDINALITY_MISMATCH", true), path: [P(20), U(1), P(2)], coordinate: knownCoordinate53, observation: observation("L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT", [13, 1, 1, 0, 93], "ACKPpNT"), budget: "SELECTED_CHILD", nonleak: ["representedImpairmentIds", "C1.SHA256"] },
      { leafId: "L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT", publicContextId: "F29", entry: "UNKNOWN", input: () => astInput(20, "REFINEMENT_REJECTED", true), path: [P(2), U(1), P(3)], coordinate: knownCoordinate20(4), observation: observation("L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT", [13, 1, 1, 3, 5], "ACKPpNT"), budget: "ONE_PREDICATE", nonleak: ["grantId", "C1.SHA256"] },
      { leafId: "L36_F26_TAGGED_DISCRIMINATOR_MISSING", publicContextId: "F26", entry: "UNKNOWN", input: () => taggedInput("MISSING"), path: [P(2)], coordinate: { eventBranchOrdinal: 20, astNodeOrdinal: 161, taggedUnionPath: taggedPath20, field: null, state: "MISSING_DISCRIMINANT" as const }, observation: observation("L36_F26_TAGGED_DISCRIMINATOR_MISSING", [13, 1, 1, 3, 1], "ACKPpNT"), budget: "NO_CHILD", nonleak: ["abilitySource", "SECRET_TAG_FIELD", "C1.SHA256"] },
      { leafId: "L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND", publicContextId: "F26", entry: "UNKNOWN", input: () => taggedInput("WRONG_KIND"), path: [P(2)], coordinate: { eventBranchOrdinal: 20, astNodeOrdinal: 161, taggedUnionPath: taggedPath20, field: { containerPath: taggedPath20, canonicalObjectEntryOrdinal: 4 }, state: "INVALID_DISCRIMINANT_TYPE" as const }, observation: observation("L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND", [13, 1, 1, 3, 2], "ACKPpNT"), budget: "NO_CHILD", nonleak: ["abilitySource", "SECRET_TAG_FIELD", "C1.SHA256"] },
      { leafId: "L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN", publicContextId: "F26", entry: "UNKNOWN", input: () => taggedInput("UNKNOWN"), path: [P(2)], coordinate: { eventBranchOrdinal: 20, astNodeOrdinal: 161, taggedUnionPath: taggedPath20, field: { containerPath: taggedPath20, canonicalObjectEntryOrdinal: 4 }, state: "UNKNOWN_DISCRIMINANT_VALUE" as const }, observation: observation("L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN", [13, 1, 1, 3, 2], "ACKPpNT"), budget: "NO_CHILD", nonleak: ["__C_UNKNOWN_TAG__", "abilitySource", "SECRET_TAG_FIELD", "C1.SHA256"] }
    ] as const;
    expect(callableCases).toHaveLength(30);
    const observedLeaves: string[] = [];
    for (const callableCase of callableCases) {
      const first = callableCase.entry === "CAPTURED"
        ? validateCapturedDomainEventStructureWithObservationForTest(callableCase.input())
        : validateDomainEventStructureWithObservationForTest(callableCase.input());
      const second = callableCase.entry === "CAPTURED"
        ? validateCapturedDomainEventStructureWithObservationForTest(callableCase.input())
        : validateDomainEventStructureWithObservationForTest(callableCase.input());
      expect(first, `${callableCase.leafId}:repeat`).toEqual(second);
      expect(first.result.ok, callableCase.leafId).toBe(false);
      if (first.result.ok) throw new Error(`expected ${callableCase.leafId}`);
      const policyRow = EXPECTED_DIAGNOSTIC_POLICY_MATRIX.find(
        (entry) => entry[0] === callableCase.publicContextId
      );
      if (policyRow === undefined) throw new Error("missing literal public policy");
      expect(first.result.diagnostic).toEqual({
        code: policyRow[1],
        phase: policyRow[2],
        path: callableCase.path,
        safeSummary: policyRow[3],
        quarantineRecommended: policyRow[4],
        retryability: policyRow[5],
        taggedUnionCoordinate: "coordinate" in callableCase ? callableCase.coordinate : null,
        failClosed: true
      });
      expect(first.observation).toEqual(callableCase.observation);
      const leafPolicy = DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY[callableCase.leafId];
      expect(leafPolicy.publicContextId).toBe(callableCase.publicContextId);
      expect(leafPolicy.payloadReadBudget).toBe(callableCase.budget);
      expect(leafPolicy.evidenceKind).toBe("CALLABLE_PRIMARY_TEST");
      const serialized = JSON.stringify(first.result.diagnostic);
      for (const sentinel of callableCase.nonleak) {
        expect(serialized, `${callableCase.leafId}:${sentinel}`).not.toContain(sentinel);
      }
      expect(first.result.diagnostic).not.toHaveProperty("message");
      expect(first.result.diagnostic).not.toHaveProperty("stack");
      expect(first.result.diagnostic).not.toHaveProperty("input");
      expect(first.result.diagnostic).not.toHaveProperty("value");
      observedLeaves.push(callableCase.leafId);
    }
    expect(hostileGetterCalls).toBe(0);
    const firstInvalidToken = readStructurallyValidatedDomainEvent({});
    const secondInvalidToken = readStructurallyValidatedDomainEvent({});
    expect(firstInvalidToken).toEqual(secondInvalidToken);
    expect(firstInvalidToken).toEqual({
      ok: false,
      diagnostic: {
        code: "INVALID_STRUCTURAL_TOKEN",
        phase: "TOKEN_CONSUMPTION",
        path: [],
        safeSummary: "STRUCTURAL_TOKEN_REJECTED",
        quarantineRecommended: true,
        retryability: "NEVER",
        taggedUnionCoordinate: null,
        failClosed: true
      }
    });
    expect(DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY.L46_F33_TOKEN_INVALID).toMatchObject({
      publicContextId: "F33",
      payloadReadBudget: "ZERO",
      evidenceKind: "CALLABLE_PRIMARY_TEST"
    });
    observedLeaves.push("L46_F33_TOKEN_INVALID");
    expect(observedLeaves).toHaveLength(31);
    expect(new Set(observedLeaves).size).toBe(31);
    expect([...observedLeaves].sort()).toEqual(
      DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE
        .filter((entry) => entry.evidenceKind === "CALLABLE_PRIMARY_TEST")
        .map((entry) => entry.leafId)
        .sort()
    );
  });

  it("C-C15c proves all nine tagged-union coordinate states without identity leakage", () => {
    const policies = DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE.filter(
      (entry) => entry.taggedCoordinatePolicy !== "NULL"
    );
    expect(policies).toHaveLength(9);
    expect(policies.map((entry) => entry.leafId)).toEqual([
      "L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT",
      "L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT",
      "L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT",
      "L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT",
      "L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT",
      "L36_F26_TAGGED_DISCRIMINATOR_MISSING",
      "L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND",
      "L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN",
      "L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT"
    ]);
    for (const policy of policies) {
      expect(policy.exactSourceBinding).toMatch(/^traverseNode\.|^executeRefinement\./);
    }
    const P = (ordinal: number) => ({ kind: "PAYLOAD_FIELD_ORDINAL" as const, ordinal });
    const U = (ordinal: number) => ({ kind: "UNION_BRANCH_ORDINAL" as const, ordinal });
    const X = (ordinal: number) => ({ kind: "PAYLOAD_EXTRA_ENTRY_ORDINAL" as const, ordinal });
    const taggedPath20 = [P(2)];
    const known20 = (canonicalObjectEntryOrdinal: number) => ({
      eventBranchOrdinal: 20,
      astNodeOrdinal: 161,
      taggedUnionPath: taggedPath20,
      field: { containerPath: taggedPath20, canonicalObjectEntryOrdinal },
      state: "KNOWN_VARIANT" as const,
      taggedVariantOrdinal: 1
    });
    const buildAst = (
      rootOrdinal: number,
      mode: PublicAstMutationMode
    ) => {
      const root = rootByOrdinal(rootOrdinal);
      const mutation = mutatePublicAstSample(root.rootNodeId, mode, true);
      expect(mutation.matched, `${rootOrdinal}:${mode}`).toBe(true);
      return envelopeForRoot(root, mutation.value);
    };
    const buildTagged = (mode: "MISSING" | "WRONG_KIND" | "UNKNOWN") => {
      const root = rootByOrdinal(20);
      const mutation = mutateFirstTaggedDiscriminator(root.rootNodeId, mode);
      expect(mutation.matched, mode).toBe(true);
      return envelopeForRoot(root, mutation.value);
    };
    const cases = [
      { leafId: "L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT", rootOrdinal: 20, input: () => buildAst(20, "RECORD_MISSING"), path: [P(2), U(1), P(1)], coordinate: known20(3) },
      { leafId: "L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT", rootOrdinal: 20, input: () => buildAst(20, "RECORD_EXTRA"), path: [P(2), U(1), X(1)], coordinate: known20(5) },
      { leafId: "L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT", rootOrdinal: 20, input: () => buildAst(20, "KIND_MISMATCH"), path: [P(2), U(1), P(3)], coordinate: known20(4) },
      { leafId: "L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT", rootOrdinal: 20, input: () => buildAst(20, "LITERAL_MISMATCH"), path: [P(2), U(1), P(1)], coordinate: known20(4) },
      { leafId: "L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT", rootOrdinal: 53, input: () => buildAst(53, "CARDINALITY_MISMATCH"), path: [P(20), U(1), P(2)], coordinate: { eventBranchOrdinal: 53, astNodeOrdinal: 336, taggedUnionPath: [P(20)], field: { containerPath: [P(20)], canonicalObjectEntryOrdinal: 1 }, state: "KNOWN_VARIANT" as const, taggedVariantOrdinal: 1 } },
      { leafId: "L36_F26_TAGGED_DISCRIMINATOR_MISSING", rootOrdinal: 20, input: () => buildTagged("MISSING"), path: [P(2)], coordinate: { eventBranchOrdinal: 20, astNodeOrdinal: 161, taggedUnionPath: taggedPath20, field: null, state: "MISSING_DISCRIMINANT" as const } },
      { leafId: "L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND", rootOrdinal: 20, input: () => buildTagged("WRONG_KIND"), path: [P(2)], coordinate: { eventBranchOrdinal: 20, astNodeOrdinal: 161, taggedUnionPath: taggedPath20, field: { containerPath: taggedPath20, canonicalObjectEntryOrdinal: 4 }, state: "INVALID_DISCRIMINANT_TYPE" as const } },
      { leafId: "L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN", rootOrdinal: 20, input: () => buildTagged("UNKNOWN"), path: [P(2)], coordinate: { eventBranchOrdinal: 20, astNodeOrdinal: 161, taggedUnionPath: taggedPath20, field: { containerPath: taggedPath20, canonicalObjectEntryOrdinal: 4 }, state: "UNKNOWN_DISCRIMINANT_VALUE" as const } },
      { leafId: "L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT", rootOrdinal: 20, input: () => buildAst(20, "REFINEMENT_REJECTED"), path: [P(2), U(1), P(3)], coordinate: known20(4) }
    ] as const;
    expect(cases).toHaveLength(9);
    for (const taggedCase of cases) {
      expect(taggedCase.coordinate.eventBranchOrdinal).toBe(taggedCase.rootOrdinal);
      const first = validateDomainEventStructureWithObservationForTest(taggedCase.input());
      const second = validateDomainEventStructureWithObservationForTest(taggedCase.input());
      expect(first, `${taggedCase.leafId}:repeat`).toEqual(second);
      expect(first.result.ok).toBe(false);
      if (first.result.ok) throw new Error("expected real public tagged diagnostic");
      expect(first.observation.diagnosticLeafId).toBe(taggedCase.leafId);
      expect(first.result.diagnostic.path).toEqual(taggedCase.path);
      expect(first.result.diagnostic.taggedUnionCoordinate).toEqual(taggedCase.coordinate);
      expect(first.observation).toMatchObject({
        authorityChecked: true,
        captureEntered: true,
        envelopeKeySetChecked: true,
        payloadKeyPresenceChecked: true,
        payloadKeyPresent: true,
        payloadNodeAcquired: true,
        astTraversalEntered: true,
        validatedBackingConstructed: false,
        tokenIssued: false
      });
      const serialized = JSON.stringify(first.result.diagnostic);
      expect(serialized).not.toContain("__C_UNKNOWN_TAG__");
      expect(serialized).not.toContain("__C_UNKNOWN_LITERAL__");
      expect(serialized).not.toContain("abilityRoleId");
      expect(serialized).not.toContain("grantId");
      expect(serialized).not.toContain("representedImpairmentIds");
      expect(serialized).not.toContain("C1.SHA256");
    }
    const source = productionSource();
    expect(source).not.toContain("deriveTaggedUnionTagFieldOrdinal");
    expect(source).not.toContain("taggedUnionTagFieldOrdinalsByNodeId");
    expect(source).not.toContain("filter((branch) =>\n        structuralLiteralMatches");
  });

  it("C-C15d binds all 16 static leaves to exact fail-closed source guards", () => {
    const staticPolicies =
      DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE.filter(
        (entry) => entry.evidenceKind === "STATIC_BRANCH_BINDING"
    );
    expect(staticPolicies).toHaveLength(16);
    expect(new Set(staticPolicies.map((entry) => entry.leafId)).size).toBe(16);
    const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));
    const verifierPath = fileURLToPath(
      new URL("../../../scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs", import.meta.url)
    );
    const selfTestPath = fileURLToPath(
      new URL("../../../scripts/verify-p2f1r-c-static-diagnostic-bindings.test.mjs", import.meta.url)
    );
    const verifier = spawnSync(process.execPath, [verifierPath, repositoryRoot], {
      cwd: repositoryRoot,
      encoding: "utf8"
    });
    expect(verifier.status, verifier.stderr).toBe(0);
    expect(verifier.stderr).toBe("");
    const staticAudit = JSON.parse(verifier.stdout) as {
      readonly mapped: number;
      readonly missing: number;
      readonly duplicate: number;
      readonly orphan: number;
      readonly invalidSymbol: number;
      readonly invalidPolicy: number;
      readonly invalidReturn: number;
      readonly branchOccurrences: number;
      readonly rows: readonly { readonly leafId: string }[];
    };
    expect(staticAudit).toMatchObject({
      mapped: 16,
      missing: 0,
      duplicate: 0,
      orphan: 0,
      invalidSymbol: 0,
      invalidPolicy: 0,
      invalidReturn: 0,
      branchOccurrences: 25
    });
    expect(staticAudit.rows.map((row) => row.leafId).sort()).toEqual(
      staticPolicies.map((entry) => entry.leafId).sort()
    );
    const selfTest = spawnSync(process.execPath, [selfTestPath], {
      cwd: repositoryRoot,
      encoding: "utf8"
    });
    expect(selfTest.status, selfTest.stderr).toBe(0);
    expect(selfTest.stderr).toBe("");
    expect(JSON.parse(selfTest.stdout)).toEqual({
      selfTest: "PASS",
      mutantsRejected: 12,
      mapped: 16
    });

    const taggedNode = {
      nodeId: "tagged",
      kind: "TAGGED_UNION",
      tagField: "kind",
      branches: [
        { branchOrdinal: 1, tagLiteral: "A", childNodeId: "variant" }
      ]
    } as const;
    const fixture = nodeFixtureAuthority(
      [
        taggedNode,
        {
          nodeId: "variant",
          kind: "EXACT_RECORD",
          fields: [
            { fieldOrdinal: 1, fieldName: "kind", required: true, optional: false, childNodeId: "literal-a" },
            { fieldOrdinal: 2, fieldName: "value", required: true, optional: false, childNodeId: "text" }
          ]
        },
        { nodeId: "literal-a", kind: "LITERAL", value: "A" },
        { nodeId: "text", kind: "STRING" }
      ],
      "tagged"
    );
    expect(fixture.status).toBe("HEALTHY");
    if (fixture.status !== "HEALTHY") throw new Error("expected healthy F20 fixture");
    const invalidTaggedNode = Object.freeze({
      ...taggedNode,
      branches: Object.freeze([
        Object.freeze({ branchOrdinal: 2, tagLiteral: "A", childNodeId: "variant" })
      ])
    }) satisfies StructuralSchemaNodeV1;
    const invalidAuthority = Object.freeze({
      ...fixture,
      candidate: Object.freeze({
        ...fixture.candidate,
        nodeBindings: Object.freeze(
          fixture.candidate.nodeBindings.map((binding) =>
            binding.nodeId === "tagged"
              ? Object.freeze({ nodeId: "tagged", node: invalidTaggedNode })
              : binding
          )
        )
      }),
      traversal: Object.freeze({
        ...fixture.traversal,
        uniqueNodes: Object.freeze(
          fixture.traversal.uniqueNodes.map((entry) =>
            entry.nodeId === "tagged"
              ? Object.freeze({ ...entry, node: invalidTaggedNode })
              : entry
          )
        )
      })
    });
    const multiInvalidInputs = [
      { kind: "FUTURE", value: {} },
      { value: {}, kind: "FUTURE" },
      { value: {} }
    ];
    const f20Results = multiInvalidInputs.map((input) =>
      validateDomainEventStructuralNodeForTest(invalidAuthority, "tagged", input)
    );
    for (const result of f20Results) {
      expect(result.ok).toBe(false);
      if (result.ok) throw new Error("expected F20 frozen-order failure");
      expect(result.diagnosticLeafId).toBe(
        "L23_F20_TAGGED_VARIANT_ORDINAL_INVALID"
      );
      expect(result.diagnostic.path).toEqual([]);
      expect(result.diagnostic.taggedUnionCoordinate).toBeNull();
      expect(result.observation.payloadContentReads).toBe(0);
    }
    expect(f20Results[0]).toEqual(f20Results[1]);
    expect(f20Results[1]).toEqual(f20Results[2]);
  });

  it("C-C16 returns structural success without semantic or history authority", () => {
    const event = envelopeForRoot(rootByOrdinal(1));
    event.eventSequence = -1;
    event.gameVersion = -1;
    const result = validateDomainEventStructure(event);
    expect(result).toMatchObject({
      ok: true,
      structuralStatus: "STRUCTURALLY_VALIDATED_DOMAIN_EVENT",
      semanticStatus: "NOT_SEMANTICALLY_ACCEPTED"
    });
    expect(result).not.toHaveProperty("accepted");
    expect(result).not.toHaveProperty("trusted");
    expect(result).not.toHaveProperty("replayable");
  });

  it("C-C17 rejects future event, envelope version, branch, and refinement vocabulary closed", () => {
    expectFailureCode(
      { ...envelopeForRoot(rootByOrdinal(1)), eventType: "FutureEvent" },
      "UNKNOWN_EVENT_TYPE"
    );
    expectFailureCode(
      { ...envelopeForRoot(rootByOrdinal(1)), eventVersion: 2 },
      "UNSUPPORTED_EVENT_VERSION"
    );
    const payload = cloneRecord(sampleForNode(rootByOrdinal(29).rootNodeId));
    payload.kind = "FUTURE";
    expectFailureCode(
      envelopeForRoot(rootByOrdinal(29), payload),
      "INVALID_PAYLOAD_DISCRIMINANT"
    );
    expect(
      validateDomainEventStructuralRefinementForTest(
        {
          refinementVersion: "future",
          refinementKind: "ID_STRING",
          baseNodeKind: "STRING",
          alias: "PlayerId"
        },
        "player"
      )
    ).toMatchObject({ ok: false });
  });

  it("C-C18 creates no hash, replay, state, history, snapshot, or semantic authority", () => {
    const source = productionSource();
    for (const forbidden of [
      "canonical-runtime-hash",
      "replay",
      "snapshot",
      "GameState",
      "ACCEPTED_EVENT",
      "TRUSTED_EVENT",
      "CANONICAL_HISTORY_EVENT"
    ]) {
      expect(source).not.toContain(forbidden);
    }
  });

  it("C-C19 consumes C1 AST roots directly without Catalog, digest, manual shape map, or B hash", () => {
    const source = productionSource();
    expect(source).toContain("createFullC1StructuralSchemaAuthority");
    expect(source).toContain("StructuralSchemaNodeV1");
    expect(source).not.toContain("Catalog V2");
    expect(source).not.toContain("artifactDigest");
    expect(source).not.toContain("canonical-runtime-hash");
    expect(source).not.toContain("FULL_C1_SCHEMA_ROOT_DECLARATIONS");
    expect(authority.candidate.roots).toHaveLength(59);
  });
});
