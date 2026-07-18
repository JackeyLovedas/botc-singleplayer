# Complete Independent Final Review — PR #40 / Phase 3 Slice 2B19A3B1

## reviewedPR

- PR: `#40`
- URL: https://github.com/JackeyLovedas/botc-singleplayer/pull/40
- Base: `45a467cec81703d911914de464180e5192fc7714`
- Reviewed head: `17472c7d2ac3d7bd52f5a9f0713fcd94b2f5f78d`
- Product implementation commit: `00160fc342487506f33d713667d404d4ace734c4`
- PR state at review: `OPEN`
- Worktree: clean

## reviewedHead

`17472c7d2ac3d7bd52f5a9f0713fcd94b2f5f78d`

## reviewTimestamp

`2026-07-18T23:46:12.3214273+08:00`

## reviewScope

The review independently covered:

- The complete 24-file PR diff from the accepted base through the frozen head.
- All five changed production files.
- All three changed test files and relevant replay, batch, ledger, and ownership support tests.
- `AGENTS.md`, `AUTOPILOT_PROMPT.md`, `REVIEW_PROTOCOL.md`, current task/state documents, architecture/governance authority, both design rounds and reviews, traceability, coverage profile, rule evidence, user overrides, and role coverage matrix.
- Exact runtime shapes, hostile canonical-data handling, prospective validation, atomic batches, event replay, receipts and idempotency, historical projection, deterministic identifiers/order, information boundaries, CI ownership, and coverage provenance.
- Live fixed-revision rule sources and the pinned official nightsheet.
- Exact-head GitHub CI and local focused tests.

Exact-head CI was green:

- Push CI `29650271580`: success, 22/22 jobs.
- PR CI `29650302623`: success, 22/22 jobs.
- Both runs were bound to `17472c7d2ac3d7bd52f5a9f0713fcd94b2f5f78d`.

Independent local focused execution passed:

- 3 files.
- 160 tests.
- Worktree remained clean.

Coverage-profile verification also succeeded for all three candidate manifests, each with `9/9` shards and `1494/1494` tests. These green results do not close the missing frozen-design test mechanisms identified below.

Nine rule-consistency checks:

1. Domain behavior traceable to rule claims: **failed** because several traceability entries claim replay/fault mechanisms that their bound tests do not execute.
2. Every rule claim has the required corresponding test: **failed** for the frozen replay, failure/retry, compatibility, ledger, evidence, and event-boundary matrices.
3. Unsupported mechanisms remain `PARTIAL`: passed.
4. No incomplete mechanism is presented as complete: **failed** in test-traceability documentation, which records absent mechanisms as `PASS`.
5. Night order agrees with the official nightsheet: passed.
6. Historical/current state is selected correctly in reviewed production behavior: passed.
7. Drunkenness, poisoning, Vortox, and Storyteller discretion are not incorrectly simplified within the bounded production scope: production semantics passed, but required hostile/replay proof is incomplete.
8. Rule source revisions are recorded and reproducible: passed.
9. Green tests are not substituted for rule verification: **failed** because the green suite is being used alongside overstated mechanism bindings.

## productionFilesReviewed

- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/projections/src/index.ts`

The production implementation itself remained within the five-file allowlist. No new event version, canonical state field, shared evidence variant, generic impairment engine, nondeterministic ID source, or public trust-boundary expansion was found.

## testFilesReviewed

Changed test files:

- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

Relevant unchanged/supporting test authorities inspected:

- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- Ownership contracts and project bindings in `scripts/vitest-ownership-contracts.mjs`
- Coverage-obligation verification in `scripts/verify-coverage-obligations.mjs`
- CI execution topology in `.github/workflows/ci.yml`

## ruleEvidenceReviewed

Repository authorities:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19A3B1.md`
  - SHA-256: `ae48ce51ddbcd6ba3bae2dc49ab6441769e77c55f994aa8c2e043e98e58a2653`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/architecture/2B19A3B1-go-no-go-under-governance-v1.md`
  - SHA-256: `e566256966764d3fb53141ad0f2529b6ebe9005928b60454f497216a65911b1b`
- `docs/implementation/phase-3-slice-2b19a3b1-design-round-2.md`
  - SHA-256: `a0f11a05c2685355f2da454fcdc4ee8de6ff2421c56c695f87c0360612e205a0`
- `docs/implementation/phase-3-slice-2b19a3b1-design-review-round-2.md`
  - SHA-256: `1fbe40cc1344fd109338173df28ab2a9dbae9f1583b3143abc78275e6d191713`
- `docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md`
  - SHA-256: `643cac1cef626207757b8befbf9540cb60d48c9830a651233f8a11a4529fc92b`
- `docs/implementation/phase-3-slice-2b19a3b1-coverage-profile.md`
  - SHA-256: `ade23abc8224ef1415b386de585434ba93fdafb34bc3ec0da00248cb1f3346ae`

Live external authorities independently retrieved and checked:

- Official BOTC Wiki:
  - Dreamer, oldid `2904`
  - Philosopher, oldid `2421`
  - Vortox, oldid `3017`
  - Mathematician, oldid `3109`
  - States, oldid `1039`
- User-specified Chinese Wiki:
  - Dreamer, oldid `3046`
  - Philosopher, oldid `5125`
  - Vortox, oldid `6198`
  - Drunk, oldid `5720`
  - Mathematician, oldid `6214`
- Official nightsheet:
  - Repository revision `915347e627c3f6cd1f438f82b6001784e11b3e8b`
  - File-change revision `3d6d930a9e600321f93b2567a2e88948a675bc1e`
  - SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`

The live fixed-revision bodies matched the recorded evidence hashes. The sources support the bounded semantic result: Philosopher can make the in-play Dreamer drunk; an effective Vortox still forces false Townsfolk information; normal Dreamer information is one good and one evil character with one being correct. The approved simulator attribution override remains the authority for the single Vortox terminal fact plus one DRUNK impairment evidence reference.

## findings

### F-01 — Frozen hostile replay requirements are represented by pure-validator tests

- Severity: **BLOCKER**
- Trust boundary: `A`, `G`
- Files/symbols:
  - `docs/implementation/phase-3-slice-2b19a3b1-design-round-2.md`, criteria `C11–C16`, `C32`, `C41`, `S15`
  - `docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md`, corresponding `PASS` bindings
  - `packages/domain-core/src/dreamer.test.ts`, test beginning `[2B19A3B1-C06/C07/C11/.../C41-S01/.../S20] validates only the exact deterministic V4 contract`
- Failure scenario:
  - The frozen design requires cloning accepted V4 streams, mutating persisted impairment or Vortox provenance, and then exercising replay/rebuild rejection.
  - The bound test instead passes synthetic payloads directly to the V4 validator or pure capability resolver.
  - `S15` specifically requires partial, orphaned, duplicate, reordered, split, cross-batch, noncontiguous, and mixed-generation persisted batches to be rejected atomically. The bound test does not construct or replay such batches.
  - Consequently, a defect in accepted-history envelope validation, batch recognition, rebuild ordering, or projection suppression could survive while the pure payload validator remains green.
- Required correction:
  - Add actual accepted-stream clone/mutation/rebuild tests using persisted accepted V4 events and the real replay/rebuild boundary.
  - Update traceability mechanism/layer and `MechanismMatch` only after those tests exist.
- Required regression tests:
  - Wrong impairment ID.
  - Wrong affected player, seat, or role.
  - Wrong Philosopher source player, selected role, tenure, or revision.
  - Duplicate DRUNK provenance.
  - DRUNK plus POISONED conflict.
  - Independent semantic V4 carrier mutations.
  - Wrong Vortox player, seat, tenure, revision, or catalog linkage.
  - Partial, orphaned, duplicate, reordered, split, cross-batch, noncontiguous, and mixed-generation V4 event batches.
  - Every mutation must fail replay/rebuild closed and produce no ledger or projection output.

### F-02 — Frozen V4 failure/retry matrix is absent

- Severity: **BLOCKER**
- Trust boundary: `A`, `G`
- Files/symbols:
  - `docs/implementation/phase-3-slice-2b19a3b1-design-round-2.md`, `C28` and `C29`
  - `docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md`, `C28` and `C29`
  - `packages/application/src/game-application-service.test.ts`
    - `[2B19A3B1-C18/C28] keeps canonical DRUNK without effective Vortox receipt-free, OPEN, and retryable`
    - `[2B19A3B1-C01/.../C29/C36/C39] accepts exact GOOD and EVIL V4 chains without leaking audit metadata`
- Failure scenario:
  - Frozen `C28` requires real V4 dependency, metadata, prospective-validation, append, commit, and receipt fault injection with stage-correct atomic outcomes.
  - The bound `C28` test only covers the intentionally unsupported “canonical DRUNK without effective Vortox” precommit capability path.
  - Frozen `C29` requires a retryable failure, dependency repair, identical-command success exactly once, and a post-success idempotent retry.
  - The bound success test starts with success and only verifies the post-success duplicate retry. It never executes failure → repair → identical success.
  - V3 fault tests do not prove the newly introduced V4 constructor, provenance, or ledger path.
- Required correction:
  - Add V4-specific application-service fault injection for every frozen stage.
  - Prove exact version, event-stream, opportunity, receipt, error-code, failure-stage, and retryability behavior.
  - Exercise the complete failure → repair → identical command success → post-success idempotent retry sequence.
- Required regression tests:
  - Dependency lookup failure.
  - Candidate/construction failure.
  - Metadata failure.
  - Prospective replay/validation failure.
  - Append failure.
  - Commit failure.
  - Receipt persistence failure.
  - Each pre-success failure leaves no partial V4 semantic batch or receipt.
  - After repair, the identical command commits exactly one target V2 + delivery V4 + settlement batch and one receipt.
  - A later identical retry appends nothing.

### F-03 — Legacy replay, event-envelope, evidence, and ledger matrices are overstated

- Severity: **BLOCKER**
- Trust boundary: `A`, `G`
- Files/symbols:
  - Frozen criteria `C08`, `C30`, `C36`, `S14`, `S16`, `S17`
  - `docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md`
  - `packages/domain-core/src/dreamer.test.ts`, `[2B19A3B1-C08-S09/S10/S11/S14/S17/S18] fails hostile inputs closed and keeps every version clone/equality isolated`
  - `packages/application/src/game-application-service.test.ts`, positive V4 integration test
- Failure scenario:
  - `C08` requires accepted A3A V3 history to replay/project with zero DRUNK evidence.
  - `C30` requires valid V1, V2, and V3 histories to rebuild and project exactly.
  - The cited domain test only checks in-memory clone/equality isolation among payload variants.
  - `C36` requires hostile ledger/fact mutation plus rebuild/validation for exact V3 and V4 evidence cardinalities. The cited positive application test verifies the accepted V4 result but not the frozen mutation matrix or an actual V3 rebuild.
  - `S14` requires malformed target/delivery/settlement event envelopes, IDs, metadata, and revisions to fail at event/batch validation.
  - `S16` requires the exact existing DRUNK evidence to pass the evidence validator/canonicalizer while field, duplicate, and conflict mutations fail.
  - `S17` requires a direct terminal fact/ledger matrix covering keys, audit identity, source, task, ability instance, semantic triple, and evidence ordering.
  - Clone/equality and top-level V4 payload validation do not exercise those authorities.
- Required correction:
  - Add accepted-history rebuild/projection tests for V1, V2, and V3.
  - Add direct event-envelope/batch, impairment-evidence, and terminal-fact/ledger validation matrices.
  - Correct traceability rows so their named layer and mechanism match the code actually executed.
- Required regression tests:
  - Valid V1/V2/V3 histories rebuild and project without reinterpretation.
  - Accepted A3A V3 yields zero DRUNK impairment evidence.
  - V4 yields exactly one DRUNK impairment reference and the frozen total evidence count.
  - Mutated V3/V4 fact or ledger sets reject.
  - Malformed target, delivery, or settlement envelopes and revisions reject.
  - Wrong evidence keys/values, duplicate evidence, conflicting evidence, wrong audit/source/task/ability-instance/triple/order all reject.

### F-04 — The frozen PR body is stale

- Severity: **BLOCKER**
- Trust boundary: `G`
- File/symbol: live PR #40 body, `Final Review Gate`
- Failure scenario:
  - The PR body still records `Current state: WAITING_CI` and describes exact-head push and PR CI as future gates.
  - Both exact-head CI runs had already succeeded before this review.
  - AGENTS requires the complete PR body to be finalized before branch freeze and review, and the parent task requires current PR metadata to be accurate.
- Required correction:
  - Reconcile the PR body with the exact run IDs, statuses, reviewed head, and current review-fix-required state before the next frozen review.
  - Do not claim either final pass verdict.
- Required regression tests:
  - No code test is needed.
  - Re-read the live PR body and verify its HEAD, CI provenance, state, scope, evidence hashes, unsupported rules, and traceability claims against the corrected repository state.

## codeVerdict

`CODE_REVIEW_FIX_REQUIRED`

## ruleVerdict

`RULE_REVIEW_FIX_REQUIRED`

## remainingBlockers

- `F-01_FROZEN_HOSTILE_REPLAY_MECHANISMS_NOT_EXECUTED`
- `F-02_V4_FAILURE_REPAIR_RETRY_MATRIX_MISSING`
- `F-03_LEGACY_EVENT_EVIDENCE_LEDGER_MATRICES_MISSING`
- `F-04_PR_BODY_STALE_AFTER_EXACT_HEAD_CI`

## overallDecision

`FIX_REQUIRED`
