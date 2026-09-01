# Phase 3 Slice 3 Post-Merge Sidecar Repair

## Frozen authority and scope

- Product source head `S`: `c5c8f6fabe863f9ec45536305d87c1d5ad2e209b` (immutable; product repair `3/3`).
- Product/profile publication head: `c7a6fe2fdd1b2883897ca855c888fa71a52a5261`.
- Product merge commit: `cc6f7523f0fdf7d4ecca551d6493e3f5e6062564`.
- Active profile: `phase-3-slice-3-c5c8f6f-coverage-v1`, source head `S`, 72 source files, 1733 identities.
- Only permitted implementation file is `scripts/run-vitest-logical-group.mjs`; product, tests, rules, profile, and workflow topology are immutable.

## Forensic census

The merge-main CI run `33469899137` failed on both attempts in the same logical group, `coverage shard (application-service-core)`, with the outer diagnostic `SIDECAR_MISSING` for `application-service-core--full`. The first attempt's artifact was replaced by GitHub on rerun and is not retained as a separately downloadable artifact; its job log records the same failed contract. The second-attempt artifact (`coverage-evidence-application-service-core`, run `33469899137`) was downloaded and inspected.

The failed artifact contained a non-empty physical blob, coverage-final JSON, reporter record, segment evidence, singleton input, singleton raw report, stdout, and stderr. It did not contain `singleton-diagnostics/application-service-core--full.json`. The reporter record contained all 96 selected tasks as `PASS`, but one serialized global error. Decoding the Vitest 3.2.6 blob showed:

`[vitest-worker]: Timeout calling "onTaskUpdate"`

with child exit code `1`, no signal, no spawn error, and no assertion failure. The blob merge therefore exited non-zero and the parent correctly withheld the singleton diagnostic. The logs contained only the normal workspace deprecation warning; no product exception or coverage-threshold failure was present.

The successful exact-head PR artifact from run `33468233414` had the same Node `24.15.0`, Vitest `3.2.6`, Linux x64 runtime and command identity, with 96/96 passed, zero global errors, a complete singleton diagnostic, and merge eligibility `true`. Its coverage-final file and stdout/stderr hashes matched the failed artifact; only the failed run's blob carried the worker RPC timeout error.

## Root cause and bounded repair

Vitest 3.2.6's installed reporter contract marks `onFinished` as deprecated in favor of `onTestRunEnd`, while the installed RPC implementation uses a fixed 60-second timeout. The failing blob's first divergence is the worker-to-parent `onTaskUpdate` timeout during the concurrent default worker schedule; this is an infrastructure lifecycle failure, not a test assertion or product failure.

The harness now passes the explicit Vitest bounds `--maxWorkers=1` and `--minWorkers=1` for every logical execution. This makes the existing one-worker contract effective at the Vitest CLI layer without changing logical/physical shard topology, test identities, coverage obligations, reporter schemas, or fail-closed checks. No retry, sleep, polling, synthetic sidecar, fallback, threshold change, test deletion, or workflow change was added.

A permanent harness regression assertion verifies both worker-bound flags are present. Existing sidecar atomic write, same-process reporter, global-error propagation, singleton verification, and missing-sidecar failure behavior remain unchanged.

## Local evidence

- Harness self-test: `43/43 PASS`.
- Ownership self-test: `42/42 PASS`.
- Logical-group self-test: `7/7 PASS`.
- application-service-core coverage: `96/96 PASS`, verify `PASS`, diagnostic `AVAILABLE`, global errors `[]`.
- Full coverage: `1733 PASS`, aggregate `PASS`, exact active profile match.
- Full ordinary execution: `1733 PASS`, aggregate `PASS`.
- Bounded stress diagnostic: 10/10 application-service-core coverage executions produced complete sidecars and passed verification.
- Typecheck and lint: `PASS`.

The repair changes no product, test, rule, coverage-profile, dependency, or workflow files. The branch is based on `cc6f7523f0fdf7d4ecca551d6493e3f5e6062564`; post-repair commit and hosted evidence are pending the fresh infrastructure review and infrastructure-only PR gates.
