# Phase 3 Slice 2B19A2 — Effective Base Dreamer V2 Normal Target and Information Delivery Frozen Design

## Metadata

- authorization: `USER_AUTHORIZED_2B19A2_EFFECTIVE_BASE_DREAMER_V2_NORMAL_INFORMATION`
- designRound: `1 / 2`
- acceptedMain: `8b390b50f5d314b34535bc7cf9fad36ece76f85e`
- governance: `docs/architecture/2B19A2-go-no-go-under-governance-v1.md`
- governanceSha256: `abc0a75b0b8267542d2e1a3bd0bbaeaad8ee9b11052c442ec38aee9558df4b1f`
- governanceVerdict: `GO`
- ruleEvidence: `docs/rules/evidence/2B19A2.md`
- ruleEvidenceSha256: `e24038e7399cb7311204b6b3f001623b7ab0323034af61ee3bb64aa8e9a3c829`
- ruleVerdict: `RULE_READY`
- userOverridesSha256: `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`
- roleCoverageMatrixSha256: `e6a590e3c357958ef1ef80e2d552560b1427761b0b9755773add1db5040f989a`
- accepted2B19A1DesignWorkingSha256: `bc239fc028b38a64420103a04e2a6708a9f01459543c46f95e2246bbbe23194c`
- sliceCoverage: `PARTIAL / NORMAL_INFORMATION_ONLY`
- dreamerRoleCoverage: `PARTIAL`
- ruleSemanticsChanged: `false`
- implementationAuthorized: `false` until independent `RULE_DESIGN_PASS`

This file is the complete Round 1 implementation authority. It freezes every production behavior, exact runtime shape, validation order, replay rule, failure boundary, and acceptance obligation for Slice 2B19A2.

## Governance Classification

### R1 — New reachable behavior

Only these behaviors become reachable:

1. New V2-plan base Dreamer open commands produce a new independently versioned actionable opportunity.
2. The source selects one other modeled non-Traveller player.
3. A canonical effectiveness resolver proves the base source is eligible for normal information.
4. A pure normal-information resolver produces one GOOD role and one EVIL role, exactly one being the target's settlement-time current true character.
5. Target, delivery, and task settlement are persisted atomically.
6. Delivery creates exactly one normal first-night ability outcome fact.
7. Only the source player's player and AI projections receive the historical delivery.

### R2 — Replay-only accepted history

- V1 opportunity, target, delivery, settlement, ledger, and projection history.
- V2-plan plus legacy V1 opportunity history.
- Slice 2B19A1 `dreamer-first-night-action-opportunity-v2` non-actionable history.

R2 histories retain exact shapes and meanings. They receive no new producer, optional field, migration, or automatic conversion.

### R3 — Rejected hostile history

Exact validators and replay reject malformed or mixed opportunity generations, wrong discriminators, noncanonical identity, source/task/tenure/ability/revision cross-link mismatch, malformed target/delivery, duplicate or naked events, reversed or partial batches, damaged receipts, and hostile persisted state.

### R4 — Explicitly unreachable behavior

Vortox forced-false delivery, DRUNK or POISONED information, No Dashii adjacency inference, gained Dreamer, Storyteller free false-role choice, Traveller, other-night Dreamer, life/death, FIRST_NIGHT completion, DAY, and Phase 2C remain unreachable.

### T1 — Untrusted boundary values

Commands, persisted opportunity/target/delivery payloads, event envelopes, batch metadata, replay input, and projection viewer identity require exact runtime and provenance validation.

### T2 — Canonical rebuilt authority

Only validated rebuilt `GameState`, setup catalog snapshot, roster, current-character state, active role tenure, task plan/progress, pre-event opportunity state, represented impairments, current Demon identity, and ledger are canonical authorities.

### T3 — Pure deterministic seams

ID formatters/parsers, stable code-unit comparison, normal-information resolution, false-role selection, and source-effectiveness classification are pure functions. No T3 seam may become a caller-supplied context authority or shared unknown boundary.

## Versioned Producer Transition

### New constants and kind

```ts
export const DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION =
  "dreamer-first-night-action-opportunity-v3" as const;
export const DREAMER_V3_VISIBILITY_SCHEMA_VERSION =
  "dreamer-first-night-action-visibility-v3" as const;
```

Add `"DREAMER_FIRST_NIGHT_ACTION_V3"` to `ActionOpportunityKind`.

### Immutable legacy boundaries

`DreamerActionOpportunityV1`, `DreamerActionOpportunityVisibilityV1`, `DreamerActionOpportunityV2`, and `DreamerActionOpportunityVisibilityV2` remain exact. In particular, accepted V2 remains:

- `opportunitySchemaVersion = "dreamer-first-night-action-opportunity-v2"`;
- `opportunityKind = "DREAMER_FIRST_NIGHT_ACTION_V2"`;
- `canChooseTarget = false`;
- `supportedDecisionKinds = []`.

No V1 or V2 stored event is rewritten. V1 and V2 remain members of runtime unions for replay.

### V3 exact visibility

```ts
export type DreamerActionOpportunityVisibilityV3 = {
  readonly visibilitySchemaVersion:
    typeof DREAMER_V3_VISIBILITY_SCHEMA_VERSION;
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly futureUnsupportedDecisionKinds: readonly [];
  readonly targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER";
};
```

The exact enumerable key set is, in canonical field order:

1. `visibilitySchemaVersion`
2. `canChooseTarget`
3. `supportedDecisionKinds`
4. `futureUnsupportedDecisionKinds`
5. `targetSchema`

### V3 exact opportunity

```ts
export type DreamerActionOpportunityV3 = DreamerActionOpportunitySource & {
  readonly opportunitySchemaVersion:
    typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V3";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly visibility: DreamerActionOpportunityVisibilityV3;
};
```

Its exact 13-key top-level enumerable set is:

1. `taskId`
2. `taskType`
3. `sourcePlayerId`
4. `sourceSeatNumber`
5. `sourceRole`
6. `sourceCharacterStateRevision`
7. `opportunitySchemaVersion`
8. `nightNumber`
9. `opportunityId`
10. `opportunityKind`
11. `opportunityStatus`
12. `sourceContract`
13. `visibility`

The nested `BaseDreamerV2SourceContract` is reused unchanged and remains exact. V3 is added to `DreamerActionOpportunity` and `ActionOpportunityVisibility` unions. Export `isDreamerActionOpportunityV3`, requiring both V3 discriminators and both exact shapes.

### Identity

- Task identity retains the accepted `first-night-v1:DREAMER_ACTION:seat-XX` grammar.
- Opportunity identity reuses the existing accepted formatter/parser and exact grammar `first-night-v2:DREAMER_ACTION:seat-XX:opportunity-01`.
- Reuse is safe because one task may have exactly one opportunity generation in one accepted history.
- IDs never use time, random numbers, UUIDs, locale comparison, or caller-supplied fragments.

### New producer

For new `first-night-task-plan-v2` base Dreamer openings, the builder produces only V3. Before constructing the value it proves from T2 state:

1. the plan is exactly V2;
2. the task is the next unique unsettled base `ROLE` Dreamer task;
3. task, source player, source seat, and current role agree;
4. current source role is exact catalog Dreamer;
5. exactly one active Dreamer tenure exists and is continuous at the opening revision;
6. the ability ID equals the canonical base first-night ability-instance ID for the task;
7. `BaseDreamerV2SourceContract` is exact and cross-bound to the opportunity;
8. no V1, V2, or V3 opportunity already exists for the same task.

V1 producer and accepted V1/V2 replay remain available only under their frozen historical boundaries. Same-task cross-generation opening fails deterministically.

## Source Effectiveness

### Constant and result contract

```ts
export const DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION =
  "dreamer-base-source-effectiveness-v1" as const;

export type DreamerBaseSourceEffectivenessResult =
  | {
      readonly kind: "NORMAL_INFORMATION_SUPPORTED";
      readonly evaluationModelVersion:
        typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
      readonly evaluatedRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
    }
  | {
      readonly kind: "SOURCE_REPRESENTED_IMPAIRED";
      readonly sourceImpairmentId: AbilityImpairmentId;
      readonly sourceImpairmentKind: "DRUNK" | "POISONED";
    }
  | {
      readonly kind: "VORTOX_FORCED_FALSE_UNSUPPORTED";
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleTenureId: RoleTenureId;
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

The resolver input is exactly the validated V3 opportunity, current-character state, setup role-catalog snapshot, role-tenure state, and ability-impairment state. `abilityImpairments === undefined` is accepted as the historical empty set.

### Deterministic evaluation order

1. Re-prove the opportunity's source, current Dreamer role, continuous active tenure, canonical base ability instance, task, seat, opening revision, and exact catalog role. Failure yields `EFFECTIVENESS_UNRESOLVED / SOURCE_PROVENANCE_INVALID`.
2. Select represented source impairments that apply to the exact ability/source contract at the settlement revision.
3. Zero matching source impairments continues. Exactly one matching `DRUNK` or `POISONED` marker returns `SOURCE_REPRESENTED_IMPAIRED`. Multiple, contradictory, or malformed applicable markers return `EFFECTIVENESS_UNRESOLVED / SOURCE_IMPAIRMENT_CONFLICT`.
4. Resolve the unique current player whose exact catalog role type is `DEMON`. Zero or multiple current Demons returns `CURRENT_DEMON_IDENTITY_NOT_UNIQUE`; catalog mismatch returns `CURRENT_DEMON_CATALOG_MISMATCH`.
5. If the current Demon is Vortox, require one consistent active Vortox tenure. Missing or inconsistent tenure returns `VORTOX_TENURE_MISSING_OR_INCONSISTENT`.
6. For Vortox, zero applicable Vortox impairment markers returns `VORTOX_FORCED_FALSE_UNSUPPORTED`; exactly one applicable marker means Vortox is ineffective and evaluation continues; multiple or conflicting applicable markers returns `VORTOX_EFFECTIVENESS_CONFLICT`.
7. If the effective current Demon is No Dashii, return `NO_DASHII_EFFECT_UNRESOLVED`; this Slice does not derive adjacency poisoning.
8. Any other current Demon returns `NORMAL_INFORMATION_SUPPORTED` with the settlement revision and the exact source tenure/ability IDs.

The result is used internally for control flow. It is not persisted in delivery, ledger, or projection.

## Target Rule

The existing `DreamerActionDecision` exact shape remains:

```ts
{
  readonly kind: "CHOOSE_PLAYER";
  readonly targetPlayerId: PlayerId;
}
```

The actor must be the source Human or source AI. Storyteller and System remain allowed by the application command authority. A non-source Human or non-source AI is deterministically rejected.

The target must:

- exist exactly once in the modeled roster;
- have exactly one current-character state entry;
- not be the source player;
- not be modeled as a Traveller;
- match its canonical seat.

Target truth is the target's settlement-time current role. A target role change before settlement changes the answer. An alignment-only change does not change the true role or its native GOOD/EVIL side. Later character changes never rewrite delivery history.

## Normal Information Rule

The normal resolver runs only after `NORMAL_INFORMATION_SUPPORTED`.

1. Validate the exact setup role-catalog snapshot.
2. Validate that the settlement-time target role exactly equals the corresponding catalog snapshot.
3. Map Townsfolk and Outsider to GOOD; map Minion and Demon to EVIL. Use character type/default alignment, not player alignment.
4. Place the target's true role on its native side.
5. Select the opposite-side false role from exact catalog entries, excluding the target true role.
6. Reuse `DREAMER_FALSE_ROLE_POLICY_VERSION = "dreamer-false-role-policy-v1"` and `SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION = "dreamer-information-model-v1"` only for this normal/effective path.
7. Sort legal opposite-side candidates with `compareStableId` code-unit order and choose the first.
8. Catalog input order, platform locale, random state, and object serialization do not affect the result.
9. `goodRole.roleId !== evilRole.roleId` and exactly one equals the target true role.
10. No output contains a truth marker or identifies which role is true.

Candidate shortage or catalog inconsistency returns a retryable receipt-free `DependencyExecutionFailed` at `first-night-role-action`.

## Commands and Application Order

Use the existing `SubmitDreamerAction` command and existing actor/decision shape. No caller supplies source contract, tenure, ability instance, effectiveness, role answer, event ID, batch ID, game version, or event sequence.

The application service executes in this fixed order:

1. validate command envelope and actor shape;
2. perform command-receipt/idempotency lookup;
3. load the accepted event stream and rebuild canonical state;
4. validate `expectedGameVersion`;
5. locate the task and unique opportunity;
6. retain the accepted V2 non-actionable guard for V2 history;
7. perform deterministic actor, task, opportunity, phase, progress, and target validation;
8. require exact V3 actionable capability and normal `CHOOSE_PLAYER` decision;
9. evaluate source effectiveness;
10. resolve normal information;
11. derive deterministic batch/event metadata;
12. construct target V2, delivery V2, and existing scheduled settlement envelopes;
13. prospectively apply the entire batch to cloned state;
14. append the batch atomically;
15. record the accepted command receipt only after append succeeds.

Deterministic invalid input may record a rejected receipt under existing application policy. Dependency or effectiveness failures below do not record a receipt.

## Events and Exact Payloads

Retain event types `DreamerTargetChosen` and `DreamerInformationDelivered`. Add version constants:

```ts
export const DREAMER_TARGET_CHOSEN_SCHEMA_VERSION =
  "dreamer-target-chosen-v2" as const;
export const DREAMER_INFORMATION_DELIVERED_SCHEMA_VERSION =
  "dreamer-information-delivered-v2" as const;
```

### Target V2

```ts
export type DreamerTargetChosenPayloadV2 = {
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly rulesBaselineVersion: string;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly sourcePlayerId: PlayerId;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceSeatNumber: SeatNumber;
  readonly targetPlayerId: PlayerId;
  readonly targetSchemaVersion:
    typeof DREAMER_TARGET_CHOSEN_SCHEMA_VERSION;
  readonly targetSeatNumber: SeatNumber;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
};
```

The exact key set is the 15 fields shown above. `sourceCharacterStateRevision` is the settlement revision. `sourceContract.sourceCharacterStateRevision` remains the opening revision. Settlement revision must be greater than or equal to opening revision.

### Delivery V2

```ts
export type DreamerInformationDeliveredPayloadV2 = {
  readonly deliverySchemaVersion:
    typeof DREAMER_INFORMATION_DELIVERED_SCHEMA_VERSION;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: typeof DREAMER_FALSE_ROLE_POLICY_VERSION;
  readonly goodRole: RoleSetupSnapshot;
  readonly informationReliability: { readonly kind: "EFFECTIVE" };
  readonly knowledgeModelVersion:
    typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly rulesBaselineVersion: string;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
};
```

The exact key set is the 19 fields shown above. Reliability is exactly `{ kind: "EFFECTIVE" }`; the V2 delivery cannot encode impaired or Vortox information.

### Unions and validators

- Existing payload types become V1 types without changing their runtime shape.
- `DreamerTargetChosenPayload` is the exhaustive V1/V2 union.
- `DreamerInformationDeliveredPayload` is the exhaustive V1/V2 union.
- Validators branch on version discriminator first and then enforce exact enumerable keys, literal values, canonical nested shapes, source/task/opportunity/target cross-links, revision rules, and state-before provenance.
- Missing, extra, wrong-type, unknown-version, forged, or mixed-version fields fail closed.
- Builders never accept caller-supplied source contract or resolved roles.

## Atomic Batch

The only valid 2B19A2 success batch is:

1. `DreamerTargetChosen` with `DreamerTargetChosenPayloadV2`;
2. `DreamerInformationDelivered` with `DreamerInformationDeliveredPayloadV2`;
3. existing `ScheduledTaskSettled` with outcome `DREAMER_INFORMATION_DELIVERED`.

All three envelopes have the same command ID, batch ID, rules baseline, and resulting game version. Event sequence is contiguous and ordered. Game version increases exactly once for the batch.

Prospective validation proves:

- state before target contains one OPEN V3 opportunity and no target/delivery/settlement for the task;
- target application records the target without closing the opportunity;
- delivery application matches the unique target and closes the V3 opportunity;
- settlement follows delivery and settles the next task once;
- phase remains `FIRST_NIGHT`;
- no `PhaseTransitioned` event is produced.

Naked delivery, naked settlement, partial batch, duplicate event, reversed order, mixed V1/V2 target-delivery versions, mixed opportunity generation, cross-batch metadata, noncontiguous sequence, or second settlement is invalid.

## Replay

`event-applier.ts` dispatches each union member to its canonical validator using exact state-before. Target is applied before delivery, delivery closes V3, then settlement updates task progress. Full rebuild must equal prospective state.

Accepted V1 and non-actionable V2 histories remain exact. V3 events do not cause migration. Every switch over opportunity, target, delivery, and associated batch payloads is exhaustive.

## Ledger

Reuse only closed evidence variants already accepted:

- `DREAMER_DELIVERY`;
- `ACTION_OPPORTUNITY`;
- `ROLE_TENURE`;
- `PLAYER_ROLE_AT_REVISION`.

Do not add a generic open evidence variant.

`DreamerInformationDeliveredPayloadV2` is the sole terminal ledger source for this success path. Its derived fact is exactly:

- `outcomeStatus = "NORMAL"`;
- `causeKind = "NO_OTHER_CHARACTER_ABILITY"`;
- `causedByAnotherCharacterAbility = false`.

Evidence cross-binds the exact source player/seat, task, V3 opportunity, opening source contract, active tenure, base ability instance, target, delivered role IDs, settlement revision, terminal event ID, event sequence, and batch ID. Settlement never creates another fact. Later Mathematician reads the NORMAL fact but does not count it.

If the closed evidence variants cannot express all required canonical bindings, implementation stops with `RESLICE_REQUIRED`; it does not add generic evidence.

## Projection

No production projection file changes.

After accepted delivery, source player and corresponding source AI private views expose only:

- target player reference;
- `goodRole`;
- `evilRole`;
- `knowledgeStage`;
- `knowledgeModelVersion`.

All other players and AIs receive no Dreamer delivery. Projection never exposes target true-role fields, target true alignment, which answer is true, candidate sets, source effectiveness, impairment or Vortox checks, false-role ordering internals, ledger, tenure, ability instance, assignment, or current-character state.

An OPEN opportunity produces no Dreamer knowledge. Later character changes do not recompute historical delivery.

## Receipts and Failures

### Deterministic rejected commands

Wrong actor, wrong task, wrong opportunity, self target, out-of-roster target, non-modeled Traveller target, task not next, settled task, closed opportunity, malformed decision, and stale expected version use existing deterministic rejection semantics and may record a rejected receipt.

### Retryable receipt-free failures

| Condition | Result | Stage |
|---|---|---|
| `SOURCE_REPRESENTED_IMPAIRED` | `ApplicationNotConfigured` | `first-night-role-action` |
| `VORTOX_FORCED_FALSE_UNSUPPORTED` | `ApplicationNotConfigured` | `first-night-role-action` |
| `NO_DASHII_EFFECT_UNRESOLVED` | `ApplicationNotConfigured` | `first-night-role-action` |
| `EFFECTIVENESS_UNRESOLVED` | `DependencyExecutionFailed` | `first-night-role-action` |
| false-role candidate shortage or catalog dependency failure | `DependencyExecutionFailed` | `first-night-role-action` |
| metadata derivation failure | existing retryable failure | existing metadata stage |
| prospective validation failure | existing retryable failure | existing validation stage |
| append failure | existing retryable failure | existing append stage |

Every row is `retryable=true`, uses a generic non-secret message, records no receipt, appends zero events and facts, leaves game version unchanged, leaves task unsettled and V3 OPEN, and permits the same command ID after dependency recovery.

## Production Allowlist and Stop-Loss

The exact production allowlist is:

1. `packages/domain-core/src/first-night-action-opportunity.ts`
2. `packages/domain-core/src/dreamer.ts`
3. `packages/domain-core/src/domain-batch-semantics.ts`
4. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
5. `packages/domain-core/src/event-applier.ts`
6. `packages/application/src/game-application-service.ts`

Forbidden production changes include projection files, event-type registries, `game-state.ts`, setup generation, generic command infrastructure, and shared effect/context platforms.

Estimated added production LOC: `1100-1450`.

Pause for controller review before implementation continues if more than 8 production files or more than 1,500 added production lines are required. Return `RESLICE_REQUIRED` if more than 10 production files, more than 2,000 added production lines, a new top-level GameState field, generic evidence, a canonical-context platform, an effect engine, a projection system, a second infrastructure risk, or an R4 behavior is required.

## Primary Authority Test Matrix

Each numbered completion criterion has at least one primary authority test. Supporting assertions may not substitute a lower-trust fixture for the assigned layer.

| # | Requirement | Primary layer |
|---|---|---|
| 1 | V1 history exact replay | `LEGACY_REPLAY_COMPATIBILITY` |
| 2 | 2B19A1 non-actionable V2 history exact replay | `LEGACY_REPLAY_COMPATIBILITY` |
| 3 | New producer creates actionable V3 | `ACCEPTED_STREAM_INTEGRATION` |
| 4 | V3 exact shape | `STRUCTURAL_VALIDATION` |
| 5 | Canonical ID round-trip | `PURE_POLICY_SEAM` |
| 6 | Self target rejected | `ACCEPTED_STREAM_INTEGRATION` |
| 7 | Other legal modeled player accepted | `ACCEPTED_STREAM_INTEGRATION` |
| 8 | GOOD target normal information | `PURE_POLICY_SEAM` |
| 9 | EVIL target normal information | `PURE_POLICY_SEAM` |
| 10 | False role is stable and deterministic | `PURE_POLICY_SEAM` |
| 11 | Catalog order does not affect result | `PURE_POLICY_SEAM` |
| 12 | Target/delivery/settlement atomic batch | `ACCEPTED_STREAM_INTEGRATION` |
| 13 | Accepted success replay | `ACCEPTED_STREAM_INTEGRATION` |
| 14 | Duplicate, reversed, naked, partial, mixed and cross-batch history rejected | `HOSTILE_REPLAY_REJECTION` |
| 15 | Represented DRUNK fail closed | `ACCEPTED_STREAM_INTEGRATION` |
| 16 | Represented POISONED fail closed | `ACCEPTED_STREAM_INTEGRATION` |
| 17 | Effective Vortox fail closed | `ACCEPTED_STREAM_INTEGRATION` |
| 18 | Unresolved No Dashii fail closed | `ACCEPTED_STREAM_INTEGRATION` |
| 19 | Candidate shortage fail closed | `PURE_POLICY_SEAM` |
| 20 | Retryable failures write no receipt | `ACCEPTED_STREAM_INTEGRATION` |
| 21 | Same command ID works after dependency recovery | `ACCEPTED_STREAM_INTEGRATION` |
| 22 | One NORMAL ledger fact with exact cause | `ACCEPTED_STREAM_INTEGRATION` |
| 23 | Settlement creates no second fact | `STRUCTURAL_VALIDATION` |
| 24 | Source player projection | `PROJECTION` |
| 25 | Source AI projection | `PROJECTION` |
| 26 | Other players and AIs cannot see delivery | `PROJECTION` |
| 27 | No true-role or effectiveness leakage | `PROJECTION` |
| 28 | Later character change does not rewrite history | `PROJECTION` |
| 29 | Phase remains FIRST_NIGHT | `ACCEPTED_STREAM_INTEGRATION` |
| 30 | V1, Mathematician, Seamstress, and tenure regressions | `LEGACY_REPLAY_COMPATIBILITY` |
| 31 | Ubuntu ordinary/single-fork coverage and Windows deterministic parity | `CROSS_PLATFORM_CI` |

Structural authority additionally mutates every V3 opportunity, V2 target, V2 delivery, visibility, reliability, and source-contract key through missing, extra, wrong-type, wrong-literal, hostile prototype, and cross-link cases. Accepted-stream tests use real command handling, event append, rebuild, receipt, ledger, and projection boundaries.

## Explicit Out of Scope

- DRUNK Dreamer information generation;
- POISONED Dreamer information generation;
- Vortox forced-false information;
- No Dashii adjacency poisoning derivation;
- other unmodeled source impairments;
- Philosopher-gained Dreamer;
- Storyteller free false-role choice or candidate persistence;
- Traveller targeting;
- other-night Dreamer;
- life, death, nomination, voting, or execution;
- first-night completion and phase transition;
- DAY;
- Phase 2C;
- changing V1 or Slice 2B19A1 V2 payloads;
- changing public Mathematician contracts;
- adding general source-effect, canonical-context, event, ledger-evidence, or projection infrastructure;
- marking Dreamer `COMPLETE`.

These frozen exclusions are backlog, not acceptance blockers for this Slice.

## Completion Criteria

Implementation is complete only when:

1. every production change is inside the six-file allowlist;
2. all V1/V2/V3 runtime shapes are exact and validators are discriminator-first;
3. producer transition emits only V3 for new V2-plan base Dreamer openings;
4. accepted V1 and V2 histories replay unchanged;
5. canonical source, tenure, ability, task, target, and revision bindings are proven from T2 state;
6. only proven-effective base Dreamer reaches normal information;
7. normal answers satisfy one GOOD, one EVIL, exactly one true, stable opposite candidate, and no truth marker;
8. target, delivery, settlement, ledger, receipt, and replay behavior match this contract;
9. private projections expose only the frozen historical delivery fields;
10. every retryable failure is receipt-free and mutation-free;
11. all 31 primary authority obligations and exact-shape hostile matrices pass;
12. `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, and `git diff --check` pass;
13. coverage continues under accepted `VITEST_MAX_FORKS=1` without workflow changes;
14. no forbidden API, randomness, locale comparison, UUID, time-derived identity, raw JSON semantic comparison, sparse `Array.every` validation, or skipped test is introduced;
15. `docs/rules/ROLE_COVERAGE_MATRIX.md` remains Dreamer `PARTIAL` and records `PARTIAL / NORMAL_INFORMATION_ONLY` only after implementation;
16. no later Dreamer Slice or Phase 2C begins.

## Review Gate

The independent reviewer must confirm the immutable V2 boundary, exact V3 contracts, safe producer transition, normal-path reachability, honest Vortox/impairment/No Dashii fail-closed behavior, no gained implementation, no new shared infrastructure, full R/T classification, exact batch/replay/ledger/projection/receipt behavior, test authority, allowlist, and stop-loss.

Only `RULE_DESIGN_PASS` authorizes implementation. Any required semantic expansion receives `RULE_DESIGN_FIX_REQUIRED`, `RESLICE_REQUIRED`, or `HUMAN_BLOCKED` as applicable.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_1
