import { readFileSync } from "node:fs";
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

const canonicalDomainEventSource = (): string =>
  readFileSync(
    fileURLToPath(new URL("./canonical-domain-event.ts", import.meta.url)),
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
      { name: "empty", value: "", code: "INVALID_FIELD_TYPE" },
      { name: "whitespace", value: " ", code: "INVALID_FIELD_TYPE" },
      { name: "wrong type", value: "1", code: "INVALID_FIELD_TYPE" },
      { name: "negative", value: -1, accepted: true },
      { name: "zero", value: 0, accepted: true }
    ];
    const casesByField: Readonly<Record<(typeof envelopeFields)[number], readonly EnvelopeCase[]>> = {
      category: [
        { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
        { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
        { name: "empty", value: "", code: "INVALID_FIELD_VALUE" },
        { name: "whitespace", value: " ", code: "INVALID_FIELD_VALUE" },
        { name: "wrong type", value: 1, code: "INVALID_FIELD_TYPE" },
        { name: "literal", value: "domain", accepted: true }
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
        { name: "empty", value: "", code: "INVALID_FIELD_TYPE" },
        { name: "whitespace", value: " ", code: "INVALID_FIELD_TYPE" },
        { name: "wrong type", value: "1", code: "INVALID_FIELD_TYPE" },
        { name: "supported", value: 1, accepted: true },
        { name: "unsupported", value: 2, code: "UNSUPPORTED_EVENT_VERSION" }
      ],
      rulesBaselineVersion: [
        { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
        { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
        { name: "empty", value: "", accepted: true },
        { name: "whitespace", value: " ", accepted: true },
        { name: "wrong type", value: 1, code: "INVALID_FIELD_TYPE" }
      ],
      commandId: idCases,
      createdAt: [
        { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
        { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
        { name: "empty", value: "", accepted: true },
        { name: "whitespace", value: " ", accepted: true },
        { name: "wrong type", value: 1, code: "INVALID_FIELD_TYPE" }
      ],
      correlationId: idCases,
      causationId: idCases,
      payload: [
        { name: "missing", delete: true, code: "MISSING_REQUIRED_FIELD" },
        { name: "null", value: null, code: "INVALID_FIELD_TYPE" },
        { name: "string", value: "payload", code: "INVALID_FIELD_TYPE" },
        { name: "empty object reaches AST", value: {}, code: "MISSING_REQUIRED_FIELD" },
        { name: "authentic object", value: sampleForNode(root.rootNodeId), accepted: true }
      ]
    };

    let executedCases = 0;
    for (const [index, field] of envelopeFields.entries()) {
      const fieldCases = casesByField[field];
      expect(fieldCases.length, field).toBeGreaterThanOrEqual(5);
      for (const fieldCase of fieldCases) {
        executedCases += 1;
        const candidate = envelopeForRoot(root);
        if (fieldCase.delete === true) delete candidate[field];
        else candidate[field] = fieldCase.value;
        const result = validateDomainEventStructure(candidate);
        if (fieldCase.accepted === true) {
          expect(result.ok, `${field}:${fieldCase.name}`).toBe(true);
          continue;
        }
        expect(result.ok, `${field}:${fieldCase.name}`).toBe(false);
        if (result.ok) throw new Error("expected envelope matrix failure");
        expect(result.diagnostic.code, `${field}:${fieldCase.name}`).toBe(fieldCase.code);
        expect(result.diagnostic.path, `${field}:${fieldCase.name}`).toEqual(
          field === "payload" && fieldCase.name === "empty object reaches AST"
            ? [{ kind: "PAYLOAD_FIELD_ORDINAL", ordinal: 1 }]
            : [{ kind: "ENVELOPE_FIELD_ORDINAL", ordinal: index + 1 }]
        );
        expect(result.diagnostic).toMatchObject({
          failClosed: true
        });
      }
    }
    expect(executedCases).toBe(84);
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
    const traceRows = traceabilitySource()
      .split(/\r?\n/u)
      .filter((line) => /^\| C-C/u.test(line))
      .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
    expect(traceRows).toHaveLength(33);
    expect(traceRows.every((row) => row.length === 19)).toBe(true);
    const activeRows = traceRows.filter((row) => row[18] === "PASS");
    const groupingRows = traceRows.filter(
      (row) => row[18] === "GROUPING_ONLY"
    );
    expect(activeRows).toHaveLength(28);
    expect(groupingRows).toHaveLength(5);
    const actualTitles = activeRows.map((row) =>
      (row[10] ?? "").replaceAll("`", "")
    );
    expect(new Set(actualTitles).size).toBe(28);
    const testSource = readFileSync(fileURLToPath(import.meta.url), "utf8");
    for (const title of actualTitles) {
      expect(testSource).toContain(`it("${title}"`);
    }
    const productionAuthoritySource = `${productionSource()}\n${canonicalDomainEventSource()}`;
    const productionEntrySets = activeRows.map((row) =>
      [...(row[15] ?? "").matchAll(/`([A-Za-z_$][A-Za-z0-9_$]*)`/gu)].map(
        (match) => match[1] as string
      )
    );
    expect(productionEntrySets).toHaveLength(28);
    for (const [index, entries] of productionEntrySets.entries()) {
      expect(entries.length, activeRows[index]?.[0]).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(
          new RegExp(`\\b${entry}\\b`, "u").test(productionAuthoritySource),
          `${activeRows[index]?.[0]}:${entry}`
        ).toBe(true);
      }
    }
    expect(
      activeRows.every(
        (row) =>
          row[9] ===
          "`packages/domain-core/src/domain-event-structural-validator.test.ts`"
      )
    ).toBe(true);
    expect(
      traceabilitySource().match(/`mechanismMatch`: `28\/28 PASS`/u)
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

    const combinedSource = `${productionSource()}\n${canonicalDomainEventSource()}`;
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
      expect(
        combinedSource.match(new RegExp(`"${contextId}"`, "g"))?.length ?? 0,
        `${contextId} source binding`
      ).toBeGreaterThanOrEqual(2);
      expect(canonicalDomainEventSource()).toContain(`"${directBranchBinding}"`);

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
    const observedLeaves = new Set<string>();
    const recordLeaf = (leafId: string | null): void => {
      expect(leafId).not.toBeNull();
      if (leafId !== null) observedLeaves.add(leafId);
    };
    const publicLeaf = (input: unknown): void => {
      const observed = validateDomainEventStructureWithObservationForTest(input);
      expect(observed.result.ok).toBe(false);
      recordLeaf(observed.observation.diagnosticLeafId);
    };

    publicLeaf(undefined);
    const hostile = Object.create(null) as Record<string, unknown>;
    Object.defineProperty(hostile, "category", {
      enumerable: true,
      get: () => "domain"
    });
    publicLeaf(hostile);
    recordLeaf(
      validateCapturedDomainEventStructureWithObservationForTest(
        {}
      ).observation.diagnosticLeafId
    );

    const root = rootByOrdinal(1);
    publicLeaf(null);
    const missing = envelopeForRoot(root);
    delete missing.payload;
    publicLeaf(missing);
    publicLeaf({ ...envelopeForRoot(root), extra: true });
    publicLeaf({ ...envelopeForRoot(root), eventSequence: "1" });
    publicLeaf({ ...envelopeForRoot(root), category: "audit" });
    publicLeaf({ ...envelopeForRoot(root), eventType: "FutureEvent" });
    publicLeaf({ ...envelopeForRoot(root), eventVersion: 2 });
    publicLeaf(envelopeForRoot(root, "payload"));

    const discriminatedRoot = rootByOrdinal(11);
    for (const value of [undefined, {}, "FUTURE"] as const) {
      const payload = cloneRecord(
        sampleForNode(discriminatedRoot.rootNodeId)
      );
      if (value === undefined) delete payload.opportunityKind;
      else payload.opportunityKind = value;
      publicLeaf(envelopeForRoot(discriminatedRoot, payload));
    }

    const publicAstCases = [
      ["L26_F21_RECORD_MISSING_PLAIN", "RECORD_MISSING", false],
      ["L28_F22_RECORD_EXTRA_PLAIN", "RECORD_EXTRA", false],
      ["L30_F23_KIND_MISMATCH_PLAIN", "KIND_MISMATCH", false],
      ["L32_F24_LITERAL_MISMATCH_PLAIN", "LITERAL_MISMATCH", false],
      ["L34_F25_CARDINALITY_MISMATCH_PLAIN", "CARDINALITY_MISMATCH", false],
      ["L39_F27_CLOSED_UNION_ZERO_MATCH", "CLOSED_UNION_ZERO", false],
      ["L41_F29_REFINEMENT_REJECTED_PLAIN", "REFINEMENT_REJECTED", false],
      ["L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT", "RECORD_MISSING", true],
      ["L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT", "RECORD_EXTRA", true],
      ["L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT", "KIND_MISMATCH", true],
      ["L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT", "LITERAL_MISMATCH", true],
      ["L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT", "CARDINALITY_MISMATCH", true],
      ["L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT", "REFINEMENT_REJECTED", true]
    ] as const;
    const publicAstEvidence: string[] = [];
    for (const [expectedLeafId, mode, tagged] of publicAstCases) {
      let matched:
        | {
            readonly root: StructuralSchemaRootV1;
            readonly mutation: PublicAstMutation;
            readonly observed: ReturnType<typeof validateDomainEventStructureWithObservationForTest>;
          }
        | undefined;
      for (const candidateRoot of authority.candidate.roots) {
        const mutation = mutatePublicAstSample(
          candidateRoot.rootNodeId,
          mode,
          tagged
        );
        if (!mutation.matched) continue;
        const observed = validateDomainEventStructureWithObservationForTest(
          envelopeForRoot(candidateRoot, mutation.value)
        );
        if (observed.observation.diagnosticLeafId === expectedLeafId) {
          matched = { root: candidateRoot, mutation, observed };
          break;
        }
      }
      expect(matched, expectedLeafId).toBeDefined();
      if (matched === undefined) throw new Error(`missing public fixture ${expectedLeafId}`);
      expect(matched.observed.result.ok).toBe(false);
      expect(matched.observed.observation).toMatchObject({
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
      if (matched.observed.result.ok) throw new Error("expected public AST failure");
      const policy = DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY[expectedLeafId];
      expect(matched.observed.result.diagnostic).toMatchObject({
        code: policy.code,
        phase: policy.phase,
        safeSummary: policy.safeSummary,
        quarantineRecommended: policy.quarantineRecommended,
        retryability: policy.retryability,
        failClosed: true
      });
      recordLeaf(expectedLeafId);
      publicAstEvidence.push(
        `${expectedLeafId}:${matched.root.branchOrdinal}:${matched.mutation.mutationPath}`
      );
    }

    const taggedDiscriminatorCases = [
      ["L36_F26_TAGGED_DISCRIMINATOR_MISSING", "MISSING"],
      ["L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND", "WRONG_KIND"],
      ["L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN", "UNKNOWN"]
    ] as const;
    for (const [expectedLeafId, mode] of taggedDiscriminatorCases) {
      let matched = false;
      for (const candidateRoot of authority.candidate.roots) {
        const mutation = mutateFirstTaggedDiscriminator(
          candidateRoot.rootNodeId,
          mode
        );
        if (!mutation.matched) continue;
        const observed = validateDomainEventStructureWithObservationForTest(
          envelopeForRoot(candidateRoot, mutation.value)
        );
        if (observed.observation.diagnosticLeafId !== expectedLeafId) continue;
        expect(observed.result.ok).toBe(false);
        expect(observed.observation).toMatchObject({
          authorityChecked: true,
          captureEntered: true,
          payloadNodeAcquired: true,
          astTraversalEntered: true,
          validatedBackingConstructed: false,
          tokenIssued: false
        });
        recordLeaf(expectedLeafId);
        publicAstEvidence.push(
          `${expectedLeafId}:${candidateRoot.branchOrdinal}:${mutation.mutationPath}`
        );
        matched = true;
        break;
      }
      expect(matched, expectedLeafId).toBe(true);
    }
    expect(publicAstEvidence).toHaveLength(16);
    expect(new Set(publicAstEvidence).size).toBe(16);
    expect(publicAstEvidence).toEqual([
      "L26_F21_RECORD_MISSING_PLAIN:1:C1.SHA256.539f5c9437a8ac695c2c15049a6e8f6fce7ff597d5ff252fd507691a42ccf41a.aiPlayerCount",
      "L28_F22_RECORD_EXTRA_PLAIN:1:C1.SHA256.539f5c9437a8ac695c2c15049a6e8f6fce7ff597d5ff252fd507691a42ccf41a.__c_extra",
      "L30_F23_KIND_MISMATCH_PLAIN:1:C1.SHA256.539f5c9437a8ac695c2c15049a6e8f6fce7ff597d5ff252fd507691a42ccf41a.gameId.base",
      "L32_F24_LITERAL_MISMATCH_PLAIN:2:C1.SHA256.35e3e927c1c70627eadf6fb1cfb89510db31726ed4a1d2aa445ac9fa40d16267.edition",
      "L34_F25_CARDINALITY_MISMATCH_PLAIN:11:C1.SHA256.3eabcb7470ff38720e1f0a1452eea95d31e49f38a9a2ea2c20d4370070ec1402.visibility.futureUnsupportedDecisionKinds",
      "L39_F27_CLOSED_UNION_ZERO_MATCH:10:C1.SHA256.e2ce47e09973f8b553c044b63a5f7167a540d19fb1869e43f8c877f57b4aadca.taskCatalogSnapshot.definitions[0]",
      "L41_F29_REFINEMENT_REJECTED_PLAIN:1:C1.SHA256.539f5c9437a8ac695c2c15049a6e8f6fce7ff597d5ff252fd507691a42ccf41a.gameId",
      "L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT:20:C1.SHA256.6069b5e8047e5dfe76671d944d00a8690dc50cc2169bebc2085dd1bf90617008.abilitySource<1>.abilityRoleId",
      "L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT:20:C1.SHA256.6069b5e8047e5dfe76671d944d00a8690dc50cc2169bebc2085dd1bf90617008.abilitySource<1>.__c_extra",
      "L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT:20:C1.SHA256.6069b5e8047e5dfe76671d944d00a8690dc50cc2169bebc2085dd1bf90617008.abilitySource<1>.grantId.base",
      "L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT:20:C1.SHA256.6069b5e8047e5dfe76671d944d00a8690dc50cc2169bebc2085dd1bf90617008.abilitySource<1>.abilityRoleId",
      "L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT:53:C1.SHA256.231f6d881d10ce12d11add8ed12570f33eb127bda41a7bc8701d69674465950c.sourceEffectiveness<1>.representedImpairmentIds",
      "L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT:20:C1.SHA256.6069b5e8047e5dfe76671d944d00a8690dc50cc2169bebc2085dd1bf90617008.abilitySource<1>.grantId",
      "L36_F26_TAGGED_DISCRIMINATOR_MISSING:20:C1.SHA256.6069b5e8047e5dfe76671d944d00a8690dc50cc2169bebc2085dd1bf90617008.abilitySource.kind",
      "L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND:20:C1.SHA256.6069b5e8047e5dfe76671d944d00a8690dc50cc2169bebc2085dd1bf90617008.abilitySource.kind",
      "L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN:20:C1.SHA256.6069b5e8047e5dfe76671d944d00a8690dc50cc2169bebc2085dd1bf90617008.abilitySource.kind"
    ]);

    const invalidToken = readStructurallyValidatedDomainEvent({});
    expect(invalidToken.ok).toBe(false);
    if (!invalidToken.ok) {
      expect(invalidToken.diagnostic.code).toBe("INVALID_STRUCTURAL_TOKEN");
      recordLeaf("L46_F33_TOKEN_INVALID");
    }

    const callableLeaves = DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE
      .filter((entry) => entry.evidenceKind === "CALLABLE_PRIMARY_TEST")
      .map((entry) => entry.leafId)
      .sort();
    expect([...observedLeaves].sort()).toEqual(callableLeaves);
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
    const text = { nodeId: "text", kind: "STRING" } as const;
    const taggedNodes: readonly StructuralSchemaNodeV1[] = [
      {
        nodeId: "tagged",
        kind: "TAGGED_UNION",
        tagField: "kind",
        branches: [
          { branchOrdinal: 1, tagLiteral: "A", childNodeId: "variant" }
        ]
      },
      {
        nodeId: "variant",
        kind: "EXACT_RECORD",
        fields: [
          { fieldOrdinal: 1, fieldName: "items", required: true, optional: false, childNodeId: "items" },
          { fieldOrdinal: 2, fieldName: "kind", required: true, optional: false, childNodeId: "kind-a" },
          { fieldOrdinal: 3, fieldName: "literal", required: true, optional: false, childNodeId: "literal-a" },
          { fieldOrdinal: 4, fieldName: "refined", required: true, optional: false, childNodeId: "refined" },
          { fieldOrdinal: 5, fieldName: "required", required: true, optional: false, childNodeId: "text" }
        ]
      },
      { nodeId: "kind-a", kind: "LITERAL", value: "A" },
      { nodeId: "literal-a", kind: "LITERAL", value: "A" },
      { nodeId: "items", kind: "NON_EMPTY_ARRAY", elementNodeId: "text", minItems: 1, maxItems: null },
      {
        nodeId: "refined",
        kind: "REFINEMENT",
        refinementVersion: DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
        refinementKind: "NON_EMPTY_TRIMMED_STRING",
        baseNodeId: "text"
      },
      text
    ];
    const taggedAuthority = nodeFixtureAuthority(taggedNodes, "tagged");
    expect(taggedAuthority.status).toBe("HEALTHY");
    if (taggedAuthority.status !== "HEALTHY") {
      throw new Error("tagged diagnostic fixture must be healthy");
    }
    const astNodeOrdinal = taggedAuthority.traversal.uniqueNodes.find(
      (entry) => entry.nodeId === "tagged"
    )?.nodeOrdinal;
    expect(astNodeOrdinal).toBeDefined();
    const base = {
      items: ["ok"],
      kind: "A",
      literal: "A",
      refined: "ok",
      required: "ok"
    };
    const missingRequired = { ...base } as Record<string, unknown>;
    delete missingRequired.required;
    const missingKind = { ...base } as Record<string, unknown>;
    delete missingKind.kind;
    const cases = [
      ["L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT", missingRequired, "KNOWN_VARIANT"],
      ["L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT", { ...base, extra: true }, "KNOWN_VARIANT"],
      ["L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT", { ...base, required: {} }, "KNOWN_VARIANT"],
      ["L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT", { ...base, literal: "B" }, "KNOWN_VARIANT"],
      ["L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT", { ...base, items: [] }, "KNOWN_VARIANT"],
      ["L36_F26_TAGGED_DISCRIMINATOR_MISSING", missingKind, "MISSING_DISCRIMINANT"],
      ["L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND", { ...base, kind: {} }, "INVALID_DISCRIMINANT_TYPE"],
      ["L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN", { ...base, kind: "SECRET_HOSTILE_TAG" }, "UNKNOWN_DISCRIMINANT_VALUE"],
      ["L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT", { ...base, refined: " " }, "KNOWN_VARIANT"]
    ] as const;
    for (const [leafId, input, state] of cases) {
      const first = validateDomainEventStructuralNodeForTest(
        taggedAuthority,
        "tagged",
        input
      );
      const second = validateDomainEventStructuralNodeForTest(
        taggedAuthority,
        "tagged",
        input
      );
      expect(first).toEqual(second);
      expect(first.ok).toBe(false);
      if (first.ok) throw new Error("expected tagged diagnostic");
      expect(first.diagnosticLeafId).toBe(leafId);
      expect(first.diagnostic.taggedUnionCoordinate).toMatchObject({
        eventBranchOrdinal: 1,
        astNodeOrdinal,
        taggedUnionPath: [],
        state,
        ...(state === "KNOWN_VARIANT" ? { taggedVariantOrdinal: 1 } : {})
      });
      if (state === "MISSING_DISCRIMINANT") {
        expect(first.diagnostic.taggedUnionCoordinate?.field).toBeNull();
      } else {
        expect(
          first.diagnostic.taggedUnionCoordinate?.field
            ?.canonicalObjectEntryOrdinal
        ).toBeGreaterThan(0);
      }
      const serialized = JSON.stringify(first.diagnostic);
      expect(serialized).not.toContain("SECRET_HOSTILE_TAG");
      expect(serialized).not.toContain("required");
      expect(serialized).not.toContain("fixture-branch");
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
    const validatorSource = productionSource();
    const tokenSource = canonicalDomainEventSource();
    const staticBindings = [
      ["L01_F01_AUTHORITY_UNHEALTHY", "admitC1Authority", /result\.status !== "HEALTHY"[\s\S]*?return unhealthyAdmission\(\)/],
      ["L04_F04_CAPTURE_INTERNAL", "translateCaptureFailure", /case "INTERNAL_SERIALIZATION_FAILURE":\s*return failure\(F04\)/],
      ["L06_F06_CAPTURE_BACKING_MISSING", "validateCapturedInternal", /authenticated\.diagnostic\.code === "INVALID_CAPTURE_TOKEN"[\s\S]*?failure\(F05\)[\s\S]*?: failure\(F06\)/],
      ["L20_F20_AST_NODE_LOOKUP_MISSING", "traverseNode", /if \(schema === undefined\) \{\s*return failure\(F20, path\)/],
      ["L21_F20_AST_NODE_ORDINAL_LOOKUP_MISSING", "traverseNode", /if \(astNodeOrdinal === undefined\) \{\s*return failure\(F20_NODE_ORDINAL, path\)/],
      ["L22_F20_EVENT_BRANCH_ORDINAL_INVALID", "validateCapturedInternal", /selectedRoot\.branchOrdinal > 59[\s\S]*?return toPublicFailure\(failure\(F20_EVENT_BRANCH\), observation\)/],
      ["L23_F20_TAGGED_VARIANT_ORDINAL_INVALID", "traverseNode", /branch\.branchOrdinal !== index \+ 1[\s\S]*?return failure\(F20_TAGGED_VARIANT, path\)/],
      ["L24_F20_TAGGED_FIELD_COORDINATE_INVARIANT", "traverseNode", /if \(coordinate === null\) return failure\(F20_TAGGED_FIELD, path\)/],
      ["L25_F20_TAGGED_MULTIPLE_LITERAL_MATCH", "traverseNode", /if \(matchCount > 1\) \{\s*return failure\(F20_TAGGED_MULTIPLE, path\)/],
      ["L40_F28_CLOSED_UNION_MULTIPLE_MATCH", "traverseNode", /if \(matches\.length > 1\) return failure\(F28, path\)/],
      ["L43_F30_REFINEMENT_METADATA_INVALID", "executeRefinement", /metadata\.refinementVersion !==[\s\S]*?typeof value !== "string"[\s\S]*?return failure\(F30, path\)/],
      ["L44_F31_BACKING_CONSTRUCTION_FAILED", "validateCapturedInternal", /catch \{\s*return toPublicFailure\(failure\(F31\), observation\)/],
      ["L45_F32_TOKEN_ISSUE_FAILED", "issueStructurallyValidatedDomainEvent", /diagnostic: createDomainEventStructuralDiagnostic\("L45_F32_TOKEN_ISSUE_FAILED"\)/],
      ["L47_F34_INTERNAL_CONTAINMENT", "validateDomainEventStructure", /export const validateDomainEventStructure[\s\S]*?catch \{\s*return toPublicFailure\(failure\(F34\), observation\)/],
      ["L18_F18_ROOT_SELECTION_ZERO", "selectBranch", /if \(match === undefined\) \{\s*return failure\(F18, discriminatorPath\(current\.discriminatorOrdinal\)\)/],
      ["L19_F19_ROOT_SELECTION_MULTIPLE", "selectBranch", /if \(matches\.length > 1\) \{\s*return failure\(F19, discriminatorPath\(current\.discriminatorOrdinal\)\)/]
    ] as const;
    expect(staticBindings).toHaveLength(16);
    expect(new Set(staticBindings.map(([leafId]) => leafId)).size).toBe(16);
    expect(staticBindings.map(([leafId]) => leafId).sort()).toEqual(
      staticPolicies.map((entry) => entry.leafId).sort()
    );
    for (const [leafId, symbol, exactBranch] of staticBindings) {
      const policy = staticPolicies.find((entry) => entry.leafId === leafId);
      expect(policy, leafId).toBeDefined();
      expect(policy?.taggedCoordinatePolicy, leafId).toBe("NULL");
      const policySymbol =
        leafId === "L47_F34_INTERNAL_CONTAINMENT"
          ? "publicOuterCatch"
          : symbol;
      expect(policy?.exactSourceBinding.startsWith(policySymbol), leafId).toBe(
        true
      );
      expect(
        exactBranch.test(
          leafId === "L45_F32_TOKEN_ISSUE_FAILED" ? tokenSource : validatorSource
        ),
        `${leafId}:${symbol}`
      ).toBe(true);
    }
    expect(validatorSource).not.toContain("default:");

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
