# Current Task

## Phase 3 Slice 2B19T — RUNNING

- Slice: `2B19T Canonical Dreamer Role-Tenure Prerequisite`.
- Prerequisite authorization: `USER_AUTHORIZED_2B19T_CANONICAL_DREAMER_ROLE_TENURE_PREREQUISITE`.
- Current authorization: `USER_AUTHORIZED_2B19T_DESIGN_ROUND_2_CONTRACT_CORRECTION`.
- Test-infrastructure continuation authorization: `USER_AUTHORIZED_CERENOVUS_LONG_INTEGRATION_TEST_TIMEOUT_INFRA_PREREQUISITE`.
- Scope mode: `CANONICAL_DREAMER_ROLE_TENURE_FOUNDATION`.
- Control status: `RUNNING`.
- Current branch: `phase-3/canonical-dreamer-role-tenure`.
- Current PR: [#28](https://github.com/JackeyLovedas/botc-singleplayer/pull/28).
- Limits: `maxSlices=1`, `maxDesignRounds=2`, `maxRepairRounds=2`.
- Rule gate: `RULE_READY`.
- Rule-design status: independent Round 2 review returned `RULE_DESIGN_PASS`; `ruleDesignPass=true`.
- Implementation authorization: `true` within the frozen 2B19T Round 2 contract; no product repair round is authorized.
- Design round: `2 / 2`.
- Repair round: `0 / 2`.
- Slice coverage: `FOUNDATION`.
- Dreamer role coverage: `PARTIAL` and unchanged.
- Remaining blocker: `PENDING_EXACT_HEAD_CI_AND_FIRST_COMPLETE_FINAL_REVIEW`.

## Published implementation result

- Implemented the exact Round 2 tenure foundation within the four-file production allowlist and two files from the three-file test allowlist.
- Added canonical Dreamer tenure bootstrap, shared transition reconciliation, exact hostile-state validation, unique active lookup, current-state correspondence, accepted-history replay audit, and `InvalidRoleTenureState`.
- Event schemas, event versions, `GameState`, root exports, application commands, projections, Dreamer V2 behavior, 2B19A1, and Phase 2C remain unchanged.
- Focused tests: `223/223` passed.
- Full and coverage suites: `33` files and `1418/1418` tests passed.
- Coverage: `86.80%` statements/lines, `81.72%` branches, `97.79%` functions.
- Typecheck, full lint, and diff check passed locally.
- Post-infrastructure rerun also passed typecheck, full lint, `33` files / `1418` full tests, `33` files / `1418` coverage tests, coverage `86.80 / 81.72 / 97.79`, exact four-file/436-line production scope, and all forbidden scans.
- Implementation status: `docs/implementation/phase-3-slice-2b19t-status.md`.
- Implementation commit: `bada60ad25a8b5fe441b11a72bcdca6edf7e2c73`.
- Product HEAD is `2b3d46bda1b7f7565ac353d3180d473c531045c1`.
- Push run `29401137937` attempt 1 and attempt 2 both failed in Coverage because the same existing Slice 2B16 Cerenovus test timed out at `5000ms`.
- Pull-request run `29401141471` succeeded for the same product HEAD.
- The separately accepted test-infrastructure PR #29 raised only that exact test's execution budget to `15000ms`, without assertion, fixture, production, workflow, global-timeout, or rule changes.
- Infrastructure merge `8bfa5a1ec7af7aa19a5256cd67f814930d3579c8` passed main CI `29405396232`; closeout `f2a8c755ab860b6531b1e9e63ff35c6740f0f052` passed CI `29405973975`; accepted tag is `infrastructure-cerenovus-integration-timeout-v1`.
- Latest `origin/main` was merged normally into this branch as `72a7883248f66d53e65102c26788d73b93b56651`; the inherited blocker is closed and fresh exact-head CI is pending. Independent final review has not started.

## Rule delta evidence

- Evidence: `docs/rules/evidence/2B19T.md`.
- Evidence SHA-256: `b8c8b858ee3a7fb7fc141a1d28a0b385cf17111947caa397d569f9b79041185d`.
- Terminal verdict: `RULE_READY`.
- Rule coverage status: `SKELETON`.
- Implementation coverage label: `FOUNDATION`.
- Unresolved conflicts: `[]`.
- No new user override was added.

## Authorized boundary

This Slice may only add `dreamer` to the existing canonical role-tenure derived-state system. It may cover initial `CharactersAssigned` bootstrap, accepted character-transition entry and exit, canonical tenure ID parsing/formatting, active-tenure queries, exact validation, deterministic replay, and compatibility for the existing tracked role domain.

It must remain a `DERIVED_STATE_EXPANSION`. It does not authorize any event payload or event type change, a new `GameState` tenure field, a second tenure system, application-command behavior, projection, ledger behavior, Dreamer V2 opportunity, target, information delivery, candidate resolution, Vortox, impairment, Philosopher-gained Dreamer, first-night completion, DAY, or Phase 2C.

## Round 1 design authority

- Design: `docs/implementation/phase-3-slice-2b19t-design.md`.
- Design SHA-256: `0eca3f5d67fb1407b4ba9b0f27ef2914e57329f864b72e6a1effe49fff3f632a`.
- Terminal: `READY_FOR_RULE_DESIGN_REVIEW_ROUND_1`.
- Naming compatibility: scheme `B`; `CanonicalRoleTenureTrackedRoleId` is authoritative and `SeamstressRelevantRoleId` remains a compatibility alias.
- Classification: `DERIVED_STATE_EXPANSION`.
- Production allowlist: `packages/domain-core/src/seamstress.ts`, internal `packages/domain-core/src/role-tenure-replay.ts`, and `packages/domain-core/src/rebuild.ts`; hard ceiling 800 added production lines.
- No implementation is authorized by the design document itself.

## Independent Round 1 review

- Review: `docs/implementation/phase-3-slice-2b19t-design-review-round-1.md`.
- Review SHA-256: `e69c5e9ee04bbfdde9f408214045cb066cd6f6584ca710997121c916955af101`.
- Verdict and terminal: `HUMAN_BLOCKED`.
- The accepted role coverage matrix records Dreamer as `PARTIAL`, while the user authorization and Round 1 design require the final role status to be `SKELETON`; the controller cannot silently downgrade accepted coverage or reinterpret the user contract.
- The design names nonexistent `DomainErrorCode` value `InvalidRoleTenureState` while excluding `errors.ts` from the three-file production allowlist.
- The design does not freeze validation of raw hostile tenure state before clone/search/mutation and a second validation after mutation.
- Round 1 remains immutable history.

## Final authorized Round 2 design

- Design: `docs/implementation/phase-3-slice-2b19t-design-round-2.md`.
- Design SHA-256: `6d2adb12e719e5b8311efb02a343f349902d652d41befc00912337ecec03489b`.
- Terminal: `READY_FOR_RULE_DESIGN_REVIEW_ROUND_2`.
- Classification: `DERIVED_STATE_EXPANSION`; `ruleSemanticsChanged=false`.
- Coverage clarification: Slice is `FOUNDATION`; authoritative Dreamer role coverage remains `PARTIAL`.
- The design targets all three Round 1 blockers by authorizing `errors.ts` as the fourth and final production file, freezing `InvalidRoleTenureState`, and requiring raw-state validation before clone/search/mutation plus clone/result revalidation.
- Production allowlist is exactly `seamstress.ts`, internal `role-tenure-replay.ts`, `rebuild.ts`, and `errors.ts`; aggregate added production-code ceiling remains 800 lines.
- Test authority is frozen at `D19T-001` through `D19T-047`.
- Independent review has confirmed these corrections and closed all three Round 1 blockers.

## Independent Round 2 review

- Review: `docs/implementation/phase-3-slice-2b19t-design-review-round-2.md`.
- Review SHA-256: `96272e4c3318d50e42591652527da49358722118f8b73061b8141529ee776097`.
- Reviewed main: `f6058cfb8dc2241da07c8ed9297ee34057589230`.
- Exact-head CI: push run `29398067385`, overall `SUCCESS`; Linux validate and Windows deterministic both `SUCCESS`.
- Verdict: `RULE_DESIGN_PASS`.
- Findings: `[]`.
- Remaining blockers: `[]`.
- Implementation authorized: `true`.
- All three Round 1 blockers are `CLOSED`.

## Preserved state and stop boundary

- Reviewed main is `f6058cfb8dc2241da07c8ed9297ee34057589230`; exact push run `29398067385` is `SUCCESS` across Linux validate and Windows deterministic gates.
- The 2B19A1 prerequisite blocker history remains preserved; 2B19A1 itself has not restarted.
- PR #25 and PR #26 remain closed and unmerged.
- The authorized feature branch contains published implementation commit `bada60ad25a8b5fe441b11a72bcdca6edf7e2c73`; PR #28 is open. The accepted infrastructure prerequisite is merged through `72a7883248f66d53e65102c26788d73b93b56651`; final review, 2B19T merge, and 2B19T accepted tag remain absent.
- `2B19A1`, `2B19A2`, `2B19A3`, `2B19B`, FIRST_NIGHT/DAY continuation, and Phase 2C have not started.

## Required next action

Run the complete local gates without modifying 2B19T production code or tests, verify the frozen four-file/436-line product diff and all out-of-scope scans, update and push PR #28, then require both exact-head workflows to pass before the first complete independent final review. Do not start a product repair round, merge early, start 2B19A1, or start Phase 2C.
