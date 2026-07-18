# Vitest Coverage Process Isolation V2

## Metadata

- authorization: `USER_AUTHORIZED_VITEST_COVERAGE_PROCESS_ISOLATION_V2_FOR_PR36`
- classification: `CI_TEST_INFRASTRUCTURE_FAILURE`
- solution: `SEPARATE_PROCESS_COVERAGE_GROUPS_WITH_OFFICIAL_BLOB_MERGE`
- coverageSemanticGate: `UNCOVERED_SOURCE_OBLIGATION_EQUALITY`
- productBehaviorChanged: `false`
- ruleSemanticsChanged: `false`
- testsChanged: `false`
- timeoutsChanged: `false`
- coverageThresholdChanged: `false`
- dependencyChanged: `false`
- taskType: `CI_TEST_INFRASTRUCTURE`
- productRepairRoundConsumed: `false`
- infrastructureBranch: `infra/vitest-coverage-process-isolation-v2`
- baseHead: `9c4d009f32d4d24d0e072168717f34795b3c322c`
- frozenProductPR: `36`
- frozenProductBranch: `phase-3/dreamer-vortox-effective-source`
- frozenProductHead: `035f0377bce97b8416f74f658bd6e1f8adbbac1a`
- productBranchChanged: `false`
- productSliceStatus: `PAUSED_PENDING_INFRASTRUCTURE_PR`
- roleCoverageStatusChanged: `false`

## Frozen product evidence

PR #36 and product HEAD `035f0377bce97b8416f74f658bd6e1f8adbbac1a` are frozen. This infrastructure branch was created from accepted `main` HEAD `9c4d009f32d4d24d0e072168717f34795b3c322c`; it does not contain or modify the product branch.

The same frozen product HEAD produced two relevant CI records:

| Run | Event / attempt | Result | Evidence |
|---|---|---|---|
| [29575008833](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29575008833) | `push`, attempt 3 | `SUCCESS` | Ubuntu `validate` and Windows deterministic job both passed. |
| [29575011026](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29575011026) | `pull_request`, attempt 2 | `FAILURE` | Windows passed. Ubuntu coverage completed all `34` project-file executions and `1512/1512` assertions and emitted its coverage report, then Vitest reported `[vitest-worker]: Timeout calling "onTaskUpdate"`; the step exited 1. |

This is a coverage-process reliability failure after successful assertions, not evidence of a product assertion failure. The accepted single-fork setting remains useful inside a bounded process, but one process still accumulates the full suite's coverage workload and can fail during worker-to-parent finalization. V2 therefore bounds each coverage process independently and merges only completed artifacts.

The archived V1 process-sharding experiment was available and was reviewed read-only:

| External evidence | SHA-256 | Bytes |
|---|---|---:|
| `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\vitest-coverage-process-sharding-v1.patch` | `ba155f6b6586323059de081e8da52c0657a4f1450749093bbe749f595de954f6` | 28,702 |
| `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\vitest-coverage-process-sharding-v1-report.md` | `04d453c50e7f655a86c34a65adbe763e18b4ec7f296f52174f0f8a08c1d23aa9` | 1,526 |
| `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\coverage-semantic-obligation-audit.md` | `cc801f07a677e2604c9a1753dd28715cd1c9a0ef81f2b294590e41bf995e53ea` | 16,908 |
| `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-experiments\coverage-semantic-obligation-audit-result.json` | `88153bdc1f100f27dad66d9c3c3ac14ab173ce6eee3dc1fad7b699e5118b0cd2` | 10,823,560 |

That experiment was a six-group, 1418-test design with group counts `199 / 321 / 454 / 142 / 70 / 232`. It was not blindly applied. V2 uses eight groups derived from the current dynamic workspace, independently separates the large rebuild file and the four shared application-service projects, and revalidates the complete branch-arm tuple from current accepted main and frozen PR #36 baselines. No archived patch content or old acceptance conclusion is treated as current authority.

## Exact process groups

Coverage runs in eight independent Ubuntu matrix jobs. Every job sets `VITEST_MAX_FORKS=1`, invokes the lock-installed Vitest CLI with `--coverage`, writes one unique blob report, and uploads one unique artifact.

| Group | Workspace projects | Accepted-main tests | Frozen-PR tests |
|---|---|---:|---:|
| `domain-core-rebuild` | `domain-core-rebuild` | 204 | 206 |
| `domain-core-rest` | `domain-core` | 329 | 344 |
| `application` | `application` | 454 | 456 |
| `application-service-core` | `application-service-core` | 90 | 98 |
| `application-service-role-actions` | `application-service-role-actions` | 52 | 60 |
| `application-service-information-and-later-actions` | `application-service-information-and-later-actions` | 75 | 83 |
| `application-service-compatibility-and-failure-boundaries` | `application-service-compatibility-and-failure-boundaries` | 20 | 28 |
| `engines-and-projections` | `assignment-engine`, `information-engine`, `projections`, `rules-snv`, `setup-engine`, `task-engine`, `test-harness` | 233 | 237 |
| **Total** | **14 projects** | **1457** | **1512** |

`vitest.workspace.ts` adds the narrow `domain-core-rebuild` project for `packages/domain-core/src/rebuild.test.ts` and excludes that file from the existing `domain-core` project. All other workspace projects and includes are unchanged.

## Dynamic inventory authority

`scripts/verify-vitest-coverage-groups.mjs` obtains the complete and per-group inventories from the lock-installed Vitest `list --json` command. Its canonical test identity is workspace project, normalized file path, ancestor title path, and test title. It rejects missing, duplicate, unexpected, failed, or ambiguous identities.

| Validation target | Physical distinct test paths | Project-file executions | Tests | Missing | Duplicate | Unexpected | Ambiguous | Inventory SHA-256 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Accepted main plus infrastructure diff | 31 | 34 | 1457 | 0 | 0 | 0 | 0 | `f70f2348863d7d385e5db53e7bc35449121bb47b4f0cac8cecaa6f833305d78b` |
| Frozen PR #36 plus infrastructure diff | 31 | 34 | 1512 | 0 | 0 | 0 | 0 | `9e2de598f30d164509155bb342eb760506cc6b358993d3f24c54ab6c58e932c8` |

The earlier expected value of 34 physical files was not confirmed by dynamic inventory. There are 31 distinct test paths and 34 project-file executions: the shared application-service test path executes in four workspace projects. Vitest's console `Test Files 34` count is therefore a project-file execution count. The dynamic inventory is authoritative and no test is omitted.

## Merge and verification contract

The `coverage-merge` job runs only after all eight shard jobs succeed. It:

1. downloads the eight artifacts and rejects anything other than exactly eight blob files;
2. uses Vitest's official `--merge-reports` command once per group to produce independently attributable group JSON test reports;
3. uses the same official command over all eight blobs to produce the global JSON test report and merged V8 coverage map;
4. runs the dynamic inventory verifier against the global and eight per-group reports; and
5. requires the global and every group report to have all suites and assertions exactly `passed`, `numPassedTests === numTotalTests`, and zero failed, pending, todo, or pending/failed suite counts; and
6. requires the merged coverage map to match exactly one approved coverage profile by both count and SHA-256 for all five obligation groups.

Per-group merged reports are required because Vitest 3.2.6's global merged JSON does not preserve `projectName`. Thirty-two frozen-PR tests have the same file-and-title identity across application-service projects; the independent group reports disambiguate those legitimate executions without weakening identity checks.

The explicit coverage include is exactly `packages/*/src/**/*.ts`. It covers the same nine production-source packages as the pre-change workspace coverage universe and excludes the newly introduced repository audit scripts. It does not exclude any workspace product source, change any threshold, or classify an uncovered product obligation as covered.

`--validate-candidate` is a strict CI profile gate, not a shape-only check. A candidate exits successfully only when all five exact count-and-hash pairs match exactly one approved profile. The optional `--profile` argument additionally requires that unique match to be the named topology profile. A candidate that matches neither, matches more than one, or does not match the explicitly requested profile exits nonzero and reports every per-profile group comparison. Future legitimate product or test changes require separately approved evidence and an explicit new profile; CI must not infer or learn a profile from the candidate it is validating.

## Semantic coverage audit

`scripts/verify-coverage-obligations.mjs` compares source-level obligations, not unstable raw V8 identifiers. The frozen sets are: source files; zero-hit statement locations; zero-hit function name/declaration/location identities; zero-hit lines; and zero-hit branch arms. A branch-arm identity is the complete stable tuple `file + branch type + branch source location + arm index + arm source location`. Numeric branch IDs are excluded. Duplicate complete tuples fail closed instead of being silently collapsed. Positive hit magnitude, covered-arm split/merge topology, and JSON order are not public coverage contracts.

## Approved CI profiles

| Profile | Source HEAD | Source files | Zero-hit statements | Zero-hit functions | Zero-hit lines | Zero-hit branch arms |
|---|---|---|---|---|---|---|
| `accepted-main-9c4d009-single-process-v1` | `9c4d009f32d4d24d0e072168717f34795b3c322c` | `61` / `b8076fca1bce06a811d10d189d3bf89f6caefe5fb81de270d1e91dabc1565920` | `3157` / `057ceb478f9359c70c6d654d615369e0225b1d440fc2ebb8626098df46a4bcda` | `23` / `0566362f681edfe7d13ccea297fe63b53f92de0a7a7b223d4224459d96c783a6` | `3157` / `4cbb5823a6b2261c4b014d1e959cbf57b810a47903d08ffd16d6a3c4d5d78ab1` | `1759` / `5169dda9f7bf457fe4676e23d6c1650d8de24adc3fe7d2958145d966532435bb` |
| `frozen-pr36-035f037-single-process-v1` | `035f0377bce97b8416f74f658bd6e1f8adbbac1a` | `63` / `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` | `3176` / `ff94c61bd3a98324ec5202244bee5f9e7589f779dce02405bc8ea1bd255b3355` | `23` / `0d16a1e243523c4dbd2f9408acffffec7c77d3043ed09187da80f22085f262dd` | `3176` / `c20b9dc8624c3320cbd28212e4bba1a6af4b8b682408cf64995cd97a7595c1e2` | `1778` / `cb2a134aa8ee0158cc3cea596edaade621a148e67a949f71bf0a6cdf01eba93f` |
| `frozen-pr36-035f037-ownership-v2-1` | `035f0377bce97b8416f74f658bd6e1f8adbbac1a` | `63` / `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` | `3176` / `ff94c61bd3a98324ec5202244bee5f9e7589f779dce02405bc8ea1bd255b3355` | `23` / `0d16a1e243523c4dbd2f9408acffffec7c77d3043ed09187da80f22085f262dd` | `3176` / `c20b9dc8624c3320cbd28212e4bba1a6af4b8b682408cf64995cd97a7595c1e2` | `1777` / `86729bdd6cab5519cbeab5f3e270955237f9832199f8d8bf5ae95fd38114b8f7` |

The third profile is restricted to the nine-process, unique `application-service-dreamer-vortox` ownership topology. Its structured metadata records the superseded topology, the reason for supersession, and the externally audited canonical tuple that changed from hit 0 to hit 396. The old single-process profiles remain unchanged. Full evidence is in `docs/implementation/pr36-test-ownership-and-process-isolation-v2-1.md`.

### Accepted main base

| Artifact | Absolute path | SHA-256 | Bytes |
|---|---|---|---:|
| Single-process baseline | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-process-isolation-v2\main\baseline-run-2\coverage\coverage-final.json` | `4b609f265672771017adf8cc1cbdae47454d9283ef681e6b7bec5af79d5a622c` | 4,207,744 |
| Eight-process candidate | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-process-isolation-v2\main\candidate-run-2\merged-coverage\coverage-final.json` | `0b4ae8744eed8aa783515fb73c4bcc9ef4af6e1e750c90f193a0662e30853924` | 4,207,130 |
| Candidate inventory audit | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-process-isolation-v2\main\candidate-run-2\inventory-audit.json` | `4ec92195557b96356ea6e2ee0efd46a3294f60cf8d579cc866d3ec74d63f7c28` | 3,344 |

Result: `COVERAGE_SEMANTIC_OBLIGATIONS_EQUAL`. Both maps contain 61 source files, 3157 uncovered statements, 23 uncovered functions, 3157 uncovered lines, and 1759 uncovered branch arms. Every candidate-to-baseline set has zero additions and zero removals.

| Obligation set | SHA-256 in both maps |
|---|---|
| Source files | `b8076fca1bce06a811d10d189d3bf89f6caefe5fb81de270d1e91dabc1565920` |
| Uncovered statements | `057ceb478f9359c70c6d654d615369e0225b1d440fc2ebb8626098df46a4bcda` |
| Uncovered functions | `0566362f681edfe7d13ccea297fe63b53f92de0a7a7b223d4224459d96c783a6` |
| Uncovered lines | `4cbb5823a6b2261c4b014d1e959cbf57b810a47903d08ffd16d6a3c4d5d78ab1` |
| Uncovered branch arms | `5169dda9f7bf457fe4676e23d6c1650d8de24adc3fe7d2958145d966532435bb` |

The single-process baseline passed `1457/1457` tests in `125.2s`; the eight coverage processes passed the same inventory in an aggregate `133.3s`. Neither run reported a test timeout, worker RPC timeout, assertion failure, or threshold failure. The merged summary was 87.23% statements/lines, 82.12% branches, and 97.76% functions.

### Frozen PR #36 integration

| Artifact | Absolute path | SHA-256 | Bytes |
|---|---|---|---:|
| Single-process baseline | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-process-isolation-v2\pr36\baseline\coverage\coverage-final.json` | `e9fdffca5a34bce1f89e5d3ab1b7d9d7159d21b4a147588ab08ba756359adf26` | 4,324,249 |
| Eight-process candidate | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-process-isolation-v2\pr36\candidate\merged-coverage\coverage-final.json` | `ff48d99e0a03851af68dc5d29ea94cd6e89feddd27ef6f53cda4e566ec23151f` | 4,324,666 |
| Candidate inventory audit | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\coverage-process-isolation-v2\pr36\candidate\inventory-audit.json` | `3b9a20284b3f3fbaf114e0e9ec5759ee74f4cd80c39de9d87f16669d810f47f9` | 3,344 |

Result: `COVERAGE_SEMANTIC_OBLIGATIONS_EQUAL`. Both maps contain 63 source files, 3176 uncovered statements, 23 uncovered functions, 3176 uncovered lines, and 1778 uncovered branch arms. Every candidate-to-baseline set has zero additions and zero removals.

| Obligation set | SHA-256 in both maps |
|---|---|
| Source files | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| Uncovered statements | `ff94c61bd3a98324ec5202244bee5f9e7589f779dce02405bc8ea1bd255b3355` |
| Uncovered functions | `0d16a1e243523c4dbd2f9408acffffec7c77d3043ed09187da80f22085f262dd` |
| Uncovered lines | `c20b9dc8624c3320cbd28212e4bba1a6af4b8b682408cf64995cd97a7595c1e2` |
| Uncovered branch arms | `cb2a134aa8ee0158cc3cea596edaade621a148e67a949f71bf0a6cdf01eba93f` |

The single-process baseline passed `1512/1512` tests in `153.2s`; the eight coverage processes passed the same inventory in an aggregate `158.5s`. Neither run reported a test timeout, worker RPC timeout, assertion failure, or threshold failure. The merged summary was 87.44% statements/lines, 82.43% branches, and 97.81% functions.

## Local validation

Validation used Corepack pnpm `11.7.0`, Node `24.15.0`, and lock-installed Vitest `3.2.6`.

- `pnpm typecheck`: PASS.
- `pnpm lint`: PASS.
- `pnpm test`: PASS on accepted main plus the infrastructure diff, `34/34` project-file executions and `1457/1457` tests.
- accepted-main single-process coverage baseline: PASS.
- accepted-main eight-process coverage candidate and merge: PASS.
- frozen-PR single-process coverage baseline: PASS.
- frozen-PR eight-process coverage candidate and merge: PASS.
- dynamic inventory union/intersection audit on accepted main and frozen PR: PASS.
- semantic uncovered-obligation equality on accepted main and frozen PR: PASS.
- strict approved-profile gate: accepted-main candidate matched only `accepted-main-9c4d009-single-process-v1`; frozen-PR candidate matched only `frozen-pr36-035f037-single-process-v1`.
- synthetic branch-arm tuple audit outside the repository: same arm location with a changed branch type, branch source location, or arm index produced distinct obligation identities and a nonzero comparison result.
- synthetic merged-report reliability audit outside the repository: pending, todo, skipped, and unknown assertion/report states all failed closed.
- `git diff --check`: PASS.

The frozen-PR integration was performed in a detached temporary worktree at exact product HEAD plus the uncommitted infrastructure diff. It did not move or modify the product branch, and the temporary worktree was removed after validation. Audit artifacts remain outside Git at the absolute paths above.

## Scope boundaries

This change modifies only the CI workflow, Vitest workspace grouping, two repository-owned audit scripts, and this implementation record. It does not modify production code, test files, test expectations, timeouts, dependencies, lockfiles, coverage thresholds, rule evidence, rule semantics, role coverage, product events, replay, projections, or PR #36 product documentation.

The infrastructure branch still requires its own commit, push, pull request, exact-HEAD CI, and independent engineering review before merge. PR #36 remains frozen until that infrastructure lifecycle completes; this document does not claim CI or review results that have not occurred.
