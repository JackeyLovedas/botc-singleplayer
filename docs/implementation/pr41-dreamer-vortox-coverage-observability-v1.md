# PR #41 Dreamer-Vortox Coverage Failure Observability V1

## Control

- Authorization: `USER_AUTHORIZED_PR41_COVERAGE_FAILURE_OBSERVABILITY_AND_CONDITIONAL_PROCESS_SPLIT`
- Classification: `CI_TEST_INFRASTRUCTURE_FAILURE`
- Infrastructure repair: `1 / 2`
- Product repair: `2 / 2` exhausted and unchanged
- Base branch: `phase-3/philosopher-gained-dreamer-effective-source`
- Base and frozen product HEAD: `6e7b0d752750bc00f64309ed5e4f59c39b93255e`
- Infrastructure branch: `infra/pr41-dreamer-vortox-coverage-observability-v1`
- Stacked PR: not created
- Product PR: [#41](https://github.com/JackeyLovedas/botc-singleplayer/pull/41), frozen
- Product behavior changed: `false`
- BOTC rule semantics changed: `false`
- Tests or fixtures changed: `false`
- Role coverage changed: `false`
- Coverage process split authorized: `false`

The two old exact-head runs retained only a generic process exit after the Dreamer-Vortox blob was reported. Their old artifacts are unavailable, so they cannot establish that either blob is complete or that all tests represented by it pass. Round 1 therefore adds observability only and makes no failure classification that would authorize Round 2.

## Exact Scope

Round 1 changes only:

- `.github/workflows/ci.yml`;
- `scripts/collect-vitest-shard-diagnostics.mjs`;
- this implementation record;
- the current infrastructure control records in `docs/agent-loop/`.

It does not change production, `.test.ts` files, fixtures, `vitest.workspace.ts`, ownership contracts, product traceability, rule evidence, frozen design, `package.json`, `pnpm-lock.yaml`, a timeout, a coverage threshold, the approved profile or selector, or ordinary/coverage group topology.

## Workflow Contract

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

No invocation argument, environment setting, project, retry, timeout, worker, pool, reporter, output path, or profile selection changes.

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

## Validation

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

## Stop Boundary

This branch must stop after one attributed, unpushed Round 1 commit. It does not create a stacked PR, rerun the old CI attempts, classify the missing old artifacts, split the Dreamer-Vortox process, add an infrastructure repair round, merge either PR, request product final review, create a tag, change role coverage, or start another Slice.

The sole remaining blocker after local implementation is `PENDING_STACKED_PR_EXACT_HEAD_DIAGNOSTIC_ARTIFACTS`.
