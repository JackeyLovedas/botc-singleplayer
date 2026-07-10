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

## Current Delivery
- Open slice PR: none.
- Branch: `main`.
- Latest accepted slice merge: `a911ae0964dec444ef5bac59bf4d05f991353ccf` (PR #15).
- Last reviewed slice HEAD: `a7adf6316140275afbf32681e6f141cb528c3546`.
- Accepted tag: `phase-3-slice-2b13-dreamer-action-information-skeleton`.
- Slice 2B13 passed independent review and all required Ubuntu/Windows CI checks; its remote feature branch was deleted after merge.
- Candidate Slice `2B14` Seamstress rule evidence is materialized at `docs/rules/evidence/2B14.md` from live sources retrieved on 2026-07-10.
- Research verdict is `RULE_READY`; `unresolvedConflicts` is none; rule coverage remains `SKELETON`.
- The bounded DEFER-only architect design is materialized at `docs/implementation/phase-3-slice-2b14-design.md` with proposed status `READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`.
- Independent external source/evidence and rule-design review is pending. No `RULE_DESIGN_PASS` has been issued, and the design is not implementation authorization.

## Mandatory Rule Gate
- Canonical instructions: `docs/agent-loop/AUTOPILOT_PROMPT.md`.
- Configured roles: read-only `rule-researcher`, read-only `architect`, read-only `reviewer`, and sole-writer `implementer`; the concurrency cap remains three, so gated roles run sequentially where needed.
- The 2B14 research and design-materialization gates are satisfied by `docs/rules/evidence/2B14.md`, `RULE_READY`, and `docs/implementation/phase-3-slice-2b14-design.md`.
- No implementation may start until the reviewer independently returns `RULE_DESIGN_PASS`.
- `RULE_CONFLICT` and `RULE_SOURCE_UNAVAILABLE` map to `HUMAN_BLOCKED`.
- Final PR merge requires both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS` plus the existing code and CI gates.
- No snapshot was used for 2B14 evidence; the listed sources were retrieved live on 2026-07-10 with revisions, timestamps, and hashes recorded for independent review.

## Loop Limits
- One open slice PR and one writer at a time.
- At most three reviewer repair rounds per PR.
- At most three completed slices in this goal run.
- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permissions/credential failure, unresolved merge conflict, repeated identical CI failure, or required test weakening.
