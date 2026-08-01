# Phase 3 Slice 2B20B-P2F1R-C1 Typed Structural Schema Authority Design Correction Round 3

## Metadata

- sliceId: `2B20B-P2F1R-C1`
- correctionRound: `3`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_C1_B54_PLACEHOLDER_UNION_NORMALIZATION_BOUNDED_DESIGN_CORRECTION_ONLY`
- acceptedAuditHead: `30793b662b99bb7f4689811e56b91afe365c2fd4`
- ruleEvidence: `docs/rules/evidence/2B20B-P2F1R-C1.md`
- ruleEvidenceSha256: `a484067a98056e83d11f9b41fadfa1140d738c811850a139075bd57cfe0650fe`
- catalogV1: `docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md`
- catalogV1Sha256: `bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26`
- parentDesign: `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-round-1.md`
- parentDesignSha256: `275b8d17f3e01d830355627de90cc526f323b117c15c6a7bfcc41d5516b832f1`
- correctionRound1: `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-correction-round-1.md`
- correctionRound1Sha256: `7aa2d382669c5957255def6ae8257b8e89e72679076df9f61a6b237fa91d4898`
- correctionRound2: `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-correction-round-2.md`
- correctionRound2Sha256: `10b06b08cf9f99f3c6e5f4161af164f8f8e48423f79cd983294a2d12f68eac3b`
- authorityAudit: `docs/architecture/2B20B-P2F1R-C1-b54-authority-resolution-audit-v1.md`
- classification: `B TYPESCRIPT_ONLY_PLACEHOLDER_UNION`
- ruleSemanticsChanged: `false`
- runtimeInputSetChanged: `false`
- behaviorChanged: `false`
- implementationAuthorized: `false`
- designReviewStatus: `PENDING_INDEPENDENT_REVIEW`

## Correction authority and bounded scope

This correction replaces only the parent statements that made the following three B54 nested unions part of the direct AST graph and described B26 as the only approved normalization delta:

1. `sourceContract[kind=BASE_MATHEMATICIAN].abilityInstance`;
2. `sourceContract[kind=PHILOSOPHER_GAINED_MATHEMATICIAN_V1].abilityInstance`;
3. `sourceContract[kind=PHILOSOPHER_GAINED_MATHEMATICIAN_V2].abilityInstance`.

For these paths only, Catalog V1 contains one surviving exact record plus three identical `R{}` arms created from impossible TypeScript intersections. The audit classifies them as `B TYPESCRIPT_ONLY_PLACEHOLDER_UNION`.

Every other parent contract remains unchanged, including:

- the 15-kind Typed Structural Schema AST as the sole runtime structural authority;
- one-way AST-derived validation with no fallback authority;
- the closed refinement whitelist and context-free predicate;
- exact records, tagged unions, closed unions, collections, literals, and diagnostics;
- Canonical Unique Node Traversal V1, DFS preorder, first-discovery ordinals, shared-node identity, cycle handling, and retained traversal reuse;
- unchanged A capture and TLV serialization;
- unchanged B `CANONICAL_VALUE_INTEGRITY` hashing;
- generated Catalog V2 as audit-only output;
- B26 Seamstress non-empty variadic compatibility;
- no event, producer, semantic validator, replay, batch, state, snapshot, projection, receipt, ledger, rule, or accepted-history behavior change;
- the implementation allowlist, rollback boundary, and prohibition on D or P2F work.

This correction does not implement code or authorize implementation.

## B54 accepted authority resolution

The authority audit is incorporated as a required design input. It freezes:

- `EventType = MathematicianInformationDelivered`;
- `BranchId = C-B54-MATHEMATICIAN-DELIVERY-U`;
- `RootSchemaId = MATHEMATICIAN_DELIVERY_SCHEMA`;
- `ResultIdentity = MathematicianInformationDeliveredPayload`;
- outer `sourceContract` as a three-member discriminated union;
- unnarrowed `FirstNightAbilityInstanceProvenance` as a four-member discriminated union;
- only the following B54 pairings:

| Outer member | Accepted nested member |
|---|---|
| `BASE_MATHEMATICIAN` | `BASE_ROLE_TASK` |
| `PHILOSOPHER_GAINED_MATHEMATICIAN_V1` | `PHILOSOPHER_GAINED_TASK_V1` |
| `PHILOSOPHER_GAINED_MATHEMATICIAN_V2` | `PHILOSOPHER_GAINED_TASK_V2` |

`EXPLICIT_DOMAIN_INSTANCE` remains a real member of the unnarrowed provenance union but is not a B54 member. The accepted producer and validator have no empty-object, explicit-domain, or cross-generation B54 path.

## Placeholder Union Normalization V1

### Protocol identity

```ts
export const DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION =
  "botc-domain-event-structural-normalization-v1" as const;

export const B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA =
  "B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA" as const;
```

`PLACEHOLDER_UNION_NORMALIZATION` is an AST-construction and compile-proof migration operation. It is not a schema node, not a sixteenth node kind, not a runtime coercion, and not a validator rule. It emits no runtime diagnostic and exposes no TypeScript-only branch to a payload consumer.

### Closed eligibility predicate

The operation is legal only when every condition below is true:

1. source artifact path and SHA equal the frozen Catalog V1 authority;
2. event, branch, root, result identity, and narrowed path equal one of the three B54 occurrences;
3. the source node is `U(EXACTLY_ONE; ...)` with exactly four arms;
4. exactly one arm is a non-empty `EXACT_RECORD` survivor;
5. exactly three arms are structurally identical exact empty records;
6. the survivor has the exact own keys, requiredness, literals, nested shapes, and provenance discriminant frozen by the accepted authority audit;
7. each removed TypeScript intersection resolves to `never` without `any`, casts, assertions, ignored errors, or manual proof constants;
8. accepted producer and validator evidence admits only the survivor;
9. the runtime positive/negative matrix proves language equality;
10. no other branch or path requests the operation.

Failure of any condition makes the AST candidate unhealthy. There is no partial normalization, heuristic detection, dynamic registration, best-effort repair, or fallback to Catalog V1.

### Exact transformation

For each eligible path:

```text
U(EXACTLY_ONE; survivor; R{}; R{}; R{})
  -> survivor
```

The source member count is exactly four per occurrence. The normalized child is exactly the surviving `EXACT_RECORD`. The three removed arms are not retained as nodes, child references, diagnostics, audit-visible runtime branches, or hidden alternate schemas.

### Resulting B54 AST

- `sourceContract` remains a `TAGGED_UNION` on `kind` with three outer branches.
- The base outer branch's `abilityInstance` child is the exact `BASE_ROLE_TASK` record.
- The gained V1 outer branch's child is the exact `PHILOSOPHER_GAINED_TASK_V1` record.
- The gained V2 outer branch's child is the exact `PHILOSOPHER_GAINED_TASK_V2` record.
- Any general, unnarrowed provenance schema remains a four-member `TAGGED_UNION`, including `EXPLICIT_DOMAIN_INSTANCE`.
- No B54 child becomes an open record, optional record, nullable record, or generic provenance union.

A future discriminant, fifth provenance member, changed outer member, changed accepted pairing, second survivor, non-identical placeholder, or V1 SHA change requires a new delta audit. It is never silently absorbed by this operation.

## Three-layer proof contract

### Layer 1 — Runtime Structural Compatibility

For each of the three paths, the implementation must prove equality between:

```text
Catalog V1 four-arm EXACTLY_ONE input language
and
normalized survivor exact-record input language
```

The proof uses the frozen positive/negative matrix. `{}` remains rejected because it matched three V1 placeholders and violates `EXACTLY_ONE`; it also fails the normalized required-field contract. A wrong-generation or explicit provenance record matched neither the survivor nor an exact empty record and remains rejected. No accepted runtime input is added or removed.

### Layer 2 — Accepted TypeScript Assignability

Define the three frozen outer-to-inner mappings as a type-level relation `AcceptedB54AbilityInstanceKind<K>`. For each outer kind `K`, all of the following must resolve to literal `true`:

```text
ExactRuntimeShape<
  InferStructuralSchema<NormalizedB54AbilityInstanceNode<K>>,
  RuntimeShape<Extract<FirstNightAbilityInstanceProvenance,
    { kind: AcceptedB54AbilityInstanceKind<K> }>>
>

ExactRuntimeShape<
  InferStructuralSchema<NormalizedB54AbilityInstanceNode<K>>,
  RuntimeShape<FirstNightAbilityInstanceProvenance &
    { kind: AcceptedB54AbilityInstanceKind<K> }>
>

ExactRuntimeShape<
  RuntimeShape<Extract<FirstNightAbilityInstanceProvenance,
    { kind: AcceptedB54AbilityInstanceKind<K> }>>,
  RuntimeShape<FirstNightAbilityInstanceProvenance &
    { kind: AcceptedB54AbilityInstanceKind<K> }>
>
```

For every nonmatching provenance member `P`, the intersection

```text
P & { kind: AcceptedB54AbilityInstanceKind<K> }
```

must resolve to `never`. This produces three survivor exactness proofs and nine impossible-member proofs.

The union of AST roots for every `DomainEventPayloadByType` key must still satisfy the parent bidirectional proof. Exactly 40 event proofs must resolve to literal `true`, including B54. B54 may not be excluded, weakened to one-way assignability, or represented by a manually maintained expected-shape map.

Forbidden proof mechanisms are:

- `any`;
- casts or single/double assertions;
- `as unknown as`;
- `@ts-ignore`, `@ts-expect-error`, disabled checks, or ignored compiler output;
- manually assigning `true` without a type constraint;
- deleting B54 from the 40-event proof;
- claiming 59/59 while omitting any B54 root or nested child;
- payload type-name strings as shape evidence.

### Layer 3 — Approved Normalization Delta

The V1 SHA-bound delta audit must prove:

- exactly two approved delta IDs;
- exactly the B26 path and the three B54 occurrences change representation;
- 57 other branches have zero structural difference;
- both approved deltas have `RuntimeInputSetChanged = false` and `BehaviorChanged = false`;
- any third delta, changed path, changed field, changed literal, or changed cardinality fails closed.

## Runtime compatibility matrix

Every row is required future evidence through the AST-derived structural path. Supporting accepted fixtures do not replace the primary assertion.

| Candidate | Expected V1 | Expected normalized AST | Reason |
|---|---|---|---|
| canonical base outer + `BASE_ROLE_TASK` | accept | accept | one survivor match |
| canonical gained V1 outer + `PHILOSOPHER_GAINED_TASK_V1` | accept | accept | one survivor match |
| canonical gained V2 outer + `PHILOSOPHER_GAINED_TASK_V2` | accept | accept | one survivor match |
| `{}` as base `abilityInstance` | reject | reject | three placeholder matches vs missing required fields |
| `{}` as gained V1 `abilityInstance` | reject | reject | same |
| `{}` as gained V2 `abilityInstance` | reject | reject | same |
| base outer + gained V1 inner | reject | reject | wrong generation/discriminant |
| base outer + gained V2 inner | reject | reject | wrong generation/discriminant |
| gained V1 outer + base inner | reject | reject | wrong generation/discriminant |
| gained V1 outer + gained V2 inner | reject | reject | wrong generation/discriminant |
| gained V2 outer + base inner | reject | reject | wrong generation/discriminant |
| gained V2 outer + gained V1 inner | reject | reject | wrong generation/discriminant |
| any outer + `EXPLICIT_DOMAIN_INSTANCE` | reject | reject | not a B54 accepted member |
| missing outer `kind` | reject | reject | union discriminator missing |
| unsupported/wrong outer `kind` | reject | reject | union discriminator unsupported |
| missing inner `kind` | reject | reject | exact provenance record incomplete |
| unsupported/wrong inner `kind` | reject | reject | no survivor match |
| survivor missing any required own key | reject | reject | exact required-field failure |
| survivor with any extra own key | reject | reject | exact-record extra-field failure |
| mixed survivor fields from two generations | reject | reject | literal/required/extra mismatch |
| `abilityInstance = undefined` | reject | reject | type mismatch/missing canonical value |
| `abilityInstance = null` | reject | reject | type mismatch |

No matrix row changes a rule, semantic validator, identity grammar, replay rule, or state transition.

## Complete approved-delta ledger

| DeltaId | Branch | Frozen path/occurrences | V1 representation | V2 AST representation | RuntimeInputSetChanged | BehaviorChanged |
|---|---|---|---|---|---:|---:|
| `B26_SEAMSTRESS_VARIADIC_DELTA` | `C-B26-SEAMSTRESS-DELIVERY-U` | `sourceEffectiveness[kind=KNOWN_INEFFECTIVE].representedImpairments` | fixed `T2` of identical evidence records | `NON_EMPTY_ARRAY`, `minItems=1`, no fixed maximum | false | false |
| `B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA` | `C-B54-MATHEMATICIAN-DELIVERY-U` | the three narrowed `sourceContract.*.abilityInstance` paths | each occurrence has four arms: one survivor plus three identical `R{}` placeholders | each occurrence directly references its survivor exact record | false | false |
| no delta | every other branch (57 total) | all nodes and paths | Catalog V1 expanded meaning | identical V2 structural meaning, subject only to shared typed-node representation | false | false |

The approved delta set is closed and has cardinality two. A third delta is an unconditional stop condition.

## Corrected expanded-occurrence census

The three B54 normalizations remove twelve expanded nodes and twelve child references from the previous proposed census: three union nodes plus nine empty-record occurrences, with four child references per occurrence. Record fields remain unchanged because all removed records are empty.

| Measure | Frozen corrected value |
|---|---:|
| events | 40 |
| roots | 59 |
| rootReferences | 59 |
| expanded nodes | 2455 |
| child references | 2396 |
| exact records | 380 |
| record fields | 2264 |
| required fields | 2264 |
| optional fields | 0 |
| arrays | 31 |
| non-empty arrays | 1 |
| bounded arrays | 0 |
| tuples | 39 |
| union nodes | 16 |
| nullable nodes | 5 |
| enums | 257 |
| literals | 588 |
| strings | 116 |
| safe integers | 487 |
| booleans | 2 |
| ID refinements | 533 |
| unresolved references | 0 |
| cycles | 0 |
| open records | 0 |
| additional-properties nodes | 0 |
| required-undefined fields | 0 |

The unique-graph census remains derived from the retained traversal after normalization. It must be deterministic, internally consistent, and published in Catalog V2; it may not replace this frozen expanded-occurrence census.

## Catalog V2 machine-checkable normalization evidence

Catalog V2 remains `GENERATED_AUDIT_ARTIFACT_NON_RUNTIME_AUTHORITY`. Production never reads or parses it. The existing section order, UTF-8/LF byte contract, escaping, six-digit ordinals, retained traversal, A TLV serialization, and B digest contracts remain unchanged.

The metadata section must contain these exact additional rows after the existing traversal-version row:

```text
M|normalizationVersion="botc-domain-event-structural-normalization-v1"
M|approvedDeltaIds=["B26_SEAMSTRESS_VARIADIC_DELTA","B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA"]
```

The V1 Migration Statement section must contain these rows in order:

```text
D|deltaId="B26_SEAMSTRESS_VARIADIC_DELTA"|branchId="C-B26-SEAMSTRESS-DELIVERY-U"|runtimeInputSetChanged=false|behaviorChanged=false
D|deltaId="B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA"|branchId="C-B54-MATHEMATICIAN-DELIVERY-U"|runtimeInputSetChanged=false|behaviorChanged=false
D|branchId="C-B54-MATHEMATICIAN-DELIVERY-U"|occurrence="BASE_MATHEMATICIAN.abilityInstance"|sourceMemberCount=4|survivorKind="BASE_ROLE_TASK"|normalizedSchemaIdentity="B54_BASE_ROLE_TASK_EXACT_RECORD_V1"
D|branchId="C-B54-MATHEMATICIAN-DELIVERY-U"|occurrence="PHILOSOPHER_GAINED_MATHEMATICIAN_V1.abilityInstance"|sourceMemberCount=4|survivorKind="PHILOSOPHER_GAINED_TASK_V1"|normalizedSchemaIdentity="B54_PHILOSOPHER_GAINED_TASK_V1_EXACT_RECORD_V1"
D|branchId="C-B54-MATHEMATICIAN-DELIVERY-U"|occurrence="PHILOSOPHER_GAINED_MATHEMATICIAN_V2.abilityInstance"|sourceMemberCount=4|survivorKind="PHILOSOPHER_GAINED_TASK_V2"|normalizedSchemaIdentity="B54_PHILOSOPHER_GAINED_TASK_V2_EXACT_RECORD_V1"
D|unchangedBranchCount=57|approvedDeltaCount=2|unexpectedDeltaCount=0
V|baselinePath="docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md"
V|baselineSha256="bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26"
```

The existing digest section supplies the V2 projection digest and exact A/B byte lengths. The generated artifact must therefore machine-bind:

- AST, projection, refinement, validator, catalog, traversal, and normalization protocol versions;
- both and only both approved delta IDs;
- V1 path and SHA;
- four source members per B54 occurrence;
- all three normalized schema identities;
- corrected censuses;
- the exact V2 digest.

The digest, traversal, node ordinals, shared-node references, TLV serialization, and SHA-256 contracts are unchanged. No second digest or renderer-local traversal is permitted.

## Supporting-authority ledger

The first two terminal IDs remain unchanged. This correction adds one legal terminal ID:

| SupportingAuthorityId | AuthorityDescription | LedgerState | Purpose | ExpectedAuthorityStatus | MutationExpectation | UsedByCriteria |
|---|---|---|---|---|---|---|
| `SUP-2B20B-P2F1R-C1-001` | `Accepted Seamstress B26 shape` | `PLANNED_SUPPORTING_AUTHORITY` | Authentic B26 cardinality support. | `ACCEPTED` | Source immutable; negative clones only. | `C1-C10` |
| `SUP-2B20B-P2F1R-C1-002` | `Immutable V1 migration baseline` | `PLANNED_SUPPORTING_AUTHORITY` | SHA-bound V1 delta baseline. | `LEGACY` | Baseline immutable; SHA/structure mutations are detached hostile clones. | `C1-C13` |
| `SUP-2B20B-P2F1R-C1-003` | `Accepted B54 Mathematician source and provenance authority` | `PLANNED_SUPPORTING_AUTHORITY` | Bind runtime-language equality and B54 delta evidence to accepted source types, producer, validator, and accepted tests without replacing the AST or compile proof. | `ACCEPTED` | Accepted HEAD and sources are immutable; negative inputs are detached clones. | `C1-C04A`, `C1-C13` |

Implementation-time binding for `SUP-2B20B-P2F1R-C1-003` must record:

- `Producer`: accepted `abilityInstanceFor` and `sourceContractFor` in `packages/domain-core/src/mathematician-internal.ts`;
- `SourceType`: `MathematicianSourceContract` and `FirstNightAbilityInstanceProvenance`;
- `Validator`: accepted `validSource` and `validateFirstNightAbilityInstanceProvenanceShape`;
- `SourceTestOrFixture`: exact accepted test paths/titles from the authority audit;
- `AuthorityStatus = ACCEPTED`;
- `UsedByCriteria = ["C1-C04A", "C1-C13"]`;
- `MutationDisposition = NONE` for the authority row; negative clones are recorded separately as `CLONE_MUTATED`.

All three authorities are supporting-only. None may replace the primary AST, runtime structural comparison, compile-time exactness proof, exact-byte comparison, V1 parser/delta comparator, or cross-platform evidence.

## Traceability V1.1 plan

`R1 = {}` and `R2 = {}`. `C1-C09` remains a historical grouping only; `C1-C09A` and `C1-C09B` are the active criteria. Every active row has exactly the nine required fields and one legal primary layer.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C1-C01 | Typed AST is the sole runtime structural authority. | No document parser, manual shape map, compiler extraction, validator fallback, or runtime catalog read. | Dependency/export audit. | R4 | T3 | PURE_POLICY_SEAM | One authority chain. | C1 designs. |
| C1-C02 | Algebra remains exactly 15 node kinds. | Exhaustive type and health evidence; normalization is not a node. | Exhaustive compile/health matrix. | R4 | T3 | PURE_POLICY_SEAM | 15/15 kinds; unknown impossible or fail closed. | Frozen AST union. |
| C1-C03 | Authority is complete, acyclic, immutable, and inventory-complete. | 40/59/13/46 and corrected censuses close; duplicate, cycle, orphan, order, and freeze faults close. | Candidate health and retained-traversal evidence. | R4 | T3 | PURE_POLICY_SEAM | Healthy or one closed failure. | Accepted inventory. |
| C1-C04A | B54 placeholder normalization preserves the runtime structural input language. | Three survivors accept; complete negative matrix rejects identically before/after normalization. | Direct equivalence vectors through the structural mechanism. | R3 | T3 | STRUCTURAL_VALIDATION | Runtime equality for all three occurrences. | `SUP-2B20B-P2F1R-C1-003`. |
| C1-C04B | AST roots match accepted payload types exactly. | 40/40 top-level proofs, 3/3 B54 survivor equalities, and 9/9 impossible remainders resolve to literal types. | Compiler exactness fixture bound directly to AST roots. | R4 | T3 | PURE_POLICY_SEAM | All proofs literal `true`; impossible members `never`. | `DomainEventPayloadByType`, accepted provenance types. |
| C1-C05 | Structural validation derives only from healthy AST. | All roots use one traversal core with no fallback. | Structural matrix and dependency audit. | R3 | T3 | STRUCTURAL_VALIDATION | Match or closed diagnostic only. | Healthy AST. |
| C1-C06 | Exact records enforce frozen missing/extra precedence. | Missing, extra, and child mutations bind to exact paths/codes. | Direct record mutation vectors. | R3 | T3 | STRUCTURAL_VALIDATION | Deterministic diagnostics. | Authenticated A backing. |
| C1-C07 | Array, non-empty array, bounded array, and tuple cardinalities remain distinct. | Boundary vectors distinguish every collection kind. | Direct cardinality vectors. | R3 | T3 | STRUCTURAL_VALIDATION | Only declared cardinality matches. | Frozen algebra. |
| C1-C08 | Tagged and closed unions remain deterministic and exclusive. | Tag dispatch and exactly-one vectors close; B54 normalized children remain exact records. | Union health/runtime vectors. | R3 | T3 | STRUCTURAL_VALIDATION | One branch or frozen diagnostic. | Union contract. |
| C1-C09A | Runtime refinements use only frozen context-free predicates. | All 16 aliases and string boundaries execute deterministically. | Direct refinement vectors. | R3 | T3 | STRUCTURAL_VALIDATION | Valid values match; invalid values fail closed. | Healthy AST and A backing. |
| C1-C09B | Refinements have no callback or semantic dependency. | Closed alias whitelist, one predicate, zero function fields/forbidden imports. | Static type/dependency audit. | R4 | T3 | PURE_POLICY_SEAM | No behavior-selecting alias or external dependency. | Rule/semantic boundary. |
| C1-C10 | B26 impairment evidence is non-empty variadic. | Lengths 1/2/3 pass; zero KNOWN_INEFFECTIVE fails; NOT_PROVEN empty tuple passes. | Accepted Seamstress vectors. | R3 | T3 | STRUCTURAL_VALIDATION | Variadic compatibility without behavior change. | `SUP-2B20B-P2F1R-C1-001`. |
| C1-C11 | Catalog V2 is deterministic audit output, never authority. | Exact bytes reproduce; runtime dependency audit has zero readers. | Golden-byte comparator and dependency audit. | R4 | T3 | PURE_POLICY_SEAM | Exact artifact; zero runtime consumers. | Healthy AST and artifact contract. |
| C1-C12 | Schema digest is integrity evidence only. | Repeated A/B path yields same digest and exposes no authority token. | Digest repetition and export audit. | R4 | T3 | PURE_POLICY_SEAM | Stable lowercase digest; no authority. | Frozen A/B contracts. |
| C1-C13 | V1 migration has exactly B26 and B54 approved deltas. | 57 branches unchanged; both deltas exact; no third delta; corrected census closes. | V1 SHA-bound parser, delta comparator, B26/B54 evidence. | R4 | T3 | PURE_POLICY_SEAM | Two approved deltas, both runtime/behavior neutral. | `SUP-2B20B-P2F1R-C1-002`; `SUP-2B20B-P2F1R-C1-003`. |
| C1-C14 | C1 changes no rule, event behavior, or persisted history. | Allowlist and semantic audits report zero forbidden changes. | Diff/allowlist audit. | R4 | T3 | PURE_POLICY_SEAM | Zero forbidden changes. | Rule evidence and accepted compatibility matrix. |
| C1-C15 | Canonical traversal, TLV bytes, digest, and catalog bytes are cross-platform deterministic. | Exact vectors agree on supported Windows and Linux environments without locale/time/path inputs. | Cross-platform exact-byte and digest evidence. | R4 | T3 | CROSS_PLATFORM_CI | Identical traversal, bytes, digest, and catalog. | Frozen traversal, A, B, and artifact protocols. |

`MIXED` and `MULTI_LAYER` are forbidden. Implementation traceability adds actual test/binding/mechanism fields without changing expected reachability, trust, primary layer, or result.

## Future implementation allowlist

This correction does not expand the parent allowlist.

Permitted C1 production files remain only:

- `packages/domain-core/src/domain-event-structural-schema-ast.ts`;
- `packages/domain-core/src/domain-event-structural-schema-validator.ts`;
- `packages/domain-core/src/domain-event-structural-schema-catalog.ts`.

Permitted C1 tests remain only:

- `packages/domain-core/src/domain-event-structural-schema-ast.test.ts`;
- `packages/domain-core/src/domain-event-structural-schema-validator.test.ts`;
- `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`.

Permitted implementation documentation remains only the generated V2 catalog, C1 implementation traceability, and one implementation-review artifact. No root export or `index.ts` change is authorized.

Still forbidden are:

- the current unaccepted C implementation or its tests;
- A or B modifications;
- event definitions or accepted payload types;
- Mathematician or Seamstress producers, validators, tests, or behavior;
- replay, batch, state, snapshot, application, projection, receipt, ledger, role, Dreamer, impairment, or No Dashii changes;
- workflow, ownership, coverage, profile, or CI changes;
- D or P2F work.

## Future implementation evidence and commands

A later separately authorized implementation must add evidence for:

1. all three survivor records and the complete compatibility matrix;
2. 3/3 survivor type equalities, 9/9 `never` remainders, and 40/40 event exactness;
3. exactly two approved delta IDs and zero unexpected deltas;
4. corrected expanded census;
5. exact Catalog V2 metadata, delta rows, traversal, digest, and bytes;
6. `SUP-2B20B-P2F1R-C1-003` binding;
7. no third normalization and no generic placeholder erasure;
8. no forbidden file or dependency change.

Local commands remain:

```text
corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-event-structural-schema-ast.test.ts
corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-event-structural-schema-validator.test.ts
corepack pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-event-structural-schema-catalog.test.ts
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
```

Hosted CI, coverage publication, ownership publication, and cross-platform publication remain later evidence stages and do not authorize implementation in this design turn.

## Stop-loss conditions

Stop immediately if:

- any B54 occurrence fails the closed eligibility predicate;
- any removed TypeScript intersection is not `never`;
- more or fewer than three placeholders occur at any B54 path;
- more than one real record survives;
- any accepted producer or validator admits a fourth B54 pairing;
- runtime-language equality cannot be proven for every matrix row;
- 40/40 exactness, 3/3 survivor equality, or 9/9 impossible-member proof does not close;
- proof requires `any`, a cast/assertion, ignored error, manual true, or B54 exclusion;
- any delta other than the two frozen IDs appears;
- corrected census, retained traversal, A TLV, B digest, or Catalog V2 bytes cannot close;
- a third normalization rule or sixteenth node kind is proposed;
- event types, accepted payload types, producers, semantic validators, A, B, accepted history, or the allowlist must change;
- implementation expands into D, P2F, workflow, ownership, coverage, or CI.

No stop-loss permits silent contract shrinkage or implementation-time interpretation.

## Rollback

Rollback of a future implementation removes only the three allowed C1 production files, three C1 tests, generated V2 catalog, implementation traceability, and implementation-review artifact. It restores no V1 runtime authority, changes no accepted event/history, and modifies no source producer or semantic validator. Catalog V1 and this audit remain immutable design evidence.

## Frozen impact flags

- runtimeInputSetChanged: `false`
- behaviorChanged: `false`
- producerChanged: `false`
- semanticValidatorChanged: `false`
- eventSchemaChanged: `false`
- persistedHistoryChanged: `false`
- replayChanged: `false`
- batchChanged: `false`
- stateChanged: `false`
- snapshotChanged: `false`
- projectionChanged: `false`
- receiptChanged: `false`
- ledgerChanged: `false`
- coverageChanged: `false`
- ruleSemanticsChanged: `false`
- roleCoverageChanged: `false`
- DStarted: `false`
- P2FStarted: `false`
- implementationAuthorized: `false`

## Independent review handoff

The independent reviewer must verify the audit classification, accepted type/member/key tables, producer/validator evidence, runtime-language equality, closed normalization predicate, proof layers, complete matrix, exact two-delta ledger, corrected census, catalog rows, supporting-authority ledger, Traceability V1.1 rows, allowlist, stop-loss, and unchanged impact flags.

This document does not supply or imply a design verdict.

READY_FOR_INDEPENDENT_C1_DESIGN_CORRECTION_ROUND_3_REVIEW
