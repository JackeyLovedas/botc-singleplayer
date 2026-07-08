# Phase 3 Slice 2B3: First Night Private Knowledge Bootstrap Status

## 1. Scope

- Repository: `JackeyLovedas/botc-singleplayer`
- Base merge: PR #4 merged into `main` at `88c8b57`
- Accepted Slice 2B2 tag: `phase-3-slice-2b2-seat-roster-character-assignment`
- Branch: `phase-3/first-night-private-knowledge`

This slice initializes first night private knowledge after real setup, roster, and character assignment facts exist.

This slice does not implement executable night tasks, role abilities, AI decisions, nomination, voting, execution, death, victory, UI, Electron, or SQLite adapters.

## 2. Canonical State Rebuild Boundary

Application command execution now contains canonical state rebuild failures separately from event loading:

```text
code = CanonicalStateRebuildFailed
failureStage = state-rebuild
retryable = true
```

If rebuild fails, the command result has no `currentGameVersion`, writes no accepted or rejected receipt, appends no event, and can be retried with the same `commandId` after the stream is repaired.

## 3. New Domain Events

`InitializeFirstNight` emits exactly two domain events in one batch:

```text
FirstNightInitialized
InitialPrivateKnowledgeEstablished
```

Both events share one `batchId`, `commandId`, `gameVersion`, and rules baseline. Event sequences are consecutive. The batch increments `gameVersion` once and does not emit `PhaseTransitioned`; the phase remains `FIRST_NIGHT`.

Supported versions:

```text
initializationVersion = first-night-initialization-v1
knowledgeModelVersion = initial-private-knowledge-v1
```

Replay rejects bare `FirstNightInitialized`, bare `InitialPrivateKnowledgeEstablished`, reversed order, third events in the batch, metadata mismatch, reinitialization, and private knowledge entries that do not match assignment/setup facts.

## 4. information-engine

New package:

```text
packages/information-engine
```

Dependency boundary:

```text
information-engine -> domain-core
```

The engine generates `InitialPrivateKnowledge` from:

- roster
- character assignment
- generated setup

It does not depend on application, setup-engine, assignment-engine, rules-snv, AI, Electron, or SQLite.

Generation validates roster, assignment, setup role composition, demon count, minion count, demon bluffs, canonical result ordering, and replay-valid knowledge entries.

## 5. Knowledge Rules

Every player receives exactly one `OWN_CHARACTER` entry matching their assigned role snapshot.

Each minion additionally receives:

- `DEMON_IDENTITY`: demon player reference only.
- `MINION_IDENTITIES`: the other minion reference only.

The demon additionally receives:

- `MINION_IDENTITIES`: both minion references.
- `DEMON_BLUFFS`: exactly `state.setup.demonBluffs`.

Good players receive no evil-team information beyond their own character.

Known player references contain only:

```text
playerId
seatNumber
```

They do not contain role id, role type, alignment, or role snapshots.

Canonical ordering is enforced:

- recipients by seat number ascending.
- within a recipient: `OWN_CHARACTER`, `DEMON_IDENTITY`, `MINION_IDENTITIES`, `DEMON_BLUFFS`.
- player references by seat.
- bluff roles by ASCII `roleId`.

## 6. Application Runtime Boundary

`application` defines `InitialPrivateKnowledgeBuilderPort` and does not import `information-engine`.

Runtime failures:

- Missing builder: `ApplicationNotConfigured`, `initial-knowledge-generation`, retryable.
- Builder throws: `DependencyExecutionFailed`, `initial-knowledge-generation`, retryable.
- Deterministic generation failure: rejected command receipt with `InitialPrivateKnowledgeGenerationFailed` and details kind `initial-private-knowledge-generation`.

## 7. projections

New package:

```text
packages/projections
```

Dependency boundary:

```text
projections -> domain-core
```

Implemented projections:

- `buildPlayerPrivateKnowledgeView(state, viewerPlayerId)`
- `buildAiPrivateKnowledgeView(state, viewerPlayerId)`

Both use the same safety boundary. Projection output may contain only:

- viewer player id
- viewer seat number
- viewer display name
- own character
- known demon reference
- known minion references
- demon bluffs
- knowledge model version

Projection output does not expose complete assignments, role catalog snapshots, other players' own characters, candidate sets, semantic truth, reliability, truth constraints, registration decisions, or Storyteller internals.

Projection results are defensive copies.

## 8. Tests

Local test count after this slice:

```text
337 tests
```

Covered areas:

- canonical state rebuild failure boundary.
- first night command preconditions and actor rules.
- first night two-event batch semantics.
- private knowledge generation rules.
- replay rejection for forged or non-canonical private knowledge.
- projection leakage boundaries.
- defensive copy behavior.
- architecture dependency boundaries.

Local gates run during implementation:

```text
pnpm typecheck: passed
pnpm lint: passed
pnpm test: passed, 337 tests
pnpm test:coverage: passed, 337 tests
```

## 9. Not Implemented

- first-night task plan.
- scheduled night task skeleton.
- dynamic night order execution.
- role abilities.
- drunk or poisoned ability settlement.
- information evaluation beyond initial private knowledge.
- AI decisions.
- AI memory.
- public discussion.
- private chat.
- nomination.
- voting.
- execution.
- death.
- victory.
- UI.
- Electron.
- SQLite.

## 10. BLOCKER Status

No implementation-level Slice 2B3 blocker is known after local typecheck, lint, test, and coverage.

CI status is not claimed here until the PR checks complete.

## 11. Next Step

Recommended next slice after this PR is reviewed and merged:

```text
Phase 3 Slice 2B4: First Night Task Plan and ScheduledTask Skeleton
```

Do not start Slice 2B4 from this PR.
