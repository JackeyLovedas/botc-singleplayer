# Phase 3 Slice 2B18A Implementation Status

## Scope

Implemented only the reviewed `FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_FOUNDATION` from `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md` (`615f4cb303cbcb6884f37cf6f46eb6733e1df631c68a9a3fa9085da26134d865`). Rule evidence is `docs/rules/evidence/2B18-resolved.md` (`RULE_READY`, `PARTIAL`). The independent design verdict is `RULE_DESIGN_PASS` with no blockers.

## Implemented

- Derived canonical `FirstNightAbilityOutcomeLedger` initialized by `FirstNightInitialized`, with an exclusive lower boundary and state-bound inclusive resolver upper boundary.
- Canonical fact and ability-instance IDs, base and Philosopher-gained V1/V2 provenance, closed 16-variant evidence union, exact-key validators, canonical ordering, duplicate removal, conflict rejection, deep clones, and fail-closed domain errors.
- One event-applier derivation hook for the frozen terminal allowlist. Intermediate choice, marker, impairment, planning, settlement, and system-information events do not independently create outcome facts.
- Terminal pre-state adapters for Philosopher, Snake Charmer, Evil Twin, Witch, Cerenovus, Clockmaker, Dreamer, and Seamstress, including current historical role/evidence links and frozen pending/unresolved boundaries.
- Public state-only `resolveFirstNightMathematicianTrueCountFromState(stateBeforeResolution: unknown)` with own-instance exclusion, window filtering, pending exclusion, unresolved result, player deduplication, stable ordering, and fixed `0..11` product domain.
- GameState/rebuild integration and package-root public contracts. Ledger, evidence, context, and count do not enter player or AI projections.

## Explicitly Unsupported

- `MathematicianInformationDelivered`, `SettleMathematicianInformation`, `MATHEMATICIAN_INFORMATION` settlement, receipt, private number projection, candidate selection, Storyteller final choice, or Vortox final false-number delivery.
- General dawn/day/later-night windows, nominations, executions, deaths, Witch trigger lifecycle, Cerenovus execution, Evil Twin later lifecycle, continuous poison, registration, Travellers, Pit-Hag, Barber, UI, Electron, SQLite, snapshot migration, Slice 2B18B, and Slice 2B19.
- The Mathematician remains `PARTIAL`, never `COMPLETE`.

## Rule-to-Test Traceability

- Window, ID, provenance, evidence exact shapes and conflict ordering: `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`.
- Hostile Proxy/getter/sparse/cycle/symbol/nonplain fail-closed validation: the same dedicated test file.
- Count own/window/status classification, player deduplication, unresolved boundary, and no final number: the same dedicated test file plus the existing application gained-Mathematician fail-closed regression.
- Deterministic rebuild and terminal integration: existing `rebuild.test.ts`, role replay suites, and application tests.
- Projection non-leakage: existing projection suites, which remain green after GameState gains the derived ledger.

## Validation

- Focused: `3 files / 403 tests passed` for ledger, rebuild, and application.
- Full: `29 files / 935 tests passed`.
- Coverage: `86.20%` statements/lines, `80.29%` branches, `96.96%` functions.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, and affected-file lint passed.
- Final diff/forbidden scans and exact-head GitHub CI are required before handoff.
