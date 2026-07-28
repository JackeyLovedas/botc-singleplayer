# Phase 3 Slice 2B20AP2 Final Design Review Round 2 Archive

## Archive metadata

- archivePurpose: `VERBATIM_FINAL_INDEPENDENT_DESIGN_REVIEW`
- archivedBy: `sole writer`
- reportMutation: `NONE`
- reportCompleteness: `COMPLETE`
- reviewedHead: `53872611e2782c28afd16584134616dcb2fafcaa`
- reviewTimestamp: `2026-07-27T10:49:50.2295723Z`

The complete reviewer report begins and ends at the explicit boundaries below.
Text inside those boundaries is preserved without rewriting, summarization, or
omission.

----- BEGIN VERBATIM REVIEWER REPORT -----

reviewedHead: `53872611e2782c28afd16584134616dcb2fafcaa`

reviewedBranch: `infra/2b20ap1-ownership-supersession-routing-v1`

reviewTimestamp: `2026-07-27T10:49:50.2295723Z`

reviewedPR:

- GitHub PR `#47`
- Published PR HEAD: `03a4184282cde5f972a9ccab94f36e3a2aa79ed5`
- The requested review HEAD contains three unpushed documentation/control commits and is not the current GitHub PR HEAD.
- This is a pre-implementation design review, not a final PR review.

reviewScope:

- Phase 3 Slice `2B20AP2`, Design Round `2/2`.
- Complete local Round-2 diff and complete live PR file diff.
- Round-1 design and independent review findings.
- Rule evidence, external rule truth, official nightsheet and role coverage.
- Architecture, governance classification, implementation status and CI topology.
- Affected workflow, ownership scripts, Vitest runtime interfaces and application tests.
- Replay, atomicity, prospective validation, idempotency, historical-fact stability, information leakage and canonical-ordering contracts were checked for scope preservation. Round 2 changes no product behavior, event schema, replay path, projection or role coverage.

gitState: `CLEAN`

filesReviewed:

- Governance and controller:
  - `AGENTS.md`
  - supplied Slice 2B20AP2 authorization attachment
  - `docs/agent-loop/AUTOPILOT_PROMPT.md`
  - `docs/agent-loop/REVIEW_PROTOCOL.md`
  - `docs/agent-loop/CURRENT_TASK.md`
  - `docs/agent-loop/PROJECT_STATE.md`
  - `docs/agent-loop/AUTOPILOT_STATE.json`
  - `docs/agent-loop/AUTOPILOT_LOG.md`
- Required handoff sequence:
  - `project-handoff/00-README-FIRST.md`
  - `PROJECT_HANDOFF.md`
  - `PRODUCT_SCOPE.md`
  - `RULES_BASELINE.md`
  - `ARCHITECTURE_INPUT.md`
  - `IMPLEMENTATION_GUARDRAILS.md`
  - `OPEN_RISKS.md`
  - `DEVELOPMENT_ROADMAP.md`
  - relevant `project-handoff/rules/` and `project-handoff/tests/`
- Architecture and status:
  - `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
  - `docs/architecture/00-architecture-status.md`
  - `docs/architecture/2B20AP2-go-no-go-under-governance-v1.md`
  - `docs/implementation/phase-3-slice-2b20ap2-hosted-ci-failure-audit.md`
  - `docs/implementation/phase-3-slice-2b20a-status.md`
  - `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
- Design history:
  - `docs/implementation/phase-3-slice-2b20ap2-design.md`
  - `docs/implementation/phase-3-slice-2b20ap2-design-review-round-1.md`
  - `docs/implementation/phase-3-slice-2b20ap2-design-round-2.md`
- Rule material:
  - `docs/rules/USER_OVERRIDES.md`
  - `docs/rules/evidence/2B20AP2.md`
  - `docs/rules/evidence/2B20A.md`
  - `docs/rules/evidence/2B20A-resolved.md`
  - `docs/rules/ROLE_COVERAGE_MATRIX.md`
- Workflow/runtime/test surfaces:
  - `.github/workflows/ci.yml`
  - `package.json`
  - `vitest.workspace.ts`
  - `scripts/vitest-ownership-contracts.mjs`
  - `scripts/verify-vitest-ownership-contracts.mjs`
  - `scripts/verify-vitest-coverage-groups.mjs`
  - `scripts/verify-vitest-windows-application-groups.mjs`
  - `scripts/collect-vitest-shard-diagnostics.mjs`
  - `scripts/verify-coverage-obligations.mjs`
  - `packages/application/src/game-application-service.test.ts`
  - `packages/domain-core/src/rebuild.test.ts`
  - installed Vitest 3.2.6 blob reporter/merge implementation in `node_modules/vitest/dist/chunks/index.VByaPkjc.js`
- The complete live PR #47 name-level diff and the full content of every Round-2-added or modified design/control document were reviewed.

externalSourcesReviewed:

- User override authority at blob `180f3c6200667cb5dd8a4cf3106a0408e09454a9`.
- Chinese Wiki pinned revisions:
  - Dreamer/筑梦师 `oldid=3046`
  - Philosopher/哲学家 `oldid=5125`
  - Drunkenness/醉酒 `oldid=5720`
  - Poisoning/中毒 `oldid=6294`
  - Mathematician/数学家 `oldid=6442`
  - Vortox/涡流 `oldid=6198`
- Official BOTC Wiki pinned revisions:
  - Dreamer `oldid=2904`, SHA-256 `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`
  - Philosopher `oldid=2421`, SHA-256 `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`
  - Mathematician `oldid=3109`, SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`
  - Vortox `oldid=3017`, SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`
  - Glossary `oldid=2874`
  - States `oldid=1039`
  - Rules Explanation `oldid=1310`
- Official nightsheet pinned commit `915347e…`, content SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`; live `main` matched the pinned content during review.
- Verified order positions:
  - First night: Philosopher `14`, Dreamer `61`, Mathematician `77`
  - Other night: Philosopher `11`, Vortox `47`, Dreamer `79`, Mathematician `96`

evidenceAssessment:

- External rule sources support the preservation-only boundary. No new BOTC behavior is authorized or required by 2B20AP2.
- Dreamer correctly remains `PARTIAL`.
- The recorded H1–H4 CI diagnoses are consistent with the raw hosted logs: shallow Git history, worker/blob process failures, coverage merge failure and Windows W7 evidence.
- Round 2 does not change product rules, accepted events, runtime payloads, replay, atomic batches, command receipts, private projections, deterministic game IDs or role coverage.
- Exact-head CI does not exist for reviewed HEAD `5387261…`; PR #47 still targets `03a4184…` and its relevant checks remain failed. This is contextual evidence, not the reason for denying pre-implementation design authorization.
- All three Round-1 architectural blockers remain materially open.

findings:

1. `MISSING_GOVERNANCE_V1_1_DESIGN_TRACEABILITY_AND_R_T_CLASSIFICATION`

   - classification: `BLOCKER`
   - severity: `P1 / DESIGN_GATE`
   - file/symbol: `phase-3-slice-2b20ap2-design-round-2.md`, §§3.1–3.3, especially lines 62–104 and criteria C01, C04, C11 and C15
   - affected reachability/trust: all declared R/T mappings; primarily runner and repository T1 paths
   - failure scenario: Round 2 replaces the fixed governance meanings with `R1 ACCEPTED_DIRECT_EXECUTION`, `R2 ACCEPTED_HISTORY_COMPATIBILITY` and `R4 FROZEN_DIFF_INVARIANT`. The accepted ADR instead defines R1 only as a currently callable formal application path, R2 as legacy/imported accepted history, R3 as hostile/corrupted history and R4 as future hypothetical state. C04 and C11 are classified as `APPLICATION_COMMAND_INTEGRATION` even though neither invokes `GameApplicationService` nor a formal application command. C01 combines normal hosted execution and a hostile shallow-repository fixture in one primary reachability row. C15 uses R4 as a repository-diff category. These are semantic redefinitions, not harmless labels.
   - required correction: do not implement this matrix. A replacement resliced design must use the exact accepted R1–R4 and eight primary-layer vocabularies, split mixed accepted/hostile behavior rows and classify exact-head runner execution as `CROSS_PLATFORM_CI`. If the infrastructure success path necessarily becomes R4 under the accepted decision algorithm, it cannot be retained as the current acceptance prerequisite without an explicitly authorized governance change/reslice.
   - required regression tests:
     - machine-check every expected reachability value against the exact accepted R1–R4 enum;
     - machine-check every primary layer against the eight accepted layers;
     - reject `APPLICATION_COMMAND_INTEGRATION` unless the authority invokes a formal application command;
     - prove each criterion has exactly one primary reachability and split normal execution from hostile fixtures;
     - prove no current acceptance criterion uses R4 as a diff/invariant label.

2. `VITEST_MERGEABLE_BLOB_AND_SIDECAR_CONTRACT_NOT_FROZEN`

   - classification: `BLOCKER`
   - severity: `P1 / DESIGN_GATE`
   - file/symbol: `phase-3-slice-2b20ap2-design-round-2.md`, §§10–15, especially lines 473–475, 570–685, 812–825, 862–870, 903–909 and 1011–1014; Vitest `readBlobs`
   - affected reachability/trust: intended CI/artifact T1/T2/T3 paths
   - failure scenario:
     - The ordinary merge root is specified as eight blob files plus a nested Dreamer directory containing three blobs; coverage similarly contains a nested core directory. Vitest 3.2.6 `readBlobs()` performs one non-recursive `readdir()` and throws whenever an entry is not a regular file. The frozen topology therefore cannot perform either claimed real merge.
     - C07 demands byte-identical manifests, logical reports and verification for repeated identical fixtures, while every run inserts a cryptographically random nonce into the sidecar, manifest and serialized command environment, and verification hashes those outputs. Both requirements cannot be true.
     - The self-test requires a distinct logical-group mismatch, but the frozen public failure-code list has no `SIDECAR_LOGICAL_GROUP_MISMATCH`.
   - required correction: a newly authorized resliced design must freeze one flat merge directory containing exactly 11 or 12 regular blob files, including the complete collision-safe staging/copy algorithm and path validation. It must also define whether the random nonce is transport-only and excluded/redacted from canonical byte identity, or replace it with a deterministic binding. The mismatch schema and public failure-code mapping must be exhaustive.
   - required regression tests:
     - execute real Vitest 3.2.6 ordinary and coverage merges from flat roots and prove `11→9` and `12→11`;
     - reject directory, symlink, extra-file, collision and traversal entries in merge staging;
     - run identical fixtures twice and compare every artifact claimed canonical byte-for-byte;
     - separately prove nonce substitution and replay are rejected without placing randomness in canonical identity;
     - assert every specified mismatch has one frozen public failure code, including logical-group mismatch.

3. `RUNNER_PNPM_AND_ARTIFACT_ROOT_TRUST_ANCHORS_NOT_EXECUTABLE_AS_DESIGNED`

   - classification: `BLOCKER`
   - severity: `P1 / DESIGN_GATE`
   - file/symbol: `phase-3-slice-2b20ap2-design-round-2.md`, §7.2–7.3 and §17, especially lines 304–346 and 990–1000
   - affected reachability/trust: external process/repository boundary
   - failure scenario: the mandatory direct-node self-test has no `npm_execpath`. On the reviewed required environment:
     - Node is `24.15.0`;
     - direct `pnpm` resolves to fallback `11.9.0`;
     - `corepack pnpm` resolves the project-pinned `11.7.0`;
     - even `corepack pnpm exec node` leaves `npm_execpath` unset;
     - the only `where.exe pnpm.cmd` result is the fallback 11.9.0 wrapper.
     
     The design forbids Corepack as a resolution source and therefore rejects the repository’s prescribed pinned package manager before inventory. POSIX fallback additionally executes an arbitrary PATH `pnpm` file directly instead of resolving and validating a JS entry for `process.execPath`, so the claimed single shell-free/direct-node trust model is not frozen cross-platform.
   - required correction: a newly authorized resliced design must define one executable trust anchor that resolves the package-manager version declared by the repository on both Windows and POSIX, including Corepack/project pinning if that is the chosen authority. Wrapper parsing, realpath/package-root containment, ambiguity, executable format and version probing must be specified consistently.
   - required regression tests:
     - direct-node invocation with unset `npm_execpath` must resolve the repository-pinned pnpm `11.7.0` on the required Windows environment;
     - the same contract must pass on hosted Linux;
     - reject the observed fallback pnpm `11.9.0`, ambiguous launchers, linked/spoofed wrappers, escaped JS references and non-pnpm executables;
     - prove the selected launcher executes Vitest `3.2.6` without shell interpretation;
     - prove mandatory local commands remain runnable from a clean checkout without an undocumented PATH mutation.

remainingBlockers:

- `MISSING_GOVERNANCE_V1_1_DESIGN_TRACEABILITY_AND_R_T_CLASSIFICATION`
- `VITEST_MERGEABLE_BLOB_AND_SIDECAR_CONTRACT_NOT_FROZEN`
- `RUNNER_PNPM_AND_ARTIFACT_ROOT_TRUST_ANCHORS_NOT_EXECUTABLE_AS_DESIGNED`

implementationAuthorized: `false`

stopLossAssessment:

- This is the second and maximum authorized design round.
- Architectural blockers remain after two design rounds, triggering `REVIEW_PROTOCOL.md` §“Slice Scope And Stop-Loss” condition 4 and ADR §5 condition 4.
- No third design round is authorized. Work must stop until a human/controller explicitly authorizes a resliced task or governance change.

designVerdict: HUMAN_BLOCKED

----- END VERBATIM REVIEWER REPORT -----
