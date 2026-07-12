# Phase 3 Slice 2B17.3 Implementation Status

## Status

`READY_TO_PUBLISH`

## Implemented Boundary

- `createFirstNightTaskInsertedV2Payload` now resolves the chosen-role mapping first and returns `undefined` before reading plan, catalog, or grant fields when no insertion is required.
- Mapped legacy V1 choices still fail closed through the existing application pre-gate and the domain builder's V2 plan requirement.
- No application production branch, event shape, task ID, plan version, projection, role rule, or V2 scheduling contract changed.
- `ruleSemanticsChanged=false`.

## Regression Coverage

- Direct builder coverage includes V1 Artist, Barber, and Philosopher no-op; V2 Artist and Barber no-op; hostile unreadable plan/grant probes; mapped V1 Snake Charmer and Clockmaker rejection; malformed mapped catalog/grant rejection; and exact V2 payload preservation.
- A real writable accepted V1 history proves Artist choice, exact three-event settlement, no insertion or impairment, one version increment, accepted receipt, idempotency, opportunity closure, `MINION_INFO` progression, batch validation, stream validation, and rebuild.
- A deterministic in-play Town Crier fixture proves duplicate DRUNK, no insertion, replay, and unchanged player/AI projection boundaries.
- Snake Charmer, Clockmaker, Dreamer, Seamstress, and Mathematician are parameterized through the complete V1 no-write fail-closed contract.
- Existing V1 replay/mixed-generation and V2 mapped/no-mapped position, system-information, base-first, seat/task-ID tie-break tests remain green.

## Local Validation

- Focused: 2 files / 222 tests passed.
- Full: 28 files / 923 tests passed.
- Coverage: 86.09% statements/lines, 80.27% branches, 97.88% functions.
- `pnpm typecheck`: PASS.
- `pnpm lint`: PASS.
- `git diff --check`: PASS.
- New-production forbidden-pattern scan: PASS.

## Preserved Blocks

`docs/rules/evidence/2B18.md` remains unchanged at SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`. Slice 2B18 remains `HUMAN_BLOCKED` on four conflicts. Slice 2B19 was not started.
