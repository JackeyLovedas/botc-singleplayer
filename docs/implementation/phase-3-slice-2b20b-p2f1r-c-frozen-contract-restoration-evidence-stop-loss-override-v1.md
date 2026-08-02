# Phase 3 Slice 2B20B-P2F1R-C Frozen Contract Restoration and Evidence Closure Stop-Loss Override V1

## Metadata

- `authorization`: `USER_AUTHORIZED_2B20B_P2F1R_C_FROZEN_CONTRACT_RESTORATION_EVIDENCE_CLOSURE_STOP_LOSS_OVERRIDE_AND_LOCAL_TECHNICAL_FREEZE`
- `overrideBaseHead`: `52ab1e483328cb05a16606a7d1976dc4e378b038`
- `reviewedDesign`: `docs/architecture/2B20B-P2F1R-C-domain-event-structural-validation-recovery-design-correction-v3.md`
- `reviewedDesignSha256`: `342cc8c432a5c771a4804bf0d38cb199adb70741021f4e6356d37d0236e86496`
- `exactReviewSource`: complete untruncated independent Code Review returned for `reviewedHead=52ab1e483328cb05a16606a7d1976dc4e378b038` at `reviewTimestamp=2026-08-02T20:49:37.2598504+08:00`; the original was supplied directly by the controller and is not represented as a repository archive
- `exactFindings`: `C-R2-F01_SECTION12_EVIDENCE_MATRIX_INCOMPLETE`, `C-R2-F02_CALLABLE_LEAF_MECHANISM_MATCH_FALSE`, `C-R2-F03_F20_FIRST_FAILURE_ORDER_DIVERGES_FROM_FROZEN_DESIGN`, `C-R2-F04_STATIC_LEAF_EVIDENCE_NOT_EXACT`, `C-R2-F05_TRACEABILITY_PRIMARY_BINDINGS_ARE_NOT_ALL_REAL_SYMBOLS`
- `CComponentRepairRound`: `2/2`
- `CComponentRepairRoundConsumed`: `true`
- `CComponentRepairStopLossReached`: `true`
- `stopLossOverrideCorrection`: `1/1`
- `stopLossOverrideUsed`: `true`
- `overrideKind`: `FROZEN_CONTRACT_RESTORATION_AND_EVIDENCE_CLOSURE_ONLY`
- `newCComponentRepairRoundCreated`: `false`
- `productBehaviorChanged`: `false`
- `ruleSemanticsChanged`: `false`
- `eventSchemaChanged`: `false`
- `eventDefinitionsChanged`: `false`
- `semanticValidatorChanged`: `false`
- `AChanged`: `false`
- `BChanged`: `false`
- `C1Changed`: `false`
- `implementationAuthorized`: `true`

This is not Design Round 4 and not C Component Repair Round 3. It may restore only the already reviewed V3 contract and materialize evidence already required by that contract. It does not authorize D, P2F, publication, coverage, hosted CI, or any BOTC/product semantics.

## Exact finding mapping

| Finding | Exact file | Exact symbol, test, or row | Actual behavior or evidence at override base | Frozen requirement | Required bounded delta |
|---|---|---|---|---|---|
| `C-R2-F01_SECTION12_EVIDENCE_MATRIX_INCOMPLETE` | `packages/domain-core/src/domain-event-structural-validator.test.ts`; implementation traceability | `C-C02`, `C-C03c`, `C-C05`, `C-C06a`; corresponding active traceability rows | C-C02 omitted applicable envelope variants and exact observer/diagnostic tuples; C-C03c asserted only the census; C-C05 sampled six gates without the complete F02/F03/F05/F07-F13 tuple; C-C06a did not prove all 35 singleton roots read zero discriminants | V2 section 7 plus V3 section 5 require the complete Section 12 evidence matrix | Add executable 14-field cases, real admission-to-public-dispatch evidence, complete pre-payload observer tuples, all-singleton zero-read evidence, and a complete evidence table |
| `C-R2-F02_CALLABLE_LEAF_MECHANISM_MATCH_FALSE` | `packages/domain-core/src/domain-event-structural-validator.test.ts`; implementation traceability | `C-C15b`; `C-C15c`; active row `C-C15b` | C-C15b collected a set of 31 leaf IDs, but several leaves were invoked through package-private node/refinement test seams and the test did not prove each complete public tuple, budget, determinism, coordinate, or nonleakage | V3 sections 3-5 require 31 distinct callable leaf cases through the real boundary with the entire public diagnostic and read evidence | Replace the leaf-set census with 31 explicit real-entry cases, exact expected tuple and repeat/nonleak assertions; retain the nine tagged subset as additional evidence |
| `C-R2-F03_F20_FIRST_FAILURE_ORDER_DIVERGES_FROM_FROZEN_DESIGN` | `packages/domain-core/src/domain-event-structural-validator.ts` | `traverseNode`, `TAGGED_UNION` branch | Branch ordinal validity was checked only after discriminator lookup, coordinate construction, primitive-kind processing, and before/while literal matching; L24 or F26 could therefore precede L23 | V3 section 3.3 freezes first failure as L20, L21, L22, L23, L24, L25 | Move the complete tagged-variant ordinal invariant guard before coordinate construction and every F26 branch; preserve all later gates and budgets |
| `C-R2-F04_STATIC_LEAF_EVIDENCE_NOT_EXACT` | `packages/domain-core/src/domain-event-structural-validator.test.ts`; implementation traceability | `C-C15d`; active row `C-C15d` | The test checked policy count, nonempty binding text, and generic source containment; a constant declaration could satisfy it without proving a branch or return | V3 sections 3 and 5 require one exact symbol/branch/policy/fail-closed/no-fallthrough binding for each of 16 static leaves | Add a closed 16-row static evidence table and executable source-symbol, branch, policy, return, uniqueness, F20-order, and F28-only audits |
| `C-R2-F05_TRACEABILITY_PRIMARY_BINDINGS_ARE_NOT_ALL_REAL_SYMBOLS` | `docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md` | all 28 active rows, especially `C-C15b`, `C-C15d`, `C-C16`-`C-C19` | Several `ProductionEntry` cells were descriptions rather than current source symbols; the parser did not validate symbol identity or exact collected title identity | Traceability V1.1 requires one real primary identity per active row, actual source/test bindings, semantic mechanism match, and grouping rows without active identity or PASS | Bind every active row to a current exact symbol and verbatim physical Vitest title; add parser/semantic audits and recompute all counts |

The complete review contained no sixth blocker. A sixth independent blocker discovered during this override is a stop condition, not additional implementation authority.

## F20 frozen first-failure restoration

### Base implementation order

| Observed order | Guard in `traverseNode` `TAGGED_UNION` | Possible result |
|---:|---|---|
| 1 | input is `OBJECT` and event branch ordinal is valid | F23 or L22/F20 |
| 2 | locate the discriminator entry | proceed |
| 3 | construct a missing-field coordinate | L24/F20 or L36/F26 |
| 4 | validate located entry coordinate | L24/F20 |
| 5 | classify primitive kind and construct wrong-kind coordinate | L24/F20 or L37/F26 |
| 6 | iterate branch tuple while checking `branchOrdinal` | L23/F20 |
| 7 | build unknown/known coordinate and handle multiple literal match | L24/F20, L38/F26, or L25/F20 |

The base order permits L24 or F26 before L23 when the same input also carries an invalid frozen tagged-variant ordinal.

### Frozen V3 order

| Order | Guard | Failure context | Diagnostic | Payload read budget |
|---:|---|---|---|---|
| 1 | node ID exists in admitted node lookup | L20 / F20 | `INVALID_AST_NODE / INTERNAL` at current bounded path | prior selected-AST reads only |
| 2 | node ID has exactly one dense `AstNodeOrdinal` | L21 / F20 | `INVALID_AST_NODE / INTERNAL` at current bounded path | before node execution |
| 3 | selected root has valid `EventBranchOrdinal` 1..59 | L22 / F20 | `INVALID_AST_NODE / INTERNAL` at `[]` | before AST traversal |
| 4 | every frozen tagged branch has its exact dense `TaggedVariantOrdinal` | L23 / F20 | `INVALID_AST_NODE / INTERNAL` at tagged-union path | no discriminator/child read |
| 5 | authenticated discriminator coordinate is constructible and one-based | L24 / F20 | `INVALID_AST_NODE / INTERNAL` at tagged-union path | tag lookup only; no child entry |
| 6 | at most one frozen tagged literal matches | L25 / F20 | `INVALID_AST_NODE / INTERNAL` at tagged-union path | tag read only; no child entry |

Only the L23 guard moves ahead of coordinate/F26 work. L20-L22 remain in their existing earlier positions; L24-L25 and all public F26/known-child behavior remain after it. F28 remains closed-union multiple-match only. No accepted event or payload language changes.

## Closure records to materialize

- `F01`: complete Section 12 evidence, including the exact 14-field matrix, all pre-payload tuples, 35 singleton zero-discriminator cases, and real public dispatch.
- `F02`: 31 callable leaf cases through the formal public/package boundary with exact tuple, budget, coordinate, repeat, and nonleak assertions.
- `F03`: frozen L20-L25 first-failure priority, including multi-invalid and insertion-order-independent proof.
- `F04`: 16 exact static source-symbol/branch/policy/fail-closed bindings.
- `F05`: Traceability V1.1 bindings to actual symbols and verbatim collected Vitest titles, with deterministic census/audit.

No future source commit SHA or future review verdict is recorded in this document.

## Section 12 implementation evidence matrix

The exact source is V2 section 7 as inherited and tightened by the frozen V3 sections 3-5. `Quarantine` is the frozen `quarantineRecommended` value. The primary evidence title is `C-C15b binds all 31 callable diagnostic leaves to real failure entry points` for callable rows and `C-C15d binds all 16 static leaves to exact fail-closed source guards` for static rows.

| ContextId | Callable or Static | Public Trigger / Exact Branch | Code | Phase | Path | Summary | Quarantine | Retryable | Read Budget | Primary Evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| `L01_F01_AUTHORITY_UNHEALTHY` / `F01` | Static | `admitC1Authority` | `C1_AUTHORITY_UNHEALTHY` | `AUTHORITY_ADMISSION` | `EMPTY` | `AUTHORITY_UNAVAILABLE` | `true` | `AFTER_PROCESS_RESTART` | `ZERO` | `C-C15d` |
| `L02_F02_CAPTURE_CORRECTABLE` / `F02` | Callable | `validateDomainEventStructureWithObservationForTest(undefined)` | `CAPTURE_REJECTED` | `CAPTURE` | `A_PATH` | `INPUT_CAPTURE_FAILED` | `false` | `AFTER_INPUT_CORRECTION` | `A_ONLY` | `C-C15b` |
| `L03_F03_CAPTURE_HOSTILE` / `F03` | Callable | getter/revoked Proxy through public capture | `CAPTURE_REJECTED` | `CAPTURE` | `A_PATH` | `INPUT_CAPTURE_FAILED` | `true` | `AFTER_INPUT_CORRECTION` | `A_ONLY` | `C-C15b` |
| `L04_F04_CAPTURE_INTERNAL` / `F04` | Static | `translateCaptureFailure.internal` | `CAPTURE_REJECTED` | `CAPTURE` | `EMPTY` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `ZERO` | `C-C15d` |
| `L05_F05_CAPTURE_TOKEN_INVALID` / `F05` | Callable | `validateCapturedDomainEventStructureWithObservationForTest({})` | `INVALID_CAPTURE_TOKEN` | `BACKING_AUTHENTICATION` | `EMPTY` | `CAPTURE_TOKEN_REJECTED` | `true` | `NEVER` | `ZERO` | `C-C15b` |
| `L06_F06_CAPTURE_BACKING_MISSING` / `F06` | Static | `validateCapturedInternal.backingMissing` | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE` | `BACKING_AUTHENTICATION` | `EMPTY` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `ZERO` | `C-C15d` |
| `L07_F07_ENVELOPE_NOT_OBJECT` / `F07` | Callable | captured `null` envelope | `INVALID_ENVELOPE` | `ENVELOPE` | `EMPTY` | `ENVELOPE_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `NO_PAYLOAD` | `C-C15b` |
| `L08_F08_ENVELOPE_FIELD_MISSING` / `F08` | Callable | exact 14-field omission matrix | `MISSING_REQUIRED_FIELD` | `ENVELOPE` | `ENVELOPE_FIELD` | `ENVELOPE_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `NO_PAYLOAD` | `C-C15b` |
| `L09_F09_ENVELOPE_FIELD_EXTRA` / `F09` | Callable | exact envelope extra entry | `EXTRA_FIELD` | `ENVELOPE` | `ENVELOPE_EXTRA` | `ENVELOPE_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `NO_PAYLOAD` | `C-C15b` |
| `L10_F10_ENVELOPE_FIELD_WRONG_KIND` / `F10` | Callable | 14-field wrong-kind matrix | `INVALID_FIELD_TYPE` | `ENVELOPE` | `ENVELOPE_FIELD` | `ENVELOPE_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `NO_PAYLOAD` | `C-C15b` |
| `L11_F11_ENVELOPE_FIELD_INVALID_VALUE` / `F11` | Callable | literal/trimmed-ID invalid value | `INVALID_FIELD_VALUE` | `ENVELOPE` | `ENVELOPE_FIELD` | `ENVELOPE_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `NO_PAYLOAD` | `C-C15b` |
| `L12_F12_EVENT_TYPE_UNKNOWN` / `F12` | Callable | `eventType=FutureEvent` | `UNKNOWN_EVENT_TYPE` | `EVENT_DISPATCH` | `ENVELOPE_7` | `EVENT_TYPE_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `NO_PAYLOAD` | `C-C15b` |
| `L13_F13_EVENT_VERSION_UNSUPPORTED` / `F13` | Callable | `eventVersion=2` | `UNSUPPORTED_EVENT_VERSION` | `VERSION_DISPATCH` | `ENVELOPE_8` | `EVENT_VERSION_REJECTED` | `false` | `NEVER` | `NO_PAYLOAD` | `C-C15b` |
| `L14_F14_PAYLOAD_NOT_OBJECT` / `F14` | Callable | scalar payload | `INVALID_FIELD_TYPE` | `PAYLOAD_ACQUISITION` | `ENVELOPE_14` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `NODE_ONLY` | `C-C15b` |
| `L15_F15_ROOT_DISCRIMINATOR_MISSING` / `F15` | Callable | required dispatch discriminator omitted | `INVALID_PAYLOAD_DISCRIMINANT` | `PAYLOAD_DISCRIMINANT` | `ROOT_DISCRIMINATOR` | `PAYLOAD_DISCRIMINANT_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `DISCRIMINATOR_ONLY` | `C-C15b` |
| `L16_F16_ROOT_DISCRIMINATOR_WRONG_KIND` / `F16` | Callable | object discriminator | `INVALID_PAYLOAD_DISCRIMINANT` | `PAYLOAD_DISCRIMINANT` | `ROOT_DISCRIMINATOR` | `PAYLOAD_DISCRIMINANT_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `DISCRIMINATOR_ONLY` | `C-C15b` |
| `L17_F17_ROOT_DISCRIMINATOR_UNKNOWN` / `F17` | Callable | `FUTURE` discriminator | `INVALID_PAYLOAD_DISCRIMINANT` | `PAYLOAD_DISCRIMINANT` | `ROOT_DISCRIMINATOR` | `PAYLOAD_DISCRIMINANT_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `DISCRIMINATOR_ONLY` | `C-C15b` |
| `L18_F18_ROOT_SELECTION_ZERO` / `F18` | Static | `selectBranch` missing selected case invariant | `INVALID_PAYLOAD_BRANCH` | `PAYLOAD_DISCRIMINANT` | `ENVELOPE_14` | `PAYLOAD_BRANCH_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `DISCRIMINATOR_ONLY` | `C-C15d` |
| `L19_F19_ROOT_SELECTION_MULTIPLE` / `F19` | Static | `selectBranch` multiple cases invariant | `INVALID_PAYLOAD_BRANCH` | `PAYLOAD_DISCRIMINANT` | `ENVELOPE_14` | `AMBIGUOUS_BRANCH` | `true` | `NEVER` | `DISCRIMINATOR_ONLY` | `C-C15d` |
| `L20_F20_AST_NODE_LOOKUP_MISSING` / `F20` | Static | `traverseNode.nodeLookup` | `INVALID_AST_NODE` | `INTERNAL` | `CURRENT` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `PRIOR_AST` | `C-C15d` |
| `L21_F20_AST_NODE_ORDINAL_LOOKUP_MISSING` / `F20` | Static | `traverseNode.nodeOrdinal` | `INVALID_AST_NODE` | `INTERNAL` | `CURRENT` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `BEFORE_NODE` | `C-C15d` |
| `L22_F20_EVENT_BRANCH_ORDINAL_INVALID` / `F20` | Static | `validateCapturedInternal.eventBranchOrdinal` | `INVALID_AST_NODE` | `INTERNAL` | `EMPTY` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `BEFORE_AST` | `C-C15d` |
| `L23_F20_TAGGED_VARIANT_ORDINAL_INVALID` / `F20` | Static | `traverseNode.taggedVariantOrdinal` before any tag lookup | `INVALID_AST_NODE` | `INTERNAL` | `TAGGED_PATH` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `TAG_ONLY` (observed `0`) | `C-C15d` |
| `L24_F20_TAGGED_FIELD_COORDINATE_INVARIANT` / `F20` | Static | `traverseNode.taggedFieldCoordinate` | `INVALID_AST_NODE` | `INTERNAL` | `TAGGED_PATH` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `TAG_ONLY` | `C-C15d` |
| `L25_F20_TAGGED_MULTIPLE_LITERAL_MATCH` / `F20` | Static | `traverseNode.taggedMultiple` | `INVALID_AST_NODE` | `INTERNAL` | `TAGGED_PATH` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `TAG_ONLY` | `C-C15d` |
| `L26_F21_RECORD_MISSING_PLAIN` / `F21` | Callable | authentic root 1, omit `aiPlayerCount` | `MISSING_REQUIRED_FIELD` | `AST_TRAVERSAL` | `FIELD` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `SELECTED_AST` | `C-C15b` |
| `L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT` / `F21` | Callable | authentic root 20 tagged child omission | `MISSING_REQUIRED_FIELD` | `AST_TRAVERSAL` | `VARIANT_FIELD` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `SELECTED_CHILD` | `C-C15b` |
| `L28_F22_RECORD_EXTRA_PLAIN` / `F22` | Callable | authentic root 1 extra payload field | `EXTRA_FIELD` | `AST_TRAVERSAL` | `EXTRA` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `SELECTED_AST` | `C-C15b` |
| `L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT` / `F22` | Callable | authentic root 20 tagged child extra | `EXTRA_FIELD` | `AST_TRAVERSAL` | `VARIANT_EXTRA` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `SELECTED_CHILD` | `C-C15b` |
| `L30_F23_KIND_MISMATCH_PLAIN` / `F23` | Callable | authentic root 1 `gameId` wrong kind | `INVALID_FIELD_TYPE` | `AST_TRAVERSAL` | `CURRENT` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `SELECTED_AST` | `C-C15b` |
| `L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT` / `F23` | Callable | authentic root 20 tagged `grantId` wrong kind | `INVALID_FIELD_TYPE` | `AST_TRAVERSAL` | `VARIANT_CURRENT` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `SELECTED_CHILD` | `C-C15b` |
| `L32_F24_LITERAL_MISMATCH_PLAIN` / `F24` | Callable | authentic root 2 edition literal mutation | `INVALID_FIELD_VALUE` | `AST_TRAVERSAL` | `CURRENT` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `SELECTED_AST` | `C-C15b` |
| `L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT` / `F24` | Callable | authentic root 20 tagged literal mutation | `INVALID_FIELD_VALUE` | `AST_TRAVERSAL` | `VARIANT_CURRENT` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `SELECTED_CHILD` | `C-C15b` |
| `L34_F25_CARDINALITY_MISMATCH_PLAIN` / `F25` | Callable | authentic root 11 array cardinality mutation | `INVALID_PAYLOAD_STRUCTURE` | `AST_TRAVERSAL` | `CURRENT` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `SELECTED_AST` | `C-C15b` |
| `L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT` / `F25` | Callable | authentic root 53 B26 variadic array empty | `INVALID_PAYLOAD_STRUCTURE` | `AST_TRAVERSAL` | `VARIANT_CURRENT` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `SELECTED_CHILD` | `C-C15b` |
| `L36_F26_TAGGED_DISCRIMINATOR_MISSING` / `F26` | Callable | authentic root 20 tag omitted | `INVALID_PAYLOAD_STRUCTURE` | `AST_TRAVERSAL` | `TAGGED_PATH` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `NO_CHILD` | `C-C15b` |
| `L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND` / `F26` | Callable | authentic root 20 tag object | `INVALID_PAYLOAD_STRUCTURE` | `AST_TRAVERSAL` | `TAGGED_FIELD` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `NO_CHILD` | `C-C15b` |
| `L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN` / `F26` | Callable | authentic root 20 unknown tag | `INVALID_PAYLOAD_STRUCTURE` | `AST_TRAVERSAL` | `TAGGED_FIELD` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `NO_CHILD` | `C-C15b` |
| `L39_F27_CLOSED_UNION_ZERO_MATCH` / `F27` | Callable | authentic root 10 closed-union no-match object | `INVALID_PAYLOAD_STRUCTURE` | `AST_TRAVERSAL` | `CURRENT` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `ALL_CLOSED_BRANCHES` | `C-C15b` |
| `L40_F28_CLOSED_UNION_MULTIPLE_MATCH` / `F28` | Static | `traverseNode.closedMultiple` only | `AMBIGUOUS_UNION` | `AST_TRAVERSAL` | `CURRENT` | `PAYLOAD_REJECTED` | `true` | `NEVER` | `ALL_CLOSED_BRANCHES` | `C-C15d` |
| `L41_F29_REFINEMENT_REJECTED_PLAIN` / `F29` | Callable | authentic root 1 blank `gameId` refinement | `INVALID_REFINEMENT` | `AST_TRAVERSAL` | `CURRENT` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `ONE_PREDICATE` | `C-C15b` |
| `L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT` / `F29` | Callable | authentic root 20 blank tagged `grantId` | `INVALID_REFINEMENT` | `AST_TRAVERSAL` | `VARIANT_CURRENT` | `PAYLOAD_REJECTED` | `false` | `AFTER_INPUT_CORRECTION` | `ONE_PREDICATE` | `C-C15b` |
| `L43_F30_REFINEMENT_METADATA_INVALID` / `F30` | Static | `executeRefinement.metadata` | `INVALID_REFINEMENT` | `INTERNAL` | `CURRENT` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `NO_SEMANTIC_READ` | `C-C15d` |
| `L44_F31_BACKING_CONSTRUCTION_FAILED` / `F31` | Static | `validateCapturedInternal.backingConstruction` | `VALIDATED_BACKING_CONSTRUCTION_FAILED` | `BACKING_CONSTRUCTION` | `EMPTY` | `BACKING_CONSTRUCTION_FAILED` | `true` | `AFTER_PROCESS_RESTART` | `TRAVERSAL_COMPLETE` | `C-C15d` |
| `L45_F32_TOKEN_ISSUE_FAILED` / `F32` | Static | `issueStructurallyValidatedDomainEvent` fail-closed catch | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE` | `TOKEN_ISSUE` | `EMPTY` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `BACKING_COMPLETE` | `C-C15d` |
| `L46_F33_TOKEN_INVALID` / `F33` | Callable | `readStructurallyValidatedDomainEvent({})` | `INVALID_STRUCTURAL_TOKEN` | `TOKEN_CONSUMPTION` | `EMPTY` | `STRUCTURAL_TOKEN_REJECTED` | `true` | `NEVER` | `ZERO` | `C-C15b` |
| `L47_F34_INTERNAL_CONTAINMENT` / `F34` | Static | `validateDomainEventStructure` public outer catch | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE` | `INTERNAL` | `EMPTY` | `INTERNAL_FAILURE` | `true` | `AFTER_PROCESS_RESTART` | `CATCH_BOUND` | `C-C15d` |

### Matrix census

- `diagnosticLeafCount`: `47`
- `publicContextCount`: `34`
- `callableLeafCount`: `31`
- `staticLeafCount`: `16`
- `missingLeafCount`: `0`
- `duplicateLeafCount`: `0`
- `orphanLeafCount`: `0`
- `diagnosticCodeCount`: `19`
- `primaryCallableEvidence`: formal public/package boundary only; the 16 authentic AST cases are frozen to exact root ordinals and mutation paths in C-C15b
- `primaryStaticEvidence`: closed 16-row exact symbol/branch regex audit plus policy uniqueness and fail-closed return

## Exact envelope and dispatch closure

- The 14-field executable matrix contains `84` named cases: every field has missing, null, empty/whitespace where applicable, wrong-kind, and accepted/current-policy cases.
- All six branded IDs prove empty/whitespace rejection and whitespace-preserving valid input.
- `rulesBaselineVersion` and `createdAt` prove empty/whitespace acceptance without normalizing accepted behavior.
- Integer fields prove negative and zero remain structurally accepted; event version proves only `1` is supported.
- The payload row distinguishes missing/scalar rejection from `{}` reaching the selected AST at payload ordinal 1.
- All 35 singleton roots prove zero discriminator reads before AST traversal; all 24 discriminated roots prove the frozen seven-path read counts.
- F02/F03/F05/F07-F13 each have an exact full observation tuple and zero payload-node/discriminator/content/AST/token activity.
- C-C03c proves the admitted default authority is consumed by a real successful `validateDomainEventStructureWithObservationForTest` call.

## F20 executable restoration evidence

The C-C15d multi-invalid fixture combines an invalid tagged `branchOrdinal` with missing, wrong, and unknown tag shapes in different insertion orders. Every case returns `L23_F20_TAGGED_VARIANT_ORDINAL_INVALID`, `path=[]`, `taggedUnionCoordinate=null`, and `payloadContentReads=0`; all results are byte-for-byte structurally equal. This proves L23 precedes L24 and all three F26 leaves without introducing a production fault-injection hook.

## Traceability closure census

- `groupingCriterionCount`: `5`
- `activeCriterionCount`: `28`
- `totalCriterionCount`: `33`
- `primaryPhysicalIdentityCount`: `28`
- `uniquePhysicalIdentityCount`: `28`
- `duplicatePrimaryIdentityCount`: `0`
- `borrowedPrimaryIdentityCount`: `0`
- `missingPrimaryIdentityCount`: `0`
- `invalidPrimarySymbolCount`: `0`
- `invalidPhysicalTestCount`: `0`
- `MechanismMatch`: `28/28 PASS`
- grouping rows: `GROUPING_ONLY`, never `PASS`
- `R1=[]`; `R2=[]`

All five authorized findings are represented by executable or exact static evidence. No sixth blocker was discovered, no fourth production file was opened, and no A/B/C1/event-definition/semantic-validator file was modified.
