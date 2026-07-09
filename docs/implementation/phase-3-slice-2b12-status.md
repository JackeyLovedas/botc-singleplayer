# Phase 3 Slice 2B12 Status: Witch Action Target Selection And Deferred Death Marker

## Status

Implemented on branch `phase-3/witch-action-target-marker`.

PR #13 was merged before this slice with merge commit `0aa9eb9ff5ab82d8dba630f14f0425c47787865a` and tagged as `phase-3-slice-2b11-evil-twin-setup`.

## Scope Delivered

- Enabled base in-play `WITCH_ACTION` opportunities for the current `witch` role task.
- Added `SubmitWitchAction` for the supported `{ kind: "CHOOSE_PLAYER", targetPlayerId }` decision.
- Added `packages/domain-core/src/witch.ts` for Witch target choice, pending death marker, ineffective resolution, effectiveness, validation, and replay helpers.
- Added `WitchTargetChosen` as the canonical safe target-choice fact.
- Added `WitchDeathPendingMarked` as the deferred death marker fact for a future nomination trigger.
- Added `WitchIneffectiveResolved` as the no-effect fact when the Witch source is DRUNK or POISONED.
- Added `ScheduledTaskSettled.outcomeType = WITCH_DEATH_PENDING_MARKED`.
- Added `ScheduledTaskSettled.outcomeType = WITCH_INEFFECTIVE`.
- Kept `assignment`, `currentCharacterState`, and the original first-night task plan unchanged.
- Kept private knowledge projections free of Witch target, pending death, impairment, task, and opportunity internals.

## Witch Action Opportunity

Base first-night Witch tasks create deterministic opportunities with:

```text
first-night-v1:WITCH_ACTION:seat-<NN>:opportunity-01
```

The visible schema is:

```text
canChooseTarget = true
supportedDecisionKinds = [CHOOSE_PLAYER]
targetSchema = ANY_PLAYER
```

The opportunity payload does not expose target role, target alignment, who will die, source impairment, effectiveness, assignment, or current character state.

## SubmitWitchAction Boundary

`SubmitWitchAction` accepts:

```text
taskId
opportunityId
decision.kind = CHOOSE_PLAYER
decision.targetPlayerId
```

The command rejects payloads that add target seat, target role, target alignment, `willDie`, `isEffective`, or other hidden fields.

Allowed actors:

```text
source Human
source AI
Storyteller
System
```

Human and AI actors must match `opportunity.sourcePlayerId`; otherwise the command is rejected as `ActorPlayerMismatch`.

The target can be any roster player, including the Witch source, because living/death state and nomination-day legality are not modeled in this slice.

## Effectiveness Gate

Witch effectiveness is evaluated after `WitchTargetChosen` and before effect settlement.

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

### Witch Effectiveness Stable ASCII Impairment Ordering

When multiple DRUNK or POISONED impairments affect the Witch source at the same time, `evaluateWitchEffectiveness` chooses the first impairment by no-locale stable ascending `impairmentId` comparison.

The ordering uses direct string comparison only:

```text
left.impairmentId < right.impairmentId
left.impairmentId > right.impairmentId
```

### No Locale-Based Sorting

Witch effectiveness ordering must not use locale-sensitive comparator APIs, default object sorting, or any runtime locale setting. This keeps replay and tests stable across Ubuntu, Windows, and other supported runtimes.

## Effective Settlement

An effective Witch source produces this atomic batch:

```text
WitchTargetChosen
WitchDeathPendingMarked
ScheduledTaskSettled
```

`WitchDeathPendingMarked` records:

```text
taskType = WITCH_ACTION
trigger = TARGET_NOMINATES_TOMORROW
markerVersion = witch-death-pending-v1
pendingDeathId
```

It does not include target role, target alignment, current target character state, death certainty explanation, source impairment, or Storyteller notes.

The scheduled settlement records:

```text
outcomeType = WITCH_DEATH_PENDING_MARKED
characterStateRevision = sourceCharacterStateRevision
```

## Ineffective Settlement

An impaired Witch source produces this atomic batch:

```text
WitchTargetChosen
WitchIneffectiveResolved
ScheduledTaskSettled
```

`WitchIneffectiveResolved` records:

```text
outcomeType = SOURCE_IMPAIRED_NO_EFFECT
reason = SOURCE_DRUNK | SOURCE_POISONED
sourceImpairmentId
sourceImpairmentKind = DRUNK | POISONED
```

The ineffective path still records `WitchTargetChosen`, but it does not create `WitchDeathPendingMarked`.

The scheduled settlement records:

```text
outcomeType = WITCH_INEFFECTIVE
characterStateRevision = sourceCharacterStateRevision
```

## Replay And Batch Semantics

Replay accepts exactly the effective or ineffective batch shape.

The batch must share one `batchId`, one `commandId`, one `gameVersion`, one rules baseline, and consecutive event sequences.

Replay rejects:

- naked `WitchTargetChosen`;
- naked `WitchDeathPendingMarked`;
- naked `WitchIneffectiveResolved`;
- reversed or mixed Witch batches;
- mismatched task id, opportunity id, source, target, pending death marker, or settlement outcome;
- death marker batches when the source is impaired;
- ineffective batches when the source is effective;
- wrong `sourceImpairmentId`;
- hidden or extra fields in Witch payloads;
- batches mixed with `PhaseTransitioned`.

## Failure Boundary

Internal or prospective domain construction failures for `OpenFirstNightRoleActionOpportunity` on `WITCH_ACTION` and `SubmitWitchAction` are classified as:

```text
status = failed
code = DependencyExecutionFailed
failureStage = first-night-role-action
retryable = true
```

These failures do not save command receipts and do not append partial domain events.

Metadata generation failures stay independent:

```text
code = MetadataGenerationFailed
failureStage = event-metadata
```

## Projection Boundary

Player and AI private knowledge projections do not expose:

```text
WitchTargetChosen
WitchDeathPendingMarked
WitchIneffectiveResolved
targetPlayerId
pendingDeathId
trigger
sourceImpairmentId
SOURCE_DRUNK
SOURCE_POISONED
taskId
opportunityId
```

Team knowledge is still projected only from delivered `MINION_INFO`, `DEMON_INFO`, and Evil Twin knowledge facts.

## Golden Behavior

- Golden base task count remains six.
- Golden base task order is unchanged.
- No-Philosopher supported path can settle `MINION_INFO`, `DEMON_INFO`, base `SNAKE_CHARMER_ACTION`, `EVIL_TWIN_SETUP`, and then `WITCH_ACTION`.
- After `WITCH_ACTION` settlement, `DREAMER_ACTION` becomes the next task in the current supported no-Philosopher path.
- `SettleFirstNightSystemTask` cannot skip Dreamer.
- `OpenFirstNightRoleActionOpportunity(DREAMER_ACTION)` remains rejected as unsupported.

## Out Of Scope

- No actual death.
- No daytime nomination trigger settlement.
- No living/dead target legality.
- No Witch three-alive ability loss.
- No Dreamer action implementation.
- No AI target choice.
- No UI.
- No Electron.
- No SQLite adapter.
- No first-night phase completion.
- No Slice 2B13 work.

## Local Quality Gates

Passed locally:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
```

Test count after this slice:

```text
529 passed
```

## CI

Expected CI gates:

- Ubuntu `validate`: pass.
- Windows deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice/snake-charmer/evil-twin/witch: pass.

## Remaining Blockers

None known for Slice 2B12 implementation review.

## Next Slice

Suggested next slice after review and merge: Phase 3 Slice 2B13 Dreamer Action Opportunity and Information Skeleton. Do not start Slice 2B13 from this PR.
