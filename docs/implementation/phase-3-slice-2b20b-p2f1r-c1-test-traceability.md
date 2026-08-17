# Phase 3 Slice 2B20B-P2F1R-C1 Implementation Traceability

## 1. Authority and disposition

- repair authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_C1_IMPLEMENTATION_REPAIR_ROUND_1_ONLY`
- frozen design: `docs/architecture/2B20B-P2F1R-C1-b54-atomic-delta-support-authority-traceability-correction-v2.md`
- frozen design SHA-256: `7d0ed796782e7bc2a924810585a87d88e3b8f968901af1fb8cceb423c2528fc1`
- rule evidence verdict: `RULE_READY`
- independent design verdict: `RULE_DESIGN_PASS`
- implementation disposition: `PARTIAL_CURRENT_AUTHORIZATION`
- runtime validator: `NOT_AUTHORIZED_AND_NOT_IMPLEMENTED`
- slice completion claim: `NONE`
- `R1=[]`
- `R2=[]`

Only a materialized test file and exact test title can populate an actual primary binding. Static labels, documentation, controller conclusions, uncommitted files, and planned identities do not constitute tests. `MechanismMatch=PASS` below means the named executable primary plus its stated materialized support proves the frozen mechanism.

## 2. Criterion census and inactive history

```text
baselineCriterionIdCount=18
addedChildCriterionIdCount=2
finalCriterionIdCount=20
parentGroupingHistoricalRowsCountedInFinalTotal=true
groupingOrHistoricalCriterionIds=C1-C04,C1-C09,C1-C10
activePrimaryCriterionCount=17
duplicatePrimaryIdentities=0
```

| CriterionId | Disposition | ActualTestFile | ActualTestTitle | ActualPrimaryLayer | ActualReachability | ActualTrust | SupportingAuthorityId | ActualBinding | MechanismMatch |
|---|---|---|---|---|---|---|---|---|---|
| `C1-C04` | `SUPERSEDED_BY_ATOMIC_CHILDREN` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Derived grouping only; cannot contribute closure. | `NONE` |
| `C1-C09` | `HISTORICAL_GROUPING_ONLY` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Historical grouping only. | `NONE` |
| `C1-C10` | `SUPERSEDED_BY_C1-C04A` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Inactive; cannot bind executable evidence or contribute closure. | `NONE` |

## 3. Frozen design-time rows

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `C1-C01` | Typed AST is the sole runtime structural authority. | No document parser, manual shape map, compiler extraction, validator fallback, or runtime catalog read. | Dependency/export audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | One authority chain. | C1 designs. |
| `C1-C02` | Algebra remains exactly 15 node kinds. | Exhaustive type and health evidence; normalization is not a node. | Exhaustive compile/health matrix. | `R4` | `T3` | `PURE_POLICY_SEAM` | 15/15 kinds; unknown impossible or fail closed. | Frozen AST union. |
| `C1-C03` | Authority is complete, acyclic, immutable, and inventory-complete. | `40/59/13/46` and corrected censuses close; duplicate, unresolved, cycle, orphan, order, ownership, capture, and freeze faults close. | Candidate health and retained-traversal evidence. | `R4` | `T3` | `PURE_POLICY_SEAM` | Healthy detached frozen authority or one closed failure. | Accepted inventory. |
| `C1-C04A` | B26 accepted non-empty variadic shape is exact and behavior-neutral. | Lengths 1/2/3 match; zero rejects; `NOT_PROVEN` empty remains valid. | AST-derived runtime-validator vectors. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | `RuntimeInputSetChanged=false`; `BehaviorChanged=false`. | SUP001; SUP002 delta side only. |
| `C1-C04B` | B54 normalizes to three exact runtime survivors without behavior change. | Legal pairings match and complete hostile matrix rejects. | AST-derived runtime-validator equivalence vectors. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Three-survivor equality; both impact flags false. | SUP003. |
| `C1-C05` | Structural validation derives only from healthy AST. | All roots use one traversal core with no fallback. | Structural matrix and dependency audit. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Match or closed diagnostic only. | Healthy AST. |
| `C1-C06` | Exact records enforce frozen missing/extra precedence. | Missing, extra, and child mutations bind exact paths/codes. | Direct record mutation vectors. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Deterministic diagnostics. | Authenticated A backing. |
| `C1-C07` | Collection cardinalities remain distinct. | Boundary vectors distinguish array, non-empty, bounded, and tuple. | Direct cardinality vectors. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Only declared cardinality matches. | Frozen algebra. |
| `C1-C08` | Tagged and closed unions are deterministic and exclusive. | Tag dispatch and exactly-one vectors close. | Union health/runtime vectors. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | One branch or frozen diagnostic. | Union contract. |
| `C1-C09A` | Runtime refinements use only frozen context-free predicates. | All aliases and string boundaries execute deterministically. | Direct refinement runtime vectors. | `R3` | `T3` | `STRUCTURAL_VALIDATION` | Valid values match; invalid values fail closed. | Healthy AST and A backing. |
| `C1-C09B` | Refinements have no callback or semantic dependency. | Closed alias whitelist, exact refinement variants, zero function fields, and only frozen type dependencies. | Executable source/dependency/data-only audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | No behavior-selecting alias or external semantic dependency. | Rule/semantic boundary. |
| `C1-C11` | Catalog V2 is deterministic audit output, never authority. | Exact bytes reproduce and runtime consumers remain absent. | Golden-byte comparator and dependency audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | Exact artifact; zero authority. | Healthy AST and artifact contract. |
| `C1-C12` | Schema digest is integrity evidence only. | Repetition yields the same digest and no authority token. | Digest repetition and export audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | Stable lowercase digest; no authority. | Frozen artifact contract. |
| `C1-C13` | V1 migration has exactly B26/B54 deltas and 57 unchanged branches. | SHA-bound V1 parser proves two exact ten-field records and `2/57/0`, rejecting missing/corrupt/changed baseline and all registry mutations. | SHA-bound Catalog V1 parser plus whole-record generated audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | `APPROVED_C1_DELTA_REGISTRY_V1_MATCH`. | Exactly SUP002 and SUP003. |
| `C1-C14` | C1 changes no rule, event behavior, or persisted history. | Allowlist and semantic audit report zero forbidden changes. | Diff/allowlist audit. | `R4` | `T3` | `PURE_POLICY_SEAM` | Zero forbidden changes. | Rule evidence and compatibility matrix. |
| `C1-C15` | Traversal, TLV, digest, and catalog bytes are cross-platform deterministic. | Supported Windows and Linux exact vectors agree. | Cross-platform exact-byte and digest evidence. | `R4` | `T3` | `CROSS_PLATFORM_CI` | Identical traversal, bytes, digest, and catalog. | Frozen protocols. |
| `C1-C16` | AST inference is bidirectionally exact against accepted payload types. | 40/40 event, B26, B54 survivor, and impossible-member proofs resolve. | Compiler exactness fixture directly bound to AST roots. | `R4` | `T3` | `PURE_POLICY_SEAM` | Every equality is literal `true`; impossible intersections are `never`. | SUP001 and SUP003. |

## 4. Implementation-time actual bindings

| CriterionId | ActualTestFile | ActualTestTitle | ActualPrimaryLayer | ActualReachability | ActualTrust | SupportingAuthorityId | ActualBinding | MechanismMatch |
|---|---|---|---|---|---|---|---|---|
| `C1-C01` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | No separately materialized dependency/export primary. | `NONE` |
| `C1-C02` | `packages/domain-core/src/domain-event-structural-schema-ast.test.ts` | `accepts an exact healthy fixture for every one of the 15 node kinds` | `PURE_POLICY_SEAM` | `R4` | `T3` | `NONE` | Primary covers all 15 healthy variants; supporting titles cover closed registries and unknown/missing/cross-kind refinement rejection. | `PASS` |
| `C1-C03` | `packages/domain-core/src/domain-event-structural-schema-ast.test.ts` | `closes the complete health, ownership, traversal, and freeze-fault matrix` | `PURE_POLICY_SEAM` | `R4` | `T3` | `NONE` | Exact inventory/census, detached ownership, recursive freeze, root/repository permutation, duplicate-object, unresolved, cycle, orphan, and revoked-proxy fail-closed matrix. | `PASS` |
| `C1-C04A` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Runtime validator outside authorization. | `NONE` |
| `C1-C04B` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Runtime validator outside authorization. | `NONE` |
| `C1-C05` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Runtime validator absent. | `NONE` |
| `C1-C06` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Runtime validator absent. | `NONE` |
| `C1-C07` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Runtime validator absent. | `NONE` |
| `C1-C08` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Health support exists, but required runtime primary is absent. | `NONE` |
| `C1-C09A` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Runtime validator absent. | `NONE` |
| `C1-C09B` | `packages/domain-core/src/domain-event-structural-schema-ast.test.ts` | `proves the refinement registry is data-only and has no semantic callback dependency` | `PURE_POLICY_SEAM` | `R4` | `T3` | `NONE` | Executable source import audit plus complete authority graph descriptor scan and closed 16-alias assertion. | `PASS` |
| `C1-C11` | `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts` | `matches the checked-in frozen generated Catalog V2 path byte-for-byte` | `PURE_POLICY_SEAM` | `R4` | `T3` | `NONE` | Golden bytes; canonical root-permutation test is materialized supporting evidence. | `PASS` |
| `C1-C12` | `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts` | `creates deterministic direct-SHA artifacts over the complete authority` | `PURE_POLICY_SEAM` | `R4` | `T3` | `NONE` | Direct SHA-256 over canonical bytes, repeat equality, recursive artifact freeze. | `PASS` |
| `C1-C13` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `PENDING`: Catalog V1 is absent from commit `75440688221d748558ec69c4aefcd966af2a1285`; the untracked old-C copy is not accepted evidence and is not restored or staged. In-memory constant comparison cannot prove the SHA-bound 59-branch V1 mechanism. | `NONE` |
| `C1-C14` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Commit/diff audit is reported separately, not fabricated as a physical test. | `NONE` |
| `C1-C15` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | `NONE` | Hosted cross-platform CI is outside this repair. | `NONE` |
| `C1-C16` | `packages/domain-core/src/domain-event-structural-schema-ast.test.ts` | `publishes the complete healthy 40/59 authority and frozen expanded census` | `PURE_POLICY_SEAM` | `R4` | `T3` | `SUP-2B20B-P2F1R-C1-001; SUP-2B20B-P2F1R-C1-003` | Runtime assertions bind `FULL_C1_EVENT_EXACTNESS_PROOFS` and `FULL_C1_B54_COMPILE_TIME_PROOFS`; compile-time authority remains the `satisfies` declarations verified by `pnpm typecheck`. | `PASS` |

## 5. Supporting-authority ledger

| SupportingAuthorityId | Status | Legal consumers | MutationDisposition |
|---|---|---|---|
| `SUP-2B20B-P2F1R-C1-001` | `ACCEPTED` | C04A; B26 portion of C16; B26 delta justification. | `NONE` |
| `SUP-2B20B-P2F1R-C1-002` | `LEGACY` | C13 and B26 delta baseline only. The referenced V1 artifact is unavailable in the reviewed commit. | `NONE` |
| `SUP-2B20B-P2F1R-C1-003` | `ACCEPTED` | C04B; B54 portion of C16; C13 B54/Catalog audit. B54-only. | `NONE` |

SUP001 is never used for B54; SUP003 is never used for B26 or another branch; SUP002 never proves runtime compatibility. Catalog and registry remain audit-only and never feed runtime authority.

## 6. Materialized authority and repair evidence

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
RuntimeInputSetChanged=false
BehaviorChanged=false
```

Repair Round 1 focused evidence is recorded only from the final tested repair commit. Coverage, hosted CI, Windows, D, and C-validator tests are excluded by authorization and are not acceptance evidence for this repair.
