# Phase 3 Slice 2B19T Status: Canonical Dreamer Role-Tenure Foundation

## Authority

- Slice: `2B19T`.
- Classification: `DERIVED_STATE_EXPANSION`.
- Slice coverage: `FOUNDATION`.
- Dreamer role coverage: `PARTIAL`.
- Design: `docs/implementation/phase-3-slice-2b19t-design-round-2.md`.
- Design SHA-256: `6d2adb12e719e5b8311efb02a343f349902d652d41befc00912337ecec03489b`.
- Independent design review: `docs/implementation/phase-3-slice-2b19t-design-review-round-2.md`.
- Review SHA-256: `96272e4c3318d50e42591652527da49358722118f8b73061b8141529ee776097`.
- Design verdict: `RULE_DESIGN_PASS`.

## Implemented foundation

- The canonical tracked-role domain now has one authority and includes `dreamer` alongside Cerenovus, Mathematician, Philosopher, Seamstress, and Vortox.
- `CharactersAssigned` derives initial Dreamer tenure at revision 1 without changing any event payload or `GameState` shape.
- The existing shared transition fact reconciler handles tracked and nontracked entry/exit, including Dreamer, with half-open intervals and immutable inputs.
- Exact runtime validation rejects hostile, sparse, cyclic, accessor, proxy, duplicate, overlapping, noncanonical, and provenance-inconsistent tenure state.
- Canonical transition and active-query boundaries validate raw state before cloning or searching and use `InvalidRoleTenureState` for aggregate state failures.
- Rebuild performs a package-internal accepted-stream audit against the unique assignment envelope, real Snake Charmer transitions, processed fact IDs, transition provenance, and current character state.
- Legacy accepted event streams rebuild the new derived Dreamer tenure without event migration.

## Explicitly unsupported

- No new event type, payload field, `GameState` field, application command, projection field, ledger behavior, or second tenure system.
- No accepted producer can currently enter or leave Dreamer; the shared reconciler is foundation only.
- No Dreamer V2 opportunity, target, information delivery, candidate selection, Vortox completion, general drunk/poison completion, Philosopher-gained Dreamer execution, DAY work, or Phase 2C work.
- Dreamer remains `PARTIAL`, not `COMPLETE`.

## Rule-to-test traceability

- `D19T-001..009`, `D19T-021`: canonical role authority, Dreamer ID grammar, assignment bootstrap, filtering, ordering, and revision-1 activity.
- `D19T-010..015`, `D19T-022..024`, `D19T-041`: shared entry/exit reconciliation, provenance, duplicate processing, half-open interval queries, unique lookup, immutability, and exact-valid results.
- `D19T-016..020`, `D19T-025..030`, `D19T-043`: accepted-history orphan rejection, exact provenance, current-state correspondence, deterministic legacy rebuild, real Snake Charmer replay, and regression coverage.
- `D19T-031..040`, `D19T-042`, `D19T-044..045`: undefined/raw hostile state, extra keys, sparse arrays, accessors, proxies, cycles, clone separation, duplicate query failure, fact-first classification, and direct ID classification.
- `D19T-046`: Dreamer matrix status remains exactly `PARTIAL`.
- `D19T-047`: Slice implementation coverage remains exactly `FOUNDATION`.

## Publication

- Status: `RUNNING`.
- Implementation commit: `bada60ad25a8b5fe441b11a72bcdca6edf7e2c73`.
- Branch: `phase-3/canonical-dreamer-role-tenure`.
- Pull request: [#28](https://github.com/JackeyLovedas/botc-singleplayer/pull/28).
- Candidate product HEAD: `2b3d46bda1b7f7565ac353d3180d473c531045c1`.
- Product-head push run `29401137937` attempt 1: `FAILURE` in Coverage because the existing Slice 2B16 Cerenovus test `keeps every Cerenovus batch event and clock metadata position retryable without burning the command ID` timed out at `5000ms`.
- Product-head push run `29401137937` attempt 2: the identical Coverage test timed out again at `5000ms`; workflow conclusion `FAILURE`.
- Product-head pull-request run `29401141471`: `SUCCESS` for the same HEAD.
- The repeated identical push failure was classified and resolved by the separately accepted test-infrastructure PR [#29](https://github.com/JackeyLovedas/botc-singleplayer/pull/29), without changing 2B19T product behavior or rule semantics.
- Accepted infrastructure merge: `8bfa5a1ec7af7aa19a5256cd67f814930d3579c8`; merge CI `29405396232` `SUCCESS`; accepted tag `infrastructure-cerenovus-integration-timeout-v1`.
- Accepted infrastructure closeout: `f2a8c755ab860b6531b1e9e63ff35c6740f0f052`; closeout CI `29405973975` `SUCCESS`.
- Latest accepted `origin/main` was merged normally with merge commit `72a7883248f66d53e65102c26788d73b93b56651`; no 2B19T production or test conflict occurred.
- Repair round remains `0`; `ruleReady=true`, `ruleDesignPass=true`, `implementationAuthorized=true`; `ruleSemanticsChanged=false`.
- Remaining blocker: `PENDING_EXACT_HEAD_CI_AND_FIRST_COMPLETE_FINAL_REVIEW`.

## Local validation

- Focused: `packages/domain-core/src/seamstress.test.ts` and `packages/domain-core/src/rebuild.test.ts` — `223/223` passed.
- Typecheck: passed.
- Lint: passed with zero warnings.
- Full suite: `33` files, `1418/1418` tests passed.
- Coverage suite: `33` files, `1418/1418` tests passed; `86.80%` statements/lines, `81.72%` branches, `97.79%` functions.
- Post-infrastructure local validation is refreshed and green: typecheck, lint, `33` files / `1418` tests, `33` files / `1418` coverage tests, coverage `86.80 / 81.72 / 97.79`, diff check, exact four-file/436-line production scope, and forbidden scans all pass. Independent final review has not started because fresh exact-head CI is pending.

## Stop boundary

This implementation does not start 2B19A1, 2B19A2, 2B19A3, 2B19B, FIRST_NIGHT/DAY continuation, or Phase 2C. Do not modify 2B19T production code or tests. Refresh the full local gates, publish the post-infrastructure exact HEAD, require both exact-head CI workflows to pass, and only then request the first complete independent final review.
