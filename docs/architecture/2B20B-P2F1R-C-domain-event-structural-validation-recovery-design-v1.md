# Phase 3 Slice 2B20B-P2F1R-C Recovery Design V1

## 1. Authorization

- `authorization`: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_C_RECOVERY_DESIGN_AND_INDEPENDENT_REVIEW_ONLY`
- `slice`: `Phase 3 Slice 2B20B-P2F1R-C — BOTC Domain Event Structural Validation Foundation — C1 AST Consumer Recovery`
- `designKind`: `RECOVERY_DESIGN_ONLY`
- `implementationAuthorized`: `false`
- `ruleSemanticsChanged`: `false`
- `runtimeInputSetChanged`: `false`
- `behaviorChanged`: `false`

This document is the sole current implementation-authority design for a future, separately authorized C recovery implementation. It does not accept C1, authorize C code, publish A/B/C1, start D/P2F, or permit reuse of the failed C implementation.

## 2. Clean baseline

- frozen source HEAD: `7fc337325f274c669a356a30c7485e2fdf134643`
- recorded branch: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`
- design worktree: independent detached worktree rooted at that exact HEAD
- recovery precheck: `docs/architecture/2B20B-P2F1R-C-recovery-governance-precheck-after-c1.md`
- recovery precheck SHA-256: `85c631ac76fe86f8c4b2334fcf8599c3172d24676b985ced2ff301c0a9b59410`
- precheck verdict: `GO`

No production or test file is changed by this design. The only intended design-worktree addition is this document.

## 3. Protected failed worktree

The original workspace at `C:\Users\wjl\Documents\血染钟楼` is a preserved, unaccepted, dirty C site. It is not a source baseline. Its 11 recorded files and SHA-256 values remain governed by the recovery precheck. This design must not stage, commit, reset, clean, delete, copy, adapt, or cite the failed implementation as code authority. Future implementation starts from the frozen clean HEAD and this reviewed design only.

`unacceptedCWorktreePreserved=true` is a design gate. Any byte change in that 11-file inventory before design review is `HUMAN_BLOCKED`.

## 4. Prior C disposition

Only the following disposition vocabulary is normative.

| Original Contract | Disposition | Recovery Authority | Reason |
|---|---|---|---|
| exact 14-field envelope | `REUSE_UNCHANGED` | section 8 of this design | accepted envelope type is unchanged |
| 40-event inventory | `REUSE_WITH_C1_BINDING_UPDATE` | healthy C1 `candidate.roots` grouped by `eventType`/`eventOrdinal` | C1 is the runtime payload authority |
| 59-branch inventory | `REUSE_WITH_C1_BINDING_UPDATE` | healthy C1 roots ordered by `branchOrdinal` | removes duplicate/manual branch schema |
| unknown-event policy | `REUSE_UNCHANGED` | C event dispatch | unknown event fails closed before C payload acquisition |
| payload version policy | `REUSE_WITH_C1_BINDING_UPDATE` | each C1 root `versionPolicy` | the policy is read directly, never inferred |
| legacy `FirstNightTaskInserted` policy | `REUSE_UNCHANGED` | root `C-B31-TASK-INSERTED-LEGACY-U` | keeps the exact legacy structural promise without fallback |
| C token | `REUSE_WITH_C1_BINDING_UPDATE` | sections 15-17 | issuance now requires C1 AST traversal |
| zero-read observability | `REQUIRES_NEW_RECOVERY_CONTRACT` | section 19 | must distinguish A capture from C payload reads honestly |
| registry health | `REUSE_WITH_C1_BINDING_UPDATE` | section 18 | C admits one healthy C1 authority; no schema registry |
| diagnostics | `REQUIRES_NEW_RECOVERY_CONTRACT` | section 20 | closed codes/phases are rebound to C1 traversal |
| validation precedence | `REQUIRES_NEW_RECOVERY_CONTRACT` | section 21 | C1 health must precede input capture |
| structural/semantic boundary | `REUSE_UNCHANGED` | section 22 | structural proof remains nonsemantic |
| production allowlist | `REUSE_WITH_C1_BINDING_UPDATE` | section 24 | remains at most three files, with C1 internal imports |
| test plan | `REUSE_WITH_C1_BINDING_UPDATE` | section 25 | C primary tests must exercise the real C1 consumer |
| Traceability | `REQUIRES_NEW_RECOVERY_CONTRACT` | section 26 | complete 21-row design-time matrix including C-C19 |
| Catalog V1 runtime authority | `SUPERSEDED_BY_C1` | C1 AST authority | a document is not runtime authority |
| handwritten 59-branch shape map | `SUPERSEDED_BY_C1` | C1 roots and nodes | would create a second schema |
| independent schema registry | `SUPERSEDED_BY_C1` | one admitted C1 authority plus derived non-authoritative indexes | dynamic/parallel authority is forbidden |
| legacy validator fallback | `SUPERSEDED_BY_C1` | generic AST traversal | fallback would silently widen inputs |
| C-B26 fixed tuple | `SUPERSEDED_BY_C1` | C1 `NON_EMPTY_ARRAY` node | fixed length conflicts with accepted variadic shape |
| C-B54 placeholder expression | `SUPERSEDED_BY_C1` | C1 normalized three-member structure | TypeScript-only placeholder is not runtime input |
| all source/test bytes in the failed C worktree | `INVALIDATED_BY_FAILED_IMPLEMENTATION` | clean frozen HEAD plus this design | no code reuse is authorized |

## 5. C1 input authority

The only runtime payload-structure authority is `packages/domain-core/src/domain-event-structural-schema-ast.ts` at the frozen HEAD. Its actual runtime exports are:

- seven version constants: `DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION`, `DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION`, `DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION`, `DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION`, `DOMAIN_EVENT_STRUCTURAL_AUDIT_PROJECTION_VERSION`, `DOMAIN_EVENT_STRUCTURAL_AUDIT_CATALOG_VERSION`, `DOMAIN_EVENT_STRUCTURAL_VALIDATOR_VERSION`;
- closed values/helpers: `STRUCTURAL_SCHEMA_NODE_KINDS`, `STRUCTURAL_ID_ALIASES_V1`, `compareRawUtf16CodeUnits`, `compareStructuralLiterals`, `getCanonicalChildNodeIds`, `formatStructuralOrdinal`;
- authority constructors: `createStructuralSchemaAuthority`, `createStructuralSchemaAuthorityForTestCandidate`, `createFullC1StructuralSchemaAuthority`;
- declarations/proofs: `FULL_C1_SCHEMA_NODE_DECLARATIONS`, `FULL_C1_SCHEMA_ROOT_DECLARATIONS`, `FULL_C1_EVENT_EXACTNESS_PROOFS`, `FULL_C1_B54_COMPILE_TIME_PROOFS`, `FULL_C1_EXPECTED_EXPANDED_OCCURRENCE_CENSUS`.

Its actual type exports are `StructuralSchemaNodeKind`, `StructuralIdAliasV1`, `StructuralLiteralV1`, `StructuralSchemaNodeV1`, `StructuralRecordFieldV1`, `StructuralTaggedBranchV1`, `StructuralRefinementNodeV1`, `StructuralSchemaNodeBindingV1`, `StructuralSchemaRootV1`, `ApprovedStructuralDeltaIdV1`, `StructuralDeltaBindingV1`, `StructuralSchemaCensusV1`, `StructuralSchemaCandidateV1`, `CanonicalUniqueNodeTraversalV1`, `StructuralSchemaHealthCodeV1`, `StructuralSchemaHealthDiagnosticV1`, `HealthyStructuralSchemaAuthorityV1`, `StructuralSchemaAuthorityResultV1`, `InferFullC1StructuralNode`, and `FullC1EventExactnessProofs`.

None is root-exported from `packages/domain-core/src/index.ts`. C uses a same-package direct import and requires no C1 or root-export modification.

## 6. C1 consumer contract

The exact minimum C1 import set is:

```ts
import { createFullC1StructuralSchemaAuthority } from
  "./domain-event-structural-schema-ast.js";
import type {
  HealthyStructuralSchemaAuthorityV1,
  StructuralSchemaAuthorityResultV1,
  StructuralSchemaNodeV1,
  StructuralSchemaRootV1,
  StructuralLiteralV1,
  StructuralIdAliasV1
} from "./domain-event-structural-schema-ast.js";
```

`StructuralSchemaAuthorityResultV1` is needed by the package-private pure admission seam used for unhealthy-result tests; `HealthyStructuralSchemaAuthorityV1` is the admitted runtime value; the other types close the consumer switch and dispatch contracts. C must not import declaration arrays, Catalog generation, delta bindings, artifact digest functions, B hashing, or C1 test constructors in production.

C reads only `candidate.roots`, `candidate.nodeBindings`, and `traversal`. It does not refreeze, mutate, clone, reissue, serialize, or persist C1 authority. It stores only references to the already deep-frozen healthy result and deterministic derived indexes whose values are references to those same frozen roots/nodes. Derived indexes are consumer caches, not schema authority. Catalog V1/V2 and artifact digests are never runtime inputs.

The exact A same-package import set is:

```ts
import {
  captureCanonicalRuntimeValue,
  readCanonicalRuntimeBackingForStructuralValidation
} from "./canonical-runtime-value.js";
import type {
  CapturedCanonicalRuntimeValue,
  InternalCanonicalRuntimeValue,
  InternalCanonicalRuntimeObjectEntry
} from "./canonical-runtime-value.js";
```

The A reader and internal backing types remain package-internal; no new A root export is required.

## 7. Recovery architecture

The unique allowed flow is:

```text
C1 health result
  -> C authority admission
  -> unknown input
  -> A descriptor-safe capture (exactly once)
  -> authenticated A canonical backing
  -> C exact 14-field envelope validation
  -> C event/root version/branch dispatch from C1 roots
  -> C generic traversal of the selected C1 AST root
  -> C-owned detached deep-frozen event backing
  -> process-local opaque C token
```

C owns envelope validation, dispatch, generic AST execution, diagnostic mapping, detachment, token issuance, and token reading. C1 owns the schema language and frozen schema graph. A owns hostile-object capture and canonical backing. Existing semantic, batch, replay, and future P2F layers retain their own responsibilities.

No runtime path reads Catalog V1/V2, an artifact digest, a hand-maintained shape map, a legacy validator, TypeScript reflection, or B hash.

## 8. Envelope contract

The envelope is an exact canonical `OBJECT` with exactly these 14 required, non-null fields in this precedence order:

| # | Field | Runtime structural contract | Empty policy | C structural owner | Semantic owner |
|---:|---|---|---|---|---|
| 1 | `category` | `STRING`, literal `domain` | empty rejected | C envelope | category routing |
| 2 | `eventId` | `STRING`, non-empty and trim-stable | empty rejected | C envelope | uniqueness/provenance |
| 3 | `gameId` | `STRING`, non-empty and trim-stable | empty rejected | C envelope | stream/state agreement |
| 4 | `eventSequence` | `INTEGER`, finite safe integer | n/a | C envelope | continuity/order |
| 5 | `batchId` | `STRING`, non-empty and trim-stable | empty rejected | C envelope | batch grouping |
| 6 | `gameVersion` | `INTEGER`, finite safe integer | n/a | C envelope | revision continuity |
| 7 | `eventType` | `STRING`; known-literal decision occurs in dispatch | empty rejected | C envelope/dispatch | state legality |
| 8 | `eventVersion` | `INTEGER`, literal `1` (`SUPPORTED_DOMAIN_EVENT_VERSION`) | n/a | C envelope | accepted-history version policy |
| 9 | `rulesBaselineVersion` | `STRING`, non-empty and trim-stable | empty rejected | C envelope | rules agreement |
| 10 | `commandId` | `STRING`, non-empty and trim-stable | empty rejected | C envelope | command semantics |
| 11 | `createdAt` | `STRING` | empty allowed | C envelope | chronology/time semantics |
| 12 | `correlationId` | `STRING`, non-empty and trim-stable | empty rejected | C envelope | audit correlation |
| 13 | `causationId` | `STRING`, non-empty and trim-stable | empty rejected | C envelope | causal meaning |
| 14 | `payload` | canonical `OBJECT`; only presence and backing kind at envelope phase | n/a | C envelope/selected C1 root | event meaning |

All nulls, missing fields, extra fields, and wrong primitive kinds fail. `eventSequence` and `gameVersion` need not be positive or continuous in C. `createdAt` is not parsed or normalized. No UUID/prefix/ISO policy is invented. The payload value is not traversed at envelope phase.

Forbidden envelope additions are `actorId`, `batchSequence`, `receipt`, `hash`, `snapshot`, and top-level `schemaVersion`.

## 9. Dispatch contract

On module admission C verifies the healthy C1 census is exactly 40 events, 59 roots, 13 explicit-version roots, 46 unversioned roots, dense event ordinals 1..40, and dense branch ordinals 1..59. It derives immutable lookup indexes by direct root references; it does not copy schema content.

The 13 explicit roots are exactly C-B16, C-B17, C-B18, C-B23, C-B24, C-B44, C-B45, and C-B47 through C-B52. Their `fieldName` and `acceptedLiteral` come directly from each root. The remaining 46 roots, including legacy C-B31, are `UNVERSIONED`. This classification is not duplicated as production data; this text freezes the expected census for admission and tests.

Dispatch proceeds deterministically:

1. map envelope `eventType` to roots with the same C1 `eventType` and `eventOrdinal`; zero roots is `UNKNOWN_EVENT_TYPE`;
2. require envelope `eventVersion===1` before payload acquisition;
3. acquire the canonical payload `OBJECT` backing once;
4. derive each root's dispatch signature from the frozen AST: its top-level exact key set plus only literal/tag/version discriminator constraints reachable without reading nondiscriminator values;
5. apply `EXPLICIT_LITERAL` by exact field presence, backing primitive, and literal equality; apply `UNVERSIONED` only when no explicit sibling discriminator is present and its AST-derived signature matches;
6. require exactly one root; zero is `INVALID_PAYLOAD_BRANCH` unless an explicit version field is present with no accepted literal, which is `UNSUPPORTED_EVENT_VERSION`; more than one is `INVALID_PAYLOAD_BRANCH` with the safe summary `AMBIGUOUS_BRANCH`;
7. traverse the unique root fully.

Key-set/discriminator reads are branch-dispatch reads, not payload-content traversal. No nondiscriminator payload value is read until a unique branch is selected. There is no first/latest/legacy fallback. Duplicate roots, missing roots, nondense ordinals, indistinguishable dispatch signatures, a missing referenced root node, or a consumer index construction exception make C authority admission unhealthy before external input capture.

## 10. Generic AST traversal

Traversal is implemented only in `domain-event-structural-validator.ts`. It consumes `InternalCanonicalRuntimeValue` and frozen C1 nodes. It uses indexed loops over A arrays/entries and never calls an iterator, getter, `toString`, `valueOf`, coercion, or original caller object.

| Node kind | Required backing | Child access and exact behavior | Failure/output |
|---|---|---|---|
| `NULL` | `NULL` | no child | wrong kind `INVALID_FIELD_TYPE`; output `null` |
| `BOOLEAN` | `BOOLEAN` | no child | wrong kind; output boolean |
| `SAFE_INTEGER` | `INTEGER` | A has already guaranteed safe integer and no `-0` | wrong kind; output number |
| `STRING` | `STRING` | no child | wrong kind; output string |
| `LITERAL` | backing kind matching literal | compare without coercion (`Object.is` for number) | mismatch `INVALID_FIELD_VALUE`; output literal |
| `ENUM` | backing kind matching one member | test frozen values in C1 order without coercion | no member `INVALID_FIELD_VALUE`; output value |
| `NULLABLE` | `NULL` or child kind | null succeeds directly; otherwise resolve `childNodeId` | child diagnostic retains path; output null/child |
| `EXACT_RECORD` | `OBJECT` | compare canonical entries with C1 fields ordered by `fieldOrdinal`; reject first missing then first extra; visit every child | missing/extra/type diagnostics; output null-prototype exact object |
| `ARRAY` | `ARRAY` | any dense A length; visit elements by index | child failure at index; output frozen array |
| `NON_EMPTY_ARRAY` | `ARRAY` | require `length>=1`, no maximum; visit elements | empty `INVALID_PAYLOAD_STRUCTURE`; output frozen array |
| `BOUNDED_ARRAY` | `ARRAY` | require inclusive C1 `minItems..maxItems`; visit elements | cardinality failure; output frozen array |
| `TUPLE` | `ARRAY` | exact length equals `elementNodeIds.length`; visit by position | length failure; output frozen tuple |
| `TAGGED_UNION` | `OBJECT` | read only `tagField`, match exactly one frozen tag literal by `branchOrdinal`, then traverse that branch | zero branch `INVALID_PAYLOAD_STRUCTURE`; duplicate match `AMBIGUOUS_UNION` |
| `CLOSED_UNION` | any | traverse every branch independently without leaking failed partial output; require `selection=EXACTLY_ONE` | zero `INVALID_PAYLOAD_STRUCTURE`; multiple `AMBIGUOUS_UNION`; output sole result |
| `REFINEMENT` | backing accepted by `baseNodeId` | traverse base first, then execute the closed refinement | unknown/invalid metadata `INVALID_REFINEMENT`; output base value |

Node lookup uses a C-owned immutable map from `nodeId` to the already frozen C1 node. Missing nodes cannot be repaired; they produce authority-unhealthy admission, not an input diagnostic. Paths advance only by envelope field ordinal, payload field ordinal, array index, tuple index, or union branch ordinal and are capped at 32 segments with a terminal `TRUNCATED` segment.

Traversal neither creates AST nodes nor uses open records, reflection, GameState, event-specific semantic validators, Catalog artifacts, or legacy shape code.

## 11. Refinement execution

The closed `DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION` supports exactly two refinement kinds:

| Refinement | Base requirement | Parameters | Predicate | Failure |
|---|---|---|---|---|
| `NON_EMPTY_TRIMMED_STRING` | base resolves to string | none | `value.length>0 && value===value.trim()` | `INVALID_FIELD_VALUE` at current bounded path |
| `ID_STRING` | base resolves to string | `alias` in the 16-value closed alias union | same non-empty trim-stable structural ID-string predicate; alias is diagnostic metadata only and does not prove existence | unsupported alias/metadata `INVALID_REFINEMENT`; predicate failure `INVALID_FIELD_VALUE` |

The 16 allowed aliases are exactly `AbilityImpairmentId`, `AbilityInstanceId`, `AbilityUseEntitlementId`, `ActionOpportunityId`, `CandidateId`, `DreamerApparentPairCandidateId`, `EventId`, `FirstNightAbilityInstanceId`, `FirstNightAbilityOutcomeFactId`, `GameId`, `GrantedAbilityId`, `MathematicianDeliveryId`, `PlayerId`, `RoleId`, `RoleTenureId`, and `ScheduledTaskId`.

Refinement dispatch is a closed switch. There are no callbacks, registries, dynamic registration, locale rules, or environment-dependent predicates. Player/role/task existence, state, producer, sequence, batch, replay, opportunity, and impairment provenance are forbidden refinements.

## 12. Payload validation

After unique dispatch, the selected root's `rootNodeId` is traversed once. Required fields, exact keys, literals, enums, nullable values, nested objects, arrays, tuples, unions, and refinements come only from that C1 graph. The successful value is built during traversal; no second validation pass re-reads the A backing.

The 40/59 public matrix must prove every C1 root accepts its authentic structural vector. A single-point mutation matrix proves missing, extra, wrong-kind, wrong-literal, cardinality, version, and union failures. Event-specific validators may be invoked later by semantic consumers but cannot be called by C or used as fallback.

## 13. B26 compatibility

For `C-B26-SEAMSTRESS-DELIVERY-U`, `representedImpairments` is validated only through the C1 `NON_EMPTY_ARRAY` node bound by `B26_SEAMSTRESS_VARIADIC_DELTA`: `minItems=1`, `maxItems=null`, and the item schema is its AST child. C contains no Seamstress branch special case. Empty arrays fail; one and multiple authentic items pass structurally. The delta registry is supporting audit metadata only.

## 14. B54 compatibility

For `C-B54-MATHEMATICIAN-DELIVERY-U`, generic AST traversal preserves exactly the outer source-contract members `BASE_MATHEMATICIAN`, `PHILOSOPHER_GAINED_MATHEMATICIAN_V1`, and `PHILOSOPHER_GAINED_MATHEMATICIAN_V2`; each uses the C1 normalized inner survivor `BASE_ROLE_TASK`, `PHILOSOPHER_GAINED_TASK_V1`, or `PHILOSOPHER_GAINED_TASK_V2`. C does not recognize a TypeScript-only `R{}` placeholder, add a fallback, or widen inputs. Authentic producer shapes pass; wrong generation, missing fields, and extra fields fail. The delta registry never selects a runtime branch.

## 15. C token

After successful traversal C constructs a new detached value from traversal outputs. It does not reuse A backing, retain the A token, retain C1 node references, or expose a backing. It contains the exact 14 fields, the ordinary typed event value, `eventType`, `eventVersion`, `payloadBranchId`, and `payloadSchemaIdentity` (the selected C1 `rootNodeId`). Objects are null-prototype exact records; arrays and all records are recursively frozen.

The token is an empty frozen null-prototype object registered in private module-local `WeakSet<object>` and `WeakMap<object, InternalValidatedDomainEvent>`. It has no public constructor, symbol, brand, or enumerable data. Spread, JSON round trip, `structuredClone`, Proxy wrapping, worker transfer, and process transfer all lose identity. Only the exact issued object authenticates.

The token proves only `STRUCTURALLY_VALIDATED_DOMAIN_EVENT` and always pairs with `NOT_SEMANTICALLY_ACCEPTED`. It never proves accepted, trusted, replayable, authorized, canonical history, producer legality, sequence legality, or state compatibility.

## 16. Public API

```ts
export type StructurallyValidatedDomainEventToken = object;

export type DomainEventPayloadBranchId = string;
export type DomainEventPayloadSchemaIdentity = string;

export type DomainEventStructuralPathSegment =
  | { readonly kind: "ENVELOPE_FIELD_ORDINAL"; readonly ordinal: number }
  | { readonly kind: "PAYLOAD_FIELD_ORDINAL"; readonly ordinal: number }
  | { readonly kind: "ARRAY_INDEX"; readonly index: number }
  | { readonly kind: "UNION_BRANCH_ORDINAL"; readonly ordinal: number }
  | { readonly kind: "TRUNCATED" };

export type DomainEventStructuralSafeSummary =
  | "AUTHORITY_UNAVAILABLE"
  | "INPUT_CAPTURE_FAILED"
  | "ENVELOPE_REJECTED"
  | "EVENT_DISPATCH_REJECTED"
  | "AMBIGUOUS_BRANCH"
  | "PAYLOAD_REJECTED"
  | "TOKEN_REJECTED"
  | "INTERNAL_FAILURE";

export type DomainEventStructuralRetryability =
  | "NEVER"
  | "AFTER_INPUT_CORRECTION"
  | "AFTER_PROCESS_RESTART";

export type DomainEventStructuralDiagnostic = {
  readonly code: DomainEventStructuralDiagnosticCode;
  readonly phase: DomainEventStructuralDiagnosticPhase;
  readonly path: readonly DomainEventStructuralPathSegment[];
  readonly safeSummary: DomainEventStructuralSafeSummary;
  readonly quarantineRecommended: boolean;
  readonly retryability: DomainEventStructuralRetryability;
  readonly failClosed: true;
};

export type DomainEventStructuralValidationResult =
  | {
      readonly ok: true;
      readonly structuralStatus: "STRUCTURALLY_VALIDATED_DOMAIN_EVENT";
      readonly semanticStatus: "NOT_SEMANTICALLY_ACCEPTED";
      readonly token: StructurallyValidatedDomainEventToken;
      readonly eventType: DomainEventType;
      readonly eventVersion: 1;
      readonly payloadBranchId: DomainEventPayloadBranchId;
      readonly payloadSchemaIdentity: DomainEventPayloadSchemaIdentity;
    }
  | { readonly ok: false; readonly diagnostic: DomainEventStructuralDiagnostic };

export function validateDomainEventStructure(
  input: unknown
): DomainEventStructuralValidationResult;
```

The string aliases are closed at runtime by selected C1 roots even though their public TypeScript representation is `string`. Success contains no `Record<string, unknown>` and no optional property. Root `index.ts` may export only this function and the named public result/token/diagnostic types.

## 17. Internal APIs

```ts
type InternalValidatedDomainEvent = {
  readonly eventType: DomainEventType;
  readonly eventVersion: 1;
  readonly payloadBranchId: string;
  readonly payloadSchemaIdentity: string;
  readonly event: AnyDomainEventEnvelope;
};

type ReadStructurallyValidatedDomainEventResult =
  | { readonly ok: true; readonly value: InternalValidatedDomainEvent }
  | { readonly ok: false; readonly diagnostic: DomainEventStructuralDiagnostic };

function validateCapturedDomainEventStructure(
  token: CapturedCanonicalRuntimeValue
): DomainEventStructuralValidationResult;

function readStructurallyValidatedDomainEvent(
  token: unknown
): ReadStructurallyValidatedDomainEventResult;

function admitC1Authority(
  result: StructuralSchemaAuthorityResultV1
): CAuthorityAdmissionResult;
```

These are package-private and not root exports. `validateCapturedDomainEventStructure` authenticates A through `readCanonicalRuntimeBackingForStructuralValidation` and never calls capture. `readStructurallyValidatedDomainEvent` authenticates the C WeakSet/WeakMap and never exposes mutable state. `admitC1Authority` is a pure package-private seam used both by module initialization and direct unhealthy-result tests; it cannot replace, inject, mutate, or reinitialize the module singleton.

## 18. Registry/authority health

At module initialization C executes `createFullC1StructuralSchemaAuthority()` exactly once inside a closed `try/catch`, then passes the returned result to `admitC1Authority`. A thrown exception or `UNHEALTHY` result becomes a frozen C state `{status:"UNHEALTHY"}` without retaining C1 `detail`, stack, or exception text. A `HEALTHY` result is admitted only if its exact censuses and dispatch-signature uniqueness satisfy section 9, after which C freezes its derived indexes.

Every public call checks the frozen C state before A capture. Unhealthy state returns `C1_AUTHORITY_UNHEALTHY/AUTHORITY_ADMISSION`, `payloadContentReads=0`, and no token. Calls reuse the same state; there is no retry, runtime rebuild, dynamic registration, repair, or caller injection. `AFTER_PROCESS_RESTART` is the only retryability for authority failure.

This is consumer admission, not a second C1 AST-health implementation. C trusts C1's node/reference/cycle/refinement/delta health verdict and adds only C-specific census and unique-dispatch viability checks.

## 19. Zero-read contract

The exact stack-local, data-free observation is:

```ts
type DomainEventStructuralValidationObservation = {
  authorityChecked: boolean;
  captureEntered: boolean;
  envelopeFieldReads: number;
  eventTypeReads: number;
  eventVersionReads: number;
  payloadNodeAcquired: boolean;
  payloadContentReads: number;
  astTraversalEntered: boolean;
  validatedBackingConstructed: boolean;
};
```

It is created inside the public call and passed privately through C functions; no caller supplies it. The test-only observer entry is module-local/test-only, not root-exported, and returns only counters/booleans plus the ordinary result.

The honest boundary is: A descriptor-safe capture may traverse the raw input, including raw payload, because capture owns hostile-object admission. `payloadContentReads` counts only C reads from authenticated A payload backing after capture. Therefore:

- authority unhealthy: `captureEntered=false`, all reads zero;
- A capture failure: no C envelope/payload reads;
- nonobject/missing/extra envelope and wrong event type: no C payload acquisition;
- unknown event or envelope `eventVersion` failure: no C payload acquisition;
- branch dispatch may acquire payload and read its key set plus declared AST-derived discriminators; these are dispatch reads and do not increment `payloadContentReads`;
- branch failure: no nondiscriminator payload-content reads and no AST traversal;
- only a unique selected branch sets `astTraversalEntered=true` and increments `payloadContentReads` as its AST fields are read.

The observer never records values, keys, paths, payload, diagnostics text, timestamps, or secrets; it cannot alter precedence. Impossible allocation/internal exceptions use static branch evidence, not injectable hooks.

## 20. Diagnostics

The exact code union is:

```ts
type DomainEventStructuralDiagnosticCode =
  | "C1_AUTHORITY_UNHEALTHY"
  | "CAPTURE_REJECTED"
  | "INVALID_CAPTURE_TOKEN"
  | "INVALID_ENVELOPE"
  | "MISSING_REQUIRED_FIELD"
  | "EXTRA_FIELD"
  | "INVALID_FIELD_TYPE"
  | "INVALID_FIELD_VALUE"
  | "UNKNOWN_EVENT_TYPE"
  | "UNSUPPORTED_EVENT_VERSION"
  | "INVALID_PAYLOAD_BRANCH"
  | "INVALID_AST_NODE"
  | "INVALID_REFINEMENT"
  | "INVALID_PAYLOAD_STRUCTURE"
  | "AMBIGUOUS_UNION"
  | "VALIDATED_BACKING_CONSTRUCTION_FAILED"
  | "INVALID_STRUCTURAL_TOKEN"
  | "INTERNAL_STRUCTURAL_VALIDATION_FAILURE";

type DomainEventStructuralDiagnosticPhase =
  | "AUTHORITY_ADMISSION"
  | "A_CAPTURE"
  | "A_BACKING_AUTHENTICATION"
  | "ENVELOPE_VALIDATION"
  | "EVENT_TYPE_DISPATCH"
  | "VERSION_BRANCH_DISPATCH"
  | "PAYLOAD_ACQUISITION"
  | "AST_TRAVERSAL"
  | "BACKING_CONSTRUCTION"
  | "TOKEN_ISSUANCE"
  | "TOKEN_CONSUMPTION";
```

Allowed code/phase pairs are frozen: authority code only at `AUTHORITY_ADMISSION`; capture at `A_CAPTURE`; capture token at `A_BACKING_AUTHENTICATION`; envelope/missing/extra/type/value at `ENVELOPE_VALIDATION`; unknown event at `EVENT_TYPE_DISPATCH`; unsupported version and invalid branch at `VERSION_BRANCH_DISPATCH`; payload kind/type at `PAYLOAD_ACQUISITION`; node/refinement/payload/union plus nested missing/extra/type/value at `AST_TRAVERSAL`; backing failure at `BACKING_CONSTRUCTION`; internal failure at the phase that caught it; structural token only at `TOKEN_CONSUMPTION`.

Diagnostics carry no attacker value, field name, event literal, C1 detail, stack, exception text, platform text, object description, or semantic verdict. Paths use only bounded ordinals/indexes. Quarantine is true for hostile capture translation, unauthenticated tokens, internal failures, and impossible authority/backing failures; ordinary correctable structural mismatches use `AFTER_INPUT_CORRECTION` and otherwise `NEVER`.

## 21. Validation precedence

The global first-failure order is exact:

1. C1 authority health and C admission;
2. A capture;
3. A token authentication/root object admission;
4. envelope exact key set in the 14-field order;
5. envelope field kind/value in the 14-field order;
6. event type lookup;
7. envelope event version, C1 version policy, and unique branch dispatch;
8. payload `OBJECT` acquisition;
9. selected AST traversal in C1 field/branch/element order;
10. detached backing construction;
11. token issuance.

For `EXACT_RECORD`, missing required fields are checked by `fieldOrdinal`, then extra keys by A canonical entry order, then child values by `fieldOrdinal`. Arrays/tuples use ascending index. Tagged unions use the tag then chosen branch. Closed unions evaluate all branch outcomes but report zero-match using the earliest branch's deterministic deepest failure only as an ordinal-safe structural diagnostic; multiple success is always `AMBIGUOUS_UNION`. No later failure can mask an earlier phase.

## 22. Structural/semantic boundary

| Check | C Structural | Existing Semantic Layer | Batch/Replay | Future P2F |
|---|:---:|:---:|:---:|:---:|
| exact envelope keys | yes | no | no | no |
| exact payload keys | yes | no | no | no |
| primitive kind | yes | no | no | no |
| literal/enum | yes | no | no | no |
| nested record/array/tuple/union | yes | no | no | no |
| context-free refinement | yes | no | no | no |
| structural ID string shape | yes | no | no | no |
| ID existence | no | yes | possible replay cross-check | no |
| player/role existence | no | yes | possible replay cross-check | no |
| current role/state | no | yes | yes on rebuild | no |
| producer legality | no | yes | yes | accepted-history authority later |
| `gameVersion` continuity | no | no | yes | authority binding later |
| `eventSequence` continuity | no | no | yes | authority binding later |
| batch completeness/atomicity | no | no | yes | trusted-history admission later |
| receipt | no | application | yes | authority binding later |
| task/opportunity state | no | yes | yes | no |
| impairment provenance | no | yes | yes | effective-condition work later |
| replay compatibility | no | no | yes | trusted-history work later |
| snapshot consistency | no | no | yes | cache/authority boundary later |
| event-state consistency | no | yes | yes | trusted-history work later |

A structurally valid but semantically invalid event must pass C as `STRUCTURALLY_VALIDATED_DOMAIN_EVENT / NOT_SEMANTICALLY_ACCEPTED`. Any check requiring GameState, history prefix, neighboring events, a producer fact, or provenance is forbidden in C.

## 23. Compatibility

Compatibility is exact-shape preservation, not silent migration. The public matrix covers authentic current producer shapes and the legacy B31 shape. B26/B54 are handled by ordinary AST nodes. Existing event-specific validators remain downstream semantic/compatibility authorities and are unchanged. Unknown future types, versions, branches, fields, or refinements fail closed. C creates no event, state, snapshot, receipt, hash, replay, or history authority.

## 24. Production allowlist

The maximum future production allowlist is exactly:

1. `packages/domain-core/src/canonical-domain-event.ts`
2. `packages/domain-core/src/domain-event-structural-validator.ts`
3. `packages/domain-core/src/index.ts` only for necessary named public exports

Generic traversal must remain inside the validator file. A fourth production file is a stop-loss. Forbidden modifications include A, B, C1 AST/Catalog, events, semantic validators, replay, rebuild, batch, snapshots, application, roles, Dreamer, impairment, workflow, ownership, coverage, and control files.

## 25. Test plan

The only C primary test file is `packages/domain-core/src/domain-event-structural-validator.test.ts`. It must contain real public or package-private C mechanisms for:

1. healthy production C1 authority admission;
2. pure `admitC1Authority` unhealthy seam and static proof that public singleton fails before capture;
3. 40/40 event dispatch;
4. 59/59 branch dispatch;
5. valid exact 14-field envelope;
6. each envelope field missing;
7. one extra envelope field;
8. each wrong envelope primitive/value class;
9. unknown event;
10. unknown/missing/unexpected payload version discriminator;
11. legacy C-B31;
12. all explicit-version roots;
13. all unversioned roots;
14. all 15 AST node kinds;
15. exact record, all array cardinalities, tuple, tagged union, closed union, nullable, enum/literal;
16. both refinements and all 16 aliases through authentic roots/supporting C1 candidate seams;
17. ambiguous closed union using a C-owned traversal unit seam over immutable test nodes, never public-authority injection;
18. B26 one item, multiple items, and empty rejection;
19. B54 three accepted source-contract members and wrong/missing/extra rejection;
20. C token success, forgery, spread, JSON, `structuredClone`, Proxy wrapper, worker/process nontransfer policy;
21. zero-read counters for every frozen phase boundary;
22. throwing/revoked Proxy public integration through A capture, with getter calls zero;
23. deterministic diagnostics and precedence;
24. structurally valid/semantically invalid success;
25. static dependency/export traps proving no B call, no Catalog V2 read, no legacy validator, no history authority.

A and C1 tests/traceability are supporting authority only. Hosted CI, coverage, ownership, Windows/Linux publication, PR, and merge evidence are deferred to D.

## 26. Traceability V1.1

This is the complete design-time inventory: 18 historical parents, two retained children, and one new atomic criterion, total 21. No `ActualTest`, `ActualBinding`, support ID, `MechanismMatch`, or PASS is asserted. R1 and R2 criterion sets are empty. Every row has one primary layer.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C-C01 | Unknown input enters A exactly once | public C captures once; captured entry only authenticates A | public unknown-entry matrix plus dependency trap | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact success or `CAPTURE_REJECTED`, no raw read by C | frozen A seam/tests |
| C-C02 | Envelope is exactly 14 fields | all required/missing/extra/type/value cases follow section 8 | public envelope matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | one closed deterministic result | accepted `DomainEventEnvelope` type as support |
| C-C03 | Public C consumes one complete admitted 40/59 authority | public matrix runs only after healthy admission and selects one root | public 40/59 matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact root or no token | C-C03a/C-C03b support |
| C-C03a | Exact-head C1 authority is recursively healthy and complete | pure admission observes HEALTHY and 40/59/13/46 | package-private admission seam over real C1 result | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | frozen healthy consumer state | C1 exact-head health/census tests |
| C-C03b | Unhealthy C1 authority fails C closed | pure admission rejects unhealthy result; module proof shows no public capture/token | package-private unhealthy-result seam plus static initialization proof | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | `C1_AUTHORITY_UNHEALTHY`, no token | C1 result union contract |
| C-C04 | Every known type has one event identity | all 40 event ordinals map consistently | public event inventory matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact event type/ordinal | C1 root census support |
| C-C05 | Unknown event does not acquire C payload | observer proves zero payload node/content and no AST entry | public unknown-event observability case | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | `UNKNOWN_EVENT_TYPE` with frozen counters | A capture boundary support |
| C-C06 | Version and branch dispatch is exact | 13 explicit and 46 unversioned roots select uniquely without fallback | public 59-root dispatch matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact branch or closed dispatch diagnostic | C1 roots/version policies |
| C-C07 | Missing fields fail deterministically | envelope and selected-AST required fields report first frozen omission | public single-omission matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | `MISSING_REQUIRED_FIELD` | C1 field ordinals support |
| C-C08 | Extra fields fail deterministically | every exact record rejects one safe extra key | public extra-key matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | `EXTRA_FIELD` | A canonical entry ordering support |
| C-C09 | Primitive coercion never occurs | kind/literal/enum/integer/refinement mutations reject without conversion | public primitive mutation matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact closed field diagnostic | A primitive backing contract |
| C-C10 | All nested AST structures are exact | all 15 node kinds recurse by frozen C1 order and union cardinality | public nested matrix plus generic traversal unit seam | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact output or closed nested diagnostic | C1 node algebra/tests |
| C-C11 | Legacy B31 remains structurally representable | authentic B31 passes and shape/version mutation fails | public legacy vector | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | structural result only | accepted legacy event type |
| C-C12 | Current version-aware shapes remain structurally representable | authentic explicit families/roots pass with exact discriminators | public authentic producer vectors | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | structural result only | current producer tests as supporting authority |
| C-C13 | Successful path issues an authenticated C token | issued token reads; forged/copy/clone/wrapper attempts fail | public success plus private token-reader matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | only issued identity accesses backing | A token pattern support |
| C-C14 | C token is process-local and noncopyable | identity is lost by JSON/clone/proxy/transfer | private issuer/reader and export policy audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | issued object only | none |
| C-C15 | Diagnostics are closed and deterministic | all code/phase/path/precedence cases repeat exactly without data leakage | table-driven diagnostic matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact closed safe diagnostic | A diagnostic translation support |
| C-C16 | Structural success is not semantic acceptance | every success carries both frozen status literals and no acceptance claim | result/export policy audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | `NOT_SEMANTICALLY_ACCEPTED` | semantic owner map |
| C-C17 | Future unknowns fail closed | future type/version/branch/refinement cannot fall back | public hostile future-literal matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | closed unknown/unsupported diagnostic | closed C1 unions |
| C-C18 | C creates no history/state/hash authority | dependency/export/token audit finds no prohibited issuer or semantic call | static dependency/API audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | no prohibited authority | rescope/review protocol |
| C-C19 | C runtime consumes C1 AST directly and no substitute | all 59 roots traverse returned frozen roots/node bindings/refinements; Catalogs/maps/fallback/digest/B are absent | public 59-root matrix plus forbidden-dependency and authority-consumption traps | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact C1 language parity and no token on mismatch/unhealthy authority | C1 exact-head AST/census/delta tests only as support |

`C-C19` has the single primary mechanism `public 59-root structural matrix plus forbidden-dependency traps`, classified `R3/T1/STRUCTURAL_VALIDATION`. C-C03 remains the inventory/admission behavior; C-C19 uniquely proves runtime AST consumption and absence of substitutes, so there is no duplicate primary identity.

## 27. Local technical closure

A future separately authorized C implementation is locally technically closed only after: reviewed recovery design, implementation from the clean baseline, focused C tests, domain-core regression, typecheck, lint, full ordinary local tests, complete actual traceability bindings, a frozen local C HEAD, and fresh independent `CODE_REVIEW_PASS` plus `RULE_REVIEW_PASS` with no blockers. This design itself authorizes none of those implementation actions.

## 28. Deferred D evidence

Ownership, published test totals, coverage profile, cross-platform Windows/Linux evidence, exact-head hosted CI, PR, merge, accepted tag, C1 final acceptance, and Catalog V2 SHA claim reconciliation remain P2F1R-D publication work. They cannot serve as the primary evidence for any C behavior criterion and do not block local C design or implementation review.

## 29. Stop-Loss

Stop and return `HUMAN_BLOCKED` if implementation would require: modifying or newly exporting C1; modifying A/B/events/semantic validators; reading Catalog V2 or artifact digest at runtime; recovering old C code; hand-writing 59 schemas; any legacy/type fallback; C-specific B26/B54 behavior; a fourth production file; replay/GameState/history work; D to prove local behavior; a token implying semantic acceptance; multiple primary layers; inability to distinguish structural from semantic checks; or any change to the protected failed worktree.

## 30. Independent review protocol

A fresh read-only reviewer who is not an earlier C/C1 author or reviewer must read the exact design bytes, precheck, frozen A/C1 code, 40/59 roots, Traceability V1.1, review protocol, and preserved-worktree hashes. The reviewer must check all 22 review points in the authorization, including the honest A-versus-C zero-read boundary, exact imports, no Catalog/digest authority, 15-node traversal, B26/B54 generic handling, three-file allowlist, complete 21-row traceability, and D-only publication deferral.

The only legal verdicts are `RULE_DESIGN_PASS`, `RULE_DESIGN_FIX_REQUIRED`, and `HUMAN_BLOCKED`. Only a complete `RULE_DESIGN_PASS` with `remainingDesignBlockers=[]` permits the user to issue a future C implementation authorization. The controller must not synthesize a pass.

READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW
