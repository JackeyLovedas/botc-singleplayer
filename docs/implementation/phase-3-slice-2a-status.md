# Phase 3 Slice 2A: Phase State Machine Core Status

## 1. PR #1 Merge

- Repository: `JackeyLovedas/botc-singleplayer`
- PR #1 merge commit: `c1ef23020a00242bad287952f88149f2c3e92447`
- Slice 1 tag: `phase-3-slice-1-domain-event-spine`
- Slice 2A branch: `phase-3/phase-state-machine-core`

## 2. GamePhase Model

`domain-core` now defines strict game phases:

- `GAME_CREATION`
- `SCRIPT_SELECTION`
- `SETUP_GENERATION`
- `CHARACTER_ASSIGNMENT`
- `FIRST_NIGHT`
- `DAWN_RESOLUTION`
- `DAY_DISCUSSION`
- `NOMINATION_WINDOW`
- `VOTING`
- `EXECUTION_RESOLUTION`
- `NIGHT_TASKS`
- `GAME_ENDED`

`GameCreated` rebuilds canonical state into:

- `phase = SCRIPT_SELECTION`
- `dayNumber = 0`
- `nightNumber = 0`

`GAME_CREATION` remains a conceptual phase before a `GameState` exists.

## 3. PhaseTransitioned Event

`PhaseTransitioned` is the only domain event that changes `GameState.phase`.

Payload records:

- `rulesBaselineVersion`
- `fromPhase`
- `toPhase`
- `transitionReason`
- `dayNumberBefore`
- `dayNumberAfter`
- `nightNumberBefore`
- `nightNumberAfter`

Event application rejects:

- `fromPhase` mismatch against current state.
- negative day or night counters.
- illegal phase transitions.
- attempts to leave `GAME_ENDED`.
- rules baseline mismatch.
- transition reason mismatch against policy `reasonCode`.

## 4. SelectScript Multi-Event Batch

`SelectScript` now commits one atomic batch with two domain events:

1. `ScriptSelected`
2. `PhaseTransitioned`

Both events share:

- `batchId`
- `commandId`
- `gameVersion`
- `rulesBaselineVersion`

Event sequences are consecutive. The batch increments `gameVersion` once and rebuilds to `SETUP_GENERATION`.

## 5. CommandBus Wiring

`packages/application/src/game-command-bus.ts` adds `GameCommandBus`.

`GameCommandBus.execute(command)` routes through:

1. `GameSessionRunner.enqueue(command.gameId, ...)`
2. `GameApplicationService.execute(command)`

Production callers should use `GameCommandBus` and must not bypass it by calling `GameApplicationService.execute` directly. Tests may still use `GameApplicationService` directly for focused application-service checks.

## 6. Phase Counter Rules

The pure phase transition policy defines future phase movement without creating production commands for those transitions.

Counter rules:

- entering `FIRST_NIGHT` sets `nightNumber = 1`.
- entering `DAY_DISCUSSION` from dawn increments `dayNumber`.
- entering `NIGHT_TASKS` after execution increments `nightNumber`.
- returning from `VOTING` to `NOMINATION_WINDOW` does not change day or night counters.

## 7. Semantic Pre-Commit Validation

`GameApplicationService` now validates candidate domain events before calling `CommandCommitStore.commitAcceptedCommand`.

Flow:

1. load current domain events.
2. rebuild current canonical state.
3. validate the command.
4. build the candidate event batch.
5. apply the candidate events to the current state with `applyDomainEventBatch`.
6. reject as `DomainValidationFailed` if the prospective state is invalid.
7. atomically commit only after semantic validation passes.

The test memory store also validates staged events with both `validateDomainEventStream(stagedEvents)` and `rebuildGameState(stagedEvents)` before writing.

## 8. Script Selection Invariants

Application command validation now rejects:

- missing game: `GameNotCreated`.
- already selected script: `ScriptAlreadySelected`.
- wrong phase: `CommandNotAllowedInPhase`.

Domain replay independently rejects:

- `ScriptSelected` outside `SCRIPT_SELECTION`: `InvalidScriptSelectedPhase`.
- duplicate `ScriptSelected`: `DuplicateScriptSelected`.

## 9. Typed Transition Reasons

`PhaseTransitioned.payload.transitionReason` is now a `PhaseTransitionReason`, not free text.

`evaluatePhaseTransition` returns `reasonCode`, and event replay requires:

```text
event.payload.transitionReason === policy.reasonCode
```

Mismatch is rejected as `InvalidPhaseTransitionReason`.

## 10. Game End Entry Phases

Allowed `GAME_ENDED` entries:

- `FIRST_NIGHT`
- `DAWN_RESOLUTION`
- `DAY_DISCUSSION`
- `NOMINATION_WINDOW`
- `VOTING`
- `EXECUTION_RESOLUTION`
- `NIGHT_TASKS`

Disallowed direct entries:

- `SCRIPT_SELECTION`
- `SETUP_GENERATION`
- `CHARACTER_ASSIGNMENT`
- `GAME_ENDED` back to any active phase.

## 11. Phase Counter Invariants

`validatePhaseCounters` enforces phase-specific counter states:

- setup phases require `dayNumber = 0` and `nightNumber = 0`.
- `FIRST_NIGHT` requires `dayNumber = 0` and `nightNumber = 1`.
- `DAWN_RESOLUTION` and `NIGHT_TASKS` require `nightNumber = dayNumber + 1`.
- day phases require `dayNumber = nightNumber` and `dayNumber >= 1`.
- `GAME_ENDED` may inherit either day-phase or night/dawn counter shape.

`evaluatePhaseTransition` rejects invalid current counters and invalid computed next counters instead of repairing them.

## 12. Test Results

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test`: passed, 81 tests.
- `pnpm test:coverage`: passed.

## 13. Not Implemented

- real setup generation.
- role pool validation.
- character assignment.
- demon bluffs.
- night tasks.
- nomination entities.
- vote counting.
- ghost vote handling.
- on-the-block state.
- execution rules.
- death rules.
- victory conditions.
- AI.
- UI.
- Electron.
- SQLite adapter.
- generic production `AdvancePhase` command.

## 14. Why No Setup Placeholder

Slice 2A deliberately does not create setup placeholder events or fake assignment facts. Writing placeholder setup facts into the authoritative domain event log would make later replay and migration treat incomplete development scaffolding as real game truth.

Later phase paths are tested through pure policy tests and explicit test fixtures, not by committing fake production facts.

## 15. Next Step

Recommended next slice: Slice 2B only after real setup and assignment events exist.

Slice 2B should integrate:

- setup generation.
- assignment events.
- first night entry.
- first day entry.
- nomination and voting flow.
- one complete day/night loop.

## 16. BLOCKER Status

No BLOCKER identified for Slice 2A.
