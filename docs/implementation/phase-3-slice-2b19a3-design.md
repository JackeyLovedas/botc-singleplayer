# Phase 3 Slice 2B19A3 — Base Dreamer Vortox Forced-False Information — Design Round 1

## Authority Metadata

| Field | Frozen value |
|---|---|
| sliceId | `2B19A3` |
| authorization | `USER_AUTHORIZED_2B19A3_BASE_DREAMER_VORTOX_FORCED_FALSE_INFORMATION` |
| designRound | `1 / 2` |
| acceptedMain | `138748d8211b961616f414d6bf17911fd93f4265` |
| acceptedMainCI | `29505429489 / SUCCESS` |
| governance | `docs/architecture/2B19A3-go-no-go-under-governance-v1.md` |
| governanceSha256 | `2950b08811e97eddb9b6457ce1a453297df3bd55787c7df0007618e3e80a0402` |
| governanceVerdict | `GO` |
| ruleEvidence | `docs/rules/evidence/2B19A3.md` |
| ruleEvidenceSha256 | `98abc0d424c320bec938dc4fca01a8875a30ac447aa895607aaff8600e065014` |
| ruleResearchVerdict | `RULE_READY` |
| unresolvedConflicts | `[]` |
| sliceCoverage | `PARTIAL / VORTOX_FORCED_FALSE_ONLY` |
| Dreamer | `PARTIAL` |
| Vortox | `NOT_STARTED` |
| Mathematician | `PARTIAL` |
| implementationAuthorized | `false` |
| expectedProductionFiles | `5` |
| expectedAddedProductionLOC | `850-1150` |
| hardStop | `no more than 8 changed production files and no more than 1200 added production LOC` |

This document is the complete standalone Round 1 design authority. It authorizes an independent rule-design review only. Production code and tests remain frozen until one independent read-only reviewer returns `RULE_DESIGN_PASS` for the exact SHA-256 of this file.

## Scope

Slice 2B19A3 adds one bounded settlement path to the accepted base Dreamer first-night command: when the current Demon is canonically proven to be an active, effective Vortox, the existing Dreamer action produces exactly one native-GOOD role and one native-EVIL role, neither of which is the target's settlement-time true role. The pair is selected deterministically from the canonical role catalog snapshot, delivered through a new exact V3 variant of the existing `DreamerInformationDelivered` event, settled in the accepted three-event atomic batch, represented as one closed abnormal outcome-ledger fact caused by Vortox, and projected only through the existing private Dreamer knowledge shape.

The Slice also resolves the already-reachable ineffective-Vortox branch: exactly one canonical `DRUNK` or `POISONED` impairment on the otherwise valid current Vortox makes Vortox ineffective. An effective Dreamer source then follows the accepted normal V2 path; an impaired Dreamer source remains at the existing non-Vortox receipt-free unsupported boundary.

The Slice does not create a Vortox action, complete Vortox role behavior, change event names, add GameState aggregates, change workflow scheduling, or implement general impaired-Dreamer information.

## governanceClassification

### Reachability

- `R1`: accepted V1, 2B19A1 V2 opportunity, 2B19A2 normal V2 delivery, target V2, settlement, atomic batching, role tenure, impairment aggregates, ledger, Mathematician, private projection, and official first-night schedule are currently reachable accepted dependencies and must be preserved.
- `R2`: all accepted legacy Dreamer histories and their byte/shape meaning remain immutable. They are replayed, never migrated or reinterpreted as Vortox histories.
- `R3`: malformed exact shapes, unknown versions, invalid tenure or impairment aggregates, partial/reordered batches, mismatched cross-links, invalid ledger evidence, getters, proxies, symbols, cycles, and nonplain records are hostile histories and must fail closed.
- `R4`: effective-Vortox Dreamer success is future behavior at the accepted base and becomes reachable only after this exact design passes review and implementation is accepted. Other-night behavior, lifecycle behavior, gained Dreamer, No Dashii derivation, Storyteller free choice, general registration, later Slices, DAY, and Phase 2C remain R4.

### Trust boundaries

- `T1`: commands, event payloads, event streams, stored batches, persisted ledger evidence, and projection inputs receive exact runtime validation, canonical-ID validation, prospective validation, cross-reference validation, and exception-safe hostile-object rejection.
- `T2`: rebuilt task plan/progress, V3 opportunity, current character state, role tenure, impairment aggregate, role catalog snapshot, stored delivery, and outcome ledger are canonical derived state only after accepted T1 validation.
- `T3`: effective-Vortox applicability, deterministic candidate selection, exact V3 assembly, and preparation equality are module-private pure logic over validated T2 inputs. T3 is not a second public API or canonical authority.

## supportMatrix

| Condition at settlement | Dreamer source | Result | Delivery | Ledger | Receipt on dependency failure |
|---|---|---|---|---|---|
| Unique current non-Vortox Demon | effective | accepted existing behavior | normal V2 | accepted normal fact behavior | none |
| Unique current non-Vortox Demon | represented `DRUNK` or `POISONED` | unsupported existing boundary | none | none | none |
| Unique active current Vortox, no Vortox impairment | effective | supported by this Slice | forced-false V3 | one `ABNORMAL / VORTOX_FALSE_INFORMATION / true` fact | none |
| Unique active current Vortox, no Vortox impairment | represented `DRUNK` or `POISONED` | supported by this Slice | forced-false V3 retaining hidden source impairment evidence | one `ABNORMAL / VORTOX_FALSE_INFORMATION / true` fact | none |
| Unique active current Vortox, exactly one valid `DRUNK` impairment | effective | Vortox ineffective | normal V2 | accepted normal fact behavior | none |
| Unique active current Vortox, exactly one valid `POISONED` impairment | effective | Vortox ineffective | normal V2 | accepted normal fact behavior | none |
| Unique active current Vortox, exactly one valid impairment | represented source impairment | existing unsupported boundary | none | none | none |
| No Dashii is the current Demon | any | accepted unresolved boundary | none | none | none |
| Identity, catalog, tenure, revision, impairment, provenance, candidate, or validation conflict | any | fail closed | none | none | none |

## legacyReplay

`DreamerInformationDeliveredPayloadV1` and `DreamerInformationDeliveredPayloadV2` retain their exact enumerable key sets, literals, nested shapes, clone behavior, equality, event name, replay meaning, projection result, and ledger meaning. No optional Vortox field is added to V1 or V2. The event payload union becomes V1 | V2 | V3 through explicit version discrimination. An absent `deliverySchemaVersion` continues to select V1 under its existing exact-shape rules; exact V2 selects only `dreamer-information-delivered-v2`; exact V3 selects only `dreamer-information-delivered-v3`; every other schema value is invalid. Clone and equality implementations contain separate exhaustive V1, V2, and V3 branches.

## vortoxApplicability

Vortox forced-false applicability is proven only at settlement from validated canonical state. The resolver requires one unique current Demon character-state record, an exact official-catalog match for role ID `vortox` with native type `DEMON`, a roster player/seat match, exactly one active Vortox tenure whose player, role, seat-derived character identity, start revision, continuity, and evaluated revision cross-bind, and a complete valid impairment aggregate.

The Slice does not infer life/death semantics. Any state that requires an unimplemented life/death judgment fails closed. The evaluated revision is the same settlement-time `CurrentCharacterState` revision used by the Dreamer command and stored in the constraint.

## capabilityPrecedence

The existing `resolveBaseDreamerV2NormalCapability` remains the one capability API. Its frozen precedence is:

1. Prove complete base Dreamer source provenance: planned task, progress, V3 opportunity, source contract, source player/seat/role, current source character state, continuous active source tenure, and source ability instance.
2. Validate the complete ability-impairment aggregate and retain a zero-or-one source impairment marker without yet selecting the terminal result.
3. Resolve exactly one current Demon identity and require its exact role-catalog match.
4. For a non-Vortox Demon, return accepted 2B19A2 behavior in this order: source impairment, No Dashii unresolved, then normal support.
5. For Vortox, prove exact identity and exactly one active continuous Vortox tenure at the evaluated revision.
6. With zero Vortox impairments, return V3 forced-false support whether the retained source marker is effective, drunk, or poisoned.
7. With exactly one valid Vortox impairment, treat Vortox as ineffective: an effective source returns normal V2 support and a source-impaired Dreamer remains unsupported.
8. Duplicate, conflicting, malformed, stale, future, cross-linked, or otherwise ambiguous impairment/tenure evidence returns `EFFECTIVENESS_UNRESOLVED`.
9. Every thrown exception or hostile canonical structure is caught at the existing validation boundary and fails closed.

The exact replacement union is:

```ts
export const DREAMER_VORTOX_CONSTRAINT_VERSION = "dreamer-vortox-constraint-v1" as const;

export type DreamerVortoxConstraint = {
  readonly constraintVersion: typeof DREAMER_VORTOX_CONSTRAINT_VERSION;
  readonly kind: "VORTOX_FORCED_FALSE_REQUIRED";
  readonly vortoxPlayerId: PlayerId;
  readonly vortoxSeatNumber: SeatNumber;
  readonly vortoxRoleId: "vortox";
  readonly vortoxRoleTenureId: RoleTenureId;
  readonly evaluatedCharacterStateRevision: number;
};

export type DreamerVortoxSourceEffectiveness =
  | { readonly kind: "EFFECTIVE" }
  | {
      readonly kind: "SOURCE_REPRESENTED_IMPAIRED";
      readonly sourceImpairmentId: AbilityImpairmentId;
      readonly sourceImpairmentKind: "DRUNK" | "POISONED";
    };

export type BaseDreamerV2NormalCapability =
  | {
      readonly kind: "NORMAL_INFORMATION_SUPPORTED";
      readonly evaluationModelVersion: typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
    }
  | {
      readonly kind: "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
      readonly evaluationModelVersion: typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
      readonly sourceEffectiveness: DreamerVortoxSourceEffectiveness;
      readonly vortoxConstraint: DreamerVortoxConstraint;
    }
  | {
      readonly kind: "SOURCE_REPRESENTED_IMPAIRED";
      readonly impairmentId: AbilityImpairmentId;
      readonly impairmentKind: "DRUNK" | "POISONED";
    }
  | {
      readonly kind: "NO_DASHII_EFFECT_UNRESOLVED";
      readonly noDashiiPlayerId: PlayerId;
      readonly noDashiiSeatNumber: SeatNumber;
    }
  | {
      readonly kind: "EFFECTIVENESS_UNRESOLVED";
      readonly reason:
        | "SOURCE_PROVENANCE_INVALID"
        | "SOURCE_IMPAIRMENT_CONFLICT"
        | "CURRENT_DEMON_IDENTITY_NOT_UNIQUE"
        | "CURRENT_DEMON_CATALOG_MISMATCH"
        | "VORTOX_TENURE_MISSING_OR_INCONSISTENT"
        | "VORTOX_EFFECTIVENESS_CONFLICT";
    };
```

The removed `VORTOX_FORCED_FALSE_UNSUPPORTED` variant is not accepted as a stored schema and has no replay compatibility obligation because it is a transient capability result, not persisted history.

## sourceImpairmentUnderVortox

When Vortox is effective, a represented Dreamer `DRUNK` or `POISONED` impairment does not relax the false-pair constraint. The capability stores the exact source impairment ID and kind in `sourceEffectiveness`; V3 carries this hidden canonical evidence; the ledger requires the same zero-or-one source impairment evidence; and player/AI projections reveal none of it. The terminal cause remains `VORTOX_FALSE_INFORMATION`, not source drunkenness or poisoning.

## ineffectiveVortox

Exactly one valid active `DRUNK` or `POISONED` impairment cross-bound to the proven Vortox tenure makes Vortox ineffective. The existing effective source returns the unchanged normal V2 capability and delivery. If the source Dreamer is also impaired, the resolver returns the existing `SOURCE_REPRESENTED_IMPAIRED` result and the application returns the existing retryable receipt-free unsupported result. A Vortox impairment is never copied into a V3 forced-false delivery or its ledger evidence.

## versionedDelivery

Add:

```ts
export const DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION =
  "dreamer-information-delivered-v3" as const;

export type DreamerInformationDeliveredPayloadV3 = {
  readonly deliverySchemaVersion: typeof DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: typeof DREAMER_FALSE_ROLE_POLICY_VERSION;
  readonly goodRole: RoleSetupSnapshot;
  readonly informationReliability: { readonly kind: "VORTOX_FORCED_FALSE" };
  readonly knowledgeModelVersion: typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion: typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly rulesBaselineVersion: string;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly sourceEffectiveness: DreamerVortoxSourceEffectiveness;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly vortoxConstraint: DreamerVortoxConstraint;
};
```

The V3 top-level enumerable key set is exactly these 21 names: `deliverySchemaVersion`, `evilRole`, `falseRolePolicyVersion`, `goodRole`, `informationReliability`, `knowledgeModelVersion`, `knowledgeStage`, `nightNumber`, `opportunityId`, `opportunitySchemaVersion`, `rulesBaselineVersion`, `sourceCharacterStateRevision`, `sourceContract`, `sourceEffectiveness`, `sourcePlayerId`, `sourceSeatNumber`, `targetPlayerId`, `targetSeatNumber`, `taskId`, `taskType`, `vortoxConstraint`.

`informationReliability` is exactly `{ kind: "VORTOX_FORCED_FALSE" }`. `sourceContract`, V3 opportunity, and target V2 remain byte/shape unchanged. Every nested object has exact enumerable keys and supported primitives; unknown keys, unknown literals, missing keys, accessors, proxies, symbols, cycles, arrays where records are required, nonplain prototypes, nonfinite numbers, and throwing reads fail closed. `DreamerInformationDeliveredPayload` becomes the explicit union V1 | V2 | V3.

## candidatePolicy

Candidates come only from the validated `roleCatalogSnapshot`. GOOD candidates have native `characterType` `TOWNSFOLK` or `OUTSIDER`; EVIL candidates have native `characterType` `MINION` or `DEMON`. The settlement target's exact true `roleId` is excluded from both sets. In-play roles remain eligible. Each set is sorted by the existing raw UTF-16 code-unit `compareStableId`, independent of input order, runtime locale, `localeCompare`, `Intl.Collator`, randomness, and current alignment. The first GOOD and first EVIL entries are selected. Candidate sets and target truth are not persisted. An empty legal set is a retryable dependency failure with no receipt, append, command-ID consumption, or partial state change.

## Canonical Preparation Without Validation/Production Divergence

After deterministic command validation, `GameApplicationService` invokes the domain resolver exactly once and constructs a module-private value:

```ts
type PreparedBaseDreamerSubmission = {
  readonly kind: "PREPARED_BASE_DREAMER_SUBMISSION";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly expectedGameVersion: number;
  readonly capability: Extract<
    BaseDreamerV2NormalCapability,
    { readonly kind: "NORMAL_INFORMATION_SUPPORTED" | "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED" }
  >;
  readonly targetChoice: DreamerTargetChosenPayloadV2;
  readonly delivery: DreamerInformationDeliveredPayloadV2 | DreamerInformationDeliveredPayloadV3;
  readonly settlement: ScheduledTaskSettlement;
};
```

This preparation object is passed privately through `createBatchOrReject`, `createBatch`, and `createEvents`. Event creation may clone prepared values but may not query state, rerun capability resolution, regenerate candidates, or recompute payloads. Prospective validation independently invokes the same canonical resolver from the prospective prefix and proves deep exact equality with the unique prepared result before append. Thus production and replay validation share one resolver without sharing mutable preparation. The type is not exported, persisted, added to `GameState`, projected, or exposed as a generic API.

## batch

Successful submission creates exactly three existing events in order: `DreamerTargetChosen` V2, `DreamerInformationDelivered` V2 or V3, and `ScheduledTaskSettled`. They occupy one command, one `batchId`, one `batchSize=3`, contiguous `batchIndex` 0/1/2, contiguous sequence numbers, one expected game version, and phase `FIRST_NIGHT`. No event is appended before all dependency and prospective checks pass. Naked, partial, duplicate, reversed, reordered, cross-command, cross-batch, gapped, wrong-phase, or metadata-mismatched forms are rejected by batch semantics and rebuild.

## ledger

A valid V3 contributes exactly one terminal fact with `outcomeStatus="ABNORMAL"`, `causeKind="VORTOX_FALSE_INFORMATION"`, and `causedByAnotherCharacterAbility=true`. The closed evidence vocabulary remains `SOURCE_EVENT`, `TASK`, `ACTION_OPPORTUNITY`, `CHARACTER_STATE`, `PLAYER_ROLE_AT_REVISION`, `ROLE_TENURE`, `ABILITY_IMPAIRMENT`, and `DREAMER_DELIVERY`; no generic evidence kind is added.

Evidence must cross-bind the source event, task, V3 opportunity, settlement revision, source and target character/role facts, active Dreamer tenure, active Vortox tenure and constraint, exact V3 delivery, and zero or one source `ABILITY_IMPAIRMENT` matching V3 `sourceEffectiveness`. Vortox impairment evidence is forbidden in a V3 fact because V3 proves Vortox effective. The validator explicitly corrects the old assumption that every abnormal Dreamer fact is caused by source impairment. `ScheduledTaskSettled` closes the chain and creates no second terminal fact.

## mathematician

No production change is allowed in Mathematician. The accepted normal Dreamer fact remains excluded. A qualifying V3 abnormal fact is consumed once for its Dreamer `sourcePlayerId`; multiple qualifying facts for the same source still count as one distinct player under the accepted source/window/own-ability exclusions.

## projection

The only projection production change is in `packages/projections/src/index.ts`: pass the existing rebuilt ledger to the stored V3 validator before admitting historical V3 knowledge. Output shape is unchanged. Only the source player and that player's AI view receive the existing historical target, GOOD role, EVIL role, and knowledge metadata. Other players and AI views omit it. Reliability, Vortox identity/tenure/constraint, impairments, target truth, candidates, ledger cause, assignments, and current state never leak. Projection uses stored history and never recomputes from later character, alignment, impairment, or Demon state.

## replay

Rebuild validates the exact V3 shape, the three-event batch, all historical cross-links, the unique expected deterministic pair, capability at the historical revision, and the closed ledger chain. Accepted replay produces the same target choice, delivery, closed opportunity, settlement, ledger fact, and private knowledge. Later state changes cannot rewrite the delivery. Unknown schemas and hostile histories fail before state mutation. No replay adapter or migration is introduced.

## receipts

Dependency, provenance, applicability, candidate-shortage, prospective-validation, append, and metadata failures are retryable and receipt-free, consume no command ID, and append no event. Deterministic command rejection retains existing receipt semantics. A successful retry from unchanged canonical inputs yields exactly the same prepared three-event batch.

## failures

Failure is closed and atomic. Missing or conflicting current Demon identity, catalog mismatch, invalid Dreamer or Vortox tenure, invalid impairment aggregate, unsupported source condition, No Dashii unresolved state, target mismatch, candidate shortage, invalid historical payload, batch mismatch, ledger mismatch, or projection cross-link mismatch cannot fall back from V3 to V2 except the explicitly proven single-impaired-Vortox case. Exceptions from hostile structures are converted to existing domain/application rejection paths; they are not concealed and do not produce partial state.

## Affected Files

### Exact production allowlist

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

Expected production scope is exactly five files and 850-1150 added production LOC. The hard stop is more than eight changed production files or more than 1200 added production LOC. A sixth through eighth file is not automatically authorized: any production file outside the exact five-file allowlist requires a fresh reviewed design before editing.

### Exact test allowlist

1. `packages/domain-core/src/dreamer.test.ts`
2. `packages/domain-core/src/domain-batch-semantics.test.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
4. `packages/domain-core/src/rebuild.test.ts`
5. `packages/application/src/game-application-service.test.ts`
6. `packages/application/src/mathematician-information.test.ts`
7. `packages/projections/src/private-knowledge-view.test.ts`

### Exact test-harness support allowlist

1. `packages/test-harness/src/dreamer-vortox-v3-accepted-stream.ts`
2. `packages/test-harness/src/dreamer-vortox-v3-accepted-stream-fixture.ts`
3. `packages/test-harness/src/fixtures/dreamer-vortox-v3-accepted-stream.json`
4. `packages/test-harness/src/index.ts`

The live application capture module is test-local authority used to refresh or verify fixture bytes and must not be eagerly exported from `packages/test-harness/src/index.ts`. The immutable fixture and lazy/side-effect-free helpers may be exported only when needed by allowed tests.

### Documentation and control allowlist

- `docs/implementation/phase-3-slice-2b19a3-design.md`
- the later independent design-review report
- the later Slice status and test-traceability documents
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/PROJECT_STATE.md`
- the existing PR-body authority when publication is authorized

### Forbidden production files and surfaces

No edits are allowed to first-night action-opportunity, event-applier, event definitions/names, GameState, generic rebuild architecture, Mathematician production, workflow, dependencies, timeouts, package configuration, test configuration, or CI configuration. No new event type, aggregate, generic effect engine, registration engine, scheduling kind, or public preparation API is allowed.

## tests

Each rule criterion has one and only one primary authority layer. Supporting tests may cover the same behavior but cannot replace the listed primary.

| ID | criterion | ruleClaim | R/T | physical primary file | primary layer | supporting tests | expected failure |
|---|---|---|---|---|---|---|---|
| `2B19A3-C01` | V1 history replays unchanged | Legacy delivery meaning is immutable | R2/T1 | `packages/domain-core/src/rebuild.test.ts` | LEGACY_REPLAY_COMPATIBILITY | `dreamer.test.ts` | replay rejects or meaning changes |
| `2B19A3-C02` | 2B19A1 non-actionable V2 replays unchanged | Opportunity foundation remains immutable | R2/T1 | `packages/domain-core/src/rebuild.test.ts` | LEGACY_REPLAY_COMPATIBILITY | `domain-batch-semantics.test.ts` | accepted prefix no longer rebuilds |
| `2B19A3-C03` | 2B19A2 normal V2 replays unchanged | Ineffective-Vortox normal fallback reuses V2 | R1/T1 | `packages/domain-core/src/rebuild.test.ts` | LEGACY_REPLAY_COMPATIBILITY | `game-application-service.test.ts` | V2 is widened or reinterpreted |
| `2B19A3-C04` | Real base command reaches effective-Vortox success | Effective Vortox forces false Dreamer information | R4→R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | `rebuild.test.ts` | retryable unsupported result or no atomic append |
| `2B19A3-C05` | Exactly one GOOD and one EVIL catalog role | Dreamer output shape remains exact | R4→R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | `dreamer.test.ts` | wrong category/count/catalog identity |
| `2B19A3-C06` | GOOD target truth excluded from both fields | Vortox makes proposition false | R4→R1/T3 | `packages/domain-core/src/dreamer.test.ts` | PURE_POLICY_SEAM | `game-application-service.test.ts` | either role equals target truth |
| `2B19A3-C07` | EVIL target truth excluded from both fields | Vortox makes proposition false for every target category | R4→R1/T3 | `packages/domain-core/src/dreamer.test.ts` | PURE_POLICY_SEAM | `game-application-service.test.ts` | either role equals target truth |
| `2B19A3-C08` | Stable ordering ignores catalog order and locale | Deterministic subset policy uses code-unit order | R4→R1/T3 | `packages/domain-core/src/dreamer.test.ts` | PURE_POLICY_SEAM | fixture equality | different pair under permutation/locale |
| `2B19A3-C09` | In-play false roles remain eligible | Rules do not require out-of-play roles | R4→R1/T3 | `packages/domain-core/src/dreamer.test.ts` | PURE_POLICY_SEAM | application integration | legal in-play role incorrectly excluded |
| `2B19A3-C10` | Candidate shortage is receipt-free | No legal pair means retryable dependency failure | R4→R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | `dreamer.test.ts` | receipt, command ID, or partial append occurs |
| `2B19A3-C11` | Vortox identity/catalog/player/seat/tenure/revision cross-bind | Applicability requires canonical proof | R1/T2 | `packages/domain-core/src/dreamer.test.ts` | STRUCTURAL_VALIDATION | application integration | mismatched proof is accepted |
| `2B19A3-C12` | Missing Vortox tenure fails closed | Identity alone is insufficient | R3/T1 | `packages/domain-core/src/rebuild.test.ts` | HOSTILE_REPLAY_REJECTION | application integration | forced-false or normal fallback is guessed |
| `2B19A3-C13` | Duplicate/conflicting/cross-linked tenure fails closed | Tenure must be unique and exact | R3/T1 | `packages/domain-core/src/rebuild.test.ts` | HOSTILE_REPLAY_REJECTION | `dreamer.test.ts` | ambiguous tenure is accepted |
| `2B19A3-C14` | Stale/ended/future/discontinuous tenure fails closed | Vortox must be active continuously at settlement | R3/T1 | `packages/domain-core/src/rebuild.test.ts` | HOSTILE_REPLAY_REJECTION | `dreamer.test.ts` | invalid temporal proof is accepted |
| `2B19A3-C15` | Unimpaired Vortox is effective | Zero valid Vortox impairment activates constraint | R4→R1/T3 | `packages/domain-core/src/dreamer.test.ts` | PURE_POLICY_SEAM | application integration | Vortox remains unsupported or ignored |
| `2B19A3-C16` | DRUNK Vortox returns effective source to normal V2 | Impaired Vortox has no forced-false ability | R4→R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | `dreamer.test.ts` | V3 emitted instead of exact V2 |
| `2B19A3-C17` | POISONED Vortox returns effective source to normal V2 | Impaired Vortox has no forced-false ability | R4→R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | `dreamer.test.ts` | V3 emitted instead of exact V2 |
| `2B19A3-C18` | Malformed/duplicate/conflicting/stale Vortox impairment fails closed | Only one exact active impairment is meaningful | R3/T1 | `packages/domain-core/src/rebuild.test.ts` | HOSTILE_REPLAY_REJECTION | `dreamer.test.ts` | conflict selects V2 or V3 |
| `2B19A3-C19` | Effective Vortox plus source DRUNK stays false | Vortox constrains impaired Townsfolk information | R4→R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | ledger tests | correct role appears or submission fails unsupported |
| `2B19A3-C20` | Effective Vortox plus source POISONED stays false | Vortox constrains impaired Townsfolk information | R4→R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | ledger tests | correct role appears or submission fails unsupported |
| `2B19A3-C21` | Source impairment retained canonically and hidden | Evidence is historical but private | R4→R1/T2 | `packages/projections/src/private-knowledge-view.test.ts` | PROJECTION | ledger structural tests | evidence missing or impairment leaks |
| `2B19A3-C22` | Ineffective Vortox plus impaired source remains unsupported | General impaired-source information is out of scope | R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | `dreamer.test.ts` | delivery, receipt, or append occurs |
| `2B19A3-C23` | Pre-settlement target change changes excluded truth | Current settlement character defines truth | R4→R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | `dreamer.test.ts` | assignment-time role remains excluded instead |
| `2B19A3-C24` | Post-delivery change cannot rewrite knowledge | Delivered knowledge is historical | R1/T2 | `packages/projections/src/private-knowledge-view.test.ts` | PROJECTION | `rebuild.test.ts` | projected pair recomputed from current state |
| `2B19A3-C25` | Alignment-only change does not affect legality | Native category and character truth are distinct | R4→R1/T3 | `packages/domain-core/src/dreamer.test.ts` | PURE_POLICY_SEAM | application integration | player alignment changes candidate category |
| `2B19A3-C26` | Exact target/delivery/settlement atomic batch | One successful action has one ordered batch | R4→R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | `domain-batch-semantics.test.ts` | wrong order/count/metadata or partial append |
| `2B19A3-C27` | Hostile batch and history forms reject | Atomic batch semantics are canonical | R3/T1 | `packages/domain-core/src/domain-batch-semantics.test.ts` | HOSTILE_REPLAY_REJECTION | `rebuild.test.ts` | naked/partial/reordered/cross-batch accepted |
| `2B19A3-C28` | Accepted replay rebuilds identical state | Events are canonical truth | R4→R1/T1 | `packages/domain-core/src/rebuild.test.ts` | ACCEPTED_STREAM_INTEGRATION | immutable fixture | rebuilt target/delivery/opportunity/settlement/ledger differs |
| `2B19A3-C29` | One exact abnormal Vortox fact | Vortox is the terminal abnormal cause | R4→R1/T2 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | STRUCTURAL_VALIDATION | application integration | zero, duplicate, or wrong-cause fact |
| `2B19A3-C30` | Ledger evidence uses exact closed kinds/cross-links | Historical cause must be proven | R3/T1 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | STRUCTURAL_VALIDATION | `rebuild.test.ts` | missing/extra/cross-linked evidence accepted |
| `2B19A3-C31` | Settlement creates no second fact | One ability resolution has one terminal fact | R4→R1/T2 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | ledger tests | duplicate fact after settlement |
| `2B19A3-C32` | Mathematician counts V3 source once | Qualifying abnormal source counts distinctly | R4→R1/T2 | `packages/application/src/mathematician-information.test.ts` | ACCEPTED_STREAM_INTEGRATION | ledger tests | source omitted or counted twice |
| `2B19A3-C33` | Multiple same-source facts remain one player | Mathematician deduplicates source players | R1/T3 | `packages/application/src/mathematician-information.test.ts` | PURE_POLICY_SEAM | application integration | count increases per fact |
| `2B19A3-C34` | Source player/AI only; no secret leak | Projection separates canonical and player knowledge | R4→R1/T1 | `packages/projections/src/private-knowledge-view.test.ts` | PROJECTION | ledger structural tests | other viewer sees pair or hidden cause/evidence |
| `2B19A3-C35` | Dreamer remains 61/80 between Clockmaker and Seamstress; no Vortox wake | Official first-night order is unchanged | R1/T1 | `packages/domain-core/src/dreamer.test.ts` | STRUCTURAL_VALIDATION | real continuation C39 | schedule order changes |
| `2B19A3-C36` | Frozen HEAD passes Ubuntu and Windows gates | Determinism is cross-platform | R4→R1/T1 | `.github/workflows/ci.yml` | CROSS_PLATFORM_CI | all focused/full local gates | required exact-head job fails |
| `2B19A3-C37` | V3 complete exact shape and hostile-object rejection | Persisted V3 is an exact closed schema | R3/T1 | `packages/domain-core/src/dreamer.test.ts` | STRUCTURAL_VALIDATION | `rebuild.test.ts` | missing/extra/nested mutation/getter accepted |
| `2B19A3-C38` | Normal Dreamer fact remains excluded from Math | Existing normal behavior is not abnormal | R1/T2 | `packages/application/src/mathematician-information.test.ts` | ACCEPTED_STREAM_INTEGRATION | ledger tests | normal V2 increases count |
| `2B19A3-C39` | Real Dreamer-to-terminal-Seamstress stream accepts | Slice composes with accepted next task | R4→R1/T1 | `packages/application/src/game-application-service.test.ts` | ACCEPTED_STREAM_INTEGRATION | `rebuild.test.ts`, live fixture | either opportunity remains open or terminal replay differs |

### Supporting test authorities

| ID | Supporting authority | Required location and assertion |
|---|---|---|
| `2B19A3-S01` | Exact nested mutations | `dreamer.test.ts` and `rebuild.test.ts` mutate each V3 nested key/literal/type and require fail-closed rejection |
| `2B19A3-S02` | Provenance cross-links | `rebuild.test.ts` and ledger tests cross-link every task/opportunity/player/seat/revision/tenure/impairment/delivery reference and require rejection |
| `2B19A3-S03` | Clone/equality exhaustion | `dreamer.test.ts` proves V1/V2/V3 separate clones, no shared nested references, and exact equality discrimination |
| `2B19A3-S04` | Batch generation/metadata | application and batch tests prove one prepared result creates exactly three contiguous FIRST_NIGHT events with one command/batch/version |
| `2B19A3-S05` | Stored ledger/projection cross-links | ledger and projection tests reject stored V3 whose validated ledger fact is absent, duplicated, mismatched, or cross-linked |
| `2B19A3-S06` | Retry equality | application tests prove unchanged retry inputs produce byte-for-byte equal prepared event payloads and no failed-attempt receipt/ID |
| `2B19A3-S07` | Forbidden API scan | static diff scan proves no exported preparation, new event/aggregate/evidence family, locale/random ID source, or forbidden production-file edit |
| `2B19A3-S08` | Live capture fixture equality | a real application capture in the non-eager live module must `toStrictEqual` the immutable accepted-stream JSON fixture |

## CI

Before publication run targeted Vitest files for every changed test, targeted ESLint for every changed TypeScript file, then all four full gates with Node 24.15.0 and pnpm 11.7.0: `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:coverage`. Coverage uses the accepted single-fork configuration. The final frozen feature HEAD must pass required Ubuntu ordinary/single-fork coverage and Windows deterministic jobs. CI authority is commit-specific and may not be inherited from accepted base CI `29505429489`.

## documentation

After implementation, create the Slice status and complete C01-C39/S01-S08 traceability records, update the PR body rule sections, and update `docs/rules/ROLE_COVERAGE_MATRIX.md` to `PARTIAL / VORTOX_FORCED_FALSE_ONLY` for this Slice while Dreamer remains `PARTIAL`, Vortox remains `NOT_STARTED`, and Mathematician remains `PARTIAL`. Control records must preserve exact evidence/design/review hashes and separate product-head, merge, and closeout CI provenance.

## rollback

Before publication, rollback consists of reverting only the uncommitted implementation/test/status changes while preserving the accepted base and this evidence/design audit trail. After publication, use a normal attributed revert of the Slice commits; never rewrite accepted history or force-push. V1/V2 histories need no data migration because V3 is an additive closed variant. If rollback removes V3 producer support, V3 accepted histories cannot be silently treated as V2 and require explicit compatibility review.

## outOfScope

- non-effective-Vortox source `DRUNK` or `POISONED` information generation;
- No Dashii adjacency or poisoning derivation;
- Philosopher-gained Dreamer or any gained-role source;
- Storyteller free role-pair choice or candidate/final-choice persistence;
- Traveller targets;
- Dreamer or Vortox life/death semantics;
- other-night Dreamer or Vortox execution;
- FIRST_NIGHT completion, DAY, or Phase 2C;
- Slice 2B19A4, Slice 2B19B, or any next Slice;
- general character/alignment change producers;
- general registration, Spy, Recluse, or misregistration behavior;
- new events, event names, GameState aggregates, evidence kinds, effect engines, projection fields, workflow, dependencies, timeouts, or configuration;
- changing Mathematician production;
- marking Dreamer or Vortox `COMPLETE`.

## completionCriteria

1. The exact independent review of this file returns `RULE_DESIGN_PASS` before production/test edits.
2. The implementation changes exactly the five production files in the allowlist.
3. Added production LOC is between 850 and 1150 and never exceeds 1200.
4. No forbidden production file or surface changes.
5. V1 delivery exact shape and replay meaning remain unchanged.
6. V2 delivery exact shape and replay meaning remain unchanged.
7. V3 uses the exact schema literal `dreamer-information-delivered-v3`.
8. V3 has exactly the frozen 21 top-level enumerable keys.
9. V3 reliability is exactly `VORTOX_FORCED_FALSE`.
10. The constraint version is exactly `dreamer-vortox-constraint-v1`.
11. The constraint has exactly the seven frozen fields and `vortoxRoleId="vortox"`.
12. Source effectiveness is exactly the frozen two-variant closed union.
13. The existing capability API is extended without creating a second exported resolver.
14. `VORTOX_FORCED_FALSE_UNSUPPORTED` is removed from the transient capability union.
15. Complete source provenance is evaluated before Demon applicability.
16. The full impairment aggregate is validated before any result is selected.
17. Current Demon identity and catalog entry are unique and exact.
18. Vortox tenure is unique, active, continuous, and revision-bound.
19. Zero Vortox impairment activates V3.
20. Exactly one valid Vortox impairment returns an effective source to exact normal V2.
21. Ineffective Vortox plus source impairment stays receipt-free unsupported.
22. Effective Vortox plus source drunkenness still yields a false pair.
23. Effective Vortox plus source poisoning still yields a false pair.
24. Source impairment evidence is retained exactly and remains private.
25. The target's settlement-time true role is excluded from both fields.
26. GOOD candidates are native Townsfolk/Outsider and EVIL candidates are native Minion/Demon.
27. Stable selection uses `compareStableId` and is catalog-order/locale independent.
28. In-play legal roles remain eligible.
29. Candidate truth and candidate sets are not persisted or projected.
30. Candidate shortage is retryable, receipt-free, and append-free.
31. `PreparedBaseDreamerSubmission` is module-private and has exactly the frozen fields.
32. The production path resolves once before preparation and event creation does not recompute.
33. Prospective validation independently resolves and proves exact equality.
34. Success appends exactly target V2, delivery V2/V3, and settlement in that order.
35. Batch metadata is one command/version/batch, size three, indexes 0/1/2, contiguous sequence, `FIRST_NIGHT`.
36. Hostile partial/reordered/cross-batch histories fail closed.
37. V3 creates exactly one `ABNORMAL / VORTOX_FALSE_INFORMATION / true` ledger fact.
38. Ledger evidence uses only the eight accepted evidence kinds.
39. V3 ledger evidence contains zero or one exact source impairment and forbids Vortox impairment.
40. Settlement does not create a second terminal fact.
41. Normal Dreamer remains excluded from Mathematician.
42. V3 source is counted once and same-source facts remain deduplicated.
43. Projection shape remains unchanged and only source player/AI receives knowledge.
44. Projection leaks no reliability, Vortox, impairment, truth, candidate, tenure, or cause data.
45. Projection and replay never recompute historical delivery from later state.
46. All 39 unique primary criteria pass in their frozen primary layers.
47. All S01-S08 supporting authorities pass.
48. The live capture is not eagerly exported and strictly equals the immutable fixture.
49. Targeted tests and targeted lint pass.
50. `pnpm typecheck` passes.
51. `pnpm lint` passes with zero warnings.
52. `pnpm test` passes.
53. `pnpm test:coverage` passes under the accepted single-fork semantics.
54. Ubuntu and Windows required CI pass on the exact frozen product HEAD.
55. The complete independent final review returns `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS` with `remainingBlockers=[]` for exact PR HEAD.
56. Both complete verbatim GitHub audit comments are re-read and verified against exact PR HEAD before merge authorization.
57. The PR body contains every required rule section and exact evidence/design/review hashes.
58. The coverage matrix records only `PARTIAL / VORTOX_FORCED_FALSE_ONLY`; Dreamer is not promoted to `COMPLETE`.
59. Vortox remains `NOT_STARTED` and Mathematician remains `PARTIAL`.
60. No secret, canonical truth marker, or hidden impairment is exposed.
61. No canonical ID or order uses time, randomness, UUID randomness, locale comparison, or environment locale.
62. The final reviewed HEAD equals PR HEAD and the worktree is clean.

## coverageStatus

On acceptance, Slice 2B19A3 is `PARTIAL / VORTOX_FORCED_FALSE_ONLY`. Dreamer remains `PARTIAL` because impaired non-Vortox information, gained Dreamer, other-night behavior, life/death interactions, registration, Storyteller free choice, and later role interactions are not complete. Vortox remains `NOT_STARTED` because this Slice consumes one bounded continuous constraint and does not implement the Vortox role. Mathematician remains `PARTIAL` because production is unchanged and only its accepted consumption contract is regression-tested. FIRST_NIGHT remains incomplete.

## Stop Conditions

Stop immediately and report the exact blocker without implementation or inference if rule evidence/hash changes, the independent verdict is not `RULE_DESIGN_PASS`, a source conflict appears, canonical tenure/impairment state cannot prove the frozen precedence, V3 requires a new event or GameState field, preparation must become public/persisted, prospective validation cannot use the same canonical resolver, ledger closure requires a new evidence kind, projection requires a new output field, V1/V2 compatibility weakens, Mathematician production must change, a forbidden production file is needed, changed production scope is not exactly the reviewed allowlist, added production LOC exceeds 1200, changed production files exceed eight, a second infrastructure risk appears, any targeted/full gate fails repeatedly, exact-head CI is unavailable or red, final review is incomplete or non-passing, audit comments do not match PR HEAD, or the worktree contains unexplained changes.

No branch publication, commit, push, PR creation, merge, next Slice, or role-coverage promotion is authorized by this design document.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_1
