# Phase 3 Slice 2B20A Design Release Review

## Archive Metadata

- reviewedHead: `313a39a614a2a46a1026e3a272879cbcdd49324b`
- reviewedAppendixSha256: `ea202534324ac9ce691b29078ab9fb342047b345d63a6cab08e3dca4249e08fb`
- reviewTimestamp: `2026-07-24T06:57:19.3439717Z`
- archivedBody: `VERBATIM_INDEPENDENT_READ_ONLY_REVIEWER_OUTPUT`

## Verbatim Reviewer Report

reviewedHead: `313a39a614a2a46a1026e3a272879cbcdd49324b`

reviewedAppendix: `docs/implementation/phase-3-slice-2b20a-traceability-classification-correction-v1.md`

reviewedAppendixSha256: `ea202534324ac9ce691b29078ab9fb342047b345d63a6cab08e3dca4249e08fb`

reviewTimestamp: `2026-07-24T06:57:19.3439717Z`

reviewScope: `Phase 3 Slice 2B20A design-release review only; independent, read-only; no implementation, edits, commits, pushes, PR operations, or merge actions`

reviewedAuthorities:

- Round 2 design: `docs/implementation/phase-3-slice-2b20a-design-round-2.md`
  - SHA-256: `22c79b8965549a2c32cb2c9199aa1a020fbb17ca3dc1af0b9e080d8825ae120f`
- Round 2 review: `docs/implementation/phase-3-slice-2b20a-design-review-round-2.md`
  - SHA-256: `4b8b24d65ebd8a806bcdeecc73d343780866b1526254706e053e101e6f1c44d3`
- Resolved evidence: `docs/rules/evidence/2B20A-resolved.md`
  - SHA-256: `47e6c5a70b1eae70f51e9a4e0d78c8ab0d2ddf272babb3f9c76e51970c893189`
  - terminal: `RULE_READY`
  - unresolved conflicts: none

documentsReviewed:

- `AGENTS.md`
- `project-handoff/00-README-FIRST.md`
- `project-handoff/PROJECT_HANDOFF.md`
- `project-handoff/PRODUCT_SCOPE.md`
- `project-handoff/RULES_BASELINE.md`
- `project-handoff/ARCHITECTURE_INPUT.md`
- `project-handoff/IMPLEMENTATION_GUARDRAILS.md`
- `project-handoff/OPEN_RISKS.md`
- `project-handoff/DEVELOPMENT_ROADMAP.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/architecture/2B20A-go-no-go-under-governance-v1.md`
- `docs/implementation/phase-3-slice-2b20a-design-round-2.md`
- `docs/implementation/phase-3-slice-2b20a-design-review-round-2.md`
- `docs/implementation/phase-3-slice-2b20a-traceability-classification-correction-v1.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `.github/workflows/ci.yml`
- `package.json`
- complete branch diff from accepted base `5a69c90f2d3947556ff45c15c467902b1e28ca43`
- complete HEAD commit scope for `313a39a614a2a46a1026e3a272879cbcdd49324b`

externalRuleEvidenceReviewed:

- Independently retrieved and read all pinned Chinese Wiki revisions for 首页, 筑梦师, 哲学家, 醉酒, 中毒, 数学家, and 涡流.
- Independently retrieved and read all pinned official BOTC Wiki revisions for Dreamer, Philosopher, States, Rules Explanation, Glossary, Mathematician, and Vortox.
- Independently retrieved the official nightsheet at commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`.
- Every retrieved byte hash matched the hash recorded in resolved evidence.
- Confirmed first-night ordering: Philosopher `14`, Dreamer `61`, Mathematician `77`.
- Confirmed Dreamer output remains one good and one evil character, exactly one correct when effective.
- Confirmed a drunk character has no ability while the Storyteller simulates it and may supply true or false structurally valid information.
- Confirmed Mathematician counts players whose ability worked abnormally because of another character.
- No source conflict, revision drift, rule change, override change, or nightsheet change was found.

productionFilesReviewed:

- `packages/domain-core/src/dreamer.ts`
  - capability resolution, deterministic pair policy, payload construction, exact validators, clone/equality contracts
- `packages/domain-core/src/domain-batch-semantics.ts`
  - prospective re-resolution and atomic target/delivery/settlement semantics
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
  - fact derivation, exact structural validation, canonical-source validation and evidence cross-links
- `packages/application/src/game-application-service.ts`
  - formal `SubmitDreamerAction` boundary, serial execution, receipts, idempotency, retryable failures, prospective validation and atomic commit
- `packages/projections/src/index.ts`
  - accepted-stream private projection, state-only guards, player/AI information separation
- `packages/domain-core/src/event-applier.ts`
  - explicitly unchanged generic validated-union application path; confirmed the design does not require it to change

testFilesReviewed:

- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

implementationStatusReviewed:

- Production and tests remain unchanged.
- Current reachable `[2B19A3A-C17]` path reaches the exact canonical Philosopher-caused drunk base Dreamer state.
- The current formal command returns retryable, receipt-free and mutation-free `ApplicationNotConfigured`.
- No target, delivery, settlement, receipt, stream append or version mutation occurs; the opportunity stays open and the task stays pending.
- No implementation status document exists because implementation remains unauthorized at this review point.
- Dreamer, Philosopher and Mathematician remain `PARTIAL`; Vortox remains `NOT_STARTED`. No incomplete role is marked `COMPLETE`.

ciReviewed:

- Current branch has no upstream, no PR and no GitHub Actions run for reviewed HEAD `313a39a614a2a46a1026e3a272879cbcdd49324b`.
- This HEAD is documentation/control-only and makes no exact-head CI pass claim.
- `.github/workflows/ci.yml` actually configures:
  - frozen pnpm `11.7.0` and Node `24.15.0`;
  - typecheck and lint;
  - nine ordinary test shards plus merged inventory/ownership verification;
  - eleven coverage shards plus merged semantic and coverage-profile verification;
  - Windows deterministic setup, assignment, knowledge, replay, projection, task and application evidence.
- Future C32 remains an implementation-time exact-head requirement. Absence of CI at this preimplementation design-release review does not falsely satisfy it and is not a release blocker.

affectedCriterionAudit:

- Inactive immutable historical criteria: `C02,C08,C09`.
- Exact active set:
  `C01,C03,C04,C05,C06,C07,C10,C11,C12,C13,C14,C15,C16,C17,C18,C19,C20,C21,C22,C23,C24,C25,C26,C27,C28,C29,C30,C31,C32,C33,C34,C35,C36,C37,C38,C39,C40`.
- Mechanical audit result: `37` rows, `37` unique IDs, no missing IDs and no duplicate IDs.
- Each C34–C40 row contains exactly nine design-time fields.
- No `ActualTestFile`, `ActualTestTitle`, actual primary layer/type, `SupportTestIds`, physical owner or executed-result claim was fabricated.

Corrected mapping:

| Historical | Active replacements | Primary classification |
|---|---|---|
| C02 | C34 | `R1 / T2 / PURE_POLICY_SEAM` |
| C02 | C35 | `R1 / T1 / ACCEPTED_STREAM_INTEGRATION` |
| C02 | C36 | `R1 / T1 / APPLICATION_COMMAND_INTEGRATION` |
| C08 | C37 | `R1 / T1 / ACCEPTED_STREAM_INTEGRATION` |
| C08 | C38 | `R3 / T1 / STRUCTURAL_VALIDATION` |
| C08 | C39 | `R3 / T1 / HOSTILE_REPLAY_REJECTION` |
| C09 | C40 | `R1 / T1 / APPLICATION_COMMAND_INTEGRATION` |

Conflict and duplication audit:

- C34 does not duplicate C01/C03–C05: it owns only direct exhaustive capability-policy classification.
- C35 owns the complete accepted product chain; C01/C03–C05 remain setup, truth-class and atomic-settlement assertions.
- C36 refines C15 with the adjacent-state formal rejection matrix; it does not replace the distinct builder/dependency failure boundary.
- C37 adds explicit base-Dreamer-only attribution, Philosopher zero and no-double-count assertions beyond C07’s FALSE outcome assertion.
- C38 isolates direct malformed fact cross-link rejection from C24’s accepted-history evidence mutation coverage.
- C39 owns coordinated persisted-history attribution substitution and is not accepted-stream success evidence.
- C40 owns the real no-delivery command boundary; it does not claim an accepted stream.
- C25–C29 retain independent projection ownership.
- No active row has conflicting reachability, trust or primary-layer assignments.

releaseChecklist:

1. **PASS — behavior unchanged.** Appendix and HEAD diff contain documentation/control changes only; the V7 contract, command, events, ledger and projection behavior remain the frozen Round 2 design.

2. **PASS — rule evidence unchanged.** Resolved evidence hash is unchanged, independently verified sources still agree, and its terminal state remains `RULE_READY`.

3. **PASS — original criterion IDs preserved.** C02/C08/C09 remain immutable historical rows and are explicitly inactive rather than rewritten or deleted.

4. **PASS — exactly one primary per corrected criterion.** Each C34–C40 row has one mechanism, reachability, trust, primary layer and result.

5. **PASS — reachability/trust match the mechanism.** C34 is a reachable canonical-derived-state policy seam; command and accepted-stream rows use R1; malformed or persisted-history attacks use R3/T1.

6. **PASS — success and failure are separated.** C35 owns real accepted success, while C36 owns adjacent formal failures.

7. **PASS — hostile replay is not accepted evidence.** C39 begins from an accepted seed but its primary evidence is the rejection of mutated persisted history.

8. **PASS — validator is not application integration.** C38 is explicitly structural validation at an unknown/persisted-input boundary.

9. **PASS — pure policy is not accepted-stream integration.** C34’s primary assertion invokes the deterministic resolver directly. Its accepted prefix is supporting context only and does not decide the primary layer. `R1/T2/PURE_POLICY_SEAM` is valid because the resolver consumes already canonical, derived aggregates and performs no command, append, receipt or projection operation.

10. **PASS — projection remains independent.** C25–C29 retain projection ownership; C35’s projection check is only the final consumer in the complete accepted success chain.

11. **PASS — compound criteria were atomized.** C02 became C34/C35/C36; C08 became C37/C38/C39; C09 became C40.

12. **PASS — supporting authority remains non-primary.** Each supporting item states purpose, status, mutation and consumer and explicitly cannot determine the primary classification.

13. **PASS — no implementation-time traceability was fabricated.** The appendix contains expected design fields only and defers actual test identities, support IDs, ownership and results.

14. **PASS — implementation traceability is materializable.** Every corrected row maps to an existing production seam and an allowed test file: resolver matrix, formal command success/failure, rebuild/ledger attribution, direct fact validator and hostile replay.

15. **PASS — blockers empty.** The previous classification defects are fully closed without rule, behavior, scope, override, production, test, infrastructure or design-round expansion.

findings: `[]`

designReleaseVerdict: `DESIGN_RELEASE_PASS`

remainingBlockers: `[]`

DESIGN_RELEASE_PASS
