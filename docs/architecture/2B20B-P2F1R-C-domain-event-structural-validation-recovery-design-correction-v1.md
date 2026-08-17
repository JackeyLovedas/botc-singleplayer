# Phase 3 Slice 2B20B-P2F1R-C Recovery Design Correction V1

## 1. Authority, status, and correction boundary

- `authorization`: `USER_AUTHORIZED_2B20B_P2F1R_C_RECOVERY_DESIGN_CORRECTION_CONDITIONAL_IMPLEMENTATION_AND_LOCAL_CLOSURE`
- `frozenHead`: `7fc337325f274c669a356a30c7485e2fdf134643`
- `recordedBranch`: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`
- `recoveryPrecheck`: `docs/architecture/2B20B-P2F1R-C-recovery-governance-precheck-after-c1.md`
- `recoveryPrecheckSha256`: `85c631ac76fe86f8c4b2334fcf8599c3172d24676b985ced2ff301c0a9b59410`
- `parentRecoveryDesign`: `docs/architecture/2B20B-P2F1R-C-domain-event-structural-validation-recovery-design-v1.md`
- `parentRecoveryDesignSha256`: `265f52b764c8802b8c2f9958df05f701d3bbf2b3bf6269714ca2f5fde1bdf455`
- `correctionScope`: `C-RD-B01`, `C-RD-B02`, `C-RD-B03`, and `C-RD-B04` only
- `implementationAuthorized`: `false` pending a fresh independent `RULE_DESIGN_PASS`
- `ruleSemanticsChanged`: `false`
- `runtimeInputSetChanged`: `false`
- `behaviorChanged`: `false`

This correction is the effective implementation contract for the four corrected areas. All parent-design clauses not explicitly replaced below remain in force. It does not authorize implementation, a branch, a commit, publication, D, P2F, or reuse of the failed C worktree.

The following conclusions are immutable:

- the C1 typed structural schema AST is the only payload runtime structural authority;
- Catalog V2 and every artifact digest are audit artifacts, never runtime authority;
- C1, A, B, event definitions, semantic validators, replay, batch, state, and application code do not change;
- the envelope remains an exact 14-field record;
- the authority contains 40 event types and 59 payload roots;
- C owns one generic 15-node AST consumer;
- the C token proves only `STRUCTURALLY_VALIDATED_DOMAIN_EVENT` and every success remains `NOT_SEMANTICALLY_ACCEPTED`;
- B26 is the C1 `NON_EMPTY_ARRAY` with minimum one and no fixed maximum;
- B54 accepts only the three C1-normalized runtime survivors;
- the maximum production allowlist remains three files; and
- D owns publication evidence only.

The original dirty C worktree remains historical and unaccepted. Its precheck-recorded 11-file inventory must remain byte-identical. No file from it may be copied, staged, restored, adapted, or used as an implementation baseline.

## 2. B01 closure: exact read vocabulary

The following terms are disjoint and normative:

| Observation | Exact meaning |
|---|---|
| `payloadKeyPresenceChecked` | C has checked only whether envelope key ordinal 14 exists while validating the envelope key set. It has not acquired or inspected the payload value. |
| `payloadNodeAcquired` | C has obtained the authenticated A canonical backing reference stored at envelope ordinal 14. It has not enumerated or read a child merely by acquiring the node. |
| `payloadDiscriminatorReads` | Count of distinct frozen payload-local discriminator paths observed by C. Presence and, when present, primitive value acquisition at the same path count once. It never includes a nondiscriminator field. |
| `payloadContentReads` | Count of authenticated A payload child values read outside the frozen decision tree. It begins only after one root is selected and full AST traversal starts. |
| `astTraversalEntered` | The selected root's generic AST traversal has begun. It is false during authority, capture, envelope, event, version, and branch decision gates. |
| `validatedBackingConstructed` | Complete traversal succeeded and construction of the detached C-owned backing completed. |
| `tokenIssued` | The exact process-local C token was registered in the private issuer tables and returned. |

A may traverse the raw payload while performing descriptor-safe capture. That is A behavior and is not a C payload read. The zero-read claim is precisely about C reads from authenticated A backing after capture. It does not claim that A capture leaves raw payload untouched.

Key presence is tested through A canonical object entries and never through the caller object. A discriminator value is read only after A has proved the backing is a canonical object and only at a path named in section 4. No getter, proxy trap, iterator, coercion, dynamic property access, or user callback is used.

## 3. Frozen 35/24 branch partition

The partition is derived from the exact 59 C1 roots at the frozen HEAD. It is not a second production registry. Production derives the same partition from the healthy C1 roots and verifies these censuses during C authority admission.

### 3.1 `ENVELOPE_RESOLVABLE_BRANCH` — 35 roots

Each event type below has one C1 root. `eventType` plus envelope `eventVersion=1` selects it without acquiring payload.

| Ordinal | BranchId | EventType |
|---:|---|---|
| 1 | `C-B01-GAME-CREATED-U` | `GameCreated` |
| 2 | `C-B02-SCRIPT-SELECTED-U` | `ScriptSelected` |
| 3 | `C-B03-SEAMSTRESS-CAPABILITY-U` | `SeamstressResolutionCapabilityDeclared` |
| 4 | `C-B04-SETUP-GENERATED-U` | `SetupGenerated` |
| 5 | `C-B05-ROSTER-CREATED-U` | `PlayerRosterCreated` |
| 6 | `C-B06-CHARACTERS-ASSIGNED-U` | `CharactersAssigned` |
| 7 | `C-B07-PHASE-TRANSITIONED-U` | `PhaseTransitioned` |
| 8 | `C-B08-FIRST-NIGHT-INITIALIZED-U` | `FirstNightInitialized` |
| 9 | `C-B09-INITIAL-KNOWLEDGE-U` | `InitialPrivateKnowledgeEstablished` |
| 10 | `C-B10-TASK-PLAN-U` | `FirstNightTaskPlanCreated` |
| 21 | `C-B21-PHILOSOPHER-DEFER-U` | `PhilosopherActionDeferred` |
| 24 | `C-B24-SEAMSTRESS-ACTION-V2` | `SeamstressTargetsChosen` |
| 25 | `C-B25-SEAMSTRESS-SPENT-U` | `SeamstressAbilitySpent` |
| 26 | `C-B26-SEAMSTRESS-DELIVERY-U` | `SeamstressInformationDelivered` |
| 27 | `C-B27-PHILOSOPHER-CHOSEN-U` | `PhilosopherAbilityChosen` |
| 28 | `C-B28-PHILOSOPHER-GRANTED-U` | `PhilosopherAbilityGranted` |
| 31 | `C-B31-TASK-INSERTED-LEGACY-U` | `FirstNightTaskInserted` |
| 32 | `C-B32-TASK-INSERTED-V2-U` | `FirstNightTaskInsertedV2` |
| 33 | `C-B33-SNAKE-CHARMER-TARGET-U` | `SnakeCharmerTargetChosen` |
| 34 | `C-B34-SNAKE-CHARMER-SWAP-U` | `SnakeCharmerDemonSwapApplied` |
| 35 | `C-B35-SNAKE-CHARMER-NO-SWAP-U` | `SnakeCharmerNoSwapResolved` |
| 36 | `C-B36-SNAKE-CHARMER-INEFFECTIVE-U` | `SnakeCharmerIneffectiveResolved` |
| 37 | `C-B37-WITCH-TARGET-U` | `WitchTargetChosen` |
| 38 | `C-B38-WITCH-DEATH-PENDING-U` | `WitchDeathPendingMarked` |
| 39 | `C-B39-WITCH-INEFFECTIVE-U` | `WitchIneffectiveResolved` |
| 40 | `C-B40-CERENOVUS-CHOICE-U` | `CerenovusChoiceRecorded` |
| 41 | `C-B41-CERENOVUS-MARKER-U` | `CerenovusMadnessMarked` |
| 42 | `C-B42-CERENOVUS-DELIVERY-U` | `CerenovusMadnessInstructionDelivered` |
| 53 | `C-B53-CLOCKMAKER-DELIVERY-U` | `ClockmakerInformationDelivered` |
| 54 | `C-B54-MATHEMATICIAN-DELIVERY-U` | `MathematicianInformationDelivered` |
| 55 | `C-B55-EVIL-TWIN-PAIR-U` | `EvilTwinPairEstablished` |
| 56 | `C-B56-EVIL-TWIN-DELIVERY-U` | `EvilTwinInformationDelivered` |
| 57 | `C-B57-MINION-DELIVERY-U` | `MinionInformationDelivered` |
| 58 | `C-B58-DEMON-DELIVERY-U` | `DemonInformationDelivered` |
| 59 | `C-B59-TASK-SETTLED-U` | `ScheduledTaskSettled` |

### 3.2 `PAYLOAD_DISCRIMINATED_BRANCH` — 24 roots

| EventType | Exact roots |
|---|---|
| `FirstNightActionOpportunityCreated` | C-B11 through C-B20 |
| `SeamstressActionDeferred` | C-B22 and C-B23 |
| `AbilityImpairmentApplied` | C-B29 and C-B30 |
| `DreamerTargetChosen` | C-B43 through C-B45 |
| `DreamerInformationDelivered` | C-B46 through C-B52 |

The exact 24 branch IDs are `C-B11-PHILOSOPHER-OPPORTUNITY-U`, `C-B12-SNAKE-CHARMER-OPPORTUNITY-U`, `C-B13-WITCH-OPPORTUNITY-U`, `C-B14-CERENOVUS-OPPORTUNITY-U`, `C-B15-DREAMER-OPPORTUNITY-V1-U`, `C-B16-DREAMER-OPPORTUNITY-V2`, `C-B17-DREAMER-OPPORTUNITY-V3`, `C-B18-DREAMER-OPPORTUNITY-V4`, `C-B19-SEAMSTRESS-OPPORTUNITY-V1-U`, `C-B20-SEAMSTRESS-OPPORTUNITY-V2-U`, `C-B22-SEAMSTRESS-DEFER-V1-U`, `C-B23-SEAMSTRESS-DEFER-V2`, `C-B29-IMPAIRMENT-PHILOSOPHER-U`, `C-B30-IMPAIRMENT-SNAKE-CHARMER-U`, `C-B43-DREAMER-TARGET-V1-U`, `C-B44-DREAMER-TARGET-V2`, `C-B45-DREAMER-TARGET-V3`, `C-B46-DREAMER-DELIVERY-V1-U`, and C-B47 through C-B52.

Admission fails closed if the derived partition is not exactly `35/24`, if an event has zero roots, or if a decision tree below is not total and unique over its frozen roots.

## 4. Derived deterministic decision trees

The decision trees are derived once from C1 root `versionPolicy`, root exact-record fields, and literal nodes. They retain references to C1 roots; they do not copy payload schemas. The ordered discriminator contract is:

| EventType | Ordered decision operations | Exact result |
|---|---|---|
| `FirstNightActionOpportunityCreated` | Probe `opportunitySchemaVersion`. If present, acquire its primitive value and match only V2/V3/V4. If absent, require and acquire `opportunityKind`; map the five non-Seamstress literals directly. For `SEAMSTRESS_FIRST_NIGHT_ACTION`, probe `abilityInstanceId`: absent selects B19, present selects B20. | B11-B20, exactly one |
| `SeamstressActionDeferred` | Probe `deferSchemaVersion`; absent selects B22, present requires the exact V2 literal and selects B23. | B22 or B23 |
| `AbilityImpairmentApplied` | Require and acquire `kind`; `DRUNK` selects B29 and `POISONED` selects B30. | B29 or B30 |
| `DreamerTargetChosen` | Probe `targetSchemaVersion`; absent selects B43, present requires the exact V2 or V3 literal. | B43-B45 |
| `DreamerInformationDelivered` | Probe `deliverySchemaVersion`; absent selects B46, present requires one exact V2 through V7 literal. | B46-B52 |

For an explicit discriminator, a missing key is permitted only when the decision tree explicitly defines the unversioned branch as the absence case. A present key with a nonprimitive value or an unsupported literal is `INVALID_PAYLOAD_DISCRIMINANT`. `UNSUPPORTED_EVENT_VERSION` is reserved for the envelope `eventVersion` gate. A required nonversion discriminator that is absent or has an unsupported value is also `INVALID_PAYLOAD_DISCRIMINANT`. Zero and multiple selected roots are `INVALID_PAYLOAD_BRANCH` and fail closed.

The tree is not handwritten as production branch data. Admission derives it generically: group roots by `eventType`; require every multi-root top node to be `EXACT_RECORD`; process distinct sibling `EXPLICIT_LITERAL.fieldName` values in raw UTF-16 order; then repeatedly choose the first raw-UTF-16 top-level field that is a `LITERAL` in every remaining candidate and partitions them; if still multiple, choose the first raw-UTF-16 top-level key whose presence partitions them. A nonprogressing, overlapping, zero-root, or nonunique derivation makes C authority unhealthy. The resulting frozen descriptors reference the original C1 roots and nodes.

The exact observer path counts on successful dispatch are:

- singleton event: `payloadDiscriminatorReads=0`;
- opportunity explicit V2/V3/V4: `1` (`opportunitySchemaVersion`);
- opportunity unversioned non-Seamstress: `2` (`opportunitySchemaVersion`, `opportunityKind`);
- opportunity Seamstress V1/V2: `3` (the preceding two plus `abilityInstanceId` presence);
- Seamstress deferred explicit or unversioned: `1` (`deferSchemaVersion`);
- impairment: `1` (`kind`);
- Dreamer target explicit or unversioned: `1` (`targetSchemaVersion`);
- Dreamer delivery explicit or unversioned: `1` (`deliverySchemaVersion`).

A missing required discriminator stops at that logical path observation. A wrong-kind or unknown-literal discriminator stops after the same one path observation. Every such failure has `payloadContentReads=0`, `astTraversalEntered=false`, `validatedBackingConstructed=false`, and `tokenIssued=false`.

No nondiscriminator value may be used to choose a branch. There is no first-match, trial traversal, best-match, latest-version, legacy, key-count, Catalog, artifact-digest, or semantic-validator fallback. A discriminator value captured during dispatch is reused when the selected AST later visits the same path; it is not reread.

## 5. Exact 16-step validation order

The only valid order is:

1. check the frozen C1 consumer-authority state;
2. enter A capture exactly once;
3. authenticate A's result and require the envelope backing kind `OBJECT`;
4. check the envelope exact key set and set `payloadKeyPresenceChecked=true` without acquiring payload;
5. check all 14 required key presences in ordinal order;
6. validate the 13 nonpayload envelope fields in ordinal order;
7. read envelope `eventType` and perform known-type lookup;
8. read envelope `eventVersion` and require the supported literal `1`;
9. obtain the C1 candidate roots for the known event type;
10. if the candidate set has one root, select it without payload acquisition;
11. if the candidate set has multiple roots, acquire the payload node and require backing kind `OBJECT`;
12. execute only the frozen decision tree in section 4 and require exactly one root;
13. acquire the payload node if step 11 did not, and require backing kind `OBJECT`;
14. set `astTraversalEntered=true` and execute the selected root's complete generic AST traversal;
15. construct and recursively freeze the detached validated backing;
16. register and return the opaque C token.

An earlier failure always wins. Payload kind is deliberately checked at step 11 for payload-discriminated events because the decision tree requires an authenticated object, and at step 13 for envelope-resolvable events. It is never checked at the envelope key-presence stage. This is the only ordering variation and is fully determined by the 35/24 partition.

The following failures have `payloadNodeAcquired=false`, `payloadDiscriminatorReads=0`, `payloadContentReads=0`, and `astTraversalEntered=false`: unhealthy authority, A capture rejection, nonobject envelope, envelope missing/extra key, any invalid nonpayload envelope field, invalid/unknown event type, and unsupported envelope `eventVersion`.

Discriminator failures may have `payloadNodeAcquired=true` and the bounded counts in section 4, but must have `payloadContentReads=0` and `astTraversalEntered=false`. Only a unique root permits AST traversal. A payload structural failure after that point reports the exact bounded AST path.

## 6. Observer contract

The exact stack-local observation is:

```ts
type DomainEventStructuralValidationObservation = {
  authorityChecked: boolean;
  captureEntered: boolean;
  envelopeKeySetChecked: boolean;
  envelopeFieldReads: number;
  eventTypeReads: number;
  eventVersionReads: number;
  payloadKeyPresenceChecked: boolean;
  payloadNodeAcquired: boolean;
  payloadDiscriminatorReads: number;
  payloadContentReads: number;
  astTraversalEntered: boolean;
  validatedBackingConstructed: boolean;
  tokenIssued: boolean;
};
```

`envelopeFieldReads` counts authenticated nonpayload envelope value acquisitions; `eventTypeReads` and `eventVersionReads` are also incremented as explicit subset counters. `payloadContentReads` increments for each nondiscriminator payload child value acquired by AST traversal. Presence checks do not increment content reads.

The observer is allocated per call, passed only through private stack frames, cannot be supplied by a caller, is not root-exported, and contains no input value, key text, event literal, AST node identity, path, payload, diagnostic, timestamp, or environment fact. The test seam returns a frozen copy of counters with the ordinary result. Observer operations are individually contained so an observer bookkeeping defect cannot throw out of, replace, or alter a business result. No global mutable hook, callback, registry, clock, randomness, or environment lookup is permitted. Internal failures that cannot be safely induced use static branch binding rather than production observer expansion.

## 7. B02 closure: envelope authority audit

The runtime-language decision follows this precedence: an accepted runtime validator requirement may narrow a TypeScript primitive; an actual producer restriction is supporting evidence but does not by itself reject an otherwise accepted stored event; semantic/history checks remain downstream and do not enter C. No observed authority requires trim stability for envelope IDs. The six branded ID producers reject only strings whose intrinsic trim is empty; they preserve leading and trailing whitespace on nonblank values.

| # | Field | TS Type | Producer Shape | Existing Runtime Validator | Accepted Tests | Downstream Semantic Authority | C Structural Contract | Missing | `null` | `""` | whitespace-only |
|---:|---|---|---|---|---|---|---|:---:|:---:|:---:|:---:|
| 1 | `category` | literal `domain` | literal `domain` | no separate shape validator; typed domain path | all accepted domain fixtures use `domain` | category routing remains downstream | primitive string equal to `domain` | reject | reject | reject | reject |
| 2 | `eventId` | branded string | `nextEventId()`; constructor rejects trim-empty | stream validator checks uniqueness, not string shape | accepted fixtures use constructed IDs | uniqueness/provenance | primitive string with `intrinsicTrim(value).length>0`; preserve original | reject | reject | reject | reject |
| 3 | `gameId` | branded string | copied from command; constructor rejects trim-empty | event applier checks state equality, not string shape | accepted fixtures use constructed IDs | stream/state agreement | same nonblank branded-string shape; no existence/equality check | reject | reject | reject | reject |
| 4 | `eventSequence` | number | computed integer | stream/applier check continuity | accepted fixtures use safe integers | ordering/history continuity | finite safe integer; no positivity/continuity rule | reject | reject | n/a | n/a |
| 5 | `batchId` | branded string | `nextBatchId()`; constructor rejects trim-empty | batch validators compare identity, not string shape | accepted fixtures use constructed IDs | batch grouping/atomicity | nonblank branded-string shape; preserve original | reject | reject | reject | reject |
| 6 | `gameVersion` | number | computed integer | batch/application validators compare revisions | accepted fixtures use safe integers | canonical revision continuity | finite safe integer; no positivity/continuity rule | reject | reject | n/a | n/a |
| 7 | `eventType` | closed 40-literal union | selected by application branch | event applier uses an exhaustive closed dispatch | accepted matrix contains the 40 literals | state/event legality | primitive string then exact known-literal lookup | reject | reject | reject | reject |
| 8 | `eventVersion` | literal `1` | `SUPPORTED_DOMAIN_EVENT_VERSION` | event applier and stream validator require `1` | accepted fixtures use `1` | accepted-history version policy | finite safe integer equal to `1` | reject | reject | n/a | n/a |
| 9 | `rulesBaselineVersion` | string | fixed `RULES_BASELINE_VERSION` | event applier requires only string payload baseline then equality | accepted fixtures use current literal; no empty rejection test | payload/state baseline agreement | primitive string only; no nonempty, trim, or equality rule | reject | reject | allow | allow |
| 10 | `commandId` | branded string | copied from command; constructor rejects trim-empty | no domain-envelope shape check | accepted fixtures use constructed IDs | command/idempotency linkage | nonblank branded-string shape; preserve original | reject | reject | reject | reject |
| 11 | `createdAt` | string | `clock.now()` | no ISO, nonempty, or normalization validator | accepted fixtures use timestamps; no empty rejection test | chronology and batch metadata equality | primitive string only | reject | reject | allow | allow |
| 12 | `correlationId` | branded string | copied from command; constructor rejects trim-empty | selected batch validators compare identity only | accepted fixtures use constructed IDs | audit correlation | nonblank branded-string shape; preserve original | reject | reject | reject | reject |
| 13 | `causationId` | branded string | derived through branded ID constructor | selected batch validators compare identity only | accepted fixtures use constructed IDs | causal linkage | nonblank branded-string shape; preserve original | reject | reject | reject | reject |
| 14 | `payload` | event-type payload union | event-specific payload producer | event applier requires a plain record with string baseline before event-specific handling | accepted producer/replay vectors bind 59 roots | existing validators own event meaning; C1 owns structure | key must exist; after dispatch backing must be `OBJECT` and match selected C1 root | reject | reject | n/a | n/a |

For envelope branded IDs, `intrinsicTrim(value).length>0` is a predicate only: C never writes the trimmed value and does not require `value===intrinsicTrim(value)`. Thus `" id "` remains structurally accepted while `""` and whitespace-only strings fail. `rulesBaselineVersion` and `createdAt` intentionally allow empty and whitespace-only strings because no accepted runtime structural authority rejects them; downstream equality or chronology rules remain unchanged.

The field table is total: all 14 fields are required, none accepts `null`, no global nonempty rule exists, no UUID/prefix/ISO grammar is added, and no semantic condition is promoted into C.

## 8. B03 closure: closed diagnostic types and safe path

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
  | "INVALID_PAYLOAD_DISCRIMINANT"
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
  | "CAPTURE"
  | "BACKING_AUTHENTICATION"
  | "ENVELOPE"
  | "EVENT_DISPATCH"
  | "VERSION_DISPATCH"
  | "PAYLOAD_DISCRIMINANT"
  | "PAYLOAD_ACQUISITION"
  | "AST_TRAVERSAL"
  | "BACKING_CONSTRUCTION"
  | "TOKEN_ISSUE"
  | "TOKEN_CONSUMPTION"
  | "INTERNAL";

type DomainEventStructuralSafeSummary =
  | "AUTHORITY_UNAVAILABLE"
  | "INPUT_CAPTURE_FAILED"
  | "CAPTURE_TOKEN_REJECTED"
  | "ENVELOPE_REJECTED"
  | "EVENT_TYPE_REJECTED"
  | "EVENT_VERSION_REJECTED"
  | "PAYLOAD_DISCRIMINANT_REJECTED"
  | "PAYLOAD_BRANCH_REJECTED"
  | "AMBIGUOUS_BRANCH"
  | "PAYLOAD_REJECTED"
  | "BACKING_CONSTRUCTION_FAILED"
  | "STRUCTURAL_TOKEN_REJECTED"
  | "INTERNAL_FAILURE";

type DomainEventStructuralRetryability =
  | "NEVER"
  | "AFTER_INPUT_CORRECTION"
  | "AFTER_PROCESS_RESTART";
```

The path is at most 32 segments. It contains only ordinals and indexes:

```ts
type DomainEventStructuralPathSegment =
  | { readonly kind: "CAPTURE_ARRAY_INDEX"; readonly index: number }
  | { readonly kind: "CAPTURE_OBJECT_KEY_ORDINAL"; readonly ordinal: number }
  | { readonly kind: "ENVELOPE_FIELD_ORDINAL"; readonly ordinal: number }
  | { readonly kind: "ENVELOPE_EXTRA_ENTRY_ORDINAL"; readonly ordinal: number }
  | { readonly kind: "PAYLOAD_DISCRIMINANT_ORDINAL"; readonly ordinal: number }
  | { readonly kind: "PAYLOAD_FIELD_ORDINAL"; readonly ordinal: number }
  | { readonly kind: "PAYLOAD_EXTRA_ENTRY_ORDINAL"; readonly ordinal: number }
  | { readonly kind: "ARRAY_INDEX"; readonly index: number }
  | { readonly kind: "TUPLE_INDEX"; readonly index: number }
  | { readonly kind: "UNION_BRANCH_ORDINAL"; readonly ordinal: number }
  | { readonly kind: "TRUNCATED" };
```

When a 33rd segment would be appended, C retains the first 31 segments, appends one terminal `TRUNCATED` segment as segment 32, and ignores the displaced and all later segments. It never includes raw field names, raw event types, raw values, `Error.message`, stack text, platform paths, C1 detail, or object descriptions. C uses a known event identity internally only after known-type validation and never copies it into a diagnostic.

## 9. Total 34-context diagnostic policy

`quarantineRecommended=true` is reserved for authority/internal integrity failures, hostile A capture categories, ambiguous authority outcomes, and unauthenticated tokens. Ordinary correctable kind/resource/nonplain capture and structural caller mistakes are `false`. An upstream persisted-history layer may impose stricter quarantine; C does not claim the input's storage provenance.

| Id | Callable failure context | Code | Phase | Bounded path | safeSummary | Quarantine | Retryable |
|---|---|---|---|---|---|:---:|---|
| F01 | C1 reports unhealthy, construction throws, or C census/index admission fails | `C1_AUTHORITY_UNHEALTHY` | `AUTHORITY_ADMISSION` | `[]` | `AUTHORITY_UNAVAILABLE` | true | `AFTER_PROCESS_RESTART` |
| F02 | correctable A capture rejection: ordinary kind, number, Unicode, nonplain, or resource failure | `CAPTURE_REJECTED` | `CAPTURE` | safely translated A path | `INPUT_CAPTURE_FAILED` | false | `AFTER_INPUT_CORRECTION` |
| F03 | hostile A capture: accessor, symbol, cycle, proxy, or descriptor failure | `CAPTURE_REJECTED` | `CAPTURE` | safely translated A path | `INPUT_CAPTURE_FAILED` | true | `AFTER_INPUT_CORRECTION` |
| F04 | A internal capture failure | `CAPTURE_REJECTED` | `CAPTURE` | `[]` | `INTERNAL_FAILURE` | true | `AFTER_PROCESS_RESTART` |
| F05 | package-private C entry receives invalid A capture token | `INVALID_CAPTURE_TOKEN` | `BACKING_AUTHENTICATION` | `[]` | `CAPTURE_TOKEN_REJECTED` | true | `NEVER` |
| F06 | authenticated A token has no backing | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE` | `BACKING_AUTHENTICATION` | `[]` | `INTERNAL_FAILURE` | true | `AFTER_PROCESS_RESTART` |
| F07 | envelope backing is not `OBJECT` | `INVALID_ENVELOPE` | `ENVELOPE` | `[]` | `ENVELOPE_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F08 | required envelope field missing | `MISSING_REQUIRED_FIELD` | `ENVELOPE` | envelope field ordinal | `ENVELOPE_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F09 | extra envelope field | `EXTRA_FIELD` | `ENVELOPE` | extra-entry ordinal | `ENVELOPE_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F10 | envelope field has wrong backing kind | `INVALID_FIELD_TYPE` | `ENVELOPE` | envelope field ordinal | `ENVELOPE_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F11 | envelope literal/value is invalid | `INVALID_FIELD_VALUE` | `ENVELOPE` | envelope field ordinal | `ENVELOPE_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F12 | structurally string event type is unknown | `UNKNOWN_EVENT_TYPE` | `EVENT_DISPATCH` | envelope ordinal 7 | `EVENT_TYPE_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F13 | envelope event version is not supported literal `1` | `UNSUPPORTED_EVENT_VERSION` | `VERSION_DISPATCH` | envelope ordinal 8 | `EVENT_VERSION_REJECTED` | false | `NEVER` |
| F14 | acquired payload backing is not `OBJECT` | `INVALID_FIELD_TYPE` | `PAYLOAD_ACQUISITION` | envelope ordinal 14 | `PAYLOAD_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F15 | required payload discriminator is absent | `INVALID_PAYLOAD_DISCRIMINANT` | `PAYLOAD_DISCRIMINANT` | payload plus discriminator ordinal | `PAYLOAD_DISCRIMINANT_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F16 | payload discriminator has wrong primitive kind | `INVALID_PAYLOAD_DISCRIMINANT` | `PAYLOAD_DISCRIMINANT` | payload plus discriminator ordinal | `PAYLOAD_DISCRIMINANT_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F17 | payload discriminator literal is unknown | `INVALID_PAYLOAD_DISCRIMINANT` | `PAYLOAD_DISCRIMINANT` | payload plus discriminator ordinal | `PAYLOAD_DISCRIMINANT_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F18 | runtime decision selects zero roots | `INVALID_PAYLOAD_BRANCH` | `PAYLOAD_DISCRIMINANT` | envelope ordinal 14 | `PAYLOAD_BRANCH_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F19 | runtime decision selects multiple roots | `INVALID_PAYLOAD_BRANCH` | `PAYLOAD_DISCRIMINANT` | envelope ordinal 14 | `AMBIGUOUS_BRANCH` | true | `NEVER` |
| F20 | admitted AST node/reference invariant is unavailable or unsupported | `INVALID_AST_NODE` | `INTERNAL` | current bounded path | `INTERNAL_FAILURE` | true | `AFTER_PROCESS_RESTART` |
| F21 | selected AST exact record misses a required field | `MISSING_REQUIRED_FIELD` | `AST_TRAVERSAL` | current plus field ordinal | `PAYLOAD_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F22 | selected AST exact record contains an extra field | `EXTRA_FIELD` | `AST_TRAVERSAL` | current plus canonical extra-entry ordinal | `PAYLOAD_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F23 | AST primitive/backing kind mismatch | `INVALID_FIELD_TYPE` | `AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F24 | literal mismatch or enum has no exact member | `INVALID_FIELD_VALUE` | `AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F25 | array, nonempty array, bounded array, or tuple cardinality mismatch | `INVALID_PAYLOAD_STRUCTURE` | `AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F26 | well-typed tagged-union tag has no branch | `INVALID_PAYLOAD_STRUCTURE` | `AST_TRAVERSAL` | current plus tag-field ordinal | `PAYLOAD_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F27 | closed union has zero matches | `INVALID_PAYLOAD_STRUCTURE` | `AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F28 | tagged or closed union has multiple matches | `AMBIGUOUS_UNION` | `AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED` | true | `NEVER` |
| F29 | valid refinement predicate rejects the primitive string | `INVALID_REFINEMENT` | `AST_TRAVERSAL` | current path | `PAYLOAD_REJECTED` | false | `AFTER_INPUT_CORRECTION` |
| F30 | refinement version, kind, exact shape, base, or alias invariant is invalid | `INVALID_REFINEMENT` | `INTERNAL` | current path | `INTERNAL_FAILURE` | true | `AFTER_PROCESS_RESTART` |
| F31 | detached backing construction/freeze fails | `VALIDATED_BACKING_CONSTRUCTION_FAILED` | `BACKING_CONSTRUCTION` | `[]` | `BACKING_CONSTRUCTION_FAILED` | true | `AFTER_PROCESS_RESTART` |
| F32 | token allocation/registration invariant fails | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE` | `TOKEN_ISSUE` | `[]` | `INTERNAL_FAILURE` | true | `AFTER_PROCESS_RESTART` |
| F33 | token consumer receives nonissued identity | `INVALID_STRUCTURAL_TOKEN` | `TOKEN_CONSUMPTION` | `[]` | `STRUCTURAL_TOKEN_REJECTED` | true | `NEVER` |
| F34 | any other safely catchable internal invariant exception | `INTERNAL_STRUCTURAL_VALIDATION_FAILURE` | `INTERNAL` | `[]` | `INTERNAL_FAILURE` | true | `AFTER_PROCESS_RESTART` |

The implementation must encode `F01` through `F34` as a frozen tuple and a mapped policy object keyed by the exact context union. A compile-time bidirectional union-equality assertion proves all tuple IDs have exactly one policy and no policy is orphaned. A runtime test asserts tuple length 34, unique IDs, unique direct branch bindings, legal code/phase pairs, path bound, safe-summary membership, and complete quarantine/retryability. Every callable failure branch imports one named context constant; no `default`, generic fallback, open string, `Error.message`, or inferred policy is allowed. Uninjectable allocation and module-initialization branches use static source bindings to F01/F32/F33 rather than fabricated runtime tests.

## 10. B04 closure: captured-intrinsic refinement execution

At C module initialization in the trusted code environment, C captures exactly:

```ts
const intrinsicApply = Reflect.apply;
const intrinsicStringTrim = String.prototype.trim;
const noArguments = Object.freeze([]) as readonly [];

const trimPrimitiveString = (value: string): string =>
  intrinsicApply(intrinsicStringTrim, value, noArguments);
```

No later read of `String.prototype`, `.trim`, `Reflect.apply`, `value["trim"]`, `valueOf`, `toString`, an iterator, a locale API, a callback, or a mutable global helper is permitted. The input must already be authenticated A backing of kind `STRING`; therefore intrinsic invocation performs no object coercion. Module-load-before-monkey-patch risk is outside this slice's threat model exactly as authorized.

The exact refinement registry is:

| Refinement kind | Input node | Parameters | Canonical predicate | Output | Failure |
|---|---|---|---|---|---|
| `NON_EMPTY_TRIMMED_STRING` | resolved base node must be `STRING` | exact metadata has no alias or extra key | `trimPrimitiveString(value).length > 0`; leading/trailing whitespace is accepted when the trimmed result is nonempty | original unmodified string | invalid metadata F30; predicate F29 |
| `ID_STRING` | resolved base node must be `STRING` | exact `alias` member of the C1 16-value tuple | `value.length > 0 && value === trimPrimitiveString(value)`; alias never selects behavior | original unmodified string | invalid metadata F30; predicate F29 |

The 16 aliases all map to the one canonical `ID_STRING` predicate above; they do not change its behavior:

| # | Alias | Canonical refinement |
|---:|---|---|
| 1 | `AbilityImpairmentId` | `ID_STRING` |
| 2 | `AbilityInstanceId` | `ID_STRING` |
| 3 | `AbilityUseEntitlementId` | `ID_STRING` |
| 4 | `ActionOpportunityId` | `ID_STRING` |
| 5 | `CandidateId` | `ID_STRING` |
| 6 | `DreamerApparentPairCandidateId` | `ID_STRING` |
| 7 | `EventId` | `ID_STRING` |
| 8 | `FirstNightAbilityInstanceId` | `ID_STRING` |
| 9 | `FirstNightAbilityOutcomeFactId` | `ID_STRING` |
| 10 | `GameId` | `ID_STRING` |
| 11 | `GrantedAbilityId` | `ID_STRING` |
| 12 | `MathematicianDeliveryId` | `ID_STRING` |
| 13 | `PlayerId` | `ID_STRING` |
| 14 | `RoleId` | `ID_STRING` |
| 15 | `RoleTenureId` | `ID_STRING` |
| 16 | `ScheduledTaskId` | `ID_STRING` |

C imports the frozen runtime `STRUCTURAL_ID_ALIASES_V1` from C1 in addition to the parent design's minimum C1 imports. It verifies tuple length 16 and unique membership during authority admission, then retains an immutable membership set. Duplicate or unknown aliases make authority admission unhealthy; they do not register a callback or reach input traversal. A defensive impossible traversal encounter maps to F30 and issues no token.

The exact-head C1 production graph currently contains zero `NON_EMPTY_TRIMMED_STRING` occurrences. C therefore proves that refinement through an immutable package-private traversal seam over the real frozen refinement algebra; it must not add a production graph occurrence or fabricate accepted-history reachability. Alias admission uses a frozen null-prototype record or an equivalent closed switch derived from the 16-value tuple, never a mutable or merely shallow-frozen `Map`.

Neither refinement trims the validated value, writes a normalized string, validates semantic ID grammar, checks existence, consults role/player/task/game state, or calls a producer, replay, registry, or semantic validator. C cannot add refinements, modify C1 metadata, or fall back to handwritten validation.

## 11. Compatibility, token, and authority invariants

- B26 uses only the generic `NON_EMPTY_ARRAY` path. One and multiple authentic impairment entries pass; zero fails F25. No fixed maximum or event special case exists.
- B54 uses only the generic final C1 AST. The three accepted source-contract members and their normalized survivors pass; placeholder, wrong generation, missing, or extra forms fail through ordinary AST diagnostics.
- C1 roots/nodes/refinements remain the only payload structure. Catalog V1/V2, delta metadata, artifact digest, B hash, TypeScript reflection, legacy validator, and manual shape maps are not read.
- The detached C backing retains original accepted strings; it never stores a trim result.
- The private WeakSet/WeakMap token proves structural validation only. JSON, spread, clone, Proxy wrapper, worker transfer, and process transfer do not authenticate.
- Structurally valid but semantically invalid events succeed as `STRUCTURALLY_VALIDATED_DOMAIN_EVENT / NOT_SEMANTICALLY_ACCEPTED`.

## 12. Exact correction test contract

The future implementation must add these distinct C-primary tests to `packages/domain-core/src/domain-event-structural-validator.test.ts`:

1. assert the authority-derived partition is exactly 35 envelope-resolvable and 24 payload-discriminated roots, listing all branch IDs;
2. assert every decision tree in section 4 selects each of the 24 roots exactly once and rejects zero/multiple/unknown outcomes;
3. assert all 35 singleton roots leave discriminator reads at zero before traversal;
4. assert the exact successful discriminator operation counts from section 4;
5. assert every pre-payload failure counter tuple from section 5;
6. assert missing, wrong-kind, unknown, and ambiguous discriminator failures have zero content reads and no AST entry;
7. assert the observer is per-call, data-free, noninjectable, nonexported, and behavior-neutral;
8. assert all 14 envelope rows for missing, null, empty, whitespace-only, and accepted leading/trailing whitespace where applicable;
9. assert `rulesBaselineVersion` and `createdAt` accept empty and whitespace-only strings structurally;
10. assert the six branded envelope ID fields reject trim-empty but accept a nonblank original with leading/trailing whitespace;
11. assert the complete F01-F34 policy census, branch binding, no orphan/default, code/phase legality, path bounds, safe summaries, quarantine, and retryability;
12. assert diagnostics never contain hostile strings, field names, values, stacks, C1 details, or platform text;
13. assert the two distinct frozen refinement predicates use the captured intrinsic: `NON_EMPTY_TRIMMED_STRING` rejects empty/trim-empty but accepts and preserves leading/trailing nonblank strings, while `ID_STRING` accepts only nonempty trim-stable strings; both cover valid internal whitespace and primitive mismatch;
14. assert all 16 aliases use the same predicate and no callback or semantic lookup;
15. assert B26 one/many pass and empty fails through generic traversal;
16. assert all three B54 survivors pass and placeholder/wrong/missing/extra forms fail generically;
17. assert C1/A/B sources are unchanged and production has no Catalog/digest/manual-map/legacy-fallback dependency;
18. assert token nonauthority and structural/semantic separation.

Tests may use a package-private pure authority-admission seam and immutable traversal unit nodes, but may not inject or replace the production singleton. Impossible initialization/allocation failures use static source binding. No A or C1 test becomes C primary evidence.

## 13. Atomic Traceability V1.1 plan

The inventory has exactly 25 design criteria: the 18 historical parents `C-C01` through `C-C18`, retained children `C-C03a`/`C-C03b`, direct-consumption criterion `C-C19`, and four atomic children `C-C06a`, `C-C09a`, `C-C12a`, and `C-C12b`. R1 and R2 sets are empty. No `ActualTest`, `ActualBinding`, `MechanismMatch`, or PASS is asserted here. No primary layer is `MIXED` or `MULTI_LAYER`.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C-C01 | Unknown input enters A exactly once | public C captures once and never reads raw input | public hostile-input matrix and dependency audit | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact result without raw C access | frozen A contract |
| C-C02 | Exact 14-field envelope preserves accepted runtime language | every row in section 7 matches missing/null/empty/whitespace policy without semantic promotion | public 14-field authority-boundary matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact structural acceptance/rejection | accepted type, producer, runtime, semantic and test audit |
| C-C03 | Public C consumes one complete admitted 40/59 authority | public matrix selects one root only after healthy admission | public 40/59 matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact root or no token | C-C03a/C-C03b |
| C-C03a | Exact-head C1 authority is complete | pure admission proves 40/59/13/46 and 35/24 | package-private admission over real C1 result | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | frozen healthy state | C1 health/census tests |
| C-C03b | Unhealthy C1 authority fails before capture | unhealthy seam plus static singleton proof | pure admission seam and source binding | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | F01; no capture/token | C1 result union |
| C-C04 | Every known event has one identity | all 40 event ordinals group deterministically | public event inventory matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact event identity | C1 roots |
| C-C05 | Pre-payload gates perform zero C payload reads | all listed early failures keep payload node/content/discriminator/AST at zero | observer failure matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact frozen counters | A capture boundary |
| C-C06 | Branch selection is exact and fallback-free | all 59 roots select once through the frozen trees | public branch matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | one root or closed dispatch failure | C1 version/root metadata |
| C-C06a | Payload-discriminated dispatch has a bounded read budget | all 24 roots and discriminator failures match section 4 counts with zero content reads | dedicated observer decision-tree matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact discriminator count; no AST before unique root | C1 literal/root metadata |
| C-C07 | Missing fields fail deterministically | envelope/root omissions report first frozen ordinal | omission matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | F08 or F21 | C1 field ordinals |
| C-C08 | Extra fields fail deterministically | exact records reject one extra entry by canonical ordinal | extra-entry matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | F09 or F22 | A canonical ordering |
| C-C09 | Primitive coercion never occurs | kind/literal/enum mutations reject without user conversion | primitive mutation matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | F10/F11/F23/F24 | A primitive backing |
| C-C09a | Refinements use only captured intrinsic trim | two frozen predicates execute without dynamic lookup, and all 16 aliases share the `ID_STRING` predicate | intrinsic and alias matrix plus static dependency audit | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | original value or F29/F30 | C1 refinement correction contract |
| C-C10 | All 15 AST node kinds traverse exactly | each kind follows C1 child order and union cardinality | nested public/unit matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact detached output or closed diagnostic | C1 algebra/tests |
| C-C11 | Legacy B31 remains representable | authentic B31 passes; mutation fails | public legacy vector | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | structural result only | accepted B31 type |
| C-C12 | Current version-aware families remain representable | all current producer roots pass exact dispatch | authentic producer matrix | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | structural result only | current producer tests |
| C-C12a | B26 variadic input is preserved generically | one/many pass and zero fails via `NON_EMPTY_ARRAY` with no special case | dedicated public B26 matrix and dependency trap | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact C1 B26 language | C1 B26 delta evidence |
| C-C12b | B54 survivor input is preserved generically | three survivors pass; placeholder/wrong/missing/extra fail without fallback | dedicated public B54 matrix and dependency trap | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact C1 B54 language | C1 B54 delta evidence |
| C-C13 | Successful path issues only an authentic C token | exact issued identity reads; forgery/copy/clone/wrapper fail | public success and private reader matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | structural token only | A token pattern |
| C-C14 | C token is process-local and noncopyable | serialization/transfer cannot preserve identity | issuer/reader and export audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | issued identity only | none |
| C-C15 | Public diagnostics are total, closed, safe, and deterministic | F01-F34 each has one direct binding and all six policy fields | policy census, branch binding, hostile text and repetition matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | no orphan/default/leak; exact repeat | A translation contract |
| C-C16 | Structural success is not semantic acceptance | success carries both fixed statuses and no authority claim | result/export policy audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | `NOT_SEMANTICALLY_ACCEPTED` | semantic owner map |
| C-C17 | Future unknowns fail closed | future type/version/branch/refinement cannot fall back | hostile future-literal matrix | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | closed diagnostic, no token | closed C1 vocabulary |
| C-C18 | C creates no state/history/hash authority | dependency/export/token audit finds no prohibited issuer | static dependency/API audit | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | no prohibited authority | rescope and review protocol |
| C-C19 | Runtime consumes C1 AST directly and no substitute | 59 roots traverse frozen C1 roots/nodes/refinements; no Catalog/map/fallback/digest/B | public 59-root matrix and forbidden-dependency traps | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | exact C1 language parity | exact-head C1 tests as support only |

The criterion count is `25`; primary physical identities must also be `25` after implementation; duplicate primary and borrowed primary counts must be zero. C-C06 proves selection correctness, while C-C06a proves the distinct observer read budget. C-C09 proves general noncoercion, while C-C09a proves the distinct captured-intrinsic mechanism. C-C12 is the family-level compatibility parent; C-C12a and C-C12b own distinct B26 and B54 primary tests.

## 14. Allowlist, local evidence, and stop-loss

After and only after a fresh independent `RULE_DESIGN_PASS`, the maximum production allowlist remains:

1. `packages/domain-core/src/canonical-domain-event.ts`;
2. `packages/domain-core/src/domain-event-structural-validator.ts`;
3. `packages/domain-core/src/index.ts` for necessary named exports only.

The sole C-primary test file remains `packages/domain-core/src/domain-event-structural-validator.test.ts`. Traceability may be materialized only in the authorized C implementation phase. A, B, C1, event definitions, semantic validators, replay, batch, state, snapshots, application, roles, ownership, coverage, workflow, and agent-loop controls remain forbidden.

Stop with `HUMAN_BLOCKED` if implementation needs a fourth production file, any accepted envelope-language change, C1/A/B/event modification, Catalog/digest runtime authority, a manual schema map, legacy fallback, semantic/state/replay work, or any byte from the protected dirty worktree.

Local technical evidence, implementation repair budgets, Code Review, Rule Review, and the deferred D boundary remain exactly as authorized. This document neither runs nor preclaims a test, traceability PASS, implementation verdict, acceptance, publication, or final closure.

## 15. Fresh independent design-review gate

The fresh reviewer must read this exact file, both parent artifacts and hashes, frozen A/C1 source, the 35/24 derivation, the exact envelope authority sources, the 34-context policy, Traceability V1.1, and the preserved dirty-worktree inventory. The reviewer must specifically verify:

1. the 16-step ordering is implementable and contains no circular payload-read claim;
2. the 35/24 partition and every decision tree are exact and unique;
3. observer counters describe C reads honestly and never claim A skips raw capture;
4. all 14 envelope field policies preserve accepted runtime language;
5. envelope IDs are nonblank but not trim-stable, while baseline/time strings remain plain strings;
6. all 34 contexts have total, nonleaking policy and no default;
7. captured intrinsic trim preserves the exact two refinements and all 16 aliases;
8. B26/B54 remain generic C1 AST behavior;
9. A/B/C1/event definitions and the three-file allowlist remain unchanged;
10. all 25 criteria have nine design-time fields, R1/R2 are empty, and no Actual/PASS/MIXED/MULTI_LAYER claim exists; and
11. implementation has not begun and the original dirty worktree remains byte-identical.

Only `RULE_DESIGN_PASS` with `remainingDesignBlockers=[]` authorizes the already granted conditional implementation phase. This writer does not issue or infer that verdict.

READY_FOR_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW
