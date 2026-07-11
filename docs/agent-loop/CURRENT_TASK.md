# Current Task

## Slice 2B16 Repair Round 2 — Ready To Publish

- Role: Cerenovus.
- Scope authorization: `CERENOVUS_EFFECTIVE_ONLY`.
- PR: [#18](https://github.com/JackeyLovedas/botc-singleplayer/pull/18).
- Branch: `phase-3/cerenovus-first-night-madness-marker`.
- Historical frozen HEAD: `45aabfe825d45329a80a178a943cce3bb6491ce1`.
- Historical exact-head push CI `29140790900`: success.
- Historical exact-head PR CI `29140792281`: success.
- Historical final-review verdicts: `CODE_REVIEW_FIX_REQUIRED` and `RULE_REVIEW_FIX_REQUIRED`.
- Repair round: `2 / 2`.
- `reviewedHead`: null until a new frozen HEAD receives complete independent final review.

## Rule And Design Gate

- Evidence SHA-256: `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`; `RULE_READY`; `PARTIAL`.
- Round-2 design SHA-256: `6d790e201347222621b8cfb5afeee77d3e0224faa4c438b9f67c1994edeb12a0`.
- Round-2 final-review report SHA-256: `24fc958b2df03c6a0d55d2d2cfa6e7b4a0f05d7847a3e52fec32056a75abe254`.
- Round-2 design-review SHA-256: `3519e696c42a2b83a8822611bceb2c279390759f97193836e4009bb5e177c8f8`; `RULE_DESIGN_PASS`; blockers `[]`.

## Repair Result

- Canonical Cerenovus opportunity IDs bind their embedded seat to `sourceSeatNumber` in opportunity, choice and marker validation.
- Instruction privacy is unchanged and source identity remains bound through the complete stored chain.
- Replay directly covers one canonical plus all 23 noncanonical permutations, batch/command/version/all sequence positions, a real metadata-aligned `PhaseTransitioned`, duplicate settlement, stored-opportunity mutations and full choice provenance.
- Projection directly covers semantic seat mismatch, every duplicate class, independent cross-links, a combined forgery and independent later source/target role/alignment/impairment variants.
- Application directly covers batch ID, all four event-ID positions, all four clock positions, event construction, prospective corruption, pre-commit and during-commit retry boundaries.
- Official night order remains external evidence; supported runtime subset order remains a real catalog test.
- Prior-role regression traceability references existing real execution and projection tests instead of a task-presence proxy.
- Cerenovus remains `PARTIAL` and every explicit out-of-scope item remains unimplemented.

## Local Gates

- Focused: 5 files / 296 tests passed.
- `pnpm typecheck`: passed.
- File-scoped lint and `pnpm lint`: passed.
- `pnpm test`: 24 files / 824 tests passed.
- `pnpm test:coverage`: 24 files / 824 tests passed.
- Coverage: 85.53% statements/lines, 78.90% branches, 97.73% functions.
- `git diff --check`: passed.

## Next Gate

Commit and push the exact round-2 repair with required attribution, update PR #18, freeze the resulting HEAD, and require fresh exact-head Ubuntu/Windows push and PR CI. Then obtain one complete independent final review with both pass verdicts. Do not merge, comment, tag or start Slice 2B17.
