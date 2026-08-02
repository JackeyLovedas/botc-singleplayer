# Phase 3 Slice 2B20B-P2F1R-C Recovery Design Correction V2

## 1. Authority and frozen status

- `authorization`: `USER_AUTHORIZED_2B20B_P2F1R_C_TAGGED_UNION_DIAGNOSTIC_COORDINATE_DESIGN_CORRECTION_REPAIR_ROUND_2_AND_LOCAL_CLOSURE`
- `correctionBaseHead`: `57a14cc2c1dff7048c10aac479bfeafa8e0e8d5a`
- `parentRecoveryDesign`: `docs/architecture/2B20B-P2F1R-C-domain-event-structural-validation-recovery-design-v1.md`
- `parentRecoveryDesignSha256`: `265f52b764c8802b8c2f9958df05f701d3bbf2b3bf6269714ca2f5fde1bdf455`
- `parentCorrectionV1`: `docs/architecture/2B20B-P2F1R-C-domain-event-structural-validation-recovery-design-correction-v1.md`
- `parentCorrectionV1Sha256`: `254dd8c300a2b5b73e28984d9c9a7380c1d8298ecd9fede7cbf042a86d499d15`
- `exactBlockers`: `C-R1-001_TAGGED_UNION_ORDINAL_CONTRACT_UNRESOLVED`, `C-R1-002_TRACEABILITY_V1_1_SHAPE_AND_PASS_CLAIMS_INVALID`, `C-R1-003_DIAGNOSTIC_TOTALITY_AND_SECTION_12_EVIDENCE_STILL_INCOMPLETE`
- `CComponentRepairRoundBefore`: `1/2`
- `implementationAuthorized`: `false`
- `AChanged`: `false`
- `BChanged`: `false`
- `C1Changed`: `false`
- `eventDefinitionsChanged`: `false`
- `semanticValidatorChanged`: `false`
- `productBehaviorChanged`: `false`
- `ruleSemanticsChanged`: `false`
- `catalogV2RuntimeAuthority`: `false`
- `artifactDigestRuntimeAuthority`: `false`

This document replaces the corrected areas of Recovery Design V1 and Correction V1. Unchanged clauses remain in force. It is a docs-only design correction, consumes no component repair round, and does not authorize production, test, or implementation-traceability changes.

## 2. Exact review-finding triage

The complete review bound to `57a14cc2c1dff7048c10aac479bfeafa8e0e8d5a` contains exactly these three blockers for this correction.

| Finding | Exact Source | Affected Symbol/Row | Required Design Correction | Required Implementation Delta | Evidence Mechanism |
|---|---|---|---|---|---|
| `C-R1-001_TAGGED_UNION_ORDINAL_CONTRACT_UNRESOLVED` | frozen Code Review for Repair Round 1 | `deriveTaggedUnionTagFieldOrdinal`, `TAGGED_UNION` traversal, C-C10 and C-C15 | separate three ordinal domains and freeze a nonleaking tagged-union coordinate | retire the derived tag-field ordinal; consume C1 root, node, and tagged-branch ordinals directly; add the closed coordinate | tagged-union public failure matrix plus C1 ordinal source audit |
| `C-R1-002_TRACEABILITY_V1_1_SHAPE_AND_PASS_CLAIMS_INVALID` | frozen Code Review for Repair Round 1 | all 25 implementation-traceability rows, especially C-C03/C-C06/C-C09/C-C12/C-C15 | preserve five historical grouping rows and reissue 28 active criteria with the nine design fields | after a future authorization, bind the exact implementation-time fields and claim PASS only where a real mechanism exists | traceability parser/census and unique-primary audit |
| `C-R1-003_DIAGNOSTIC_TOTALITY_AND_SECTION_12_EVIDENCE_STILL_INCOMPLETE` | frozen Code Review for Repair Round 1 | F01-F34 policy, capture translation, Correction V1 section 12, C-C02 and C-C15 | freeze all public contexts, evidence kind, capture translation, 14-field evidence, and callable/static boundaries | exhaustive context dispatch and only the tests/static bindings named here | 34-context census, 19-code census, 23-callable/11-static audit, Section 12 matrix |

There is no fourth blocker in scope.

## 3. Three disjoint ordinal domains

| Domain | Sole C1 source | Meaning | Forbidden use |
|---|---|---|---|
| `EventBranchOrdinal` | `HealthyStructuralSchemaAuthorityV1.candidate.roots[].branchOrdinal` | one of the 59 payload root branches | AST node identity, tagged variant identity, or a nested path segment |
| `AstNodeOrdinal` | `HealthyStructuralSchemaAuthorityV1.traversal.uniqueNodes[].nodeOrdinal` | one unique node in the admitted C1 graph, including a `TAGGED_UNION` | event branch identity or tagged variant identity |
| `TaggedVariantOrdinal` | the selected `StructuralTaggedBranchV1.branchOrdinal` in a `TAGGED_UNION.branches` tuple | one variant inside one tagged-union node | event root identity, AST node identity, runtime object order, or field order |

C1 already supplies all three domains. Its health checks require dense tagged `branchOrdinal` values and its traversal supplies dense `nodeOrdinal` values. C therefore needs no C1 modification or new C1 export. C admission derives immutable lookup records from the already frozen `candidate.roots`, `candidate.nodeBindings`, and `traversal.uniqueNodes`.

`deriveTaggedUnionTagFieldOrdinal` is retired. A tagged union does not invent a schema field ordinal by inspecting the first or lowest-ordinal variant. The discriminator's runtime field location is an authenticated A canonical-object entry coordinate, while the selected variant identity is the C1 tagged-branch ordinal.

## 4. Tagged-union diagnostic coordinate V1

The public diagnostic gains one mandatory field:

```ts
readonly taggedUnionCoordinate: TaggedUnionCoordinateV1 | null;
```

It is `null` for every non-tagged-union context. It is non-null for tagged-union discriminator and selected-variant nested failures. The exact public types are:

```ts
export type TaggedUnionFieldCoordinateV1 = {
  readonly containerPath: readonly DomainEventStructuralPathSegment[];
  readonly canonicalObjectEntryOrdinal: number;
};

export type TaggedUnionCoordinateV1 =
  | {
      readonly eventBranchOrdinal: number;
      readonly astNodeOrdinal: number;
      readonly taggedUnionPath: readonly DomainEventStructuralPathSegment[];
      readonly field: null;
      readonly state: "MISSING_DISCRIMINANT";
    }
  | {
      readonly eventBranchOrdinal: number;
      readonly astNodeOrdinal: number;
      readonly taggedUnionPath: readonly DomainEventStructuralPathSegment[];
      readonly field: TaggedUnionFieldCoordinateV1;
      readonly state: "INVALID_DISCRIMINANT_TYPE";
    }
  | {
      readonly eventBranchOrdinal: number;
      readonly astNodeOrdinal: number;
      readonly taggedUnionPath: readonly DomainEventStructuralPathSegment[];
      readonly field: TaggedUnionFieldCoordinateV1;
      readonly state: "UNKNOWN_DISCRIMINANT_VALUE";
    }
  | {
      readonly eventBranchOrdinal: number;
      readonly astNodeOrdinal: number;
      readonly taggedUnionPath: readonly DomainEventStructuralPathSegment[];
      readonly field: TaggedUnionFieldCoordinateV1;
      readonly state: "KNOWN_VARIANT";
      readonly taggedVariantOrdinal: number;
    };
```

`field` is always present and is either a field coordinate or `null`. Only `KNOWN_VARIANT` has `taggedVariantOrdinal`. The entry ordinal is one-based in A canonical object-entry order and therefore does not depend on runtime insertion order. The coordinate contains no raw discriminator field name, raw tag literal, attacker value, node ID, branch ID, stack, or C1 detail.

All coordinate objects, their paths, and field objects are detached and frozen. The two path arrays use the existing 32-segment bound. A missing discriminator has `field:null`; wrong-kind and unknown-literal states have the authenticated entry coordinate. A selected variant's nested failure keeps the same coordinate with `KNOWN_VARIANT` and adds the selected tagged variant to the ordinary bounded diagnostic path as `UNION_BRANCH_ORDINAL` before the nested child path.

### 4.1 Tagged-union validation precedence

1. Resolve the selected root's `EventBranchOrdinal` and the current node's `AstNodeOrdinal` from the admitted C1 authority.
2. Require the current backing to be `OBJECT`; a nonobject is F23 with no tagged coordinate because discriminator processing never began.
3. Search the authenticated A canonical entries for the frozen C1 `tagField`, without getter, iterator, coercion, or caller-object access.
4. If absent, return F26 with `MISSING_DISCRIMINANT`; enter no variant child.
5. If present but its primitive kind cannot match any frozen tag-literal kind, return F26 with `INVALID_DISCRIMINANT_TYPE`; enter no variant child.
6. Compare the primitive against the frozen C1 branch literals in ascending `TaggedVariantOrdinal` without coercion.
7. If no literal matches, return F26 with `UNKNOWN_DISCRIMINANT_VALUE`; do not retain or report the raw literal and enter no child.
8. If exactly one matches, record `KNOWN_VARIANT` and its `TaggedVariantOrdinal`; traverse only that child.
9. More than one matching branch is F28 and an internal-integrity outcome. It does not trial-run children.
10. Never first-match, best-match, iterate alternative child validations, or derive selection from event/root/node/object/field insertion order.

## 5. Public diagnostic totality

The public diagnostic union remains exactly 19 codes: `C1_AUTHORITY_UNHEALTHY`, `CAPTURE_REJECTED`, `INVALID_CAPTURE_TOKEN`, `INVALID_ENVELOPE`, `MISSING_REQUIRED_FIELD`, `EXTRA_FIELD`, `INVALID_FIELD_TYPE`, `INVALID_FIELD_VALUE`, `UNKNOWN_EVENT_TYPE`, `UNSUPPORTED_EVENT_VERSION`, `INVALID_PAYLOAD_DISCRIMINANT`, `INVALID_PAYLOAD_BRANCH`, `INVALID_AST_NODE`, `INVALID_REFINEMENT`, `INVALID_PAYLOAD_STRUCTURE`, `AMBIGUOUS_UNION`, `VALIDATED_BACKING_CONSTRUCTION_FAILED`, `INVALID_STRUCTURAL_TOKEN`, and `INTERNAL_STRUCTURAL_VALIDATION_FAILURE`.

`EvidenceKind` is a closed union of `CALLABLE_PRIMARY_TEST | STATIC_BRANCH_BINDING`. Known contexts use exhaustive dispatch; `INTERNAL_STRUCTURAL_VALIDATION_FAILURE` is not a default for a known context.

### 5.1 Complete Diagnostic Context Matrix V1

| ContextId | TriggerCondition | Code / Phase | PathPolicy | SafeSummary / Quarantine / Retryable | PayloadReadBudget | EvidenceKind |
|---|---|---|---|---|---|---|
| F01 | C1 construction, health, census, or immutable-index admission fails | `C1_AUTHORITY_UNHEALTHY / AUTHORITY_ADMISSION` | `[]` | `AUTHORITY_UNAVAILABLE / true / AFTER_PROCESS_RESTART` | no capture; all C reads zero | `STATIC_BRANCH_BINDING` |
| F02 | correctable A capture rejection | `CAPTURE_REJECTED / CAPTURE` | translated bounded A path | `INPUT_CAPTURE_FAILED / false / AFTER_INPUT_CORRECTION` | A capture only; all C reads zero | `CALLABLE_PRIMARY_TEST` |
| F03 | hostile A capture rejection | `CAPTURE_REJECTED / CAPTURE` | translated bounded A path | `INPUT_CAPTURE_FAILED / true / AFTER_INPUT_CORRECTION` | A capture only; all C reads zero | `CALLABLE_PRIMARY_TEST` |
| F04 | A reports internal serialization failure at capture boundary | `CAPTURE_REJECTED / CAPTURE` | `[]` | `INTERNAL_FAILURE / true / AFTER_PROCESS_RESTART` | no C reads | `STATIC_BRANCH_BINDING` |
| F05 | captured-entry seam receives a nonissued A token | `INVALID_CAPTURE_TOKEN / BACKING_AUTHENTICATION` | `[]` | `CAPTURE_TOKEN_REJECTED / true / NEVER` | no envelope or payload reads | `CALLABLE_PRIMARY_TEST` |
| F06 | authenticated A token has no backing | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE / BACKING_AUTHENTICATION` | `[]` | `INTERNAL_FAILURE / true / AFTER_PROCESS_RESTART` | no envelope or payload reads | `STATIC_BRANCH_BINDING` |
| F07 | envelope backing is not object | `INVALID_ENVELOPE / ENVELOPE` | `[]` | `ENVELOPE_REJECTED / false / AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` |
| F08 | required envelope field is missing | `MISSING_REQUIRED_FIELD / ENVELOPE` | envelope field ordinal | `ENVELOPE_REJECTED / false / AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` |
| F09 | envelope contains extra field | `EXTRA_FIELD / ENVELOPE` | extra-entry ordinal | `ENVELOPE_REJECTED / false / AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` |
| F10 | nonpayload envelope field has wrong backing kind | `INVALID_FIELD_TYPE / ENVELOPE` | envelope field ordinal | `ENVELOPE_REJECTED / false / AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` |
| F11 | envelope literal or nonblank predicate fails | `INVALID_FIELD_VALUE / ENVELOPE` | envelope field ordinal | `ENVELOPE_REJECTED / false / AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` |
| F12 | string event type is not in the 40-type set | `UNKNOWN_EVENT_TYPE / EVENT_DISPATCH` | envelope ordinal 7 | `EVENT_TYPE_REJECTED / false / AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` |
| F13 | envelope event version is a safe integer other than 1 | `UNSUPPORTED_EVENT_VERSION / VERSION_DISPATCH` | envelope ordinal 8 | `EVENT_VERSION_REJECTED / false / NEVER` | no payload acquisition | `CALLABLE_PRIMARY_TEST` |
| F14 | acquired payload is not object | `INVALID_FIELD_TYPE / PAYLOAD_ACQUISITION` | envelope ordinal 14 | `PAYLOAD_REJECTED / false / AFTER_INPUT_CORRECTION` | payload node only; content zero | `CALLABLE_PRIMARY_TEST` |
| F15 | required root-dispatch discriminator absent | `INVALID_PAYLOAD_DISCRIMINANT / PAYLOAD_DISCRIMINANT` | payload discriminator ordinal | `PAYLOAD_DISCRIMINANT_REJECTED / false / AFTER_INPUT_CORRECTION` | discriminator budget at most 3; content zero | `CALLABLE_PRIMARY_TEST` |
| F16 | root-dispatch discriminator wrong primitive kind | `INVALID_PAYLOAD_DISCRIMINANT / PAYLOAD_DISCRIMINANT` | payload discriminator ordinal | `PAYLOAD_DISCRIMINANT_REJECTED / false / AFTER_INPUT_CORRECTION` | discriminator budget at most 3; content zero | `CALLABLE_PRIMARY_TEST` |
| F17 | root-dispatch discriminator unknown literal | `INVALID_PAYLOAD_DISCRIMINANT / PAYLOAD_DISCRIMINANT` | payload discriminator ordinal | `PAYLOAD_DISCRIMINANT_REJECTED / false / AFTER_INPUT_CORRECTION` | discriminator budget at most 3; content zero | `CALLABLE_PRIMARY_TEST` |
| F18 | admitted runtime decision unexpectedly selects zero roots | `INVALID_PAYLOAD_BRANCH / PAYLOAD_DISCRIMINANT` | envelope ordinal 14 | `PAYLOAD_BRANCH_REJECTED / false / AFTER_INPUT_CORRECTION` | discriminator-only; content zero | `STATIC_BRANCH_BINDING` |
| F19 | admitted runtime decision unexpectedly selects multiple roots | `INVALID_PAYLOAD_BRANCH / PAYLOAD_DISCRIMINANT` | envelope ordinal 14 | `AMBIGUOUS_BRANCH / true / NEVER` | discriminator-only; content zero | `STATIC_BRANCH_BINDING` |
| F20 | admitted AST node/reference invariant unavailable | `INVALID_AST_NODE / INTERNAL` | current bounded path | `INTERNAL_FAILURE / true / AFTER_PROCESS_RESTART` | selected AST; bounded prior reads | `STATIC_BRANCH_BINDING` |
| F21 | exact record misses required field | `MISSING_REQUIRED_FIELD / AST_TRAVERSAL` | field ordinal | `PAYLOAD_REJECTED / false / AFTER_INPUT_CORRECTION` | selected AST; bounded by A resource limits | `CALLABLE_PRIMARY_TEST` |
| F22 | exact record has extra field | `EXTRA_FIELD / AST_TRAVERSAL` | extra-entry ordinal | `PAYLOAD_REJECTED / false / AFTER_INPUT_CORRECTION` | selected AST; bounded by A resource limits | `CALLABLE_PRIMARY_TEST` |
| F23 | AST primitive/backing kind mismatch | `INVALID_FIELD_TYPE / AST_TRAVERSAL` | current bounded path | `PAYLOAD_REJECTED / false / AFTER_INPUT_CORRECTION` | selected AST; bounded by A resource limits | `CALLABLE_PRIMARY_TEST` |
| F24 | literal or enum mismatch | `INVALID_FIELD_VALUE / AST_TRAVERSAL` | current bounded path | `PAYLOAD_REJECTED / false / AFTER_INPUT_CORRECTION` | selected AST; bounded by A resource limits | `CALLABLE_PRIMARY_TEST` |
| F25 | array/nonempty/bounded/tuple cardinality mismatch | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | current bounded path | `PAYLOAD_REJECTED / false / AFTER_INPUT_CORRECTION` | selected AST; bounded by A resource limits | `CALLABLE_PRIMARY_TEST` |
| F26 | tagged discriminator missing, wrong kind, or unknown literal | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | tagged coordinate plus bounded path | `PAYLOAD_REJECTED / false / AFTER_INPUT_CORRECTION` | selected AST; no variant-child read | `CALLABLE_PRIMARY_TEST` |
| F27 | closed union has zero matches | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | current bounded path | `PAYLOAD_REJECTED / false / AFTER_INPUT_CORRECTION` | selected AST; bounded by A resource limits | `CALLABLE_PRIMARY_TEST` |
| F28 | tagged/closed union has multiple matches | `AMBIGUOUS_UNION / AST_TRAVERSAL` | current path or tagged coordinate | `PAYLOAD_REJECTED / true / NEVER` | no selected-child output | `STATIC_BRANCH_BINDING` |
| F29 | valid refinement predicate rejects input | `INVALID_REFINEMENT / AST_TRAVERSAL` | current bounded path | `PAYLOAD_REJECTED / false / AFTER_INPUT_CORRECTION` | selected AST; one primitive predicate | `CALLABLE_PRIMARY_TEST` |
| F30 | refinement metadata invariant invalid | `INVALID_REFINEMENT / INTERNAL` | current bounded path | `INTERNAL_FAILURE / true / AFTER_PROCESS_RESTART` | selected AST; no semantic read | `STATIC_BRANCH_BINDING` |
| F31 | detached backing construction or freeze fails | `VALIDATED_BACKING_CONSTRUCTION_FAILED / BACKING_CONSTRUCTION` | `[]` | `BACKING_CONSTRUCTION_FAILED / true / AFTER_PROCESS_RESTART` | traversal complete | `STATIC_BRANCH_BINDING` |
| F32 | token allocation/registration fails | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE / TOKEN_ISSUE` | `[]` | `INTERNAL_FAILURE / true / AFTER_PROCESS_RESTART` | backing complete | `STATIC_BRANCH_BINDING` |
| F33 | token consumer receives nonissued identity | `INVALID_STRUCTURAL_TOKEN / TOKEN_CONSUMPTION` | `[]` | `STRUCTURAL_TOKEN_REJECTED / true / NEVER` | no input/payload reads | `CALLABLE_PRIMARY_TEST` |
| F34 | another safely catchable internal invariant exception | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE / INTERNAL` | `[]` | `INTERNAL_FAILURE / true / AFTER_PROCESS_RESTART` | bounded at catch phase | `STATIC_BRANCH_BINDING` |

The census is exact: 34 contexts, 19 public codes, 23 `CALLABLE_PRIMARY_TEST`, and 11 `STATIC_BRANCH_BINDING`. Static contexts are F01, F04, F06, F18, F19, F20, F28, F30, F31, F32, and F34.

### 5.2 Exhaustive A capture translation

| A diagnostic code | C context | Reason |
|---|---|---|
| `UNSUPPORTED_TYPE`, `INVALID_NUMBER`, `UNSAFE_INTEGER`, `INVALID_UNICODE`, `NONPLAIN_OBJECT` | F02 | correctable rejected value domain |
| `RESOURCE_DEPTH_EXCEEDED`, `RESOURCE_NODE_LIMIT_EXCEEDED`, `RESOURCE_ARRAY_LIMIT_EXCEEDED`, `RESOURCE_OBJECT_KEY_LIMIT_EXCEEDED`, `RESOURCE_STRING_LIMIT_EXCEEDED`, `RESOURCE_KEY_LIMIT_EXCEEDED`, `RESOURCE_SERIALIZED_BYTE_LIMIT_EXCEEDED` | F02 | correctable resource-bound rejection |
| `ACCESSOR_PROPERTY`, `NON_ENUMERABLE_PROPERTY`, `SYMBOL_KEY`, `SYMBOL_VALUE`, `CYCLE`, `SPARSE_ARRAY`, `KEYED_ARRAY`, `INVALID_ARRAY_LENGTH_DESCRIPTOR`, `PROXY_OR_DESCRIPTOR_FAILURE` | F03 | hostile descriptor/container rejection |
| `INTERNAL_SERIALIZATION_FAILURE` | F04 | internal capture-boundary failure |
| `INVALID_CAPTURE_TOKEN` | F05 | captured-entry authentication, not public capture translation |
| `INTERNAL_BACKING_MISSING` | F06 | authenticated backing read, not public capture translation |

The mapping exhausts all 24 A codes. No `default` may translate a future A code; a new A code is a compile-time design stop.

## 6. Exact 14-field envelope evidence matrix

All paths below use `ENVELOPE_FIELD_ORDINAL`. “Wrong primitive” means a primitive of a different backing kind. Six branded IDs apply intrinsic trim only as a nonblank predicate and preserve the original string.

| # / Field | Missing | `null` | Empty string | Whitespace-only | Wrong primitive | Valid representative | Expected path |
|---|---|---|---|---|---|---|---|
| 1 `category` | F08 | F10 | F11 | F11 | F10 | `"domain"` succeeds | ordinal 1 |
| 2 `eventId` | F08 | F10 | F11 | F11 | F10 | `" event-1 "` succeeds unchanged | ordinal 2 |
| 3 `gameId` | F08 | F10 | F11 | F11 | F10 | `" game-1 "` succeeds unchanged | ordinal 3 |
| 4 `eventSequence` | F08 | F10 | F10 | F10 | F10 | `-1` and `0` are structurally valid safe integers | ordinal 4 |
| 5 `batchId` | F08 | F10 | F11 | F11 | F10 | `" batch-1 "` succeeds unchanged | ordinal 5 |
| 6 `gameVersion` | F08 | F10 | F10 | F10 | F10 | `-1` and `0` are structurally valid safe integers | ordinal 6 |
| 7 `eventType` | F08 | F10 | F12 | F12 | F10 | one exact known event literal succeeds dispatch | ordinal 7 |
| 8 `eventVersion` | F08 | F10 | F10 | F10 | F10 | safe integer `1` succeeds; other safe integer is F13 | ordinal 8 |
| 9 `rulesBaselineVersion` | F08 | F10 | succeeds | succeeds | F10 | any primitive string succeeds structurally | ordinal 9 |
| 10 `commandId` | F08 | F10 | F11 | F11 | F10 | `" command-1 "` succeeds unchanged | ordinal 10 |
| 11 `createdAt` | F08 | F10 | succeeds | succeeds | F10 | any primitive string succeeds; no date parsing | ordinal 11 |
| 12 `correlationId` | F08 | F10 | F11 | F11 | F10 | `" correlation-1 "` succeeds unchanged | ordinal 12 |
| 13 `causationId` | F08 | F10 | F11 | F11 | F10 | `" causation-1 "` succeeds unchanged | ordinal 13 |
| 14 `payload` | F08 | F14 | F14 | F14 | F14 | authentic selected-root object succeeds; empty object reaches selected AST and fails by that root, normally F21 | ordinal 14 |

This matrix adds no ISO timestamp parser, baseline nonblank constraint, global nonempty rule, ID grammar, trim-and-write-back behavior, or canonicalization.

## 7. Fully reissued Section 12 evidence contract

The future Repair Round 2 test file remains `packages/domain-core/src/domain-event-structural-validator.test.ts`. The following is the complete replacement for Correction V1 section 12; no cross-reference supplies omitted requirements.

| # | Required evidence | Primary mechanism | Bound context/criterion |
|---:|---|---|---|
| 1 | exact 35 envelope-resolvable and 24 payload-discriminated roots, with all branch IDs | real C1 admission census plus source binding for unhealthy singleton | F01, C-C03a/C-C03b |
| 2 | every decision tree selects all 24 roots exactly once and rejects missing/wrong/unknown outcomes | public authentic and single-mutation dispatch matrix | F15-F17, C-C06b |
| 3 | all 35 singleton roots leave discriminator reads zero before traversal | public observer matrix | C-C06a |
| 4 | exact successful discriminator operation counts for all five multi-root event families | public observer matrix | C-C06a |
| 5 | all pre-payload failure counter tuples | public observer matrix | F02/F03/F05/F07-F13, C-C05 |
| 6 | missing, wrong-kind, unknown, zero-root, and multiple-root discriminator boundaries | public tests for F15-F17; static bindings for F18/F19 | C-C06b/C-C15b/C-C15d |
| 7 | observer is per-call, data-free, noninjectable, nonexported, and behavior-neutral | public result parity plus static API/dependency audit | C-C05 |
| 8 | all 14 fields cover missing, null, empty, whitespace, wrong primitive, and valid representative | parameterized public exact-envelope matrix with explicit expected code/path | C-C02/C-C12c |
| 9 | `rulesBaselineVersion` and `createdAt` accept empty and whitespace-only strings | public authentic envelope mutations | C-C02 |
| 10 | six branded IDs reject trim-empty and preserve a nonblank original with surrounding whitespace | public envelope matrix plus backing read | C-C02 |
| 11 | F01-F34 census, direct binding, no orphan/default, legal code/phase/path/summary/quarantine/retryability/read budget/evidence kind | policy tuple audit, public callable tests, and exact static source bindings | C-C15a-d |
| 12 | diagnostics contain no hostile string, key, value, stack, C1 detail, event literal, node ID, or platform text | hostile input repetition/nonleak matrix | C-C15b/C-C15c |
| 13 | both refinements use captured intrinsic and retain their frozen predicates | immutable traversal seam with real A-captured primitives | F29/F30, C-C09a |
| 14 | all 16 ID aliases share the same predicate and invoke no callback/semantic lookup | alias matrix plus dependency audit | C-C09a |
| 15 | B26 one/many pass and empty fails only through generic `NON_EMPTY_ARRAY` | public B26 vectors and forbidden-special-case audit | C-C12a |
| 16 | all three B54 survivors pass; placeholder/wrong/missing/extra fail generically | public B54 vectors and forbidden-fallback audit | C-C12b |
| 17 | A/B/C1 bytes unchanged and production has no Catalog/digest/manual-map/legacy-validator dependency | exact diff and import/source audit | C-C18/C-C19 |
| 18 | token remains structural-only, noncopyable, process-local, and never semantic/history authority | public success plus reader/forgery/copy/clone/wrapper matrix and export audit | F32/F33, C-C13/C-C14/C-C16 |

Tagged-union evidence additionally covers missing, wrong-kind, unknown-literal, known-variant nested failure, and the static multiple-match integrity guard using the exact coordinate in section 4. Impossible module initialization, backing corruption, allocation, registry corruption, and runtime invariant failures are never made injectable merely to obtain a test.

## 8. Traceability V1.1 correction

The design inventory has five retained historical grouping rows and 28 active criteria: 33 rows total. Grouping rows own no physical identity and make no Actual or PASS claim. Every active row has the exact nine design-time fields. Design-time census: `pending=28`, `PASS=0`, `uniquePrimaryCount=0 until implementation`, `duplicatePrimaryCount=0`, `borrowedPrimaryCount=0`; R1 and R2 sets remain empty.

### 8.1 Historical grouping rows

| CriterionId | Children | Status | Primary identity | Actual/PASS claim |
|---|---|---|---|---|
| C-C03 | C-C03a, C-C03b, C-C03c | `GROUPING` | none | none |
| C-C06 | C-C06a, C-C06b | `GROUPING` | none | none |
| C-C09 | C-C09a, C-C09b | `GROUPING` | none | none |
| C-C12 | C-C12a, C-C12b, C-C12c | `GROUPING` | none | none |
| C-C15 | C-C15a, C-C15b, C-C15c, C-C15d | `GROUPING` | none | none |

### 8.2 Active design criteria

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C-C01 | Unknown input enters A exactly once | C captures once and never reads caller objects | public hostile-input matrix and dependency audit | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | closed result without raw C access | frozen A capture contract |
| C-C02 | Exact envelope preserves accepted runtime language | all section-6 cases match exact code/path | public 14-field matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact acceptance/rejection | accepted type, producer, runtime, semantic and test audit |
| C-C03a | Exact-head C1 authority is complete | pure admission proves 40/59/13/46 and 35/24 | package-private admission over real C1 result | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | frozen healthy state | C1 health/census tests |
| C-C03b | Unhealthy C1 authority fails before capture | unhealthy result and initialization guards map only to F01 | admission seam plus static singleton binding | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | F01 and no capture/token | C1 result union |
| C-C03c | Public C consumes one admitted authority | public validation selects a root only after healthy admission | public 40/59 matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact root or no token | C-C03a/C-C03b as support |
| C-C04 | Every known event has one identity | all 40 event ordinals group deterministically | public event inventory matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact event identity | C1 roots |
| C-C05 | Pre-payload gates perform zero C payload reads | early failures retain frozen zero-read tuples | observer failure matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact counters | A capture boundary |
| C-C06a | Payload-discriminated dispatch has bounded reads | all 24 roots match frozen discriminator budgets and content stays zero before selection | observer decision-tree matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact count and no early AST | C1 root/literal metadata |
| C-C06b | Branch selection is exact and fallback-free | all 59 roots select exactly once; missing/wrong/unknown reject | public branch/discriminator matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | one root or F15-F19 | C1 version/root metadata |
| C-C07 | Missing fields fail deterministically | first frozen envelope/AST omission wins | omission matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | F08 or F21 | envelope and C1 ordinals |
| C-C08 | Extra fields fail deterministically | exact records reject first canonical extra entry | extra-entry matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | F09 or F22 | A canonical order |
| C-C09a | Refinements use captured intrinsic trim | both predicates and 16 aliases use only frozen intrinsic behavior | intrinsic/alias matrix plus dependency audit | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | original value or F29/F30 | C1 refinement contract |
| C-C09b | Primitive coercion never occurs | kind/literal/enum/integer mutations invoke no user conversion | primitive mutation matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | F10/F11/F23/F24 | A primitive backing |
| C-C10 | All 15 AST kinds traverse exactly | each node follows frozen child/branch order and cardinality | nested public/unit matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | detached output or closed failure | C1 algebra/tests |
| C-C11 | Legacy B31 remains representable | authentic B31 passes and structural mutation fails | public legacy vector | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | structural result only | accepted B31 type |
| C-C12a | B26 variadic shape is generic | one/many pass and zero fails through `NON_EMPTY_ARRAY` only | public B26 matrix and dependency trap | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact B26 C1 language | C1 B26 delta evidence |
| C-C12b | B54 survivors are generic | three survivors pass and placeholder/wrong/missing/extra fail | public B54 matrix and dependency trap | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact B54 C1 language | C1 B54 delta evidence |
| C-C12c | Current families remain representable | all authentic explicit and unversioned producer roots pass exact dispatch | authentic 59-root producer matrix | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | structural result only | current producer tests |
| C-C13 | Success issues only an authentic C token | issued identity reads; forgery/copy/clone/wrapper fail | public success and private reader matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | structural token only | A token pattern |
| C-C14 | C token is process-local and noncopyable | serialization/transfer does not preserve identity | issuer/reader and export audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | issued identity only | none |
| C-C15a | Diagnostic policy is total | 34 contexts and 19 codes have one exhaustive legal policy | tuple/census and compile-time exhaustiveness audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | no orphan/default | frozen design matrix |
| C-C15b | Callable diagnostics match public behavior | all 23 callable contexts return exact safe repeatable diagnostics | public callable context matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact code/phase/path/policy | A capture translation contract |
| C-C15c | Tagged-union coordinate is unambiguous and nonleaking | missing/wrong/unknown/known nested outcomes use three ordinal domains correctly | public tagged-union coordinate matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact frozen coordinate and no raw tag | C1 roots/traversal/tagged branches |
| C-C15d | Static-only diagnostics fail closed | all 11 impossible/internal contexts bind exact source branch and policy without fake injection | static source-binding matrix | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | exact fail-closed branch mapping | frozen source and diagnostic tuple |
| C-C16 | Structural success is not semantic acceptance | success carries both fixed statuses and no authority claim | result/export policy audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | `NOT_SEMANTICALLY_ACCEPTED` | semantic owner map |
| C-C17 | Future unknowns fail closed | future event/version/branch/refinement cannot fall back | hostile future-literal matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | closed failure and no token | closed C1 vocabulary |
| C-C18 | C creates no state/history/hash authority | dependency/export/token audit finds no prohibited issuer | static dependency/API audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | no prohibited authority | rescope/review protocol |
| C-C19 | Runtime consumes C1 AST directly | all 59 roots use admitted C1 nodes/refinements and no substitute | public 59-root matrix plus forbidden-dependency traps | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact C1 language parity | exact-head C1 tests as support only |

Implementation-time traceability must retain these nine fields and add the protocol fields `CriterionId`, `ActualTestFile`, `ActualTestTitle`, `ActualPrimaryLayer`, `ActualReachability`, `ActualTrust`, `SupportingAuthorityId`, and `MechanismMatch`; it must also identify main assertion, production entry, and fault mechanism. Grouping rows remain grouping-only. No active row becomes PASS without a distinct real primary identity, and D evidence cannot be a C primary.

## 9. Future Repair Round 2 allowlist and stop conditions

Only after a fresh independent `RULE_DESIGN_PASS` may the last C component repair round begin. Its production allowlist remains:

1. `packages/domain-core/src/canonical-domain-event.ts`;
2. `packages/domain-core/src/domain-event-structural-validator.ts`;
3. `packages/domain-core/src/index.ts`, only for necessary named exports.

The only test file is `packages/domain-core/src/domain-event-structural-validator.test.ts`; the only implementation evidence file is `docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md`. A/B/C1, event definitions, semantic validators, replay, rebuild, batch, state, snapshot, application, roles, Dreamer, impairment, ownership, coverage, workflow, and control files remain forbidden.

Stop with `HUMAN_BLOCKED` before implementation if the design reviewer does not return `RULE_DESIGN_PASS` with no blockers, or if closure would require modifying C1, creating a fourth production file, changing the 40/59/15 inventories, changing the 14-field runtime language, changing B26/B54 behavior, making Catalog/digest runtime authority, using a manual schema/fallback, or altering the protected old dirty worktree. This document does not consume Repair Round 2 and does not start it.

## 10. Fresh independent design-review gate

The reviewer must verify: the three ordinal domains are disjoint; C1 already supplies root/node/tagged-variant ordinals; the derived tag-field helper is retired; the coordinate is always present as coordinate-or-null, closed, and nonleaking; only a known variant has a variant ordinal; tagged validation never trial-runs branches; the 34/19/23/11 census is exact; all A diagnostic codes are mapped; all Section 12 evidence is reissued; the 14-field matrix preserves accepted language; the five grouping and 28 active criterion census is exact; all active rows have nine design fields; no grouping or design row claims Actual/PASS; A/B/C1 and frozen behavior remain unchanged; the allowlist is executable; and Repair Round 2 has not begun.

Only a complete independent `RULE_DESIGN_PASS` with `remainingDesignBlockers=[]` may authorize the already bounded future implementation stage. The writer does not issue or infer that verdict.

READY_FOR_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW
