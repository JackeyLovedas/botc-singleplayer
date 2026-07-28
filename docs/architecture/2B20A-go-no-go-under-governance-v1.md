# Phase 3 Slice 2B20A Governance Precheck

## 1. Decision

- Slice: `2B20A — Reachable Base Dreamer Settleability Closure`
- Authorization: `USER_AUTHORIZED_2B20_RESLICE_BASE_DREAMER_SETTLEABILITY_CLOSURE`
- Parent slice: `2B20 — First Night Completion and Day Entry`
- Parent disposition: `RESLICE_REQUIRED / UNACCEPTED`
- Accepted main: `5a69c90f2d3947556ff45c15c467902b1e28ca43`
- Parent governance commit: `2b56a9a0891de9fda9954d9d635bcbda9d4248a3`
- Branch: `phase-3/reachable-base-dreamer-settleability-closure`
- Task type: `PRODUCT_SLICE`
- Governance verdict: `GO`
- Disposition: `UNACCEPTED`
- Implementation authorized: `false`
- Rule gate: `ruleReady=false`
- Design gate: `ruleDesignPass=false`
- Design round: `0 / 2`
- Repair round: `0 / 2`
- Product repair consumed: `false`
- Phase 2C started: `false`
- Pull request: `none`
- Coverage target: `PARTIAL / REACHABLE_BASE_DREAMER_SETTLEABILITY_ONLY`
- Dreamer role coverage: `PARTIAL`

`GO` authorizes only fresh four-source rule research, evidence materialization, one
bounded design, and independent rule-design review. It does not authorize production
or test changes. Implementation remains prohibited until the rule-researcher returns
`RULE_READY` and an independent reviewer returns `RULE_DESIGN_PASS`.

This record narrows the first independent 2B20 blocker to the exact accepted stream
proved by `[2B19A3A-C17]`. It does not reopen the parent lifecycle request or claim
that first-night completion is now possible.

## 2. Parent 2B20 Archive

The parent governance record remains immutable at:

`docs/architecture/2B20-go-no-go-under-governance-v1.md`

Its SHA-256 is:

`631fb1938189fac551407c016ac0632b7d2cf31a0afe3642f1ee7df034932af5`

The parent was stopped as `RESLICE_REQUIRED / UNACCEPTED` with two independent
blockers:

1. `PLANNED_BASE_DREAMER_CAN_REMAIN_UNSETTLEABLE`;
2. `DIRECT_FIRST_NIGHT_TO_DAY_NOT_EXPRESSIBLE_BY_EXISTING_POLICY`.

2B20A owns only the first blocker and only one real reachable cause of that blocker.
The second blocker remains a later, independently authorized lifecycle concern.

## 3. Authority Reviewed

The precheck is grounded in the accepted repository history and current production
contracts, including:

- `AGENTS.md` and the ordered `project-handoff/` baseline;
- `docs/agent-loop/AUTOPILOT_PROMPT.md`;
- `docs/agent-loop/REVIEW_PROTOCOL.md`;
- `docs/rules/USER_OVERRIDES.md`;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`;
- `docs/architecture/2B20-go-no-go-under-governance-v1.md`;
- accepted Dreamer implementation and review records for 2B19A2, 2B19A3A,
  2B19A3B1, and 2B19A3B2;
- `packages/domain-core/src/philosopher-ability.ts`;
- `packages/domain-core/src/dreamer.ts`;
- `packages/domain-core/src/first-night-action-opportunity.ts`;
- `packages/domain-core/src/first-night-task-plan.ts`;
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`;
- `packages/domain-core/src/event-applier.ts`;
- `packages/domain-core/src/domain-batch-semantics.ts`;
- `packages/application/src/game-application-service.ts`;
- `[2B19A3A-C17]`, `[2B19A2-C18]`, and `[2B19A2-C20]` in
  `packages/application/src/game-application-service.test.ts`;
- the Dreamer domain, replay, projection, and hostile-input test suites.

Code and tests establish reachability and the present implementation boundary. They
do not supply rule truth. The next stage must independently research the mandatory
external rule sources before any behavior design is accepted.

## 4. Exact Reachable Accepted Stream

### 4.1 Setup and assignment

The real application path executes the standard accepted commands:

1. `CreateGame`;
2. `SelectScript`;
3. `GenerateSetup` with the exact role set used by the Philosopher/Dreamer path;
4. `CreatePlayerRoster`;
5. `AssignCharacters`;
6. `InitializeFirstNight`;
7. `PlanFirstNightTasks`.

The deterministic accepted assignment relevant to this slice is:

| Fact | Canonical value |
|---|---|
| Base Dreamer player | `ai-seat-01` |
| Base Dreamer seat | `1` |
| Base Dreamer role | `dreamer` |
| Philosopher player | `ai-seat-10` |
| Philosopher seat | `10` |
| Philosopher role | `philosopher` |
| Current Demon role | `fang_gu` |
| Current Vortox | absent |

The V1 first-night plan already contains a base `DREAMER_ACTION` whose source kind is
`ROLE`, source player is `ai-seat-01`, source seat is `1`, and source role is
`dreamer`. The plan therefore does not depend on the later gained Dreamer insertion
to make the blocked base task exist.

### 4.2 Philosopher choice and canonical impairment provenance

The accepted path then:

1. executes `OpenFirstNightRoleActionOpportunity` for the planned
   `PHILOSOPHER_ACTION`;
2. persists an open `PHILOSOPHER_FIRST_NIGHT_ACTION` opportunity;
3. executes `SubmitPhilosopherAction` with
   `decision.kind="CHOOSE_GOOD_CHARACTER"` and `roleId="dreamer"`;
4. atomically accepts `PhilosopherAbilityChosen`, `PhilosopherAbilityGranted`,
   `AbilityImpairmentApplied`, the applicable gained-task insertion, and
   `ScheduledTaskSettled` for the Philosopher task.

The canonical impairment is represented by the accepted
`AbilityImpairmentApplied` event and rebuilt `AbilityImpairmentSet` with:

| Field | Required value |
|---|---|
| `kind` | `DRUNK` |
| `sourceKind` | `PHILOSOPHER_CHOSEN_DUPLICATE` |
| `sourcePlayerId` | `ai-seat-10` |
| affected player | `ai-seat-01` |
| affected seat | `1` |
| affected role | `dreamer` |
| `chosenRoleId` | `dreamer` |
| source revision | accepted Philosopher choice character-state revision |

This is the exact provenance already recognized by
`resolveBaseDreamerV2NormalCapability`. It is not generic drunkenness, poisoning,
gained-Dreamer impairment, or a Storyteller-only assertion.

### 4.3 Base Dreamer opportunity and failed settlement

The accepted application flow advances earlier tasks through their existing formal
commands until the original base `DREAMER_ACTION` is next. It then:

1. executes `OpenFirstNightRoleActionOpportunity` for that base task;
2. persists one open V3 base Dreamer opportunity;
3. chooses a legal other player through `SubmitDreamerAction`;
4. resolves the source against the accepted task, opportunity, current character
   state, role tenure, setup, and canonical impairment set.

For this stream:

- the source is base Dreamer `ai-seat-01`, seat `1`;
- the source has the exact canonical Philosopher-caused `DRUNK` provenance above;
- the unique current Demon is `fang_gu`;
- there is no current Vortox and therefore no effective-current-Vortox forced-false
  constraint;
- the resolver cannot return the accepted
  `CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED` capability;
- the current application mapping returns retryable `ApplicationNotConfigured` at
  `first-night-role-action`.

The failed command produces:

- no `DreamerTargetChosen`;
- no `DreamerInformationDelivered`;
- no `ScheduledTaskSettled`;
- no accepted command receipt;
- no event-stream mutation;
- no game-version change.

The V3 opportunity remains `OPEN`, the base `DREAMER_ACTION` remains pending, and
first-night progress cannot advance beyond it.

## 5. Precise Missing Capability

The target layer is already present: a legal target can be submitted through the
existing V3 opportunity and target validation path.

The generic scheduled-task settlement constructor is also present, but it cannot be
used alone. A settlement without a rule-valid information delivery and its required
batch semantics would forge completion.

The primary missing product capability is:

> a versioned, replay-valid, non-Vortox information-delivery contract for the exact
> canonically Philosopher-drunk base Dreamer source, integrated with the existing
> target, delivery, atomic batch, scheduled-task settlement, receipt, replay, and
> projection boundaries.

Fresh rule research must decide:

- what information a drunk Dreamer may be shown in this exact non-Vortox state;
- which choice belongs to Storyteller discretion;
- which truth, reliability, and impairment facts are canonical versus private;
- whether the accepted first-night ability-outcome ledger requires a new versioned
  outcome representation or can use an existing formal outcome shape;
- how the resulting delivery is classified for Mathematician without leaking its
  cause to player or AI projections.

The ledger answer is deliberately not invented in this precheck. It must come from
the rule evidence and frozen design.

## 6. Reuse Boundary

A later passing design must prefer the current formal framework:

- the existing planned base `DREAMER_ACTION`;
- the existing V3 Dreamer opportunity and legal-target validation;
- state-bound source, tenure, and canonical impairment validation;
- deterministic Dreamer information selection;
- existing Dreamer delivery storage;
- atomic `DreamerTargetChosen` + `DreamerInformationDelivered` +
  `ScheduledTaskSettled` semantics;
- prospective batch validation, replay, and event-application validation;
- command receipts and idempotency;
- private player/AI projection from stored delivered knowledge.

The design must preserve normal base Dreamer, effective-current-Vortox base Dreamer,
canonical-drunk effective-Vortox base Dreamer, and all accepted gained-Dreamer
behavior unless a fresh rule claim and explicit design contract require an additive
versioned path.

## 7. Privacy and Fail-Closed Requirements

Player and AI projections may expose only the information actually delivered to the
Dreamer. They must not expose:

- `DRUNK` or `PHILOSOPHER_CHOSEN_DUPLICATE`;
- `ai-seat-10` as the impairment source;
- Philosopher choice or grant metadata;
- canonical role truth or current Demon identity;
- candidate sets or Storyteller-only decision metadata;
- ledger or Mathematician audit internals.

Malformed, ambiguous, hostile, unproven, unsupported, or historically inconsistent
inputs must remain fail closed. The future design must retain exact-shape validation,
throwing/revoked Proxy safety, zero getter invocation, symbol/cycle/nonplain rejection,
accepted-history provenance, deterministic IDs/order, replay rejection, atomicity,
receipt rules, and idempotent retries.

## 8. Explicit Scope

### In scope

- only the accepted canonical Philosopher-caused `DRUNK` base Dreamer;
- only first night and only when no current Vortox applies;
- existing V3 base Dreamer opportunity and real application command path;
- versioned target/delivery/settlement/ledger integration only as required by fresh
  rule evidence;
- regression protection for accepted normal and effective-Vortox paths;
- Dreamer role coverage remains `PARTIAL`.

### Explicitly out of scope

- `POISONED` success behavior;
- No Dashii impairment derivation or settlement;
- Philosopher-gained Dreamer impairment;
- impaired, poisoned, drunk, dead, or otherwise ineffective Vortox;
- generic impairment or effect engine;
- other-night Dreamer behavior;
- first-night completion or any first-night/day phase transition;
- nomination, voting, execution, death, or later day mechanics;
- Phase 2C;
- a new top-level `GameState` field;
- a generic lifecycle rewrite;
- promotion of Dreamer to `COMPLETE`.

## 9. Proportional Governance Result

This slice is credibly bounded because it owns one demonstrated accepted stream and
one primary missing capability. The parent direct-phase-transition blocker is not
silently absorbed. No production estimate or file allowlist is frozen here; the
architect must establish a bounded exact allowlist after `RULE_READY`.

Current mandatory blockers are:

1. `PENDING_FRESH_2B20A_RULE_RESEARCH`;
2. `PENDING_2B20A_RULE_READY`;
3. `PENDING_BOUNDED_2B20A_DESIGN`;
4. `PENDING_INDEPENDENT_2B20A_RULE_DESIGN_PASS`.

No production or test modification is permitted while any gate remains.

Required next action:

`RUN_2B20A_RULE_RESEARCH`

GO
