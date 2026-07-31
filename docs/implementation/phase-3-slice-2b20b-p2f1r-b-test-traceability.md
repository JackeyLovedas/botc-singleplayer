# Phase 3 Slice 2B20B-P2F1R-B Test Traceability

## Metadata

- `sliceId`: `2B20B-P2F1R-B`
- `authorization`:
  `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_B_IMPLEMENTATION_ONLY`
- `repairAuthorization`:
  `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_B_IMPLEMENTATION_REPAIR_ROUND_2_ONLY`
- `evidenceClosureAuthorization`:
  `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_BR_EVIDENCE_ONLY_IMPLEMENTATION_ONLY`
- `repairRound`: `2 / 2`
- `repairBase`: `5ff914228c65f60ca804d0fb96e00d73a0408050`
- `sourceDesign`:
  `docs/architecture/2B20B-P2F1R-B-deterministic-integrity-hash-design-round-1.md`
- `sourceDesignSha256`:
  `2e7d909af750b3a97e6a39484b635ee69acc7f6f78c09f69f1f63217fd29cf34`
- `designCorrection`:
  `docs/architecture/2B20B-P2F1R-B-deterministic-integrity-hash-design-correction-round-1.md`
- `designCorrectionSha256`:
  `0efc46a07e7917bf92d446dfd668d8585a144ff9088605a102884d6bb5e81658`
- `designVerdict`: `RULE_DESIGN_PASS`
- `evidenceClosureDesign`:
  `docs/architecture/2B20B-P2F1R-BR-deterministic-integrity-hash-evidence-closure-design-round-1.md`
- `evidenceClosureDesignSha256`:
  `6f0d0382964c9bab1636d081c3352e8331e5edd0c48a92fd932ff7ab98cb6277`
- `AInputCommit`: `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`
- `AProductionProvenance`: `f3be36c7b195c3743df4d8213734d72908fed7e5`
- `productionFile`: `packages/domain-core/src/canonical-runtime-hash.ts`
- `testFile`: `packages/domain-core/src/canonical-runtime-hash.test.ts`
- `implementationAuthorized`: `true / B_COMPONENT_ONLY`
- `publicationAuthorized`: `false`
- `R1PrimarySet`: `[]`
- `R2PrimarySet`: `[]`
- `physicalCriterionCount`: `14`
- `historicalParentSummaryCount`: `2`

## Actual test inventory

All physical tests are in
`packages/domain-core/src/canonical-runtime-hash.test.ts`.

1. `B-C01_RAW_COPY_BOUNDARY admits exact Uint8Array bytes and rejects hostile views`
2. `B-C02_RAW_TLV_HASH matches exact raw known-answer vectors`
3. `B-C03_CANONICAL_VALUE_HASH consumes A bytes without calling A internally`
4. `B-C04_FUTURE_BINDING_HASH binds two ordered opaque byte sequences`
5. `B-C05a Binding Envelope and Preimage Vector Contract`
6. `B-C05b Future Binding Integrity Vector Contract`
7. `B-C06_RESULT_METADATA rejects hostile exact-shape and metadata mutations`
8. `B-C07_DIGEST_VERIFICATION detects bytes, domains, encoding and digest mutation`
9. `B-C08a Byte Admission Contexts`
10. `B-C08b Verification Failure Contexts`
11. `B-C09_HASH_NOT_AUTHORITY exposes integrity records rather than authority handles`
12. `B-C10_CACHE_ONLY contains no snapshot, rebuild, replay or state capability`
13. `B-C11_LEGACY_ISOLATION remains source-local and does not import application hashing`
14. `B-C12_PLATFORM_VECTOR_READINESS is deterministic for Unicode and newline A bytes`

## Traceability V1.1 matrix

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement | ActualTest | ActualBinding | ActualTestFile | ActualTestTitle | ActualPrimaryLayer | ActualReachability | ActualTrust | SupportingAuthorityId | MechanismMatch |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `B-C01_RAW_COPY_BOUNDARY` | Every byte input is admitted without caller behavior and copied once to private storage | null/nonobject, Proxy, revoked Proxy, wrong view, Buffer, subclass, nonstandard prototype, shared, detached, oversized, and mutation cases fail or remain isolated; platform-only allocation/copy failures retain reviewed exception boundaries | hostile public-wrapper matrix plus static source review for unreachable allocation/copy branches; no test hook | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact private copy or closed failure, zero installed Proxy traps, no retained caller view | A maximum size and Node typed-array/Proxy runtime behavior are supporting authority | `B-C01_RAW_COPY_BOUNDARY admits exact Uint8Array bytes and rejects hostile views` | All three public create wrappers and both future-binding byte positions reject hostile inputs without coercion; mutation-isolation and static allocation/copy branches are bound in B-C01/B-C08. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C01_RAW_COPY_BOUNDARY admits exact Uint8Array bytes and rejects hostile views` | `STRUCTURAL_VALIDATION` | `R3` | `T1` | `SUP-2B20B-P2F1R-B-001` | `PASS` |
| `B-C02_RAW_TLV_HASH` | Raw role binds exact copied bytes under its frozen domain | literal vectors match; a one-byte change changes verification; no A provenance is claimed | public raw wrapper and literal known-answer vectors, with A serialization used only outside B for positive setup | `R4` | `T1` | `PURE_POLICY_SEAM` | exact raw-role record and digest | frozen A bytes/version contract is setup authority only | `B-C02_RAW_TLV_HASH matches exact raw known-answer vectors` | Literal raw-domain records and verification bind supplied bytes only. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C02_RAW_TLV_HASH matches exact raw known-answer vectors` | `PURE_POLICY_SEAM` | `R4` | `T1` | `SUP-2B20B-P2F1R-B-001` | `PASS` |
| `B-C03_CANONICAL_VALUE_HASH` | Canonical-value role is deterministic and distinct while consuming bytes only | equal supplied A TLV bytes match; unequal bytes differ; B never accepts a token or calls A | external A setup followed by public B byte-only wrapper and literal vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | exact canonical-value-role record without provenance claim | frozen A token/TLV flow is supporting setup outside B | `B-C03_CANONICAL_VALUE_HASH consumes A bytes without calling A internally` | Repeated A-produced bytes yield identical records; source audit rejects capture, backing, and serialization calls inside B. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C03_CANONICAL_VALUE_HASH consumes A bytes without calling A internally` | `PURE_POLICY_SEAM` | `R4` | `T1` | `SUP-2B20B-P2F1R-B-001` | `PASS` |
| `B-C04_FUTURE_BINDING_HASH` | Future binding binds two ordered opaque byte sequences without semantic authority | equal pairs match; component, order, byte, and binding-version mutations fail or differ | public binding wrapper and literal nested-envelope vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | exact binding-integrity record only | future semantic owner remains external and unimplemented | `B-C04_FUTURE_BINDING_HASH binds two ordered opaque byte sequences` | Exact future-binding record, order sensitivity, and positive verification bind the two copied components. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C04_FUTURE_BINDING_HASH binds two ordered opaque byte sequences` | `PURE_POLICY_SEAM` | `R4` | `T1` | `NONE` | `PASS` |
| `B-C05a` | Binding Envelope and Preimage Vector Contract: the frozen pair has exactly one ordered `FutureBindingEnvelopeV1`, future-binding domain frame, full `CanonicalHashPreimageV1`, and SHA-256 digest | literal component bytes, binding header/version, both u64 lengths, complete envelope, complete domain frame, complete preimage, lengths, and digest match the BR design; independent SHA-256 recomputation matches | one literal-vector physical test using fixed bytes and independent `node:crypto`; assert every boundary and exact concatenation, not only the public record | `R4` | `T3` | `PURE_POLICY_SEAM` | exact 83-byte envelope, 264-byte preimage, and literal digest with metadata-before-payload order and V1 versions | parent B design/correction are contract authority; frozen A literals are setup only through `SUP-2B20B-P2F1R-B-001`; no provenance/history authority | `B-C05a Binding Envelope and Preimage Vector Contract` | Reconstructs the exact binding envelope, domain frame, full preimage and independent SHA-256 digest from frozen literal bytes, then binds that digest and all lengths to the real public future-binding create result. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C05a Binding Envelope and Preimage Vector Contract` | `PURE_POLICY_SEAM` | `R4` | `T3` | `SUP-2B20B-P2F1R-B-001` | `PASS` |
| `B-C05b` | Future Binding Integrity Vector Contract: public creation and verification bind the exact two ordered opaque components, envelope, domain, versions, lengths, frame, and digest without semantic authority | literal vector succeeds; metadata-byte, payload-byte, component-order, binding-version, envelope-length, outer-frame-length, domain, and digest mutations fail or produce the contract-required distinct digest | one public-wrapper mutation matrix rooted in B-C05a; every mutation asserts the exact record or frozen failure triple and preserves left-to-right order | `R3` | `T1` | `STRUCTURAL_VALIDATION` | only the exact V1 ordered pair verifies; all component, envelope, frame, domain, version, and digest deviations fail closed | B-C05a is supporting evidence only; B-C04 and B-C07 remain separate primaries; no new `SUP-*` ID | `B-C05b Future Binding Integrity Vector Contract` | Uses only public create/verify wrappers to prove repeat determinism, both component mutations, swapped order, binding/hash-version separation, all four future length gates, supported-wrong/unsupported domain separation, valid-but-wrong digest, and malformed digest text. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C05b Future Binding Integrity Vector Contract` | `STRUCTURAL_VALIDATION` | `R3` | `T1` | `NONE` | `PASS` |
| `B-C06_RESULT_METADATA` | Stored records have exact closed shape and deterministic metadata | missing, extra, symbol, accessor, non-enumerable, wrong-type, false-length, wrong-algorithm, and wrong-version candidates reject in precedence order | hostile public verification record matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact closed failure or fully validated record | no external supporting authority | `B-C06_RESULT_METADATA rejects hostile exact-shape and metadata mutations` | Closed record shape, descriptor-safe admission, versions, lengths, symbols, and zero-getter behavior are exercised through public verification. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C06_RESULT_METADATA rejects hostile exact-shape and metadata mutations` | `STRUCTURAL_VALIDATION` | `R3` | `T1` | `NONE` | `PASS` |
| `B-C07_DIGEST_VERIFICATION` | Verification recomputes instead of trusting stored metadata or digest | valid records verify; byte, domain, version, length, encoding, and digest mutations reject | public verification matrix with known-answer positives | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `matchesExactBytes:true` or one closed failure | known-answer vectors support positive cases | `B-C07_DIGEST_VERIFICATION detects bytes, domains, encoding and digest mutation` | Direct and future-binding positives recompute; raw bytes, future metadata, future payload, domain, version, component length, digest encoding, digest text, and valid-but-wrong digest mutations reject. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C07_DIGEST_VERIFICATION detects bytes, domains, encoding and digest mutation` | `STRUCTURAL_VALIDATION` | `R3` | `T1` | `NONE` | `PASS` |
| `B-C08a` | Byte Admission Contexts: every public byte position enforces hostile-safe admission, private copy, size, mutation isolation, and first-failure behavior | every forceable byte family is exercised at all eight create/verify positions; later arguments are not inspected; caller mutation cannot alter the record; safely unforceable copy branches are static-only | one table-driven public-wrapper matrix plus Proxy-trap counters, mutation isolation, and narrowly scoped source assertions for allocation/copy catches | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact FC-A three-field failure or isolated private bytes, with zero caller-controlled behavior and no partial artifact | parent correction byte-admission contract; no new supporting authority | `B-C08a Byte Admission Contexts` | Exercises null/nonobject, Proxy/revoked Proxy, Uint16Array, DataView, ArrayBuffer, Buffer, subclass, forbidden prototype, SharedArrayBuffer, detached and oversized input across all eight public byte positions; proves zero traps, left-to-right short-circuit, mutation isolation and exact static copy-failure branches. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C08a Byte Admission Contexts` | `STRUCTURAL_VALIDATION` | `R3` | `T1` | `NONE` | `PASS` |
| `B-C08b` | Verification Failure Contexts: every stored-record, metadata, preimage, digest, and comparison context returns its correction-authorized first failure without later work | invalid record classes, all field buckets, every direct/future length field and category, direct/future mismatches, equal-length mutations, precedence compounds, and static-only construction/hash branches are covered | one table-driven public verification matrix with exact triples, descriptor/Proxy counters, explicit compounds, and narrowly scoped source assertions only where safe runtime forcing is impossible | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact first FC-B/FC-C/FC-D/FC-E three-field failure; no throw, disclosure, partial result, later access, or authority | parent correction failure matrix; B-C05a is positive setup only; no new supporting authority | `B-C08b Verification Failure Contexts` | The 34-code executable matrix is supplemented by every primitive invalid record, revoked/zero-trap Proxy, four distinct nonplain classes, all three field input-kind buckets, all six length fields crossed with wrong type and six invalid-number classes, each recomputed length mismatch, three equal-length byte mutations, compound precedence counters, reflection catches and the fixed 32-position comparison loop. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C08b Verification Failure Contexts` | `STRUCTURAL_VALIDATION` | `R3` | `T1` | `NONE` | `PASS` |
| `B-C09_HASH_NOT_AUTHORITY` | Integrity evidence cannot issue state/history/replay authority | exports and result shapes contain no token, issuer, registry, approval, accepted-source, or authority capability | source/export/result-shape inspection plus self-consistent caller-created control | `R4` | `T3` | `PURE_POLICY_SEAM` | integrity evidence only | later P2F authority remains separately required | `B-C09_HASH_NOT_AUTHORITY exposes integrity records rather than authority handles` | Result and source deny authority, token, issuer, accepted-history and state-handle capabilities. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C09_HASH_NOT_AUTHORITY exposes integrity records rather than authority handles` | `PURE_POLICY_SEAM` | `R4` | `T3` | `NONE` | `PASS` |
| `B-C10_CACHE_ONLY` | Snapshot-shaped bytes remain non-authoritative cache data | no snapshot/state semantic API, hash role, rebuild, comparison, repair, selection, or authority exists | source and allowlist inspection plus generic binding control | `R4` | `T3` | `PURE_POLICY_SEAM` | generic byte-integrity result only | replay and state owners remain outside B | `B-C10_CACHE_ONLY contains no snapshot, rebuild, replay or state capability` | Source denylist proves B has no snapshot, replay, rebuild, event, state-hash or authority surface. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C10_CACHE_ONLY contains no snapshot, rebuild, replay or state capability` | `PURE_POLICY_SEAM` | `R4` | `T3` | `NONE` | `PASS` |
| `B-C11_LEGACY_ISOLATION` | B is additive and does not migrate existing hashes | A and application fingerprint files remain byte-identical; B has no alias, import, reinterpretation, or package-root export | changed-file denylist, source inspection, and unchanged regression execution | `R4` | `T3` | `PURE_POLICY_SEAM` | no migration or legacy behavior change | existing regressions are supporting evidence only | `B-C11_LEGACY_ISOLATION remains source-local and does not import application hashing` | B source denies application/fingerprint/JSON coupling; unchanged command-fingerprint regression is supporting evidence. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C11_LEGACY_ISOLATION remains source-local and does not import application hashing` | `PURE_POLICY_SEAM` | `R4` | `T3` | `SUP-2B20B-P2F1R-B-002` | `PASS` |
| `B-C12_PLATFORM_VECTOR_READINESS` | Binary framing and known-answer vectors have no platform-dependent input | literals use ASCII, big-endian lengths, SHA-256, and fixed hex with no locale, time, environment, path, random, JSON, or platform branch | literal-vector audit and production-source determinism inspection | `R4` | `T3` | `PURE_POLICY_SEAM` | identical expected frames and digests | later D-owned Windows/Linux execution is planned supporting authority | `B-C12_PLATFORM_VECTOR_READINESS is deterministic for Unicode and newline A bytes` | Unicode, LF and CRLF literal vectors plus source determinism denylist prepare cross-platform evidence without claiming it. | `packages/domain-core/src/canonical-runtime-hash.test.ts` | `B-C12_PLATFORM_VECTOR_READINESS is deterministic for Unicode and newline A bytes` | `PURE_POLICY_SEAM` | `R4` | `T3` | `SUP-2B20B-P2F1R-B-001` | `PASS` |

## Historical parent-to-child completion

The two parent criteria remain historical design authority and summary nodes.
They are not physical test identities and are not counted in the fourteen
primary criteria.

| Historical parent | Child criteria | Completion rule | Actual closure |
|---|---|---|---|
| `B-C05_ROLE_DOMAIN_SEPARATION` | `B-C05a`, `B-C05b` | complete only when both child `MechanismMatch` values are `PASS` | `PASS`: `B-C05a=PASS`, `B-C05b=PASS` |
| `B-C08_FAILURE_PRECEDENCE` | `B-C08a`, `B-C08b` | complete only when both child `MechanismMatch` values are `PASS` | `PASS`: `B-C08a=PASS`, `B-C08b=PASS` |

## B-C08 failure diagnostic evidence matrix

The executable `FailureMatrixEntry` table and the two B-C08 child tests bind
every row below to the primary test named in the last column. B-C08a owns the
FC-A byte-admission rows across all eight public byte positions. B-C08b owns
FC-B through FC-E plus the complete callable context expansion. Runtime rows
invoke public wrappers and assert the exact frozen three-key failure. Safely
unforceable allocation, copy, arithmetic, and internal-hash rows bind exact
source branches without test hooks or intrinsic replacement.

| Code | Phase | InputKind | Branch location | Expected failure behavior | Primary test binding |
|---|---|---|---|---|---|
| `INVALID_BYTE_INPUT` | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` / `BINDING_METADATA` | `admitBytes/initial object gate` | `FC-A_BYTE_REJECT` | `B-C08a Byte Admission Contexts` |
| `PROXY_BYTE_INPUT` | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` / `BINDING_METADATA` | `admitBytes/safeIsProxy gate` | `FC-A_BYTE_REJECT` | `B-C08a Byte Admission Contexts` |
| `WRONG_BYTE_VIEW` | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` / `BINDING_METADATA` | `admitBytes/exact Uint8Array brand and backing gates` | `FC-A_BYTE_REJECT` | `B-C08a Byte Admission Contexts` |
| `SHARED_BYTE_BUFFER` | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` / `BINDING_METADATA` | `admitBytes/shared-backing gate` | `FC-A_BYTE_REJECT` | `B-C08a Byte Admission Contexts` |
| `DETACHED_BYTE_BUFFER` | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` / `BINDING_METADATA` | `admitBytes/private-source construction` | `FC-A_BYTE_REJECT` | `B-C08a Byte Admission Contexts` |
| `BYTE_INPUT_TOO_LARGE` | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` / `BINDING_METADATA` | `admitBytes/maximum-length gate` | `FC-A_BYTE_REJECT` | `B-C08a Byte Admission Contexts` |
| `BYTE_COPY_ALLOCATION_FAILED` | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` / `BINDING_METADATA` | `admitBytes/private-copy allocation catch` | `FC-A_BYTE_REJECT` | `B-C08a Byte Admission Contexts` |
| `BYTE_COPY_FAILED` | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` / `BINDING_METADATA` | `admitBytes/captured typed-array set failure` | `FC-A_BYTE_REJECT` | `B-C08a Byte Admission Contexts` |
| `INVALID_RECORD_TYPE` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/outer classification` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `PROXY_RECORD` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/Proxy identity gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `NONPLAIN_RECORD` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/plain-object gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `SYMBOL_RECORD_KEY` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/own-key gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `MISSING_RECORD_FIELD` | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` / `DIGEST_TEXT` / `BINDING_METADATA` | `admitRecord/required-key declaration order` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `EXTRA_RECORD_FIELD` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/extra-string-key gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `ACCESSOR_RECORD_FIELD` | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` / `DIGEST_TEXT` / `BINDING_METADATA` | `admitRecord/descriptor accessor gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `NONENUMERABLE_RECORD_FIELD` | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` / `DIGEST_TEXT` / `BINDING_METADATA` | `admitRecord/descriptor enumerability gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `INVALID_RECORD_FIELD_TYPE` | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` / `DIGEST_TEXT` / `BINDING_METADATA` | `admitRecord/closed field-type gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `UNSUPPORTED_DOMAIN` | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` | `admitRecord/domain allowlist` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `DOMAIN_MISMATCH` | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` | `admitRecord/wrapper-domain agreement` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `UNSUPPORTED_ALGORITHM` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/SHA-256 literal gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `UNSUPPORTED_HASH_PROTOCOL_VERSION` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/hash-protocol gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `UNSUPPORTED_CANONICAL_RUNTIME_VALUE_VERSION` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/A-value-version gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `UNSUPPORTED_CANONICAL_RUNTIME_SERIALIZATION_VERSION` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/A-serialization-version gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `UNSUPPORTED_BINDING_VERSION` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/future-binding-version gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `INVALID_METADATA_LENGTH` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `admitRecord/nonnegative-safe-integer gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `METADATA_LENGTH_MISMATCH` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `verifyDirect` / `verifyFutureBindingIntegrity` preimage length gates | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `INVALID_DIGEST_ENCODING` | `BINDING_METADATA_VALIDATION` | `DIGEST_TEXT` | `admitRecord/digest-encoding gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `INVALID_DIGEST_LENGTH` | `BINDING_METADATA_VALIDATION` | `DIGEST_TEXT` | `admitRecord/64-code-unit gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `INVALID_DIGEST_HEX` | `BINDING_METADATA_VALIDATION` | `DIGEST_TEXT` | `admitRecord/lowercase-ASCII-hex gate` | `FC-B_RECORD_REJECT` | `B-C08b Verification Failure Contexts` |
| `ARITHMETIC_OVERFLOW` | `HASH_PREIMAGE_BUILD` | `HASH_DOMAIN` / `BINDING_METADATA` | `checkedSum` called by `buildPreimage` / `buildBindingEnvelope` | `FC-C_PREIMAGE_REJECT` | `B-C08b Verification Failure Contexts` |
| `BINDING_ALLOCATION_FAILED` | `HASH_PREIMAGE_BUILD` | `BINDING_METADATA` | `buildBindingEnvelope/allocation-and-write catches` | `FC-C_PREIMAGE_REJECT` | `B-C08b Verification Failure Contexts` |
| `FRAME_ALLOCATION_FAILED` | `HASH_PREIMAGE_BUILD` | `HASH_DOMAIN` | `buildPreimage/allocation-and-write catches` | `FC-C_PREIMAGE_REJECT` | `B-C08b Verification Failure Contexts` |
| `INTERNAL_HASH_FAILURE` | `DIGEST_COMPUTATION` | `DIGEST_BYTES` | `digestPreimage/hash-and-copy catch or non-32-byte output` | `FC-D_DIGEST_REJECT` | `B-C08b Verification Failure Contexts` |
| `DIGEST_MISMATCH` | `DIGEST_VERIFICATION` | `DIGEST_BYTES` | `compareDigest/all-position comparison` | `FC-E_VERIFY_REJECT` | `B-C08b Verification Failure Contexts` |

## Supporting authority registry

| SupportingAuthorityId | Producer | SourceTestOrFixture | AuthorityStatus | UsedByCriteria | MutationDisposition |
|---|---|---|---|---|---|
| `SUP-2B20B-P2F1R-B-001` | P2F1R-A frozen local component, production source `f3be36c7b195c3743df4d8213734d72908fed7e5`, reviewed dependency HEAD `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d` | `packages/domain-core/src/canonical-runtime-value.test.ts` and literal A TLV bytes produced through its public capture/serialize contract | `ACCEPTED` | `B-C01_RAW_COPY_BOUNDARY`, `B-C02_RAW_TLV_HASH`, `B-C03_CANONICAL_VALUE_HASH`, `B-C05_ROLE_DOMAIN_SEPARATION` (historical parent), `B-C05a`, `B-C12_PLATFORM_VECTOR_READINESS` | `NONE` |
| `SUP-2B20B-P2F1R-B-002` | pre-existing application fingerprint implementation at repair base `e3ee23c2f84df194936b76f91420872dd8dd4aa0` | `packages/application/src/command-fingerprint.test.ts` | `LEGACY` | `B-C11_LEGACY_ISOLATION` | `NONE` |

## Supporting regression gates

The B focused test is primary evidence for fourteen physical criteria. The two
historical parent nodes close only through their respective child pairs.

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
traceabilityStatus=BR_EVIDENCE_ONLY_IMPLEMENTED_LOCALLY
physicalCriterionCount=14
historicalParentSummaryCount=2
actualTestCount=14
mechanismMatchPassCount=14
mechanismMatchFailCount=0
parentCompletion=[B-C05=>B-C05a+B-C05b:PASS,B-C08=>B-C08a+B-C08b:PASS]
R1PrimarySet=[]
R2PrimarySet=[]
implementationAuthorized=true_BR_EVIDENCE_ONLY
publicationAuthorized=false
repairRound3Created=false
P2F1R_C_Started=false
P2F1R_D_Started=false
P2FStarted=false
requiredNextAction=RUN_INDEPENDENT_READ_ONLY_BR_IMPLEMENTATION_REVIEW
```
