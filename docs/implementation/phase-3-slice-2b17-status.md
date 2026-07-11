# Phase 3 Slice 2B17 Status: Local Implementation Validation

## Gate Status

- Rule evidence: `RULE_READY`.
- Rule design: `RULE_DESIGN_PASS` for the exact round-3 design.
- Implementation: complete in the bounded feature worktree; no commit, push, PR, exact-head CI, or final review yet.
- Traceability: rows `1..99` audited; rows `32` and `33` received dedicated order assertions; row `34` remains `EXTERNAL_RULE_EVIDENCE` only.
- Coverage target/status: `PARTIAL`, never `COMPLETE`.

## Implemented Boundary

The slice implements the exact two-event first-night Clockmaker information pipeline for base and Philosopher-gained sources, canonical Philosopher duplicate drunkenness, current native character-type identity, a preceding Snake Charmer swap, effective current Vortox false-only information with exact historical tenure binding, replay/batch/prospective validation, deterministic receipts and source-only historical projection.

The delivered number is stored history. Projection does not expose native identities, pair geometry, rule-correct distance, legal candidates, impairment facts, Vortox facts, simulation policy, assignment, current state, or task details.

## Explicitly Unsupported

Registration, Spy/Recluse/Summoner execution, Travellers, death/revival, canonical poisoned Clockmaker, impaired Vortox, no/multiple native Demon histories, no/noncanonical Minion histories, later-night acquisition, recurrence, generic tenure/ability refactoring, general character/alignment changes, free-form Storyteller selection, UI, persistence, first-night completion, and Slice 2B18 remain unsupported.

## Provenance

- Evidence: `docs/rules/evidence/2B17.md`, SHA-256 `db1fb83335e6a2083f85797b83516b8b646538ee3afcfd5ac92319147432d97e`.
- Design: `docs/implementation/phase-3-slice-2b17-design.md`, SHA-256 `fde5aebea89e003c38938c338abfd4fdd1370c88814f965c41a0dcda7b3d1e06`.
- Design review: `docs/implementation/phase-3-slice-2b17-design-review-round-3.md`, SHA-256 `2c472cfdca5578d0aa556e4ec02761854362fcf3470a4188e294cfe74dafbe62`.
- Official nightsheet evidence: commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

## Local Validation

- Focused Clockmaker/order/projection/application suites: 7 files, 341 tests passed.
- Typecheck: passed.
- Changed-file and full lint: passed with zero warnings.
- Full test: 28 files, 891 tests passed.
- Coverage: 28 files, 891 tests passed; 85.85% statements/lines, 79.93% branches, 97.84% functions.
- `clockmaker.ts`: 97.95% statements/lines, 91.42% branches, 100% functions.
- Determinism/leakage scan and `git diff --check`: passed.
- Windows deterministic CI now directly runs the three Clockmaker domain/replay/order suites before projection, task-engine, and application package tests; exact-head CI remains pending until push.
- Post-gate workflow-only validation: the exact Windows command executed 3 files / 46 tests (not a no-op); YAML parse, typecheck, full lint, and diff checks passed. No production or test behavior changed after the recorded full coverage run, so coverage was not rerun.

## Next Gate

Controller pre-publish audit is next. Only after approval may the bounded work be committed with required attribution, pushed, and opened as one PR. Merge remains blocked on exact frozen-head CI and a complete independent review returning both required pass verdicts with no blockers.
