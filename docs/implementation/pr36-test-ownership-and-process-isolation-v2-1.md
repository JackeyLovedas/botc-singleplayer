# PR #36 Test Ownership And Process Isolation V2.1

## Metadata

- authorization: `USER_AUTHORIZED_PR36_COVERAGE_OBLIGATION_MONOTONIC_AUDIT_AND_STACKED_INFRA_FINALIZATION`
- classification: `CI_TEST_INFRASTRUCTURE_FAILURE`
- repairRound: `2 / 2`
- rootCause: `CROSS_PROJECT_SEMANTIC_TEST_DUPLICATION_AND_FULL_WORKSPACE_PROCESS_PRESSURE`
- coverageDifference: `GENUINE_BRANCH_COVERAGE_IMPROVEMENT`
- productBehaviorChanged: `false`
- ruleSemanticsChanged: `false`
- testTitlesChanged: `false`
- testBodiesChanged: `false`
- assertionsChanged: `false`
- fixturesChanged: `false`
- timeoutsChanged: `false`
- dependenciesChanged: `false`
- coverageThresholdChanged: `false`
- productRepairRoundConsumed: `false`
- infrastructureBranch: `infra/pr36-dreamer-vortox-test-ownership-v2-1`
- infrastructureBase: `phase-3/dreamer-vortox-effective-source`
- baseHead: `301b8d4c74398b129a76eefddb345ad761e0bbc3`
- frozenProductSourceHead: `035f0377bce97b8416f74f658bd6e1f8adbbac1a`

## Failure and repair boundary

PR #36's ten `2B19A3A` application tests were registered across four shared `game-application-service.test.ts` projects. The old topology executed those ten semantic tests 34 times: 8 in `application-service-core`, 8 in `application-service-role-actions`, 10 in `application-service-information-and-later-actions`, and 8 in `application-service-compatibility-and-failure-boundaries`. This increased both ordinary-test process pressure and coverage worker finalization pressure without adding semantic authority.

V2.1 adds the dedicated `application-service-dreamer-vortox` project and routes all ten tests to that project. The resulting ownership is:

| Measure | Before | After |
|---|---:|---:|
| `2B19A3A` semantic tests | 10 | 10 |
| Project executions | 34 | 10 |
| Duplicate project executions | 24 | 0 |
| Owner projects | 4 | 1 |

The unique owner is `application-service-dreamer-vortox`. The four legacy application-service projects each own zero `2B19A3A` tests. The dynamic merged inventory remains 31 physical test files, 35 project-file executions, and 1488 semantic executions. Missing, duplicate, unexpected, and ambiguous identities are all zero.

## Test-semantic preservation

An external TypeScript AST audit compared the product-branch version of `packages/application/src/game-application-service.test.ts` with the V2.1 candidate. It found 201 application tests on each side and compared every test title, normalized body, and normalized assertion inventory after excluding registration ancestors:

- all 201 tests normalized SHA-256, both sides: `ef205b64fcfbf4d0f5d48a54385b5177d5c9ff445f4d86db101b2c6a9a018e05`;
- ten `2B19A3A` tests normalized SHA-256, both sides: `76a0e874aeb73e036f45ee054475485747fc3b8adf5dd0aa4fb50934c46ecc37`;
- audit verdict: `TEST_REGISTRATION_ROUTING_ONLY`;
- registration ancestors changed; test titles, bodies, assertions, and helper/fixture use inside those bodies did not.

No fixture path, production path, timeout configuration, dependency declaration, lockfile, rule evidence, design, or product traceability contract is changed. Git reports no production diff. For the affected production source, the product HEAD blob and the working-tree clean-filtered blob are both `c38b5380d876b35df10a7f6250e1a4217233b07d`; the LF-normalized SHA-256 is `81ead6589e120bfff31836352ad38330948bf3f87ff506db2a09b9e4ded1bc1e` on both sides.

## Removed branch-arm audit

The old frozen PR #36 single-process map and the accepted saved old eight-process/four-owner map both contain this uncovered canonical tuple:

```text
packages/domain-core/src/first-night-ability-outcome-ledger.ts|type:"branch"|branch:473:476-473:531|arm:0|location:473:476-473:531
```

The tuple is in production domain logic in `first-night-ability-outcome-ledger.ts`. It is the branch that evaluates whether an ended character-state revision is absent or later than the requested revision while selecting the relevant historical record. It is not test harness, routing support, or application infrastructure.

The audit reuses the exact canonical identity from `scripts/verify-coverage-obligations.mjs`: repository-relative file, branch type, branch location, arm index, and arm location. Numeric V8 IDs are diagnostic only.

| Topology | Numeric branch ID | Hit count |
|---|---:|---:|
| Frozen/old four-owner topology | 300 | 0 |
| Unique `application-service-dreamer-vortox` topology | 495 | 396 |

The candidate retains the exact same file, type, branch location, arm index, and arm location. The source-file set, statement instrumentation locations, and function instrumentation locations are unchanged. No source file was excluded, and the audited tuple was not removed or remapped. Candidate zero-hit branch arms equal the frozen set minus exactly this tuple: added zero-hit obligations are 0 and removed zero-hit obligations are 1. The verdict is `GENUINE_BRANCH_COVERAGE_IMPROVEMENT`, not coverage relaxation or branch-topology disappearance.

Covered V8 branch ranges outside the audited tuple can split or merge across process layouts. They are diagnostic and are not used as substitutes for the exact zero-hit tuple. The exact tuple remains present and changes from 0 to a finite positive hit count.

## Three-run stability evidence

Three complete candidate coverage runs used Node `24.15.0`, Corepack pnpm `11.7.0`, Vitest `3.2.6`, nine independent shards with `VITEST_MAX_FORKS=1`, official blob merge, per-group reports, global inventory verification, and the exact canonical obligation audit.

| Run | Shards | Tests | Missing | Duplicate | Tuple hit | Timeout | `onTaskUpdate` | Raw merged coverage SHA-256 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 9/9 | 1488 | 0 | 0 | 396 | 0 | 0 | `ee3aaa04a8bae85807dbd1a2cffc7416c20468221ba5e58b94ae392e99c025f0` |
| 2 | 9/9 | 1488 | 0 | 0 | 396 | 0 | 0 | `b3b8b6735b868c8aa7050b6444b87215d8ab527b7321f0293c89713a34ea0587` |
| 3 | 9/9 | 1488 | 0 | 0 | 396 | 0 | 0 | `3c03a106f3141d067a0444eec2e8253fd00328b563d48eafd20798b37b99e88c` |

Raw `coverage-final.json` serialization can differ in V8 numeric IDs and order. The repository gate uses canonical sets. All three runs have these exact counts and hashes:

| Obligation set | Count | SHA-256 |
|---|---:|---|
| Source files | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| Zero-hit statements | 3176 | `ff94c61bd3a98324ec5202244bee5f9e7589f779dce02405bc8ea1bd255b3355` |
| Zero-hit functions | 23 | `0d16a1e243523c4dbd2f9408acffffec7c77d3043ed09187da80f22085f262dd` |
| Zero-hit lines | 3176 | `c20b9dc8624c3320cbd28212e4bba1a6af4b8b682408cf64995cd97a7595c1e2` |
| Zero-hit branch arms | 1777 | `86729bdd6cab5519cbeab5f3e270955237f9832199f8d8bf5ae95fd38114b8f7` |

The inventory audit SHA-256 is `2d78ce801da708e48d2b890ef6a1299091bc3e4fc8cdc61a6fabefaff6f82b29` in all three runs. The aggregate three-run evidence SHA-256 is `83f1e40f8c45ecbb48ec220ea387deec0e7660177f9f81e7b0aad4373b4abf93`.

## Exact profile and CI selection

The old profiles remain unchanged:

- `accepted-main-9c4d009-single-process-v1`;
- `frozen-pr36-035f037-single-process-v1`.

V2.1 adds the exact profile `frozen-pr36-035f037-ownership-v2-1` with:

- `sourceHead`: `035f0377bce97b8416f74f658bd6e1f8adbbac1a`;
- `sourceKind`: `PROCESS_ISOLATED_UNIQUE_TEST_OWNERSHIP_BASELINE`;
- `supersedesForTopology`: `frozen-pr36-035f037-single-process-v1`;
- `supersessionReason`: `UNIQUE_APPLICATION_TEST_OWNERSHIP_AND_GENUINE_BRANCH_COVERAGE_IMPROVEMENT`;
- the five exact obligation count/hash pairs above;
- `removedObligationAudit` containing the exact tuple, baseline hit 0, candidate hit 396, and external strict-audit SHA-256 `43388d69dd4253ae9880912dd0432cb2ef0fe9860ed243776fbf0a38897c68b7`.

The validation script checks these metadata fields as data, not comments. The nine-process CI command explicitly requests `frozen-pr36-035f037-ownership-v2-1`; it fails if another profile matches, the requested profile does not match, or any count/hash differs. There is no subset, less-than-or-equal, or learned-candidate rule.

## External evidence

All experimental artifacts are outside the repository under:

```text
C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\pr36-ownership-v2-1
```

| Artifact | SHA-256 |
|---|---|
| Original four-path experiment patch | `873ab4bce18d5d99142b6613c9bdd7a9e9875cabf1c85b916eadf939b042ab7a` |
| Frozen baseline `coverage-final.json` | `e9fdffca5a34bce1f89e5d3ab1b7d9d7159d21b4a147588ab08ba756359adf26` |
| Initial unique-owner candidate `coverage-final.json` | `b3b8b6735b868c8aa7050b6444b87215d8ab527b7321f0293c89713a34ea0587` |
| Strict removed-tuple audit | `43388d69dd4253ae9880912dd0432cb2ef0fe9860ed243776fbf0a38897c68b7` |
| Old four-owner versus unique-owner audit | `495c484f32e969521db0063a11dae8ea48d4f9534f803dd2494240af044e8be0` |
| Test registration AST audit | `f735cd9ca5cd49d7eb3dd553358e042f24feb5da3f621ad95bdb92c4039bea2e` |
| Ownership/coverage causality record | `05036ba38f6a1675325111aaf00074d274865ff328ce7056ea196a9282e66ce8` |
| Three-run aggregate stability record | `83f1e40f8c45ecbb48ec220ea387deec0e7660177f9f81e7b0aad4373b4abf93` |

These files are evidence only and are not committed.

## Final local validation

- final ordinary nine-shard run and official merge: `FINAL_ORDINARY_NINE_SHARD_PASS`, 1488/1488, zero failed/missing/duplicate/unexpected/timeout/`onTaskUpdate`;
- final ordinary summary SHA-256: `d48498baaec6ae5fa3be514b63b73af13729a847ffc44676b1d2a299990395eb`;
- exact requested coverage profile: `COVERAGE_APPROVED_PROFILE_MATCH` for `frozen-pr36-035f037-ownership-v2-1`;
- old frozen profile preservation checks: PASS for the frozen single-process and old four-owner maps;
- wrong-topology explicit profile request: rejected with `COVERAGE_REQUESTED_PROFILE_MISMATCH`;
- `corepack pnpm@11.7.0 typecheck`: PASS;
- `corepack pnpm@11.7.0 lint`: PASS with zero warnings;
- `git diff --check`: PASS.

## Explicit out of scope

- no product or BOTC rule change;
- no Vortox or Dreamer behavior repair;
- no test title, test body, assertion, helper/fixture behavior, or timeout change;
- no dependency, lockfile, coverage threshold, or general coverage-gate relaxation;
- no rule evidence, design round, product traceability contract, role-coverage status, or release-review change;
- no product repair round 3 and no infrastructure repair round 3.

This infrastructure branch still requires its own stacked PR CI on the exact committed HEAD and a complete independent read-only review before merge. This document does not claim those future results.
