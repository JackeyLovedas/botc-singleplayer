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
- The next candidate label is `2B15`; its role and scope are intentionally unset.
- Fresh 2B15 rule research is pending. No evidence, design, implementation, feature branch, or pull request exists for 2B15.

## Mandatory Rule Gate
- Canonical instructions: `docs/agent-loop/AUTOPILOT_PROMPT.md`.
- Configured roles: read-only `rule-researcher`, read-only `architect`, read-only `reviewer`, and sole-writer `implementer`; the concurrency cap remains three, so gated roles run sequentially where needed.
- Slice 2B14 completed the required rule-evidence, rule-design, independent review, implementation, CI, code/rule review, and merge gates.
- Candidate 2B15 is blocked pending fresh rule research; its scope must not be inferred from 2B14 or any earlier slice.
- Required future order remains: fresh research -> materialized evidence -> `RULE_READY` -> bounded design -> independent `RULE_DESIGN_PASS` -> controller confirmation -> implementation -> focused/full gates -> ready PR -> CI -> independent code/rule review.
- `RULE_CONFLICT` and `RULE_SOURCE_UNAVAILABLE` map to `HUMAN_BLOCKED`.
- No production, architecture, evidence, design, matrix, branch, PR, or tag work for 2B15 is authorized by this governance update.

## Loop Limits
- One open slice PR and one writer at a time.
- At most three reviewer repair rounds per PR.
- At most three completed slices in this goal run.
- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permissions/credential failure, unresolved merge conflict, repeated identical CI failure, or required test weakening.
