# Phase 3 Slice 2B20AP2 Design Release Review — Correction V1

<!-- BEGIN VERBATIM INDEPENDENT REVIEW -->
reviewedHead: `e1268299ffa21bd3ae86181554bd38c30acc52df`

reviewedBranch: `infra/2b20ap1-ownership-supersession-routing-v1`

reviewTimestamp: `2026-07-27T12:54:18Z`

reviewScope:
- Independent read-only Design Release review of the authorized 2B20AP2 preservation-only correction.
- Reviewed the complete Round 1 design/review, Round 2 design/review, release correction, authorization attachment, relevant governance, architecture, implementation status, CI topology, runtime interfaces, tests, and rule-preservation evidence.
- No implementation, Round 3, product/rule/test/profile/topology change, GitHub mutation, or historical re-review was authorized or performed.
- Exact reviewed HEAD is five commits ahead of the live PR #47 remote head and has no exact-HEAD hosted CI. This is recorded as provenance, not treated as implementation evidence.

filesReviewed:
- `AGENTS.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- Relevant current task, project-state, autopilot-state, and log records
- Complete handoff sequence beginning with `project-handoff/00-README-FIRST.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/architecture/2B20AP2-go-no-go-under-governance-v1.md`
- `docs/implementation/phase-3-slice-2b20ap2-design.md`
- `docs/implementation/phase-3-slice-2b20ap2-design-review-round-1.md`
- `docs/implementation/phase-3-slice-2b20ap2-design-round-2.md`
- `docs/implementation/phase-3-slice-2b20ap2-design-review-round-2.md`
- `docs/implementation/phase-3-slice-2b20ap2-design-release-correction-v1.md`
- `docs/implementation/phase-3-slice-2b20ap2-hosted-ci-failure-audit.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20AP2.md`
- Relevant prior 2B20A rule evidence
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `.github/workflows/ci.yml`
- `package.json`, `pnpm-lock.yaml`, `vitest.workspace.ts`
- Current ownership, coverage, Windows-group, diagnostic, and coverage-obligation scripts
- Affected current tests, including Dreamer filtered tests
- Installed Vitest 3.2.6 public package metadata and merge/blob reporter implementation
- Complete in-scope correction patch and changed-path comparisons against PR #47’s remote head and the PR base

externalSourcesReviewed:
- User-approved overrides at repository blob `180f3c6200667cb5dd8a4cf3106a0408e09454a9`, SHA-256 `9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5`
- Live pinned Chinese Wiki revisions: 首页 `5855`, 筑梦师 `3046`, 哲学家 `5125`, 醉酒 `5720`, 中毒 `6294`, 数学家 `6442`, 涡流 `6198`
- Live pinned official Wiki revisions: Dreamer `2904`, Philosopher `2421`, Glossary `2874`, Mathematician `3109`, Vortox `3017`, States `1039`, Rules Explanation `1310`
- Official nightsheet at commit `915347e627c3f6cd1f438f82b6001784e11b3e8b` and live `main`; both matched SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- Nightsheet positions independently confirmed: Philosopher `14/11`, Dreamer `61/79`, Mathematician `77/96`, Vortox absent first night and `47` other night
- Role matrix independently confirmed Dreamer remains `PARTIAL`
- No external-source conflict or unauthorized product-rule claim was found

probeAssessment:
- Required runtime matched Node `24.15.0`; repository Corepack pnpm matched `11.7.0`, while direct PATH pnpm remained the known incompatible `11.9.0`.
- The correction’s replacement trust anchor resolved the installed public Vitest `3.2.6` `vitest.mjs` and executed it through `process.execPath` on Windows with exit code `0`, without pnpm, PATH executable lookup, or shell interpretation.
- Independent singleton ordinary probes produced the frozen selected identity counts `14`, `22`, and `10`, with union `46` and zero intersections.
- An independent raw three-blob merge again produced task-ID collision corruption. Its surviving count differed from the recorded probe, confirming that multi-blob merged test JSON is ordering-dependent and cannot be identity or assertion authority. The correction correctly treats it as diagnostic only.
- Vitest source inspection confirmed blob merge input is nonrecursive and that a flat regular-file coverage merge directory is required.
- Repository-root equality, fixed-root containment, junction/reparse escape detection, and exclusive temporary-write/fsync/rename behavior were independently exercised successfully.
- The optional full twelve-way local coverage reproduction was interrupted by the review command time limit and was not represented as passing evidence. The complete frozen coverage contract was instead checked against its commands, topology, recorded fingerprint, current Vitest merge behavior, and required regression matrix.
- All OS-temporary probe material and orphaned probe processes were removed. Final repository worktree remained clean.

blockerClosureAssessment:
1. `MISSING_GOVERNANCE_V1_1_DESIGN_TRACEABILITY_AND_R_T_CLASSIFICATION`
   - Closed.
   - The correction contains 42 unique guarantee rows using only the accepted vocabularies.
   - Distribution: R1 `29`, R2 `2`, R3 `11`, R4 `0`; T1 `36`, T2 `0`, T3 `6`.
   - Primary layers: `CROSS_PLATFORM_CI` `23`, `STRUCTURAL_VALIDATION` `11`, `LEGACY_REPLAY_COMPATIBILITY` `2`, `PURE_POLICY_SEAM` `6`.
   - No row incorrectly uses `APPLICATION_COMMAND`; accepted-history, hostile-input, current execution, and pure-union claims are separated.

2. `VITEST_MERGEABLE_BLOB_AND_SIDECAR_CONTRACT_NOT_FROZEN`
   - Closed.
   - Ordinary evidence uses singleton blob merge roots and T3 identity union; global multi-blob test JSON is explicitly non-authoritative.
   - Coverage uses twelve validated singleton blobs copied byte-for-byte into one flat coverage-only merge root.
   - Random nonce was removed from canonical identity; deterministic command identity, exact sidecar/envelope/manifest schemas, cross-links, collision handling, atomic writes, and exhaustive mismatch codes—including `SIDECAR_LOGICAL_GROUP_MISMATCH`—are frozen.
   - Negative tests cover nested-directory rejection, extra/missing/renamed/substituted artifacts, collisions, schema mismatches, assertion discrepancies, and diagnostic-authority misuse.

3. `RUNNER_PNPM_AND_ARTIFACT_ROOT_TRUST_ANCHORS_NOT_EXECUTABLE_AS_DESIGNED`
   - Closed.
   - The runner no longer depends on resolving repository-pinned pnpm. It resolves and validates Vitest’s public 3.2.6 bin and invokes it directly with `process.execPath`, discrete argv, repository cwd, `shell:false`, and real exit/signal capture.
   - Root discovery, realpath containment, `GITHUB_WORKSPACE` equality, link/reparse rejection, fixed root enumeration, bounded cleanup, controlled environment keys, file allowlists, failure codes, and Linux/Windows regression requirements are implementable and frozen.
   - The observed direct-pnpm `11.9.0` mismatch therefore no longer blocks the designed runner.

findings: `[]`

designReleaseVerdict: `DESIGN_RELEASE_PASS`

remainingBlockers: `[]`
<!-- END VERBATIM INDEPENDENT REVIEW -->
