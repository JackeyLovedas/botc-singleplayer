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

Final PR review must return both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS`. Either missing token blocks merge. `PASS` is permitted as the overall controller decision only when both tokens are present; otherwise use `FIX_REQUIRED` or `HUMAN_BLOCKED` as applicable.

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
2. Required Ubuntu and Windows CI steps demonstrably execute and pass.
3. Reviewer returns both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS`, the overall decision is `PASS`, reviewed HEAD equals PR HEAD, no blocker remains, and worktree is clean.
4. Never delete or weaken tests, merge around a gate, or start the next slice early.
