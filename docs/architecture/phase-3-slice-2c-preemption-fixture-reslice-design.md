# Phase 3 Slice 2C Preemption Fixture Reslice Design

## Decision record

```text
sliceId=2C
designId=POST_FOUNDATION_EXACT_FIXTURE_2C_PREEMPTION_RESLICE_DESIGN
designKind=BOUNDED_PREEMPTION_FIXTURE
designStatus=DESIGN_CORRECTION_ROUND_2_PENDING_INDEPENDENT_REVIEW
designVerdict=RULE_DESIGN_FIX_REQUIRED
implementationAuthorized=false
designCorrectionRound=2
designCorrectionBudget=2/2
implementationCorrectionBudget=0/3
futureImplementationSHA=NOT_APPLICABLE
```

## Immutable status block

```text
C=FROZEN
C1=FROZEN_40_EVENTS_59_BRANCHES
B18=HUMAN_BLOCKED_UNCHANGED
Slice3=NOT_STARTED_FROZEN
workflow=FROZEN_NO_CHANGE
coverage=FROZEN_NO_CHANGE
productionBoundary=FROZEN_NO_CHANGE_OUTSIDE_APPROVED_IMPLEMENTATION
testIdentityGeneration=FROZEN_NO_CHANGE
implementationAuthorized=false
```

This correction round consumes the second and final design-correction budget.
It must not create a third correction round.

This document supersedes only the unaccepted Dreamer/Cerenovus exact-fixture
proposal for the next design review. It does not rewrite accepted C/C1
history, the ordinary-night settlement contract, the coverage migration, or
the workflow topology. It is a design contract; no production or test change
is implied by any field below.

## Bounded fixture

The fixture is a fixed twelve-player Sects & Violets setup. The exact role IDs
are the following user-authorized set, in the supplied order:

```text
[clockmaker, flowergirl, savant, seamstress, philosopher, artist,
 sage, mutant, klutz, evil_twin, pit_hag, vortox]
```

The runtime may canonicalize the same set for deterministic sorting, but it
must not add, remove, or infer a role. In particular, `dreamer`, `cerenovus`,
`fang_gu`, `witch`, and `mathematician` are not members of this fixture. Any
earlier candidate containing those roles is historical and superseded, not a
fallback.

The implementation must later provide two independent witnesses:

1. `productionSetupWitness`: the unmodified production setup generator accepts
   the twelve-player role set and its recorded seed;
2. `productionAssignmentWitness`: the production assignment output binds each
   player, seat, role ID, character type, and alignment without hand-edited
   state.

Until both witnesses exist, the fixture signature is `EXPECTED_ONLY`; no
   implementation SHA or fixture digest is predeclared here. The fixture must
retain the accepted Philosopher/Artist first-night spent provenance and the
Seamstress/Mutant+Savant first-night spent provenance where those already
accepted paths are used. This reslice does not reopen or reinterpret them.

### Frozen expected binding (not an implementation witness)

The design input is the deterministic seed literal
`2c-preemption-pithag-vortox-v1`. It is an expected input, not a claim that a
future generator run has succeeded. The expected seat binding is:

```text
seat 0  clockmaker
seat 1  flowergirl
seat 2  savant
seat 3  seamstress
seat 4  philosopher
seat 5  artist
seat 6  sage
seat 7  mutant
seat 8  klutz
seat 9  evil_twin
seat 10 pit_hag
seat 11 vortox
```

The implementation must report a canonical `playerId -> seat -> roleId`
digest and a separate setup digest produced by the production generator. A
digest mismatch, a seat collision, a role-set delta, or an assignment that
cannot be traced to the generator is a deterministic `FIXTURE_BINDING_MISMATCH`
failure. No test may substitute a hand-authored snapshot for that witness.

The bounded Pit-Hag choice is frozen for the fixture as follows: Pit-Hag at
seat 10 targets Mutant at seat 7 and chooses `fang_gu`, which is a legal
character in the standard Sects & Violets role pool but is not in this exact
fixture. The choice is therefore a concrete “not already in play” choice, not
an arbitrary role selector. This choice opens the sourced arbitrary-death
consequence for the night. The witness must use one fixed victim, Sage at
seat 6, with causal reason `PIT_HAG_ARBITRARY_DEATH`; it must not encode this
death as the daytime nomination execution. If the production role pool or
accepted role source rejects this choice, the fixture is `FIXTURE_BINDING_MISMATCH`
and the slice stops; no alternate role is inferred.

### Exact Pit-Hag bounded event and state contract

The single fixture-scoped `PitHagActionResolved` event has this exact expected
payload shape (field names are part of the design contract; actual event IDs
and future SHA values are implementation facts):

```text
eventType=PitHagActionResolved
sourcePlayerId=player-10
sourceSeatNumber=10
sourceRoleId=pit_hag
sourceRoleTenureId=<accepted-current-tenure>
sourceAbilityInstanceId=<accepted-current-ability-instance>
targetPlayerId=player-7
targetSeatNumber=7
oldRoleId=mutant
newRoleId=fang_gu
targetAlignment=GOOD
alignmentPreserved=true
choiceInExactFixture=false
choiceInRolePool=true
stateRevisionBefore=<current-character-state-revision>
stateRevisionAfter=<next-character-state-revision>
nightNumber=<current-ordinary-night>
phase=NIGHT_PREEMPTION
causalConsequence=PIT_HAG_ARBITRARY_DEATH_WINDOW
```

`<...>` fields are runtime bindings, not placeholders for future SHA values.
Prospective validation requires the source tenure/ability instance to be the
current accepted one; seat 7 must currently be `mutant` with `GOOD` alignment;
`fang_gu` must be absent from the exact assigned role set; and the state
mutation must change only the target character plus its new tenure/ability
instance. The target alignment remains `GOOD`. The applier order is frozen:

```text
state-before check
 -> PitHagActionResolved accepted
 -> target character/tenure/ability-instance mutation
 -> PlayerDied(target=player-6, cause=PIT_HAG_ARBITRARY_DEATH)
 -> NIGHT_TASKS transition
```

Replay must apply exactly that order and reject a death before the action, a
role mutation after the death, stale tenure/ability provenance, a changed
alignment, duplicate action, or a second arbitrary death. The fixed Sage death
is a night arbitrary-death consequence, not an `ExecutionDeclared`,
`ExecutionResolved`, or daytime nomination execution. “Night attack/death”
and “daytime execution” are distinct vocabulary and event causes throughout
this design.

The newly made `fang_gu` action itself is not simulated in this slice. It is
recorded as fixture-specific `UNSUPPORTED_FANG_GU_ACTION` / `OUT_OF_SCOPE`;
no Fang Gu scheduled task, attack resolver, or dynamic task rebuild is
generated. If proving the action would require such a framework, the true
stop is `NEW_ROLE_CHANGE_FRAMEWORK_REQUIRED`, and no implementation proceeds.

## Authority split

External rule evidence controls role text, eligibility, timing, night order,
execution/death distinction, and the Vortox and Pit-Hag consequences.
Repository simulation contracts control event names and exact payloads,
prospective validation, task progress, terminal settlement, replay,
provenance, idempotency, and phase transitions. A repository contract is never
presented as an external rule claim.

The rule evidence for this design is materialized separately in
`docs/rules/evidence/2C-preemption-fixture.md`. The independent reviewer must
re-read the cited sources before returning `RULE_DESIGN_PASS`.

## A-R bounded flow

The accepted end-to-end witness is one complete flow. Each row identifies the
boundary that the implementation must prove; it does not authorize a new
general-purpose engine.

| Step | Required boundary | Expected bounded evidence |
|---|---|---|
| A | Setup | Production setup accepts exactly the twelve role IDs and records seed, script, roster, and setup provenance. |
| B | Assignment | Production assignment binds seats and roles exactly; no role is created by the fixture. |
| C | First-night plan | Existing first-night plan opens; accepted first-night task semantics remain unchanged. |
| D | Philosopher | Philosopher chooses Artist through the accepted path; choice and spent state have source-seat and ability-instance provenance. |
| E | Seamstress | Seamstress chooses Mutant and Savant through the accepted path; choice and spent state are replayable and idempotent. |
| F | Dawn | First night settles and reaches the existing dawn boundary; no ordinary task is silently settled here. |
| G | Day opening | The accepted phase policy opens the day and nomination window. |
| H | Nomination | One alive nominator makes one legal nomination; once-per-day, nominee eligibility, actor provenance, and duplicate rejection are prospective and replay-checked. |
| I | Voting | Votes carry voter, nomination, day, and command provenance. Living voters may vote within the contract; the dead-player ghost-vote budget is one and is consumed once. |
| J | Vote result | The result uses at least half of living players, a strict highest tally, and a nonzero tally. Ties and insufficient/non-highest votes produce no execution. |
| K | Nomination close | At most one daily execution is resolved; the accepted execution/death separation remains explicit. |
| L | Pit-Hag preemption | A bounded Pit-Hag action is resolved before `NIGHT_TASKS`. Its selected execution/death consequence is represented by the existing execution/death chain, with exact causal provenance; no generic role-change framework is created. |
| M | Execution/death | `ExecutionDeclared`/`ExecutionResolved` and, when rule-authorized, `PlayerDied` are separate facts. The flow does not infer death solely from execution. |
| N | Night transition | Only after L/M prospective and replay checks pass does the phase enter `NIGHT_TASKS`. A pre-transition Pit-Hag consequence cannot be reordered after ordinary tasks. |
| O | Ordinary plan | The plan contains exactly `GENERIC_DEMON_KILL` and `FLOWERGIRL_ACTION`; there is no Dreamer or Cerenovus placeholder and no unsupported task silently filtered. |
| P | Vortox kill | Vortox's generic kill targets Flowergirl first. The accepted stream contains a real death event for that target before Flowergirl settlement. |
| Q | Flowergirl terminal | The Flowergirl task settles once as `SOURCE_INELIGIBLE` because its source is dead at the settlement boundary. It produces no fabricated vote-information result. |
| R | Completion/replay | The ordinary-night completion predicate, full-stream replay, tamper rejection, provenance, and retry idempotency all agree; the flow reaches the existing dawn boundary only once. |

The phrase “Vortox first kills Flowergirl” is a fixture test datum: the
selected target is the Flowergirl player, and the kill event precedes the
Flowergirl task settlement. It does not define a new Vortox ability or permit
other-night role behavior outside this fixture.

## Ordinary-night task contract

The plan is an exact, bounded record:

```text
ordinaryNightPlan = {
  nightNumber: N,
  tasks: [
    { taskType: GENERIC_DEMON_KILL, sourceRoleId: vortox, ... },
    { taskType: FLOWERGIRL_ACTION, sourceRoleId: flowergirl, ... }
  ]
}
```

The ellipses above are not permission for arbitrary fields: the implementation
must conform to the existing task-record, seed, task-ID, and phase fields.
Plan order is derived from the pinned official nightsheet and the approved
repository scheduling contract, not from insertion order or a dynamic
fallback. `DREAMER_ACTION` and `CERENOVUS_ACTION` must be rejected as foreign
to this fixture. Duplicate task IDs, duplicate source bindings, reordered
tasks, and a second settlement are rejected both prospectively and during
replay.

`SOURCE_INELIGIBLE` is a terminal task settlement, not an ability result. Its
minimum cross-link is:

```text
{
  taskId,
  taskType: FLOWERGIRL_ACTION,
  sourcePlayerId,
  sourceRoleId: flowergirl,
  sourceSeatNumber,
  sourceState: DEAD,
  terminalReason: SOURCE_INELIGIBLE,
  causalEventId: PlayerDied,
  outcome: TERMINAL
}
```

The actual event envelope must use the existing canonical metadata and exact
payload validation. Prospective validation requires the source task to be
present in the exact plan, the source to be dead in the rebuilt state, the
causal death to be accepted before settlement, and no prior settlement. Replay
requires the same ordering and cross-links from the accepted stream. A live
source, missing/forged death, wrong role or seat, unknown task, duplicate, or
reordered event fails closed.

## Pit-Hag boundary

The design consumes only the bounded Pit-Hag consequence needed for L-N. It
must not introduce a general character-change producer, dynamic task
recalculation framework, or arbitrary-death registry. The implementation must
bind the action to the accepted rule-source target and current role snapshot,
then use the existing execution/death events. If satisfying the fixture
requires a new unapproved structural authority, a new dependency, or a
general role-change framework, the implementation stops and reports a real
scope blocker instead of widening this slice.

The two death paths are intentionally separate:

```text
daytime nomination -> ExecutionDeclared -> ExecutionResolved
Pit-Hag night action -> PitHagActionResolved
                     -> PlayerDied(Sage, cause=PIT_HAG_ARBITRARY_DEATH)
```

`ExecutionResolved` never implies `PlayerDied`. The Pit-Hag path is a sourced
night arbitrary-death consequence and is not counted as the one daily daytime
execution. A reordered stream, an execution-only death claim, a missing
`PitHagActionResolved`, or a death with `cause=DAYTIME_EXECUTION` fails closed.
The victim is fixed only for this fixture and is not a reusable arbitrary-death
policy.

## Preemption authority table

There is exactly one runtime additive entry for this reslice. Historical C1
authority remains the default and rejects it; the explicit bounded 2C path may
admit it after its exact payload and provenance checks.

| Event subject | Bounded additive entry | Required predecessor | Required successor | Default C1 (40/59) |
|---|---|---|---|---|
| `PitHagActionResolved` | `2C_PREEMPTION_PIT_HAG_V1` | current `NIGHT_PREEMPTION`, source seat 10, target seat 7, chosen `fang_gu` | one causal death path before `NIGHT_TASKS` | reject `ADDITIVE_DESCRIPTOR_NOT_AUTHORIZED` |
| `PlayerDied` (caused by Pit-Hag) | existing death subject, bounded cause branch | accepted Pit-Hag action | `NIGHT_TASKS` may open | reject if new cause branch is not explicitly admitted |
| `FLOWERGIRL_ACTION` terminal settlement | existing task settlement subject with terminal reason | prior `PlayerDied` for seat 1 | ordinary plan completion | reject unknown task/shape |

`2C_PREEMPTION_PIT_HAG_V1` is a single fixture-scoped runtime admission, not a
second schema or a general descriptor registry. `additions.deltaBindings=[]`,
`newApprovedStructuralDeltaCount=0`, and the historical descriptor prefix
remain immutable. If the runtime cannot express this entry through the
accepted additive seam, the required result is `NEW_APPROVED_DELTA_REQUIRED`
and implementation stops.

The candidate descriptor/node fields are frozen as:

```text
descriptorId=2C_PREEMPTION_PIT_HAG_V1
eventType=PitHagActionResolved
payloadFields=sourcePlayerId,sourceSeatNumber,sourceRoleId,sourceRoleTenureId,
 sourceAbilityInstanceId,targetPlayerId,targetSeatNumber,oldRoleId,newRoleId,
 targetAlignment,alignmentPreserved,stateRevisionBefore,stateRevisionAfter,
 nightNumber,phase,causalConsequence
requiredNodeKinds=EXACT,STRING,SAFE_INTEGER,BOOLEAN,LITERAL,ENUM
descriptorOrdinal=41
branchOrdinal=60
runtimeAdmissionApi=admit2CPreemptionDescriptor
defaultAuthorityApi=admitFullC1Authority
defaultAuthorityResult=REJECT_ADDITIVE_DESCRIPTOR
```

`admit2CPreemptionDescriptor` is the only runtime additive entry and is
available only to this exact fixture path. It must not mutate the default
40/59 authority or expose a dynamic fallback. An implementation that needs a
second entry, a different node kind, a descriptor ordinal below 41, a branch
ordinal below 60, or a nonzero approved delta stops with
`NEW_APPROVED_DELTA_REQUIRED`.

## Governance V1.1 traceability

Each active criterion has exactly the nine required V1.1 fields below. R1-R4
and T1-T3 are supporting/evidence labels only; none is allowed to become a
second primary for another criterion.

Reachability is restricted to the protocol values `R1`, `R2`, `R3`, and `R4`:
`R1` is setup/plan application integration, `R2` is accepted-history replay
compatibility, `R3` is command/application integration, and `R4` is hostile
replay rejection. `A-B`, `G-K`, and similar step ranges are not reachability
values. Primary mechanisms use only the applicable protocol layers
`APPLICATION_COMMAND_INTEGRATION`, `LEGACY_REPLAY_COMPATIBILITY`,
`HOSTILE_REPLAY_REJECTION`, and `STRUCTURAL_VALIDATION`.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| 2C-A-R1 | exact role set is generated | setup and assignment digests equal the frozen 12-role binding | production generator witness + hostile fixture negatives | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-001 |
| 2C-A-R2 | Pit-Hag choice is concrete and not-in-play | seat 10 -> seat 7, `fang_gu`, with one causal death before `NIGHT_TASKS` | prospective/replay causal batch | R3 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-002 |
| 2C-A-R3 | daytime vote rules are bounded | legal nomination/vote reaches strict-highest execution or deterministic no-execution | command validators + tally/replay negatives | R3 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-003 |
| 2C-A-R4 | execution and death are distinct | execution-only stream never produces death; Pit-Hag death retains cause | event batch and replay rejection | R4 | T1 | HOSTILE_REPLAY_REJECTION | PASS | SUP-2C-PREEMPTION-004 |
| 2C-A-R5 | ordinary plan is exact | exactly two tasks, no Dreamer/Cerenovus placeholder | plan identity audit + duplicate/unknown rejection | R1 | T1 | STRUCTURAL_VALIDATION | PASS | SUP-2C-PREEMPTION-005 |
| 2C-A-R6 | Flowergirl cannot settle after death | `FLOWERGIRL_ACTION` has exactly one `SOURCE_INELIGIBLE` terminal settlement after target death | prospective/replay task validator | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | PASS | SUP-2C-PREEMPTION-006 |
| 2C-A-R7 | whole loop is replayable and idempotent | A-R accepted stream replays exactly; same command retries once; altered retry fails | replay, provenance, idempotency audit | R4 | T1 | HOSTILE_REPLAY_REJECTION | PASS | SUP-2C-PREEMPTION-007 |

Primary mechanisms are one-per-row. `R1`-`R4` are external source/research
support, `T1`-`T3` are repository evidence support; neither label is a mixed
primary layer. The traceability set is additive to this fresh design only and
does not cover C/C1 criteria.

### Planned supporting-authority ledger

Supporting evidence is subordinate to the primary mechanism and receives no
borrowed primary. The implementation-time ledger must materialize these
planned rows exactly once:

| AuthorityId | Status | UsedByCriteria | Mechanism | Primary | Required result |
|---|---|---|---|---|---|
| SUP-2C-PREEMPTION-001 | PLANNED | 2C-A,2C-B,2C-O | setup/assignment/plan fixture manifest | false | exact digest and role-set equality |
| SUP-2C-PREEMPTION-002 | PLANNED | 2C-A-R2,2C-C,2C-D,2C-E,2C-L,2C-M | accepted replay and Pit-Hag causal chain | false | predecessor/state order exact |
| SUP-2C-PREEMPTION-003 | PLANNED | 2C-A-R3,2C-G,2C-H,2C-I,2C-J | application command/tally evidence | false | legal vote and deterministic tally |
| SUP-2C-PREEMPTION-004 | PLANNED | 2C-A-R4,2C-K,2C-N | hostile replay rejection evidence | false | death/execution and reorder failures |
| SUP-2C-PREEMPTION-005 | PLANNED | 2C-A-R5,2C-O | exact ordinary-plan manifest | false | only two allowed tasks |
| SUP-2C-PREEMPTION-006 | PLANNED | 2C-A-R6,2C-P,2C-Q | Flowergirl death/settlement cross-link | false | source death precedes terminal settlement |
| SUP-2C-PREEMPTION-007 | PLANNED | 2C-A-R7,2C-R | stream/retry manifest | false | full replay and idempotency |

No `SUP-*` row may replace a primary, be shared as a primary, or be used by C,
C1, or B18. The ledger itself is design metadata and not a runtime registry.

For auditability, the A-R flow is also expanded one-to-one below. Each row is
an independent criterion; grouped rows above are summaries only.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| 2C-A | setup role set is exact | generator accepts exactly twelve IDs | setup witness/digest | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-001 |
| 2C-B | assignment is reproducible | seat and role binding digest matches expected binding | assignment witness | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-001 |
| 2C-C | first-night plan remains accepted | existing plan opens without historical mutation | accepted replay | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | PASS | SUP-2C-PREEMPTION-002 |
| 2C-D | Philosopher/Artist spent path is preserved | choice, spend, and source provenance settle once | existing ability evidence | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | PASS | SUP-2C-PREEMPTION-002 |
| 2C-E | Seamstress pair path is preserved | Mutant/Savant choice and spend settle once | existing ability evidence | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | PASS | SUP-2C-PREEMPTION-002 |
| 2C-F | dawn closes first night | no ordinary task is settled in first-night window | transition/replay audit | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | PASS | SUP-2C-PREEMPTION-002 |
| 2C-G | day opens nomination window | phase and day revision are exact | phase transition audit | R3 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-003 |
| 2C-H | nomination eligibility is enforced | one legal alive nomination is accepted | prospective command audit | R3 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-003 |
| 2C-I | vote provenance is complete | legal live/ghost vote records voter and nomination | vote event audit | R3 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-003 |
| 2C-J | tally is strict-highest | threshold, nonzero, strict-highest result is deterministic | tally plus tie negatives | R3 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-003 |
| 2C-K | daily execution is bounded | no second execution; execution remains separate from death | execution batch replay | R4 | T1 | HOSTILE_REPLAY_REJECTION | PASS | SUP-2C-PREEMPTION-004 |
| 2C-L | Pit-Hag preempts night tasks | exact choice resolves before `NIGHT_TASKS` | causal batch audit | R3 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-002 |
| 2C-M | death cause is explicit | Pit-Hag death has cause and is not daytime execution | death cross-link audit | R3 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-002 |
| 2C-N | transition follows preemption | only validated preemption permits `NIGHT_TASKS` | transition/reorder negatives | R4 | T1 | HOSTILE_REPLAY_REJECTION | PASS | SUP-2C-PREEMPTION-004 |
| 2C-O | ordinary plan is exact | exactly generic kill plus Flowergirl task | plan identity audit | R1 | T1 | STRUCTURAL_VALIDATION | PASS | SUP-2C-PREEMPTION-005 |
| 2C-P | Vortox target is fixed | generic kill targets Flowergirl before her task | target/death witness | R3 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | SUP-2C-PREEMPTION-006 |
| 2C-Q | dead source is ineligible | one Flowergirl `SOURCE_INELIGIBLE` terminal settlement | prospective/replay task audit | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | PASS | SUP-2C-PREEMPTION-006 |
| 2C-R | complete stream is replayable | A-R replay and retry are exact/idempotent | full stream/replay manifest | R4 | T1 | HOSTILE_REPLAY_REJECTION | PASS | SUP-2C-PREEMPTION-007 |

## Per-event contract and diagnostic identity

| Event/command | Prospective contract | Replay/idempotency contract | Deterministic rejection |
|---|---|---|---|
| `NominationProposed` | alive actor, day window, one active nomination, once-per-day actor/target limits | exact day, actor, target, command identity and revision | `NOMINATION_INELIGIBLE` / `NOMINATION_DUPLICATE` |
| `VoteCast` | alive voter or one unused ghost vote; active nomination; no consumed token | same voter/nomination/day and one command payload | `VOTE_GHOST_ALREADY_USED` / `VOTE_NO_ACTIVE_NOMINATION` |
| execution batch | tally >= half living, nonzero, strict highest; at most one daily execution | exact vote snapshot and batch order | `EXECUTION_THRESHOLD_FAILED` / `EXECUTION_TIE` / `EXECUTION_REORDERED` |
| `PitHagActionResolved` | exact source/target/choice and pre-`NIGHT_TASKS` window | exact causal predecessor and fixed victim branch | `PITHAG_BINDING_MISMATCH` / `PITHAG_TOO_LATE` |
| `PlayerDied` | accepted cause and living source state | death ID, cause, target seat, and predecessor must match | `DEATH_CAUSE_MISMATCH` / `DEATH_DUPLICATE` |
| ordinary task settlement | task is in exact plan and source state is current | one terminal settlement, exact task ID and predecessor | `TASK_UNKNOWN` / `TASK_DUPLICATE` |
| `FLOWERGIRL_ACTION` | only source role `flowergirl`; death link already accepted | terminal `SOURCE_INELIGIBLE` only; no result payload | `FLOWERGIRL_SOURCE_LIVE` / `FLOWERGIRL_DEATH_UNPROVEN` |

All diagnostics are product-contract identifiers. They are not new external
rule names.

## C1 additive seam

The accepted C1 structural history remains frozen: the historical descriptor
prefix and its 40 events / 59 branches are byte- and meaning-preserving. Any
new bounded event descriptors, if implementation proves they are necessary,
are appended at ordinals 41+ and branches 60+ through the already accepted
additive seam. The design expectation is:

```text
additions.deltaBindings=[]
newApprovedStructuralDeltaCount=0
defaultC1Authority=historical-40-events/59-branches
runtime2CAuthority=explicit-additive-path-only
```

No C1 historical file, event definition, semantic validator, or default
authority is changed by this design. A new approved structural delta would be a
fresh governance decision and a stop condition for this bounded reslice.

## Nomination, vote, replay, and provenance

The implementation contract must include only the narrow A-K behavior:

- canonical command and event IDs are deterministic and do not use time,
  randomness, locale sorting, or caller-supplied event IDs;
- commands carry actor, day, nomination, and expected revision provenance;
  events are emitted only after prospective validation;
- only alive players nominate; a player can nominate once per day and can be
  nominated once per day; dead players may be nominated but cannot nominate;
- live vote eligibility, one-use dead ghost vote, strict-highest threshold,
  tie failure, and daily execution cardinality are checked against the
  pre-event state;
- replay rechecks exact batch order, all cross-links, source snapshots, and
  state transitions rather than trusting stored outcomes;
- retrying the same canonical command is idempotent; a different payload under
  the same command identity is rejected.

These are repository simulation requirements layered over the externally
researched day/nomination/vote rules. They do not authorize UI, AI, database,
network, or general command-framework changes.

## Coverage and lifecycle

This reslice may add tests and evidence only for the bounded A-R path. Coverage
must remain `PARTIAL` for Flowergirl, Pit-Hag, and Vortox; no role becomes
`COMPLETE`. Existing role coverage and accepted historical inventories remain
unchanged. Any new fixture output, replay bundle, or review record is evidence
only and cannot become an ownership or publication authority.

Lifecycle classification:

| Asset | Classification | Boundary |
|---|---|---|
| Accepted production event/plan behavior | KEEP | Only after independent code/rule review and accepted integration. |
| Required design/rule/review records | ARCHIVE | Preserve provenance; they do not become runtime authority. |
| Fixture census output, temporary replay bundles, migration helpers | DELETE_AFTER_2C | Delete after evidence is materialized and independently reviewed. |
| Dreamer/Cerenovus placeholder fixture material | ARCHIVE/SUPERSEDED | Retain as historical evidence only; never select it at runtime. |

No permanent publication framework, role registry, dynamic selector, or
general coverage intelligence system is part of this slice.

## Stop-loss and gates

The design is bounded by two design corrections and three implementation
corrections. Any third design correction or fourth implementation correction
is `HUMAN_BLOCKED` and requires rescoping. The same result applies if the
fixture cannot be generated by production setup/assignment, if the A-R stream
needs an unapproved C1 structural delta, if Pit-Hag needs a general framework,
if a new workflow/dependency is proposed, or if Slice 3 behavior is pulled
forward.

Before implementation, the fresh independent reviewer must return the complete
`RULE_DESIGN_PASS`. Implementation remains unauthorized until that review is
available. After implementation, the required sequence is local focused
tests, typecheck, lint, replay/provenance checks, fresh code review, and the
other project gates as authorized by the controller. Hosted CI, push, PR, and
workflow changes are not authorized by this design.

## Required design review questions

1. Does the production generator witness exactly the stated twelve-role set?
2. Are Dreamer and Cerenovus absent from the active fixture and plan?
3. Is Pit-Hag execution/death causally complete before `NIGHT_TASKS` without a
   new generic framework?
4. Does Vortox kill Flowergirl before `FLOWERGIRL_ACTION` settles
   `SOURCE_INELIGIBLE`?
5. Are nomination, voting, execution/death, replay, provenance, and retry
   contracts prospective and exact?
6. Is the C1 additive path explicit while historical 40/59 authority remains
   frozen?
7. Are coverage and lifecycle claims accurate, with no incomplete role marked
   `COMPLETE`?
