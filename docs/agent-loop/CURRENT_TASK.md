# Current Task

## Slice 2B16 Design Materialized — Awaiting Independent RULE_DESIGN Review

- Candidate role: `Cerenovus / 洗脑师`.
- Complete fresh rule evidence: `docs/rules/evidence/2B16.md`.
- Evidence SHA-256: `6306ec6c008c72c276ccbf1fcddc0b14dd299ae5ded015c1bb55b6693aff2ef9`.
- Materialized proposed design: `docs/implementation/phase-3-slice-2b16-design.md`.
- Design SHA-256: `82cf080b1eceffbf6ec5efaf6bf38c2e5164413620f7e1185e3d616f2c56adaf`.
- The architect's terminal design status is `READY_FOR_RULE_DESIGN_REVIEW`; this is not `RULE_DESIGN_PASS`.
- There is no active feature branch, PR, reviewed design, production change, or test change for Slice 2B16.

## Proposed Design Boundary

- One bounded base first-night Cerenovus command records an atomic choice, represented resolution, private target notification, and neutral task settlement.
- Effective, represented-drunk, and represented-poisoned branches expose the same four accepted event types and the same target-visible notification while keeping branch truth inside the undisclosed resolution payload.
- Effective resolution records historical requirement-creation facts and exact anchors only; impaired resolution records simulation evidence only. Neither branch introduces judgment, enforcement, execution, death, recurrence, or a general effect lifecycle.
- Selected characters are restricted to on-script Townsfolk or Outsiders; modeled roster self-targeting is legal. Gained abilities, other-night execution, Goblin/Vigormortis interactions, UI, AI policy, and general lifecycle work remain out of scope.
- Overall Cerenovus coverage must remain `PARTIAL`.

## Next Gate

1. Launch at most one independent bounded read-only reviewer against the exact committed evidence and design.
2. Materialize the review result without changing the proposed design, production code, tests, architecture, or coverage matrix.
3. Require a complete `RULE_DESIGN_PASS` and explicit controller authorization before creating a feature branch or beginning implementation.

## Round Limits

- `maxSlices = 1`; this round may cover only Slice 2B16.
- `maxRepairRounds = 2` for a future Slice 2B16 PR.
- Heartbeat remains disabled.
- Do not start, research, design, or implement 2B17 in this round.
