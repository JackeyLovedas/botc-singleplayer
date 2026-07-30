# Phase 3 Slice 2B20B-P2F1R-A Implementation Test Traceability

## Metadata

- slice: `2B20B-P2F1R-A`
- implementationStage: `INITIAL_LOCAL_IMPLEMENTATION`
- implementationCorrectionCount: `0`
- designAuthority: `docs/architecture/2B20B-P2F1R-A-canonical-runtime-capture-tlv-design-round-1.md`
- designAuthoritySha256: `b2b9098d5ace1ea53fbd5c6d40d8a8cbe012d449c42c2fc4d8fe5b180040108d`
- sequencingAuthority: `docs/architecture/2B20B-P2F1R-A-design-release-sequencing-correction-v1.md`
- sequencingAuthoritySha256: `39d495657b41a8d997589cd56e80def9c17d8f3eb80d876ecd037e7a0e79c463`
- designReleaseReview: `docs/architecture/2B20B-P2F1R-A-design-release-sequencing-correction-review-v1.md`
- designReleaseVerdict: `RULE_DESIGN_PASS`
- actualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- actualSemanticTestCount: `51`
- traceabilityCriterionCount: `15`
- R1PrimarySet: `[]`
- R2PrimarySet: `[]`
- publicationEvidenceStatus: `PENDING_FUTURE_P2F1R_D`

## Actual bindings

### A-C01_VALID_CAPTURE

- CriterionId: `A-C01_VALID_CAPTURE`
- RuleClaim: admitted generic values create one detached local token
- CompletionCriterion: every admitted scalar and container succeeds with exact value version and metrics
- RequiredEvidenceMechanism: direct public capture acceptance matrix
- ExpectedReachability: `R4`
- ExpectedTrust: `T1`
- ExpectedPrimaryLayer: `STRUCTURAL_VALIDATION`
- ExpectedResult: `{ok:true, valueVersion:"botc-canonical-runtime-value-v1"}` and issued token
- SupportingAuthorityRequirement: no external supporting authority
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C01 captures null and reports exact version and metrics`; `A-C01 captures both booleans as detached tokens`; `A-C01 captures safe integers excluding negative zero`; `A-C01 captures well-formed empty and non-empty strings`; `A-C01 captures dense arrays and plain records`; `A-C01 erases Object-prototype versus null-prototype record identity`
- ActualPrimaryLayer: `STRUCTURAL_VALIDATION`
- ActualReachability: `R4`
- ActualTrust: `T1`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: all six admitted value families capture successfully with exact version, occurrence metrics, detached token identity, and prototype erasure
- ProductionEntry: `captureCanonicalRuntimeValue`
- FaultMechanism: none; successful public T1 capture

### A-C02_PROXY_DESCRIPTOR

- CriterionId: `A-C02_PROXY_DESCRIPTOR`
- RuleClaim: Proxy and descriptor hostility never executes caller behavior
- CompletionCriterion: ordinary, revoked, throwing, nested Proxy and accessor/symbol cases reject with zero installed traps and getters
- RequiredEvidenceMechanism: direct hostile capture matrix with counters
- ExpectedReachability: `R3`
- ExpectedTrust: `T1`
- ExpectedPrimaryLayer: `STRUCTURAL_VALIDATION`
- ExpectedResult: `{ok:false}` with `PROXY_OR_DESCRIPTOR_FAILURE`, `ACCESSOR_PROPERTY`, or `SYMBOL_KEY` and no token
- SupportingAuthorityRequirement: Node 24.15.0 `util.types.isProxy` behavior is supporting runtime authority only
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C02 rejects an ordinary transparent Proxy with zero installed traps`; `A-C02 rejects a revoked Proxy with zero installed traps`; `A-C02 rejects nested and array-wrapped Proxies with zero installed traps`; `A-C02 converts throwing Proxy descriptor operations to fixed failure`; `A-C02 rejects getter and setter descriptors with zero invocations`; `A-C02 rejects symbol keys without reading sibling values`
- ActualPrimaryLayer: `STRUCTURAL_VALIDATION`
- ActualReachability: `R3`
- ActualTrust: `T1`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: Proxy identity is tested before reflection, all installed traps remain at zero, descriptors are validated before value reads, and accessors/symbol keys fail closed
- ProductionEntry: `captureCanonicalRuntimeValue`
- FaultMechanism: hostile Proxy, accessor descriptor, or symbol own key at the public unknown-input boundary

### A-C03_DOMAIN_REJECTION

- CriterionId: `A-C03_DOMAIN_REJECTION`
- RuleClaim: values outside the closed domain fail without substitution
- CompletionCriterion: every unsupported scalar, invalid number, lone surrogate, exotic, nonplain object, symbol value, and cycle returns its exact code
- RequiredEvidenceMechanism: direct rejected-domain matrix
- ExpectedReachability: `R3`
- ExpectedTrust: `T1`
- ExpectedPrimaryLayer: `STRUCTURAL_VALIDATION`
- ExpectedResult: `{ok:false}` with `UNSUPPORTED_TYPE`, `INVALID_NUMBER`, `UNSAFE_INTEGER`, `INVALID_UNICODE`, `SYMBOL_VALUE`, `NONPLAIN_OBJECT`, or `CYCLE`
- SupportingAuthorityRequirement: closed value-version contract only
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C03 rejects undefined at root, record value, and array element`; `A-C03 classifies invalid and unsafe numbers exactly`; `A-C03 rejects bigint, symbol value, and function`; `A-C03 rejects class instances and boxed primitives`; `A-C03 rejects exotic built-ins, buffers, views, typed arrays, and Promise`; `A-C03 rejects direct and nested cycles`; `A-C09 emits exact UTF-8 for valid supplementary-plane pairs`
- ActualPrimaryLayer: `STRUCTURAL_VALIDATION`
- ActualReachability: `R3`
- ActualTrust: `T1`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: every excluded runtime kind and both lone-surrogate forms return the frozen deterministic failure code without coercion or replacement
- ProductionEntry: `captureCanonicalRuntimeValue`
- FaultMechanism: unsupported primitive, invalid number/string, nonplain object, or ancestor-cycle detection

### A-C04_TOKEN_AUTHENTICATION

- CriterionId: `A-C04_TOKEN_AUTHENTICATION`
- RuleClaim: only the local WeakSet-issued token identity is accepted
- CompletionCriterion: primitive, null, Proxy, revoked Proxy, clone, spread, JSON result, cross-instance token, and lookalike fail without reads or traps
- RequiredEvidenceMechanism: direct hostile public serializer and internal-reader token-admission matrix
- ExpectedReachability: `R3`
- ExpectedTrust: `T1`
- ExpectedPrimaryLayer: `STRUCTURAL_VALIDATION`
- ExpectedResult: `{ok:false, diagnostic:{code:"INVALID_CAPTURE_TOKEN"}}`
- SupportingAuthorityRequirement: private WeakSet and WeakMap are implementation authority; no nominal brand
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C04 rejects primitive and null token candidates`; `A-C04 rejects Proxy and revoked-Proxy token candidates with zero traps`; `A-C04 rejects spread, JSON, structured clone, and shaped lookalikes`; `A-C04 rejects a token identity from a distinct module instance`
- ActualPrimaryLayer: `STRUCTURAL_VALIDATION`
- ActualReachability: `R3`
- ActualTrust: `T1`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: only the issuing module instance's exact token object authenticates through private WeakSet/WeakMap identity, with zero caller reflection
- ProductionEntry: `serializeCanonicalRuntimeValue`; `readCanonicalRuntimeBackingForStructuralValidation`
- FaultMechanism: non-object guard, missing WeakSet membership, or foreign module-instance token identity

### A-C05_BACKING_ISOLATION

- CriterionId: `A-C05_BACKING_ISOLATION`
- RuleClaim: capture retains no caller object and erases alias identity
- CompletionCriterion: post-capture mutation cannot change bytes; repeated references detach and count independently; token has no inspectable backing
- RequiredEvidenceMechanism: public capture, mutate, authenticate, and serialize isolation cases
- ExpectedReachability: `R4`
- ExpectedTrust: `T1`
- ExpectedPrimaryLayer: `STRUCTURAL_VALIDATION`
- ExpectedResult: issued frozen zero-key token and unchanged later serialization
- SupportingAuthorityRequirement: command-fingerprint immutable-capture behavior is precedent only
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C05 source mutation after capture does not change later bytes`; `A-C05 repeated acyclic aliases detach independently and count per occurrence`; `A-C05 token is null-prototype, zero-key, frozen and maps to deep-frozen backing`
- ActualPrimaryLayer: `STRUCTURAL_VALIDATION`
- ActualReachability: `R4`
- ActualTrust: `T1`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: caller mutation and aliasing cannot affect the newly allocated, deeply frozen backing or reveal it through the zero-key token
- ProductionEntry: `captureCanonicalRuntimeValue`; authenticated package-private backing reader
- FaultMechanism: post-capture source mutation, repeated acyclic reference, and token-shape inspection

### A-C06_PUBLIC_SERIALIZER_ISOLATION

- CriterionId: `A-C06_PUBLIC_SERIALIZER_ISOLATION`
- RuleClaim: public T1 serialization returns isolated deterministic buffers
- CompletionCriterion: an issued token serializes repeatedly to equal bytes in distinct ordinary non-shared Uint8Array objects
- RequiredEvidenceMechanism: public authenticated serializer repetition and buffer-mutation cases
- ExpectedReachability: `R4`
- ExpectedTrust: `T1`
- ExpectedPrimaryLayer: `PURE_POLICY_SEAM`
- ExpectedResult: `{ok:true, serializationVersion:"botc-canonical-runtime-tlv-be-v1"}` with equal fresh bytes and exact `byteLength`
- SupportingAuthorityRequirement: backing integrity is supporting authority; token admission remains the public T1 wrapper
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C06 repeated serialization returns equal bytes in distinct Uint8Array objects`; `A-C06 mutation of one returned byte array cannot affect later output`
- ActualPrimaryLayer: `PURE_POLICY_SEAM`
- ActualReachability: `R4`
- ActualTrust: `T1`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: authenticated serialization is deterministic and returns a fresh isolated byte buffer on every success
- ProductionEntry: `serializeCanonicalRuntimeValue`
- FaultMechanism: repeated serialization and mutation of a previously returned output buffer

### A-C07_RESOURCE_LIMITS

- CriterionId: `A-C07_RESOURCE_LIMITS`
- RuleClaim: every generic ceiling fails atomically at first one-over
- CompletionCriterion: depth, nodes, array, keys, string bytes, key bytes, and serialized bytes prove exact-at-limit success and one-over failure
- RequiredEvidenceMechanism: direct public capture resource-boundary matrix
- ExpectedReachability: `R3`
- ExpectedTrust: `T1`
- ExpectedPrimaryLayer: `STRUCTURAL_VALIDATION`
- ExpectedResult: exact `RESOURCE_*_EXCEEDED` code for each frozen generic ceiling
- SupportingAuthorityRequirement: frozen `CANONICAL_RUNTIME_LIMITS`; no domain limits
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C07 depth exact limit succeeds and first one-over fails`; `A-C07 node exact limit succeeds and first one-over fails`; `A-C07 array-length exact limit succeeds and first one-over fails`; `A-C07 object-key exact limit succeeds and first one-over fails`; `A-C07 string UTF-8 byte exact limit succeeds and first one-over fails`; `A-C07 object-key UTF-8 byte exact limit succeeds and first one-over fails`; `A-C07 total serialized-byte exact limit succeeds and first one-over fails`
- ActualPrimaryLayer: `STRUCTURAL_VALIDATION`
- ActualReachability: `R3`
- ActualTrust: `T1`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: each exact limit succeeds when otherwise valid and the first one-over returns its exact bounded limit summary without token or bytes
- ProductionEntry: `captureCanonicalRuntimeValue`
- FaultMechanism: one-over depth, occurrence count, container count, UTF-8 byte count, or total encoded byte count

### A-C08_PURE_TLV_HEADER_TAGS

- CriterionId: `A-C08_PURE_TLV_HEADER_TAGS`
- RuleClaim: the private pure encoder implements the exact V1 header, tags, counts, lengths, and nesting
- CompletionCriterion: already-captured backing known-answer vectors prove ten-byte header once, tags `00` through `06`, `u32be`, and nested framing
- RequiredEvidenceMechanism: authenticated setup with main assertion on deterministic backing-to-byte output; no public test hook
- ExpectedReachability: `R4`
- ExpectedTrust: `T3`
- ExpectedPrimaryLayer: `PURE_POLICY_SEAM`
- ExpectedResult: exact literal bytes beginning `42 4F 54 43 43 52 56 2B 30 31`
- SupportingAuthorityRequirement: C06 supports T1 admission but does not own this byte assertion
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C08 emits the exact ten-byte ASCII BOTCCRV+01 header once`; `A-C08 emits exact null and boolean tags`; `A-C08 emits exact string, array, and object u32be lengths and counts`; `A-C08 emits nested child nodes without repeated headers`
- ActualPrimaryLayer: `PURE_POLICY_SEAM`
- ActualReachability: `R4`
- ActualTrust: `T3`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: literal known-answer vectors match the frozen header, all tag families, four-byte counts/lengths, and child framing with no repeated header
- ProductionEntry: authenticated `serializeCanonicalRuntimeValue` setup exercising the module-private encoder
- FaultMechanism: none; exact deterministic pure backing-to-byte output

### A-C09_PURE_UNICODE

- CriterionId: `A-C09_PURE_UNICODE`
- RuleClaim: the pure encoder preserves valid Unicode, newline, and normalization distinctions
- CompletionCriterion: supplementary-plane, CR, LF, CRLF, composed, and decomposed vectors emit exact distinct bytes
- RequiredEvidenceMechanism: authenticated captured setup with main assertion on pure encoded bytes
- ExpectedReachability: `R4`
- ExpectedTrust: `T3`
- ExpectedPrimaryLayer: `PURE_POLICY_SEAM`
- ExpectedResult: exact UTF-8 TLV bytes with no normalization
- SupportingAuthorityRequirement: C03 supports T1 lone-surrogate rejection
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C09 emits exact UTF-8 for valid supplementary-plane pairs`; `A-C09 preserves distinct CR, LF, and CRLF byte vectors`; `A-C09 preserves distinct composed and decomposed Unicode vectors`
- ActualPrimaryLayer: `PURE_POLICY_SEAM`
- ActualReachability: `R4`
- ActualTrust: `T3`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: exact UTF-8 output preserves supplementary scalar, newline, and normalization-form distinctions while T1 capture rejects lone surrogates
- ProductionEntry: authenticated `serializeCanonicalRuntimeValue` setup exercising string encoding
- FaultMechanism: none for pure output; lone-surrogate rejection is supporting T1 structural validation

### A-C10_PURE_INTEGER

- CriterionId: `A-C10_PURE_INTEGER`
- RuleClaim: the pure encoder emits fixed signed i64be bytes
- CompletionCriterion: zero, positive, negative, minimum-safe, and maximum-safe integers match literal vectors
- RequiredEvidenceMechanism: authenticated captured setup with main assertion on pure integer bytes
- ExpectedReachability: `R4`
- ExpectedTrust: `T3`
- ExpectedPrimaryLayer: `PURE_POLICY_SEAM`
- ExpectedResult: tag `03` plus exact eight-byte signed big-endian value
- SupportingAuthorityRequirement: C03 supports T1 invalid-number rejection
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C10 emits exact i64be bytes for boundary safe integers`
- ActualPrimaryLayer: `PURE_POLICY_SEAM`
- ActualReachability: `R4`
- ActualTrust: `T3`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: literal vectors for zero, one, minus one, minimum safe, and maximum safe values match signed two's-complement i64be
- ProductionEntry: authenticated `serializeCanonicalRuntimeValue` setup exercising integer encoding
- FaultMechanism: none; exact deterministic pure backing-to-byte output

### A-C11_PURE_OBJECT_ORDER

- CriterionId: `A-C11_PURE_OBJECT_ORDER`
- RuleClaim: object order is raw UTF-16 code-unit order
- CompletionCriterion: insertion permutations, numeric-looking keys, prefix keys, and supplementary keys match the frozen comparator
- RequiredEvidenceMechanism: authenticated captured setup with main assertion on exact sorted bytes
- ExpectedReachability: `R4`
- ExpectedTrust: `T3`
- ExpectedPrimaryLayer: `PURE_POLICY_SEAM`
- ExpectedResult: identical bytes for equal records regardless of insertion order
- SupportingAuthorityRequirement: comparator source and no-locale denylist are supporting authority
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C11 record insertion permutations emit identical sorted bytes`; `A-C11 numeric-looking keys use raw UTF-16 lexical order`; `A-C11 supplementary and prefix keys use exact UTF-16 code-unit order`
- ActualPrimaryLayer: `PURE_POLICY_SEAM`
- ActualReachability: `R4`
- ActualTrust: `T3`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: insertion order is erased and numeric-looking, prefix, and supplementary keys follow raw UTF-16 code-unit order
- ProductionEntry: capture sorting plus authenticated serialization
- FaultMechanism: none; deterministic comparator behavior

### A-C12_ARRAY_STRUCTURE

- CriterionId: `A-C12_ARRAY_STRUCTURE`
- RuleClaim: only dense standard arrays are captured and their order is preserved
- CompletionCriterion: dense controls succeed in order; sparse, keyed, out-of-range, invalid-length, and accessor arrays fail exactly
- RequiredEvidenceMechanism: direct hostile array capture matrix with ordered controls
- ExpectedReachability: `R3`
- ExpectedTrust: `T1`
- ExpectedPrimaryLayer: `STRUCTURAL_VALIDATION`
- ExpectedResult: exact success or `SPARSE_ARRAY`, `KEYED_ARRAY`, `INVALID_ARRAY_LENGTH_DESCRIPTOR`, `ACCESSOR_PROPERTY`
- SupportingAuthorityRequirement: no role or event tuple authority
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C12 dense array order is preserved and permutations differ`; `A-C12 sparse, keyed, out-of-range, and invalid-length arrays fail exactly`
- ActualPrimaryLayer: `STRUCTURAL_VALIDATION`
- ActualReachability: `R3`
- ActualTrust: `T1`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: exact current-realm dense arrays preserve index order while every structural variant fails with its frozen code
- ProductionEntry: `captureCanonicalRuntimeValue`
- FaultMechanism: hole, extra/out-of-range key, nonstandard length descriptor, or accessor index

### A-C13_DIAGNOSTIC_STABILITY

- CriterionId: `A-C13_DIAGNOSTIC_STABILITY`
- RuleClaim: failures disclose only fixed bounded diagnostics
- CompletionCriterion: representative failure families prove exact code, phase, path, limit summary, quarantine, truncation, and absence of raw content
- RequiredEvidenceMechanism: direct hostile capture, token, internal-read, and serializer diagnostic matrix
- ExpectedReachability: `R3`
- ExpectedTrust: `T1`
- ExpectedPrimaryLayer: `STRUCTURAL_VALIDATION`
- ExpectedResult: exact five-field `CanonicalRuntimeDiagnostic` with no raw data
- SupportingAuthorityRequirement: diagnostic enums and bounded path contract only
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C13 representative failures expose stable bounded diagnostics`; `A-C13 diagnostic truncation retains 31 segments and one TRUNCATED segment`
- ActualPrimaryLayer: `STRUCTURAL_VALIDATION`
- ActualReachability: `R3`
- ActualTrust: `T1`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: exact five-field diagnostics remain deterministic, bounded to 32 safe path segments, correctly quarantined, and free of raw hostile content
- ProductionEntry: public capture/authentication and package-private authenticated reader diagnostics
- FaultMechanism: representative hostile value and path deeper than the diagnostic capacity

### A-C14_ADDITIVE_COMPATIBILITY

- CriterionId: `A-C14_ADDITIVE_COMPATIBILITY`
- RuleClaim: A is additive and cannot relabel or migrate legacy formats
- CompletionCriterion: new constants and APIs are distinct, V1 is closed, denylisted legacy files remain unchanged, and existing regressions remain green
- RequiredEvidenceMechanism: API/version isolation assertion, static allowlist inspection, and unchanged legacy regression execution
- ExpectedReachability: `R4`
- ExpectedTrust: `T3`
- ExpectedPrimaryLayer: `PURE_POLICY_SEAM`
- ExpectedResult: no migration, alias, old digest relabeling, or legacy file change
- SupportingAuthorityRequirement: existing legacy regressions and final changed-file/denylist audit are supporting authority only
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C14 new API and versions remain distinct while legacy behavior is unchanged`
- ActualPrimaryLayer: `PURE_POLICY_SEAM`
- ActualReachability: `R4`
- ActualTrust: `T3`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: the new value and serialization versions are distinct additive APIs and existing canonical-data behavior remains intact
- ProductionEntry: package-root named exports plus unchanged legacy canonical-data APIs
- FaultMechanism: none; compatibility is enforced by distinct literals, unchanged denylist, and local regressions

### A-C15_CROSS_PLATFORM_BYTES

- CriterionId: `A-C15_CROSS_PLATFORM_BYTES`
- RuleClaim: the frozen pure literal vectors are platform-independent
- CompletionCriterion: identical vector expectations are prepared for Windows and Linux execution without locale or platform branches
- RequiredEvidenceMechanism: pure literal-vector assertions in A plus deferred exact-platform execution support
- ExpectedReachability: `R4`
- ExpectedTrust: `T3`
- ExpectedPrimaryLayer: `PURE_POLICY_SEAM`
- ExpectedResult: exact same TLV byte literals on every supported platform
- SupportingAuthorityRequirement: `PLANNED_SUPPORTING_AUTHORITY {purpose:WINDOWS_LINUX_BYTE_IDENTITY, expectedStatus:ACCEPTED, mutationExpectation:NONE, consumers:[A-C15]}` owned later by P2F1R-D
- ActualTestFile: `packages/domain-core/src/canonical-runtime-value.test.ts`
- ActualTestTitle: `A-C15 frozen literal vectors are locale-independent and ready for later host evidence`
- ActualPrimaryLayer: `PURE_POLICY_SEAM`
- ActualReachability: `R4`
- ActualTrust: `T3`
- SupportingAuthorityId: `NONE`
- MechanismMatch: `PASS`
- MainAssertion: the A-owned primary mechanism uses literal bytes, raw UTF-16 ordering, explicit UTF-8/i64be/u32be encoding, and no locale/environment-sensitive implementation path
- ProductionEntry: authenticated `serializeCanonicalRuntimeValue` setup exercising the pure encoder
- FaultMechanism: local locale variation and production-source audit; no hosted platform execution is claimed

## Future D evidence

The A-owned primary mechanism for every criterion above exists locally and has
`MechanismMatch=PASS`. No criterion is classified as R1 or R2, and no A test is
classified as `CROSS_PLATFORM_CI`.

P2F1R-D must later materialize real supporting authority for:

- Windows/Linux execution of the frozen A-C15 literal vectors;
- byte-for-byte equality on those supported hosts;
- ownership registration and total-test reconciliation for the frozen A+B+C
  identities;
- ordinary, coverage, and Windows routing;
- an append-only exact coverage profile;
- workflow, hosted exact-head CI, and publication review.

Those authorities do not exist at this local A stage. No `SUP-*` identifier,
hosted result, CI claim, ownership claim, coverage claim, or publication claim
is materialized here.
