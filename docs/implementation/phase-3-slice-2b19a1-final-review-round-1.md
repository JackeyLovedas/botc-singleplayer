reviewedPR: `https://github.com/JackeyLovedas/botc-singleplayer/pull/33`

reviewedHead: `292d4e0dc4d718d2f03928e037eaddf9daed4349`

reviewTimestamp: `2026-07-16T15:59:17.2798149+08:00`

reviewScope:

- Frozen PR #33 diff, commit, PR body, branch state, exact-head CI, production code, tests, rule evidence, frozen design, design review, traceability, coverage matrix, implementation status, and control records.
- Governance authorities: `AGENTS.md`, the complete user authorization attachment, reachability/trust ADR, 2B19A1 go/no-go assessment, and `REVIEW_PROTOCOL.md`.
- R1: current base Dreamer V2 opportunity opening, accepted replay, idempotency, duplicate protection, and receipt-free unsupported submission.
- R2: V1-plan/V1 opportunity and V2-plan/legacy-V1 opportunity compatibility.
- R3: malformed payload, canonical identity, source provenance, duplicate and mixed-generation rejection.
- R4: target, delivery, candidates, Vortox, impairment information, ledger outcome, V2 private knowledge, and gained Dreamer execution remain unsupported.
- T1/T2/T3 exact-shape, provenance, deterministic identity, replay, privacy, persistence, and failure-boundary review.
- Stop-loss: exactly two changed production files and 480 added production lines.

productionFilesReviewed:

- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/projections/src/index.ts`
- `packages/application/src/command-result.ts`

testFilesReviewed:

- `packages/application/src/game-application-service.test.ts`
- `packages/application/src/mathematician-test-fixtures.ts`
- `packages/domain-core/src/seamstress.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- Local targeted execution: 15 matching 2B19A1/gained/hostile/idempotency tests passed.
- Exact-head full CI execution: 33 files / 1432 tests and single-fork coverage passed on both push and pull-request runs.

ruleEvidenceReviewed:

- `docs/rules/evidence/2B19A1.md`, SHA-256 `505456357b498c063e8d579aaabef025fd7cb5437f11264915cd810b470da4e6`, terminal `RULE_READY`, coverage `SKELETON`, unresolved conflicts `[]`.
- `docs/rules/USER_OVERRIDES.md`, SHA-256 `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`; no base Dreamer opening override applies.
- Official Dreamer Wiki `oldid=2904`, revision `2025-09-24T08:39:30Z`, independently retrieved wikitext SHA-256 `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`.
- Chinese Wiki 筑梦师 `oldid=3046`, revision `2023-04-18T04:58:54Z`, independently retrieved through the documented equivalent live endpoint; wikitext SHA-256 `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`.
- Official nightsheet commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`, independently retrieved byte SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`; first-night indexes Philosopher 13, Clockmaker 59, Dreamer 60, Seamstress 61; other-night Dreamer 78.
- `docs/rules/ROLE_COVERAGE_MATRIX.md`, current SHA-256 `cfab1109876b86ab5399bcd0c006a3a646517e2f5a6a35023a7a42d5606b4508`; Dreamer remains honestly `PARTIAL`.
- Frozen design `docs/implementation/phase-3-slice-2b19a1-design.md`, SHA-256 `1526a95bcdb7c4d1288a457b068f3fb632d76cebdcc805629469f26310a427dc`.
- Design review `docs/implementation/phase-3-slice-2b19a1-design-review-round-1.md`, SHA-256 `602d27c6153edfa96d0d06b17cfe96607177ced79337691e37e65e1355804d16`, verdict `RULE_DESIGN_PASS`.
- `docs/implementation/phase-3-slice-2b19a1-status.md`
- `docs/implementation/phase-3-slice-2b19a1-test-traceability.md`

PRBodyReviewed:

- Required sections are present: Scope, Governance Classification, R1/R2/R3/R4, T1/T2/T3, Rule Evidence, Rule Claims Implemented, Explicitly Unsupported Rules, Rule Source Revisions, Frozen Design, V1 Compatibility, V2 Opportunity Contract, Canonical Identity, Base Source Contract, Application Behavior, Replay, Submit Fail-Closed, Projection Non-Effect, Ledger Non-Effect, Rule-to-Test Traceability, Tests, CI, and Explicitly Out of Scope.
- Rule revisions and unsupported mechanisms are recorded honestly.
- The PR body’s CI paragraph still says exact-head CI is pending; live exact-head CI is higher-authority evidence and is successful. This stale lower-authority wording is not the blocker below.

CIReviewed:

- Push CI `29480909501`: event `push`, head SHA `292d4e0dc4d718d2f03928e037eaddf9daed4349`, conclusion `SUCCESS`.
  - Ubuntu `validate`: typecheck, lint, ordinary tests, and coverage all succeeded.
  - Windows deterministic job succeeded, including role-action and Dreamer tests.
- Pull-request CI `29480985744`: event `pull_request`, head SHA `292d4e0dc4d718d2f03928e037eaddf9daed4349`, conclusion `SUCCESS`.
  - Ubuntu `validate`: typecheck, lint, ordinary tests, and coverage all succeeded.
  - Windows deterministic job succeeded.
- Local HEAD, remote feature branch, and PR HEAD all equal `292d4e0dc4d718d2f03928e037eaddf9daed4349`.
- Worktree is clean and PR is open, non-draft, and mergeable.

findings:

- severity: `BLOCKER`
  evidence: |
    Frozen design completion criteria 5, 8, 9, 10, and 14 require specific primary-authority security/provenance matrices. The committed tests do not exercise the full frozen contracts they claim:
    
    - `[2B19A1-05/14]` checks six payload mutations plus accessor, symbol, cycle, and Proxy cases, but does not cover every missing/extra/wrong literal across the top-level V2 payload, nested source contract, and visibility contract; it also omits the frozen top-level null/array/nonplain and sparse-array payload cases.
    - `[2B19A1-08/10]` proves only the positive canonical builder result. It does not perform the frozen per-field task/player/seat/role/revision source-fact tampering or reject gained/alias ability-instance identities through that seam.
    - `[2B19A1-09]` directly calls the payload validator with wrong carried tenure/instance/revision strings. It does not run the frozen hostile event-replay cases for missing, duplicate, ended, wrong-player, wrong-seat, wrong-role, and wrong-revision tenure state.
    
    Existing 2B19T tenure tests validate the shared tenure API, and the reviewed implementation appears fail-closed, but those tests do not replace the explicitly frozen 2B19A1 cross-binding and event-replay authority. Consequently, `phase-3-slice-2b19a1-test-traceability.md` and the PR body’s claim that criteria 1–19 all pass overstate the exact frozen test evidence.
  affectedReachabilityTrust: `R1/R3; T1/T2`
  basis: `ADR final-review bases A and G — frozen design authority-test contract is not fully implemented, and traceability claims more coverage than the named tests exercise.`
  disposition: |
    Add bounded tests only for the missing exact-shape, source cross-binding, canonical ability-instance, and hostile tenure replay cases; update traceability and PR prose to match actual authority. No production redesign or R4 expansion is required. Any repair commit requires fresh exact-head push/PR CI and a new complete independent final review.

codeVerdict: `CODE_REVIEW_FIX_REQUIRED`

ruleVerdict: `RULE_REVIEW_PASS`

remainingBlockers:

- `FROZEN_2B19A1_PRIMARY_AUTHORITY_TEST_MATRIX_INCOMPLETE`

backlogHigh: `[]`

backlogNormal:

- `Future review preparation should update the PR CI section before branch freeze so the lower-authority PR body does not retain a historical “pending” statement after exact-head CI has completed.`
