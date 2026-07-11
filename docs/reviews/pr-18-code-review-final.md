# PR #18 code review archive

- PR: `18`
- Frozen feature HEAD: `8f88250273cd119089ba3529aa27724d99d11306`
- Merge SHA: `8a7ba648513a84e3a91dcd2d268634440cf27585`
- Original comment URL: https://github.com/JackeyLovedas/botc-singleplayer/pull/18#issuecomment-4942851565
- Original comment timestamp: `2026-07-11T05:56:36Z`
- Original UTF-8 comment body SHA-256: `10c0fe3ef6853554efdf38d9c632c252fcb5a345d33bcbc294beed4f79689ff5`

## Original comment body

The bytes between the delimiters are the exact UTF-8 GitHub comment body. They are preserved verbatim without normalization.

<!-- BEGIN EXACT ORIGINAL COMMENT BODY -->
<!-- BOTC_FINAL_CODE_REVIEW
reviewedHead=8f88250273cd119089ba3529aa27724d99d11306
-->
## reviewedPR

PR #18 — `phase-3/cerenovus-first-night-madness-marker` into `main`

## reviewedHead

`8f88250273cd119089ba3529aa27724d99d11306`

## reviewTimestamp

`2026-07-11T13:53:14.8451643+08:00`

## reviewScope

Independent final code-and-rule review of the complete PR body and all 34 files in `main...8f88250273cd119089ba3529aa27724d99d11306`, based on merge base `db1f09cc35b51f92f6e84ad8cd9c3cb1150983d0`.

The review independently verified:

- Exact local HEAD, remote branch HEAD, and PR `headRefOid` equality.
- Clean worktree and clean `git diff --check`.
- Complete production, test, evidence, design, review, status, matrix, and controller-document scope.
- Evidence SHA-256 `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`.
- Round-2 design SHA-256 `6d790e201347222621b8cfb5afeee77d3e0224faa4c438b9f67c1994edeb12a0`.
- Round-2 `RULE_DESIGN_PASS` artifact SHA-256 `3519e696c42a2b83a8822611bceb2c279390759f97193836e4009bb5e177c8f8`.
- Historical final-review report SHA-256 `24fc958b2df03c6a0d55d2d2cfa6e7b4a0f05d7847a3e52fec32056a75abe254`.
- Full PR sections: Rule Evidence, Rule Claims Implemented, Explicitly Unsupported Rules, Rule Source Revisions, Rule-to-Test Traceability, validation, CI, and next gate.
- Exact-head push CI run `29141710268` and pull-request CI run `29141711653`; both targeted the reviewed HEAD and completed successfully on Ubuntu and Windows.
- Independent local focused run: 5 files, 296 tests passed.
- Forbidden nondeterministic identity primitives were absent from changed production files.

## productionFilesReviewed

- `packages/application/src/command-result.ts`
- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/cerenovus.ts`
- `packages/domain-core/src/command.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/projections/src/index.ts`

## testFilesReviewed

- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/cerenovus-replay.test.ts`
- `packages/domain-core/src/cerenovus.test.ts`
- `packages/projections/src/cerenovus-private-knowledge.test.ts`
- `packages/rules-snv/src/catalog.test.ts`

## ruleEvidenceReviewed

Repository artifacts:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B16.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b16-design.md`
- `docs/implementation/phase-3-slice-2b16-effective-only-design-review.md`
- `docs/implementation/phase-3-slice-2b16-final-review-round-1.md`
- `docs/implementation/phase-3-slice-2b16-final-review-round-2.md`
- `docs/implementation/phase-3-slice-2b16-repair-round-1-design-revalidation.md`
- `docs/implementation/phase-3-slice-2b16-repair-round-1-design-review.md`
- `docs/implementation/phase-3-slice-2b16-repair-round-2-design-review.md`
- `docs/implementation/phase-3-slice-2b16-status.md`

External revisions independently retrieved and hash-verified:

- Official Cerenovus oldid `3048`
- Official States oldid `1039`
- Official Glossary oldid `2874`
- Official Abilities oldid `1376`
- Official Storyteller Advice oldid `2552`
- Official Character Types oldid `1495`
- Official Vortox oldid `3017`
- Official Goblin oldid `2976`
- Official Vigormortis oldid `3015`
- Chinese Cerenovus oldid `4198`
- Chinese Madness oldid `5883`
- Chinese Goblin oldid `6148`
- Chinese Vortox oldid `6198`
- Official nightsheet SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`

The independently retrieved SHA-256 and MediaWiki revision values matched the evidence for all 13 rule pages. The official nightsheet again yielded:

- First night: `eviltwin → witch → cerenovus → fearmonger → harpy`
- Other nights: `devilsadvocate → witch → cerenovus → pithag → fearmonger`

No source conflict was found.

## findings

1. The previous canonical-identity blocker is resolved. Cerenovus opportunity validation now requires the canonical opportunity ID’s embedded seat to equal `sourceSeatNumber`. Choice and marker validation enforce the same semantic identity, while the privacy-minimal instruction is bound through the validated opportunity/choice/marker chain.

2. The prior traceability blocker is resolved. Direct tests now cover the standalone semantic-seat mismatch, all 24 four-event permutations, independent batch/command/version/sequence mutations, a real metadata-aligned lifecycle intrusion, duplicate settlement, stored-opportunity mutations, every choice-provenance category, and combined forgery cases.

3. Projection coverage now directly tests every required missing and duplicate chain component, independent source/target/catalog/tenure/ability/identifier cross-links, semantic opportunity-seat mismatch, a combined cross-link forgery, sparse collections, and independent later source-role, source-alignment, target-role, target-alignment, and impairment variants.

4. Application failure tests directly exercise batch-ID generation, all four event-ID positions, all four clock positions, construction failure, prospective corruption, pre-commit failure, and during-commit failure. Each verifies retryability, absence of receipt and partial events, stable version, open opportunity, and successful retry with the same command ID.

5. The supported runtime-order assertion is now honest: it verifies only `WITCH_ACTION < CERENOVUS_ACTION < CLOCKMAKER_INFORMATION`. Full official adjacency remains sourced to the pinned nightsheet and is no longer represented by a tautological runtime test.

6. Prior-role regression traceability now points to real Witch, Evil Twin, Dreamer, and Seamstress execution/projection tests instead of treating task presence as behavioral coverage.

7. The effective-only production boundary remains intact. No drunk/poison simulation, Vortox transformation, character/alignment lifecycle, madness judgment, execution, cleanup, recurrence, gained-Cerenovus, jinx, UI, persistence, or Slice 2B17 behavior was introduced.

8. External rule truth supports the implemented claims: Cerenovus selects any player and an ordinary Townsfolk/Outsider; the target receives a private next-day/following-night madness instruction; Vortox false-information requirements apply to Townsfolk abilities and do not transform this Minion marker/instruction chain; character and alignment remain independent.

9. The evidence and coverage matrix explicitly preserve all unsupported mechanics. Cerenovus remains `PARTIAL`, with no incomplete role presented as `COMPLETE`.

10. Status documents intentionally avoid embedding their own future commit SHA. The reviewed design and its independent `RULE_DESIGN_PASS` explicitly authorize Git/PR `headRefOid` and exact-head GitHub checks as post-push authority. Those authorities all identify the reviewed HEAD.

11. PR #18 contains every mandatory rule-consistency section and accurately reports the frozen HEAD, evidence/design/review hashes, implemented claims, unsupported rules, source revisions, test traceability, local validation, and exact-head CI.

12. Both exact-head CI runs succeeded. Ubuntu validation passed installation, typecheck, lint, full tests, and coverage; Windows deterministic validation passed the required setup, assignment, knowledge, projection, task, system-information, and role-action chains.

13. The independent focused rerun passed all 296 tests. The worktree remained clean afterward, and no blocker or material unsupported claim was found.

## codeVerdict

`CODE_REVIEW_PASS`

## ruleVerdict

`RULE_REVIEW_PASS`

## remainingBlockers

`[]`
<!-- END EXACT ORIGINAL COMMENT BODY -->

