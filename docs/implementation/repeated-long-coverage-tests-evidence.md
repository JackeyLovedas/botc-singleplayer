# Repeated Long Coverage Tests Evidence

## Scope

- Authorization: `USER_AUTHORIZED_GOVERNANCE_CLOSEOUT_CI_TIMEOUT_TRIAGE`
- Classification: `CI_TEST_INFRASTRUCTURE_FAILURE`
- Stage 0 gate: `REPEATED_IDENTICAL_SINGLE_TEST_TIMEOUT`
- Infrastructure branch: `infra/coverage-long-test-timeouts-round-2`
- Source closeout HEAD: `2c15ca96bb7a1ee500ebd1d8707504e57a9719f6`
- Source workflow: [29413647893](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29413647893)
- Product repair consumed: `false`
- Product behavior changed: `false`
- BOTC rule semantics changed: `false`

This infrastructure change adjusts only the execution budget of the one exact test that repeated the same 5,000 ms coverage timeout in Stage 0. It does not change production code, test behavior, assertions, fixtures, imports, sharding, workflows, global timeouts, coverage thresholds, retries, or skip behavior.

## Frozen External Evidence

The complete logs and structured triage evidence remain outside the repository under `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\governance-closeout-timeout-triage`. They are evidence only and are not committed.

| Evidence | Run / attempt / job | Bytes | SHA-256 |
|---|---|---:|---|
| `run-29413647893-attempt-3-validate.log` | `29413647893 / 3 / 87365393020` | 130,840 | `fe18d0f6dae587b1fc4591bf10e8a687c2690c187459c53b3bb15fd2214519d2` |
| `attempt-3-frozen-evidence.json` | `29413647893 / 3 / 87365393020` | 1,914 | `1c5b75fbcf1645c8856d4c6cd420e7bd4caf1b0ee2a1e88f91f1d4ee4101b212` |
| `run-29413647893-attempt-4-validate.log` | `29413647893 / 4 / 87377036212` | 232,252 | `c20fc545bafc22b915b325d08c46b79dfee792c83d0de581dd6bcb19495c60b2` |

All attempts ran against exact HEAD `2c15ca96bb7a1ee500ebd1d8707504e57a9719f6`.

## Attempt 3 Baseline

Attempt 3 passed checkout, install, typecheck, lint, ordinary tests, and Windows deterministic validation, then failed Ubuntu coverage. It identified two 5,000 ms timeout candidates:

| ID | Exact test | Ordinary | Coverage | Result |
|---|---|---:|---:|---|
| A | `packages/domain-core/src/rebuild.test.ts` > `domain event rebuild` > `rejects malformed Witch target, pending death, and ineffective replay batches` | 3,735 ms | 5,581 ms | `Test timed out in 5000ms` |
| B | `packages/application/src/game-application-service.test.ts` > `GameApplicationService` > `accepts Seamstress DEFER from source Human, source AI, Storyteller, and System actors` | 3,838 ms | 6,183 ms | `Test timed out in 5000ms` |

There was no assertion failure, product exception, typecheck failure, lint failure, coverage-threshold failure, or Windows failure. The complete attempt-3 log also recorded two run-level Vitest `onTaskUpdate` unhandled timeouts; these were kept separate from the two direct per-test timeout facts and did not authorize a test change by themselves.

## Stage 0 Rerun: Attempt 4

Attempt 4 was the authorized no-code rerun. Its exact outcomes were:

| ID | Exact test | Ordinary | Coverage | Result |
|---|---|---:|---:|---|
| A | `packages/domain-core/src/rebuild.test.ts` > `domain event rebuild` > `rejects malformed Witch target, pending death, and ineffective replay batches` | 2,932 ms | 5,580 ms | repeated `Test timed out in 5000ms` at `rebuild.test.ts:4398` |
| B | `packages/application/src/game-application-service.test.ts` > `GameApplicationService` > `accepts Seamstress DEFER from source Human, source AI, Storyteller, and System actors` | 3,229 ms | 3,224 ms | passed |

Attempt 4 contained exactly one failed test, no third failed test, no assertion error, no unhandled error, and no `onTaskUpdate` error. Test A therefore satisfies `REPEATED_IDENTICAL_SINGLE_TEST_TIMEOUT`. Test B did not repeat and is not authorized for modification.

## Authorized Change

Only this declaration changes:

- file: `packages/domain-core/src/rebuild.test.ts`
- describe path: `domain event rebuild`
- title: `rejects malformed Witch target, pending death, and ineffective replay batches`
- original per-test timeout: Vitest default `5_000`
- configured per-test timeout: `15_000`

The 5,000 ms default is insufficient because the same exact coverage test required 5,581 ms in attempt 3 and again reached 5,580 ms before timing out in attempt 4. The `15_000` value is an execution budget only. It does not add a retry, change an expectation, suppress a failure, or alter a product/rule result.

## Equivalence Contract

The final diff must prove:

- exact title unchanged;
- synchronous test body byte-equivalent after removing only the final `15_000` argument;
- assertions unchanged;
- fixtures and helper calls unchanged;
- imports unchanged;
- shard/project ownership unchanged;
- test declaration count and repository test count unchanged;
- no other timeout changed;
- no production, workflow, package, lockfile, rule, ADR, agent-loop, or coverage-threshold change.

## Local Validation

All authorized local gates passed:

| Gate | Result | Test A duration / relevant totals |
|---|---|---|
| Exact-title ordinary mode | PASS | 1,639 ms; 1 passed and 198 skipped |
| Full `domain-core` `rebuild.test.ts` project execution | PASS | 1,420 ms; 199 of 199 passed |
| Exact-title coverage mode | PASS | 2,684 ms; 1 passed and 198 skipped |
| `pnpm typecheck` | PASS | no type errors |
| `pnpm lint` | PASS | no lint errors or warnings |
| `pnpm test` | PASS | 1,571 ms; 33 files and 1,418 tests passed |
| `pnpm test:coverage` | PASS | 2,600 ms; 33 files and 1,418 tests passed |

The full coverage run completed in 36.59 seconds with 86.80% statements, 81.72% branches, 97.79% functions, and 86.80% lines. No timeout, assertion failure, unhandled error, or `onTaskUpdate` error occurred. Normalized test-equivalence and exact-scope audits passed: after removing only the final `15_000` argument, the test file matches the source closeout HEAD, and the repository diff contains only the authorized declaration and this evidence document.
