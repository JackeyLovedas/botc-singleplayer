# Phase 3 Slice 2C — Post-Foundation Exact-Fixture Design

## Design identity and gate

```text
sliceId=2C
designKind=POST_FOUNDATION_EXACT_FIXTURE_2C_DESIGN
parentFoundationCloseout=4faaa859d7a0fb3bc5ffb78fbb3d4b16a5b13366
foundationSourceHead=2bdb60789a67f1ae846851fec88cc5f6240e3531
freshDesignCorrectionCount=0/2
implementationCorrectionBudget=0/3
implementationAuthorized=false
designReviewer=NOT_YET_REVIEWED
designVerdict=HUMAN_BLOCKED
```

This fresh design supersedes the earlier no-viable-fixture checkpoint only
within the newly authorized exact-fixture scope. It does not edit that
historical document, reopen Foundation, or authorize implementation before an
independent `RULE_DESIGN_PASS`.

## Repository and rule authority

`BOTC-SIM-ORDINARY-NIGHT-SETTLEMENT-CONTRACT-V1` is a repository simulation
contract. It defines task plans, separate progress, terminal settlements,
completion, phase guards, replay, and idempotency. External BOTC sources define
role abilities, nightsheet order, target/outcome semantics, and execution/death
separation. Neither authority is used to prove claims belonging to the other.

The only inventory authority is
`SECTS_AND_VIOLETS_ORDINARY_NIGHT_INVENTORY` (25 canonical rows). There is no
second role table and no setup-result substitution.

## Exact production fixture census

The existing `SeededSectsAndVioletsSetupGenerator` was invoked without source
or algorithm changes using:

```text
scriptId=sects-and-violets
playerCount=12
rootSeed=2c-exact-fang-gu-dreamer-cerenovus
exactRoleIds=[artist,barber,cerenovus,clockmaker,dreamer,evil_twin,fang_gu,mathematician,mutant,sage,savant,sweetheart]
generatorStatus=success
actualRoleCount=12
preModifierCounts=7/2/2/1
postModifierCounts=6/3/2/1
demon=fang_gu
roleIdsUnique=true
```

The legal exact fixture has three relevant ordinary-night capability kinds
after the daytime execution path kills the Mathematician before the ordinary
night:

```text
ordinaryNightBlockingCapabilityKinds=[DREAMER_ACTION,CERENOVUS_ACTION,GENERIC_DEMON_KILL]
ordinaryNightBlockingCapabilityCount=3
ordinaryNightPlanMustBeNonEmpty=true
FangGuTransferTriggered=false
WitchPresent=false
```

The Fang Gu target is a living townsfolk, so this fixture exercises only the
bounded generic demon-kill outcome and does not exercise transfer, alignment
change, or role promotion. The dead Mathematician is not silently skipped: the
current assignment and life state make its ordinary-night requirement
inapplicable in this fixture.

## Ordinary-night plan/progress design

The design introduces no generic scheduler. It follows the accepted first-night
shape with a separate ordinary-night type:

```text
OrdinaryNightTaskPlanV1 (immutable)
  nightNumber >= 2
  accepted inventory/source binding
  blocking tasks ordered by nightsheetOtherNightOrder

OrdinaryNightTaskProgressV1
  settlements[]
```

Every plan task binds task ID, capability kind, source player/seat/role
snapshot, and `PENDING`. Each terminal settlement binds task ID, capability
kind, night number, outcome, and source/revision facts. Completion is accepted
only when all blocking tasks have exactly one valid terminal settlement, no
duplicate or unknown settlement exists, the next-unsettled query is undefined,
and no triggered mandatory opportunity remains unresolved. Unsupported live
requirements fail closed with no fake settlement and no phase transition.

## Full bounded phase-flow contract

The intended primary path is:

```text
CreateGame
 -> SelectScript
 -> GenerateSetup(exact fixture)
 -> AssignCharacters
 -> InitializeFirstNight
 -> EstablishPrivateKnowledge
 -> PlanFirstNightTasks
 -> settle all first-night tasks
 -> FIRST_NIGHT_COMPLETED
 -> DAWN_RESOLUTION
 -> DAY_DISCUSSION
 -> open nominations
 -> one alive nomination
 -> one deterministic vote lifecycle
 -> close nomination
 -> resolve execution
 -> ExecutionOccurred
 -> independent DeathOccurred (when applicable)
 -> NIGHT_TASKS
 -> OrdinaryNightTaskPlan
 -> Dreamer/Cerenovus/generic demon-kill settlements
 -> NIGHT_TASKS_COMPLETED
 -> DAWN_RESOLUTION
 -> next DAY_DISCUSSION
```

The existing phase policy remains the sole transition authority. Execution and
death remain independent facts. No direct first-night bypass, test-only state
mutation, fake settlement, ghost-vote framework, or Slice 3 behavior is part of
this design.

## Scoped rule evidence

The exact fixture evidence is in
`docs/rules/evidence/2C-post-foundation-exact-fixture.md`. It binds the
previously accepted official Dreamer (`oldid=2904`), Cerenovus (`oldid=3048`),
Fang Gu (`oldid=2974`), Glossary (`oldid=2874`), States (`oldid=1039`), and
pinned nightsheet (`3d6d930a...`) records. The source scope is limited to the
three selected capabilities and the ordinary-night window; no Witch, Fang Gu
transfer, broad effect framework, or B18 conflict is selected.

## C1 boundary and hard blocker

The accepted C1 structural schema currently has:

```text
C1EventCountBefore=40
C1BranchCountBefore=59
historicalDescriptorDelta=0
```

`events.ts` and the accepted C1 descriptors currently contain no canonical
nomination, vote, execution, death, ordinary-night-plan, or ordinary-night
settlement event families. A real replayable implementation of the requested
full loop therefore needs additive event descriptors and their structural
bindings. It cannot truthfully use naked existing `PhaseTransitioned` events
for these facts.

Under the current writer instruction, a required new C1 structural delta is a
hard stop. No C1 descriptor or production file is changed here, and no
implementation is started.

```text
newStructuralDeltaRequired=true
newStructuralDeltaCount=UNRESOLVED_BUT_NONZERO_FOR_FULL_LOOP
C1HistoricalPrefixMutation=false
```

## Stop-loss disposition

```text
fixtureCensusPerformed=true
playerCountsChecked=[12]
seedRangesChecked={12:[0,99]}
viableExactFixtureCount=1
blockingTaskKindsByFixture=[DREAMER_ACTION,CERENOVUS_ACTION,GENERIC_DEMON_KILL]
designVerdict=HUMAN_BLOCKED
implementationAuthorized=false
B18Status=HUMAN_BLOCKED_UNCHANGED
Slice3ScopePulledForward=false
```

The exact fixture is now feasible under the newly authorized three-capability
scope, but the complete phase loop is blocked by the need for a new C1
structural delta. This document intentionally stops before implementation.
Continuation requires a new governance decision explicitly authorizing the
minimal additive C1 descriptor extension, while keeping historical C1 nodes
immutable. It must not be treated as permission to modify C1 in this round.

## Required next action

Obtain independent design review of this exact fixture and resolve the C1
additive-descriptor prerequisite. Until then: no production edits, no tests,
no workflow changes, no coverage or Hosted CI, no push/PR, and no Slice 3.
