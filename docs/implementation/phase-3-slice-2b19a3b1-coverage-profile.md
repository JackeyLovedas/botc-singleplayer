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

## Repair Round 1 superseding exact profile

The original `00160fc` profile above remains immutable historical evidence. Repair Round 1 adds a separate exact profile without changing or deleting the original entry.

- repair source HEAD: `bf9f170590d90733a3bd5de810e0096fc40f4e84`
- profile ID: `phase-3-slice-2b19a3b1-bf9f170-repair1-ownership-v2-1`
- source kind: `REPAIR_ROUND_1_STABLE_NINE_PROCESS_BASELINE`
- supersedes for the current topology: `phase-3-slice-2b19a3b1-00160fc-ownership-v2-1`
- supersession reason: `REPAIR_ROUND_1_TEST_AUTHORITY_AND_OWNERSHIP_REFRESH`
- profile status: `EXACT_PROFILE_FROZEN_PENDING_PROFILE_ONLY_HEAD_CI`
- environment: Node `24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`, `VITEST_MAX_FORKS=1`

The source HEAD contains the Repair Round 1 test authority, the projection ownership microfix, and the refreshed exact A3B1 ownership snapshot. It changes no production code relative to the frozen Repair Round 1 product behavior. The profile-only child may change only the approved profile registry, explicit CI profile selection, traceability, profile evidence, and control records.

### Fresh independent candidates

These are three new, strictly serial candidates. The earlier `f523` and `851` attempts are excluded from this success set.

| Run | Window (Asia/Shanghai) | Shards | Tests | Merged coverage SHA-256 | Inventory audit SHA-256 | Obligation discovery SHA-256 | Manifest SHA-256 |
|---|---|---:|---:|---|---|---|---|
| candidate-run-1 | `2026-07-19T11:03:35.3216370+08:00` to `11:06:58.9345554+08:00` | 9/9 | 1499/1499 | `82995b96bd66261fffa5f4786fb39dc60865534b72ab5e5c0d46c28e9546d9b3` | `b39a38f050d522a16a594435456e0edbd45c002c467c98e424d6be4d946961c0` | `985f5c0e52586b3278726e05abd07af70e3fb222e10147c6a57d665dd0bb46c9` | `0e96877a9d06000a1e5d0af398f54fd135ef4bb3cebf905f978f22b840cad782` |
| candidate-run-2 | `2026-07-19T11:07:42.3419839+08:00` to `11:11:07.0458660+08:00` | 9/9 | 1499/1499 | `e783a4cf18847255d1405f2ae8788cf063a2a77440d4b0c27a83604220fc569a` | `b39a38f050d522a16a594435456e0edbd45c002c467c98e424d6be4d946961c0` | `985f5c0e52586b3278726e05abd07af70e3fb222e10147c6a57d665dd0bb46c9` | `6b85f7e052c57b479b8941b0e541acd2fa5e8833221ea14f78e3c45529239c5c` |
| candidate-run-3 | `2026-07-19T11:11:49.5547832+08:00` to `11:15:17.4201493+08:00` | 9/9 | 1499/1499 | `9e1aa147b9fa589be5a7eeb5873a43bc6d0621420ebec9bc4a2298108895482e` | `b39a38f050d522a16a594435456e0edbd45c002c467c98e424d6be4d946961c0` | `985f5c0e52586b3278726e05abd07af70e3fb222e10147c6a57d665dd0bb46c9` | `c634a477c9b6d784d444bb7effe79bf43725faa1dbef928098742133c1ab1cde` |

Every run reports 31 physical test files, 35 workspace project-file executions, and group counts `207, 346, 456, 90, 52, 73, 20, 16, 239`. All nine groups and the global report have zero failed, missing, duplicate, unexpected, ambiguous, or wrong-owner entries.

### Repair Round 1 frozen obligation five-tuple

| Obligation | Count | Canonical identity SHA-256 |
|---|---:|---|
| sourceFiles | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| zeroHitStatements | 3184 | `cfc7bc76d6a025779ddd2d1ca0937f68519a3ff10e13b2d586948d5840cd0202` |
| zeroHitFunctions | 23 | `0b8011b10d4293987c00e4f76c2d734c481b8d9878a70e59be15913d938cad5c` |
| zeroHitLines | 3184 | `02529a665486258e5f856799d9511752afe88a978b5dac78bf7c422affbc59bf` |
| zeroHitBranchArms | 1773 | `d54322bb82c9e86ee67f4b2164a36cf60f4f7f04c123f025003d97a4884ee6b6` |

### Inventory and ownership identity

- global inventory SHA-256: `c68a2e4c70b36464282d4227007da2cae95e9d91bc36cb9519aafb014f3234ef`
- A3B1 baseline/current project inventory: `9d8726005537db396683c3701546a85f0094b3e84ca062f1d7113a66b3eef189`
- A3B1 semantic inventory: `bd194c778f83c42c4bc46307f028e1a289b01c50a49c2169ce2a07c267a317f4`
- A3B1 authority inventory: `c42fc09726d54c1e9ea6f7d88756435340f7e329cd5fd45f00c9030979e574c6`
- A3B1 ownership: six semantic tests, six owner-project executions, `60/60` traceability rows, 58 dynamic rows, four supporting authorities, zero ambiguity

### External repair evidence

Root: `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\2b19a3b1-bf9f170-repair1`

- each `candidate-run-N` retains all nine blobs, nine group reports, global merged report and coverage map, inventory audit, obligation result, logs, and manifest;
- `three-candidate-stability.md`, SHA-256 `8b127a8b54ae0c887b226e8081881fa24f96ad97473a5e930cea3dfbabc39ef0`;
- all three repaired-head candidates return `COVERAGE_APPROVED_PROFILE_MATCH` for the exact new profile after registry materialization.

### Fail-closed attempts retained but excluded

- `f523f7c4457cc52261044323a4db9634879c8ddb`: rejected a duplicate mixed C30 ownership binding;
- `851743b36c0f58372b49aad67a511dfd1b5ae11e`: rejected the stale pre-repair three-test frozen A3B1 ownership baseline;
- the first bf9f harness invocation stopped before completing shard 1 because Windows PowerShell treated Vitest deprecation stderr as a terminating native-command error.

These are diagnostic evidence only and do not count toward the successful `3/3`. No production, test, fixture, ownership topology, timeout, threshold, or `onTaskUpdate` behavior changed while establishing the profile.

### Repair profile worktree validation

- exact requested-profile verifier: `3/3 COVERAGE_APPROVED_PROFILE_MATCH`;
- ownership registry load: `PASS`;
- ownership verifier self-test: `22/22 PASS`;
- formal candidate inventory: `1499` tests, A3B1 `6` semantic / `6` owner executions / `60/60` rows / `58` dynamic / `4` support, every mismatch count zero;
- typecheck: `PASS`;
- lint: `PASS`, zero warnings;
- full ordinary with `VITEST_MAX_FORKS=1`: `35 files / 1499 tests PASS / 99.50s`;
- full coverage with `VITEST_MAX_FORKS=1`: `35 files / 1499 tests PASS / 147.67s`, statements/lines `78.95%`, branches `82.71%`, functions `97.45%`;
- JSON, whitespace, source-parent, and scoped-diff checks: `PASS` before commit.

## Repair Round 2 Windows test-structure exact profile

The original `00160fc` profile and Repair Round 1 `bf9f170` profile above remain immutable historical evidence. Repair Round 2 adds one separate exact profile for the same-title `Promise.all` test-structure source HEAD; it changes neither the frozen ownership topology nor any coverage obligation.

- repair source HEAD: `c384c60add75211bd20139b9e289da8fd6e15bb5`
- profile ID: `phase-3-slice-2b19a3b1-c384c60-repair2-ownership-v2-1`
- source kind: `REPAIR_ROUND_2_WINDOWS_TEST_STRUCTURE_STABLE_NINE_PROCESS_BASELINE`
- supersedes for the current topology: `phase-3-slice-2b19a3b1-bf9f170-repair1-ownership-v2-1`
- supersession reason: `REPAIR_ROUND_2_WINDOWS_SAME_TITLE_PROMISE_ALL_PROFILE_REFRESH`
- profile status: `EXACT_PROFILE_FROZEN_PENDING_PROFILE_ONLY_HEAD_CI`
- environment: Node `24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`, `VITEST_MAX_FORKS=1`

The source HEAD preserves the exact single Seamstress test title and inventory while executing four independent actor cases with `Promise.all`. It changes no production code, fixture, ownership contract or snapshot, workspace topology, global or single-test timeout, `onTaskUpdate`, dependency, or rule semantics. Push CI `29671838025` attempts `1/2` and `2/2` on the parent HEAD timed out only that Windows test; PR CI `29671838696` passed `22/22` on the same parent.

### Fresh independent Repair Round 2 candidates

These three new candidates ran strictly serially from the exact `c384c60` source. No earlier profile or failed attempt is counted.

| Run | Window (Asia/Shanghai) | Shards | Tests | Merged coverage SHA-256 | Inventory audit SHA-256 | Obligation discovery SHA-256 | Manifest SHA-256 |
|---|---|---:|---:|---|---|---|---|
| candidate-run-1 | `2026-07-19T11:59:11.4247210+08:00` to `12:02:58.2122507+08:00` | 9/9 | 1499/1499 | `b407011e404b0eaa4f0f93dd9a3b4469312a66b12b4b5707d71f9b60409a9648` | `b39a38f050d522a16a594435456e0edbd45c002c467c98e424d6be4d946961c0` | `19cfb4335ef73a73060f07966707809253f2b55edc3750659285eb3ef51c767f` | `6c75fb86f8b87518ba430650550fe27388a689919a88d5101bdc0fa12ce943b1` |
| candidate-run-2 | `2026-07-19T12:03:43.4036832+08:00` to `12:07:32.2140007+08:00` | 9/9 | 1499/1499 | `d3c731759f91eca3e4ca94b4fe08b0ba285320b87e655bd7a29d18b1a3fffcb5` | `b39a38f050d522a16a594435456e0edbd45c002c467c98e424d6be4d946961c0` | `19cfb4335ef73a73060f07966707809253f2b55edc3750659285eb3ef51c767f` | `9a3523ec64ba20f234741b72838b91919e4d07465c9e5db52fe1a7dfcc0f61c8` |
| candidate-run-3 | `2026-07-19T12:07:32.3607068+08:00` to `12:11:21.0178265+08:00` | 9/9 | 1499/1499 | `74f332ecf65436280d46358bd5f66132d9f6c493e1b63d44efa36914aa211390` | `b39a38f050d522a16a594435456e0edbd45c002c467c98e424d6be4d946961c0` | `19cfb4335ef73a73060f07966707809253f2b55edc3750659285eb3ef51c767f` | `54a678636ce73716c378dd5c89818420170e1e7d10cc0da633bf6acbdf066434` |

Every run reports 31 physical test files, 35 workspace project-file executions, and group counts `207, 346, 456, 90, 52, 73, 20, 16, 239`. All nine groups and the global report have zero failed, missing, duplicate, unexpected, ambiguous, or wrong-owner entries.

### Repair Round 2 frozen obligation five-tuple

| Obligation | Count | Canonical identity SHA-256 |
|---|---:|---|
| sourceFiles | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| zeroHitStatements | 3184 | `cfc7bc76d6a025779ddd2d1ca0937f68519a3ff10e13b2d586948d5840cd0202` |
| zeroHitFunctions | 23 | `0b8011b10d4293987c00e4f76c2d734c481b8d9878a70e59be15913d938cad5c` |
| zeroHitLines | 3184 | `02529a665486258e5f856799d9511752afe88a978b5dac78bf7c422affbc59bf` |
| zeroHitBranchArms | 1773 | `d54322bb82c9e86ee67f4b2164a36cf60f4f7f04c123f025003d97a4884ee6b6` |

### Repair Round 2 inventory and ownership identity

- global inventory SHA-256: `c68a2e4c70b36464282d4227007da2cae95e9d91bc36cb9519aafb014f3234ef`
- non-marker ownership SHA-256: `92f7e4197bf07f2186bb98e0ce5627964189ceff6f56e286a5a091166f74852c`
- A3B1 project inventory SHA-256: `9d8726005537db396683c3701546a85f0094b3e84ca062f1d7113a66b3eef189`
- A3B1 semantic inventory SHA-256: `bd194c778f83c42c4bc46307f028e1a289b01c50a49c2169ce2a07c267a317f4`
- A3B1 authority inventory SHA-256: `c42fc09726d54c1e9ea6f7d88756435340f7e329cd5fd45f00c9030979e574c6`
- A3B1 ownership: six semantic tests, six owner-project executions, `60/60` traceability rows, 58 dynamic rows, four supporting authorities, zero mismatch

### External Repair Round 2 evidence

Root: `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\2b19a3b1-c384c60-repair2`

- each `candidate-run-N` retains all nine shard blobs, nine official per-group reports, the official global merged report and coverage map, inventory audit, obligation discovery result, logs, equality evidence, and manifest;
- `three-candidate-stability.md`, SHA-256 `792e5097c6ab11c6140f36abb7b86ac0d6e7d25abf2d80f6e83c6f7df68bcf8c`;
- `harness-failed-pre-candidate-run-1-native-stderr` is retained but excluded because it stopped before completing shard 1 on the known PowerShell stderr harness issue;
- all older profiles and failed attempts remain unchanged and are excluded from the new `3/3`.

### Repair Round 2 profile worktree gate

- exact requested-profile verifier: `3/3 COVERAGE_APPROVED_PROFILE_MATCH`; explicit requested-profile selection remains fail-closed on a mismatch even though Repair Round 1 and Round 2 intentionally share the same semantic tuple;
- ownership registry load: `PASS`; ownership verifier self-test: `22/22 PASS`; formal inventory: `1499` tests with A3B1 `6/6 / 60/60 / 58 / 4`, non-marker `92f7e419...852c`, and zero mismatch;
- typecheck: `PASS / 4.08s`; lint: `PASS / 10.13s`, zero warnings;
- full ordinary with `VITEST_MAX_FORKS=1`: `35 files / 1499 tests PASS / 104.02s Vitest / 106.00s wall`;
- full coverage with `VITEST_MAX_FORKS=1`: `35 files / 1499 tests PASS / 149.03s Vitest / 151.40s wall`, statements/lines `78.85%`, branches `82.71%`, functions `97.45%`;
- the profile-only child may change only the approved profile registry, explicit CI profile selection, C37 traceability, profile evidence, and four control records;
- JSON, whitespace, exact-parent, authorized-path, and scoped-diff checks are required immediately before commit;
- fresh push/PR CI, PR-body reconciliation, and fresh independent final review remain required. No prior CI or review transfers to the profile-only child.
