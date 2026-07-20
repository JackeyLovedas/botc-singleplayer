# PR #41 Dreamer-Vortox Coverage Failure Observability V1

## Control

- Authorization: `USER_AUTHORIZED_PR41_COVERAGE_FAILURE_OBSERVABILITY_AND_CONDITIONAL_PROCESS_SPLIT`
- Classification amendment authorization: `USER_AUTHORIZED_PR41_COMPLETE_PASSING_BLOB_CLASSIFICATION_AND_COVERAGE_SPLIT_ROUND_2`
- Current corrected classification: `POST_TEST_WORKER_RPC_FAILURE_WITH_COMPLETE_PASSING_BLOB`
- Historical Round 1 classification before direct-blob correction: `CI_TEST_INFRASTRUCTURE_FAILURE`
- Infrastructure repair: `2 / 2`
- Product repair: `2 / 2` exhausted and unchanged
- Base branch: `phase-3/philosopher-gained-dreamer-effective-source`
- Base and frozen product HEAD: `6e7b0d752750bc00f64309ed5e4f59c39b93255e`
- Infrastructure branch: `infra/pr41-dreamer-vortox-coverage-observability-v1`
- Round 1 infrastructure HEAD: `ee2f1aae24e7698250c5abf04268c7fd9410854f`
- Stacked PR: [#42](https://github.com/JackeyLovedas/botc-singleplayer/pull/42)
- Product PR: [#41](https://github.com/JackeyLovedas/botc-singleplayer/pull/41), frozen
- Product behavior changed: `false`
- BOTC rule semantics changed: `false`
- Tests or fixtures changed: `false`
- Role coverage changed: `false`
- Coverage process split authorized: `true`, only for the Round 2 contract below

The two old exact-head runs retained only a generic process exit after the Dreamer-Vortox blob was reported. Their old artifacts are unavailable, so they cannot establish that either blob is complete or that all tests represented by it pass. Round 1 therefore adds observability only and makes no failure classification that would authorize Round 2.

That statement remains the accurate Round 1 publication-time boundary. The later exact Round 1 diagnostic artifacts and the user-authorized classification amendment below now supply separate authority for Infrastructure Repair Round 2 without rewriting the original evidence history.

## Classification Amendment Authorized By User

```text
authorization =
USER_AUTHORIZED_PR41_COMPLETE_PASSING_BLOB_CLASSIFICATION_AND_COVERAGE_SPLIT_ROUND_2

previousVerdict =
CLASSIFICATION_HUMAN_BLOCKED

correctedVerdict =
POST_TEST_WORKER_RPC_FAILURE_WITH_COMPLETE_PASSING_BLOB

productFailure =
false

specificTestTimeout =
false

coverageProfileFailure =
false

round2Authorized =
true

productRepairRoundConsumed =
false
```

This correction applies only to the two exact diagnostic blobs captured from Infrastructure Round 1:

- push run `29712319880`, artifact `8449211759`, blob SHA-256 `be454c9449af2b69bed4cb22b7b5a4b68a2e323e6b24cb0bcac7c0f3ac717f2c`;
- pull-request run `29712346934`, artifact `8449223031`, blob SHA-256 `07dbfda0e17b95af0bc1723a41a78f7363d3a61688f7b4f7c5a3ff94e930a2e6`.

Vitest 3.2.6's own blob parser reports, for each byte-count/SHA-verified blob, one passed test file, five passed suites, `26 / 26` passed tests, zero failed tests, zero pending tests, and exactly one unhandled error: `[vitest-worker]: Timeout calling "onTaskUpdate"`. The saved logs contain no assertion or expected/actual failure, specific test timeout, product `DomainError`, OOM, signal, coverage-threshold failure, coverage-profile mismatch, or ownership mismatch.

The single-blob merge failure remains historical evidence, but is no longer treated as proof that the blob lacks passing tests. Reprocessing an unhandled error makes the required single-blob merge exit `1` and emit a zero-test JSON report; that derived report does not override the original test results directly present in the verified blob. This amendment does not claim a known upstream Vitest bug, OOM, signal, defect in `merge-reports`, or permission to ignore any present or future unhandled error.

## Round 2 Coverage Process Split

Infrastructure Round `2 / 2` changes only coverage-process execution. The nine ordinary groups remain byte-semantically unchanged. Coverage uses ten independent main processes by replacing only `application-service-dreamer-vortox` with:

| Coverage group | Existing Vitest project | Exact `testNamePattern` | Dynamic tests |
| --- | --- | --- | --- |
| `application-service-dreamer-vortox-core` | `application-service-dreamer-vortox` | `\[(?:2B19A3A\|2B19A3B1)-` | `16` |
| `application-service-dreamer-vortox-gained` | `application-service-dreamer-vortox` | `\[2B19B-` | `10` |

The table escapes the regex alternation only for Markdown rendering; the runtime pattern is `\[(?:2B19A3A|2B19A3B1)-`. Current Vitest 3.2.6 help identifies `--testNamePattern <pattern>` as the supported option. Lock-installed real `vitest list` executions prove full=`26`, core=`16`, gained=`10`, union=`26`, intersection=`0`, missing=`0`, duplicate=`0`, and unexpected=`0`. Core contains all and only `[2B19A3A-` plus `[2B19A3B1-` tests; gained contains all and only `[2B19B-` tests. Test titles, bodies, assertions, fixtures, projects, and ownership contracts are unchanged.

The coverage step constructs its CLI through a Bash array. It reads the hard-coded matrix project text into an array, appends each quoted project argument, and appends one quoted `--testNamePattern=<pattern>` only when the explicit matrix pattern is non-empty. It uses no `eval` or unquoted expansion. The Windows `pnpm.cmd` interpretation of a raw regex alternation is only a local orchestration trap discovered before implementation; direct invocation of the same lock-installed Vitest 3.2.6 CLI proves the exact regex behavior. The Ubuntu workflow receives the regex through a quoted environment value and Bash array.

Round 1 diagnostics remain fail-closed for all ten coverage groups. Each row has an explicit `group`, `projects`, and `testNamePattern`; the manifest records all three execution inputs. Each group retains an independent diagnostic artifact, formal success-only blob, exact checksum, original-step outcome, and final enforcement step. No unhandled error is ignored, no nonzero exit is rewritten, and no retry, timeout, worker, pool, dependency, coverage threshold, coverage subset, or approved profile changes in this source commit.

The coverage verifier now models three distinct identities:

1. ordinary project execution: project, file, ancestor path, and title;
2. coverage execution: group, project, exact filter, file, ancestor path, and title;
3. semantic test: file, ancestor path, and title, bound back to its unchanged ordinary owner project.

It requires the nine-group ordinary project union and ten-group coverage semantic union both to equal the full `1,520`-test workspace inventory exactly. It fails on missing, duplicate/intersection, unexpected, ambiguous semantic ownership, wrong owner, duplicate coverage execution, unsupported Dreamer-Vortox marker, or incomplete A3A/A3B1/2B19B filter partition.

### Vitest filtered-report authority

Vitest 3.2.6 discovers all 26 tests in each filtered Dreamer-Vortox process and records the pattern complement as skipped. The verifier therefore requires, rather than ignores, the exact complementary identities:

- core report: `16` selected tests passed, exactly the `10` gained identities skipped, and zero failed;
- gained report: `10` selected tests passed, exactly the `16` core identities skipped, and zero failed.

The ten single-group reports are the authoritative execution evidence. Their exact passed semantic union is `1,520`, with zero intersection, missing, duplicate, unexpected, ambiguous, or wrong-owner identity.

Vitest's global JSON merge uses same-project task IDs for both filtered blobs. With the gained blob selected last, it reports the known collision shape `1,546` discovered assertions, `1,514` passed assertions, and `32` skipped assertions: the gained result is duplicated while the core result is displaced. The verifier checks that exact structural collision, marks the global JSON `authoritative=false`, and never presents it as the `1,520`-test semantic union. A different, partial, mixed, failed, or unbound collision shape fails closed. The independently merged coverage map remains authoritative for coverage obligations and must match the existing exact profile.

### Round 2 exact source scope

Round 2 changes only:

- the coverage matrix, optional quoted filter argument, ten-blob merge list, and verifier call in `.github/workflows/ci.yml`;
- `scripts/verify-vitest-coverage-groups.mjs` for separate ordinary, coverage-execution, semantic, filtered-complement, and known-global-collision audits;
- `scripts/collect-vitest-shard-diagnostics.mjs` only to validate and record the explicit filter string;
- this infrastructure record and necessary current controls.

It changes no production, test, fixture, ownership contract, rule evidence, design, product traceability, role matrix, workspace, dependency, timeout, retry, pool, worker, coverage subset, threshold, exact profile, or profile selector.

## Exact Scope

Round 1 changes only:

- `.github/workflows/ci.yml`;
- `scripts/collect-vitest-shard-diagnostics.mjs`;
- this implementation record;
- the current infrastructure control records in `docs/agent-loop/`.

It does not change production, `.test.ts` files, fixtures, `vitest.workspace.ts`, ownership contracts, product traceability, rule evidence, frozen design, `package.json`, `pnpm-lock.yaml`, a timeout, a coverage threshold, the approved profile or selector, or ordinary/coverage group topology.

## Historical Round 1 Workflow Contract

The existing coverage invocation remains:

```text
pnpm exec vitest run
--coverage
--coverage.include='packages/*/src/**/*.ts'
--coverage.reporter=json
--workspace vitest.workspace.ts
${{ matrix.projects }}
--reporter=blob
--outputFile=.vitest-coverage/${{ matrix.group }}/${{ matrix.group }}.blob
```

In Round 1 no invocation argument, environment setting, project, retry, timeout, worker, pool, reporter, output path, or profile selection changed. Round 2's only invocation delta is the optional explicit `--testNamePattern=<pattern>` described above.

The step has ID `coverage-shard` and `continue-on-error: true`. This is sequencing control only. The original `steps.coverage-shard.outcome` remains the authority:

| Original outcome | Diagnostic collection/upload | Formal `coverage-blob-*` upload | Enforcement |
| --- | --- | --- | --- |
| `success` | always attempted | uploaded | exit `0` |
| `failure` | always attempted | skipped | exit `1` |
| `cancelled` | always attempted when GitHub permits an `always()` step | skipped | exit `1` |
| skipped or unknown | always attempted when GitHub permits an `always()` step | skipped | exit `1` fail-closed |

The diagnostic artifact is named `coverage-diagnostics-${{ matrix.group }}` and cannot match the existing `coverage-blob-*` download pattern. `coverage-merge` still has `needs: coverage-shard`; the enforcement failure therefore keeps the merge job blocked exactly as before.

## Collector Interface

The collector accepts either `--self-test` alone or every argument below exactly once:

```text
--group <group>
--projects <one-or-more --project=name arguments>
--test-name-pattern <exact explicit filter or empty string>
--blob <canonical repository-relative POSIX path>
--coverage-json <canonical repository-relative POSIX path>
--output <canonical repository-relative POSIX path>
--pnpm-version <single line>
--vitest-version <single line>
--runner-os <single line>
--vitest-max-forks <single line>
--original-outcome <success|failure|cancelled|skipped>
```

Unknown, duplicate, missing, valueless, malformed, absolute, backslash-containing, noncanonical, repository-escaping, or symlink-escaping inputs fail closed. Matrix project text is passed as one quoted YAML/shell value, then parsed into an ordered array of exact `--project=<name>` arguments. This preserves multi-project matrix entries without shell re-tokenization inside the collector.

The script imports only Node standard-library modules. It does not enumerate the environment, read secret-named values, deserialize the blob or coverage JSON, execute data from them, change either input, or try to repair a failed test result. The only environment-like Vitest value recorded is the explicit non-secret `VITEST_MAX_FORKS=1` workflow setting.

## Diagnostic Manifest

`manifest.json` is stable code-unit-key-sorted JSON encoded as UTF-8 with one trailing LF. It records:

- schema version and group;
- ordered project arguments;
- original coverage-step outcome as data, including a valid non-success outcome;
- Node, pnpm, and Vitest versions plus runner OS;
- whitelisted non-secret Vitest configuration;
- canonical repository-relative blob path, `blobPresent`, byte count, modification time, SHA-256, and diagnostic-copy path;
- canonical repository-relative coverage JSON path, presence, byte count, modification time, and SHA-256;
- deterministic code-unit-sorted recursive listings of the two input directories.

When the blob is present, the artifact includes a verified byte-identical copy at `blob/<blob-name>`. When it is missing, the manifest is still written with `blobPresent=false`, null file metadata, and no claimed copy.

A JSON file cannot contain the SHA-256 of its own final bytes without an undefined self-reference. The manifest therefore documents that `manifest.sha256` is the checksum authority. That separate LF-terminated file contains the SHA-256 of the exact UTF-8 bytes of `manifest.json`, including its trailing LF. The collector never claims an impossible self-hash field inside `manifest.json`.

## Self-Test Contract

`node scripts/collect-vitest-shard-diagnostics.mjs --self-test` covers:

- unknown, duplicate, and missing argument rejection;
- canonical path traversal rejection;
- a present blob and a missing blob;
- exact blob and coverage JSON hashes and byte counts;
- byte-identical diagnostic blob copy without source-mtime mutation;
- deterministic manifest bytes and hashes across two output directories;
- exactly one trailing LF;
- exact checksum-file content;
- a valid `failure` original outcome retained as data while collection succeeds.
- exact non-empty filter retention and explicit empty-filter retention.

## Historical Round 1 Validation

- Collector self-test: `PASS`
- Collector targeted ESLint: `PASS`
- `AUTOPILOT_STATE.json` parse: `PASS`
- Workflow PyYAML parse: `PASS`
- Workflow observability structural assertions: `PASS`
- `actionlint`: unavailable in the frozen environment; no tool or dependency was installed
- Prettier: unavailable in the frozen environment; no tool or dependency was installed
- `pnpm typecheck`: `PASS`
- `pnpm lint`: `PASS`
- `pnpm test`: `35 / 35` files and `1,520 / 1,520` tests, `PASS`, Vitest duration `41.08s`
- `pnpm test:coverage`: `35 / 35` files and `1,520 / 1,520` tests, `PASS`, Vitest duration `58.70s`
- Coverage command exact comparison with frozen base: `PASS`
- Coverage matrix/topology exact comparison with frozen base: `PASS`
- Coverage merge and downstream workflow exact comparison with frozen base: `PASS`
- Production, tests, fixtures, package/lockfile, workspace, ownership, rules, design, profile and traceability forbidden-path diff: zero
- `.test.ts` diff: zero
- Added timeout, `testNamePattern`, `maxWorkers`, pool, or project tokens: zero
- `git diff --check`: `PASS`

The local all-file coverage summary includes the new infrastructure script as an uncovered `scripts` file, while the unchanged formal CI coverage command still includes only `packages/*/src/**/*.ts`. No threshold, approved exact profile, selector, or formal coverage input changed.

## Round 2 Source Validation

- Real Vitest 3.2.6 list identity: full `26`, core `16`, gained `10`, union `26`, intersection/missing/duplicate/unexpected `0`.
- Formal ordinary execution: `9 / 9` processes and `9 / 9` single-blob merges exit `0`; group counts `207 / 357 / 456 / 90 / 52 / 73 / 20 / 26 / 239`; risk hits `0`.
- Ordinary nine-blob merge: `1,520 / 1,520` passed, failed/pending `0`; inventory and ownership verifier missing/duplicate/unexpected/wrong-owner `0`.
- Formal coverage execution: `10 / 10` processes and `10 / 10` single-blob merges exit `0`; authoritative passed counts `207 / 357 / 456 / 90 / 52 / 73 / 20 / 16 / 10 / 239`; risk hits `0`.
- Filter complements: core `16` passed plus exact gained `10` skipped; gained `10` passed plus exact core `16` skipped; failures `0`.
- Coverage semantic verifier: union `1,520`, intersection/missing/duplicate/unexpected/wrong-owner `0`; Dreamer marker counts `10 / 6 / 10` for A3A/A3B1/2B19B.
- Non-authoritative global JSON collision audit: exact `1,546` discovered, `1,514` passed assertions, `32` skipped assertions, failed `0`, core signature `0 / 2`, gained signature `2 / 0`.
- Independently merged coverage map: `COVERAGE_APPROVED_PROFILE_MATCH` for unchanged profile `phase-3-slice-2b19b-c7313e2-ownership-v2-1`; exact tuple `63 / 3204 / 23 / 3204 / 1799` and all five hashes match.
- Windows deterministic equivalent: all seven workflow commands exit `0`, risk hits `0`.
- Collector self-test: `PASS`; ownership contract self-test: `22 / 22 PASS`; targeted script ESLint: `PASS`.
- `pnpm typecheck`: `PASS`; `pnpm lint`: `PASS`.
- `pnpm test`: `35 / 35` files and `1,520 / 1,520` tests, `PASS`, Vitest duration `40.42s`, risk hits `0`.
- `pnpm test:coverage`: `35 / 35` files and `1,520 / 1,520` tests, `PASS`, Vitest duration `59.35s`, aggregate `76.12 / 83.25 / 97.40`, risk hits `0`.
- Formal evidence root: repository-external `%LOCALAPPDATA%/BOTCRepoVisibility/coverage-experiments/pr41-split-dreamer-vortox-coverage/formal-round2-source-final`; rejected orchestration attempts remain separate and are not counted.

## Round 2 Stop Boundary

This branch must stop after one attributed, unpushed Round 2 source commit named `ci: isolate gained Dreamer coverage process`. It does not generate or change a coverage profile, push, edit either PR, merge either PR, request product final review, create a tag, change role coverage, or start another Slice.

Before that commit the sole remaining blocker is `PENDING_ATTRIBUTED_UNPUSHED_ROUND_2_SOURCE_COMMIT`. Infrastructure Repair Round 3 is forbidden.
