import { describe, expect, it } from "vitest";

import {
  DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION,
  DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION,
  DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION,
  FULL_C1_EXPECTED_EXPANDED_OCCURRENCE_CENSUS,
  FULL_C1_B54_COMPILE_TIME_PROOFS,
  FULL_C1_EVENT_EXACTNESS_PROOFS,
  STRUCTURAL_ID_ALIASES_V1,
  STRUCTURAL_SCHEMA_NODE_KINDS,
  compareRawUtf16CodeUnits,
  compareStructuralLiterals,
  createFullC1StructuralSchemaAuthority,
  createStructuralSchemaAuthority,
  formatStructuralOrdinal,
  type StructuralSchemaCandidateV1,
  type StructuralSchemaNodeV1
} from "./domain-event-structural-schema-ast.js";

const root = (rootNodeId: string) => ({
  branchOrdinal: 1,
  branchId: "TEST-B01",
  eventOrdinal: 1,
  eventType: "TestEvent",
  versionPolicy: { kind: "UNVERSIONED" as const },
  rootNodeId,
  resultTypeName: "TestPayload"
});

const candidate = (
  nodes: readonly StructuralSchemaNodeV1[],
  rootNodeId: string
): StructuralSchemaCandidateV1 => ({
  astVersion: DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION,
  traversalVersion: DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION,
  normalizationVersion: DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION,
  expectedEventCount: 1,
  expectedBranchCount: 1,
  expectedExplicitVersionBranchCount: 0,
  expectedUnversionedBranchCount: 1,
  roots: [root(rootNodeId)],
  nodeBindings: nodes.map((node) => ({ nodeId: node.nodeId, node })),
  deltaBindings: []
});

describe("typed structural schema authority", () => {
  it("closes the algebra and refinement registries", () => {
    expect(STRUCTURAL_SCHEMA_NODE_KINDS).toHaveLength(15);
    expect(new Set(STRUCTURAL_SCHEMA_NODE_KINDS).size).toBe(15);
    expect(STRUCTURAL_ID_ALIASES_V1).toHaveLength(16);
    expect(new Set(STRUCTURAL_ID_ALIASES_V1).size).toBe(16);
  });

  it("orders strings by raw UTF-16 code units and literals by frozen kind order", () => {
    expect(["a", "😀", "\uffff"].sort(compareRawUtf16CodeUnits)).toEqual([
      "a",
      "😀",
      "\uffff"
    ]);
    expect(["a", 2, false, null, true, 1].sort(compareStructuralLiterals)).toEqual([
      null,
      false,
      true,
      1,
      2,
      "a"
    ]);
  });

  it("formats ORD6 and rejects out-of-range ordinals", () => {
    expect(formatStructuralOrdinal(1)).toBe("000001");
    expect(formatStructuralOrdinal(999_999)).toBe("999999");
    expect(() => formatStructuralOrdinal(0)).toThrow(RangeError);
    expect(() => formatStructuralOrdinal(1_000_000)).toThrow(RangeError);
  });

  it("publishes the complete healthy 40/59 authority and frozen expanded census", () => {
    const result = createFullC1StructuralSchemaAuthority();
    expect(result.status).toBe("HEALTHY");
    if (result.status !== "HEALTHY") return;
    expect(result.health).toMatchObject({
      eventDescriptorCount: 40,
      payloadBranchCount: 59,
      explicitVersionBranchCount: 13,
      unversionedBranchCount: 46,
      unresolvedReferenceCount: 0,
      cycleCount: 0,
      failClosed: true
    });
    expect(result.expandedOccurrenceCensus).toEqual(
      FULL_C1_EXPECTED_EXPANDED_OCCURRENCE_CENSUS
    );
    expect(Object.keys(FULL_C1_EVENT_EXACTNESS_PROOFS)).toHaveLength(40);
    expect(Object.values(FULL_C1_EVENT_EXACTNESS_PROOFS)).toEqual(
      Array.from({ length: 40 }, () => true)
    );
    expect(Object.values(FULL_C1_B54_COMPILE_TIME_PROOFS)).toEqual(
      Array.from({ length: 6 }, () => true)
    );
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.candidate.roots)).toBe(true);
    expect(Object.isFrozen(result.traversal.uniqueNodes)).toBe(true);
  });

  it("uses deterministic DFS preorder and first discovery for shared nodes", () => {
    const shared = { nodeId: "shared", kind: "STRING" } as const;
    const left = { nodeId: "left", kind: "ARRAY", elementNodeId: "shared" } as const;
    const right = { nodeId: "right", kind: "NULLABLE", childNodeId: "shared" } as const;
    const record = {
      nodeId: "record",
      kind: "EXACT_RECORD",
      fields: [
        { fieldOrdinal: 1, fieldName: "a", required: true, optional: false, childNodeId: "left" },
        { fieldOrdinal: 2, fieldName: "b", required: true, optional: false, childNodeId: "right" }
      ]
    } as const;
    const first = createStructuralSchemaAuthority(candidate([record, right, shared, left], "record"));
    const second = createStructuralSchemaAuthority(candidate([left, shared, record, right], "record"));
    expect(first.status).toBe("HEALTHY");
    expect(second.status).toBe("HEALTHY");
    if (first.status !== "HEALTHY" || second.status !== "HEALTHY") return;
    const expected = ["record", "left", "shared", "right"];
    expect(first.traversal.uniqueNodes.map((entry) => entry.nodeId)).toEqual(expected);
    expect(second.traversal.uniqueNodes.map((entry) => entry.nodeId)).toEqual(expected);
    expect(first.uniqueGraphCensus.nodes).toBe(4);
    expect(first.expandedOccurrenceCensus.nodes).toBe(5);
  });

  it.each([
    ["duplicate IDs", [{ nodeId: "same", kind: "STRING" }, { nodeId: "same", kind: "BOOLEAN" }], "same", "DUPLICATE_NODE_ID"],
    ["unresolved children", [{ nodeId: "root", kind: "ARRAY", elementNodeId: "missing" }], "root", "UNRESOLVED_NODE_REFERENCE"],
    ["cycles", [{ nodeId: "a", kind: "ARRAY", elementNodeId: "b" }, { nodeId: "b", kind: "ARRAY", elementNodeId: "a" }], "a", "CYCLE_DETECTED"]
  ] as const)("fails closed for %s", (_label, nodes, rootNodeId, code) => {
    const result = createStructuralSchemaAuthority(
      candidate(nodes, rootNodeId)
    );
    expect(result).toMatchObject({ status: "UNHEALTHY", diagnostic: { code, failClosed: true } });
  });

  it("rejects a repository key that disagrees with its node ID", () => {
    const node = { nodeId: "one", kind: "STRING" } as const;
    const graph = candidate([node], "one");
    const result = createStructuralSchemaAuthority({
      ...graph,
      nodeBindings: [{ nodeId: "two", node }]
    });
    expect(result).toMatchObject({
      status: "UNHEALTHY",
      diagnostic: { code: "NODE_BINDING_MISMATCH" }
    });
  });

  it("rejects a tagged branch whose literal metadata disagrees with its record", () => {
    const literal = { nodeId: "literal", kind: "LITERAL", value: "A" } as const;
    const branch = {
      nodeId: "branch",
      kind: "EXACT_RECORD",
      fields: [{ fieldOrdinal: 1, fieldName: "kind", required: true, optional: false, childNodeId: "literal" }]
    } as const;
    const union = {
      nodeId: "union",
      kind: "TAGGED_UNION",
      tagField: "kind",
      branches: [{ branchOrdinal: 1, tagLiteral: "B", childNodeId: "branch" }]
    } as const;
    expect(createStructuralSchemaAuthority(candidate([union, branch, literal], "union"))).toMatchObject({
      status: "UNHEALTHY",
      diagnostic: { code: "INVALID_NODE_INVARIANT" }
    });
  });

  it("rejects a closed union without a structural disjointness proof", () => {
    const left = { nodeId: "left", kind: "STRING" } as const;
    const right = { nodeId: "right", kind: "STRING" } as const;
    const union = {
      nodeId: "union",
      kind: "CLOSED_UNION",
      selection: "EXACTLY_ONE",
      branchNodeIds: ["left", "right"]
    } as const;
    expect(createStructuralSchemaAuthority(candidate([union, left, right], "union"))).toMatchObject({
      status: "UNHEALTHY",
      diagnostic: { code: "INVALID_NODE_INVARIANT" }
    });
  });
});
