# Phase 3 Slice 2B14 Proposed Design: Seamstress First-Night DEFER Skeleton

> This is a design artifact only. It is not implementation authorization. An independent reviewer must return `RULE_DESIGN_PASS` before a feature branch is created or production code or tests are edited.

## Baseline And Gate

- Rules baseline: Phase One v2.1.
- Design baseline: clean `main`, with local `HEAD`, `origin/main`, and GitHub truth at `cb98c7ccb071ed7b928d81f1df54d7c4835df516` when this design was materialized.
- Rule evidence: `docs/rules/evidence/2B14.md`.
- Evidence verdict: `RULE_READY`.
- Role coverage: `SKELETON`.
- The evidence reports no external source conflict and no `HUMAN_BLOCKED` condition.
- This proposal is ready only for independent source/evidence and design review. It does not authorize implementation.
- Required order remains: rule research -> materialized evidence -> `RULE_READY` -> architect design -> independent review -> `RULE_DESIGN_PASS` -> implementation.

## Objective

Implement one bounded first-night Seamstress deferral path:

```text
OpenFirstNightRoleActionOpportunity(SEAMSTRESS_ACTION)
-> FirstNightActionOpportunityCreated

SubmitSeamstressAction(DEFER)
-> SeamstressActionDeferred
-> ScheduledTaskSettled(SEAMSTRESS_DEFERRED)
```

The batch settles the current first-night Seamstress wake. It does not consume the once-per-game ability and does not schedule or implement a future recurrence.

## Rule Claims And Evidence Traceability

### `2B14-C1 — first-night wake order`

The base Seamstress wakes only when its first-night task is the next unsettled task. The sourced night order is `Dreamer -> Seamstress -> Steward`. The currently supported catalog represents Dreamer at base order `900` and Seamstress at base order `1000`; its definitions and signature remain unchanged at `canonical-first-night-task-catalog-v1:20514c1a`.

Traceability:

- `docs/rules/evidence/2B14.md` sections `sourceUrls`, `sourceRevision or oldid`, and `firstNightOrder` record the live and pinned official night-sheet sources.
- Evidence regression test 6 requires the full official order, but this slice proves only the supported catalog subset: Dreamer precedes Seamstress.
- Steward is outside the current task catalog and is not added or claimed as covered by this slice.

### `2B14-C2 — defer without consumption`

The Seamstress may defer on a night without consuming the once-per-game ability. This slice records only the historical first-night deferral and settles that wake. It creates no ability-use or ability-spent state and makes no claim that a later-night opportunity is implemented.

Traceability:

- `docs/rules/evidence/2B14.md` sections `abilityRules`, `firstNightOrder`, and `requiredRegressionTests` establish that deferral is allowed and does not consume the ability.
- This slice covers only the first-night half of evidence regression test 3. The later-night recurrence half remains unsupported.

### `2B14-C3 — unsupported input fails closed`

The only supported decision is the exact `{ kind: "DEFER" }` value. Choice input, malformed or extra input, hidden fields, the wrong task or opportunity, and unauthorized actors fail closed with no domain events and no ability-use state.

Traceability:

- `docs/rules/evidence/2B14.md` sections `abilityRules` and `requiredRegressionTests` establish that invalid choices do not consume the ability.
- This slice covers the defer boundary of evidence regression test 3 and the unsupported-input boundary portion of evidence regression test 5.
- Target-count, self-target, duplicate-target, target eligibility, and same-alignment legality remain unsupported because `CHOOSE_TWO_PLAYERS` is not implemented.

## Explicit Non-Goals

- `CHOOSE_TWO_PLAYERS`, target selection, target validation, or same-alignment information.
- Ability-spent state, `NO ABILITY`, later-night task removal, or repeat-use handling.
- Other-night recurrence.
- Alive, dead, Traveller, self, or distinct-target checks.
- Information truth, information reliability, registration, constraints, or Storyteller registration choice.
- Drunk or poisoned legal use, consumption, simulation, information generation, or recovery.
- Vortox, Barista, Spy, Recluse, Philosopher-granted execution, duplicate effects, or related jinxes.
- Character changes, alignment changes, death, resurrection, or historical information delivery.
- Storyteller target choice, AI decision policy, UI, Electron, persistence, or first-night completion.

## Known Stale Repository Contradiction

Fresh evidence says that a drunk or poisoned Seamstress who makes a legal selection still consumes the once-per-game use. Two accepted repository documents currently state the opposite:

- `project-handoff/tests/25-rule-test-cases.md`, test `SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND`.
- `docs/architecture/10-information-model.md`, which repeats the stale impaired-use example.

This is a repository defect, not an external-source conflict. It does not block this DEFER-only design because deferral is not a legal selection and does not consume the ability.

Mandatory handling:

- Do not implement, preserve, or add tests for the stale “does not spend” behavior.
- Do not edit either contradictory document during this design-materialization task.
- In a future implementation slice, correct the stale architecture example in `docs/architecture/10-information-model.md` while preserving the Phase One v2.1 handoff baseline as historical input.
- The future `docs/implementation/phase-3-slice-2b14-status.md` must record the contradiction and its bounded treatment without rewriting the handoff baseline.
- Any impaired Seamstress use requires a separate evidence-backed design review. If implementation must interpret the stale test before that review, stop and return `HUMAN_BLOCKED`.

## Opportunity Contract

The domain model adds these exact concepts:

```ts
type SeamstressActionDecisionKind = "DEFER";

type SeamstressActionOpportunityVisibility = {
  canDefer: true;
  supportedDecisionKinds: readonly ["DEFER"];
  futureUnsupportedDecisionKinds: readonly ["CHOOSE_TWO_PLAYERS"];
};

type SeamstressActionOpportunity = {
  opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION";
  taskType: "SEAMSTRESS_ACTION";
  // existing common base-role source fields
  visibility: SeamstressActionOpportunityVisibility;
};
```

The complete opportunity uses the existing common base-role source and action fields: `nightNumber = 1`, `taskId`, `taskType`, `opportunityId`, `opportunityKind`, `opportunityStatus`, `sourcePlayerId`, `sourceSeatNumber`, `sourceRole`, `sourceCharacterStateRevision`, and `visibility`.

The deterministic opportunity ID is:

```text
first-night-v1:SEAMSTRESS_ACTION:seat-<NN>:opportunity-01
```

Runtime shape validation, safe cloning, equality, deterministic-ID validation, event application, batch validation, and replay validation must all understand the new opportunity kind. The source must be a base `ROLE` task whose current player is still the exact Seamstress role snapshot. `PHILOSOPHER_GAINED_ABILITY` Seamstress tasks remain rejected.

## Command Contract

The supported command payload is exactly:

```ts
type SubmitSeamstressActionCommandPayload = {
  commandType: "SubmitSeamstressAction";
  taskId: ScheduledTaskId;
  opportunityId: ActionOpportunityId;
  decision: { kind: "DEFER" };
};
```

- The payload must have exactly the four enumerable keys shown above.
- `decision` must be a plain record with exactly one enumerable key, `kind`, whose value is `DEFER`.
- Malformed input, extra fields, or hidden Seamstress fields reject as `InvalidSeamstressActionDecision`.
- A recognized future `{ kind: "CHOOSE_TWO_PLAYERS", ... }` decision rejects as `UnsupportedSeamstressActionDecision`; it is not silently treated as malformed or as deferral.
- `OpenFirstNightRoleActionOpportunity` may be issued only by Storyteller or System for this path.
- `SubmitSeamstressAction` may be issued by the matching source Human or AI actor, Storyteller, or System.
- A Human or AI actor must match `opportunity.sourcePlayerId`; otherwise the command rejects as `ActorPlayerMismatch`.

All deterministic player or state rejections save command receipts. A deterministic rejection produces no domain events and no state mutation.

## Event And Settlement Contracts

`SeamstressActionDeferred` has this exact payload:

```ts
type SeamstressActionDeferredPayload = {
  rulesBaselineVersion: string;
  nightNumber: 1;
  taskId: ScheduledTaskId;
  taskType: "SEAMSTRESS_ACTION";
  opportunityId: ActionOpportunityId;
  decisionKind: "DEFER";
  sourcePlayerId: PlayerId;
  sourceSeatNumber: SeatNumber;
  sourceRole: RoleSetupSnapshot;
  sourceCharacterStateRevision: number;
};
```

The only valid deferral batch is exactly:

```text
1. SeamstressActionDeferred
2. ScheduledTaskSettled
```

The settlement must use:

```text
taskId = the same task id
taskType = SEAMSTRESS_ACTION
nightNumber = 1
settlementVersion = scheduled-task-settlement-v1
outcomeType = SEAMSTRESS_DEFERRED
characterStateRevision = the same source character-state revision
```

Neither event contains targets, an answer, alignment, impairment, reliability, registration, Vortox state, Storyteller choice, ability-spent state, assignment data, or current-state details beyond the exact historical source snapshot and revision listed above.

## Validation And State Transition

Before opening:

- Game is in `FIRST_NIGHT`, night 1, before day 1.
- Initialization, task plan, and current character state exist.
- Task exists, is unsettled, and is the next task.
- Task is base `ROLE/SEAMSTRESS_ACTION`, not Philosopher-gained.
- Current source player, seat, and exact Seamstress role snapshot still match.
- No matching opportunity is already open or closed.

Before deferral:

- Command payload and decision have exact shapes.
- Actor is allowed.
- Referenced opportunity exists, is open, and has `SEAMSTRESS_FIRST_NIGHT_ACTION`.
- Task, opportunity, player, seat, role snapshot, and character-state revision all match.
- Task remains next and unsettled.
- Source remains the same current base Seamstress.

After the batch:

- Opportunity is `CLOSED`.
- One `SEAMSTRESS_DEFERRED` settlement is appended.
- Assignment, setup, current character state, original task plan, impairment facts, and private knowledge remain unchanged.
- No ability-use or ability-spent state is created.
- The event log preserves the historical deferral.
- The next task is derived from the actual plan, never hard-coded.

Source impairment is neither exposed nor evaluated by this slice. It must not be interpreted as an impaired legal use.

## Atomicity, Replay, Retry, Receipts, And Determinism

- Opening is an exact one-event `FirstNightActionOpportunityCreated` batch.
- Deferral is an exact two-event batch. Both events share command metadata, `batchId`, and `gameVersion`, and their `eventSequence` values are consecutive.
- Prospective validation must apply and validate the complete batch atomically before append.
- Batch and replay validation reject a naked deferral, reversed or overlong batches, mixed events, duplicates, and any mismatch in task, opportunity, decision kind, source identity, role snapshot, character-state revision, settlement outcome, or exact payload shape.
- A settlement cannot exist without the matching deferral and closed opportunity.
- Existing role-action batch helpers may be generalized only if exact role-specific semantics remain explicit; a narrow Seamstress wrapper is also acceptable. Existing Philosopher error behavior must not regress.
- Invalid event payload or state application rejects as `InvalidSeamstressActionDeferredPayload`.
- Metadata generation failure remains `MetadataGenerationFailed` with `failureStage = event-metadata` and is retryable.
- Construction or prospective-validation dependency failure remains `DependencyExecutionFailed` with `failureStage = first-night-role-action` and is retryable.
- Append failure remains `EventStoreAppendFailed` and is retryable under the existing append boundary.
- Retryable failures do not save command receipts and do not burn the command ID.
- Deterministic validation rejections save receipts, and duplicate command IDs return the original result.
- No canonical ID or ordering may depend on `Date.now`, `Math.random`, random UUIDs, `localeCompare`, `Intl.Collator`, default environment locale, or environment-dependent iteration order.

## Projection Boundary

No production projection model is added or changed. Player and AI private views must remain structurally unchanged both after opening and after deferral.

Projection tests must prove that no player or AI private view contains any of the following:

- task or opportunity IDs;
- `SEAMSTRESS_ACTION`;
- `SEAMSTRESS_FIRST_NIGHT_ACTION`;
- `DEFER` or `SeamstressActionDeferred`;
- source character-state revision or source role snapshot;
- the future `CHOOSE_TWO_PLAYERS` decision;
- impairment, ability-use, truth, reliability, or registration details.

Canonical replay retains the opportunity, deferral, and settlement facts. Those facts are not player or AI knowledge.

## Expected Affected Files

Production:

- `packages/domain-core/src/command.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/index.ts`
- `packages/application/src/command-result.ts`
- `packages/application/src/game-application-service.ts`
- `packages/test-harness/src/builders.ts`

Tests:

- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/rules-snv/src/catalog.test.ts` only for an explicit unchanged-order regression

No production change is expected in the S&V task catalog, task planner, private projection implementation, or `GameState` fields.

Documentation:

- `docs/architecture/15-vertical-slice-plan.md`
- `docs/architecture/20-rule-execution-model.md`
- `docs/architecture/10-information-model.md` for the stale impaired-use correction
- `docs/implementation/phase-3-slice-2b14-status.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `README.md`

Workflow state/log files remain controller-owned.

## Acceptance Checks

1. A base in-play Seamstress opens only at the current `SEAMSTRESS_ACTION`.
2. The opportunity ID and safe visibility schema are deterministic and exact.
3. Philosopher-gained Seamstress execution remains rejected.
4. Exact `DEFER` from every authorized actor produces the two required events.
5. The opportunity closes and the task settles with `SEAMSTRESS_DEFERRED`.
6. No ability-spent state or information event is created.
7. Assignment, current character state, task plan, and private knowledge remain unchanged.
8. Invalid or future choice input produces a deterministic rejection, receipt, zero events, and zero state mutation.
9. Replay and batch validation reject every malformed ordering or cross-event mismatch.
10. Projection tests prove no action or deferral internals leak.
11. Existing Philosopher, Snake Charmer, Witch, Dreamer, task-order, and replay tests remain green.
12. Catalog signature remains `canonical-first-night-task-catalog-v1:20514c1a`.
13. The first-night order regression proves Dreamer precedes Seamstress in the supported catalog; documentation explicitly says Steward and full evidence test 6 remain unsupported.
14. The 2B14 status explicitly records that only the first-night half of evidence test 3 and boundary portion of test 5 are covered.

## Post-Acceptance Coverage

- Base Seamstress remains overall `SKELETON`; only a first-night `DEFER` vertical slice is added.
- Base Seamstress first-night opportunity and deferral behavior become `PARTIAL`.
- Other-night recurrence remains `NOT_IMPLEMENTED`.
- Target selection, answer settlement, truth, reliability, registration, impairment, Vortox, Barista, ability consumption, recovery, and related interactions remain unchanged and unsupported.
- Philosopher-gained Seamstress remains `SKELETON` task mapping only; execution remains unsupported.
- Projection coverage remains a `SKELETON` non-leakage boundary, not a Seamstress knowledge projection.
- Overall Seamstress role coverage must stay `SKELETON`; this slice cannot promote it to `PARTIAL` or `COMPLETE` in the role coverage matrix.

## Verification

After `RULE_DESIGN_PASS` and implementation, run:

1. Every focused test file changed by the slice with the repository file-scoped Vitest command.
2. ESLint with zero warnings for every changed TypeScript file.
3. The real `@botc/application` package test command.
4. `pnpm typecheck`.
5. `pnpm lint`.
6. `pnpm test`.
7. `pnpm test:coverage`.

Independent review must return `RULE_DESIGN_PASS` before implementation begins. Before merge, the implementation must also receive independent `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS`, required CI must be green, reviewed `HEAD` must equal PR `HEAD`, and the worktree must be clean.

## Rollback

Before merge, revert the slice commits on its feature branch. After merge, revert the merge commit; do not rewrite accepted history. No database migration is expected. If any new event type has escaped into durable streams, stop and design forward compatibility before removing its schema.

## Stop Conditions

Stop without expanding the slice if:

- independent review does not return `RULE_DESIGN_PASS`;
- implementation requires target choice, information, ability consumption, or other-night recurrence;
- the stale impaired-use test must be interpreted to continue;
- base and Philosopher-gained Seamstress opportunities cannot be distinguished;
- official order requires changing the accepted catalog signature or adding Steward;
- exact atomic replay validation cannot be preserved;
- private projection leakage appears;
- existing tests must be weakened;
- a new source conflict appears.

`PROPOSED_DESIGN_STATUS: READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`
