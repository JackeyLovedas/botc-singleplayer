# Phase 3 Slice 2B19A3B2 Exact Coverage Profile

## Identity

- Slice: `2B19A3B2`
- product/test source HEAD: `2c5f2f62d8c07e83148242a8c5862c9d2019e9e6`
- profile ID: `phase-3-slice-2b19a3b2-2c5f2f6-ownership-v1`
- source HEAD: `2c5f2f62d8c07e83148242a8c5862c9d2019e9e6`
- source kind: `TEN_PROCESS_2B19A3B2_OWNERSHIP_V1`
- topology: `TEN_PROCESS_COVERAGE_WITH_DREAMER_VORTOX_MARKER_PARTITION`
- environment: Node `24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`, `VITEST_MAX_FORKS=1`
- profile status: `EXACT_PROFILE_FROZEN_PENDING_ATTRIBUTED_PROFILE_COMMIT`

The exact profile binds the immutable product/test source commit, never its profile-only child. The source commit has zero production diff and adds only the reviewed A3B2 tests, ownership, traceability, role matrix, and controls. This profile-only continuation changes no production, test, fixture, ownership, traceability semantic, rule, role status, Vitest project, group membership, command, dependency, timeout, threshold, fork count, collector, diagnostic, or merge algorithm.

## Formal ordinary authority

The formal CI-equivalent ordinary run used all nine existing groups and official blob/per-group/global merges:

- groups: `9 / 9`, all process and merge exits `0`;
- tests: `1,544 / 1,544`;
- missing / duplicate / unexpected / wrong owner: `0 / 0 / 0 / 0`;
- ordinary execution SHA-256: `f29bed32c2c644e31aa93666406b0a8e8f7072b13135ada18782a970c069878a`;
- semantic inventory SHA-256: `a56e28357c80e156709c3c1d714040d58c85a61a7c2b6fbc3e6c737738a12cf6`;
- ordinary inventory artifact SHA-256: `43f561a8834fef1fe7e6a81f3d692c9445f5011dde241383e1a4decf5438cef8`;
- risk hits: `0`.

One external pre-run harness invocation failed during PowerShell parsing before Node or Vitest started, created no blob/result, and is excluded. The controller authorized the classification `PRE_ORDINARY_POWERSHELL_PARSE_ERROR` and only the external `${group}:` interpolation correction. No repository byte changed for that correction.

## Three complete coverage candidates

Each effective candidate ran the same ten existing coverage groups in independent processes with `VITEST_MAX_FORKS=1`, including the exact Dreamer patterns `\[(?:2B19A3A|2B19A3B1)-` and `\[2B19B-`. Logs are outside all blob merge-input directories.

| Candidate | Window (Asia/Shanghai) | Groups | Tests | Group wall total | Effective elapsed | Raw coverage SHA-256 | Inventory SHA-256 | Risk hits |
|---|---|---:|---:|---:|---:|---|---|---:|
| 1 | `2026-07-22T16:03:39.6312004+08:00` to `16:06:29.5436901+08:00` | 10/10 | 1,544 | `251.271s` | `169.912s` | `dd5bd7973cdcd33473a655f9a919e6e609fb7446593ac4900ba4d9e75db86a4e` | `6b3df31bc1eae3211379739bab0c21e1ab024767b317f26c12cf5b7b0d180714` | 0 |
| 2 | `2026-07-22T16:07:00.6833587+08:00` to `16:09:36.0091172+08:00` | 10/10 | 1,544 | `253.362s` | `155.326s` | `775f3c831e33709a6a4773ef16496c74e5d0575cab3bd11d54c84adc02a7287b` | `6b3df31bc1eae3211379739bab0c21e1ab024767b317f26c12cf5b7b0d180714` | 0 |
| 3 | `2026-07-22T16:10:00.3488672+08:00` to `16:12:34.6054167+08:00` | 10/10 | 1,544 | `253.468s` | `154.257s` | `986e8a7b73dfd296469343e2b40cb197148eed8880485cfad773b6eaffd44339` | `6b3df31bc1eae3211379739bab0c21e1ab024767b317f26c12cf5b7b0d180714` | 0 |

All candidates have exact group counts `207 / 357 / 465 / 90 / 52 / 82 / 26 / 16 / 10 / 239`, `31` physical test files, `35` workspace project-file executions, and all mismatch counts zero. Canonical hashes are identical:

- ordinary/project execution: `f29bed32c2c644e31aa93666406b0a8e8f7072b13135ada18782a970c069878a`;
- coverage execution: `1e11e13f1549363109a223026f4191664fe8c26ce66d5f2219ca46b141bfadf0`;
- semantic inventory: `a56e28357c80e156709c3c1d714040d58c85a61a7c2b6fbc3e6c737738a12cf6`.

Raw blob, merged-test, and merged-coverage hashes are non-authoritative and retain runner-specific bytes. Every canonical comparison returns `COVERAGE_SEMANTIC_OBLIGATIONS_EQUAL`.

## Frozen coverage obligations

| Obligation | Count | Canonical identity SHA-256 |
|---|---:|---|
| sourceFiles | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| zeroHitStatements | 3,204 | `d535141afb3c60331af1ca6dcd7cab6dff5df2e2f8db75e943a72ab1963d1644` |
| zeroHitFunctions | 23 | `4fdf762b692b151aed1686a73441f38a913ed796a6d5193021d127ed6703dbec` |
| zeroHitLines | 3,204 | `fc2ec99a8cbafa2b2a4bb6fef99430a72d83bdf1da74cca00b38000400c5691e` |
| zeroHitBranchArms | 1,795 | `6d8ba5d94a86dddf1b045f73e58e4e2c826bcf7c6d004a8ed7fd8d575aa315f5` |

The comparison JSON, including the canonical sets and hashes, is byte-identical across all comparisons at SHA-256 `eaff423265e4c95b06651109f6005765f4c7859b67ebdbd73484d7156a8d84b1`.

## External evidence

Root: `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\phase-3-slice-2b19a3b2-2c5f2f6-ownership-v1`

- `ordinary/` retains the nine formal blobs, group/global reports, inventory audit, and logs;
- each `candidate-N/` retains ten shard blobs and coverage maps, ten group reports, exact ten-blob merge input, global test/coverage reports, inventory audit, comparisons, validations, and logs;
- logs are not stored in blob input directories;
- `three-candidate-stability.md` SHA-256: `ad08f0f86efdfd53dc2e8faa6328e3519a07bf504eae3b810abf1122a554444f`.

No timeout, `onTaskUpdate`, unhandled error, worker exit, IPC closure, process exit 1, merge failure, inventory mismatch, or hidden rerun exists in the three effective candidates.

## Exact profile validation

All three candidate coverage maps return `COVERAGE_APPROVED_PROFILE_MATCH` when explicitly requesting `phase-3-slice-2b19a3b2-2c5f2f6-ownership-v1`. Their validation artifacts are byte-identical at SHA-256 `908abbcf462ad05e12e36d0f11acfa6749fc5b9b83fe62b40f6f62df95c3f5f7`.

The workflow edit replaces only the explicit `--profile` selector. Existing nine ordinary groups, ten coverage groups, both Dreamer patterns, commands, fork count, merge and semantic gates, thresholds, diagnostics, dependencies, and timeouts remain byte-identical.

## Profile-head local validation

- exact requested profile: `3 / 3 COVERAGE_APPROVED_PROFILE_MATCH`;
- typecheck: `PASS`;
- full lint: `PASS`, zero warnings;
- ownership self-test: `22 / 22 PASS`;
- profile registry syntax and exact three-candidate selection: `PASS`;
- JSON/YAML/diff/scope audit: `PASS`.

The next authorized action is one attributed, unpushed profile-only commit. No source/profile CI authority, PR, review, merge, tag, or acceptance is inferred.

## RR1 exact profile

- product/test source HEAD: `cfd6982652960096c552950cc94ac41c5f220824`
- profile ID: `phase-3-slice-2b19a3b2-cfd6982-repair1-ownership-v1`
- source kind: `REPAIR_ROUND_1_TEST_EVIDENCE_EXECUTION_STABLE_TEN_PROCESS`
- topology: `TEN_PROCESS_COVERAGE_WITH_DREAMER_VORTOX_MARKER_PARTITION`
- profile status: `RR1_EXACT_PROFILE_FROZEN_PENDING_ATTRIBUTED_PROFILE_COMMIT`

The historical `phase-3-slice-2b19a3b2-2c5f2f6-ownership-v1` record above remains byte-preserved in the registry and authoritative only for source `2c5f2f62d8c07e83148242a8c5862c9d2019e9e6`. The RR1 record binds the exact repair source, never its profile-only child, and does not infer product CI or acceptance.

Three brand-new complete ten-process candidates used the frozen group topology and exact Dreamer patterns. Each passed `10 / 10` processes, `1,544 / 1,544` semantic tests, group counts `207 / 357 / 465 / 90 / 52 / 82 / 26 / 16 / 10 / 239`, and missing / duplicate / unexpected / wrong-owner counts `0 / 0 / 0 / 0`.

| Candidate | Window (Asia/Shanghai) | Group wall total | Effective elapsed | Raw coverage SHA-256 | Risk hits |
|---|---|---:|---:|---|---:|
| 1 | `2026-07-22T17:27:46.7241254+08:00` to `17:31:01.3248949+08:00` | `228.961s` | `194.601s` | `26b9c973329e7fee85fb701f4942520e0da9ea627bd9c3e9de73187836d00dd4` | 0 |
| 2 | `2026-07-22T17:32:26.1568052+08:00` to `17:35:38.4938150+08:00` | `229.245s` | `192.337s` | `3f80e64051c8e0345c82f4bc8ad70821c63356b2ecf3075ffcb7ad0ead5f56a6` | 0 |
| 3 | `2026-07-22T17:36:57.3081679+08:00` to `17:40:09.3276004+08:00` | `227.333s` | `192.019s` | `1d02642ac0593d366246414e07d60986e1d2b1d9d4eea25e4bebd7af1e1119d7` | 0 |

Canonical authority is identical across all three candidates: coverage execution `1e11e13f1549363109a223026f4191664fe8c26ce66d5f2219ca46b141bfadf0`, semantic inventory `a56e28357c80e156709c3c1d714040d58c85a61a7c2b6fbc3e6c737738a12cf6`, and obligation tuple `63 / 3204 / 23 / 3204 / 1795` with the same five hashes frozen above. Every self and pairwise comparison returns `COVERAGE_SEMANTIC_OBLIGATIONS_EQUAL`; the byte-identical comparison SHA-256 is `eaff423265e4c95b06651109f6005765f4c7859b67ebdbd73484d7156a8d84b1`.

External evidence root is `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\phase-3-slice-2b19a3b2-cfd6982-repair1-ownership-v1`; `three-candidate-stability.md` SHA-256 is `fa4a73140d5c320788ac516eec2f331f857578b9a0b5e3b78fa9ec6f7b3b40e8`. Two partial first-batch harness attempts are preserved and explicitly excluded because this PowerShell host returned a null `Start-Process` exit status; the effective direct-process launcher was validated before use. No timeout, `onTaskUpdate`, unhandled error, worker exit, IPC closure, exit 1, mismatch, or hidden rerun exists in the three effective candidates.

This profile-only continuation appends one registry record and changes only the explicit workflow selector plus necessary profile/status/control records. Production, tests, fixtures, ownership, traceability, rules, role matrix, topology, group membership, patterns, commands, dependencies, timeouts, thresholds, fork count, collectors, diagnostics, and merge algorithms remain unchanged.

RR1 profile validation is `3 / 3 COVERAGE_APPROVED_PROFILE_MATCH`; the three validation artifacts are byte-identical at SHA-256 `71ffa980708d27f07d38cab1b7a466f5bfbf3625901207e1fb063e7e1b1dbce8`. Typecheck, full lint, ownership self-test `22 / 22`, full ordinary `35 files / 1,544 tests`, full coverage `35 files / 1,544 tests`, JSON, YAML, script syntax, diff, and exact eight-file scope checks pass.
