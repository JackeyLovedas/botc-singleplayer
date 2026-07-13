# Phase 3 Slice 2B18B — Mathematician First-Night Information Design, Round 3

## Metadata

```yaml
sliceId: 2B18B
authorization: USER_AUTHORIZED_2B18B_DESIGN_ROUND_3_REPLAY_ADAPTER
parentDesign: docs/implementation/phase-3-slice-2b18b-design.md
parentDesignSha256: 51b69de1c2dc94377e6e7824e36905a6792a7457a30039fdd9a6e085d21779c5
round1Review: docs/implementation/phase-3-slice-2b18b-design-review-round-1.md
round1ReviewSha256: cf1e2ac0abbd805be3f0dae1eb8b9b3d30a5bb4c60d9303a4b8d7fad7125e9bf
round2Review: docs/implementation/phase-3-slice-2b18b-design-review-round-2.md
round2ReviewSha256: 28760fb16ba32f120c714428e71af20583a10449cedf37e61e768cd000d7c0c3
originalEvidence: docs/rules/evidence/2B18B.md
originalEvidenceSha256: eae53e0eed5d54c5c4a78d31543749787359f61b2e9b7c3f0ceb27069d2471c1
resolvedEvidence: docs/rules/evidence/2B18B-resolved.md
resolvedEvidenceSha256: 0c4893de8f38dfc05876f89744976a7c54afc6bd41465f2e1198d22b0844a4c8
resolutionAuthorization: OPTION_A_LEGACY_V1_GAINED_MATHEMATICIAN_ONLY_WITHOUT_BASE_TASK
resolutionKind: IMPLEMENTATION_SUPPORT_BOUNDARY
behaviorDesignChanged: false
architectureAdapted: true
designRound: 3 / 3
ruleReady: true
ruleDesignPass: false
implementationAuthorized: false
coverageStatus: PARTIAL
ruleOverrideAdded: false
officialRuleChanged: false
approvedSimulatorPoliciesChanged: false
legacyHistoryReinterpreted: false
accepted2B18ABoundary: LEDGER_ONLY
firstNightOnly: true
starts2B19: false
```

This file is the complete, independent, sole implementation authority for Slice 2B18B after a `RULE_DESIGN_PASS`. It is not an erratum, addendum, or difference list. Implementers must not reconstruct architecture from Round 2. No production or test implementation is authorized by this document alone.

## ruleAuthority

Authority order is approved `docs/rules/USER_OVERRIDES.md`, `docs/rules/evidence/2B18-resolved.md`, `docs/rules/evidence/2B18B-resolved.md`, official BOTC Wiki, official nightsheet, user-specified Chinese Wiki, then accepted repository artifacts only as implementation evidence. Frozen revisions are: Official Mathematician oldid `3109`, SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`; Philosopher oldid `2421`, `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`; States oldid `1039`, `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`; Vortox oldid `3017`, `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`; Chinese Mathematician oldid `6214`, `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`; Chinese Philosopher oldid `5125`, `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be`; Chinese Vortox oldid `6198`, `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`; official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`; retrieval `2026-07-13T07:36:51Z`.

First-night order remains Philosopher, Snake Charmer, Witch, Cerenovus, Clockmaker, Dreamer, Seamstress, Mathematician, Dawn. Option A is a product support boundary, not an official-rule claim. No override changes. Other-night behavior is outside this slice.

## accepted2B18ABoundary

Retain the accepted ledger/audit/window v1 foundation, exact canonical BASE/V1/V2 ability-instance provenance, closed evidence, dense canonical arrays, initialization-envelope provenance, replay validation, and historical-fact semantics. Caller-created state, ledger, context, count, source, candidate, or override carrier is never accepted-history proof. This slice adds one closed Mathematician terminal adapter and does not rewrite any existing fact.

## frozenBehavior

The following Round 2 behavior is immutable: count distinct players, not incidents; `NORMAL` and `PENDING_TRIGGER` contribute zero; same-player `UNRESOLVED` is redundant after a qualifying abnormal fact and otherwise blocks; only `ABNORMAL` with `causedByAnotherCharacterAbility=true` qualifies; exclude the resolving player and current ability instance; do not globally exclude a different earlier Mathematician holder; first-night lower boundary is exclusive after `FirstNightInitialized` and upper boundary is the last prior event; numeric domain is exactly `0..11`; ordinary impairment permits the full domain and deterministic smallest-false selection; effective Vortox permits only false values and deterministic smallest-false selection; historical facts are not recomputed from later state; phase remains `FIRST_NIGHT`; no dawn reset, other-night behavior, Storyteller free number selection, V1 migration/reorder, or Slice 2B19.

## threeTrustLayers

### Layer A — Command Decision Resolver

Layer A is the only command-decision entry. It accepts only a complete accepted prior event stream and a task ID. It validates a dense canonical capture, calls `validateDomainEventStream`, calls `rebuildGameState`, validates canonical state and current target, validates Option A before count work, reads the canonical ledger, establishes the window, derives count/candidates/source effectiveness/Vortox, and returns one complete hidden decision. It is never called from replay. It accepts no caller-created `GameState`, ledger, context, truth, candidates, source, or policy.

```ts
function resolveMathematicianInformationDecisionFromAcceptedEventStream(
  events: readonly AnyDomainEventEnvelope[],
  taskId: ScheduledTaskId,
): InternalMathematicianResolution;
```

It lives in `packages/domain-core/src/mathematician-internal.ts`. It is absent from both package roots. Only `GameApplicationService` may import it repository-relatively.

### Layer B — Prospective Batch Validator

Layer B is used only before append. It accepts the complete accepted prior stream and the generated two-event batch. It calls Layer A again, constructs the expected delivery and settlement from that independent decision, compares generated values by canonical exact equality, validates order/envelope metadata, validates the prospective complete event stream, and rebuilds the prospective state. It never trusts the application-created payload.

```ts
function validateProspectiveMathematicianInformationPair(input:{
 readonly priorAcceptedEvents:readonly AnyDomainEventEnvelope[];
 readonly deliveryEvent:MathematicianInformationDeliveredEnvelope;
 readonly settlementEvent:ScheduledTaskSettledEnvelope;
}):MathematicianProspectivePairValidationResult;
```

### Layer C — Per-Event Replay Validator

Layer C is the replay adapter used while `applyDomainEvent(stateBefore,event)` applies one already stored `MathematicianInformationDelivered`. Its only semantic inputs are `stateBefore` and the current event. It does not receive a future settlement, complete event stream, `EventStore`, `CommandStore`, network callback, or Layer A arguments. It never calls Layer A and never generates a new Storyteller choice.

```ts
function validateIncomingMathematicianInformationDelivered(input:{
 readonly stateBefore:GameState;
 readonly deliveryEvent:MathematicianInformationDeliveredEnvelope;
}):IncomingMathematicianDeliveryValidationResult;
```

This exact function is local to `mathematician-internal.ts` and is not exported, including from that source module. `event-applier.ts` imports only `applyMathematicianInformationDeliveredReplayAdapter`, which invokes the local validator and appends the validated payload. Neither symbol appears at a package root. Directly importing an internal replay adapter is not a supported game-decision API.

## whyLayerCMayUseStateBefore

The prohibition on a caller-supplied-state resolver means no application, UI, AI, external caller, or package-root consumer may submit arbitrary `GameState` and obtain a playable new count decision. It does not prohibit the event applier from using its canonical pre-event state while rebuilding a complete accepted stream. The provenance chain remains `validateDomainEventStream` → `validateDomainBatchSemantics` → `applyDomainEvent(stateBefore,event)`. Layer C cannot authenticate a standalone snapshot; its supported caller is only the replay path after upstream stream and batch validation. It validates an existing event, does not decide a new delivery, and has no root export.

## sharedPureCore

Layer A and Layer C share one pure algorithm, not duplicated algorithms. Only two internal builders can obtain its branded context: `buildContextFromAcceptedEventStream` and `buildContextFromReplayPreEventState`. The unique-symbol brand is type-only and non-enumerable; no public constructor or cast helper exists.

```ts
declare const canonicalMathematicianContextBrand: unique symbol;

type CanonicalMathematicianContext = {
  readonly contextVersion: "mathematician-canonical-context-v1";
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly phase: "FIRST_NIGHT";
  readonly dayNumber: 0;
  readonly nightNumber: 1;
  readonly evaluatedThroughEventSequence: number;
  readonly expectedDeliveryEventSequence: number;
  readonly firstNightInitializationProvenance: FirstNightInitializationEnvelopeProvenance;
  readonly roster: PlayerRoster;
  readonly taskPlan: FirstNightTaskPlanCreatedPayload;
  readonly taskProgress: FirstNightTaskProgress;
  readonly targetTaskId: ScheduledTaskId;
  readonly targetTask: ScheduledTask;
  readonly ledger: FirstNightAbilityOutcomeLedger;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roleTenures: RoleTenureState;
  readonly philosopherChoices: PhilosopherAbilityChoiceSet;
  readonly grants: GrantedAbilitySet;
  readonly insertions: FirstNightTaskInsertion;
  readonly opportunities: FirstNightActionOpportunityState;
  readonly abilityImpairments: AbilityImpairmentSet;
  readonly impairmentEventProvenance: MathematicianImpairmentEventProvenanceState;
  readonly existingDeliveries: MathematicianInformationState;
  readonly [canonicalMathematicianContextBrand]: true;
};

function buildContextFromAcceptedEventStream(
  events: readonly AnyDomainEventEnvelope[],
  taskId: ScheduledTaskId,
): { readonly context: CanonicalMathematicianContext; readonly rebuiltState: GameState };

function buildContextFromReplayPreEventState(
  stateBefore: GameState,
  event: DomainEventEnvelope<"MathematicianInformationDelivered">,
): CanonicalMathematicianContext;

function deriveMathematicianResolutionFromCanonicalContext(
  context: CanonicalMathematicianContext,
): CanonicalMathematicianDecision;
```

Both builders deep-capture the same exact normalized shape: optional collections become exact empty collections, arrays are dense clones, and the evaluated boundary is the canonical last prior sequence. Layer A and Layer C therefore use the same count classification, candidate logic, source provenance, impairment logic, Vortox logic, and Option A helper. Differential tests compare the two `CanonicalMathematicianDecision` values by canonical exact equality. The normalized philosopherChoices field is the sole choice-event input used by the validated V1/V2 chain builders.

## replayProvenanceCache

Round 2’s represented impairment contract contains accepted envelope ID and sequence. Current impairment payload state does not. To let Layer C reproduce Layer A without the complete stream, replay materializes one rebuildable, non-authoritative cache from accepted `AbilityImpairmentApplied` envelopes whose exact payload is `PhilosopherDuplicateAbilityImpairmentAppliedPayload` or `SnakeCharmerPoisonedAbilityImpairmentAppliedPayload`:

```ts
export type MathematicianImpairmentEventProvenance = {
  readonly impairmentId: AbilityImpairmentId;
  readonly eventId: EventId;
  readonly eventSequence: number;
  readonly batchId: BatchId;
};

export type MathematicianImpairmentEventProvenanceState = {
  readonly entries: readonly MathematicianImpairmentEventProvenance[];
};
```

The entry exact key set is four; the state exact key set is one. `GameState.mathematicianImpairmentEventProvenance` is optional before the first impairment and contains dense entries ordered by `eventSequence`, then `impairmentId` code-unit order. Applying a validated `AbilityImpairmentApplied` with either exact closed payload variant appends exactly one matching entry; duplicate ID, event ID, or sequence fails. It is a rebuildable cache, never accepted as truth outside replay, never projected, and never exposed outside the internal rebuiltState returned by Layer A. This is the only new replay support state not already frozen by Round 2.

## validatedInventoryAndOptionA

Every Mathematician task and chain is validated before support classification.

```ts
type ValidatedV1GainedMathematicianChain = {
  readonly task: ScheduledTask;
  readonly insertion: FirstNightTaskInsertedPayload;
  readonly choice: PhilosopherAbilityChosenPayload;
  readonly grant: PhilosopherAbilityGrantedPayload;
  readonly originalOpportunity: FirstNightActionOpportunity;
  readonly sourceRosterEntry: PlayerRosterEntry;
  readonly sourceRoleAtGrant: CurrentCharacterState;
  readonly abilityInstance: FirstNightAbilityInstanceProvenance & {
    readonly kind: "PHILOSOPHER_GAINED_TASK_V1";
  };
};

type ValidatedV2GainedMathematicianChain = {
  readonly task: ScheduledTask;
  readonly insertion: FirstNightTaskInsertedV2Payload;
  readonly choice: PhilosopherAbilityChosenPayload;
  readonly grant: PhilosopherAbilityGrantedPayload;
  readonly originalOpportunity: FirstNightActionOpportunity;
  readonly sourceRosterEntry: PlayerRosterEntry;
  readonly sourceRoleAtGrant: CurrentCharacterState;
  readonly abilityInstance: FirstNightAbilityInstanceProvenance & {
    readonly kind: "PHILOSOPHER_GAINED_TASK_V2";
  };
};

type ValidatedMathematicianSupportInput = {
  readonly taskPlanVersion: FirstNightTaskPlanVersion;
  readonly baseTasks: readonly ScheduledTask[];
  readonly gainedV1Chains: readonly ValidatedV1GainedMathematicianChain[];
  readonly gainedV2Chains: readonly ValidatedV2GainedMathematicianChain[];
  readonly recordedInsertions: readonly (FirstNightTaskInsertedPayload | FirstNightTaskInsertedV2Payload)[];
};

type LegacyMathematicianSupportClassification =
  | "SUPPORTED_BASE_ONLY"
  | "SUPPORTED_V1_GAINED_ONLY"
  | "SUPPORTED_V2_GAINED_ONLY"
  | "SUPPORTED_V2_BASE_AND_GAINED"
  | "UNSUPPORTED_V1_BASE_AND_GAINED"
  | "INVALID_MIXED_GENERATION";

function classifyLegacyMathematicianSupport(
  input: ValidatedMathematicianSupportInput,
): LegacyMathematicianSupportClassification;
```

Inventory order is exact: validate plan against accepted source facts; parse every Math task ID, source, and generation; require zero or one base task; reconstruct each gained task from exactly one insertion; require exact choice, grant, original Philosopher opportunity, player, seat, source role, chosen Math role, role catalog, revision, and ability-instance cross-links; reject duplicate or orphan task/insertion/choice/grant/opportunity; then classify. `INVALID_MIXED_GENERATION` covers individually parseable but generation-inconsistent plan/insertion combinations and maps to canonical-history invalidity. Malformed chains never map to Option A unsupported.

Layer A calls the helper before count and before settled/next/source checks. Layer B obtains the same classification by calling Layer A. Layer C calls the same helper before recomputing the payload. `UNSUPPORTED_V1_BASE_AND_GAINED` maps at command time to retryable, receipt-free `ApplicationNotConfigured`; in replay, an existing delivery under that classification throws `DomainError("UnsupportedLegacyV1MathematicianReplay", "Legacy V1 duplicate Mathematician delivery is not replayable")`. Replay never returns an application failure object. V1 is never reordered or migrated. V2 duplicate ordering remains base first, then gained by source seat and task-ID code-unit order.

## countWindow

```ts
export type FirstNightMathematicianCountWindow = {
  readonly windowVersion: typeof FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION;
  readonly gameId: GameId;
  readonly nightNumber: 1;
  readonly rulesBaselineVersion: string;
  readonly firstNightInitializedEventId: EventId;
  readonly startEventSequence: number;
  readonly startBoundary: "EXCLUSIVE";
  readonly endEventSequence: number;
  readonly endBoundary: "INCLUSIVE";
};
```

Exact nine keys. The lower anchor is the unique accepted initialization envelope. Layer A sets `endEventSequence=rebuiltState.lastEventSequence`. Layer C requires `stateBefore.lastEventSequence===event.eventSequence-1` and sets `endEventSequence=stateBefore.lastEventSequence`; the payload must equal it. The current delivery is outside its own window. Settlement is never used as the upper boundary. Layer C never scans after the current event.

## countClassification

```ts
export const MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION =
  "mathematician-first-night-count-resolution-v1" as const;

export type MathematicianCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type MathematicianAbnormalPlayer = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly supportingFactIds: readonly FirstNightAbilityOutcomeFactId[];
};

export type MathematicianBlockingUnresolvedFact = {
  readonly auditFactId: FirstNightAbilityOutcomeFactId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly abilityRoleId: RoleId;
  readonly abilityTaskId: ScheduledTaskId;
  readonly causeKind: AbilityOutcomeCause;
};

type MathematicianCountResolutionBase = {
  readonly resolutionModelVersion: typeof MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION;
  readonly window: FirstNightMathematicianCountWindow;
  readonly resolvingSource: MathematicianSourceContract;
  readonly resolvingAbilityInstanceId: FirstNightAbilityInstanceId;
  readonly evaluatedThroughEventSequence: number;
  readonly qualifyingAbnormalFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly distinctAbnormalPlayers: readonly MathematicianAbnormalPlayer[];
  readonly excludedResolvingSourceFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly excludedOwnAbilityFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredNormalFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredPendingFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly redundantUnresolvedFactIds: readonly FirstNightAbilityOutcomeFactId[];
};

type FirstNightMathematicianCountResolution =
  | MathematicianCountResolutionBase & {
      readonly kind: "RESOLVED";
      readonly trueCount: MathematicianCount;
    }
  | MathematicianCountResolutionBase & {
      readonly kind: "UNRESOLVED";
      readonly currentPartialCount: MathematicianCount;
      readonly blockingUnresolvedFacts: readonly MathematicianBlockingUnresolvedFact[];
    };
```

These types are internal except `MathematicianCount` and the payload-carried public value types. Exact disjoint precedence is: current ability instance; remaining resolving-player facts; `NORMAL`; `PENDING_TRIGGER`; qualifying `ABNORMAL`; illegal `ABNORMAL` with false causation; provisional `UNRESOLVED`; player deduplication; same-player unresolved redundancy; otherwise blocking. System information, impairment existence, and impaired-but-correct outcomes do not count. Players sort by seat then player ID; fact IDs sort by code unit. All arrays are dense and unique.

## sourceContracts

```ts
export type MathematicianRoleTenureSnapshot = {
  readonly roleTenureId: RoleTenureId;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: "mathematician" | "philosopher" | "vortox";
  readonly acquiredCharacterStateRevision: number;
  readonly endedCharacterStateRevision: number | null;
};

export type BaseMathematicianSourceContract = {
  readonly kind: "BASE_MATHEMATICIAN";
  readonly taskPlanVersion: FirstNightTaskPlanVersion;
  readonly taskId: ScheduledTaskId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceRoleAtSettlement: RoleSetupSnapshot;
  readonly sourceRoleTenure: MathematicianRoleTenureSnapshot;
  readonly settlementCharacterStateRevision: number;
  readonly abilityInstance: FirstNightAbilityInstanceProvenance & {
    readonly kind: "BASE_ROLE_TASK";
  };
};

export type PhilosopherGainedMathematicianV1SourceContract = {
  readonly kind: "PHILOSOPHER_GAINED_MATHEMATICIAN_V1";
  readonly taskPlanVersion: "first-night-task-plan-v1";
  readonly taskId: ScheduledTaskId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceRoleAtSettlement: RoleSetupSnapshot;
  readonly sourceRoleTenure: MathematicianRoleTenureSnapshot;
  readonly chosenRole: RoleSetupSnapshot;
  readonly philosopherTaskId: ScheduledTaskId;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly grantId: GrantedAbilityId;
  readonly sourceCharacterStateRevision: number;
  readonly settlementCharacterStateRevision: number;
  readonly abilityInstance: FirstNightAbilityInstanceProvenance & {
    readonly kind: "PHILOSOPHER_GAINED_TASK_V1";
  };
};

export type PhilosopherGainedMathematicianV2SourceContract = {
  readonly kind: "PHILOSOPHER_GAINED_MATHEMATICIAN_V2";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly taskId: ScheduledTaskId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceRoleAtSettlement: RoleSetupSnapshot;
  readonly sourceRoleTenure: MathematicianRoleTenureSnapshot;
  readonly chosenRole: RoleSetupSnapshot;
  readonly philosopherTaskId: ScheduledTaskId;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly grantId: GrantedAbilityId;
  readonly sourceCharacterStateRevision: number;
  readonly settlementCharacterStateRevision: number;
  readonly schedulingVersion: "philosopher-gained-first-night-scheduling-v2";
  readonly abilityInstance: FirstNightAbilityInstanceProvenance & {
    readonly kind: "PHILOSOPHER_GAINED_TASK_V2";
  };
};

export type MathematicianSourceContract =
  | BaseMathematicianSourceContract
  | PhilosopherGainedMathematicianV1SourceContract
  | PhilosopherGainedMathematicianV2SourceContract;
```

Base requires one canonical ROLE Math task, roster and catalog equality, active Math tenure at settlement, current revision equality, canonical base instance, and no grant/insertion. Gained V1/V2 require the complete accepted chain and an active Philosopher tenure at settlement; source role is Philosopher and chosen ability role is Mathematician. Add `mathematician` to `SeamstressRelevantRoleId`, role-tenure ID grammar, bootstrap, transition, clone, parser, and validation without changing existing tenure semantics.

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

Exact 11 impairment keys. It must cross-link a unique accepted `AbilityImpairmentApplied` envelope whose exact payload is `PhilosopherDuplicateAbilityImpairmentAppliedPayload` or `SnakeCharmerPoisonedAbilityImpairmentAppliedPayload`: ID/kind/source kind/source player/affected player/seat/full role/revision/event ID/sequence match exactly. `affectedRoleId=affectedRole.roleId`; role equals source role at application and exact catalog snapshot.

Applicability is interval-based, not revision equality: source tenure is active at impairment revision; applied revision `<= settlementCharacterStateRevision`; same tenure remains active at settlement; current source player/seat/role at settlement matches contract. Zero applicable impairment -> EFFECTIVE; exactly one valid drunk/poison -> corresponding known variant; multiple/conflicting/unproved source chain -> `SOURCE_EFFECTIVENESS_UNRESOLVED`. Impairment itself never counts.

The `appliedByEventId` and `appliedByEventSequence` fields are supplied only by the shared branded context constructed from accepted-history replay provenance. The complete-stream builder derives them from the accepted stream. The replay builder derives them from the replay-built provenance cache in `stateBefore`. No caller-authored state or impairment object is accepted as proof.

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

## Shared canonical decision

The shared pure core returns the existing Round-2 exact `FirstNightMathematicianCountResolution` plus the existing exact source contract, source-effectiveness, Vortox, and candidate-resolution carriers. It does not introduce a second public or persisted resolution vocabulary. The internal exact carrier is:

```ts
type CanonicalMathematicianDecision = {
 readonly countResolution: FirstNightMathematicianCountResolution & {readonly kind:"RESOLVED"};
 readonly sourceContract: MathematicianSourceContract;
 readonly sourceEffectiveness: MathematicianSourceEffectiveness;
 readonly vortoxConstraint: MathematicianVortoxConstraint;
 readonly candidateResolution: MathematicianCandidateResolution;
 readonly settlementCharacterStateRevision:number;
 readonly expectedDeliveryEventSequence:number;
};
```

Exact seven keys. Layer A converts this carrier into the frozen 31-key delivery payload. Layer C independently derives this same carrier from the branded replay context and compares the stored 31-key payload exactly. `expectedDeliveryEventSequence` is the last prior accepted event sequence plus one. `settlementCharacterStateRevision` is the reconstructed historical revision at that same upper boundary. No additional key, optional field, caller decision, or alternate result model is permitted.

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

The READY payload is generated only after Layer A has run the complete-stream builder and shared pure core. It is not accepted as caller input. Layer B later reruns Layer A from the prior stream and therefore does not trust the READY object by identity.

## applicationOrder

Exact outer order, respecting that game existence/version derive from stored events:

1. Capture exact command; malformed snapshot -> failed DependencyExecutionFailed/`command-validation`, no receipt.
2. Read existing receipt. Same fingerprint returns idempotent stored result; conflict follows existing behavior.
3. Load complete events; failure -> CommandStoreReadFailed/`event-load`, no receipt.
4. Rebuild pipeline state; failure -> CanonicalStateRebuildFailed/`state-rebuild`, no receipt.
5. Preflight deterministic checks before Math resolver: expected version; game exists; actor allowed; phase FIRST_NIGHT/day0/night1; task plan/progress present; exact Math command shape. These rejected results use existing receipt path. No next/settled/source check occurs here.
6. Invoke Layer A internal complete-stream resolver once.
7. Inside Layer A: validate the stream densely; invoke `validateDomainEventStream`; invoke `rebuildGameState`; identify target existence/type; validate complete canonical Math inventory and V1 chains; classify Option A; only then settled/next; then source-at-settlement; count; source effectiveness; Vortox; candidates/payload.
8. Compare Layer A rebuilt fingerprint to the independently rebuilt pipeline state.
9. Map deterministic resolver rejection to receipt-bearing rejected result.
10. Map Option A/block/canonical/construction to receipt-free failed result.
11. READY: generate metadata; build exact delivery then settlement events; invoke Layer B prospective pair validator; append accepted batch+receipt atomically through the existing commit port; return event-summary accepted result.

Thus targeting V1 base cannot first produce `ScheduledTaskNotNext` or burn a receipt. Malformed V1 history fails canonical validation before unsupported classification.

## pipelineStateFingerprint

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

All eight keys use canonical structural equality. A mismatch is receipt-free retryable `CanonicalStateRebuildFailed` at `first-night-role-information`.

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

```ts
type MathematicianInformationDeliveredEnvelope =
  DomainEventEnvelope<"MathematicianInformationDelivered">;
type ScheduledTaskSettledEnvelope =
  DomainEventEnvelope<"ScheduledTaskSettled">;
```

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

## Layer B — prospective pair validator

Layer B is the only prospective whole-pair validator. It is internal and not exported from either package root:

```ts
type MathematicianProspectivePairValidationResult=
 |{readonly valid:true;readonly prospectiveStateFingerprint:MathematicianPipelineStateFingerprint}
 |{readonly valid:false;readonly code:
    |"EXPECTED_DECISION_MISMATCH"
    |"EXPECTED_SETTLEMENT_MISMATCH"
    |"BATCH_CONTRACT_INVALID"
    |"PROSPECTIVE_STREAM_INVALID"
    |"PROSPECTIVE_REBUILD_MISMATCH";
   readonly reason:string};

function validateProspectiveMathematicianInformationPair(input:{
 readonly priorAcceptedEvents:readonly AnyDomainEventEnvelope[];
 readonly deliveryEvent:MathematicianInformationDeliveredEnvelope;
 readonly settlementEvent:ScheduledTaskSettledEnvelope;
}):MathematicianProspectivePairValidationResult;
```

Exact algorithm:

1. Densely validate `priorAcceptedEvents`, `deliveryEvent`, and `settlementEvent` and reject additional enumerable keys in each exact payload.
2. Require the delivery and settlement to be the exact two-event Math batch: delivery first, settlement second, same game/command/batch/new version/time/actor, distinct event IDs, consecutive event sequences, no phase transition, matching task ID/type, settlement outcome `MATHEMATICIAN_INFORMATION_DELIVERED`, and settlement character-state revision equal to the delivery revision.
3. Rerun Layer A using only `priorAcceptedEvents` and `deliveryEvent.payload.taskId`. Layer B never accepts a caller-provided decision, state, ledger, context, candidate set, or truth.
4. Require Layer A READY. Compare the complete generated delivery payload against Layer A's exact expected 31-key payload using canonical structural equality. Compare the complete settlement payload against Layer A's expected settlement payload the same way.
5. Require the prior upper boundary to equal both `deliveryEvent.sequence-1` and `deliveryEvent.payload.windowSnapshot.endEventSequence`; require `deliveryEvent.payload.deliveryEventSequence===deliveryEvent.sequence`. The delivery itself is never in its own count window.
6. Invoke the existing structural `validateDomainBatchSemantics` for the exact pair.
7. Form `prospectiveEvents=[...priorAcceptedEvents,deliveryEvent,settlementEvent]`; run `validateDomainEventStream(prospectiveEvents)` and `rebuildGameState(prospectiveEvents)`. During rebuild, Mathematician delivery validation is performed only by Layer C and settlement application validation described below; neither calls Layer A or Layer B.
8. Require version `+1`, final sequence `+2`, phase still FIRST_NIGHT, exactly one new delivery, exactly one new terminal ledger fact, only the target task progressed to settled, no unrelated mutation, and final state fingerprint equal to the result predicted from the Layer-A rebuilt state plus the exact pair.

A false result is receipt-free `DependencyExecutionFailed` at `prospective-validation`. Layer B does not append and cannot be called with future settlement omitted.

## Layer C — incoming per-event replay adapter

Layer C is the narrow adapter required by existing per-event replay. It is local to `mathematician-internal.ts`, is not exported from the domain root, is not exported from the application root, and does not call Layer A or Layer B:

```ts
type IncomingMathematicianDeliveryValidationResult=
 |{readonly valid:true;readonly canonicalPayload:MathematicianInformationDeliveredPayload}
 |{readonly valid:false;readonly reason:string};

function validateIncomingMathematicianInformationDelivered(input:{
 readonly stateBefore:GameState;
 readonly deliveryEvent:MathematicianInformationDeliveredEnvelope;
}):IncomingMathematicianDeliveryValidationResult;
```

Layer C receives exactly the already reconstructed state immediately before the current event and the current delivery envelope. It receives no full stream, repository, command store, checkpoint, caller ledger, caller context, future event, or settlement event.

Exact algorithm:

1. Validate `stateBefore` as the canonical replay state and validate the envelope and 31-key payload densely and exactly.
2. Require `stateBefore.lastEventSequence===deliveryEvent.sequence-1`; require `deliveryEvent.payload.deliveryEventSequence===deliveryEvent.sequence`; require the window upper boundary and its evaluated-through sequence to equal `stateBefore.lastEventSequence`. This makes the current delivery absent from its own window.
3. Require phase FIRST_NIGHT/day0/night1, the unique next pending task to be the payload task, task type `MATHEMATICIAN_INFORMATION`, source identity valid, and no existing delivery/fact for the delivery/task/instance.
4. Build the branded context with `buildContextFromReplayPreEventState(stateBefore, deliveryEvent)`. The builder consumes only rebuildable canonical state, including the accepted-event provenance caches created while earlier events were replayed.
5. Run the shared pure context resolver. It recomputes the source contract, historical Option-A classification, count window, ledger classification, true count, effectiveness, Vortox, candidates, selected count, policy, reliability, canonical ID, and expected sequence.
6. Construct the exact expected 31-key payload and compare it with the incoming payload using closed, field-aware canonical structural equality. Raw `JSON.stringify` is not a semantic comparator. Any missing/extra/sparse/noncanonical value or any mismatch returns invalid.
7. A supported delivery returns the canonical deep-cloned payload. A V1 base+gained delivery throws `DomainError` through the adapter. Mixed-generation or malformed history also throws `DomainError`; no guess or legacy migration is allowed.

`event-applier.ts` imports only this narrow internal application adapter:

```ts
function applyMathematicianInformationDeliveredReplayAdapter(
 stateBefore:GameState,
 event:MathematicianInformationDeliveredEnvelope,
):GameState;
```

It invokes Layer C, throws `DomainError` on invalid input, and appends the canonical payload to `GameState.mathematicianInformation.deliveries`. It does not settle the task and does not append the ledger fact itself.

## Delivery, ledger, and settlement application order

For an accepted pair, the existing per-event application sequence is frozen:

1. `applyDomainEventWithoutOutcomeLedger(stateBefore, delivery)` invokes Layer C and appends the full delivery payload while the scheduled task remains `PENDING`.
2. The existing outcome-ledger wrapper sees the terminal delivery, derives the exact Mathematician terminal fact from `stateBefore` plus the canonical delivery, and appends that fact. The fact exists immediately after delivery application.
3. Applying the adjacent `ScheduledTaskSettled` event requires the matching stored delivery and the matching Mathematician terminal fact already to exist and validate exactly; only then does it progress the task. It creates no second delivery and no second ledger fact.
4. `ScheduledTaskSettled` is not a terminal ability-outcome event and must not be added to `TerminalAbilityOutcomeEventType`.

The settlement-event applier therefore performs a local stored-state check before progressing a `MATHEMATICIAN_INFORMATION` task: unique matching delivery by task ID/type/outcome/revision, canonical delivery ID, terminal fact source event/evidence cross-link, task still pending, and no duplicate settlement. This check does not call Layer A, Layer B, full-stream validation, or rebuild.

## Structural batch semantics

`validateDomainBatchSemantics(currentState,events)` retains its signature. Add an exact structural Math branch for `[MathematicianInformationDelivered,ScheduledTaskSettled]`: same batch/version, consecutive sequences, distinct IDs, matching task/type/revision, Math outcome, validated source, no third event, and no transition. The structural branch may invoke Layer C on `currentState` and the delivery, but it must not invoke Layer A or Layer B. Delivery appends information+fact; settlement advances only the target.

Naked delivery, naked settlement, reversed order, a third event, mixed transition, mismatched source/task/revision/outcome, nonconsecutive sequence, or different batch/version fails. This generic branch plus the per-event adapters preserves existing replay signatures and eliminates recursive stream validation.

## Stored-chain validator and trusted replay

The incoming Layer-C validator is not the stored-chain validator. Full-history validation and projection use a separately named internal boundary:

```ts
type MathematicianValidationResult=
 |{readonly valid:true}
 |{readonly valid:false;readonly reason:string};

type MathematicianDeliveryCheckpoint={
 readonly deliveryEventIndex:number;
 readonly preEventState:GameState;
 readonly deliveryEvent:MathematicianInformationDeliveredEnvelope;
 readonly stateAfterDelivery:GameState;
 readonly settlementEvent:ScheduledTaskSettledEnvelope;
 readonly stateAfterSettlement:GameState;
};

function replayTrustedMathematicianProjectionStream(
 events:readonly AnyDomainEventEnvelope[],
):{
 readonly finalState:GameState;
 readonly checkpoints:readonly MathematicianDeliveryCheckpoint[];
};

function validateStoredMathematicianInformationDelivered(input:{
 readonly acceptedEvents:readonly AnyDomainEventEnvelope[];
 readonly checkpoint:MathematicianDeliveryCheckpoint;
 readonly finalState:GameState;
}):MathematicianValidationResult;
```

Checkpoint exact six keys. Trusted replay canonical-captures the event array, runs stream validation, then performs one sequential rebuild while cloning the exact pre-delivery, post-delivery, and post-settlement states. It records only adjacent exact Math pairs.

The stored validator consumes only trusted replay outputs. It verifies exact payload/ID/sequence; historical pre-state plan/roster/`CurrentCharacterStateSet`/opportunity/grant/insertion/provenance; Option A; adjacent same-batch settlement; initialization/window; pre-event ledger at stored end; exclusions/classification/dedup/count; source tenure/effectiveness and impairment source event; Vortox identity/tenure/effect; candidates/selection/reliability/policy; post-delivery state copy and fact; post-settlement progress; final-state copy; terminal evidence order; and duplicate temporal order. Later state and later ledger facts may prove that the stored copy survived, but never recompute the historical decision. This validator calls neither `validateDomainEventStream` nor `rebuildGameState`, so the trusted replay performs those operations without recursion.

No public API accepts `GameState`, a checkpoint, or a reconstructed ledger as accepted-history proof for Mathematician information. Legacy state-only projection entry points must fail closed with `PrivateKnowledgeUnavailable` whenever state contains a Mathematician delivery. Safe player and AI projection builders accept the complete event stream, call `replayTrustedMathematicianProjectionStream`, require every stored checkpoint to pass, and only then project the selected count.

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

Base exact keys remain the existing eight. Optional exact keys add only `mathematicianInformation` and `mathematicianKnowledgeModelVersion` to the existing optional set. `PlayerMathematicianInformationView` has exact single key `count` in 0..11.

Biconditional: Math stage present iff both Math optional fields are own enumerable properties; either field without other/stage, stage without both, or wrong version fails. Stage is last in deterministic order, dense/unique. For a viewer, zero validated source deliveries -> all three absent; exactly one -> all present and count=selectedCount; more than one -> `PrivateKnowledgeUnavailable`, even if counts equal. Source matching uses stored source player, never current role. Player and AI builders share the same trusted stream/checkpoints, construction and final `validatePlayerPrivateKnowledgeViewShape`; outputs are byte-equivalent. Other viewers get no Math fields. Hidden payload data never enters view/serialization.

## Differential equivalence contract

For every supported accepted history and each Mathematician delivery in it, all three derivations must agree exactly:

- Layer A on the accepted prefix ending immediately before delivery;
- Layer C on the trusted replay `stateBefore` plus delivery sequence; and
- the stored-chain validator at the trusted checkpoint.

They must produce or validate the same 31-key payload, count window, source and ability-instance identity, ledger categories, true count, effectiveness, Vortox constraint, candidate list, selected count, policy, reliability, and revision. Differential tests cover base, V1 gained-only, V2 gained-only, V2 duplicate base then gained, impairment, Vortox, and tampering. Any divergence is a deterministic failure, not a fallback to one layer's answer.

## Ledger terminal-event closure

Add `"MathematicianInformationDelivered"` to `TerminalAbilityOutcomeEventType`. Add the same literal to every closed terminal-event carrier, set, exact event union, event-to-task map, event-to-role/source map, derivation switch, canonical validation switch, clone/shape switch, replay switch, and exhaustive compile-time assertion. Its task mapping is exactly `MATHEMATICIAN_INFORMATION`. Its role is exactly `mathematician` through the validated source contract.

Do not add `ScheduledTaskSettled` to `TerminalAbilityOutcomeEventType`, the terminal set, or any terminal mapping. The delivery is the sole terminal ability outcome; settlement only progresses the task after the delivery and fact exist.

The required closed type is therefore:

```ts
export type TerminalAbilityOutcomeEventType =
  | "PhilosopherActionDeferred" | "PhilosopherAbilityGranted"
  | "SnakeCharmerNoSwapResolved" | "SnakeCharmerIneffectiveResolved" | "SnakeCharmerDemonSwapApplied"
  | "EvilTwinInformationDelivered" | "WitchDeathPendingMarked" | "WitchIneffectiveResolved"
  | "CerenovusMadnessInstructionDelivered" | "ClockmakerInformationDelivered"
  | "DreamerInformationDelivered" | "SeamstressInformationDelivered"
  | "MathematicianInformationDelivered";
```

The exact event-to-task record includes:

```ts
MathematicianInformationDelivered:"MATHEMATICIAN_INFORMATION"
```

All records must remain typed against the complete closed union so an omitted Mathematician key is a compile-time error. No default branch may silently classify an unknown terminal event.

## Mathematician delivery evidence

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

`MathematicianDeliveryEvidence` has exactly seven enumerable keys. Its primary identity is `deliveryId`. Exact validation requires canonical delivery ID round-trip, matching task ID and generation, matching source player, `trueCount` and `selectedCount` in the fixed domain, and the terminal event ID equal to the source event ID. Missing, extra, sparse, noncanonical, conflicting-identity, or duplicate evidence fails.

Add `MATHEMATICIAN_DELIVERY` as the last closed evidence-kind rank. Existing evidence-kind ranks and existing accepted fact ordering do not change. For a fact containing `MATHEMATICIAN_DELIVERY`, the canonicalizer uses the frozen Mathematician evidence-slot order below as a Mathematician-specific exact ordering branch; for facts without it, the current rank algorithm is byte-for-byte unchanged. This prevents accepted 2B18A facts from being reranked while making the Round-2 Mathematician order explicit.

## Mathematician evidence order and branch matrix

The canonical Mathematician evidence slot order is:

1. `SOURCE_EVENT`;
2. `TASK`;
3. original `ACTION_OPPORTUNITY` only for gained V1/V2 provenance;
4. `CHARACTER_STATE`;
5. source `PLAYER_ROLE_AT_REVISION`;
6. source `ROLE_TENURE`;
7. `PHILOSOPHER_GRANT` only for gained V1/V2;
8. `FIRST_NIGHT_TASK_INSERTION` only for gained V1/V2;
9. source `ABILITY_IMPAIRMENT` only when the source is known impaired;
10. Vortox `PLAYER_ROLE_AT_REVISION` only when there is a current Vortox variant carrying identity;
11. Vortox `ROLE_TENURE` only when there is a current Vortox variant carrying identity;
12. Vortox `ABILITY_IMPAIRMENT` only for `NONE_CURRENT_VORTOX_KNOWN_IMPAIRED`;
13. `MATHEMATICIAN_DELIVERY`.

Omitted conditional slots close left while preserving relative order. Repetition is forbidden except the explicitly separate source/Vortox role, tenure, and impairment slots, distinguished by exact player/tenure/impairment identity. Every fact requires exactly one each of SOURCE_EVENT, TASK, CHARACTER_STATE, source PLAYER_ROLE_AT_REVISION, source ROLE_TENURE, and MATHEMATICIAN_DELIVERY.

Required/forbidden matrix:

- Base source: forbids Philosopher grant, insertion, and all action-opportunity evidence.
- Gained V1: requires exactly the original closed Philosopher opportunity, exact V1 grant, and exact V1 insertion; forbids V2 scheduling fields.
- Gained V2: requires exactly the original closed Philosopher opportunity, exact V2 grant, and exact V2 insertion including grant/scheduling version; forbids V1 insertion shape.
- No Mathematician terminal action opportunity is invented. `MATHEMATICIAN_INFORMATION` is not an action task. The gained branch's one action opportunity is historical evidence for the Philosopher choice/grant, not a terminal Mathematician opportunity.
- EFFECTIVE source: forbids source impairment evidence.
- KNOWN_DRUNK or KNOWN_POISONED source: requires exactly the payload-represented impairment with exact accepted application provenance.
- NONE_NO_CURRENT_VORTOX: forbids all Vortox role, tenure, and impairment evidence.
- VORTOX_FALSE_REQUIRED: requires exactly the carried Vortox role and active tenure; forbids a Vortox impairment.
- NONE_CURRENT_VORTOX_KNOWN_IMPAIRED: requires the carried Vortox role, active tenure, and exact represented Vortox impairment.
- Source and Vortox may be the same evidence kind but cannot collapse unless all branch identities genuinely coincide; a conflicting primary identity fails.

Cross-links are exact: SOURCE_EVENT envelope, TASK, source contract, ability instance, source player/seat/role/revision, tenure, grant, insertion, impairment event, Vortox identity, delivery ID, task ID, counts, and terminal event ID must all equal the canonical payload and `stateBefore` history. Shape validation alone is not accepted-history provenance.

## Mathematician outcome classification

The terminal fact is derived while the task is still pending, from `stateBefore` plus the validated delivery:

- `RULE_CORRECT` with `selectedCount===trueCount` -> `NORMAL`, `NO_OTHER_CHARACTER_ABILITY`, `causedByAnotherCharacterAbility:false`.
- `DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS` with unequal counts -> `ABNORMAL`, `SOURCE_DRUNKENNESS`, `true`.
- `DETERMINISTIC_FALSE_WITH_KNOWN_POISONING` with unequal counts -> `ABNORMAL`, `SOURCE_POISONING`, `true`.
- `VORTOX_CONSTRAINED_FALSE` with unequal counts -> `ABNORMAL`, `VORTOX_FALSE_INFORMATION`, `true`, including the represented source impairment if one exists; Vortox is the delivered-false constraint cause in this branch.

A reliable false delivery, unreliable branch with inconsistent source-effectiveness evidence, Vortox truth, false result without the required evidence, truth with a false-only reliability label, or any status/cause/boolean mismatch throws `InvalidFirstNightAbilityOutcomeFact`. The Math fact's source sequence is the delivery sequence and therefore cannot appear in that delivery's own count window. A later supported Mathematician window may read it normally.

## Replay and stored fact chain

The delivery adapter first validates the payload. The outcome-ledger wrapper then derives the unique canonical fact and appends it. Stored replay requires:

- exactly one fact whose `sourceEventId`, sequence, batch, task, instance, source player/seat/role, evaluated revision, delivery evidence, status, cause, boolean, and evidence order match the delivery;
- fact ID exactly `formatFirstNightAbilityOutcomeFactId(delivery.eventId)`;
- no duplicate fact or delivery;
- the adjacent settlement to find this exact fact and delivery before task progress;
- final state to preserve both objects unchanged.

The current delivery and fact are excluded from the current count through the upper-bound contract, not by deleting or post-filtering accepted history.

## Public and private API boundary

The domain root may export event, payload, state, view value types, exact shape validators, and deterministic delivery ID format/parser required by canonical handling. It must not export Layer A, Layer B, Layer C, shared branded contexts/builders/core, internal source/count/candidate/effectiveness/Vortox resolvers, validated inventory classifier, stored checkpoints, stored-chain validator, or hostile test seams. The application root exports none of those. Application uses a repository-relative internal import. Runtime namespace scans and `@ts-expect-error` checks freeze absence.

Player and AI outputs expose only `{count:selectedCount}` plus the Mathematician knowledge-model version and stage. They never expose `trueCount`, abnormal players, fact IDs, candidate domain, legal candidates, reliability, impairment, Vortox, source contract, role tenure, policy, instance, window, or resolution metadata.

## Implementation file plan

- New `packages/domain-core/src/mathematician.ts`: public payload/state/view contracts, IDs, exact shape validators only.
- New `packages/domain-core/src/mathematician-internal.ts`: Layer A complete-stream resolver, Layer B prospective pair validator, Layer C incoming replay adapter, shared branded context/core, inventory, count/effect/Vortox/candidate functions, and stored-chain validator; absent both package roots.
- New `packages/domain-core/src/mathematician.test.ts` and test-only `mathematician-test-fixtures.ts`.
- Modify domain `command.ts`, `events.ts`, `game-state.ts`, `errors.ts`, `first-night-task-plan.ts`, `event-applier.ts`, `index.ts` for exact command/event/state/outcome/application and export absence.
- Modify replay provenance construction in the narrow existing state/application locations needed to build the accepted impairment-envelope cache; do not change public replay signatures.
- Modify `seamstress.ts` role-tenure tracker to include Mathematician and retain old behavior; add regression tests.
- Modify ledger TS/test for the terminal literal, all closed mappings, delivery adapter, exact evidence union/order/matrix, and fact classification.
- Modify domain-batch-semantics TS/test and rebuild tests for exact pair structure, Layer-C event application, fact-before-settlement, and nonrecursive replay.
- Modify application service/test to call Layer A then Layer B and retain receipt/failure semantics.
- Modify projections/private view TS/test so safe event-stream APIs validate all stored checkpoints and state-only APIs fail closed when Math history exists.
- Update `docs/rules/ROLE_COVERAGE_MATRIX.md`, required Slice status/control docs, Autopilot log, and PR rule traceability. Keep status PARTIAL.

## Explicit out of scope

No other-night Mathematician; no general poisoning engine; no Traveller mechanics; no Storyteller-discretionary selection beyond the approved deterministic simulator policy; no rule override changes; no legacy V1 task reordering/migration; no public truth resolver; no caller-supplied canonical state/ledger/context/decision; no redesign of `validateDomainEventStream`, `validateDomainBatchSemantics`, `applyDomainEvent`, or `rebuildGameState` signatures; no phase transition; no second fact at settlement; no 2B19 and no 2B18A reinterpretation.

## Tests — layering contract and original 1–140

All original Round-2 tests remain mandatory. Each numbered item is a separate test with its own direct assertion; shared setup is allowed but one assertion cannot be counted under two numbers. `[CSI]` complete accepted-stream integration; `[APP]` application/store integration; `[INT]` non-root pure internal contract; `[RSP]` replay/stored/projection; `[EXP]` package export absence; `[HRS]` explicitly non-accepted hostile-replay/pure semantic seam; `[REG]` independent regression/gate.

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

## Tests — Option A 1–45

The same layer codes apply; every number is an independent direct assertion.

1 `[CSI]` V1 only-base plan. 2 `[CSI]` base normal historical position. 3 `[APP]` base-only settles. 4 `[APP]` delivery+settlement. 5 `[CSI]` no insertion required. 6 `[RSP]` BASE source contract. 7 `[RSP]` valid ledger fact. 8 `[RSP]` replay passes. 9 `[RSP]` full-stream private view count only.

10 `[CSI]` V1 only-gained plan. 11 `[CSI]` no base task. 12 `[CSI]` gained next at V1 position. 13 `[APP]` gained-only settles. 14 `[RSP]` exact V1 gained source. 15 `[RSP]` grant/insertion/opportunity/revision/instance cross-links. 16 `[RSP]` no V2/migration. 17 `[RSP]` delivery+settlement+fact. 18 `[RSP]` full-stream view count only.

19 `[CSI]` validated V1 inventory has base+gained. 20 `[CSI]` historical gained is next. 21 `[APP]` gained command returns ApplicationNotConfigured. 22 `[APP]` internal diagnostic exact reason while public shape has no details. 23 `[APP]` retryable true. 24 `[APP]` no receipt. 25 `[APP]` no events. 26 `[APP]` gained unsettled. 27 `[APP]` base unsettled. 28 `[APP]` version unchanged. 29 `[APP]` ledger unchanged. 30 `[APP]` opportunity/progress unchanged. 31 `[APP]` same command ID retryable again. 32 `[APP]` naming base cannot skip gained or write non-next receipt. 33 `[CSI]` restart/rebuild same unsupported. 34 `[RSP]` player/AI hide limitation.

35 `[APP]` V2 base-only succeeds. 36 `[APP]` V2 gained-only succeeds. 37 `[CSI]` V2 duplicate base first. 38 `[CSI]` after base gained next. 39 `[CSI]` later gained reads earlier base fact. 40 `[CSI]` earlier base cannot read future gained. 41 `[CSI]` multiple gained stable. 42 `[HRS]` V1/V2 mixture is canonical-invalid, not unsupported.

43 `[HRS]` fully validated historical V1 duplicate inventory plus later base-role change remains unsupported; fixture is pure semantic, not accepted integration. 44 `[HRS]` supported gained-only source-at-settlement invalidity rejects after support classification; not accepted integration. 45 `[HRS]` classifier output is identical under changed latest holder count because it consumes validated historical inventory only.

## Tests — Design Round 3 additional 1–40

These 40 tests are additional to, not replacements for, the original 140 and Option-A 45. Each numbered item requires its own direct assertion.

### Layer differential

1. Accepted event stream Layer A resolution succeeds.
2. The corresponding delivery recomputes successfully in Layer C.
3. Layer A and Layer C resolution are canonically equal.
4. Layer A and Layer C candidate resolution are canonically equal.
5. Layer A and Layer C source provenance is equal.
6. Layer A and Layer C impairment/Vortox resolution is equal.
7. Layer A and Layer C Option A classification is equal.

### Per-event replay

8. Delivery applies successfully while the task is still PENDING.
9. Immediately after delivery, the task is not yet settled.
10. Immediately after delivery, the ledger already contains the Math fact.
11. Settlement then succeeds.
12. Settlement without the preceding delivery is rejected.
13. Delivery without settlement is rejected by the batch validator.
14. A reversed batch is rejected.
15. Delivery replay does not require a complete event-stream parameter.

### Upper boundary

16. `stateBefore.lastEventSequence = eventSequence - 1`.
17. Window end equals `stateBefore.lastEventSequence`.
18. A window end containing the current event sequence is rejected.
19. A window end one sequence too early is rejected.
20. The current delivery does not enter `trueCount`.

### API boundary

21. The package root has no state resolver.
22. The package root has no ledger resolver.
23. The package root has no replay validator.
24. Application command decision uses only event-stream Layer A; prospective validation is delegated to Layer B and no caller state/ledger resolver is exposed.
25. Event applier calls only Layer C for Math delivery.
26. Layer A is not called in the rebuild loop.
27. Layer C does not access EventStore or complete events.

### Terminal type

28. `MathematicianInformationDelivered` is a legal `TerminalAbilityOutcomeEventType`.
29. SOURCE_EVENT exact shape accepts that event type.
30. The terminal event maps to `MATHEMATICIAN_INFORMATION`.
31. `ScheduledTaskSettled` does not generate a second fact.
32. Math delivery fact has the exact shape.
33. Math delivery fact obeys the complete cause matrix.
34. A gained information task does not fabricate a terminal action opportunity.

### Option A

35. V1 base-only is supported by both Layer A and Layer C.
36. V1 gained-only is supported by both Layer A and Layer C.
37. V1 base+gained returns unsupported from Layer A.
38. Replaying a V1 base+gained delivery throws `DomainError`.
39. V2 base+gained is supported base-first by both Layer A and Layer C.
40. No V1 migration or reordering occurs.

## Required test total and gates

The implementation authority contains 225 mandatory numbered tests: original 140 + Option A 45 + Round 3 adapter/terminal 40. Export-absence compile-time/runtime assertions are mandatory even if the test runner reports them inside one of those files. No original assertion may be weakened, deleted, relabeled as accepted integration when it is `[HRS]`, or counted twice.

Implementation is complete only when exact types/key sets/parsers/validators are materialized; Layer A/B/C signatures and call boundaries are enforced; A/C share only the branded pure context core; no hidden decision or replay resolver is root-exported; event replay never calls Layer A or Layer B; delivery applies while task is PENDING; ledger fact exists before settlement; all 225 independent assertions and export-absence checks pass; safe full-stream projection passes and old state-only projection fails closed for Math; accepted 2B18A and all listed role/replay/projection regressions pass; full `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, and `git diff --check` pass; frozen exact-head Ubuntu/Windows CI passes; the PR body contains Rule Evidence, Rule Claims Implemented, Explicitly Unsupported Rules, Rule Source Revisions, and Rule-to-Test Traceability; final review supplies both exact pass verdicts with no blockers; and no commit follows a passing frozen-head review without fresh CI and review.

## Blocker closure traceability

1. Round-2 replay-recursion blocker: closed by three noninterchangeable layers. Layer A owns new command decisions from complete accepted streams. Layer B owns prospective exact pair validation and may validate/rebuild the prospective full stream. Layer C validates and applies one incoming delivery from `stateBefore` without full stream, EventStore, repository, future settlement, Layer A, or Layer B. The incoming validator and stored-chain validator are explicitly different functions. Existing `validateDomainEventStream`, `validateDomainBatchSemantics`, `applyDomainEvent`, and `rebuildGameState` signatures are unchanged.
2. Round-2 terminal-union blocker: closed by adding `MathematicianInformationDelivered` to `TerminalAbilityOutcomeEventType` and every closed map/set/switch, mapping it to `MATHEMATICIAN_INFORMATION`, deriving exactly one terminal fact at delivery, and explicitly excluding `ScheduledTaskSettled` from the terminal union and fact derivation.
3. Upper-bound and self-count ambiguity: closed by requiring Layer-C `stateBefore.lastEventSequence===delivery.sequence-1`, window end equal to that pre-event sequence, and the delivery/fact to be absent until after the payload is validated.
4. Delivery/settlement ordering ambiguity: closed by applying delivery and then the terminal ledger fact while the task remains PENDING, validating both during settlement application, then progressing only that task.
5. Shared-logic drift: closed by A/C branded context builders feeding one pure core and by seven differential assertions plus supported/hostile branch tests.
6. Option A drift: closed by the same exact six-valued validated classifier feeding both builders; V1 base+gained is receipt-free unsupported at command decision and DomainError during replay; V1 base-only/gained-only and V2 base-first remain unchanged.
7. Evidence ambiguity: closed by the seven-key Math delivery evidence, terminal literal, complete conditional source/gained/impairment/Vortox matrix, no fake Math action opportunity, and a Math-specific ordering branch that leaves all existing accepted evidence ranks unchanged.

## Design-review gate

This file is the sole Round-3 implementation authority and is ready only for an independent read-only Design Round 3 rule-design review. It does not itself assert `RULE_DESIGN_PASS`. The reviewer must independently read the external sources or approved snapshots, resolved evidence, official nightsheet, coverage matrix, Round-2 design and review, this complete Round-3 authority, and relevant production contracts.

If the independent verdict is not exactly `RULE_DESIGN_PASS`, the controller must set `HUMAN_BLOCKED`, create no feature branch, implement no production code or tests, and must not infer or request Design Round 4.

## coverageStatus

`PARTIAL`. Supported: first night only, fixed twelve-player/no Traveller boundary, accepted ledger, base and supported gained sources, deterministic impairment/Vortox semantics within represented evidence, Option A boundary, exact per-event replay, and safe private count. Unsupported: other night, broader poisoning engines, Travellers, free Storyteller discretionary selection, general dawn reset, and all explicit out-of-scope mechanics. Do not mark COMPLETE.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_3
