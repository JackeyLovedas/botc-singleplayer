# Current Task

## Phase 3 Slice 2B19A — Design Round 2 pending independent review

- Slice: `2B19A Base Dreamer V2 and Vortox First-Night Information`.
- Control status: `RUNNING`.
- Branch: `phase-3/dreamer-v2-base-vortox`, created from accepted main `405f13ac2afbdaf33a20d54ece727b68199f152f`.
- Rule evidence: `docs/rules/evidence/2B19.md`, SHA-256 `76f9a13d8f04d9ab92bd40a3d341034eee2d0ab1619e74795a72181706fbf363`, verdict `RULE_READY`, coverage `PARTIAL`.
- Round 1 design: `docs/implementation/phase-3-slice-2b19a-design.md`, SHA-256 `26bace844cd7697b5e2d411cddf7c14dc1c497516a1221f7d07995797ef8ba70`.
- Round 1 independent review: `docs/implementation/phase-3-slice-2b19a-design-review-round-1.md`, SHA-256 `4970c2002580d3eb7618c4cb7ea0e5dfdbdfb007f9aecdfe0b4ef16fa7ef0fed`, verdict `RULE_DESIGN_FIX_REQUIRED`.
- Round 2 sole design authority: `docs/implementation/phase-3-slice-2b19a-design-round-2.md`, SHA-256 `08334a76903fcc531abb360bd01d1c9deeb2188218b7fc653e2446959eb36a8d`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_2`.
- Design round: `2 / 2`; no Design Round 3 is authorized.
- Round 2 closes the two design blockers by keeping every accepted-history API strict while isolating partial prefixes to the internal prospective validator, and by returning an exact redacted event-type summary for V2 success and idempotent replay.
- `ruleDesignPass=false`; `implementationAuthorized=false`; repair round `0 / 2`.
- No production code, tests, README, rule evidence, role-coverage matrix, new PR, merge, tag, FIRST_NIGHT completion, DAY transition, 2B19B, or Phase 2C work was performed.

## PR #25 close-and-reslice history

- PR #25 is closed without merge or acceptance after repair budget exhaustion at `4 / 4`.
- No accepted 2B19 tag exists and no PR #25 production code is in accepted main.
- Remote branch `phase-3/dreamer-v2-completion` and its history are retained as read-only reference.
- No repair round 5 is authorized.

## Required next action

Run one fresh independent read-only rule-design review against the exact Round 2 design hash. Only `RULE_DESIGN_PASS` authorizes production or test implementation. Any non-pass verdict stops the slice; there is no third design round.

Do not start 2B19B or Phase 2C.
