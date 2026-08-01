# Phase 3 Slice 2B20B-P2F1R-C1 Implementation Traceability

## 1. Authority and disposition

- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_C1_IMPLEMENTATION_ONLY`
- frozen design: `docs/architecture/2B20B-P2F1R-C1-b54-atomic-delta-support-authority-traceability-correction-v2.md`
- generated Catalog V2: `docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md`
- frozen design SHA-256: `7d0ed796782e7bc2a924810585a87d88e3b8f968901af1fb8cceb423c2528fc1`
- rule evidence verdict: `RULE_READY`
- independent design verdict: `RULE_DESIGN_PASS`
- implementation disposition: `PARTIAL_CURRENT_AUTHORIZATION`
- runtime validator implementation: `NOT_AUTHORIZED_AND_NOT_IMPLEMENTED`
- slice completion claim: `NONE`
- `R1 = {}`
- `R2 = {}`

This document records only evidence produced by the current C1 AST/Catalog authorization. It does not promote validator-dependent or cross-platform criteria to `PASS`.

## 2. Criterion census

```text
baselineCriterionIdCount=18
addedChildCriterionIdCount=2
finalCriterionIdCount=20
parentGroupingHistoricalRowsCountedInFinalTotal=true
groupingOrHistoricalCriterionIds=C1-C04,C1-C09,C1-C10
activePrimaryCriterionCount=17
duplicatePrimaryIdentities=0
```

| CriterionId | Disposition | PrimaryTestIdentity | MechanismMatch | CanContributePass |
|---|---|---|---|---|
| `C1-C04` | `SUPERSEDED_BY_ATOMIC_CHILDREN` | `NONE` | `NONE` | false |
| `C1-C09` | `HISTORICAL_GROUPING_ONLY` | `NONE` | `NONE` | false |
| `C1-C10` | `SUPERSEDED_BY_C1-C04A` | `NONE` | `NONE` | false |

## 3. Active nine-field rows and implementation bindings

Every row below retains one primary layer. `NONE` means the required primary mechanism is not present; documentation or supporting authority is not substituted.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement | Actual binding | MechanismMatch |
|---|---|---|---|---|---|---|---|---|---|---|
| `C1-C01` | Typed AST is the sole runtime structural authority. | No document parser, manual shape map, compiler extraction, validator fallback, or runtime catalog read. | Dependency/export audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | One authority chain. | C1 designs. | `STATIC_AUDIT_C1_C01_AUTHORITY_CHAIN`; owned production imports; no root export. | `PASS` |
| `C1-C02` | Algebra remains exactly 15 node kinds. | Exhaustive type and health evidence; normalization is not a node. | Exhaustive compile/health matrix. | `R4` | `T3` | `PURE_POLICY_SEAM` | 15/15 kinds; unknown impossible or fail closed. | Frozen AST union. | `domain-event-structural-schema-ast.test.ts :: closes the algebra and refinement registries`. | `PASS` |
| `C1-C03` | Authority is complete, acyclic, immutable, and inventory-complete. | 40/59/13/46 and corrected censuses close; duplicate, cycle, orphan, order, and freeze faults close. | Candidate health and retained-traversal evidence. | `R4` | `T3` | `PURE_POLICY_SEAM` | Healthy or one closed failure. | Accepted inventory. | `domain-event-structural-schema-ast.test.ts :: publishes the complete healthy 40/59 authority and frozen expanded census`; negative health tests. | `PASS` |
| `C1-C04A` | B26 accepted non-empty variable-length `representedImpairments` is represented exactly by the AST without changing the accepted runtime input set or behavior. | Lengths 1/2/3 match; zero under `KNOWN_INEFFECTIVE` rejects; `NOT_PROVEN` empty tuple remains valid; accepted source remains unchanged. | Direct B26 public-shape/runtime vectors through the AST-derived structural validator. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Variadic compatibility; `RuntimeInputSetChanged=false`; `BehaviorChanged=false`. | `SUP-2B20B-P2F1R-C1-001`; SUP002 only for delta baseline. | `NONE`; planned `C1_C04A_B26_RUNTIME_PUBLIC_COMPATIBILITY` is outside this authorization. | `NONE` |
| `C1-C04B` | B54 placeholder unions normalize to three exact runtime survivors without changing accepted runtime input or behavior. | Three legal pairings accept identically; complete wrong-generation, explicit-domain, empty, missing, extra, mixed, null, and undefined matrix rejects identically. | Direct three-occurrence runtime-language equivalence through the AST-derived structural validator. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Three-survivor equality; `RuntimeInputSetChanged=false`; `BehaviorChanged=false`. | `SUP-2B20B-P2F1R-C1-003`. | `NONE`; planned `C1_C04B_B54_RUNTIME_LANGUAGE_EQUIVALENCE` is outside this authorization. | `NONE` |
| `C1-C05` | Structural validation derives only from healthy AST. | All roots use one traversal core with no fallback. | Structural matrix and dependency audit. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Match or closed diagnostic only. | Healthy AST. | `NONE`; validator production/test is absent. | `NONE` |
| `C1-C06` | Exact records enforce frozen missing/extra precedence. | Missing, extra, and child mutations bind to exact paths/codes. | Direct record mutation vectors. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Deterministic diagnostics. | Authenticated A backing. | `NONE`; validator production/test is absent. | `NONE` |
| `C1-C07` | Array, non-empty array, bounded array, and tuple cardinalities remain distinct. | Boundary vectors distinguish every collection kind. | Direct cardinality vectors. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Only declared cardinality matches. | Frozen algebra. | `NONE`; validator production/test is absent. | `NONE` |
| `C1-C08` | Tagged and closed unions remain deterministic and exclusive. | Tag dispatch and exactly-one vectors close; B54 normalized children remain exact records. | Union health/runtime vectors. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | One branch or frozen diagnostic. | Union contract. | Health-only evidence exists; runtime primary is `NONE`. | `NONE` |
| `C1-C09A` | Runtime refinements use only frozen context-free predicates. | All 16 aliases and string boundaries execute deterministically. | Direct refinement vectors. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Valid values match; invalid values fail closed. | Healthy AST and A backing. | `NONE`; validator production/test is absent. | `NONE` |
| `C1-C09B` | Refinements have no callback or semantic dependency. | Closed alias whitelist, one predicate, zero function fields/forbidden imports. | Static type/dependency audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | No behavior-selecting alias or external dependency. | Rule/semantic boundary. | `STATIC_AUDIT_C1_C09B_NO_CALLBACK_DEPENDENCY`; data-only graph rejection and 16-alias registry. | `PASS` |
| `C1-C11` | Catalog V2 is deterministic audit output, never authority. | Exact bytes reproduce; runtime dependency audit has zero readers. | Golden-byte comparator and dependency audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | Exact artifact; zero runtime consumers. | Healthy AST and artifact contract. | `domain-event-structural-schema-catalog.test.ts :: renders the full audit-only Catalog V2 without validator completion claims`; `:: matches the checked-in frozen generated Catalog V2 path byte-for-byte`. | `PASS` |
| `C1-C12` | Schema digest is integrity evidence only. | Repetition yields the same digest and exposes no authority token. | Digest repetition and export audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | Stable lowercase digest; no authority. | Frozen artifact contract. | `domain-event-structural-schema-catalog.test.ts :: creates deterministic direct-SHA artifacts over the complete authority`. | `PASS` |
| `C1-C13` | V1 migration contains exactly two runtime/behavior-neutral deltas B26/B54 and 57 unchanged branches. | Two complete ten-field records; exactly `2/57/0`; partial, missing, third, changed record/count, or missing SUP003 rejects. | SHA-bound V1 baseline plus whole-record generated registry/Catalog audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | `APPROVED_C1_DELTA_REGISTRY_V1_MATCH`; no invalid delta accepted. | Exactly SUP002 and SUP003. | `domain-event-structural-schema-catalog.test.ts :: accepts exactly the frozen two-delta, 57-unchanged registry and three supports`; six mutation cases; missing/mutated SUP003. | `PASS` |
| `C1-C14` | C1 changes no rule, event behavior, or persisted history. | Allowlist and semantic audits report zero forbidden changes. | Diff/allowlist audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | Zero forbidden changes. | Rule evidence and compatibility matrix. | `STATIC_AUDIT_C1_C14_ALLOWLIST_AND_AB_HASHES`; no event/producer/replay/state/A/B edit. | `PASS` |
| `C1-C15` | Traversal, TLV, digest, and catalog bytes are cross-platform deterministic. | Exact vectors agree on supported Windows and Linux without locale/time/path inputs. | Cross-platform exact-byte and digest evidence. | `R4` | `T3` | `CROSS_PLATFORM_CI` | Identical traversal, bytes, digest, and catalog. | Frozen traversal/A/B/artifact protocols. | Windows local evidence only; Linux CI evidence absent. | `NONE` |
| `C1-C16` | AST inference remains bidirectionally exact against all accepted payload types, including B26 and B54. | 40/40 event exactness, B26 variadic exactness, 3/3 B54 survivor equalities, and 9/9 impossible-member `never` proofs resolve from types. | Compiler exactness fixture directly bound to AST roots without `any`, suppression, casts, or B54 exclusion. | `R4` | `T3` | `PURE_POLICY_SEAM` | Every equality is literal `true`; impossible intersections are `never`. | SUP001 for B26; SUP003 for B54. | `C1_C16_AST_ACCEPTED_PAYLOAD_COMPILE_TIME_EXACTNESS`; `FULL_C1_EVENT_EXACTNESS_PROOFS`; `FULL_C1_B54_COMPILE_TIME_PROOFS`; `pnpm typecheck`. | `PASS` |

## 4. Supporting-authority ledger

| SupportingAuthorityId | Status | Legal implementation consumers | MutationDisposition |
|---|---|---|---|
| `SUP-2B20B-P2F1R-C1-001` | `ACCEPTED` | `C1-C04A`; B26 portion of `C1-C16`; B26 delta justification. | `NONE` |
| `SUP-2B20B-P2F1R-C1-002` | `LEGACY` | `C1-C13`; B26 delta baseline only. | `NONE` |
| `SUP-2B20B-P2F1R-C1-003` | `ACCEPTED` | `C1-C04B`; B54 portion of `C1-C16`; `C1-C13` B54/Catalog audit. | `NONE` |

`C1-C10` has no active consumer binding. SUP001 is not used for B54; SUP003 is not used for B26 or the other 57 branches; SUP002 does not prove runtime compatibility.

## 5. Materialized authority and test evidence

```text
eventDescriptorCount=40
payloadBranchCount=59
explicitVersionBranchCount=13
unversionedBranchCount=46
uniqueNodeCount=430
expandedNodeCount=2455
expandedChildReferenceCount=2396
approvedDeltaCount=2
unchangedBranchCount=57
otherBranchDeltaCount=0
catalogEventRows=40
catalogBranchRows=59
catalogNodeRows=430
catalogRootRows=59
catalogDeltaRows=2
catalogSupportingAuthorityRows=3
```

Focused validation at materialization time:

```text
pnpm typecheck: PASS
authorized-file eslint --max-warnings 0: PASS
domain-event-structural-schema-ast.test.ts: 11 PASS
domain-event-structural-schema-catalog.test.ts: 10 PASS
```

Final gate results and tested HEAD are recorded only after the owned files and generated documentation are mirrored to the accepted clean validation worktree and the required commands finish.
