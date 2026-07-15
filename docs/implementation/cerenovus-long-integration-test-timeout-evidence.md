# Cerenovus Long Integration Test Timeout Evidence

## Classification

```text
classification: TEST_EXECUTION_BUDGET_INFRASTRUCTURE
productBehaviorChanged: false
ruleSemanticsChanged: false
assertionsChanged: false
fixturesChanged: false
globalTimeoutChanged: false
workflowChanged: false
```

This prerequisite changes only the execution budget of one existing long-running integration test. It does not change product behavior, BOTC rule semantics, assertions, fixtures, imports, test sharding, global configuration, workflow configuration, retry behavior, or coverage thresholds.

## Exact Test Identity

- File: `packages/application/src/game-application-service.test.ts`
- Describe path: `GameApplicationService > Slice 2B16 Cerenovus first-night integration`
- Exact title: `keeps every Cerenovus batch event and clock metadata position retryable without burning the command ID`
- Existing shard: `application-service-information-and-later-actions`
- Authorized single-test timeout: `15_000` ms

## Push Failure Evidence

Both failures were produced by push workflow run `29401137937` for product HEAD `2b3d46bda1b7f7565ac353d3180d473c531045c1`.

### Attempt 1

- Coverage test duration: `5512ms`
- Error: `Test timed out in 5000ms.`
- Failed test count: one, with the exact identity above
- Assertion failure: none
- Unhandled exception: none
- Coverage threshold failure: none
- `onTaskUpdate` worker RPC failure: none

### Attempt 2

- Coverage test duration: `5407ms`
- Error: `Test timed out in 5000ms.`
- Failed test count: one, with the exact identity above
- Assertion failure: none
- Unhandled exception: none
- Coverage threshold failure: none
- `onTaskUpdate` worker RPC failure: none

The repeated failure identity and error are exact matches. Both attempts completed typecheck, lint, the ordinary test suite, and the Windows deterministic job successfully; only the Ubuntu coverage step failed on this single-test timeout.

## Successful PR Evidence

PR workflow run `29401141471` for the same product HEAD completed successfully:

- Ordinary mode, same exact test: `2259ms`, passed
- Coverage mode, same exact test: `4132ms`, passed
- Complete workflow result: `SUCCESS`

The passing PR run and the two coverage-only push timeouts establish that the existing assertions and product behavior are not the failure. Coverage instrumentation can move this exhaustive metadata-fault integration test beyond the default `5000ms` budget.

## Authorized Change

The test keeps the same title, asynchronous body, fault cases, assertions, fixtures, imports, and shard assignment. Its Vitest call receives only the final per-test timeout argument `15_000`. No second test and no global timeout are changed.

## Local Validation

All validation below ran on Node `24.15.0` with pnpm `11.7.0` before the infrastructure commit was frozen.

| Validation | Exact test duration | Command wall time | Result |
| --- | ---: | ---: | --- |
| Exact title through the workspace | `1965ms` | `4833ms` | PASS |
| Exact `application-service-information-and-later-actions` shard | `1881ms` | `3786ms` | PASS |
| Exact shard with V8 coverage | `2815ms` | `5325ms` | PASS |
| Full ordinary suite | `1825ms` | `21358ms` | PASS: 33 files, 1408 tests |
| Full coverage suite | `2725ms` | `32992ms` | PASS: 33 files, 1408 tests |

Full gate results:

- `pnpm typecheck`: PASS, `3888ms` wall time
- `pnpm lint`: PASS, `9479ms` wall time
- `pnpm test`: PASS, 33 files and 1408 tests, `21358ms` wall time
- `pnpm test:coverage`: PASS, 33 files and 1408 tests, `32992ms` wall time
- Full coverage: 86.78% statements/lines, 81.62% branches, 97.78% functions
- The ordinary and coverage suites have the same 1408-test baseline count.
- No assertion failure, unhandled exception, coverage-threshold failure, `onTaskUpdate` RPC failure, other test timeout, retry, skip, `todo`, or `only` was observed.
- The diff contains no production, workflow, package, lockfile, rule, matrix, fixture, assertion, import, global-timeout, or shard-assignment change.
