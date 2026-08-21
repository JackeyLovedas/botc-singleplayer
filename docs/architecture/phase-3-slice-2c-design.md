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
