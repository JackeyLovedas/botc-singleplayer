# Review Protocol

## Rule-Truth Gate Before Every Slice
1. Existing code, tests, README files, repository summaries, and model memory are not rule truth and cannot independently authorize a slice design.
2. The read-only `rule-researcher` must freshly check all four sources for the proposed slice:
   - approved user rules in `docs/rules/USER_OVERRIDES.md`;
   - the user-specified Chinese Wiki at `https://clocktower-wiki.gstonegames.com/index.php?title=首页`;
   - the official BOTC Wiki at `https://wiki.bloodontheclocktower.com/`;
   - the official nightsheet at `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json`.
3. User-approved corrections take priority. Official sources control exact ability semantics and night order. The Chinese Wiki supplies Chinese terminology, localization context, and original project requirements.
4. A substantive conflict between external sources returns `RULE_CONFLICT` and immediately maps to `HUMAN_BLOCKED`; the agent must not choose an interpretation.
5. If a live source is unavailable, only an approved relevant snapshot may be used, and its path and hash must be recorded. Without one, return `RULE_SOURCE_UNAVAILABLE`, map it to `HUMAN_BLOCKED`, and do not continue from model memory.
6. The only rule-research verdicts are `RULE_READY`, `RULE_CONFLICT`, and `RULE_SOURCE_UNAVAILABLE`.
7. Before architect work, the sole writer materializes the sourced report as `docs/rules/evidence/<slice-id>.md`. It must include `sliceId`, `involvedRoles`, `sourceUrls`, `retrievalDate`, `sourceRevision` or `oldid`, `abilityRules`, `firstNightOrder`, `otherNightOrder`, `interactions`, `drunkennessRules`, `poisoningRules`, `VortoxRules`, `characterChangeRules`, `alignmentChangeRules`, `storytellerDiscretion`, `explicitOutOfScope`, `unresolvedConflicts`, `requiredRegressionTests`, and `ruleCoverageStatus`.
8. `ruleCoverageStatus` is exactly one of `SKELETON`, `PARTIAL`, or `COMPLETE`. `COMPLETE` is forbidden unless all formal mechanisms and all currently supported interactions are implemented. Dreamer remains `PARTIAL` while Vortox forced-false behavior, Storyteller false-role selection, Traveller target restriction, or complete drunk/poison information evaluation is missing.
9. Only `RULE_READY` allows the architect to design a slice.

## Rule Design Review Before Implementation
1. The reviewer independently reads the external sources or approved snapshots, current rule evidence, official nightsheet, and current `docs/rules/ROLE_COVERAGE_MATRIX.md`; the rule-researcher summary alone is insufficient.
2. The reviewer verifies that the bounded design matches sourced ability semantics, night order, interactions, impairment behavior, role/alignment changes, Storyteller discretion, explicit non-goals, and required regression tests.
3. The only design-review verdicts are `RULE_DESIGN_PASS`, `RULE_DESIGN_FIX_REQUIRED`, and `HUMAN_BLOCKED`.
4. The implementer must not create a branch or edit production code or tests without `RULE_DESIGN_PASS`.

## PR Rule-Consistency Gate
Every PR body must contain these exact sections:

- `Rule Evidence`
- `Rule Claims Implemented`
- `Explicitly Unsupported Rules`
- `Rule Source Revisions`
- `Rule-to-Test Traceability`

The reviewer must independently confirm all nine checks:

1. 每个领域行为能追溯到rule claim；
2. 每个rule claim有对应测试；
3. 未实现规则明确标为SKELETON或PARTIAL；
4. 代码没有把未实现机制伪装为完整实现；
5. 夜间顺序与官方nightsheet一致；
6. 角色变化后使用正确的历史或当前状态；
7. 醉酒、中毒、涡流和说书人裁量没有被错误简化；
8. 规则来源版本已记录；
9. 测试全绿不能替代规则验证。

Final PR review must satisfy the complete independent-output and GitHub audit-chain requirements below. The controller cannot author, synthesize, infer, or repair `PASS`, `CODE_REVIEW_PASS`, or `RULE_REVIEW_PASS`.

## Final PR Review Audit Chain

### Required Independent Reviewer Report
1. One independent read-only reviewer must return one complete, untruncated report containing all of these fields:
   - `reviewedPR`;
   - `reviewedHead`;
   - `reviewTimestamp`;
   - `reviewScope`;
   - `productionFilesReviewed`;
   - `testFilesReviewed`;
   - `ruleEvidenceReviewed`;
   - `findings`;
   - `codeVerdict`;
   - `ruleVerdict`;
   - `remainingBlockers`.
2. `codeVerdict` is exactly one of `CODE_REVIEW_PASS`, `CODE_REVIEW_FIX_REQUIRED`, or `HUMAN_BLOCKED`.
3. `ruleVerdict` is exactly one of `RULE_REVIEW_PASS`, `RULE_REVIEW_FIX_REQUIRED`, or `HUMAN_BLOCKED`.
4. `reviewedHead` must be the full current feature-branch PR HEAD. `productionFilesReviewed`, `testFilesReviewed`, and `ruleEvidenceReviewed` must explicitly enumerate the inspected files or sources. `findings` and `remainingBlockers` must be complete lists.
5. Missing fields, missing file lists, unknown verdicts, unavailable output, truncation, partial messages, summaries, or controller reconstructions never pass.
6. The final gate passes only when the report itself contains `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`, and an empty `remainingBlockers`. There is no controller-authored substitute or synthetic overall `PASS`.

### Finalization And Branch Freeze Order
1. Finish all production code, tests, docs, generated artifacts, and the entire PR body before requesting final review.
2. Push the final feature HEAD, wait for all CI associated with that exact HEAD to complete, and require every merge-gating check to succeed.
3. Freeze the feature branch before the independent reviewer begins. The reviewer inspects the final PR diff and exact frozen HEAD only.
4. No commit may follow a passing review. Any new commit invalidates the report, both published audit comments, and the old CI gate; the new HEAD requires complete CI and a new complete independent review.

### Required GitHub Publication And Re-Read
1. Publish the complete reviewer output verbatim as two separate GitHub PR comments. The only controller-added content permitted is the marker placed before the unchanged complete report.
2. The code-review comment begins exactly with:

```text
<!-- BOTC_FINAL_CODE_REVIEW
reviewedHead=<exact SHA>
-->
```

3. The rule-review comment begins exactly with:

```text
<!-- BOTC_FINAL_RULE_REVIEW
reviewedHead=<exact SHA>
-->
```

4. Re-read both comments from GitHub before merge rather than trusting the submission response or local text. Verify:
   - both comments exist and each still contains the complete untruncated report;
   - both marker SHAs and both report `reviewedHead` fields equal the current PR HEAD;
   - the report `codeVerdict` is `CODE_REVIEW_PASS`;
   - the report `ruleVerdict` is `RULE_REVIEW_PASS`;
   - `remainingBlockers` is empty.
5. Record both comment URLs and timestamps. GitHub automatic review, approvals, bots, status summaries, and generated review text are supplemental only and cannot satisfy this gate.

### Post-Merge Verbatim Archive
1. After merge, fetch both original comments again from GitHub.
2. In the post-merge docs-only closeout commit, archive them separately at:
   - `docs/reviews/pr-<PR>-code-review-final.md`;
   - `docs/reviews/pr-<PR>-rule-review-final.md`.
3. Each archive must record the PR number, frozen feature HEAD, merge SHA, original comment URL, original comment timestamp, and SHA-256 of the exact original UTF-8 comment body.
4. Preserve the exact original comment body, including its marker and complete report, in a clearly delimited verbatim section. Do not normalize line endings, reflow text, fill omissions, or reconstruct a missing comment from controller or chat memory.
5. These archive files are post-merge evidence only and must not be committed to the already frozen feature branch.

### Commit-Specific CI Records
1. Track these records independently:
   - `productHeadCI`: CI for the frozen feature HEAD used by the final reviewer and merge gate;
   - `mergeCommitCI`: CI for the exact merge commit, if such a run exists;
   - `closeoutCommitCI`: CI for the exact post-merge docs-only closeout commit, if such a run exists.
2. Each record states the exact commit SHA, run URL or identifier, completion state, result, and executed scope.
3. Never transfer a passing result from one commit to another. In particular, never claim full product CI for a closeout commit unless an independent CI run for that exact closeout commit executed that product scope.

## Role Coverage Gate
1. `docs/rules/ROLE_COVERAGE_MATRIX.md` records, for every role, base ability, first-night behavior, other-night behavior, drunk behavior, poisoned behavior, Vortox interaction, Philosopher interaction, character-change interaction, alignment-change interaction, death interaction, Storyteller discretion, projection behavior, and `NOT_STARTED` / `SKELETON` / `PARTIAL` / `COMPLETE` status.
2. Every merge updates the matrix from reviewed implementation evidence.
3. One working path never justifies `COMPLETE`.

## Required Evidence
1. Inspect actual Git state, PR diff and HEAD, affected production code, tests, rule sources, architecture, implementation status, and CI commands/results.
2. Every new event flow needs exact runtime payload validation, event application/replay validation, atomic batch semantics, prospective validation, and malformed/negative tests.
3. Rebuild from accepted domain events must reproduce canonical state; snapshots are caches only.
4. Command inputs must not carry computed secret outcomes. Deterministic actor/phase/version/order errors may persist rejected receipts.
5. Planner, resolver, generated-event, dependency, and prospective-validation failures remain retryable and must not burn a command id. Metadata generation remains a distinct failure stage.

## Information Safety
1. AI and player projections never expose canonical state, complete assignment, task-plan internals, correct-answer markers, impairment reasons, Storyteller notes, or unauthorized private conversations.
2. Validate every stored delivered-information fact before projection: exact shape, supported versions, source snapshots/catalog entries, task, and matching settlement.
3. Delivered knowledge is historical. Projection validation must not recompute old knowledge from later `currentCharacterState` or later impairments.
4. Keep semantic truth, reliability, truth constraints, registration, and simulation reason separate.

## Determinism And Rules
1. No canonical `Date.now`, `Math.random`, random UUID, `localeCompare`, `Intl.Collator`, environment locale, or insertion-order dependence.
2. Random choices record seed and candidate set; Storyteller choices record legal candidates and final choice.
3. Check the role specification and related handoff tests. Stop the feature when the rule is undefined or sources conflict.
4. Do not silently change assignment, current character state, setup, task plan, or accepted event history outside the slice contract.

## Merge Gate
1. `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:coverage` pass.
2. Required Ubuntu and Windows CI steps demonstrably execute and pass as `productHeadCI` on the frozen final feature HEAD.
3. The complete independent report, both re-read GitHub audit comments, exact reviewed-HEAD equality, pass verdicts, empty `remainingBlockers`, and clean worktree all satisfy the audit chain above.
4. No commit exists after the passing review. If HEAD changed, invalidate the old gate and rerun CI plus independent review before merge.
5. Never delete or weaken tests, merge around a gate, or start the next slice early.
