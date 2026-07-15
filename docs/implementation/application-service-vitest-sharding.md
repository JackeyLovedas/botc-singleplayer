# Application-Service Vitest Sharding

## Scope

This infrastructure change splits the existing
`packages/application/src/game-application-service.test.ts` execution across four
mutually exclusive Vitest workspace projects. The ordinary `application` project
excludes that file. No production behavior, test assertion, fixture, test title,
timeout, coverage threshold, workflow, package, lockfile, or BOTC rule semantics
changes.

This is not a Dreamer feature change. It does not contain PR #26 product code,
accept or restore Slice 2B19A, or start Slice 2B19B or Phase 2C.

## Baseline Test Inventory

- Accepted main: `405f13ac2afbdaf33a20d54ece727b68199f152f`.
- Physical test files: 30.
- Workspace project-file executions: 30.
- Total tests: 1,408.
- Application-service tests: 212.
- Unique application-service full titles: 212.
- Coverage: 86.78% statements, 81.52% branches, 97.78% functions,
  and 86.78% lines.

## Shard Definitions

| Workspace project | Environment value | Tests |
| --- | --- | ---: |
| `application-service-core` | `core` | 90 |
| `application-service-role-actions` | `role-actions` | 52 |
| `application-service-information-and-later-actions` | `information-and-later-actions` | 50 |
| `application-service-compatibility-and-failure-boundaries` | `compatibility-and-failure-boundaries` | 20 |
| **Total** | | **212** |

The projects use the same test file, module aliases, test environment, coverage
configuration, and timeouts. With no shard environment value, the test file still
registers all 212 tests.

## Exact Test-Title Set Equality

Vitest JSON reporter output supplies each assertion's `fullName`. Both baseline
and sharded title arrays are sorted with the deterministic UTF-16/code-point
comparator `a < b ? -1 : a > b ? 1 : 0`, joined with LF, and serialized without
a trailing LF. `localeCompare`, `Intl`, and environment-locale ordering are not
used.

- Baseline SHA-256:
  `4f6de46fa4baf33da34d0efdd775635ea1279682f2ba0440151f1c33a9d3d98e`.
- Shard-union SHA-256:
  `4f6de46fa4baf33da34d0efdd775635ea1279682f2ba0440151f1c33a9d3d98e`.
- Baseline count / unique count: 212 / 212.
- Shard-union count / unique count: 212 / 212.
- Missing titles: 0.
- Extra titles: 0.

An earlier controller diagnostic produced
`90eb923a99c9cde9b1d3517d07902ec6534eb2159658d04bee071947553f6973`
with culture-sensitive PowerShell `Sort-Object`. It is intentionally not used as
canonical evidence. The primary gate is the before/after element-by-element set
comparison; the deterministic hash is an additional reproducible check.

## No Duplicate or Omitted Tests

Every pairwise shard intersection contains zero titles. The four shard counts
sum to the 212-title baseline, and their union is exactly the baseline set. No
test uses `skip`, `only`, or `todo` for routing.

## No Assertion, Fixture, or Timeout Changes

The routing adds wrappers around existing contiguous test groups while preserving
the original describe names and all test bodies. It does not change test titles,
assertions, fixtures, imports, or timeouts.

## Local Validation

- Each of the four shard projects passed independently with the counts above.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test`: 33 workspace project-file executions, 30 physical files,
  1,408 tests passed.
- `pnpm test:coverage`: passed with 86.78% statements, 81.62% branches,
  97.78% functions, and 86.78% lines.
- `git diff --check`: passed.
- `[vitest-worker]: Timeout calling "onTaskUpdate"`: not observed.

The branch-coverage increase from 81.52% to 81.62% is the expected measurement
of the test-only routing branches. All other coverage totals equal the accepted
main baseline.

## Change Boundaries

- Production files changed: 0.
- Workflow files changed: 0.
- Package or lockfiles changed: 0.
- Rule evidence or role coverage files changed: 0.
- Dreamer status or role-completion claims changed: 0.

## Accepted Infrastructure Closeout

- PR: [#27](https://github.com/JackeyLovedas/botc-singleplayer/pull/27), merged at `2026-07-15T03:09:27Z`.
- Frozen feature HEAD: `0ba9eaa9d1365811f1ecd8d266a9d05ece0eeadc`.
- Merge SHA: `7efc825beb6f1aece5345a5a941434d0bdd39065`.
- Tag: `infrastructure-application-service-vitest-sharding-v1`.
- Final verdicts: `CODE_REVIEW_PASS / RULE_REVIEW_PASS` with `remainingBlockers=[]` and `ruleSemanticsChanged=false`.
- Code review archive: `docs/reviews/pr-27-code-review-final.md`; exact original comment body SHA-256 `00c86ac5de399b70663405781de829b9695e2f7e9369809bebdc7e05233106ca`.
- Rule review archive: `docs/reviews/pr-27-rule-review-final.md`; exact original comment body SHA-256 `7ee7d4bc0a04891644d657c95159efdf982fdbd53bdd1c13d011b0b0d1211938`.

### CI provenance

- `productHeadCI`: frozen feature HEAD `0ba9eaa9d1365811f1ecd8d266a9d05ece0eeadc`; push run [29384847799](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29384847799) `SUCCESS`; pull-request run [29384865986](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29384865986) `SUCCESS`; scope is the frozen infrastructure feature HEAD only.
- `mergeCommitCI`: merge SHA `7efc825beb6f1aece5345a5a941434d0bdd39065`; main push run [29385842111](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/29385842111) `SUCCESS`; scope is the exact merge commit only.
- `closeoutCommitCI`: pending for this docs-only closeout commit. Its future SHA and run cannot be self-recorded here, and no earlier CI status is inherited.

### Final boundary

PR #25 and PR #26 are closed and unmerged. Their branches, `phase-3/dreamer-v2-completion` and `phase-3/dreamer-v2-base-vortox`, remain read-only references. Dreamer V2 is not accepted. The future `2B19A1`, `2B19A2`, `2B19A3`, and `2B19B` reslice suggestions, FIRST_NIGHT/DAY feature continuation, and Phase 2C have not started. This infrastructure acceptance does not alter the role-slice completion list.
