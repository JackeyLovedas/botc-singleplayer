# Phase 3 Slice 2B19B Repair Round 1 Exact Coverage Profile

## Identity

- Slice: `2B19B`
- repairRound: `1 / 2`
- repairProductHead: `274036a09b96012a1bb5ddb08eabab9e6ad84214`
- profileId: `phase-3-slice-2b19b-274036a-ownership-v2-1`
- sourceHead: `274036a09b96012a1bb5ddb08eabab9e6ad84214`
- sourceKind: `REPAIR_ROUND_1_STABLE_NINE_PROCESS_BASELINE`
- supersedesForTopology: `phase-3-slice-2b19b-84aebe5-ownership-v2-1`
- supersessionReason: `REPAIR_ROUND_1_TEST_EVIDENCE_AND_OWNERSHIP_REFRESH`
- topology: `NINE_PROCESS_COVERAGE_OWNERSHIP_V2_1`
- environment: Node `24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`, `VITEST_MAX_FORKS=1`
- profile status: `EXACT_REPAIR_PROFILE_FROZEN`

This profile-only child changes no production code, tests, fixtures, ownership registry, workspace topology, dependencies, timeout, threshold, event contract, rule behavior, projection, receipt, or role-coverage status. The historical profile document `docs/implementation/phase-3-slice-2b19b-coverage-profile.md` remains unchanged.

## Three fresh independent candidates

Each candidate started and ended with exact HEAD `274036a09b96012a1bb5ddb08eabab9e6ad84214` and a clean worktree. Each ran all nine isolated coverage processes and retained raw blobs, per-group reports, the merged test and coverage reports, formal inventory/ownership audit, coverage-obligation discovery, summary, and manifest outside the repository.

| Run | Window (Asia/Shanghai) | Shards | Tests | Merged coverage SHA-256 | Inventory audit SHA-256 | Discovery SHA-256 | Manifest SHA-256 |
|---|---|---:|---:|---|---|---|---|
| candidate-run-1 | `2026-07-19T19:43:30.7823287+08:00` to `2026-07-19T19:50:44.6477581+08:00` | 9/9 | 1520/1520 | `7e17623004d0ddd8059edd580c1a438954296dd704756ecf9085037f01b93fce` | `150af75460bc9a04aaf64e86a3230d23917667142933c7118a2dc3b2ab1fef8d` | `a0db985043bac8698aad97e741dadf6c0abae00fe06c3c889536d4827006df93` | `17f10b0b4c27d4475502dcc7abcc42510803a7597e994fae0d39d390f21153a8` |
| candidate-run-2 | `2026-07-19T19:50:55.7418215+08:00` to `2026-07-19T19:54:51.3387942+08:00` | 9/9 | 1520/1520 | `75d835630e33233e4d979aaf2c1b4a81ef04d15d704d5c1263d5f7e526957367` | `150af75460bc9a04aaf64e86a3230d23917667142933c7118a2dc3b2ab1fef8d` | `a0db985043bac8698aad97e741dadf6c0abae00fe06c3c889536d4827006df93` | `6b713bbacac9fb7f56f37a1e841a33705cc10bdafaced15727fb4dc4abc7e076` |
| candidate-run-3 | `2026-07-19T19:55:19.4042428+08:00` to `2026-07-19T19:59:04.6505780+08:00` | 9/9 | 1520/1520 | `4b99c7f4216722b01ea6a70ddce4a629d09428480ccb4cc0844ade5b2fdf7ac4` | `150af75460bc9a04aaf64e86a3230d23917667142933c7118a2dc3b2ab1fef8d` | `a0db985043bac8698aad97e741dadf6c0abae00fe06c3c889536d4827006df93` | `426c9ecb6f6f213c0c60b9c699ce79b01c9d58252bd872a18c7ea61c937ef507` |

Raw merged coverage bytes differ because they contain per-run metadata. Canonical test inventory, ownership identities, group counts, coverage-obligation identities, source HEAD, and topology are identical.

## Frozen repair inventory and ownership

- physical test files: `31`
- workspace project-file executions: `35`
- group test counts: `207, 357, 456, 90, 52, 73, 20, 26, 239`
- global inventory SHA-256: `684c9186767c10489cf95eb81e8cbb76106f3812f6031a4b20b6043ffa8a150f`
- 2B19B project inventory SHA-256: `92bcddf3603962ff040338874429f43b98f711a0dd4fa02adfbc0ed80bec32c8`
- 2B19B semantic inventory SHA-256: `8121c6d14bb462f9c0dfe31750bc77890f53d600ff542b1a13450d231e42f482`
- 2B19B authority inventory SHA-256: `e7e88b9d6be6771d351ac8665b05dcaec305516f402d1a92655b845cba942e81`
- non-marker ownership SHA-256: `92f7e4197bf07f2186bb98e0ce5627964189ceff6f56e286a5a091166f74852c`
- physical test-file-set SHA-256: `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab`
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

The old `phase-3-slice-2b19b-84aebe5-ownership-v2-1` entry still matches this five-tuple because Product Repair Round 1 changed no production code. Its `sourceHead` remains the old product HEAD, however, and it is not source-head authority for the repair product. The new profile separately freezes the repair HEAD and its `1520`-test ownership identity.

## External evidence

Root: `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\2b19b-274036a-repair1`

- each `candidate-run-N` retains its nine fresh blobs and all derived reports, audits, summaries, and manifests;
- `three-candidate-stability.md`, SHA-256 `6530bc6e6117feeac1776b27b31467904d80618e2006cfc142e1a0502d8c234a`;
- stability verdict: `THREE_CANDIDATE_CANONICAL_IDENTITIES_MATCH`.

## Fail-closed verifier and selector

The new profile is one immutable entry appended to `APPROVED_COVERAGE_PROFILES`. Every prior profile retains its behavior. The workflow changes only the explicit `--profile` value from the historical 2B19B profile to `phase-3-slice-2b19b-274036a-ownership-v2-1`; topology, commands, forks, merge behavior, thresholds, timeouts, and semantic gates remain unchanged.

Fresh validation passes exact new-profile matches for all three candidates and the old exact profile against its own candidate. Missing and wrong IDs, ambiguous automatic selection between identical old/new tuples, and duplicate selector arguments all fail closed. No CI status is inherited from either product HEAD or the prior profile child.

Final profile-child gates pass: ownership self-test `22/22`; formal inventory `31` physical files, `35` project-file executions, and `1,520` tests with zero mismatch; typecheck and lint; ordinary tests `35/1,520` in `40.51s`; and coverage `35/1,520` with shell wall `59.8s` at statements/lines `79.09%`, branches `83.26%`, and functions `97.49%`.
