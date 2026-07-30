# Phase 3 Slice 2B20B-P2 — Effective Impairment Provenance Design Correction Round 1

## Metadata

- sliceId: `2B20B-P2`
- documentType: `STANDALONE_DESIGN_CORRECTION`
- designCorrectionRound: `1`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2_DESIGN_CORRECTION_ROUND_1_ONLY`
- parentDesignPath: `docs/architecture/2B20B-P2-effective-impairment-provenance-separation-design.md`
- parentDesignSha256: `2f397430ba8325bb07ba885f1769726235f91236a886bdbe55d10e042a36c277`
- ruleEvidencePath: `docs/rules/evidence/2B20B-P2-impairment-state-provenance.md`
- ruleVerdict: `RULE_READY`
- designVerdict: `NOT_YET_REVIEWED`
- implementationAuthorized: `false`
- ruleSemanticsChanged: `false`
- eventSchemaChanged: `false`
- acceptedBehaviorChanged: `false`
- productionChangeAuthorized: `false`
- testChangeAuthorized: `false`
- evidenceSchemaCorrectionRequired: `true`
- recommendedReviewStatus: `READY_FOR_INDEPENDENT_RULE_DESIGN_REREVIEW`
- requiredNextAction: `RUN_INDEPENDENT_RULE_DESIGN_REREVIEW`

This document does not claim `RULE_DESIGN_PASS`. No implementation may begin until an independent reviewer returns that exact verdict with no remaining blocker.

## Authority and supersession

The parent design remains immutable historical evidence. This correction is standalone and contains the complete corrected design authority. Once materialized, implementation and rereview must use this document rather than combining definitions from the parent.

Where this document conflicts with the parent, this document controls. It supersedes the parent’s ambiguous revision domain, generic evaluated-ability identity, raw event-array P2 seam, invented Snake Charmer tenure/ability provenance, mixed C19/C20 responsibilities, invalid Supporting Authority status vocabulary, invalid R/T/primary classifications, and illegal evidence coverage-status value.

The rule evidence, `08-night-task-model.md`, `09-effect-lifecycle.md`, `REVIEW_PROTOCOL.md`, Governance ADR V1.1, and accepted event/replay/batch/state/role-specific contracts remain authoritative.

## Scope

Design one additive producer-neutral T2 derived seam that answers which canonical DRUNK and/or POISONED player conditions are effective at one complete committed `gameVersion`. It returns player-condition state and exact known provenance. It does not identify, validate, or execute an ability.

The design freezes `gameVersion` as the only effective-condition time domain; complete atomic-batch prefixes as the only historical boundary; rebuilt `CurrentCharacterStateSet` plus `AbilityImpairmentSet` as condition authority; existing accepted impairment events as known provenance authority; current Philosopher and Snake Charmer mappings; no `UNKNOWN_SOURCE` or role-effect producer; and no ability consumer.

## Non-goals

This correction does not authorize POISONED Dreamer; No Dashii poison derivation; Vigormortis kill/death/retained-Minion/adjacency/poison/other-night behavior; a generic impairment, `EffectInstance`, or `ContinuousRule` engine; a generic ability registry or identity; changes to role-specific resolvers, `AbilityImpairmentSet`, event/snapshot schema, rebuild, batch validation, application, projection, receipts, ledgers, 2B20A, accepted P1, first-night completion, day entry, nomination, voting, execution, death, or Phase 2C.

## Rule authority

Primary evidence is `docs/rules/evidence/2B20B-P2-impairment-state-provenance.md`.

DRUNK and POISONED are player conditions, may coexist, and are separate from machine provenance. Known provenance is used only when positively established by canonical accepted history. Provenance is hidden from players/AI and never determines whether an otherwise established condition is effective. No substantive rule conflict exists.

## Evidence schema normalization

The evidence contains exactly two illegal values:

```text
ruleCoverageStatus: PARTIAL/GOVERNANCE_PRECHECK_ONLY
```

The sole writer must change only those values to:

```text
ruleCoverageStatus: PARTIAL
```

It must preserve:

```text
evidencePurpose: RULE_EVIDENCE_AND_GOVERNANCE_PRECHECK_ONLY
```

This is schema normalization, not a rule or coverage change.

## Correction finding closure

| Finding | Corrective authority |
|---|---|
| Multiple revision domains | `gameVersion` is the sole query/interval domain |
| Generic evaluated ability identity | Removed; P2 returns player conditions only |
| Invented Snake Charmer identities | Removed; only existing payload/envelope fields map |
| Raw event array used as P2 seam input | Public T1 wrapper accepts `readonly unknown[]`, validates/narrows/rebuilds; P2 seam accepts only branded T2 state |
| Mixed C19/C20 and invalid classifications | C19 is effective state; C20 is provenance/trust |
| Invalid SUP011 status/scope | Status `ACCEPTED`; applicability restricted and non-primary |
| Illegal evidence coverage token | Exactly two values normalize to `PARTIAL` |

## Canonical revision authority

### Sole time domain

`gameVersion` is the only authority for current/historical queries, condition onset/end, snapshot identity, and complete-prefix selection. Each committed batch has one gameVersion; the next batch increments it by one.

| Field | Permitted use | Forbidden use |
|---|---|---|
| `eventSequence` | Total/within-batch order, provenance evidence, tie-break | Query boundary or lifecycle revision |
| `batchId` | Atomic grouping and evidence | Time domain |
| `CurrentCharacterStateSet.revision` | Rebuilt-state/provenance cross-link | Global time, onset, end, query |
| `GameState.lastEventSequence` | Prefix-end confirmation | Condition revision |
| phase/night/day or delivery/settlement/snapshot revisions | Existing local contracts | P2 time authority |

### Complete prefix

For target gameVersion G, the prefix contains every event with gameVersion <= G. It is valid only if the exact T1 event-log validator accepts the full log; G exists; every event of batch G is included; no later event is included; the prefix ends at the last event of G; the prefix passes batch semantics and rebuild; rebuilt state.gameVersion equals G; and state.lastEventSequence equals the final prefix sequence. No query may stop inside a batch.

`CURRENT` means the final complete gameVersion. Historical G rebuilds its own prefix and never overlays final state, current character state, current impairments, or current provenance.

### Same character-state revision

Multiple events may share one character-state revision. Philosopher batches commonly leave it unchanged. A Snake Charmer Demon-hit batch uses the pre-swap revision in TargetChosen, advances it in DemonSwapApplied, then the impairment and settlement reference the new revision. All four share one gameVersion. P2 observes poison only after the whole batch commits. Event sequence distinguishes evidence; character-state revision is not a clock.

### Onset/end

For an accepted impairment event in gameVersion G:

```text
effectiveFromGameVersion = G
effectiveUntilGameVersionExclusive = null
```

It is absent before G and present at the complete G boundary. Current schema has no impairment-end event; P2 must not invent one.

## Ability-authority boundary

The frozen chain is:

```text
validated EventLog
  → complete-gameVersion prefix
  → canonical GameState rebuild
  → CurrentCharacterStateSet + AbilityImpairmentSet
  → producer-neutral EffectiveConditionSnapshot for one player
  → existing role-specific ability resolver/capability
  → ability evaluation
```

P2 implements only the snapshot step. It accepts/emits/validates no ability identity, creates no registry, chooses no resolver, and calls no resolver. Existing role-specific contracts retain sole authority over tenure, ability instance, opportunity, capability, entitlement, and execution. Impairment is player state; provenance is audit/replay source truth. A future Dreamer consumer requires a separate Slice.

## Complete TypeScript design contract

Proposed future module: `packages/domain-core/src/effective-impairment-provenance.ts`.

```ts
import type {
  AbilityImpairmentId,
  BatchId,
  EventId,
  PlayerId,
  RoleId,
} from "./ids.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";
import type { SeatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";

export const EFFECTIVE_CONDITIONS = ["DRUNK", "POISONED"] as const;
export type EffectiveCondition = (typeof EFFECTIVE_CONDITIONS)[number];

export type EffectiveConditionState =
  | { readonly kind: "NONE"; readonly conditions: readonly [] }
  | {
      readonly kind: "IMPAIRED";
      readonly conditions:
        | readonly ["DRUNK"]
        | readonly ["POISONED"]
        | readonly ["DRUNK", "POISONED"];
    };

export type EstablishingEventReference = {
  readonly eventId: EventId;
  readonly eventSequence: number;
  readonly batchId: BatchId;
  readonly gameVersion: number;
};

export type PhilosopherDrunkAbilitySourceProvenance = {
  readonly kind: "ABILITY_SOURCE";
  readonly sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE";
  readonly impairmentId: AbilityImpairmentId;
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRole: RoleSetupSnapshot;
  readonly chosenRoleId: RoleId;
  readonly sourceCharacterStateRevision: number;
  readonly establishingEvent: EstablishingEventReference;
};

export type SnakeCharmerPoisonAbilitySourceProvenance = {
  readonly kind: "ABILITY_SOURCE";
  readonly sourceKind: "SNAKE_CHARMER_DEMON_HIT";
  readonly impairmentId: AbilityImpairmentId;
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly establishingEvent: EstablishingEventReference;
};

export type CurrentConditionProvenance =
  | PhilosopherDrunkAbilitySourceProvenance
  | SnakeCharmerPoisonAbilitySourceProvenance;

export type ReservedRoleEffectProvenance = {
  readonly kind: "ROLE_EFFECT";
  readonly availability: "UNSUPPORTED_R4";
};

export type ReservedUnknownSourceProvenance = {
  readonly kind: "UNKNOWN_SOURCE";
  readonly availability: "UNSUPPORTED_R4";
};

export type ReservedFutureConditionProvenance =
  | ReservedRoleEffectProvenance
  | ReservedUnknownSourceProvenance;

export type EffectiveConditionRecord = {
  readonly condition: EffectiveCondition;
  readonly effectiveAtQueryGameVersion: true;
  readonly effectiveFromGameVersion: number;
  readonly effectiveUntilGameVersionExclusive: null;
  readonly provenance: CurrentConditionProvenance;
};

export type EffectiveConditionSnapshot = {
  readonly playerId: PlayerId;
  readonly gameVersion: number;
  readonly currentCharacterStateRevision: number;
  readonly state: EffectiveConditionState;
  readonly records: readonly EffectiveConditionRecord[];
};

export type CanonicalImpairmentEventEvidence = {
  readonly payload:
    | PhilosopherDrunkAbilitySourceProvenance
    | SnakeCharmerPoisonAbilitySourceProvenance;
};

declare const canonicalImpairmentStateBrand: unique symbol;

export type CanonicalImpairmentStateAtGameVersion = {
  readonly [canonicalImpairmentStateBrand]: true;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly state: GameState;
  readonly impairmentEvents: readonly CanonicalImpairmentEventEvidence[];
};

export type CanonicalImpairmentStateBuildFailureCode =
  | "EMPTY_EVENT_LOG"
  | "INVALID_QUERY_GAME_VERSION"
  | "QUERY_GAME_VERSION_NOT_FOUND"
  | "INCOMPLETE_GAME_VERSION_PREFIX"
  | "UNTRUSTED_EVENT_LOG"
  | "REBUILD_FAILED"
  | "REBUILT_VERSION_MISMATCH"
  | "IMPAIRMENT_EVENT_STATE_MISMATCH"
  | "UNSUPPORTED_IMPAIRMENT_PROVENANCE";

export type CanonicalImpairmentStateBuildResult =
  | {
      readonly ok: true;
      readonly canonicalState: CanonicalImpairmentStateAtGameVersion;
    }
  | {
      readonly ok: false;
      readonly code: CanonicalImpairmentStateBuildFailureCode;
    };

export type EffectiveConditionResolutionFailureCode =
  | "INVALID_CANONICAL_IMPAIRMENT_STATE"
  | "PLAYER_NOT_FOUND_AT_GAME_VERSION"
  | "DUPLICATE_PLAYER_AT_GAME_VERSION"
  | "IMPAIRMENT_PROVENANCE_MISSING"
  | "IMPAIRMENT_PROVENANCE_DUPLICATE"
  | "IMPAIRMENT_PROVENANCE_MISMATCH"
  | "ROLE_EFFECT_NOT_SUPPORTED"
  | "UNKNOWN_SOURCE_NOT_AUTHORIZED"
  | "NON_CANONICAL_CONDITION_ORDER";

export type EffectiveConditionResolution =
  | { readonly ok: true; readonly snapshot: EffectiveConditionSnapshot }
  | {
      readonly ok: false;
      readonly code: EffectiveConditionResolutionFailureCode;
    };

export const rebuildCanonicalImpairmentStateAtGameVersion:
  (input: {
    readonly eventLog: readonly unknown[];
    readonly queryGameVersion: number | "CURRENT";
  }) => CanonicalImpairmentStateBuildResult;

export const resolveEffectiveConditionsAtGameVersion:
  (input: {
    readonly canonicalState: CanonicalImpairmentStateAtGameVersion;
    readonly playerId: PlayerId;
  }) => EffectiveConditionResolution;

// Internal after exact T1 validation only; never a public input alias.
type ValidatedDomainEventLog = readonly AnyDomainEventEnvelope[];
```

### Public T1 wrapper and T2 seam

`rebuildCanonicalImpairmentStateAtGameVersion` is an explicit public T1 persisted boundary. Its `eventLog` is `readonly unknown[]`; TypeScript types cannot confer trust.

Its mandatory order is:

1. apply the repository's existing exact runtime event-log/envelope/payload validation chain, including dense-array, exact-field, canonical-data, event-version, ID, proxy/getter/symbol/cycle/nonplain, and fail-closed checks where represented;
2. only after that succeeds, narrow to internal `ValidatedDomainEventLog` / `readonly AnyDomainEventEnvelope[]`;
3. invoke existing `validateDomainEventStream` on the narrowed log;
4. select one complete gameVersion prefix;
5. invoke existing batch semantics and canonical rebuild;
6. cross-check rebuilt impairment state against exact accepted impairment event envelopes; and
7. construct the module-private branded T2 aggregate.

No cast from unknown to `AnyDomainEventEnvelope[]` may occur before successful exact validation. `AnyDomainEventEnvelope` is validation-after-narrowing internal type only.

`resolveEffectiveConditionsAtGameVersion` is the P2 public T2 seam. It accepts only the branded canonical aggregate and never accepts unknown, an event array, an ability identity, a caller condition flag, or caller provenance.

## Exact provenance mappings

### Philosopher DRUNK

| Derived field | Existing authority |
|---|---|
| condition | impairment payload `kind=DRUNK` |
| sourceKind | `PHILOSOPHER_CHOSEN_DUPLICATE` |
| impairment/source/affected IDs, seat, role, chosenRoleId, character-state revision | exact impairment payload fields |
| establishing eventId/eventSequence/batchId/gameVersion | impairment event envelope |
| effectiveFromGameVersion | impairment event gameVersion |
| effectiveUntilGameVersionExclusive | null under current schema |

The T1 rebuild already requires matching choice/grant/current-holder history. P2 invents no Philosopher tenure or ability-instance identity.

### Snake Charmer POISONED

The only model is the validated same-batch chain:

```text
SnakeCharmerTargetChosen
→ SnakeCharmerDemonSwapApplied
→ AbilityImpairmentApplied
→ ScheduledTaskSettled
```

| Derived field | Existing authority |
|---|---|
| condition | impairment payload `kind=POISONED` |
| sourceKind | `SNAKE_CHARMER_DEMON_HIT` |
| impairmentId | payload |
| sourcePlayerId | payload, cross-linked to swap source |
| affected player/seat/role | payload, cross-linked to swap target and targetAfter.role |
| sourceCharacterStateRevision | payload, equal to swap next revision |
| establishing eventId/eventSequence/batchId/gameVersion | impairment envelope |
| effectiveFromGameVersion | impairment event gameVersion |
| effectiveUntilGameVersionExclusive | null |

P2 must not invent Snake Charmer roleTenureId, abilityInstanceId, affected-player tenure, affected ability identity, effect-instance ID, or end event.

## Condition reconstruction algorithm

Given branded canonical state and player P: require exactly one current-character entry; select rebuilt impairments for P; require each to have exactly one matching accepted impairment-event evidence record; cross-check payload/envelope; require establishing gameVersion <= query version; treat it as active because no end event exists; derive one record per impairment; sort by DRUNK before POISONED, onset gameVersion, eventSequence, then code-unit impairmentId; derive [], [DRUNK], [POISONED], or [DRUNK,POISONED]. Condition kind and interval determine state. Provenance validates/explains source but never selects health or impairment.

## Replay and trust decision table

| Path | Reachability | Trust | Result |
|---|---|---|---|
| Current accepted Philosopher prefix | R1 | T1 wrapper → T2 seam | known DRUNK |
| Current accepted Snake Demon-hit prefix | R1 | T1 wrapper → T2 seam | complete batch, known POISONED |
| Complete historical gameVersion prefix | R1 | T1 wrapper → T2 seam | exact historical state, no overlay |
| P2 legacy/import format | R2 | T1 | none exists; no R2 criterion |
| Persisted mutation | R3 | T1 | reject before T2 |
| Truncated batch | R3 | T1 | incomplete prefix/batch rejection |
| Shape-only/manual state | R3 | T1 | cannot obtain private brand |
| ROLE_EFFECT | R4 | T2 | unsupported/non-gating |
| UNKNOWN_SOURCE | R4 | T2 | no producer/no evaluation |
| Future Dreamer consumer | R4 | role-specific | separate Slice |

Untrusted import, shape-only fixture, state overwrite, or caller assertion cannot validate, narrow, rebuild, obtain the T2 brand, or enter evaluation.

## C19 redesign — effective impairment behavior only

P1-C19 remains immutable with MechanismMatch=FAIL.

- P2-C19A_CURRENT_EFFECTIVE_CONDITION_SET: current NONE/DRUNK/POISONED.
- P2-C19B_COMPLETE_GAME_VERSION_INTERVAL: onset at complete batch, no intra-batch query.
- P2-C19C_HISTORICAL_PREFIX_ISOLATION: historical prefix rebuild, no current overlay.
- P2-C19D_SIMULTANEOUS_CONDITION_REPRESENTATION: DRUNK+POISONED type/policy; R4 non-gate.

C19 does not validate provenance trust, application rejection, Dreamer, or No Dashii.

## C20 redesign — provenance trust only

P1-C20 remains immutable with MechanismMatch=FAIL.

- P2-C20A_KNOWN_PROVENANCE_MAPPING: exact Philosopher/Snake fields.
- P2-C20B_PERSISTED_HOSTILE_REJECTION: forged/missing/duplicate/reordered/cross-linked/truncated persisted history fails before T2.
- P2-C20C_NO_UNKNOWN_SOURCE_PRODUCER: R4 non-gate.
- P2-C20D_NO_ROLE_EFFECT_PRODUCER: R4 non-gate.

C20 does not claim effective Dreamer behavior.

## SUP-2B20B-P1-011

| Field | Value |
|---|---|
| AuthorityStatus | `ACCEPTED` |
| Applicability | `RESTRICTED_TO_CURRENT_NO_DASHII_REJECTION` |
| Current No Dashii rejection | `APPLICABLE` |
| POISONED Dreamer | `NOT_APPLICABLE / INSUFFICIENT_SUPPORT` |
| Vigormortis poison | `NOT_APPLICABLE / INSUFFICIENT_SUPPORT` |
| P2 seam | `NOT_APPLICABLE / INSUFFICIENT_SUPPORT` |
| P2 primary | `FORBIDDEN` |

RESTRICTED/FALSE_SCOPE/INSUFFICIENT_SUPPORT are not protocol AuthorityStatus values. SUP011 supports only the real No Dashii rejection and never P2 primary authority.

## Reachability sets

- R1: C19A, C19B, C19C, C20A, S01.
- R2: empty; no P2 legacy/import format.
- R3: C20B.
- R4: C19D, C20C, C20D, S02.

R4 rows are non-gating scope/extension facts and cannot demand a producer.

## Design-time Governance Traceability V1.1

Exactly nine fields; no ActualTest, MIXED, or MULTI_LAYER.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| P2-C19A_CURRENT_EFFECTIVE_CONDITION_SET | Canonical rebuilt state yields NONE, DRUNK, or POISONED | T2 seam derives exact unique tuple from current impairments | Direct canonical-state structural derivation | R1 | T2 | STRUCTURAL_VALIDATION | Exact tuple; provenance does not select state | Accepted Philosopher/Snake history; SUP011 forbidden |
| P2-C19B_COMPLETE_GAME_VERSION_INTERVAL | Impairment starts only at complete batch | Onset equals event gameVersion; no intra-batch query | Pure interval/prefix policy | R1 | T3 | PURE_POLICY_SEAM | absent before batch, present at complete boundary, null end | Event stream authority |
| P2-C19C_HISTORICAL_PREFIX_ISOLATION | Historical state comes from its own prefix | Historical G rebuilds exactly through G without overlay | Canonical complete-prefix reconstruction | R1 | T2 | STRUCTURAL_VALIDATION | exact historical result | Rebuild authority; no borrowed application primary |
| P2-C19D_SIMULTANEOUS_CONDITION_REPRESENTATION | Conditions may coexist | Closed tuple and pure reduction represent both | Exhaustive pure policy | R4 | T3 | PURE_POLICY_SEAM | representation defined, no producer required | Official states; non-gating |
| P2-C20A_KNOWN_PROVENANCE_MAPPING | Known provenance uses only accepted fields | Exact Philosopher/Snake field maps | Derived structural validation | R1 | T2 | STRUCTURAL_VALIDATION | exact provenance, no invented IDs | Existing impairment/batch authority; SUP011 forbidden |
| P2-C20B_PERSISTED_HOSTILE_REJECTION | Corrupted persisted provenance never reaches T2 | One declared persisted mutation fails validation/rebuild | Accepted-prefix clone with mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | fail before brand creation | Valid prefix support only |
| P2-C20C_NO_UNKNOWN_SOURCE_PRODUCER | No current UNKNOWN_SOURCE authority | No event/import/state/adapter produces it | Reserved-union static inspection | R4 | T3 | STRUCTURAL_VALIDATION | unreachable/non-gating | None |
| P2-C20D_NO_ROLE_EFFECT_PRODUCER | No role effect introduced | No No Dashii/Vigormortis effect mapping | Reserved-union static inspection | R4 | T3 | STRUCTURAL_VALIDATION | unreachable/non-gating | SUP011 not applicable |
| P2-S01_CURRENT_NO_DASHII_REJECTION | Existing rejection remains exact | Formal command returns existing unsupported result with zero prohibited mutation | Real formal command rejection | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | unchanged rejection/atomicity | SUP011 ACCEPTED, restricted scope |
| P2-S02_NO_DOWNSTREAM_CONSUMER | No Dreamer/app/projection consumer | Static import/call inspection finds none | Static dependency inspection | R4 | T3 | STRUCTURAL_VALIDATION | no consumer; separate future Slice | None; non-gating |

No legacy row is frozen. If real R2 promise is found, stop for correction. CROSS_PLATFORM_CI may supplement but cannot prove scope/provenance.

## Materialization allowlist

This correction stage permits only: add this correction file; change exactly two evidence status tokens to PARTIAL. No parent design, production, test, event, app, projection, workflow, dependency, control, or P1 file may change.

## Dormant future implementation allowlist

Inactive until separate authorization after RULE_DESIGN_PASS: add only `effective-impairment-provenance.ts`, its new test file, P2 implementation traceability, and explicitly authorized P2 controls. Even then no existing production/test file, events, payload validators, event-applier, rebuild, batch semantics, game-state, AbilityImpairmentSet, Dreamer, app, projection, 2B20A, or P1 file may change. If additive implementation is impossible, stop and reslice.

## Compatibility and privacy

No event/snapshot/history/payload/command/receipt/projection migration; no registry; histories rebuild unchanged; no type becomes persistence authority; no projection file is in scope. Never expose conditions, provenance, IDs, roles, revisions, or event metadata to players/AI.

## Failure codes

`EMPTY_EVENT_LOG`, `INVALID_QUERY_GAME_VERSION`, `QUERY_GAME_VERSION_NOT_FOUND`, `INCOMPLETE_GAME_VERSION_PREFIX`, `UNTRUSTED_EVENT_LOG`, `REBUILD_FAILED`, `REBUILT_VERSION_MISMATCH`, `IMPAIRMENT_EVENT_STATE_MISMATCH`, `UNSUPPORTED_IMPAIRMENT_PROVENANCE`, `INVALID_CANONICAL_IMPAIRMENT_STATE`, `PLAYER_NOT_FOUND_AT_GAME_VERSION`, `DUPLICATE_PLAYER_AT_GAME_VERSION`, `IMPAIRMENT_PROVENANCE_MISSING`, `IMPAIRMENT_PROVENANCE_DUPLICATE`, `IMPAIRMENT_PROVENANCE_MISMATCH`, `ROLE_EFFECT_NOT_SUPPORTED`, `UNKNOWN_SOURCE_NOT_AUTHORIZED`, `NON_CANONICAL_CONDITION_ORDER`.

The T1 wrapper catches and translates existing DomainError without weakening underlying validation.

## Acceptance criteria

1. gameVersion is sole time domain.
2. No partial-batch prefix.
3. CURRENT is final complete version.
4. Historical queries rebuild their own prefix.
5. Shared character revision does not collapse evidence.
6. Exact Philosopher mapping.
7. Exact four-event Snake mapping.
8. No invented Snake tenure/ability ID.
9. T1 public input is `readonly unknown[]`; exact validation precedes narrowing to internal AnyDomainEventEnvelope[].
10. P2 accepts no ability identity.
11. Snapshot is player conditions only.
12. Provenance never determines effectiveness.
13. Current output only known ABILITY_SOURCE.
14. UNKNOWN_SOURCE/ROLE_EFFECT remain R4 and cannot evaluate.
15. C19 only effective behavior; C20 only provenance/trust.
16. Hostile persisted path is R3/T1/HOSTILE_REPLAY_REJECTION.
17. No Dashii rejection is separate R1/T1/APPLICATION_COMMAND_INTEGRATION.
18. SUP011 remains ACCEPTED/restricted.
19. No R4 current gate or invented R2 row.
20. No consumer or existing production/test/schema changes.
21. Evidence two statuses normalize to PARTIAL; purpose remains.
22. Independent review returns RULE_DESIGN_PASS before implementation.

## Stop conditions

Stop for non-pass if exact T1 unknown validation/narrowing cannot be preserved; complete prefix cannot rebuild; schema/current files must change; generic registry/ability identity is required; invented Snake identity is required; UNKNOWN_SOURCE, No Dashii, Vigormortis, Dreamer consumer, or R4 producer is required; R3 is represented as R1; static validation is represented as legacy; SUP011 is P2 primary; accepted replay/privacy changes; or rereview is not RULE_DESIGN_PASS.

## Tradeoff decision

Selected: exact public T1 unknown boundary → validated/narrowed event log → complete-version rebuild → branded T2 player-condition seam. Rejected: pretyped public event arrays, raw P2 arrays, generic ability identity, character-state revision or eventSequence as time, new producer-specific variant, direct state flag. Full EffectInstance/ContinuousRule remains deferred.

## Design disposition

- ruleVerdict: `RULE_READY`
- designVerdict: `NOT_YET_REVIEWED`
- implementationAuthorized: `false`
- evidenceSchemaCorrection: `REQUIRED_BEFORE_REREVIEW`
- parentDesignSupersededForFutureImplementation: `true`
- suggestedReviewStatus: `READY_FOR_INDEPENDENT_RULE_DESIGN_REREVIEW_AFTER_MATERIALIZATION`
- requiredPassingVerdict: `RULE_DESIGN_PASS`
- requiredNextAction: `SOLE_WRITER_MATERIALIZE_CORRECTION_AND_NORMALIZE_EVIDENCE_THEN_RUN_INDEPENDENT_RULE_DESIGN_REREVIEW`
