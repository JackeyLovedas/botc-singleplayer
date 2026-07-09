# Phase 3 Slice 2B10 Status: Base Snake Charmer Action And Effectiveness Gate

## Status

Implemented on branch `phase-3/base-snake-charmer-effectiveness`.

PR #11 was merged before this slice with merge commit `faaf87fcf56e46cc45f0f6316e24b19f6e0a39b7` and tagged as `phase-3-slice-2b9-snake-charmer-demon-hit-swap`.

## Scope Delivered

- Enabled base `SNAKE_CHARMER_ACTION` opportunities for the in-play `snake_charmer` role task.
- Preserved Philosopher-gained `SNAKE_CHARMER_ACTION` opportunity IDs and behavior.
- Extended `SubmitSnakeCharmerAction` to accept both base `ROLE` source tasks and Philosopher-gained source tasks.
- Added `evaluateSnakeCharmerEffectiveness(...)` for source DRUNK/POISONED gating.
- Added `SnakeCharmerIneffectiveResolved` as the canonical event for an impaired Snake Charmer source.
- Added `ScheduledTaskSettled.outcomeType = SNAKE_CHARMER_INEFFECTIVE`.
- Kept `SnakeCharmerTargetChosen` as a safe target-choice fact even when the source is ineffective.
- Prevented no-swap and demon-hit mechanical outcomes when the source is impaired.
- Preserved `assignment` and `currentCharacterState` for ineffective settlements.
- Kept private knowledge projections free of Snake Charmer action, target, swap, poison, and ineffective internals.

## Base Snake Charmer Action

Base first-night Snake Charmer tasks now create opportunities with:

```text
first-night-v1:SNAKE_CHARMER_ACTION:seat-<NN>:opportunity-01
```

The existing Philosopher-gained opportunity ID remains:

```text
first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-<NN>:from-snake_charmer:opportunity-01
```

Both opportunities expose the same legal player-facing decision shape:

```text
kind = CHOOSE_PLAYER
targetSchema = ANY_LIVING_PLAYER
```

The opportunity payload does not expose target role, alignment, demon status, swap status, or effectiveness outcome.

## SubmitSnakeCharmerAction Source Support

`SubmitSnakeCharmerAction` now validates two source forms:

```text
source.kind = ROLE
source.role.roleId = snake_charmer
```

and:

```text
source.kind = PHILOSOPHER_GAINED_ABILITY
source.sourceRole.roleId = philosopher
source.chosenRole.roleId = snake_charmer
```

Both paths require the current source player, seat, role snapshot, and `currentCharacterState.revision` to match the open action opportunity.

## Effectiveness Gate

Snake Charmer effectiveness is evaluated after `SnakeCharmerTargetChosen` and before target mechanical settlement.

The first gate version treats the source as ineffective when an active impairment exists for:

```text
affectedPlayerId = sourcePlayerId
kind = DRUNK | POISONED
```

If multiple matching impairments exist, the lowest `impairmentId` in stable string order wins.

The gate maps:

```text
DRUNK    -> SOURCE_DRUNK
POISONED -> SOURCE_POISONED
```

## SnakeCharmerIneffectiveResolved

An impaired Snake Charmer source produces this atomic batch:

```text
SnakeCharmerTargetChosen
SnakeCharmerIneffectiveResolved
ScheduledTaskSettled
```

`SnakeCharmerIneffectiveResolved` records:

```text
taskId
taskType = SNAKE_CHARMER_ACTION
opportunityId
sourcePlayerId
sourceSeatNumber
sourceCharacterStateRevision
targetPlayerId
targetSeatNumber
outcomeType = SOURCE_IMPAIRED_NO_EFFECT
reason = SOURCE_DRUNK | SOURCE_POISONED
sourceImpairmentId
sourceImpairmentKind = DRUNK | POISONED
```

It does not include target role, target alignment, target character type, `isDemon`, or `willSwap`.

## Ineffective Settlement

The ineffective path settles with:

```text
taskType = SNAKE_CHARMER_ACTION
outcomeType = SNAKE_CHARMER_INEFFECTIVE
characterStateRevision = sourceCharacterStateRevision
```

The ineffective path does not:

- create `SnakeCharmerDemonSwapApplied`;
- create `AbilityImpairmentApplied`;
- mutate `currentCharacterState`;
- mutate `assignment`;
- alter historical setup or task-plan facts.

## Replay And Batch Semantics

Replay accepts exactly:

```text
SnakeCharmerTargetChosen
SnakeCharmerIneffectiveResolved
ScheduledTaskSettled
```

The batch must share one `batchId`, one `commandId`, one `gameVersion`, one rules baseline, and consecutive event sequences.

Replay rejects no-swap and demon-hit mechanical batches when the source is impaired. The impaired source must use the ineffective outcome.

## Projection Boundary

Player and AI private knowledge projections do not expose:

```text
SnakeCharmerTargetChosen
SnakeCharmerNoSwapResolved
SnakeCharmerDemonSwapApplied
SnakeCharmerIneffectiveResolved
SOURCE_IMPAIRED_NO_EFFECT
SOURCE_DRUNK
SOURCE_POISONED
targetPlayerId
opportunityId
taskId
sourceImpairmentId
```

Team knowledge is still projected only from delivered `MINION_INFO` and `DEMON_INFO` facts.

## Golden Behavior

- Golden base task count remains six.
- Golden base task order is unchanged.
- Philosopher-gained Snake Charmer still inserts before `MINION_INFO`.
- Base Snake Charmer appears in the existing base task order after `MINION_INFO` and `DEMON_INFO`.
- Base effective non-Demon target uses `SNAKE_CHARMER_NON_DEMON_NO_SWAP`.
- Base effective Demon target uses `SNAKE_CHARMER_DEMON_HIT_SWAP`.
- Source DRUNK or POISONED uses `SNAKE_CHARMER_INEFFECTIVE`.

## Out Of Scope

- No drunk or poison duration expiry.
- No broader drunk/poison rule engine.
- No Mathematician interaction.
- No Snake Charmer AI target decision.
- No UI.
- No Electron.
- No SQLite adapter.
- No first-night end or phase transition.
- No Slice 2B11 work.

## Local Quality Gates

Passed locally:

```bash
pnpm typecheck
pnpm test          # 501 passed
```

Full lint and coverage were run before PR creation.

## CI

Expected CI gates:

- Ubuntu `validate`: pass.
- Windows deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice/snake-charmer: pass.

## Remaining Blockers

None known for Slice 2B10 implementation review.

## Next Slice

Suggested next slice after review and merge: Slice 2B11 should continue first-night role settlement only after PR review. Do not start it from this PR.
