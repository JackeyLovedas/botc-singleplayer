# Current Task

## Slice 2B16 Repair Round 1 — Implementation Repair Authorized

- Role: `Cerenovus`.
- Scope authorization: `CERENOVUS_EFFECTIVE_ONLY`.
- PR: [#18](https://github.com/JackeyLovedas/botc-singleplayer/pull/18).
- Branch: `phase-3/cerenovus-first-night-madness-marker`.
- Frozen reviewed HEAD: `86d973485e940c0ef0469dd169db3ab1dc7a417d`.
- Final review timestamp: `2026-07-11T12:02:08+08:00`.
- Verdicts: `CODE_REVIEW_FIX_REQUIRED` and `RULE_REVIEW_FIX_REQUIRED`.
- Repair round: `1 / 2`.
- Merge remains unauthorized. The bounded repair implementation is authorized; no commit or push is authorized before all local gates and controller pre-publish audit.

## Four Blockers

1. Bind all choice source/opportunity/task/tenure/ability-instance facts and evaluate capability using validated opportunity source.
2. Validate canonical Cerenovus opportunity IDs and recipient seat primitives before formatter calls.
3. Add the missing direct Cerenovus-specific tests for the reviewed 62-item plan and use exact test-name traceability.
4. Conform evidence to every mandatory heading and explicitly source Vortox and alignment-change conclusions.

## Corrected Documentation

- Evidence SHA-256: `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`; terminal `RULE_READY`; coverage `PARTIAL`.
- Current repair design SHA-256: `743affb3d47d0a16fc25b849b1dbe97bf9af07c9ff000cd793a61a5268300a12`; only trace row 62 changed from the prior reviewed design, to reference the existing unchanged CI workflow and pending exact-head runs.
- Historical final-review report SHA-256: `7af520124ee01a5c195ca5d1aecd146a86b5ed109ef8ba4795c5be4847e0ab3c`.
- Corrected rule-design review SHA-256: `363271a48ae4f2595ef7287e850d8a38b4fa1b94e42f97b6b15b25d5de9da645`; `RULE_DESIGN_PASS`; `remainingBlockers = []`.
- Targeted renewed design revalidation SHA-256: `643e1e1a5dee2030cf8205594f9a08a7f2415c514ea0466d35b988ec1874b34c`; reviewed current design `743affb3...`; `RULE_DESIGN_PASS`; `remainingBlockers = []`.
- Official Vortox oldid `3017`; Chinese Vortox oldid `6198`.
- Vortox and alignment-change runtime remain explicitly out of scope.

## Gate State

- CI runs `29138672803` and `29138673732` were green for `86d9734...`, but are historical only and cannot authorize a repaired head.
- The old final review and old audit state remain invalid for merge.
- The renewed reviewer explicitly authorized implementation within the exact repair design and file boundary.
- Any repaired commit requires fresh exact-head Ubuntu/Windows CI and a new complete final review.

## Repair Result

- Full source/opportunity/task/tenure/current-source binding is implemented; capability checks use the validated opportunity source.
- Canonical opportunity-ID and recipient-seat validation precedes formatter use.
- All 64 exact trace rows resolve to literal tests in the designated files.
- Local typecheck, lint, diff, 821-test full suite, and 821-test coverage suite pass.
- Exact repaired-HEAD Ubuntu/Windows CI remains pending until an authorized commit and push; it is not claimed locally.

## Next Gate

Controller pre-publish audit before any commit or push.

## Limits

- `maxSlices = 1`; only Slice 2B16.
- `maxRepairRounds = 2`.
- No heartbeat and no Slice 2B17.
- Cerenovus remains `PARTIAL`; nothing is `COMPLETE`.
