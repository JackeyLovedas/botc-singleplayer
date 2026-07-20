# PR #41 Rule Review Final Archive

- PR: `#41`
- Frozen feature HEAD: `f90b4909c3883c3853d93cc444a823ce07078e61`
- Merge SHA: `319c93d057359eaa542507c48f9d0f74ecda6b88`
- Original comment ID: `5019081759`
- Original comment URL: `https://github.com/JackeyLovedas/botc-singleplayer/pull/41#issuecomment-5019081759`
- Original comment timestamp: `2026-07-20T05:30:10Z`
- Original comment updated timestamp: `2026-07-20T05:30:10Z`
- Original UTF-8 comment body bytes: `16147`
- Original UTF-8 comment body SHA-256: `24c6e5f07820f8e173fdd04572bda48064573d700b7e9ecf3537c82f7a5cc1f5`

## Verbatim Original Comment Body

<!-- BEGIN VERBATIM ORIGINAL COMMENT BODY -->
<!-- BOTC_FINAL_RULE_REVIEW
reviewedHead=f90b4909c3883c3853d93cc444a823ce07078e61
-->
reviewedPR: `JackeyLovedas/botc-singleplayer#41` — `Phase 3 Slice 2B19B: execute Philosopher-gained Dreamer`

reviewedHead: `f90b4909c3883c3853d93cc444a823ce07078e61`

reviewTimestamp: `2026-07-20T13:24:09.4240094+08:00`

reviewScope:
- Independent final read-only product and rule review of open, non-draft, mergeable PR #41 at exact base `5ddaa2fd02e0cb73e2a5363b222e7f08c353d389` and exact head `f90b4909c3883c3853d93cc444a823ce07078e61`.
- Bound the live PR body as UTF-8: 15,003 bytes, SHA-256 `9f7bc56311b15d8fc4f3a00eecba39897b530cb54e1c3a649b8400af6f80c379`. Its required Rule Evidence, Rule Source Revisions, Rule Claims Implemented, Rule-to-Test Traceability, and Explicitly Unsupported Rules sections are present.
- Read `AGENTS.md`, the ordered handoff set beginning at `project-handoff/00-README-FIRST.md`, `docs/agent-loop/AUTOPILOT_PROMPT.md`, `docs/agent-loop/REVIEW_PROTOCOL.md`, the governance ADR, current task/project state, frozen rule evidence/design/design review, implementation status, traceability, prior final review, both repair profiles, the two infrastructure records, current role matrix, both user authorization attachments, PR #41 metadata/body, PR #42 metadata/body/audit comments, the complete commit sequence, the complete 33-file PR diff, all affected production code and tests, relevant replay/projection infrastructure, and exact-head CI.
- Complete binary diff audit: 33 files, 11,721 diff lines, 731,425 UTF-8 bytes under the review command's LF joining, SHA-256 `277b9403b5998a05cdd93d18b15744873e970dcaedf699daf3acf77a780cc402`; `git diff --check` passed and every changed file was read. Worktree was clean; local HEAD and remote PR HEAD matched.
- Reviewed the ten-commit history from authorization through product, two product repairs, coverage profiles, the three-commit PR #42 infrastructure repair, and merge commit. All applicable AI-authored non-merge commits carry the required `Co-Authored-By: Codex GPT-5 <noreply@openai.com>` trailer.
- Independently applied all nine rule-consistency checks and the additional exact-runtime-shape, accepted-prefix/replay, atomic-batch, prospective-validation, idempotency/receipt, retry-boundary, historical-fact, player/AI leakage, deterministic ordering/ID, negative-test, documentation, and actual-CI-execution checks.
- Exact-head push run `29718224532` and pull-request run `29718226419` each completed successfully at reviewed HEAD with 23/23 successful jobs, zero failed/skipped jobs: validate, nine ordinary shards, ordinary merge, ten coverage shards, coverage merge, and deterministic Windows. All 8,354 push-log lines (1,250,444 UTF-8 bytes under LF joining) and 8,716 PR-log lines (1,286,833 bytes) were fetched and scanned. Both runs executed the requested/matched profile `phase-3-slice-2b19b-dcfa530-split-coverage-v1`, produced `COVERAGE_APPROVED_PROFILE_MATCH`, retained the non-authoritative global filtered-report collision classification, and passed the authoritative ten-group semantic audit. Across both complete logs there were zero hits for `onTaskUpdate`, `Process completed with exit code 1`, unhandled error/rejection, test timeout, SIGKILL, heap OOM, or coverage-profile mismatch.
- Independently re-read PR #42's corrected complete code- and rule-review comments at infrastructure HEAD `87d0ab3d7dc3dc9f0b8472d569a731d4a2b2e744`; both markers and reviewed heads match, both pass verdicts are present, and `remainingBlockers` is empty. PR #42 is merged by exact merge commit `f90b4909c3883c3853d93cc444a823ce07078e61` into PR #41.
- No repository file, commit, branch, PR, check, comment, or external source was modified during this review. The only written artifact is this requested repository-external review report.

productionFilesReviewed:
- `packages/domain-core/src/first-night-action-opportunity.ts` — exact V4 opportunity/source-contract runtime shape, canonical IDs, provenance cross-links, clone/equality, opening producer, and OPEN/CLOSED lifecycle.
- `packages/domain-core/src/dreamer.ts` — V3 target and V5/V6 delivery shapes, gained-source capability, settlement-time target truth, current effective Vortox constraint, native GOOD/EVIL candidate selection, deterministic code-unit ordering, cloning/equality, and fail-closed unsupported contexts.
- `packages/domain-core/src/domain-batch-semantics.ts` — exact three-event target/delivery/settlement batch, same batch/command/version metadata, pre-event reconstruction, canonical delivery equality, and partial/reordered/duplicated/cross-command rejection.
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts` — gained V2 ability identity, V4 opportunity evidence, canonical V5/V6 re-derivation, Philosopher tenure and Vortox evidence, exact 11/13-reference facts, and historical accepted-event derivation.
- `packages/application/src/game-application-service.ts` — validation, capability preparation, exact three-event creation, prospective domain validation/application, atomic accepted commit, rejected receipts, retryable fault boundaries, and idempotent receipt replay.
- `packages/projections/src/index.ts` — V5/V6 state-only provenance rejection and accepted-event-stream player/AI projection with exactly target, GOOD role, and EVIL role.
- Relevant unchanged authorities read with those diffs: `packages/domain-core/src/rebuild.ts` and `packages/domain-core/src/mathematician-internal.ts`, including stream validation, consecutive batch validation, event application, accepted-stream reconstruction, stored delivery/fact/settlement validation, and projection replay entry point.
- CI/infrastructure merged into reviewed HEAD: `.github/workflows/ci.yml`, `scripts/collect-vitest-shard-diagnostics.mjs`, `scripts/verify-vitest-coverage-groups.mjs`, `scripts/verify-coverage-obligations.mjs`, and `scripts/vitest-ownership-contracts.mjs`. The split changes no `packages/**` file, test, fixture, dependency, lockfile, timeout, retry, worker/pool, coverage subset, threshold, or ordinary nine-group topology. The collector self-test and 22/22 ownership self-test passed locally; changed verification scripts passed ESLint.

testFilesReviewed:
- `packages/application/src/game-application-service.test.ts` — all ten changed `[2B19B-*]` integration authorities, including real V2 gain/V4 open, no synthetic Dreamer tenure, same-opportunity OPEN-to-CLOSED, V5/V6 GOOD/EVIL settlement, real revision change, native-Dreamer impairment isolation, accepted-stream bridge, exact ledger evidence, hostile persisted prefixes/batches, state-only projection rejection, player/AI non-leakage, real receipt/read/load/metadata/prospective/commit faults, same-command recovery, V1 compatibility, the intervening accepted Seamstress `DEFER`, and stopping before Mathematician settlement.
- `packages/domain-core/src/dreamer.test.ts` — exact 17/21/22-key target/delivery shapes and nested negatives, cross-version rejection, native category semantics, reversed-catalog determinism, starved-category failure, Traveller rejection, source/Vortox impairment fail-closed behavior, hostile objects/getters, deep cloning/equality, and the source-text nondeterminism audit.
- `packages/domain-core/src/first-night-action-opportunity.test.ts` — task/grant/ability ID round-trips, exact 13-key V4/19-key source/11-key instance/8-key grant/11-key insertion/5-key visibility carriers, missing/extra/cross-link negatives, hostile objects/getters, and nested clone/equality coverage.
- `docs/implementation/phase-3-slice-2b19b-test-traceability.md` — all 80 unique rows `C01-C60` and `S01-S20`, ten supporting authorities, PASS mechanism bindings, zero multi-primary conflicts, and explicit C58 sequence.
- `vitest.workspace.ts` and ownership/verifier configuration as exercised by CI: ordinary nine-group inventory is complete; coverage ten-group split selects Dreamer/Vortox core 16 and gained 10 with exact complements and a 1,520-test authoritative semantic union. Exact-head logs show zero missing, duplicate, unexpected, ambiguous, wrong-owner, or failed identities.
- Exact-head CI executes the claimed checks rather than merely declaring them: both push and PR runs have 23/23 successful jobs, coverage diagnostics/blob upload/enforcement steps succeed for all ten coverage shards, ordinary and coverage semantic gates run, the exact profile matches, and Windows deterministic coverage passes.

ruleEvidenceReviewed:
- `docs/rules/USER_OVERRIDES.md`; no applicable override conflicts with this slice.
- `docs/rules/evidence/2B19B.md`, SHA-256 `e1f038f32171d7cea1f89345b1cac958e30a79f47005ca444a0dc2633abe3187`, verdict `RULE_READY`, conflict list empty, coverage `PARTIAL`.
- `docs/implementation/phase-3-slice-2b19b-design-round-2.md`, SHA-256 `f915fd4c51c21cd7d43a873cf6345bccd97462431ba6631f161ae58077ece10b`, and `phase-3-slice-2b19b-design-review-round-2.md`, verdict `RULE_DESIGN_PASS`.
- `docs/rules/ROLE_COVERAGE_MATRIX.md`: Dreamer `PARTIAL`, Philosopher `PARTIAL`, Mathematician `PARTIAL`, Vortox `NOT_STARTED`; no incomplete role is marked `COMPLETE`.
- User authorizations read completely: Round 1 attachment SHA-256 `0c756ee84158f1338709e95bb2bc6aea52bf1687e855be879bfa3c6b54f2b905`; Round 2 attachment SHA-256 `74816939bf33f3a0dead36a96f06f13fc29c626468a8db1947ce603de05abe82`.
- Independently fetched and read the fixed official BOTC Wiki raw pages: Philosopher SHA-256 `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`, Dreamer `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`, Vortox `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`, States `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`, and Abilities `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40`; all match recorded evidence.
- Independently fetched and read the fixed Chinese Wiki raw pages: home `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49`, Philosopher `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be`, Dreamer `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`, Vortox `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`, drunk `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e`, and poisoned `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0`; all match recorded evidence.
- Independently fetched the fixed official nightsheet revision `915347e627c3f6cd1f438f82b6001784e11b3e8b` and current live main; both are 2,923 bytes with SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`. First-night order has Philosopher index 13, Dreamer 60, Mathematician 76, Vortox absent; other-night order has Philosopher 10, Vortox 46, Dreamer 78, Mathematician 95.
- External text confirms the implemented boundary: Philosopher gains another character's ability without becoming that character and uses it at that ability's normal wake; Dreamer chooses another non-Traveller and learns one good and one evil role with exactly one correct; effective Vortox makes Townsfolk ability information false, including for drunk/poisoned Townsfolk. No source drift or conflict was found.

findings:
- blockerFindings: `[]`
- backlogFindings: `[]`
- Code requirement — runtime shapes and dispatch: PASS. V4/V3/V5/V6 variants are closed, exact, cross-linked, cloned, and version-dispatched without base/gained fallthrough.
- Code requirement — accepted prefix and replay integrity: PASS. Grant, insertion, source Philosopher tenure, ability instance, source/evaluation revisions, target, Vortox tenure/effectiveness, opportunity, delivery, settlement, and ledger fact are reconstructed from accepted history; hostile stored mutations and a role-tenure prefix mutation fail closed.
- Code requirement — atomicity and prospective validation: PASS. Success is exactly target choice, information delivery, and settlement in one batch. Partial, reordered, duplicate, cross-batch, cross-command, and cross-version combinations reject, and the application validates batch semantics plus prospective event application before one atomic commit.
- Code requirement — idempotency, receipts, and retry boundaries: PASS. Receipt-read/event-load/rebuild/metadata/prospective/before-commit/during-commit/rejected-receipt failures append no accepted unit and do not create a false receipt; repair permits the identical command to succeed once and later return idempotently.
- Code requirement — historical facts and projection: PASS. Ledger facts re-derive from pre-event history with exact evidence sets. Player and AI views use the accepted-stream builder, reveal only target/GOOD/EVIL to the actual source, do not reveal audit/reliability/source-contract facts, and isolate caller mutation; state-only V5/V6 projection fails closed.
- Code requirement — determinism: PASS. Role candidate selection uses stable code-unit comparisons, reversed catalog order yields the same pair, and source audits forbid locale, clock, random, and UUID primitives. Event metadata remains supplied by the injected deterministic ports and canonical queue/commit architecture.
- Code requirement — tests and CI: PASS. Negative tests cover every material hostile boundary and all six prior-review gaps. Exact-head push and PR CI each execute and pass 23/23 jobs; the ten-group coverage semantic union and exact frozen profile match are authoritative. The PR body’s pre-review `PENDING` exact-CI wording makes no false PASS claim and is superseded by the live exact-head CI records reviewed here.
- Rule-consistency check 1 — every implemented behavior traces to an evidence-backed rule claim: PASS.
- Rule-consistency check 2 — every implemented rule claim has a concrete primary regression test: PASS; `C01-C60` and `S01-S20` are unique and all mechanism matches pass.
- Rule-consistency check 3 — unsupported behavior is explicitly marked and kept fail-closed: PASS; source impairment success, impaired/dead Vortox, No Dashii derivation, Storyteller discretionary pair choice, Traveller, other-night/lifecycle, combined Mathematician settlement, and later phases remain unsupported.
- Rule-consistency check 4 — code and documentation do not pretend unsupported roles are complete: PASS; Dreamer/Philosopher/Mathematician remain `PARTIAL` and Vortox remains `NOT_STARTED`.
- Rule-consistency check 5 — night order matches the official nightsheet: PASS; gained Dreamer occupies Dreamer's normal first-night position, and the slice stops before the later Mathematician boundary.
- Rule-consistency check 6 — current versus historical character state is correct: PASS; target truth and delivery use settlement-time current state, while stored delivery and ledger knowledge remain immutable historical facts and are not recomputed from later state.
- Rule-consistency check 7 — drunkenness, poisoning, Vortox, and Storyteller discretion are not oversimplified: PASS within the frozen boundary. Native Dreamer DRUNK does not transfer to the Philosopher source; source impairment and impaired Vortox fail closed; effective Vortox forces both shown roles false; Storyteller discretionary pair selection remains explicitly unsupported.
- Rule-consistency check 8 — source revisions, hashes, and current live comparison are recorded and independently verified: PASS.
- Rule-consistency check 9 — green tests do not replace rule review: PASS; official/Chinese rule text, official nightsheet, rule evidence, design, overrides, and coverage matrix were independently reviewed in addition to CI.
- Prior final-review blockers F01-F06: CLOSED. Primary layers are singular, accepted-stream authorities are real, C04/C05/C09/C10/C16/C18/C58 are materially bound, the receipt/fault matrix is complete, S20 audits the real source, and current CI/body authority is honestly scoped.
- overallControllerDecision: `PASS` because and only because both independent pass verdicts below are present and `remainingBlockers` is empty.

codeVerdict: `CODE_REVIEW_PASS`

ruleVerdict: `RULE_REVIEW_PASS`

remainingBlockers: []

<!-- END VERBATIM ORIGINAL COMMENT BODY -->
