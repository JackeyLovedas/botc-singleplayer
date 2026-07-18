# Phase 3 Slice 2B19A3B1 Exact Coverage Profile

## Identity

- Slice: `2B19A3B1`
- productImplementationHead: `00160fc342487506f33d713667d404d4ace734c4`
- profileId: `phase-3-slice-2b19a3b1-00160fc-ownership-v2-1`
- sourceHead: `00160fc342487506f33d713667d404d4ace734c4`
- sourceKind: `PRODUCT_IMPLEMENTATION_STABLE_NINE_PROCESS_BASELINE`
- topology: `NINE_PROCESS_COVERAGE_OWNERSHIP_V2_1`
- environment: Node `24.15.0`, explicit `corepack pnpm@11.7.0`, Vitest `3.2.6`, `VITEST_MAX_FORKS=1`
- profile status: `EXACT_PROFILE_FROZEN`

The profile source is the exact parent product commit. The profile-only child changes no production code, test, fixture, ownership criterion inventory, workspace topology, threshold, timeout, `onTaskUpdate` behavior, dependency, or merge algorithm.

## Three independent candidates

All candidates ran the complete existing nine-group workflow in nine independent processes. Each used the official Vitest blob merge, built all nine per-group reports, built the global report, ran `verify-vitest-coverage-groups.mjs`, and ran the canonical coverage-obligation audit.

| Run | Window (Asia/Shanghai) | Shards | Tests | Merged coverage SHA-256 | Inventory audit SHA-256 | Obligation audit SHA-256 | Manifest SHA-256 |
|---|---|---:|---:|---|---|---|---|
| candidate-run-1 | `2026-07-18T23:14:23.2008181+08:00` to `23:16:41.4669163+08:00` | 9/9 | 1494/1494 | `d1409c811aeb3db62f16c395779a406fec5317a8f80316f400159361595fcc77` | `b68ac17b7dbabec4c4141ffa59d15cce806d24ff6d313d05b0c470ea4e90f14f` | `5e82dfe3804d9aff8f4c090cb2074642e0c08393950ec1d189ee20bbf1e06eaf` | `b7e519fa580b7302d322441ed6e17bd3c171808d5ea1c868521a37159f37d049` |
| candidate-run-2 | `2026-07-18T23:17:02.9447286+08:00` to `23:18:48.9219567+08:00` | 9/9 | 1494/1494 | `253aa8ec2e7a700f86e3111517c6f13aa6d906ab8350ccf145a59930b09f4057` | `b68ac17b7dbabec4c4141ffa59d15cce806d24ff6d313d05b0c470ea4e90f14f` | `5e82dfe3804d9aff8f4c090cb2074642e0c08393950ec1d189ee20bbf1e06eaf` | `79e14b696b25687ccf5f8a1904ebaeefb4e4cb80f486088100c731e411e5aeef` |
| candidate-run-3 | `2026-07-18T23:19:21.3822588+08:00` to `23:20:51.1286522+08:00` | 9/9 | 1494/1494 | `bd5b474bf8d3ed3d5db3a64791757a5d2ea6fdd91f75c56800dc338a0131f170` | `b68ac17b7dbabec4c4141ffa59d15cce806d24ff6d313d05b0c470ea4e90f14f` | `5e82dfe3804d9aff8f4c090cb2074642e0c08393950ec1d189ee20bbf1e06eaf` | `673a96dc3d69210ad9fd0d7a440bc86cef809b1adc5de4efa81244c49c96ee31` |

Every run reported 31 physical test files, 35 workspace project-file executions, and zero failed, missing, duplicate, unexpected, ambiguous, or wrong-owner entries. Per-group test counts were identical: `206, 346, 456, 90, 52, 73, 20, 13, 238` in the frozen group order.

Raw merged coverage JSON bytes contain run-specific report data and therefore have distinct file hashes. This is not an obligation difference. The canonical semantic obligation five-tuple, inventory, ownership identity, source HEAD, topology, and test inventory are identical.

## Frozen obligation five-tuple

| Obligation | Count | Canonical identity SHA-256 |
|---|---:|---|
| sourceFiles | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| zeroHitStatements | 3185 | `0cfec8ab5ed6c823b7fc0aa7647b61c7354c7fc279e49d08469afa46bdd51817` |
| zeroHitFunctions | 23 | `0b8011b10d4293987c00e4f76c2d734c481b8d9878a70e59be15913d938cad5c` |
| zeroHitLines | 3185 | `c05c6e1960772a445430df01689249053b8ec169f62c40d4f494068e259b1d6a` |
| zeroHitBranchArms | 1781 | `e2da7c5d301b86c069a33bbca78f0454ff3e131b78cab23e646707521c9ebac0` |

## Inventory and ownership stability

- global inventory SHA-256, all three runs: `4840a548546c4e4d3574c4ab3378ba1b4accb5c89a8454cb4864cc847948100a`
- A3B1 baseline/current project inventory: `b8acb15d6189709ed89a23b4e748454d9a15c96fa0d96e321a67e9d2a969ee75`
- A3B1 semantic inventory: `0249a9ed7d37eb266ba402e13f4c0b9d0275eb7f1d7cb62a6b94950ad87f3c28`
- A3B1 authority inventory: `1f44c6ed51489119d39d1bec94e0a1e5c5a18ee6f96bafac597a4b4104090cac`
- non-marker ownership: `92f7e4197bf07f2186bb98e0ce5627964189ceff6f56e286a5a091166f74852c`
- physical test file set: `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab`
- traceability rows / resolved / dynamic / supporting authorities: `60 / 60 / 58 / 4`

## External evidence

Root: `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\2b19a3b1-00160fc`

- `candidate-run-1/manifest.md`
- `candidate-run-2/manifest.md`
- `candidate-run-3/manifest.md`
- `three-candidate-stability.md`, SHA-256 `c02492bccf5240dcda3462a5f328b59c314d08a066bb3eb026031566b97decff`
- each run retains all nine blobs, nine per-group JSON reports, the global merged report, merged coverage map, inventory audit, and obligation audit.

## Verifier and CI selection

The new profile is one immutable entry in `APPROVED_COVERAGE_PROFILES`. All three candidate maps independently returned `COVERAGE_APPROVED_PROFILE_MATCH` when requested by exact profile ID. Existing profiles remain unchanged. The only workflow edit replaces the explicit requested profile ID; the nine-process topology, commands, forks, merge, thresholds, timeout behavior, and semantic gates are unchanged.

The next gate is push and PR creation followed by exact profile-only HEAD CI. No CI status is inherited from `productImplementationHead`.

## Local profile-head validation

- exact requested profile verifier: `COVERAGE_APPROVED_PROFILE_MATCH`, 3/3 candidates;
- ownership registry self-test: `22/22 PASS`;
- typecheck: `PASS`;
- lint: `PASS`, zero warnings;
- ordinary full test with `VITEST_MAX_FORKS=1`: `35 files / 1494 tests PASS / 93.89s`;
- full coverage gate with `VITEST_MAX_FORKS=1`: `35 files / 1494 tests PASS / 138.06s`, statements/lines `79.03%`, branches `82.58%`, functions `97.45%`;
- candidate inventory verification: all nine groups and global inventory `PASS` in all three runs;
- JSON and diff checks: `PASS`.
