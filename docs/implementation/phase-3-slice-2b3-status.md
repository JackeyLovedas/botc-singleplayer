# Phase 3 Slice 2B3: First Night Private Knowledge Bootstrap Status

## 1. Scope

- Repository: `JackeyLovedas/botc-singleplayer`
- Base merge: PR #4 merged into `main` at `88c8b57`
- Accepted Slice 2B2 tag: `phase-3-slice-2b2-seat-roster-character-assignment`
- Branch: `phase-3/first-night-private-knowledge`

This slice initializes only first night own-character private knowledge after real setup, roster, and character assignment facts exist.

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
knowledgeModelVersion = initial-own-character-knowledge-v1
knowledgeStage = OWN_CHARACTER_BOOTSTRAP
```

Replay rejects bare `FirstNightInitialized`, bare `InitialPrivateKnowledgeEstablished`, reversed order, third events in the batch, metadata mismatch, reinitialization, and private knowledge entries that do not match assignment/setup facts.

## 4. Official First-Night Ordering Constraint

This PR no longer claims that evil-team recognition is complete during first-night initialization.

Official first-night ordering creates a timing constraint:

```text
Philosopher
...
Minion Info
Demon Info
...
Snake Charmer
```

The project rules allow a Philosopher-gained ability to be inserted immediately. A Philosopher who gains Snake Charmer before `MINION_INFO` or `DEMON_INFO` may change the current demon identity before evil-team information is delivered.

Therefore demon/minion recognition and demon bluffs cannot be permanently established before any first-night task has executed.

## 5. Own-Character-Only Bootstrap

`InitialPrivateKnowledgeEstablished` is still emitted as the second event of the atomic `InitializeFirstNight` batch, but its meaning is now strictly:

```text
Initial Own Character Knowledge Bootstrap
```

The payload exact shape is:

```text
rulesBaselineVersion
knowledgeModelVersion
knowledgeStage
rosterVersion
assignmentAlgorithmVersion
roleCatalogSignature
entries
```

Current values:

```text
knowledgeModelVersion = initial-own-character-knowledge-v1
knowledgeStage = OWN_CHARACTER_BOOTSTRAP
```

The event may contain only:

```text
12 x OWN_CHARACTER
```

Each roster player receives exactly one own-character entry. Entries are ordered by recipient seat number and each role snapshot must match the assignment and the role catalog.

## 6. Strict Runtime Knowledge Schema

`InitialPrivateKnowledgeEstablished` is validated as untrusted runtime data before any entry reaches sorting, switch dispatch, canonical state rebuild, or projections.

Supported initial knowledge kinds are closed to:

```text
OWN_CHARACTER
DEMON_IDENTITY
MINION_IDENTITIES
DEMON_BLUFFS
```

### Unknown Knowledge Kind Rejection

Unknown kinds, including secret-dump style entries, fail with `InvalidInitialPrivateKnowledgeEstablishedPayload` and the message `unknown initial private knowledge kind`.

Unknown kinds are rejected before `KNOWLEDGE_KIND_ORDER`, canonical ordering, exhaustive switches, or state storage can consume them.

### Exact Hidden Payload Shapes

Initial private knowledge entries now require exact enumerable fields:

- `OWN_CHARACTER`: `kind`, `recipientPlayerId`, `role`
- `DEMON_IDENTITY`: `kind`, `recipientPlayerId`, `demon`
- `MINION_IDENTITIES`: `kind`, `recipientPlayerId`, `minions`
- `DEMON_BLUFFS`: `kind`, `recipientPlayerId`, `roles`

Only `OWN_CHARACTER` is accepted by `InitialPrivateKnowledgeEstablished` in this slice. The other three shapes remain defined as future domain contracts, but they are not delivered by this event.

`KnownPlayerReference` is exactly `playerId` and `seatNumber`; `seatNumber` must be an integer from 1 to 12.

`RoleSetupSnapshot` is exactly `roleId`, `characterType`, `defaultAlignment`, `edition`, and `setupModifier`; `setupModifier` is exactly `outsiderDelta` and `townsfolkDelta`.

### Malformed JSON Domain Errors

Malformed entries, sparse arrays, missing required fields, extra secret fields, null entries, arrays, strings, and primitive payloads fail as `DomainError` values, not raw runtime exceptions.

`FirstNightInitialized` also requires its exact payload shape:

```text
rulesBaselineVersion
initializationVersion
nightNumber
rosterVersion
assignmentAlgorithmVersion
roleCatalogSignature
```

`InitialPrivateKnowledgeEstablished` requires its exact payload shape:

```text
rulesBaselineVersion
knowledgeModelVersion
knowledgeStage
rosterVersion
assignmentAlgorithmVersion
roleCatalogSignature
entries
```

### Deferred Minion Information

`DEMON_IDENTITY` and `MINION_IDENTITIES` are defined but not yet delivered.

They must be generated later by ordered first-night system tasks at `MINION_INFO` settlement time. This PR does not create `MinionInformationDelivered`, `PrivateKnowledgeDelivered`, `FirstNightTaskPlanCreated`, or `ScheduledTaskCreated`.

### Deferred Demon Information

`DEMON_BLUFFS` is defined but not yet delivered.

Demon bluffs must be generated later by the ordered `DEMON_INFO` system task. This PR does not create `DemonInformationDelivered` or any task execution event.

### No Premature Evil-Team Knowledge

Replay rejects `DEMON_IDENTITY`, `MINION_IDENTITIES`, and `DEMON_BLUFFS` inside the bootstrap event even when their runtime shape is otherwise valid.

## 7. information-engine

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

Generation validates roster, assignment, setup role composition, demon count, minion count, demon bluffs, canonical own-character result ordering, and replay-valid bootstrap knowledge entries.

The engine currently generates only:

```text
12 x OWN_CHARACTER
```

### Catalog-Bound Demon Bluff Validation

Demon bluff roles are validated against the current setup role catalog:

- each bluff `roleId` must exist in `setup.roleCatalogSnapshot.roles`.
- each bluff snapshot must deeply match the corresponding catalog snapshot.
- each bluff snapshot must have exact `RoleSetupSnapshot` shape.
- `roleCatalogSignature` must match the supported catalog signature.
- `roleCatalogSnapshot.canonicalSignature` must match the recalculated catalog content.

Forged good-looking bluff roles outside the catalog are rejected at the setup/source-fact validation boundary. Bluff knowledge itself is still deferred to `DEMON_INFO`.

## 8. Knowledge Rules

Every player receives exactly one `OWN_CHARACTER` entry matching their assigned role snapshot.

Minions do not receive `DEMON_IDENTITY` or `MINION_IDENTITIES` in this slice.

The demon does not receive `MINION_IDENTITIES` or `DEMON_BLUFFS` in this slice.

All players, including demon, minions, and good players, receive no private information beyond their own character.

Known player references contain only:

```text
playerId
seatNumber
```

They do not contain role id, role type, alignment, or role snapshots.

Canonical ordering is enforced:

- recipients by seat number ascending.
- exactly one `OWN_CHARACTER` per recipient.

## 9. Application Runtime Boundary

`application` defines `InitialPrivateKnowledgeBuilderPort` and does not import `information-engine`.

Runtime failures:

- Missing builder: `ApplicationNotConfigured`, `initial-knowledge-generation`, retryable.
- Builder throws: `DependencyExecutionFailed`, `initial-knowledge-generation`, retryable.
- Deterministic own-character knowledge generation failure: rejected command receipt with `InitialPrivateKnowledgeGenerationFailed` and details kind `initial-private-knowledge-generation`.

## 10. projections

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
- known demon reference, currently absent until `MINION_INFO`
- known minion references, currently always empty until `MINION_INFO`
- demon bluffs, currently always empty until `DEMON_INFO`
- knowledge model version

Projection output does not expose complete assignments, role catalog snapshots, other players' own characters, candidate sets, semantic truth, reliability, truth constraints, registration decisions, or Storyteller internals.

Projection results are defensive copies.

### Projection Revalidation Boundary

Before building a player or AI private knowledge view, projections revalidate:

- `firstNight`
- exact `FirstNightInitialized` payload shape
- supported `initializationVersion`
- `nightNumber = 1`
- first-night metadata matching roster, assignment, setup, and assignment role catalog signature
- `setup`
- `roster`
- `assignment`
- `initialPrivateKnowledge`
- supported `knowledgeModelVersion`
- entries matching current setup, roster, assignment, catalog, and metadata

Tampered manual `GameState` values with unknown entries or extra secret fields fail with `PrivateKnowledgeUnavailable`.

## 11. Philosopher Immediate-Insertion Hazard

The first-night task model must later allow dynamic insertion for abilities gained by the Philosopher. This PR documents the constraint but does not implement role abilities, first-night task planning, scheduled tasks, or task execution.

The next-slice ordering contract is:

```text
1. Philosopher task
2. MINION_INFO system task
3. DEMON_INFO system task
4. Snake Charmer task
5. Evil Twin task
6. Witch task
7. Cerenovus task
8. Clockmaker task
9. Dreamer task
10. Seamstress task
11. Mathematician task
```

Only in-play tasks are generated later. `MINION_INFO` and `DEMON_INFO` are system tasks. Pit-Hag does not act on the first night.

## 12. Tests

Local test count after this slice:

```text
379 tests
```

Covered areas:

- canonical state rebuild failure boundary.
- first night command preconditions and actor rules.
- first night two-event batch semantics.
- private knowledge generation rules.
- replay rejection for forged or non-canonical private knowledge.
- projection leakage boundaries.
- defensive copy behavior.
- strict runtime private knowledge schema.
- unknown knowledge kind rejection.
- exact hidden payload shape rejection.
- projection revalidation before player and AI views.
- catalog-bound demon bluff validation.
- own-character-only bootstrap.
- deferred minion information.
- deferred demon information.
- no premature evil-team knowledge.
- architecture dependency boundaries.

Local gates run during implementation:

```text
pnpm typecheck: passed
pnpm lint: passed
pnpm test: passed, 379 tests
pnpm test:coverage: passed, 379 tests
```

## 13. Not Implemented

- first-night task plan.
- scheduled night task skeleton.
- MINION_INFO task settlement.
- DEMON_INFO task settlement.
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

## 14. BLOCKER Status

No implementation-level Slice 2B3 blocker is known after local typecheck, lint, test, and coverage.

CI status is not claimed here until the PR checks complete.

## 15. Next Step

Recommended next slice after this PR is reviewed and merged:

```text
Phase 3 Slice 2B4: First Night Task Plan and ScheduledTask Skeleton
```

Do not start Slice 2B4 from this PR.
