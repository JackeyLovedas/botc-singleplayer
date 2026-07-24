# PR #45 Rule Review Final Archive

- PR: `#45`
- Frozen feature HEAD: `a8f17e4d62b500550d1092ec1bff19fac05ebf9a`
- Merge SHA: `8cb921c5130454c90c0a63fc4b03a1d24f789b0f`
- Original comment ID: `5058969870`
- Original comment URL: `https://github.com/JackeyLovedas/botc-singleplayer/pull/45#issuecomment-5058969870`
- Original comment timestamp: `2026-07-23T13:28:48Z`
- Original comment updated timestamp: `2026-07-23T13:28:48Z`
- Original UTF-8 comment body bytes: `12776`
- Original UTF-8 comment body SHA-256: `87c7c4a12de7c460bbc4d74a6d1a539c0a9dbf576bf0ac5a878e18355294127d`

## Verbatim Original Comment Body

<!-- BEGIN VERBATIM ORIGINAL COMMENT BODY -->
<!-- BOTC_FINAL_RULE_REVIEW
reviewedHead=a8f17e4d62b500550d1092ec1bff19fac05ebf9a
-->
reviewedPR: `https://github.com/JackeyLovedas/botc-singleplayer/pull/45`

reviewedHead: `a8f17e4d62b500550d1092ec1bff19fac05ebf9a`

reviewTimestamp: `2026-07-23T21:24:52.7725310+08:00`

reviewScope:

- Independently reviewed the complete 11-file PR diff from base `c8b89ce42b46d23d33e889e8d8e9fc0315114024` through final HEAD `a8f17e4d62b500550d1092ec1bff19fac05ebf9a`, including the infrastructure source commit `6a4705c0a6685c6f954a1b0db9870457122f24f4` and its profile-only child.
- Independently reviewed the profile-only `6a4705c...a8f17e4` diff, PR body, both commits and attribution, branch/base/head state, mergeability, repository instructions, ordered handoff, architecture, implementation status, traceability, coverage profile history, external hosted evidence, artifact catalogs, exact-head CI, and all nine rule-consistency checks.
- Reviewed the exact runtime behavior of the changed coverage and Windows verification scripts, including inventory construction, positive/negative A3B2 partitioning, collision handling, deterministic ordering, fail-closed mismatch handling, group manifests, canonical hashes, profile selection, and coverage-obligation comparison.
- Verified the final PR remains open, non-draft, merge state `CLEAN`, with exact remote and local HEAD `a8f17e4...`; the worktree was clean during review.
- Review was read-only. No file, PR, comment, branch, workflow run, commit, or external evidence was modified.

productionFilesReviewed:

- Game-product production files: `[]` — the complete PR has zero changed files under `packages/**/src`.
- CI/infrastructure executable files:
  - `.github/workflows/ci.yml`
  - `scripts/verify-coverage-obligations.mjs`
  - `scripts/verify-vitest-coverage-groups.mjs`
  - `scripts/verify-vitest-windows-application-groups.mjs`
- Changed control and evidence records:
  - `docs/agent-loop/AUTOPILOT_LOG.md`
  - `docs/agent-loop/AUTOPILOT_STATE.json`
  - `docs/agent-loop/CURRENT_TASK.md`
  - `docs/agent-loop/PROJECT_STATE.md`
  - `docs/implementation/phase-3-slice-2b19a3b2-coverage-profile.md`
  - `docs/implementation/phase-3-slice-2b19a3b2-status.md`
  - `docs/implementation/pr45-a3b2-hosted-stability-profile-v2.md`
- Architecture and governance inspected:
  - `AGENTS.md`
  - `docs/agent-loop/REVIEW_PROTOCOL.md`
  - `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
  - `docs/architecture/2B19A3B2-go-no-go-under-governance-v1.md`
  - `docs/implementation/phase-3-slice-2b19a3b2-design.md`
  - `docs/implementation/phase-3-slice-2b19a3b2-design-review-round-1.md`
  - `docs/implementation/phase-3-slice-2b19a3b2-design-release-review-after-command-capture-v1.md`
  - `docs/implementation/vitest-coverage-process-isolation-v2.md`
  - `project-handoff/00-README-FIRST.md`
  - All handoff documents ordered by that file.

testFilesReviewed:

- Changed test files: `[]`.
- The complete PR test-file diff, fixture diff, ownership-contract diff, Vitest-workspace diff, rule-traceability diff, and role-coverage-matrix diff are each zero.
- Existing test authority was reviewed through:
  - `docs/implementation/phase-3-slice-2b19a3b2-test-traceability.md`
  - The H2/H3/H4 canonical ordinary, coverage, semantic, and Windows inventories.
  - The exact-head CI’s nine ordinary shards, eleven coverage shards, semantic merge gates, exact-profile gate, ownership validation, and Windows W1-W7 execution.

ruleEvidenceReviewed:

- `docs/rules/USER_OVERRIDES.md`, including all six applicable approved overrides.
- `docs/rules/evidence/2B19A3B2.md`, terminal `RULE_READY`, coverage `PARTIAL`.
- `docs/rules/ROLE_COVERAGE_MATRIX.md`: Dreamer, Philosopher, and Mathematician remain `PARTIAL`; Vortox remains `NOT_STARTED`; no affected role is marked `COMPLETE`.
- Independently retrieved and checked the fixed Chinese Wiki revisions:
  - Homepage oldid `5855`, SHA-256 `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49`
  - Mathematician oldid `6214`, SHA-256 `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`
  - Dreamer oldid `3046`, SHA-256 `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`
  - Philosopher oldid `5125`, SHA-256 `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be`
  - Vortox oldid `6198`, SHA-256 `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`
  - Drunk oldid `5720`, SHA-256 `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e`
  - Poisoned oldid `6294`, SHA-256 `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0`
- Independently retrieved and checked the fixed official BOTC Wiki revisions:
  - Mathematician oldid `3109`, SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`
  - Dreamer oldid `2904`, SHA-256 `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`
  - Philosopher oldid `2421`, SHA-256 `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`
  - Vortox oldid `3017`, SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`
  - States oldid `1039`, SHA-256 `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`
  - Abilities oldid `1376`, SHA-256 `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40`
- Independently retrieved the official nightsheet pinned at repository HEAD `915347e627c3f6cd1f438f82b6001784e11b3e8b`; its SHA-256 is `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`. The checked first/other-night ordering remains consistent with the frozen A3B2 evidence and design.
- Reviewed the authoritative external stability report:
  - `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\github-hosted-evidence\pr45-6a4705c\hosted-stability-H2-H3-H4.json`
  - SHA-256 `008eb7bc033240bcf25311c717d033344ee9c831582b1a67071e0d873df828de`
- Reviewed all three complete 32-entry artifact catalogs:
  - H2 SHA-256 `8a84bfcd69a5fe2ff6a7ac6312a8eca5d8da0c84cb1dc4aef51ae5abc2cbe1ef`
  - H3 SHA-256 `782610eb9342caeb9523f36f5cefd9880fd661be7d8e7aa614595a7b3f1dcbf4`
  - H4 SHA-256 `1ff0edaa7d7965695d25c560d52f1c93163e89a1272443aaf98ad3bc809f2dd0`

findings:

- Blocking findings: `[]`.
- Backlog findings: `[]`.
- Verification facts:
  1. The complete PR diff is exactly 11 files. Game-product production, tests, fixtures, `scripts/vitest-ownership-contracts.mjs`, dependencies/lockfile, timeout configuration, coverage thresholds, rule evidence, role matrix, and A3B2 rule-to-test traceability have zero diff.
  2. PR #45 is a separately authorized `CI_TEST_INFRASTRUCTURE` prerequisite. Its source commit freezes nine ordinary groups, eleven coverage groups, and Windows W1-W7. The profile-only child has zero topology, group-verifier, Windows-verifier, ownership, dependency, timeout, or threshold diff.
  3. The new approved-profile record is an append-only 88-line addition with zero removed lines. Every older profile is byte-preserved. The new record has exact ID `phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2`, source HEAD `6a4705c0a6685c6f954a1b0db9870457122f24f4`, source kind `THREE_ARTIFACT_COMPLETE_GITHUB_HOSTED_EXECUTIONS`, and topology `ELEVEN_PROCESS_COVERAGE_WITH_INFORMATION_A3B2_AND_DREAMER_VORTOX_MARKER_PARTITIONS`.
  4. The new record freezes nine ordinary groups, eleven coverage groups, 31 physical test files, 35 workspace project-file executions, and 1,544 semantic tests. The exact coverage vector is `207 / 357 / 465 / 90 / 52 / 73 / 9 / 26 / 16 / 10 / 239`.
  5. The A3B2 split is exact and complementary: base pattern `^(?!.*\\[2B19A3B2-).*$` owns 73 tests and the positive pattern `\\[2B19A3B2-` owns 9. The verifier rejects missing, duplicate, unexpected, wrong-owner, intersection, or ambiguous identities.
  6. The workflow contains exactly the intended explicit selector: `--profile phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2`.
  7. H2 `30004324413/1`, H3 `30004295030/2`, and H4 `30007628335/1` are complete, exact-source executions with 32 unique, non-expired catalog entries each. They agree on ordinary hash `f29bed32c2c644e31aa93666406b0a8e8f7072b13135ada18782a970c069878a`, semantic hash `a56e28357c80e156709c3c1d714040d58c85a61a7c2b6fbc3e6c737738a12cf6`, and coverage-execution hash `1d6726c01527d43edd6bc9e1473268b55af54756472fb64d713ff3590d61cc3f`.
  8. All three candidates prove `1,544 / 1,544` ordinary and semantic coverage identities with zero missing, duplicate, unexpected, wrong-owner, intersection, timeout, worker-RPC, unhandled, or substantive exit-one evidence.
  9. Windows evidence is `285 / 285`, partitioned W1-W7 as `9 / 90 / 52 / 73 / 9 / 26 / 26`, with stable per-group and complete inventory hashes.
  10. The canonical coverage obligation tuple is exactly `63 / 3204 / 23 / 3204 / 1795`, with hashes:
      - `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691`
      - `d535141afb3c60331af1ca6dcd7cab6dff5df2e2f8db75e943a72ab1963d1644`
      - `4fdf762b692b151aed1686a73441f38a913ed796a6d5193021d127ed6703dbec`
      - `fc2ec99a8cbafa2b2a4bb6fef99430a72d83bdf1da74cca00b38000400c5691e`
      - `6d8ba5d94a86dddf1b045f73e58e4e2c826bcf7c6d004a8ed7fd8d575aa315f5`
  11. Every H2/H3/H4 pair returns `COVERAGE_SEMANTIC_OBLIGATIONS_EQUAL`. The differing raw `coverage-final.json` byte hashes reflect non-contractual positive-hit counts/serialization and do not relax coverage: any newly zero-hit source obligation, missing source file, ambiguous profile match, or selector mismatch still fails the exact count-and-hash gate. No threshold or coverage-universe exclusion changed.
  12. H1 is correctly excluded as `ARTIFACTS_NO_LONGER_RETRIEVABLE_AFTER_FULL_RERUN / NOT_A_TEST_FAILURE / NOT_INCLUDED_IN_ARTIFACT_HASH_SET`; it contributes no candidate hash or authority.
  13. The one close and one reopen occurred at `2026-07-23T12:35:52Z` and `2026-07-23T12:35:56Z`. The head, base, PR body hash, metadata, and repository bytes remained unchanged across that operation; H4 is the resulting authorized replacement PR event.
  14. Exact-head push run `30009851150` and pull-request run `30009855365` both target `a8f17e4d62b500550d1092ec1bff19fac05ebf9a`, attempt 1, and completed successfully without rerun. Each has 24/24 successful jobs: validation, nine ordinary shards plus merge, eleven coverage shards plus merge/exact-profile validation, and Windows deterministic W1-W7 evidence.
  15. CI actually executed the claimed gates. Successful steps include typecheck, lint, ownership registry validation, exact blob-set validation, per-group and global merges, semantic inventory/ownership verification, exact-source profile validation, and Windows evidence upload.
  16. No runtime event shape, GameState shape, producer, replay path, prospective validation, atomic batch, receipt/idempotency boundary, retryable failure boundary, historical fact, projection, player/AI view, deterministic domain ID, or rule behavior changed. The existing A3B2 evidence continues to cover those contracts; this PR changes only their CI execution and exact evidence profile.
  17. Nine rule-consistency checks:
      - Check 1 PASS: every existing domain behavior remains traceable to its frozen rule claim; this PR adds no domain behavior.
      - Check 2 PASS: every frozen rule claim retains its test binding; no test identity or traceability mapping changed.
      - Check 3 PASS: incomplete Dreamer, Philosopher, Mathematician, and Vortox mechanisms remain explicitly `PARTIAL` or `NOT_STARTED`.
      - Check 4 PASS: no unimplemented mechanism is presented as complete; no role coverage promotion occurs.
      - Check 5 PASS: official first/other-night ordering remains unchanged and consistent with the pinned nightsheet.
      - Check 6 PASS: historical/current-state and character-change handling is unchanged; existing replay and legacy-history contracts remain intact.
      - Check 7 PASS: drunk, poisoned, Vortox, and Storyteller-discretion semantics are unchanged and remain bounded by the frozen evidence and explicit unsupported list.
      - Check 8 PASS: Chinese Wiki, official Wiki, user override, and official nightsheet revisions and hashes are recorded and independently verified.
      - Check 9 PASS: green tests were not used as rule truth; the live external sources, evidence, nightsheet, design, traceability, and role matrix were independently reviewed.
  18. The PR body contains all five mandatory exact sections: `Rule Evidence`, `Rule Claims Implemented`, `Explicitly Unsupported Rules`, `Rule Source Revisions`, and `Rule-to-Test Traceability`. Its claim `ruleSemanticsChanged=false` matches the complete diff and external-rule review.

codeVerdict: `CODE_REVIEW_PASS`

ruleVerdict: `RULE_REVIEW_PASS`

remainingBlockers: `[]`
<!-- END VERBATIM ORIGINAL COMMENT BODY -->
