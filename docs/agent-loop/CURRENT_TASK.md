# Current Task

## Phase 3 Slice 2B19A2 — RUNNING / REPAIR ROUND 1 LOCAL GATES PASS

- Authorization: `USER_AUTHORIZED_2B19A2_EFFECTIVE_BASE_DREAMER_V2_NORMAL_INFORMATION`.
- Task type: `PRODUCT_SLICE`; product repair round consumed: `true`.
- Scope: `Effective Base Dreamer V2 Normal Target and Information Delivery`.
- Recovery main: `8b390b50f5d314b34535bc7cf9fad36ece76f85e`; exact main CI `29484611863` is `SUCCESS`.
- Current branch: `phase-3/dreamer-v2-base-normal-information`; current Slice: `2B19A2`; current PR: [#34](https://github.com/JackeyLovedas/botc-singleplayer/pull/34).
- Limits: `maxSlices=1`, `maxDesignRounds=2`, and `maxRepairRounds=2`; current design round `2`, repair round `1`.
- Gate state: `ruleReady=true`, `ruleDesignPass=true`, and `implementationAuthorized=true`.
- Governance precheck: `docs/architecture/2B19A2-go-no-go-under-governance-v1.md`, SHA-256 `abc0a75b0b8267542d2e1a3bd0bbaeaad8ee9b11052c442ec38aee9558df4b1f`, terminal `GO`.
- Rule evidence: `docs/rules/evidence/2B19A2.md`, SHA-256 `e24038e7399cb7311204b6b3f001623b7ab0323034af61ee3bb64aa8e9a3c829`, terminal `RULE_READY`, `ruleCoverageStatus=PARTIAL`, Slice coverage `PARTIAL / NORMAL_INFORMATION_ONLY`, Dreamer role coverage `PARTIAL`, and `unresolvedConflicts=[]`.
- Round 1 design: `docs/implementation/phase-3-slice-2b19a2-design.md`, SHA-256 `fe7187b9b027c4579a21d3a0ccf2fd77a3625dfbc0f95ea638ea926c5982cfe0`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_1`, preserved as immutable history.
- Independent Round 1 review: `docs/implementation/phase-3-slice-2b19a2-design-review-round-1.md`, SHA-256 `bc588436e2622b801576c4f6477907d9ce1adf54768fe59148ff4a9727fb44fd`, verdict `RULE_DESIGN_FIX_REQUIRED`.
- Complete standalone Round 2 replacement: `docs/implementation/phase-3-slice-2b19a2-design-round-2.md`, SHA-256 `7e4016b89f6cc5f5b07bcf32f6a6e14c9e12db39c7cb66960b1934efb1911687`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_2`, status `RULE_DESIGN_PASS`.
- Independent Round 2 review: `docs/implementation/phase-3-slice-2b19a2-design-review-round-2.md`, SHA-256 `7bb36bd0e79200d8a803c2f43c1b1cc78669ad15969be58138a48417e3ff65b2`, verdict and terminal `RULE_DESIGN_PASS`, `remainingBlockers=[]`.
- Remaining blockers: `[]`.
- `slice2B19A2Started=true`; `phase2CStarted=false`.
- Slice 2B19A1 is `COMPLETED / ACCEPTED`; closeout commit `8b390b50f5d314b34535bc7cf9fad36ece76f85e` passed exact CI `29484611863`, so its stale pending-closeout marker is closed.
- Local implementation is complete within the six-file production allowlist: `813` added production lines, below the `1500` stop-loss. No event type, `GameState`, workflow, dependency, timeout, or Vitest configuration changed.
- Frozen authority tests `2B19A2-C01` through `C31` plus `S01` and `S02` are present exactly once. Typecheck and the focused suite pass at `10 files / 662 tests`, including application `236/236` and rebuild `204/204`.
- Role coverage remains `PARTIAL`; status and traceability are `docs/implementation/phase-3-slice-2b19a2-status.md` and `docs/implementation/phase-3-slice-2b19a2-test-traceability.md`.
- Frozen HEAD `99f04a89bb06a66336c429af0e27c337bfc29af6` failed push/PR CI `29493114740 / 29493159871` only after all coverage tests passed, with Vitest worker RPC `Timeout calling "onTaskUpdate"`. Repair Round 1 removes the eager live application capture from domain fixture consumers while application C07 strictly verifies the committed fixture against real commands.
- Full lint passes. Ordinary and single-fork coverage suites both pass at `34 files / 1456 tests`; single-fork duration is `136.44s`, coverage is `87.18%` statements/lines, `82.00%` branches, and `97.75%` functions, with no `onTaskUpdate` failure. Diff/scope/static/JSON/hash/authority audits pass.
- Repair commit/push, fresh exact-head CI, and independent final review remain pending; no production, workflow, dependency, timeout, Vitest configuration, or test-count change is authorized.

## Phase 3 Slice 2B19A1 — COMPLETED / ACCEPTED

- Authorization: `USER_AUTHORIZED_2B19A1_BASE_DREAMER_V2_OPPORTUNITY_CONTRACT`.
- Task type: `PRODUCT_SLICE`; product repair round consumed: `true`.
- Scope: `Base Dreamer V2 Opportunity Contract`.
- Accepted feature HEAD: `67d3660b5fec9ca53253bfae1240eac6b2ad85e7`; merge SHA: `488d2e8c7a429ea1244c54859e8f682d05056707`; current branch: `main`.
- Current Slice: `null`; current PR: `null`; `slice2B19A1Started=false`; `phase2CStarted=false`.
- Limits: `maxSlices=1`, `maxDesignRounds=2`, and `maxRepairRounds=2`; current design round `1`, repair round `1`.
- Gate state: `ruleReady=true`, `ruleDesignPass=true`, and `implementationAuthorized=false` after acceptance.
- PR [#33](https://github.com/JackeyLovedas/botc-singleplayer/pull/33) merged by merge commit. Frozen repair HEAD passed push/PR CI `29483066575 / 29483069638`; merge/tag CI `29483966050 / 29483990622` passed on exact merge SHA.
- Rule evidence: `docs/rules/evidence/2B19A1.md`, SHA-256 `505456357b498c063e8d579aaabef025fd7cb5437f11264915cd810b470da4e6`, terminal `RULE_READY`, `ruleCoverageStatus=SKELETON`, implementation label `OPPORTUNITY_FOUNDATION`, and `ruleSemanticsChanged=false`.
- Round 1 design: `docs/implementation/phase-3-slice-2b19a1-design.md`, SHA-256 `1526a95bcdb7c4d1288a457b068f3fb632d76cebdcc805629469f26310a427dc`, terminal `READY_FOR_RULE_DESIGN_REVIEW_ROUND_1`.
- Round 1 design review: `docs/implementation/phase-3-slice-2b19a1-design-review-round-1.md`, SHA-256 `602d27c6153edfa96d0d06b17cfe96607177ced79337691e37e65e1355804d16`, verdict `RULE_DESIGN_PASS`, and `remainingBlockers=[]`.
- Local implementation remains exactly two production files and `480` added production lines; Repair Round 1 changes no production file. Dreamer remains `PARTIAL` and Slice coverage is `FOUNDATION / OPPORTUNITY_CONTRACT`.
- Final independent Round 2 review returned `CODE_REVIEW_PASS / RULE_REVIEW_PASS` with `remainingBlockers=[]`; original GitHub comments are archived verbatim at `docs/reviews/pr-33-code-review-final.md` and `docs/reviews/pr-33-rule-review-final.md`.
- Repair Round 1 changed tests/docs/control only and closed `FROZEN_2B19A1_PRIMARY_AUTHORITY_TEST_MATRIX_INCOMPLETE`; production remained frozen.
- Accepted tag: `phase-3-slice-2b19a1-dreamer-v2-base-opportunity-contract`, exact merge SHA target.
- Remaining blocker: `PENDING_CLOSEOUT_COMMIT_CI` only. The future closeout commit cannot inherit product, merge, or tag CI.
- Product boundaries remain frozen: no target, delivery, candidates, Vortox, impairment information, outcome-ledger fact, private Dreamer knowledge, Philosopher-gained Dreamer, first-night completion, DAY, 2B19A2/2B19A3/2B19B, or Phase 2C work has started.

## Vitest Coverage Single-Fork V1 — ACCEPTED

- Accepted infrastructure feature HEAD: `45efbafd63208369ecf9f3b6a43e144939cb2652`.
- Merge commit: `9c4938aca1416995b7607589b73b0238ef4f6ea4`.
- Accepted main CI: `29470843060` `SUCCESS`.
- The Ubuntu Coverage step alone uses `VITEST_MAX_FORKS: "1"`; production, tests, dependencies, `vitest.workspace.ts`, timeouts, coverage thresholds, rules, and role coverage remain unchanged.
- This infrastructure acceptance consumed no product repair round.

The accepted Phase 3 Slice 2B19T history below remains unchanged and supplies the canonical Dreamer tenure prerequisite. It does not itself authorize 2B19A1 implementation.

## Phase 3 Slice 2B19T — COMPLETED

- Slice: `2B19T Canonical Dreamer Role-Tenure Prerequisite`.
- Prerequisite authorization: `USER_AUTHORIZED_2B19T_CANONICAL_DREAMER_ROLE_TENURE_PREREQUISITE`.
- Current authorization: `USER_AUTHORIZED_2B19T_DESIGN_ROUND_2_CONTRACT_CORRECTION`.
- Test-infrastructure continuation authorization: `USER_AUTHORIZED_CERENOVUS_LONG_INTEGRATION_TEST_TIMEOUT_INFRA_PREREQUISITE`.
- Scope mode: `CANONICAL_DREAMER_ROLE_TENURE_FOUNDATION`.
- Control status: `COMPLETED / ACCEPTED`.
- Current branch: `main`.
- Current PR: none; [#28](https://github.com/JackeyLovedas/botc-singleplayer/pull/28) is merged.
- Limits: `maxSlices=1`, `maxDesignRounds=2`, `maxRepairRounds=2`.
- Rule gate: `RULE_READY`.
- Rule-design status: independent Round 2 review returned `RULE_DESIGN_PASS`; `ruleDesignPass=true`.
- Implementation authorization: `false` after acceptance.
- Design round: `2 / 2`.
- Repair round: `0 / 2`.
- Slice coverage: `FOUNDATION`.
- Dreamer role coverage: `PARTIAL` and unchanged.
- Remaining blockers: `[]`.

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
- Frozen product HEAD is `466f91481ad98059bd173af8c0335b88f1ce9fa2`.
- Exact product-head push CI `29406838841` and pull-request CI `29406840748` both succeeded.
- The separately accepted test-infrastructure PR #29 raised only that exact test's execution budget to `15000ms`, without assertion, fixture, production, workflow, global-timeout, or rule changes.
- Infrastructure merge `8bfa5a1ec7af7aa19a5256cd67f814930d3579c8` passed main CI `29405396232`; closeout `f2a8c755ab860b6531b1e9e63ff35c6740f0f052` passed CI `29405973975`; accepted tag is `infrastructure-cerenovus-integration-timeout-v1`.
- Complete independent final review returned `CODE_REVIEW_PASS / RULE_REVIEW_PASS` with `remainingBlockers=[]`; exact comments are archived in `docs/reviews/pr-28-code-review-final.md` and `docs/reviews/pr-28-rule-review-final.md`.
- PR #28 merged as `b87905a16e96647249859200db726da4dad5fbed`; merge-main CI `29407990924` succeeded; accepted tag `phase-3-slice-2b19t-canonical-dreamer-role-tenure` points to that merge.
- Closeout commit CI is `PENDING` and inherits no prior CI status.

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
- The accepted feature is frozen at `466f91481ad98059bd173af8c0335b88f1ce9fa2`, merged as `b87905a16e96647249859200db726da4dad5fbed`, and tagged `phase-3-slice-2b19t-canonical-dreamer-role-tenure`.
- `2B19A1`, `2B19A2`, `2B19A3`, `2B19B`, FIRST_NIGHT/DAY continuation, and Phase 2C have not started.

## Required next action

Stop after the docs-only closeout and wait for its exact CI. Dreamer tenure foundation is accepted, but Dreamer opportunity and delivery remain unimplemented; 2B19A1 has not started, FIRST_NIGHT is incomplete, DAY has not started, and Phase 2C has not started.
