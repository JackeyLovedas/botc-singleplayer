# Phase 3 Slice 2B5 Status: MINION_INFO And DEMON_INFO Ordered Settlement

## Status

Implemented on branch `phase-3/minion-demon-info-settlement`.

PR #6 was merged before this slice. Slice 2B5 must not be merged until review passes.

## Scope Delivered

- Added `CurrentCharacterStateSet` as replay-derived current character/alignment state with initial revision `1`.
- Added current evil-team resolution from `CurrentCharacterStateSet`, not from frozen task recipients.
- Added `DeliveredEvilTeamSnapshot` to persist the evil team exactly as resolved at each system information settlement.
- Added `FirstNightTaskProgress` and `ScheduledTaskSettled` for first-night system task progress.
- Added `SettleFirstNightSystemTask` command.
- Added `MinionInformationDelivered` and `DemonInformationDelivered` domain events.
- Added `FirstNightSystemInformationResolverPort` and an information-engine resolver.
- Added runtime validation for resolver results at the application boundary.
- Added private knowledge projection merge for settled minion/demon information.
- Split settlement-time validation from stored-fact projection validation.

## Settlement Semantics

`MINION_INFO` and `DEMON_INFO` settle only when each requested task is the current next unsettled supported system task.

Valid settlement batches contain exactly two domain events:

```text
MinionInformationDelivered -> ScheduledTaskSettled
DemonInformationDelivered  -> ScheduledTaskSettled
```

Bare information events, bare settlement events, reversed batches, mismatched task ids, mismatched outcome types, duplicate settlements, sparse entries, and noncanonical entries are rejected by domain replay.

## Current Evil Team Resolution

The task plan does not freeze minion recipients, demon identity, or demon bluffs.

At settlement time:

- minions are told the current demon and other current minions;
- the demon is told current minions and setup demon bluffs;
- teammate role ids are not delivered;
- setup demon bluffs remain the setup fact, not a task-plan fact.

## Immutable Delivery-Time Evil Team Snapshot

`MinionInformationDelivered` and `DemonInformationDelivered` now store `resolvedEvilTeam`:

```text
DeliveredEvilTeamSnapshot(
  characterStateRevision,
  demon,
  minions
)
```

The snapshot is created by the system information resolver at settlement time and written into the same batch as `ScheduledTaskSettled`.

`payload.characterStateRevision`, `payload.resolvedEvilTeam.characterStateRevision`, and `ScheduledTaskSettled.characterStateRevision` must match inside a settlement batch.

## Delivered Knowledge Is Historical Fact

Once a system information event is accepted, its entries are validated against the stored `resolvedEvilTeam`, not against a later `CurrentCharacterStateSet`.

This preserves already-delivered team knowledge if a later role or alignment change creates a new demon or new minions. The new evil-team members do not automatically inherit old `DEMON_INFO` or `MINION_INFO`.

## No Projection-Time Evil Team Recalculation

Player and AI private knowledge projections no longer call current evil-team resolution to validate already-delivered team information.

Projection-time validation now checks:

- stored event payload exact shape;
- stored `resolvedEvilTeam` exact shape;
- matching task plan entry;
- matching `ScheduledTaskSettled`;
- entries derived from the stored snapshot.

Projection-time validation does not require `currentCharacterState`.

## Different Tasks May Use Different Character Revisions

`MINION_INFO` and `DEMON_INFO` may settle against different `CurrentCharacterStateSet.revision` values if a future role-change implementation updates current character state between the two tasks.

Each task remains bound to its own `DeliveredEvilTeamSnapshot` and matching `ScheduledTaskSettled` revision.

## Projection Boundary

Player and AI private knowledge projections now include settled team information only after the matching `ScheduledTaskSettled` event exists.

Projection output still excludes:

- full assignment;
- role catalog snapshot;
- task plan internals;
- teammate role ids;
- hidden truth metadata;
- Storyteller-only reasoning.

AI projections use the same boundary as player projections.

## Private Knowledge View Model Attribution

`PlayerPrivateKnowledgeView` no longer exposes a single merged `knowledgeModelVersion`.

It now separates:

- `ownCharacterKnowledgeModelVersion = initial-own-character-knowledge-v1`;
- optional `teamKnowledgeModelVersion = first-night-team-knowledge-v1`;
- `deliveredKnowledgeStages`, starting with `OWN_CHARACTER_BOOTSTRAP` and adding `MINION_INFORMATION` or `DEMON_INFORMATION` only for the recipient who received those facts.

The view has strict runtime shape validation before being returned.

## Runtime Dependency Boundary

Malformed resolver results are retryable `DependencyExecutionFailed` failures at `first-night-system-information`.

They do not write command receipts and do not append partial domain events.

Structured resolver failures are also retryable execution failures, not deterministic command rejections.

Metadata generation failures remain `MetadataGenerationFailed` at `event-metadata`.

## Fixtures

- The existing golden task-engine plan remains six tasks and unchanged.
- The application default plan can contain additional in-play role tasks and correctly blocks `MINION_INFO` when `PHILOSOPHER_ACTION` is next.
- A no-Philosopher exact-role fixture validates adjacent `MINION_INFO` then `DEMON_INFO` settlement.

## Out Of Scope

- No role ability execution.
- No dynamic night task insertion.
- No Snake Charmer, Pit-Hag, Barber, Fang Gu, or other role-change ability implementation.
- No AI decision.
- No UI.
- No Electron.
- No SQLite adapter.
- No Slice 2B6 work.

## Local Quality Gates

Passed:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
```

Final local test count: 457 passing tests.

## CI

The Windows deterministic job now includes setup, assignment, initial knowledge, projections, task planning, and first-night system information settlement tests.

Expected CI gates:

- Ubuntu `validate`: pass.
- Windows deterministic setup/assignment/knowledge/projections/tasks/system-info: pass.

## Remaining Blockers

None for Slice 2B5 implementation review.
