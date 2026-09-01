# Phase 3 Slice 3 Vitest RPC Compatibility Rescope

## Scope and frozen authority

This bounded infrastructure change is authorized by
`USER_AUTHORIZED_SLICE3_VITEST_RPC_COMPATIBILITY_RESCOPE_AND_FINAL_CLOSURE`.
The product merge (`cc6f7523f0fdf7d4ecca551d6493e3f5e6062564`) and source
authority `c5c8f6fabe863f9ec45536305d87c1d5ad2e209b` remain immutable. The active
coverage profile remains `phase-3-slice-3-c5c8f6f-coverage-v1` with 72 sources,
1,733 test identities, and zero unexplained loss or regression. No product,
test identity, rule, coverage, routing, or workflow file is changed here.

The former worker-count repair (`50e8e2bd62d61e93b83e48b89dfa4f2adbbb966c`)
is historical and failed to close the hosted failure. It is not counted as a
second repair round. PR #57 is preserved and closed unmerged as superseded; it
is not rerun.

## Failure and upstream authority

The exact hosted failures are merge-main run `33469899137` (both attempts) and
PR #57 run `33486999784`, in logical group `application-service-core`, coverage
mode. All 96 assertions, coverage output, blob, and reporter output were
present, but the child exited non-zero with the fail-closed global error:
`[vitest-worker]: Timeout calling "onTaskUpdate"`; the singleton diagnostic was
not produced. The root-cause classification is
`UPSTREAM_VITEST_3_RPC_TIMEOUT_COMPATIBILITY_DEFECT`.

Upstream issue [#8164](https://github.com/vitest-dev/vitest/issues/8164)
documents that the worker RPC timeout is independent of `testTimeout`. Upstream
PR [#8297](https://github.com/vitest-dev/vitest/pull/8297) was merged as
`bea874610adf664f83f4b9c37313b67ca32029a3`. Its runtime behavior is directly
equivalent to this failure: RPC calls use `timeout: -1`, pending calls are
rejected during worker/pool shutdown, and channels close deterministically.
There are no retries, sleeps, swallowed errors, or global-error allowlist
changes.

## Repository patch contract

Repository inspection found no prohibition on `patchedDependencies`; the
existing supply-chain policy passes with pnpm 11.7.0. Path A is therefore used:
Vitest remains `3.2.6`, `@vitest/coverage-v8` remains `3.2.6`, and the patch is
persisted through `pnpm-workspace.yaml` and `pnpm-lock.yaml`. Frozen install
passes with the lockfile binding below.

| field | value |
| --- | --- |
| base package | `vitest@3.2.6` |
| patch mechanism | pnpm `patchedDependencies` / `pnpm patch-commit` |
| patch SHA-256 | `09defa208f6f58cf3dd0c99aef7d17460edc5228ad31687494d1827839cc4c12` |
| lockfile binding | `vitest@3.2.6(patch_hash=09defa208f6f58cf3dd0c99aef7d17460edc5228ad31687494d1827839cc4c12)` |
| install proof | `corepack pnpm@11.7.0 install --frozen-lockfile` PASS |

The upstream change touches 12 source/lock/workspace files. The Node CLI
distribution used by this repository has the corresponding behavior bundled in
five persisted patch targets: `dist/chunks/index.B521nVV-.js` (birpc pending
call API), `dist/chunks/rpc.-pEldfrD.js`, `dist/worker.js`,
`dist/chunks/coverage.DfSpMS-b.js`, and `dist/chunks/cli-api.DWGBtMmz.js`.
The browser client and websocket-client source files are excluded because this
repository executes the Node pool/coverage path only; the birpc behavior needed
by the worker cleanup is included in the bundled `index` target. No unrelated
dependency family is upgraded.

## Deterministic compatibility proof

A disposable harness (not committed and not part of normal CI) ran one forked
worker test that synchronously blocked for 65 seconds with a legal 120-second
test timeout.

* Unpatched npm `vitest@3.2.6` from an isolated temporary directory: the test
  passed but produced one unhandled global error, exactly
  `[vitest-worker]: Timeout calling "onTaskUpdate"`, with non-zero fail-closed
  semantics.
* Patched workspace package after a forced frozen install: the same test ran for
  65 seconds, passed, and produced no unhandled errors.

This proof exercises the RPC timeout itself; it does not alter repository test
semantics or add a long-running test to CI.

## Invariants and next gate

Reporter, diagnostic, and evidence schemas remain unchanged. Fail-closed global
error handling remains unchanged. The active profile and 1,733 canonical test
identities are not regenerated. The old worker-count flags are absent from this
branch. Hosted acceptance is still required on a new compatibility PR: the
first pull-request run must be green without rerun, followed by first-attempt
merge-main CI. A same-signature hosted failure is an immediate
`HUMAN_BLOCKED_VITEST_RPC_COMPATIBILITY_REPAIR_FAILED` stop.
