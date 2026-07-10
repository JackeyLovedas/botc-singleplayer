# Current Task

## Slice 2B15 Design Review Round 2 Requires Fixes; Architect v3 Underway

- There is no open slice pull request.
- The active branch is `main`; independent design review round 2 inspected exact `main@5059b49b2e7da4c6550ae513cf660f84abcb98f3` with a clean worktree.
- Fresh 2B15 evidence remains `RULE_READY` with `SKELETON` coverage at `docs/rules/evidence/2B15.md`.
- The complete v2 design remains unchanged at `docs/implementation/phase-3-slice-2b15-design.md`.
- The round-1 review remains unchanged at `docs/implementation/phase-3-slice-2b15-design-review-round-1.md`.
- The reviewer's complete round-2 report is materialized at `docs/implementation/phase-3-slice-2b15-design-review-round-2.md`.
- Round-2 verdict: `RULE_DESIGN_FIX_REQUIRED`.
- Mandatory sources were available and consistent; this is not `HUMAN_BLOCKED`. Impaired once-per-game use is spent, impairment may still receive true information, and effective Vortox requires false information even when Seamstress is impaired.
- Remaining blocker 1: replace internally impossible `NOT_PROVEN` candidate legality with an exact complete/partial legality-knowledge union, and ensure only impairment of the current Vortox tenure disables the Vortox constraint; Seamstress-source impairment does not.
- Remaining blocker 2: make `RoleTenureId` exactly implementable with deterministic initial/transition grammar, parser/equality, retained starting-fact identity, replay continuity over `[N,M]`, a bounded test-22 reducer fact, and collision-free Philosopher grant/tenure identity without introducing a general lifecycle subsystem.
- Remaining blocker 3: move evidence scenario 7 from full to partial coverage because later-night opportunity creation remains absent.
- The reviewer found the remaining V1/V2 discrimination, public capability, non-oracle behavior, truth-favoring delivery, No Dashii restraint, N/M ownership, atomic chain, and source-only multi-entry projection design sound.
- The read-only architect is preparing one bounded v3 correction addressing exactly these three blockers.
- No `RULE_DESIGN_PASS` exists. No 2B15 implementation, feature branch, pull request, production change, test change, architecture change, or coverage-matrix change is authorized.

## Gate

- Completed for 2B15: fresh evidence -> initial design -> round-1 `RULE_DESIGN_FIX_REQUIRED` -> v2 -> round-2 `RULE_DESIGN_FIX_REQUIRED`.
- Current action: one bounded architect v3 correction for legality knowledge/Vortox qualification, exact tenure identity/continuity, and scenario-7 coverage.
- After v3 is materialized, another independent source/evidence, repository-contract, and rule-design review is required on its exact committed HEAD.
- Implementation remains frozen until an independent reviewer returns `RULE_DESIGN_PASS` and the controller confirms the gate.
- V3 must stop rather than introduce an out-of-scope general character lifecycle subsystem.
- Further source conflict or unavailable mandatory evidence maps to `HUMAN_BLOCKED`.
- Do not create a feature branch or pull request, and do not edit production code, tests, architecture, or the coverage matrix during design repair.
- Preserve one writer and one open slice pull request at a time.
