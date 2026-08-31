# Phase 3 Slice 2C Governance / Canonical Identity Closure Reslice

## Design identity and authority status

```text
sliceId=2C
designId=2C_GOVERNANCE_CANONICAL_IDENTITY_CLOSURE
authorization=USER_AUTHORIZED_2C_GOVERNANCE_AND_CANONICAL_IDENTITY_CLOSURE_RESLICE_END_TO_END
parentDesignHead=7faae20ff2c23bc90705d9dece93cd72d98afcbf
parentDesignCorrectionCount=2/2
parentDesignDisposition=HISTORICAL_PREEMPTION_DESIGN_EXHAUSTED_PENDING_GOVERNANCE_IDENTITY_CLOSURE
governanceIdentityResliceDesignCorrectionCount=1/2
designStatus=INDEPENDENTLY_REVIEWED
designVerdict=RULE_DESIGN_PASS
implementationAuthorized=true
futureImplementationSHA=NOT_WRITTEN
```

This document is the active design for the separately authorized governance
identity reslice. It closes only the four historical design blockers
`DC2-F01` through `DC2-F04`. The preceding preemption design remains immutable
history; this document does not call itself Design Correction Round 3.

The accepted Foundation, coverage lifecycle, exact preemption fixture intent,
execution/death adjudication, ordinary-night settlement contract, accepted
C1 additive seam, and C1 structural-delta classification are not reopened.
`newApprovedStructuralDeltaCount=0` and `additions.deltaBindingsCount=0`.
`B18=HUMAN_BLOCKED_UNCHANGED`; `Slice3=NOT_STARTED`.

The design is not implementation evidence. No production, test, event
definition, semantic validator, workflow, routing, coverage, Hosted CI, push,
PR, or future implementation SHA is recorded here.

## Correction 2/3 boundary clarifications

The canonical `NominationDeclared` identity remains singular and unchanged.
Its command contract has two independent daily guards: `nominatorPlayerId` may
nominate at most once per day, and `nomineePlayerId` may be nominated at most
once per day. Both guards are evaluated against the accepted day history before
the command can append `NominationDeclared`; neither guard creates a second
event identity or changes the existing event payload identity. A retry of the
same accepted command is governed by the existing command idempotency contract,
not by a second nomination fact.

The authorized applicability correction for the bounded fixture is recorded in
`docs/rules/evidence/2C-closure-supersession.md`. It supersedes only the prior
preemption design's applicability for `PitHagActionResolved` and
`NominationProposed`; the historical evidence and design files remain
immutable. The active fixture uses daytime `Pit-Hag` execution,
`PlayerDied(cause=EXECUTION)` in the daytime execution context to suppress the Pit-Hag task before
`NIGHT_TASKS`, and the canonical `NominationDeclared` event. This is an
applicability closure, not a new rule, event, or proof layer.

## Repository census used by this design

The census was read from the isolated branch at `7faae20ff2c23bc90705d9dece93cd72d98afcbf`.
The relevant source blobs at that revision are:

| Authority | Path | Git blob SHA-1 |
| --- | --- | --- |
| Governance V1.1 | `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md` | `b01c0ca2af8ca78a8eb5c1207fda32283dee8a81` |
| C1 additive candidate source | `packages/domain-core/src/phase-3-slice-2c-structural-descriptors.ts` | `1a662c5da24beadd549af1132047ffd316d08380` |
| C1 accepted roots | `packages/domain-core/src/domain-event-structural-schema-ast.ts` | `af6f02a74e254da4ff4d9fad36ef3396391ef029` |
| command declarations | `packages/domain-core/src/command.ts` | `90d371bc22becaef4cc1147c2836dc56b67e633e` |
| command/event model | `docs/architecture/06-command-event-model.md` | read at the same HEAD |

The accepted C1 root declarations contain unique event ordinals `1..40` and
branch ordinals `1..59`. Repeated event ordinals inside the accepted roots are
version/shape branches of one event subject, not additional event ordinals.
The provisional source `TWO_C_ADDITIVE_DESCRIPTORS` contains exactly ten rows:
unique event ordinals `41..50`, unique branch ordinals `60..69`, and ten unique
canonical event subjects. These are provisional allocations, not accepted C1
history.

```text
acceptedC1EventCount=40
acceptedC1BranchCount=59
provisional2CEventCount=10
provisional2CBranchCount=10
acceptedC1EventOrdinalRange=1..40
acceptedC1BranchOrdinalRange=1..59
provisionalEventOrdinalRange=41..50
provisionalBranchOrdinalRange=60..69
historicalPrefixDelta=0
```

The candidate cursor is calculated rather than hard-coded:

```text
retainedProvisionalEventOrdinals=[41,42,43,44,45,46,47,48,49,50]
retainedProvisionalBranchOrdinals=[60,61,62,63,64,65,66,67,68,69]
nextAllocatedEventOrdinal=max(1..40,41..50)+1=51
nextAllocatedBranchOrdinal=max(1..59,60..69)+1=70
```

No new event is allocated in this design. `51/70` is an unused, calculated
cursor only. If implementation discovers that a new canonical fact requires
consuming that cursor, the current design no longer applies and the slice
stops for a fresh governance decision.

## Accepted and provisional identity boundary

The accepted prefix is byte- and meaning-preserving. Every accepted event
root, branch, node ID, field order, and source binding in `1..40 / 1..59`
remains unchanged. No provisional row may be described as
`ACCEPTED_C1_HISTORY`.

The actual provisional inventory and migration disposition are:

| Event subject | Event type | Status | Event ordinal | Branch ordinal | Descriptor source | Reason |
| --- | --- | --- | ---: | ---: | --- | --- |
| nomination declaration | `NominationDeclared` | `RETAINED_PROVISIONAL` | 41 | 60 | `TWO_C_ADDITIVE_DESCRIPTORS` | Existing accepted nomination fact; `NominationProposed` is not a parallel identity. |
| individual vote | `VoteCast` | `RETAINED_PROVISIONAL` | 42 | 61 | `TWO_C_ADDITIVE_DESCRIPTORS` | Individual voter action; not an aggregate vote result. |
| vote/block aggregate | `BlockStateUpdated` | `RETAINED_PROVISIONAL` | 43 | 62 | `TWO_C_ADDITIVE_DESCRIPTORS` | Derived tally fact; distinct from each `VoteCast`. |
| execution declaration | `ExecutionDeclared` | `RETAINED_PROVISIONAL` | 44 | 63 | `TWO_C_ADDITIVE_DESCRIPTORS` | Canonical declaration of the selected nominee. |
| generic death | `PlayerDied` | `RETAINED_PROVISIONAL` | 45 | 64 | `TWO_C_ADDITIVE_DESCRIPTORS` | One generic death subject; payload/provenance is repaired in the implementation contract below. |
| execution resolution | `ExecutionResolved` | `RETAINED_PROVISIONAL` | 46 | 65 | `TWO_C_ADDITIVE_DESCRIPTORS` | Execution result, including `DID_NOT_DIE`; never an implicit death. |
| no-execution close | `DayClosedWithoutExecution` | `RETAINED_PROVISIONAL` | 47 | 66 | `TWO_C_ADDITIVE_DESCRIPTORS` | Daily no-candidate fact, not an execution alias. |
| ordinary plan creation | `OrdinaryNightTaskPlanCreated` | `RETAINED_PROVISIONAL` | 48 | 67 | `TWO_C_ADDITIVE_DESCRIPTORS` | One exact ordinary-night plan. |
| ordinary target/action selection | `OrdinaryNightTargetDerived` | `RETAINED_PROVISIONAL` | 49 | 68 | `TWO_C_ADDITIVE_DESCRIPTORS` | The existing target-derived fact is the bounded generic Demon action/target fact when `taskType=GENERIC_DEMON_KILL`; no parallel `DemonKillResolved` subject is added. |
| ordinary task terminal settlement | `OrdinaryNightTaskSettled` | `RETAINED_PROVISIONAL` | 50 | 69 | `TWO_C_ADDITIVE_DESCRIPTORS` | `RESOLVED` or bounded `SOURCE_INELIGIBLE` terminal outcome. |
| Pit-Hag ability action | no event | `REMOVED_PROVISIONAL` | `NOT_ALLOCATED` | `NOT_ALLOCATED` | Prior design text only; absent from source inventory | The exact fixture kills Pit-Hag by daytime execution before `NIGHT_TASKS`; no `PIT_HAG_ACTION`, role-change event, or new framework is authorized. |
| `NominationProposed` | no event | `REMOVED_PROVISIONAL` | `NOT_ALLOCATED` | `NOT_ALLOCATED` | Prior design text only; absent from source inventory | `DeclareNomination` emits the sole canonical `NominationDeclared` fact. |

```text
provisionalEventCountBefore=10
provisionalBranchCountBefore=10
provisionalEventCountAfter=10
provisionalBranchCountAfter=10
eventsRemovedAsDuplicate=0 (two prior-text-only identities excluded before inventory)
eventsAddedAsNecessary=0
duplicateCanonicalSubjectCount=0
duplicateEventOrdinalCount=0
duplicateBranchOrdinalCount=0
```

The two `REMOVED_PROVISIONAL` rows are explicit prior-design dispositions,
not claims that those rows existed in the current source file. The final
candidate is therefore dense, zero-collision, and does not silently reorder a
semantically unchanged provisional subject. `NominationProposed` and
`DemonKillResolved` are disallowed parallel identities. The generic Demon
action is represented by the existing `OrdinaryNightTargetDerived` subject
and its `GENERIC_DEMON_KILL` task type; the following `PlayerDied` is the
separate death fact.

## Governance V1.1 authority path

The design loads the original Governance V1.1 definitions from the ADR at the
repository path above. No reachability or trust meaning is redefined here.

The exact reachability tokens are:

| Token | ADR meaning used without reinterpretation |
| --- | --- |
| `R1` | `CURRENTLY_REACHABLE_APPLICATION_PATH`: a real formal application command path is currently callable at the reviewed revision; success, rejection, failure, no-event, or rollback can all be R1. |
| `R2` | `LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`: the current producer no longer creates the history, but the repository promises valid accepted/imported history remains replayable. |
| `R3` | `HOSTILE_OR_CORRUPTED_HISTORY`: manual tampering, malformed/corrupted/impossible history, or broken provenance is rejected fail-closed. |
| `R4` | `FUTURE_HYPOTHETICAL_STATE`: no current producer, accepted event, or reachable command path creates the behavior. |

The exact trust tokens are:

| Token | ADR meaning used without reinterpretation |
| --- | --- |
| `T1` | `EXTERNAL_OR_PERSISTED_BOUNDARY`: command input, event envelopes, persisted/imported streams, public unknown-input APIs; exact shape, hostile-input rejection, provenance, and replay requirements apply where representable. |
| `T2` | `CANONICAL_DERIVED_STATE`: rebuilt state, event-applier pre-event state, and validated derived aggregates. |
| `T3` | `MODULE_PRIVATE_PURE_CORE`: branded internal contexts, pure resolvers, comparators, and policy functions. |

The only primary layers are the ADR's exact eight-token vocabulary:

```text
ACCEPTED_STREAM_INTEGRATION
APPLICATION_COMMAND_INTEGRATION
LEGACY_REPLAY_COMPATIBILITY
HOSTILE_REPLAY_REJECTION
STRUCTURAL_VALIDATION
PURE_POLICY_SEAM
PROJECTION
CROSS_PLATFORM_CI
```

The ADR's A–G algorithm is applied as written: successful producer/accepted
event/receipt/append/rebuild/projection is accepted-stream integration; a real
formal command rejection/failure/rollback is application-command integration;
tampered accepted history is hostile replay rejection; direct shape/ID/field
validation is structural validation; pure policy is pure-policy seam; viewer
output is projection; exact runner/platform execution is cross-platform CI.
No criterion below combines these mechanisms as one primary.

## Single-primary criterion contract

Each criterion has the nine ADR design-time fields. The three evidence columns
are an explicit non-primary split: they say which evidence may support the
criterion, while `ExpectedPrimaryLayer` alone is authoritative. A physical
test identity has one primary layer only. A criterion using an accepted
application path is not also an accepted-replay or hostile-replay criterion;
those are separate rows.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement | positiveOrNegative | acceptedApplicationEvidence | acceptedReplayEvidence | hostileReplayEvidence | acceptanceTestIdentity |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GI-C01 | The exact fixture can be accepted through the real producer. | Production setup/assignment and bounded A–R application path accept only the twelve authorized role IDs and append canonical events. | Successful producer, receipt, append, rebuild and state witness. | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | PASS | NONE | positive | primary | supporting only | fixture negatives supporting only |
| GI-C02 | The provisional structural candidate is exact and dense. | Ten retained rows have unique event/branch ordinals, exact payload descriptors, and no accepted-prefix delta. | Direct descriptor census and exact-shape validator. | R3 | T1 | STRUCTURAL_VALIDATION | PASS | NONE | negative | supporting only | supporting only | malformed/duplicate candidate is primary only here |
| GI-C03 | Valid accepted/imported history retains its meaning. | The same valid A–R history rebuilds the same canonical state with all death/task cross-links intact. | Full valid-history replay and state equality. | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | PASS | NONE | positive | supporting only | primary | hostile mutation is excluded |
| GI-C04 | Corrupted history is rejected. | Reordered, duplicated, forged-cause, missing-predecessor, and extra-field streams fail closed. | Hostile replay matrix with deterministic diagnostics. | R3 | T1 | HOSTILE_REPLAY_REJECTION | PASS | NONE | negative | no accepted application | no valid replay | primary |
| GI-C05 | The canonical nomination identity is singular. | `DeclareNomination` accepts one legal nomination and emits `NominationDeclared`; `NominationProposed` is never emitted or admitted. | Successful formal command, append and replay witness. | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | PASS | NONE | positive | primary | supporting only | duplicate/eligibility negatives supporting only |
| GI-C06 | Individual vote and aggregate block facts are distinct. | `CastVote` emits `VoteCast`; `CompleteVote` emits `BlockStateUpdated` plus its phase transition; no `VoteCompleted` alias is introduced. | Successful formal commands and canonical event batch. | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | PASS | NONE | positive | primary | supporting only | malformed vote inputs supporting only |
| GI-C07 | Execution and death are independent canonical facts. | `ExecutionResolved(deathOutcome=DID_NOT_DIE)` has no death mutation; a real death has a separate `PlayerDied` fact. | Successful resolution batch and explicit no-death result. | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | PASS | NONE | positive | primary | supporting only | execution-only tamper cases supporting only |
| GI-C08 | `PlayerDied` is the one generic death authority. | Execution and generic Demon-night causes bind to one complete PlayerDied contract, including seat, phase/night, cause reference, revision, applier and replay. | Successful canonical event creation and state mutation witness. | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | PASS | NONE | positive | primary | supporting only | forged cause/duplicate death supporting only |
| GI-C09 | The Pit-Hag preemption fixture is correctly scoped. | Pit-Hag is nominated and executed during the day; its `PlayerDied.cause=EXECUTION` precedes `NIGHT_TASKS`, and no Pit-Hag action task/event exists. | Successful exact-fixture application and plan witness. | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | PASS | NONE | positive | primary | supporting only | late Pit-Hag action rejection supporting only |
| GI-C10 | The ordinary plan shape is exact. | The direct structural contract admits exactly `GENERIC_DEMON_KILL` before `FLOWERGIRL_ACTION` and rejects Dreamer/Cerenovus placeholders. | Direct plan-shape validator and identity census. | R3 | T1 | STRUCTURAL_VALIDATION | PASS | NONE | negative | supporting only | supporting only | plan mutation/placeholder negatives are primary only here |
| GI-C11 | Ordinary generic Demon action is singular. | `OrdinaryNightTargetDerived` is the sole target/action fact for `GENERIC_DEMON_KILL` and precedes its death; no `DemonKillResolved` alias exists. | Successful task command, target derivation and append witness. | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | PASS | NONE | positive | primary | supporting only | duplicate/reordered action supporting only |
| GI-C12 | A dead Flowergirl source cannot act. | Vortox targets Flowergirl; `PlayerDied.cause=GENERIC_DEMON_KILL` precedes one `OrdinaryNightTaskSettled` with `SOURCE_INELIGIBLE`. | Successful task command and causal settlement witness. | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | PASS | NONE | positive | primary | supporting only | live-source/forged-death rejection supporting only |
| GI-C13 | The complete A–R history is validly replayable. | A valid accepted/imported A–R stream rebuilds exactly once with the same state and retained provenance. | Full valid replay and state-equality audit. | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | PASS | NONE | positive | supporting only | primary | hostile mutation is excluded |
| GI-C14 | Same-command retry is an application contract. | Retrying the same command envelope is a deterministic no-op/recovery and does not append a second canonical fact. | Real formal command retry, receipt and no-event/no-mutation result. | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | NONE | positive | primary | supporting only | duplicate retry mutation is supporting only |
| GI-C15 | Command identity cannot be reused with another payload. | Same `commandId` with changed payload or expected version is rejected without state mutation. | Real formal rejection path and deterministic diagnostic. | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | PASS | NONE | negative | primary | supporting only | forged persisted history is excluded |

Primary counts are `ACCEPTED_STREAM_INTEGRATION=8`,
`APPLICATION_COMMAND_INTEGRATION=2`, `LEGACY_REPLAY_COMPATIBILITY=2`,
`HOSTILE_REPLAY_REJECTION=1`, `STRUCTURAL_VALIDATION=2`, and
`mixedPrimaryCriterionCount=0`. The explicit reachability sets are:

```text
R1={GI-C01,GI-C05,GI-C06,GI-C07,GI-C08,GI-C09,GI-C11,GI-C12,GI-C14,GI-C15}
R2={GI-C03,GI-C13}
R3={GI-C02,GI-C04,GI-C10}
R4={}
```

No criterion is classified R4 merely because it is unsupported: this active
reslice contains no future hypothetical producer. No `SUP-*` record is
required; supporting evidence remains subordinate and cannot be a borrowed
primary.

## Canonical command-to-event identity map

The map below is taken from the actual command declarations and the existing
partial application batch builder. It is a design contract for the bounded
2C path; it does not invent aliases. `idempotencyKey` means the existing
command envelope `commandId` plus `gameId` and `expectedGameVersion`, not a new
identity mechanism.

| commandType | accepted phase | primaryEventType | additionalEventTypes | idempotencyKey | replay state mutation |
| --- | --- | --- | --- | --- | --- |
| `CompleteNight` | `FIRST_NIGHT` or `NIGHT_TASKS` after all tasks settle | `PhaseTransitioned` | none | command envelope identity | closes night to `DAWN_RESOLUTION`; exact completion predicate rechecked |
| `PublishDawn` | `DAWN_RESOLUTION` | `PhaseTransitioned` | none | command envelope identity | opens `DAY_DISCUSSION` |
| `OpenNominations` | `DAY_DISCUSSION` | `PhaseTransitioned` | none | command envelope identity | opens `NOMINATION_WINDOW` |
| `DeclareNomination` | `NOMINATION_WINDOW` | `NominationDeclared` | none | command envelope identity | appends one nomination; alive actor and once/day rules rechecked |
| `OpenVote` | `NOMINATION_WINDOW` | `PhaseTransitioned` | none | command envelope identity | opens `VOTING` |
| `CastVote` | `VOTING` | `VoteCast` | none | command envelope identity | appends one vote and consumes a dead player's one ghost-vote token at most once |
| `CompleteVote` | `VOTING` | `BlockStateUpdated` | `PhaseTransitioned` | command envelope identity | records strict-highest/threshold/tie result and returns to nomination window |
| `CloseNominations` | `NOMINATION_WINDOW` | `PhaseTransitioned` | none | command envelope identity | opens `EXECUTION_RESOLUTION` |
| `ResolveExecution` | `EXECUTION_RESOLUTION` | `ExecutionDeclared` or `DayClosedWithoutExecution` | `ExecutionResolved`, optional `PlayerDied`, then `PhaseTransitioned` | command envelope identity | records at most one execution; death is emitted only when outcome is `DIED`; opens `NIGHT_TASKS` |
| `BeginNight` | `NIGHT_TASKS` after day execution/death and first-night prerequisites | `OrdinaryNightTaskPlanCreated` | none | command envelope identity | stores exact two-task ordinary plan |
| `SettleOrdinaryNightTask` — generic Demon path | `NIGHT_TASKS` with an unsettled `GENERIC_DEMON_KILL` task | `OrdinaryNightTargetDerived` | `PlayerDied`, then `OrdinaryNightTaskSettled` | command envelope identity | derives Flowergirl target, records generic death, then settles the Demon task exactly once |
| `SettleOrdinaryNightTask` — Flowergirl source-ineligible path | `NIGHT_TASKS` with an unsettled `FLOWERGIRL_ACTION` task whose source is already dead | `OrdinaryNightTaskSettled` | none | command envelope identity | emits only the terminal `SOURCE_INELIGIBLE` settlement; no target-derived or information-result event is emitted |

The map deliberately does not contain `NominationProposed`, `VoteCompleted`,
`PlayerExecuted`, `ExecutionOccurred`, `DemonKillResolved`,
`FlowergirlSkipped`, `FlowergirlUnableToAct`, or any role-specific death
event. A command may produce multiple canonical events, but their order is
fixed by this table and the existing batch semantics.

The two `SettleOrdinaryNightTask` rows are distinct bounded paths of the same
actual command, not aliases. The generic Demon path has the exact chain
`OrdinaryNightTargetDerived -> PlayerDied -> OrdinaryNightTaskSettled`. The
Flowergirl path has only `OrdinaryNightTaskSettled` with
`settlement=SOURCE_INELIGIBLE`; it must not emit a target, vote-information,
or role-specific skipped event. The same command identity, task ID, and
expected game version still provide idempotency for both paths.

## `PlayerDied` complete canonical authority

`PlayerDied` is reused at provisional ordinal `45`, branch `64`; it is not
renamed or paired with `DeathOccurred`, `PitHagDied`, or
`FlowergirlDied`. Its final provisional descriptor is one exact record. The
implementation-time payload repair preserves the existing fields and adds
the minimum provenance needed to prove the canonical death. The descriptor
field/type contract is:

```text
{
  rulesBaselineVersion: nonEmptyString,
  deathId: nonEmptyString,                 // death-v1:<cause reference>
  executionId: nonEmptyString | null,      // execution-v1:<day>:01 or null
  playerId: canonicalPlayerId,
  deadSeatNumber: positiveSafeInteger,
  dayNumber: positiveSafeInteger,
  nightNumber: nonNegativeSafeInteger,
  phase: "EXECUTION_RESOLUTION" | "NIGHT_TASKS",
  cause: "EXECUTION" | "GENERIC_DEMON_KILL",
  causeEventId: canonicalEventId,
  causeEventType: "ExecutionResolved" | "OrdinaryNightTargetDerived",
  sourcePlayerId: canonicalPlayerId | null,
  sourceRoleId: "vortox" | null,
  characterStateRevision: nonNegativeSafeInteger
}
```

Canonical formats reuse repository-generated IDs: nomination
`nomination-v1:<dayNumber>:<ordinal>`, execution
`execution-v1:<dayNumber>:01`, ordinary task
`ordinary-night-v1:<TASK_TYPE>:night-02:seat-<two-digit-seat>`, and event IDs
from the existing `EventId` generator. A death ID is
`death-v1:<executionId>` for execution or
`death-v1:ordinary:<taskId>` for a generic Demon kill. The exact field names,
types, enumerable-key requirement, and node bindings belong to provisional
descriptor `45/64`; repairing them does not alter accepted C1 `1..40/1..59`
or any accepted historical node ID.

The conditional relations are part of the canonical contract:

| Cause | Required relations |
| --- | --- |
| `EXECUTION` | `executionId != null`; `causeEventType=ExecutionResolved`; `causeEventId` identifies the preceding resolution with the same execution/target; `sourcePlayerId=null`; `sourceRoleId=null`; `phase=EXECUTION_RESOLUTION`; `deathId=death-v1:<executionId>`. |
| `GENERIC_DEMON_KILL` | `executionId=null`; `causeEventType=OrdinaryNightTargetDerived`; `causeEventId` identifies the preceding target/action fact; `sourcePlayerId` and `sourceRoleId=vortox` match the plan; `phase=NIGHT_TASKS`; `deathId=death-v1:ordinary:<taskId>`. |

In both cases `deadSeatNumber` equals the roster seat for `playerId`, the
day/night numbers equal the current state, and `characterStateRevision`
equals the pre-death canonical revision. The target is alive before the event
and absent from the existing dead set. `PlayerDied` is the sole state
mutation that adds the death: the applier appends the payload to `deaths` and
the target to `deadPlayerIds`; the canonical alive predicate becomes false
from that set. It does not mutate role, alignment, task plan, or another
alive/dead field.

The required applier order is:

```text
capture exact T1 event
 -> validate descriptor and envelope
 -> validate cause predecessor and all cross-links
 -> validate target roster/seat, alive status, phase/night and revision
 -> reject duplicate or reordered death
 -> append deaths and deadPlayerIds exactly once
 -> replay subsequent state from that canonical dead set
```

The canonical authority chain is complete only when all layers below are wired
by implementation and review:

```text
DomainEventType
  -> PlayerDiedPayload
  -> provisional descriptor 45 / branch 64
  -> accepted additive authority path
  -> application batch creation
  -> prospective validation
  -> DomainEventBatch ordering/idempotency
  -> event applier
  -> GameState deaths/deadPlayerIds retention
  -> full-stream replay validation
  -> hostile replay rejection
  -> exact A-R E2E evidence
```

The two required cause paths are:

```text
day nomination of Pit-Hag
  -> ExecutionDeclared
  -> ExecutionResolved(deathOutcome=DIED)
  -> PlayerDied(cause=EXECUTION, causeEventType=ExecutionResolved)
  -> PhaseTransitioned(to=NIGHT_TASKS)

ordinary-night Vortox generic kill of Flowergirl
  -> OrdinaryNightTargetDerived(taskType=GENERIC_DEMON_KILL)
  -> PlayerDied(cause=GENERIC_DEMON_KILL,
               causeEventType=OrdinaryNightTargetDerived)
  -> OrdinaryNightTaskSettled
```

`ExecutionResolved` never mutates `alive=false` by itself. A
`DID_NOT_DIE` execution remains an execution fact without `PlayerDied`.
`PlayerDied` rejects a missing cause predecessor (`DEATH_MISSING_CAUSE`), a
forged or mismatched cause reference (`DEATH_FORGED_CAUSE_REFERENCE`), wrong
seat (`DEATH_WRONG_SEAT`), wrong phase/night (`DEATH_WRONG_PHASE`), stale
character-state revision (`DEATH_STALE_REVISION`), duplicate or second death
(`DEATH_DUPLICATE`), and reordered event (`DEATH_REORDERED`). These are
deterministic contract diagnostics. The event applier records the dead player
in the existing canonical `deaths/deadPlayerIds` state; ordinary planning
reads that state and therefore does not generate a Pit-Hag action after
Pit-Hag's daytime death.

## Exact preemption fixture boundary

The previously accepted preemption intent remains the exact twelve-player
Sects & Violets fixture:

```text
[clockmaker, flowergirl, savant, seamstress, philosopher, artist,
 sage, mutant, klutz, evil_twin, pit_hag, vortox]
```

The fixture remains `EXPECTED_ONLY` at design time. The production setup and
assignment witnesses, fixed seed, seat map, and digests are implementation
facts and must not be written as future facts here. The design requires:

1. production setup and assignment, not a hand-authored snapshot;
2. Pit-Hag nominated and executed by day before `NIGHT_TASKS`;
3. no `PIT_HAG_ACTION` task/event and no generic role-change framework;
4. the ordinary plan exactly `[GENERIC_DEMON_KILL, FLOWERGIRL_ACTION]`;
5. Vortox's target-derived fact and Flowergirl death before the Flowergirl
   task settlement;
6. one terminal `SOURCE_INELIGIBLE` settlement, with no fabricated
   information result;
7. no Dreamer/Cerenovus task, recurrence, placeholder, or fallback.

The plan is not a new scheduler. `OrdinaryNightTargetDerived` is the existing
canonical action/target fact for the generic Demon task; it must not be
duplicated by a same-meaning kill event. `SOURCE_INELIGIBLE` is a settlement
outcome, not a role-specific event.

For the Flowergirl branch, `SettleOrdinaryNightTask` has a deliberately
different canonical event shape. After the generic Demon path has appended
`PlayerDied` for the Flowergirl source, the command emits exactly one
`OrdinaryNightTaskSettled` event with:

```text
taskType=FLOWERGIRL_ACTION
sourcePlayerId=<flowergirl player>
sourceRoleId=flowergirl
sourceSeatNumber=<flowergirl seat>
targetPlayerId=null
settlement=SOURCE_INELIGIBLE
transferOutcome=NONE
causalDeathEventId=<PlayerDied event id>
```

There is no `OrdinaryNightTargetDerived`, information-result, or
role-specific skipped event on this branch. The settlement is accepted only
when the plan contains the exact source task, the causal `PlayerDied` is
already in the canonical stream, the source is dead in `deadPlayerIds`, and
the task has no prior terminal settlement. A live source, absent/forged death,
wrong seat or role, non-null fabricated target, duplicate, or reordered
settlement fails closed. The provisional settlement descriptor is repaired
within the existing row `50/69` to admit this bounded terminal outcome; no
new event subject or approved structural delta is created.

## C1 additive authority and candidate audit

The accepted `FULL_C1` authority remains the default authority and continues
to expose only its accepted `1..40 / 1..59` prefix. The explicit bounded 2C
runtime path may combine that prefix with the ten retained provisional
descriptors. It must not mutate the default authority, bypass structural
validation, or create a parallel validator.

```text
defaultAuthority=FULL_C1(40 events, 59 branches)
runtimeAuthority=FULL_C1 + explicit 2C provisional candidate
newApprovedStructuralDeltaCount=0
additions.deltaBindingsCount=0
historicalC1DescriptorDelta=0
eventOrdinalsDense=true
branchOrdinalsDense=true
duplicateEventOrdinalCount=0
duplicateBranchOrdinalCount=0
duplicateEventTypeCount=0
duplicateCanonicalSubjectCount=0
```

The provisional descriptor repair may update the task-type union to include
the already designed `FLOWERGIRL_ACTION`, and may expand the provisional
`PlayerDied` fields above. These changes stay inside the unaccepted additive
candidate. They are not an accepted C1 mutation and do not bind either
approved structural delta.

## A–R identity and evidence census

The existing A–R flow is retained, with identity ownership stated explicitly:

| A–R | Canonical subject(s) | Primary evidence |
| --- | --- | --- |
| A–B | setup/assignment facts already produced by accepted setup/assignment commands | `APPLICATION_COMMAND_INTEGRATION` |
| C–F | existing first-night plan/task settlement and phase transition facts | `LEGACY_REPLAY_COMPATIBILITY` for accepted historical behavior |
| G | `PhaseTransitioned` to day/nomination | `APPLICATION_COMMAND_INTEGRATION` |
| H | `NominationDeclared` only | `APPLICATION_COMMAND_INTEGRATION` |
| I | `VoteCast` only | `APPLICATION_COMMAND_INTEGRATION` |
| J | `BlockStateUpdated` only | `APPLICATION_COMMAND_INTEGRATION` |
| K | `ExecutionDeclared`, `ExecutionResolved`, optional `PlayerDied` | separate application criteria; no mixed primary |
| L–N | `PlayerDied(cause=EXECUTION)` then `PhaseTransitioned` | application plus hostile negative support; application is primary |
| O | `OrdinaryNightTaskPlanCreated` | `STRUCTURAL_VALIDATION` for exact shape; application remains separate for acceptance |
| P | `OrdinaryNightTargetDerived(taskType=GENERIC_DEMON_KILL)` then `PlayerDied` | `APPLICATION_COMMAND_INTEGRATION` |
| Q | `OrdinaryNightTaskSettled(settlement=SOURCE_INELIGIBLE)` | `APPLICATION_COMMAND_INTEGRATION` |
| R | existing events replayed and tamper-rejected | replay criterion and hostile-replay criterion are separate |

No A–R row creates a second event for a concept already represented above.
`ExecutionResolved` is resolution, not death; `VoteCast` is an individual
action, not block result; `OrdinaryNightTargetDerived` is target/action
selection, not the death; `OrdinaryNightTaskSettled` is terminal settlement,
not a second Flowergirl result.

## Scope, lifecycle, and stop-loss

The implementation cycle may salvage compatible code from the historical
partial head `9dad7eec293371190bbfb2a51d09ae5781240b83`, but that head remains
`PRE_RESLICE_PARTIAL_IMPLEMENTATION_NOT_ACCEPTED`. The new cycle starts with:

```text
postGovernanceIdentityResliceImplementationCorrectionCount=0/3
```

This is not an old Repair Round 3. The design correction budget is
`governanceIdentityResliceDesignCorrectionCount=1/2`; a third correction is a
true stop and requires rescope.

| Asset | Lifecycle | Authority boundary |
| --- | --- | --- |
| accepted production event/state behavior | `KEEP` | only after all reviews, CI and acceptance gates |
| active design and rule/governance evidence | `ARCHIVE` | immutable provenance, never runtime authority |
| accepted C1 prefix and necessary descriptor manifest | `KEEP` | historical prefix is immutable |
| temporary census, migration, replay outputs | `DELETE_AFTER_2C` | remove after evidence materialization |
| superseded Dreamer/Cerenovus fixture text | `ARCHIVE` | historical only, never a fallback |

No permanent registry, publication framework, dynamic selector, generic role
change system, or coverage-intelligence system is authorized.

The implementation must stop if any of the following is discovered: accepted
prefix mutation; a required structural delta; inability to construct a dense
candidate; inability to keep execution and death independent; a second
canonical identity that cannot be removed; a required Pit-Hag role-lifecycle
framework; a Dreamer/Cerenovus recurrence; Slice 3 scope; new dependency or
broad rewrite; or exhausted design/implementation correction budget.

## Design gate and completed review

Before implementation, a fresh independent reviewer must inspect this exact
document, the ADR, the descriptor source, the command source, the command/event
model, and the preceding preemption design. The reviewer must return all four
closure statuses and a complete final verdict:

```text
F01_C1_IDENTITY_COLLISION=CLOSED|OPEN
F02_GOVERNANCE_REACHABILITY=CLOSED|OPEN
F03_PLAYERDIED_AUTHORITY=CLOSED|OPEN
F04_COMMAND_EVENT_MAPPING=CLOSED|OPEN
designVerdict=RULE_DESIGN_PASS|RULE_DESIGN_FIX_REQUIRED|HUMAN_BLOCKED
```

`RULE_DESIGN_PASS` was recorded only after all four statuses were `CLOSED`, the
accepted prefix was unchanged, provisional rows were collision-free, the
nomination identity was singular, `PlayerDied` was fully bound, Pit-Hag's
daytime death suppressed later ability generation, and no new blocker existed.
The completed independent design review is bound as follows:

```text
reviewedDesignHead=202511719a4871e606bb71ed7dff884894f5021b
reviewedDesignSHA256=d8af60d895b171ed2c5550173f25a39f5927078fda2a8fc5b303edb6e7d73074
designReviewer=FRESH_INDEPENDENT_READ_ONLY_REVIEWER
designVerdict=RULE_DESIGN_PASS
```

Implementation actual bindings are recorded only in the implementation status
and coverage profile artifacts; this design does not pre-write an implementation
SHA. The following remain true at the design boundary:

```text
HostedCI=NOT_RUN
pushPerformed=false
PRCreated=false
rootUserWorktreeTouched=false
```

The design authorization is closed as `implementationAuthorized=true`; these
remaining fields record only that hosted publication and the root worktree are
still untouched at this point.

The design gate is closed. Subsequent implementation, local evidence, hosted
evidence, and final review remain separate gates and do not alter this design
record.
