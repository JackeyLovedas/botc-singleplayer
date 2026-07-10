# Project State

## Product
- Repository: `JackeyLovedas/botc-singleplayer`
- Target: offline single-player Sects & Violets, 12 players (1 human + 11 AI), automated Storyteller.
- Phase: Phase 3 controlled vertical slices.
- Rules baseline: Phase One v2.1.

## Accepted Slices
- 2B1 deterministic S&V setup.
- 2B2 roster and character assignment.
- 2B3 first-night own-character knowledge.
- 2B4 first-night task plan.
- 2B5 ordered minion/demon information settlement.
- 2B6 Philosopher action opportunity and defer settlement.
- 2B7 Philosopher ability choice and dynamic task insertion foundation.
- 2B8 Philosopher-gained Snake Charmer non-demon settlement.
- 2B9 Snake Charmer demon-hit swap and poison marker.
- 2B10 base Snake Charmer action and effectiveness gate.
- 2B11 Evil Twin setup and pair knowledge.
- 2B12 Witch target choice and deferred-death marker.
- 2B13 Dreamer action and historical information delivery.
- 2B14 Seamstress base first-night opportunity and DEFER settlement skeleton.

## Current Delivery
- Open slice PR: none.
- Branch: `main`.
- Latest accepted slice merge: `3f66c99a30e35cc6a0fd39d47285d5ec7bede84b` (PR #16).
- Last reviewed slice HEAD: `833967f44e73294903df47545982a9de86bb33ad`.
- Accepted tag: `phase-3-slice-2b14-seamstress-first-night-defer-skeleton`.
- PR #16 received independent `PASS`, `CODE_REVIEW_PASS`, and `RULE_REVIEW_PASS` at the exact reviewed HEAD.
- All four required PR #16 CI checks succeeded before merge.
- PR #16 was merged as `3f66c99a30e35cc6a0fd39d47285d5ec7bede84b`; the remote feature branch was deleted and `main` was pulled.
- The accepted 2B14 tag was pushed and points to the merge commit.
- Slice 2B14 remains the exact reviewed DEFER-only scope. It does not broaden Seamstress beyond the accepted `SKELETON` coverage and partial base first-night DEFER dimension.
- Candidate Slice 2B15 fresh Seamstress rule evidence is materialized verbatim at `docs/rules/evidence/2B15.md` from live sources retrieved on 2026-07-10.
- The architect's complete 16-section v2 replacement is materialized verbatim at `docs/implementation/phase-3-slice-2b15-design.md`; the superseded round-1 design remains available in Git history at reviewed HEAD `a31562b5d0751128b94b82289c2d21e954ea5ad7`.
- V2 proposes one first-night pipeline for base and currently reachable Philosopher-granted Seamstress sources, with a public pre-assignment capability boundary, hidden-state non-oracle behavior, truth-favoring delivery, represented Vortox handling, exact V1/V2 compatibility, tenure-based ability identity, N/M continuity, conservative claims, and extensible private historical projection.
- Independent design review round 1 inspected exact HEAD `a31562b5d0751128b94b82289c2d21e954ea5ad7`; its complete report is materialized at `docs/implementation/phase-3-slice-2b15-design-review-round-1.md` with verdict `RULE_DESIGN_FIX_REQUIRED`.
- The six blocker classes were exact Legacy V1/V2 discrimination, a non-leaking modifier capability boundary, tenure-based ability identity, explicit N/M continuity, corrected evidence/scenario claims, and exact extensible stored-fact private projection validation.
- Independent design review round 2 inspected exact `main@5059b49b2e7da4c6550ae513cf660f84abcb98f3`; its complete report is materialized at `docs/implementation/phase-3-slice-2b15-design-review-round-2.md` with a second `RULE_DESIGN_FIX_REQUIRED`.
- Three blockers remain: exact complete/partial candidate-legality knowledge with Vortox impairment qualification; implementable role-tenure identity/parser/replay continuity plus collision-free Philosopher identity without a general lifecycle subsystem; and scenario 7 moved from full to partial coverage.
- The reviewer found the remaining V1/V2 discrimination, public capability, non-oracle behavior, truth-favoring delivery, No Dashii restraint, N/M ownership, atomic chain, and source-only multi-entry projection design sound.
- The read-only architect is preparing one bounded v3 correction for the three remaining blockers.
- Research verdict is `RULE_READY`; rule coverage remains `SKELETON`; external-source conflicts are empty; no snapshot was used.
- The report preserves `2B15-R01` through `2B15-R13`, all mandatory source revisions and hashes, 39 required regression tests, and the stale `SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND` repository contradiction.
- Authoritative evidence says a legal impaired two-target use is spent; the stale handoff test is a non-authoritative repository defect, not an external-source conflict.
- No 2B15 implementation, feature branch, pull request, production change, test change, architecture change, or matrix change is authorized or exists; round 2 did not issue `RULE_DESIGN_PASS`.

## Mandatory Rule Gate
- Canonical instructions: `docs/agent-loop/AUTOPILOT_PROMPT.md`.
- Configured roles: read-only `rule-researcher`, read-only `architect`, read-only `reviewer`, and sole-writer `implementer`; the concurrency cap remains three, so gated roles run sequentially where needed.
- Slice 2B14 completed the required rule-evidence, rule-design, independent review, implementation, CI, code/rule review, and merge gates.
- Slice 2B15 completed fresh live-source research, materialized evidence, the `RULE_READY` gate, an initial design, independent review round 1, complete v2 revision, and independent review round 2.
- Rounds 1 and 2 both returned `RULE_DESIGN_FIX_REQUIRED`; the current required step is one bounded v3 architect correction for the three round-2 blockers, followed by another independent source/evidence, repository-contract, and rule-design review.
- Required future order remains: bounded design -> independent `RULE_DESIGN_PASS` -> controller confirmation -> implementation -> focused/full gates -> ready PR -> CI -> independent code/rule review.
- `RULE_CONFLICT` and `RULE_SOURCE_UNAVAILABLE` map to `HUMAN_BLOCKED`.
- Only an independently returned `RULE_DESIGN_PASS` on the exact committed corrected-design HEAD plus controller confirmation may authorize implementation. This round-2 review-record update authorizes no production, test, architecture, matrix, branch, PR, or tag work for 2B15.

## Loop Limits
- One open slice PR and one writer at a time.
- At most three reviewer repair rounds per PR.
- At most three completed slices in this goal run.
- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permissions/credential failure, unresolved merge conflict, repeated identical CI failure, or required test weakening.
