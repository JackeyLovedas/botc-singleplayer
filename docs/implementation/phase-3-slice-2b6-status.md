# Phase 3 Slice 2B6 Status: Philosopher Action Opportunity And Defer Settlement

## Status

Implemented on branch `phase-3/philosopher-action-opportunity`.

PR #7 was merged before this slice and tagged as `phase-3-slice-2b5-minion-demon-info-settlement`.

## Scope Delivered

- Added `ActionOpportunityId` and first-night `ActionOpportunity` domain model.
- Added deterministic `FirstNightActionOpportunityCreated` for the Philosopher first-night wake.
- Added `OpenFirstNightRoleActionOpportunity` command for system or Storyteller opening of the current next role action task.
- Added `SubmitPhilosopherAction` command.
- Added supported Philosopher decision `DEFER`.
- Added deterministic rejection for `CHOOSE_GOOD_CHARACTER` as `PhilosopherAbilityChoiceNotImplemented`.
- Added `PhilosopherActionDeferred`.
- Added `ScheduledTaskSettled.outcomeType = PHILOSOPHER_DEFERRED`.
- Added replay-derived `GameState.firstNightActionOpportunities`.
- Preserved `MINION_INFO` and `DEMON_INFO` settlement after Philosopher DEFER.

## ActionOpportunity

Only one opportunity kind is implemented:

```text
PHILOSOPHER_FIRST_NIGHT_ACTION
```

The opportunity id is deterministic and uses the source seat:

```text
first-night-v1:PHILOSOPHER_ACTION:seat-<NN>:opportunity-01
```

The visible schema is intentionally narrow:

```text
canDefer = true
supportedDecisionKinds = [DEFER]
futureUnsupportedDecisionKinds = [CHOOSE_GOOD_CHARACTER]
```

The model records source task, source player, source seat, source role snapshot, and source character-state revision. It does not expose the canonical state.

## Batch Semantics

Valid role action opportunity batches are:

```text
FirstNightActionOpportunityCreated
PhilosopherActionDeferred -> ScheduledTaskSettled
```

Bare deferred events, bare role settlements, reversed batches, mismatched task ids, mismatched revisions, wrong outcomes, duplicate opportunities, duplicate settlements, and third events are rejected by replay.

## Command Boundary

`OpenFirstNightRoleActionOpportunity`:

- only system and Storyteller actors may execute it;
- must target the current next unsettled task;
- supports only `PHILOSOPHER_ACTION` in this slice;
- saves deterministic rejection receipts for duplicate, closed, unsupported, missing, wrong-phase, and stale-version cases.

`SubmitPhilosopherAction`:

- accepts System, Storyteller, source-player Human, and source-player AI actors;
- rejects non-source Human or AI actors with `ActorPlayerMismatch`;
- accepts only `{ kind: "DEFER" }`;
- rejects `{ kind: "CHOOSE_GOOD_CHARACTER" }` with `PhilosopherAbilityChoiceNotImplemented`;
- writes `PhilosopherActionDeferred` and `ScheduledTaskSettled` atomically for DEFER.

## Runtime Failure Boundary

Pre-prospective role action construction failures are retryable:

```text
status = failed
code = DependencyExecutionFailed
failureStage = first-night-role-action
retryable = true
```

They do not write command receipts and do not append partial domain events.

Metadata generation failures remain independent:

```text
code = MetadataGenerationFailed
failureStage = event-metadata
```

## Projection Boundary

Player and AI private knowledge projections do not expose:

- `actionOpportunity`;
- `openOpportunities`;
- `availableActions`;
- `taskId`;
- `opportunityId`;
- `PHILOSOPHER_ACTION`;
- `canDefer`;
- `supportedDecisionKinds`;
- `DEFER`;
- `CHOOSE_GOOD_CHARACTER`.

## Golden Behavior

- Golden task count remains six.
- Golden order remains unchanged.
- Golden initial `MINION_INFO` remains blocked while `PHILOSOPHER_ACTION` is the next unsettled task.
- After Philosopher DEFER, `MINION_INFO` can settle.
- After `MINION_INFO`, `DEMON_INFO` can settle.

## Out Of Scope

- No Philosopher ability choice.
- No Philosopher gains another ability.
- No original role drunkenness.
- No dynamic night task insertion.
- No other role ability execution.
- No AI decision implementation.
- No UI.
- No Electron.
- No SQLite adapter.
- No Slice 2B7 work.

## Local Quality Gates

Passed locally:

```bash
pnpm typecheck
pnpm lint
pnpm test          # 472 passed
pnpm test:coverage # 472 passed
```

## CI

Expected CI gates:

- Ubuntu `validate`: pass.
- Windows deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions: pass.

## Remaining Blockers

None known for Slice 2B6 implementation review.

## Next Slice

Suggested next slice: Slice 2B7, after review and merge, should decide whether to implement the Philosopher ability choice path or another smallest first-night role-action settlement. Do not start it from this PR.
