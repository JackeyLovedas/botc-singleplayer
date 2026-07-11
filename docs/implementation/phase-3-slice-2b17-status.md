# Phase 3 Slice 2B17 Status: Accepted; 2B17.1 Validation Hotfix Active

## Active 2B17.1 Hotfix

- Branch: `phase-3/clockmaker-validation-hardening`.
- Scope: strict dense standard arrays, hostile-value fail-closed validation, and insertion-order-independent canonical comparison only.
- Rule semantics, event contract, event order, candidate domain, Vortox/impairment semantics, and private projection contract are unchanged.
- Clockmaker remains `PARTIAL`; Slice 2B18 is prohibited.
- Historical feature HEAD `61acdb59c1ae2e598e7bca85f9864807b738fb3d` passed push `29151455861` and PR `29151474534`, then independent review returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_PASS`, `ruleSemanticsChanged=false`. Its exact-head CI branch coverage was `79.99%`; `80.00%` was the separate local result. The exact complete reviewer report was not available to the writer and has not been reconstructed.
- Repair round `1 / 2` guards every `ClockmakerInformationSet.deliveries` read before iteration, including duplicate detection and `ScheduledTaskSettled` linkage. Local gates passed: focused `4 files / 264 tests`, full and coverage `28 files / 901 tests`, `85.94%` statements/lines, `80.04%` branches, and `97.86%` functions. New commit and exact-head CI remain pending.

## Delivery

- PR [#19](https://github.com/JackeyLovedas/botc-singleplayer/pull/19) merged at `2026-07-11T10:07:25Z`.
- Product implementation HEAD: `69c3f0375883bd9ec7908b5f9f609dad5e6fcee5`.
- Frozen final reviewed feature HEAD: `04237a2053a64301a515fffeb417958a381a0dc6`.
- Merge SHA: `4b29a3f7b05d521a9d8468ffc33c77eec3cb16c4`.
- Repair round: `1 / 2`.
- Final review: `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`, `remainingBlockers=[]`.
- Overall role status: `PARTIAL`, never `COMPLETE`.

## Final Review Archives

- Code review: [original comment](https://github.com/JackeyLovedas/botc-singleplayer/pull/19#issuecomment-4944705609), created `2026-07-11T10:06:02Z`, updated `2026-07-11T10:06:58Z`, exact UTF-8 body SHA-256 `79c27259768300c44b1f44d8700dc890131561964eda917c3e1f9818e3bffdf5`, archived at `docs/reviews/pr-19-code-review-final.md`.
- Rule review: [original comment](https://github.com/JackeyLovedas/botc-singleplayer/pull/19#issuecomment-4944705926), created `2026-07-11T10:06:05Z`, updated `2026-07-11T10:07:00Z`, exact UTF-8 body SHA-256 `1b86fb8651fb5fe2deb653ffac22a7b190762fd3b0dc11c5fcca12948971631e`, archived at `docs/reviews/pr-19-rule-review-final.md`.

Both archives preserve the exact live marker and complete report body within explicit delimiters. Reverse extraction matches each live GitHub comment byte for byte.

## CI Provenance

### productHeadCI

- SHA: `04237a2053a64301a515fffeb417958a381a0dc6`.
- Push run [29148485853](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29148485853): `SUCCESS`.
- Pull-request run [29148486733](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29148486733): `SUCCESS`.
- Scope: frozen final reviewed feature HEAD, including the docs-only final-review repair.

### mergeCommitCI

- SHA: `4b29a3f7b05d521a9d8468ffc33c77eec3cb16c4`.
- Main-push run [29148842440](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29148842440): `SUCCESS`.
- Accepted-tag-push run [29148853648](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29148853648): `SUCCESS`.
- Scope: evidence for the exact merge commit under distinct main and accepted-tag push contexts.

### closeoutCommitCI

The docs-only closeout commit cannot self-reference its future SHA or run identifiers. GitHub checks attached to the exact emitted closeout SHA are authoritative after push. Product-head and merge-commit CI are not inherited.

## Accepted Boundary

The accepted slice implements the exact two-event first-night Clockmaker distance pipeline for base and Philosopher-gained sources, canonical Philosopher duplicate drunkenness, settlement-time native character identity including the supported preceding Snake Charmer swap, effective current Vortox false information with strict tenure provenance, atomic replay/batch/prospective validation, deterministic receipts, and source-only historical projection.

Registration and Storyteller registration choices, Spy/Recluse/Summoner execution, Travellers, life/death transitions, canonical poisoned Clockmaker, impaired Vortox, no/multiple native Demon histories, noncanonical Minion counts, later-night acquisition, recurrence, generic tenure/lifecycle expansion, free-form Storyteller selection, AI decisions, UI, Electron, SQLite, production persistence, first-night completion, and Slice 2B18 remain unsupported.

## Stop

This governed run reached `maxSlices = 1`. No next slice is active. Do not start Slice 2B18 during closeout.
