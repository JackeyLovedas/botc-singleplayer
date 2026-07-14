# Current Task

## Phase 3 Slice 2B19 — final repair round 2 ready to publish

- Slice: `2B19 Dreamer V2 Completion`.
- Control status: `RUNNING`.
- Branch: `phase-3/dreamer-v2-completion`.
- Ready PR: [#25](https://github.com/JackeyLovedas/botc-singleplayer/pull/25).
- Feature implementation commit: `e2e172b3fed1dd05440ba961f6281556875c7e25`.
- Repair round: `2 / 2` (final authorized repair).
- Rule evidence: `docs/rules/evidence/2B19.md`, SHA-256 `76f9a13d8f04d9ab92bd40a3d341034eee2d0ab1619e74795a72181706fbf363`, verdict `RULE_READY`.
- User authorization: `USER_AUTHORIZED_2B19_DESIGN_ROUND_3_CANONICAL_CAPTURE_COMPLETION`.
- Round 3 design: `docs/implementation/phase-3-slice-2b19-design-round-3.md`, SHA-256 `c06ed0fc61c6b10d0838f1d826021d2113fae037089f8571fe084eeaa7993881`.
- Design round: `3 / 3`; terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3`.
- Round 3 review: `docs/implementation/phase-3-slice-2b19-design-review-round-3.md`, SHA-256 `59f3a80f05720f3f061117038ea01771e256573c22040ae03015f945a756fe10`, verdict `RULE_DESIGN_PASS`, `remainingBlockers=[]`.
- `ruleDesignPass=true`; `implementationAuthorized=true`.
- Repair-round-1 head `237ba2b207166d9c1127d562882d93f0b2216c3c` passed both Windows deterministic jobs and all `1450/1450` coverage assertions, but exact-head push/PR runs `29310466573 / 29310469160` failed because the combined Dreamer-and-later shard took `61.067 s` on Ubuntu and crossed Vitest's fixed 60-second `onTaskUpdate` boundary.
- Final repair round 2 changes only test execution: that combined shard is split into mutually exclusive Dreamer V2 and later-role-action shards. The service assertions remain `89 + 53 + 15 + 64 = 221`; the three local `15_000 ms` bounded-test limits from repair round 1 remain. No assertion, production behavior, rule evidence, design, traceability, or role coverage changed.
- Local final-repair gates pass: application `6 files / 230 tests`, full and coverage `34 files / 1450 tests`, coverage `86.85%` statements/lines, `81.64%` branches, `96.98%` functions, typecheck, targeted lint, full lint, diff, JSON, immutable hashes, D19 continuity, nondeterminism, deleted-test, production-scope, and root-export scans. Coverage shard durations are core `1.486 s`, role-actions `11.668 s`, Dreamer V2 `13.104 s`, and later-role-actions `25.924 s`.
- The failed `237ba2b...` runs are superseded. This document does not invent the future final-repair commit SHA; after push, the live GitHub PR `headRefOid` is authoritative. Fresh exact-head CI, independent final review, merge, tag, FIRST_NIGHT completion, DAY transition, and Phase 2C remain pending or prohibited as applicable. If final-repair exact-head CI fails, immediately `HUMAN_BLOCKED`; no repair round 3 is authorized.
- `completedSlices` remains through `2B18B`; Slice 2B19 remains incomplete.

## Preserved history

- Round 1 design and review remain immutable; review verdict `RULE_DESIGN_FIX_REQUIRED`.
- Round 2 design SHA-256 is `b169a34d18334dd403a08fece16a7932a54a4259a724495c7e95fca7c29d0c00`.
- Round 2 review SHA-256 is `306a3bb34a6ea00d16e437505ef99bf9ba84511a79e670373dc4ca0ccfc4d019`; it returned `RULE_DESIGN_FIX_REQUIRED` for B1 canonical capture/fingerprint and B2 reachability layering.
- Round 3 completes only those two contracts and does not change Dreamer/Vortox rules, V1 boundaries, or Phase 2C scope.

## Required next action

Create one attributed final-repair commit, push the existing branch normally, and update PR #25 with both superseded failed heads and the pending new-head gate. Require successful Windows/Ubuntu CI on the exact final-repair head before freezing it for the independent final reviewer. If that CI fails, immediately `HUMAN_BLOCKED`; do not infer another repair. Do not merge or start Phase 2C unless the complete final review returns both required pass verdicts with no blockers and the GitHub audit-comment chain is verified.
