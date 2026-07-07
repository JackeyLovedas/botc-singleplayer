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

## 7. Test Results

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test`: passed, 69 tests.
- `pnpm test:coverage`: passed.

## 8. Not Implemented

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

## 9. Why No Setup Placeholder

Slice 2A deliberately does not create setup placeholder events or fake assignment facts. Writing placeholder setup facts into the authoritative domain event log would make later replay and migration treat incomplete development scaffolding as real game truth.

Later phase paths are tested through pure policy tests and explicit test fixtures, not by committing fake production facts.

## 10. Next Step

Recommended next slice: Slice 2B only after real setup and assignment events exist.

Slice 2B should integrate:

- setup generation.
- assignment events.
- first night entry.
- first day entry.
- nomination and voting flow.
- one complete day/night loop.

## 11. BLOCKER Status

No BLOCKER identified for Slice 2A.
