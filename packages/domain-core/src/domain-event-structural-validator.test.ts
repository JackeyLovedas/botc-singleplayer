import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
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
    const accepted = validateDomainEventStructure(baseline);
    expect(accepted.ok).toBe(true);

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
    for (const [index, field] of envelopeFields.entries()) {
      const missing = envelopeForRoot(root);
      delete missing[field];
      const failure = expectFailureCode(missing, "MISSING_REQUIRED_FIELD");
      expect(failure.diagnostic.path, field).toEqual([
        { kind: "ENVELOPE_FIELD_ORDINAL", ordinal: index + 1 }
      ]);
    }

    const wrongTypeValues: Readonly<Record<(typeof envelopeFields)[number], unknown>> = {
      category: 1,
      eventId: 1,
      gameId: 1,
      eventSequence: "1",
      batchId: 1,
      gameVersion: "1",
      eventType: 1,
      eventVersion: "1",
      rulesBaselineVersion: 1,
      commandId: 1,
      createdAt: 1,
      correlationId: 1,
      causationId: 1,
      payload: "payload"
    };
    for (const [index, field] of envelopeFields.entries()) {
      const wrongType = envelopeForRoot(root);
      wrongType[field] = wrongTypeValues[field];
      const failure = expectFailureCode(wrongType, "INVALID_FIELD_TYPE");
      expect(failure.diagnostic.path, field).toEqual([
        { kind: "ENVELOPE_FIELD_ORDINAL", ordinal: index + 1 }
      ]);
    }

    const blankAllowed = envelopeForRoot(root);
    blankAllowed.rulesBaselineVersion = "";
    blankAllowed.createdAt = " ";
    expect(validateDomainEventStructure(blankAllowed).ok).toBe(true);
    const blankId = envelopeForRoot(root);
    blankId.eventId = " ";
    expectFailureCode(blankId, "INVALID_FIELD_VALUE");
    const nullField = envelopeForRoot(root);
    nullField.createdAt = null;
    expectFailureCode(nullField, "INVALID_FIELD_TYPE");
    const wrongCategory = envelopeForRoot(root);
    wrongCategory.category = "audit";
    expectFailureCode(wrongCategory, "INVALID_FIELD_VALUE");
    const unsupportedVersion = envelopeForRoot(root);
    unsupportedVersion.eventVersion = 2;
    expectFailureCode(unsupportedVersion, "UNSUPPORTED_EVENT_VERSION");
    for (const field of [
      "eventId",
      "gameId",
      "batchId",
      "commandId",
      "correlationId",
      "causationId"
    ] as const) {
      const blank = envelopeForRoot(root);
      blank[field] = " \t\n ";
      expectFailureCode(blank, "INVALID_FIELD_VALUE");
    }
  });

  it("C-C03 admits one complete authority and dispatches only after admission", () => {
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
    const candidates = [
      {
        candidate: null,
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
        candidate: missingPayload,
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
        candidate: { ...envelopeForRoot(root), extra: true },
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
        candidate: { ...envelopeForRoot(root), eventSequence: "1" },
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
        candidate: { ...envelopeForRoot(root), eventType: "FutureEvent" },
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
        candidate: { ...envelopeForRoot(root), eventVersion: 2 },
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
    for (const { candidate, expected } of candidates) {
      const observed =
        validateDomainEventStructureWithObservationForTest(candidate);
      expect(observed.result.ok).toBe(false);
      expect(observed.observation).toEqual({
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
  });

  it("C-C06 selects each of the 59 C1 roots exactly once without fallback", () => {
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

  it("C-C09 rejects primitive coercion, symbols, getters, proxies, cycles, and nonplain values", () => {
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
    for (const input of [
      { aValue: "x" },
      { aValue: "x", zKind: {} },
      { aValue: "x", zKind: "FUTURE" }
    ]) {
      expect(
        validateDomainEventStructuralNodeForTest(
          taggedAuthority,
          "tagged",
          input
        )
      ).toMatchObject({
        ok: false,
        diagnostic: {
          code: "INVALID_PAYLOAD_STRUCTURE",
          path: [{ kind: "PAYLOAD_FIELD_ORDINAL", ordinal: 2 }]
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
    for (const wrapper of [
      { aValue: "x" },
      { aValue: "x", zKind: {} },
      { aValue: "x", zKind: "FUTURE" }
    ]) {
      expect(
        validateDomainEventStructuralNodeForTest(
          nestedAuthority,
          "nested-root",
          { first: 1, second: 2, wrapper }
        )
      ).toMatchObject({
        ok: false,
        diagnostic: {
          code: "INVALID_PAYLOAD_STRUCTURE",
          path: [
            { kind: "PAYLOAD_FIELD_ORDINAL", ordinal: 3 },
            { kind: "PAYLOAD_FIELD_ORDINAL", ordinal: 2 }
          ]
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

  it("C-C12 preserves current version-aware families and rejects discriminator failures", () => {
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

  it("C-C15 proves the total closed F01-F34 diagnostic policy and bounded safe paths", () => {
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

      const first = createDomainEventStructuralDiagnostic(contextId);
      const second = createDomainEventStructuralDiagnostic(contextId);
      expect(first).toEqual(second);
      expect(first).toEqual({
        code,
        phase,
        path: [],
        safeSummary,
        quarantineRecommended,
        retryability,
        failClosed: true
      });
      expect(Object.keys(first).sort()).toEqual([
        "code",
        "failClosed",
        "path",
        "phase",
        "quarantineRecommended",
        "retryability",
        "safeSummary"
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
