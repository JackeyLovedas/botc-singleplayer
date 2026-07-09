# Phase 3 Slice 2B11 Status: Evil Twin Setup And Pair Knowledge

## Status

Implemented on branch `phase-3/evil-twin-setup`.

PR #12 was merged before this slice with merge commit `4d76c6ef9ab28265c7f314f1157def7271857b23` and tagged as `phase-3-slice-2b10-base-snake-charmer-effectiveness`.

## Scope Delivered

- Added `SettleEvilTwinSetup` for the supported first-night `EVIL_TWIN_SETUP` role setup task.
- Added `EvilTwinPairEstablished` as the canonical deterministic pair fact.
- Added `EvilTwinInformationDelivered` as the mutual private knowledge delivery fact.
- Added `ScheduledTaskSettled.outcomeType = EVIL_TWIN_PAIR_ESTABLISHED`.
- Added `packages/domain-core/src/evil-twin.ts` for Evil Twin pair, information, validation, and replay helpers.
- Kept `assignment` and `currentCharacterState` unchanged by setup settlement.
- Projected only counterpart identity to the two twin players and AI views.
- Kept full pair facts, counterpart roles, assignment, and pairing policy out of private projections.

## Deterministic Pairing

The pairing policy is:

```text
pairingPolicyVersion = evil-twin-pairing-policy-v1
```

`SettleEvilTwinSetup` is accepted only for the current next `EVIL_TWIN_SETUP` task whose source is still the current `evil_twin` role and whose current alignment is `EVIL`.

The GOOD twin is selected deterministically as the lowest-seat current GOOD player who is not the Evil Twin source.

The pair fact records:

```text
pairId
nightNumber = 1
taskId
taskType = EVIL_TWIN_SETUP
evilTwinPlayer
goodTwinPlayer
evilTwinRole
goodTwinRole
evilTwinAlignment = EVIL
goodTwinAlignment = GOOD
characterStateRevision
pairingPolicyVersion = evil-twin-pairing-policy-v1
```

The `pairId` is deterministic from task id and selected seats.

## Private Knowledge Delivery

`EvilTwinInformationDelivered` records:

```text
knowledgeModelVersion = evil-twin-knowledge-model-v1
knowledgeStage = EVIL_TWIN_SETUP_INFORMATION
```

The delivered entries are exactly two mutual `EVIL_TWIN_PAIR` entries:

```text
Evil Twin player -> GOOD twin counterpart
GOOD twin player -> Evil Twin counterpart
```

No entry contains the counterpart role, alignment, full assignment, pairing policy, or Storyteller-only pairing reason.

## Batch Shape

The accepted Evil Twin setup batch is exactly:

```text
EvilTwinPairEstablished
EvilTwinInformationDelivered
ScheduledTaskSettled
```

The batch must share metadata, command id, batch id, game version, rules baseline, and consecutive event sequences.

Replay rejects naked, reversed, incomplete, metadata-mismatched, payload-mismatched, wrong-outcome, wrong-revision, malformed-information, and unsupported duplicate pair batches.

## Command Rejections And Failures

Deterministic rejected command receipts are preserved for:

```text
ScheduledTaskNotNext
UnsupportedRoleSetupTask
ActionSourceNoLongerValid
NoLegalEvilTwinPair
UnauthorizedActor
CommandAlreadyHandled
```

Internal or prospective domain construction failures for `SettleEvilTwinSetup` are classified as:

```text
status = failed
code = DependencyExecutionFailed
failureStage = first-night-role-setup
retryable = true
```

Metadata generation failures stay independent:

```text
code = MetadataGenerationFailed
failureStage = event-metadata
```

## Projection Boundary

Player and AI private views may include:

```text
evilTwinCounterpart
evilTwinKnowledgeModelVersion
EVIL_TWIN_SETUP_INFORMATION
```

Only the two players in the pair receive those fields. Other players do not see Evil Twin setup knowledge.

The projection boundary does not expose:

```text
evilTwinPairs
EvilTwinPairEstablished
EvilTwinInformationDelivered
pairingPolicyVersion
pairId
assignment
currentCharacterState
counterpart role
counterpart alignment
taskId
```

## Golden Behavior

- Golden base task count remains six.
- Golden base task order is unchanged.
- No-Philosopher first-night path can settle `MINION_INFO`, `DEMON_INFO`, base `SNAKE_CHARMER_ACTION`, and then `EVIL_TWIN_SETUP`.
- After `EVIL_TWIN_SETUP` settlement, `WITCH_ACTION` becomes the next task.

## Out Of Scope

- No Evil Twin good-twin execution win condition.
- No Evil Twin both-live good-win blocker.
- No death, execution, or Vigormortis-specific Evil Twin behavior.
- No AI decision.
- No UI.
- No Electron.
- No SQLite adapter.
- No first-night phase completion.
- No Slice 2B12 work.

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
511 passed
```

## CI

Expected CI gates:

- Ubuntu `validate`: pass.
- Windows deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice/snake-charmer/evil-twin: pass.

## Remaining Blockers

None known for Slice 2B11 implementation review.

## Next Slice

Suggested next slice after review and merge: continue the first-night role settlement path from the accepted roadmap. Do not start Slice 2B12 from this PR.
