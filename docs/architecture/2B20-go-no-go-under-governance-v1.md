# Phase 3 Slice 2B20 Governance Precheck

## 1. Decision

- Slice: `2B20 — First-Night Completion and Day Entry`
- Product authorization: `USER_AUTHORIZED_2B20_FIRST_NIGHT_COMPLETION_AND_DAY_ENTRY`
- Recovery authorization: `USER_AUTHORIZED_2B20_ACCEPTED_MAIN_RECOVERY_AND_CONTINUE_EXISTING_AUTHORIZATION`
- Accepted base: `5a69c90f2d3947556ff45c15c467902b1e28ca43`
- Branch: `phase-3/first-night-completion-day-entry`
- Task type: `PRODUCT_SLICE`
- Governance verdict: `RESLICE_REQUIRED`
- Disposition: `UNACCEPTED`
- Implementation authorized: `false`
- Rule gate: `ruleReady=false`
- Design gate: `ruleDesignPass=false`
- Design round: `0 / 2`
- Repair round: `0 / 2`
- Product repair consumed: `false`
- Phase 2C started: `false`
- Pull request: `none`

The proposed combined slice cannot proceed to fresh rule research, design, implementation, branch publication, or a pull request. The stop-loss fires before the rule-evidence and design gates because the current accepted product does not guarantee that every planned first-night task can settle, and because the requested direct `FIRST_NIGHT` to `DAY_DISCUSSION` transition is not expressible by the existing phase policy.

This record is governance evidence only. It does not add or change BOTC rules, production behavior, tests, workflow, dependencies, ownership, role coverage, event schemas, or accepted history. It deliberately does not create `docs/rules/evidence/2B20.md` or `docs/implementation/phase-3-slice-2b20-design.md`.

## 2. Repository Authority Reviewed

The precheck is grounded in the exact accepted tree at the base above, including:

- project governance: `AGENTS.md`, `docs/agent-loop/AUTOPILOT_PROMPT.md`, `docs/agent-loop/REVIEW_PROTOCOL.md`, and the ordered `project-handoff/` baseline;
- rule baseline: `project-handoff/rules/03-game-flow.md` and `project-handoff/rules/10-night-order.md`;
- architecture: `docs/architecture/06-command-event-model.md`, `docs/architecture/10-information-model.md`, and `docs/architecture/15-vertical-slice-plan.md`;
- accepted Dreamer boundaries: `docs/implementation/phase-3-slice-2b19a2-status.md`, `docs/implementation/phase-3-slice-2b19a3a-status.md`, and `docs/implementation/phase-3-slice-2b19a3b2-status.md`;
- latest accepted review findings: `docs/reviews/pr-44-code-review-final.md` and `docs/reviews/pr-44-rule-review-final.md`;
- production phase authority:
  - `GAME_PHASES` and `GamePhase` in `packages/domain-core/src/game-phase.ts`;
  - `PhaseTransitionReason`, private `transitions`, `evaluatePhaseTransition`, `validatePhaseCounters`, `INTEGRATED_TRANSITION_REASONS`, and `isIntegratedTransitionReason` in `packages/domain-core/src/phase-transition-policy.ts`;
  - `PhaseTransitionedPayload` and the `PhaseTransitioned` event in `packages/domain-core/src/events.ts`;
  - `validateDomainBatchSemantics` in `packages/domain-core/src/domain-batch-semantics.ts`;
  - `PhaseTransitioned` replay/application checks in `packages/domain-core/src/event-applier.ts`;
- production first-night settlement authority:
  - `FirstNightTaskType`, `ScheduledTaskSettledPayload`, `validateFirstNightTaskProgress`, and `getNextUnsettledFirstNightTask` in `packages/domain-core/src/first-night-task-plan.ts`;
  - `validateScheduledTaskSettledPayloadForState` in `packages/domain-core/src/event-applier.ts`;
  - the command paths in `packages/domain-core/src/command.ts` and `packages/application/src/game-application-service.ts`;
  - existing queue, prospective batch validation, replay, commit, and receipt behavior;
- Dreamer capability authority:
  - `resolveBaseDreamerV2NormalCapability`, `SOURCE_REPRESENTED_IMPAIRED`, and `NO_DASHII_EFFECT_UNRESOLVED` in `packages/domain-core/src/dreamer.ts`;
  - their application mapping in `packages/application/src/game-application-service.ts`;
  - accepted tests `[2B19A3A-C17]`, `[2B19A2-C18]`, and `[2B19A2-C20]` in `packages/application/src/game-application-service.test.ts`;
- phase tests: `packages/domain-core/src/phase-transition-policy.test.ts` and `packages/domain-core/src/domain-batch-semantics.test.ts`.

The accepted PR #44 review expressly retains Dreamer, Mathematician, and Philosopher as `PARTIAL`, Vortox as `NOT_STARTED`, and the accepted Slice boundary as first-night count integration only. It does not authorize first-night completion or day entry.

## 3. Fourteen Governance Questions and Answers

### Q1. Can every planned base `DREAMER_ACTION` currently be settled?

**Answer: No.**

Base Dreamer has at least two reachable accepted states for which the task can be planned and its action opportunity can remain `OPEN`, but `SubmitDreamerAction` cannot settle it:

1. `resolveBaseDreamerV2NormalCapability(...)` returns `SOURCE_REPRESENTED_IMPAIRED` for the canonically represented Philosopher-caused `DRUNK` base Dreamer state.
2. The same resolver returns `NO_DASHII_EFFECT_UNRESOLVED` when a current No Dashii exists and its effect is unresolved.

`GameApplicationService.execute(...)` maps both capability results to retryable, receipt-free, mutation-free `ApplicationNotConfigured` at `first-night-role-action`.

### Q2. Does the formal open-and-submit path make base Dreamer settlement total?

**Answer: No.**

`OpenFirstNightRoleActionOpportunity` and `SubmitDreamerAction` are real formal commands, but their existence does not guarantee terminal settlement. `[2B19A3A-C17]` proves a real accepted Philosopher choice of Dreamer makes the base Dreamer canonically `DRUNK`, opens the task, then leaves the submission unsupported and the opportunity `OPEN`. `[2B19A2-C18]` and `[2B19A2-C20]` prove the current No Dashii path is also unsupported, retryable, receipt-free, and mutation-free.

### Q3. Are accepted V2 Philosopher-gained first-night tasks settleable?

**Answer: Yes, for the accepted gained set only.**

The accepted V2 gained set is Clockmaker, Dreamer, Snake Charmer, Seamstress, and Mathematician. Those gained paths do not repair or bypass the blocked base Dreamer task. A gained task settling does not prove the independently planned base task is settleable.

### Q4. Can the product determine when accepted V1 first-night work is fully settled?

**Answer: Yes, but only from validated accepted progress.**

The completion predicate can reuse:

```text
validateFirstNightTaskProgress(plan, progress)
getNextUnsettledFirstNightTask(plan, progress) === undefined
```

This is valid only after the progress passes validation and every planned task has a real accepted settlement. Completion must never skip, forge, synthesize, or manufacture a settlement for unfinished work.

### Q5. Does the phase policy permit direct `FIRST_NIGHT` to `DAY_DISCUSSION`?

**Answer: No.**

The only permitted route is:

```text
FIRST_NIGHT
  -- FIRST_NIGHT_COMPLETED -->
DAWN_RESOLUTION
  -- DAWN_COMPLETED -->
DAY_DISCUSSION
```

The private `transitions` table in `packages/domain-core/src/phase-transition-policy.ts` contains no direct `FIRST_NIGHT` to `DAY_DISCUSSION` edge. `evaluatePhaseTransition(...)` returns an illegal-transition result for that direct jump.

### Q6. Is `PhaseTransitioned` structurally reusable for day entry?

**Answer: Yes, only as two exact events following the existing policy.**

`PhaseTransitioned` is structurally reusable for:

1. `FIRST_NIGHT` to `DAWN_RESOLUTION` with `transitionReason="FIRST_NIGHT_COMPLETED"`;
2. `DAWN_RESOLUTION` to `DAY_DISCUSSION` with `transitionReason="DAWN_COMPLETED"`.

It is not authority for a direct jump. The event applier independently checks `fromPhase`, policy result, reason code, and counters.

### Q7. Are the existing phase counters reusable?

**Answer: Yes.**

The accepted pre-transition first-night counters are `dayNumber=0`, `nightNumber=1`.

- `FIRST_NIGHT_COMPLETED` preserves them at dawn: `DAWN_RESOLUTION`, `dayNumber=0`, `nightNumber=1`.
- `DAWN_COMPLETED` increments the day counter: `DAY_DISCUSSION`, `dayNumber=1`, `nightNumber=1`.

`validatePhaseCounters(...)` already enforces these phase-specific relationships.

### Q8. Is a new top-level `GameState` field required for completion?

**Answer: No.**

Validated `firstNightTaskPlan`, validated `firstNightTaskProgress`, the absence of a next unsettled task, and the existing phase/counters are sufficient to represent the completion predicate and two-step transition. This precheck does not authorize any `GameState` change.

### Q9. Is a new role event required for first-night completion?

**Answer: No for lifecycle completion; the Dreamer blocker is separate role behavior.**

Lifecycle completion can use `ScheduledTaskSettled` facts plus the existing `PhaseTransitioned` event. The unresolved base Dreamer behavior requires a fresh, separately authorized rule/design slice and cannot be smuggled into lifecycle completion.

### Q10. Is new ledger evidence required for the completion decision?

**Answer: No for lifecycle completion.**

The completion decision is based on the validated task plan and task settlements. Any Dreamer impairment or No Dashii settlement repair must be assessed separately under its own rule truth, event/fact, replay, information, ledger, and projection requirements.

### Q11. Can the authorized combined Slice proceed without changing unsupported Dreamer behavior?

**Answer: No.**

Because `DREAMER_ACTION` can remain the next unsettled task, a truthful completion command must refuse to complete. Making the combined slice succeed would require either adding previously unsupported base Dreamer settlement behavior or improperly skipping/forging that task. The former requires a new bounded rule/design slice; the latter is prohibited.

### Q12. Can a later bounded completion slice stop safely at `DAY_DISCUSSION`?

**Answer: Yes, if all prerequisites are genuinely settled and the two-step dawn route is preserved.**

That later slice must stop at `DAY_DISCUSSION`. It must not include nominations, votes, execution, other-night behavior, or a generic lifecycle rewrite.

### Q13. Is a ceiling of five changed production files credible for the combined current authorization?

**Answer: No.**

The lifecycle transition work and the unresolved base Dreamer behavior are separate risks across separate authorities. A five-production-file ceiling is not credibly established when both are combined. The slice therefore fails bounded-scope governance before design.

### Q14. Is a ceiling of 600 added production lines credible for the combined current authorization?

**Answer: No.**

No bounded design has established that the Dreamer behavior repair plus lifecycle integration can fit within 600 added production lines while preserving accepted event, validation, replay, receipt, ledger, projection, and phase semantics. The estimate cannot be inferred from current code.

## 4. Complete Eleven-Task Settlement Inventory

All eleven canonical first-night task types in `FirstNightTaskType` are accounted for below. “Available path” records current accepted reachability; it is not permission to bypass the normal queue, validation, prospective batch, replay, commit, or receipt boundaries.

| # | First-night task type | Current accepted settlement path | Governance result |
|---:|---|---|---|
| 1 | `PHILOSOPHER_ACTION` | `OpenFirstNightRoleActionOpportunity` then `SubmitPhilosopherAction` | Settlement path exists. |
| 2 | `MINION_INFO` | `SettleFirstNightSystemTask` | Settlement path exists. |
| 3 | `DEMON_INFO` | `SettleFirstNightSystemTask` | Settlement path exists. |
| 4 | `SNAKE_CHARMER_ACTION` | `OpenFirstNightRoleActionOpportunity` then `SubmitSnakeCharmerAction` | Settlement path exists. |
| 5 | `EVIL_TWIN_SETUP` | `SettleEvilTwinSetup` | Settlement path exists. |
| 6 | `WITCH_ACTION` | `OpenFirstNightRoleActionOpportunity` then `SubmitWitchAction` | Settlement path exists. |
| 7 | `CERENOVUS_ACTION` | `OpenFirstNightRoleActionOpportunity` then `SubmitCerenovusAction` | Settlement path exists. |
| 8 | `CLOCKMAKER_INFORMATION` | `SettleClockmakerInformation` | Settlement path exists for accepted source forms. |
| 9 | `DREAMER_ACTION` | `OpenFirstNightRoleActionOpportunity` then `SubmitDreamerAction` | Not total: base canonical Philosopher-caused `DRUNK` without effective Vortox and base current No Dashii unresolved can remain open and unsettled. |
| 10 | `SEAMSTRESS_ACTION` | `OpenFirstNightRoleActionOpportunity` then `SubmitSeamstressAction` | Settlement path exists for accepted source forms. |
| 11 | `MATHEMATICIAN_INFORMATION` | `SettleMathematicianInformation` | Settlement path exists for accepted source forms. |

The existence of ten total task paths and a partially total Dreamer path is insufficient. First-night completion requires every task actually present in the accepted plan to have a valid, ordered `ScheduledTaskSettled` fact.

## 5. Independent Blockers

The exact remaining blockers are:

1. `PLANNED_BASE_DREAMER_CAN_REMAIN_UNSETTLEABLE`
   - The planner can include a base `DREAMER_ACTION`.
   - A real accepted action opportunity can be opened.
   - Canonical Philosopher-caused `DRUNK` or current No Dashii unresolved can make submission return `ApplicationNotConfigured`.
   - The failure is retryable, receipt-free, mutation-free, and leaves the opportunity `OPEN`.
   - Therefore the task plan cannot truthfully be declared complete.

2. `DIRECT_FIRST_NIGHT_TO_DAY_NOT_EXPRESSIBLE_BY_EXISTING_POLICY`
   - `GAME_PHASES` includes `DAWN_RESOLUTION`.
   - The existing policy requires two transitions and exact counters.
   - A direct first-night-to-day transition is illegal.
   - `validateDomainBatchSemantics(...)` currently also rejects both `FIRST_NIGHT_COMPLETED` and `DAWN_COMPLETED`, because neither reason is present in `INTEGRATED_TRANSITION_REASONS`.
   - Therefore later integration must add exact two-step batch semantics rather than bypassing the policy.

These blockers are independent. Repairing only the direct-transition request would still leave a planned task unsettled. Repairing only one Dreamer state would still leave the other Dreamer state and the required dawn route.

## 6. Reusable Existing Authorities

A later properly authorized design may assess reuse of:

- `validateFirstNightTaskProgress`;
- `getNextUnsettledFirstNightTask`;
- `validateScheduledTaskSettledPayloadForState`;
- `ScheduledTaskSettled`;
- `PhaseTransitioned`;
- `evaluatePhaseTransition`;
- `validatePhaseCounters`;
- `validateDomainBatchSemantics`;
- the current first-night queue;
- prospective batch validation;
- event application and full replay validation;
- atomic append/commit behavior;
- command receipts and retryability.

Reuse does not mean automatic integration. In particular, adding transition reasons to `INTEGRATED_TRANSITION_REASONS` is insufficient without exact paired batch semantics, accepted trigger facts, prospective validation, event-application validation, replay validation, counter checks, negative tests, and a real application command path.

## 7. Explicitly Unsupported or Prohibited

- base Dreamer canonical Philosopher-caused `DRUNK` settlement without effective Vortox;
- base Dreamer settlement while current No Dashii effect derivation is unresolved;
- direct `FIRST_NIGHT` to `DAY_DISCUSSION`;
- skipping, fabricating, reordering, or manufacturing `ScheduledTaskSettled`;
- treating shape-valid settlement payloads as accepted-history provenance;
- a generic lifecycle rewrite;
- nominations, voting, execution, later-night work, Phase 2C, or another role behavior in this slice;
- creation of 2B20 rule evidence or design after the governance stop-loss;
- production, test, workflow, dependency, profile, ownership, or role-matrix edits;
- automatic selection or start of a next slice.

## 8. Stop-Loss and Minimum Reslice

The combined authorization owns at least two independent risks: unfinished base Dreamer behavior and first-night/day lifecycle integration. The bounded production-file and line estimates are not credible. Governance therefore stops before the mandatory rule-truth order begins.

Minimum reslice:

1. Do not design or implement first-night completion now.
2. Require a new explicit user reslice authorization.
3. The smallest candidate next slice is exactly **Base Dreamer Canonical-DRUNK Non-Vortox Settlement**.
4. That candidate must start again at fresh four-source rule research, materialized evidence, `RULE_READY`, one bounded architect design, and independent `RULE_DESIGN_PASS`.
5. Completing that candidate alone does not authorize first-night completion and does not resolve current No Dashii. No Dashii remains a separate later slice.
6. A still-later first-night completion slice must again receive explicit authorization and must preserve:

```text
FIRST_NIGHT (day 0 / night 1)
  -- FIRST_NIGHT_COMPLETED -->
DAWN_RESOLUTION (day 0 / night 1)
  -- DAWN_COMPLETED -->
DAY_DISCUSSION (day 1 / night 1)
```

Required next action:

`STOP_REQUIRE_NEW_USER_RESLICE_AUTHORIZATION_NO_AUTOMATIC_NEXT_SLICE`

RESLICE_REQUIRED
