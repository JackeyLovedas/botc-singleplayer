# Phase 3 Slice 2B18A Implementation Status

## Scope

Implemented only the reviewed `FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_FOUNDATION` from `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md` (`615f4cb303cbcb6884f37cf6f46eb6733e1df631c68a9a3fa9085da26134d865`). Rule evidence is `docs/rules/evidence/2B18-resolved.md` (`RULE_READY`, `PARTIAL`). The independent design verdict is `RULE_DESIGN_PASS` with no blockers.

## Implemented

- Derived canonical `FirstNightAbilityOutcomeLedger` initialized by `FirstNightInitialized`, with an exclusive lower boundary and state-bound inclusive resolver upper boundary.
- Canonical fact and ability-instance IDs, formatter round-trip and embedded provenance checks, base and Philosopher-gained V1/V2 provenance, closed 16-variant evidence union, exact nested/value validators, frozen primary identities, canonical ordering, duplicate removal, conflict rejection, field-by-field canonical deep clones, and fail-closed domain errors.
- One event-applier derivation hook for the frozen terminal allowlist. Intermediate choice, marker, impairment, planning, settlement, and system-information events do not independently create outcome facts.
- Terminal pre-state adapters for Philosopher, Snake Charmer, Evil Twin, Witch, Cerenovus, Clockmaker, Dreamer, and Seamstress, including historical role/tenure/evidence links, the ineffective Snake Charmer target-role quadrant, and the Dreamer/Vortox proven-versus-unproven matrix.
- Public state-only `resolveFirstNightMathematicianTrueCountFromState(stateBeforeResolution: unknown)` constructs a validated module-private canonical context, with own-instance exclusion, exclusive/inclusive window filtering, pending exclusion, same-player unresolved redundancy, player deduplication, stable ordering, and fixed `0..11` product domain.
- GameState/rebuild integration and package-root public contracts. Ledger, evidence, context, and count do not enter player or AI projections.

## Explicitly Unsupported

- `MathematicianInformationDelivered`, `SettleMathematicianInformation`, `MATHEMATICIAN_INFORMATION` settlement, receipt, private number projection, candidate selection, Storyteller final choice, or Vortox final false-number delivery.
- General dawn/day/later-night windows, nominations, executions, deaths, Witch trigger lifecycle, Cerenovus execution, Evil Twin later lifecycle, continuous poison, registration, Travellers, Pit-Hag, Barber, UI, Electron, SQLite, snapshot migration, Slice 2B18B, and Slice 2B19.
- The Mathematician remains `PARTIAL`, never `COMPLETE`.

## Rule-to-Test Traceability

- Window, ID/provenance round-trip, all 16 evidence variants, V1/V2 nested generation, frozen identities, exact count variants, conflict ordering, and nested clone isolation: `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`.
- Hostile Proxy/getter/sparse/cycle/symbol/nonplain fail-closed validation: the same dedicated test file.
- Canonical-context forgery rejection, lower-window rejection, Snake Charmer historical-target classification, Dreamer/Vortox applicability, count status classification, player deduplication, and unresolved redundancy: the same dedicated test file.
- Deterministic replay append assertions for effective/impaired Witch and Dreamer: `packages/domain-core/src/rebuild.test.ts`; gained-Mathematician ledger presence and unchanged fail-closed application boundary: `packages/application/src/game-application-service.test.ts`.
- Projection non-leakage with injected ledger sentinels: `packages/projections/src/private-knowledge-view.test.ts`.

## Validation

- Focused: dedicated ledger `19/19`, rebuild `182/182`, projection `77/77`, and gained-Mathematician application regression passed.
- Full: `29 files / 942 tests passed`.
- Coverage: `86.27%` statements/lines, `80.32%` branches, `97.44%` functions.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, and affected-file lint passed.
- Final diff/forbidden scans and exact-head GitHub CI are required before handoff.
