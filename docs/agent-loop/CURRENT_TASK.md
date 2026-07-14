# Current Task

## Phase 3 Slice 2B19 — repair round 1 ready to publish

- Slice: `2B19 Dreamer V2 Completion`.
- Control status: `RUNNING`.
- Branch: `phase-3/dreamer-v2-completion`.
- Ready PR: [#25](https://github.com/JackeyLovedas/botc-singleplayer/pull/25).
- Feature implementation commit: `e2e172b3fed1dd05440ba961f6281556875c7e25`.
- Repair round: `1 / 2`.
- Rule evidence: `docs/rules/evidence/2B19.md`, SHA-256 `76f9a13d8f04d9ab92bd40a3d341034eee2d0ab1619e74795a72181706fbf363`, verdict `RULE_READY`.
- User authorization: `USER_AUTHORIZED_2B19_DESIGN_ROUND_3_CANONICAL_CAPTURE_COMPLETION`.
- Round 3 design: `docs/implementation/phase-3-slice-2b19-design-round-3.md`, SHA-256 `c06ed0fc61c6b10d0838f1d826021d2113fae037089f8571fe084eeaa7993881`.
- Design round: `3 / 3`; terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3`.
- Round 3 review: `docs/implementation/phase-3-slice-2b19-design-review-round-3.md`, SHA-256 `59f3a80f05720f3f061117038ea01771e256573c22040ae03015f945a756fe10`, verdict `RULE_DESIGN_PASS`, `remainingBlockers=[]`.
- `ruleDesignPass=true`; `implementationAuthorized=true`.
- Published live head `faf96e7edeb15f1e4c65b9fafcbde2573b4ea5cc` failed exact-head push/PR runs `29309341408 / 29309343890`. Ubuntu coverage exceeded a default per-test limit and then the monolithic file's worker-reporting boundary; Windows hit the same three bounded tests and the fixed 60-second worker `onTaskUpdate` boundary. This was test execution granularity, not a product assertion failure.
- Repair round 1 changes only test execution: the shared application-service file registers three mutually exclusive workspace shards (`89 + 53 + 79 = 221` assertions), and only the three CI-hit bounded tests receive local `15_000 ms` limits. No assertion, production behavior, rule evidence, design, traceability, or role coverage changed.
- Local repair gates pass: application `5 files / 230 tests`, full and coverage `33 files / 1450 tests`, coverage `86.85%` statements/lines, `81.64%` branches, `96.98%` functions, typecheck, targeted lint, full lint, diff, JSON, immutable hashes, D19 continuity, nondeterminism, deleted-test, production-scope, and root-export scans.
- The failed `faf96e7e...` runs are superseded. This document does not invent the future repair commit SHA; after push, the live GitHub PR `headRefOid` is authoritative. Fresh exact-head CI, independent final review, merge, tag, FIRST_NIGHT completion, DAY transition, and Phase 2C remain pending or prohibited as applicable.
- `completedSlices` remains through `2B18B`; Slice 2B19 remains incomplete.

## Preserved history

- Round 1 design and review remain immutable; review verdict `RULE_DESIGN_FIX_REQUIRED`.
- Round 2 design SHA-256 is `b169a34d18334dd403a08fece16a7932a54a4259a724495c7e95fca7c29d0c00`.
- Round 2 review SHA-256 is `306a3bb34a6ea00d16e437505ef99bf9ba84511a79e670373dc4ca0ccfc4d019`; it returned `RULE_DESIGN_FIX_REQUIRED` for B1 canonical capture/fingerprint and B2 reachability layering.
- Round 3 completes only those two contracts and does not change Dreamer/Vortox rules, V1 boundaries, or Phase 2C scope.

## Required next action

Create one attributed repair commit, push the existing branch normally, and update PR #25 with the superseded failed runs and pending new-head gate. Require successful Windows/Ubuntu CI on the exact repair head before freezing it for the independent final reviewer. Do not merge or start Phase 2C unless the complete final review returns both required pass verdicts with no blockers and the GitHub audit-comment chain is verified.
