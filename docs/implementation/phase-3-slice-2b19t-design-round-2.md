# Phase 3 Slice 2B19T Design Round 2 — Canonical Dreamer Role-Tenure Prerequisite

## metadata

- sliceId: `2B19T`
- title: `Canonical Dreamer Role-Tenure Prerequisite`
- authorization: `USER_AUTHORIZED_2B19T_DESIGN_ROUND_2_CONTRACT_CORRECTION`
- parentDesign: `docs/implementation/phase-3-slice-2b19t-design.md`
- parentDesignSha256: `0eca3f5d67fb1407b4ba9b0f27ef2914e57329f864b72e6a1effe49fff3f632a`
- parentReview: `docs/implementation/phase-3-slice-2b19t-design-review-round-1.md`
- ruleEvidence: `docs/rules/evidence/2B19T.md`
- ruleEvidenceSha256: `b8c8b858ee3a7fb7fc141a1d28a0b385cf17111947caa397d569f9b79041185d`
- ruleVerdict: `RULE_READY`
- designRound: `2 / 2`
- implementationClassification: `DERIVED_STATE_EXPANSION`
- sliceCoverage: `FOUNDATION`
- dreamerRoleCoverage: `PARTIAL`
- DreamerRoleCoverageAfterSlice: `PARTIAL`
- ruleSemanticsChanged: `false`
- implementationAuthorizedByThisDocument: `false`
- requiredNextGate: `independent RULE_DESIGN_PASS`
- maxDesignRounds: `2`
- maxRepairRounds: `2`

## authorityAndCoverageClarification

This document is the complete, standalone and sole implementation authority for Slice `2B19T`. It is not an erratum or addendum and does not require the implementer to recover contracts from the Round 1 design.

The coverage contracts are distinct:

- **2B19T Slice覆盖等级：`FOUNDATION`**
- **Dreamer角色覆盖状态：`PARTIAL`（保持不变）**

The accepted Dreamer row already includes partial V1 target choice, GOOD/EVIL information delivery, represented impairment behavior, deterministic false-role policy and historical private projection. This Slice must not remove, downgrade or rewrite those accepted facts.

`FOUNDATION` describes only this Slice’s canonical role-tenure prerequisite. It is not a role status in `docs/rules/ROLE_COVERAGE_MATRIX.md`.

The Dreamer V2 opportunity prerequisite remains unimplemented. No change to `docs/rules/USER_OVERRIDES.md` is authorized or required. This clarification is not a BOTC rule override.

## scope

This Slice adds `dreamer` to the existing shared canonical role-tenure derived state and implements only:

1. One authoritative tracked-role domain.
2. Canonical Dreamer tenure ID formatting and parsing.
3. Initial Dreamer tenure derived from the accepted `CharactersAssigned` envelope.
4. Shared reconciliation when a real canonical character-transition fact has Dreamer in its before or after role.
5. Unique active-tenure and continuous-tenure queries.
6. Exact hostile runtime validation of raw role-tenure state.
7. Current-character/active-tenure consistency validation.
8. Accepted-event-stream provenance audit and deterministic replay.
9. Compatibility regressions for the five previously tracked roles.

This Slice does not add a character-change producer. Accepted production currently has only `SnakeCharmerDemonSwapApplied` as a concrete character-changing event. Its currently supported legal paths do not independently change a player into or out of Dreamer.

Dreamer transition unit tests prove the shared reconciler contract only. They do not prove that a currently accepted command path can enter or leave Dreamer.

A transition becomes accepted-history authority only when it is derived from a validated accepted event envelope. A caller-supplied `RoleTenureTransitionFact` or test fixture is never accepted-history authority.

## existingArchitecture

There remains exactly one shared tenure system:

```text
GameState.seamstressRoleTenureState
  -> RoleTenureState.records
  -> RoleTenureState.processedTransitionFactIds
```

The legacy property and module names remain unchanged for compatibility. This state already serves Cerenovus, Mathematician, Philosopher, Seamstress and Vortox. Slice `2B19T` adds Dreamer to that same domain.

Canonical facts already available are:

- `GameState.assignment`, derived from `CharactersAssigned`;
- `GameState.currentCharacterState`;
- `GameState.snakeCharmerDemonSwaps`;
- accepted `CharactersAssigned` envelope metadata;
- accepted `SnakeCharmerDemonSwapApplied` envelope metadata and payloads.

`RoleTenureState` is derived state. It is not an event payload, not replay authority by itself and not a second character-history source.

## sourceTypeImports

The new and changed contracts use these existing repository types:

```ts
import type { CharacterAssignmentSet } from "./character-assignment.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { GameState } from "./game-state.js";
import type {
  EventId,
  PlayerId,
  RoleTenureId,
  RoleTenureTransitionFactId
} from "./ids.js";
import type { SeatNumber } from "./player-roster.js";
import type {
  RoleSetupSnapshot
} from "./setup-types.js";
```

No new branded ID type, event type or `GameState` type is introduced.

## authoritativeTrackedRoleDomain

Freeze this single authoritative domain in `packages/domain-core/src/seamstress.ts`:

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

The array order is frozen and test-visible. There must be no second tracked-role list, parser alternation or switch that can drift from it.

All of these use `CanonicalRoleTenureTrackedRoleId` or the compatibility alias:

- `RoleTenureRecord.roleId`;
- formatter input;
- parser result;
- runtime predicate;
- bootstrap filter;
- transition reconciliation;
- exact validator;
- current-state validator;
- active-tenure query;
- clone path;
- accepted-stream replay audit.

## exactDataTypes

Retain these exact shapes, changing only the authoritative role type:

```ts
export type RoleTenureStartFact =
  | {
      readonly kind: "CHARACTERS_ASSIGNED";
      readonly sourceEventId: EventId;
      readonly sourceEventSequence: number;
      readonly characterStateRevision: 1;
    }
  | {
      readonly kind: "ROLE_TENURE_TRANSITION";
      readonly transitionFactId: RoleTenureTransitionFactId;
      readonly sourceEventId: EventId;
      readonly sourceEventSequence: number;
      readonly previousCharacterStateRevision: number;
      readonly nextCharacterStateRevision: number;
    };

export type RoleTenureRecord = {
  readonly roleTenureId: RoleTenureId;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: CanonicalRoleTenureTrackedRoleId;
  readonly acquiredCharacterStateRevision: number;
  readonly endedCharacterStateRevision?: number;
  readonly startedBy: RoleTenureStartFact;
};

export type RoleTenureState = {
  readonly records: readonly RoleTenureRecord[];
  readonly processedTransitionFactIds:
    readonly RoleTenureTransitionFactId[];
};

export type RoleTenureTransitionFact = {
  readonly transitionFactId: RoleTenureTransitionFactId;
  readonly sourceEventId: EventId;
  readonly sourceEventSequence: number;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly previousCharacterStateRevision: number;
  readonly nextCharacterStateRevision: number;
  readonly beforeRole: RoleSetupSnapshot;
  readonly afterRole: RoleSetupSnapshot;
};

export type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };
```

No optional state keys, additional provenance fields or alternate record variants are authorized.

## namingCompatibility

Freeze naming scheme `B`:

- `CanonicalRoleTenureTrackedRoleId` is authoritative.
- `SeamstressRelevantRoleId` remains an exported compatibility alias.
- Existing imports of `SeamstressRelevantRoleId`, `RoleTenureState`, formatters, parsers, bootstrap, transition and query functions continue compiling.
- Do not rename `GameState.seamstressRoleTenureState`.
- Do not move the full tenure implementation out of `seamstress.ts`.
- `role-tenure-replay.ts` is package-internal and is not exported from `packages/domain-core/src/index.ts`.
- No unrelated Seamstress API rename is allowed.

## numericAndStringCanonicality

All canonical sequence and revision numbers use:

```ts
const isPositiveSafeInteger = (
  value: unknown
): value is number =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  value > 0 &&
  !Object.is(value, -0);
```

A seat is canonical only when it is a safe integer from `1` through `12` and is not negative zero.

Player IDs and event IDs must be non-empty strings. Validation must reject empty or whitespace-only strings. Stable validation must not include hostile input values in error messages.

## roleTenureIdGrammar

The grammar remains:

```text
role-tenure-v1:seat-<NN>:role-<ROLE>:acquired-revision-<R>
```

Constraints:

- `NN` is exactly `01` through `12`.
- `ROLE` is exactly one value in `CANONICAL_ROLE_TENURE_TRACKED_ROLE_IDS`.
- `R` is a positive safe integer.
- `R` has no leading zero.
- No spaces, aliases, case variants or extra segments are accepted.
- Formatter and parser exact-round-trip.
- Existing IDs for the original five roles remain byte-for-byte unchanged.

Canonical Dreamer example:

```text
role-tenure-v1:seat-03:role-dreamer:acquired-revision-1
```

Freeze signatures:

```ts
export const formatRoleTenureId = (input: {
  readonly seatNumber: SeatNumber;
  readonly roleId: CanonicalRoleTenureTrackedRoleId;
  readonly acquiredCharacterStateRevision: number;
}): RoleTenureId;

export type ParseRoleTenureIdResult =
  | {
      readonly valid: true;
      readonly seatNumber: SeatNumber;
      readonly roleId: CanonicalRoleTenureTrackedRoleId;
      readonly acquiredCharacterStateRevision: number;
    }
  | {
      readonly valid: false;
      readonly reason: string;
    };

export const parseRoleTenureId = (
  value: unknown
): ParseRoleTenureIdResult;
```

The parser captures the lexical role segment generically and then calls `isCanonicalRoleTenureTrackedRoleId`. It must not embed a second six-role regular-expression alternation.

Direct ID input, grammar, formatter/parser failure and direct ID cross-field mismatch belong to `InvalidRoleTenureId`.

Required rejection examples:

```text
role-tenure-v1:seat-3:role-dreamer:acquired-revision-1
role-tenure-v1:seat-13:role-dreamer:acquired-revision-1
role-tenure-v1:seat-03:role-Dreamer:acquired-revision-1
role-tenure-v1:seat-03:role-dreamer :acquired-revision-1
role-tenure-v1:seat-03:role-dreamer:acquired-revision-01
role-tenure-v1:seat-03:role-unknown:acquired-revision-1
role-tenure-v1:seat-03:role-dreamer:acquired-revision-1:extra
```

## transitionFactIdGrammar

Retain:

```text
role-tenure-transition-v1:
event-sequence-<S>:
seat-<NN>:
next-revision-<R>
```

Freeze existing signatures:

```ts
export const formatRoleTenureTransitionFactId = (input: {
  readonly sourceEventSequence: number;
  readonly seatNumber: SeatNumber;
  readonly nextCharacterStateRevision: number;
}): RoleTenureTransitionFactId;

export type ParseRoleTenureTransitionFactIdResult =
  | {
      readonly valid: true;
      readonly sourceEventSequence: number;
      readonly seatNumber: SeatNumber;
      readonly nextCharacterStateRevision: number;
    }
  | {
      readonly valid: false;
      readonly reason: string;
    };

export const parseRoleTenureTransitionFactId = (
  value: unknown
): ParseRoleTenureTransitionFactIdResult;
```

Event sequence and revision must be positive safe integers without leading zero. Fact ID failures remain `InvalidRoleTenureTransitionFact`, not `InvalidRoleTenureState`.

## errorCodeContract

In `packages/domain-core/src/errors.ts`, add exactly this member to `DomainErrorCode`:

```ts
| "InvalidRoleTenureState"
```

No type assertion, string cast or widening of `DomainError.code` is permitted.

Responsibilities are frozen as follows.

### InvalidRoleTenureId

Used only for:

- direct role-tenure ID input;
- role-tenure ID grammar;
- formatter/parser assertion boundary;
- direct role-tenure ID cross-field mismatch.

When an invalid ID is encountered only as part of an already hostile aggregate `RoleTenureState`, `validateRoleTenureStateExact` returns an invalid result and aggregate callers throw `InvalidRoleTenureState`. This does not reclassify the direct ID API.

### InvalidRoleTenureTransitionFact

Used only for:

- transition fact exact shape;
- transition fact ID;
- before/after role snapshots;
- source event ID and sequence;
- previous/next revisions;
- unchanged before/after role;
- transition payload internal invariants.

It must not be used for malformed state, duplicate active state, replay mismatch or orphan state.

### InvalidRoleTenureState

Used for:

- malformed raw `RoleTenureState`;
- undefined state at canonical transition/query/audit boundaries;
- sparse records or processed IDs;
- extra, missing or symbol keys;
- duplicate tenure IDs;
- duplicate processed transition IDs;
- overlapping tenures;
- duplicate active tenures;
- orphan transition-started tenures;
- orphan processed transition IDs;
- current-character/active-tenure mismatch;
- accepted-stream replay audit mismatch;
- multiple matches in active-tenure query;
- transition input state invalidity;
- transition/state cross-link invalidity;
- transition result state invalidity.

## stableStateReasons

Any `InvalidRoleTenureState` message is one of these stable literals. It must not serialize or interpolate hostile input:

```ts
const INVALID_ROLE_TENURE_STATE_REASONS = {
  rawCanonicalData:
    "Role tenure state must be canonical data",
  rawShape:
    "Role tenure state must have exact runtime shape",
  records:
    "Role tenure records must be a dense canonical array",
  processedIds:
    "Processed role tenure transition IDs must be a dense canonical array",
  recordShape:
    "Role tenure record must have exact runtime shape",
  startFactShape:
    "Role tenure start fact must have exact runtime shape",
  recordFields:
    "Role tenure record fields are invalid",
  startFactFields:
    "Role tenure start fact fields are invalid",
  recordId:
    "Role tenure record ID does not match its fields",
  transitionStart:
    "Transition-started role tenure provenance is invalid",
  duplicateTenureId:
    "Role tenure IDs must be unique",
  duplicateProcessedId:
    "Processed role tenure transition IDs must be unique",
  orphanTransitionStart:
    "Transition-started role tenure must reference one processed transition ID",
  recordOrder:
    "Role tenure records are not in canonical order",
  processedOrder:
    "Processed role tenure transition IDs are not in canonical order",
  playerSeat:
    "Role tenure player and seat identity is inconsistent",
  interval:
    "Role tenure interval is invalid",
  overlap:
    "Role tenure intervals must not overlap",
  duplicateActive:
    "Role tenure state contains multiple active tenures",
  bootstrapInput:
    "Role tenure bootstrap input is invalid",
  bootstrapResult:
    "Role tenure bootstrap result is invalid",
  transitionInput:
    "Role tenure transition input state is invalid",
  transitionAlreadyProcessed:
    "Role tenure transition was already processed",
  transitionBefore:
    "Role tenure transition before-state does not match canonical tenure state",
  transitionSuccessor:
    "Role tenure transition successor conflicts with canonical tenure state",
  transitionResult:
    "Role tenure transition result state is invalid",
  queryInput:
    "Role tenure active query input is invalid",
  queryMultiple:
    "Role tenure active query matched multiple records",
  currentState:
    "Role tenure state does not match current character state",
  replayMissing:
    "Rebuilt canonical role tenure state is missing",
  replayAssignment:
    "Rebuilt role tenure assignment authority does not match accepted history",
  replayTransitions:
    "Rebuilt role tenure transitions do not match accepted history",
  replayProcessed:
    "Rebuilt processed role tenure transition IDs do not match accepted history",
  replayRecords:
    "Rebuilt role tenure records do not match accepted history",
  replayCurrent:
    "Rebuilt role tenure state does not match current character state"
} as const;
```

Equivalent line wrapping is allowed; wording and classification are not.

## validateRoleTenureStateExact

Add:

```ts
export const validateRoleTenureStateExact = (
  value: unknown
): ValidationResult;
```

### Raw hostile boundary

Validation order is frozen:

1. Call `isCanonicalDataValue(value)` from `canonical-data.ts`.
2. If false, return `rawCanonicalData`.
3. Require a plain non-array object.
4. Require exact top-level keys:
   - `records`
   - `processedTransitionFactIds`
5. Only after steps 1–4 may fields be read semantically.

`isCanonicalDataValue` is required because it rejects, without invoking property getters:

- undefined;
- functions and symbols;
- non-safe integers and negative zero;
- arrays with holes;
- symbol keys;
- accessors;
- nonplain prototypes;
- cycles;
- transparent Proxy values;
- revoked Proxy values.

No replacement based only on `Object.keys`, spread, destructuring or raw `JSON.stringify` is acceptable.

Getter invocation count must remain zero.

### Record exact shapes

An open record has exactly:

```text
acquiredCharacterStateRevision
playerId
roleId
roleTenureId
seatNumber
startedBy
```

A closed record has exactly the same keys plus:

```text
endedCharacterStateRevision
```

A `CHARACTERS_ASSIGNED` start fact has exactly:

```text
characterStateRevision
kind
sourceEventId
sourceEventSequence
```

A `ROLE_TENURE_TRANSITION` start fact has exactly:

```text
kind
nextCharacterStateRevision
previousCharacterStateRevision
sourceEventId
sourceEventSequence
transitionFactId
```

### Field and cross-field validation

The validator requires:

1. `playerId` is a non-empty string.
2. `seatNumber` is canonical `1..12`.
3. `roleId` passes the authoritative tracked-role predicate.
4. Acquisition is a positive safe integer.
5. Ending, when present, is a positive safe integer strictly greater than acquisition.
6. `roleTenureId` parses canonically.
7. Parsed seat, role and acquisition exactly equal the record fields.
8. Source event ID is non-empty.
9. Source event sequence is a positive safe integer.
10. `CHARACTERS_ASSIGNED` records:
    - acquire at revision `1`;
    - have `characterStateRevision: 1`.
11. `ROLE_TENURE_TRANSITION` records:
    - have a canonical transition fact ID;
    - have `next = previous + 1`;
    - acquire at `next`;
    - fact ID sequence, seat and next revision equal provenance fields.
12. Role tenure IDs are unique.
13. Processed transition IDs are canonical and unique.
14. Every transition-started record references exactly one processed transition ID.
15. All records for one player use one seat.
16. All records for one seat use one player.
17. No intervals for the same player/seat overlap.
18. No two records are active for the same player/seat at the same revision.
19. Records are in canonical order.
20. Processed IDs are in canonical order.

State exact validation does not require every processed ID to create a successor record because tracked-to-untracked and nontracked-to-nontracked transitions legitimately create none. That reverse provenance check belongs to the accepted-stream auditor.

### Canonical ordering

Records are ordered by:

1. ascending `acquiredCharacterStateRevision`;
2. ascending numeric `seatNumber`.

A same-revision/same-seat tie is invalid topology and is rejected rather than locale-sorted.

Processed IDs are ordered by their parsed fields:

1. ascending `sourceEventSequence`;
2. ascending numeric `seatNumber`.

No `localeCompare`, `Intl.Collator` or environment locale is used.

Intervals are half-open:

```text
[acquiredCharacterStateRevision, endedCharacterStateRevision)
```

An open interval has no ending bound.

## cloneRoleTenureState

Retain:

```ts
export const cloneRoleTenureState = (
  state: RoleTenureState | undefined
): RoleTenureState;
```

Compatibility semantics may remain:

```text
undefined -> { records: [], processedTransitionFactIds: [] }
```

This helper is classified only as:

```text
CLONE_CONVENIENCE
```

It is never:

```text
CANONICAL_VALIDATION
```

Therefore:

- `applyRoleTenureTransitionFact` cannot use it before raw validation;
- `findUniqueActiveRoleTenure` cannot use it before raw validation;
- the replay auditor cannot use it to normalize missing or hostile state;
- cloning must never erase evidence before the canonical boundary evaluates it.

A clone contains new top-level arrays, new record objects and new `startedBy` objects.

## charactersAssignedBootstrap

Retain the sole bootstrap signature:

```ts
export const bootstrapRoleTenuresFromCharactersAssigned = (
  input: {
    readonly assignments: CharacterAssignmentSet;
    readonly sourceEventId: EventId;
    readonly sourceEventSequence: number;
  }
): RoleTenureState;
```

Execution order is frozen:

1. Validate the input object and assignment collection directly.
2. Require a dense assignment array.
3. Require every assignment to have exact keys:
   - `playerId`
   - `role`
   - `seatNumber`
4. Reuse `hasExactRoleSetupSnapshotShape`.
5. Reject invalid player IDs, seats and role snapshots.
6. Reject duplicate player IDs, seat numbers and role IDs.
7. Reject invalid source event ID or unsafe source sequence.
8. Filter using the single authoritative tracked-role predicate.
9. Sort tracked assignments by numeric seat.
10. Build records directly.
11. Build `processedTransitionFactIds: []`.
12. Call `validateRoleTenureStateExact` on the result.
13. Throw `DomainError("InvalidRoleTenureState", bootstrapResult)` if the result is invalid.
14. Return the validated result.

The bootstrap does not call `applyRoleTenureTransitionFact`.

It need not require twelve assignments in an isolated unit fixture. The accepted event-applier path continues to require the validated fixed twelve-player assignment.

For each tracked assignment, including Dreamer, create exactly:

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

Nontracked roles create no record.

## transitionFactValidation

Retain:

```ts
export const validateRoleTenureTransitionFact = (
  fact: unknown
): ValidationResult;
```

It must validate raw canonical data before field reads and then require the exact fact keys:

```text
afterRole
beforeRole
nextCharacterStateRevision
playerId
previousCharacterStateRevision
seatNumber
sourceEventId
sourceEventSequence
transitionFactId
```

It requires:

- exact before/after role snapshots;
- different before and after role IDs;
- canonical player and seat;
- non-empty event ID;
- positive safe event sequence;
- positive safe revisions;
- `next = previous + 1`;
- canonical fact ID;
- fact ID sequence, seat and next revision equal the fact fields.

Any failure at this boundary is `InvalidRoleTenureTransitionFact`.

## transitionAdapter

Retain:

```ts
export const roleTenureTransitionFactsFromSnakeCharmerDemonSwap = (
  input: {
    readonly eventId: EventId;
    readonly eventSequence: number;
    readonly payload: SnakeCharmerDemonSwapAppliedPayload;
  }
): readonly RoleTenureTransitionFact[];
```

It remains the sole accepted production adapter.

It:

- derives facts only from the validated accepted envelope and payload;
- emits a fact only where before and after role IDs differ;
- emits at most the source and target facts;
- sorts them by numeric seat;
- uses the real envelope event ID and sequence;
- introduces no caller-supplied authority.

This adapter demonstrates an accepted role-change provenance path. It must not be described as a current producer that can independently enter or leave Dreamer.

## applyRoleTenureTransitionFact

Retain:

```ts
export const applyRoleTenureTransitionFact = (
  state: RoleTenureState | undefined,
  fact: RoleTenureTransitionFact
): RoleTenureState;
```

For this canonical transition boundary:

```text
undefined = invalid
```

A canonical transition can occur only after `CharactersAssigned`. Bootstrap creates an exact empty `RoleTenureState` even when no tracked role was assigned. Missing the whole state therefore represents damaged canonical history.

Execution order is strictly frozen:

1. Run `validateRoleTenureTransitionFact(fact)`.
2. If invalid, throw:
   ```ts
   new DomainError(
     "InvalidRoleTenureTransitionFact",
     validation.reason
   )
   ```
3. Run `validateRoleTenureStateExact(state)` against the original raw value.
4. Do not clone, read `records`, search, filter or normalize before step 3 completes.
5. If invalid, throw:
   ```ts
   new DomainError(
     "InvalidRoleTenureState",
     "Role tenure transition input state is invalid"
   )
   ```
6. Call `cloneRoleTenureState(state)`.
7. Run `validateRoleTenureStateExact(clonedState)`.
8. If invalid, throw `InvalidRoleTenureState` with `transitionInput`.
9. Validate transition/state cross-links.
10. Mutate only newly created clone arrays and clone records.
11. Build the result.
12. Sort result records and processed IDs by the frozen canonical orders.
13. Run `validateRoleTenureStateExact(result)`.
14. If invalid, throw `InvalidRoleTenureState` with `transitionResult`.
15. Return the validated result.

The following ordering is forbidden:

```ts
const current = cloneRoleTenureState(state);
// raw validation later
```

### Transition/state cross-links

At `previousCharacterStateRevision = R` and `nextCharacterStateRevision = R + 1`:

- Find every tracked tenure for the fact’s player/seat active at `R`.
- If the before role is tracked, there must be exactly one active record and its role must equal `beforeRole.roleId`.
- If the before role is nontracked, there must be no active tracked record for that player/seat.
- The fact ID must not already be processed.
- A tracked successor ID must not already exist.
- A successor must not overlap another interval.
- Player and seat identity must remain consistent.
- Only the unique validated before record may be ended.
- The original raw state and input fact remain unmodified.

Cross-link failures are `InvalidRoleTenureState`, because the fact has already passed its own exact validation and the failure is its incompatibility with canonical state.

### Transition outcomes

For a validated fact:

- nontracked → Dreamer:
  - require no tracked tenure active at `R`;
  - create Dreamer tenure at `R + 1`.
- Dreamer → nontracked:
  - end the unique Dreamer tenure at `R + 1`;
  - create no successor.
- tracked → Dreamer:
  - end the unique before-role tenure at `R + 1`;
  - create Dreamer tenure at `R + 1`.
- Dreamer → tracked:
  - end Dreamer tenure at `R + 1`;
  - create the tracked successor at `R + 1`.
- nontracked → nontracked:
  - create no tenure;
  - still record the real transition fact exactly once.

A transition-started record is exactly:

```ts
{
  roleTenureId: nextId,
  playerId: fact.playerId,
  seatNumber: fact.seatNumber,
  roleId: fact.afterRole.roleId,
  acquiredCharacterStateRevision:
    fact.nextCharacterStateRevision,
  startedBy: {
    kind: "ROLE_TENURE_TRANSITION",
    transitionFactId: fact.transitionFactId,
    sourceEventId: fact.sourceEventId,
    sourceEventSequence: fact.sourceEventSequence,
    previousCharacterStateRevision:
      fact.previousCharacterStateRevision,
    nextCharacterStateRevision:
      fact.nextCharacterStateRevision
  }
}
```

## intervalQueries

Retain:

```ts
export const isRoleTenureActiveAt = (
  record: RoleTenureRecord,
  revision: number
): boolean;
```

It is true exactly when:

```text
acquired <= revision
and
ended is absent or revision < ended
```

Retain:

```ts
export const isRoleTenureContinuousAcross = (
  record: RoleTenureRecord,
  start: number,
  end: number
): boolean;
```

It is true exactly when:

- `start` and `end` are positive safe integers;
- `end >= start`;
- acquisition is at or before `start`;
- ending is absent or strictly after `end`.

## findUniqueActiveRoleTenure

Add:

```ts
export const findUniqueActiveRoleTenure = (input: {
  readonly state: RoleTenureState;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: CanonicalRoleTenureTrackedRoleId;
  readonly revision: number;
}): RoleTenureRecord | undefined;
```

Execution order is frozen:

1. Validate the query object and scalar inputs.
2. Require a canonical player ID, seat, tracked role and positive safe revision.
3. Run `validateRoleTenureStateExact(input.state)` on the original raw state.
4. Do not filter, search or clone before step 3.
5. Invalid raw state throws:
   ```ts
   new DomainError(
     "InvalidRoleTenureState",
     "Role tenure active query input is invalid"
   )
   ```
6. Search only after successful validation.
7. Zero matches returns `undefined`.
8. One match returns a deep clone of that record and `startedBy`.
9. More than one match throws:
   ```ts
   new DomainError(
     "InvalidRoleTenureState",
     "Role tenure active query matched multiple records"
   )
   ```

There is no Dreamer-specific active-tenure query.

## validateAgainstCurrentCharacterState

Add:

```ts
export const validateRoleTenureStateAgainstCurrentCharacterState =
  (input: {
    readonly roleTenures: unknown;
    readonly currentCharacterState:
      CurrentCharacterStateSet;
  }): ValidationResult;
```

It first exact-validates the raw tenure state.

It then requires:

1. Current revision is a positive safe integer.
2. Current entries are dense and have the accepted exact current-character shape.
3. No tenure acquisition or ending is later than current revision.
4. Every current tracked role has exactly one active tenure matching:
   - player;
   - seat;
   - role.
5. Every current nontracked role has no active tracked tenure.
6. Every active tenure maps to exactly one current entry with matching player, seat and role.
7. Dreamer follows exactly the same rules as the other tracked roles.

This validator proves snapshot consistency only. It does not prove accepted-envelope provenance.

## replayAuditor

Create the package-internal module:

```text
packages/domain-core/src/role-tenure-replay.ts
```

Do not export it from the package root.

Freeze:

```ts
export const assertRebuiltCanonicalRoleTenureState = (
  events: readonly AnyDomainEventEnvelope[],
  state: GameState
): void;
```

### Rebuild integration

`rebuildGameState` calls the auditor once after:

1. `validateDomainEventStream`;
2. all batch semantic validation;
3. all events have been applied;
4. the existing first-night ledger anchor audit.

Pre-assignment streams such as `[GameCreated]` remain supported. The rebuild call is guarded and invokes the tenure auditor when at least one tenure authority indicator exists:

- an accepted `CharactersAssigned` envelope;
- `state.assignment`;
- `state.currentCharacterState`;
- `state.seamstressRoleTenureState`.

If none exists, the audit is not invoked.

Once invoked, missing `state.seamstressRoleTenureState` is invalid. The auditor must not normalize it to empty.

### Raw-state order

The auditor strictly:

1. Checks `state.seamstressRoleTenureState !== undefined`.
2. Calls `validateRoleTenureStateExact` on that original raw value.
3. Does not clone, spread, normalize or search the raw state first.
4. Throws:
   ```ts
   new DomainError(
     "InvalidRoleTenureState",
     "Rebuilt canonical role tenure state is missing"
   )
   ```
   when absent.
5. Throws `InvalidRoleTenureState` with `rawShape` or the corresponding replay reason when invalid.

### Expected-state derivation

The auditor independently derives expected tenure state from accepted envelopes:

1. Find `CharactersAssigned` envelopes.
2. Require exactly one after the audit boundary is active.
3. Explicitly compare `state.assignment` to that envelope payload with canonical-data equality, not raw JSON serialization.
4. Bootstrap expected tenure state from:
   - the envelope assignments;
   - real envelope event ID;
   - real envelope event sequence.
5. Collect accepted `SnakeCharmerDemonSwapApplied` envelopes in stream order.
6. Explicitly compare `state.snakeCharmerDemonSwaps.swaps` to their payloads one-for-one and in order.
7. Derive transition facts through `roleTenureTransitionFactsFromSnakeCharmerDemonSwap`.
8. Apply those facts to the independently built expected state in event/seat order.
9. Convert any internally impossible derivation failure into stable `InvalidRoleTenureState` replay failure. It must not leak a fact error as the classification of an accepted-stream/state mismatch.

`sameCanonicalDataValue` may be used after exact canonical validation. Raw `JSON.stringify` comparison is forbidden.

### Bidirectional assignment audit

For every tracked initial assignment:

- exactly one `CHARACTERS_ASSIGNED` record exists;
- player, seat, role and acquisition revision match;
- tenure ID matches;
- source event ID and sequence match;
- no extra initial record exists.

Every actual `CHARACTERS_ASSIGNED` tenure record maps back to exactly one tracked accepted assignment.

### Bidirectional transition audit

For every canonical fact:

- its fact ID appears exactly once in processed IDs;
- tracked before role maps to exactly one historical tenure active at the previous revision and ending at the next revision;
- nontracked before role maps to no tracked active tenure at the previous revision;
- tracked after role maps to exactly one transition-started tenure with exact:
  - player;
  - seat;
  - role;
  - acquisition revision;
  - transition fact ID;
  - source event ID;
  - source event sequence;
  - previous revision;
  - next revision;
- nontracked after role creates no successor.

Reverse checks require:

- every processed ID maps to exactly one real canonical fact;
- every transition-started record maps to exactly one real canonical fact;
- every tracked after-role fact maps to exactly one successor;
- every tracked before-role fact maps to exactly one ending;
- no record exists outside the exact assignment-or-transition-derived set.

An orphan processed transition ID or orphan transition-started tenure throws `InvalidRoleTenureState`.

### Current-state audit

Finally:

1. Require current character state to exist.
2. Run `validateRoleTenureStateAgainstCurrentCharacterState`.
3. Require the actual tenure state and independently derived expected state to match explicitly, field by field and in canonical order.
4. Throw `InvalidRoleTenureState` for any mismatch.

The audit does not claim provenance for hypothetical Dreamer transitions that no accepted producer can currently create.

## hostileRuntimeValidation

The exact validator and all canonical consumers fail closed for at least:

- `undefined`;
- `null`;
- boolean, string, number, bigint, symbol and function primitives;
- array instead of object;
- nonplain prototype;
- extra top-level key;
- missing top-level key;
- symbol key;
- getter/accessor;
- transparent Proxy;
- revoked Proxy;
- cycle;
- sparse `records`;
- sparse `processedTransitionFactIds`;
- malformed record;
- malformed `startedBy`;
- duplicate tenure ID;
- duplicate processed transition ID;
- invalid player ID;
- invalid seat;
- unknown role;
- noncanonical role ID;
- unsafe revision;
- negative zero;
- invalid interval;
- overlap;
- duplicate active tenure;
- orphan transition-started record.

Getter invocation count is exactly zero.

`isCanonicalDataValue`, `isDenseCanonicalArray` and `sameCanonicalDataValue` from `canonical-data.ts` are reused where applicable. Raw `JSON.stringify` is forbidden.

## immutability

All exported mutating-looking helpers are immutable:

- bootstrap creates new arrays and records;
- transition application never changes raw state or fact;
- returned query records are clones;
- replay audit never changes events or state;
- state validation never normalizes input;
- canonical ordering is established on new arrays only.

A thrown transition leaves the original state unchanged.

## derivedStateCompatibility

This remains strictly `DERIVED_STATE_EXPANSION`.

It does not change:

- `DomainEventPayloadByType`;
- `DomainEventType`;
- `CharactersAssignedPayload`;
- `SnakeCharmerDemonSwapAppliedPayload`;
- event versions;
- persisted event shapes;
- `GameState` fields;
- application commands;
- projections;
- ledgers;
- accepted Dreamer V1 events.

Old accepted event streams contain no serialized role-tenure event. Rebuilding an old stream under the new implementation deterministically derives a Dreamer tenure when the initial assignment contains Dreamer.

Existing streams without Dreamer retain byte-identical IDs for the original five tracked roles.

A snapshot/cache without newly derived Dreamer tenure is not authority. Canonical rebuild replaces it from accepted events. No migration event is required.

## productionFileAllowlist

Exactly these four production files may change:

1. `packages/domain-core/src/seamstress.ts`
2. `packages/domain-core/src/role-tenure-replay.ts`
3. `packages/domain-core/src/rebuild.ts`
4. `packages/domain-core/src/errors.ts`

No fifth production file is authorized.

In particular, do not modify:

- `events.ts`;
- `game-state.ts`;
- `event-applier.ts`;
- `domain-batch-semantics.ts`;
- `event-stream-validator.ts`;
- `snake-charmer.ts`;
- `index.ts`;
- application packages;
- projection packages;
- ledger modules;
- Dreamer V1 modules;
- workflow files.

Maximum added production code across all four files is `800` lines. The `errors.ts` union addition is included in that limit.

Suggested non-authoritative allocation:

- `seamstress.ts`: at most `500` added lines;
- `role-tenure-replay.ts`: at most `270` added lines;
- `rebuild.ts`: at most `25` added lines;
- `errors.ts`: at most `5` added lines.

The aggregate `800`-line ceiling is authoritative.

If implementation needs a fifth production file, more than 800 added production lines, an event/schema change or a new `GameState` field, stop with `HUMAN_BLOCKED`.

## testFileAllowlist

Only these test files may be added or modified:

1. `packages/domain-core/src/seamstress.test.ts`
2. `packages/domain-core/src/rebuild.test.ts`
3. `packages/domain-core/src/role-tenure-replay.test.ts`

No Dreamer opportunity, target, information, candidate, ledger or projection test is authorized.

Documentation and required control/status files are not test files and remain governed by the controller workflow.

## frozenTestMatrix

Maximum Slice authority IDs: `47`.

### Existing Round 1 behavioral matrix

- `D19T-001`: tracked-role array, union alias and predicate contain exactly the frozen six roles.
- `D19T-002`: canonical Dreamer formatter/parser exact round-trip succeeds.
- `D19T-003`: case, whitespace, unknown-role and extra-segment aliases are rejected.
- `D19T-004`: seat aliases, seat 13, revision zero, leading zero, unsafe integers and negative zero are rejected.
- `D19T-005`: original five tracked-role IDs remain byte-identical and round-trip.
- `D19T-006`: initial Dreamer assignment creates exactly one revision-1 tenure.
- `D19T-007`: initial Dreamer tenure binds exact player, seat, role and real envelope ID/sequence.
- `D19T-008`: bootstrap excludes nontracked roles and preserves canonical tracked-subset seat order.
- `D19T-009`: sparse or duplicate assignment input fails closed.
- `D19T-010`: shared reconciler handles nontracked → Dreamer.
- `D19T-011`: shared reconciler handles Dreamer → nontracked.
- `D19T-012`: shared reconciler handles tracked → Dreamer.
- `D19T-013`: shared reconciler handles Dreamer → tracked.
- `D19T-014`: acquisition, ending and start provenance use exact previous/next revision and fact metadata.
- `D19T-015`: the same transition fact cannot be processed twice.
- `D19T-016`: accepted-history audit rejects an orphan processed transition ID with `InvalidRoleTenureState`.
- `D19T-017`: accepted-history audit rejects an orphan transition-started tenure with `InvalidRoleTenureState`.
- `D19T-018`: exact validation rejects duplicate IDs, duplicate active records and overlapping intervals.
- `D19T-019`: replay audit rejects player, seat, role, revision, event ID and sequence provenance mismatch.
- `D19T-020`: current-character validator requires exact active tracked-role correspondence.
- `D19T-021`: initial Dreamer is active at revision 1 and later tenure is inactive before acquisition.
- `D19T-022`: Dreamer becomes active at acquisition and inactive at and after ending.
- `D19T-023`: Dreamer continuous-range queries enforce both half-open interval boundaries.
- `D19T-024`: unique active lookup returns undefined for none, a clone for one and fails closed for duplicates.
- `D19T-025`: accepted stream with initial Dreamer rebuilds deterministic Dreamer tenure without payload migration.
- `D19T-026`: real accepted Snake Charmer history reconstructs exact processed IDs and transition provenance.
- `D19T-027`: legacy accepted stream without serialized Dreamer tenure remains replayable and rebuilds derived state.
- `D19T-028`: Seamstress bootstrap, transition, ability-instance and entitlement regressions remain unchanged except for the unrelated Dreamer record.
- `D19T-029`: Cerenovus, Mathematician, Philosopher and Vortox tenure IDs, bootstrap, transitions and queries remain unchanged.
- `D19T-030`: full replay is deterministic on Ubuntu and Windows; forbidden scans and full gates pass.

`D19T-010` through `D19T-013` are reconciler tests only and must not be reported as a reachable accepted Dreamer-changing producer.

`D19T-016`, `D19T-017`, `D19T-019`, `D19T-025`, `D19T-026` and `D19T-027` exercise the accepted-event-stream audit boundary and do not inject caller facts as history authority.

### Round 2 hostile and coverage additions

- `D19T-031`: raw undefined transition state is rejected before clone with `InvalidRoleTenureState`.
- `D19T-032`: raw extra top-level key is rejected and is not normalized away.
- `D19T-033`: sparse raw records array is rejected before any record search.
- `D19T-034`: sparse raw processed-ID array is rejected before any membership search.
- `D19T-035`: accessor/getter state is rejected with getter invocation count `0`.
- `D19T-036`: transparent Proxy state is rejected with `InvalidRoleTenureState`.
- `D19T-037`: revoked Proxy state is rejected with `InvalidRoleTenureState`.
- `D19T-038`: cyclic state is rejected with `InvalidRoleTenureState`.
- `D19T-039`: an error present only in raw shape is observed before clone and cannot be normalized by `cloneRoleTenureState`.
- `D19T-040`: a valid raw state produces a distinct valid deep clone; clone output is revalidated before cross-link processing.
- `D19T-041`: every successful transition returns an exact-valid post-mutation state, preserves the input, and any invalid resulting topology fails as `InvalidRoleTenureState`.
- `D19T-042`: duplicate active query matches throw `InvalidRoleTenureState`.
- `D19T-043`: replay orphan processed ID and orphan tenure failures use `InvalidRoleTenureState`.
- `D19T-044`: malformed transition fact still throws `InvalidRoleTenureTransitionFact` before state validation.
- `D19T-045`: malformed direct ID input/grammar still reports or throws `InvalidRoleTenureId` at the direct ID boundary.
- `D19T-046`: implementation closeout leaves the Dreamer matrix row overall status exactly `PARTIAL`.
- `D19T-047`: implementation status and PR traceability record Slice coverage exactly `FOUNDATION`.

`D19T-046` and `D19T-047` are repository acceptance assertions checked by the final reviewer and forbidden-scan gate; they do not authorize reading repository documentation from production domain code.

## roleCoverageMatrixUpdate

The implementation PR must update `docs/rules/ROLE_COVERAGE_MATRIX.md` without changing Dreamer’s overall `PARTIAL` status.

Allowed Dreamer row change:

- character-change interaction may become:
  `PARTIAL: canonical assignment-derived tenure foundation and shared transition reconciliation; no currently reachable Dreamer-changing producer`
- existing V1 base, first-night, impairment, Storyteller-policy and projection cells remain intact unless a wording-only merge is needed to preserve them.
- overall status remains `PARTIAL`.

The matrix must not claim:

- V2 opportunity;
- current producer reachability into/out of Dreamer;
- Vortox completion;
- full impairment evaluation;
- other-night behavior;
- Philosopher-gained Dreamer;
- `COMPLETE`.

## PRContract

The PR title is exactly:

```text
Phase 3 Slice 2B19T: add canonical Dreamer role tenure
```

The PR body contains these exact sections:

```text
Rule Evidence
Rule Claims Implemented
Explicitly Unsupported Rules
Rule Source Revisions
Rule-to-Test Traceability
```

Traceability maps every implemented claim to `D19T-001` through `D19T-047` as applicable.

The PR explicitly states:

- Slice coverage is `FOUNDATION`;
- Dreamer role coverage remains `PARTIAL`;
- role tenure is product derived state;
- current Snake Charmer production does not enter or leave Dreamer;
- no Dreamer opportunity or delivery is implemented;
- no event or `GameState` schema changed.

## implementationOrder

1. Add `InvalidRoleTenureState` to `DomainErrorCode`.
2. Add the authoritative tracked-role array, type, compatibility alias and predicate.
3. Route formatter, parser, records, bootstrap, transition and validation through that authority.
4. Harden positive safe integer and negative-zero validation.
5. Add `validateRoleTenureStateExact`.
6. Freeze `cloneRoleTenureState` as compatibility-only clone convenience.
7. Harden bootstrap and validate its result.
8. Harden transition fact validation.
9. Implement raw-before-clone transition state validation.
10. Implement transition/state cross-links and post-mutation validation.
11. Add exact current-character-state validation.
12. Add `findUniqueActiveRoleTenure`.
13. Add package-internal accepted-stream auditor.
14. Integrate the guarded final rebuild audit.
15. Add the full frozen test matrix.
16. Update the Dreamer matrix row while retaining overall `PARTIAL`.
17. Add implementation status and PR traceability.
18. Run focused and full gates.
19. Freeze feature HEAD before independent final review.

## forbiddenScans

Before feature freeze verify:

- production files are exactly within the four-file allowlist;
- added production code is at most 800 lines;
- no event payload change;
- no new event type;
- no event version change;
- no new `GameState` field;
- no second tenure state;
- no Dreamer-specific tenure query;
- no application command behavior change;
- no projection change;
- no ledger change;
- no Dreamer opportunity;
- no Dreamer target or candidate;
- no Dreamer delivery;
- no Vortox or impairment-information behavior;
- no Philosopher-gained Dreamer;
- no new Pit-Hag, Barber or character-change producer;
- no raw `JSON.stringify`;
- no `localeCompare`;
- no `Intl.Collator`;
- no `Math.random`;
- no `Date.now` canonical ID;
- no random UUID;
- no `skip`, `only` or `todo`;
- no timeout increase;
- no workflow change;
- no Dreamer overall coverage downgrade;
- no start of `2B19A1`;
- no start of Phase `2C`.

## explicitOutOfScope

- Dreamer V2 opportunity;
- Dreamer target or target validation;
- Dreamer information delivery;
- GOOD/EVIL candidate resolution;
- Dreamer ledger fact;
- Dreamer projection;
- Dreamer ability effectiveness;
- drunk evaluation;
- poisoned evaluation;
- Vortox evaluation;
- Storyteller false-role selection;
- Philosopher-gained Dreamer;
- gained-ability tenure;
- new character-change commands;
- new character-change events;
- new character-change producers;
- Snake Charmer command expansion;
- Pit-Hag implementation;
- Barber implementation;
- alignment-history implementation;
- event payload changes;
- new event types;
- event version changes;
- new `GameState` fields;
- second tenure system;
- general character-history refactor;
- first-night completion;
- DAY;
- `2B19A1`;
- `2B19A2`;
- `2B19A3`;
- `2B19B`;
- Phase `2C`.

## qualityGates

Required local gates:

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
git diff --check
```

Required focused tests include all authorized role-tenure and rebuild test files.

The frozen feature HEAD must have:

- successful push CI;
- successful PR CI;
- Ubuntu success;
- Windows success;
- clean worktree;
- local branch equals remote branch equals PR HEAD.

No passing review remains valid after a new commit.

## finalReviewGate

After final feature freeze, one independent read-only reviewer returns one complete report containing:

- `reviewedPR`;
- `reviewedHead`;
- `reviewTimestamp`;
- `reviewScope`;
- `productionFilesReviewed`;
- `testFilesReviewed`;
- `ruleEvidenceReviewed`;
- `findings`;
- `codeVerdict`;
- `ruleVerdict`;
- `remainingBlockers`.

Merge requires exactly:

```text
CODE_REVIEW_PASS
RULE_REVIEW_PASS
remainingBlockers = []
```

Both complete verbatim GitHub audit comments must be published, re-read and verified against the current frozen PR HEAD.

At most two repair rounds are allowed.

## designReviewChecklist

The independent Round 2 reviewer must confirm all of these:

1. Dreamer overall role coverage remains `PARTIAL`.
2. Slice coverage is `FOUNDATION`.
3. The design does not require an overall Dreamer downgrade.
4. `errors.ts` is the authorized fourth production file.
5. `InvalidRoleTenureState` enters the official union.
6. The three error-code responsibilities are disjoint and frozen.
7. Raw state is validated before clone, search or mutation.
8. Undefined raw transition/query/audit state is rejected.
9. Clone output is revalidated.
10. Post-mutation state is revalidated.
11. Clone convenience is not canonical validation.
12. Replay audit validates raw state before clone/normalization.
13. Dreamer initial tenure is assignment-derived.
14. Accepted stream is sufficient to audit currently real Snake Charmer transitions.
15. The design does not claim a current producer can enter or leave Dreamer.
16. No event or `GameState` schema changes.
17. No second tenure system.
18. Four production files and 800 added production lines remain hard limits.
19. Hostile canonical-data cases and getter-zero behavior are directly tested.
20. Error-code regression tests preserve malformed fact and direct ID classifications.
21. Coverage matrix remains `PARTIAL`.
22. `2B19A1` and Phase `2C` remain unstarted.

This is the final design round. If the independent result is not `RULE_DESIGN_PASS`, set `implementationAuthorized=false`, enter `HUMAN_BLOCKED` and do not create a Round 3.

## completionCriteria

Implementation is complete only when:

1. Independent Round 2 review returns `RULE_DESIGN_PASS` before branch creation or production/test edits.
2. The tracked-role domain is exactly the frozen six-role set.
3. Naming scheme `B` preserves accepted imports and state fields.
4. Dreamer ID grammar, initial bootstrap and shared reconciliation pass.
5. Raw hostile state is rejected before clone/search/mutation.
6. Undefined canonical transition/query/audit state is rejected.
7. Clone and post-mutation results are revalidated.
8. Exact state validation rejects malformed, duplicate, orphan and overlapping state.
9. Accepted-history audit proves both directions between events, processed IDs and records.
10. Current character state and active tenure agree exactly.
11. Old accepted streams replay without event migration.
12. No event payload, event type, event version or `GameState` field changes.
13. Production changes remain within exactly four files and 800 added lines.
14. No Dreamer opportunity, target, delivery, candidate, ledger or projection behavior is added.
15. Full local and frozen-head cross-platform CI gates pass.
16. Final independent review returns both required pass verdicts with no blocker.
17. The Dreamer role matrix remains `PARTIAL`.
18. Slice status is `FOUNDATION`.
19. `2B19A1` remains unstarted.
20. Phase `2C` remains unstarted.

## stopConditions

Immediately stop with `HUMAN_BLOCKED` if:

- Round 2 review is not `RULE_DESIGN_PASS`;
- a third design round would be required;
- a fifth production file is required;
- more than 800 added production lines are required;
- an event or `GameState` schema change is required;
- current accepted history is insufficient for a claimed provenance check;
- a current producer would need to be expanded to enter or leave Dreamer;
- the Dreamer role status would need to move away from `PARTIAL`;
- a repeated exact-head infrastructure failure reaches the controller’s authorized stop condition;
- either final review pass verdict is unavailable after the repair budget.

## coverageStatus

`FOUNDATION`

This status means only that accepted history can deterministically derive, validate and audit base Dreamer role-tenure identity inside the existing shared tenure infrastructure.

Dreamer’s authoritative overall repository coverage remains `PARTIAL`. Dreamer V2 opportunity remains unimplemented.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_2
