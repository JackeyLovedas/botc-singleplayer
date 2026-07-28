# Phase 3 Slice 2B20AP2 Local Implementation Review — Round 1

Archive status: `INFRASTRUCTURE_IMPLEMENTATION_REVIEW_FIX_REQUIRED`

The complete independent read-only reviewer output is preserved verbatim below.

<!-- BEGIN VERBATIM INDEPENDENT LOCAL IMPLEMENTATION REVIEW ROUND 1 -->
reviewedHead: `73563e6ae6b53dd30bbe3eb674a33eace750c166`

reviewTimestamp: `2026-07-28T01:57:41.176Z`

reviewScope:

- Independent read-only local infrastructure implementation review for Phase 3 Slice 2B20AP2.
- Exact branch: `infra/2b20ap1-ownership-supersession-routing-v1`.
- Source commit: `cc82a95a258ad943e1d1a28b9c44ea51fe45bfa1`.
- Coverage-profile child: `da14b5dbdf705bc7776f1c83b799f07b0a29e405`.
- Review/archive commit: `73563e6ae6b53dd30bbe3eb674a33eace750c166`.
- Complete source, profile-child, and archive diffs reviewed against their exact parents.
- Remote PR #47 exists at stale head `03a4184282cde5f972a9ccab94f36e3a2aa79ed5`; it does not contain the reviewed AP2 commits and is not evidence for this local head.
- No writes, commits, pushes, PR changes, CI triggers, or merges were performed. Generated evidence directories were removed after review; final worktree is clean.

productionFilesReviewed: []

- AP2 changes no production files.
- Diff from product head `167d800e20bed5431764092877085886df4b7c93` confirmed no non-test `packages/` changes.

infrastructureFilesReviewed:

- `.github/workflows/ci.yml`
- `scripts/run-vitest-logical-group.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-coverage-obligations.mjs`
- `vitest.workspace.ts`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- AP2 implementation, profile-audit, profile-review, design-recovery, architecture, and review documents.

testFilesReviewed:

- No AP2 test-file or test-title diff.
- Current authority inputs and inventories for:
  - `packages/application/src/game-application-service.test.ts`
  - `packages/domain-core/src/rebuild.test.ts`
  - all 35 workspace test files through ordinary and segmented execution
  - embedded runner, ownership/H1, coverage-profile, and Windows verifier self-tests.

ruleEvidenceReviewed:

- `docs/rules/evidence/2B20AP2.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/architecture/2B20AP2-go-no-go-under-governance-v1.md`
- Complete AP2 design rounds, Design Release Appendix V1, Correction 1, replacement review, and `phase-3-slice-2b20ap2-rule-design-review-recovery.md`
- User authorization attachment, SHA-256 `936b0e66b4a6c82d3df4e9fcb5cb9c8eba7eb04dae909440c42cf7abf19bd6ba`
- Rules/product behavior and role coverage are preservation-only in this infrastructure slice.

gates:

- Governance router: completed; no additional skill or agent requested.
- Runtime: Node `24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`.
- Runner self-test: PASS `20/20`.
- Ownership/history self-test: PASS `37/37`.
- Accepted-history H1 direct verification:
  - accepted commit object available;
  - accepted head is an ancestor;
  - accepted blob OID exactly `0ff733004899f17ff82b20b40b0f41b888ba85d0`.
- Old coverage profile verifier: `COVERAGE_APPROVED_PROFILE_MATCH`.
- New AP2 profile verifier: `COVERAGE_APPROVED_PROFILE_MATCH`.
- Target ESLint: exit `0`.
- `pnpm typecheck`: exit `0`.
- Full `pnpm lint`: exit `0`.
- Full ordinary tests: PASS `35 files / 1572 tests`.
- Ordinary segmented authority: PASS `9 logical / 11 physical / 1572`.
- Coverage segmented authority: PASS `11 logical / 12 physical / 1572`; Dreamer core `36`, gained `10`.
- Generated coverage matched AP2 profile: `63 / 3217 / 23 / 3217 / 1808`, all tuple hashes exact.
- Windows inventory: PASS `305`, W1–W7 `9/90/52/73/9/26/46`.
- Windows real run and independent verify: PASS; all `onTaskUpdate`, timeout, and unhandled-risk counts zero.
- W7 physical segments: legacy `14`, 2B20A `22`, gained `10`; each exit `0`, `globalErrors=[]`, total `46/46`.
- Source/profile/archive allowlists: exact.
- All three commits contain required `Co-Authored-By: Codex GPT-5 <noreply@openai.com>`.
- Package, lockfile, workspace, TypeScript, ESLint, production, and AP2 test invariants: unchanged.
- Historical raw `pnpm test:coverage` was not rerun and was not treated as release authority.
- Hosted CI for this unpushed local head: unavailable/not run and not claimed.
- Final HEAD unchanged; worktree clean.

findings:

1. severity: `BLOCKER`

   file/symbol: `scripts/run-vitest-logical-group.mjs` — `buildLogicalManifest` lines 609–639, `verifyLogical` lines 642–659, `findLogicalManifests` lines 666–699, `aggregate` lines 901–945.

   failureScenario: Persisted evidence is trusted without revalidating its physical artifacts. After a successful ordinary `application` shard, I moved `.vitest-test/segmented/application/physical-blobs/application--full.blob` out of place. With the blob confirmed absent, this command still succeeded:

   `node scripts/run-vitest-logical-group.mjs verify --mode ordinary --logical-group-id application`

   Exact result: `ordinary/application: VERIFY PASS 465`, exit `0`, while `BLOB_EXISTS_DURING_VERIFY=False`.

   The verifier parses the prior segment envelope and trusts `mergeEligibility` and `taskEvidence`. Ordinary aggregation likewise trusts manifests and selected identities. Downloaded manifest IDs are also consumed without exact schema, frozen-ID, containment, and cross-link validation.

   requiredCorrection: Add one strict persisted-artifact validator used by local verification and both local/downloaded aggregation. Revalidate exact schemas and types, frozen physical IDs/order, path containment, regular-file/no-link status, blob/sidecar/singleton/coverage existence and hashes, command and artifact cross-links, process exit/signal/global errors, and computed eligibility. Ordinary aggregation must derive authority from revalidated artifacts rather than manifest-selected identities alone.

   requiredRegressionTests:

   - missing, renamed, corrupt, extra, symlinked, and junction-backed physical blobs;
   - tampered envelope eligibility, hashes, IDs, process result, global errors, and cross-links;
   - manifest extra/traversal IDs and altered selected identities;
   - hostile downloaded/incoming artifact layouts;
   - each case must fail nonzero with the frozen deterministic failure code.

2. severity: `BLOCKER`

   file/symbol: `docs/agent-loop/AUTOPILOT_STATE.json` — canonical top-level active state, including lines 3407–3409, 3832–3834, and 4615–4618.

   failureScenario: A normal JSON parse returns a current AP2 `detailedStatus`, but stale top-level authority fields:

   - `ruleDesignPass=false`
   - `remainingBlockers=["PENDING_COVERAGE_PROFILE_CHILD"]`
   - `requiredNextAction="CREATE_AND_INDEPENDENTLY_REVIEW_COVERAGE_PROFILE_CHILD"`
   - stale pre-profile `lastAction`

   The nested `slice2B20AP2Gate`, `CURRENT_TASK.md`, and `PROJECT_STATE.md` instead correctly record `ruleDesignPass=true`, coverage-profile review passed, blocker `PENDING_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REVIEW`, and next action `RUN_INDEPENDENT_LOCAL_INFRASTRUCTURE_IMPLEMENTATION_REVIEW`.

   A controller consuming the canonical top-level fields can rewind into an already completed stage or misreport design authorization.

   requiredCorrection: Reconcile the canonical top-level active fields in `AUTOPILOT_STATE.json` with the current AP2 gate and the other three controls. Keep historical states inside explicitly historical/versioned objects, not as contradictory active authority. The minimal correction can be limited to this file because the other three active controls are already current.

   requiredRegressionTests:

   - parse the state through both Node JSON parsing and PowerShell `ConvertFrom-Json`;
   - assert one canonical active slice/status/design verdict/blocker/next-action tuple;
   - assert equality with `CURRENT_TASK.md`, `PROJECT_STATE.md`, and the accepted coverage-profile review head;
   - reject stale completed-stage blockers and actions in active top-level fields.

verdict: `INFRASTRUCTURE_IMPLEMENTATION_REVIEW_FIX_REQUIRED`

remainingBlockers:

- Persisted Vitest evidence verification and aggregation fail open when an expected physical blob is absent.
- Canonical top-level Autopilot state contradicts the accepted AP2 gate and other active controls.
<!-- END VERBATIM INDEPENDENT LOCAL IMPLEMENTATION REVIEW ROUND 1 -->
