# Phase 3 Slice 2B2: Seat Roster and Character Assignment Status

## 1. Scope

- Repository: `JackeyLovedas/botc-singleplayer`
- Branch: `phase-3/seat-roster-character-assignment`
- Slice: fixed 12-seat roster plus deterministic character assignment.

This slice does not implement first-night tasks, night order, demon or minion information display, player private knowledge, AI decisions, nomination, voting, execution, UI, Electron, or SQLite.

## 2. Package Boundaries

- `packages/domain-core`: owns roster and assignment contracts, replay validation, state fields, command payload types, and version constants.
- `packages/assignment-engine`: owns deterministic assignment generation.
- `packages/application`: consumes assignment generation only through `CharacterAssignmentGeneratorPort`.
- `packages/setup-engine`: still owns setup generation only.
- `packages/test-harness`: provides legal command and event fixtures for tests.

Dependency direction remains inward:

```text
assignment-engine -> domain-core
application -> domain-core + application-defined ports
test-harness -> application + domain-core + setup-engine + assignment-engine
```

`application` does not import `assignment-engine` directly.

## 3. Player Roster

`PlayerRoster` is a sorted fixed 12-seat list:

- exactly one `HUMAN` player.
- exactly eleven `AI` player slots.
- no Storyteller entry; Storyteller remains outside the 12-player roster.
- seats are consecutive `1..12`.
- player IDs and seat numbers are unique.
- display names are trimmed, non-empty, at most 64 characters, and reject control characters.

Supported roster version:

```text
fixed-12-player-roster-v1
```

`CreatePlayerRoster` records a single `PlayerRosterCreated` domain event and does not change phase.

## 4. Character Assignment

`assignment-engine` takes:

- `rootSeed`
- `rosterVersion`
- `PlayerRoster`
- generated setup `actualRoles`
- setup `roleCatalogSignature`

It canonicalizes the generated actual roles, derives a dedicated assignment random stream, shuffles roles deterministically, and assigns the result to seats sorted by `seatNumber`.

Assignment intentionally does not generate demon bluffs, role abilities, night tasks, or any player-visible private knowledge.

Version constants:

```text
randomAlgorithmVersion = xmur3-sfc32-rejection-v1
assignmentAlgorithmVersion = snv-12-assignment-v1
randomStream = assignment/sects-and-violets/12/v1
```

## 5. Command And Event Flow

New commands:

- `CreatePlayerRoster`
- `AssignCharacters`

New domain events:

- `PlayerRosterCreated`
- `CharactersAssigned`

`AssignCharacters` records an integrated two-event batch:

```text
CharactersAssigned
PhaseTransitioned(CHARACTER_ASSIGNMENT -> FIRST_NIGHT, CHARACTERS_ASSIGNED)
```

Bare `CharactersAssigned`, bare `PhaseTransitioned(CHARACTERS_ASSIGNED)`, reversed batch order, metadata mismatches, and assignment before roster are rejected.

## 6. Replay Validation

Replay validates assignment events against the historical setup event payload:

- supported roster version.
- supported assignment algorithm version.
- supported random algorithm version.
- supported assignment random stream.
- `CharactersAssigned.rosterVersion` must match the already applied `PlayerRosterCreated.rosterVersion`.
- assignment role catalog signature must equal setup role catalog signature.
- assignments must be sorted by seat.
- every assignment player and seat must match the roster.
- every player, seat, and assigned role must be unique.
- assigned role snapshots must match setup `actualRoles`.
- assigned role snapshots must also match setup `roleCatalogSnapshot`.

This prevents replay from reinterpreting old setup events through a future role catalog.

## 7. Complete Retryable Failure Boundary

Before Slice 2B2, application dependency failures during generated setup could be recorded as permanent command rejections. This branch separates retryable runtime failures from valid command rejections:

- deterministic domain rejections still become command receipts.
- missing or throwing setup/assignment generators return `CommandExecutionFailed`.
- event-store append failures return `CommandExecutionFailed`.
- retryable failures do not write rejected command receipts.

`CommandExecutionFailed` now records:

```text
status = failed
retryable = true
failureStage
currentGameVersion only when the version is known
```

Unknown current versions are not represented as fake `0` values.

## 8. Disjoint Rejection And Execution Failure Codes

`CommandRejected` and `CommandExecutionFailed` have disjoint code sets.

Runtime-only codes:

```text
ApplicationNotConfigured
DependencyExecutionFailed
CommandStoreReadFailed
CommandReceiptWriteFailed
EventStoreAppendFailed
MetadataGenerationFailed
```

These codes cannot be used to construct rejected command receipts at the type boundary. `EventStoreAppendFailed` is accepted-commit failure only and cannot enter `CommandReceiptResult`.

## 9. Command Store Read Failure Handling

`findCommandReceipt` and `loadDomainEvents` are individually protected:

- receipt read failure returns `CommandStoreReadFailed` at `receipt-read`.
- event load failure returns `CommandStoreReadFailed` at `event-load`.
- both omit `currentGameVersion`.
- neither writes domain events or command receipts.
- once storage recovers, the same command id can be retried normally.

Rejected receipt writes are also protected:

- `recordRejectedCommand` failure returns `CommandReceiptWriteFailed`.
- failure stage is `rejected-receipt-write`.
- the deterministic rejection is not claimed as persisted.
- after storage recovers, the same command id can re-run and then become idempotent only after the receipt is successfully written.

## 10. Metadata Dependency Failure Handling

Event metadata dependencies are protected separately from domain validation:

- `ids.nextBatchId()`
- `ids.nextEventId()`
- `clock.now()`

Failures return:

```text
code = MetadataGenerationFailed
failureStage = event-metadata
retryable = true
```

No domain event or command receipt is written, and the same command id remains reusable.

## 11. DomainError And Unknown Exception Classification

Only explicit `DomainError` instances become deterministic `DomainValidationFailed` rejected receipts.

Unexpected ordinary `Error` values or unknown thrown objects become retryable `DependencyExecutionFailed` results and do not persist receipts. This applies to batch construction and prospective validation.

## 12. Canonical Player Display Names

Roster event display names must be canonical:

```text
displayName === displayName.trim()
```

`CreatePlayerRoster` still accepts command input with surrounding whitespace and trims it before writing `PlayerRosterCreated`.

Display names reject:

```text
U+0000-U+001F
U+007F
U+0080-U+009F
```

Internal ordinary spaces remain legal, including names such as `Alice Smith` and `玩家 一`. Chinese and emoji display names are allowed when they do not contain control characters.

## 13. Roster Version Binding

`CharactersAssigned` validates:

```text
payload.rosterVersion === SUPPORTED_ROSTER_VERSION
payload.rosterVersion === state.roster.rosterVersion
```

This keeps assignment facts bound to the actual roster event that was applied before assignment.

## 14. Assignment Catalog Signature Constraint

`assignment-engine` now requires:

```text
roleCatalogSignature = canonical-role-catalog-v1:60ac4718
```

Empty signatures and arbitrary non-empty signatures return `InvalidRoleCatalogSignature`.

## 15. Golden Assignment

Golden input:

```text
rootSeed = golden-seed
humanSeatNumber = 5
roleCatalogSignature = canonical-role-catalog-v1:60ac4718
assignmentAlgorithmVersion = snv-12-assignment-v1
randomStream = assignment/sects-and-violets/12/v1
```

Golden seat-role mapping:

```text
1:savant
2:evil_twin
3:sage
4:town_crier
5:philosopher
6:juggler
7:vigormortis
8:witch
9:flowergirl
10:oracle
11:mutant
12:dreamer
```

## 16. Quality Gates

Latest local gates after PR #4 final hardening:

```text
pnpm typecheck: passed
pnpm lint: passed
pnpm test: passed, 295 tests
pnpm test:coverage: passed, 295 tests
pnpm --filter @botc/setup-engine test: passed, 50 tests
pnpm --filter @botc/assignment-engine test: passed, 13 tests
```

## 17. Not Implemented

- first-night task initialization.
- night order.
- demon or minion information display.
- player private role knowledge.
- role abilities.
- AI decisions.
- automatic Storyteller decisions.
- nomination.
- voting.
- execution.
- death.
- victory.
- UI.
- Electron.
- SQLite.

## 18. BLOCKER Status

No implementation-level Slice 2B2 blocker is known before final local and CI verification.

## 19. Next Step

Recommended next slice after this PR is reviewed and merged:

```text
Phase 3 Slice 2B3: First Night Initialization and Private Knowledge Bootstrap
```

Do not start Slice 2B3 from this PR.
