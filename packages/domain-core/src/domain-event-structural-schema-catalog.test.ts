import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { createFullC1StructuralSchemaAuthority, createStructuralSchemaAuthority } from "./domain-event-structural-schema-ast.js";
import { createC1AdditiveStructuralSchemaAuthority, createC1AdditiveStructuralSchemaCandidate } from "./domain-event-structural-schema-additive.js";
import { TWO_C_ADDITIVE_DESCRIPTORS, createTwoCAdditiveStructuralSchemaAuthority } from "./phase-3-slice-2c-structural-descriptors.js";
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

const CATALOG_V2_REPOSITORY_PATH =
  "docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md";
const CATALOG_V2_EXPECTED_BLOB_OID =
  "4f9a376e56f19b241d76ce2a75be83b70859ae25";
const CATALOG_V2_EXPECTED_RAW_SHA256 =
  "e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6";
const CATALOG_V2_EXPECTED_RAW_BYTE_LENGTH = 264855;
const CATALOG_V2_EXPECTED_DEFAULT_CHECKOUT_SHA256 =
  "7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7";
const GIT_PLUMBING_MAX_BUFFER_BYTES = 1_048_576;
const GIT_PLUMBING_TIMEOUT_MS = 30_000;
const REPOSITORY_ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const CATALOG_V2_WORKTREE_PATH = fileURLToPath(
  new URL(CATALOG_V2_REPOSITORY_PATH, new URL("../../../", import.meta.url))
);

type GitPlumbingFailureCode =
  | "D0_GIT_HEAD_BLOB_RESOLUTION_FAILED"
  | "D0_GIT_HEAD_BLOB_PROTOCOL_INVALID"
  | "D0_GIT_HEAD_BLOB_OID_MISMATCH"
  | "D0_GIT_BLOB_READ_FAILED"
  | "D0_GIT_BLOB_LENGTH_MISMATCH"
  | "D0_GIT_BLOB_SHA256_MISMATCH";

type CheckoutClassification =
  | "MATCHES_REPOSITORY_BLOB"
  | "LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY"
  | "OTHER_CHECKOUT_DIFFERENCE";

const sha256 = (bytes: Uint8Array): string =>
  createHash("sha256").update(bytes).digest("hex");

const runGitPlumbing = (args: readonly string[]) =>
  spawnSync("git", [...args], {
    cwd: REPOSITORY_ROOT,
    encoding: null,
    maxBuffer: GIT_PLUMBING_MAX_BUFFER_BYTES,
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
    timeout: GIT_PLUMBING_TIMEOUT_MS,
    windowsHide: true
  });

type GitPlumbingResult = ReturnType<typeof runGitPlumbing>;

const gitFailureSummary = (result: GitPlumbingResult): string => {
  const stderrBytes = Buffer.isBuffer(result.stderr) ? result.stderr.length : 0;
  const errorCode = (result.error as NodeJS.ErrnoException | undefined)?.code;
  const errorClass =
    errorCode === "ETIMEDOUT"
      ? "timeout"
      : errorCode === "ENOBUFS"
        ? "max-buffer"
        : result.error === undefined
          ? "none"
          : "spawn";
  return [
    `status=${result.status === null ? "null" : String(result.status)}`,
    `signal=${result.signal === null ? "absent" : "present"}`,
    `error=${errorClass}`,
    `stderr=${stderrBytes === 0 ? "empty" : "present"}`,
    `stderrBytes=${String(Math.min(stderrBytes, GIT_PLUMBING_MAX_BUFFER_BYTES))}`
  ].join(";");
};

const requireGitSuccess = (
  result: GitPlumbingResult,
  failureCode: GitPlumbingFailureCode
): Buffer => {
  if (
    result.error !== undefined ||
    result.signal !== null ||
    result.status !== 0 ||
    !Buffer.isBuffer(result.stdout) ||
    !Buffer.isBuffer(result.stderr) ||
    result.stderr.length !== 0
  ) {
    throw new Error(`${failureCode}: ${gitFailureSummary(result)}`);
  }
  return result.stdout;
};

const isLowerHexByte = (value: number): boolean =>
  (value >= 0x30 && value <= 0x39) || (value >= 0x61 && value <= 0x66);

const readCatalogV2HeadBlob = (): {
  readonly oid: string;
  readonly bytes: Buffer;
  readonly digest: string;
} => {
  const oidStdout = requireGitSuccess(
    runGitPlumbing([
      "--no-replace-objects",
      "rev-parse",
      "--verify",
      "--end-of-options",
      `HEAD:${CATALOG_V2_REPOSITORY_PATH}`
    ]),
    "D0_GIT_HEAD_BLOB_RESOLUTION_FAILED"
  );
  const hasLfFrame = oidStdout.length === 41 && oidStdout[40] === 0x0a;
  const hasCrlfFrame =
    oidStdout.length === 42 && oidStdout[40] === 0x0d && oidStdout[41] === 0x0a;
  const hasExactOidBytes =
    (hasLfFrame || hasCrlfFrame) &&
    oidStdout.subarray(0, 40).every(isLowerHexByte);
  if (!hasExactOidBytes) {
    throw new Error("D0_GIT_HEAD_BLOB_PROTOCOL_INVALID");
  }

  const oid = oidStdout.subarray(0, 40).toString("ascii");
  if (oid !== CATALOG_V2_EXPECTED_BLOB_OID) {
    throw new Error("D0_GIT_HEAD_BLOB_OID_MISMATCH");
  }

  const bytes = requireGitSuccess(
    runGitPlumbing([
      "--no-replace-objects",
      "cat-file",
      "blob",
      CATALOG_V2_EXPECTED_BLOB_OID
    ]),
    "D0_GIT_BLOB_READ_FAILED"
  );
  if (bytes.length !== CATALOG_V2_EXPECTED_RAW_BYTE_LENGTH) {
    throw new Error("D0_GIT_BLOB_LENGTH_MISMATCH");
  }
  const digest = sha256(bytes);
  if (digest !== CATALOG_V2_EXPECTED_RAW_SHA256) {
    throw new Error("D0_GIT_BLOB_SHA256_MISMATCH");
  }
  return { oid, bytes, digest };
};

const classifyCheckoutBytes = (
  repositoryBlob: Buffer,
  checkoutBytes: Buffer
): CheckoutClassification => {
  if (checkoutBytes.equals(repositoryBlob)) {
    return "MATCHES_REPOSITORY_BLOB";
  }
  let checkoutIndex = 0;
  for (const repositoryByte of repositoryBlob) {
    if (repositoryByte === 0x0a) {
      if (
        checkoutBytes[checkoutIndex] !== 0x0d ||
        checkoutBytes[checkoutIndex + 1] !== 0x0a
      ) {
        return "OTHER_CHECKOUT_DIFFERENCE";
      }
      checkoutIndex += 2;
      continue;
    }
    if (checkoutBytes[checkoutIndex] !== repositoryByte) {
      return "OTHER_CHECKOUT_DIFFERENCE";
    }
    checkoutIndex += 1;
  }
  return checkoutIndex === checkoutBytes.length
    ? "LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY"
    : "OTHER_CHECKOUT_DIFFERENCE";
};

const lineEndingCensus = (bytes: Buffer) => {
  let lf = 0;
  let crlf = 0;
  for (let index = 0; index < bytes.length; index += 1) {
    if (bytes[index] === 0x0a) {
      lf += 1;
      if (index > 0 && bytes[index - 1] === 0x0d) {
        crlf += 1;
      }
    }
  }
  return { lf, crlf, loneLf: lf - crlf };
};

const hasUtf8Bom = (bytes: Buffer): boolean =>
  bytes.length >= 3 &&
  bytes[0] === 0xef &&
  bytes[1] === 0xbb &&
  bytes[2] === 0xbf;

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
    const additive = createC1AdditiveStructuralSchemaAuthority({ baseline: canonical, additions: [] });
    expect(additive.status).toBe("HEALTHY");
    const malformed = createC1AdditiveStructuralSchemaCandidate(null as never);
    expect(malformed).toMatchObject({ ok: false, diagnostic: { code: "INVALID_OBJECT_SHAPE", failClosed: true } });
    const revoked = Proxy.revocable({ baseline: canonical, additions: [] }, {});
    revoked.revoke();
    expect(createC1AdditiveStructuralSchemaCandidate(revoked.proxy as never)).toMatchObject({ ok: false, diagnostic: { code: "INVALID_OBJECT_SHAPE", failClosed: true } });
    const unauthorizedDelta = createC1AdditiveStructuralSchemaCandidate({
      baseline: canonical,
      additions: [{
        eventOrdinal: 41,
        eventType: "SYNTHETIC",
        branchOrdinal: 60,
        branchId: "SYNTHETIC",
        versionPolicy: { kind: "UNVERSIONED" },
        rootNodeId: "SYNTHETIC",
        resultTypeName: "SYNTHETIC",
        nodeBindings: [],
        deltaBindings: [{ deltaId: "SYNTHETIC", branchId: "SYNTHETIC", fieldPath: "P", nodeIds: [] }]
      }]
    } as never);
    expect(unauthorizedDelta).toMatchObject({ ok: false, diagnostic: { code: "INVALID_DELTA_BINDING", failClosed: true } });
    // V01: the real Foundation additive seam accepts one test-only synthetic event.
    const baseline = healthyAuthority();
    const productionBefore = healthyAuthority();
    const syntheticNodeId = "C1.SHA256.foundation-verification-synthetic-string";
    const additions = [{
      eventOrdinal: 41,
      eventType: "FoundationVerificationSyntheticEvent",
      branchOrdinal: 60,
      branchId: "C1-FOUNDATION-VERIFICATION-SYNTHETIC",
      versionPolicy: { kind: "UNVERSIONED" },
      rootNodeId: syntheticNodeId,
      resultTypeName: "FoundationVerificationSyntheticPayload",
      nodeBindings: [{ nodeId: syntheticNodeId, node: { nodeId: syntheticNodeId, kind: "STRING" } }],
      deltaBindings: []
    }] as const;

    const result = createC1AdditiveStructuralSchemaAuthority({ baseline, additions });
    expect(result.status).toBe("HEALTHY");
    if (result.status !== "HEALTHY") return;

    expect(baseline.candidate.expectedEventCount).toBe(40);
    expect(baseline.candidate.expectedBranchCount).toBe(59);
    expect(additions[0]?.eventOrdinal).toBe(41);
    expect(additions[0]?.branchOrdinal).toBe(60);
    expect(result.candidate.expectedEventCount).toBe(41);
    expect(result.candidate.expectedBranchCount).toBe(60);
    expect(result.candidate.roots.filter((root) => root.eventOrdinal <= 40)).toEqual(
      baseline.candidate.roots.filter((root) => root.eventOrdinal <= 40)
    );
    expect(result.candidate.roots.filter((root) => root.branchOrdinal <= 59)).toEqual(
      baseline.candidate.roots.filter((root) => root.branchOrdinal <= 59)
    );
    expect(result.candidate.nodeBindings.slice(0, baseline.candidate.nodeBindings.length)).toEqual(
      baseline.candidate.nodeBindings
    );
    expect(result.candidate.deltaBindings).toEqual(baseline.candidate.deltaBindings);
    expect(additions[0]?.deltaBindings).toEqual([]);
    expect(result.candidate.roots.some((root) => root.eventType === "FoundationVerificationSyntheticEvent")).toBe(true);
    expect(productionBefore.candidate.roots.some((root) => root.eventType === "FoundationVerificationSyntheticEvent")).toBe(false);
    expect(createCanonicalSchemaArtifact(productionBefore)).toEqual(createCanonicalSchemaArtifact(healthyAuthority()));
    // V02: the existing C1 authority path rejects mutation of the accepted historical prefix.
    const baselineV02 = healthyAuthority();
    const mutatedCandidate = structuredClone(baselineV02.candidate) as unknown as {
      readonly nodeBindings: Array<{ nodeId: string; readonly node: { readonly nodeId: string } }>;
    };
    const target = mutatedCandidate.nodeBindings[0];
    if (target === undefined) throw new Error("FULL_C1 historical node binding is missing");
    const originalNodeId = target.node.nodeId;
    target.nodeId = `${originalNodeId}-mutated`;

    const resultV02 = createStructuralSchemaAuthority(mutatedCandidate as never);
    expect(resultV02).toMatchObject({
      status: "UNHEALTHY",
      diagnostic: { code: "NODE_BINDING_MISMATCH", failClosed: true }
    });
    expect(target.nodeId).not.toBe(target.node.nodeId);
    expect(baselineV02.candidate.nodeBindings[0]?.nodeId).toBe(originalNodeId);
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

  it("[2C-F01] captures every additive subject against the immutable C1 prefix", () => {
    const baseline = healthyAuthority();
    const input = { baseline, additions: structuredClone(TWO_C_ADDITIVE_DESCRIPTORS) };
    const result = createC1AdditiveStructuralSchemaCandidate(input);
    expect(baseline.candidate.expectedEventCount).toBe(40);
    expect(baseline.candidate.expectedBranchCount).toBe(59);
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.candidate.expectedEventCount).toBe(50);
    expect(result.candidate.expectedBranchCount).toBe(69);
    expect(result.candidate.roots.slice(-10).map((root) => root.eventType)).toEqual(
      TWO_C_ADDITIVE_DESCRIPTORS.map((descriptor) => descriptor.eventType)
    );
  });

  it("[2C-F02] materializes detached backing for every additive subject", () => {
    const authority = createTwoCAdditiveStructuralSchemaAuthority();
    expect(authority.status).toBe("HEALTHY");
    if (authority.status !== "HEALTHY") return;
    expect(authority.candidate.expectedEventCount).toBe(50);
    expect(authority.candidate.expectedBranchCount).toBe(69);
    for (const descriptor of TWO_C_ADDITIVE_DESCRIPTORS) {
      const root = authority.candidate.roots.find((candidate) => candidate.eventType === descriptor.eventType);
      expect(root).toMatchObject({ eventOrdinal: descriptor.eventOrdinal, branchOrdinal: descriptor.branchOrdinal });
      const binding = authority.candidate.nodeBindings.find((candidate) => candidate.nodeId === descriptor.rootNodeId);
      expect(binding?.node.nodeId).toBe(descriptor.rootNodeId);
    }
    expect(Object.isFrozen(authority.candidate)).toBe(true);
    expect(Object.isFrozen(authority.candidate.roots)).toBe(true);
    expect(Object.isFrozen(authority.candidate.nodeBindings)).toBe(true);
  });

  it("[2C-F03] rejects one malformed descriptor for each additive subject", () => {
    const baseline = healthyAuthority();
    for (const [index, descriptor] of TWO_C_ADDITIVE_DESCRIPTORS.entries()) {
      const additions = structuredClone(TWO_C_ADDITIVE_DESCRIPTORS) as Array<Record<string, unknown>>;
      delete additions[index]?.rootNodeId;
      const result = createC1AdditiveStructuralSchemaCandidate({ baseline, additions } as never);
      expect(result, descriptor.eventType).toMatchObject({
        ok: false,
        diagnostic: { code: "INVALID_OBJECT_SHAPE", failClosed: true }
      });
    }
  });

  it("[2C-F04] rejects hostile descriptor capture for every additive subject without throwing", () => {
    const baseline = healthyAuthority();
    for (const descriptor of TWO_C_ADDITIVE_DESCRIPTORS) {
      const hostile = new Proxy(structuredClone(descriptor), {
        ownKeys: () => { throw new Error("hostile additive descriptor"); }
      });
      expect(() => createC1AdditiveStructuralSchemaCandidate({
        baseline,
        additions: [hostile]
      } as never)).not.toThrow();
      expect(createC1AdditiveStructuralSchemaCandidate({
        baseline,
        additions: [hostile]
      } as never)).toMatchObject({
        ok: false,
        diagnostic: { code: "INVALID_OBJECT_SHAPE", failClosed: true }
      });
    }
  });

  it("[2C-F05] rejects tampered additive backing for every subject", () => {
    for (const descriptor of TWO_C_ADDITIVE_DESCRIPTORS) {
      const authority = createTwoCAdditiveStructuralSchemaAuthority();
      expect(authority.status).toBe("HEALTHY");
      if (authority.status !== "HEALTHY") return;
      const candidate = structuredClone(authority.candidate) as {
        nodeBindings: Array<{ nodeId: string; node: { nodeId: string } }>;
      };
      const binding = candidate.nodeBindings.find((entry) => entry.nodeId === descriptor.rootNodeId);
      if (binding === undefined) throw new Error(`Missing additive root binding: ${descriptor.eventType}`);
      binding.nodeId = `${binding.nodeId}-tampered`;
      expect(createStructuralSchemaAuthority(candidate as never)).toMatchObject({
        status: "UNHEALTHY",
        diagnostic: { code: "NODE_BINDING_MISMATCH", failClosed: true }
      });
    }
  });

  it("[2C-F06] keeps additive replay reconstruction fail-closed for every subject", () => {
    const authority = createTwoCAdditiveStructuralSchemaAuthority();
    expect(authority.status).toBe("HEALTHY");
    if (authority.status !== "HEALTHY") return;
    expect(createStructuralSchemaAuthority(structuredClone(authority.candidate))).toMatchObject({ status: "HEALTHY" });
    for (const descriptor of TWO_C_ADDITIVE_DESCRIPTORS) {
      const candidate = structuredClone(authority.candidate) as {
        roots: Array<{ eventType: string; branchOrdinal: number }>;
      };
      const root = candidate.roots.find((entry) => entry.eventType === descriptor.eventType);
      if (root === undefined) throw new Error(`Missing additive replay root: ${descriptor.eventType}`);
      root.branchOrdinal = 1;
      expect(createStructuralSchemaAuthority(candidate as never), descriptor.eventType).toMatchObject({
        status: "UNHEALTHY",
        diagnostic: { failClosed: true }
      });
    }
  });

  it("matches the checked-in frozen generated Catalog V2 path byte-for-byte", () => {
    const repositoryArtifact = readCatalogV2HeadBlob();
    const generatedBytes = Buffer.from(
      renderGeneratedStructuralSchemaCatalogV2(healthyAuthority()),
      "utf8"
    );
    const checkoutBytes = readFileSync(CATALOG_V2_WORKTREE_PATH);

    expect(repositoryArtifact.oid).toBe(CATALOG_V2_EXPECTED_BLOB_OID);
    expect(repositoryArtifact.bytes).toHaveLength(CATALOG_V2_EXPECTED_RAW_BYTE_LENGTH);
    expect(repositoryArtifact.digest).toBe(CATALOG_V2_EXPECTED_RAW_SHA256);
    expect(lineEndingCensus(repositoryArtifact.bytes)).toEqual({
      lf: 626,
      crlf: 0,
      loneLf: 626
    });
    expect(hasUtf8Bom(repositoryArtifact.bytes)).toBe(false);

    expect(generatedBytes).toHaveLength(CATALOG_V2_EXPECTED_RAW_BYTE_LENGTH);
    expect(sha256(generatedBytes)).toBe(CATALOG_V2_EXPECTED_RAW_SHA256);
    expect(lineEndingCensus(generatedBytes)).toEqual({
      lf: 626,
      crlf: 0,
      loneLf: 626
    });
    expect(hasUtf8Bom(generatedBytes)).toBe(false);
    expect(generatedBytes.equals(repositoryArtifact.bytes)).toBe(true);

    const checkoutClassification = classifyCheckoutBytes(
      repositoryArtifact.bytes,
      checkoutBytes
    );
    expect(checkoutClassification).not.toBe("OTHER_CHECKOUT_DIFFERENCE");
    if (checkoutClassification === "MATCHES_REPOSITORY_BLOB") {
      expect(checkoutBytes).toHaveLength(CATALOG_V2_EXPECTED_RAW_BYTE_LENGTH);
      expect(sha256(checkoutBytes)).toBe(CATALOG_V2_EXPECTED_RAW_SHA256);
      expect(lineEndingCensus(checkoutBytes)).toEqual({
        lf: 626,
        crlf: 0,
        loneLf: 626
      });
    } else {
      expect(checkoutBytes).toHaveLength(265481);
      expect(sha256(checkoutBytes)).toBe(
        CATALOG_V2_EXPECTED_DEFAULT_CHECKOUT_SHA256
      );
      expect(lineEndingCensus(checkoutBytes)).toEqual({
        lf: 626,
        crlf: 626,
        loneLf: 0
      });
    }
  });
});
