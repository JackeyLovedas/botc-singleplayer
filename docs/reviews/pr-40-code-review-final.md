# PR #40 Code Review Final Archive

- PR: `#40`
- Frozen feature HEAD: `2e3d47bbe6f3ee10353cab76d52f79f2ca5c4769`
- Merge SHA: `a77f6b6da60628a8166e439bda4520e249448876`
- Original comment ID: `5014387772`
- Original comment URL: `https://github.com/JackeyLovedas/botc-singleplayer/pull/40#issuecomment-5014387772`
- Original comment timestamp: `2026-07-19T04:50:20Z`
- Original comment updated timestamp: `2026-07-19T04:50:20Z`
- Original UTF-8 comment body bytes: `10511`
- Original UTF-8 comment body SHA-256: `564c3abbb2a3411ddfc5c812c8d6d34f95a70feb378340138e27babda62e36d5`

## Verbatim Original Comment Body

<!-- BEGIN VERBATIM ORIGINAL COMMENT BODY -->
<!-- BOTC_FINAL_CODE_REVIEW
reviewedHead=2e3d47bbe6f3ee10353cab76d52f79f2ca5c4769
-->
# Complete Independent Final Review — PR #40 / Phase 3 Slice 2B19A3B1 Repair Round 2

## reviewedPR

- PR: `#40`
- URL: https://github.com/JackeyLovedas/botc-singleplayer/pull/40
- State: `OPEN`
- Draft: `false`
- Base: `45a467cec81703d911914de464180e5192fc7714`
- Head: `2e3d47bbe6f3ee10353cab76d52f79f2ca5c4769`
- Branch: `phase-3/dreamer-vortox-canonical-drunk-core`
- Worktree: clean
- Repair round: `2 / 2`

## reviewedHead

`2e3d47bbe6f3ee10353cab76d52f79f2ca5c4769`

## reviewTimestamp

`2026-07-19T12:41:58.7235187+08:00`

## reviewScope

The independent review covered:

- The complete 26-file PR diff from base `45a467cec81703d911914de464180e5192fc7714` through the exact frozen head.
- All five changed production files, four changed test files, supporting replay/ledger/batch tests, architecture, implementation status, ownership contracts, coverage verifier, workflow topology, and live PR metadata.
- `AGENTS.md`, `docs/agent-loop/REVIEW_PROTOCOL.md`, the active task/state/project records, the immutable first final review, Repair Round 1 changes, and Repair Round 2 changes.
- Exact runtime shapes, hostile canonical-data validation, prospective validation, atomic batch recognition, accepted-history replay, historical fact stability, idempotency and receipts, retryable failure boundaries, deterministic ordering and identifiers, projection privacy, AI information boundaries, negative tests, documentation, test ownership, coverage-profile selection, and whether CI executes the claimed gates.
- Independent live retrieval of the fixed-revision official and Chinese rule sources and the official nightsheet. No snapshot fallback or model-memory rule inference was used.
- Re-evaluation of every historical F01–F04 blocker.
- Repair Round 2’s Windows-only test-structure change, exact ownership/profile preservation, and exact-head CI.

Exact-head CI:

- Push run `29673297570`: `SUCCESS`, 22/22 jobs, attempt 1.
- Pull-request run `29673298371`: `SUCCESS`, 22/22 jobs, attempt 1.
- Both runs are bound to `2e3d47bbe6f3ee10353cab76d52f79f2ca5c4769`.
- Both runs executed validation, nine ordinary-test shards and merge gate, nine coverage shards and merge gate, and the Windows deterministic job.
- The current PR body records the exact head, both run IDs, Repair Round 2 exhaustion, unsupported scope, source revisions, rule-to-test traceability, and `READY_FOR_COMPLETE_INDEPENDENT_FINAL_REVIEW`.
- The independently computed live PR-body SHA-256 is `96c846618a2c8ddd7335841f0f9a98df0f3a0911e686131bff3120145365e82e`.

Independent local verification:

- A3B1 focused execution: 4 files, 11 tests passed.
- Repair Round 2 Seamstress same-title test: 1 test passed; all four actor cases retained independent stores/services.
- Ownership verifier self-test: 22/22 passed.
- Exact-profile verifier: all three candidates returned `COVERAGE_APPROVED_PROFILE_MATCH`.
- `pnpm typecheck`: passed.
- `git diff --check`: passed.
- Worktree remained clean.

Repair Round 2 audit:

- `c384c60add75211bd20139b9e289da8fd6e15bb5` changes only the same existing Seamstress actor test from serial iteration to `Promise.all`.
- The test title, test count, assertions, actor cases, and per-case isolated `MemoryCommandCommitStore` and service instances remain unchanged.
- No timeout, per-test timeout, `onTaskUpdate`, dependency, workspace, workflow topology, production code, rule behavior, event, ledger, projection, receipt, or ownership assignment changed.
- Profile-only child `2e3d47bbe6f3ee10353cab76d52f79f2ca5c4769` records the exact Repair Round 2 source profile.
- Three candidates each passed 9/9 shards and 1499/1499 tests with identical inventory, ownership identities, and obligation five-tuple.
- The exact profile selector remains fail-closed and uniquely selects the requested current profile.

Historical blocker closure:

- F01 is closed: real accepted V4 streams are cloned and mutated, then rejected by rebuild, accepted-stream projection, and persisted-import boundaries. The direct capability authority separately verifies duplicate DRUNK and DRUNK-plus-POISONED conflict classification.
- F02 is closed: dependency, candidate construction, metadata, prospective validation, append, commit, and receipt-persistence faults each prove atomic failure, dependency repair, identical-command single success, one receipt, and later idempotent retry without append.
- F03 is closed: accepted V1/V2/V3 histories retain their exact generations; legacy projection remains bounded; V3 has zero DRUNK evidence; V4 has exactly one; event-envelope, evidence, terminal-fact, ledger, clone, rebuild, and projection mutation matrices execute the claimed authorities.
- F04 is closed: the live PR body is reconciled to the exact current head and exact successful CI runs and does not claim either final verdict in advance.

Nine rule-consistency checks:

1. Every implemented domain behavior is traceable to a recorded rule claim: passed.
2. Every implemented rule claim has an executing corresponding test: passed.
3. Unsupported mechanisms remain explicitly `PARTIAL`, `NOT_STARTED`, or out of scope: passed.
4. No incomplete role or mechanism is represented as complete: passed.
5. First- and other-night ordering remains consistent with the official nightsheet: passed.
6. Character changes use the appropriate historical or current state; stored deliveries are not recomputed from later state: passed.
7. Drunkenness, poisoning, Vortox, and Storyteller discretion are not incorrectly collapsed within the bounded scope: passed.
8. Rule-source revisions, retrieval dates, and hashes are recorded and reproducible: passed.
9. Green tests were not used as a substitute for independent rule verification: passed.

## productionFilesReviewed

- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/projections/src/index.ts`

The production diff remains within the approved five-file allowlist and adds 406 production lines. No new event version, canonical state field, shared evidence variant, generic impairment engine, generic multi-cause ledger, nondeterministic identifier source, or expanded public trust boundary was found.

## testFilesReviewed

Changed test files:

- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

Supporting test and execution authorities reviewed:

- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-coverage-obligations.mjs`
- `.github/workflows/ci.yml`
- `vitest.workspace.ts`

The test authorities cover exact V4 shape and hostile inputs, real accepted V4 success, prospective reconstruction, atomic three-event batches, hostile persisted replay, seven failure/retry boundaries, legacy V1/V2/V3 compatibility, evidence and ledger mutation, projection privacy, stop-boundary behavior, deterministic candidate ordering, and Repair Round 2 Windows execution.

## ruleEvidenceReviewed

Repository rule and governance authorities:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19A3B1.md`
  - SHA-256: `ae48ce51ddbcd6ba3bae2dc49ab6441769e77c55f994aa8c2e043e98e58a2653`
  - Verdict: `RULE_READY`
  - Coverage: `PARTIAL`
  - Unresolved conflicts: none
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/architecture/2B19A3B1-go-no-go-under-governance-v1.md`
  - SHA-256: `e566256966764d3fb53141ad0f2529b6ebe9005928b60454f497216a65911b1b`
- `docs/implementation/phase-3-slice-2b19a3b1-design-round-2.md`
  - SHA-256: `a0f11a05c2685355f2da454fcdc4ee8de6ff2421c56c695f87c0360612e205a0`
- `docs/implementation/phase-3-slice-2b19a3b1-design-review-round-2.md`
  - SHA-256: `1fbe40cc1344fd109338173df28ab2a9dbae9f1583b3143abc78275e6d191713`
  - Verdict: `RULE_DESIGN_PASS`
- `docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md`
- `docs/implementation/phase-3-slice-2b19a3b1-coverage-profile.md`
- `docs/implementation/phase-3-slice-2b19a3b1-final-review-round-1.md`

Live official BOTC Wiki fixed revisions independently reviewed:

- Dreamer, oldid `2904`
- Philosopher, oldid `2421`
- Vortox, oldid `3017`
- Mathematician, oldid `3109`
- States, oldid `1039`
- Abilities, oldid `1376`

Live user-specified Chinese Wiki fixed revisions independently reviewed:

- 梦卜者, oldid `3046`
- 哲学家, oldid `5125`
- 涡流, oldid `6198`
- 醉酒, oldid `5720`
- 中毒, oldid `6294`
- 数学家, oldid `6214`

The Chinese 中毒 revision independently reproduced SHA-256 `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0`; the other fixed-revision bodies likewise matched their evidence hashes.

Official nightsheet independently reviewed:

- Repository revision: `915347e627c3f6cd1f438f82b6001784e11b3e8b`
- File-change revision: `3d6d930a9e600321f93b2567a2e88948a675bc1e`
- Recorded SHA-256: `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- First-night order remains Philosopher `14/80`, Dreamer `61/80`, Mathematician `77/80`; Vortox has no first-night wake entry.

The live sources and approved override support the implemented bounded semantics:

- Dreamer information remains one good and one evil character.
- Philosopher can cause the original in-play Dreamer to become drunk.
- A current effective Vortox forces Townsfolk information to be false even when the receiving Townsfolk is drunk or poisoned.
- The false pair excludes the settlement-time target truth while retaining Dreamer’s native GOOD/EVIL output categories.
- The approved simulator-only audit attribution records one Vortox abnormal terminal fact and one exact positive DRUNK impairment evidence reference.
- Philosopher-gained Dreamer settlement, formal combined Mathematician resolution, poisoned-Dreamer success, impaired/dead Vortox success, later-night behavior, and generic multi-cause attribution remain explicitly unsupported.
- Dreamer, Philosopher, and Mathematician remain `PARTIAL`; Vortox remains `NOT_STARTED`. No role is incorrectly marked `COMPLETE`.

## findings

[]

## codeVerdict

`CODE_REVIEW_PASS`

## ruleVerdict

`RULE_REVIEW_PASS`

## remainingBlockers

[]
<!-- END VERBATIM ORIGINAL COMMENT BODY -->
