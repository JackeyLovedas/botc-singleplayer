# Phase 3 Slice 2B20AP2 PR #47 Final Review — Round 1

Archive status: `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_PASS`

The complete independent read-only reviewer output is preserved verbatim below.

<!-- BEGIN VERBATIM INDEPENDENT PR47 FINAL REVIEW ROUND 1 -->
reviewedPR: 47

reviewedHead: `c84b4a2bea37a270c048bee2d724a27f53d05aa6`

reviewTimestamp: `2026-07-28T03:37:12.8367671Z`

reviewScope:

- Independently reviewed the complete 40-commit, 56-file diff from base `167d800e20bed5431764092877085886df4b7c93` through frozen HEAD.
- Verified local HEAD, origin branch, and `refs/pull/47/head` all equal the reviewed HEAD; worktree is clean.
- Reviewed `AGENTS.md`, the complete `docs/agent-loop/REVIEW_PROTOCOL.md`, ordered project handoff, architecture, implementation status, active control files, PR body, production baseline, affected tests, infrastructure scripts, workflow, and live CI.
- PR is open, non-draft, mergeable, and GitHub reports `mergeable_state=clean`.
- Reviewed PR body SHA-256: `ee355c824b93e53c409039de9e556b3c208434dca089066d9af2f742c1ecdc8b` over 9,756 UTF-8 bytes. Required sections `Rule Evidence`, `Rule Claims Implemented`, `Explicitly Unsupported Rules`, `Rule Source Revisions`, and `Rule-to-Test Traceability` are present.
- No product production file changed. The two product test diffs change titles only; test bodies and assertions are unchanged.
- Package manifests, `pnpm-lock.yaml`, `vitest.workspace.ts`, dependencies, timeouts, coverage include, Vitest projects, logical groups, rules, and role matrix are unchanged.
- `git diff --check` reports only trailing Markdown hard-break whitespace in preserved historical review reports. This is style-only and not a finding.

productionFilesReviewed: []

unchangedProductionBaselinesInspected:

- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/mathematician.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/projections/src/index.ts`

infrastructureFilesReviewed:

- `.github/workflows/ci.yml`
- `scripts/run-vitest-logical-group.mjs`
- `scripts/verify-coverage-obligations.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `scripts/vitest-ownership-contracts.mjs`

testFilesReviewed:

- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

ruleEvidenceReviewed:

- `docs/rules/USER_OVERRIDES.md`, including `BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1`.
- `docs/rules/evidence/2B20AP2.md`
- `docs/rules/evidence/2B20A.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `project-handoff/rules/10-first-night-order.md`
- `project-handoff/rules/11-drunk-and-poisoned.md`
- `project-handoff/rules/12-information.md`
- `project-handoff/rules/15-character-changes.md`
- `project-handoff/rules/16-storyteller-discretion.md`
- `project-handoff/rules/18-roles.md`
- `project-handoff/rules/19-demons.md`
- `project-handoff/rules/20-interactions.md`
- Chinese Wiki fixed revisions: 首页 `5855`, 筑梦师 `3046`, 哲学家 `5125`, 醉酒 `5720`, 中毒 `6294`, 数学家 `6442`, 涡流 `6198`. Independently retrieved hashes match recorded evidence.
- Official BOTC Wiki fixed revisions: Dreamer `2904`, Philosopher `2421`, States `1039`, Rules Explanation `1310`, Glossary `2874`, Mathematician `3109`, Vortox `3017`. Relevant role semantics were independently checked; no conflict was found.
- Official nightsheet pinned commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`, last file-changing commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.
- Live nightsheet matched the pinned file. Relevant one-based positions remain Philosopher `14/11`, Dreamer `61/79`, Mathematician `77/96`, and Vortox other-night `47`.
- Role coverage remains Dreamer `PARTIAL`, Philosopher `PARTIAL`, Mathematician `PARTIAL`, and Vortox `NOT_STARTED`; no incomplete role is marked complete.

ruleConsistencyChecks:

1. Rule-claim traceability: pass. The AP2 change is preservation-only; the existing bounded 2B20A behavior remains mapped to primary authority tests.
2. Rule claims have corresponding tests: pass. Dreamer, Vortox, Philosopher impairment, Mathematician attribution, replay, projection, atomicity, receipts, and failure boundaries retain their authorities.
3. Unsupported rules remain explicit: pass. Poisoning, gained impairment variants, No Dashii, impaired/dead Vortox, unrestricted Storyteller discretion, Travellers, other-night behavior, and first-night completion remain outside the supported slice.
4. No false completeness: pass. Product behavior and the role matrix are unchanged.
5. Night order: pass against the independently checked official nightsheet.
6. Historical versus current state: pass. No product semantics changed; stored knowledge remains historical and replay/projection validation continues to reject reinterpretation from later character state.
7. Drunkenness, poisoning, Vortox flow, and Storyteller discretion: pass. No general mechanism was simplified. The user override remains limited to the fixed reachable Dreamer terminal fact and preserves Philosopher-produced DRUNK evidence.
8. Rule-source revisions: pass. Fixed revisions, hashes, retrieval dates, and nightsheet commit are recorded.
9. Green tests did not substitute for rule review: pass. External rule pages, overrides, nightsheet, evidence, and coverage matrix were independently read.

ciEvidence:

- Initial published HEAD `da43ad096fb8c738028f9da2aaaf052dd62282f2`:
  - Push run `30325116297`: attempt 1, success, 24/24 jobs, 21 unexpired artifacts.
  - Pull-request run `30325119014`: attempt 1, success, 24/24 jobs, 21 unexpired artifacts.
- Frozen reviewed HEAD `c84b4a2bea37a270c048bee2d724a27f53d05aa6`:
  - Push run `30325543672`: attempt 1, success, 24/24 jobs, 21 unexpired artifacts.
  - Pull-request run `30325545907`: attempt 1, success, 24/24 jobs, 21 unexpired artifacts.
  - Commit check-runs: 48 completed, 48 successful, zero non-success.
- Historical failed runs `30247984028` and `30248052689` remain attempt 1 at old HEAD `03a4184282cde5f972a9ccab94f36e3a2aa79ed5`; they were not rerun.
- Validate job confirms ownership self-test `37/37` and runner hostile self-test `36/36`.
- Ordinary aggregate: `AGGREGATE PASS 1572`.
- Coverage aggregate: `AGGREGATE PASS 1572`.
- New profile `phase-3-slice-2b20ap2-cc82a95-hosted-execution-v1` returns `COVERAGE_APPROVED_PROFILE_MATCH`; all five obligation counts and hashes match.
- Downloaded artifact inspection from final push run:
  - Dreamer ordinary: 3 physical blobs, 46 selected, 46 passed, complete, merge-eligible, zero discrepancies.
  - Dreamer coverage core: 2 physical blobs, 36/36, complete, merge-eligible.
  - Dreamer coverage gained: 1 physical blob, 10/10, complete, merge-eligible.
  - Windows: W1–W7 total `305`; W7 `46/46`; all exits zero, no signals, failed tests, global-error risk strings, missing identities, duplicates, intersections, or unexpected identities.
- Artifact inspection used a repository-external OS temporary directory. No CI was rerun.

findings:

1. severity: `BLOCKER`
   file/symbol: `docs/agent-loop/AUTOPILOT_STATE.json:3` root `detailedStatus` and `:4` root `disposition`; conflicting with `slice2B20AP2Gate` near line 2564 and the active blocker/action fields near lines 2950 and 4701.
   evidence: The canonical root still says `2B20AP2_CI_REMEDIATION_ROUND_2_COMPLETE_PENDING_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REREVIEW`. The AP2 gate, `currentDesignStatus`, `implementationStatus`, root/slice `remainingBlockers`, root/slice `requiredNextAction`, `CURRENT_TASK.md`, and `PROJECT_STATE.md` all say the local rereview has passed and the work has advanced to hosted checkpoint CI/final review.
   failureScenario: A controller consuming the canonical root status can re-enter the already completed local implementation rereview or report the wrong release stage, while another consumer reading the slice gate proceeds to final review. This recreates the active-control contradiction that the Round-1 implementation review required the AP2 repair to eliminate.
   requiredCorrection: Atomically synchronize the canonical root `detailedStatus` and `disposition` with the active AP2 gate and the other active status, blocker, and next-action fields. Recheck all four control documents and preserve prior statuses only as clearly historical records. Because this requires a new commit, run fresh exact-head CI and obtain a new complete independent final review for that new HEAD.
   requiredRegressionTests:
   - Add an invariant that compares root, `slice2B20AP2Gate`, `currentDesignStatus/currentDesignTerminal`, `implementationStatus`, active blocker lists, and required next actions.
   - Verify the current headings in `CURRENT_TASK.md` and `PROJECT_STATE.md` agree with the structured state.
   - Add a negative fixture where the root remains at “pending local rereview” while the slice is at hosted CI/final review, and require deterministic rejection.
   - Re-run JSON parsing, exact control-only diff/allowlist checks, exact-head CI, and the complete independent final review.

codeVerdict: `CODE_REVIEW_FIX_REQUIRED`

ruleVerdict: `RULE_REVIEW_PASS`

remainingBlockers:

- `CANONICAL_TOP_LEVEL_AP2_CONTROL_STATE_CONTRADICTION`

readOnlyStatement: No repository edit, commit, push, PR comment, merge, or CI rerun was performed.
<!-- END VERBATIM INDEPENDENT PR47 FINAL REVIEW ROUND 1 -->
