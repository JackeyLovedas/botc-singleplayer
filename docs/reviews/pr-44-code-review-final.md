# PR #44 Code Review Final Archive

- PR: `#44`
- Frozen feature HEAD: `8cb921c5130454c90c0a63fc4b03a1d24f789b0f`
- Merge SHA: `e247993e1b7ca8b651659f7b6cdeee6c2a58a070`
- Original comment ID: `5065379962`
- Original comment URL: `https://github.com/JackeyLovedas/botc-singleplayer/pull/44#issuecomment-5065379962`
- Original comment timestamp: `2026-07-24T01:56:02Z`
- Original comment updated timestamp: `2026-07-24T01:56:02Z`
- Original UTF-8 comment body bytes: `10529`
- Original UTF-8 comment body SHA-256: `88f559dc9f55f5a9c189dd58115f9078ce239a98cc57340e3f30e5ae60d8a4d9`

## Verbatim Original Comment Body

<!-- BEGIN VERBATIM ORIGINAL COMMENT BODY -->
<!-- BOTC_FINAL_CODE_REVIEW
reviewedHead=8cb921c5130454c90c0a63fc4b03a1d24f789b0f
-->
reviewedPR: 44  
reviewedHead: 8cb921c5130454c90c0a63fc4b03a1d24f789b0f  
reviewedPrBodySha256: 971a26dabe1ae77ee49597f6ae3a5e5e2924219200a7b9eb1202933aa9450fc7  
reviewTimestamp: 2026-07-24T09:36:00+08:00

reviewScope:
- Independently reviewed the complete PR #44 diff from base `9262a2a271c7e4f704c90eca67ce4087a316c252` through frozen head `8cb921c5130454c90c0a63fc4b03a1d24f789b0f`.
- Verified the frozen remote head and PR-body hash exactly match the required values.
- Reviewed all 20 changed files, the affected unchanged production authorities, supporting tests, architecture/design/status documents, rule evidence, role coverage matrix, official nightsheet, live external rule sources, PR #45 infrastructure supersession, and CI for the exact reviewed head.
- The local `a8f17e4d62b500550d1092ec1bff19fac05ebf9a` tree was byte-identical to the reviewed remote head tree; remote metadata, commits, checks, and logs were reviewed live.
- No files, comments, commits, branches, PRs, or CI runs were modified.

changedFilesReviewed:
- `.github/workflows/ci.yml`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/architecture/2B19A3B2-go-no-go-under-governance-v1.md`
- `docs/implementation/phase-3-slice-2b19a3b2-coverage-profile.md`
- `docs/implementation/phase-3-slice-2b19a3b2-design-release-review-after-command-capture-v1.md`
- `docs/implementation/phase-3-slice-2b19a3b2-design-review-round-1.md`
- `docs/implementation/phase-3-slice-2b19a3b2-design.md`
- `docs/implementation/phase-3-slice-2b19a3b2-status.md`
- `docs/implementation/phase-3-slice-2b19a3b2-test-traceability.md`
- `docs/implementation/pr45-a3b2-hosted-stability-profile-v2.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/rules/evidence/2B19A3B2.md`
- `packages/application/src/game-application-service.test.ts`
- `scripts/verify-coverage-obligations.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `scripts/vitest-ownership-contracts.mjs`

productionFilesReviewed:
- No game-production file changed in PR #44.
- `packages/application/src/game-application-service.ts`
- `packages/application/src/command-fingerprint.ts`
- `packages/domain-core/src/mathematician.ts`
- `packages/domain-core/src/mathematician-internal.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/projections/src/index.ts`
- `.github/workflows/ci.yml`
- `scripts/verify-coverage-obligations.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `scripts/vitest-ownership-contracts.mjs`

testFilesReviewed:
- `packages/application/src/game-application-service.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/application/src/command-fingerprint.test.ts`
- `packages/domain-core/src/mathematician.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/first-night-action-opportunity.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- Relevant replay, projection, batch-semantics, fixture, and legacy Dreamer V2/V3/V4/V6 coverage referenced by the slice traceability report.

ruleEvidenceReviewed:
- `AGENTS.md`
- `project-handoff/00-README-FIRST.md` and its ordered handoff documents
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19A3B2.md`; canonical LF SHA-256 `64607c71…6eb0`, terminal verdict `RULE_READY`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- Canonical design SHA-256 `23c191…306e`
- Independent design-review SHA-256 `16054d…e13`, verdict `RULE_DESIGN_PASS`
- Release-review SHA-256 `c0c742…3485`, verdict `DESIGN_RELEASE_PASS`
- Go/no-go SHA-256 `000964…d88d7`
- Complete 58-criterion traceability matrix, C01–C46 and S01–S12
- Live official BOTC Wiki revisions for Mathematician, Dreamer, Philosopher, Vortox, States and Abilities; every checked body hash matched the recorded evidence
- Live user-specified Chinese Wiki revisions for Mathematician, Dreamer, Philosopher, Vortox, Drunk and Poisoned; every checked body hash matched the recorded evidence
- Official nightsheet pinned at commit `3d6d930a…`; body SHA-256 `99a2815…3f75`
- Independently verified night order:
  - First night: Philosopher 13, Dreamer 60, Seamstress 61, Mathematician 76, Dawn 77; Vortox absent
  - Other nights: Philosopher 10, Vortox 46, Dreamer 78, Seamstress 82, Mathematician 95, Dawn 97
- All six applicable approved user overrides, including settlement timing, Mathematician dawn window, own-instance exclusion, numeric domain, duplicate-holder temporal policy, and Dreamer/Vortox/Drunk attribution
- PR #45 final code/rule audit comments and complete infrastructure diff
- PR #45 H2/H3/H4 hosted-stability profile and authoritative report SHA-256 `008eb7…28de`

findings: []

verificationResults:
- The slice adds test and evidence coverage without changing game-production behavior.
- The nine A3B2 application tests exercise real command/service/replay paths rather than synthetic event-only construction.
- Native and Philosopher-gained Dreamer facts remain distinct through player, source, tenure, ability-instance, fact, and support identifiers.
- Mathematician resolution counts distinct affected players, excludes the resolving ability’s own instance, ignores normal/pending outcomes, preserves supporting fact IDs, and applies deterministic code-unit ordering.
- Vortox settlement correctly produces a false Townsfolk-information value. With a true count of two, the deterministic delivered value is zero; without Vortox, the delivered value remains two.
- Delivery and settlement form one prospectively validated atomic two-event batch with exact adjacency and metadata linkage.
- Idempotent retries do not duplicate delivery, settlement, facts, events, or receipts.
- Failures before or during commit remain retryable and leave no accepted event or receipt; a later retry succeeds exactly once.
- Replay rejects mutations to counts, selected values, windows, source/support/ability identifiers, Vortox metadata, night identity, and event uniqueness.
- Exact runtime-shape validation rejects missing, additional, sparse, cyclic, accessor, symbol, proxy, revoked-proxy, and non-plain payloads without invoking getters.
- Accepted historical projections are reconstructed from validated stored facts and remain stable after later caller-side mutation.
- Player and AI projections reveal only the source player’s selected count and omit canonical truth, supporting facts, role identities, reliability internals, and settlement-window details.
- Legacy Dreamer V2/V3/V4/V6 histories continue to rebuild exactly.
- No newly added path uses nondeterministic IDs, time, randomness, locale comparison, or environment-dependent ordering.
- Dreamer, Mathematician and Philosopher remain `PARTIAL`; Vortox remains `NOT_STARTED`. No incomplete role is marked `COMPLETE`.

ruleConsistencyChecks:
1. PASS — Every exercised domain behavior maps to identified external rule truth or an approved user override.
2. PASS — Every slice rule claim maps to explicit dynamic or structural regression coverage.
3. PASS — Partially implemented roles remain explicitly marked `PARTIAL`; no unsupported completeness claim was introduced.
4. PASS — Neither code nor documentation represents the bounded integration slice as complete role support.
5. PASS — Scheduling and settlement respect the independently verified official night order.
6. PASS — Current decisions use current settlement state, while delivered knowledge and replay projections preserve historical accepted facts.
7. PASS — Drunk/poisoned ineffectiveness, Vortox false-information behavior, and Storyteller/deterministic legal-choice boundaries are not collapsed into a single simplified boolean.
8. PASS — Rule revisions, source dates/revisions, hashes, user overrides, and the PR #45 infrastructure supersession are recorded.
9. PASS — Passing tests and CI supplement rather than replace independent rule-source validation.

ciReview:
- PR run `30011477353`, exact head `8cb921c5130454c90c0a63fc4b03a1d24f789b0f`: SUCCESS, 24/24 jobs.
- Push run `30011473350`, exact head, failed-jobs rerun attempt 2: SUCCESS, 24/24 final jobs.
- Attempt 1 had one genuine failure: `coverage shard (domain-core-rebuild)` job `89220398508`; dependent coverage merge was skipped while all unrelated jobs remained successful.
- Attempt-1 diagnostic collection recorded the original failed outcome and uploaded artifact `8565272957`. The recorded failure was the frozen Witch replay test timing out at 5,000 ms after approximately 5,215.867 ms, with 206/207 completed tests, one `onTaskUpdate`, no `coverage-final`, and failed diagnostic payload SHA-256 `2e9953be…7d5`.
- Attempt 2 reran only the failed shard and its dependent coverage merge. The Witch test completed in approximately 4,720 ms, domain-core finished 207/207, and the rerun emitted `coverage-final` size 3,310,822 with SHA-256 `cc643f31…a12`.
- Rerun diagnostic artifact `8583919248` and coverage-blob artifact `8583919637` were verified against the run/head/log chain.
- The final coverage merge downloaded all 11 required blobs and reported 1,544/1,544 inventory and union entries, with zero missing, duplicate, or unexpected entries.
- Ordinary tests remain 1,544/1,544; Windows application inventory remains 285.
- The exact approved profile was `phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2`, ending in `COVERAGE_APPROVED_PROFILE_MATCH`.
- PR #45’s infrastructure-only 11-group topology change had independently passing code/rule reviews and H2/H3/H4 hosted evidence. It changed no game production, test identity, fixture, timeout, dependency, threshold, ownership, or rule semantics.
- CI actually executes the claimed typecheck, lint, ordinary-test, Windows-group, coverage-group, manifest, ownership, and coverage-merge checks.

remainingBlockers: []

codeVerdict: CODE_REVIEW_PASS  
ruleVerdict: RULE_REVIEW_PASS
<!-- END VERBATIM ORIGINAL COMMENT BODY -->
