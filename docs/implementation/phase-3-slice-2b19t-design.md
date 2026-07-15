# Phase 3 Slice 2B19T Design — Canonical Dreamer Role-Tenure Prerequisite

## metadata

- sliceId: `2B19T`
- title: `Canonical Dreamer Role-Tenure Prerequisite`
- acceptedMain: `ed403b2d732512b0a44b419dbb9eec15e4a7af42`
- ruleEvidence: `docs/rules/evidence/2B19T.md`
- ruleEvidenceSha256: `b8c8b858ee3a7fb7fc141a1d28a0b385cf17111947caa397d569f9b79041185d`
- ruleVerdict: `RULE_READY`
- designRound: `1 / 2`
- implementationClassification: `DERIVED_STATE_EXPANSION`
- ruleSemanticsChanged: `false`
- coverageStatus: `FOUNDATION`
- DreamerRoleCoverageAfterSlice: `SKELETON`
- implementationAuthorizedByThisDocument: `false`
- requiredNextGate: `independent RULE_DESIGN_PASS`

## scope

This Slice adds `dreamer` to the existing shared canonical role-tenure derived state. It covers only:

1. The authoritative tracked-role domain.
2. Canonical Dreamer tenure ID formatting and parsing.
3. Initial Dreamer tenure derived from the accepted `CharactersAssigned` envelope.
4. Shared transition reconciliation when a real accepted character-transition fact has Dreamer in its before or after role.
5. Unique active-tenure and continuous-tenure queries.
6. Exact runtime state validation.
7. Accepted-event-stream provenance audit and deterministic replay.
8. Compatibility regressions for the five previously tracked roles.

This Slice does not implement a new character-change producer. Accepted main currently has only `SnakeCharmerDemonSwapApplied` as a concrete character-changing event. Its currently reachable legal scenarios do not independently create Dreamer. Direct reconciliation tests involving Dreamer prove the shared derived-state contract only; they must not be described as evidence that accepted main currently has a reachable Dreamer-changing command path.

A Dreamer transition becomes accepted-history truth only when an accepted event envelope contains the corresponding validated before/after role transition. Test fixtures or caller-supplied `RoleTenureTransitionFact` values never establish accepted history.

## existingTenureArchitecture

Accepted main contains one shared tenure system:

- `GameState.seamstressRoleTenureState?: RoleTenureState`
- `RoleTenureState.records`
- `RoleTenureState.processedTransitionFactIds`
- initial derivation through `bootstrapRoleTenuresFromCharactersAssigned`
- transition facts through `roleTenureTransitionFactsFromSnakeCharmerDemonSwap`
- mutation through `applyRoleTenureTransitionFact`
- queries through `isRoleTenureActiveAt` and `isRoleTenureContinuousAcross`
- replay through `applyDomainEvent` and `rebuildGameState`

Despite the legacy property and module names, this state already serves Cerenovus, Mathematician, Philosopher, Seamstress and Vortox. It is derived state, not a Seamstress event payload.

The canonical facts already available are:

- `GameState.assignment`: the accepted `CharactersAssigned` payload.
- `GameState.currentCharacterState`: revision and current player/seat/role snapshots.
- `GameState.snakeCharmerDemonSwaps`: full accepted swap payloads containing player, seat, before/after role and previous/next revision.
- The accepted event stream supplied internally to `rebuildGameState`: envelope `eventId` and `eventSequence` for `CharactersAssigned` and every `SnakeCharmerDemonSwapApplied`.

`RoleTenureState` alone cannot prove an ending transition’s envelope provenance because a closed record has no `endedBy` field, and a tracked-to-untracked transition may have a processed ID without creating a successor record. Therefore full provenance must not be inferred from state alone.

Full proof is nevertheless possible without a schema change: the internal rebuild audit combines the derived state with the already validated canonical event stream. No caller-supplied transition facts are accepted.

## trackedRoleDomain

Freeze the authoritative role domain in `packages/domain-core/src/seamstress.ts`:

```ts
export const CANONICAL_ROLE_TENURE_TRACKED_ROLE_IDS = [
  "cerenovus",
  "dreamer",
  "mathematician",
  "philosopher",
  "seamstress",
  "vortox"
] as const;

export type CanonicalRoleTenureTrackedRoleId =
  (typeof CANONICAL_ROLE_TENURE_TRACKED_ROLE_IDS)[number];

export type SeamstressRelevantRoleId =
  CanonicalRoleTenureTrackedRoleId;

export const isCanonicalRoleTenureTrackedRoleId = (
  value: unknown
): value is CanonicalRoleTenureTrackedRoleId =>
  typeof value === "string" &&
  CANONICAL_ROLE_TENURE_TRACKED_ROLE_IDS.some(
    (roleId) => roleId === value
  );
```

The order above is frozen and must be used in tests. There must be no second role list.

All of the following must use `CanonicalRoleTenureTrackedRoleId` or its compatibility alias:

- `RoleTenureRecord.roleId`
- formatter input
- parser result
- runtime predicate
- bootstrap filter
- transition reconciliation
- exact validator
- current-state validator
- active-tenure lookup
- clone path
- replay audit

## namingCompatibility

Freeze naming scheme **B**.

- `CanonicalRoleTenureTrackedRoleId` is the new authoritative name.
- `SeamstressRelevantRoleId` remains an exported compatibility alias.
- Existing imports of `SeamstressRelevantRoleId`, `RoleTenureState`, formatter, parser and query functions must continue compiling.
- Do not rename `GameState.seamstressRoleTenureState`.
- Do not rename the existing formatter, parser, bootstrap, transition or query functions.
- Do not move the entire tenure implementation out of `seamstress.ts`.
- The new accepted-history auditor may live in one non-root-exported internal module.
- No unrelated Seamstress API rename is allowed.

## roleTenureIdGrammar

The grammar remains:

```text
role-tenure-v1:seat-<NN>:role-<ROLE>:acquired-revision-<R>
```

Exact constraints:

- `NN` is exactly `01` through `12`.
- `ROLE` is exactly one value from the frozen tracked-role domain.
- `R` is a positive canonical decimal safe integer.
- `R` has no leading zero.
- There are no spaces, aliases, case variants or additional segments.
- The formatter and parser must exact-round-trip.
- Existing IDs for the original five roles remain byte-for-byte unchanged.

Valid Dreamer example:

```text
role-tenure-v1:seat-03:role-dreamer:acquired-revision-1
```

The parser must lexically capture the role segment and then call `isCanonicalRoleTenureTrackedRoleId`. It must not maintain a second role alternation that can drift from the authoritative array.

The formatter must reject non-safe revisions. The existing transition-fact formatter/parser must also require safe positive event sequences and revisions.

Required rejections include:

```text
role-tenure-v1:seat-3:role-dreamer:acquired-revision-1
role-tenure-v1:seat-13:role-dreamer:acquired-revision-1
role-tenure-v1:seat-03:role-Dreamer:acquired-revision-1
role-tenure-v1:seat-03:role-dreamer :acquired-revision-1
role-tenure-v1:seat-03:role-dreamer:acquired-revision-01
role-tenure-v1:seat-03:role-unknown:acquired-revision-1
role-tenure-v1:seat-03:role-dreamer:acquired-revision-1:extra
```

## charactersAssignedBootstrap

`bootstrapRoleTenuresFromCharactersAssigned` remains the single bootstrap function.

Preconditions on the accepted production call path:

1. `validateCharactersAssignedPayload` has already validated roster, setup, assignment uniqueness, role snapshots and provenance-bearing envelope metadata.
2. `sourceEventId` is a non-empty accepted envelope event ID.
3. `sourceEventSequence` is a positive safe integer.

The function must additionally fail closed when called directly with:

- a sparse assignments array;
- duplicate player IDs;
- duplicate seat numbers;
- duplicate role IDs;
- malformed player, seat or role snapshot values;
- invalid source event ID or sequence.

It must not require exactly twelve assignments in isolated unit fixtures, but the accepted event-applier path continues to require the complete validated twelve-player assignment.

For every tracked assignment, including Dreamer, it creates exactly:

```ts
{
  roleTenureId: formatRoleTenureId({
    seatNumber: assignment.seatNumber,
    roleId: assignment.role.roleId,
    acquiredCharacterStateRevision: 1
  }),
  playerId: assignment.playerId,
  seatNumber: assignment.seatNumber,
  roleId: assignment.role.roleId,
  acquiredCharacterStateRevision: 1,
  startedBy: {
    kind: "CHARACTERS_ASSIGNED",
    sourceEventId,
    sourceEventSequence,
    characterStateRevision: 1
  }
}
```

Records are ordered by ascending seat. Nontracked roles produce no record. `processedTransitionFactIds` starts empty.

The accepted-history auditor independently checks that the initial record set is exactly the tracked subset of the unique accepted `CharactersAssigned` envelope. It verifies player, seat, role, revision, ID and envelope provenance. No manually inserted Dreamer tenure can satisfy this audit.

## transitionReconciliation

The existing `RoleTenureTransitionFact` shape is retained. No event or payload field changes.

`applyRoleTenureTransitionFact` must use the authoritative tracked-role predicate for both `beforeRole` and `afterRole`.

For a validated fact at `previousCharacterStateRevision = R` and `nextCharacterStateRevision = R + 1`:

- nontracked → Dreamer: require no tracked tenure active for that player/seat at `R`; create Dreamer tenure acquired at `R + 1`.
- Dreamer → nontracked: require exactly one matching Dreamer tenure active at `R`; end it at `R + 1`; create no successor.
- tracked → Dreamer: require exactly one matching before-role tenure active at `R`; end it at `R + 1`; create Dreamer tenure at `R + 1`.
- Dreamer → tracked: require exactly one Dreamer tenure active at `R`; end it at `R + 1`; create the tracked successor at `R + 1`.
- nontracked → nontracked: create no tenure, but the real role-changing fact remains processed exactly once.

Before mutation, the function must reject:

- invalid or noncanonical transition fact ID;
- duplicate processed transition ID;
- player/seat mismatch;
- before-role mismatch with the unique active tenure;
- more than one active tenure for the player/seat at `R`;
- a tracked before role without exactly one matching active tenure;
- a nontracked before role with any active tracked tenure;
- duplicate successor tenure ID;
- successor overlap at `R + 1`;
- unsafe revisions or sequence;
- unchanged before/after role.

After mutation, it must run exact structural/topology validation and reject any overlap or duplicate.

Current accepted source adapters:

- `roleTenureTransitionFactsFromSnakeCharmerDemonSwap` remains the sole accepted production adapter.
- It derives facts only from the accepted event envelope’s payload and envelope metadata.
- The function remains deterministic and seat-ordered.
- No public function may accept a caller-supplied transition as accepted-history authority.

Current reachable Snake Charmer behavior must not be misrepresented: it demonstrates the existing role-change/provenance path, but does not itself create Dreamer in currently supported legal scenarios. Dreamer transition unit tests exercise the shared reconciler contract. Future Pit-Hag, Barber or other producers require separately authorized event adapters and are not added here.

## activeTenureQueries

Keep existing interval semantics:

```ts
isRoleTenureActiveAt(record, revision)
```

is true exactly when:

```text
acquiredCharacterStateRevision <= revision
and
endedCharacterStateRevision is absent
  or revision < endedCharacterStateRevision
```

```ts
isRoleTenureContinuousAcross(record, start, end)
```

is true exactly when:

- `start` and `end` are positive safe integers;
- `end >= start`;
- acquisition is at or before `start`;
- ending is absent or strictly after `end`.

Add one shared query:

```ts
export const findUniqueActiveRoleTenure = (input: {
  readonly state: RoleTenureState;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: CanonicalRoleTenureTrackedRoleId;
  readonly revision: number;
}): RoleTenureRecord | undefined;
```

Contract:

- validate exact state shape/topology before searching;
- validate non-empty player ID, canonical seat, tracked role and positive safe revision;
- return `undefined` when there is no match;
- return the single matching record when exactly one exists;
- throw `DomainError("InvalidRoleTenureState", ...)` when two or more records match;
- do not add a Dreamer-only query.

Dreamer interval behavior:

- initial Dreamer is active at revision 1;
- a later Dreamer tenure is inactive before acquisition;
- it becomes active at its acquisition revision;
- it is inactive at and after its ending revision;
- continuity cannot cross the ending boundary.

## stateValidation

Add in `seamstress.ts`:

```ts
export const validateRoleTenureStateExact = (
  value: unknown
): ValidationResult;
```

It validates:

1. Exact top-level keys: `records`, `processedTransitionFactIds`.
2. Both arrays are dense.
3. Every record has exact keys for its ended/not-ended variant.
4. Every `startedBy` value has exact keys for its discriminant.
5. Player ID, seat, role, revisions, event ID and sequence are valid.
6. Role and tenure ID use the single authoritative domain.
7. Tenure ID exactly equals seat, role and acquired revision.
8. `endedCharacterStateRevision`, when present, is a safe integer strictly greater than acquisition.
9. `CHARACTERS_ASSIGNED` records acquire at revision 1 and have `characterStateRevision: 1`.
10. Transition-started records have:
    - canonical transition fact ID;
    - fact ID sequence/seat/revision equal to record provenance;
    - `next = previous + 1`;
    - acquisition equal to `next`.
11. Tenure IDs are unique.
12. Processed transition IDs are canonical and unique.
13. Every transition-started record’s transition ID appears exactly once in the processed list.
14. Records are in canonical acquisition-revision/seat order.
15. Processed IDs are in source-event-sequence/seat order.
16. No two intervals for the same player/seat overlap.
17. No two records can be active for the same player/seat at the same revision.

Add:

```ts
export const validateRoleTenureStateAgainstCurrentCharacterState = (
  input: {
    readonly roleTenures: unknown;
    readonly currentCharacterState: CurrentCharacterStateSet;
  }
): ValidationResult;
```

After exact validation, it requires:

- no tenure acquisition or ending revision beyond the current revision;
- each current tracked role has exactly one active record matching player, seat and role;
- each current nontracked role has no active tracked record;
- every active record maps to the corresponding current player, seat and role;
- Dreamer follows exactly the same rule as the other tracked roles.

This state-only validator does not claim event provenance completeness.

## replay

Add internal module:

```text
packages/domain-core/src/role-tenure-replay.ts
```

It is not exported from `packages/domain-core/src/index.ts`.

Its package-internal contract is:

```ts
export const assertRebuiltCanonicalRoleTenureState = (
  events: readonly AnyDomainEventEnvelope[],
  state: GameState
): void;
```

It is called only by `rebuildGameState` after:

1. `validateDomainEventStream`;
2. all batch semantic validation;
3. all events have been applied.

It must not accept `RoleTenureTransitionFact[]` from a caller.

The audit performs these checks without raw `JSON.stringify` comparison:

### Assignment authority

- There is zero or one `CharactersAssigned` envelope.
- Absence of assignment requires absence of current character and tenure state.
- Presence requires `state.assignment` and its fields/assignments to match that envelope explicitly.
- Expected initial records are derived directly from that envelope.
- Each expected tracked assignment has exactly one matching `CHARACTERS_ASSIGNED` record.
- No other initial record exists.

### Transition authority

- Collect accepted `SnakeCharmerDemonSwapApplied` envelopes in stream order.
- Require `state.snakeCharmerDemonSwaps.swaps` to match those payloads one-for-one and in order.
- Derive canonical transition facts using each envelope’s real `eventId`, `eventSequence` and validated payload.
- Expected processed IDs are exactly the derived fact IDs in event/seat order.
- `processedTransitionFactIds` must equal that list one-for-one.

For every canonical fact:

- if before role is tracked, exactly one matching historical tenure must be active at the previous revision and end at the next revision;
- if before role is nontracked, no tracked tenure may be active for that player/seat at the previous revision;
- if after role is tracked, exactly one transition-started tenure must exist with exact player, seat, role, acquired revision, fact ID, event ID, event sequence and previous/next revisions;
- if after role is nontracked, no successor tenure may start from that fact.

Reverse checks:

- every processed transition ID maps to exactly one real accepted canonical fact;
- every transition-started tenure maps to exactly one real accepted canonical fact;
- every tracked after-role fact maps to exactly one transition-started tenure;
- every tracked before-role fact maps to exactly one tenure ending at the fact’s next revision;
- no record exists outside the exact initial-or-transition-derived set.

Finally run `validateRoleTenureStateAgainstCurrentCharacterState`.

Any mismatch throws:

```ts
new DomainError("InvalidRoleTenureState", reason)
```

This gives bidirectional provenance without adding `endedBy`, event fields, a history field or a second tenure system.

## derivedStateCompatibility

This is strictly `DERIVED_STATE_EXPANSION`.

It does not change:

- `DomainEventPayloadByType`;
- `DomainEventType`;
- `SnakeCharmerDemonSwapAppliedPayload`;
- `CharactersAssignedPayload`;
- event version;
- persisted event shape;
- `GameState` fields;
- application commands;
- projections;
- ledgers.

Old accepted streams contain no serialized role-tenure events. Rebuilding such a stream under the new code deterministically derives a Dreamer tenure when the accepted initial assignment contains Dreamer.

Existing accepted streams without Dreamer continue producing the same original five-role records and IDs.

Current snapshot/cache state is not replay authority. If an old cache lacks the newly derived Dreamer record, canonical rebuild replaces it from the event stream; the cache must not override accepted history.

No migration event is required.

## hostileInputs

The implementation must fail closed for:

- sparse records, processed-ID or assignments arrays;
- extra or missing enumerable keys;
- unknown role;
- role case/whitespace aliases;
- noncanonical or unsafe seat/revision/sequence values;
- role-tenure ID cross-field mismatch;
- transition ID cross-field mismatch;
- duplicate assignment player, seat or role;
- duplicate tenure ID;
- duplicate processed transition ID;
- duplicate transition application;
- transition-started record without a real accepted event;
- processed ID without a real accepted transition;
- accepted transition missing its processed ID;
- tracked after-role transition missing its successor tenure;
- tracked before-role transition missing its ending;
- player/seat/role/revision/event provenance mismatch;
- two active records;
- overlapping intervals;
- current-role/active-tenure disagreement;
- state swap history differing from accepted event envelopes;
- caller-supplied facts presented as accepted history.

## productionFiles

Only these production files may change:

1. `packages/domain-core/src/seamstress.ts`
2. `packages/domain-core/src/role-tenure-replay.ts` — new, package-internal
3. `packages/domain-core/src/rebuild.ts`

No production modification is authorized in:

- `events.ts`
- `game-state.ts`
- `event-applier.ts`
- `domain-batch-semantics.ts`
- `event-stream-validator.ts`
- `snake-charmer.ts`
- application packages
- projection packages
- ledger modules
- Dreamer V1 modules
- workflow files

Maximum new production code:

- `seamstress.ts`: 430 lines
- `role-tenure-replay.ts`: 260 lines
- `rebuild.ts`: 20 lines
- total: 710 lines, hard ceiling 800

If implementation requires a fourth production module, an event/schema change, a new GameState field or more than 800 new production lines, stop with `HUMAN_BLOCKED`.

## testFiles

Authorized test files:

1. `packages/domain-core/src/seamstress.test.ts`
2. `packages/domain-core/src/rebuild.test.ts`
3. `packages/domain-core/src/role-tenure-replay.test.ts` — optional new package-internal test

No Dreamer opportunity, target, delivery, candidate, ledger or projection test may be added.

## tests

Maximum authority IDs: 30.

- `D19T-001`: authoritative tracked-role array, union compatibility alias and predicate contain exactly the six frozen roles.
- `D19T-002`: Dreamer formatter, parser and exact round-trip accept the canonical example.
- `D19T-003`: parser rejects case, whitespace, unknown-role and extra-segment aliases.
- `D19T-004`: parser/formatter reject seat aliases, seat 13, revision zero, leading zero and unsafe integers.
- `D19T-005`: the original five tracked roles retain byte-identical IDs and round trips.
- `D19T-006`: initial Dreamer assignment creates exactly one revision-1 Dreamer tenure.
- `D19T-007`: initial Dreamer tenure exactly binds player, seat, role and real assignment envelope ID/sequence.
- `D19T-008`: bootstrap excludes nontracked roles and preserves canonical seat order for the exact tracked subset.
- `D19T-009`: sparse or duplicate assignment input and duplicate initial tenure state fail closed.
- `D19T-010`: shared reconciler handles nontracked → Dreamer.
- `D19T-011`: shared reconciler handles Dreamer → nontracked.
- `D19T-012`: shared reconciler handles tracked → Dreamer.
- `D19T-013`: shared reconciler handles Dreamer → tracked.
- `D19T-014`: transition acquisition, ending and start provenance use exact previous/next revision and fact metadata.
- `D19T-015`: the same transition fact cannot be processed twice.
- `D19T-016`: accepted-history audit rejects an orphan processed transition ID.
- `D19T-017`: accepted-history audit rejects an orphan transition-started tenure.
- `D19T-018`: exact validation rejects duplicate IDs, duplicate active records and overlapping intervals.
- `D19T-019`: accepted-history audit rejects player, seat, role, revision, event ID or event-sequence provenance mismatch.
- `D19T-020`: current-character-state validation requires exact active tracked-role correspondence.
- `D19T-021`: initial Dreamer is active at revision 1 and a later tenure is inactive before acquisition.
- `D19T-022`: Dreamer becomes active at acquisition and inactive at and after ending.
- `D19T-023`: Dreamer continuous-range queries enforce both interval boundaries.
- `D19T-024`: unique active lookup returns undefined for none and fails closed for duplicate matches.
- `D19T-025`: an old accepted stream with initial Dreamer rebuilds with deterministic Dreamer derived tenure without payload migration.
- `D19T-026`: real accepted Snake Charmer history retains exact processed-ID and transition provenance reconstruction.
- `D19T-027`: a legacy accepted stream without serialized Dreamer tenure remains replayable; derived state is rebuilt rather than rejected.
- `D19T-028`: Seamstress bootstrap, transition, ability-instance and entitlement behavior remains unchanged apart from the additional unrelated Dreamer record.
- `D19T-029`: Cerenovus, Mathematician, Philosopher and Vortox tenure IDs, bootstrap, transitions and queries remain unchanged.
- `D19T-030`: full replay is deterministic on Ubuntu and Windows; forbidden scans and all full gates pass.

`D19T-010` through `D19T-013` are pure reconciliation contract tests. They do not establish a currently reachable accepted Dreamer-changing command. `D19T-016`, `D19T-017`, `D19T-019`, `D19T-025`, `D19T-026` and `D19T-027` must use the accepted-event-stream audit boundary and must not inject transition facts as history authority.

## implementationOrder

1. Add the authoritative role array, precise type and compatibility alias.
2. Route predicate, formatter, parser, record type and bootstrap through that authority.
3. Harden safe-integer checks and exact bootstrap input validation.
4. Add Dreamer grammar/bootstrap tests and update the existing assertion that currently treats Dreamer as invalid.
5. Harden transition application and interval overlap/duplicate handling.
6. Add exact state and current-character-state validators.
7. Add the unique active-tenure query.
8. Add the internal accepted-history auditor.
9. Call the auditor once at the end of `rebuildGameState`.
10. Add hostile provenance and legacy replay tests.
11. Run Seamstress and rebuild focused tests.
12. Run all quality gates and forbidden scans.
13. Update `docs/rules/ROLE_COVERAGE_MATRIX.md` only during accepted implementation closeout, keeping Dreamer at `SKELETON`.

## forbiddenScans

Before implementation freeze, verify:

- no modified event payload or event type;
- no modified event version;
- no new `GameState` field;
- no second tenure state;
- no Dreamer-specific tenure query;
- no application command behavior change;
- no projection change;
- no ledger change;
- no Dreamer opportunity, target, candidate or delivery;
- no Vortox or impairment behavior;
- no Philosopher-gained Dreamer;
- no Pit-Hag, Barber or other new character-change producer;
- no raw `JSON.stringify` semantic comparison;
- no `localeCompare` or `Intl.Collator`;
- no `Math.random`;
- no `Date.now` ID;
- no random UUID;
- no `skip`, `only` or `todo`;
- no increased timeout;
- no workflow change;
- no production file outside the three-file allowlist;
- no more than 800 added production lines.

## explicitOutOfScope

- Dreamer V2 opportunity;
- Dreamer target and target validation;
- Dreamer information or delivery;
- GOOD/EVIL candidate resolution;
- Dreamer ledger facts;
- Dreamer projection;
- Dreamer ability effectiveness;
- drunk, poisoned or Vortox evaluation;
- Storyteller false-role choice;
- Philosopher-gained Dreamer;
- gained-ability tenure;
- new character-change commands, events or producers;
- Snake Charmer command expansion;
- Pit-Hag or Barber implementation;
- alignment-history implementation;
- event payload changes;
- new event types;
- new GameState fields;
- second tenure system;
- general character-history refactor;
- first-night completion;
- DAY;
- 2B19A1;
- 2B19A2;
- 2B19A3;
- 2B19B;
- Phase 2C.

## completionCriteria

Implementation is complete only when:

1. The independent reviewer returns `RULE_DESIGN_PASS` before implementation begins.
2. The tracked role domain is exactly the frozen six-role set.
3. Naming scheme B preserves existing imports and state fields.
4. Dreamer ID grammar, initial bootstrap and shared transition reconciliation pass.
5. Exact state validation rejects duplicate, overlap and malformed state.
6. Accepted-history audit proves both directions:
   - every real transition is processed exactly once and has every required tenure effect;
   - every processed ID and transition-started tenure has one real accepted source event.
7. Current character state and active tenure agree exactly.
8. Old accepted streams replay without event migration.
9. No event payload, event type or GameState schema changes.
10. Production changes remain within the three-file allowlist and 800-line ceiling.
11. No Dreamer opportunity/delivery behavior is present.
12. `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage` and `git diff --check` pass.
13. Ubuntu test/coverage and Windows deterministic CI pass for the frozen feature HEAD.
14. Dreamer remains `SKELETON`; coverage label for this Slice is `FOUNDATION`.
15. 2B19A1 remains unstarted.

## coverageStatus

`FOUNDATION`

This status means only that accepted history can deterministically derive and validate base Dreamer role-tenure identity within the existing shared infrastructure. It does not implement Dreamer’s ability and does not advance Dreamer to `PARTIAL` or `COMPLETE`.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_1
