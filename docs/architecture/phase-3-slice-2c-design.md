# Phase 3 Slice 2C — Integrated Basic Phase Flow Bounded Design

## Design status

- `sliceId`: `2C`
- `designStatus`: `BOUNDED_DESIGN_PENDING_INDEPENDENT_REVIEW`
- `designExpectedSourceBranch`: `phase-3/slice-2c-rule-evidence`
- `designExpectedRuleEvidenceSHA`: `d932a21660548268c1ff8fcae59d3bb87e284bd3`
- `designExpectedOverride`: `BOTC-SIM-EXECUTION-DEATH-SEPARATION-V1`
- `designExpectedOverrideCommit`: `0f89064e4310ed5454df2684eec5b44cd363f04a`
- `implementationAuthorized`: `false`
- `implementationActualSHA`: `NOT_YET_BOUND`
- `reviewSHA`: `NOT_YET_BOUND`
- `ruleDesignVerdict`: `NOT_YET_REVIEWED`

This document materializes one bounded architecture proposal after the rule
evidence was resolved for its explicit execution/death boundary. It does not
claim implementation, code review, rule-design review, or acceptance.

## Goal

Make one real, replayable, event-derived basic phase flow possible for an
already valid game:

```text
FIRST_NIGHT (day 0 / night 1)
  -> DAWN_RESOLUTION (day 0 / night 1)
  -> DAY_DISCUSSION (day 1 / night 1)
  -> NOMINATION_WINDOW
  -> VOTING (zero or more nomination/vote cycles)
  -> EXECUTION_RESOLUTION
  -> NIGHT_TASKS (ordinary-night boundary)
  -> DAWN_RESOLUTION
  -> DAY_DISCUSSION
```

The first-night-to-first-day route and one day-to-ordinary-night-to-dawn
cycle are the lifecycle objective. All transitions must be driven by real
semantic commands and validated domain facts, not a generic phase advance.

## Non-goals

- No new character ability or role implementation.
- No role-specific daytime or night ability resolution.
- No Travellers, registration, Barista, general continuous-effect engine,
  drunkenness or poisoning producers, Vortox behavior, or character/alignment
  change.
- No win-condition implementation beyond preserving the existing explicit
  `CheckVictory` boundary; this design does not decide a terminal game.
- No Storyteller free-form answer policy or AI decision policy.
- No UI, Electron, SQLite, network, or production persistence adapter.
- No redesign of accepted V1/V2 first-night event shapes, assignment, setup,
  private knowledge, role catalogs, or accepted history.
- No Slice 3 and no automatic next slice.
- No change to `C`, `C1`, `A`, `B`, event-definition authority, or semantic
  validator authority outside the bounded additions required by this design.

## Rule boundary and evidence binding

The design consumes only the following reviewed rule evidence:

- rule evidence commit: `d932a21660548268c1ff8fcae59d3bb87e284bd3`
- rule evidence file: `docs/rules/evidence/2C.md`
- evidence file SHA-256: `0b0839d7e3b4229ddf5f3e0368ba743f275050fe77b1dc8e7516e31704f2d583`
- override record: `BOTC-SIM-EXECUTION-DEATH-SEPARATION-V1`
- override commit: `0f89064e4310ed5454df2684eec5b44cd363f04a`
- override scope: phase-flow and canonical event modeling only
- prior rule verdict retained as history: `RULE_CONFLICT`
- current bounded rule verdict: `RULE_READY`
- `B18Status`: `HUMAN_BLOCKED_UNCHANGED`
- `B18ConflictsTouched`: `none`

The override resolves only the Chinese voting revision 5936 wording that
couples execution and death. Execution remains a daily decision/fact and death
remains a separate attempted/resolved/prevented fact. An execution must not
imply death, and a no-execution day must not be represented as an execution.

The official nightsheet remains canonical for night order. This design does
not add role tasks to the ordinary-night boundary and does not silently select
the alternative Chinese order.

## Reused accepted capabilities

The implementation may reuse the following existing authorities without
changing their accepted contracts:

- `GamePhase`, `PhaseCounters`, and `validatePhaseCounters`;
- `evaluatePhaseTransition` and its existing two-step dawn route;
- `PhaseTransitioned` as the only phase-changing domain event;
- `validateFirstNightTaskProgress` and `getNextUnsettledFirstNightTask`;
- `validateScheduledTaskSettledPayloadForState`;
- `ScheduledTaskSettled` and the accepted first-night task plan;
- command envelope, serial command queue, expected-version checks, receipts,
  prospective batch application, atomic append, and full replay rebuild;
- existing actor visibility and projection boundaries;
- existing `Nomination`, `Vote`, `Execution`, `Death`, and `LifeState` domain
  concepts from the architecture model where their minimal event-backed shape
  is needed.

Reuse is conditional: every candidate batch must pass structural validation,
semantic batch validation, prospective application, full replay, and atomic
commit. A shape-valid payload is not accepted-history provenance.

## Minimal commands

Only these semantic commands are in the design boundary. Existing command
names are reused where the architecture already defines them; no generic
`AdvancePhase` production command is introduced.

### First-night and dawn

- `CompleteNight` in `FIRST_NIGHT`: succeeds only when the validated first-night
  plan has no next unsettled task. It emits the exact completion transition to
  `DAWN_RESOLUTION`.
- `PublishDawn` in `DAWN_RESOLUTION`: publishes only the existing event-derived
  dawn boundary and emits the exact transition to `DAY_DISCUSSION`.

The completion predicate is exactly:

```text
validateFirstNightTaskProgress(plan, progress) == valid
and getNextUnsettledFirstNightTask(plan, progress) === undefined
```

The command must fail closed when the plan/progress is absent, malformed,
contains a duplicate or out-of-order settlement, or has any next unsettled
task. It must not settle, skip, reorder, or synthesize a task.

### Day and nominations

- `OpenNominations` in `DAY_DISCUSSION`.
- `DeclareNomination` in `NOMINATION_WINDOW`.
- `OpenVote` for a valid nomination.
- `CastVote` in `VOTING`.
- `CompleteVote` for the current nomination.
- `CloseNominations` when no further nomination will occur.

`RecordPublicClaim`, `SendPrivateMessage`, and `UseActionOpportunity` remain
available only through their already accepted boundaries; they are not needed
to prove the phase loop and do not become a hidden dependency.

### Execution and night

- `ResolveExecution` in `EXECUTION_RESOLUTION`.
- `BeginNight` after a resolved execution or explicit no-execution close.
- `CompleteNight` in the bounded ordinary-night fixture only when all required
  tasks in that fixture are settled; no role action may be silently skipped.
- `PublishDawn` in `DAWN_RESOLUTION`.

`CheckVictory` remains a separate existing system boundary. This slice does not
invent a new terminal predicate.

## Minimal domain events

The implementation emits only the following event families, with exact
metadata, batch identity, command identity, counters, rules baseline, causal
links, and visibility tags required by the existing event model.

### First-night completion and dawn

1. `PhaseTransitioned`
   - `FIRST_NIGHT -> DAWN_RESOLUTION`
   - `transitionReason=FIRST_NIGHT_COMPLETED`
   - counters remain `dayNumber=0`, `nightNumber=1`
2. `PhaseTransitioned`
   - `DAWN_RESOLUTION -> DAY_DISCUSSION`
   - `transitionReason=DAWN_COMPLETED`
   - counters become `dayNumber=1`, `nightNumber=1`

No new top-level completion state is required. Completion derives from the
validated existing task plan/progress and the current phase counters.

### Nomination and vote

- `NominationDeclared` records the alive nominator, target, day, and canonical
  nomination identity after eligibility and once-per-day checks.
- `PhaseTransitioned` with `VOTE_OPENED` opens voting for that nomination.
- `VoteCast` records one legal vote and whether the remaining ghost-vote token
  was consumed; the event does not expose hidden role or truth metadata.
- `BlockStateUpdated` records the canonical tally/on-the-block state after
  `CompleteVote`.
- `PhaseTransitioned` with `VOTE_COMPLETED` returns to
  `NOMINATION_WINDOW`, allowing later nominations that day.
- `PhaseTransitioned` with `NOMINATIONS_CLOSED` enters
  `EXECUTION_RESOLUTION`.

No nomination or vote event is emitted for an invalid actor, dead nominator,
duplicate nomination, invalid target, spent ghost vote, stale version, or
malformed batch. Such failures remain command/audit outcomes.

### Execution and death

When a valid block exists, `ResolveExecution` emits the smallest exact batch:

```text
ExecutionDeclared
[DeathAttempted]
[DeathResolved | DeathPrevented]
ExecutionResolved
PhaseTransitioned(EXECUTION_RESOLVED -> NIGHT_TASKS)
```

The exact optional death event is selected only by the existing bounded death
resolution authority. The design does not invent character-specific prevention
or replacement. `ExecutionResolved` records that the daily execution decision
is complete; it does not assert that death occurred.

When no candidate is executable, `ResolveExecution` emits:

```text
DayClosedWithoutExecution
PhaseTransitioned(EXECUTION_RESOLVED -> NIGHT_TASKS)
```

`DayClosedWithoutExecution` is not an execution and cannot satisfy any rule
that requires an execution. Both paths use the same night transition only
after the day-end decision has been recorded.

### Ordinary night and dawn

`BeginNight` opens only the bounded ordinary-night fixture and preserves the
official nightsheet boundary. `CompleteNight` requires every task actually
present in that fixture to be settled. For the first implementation boundary,
the fixture contains no role-action task; if a required task is present, the
command fails closed rather than skipping it.

After the ordinary-night completion fact, `PhaseTransitioned` uses
`NIGHT_TASKS_COMPLETED -> DAWN_RESOLUTION` with unchanged day/night counters.
`PublishDawn` then emits the existing event-derived dawn publication and uses
`DAWN_COMPLETED` to open the next `DAY_DISCUSSION`, incrementing the day.

## State boundary

The design adds no new state authority for first-night completion. For the day
flow, the minimal event-derived records are:

- current phase and day/night counters;
- current nomination window and at-most-once nomination records;
- current nomination and vote records, including ghost-vote consumption;
- current block/tally state;
- execution decision and separate death attempt/resolution state;
- explicit no-execution day-close fact;
- ordinary-night fixture task state and dawn boundary.

These are rebuildable from domain events and must not be maintained as a
manually editable parallel truth object. Assignment, setup, character state,
knowledge, first-night plan, and existing private projections remain unchanged.

## Phase transition contract

The existing phase graph is authoritative and must be used exactly:

```text
FIRST_NIGHT --FIRST_NIGHT_COMPLETED--> DAWN_RESOLUTION
DAWN_RESOLUTION --DAWN_COMPLETED--> DAY_DISCUSSION
DAY_DISCUSSION --NOMINATION_OPENED--> NOMINATION_WINDOW
NOMINATION_WINDOW --VOTE_OPENED--> VOTING
VOTING --VOTE_COMPLETED--> NOMINATION_WINDOW
NOMINATION_WINDOW --NOMINATIONS_CLOSED--> EXECUTION_RESOLUTION
EXECUTION_RESOLUTION --EXECUTION_RESOLVED--> NIGHT_TASKS
NIGHT_TASKS --NIGHT_TASKS_COMPLETED--> DAWN_RESOLUTION
```

No direct `FIRST_NIGHT -> DAY_DISCUSSION` edge is introduced. The existing
counter rules remain binding:

- first-night completion: day `0`, night `1`;
- dawn to first day: day `1`, night `1`;
- ordinary night: night is day plus one;
- dawn publication preserves the night counter before the next day begins.

## Batch and validation invariants

Every accepted command batch must satisfy all of the following:

1. Exact command envelope, actor, expected version, correlation, and rules
   baseline.
2. Consecutive event sequence and one game-version increment per atomic batch.
3. Exact batch identity and causal links between trigger facts and phase event.
4. Real current phase and counters before and after every transition.
5. Prospective application succeeds before append.
6. Full event-stream structural validation and replay rebuild succeed.
7. Duplicate command IDs remain idempotent; conflicting command structure is
   rejected without event or receipt overwrite.
8. Invalid commands produce audit/rejection outcomes, not domain facts.
9. No event payload includes hidden role, alignment, impairment, correctness,
   or Storyteller-only state in player-visible projections.
10. Execution, death, and no-execution are distinct event outcomes.
11. Dead nomination, duplicate nomination, and spent ghost vote are rejected.
12. A vote succeeds only under the sourced threshold, strict-greatest, and
   tie-failure rules; tally order is clockwise ending at the nominee.
13. First-night or ordinary-night completion cannot bypass an unsettled task.

## Replay and prospective safety

The same validators run for candidate application and replay. Replay must
reject naked phase events, reversed or incomplete batches, mismatched
nomination/vote/execution/death links, duplicate ghost-vote consumption,
wrong counters, wrong transition reasons, execution/death conflation,
fabricated task completion, and no-execution batches that claim an execution.

Accepted history before this slice remains replayable. No migration rewrites
old events, no later character state recomputes historical facts, and no
coverage or green test result becomes rule authority.

## Projection boundary

The public projection may expose only public phase, living/dead status after
authorized publication, nominations, vote outcomes, execution/no-execution,
and other publicly observable facts. A player projection must not expose:

- hidden assignment, character, alignment, or truth;
- private event-cause or death-prevention reasoning;
- Storyteller legal candidate sets;
- canonical task internals, queue identity, or validation metadata;
- another player's private vote or role information.

Player and AI projections remain separate from canonical state. Projection
validation must consume stored historical facts and must not recompute prior
execution, death, or vote meaning from later state.

## Traceability boundary

This design owns only the expected mechanism mapping for the bounded slice. It
does not invent physical test titles, final supporting-authority IDs, or actual
implementation bindings.

- first-night/day transition: `APPLICATION_COMMAND_INTEGRATION` plus
  structural/replay validation support;
- nomination/vote/execution flow: `APPLICATION_COMMAND_INTEGRATION` with
  structural validation and replay support;
- exact payload shapes: `STRUCTURAL_VALIDATION`;
- execution/death separation: application integration backed by direct event
  validation, never a shared or mixed primary mechanism;
- exact nightsheet/runner evidence: outside this local design and not a
  substitute for hosted CI.

The design does not modify C criteria, C1 schema authority, or existing
traceability records.

## Test plan

The implementer may create tests only after this design receives the required
independent design-review approval. The plan is behavioral and does not pre-assign
physical test identities.

### Positive paths

1. Complete a fully settled first-night plan and enter dawn.
2. Publish dawn and enter first-day discussion with exact counters.
3. Open nominations and declare a legal nomination.
4. Open vote, cast legal living votes, complete vote, and return to nominations.
5. Consume exactly one dead player's remaining ghost vote.
6. Close nominations and resolve a valid execution with a separate death path.
7. Close nominations with no executable candidate and record no execution.
8. Begin and complete the bounded no-role ordinary-night fixture.
9. Publish dawn and enter the next day.
10. Rebuild every positive event stream to the same canonical state.

### Negative and hostile paths

1. Incomplete, malformed, duplicate, reversed, or forged first-night progress.
2. Direct first-night-to-day transition.
3. Wrong phase, wrong counters, wrong reason, stale version, or missing trigger.
4. Dead nominator, duplicate nominator, invalid target, second nomination.
5. Spent ghost vote, dead voter after token consumption, wrong vote owner.
6. Tie, below-half, non-greatest, and zero-vote execution candidates.
7. Batch that records execution as death, death without an attempt, or
   no-execution as execution.
8. Unsettled ordinary-night task hidden by completion.
9. Naked, reversed, mixed, duplicate, cross-linked, or extra-field event batch.
10. Projection attempts to expose hidden assignment, vote, task, or cause data.

### Regression boundaries

- Existing accepted first-night task and role tests remain green and unchanged.
- Existing phase-policy tests remain authoritative; any newly integrated
  reason requires exact batch/replay coverage.
- B18 remains `HUMAN_BLOCKED` with no conflicts touched.
- No role coverage row advances because of the phase-flow slice.
- Windows and Ubuntu must produce identical canonical event/state results when
  hosted evidence is later authorized.

## File allowlist and forbidden scope

### Expected implementation allowlist

The eventual implementation may modify only the smallest set of existing
domain/application files needed for the reviewed design, plus bounded tests and
implementation traceability:

- `packages/domain-core/src/phase-transition-policy.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/command.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/application/src/game-application-service.ts`
- bounded existing domain/application test files for 2C evidence
- one 2C implementation status/traceability document
- the role matrix only if reviewed implementation evidence requires a status
  update; no role may be promoted to `COMPLETE`

The actual implementer must report the exact file diff before review. This
allowlist is a ceiling, not a requirement to touch every file.

### Forbidden files and systems

- Any production file outside the allowlist without a fresh rescope.
- `C`, `C1`, `A`, `B`, event-definition source of truth, semantic validator
  ownership, or accepted historical event payloads.
- Any existing role resolver, role catalog, assignment, setup, private
  knowledge, or first-night ability implementation.
- Workflow, dependency, coverage profile, routing, publication, hosted CI, or
  permanent governance infrastructure.
- UI/Electron/SQLite/network/persistence adapter files.
- Any Slice 3 or later implementation.

## Budgets and stop-loss

- Production-file ceiling: `8` files from the allowlist; exceed only by a new
  governance decision, not by incidental refactoring.
- New production-line ceiling: `600` lines across the slice; this is a hard
  stop, not a target to be filled.
- New test-file ceiling: `6` files; existing test identities and titles remain
  unchanged unless separately reviewed.
- New domain event families: only the listed nomination/vote/block,
  execution/death/no-execution, and phase-boundary facts.
- No new registry, generic lifecycle framework, dynamic selector, or broad
  role engine.
- Design correction budget: `0/2`.
- Implementation repair budget: `0/2`.
- Any recurrence of the execution/death ambiguity, missing source authority,
  need for role semantics, task-skipping pressure, budget overrun, projection
  leakage, or existing-contract mutation is `HUMAN_BLOCKED` and requires a
  new bounded reslice. No automatic Slice 3.

## Required next gate

The required next action is a fresh independent design review of this exact
design and `d932a216...` evidence. Until that reviewer returns an explicit
pass verdict:

- implementation remains unauthorized;
- no feature branch for implementation may be created;
- no production or test file may be edited;
- no workflow, hosted CI, push, PR, or merge may occur.

This document intentionally contains no future implementation SHA, no actual
review SHA, and no design-review verdict claim.

## Design Correction Round 1

This correction preserves the preceding design as historical design input and
adds the bounded contract corrections below. It does not authorize
implementation.

- `designCorrectionCount=1`
- `designVerdict=HUMAN_BLOCKED`
- `implementationAuthorized=false`
- `ruleEvidenceSHA=d932a21660548268c1ff8fcae59d3bb87e284bd3`
- `ruleEvidenceFileSHA256=0b0839d7e3b4229ddf5f3e0368ba743f275050fe77b1dc8e7516e31704f2d583`
- `overrideId=BOTC-SIM-EXECUTION-DEATH-SEPARATION-V1`
- `overrideCommit=0f89064e4310ed5454df2684eec5b44cd363f04a`
- `B18Status=HUMAN_BLOCKED_UNCHANGED`
- `B18ConflictsTouched=none`

The blocker is not a rule interpretation choice. The current repository does
not provide an accepted authoritative ordinary-night required-task inventory.
Therefore a no-op ordinary-night completion is prohibited, and the complete
day/night objective cannot be declared bounded or executable.

### Governance V1.1 eight-criterion matrix

The matrix uses the exact nine design-time fields required by Governance V1.1:
`CriterionId`, `RuleClaim`, `CompletionCriterion`,
`RequiredEvidenceMechanism`, `ExpectedReachability`, `ExpectedTrust`,
`ExpectedPrimaryLayer`, `ExpectedResult`, and
`SupportingAuthorityRequirement`.

Each criterion has one primary mechanism. There are no mixed or multi-layer
primary bindings and no borrowed supporting authority in this correction:

- `criterionCount=8`
- `activeCriterionCount=8`
- `uniquePrimary=8`
- `duplicatePrimary=0`
- `borrowed=0`
- `mixed=0`

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `2C-C01` | A validated first-night plan reaches dawn only after every planned task is settled. | Valid plan/progress and no next unsettled task produce the exact first-night completion transition. | `M-2C-C01-FIRST-NIGHT-COMPLETION` | `LOCAL_COMMAND_PATH` | `ACCEPTED_DOMAIN_EVENT` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C02` | Dawn ends the night and opens the first day with canonical counters. | `DAWN_RESOLUTION` transitions to `DAY_DISCUSSION` only through the dawn command and exact counter update. | `M-2C-C02-DAWN-DAY-BOUNDARY` | `LOCAL_COMMAND_PATH` | `ACCEPTED_DOMAIN_EVENT` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C03` | Only an alive player may nominate; nominees may be alive or dead and each relevant daily limit is enforced. | Legal nomination is recorded once; illegal actor, duplicate, or target-limit input is rejected without a domain event. | `M-2C-C03-NOMINATION-ELIGIBILITY` | `LOCAL_COMMAND_PATH` | `ACCEPTED_DOMAIN_EVENT` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C04` | Living players may vote repeatedly and a dead player has one remaining vote token. | Vote ownership and ghost-token consumption are exact and replayable. | `M-2C-C04-VOTE-TOKEN-BOUNDARY` | `LOCAL_COMMAND_PATH` | `ACCEPTED_DOMAIN_EVENT` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C05` | Execution requires the sourced threshold, strict greatest tally, and non-tie result. | Vote completion computes one deterministic block result under the sourced comparison rules. | `M-2C-C05-VOTE-RESOLUTION-POLICY` | `LOCAL_POLICY_PATH` | `ACCEPTED_POLICY_RESULT` | `PURE_POLICY_SEAM` | `PASS` | `NONE` |
| `2C-C06` | Execution and death are distinct; execution may resolve without death. | Exact execution/death schemas preserve `DIED` and `DID_NOT_DIE` without inference. | `M-2C-C06-EXECUTION-DEATH-SEPARATION` | `LOCAL_COMMAND_PATH` | `ACCEPTED_DOMAIN_EVENT` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C07` | Ordinary-night completion cannot skip required tasks. | Completion is accepted only against an authoritative required-task inventory and settled task set. | `M-2C-C07-ORDINARY-NIGHT-INVENTORY` | `UNAVAILABLE_CURRENT_REPO` | `UNACCEPTED` | `STRUCTURAL_VALIDATION` | `HUMAN_BLOCKED` | `NONE` |
| `2C-C08` | Candidate batches replay to the same canonical state and do not leak hidden facts. | Structural, prospective, replay, and projection checks reject malformed or leaking streams. | `M-2C-C08-REPLAY-PROJECTION-INVARIANTS` | `LOCAL_REPLAY_PATH` | `ACCEPTED_REPLAY` | `STRUCTURAL_VALIDATION` | `PASS` | `NONE` |

`2C-C07` is the explicit blocking criterion. The matrix does not convert the
missing inventory into a fabricated accepted authority.

### Exact bounded execution and death schemas

The correction freezes the smallest bounded payload contracts for this design.
Common event-envelope metadata remains governed by the existing event model:
`eventId`, `gameId`, `gameVersion`, `eventSequence`, `eventVersion`,
`rulesBaselineVersion`, `commandId` or `systemTriggerId`, `actorId` when
applicable, `phase`, counters, causation/correlation IDs, and visibility tags.
The payload records below are exact: no extra fields, hidden role fields, or
optional alternate shapes are accepted.

`ExecutionResolved` payload:

```text
{
  executionId: string,
  targetPlayerId: string,
  dayNumber: non-negative integer,
  resolution: "EXECUTED",
  deathOutcome: "DIED" | "DID_NOT_DIE"
}
```

`PlayerDied` payload:

```text
{
  deathId: string,
  executionId: string,
  playerId: string,
  dayNumber: non-negative integer,
  cause: "EXECUTION"
}
```

`PlayerDied` is emitted only when `ExecutionResolved.deathOutcome` is `DIED`.
It is emitted before the matching `ExecutionResolved` event and its
`executionId`, `playerId`, and `dayNumber` must match exactly. No role,
alignment, protection reason, or hidden Storyteller rationale is present in
either payload.

The no-death path is exact:

```text
ExecutionDeclared
ExecutionResolved(deathOutcome = DID_NOT_DIE)
PhaseTransitioned(EXECUTION_RESOLVED -> NIGHT_TASKS)
```

The no-death path emits no `PlayerDied`, does not mutate `LifeState` to dead,
and does not infer a death from the execution. A richer prevention,
replacement, or character-specific death path is outside this bounded
contract and is `HUMAN_BLOCKED` until separately authorized.

The death path is exact:

```text
ExecutionDeclared
PlayerDied(cause = EXECUTION)
ExecutionResolved(deathOutcome = DIED)
PhaseTransitioned(EXECUTION_RESOLVED -> NIGHT_TASKS)
```

`DayClosedWithoutExecution` remains a distinct no-execution fact and cannot
produce either `ExecutionResolved` or `PlayerDied`.

### Nomination boundary correction

The command validator must enforce the sourced distinction explicitly:

- `nominator`: alive only;
- `nominee`: alive or dead;
- each player nominates at most once per day;
- each player may be nominated at most once per day;
- only one nomination is active at a time;
- dead players cannot nominate, but can be nominated;
- a rejected nomination creates no accepted domain event.

This correction does not add a hidden “about-to-die” status and does not infer
death from nomination or voting.

### Deterministic fixture preconditions

Any later implementation test fixture must be a deterministic, nonterminal
Sects & Violets fixture with these exact preconditions:

```text
script = Sects & Violets
seed = 1
playerCount = 12
roster = 12 unique modeled players with stable seat order
setup = validated and complete
assignment = validated and complete
firstNightPlan = validated accepted plan
firstNightProgress = every planned first-night task settled
phaseBefore2C = FIRST_NIGHT
dayNumberBefore2C = 0
nightNumberBefore2C = 1
terminalState = false
gameEndedEvent = absent
victoryResolvedEvent = absent
activeVictoryCandidate = absent
```

The fixture must not rely on a role-specific ability, a terminal win, a
random/clock/locale ordering, or an unrecorded Storyteller decision. The
ordinary-night portion cannot be instantiated until its required-task
inventory has an accepted authority. Seed `1` is a deterministic fixture
precondition, not a rule claim and not permission to add a setup exception.

### Exact command schemas and validator ownership

The command envelope remains exact and unchanged:

```text
{
  commandId: string,
  gameId: string,
  expectedGameVersion: non-negative integer,
  actor: existing actor envelope,
  issuedAt: existing canonical timestamp,
  correlationId: string,
  payload: exact command payload
}
```

Bounded payload schemas:

| Command | Exact payload |
|---|---|
| `CompleteNight` (first night) | `{ phase: "FIRST_NIGHT" }` |
| `PublishDawn` | `{ phase: "DAWN_RESOLUTION" }` |
| `OpenNominations` | `{}` |
| `DeclareNomination` | `{ targetPlayerId: string }` |
| `OpenVote` | `{ nominationId: string }` |
| `CastVote` | `{ nominationId: string, choice: "YES" | "NO" }` |
| `CompleteVote` | `{ nominationId: string }` |
| `CloseNominations` | `{}` |
| `ResolveExecution` | `{ blockId: string }` |
| `BeginNight` | `{ dayNumber: non-negative integer, nightNumber: positive integer }` |
| `CompleteNight` (ordinary-night boundary) | `{ phase: "NIGHT_TASKS", nightNumber: positive integer }` |

The same command name has two explicitly discriminated phase payloads; a
missing or mismatched `phase` is rejected. No command accepts hidden target
role, alignment, death prediction, impairment, or correctness fields.

Validator ownership is fixed as follows:

- command envelope and exact payload shape: existing application command
  boundary and domain command-shape validator;
- phase/transition legality and counter math:
  `packages/domain-core/src/phase-transition-policy.ts`;
- candidate batch ordering, event count, metadata, and cross-links:
  `packages/domain-core/src/domain-batch-semantics.ts`;
- payload and current-state application checks:
  `packages/domain-core/src/event-applier.ts`;
- first-night progress and ordinary-night inventory checks:
  the task-plan authority used by `first-night-task-plan.ts` plus the new
  bounded inventory seam; no no-op fallback;
- atomic prospective validation, commit, receipt, and retryability:
  `packages/application/src/game-application-service.ts` and existing store
  boundary;
- replay equivalence: existing full event-stream rebuild authority;
- projection forbidden-field checks: existing projection boundary;
- structural schema authority: C1 remains owner and is not modified by this
  design correction.

No validator may silently repair malformed input, infer an ordinary-night
  task inventory, or convert a rejected command into a domain fact.

### Ordinary-night inventory blocker

The current repository has no accepted authoritative inventory describing the
required ordinary-night tasks for the deterministic fixture. Existing
first-night task plans and the official nightsheet do not, by themselves,
constitute an accepted repository ordinary-night task inventory or a complete
ordinary-night settlement contract.

Therefore:

- `ordinaryNightRequiredTaskInventory=UNAVAILABLE_CURRENT_REPO`;
- `noOpOrdinaryNightCompletion=PROHIBITED`;
- `ordinaryNightCompletion=HUMAN_BLOCKED`;
- blocker:
  `2C-DC1-F01_ORDINARY_NIGHT_REQUIRED_TASK_AUTHORITY_UNAVAILABLE`;
- `designVerdict=HUMAN_BLOCKED`;
- `implementationAuthorized=false`.

Available bounded dispositions are:

- **Option A — foundation reslice:** create a separately authorized foundation
  slice that establishes and accepts the ordinary-night required-task
  inventory, its source binding, and its minimal settlement contract. It must
  not quietly become 2C implementation.
- **Option B — stop at `NIGHT_TASKS`:** rescope 2C to first-night/day and the
  day-to-night entry only, stopping before ordinary-night completion and dawn.
  This does not satisfy the original complete-loop objective.
- **Option C — accepted inventory:** proceed only if a previously accepted,
  exact ordinary-night inventory becomes available and is independently bound
  to the deterministic fixture. No current repository artifact qualifies, so
  this option is unavailable now.

No option is selected by this correction. Human governance must choose or
authorize a new bounded reslice.

### Correction disposition

The design correction closes the execution/death and nomination ambiguities at
the schema level, freezes the V1.1 matrix, and establishes deterministic
fixture preconditions. It cannot close the ordinary-night authority blocker.

```text
designCorrectionCount = 1
designVerdict = HUMAN_BLOCKED
implementationAuthorized = false
ordinaryNightBlocker = 2C-DC1-F01_ORDINARY_NIGHT_REQUIRED_TASK_AUTHORITY_UNAVAILABLE
B18Status = HUMAN_BLOCKED_UNCHANGED
B18ConflictsTouched = none
Slice3 = false
```

No production code, tests, workflow, C/C1/A/B, event-definition authority,
semantic validator, coverage, routing, publication, CI, implementation branch,
future implementation SHA, or PR is created by this correction.

## Current Active Design — Unified Correction

This section is the current bounded design after the ordinary-night research
appendix and the two design corrections. Earlier sections remain immutable
history. This section is ready for independent design review only; it is not
an implementation approval or a review verdict.

### Active disposition

```text
sliceId = 2C
ordinaryNightFoundationDisposition = BOUNDED_INTERNAL_2C_PREREQUISITE
designCorrectionCount = 2
designReadyForIndependentReview = true
implementationAuthorized = false
implementationActualSHA = NOT_BOUND
reviewSHA = NOT_BOUND
B18Status = HUMAN_BLOCKED_UNCHANGED
B18ConflictsTouched = none
Slice3 = false
```

The ordinary-night inventory is now deliberately bounded to the exact
deterministic Sects & Violets fixture below. It is not a global ordinary-night
registry and it does not claim to implement every role's ordinary-night
behavior.

### Deterministic Sects & Violets fixture

The fixture is generated by the real setup generator. It must not hand-build a
setup or assignment object and must not bypass setup validation.

```text
script = Sects & Violets
rootSeed = seed-1
exactRoleIds = [
  artist,
  barber,
  clockmaker,
  evil_twin,
  fang_gu,
  mutant,
  philosopher,
  sage,
  savant,
  seamstress,
  sweetheart,
  witch
]
roleCounts = { townsfolk: 6, outsiders: 3, minions: 2, demons: 1 }
playerCount = 12
setupGeneration = REAL_SETUP_GENERATOR
setupInput = exactRoleIds
assignment = REAL_CHARACTER_ASSIGNMENT
terminal = false
gameEnded = false
victoryResolved = false
```

The exact role IDs are a generator input and assertion, not a second setup
authority. The resulting setup, roster, assignment, role catalog signature,
and player-seat mapping are recorded by the existing canonical setup events.
The fixture fails closed if the generator returns different role IDs, counts,
seat cardinality, or setup/assignment signatures.

No global role-order or task-order array is created. The fixture derives all
source seats and target candidates from the validated generated setup,
assignment, roster, and deterministic seed stream.

### First-night precondition and ordinary-night inventory

The first-night plan remains the accepted plan authority. Before ordinary
night begins, the following must be true:

- `PHILOSOPHER_ACTION` is settled;
- `SEAMSTRESS_ACTION` is settled;
- all other planned first-night tasks are settled through their accepted
  paths;
- no first-night task is transferred into the ordinary-night plan;
- if either Philosopher or Seamstress remains unsettled, ordinary-night plan
  creation and completion fail closed;
- no role action is silently skipped or converted to a no-op.

The bounded ordinary-night inventory contains exactly these two tasks:

```text
FANG_GU_DEMON_KILL
WITCH_ACTION
```

Both tasks are derived from the generated setup and assignment. They are not
copied from a global static order array and are not accepted merely because a
role title appears in a test fixture.

### Ordinary-night-v1 plan/window/version

The plan has an independent authority and version from the first-night plan:

```text
planVersion = ordinary-night-v1
window = OTHER_NIGHT
nightNumber = 2
planKind = DERIVED_FIXTURE_PLAN
taskCount = 2
```

The exact deterministic task IDs are:

```text
ordinary-night-v1:FANG_GU_DEMON_KILL:night-02:seat-<fang-gu-seat-2-digit>
ordinary-night-v1:WITCH_ACTION:night-02:seat-<witch-seat-2-digit>
```

`<fang-gu-seat-2-digit>` and `<witch-seat-2-digit>` are derived from the
validated assignment and formatted as `01` through `12`. They are not user
input. The validator rejects any task ID that does not match its generated
source role, source player, source seat, task type, plan version, window, and
night number.

Task ordering is derived per task from its source action metadata and stable
numeric seat tie-break; no `ordinaryNightOrder[]` global order array is stored
or consulted. A missing source action metadata value is a hard failure.

### Deterministic target derivation and no transfer

Neither ordinary-night command accepts a target player. The system derives a
target from the validated fixture using a deterministic seed-1 stream:

1. build the legal candidate set from current event-derived life/character
   state;
2. filter the set according to the bounded task contract;
3. sort by numeric seat number;
4. derive the selection index from the fixed seed stream and task ID;
5. record the candidate-set identity, seed, index, source, and target in the
   canonical target-derived event.

The candidate set is not exposed to player or AI projections.

- `FANG_GU_DEMON_KILL` excludes the source and excludes Outsider targets for
  this fixture so that the Fang Gu transfer branch cannot be entered.
- `WITCH_ACTION` uses any legal modeled player target other than the source,
  including a dead player only if that state is already present and the
  bounded action contract permits it.
- If a legal candidate set is empty, the task fails closed.
- If a target would trigger Fang Gu Demon transfer, a character change, an
  alignment change, or any unsupported death replacement, the task fails
  closed; no transfer event is produced.
- There is no target fallback, dynamic inference, random API, clock input,
  locale ordering, or global order array.

### Current active commands

Command envelope fields remain the existing exact fields:

```text
commandId, gameId, expectedGameVersion, actor, issuedAt, correlationId, payload
```

The bounded payloads are exact and reject missing, extra, hidden, or
phase-inconsistent fields:

| Command | Exact payload schema |
|---|---|
| `CompleteNight` (first night) | `{ commandType: "CompleteNight", phase: "FIRST_NIGHT", planVersion: "first-night-task-plan-v1" | "first-night-task-plan-v2", nightNumber: 1 }` |
| `PublishDawn` | `{ commandType: "PublishDawn", phase: "DAWN_RESOLUTION", nightNumber: positiveInteger }` |
| `OpenNominations` | `{ commandType: "OpenNominations", dayNumber: positiveInteger }` |
| `DeclareNomination` | `{ commandType: "DeclareNomination", targetPlayerId: playerId }` |
| `OpenVote` | `{ commandType: "OpenVote", nominationId: nominationId }` |
| `CastVote` | `{ commandType: "CastVote", nominationId: nominationId, choice: "YES" | "NO" }` |
| `CompleteVote` | `{ commandType: "CompleteVote", nominationId: nominationId }` |
| `CloseNominations` | `{ commandType: "CloseNominations", dayNumber: positiveInteger }` |
| `ResolveExecution` | `{ commandType: "ResolveExecution", blockId: blockId }` |
| `BeginNight` | `{ commandType: "BeginNight", dayNumber: 1, nightNumber: 2, planVersion: "ordinary-night-v1", window: "OTHER_NIGHT" }` |
| `SettleOrdinaryNightTask` | `{ commandType: "SettleOrdinaryNightTask", taskId: exactOrdinaryNightTaskId }` |
| `CompleteNight` (ordinary night) | `{ commandType: "CompleteNight", phase: "NIGHT_TASKS", planVersion: "ordinary-night-v1", window: "OTHER_NIGHT", nightNumber: 2 }` |

`SettleOrdinaryNightTask` has no target field. Target derivation is canonical
system work and cannot be supplied or overridden by a player, AI, Storyteller,
or caller.

### Current active event schemas

All event payloads below are exact records. The common event envelope is the
existing event envelope and is not repeated in every record. No event may add
role, alignment, hidden candidate, impairment, or Storyteller-only fields.

#### `PhaseTransitioned`

```text
{
  rulesBaselineVersion: string,
  fromPhase: GamePhase,
  toPhase: GamePhase,
  transitionReason: PhaseTransitionReason,
  dayNumberBefore: nonNegativeInteger,
  dayNumberAfter: nonNegativeInteger,
  nightNumberBefore: nonNegativeInteger,
  nightNumberAfter: nonNegativeInteger
}
```

Only these transitions are enabled by this design:

```text
FIRST_NIGHT -> DAWN_RESOLUTION             FIRST_NIGHT_COMPLETED
DAWN_RESOLUTION -> DAY_DISCUSSION          DAWN_COMPLETED
DAY_DISCUSSION -> NOMINATION_WINDOW        NOMINATION_OPENED
NOMINATION_WINDOW -> VOTING                VOTE_OPENED
VOTING -> NOMINATION_WINDOW                VOTE_COMPLETED
NOMINATION_WINDOW -> EXECUTION_RESOLUTION  NOMINATIONS_CLOSED
EXECUTION_RESOLUTION -> NIGHT_TASKS        EXECUTION_RESOLVED
NIGHT_TASKS -> DAWN_RESOLUTION             NIGHT_TASKS_COMPLETED
```

#### `NominationDeclared`

```text
{
  nominationId: nominationId,
  nominatorPlayerId: playerId,
  nomineePlayerId: playerId,
  dayNumber: positiveInteger,
  nominationOrdinal: positiveInteger
}
```

The nominator must be alive; the nominee may be alive or dead. Once-per-day
limits and one-active-nomination are validated before event creation.

#### `VoteCast`

```text
{
  voteId: voteId,
  nominationId: nominationId,
  voterPlayerId: playerId,
  voterSeatNumber: seatNumber,
  choice: "YES" | "NO",
  ghostVoteConsumed: boolean
}
```

Living voters may cast the permitted daily votes. A dead voter can consume its
single remaining ghost vote exactly once.

#### `BlockStateUpdated`

```text
{
  nominationId: nominationId,
  dayNumber: positiveInteger,
  livingPlayerCount: positiveInteger,
  threshold: positiveInteger,
  leaderNominationId: nominationId | null,
  leaderVoteCount: nonNegativeInteger,
  tied: boolean
}
```

The block result is derived from canonical votes, requires at least half of
living players and a strictly greatest tally, and fails on ties or zero votes.

#### `ExecutionDeclared`

```text
{
  executionId: executionId,
  blockId: blockId,
  targetPlayerId: playerId,
  dayNumber: positiveInteger
}
```

#### `PlayerDied`

```text
{
  deathId: deathId,
  executionId: executionId | null,
  playerId: playerId,
  dayNumber: positiveInteger,
  cause: "EXECUTION" | "FANG_GU_DEMON_KILL" | "WITCH_ACTION"
}
```

`PlayerDied.cause=EXECUTION` is the only execution-linked cause. Demon death
from a night task is a separate `PlayerDied` event with a night cause and
cannot satisfy a daytime execution criterion. A cause outside these bounded
values fails closed.

#### `ExecutionResolved`

```text
{
  executionId: executionId,
  targetPlayerId: playerId,
  dayNumber: positiveInteger,
  resolution: "EXECUTED",
  deathOutcome: "DIED" | "DID_NOT_DIE"
}
```

The `DID_NOT_DIE` path emits no `PlayerDied` for that execution. It preserves
the daily execution fact without mutating the target to dead.

#### `DayClosedWithoutExecution`

```text
{
  dayNumber: positiveInteger,
  blockId: blockId | null,
  reason: "NO_EXECUTABLE_CANDIDATE"
}
```

This event is mutually exclusive with `ExecutionDeclared` and
`ExecutionResolved`.

#### `OrdinaryNightTaskPlanCreated`

```text
{
  planVersion: "ordinary-night-v1",
  window: "OTHER_NIGHT",
  nightNumber: 2,
  taskCount: 2,
  tasks: [
    {
      taskId: exactFangGuTaskId,
      taskType: "FANG_GU_DEMON_KILL",
      sourcePlayerId: generatedFangGuPlayerId,
      sourceSeatNumber: generatedFangGuSeat,
      status: "PENDING"
    },
    {
      taskId: exactWitchTaskId,
      taskType: "WITCH_ACTION",
      sourcePlayerId: generatedWitchPlayerId,
      sourceSeatNumber: generatedWitchSeat,
      status: "PENDING"
    }
  ]
}
```

The task array is a plan-local set of exactly two tasks, not a global order
authority. Its entries are sorted by the deterministic per-task comparator.

#### `OrdinaryNightTargetDerived`

```text
{
  taskId: exactOrdinaryNightTaskId,
  taskType: "FANG_GU_DEMON_KILL" | "WITCH_ACTION",
  sourcePlayerId: generatedSourcePlayerId,
  targetPlayerId: derivedTargetPlayerId,
  candidateSet: [playerId, ...],
  selectionIndex: nonNegativeInteger,
  seed: "seed-1",
  transferOutcome: "NONE"
}
```

The candidate set is canonical evidence but is not player-visible. `NONE` is
the only supported transfer outcome; any transfer or unsupported role change
rejects the batch.

#### `OrdinaryNightTaskSettled`

```text
{
  planVersion: "ordinary-night-v1",
  window: "OTHER_NIGHT",
  nightNumber: 2,
  taskId: exactOrdinaryNightTaskId,
  taskType: "FANG_GU_DEMON_KILL" | "WITCH_ACTION",
  sourcePlayerId: generatedSourcePlayerId,
  targetPlayerId: derivedTargetPlayerId,
  settlement: "RESOLVED",
  transferOutcome: "NONE"
}
```

For a legal target, a corresponding `PlayerDied` may be emitted according to
the bounded task result. A dead target produces no additional death and does
not make the task incomplete. The task itself must still settle with the exact
target-derived linkage.

### Settlement and completion predicates

#### First-night completion

```text
validateFirstNightTaskProgress(firstNightPlan, firstNightProgress) == valid
and getNextUnsettledFirstNightTask(firstNightPlan, firstNightProgress) == undefined
and firstNightPlan.nightNumber == 1
and currentPhase == FIRST_NIGHT
```

`CompleteNight(FIRST_NIGHT)` emits only the exact
`FIRST_NIGHT_COMPLETED` transition after this predicate passes. Missing,
malformed, duplicate, reordered, or unsupported first-night task state fails
closed.

#### Ordinary-night plan creation

```text
currentPhase == NIGHT_TASKS
dayNumber == 1
nightNumber == 2
firstNightPlan is valid
getNextUnsettledFirstNightTask(firstNightPlan, progress) == undefined
Philosopher task is settled
Seamstress task is settled
generatedSetup matches exactRoleIds and counts
ordinaryPlanVersion == ordinary-night-v1
ordinaryPlan.window == OTHER_NIGHT
ordinaryPlan.tasks == exactly [FANG_GU_DEMON_KILL, WITCH_ACTION]
```

Any remaining Philosopher or Seamstress task, task-plan mismatch, role-count
mismatch, unsupported action source, or absent generated assignment rejects
`BeginNight` without a domain event.

#### Ordinary-night settlement

```text
ordinaryPlan is valid
taskId is one of the exact two plan task IDs
task.status == PENDING
derived target is valid and transferOutcome == NONE
```

`SettleOrdinaryNightTask` emits target derivation and settlement atomically.
Replaying the same task or supplying a target rejects without mutation.

#### Ordinary-night completion

```text
ordinaryPlan is valid
ordinaryPlan.tasks.every(task.status == SETTLED)
getNextUnsettledOrdinaryNightTask(ordinaryPlan) == undefined
ordinaryPlan.taskCount == 2
ordinaryPlan.planVersion == ordinary-night-v1
ordinaryPlan.window == OTHER_NIGHT
```

`CompleteNight(NIGHT_TASKS)` emits `NIGHT_TASKS_COMPLETED` only when this
predicate passes. A no-op completion, empty plan, hidden task, unsupported task,
or incomplete plan fails closed. There is no dynamic fallback and no
“complete because the window elapsed” behavior.

### Unsupported and fail-closed boundaries

- Any role ID outside the exact Sects & Violets fixture fails setup preflight.
- Any setup not generated by the real setup generator fails fixture binding.
- Any non-seed-1 source, nonterminal state, or altered role count fails.
- Any ordinary-night task outside the exact two-task inventory fails closed.
- Any remaining Philosopher/Seamstress first-night task fails closed.
- Any target supplied by a caller fails closed; targets are derived only.
- Any Fang Gu transfer, character change, alignment change, unsupported death
  replacement, or role-specific exception fails closed.
- Any global order array, dynamic selector, locale order, wall-clock input,
  random API, or hidden fallback is prohibited.
- Ordinary-night behavior not represented by the two bounded tasks remains
  unsupported and is not silently treated as complete.

### Validator ownership

The ownership boundary is exact:

- setup and exact role/count fixture binding: existing real setup generator and
  assignment validator;
- command envelope and exact command payload: existing command/application
  boundary;
- phase graph and counter transitions:
  `packages/domain-core/src/phase-transition-policy.ts`;
- event payload exact shape and event-type descriptor: existing C1 additive
  descriptor seam only; immutable old descriptors are not edited;
- candidate batch order, event counts, cross-links, and atomicity:
  `packages/domain-core/src/domain-batch-semantics.ts`;
- current-state event application and life/death consistency:
  `packages/domain-core/src/event-applier.ts`;
- first-night progress: existing `first-night-task-plan.ts` authority;
- ordinary-night plan/task/target derivation: one bounded
  `ordinary-night-v1` module owned by this slice;
- prospective validation, receipt, commit, and retryability:
  existing `packages/application/src/game-application-service.ts` and store
  boundary;
- replay equivalence: existing full event-stream rebuild;
- public/player/AI projection forbidden fields: existing projection boundary;
- C1 schema descriptors: additive new descriptors only; all old descriptors
  remain byte-for-byte immutable.

No validator repairs, infers, or accepts a hidden ordinary-night task.

### Traceability V1.1 — current nine-criterion matrix

Only legal Governance V1.1 vocabulary is used: reachability `R1`–`R4`, trust
`T1`–`T3`, and one primary layer per criterion. The current matrix has nine
active criteria, nine unique primary mechanisms, no duplicate, borrowed, or
mixed primary:

```text
criterionCount = 9
activeCriterionCount = 9
uniquePrimary = 9
duplicatePrimary = 0
borrowedPrimary = 0
mixedPrimary = 0
```

The exact nine design-time fields are:
`CriterionId`, `RuleClaim`, `CompletionCriterion`,
`RequiredEvidenceMechanism`, `ExpectedReachability`, `ExpectedTrust`,
`ExpectedPrimaryLayer`, `ExpectedResult`, and
`SupportingAuthorityRequirement`.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `2C-C01` | First-night tasks complete before dawn. | Validated plan has no next unsettled task. | `M-2C-C01-FIRST-NIGHT-SETTLEMENT` | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C02` | Dawn opens day with exact counters. | Exact `DAWN_COMPLETED` transition replays. | `M-2C-C02-DAWN-BOUNDARY` | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C03` | Alive nominators and alive/dead nominees follow limits. | Legal nomination accepted; illegal nomination rejected. | `M-2C-C03-NOMINATION-LEGALITY` | `R2` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C04` | Vote and ghost-vote rules are exact. | Canonical vote/token state replays. | `M-2C-C04-VOTE-TOKEN` | `R2` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C05` | Threshold, greatest tally, tie, and no-vote policy is deterministic. | Block result matches policy. | `M-2C-C05-VOTE-POLICY` | `R2` | `T2` | `PURE_POLICY_SEAM` | `PASS` | `NONE` |
| `2C-C06` | Execution and death are separate. | DIED and DID_NOT_DIE schemas remain distinct. | `M-2C-C06-EXECUTION-DEATH` | `R3` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C07` | Exact bounded ordinary-night tasks settle without transfer. | Both ordinary-night-v1 tasks settle or fail closed. | `M-2C-C07-ORDINARY-TASKS` | `R3` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | `PASS` | `NONE` |
| `2C-C08` | Candidate batches are atomic and replay-safe. | Exact event batch validates prospectively and on replay. | `M-2C-C08-BATCH-VALIDATION` | `R4` | `T1` | `STRUCTURAL_VALIDATION` | `PASS` | `NONE` |
| `2C-C09` | Public/player projections do not leak hidden state. | Projection forbidden-field audit passes. | `M-2C-C09-PROJECTION-BOUNDARY` | `R4` | `T3` | `PROJECTION` | `PASS` | `NONE` |

`2C-C08` is the sole batch-validation primary. `2C-C09` is the sole
projection primary. Neither is mixed with the other or used as a substitute
for the execution/death primary. No supporting authority is borrowed.

### C1 additive descriptor boundary

C1 remains frozen. The implementation may add descriptors for the new bounded
event payloads only through the accepted additive descriptor seam. Existing C1
descriptors, node IDs, field order, hashes, and historical descriptors are
immutable and must not be rewritten, regenerated, or semantically relabeled.

Required additive descriptor subjects are exactly:

```text
NominationDeclared
VoteCast
BlockStateUpdated
ExecutionDeclared
PlayerDied
ExecutionResolved
DayClosedWithoutExecution
OrdinaryNightTaskPlanCreated
OrdinaryNightTargetDerived
OrdinaryNightTaskSettled
```

The descriptor additions are expected bindings only. This document does not
materialize C1 or claim an implementation SHA.

### File allowlist

Implementation, if later authorized by independent review, may touch only the
smallest subset of these files:

- `packages/domain-core/src/phase-transition-policy.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/command.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/first-night-task-plan.ts` only for the bounded
  completion seam, without changing accepted first-night behavior
- one new bounded `packages/domain-core/src/ordinary-night-v1.ts`
- `packages/application/src/game-application-service.ts`
- bounded domain/application tests for this design
- one 2C implementation status/traceability document
- C1 additive descriptors only, in their existing owned descriptor seam

Forbidden: all unrelated production modules, role implementations, assignment
or setup generation logic, accepted event history, workflow, dependencies,
coverage/routing/publication, hosted CI, UI/Electron/SQLite/network, C/C1/A/B
history rewrites, and Slice 3 or later.

### Budgets and stop-loss

```text
productionFileCeiling = 10
productionLineCeiling = 700
newTestFileCeiling = 6
newEventFamilies = 10 bounded descriptors listed above
designCorrectionCount = 2
implementationRepairRound = 0/2
permanentInfrastructure = 0
```

The line and file ceilings are hard stops. Exceeding either, needing a global
order array, needing a generic role/lifecycle registry, requiring a new
permanent authority, changing accepted first-night semantics, encountering an
unsupported role transfer, leaking hidden state, or discovering a mismatch in
the generated seed-1 fixture is `HUMAN_BLOCKED` and requires a new bounded
reslice. Slice 3 remains false and cannot start automatically.

### Required next gate

Run a fresh independent design review against this current active design,
the complete prior evidence history, the ordinary-night research appendix,
and the immutable C1 boundary. Until that review is complete, implementation
remains unauthorized. This section contains no implementation verdict, no
future implementation SHA, no push, and no PR.

## Final Design Correction Round 3 — Foundation Rescope

This final correction appends the fresh Fang Gu/Witch evidence disposition and
supersedes only the role-specific ordinary-night portions of the preceding
active design. All prior designs and matrices remain preserved as historical
records. The current design is intentionally blocked pending a new independent
review of this correction.

```text
designCorrectionCount = 3
designVerdict = HUMAN_BLOCKED
implementationAuthorized = false
ordinaryNightFoundationDisposition = GENERIC_TASK_INVENTORY_PLUMBING_ONLY
ordinaryNightUnsupportedTasks = [FANG_GU_DEMON_KILL, WITCH_ACTION]
unsupportedTaskHandling = FAIL_CLOSED
witchFoundationSemantics = CURSE_ONLY_NO_NIGHT_DEATH
fangGuFoundationSemantics = UNSUPPORTED_NO_TRANSFER
rolePromotion = NONE
C1DescriptorExtensionPrerequisite = HUMAN_BLOCKED
B18Status = HUMAN_BLOCKED_UNCHANGED
B18ConflictsTouched = none
Slice3 = false
```

### Evidence binding

The correction consumes the appended evidence record in
`docs/rules/evidence/2C.md`, including the fresh official Imp/Witch references,
and preserves the existing evidence hashes and override history. The external
role pages establish role semantics but do not authorize a generic foundation
to execute those semantics.

### Foundation boundary

The foundation is reduced to generic, accepted task/inventory plumbing only:

- represent an opaque ordinary-night task inventory seam;
- bind a plan version, window, night number, source identity, task identity,
  pending/settled status, and exact completion predicate;
- validate that every task in an accepted inventory settles before completion;
- reject missing, extra, duplicate, reordered, unsupported, or hidden tasks;
- preserve deterministic identity and replay/prospective validation;
- provide no role-specific target derivation or role-specific settlement.

The foundation must not create a new accepted inventory for the current
Sects & Violets role collection. In particular, the role set containing Fang
Gu and Witch cannot be used to claim that the two role-specific tasks are
settleable through generic plumbing.

### Unsupported task handling

`FANG_GU_DEMON_KILL` and `WITCH_ACTION` are explicit unsupported tasks for the
foundation. If either appears in the current generated ordinary-night task
inventory, the system fails closed at inventory validation and emits no task
settlement, target, death, transfer, or completion event. It may not silently
skip either task, turn it into a no-op, or declare the night complete.

The exact role-specific task IDs and target-derived event schemas in the prior
active design are historical design proposals only. They are not current
implementation bindings and are not authorized by this correction.

### Witch boundary

Any future Witch-specific extension is limited here to the curse/event-
subscription concept. This foundation does not implement a Witch night death,
does not emit a Witch death event, and does not resolve a target death from a
Witch task. A Witch curse may be a later bounded role-policy slice only after
fresh rule evidence and design review.

### Fang Gu boundary

Fang Gu Demon kill, Outsider replacement, character transfer, alignment
transfer, and source-death effects are outside the foundation. No Fang Gu
target is derived, no Fang Gu death is emitted, and no transfer is accepted.
Any appearance of this task is a deterministic fail-closed condition.

### Execution/death separation remains frozen

The execution/death contract remains unchanged from the approved override:

- execution is a daytime decision/fact;
- a night-role death is not an execution;
- `ExecutionResolved` and `PlayerDied` remain separate concepts;
- no unsupported ordinary-night task may emit either event;
- a no-death execution path remains explicit and does not mutate life state.

### C1 descriptor prerequisite

The prior active design proposed additive C1 descriptors for ordinary-night
events. This correction removes that as an implementation permission. No C1
descriptor is added or modified in this foundation. Any future descriptor
extension is a separate prerequisite requiring:

```text
C1DescriptorExtensionPrerequisite = HUMAN_BLOCKED
descriptorAuthority = C1_OWNER_ONLY
oldDescriptors = IMMUTABLE
newDescriptors = NOT_AUTHORIZED
```

Until that prerequisite is separately authorized and reviewed, the generic
foundation cannot claim a new event schema authority. Existing C1 descriptors
remain unchanged and no role-specific event can be materialized.

### Current status and next gate

The design is bounded only as a generic inventory/task plumbing foundation.
It is not a complete Sects & Violets ordinary-night implementation and does
not promote Fang Gu or Witch coverage. The independent reviewer must inspect
this final correction, the appended evidence, the preserved history, and the
C1 prerequisite boundary before any further decision.

```text
designVerdict = HUMAN_BLOCKED
implementationAuthorized = false
implementationActualSHA = NOT_BOUND
reviewSHA = NOT_BOUND
productionChanges = 0
testChanges = 0
workflowChanges = 0
CIExecuted = false
PRCreated = false
```
