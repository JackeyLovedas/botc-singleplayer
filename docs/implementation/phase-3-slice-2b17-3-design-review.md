reviewedDesign/hash:
- `docs/implementation/phase-3-slice-2b17-3-design.md`
- SHA-256: `d7fee3c947fbfb1ab2e122531d9552c082a037ea5f66d0d44a6b0ff3b4f5264a`
- Hash matches the requested review target exactly.

filesReviewed:
- `AGENTS.md`
- User attachment `67e8d27b-37fc-40a9-a004-0bdda55fce15/pasted-text.txt`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/rules/evidence/2B17-2.md`
- `docs/rules/evidence/2B18.md`
- `docs/rules/evidence/2B18-prerequisite-status.md`
- `docs/implementation/phase-3-slice-2b17-2-design.md`
- `docs/implementation/phase-3-slice-2b17-2-design-review.md`
- `docs/implementation/phase-3-slice-2b17-2-status.md`
- `docs/implementation/phase-3-slice-2b17-3-design.md`
- `docs/reviews/pr-21-code-review-final.md`
- `docs/reviews/pr-21-rule-review-final.md`
- PR #21 body, final GitHub audit comments `4949730086` and `4949730164`
- PR #21 automatic review discussion `discussion_r3565486420`
- `packages/application/src/game-application-service.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/philosopher-ability.test.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/task-engine/src/first-night-task-planner.test.ts`
- `packages/test-harness/src/memory-stores.ts`

findings:
- No substantive design defect was found.
- The stated root cause is exact: the application’s legacy guard rejects only mapped roles, while `createFirstNightTaskInsertedV2Payload` currently checks for a V2 plan before resolving whether the chosen role needs an insertion.
- Moving the role-to-task lookup ahead of the plan-version check is a compatibility correction, not a role-rule change. The no-mapping path can return `undefined` after reading only `choice.chosenRoleId`, without reading plan catalog definitions or grant insertion fields.
- Legacy V1 no-mapping choices are legal under the existing choice validator and existing batch contract. The reviewed design preserves `Chosen → Granted → [AbilityImpairmentApplied] → Settled`, accepted receipt, one version increment, opportunity closure, idempotency, and replay while omitting both insertion event generations.
- The existing `createAbilityImpairmentAppliedPayload` and batch validation support the required duplicate-role DRUNK marker for a single in-play no-mapping role holder. The design requires a deterministic legal fixture and direct replay/projection assertions.
- The existing PR #21 V1 mapped-role test uses a read-only seeded store and therefore cannot prove a successful continuation. The 2B17.3 design explicitly corrects this test boundary by requiring a complete validated, writable accepted V1 stream for success, idempotency, atomic append, receipt, version, and rebuild checks.
- The application’s existing mapped-role V1 pre-gate remains intact for Snake Charmer, Clockmaker, Dreamer, Seamstress, and Mathematician. The design preserves `ApplicationNotConfigured`, `first-night-role-action`, retryability, zero events/receipt/version change, and an open opportunity.
- Mapped malformed plan/catalog/grant/provenance inputs still reach the existing V2 fail-closed validation. The early return applies only when the authoritative role mapping is absent.
- V2 mapped payloads, IDs, catalog positions, base-first ordering, source-seat/task-ID tie-break, and system-information precedence are untouched. V2 no-mapping behavior remains the same successful no-insertion path.
- The accepted V1 insertion constructor, V1 event shape, V1 IDs, `{100,1}` ordering, replay validators, and mixed-generation rejection need no modification. The design explicitly requires their regression coverage.
- No projection production change is necessary or authorized; direct regression checks are sufficient because the new behavior emits only already-supported choice, grant, optional impairment, and settlement facts.
- Current `main`, `origin/main`, and GitHub `main` equal `9a8d269fd769d41d49ea7bbf411ba2f5230e827f`; the worktree is clean, open PR count is zero, and exact-head CI `29179033213` succeeded.
- `docs/rules/evidence/2B18.md` remains unchanged at SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`. Slice 2B18 remains unauthorized with four conflicts, and no 2B19 work is present.

requiredFixes:
- None.

ruleSemanticsChanged:
- `false`

remainingBlockers:
- `[]` for Slice 2B17.3 implementation.
- The four preserved Slice 2B18 conflicts remain outside this hotfix and do not authorize resuming 2B18.

COMPATIBILITY_DESIGN_PASS
