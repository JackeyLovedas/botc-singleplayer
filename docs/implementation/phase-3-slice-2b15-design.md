# Phase 3 Slice 2B15 Proposed Design v2: Seamstress First-Night Choice, Stable Ability Tenure, and Truth-Favoring Private Information

Supersedes `docs/implementation/phase-3-slice-2b15-design.md` as reviewed at `a31562b5d0751128b94b82289c2d21e954ea5ad7`.

Rule evidence: `docs/rules/evidence/2B15.md`, current verdict `RULE_READY`.

Prior design-review verdict: `RULE_DESIGN_FIX_REQUIRED`.

This replacement resolves all six review findings. The architect made no file changes.

## 1. Bounded scope and architecture decision

Implement one first-night Seamstress choice pipeline for both currently reachable ability sources:

```text
public capability declared before character assignment
→ base ROLE or Philosopher-granted Seamstress ability instance exists
→ first-night V2 action opportunity opens with one unspent entitlement
→ SubmitSeamstressAction(CHOOSE_TWO_PLAYERS)
→ SeamstressTargetsChosen
→ SeamstressAbilitySpent
→ SeamstressInformationDelivered
→ ScheduledTaskSettled(SEAMSTRESS_INFORMATION_DELIVERED)
```

The four action events form one atomic batch. The existing `DEFER` behavior remains a two-event, non-spending settlement.

Included:

- Base Seamstress and the currently reachable `PHILOSOPHER_GAINED_ABILITY` Seamstress task source.
- Exactly two distinct, non-self players from the fixed modeled roster.
- Stable ability-instance and use-entitlement identity independent of scheduled tasks.
- Opportunity creation revision `N`, settlement revision `M`, and continuous source-tenure validation.
- Explicit target choice, spend, correct comparison, delivered answer, and settlement facts.
- Stored Philosopher-duplicate drunkenness and other represented impairment facts.
- Effective Vortox false-information constraint from the already sourced 2B15 evidence.
- A truth-favoring delivery policy that never conditions command success on hidden impairment.
- Exact V1/V2 opportunity, deferred-event, clone, equality, application, and replay behavior.
- Exact private historical projection supporting more than one delivery.

Non-goals:

- Other-night task creation or recurrence.
- Death, revival, or Traveller state.
- Spy/Recluse or any other registration decision.
- Barista `SOBER AND HEALTHY` or `ACTS TWICE` execution.
- No Dashii neighbour-search or continuous-poison derivation.
- General character-change, life-cycle, or effect-lifecycle implementation.
- UI, AI policy, Electron, persistence, or network work.

Boundedness decision: this remains one coherent slice. Base and Philosopher-granted sources share the same command, ability-instance, spend, information, validation, and projection path. The slice must stop rather than absorb other-night scheduling, registration, life state, Barista, or a No Dashii continuous-rule engine.

## 2. Conservative R01–R13 traceability

| Evidence claim | v2 treatment |
|---|---|
| R01 | Full for the modeled fixed roster: exactly two distinct non-self players |
| R02 | Partial only: ordinary fixed-roster players are supported; living/dead and Traveller distinctions are not represented |
| R03 | Full for malformed, wrong-count, duplicate, self, and unknown modeled targets |
| R04 | Full: invalid commands append no events, spend nothing, and leave the opportunity open |
| R05 | Partial: the base entitlement is spent exactly once and current opportunity creation respects it; no other-night scheduler exists, so future nightly suppression is not claimed complete |
| R06 | Full for represented stored impairment, including Philosopher duplicate; legal use always spends. Unmodeled continuous poison cannot cause rejection and uses the same legal truth-favoring delivery policy |
| R07 | Full for native `currentAlignment` at settlement revision `M`; registration-adjusted alignment remains unsupported |
| R08 | Full for native current alignments: equal gives `YES`, mixed gives `NO` |
| R09 | Unsupported: the exact public SNV catalog has no registering roles and the engine has no registration choice model |
| R10 | Full: targets and delivered answer are private to the source only |
| R11 | Partial: rule-correct and delivered answers, represented impairment, unresolved effectiveness, and Vortox constraint are separate; Barista and registration remain unsupported |
| R12 | Partial: the stored delivery is not recomputed from later modeled character/alignment state; death, revival, and registration history are not claimed |
| R13 | Partial: V1/V2 `DEFER` remains a non-use and leaves the entitlement unspent; actual later-night opportunity creation is out of scope |

The stale `SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND` expectation remains prohibited. A represented impaired legal use must emit the same spend event as an unimpaired legal use.

## 3. Public capability boundary and hidden-state non-oracle

Introduce one public canonical fact before `CharactersAssigned`:

```ts
type SeamstressResolutionCapabilityDeclaredPayload = {
  readonly rulesBaselineVersion: string;
  readonly capabilityVersion: "seamstress-snv-first-night-resolution-v1";
  readonly scriptId: "sects_and_violets";
  readonly supportedRoleCatalogSignature: "canonical-role-catalog-v1:60ac4718";
  readonly targetPopulationModel: "FIXED_ROSTER_WITHOUT_LIFE_OR_TRAVELLER_STATE";
  readonly alignmentModel: "NATIVE_CURRENT_ALIGNMENT_ONLY";
  readonly sourceEffectCoverage: "REPRESENTED_IMPAIRMENTS_WITH_UNRESOLVED_CONTINUOUS_EFFECTS";
  readonly deliveryPolicyVersion: "seamstress-truth-favoring-delivery-policy-v1";
};
```

For new games, `SelectScript` appends this public fact after `ScriptSelected` and before setup/assignment. Legacy streams without it still replay, but cannot create V2 Seamstress opportunities. The declaration depends only on the public rules baseline, script, and compiled exact catalog signature. It must not inspect selected roles, assignments, impairment, Vortox, or any other hidden fact.

Within this declared capability, every structurally legal V2 `CHOOSE_TWO_PLAYERS` command must be accepted regardless of whether the source is sober, drunk, poisoned, in a No-Dashii-containing hidden assignment, or under Vortox. Remove `UnsupportedSeamstressModifiedResolution`; neither application validation nor domain validation may return a modifier-specific rejection.

The delivery policy is:

```text
if an effective Vortox constraint is represented at settlement M:
    deliveredAnswer = opposite(ruleCorrectAnswer)
else:
    deliveredAnswer = ruleCorrectAnswer
```

This policy does not branch on Seamstress impairment. A correct answer is mandatory for an effective unmodified ability and is also legal for a drunk or poisoned ability, where either answer is permitted. Vortox is handled separately because the sourced rule mandates false information even when the Seamstress is impaired.

Canonical effectiveness must never lie. With a represented active impairment it records `KNOWN_INEFFECTIVE`; without one it records `NOT_PROVEN`, not `EFFECTIVE`, because continuous poison is not fully modeled. Those canonical fields are never exposed in player or AI private views.

No Dashii evidence gate:

- This slice does not implement or assert No Dashii neighbour selection, skipping, poison lifecycle, or effectiveness.
- A hidden assignment containing No Dashii cannot change command acceptance, event count/type, receipt shape, or the no-Vortox truth-favoring result.
- Before any future code or test derives No Dashii poison targets, the rule-researcher must reopen fresh Chinese and official No Dashii sources, add revisions/hashes and claims to `docs/rules/evidence/2B15.md` or a successor evidence file, and return a new `RULE_READY`.
- Until that gate passes, no event may claim `NO_DASHII_NEIGHBOUR_POISON`, and an absence of stored impairment may not be recorded as `EFFECTIVE`.

Registration, Travellers, and death are excluded by the public capability before hidden assignment. They are not detected and rejected from a player command.

## 4. Exact legacy V1 and new V2 opportunity contracts

The accepted legacy V1 visibility is exactly:

```ts
type SeamstressActionOpportunityVisibilityV1 = {
  readonly canDefer: true;
  readonly supportedDecisionKinds: readonly ["DEFER"];
  readonly futureUnsupportedDecisionKinds: readonly ["CHOOSE_TWO_PLAYERS"];
};
```

V1 has no `visibilitySchemaVersion`, no `canChooseTargets`, no target schema, and no ability-instance fields.

New visibility is exactly:

```ts
type SeamstressActionOpportunityVisibilityV2 = {
  readonly visibilitySchemaVersion: "seamstress-first-night-action-v2";
  readonly resolutionCapabilityVersion: "seamstress-snv-first-night-resolution-v1";
  readonly canDefer: true;
  readonly canChooseTargets: true;
  readonly supportedDecisionKinds: readonly ["DEFER", "CHOOSE_TWO_PLAYERS"];
  readonly futureUnsupportedDecisionKinds: readonly [];
  readonly targetSchema: "EXACTLY_TWO_DISTINCT_OTHER_MODELED_PLAYERS";
};
```

The common historical source fields remain:

```ts
type SeamstressActionOpportunityCommon = {
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: "OPEN" | "CLOSED";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SEAMSTRESS_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number; // creation revision N
};
```

The exact union is:

```ts
type SeamstressActionOpportunityV1 = SeamstressActionOpportunityCommon & {
  readonly visibility: SeamstressActionOpportunityVisibilityV1;
};

type SeamstressAbilitySourceDescriptor =
  | {
      readonly kind: "ROLE_TENURE";
      readonly abilityRoleId: "seamstress";
      readonly roleTenureId: RoleTenureId;
      readonly acquiredCharacterStateRevision: number;
    }
  | {
      readonly kind: "PHILOSOPHER_GRANT";
      readonly abilityRoleId: "seamstress";
      readonly grantId: GrantedAbilityId;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly acquiredCharacterStateRevision: number;
    };

type SeamstressActionOpportunityV2 = SeamstressActionOpportunityCommon & {
  readonly sourceRoleTenureId: RoleTenureId;
  readonly abilitySource: SeamstressAbilitySourceDescriptor;
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly visibility: SeamstressActionOpportunityVisibilityV2;
};
```

Validation, cloning, equality, application, and replay rules:

1. First discriminate by `opportunityKind`.
2. For Seamstress, discriminate by the own-property presence of `visibility.visibilitySchemaVersion`.
3. Absence selects the exact V1 top-level and visibility key sets.
4. Presence requires the exact V2 literal and exact V2 top-level, nested-source, and visibility key sets.
5. Never infer Philosopher versus Seamstress from `supportedDecisionKinds.length`.
6. Clone each opportunity-kind/version branch explicitly. A two-decision V2 Seamstress visibility must remain Seamstress V2.
7. Equality requires the same opportunity kind and same visibility version before comparing version-specific fields. V1 and V2 are never equal.
8. Legacy replay validates a V1 Seamstress creation against the legacy V1 creator and preserves its exact payload.
9. New application creation always emits V2 and requires the prior public capability fact.
10. V1 accepts only `DEFER`; `CHOOSE_TWO_PLAYERS` against V1 remains the public-schema rejection `UnsupportedSeamstressActionDecision`.
11. V2 supports both decisions.
12. Add an exact Philosopher-gained Seamstress opportunity-ID parser/formatter branch. It must be deterministic and must not reuse the base task’s opportunity ID.

## 5. Command and target contract

```ts
type SeamstressActionDecision =
  | { readonly kind: "DEFER" }
  | {
      readonly kind: "CHOOSE_TWO_PLAYERS";
      readonly targetPlayerIds: readonly [PlayerId, PlayerId];
    };
```

The command payload remains exact: `commandType`, `taskId`, `opportunityId`, and `decision`, with no hidden answer, impairment, Vortox, registration, or Storyteller-choice fields.

For a V2 choice:

- The target array must be dense and have length two.
- Both IDs must exist exactly once in the roster and current character state at settlement `M`.
- Neither target may be the source player.
- Targets must be distinct player entities.
- Caller order is not canonical. Store paired player/seat references in ascending numeric seat order.
- Do not use role, alignment, impairment, or hidden assignment to determine target legality.

Rejection categories are limited to structural and public state failures such as:

```text
InvalidSeamstressActionDecision
InvalidSeamstressTarget
UnsupportedSeamstressActionDecision   // V1 schema only
ActionOpportunityNotFound
ActionOpportunityAlreadyClosed
ActionSourceNoLongerValid
AbilityUseEntitlementAlreadySpent
```

Invalid input writes no domain events, spends nothing, and leaves an open opportunity usable.

## 6. Stable ability tenure, instance, and use entitlement

A scheduled task is one wake-up and must never identify a once-per-game ability.

Maintain a rebuildable Seamstress ability-state projection derived from canonical assignment, Philosopher grant, spend, and character/ability lifecycle facts:

```ts
type SeamstressAbilityInstance = {
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityRoleId: "seamstress";
  readonly holderPlayerId: PlayerId;
  readonly holderSeatNumber: SeatNumber;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly source: SeamstressAbilitySourceDescriptor;
  readonly acquiredCharacterStateRevision: number;
  readonly endedCharacterStateRevision?: number; // first revision where inactive
};

type SeamstressAbilityUseEntitlement = {
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly abilityInstanceId: AbilityInstanceId;
  readonly entitlementKind: "BASE_ONCE_PER_GAME";
  readonly status: "UNSPENT" | "SPENT";
};
```

Role tenure is derived from the canonical fact that started it, not from the current snapshot alone:

- Initial role tenure starts from the `CharactersAssigned` event and character-state revision `1`.
- A future character transition that enters Seamstress starts a new tenure from that transition event and its next revision.
- Leaving Seamstress ends the old tenure at the first revision where it is absent.
- Alignment-only changes do not end role tenure.
- A Philosopher grant binds to the Philosopher’s current role tenure plus its stable `grantId`.
- Leaving and later returning to Philosopher cannot revive the old grant instance unless a future sourced lifecycle explicitly says so.

Deterministic identity:

```text
base role abilityInstanceId
  = seamstress-ability-instance-v1:<roleTenureId>

Philosopher-granted abilityInstanceId
  = seamstress-ability-instance-v1:<grantId>

base entitlement
  = seamstress-use-entitlement-v1:<abilityInstanceId>:BASE_ONCE_PER_GAME
```

Formatters/parsers must use canonical fact IDs and fixed ASCII segments, never arbitrary locale formatting, time, randomness, or scheduled-task IDs.

At opportunity creation revision `N`, the instance and entitlement must be active and unspent. At settlement revision `M`, validation requires the same `sourceRoleTenureId` and `abilityInstanceId` to have remained continuously active over `[N, M]`. Merely finding the same player, seat, and role again at `M` is insufficient. If the source left and reacquired the role or grant, the old opportunity is stale and the new tenure has a different instance ID.

Extension semantics, explicitly not implemented here:

- Other-night tasks reference the same active instance and remaining entitlement.
- Character reacquisition or revival creates a new instance and a new base entitlement.
- Barista `ACTS_TWICE` must add a separately identified extra entitlement to the same instance; it must not manufacture a new ability instance or unspend the base entitlement.
- A spent base entitlement prevents another ordinary opportunity for that instance. Because no other-night creator exists, R05 remains partial.

## 7. Exact canonical event flow

A V2 choice appends exactly:

```text
1. SeamstressTargetsChosen
2. SeamstressAbilitySpent
3. SeamstressInformationDelivered
4. ScheduledTaskSettled(SEAMSTRESS_INFORMATION_DELIVERED)
```

Core payloads are exact:

```ts
type SeamstressTargetsChosenPayload = {
  readonly rulesBaselineVersion: string;
  readonly actionSchemaVersion: "seamstress-action-v2";
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SEAMSTRESS_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly decisionKind: "CHOOSE_TWO_PLAYERS";
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly opportunityCharacterStateRevision: number; // N
  readonly settlementCharacterStateRevision: number; // M
  readonly targetPlayerIds: readonly [PlayerId, PlayerId];
  readonly targetSeatNumbers: readonly [SeatNumber, SeatNumber];
};

type SeamstressAbilitySpentPayload = {
  readonly rulesBaselineVersion: string;
  readonly spendModelVersion: "seamstress-ability-spend-v1";
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SEAMSTRESS_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly opportunityCharacterStateRevision: number; // N
  readonly settlementCharacterStateRevision: number; // M
  readonly spendReason: "LEGAL_TWO_PLAYER_SELECTION";
};
```

`SeamstressInformationDeliveredPayload` contains the same chain IDs and revisions plus the exact information structures in section 8.

Event application order:

- `SeamstressTargetsChosen` appends one choice and leaves the opportunity open inside the prospective batch.
- `SeamstressAbilitySpent` consumes exactly the referenced entitlement but does not expose or deliver information.
- `SeamstressInformationDelivered` requires the matching choice and spend, appends one historical delivery, and closes the opportunity.
- `ScheduledTaskSettled` requires the matching delivery and uses settlement revision `M`.

No prefix may survive a later failure.

Deferred compatibility:

- Legacy `SeamstressActionDeferredPayloadV1` remains its current exact field set and has no schema discriminator, ability ID, entitlement ID, or settlement-revision field. Legacy validation retains `M === N`.
- New V2 deferral uses an exact `deferSchemaVersion: "seamstress-action-deferred-v2"` payload containing the V2 instance, entitlement, tenure, `opportunityCharacterStateRevision: N`, and `settlementCharacterStateRevision: M`.
- V2 deferral validates tenure continuity but does not consume the entitlement.
- Both V1 and V2 deferral append exactly `SeamstressActionDeferred` then `ScheduledTaskSettled(SEAMSTRESS_DEFERRED)`.

## 8. Settlement revisions and information model

Revision meanings are mandatory:

- `N = opportunity.sourceCharacterStateRevision` when the V2 opportunity is created.
- `M = currentCharacterState.revision` when the command settles.
- `M >= N`.
- The opportunity and source-tenure reference bind `N`.
- Target existence, target current alignments, represented source impairment, Vortox constraint, comparison snapshot, delivered answer, and settlement all bind `M`.
- The same source role tenure and ability instance must be continuously active from `N` through `M`.

Target changes may therefore affect the answer at `M`, while source leave/reacquire invalidates the old opportunity.

Use these exact model constants:

```ts
const SEAMSTRESS_INFORMATION_MODEL_VERSION = "seamstress-information-model-v1";
const SEAMSTRESS_INFORMATION_STAGE = "SEAMSTRESS_INFORMATION";
const SEAMSTRESS_ANSWER_CANDIDATE_MODEL_VERSION = "seamstress-answer-candidates-v1";
const SEAMSTRESS_DELIVERY_POLICY_VERSION = "seamstress-truth-favoring-delivery-policy-v1";
```

Comparison snapshot:

```ts
type SeamstressAlignmentComparison = {
  readonly characterStateRevision: number; // M
  readonly alignmentModel: "NATIVE_CURRENT_ALIGNMENT_ONLY";
  readonly targets: readonly [
    { readonly playerId: PlayerId; readonly seatNumber: SeatNumber; readonly currentAlignment: "GOOD" | "EVIL" },
    { readonly playerId: PlayerId; readonly seatNumber: SeatNumber; readonly currentAlignment: "GOOD" | "EVIL" }
  ];
  readonly ruleCorrectAnswer: "YES" | "NO";
};
```

`ruleCorrectAnswer` is `YES` exactly when the two stored native current alignments are equal. No registration claim is made.

Represented effectiveness is exact and never claims more than the model knows:

```ts
type SeamstressRepresentedImpairmentEvidence = {
  readonly impairmentId: AbilityImpairmentId;
  readonly impairmentKind: "DRUNK" | "POISONED";
  readonly impairmentSourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" | "SNAKE_CHARMER_DEMON_HIT";
  readonly appliedCharacterStateRevision: number;
};

type SeamstressSourceEffectiveness =
  | {
      readonly kind: "KNOWN_INEFFECTIVE";
      readonly representedImpairments: readonly [
        SeamstressRepresentedImpairmentEvidence,
        ...SeamstressRepresentedImpairmentEvidence[]
      ];
      readonly unresolvedEffectKinds: readonly ["CONTINUOUS_POISON_NOT_MODELED"];
    }
  | {
      readonly kind: "NOT_PROVEN";
      readonly representedImpairments: readonly [];
      readonly unresolvedEffectKinds: readonly ["CONTINUOUS_POISON_NOT_MODELED"];
    };
```

Represented impairments must affect the same player/seat and current source tenure at `M`; stale impairment from an earlier tenure cannot affect a reacquired instance. Evidence is sorted by stable ASCII impairment ID. `NOT_PROVEN` is not synonymous with effective.

Vortox is a separate truth constraint:

```ts
type SeamstressDeliveryConstraint =
  | { readonly kind: "NONE" }
  | {
      readonly kind: "VORTOX_FALSE_REQUIRED";
      readonly evaluatedCharacterStateRevision: number; // M
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleTenureId: RoleTenureId;
    };
```

The Vortox branch is allowed only when the current represented state at `M` has an ability-active Vortox tenure under the currently modeled facts. A represented active impairment disables that constraint. Death and other unmodeled Vortox-disablement scenarios are not claimed.

Candidate truth and delivery remain distinct:

```ts
type SeamstressAnswerCandidate = {
  readonly candidateId: CandidateId;
  readonly answer: "YES" | "NO";
  readonly truthValue: "TRUE" | "FALSE";
};

type SeamstressAnswerCandidateSet = {
  readonly candidateModelVersion: "seamstress-answer-candidates-v1";
  readonly candidates: readonly [SeamstressAnswerCandidate, SeamstressAnswerCandidate];
  readonly legalCandidateIds: readonly CandidateId[];
  readonly selectedCandidateId: CandidateId;
};
```

Candidate order is fixed as `YES`, then `NO`. IDs derive from the opportunity ID and answer literal. Exactly one candidate is true relative to the comparison snapshot.

- With `VORTOX_FALSE_REQUIRED`, only the false candidate is legal and selected.
- Otherwise, both candidates are rule-permitted when `KNOWN_INEFFECTIVE`, but the truth-favoring policy selects the true candidate.
- With `NOT_PROVEN`, the true candidate is selected because it is legal whether the source is effective or impaired. The event must not assert that the false candidate was or was not also legal under an unmodeled effect.

Reliability and simulation reason are orthogonal:

```ts
type SeamstressInformationReliability =
  | "RULE_CORRECT_SELECTED_WITH_EFFECTIVENESS_NOT_PROVEN"
  | "RULE_CORRECT_SELECTED_WITH_KNOWN_IMPAIRMENT"
  | "VORTOX_CONSTRAINED_FALSE";

type SeamstressSimulationReason =
  | "TRUTH_FAVORING_DEFAULT"
  | "TRUTH_ALLOWED_WHILE_REPRESENTED_IMPAIRED"
  | "FALSE_REQUIRED_BY_VORTOX";
```

The exact delivered payload includes:

- rules baseline, night, task, opportunity, source, tenure, instance, and entitlement IDs;
- `opportunityCharacterStateRevision: N`;
- `settlementCharacterStateRevision: M`;
- model version and exact `SEAMSTRESS_INFORMATION` stage;
- canonical target IDs and seats;
- comparison snapshot and `ruleCorrectAnswer`;
- represented effectiveness;
- Vortox constraint;
- candidate set;
- information reliability and simulation reason;
- separately stored `deliveredAnswer`, which must equal the selected candidate.

## 9. Runtime, prospective, batch, and replay validation

Runtime validation must enforce exact enumerable keys, dense arrays, exact literals, exact tuples, branded-ID parsers, numeric seats, positive revisions, and version-specific discriminated unions. No excess hidden fields are accepted.

Prospective validation of the four-event batch requires:

- the task exists, is next, and is unsettled;
- the V2 opportunity exists and is open;
- the public capability and visibility versions match;
- the task source is either the matching base role tenure or matching Philosopher grant;
- the same source tenure and ability instance are continuously active across `[N, M]`;
- the referenced entitlement is unspent;
- both targets are legal and stored in canonical seat order;
- choice, spend, delivery, and settlement share all chain IDs and revisions;
- the comparison snapshot is derived from current state at `M`;
- represented impairments match stored active facts for that tenure;
- effectiveness is never serialized as `EFFECTIVE` in this model;
- Vortox constraint matches represented canonical facts at `M`;
- candidate truth, legal set, selected candidate, reliability, simulation reason, and delivered answer agree;
- settlement outcome is `SEAMSTRESS_INFORMATION_DELIVERED` at `M`.

Replay must reject:

- malformed or hybrid V1/V2 opportunities;
- V2 visibility cloned or interpreted as Philosopher visibility;
- V1 choice events;
- choice without a matching V2 opportunity;
- spend without choice or with a different instance/entitlement;
- duplicate spend of one entitlement;
- delivery without exactly one matching choice and spend;
- reordered, incomplete, overlong, mixed-batch, or cross-opportunity chains;
- target tuple/order changes across events;
- mismatched `N`, `M`, source tenure, task, source, candidate, or answer;
- settlement without delivery or delivery without settlement;
- an old opportunity settling after its source tenure ended, even if the same player later reacquired Seamstress;
- later replay-time state being used to recompute a stored delivery.

All four events must share one batch ID and consecutive sequences. Prospective application must succeed in full before append.

## 10. Actors, receipts, retries, and determinism

Preserve the existing actor policy:

- matching Human or AI source;
- Storyteller;
- System.

Human/AI actor identity must match the opportunity source. No actor supplies the answer or hidden modifier state.

Hidden-state non-oracle requirements apply to receipts as well as validation:

- The same legal command under represented drunk, represented poison, unresolved continuous effects, no modifier, or Vortox returns the same accepted receipt shape.
- Each accepted choice reports the same four event types/count; receipts expose no canonical evaluation payload.
- Modifier-specific errors and messages are forbidden.
- The delivered answer may differ under Vortox because that is the sourced private ability result, not a command-success oracle.

Idempotency:

- Same command ID and byte-equivalent body returns the original receipt and appends nothing.
- Same command ID with a different body is an idempotency conflict.
- A new command against a closed opportunity rejects with no events.
- Concurrent commands serialize; only the first valid spend of an entitlement succeeds.
- Deterministic IDs and ordering use existing canonical factories and ASCII/numeric comparisons, never `Date.now`, `Math.random`, random UUIDs, `localeCompare`, `Intl.Collator`, or environment locale.

## 11. Exact private historical projection

Add exact constants and view fields:

```ts
const SEAMSTRESS_INFORMATION_STAGE = "SEAMSTRESS_INFORMATION";
const PRIVATE_VIEW_SEAMSTRESS_MODEL_VERSION = "seamstress-private-knowledge-v1";

type PlayerSeamstressInformationView = {
  readonly targets: readonly [KnownPlayerReference, KnownPlayerReference];
  readonly deliveredAnswer: "YES" | "NO";
};

type PlayerPrivateKnowledgeView = {
  // existing fields unchanged
  readonly seamstressInformation?: readonly PlayerSeamstressInformationView[];
  readonly seamstressKnowledgeModelVersion?: "seamstress-private-knowledge-v1";
};
```

Presence linkage is exact:

- Zero validated deliveries for the viewer: both optional fields absent and `SEAMSTRESS_INFORMATION` absent from `deliveredKnowledgeStages`.
- One or more validated deliveries: both fields present, `seamstressInformation` is a dense non-empty array, the model version is exact, and the stage occurs exactly once in canonical stage order.
- Every history entry has exactly `targets` and `deliveredAnswer`.
- Targets are exact known-player references, distinct, non-self, and numeric-seat ordered.
- Use `filter(...).map(...)`, not `find(...)`; multiple historical deliveries must be preserved in canonical delivery order.

Before exposing any entry, projection validation requires exactly one matching:

1. V2 Seamstress opportunity;
2. `SeamstressTargetsChosen` fact;
3. `SeamstressAbilitySpent` fact for the same entitlement;
4. `SeamstressInformationDelivered` fact with exact model/stage;
5. `ScheduledTaskSettled(SEAMSTRESS_INFORMATION_DELIVERED)` fact at `M`.

All task, opportunity, source, tenure, instance, entitlement, target, `N`, and `M` fields must correlate. Stored comparison/candidate/delivery consistency is validated from the stored historical facts, never from latest character state.

Only the source receives targets and `deliveredAnswer`. Public state and all other player views receive neither. Player and AI private views must hide:

- target alignments;
- `ruleCorrectAnswer` and candidate truth values;
- represented impairment IDs/kinds;
- `KNOWN_INEFFECTIVE` versus `NOT_PROVEN`;
- Vortox identity or constraint metadata;
- reliability and simulation reason;
- ability-instance, entitlement, tenure, task, opportunity, and internal candidate IDs.

## 12. Acceptance tests

Compatibility and exactness:

1. Exact current V1 fields replay; `supported`/`futureUnsupported` and any V1 schema version are rejected.
2. Exact V2 fields validate; missing, excess, hybrid, or wrong-version fields reject.
3. V1 and V2 clone/equality preserve their branch; V2 Seamstress is never cloned as Philosopher.
4. New creation emits V2; legacy V1 replay remains defer-only.
5. Base and Philosopher-granted V2 opportunity IDs and sources are deterministic and distinct.

Public capability and non-oracle:

6. The capability fact is declared before `CharactersAssigned` and is identical across hidden assignments.
7. Unsupported public script/catalog configurations cannot enter V2 before assignment; no player command performs that gate.
8. The same legal choice in unmodified, represented-drunk, represented-poison fixture, No-Dashii-containing assignment, Vortox, and represented-impairment-plus-Vortox cases is accepted with the same four event types/count and receipt shape.
9. No modifier-specific rejection code or hidden metadata appears in receipts.
10. A No-Dashii-containing assignment does not trigger adjacency logic; absent represented impairment serializes `NOT_PROVEN`, never `EFFECTIVE`.

Targets and atomicity:

11. Exactly two distinct non-self modeled players succeed and are seat-canonicalized.
12. Missing, malformed, wrong-count, duplicate, self, unknown, sparse, and excess-field targets reject with zero events and no spend.
13. A valid choice emits exactly choice, spend, delivery, settlement in order.
14. Failure of any proposed event rolls back the entire batch.

Ability identity and revisions:

15. `AbilityInstanceId` is stable across scheduled tasks and contains no scheduled-task identity.
16. Base and Philosopher-granted Seamstress instances and spends are independent.
17. A valid represented-impaired use spends the base entitlement exactly once.
18. Duplicate spend or a second ordinary opportunity for the spent entitlement rejects.
19. V1 and V2 `DEFER` emit their exact two-event batches and leave the entitlement unspent.
20. Target alignment facts at `M` drive comparison while opportunity facts remain bound to `N`.
21. A pure tenure/revision test permits `M > N` when target state changed and the source instance remained continuous.
22. A source leaving and reacquiring Seamstress receives a new instance; the old opportunity rejects even if player/seat/role snapshots again look equal.

Information behavior:

23. Equal native current alignments store rule-correct `YES`; mixed stores `NO`.
24. Represented Philosopher-duplicate impairment records `KNOWN_INEFFECTIVE`, still spends, and truth-favoring delivery selects the correct candidate.
25. Without represented impairment, effectiveness is `NOT_PROVEN`; truth-favoring delivery selects the correct candidate.
26. Effective represented Vortox selects and delivers the false candidate for both correct `YES` and correct `NO`.
27. Vortox still selects false when the source has a represented impairment.
28. Comparison, effectiveness, constraint, candidate truth, reliability, simulation reason, and delivered answer remain separately validated.

Projection and replay:

29. Only the source sees the exact target tuple and delivered answer.
30. Other players, public views, serialized player views, and receipts contain none of the hidden canonical metadata.
31. Projection refuses missing, duplicate, malformed, unsettled, or cross-linked choice/spend/delivery chains.
32. Multiple valid deliveries for one viewer project as an ordered history array rather than replacing the first result.
33. Later current-character or alignment state changes do not alter a stored delivery.
34. Replay rejects all incomplete, reordered, overlong, duplicate-spend, V1/V2-hybrid, revision-mismatched, and tenure-mismatched streams.

No acceptance test may assert No Dashii adjacency, registration, death/revival, Traveller targeting, Barista behavior, or other-night recurrence in this slice.

## 13. Conservative evidence-scenario coverage

Expected mapping of the 39 evidence scenarios:

- Fully covered in the current modeled subset: 1–7, 11–14, 19, 21–22, 27, 29–30, 35, 38.
- Partially covered: 8 (fixed roster has no life state), 15 (N/M resolver contract without a general alignment-change command), 20 (spend state without other-night scheduling), 23 (stored character/alignment history only), 28 (truth-favoring poison-safe behavior without continuous-poison derivation), 34 (first-night Philosopher-granted use only), 36 (identity is alignment-independent but no general alignment-change flow).
- Unsupported: 9–10, 16–18, 24–26, 31–33, 37.
- Scenario 39 is a rule-review prohibition, not implementation coverage. The executable positive assertion is scenario 27: a represented drunk legal use is spent.

The PR must not describe scenarios 15, 23, 28, 34, 36, or 39 as fully implemented.

## 14. Implementation surface, coverage matrix, and slice limit

Expected implementation surface:

- `packages/domain-core/src/seamstress.ts` and focused tests.
- Branded role-tenure, ability-instance, entitlement, and candidate IDs in the existing ID module.
- Public capability event/state and exact event unions.
- V1/V2 first-night opportunity types, parsers, validators, clone, equality, creation, close, and replay.
- Philosopher-granted Seamstress opportunity/source support.
- Game state, event applier, prospective validator, event-stream validator, and batch semantics.
- Application command validation, event construction, receipt/idempotency tests.
- Private knowledge types, exact shape validator, projection chain validation, and privacy/history tests.
- Test-harness builders.
- `docs/rules/ROLE_COVERAGE_MATRIX.md`, implementation status, and `docs/agent-loop/AUTOPILOT_LOG.md`.

Do not add a No Dashii continuous-rule implementation in these files.

Coverage-matrix delta after passing all gates:

- Base Seamstress first-night choice/spend/information: `PARTIAL`.
- Philosopher-granted Seamstress first-night execution: `PARTIAL`.
- Represented impairment and Vortox delivery behavior: `PARTIAL`.
- Private historical projection: `PARTIAL`.
- Other-night recurrence, life/revival, Travellers, registration, Barista, and No Dashii derived poison: unsupported.
- Overall Seamstress role: at most `PARTIAL`, never `COMPLETE`.

If implementation cannot keep this as one shared pipeline with one stable instance/entitlement model, stop and split before coding rather than omitting a mandatory invariant.

## 15. Independent review and PR traceability

Before implementation, the independent reviewer must inspect:

- user overrides;
- the sourced Chinese and official Seamstress material;
- official States, Glossary, Abilities, Vortox, Philosopher, and nightsheet evidence;
- `docs/rules/evidence/2B15.md`;
- the role coverage matrix;
- this complete v2 design;
- current V1 opportunity/defer code and the Philosopher grant/impairment/task insertion code.

This v2 deliberately makes no No Dashii rule claim, so the current slice does not require new No Dashii research. Any attempt to implement adjacency or continuous poison changes that fact and must return to rule research before review can pass.

Only `RULE_DESIGN_PASS` authorizes implementation. `RULE_DESIGN_FIX_REQUIRED` requires another design revision; a new rule conflict or unavailable mandatory source maps to `HUMAN_BLOCKED`.

The PR must include:

- exact evidence revisions/hashes and R01–R13 mapping;
- the public pre-assignment capability fact;
- exact V1/V2 compatibility table;
- hidden-state non-oracle proof for validation, receipts, and projection;
- ability-tenure/instance/entitlement identity and N/M invariants;
- exact four-event and two-event batches;
- stored-fact private projection proof;
- conservative scenario 1–39 mapping;
- coverage-matrix delta;
- focused and full gate results;
- reviewed HEAD equals PR HEAD;
- final independent `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS`.

## 16. Risks, rollback, and stop conditions

Primary risks:

- accidentally retaining the wrong V1 field names;
- cloning V2 Seamstress visibility as Philosopher visibility;
- making command success reveal drunk, poison, No Dashii, or Vortox state;
- calling absence of stored impairment `EFFECTIVE`;
- deriving ability identity from a scheduled task;
- accepting an old opportunity after source leave/reacquire;
- binding target comparison to `N` or settlement to a different revision than `M`;
- spending before target validation or partially appending the batch;
- exposing Vortox, impairment, alignments, correct answer, or internal IDs in private/player/AI views;
- replacing one historical delivery instead of preserving an array;
- overstating R02, R05, scenario 15, scenario 23, or scenario 39.

Stop immediately if:

- implementation needs a No Dashii adjacency or poison-lifecycle assertion without fresh rule evidence;
- registration, life, Traveller, Barista, or other-night behavior becomes necessary to make a test pass;
- V1 replay cannot remain byte-for-shape exact;
- source-tenure continuity cannot distinguish leave/reacquire;
- any legal command’s success, error, receipt shape, or event count depends on hidden modifier state;
- canonical facts would need to claim `EFFECTIVE` without proof;
- an unsafe event-history rewrite is proposed;
- permissions fail or the same gate failure repeats without a materially different correction.

Rollback is a normal clean reversal of this slice’s new capability, V2 opportunity, ability-state, events, command path, projection, tests, and documentation. Existing V1 event history must never be rewritten.

`READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`
