# Vitest Coverage Single-Fork V1

## Metadata

- authorization: `USER_AUTHORIZED_COVERAGE_UNCOVERED_OBLIGATION_SEMANTIC_AUDIT_AND_SINGLE_FORK_V1`
- classification: `CI_TEST_INFRASTRUCTURE_FAILURE`
- solution: `SINGLE_FORK_COVERAGE_EXECUTION`
- coverageSemanticGate: `UNCOVERED_SOURCE_OBLIGATION_EQUALITY`
- rawBranchTopologyIsPublicContract: `false`
- productBehaviorChanged: `false`
- ruleSemanticsChanged: `false`
- testsChanged: `false`
- timeoutsChanged: `false`
- coverageThresholdChanged: `false`
- dependencyChanged: `false`
- vitestWorkspaceChanged: `false`
- taskType: `CI_TEST_INFRASTRUCTURE`
- productRepairRoundConsumed: `false`
- currentSlice: `null`
- slice2B19A1Started: `false`
- phase2CStarted: `false`
- branch: `infra/vitest-coverage-single-fork-v1`
- baseHead: `2c15ca96bb7a1ee500ebd1d8707504e57a9719f6`
- repositoryVisibility: `PUBLIC`
- maxInfrastructureRepairRounds: `1`

## Failure history and isolation

Governance closeout run `29413647893` remains historical failure evidence. Its coverage execution exhibited random per-test `5000ms` failures and Vitest worker `onTaskUpdate` RPC timeouts. PR #31 applied a per-test timeout to one repeated long test, but a different test later timed out and the worker RPC failure remained. PR #31 was closed without merge; its remote branch remains historical evidence. No timeout from that branch is present here.

The subsequent process-sharding experiment was never committed. Its repository patch was archived outside the repository and its worktree changes were removed before this task. That experiment is not part of this change.

Two prior local `VITEST_MAX_FORKS=1` coverage runs completed all `33` project-file executions and all `1418/1418` tests without a test timeout, `onTaskUpdate` timeout, assertion failure, or coverage-threshold failure. This task first audits their exact uncovered source obligations before changing the workflow.

## Runtime and upstream boundary

- Declared package range: `vitest ^3.2.4`.
- Declared package range: `@vitest/coverage-v8 ^3.2.4`.
- Lock-installed runtime: Vitest `3.2.6` on Node `24.15.0`.
- Upstream issue reviewed: <https://github.com/vitest-dev/vitest/issues/10581>.
- Upstream fix PR reviewed: <https://github.com/vitest-dev/vitest/pull/10643>.
- Referenced upstream commit: `c4090147918c53835860ece57a04c8c0c1456458`.

The upstream material describes a possible class of V8 remapping nondeterminism involving unevaluated modules and wrapper offsets. This document does not attribute every repository observation to that issue. It does not authorize a dependency upgrade, a patch backport, or a coverage-provider migration.

## Semantic audit inputs

All four JSON files were generated from the same repository HEAD and each corresponding log records `1418/1418` passing tests.

| Input | Absolute path | SHA-256 | Bytes | Fork setting | Branch covered/total | Branch uncovered |
|---|---|---|---:|---|---:|---:|
| Accepted baseline | `C:\Users\wjl\AppData\Local\BOTCVitestCoverageShardingV1\baseline-coverage-final.json` | `dc309235e4bc4cfde688ecd11c6fee1afbd6ccc5fae79cbc44c2cc3c4eb54a6f` | 4,001,388 | default/unset | 7635/9342 | 1707 |
| Original local | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\single-fork-v1\original-coverage-final.json` | `29222de51c7361dbabae3f7c62fb296a85b16da41be4b72f8ee03f9e4ae9b121` | 4,001,588 | default/unset | 7636/9343 | 1707 |
| Single-fork run 1 | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\single-fork-v1\single-fork-run-1-coverage-final.json` | `30c1a90451fd86fd8b1ff3e3ce1ecce5377ab66465110ff79b996b289c2461f4` | 4,000,984 | `VITEST_MAX_FORKS=1` | 7633/9340 | 1707 |
| Single-fork run 2 | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\single-fork-v1\single-fork-run-2-coverage-final.json` | `f44ba694417faec2c6854fc3951d3011a8abf564b6195e22250f18f2bca8c88e` | 4,000,788 | `VITEST_MAX_FORKS=1` | 7632/9339 | 1707 |

External audit artifacts:

- Complete report: `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\coverage-semantic-obligation-audit.md`.
- Report SHA-256: `cc801f07a677e2604c9a1753dd28715cd1c9a0ef81f2b294590e41bf995e53ea`.
- Comparison script: `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\compare-coverage-obligations.mjs`.
- Script SHA-256: `1ba9035aea562cc072d94396793621999cef18ac1c3fdf6baa534bf631bc5afa`.
- Audit result: `COVERAGE_SEMANTIC_OBLIGATIONS_EQUAL`.
- Raw-difference classification: `V8_COVERED_BRANCH_TOPOLOGY_NONDETERMINISM`.

No external coverage JSON, log, comparison script, or complete external report is committed to Git.

## Frozen uncovered-obligation model

Coverage correctness for these `@vitest/coverage-v8` representations is determined by:

- the complete `1418`-test inventory;
- the complete `59`-source-file inventory;
- the exact canonical set of uncovered statement source locations;
- the exact canonical set of uncovered function names, declarations, and source locations;
- the exact canonical set of uncovered lines derived from statement coverage;
- the exact canonical set of uncovered branch-arm source locations;
- no assertion failure; and
- no threshold regression.

It is not determined by numeric branch IDs, covered-branch item count, covered-branch split/merge topology, positive hit-count magnitude, or JSON key order. Those are internal provider representations and are never used to erase a real zero-hit source obligation.

The four audited maps contain exactly the same source files and the same canonical uncovered sets:

| Canonical obligation | Count in every map | Baseline-to-each-input added | Baseline-to-each-input removed |
|---|---:|---:|---:|
| Statements | 3108 | 0 | 0 |
| Functions | 22 | 0 | 0 |
| Lines | 3108 | 0 | 0 |
| Branch arms | 1707 | 0 | 0 |

All six pairwise raw branch comparisons found zero changed zero-hit obligations. Raw differences were limited to already-covered arm split/merge, numeric branch-ID representation, and positive hit magnitude. Therefore this is not a coverage relaxation: no uncovered obligation is added, removed, ignored, hidden, or reclassified as covered; thresholds and test inventory are unchanged.

## Exact workflow change

The Ubuntu `Coverage` step keeps the command `pnpm test:coverage` and adds only:

```yaml
env:
  VITEST_MAX_FORKS: "1"
```

The ordinary test step, job topology, permissions, Node and pnpm setup, cache behavior, timeouts, Windows deterministic job, `continue-on-error`, Vitest workspace, package metadata, lockfile, coverage thresholds, production code, and tests are unchanged.

## Rationale

Coverage is the only suite that receives the single-fork cap. The earlier repeated single-fork executions completed the full test inventory without the random per-test and worker-RPC timeout symptoms. Serializing coverage workers is a bounded CI-runner stabilization measure; it neither changes product behavior nor grants authority to omit or weaken coverage obligations.

## Local final validation

All required local gates passed on this branch before its single commit:

- `pnpm typecheck`: PASS.
- `pnpm lint`: PASS.
- `pnpm test`: PASS, `33/33` project-file executions and `1418/1418` tests.
- Fresh single-fork coverage run 1: PASS, `33/33` and `1418/1418`, duration `113.97s`, no test timeout, `onTaskUpdate` timeout, assertion failure, or threshold failure.
- Fresh single-fork coverage run 2: PASS, `33/33` and `1418/1418`, duration `111.66s`, no test timeout, `onTaskUpdate` timeout, assertion failure, or threshold failure.
- `git diff --check`: PASS.

The two fresh maps and their exact-obligation audit are stored outside the repository:

| Artifact | SHA-256 | Bytes | Branch covered/total | Uncovered branch arms |
|---|---|---:|---:|---:|
| `single-fork-final-run-1-coverage-final.json` | `184dbfa2d7a67f3e925382384d5e2be64cd34b3ebc79006f76967e0296147bce` | 4,000,992 | 7633/9340 | 1707 |
| `single-fork-final-run-2-coverage-final.json` | `30c1a90451fd86fd8b1ff3e3ce1ecce5377ab66465110ff79b996b289c2461f4` | 4,000,984 | 7633/9340 | 1707 |
| `fresh-runs-semantic-audit-result.json` | `e4ff7571c657b12c379e465987a82a6eeb479bebb213b553e16a7a2631138a23` | 15,714,551 | n/a | n/a |

The fresh-run audit compared both maps with the accepted Stage A baseline. All three contain the same 59 source files and exact uncovered sets: 3108 statements, 22 functions, 3108 lines, and 1707 branch arms. Every baseline-to-fresh comparison has zero added and zero removed obligations; all three pairwise raw comparisons have zero affected zero-hit arms. Its verdict is `COVERAGE_SEMANTIC_OBLIGATIONS_EQUAL` with raw classification `V8_COVERED_BRANCH_TOPOLOGY_NONDETERMINISM`.

## Explicitly out of scope

- dependency patch or backport;
- Vitest upgrade;
- Istanbul migration or another coverage provider;
- product, rule, role, projection, replay, or test behavior;
- test or global timeout changes;
- coverage-threshold changes;
- `vitest.workspace.ts`, package, or lockfile changes;
- 2B19A1, 2B19A2, 2B19A3, 2B19B, Dreamer V2, or Phase 2C implementation.
