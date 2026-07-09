# Phase 3 Slice 2B9 Status: Snake Charmer Demon-Hit Swap And Poison Marker

## Status

Implemented on branch `phase-3/snake-charmer-demon-hit`.

PR #10 was merged before this slice with merge commit `a87d14a24e5f6f41481db920a64a7688f63dcdaf` and tagged as `phase-3-slice-2b8-philosopher-gained-snake-charmer-non-demon`.

## Scope Delivered

- Added `SnakeCharmerDemonSwapApplied` as the canonical event for a Philosopher-gained Snake Charmer choosing the current Demon.
- Added `ScheduledTaskSettled.outcomeType = SNAKE_CHARMER_DEMON_HIT_SWAP`.
- Removed the active `SnakeCharmerDemonHitNotImplemented` rejection path from `SubmitSnakeCharmerAction`.
- Swapped current role and current alignment between the Snake Charmer source and the chosen Demon.
- Incremented `CurrentCharacterState.revision` from 1 to 2 for the demon-hit path.
- Preserved `assignment`, `setup`, `firstNightTaskPlan.taskCatalogSnapshot`, and initial private knowledge as historical facts.
- Added `AbilityImpairmentApplied(kind = POISONED, sourceKind = SNAKE_CHARMER_DEMON_HIT)` for the old Demon after the swap.
- Kept the non-Demon no-swap path unchanged.
- Verified subsequent `MINION_INFO` and `DEMON_INFO` settlement resolves the current evil team from revision 2.
- Kept player and AI private knowledge projections free of target-choice, swap, poison, task, and opportunity internals.

## SnakeCharmerDemonSwapApplied

The demon-hit command path produces this atomic event sequence:

```text
SnakeCharmerTargetChosen
SnakeCharmerDemonSwapApplied
AbilityImpairmentApplied
ScheduledTaskSettled
```

`SnakeCharmerTargetChosen` remains a safe target-choice fact. It does not include target role, target character type, target alignment, `isDemon`, or `willSwap`.

`SnakeCharmerDemonSwapApplied` is a canonical state mutation fact and includes:

```text
rulesBaselineVersion
nightNumber = 1
taskId
taskType = SNAKE_CHARMER_ACTION
opportunityId
sourcePlayerId
sourceSeatNumber
targetPlayerId
targetSeatNumber
previousCharacterStateRevision
nextCharacterStateRevision
sourceBefore
targetBefore
sourceAfter
targetAfter
swapReason = SNAKE_CHARMER_DEMON_HIT
```

The event validator requires:

```text
targetBefore.role.characterType = DEMON
sourceAfter.role = targetBefore.role
sourceAfter.currentAlignment = targetBefore.currentAlignment
targetAfter.role = sourceBefore.role
targetAfter.currentAlignment = sourceBefore.currentAlignment
nextCharacterStateRevision = previousCharacterStateRevision + 1
```

Applying the event updates only `currentCharacterState`:

```text
revision = nextCharacterStateRevision
source entry = sourceAfter
target entry = targetAfter
other entries unchanged
entries sorted by seatNumber
```

`validateCurrentCharacterStateSet(...)` is run after the swap without reusing the initial-assignment-equality rule.

## Poison Marker

The old Demon receives the impairment marker after the swap:

```text
AbilityImpairmentApplied
kind = POISONED
sourceKind = SNAKE_CHARMER_DEMON_HIT
affectedPlayerId = targetPlayerId
affectedSeatNumber = targetSeatNumber
affectedRole = targetAfter.role
sourceCharacterStateRevision = nextCharacterStateRevision
```

This records the rule fact that the chosen Demon is poisoned after swapping into the Snake Charmer source role. The slice does not implement poisoned effectiveness evaluation, duration expiry, mathematician interaction, or any broader drunk/poison rule engine.

## Scheduled Task Settlement

The demon-hit path settles the inserted Snake Charmer task with:

```text
taskType = SNAKE_CHARMER_ACTION
outcomeType = SNAKE_CHARMER_DEMON_HIT_SWAP
characterStateRevision = nextCharacterStateRevision
```

The non-Demon path still uses:

```text
outcomeType = SNAKE_CHARMER_NON_DEMON_NO_SWAP
characterStateRevision = sourceCharacterStateRevision
```

## Replay And Batch Semantics

Valid demon-hit replay batches contain exactly:

```text
SnakeCharmerTargetChosen
SnakeCharmerDemonSwapApplied
AbilityImpairmentApplied
ScheduledTaskSettled
```

The batch must share one `batchId`, one `commandId`, one `gameVersion`, one rules baseline, and consecutive event sequences.

Replay rejects:

- naked `SnakeCharmerDemonSwapApplied`;
- missing poison marker;
- missing settlement;
- reversed order;
- non-Demon target with demon-swap payload;
- Demon target with no-swap payload;
- incorrect `sourceAfter`;
- incorrect `targetAfter`;
- non-contiguous character-state revision;
- incorrect poison affected player;
- incorrect poison affected role;
- incorrect settlement outcome;
- incorrect settlement revision;
- mixed `PhaseTransitioned`;
- extra payload fields.

## Subsequent System Information

After a demon-hit swap:

```text
source player becomes the current Demon
old Demon becomes the source player's previous role and alignment
currentCharacterState.revision = 2
```

Subsequent system information resolves from revision 2:

- `MINION_INFO` uses the new Demon in `resolvedEvilTeam.characterStateRevision = 2`.
- Minions see the new Demon identity.
- `DEMON_INFO` is delivered to the new Demon.
- The old Demon does not receive `DEMON_INFO`.

Historical delivered snapshots remain stable. Projection code still validates delivered information against its own settlement revision and does not recalculate old knowledge from the latest current state.

## Projection Boundary

Player and AI private knowledge projections do not expose:

```text
SnakeCharmerTargetChosen
SnakeCharmerDemonSwapApplied
AbilityImpairmentApplied
targetPlayerId
sourceBefore
targetBefore
sourceAfter
targetAfter
POISONED
opportunityId
taskId
```

Team knowledge is still projected only from delivered `MINION_INFO` and `DEMON_INFO` facts.

## Command Failure Boundary

Deterministic input and state rejections continue to write rejected command receipts for:

```text
ActorPlayerMismatch
ScheduledTaskNotFound
ScheduledTaskNotNext
ActionOpportunityNotFound
ActionOpportunityAlreadyClosed
UnsupportedRoleActionOpportunity
InvalidSnakeCharmerTarget
ExpectedGameVersionMismatch
```

Internal construction and prospective-validation `DomainError` values for first-night role actions remain retryable execution failures:

```text
code = DependencyExecutionFailed
failureStage = first-night-role-action
retryable = true
```

Metadata generation failures remain independent:

```text
code = MetadataGenerationFailed
failureStage = event-metadata
```

## Golden Behavior

- Golden base task count remains six.
- Golden base task order is unchanged.
- Choosing `snake_charmer` as Philosopher still inserts `SNAKE_CHARMER_ACTION` before base `MINION_INFO`.
- Non-Demon no-swap still produces the three-event no-swap batch.
- Demon-hit now produces the four-event swap and poison batch.
- After either Snake Charmer settlement, `MINION_INFO` can settle next.

## Out Of Scope

- No base Snake Charmer role-action support.
- No poisoned or drunk effectiveness evaluation.
- No Snake Charmer AI target decision.
- No UI.
- No Electron.
- No SQLite adapter.
- No first-night end or phase transition.
- No Slice 2B10 work.

## Local Quality Gates

Passed locally:

```bash
pnpm typecheck
pnpm lint
pnpm test          # 492 passed
pnpm test:coverage # 492 passed
```

## CI

Expected CI gates:

- Ubuntu `validate`: pass.
- Windows deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice/snake-charmer: pass.

## Remaining Blockers

None known for Slice 2B9 implementation review.

## Next Slice

Suggested next slice after review and merge: Slice 2B10 should implement base Snake Charmer action and the first effectiveness gate. Do not start it from this PR.
