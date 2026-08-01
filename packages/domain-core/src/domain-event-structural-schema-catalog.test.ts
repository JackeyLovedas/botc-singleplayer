import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { createFullC1StructuralSchemaAuthority, createStructuralSchemaAuthority } from "./domain-event-structural-schema-ast.js";
import {
  APPROVED_C1_DELTA_REGISTRY_V1,
  C1_SUPPORTING_AUTHORITY_BINDINGS,
  auditApprovedC1DeltaRegistry,
  createCanonicalSchemaArtifact,
  renderGeneratedStructuralSchemaCatalogV2
} from "./domain-event-structural-schema-catalog.js";

const healthyAuthority = () => {
  const authority = createFullC1StructuralSchemaAuthority();
  if (authority.status !== "HEALTHY") {
    throw new Error(`${authority.diagnostic.code}: ${authority.diagnostic.detail}`);
  }
  return authority;
};

const mutableRegistry = (): Record<string, unknown> =>
  structuredClone(APPROVED_C1_DELTA_REGISTRY_V1);

describe("Catalog V2 audit projection", () => {
  it("accepts exactly the frozen two-delta, 57-unchanged registry and three supports", () => {
    expect(auditApprovedC1DeltaRegistry(APPROVED_C1_DELTA_REGISTRY_V1)).toEqual({
      valid: true,
      code: "APPROVED_C1_DELTA_REGISTRY_V1_MATCH",
      approvedDeltaCount: 2,
      unchangedBranchCount: 57,
      otherBranchDeltaCount: 0
    });
    expect(Object.isFrozen(APPROVED_C1_DELTA_REGISTRY_V1)).toBe(true);
    expect(Object.isFrozen(APPROVED_C1_DELTA_REGISTRY_V1.Records)).toBe(true);
    expect(Object.isFrozen(C1_SUPPORTING_AUTHORITY_BINDINGS)).toBe(true);
  });

  it.each([
    ["partial record", (registry: Record<string, unknown>) => {
      const records = registry.Records as Record<string, unknown>[];
      delete records[0]?.JustificationAuthority;
    }, "INVALID_DELTA_RECORD"],
    ["missing B26", (registry: Record<string, unknown>) => {
      (registry.Records as unknown[]).shift();
    }, "INVALID_DELTA_RECORD"],
    ["missing B54", (registry: Record<string, unknown>) => {
      (registry.Records as unknown[]).pop();
    }, "INVALID_DELTA_RECORD"],
    ["third delta", (registry: Record<string, unknown>) => {
      const records = registry.Records as unknown[];
      records.push(structuredClone(records[0]));
    }, "INVALID_DELTA_RECORD"],
    ["changed 2/57/0 count", (registry: Record<string, unknown>) => {
      registry.UnchangedBranchCount = 56;
    }, "INVALID_REGISTRY_COUNTS"],
    ["changed approved record", (registry: Record<string, unknown>) => {
      const records = registry.Records as Record<string, unknown>[];
      if (records[1] !== undefined) records[1].BehaviorChanged = true;
    }, "INVALID_DELTA_RECORD"]
  ] as const)("rejects %s", (_label, mutate, code) => {
    const registry = mutableRegistry();
    mutate(registry);
    expect(auditApprovedC1DeltaRegistry(registry)).toEqual({
      valid: false,
      code,
      failClosed: true
    });
  });

  it("rejects missing or mutated SUP003", () => {
    const missing = structuredClone(C1_SUPPORTING_AUTHORITY_BINDINGS).slice(0, 2);
    expect(
      auditApprovedC1DeltaRegistry(APPROVED_C1_DELTA_REGISTRY_V1, missing)
    ).toMatchObject({ valid: false, code: "INVALID_SUPPORTING_AUTHORITY" });
    const changed = [...structuredClone(C1_SUPPORTING_AUTHORITY_BINDINGS)];
    changed[2] = { ...changed[2]!, UsedByCriteria: ["C1-C04A"] };
    expect(
      auditApprovedC1DeltaRegistry(APPROVED_C1_DELTA_REGISTRY_V1, changed)
    ).toMatchObject({ valid: false, code: "INVALID_SUPPORTING_AUTHORITY" });
  });

  it("accepts dense detached exact registry and support data", () => {
    expect(auditApprovedC1DeltaRegistry(structuredClone(APPROVED_C1_DELTA_REGISTRY_V1), structuredClone(C1_SUPPORTING_AUTHORITY_BINDINGS))).toMatchObject({ valid: true, code: "APPROVED_C1_DELTA_REGISTRY_V1_MATCH" });
  });

  it("rejects sparse support arrays and sparse criteria arrays", () => {
    expect(auditApprovedC1DeltaRegistry(APPROVED_C1_DELTA_REGISTRY_V1, new Array(3))).toMatchObject({ valid: false, code: "INVALID_SUPPORTING_AUTHORITY" });
    const originalSupports = structuredClone(C1_SUPPORTING_AUTHORITY_BINDINGS);
    const supports = [{ ...originalSupports[0]!, UsedByCriteria: new Array(2) }, ...originalSupports.slice(1)];
    expect(auditApprovedC1DeltaRegistry(APPROVED_C1_DELTA_REGISTRY_V1, supports)).toMatchObject({ valid: false, code: "INVALID_SUPPORTING_AUTHORITY" });
  });

  it("rejects accessors without invoking getters", () => {
    const registry = mutableRegistry(); let getterCalls = 0;
    Object.defineProperty(registry, "RegistryVersion", { enumerable: true, configurable: true, get: () => { getterCalls += 1; return "APPROVED_C1_DELTA_REGISTRY_V1"; } });
    expect(auditApprovedC1DeltaRegistry(registry)).toMatchObject({ valid: false, code: "INVALID_REGISTRY_SHAPE" });
    expect(getterCalls).toBe(0);
    const deltaRegistry = mutableRegistry(); const first = (deltaRegistry.Records as Record<string, unknown>[])[0]!;
    Object.defineProperty(first, "DeltaId", { enumerable: true, configurable: true, get: () => { getterCalls += 1; return "B26_SEAMSTRESS_VARIADIC_DELTA"; } });
    expect(auditApprovedC1DeltaRegistry(deltaRegistry)).toMatchObject({ valid: false, code: "INVALID_DELTA_RECORD" });
    expect(getterCalls).toBe(0);
  });

  it.each([
    ["non-enumerable extra key", (registry: Record<string, unknown>) => { Object.defineProperty(registry, "hidden", { value: true }); }],
    ["symbol key", (registry: Record<string, unknown>) => { Object.defineProperty(registry, Symbol("extra"), { value: true }); }],
    ["prototype extension", (registry: Record<string, unknown>) => { Object.setPrototypeOf(registry, { extra: true }); }],
    ["reordered keys", (registry: Record<string, unknown>) => { const value = registry.RegistryVersion; delete registry.RegistryVersion; registry.RegistryVersion = value; }],
    ["noncanonical descriptor", (registry: Record<string, unknown>) => { Object.defineProperty(registry, "RegistryVersion", { value: registry.RegistryVersion, enumerable: true, writable: false, configurable: true }); }]
  ] as const)("rejects %s", (_label, mutate) => {
    const registry = mutableRegistry(); mutate(registry);
    expect(auditApprovedC1DeltaRegistry(registry)).toMatchObject({ valid: false, code: "INVALID_REGISTRY_SHAPE" });
  });

  it("rejects ordinary and revoked proxies without open property access", () => {
    let getterCalls = 0; const proxied = new Proxy(mutableRegistry(), { get: () => { getterCalls += 1; throw new Error("proxy get trap must not run"); } });
    expect(auditApprovedC1DeltaRegistry(proxied)).toMatchObject({ valid: false, code: "INVALID_REGISTRY_SHAPE" });
    expect(getterCalls).toBe(0);
    const revocable = Proxy.revocable(mutableRegistry(), {}); revocable.revoke();
    expect(auditApprovedC1DeltaRegistry(revocable.proxy)).toMatchObject({ valid: false, code: "INVALID_REGISTRY_SHAPE" });
  });

  it("creates deterministic direct-SHA artifacts over the complete authority", () => {
    const authority = healthyAuthority();
    const first = createCanonicalSchemaArtifact(authority);
    const second = createCanonicalSchemaArtifact(authority);
    expect(second).toEqual(first);
    expect(first.lines.filter((line) => line.startsWith("E|"))).toHaveLength(40);
    expect(first.lines.filter((line) => line.startsWith("R|"))).toHaveLength(59);
    expect(first.lines.filter((line) => line.startsWith("N|"))).toHaveLength(430);
    expect(first.lines.filter((line) => line.startsWith("D|"))).toHaveLength(2);
    expect(first.lines.filter((line) => line.startsWith("U|"))).toHaveLength(1);
    expect(first.lines.filter((line) => line.startsWith("X|"))).toHaveLength(1);
    expect(first.sha256).toBe(
      createHash("sha256").update(Uint8Array.from(first.bytes)).digest("hex")
    );
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.bytes)).toBe(true);
    expect(Object.isFrozen(first.lines)).toBe(true);
  });

  it("derives descriptors and artifacts only from canonical numeric root order", () => {
    const canonical = healthyAuthority(); const captured = structuredClone(canonical.candidate);
    const permutedCandidate = { ...captured, roots: [...captured.roots].reverse(), nodeBindings: [...captured.nodeBindings].reverse() };
    const permuted = createStructuralSchemaAuthority(permutedCandidate);
    expect(permuted.status).toBe("HEALTHY"); if (permuted.status !== "HEALTHY") return;
    expect(permuted.traversal).toEqual(canonical.traversal);
    expect(createCanonicalSchemaArtifact(permuted)).toEqual(createCanonicalSchemaArtifact(canonical));
    expect(renderGeneratedStructuralSchemaCatalogV2(permuted)).toBe(renderGeneratedStructuralSchemaCatalogV2(canonical));
    const event11 = createCanonicalSchemaArtifact(permuted).lines.find((line) => line.startsWith("E|000011|"));
    expect(event11).toContain("branchOrdinals=[000011,000012,000013,000014,000015,000016,000017,000018,000019,000020]");
    const capturedChanged = structuredClone(canonical.candidate); const first = capturedChanged.roots[0]!; const second = capturedChanged.roots[1]!;
    const changedCandidate = { ...capturedChanged, roots: [{ ...first, branchOrdinal: second.branchOrdinal }, { ...second, branchOrdinal: first.branchOrdinal }, ...capturedChanged.roots.slice(2)] };
    const changed = createStructuralSchemaAuthority(changedCandidate);
    expect(changed.status).toBe("HEALTHY"); if (changed.status !== "HEALTHY") return;
    expect(createCanonicalSchemaArtifact(changed).sha256).not.toBe(createCanonicalSchemaArtifact(canonical).sha256);
  });

  it("renders the full audit-only Catalog V2 without validator completion claims", () => {
    const catalog = renderGeneratedStructuralSchemaCatalogV2(healthyAuthority());
    expect(catalog.match(/^E\|/gmu)).toHaveLength(40);
    expect(catalog.match(/^B\|/gmu)).toHaveLength(59);
    expect(catalog.match(/^N\|/gmu)).toHaveLength(430);
    expect(catalog.match(/^R\|/gmu)).toHaveLength(59);
    expect(catalog.match(/^D\|/gmu)).toHaveLength(2);
    expect(catalog.match(/^S\|/gmu)).toHaveLength(3);
    expect(catalog).toContain("fullEventInventoryMaterialized=true");
    expect(catalog).toContain("runtimeValidatorImplemented=false");
    expect(catalog).toContain("catalogRuntimeAuthority=false");
    expect(catalog).toContain("C1-C04A=UNCLAIMED");
    expect(catalog).toContain("C1-C10=HISTORICAL_INACTIVE");
    expect(catalog).not.toContain("runtimeValidatorImplemented=true");
  });

  it("matches the checked-in frozen generated Catalog V2 path byte-for-byte", () => {
    const generatedCatalogUrl = new URL(
      "../../../docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md",
      import.meta.url
    );
    expect(readFileSync(generatedCatalogUrl, "utf8")).toBe(
      renderGeneratedStructuralSchemaCatalogV2(healthyAuthority())
    );
  });
});
