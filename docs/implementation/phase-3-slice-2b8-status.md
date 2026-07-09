# Phase 3 Slice 2B8 Status: Philosopher-Gained Snake Charmer Non-Demon Settlement

## Status

Implemented on branch `phase-3/philosopher-gained-snake-charmer`.

PR #9 was merged before this slice with merge commit `21da9a6d41fe29729a9e6dabc05afb417f188cc9` and tagged as `phase-3-slice-2b7-philosopher-ability-choice`.

## Scope Delivered

- Removed obsolete `PhilosopherAbilityChoiceNotImplemented` from command rejection codes.
- Added runtime validation for dynamic first-night task plans that include real `FirstNightTaskInserted` tasks.
- Added support for opening a Philosopher-gained `SNAKE_CHARMER_ACTION` as `SNAKE_CHARMER_FIRST_NIGHT_ACTION`.
- Added `SubmitSnakeCharmerAction`.
- Added `SnakeCharmerTargetChosen`.
- Added `SnakeCharmerNoSwapResolved`.
- Added `ScheduledTaskSettled.outcomeType = SNAKE_CHARMER_NON_DEMON_NO_SWAP`.
- Settled the non-Demon target path as no-swap.
- Preserved `assignment` and `currentCharacterState`.
- Preserved progression to base `MINION_INFO` after the inserted Snake Charmer task settles.

## Dynamic Task Plan Runtime Validation

The original base task plan validator still rejects inserted tasks in `FirstNightTaskPlanCreated`.

Slice 2B8 adds runtime plan validation for already-applied `GameState.firstNightTaskPlan` values. It accepts one real inserted task only when the task exactly matches an applied `FirstNightTaskInserted` fact:

```text
source.kind = PHILOSOPHER_GAINED_ABILITY
status = PENDING
settlementPolicy = REEVALUATE_SOURCE_AT_SETTLEMENT
orderKey = { baseOrder: 100, insertionOrder: 1 }
```

The validator rejects forged insertions, wrong task ids, wrong ordering, extra source fields, duplicate insertions, and inserted tasks that were not produced by replay.

## Snake Charmer Action Opportunity

This slice supports only a Philosopher-gained Snake Charmer task:

```text
taskType = SNAKE_CHARMER_ACTION
source.kind = PHILOSOPHER_GAINED_ABILITY
source.sourceRole.roleId = philosopher
source.chosenRole.roleId = snake_charmer
```

The deterministic opportunity id is:

```text
first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-<NN>:from-snake_charmer:opportunity-01
```

The visible schema is safe:

```text
canChooseTarget = true
supportedDecisionKinds = [CHOOSE_PLAYER]
targetSchema = ANY_LIVING_PLAYER
```

It does not expose the current Demon, target role, target alignment, whether a swap will happen, `assignment`, or `currentCharacterState`.

## SubmitSnakeCharmerAction

Supported payload:

```text
commandType = SubmitSnakeCharmerAction
taskId
opportunityId
decision = { kind: CHOOSE_PLAYER, targetPlayerId }
```

Accepted actors:

- source-player Human;
- source-player AI;
- Storyteller;
- System.

Non-source Human and AI actors are rejected with `ActorPlayerMismatch`.

Deterministic rejection receipts are preserved for missing tasks, non-next tasks, missing opportunities, closed opportunities, malformed decisions, unknown targets, unsupported opportunities, stale versions, and Demon targets.

Pre-prospective construction `DomainError` values for role actions remain retryable execution failures:

```text
code = DependencyExecutionFailed
failureStage = first-night-role-action
retryable = true
```

Metadata generation failures remain independent as:

```text
code = MetadataGenerationFailed
failureStage = event-metadata
```

## Non-Demon No-Swap Settlement

If the selected target is not the current Demon, the command produces exactly:

```text
SnakeCharmerTargetChosen
SnakeCharmerNoSwapResolved
ScheduledTaskSettled
```

`SnakeCharmerTargetChosen` records source task, source player, source seat, source role snapshot, source character-state revision, target player id, and target seat number.

`SnakeCharmerNoSwapResolved` records the same source and target identifiers plus:

```text
outcomeType = NON_DEMON_TARGET_NO_SWAP
```

`ScheduledTaskSettled` records:

```text
taskType = SNAKE_CHARMER_ACTION
outcomeType = SNAKE_CHARMER_NON_DEMON_NO_SWAP
characterStateRevision = sourceCharacterStateRevision
```

No target role, target character type, target alignment, `isDemon`, or `willSwap` fact is stored in either Snake Charmer payload.

## Demon Target Boundary

If the selected target is the current Demon, this slice rejects with:

```text
SnakeCharmerDemonHitNotImplemented
```

This is a deterministic command rejection and writes a command receipt. It writes no domain events and leaves the opportunity open.

The following remain unimplemented:

- Demon-hit role swap;
- Demon-hit alignment swap;
- old-Demon poison marker;
- drunk or poisoned effectiveness checks;
- Snake Charmer AI target selection.

## Batch Semantics

Valid non-Demon no-swap replay batches contain exactly:

```text
SnakeCharmerTargetChosen
SnakeCharmerNoSwapResolved
ScheduledTaskSettled
```

The batch must use one `batchId`, one `commandId`, one `gameVersion`, one rules baseline, and consecutive event sequences.

Replay rejects:

- naked target choice;
- naked no-swap resolution;
- naked scheduled task settlement;
- reversed batches;
- incomplete batches;
- overlong batches;
- mismatched task ids;
- mismatched opportunity ids;
- mismatched target ids;
- mismatched character-state revisions;
- wrong settlement outcomes;
- Demon-target no-swap facts;
- hidden target-role fields;
- mixed `RoleChanged`, `AlignmentChanged`, or `PhaseTransitioned` events.

## Projection Boundary

Player and AI private knowledge projections still do not expose:

```text
SnakeCharmerTargetChosen
SnakeCharmerNoSwapResolved
targetPlayerId
opportunity
insertedTask
grantedAbility
impairment
chosenRole
taskId
```

No action-opportunity projection for players or AI is implemented in this slice.

## Golden Behavior

- Golden base task count remains six.
- Golden base task order is unchanged.
- Choosing `snake_charmer` as Philosopher inserts `SNAKE_CHARMER_ACTION` before `MINION_INFO`.
- The inserted Snake Charmer task can be opened, submitted, and settled on the non-Demon target path.
- After no-swap settlement, `MINION_INFO` can settle.
- After `MINION_INFO`, `DEMON_INFO` can settle.

## Out Of Scope

- No base Snake Charmer role-action support.
- No Demon-hit Snake Charmer swap.
- No role or alignment mutation.
- No `currentCharacterState` mutation.
- No `assignment` mutation.
- No drunk or poisoned effect application.
- No AI decision implementation.
- No UI.
- No Electron.
- No SQLite adapter.
- No first-night end or phase transition.
- No Slice 2B9 work.

## Local Quality Gates

Passed locally:

```bash
pnpm typecheck
pnpm lint
pnpm test          # 490 passed
pnpm test:coverage # 490 passed
```

## CI

Expected CI gates:

- Ubuntu `validate`: pass.
- Windows deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice/snake-charmer: pass.

## Remaining Blockers

None known for Slice 2B8 implementation review.

## Next Slice

Suggested next slice after review and merge: Slice 2B9 should implement Snake Charmer Demon-hit swap and old-Demon poison marker. Do not start it from this PR.
