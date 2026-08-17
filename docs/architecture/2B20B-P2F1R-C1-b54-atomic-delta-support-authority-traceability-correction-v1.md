# Phase 3 Slice 2B20B-P2F1R-C1 B54 Atomic Delta, Supporting Authority, and Traceability Correction V1

建议唯一物化路径：

`docs/architecture/2B20B-P2F1R-C1-b54-atomic-delta-support-authority-traceability-correction-v1.md`

## 1. Authorization and baseline

- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_C1_B54_ATOMIC_DELTA_SUP_AUTHORITY_AND_TRACEABILITY_CORRECTION_ONLY`
- accepted clean baseline: `C:\Users\wjl\AppData\Local\Temp\botc-c1-b54-design-20260801-092323`
- accepted HEAD: `30793b662b99bb7f4689811e56b91afe365c2fd4`
- baseline status: detached, clean
- historical branch identity: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`
- original worktree: 18 dirty entries, preserved unchanged and usable only as historical/design evidence
- GitHub: no open PR and no remote C1 feature branch
- rule evidence: `docs/rules/evidence/2B20B-P2F1R-C1.md`
- rule evidence SHA-256: `a484067a98056e83d11f9b41fadfa1140d738c811850a139075bd57cfe0650fe`
- rule verdict: `RULE_READY`
- role coverage: Seamstress `PARTIAL`; Mathematician `PARTIAL`; no coverage change
- implementation authorization: `false`

Parent authorities, in order:

1. C1 Design Round 1, SHA-256 `275b8d17f3e01d830355627de90cc526f323b117c15c6a7bfcc41d5516b832f1`
2. C1 Design Correction Round 1, SHA-256 `7aa2d382669c5957255def6ae8257b8e89e72679076df9f61a6b237fa91d4898`
3. C1 Design Correction Round 2, SHA-256 `10b06b08cf9f99f3c6e5f4161af164f8f8e48423f79cd983294a2d12f68eac3b`
4. B54 Authority Resolution Audit V1, SHA-256 `5da6836a0bac012e61143f711b17a42dc0a6c5ef3edfb895e9dc296ea184d6f9`
5. C1 Design Correction Round 3, SHA-256 `bdc7daca247560673e26732fe26f659db7a35417b4ed771169425ee9c6aa0328`
6. Round 3 independent `HUMAN_BLOCKED` review, SHA-256 `9eae3c884604344531b8a5d94a0d59be448f4468663d472bb3ca5a337c1e126a`

This correction closes only:

- `DELTA_ATOMICITY`
- `SUPPORT_AUTHORITY_CONFLICT`
- `TRACEABILITY_SUPERSESSION`

It does not reopen B54 classification, B26 variadic semantics, the 15-node AST, traversal, node ordinals, A/B, accepted types, producers, semantic validators, events, replay, state, D, or P2F.

## 2. Supersession rule

This document supplements the accepted C1 Design Round 1 + Correction 1 + Correction 2 chain and replaces only:

- Round 3’s fragmented delta ledger and Catalog `D|` rows;
- every Round 2 clause that freezes the terminal SUP set to only `001/002`;
- Round 3’s SUP-003 scope and consumer list;
- parent `C1-C04` active-criterion treatment;
- Round 3’s ambiguous `C1-C04A/C1-C04B` mapping.

All unrelated parent clauses remain active.

## 3. Canonical FieldPath V1

### 3.1 Path grammar

```text
CanonicalPath := "$" PathSegment+
PathSegment   := "/f:" EscapedToken
               | "/t:" EscapedToken "=" EscapedToken
```

- `/f:` denotes an exact record field.
- `/t:` denotes selection of a tagged-union member by exact discriminator field and literal.
- `EscapedToken` escapes `\`, `/`, `:`, `=`, and `|` as `\\`, `\/`, `\:`, `\=`, and `\|`.
- TAB, LF, and CR encode as `\t`, `\n`, and `\r`.
- Other U+0000–U+001F and U+007F code units encode as lowercase `\uXXXX`.
- No Unicode normalization, case folding, locale comparison, or percent decoding is allowed.
- Lone surrogates are invalid.

### 3.2 Single-path and path-set encoding

```text
SinglePath := "P|" CanonicalPath
PathSet    := "S|" Count "|" CanonicalPath ("|" CanonicalPath)*
```

Rules:

- `Count` is canonical ASCII decimal without a sign or leading zero.
- The decoded path set must be non-empty.
- `Count` must equal the number of decoded paths.
- Paths are unique.
- Set paths are sorted by decoded `CanonicalPath` using raw UTF-16 code-unit order.
- Sorting occurs before escaping and encoding.
- A noncanonical order, duplicate, empty set, count mismatch, bad escape, or trailing token fails closed.

This allows B54’s three occurrences to remain one `FieldPath` semantic field; no `OccurrencePaths` or eleventh record field is introduced.

## 4. Atomic Delta Record V1

Every delta is an exact, deeply frozen plain record with exactly these ten own data keys:

```ts
type AtomicDeltaRecordV1 = {
  readonly DeltaId: string;
  readonly EventType: string;
  readonly BranchId: string;
  readonly FieldPath: string;
  readonly PriorRepresentation: string;
  readonly AcceptedAuthority: string;
  readonly V2AstRepresentation: string;
  readonly RuntimeInputSetChanged: boolean;
  readonly BehaviorChanged: boolean;
  readonly JustificationAuthority: string;
};
```

Contract:

- all ten fields are required;
- no optional key, extra key, symbol, accessor, prototype extension, or metadata bag is legal;
- all strings are non-empty, trimmed primitive strings;
- `RuntimeInputSetChanged` and `BehaviorChanged` are primitive booleans;
- both flags must be `false` for both approved records;
- `JustificationAuthority` uses:

```text
SUPSET|Count|SUP-ID("|"SUP-ID)*
```

- SUP IDs are unique and raw UTF-16 sorted;
- only the frozen SUP allowlist is legal;
- record order is raw UTF-16 `DeltaId` order;
- records and all containing structures are recursively frozen;
- duplicate `DeltaId` fails closed;
- duplicate decoded `(EventType, BranchId, FieldPath)` fails closed;
- any third record fails closed.

## 5. Exact B26 atomic record

```json
{
  "DeltaId": "B26_SEAMSTRESS_VARIADIC_DELTA",
  "EventType": "SeamstressInformationDelivered",
  "BranchId": "C-B26-SEAMSTRESS-DELIVERY-U",
  "FieldPath": "P|$/f:sourceEffectiveness/t:kind=KNOWN_INEFFECTIVE/f:representedImpairments",
  "PriorRepresentation": "CATALOG_V1:TUPLE(length=2,itemSchema=SEAMSTRESS_REPRESENTED_IMPAIRMENT_EVIDENCE_EXACT_RECORD_V1,itemsStructurallyIdentical=true)",
  "AcceptedAuthority": "ACCEPTED_B26:SeamstressInformationDeliveredPayload+SeamstressSourceEffectiveness+SeamstressRepresentedImpairmentEvidence;producer=resolveSeamstressSourceEffectiveness;validator=validateSeamstressInformationDeliveredPayloadShape;acceptedHistoricalTests=true",
  "V2AstRepresentation": "NON_EMPTY_ARRAY(elementSchema=SEAMSTRESS_REPRESENTED_IMPAIRMENT_EVIDENCE_EXACT_RECORD_V1,minLength=1,maxLength=none,astMinItems=1,astMaxItems=null)",
  "RuntimeInputSetChanged": false,
  "BehaviorChanged": false,
  "JustificationAuthority": "SUPSET|2|SUP-2B20B-P2F1R-C1-001|SUP-2B20B-P2F1R-C1-002"
}
```

`SEAMSTRESS_REPRESENTED_IMPAIRMENT_EVIDENCE_EXACT_RECORD_V1` is the exact four-required-field record:

- `appliedCharacterStateRevision: SAFE_INTEGER`
- `impairmentId: ID_STRING(AbilityImpairmentId)`
- `impairmentKind: ENUM(DRUNK, POISONED)`
- `impairmentSourceKind: ENUM(PHILOSOPHER_CHOSEN_DUPLICATE, SNAKE_CHARMER_DEMON_HIT)`

No accepted B26 type, producer, semantic validator, event, sorting rule, duplicate rule, or runtime behavior changes.

## 6. Exact B54 atomic record

```json
{
  "DeltaId": "B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA",
  "EventType": "MathematicianInformationDelivered",
  "BranchId": "C-B54-MATHEMATICIAN-DELIVERY-U",
  "FieldPath": "S|3|$/f:sourceContract/t:kind=BASE_MATHEMATICIAN/f:abilityInstance|$/f:sourceContract/t:kind=PHILOSOPHER_GAINED_MATHEMATICIAN_V1/f:abilityInstance|$/f:sourceContract/t:kind=PHILOSOPHER_GAINED_MATHEMATICIAN_V2/f:abilityInstance",
  "PriorRepresentation": "CATALOG_V1:eachOccurrence=CLOSED_UNION(selection=EXACTLY_ONE,sourceMemberCount=4,survivorCount=1,identicalEmptyPlaceholderCount=3)",
  "AcceptedAuthority": "ACCEPTED_B54:MathematicianSourceContract+FirstNightAbilityInstanceProvenance;producers=abilityInstanceFor+sourceContractFor;validators=validSource+validateFirstNightAbilityInstanceProvenanceShape;acceptedAuthorityAuditTestLedger=true",
  "V2AstRepresentation": "sourceContract=TAGGED_UNION(tag=kind,memberCount=3);BASE_MATHEMATICIAN.abilityInstance=B54_BASE_ROLE_TASK_EXACT_RECORD_V1;PHILOSOPHER_GAINED_MATHEMATICIAN_V1.abilityInstance=B54_PHILOSOPHER_GAINED_TASK_V1_EXACT_RECORD_V1;PHILOSOPHER_GAINED_MATHEMATICIAN_V2.abilityInstance=B54_PHILOSOPHER_GAINED_TASK_V2_EXACT_RECORD_V1;generalFirstNightAbilityInstanceProvenance=TAGGED_UNION(tag=kind,memberCount=4)",
  "RuntimeInputSetChanged": false,
  "BehaviorChanged": false,
  "JustificationAuthority": "SUPSET|1|SUP-2B20B-P2F1R-C1-003"
}
```

Frozen survivor identities:

| Outer kind | Survivor kind | Exact schema identity |
|---|---|---|
| `BASE_MATHEMATICIAN` | `BASE_ROLE_TASK` | `B54_BASE_ROLE_TASK_EXACT_RECORD_V1` |
| `PHILOSOPHER_GAINED_MATHEMATICIAN_V1` | `PHILOSOPHER_GAINED_TASK_V1` | `B54_PHILOSOPHER_GAINED_TASK_V1_EXACT_RECORD_V1` |
| `PHILOSOPHER_GAINED_MATHEMATICIAN_V2` | `PHILOSOPHER_GAINED_TASK_V2` | `B54_PHILOSOPHER_GAINED_TASK_V2_EXACT_RECORD_V1` |

The three-member outer runtime union remains distinguishable. The general provenance union remains four-member and retains `EXPLICIT_DOMAIN_INSTANCE`. No placeholder is a runtime member. No fallback, sixteenth node kind, accepted-type change, producer change, or validator change is permitted.

## 7. `APPROVED_C1_DELTA_REGISTRY_V1`

The registry is one recursively frozen exact record with exactly these keys:

```ts
type ApprovedC1DeltaRegistryV1 = {
  readonly RegistryVersion: "APPROVED_C1_DELTA_REGISTRY_V1";
  readonly AstVersion: "botc-domain-event-structural-schema-ast-v1";
  readonly TraversalVersion:
    "botc-domain-event-structural-unique-node-traversal-v1";
  readonly NormalizationVersion:
    "botc-domain-event-structural-normalization-v1";
  readonly ProjectionVersion:
    "botc-domain-event-structural-audit-projection-v1";
  readonly CatalogVersion:
    "botc-domain-event-structural-audit-catalog-v2";
  readonly V1SourceSha256:
    "bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26";
  readonly ApprovedDeltaCount: 2;
  readonly UnchangedBranchCount: 57;
  readonly OtherBranchDeltaCount: 0;
  readonly Records: readonly [
    AtomicDeltaRecordV1,
    AtomicDeltaRecordV1
  ];
};
```

`Records` is exactly:

1. `B26_SEAMSTRESS_VARIADIC_DELTA`
2. `B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA`

Health rules:

- exact registry keys only;
- exact protocol values;
- exact count `2`;
- exact unchanged count `57`;
- exact other-delta count `0`;
- exact record content;
- exact record order;
- no missing, extra, duplicate, reordered, or mutated record;
- no independently supplied count accepted over recomputation;
- failure publishes no healthy authority, catalog, or digest.

## 8. Canonical projection, Catalog V2, and artifact digest

`CanonicalSchemaAuditProjectionV1` gains these required fields:

```ts
readonly deltaRegistryVersion: "APPROVED_C1_DELTA_REGISTRY_V1";
readonly approvedDeltaRegistry: ApprovedC1DeltaRegistryV1;
```

The exact frozen registry object is captured within the one canonical projection:

```text
projection including approvedDeltaRegistry
  -> unchanged captureCanonicalRuntimeValue
  -> unchanged serializeCanonicalRuntimeValue
  -> unchanged createCanonicalValueIntegrity
```

Therefore the registry’s complete canonical A/TLV representation participates in the artifact digest. There is no second serializer, JSON digest, registry-only authority digest, or concatenation convention.

Any registry field mutation must either make the candidate unhealthy before hashing or change the full projection bytes and B digest.

Catalog V2 must render both complete records, one row per record, in this exact field order:

```text
D|DeltaId=Q|EventType=Q|BranchId=Q|FieldPath=Q|PriorRepresentation=Q|AcceptedAuthority=Q|V2AstRepresentation=Q|RuntimeInputSetChanged=false|BehaviorChanged=false|JustificationAuthority=Q
```

Each row contains all ten fields. Floating occurrence rows are forbidden.

Catalog metadata additionally records:

- AST version;
- traversal version;
- normalization version;
- delta registry version;
- approved delta count `2`;
- unchanged branch count `57`;
- other branch delta count `0`;
- both DeltaIds;
- V1 source SHA-256;
- V2 AST digest;
- delta audit result `APPROVED_C1_DELTA_REGISTRY_V1_MATCH`.

Catalog generation fails on any missing/extra/changed field, third delta, absent delta, record-order deviation, SUP mismatch, FieldPath set mismatch, or count mismatch.

## 9. Supporting Authority amendment

The complete legal terminal set is now exactly:

```text
SUP-2B20B-P2F1R-C1-001
SUP-2B20B-P2F1R-C1-002
SUP-2B20B-P2F1R-C1-003
```

`004+`, suffix-bearing IDs, aliases, renumbering, reuse, or dynamic registration are forbidden.

### 9.1 Exact supersession of Round 2

This amendment explicitly supersedes Correction Round 2:

- §14.1’s “only IDs introduced by C1 are 001/002” freeze;
- §14.2’s complete two-row design ledger;
- §14.3’s two-member `SupportingAuthorityId` union;
- §15’s authority-reference table where only 001/002 are available;
- §17 acceptance check 12 requiring only two terminal IDs;
- §17 acceptance check 13 where “both” means only two bindings;
- §18 stop condition that any ID outside 001/002 stops;
- §19 reviewer checks 11–13 where the complete set is only 001/002;
- §20 self-check claiming the terminal set is exactly two IDs;
- every inherited handoff, acceptance, stop-loss, or review sentence with the same two-ID restriction.

Replacement everywhere is the exact three-ID set above. The stop condition becomes “any ID outside 001/002/003”.

### 9.2 Preservation of 001 and 002

The following Round 2 values remain verbatim and semantically unchanged:

| ID | AuthorityDescription | Status | Purpose | Consumers |
|---|---|---|---|---|
| `SUP-...-001` | `Accepted Seamstress B26 shape` | `ACCEPTED` | Authentic B26 cardinality support | `C1-C10`, B26 atomic justification |
| `SUP-...-002` | `Immutable V1 migration baseline` | `LEGACY` | Immutable SHA-bound Catalog V1 baseline | `C1-C13`, B26 atomic justification |

Their history, numbering, descriptions, status, mutation rules, and previous valid use are not rewritten.

### 9.3 Exact SUP-003

```text
AuthorityId: SUP-2B20B-P2F1R-C1-003
AuthorityDescription: Accepted B54 Mathematician source and provenance authority
LedgerState: PLANNED_SUPPORTING_AUTHORITY
ExpectedAuthorityStatus: ACCEPTED
ImplementationAuthorityStatus: ACCEPTED
AuthorityScope: C-B54-MATHEMATICIAN-DELIVERY-U and B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA only
MutationDisposition: NONE for the accepted authority; detached negative values are CLONE_MUTATED
```

Authority binds:

- `MathematicianSourceContract`;
- `FirstNightAbilityInstanceProvenance`;
- `abilityInstanceFor`;
- `sourceContractFor`;
- `validSource`;
- `validateFirstNightAbilityInstanceProvenanceShape`;
- exact accepted B54 tests listed in the B54 authority audit.

Allowed consumers only:

- B54 correction design;
- `C1-C04B` B54 runtime compatibility;
- compile-time compatibility criterion;
- `C1-C13` generated delta audit;
- Catalog V2 audit mapping.

Forbidden consumers:

- B26;
- any of the other 57 branches;
- BOTC semantic conclusions;
- runtime validator authority;
- event authority;
- producer authority;
- replay authority;
- historical acceptance authority;
- state or snapshot authority;
- P2F issuer;
- D publication primary evidence;
- any primary-layer determination.

## 10. Traceability supersession

### 10.1 Historical parent

```text
CriterionId: C1-C04
ParentDisposition: SUPERSEDED_BY_ATOMIC_CHILDREN
ParentPrimaryIdentity: NONE
HistoricalTextPreserved: true
ActiveAcceptanceCriterion: false
```

The historical row is retained verbatim for provenance. It is not deleted, rewritten, or marked direct `PASS`. It receives no `ActualTestFile`, `ActualTestTitle`, primary layer, supporting authority, or `MechanismMatch`.

Parent closure is a derived grouping result only:

```text
C1-C04 closes iff
  C1-C04A.MechanismMatch = PASS
  AND C1-C04B.MechanismMatch = PASS
  AND ApprovedDeltaCount = 2
  AND UnchangedBranchCount = 57
  AND OtherBranchDeltaCount = 0
```

D, P2F, documentation, Catalog text, or a controller-authored conclusion cannot supply either child `MechanismMatch`.

### 10.2 Child `C1-C04A`

| Field | Frozen value |
|---|---|
| `CriterionId` | `C1-C04A` |
| `RuleClaim` | B26 accepted non-empty variable-length `representedImpairments` is represented exactly by the AST without changing the accepted runtime input set or behavior. |
| `CompletionCriterion` | B26 lengths 1, 2, and 3 match; length 0 under `KNOWN_INEFFECTIVE` rejects; `NOT_PROVEN` empty tuple remains valid; accepted source remains unchanged. |
| `RequiredEvidenceMechanism` | Direct B26 public-shape/runtime compatibility vectors through the AST-derived structural validator; accepted payload is supporting evidence only. |
| `ExpectedReachability` | `R3` |
| `ExpectedTrust` | `T3` |
| `ExpectedPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ExpectedResult` | Variadic compatibility closes with `RuntimeInputSetChanged=false` and `BehaviorChanged=false`. |
| `SupportingAuthorityRequirement` | `SUP-2B20B-P2F1R-C1-001`; `SUP-...-002` supports only the delta-baseline side. |

### 10.3 Child `C1-C04B`

| Field | Frozen value |
|---|---|
| `CriterionId` | `C1-C04B` |
| `RuleClaim` | B54 TypeScript-only placeholder unions normalize to the three exact runtime survivors without changing the accepted runtime input set or behavior. |
| `CompletionCriterion` | Three legal pairings accept identically before/after; the complete wrong-generation, explicit-domain, empty, missing, extra, mixed, null, and undefined matrix rejects identically. |
| `RequiredEvidenceMechanism` | Direct three-occurrence runtime-language equivalence vectors through the AST-derived structural validator. |
| `ExpectedReachability` | `R3` |
| `ExpectedTrust` | `T3` |
| `ExpectedPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ExpectedResult` | Exact three-survivor equality with `RuntimeInputSetChanged=false` and `BehaviorChanged=false`. |
| `SupportingAuthorityRequirement` | `SUP-2B20B-P2F1R-C1-003` |

Neither child may use `MIXED` or `MULTI_LAYER`; they must bind different physical primary test identities.

## 11. Separate single-primary proof criteria

The following mechanisms must not be combined into one physical primary identity:

| Criterion | Purpose | R/T | Primary layer |
|---|---|---|---|
| `C1-C04A` | B26 runtime/public compatibility | `R3/T3` | `STRUCTURAL_VALIDATION` |
| `C1-C04B` | B54 runtime compatibility | `R3/T3` | `STRUCTURAL_VALIDATION` |
| `C1-C16` | Compile-time exactness: 40/40 event proofs, B26 variadic equality, B54 3/3 survivor equality, and 9/9 impossible intersections | `R4/T3` | `PURE_POLICY_SEAM` |
| `C1-C13` | Generated exact two-record delta audit and other-57 zero-delta proof | `R4/T3` | `PURE_POLICY_SEAM` |

`C1-C16` exact nine fields:

| Field | Frozen value |
|---|---|
| `CriterionId` | `C1-C16` |
| `RuleClaim` | AST inference remains bidirectionally exact against all accepted payload types, including B26 and B54. |
| `CompletionCriterion` | 40/40 event exactness, B26 variadic exactness, 3/3 B54 survivor equalities, and 9/9 impossible-member `never` proofs resolve from types. |
| `RequiredEvidenceMechanism` | Compiler exactness fixture bound directly to AST roots, without casts, `any`, suppression, manual booleans, or B54 exclusion. |
| `ExpectedReachability` | `R4` |
| `ExpectedTrust` | `T3` |
| `ExpectedPrimaryLayer` | `PURE_POLICY_SEAM` |
| `ExpectedResult` | Every equality is literal `true`; every impossible intersection is `never`. |
| `SupportingAuthorityRequirement` | `SUP-...-001` for B26 and `SUP-...-003` for B54. |

`C1-C13` retains its prior meaning but its completion contract is corrected to consume the exact registry and ten-field records.

All other criteria remain active and unchanged:

- `C1-C01`–`C1-C03`
- `C1-C05`–`C1-C08`
- `C1-C09A`
- `C1-C09B`
- `C1-C10`–`C1-C14`

`C1-C09` remains historical grouping only.

`C1-C15` is explicitly inherited and ratified as the existing cross-platform traversal/TLV/digest/catalog criterion; it is not newly introduced by this correction and is not a child of `C1-C04`.

## 12. Scope and affected files for a later implementation

Production allowlist remains exactly:

- `packages/domain-core/src/domain-event-structural-schema-ast.ts`
- `packages/domain-core/src/domain-event-structural-schema-validator.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.ts`

Test allowlist remains exactly:

- `packages/domain-core/src/domain-event-structural-schema-ast.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-validator.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`

Documentation allowlist:

- this correction document;
- generated Catalog V2;
- C1 implementation traceability;
- one C1 implementation-review artifact.

Forbidden:

- `index.ts`;
- A or B;
- accepted TypeScript payload types;
- events or event schema;
- accepted producers;
- semantic validators;
- Mathematician or Seamstress production/tests;
- replay, application, batch, state, snapshots, projections, receipts, ledger;
- workflow, ownership, coverage, CI configuration;
- D or P2F.

## 13. Acceptance checks and required tests

Required focused evidence:

1. exact ten top-level keys, requiredness, primitive types, and no metadata;
2. B26 exact record equality;
3. B54 exact record equality;
4. FieldPath parser accepts the two frozen values only;
5. B54 set count is three, sorted, unique, non-empty, and exactly the three frozen paths;
6. record order is raw UTF-16 `DeltaId`;
7. registry exact keys and deep freeze;
8. exact two records, unchanged `57`, other delta `0`;
9. duplicate DeltaId rejection;
10. duplicate decoded `(EventType, BranchId, FieldPath)` rejection;
11. missing/extra/third record rejection;
12. independent mutation of each of the ten fields fails;
13. Catalog V2 emits two complete ten-field `D|` rows, no floating occurrence rows;
14. catalog parse rejects missing, extra, reordered, duplicated, or unknown keys;
15. registry mutation changes projection bytes/digest or fails health first;
16. SUP allowlist is exactly `001/002/003`;
17. `004+`, suffix IDs, missing, duplicate, dangling, or wrong-consumer SUP references fail;
18. 001/002 exact meaning/status/history remains unchanged;
19. `C1-C04` has no primary identity or implementation binding;
20. C04A/B each has nine fields and a distinct single primary identity;
21. C1-C16, C1-C10/C04A, C04B, and C1-C13 do not share a physical primary identity;
22. D cannot populate either child `MechanismMatch`;
23. `C1-C15` remains inherited unchanged;
24. accepted types, producers, validators, event schema, A, B, and all forbidden files remain unchanged.

Later implementation commands:

```text
corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-event-structural-schema-ast.test.ts
corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-event-structural-schema-validator.test.ts
corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-event-structural-schema-catalog.test.ts
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm test:coverage
```

Required exact-head CI must run on supported Ubuntu and Windows. `C1-C15` requires identical registry order, catalog bytes, A/TLV bytes, and digest on both platforms.

## 14. Documentation and rollback

Documentation must state:

- runtime structural authority remains the healthy AST only;
- Catalog V2 and delta registry are audit evidence, not runtime, event, replay, history, state, or BOTC semantic authority;
- B26 and B54 are representation-only deltas;
- both impact flags remain false;
- role coverage remains unchanged.

Rollback of a later implementation removes only the three permitted C1 production files, their three tests, generated Catalog V2, implementation traceability, and implementation review. It does not reactivate Catalog V1 as runtime authority and requires no event/history migration.

## 15. Updated stop-loss

Stop with `HUMAN_BLOCKED` if any occurs:

1. either delta cannot be expressed by exactly the ten fields;
2. B54’s three paths cannot use the frozen deterministic set encoding;
3. a third delta is needed;
4. any of the other 57 branches differs;
5. any SUP ID outside `001/002/003` is needed;
6. SUP-003 is needed outside B54 scope;
7. 001 or 002 meaning, status, numbering, purpose, history, or consumer contract must change;
8. parent/child supersession cannot satisfy Traceability V1.1;
9. the parent or two children must share a primary identity;
10. compile-time, B26 runtime, B54 runtime, or generated audit requires a shared/multi-layer primary identity;
11. `C1-C15` cannot remain inherited unchanged;
12. accepted types, producers, semantic validators, or event schema must change;
13. A or B must change;
14. unaccepted C worktree code/tests must be restored or reused;
15. D or P2F must start;
16. production implementation is required merely to finish this design correction;
17. runtime input equality or unchanged behavior cannot be independently confirmed;
18. registry canonical content cannot participate in the existing one-projection A/B digest path;
19. the exact allowlist cannot hold.

## 16. Fresh independent design rereview

A fresh independent read-only reviewer, not a previous C1/B54 author or reviewer, must read:

- the accepted clean HEAD;
- rule evidence and live/approved sources;
- current role matrix;
- complete C1 design chain;
- B54 audit;
- prior `HUMAN_BLOCKED` review;
- this correction;
- accepted types, producers, validators, and tests;
- actual Git/GitHub state.

The reviewer must verify all contracts above and return only:

- `RULE_DESIGN_PASS`
- `RULE_DESIGN_FIX_REQUIRED`
- `HUMAN_BLOCKED`

Only an independent `RULE_DESIGN_PASS` with `remainingDesignBlockers=[]`, followed by separate implementation authorization, may permit implementation.

This blueprint itself asserts no design-review verdict.

## 17. Frozen final status

```text
deltaRecordSchema=ATOMIC_DELTA_RECORD_V1_EXACT_TEN_FIELDS
deltaFieldCount=10
deltaRegistry=APPROVED_C1_DELTA_REGISTRY_V1
deltaRegistryCount=2
unchangedBranchCount=57
otherBranchDeltaCount=0
runtimeInputSetChanged=false
behaviorChanged=false
supportingAuthorityContractBefore=001/002
supportingAuthorityContractAfter=001/002/003
SUP001Changed=false
SUP002Changed=false
C1-C04Disposition=SUPERSEDED_BY_ATOMIC_CHILDREN
duplicatePrimaryIdentities=forbidden
acceptedTypesChanged=false
producersChanged=false
semanticValidatorsChanged=false
eventSchemaChanged=false
AChanged=false
BChanged=false
implementationAuthorized=false
filesChanged=0
commitCreated=false
pushPerformed=false
PRCreated=false
CIrerunPerformed=false
requiredNextAction=SOLE_WRITER_MATERIALIZE_THIS_DOCUMENT_THEN_FRESH_INDEPENDENT_READ_ONLY_DESIGN_REVIEW
```
