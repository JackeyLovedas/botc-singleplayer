# Phase 3 Slice 2B18B — Mathematician First-Night Information Design, Round 2

## Metadata

```yaml
sliceId: 2B18B
designRound: 2 / 2
replaces: docs/implementation/phase-3-slice-2b18b-design.md
replacedDesignSha256: 4267e60199db1ecc5e4cf6c96179dbf532b21f9e27b33730ca28cc5f9963867f
round1Review: docs/implementation/phase-3-slice-2b18b-design-review-round-1.md
round1ReviewSha256: cf1e2ac0abbd805be3f0dae1eb8b9b3d30a5bb4c60d9303a4b8d7fad7125e9bf
resolutionAuthorization: OPTION_A_LEGACY_V1_GAINED_MATHEMATICIAN_ONLY_WITHOUT_BASE_TASK
resolutionKind: IMPLEMENTATION_SUPPORT_BOUNDARY
ruleReady: true
coverageStatus: PARTIAL
ruleOverrideAdded: false
officialRuleChanged: false
approvedSimulatorPoliciesChanged: false
legacyHistoryReinterpreted: false
originalEvidence: docs/rules/evidence/2B18B.md
originalEvidenceSha256: eae53e0eed5d54c5c4a78d31543749787359f61b2e9b7c3f0ceb27069d2471c1
resolvedEvidence: docs/rules/evidence/2B18B-resolved.md
resolvedEvidenceSha256: 0c4893de8f38dfc05876f89744976a7c54afc6bd41465f2e1198d22b0844a4c8
accepted2B18ABoundary: LEDGER_ONLY
firstNightOnly: true
starts2B19: false
```

This is the complete implementation authority. It does not require Round 1 or its review to supply missing definitions.

## ruleAuthority

Authority is USER_OVERRIDES, `2B18-resolved.md`, `2B18B-resolved.md`, official BOTC Wiki, official nightsheet, Chinese Wiki, then accepted repository artifacts only as implementation evidence. Resolved revisions are: Official Mathematician oldid `3109`, SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`; Philosopher `2421`, `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`; States `1039`, `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`; Vortox `3017`, `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`; Chinese Mathematician `6214`, `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`; Philosopher `5125`, `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be`; Vortox `6198`, `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`; nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`; retrieval `2026-07-13T07:36:51Z`.

Order remains Philosopher, Snake Charmer, Witch, Cerenovus, Clockmaker, Dreamer, Seamstress, Mathematician, Dawn. Option A is a product support boundary, not an official-rule claim. No override changes.

## accepted2B18ABoundary

Retain ledger/audit/window v1, exact canonical base/V1/V2 instance provenance, closed evidence, dense canonical arrays, replay and historical validation. Caller-created state or ledger is never accepted-history proof. Existing facts and meanings are unchanged; only one closed Math terminal adapter is added.

## eventStreamTrustBoundary

There is no package-root Math decision resolver. `packages/domain-core/src/index.ts` must not export `resolveFirstNightMathematicianInformationFromEventStream`, `InternalMathematicianResolution`, count/source/window/candidate helpers, stored validators, or test seams. `packages/application/src/index.ts` exports none of them. Runtime namespace and `@ts-expect-error` export-absence tests freeze this.

Trusted implementation lives in `packages/domain-core/src/mathematician-internal.ts`; `GameApplicationService` alone uses a repository-relative internal import. Because `packages/domain-core/package.json` exports only `.`, ordinary package consumers, players and AI cannot use the internal submodule. Public domain root may export event/state/view value types, payload-shape validators and deterministic ID format/parser required for canonical event handling, but no function returning hidden truth, state, source, window, facts or candidates.

Internal entry:

```ts
function resolveFirstNightMathematicianInformationFromEventStream(
  events: readonly AnyDomainEventEnvelope[],
  taskId: ScheduledTaskId,
): InternalMathematicianResolution;
```

It makes one dense canonical capture and never rereads caller objects; validates the stream; rebuilds; validates plan/progress/ledger/roster/`CurrentCharacterStateSet`/impairments/tenures/grants/opportunities/insertions; identifies target; builds a fully validated task inventory; performs Option A classification; then supported task checks, source/count/effect/Vortox/candidates/payload.

Application loads via existing `CommandCommitStore.loadDomainEvents`. Internal resolver rebuilt state is compared to pipeline state with exact closed keys:

```ts
type MathematicianPipelineStateFingerprint = {
  readonly gameId: GameId;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly phase: GamePhase;
  readonly nextTask: ScheduledTask | null;
  readonly firstNightAbilityOutcomeLedger: FirstNightAbilityOutcomeLedger;
  readonly roster: PlayerRoster;
  readonly currentCharacterState: CurrentCharacterStateSet;
};
```

All eight keys use canonical structural equality. Mismatch is receipt-free retryable `CanonicalStateRebuildFailed` at `first-night-role-information`.

## publicAndPrivateAPI

Hidden canonical resolution never crosses domain/application package roots. Successful Math command uses `acceptedWithEventSummary`, exposing only game/version/count/types metadata already defined by that result; it never returns canonical event payloads. Failed public command results contain no hidden details.

Safe projection APIs return only `PlayerPrivateKnowledgeView`:

```ts
export function buildPlayerPrivateKnowledgeViewFromEventStream(
  events: readonly AnyDomainEventEnvelope[], viewerPlayerId: PlayerId,
): PlayerPrivateKnowledgeView;
export function buildAiPrivateKnowledgeViewFromEventStream(
  events: readonly AnyDomainEventEnvelope[], viewerPlayerId: PlayerId,
): PlayerPrivateKnowledgeView;
```

Existing state APIs remain for backward compatibility with histories having no Math delivery/settlement. If `state.mathematicianInformation` exists or any Math settlement exists, `buildPlayerPrivateKnowledgeView(state,viewer)` and AI equivalent throw `PrivateKnowledgeUnavailable`; they never project Math from caller-created state.

Migration: all new Math projection tests and application acceptance tests call the event-stream APIs with events loaded from the store; existing non-Math tests/callers remain state-backed. Repository search shows no non-test production projection caller requiring migration. Any future production Math caller must load the full stream from the command store and use the event-stream API.

## nonRecursiveValidationPipeline

Layer A, pre-event replay validation, never accepts or validates a complete stream:

```ts
function validateMathematicianDeliveryAgainstPreEventState(input: {
  readonly preEventState: GameState;
  readonly deliveryEvent: MathematicianInformationDeliveredEnvelope;
  readonly settlementEvent: ScheduledTaskSettledEnvelope;
}): MathematicianValidationResult;
```

`validateDomainEventStream`, batch semantics and event applier use only Layer A while replaying; Layer A never calls `validateDomainEventStream`, `rebuildGameState`, the full-stream validator or projection.

Layer B, projection/full-history validation:

```ts
function replayTrustedMathematicianProjectionStream(
  events: readonly AnyDomainEventEnvelope[],
): { readonly finalState: GameState; readonly checkpoints: readonly MathematicianDeliveryCheckpoint[] };
type MathematicianDeliveryCheckpoint = {
  readonly deliveryEventIndex: number;
  readonly preEventState: GameState;
  readonly deliveryEvent: MathematicianInformationDeliveredEnvelope;
  readonly settlementEvent: ScheduledTaskSettledEnvelope;
};
```

It canonical-captures, calls stream validation once, then performs a one-pass replay collecting cloned pre-event checkpoints. During both passes, Math events use Layer A only. For each checkpoint, `validateStoredMathematicianInformationDelivered({acceptedEvents,checkpoint,finalState})` compares historical and stored truth without recursively invoking stream validation/rebuild. Safe projection builds only after every checkpoint passes. No public API accepts any checkpoint or state proof.

## countWindow

```ts
export type FirstNightMathematicianCountWindow = {
  readonly windowVersion: typeof FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION;
  readonly gameId: GameId; readonly nightNumber: 1;
  readonly rulesBaselineVersion: string;
  readonly firstNightInitializedEventId: EventId;
  readonly startEventSequence: number; readonly startBoundary: "EXCLUSIVE";
  readonly endEventSequence: number; readonly endBoundary: "INCLUSIVE";
};
```

Exact nine keys. Lower is unique accepted initialization; upper is last accepted pre-resolution event. Only `(start,end]` facts participate. Current delivery is absent; later history never rewrites it; no dawn/other-night window.

## countClassification

```ts
export const MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION = "mathematician-first-night-count-resolution-v1" as const;
export type MathematicianCount = 0|1|2|3|4|5|6|7|8|9|10|11;
export type MathematicianAbnormalPlayer = { readonly playerId: PlayerId; readonly seatNumber: SeatNumber; readonly supportingFactIds: readonly FirstNightAbilityOutcomeFactId[] };
export type MathematicianBlockingUnresolvedFact = { readonly auditFactId: FirstNightAbilityOutcomeFactId; readonly sourcePlayerId: PlayerId; readonly sourceSeatNumber: SeatNumber; readonly abilityRoleId: RoleId; readonly abilityTaskId: ScheduledTaskId; readonly causeKind: AbilityOutcomeCause };
type MathematicianCountResolutionBase = {
 readonly resolutionModelVersion: typeof MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION;
 readonly window: FirstNightMathematicianCountWindow; readonly resolvingSource: MathematicianSourceContract;
 readonly resolvingAbilityInstanceId: FirstNightAbilityInstanceId; readonly evaluatedThroughEventSequence: number;
 readonly qualifyingAbnormalFactIds: readonly FirstNightAbilityOutcomeFactId[];
 readonly distinctAbnormalPlayers: readonly MathematicianAbnormalPlayer[];
 readonly excludedResolvingSourceFactIds: readonly FirstNightAbilityOutcomeFactId[];
 readonly excludedOwnAbilityFactIds: readonly FirstNightAbilityOutcomeFactId[];
 readonly ignoredNormalFactIds: readonly FirstNightAbilityOutcomeFactId[];
 readonly ignoredPendingFactIds: readonly FirstNightAbilityOutcomeFactId[];
 readonly redundantUnresolvedFactIds: readonly FirstNightAbilityOutcomeFactId[];
};
type FirstNightMathematicianCountResolution =
 | MathematicianCountResolutionBase & { readonly kind:"RESOLVED"; readonly trueCount:MathematicianCount }
 | MathematicianCountResolutionBase & { readonly kind:"UNRESOLVED"; readonly currentPartialCount:MathematicianCount; readonly blockingUnresolvedFacts:readonly MathematicianBlockingUnresolvedFact[] };
```

Internal only. Exact disjoint precedence: own instance; remaining source-player facts; NORMAL; PENDING_TRIGGER; ABNORMAL+`causedByAnotherCharacterAbility=true`; ABNORMAL+false is canonical error; provisional UNRESOLVED; deduplicate qualifying by player; same-player unresolved redundant, otherwise blocking. System info, impairment existence and impaired-correct result do not count. Players sort seat then ID code-unit; fact IDs code-unit; dense/unique. Count is player length, 0..11.

## resolvingSourceExclusion

Every fact from resolving player is excluded after own-instance precedence. Historical player identity, not current role, controls it. Other-player earlier Math abnormal remains eligible.

## ownAbilityExclusion

Exact current instance ID is excluded first. Buckets are disjoint. Another holder has another canonical instance and may count an earlier abnormal result.

## duplicateHolderTemporalBehavior

Supported V2: base first, then gained by source seat then task ID code-unit. Earlier never sees future; later sees earlier fact only inside its window; earlier NORMAL adds zero, ABNORMAL may add one player; no recomputation. V1 follows Option A below.

## canonicalRoleTenureSnapshot

```ts
export type MathematicianRoleTenureSnapshot = {
 readonly roleTenureId: RoleTenureId; readonly playerId: PlayerId; readonly seatNumber: SeatNumber;
 readonly roleId: "mathematician"|"philosopher"|"vortox";
 readonly acquiredCharacterStateRevision: number;
 readonly endedCharacterStateRevision: number|null;
};
```

Exact six keys. Active at revision R iff acquired `<=R` and ended is null or `R<ended`. Add `mathematician` to tracked role-tenure role IDs without changing existing role semantics.

## baseSourceContract

```ts
export type BaseMathematicianSourceContract = {
 readonly kind:"BASE_MATHEMATICIAN"; readonly taskPlanVersion:FirstNightTaskPlanVersion;
 readonly taskId:ScheduledTaskId; readonly sourcePlayerId:PlayerId; readonly sourceSeatNumber:SeatNumber;
 readonly sourceRole:RoleSetupSnapshot; readonly sourceRoleAtSettlement:RoleSetupSnapshot;
 readonly sourceRoleTenure:MathematicianRoleTenureSnapshot;
 readonly settlementCharacterStateRevision:number;
 readonly abilityInstance:FirstNightAbilityInstanceProvenance & {readonly kind:"BASE_ROLE_TASK"};
};
```

Require unique ROLE Math task/canonical ID, roster match, both snapshots exact catalog Math, active Math tenure at settlement, `CurrentCharacterStateSet.revision` equality, canonical base instance, no grant/insertion. V1/V2 base-only supported.

## gainedV1SourceContract

```ts
export type PhilosopherGainedMathematicianV1SourceContract = {
 readonly kind:"PHILOSOPHER_GAINED_MATHEMATICIAN_V1"; readonly taskPlanVersion:"first-night-task-plan-v1";
 readonly taskId:ScheduledTaskId; readonly sourcePlayerId:PlayerId; readonly sourceSeatNumber:SeatNumber;
 readonly sourceRole:RoleSetupSnapshot; readonly sourceRoleAtSettlement:RoleSetupSnapshot;
 readonly sourceRoleTenure:MathematicianRoleTenureSnapshot; readonly chosenRole:RoleSetupSnapshot;
 readonly philosopherTaskId:ScheduledTaskId; readonly philosopherOpportunityId:ActionOpportunityId;
 readonly grantId:GrantedAbilityId; readonly sourceCharacterStateRevision:number;
 readonly settlementCharacterStateRevision:number;
 readonly abilityInstance:FirstNightAbilityInstanceProvenance & {readonly kind:"PHILOSOPHER_GAINED_TASK_V1"};
};
```

Exact V1 grammar/insertion/choice/grant/original opportunity+task/player/seat/Philosopher source/Math choice/revision/active Philosopher tenure/instance; no V2 field; no reorder/migration.

## gainedV2SourceContract

Same keys as V1 plus exact `schedulingVersion:"philosopher-gained-first-night-scheduling-v2"`, kind V2, plan v2 and V2 instance. V2 insertion/grant/task all cross-link. Define `MathematicianSourceContract` as exact base|V1|V2 union. Any generation mixing rejects.

## Legacy V1 Support Boundary

First build a fully validated historical inventory; classifier cannot accept raw plan/state:

```ts
type ValidatedV1GainedMathematicianChain = {
 readonly task:ScheduledTask; readonly insertion:FirstNightTaskInsertedPayload;
 readonly choice:PhilosopherAbilityChosenPayload; readonly grant:PhilosopherAbilityGrantedPayload;
 readonly originalOpportunity:FirstNightActionOpportunity;
 readonly sourceRosterEntry:PlayerRosterEntry; readonly sourceRoleAtGrant:CurrentCharacterState;
 readonly abilityInstance:FirstNightAbilityInstanceProvenance & {readonly kind:"PHILOSOPHER_GAINED_TASK_V1"};
};
type ValidatedMathematicianTaskInventory = {
 readonly taskPlanVersion:FirstNightTaskPlanVersion;
 readonly baseTasks:readonly ScheduledTask[];
 readonly gainedV1Chains:readonly ValidatedV1GainedMathematicianChain[];
 readonly gainedV2Tasks:readonly ScheduledTask[];
};
type LegacyV1Classification =
 | {readonly kind:"SUPPORTED"}
 | {readonly kind:"UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER";readonly baseTaskId:ScheduledTaskId;readonly gainedTaskId:ScheduledTaskId};
```

Inventory construction order is exact: validate stream/rebuilt state; validate plan against source facts; parse every Math task ID/source/generation; require unique base; for every V1 gained task require exactly one V1 insertion with exact V1 keys and no V2 scheduling fields, exactly one chosen-Math choice, grant and original Philosopher opportunity; cross-link task/opportunity/grant/player/seat/source role/chosen role/revision; reconstruct historical character entry at grant revision; reconstruct canonical V1 instance; reject duplicate/missing/mismatched facts. V2 tasks are independently fully validated and cannot satisfy a V1 chain.

Any malformed chain returns `CANONICAL_HISTORY_INVALID`, never unsupported. Only after inventory succeeds does classification check one base plus one V1 gained. Classification uses historical plan inventory, never latest holder count or source-at-settlement validity. Therefore later base role change cannot bypass unsupported. For a target in the pair, unsupported precedes settled/next/source checks. V1 base-only and gained-only remain at historical positions. Both V1 duplicate tasks fail receipt-free before any Math effect. V2 remains only supported duplicate generation.

## sourceEffectiveness

```ts
export type MathematicianRepresentedImpairment = {
 readonly impairmentId:AbilityImpairmentId; readonly kind:"DRUNK"|"POISONED";
 readonly sourceKind:"PHILOSOPHER_CHOSEN_DUPLICATE"|"SNAKE_CHARMER_DEMON_HIT";
 readonly sourcePlayerId:PlayerId; readonly affectedPlayerId:PlayerId;
 readonly affectedSeatNumber:SeatNumber; readonly affectedRoleId:RoleId;
 readonly affectedRole:RoleSetupSnapshot; readonly appliedCharacterStateRevision:number;
 readonly appliedByEventId:EventId; readonly appliedByEventSequence:number;
};
export type MathematicianSourceEffectiveness =
 | {readonly kind:"EFFECTIVE";readonly representedImpairments:readonly []}
 | {readonly kind:"KNOWN_DRUNK";readonly representedImpairments:readonly [MathematicianRepresentedImpairment]}
 | {readonly kind:"KNOWN_POISONED";readonly representedImpairments:readonly [MathematicianRepresentedImpairment]};
```

Exact 11 impairment keys. It must cross-link a unique accepted `PhilosopherDuplicateAbilityImpairmentApplied` or `SnakeCharmerPoisonedAbilityImpairmentApplied` envelope: ID/kind/source kind/source player/affected player/seat/full role/revision/event ID/sequence match exactly. `affectedRoleId=affectedRole.roleId`; role equals source role at application and exact catalog snapshot.

Applicability is interval-based, not revision equality: source tenure is active at impairment revision; applied revision `<= settlementCharacterStateRevision`; same tenure remains active at settlement; current source player/seat/role at settlement matches contract. If tenure ended or role changed, current source validation deterministically rejects before effectiveness. Zero applicable impairment -> EFFECTIVE; exactly one valid drunk/poison -> corresponding known variant; multiple/conflicting/unproved source chain -> `SOURCE_EFFECTIVENESS_UNRESOLVED`. Impairment itself never counts.

## vortoxConstraint

```ts
export type MathematicianVortoxConstraint =
 | {readonly kind:"NONE_NO_CURRENT_VORTOX";readonly evaluatedCharacterStateRevision:number}
 | {readonly kind:"NONE_CURRENT_VORTOX_KNOWN_IMPAIRED";
    readonly evaluatedCharacterStateRevision:number;readonly vortoxPlayerId:PlayerId;
    readonly vortoxSeatNumber:SeatNumber;readonly vortoxRoleSnapshot:RoleSetupSnapshot;
    readonly vortoxRoleTenure:MathematicianRoleTenureSnapshot;
    readonly impairment:MathematicianRepresentedImpairment}
 | {readonly kind:"VORTOX_FALSE_REQUIRED";
    readonly evaluatedCharacterStateRevision:number;readonly vortoxPlayerId:PlayerId;
    readonly vortoxSeatNumber:SeatNumber;readonly vortoxRoleSnapshot:RoleSetupSnapshot;
    readonly vortoxRoleTenure:MathematicianRoleTenureSnapshot};
type InternalVortoxUnresolved = {
 readonly kind:"VORTOX_CONSTRAINT_UNRESOLVED";
 readonly reason:"VORTOX_IDENTITY_NOT_UNIQUE"|"VORTOX_TENURE_MISSING_OR_INCONSISTENT"|
  "VORTOX_EFFECTIVENESS_CONFLICT"|"VORTOX_APPLICABILITY_NOT_PROVEN";
 readonly candidatePlayerIds:readonly PlayerId[];
 readonly candidateRoleTenureIds:readonly RoleTenureId[];
 readonly conflictingImpairmentIds:readonly AbilityImpairmentId[];
};
```

Variants are exact and biconditional. `NONE_NO_CURRENT_VORTOX` has exactly kind+revision and cannot carry evidence. `KNOWN_IMPAIRED` must carry all Vortox identity, exact catalog Vortox role, active Vortox tenure and exactly one impairment; impairment affected player/seat equals Vortox, `affectedRoleId="vortox"`, full affected role equals Vortox snapshot, application revision lies in Vortox tenure and is not after settlement, and unique impairment source event cross-links. `VORTOX_FALSE_REQUIRED` carries identity/role/active tenure and forbids impairment. Current `CurrentCharacterStateSet` and active-tenure set are biconditional: zero current Vortox requires zero active Vortox tenure; one requires exactly one matching active tenure; any mismatch/multiplicity is unresolved. More than one applicable impairment or unproved chain is unresolved. Arrays are dense/unique/code-unit ordered. No guessing.

## numericDomain

```ts
export const MATHEMATICIAN_FIXED_12_NUMBER_DOMAIN_VERSION="mathematician-fixed-12-number-domain-v1" as const;
export const MATHEMATICIAN_COUNT_DOMAIN=[0,1,2,3,4,5,6,7,8,9,10,11] as const satisfies readonly MathematicianCount[];
```

Exact dense ascending unique domain.

## candidateResolution

```ts
export const MATHEMATICIAN_SMALLEST_FALSE_POLICY_VERSION="mathematician-smallest-false-policy-v1" as const;
export type MathematicianInformationReliability=
 |"RULE_CORRECT"|"DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"
 |"DETERMINISTIC_FALSE_WITH_KNOWN_POISONING"|"VORTOX_CONSTRAINED_FALSE";
type MathematicianCandidateResolution={
 readonly numberDomainVersion:typeof MATHEMATICIAN_FIXED_12_NUMBER_DOMAIN_VERSION;
 readonly candidateDomain:typeof MATHEMATICIAN_COUNT_DOMAIN;
 readonly legalCandidateCounts:readonly MathematicianCount[];
 readonly selectedCount:MathematicianCount;
 readonly simulationPolicyVersion:typeof MATHEMATICIAN_SMALLEST_FALSE_POLICY_VERSION;
 readonly informationReliability:MathematicianInformationReliability;
};
```

Effective/no Vortox -> `[truth]`, truth, RULE_CORRECT. Known drunk/poison/no Vortox -> full domain including truth, select 1 when truth 0 else 0, matching reliability. `VORTOX_FALSE_REQUIRED` -> domain excluding truth, smallest false, Vortox reliability, even with source impairment. `NONE_CURRENT_VORTOX_KNOWN_IMPAIRED` behaves as no effective Vortox. Sparse/duplicate/unsorted/out-of-range or inconsistent arrays fail.

## simulationPolicy

Smallest-false is product policy, not official Storyteller law. No caller override. Same accepted stream/task produces same result. No `Date.now`, random UUID, random choice, locale comparison or environment collation.

## countResolutionFailureBiconditionals

- Count `UNRESOLVED` alone yields `LEDGER_UNRESOLVED` carrying nonempty `blockingUnresolvedFacts`; no other blocker variant may carry fact IDs.
- Source ambiguity yields `SOURCE_EFFECTIVENESS_UNRESOLVED` carrying `reason` and `conflictingImpairmentIds`; it carries no ledger blockers or Vortox candidate IDs.
- Vortox ambiguity yields the exact `InternalVortoxUnresolved`; it carries no ledger blockers.
- Candidate/payload invariant failure is `CONSTRUCTION_FAILED` with no semantic candidate data returned.

## deterministicOrdering

Seat first; equal seat/player/fact/task/event/impairment/tenure IDs by UTF-16 code-unit comparator `left===right?0:left<right?-1:1`. All persisted arrays dense and unique. Numeric candidates ascending.

## command

```ts
export type SettleMathematicianInformationCommandPayload={
 readonly commandType:"SettleMathematicianInformation";readonly taskId:ScheduledTaskId;
};
```

Exact two keys. System/Storyteller allowed; Human/AI reject. No truth/selection/candidates/players/facts/ledger/window/source/impairment/Vortox/instance/policy input. Add closed rejection codes `InvalidMathematicianInformationCommand` and `UnsupportedMathematicianInformationTask`; retain existing `ScheduledTaskNotFound`, `ScheduledTaskAlreadySettled`, `ScheduledTaskNotNext`, `InformationSourceNoLongerValid`.

## internalResolverResult

```ts
type InternalMathematicianResolution =
 | {readonly kind:"READY";readonly rebuiltState:GameState;readonly deliveryPayload:MathematicianInformationDeliveredPayload;readonly settlementPayload:ScheduledTaskSettledPayload}
 | {readonly kind:"DETERMINISTIC_REJECTION";readonly code:"ScheduledTaskNotFound"|"UnsupportedMathematicianInformationTask"|"ScheduledTaskAlreadySettled"|"ScheduledTaskNotNext"|"InformationSourceNoLongerValid";readonly message:string}
 | {readonly kind:"UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER";readonly rebuiltState:GameState;readonly diagnostic:{readonly reason:"LEGACY_V1_DUPLICATE_MATHEMATICIAN_ORDER_UNSUPPORTED";readonly taskPlanVersion:"first-night-task-plan-v1";readonly baseTaskId:ScheduledTaskId;readonly gainedTaskId:ScheduledTaskId}}
 | {readonly kind:"LEDGER_UNRESOLVED";readonly rebuiltState:GameState;readonly blockingUnresolvedFacts:readonly MathematicianBlockingUnresolvedFact[]}
 | {readonly kind:"SOURCE_EFFECTIVENESS_UNRESOLVED";readonly rebuiltState:GameState;readonly reason:"MULTIPLE_APPLICABLE_IMPAIRMENTS"|"IMPAIRMENT_SOURCE_CHAIN_INVALID"|"IMPAIRMENT_TENURE_NOT_PROVEN";readonly conflictingImpairmentIds:readonly AbilityImpairmentId[]}
 | InternalVortoxUnresolved & {readonly rebuiltState:GameState}
 | {readonly kind:"CANONICAL_HISTORY_INVALID";readonly reason:string;readonly offendingEventIds:readonly EventId[]}
 | {readonly kind:"CONSTRUCTION_FAILED";readonly reason:string};
```

Exact variant keys; arrays dense/unique/code-unit. Expected domain outcomes never throw. Canonical validators are caught into canonical-invalid; candidate/payload invariant errors into construction-failed. Only an unexpected programming/dependency exception may escape, and application catches it as receipt-free `DependencyExecutionFailed`.

## applicationOrder

Exact outer order, respecting that game existence/version derive from stored events:

1. Capture exact command; malformed snapshot -> failed DependencyExecutionFailed/`command-validation`, no receipt.
2. Read existing receipt. Same fingerprint returns idempotent stored result; conflict follows existing behavior.
3. Load complete events; failure -> CommandStoreReadFailed/`event-load`, no receipt.
4. Rebuild pipeline state; failure -> CanonicalStateRebuildFailed/`state-rebuild`, no receipt.
5. Preflight deterministic checks before Math resolver: expected version; game exists; actor allowed; phase FIRST_NIGHT/day0/night1; task plan/progress present; exact Math command shape. These rejected results use existing receipt path. No next/settled/source check occurs here.
6. Invoke internal complete-stream resolver once.
7. Inside resolver: identify target existence/type; validate complete canonical Math inventory and V1 chains; Option A classification; only then settled/next; then source-at-settlement; count; source effectiveness; Vortox; candidates/payload.
8. Compare internal rebuilt fingerprint to pipeline state.
9. Map deterministic resolver rejection to receipt-bearing rejected result.
10. Map Option A/block/canonical/construction to receipt-free failed result.
11. READY: generate metadata; build exact two events; prospective validation; append accepted batch+receipt atomically through existing commit; return event-summary accepted result.

Thus targeting V1 base cannot first produce `ScheduledTaskNotNext` or burn a receipt. Malformed V1 history fails canonical validation before unsupported classification.

## commandResultAndFailureBoundary

Do not add `details` to `CommandExecutionFailed`. Existing exact shape remains:

```ts
export type CommandExecutionFailed={
 readonly status:"failed";readonly gameId:GameId;readonly code:CommandExecutionFailureCode;
 readonly message:string;readonly failureStage:CommandExecutionFailureStage;
 readonly currentGameVersion?:number;readonly retryable:true;
};
```

With current version, exact keys are status/gameId/code/message/failureStage/currentGameVersion/retryable; without it, omit only currentGameVersion. Option A internal diagnostic may be sent only to internal structured logging; public result is exact `ApplicationNotConfigured`, message `Legacy V1 duplicate Mathematician settlement is not supported`, stage `first-night-role-information`, current version, retryable true, no details. Diagnostic never enters receipt/event/projection.

Mapping:

- actor/game/phase/version/plan/payload deterministic preflight -> rejected receipt, existing rejection stage rules.
- target missing -> `ScheduledTaskNotFound` rejected receipt.
- wrong type -> `UnsupportedMathematicianInformationTask` rejected receipt.
- settled -> `ScheduledTaskAlreadySettled` rejected receipt.
- non-next supported task -> `ScheduledTaskNotNext` rejected receipt.
- valid history but source no longer eligible -> `InformationSourceNoLongerValid` rejected receipt.
- Option A -> ApplicationNotConfigured/first-night-role-information/no receipt.
- ledger/source/Vortox unresolved, canonical-invalid, construction, unexpected resolver dependency -> DependencyExecutionFailed/first-night-role-information/no receipt.
- rebuilt mismatch -> CanonicalStateRebuildFailed/first-night-role-information/no receipt.
- metadata -> MetadataGenerationFailed/event-metadata/no receipt.
- prospective -> DependencyExecutionFailed/prospective-validation/no receipt.
- append -> EventStoreAppendFailed/accepted-commit/no receipt.

Same command ID is reusable after every failed result. Only rejected/accepted results persist receipts.

## receiptSemantics

No Math delivery/fact/metadata/version/progress is created before READY. Option A is checked before any receipt-bearing next/settled/source result for either pair task. Successful idempotency uses the event-summary receipt; no hidden events are disclosed.

## deterministicIds

```ts
export type MathematicianDeliveryId=string&{readonly __brand:"MathematicianDeliveryId"};
export const formatMathematicianDeliveryId=(taskId:ScheduledTaskId):MathematicianDeliveryId=>`mathematician-delivery-v1:${taskId}` as MathematicianDeliveryId;
export type ParsedMathematicianDeliveryId=
 |{readonly valid:true;readonly canonicalId:MathematicianDeliveryId;readonly taskId:ScheduledTaskId;readonly generation:"BASE"|"V1"|"V2"}
 |{readonly valid:false;readonly reason:string};
export function parseMathematicianDeliveryId(value:unknown):ParsedMathematicianDeliveryId;
```

Accept only canonical base or Philosopher-gained V1/V2 Math task from philosopher; strict round-trip; reject whitespace/control/wrong segments/generation/trailing/noncanonical seat. Existing canonical instance formatters remain authority.

## events

Add `MathematicianInformationDelivered`; add settlement outcome `MATHEMATICIAN_INFORMATION_DELIVERED`. Success is exactly delivery then settlement, no resolution/phase event.

## eventOrder

Same command/batch/new game version/time/actor, distinct IDs. Pre-sequence N -> delivery N+1, settlement N+2; payload delivery sequence N+1. Phase stays FIRST_NIGHT; game version increases once.

## payloadShapes

Delete unused `MATHEMATICIAN_INFORMATION_MODEL_VERSION`. Keep only:

```ts
export const MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION="mathematician-knowledge-v1" as const;
export const MATHEMATICIAN_INFORMATION_STAGE="MATHEMATICIAN_INFORMATION" as const;
export type MathematicianInformationDeliveredPayload={
 readonly rulesBaselineVersion:string; readonly nightNumber:1;
 readonly taskId:ScheduledTaskId; readonly taskType:"MATHEMATICIAN_INFORMATION";
 readonly deliveryId:MathematicianDeliveryId; readonly deliveryEventSequence:number;
 readonly sourceContract:MathematicianSourceContract;
 readonly resolutionModelVersion:typeof MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION;
 readonly windowSnapshot:FirstNightMathematicianCountWindow;
 readonly ledgerVersion:typeof FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION;
 readonly auditModelVersion:typeof FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION;
 readonly resolvingAbilityInstanceId:FirstNightAbilityInstanceId;
 readonly qualifyingAbnormalFactIds:readonly FirstNightAbilityOutcomeFactId[];
 readonly distinctAbnormalPlayers:readonly MathematicianAbnormalPlayer[];
 readonly excludedResolvingSourceFactIds:readonly FirstNightAbilityOutcomeFactId[];
 readonly excludedOwnAbilityFactIds:readonly FirstNightAbilityOutcomeFactId[];
 readonly ignoredNormalFactIds:readonly FirstNightAbilityOutcomeFactId[];
 readonly ignoredPendingFactIds:readonly FirstNightAbilityOutcomeFactId[];
 readonly redundantUnresolvedFactIds:readonly FirstNightAbilityOutcomeFactId[];
 readonly trueCount:MathematicianCount;
 readonly numberDomainVersion:typeof MATHEMATICIAN_FIXED_12_NUMBER_DOMAIN_VERSION;
 readonly candidateDomain:typeof MATHEMATICIAN_COUNT_DOMAIN;
 readonly legalCandidateCounts:readonly MathematicianCount[];
 readonly selectedCount:MathematicianCount;
 readonly sourceEffectiveness:MathematicianSourceEffectiveness;
 readonly vortoxConstraint:MathematicianVortoxConstraint;
 readonly simulationPolicyVersion:typeof MATHEMATICIAN_SMALLEST_FALSE_POLICY_VERSION;
 readonly informationReliability:MathematicianInformationReliability;
 readonly knowledgeModelVersion:typeof MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION;
 readonly knowledgeStage:typeof MATHEMATICIAN_INFORMATION_STAGE;
 readonly settlementCharacterStateRevision:number;
};
```

Exactly 31 enumerable keys; missing/extra fails. Settlement task/type/outcome/revision matches.

## gameState

```ts
export type MathematicianInformationState={readonly deliveries:readonly MathematicianInformationDeliveredPayload[]};
```

Exact key; optional `GameState.mathematicianInformation`. Dense/deep-cloned; strictly increasing delivery sequence; unique delivery/task/instance. Payload sequence equals envelope. Invalid state fails replay.

## ledgerAdapter

```ts
export type MathematicianDeliveryEvidence={
 readonly kind:"MATHEMATICIAN_DELIVERY";readonly deliveryId:MathematicianDeliveryId;
 readonly taskId:ScheduledTaskId;readonly sourcePlayerId:PlayerId;
 readonly trueCount:MathematicianCount;readonly selectedCount:MathematicianCount;
 readonly terminalEventId:EventId;
};
export type AbilityOutcomeEvidenceReference=
 SourceEventEvidence|TaskEvidence|ActionOpportunityEvidence|AbilityImpairmentEvidence|
 RoleTenureEvidence|CharacterStateEvidence|PlayerRoleAtRevisionEvidence|
 PhilosopherGrantEvidence|FirstNightTaskInsertionEvidence|SnakeCharmerResolutionEvidence|
 EvilTwinPairEvidence|WitchPendingMarkerEvidence|CerenovusInstructionEvidence|
 ClockmakerDeliveryEvidence|DreamerDeliveryEvidence|SeamstressDeliveryEvidence|
 MathematicianDeliveryEvidence;
```

This is the complete closed union; no generic variant. Existing variant key sets remain exactly those in 2B18A. Math evidence canonical slot order is:

1 SOURCE_EVENT; 2 TASK; 3 ACTION_OPPORTUNITY if gained; 4 CHARACTER_STATE; 5 source PLAYER_ROLE_AT_REVISION; 6 source ROLE_TENURE; 7 PHILOSOPHER_GRANT if gained; 8 FIRST_NIGHT_TASK_INSERTION if gained; 9 source ABILITY_IMPAIRMENT if source impaired; 10 Vortox PLAYER_ROLE_AT_REVISION if current Vortox; 11 Vortox ROLE_TENURE if current Vortox; 12 Vortox ABILITY_IMPAIRMENT only for known-impaired Vortox; 13 MATHEMATICIAN_DELIVERY. Omitted conditional slots close left while preserving relative order. No repeated evidence kind except the explicitly separate source/Vortox role or impairment slots; their player IDs distinguish them.

Required/forbidden matrix:

- All facts require SOURCE_EVENT, TASK, CHARACTER_STATE, source PLAYER_ROLE, source ROLE_TENURE, MATHEMATICIAN_DELIVERY.
- SOURCE_EVENT equals Math envelope ID/type/sequence/batch. TASK equals payload task/type. CHARACTER_STATE equals settlement revision. Source role/tenure equals source contract. MATHEMATICIAN_DELIVERY equals payload/event.
- Fact `abilityInstance` is the canonical provenance chain and equals payload resolving instance/source/task/player/seat.
- Base forbids ACTION_OPPORTUNITY, PHILOSOPHER_GRANT, INSERTION; provenance kind BASE.
- V1 gained requires exactly one action opportunity/grant/V1 insertion, all cross-linked to source contract; provenance V1; forbids V2 fields.
- V2 gained requires exactly one action opportunity/grant/V2 insertion including grant+scheduling version; provenance V2; forbids V1 generation.
- EFFECTIVE source forbids source impairment evidence. KNOWN_DRUNK/POISON requires exactly one matching source impairment evidence.
- NONE_NO_CURRENT_VORTOX forbids Vortox player/tenure/impairment evidence.
- VORTOX_FALSE_REQUIRED requires exact Vortox player+tenure and forbids Vortox impairment.
- NONE_CURRENT_VORTOX_KNOWN_IMPAIRED requires exact Vortox player+tenure+one matching Vortox impairment.
- Evidence IDs, revisions, snapshots, roles, players, seats, tasks, grants, opportunities, insertions and terminal event must cross-link; no orphan evidence.

Classification biconditional: selected truth -> NORMAL/NO_OTHER_CHARACTER_ABILITY/false. Drunk false without effective Vortox -> ABNORMAL/SOURCE_DRUNKENNESS/true. Poison false without effective Vortox -> ABNORMAL/SOURCE_POISONING/true. Vortox false -> ABNORMAL/VORTOX_FALSE_INFORMATION/true even if source impaired. Reject effective false, false lacking required evidence, true abnormal, Vortox truth, cause/evidence mismatch. Fact is appended after decision, excluded from own window and visible to later holder.

## batchSemantics

Exact `[MathematicianInformationDelivered,ScheduledTaskSettled]`: same batch/version, consecutive sequences, distinct IDs, matching task/type/revision, Math outcome, validated source, no third/transition. Delivery appends information+fact; settlement advances only target.

## prospectiveValidation

Prospective application must prove FIRST_NIGHT, version +1, sequence +2, one delivery/fact/settlement, only target progress, no unrelated mutation. Failure is receipt-free.

## storedValidation

```ts
type MathematicianValidationResult={readonly valid:true}|{readonly valid:false;readonly reason:string};
function validateStoredMathematicianInformationDelivered(input:{
 readonly acceptedEvents:readonly AnyDomainEventEnvelope[];
 readonly checkpoint:MathematicianDeliveryCheckpoint;
 readonly finalState:GameState;
}):MathematicianValidationResult;
```

Layer B only; arguments are created by trusted replay and never public. It verifies exact payload/ID/sequence; historical pre-state plan/roster/`CurrentCharacterStateSet`/opportunity/grant/insertion/provenance; Option A; adjacent same-batch settlement; initialization/window; pre-event ledger truncated at stored end; exclusions/classification/dedup/count; source tenure/effectiveness and impairment source event; Vortox identity/tenure/effect; candidates/selection/reliability/policy; final state copy; terminal ledger fact/evidence order; duplicate temporal order. It never reads later state to recompute the historical decision. It calls neither stream validator nor rebuild.

## privateProjection

```ts
export type PlayerPrivateKnowledgeStage=
 |"OWN_CHARACTER_BOOTSTRAP"|"MINION_INFORMATION"|"DEMON_INFORMATION"
 |"EVIL_TWIN_SETUP_INFORMATION"|"CERENOVUS_INFORMATION"|"CLOCKMAKER_INFORMATION"
 |"DREAMER_INFORMATION"|"SEAMSTRESS_INFORMATION"|"MATHEMATICIAN_INFORMATION";
export const PLAYER_PRIVATE_KNOWLEDGE_STAGE_ORDER=[
 "OWN_CHARACTER_BOOTSTRAP","MINION_INFORMATION","DEMON_INFORMATION",
 "EVIL_TWIN_SETUP_INFORMATION","CERENOVUS_INFORMATION","CLOCKMAKER_INFORMATION",
 "DREAMER_INFORMATION","SEAMSTRESS_INFORMATION","MATHEMATICIAN_INFORMATION"
] as const;
export type PlayerMathematicianInformationView={readonly count:MathematicianCount};
export type PlayerPrivateKnowledgeView={
 readonly viewerPlayerId:PlayerId;readonly viewerSeatNumber:SeatNumber;readonly viewerDisplayName:string;
 readonly ownCharacter:RoleSetupSnapshot;readonly knownDemon?:KnownPlayerReference;
 readonly knownMinions:readonly KnownPlayerReference[];readonly evilTwinCounterpart?:KnownPlayerReference;
 readonly cerenovusMadnessInstruction?:PlayerCerenovusMadnessInstructionView;
 readonly dreamerInformation?:PlayerDreamerInformationView;
 readonly clockmakerInformation?:PlayerClockmakerInformationView;
 readonly seamstressInformation?:readonly PlayerSeamstressInformationView[];
 readonly mathematicianInformation?:PlayerMathematicianInformationView;
 readonly demonBluffs:readonly RoleSetupSnapshot[];
 readonly ownCharacterKnowledgeModelVersion:SupportedInitialKnowledgeModelVersion;
 readonly teamKnowledgeModelVersion?:string;readonly evilTwinKnowledgeModelVersion?:string;
 readonly cerenovusKnowledgeModelVersion?:"cerenovus-madness-instruction-v1";
 readonly dreamerKnowledgeModelVersion?:string;
 readonly clockmakerKnowledgeModelVersion?:"clockmaker-information-v1";
 readonly seamstressKnowledgeModelVersion?:"seamstress-private-knowledge-v1";
 readonly mathematicianKnowledgeModelVersion?:typeof MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION;
 readonly deliveredKnowledgeStages:readonly PlayerPrivateKnowledgeStage[];
};
```

Base exact keys remain the existing eight. Optional exact keys add only `mathematicianInformation` and `mathematicianKnowledgeModelVersion` to existing optional set. `PlayerMathematicianInformationView` has exact single key `count` in 0..11.

Biconditional: Math stage present iff both Math optional fields are own enumerable properties; either field without other/stage, stage without both, or wrong version fails. Stage is last in deterministic order, dense/unique. For a viewer, zero validated source deliveries -> all three absent; exactly one -> all present and count=selectedCount; more than one -> `PrivateKnowledgeUnavailable`, even if counts equal. Source matching uses stored source player, never current role. Player and AI builders share the same trusted stream/checkpoints, construction and final `validatePlayerPrivateKnowledgeViewShape`; outputs are byte-equivalent. Other viewers get no Math fields. Hidden payload data never enters view/serialization.

## replayValidation

Layer A validates valid supported V1 base/gained, V2 base/gained/duplicates; preserves V1 order; rejects V1 duplicate settlement, naked/reversed/mixed events and all payload/evidence/order/source/window/count/candidate/effect/Vortox/policy tampering. Existing V1 plan/insertion history remains replayable. Ubuntu/Windows identical.

## testSeamsAndUnreachableFacts

`packages/domain-core/src/mathematician-internal.ts` may export pure functions only for repository-relative application/tests; none are package-root/application-root exports. `packages/domain-core/src/mathematician.test.ts` may directly import them. A test-only `packages/domain-core/src/mathematician-test-fixtures.ts` may construct exact pure inputs and hostile replay pre-states; it is absent from all package roots and production imports.

POISONED Math source, Vortox+POISONED and base-source role-change are currently unreachable through accepted first-night commands. Their tests are explicitly `[HRS]` hostile-replay/pure-semantic contract tests: they invoke internal source/Vortox/candidate/pre-event validators with exact canonical shapes or prove full stream validator rejects the hostile stream. They never label a fixture accepted, never append it through application, and never weaken stream validation. Option A role-change tests build a fully validated historical task inventory plus a deliberately later current-state seam and assert classification ignores latest holder count; they are not accepted integration claims.

## implementationFilePlan

- New `packages/domain-core/src/mathematician.ts`: public payload/state/view contracts, IDs and exact shape validators only.
- New `packages/domain-core/src/mathematician-internal.ts`: trusted resolver, inventory, count/effect/Vortox/candidate, Layer A/B validators; absent root.
- New `packages/domain-core/src/mathematician.test.ts` and test-only `mathematician-test-fixtures.ts`.
- Modify domain `command.ts`, `events.ts`, `game-state.ts`, `errors.ts`, `first-night-task-plan.ts`, `event-applier.ts`, `index.ts` for exact command/event/state/outcome/application and export absence.
- Modify `seamstress.ts` role-tenure tracker to include Mathematician and retain old behavior; add regression tests.
- Modify ledger TS/test for closed union/adapter/evidence matrix.
- Modify domain-batch-semantics TS/test and rebuild test.
- Modify application game service, command-result and game-service test; no command-store port extension; application root exports no internal resolver.
- Modify `initial-private-knowledge.ts` full view/stage/validator.
- Modify `packages/projections/src/index.ts`; add `mathematician-private-knowledge.test.ts`; existing state API rejects Math, new stream API validates history.
- Modify application projection tests to pass store-loaded events for Math only; non-Math callers unchanged.
- Modify coverage matrix/status/PR/review docs at prescribed stages. No 2B19 file.

## explicitOutOfScope

No dawn/day transition, second/other night Math, nomination/execution/death, Witch/Cerenovus later trigger, registration, Traveller, continuous poison, No Dashii, Sweetheart, Pit-Hag, Barber, free Storyteller number, alternative AI policy, UI/Electron/SQLite, V1 duplicate migration/settlement, new override, COMPLETE coverage or 2B19.

## tests — layering contract and original 1–140

Each numbered item is a separate test with its own direct assertion; shared setup is allowed but one assertion cannot be counted under two numbers. `[CSI]` complete accepted-stream integration; `[APP]` application/store integration; `[INT]` non-root pure internal contract; `[RSP]` replay/stored/projection; `[EXP]` package export absence; `[HRS]` explicitly non-accepted hostile-replay/pure semantic seam; `[REG]` independent regression/gate.

1 `[CSI]` complete stream resolves. 2 `[CSI]` sparse stream rejects. 3 `[CSI]` invalid stream rejects. 4 `[CSI]` duplicate event ID rejects. 5 `[EXP]` caller state has no count API. 6 `[EXP]` caller ledger has no count API. 7 `[EXP]` no root state resolver. 8 `[EXP]` no root ledger/decision resolver. 9 `[CSI]` input unmodified. 10 `[APP]` rebuilt/pipeline mismatch fails closed.

11 `[INT]` empty qualifying=0. 12 `[INT]` NORMAL-only=0. 13 `[INT]` PENDING-only=0. 14 `[INT]` NORMAL+PENDING=0. 15 `[INT]` system info not counted. 16 `[INT]` pre-lower rejected. 17 `[INT]` post-upper excluded. 18 `[INT]` one abnormal player=1. 19 `[INT]` two incidents same player=1. 20 `[INT]` two players=2. 21 `[INT]` same-player unresolved redundant. 22 `[INT]` unresolved-only blocks. 23 `[INT]` other-player unresolved blocks. 24 `[INT]` pending nonblocking. 25 `[INT]` source excluded. 26 `[INT]` own instance excluded. 27 `[INT]` earlier other-player abnormal Math eligible.

28 `[CSI]` effective base/no Vortox truth. 29 `[CSI]` base provenance exact. 30 `[HRS]` base DRUNK semantic path validates without accepted-history claim. 31 `[HRS]` base DRUNK smallest false. 32 `[HRS]` base DRUNK fact classification. 33 `[HRS]` wrong impairment identity rejects. 34 `[HRS]` changed base source rejects supported settlement.

35 `[CSI]` V1 gained-only settles. 36 `[CSI]` V2 gained settles. 37 `[HRS]` missing grant malformed history. 38 `[HRS]` missing insertion malformed history. 39 `[HRS]` V1/V2 mixing malformed. 40 `[HRS]` role segment mismatch. 41 `[HRS]` revision mismatch. 42 `[HRS]` seat mismatch. 43 `[APP]` supported non-next task rejected with receipt.

44 `[INT]` exact 0..11. 45 `[INT]` effective truth0 selects0. 46 `[INT]` effective truth5 selects5. 47 `[INT]` impaired truth0 selects1. 48 `[INT]` impaired positive selects0. 49 `[INT]` impaired legal includes truth. 50 `[INT]` Vortox legal excludes truth. 51 `[INT]` Vortox truth0 selects1. 52 `[INT]` Vortox positive selects0. 53 `[INT]` sparse candidate rejects. 54 `[INT]` out-of-range rejects. 55 `[INT]` duplicate rejects.

56 `[CSI]` effective Vortox forces false. 57 `[CSI]` reachable Vortox+DRUNK gained path false. 58 `[HRS]` Vortox+POISON semantic false; not accepted integration. 59 `[RSP]` Vortox Math fact cause/evidence exact. 60 `[HRS]` missing Vortox tenure unresolved. 61 `[HRS]` conflicting Vortox identity unresolved. 62 `[RSP]` projection hides Vortox.

63 `[CSI]` V2 base before gained. 64 `[CSI]` earlier NORMAL adds zero. 65 `[CSI]` earlier DRUNK false later counts holder. 66 `[CSI]` earlier Vortox false later counts holder. 67 `[CSI]` earlier cannot read later. 68 `[CSI]` later window includes earlier fact. 69 `[RSP]` later settlement leaves earlier view unchanged. 70 `[CSI]` multiple gained seat/task order.

71 `[APP]` System allowed. 72 `[APP]` Storyteller allowed. 73 `[APP]` Human rejected. 74 `[APP]` AI rejected. 75 `[APP]` missing task rejected. 76 `[APP]` wrong type rejected. 77 `[APP]` settled rejected. 78 `[APP]` supported non-next rejected. 79 `[APP]` stale version rejected. 80 `[APP]` only two events. 81 `[APP]` fixed event order. 82 `[APP]` version once. 83 `[APP]` phase FIRST_NIGHT. 84 `[APP]` no auto-DAY. 85 `[APP]` unresolved no receipt. 86 `[APP]` internal failure retryable. 87 `[APP]` metadata stage exact. 88 `[APP]` append no fabricated receipt. 89 `[APP]` successful command idempotent and summary-only.

90 `[RSP]` legal batch replays. 91 `[RSP]` naked delivery fails. 92 `[RSP]` naked settlement fails. 93 `[RSP]` reversed fails. 94 `[RSP]` task tamper. 95 `[RSP]` source tamper. 96 `[RSP]` window tamper. 97 `[RSP]` truth tamper. 98 `[RSP]` abnormal-player tamper. 99 `[RSP]` fact-ID tamper. 100 `[RSP]` selected tamper. 101 `[RSP]` candidates tamper. 102 `[RSP]` source-effect tamper. 103 `[RSP]` Vortox variant tamper. 104 `[RSP]` policy tamper. 105 `[RSP]` extra field. 106 `[RSP]` sparse payload. 107 `[RSP]` duplicate delivery. 108 `[RSP]` mixed phase transition.

109 `[RSP]` truth fact NORMAL. 110 `[RSP]` reachable DRUNK false fact/cause. 111 `[HRS]` POISON false fact/cause through exact pre-event semantic seam, not accepted history. 112 `[RSP]` Vortox false fact/cause. 113 `[RSP]` effective false rejects. 114 `[RSP]` false missing evidence rejects. 115 `[RSP]` Vortox truth rejects. 116 `[CSI]` later reads earlier Math fact. 117 `[CSI]` current fact absent from own window.

118 `[RSP]` source player sees count only. 119 `[RSP]` source AI same count only. 120 `[RSP]` other viewer absent. 121 `[RSP]` hide truth. 122 `[RSP]` hide players. 123 `[RSP]` hide facts. 124 `[RSP]` hide domain. 125 `[RSP]` hide reliability. 126 `[RSP]` hide impairment. 127 `[RSP]` hide Vortox. 128 `[RSP]` hide policy. 129 `[RSP]` tampered stored delivery fails full-stream projection. 130 `[RSP]` later role state does not rewrite. 131 `[RSP]` later ledger facts do not rewrite.

132 `[REG]` all accepted 2B18A tests. 133 `[REG]` Clockmaker. 134 `[REG]` Dreamer. 135 `[REG]` Seamstress. 136 `[REG]` Cerenovus. 137 `[REG]` Snake Charmer. 138 `[REG]` Philosopher V1/V2. 139 `[REG]` projection nonleakage. 140 `[REG]` Ubuntu/Windows equality.

## tests — Option A 1–45

The same layer codes apply; every number is an independent direct assertion.

1 `[CSI]` V1 only-base plan. 2 `[CSI]` base normal historical position. 3 `[APP]` base-only settles. 4 `[APP]` delivery+settlement. 5 `[CSI]` no insertion required. 6 `[RSP]` BASE source contract. 7 `[RSP]` valid ledger fact. 8 `[RSP]` replay passes. 9 `[RSP]` full-stream private view count only.

10 `[CSI]` V1 only-gained plan. 11 `[CSI]` no base task. 12 `[CSI]` gained next at V1 position. 13 `[APP]` gained-only settles. 14 `[RSP]` exact V1 gained source. 15 `[RSP]` grant/insertion/opportunity/revision/instance cross-links. 16 `[RSP]` no V2/migration. 17 `[RSP]` delivery+settlement+fact. 18 `[RSP]` full-stream view count only.

19 `[CSI]` validated V1 inventory has base+gained. 20 `[CSI]` historical gained is next. 21 `[APP]` gained command returns ApplicationNotConfigured. 22 `[APP]` internal diagnostic exact reason while public shape has no details. 23 `[APP]` retryable true. 24 `[APP]` no receipt. 25 `[APP]` no events. 26 `[APP]` gained unsettled. 27 `[APP]` base unsettled. 28 `[APP]` version unchanged. 29 `[APP]` ledger unchanged. 30 `[APP]` opportunity/progress unchanged. 31 `[APP]` same command ID retryable again. 32 `[APP]` naming base cannot skip gained or write non-next receipt. 33 `[CSI]` restart/rebuild same unsupported. 34 `[RSP]` player/AI hide limitation.

35 `[APP]` V2 base-only succeeds. 36 `[APP]` V2 gained-only succeeds. 37 `[CSI]` V2 duplicate base first. 38 `[CSI]` after base gained next. 39 `[CSI]` later gained reads earlier base fact. 40 `[CSI]` earlier base cannot read future gained. 41 `[CSI]` multiple gained stable. 42 `[HRS]` V1/V2 mixture is canonical-invalid, not unsupported.

43 `[HRS]` fully validated historical V1 duplicate inventory plus later base-role change remains unsupported; fixture is pure semantic, not accepted integration. 44 `[HRS]` supported gained-only source-at-settlement invalidity rejects after support classification; not accepted integration. 45 `[HRS]` classifier output is identical under changed latest holder count because it consumes validated historical inventory only.

## blockerClosureTraceability

1. Hidden resolver removed from both package roots; internal direct import, summary-only command result and export-absence tests.
2. Layer A pre-event versus Layer B trusted full-stream validation is nonrecursive; safe event-stream projection signatures and caller migration frozen.
3. Complete real private-view/stage/order/optional-key/biconditional/player-AI/multiple-delivery contract; unused model constant deleted.
4. Exact internal result variants, application order, public failure shape, receipt/stage mapping and Option A precedence.
5. Exact mutually exclusive Vortox variants and source/Vortox impairment-tenure-event applicability.
6. Fully validated V1 chain/inventory before unsupported classification; malformed history canonical-invalid.
7. Complete closed evidence union, canonical slots, required/forbidden branch matrix and cross-links.
8. All 185 independent tests assigned to accepted integration, application, internal, replay/projection, export absence, hostile seam or regression; unreachable POISON/role-change never masquerade as accepted history.

## completionCriteria

Implementation is complete only when exact types/key sets/parsers/validators are materialized; no hidden decision root export exists; application invokes one trusted resolver and compares fingerprints; full-stream projection is used for Math; all 185 independent tests and export-absence tests pass; old state projection rejects Math; Layer A/B recursion test passes; evidence matrix and Option A precedence tests pass; full `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, `git diff --check` pass; 2B18A/scheduling/Philosopher/Clockmaker/Dreamer/Seamstress/Cerenovus/Snake/replay/projection regressions pass; frozen exact-head Ubuntu/Windows CI pass; PR body contains required rule evidence/claims/unsupported/revisions/traceability and Option A statements; coverage matrix remains PARTIAL; independent final review returns both pass verdicts/no blockers; no post-review commit without fresh CI/review; 2B19 remains unstarted.

## coverageStatus

`PARTIAL`. Supported: first night only, fixed twelve-player/no Traveller, accepted ledger, base and supported gained sources, deterministic impairment/Vortox semantics within represented evidence, Option A boundary and safe private count. Unsupported: other night, broader poisoning engines, Travellers, Storyteller discretionary selection and all explicit out-of-scope mechanics. Do not mark COMPLETE.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_2
