# Current Task

## Slice 2B15 Waiting For CI And Independent Review

- Ready pull request: #17 (`https://github.com/JackeyLovedas/botc-singleplayer/pull/17`).
- Branch: `phase-3/seamstress-first-night-choice-information`.
- Base: `main` at implementation start revision `5c8712f95e68cae68c4c8e5c194dd96aa05aa284`.
- Repair implementation commit: `95c1dfddc20a94806a63a6a9e7440338099e106d`, with the required Codex co-author trailer.
- Repair round 1 closes the two blockers from the independent review of `a65ca993e55216de8bac56f5a4d070d4ce78bae9`; the reviewed HEAD is reset to pending for the final PR HEAD.
- PR #17 is open, ready, and not a draft. Its body contains the exact mandatory `Rule Evidence`, `Rule Claims Implemented`, `Explicitly Unsupported Rules`, `Rule Source Revisions`, and `Rule-to-Test Traceability` sections.
- Fresh evidence is `RULE_READY`; original v3 plus corrected v3.1 has renewed independent `RULE_DESIGN_PASS` with no blockers.
- Seamstress coverage is conservatively `PARTIAL`, never `COMPLETE`.
- Other-night recurrence, life/revival, Travellers, registration, Barista, No Dashii poison derivation, and general role/effect lifecycle remain unsupported.

## Local Gate Result

- Focused repair suites: 3 files / 261 tests passed.
- Windows-compatible application package command: 3 files / 172 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test`: 21 files / 715 tests passed.
- `pnpm test:coverage`: 21 files / 715 tests passed.
- Coverage: 85.06% statements/lines, 78.15% branches, 97.58% functions.
- `git diff --check`, strict control JSON validation, and deterministic primitive scan passed.

## Remaining Gate

1. Wait for the current PR #17 Ubuntu/Windows CI checks to finish; do not treat an earlier branch-push run as the final PR-head gate.
2. The independent reviewer must inspect the complete final PR diff, production code, tests, architecture, evidence, and exact PR HEAD.
3. Final review must return both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS`; otherwise use `FIX_REQUIRED` or `HUMAN_BLOCKED`.
4. Before merge, reviewed HEAD must equal PR HEAD, all required CI must be green, and the worktree must be clean.
5. The implementer must not merge or start the next slice.

## Stop Conditions

- Stop on substantive rule uncertainty, unsafe accepted-history rewrite, permission failure, unresolved merge conflict, repeated identical CI failure, required test weakening, or a newly discovered production adapter that cannot atomically retain the complete fingerprint.
- Keep one writing agent, one bounded slice, one feature branch, and one open slice PR.
