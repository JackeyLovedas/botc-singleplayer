# Command Capture Proxy Rejection V1 - Source Status

## Status

- Task: `COMMAND_CAPTURE_PROXY_REJECTION_V1`
- Branch: `infra/command-capture-proxy-rejection-v1`
- Accepted base: `c0c0cdfef1c1aa4cebb841f9867007a319701459`
- Authorization: `USER_AUTHORIZED_COMMAND_CAPTURE_PROXY_REJECTION_V1_PREREQUISITE`
- Governance: `GO`, `10/10`
- Independent security design review: `SECURITY_DESIGN_PASS`, findings `[]`, remaining blockers `[]`
- Source state: `FINAL_REVIEW_REPAIR_ROUND_1_FROZEN`
- Source commit: `ea08ddd979bc8d3e825efdf5b290bd0c3e85942f`
- Profile commit: `456027283f884d634ed3925d610fb0410d0d8e87`
- Repair base / prior reviewed HEAD: `456027283f884d634ed3925d610fb0410d0d8e87`; this is not the unknown repair commit HEAD
- Pull request: `#43`, `https://github.com/JackeyLovedas/botc-singleplayer/pull/43`
- Prior-reviewed-head CI: push `29733785911` and pull request `29733791099`, both `SUCCESS / 23 of 23`; fresh repair-head CI is required
- Foundation repair: `repairRound=1/2`; `infrastructureRepairRound=1/2`; product repair is not consumed
- Independent final-review round 1: external report SHA-256 `1ce50eb00c0e3d72f47e8ed6adf4ec2141559336ea71fdb39bc1054f1cd6e0f0`; `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_FIX_REQUIRED`
- Rule-design-gate recovery: `docs/implementation/command-capture-proxy-rejection-v1-rule-design-review.md`, SHA-256 `dd72d59fca6f534f37c14b7001e917f4b679274d4a3915e99d79fc9be243dc97`; exact `RULE_DESIGN_PASS`; `findings=[]`; `remainingBlockers=[]`; unchanged design SHA-256 `4693cddf74159c1cf310781effd74154a0d6ede8615ad873b0576dd36c68c220`; not Design Round 2
- Implementation authorization: `false`; product is frozen for review
- Current blocker: `PENDING_EXACT_HEAD_FINAL_REVIEW`
- Required next action: `PUSH_WAIT_EXACT_HEAD_CI_AND_RUN_FINAL_REVIEW`
- BOTC rule evidence: `BOTC_RULE_EVIDENCE_NOT_APPLICABLE`

This Foundation changes command-capture trust-boundary handling only. The current authorization is limited to docs-only final-review repair and does not start or accept Slice 2B19A3B2, change domain events or state, modify rule evidence or role coverage, change the exact profile tuple or workflow selector, or alter production/tests/ownership.

## Implemented boundary

`captureSupportedCommand` now rejects every object or array Proxy through Node 24.15.0 `util.types.isProxy` before cycle checks, reflection, array classification, or property access. The exact reason is `Command values must not be Proxy objects`.

`GameApplicationService` now obtains an uncaptured failure `gameId` only from a non-Proxy object's own string data-property descriptor. A top-level Proxy throws the existing exact `TypeError("GameApplicationService requires an own data-property gameId")` before any Proxy trap or store port. A plain command containing a nested Proxy returns the existing retryable `DependencyExecutionFailed` command-validation shape before any store access.

## Source scope and stop-loss

| Class | Files | Diff |
|---|---|---:|
| production | `packages/application/src/command-fingerprint.ts`; `packages/application/src/game-application-service.ts` | `+29/-5` |
| primary tests | `packages/application/src/command-fingerprint.test.ts`; `packages/application/src/game-application-service.test.ts` | within exact allowlist |
| conditional infrastructure | `scripts/vitest-ownership-contracts.mjs` | only the shared active non-marker ownership hash |

Added production LOC is `29`, within the design limit `<=120`. Domain core, engines, events, state, receipt/result schemas, dependencies, timeouts, topology, rules, overrides, role matrix, coverage profiles, and `.github/workflows/ci.yml` are unchanged.

The three exported fingerprint constants remain byte-unchanged in the production diff and retain these exact literals:

- `COMMAND_FINGERPRINT_SCHEMA_VERSION = "supported-command-structural-fingerprint-v1"`
- `COMMAND_CANONICALIZATION_ALGORITHM = "plain-data-tagged-tree-code-unit-keys-v1"`
- `COMMAND_FINGERPRINT_DIGEST_ALGORITHM = "SHA-256"`

The existing legal-data golden vector remains exact: UTF-8 length `111`, digest `8baf95bb080ffb729c9ae6abe58ab64370ead5943e8e27b2297519a9ce7ed542`, and the existing six-key fingerprint shape.

## C01-C20 implementation traceability

The complete authoritative implementation-time mapping is `docs/implementation/command-capture-proxy-rejection-v1-test-traceability.md`, SHA-256 `b12fadae603db71d6a1a8c6efb8756661bd6f5b84d13ce50bf0aadc8ab706f8d`. It retains all nine frozen expected fields for C01-C20, binds every criterion to one exact current physical test identity and one primary layer, records actual reachability/trust/main assertion/production entry/fault mechanism, and resolves every supporting authority exactly once.

The read-only external verifier `%LOCALAPPDATA%\BOTCRepoVisibility\reviews\verify-pr43-command-capture-traceability.mjs` returned `TRACEABILITY_MECHANICAL_PASS`: expected rows `20`, actual rows `20`, unique primary identities `20`, supporting authorities `19`, referenced authorities `19`, failures `[]`, and frozen design SHA-256 `4693cddf74159c1cf310781effd74154a0d6ede8615ad873b0576dd36c68c220`. C18 explicitly retains `ExpectedPrimaryLayer=APPLICATION_COMMAND_INTEGRATION`, records its direct physical primary as `STRUCTURAL_VALIDATION`, and uses the exact reordered-service identity only as C18 support and as C19 primary; the unchanged required mechanism is proved by that primary-plus-support chain.

Focused validation on the pre-repair product HEAD passed `command-fingerprint.test.ts` at `1 file / 32 tests` and the compatibility/failure-boundaries shard at `1 file / 26 tests`. The repair changes no test or production byte.

## Ownership contract preservation

Six new non-marker service test identities changed the shared non-marker inventory. The only ownership-registry edit replaces `nonMarkerOwnershipSha256` with:

`764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8`

That same value appears only in the three existing active records `2B19A3A`, `2B19A3B1`, and `2B19B`. Contract IDs, schemas, marker ownership, project inventories, semantic inventories, authority inventories, traceability counts, dynamic bindings, supporting authorities, and all other frozen fields are unchanged. The self-test passed `22/22`.

## Local gates

- Node `24.15.0`; pnpm `11.7.0`.
- Typecheck: `PASS`.
- Full lint: `PASS` (`eslint . --max-warnings 0`).
- Ordinary topology: `9/9` groups and all merges `PASS`; `31` physical test files, `35` workspace executions, `1535/1535` tests, failed/missing/duplicate/unexpected/wrong-owner all `0`.
- Ordinary group counts: `207 / 357 / 465 / 90 / 52 / 73 / 26 / 26 / 239`.
- Ordinary execution SHA-256: `f764c30ac1baaaf56aa0c2e7ad8c712ebeac38e65d42fb574146f58eafed3a18`.
- Coverage topology: `10/10` groups, per-group reports, global test/coverage merge, and authoritative semantic inventory `PASS`; semantic union `1535`, failed/missing/duplicate/unexpected/wrong-owner all `0`.
- Coverage execution SHA-256: `f98832bbc0c7b878c10b5db0dec98fd202b1ad35177a55812dc75c949c1483b3`.
- Semantic SHA-256: `c002db40d8d188aed38e37ba2ebad67d7a4821e9cdf0266d680436601f77167f`.
- Merged coverage: statements/lines `87.83%`, branches `83.29%`, functions `97.85%`.
- Windows deterministic workflow equivalent: all seven commands `PASS`; setup `50`, assignment `13`, information `15`, selected domain `66`, projections `95`, task `9`, application `276`.
- `git diff --check`, final JSON parse, final allowlist and staged-scope checks are required immediately before commit.

## Historical source-stage profile result

At exact source HEAD `ea08ddd979bc8d3e825efdf5b290bd0c3e85942f`, no profile or workflow selector had yet been created or edited. Validation against the then-frozen selector `phase-3-slice-2b19b-dcfa530-split-coverage-v1` exited `1` with the expected fail-closed verdict `COVERAGE_REQUESTED_PROFILE_MISMATCH`.

The candidate tuple is `63 / 3206 / 23 / 3206 / 1800`; the selected old tuple is `63 / 3204 / 23 / 3204 / 1799`. Source-file count and SHA-256 remain exact. The difference is the expected new-source/test coverage-obligation identity and is not concealed or promoted to an approved profile.

## Operational anomalies retained

- The first outer ordinary orchestration shell timed out at its local `5s` tool limit while `domain-core-rebuild` continued as the only child. The child exited normally, produced its blob, and the final ordinary merge proved that group `207/207` with zero failures. This was not a Vitest test timeout or `onTaskUpdate` error.
- The first Windows launch of coverage group `application-service-dreamer-vortox-core` exited `255` before Vitest started because the `.cmd` shim interpreted the exact regex pipe. It produced no authoritative group result. Direct invocation of `node node_modules/vitest/vitest.mjs` with the same exact pattern `\[(?:2B19A3A|2B19A3B1)-` then exited `0`; the group report proved `16/16` passed with the exact `10`-test skipped complement.
- The expected old-profile audit exited `1` only with `COVERAGE_REQUESTED_PROFILE_MISMATCH` as recorded above.
- No test execution reported an assertion failure, test timeout, unhandled `onTaskUpdate`, or hidden exit `1`.

## Delivery boundary

Source commit `ea08ddd979bc8d3e825efdf5b290bd0c3e85942f` and profile commit `456027283f884d634ed3925d610fb0410d0d8e87` already exist on PR #43. This repair is limited to docs/control reconciliation, the independent rule-design-gate recovery report, and implementation traceability. Its next action is one attributed repair commit followed by fresh exact-head push and pull-request CI; no final pass, comment, merge, tag, closeout, or A3B2 continuation is inferred.

## Profile-stage continuation

The exact source commit is `ea08ddd979bc8d3e825efdf5b290bd0c3e85942f`. Three effective fresh ten-process candidates pass all shards, merges, inventory/semantic audits and obligation comparisons with `1535/1535` tests, identical canonical source/zero-hit hashes and risk hits `0`. Profile `foundation-command-capture-proxy-rejection-v1-ea08ddd` is committed at exact profile commit `456027283f884d634ed3925d610fb0410d0d8e87`; its `sourceHead` correctly remains the source commit rather than self-referencing the profile commit.

`coverageHarnessCorrection=2` is retained transparently: `PRE_CANDIDATE_POWERSHELL_STDERR_CLASSIFICATION_ERROR` occurred before Vitest produced any result, and `CANDIDATE_MERGE_LOG_COLOCATION_HARNESS_ERROR` occurred when an empty redirected log was mistakenly placed in a merge-input directory. Neither run counts toward the three effective candidates; all evidence is preserved externally. Neither correction changed repository/configuration bytes or consumed a repair round. The current Foundation final-review repair is separately `1/2`.

Profile-stage state is `RECORDED_SELECTOR_ACTIVE` at profile commit `456027283f884d634ed3925d610fb0410d0d8e87`. Push CI `29733785911` and pull-request CI `29733791099` both completed `SUCCESS / 23 of 23` on that prior reviewed/repair-base HEAD. The current sole blocker is `PENDING_EXACT_HEAD_FINAL_REVIEW`; the old CI and review cannot be inherited by the repair commit.
