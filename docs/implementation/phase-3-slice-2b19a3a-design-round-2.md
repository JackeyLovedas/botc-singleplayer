# Phase 3 Slice 2B19A3A — Effective Base Dreamer + Effective Vortox Forced-False Information Design Round 2

## Authority Metadata

- sliceId: `2B19A3A`
- authorization: `USER_AUTHORIZED_2B19A3_RESLICE_TO_ACCEPTED_STREAM_EFFECTIVE_VORTOX_ONLY`
- designRound: `2 / 2`
- acceptedMain: `d5d007ff9b9b7140a3552d076a53330893a3201d`
- acceptedMainCI: `29553826536 / SUCCESS`
- parentRound1Design: `docs/implementation/phase-3-slice-2b19a3a-design.md`
- parentRound1DesignSha256: `fb9dc655ba718030dde3208f2a3f3fc51e9582fcef0f3b2db4cccbaabfa9c794`
- round1Review: `docs/implementation/phase-3-slice-2b19a3a-design-review-round-1.md`
- round1ReviewSha256: `3d7d4a2c18195bf7755753c96b82b11a86a5e868b9af3c4e66bbd8df24d4a892`
- round1ReviewVerdict: `RULE_DESIGN_FIX_REQUIRED`
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
- bindingDesignCeiling: exactly the five production files listed below and no more than `1000` added production LOC

This document is the complete standalone Round 2 replacement and sole candidate implementation authority. It is not an erratum, addendum, or delta. It contains every definition required for implementation without reading Round 1. It changes no external rule semantics and closes only the three Round 1 review findings: conditional nine/ten-entry ledger evidence, atomic ADR traceability, and a closed diff allowlist. It authorizes only independent Round 2 rule-design review. No production/test edit, feature commit, push, PR, merge, later Slice, or coverage promotion is authorized until this exact materialized document receives `RULE_DESIGN_PASS`.

## scope

Slice 2B19A3A adds one success branch to the accepted base Dreamer first-night action. At settlement, the existing canonical capability path must prove from complete canonical state that the source is the unique current base Dreamer bound to the accepted actionable V3 opportunity and active Dreamer tenure; the source has no applicable represented impairment; exactly one current Demon exists and is the catalog-bound Vortox; Vortox has one continuous active canonical tenure; and the complete represented impairment aggregate has no applicable Vortox impairment.

The success returns exactly one native GOOD character and one native EVIL character, neither equal to the target's settlement-time true character. It atomically commits existing `DreamerTargetChosen` V2, additive `DreamerInformationDelivered` V3, and existing `ScheduledTaskSettled`. Replay derives one `ABNORMAL / VORTOX_FALSE_INFORMATION / causedByAnotherCharacterAbility=true` outcome fact using the unchanged evidence union and canonicalizer. When the target is the proven current Vortox, target and Vortox role evidence coalesce and the exact fact has nine evidence entries; every other legal target produces ten. Existing Mathematician consumption counts the Dreamer source once. Only accepted-stream player/AI private projection exposes the historical target and pair.

No source-impaired delivery, impaired-Vortox accepted behavior, No Dashii poisoning, gained Dreamer, free Storyteller selection, other-night execution, general effect platform, new event, new state field, new evidence variant, or new public context is included.

## governanceClassification

- `R1`: currently reachable accepted stream. The only new success is effective base Dreamer plus effective current Vortox. Source DRUNK plus effective Vortox is also R1-reachable but remains explicitly unsupported.
- `R2`: legacy or imported accepted Dreamer V1, 2B19A1 V2 opportunity, and 2B19A2 normal V2 history.
- `R3`: hostile/corrupted payload, stream, ledger, catalog, batch, provenance, or projection input. Candidate shortage through a substituted catalog is R3.
- `R4`: future hypothetical state without an accepted producer, including source POISONED, current-Vortox DRUNK/POISONED, pre/post-delivery target character-change production, No Dashii, gained Dreamer, and other-night behavior.

- `T1`: external/persisted command, payload, event stream, event envelope, projection viewer, and state-only projection boundary.
- `T2`: canonical state rebuilt from accepted complete batches, including plan/progress, current characters, catalog, tenures, complete impairments, opportunity, choice, and ledger.
- `T3`: module-private deterministic selector, comparator, typed constructor, clone, and equality.

The only permitted primary-layer tokens are exactly:

```text
ACCEPTED_STREAM_INTEGRATION
LEGACY_REPLAY_COMPATIBILITY
HOSTILE_REPLAY_REJECTION
STRUCTURAL_VALIDATION
PURE_POLICY_SEAM
PROJECTION
CROSS_PLATFORM_CI
```

No compound, synonym, free-form, or unknown primary-layer token is valid.

## actualReachability

The sole R1 success chain is:

1. accepted V2 plan contains the base Dreamer task;
2. actionable `DREAMER_FIRST_NIGHT_ACTION_V3` opportunity is OPEN;
3. source contract, current Dreamer, catalog entry, active Dreamer tenure, and base ability-instance ID cross-bind exactly;
4. complete represented impairment state contains zero applicable source markers;
5. current state contains exactly one Demon and its exact catalog role is `vortox`;
6. one Vortox tenure is active and continuous at the settlement revision;
7. complete represented impairment state contains zero applicable Vortox markers;
8. another modeled player is targeted and has one exact settlement-time catalog role;
9. deterministic false native-GOOD and native-EVIL candidates exist;
10. target V2, delivery V3, and settlement append atomically;
11. replay derives one canonical Vortox-caused abnormal fact;
12. existing Mathematician and accepted-stream private projection consume it without new public semantics.

Source DRUNK plus effective Vortox stops at step 4 with existing `ApplicationNotConfigured`, `first-night-role-action`, retryable, receipt-free, zero events, unchanged version, and OPEN opportunity. Source POISONED and current-Vortox impairment have no accepted producer and remain R4 pure seams. A legal accepted 12-player catalog has enough candidates; shortage is R3 only.

## trustBoundaries

T1 values first pass the existing exception-safe canonical-data gate. No field access, parsing, clone, equality, state query, or role selection may occur before T1 exact-shape acceptance. Getters are never invoked. Throwing/revoked proxies, symbols, cycles, sparse arrays, nonplain records, wrong literals, missing keys, and extra keys fail closed.

Only T2 complete canonical state proves source effectiveness, current Vortox identity, active tenure, and zero applicable impairment. A payload, stored-state validator, ledger omission, caller boolean, or latest state cannot supply that proof.

T3 functions consume typed canonical inputs. They may deterministically select and compare but may not create public authority, persist absence, use locale/time/randomness, or reinterpret history.

## legacyReplay

`DreamerInformationDeliveredPayloadV1` and V2 keep exact enumerable keys, nested shapes, literals, constructor signatures, clone/equality behavior, replay/ledger meaning, stored validation, and projection output. `dreamer-information-delivered-v2` is not modified. No optional Vortox field is added.

Closed delivery discrimination is:

- no own `deliverySchemaVersion`: V1 under existing exact rules;
- `dreamer-information-delivered-v2`: V2;
- `dreamer-information-delivered-v3`: V3;
- any other version or discriminator shape: fail closed.

V3 is additive. No V1/V2 migration or reinterpretation is permitted.

## effectiveSourceBoundary

The existing exported `resolveBaseDreamerV2NormalCapability` remains the only capability resolver. No second public resolver or generic context is added. It re-proves plan/progress, V3 opportunity, source contract, current source, catalog snapshot, active continuous Dreamer tenure, base ability instance, and complete impairment aggregate before Demon handling.

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

`VORTOX_FORCED_FALSE_UNSUPPORTED` is removed only from this transient union; it was never persisted. A source marker returns `SOURCE_REPRESENTED_IMPAIRED` before any Vortox success. Source DRUNK therefore cannot fall through to V2 or V3. Source POISONED preserves the same pure classification without a current accepted producer. Invalid/ambiguous source proof returns the existing unresolved branch.

## vortoxApplicability

After effective-source proof the same resolver must:

1. find exactly one current `characterType="DEMON"` entry;
2. require one complete matching catalog snapshot;
3. retain No Dashii unresolved behavior;
4. retain normal V2 support for a non-Vortox Demon;
5. for Vortox, find exactly one active `roleId="vortox"` tenure for the same player/seat at `currentCharacterState.revision`;
6. require continuity from acquisition through that revision;
7. validate the complete exact represented impairment aggregate;
8. filter markers only when player, seat, complete Vortox snapshot, tenure interval, and revision interval all match;
9. return forced-false support only for zero applicable markers;
10. return `VORTOX_EFFECTIVENESS_CONFLICT` for malformed, duplicate, ambiguous, or multiple applicable markers.

The supported constraint carries positive facts only. Its evaluated revision equals the capability, target-choice, delivery, and settlement revision. `parseRoleTenureId` must return `valid=true`, `roleId="vortox"`, and the constraint seat. No absence flag is stored.

Exactly one valid applicable Vortox marker must not produce V3. Because no accepted producer reaches that state, only R4/T3 pure-seam non-V3 classification is tested; this Slice claims no impaired-Vortox information coverage.

## acceptedStreamPreStateProof

A prefix ending after `DreamerTargetChosen` is an illegal partial batch and is never called accepted history. The exact non-circular authority is:

1. rebuild the maximal accepted complete-batch prefix before the Dreamer batch;
2. validate the complete proposed three-event batch against that canonical batch-start state;
3. during full replay apply the validated target choice;
4. immediately before V3 delivery rerun the same resolver against event-applier pre-event state;
5. reconstruct expected V3 and compare every typed field;
6. apply delivery and settlement;
7. derive and validate the outcome fact from that same pre-delivery state.

Target choice changes none of current characters, Demon identity, tenures, impairments, or catalog. Batch-start and pre-delivery applicability inputs are therefore identical and both originate from accepted history. `validateDomainBatchSemantics` supplies prospective complete-batch authority; existing `applyDomainEvent` delivery validation supplies pre-event replay authority. No `rebuild.ts` or `event-applier.ts` edit is authorized.

## storedShapeBoundary

`validateStoredDreamerInformationDelivered` keeps its public signature unchanged and gains no ledger, state, impairment, applicability, or context parameter.

For V3 it validates only exception-safe exact shapes; supported constants/primitives; canonical source contract/IDs; catalog membership and native categories; distinct role IDs; matching planned base task and historical roster; exact target V2 choice/source contract/opportunity/source/target/revision; matching settlement; and positive constraint internal links. The Vortox tenure ID must parse as `vortox` at the constraint seat; the player is nonempty; the role literal is `vortox`; the evaluated revision equals delivery/source/settlement revision.

It does not prove current Demon identity, active tenure, complete impairment absence, target truth exclusion, or accepted provenance. State-only projection therefore rejects V3 even after stored-shape success. Complete semantics come only from trusted accepted-stream replay.

## versionedDelivery

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

The exact V3 top-level enumerable key set has 20 entries:

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

Nested exact key sets are:

- reliability: `kind`;
- constraint: `constraintVersion`, `evaluatedCharacterStateRevision`, `kind`, `vortoxPlayerId`, `vortoxRoleId`, `vortoxRoleTenureId`, `vortoxSeatNumber`;
- base source contract: unchanged accepted 11 keys `kind`, `sourceAbilityInstanceId`, `sourceCharacterStateRevision`, `sourceContractVersion`, `sourcePlayerId`, `sourceRoleId`, `sourceRoleTenureId`, `sourceSeatNumber`, `taskId`, `taskPlanVersion`, `taskType`;
- role snapshot: `roleId`, `characterType`, `defaultAlignment`, `edition`, `setupModifier`;
- setup modifier: `outsiderDelta`, `townsfolkDelta`.

V3 stores no source-effectiveness object, impairment set/absence, candidate set, target truth, ledger, receipt, event index, full state, or generic evidence. The exception-safe canonical-data gate precedes all field access. Unknown/missing keys, wrong literals/types, nonfinite values, record-position arrays, sparse arrays, symbols, accessors, throwing/revoked proxies, cycles, and nonplain prototypes fail closed with zero getter calls.

## candidatePolicy

The unchanged V1/V2 constructor cannot create V3. Add exactly:

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

It accepts no boolean flag, unknown context, absence assertion, arbitrary reliability, or preselected candidates. It requires exact target V2/source-contract links; exact source and target state correspondence; target catalog identity; capability/source-contract tenure and ability-instance equality; capability/choice/state revision equality; and constraint identity/tenure/revision consistency.

Candidates come only from `roleCatalogSnapshot.roles`. GOOD has native `characterType` `TOWNSFOLK` or `OUTSIDER`; EVIL has native `MINION` or `DEMON`; both exclude the target settlement role. Copy, sort by existing `compareStableId(left.roleId,right.roleId)` raw UTF-16 ordering, and choose the first of each category. In-play roles remain legal. Catalog order, player alignment, locale, time, randomness, UUIDs, and current assignments do not affect selection. `localeCompare`, `Intl.Collator`, `Date.now`, `Math.random`, random UUIDs, and serialization equality are forbidden.

If either category is empty, throw exactly `DomainError("InvalidDreamerInformationDeliveredPayload", "Dreamer Vortox information requires deterministic false GOOD and EVIL role candidates")`.

Clone/equality has explicit exhaustive V1/V2/V3 branches. V3 clone creates fresh source contract, reliability, constraint, role snapshots, and setup modifiers. V3 equality compares every field; cross-version equality is false. Equality follows shape/provenance validation and never replaces it.

## batch

The application uses exactly this file-private type:

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

After command validation, resolve capability once before metadata. Normal support uses the unchanged V2 constructor; forced-false uses the V3 constructor; unsupported/unresolved returns before metadata. Private event creation receives this preparation only for `SubmitDreamerAction`, clones it, and does not query state, resolve again, or select again. The type is not exported, persisted, projected, returned, added to state, or generalized.

Prospective batch validation independently reconstructs expected delivery from canonical batch-start state. Per-event replay independently reconstructs it before delivery. Success is exactly target V2, delivery V3, settlement, in that order, with one game/command/batch/version/timestamp/actor, `batchSize=3`, indexes `0/1/2`, contiguous sequences, and `FIRST_NIGHT`. Opportunity closes and task settles only after the complete batch applies. Naked, partial, duplicate, reordered, split, gapped, cross-command, cross-batch, wrong-phase, or metadata-mismatched histories reject atomically.

## ledgerWithoutNewEvidence

`AbilityOutcomeEvidenceReference`, `evidenceKeys`, `ranks`, `primary`, and `canonicalizeAbilityOutcomeEvidenceReferences` remain byte-for-byte unchanged. No variant, discriminator, negative evidence, or special canonicalizer branch is added.

V3 derivation must identify exact V3; load exact opportunity and target V2 from canonical pre-delivery state; rerun the same capability resolver; require forced-false support; reconstruct and exact-compare V3; require both roles exclude target truth; classify `ABNORMAL / VORTOX_FALSE_INFORMATION / true`; then derive existing evidence.

The unordered source set before canonicalization contains:

- one `SOURCE_EVENT` for the terminal V3 envelope;
- one `TASK` for the base Dreamer task;
- one `ACTION_OPPORTUNITY` for the exact V3 opportunity;
- one source-Dreamer `ROLE_TENURE`;
- one Vortox `ROLE_TENURE`;
- one `CHARACTER_STATE` at evaluated revision;
- one source-Dreamer `PLAYER_ROLE_AT_REVISION`;
- one target `PLAYER_ROLE_AT_REVISION`;
- one Vortox `PLAYER_ROLE_AT_REVISION`;
- one `DREAMER_DELIVERY`.

Canonical order uses unchanged rank then unchanged primary identity:

1. `SOURCE_EVENT`;
2. `TASK`;
3. `ACTION_OPPORTUNITY`;
4. two `ROLE_TENURE`, sorted by `roleTenureId`;
5. `CHARACTER_STATE`;
6. role evidence sorted by `${playerId}@revision-${revision}`;
7. `DREAMER_DELIVERY`.

### Exact nine-entry set: target is current Vortox

When `delivery.targetPlayerId === vortoxConstraint.vortoxPlayerId`, target and Vortox role evidence are byte-identical: same player, seat, role `vortox`, native `DEMON`, native `EVIL`, and evaluated revision. The unchanged canonicalizer coalesces them by identical kind and primary identity. Exact cardinality is nine: one source event, one task, one opportunity, two tenures, one character state, two player-role entries (source plus target/Vortox), and one delivery.

The coalesced role entry simultaneously satisfies target and Vortox identity only if:

- its player/seat equal delivery target and constraint Vortox;
- role ID is literal `vortox`;
- character type is `DEMON` and default alignment is `EVIL`;
- revision equals fact/delivery/constraint evaluation revision;
- exactly one Vortox tenure entry has the same player/seat/role, `ACTIVE`, canonical constraint tenure ID, and acquisition not later than evaluation;
- exactly one source Dreamer role and active source tenure exist;
- zero `ABILITY_IMPAIRMENT` evidence exists;
- both delivered role IDs differ from the coalesced true role;
- canonical source re-derivation from pre-event state exact-compares the complete fact.

A second target/Vortox role entry with the same primary and different bytes is a canonicalizer conflict. An identical duplicate canonicalizes away and makes the supplied array noncanonical. Neither is accepted.

### Exact ten-entry set: target is not current Vortox

When target and Vortox players differ, exact cardinality is ten: the same fixed entries plus three distinct player-role entries: source Dreamer, target truth, and current Vortox. The validator requires each exact player/seat/role/revision; one matching active Vortox tenure; one active source tenure; zero impairment evidence; truth excluded twice; and exact source re-derivation.

The closed fact validator therefore branches only on `DREAMER_DELIVERY.targetPlayerId === vortoxRoleEvidence.playerId`. It requires exactly two role entries for the nine-set or exactly three for the ten-set; exactly two active tenure entries in both; exact allowed evidence kinds/counts; canonical order; no impairment; and no extra/duplicate identity. Normal Dreamer still requires truth in the pair. Source-impairment abnormal Dreamer still requires exactly one matching impairment. Other legacy rules remain unchanged.

The nine-set negative matrix independently rejects: remove any slot; insert an identical duplicate; substitute any field/identity; insert a conflicting same-primary role; add any allowed or unknown extra evidence; reorder any entries. The ten-set applies the same six independent mutation classes. Each class is a separate S claim below. Settlement creates no second terminal fact.

## mathematician

No Mathematician production file, event, resolver, delivery, window, own-ability exclusion, numeric policy, duplicate-holder policy, or distinct-player logic changes. The canonical V3 fact is abnormal and caused by another character, so the existing consumer counts Dreamer `sourcePlayerId` once within its accepted window. Nine versus ten evidence entries and two false fields do not change the player count. Normal Dreamer remains non-qualifying.

## projection

Keep the public view exact. Rename the existing file-private boolean to `allowAcceptedStreamOnlyHistory`; it is false for state-only player/AI builders and true only after the accepted-stream builder fully replays the stream.

False plus any V3 delivery throws actor-safe `PrivateKnowledgeUnavailable` before exposure. V1/V2 state-only behavior is unchanged. True relies on full replay for semantics and stored validation for shape/cross-links only.

Only source player and source AI receive historical target player/seat, `goodRole`, `evilRole`, and existing Dreamer model/stage representation. Non-source views receive none. No view exposes Vortox, constraint, tenure, reliability, cause, impairment, target truth, candidates, ledger, or which field normally would be true. Latest state never recomputes history.

## receipts

Every retryable failure saves no receipt, consumes no command ID, appends zero events, leaves version unchanged and opportunity OPEN, and creates no settlement/ledger fact. A successful retry with identical command ID after dependency repair creates one accepted receipt and one deterministic three-event batch. Deterministic command rejection retains existing receipt-bearing idempotence. Success receipt is written only after atomic append. Failed transient metadata is not history.

## failures

| Boundary | Exact result | failureStage | Exact terminal behavior |
|---|---|---|---|
| wrong version, actor, task, opportunity, self-target, or other existing deterministic validation | existing specific rejected code/message | none | rejection receipt; idempotent command consumption; zero accepted events |
| source DRUNK/POISONED represented or No Dashii unsupported | `ApplicationNotConfigured`; `Dreamer normal information capability is not configured for this source state` | `first-night-role-action` | retryable; no receipt; zero events; OPEN |
| missing/malformed/ambiguous canonical capability or Vortox proof | `DependencyExecutionFailed`; `Dreamer normal information capability could not be proven` | `first-night-role-action` | retryable; no receipt; zero events; OPEN |
| target/candidate/constructor cannot produce canonical result | `DependencyExecutionFailed`; `Dreamer normal information dependencies could not produce a canonical result` | `first-night-role-action` | retryable; no receipt; zero events; OPEN |
| prospective Dreamer `DomainError` | `DependencyExecutionFailed`; contained actor-safe domain message | existing `first-night-role-action` | retryable; no receipt; zero events; OPEN |
| unexpected prospective non-`DomainError` | `DependencyExecutionFailed`; contained generic message | existing `prospective-validation` | retryable; no receipt; zero events; OPEN |
| event/batch metadata failure | `MetadataGenerationFailed` | `event-metadata` | retryable; no receipt; zero events; OPEN |
| atomic append failure | `EventStoreAppendFailed` | `accepted-commit` | retryable; no success receipt; zero accepted events; OPEN |
| hostile V3/replay/ledger/state-only projection | existing fail-closed `DomainError` | boundary-specific, not an application receipt | no partial history and no hidden-data exposure |

Unknown errors expose no stack, Vortox identity, tenure, impairment, truth, candidate, or ledger detail. No failure becomes normal information.

## tests

Every row below is atomic and has one unique rule claim, one R class, one T class, one permitted primary-layer token, one primary test, an explicit supporting-test value, and one expected result. `NONE` means no supporting test is claimed.

### Primary claims

| ID | ruleClaim | R | T | primaryLayer | primaryTest | supportingTests | expectedResult |
|---|---|---|---|---|---|---|---|
| C01 | RC-C01 V1 replay meaning is unchanged | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | `packages/domain-core/src/rebuild.test.ts :: 2B19A3A-C01` | NONE | accepted V1 replay equals baseline |
| C02 | RC-C02 normal V2 replay meaning is unchanged | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | `packages/domain-core/src/rebuild.test.ts :: 2B19A3A-C02` | NONE | accepted V2 replay equals baseline |
| C03 | RC-C03 V1 state-only private projection remains accepted | R2 | T1 | PROJECTION | `packages/projections/src/private-knowledge-view.test.ts :: 2B19A3A-C03` | NONE | unchanged V1 view |
| C04 | RC-C04 V2 state-only private projection remains accepted | R2 | T1 | PROJECTION | `packages/projections/src/private-knowledge-view.test.ts :: 2B19A3A-C04` | NONE | unchanged V2 view |
| C05 | RC-C05 a canonical V3 has exactly the frozen shape | R1 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-C05` | NONE | exact V3 validates |
| C06 | RC-C06 a GOOD target succeeds through real accepted commands | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C06` | NONE | accepted three-event batch |
| C07 | RC-C07 a non-Vortox EVIL target succeeds through real accepted commands | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C07` | NONE | accepted three-event batch |
| C08 | RC-C08 the current Vortox is a legal Dreamer target | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C08` | NONE | accepted Vortox-target batch |
| C09 | RC-C09 V3 GOOD role uses native GOOD character type | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C09` | NONE | Townsfolk/Outsider only |
| C10 | RC-C10 V3 EVIL role uses native EVIL character type | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C10` | NONE | Minion/Demon only |
| C11 | RC-C11 both V3 roles exclude settlement-time truth | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C11` | NONE | neither role equals truth |
| C12 | RC-C12 a legal in-play false role remains selectable | R4 | T3 | PURE_POLICY_SEAM | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-C12` | NONE | deterministic selector may choose it |
| C13 | RC-C13 catalog reorder cannot change the pair | R4 | T3 | PURE_POLICY_SEAM | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-C13` | NONE | pair equality holds |
| C14 | RC-C14 locale variation cannot change the pair | R4 | T3 | PURE_POLICY_SEAM | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-C14` | NONE | pair equality holds |
| C15 | RC-C15 success metadata forms one exact atomic batch | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C15` | NONE | target/delivery/settlement only |
| C16 | RC-C16 complete-batch start plus pre-delivery state proves Vortox non-circularly | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `packages/domain-core/src/rebuild.test.ts :: 2B19A3A-C16` | NONE | accepted replay exact |
| C17 | RC-C17 accepted source DRUNK remains unsupported | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C17` | NONE | ApplicationNotConfigured/no receipt/zero events/OPEN |
| C18 | RC-C18 source POISONED does not produce V3 | R4 | T3 | PURE_POLICY_SEAM | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-C18` | NONE | non-V3 classification |
| C19 | RC-C19 an impaired current Vortox does not produce V3 | R4 | T3 | PURE_POLICY_SEAM | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-C19` | NONE | non-V3 classification |
| C20 | RC-C20 candidate shortage fails closed | R3 | T3 | PURE_POLICY_SEAM | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-C20` | NONE | exact DomainError |
| C21 | RC-C21 missing Vortox tenure rejects replay | R3 | T2 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/rebuild.test.ts :: 2B19A3A-C21` | NONE | replay throws |
| C22 | RC-C22 duplicate Vortox tenure rejects replay | R3 | T2 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/rebuild.test.ts :: 2B19A3A-C22` | NONE | replay throws |
| C23 | RC-C23 stale or ended Vortox tenure rejects replay | R3 | T2 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/rebuild.test.ts :: 2B19A3A-C23` | NONE | replay throws |
| C24 | RC-C24 wrong Vortox identity rejects replay | R3 | T2 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/rebuild.test.ts :: 2B19A3A-C24` | NONE | replay throws |
| C25 | RC-C25 wrong Vortox evaluated revision rejects replay | R3 | T2 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/rebuild.test.ts :: 2B19A3A-C25` | NONE | replay throws |
| C26 | RC-C26 conflicting applicability evidence rejects replay | R3 | T2 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/rebuild.test.ts :: 2B19A3A-C26` | NONE | replay throws |
| C27 | RC-C27 unresolved capability is receipt-free | R3 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C27` | NONE | exact dependency failure/no receipt/zero events/OPEN |
| C28 | RC-C28 candidate failure is receipt-free | R3 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C28` | NONE | exact dependency failure/no receipt/zero events/OPEN |
| C29 | RC-C29 prospective DomainError preserves its stage | R3 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C29` | NONE | first-night-role-action/no receipt |
| C30 | RC-C30 unexpected prospective failure preserves its stage | R3 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C30` | NONE | prospective-validation/no receipt |
| C31 | RC-C31 metadata failure preserves its code and stage | R3 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C31` | NONE | MetadataGenerationFailed/event-metadata/no receipt |
| C32 | RC-C32 append failure preserves its code and stage | R3 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C32` | NONE | EventStoreAppendFailed/accepted-commit/no receipt |
| C33 | RC-C33 identical command ID succeeds after dependency repair | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C33` | NONE | one receipt and one batch |
| C34 | RC-C34 target-current-Vortox derives the exact nine-entry fact | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-C34` | NONE | one valid abnormal fact with 9 entries |
| C35 | RC-C35 non-Vortox target derives the exact ten-entry fact | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-C35` | NONE | one valid abnormal fact with 10 entries |
| C36 | RC-C36 V3 fact contains zero impairment evidence | R1 | T2 | STRUCTURAL_VALIDATION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-C36` | NONE | ABILITY_IMPAIRMENT count is zero |
| C37 | RC-C37 settlement creates no second terminal fact | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C37` | NONE | fact count remains one |
| C38 | RC-C38 later Mathematician counts the Dreamer source once | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/mathematician-information.test.ts :: 2B19A3A-C38` | NONE | count contribution is one player |
| C39 | RC-C39 normal Dreamer is not a Mathematician abnormality | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/mathematician-information.test.ts :: 2B19A3A-C39` | NONE | contribution is zero |
| C40 | RC-C40 source player sees the accepted historical pair | R1 | T1 | PROJECTION | `packages/projections/src/private-knowledge-view.test.ts :: 2B19A3A-C40` | NONE | target/good/evil visible |
| C41 | RC-C41 source AI sees the accepted historical pair | R1 | T1 | PROJECTION | `packages/projections/src/private-knowledge-view.test.ts :: 2B19A3A-C41` | NONE | target/good/evil visible |
| C42 | RC-C42 non-source viewer sees no Dreamer pair | R1 | T1 | PROJECTION | `packages/projections/src/private-knowledge-view.test.ts :: 2B19A3A-C42` | NONE | Dreamer fields absent |
| C43 | RC-C43 accepted-stream view leaks no Vortox fact | R1 | T1 | PROJECTION | `packages/projections/src/private-knowledge-view.test.ts :: 2B19A3A-C43` | NONE | hidden fields absent |
| C44 | RC-C44 state-only projection rejects V3 | R3 | T1 | PROJECTION | `packages/projections/src/private-knowledge-view.test.ts :: 2B19A3A-C44` | NONE | PrivateKnowledgeUnavailable |
| C45 | RC-C45 accepted-stream projection accepts V3 only after replay | R1 | T1 | PROJECTION | `packages/projections/src/private-knowledge-view.test.ts :: 2B19A3A-C45` | NONE | view returned after successful replay |
| C46 | RC-C46 pre-delivery target character change changes excluded truth | R4 | T3 | PURE_POLICY_SEAM | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-C46` | NONE | constructor excludes changed current role |
| C47 | RC-C47 post-delivery character change does not rewrite stored pair | R4 | T3 | PURE_POLICY_SEAM | `packages/projections/src/private-knowledge-view.test.ts :: 2B19A3A-C47` | NONE | accepted historical payload bytes unchanged; no accepted producer claimed |
| C48 | RC-C48 accepted Dreamer stream continues to terminal Seamstress | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | `packages/application/src/game-application-service.test.ts :: 2B19A3A-C48` | NONE | both terminal chains replay |
| C49 | RC-C49 Dreamer remains 61/80 between Clockmaker and Seamstress | R1 | T2 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-C49` | NONE | exact relative nightsheet order |
| C50 | RC-C50 Vortox has no first-night wake entry | R1 | T2 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-C50` | NONE | no Vortox first-night task |
| C51 | RC-C51 Ubuntu ordinary gate passes exact HEAD | R1 | T1 | CROSS_PLATFORM_CI | `Ubuntu / Validate` | NONE | SUCCESS on exact SHA |
| C52 | RC-C52 Ubuntu single-fork coverage gate passes exact HEAD | R1 | T1 | CROSS_PLATFORM_CI | `Ubuntu / Coverage` | NONE | SUCCESS on exact SHA |
| C53 | RC-C53 Windows deterministic gate passes exact HEAD | R1 | T1 | CROSS_PLATFORM_CI | `Windows / Deterministic` | NONE | SUCCESS on exact SHA |

### Supporting claims

| ID | ruleClaim | R | T | primaryLayer | primaryTest | supportingTests | expectedResult |
|---|---|---|---|---|---|---|---|
| S01 | RC-S01 a missing V3 top-level key rejects | R3 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S01` | NONE | invalid, no throw escapes |
| S02 | RC-S02 an extra V3 top-level key rejects | R3 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S02` | NONE | invalid, no throw escapes |
| S03 | RC-S03 a wrong V3 literal or primitive type rejects | R3 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S03` | NONE | invalid, no throw escapes |
| S04 | RC-S04 a V3 accessor rejects without invocation | R3 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S04` | NONE | invalid and getter count 0 |
| S05 | RC-S05 a throwing Proxy rejects | R3 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S05` | NONE | invalid, no throw escapes |
| S06 | RC-S06 a revoked Proxy rejects | R3 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S06` | NONE | invalid, no throw escapes |
| S07 | RC-S07 a symbol-bearing V3 rejects | R3 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S07` | NONE | invalid |
| S08 | RC-S08 a cyclic V3 rejects | R3 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S08` | NONE | invalid |
| S09 | RC-S09 a nonplain V3 record rejects | R3 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S09` | NONE | invalid |
| S10 | RC-S10 a sparse V3 array position rejects | R3 | T1 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S10` | NONE | invalid |
| S11 | RC-S11 removing any nine-set evidence slot rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S11` | NONE | every removal invalid |
| S12 | RC-S12 duplicating any nine-set evidence slot rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S12` | NONE | every duplicate invalid |
| S13 | RC-S13 substituting any nine-set evidence identity rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S13` | NONE | every substitution invalid |
| S14 | RC-S14 conflicting same-primary nine-set role evidence rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S14` | NONE | canonicalizer conflict |
| S15 | RC-S15 adding evidence to the nine-set rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S15` | NONE | noncanonical exact set |
| S16 | RC-S16 reordering the nine-set rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S16` | NONE | noncanonical order |
| S17 | RC-S17 removing any ten-set evidence slot rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S17` | NONE | every removal invalid |
| S18 | RC-S18 duplicating any ten-set evidence slot rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S18` | NONE | every duplicate invalid |
| S19 | RC-S19 substituting any ten-set evidence identity rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S19` | NONE | every substitution invalid |
| S20 | RC-S20 conflicting same-primary ten-set role evidence rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S20` | NONE | canonicalizer conflict |
| S21 | RC-S21 adding evidence to the ten-set rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S21` | NONE | noncanonical exact set |
| S22 | RC-S22 reordering the ten-set rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts :: 2B19A3A-S22` | NONE | noncanonical order |
| S23 | RC-S23 a naked V3 delivery rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/domain-batch-semantics.test.ts :: 2B19A3A-S23` | NONE | batch invalid |
| S24 | RC-S24 a partial Dreamer batch rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/domain-batch-semantics.test.ts :: 2B19A3A-S24` | NONE | batch invalid |
| S25 | RC-S25 a reordered Dreamer batch rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/domain-batch-semantics.test.ts :: 2B19A3A-S25` | NONE | batch invalid |
| S26 | RC-S26 a duplicate Dreamer event rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/domain-batch-semantics.test.ts :: 2B19A3A-S26` | NONE | batch invalid |
| S27 | RC-S27 a split Dreamer batch rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/domain-batch-semantics.test.ts :: 2B19A3A-S27` | NONE | batch invalid |
| S28 | RC-S28 a cross-batch Dreamer chain rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/domain-batch-semantics.test.ts :: 2B19A3A-S28` | NONE | batch invalid |
| S29 | RC-S29 mismatched Dreamer batch metadata rejects | R3 | T1 | HOSTILE_REPLAY_REJECTION | `packages/domain-core/src/domain-batch-semantics.test.ts :: 2B19A3A-S29` | NONE | batch invalid |
| S30 | RC-S30 V1 clone is reference-independent | R2 | T3 | LEGACY_REPLAY_COMPATIBILITY | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S30` | NONE | nested references differ |
| S31 | RC-S31 V2 clone is reference-independent | R2 | T3 | LEGACY_REPLAY_COMPATIBILITY | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S31` | NONE | nested references differ |
| S32 | RC-S32 V3 clone is reference-independent | R1 | T3 | STRUCTURAL_VALIDATION | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S32` | NONE | nested references differ |
| S33 | RC-S33 cross-version equality is false | R2 | T3 | LEGACY_REPLAY_COMPATIBILITY | `packages/domain-core/src/dreamer.test.ts :: 2B19A3A-S33` | NONE | V1/V2/V3 pairwise false |
| S34 | RC-S34 semantic equality uses no serialization | R3 | T3 | STRUCTURAL_VALIDATION | `STATIC_SERIALIZATION_SCAN` | NONE | no forbidden equality call |
| S35 | RC-S35 every trace row has the eight required columns | R3 | T1 | STRUCTURAL_VALIDATION | `STATIC_TRACEABILITY_SCHEMA_AUDIT` | NONE | all C/S rows complete |
| S36 | RC-S36 compound or unknown primary-layer tokens reject | R3 | T1 | STRUCTURAL_VALIDATION | `STATIC_PRIMARY_LAYER_TOKEN_AUDIT` | NONE | only seven tokens present |
| S37 | RC-S37 no R3 or R4 seam is labeled accepted R1 | R3 | T1 | STRUCTURAL_VALIDATION | `STATIC_REACHABILITY_LABEL_AUDIT` | NONE | labels match this table |
| S38 | RC-S38 changed paths are a subset of the closed allowlist | R3 | T1 | STRUCTURAL_VALIDATION | `STATIC_DIFF_ALLOWLIST_AUDIT` | NONE | every changed path listed below |
| S39 | RC-S39 accepted baseline Dreamer harness files remain byte-unchanged | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | `STATIC_BASELINE_FIXTURE_DIFF_AUDIT` | NONE | zero diff in three read-only paths |

`STATIC_TRACEABILITY_SCHEMA_AUDIT` parses both tables and requires unique ID, unique `RC-*`, exactly one of R1-R4, exactly one of T1-T3, exactly one of the seven tokens, nonempty primaryTest, explicit supportingTests, and nonempty expectedResult. `STATIC_PRIMARY_LAYER_TOKEN_AUDIT` rejects `/`, `+`, comma-separated, free-form, and unknown layer values. `STATIC_REACHABILITY_LABEL_AUDIT` compares each row to this frozen matrix. These audits may be implemented as deterministic review commands; they do not authorize a new production or support script.

## affectedFiles

### Exact production allowlist

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

No sixth production file is allowed. Added production LOC must be `<=1000`. No edit is allowed in events, event-applier, rebuild, game-state, first-night-action-opportunity, mathematician production, workflows, dependencies, timeouts, config, or new production files.

### Exact test allowlist

1. `packages/domain-core/src/dreamer.test.ts`
2. `packages/domain-core/src/domain-batch-semantics.test.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
4. `packages/domain-core/src/rebuild.test.ts`
5. `packages/application/src/game-application-service.test.ts`
6. `packages/application/src/mathematician-information.test.ts`
7. `packages/projections/src/private-knowledge-view.test.ts`

### Exact new harness/fixture allowance

At most three new files, with these exact paths and purposes only:

1. `packages/test-harness/src/dreamer-vortox-v3-accepted-stream.ts` — deterministic live accepted command-stream builder for this Slice;
2. `packages/test-harness/src/dreamer-vortox-v3-accepted-stream-fixture.ts` — typed immutable loader/export for the captured stream;
3. `packages/test-harness/src/fixtures/dreamer-vortox-v3-accepted-stream.json` — canonical immutable event capture produced only from the live builder and byte-compared in tests.

No other new or modified harness/fixture file is allowed. If implementation does not need one or more of these, it must not create them. Maximum new support-file count is three.

These existing accepted baseline paths are read-only and must have zero diff:

- `packages/test-harness/src/dreamer-v3-accepted-stream.ts`
- `packages/test-harness/src/dreamer-v3-accepted-stream-fixture.ts`
- `packages/test-harness/src/fixtures/dreamer-v3-accepted-stream.json`

### Exact documentation/control allowlist

- `docs/architecture/2B19A3A-go-no-go-under-governance-v1.md`
- `docs/rules/evidence/2B19A3A.md`
- `docs/implementation/phase-3-slice-2b19a3a-design.md`
- `docs/implementation/phase-3-slice-2b19a3a-design-review-round-1.md`
- `docs/implementation/phase-3-slice-2b19a3a-design-round-2.md`
- `docs/implementation/phase-3-slice-2b19a3a-design-review-round-2.md`
- `docs/implementation/phase-3-slice-2b19a3a-status.md`
- `docs/implementation/phase-3-slice-2b19a3a-test-traceability.md`
- `docs/implementation/phase-3-slice-2b19a3a-final-review-round-1.md`
- `docs/implementation/phase-3-slice-2b19a3a-final-review-round-2.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`

The four already materialized governance/evidence/Round 1 paths are included only because they are additions relative to acceptedMain; their exact reviewed bytes and hashes are immutable and any further byte change rejects. `docs/PROJECT_STATE.md` is forbidden. PR body/comments are GitHub records, not local path exceptions. Post-merge review archives are a separate docs-only closeout and are not authorized in the feature diff.

`STATIC_DIFF_ALLOWLIST_AUDIT` compares every changed path against the exact union above and rejects every unlisted production, test, harness, fixture, workflow, dependency, configuration, or documentation path. It separately verifies exactly five-or-fewer changed production files, no production file outside the exact five, `<=1000` added production LOC, at most three exact new support files, and zero diff in the three baseline harness paths.

## CI

Use Node `24.15.0`, pnpm `11.7.0`, frozen lockfile, and existing `VITEST_MAX_FORKS=1` coverage. Run file-scoped Vitest for each changed test, ESLint for each changed TypeScript file, then `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, and `git diff --check`. Do not change workflow, dependency, timeout, Vitest config, thresholds, skip/only/todo, or semantics. Exact frozen product HEAD must independently pass Ubuntu ordinary, Ubuntu single-fork coverage, and Windows deterministic CI. No CI status is inherited across commits.

## documentation

After implementation, materialize status and complete C01-C53/S01-S39 traceability with exact evidence/design/review hashes, changed-file count, production LOC, gates, and exact-head CI. The PR body contains Rule Evidence, Rule Claims Implemented, Explicitly Unsupported Rules, Rule Source Revisions, and Rule-to-Test Traceability.

Only after merge update role coverage to Slice `PARTIAL / EFFECTIVE_SOURCE_VORTOX_FALSE_ONLY`; Dreamer `PARTIAL`; Vortox `NOT_STARTED`; Mathematician `PARTIAL`. No COMPLETE promotion. Final review/audit comments follow `REVIEW_PROTOCOL.md` and exact reviewed HEAD.

## rollback

Before publication revert only Slice implementation/test/status changes while preserving governance, evidence, and design/review history. After publication use a normal attributed revert; never rewrite accepted history or force-push. V1/V2 need no migration. Removing V3 production cannot reinterpret accepted V3 as V2 and requires explicit compatibility review.

## outOfScope

- source DRUNK or POISONED Dreamer delivery under Vortox; deferred to 2B19A3B;
- impaired/dead/otherwise ineffective Vortox accepted behavior;
- No Dashii adjacency/poisoning;
- gained Dreamer;
- Storyteller free pair choice or candidate persistence;
- Traveller, registration, Spy/Recluse misregistration;
- accepted producer for target character change before or after delivery;
- other-night behavior;
- general death, character/alignment change, impairment, effect, or Vortox platform;
- new event, event name, GameState field, evidence variant, negative-evidence schema, generic context, public state-only resolver, projection field, workflow, dependency, timeout, or config;
- Mathematician production changes;
- FIRST_NIGHT completion, DAY, Phase 2C, 2B19A3B, 2B19A4, 2B19B, or later Slice;
- claiming Dreamer/Vortox complete.

## completionCriteria

1. Exact Round 2 materialization receives independent `RULE_DESIGN_PASS` before production/test edits.
2. Parent/evidence/governance/review hashes equal metadata and conflicts remain empty.
3. V1/V2 exact behavior remains unchanged.
4. V3 matches exact 20-key/nested contracts and stores positive facts only.
5. Source impairment retains precedence; accepted source DRUNK remains R1 unsupported.
6. Same T2 resolver proves effective Vortox at command, prospective batch, pre-delivery replay, and ledger derivation.
7. No payload/ledger/caller claims impairment absence.
8. Candidate policy uses native types, double truth exclusion, in-play legality, and `compareStableId` only.
9. Stored validator remains shape/cross-link only; state-only projection rejects V3.
10. Success is exact atomic target-V2/delivery-V3/settlement.
11. Existing evidence union/canonicalizer remain unchanged.
12. Target-current-Vortox produces exact canonical nine-set and non-Vortox target produces exact ten-set.
13. Coalesced role proof still requires exact Vortox player/seat/role/revision, one active tenure, zero impairment evidence, truth exclusion, and exact source re-derivation.
14. All twelve nine/ten negative-matrix claims S11-S22 reject.
15. One abnormal fact is derived; settlement adds none.
16. Existing Mathematician counts source once and normal Dreamer zero.
17. Accepted-stream source player/AI projection is private and leaks no Vortox/truth fact.
18. Failures preserve exact receipt/retry/zero-event/OPEN contracts.
19. Every C/S row has one unique claim, R, T, permitted layer, primary test, support declaration, and expected result.
20. Post-delivery change is only R4/PURE_POLICY_SEAM; no accepted producer is claimed.
21. Source POISONED and impaired Vortox are R4; candidate shortage R3; hostile mutations R3; positive success R1.
22. C01-C53 and S01-S39 pass in their exact rows.
23. Diff is a subset of the closed path set; baseline harness is unchanged; at most three named new support files exist.
24. Production diff stays within exact five and `<=1000` added LOC.
25. No forbidden surface/path changes.
26. Targeted checks and all full gates pass.
27. Exact frozen HEAD passes all three CI claims.
28. Complete final review returns `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`, `remainingBlockers=[]` for exact PR HEAD.
29. Both verbatim audit comments are re-read and match PR HEAD before merge.
30. Worktree is clean, local/remote/PR HEADs match, and no later Slice started.

## stopLoss

Stop without inference or implementation if rule source/evidence/governance hash changes; conflict appears; final allowed design review is not `RULE_DESIGN_PASS`; source-impaired semantics enter; canonical pre-event proof fails; a new event/state/evidence/context/resolver/projection/generic platform is required; a sixth production file or over 1000 added production LOC is proposed; any unlisted path is required; V1/V2 weakens; Mathematician production must change; an R3/R4 test needs false R1 labeling; exact 9/10 evidence cannot validate with unchanged canonicalizer; repeated gate failure, unsafe rewrite, permission failure, unexplained dirty file, red exact-head CI, incomplete final review, or audit mismatch occurs.

The user hard stop above eight production files or 1500 LOC is not permission to exceed this stricter design ceiling. No Design Round 3 exists. A remaining architecture blocker after this round is `RESLICE_REQUIRED`; substantive rule conflict/source unavailability is `HUMAN_BLOCKED`.

## coverageStatus

`PARTIAL / EFFECTIVE_SOURCE_VORTOX_FALSE_ONLY`

Dreamer remains PARTIAL because impaired-source, No Dashii, gained Dreamer, free Storyteller choice, Traveller, life/death, registration, other-night, and changes remain incomplete. Vortox remains NOT_STARTED because only one bounded effective-current constraint is consumed. Mathematician remains PARTIAL because production is unchanged. FIRST_NIGHT remains incomplete.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_2
