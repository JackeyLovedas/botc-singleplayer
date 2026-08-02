# Phase 3 Slice 2B20B-P2F1R-C Recovery Design Correction V3

## 1. Authority and correction boundary

- `authorization`: `USER_AUTHORIZED_2B20B_P2F1R_C_TAGGED_UNION_DIAGNOSTIC_COORDINATE_DESIGN_CORRECTION_REPAIR_ROUND_2_AND_LOCAL_CLOSURE`
- `correctionBaseHead`: `d58ce58181d37280218c1f22bef343ce0f119780`
- `parentCorrectionV2`: `docs/architecture/2B20B-P2F1R-C-domain-event-structural-validation-recovery-design-correction-v2.md`
- `parentCorrectionV2Sha256`: `7ab3e70a9c08d568c1fab887cdb367981f0c8e81483089949e6faecda9038d85`
- `freshReviewHead`: `d58ce58181d37280218c1f22bef343ce0f119780`
- `parentFinding`: `C-DCV2-001_TAGGED_UNION_DIAGNOSTIC_CONTEXT_MATRIX_NOT_TOTAL`
- `CComponentRepairRoundBefore`: `1/2`
- `implementationAuthorized`: `false`
- `AChanged`: `false`
- `BChanged`: `false`
- `C1Changed`: `false`
- `eventDefinitionsChanged`: `false`
- `schemaChanged`: `false`
- `semanticValidatorChanged`: `false`
- `runtimeInputSetChanged`: `false`
- `productBehaviorChanged`: `false`
- `ruleSemanticsChanged`: `false`
- `productionAllowlistChanged`: `false`

The fresh independent review passed 14 of 17 review points. Points 6, 8, and 9 failed for the single finding above: V2 froze 34 public contexts, but several contexts still represented multiple distinguishable leaves without a unique policy/evidence mapping. This docs-only correction closes only that finding. V2 remains history; its unchanged contracts remain in force.

## 2. Two-level diagnostic identity

The public compatibility identity remains exactly `F01` through `F34`. Public code, phase, summary, quarantine, retryability, and behavior do not expand. An internal closed leaf identity now makes every distinguishable trigger total and unique.

```ts
type DomainEventStructuralDiagnosticEvidenceKind =
  | "CALLABLE_PRIMARY_TEST"
  | "STATIC_BRANCH_BINDING";

type DomainEventStructuralTaggedCoordinatePolicy =
  | "NULL"
  | "MISSING_DISCRIMINANT"
  | "INVALID_DISCRIMINANT_TYPE"
  | "UNKNOWN_DISCRIMINANT_VALUE"
  | "KNOWN_VARIANT_STACK_LOCAL";

type DomainEventStructuralDiagnosticLeafPolicyV1 = {
  readonly leafId: DomainEventStructuralDiagnosticLeafIdV1;
  readonly publicContextId: DomainEventStructuralFailureContextId;
  readonly triggerCondition: string;
  readonly code: DomainEventStructuralDiagnosticCode;
  readonly phase: DomainEventStructuralDiagnosticPhase;
  readonly pathPolicy: string;
  readonly safeSummary: DomainEventStructuralSafeSummary;
  readonly quarantineRecommended: boolean;
  readonly retryability: DomainEventStructuralRetryability;
  readonly payloadReadBudget: string;
  readonly evidenceKind: DomainEventStructuralDiagnosticEvidenceKind;
  readonly taggedCoordinatePolicy: DomainEventStructuralTaggedCoordinatePolicy;
  readonly exactSourceBinding: string;
};
```

The table in section 3 freezes every string member above as a literal value; none is caller input or public diagnostic text. Implementation uses a frozen 47-member tuple and an exact record keyed by the leaf union. Compile-time bidirectional equality and runtime census prove: every leaf occurs once, every leaf has one public context, one path policy, one budget, one evidence kind, and one source binding, and no policy key is orphaned. There is no `default` leaf.

## 3. Complete 47-leaf diagnostic matrix

### 3.1 Closed leaf union

```ts
type DomainEventStructuralDiagnosticLeafIdV1 =
  | "L01_F01_AUTHORITY_UNHEALTHY"
  | "L02_F02_CAPTURE_CORRECTABLE"
  | "L03_F03_CAPTURE_HOSTILE"
  | "L04_F04_CAPTURE_INTERNAL"
  | "L05_F05_CAPTURE_TOKEN_INVALID"
  | "L06_F06_CAPTURE_BACKING_MISSING"
  | "L07_F07_ENVELOPE_NOT_OBJECT"
  | "L08_F08_ENVELOPE_FIELD_MISSING"
  | "L09_F09_ENVELOPE_FIELD_EXTRA"
  | "L10_F10_ENVELOPE_FIELD_WRONG_KIND"
  | "L11_F11_ENVELOPE_FIELD_INVALID_VALUE"
  | "L12_F12_EVENT_TYPE_UNKNOWN"
  | "L13_F13_EVENT_VERSION_UNSUPPORTED"
  | "L14_F14_PAYLOAD_NOT_OBJECT"
  | "L15_F15_ROOT_DISCRIMINATOR_MISSING"
  | "L16_F16_ROOT_DISCRIMINATOR_WRONG_KIND"
  | "L17_F17_ROOT_DISCRIMINATOR_UNKNOWN"
  | "L18_F18_ROOT_SELECTION_ZERO"
  | "L19_F19_ROOT_SELECTION_MULTIPLE"
  | "L20_F20_AST_NODE_LOOKUP_MISSING"
  | "L21_F20_AST_NODE_ORDINAL_LOOKUP_MISSING"
  | "L22_F20_EVENT_BRANCH_ORDINAL_INVALID"
  | "L23_F20_TAGGED_VARIANT_ORDINAL_INVALID"
  | "L24_F20_TAGGED_FIELD_COORDINATE_INVARIANT"
  | "L25_F20_TAGGED_MULTIPLE_LITERAL_MATCH"
  | "L26_F21_RECORD_MISSING_PLAIN"
  | "L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT"
  | "L28_F22_RECORD_EXTRA_PLAIN"
  | "L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT"
  | "L30_F23_KIND_MISMATCH_PLAIN"
  | "L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT"
  | "L32_F24_LITERAL_MISMATCH_PLAIN"
  | "L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT"
  | "L34_F25_CARDINALITY_MISMATCH_PLAIN"
  | "L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT"
  | "L36_F26_TAGGED_DISCRIMINATOR_MISSING"
  | "L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND"
  | "L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN"
  | "L39_F27_CLOSED_UNION_ZERO_MATCH"
  | "L40_F28_CLOSED_UNION_MULTIPLE_MATCH"
  | "L41_F29_REFINEMENT_REJECTED_PLAIN"
  | "L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT"
  | "L43_F30_REFINEMENT_METADATA_INVALID"
  | "L44_F31_BACKING_CONSTRUCTION_FAILED"
  | "L45_F32_TOKEN_ISSUE_FAILED"
  | "L46_F33_TOKEN_INVALID"
  | "L47_F34_INTERNAL_CONTAINMENT";
```

### 3.2 Leaf policies L01-L19

| Leaf | Public context; trigger | Code / phase | Path policy | Summary; Q; retry | Read budget | Evidence | Coordinate | Exact source binding |
|---|---|---|---|---|---|---|---|---|
| L01 | F01; authority construction/health/admission fails | `C1_AUTHORITY_UNHEALTHY / AUTHORITY_ADMISSION` | `[]` | `AUTHORITY_UNAVAILABLE; true; AFTER_PROCESS_RESTART` | all C reads zero | `STATIC_BRANCH_BINDING` | `NULL` | module initialization and `admitC1Authority` unhealthy return |
| L02 | F02; correctable A capture rejection | `CAPTURE_REJECTED / CAPTURE` | translated A path | `INPUT_CAPTURE_FAILED; false; AFTER_INPUT_CORRECTION` | A capture only | `CALLABLE_PRIMARY_TEST` | `NULL` | exhaustive correctable A-code translator |
| L03 | F03; hostile A capture rejection | `CAPTURE_REJECTED / CAPTURE` | translated A path | `INPUT_CAPTURE_FAILED; true; AFTER_INPUT_CORRECTION` | A capture only | `CALLABLE_PRIMARY_TEST` | `NULL` | exhaustive hostile A-code translator |
| L04 | F04; A internal serialization failure | `CAPTURE_REJECTED / CAPTURE` | `[]` | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | no C reads | `STATIC_BRANCH_BINDING` | `NULL` | exhaustive A internal-code translator |
| L05 | F05; captured entry receives nonissued A token | `INVALID_CAPTURE_TOKEN / BACKING_AUTHENTICATION` | `[]` | `CAPTURE_TOKEN_REJECTED; true; NEVER` | no envelope/payload read | `CALLABLE_PRIMARY_TEST` | `NULL` | `validateCapturedDomainEventStructure` authentication branch |
| L06 | F06; authenticated A token has no backing | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE / BACKING_AUTHENTICATION` | `[]` | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | no envelope/payload read | `STATIC_BRANCH_BINDING` | `NULL` | authenticated-backing impossible guard |
| L07 | F07; envelope backing not object | `INVALID_ENVELOPE / ENVELOPE` | `[]` | `ENVELOPE_REJECTED; false; AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` | `NULL` | envelope root-kind gate |
| L08 | F08; envelope required field missing | `MISSING_REQUIRED_FIELD / ENVELOPE` | envelope field ordinal | `ENVELOPE_REJECTED; false; AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` | `NULL` | 14-field presence loop |
| L09 | F09; envelope extra field | `EXTRA_FIELD / ENVELOPE` | extra-entry ordinal | `ENVELOPE_REJECTED; false; AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` | `NULL` | exact envelope key-set gate |
| L10 | F10; nonpayload envelope wrong kind | `INVALID_FIELD_TYPE / ENVELOPE` | envelope field ordinal | `ENVELOPE_REJECTED; false; AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` | `NULL` | envelope kind validator |
| L11 | F11; envelope literal/nonblank predicate fails | `INVALID_FIELD_VALUE / ENVELOPE` | envelope field ordinal | `ENVELOPE_REJECTED; false; AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` | `NULL` | envelope value validator |
| L12 | F12; event type unknown | `UNKNOWN_EVENT_TYPE / EVENT_DISPATCH` | envelope ordinal 7 | `EVENT_TYPE_REJECTED; false; AFTER_INPUT_CORRECTION` | no payload acquisition | `CALLABLE_PRIMARY_TEST` | `NULL` | known event lookup |
| L13 | F13; event version safe integer other than 1 | `UNSUPPORTED_EVENT_VERSION / VERSION_DISPATCH` | envelope ordinal 8 | `EVENT_VERSION_REJECTED; false; NEVER` | no payload acquisition | `CALLABLE_PRIMARY_TEST` | `NULL` | envelope version literal gate |
| L14 | F14; payload not object | `INVALID_FIELD_TYPE / PAYLOAD_ACQUISITION` | envelope ordinal 14 | `PAYLOAD_REJECTED; false; AFTER_INPUT_CORRECTION` | node only, content zero | `CALLABLE_PRIMARY_TEST` | `NULL` | payload acquisition gate |
| L15 | F15; required root discriminator missing | `INVALID_PAYLOAD_DISCRIMINANT / PAYLOAD_DISCRIMINANT` | discriminator ordinal | `PAYLOAD_DISCRIMINANT_REJECTED; false; AFTER_INPUT_CORRECTION` | discriminator <=3, content zero | `CALLABLE_PRIMARY_TEST` | `NULL` | root decision-tree missing branch |
| L16 | F16; root discriminator wrong kind | `INVALID_PAYLOAD_DISCRIMINANT / PAYLOAD_DISCRIMINANT` | discriminator ordinal | `PAYLOAD_DISCRIMINANT_REJECTED; false; AFTER_INPUT_CORRECTION` | discriminator <=3, content zero | `CALLABLE_PRIMARY_TEST` | `NULL` | root decision-tree kind branch |
| L17 | F17; root discriminator unknown literal | `INVALID_PAYLOAD_DISCRIMINANT / PAYLOAD_DISCRIMINANT` | discriminator ordinal | `PAYLOAD_DISCRIMINANT_REJECTED; false; AFTER_INPUT_CORRECTION` | discriminator <=3, content zero | `CALLABLE_PRIMARY_TEST` | `NULL` | root decision-tree literal branch |
| L18 | F18; admitted root decision selects zero | `INVALID_PAYLOAD_BRANCH / PAYLOAD_DISCRIMINANT` | envelope ordinal 14 | `PAYLOAD_BRANCH_REJECTED; false; AFTER_INPUT_CORRECTION` | discriminator only | `STATIC_BRANCH_BINDING` | `NULL` | root decision zero-result invariant guard |
| L19 | F19; admitted root decision selects multiple | `INVALID_PAYLOAD_BRANCH / PAYLOAD_DISCRIMINANT` | envelope ordinal 14 | `AMBIGUOUS_BRANCH; true; NEVER` | discriminator only | `STATIC_BRANCH_BINDING` | `NULL` | root decision multiple-result invariant guard |

### 3.3 Six mutually exclusive F20 static leaves

| Leaf | Public context; trigger | Code / phase | Path policy | Summary; Q; retry | Read budget | Evidence | Coordinate | Exact source binding |
|---|---|---|---|---|---|---|---|---|
| L20 | F20; node ID absent from admitted node lookup | `INVALID_AST_NODE / INTERNAL` | current bounded path | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | prior selected-AST reads only | `STATIC_BRANCH_BINDING` | `NULL` | generic traversal node lookup guard |
| L21 | F20; admitted node lacks exactly one dense `AstNodeOrdinal` lookup | `INVALID_AST_NODE / INTERNAL` | current bounded path | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | before node execution | `STATIC_BRANCH_BINDING` | `NULL` | node-ordinal admission/lookup guard |
| L22 | F20; selected root's `EventBranchOrdinal` is absent, nondense, or out of 1..59 | `INVALID_AST_NODE / INTERNAL` | `[]` | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | before AST traversal | `STATIC_BRANCH_BINDING` | `NULL` | root-ordinal admission/selected-root guard |
| L23 | F20; known tagged branch has absent, nondense, or out-of-range `TaggedVariantOrdinal` | `INVALID_AST_NODE / INTERNAL` | tagged-union path | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | tag read only; no child entry | `STATIC_BRANCH_BINDING` | `NULL` | tagged branch ordinal invariant guard |
| L24 | F20; authenticated discriminator entry coordinate cannot be constructed or violates one-based canonical-entry bounds | `INVALID_AST_NODE / INTERNAL` | tagged-union path | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | tag lookup only; no child entry | `STATIC_BRANCH_BINDING` | `NULL` | tagged field-coordinate construction guard |
| L25 | F20; more than one frozen tagged literal matches one primitive | `INVALID_AST_NODE / INTERNAL` | tagged-union path | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | tag read only; no child entry | `STATIC_BRANCH_BINDING` | `NULL` | tagged literal uniqueness guard |

These leaves are mutually exclusive by first failing invariant in order L20, L21, L22, L23, L24, L25. Tagged multiple match is an AST-authority invariant and therefore maps to F20, not F28. F28 is now closed-union multiple match only.

### 3.4 Leaves L26-L47

| Leaf | Public context; trigger | Code / phase | Path policy | Summary; Q; retry | Read budget | Evidence | Coordinate | Exact source binding |
|---|---|---|---|---|---|---|---|---|
| L26 | F21; plain exact record missing field | `MISSING_REQUIRED_FIELD / AST_TRAVERSAL` | field ordinal | `PAYLOAD_REJECTED; false; AFTER_INPUT_CORRECTION` | selected AST | `CALLABLE_PRIMARY_TEST` | `NULL` | exact-record missing branch without active tagged coordinate |
| L27 | F21; selected tagged child has nested missing field | `MISSING_REQUIRED_FIELD / AST_TRAVERSAL` | variant ordinal then nested field | same as L26 | selected child only | `CALLABLE_PRIMARY_TEST` | `KNOWN_VARIANT_STACK_LOCAL` | exact-record missing branch with active coordinate |
| L28 | F22; plain exact record extra field | `EXTRA_FIELD / AST_TRAVERSAL` | extra-entry ordinal | `PAYLOAD_REJECTED; false; AFTER_INPUT_CORRECTION` | selected AST | `CALLABLE_PRIMARY_TEST` | `NULL` | exact-record extra branch without active coordinate |
| L29 | F22; selected tagged child has nested extra field | `EXTRA_FIELD / AST_TRAVERSAL` | variant ordinal then extra entry | same as L28 | selected child only | `CALLABLE_PRIMARY_TEST` | `KNOWN_VARIANT_STACK_LOCAL` | exact-record extra branch with active coordinate |
| L30 | F23; plain AST kind mismatch | `INVALID_FIELD_TYPE / AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED; false; AFTER_INPUT_CORRECTION` | selected AST | `CALLABLE_PRIMARY_TEST` | `NULL` | node-kind branch without active coordinate |
| L31 | F23; selected tagged child has nested kind mismatch | `INVALID_FIELD_TYPE / AST_TRAVERSAL` | variant ordinal then nested path | same as L30 | selected child only | `CALLABLE_PRIMARY_TEST` | `KNOWN_VARIANT_STACK_LOCAL` | node-kind branch with active coordinate |
| L32 | F24; plain literal/enum mismatch | `INVALID_FIELD_VALUE / AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED; false; AFTER_INPUT_CORRECTION` | selected AST | `CALLABLE_PRIMARY_TEST` | `NULL` | literal/enum branch without active coordinate |
| L33 | F24; selected tagged child has nested literal/enum mismatch | `INVALID_FIELD_VALUE / AST_TRAVERSAL` | variant ordinal then nested path | same as L32 | selected child only | `CALLABLE_PRIMARY_TEST` | `KNOWN_VARIANT_STACK_LOCAL` | literal/enum branch with active coordinate |
| L34 | F25; plain array/tuple cardinality mismatch | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED; false; AFTER_INPUT_CORRECTION` | selected AST | `CALLABLE_PRIMARY_TEST` | `NULL` | cardinality branch without active coordinate |
| L35 | F25; selected tagged child has nested cardinality mismatch | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | variant ordinal then nested path | same as L34 | selected child only | `CALLABLE_PRIMARY_TEST` | `KNOWN_VARIANT_STACK_LOCAL` | cardinality branch with active coordinate |
| L36 | F26; tagged discriminator missing | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | tagged-union path | `PAYLOAD_REJECTED; false; AFTER_INPUT_CORRECTION` | no variant-child read | `CALLABLE_PRIMARY_TEST` | `MISSING_DISCRIMINANT` | tagged missing-entry branch |
| L37 | F26; tagged discriminator wrong primitive kind | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | tagged-union path plus field coordinate | same as L36 | no variant-child read | `CALLABLE_PRIMARY_TEST` | `INVALID_DISCRIMINANT_TYPE` | tagged primitive-kind branch |
| L38 | F26; tagged discriminator unknown literal | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | tagged-union path plus field coordinate | same as L36 | no variant-child read | `CALLABLE_PRIMARY_TEST` | `UNKNOWN_DISCRIMINANT_VALUE` | tagged literal lookup zero-result branch |
| L39 | F27; closed union zero matches | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED; false; AFTER_INPUT_CORRECTION` | all closed branches, no output | `CALLABLE_PRIMARY_TEST` | `NULL` | closed-union zero-match branch |
| L40 | F28; closed union multiple matches | `AMBIGUOUS_UNION / AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED; true; NEVER` | all closed branches, no output | `STATIC_BRANCH_BINDING` | `NULL` | closed-union multiple-match integrity guard |
| L41 | F29; plain refinement predicate rejects | `INVALID_REFINEMENT / AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED; false; AFTER_INPUT_CORRECTION` | one primitive predicate | `CALLABLE_PRIMARY_TEST` | `NULL` | refinement predicate without active coordinate |
| L42 | F29; selected tagged child refinement rejects | `INVALID_REFINEMENT / AST_TRAVERSAL` | variant ordinal then nested path | same as L41 | selected child predicate only | `CALLABLE_PRIMARY_TEST` | `KNOWN_VARIANT_STACK_LOCAL` | refinement predicate with active coordinate |
| L43 | F30; refinement metadata invariant invalid | `INVALID_REFINEMENT / INTERNAL` | current path | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | no semantic read | `STATIC_BRANCH_BINDING` | `NULL` | refinement metadata guard |
| L44 | F31; detached backing construction/freeze fails | `VALIDATED_BACKING_CONSTRUCTION_FAILED / BACKING_CONSTRUCTION` | `[]` | `BACKING_CONSTRUCTION_FAILED; true; AFTER_PROCESS_RESTART` | traversal complete | `STATIC_BRANCH_BINDING` | `NULL` | backing construction catch |
| L45 | F32; token allocation/registration fails | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE / TOKEN_ISSUE` | `[]` | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | backing complete | `STATIC_BRANCH_BINDING` | `NULL` | token issuer catch |
| L46 | F33; token consumer receives nonissued identity | `INVALID_STRUCTURAL_TOKEN / TOKEN_CONSUMPTION` | `[]` | `STRUCTURAL_TOKEN_REJECTED; true; NEVER` | no payload read | `CALLABLE_PRIMARY_TEST` | `NULL` | token reader identity gate |
| L47 | F34; another safely catchable internal exception | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE / INTERNAL` | `[]` | `INTERNAL_FAILURE; true; AFTER_PROCESS_RESTART` | bounded at catch phase | `STATIC_BRANCH_BINDING` | `NULL` | outer containment catch after known leaves exhausted |

The exact census is: 47 leaves, 34 public F-contexts, 19 public codes, 31 callable leaves, and 16 static leaves. Static leaves are L01, L04, L06, L18-L25, L40, L43-L45, and L47. Every other leaf is callable.

## 4. Known-variant stack-local coordinate

After L36-L38 are excluded and exactly one branch is selected, traversal constructs the V2 `KNOWN_VARIANT` coordinate from the selected root ordinal, current node ordinal, authenticated field entry coordinate, and C1 branch ordinal. It passes that frozen coordinate as a stack-local traversal argument to the selected child only.

The coordinate is attached to a nested public diagnostic only for L27, L29, L31, L33, L35, or L42. It is not stored in A backing, C1 authority, the detached validated event, token backing, module-global state, cache, Catalog, digest, replay, or history. Returning from the selected child discards the stack reference. A nested tagged union replaces the active coordinate for its own child; the ordinary bounded path retains the outer variant segment, so there is no ambiguous coordinate stack or raw-name leakage.

The nine callable tagged-coordinate cases are exact:

1. L36 missing discriminator, `field:null`;
2. L37 wrong primitive, authenticated field coordinate;
3. L38 unknown literal, authenticated field coordinate and no raw literal;
4. L27 known variant plus nested missing field;
5. L29 known variant plus nested extra field;
6. L31 known variant plus nested kind mismatch;
7. L33 known variant plus nested literal/enum mismatch;
8. L35 known variant plus nested cardinality mismatch;
9. L42 known variant plus nested refinement rejection.

No coordinate contains raw field names, raw tag values, accepted literals, node IDs, branch IDs, input descriptions, stacks, or platform text. No missing/wrong/unknown path enters a child. No known path trial-runs a second child.

## 5. Section 12 V3 evidence additions

All 18 requirements reissued in V2 section 7 remain mandatory. The following additions are part of that same Section 12 contract and do not replace any earlier item:

| Evidence item | Exact required result |
|---|---|
| leaf census | 47 unique leaf IDs, 34 public F-contexts, 19 public codes, no orphan leaf or policy |
| callable/static census | exactly 31 `CALLABLE_PRIMARY_TEST` and 16 `STATIC_BRANCH_BINDING` |
| callable suite | one primary invocation for each callable leaf; table-driven execution is allowed but every leaf has a distinct asserted leaf identity, trigger, public diagnostic, path, budget, and coordinate policy |
| static suite | one exact source symbol/branch/policy/fail-closed binding for each of the 16 static leaves; no injectable production fault hook |
| F26 split | separate public tests for L36, L37, and L38; each proves zero child entry and its exact coordinate state |
| known nested coordinate | the six L27/L29/L31/L33/L35/L42 cases prove the same selected variant coordinate survives only through its child failure |
| nine tagged cases | all nine cases in section 4 have unique leaf identities and deterministic repeat results |
| F20 guards | L20-L25 each has one exact static branch binding; coordinate lookup/ordinal guards cannot fall through to F34 |
| F28 restriction | source and policy census prove F28 is reachable only from the closed-union multiple-match guard |
| total mapping | every trigger maps to exactly one leaf, public F-context, code, phase, path policy, summary, quarantine flag, retryability, read budget, evidence kind, coordinate policy, and source binding |
| nonleakage | hostile tags and names are absent from diagnostics and coordinates; accepted literals, node IDs, and branch IDs are also absent |
| selection safety | missing/wrong/unknown enter zero children; known enters exactly one; tagged multiple is F20 static; there is no first-match/trial traversal |

The callable suite therefore contains 31 primary leaf cases, the static table contains 16 bindings, and the tagged-coordinate subset contains nine callable cases. Green tests without these exact censuses do not close the design.

## 6. Traceability V1.1 update

The V2 inventory remains exactly five grouping rows plus 28 active rows, total 33. No ID is added or removed. The only changed active definitions are C-C15a through C-C15d:

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C-C15a | Diagnostic leaf policy is total and compatible | 47 leaves map uniquely to 34 public F-contexts and 19 public codes with no orphan/default | frozen leaf tuple, bidirectional type equality, runtime 47/34/19 census and unique-policy audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | exact one-to-one leaf policy; 31 callable and 16 static | V2 public F01-F34 policy and this V3 matrix |
| C-C15b | Callable diagnostics match their real boundary behavior | all 31 callable leaves produce the exact public diagnostic, path, read budget, evidence identity, and coordinate policy | public/package-private callable leaf suite with distinct asserted leaf identity | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | 31/31 exact, deterministic, fail closed, nonleaking | A capture translation and C1 structural fixtures |
| C-C15c | Tagged-union coordinates are total and unambiguous | all nine callable tagged cases use the correct root/node/variant domains; only known variants carry variant ordinal; no raw tag leaks | nine-case tagged coordinate suite plus no-trial/nonleak assertions | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | 9/9 unique leaf and coordinate mapping | C1 roots, unique-node traversal, tagged branches |
| C-C15d | Internal diagnostic guards have exact static authority | all 16 static leaves bind one source branch and cannot fall through to another leaf or F34 | exact source-binding table and AST/policy exhaustiveness audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | 16/16 exact fail-closed bindings; no fake runtime fault | frozen source, C1 health invariants, diagnostic tuple |

The grouping rows remain C-C03, C-C06, C-C09, C-C12, and C-C15. The 28 active IDs remain C-C01, C-C02, C-C03a, C-C03b, C-C03c, C-C04, C-C05, C-C06a, C-C06b, C-C07, C-C08, C-C09a, C-C09b, C-C10, C-C11, C-C12a, C-C12b, C-C12c, C-C13, C-C14, C-C15a, C-C15b, C-C15c, C-C15d, C-C16, C-C17, C-C18, and C-C19. All non-C15 design fields remain byte-for-meaning identical to V2. At design time all 28 active criteria are pending and zero claim PASS or an Actual binding; grouping rows own no primary identity.

## 7. Unchanged behavior, allowlist, and stop conditions

This leaf refinement changes diagnostic proof granularity only. The 34 public F-contexts, 19 public codes, runtime input set, 14-field envelope language, 40 event types, 59 payload branches, 15 AST kinds, A capture boundary, C1 authority, B26/B54 behavior, structural/semantic boundary, token meaning, and validation success set remain unchanged.

The future production allowlist remains exactly `canonical-domain-event.ts`, `domain-event-structural-validator.ts`, and necessary named exports in `index.ts`. The only future test file remains `domain-event-structural-validator.test.ts`; the only implementation evidence file remains the C test-traceability document. A, B, C1, event definitions/schema, semantic validators, replay, rebuild, batch, state, snapshots, application, roles, Dreamer, impairment, ownership, coverage, workflow, and controls are forbidden.

Stop before implementation if review cannot prove the 47/34/31/16 census, if any leaf overlaps, if F26 remains merged, if F28 includes tagged multiple, if a known nested failure loses its coordinate, if an internal guard can fall to F34, if a raw tag/name/literal/node/branch identity can leak, or if closure requires any forbidden file or behavior change. This correction consumes no repair round and does not begin Repair Round 2.

## 8. Fresh independent design-review gate

The reviewer must independently verify the exact 47-member union and every policy row; six mutually exclusive F20 leaves; three callable F26 leaves; the plain/known-tagged splits for F21-F25 and F29; F28 restricted to closed-union multiple; 31 callable and 16 static evidence assignments; nine tagged-coordinate cases; stack-local coordinate lifetime; unique path/read/evidence/source mapping; updated C-C15a-d with unchanged 33-row census; unchanged behavior, inputs, C1/A/B/events/schema, and allowlist; and that Repair Round 2 has not begun.

Only `RULE_DESIGN_PASS` with `remainingDesignBlockers=[]` can authorize the bounded future implementation. This writer does not issue or infer that verdict.

READY_FOR_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW_V3
