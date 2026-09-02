# Phase 3 Slice 5 — Verification-Only Interaction Traceability

This implementation extends the existing F06 application integration test with
assertion-only public/player projection and accepted-stream replay parity
checks. No new Vitest physical identity or semantic criterion is introduced.

## Frozen bindings

- Design head: `c36cf09` (`docs/architecture/phase-3-slice-5-one-verified-interaction-design.md`).
- Implementation head: `29e6a69`.
- Selected interaction: `CORE_DAY_EXECUTION_PROJECTION_REPLAY_INTERACTION_V1`.
- Production source delta: `0` (72 source files remain in the active profile).
- New semantic criterion IDs: `0`.
- New physical test identities: `0`.
- Test identity delta: `+0/-0`.

## Existing-ID mapping

| Interaction segment | Existing accepted authority |
| --- | --- |
| setup/assignment and day entry | `GI-C01`, `A`, `B`, `F`, `G` |
| living nomination | `GI-C05`, `H`, `S3-C01` |
| vote lifecycle and block | `GI-C06`, `I`, `J`, `S3-C03` |
| execution and independent death | `GI-C07`, `GI-C08`, `K`, `L`, `S3-C04`, `S4-C06` |
| public nomination/vote/execution projection | `S4-C01`, `S4-C05`, `S4-C06` |
| viewer-bound projection and leakage boundary | `S4-C02`, `S4-C03`, `S4-C10` |
| accepted replay and hostile replay | `GI-C03`, `GI-C04`, `GI-C13`, `S4-C07`, `R` |

The physical test remains the existing F06 test titled
`accepts CompleteNight and reaches day, vote, execution, and ordinary-night
planning`. The new assertions bind the same accepted command stream to the
existing IDs above; they do not create an `S5-*` rule identity.

## Verified checkpoints

The real `GameApplicationService` command path creates setup, assignment,
first-night completion, dawn, nomination, vote, close, and execution facts.
After execution, the test verifies:

1. public projection equals the projection rebuilt from the complete accepted
   event stream;
2. nomination, vote, execution, phase, and life-status fields are present;
3. `ExecutionResolved` and `PlayerDied` remain separate through the existing
   canonical state;
4. a viewer-bound player projection equals its replayed projection and its
   public subview;
5. assignment, truth, cause, receipt, event, and current-character internals
   are absent from the player projection.

The existing F06 forged transition, repeat-nomination, cause, and ordering
mutations continue to exercise fail-closed replay boundaries. No direct event
append, manual assignment, manual death flag, or forced projection fixture is
used by the added assertions.

## Non-delta assertions

- `newCommands=0`, `newDomainEvents=0`, `newC1Descriptors=0`.
- `newVictoryInfrastructure=0`, `newGameOverState=0`, `newVictoryEvents=0`.
- Evil Twin remains `PARTIAL`; no victory behavior or rule evidence changes.
- No role coverage status changes and no 2B18 work.
- Slice 4 projection schema and profile remain unchanged.
- Because the canonical test inventory is unchanged at 1,746 identities, no
  new coverage profile is created; the Slice 4 profile remains the active
  profile for this verification-only extension.
