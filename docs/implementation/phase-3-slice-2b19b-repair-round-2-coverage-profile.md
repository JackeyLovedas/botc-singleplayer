# Phase 3 Slice 2B19B Repair Round 2 Exact Coverage Profile

## Identity

- Slice: `2B19B`
- repairRound: `2 / 2`
- repairProductHead: `c7313e253331505b163d4abe26c0c04c72afac88`
- profileId: `phase-3-slice-2b19b-c7313e2-ownership-v2-1`
- sourceHead: `c7313e253331505b163d4abe26c0c04c72afac88`
- sourceKind: `REPAIR_ROUND_2_STABLE_NINE_PROCESS_BASELINE`
- supersedesForTopology: `phase-3-slice-2b19b-274036a-ownership-v2-1`
- supersessionReason: `REPAIR_ROUND_2_CI_EVIDENCE_EXECUTION_STABILIZATION`
- topology: `NINE_PROCESS_COVERAGE_OWNERSHIP_V2_1`
- environment: Node `24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`, `VITEST_MAX_FORKS=1`
- profile status: `EXACT_REPAIR_ROUND_2_PROFILE_FROZEN`

This profile-only child changes no production code, tests, fixtures, traceability, ownership registry, workspace topology, dependencies, timeout, threshold, event contract, rule behavior, projection, receipt, or role-coverage status. Every older profile and its source-head authority remains immutable.

## Three fresh independent candidates

Each candidate started and ended with exact HEAD `c7313e253331505b163d4abe26c0c04c72afac88` and a clean worktree. The runner rejects any pre-existing candidate blob. Each run generated nine new coverage blobs and retained per-group reports, merged test and coverage reports, formal inventory/ownership audit, coverage-obligation discovery, summary, and manifest outside the repository.

| Run | Window (Asia/Shanghai) | Wall seconds | Shards | Tests | Risk hits | Merged coverage SHA-256 | Inventory audit SHA-256 | Discovery SHA-256 | Manifest SHA-256 |
|---|---|---:|---:|---:|---:|---|---|---|---|
| candidate-run-1 | `2026-07-19T20:51:34.8516308+08:00` to `2026-07-19T20:55:26.0230954+08:00` | 231.171 | 9/9 | 1520/1520 | 0 | `22585c15ef61744330246e68de5bc13476fa8c6d93393ab9f1c051a058f20a43` | `150af75460bc9a04aaf64e86a3230d23917667142933c7118a2dc3b2ab1fef8d` | `8c1cf121c3305d2ff7c90f88a9d3958bc9def883a01ea6fd5996c33cf90906a5` | `44016a73ece15eb82fb77b2b456a686c4a64767d680dad248512e34b395489ff` |
| candidate-run-2 | `2026-07-19T20:55:30.7769240+08:00` to `2026-07-19T20:59:24.7332986+08:00` | 233.956 | 9/9 | 1520/1520 | 0 | `e366a91a0447a1a472fc0bfa98dd285766199d18b651c8d77327d67b537e3c4d` | `150af75460bc9a04aaf64e86a3230d23917667142933c7118a2dc3b2ab1fef8d` | `8c1cf121c3305d2ff7c90f88a9d3958bc9def883a01ea6fd5996c33cf90906a5` | `fe5d589d95ff222c9ace6de46b06e728425df1657c22415e0df719bd328d14da` |
| candidate-run-3 | `2026-07-19T20:59:29.9458408+08:00` to `2026-07-19T21:03:22.4434852+08:00` | 232.498 | 9/9 | 1520/1520 | 0 | `6f1629f15f690c8a88d3261fd3fe14de65163528925524d3da90fea43c23a9d1` | `150af75460bc9a04aaf64e86a3230d23917667142933c7118a2dc3b2ab1fef8d` | `8c1cf121c3305d2ff7c90f88a9d3958bc9def883a01ea6fd5996c33cf90906a5` | `aff6668d0901652175002d261d39b103152c801266d41196694e18f0d0e9c31f` |

All canonical identities match. Candidate 1 is selected because it has the shortest complete wall time; selection does not discard either independent passing candidate.

## Frozen inventory and ownership

- physical test files: `31`
- workspace project-file executions: `35`
- group test counts: `207, 357, 456, 90, 52, 73, 20, 26, 239`
- global inventory SHA-256: `684c9186767c10489cf95eb81e8cbb76106f3812f6031a4b20b6043ffa8a150f`
- 2B19B project inventory SHA-256: `92bcddf3603962ff040338874429f43b98f711a0dd4fa02adfbc0ed80bec32c8`
- 2B19B semantic inventory SHA-256: `8121c6d14bb462f9c0dfe31750bc77890f53d600ff542b1a13450d231e42f482`
- 2B19B authority inventory SHA-256: `e7e88b9d6be6771d351ac8665b05dcaec305516f402d1a92655b845cba942e81`
- semantic tests / before / after / removed duplicates: `10 / 10 / 10 / 0`
- traceability / resolved / dynamic / supporting: `80 / 80 / 78 / 10`
- missing / duplicate / unexpected / ambiguous / wrong-owner / multi-primary: `0 / 0 / 0 / 0 / 0 / 0`

## Frozen coverage-obligation five-tuple

| Obligation | Count | Canonical identity SHA-256 |
|---|---:|---|
| sourceFiles | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| zeroHitStatements | 3204 | `aa2a04c353a155cf09b64abf887e404e22f639ed9179ca7c3daaf1b18dec3f70` |
| zeroHitFunctions | 23 | `1bd2399498399a94848b2fc51a717fa9cd89c6429a09d6d97ce87f7f6f274c1e` |
| zeroHitLines | 3204 | `f531da265036cb033c62e09249d6e899993333148b0e4b9bb9487cb447d30a75` |
| zeroHitBranchArms | 1799 | `8f9427be3ed6e81b5bf818b648dc61a6601b9b67f936517c2c50fea16a7c02ef` |

## External evidence

Root: `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\2b19b-c7313e2-repair2`

- runner SHA-256: `788661a2b54623036cd042543d5bc54da1c08ae8f592fdac019a003fe97dd4f4`;
- `three-candidate-stability.md` SHA-256: `46319feaa819e40875f2354e13db1db101cbceaab4475139d10ef025892768f2`;
- verdict: `THREE_CANDIDATE_CANONICAL_IDENTITIES_MATCH`.

## Fail-closed verifier and selector

The profile is one immutable entry appended to `APPROVED_COVERAGE_PROFILES`. The workflow changes only its explicit `--profile` value. Three new candidates match the exact new profile; the prior exact profile still matches its own historical candidate. Wrong, missing, automatic ambiguous, and duplicate selector cases all exit nonzero and fail closed. No CI status is inherited from R2P, R1Q, R1P, or the original product HEAD.

Final profile-child validation passes: ownership self-test `22/22`; fresh formal inventory `31` physical files, `35` workspace project-file executions, `1,520/1,520` tests, and zero mismatch; typecheck `4.141s`; lint `9.461s`; ordinary tests `35/1,520` in `39.227s`; coverage `35/1,520` in `56.696s` at statements/lines `79.01%`, branches `83.26%`, and functions `97.49%`. Exact R2Q CI and a fresh independent final review remain mandatory after the attributed local commit is pushed by a later authorization.
