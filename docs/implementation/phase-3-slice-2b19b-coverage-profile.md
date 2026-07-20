# Phase 3 Slice 2B19B Exact Coverage Profile

## Identity

- Slice: `2B19B`
- productImplementationHead: `84aebe559cc9fd6d85571ec5753d4e36bdbfcb21`
- profileId: `phase-3-slice-2b19b-84aebe5-ownership-v2-1`
- sourceHead: `84aebe559cc9fd6d85571ec5753d4e36bdbfcb21`
- sourceKind: `PRODUCT_IMPLEMENTATION_STABLE_NINE_PROCESS_BASELINE`
- topology: `NINE_PROCESS_COVERAGE_OWNERSHIP_V2_1`
- environment: Node `24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`, `VITEST_MAX_FORKS=1`
- profile status: `EXACT_PROFILE_FROZEN`

The profile source is the exact parent product commit. This profile-only child changes no production code, tests, fixtures, ownership registry, workspace topology, dependencies, timeout, threshold, event contract, rule behavior, projection, receipt, or role-coverage status.

## Three independent candidates

Each candidate ran the complete nine-process coverage topology from a clean exact product HEAD. Every run produced nine blobs and per-group reports, the merged test and coverage reports, the formal inventory/ownership audit, and a pre-registration coverage-obligation discovery.

| Run | Window (Asia/Shanghai) | Shards | Tests | Merged coverage SHA-256 | Inventory audit SHA-256 | Discovery SHA-256 | Manifest SHA-256 |
|---|---|---:|---:|---|---|---|---|
| candidate-run-1 | `2026-07-19T18:16:48.7403155+08:00` to `18:20:51.1376846+08:00` | 9/9 | 1509/1509 | `f08e247b020598eeadbaddd1b0b8bad97961e2ec1f3f52747a71e2a43f3035ee` | `370b41ac90b892d32ec989bd4c0c2ffd1d1298d9ced331d80c8eac11fdc0a2a1` | `8980ed8665d56096565fe17478f09b72aebaf6db2446e7116d6e243aa3e3b724` | `74c34da814499ddd8aeb4acea9f7821928a94e92c4ea99e6f382e19f1f464e51` |
| candidate-run-2 | `2026-07-19T18:22:06.7996020+08:00` to `18:26:02.4784333+08:00` | 9/9 | 1509/1509 | `3b991c4778c25219be720948ad7d55f56eb395a19f4fb6f909586c0f94708172` | `370b41ac90b892d32ec989bd4c0c2ffd1d1298d9ced331d80c8eac11fdc0a2a1` | `8980ed8665d56096565fe17478f09b72aebaf6db2446e7116d6e243aa3e3b724` | `0879b106a3ece65923f9142a1dd0abaf3889e4731be2846cfe65745a93d50d60` |
| candidate-run-3 | `2026-07-19T18:28:42.3381389+08:00` to `18:32:22.6961908+08:00` | 9/9 | 1509/1509 | `a09c8a8c1334ad8a7dd320c821ee00a7ebcbd8c40561714b6ac2412c46470a70` | `370b41ac90b892d32ec989bd4c0c2ffd1d1298d9ced331d80c8eac11fdc0a2a1` | `8980ed8665d56096565fe17478f09b72aebaf6db2446e7116d6e243aa3e3b724` | `583cbefe9a4f48c24f60c355014f5871dce718d425c946792862ca064d8c5bd1` |

Every run reported 31 physical test files, 35 workspace project-file executions, and zero failed, missing, duplicate, unexpected, ambiguous, or wrong-owner identities. Per-group test counts were identical in the frozen order: `207, 353, 456, 90, 52, 73, 20, 19, 239`.

Raw Vitest blob, merged-test, and merged-coverage bytes contain per-run metadata and therefore differ. The canonical obligation identities, source inventory, group counts, ownership hashes, source HEAD, and topology are identical.

## Frozen obligation five-tuple

| Obligation | Count | Canonical identity SHA-256 |
|---|---:|---|
| sourceFiles | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| zeroHitStatements | 3204 | `aa2a04c353a155cf09b64abf887e404e22f639ed9179ca7c3daaf1b18dec3f70` |
| zeroHitFunctions | 23 | `1bd2399498399a94848b2fc51a717fa9cd89c6429a09d6d97ce87f7f6f274c1e` |
| zeroHitLines | 3204 | `f531da265036cb033c62e09249d6e899993333148b0e4b9bb9487cb447d30a75` |
| zeroHitBranchArms | 1799 | `8f9427be3ed6e81b5bf818b648dc61a6601b9b67f936517c2c50fea16a7c02ef` |

## Inventory and ownership stability

- global inventory SHA-256: `65b24b2075d1207d183ec53066aebef4352abaec652d8abd1567f77ff4761e10`
- 2B19B baseline/current project inventory: `29842f323daadfd182150229b5abedaea335e9fdf051ce19e6011795f7562890`
- 2B19B semantic inventory: `58809068381d2ba741279abb45b1408800413abbd9a11813eb36b7734e34ed4b`
- 2B19B authority inventory: `a74b71853434c3a44ddd9ce957e05af2aa758f627591107169cb34276e6356e7`
- non-marker ownership: `92f7e4197bf07f2186bb98e0ce5627964189ceff6f56e286a5a091166f74852c`
- physical test file set: `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab`
- traceability rows / resolved / dynamic / supporting authorities: `80 / 80 / 78 / 10`

## External evidence

Root: `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\2b19b-84aebe5`

- each `candidate-run-N` retains the nine raw blobs, nine per-group JSON reports, merged reports, coverage map, inventory audit, discovery, and manifest;
- `three-candidate-stability.md`, SHA-256 `d5bdf7c35ad8b059b738c767271aa7fa881ce93b1bece015b27fba5ffcb661d8`.

## Fail-closed verifier and CI selection

The new profile is one immutable entry appended to `APPROVED_COVERAGE_PROFILES`; every historical entry remains byte-identical. The workflow changes only the explicit `--profile` token. The nine-process topology, commands, forks, merge, thresholds, timeouts, dependencies, and semantic gates remain unchanged.

The next gate after the profile-only child is controller-owned push, PR creation, exact profile-head CI, PR-body reconciliation, and a complete independent final review. No CI status is inherited from the product commit.
