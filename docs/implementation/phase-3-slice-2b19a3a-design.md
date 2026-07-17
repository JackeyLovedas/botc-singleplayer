# Phase 3 Slice 2B19A3A — Effective Base Dreamer + Effective Vortox Forced-False Information Design Round 1

## Authority Metadata

- sliceId: `2B19A3A`
- authorization: `USER_AUTHORIZED_2B19A3_RESLICE_TO_ACCEPTED_STREAM_EFFECTIVE_VORTOX_ONLY`
- designRound: `1 / 2`
- acceptedMain: `d5d007ff9b9b7140a3552d076a53330893a3201d`
- acceptedMainCI: `29553826536 / SUCCESS`
- governance: `docs/architecture/2B19A3A-go-no-go-under-governance-v1.md`
- governanceSha256: `ccb73944855c4eb110335462aba32865cb5dbd357db2733dfae6e2b1980426f9`
- governanceVerdict: `GO`
- ruleEvidence: `docs/rules/evidence/2B19A3A.md`
- ruleEvidenceSha256: `2da6b7c9d6fea31bbab05674ac3e6a45213257c7af314f66d47eb4a8436f84b6`
- ruleReady: `true`
- ruleResearchVerdict: `RULE_READY`
- unresolvedConflicts: `[]`
- coverageStatus: `PARTIAL / EFFECTIVE_SOURCE_VORTOX_FALSE_ONLY`
- DreamerRoleCoverage: `PARTIAL`
- VortoxRoleCoverage: `NOT_STARTED`
- MathematicianRoleCoverage: `PARTIAL`
- ruleDesignPass: `false`
- implementationAuthorized: `false`
- expectedProductionFiles: `5`
- expectedAddedProductionLoc: `700-950`
- bindingDesignCeiling: exactly the five-file production allowlist below and no more than `1000` added production LOC

This is one complete standalone candidate implementation authority. It is not an addendum to the archived 2B19A3 designs. It authorizes only independent rule-design review. No production code, test, feature commit, push, PR, merge, next Slice, or coverage promotion is authorized until this exact materialized document receives `RULE_DESIGN_PASS`.

## scope

Slice 2B19A3A adds one success branch to the accepted base Dreamer first-night action. At settlement, the existing canonical capability path must prove all of the following from the complete canonical state: the source is the unique current base Dreamer bound to the accepted V3 opportunity and active Dreamer tenure; the source has no applicable represented impairment; exactly one current Demon exists and is the catalog-bound Vortox; Vortox has one continuous active canonical tenure; and the complete represented impairment aggregate has no applicable Vortox impairment.

That branch produces a deterministic false Dreamer pair: exactly one native GOOD character and one native EVIL character, with neither role equal to the target's settlement-time true character. It commits the existing `DreamerTargetChosen` V2, a new additive `DreamerInformationDelivered` V3, and the existing `ScheduledTaskSettled` event atomically. Replay derives exactly one `ABNORMAL / VORTOX_FALSE_INFORMATION / causedByAnotherCharacterAbility=true` outcome fact using only existing evidence variants. Existing Mathematician consumption counts the Dreamer source once. Only accepted-stream player and AI private projection may expose the historical target and pair.

The Slice does not implement source-impaired Dreamer information, impaired-Vortox accepted behavior, No Dashii poisoning, gained Dreamer, free Storyteller selection, other-night behavior, or general effect infrastructure.

## governanceClassification

The single primary risk is `EFFECTIVE_VORTOX_FALSE_INFORMATION_FOR_EFFECTIVE_BASE_DREAMER`.

- `R1_CURRENTLY_REACHABLE_ACCEPTED_STREAM`: effective base Dreamer plus effective current Vortox is already reachable to the current unsupported command boundary and is the sole new success.
- `R1_REACHABLE_BUT_EXPLICITLY_UNSUPPORTED`: accepted Philosopher duplicate-Dreamer behavior can make the base Dreamer DRUNK before the Vortox settlement. It must remain retryable, receipt-free, zero-event, and leave the opportunity OPEN.
- `R2_LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`: Dreamer V1, the 2B19A1 V2 opportunity foundation, and the 2B19A2 normal V2 delivery retain their exact accepted meanings.
- `R3_HOSTILE_OR_CORRUPTED_HISTORY`: malformed V3 values, invalid provenance, wrong Vortox identity/tenure/revision, truth-containing pairs, malformed batches, forged ledger facts, state-only V3 projection, and candidate shortage through a substituted catalog.
- `R4_FUTURE_HYPOTHETICAL_STATE`: source POISONED, current-Vortox DRUNK or POISONED, ineffective Vortox plus impaired source, No Dashii derivation, gained Dreamer, other-night, and general lifecycle behavior have no accepted producer. A test may exercise only a clearly labeled pure seam and may not claim accepted-stream authority.

The implementation must not relabel an R3 mutation as an accepted stream or an R4 seam as a current producer.

## actualReachability

The sole R1 success chain is:

1. accepted V2 task plan contains the base Dreamer task;
2. accepted actionable `DREAMER_FIRST_NIGHT_ACTION_V3` opportunity is OPEN;
3. source contract, current source, source role catalog entry, active Dreamer tenure, and base ability-instance ID cross-bind exactly;
4. complete represented impairment state contains zero applicable source markers;
5. current character state contains exactly one Demon, whose exact catalog role is `vortox`;
6. one active Vortox tenure is continuous through the evaluated revision;
7. complete represented impairment state contains zero applicable Vortox markers;
8. target is another modeled player and has one exact settlement-time catalog role;
9. deterministic false GOOD and EVIL candidates exist;
10. target V2, delivery V3, and settlement append atomically;
11. replay derives one Vortox-caused abnormal Dreamer fact;
12. later Mathematician consumption and accepted-stream private projections consume existing contracts.

Source DRUNK plus effective Vortox stops at step 4. Source POISONED and applicable current-Vortox impairment have no accepted producer. A legal accepted 12-player catalog has sufficient candidates, so shortage is R3 rather than an accepted R1 scenario.

## trustBoundaries

- `T1_EXTERNAL_OR_PERSISTED_BOUNDARY`: `SubmitDreamerAction`, V3 payloads, event envelopes, accepted streams, and projection viewer identities. These require exception-safe exact-shape, canonical-ID, provenance, atomic-batch, replay, and actor-safe validation.
- `T2_CANONICAL_DERIVED_STATE`: state rebuilt from an accepted complete-batch prefix, event-applier state immediately before delivery, current characters, unique current Demon, Dreamer and Vortox tenures, complete represented impairments, role catalog, plan/progress, open opportunity, target choice, and derived ledger.
- `T3_MODULE_PRIVATE_PURE_CORE`: candidate filtering, `compareStableId` ordering, typed construction, exact variant cloning, and typed equality. T3 consumes validated values only and never accepts a caller-supplied absence assertion.

Absence of a Vortox impairment is proved only at T2. It is not a V3 field, evidence record, public applicability context, or caller option.

## legacyReplay

`DreamerInformationDeliveredPayloadV1` and V2 retain every exact enumerable key, nested shape, literal, constructor signature, equality meaning, clone behavior, replay meaning, ledger meaning, and projection output. `dreamer-information-delivered-v2` is not modified. No optional Vortox field is added to V1 or V2.

Delivery discrimination is closed:

- no own `deliverySchemaVersion`: V1 under existing exact-shape rules;
- `dreamer-information-delivered-v2`: V2;
- `dreamer-information-delivered-v3`: V3;
- every other value: fail closed.

Legacy V1/V2 stored validation and state-only projection remain source-compatible. V3 is additive and never reinterprets legacy history.

## effectiveSourceBoundary

The existing exported `resolveBaseDreamerV2NormalCapability` remains the only capability resolver; no second public resolver or generic context is added. Its source checks and source-impairment precedence stay first.

The transient capability union removes only the never-persisted `VORTOX_FORCED_FALSE_UNSUPPORTED` branch and adds this branch:

```ts
export type DreamerVortoxConstraint = {
  readonly constraintVersion: typeof DREAMER_VORTOX_CONSTRAINT_VERSION;
  readonly kind: "VORTOX_FORCED_FALSE_REQUIRED";
  readonly vortoxPlayerId: PlayerId;
  readonly vortoxSeatNumber: SeatNumber;
  readonly vortoxRoleId: "vortox";
  readonly vortoxRoleTenureId: RoleTenureId;
  readonly evaluatedCharacterStateRevision: number;
};

export type BaseDreamerV2NormalCapability =
  | {
      readonly kind: "NORMAL_INFORMATION_SUPPORTED";
      readonly evaluationModelVersion:
        typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
    }
  | {
      readonly kind: "VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
      readonly evaluationModelVersion:
        typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
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

A source marker returns `SOURCE_REPRESENTED_IMPAIRED` before Vortox success is considered. The accepted source-DRUNK path therefore remains unsupported and cannot produce V2 or V3. Source POISONED has the same pure classification but no accepted producer. Missing, malformed, duplicate, stale, future, cross-player, cross-seat, cross-role, cross-tenure, or conflicting source facts return the existing unresolved branch and never success.

## vortoxApplicability

Add exactly:

```ts
export const DREAMER_VORTOX_CONSTRAINT_VERSION =
  "dreamer-vortox-constraint-v1" as const;
```

After effective source proof, the resolver must:

1. find exactly one current `characterType="DEMON"` entry;
2. require its complete role snapshot to equal one catalog entry;
3. retain the accepted No Dashii unresolved branch;
4. if the Demon is not Vortox, retain normal V2 support;
5. for Vortox, find exactly one active `roleId="vortox"` tenure for the same player and seat at `currentCharacterState.revision`;
6. require the tenure to be continuous from acquisition through that revision;
7. validate the complete exact represented impairment aggregate before filtering;
8. filter only markers bound to that exact Vortox player, seat, complete role snapshot, tenure interval, and revision interval;
9. return forced-false support only when the filtered set is empty;
10. return `VORTOX_EFFECTIVENESS_CONFLICT` for malformed, duplicate, ambiguous, or multiple applicable markers.

The supported branch freezes `vortoxConstraint` from positive canonical facts only. `evaluatedCharacterStateRevision` equals the capability revision and the target/delivery settlement revision. `parseRoleTenureId(vortoxRoleTenureId)` must return `valid=true`, `roleId="vortox"`, and the same seat. No field asserts no impairment.

Exactly one valid applicable Vortox marker must not produce V3. The existing non-V3 pure-seam behavior is preserved without claiming current accepted coverage; this Slice adds no producer, delivery semantics, or coverage for impaired Vortox.

## acceptedStreamPreStateProof

A half-batch prefix ending after `DreamerTargetChosen` is not accepted history and must not be rebuilt independently. The non-circular authority is exactly:

1. rebuild the maximal accepted complete-batch prefix immediately before the Dreamer batch;
2. validate the complete proposed three-event batch against that canonical batch-start state;
3. during full replay, apply the already validated `DreamerTargetChosen`;
4. immediately before applying V3 delivery, run the same capability resolver against the event-applier pre-event state;
5. reconstruct the expected V3 from that state and compare every typed field;
6. apply delivery and settlement;
7. derive and validate the outcome fact from the same canonical pre-delivery state.

Target choice changes no current character, Demon identity, tenure, impairment, or catalog fact, so the batch-start and pre-delivery applicability inputs are identical. Neither authority trusts the delivery, a latest state, caller context, or negative absence flag.

`validateDomainBatchSemantics` supplies the complete-batch prospective authority. Existing per-event validation invoked by `applyDomainEvent` supplies the pre-delivery replay authority. `rebuild.ts` and `event-applier.ts` require no production edit.

## storedShapeBoundary

The public signature of `validateStoredDreamerInformationDelivered` remains unchanged. It does not gain a ledger, state, impairment, applicability, or context parameter.

For V3 it validates only:

- exception-safe exact V3 and nested shapes;
- supported constants and primitive domains;
- canonical base source contract and canonical IDs;
- exact catalog membership and native GOOD/EVIL categories;
- distinct GOOD/EVIL role IDs;
- one matching planned base Dreamer task and historical roster source/target;
- one exact target V2 choice with the same source contract, source, target, opportunity, and revision;
- one matching Dreamer settlement;
- positive constraint internal links: canonical Vortox tenure ID parses as role `vortox` and the same seat, nonempty Vortox player, literal role, and evaluated revision equal to delivery/source/settlement revision.

It does not claim to prove current Demon identity, tenure activity, complete impairment absence, target truth exclusion, or accepted-history provenance. Those claims belong only to trusted accepted-stream replay. A stored-shape success is not applicability authority.

## versionedDelivery

Add exactly:

```ts
export const DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION =
  "dreamer-information-delivered-v3" as const;

export type DreamerVortoxInformationReliability = {
  readonly kind: "VORTOX_FORCED_FALSE";
};

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
  readonly informationReliability: DreamerVortoxInformationReliability;
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

The exact 20 top-level enumerable keys, in the validator's frozen key list, are:

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
sourcePlayerId
sourceSeatNumber
targetPlayerId
targetSeatNumber
taskId
taskType
vortoxConstraint
```

Nested exact keys are:

- `informationReliability`: `kind`;
- `vortoxConstraint`: `constraintVersion`, `evaluatedCharacterStateRevision`, `kind`, `vortoxPlayerId`, `vortoxRoleId`, `vortoxRoleTenureId`, `vortoxSeatNumber`;
- base source contract: the unchanged 11 accepted A1 keys;
- role snapshot: `roleId`, `characterType`, `defaultAlignment`, `edition`, `setupModifier`;
- setup modifier: `outsiderDelta`, `townsfolkDelta`.

V3 stores no source-effectiveness object, impairment set, impairment-absence boolean, candidate set, target true role, ledger fact, receipt, event index, full state, or generic evidence.

The existing exception-safe canonical-data guard runs before property use. Missing/extra keys, wrong versions/literals/types, nonfinite numbers, sparse or record-position arrays, symbols, getters/setters, throwing or revoked proxies, cycles, and nonplain prototypes fail closed; no accessor is invoked.

## candidatePolicy

The V1/V2 constructor remains unchanged and cannot create V3. Add exactly this exported typed constructor:

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

It accepts no boolean Vortox flag, unknown context, impairment absence, arbitrary reliability, or preselected candidates. It requires target V2, source-contract cross-links, exact source and target current-state correspondence, target catalog identity, capability/source-contract tenure and ability-instance equality, capability/choice/current-state revision equality, and constraint identity/tenure/revision consistency.

Candidates come only from `setup.roleCatalogSnapshot.roles`:

- GOOD: native `characterType` is `TOWNSFOLK` or `OUTSIDER`, and `roleId` differs from target truth;
- EVIL: native `characterType` is `MINION` or `DEMON`, and `roleId` differs from target truth.

The selector sorts copied candidates with the existing `compareStableId(left.roleId, right.roleId)` raw UTF-16 code-unit comparator and selects the first of each category. Catalog order, locale, current player alignment, in-play status, time, randomness, and UUIDs have no effect. In-play roles remain legal. `localeCompare`, `Intl.Collator`, `Date.now`, `Math.random`, random UUIDs, and JSON serialization comparisons are forbidden.

The resulting role IDs are distinct, both differ from target truth, and both complete snapshots equal catalog entries. Empty GOOD or EVIL candidate sets throw `DomainError("InvalidDreamerInformationDeliveredPayload", "Dreamer Vortox information requires deterministic false GOOD and EVIL role candidates")`.

Cloning and equality use explicit exhaustive V1/V2/V3 discrimination. V3 clone creates fresh nested source contract, reliability, constraint, role snapshots, and setup modifiers. V3 equality compares every frozen field. Cross-version equality is always false. Equality never substitutes for prior shape/provenance validation.

## batch

The application creates one file-private preparation, not a public context:

```ts
type PreparedBaseDreamerSubmission =
  | {
      readonly kind: "BASE_DREAMER_NORMAL_V2";
      readonly targetChoice: DreamerTargetChosenPayloadV2;
      readonly delivery: DreamerInformationDeliveredPayloadV2;
      readonly settlement: ScheduledTaskSettlement;
    }
  | {
      readonly kind: "BASE_DREAMER_VORTOX_FALSE_V3";
      readonly targetChoice: DreamerTargetChosenPayloadV2;
      readonly delivery: DreamerInformationDeliveredPayloadV3;
      readonly settlement: ScheduledTaskSettlement;
    };
```

The validated `SubmitDreamerAction` V3-opportunity branch resolves capability once before metadata. Normal support uses the unchanged V2 constructor; forced-false support uses the new V3 constructor; unsupported and unresolved branches return before metadata. The private `createEvents` call receives this preparation only for `SubmitDreamerAction` and clones its three typed payloads. It must not query state, rerun the resolver, or regenerate candidates. The type is not exported, persisted, projected, returned, added to `GameState`, or generalized for another command.

Prospective batch validation independently uses canonical batch-start state, the same resolver, and the appropriate typed constructor to reconstruct expected delivery and compare it with the event. Per-event replay independently repeats the proof immediately before delivery. This independent validation is not a caller-supplied preparation assertion.

Success is exactly:

1. `DreamerTargetChosen` with target V2;
2. `DreamerInformationDelivered` with V3;
3. `ScheduledTaskSettled` with existing `DREAMER_INFORMATION_DELIVERED` outcome.

All three share one `gameId`, `commandId`, `batchId`, `expectedGameVersion`, timestamp, and actor; use `batchSize=3`, indexes `0/1/2`, and contiguous event sequence; and remain in `FIRST_NIGHT`. The settlement task/opportunity/source revision cross-links exactly. The opportunity closes and task settles only after the complete batch applies. Naked, partial, duplicate, reordered, split, gapped, cross-command, cross-batch, wrong-phase, or metadata-mismatched histories reject atomically.

## ledgerWithoutNewEvidence

Do not modify `AbilityOutcomeEvidenceReference` or add a generic evidence kind. V3 derivation in `first-night-ability-outcome-ledger.ts` must reject the existing non-V2 legacy Vortox heuristic as authority and instead:

1. identify exact V3 discrimination;
2. obtain the exact V3 opportunity and target V2 from canonical `stateBefore`;
3. run the same capability resolver against canonical pre-delivery state;
4. require `VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED`;
5. reconstruct expected V3 and compare it exactly;
6. require both delivered roles to exclude the target role at that revision;
7. classify exactly `ABNORMAL / VORTOX_FALSE_INFORMATION / true`;
8. derive evidence only after those checks.

The exact canonical evidence multiset has 10 entries and, after existing `canonicalizeAbilityOutcomeEvidenceReferences`, this order:

1. `SOURCE_EVENT` for the V3 terminal envelope;
2. `TASK` for the unique base Dreamer task;
3. `ACTION_OPPORTUNITY` for the exact V3 opportunity;
4. two `ROLE_TENURE` entries — Dreamer source tenure and Vortox tenure — ordered by existing stable primary identity;
5. `CHARACTER_STATE` for the evaluated revision;
6. three `PLAYER_ROLE_AT_REVISION` entries — Dreamer source, target, and Vortox — ordered by the existing `${playerId}@revision-${revision}` stable primary identity;
7. `DREAMER_DELIVERY` for the V3 terminal event.

There is no `ABILITY_IMPAIRMENT` entry. Omission is not proof. The complete aggregate was already proven at replay T2 before derivation.

The closed fact validator changes only its Dreamer conditional:

- normal Dreamer requires target truth in the pair;
- source-impairment abnormal Dreamer retains exactly one matching `ABILITY_IMPAIRMENT` requirement;
- `VORTOX_FALSE_INFORMATION` abnormal Dreamer requires truth excluded, zero impairment evidence, exactly one positive Vortox role at the evaluated revision, and exactly one matching active Vortox tenure;
- every other abnormal/unresolved legacy rule remains unchanged.

Canonical fact-against-source validation re-derives the V3 fact from `stateBefore` and the terminal event and exact-compares it. A standalone exact fact shape cannot establish impairment absence and must never be presented as accepted-history provenance. Settlement derives no second terminal fact.

## mathematician

No Mathematician production file, event, resolver, delivery, window, own-ability exclusion, numeric policy, duplicate-holder policy, or distinct-player logic changes.

The existing consumer sees one V3 terminal fact with `outcomeStatus=ABNORMAL` and `causedByAnotherCharacterAbility=true`, so the Dreamer `sourcePlayerId` contributes once when it lies in the existing temporal window. Two false fields do not count twice. Repeated facts for the same player remain subject to existing distinct-player deduplication. A normal Dreamer V1/V2 fact remains non-qualifying.

## projection

The public view shape remains unchanged. Rename the existing file-private authorization boolean to `allowAcceptedStreamOnlyHistory`; it is `false` for state-only player/AI builders and `true` only after the accepted-event-stream builder has replayed the full stream.

When `allowAcceptedStreamOnlyHistory=false`, any V3 Dreamer delivery fails closed with `PrivateKnowledgeUnavailable` before exposure. V1/V2 state-only behavior is unchanged. When true, full replay is the semantic authority and the unchanged stored validator supplies only the final shape/cross-link check.

Only the source player and the source AI receive:

- historical target player/seat;
- `goodRole`;
- `evilRole`;
- existing Dreamer knowledge model/stage representation.

No view exposes Vortox identity, constraint, tenure, reliability, cause, impairments, target truth, candidate set, ledger, or which field would normally be true. Non-source viewers receive no Dreamer pair. Projection never recomputes from latest state.

## receipts

Every failed supported attempt is retryable, saves no receipt, consumes no command ID, appends zero events, leaves game version unchanged, leaves the opportunity OPEN, and creates no settlement or ledger fact. A successful retry with the identical command ID after dependency repair creates one deterministic accepted receipt and exactly one three-event batch.

Deterministic command rejections after T1 command validation retain existing receipt-bearing idempotent behavior. Successful accepted behavior retains existing receipt creation after atomic append. Transient generated metadata from a failed attempt is not canonical history.

## failures

| Boundary | Exact result | failureStage | Receipt / retry behavior |
|---|---|---|---|
| existing deterministic command rejection: wrong version, wrong/closed opportunity, self-target, out-of-order task, wrong actor | existing specific rejected code/message | none | rejection receipt; command ID consumed idempotently |
| reachable source DRUNK, any represented source impairment, or existing No Dashii unsupported boundary | `ApplicationNotConfigured` with `Dreamer normal information capability is not configured for this source state` | `first-night-role-action` | retryable, no receipt, zero events |
| missing/malformed/ambiguous canonical capability, Vortox identity, tenure, or aggregate | `DependencyExecutionFailed` with `Dreamer normal information capability could not be proven` | `first-night-role-action` | retryable, no receipt, zero events |
| target/candidate/constructor cannot produce the canonical result | `DependencyExecutionFailed` with `Dreamer normal information dependencies could not produce a canonical result` | `first-night-role-action` | retryable, no receipt, zero events |
| prospective Dreamer `DomainError`, including exact delivery/batch/ledger mismatch | `DependencyExecutionFailed` with contained actor-safe domain message | existing `first-night-role-action` | retryable, no receipt, zero events |
| unexpected non-`DomainError` during prospective validation | `DependencyExecutionFailed` with contained generic message | existing `prospective-validation` | retryable, no receipt, zero events |
| event/batch metadata generation failure | `MetadataGenerationFailed` | `event-metadata` | retryable, no receipt, zero events |
| atomic append failure | `EventStoreAppendFailed` | `accepted-commit` | retryable, no success receipt, zero accepted events |
| hostile persisted V3, replay, ledger, or state-only V3 projection | existing fail-closed `DomainError` at that boundary | not an application receipt result | no partial accepted history or hidden-data exposure |

Unknown errors never expose stacks, Vortox identity, tenure, impairment state, target truth, or ledger data. No failure is weakened into normal information.

## tests

Each primary ID appears exactly once. Manual mutation is R3 or pure seam, never accepted-stream authority.

| ID | Frozen assertion | Primary authority layer | Primary file |
|---|---|---|---|
| `2B19A3A-C01` | V1 and normal V2 exact shapes, replay, ledger, and projection remain unchanged | legacy replay compatibility | `packages/domain-core/src/dreamer.test.ts` |
| `2B19A3A-C02` | V3 has the exact 20-key and nested runtime shapes and constants | structural validation | `packages/domain-core/src/dreamer.test.ts` |
| `2B19A3A-C03` | real accepted effective Vortox with GOOD target succeeds and excludes truth twice | accepted-stream integration | `packages/application/src/game-application-service.test.ts` |
| `2B19A3A-C04` | real accepted effective Vortox with EVIL target succeeds and excludes truth twice | accepted-stream integration | `packages/application/src/game-application-service.test.ts` |
| `2B19A3A-C05` | every V3 has exactly one native GOOD and one native EVIL catalog role | accepted-stream integration | `packages/application/src/game-application-service.test.ts` |
| `2B19A3A-C06` | catalog reorder and locale variation do not change deterministic selection | pure policy seam | `packages/domain-core/src/dreamer.test.ts` |
| `2B19A3A-C07` | an otherwise legal in-play false role remains eligible | pure policy seam | `packages/domain-core/src/dreamer.test.ts` |
| `2B19A3A-C08` | success is exactly target V2, delivery V3, settlement in one atomic batch | accepted-stream integration | `packages/application/src/game-application-service.test.ts` |
| `2B19A3A-C09` | complete-batch prefix plus pre-delivery state re-proves Vortox without trusting V3 | accepted-stream replay validation | `packages/domain-core/src/rebuild.test.ts` |
| `2B19A3A-C10` | pre-resolution target change changes excluded truth; later change does not rewrite history | accepted stream plus historical projection | `packages/projections/src/private-knowledge-view.test.ts` |
| `2B19A3A-C11` | missing Vortox tenure fails closed | hostile replay rejection | `packages/domain-core/src/rebuild.test.ts` |
| `2B19A3A-C12` | duplicate/stale/ended/cross-linked Vortox tenure fails closed | hostile replay rejection | `packages/domain-core/src/rebuild.test.ts` |
| `2B19A3A-C13` | wrong Vortox player, seat, role, tenure, or revision fails closed | hostile replay rejection | `packages/domain-core/src/rebuild.test.ts` |
| `2B19A3A-C14` | an applicable Vortox impairment never produces V3; test is R4 pure seam only | pure policy seam | `packages/domain-core/src/dreamer.test.ts` |
| `2B19A3A-C15` | real accepted source DRUNK plus effective Vortox remains ApplicationNotConfigured, receipt-free, zero-event, OPEN | accepted-stream integration | `packages/application/src/game-application-service.test.ts` |
| `2B19A3A-C16` | source POISONED remains non-V3 and is labeled R4 only | pure policy seam | `packages/domain-core/src/dreamer.test.ts` |
| `2B19A3A-C17` | candidate shortage fails closed through hostile/pure catalog seam and is not claimed R1 | hostile/pure seam | `packages/domain-core/src/dreamer.test.ts` |
| `2B19A3A-C18` | retryable capability/candidate/prospective/metadata/append failures save no receipt; same command succeeds after repair | accepted application failure/recovery | `packages/application/src/game-application-service.test.ts` |
| `2B19A3A-C19` | naked/partial/reordered/duplicate/split/cross-batch Dreamer history rejects | hostile replay rejection | `packages/domain-core/src/domain-batch-semantics.test.ts` |
| `2B19A3A-C20` | accepted V3 derives exactly one abnormal Vortox fact with the exact 10-entry existing-evidence set | accepted-stream ledger integration | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` |
| `2B19A3A-C21` | settlement derives no duplicate terminal fact | accepted-stream integration | `packages/application/src/game-application-service.test.ts` |
| `2B19A3A-C22` | later Mathematician counts the Dreamer source once | accepted-stream consumer integration | `packages/application/src/mathematician-information.test.ts` |
| `2B19A3A-C23` | normal Dreamer remains excluded from Mathematician abnormal count | accepted-stream consumer regression | `packages/application/src/mathematician-information.test.ts` |
| `2B19A3A-C24` | source player sees only target and pair through accepted-stream projection | accepted-stream projection | `packages/projections/src/private-knowledge-view.test.ts` |
| `2B19A3A-C25` | source AI sees the same bounded pair; non-source player/AI see none | accepted-stream projection | `packages/projections/src/private-knowledge-view.test.ts` |
| `2B19A3A-C26` | Vortox/reliability/cause/tenure/impairment/truth/ledger never leak | projection security | `packages/projections/src/private-knowledge-view.test.ts` |
| `2B19A3A-C27` | state-only player and AI projection reject V3; accepted-stream builders accept only after replay | projection trust boundary | `packages/projections/src/private-knowledge-view.test.ts` |
| `2B19A3A-C28` | accepted Dreamer settlement continues to the supported Seamstress terminal action and both replay | accepted-stream integration | `packages/application/src/game-application-service.test.ts` |
| `2B19A3A-C29` | Dreamer stays `61 / 80` between Clockmaker and Seamstress; Vortox has no first-night wake | nightsheet structural validation | `packages/domain-core/src/dreamer.test.ts` |
| `2B19A3A-C30` | exact frozen HEAD passes Ubuntu ordinary, single-fork coverage, and Windows deterministic gates | cross-platform CI | existing workflow, no workflow edit |

Supporting hostile matrix `2B19A3A-S01` mutates every V3 top-level and nested key, required literal, ID cross-link, target truth, role type, constraint identity, tenure and revision. It includes throwing Proxy, revoked Proxy, getter/setter, symbol, cycle, sparse array, nonplain prototype, missing key, extra key, and wrong primitive; every case fails closed and getter invocation count remains `0`.

Supporting matrix `2B19A3A-S02` removes, duplicates, substitutes, adds, and reorders each of the exact ten ledger evidence entries; each forged fact rejects, while the accepted fact derives from replay. It asserts no new evidence variant and no impairment-absence record.

Supporting matrix `2B19A3A-S03` proves exhaustive reference-independent V1/V2/V3 clone/equality branches and prohibits serialization equality. Supporting matrix `2B19A3A-S04` statically checks exact production/test/control allowlists, no forbidden surface, and added production LOC.

## affectedFiles

Production allowlist, exactly:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

No production edit is allowed in `events.ts`, `event-applier.ts`, `rebuild.ts`, `game-state.ts`, `first-night-action-opportunity.ts`, `mathematician.ts`, `mathematician-internal.ts`, workflows, dependencies, timeouts, configuration, or a new production file.

Test allowlist:

- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- existing adjacent test-harness fixture files only when required for immutable accepted-stream capture.

Documentation/control may change only the Slice design review, status, traceability, PR evidence, role coverage matrix, and existing `docs/agent-loop` state/log files. `docs/PROJECT_STATE.md` is forbidden; the accepted path is `docs/agent-loop/PROJECT_STATE.md`.

## CI

Use Node `24.15.0`, pnpm `11.7.0`, and the frozen lockfile. Run file-scoped Vitest for every changed test, ESLint for every changed TypeScript file, then:

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
git diff --check
```

Coverage retains `VITEST_MAX_FORKS=1`. Do not change workflows, dependencies, timeouts, Vitest configuration, coverage thresholds, skip/only/todo markers, or test semantics. The final frozen product HEAD must independently pass Ubuntu ordinary, Ubuntu single-fork coverage, and Windows deterministic checks. CI is commit-specific and cannot be inherited from the accepted base.

## documentation

After implementation, create/update the Slice status and C01-C30/S01-S04 traceability; record the exact evidence/design/review hashes, changed production count, added production LOC, full-gate results, and product-head CI provenance. The PR body must contain Rule Evidence, Rule Claims Implemented, Explicitly Unsupported Rules, Rule Source Revisions, and Rule-to-Test Traceability.

On merge only, update `docs/rules/ROLE_COVERAGE_MATRIX.md` to Slice `PARTIAL / EFFECTIVE_SOURCE_VORTOX_FALSE_ONLY`; Dreamer remains `PARTIAL`, Vortox remains `NOT_STARTED`, and Mathematician remains `PARTIAL`. No role is promoted to COMPLETE.

## rollback

Before publication, revert only the Slice implementation/test/status changes while preserving governance, evidence, design, and review history. After publication, use a normal attributed revert; never rewrite accepted history or force-push. V1/V2 require no migration because V3 is additive. Removing the V3 producer must not silently reinterpret accepted V3 as V2; it requires an explicit compatibility decision.

## outOfScope

- source DRUNK plus effective Vortox information delivery; deferred to `2B19A3B`;
- source POISONED plus effective Vortox information delivery; deferred to `2B19A3B`;
- impaired/dead/otherwise ineffective Vortox accepted-stream behavior;
- No Dashii adjacency or poisoning derivation;
- Philosopher-gained Dreamer execution;
- Storyteller free pair choice, candidate persistence, or final-choice event;
- Traveller targets, registration, Spy/Recluse misregistration;
- other-night Dreamer, Vortox, or Mathematician behavior;
- general death, character-change, alignment-change, impairment, effect, or Vortox platform;
- any new event type/name, GameState field, evidence variant, generic context, public state-only applicability resolver, or projection field;
- changing Mathematician production or accepted timing/numeric policies;
- FIRST_NIGHT completion, DAY, Phase 2C, 2B19A3B, 2B19A4, 2B19B, or any later Slice;
- claiming Dreamer or Vortox complete.

## completionCriteria

1. This exact materialized Round 1 receives independent `RULE_DESIGN_PASS` before production/test edits.
2. Evidence hash equals `2da6b7c9d6fea31bbab05674ac3e6a45213257c7af314f66d47eb4a8436f84b6`, terminal is `RULE_READY`, and conflicts remain empty.
3. Governance hash equals `ccb73944855c4eb110335462aba32865cb5dbd357db2733dfae6e2b1980426f9`, terminal is `GO`.
4. R1/R2/R3/R4 and T1/T2/T3 labels remain honest.
5. V1/V2 exact behavior remains unchanged.
6. V3 matches the exact 20-key and nested contracts with positive Vortox facts only.
7. Source impairment retains precedence and accepted source DRUNK remains unchanged unsupported.
8. Effective Vortox proof uses the same T2 resolver at command, prospective batch, pre-delivery replay, and ledger derivation boundaries.
9. No caller field or ledger evidence claims impairment absence.
10. False-pair selection uses native types, excludes target truth twice, allows in-play roles, and uses `compareStableId` only.
11. Stored validator remains shape/cross-link only and state-only projection rejects V3.
12. Success is exactly the atomic target-V2/delivery-V3/settlement batch.
13. V3 derives exactly one abnormal Vortox fact with the exact ten existing evidence entries and no impairment evidence.
14. Existing Mathematician counts the source once; normal Dreamer remains excluded.
15. Player/AI accepted-stream projection is source-private and leaks no Vortox or truth facts.
16. Every failure preserves exact receipt/retry/zero-event/open-opportunity contracts.
17. C01-C30 and S01-S04 pass at their frozen primary/support layers.
18. Production diff is confined to exactly the five allowed files and adds no more than 1000 production LOC.
19. No forbidden event/state/evidence/context/projection/workflow/dependency/timeout surface changes.
20. Targeted checks and all full gates pass.
21. Exact frozen HEAD passes required cross-platform CI.
22. Complete independent final review returns `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`, and `remainingBlockers=[]` for exact PR HEAD.
23. Both complete verbatim GitHub audit comments are re-read and match exact PR HEAD before merge.
24. Worktree is clean, local/remote/PR HEADs match, and no later Slice has started.

## stopLoss

Stop with `RESLICE_REQUIRED` or `HUMAN_BLOCKED` as required by governance, without guessing or expanding scope, if:

- required rule source, evidence hash, or governance hash changes;
- a substantive rule conflict appears;
- independent review is not `RULE_DESIGN_PASS` after the allowed two design rounds;
- source-impaired information semantics enter the implementation;
- accepted V3 cannot be proved from canonical complete pre-event state;
- V3 requires negative absence payload/evidence, a new evidence variant, event type, GameState field, public context/resolver, projection field, or generic effect/Vortox platform;
- a sixth production file or more than 1000 added production LOC is required by the proposed implementation;
- in all cases the user hard stop of more than eight production files or more than 1500 added production LOC is never approached or used as implicit permission;
- V1/V2 compatibility weakens;
- Mathematician production must change;
- repeated identical gate failure, unsafe history rewrite, permission failure, unexplained worktree mutation, red exact-head CI, incomplete final review, or audit-comment mismatch occurs.

No Design Round 3, implementation repair beyond the authorized limit, merge, or later Slice may be inferred.

## coverageStatus

`PARTIAL / EFFECTIVE_SOURCE_VORTOX_FALSE_ONLY`

Dreamer remains `PARTIAL`: source-impaired Vortox precedence, No Dashii, gained Dreamer, Storyteller free selection, Travellers, life/death, registration, other-night, and general changes remain incomplete. Vortox remains `NOT_STARTED`: this Slice consumes one bounded effective-current constraint and does not implement the role. Mathematician remains `PARTIAL`: production is unchanged and only the existing consumer is regression-tested. FIRST_NIGHT remains incomplete.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_1
