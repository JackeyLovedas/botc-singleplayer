# Phase 3 Slice 2B19A Implementation Status

> Status: `REPAIR_ROUND_3_LOCAL_GATES_PASS / UNACCEPTED / PARTIAL`. PR [#26](https://github.com/JackeyLovedas/botc-singleplayer/pull/26) exists, but fresh repair-head CI, independent final review, merge, and tag remain pending.

## Implemented boundary

- Base Dreamer V2 first-night opportunity, target choice, information delivery, atomic settlement, strict accepted-stream replay, stored validation, ledger derivation, and source-only private projection.
- Effective Vortox forces a deterministic false GOOD/EVIL pair with explicit V2 evidence and an `ABNORMAL / VORTOX_FALSE_INFORMATION` ledger fact.
- V2 success and idempotent replay expose only the exact event-type summary. Accepted-history, receipt, staged-commit, ledger, and projection entry points remain strict complete-stream consumers; only the private prospective validator accepts exact target/delivery prefixes.
- Accepted V1 replay remains supported. New V1 execution under current Vortox and every Philosopher-gained Dreamer execution fail receipt-free and retryable within the reviewed boundary.

## Explicitly unsupported

- Philosopher-gained Dreamer contracts or execution, other-night Dreamer, Travellers, broader registration, general poisoning derivation, unrestricted Storyteller pair selection, later lifecycle changes, 2B19B, and Phase 2C.
- Dreamer and Vortox remain `PARTIAL`; neither is `COMPLETE`.

## Traceability and validation

- Authority: `docs/implementation/phase-3-slice-2b19a-design-round-2.md`; independent design verdict `RULE_DESIGN_PASS` is in `docs/implementation/phase-3-slice-2b19a-design-review-round-2.md`.
- Rule evidence: `docs/rules/evidence/2B19.md`, `RULE_READY`, coverage `PARTIAL`.
- Test mapping: `docs/implementation/phase-3-slice-2b19a-test-traceability.md`, covering `D19A-001` through `D19A-043`.
- Local gates: typecheck and full lint pass. The four application-service projects pass `90 / 52 / 7 / 64` tests, totaling the unchanged `213`. Full and coverage runs pass all `1450` tests across `31` unique physical test files (`34` Vitest project-file executions because one physical file executes once in each of four projects); coverage is `86.41%` statements/lines, `81.28%` branches, and `96.78%` functions. No `onTaskUpdate` timeout occurs and `git diff --check` passes.

## Remaining acceptance gates

The single repair-round-3 commit must be published to the existing branch and PR. Its frozen feature HEAD must then pass exact-head push and PR CI, followed by one complete independent final review returning both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS` with no blockers. No acceptance or merge is claimed here. Any failure is `HUMAN_BLOCKED`; repair round 4 does not exist.

## Repair round 1

Initial product HEAD `8bbd67b5523e79e4906bc2e27e2f12f0ab1cf971` failed push CI `29335406464` only because the existing Seamstress DEFER parameterized test executes four complete actor paths and exceeded Vitest's default 5,000 ms under Linux coverage. The repair adds an explicit `15_000` ms timeout to that test only; all four paths, assertions, and production semantics are unchanged. Targeted coverage passes in 3.22 seconds, and all local gates remain green at `31 files / 1450 tests`.

## Repair round 2

Repair-round-1 HEAD `94ff27b3f9301a1eae2c211d2891b46e499ead97` failed PR CI `29336318869`, Windows deterministic job `87096328175`, only because the unchanged gained-Mathematician legacy compatibility test exceeded the default 5,000 ms timeout. Repair round 2 adds an explicit `15_000` ms timeout to this test only; assertions, production code, and rule semantics are unchanged. The focused test passes in 1.50 seconds, the application suite passes `213 / 213`, and all full gates remain green at `31 files / 1450 tests` with coverage `86.41% / 81.19% / 96.78%`. The former `2 / 2` budget was superseded only by the user's explicit repair-round-3 authorization below.

## Repair round 3

Authorization: `USER_AUTHORIZED_2B19A_CI_EXECUTION_GRANULARITY_REPAIR_ROUND_3`. Scope is frozen to `TEST_RUNNER_EXECUTION_GRANULARITY_ONLY`; product behavior, rule semantics, test assertions and fixtures, coverage thresholds, workflow configuration, and all timeout values remain unchanged.

Stage 0 reran only the failed validate jobs. Push run `29337585218` attempt 2 again passed all `1450` assertions and emitted the complete coverage report before failing only with `[vitest-worker]: Timeout calling "onTaskUpdate"`. PR run `29337589161` attempt 2 succeeded. No different failure occurred, so Stage 1 was required.

Stage 1 excludes `game-application-service.test.ts` from the ordinary application project and registers its unchanged tests in four mutually exclusive projects:

- `application-service-core`: `90` tests;
- `application-service-role-actions`: `52` tests;
- `application-service-dreamer-v2-base`: `7` tests;
- `application-service-later-role-actions`: `64` tests.

The sum is exactly `213 / 213`; no test is duplicated or omitted. Direct execution with no shard environment still registers every section, while workspace execution supplies one explicit shard value per project. Full test and coverage runs pass all `1450` assertions. Vitest reports `34` project-file executions because the same physical application-service file runs under four projects; the repository still contains the same `31` unique physical test files. Coverage is `86.41% / 81.28% / 96.78%`, and the local coverage run completes without the worker RPC timeout.
