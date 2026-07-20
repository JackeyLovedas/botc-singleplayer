# PR #42 Rule Review Final Archive

- PR: `#42`
- Frozen feature HEAD: `87d0ab3d7dc3dc9f0b8472d569a731d4a2b2e744`
- Merge SHA: `f90b4909c3883c3853d93cc444a823ce07078e61`
- Original comment ID: `5018938869`
- Original comment URL: `https://github.com/JackeyLovedas/botc-singleplayer/pull/42#issuecomment-5018938869`
- Original comment timestamp: `2026-07-20T05:00:34Z`
- Original comment updated timestamp: `2026-07-20T05:00:34Z`
- Original UTF-8 comment body bytes: `18452`
- Original UTF-8 comment body SHA-256: `93d3b9cd7ce55e7910b98f4464893753d544f318328844a74bf445378ccb829b`

## Verbatim Original Comment Body

<!-- BEGIN VERBATIM ORIGINAL COMMENT BODY -->
<!-- BOTC_FINAL_RULE_REVIEW
reviewedHead=87d0ab3d7dc3dc9f0b8472d569a731d4a2b2e744
-->
reviewedPR: `JackeyLovedas/botc-singleplayer#42` — `Infrastructure: preserve failed Dreamer-Vortox coverage diagnostics`

reviewedHead: `87d0ab3d7dc3dc9f0b8472d569a731d4a2b2e744`

reviewTimestamp: `2026-07-20T12:51:35.8524491+08:00`

reviewScope:
- Final independent read-only infrastructure review of open, non-draft, mergeable PR #42 at exact base `6e7b0d752750bc00f64309ed5e4f59c39b93255e` and exact head `87d0ab3d7dc3dc9f0b8472d569a731d4a2b2e744`.
- Read `AGENTS.md`, `project-handoff/00-README-FIRST.md`, `docs/agent-loop/REVIEW_PROTOCOL.md`, the relevant architecture ADR, current implementation/status documents, both user authorization attachments, the live PR metadata/body, all three commits, and the complete ten-file PR diff.
- Reviewed every changed executable/configuration file in full, every changed implementation/control document, the unchanged relevant test inventory and ownership contracts, retained Round 1 diagnostics, retained Round 2 three-candidate coverage evidence, exact-head push and pull-request CI jobs/logs, current rule evidence, live or fixed external rule sources, official nightsheet, and current role coverage matrix.
- Verified local and remote PR HEAD equality, a clean worktree, `git diff --check`, authorized commit/file boundaries, absence of forbidden product/test/fixture/dependency/timeout changes, and continued exact-head CI success immediately before issuing this report.
- Applied all nine rule-consistency checks required by `docs/agent-loop/REVIEW_PROTOCOL.md`, plus runtime-shape, replay-integrity, atomicity, prospective-validation, idempotency/receipt, retry-boundary, historical-fact, information-leakage, deterministic-order/ID, negative-test, documentation, and actual-CI-execution review dimensions. Because this PR is infrastructure-only and changes no game event flow or product semantics, the domain-safety dimensions were checked for non-regression and scope preservation.
- No repository file, GitHub object, commit, branch, PR body, check, review, or comment was modified during the review.

productionFilesReviewed:
- `.github/workflows/ci.yml` — complete file and complete diff; coverage-shard execution, always-run diagnostic collection/upload, success-only formal blob upload, original-result enforcement, merge dependencies, and exact group matrix.
- `scripts/collect-vitest-shard-diagnostics.mjs` — complete 528-line file and diff; strict arguments, canonical paths, symlink rejection, deterministic serialization, manifest/checksum construction, exact-copy verification, failure handling, and absence of environment/secret enumeration.
- `scripts/verify-vitest-coverage-groups.mjs` — complete 1,148-line file and diff; live inventory, ordinary/coverage/semantic identities, ownership checks, marker classification, group report validation, collision classification, and fail-closed exit behavior.
- `scripts/verify-coverage-obligations.mjs` — complete affected profile-registry logic and diff; new exact profile tuple/hash entry and preservation of prior profiles and fail-closed selection.
- `docs/implementation/pr41-dreamer-vortox-coverage-observability-v1.md` — complete document and evidence claims.
- `docs/implementation/pr41-dreamer-vortox-split-coverage-profile-v1.md` — complete document and evidence claims.
- `docs/agent-loop/AUTOPILOT_LOG.md` — complete affected diff and relevant surrounding status.
- `docs/agent-loop/AUTOPILOT_STATE.json` — complete affected diff and state semantics.
- `docs/agent-loop/CURRENT_TASK.md` — complete affected diff and current-slice status.
- `docs/agent-loop/PROJECT_STATE.md` — complete affected diff and project-status claims.
- No `packages/**` production file changed in the PR; the forbidden-path audit also found no changed product source, fixture, lockfile, package manifest, Vitest workspace, ownership contract, rule-evidence file, role-coverage matrix, or traceability artifact.

testFilesReviewed:
- `packages/application/src/game-application-service.test.ts` — all 26 relevant `[2B19A3A-*]`, `[2B19A3B1-*]`, and `[2B19B-*]` test titles and their unchanged placement in the target project.
- `vitest.workspace.ts` — target project/file topology and selection behavior; unchanged by the PR.
- `scripts/vitest-ownership-contracts.mjs` — relevant ownership-contract sections for the affected application-service project; unchanged by the PR.
- `docs/traceability/TRACEABILITY_MATRIX.md` — relevant Dreamer/Philosopher/Vortox traceability status; unchanged by the PR.
- Round 1 retained push blob `application-service-dreamer-vortox` — 4,383,900 bytes, SHA-256 `be454c9449af2b69bed4cb22b7b5a4b68a2e323e6b24cb0bcac7c0f3ac717f2c`, manifest SHA-256 `509b44368f18d92ea2863a1c01648d800f730443b45ce8a16bc97afb8b7fa760`.
- Round 1 retained pull-request blob `application-service-dreamer-vortox` — 4,383,911 bytes, SHA-256 `07dbfda0e17b95af0bc1723a41a78f7363d3a61688f7b4f7c5a3ff94e930a2e6`, manifest SHA-256 `63c6391cea2f883cf7c421b4c4e670c7d2c8bbf22dfa9ce67a9f8b85d1b08564`.
- Both Round 1 blobs were independently parsed with the installed Vitest 3.2.6 internal parser: one passed file, five passed suites, 26/26 passed tests, zero failed/pending tests, and exactly one unhandled `[vitest-worker]: Timeout calling "onTaskUpdate"` error in each retained failing run.
- Both Round 1 single-blob merged reports were independently inspected and correctly treated only as derived merge failure (`0` tests, `success:false`), not as authority overriding the directly parsed passing blob test results.
- Round 2 three-candidate profile evidence under `%LOCALAPPDATA%\BOTCRepoVisibility\coverage-experiments\pr41-split-dreamer-vortox-coverage\profile-dcfa530-split-coverage-v1`, including `three-candidate-stability.md` SHA-256 `887065bb6511bc0b32b57b97907c441d1b142c111e18838936d37984204523c8`.
- Round 2 candidate manifest SHA-256 values `d7a023034ec013bf8b105c2943cbd9eb21f93dec68b9d823ea1cf28f3018b71c`, `31c05b35174cc398b4a7f0dc16c9e59bafaa43151c2bea25b2cb6f95b996bd6d`, and `acaa77d6ba389f0e55c1f0b83d80002aec5b295636ad0c4d4d2e9c6c1a3fb6a0`; each independently recalculated and each recording source head `dcfa530540a57ce7b03e97958dd7de9926f71bbd`, ten groups, 1,520 passed tests, zero risk-signature hits, and wall times 271.792/256.679/259.451 seconds.
- Round 2 inventory audit SHA-256 `d9e4a3e710d2fa4beba64b9fb218f7bdbf6116f37c5173333f9f3967cbcd3919`, formal verifier JSON, raw merged coverage hashes, and exact coverage-obligation tuple: 63 source files, 3,204 zero statements, 23 zero functions, 3,204 zero lines, and 1,799 zero branch arms.
- Formal verifier totals independently checked: 31 physical test files, 35 project-file executions, 1,520 total tests; exact group totals 207/357/456/90/52/73/20/16/10/239; semantic union 1,520; zero intersection, missing, duplicate, unexpected, or wrong-owner identities; Dreamer/Vortox core 16, gained 10, full 26; marker counts 10/6/10.
- Exact-head push CI run `29717007667` and pull-request CI run `29717009467`: each completed successfully at reviewed HEAD with all 23 jobs successful (validate, nine ordinary shards, ordinary merge, ten coverage shards, coverage merge, and Windows deterministic job), zero failed/skipped jobs, and every coverage run/collect/upload/formal-upload/enforce step successful.

ruleEvidenceReviewed:
- `docs/rules/USER_OVERRIDES.md` — no applicable override contradicting this infrastructure slice.
- `docs/rules/evidence/2B19B.md` — complete current sourced evidence for the affected Dreamer/Philosopher/Vortox interaction.
- `docs/rules/ROLE_COVERAGE_MATRIX.md` — current rows independently checked: Dreamer `PARTIAL`, Philosopher `PARTIAL`, Vortox `NOT_STARTED`; no unsupported `COMPLETE` claim.
- Relevant frozen design, design-review, traceability, implementation-status, and authorization material; current hashes and stage boundaries were checked against the live PR.
- Round 1 user authorization attachment `C:\Users\wjl\.codex\attachments\036e839e-d78d-4dd7-9f2d-673074910396\pasted-text.txt`, read completely.
- Round 2 classification-amendment authorization attachment `C:\Users\wjl\.codex\attachments\78a68d31-e83a-4d02-97dd-6ea54ef2ae9d\pasted-text.txt`, read completely.
- Official BOTC Wiki, Dreamer: live page independently read; confirms nightly selection of a non-self, non-Traveller player, one good and one evil character shown with one correct, and the Vortox example requiring false Townsfolk information.
- Official BOTC Wiki, Philosopher: live page independently read; confirms once-per-game gain of another character's ability without becoming that character, drunkenness of an in-play matching character, and operation when the gained ability normally acts, including the Dreamer example.
- Official BOTC Wiki, Vortox: live page independently read; confirms Townsfolk ability information must be false, including when the Townsfolk is drunk or poisoned.
- Fixed official raw source snapshots independently fetched and hash-checked: Philosopher SHA-256 `a1e732...`, Dreamer SHA-256 `884195...`, Vortox SHA-256 `4630f7...`; exact full hashes remain recorded in `docs/rules/evidence/2B19B.md`.
- Fixed Chinese Wiki raw source snapshots independently fetched and hash-checked: Philosopher SHA-256 `9b1c00...`, Dreamer SHA-256 `53ca18...`, Vortox SHA-256 `36716e...`; exact full hashes remain recorded in `docs/rules/evidence/2B19B.md`.
- Official fixed and live nightsheet JSON independently fetched and compared: both 2,923 bytes, SHA-256 `99a2815b...`; first-night length 80 and other-night length 99; first-night indices Philosopher 13, Dreamer 60, Mathematician 76, Vortox absent; other-night indices Philosopher 10, Vortox 46, Dreamer 78, Mathematician 95. Exact source URL/revision and full hash are recorded in `docs/rules/evidence/2B19B.md`.
- Live PR body independently fetched as UTF-8 and SHA-256 verified as `1784e68b1eceb025da9cbb7f839b56c96f170194ff05a39db8608e16438d5117`; all required Rule Evidence, Rule Claims, Unsupported Cases, Revisions, and Traceability sections are present.

findings:
- blockerFindings: `[]`
- backlogFindings: `[]`
- Requirement 1 — authorization/scope boundaries: PASS. The three-commit sequence (`ee2f1aae...`, `dcfa5305...`, `87d0ab3d...`) and ten changed paths match the two user authorizations; the final commit is profile-registry-only. No product code, domain semantics, tests, fixtures, dependencies, lockfiles, timeouts, workers/pools, retry policy, or ownership contracts changed.
- Requirement 2 — exact reviewed revision: PASS. Local HEAD, remote PR head, and live PR `headRefOid` are all `87d0ab3d7dc3dc9f0b8472d569a731d4a2b2e744`; base is `6e7b0d752750bc00f64309ed5e4f59c39b93255e`; worktree is clean and `git diff --check` passes.
- Requirement 3 — diagnostic collection fidelity: PASS. The collector requires exact arguments, canonicalizes repository-relative POSIX paths, rejects symlink escapes, uses only standard-library facilities, avoids environment enumeration, serializes deterministically, emits manifest checksums, verifies exact copies, records absent blobs, and exits nonzero on exceptions.
- Requirement 4 — original failure preservation: PASS. Diagnostics run under `always()`, formal blobs upload only after the original coverage command succeeds, and the enforcement step succeeds only for original success; all failure/unknown outcomes remain failing. No `dangerouslyIgnoreUnhandledErrors`, swallowed process errors, or equivalent weakening exists.
- Requirement 5 — direct blob truth: PASS. Independent parsing proves both retained Round 1 blobs contain the expected 26 passing marked tests plus exactly one worker `onTaskUpdate` unhandled error, matching the documented classification.
- Requirement 6 — merge-result interpretation: PASS. The zero-test single-blob merge outputs are explicitly derived artifacts and never used to negate the direct blob inventory; this avoids a false assertion that product tests failed.
- Requirement 7 — group split exactness: PASS. Ordinary execution remains exactly nine groups; coverage execution is exactly ten groups and splits only the Dreamer/Vortox target into core and gained groups.
- Requirement 8 — marker ownership exactness: PASS. Core selects only `[2B19A3A-*]`/`[2B19A3B1-*]`; gained selects only `[2B19B-*]`; every relevant identity has exactly one marker class and exactly one intended semantic owner.
- Requirement 9 — inventory/coverage completeness: PASS. The verifier builds live Vitest inventory and separately models physical, project-execution, coverage-execution, and semantic identities; it rejects missing, duplicate, unexpected, and wrong-owner identities. Candidate and exact-head totals are complete at 1,520 tests.
- Requirement 10 — canonical group report authority: PASS. Each per-filter group report must have the exact selected passing identities and exact complement skipped identities. These reports, not a global collision heuristic, are the authority for semantic coverage.
- Requirement 11 — global collision handling: PASS. The known Vitest global collision is explicitly labeled `authoritative:false` and accepted only for complementary core/gained signatures with exact shape and no test failures; push produced core `0/2` versus gained `2/0`, and pull request produced the reverse. A collision match alone cannot create a semantic PASS.
- Requirement 12 — coverage-obligation registry: PASS. The new exact profile entry matches 3/3 independent candidates and preserves prior profiles. Explicit selection, prior-profile matching, and fail-closed unknown/wrong/ambiguous/duplicate behavior were independently checked.
- Requirement 13 — deterministic evidence: PASS. Candidate manifests, audit, merged coverage, report hashes, group totals, risk-signature counts, and obligation tuple recalculate consistently. No locale-sensitive ordering, time-derived IDs, random IDs, or nondeterministic profile choice was introduced.
- Requirement 14 — runtime/replay/atomicity/history safety: PASS. The PR changes only CI infrastructure, verification scripts, and documentation. It introduces no runtime payload, domain event, replay reducer, batch, command, receipt, retryable domain failure, stored fact, projection, scheduling, or ID path; forbidden-diff checks confirm those surfaces are unchanged.
- Requirement 15 — player/AI information boundaries: PASS. No player view, AI prompt/memory, canonical state exposure, public/Storyteller projection, or information-delivery logic changed.
- Requirement 16 — negative and fail-closed coverage: PASS. Missing blobs, copy/checksum mismatch, invalid paths, malformed/wrong group reports, missing/duplicate/unexpected/wrong-owner identities, collision-shape deviations, failed tests, profile mismatch, ambiguous automatic selection, and unknown profiles all remain rejection paths.
- Requirement 17 — documentation accuracy: PASS. The two implementation documents accurately distinguish direct passing blob results, worker-pool failure, derived merge behavior, global-collision non-authority, candidate evidence, and the registered profile. Stage-bound control-document references to pre-push/pending state are not claims about a future self-referential SHA and do not override the live PR/CI authority chain.
- Requirement 18 — CI actually executes claimed checks: PASS. Exact-head push run `29717007667` and PR run `29717009467` each have 23/23 successful jobs. Complete logs show all ten coverage diagnostic/enforcement paths and merge semantic/profile gates executed. Searches found zero `onTaskUpdate`, generic exit-code-1, unhandled error/rejection, test timeout, worker error, SIGKILL, heap-OOM, or profile-mismatch signatures on exact-head CI.
- Requirement 19 — PR audit/body integrity: PASS. The live PR body has the required exact UTF-8 hash and all required evidence/claims/unsupported/revision/traceability sections. PR is open, non-draft, and mergeable at the reviewed head.
- Rule-consistency check 1 — claimed rule text versus current external sources: PASS. The PR makes no new game-rule claim; its retained Dreamer/Philosopher/Vortox context agrees with independently read official and Chinese sources.
- Rule-consistency check 2 — user overrides and conflict handling: PASS. No applicable override conflicts with the evidence or implementation; no rule conflict is guessed through.
- Rule-consistency check 3 — role and interaction coverage status: PASS. The matrix remains Dreamer `PARTIAL`, Philosopher `PARTIAL`, Vortox `NOT_STARTED`; this infrastructure PR does not expand implementation or overclaim completeness.
- Rule-consistency check 4 — first-night/other-night order: PASS. Independent official-nightsheet inspection confirms the recorded ordering and that Vortox is absent from first-night order and present before Dreamer on other nights.
- Rule-consistency check 5 — exact runtime shapes and rule-bearing event flow: PASS. No runtime shape, command, event, or rule-bearing payload changed; existing validation and replay paths are outside the diff and remain unchanged.
- Rule-consistency check 6 — settlement, reliability, registration, and historical facts: PASS. No effectiveness, truth/reliability, registration, poisoning/drunkenness, simulation-reason, or historical-knowledge calculation changed.
- Rule-consistency check 7 — atomicity, prospective validation, idempotency, receipts, and retry boundaries: PASS. No domain transaction, batch, persistence, receipt, retry, or command-queue behavior changed; CI enforcement itself remains fail-closed.
- Rule-consistency check 8 — information separation and deterministic behavior: PASS. No AI/player/canonical-information boundary or deterministic game ordering/ID surface changed; verifier output uses deterministic ordering and fixed identities.
- Rule-consistency check 9 — negative tests, traceability, documentation, and executed CI: PASS. Relevant tests/traceability are unchanged and correctly classified; documentation is evidence-backed; exact-head push and PR CI actually execute and pass the claimed checks.
- Overall blocker assessment: no correctness, rule, safety, provenance, or CI-execution blocker remains for reviewed HEAD. No style-only comment is reported.

codeVerdict: `CODE_REVIEW_PASS`

ruleVerdict: `RULE_REVIEW_PASS`

remainingBlockers: []

<!-- END VERBATIM ORIGINAL COMMENT BODY -->
