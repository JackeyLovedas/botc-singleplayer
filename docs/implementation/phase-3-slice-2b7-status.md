# Phase 3 Slice 2B7 Status: Philosopher Ability Choice And Dynamic Task Insertion Foundation

## Status

Implemented on branch `phase-3/philosopher-ability-choice`.

PR #8 was merged before this slice and tagged as `phase-3-slice-2b6-philosopher-action-opportunity`.

## Scope Delivered

- Added `CHOOSE_GOOD_CHARACTER` support for `SubmitPhilosopherAction`.
- Added `PhilosopherAbilityChosen`.
- Added `PhilosopherAbilityGranted`.
- Added conditional `AbilityImpairmentApplied` for choosing a GOOD role that is currently in play.
- Added conditional `FirstNightTaskInserted` for gained first-night tasks.
- Added `ScheduledTaskSettled.outcomeType = PHILOSOPHER_ABILITY_CHOSEN`.
- Added replay-derived state for Philosopher choices, granted abilities, impairments, and first-night task insertions.
- Preserved `currentCharacterState` and `assignment` as unchanged facts in this slice.

## Legal Choice Boundary

`SubmitPhilosopherAction` now accepts:

```text
{ kind: "CHOOSE_GOOD_CHARACTER", roleId }
```

The chosen role must exist in the current setup role catalog and must be a GOOD character. Demon and Minion choices are rejected. Unknown roles, extra decision fields, malformed decisions, and unsupported decision kinds are rejected with deterministic command receipts.

Accepted actors remain:

- System;
- Storyteller;
- source-player Human;
- source-player AI.

Non-source Human or AI actors are rejected with `ActorPlayerMismatch`.

## Granted Ability Facts

Accepted choices create:

```text
PhilosopherAbilityChosen
PhilosopherAbilityGranted
ScheduledTaskSettled(outcomeType = PHILOSOPHER_ABILITY_CHOSEN)
```

The grant id is deterministic:

```text
philosopher-grant-v1:seat-<NN>:from-<roleId>
```

The grant records the Philosopher source player, source seat, source role snapshot, chosen role snapshot, role catalog signature, task id, opportunity id, and source character-state revision.

## Duplicate Role Impairment Marker

If the chosen GOOD role is currently in play, the batch must include:

```text
AbilityImpairmentApplied(kind = DRUNK, sourceKind = PHILOSOPHER_CHOSEN_DUPLICATE)
```

The impairment id is deterministic:

```text
ability-impairment-v1:PHILOSOPHER_CHOSEN_DUPLICATE:seat-<NN>:affects-seat-<NN>:from-<roleId>
```

This slice records the impairment marker only. It does not implement drunkenness effects, ability suppression, or future recalculation behavior.

## Dynamic First-Night Task Insertion

The following gained first-night abilities insert one pending task:

| Chosen Role | Inserted Task |
| --- | --- |
| `clockmaker` | `CLOCKMAKER_INFORMATION` |
| `dreamer` | `DREAMER_ACTION` |
| `snake_charmer` | `SNAKE_CHARMER_ACTION` |
| `seamstress` | `SEAMSTRESS_ACTION` |
| `mathematician` | `MATHEMATICIAN_INFORMATION` |

Inserted task ids are deterministic:

```text
first-night-v1:PHILOSOPHER_GAINED:<TASK_TYPE>:seat-<NN>:from-<chosenRoleId>
```

Inserted tasks use:

```text
source.kind = PHILOSOPHER_GAINED_ABILITY
orderKey = { baseOrder: 100, insertionOrder: 1 }
settlementPolicy = REEVALUATE_SOURCE_AT_SETTLEMENT
status = PENDING
```

The inserted task is placed after the settled `PHILOSOPHER_ACTION` and before base `MINION_INFO`. It is not executed in this slice.

## Non-Inserting GOOD Roles

These legal choices do not insert first-night tasks:

```text
artist
savant
juggler
flowergirl
town_crier
oracle
sage
mutant
sweetheart
barber
klutz
philosopher
```

If the chosen role is not currently in play, no impairment marker is recorded.

## Batch Semantics

Valid ability choice batches contain three to five events:

```text
PhilosopherAbilityChosen
PhilosopherAbilityGranted
[AbilityImpairmentApplied]
[FirstNightTaskInserted]
ScheduledTaskSettled
```

Rules:

- the batch must start with choice then grant;
- optional impairment must appear before optional insertion;
- the batch must end with `ScheduledTaskSettled`;
- the settlement outcome must be `PHILOSOPHER_ABILITY_CHOSEN`;
- impairment is required exactly when the chosen role is currently in play;
- insertion is required exactly when the chosen role has a mapped first-night task;
- naked grant, impairment, insertion, or settlement events are rejected;
- reversed, mixed, overlong, metadata-mismatched, and payload-mismatched batches are rejected.

## Projection Boundary

Player and AI private knowledge projections still do not expose task plans, action opportunities, granted abilities, impairment markers, inserted tasks, internal event names, or decision schemas.

Additional leakage terms covered in tests:

```text
chosenRole
grantedAbility
impairment
insertedTask
PhilosopherAbilityChosen
FirstNightTaskInserted
```

## Golden Behavior

- Golden base task count remains six.
- Golden base task order is unchanged.
- Choosing `snake_charmer` inserts `SNAKE_CHARMER_ACTION` before `MINION_INFO`.
- The inserted task blocks `MINION_INFO` because it becomes the next unsettled role task.
- The inserted task remains pending.

## Out Of Scope

- No inserted task execution.
- No gained ability settlement.
- No Snake Charmer role exchange.
- No drunkenness effect application.
- No role or assignment mutation.
- No AI decision implementation.
- No UI.
- No Electron.
- No SQLite adapter.
- No first-night end or phase transition.
- No Slice 2B8 work.

## Local Quality Gates

Passed locally:

```bash
pnpm typecheck
pnpm lint
pnpm test          # 480 passed
pnpm test:coverage # 480 passed
```

## CI

Expected CI gates:

- Ubuntu `validate`: pass.
- Windows deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice: pass.

## Remaining Blockers

None known for Slice 2B7 implementation review.

## Next Slice

Suggested next slice after review and merge: Slice 2B8 should settle the first inserted Philosopher-gained task or implement the next smallest role-action path. Do not start it from this PR.
