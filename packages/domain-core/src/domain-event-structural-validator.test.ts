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
    const accepted = validateDomainEventStructure(envelopeForRoot(root));
    expect(accepted.ok).toBe(true);
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
    const candidates: unknown[] = [
      null,
      { ...envelopeForRoot(root), extra: true },
      { ...envelopeForRoot(root), eventSequence: "1" },
      { ...envelopeForRoot(root), eventType: "FutureEvent" },
      { ...envelopeForRoot(root), eventVersion: 2 }
    ];
    for (const candidate of candidates) {
      const observed =
        validateDomainEventStructureWithObservationForTest(candidate);
      expect(observed.result.ok).toBe(false);
      expect(observed.observation.payloadNodeAcquired).toBe(false);
      expect(observed.observation.payloadDiscriminatorReads).toBe(0);
      expect(observed.observation.payloadContentReads).toBe(0);
      expect(observed.observation.astTraversalEntered).toBe(false);
      expect(observed.observation.tokenIssued).toBe(false);
    }
  });

  it("C-C06 selects each of the 59 C1 roots exactly once without fallback", () => {
    const selected = new Set<string>();
    for (const root of authority.candidate.roots) {
      const result = validateDomainEventStructure(envelopeForRoot(root));
      expect(result).toMatchObject({
        ok: true,
        payloadBranchId: root.branchId,
        payloadSchemaIdentity: root.rootNodeId
      });
      if (result.ok) selected.add(result.payloadBranchId);
    }
    expect(selected.size).toBe(59);
  });

  it("C-C06a bounds all seven payload discriminator paths before AST traversal", () => {
    const cases = [
      [16, 1],
      [11, 2],
      [19, 3],
      [22, 1],
      [29, 1],
      [43, 1],
      [46, 1]
    ] as const;
    for (const [ordinal, reads] of cases) {
      const observed = validateDomainEventStructureWithObservationForTest(
        envelopeForRoot(rootByOrdinal(ordinal))
      );
      expect(observed.result.ok).toBe(true);
      expect(observed.observation.payloadDiscriminatorReads).toBe(reads);
    }
    const invalid = cloneRecord(sampleForNode(rootByOrdinal(29).rootNodeId));
    delete invalid.kind;
    const observed = validateDomainEventStructureWithObservationForTest(
      envelopeForRoot(rootByOrdinal(29), invalid)
    );
    expect(observed.result).toMatchObject({
      ok: false,
      diagnostic: { code: "INVALID_PAYLOAD_DISCRIMINANT" }
    });
    expect(observed.observation).toMatchObject({
      payloadDiscriminatorReads: 1,
      payloadContentReads: 0,
      astTraversalEntered: false,
      tokenIssued: false
    });
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
  });

  it("C-C11 keeps the authentic legacy B31 payload structurally representable", () => {
    const root = rootByOrdinal(31);
    expect(validateDomainEventStructure(envelopeForRoot(root))).toMatchObject({
      ok: true,
      payloadBranchId: "C-B31-TASK-INSERTED-LEGACY-U"
    });
  });

  it("C-C12 preserves current version-aware families and rejects discriminator failures", () => {
    for (const ordinal of [16, 17, 18, 23, 44, 45, 47, 48, 49, 50, 51, 52]) {
      expect(
        validateDomainEventStructure(envelopeForRoot(rootByOrdinal(ordinal)))
          .ok
      ).toBe(true);
    }
    const root = rootByOrdinal(29);
    const wrong = cloneRecord(sampleForNode(root.rootNodeId));
    wrong.kind = {};
    expectFailureCode(
      envelopeForRoot(root, wrong),
      "INVALID_PAYLOAD_DISCRIMINANT"
    );
    wrong.kind = "FUTURE";
    expectFailureCode(
      envelopeForRoot(root, wrong),
      "INVALID_PAYLOAD_DISCRIMINANT"
    );
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
    for (const contextId of DOMAIN_EVENT_STRUCTURAL_FAILURE_CONTEXT_IDS) {
      const first = createDomainEventStructuralDiagnostic(contextId);
      const second = createDomainEventStructuralDiagnostic(contextId);
      expect(first).toEqual(second);
      expect(first.failClosed).toBe(true);
      expect(first).not.toHaveProperty("message");
      expect(first).not.toHaveProperty("stack");
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
