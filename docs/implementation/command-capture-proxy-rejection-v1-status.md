# Command Capture Proxy Rejection V1 - Source Status

## Status

- Task: `COMMAND_CAPTURE_PROXY_REJECTION_V1`
- Branch: `infra/command-capture-proxy-rejection-v1`
- Accepted base: `c0c0cdfef1c1aa4cebb841f9867007a319701459`
- Authorization: `USER_AUTHORIZED_COMMAND_CAPTURE_PROXY_REJECTION_V1_PREREQUISITE`
- Governance: `GO`, `10/10`
- Independent security design review: `SECURITY_DESIGN_PASS`, findings `[]`, remaining blockers `[]`
- Source state: `SOURCE_READY_PENDING_COMMIT`
- Infrastructure repair: `0/2`
- Sole blocker: `PENDING_SOURCE_COMMIT`
- BOTC rule evidence: `BOTC_RULE_EVIDENCE_NOT_APPLICABLE`

This Foundation changes command-capture trust-boundary handling only. It does not start or accept Slice 2B19A3B2, change domain events or state, modify rule evidence or role coverage, create a coverage profile, change the workflow selector, push, or create a pull request.

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

Every new Foundation test title is non-marker and stays in its pre-existing physical owner.

| Criterion | Physical authority and result |
|---|---|
| C01 | `command-fingerprint.test.ts` - `C01 rejects a transparent top-level object Proxy before every installed object trap`: exact invalid reason; 11 trap counters zero. |
| C02 | `command-fingerprint.test.ts` - `C02 rejects a nested object Proxy before every installed object trap`: exact invalid reason; target unchanged; counters zero. |
| C03 | `command-fingerprint.test.ts` - `C03 rejects a Proxy-wrapped array before Array.isArray, descriptors, or traps`: exact rejection plus plain dense-array positive regression. |
| C04 | `command-fingerprint.test.ts` - `C04 rejects a revoked Proxy with the exact reason and without invoking its handler`: no escaped revocation error. |
| C05 | `command-fingerprint.test.ts` - `C05 rejects null-target and throwing getPrototypeOf Proxies before traps`: exact reason; counters zero. |
| C06 | `command-fingerprint.test.ts` - `C06 rejects a throwing ownKeys Proxy before its trap`: exact reason; counters zero. |
| C07 | `command-fingerprint.test.ts` - `C07 rejects throwing and descriptor-changing Proxies before descriptor traps`: both exact-invalid; counters zero. |
| C08 | `command-fingerprint.test.ts` - `C08 rejects throwing and transparent get Proxies before property reads`: both exact-invalid; counters zero. |
| C09 | `game-application-service.test.ts` compatibility shard - `C09 rejects top-level live, revoked, and throwing Proxies without traps`: exact TypeError; all counters zero. |
| C10 | same shard - `C10 stops a top-level Proxy before every command-store port`: receipt/event reads and accepted/rejected writes all zero; receipt count and version zero. |
| C11 | same shard - `C11 returns the exact retryable command-validation failure for a nested Proxy`: complete result shape exact; `currentGameVersion` absent; traps zero. |
| C12 | same shard - `C12 performs zero receipt and event reads for a nested Proxy failure`: both read counters zero. |
| C13 | same shard - `C13 performs zero accepted or rejected receipt writes for a nested Proxy failure`: both write counters and receipt count zero. |
| C14 | same shard - `C14 performs zero event writes and leaves the initial game version unchanged`: accepted commit count zero; event reads zero; version zero. |
| C15 | unchanged existing `rejects unsupported command structure: revoked proxy` authority plus C04 exact-reason authority both pass. |
| C16 | unchanged stored-fingerprint authorities `rejects every stored fingerprint Proxy...`, revoked stored fingerprint service conflict, and changing stored fingerprint service conflict all pass. |
| C17 | unchanged `uses the exact tagged canonical tree, six-key fingerprint, UTF-8 length, and SHA-256 vector` authority passes. |
| C18 | unchanged direct key-order authority and service `treats reordered own data properties as the same structural command` both pass. |
| C19 | reordered service authority now also captures the original stored receipt before retry and proves the post-retry receipt is exactly unchanged. |
| C20 | `command-fingerprint.test.ts` - `C20 keeps the three fingerprint identity constants exact`, plus production diff audit and C17 golden authority, pass. |

Focused validation passed `command-fingerprint.test.ts` at `1 file / 32 tests` and the compatibility/failure-boundaries shard at `1 file / 26 tests`. Those assertions prove all installed Proxy trap counters are zero and top-level/nested service store read, write, receipt, event, and version invariants are zero as specified.

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

## Expected source-stage profile result

No profile or workflow selector was created or edited. Validation against the frozen selector `phase-3-slice-2b19b-dcfa530-split-coverage-v1` exited `1` with the expected fail-closed verdict `COVERAGE_REQUESTED_PROFILE_MISMATCH`.

The candidate tuple is `63 / 3206 / 23 / 3206 / 1800`; the selected old tuple is `63 / 3204 / 23 / 3204 / 1799`. Source-file count and SHA-256 remain exact. The difference is the expected new-source/test coverage-obligation identity and is not concealed or promoted to an approved profile.

## Operational anomalies retained

- The first outer ordinary orchestration shell timed out at its local `5s` tool limit while `domain-core-rebuild` continued as the only child. The child exited normally, produced its blob, and the final ordinary merge proved that group `207/207` with zero failures. This was not a Vitest test timeout or `onTaskUpdate` error.
- The first Windows launch of coverage group `application-service-dreamer-vortox-core` exited `255` before Vitest started because the `.cmd` shim interpreted the exact regex pipe. It produced no authoritative group result. Direct invocation of `node node_modules/vitest/vitest.mjs` with the same exact pattern `\[(?:2B19A3A|2B19A3B1)-` then exited `0`; the group report proved `16/16` passed with the exact `10`-test skipped complement.
- The expected old-profile audit exited `1` only with `COVERAGE_REQUESTED_PROFILE_MISMATCH` as recorded above.
- No test execution reported an assertion failure, test timeout, unhandled `onTaskUpdate`, or hidden exit `1`.

## Delivery boundary

The next action is one attributed source commit named `fix: reject Proxy values at command capture`. It must include this status, the governance/design/review records, the four control records, the two production files, the two primary test files, and the conditional ownership hash update only. It must not include generated artifacts, profiles, workflow changes, or paused A3B2 WIP. No push or pull request is authorized in this stage.

## Profile-stage continuation

The exact source commit is `ea08ddd979bc8d3e825efdf5b290bd0c3e85942f`. Three effective fresh ten-process candidates pass all shards, merges, inventory/semantic audits and obligation comparisons with `1535/1535` tests, identical canonical source/zero-hit hashes and risk hits `0`. Profile `foundation-command-capture-proxy-rejection-v1-ea08ddd` is ready at `docs/implementation/command-capture-proxy-rejection-v1-coverage-profile.md`; its `sourceHead` remains the source commit rather than the future profile commit.

`coverageHarnessCorrection=2` is retained transparently: `PRE_CANDIDATE_POWERSHELL_STDERR_CLASSIFICATION_ERROR` occurred before Vitest produced any result, and `CANDIDATE_MERGE_LOG_COLOCATION_HARNESS_ERROR` occurred when an empty redirected log was mistakenly placed in a merge-input directory. Neither run counts toward the three effective candidates; all evidence is preserved externally. Neither correction changed repository/configuration bytes or consumes Foundation repair capacity, which remains `0/2`.

Profile-stage state is `EXACT_PROFILE_READY_PENDING_COMMIT`; the sole blocker is `PENDING_PROFILE_COMMIT`. The profile-only commit must change no production or test bytes and must not be pushed in this handoff.
