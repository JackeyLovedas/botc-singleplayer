# Current Task

## Slice 2B15 Design Review Round 1 Requires Fixes; Architect Revision Underway

- There is no open slice pull request.
- The active branch is `main`; independent design review round 1 inspected exact HEAD `a31562b5d0751128b94b82289c2d21e954ea5ad7`.
- Fresh 2B15 evidence remains `RULE_READY` with `SKELETON` coverage at `docs/rules/evidence/2B15.md`.
- The current proposed design remains at `docs/implementation/phase-3-slice-2b15-design.md`; it is not approved for implementation.
- The reviewer's complete round-1 report is materialized at `docs/implementation/phase-3-slice-2b15-design-review-round-1.md`.
- Review verdict: `RULE_DESIGN_FIX_REQUIRED`.
- Required source material was available and showed no substantive conflict; R01–R13 and the first-/other-night ordering were independently confirmed.
- Blocker 1: replace the incorrect Legacy V1 example with an explicit exact V1/V2 discriminated contract covering validation, clone, equality, application, and replay.
- Blocker 2: remove secret-dependent modifier rejection as an observable oracle; select a safe public capability boundary or fully simulate all reachable hidden modifiers, and do not claim unrepresentable registration fail-closed behavior.
- Blocker 3: derive stable once-per-game `AbilityInstanceId` from role/ability tenure rather than `scheduledTaskId`, preserving future-night, reacquisition, revival, and Barista semantics.
- Blocker 4: define creation revision `N`, settlement revision `M`, field bindings, settlement snapshot consistency, and source ability-tenure continuity across the opportunity.
- Blocker 5: correct overclaims in the R01–R13 and 39-scenario mapping, especially R02, R05, scenarios 15 and 23, and acceptance test 18.
- Blocker 6: define an exact, extensible private projection contract that validates the complete choice/spend/delivery/settlement stored-fact chain and exposes only source-visible targets plus delivered answer.
- The four-event atomic order is acceptable only after ability identity, dual-revision, and stored-fact projection validation are corrected.
- The read-only architect is preparing one bounded revision addressing all six blocker classes.
- No 2B15 implementation, feature branch, pull request, production change, test change, architecture change, or coverage-matrix change is authorized.

## Gate

- Completed for 2B15: fresh evidence -> `RULE_READY` -> proposed design -> independent review round 1 -> `RULE_DESIGN_FIX_REQUIRED`.
- Current action: one bounded architect revision traced to every round-1 blocker without expanding into implementation.
- After the revised design is materialized, a new independent source/evidence and rule-design review is required.
- Implementation remains blocked until the reviewer returns `RULE_DESIGN_PASS` on the revised exact HEAD and the controller confirms the gate.
- Any unresolved source conflict, unavailable mandatory source, unsafe hidden-state oracle, or need to guess unsupported rules maps to `HUMAN_BLOCKED`.
- Do not create a feature branch or pull request, and do not edit production code, tests, architecture, or the coverage matrix during design repair.
- Preserve one writer and one open slice pull request at a time.
