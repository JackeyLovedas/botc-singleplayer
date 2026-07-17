# Phase 3 Slice 2B19A3 — Base Dreamer Vortox Forced-False Information Frozen Design Round 2

## Authority Metadata

- sliceId: `2B19A3`
- authorization: `USER_AUTHORIZED_2B19A3_BASE_DREAMER_VORTOX_FORCED_FALSE_INFORMATION`
- designRound: `2 / 2`
- acceptedMain: `138748d8211b961616f414d6bf17911fd93f4265`
- acceptedMainCI: `29505429489 / SUCCESS`
- governance: `docs/architecture/2B19A3-go-no-go-under-governance-v1.md`
- governanceSha256: `2950b08811e97eddb9b6457ce1a453297df3bd55787c7df0007618e3e80a0402`
- governanceVerdict: `GO`
- refreshedRuleEvidence: `docs/rules/evidence/2B19A3.md`
- refreshedRuleEvidenceSha256: `798c5d2edeb7053e9cd720937e15785492ce214b87f7975f9a66cc9b056947c6`
- ruleResearchVerdict: `RULE_READY`
- unresolvedConflicts: `[]`
- immutableRound1Design: `docs/implementation/phase-3-slice-2b19a3-design.md`
- immutableRound1DesignSha256: `da48346689c049c1e247d81f0f36e68efc0967e37db5688cc2e3a9ae729f5e3e`
- immutableRound1Review: `docs/implementation/phase-3-slice-2b19a3-design-review-round-1.md`
- immutableRound1ReviewSha256: `024d6bea20055f7e4f21472509e6f53251c1df1286bba719b5cb580f721339e6`
- sliceCoverage: `PARTIAL / VORTOX_FORCED_FALSE_ONLY`
- Dreamer: `PARTIAL`
- Vortox: `NOT_STARTED`
- Mathematician: `PARTIAL`
- ruleDesignPass: `false`
- implementationAuthorized: `false`
- expectedProductionFiles: `5`
- nonBindingAddedProductionLocEstimate: `650-1000`
- bindingStopLoss: no more than `1200` added production LOC and no production file outside the exact five-file allowlist

This document is the complete standalone Round 2 replacement and sole candidate implementation authority. It is not an erratum or delta. It closes all six Round 1 review blockers. It authorizes only a fresh independent rule-design review. No production code, test, feature branch, commit, push, PR, merge, or next Slice is authorized until the exact materialized file receives `RULE_DESIGN_PASS`.

## Scope

Slice 2B19A3 adds one bounded settlement path to the accepted base Dreamer first-night command. When canonical settlement state proves one active effective Vortox, Dreamer delivers exactly one native-GOOD and one native-EVIL catalog role, neither equal to the target's settlement-time true role. Deterministic selection uses the accepted role catalog snapshot and raw UTF-16 stable-ID order. The accepted target V2, new exact delivery V3, and existing settlement form one atomic three-event batch. The V3 delivery creates exactly one closed abnormal outcome-ledger fact caused by Vortox and projects through the unchanged private Dreamer knowledge shape.

The Slice also defines the pure domain policy for a represented DRUNK or POISONED Vortox: exactly one canonical current impairment makes Vortox ineffective. An effective Dreamer then uses unchanged normal V2. General impaired non-Vortox Dreamer information remains unsupported.

The Slice does not add a Vortox action, lifecycle, alignment producer, generic effect engine, event name, event family, GameState aggregate, evidence kind, projection field, or Mathematician producer change.

## Governance Classification

### Reachability

- `R1`: accepted V1/V2 histories, 2B19A1 V3 opportunity, 2B19A2 normal V2 delivery, base Dreamer tenure, current-character state, role-tenure state, accepted impairment aggregate, atomic batch, ledger, Mathematician, projection, and official first-night schedule are reachable accepted dependencies.
- `R1 application path`: an effective base Dreamer with effective Vortox becomes reachable after this Slice. A real accepted Philosopher duplicate-Dreamer stream can also make the base Dreamer DRUNK before effective Vortox settlement; that source-DRUNK path is the only impaired-source accepted-stream authority required here.
- `R2`: accepted legacy Dreamer V1/V2 histories retain byte/shape meaning and are replayed without migration or reinterpretation.
- `R3`: malformed exact shapes, unknown versions, hostile objects, invalid provenance, invalid aggregates, forged V3 facts, partial/reordered batches, and mismatched cross-links fail closed.
- `R4/T3 pure-policy seams`: represented source POISONED, represented current-Vortox DRUNK or POISONED, ineffective Vortox plus impaired source, alignment-only change, and multiple same-Dreamer qualifying facts have no accepted producer in the current repository. Tests for these combinations exercise closed pure domain policy only and do not claim accepted command/event reachability.
- If actual R1 production of any R4/T3 combination is required, stop with `RESLICE_REQUIRED`; adding its producer or lifecycle is outside this Slice.

### Trust boundaries

- `T1`: commands, streams, payloads, stored batches, ledger evidence, and projection inputs require exact runtime, provenance, cross-reference, replay, and prospective validation.
- `T2`: rebuilt plan/progress, opportunity, roster, setup, current-character state, role tenures, impairment aggregate, delivery, settlement, and ledger are canonical derived state only after T1 acceptance.
- `T3`: applicability, candidate selection, typed construction, clone/equality, and pure-policy seam tests are deterministic module logic over validated values. T3 is not public canonical authority.

## Support Matrix

| Settlement condition | Source | Reachability authority | Result |
|---|---|---|---|
| current non-Vortox Demon, source effective | effective | accepted legacy R1 | unchanged normal V2 |
| current non-Vortox Demon, source impaired | DRUNK/POISONED | accepted boundary | unchanged receipt-free unsupported |
| effective current Vortox | effective | R4→R1 application | forced-false V3 plus one abnormal fact |
| effective current Vortox | real Philosopher-produced DRUNK base Dreamer | R4→R1 application | forced-false V3 retaining hidden source impairment evidence |
| effective current Vortox | represented POISONED | R4/T3 seam | same forced-false V3 policy; no accepted-stream claim |
| represented DRUNK or POISONED current Vortox | effective source | R4/T3 seam | unchanged normal V2 policy |
| represented impaired current Vortox | represented impaired source | R4/T3 seam | unchanged receipt-free unsupported policy |
| current No Dashii | any | accepted unresolved boundary | no delivery; unchanged fail-closed result |
| malformed, ambiguous, stale, forged, shortage, or dependency failure | any | T1/R3 | exact failure contract below; zero events |

## Legacy Replay

`DreamerInformationDeliveredPayloadV1` and V2 keep exact enumerable keys, literals, nested shapes, constructor callers, clone/equality behavior, replay meaning, projection output, and ledger meaning. No optional Vortox field is added to V1/V2. The delivery union becomes V1 | V2 | V3 with explicit discrimination. Absent `deliverySchemaVersion` selects V1 only under its existing exact-shape rules; `dreamer-information-delivered-v2` selects V2; `dreamer-information-delivered-v3` selects V3; every other value fails. Legacy V1/V2 stored validation does not require a ledger argument and remains source-compatible.

## Vortox Applicability And Capability Precedence

The existing exported `resolveBaseDreamerV2NormalCapability` remains the only capability resolver. It must:

1. Re-prove complete base Dreamer source provenance from validated plan, progress, V3 opportunity, source contract, roster, current source character state, continuous active source tenure, and source ability instance.
2. Validate the complete impairment aggregate. Undefined means historical-empty only where the accepted model already permits it. Retain zero or one exact source impairment marker without selecting the outcome yet.
3. Resolve exactly one current Demon identity and exact catalog entry.
4. For non-Vortox, preserve 2B19A2 precedence: source impairment, No Dashii unresolved, then normal support.
5. For Vortox, prove exact player, seat, role ID, role catalog identity, continuous active tenure, and settlement revision.
6. With no applicable Vortox impairment, return forced-false support whether the retained Dreamer source is effective, DRUNK, or POISONED.
7. With exactly one valid applicable Vortox impairment, treat Vortox as ineffective: effective source returns normal support; source-impaired Dreamer returns the existing unsupported result.
8. Duplicate, conflicting, malformed, stale, future, overlapping, cross-player, cross-seat, cross-role, cross-tenure, or ambiguous evidence returns `EFFECTIVENESS_UNRESOLVED`.
9. Catch hostile access and thrown dependency behavior at the validation boundary and fail closed.

```ts
export const DREAMER_VORTOX_CONSTRAINT_VERSION =
  "dreamer-vortox-constraint-v1" as const;

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

`VORTOX_FORCED_FALSE_UNSUPPORTED` is removed only from this transient capability union; it was never persisted and has no replay obligation.

## Source Impairment Under Effective Vortox

Effective Vortox never relaxes the false-pair constraint for a represented DRUNK or POISONED Dreamer. V3 stores the exact source impairment identity and kind inside `sourceEffectiveness`; the ledger cross-binds the same marker; projection reveals neither. The terminal cause remains `VORTOX_FALSE_INFORMATION`, not drunkenness or poisoning.

## Ineffective Vortox

Exactly one valid current DRUNK or POISONED impairment bound to the proven Vortox player, role, tenure, seat, and evaluated revision makes Vortox ineffective. An effective Dreamer receives unchanged V2 normal information. An impaired Dreamer remains at the existing retryable receipt-free unsupported boundary. Vortox impairment is forbidden from V3 and from V3 ledger evidence.

## Versioned Delivery

```ts
export const DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION =
  "dreamer-information-delivered-v3" as const;

export type DreamerInformationDeliveredPayloadV3 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion:
    typeof DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly knowledgeModelVersion:
    typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: {
    readonly kind: "VORTOX_FORCED_FALSE";
  };
  readonly sourceEffectiveness: DreamerVortoxSourceEffectiveness;
  readonly vortoxConstraint: DreamerVortoxConstraint;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion:
    typeof DREAMER_FALSE_ROLE_POLICY_VERSION;
};

export type DreamerInformationDeliveredPayload =
  | DreamerInformationDeliveredPayloadV1
  | DreamerInformationDeliveredPayloadV2
  | DreamerInformationDeliveredPayloadV3;
```

The exact 21 top-level enumerable keys are:

```text
deliverySchemaVersion
evilRole
falseRolePolicyVersion
goodRole
informationReliability
knowledgeModelVersion
knowledgeStage
nightNumber
opportunityId
opportunitySchemaVersion
rulesBaselineVersion
sourceCharacterStateRevision
sourceContract
sourceEffectiveness
sourcePlayerId
sourceSeatNumber
targetPlayerId
targetSeatNumber
taskId
taskType
vortoxConstraint
```

Nested exact keys are:

- reliability: `kind`;
- effective source: `kind`;
- impaired source: `kind`, `sourceImpairmentId`, `sourceImpairmentKind`;
- Vortox constraint: `constraintVersion`, `kind`, `vortoxPlayerId`, `vortoxSeatNumber`, `vortoxRoleId`, `vortoxRoleTenureId`, `evaluatedCharacterStateRevision`;
- source contract: unchanged accepted A1 exact keys;
- role snapshot: `roleId`, `characterType`, `defaultAlignment`, `edition`, `setupModifier`;
- setup modifier: `outsiderDelta`, `townsfolkDelta`.

Unknown keys/literals, missing keys, getters, setters, symbols, proxies, cycles, arrays in record positions, nonplain prototypes, nonfinite numbers, and throwing reads fail closed.

## Exact V3 Constructor Contract

The current exported constructor remains source-compatible and unchanged:

```ts
export const createDreamerInformationDeliveredPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: DreamerTargetChosenPayload;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly effectiveness: DreamerEffectivenessResult;
}): DreamerInformationDeliveredPayloadV1 | DreamerInformationDeliveredPayloadV2;
```

It remains the only V1/V2 constructor and cannot create V3.

V3 uses this named exported typed constructor:

```ts
export const createDreamerVortoxInformationDeliveredPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly targetChoice: DreamerTargetChosenPayloadV2;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly capability: Extract<
    BaseDreamerV2NormalCapability,
    { readonly kind: "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED" }
  >;
}): DreamerInformationDeliveredPayloadV3;
```

This constructor accepts no boolean Vortox flag and no `unknown`. It validates the exact target V2 discriminator and source contract; source and target current-state correspondence; exact target settlement role catalog identity; capability revision equality with current state and target choice; source tenure and ability IDs equality with the source contract; Vortox constraint revision equality; nonempty canonical Vortox player/seat/role/tenure; source-effectiveness shape; and the deterministic candidate result. Any mismatch throws `InvalidDreamerInformationDeliveredPayload` before event construction.

## Candidate Policy

Candidates come only from `setup.roleCatalogSnapshot.roles`.

GOOD candidates have native `characterType` in `{TOWNSFOLK, OUTSIDER}` and `roleId` unequal to the target settlement role. EVIL candidates have native `characterType` in `{MINION, DEMON}` and `roleId` unequal to the target settlement role. Native character type controls category; player alignment is irrelevant; in-play roles remain eligible. Sort through existing raw UTF-16 code-unit `compareStableId` and select the first of each category. Catalog input order, runtime locale, `localeCompare`, `Intl.Collator`, time, randomness, UUIDs, and current assignment alignment have no effect. Candidate sets and target truth are not persisted or projected. An empty legal category is `DependencyExecutionFailed` under the failure table.

## Typed Clone And Equality

`cloneDreamerInformationDeliveredPayload` and `sameDreamerInformationDelivery` must have explicit exhaustive V1, V2, and V3 branches after exact discrimination. V3 clone recursively creates fresh objects for `sourceContract`, `informationReliability`, `sourceEffectiveness`, `vortoxConstraint`, both role snapshots, and both setup modifiers. No nested object reference is shared with input. Equality compares every frozen primitive and nested typed field, including exact variant discrimination. V1 never equals V2/V3; V2 never equals V3. Raw or stable `JSON.stringify`, serialized-text comparison, hash-only equality, property enumeration order, and generic object spread as validation are prohibited.

These same typed comparators are the sole equality authority for prepared-vs-prospective target, delivery, capability, constraint, source-effectiveness, and settlement values. Capability equality is an explicit closed variant comparator. Settlement equality compares its exact typed fields. Equality never substitutes for prior shape/provenance validation.

## Exact Stored Validator Contract

The public signature is extended only by one compile-time optional field:

```ts
export const validateStoredDreamerInformationDelivered = (
  payload: unknown,
  sourceFacts: {
    readonly rulesBaselineVersion: string;
    readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
    readonly roster: PlayerRoster;
    readonly firstNightTaskPlan: Pick<FirstNightTaskPlan, "tasks">;
    readonly choices: DreamerTargetChoiceSet | undefined;
    readonly settlement: ScheduledTaskSettlement | undefined;
    readonly firstNightAbilityOutcomeLedger?: FirstNightAbilityOutcomeLedger;
  }
): ValidationResult;
```

The field is optional only for source compatibility of legacy V1/V2 callers. V1/V2 ignore it semantically and retain all existing validation. A stored V3 requires it semantically. V3 validation must:

1. validate exact V3 shape before use;
2. validate the complete ledger shape;
3. locate exactly one ledger fact whose source event/delivery/task/opportunity/source/revision identities match the stored V3;
4. require `ABNORMAL`, `VORTOX_FALSE_INFORMATION`, and `causedByAnotherCharacterAbility=true`;
5. require the exact evidence multiset and order frozen below;
6. independently re-prove candidate selection, target truth exclusion, source/Vortox tenure, source impairment if present, and absence of applicable Vortox impairment from canonical historical facts;
7. reject missing ledger, missing fact, duplicate matching facts, extra cross-linked fact, wrong cause/status/boolean, wrong identity/revision, or any missing/extra/reordered evidence.

Projection passes `state.firstNightAbilityOutcomeLedger` using exactly this field name. No other public validator parameter or generic validation context is introduced.

## Canonical Preparation And Exact Private Flow

The application resolver is called exactly once after deterministic command validation and before metadata generation. It creates this module-private type in `game-application-service.ts`:

```ts
type PreparedBaseDreamerSubmission = {
  readonly kind: "PREPARED_BASE_DREAMER_SUBMISSION";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly expectedGameVersion: number;
  readonly capability: Extract<
    BaseDreamerV2NormalCapability,
    {
      readonly kind:
        | "NORMAL_INFORMATION_SUPPORTED"
        | "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
    }
  >;
  readonly targetChoice: DreamerTargetChosenPayloadV2;
  readonly delivery:
    | DreamerInformationDeliveredPayloadV2
    | DreamerInformationDeliveredPayloadV3;
  readonly settlement: ScheduledTaskSettlement;
};
```

The exact private flow is:

```ts
createBatchOrReject(command, rebuilt, prepared)
createBatch(command, rebuilt, metadata, prepared)
createEvents(command, rebuilt, metadata, prepared)
validateProspectiveBatch(rebuilt, events, prepared)
```

Each receives `prepared: PreparedBaseDreamerSubmission` only on the `SubmitDreamerAction` branch; other command branches keep their existing calls/signatures or an internal optional discriminated parameter without export. Event creation clones the prepared target, delivery, and settlement and may not query state, rerun capability resolution, regenerate candidates, or recompute payloads. `validateProspectiveBatch` rebuilds the prospective prefix, independently invokes the same canonical resolver once from that prefix, reconstructs the unique expected typed preparation, and compares it to `prepared` through the typed comparators. It also validates the exact three events and prospective ledger fact before append. The preparation type is not exported, persisted, projected, stored in `GameState`, or returned from any public API.

## Batch

Success creates exactly `DreamerTargetChosen` V2, `DreamerInformationDelivered` V2 or V3, and `ScheduledTaskSettled`, in that order, under one command ID, one batch ID, one expected version, `batchSize=3`, indexes `0/1/2`, contiguous event sequences, and `FIRST_NIGHT`. No event is appended until dependency, preparation, metadata, and prospective checks all pass. Naked, partial, duplicate, reversed, reordered, gapped, cross-command, cross-batch, wrong-phase, or metadata-mismatched histories fail in batch semantics and rebuild.

## Exact V3 Ledger Contract

A successfully accepted V3 delivery derives exactly one terminal `FirstNightAbilityOutcomeFact` for the Dreamer source with:

```text
outcomeStatus = ABNORMAL
causeKind = VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility = true
```

The existing closed evidence vocabulary remains unchanged. The evidence array has exactly 10 entries for an effective source and exactly 11 for a source-impaired V3. Its exact canonical order is:

1. one `SOURCE_EVENT`, bound to the V3 `DreamerInformationDelivered` envelope ID, type, sequence, command, batch, and index;
2. one `TASK`, bound to the unique planned base Dreamer task;
3. one `ACTION_OPPORTUNITY`, bound to the exact V3 opportunity and source contract;
4. zero or one `ABILITY_IMPAIRMENT`, present iff `sourceEffectiveness.kind="SOURCE_REPRESENTED_IMPAIRED"`, bound to that exact Dreamer source impairment ID/kind/player/role/tenure/revision;
5. exactly two `ROLE_TENURE` entries, one Dreamer source tenure and one Vortox tenure, sorted by `roleTenureId` with `compareStableId`;
6. one `CHARACTER_STATE`, bound to the settlement revision represented by target choice, delivery, capability, and Vortox constraint;
7. exactly three `PLAYER_ROLE_AT_REVISION` entries—Dreamer source, target, and Vortox—sorted by the evidence variant's existing canonical primary identity comparator and then stable ID tie-breakers;
8. one `DREAMER_DELIVERY`, bound to the complete exact V3 payload.

No other ordering is accepted. No extra or duplicate evidence is accepted. The Dreamer role evidence binds source player, seat, role `dreamer`, source tenure, source ability instance, and revision. Target role evidence binds target player/seat and the settlement-time true catalog role that both delivered roles exclude. Vortox role evidence binds `vortoxConstraint.vortoxPlayerId`, seat, literal role `vortox`, tenure ID, and evaluated revision. The optional impairment evidence binds only the Dreamer source and exactly matches `sourceEffectiveness`; Vortox impairment evidence is forbidden.

Omission of Vortox impairment evidence is not proof of effectiveness. Derivation, prospective validation, replay, and stored validation must re-evaluate the complete canonical impairment aggregate at the historical revision and prove zero applicable Vortox impairments. Missing aggregate where the accepted historical-empty rule does not apply, or any malformed/duplicate/conflicting/stale/cross-linked Vortox marker, rejects V3. Settlement closes the opportunity/task chain and creates no second terminal fact.

## Mathematician

No Mathematician production file changes. Fresh official Mathematician evidence proves that Vortox-forced false Dreamer information is abnormal because another character's ability made the Dreamer ability fail to work as intended. A completed V3 therefore contributes the Dreamer `sourcePlayerId` once to a later first-night true count. Two false role fields are not two affected players; source impairment is not an extra cause/player; multiple qualifying same-source facts deduplicate to one player. Normal Dreamer V1/V2 remains excluded because one-correct/one-false is its intended behavior. Accepted window, own-ability, duplicate-holder, and numeric-domain policies remain separate and unchanged. Official/Chinese example false outputs are not made into a new algorithm.

## Projection

The only projection production edit is in `packages/projections/src/index.ts`: pass `firstNightAbilityOutcomeLedger: state.firstNightAbilityOutcomeLedger` to the stored validator. Output shape is unchanged. Only the source player and that player's AI view receive the existing historical target, GOOD role, EVIL role, and knowledge metadata. Other players and AI views omit them. Reliability, Vortox identity/tenure/constraint, impairments, target truth, candidates, ledger cause/evidence, assignments, and current state never leak. Projection validates stored history and never recomputes delivery from later state.

## Replay

Rebuild validates exact V3 shape, exact three-event batch, source/target/Vortox provenance, unique deterministic pair, capability at the historical revision, absence of Vortox impairment, exact closed ledger fact/evidence, settlement, and opportunity closure. Accepted replay produces identical target, delivery, settlement, ledger, and private knowledge. Later character/alignment/impairment/Demon changes do not rewrite historical knowledge. Unknown schemas, hostile objects, forged accepted-history provenance, malformed ledger, and incomplete/reordered batches fail closed.

## Exact Failure And Receipt Contract

All failed rows produce zero domain events, no settlement, no ledger fact, unchanged game version, and leave the opportunity `OPEN`. `Failed` results are retryable and never saved as command receipts, so they do not consume the command ID. A successful retry with the same command ID after dependency repair creates the deterministic three-event batch. Only deterministic command rejection is receipt-bearing.

| Boundary | Exact result | failureStage | retryable | receipt / command ID | actor-safe message |
|---|---|---|---|---|---|
| deterministic command rejection after canonical validation, such as wrong expected version, closed/wrong opportunity, self-target, or out-of-order task | existing `rejected` code for the specific validation | none | false | rejection receipt saved; command ID consumed idempotently | existing fixed validation message |
| supported command but unchanged unsupported source condition: source impaired without effective Vortox, No Dashii unresolved, or ineffective Vortox plus impaired source | `ApplicationNotConfigured` | `first-night-role-action` | true | no receipt; not consumed | fixed generic unsupported-capability message |
| applicability/provenance conflict, missing canonical facts, malformed aggregate, ambiguous Vortox, or inability to prove capability | `DependencyExecutionFailed` | `first-night-role-action` | true | no receipt; not consumed | fixed generic capability-unavailable message; no hidden identity/details |
| empty deterministic GOOD or EVIL candidate set | `DependencyExecutionFailed` | `first-night-role-action` | true | no receipt; not consumed | fixed generic canonical-result-unavailable message |
| constructor, typed preparation, or dependency call throws before metadata | `DependencyExecutionFailed` | `first-night-role-action` | true | no receipt; not consumed | contained actor-safe dependency message |
| prospective batch, typed equality, ledger, or replay validation fails | `DependencyExecutionFailed` | `prospective-validation` | true | no receipt; not consumed | contained actor-safe prospective-validation message |
| batch/event ID or clock metadata generation fails | `MetadataGenerationFailed` | `event-metadata` | true | no receipt; not consumed | existing contained metadata message |
| atomic event-store append fails | `EventStoreAppendFailed` | `accepted-commit` | true | no success receipt; not consumed | existing contained append message |
| dependency throws an unknown non-DomainError during the V3 decision path | `DependencyExecutionFailed` | `first-night-role-action` | true | no receipt; not consumed | generic unknown dependency failure; no stack, secret, canonical marker, or hidden role evidence |
| successful recovery with the identical command ID and unchanged canonical inputs | existing accepted result | none | false | one accepted receipt after append; command ID consumed then | normal accepted result |

Metadata generation is not folded into dependency failure. Append failure is not represented as prospective failure. No retryable result may be written as a receipt. No failed attempt may burn batch/event IDs as canonical history; generated transient IDs are discarded and success is judged only by accepted events and receipt.

## Exact Production Allowlist

Only these five production files may change:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

No `events.ts`, `event-applier.ts`, `game-state.ts`, `rebuild.ts`, public contract, workflow, dependency, timeout, configuration, or new production file is allowed. The non-binding implementation estimate is `650-1000` added production LOC. The binding gate has no minimum: no more than `1200` added production LOC and no production file outside this list. Any sixth production file requires stop and fresh design review.

## Test And Support Allowlist

Primary tests may change only:

- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

Immutable fixtures/support may be added only beside an authorized test or under the existing test fixture location. Control/documentation edits may touch only the Slice evidence/design/review/status/traceability documents, `docs/rules/ROLE_COVERAGE_MATRIX.md`, `docs/agent-loop/CURRENT_TASK.md`, `docs/agent-loop/PROJECT_STATE.md`, `docs/agent-loop/AUTOPILOT_STATE.json`, and `docs/agent-loop/AUTOPILOT_LOG.md`. The correct control path is `docs/agent-loop/PROJECT_STATE.md`; `docs/PROJECT_STATE.md` is forbidden.

## Authority Test Map C01-C53

Each ID is unique and has one primary authority. A pure seam proves policy only; it must not be labeled accepted-stream integration.

| ID | Frozen assertion | Reachability / layer | Primary file |
|---|---|---|---|
| `2B19A3-C01` | V1 exact payload/replay/projection unchanged | R1 / legacy compatibility | `dreamer.test.ts` |
| `2B19A3-C02` | V2 exact payload/replay/projection unchanged | R1 / legacy compatibility | `dreamer.test.ts` |
| `2B19A3-C03` | old V1/V2 constructor signature and callers remain unchanged | R1 / compile-runtime contract | `dreamer.test.ts` |
| `2B19A3-C04` | real base command reaches effective-Vortox V3 success | R4→R1 / accepted stream | `game-application-service.test.ts` |
| `2B19A3-C05` | V3 contains exactly one native GOOD and one native EVIL catalog role | R4→R1 / accepted stream | `game-application-service.test.ts` |
| `2B19A3-C06` | GOOD target truth is excluded from both fields | R4/T3 / pure policy | `dreamer.test.ts` |
| `2B19A3-C07` | EVIL target truth is excluded from both fields | R4/T3 / pure policy | `dreamer.test.ts` |
| `2B19A3-C08` | stable ordering ignores catalog order and locale | R4/T3 / pure policy | `dreamer.test.ts` |
| `2B19A3-C09` | legal in-play roles remain eligible | R4/T3 / pure policy | `dreamer.test.ts` |
| `2B19A3-C10` | candidate shortage has exact dependency/no-receipt/no-append result | R4→R1 / application failure | `game-application-service.test.ts` |
| `2B19A3-C11` | Vortox catalog/player/seat/tenure/revision cross-bind exactly | R4/T3 / structural policy | `dreamer.test.ts` |
| `2B19A3-C12` | missing Vortox tenure fails closed | R3 / hostile replay | `rebuild.test.ts` |
| `2B19A3-C13` | duplicate/conflicting/cross-linked Vortox tenure fails closed | R3 / hostile replay | `rebuild.test.ts` |
| `2B19A3-C14` | stale/ended/future/discontinuous Vortox tenure fails closed | R3 / hostile replay | `rebuild.test.ts` |
| `2B19A3-C15` | zero Vortox impairment activates V3 | R4→R1 / application | `game-application-service.test.ts` |
| `2B19A3-C16` | represented DRUNK Vortox returns effective source to exact V2 | R4/T3 / pure policy seam | `dreamer.test.ts` |
| `2B19A3-C17` | represented POISONED Vortox returns effective source to exact V2 | R4/T3 / pure policy seam | `dreamer.test.ts` |
| `2B19A3-C18` | malformed/duplicate/conflicting/stale Vortox impairment fails closed | R3 / hostile replay | `rebuild.test.ts` |
| `2B19A3-C19` | real Philosopher-produced DRUNK base Dreamer plus effective Vortox yields false V3 | R4→R1 / accepted stream | `game-application-service.test.ts` |
| `2B19A3-C20` | represented POISONED source plus effective Vortox stays false | R4/T3 / pure policy seam | `dreamer.test.ts` |
| `2B19A3-C21` | source impairment is retained canonically and hidden | R4→R1 / projection | `private-knowledge-view.test.ts` |
| `2B19A3-C22` | ineffective Vortox plus impaired source stays unsupported | R4/T3 / pure policy seam | `dreamer.test.ts` |
| `2B19A3-C23` | pre-settlement target change changes excluded truth | R4→R1 / accepted stream | `game-application-service.test.ts` |
| `2B19A3-C24` | post-delivery change cannot rewrite knowledge | R1 / projection | `private-knowledge-view.test.ts` |
| `2B19A3-C25` | alignment-only change does not affect native-category legality | R4/T3 / pure policy seam | `dreamer.test.ts` |
| `2B19A3-C26` | success is exact target-V2/delivery-V3/settlement atomic batch | R4→R1 / accepted stream | `game-application-service.test.ts` |
| `2B19A3-C27` | partial/reordered/cross-batch histories reject | R3 / hostile batch | `domain-batch-semantics.test.ts` |
| `2B19A3-C28` | accepted V3 replay rebuilds identical state | R4→R1 / accepted replay | `rebuild.test.ts` |
| `2B19A3-C29` | V3 creates one exact abnormal Vortox fact for Dreamer source | R4→R1 / ledger | `first-night-ability-outcome-ledger.test.ts` |
| `2B19A3-C30` | exact 10/11-entry multiset and order are mandatory | R3 / ledger structural | `first-night-ability-outcome-ledger.test.ts` |
| `2B19A3-C31` | settlement creates no second terminal fact | R4→R1 / accepted stream | `game-application-service.test.ts` |
| `2B19A3-C32` | later Mathematician true count includes V3 source once | R4→R1 / accepted stream | `mathematician-information.test.ts` |
| `2B19A3-C33` | impossible multiple same-source V3 facts deduplicate to one player | R4/T3 / pure policy seam | `mathematician-information.test.ts` |
| `2B19A3-C34` | only source player/AI receives pair and no hidden fact leaks | R4→R1 / projection | `private-knowledge-view.test.ts` |
| `2B19A3-C35` | first-night order remains Dreamer 61/80 between Clockmaker and Seamstress; no Vortox wake | R1 / schedule | `dreamer.test.ts` |
| `2B19A3-C36` | exact frozen HEAD passes Ubuntu and Windows gates | R4→R1 / CI | `.github/workflows/ci.yml` |
| `2B19A3-C37` | V3 exact 21-key/nested hostile-object schema rejects mutations | R3 / structural validation | `dreamer.test.ts` |
| `2B19A3-C38` | validated normal Dreamer fact remains excluded from Mathematician | R1 / accepted stream | `mathematician-information.test.ts` |
| `2B19A3-C39` | real Dreamer-to-terminal-Seamstress continuation remains accepted | R4→R1 / accepted stream | `game-application-service.test.ts` |
| `2B19A3-C40` | new typed V3 constructor has the exact signature and rejects mismatched capability/provenance | R4/T3 / constructor contract | `dreamer.test.ts` |
| `2B19A3-C41` | stored V3 requires a valid ledger while unchanged V1/V2 callers do not | R3 / stored validation | `dreamer.test.ts` |
| `2B19A3-C42` | stored V3 rejects missing, duplicate, mismatched, cross-linked, or wrong-cause ledger facts | R3 / stored validation | `first-night-ability-outcome-ledger.test.ts` |
| `2B19A3-C43` | V1/V2/V3 clone and equality branches are exhaustive, typed, and reference-independent | R2/R3 / typed structural contract | `dreamer.test.ts` |
| `2B19A3-C44` | application resolves capability/candidates once and event creation consumes exact private preparation | R4→R1 / application | `game-application-service.test.ts` |
| `2B19A3-C45` | prospective validation independently resolves and typed-compares the exact preparation | R3 / prospective validation | `domain-batch-semantics.test.ts` |
| `2B19A3-C46` | applicability/provenance conflict has exact dependency/no-receipt/no-ID/no-append result | R4→R1 / application failure | `game-application-service.test.ts` |
| `2B19A3-C47` | injected prospective failure has exact code/stage/no-receipt/no-append result | R4→R1 / injected failure | `game-application-service.test.ts` |
| `2B19A3-C48` | injected metadata failure remains `MetadataGenerationFailed/event-metadata` | R4→R1 / injected failure | `game-application-service.test.ts` |
| `2B19A3-C49` | injected append failure remains `EventStoreAppendFailed/accepted-commit` with no receipt | R4→R1 / injected failure | `game-application-service.test.ts` |
| `2B19A3-C50` | injected dependency exception is contained as retryable first-night-role-action failure | R4→R1 / injected failure | `game-application-service.test.ts` |
| `2B19A3-C51` | identical command ID succeeds after dependency recovery with deterministic three-event batch | R4→R1 / recovery | `game-application-service.test.ts` |
| `2B19A3-C52` | diff contains only five production files, correct control paths, and at most 1200 added production LOC with no minimum | governance / static gate | implementation self-check |
| `2B19A3-C53` | every V3 failure and view is actor-safe and leaks no hidden Vortox/source evidence | T1 / security boundary | `private-knowledge-view.test.ts` |

## Supporting Authorities S01-S13

| ID | Supporting assertion |
|---|---|
| `2B19A3-S01` | Mutate every V3 top-level and nested key/literal/type; getters, proxies, symbols, cycles, sparse arrays, and nonplain records reject without escaping exceptions. |
| `2B19A3-S02` | Cross-link every task, opportunity, source, target, seat, revision, role, tenure, impairment, constraint, delivery, settlement, source-event, command, and batch identity; each mutation rejects. |
| `2B19A3-S03` | Clone each V1/V2/V3 and prove no shared nested references; mutate clone/input independently; cross-version equality is false. |
| `2B19A3-S04` | Compile-time `satisfies` fixtures prove unchanged V1/V2 constructor callers and exact new V3 constructor input/output; runtime invalid inputs reject. |
| `2B19A3-S05` | Remove, duplicate, add, reorder, or substitute each of the exact 10/11 ledger evidence entries and require rejection. |
| `2B19A3-S06` | Effective and real source-DRUNK positive V3 facts validate; source-POISONED validates only through the pure seam; a Vortox-impairment omission cannot forge effective V3. |
| `2B19A3-S07` | Instrument resolver/candidate constructor to prove one application evaluation; event construction performs no second state query or generation. |
| `2B19A3-S08` | Corrupt each prepared field and prove typed prospective comparison rejects; static scan prohibits `JSON.stringify` equality. |
| `2B19A3-S09` | For candidate, applicability, prospective, metadata, append, and dependency failures assert exact status/code/stage/retryability, no receipt, no accepted ID use, zero events, unchanged version, OPEN opportunity, no settlement, and no ledger fact. |
| `2B19A3-S10` | Retry every injected failure with identical command ID after repair; exactly one accepted receipt and deterministic three-event batch result. |
| `2B19A3-S11` | Real accepted Philosopher duplicate-Dreamer → effective Vortox → Dreamer V3 stream is built through commands/events, never by injecting a constructed state; pure seams carry explicit R4/T3 labels. |
| `2B19A3-S12` | Static diff scan proves exact production/test/control allowlists, correct `docs/agent-loop/PROJECT_STATE.md`, no `docs/PROJECT_STATE.md`, no forbidden API/state/event/evidence surface, and added production LOC ≤1200 with no minimum assertion. |
| `2B19A3-S13` | A live non-eager application capture strictly equals an immutable accepted-stream fixture, replays identically, continues to Seamstress, and projects only source-private knowledge. |

## Rule Traceability

- C04-C09, C15-C25, C29-C35, and C37 bind to refreshed Dreamer/Vortox evidence.
- C29 and C32 bind directly to official Mathematician oldid 3109 and Chinese 数学家 oldid 6214: false information that was supposed to include a correct role worked abnormally due to Vortox; count the affected Dreamer player once.
- C33 binds to the official player-count wording plus the Chinese same-player maximum-one-reminder explanation; it remains a pure policy seam because the repository cannot produce duplicate same-base-Dreamer facts.
- C38 binds to official Dreamer intended one-correct/one-false behavior plus official Mathematician normal-working exclusion.
- Mathematician window, own-ability exclusion, duplicate-holder ordering, and `0..11` false-number selection remain approved simulator policies and are not misrepresented as external rules.

## CI

Use Node `24.15.0`, pnpm `11.7.0`, and the frozen lockfile. Run file-scoped Vitest for every changed test file and ESLint for every changed TypeScript file, then `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:coverage`. The accepted single-fork coverage configuration remains unchanged. The final frozen product HEAD must pass required Ubuntu ordinary/single-fork coverage and Windows deterministic jobs. CI is commit-specific and cannot be inherited from accepted base run `29505429489`.

## Documentation

After implementation, create/update the Slice status and complete C01-C53/S01-S13 traceability; update the PR rule sections; update `docs/rules/ROLE_COVERAGE_MATRIX.md` only to record this Slice as `PARTIAL / VORTOX_FORCED_FALSE_ONLY`; preserve Dreamer `PARTIAL`, Vortox `NOT_STARTED`, and Mathematician `PARTIAL`. Control files must preserve exact evidence/design/review hashes and separate product-head, merge, and closeout CI provenance. Until independent Round 2 review passes, control state stays `ruleDesignPass=false` and `implementationAuthorized=false`.

## Rollback

Before publication, revert only Slice implementation/test/status changes while preserving governance, refreshed evidence, immutable Round 1 design/review, and this Round 2 audit chain. After publication, use a normal attributed revert; never rewrite accepted history or force-push. V1/V2 need no migration because V3 is additive. If producer support is removed, accepted V3 history must not be silently treated as V2 and requires explicit compatibility review.

## Explicit Out Of Scope

- non-effective-Vortox DRUNK/POISONED Dreamer information generation;
- a producer for source POISONED or current-Vortox DRUNK/POISONED;
- generic impairment, alignment, character-change, death, or effect lifecycle;
- No Dashii adjacency/poisoning derivation;
- Philosopher-gained Dreamer settlement;
- Storyteller free pair choice or candidate/final-choice persistence;
- Traveller targets, registration, Spy, Recluse, or misregistration;
- other-night Dreamer/Vortox/Mathematician behavior;
- Vortox action or complete Vortox implementation;
- changing Mathematician production, timing window, own-ability, duplicate-holder, or numeric/false-number policy;
- treating official `4` or Chinese `3` as a mandatory false number;
- new events, event names, top-level GameState fields, generic evidence kinds, public preparation/result APIs, projection fields, workflow, dependency, timeout, or CI configuration;
- FIRST_NIGHT completion, DAY, Phase 2C, Slice 2B19A4, 2B19B, or any next Slice;
- promoting Dreamer, Vortox, or Mathematician coverage beyond the frozen statuses.

## Completion Criteria

1. Exact materialized Round 2 receives independent `RULE_DESIGN_PASS` before any production/test edit.
2. Refreshed evidence hash is exactly `798c5d2edeb7053e9cd720937e15785492ce214b87f7975f9a66cc9b056947c6`, verdict `RULE_READY`, conflicts empty.
3. All reachability labels are honest; only effective source and real Philosopher-produced source DRUNK claim accepted-stream authority.
4. V1 and V2 exact constructors, shapes, replay, equality, ledger meaning, and projection remain unchanged.
5. V3 constructor, payload, 21-key set, nested keys, reliability, source-effectiveness, and seven-key constraint match this document exactly.
6. Candidate selection uses native types, excludes target truth twice, allows in-play roles, and uses `compareStableId` only.
7. Existing resolver is the only capability API and follows the frozen precedence.
8. Vortox effectiveness requires exact identity/tenure/revision plus complete impairment proof; omission is not proof.
9. Effective Vortox plus effective/DRUNK/POISONED source follows frozen V3 policy; ineffective Vortox follows frozen normal/unsupported policy.
10. Stored validator adds only optional `firstNightAbilityOutcomeLedger`; V3 requires it semantically and V1/V2 remain source-compatible.
11. Clone/equality is typed, exhaustive, reference-independent, and uses no serialization.
12. Private preparation has exactly the frozen fields and flow; resolver runs once in application, event creation does not recompute, prospective validation independently re-resolves and typed-compares.
13. Success appends exactly target V2, delivery V3, settlement with exact atomic metadata.
14. V3 creates exactly one abnormal Vortox fact with exact 10/11-entry evidence multiset/order; no extra fact or Vortox impairment evidence.
15. Mathematician production is unchanged; V3 source counts once; normal Dreamer remains excluded.
16. Projection shape is unchanged, source-private only, and leaks none of the frozen hidden facts.
17. All failure rows have exact result/stage/retryability/receipt/event/version/opportunity/settlement/ledger behavior and same-command recovery.
18. C01-C53 and S01-S13 all pass in their frozen primary/support layers.
19. Production diff is exactly within the five-file allowlist and added production LOC is at most 1200; there is no minimum.
20. No forbidden production/control path or surface is changed.
21. Targeted tests/lint and all four full gates pass.
22. Exact frozen product HEAD passes required Ubuntu and Windows CI.
23. Complete independent final review returns `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS`, `remainingBlockers=[]`, for exact PR HEAD.
24. Both complete verbatim GitHub audit comments are re-read and verified against exact PR HEAD before merge.
25. Role coverage remains Slice `PARTIAL / VORTOX_FORCED_FALSE_ONLY`, Dreamer `PARTIAL`, Vortox `NOT_STARTED`, Mathematician `PARTIAL`.
26. Final reviewed HEAD equals PR HEAD and worktree is clean.

## Coverage Status

On acceptance, Slice 2B19A3 is `PARTIAL / VORTOX_FORCED_FALSE_ONLY`. Dreamer remains `PARTIAL` because impaired non-Vortox information, gained Dreamer, other-night behavior, lifecycle, registration, Storyteller choice, and later interactions remain incomplete. Vortox remains `NOT_STARTED` because this Slice consumes one bounded continuous constraint rather than implementing the role. Mathematician remains `PARTIAL` because production is unchanged and only accepted consumption is regression-tested. FIRST_NIGHT remains incomplete.

## Stop Conditions

Stop immediately and report the exact blocker without implementation or inference if evidence/hash changes; rule conflict appears; review is not `RULE_DESIGN_PASS`; an R4/T3 seam needs an accepted producer; exact tenure/impairment state cannot prove precedence; V3 needs a new event, GameState field, evidence kind, projection field, public preparation API, or sixth production file; typed prospective equality cannot share the canonical resolver; V1/V2 compatibility weakens; Mathematician production must change; added production LOC exceeds 1200; any forbidden file/path is required; repeated gates fail; exact-head CI is unavailable/red; final review is incomplete/non-passing; audit comments mismatch PR HEAD; or unexplained worktree changes appear.

No production/test edit, implementation authorization, branch publication, commit, push, PR creation, merge, next Slice, or coverage promotion is authorized by this document alone.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_2
