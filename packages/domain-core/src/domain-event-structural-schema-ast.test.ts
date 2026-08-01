import { readFileSync } from "node:fs";

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
  createStructuralSchemaAuthorityForTestCandidate,
  getCanonicalChildNodeIds,
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
const graphObjects = (rootValue: object): Set<object> => {
  const found = new Set<object>(); const pending = [rootValue];
  while (pending.length > 0) {
    const value = pending.pop(); if (value === undefined || found.has(value)) continue;
    found.add(value);
    for (const key of Reflect.ownKeys(value)) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      const descriptorValue: unknown = descriptor !== undefined && "value" in descriptor ? descriptor.value : undefined;
      if (typeof descriptorValue === "object" && descriptorValue !== null) pending.push(descriptorValue);
    }
  }
  return found;
};
const fullCandidate = (): StructuralSchemaCandidateV1 => {
  const authority = createFullC1StructuralSchemaAuthority();
  if (authority.status !== "HEALTHY") throw new Error(authority.diagnostic.code);
  return structuredClone(authority.candidate);
};

describe("typed structural schema authority", () => {
  it("closes the algebra and refinement registries", () => {
    expect(STRUCTURAL_SCHEMA_NODE_KINDS).toHaveLength(15);
    expect(new Set(STRUCTURAL_SCHEMA_NODE_KINDS).size).toBe(15);
    expect(STRUCTURAL_ID_ALIASES_V1).toHaveLength(16);
    expect(new Set(STRUCTURAL_ID_ALIASES_V1).size).toBe(16);
  });

  it("accepts an exact healthy fixture for every one of the 15 node kinds", () => {
    const fixtures: readonly [string, readonly StructuralSchemaNodeV1[], string][] = [
      ["NULL", [{ nodeId: "root", kind: "NULL" }], "root"], ["BOOLEAN", [{ nodeId: "root", kind: "BOOLEAN" }], "root"],
      ["SAFE_INTEGER", [{ nodeId: "root", kind: "SAFE_INTEGER" }], "root"], ["STRING", [{ nodeId: "root", kind: "STRING" }], "root"],
      ["LITERAL", [{ nodeId: "root", kind: "LITERAL", value: "x" }], "root"], ["ENUM", [{ nodeId: "root", kind: "ENUM", values: ["a", "b"] }], "root"],
      ["NULLABLE", [{ nodeId: "root", kind: "NULLABLE", childNodeId: "text" }, { nodeId: "text", kind: "STRING" }], "root"],
      ["EXACT_RECORD", [{ nodeId: "root", kind: "EXACT_RECORD", fields: [] }], "root"],
      ["ARRAY", [{ nodeId: "root", kind: "ARRAY", elementNodeId: "text" }, { nodeId: "text", kind: "STRING" }], "root"],
      ["NON_EMPTY_ARRAY", [{ nodeId: "root", kind: "NON_EMPTY_ARRAY", minItems: 1, maxItems: null, elementNodeId: "text" }, { nodeId: "text", kind: "STRING" }], "root"],
      ["BOUNDED_ARRAY", [{ nodeId: "root", kind: "BOUNDED_ARRAY", minItems: 0, maxItems: 1, elementNodeId: "text" }, { nodeId: "text", kind: "STRING" }], "root"],
      ["TUPLE", [{ nodeId: "root", kind: "TUPLE", elementNodeIds: ["text"] }, { nodeId: "text", kind: "STRING" }], "root"],
      ["TAGGED_UNION", [{ nodeId: "root", kind: "TAGGED_UNION", tagField: "kind", branches: [{ branchOrdinal: 1, tagLiteral: "A", childNodeId: "branch" }] }, { nodeId: "branch", kind: "EXACT_RECORD", fields: [{ fieldOrdinal: 1, fieldName: "kind", required: true, optional: false, childNodeId: "literal" }] }, { nodeId: "literal", kind: "LITERAL", value: "A" }], "root"],
      ["CLOSED_UNION", [{ nodeId: "root", kind: "CLOSED_UNION", selection: "EXACTLY_ONE", branchNodeIds: ["a", "b"] }, { nodeId: "a", kind: "BOOLEAN" }, { nodeId: "b", kind: "STRING" }], "root"],
      ["REFINEMENT", [{ nodeId: "root", kind: "REFINEMENT", refinementVersion: "botc-domain-event-structural-refinement-v1", refinementKind: "NON_EMPTY_TRIMMED_STRING", baseNodeId: "text" }, { nodeId: "text", kind: "STRING" }], "root"]
    ];
    expect(fixtures.map(([kind, nodes, rootNodeId]) => [kind, createStructuralSchemaAuthorityForTestCandidate(candidate(nodes, rootNodeId)).status])).toEqual(STRUCTURAL_SCHEMA_NODE_KINDS.map((kind) => [kind, "HEALTHY"]));
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

  it("captures a fully detached authority without mutating or freezing caller descriptors", () => {
    const input = fullCandidate(); const before = JSON.stringify(input); const inputObjects = graphObjects(input);
    const result = createStructuralSchemaAuthority(input);
    expect(result.status).toBe("HEALTHY"); if (result.status !== "HEALTHY") return;
    expect(JSON.stringify(input)).toBe(before);
    expect([...inputObjects].every((value) => !Object.isFrozen(value))).toBe(true);
    expect(Object.getOwnPropertyDescriptor(input, "roots")).toMatchObject({ enumerable: true, writable: true, configurable: true });
    const authorityObjects = graphObjects(result);
    expect([...inputObjects].some((value) => authorityObjects.has(value))).toBe(false);
    expect([...authorityObjects].every((value) => Object.isFrozen(value))).toBe(true);
    const originalResultType = result.candidate.roots[0]?.resultTypeName;
    (input.roots[0] as { resultTypeName: string }).resultTypeName = "MutatedPayload";
    expect(result.candidate.roots[0]?.resultTypeName).toBe(originalResultType);
  });

  it("treats refinement base as the sole traversal child while preserving the frozen occurrence census", () => {
    const base = { nodeId: "base", kind: "STRING" } as const;
    const refinement = { nodeId: "ref", kind: "REFINEMENT", refinementVersion: "botc-domain-event-structural-refinement-v1", refinementKind: "ID_STRING", alias: "GameId", baseNodeId: "base" } as const;
    expect(getCanonicalChildNodeIds(refinement)).toEqual(["base"]);
    const result = createStructuralSchemaAuthorityForTestCandidate(candidate([refinement, base], "ref"));
    expect(result.status).toBe("HEALTHY"); if (result.status !== "HEALTHY") return;
    expect(result.traversal.uniqueNodes.map((entry) => entry.nodeId)).toEqual(["ref", "base"]);
    expect(result.uniqueGraphCensus.nodes).toBe(2);
    expect(result.expandedOccurrenceCensus).toMatchObject({ nodes: 1, childReferences: 0, idRefinements: 1 });
  });

  it.each([
    ["unresolved refinement base", [{ nodeId: "ref", kind: "REFINEMENT", refinementVersion: "botc-domain-event-structural-refinement-v1", refinementKind: "ID_STRING", alias: "GameId", baseNodeId: "missing" }], "ref", "UNRESOLVED_NODE_REFERENCE"],
    ["refinement-edge cycle", [{ nodeId: "ref", kind: "REFINEMENT", refinementVersion: "botc-domain-event-structural-refinement-v1", refinementKind: "ID_STRING", alias: "GameId", baseNodeId: "loop" }, { nodeId: "loop", kind: "ARRAY", elementNodeId: "ref" }], "ref", "CYCLE_DETECTED"],
    ["refinement-edge orphan", [{ nodeId: "ref", kind: "REFINEMENT", refinementVersion: "botc-domain-event-structural-refinement-v1", refinementKind: "ID_STRING", alias: "GameId", baseNodeId: "base" }, { nodeId: "base", kind: "STRING" }, { nodeId: "orphan", kind: "BOOLEAN" }], "ref", "ORPHAN_NODE"]
  ] as const)("fails closed for %s", (_label, nodes, rootNodeId, code) => {
    expect(createStructuralSchemaAuthorityForTestCandidate(candidate(nodes as readonly StructuralSchemaNodeV1[], rootNodeId))).toMatchObject({ status: "UNHEALTHY", diagnostic: { code } });
  });

  it.each([
    ["unknown kind", { nodeId: "ref", kind: "REFINEMENT", refinementVersion: "botc-domain-event-structural-refinement-v1", refinementKind: "UNKNOWN", alias: "GameId", baseNodeId: "base" }],
    ["missing kind", { nodeId: "ref", kind: "REFINEMENT", refinementVersion: "botc-domain-event-structural-refinement-v1", alias: "GameId", baseNodeId: "base" }],
    ["alias on non-ID refinement", { nodeId: "ref", kind: "REFINEMENT", refinementVersion: "botc-domain-event-structural-refinement-v1", refinementKind: "NON_EMPTY_TRIMMED_STRING", alias: "GameId", baseNodeId: "base" }],
    ["missing ID alias", { nodeId: "ref", kind: "REFINEMENT", refinementVersion: "botc-domain-event-structural-refinement-v1", refinementKind: "ID_STRING", baseNodeId: "base" }]
  ])("rejects %s with no cross-kind refinement fallback", (_label, forged) => {
    const graph = candidate([forged as StructuralSchemaNodeV1, { nodeId: "base", kind: "STRING" }], "ref");
    expect(createStructuralSchemaAuthorityForTestCandidate(graph)).toMatchObject({ status: "UNHEALTHY", diagnostic: { code: "INVALID_REFINEMENT_BINDING" } });
  });

  it("requires the exact complete B26/B54 delta binding set for full authority", () => {
    const exact = fullCandidate(); const [b26, b54] = exact.deltaBindings;
    expect(createStructuralSchemaAuthority(exact).status).toBe("HEALTHY");
    const variants: StructuralSchemaCandidateV1[] = [
      { ...fullCandidate(), deltaBindings: [] },
      { ...fullCandidate(), deltaBindings: b26 === undefined ? [] : [b26] },
      { ...fullCandidate(), deltaBindings: b54 === undefined ? [] : [b54] },
      { ...fullCandidate(), deltaBindings: b26 === undefined ? [] : [b26, b26] },
      { ...fullCandidate(), deltaBindings: b26 === undefined || b54 === undefined ? [] : [b54, b26] },
      { ...fullCandidate(), deltaBindings: b26 === undefined || b54 === undefined ? [] : [{ ...b26, fieldPath: "P|wrong" }, b54] },
      { ...fullCandidate(), deltaBindings: b26 === undefined || b54 === undefined ? [] : [{ ...b26, nodeIds: ["C1.SHA256.f85c809e01596daa39a714cd20f2c7cd879cb6fc6e37e62cafcda90c9d9c6c36"] }, b54] },
      { ...fullCandidate(), deltaBindings: b26 === undefined || b54 === undefined ? [] : [b26, { ...b54, nodeIds: [b54.nodeIds[1]!, b54.nodeIds[0]!, b54.nodeIds[2]!] }] }
    ];
    for (const variant of variants) expect(createStructuralSchemaAuthority(variant)).toMatchObject({ status: "UNHEALTHY", diagnostic: { code: "INVALID_DELTA_BINDING" } });
    if (b26 !== undefined && b54 !== undefined) {
      const third = { ...b26, deltaId: "THIRD_DELTA" } as unknown as typeof b26;
      expect(createStructuralSchemaAuthority({ ...fullCandidate(), deltaBindings: [b26, b54, third] })).toMatchObject({ status: "UNHEALTHY", diagnostic: { code: "INVALID_DELTA_BINDING" } });
    }
  });

  it("closes the complete health, ownership, traversal, and freeze-fault matrix", () => {
    const mutable = fullCandidate(); const baseline = createStructuralSchemaAuthority(mutable);
    expect(baseline.status).toBe("HEALTHY"); if (baseline.status !== "HEALTHY") return;
    expect(baseline.health).toMatchObject({ eventDescriptorCount: 40, payloadBranchCount: 59, explicitVersionBranchCount: 13, unversionedBranchCount: 46, uniqueNodeCount: 430 });
    expect(baseline.expandedOccurrenceCensus).toEqual(FULL_C1_EXPECTED_EXPANDED_OCCURRENCE_CENSUS);
    expect([...graphObjects(mutable)].some((value) => graphObjects(baseline).has(value))).toBe(false);
    expect([...graphObjects(baseline)].every((value) => Object.isFrozen(value))).toBe(true);
    const reversedCandidate = { ...fullCandidate(), roots: [...fullCandidate().roots].reverse(), nodeBindings: [...fullCandidate().nodeBindings].reverse() };
    const reversed = createStructuralSchemaAuthority(reversedCandidate);
    expect(reversed.status).toBe("HEALTHY"); if (reversed.status !== "HEALTHY") return;
    expect(reversed.traversal).toEqual(baseline.traversal);
    const shared = { nodeId: "same", kind: "STRING" } as const;
    const duplicateObject = candidate([shared], "same");
    const failures = [
      createStructuralSchemaAuthorityForTestCandidate({ ...duplicateObject, nodeBindings: [{ nodeId: "same", node: shared }, { nodeId: "other", node: shared }] }),
      createStructuralSchemaAuthorityForTestCandidate(candidate([{ nodeId: "root", kind: "ARRAY", elementNodeId: "missing" }], "root")),
      createStructuralSchemaAuthorityForTestCandidate(candidate([{ nodeId: "a", kind: "ARRAY", elementNodeId: "b" }, { nodeId: "b", kind: "ARRAY", elementNodeId: "a" }], "a")),
      createStructuralSchemaAuthorityForTestCandidate(candidate([{ nodeId: "root", kind: "STRING" }, { nodeId: "orphan", kind: "BOOLEAN" }], "root"))
    ];
    expect(failures.map((failure) => failure.status === "UNHEALTHY" ? failure.diagnostic.code : "HEALTHY")).toEqual(["DUPLICATE_NODE_OBJECT", "UNRESOLVED_NODE_REFERENCE", "CYCLE_DETECTED", "ORPHAN_NODE"]);
    const revoked = Proxy.revocable(fullCandidate(), {}); revoked.revoke();
    expect(createStructuralSchemaAuthority(revoked.proxy)).toMatchObject({ status: "UNHEALTHY", diagnostic: { code: "INVALID_OBJECT_SHAPE" } });
  });

  it("proves the refinement registry is data-only and has no semantic callback dependency", () => {
    const source = readFileSync(new URL("./domain-event-structural-schema-ast.ts", import.meta.url), "utf8");
    expect(source.match(/^import .*$/gmu)).toEqual([
      'import type { DomainEventPayloadByType, DomainEventType } from "./events.js";',
      'import type { FirstNightAbilityInstanceProvenance } from "./first-night-ability-outcome-ledger.js";'
    ]);
    const authority = createFullC1StructuralSchemaAuthority(); expect(authority.status).toBe("HEALTHY"); if (authority.status !== "HEALTHY") return;
    expect([...graphObjects(authority.candidate)].flatMap((value) => Reflect.ownKeys(value).map((key) => Object.getOwnPropertyDescriptor(value, key))).every((descriptor) => descriptor === undefined || !("value" in descriptor) || typeof descriptor.value !== "function")).toBe(true);
    expect(STRUCTURAL_ID_ALIASES_V1).toHaveLength(16);
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
    const first = createStructuralSchemaAuthorityForTestCandidate(candidate([record, right, shared, left], "record"));
    const second = createStructuralSchemaAuthorityForTestCandidate(candidate([left, shared, record, right], "record"));
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
    const result = createStructuralSchemaAuthorityForTestCandidate(
      candidate(nodes, rootNodeId)
    );
    expect(result).toMatchObject({ status: "UNHEALTHY", diagnostic: { code, failClosed: true } });
  });

  it("rejects a repository key that disagrees with its node ID", () => {
    const node = { nodeId: "one", kind: "STRING" } as const;
    const graph = candidate([node], "one");
    const result = createStructuralSchemaAuthorityForTestCandidate({
      ...graph,
      nodeBindings: [{ nodeId: "two", node }]
    });
    expect(result).toMatchObject({
      status: "UNHEALTHY",
      diagnostic: { code: "NODE_BINDING_MISMATCH" }
    });
  });

  it("rejects one node object bound under two different IDs", () => {
    const node = { nodeId: "one", kind: "STRING" } as const; const graph = candidate([node], "one");
    const result = createStructuralSchemaAuthorityForTestCandidate({ ...graph, nodeBindings: [{ nodeId: "one", node }, { nodeId: "two", node }] });
    expect(result).toMatchObject({ status: "UNHEALTHY", diagnostic: { code: "DUPLICATE_NODE_OBJECT" } });
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
    expect(createStructuralSchemaAuthorityForTestCandidate(candidate([union, branch, literal], "union"))).toMatchObject({
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
    expect(createStructuralSchemaAuthorityForTestCandidate(candidate([union, left, right], "union"))).toMatchObject({
      status: "UNHEALTHY",
      diagnostic: { code: "INVALID_NODE_INVARIANT" }
    });
  });
});
