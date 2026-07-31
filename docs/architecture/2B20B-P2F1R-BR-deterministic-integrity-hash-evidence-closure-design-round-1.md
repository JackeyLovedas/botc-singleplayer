# Phase 3 Slice 2B20B-P2F1R-BR: Deterministic Integrity Hash Evidence Closure Design Round 1

## 1. Metadata

- `authorization`: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_BR_EVIDENCE_ONLY_DESIGN_ROUND_1_ONLY`
- `sliceId`: `2B20B-P2F1R-BR`
- `designRound`: `1 / 1`
- `sliceKind`: `EVIDENCE_ONLY_TEST_AND_TRACEABILITY_CLOSURE`
- `currentHead`: `d8a10ca2df3552033f8185b81a51e25a65c41216`
- `branch`: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`
- `parentSlice`: `2B20B-P2F1R-B`
- `parentDesign`: `docs/architecture/2B20B-P2F1R-B-deterministic-integrity-hash-design-round-1.md`
- `parentDesignSha256`: `2e7d909af750b3a97e6a39484b635ee69acc7f6f78c09f69f1f63217fd29cf34`
- `parentCorrection`: `docs/architecture/2B20B-P2F1R-B-deterministic-integrity-hash-design-correction-round-1.md`
- `parentCorrectionSha256`: `0efc46a07e7917bf92d446dfd668d8585a144ff9088605a102884d6bb5e81658`
- `repairRound`: `2 / 2 EXHAUSTED`
- `currentReview`: `CODE_REVIEW_FIX_REQUIRED`
- `remainingBlockers`:
  - `B-R2-F01_FAILURE_CONTEXT_MATRIX_STILL_COLLAPSES_REQUIRED_VARIANTS`
  - `B-R2-F02_BC05_MECHANISM_MATCH_REMAINS_FALSE`
- `ruleSemanticsChanged`: `false`
- `productionBehaviorChanged`: `false`
- `implementationAuthorized`: `false`
- `publicationAuthorized`: `false`

BR closes evidence granularity omitted by the aggregate `B-C05` and `B-C08` physical tests. The parent design and correction remain the sole behavioral authority. BR adds no BOTC rule claim, production repair, or Repair Round 3.

## 2. Objective and immutable behavior

A later, separately authorized sole writer may only:

1. split the existing B-C05 evidence into two named physical tests;
2. split the existing B-C08 evidence into two named physical tests;
3. add the literal-vector and hostile-context assertions frozen below;
4. replace the two parent implementation bindings with four child bindings while retaining explicit parent-to-child completion mapping.

The following remain byte-for-byte and semantically immutable:

- all three hash domains;
- `CanonicalHashPreimageV1`;
- `FutureBindingEnvelopeV1`;
- SHA-256 and lowercase hexadecimal digest behavior;
- public creation and verification APIs;
- result and failure unions;
- failure code, phase, input-kind, fail-closed profile, and precedence;
- B's non-authority and cache-only boundaries.

All assertions use existing public wrappers or read-only, narrowly scoped inspection of the existing production source. No implementation is authorized by this design.

## 3. Parent-child completion mapping

| Parent historical criterion | Child criteria | Exact completion rule |
|---|---|---|
| `B-C05_ROLE_DOMAIN_SEPARATION` | `B-C05a`, `B-C05b` | Complete iff both children have semantically valid `MechanismMatch=PASS`. B-C05a proves the literal envelope/domain/preimage vector; B-C05b proves public future-binding integrity and mutation rejection. |
| `B-C08_FAILURE_PRECEDENCE` | `B-C08a`, `B-C08b` | Complete iff both children have semantically valid `MechanismMatch=PASS`. B-C08a proves byte admission/copy contexts; B-C08b proves record, metadata, preimage, digest, verification, and precedence contexts. |

The parent identifiers are retained as historical design authority and summary nodes. They are not deleted, rewritten as children, or double-counted as new physical tests. `B-C01` through `B-C04`, `B-C06`, `B-C07`, and `B-C09` through `B-C12` remain unchanged.

## 4. Traceability V1.1 child criteria

Each child preserves the exact nine-field contract.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `B-C05a` | Binding Envelope and Preimage Vector Contract: the frozen pair has exactly one ordered `FutureBindingEnvelopeV1`, future-binding domain frame, full `CanonicalHashPreimageV1`, and SHA-256 digest. | Literal component bytes, binding header/version, both u64 lengths, complete envelope, complete domain frame, complete preimage, lengths, and digest match Section 5; independent SHA-256 recomputation matches. | One literal-vector physical test using fixed bytes and independent `node:crypto`; assert every boundary and exact concatenation, not only the public record. | `R4` | `T3` | `PURE_POLICY_SEAM` | Exact 83-byte envelope, 264-byte preimage, and literal digest with metadata-before-payload order and V1 versions. | Parent B design/correction are contract authority; frozen A literals are setup only through existing `SUP-2B20B-P2F1R-B-001`; no provenance/history authority. |
| `B-C05b` | Future Binding Integrity Vector Contract: public creation and verification bind the exact two ordered opaque components, envelope, domain, versions, lengths, frame, and digest without semantic authority. | The literal vector succeeds; metadata-byte, payload-byte, component-order, binding-version, envelope-length, outer-frame-length, domain, and digest mutations fail or produce the contract-required distinct digest. | One public-wrapper mutation matrix rooted in B-C05a; every mutation asserts the exact record or frozen failure triple and preserves left-to-right order. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Only the exact V1 ordered pair verifies; all component, envelope, frame, domain, version, and digest deviations fail closed. | B-C05a is supporting evidence only; B-C04 and B-C07 remain separate primaries; invent no `SUP-*` ID. |
| `B-C08a` | Byte Admission Contexts: every public byte position enforces hostile-safe admission, private copy, size, mutation isolation, and first-failure behavior. | All forceable byte families and all public positions in Section 6 are covered; later arguments are not inspected; caller mutation cannot alter the result; safely unforceable copy branches are static-only. | One table-driven public-wrapper matrix plus Proxy-trap counters, mutation isolation, and narrowly scoped source assertions for allocation/copy catches. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Exact FC-A three-field failure or isolated private bytes, with zero caller-controlled behavior and no partial artifact. | Parent correction Sections 4.2/4.3; Node typed-array/Proxy behavior is setup only; invent no support ID. |
| `B-C08b` | Verification Failure Contexts: every stored-record, metadata, preimage, digest, and comparison context returns its correction-authorized first failure without later work. | Section 7 covers invalid record classes, each length field/category, direct and future mismatches, digest mutation, precedence compounds, and static-only unforceable construction/hash branches. | One table-driven public verification matrix with exact triples, descriptor/Proxy counters, explicit compounds, and narrowly scoped source assertions only where safe runtime forcing is impossible. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Exact first FC-B/FC-C/FC-D/FC-E three-field failure; no throw, disclosure, partial result, later access, or authority. | Parent correction Sections 4/7; B-C05a may support positive setup; no external rule or invented support ID. |

`R1PrimarySet=[]` and `R2PrimarySet=[]` remain frozen.

## 5. Frozen future-binding literal vector

The B-C05a vector is exact lowercase hexadecimal:

```text
bindingMetadataTlvBytes = 424f54434352562b303100
boundPayloadTlvBytes    = 424f54434352562b303102
bindingVersion          = botc-future-binding-envelope-v1
envelopeHex             = 424f54434352422b30310000001f626f74632d6675747572652d62696e64696e672d656e76656c6f70652d7631000000000000000b424f54434352562b303100000000000000000b424f54434352562b303102
envelopeByteLength      = 83
domain                  = FUTURE_BINDING_INTEGRITY
domainFrameHex          = 424f54434352482b303100000031626f74632d63616e6f6e6963616c2d72756e74696d652d696e746567726974792d7368613235362d6672616d65642d7631000000184655545552455f42494e44494e475f494e54454752495459000000075348412d323536
fullPreimageHex         = 424f54434352482b303100000031626f74632d63616e6f6e6963616c2d72756e74696d652d696e746567726974792d7368613235362d6672616d65642d7631000000184655545552455f42494e44494e475f494e54454752495459000000075348412d3235360000001f626f74632d63616e6f6e6963616c2d72756e74696d652d76616c75652d763100000020626f74632d63616e6f6e6963616c2d72756e74696d652d746c762d62652d76310000000000000053424f54434352422b30310000001f626f74632d6675747572652d62696e64696e672d656e76656c6f70652d7631000000000000000b424f54434352562b303100000000000000000b424f54434352562b303102
framedPreimageByteLength = 264
digestHex               = 02e73017cc61bb6c2040bf845b2547d8b54090523b422d6ec6521087beacca3a
```

The physical test must independently assert:

- `BindingHeader || BindingVersion || MetadataLength || MetadataPayload || BoundPayloadLength || BoundPayload`;
- metadata-before-payload ordering;
- binding, hash-protocol, A value, and A serialization V1 versions;
- the future-binding domain and complete domain frame;
- the u64 envelope length and full outer preimage;
- independent SHA-256 output.

B-C05b must cover independent mutation of both component bytes, swapped components, binding-version mutation, all four future length fields, supported-wrong and unsupported domains, valid-but-wrong digest, and malformed digest text.

## 6. Complete B-C08a callable context inventory

For every forceable family below, exercise every applicable public position:

- `null` and representative nonobject;
- Proxy and revoked Proxy;
- wrong typed-array view, `DataView`, and `ArrayBuffer`;
- Node `Buffer`;
- `Uint8Array` subclass and forbidden prototype;
- `SharedArrayBuffer` backing;
- detached buffer;
- oversized input.

The eight public positions are:

1. raw create payload;
2. raw verify payload after a valid stored record;
3. canonical-value create payload;
4. canonical-value verify payload after a valid stored record;
5. future create binding-metadata bytes;
6. future create bound-payload bytes;
7. future verify binding-metadata bytes after a valid record;
8. future verify bound-payload bytes after a valid record.

Expected runtime codes remain exactly `INVALID_BYTE_INPUT`, `PROXY_BYTE_INPUT`, `WRONG_BYTE_VIEW`, `SHARED_BYTE_BUFFER`, `DETACHED_BYTE_BUFFER`, or `BYTE_INPUT_TOO_LARGE`, with the parent phase/input-kind mapping. Trap counters prove no Proxy trap and no later argument inspection. Mutation after successful creation must not alter stored digest or lengths.

`BYTE_COPY_ALLOCATION_FAILED` and `BYTE_COPY_FAILED` are static-only. Bind each exact catch branch and FC-A triple for both `TLV_BYTES` and `BINDING_METADATA`. Production hooks, captured-intrinsic monkey-patching, and source-only substitution for a forceable case are forbidden.

## 7. Complete B-C08b callable verification inventory

Runtime coverage must include:

- invalid stored candidates: `null`, `undefined`, boolean, number, bigint, string, symbol, and function;
- Proxy and revoked Proxy with zero installed traps;
- array, exotic built-in, class instance, and ordinary object with forbidden custom prototype as distinct nonplain classes;
- symbol, missing, extra, accessor, non-enumerable, and wrong-type fields in each correction input-kind bucket;
- all domain, algorithm, hash-protocol, A value-version, A serialization-version, binding-version, digest-encoding, digest-length, digest-character, and valid-but-wrong-digest cases;
- each direct length field (`payloadByteLength`, `framedPreimageByteLength`) and each future length field (`bindingMetadataTlvByteLength`, `boundPayloadTlvByteLength`, `payloadByteLength`, `framedPreimageByteLength`) crossed with wrong runtime type, `NaN`, positive/negative infinity, negative, fractional, and greater-than-`Number.MAX_SAFE_INTEGER`;
- direct admitted-payload length mismatch and recomputed outer-frame mismatch;
- future metadata-component, bound-payload-component, envelope/payload, and complete outer-frame length mismatch;
- equal-length byte mutation for direct payload and independently for both future components, reaching `DIGEST_MISMATCH` only after structural gates;
- compound cases proving parent correction Section 7 precedence with zero later getter, Proxy, or hash activity.

Wrong runtime type yields `INVALID_RECORD_FIELD_TYPE`; invalid numeric domains yield `INVALID_METADATA_LENGTH`. Runtime assertions preserve the correction's exact phase, input kind, and these fail-closed profiles:

- `FC-B_RECORD_REJECT`: reject hostile record/metadata before byte admission or hashing;
- `FC-C_PREIMAGE_REJECT`: discard inputs and partial frames before SHA-256;
- `FC-D_DIGEST_REJECT`: discard preimage/digest state without partial output;
- `FC-E_VERIFY_REJECT`: compare all positions, then reject without success or authority.

## 8. Direct versus static-only evidence

All forceable behavior above must be tested through public wrappers. Static source evidence is permitted only for:

- failed-safe ordinary-record reflection catches after Proxy rejection: prototype, own-key, and descriptor acquisition;
- `BYTE_COPY_ALLOCATION_FAILED` and `BYTE_COPY_FAILED`;
- `ARITHMETIC_OVERFLOW`;
- `BINDING_ALLOCATION_FAILED`;
- `FRAME_ALLOCATION_FAILED`;
- `INTERNAL_HASH_FAILURE`;
- the structural all-position digest-comparison loop.

Static assertions must scope the exact function/catch, bind the exact code/phase/inputKind/profile, and prove absence of `__test`, `testHook`, `forceFailure`, `injectFailure`, `mockHash`, or equivalent seams. If review requires runtime injection for any static-only branch, stop; do not add a hook or modify production.

## 9. Physical tests and MechanismMatch

The future implementation creates exactly these four physical titles in the existing B test file:

1. `B-C05a Binding Envelope and Preimage Vector Contract`
2. `B-C05b Future Binding Integrity Vector Contract`
3. `B-C08a Byte Admission Contexts`
4. `B-C08b Verification Failure Contexts`

The old aggregate B-C05 and B-C08 physical titles cease to be actual test identities, but their parent criteria remain in history and the parent-child table. Assertions move without weakening.

Each physical identity has exactly one primary layer. Supporting assertions do not create a second primary. `MechanismMatch=PASS` is permitted only after the actual title, entry, fault mechanism, main assertion, reachability, trust, and primary layer semantically prove the child's completion criterion. Missing, collapsed, static-only-for-forceable, or D-substituted evidence remains `MechanismMatch=FAIL`.

Criterion accounting is ten unchanged leaf criteria plus four children: fourteen physical primary criteria. The two parent summary nodes are not double-counted.

## 10. B and D evidence boundary

B/BR owns:

- literal hash-envelope, domain-frame, preimage, and digest vectors;
- public creation, verification, mutation, hostile input, and precedence behavior evidence;
- complete callable-context and honest static-only branch mapping;
- B test identities and B implementation traceability.

Future D owns only supporting publication closure:

- ownership registration and totals;
- coverage profiles;
- hosted exact-head CI;
- Windows/Linux cross-platform execution;
- workflow routing and publication;
- resolvable supporting-authority publication.

D may not become a B child primary, replace a missing B assertion, change a B primary layer, or manufacture `MechanismMatch=PASS`.

## 11. Future allowlist and hard denylist

After separate implementation authorization, the allowlist is exactly:

- `packages/domain-core/src/canonical-runtime-hash.test.ts`;
- `docs/implementation/phase-3-slice-2b20b-p2f1r-b-test-traceability.md`.

This design round additionally permits only this BR design document. A later, separately authorized independent review may create one BR design-review document.

The hard denylist includes:

- `packages/domain-core/src/canonical-runtime-hash.ts`;
- every other production file and every A file;
- parent B design/correction;
- package exports, dependencies, configs, and scripts;
- C, D, parent P2F, events, state, replay, snapshot, history, and authority;
- workflows, ownership records, coverage profiles, and role coverage;
- Repair Round 3.

## 12. Validation and independent review

The independent BR reviewer must verify:

1. exact HEAD and the two parent SHA-256 values;
2. all four nine-field rows and their exact primary classifications;
3. both-child completion for each retained parent;
4. independent envelope, domain-frame, full-preimage, and digest recomputation;
5. every listed byte, record, length, direct, and future callable context;
6. static-only use is confined to genuinely unforceable branches and adds no hook;
7. failure triples, profiles, precedence, and all B behavior are unchanged;
8. D remains supporting-only and R1/R2 remain empty;
9. allowlist/denylist exclude production, Repair 3, C, D, and P2F;
10. architecture/review caused no GitHub, code, or test mutation.

The reviewer returns exactly `RULE_DESIGN_PASS`, `RULE_DESIGN_FIX_REQUIRED`, or `HUMAN_BLOCKED`. Even `RULE_DESIGN_PASS` leaves implementation unauthorized until fresh explicit authorization.

## 13. Stop-loss and rollback

Stop with `HUMAN_BLOCKED` rather than reinterpret if:

- any literal fails independent recomputation;
- any B byte, API, failure, profile, or precedence behavior must change;
- a forceable required context cannot be proven through public wrappers;
- evidence requires a production hook, intrinsic replacement, or `canonical-runtime-hash.ts` edit;
- one physical identity requires two primary layers;
- D must become primary;
- an unchanged criterion changes;
- Repair 3, C, D, or P2F enters scope.

Before publication, rollback is deletion/reversion only of the two future implementation allowlist edits and BR documents. Any out-of-allowlist diff invalidates the round rather than expanding rollback scope.

## 14. Terminal controls

```text
designStatus=READY_FOR_INDEPENDENT_BR_DESIGN_REVIEW
implementationAuthorized=false
productionCodeChanged=false
productionBehaviorChanged=false
parentBBehaviorChanged=false
repairRound3Created=false
parentCriteriaSplit=[B-C05=>B-C05a+B-C05b,B-C08=>B-C08a+B-C08b]
childCriterionCount=4
R1PrimarySet=[]
R2PrimarySet=[]
P2F1R_C_Started=false
P2F1R_D_Started=false
P2FStarted=false
commitCreated=false
pushPerformed=false
PRCreated=false
CIrerunPerformed=false
requiredNextAction=RUN_ONE_FRESH_INDEPENDENT_READ_ONLY_BR_DESIGN_REVIEW;DO_NOT_IMPLEMENT
```

READY_FOR_INDEPENDENT_BR_DESIGN_REVIEW
