# Review Protocol

## Governance Traceability V1.1 Applicability

`docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md` defines Engineering Governance Traceability V1.1. On its governance PR branch the amendment is `PROPOSED_PENDING_INDEPENDENT_REVIEW`; this protocol applies its proposed requirements to that PR without claiming acceptance. Only merged governance evidence, the accepted governance tag, and any permitted post-merge docs-only closeout may record `ACCEPTED`. After acceptance, all later designs, implementations, traceability reports, and reviews must apply V1.1.

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
10. Rule evidence owns only external rule truth, source revisions, the supported/unsupported rule boundary, rule-level reachability context, and unresolved conflicts. It must not freeze a physical test title, primary layer, supporting fixture ID, or engineering traceability metadata. `requiredRegressionTests` is a rule-obligation list, not physical authority. Existing `NON_AUTHORITATIVE_ENGINEERING_TRACE_REFERENCE` markers may remain. Design, implementation traceability, this protocol, and the ADR own engineering mapping. This separation changes no BOTC rule or rule-source priority.

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

## Engineering Governance Baseline

`docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md` is the complete repository authority for reachability, trust boundaries, design freeze, final-review scope, stop-loss, two-phase traceability, CI classification, coverage terminology, and evidence authority after its governance PR is independently reviewed and merged. While the V1.1 amendment is `PROPOSED_PENDING_INDEPENDENT_REVIEW`, this protocol applies the same requirements to that governance PR without claiming post-merge acceptance. Nothing in this section weakens the rule-truth, T1 safety, persistence, replay, information-safety, deterministic, exact-head CI, or complete independent-review gates above.

### Mandatory Reachability Classification

Every future design explicitly enumerates all four classes and assigns exactly one primary class to every claimed behavior or path. Reachability, trust, and primary test layer are independent axes:

- `R1 CURRENTLY_REACHABLE_APPLICATION_PATH`: a real formal application command path is currently callable and may succeed, reject, or fail through configured or fault-injected production ports. A no-event, rejected, or rollback result can be R1. `CURRENTLY_REACHABLE_ACCEPTED_STREAM` is a deprecated pre-V1.1 descriptive alias, not a primary-layer conclusion. Only the successful full producer/accepted-events/receipt/append/rebuild/projection path is accepted-stream integration; not every R1 row is accepted-stream.
- `R2 LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`: no current producer is required, but valid accepted/imported history has an exact replay-compatibility promise and cannot be silently migrated or reinterpreted.
- `R3 HOSTILE_OR_CORRUPTED_HISTORY`: malformed, forged, orphaned, duplicate, mixed-generation, or otherwise impossible history must fail closed and must not be described as accepted-stream integration.
- `R4 FUTURE_HYPOTHETICAL_STATE`: no current producer or accepted event creates the hypothetical behavior. It may remain an extension point or unsupported behavior, but cannot be a current integration prerequisite. If a real formal command currently reports `ApplicationNotConfigured`, that reachable rejection is a separate `R1 + APPLICATION_COMMAND_INTEGRATION` path while the hypothetical behavior remains R4.

Classification order is R3 for invalid, manually tampered persisted/imported history; otherwise R1 when a real formal application path is currently callable; otherwise R2 when a valid replay promise exists; otherwise R4. A real reachable dependency, metadata, prospective-validation, append, commit-store, or receipt fault is not made R3 merely because it fails. A manually constructed state, direct event-applier call, pure resolver fixture, or hostile replay cannot prove accepted-stream integration. A slice may have distinct paths in multiple classes, but no behavior row may omit its class.

### Mandatory Trust Classification

Every design labels every callable entry point:

- `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`: commands, event envelopes, persisted/imported history, projection-viewer input, and public APIs receiving `unknown` or persisted data. Apply exact runtime shape, dense-array, proxy/getter/symbol/cycle/nonplain, canonical-ID, extra/missing-field, fail-closed, replay, and provenance requirements where the representation permits them.
- `T2 CANONICAL_DERIVED_STATE`: fully validated rebuilt `GameState`, event-applier pre-event state, and aggregates already admitted through T1. Require domain invariants, source cross-links, deterministic rebuild, reference isolation, and state consistency; do not duplicate the full hostile-object matrix in every private helper.
- `T3 MODULE_PRIVATE_PURE_CORE`: branded internal context, pure resolver, comparator, formatter internals, and candidate policy. Require closed types, determinism, boundary cases, exhaustive unions, and pure tests; do not invent a public hostile boundary, receipt, projection, producer, or full-history audit.

If one function serves multiple trust levels, split the T1 wrapper from its core or apply the stricter level to the public entry. Types alone never downgrade a real T1 or persistence boundary.

### Design Freeze And Final-Review Boundary

Before `RULE_DESIGN_PASS`, design review freezes the current PR's rule semantics, support and unsupported matrix, reachability, trust, public API, event/state, failures/receipts, replay, projection, file allowlists, size estimates, Slice coverage, Role coverage, and these exact design-time fields per criterion: `CriterionId`, `RuleClaim`, `CompletionCriterion`, `RequiredEvidenceMechanism`, `ExpectedReachability`, `ExpectedTrust`, `ExpectedPrimaryLayer`, `ExpectedResult`, and `SupportingAuthorityRequirement`. These become the PR's definition of done. A material change requires an authorized design correction or reslice; implementation cannot silently widen it.

Design does not have to freeze the final physical test title, final source line, final fixture ID, or final supporting-test name before implementation. A planned physical path or title is non-authoritative unless the design explicitly marks an already-existing authority.

Final review verifies that frozen definition on the exact PR HEAD and may classify a finding `BLOCKER` only for:

A. violation of frozen design;

B. actual P0/P1 data corruption or BOTC-rule error;

C. private-information leakage;

D. accepted replay or idempotency breakage;

E. persistence incompatibility;

F. an actually callable security or trust-boundary vulnerability;

G. false or misleading claims/tests;

H. absent, failed, stale, or wrong-SHA exact-head CI.

When an item was not frozen, future R4 producers, new generic infrastructure, a T3 hostile matrix, unreachable lifecycle, a new event/schema, Storyteller free-choice strategy, a new role interaction, general refactoring, naming improvements, and extra traceability formatting are backlog by default. The exception is a reviewer-proven P0/P1 actual R1/R2 path under B-G; the report must name that path, evidence, severity, and impact. This exception preserves real T1, persistence, replay, and privacy blockers and does not permit speculative R4 blocking.

Every finding or suggestion is exactly one of:

- `BLOCKER`: satisfies A-H and gates the current PR;
- `BACKLOG_HIGH`: serious bounded follow-up with a named risk/trigger but not a current frozen gate;
- `BACKLOG_NORMAL`: non-gating improvement.

Each finding records classification, evidence, affected reachability/trust class, frozen clause or A-H basis, and required action. An unclassified request to fix something is invalid review output.

### Slice Scope And Stop-Loss

One slice has one primary risk. The default suggested ceiling is 6 changed production files and 1,500 added production lines. Do not combine a new event system, new state system, new projection system, and generic audit system in one slice. Split a second independent infrastructure risk. CI infrastructure uses a separate PR. Docs-only status synchronization does not consume a product repair round.

Before implementation, or immediately after the first review, reslice when any condition is true:

1. previously unidentified shared infrastructure is required;
2. more than 10 production files must change;
3. estimated added production code exceeds 2,000 lines;
4. an architectural blocker remains after two design rounds;
5. a new public trust boundary is still discovered during a second repair;
6. the PR owns three or more independent subsystems;
7. a reviewer requires R4 work as the current acceptance prerequisite.

Only explicit user authorization overrides stop-loss. Repair-budget exhaustion does not imply another repair or wider scope.

### Test Layers And Two-Phase Traceability V1.1

Every completion criterion has at least one primary authority test after implementation. Test volume follows risk and boundary count, not a fixed minimum or numbered-test quota. Do not duplicate low-value tests to inflate traceability.

The only primary layers are exactly these eight, in this order:

1. `ACCEPTED_STREAM_INTEGRATION`: real successful formal command, producer, accepted events, receipt, append, rebuild, and projection.
2. `APPLICATION_COMMAND_INTEGRATION`: real formal application-command acceptance, rejection, or failure contract whose main assertion is not successful accepted-stream semantics.
3. `LEGACY_REPLAY_COMPATIBILITY`: valid R2 history retains exact meaning.
4. `HOSTILE_REPLAY_REJECTION`: manually tampered persisted/imported R3 history fails replay or rebuild closed.
5. `STRUCTURAL_VALIDATION`: direct payload, parser, exact-shape, version, ID, field, or cross-link validation.
6. `PURE_POLICY_SEAM`: deterministic selector, comparator, or policy behavior.
7. `PROJECTION`: authorized viewer output and non-leakage.
8. `CROSS_PLATFORM_CI`: required exact-head runner or platform execution.

`APPLICATION_COMMAND_INTEGRATION` requires real invocation of `GameApplicationService` or a formal application command entry and real port or failure injection. It includes actor rejection, `expectedGameVersion` rejection, malformed-command rejection through the formal entry, dependency failure, metadata failure, prospective-validation failure, append failure, commit-store failure, receipt failure, no-event/no-mutation atomicity, retryability, same-`commandId` recovery or retry, deterministic rejected receipt, and failure stage or code. It asserts events, receipts, `gameVersion`, and state outcome. Manually forged accepted history is forbidden as application authority. Reachability is usually R1 when the real command or fault path is currently callable.

Apply this exact A-G algorithm. Trust is independently classified. Entry path and main assertion decide the layer; setup alone never does.

A. Real successful command with producer, accepted events, receipt, append, rebuild, and projection: `R1 + ACCEPTED_STREAM_INTEGRATION`.

B. Real formal command rejected, or dependency, prospective validation, metadata, append, commit, or receipt fails without commit or with atomic rollback: normally `R1 + APPLICATION_COMMAND_INTEGRATION`.

C. Accepted prefix followed by manually tampered persisted/imported event, payload, history, provenance, tenure, impairment, delivery, or ledger, then replay/rebuild rejection: `R3 + HOSTILE_REPLAY_REJECTION`; prefix supporting only.

D. Direct payload, parser, exact-shape, version, ID, field, or cross-link validator: `R3 + STRUCTURAL_VALIDATION`.

E. Pure selector, comparator, or policy: actual reachability plus `PURE_POLICY_SEAM`, normally T3.

F. Viewer output or non-leakage: `PROJECTION`.

G. Exact-head runner or platform execution: `CROSS_PLATFORM_CI`.

One physical test identity, `ActualTestFile` plus `ActualTestTitle`, has exactly one primary layer. If it supports other criteria, list it only as supporting there. Split a test whose separate primary assertions require different layers.

Design-time traceability records exactly `CriterionId`, `RuleClaim`, `CompletionCriterion`, `RequiredEvidenceMechanism`, `ExpectedReachability`, `ExpectedTrust`, `ExpectedPrimaryLayer`, `ExpectedResult`, and `SupportingAuthorityRequirement`.

Implementation-time traceability retains the design expected fields and adds exactly these actual-binding fields: `CriterionId`, `ActualTestFile`, `ActualTestTitle`, `ActualPrimaryLayer`, `ActualReachability`, `ActualTrust`, `SupportingAuthorityId`, and `MechanismMatch` (`PASS|FAIL`). `SupportingAuthorityId` is `NONE` or one or more unique `SUP-<slice-or-task>-NNN` IDs, each resolving exactly once. Traceability also identifies the actual main assertion, entry, and fault mechanism sufficiently for review. `MechanismMatch=PASS` is semantic, not token equality: the actual test proves `CompletionCriterion` through `RequiredEvidenceMechanism` and the correct A-G classification.

### Traceability Correction Gate

If `ExpectedPrimaryLayer` differs from `ActualPrimaryLayer` while behavior contract and `RequiredEvidenceMechanism` are unchanged and the actual test still proves the criterion, return `TRACEABILITY_CORRECTION_REQUIRED`. This normally authorizes only a bounded docs or test-traceability repair, blocks release and final pass until corrected, and does not itself require `RESLICE`.

The mismatch is a `BLOCKER` or requires `RESLICE` when the actual test does not prove the criterion, R3 is represented as R1, a direct validator is represented as accepted integration, a claim or test is false, a new public trust boundary appears, or behavior design must change. If `RequiredEvidenceMechanism` changed, `MechanismMatch` is `FAIL` and the correction exception is forbidden.

The reviewer reports the old layer, new layer, `RequiredEvidenceMechanism`, `behaviorDesignChanged`, `ruleSemanticsChanged`, and complete `remainingBlockers`.

### Supporting Authority Gate

At design time, `PLANNED_SUPPORTING_AUTHORITY` records purpose, expected accepted/legacy/hostile status, mutation expectation, and consuming `CriterionId` values. No final unique ID, file, or title is required before implementation.

At implementation time, every support receives one unique `SUP-<slice-or-task>-NNN` ID and records `SupportingAuthorityId`, `Producer`, `SourceTestOrFixture`, `AuthorityStatus` (`ACCEPTED|LEGACY|HOSTILE`), `UsedByCriteria`, and `MutationDisposition` (`NONE|CLONE_MUTATED|PERSISTED_OR_IMPORTED_MUTATED`). An optional fixture hash or revision may be recorded when persisted. Every referenced ID resolves exactly once. Supporting authority never determines the primary layer or substitutes for the primary test. An accepted source remains accepted support when a clone is mutated; the mutated artifact is classified by the primary mechanism.

### Governance Traceability Review Checks

- A new layer must not weaken accepted replay, persistence, or provenance.
- R3 hostile history cannot become R1.
- Dependency, metadata, prospective-validation, append, commit-store, and receipt failures must match their real formal application mechanism.
- Accepted-stream success remains independent from application-command failure authority.
- Design need not invent nonexistent physical tests, titles, fixture IDs, or support IDs.
- Actual mapping and semantic `MechanismMatch` are mandatory after implementation.
- False claims or tests remain blockers.
- Supporting IDs are unique, resolvable, and complete.
- The governance amendment changes no BOTC rule, product behavior, test, workflow, dependency, or role coverage.
- No traceability correction may hide or relax a slice's frozen behavior, API, schema, failure, replay, projection, allowlist, size, or coverage contract.

### Coverage And Acceptance Terminology

Keep three independent axes:

- Slice coverage: `FOUNDATION`, `SKELETON`, `PARTIAL`, `COMPLETE`;
- Role coverage: `NOT_STARTED`, `SKELETON`, `PARTIAL`, `COMPLETE`;
- PR acceptance: `UNACCEPTED`, `ACCEPTED`.

A foundation or infrastructure slice does not automatically raise or lower a role. Role coverage changes only from accepted player-visible role behavior. Accepted V1 behavior is not downgraded because V2 is missing. Unmerged PRs do not change accepted role coverage. Final reports name both Slice coverage and Role coverage, and neither substitutes for PR acceptance.

### CI Classification And Repair Accounting

Classify every CI failure:

- `CI_PRODUCT_FAILURE`: product assertions, type/lint defects, product behavior, or frozen-contract failures; consumes product repair.
- `CI_TEST_INFRASTRUCTURE_FAILURE`: sharding, worker RPC, deterministic runner plumbing, or a stable long-test budget; use a separate infrastructure PR and do not consume product repair.
- `CI_EXTERNAL_RUNNER_FAILURE`: runner/platform/service failure outside the repository; retry or wait with exact evidence and do not report it as a rule failure.

Do not raise global timeout in a product PR as an incidental fix. A single-test budget infrastructure PR is allowed only when repeated evidence shows the exact same test and timeout, no assertion/unhandled/coverage failure, and unchanged test body and expectations. CI failure is not a BOTC rule failure without independent rule evidence.

### Evidence Authority Order

When records conflict, use this stage-aware order; a not-yet-existing item contributes no authority:

1. GitHub live PR HEAD;
2. exact-head CI for that SHA;
3. complete final-review comments whose markers and report `reviewedHead` equal that SHA;
4. merge commit;
5. accepted tag;
6. post-merge main closeout;
7. PR body;
8. branch status docs;
9. chat or controller memory.

PR body is not a substitute for final-review verdicts. A commit after final review invalidates the review and comments. Feature-branch docs do not self-reference their future SHA. Do not create repeated feature docs commits merely to record CI IDs; record them in GitHub evidence or post-merge closeout. A docs-only closeout inherits no CI from another SHA.

## Role Coverage Gate
1. `docs/rules/ROLE_COVERAGE_MATRIX.md` records, for every role, base ability, first-night behavior, other-night behavior, drunk behavior, poisoned behavior, Vortox interaction, Philosopher interaction, character-change interaction, alignment-change interaction, death interaction, Storyteller discretion, projection behavior, and `NOT_STARTED` / `SKELETON` / `PARTIAL` / `COMPLETE` status.
2. Every merge updates the matrix from reviewed implementation evidence.
3. One working path never justifies `COMPLETE`.

## Required Evidence
1. Inspect actual Git state, PR diff and HEAD, affected production code, tests, rule sources, architecture, implementation status, and CI commands/results.
2. Every new event flow needs exact runtime payload validation, event application/replay validation, atomic batch semantics, prospective validation, and malformed/negative tests.
3. Rebuild from accepted domain events must reproduce canonical state; snapshots are caches only.
4. Shape validation is not accepted-history provenance.
5. Command inputs must not carry computed secret outcomes. Deterministic actor/phase/version/order errors may persist rejected receipts.
6. Planner, resolver, generated-event, dependency, and prospective-validation failures remain retryable and must not burn a command id. Metadata generation remains a distinct failure stage.

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
