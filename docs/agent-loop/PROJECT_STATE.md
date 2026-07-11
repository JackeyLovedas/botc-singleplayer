# Project State

## Phase

- Phase 3 — controlled vertical slices.
- Completed and accepted: 2B13, 2B14 and 2B15.
- Active: 2B16 Cerenovus effective-only, repair round `2 / 2`.
- No Slice 2B17 work is authorized.

## Current Truth

- Branch: `phase-3/cerenovus-first-night-madness-marker`.
- PR: [#18](https://github.com/JackeyLovedas/botc-singleplayer/pull/18), open and non-draft.
- Historical reviewed HEAD `45aabfe825d45329a80a178a943cce3bb6491ce1` and its successful CI are superseded by round-2 repair work.
- Its complete final review returned `CODE_REVIEW_FIX_REQUIRED` and `RULE_REVIEW_FIX_REQUIRED` and is preserved verbatim.
- `reviewedHead` is null for the new repair until complete final review.

## Rule And Coverage Truth

- Evidence `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`: `RULE_READY`, no conflict, `PARTIAL`.
- Round-2 design `6d790e201347222621b8cfb5afeee77d3e0224faa4c438b9f67c1994edeb12a0`.
- Round-2 design review `3519e696c42a2b83a8822611bceb2c279390759f97193836e4009bb5e177c8f8`: `RULE_DESIGN_PASS`, blockers `[]`.
- Effective-only choice, marker, target instruction and settlement exist.
- Canonical opportunity embedded-seat, source, task, tenure, ability and stored-chain binding are implemented and directly tested.
- Historical target-only projection remains `PARTIAL`.
- Drunk/poison simulation remains `UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY`, not immunity.
- Vortox, character/alignment lifecycle, death, cleanup, Storyteller judgment, execution and other-night recurrence remain unimplemented.

## Validation

- Focused: 5 files / 296 tests passed.
- Full: 24 files / 824 tests passed.
- Coverage: 24 files / 824 tests passed; 85.53% statements/lines, 78.90% branches, 97.73% functions.
- Typecheck, file lint, full lint and diff check passed.

## Delivery Gate

Publish one attributed repair commit without embedding its future SHA in repository documents. After push, Git/PR `headRefOid` is the exact HEAD authority. Only GitHub CI attached to that exact SHA counts. Freeze the branch, wait for all Ubuntu/Windows checks, then request one complete independent final code/rule review. No merge, review comment, tag or next slice is authorized.
