# Phase 3 Slice 2B19B Complete Independent Final Review

- `reviewedPR`: `#41` — https://github.com/JackeyLovedas/botc-singleplayer/pull/41
- `reviewedHead`: `5256216b22e62dbb992d1a678dfc9c597b5227c7`
- `reviewTimestamp`: `2026-07-19T18:57:58+08:00`
- `reviewScope`: Independent read-only CODE and RULE review of frozen Phase 3 Slice 2B19B, including source revisions, rule evidence, approved Round 2 design, production implementation, changed and compatibility tests, 80-row traceability, Vitest ownership/profile contracts, PR body, and exact-head CI.

## productionFilesReviewed

1. `packages/application/src/game-application-service.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/dreamer.ts`
4. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
5. `packages/domain-core/src/first-night-action-opportunity.ts`
6. `packages/projections/src/index.ts`

The product change contains exactly six production files and 1,110 added production lines.

## testFilesReviewed

1. `packages/application/src/game-application-service.test.ts`
2. `packages/domain-core/src/dreamer.test.ts`
3. `packages/domain-core/src/first-night-action-opportunity.test.ts`
4. `packages/domain-core/src/rebuild.test.ts`
5. `scripts/vitest-ownership-contracts.mjs`
6. `scripts/verify-vitest-ownership-contracts.mjs`
7. `scripts/verify-coverage-obligations.mjs`
8. `vitest.workspace.ts`
9. `.github/workflows/ci.yml`
10. `docs/implementation/phase-3-slice-2b19b-test-traceability.md`

## ruleEvidenceReviewed

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19B.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b19b-design-round-2.md`
- `docs/implementation/phase-3-slice-2b19b-design-review-round-2.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/architecture/2B19B-go-no-go-under-governance-v1.md`
- Chinese Wiki revisions for the home page, Philosopher, Dreamer, Vortox, Drunk, and Poison
- Official BOTC Wiki revisions for Philosopher, Dreamer, Vortox, States, and Abilities
- Official nightsheet revision `915347dc475d4018e62c2cf54a9d4165565212d4283013cbe83c6d53e11b3e8b`

All live-source hashes independently retrieved on 2026-07-19 matched the revisions and SHA-256 values recorded in `2B19B.md`. No unresolved external-rule conflict was found.

## Exact-head and CI evidence

- Local HEAD, remote feature branch, and PR HEAD all equal `5256216b22e62dbb992d1a678dfc9c597b5227c7`.
- Base `origin/main`: `5ddaa2fd02e0cb73e2a5363b222e7f08c353d389`.
- Worktree: clean.
- `git diff --check origin/main...HEAD`: passed.
- Push CI: run `29683875777`, exact reviewed HEAD, `SUCCESS`, 22/22 jobs.
- PR CI: run `29683914351`, exact reviewed HEAD, `SUCCESS`, 22/22 jobs.
- Ownership verifier: 22/22 contracts passed.
- Frozen coverage profile: `phase-3-slice-2b19b-84aebe5-ownership-v2-1`.
- All three profile candidates reported 9/9 shards, 1509/1509 test executions, and identical inventory, ownership, and coverage-obligation identities.
- The profile-only child differs from its product parent by one workflow selector token.

Green CI does not close the review findings below.

## findings

### F01 — BLOCKER: Physical test identities violate the single-primary-layer traceability contract

`docs/implementation/phase-3-slice-2b19b-test-traceability.md` assigns the same physical test identity—same file and exact title—to multiple primary layers.

Examples include:

- The application bridge test is assigned as accepted-stream integration, hostile replay, application command, projection, and structural authority.
- The Dreamer payload test is assigned as accepted-stream integration, pure policy, structural validation, and cross-platform authority.
- The opportunity test is assigned as both pure-policy and structural authority.

The governance ADR requires each physical test identity to have exactly one primary layer. Assertions supporting other criteria must be recorded as supporting evidence, or the physical test must be split. The ownership verifier passing does not validate this semantic constraint.

Required repair:

- Give every physical test identity exactly one primary layer.
- Split tests where separate primary assertions require different layers.
- Rebind all affected C/S rows and rerun ownership, profile selection, full gates, and exact-head CI.

### F02 — BLOCKER: Required accepted-stream authorities are direct domain tests mislabeled as accepted stream

The following rule-critical rows claim `ACCEPTED_STREAM_INTEGRATION`, but their bound tests directly construct inputs and call domain creators/resolvers without `GameApplicationService`, canonical append, replay/rebuild, receipt handling, or projection:

- C20: settlement-time target truth.
- C21/C22: exact gained V5/V6 results.
- C24-C26: normal and Vortox truth-value behavior.
- C31: source DRUNK/POISON unsupported behavior.

For example, the C20-bound test manually creates `CurrentCharacterStateSet`; the C21/C22/C24-C26 test uses `gainedDreamerFacts`; and C31 directly calls `resolvePhilosopherGainedDreamerCapability`. These are useful pure/structural tests, but they are not accepted-stream primary authorities.

Consequently, `MechanismMatch=PASS` is false for these rows. The production logic appears consistent with the approved rules, but the frozen rule-to-test proof required for final acceptance is absent.

Required repair:

- Add or bind genuine accepted-stream tests for both GOOD and EVIL targets, V5 normal information, V6 Vortox-forced false information, settlement-time target truth, and source impairment non-selection.
- Retain the direct tests under their correct pure or structural layer.

### F03 — BLOCKER: Several frozen completion claims are absent or bound to the wrong assertions

Confirmed gaps:

- C04/C05 claim canonical task/grant ID formatter-parser round trips, but the bound opportunity test only validates preconstructed strings and cross-field equality.
- C09 claims no synthetic Dreamer tenure, but its bound opening test does not inspect tenure history or assert the absence of a Dreamer tenure.
- C10 claims the stored opportunity transitions from OPEN to CLOSED, but the bound settlement tests only assert OPEN before settlement and do not inspect the same stored opportunity afterward.
- C16 is registered as hostile replay rejection, but its test passes `records: []` directly to the capability resolver; it does not mutate an accepted prefix or exercise replay/rebuild rejection.
- C18’s actual missing-target application rejection exists under a different test title than the registered primary authority.
- C58 claims the next task is the unsettled Mathematician task and that no Mathematician result/event is emitted after gained-Dreamer settlement. Its bound bridge test establishes ordering before settlement but does not assert both post-settlement conditions.

Required repair:

- Add the missing exact assertions or correct the bindings.
- Exercise accepted-prefix mutation and replay/rebuild for C16.
- Do not mark the affected rows `PASS` until their registered physical authorities prove the frozen mechanism.

### F04 — BLOCKER: The frozen C51-C53 fault and retry matrix is incomplete

The gained-Dreamer bridge test covers receipt read, event load, metadata access, prospective mutation, failure before commit, failure during commit, recovery, and retry/idempotency.

It does not cover all frozen real-port failure points claimed by C51-C53:

- canonical state-rebuild failure on the gained command path;
- accepted-receipt persistence failure;
- rejected-receipt write failure for deterministic gained-command rejection.

An unrelated hostile persisted-stream test is not the specified R1 fault injection. Existing older-slice tests can only count if explicitly registered as supporting authorities and if their mechanism is identical; the current traceability does neither.

Required repair:

- Add the missing real-port cases or bind valid existing supporting authorities explicitly.
- Verify atomicity, no partial canonical append, deterministic recovery, and idempotent retry for every frozen fault point.

### F05 — BLOCKER: S20’s cross-platform/static-audit authority is false

S20 binds the combined V3/V5/V6 payload test and claims stable raw-ID ordering plus a static forbidden-source scan. That test reverses catalog inputs and validates payloads, but it does not inspect production source.

The separate existing source scan only checks `localeCompare` and `Intl.Collator`; it does not establish the complete frozen prohibition against `Date.now`, `Math.random`, random UUID generation, locale-dependent ordering, or insertion-order dependence.

Required repair:

- Add a dedicated S20 static audit with an exact, reviewable forbidden-source set.
- Give it a unique physical test identity and correct primary layer.
- Keep behavioral ordering checks separate from static source inspection.

### F06 — BLOCKER: Frozen control and PR acceptance metadata are stale

The exact-head CI is complete, but the committed control record still describes an earlier pre-push state:

- `docs/implementation/phase-3-slice-2b19b-status.md` says `PROFILE_ONLY_CHILD_PUSH_PENDING` and that push, PR creation, exact-Q CI, and final review remain pending.
- `docs/agent-loop/AUTOPILOT_STATE.json` still exposes stale top-level values including `currentPR=null`, `designRound=1`, `ruleDesignPass=false`, and `implementationAuthorized=false`.
- The PR body contains all five required rule sections, but its CI language remains prospective and does not reconcile the completed exact-head push and PR runs.

These records are part of the frozen review scope and cannot simultaneously be authoritative with the actual PR/CI state.

Required repair:

- Reconcile the control files and PR body to the real PR, frozen HEAD, profile, and exact-head CI runs.
- Because any documentation commit changes HEAD, rerun exact-head CI and obtain a new complete independent final review.

## Frozen behavior assessment

The production implementation itself preserves the main approved behavioral boundaries:

- Base Dreamer opportunity/result schemas and legacy replay paths remain supported.
- Philosopher-gained Dreamer uses Philosopher as source role and Dreamer as ability role without creating synthetic Dreamer tenure.
- V4 opportunity, V5 normal result, and V6 Vortox-forced-false shapes are exact and source-bound.
- Normal information contains exactly one GOOD and one EVIL role with exactly one truthful role.
- Vortox information makes both shown roles false.
- Native Dreamer DRUNK behavior remains isolated.
- Source Philosopher DRUNK/POISON remains unsupported/non-selecting.
- Settlement appends the intended atomic three-event batch.
- Ledger behavior uses the existing 11/13 variants without duplicate outcome events.
- Player/AI projection exposes the intended three-key source summary and rejects state-only V5/V6 use.
- Formal legacy gained V1 settlement remains receipt-free and unsupported.
- No role was promoted to `COMPLETE`.

These code observations do not override the missing and falsely classified acceptance evidence.

## codeVerdict

`CODE_REVIEW_FIX_REQUIRED`

## ruleVerdict

`RULE_REVIEW_FIX_REQUIRED`

## remainingBlockers

1. `F01_SINGLE_PRIMARY_LAYER_TRACEABILITY_VIOLATION`
2. `F02_MISSING_ACCEPTED_STREAM_RULE_AUTHORITIES`
3. `F03_MISSING_OR_MISBOUND_FROZEN_ASSERTIONS`
4. `F04_INCOMPLETE_GAINED_COMMAND_FAULT_MATRIX`
5. `F05_S20_FALSE_STATIC_AUDIT_BINDING`
6. `F06_STALE_CONTROL_AND_PR_CI_METADATA`
