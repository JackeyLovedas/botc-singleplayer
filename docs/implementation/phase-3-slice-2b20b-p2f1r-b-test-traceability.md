# Phase 3 Slice 2B20B-P2F1R-B Test Traceability

## Metadata

- `sliceId`: `2B20B-P2F1R-B`
- `authorization`:
  `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_B_IMPLEMENTATION_ONLY`
- `repairAuthorization`:
  `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_B_IMPLEMENTATION_REPAIR_ROUND_1_ONLY`
- `repairRound`: `1`
- `repairBase`: `e3ee23c2f84df194936b76f91420872dd8dd4aa0`
- `sourceDesign`:
  `docs/architecture/2B20B-P2F1R-B-deterministic-integrity-hash-design-round-1.md`
- `sourceDesignSha256`:
  `2e7d909af750b3a97e6a39484b635ee69acc7f6f78c09f69f1f63217fd29cf34`
- `designCorrection`:
  `docs/architecture/2B20B-P2F1R-B-deterministic-integrity-hash-design-correction-round-1.md`
- `designCorrectionSha256`:
  `0efc46a07e7917bf92d446dfd668d8585a144ff9088605a102884d6bb5e81658`
- `designVerdict`: `RULE_DESIGN_PASS`
- `AInputCommit`: `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`
- `AProductionProvenance`: `f3be36c7b195c3743df4d8213734d72908fed7e5`
- `productionFile`: `packages/domain-core/src/canonical-runtime-hash.ts`
- `testFile`: `packages/domain-core/src/canonical-runtime-hash.test.ts`
- `implementationAuthorized`: `true / B_COMPONENT_ONLY`
- `publicationAuthorized`: `false`
- `R1PrimarySet`: `[]`
- `R2PrimarySet`: `[]`
- `criterionCount`: `12`

## Actual test inventory

All physical tests are in
`packages/domain-core/src/canonical-runtime-hash.test.ts`.

1. `B-C01_RAW_COPY_BOUNDARY admits exact Uint8Array bytes and rejects hostile views`
2. `B-C02_RAW_TLV_HASH matches exact raw known-answer vectors`
3. `B-C03_CANONICAL_VALUE_HASH consumes A bytes without calling A internally`
4. `B-C04_FUTURE_BINDING_HASH binds two ordered opaque byte sequences`
5. `B-C05_ROLE_DOMAIN_SEPARATION freezes one preimage and complete structural vectors`
6. `B-C06_RESULT_METADATA rejects hostile exact-shape and metadata mutations`
7. `B-C07_DIGEST_VERIFICATION detects bytes, domains, encoding and digest mutation`
8. `B-C08_FAILURE_PRECEDENCE returns the first closed triple without later reads`
9. `B-C09_HASH_NOT_AUTHORITY exposes integrity records rather than authority handles`
10. `B-C10_CACHE_ONLY contains no snapshot, rebuild, replay or state capability`
11. `B-C11_LEGACY_ISOLATION remains source-local and does not import application hashing`
12. `B-C12_PLATFORM_VECTOR_READINESS is deterministic for Unicode and newline A bytes`

## Traceability V1.1 matrix

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement | ActualTest | ActualBinding | ActualTestFile | ActualTestTitle | ActualPrimaryLayer | ActualReachability | ActualTrust | SupportingAuthorityId | MechanismMatch |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `B-C01_RAW_COPY_BOUNDARY` | Every byte input is admitted without caller behavior and copied once to private storage | exact `Uint8Array` succeeds; null, Proxy, revoked Proxy, Buffer, subclass, prototype-spoofed typed array, wrong view, shared/prototype-spoofed shared backing, detached and oversized inputs return frozen triples; later mutation cannot alter the record | hostile public-wrapper matrix plus source review for safely unforceable platform failures | `R3` | `T1` | `STRUCTURAL_VALIDATION` | private exact copy or closed failure with no retained view | frozen A size ceiling and Node typed-array/Proxy behavior | `B-C01_RAW_COPY_BOUNDARY admits exact Uint8Array bytes and rejects hostile views` | main assertion: exact brand acceptance/private-copy isolation; entry: three public create wrappers through `admitBytes`; fault: Proxy-first intrinsic brand checks, shared backing rejection and no iterator/coercion dispatch | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C01_RAW_COPY_BOUNDARY admits exact Uint8Array bytes and rejects hostile views` | `STRUCTURAL_VALIDATION` | `R3` | `T1` | `SUP-2B20B-P2F1R-B-001` | `PASS` |
| `B-C02_RAW_TLV_HASH` | Raw role binds exact copied bytes under its domain | empty and A-null literal vectors reproduce exact lengths and digests | public raw wrapper and known-answer vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | exact raw-domain record | A serialization is setup authority only | `B-C02_RAW_TLV_HASH matches exact raw known-answer vectors` | main assertion: literal raw-domain lengths/digests; entry: `createRawATlvIntegrity`; fault: byte/preimage mismatch changes record | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C02_RAW_TLV_HASH matches exact raw known-answer vectors` | `PURE_POLICY_SEAM` | `R4` | `T1` | `SUP-2B20B-P2F1R-B-001` | `PASS` |
| `B-C03_CANONICAL_VALUE_HASH` | Canonical-value role is deterministic while consuming bytes only | repeated equal A byte arrays yield equal records; source imports/calls no A capture, serializer or backing reader | external A setup, public B byte wrapper and source-boundary audit | `R4` | `T1` | `PURE_POLICY_SEAM` | exact canonical-value record with no provenance claim | frozen A capture/TLV flow is test setup outside B | `B-C03_CANONICAL_VALUE_HASH consumes A bytes without calling A internally` | main assertion: repeatable canonical-value record plus source denylist; entry: `createCanonicalValueIntegrity`; fault: any A runtime dependency fails static assertion | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C03_CANONICAL_VALUE_HASH consumes A bytes without calling A internally` | `PURE_POLICY_SEAM` | `R4` | `T1` | `SUP-2B20B-P2F1R-B-001` | `PASS` |
| `B-C04_FUTURE_BINDING_HASH` | Future binding binds two ordered opaque byte sequences | exact null/true vector verifies; argument reversal changes digest | public binding wrapper and nested-envelope known-answer vector | `R4` | `T1` | `PURE_POLICY_SEAM` | exact future-binding integrity record only | future semantic authority remains outside B | `B-C04_FUTURE_BINDING_HASH binds two ordered opaque byte sequences` | main assertion: exact twelve-field binding record and verification; entry: future-binding create/verify wrappers; fault: component reversal changes digest | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C04_FUTURE_BINDING_HASH binds two ordered opaque byte sequences` | `PURE_POLICY_SEAM` | `R4` | `T1` | `NONE` | `PASS` |
| `B-C05_ROLE_DOMAIN_SEPARATION` | One unique Canonical Hash Preimage V1 binds exactly three domains | identical bytes under raw/canonical roles differ; `{a:null}` and `["a",null]` reproduce complete payload/frame/digest vectors | literal preimage and digest vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | three domain-separated digests under one framing contract | parent protocol/domain literals and frozen A TLV bytes | `B-C05_ROLE_DOMAIN_SEPARATION freezes one preimage and complete structural vectors` | main assertion: three isolated domains and corrected literal vectors; entry: all create wrappers; fault: alternate domain or framing fails literal digest | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C05_ROLE_DOMAIN_SEPARATION freezes one preimage and complete structural vectors` | `PURE_POLICY_SEAM` | `R4` | `T3` | `SUP-2B20B-P2F1R-B-001` | `PASS` |
| `B-C06_RESULT_METADATA` | Stored records have exact closed shape and deterministic metadata | exact key order succeeds; null, extra, version, false length, accessor and symbol cases return frozen failures with zero getter calls | hostile public verification record matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact record or first closed failure | no external authority | `B-C06_RESULT_METADATA rejects hostile exact-shape and metadata mutations` | main assertion: descriptor-safe exact record admission; entry: public verify wrappers; fault: malformed shape/version/length returns exact failure without getter execution | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C06_RESULT_METADATA rejects hostile exact-shape and metadata mutations` | `STRUCTURAL_VALIDATION` | `R3` | `T1` | `NONE` | `PASS` |
| `B-C07_DIGEST_VERIFICATION` | Verification recomputes instead of trusting stored metadata or digest | exact record verifies; bytes, domain, encoding, uppercase hex and valid-but-wrong digest mutations fail exactly | public verification mutation matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `matchesExactBytes:true` or frozen failure | known-answer vectors support positives | `B-C07_DIGEST_VERIFICATION detects bytes, domains, encoding and digest mutation` | main assertion: recomputed exact-byte match; entry: all verify wrappers; fault: byte/domain/text/digest mutation fails closed | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C07_DIGEST_VERIFICATION detects bytes, domains, encoding and digest mutation` | `STRUCTURAL_VALIDATION` | `R3` | `T1` | `NONE` | `PASS` |
| `B-C08_FAILURE_PRECEDENCE` | Every reachable public failure uses the corrected triple and first-failure precedence | all 34 codes and every reachable context variant are covered; all four byte positions, field-specific input kinds, frozen three-key objects, zero later reads/traps and static-only unforceable branches are verified | table-driven public-wrapper matrix plus compound Proxy/getter counters and static source inspection for safely unforceable allocation/copy/arithmetic/internal-hash failures; no production hook | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact first `code/phase/inputKind`, no throw, disclosure, partial result or later read | correction failure matrix; unforceable internal branches use source review | `B-C08_FAILURE_PRECEDENCE returns the first closed triple without later reads` | main assertion: complete 34-code runtime/static matrix with `expectedFailClosedBehavior`; entry: every public create/verify wrapper; fault: first invalid context returns the exact frozen triple and suppresses later traps | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C08_FAILURE_PRECEDENCE returns the first closed triple without later reads` | `STRUCTURAL_VALIDATION` | `R3` | `T1` | `NONE` | `PASS` |
| `B-C09_HASH_NOT_AUTHORITY` | Integrity records cannot issue state/history/replay authority | result keys and source expose no token, issuer, accepted-history or state-handle capability | result-shape and source API audit | `R4` | `T3` | `PURE_POLICY_SEAM` | integrity evidence only | later P2F authority remains separately required | `B-C09_HASH_NOT_AUTHORITY exposes integrity records rather than authority handles` | main assertion: result/source authority denylist; entry: raw result and B source; fault: any issuer/token/state-handle surface fails | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C09_HASH_NOT_AUTHORITY exposes integrity records rather than authority handles` | `PURE_POLICY_SEAM` | `R4` | `T3` | `NONE` | `PASS` |
| `B-C10_CACHE_ONLY` | Snapshot-shaped bytes remain non-authoritative | B source contains no snapshot/state hash, replay, rebuild or event capability | source and allowlist inspection | `R4` | `T3` | `PURE_POLICY_SEAM` | generic byte integrity only | replay/state owners stay external | `B-C10_CACHE_ONLY contains no snapshot, rebuild, replay or state capability` | main assertion: negative capability source audit; entry: B source; fault: snapshot/replay/rebuild/event surface fails | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C10_CACHE_ONLY contains no snapshot, rebuild, replay or state capability` | `PURE_POLICY_SEAM` | `R4` | `T3` | `NONE` | `PASS` |
| `B-C11_LEGACY_ISOLATION` | B is additive and does not migrate legacy hashing | source imports no application package, fingerprint implementation or JSON canonicalization | source isolation audit plus unchanged regression execution | `R4` | `T3` | `PURE_POLICY_SEAM` | no alias, migration or reinterpretation | existing application regressions are supporting evidence only | `B-C11_LEGACY_ISOLATION remains source-local and does not import application hashing` | main assertion: import/JSON/fingerprint denylist; entry: B source plus separate unchanged regression; fault: legacy coupling fails | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C11_LEGACY_ISOLATION remains source-local and does not import application hashing` | `PURE_POLICY_SEAM` | `R4` | `T3` | `SUP-2B20B-P2F1R-B-002` | `PASS` |
| `B-C12_PLATFORM_VECTOR_READINESS` | Framing and vectors contain no platform-dependent data | Unicode, LF and CRLF vectors reproduce exact lengths and digests; hex is fixed lowercase with no newline/BOM | literal deterministic vectors and source audit | `R4` | `T3` | `PURE_POLICY_SEAM` | identical expected bytes/digests on supported platforms | actual Windows/Linux evidence remains D-owned and unclaimed | `B-C12_PLATFORM_VECTOR_READINESS is deterministic for Unicode and newline A bytes` | main assertion: Unicode/newline literal digest vectors; entry: canonical-value wrapper; fault: platform-dependent encoding changes literal result | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C12_PLATFORM_VECTOR_READINESS is deterministic for Unicode and newline A bytes` | `PURE_POLICY_SEAM` | `R4` | `T3` | `SUP-2B20B-P2F1R-B-001` | `PASS` |

## Supporting authority registry

| SupportingAuthorityId | Producer | SourceTestOrFixture | AuthorityStatus | UsedByCriteria | MutationDisposition |
|---|---|---|---|---|---|
| `SUP-2B20B-P2F1R-B-001` | P2F1R-A frozen local component, production source `f3be36c7b195c3743df4d8213734d72908fed7e5`, reviewed dependency HEAD `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d` | `packages/domain-core/src/canonical-runtime-value.test.ts` and literal A TLV bytes produced through its public capture/serialize contract | `ACCEPTED` | `B-C01_RAW_COPY_BOUNDARY`, `B-C02_RAW_TLV_HASH`, `B-C03_CANONICAL_VALUE_HASH`, `B-C05_ROLE_DOMAIN_SEPARATION`, `B-C12_PLATFORM_VECTOR_READINESS` | `NONE` |
| `SUP-2B20B-P2F1R-B-002` | pre-existing application fingerprint implementation at repair base `e3ee23c2f84df194936b76f91420872dd8dd4aa0` | `packages/application/src/command-fingerprint.test.ts` | `LEGACY` | `B-C11_LEGACY_ISOLATION` | `NONE` |

## Supporting regression gates

The B focused test is primary evidence for these twelve criteria.

The following are supporting regressions only:

- `packages/domain-core/src/canonical-runtime-value.test.ts` proves the frozen
  A producer remains unchanged and functional.
- `packages/application/src/command-fingerprint.test.ts` proves B did not
  migrate or reinterpret the legacy application fingerprint.
- the repository typecheck and lint prove additive type/module compatibility.

No supporting test becomes a B primary identity.

## Evidence exclusions

This local implementation does not claim:

- hosted CI;
- coverage-profile or ownership evidence;
- Windows/Linux dual-platform execution;
- publication or accepted-main status;
- event, replay, state, snapshot, application, role, Dreamer, impairment, or
  authority behavior.

Those exclusions remain D or later-slice scope.

## Terminal state

```text
traceabilityStatus=REPAIR_ROUND_1_IMPLEMENTED_LOCALLY
criterionCount=12
actualTestCount=12
mechanismMatchPassCount=12
mechanismMatchFailCount=0
R1PrimarySet=[]
R2PrimarySet=[]
implementationAuthorized=true_B_ONLY
publicationAuthorized=false
P2F1R_C_Started=false
P2F1R_D_Started=false
P2FStarted=false
requiredNextAction=RUN_LOCAL_GATES_THEN_INDEPENDENT_READ_ONLY_IMPLEMENTATION_REVIEW
```
