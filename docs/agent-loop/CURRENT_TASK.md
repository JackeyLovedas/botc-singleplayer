# Current Task

## Active Hotfix

- Phase 3 Slice 2B17.1 hardens only Clockmaker runtime validation; it does not change rules or start Slice 2B18.
- Current branch: `phase-3/clockmaker-validation-hardening`.
- Current PR: none.
- Current slice: `2B17.1`.
- Final reviewed feature HEAD: `04237a2053a64301a515fffeb417958a381a0dc6`.
- Merge SHA: `4b29a3f7b05d521a9d8468ffc33c77eec3cb16c4`.
- Final verdicts: `CODE_REVIEW_PASS / RULE_REVIEW_PASS`, `remainingBlockers=[]`.
- Clockmaker remains `PARTIAL`.
- Slice 2B18 was not started and remains prohibited in this completed run.

## Closeout CI Authority

The final reviewed HEAD passed push run `29148485853` and pull-request run `29148486733`. The merge SHA passed main-push run `29148842440` and accepted-tag-push run `29148853648`. The docs-only closeout commit cannot self-reference its future SHA; GitHub checks attached to the exact emitted closeout SHA are authoritative after push.

## Scope

Implement strict dense-array/hostile-value validation and insertion-order-independent canonical comparison, run all gates, then publish one PR for independent review. Clockmaker remains `PARTIAL`. Do not start Slice 2B18.

Independent round-1 review of historical HEAD `61acdb59c1ae2e598e7bca85f9864807b738fb3d` returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_PASS`, with `ruleSemanticsChanged=false`, because two stored-delivery reads preceded the strict collection guard. The complete reviewer report is controller-held and was not reconstructed locally.

Repair round `1 / 2` now guards duplicate detection, append, settlement linkage, and projection stage reads before any Clockmaker delivery iteration. Local validation passed: focused `4 files / 264 tests`; full and coverage `28 files / 901 tests`; coverage `85.94%` statements/lines, `80.04%` branches, and `97.86%` functions. Historical exact-head CI branch coverage was `79.99%`; the earlier `80.00%` figure was local-only. New repair commit and exact-head CI remain pending.
