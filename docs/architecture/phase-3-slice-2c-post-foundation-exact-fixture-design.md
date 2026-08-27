# Phase 3 Slice 2C — Exact-Fixture Rescope Design

## Design identity and gate

```text
sliceId=2C
designKind=POST_FOUNDATION_EXACT_FIXTURE_2C_DESIGN
parentFoundationCloseout=4faaa859d7a0fb3bc5ffb78fbb3d4b16a5b13366
freshDesignCorrectionCount=0/2
implementationCorrectionBudget=0/3
implementationAuthorized=false
designVerdict=HUMAN_BLOCKED
stopCondition=NEW_C1_STRUCTURAL_DELTA_REQUIRED
```

This fresh design supersedes the historical one-capability and Fang-Gu/Witch
candidate text. It does not reopen Foundation, modify C/C1, or authorize
implementation.

## Exact production fixture

The existing twelve-player `SeededSectsAndVioletsSetupGenerator` accepts this
exact-role constraint through its production path:

```text
rootSeed=2c-exact-role-constraint-vortox
playerCount=12
exactRoleIds=[clockmaker,dreamer,savant,seamstress,philosopher,artist,sage,mutant,klutz,evil_twin,cerenovus,vortox]
generatorStatus=success
preModifierCounts=7/2/2/1
postModifierCounts=7/2/2/1
demon=vortox
```

No Mathematician, Fang Gu, Witch, or Pit-Hag is present. Assignment seed `0`
was checked within the bounded range `[0,99]` through the production assignment
path. Its deterministic seat map is `1=mutant, 2=seamstress, 3=evil_twin,
4=artist, 5=savant, 6=dreamer, 7=cerenovus, 8=klutz, 9=philosopher,
10=vortox, 11=sage, 12=clockmaker`. No manual state injection is permitted.

## Capability and role boundaries

The first-night path must genuinely settle Philosopher and Seamstress and
persist their spent state. The ordinary-night plan may therefore contain only
these actual blocking kinds:

```text
[DREAMER_ACTION,CERENOVUS_ACTION,GENERIC_DEMON_KILL]
ordinaryNightBlockingKindCount=3
```

Vortox is a continuous information constraint, not a scheduled task. Generic
Demon kill targets a living Mutant or Klutz and excludes Demon-specific
transfer, poisoning, or new information frameworks. Dreamer and Cerenovus
reuse their accepted targeting, information/madness, settlement, and replay
seams; no broad role framework is introduced.

## A–R flow contract

The intended bounded path is real production setup and assignment, complete
first-night plan/progress, first dawn, day discussion, one legal nomination,
deterministic voting, execution resolution, an independent death fact, day end,
`NIGHT_TASKS`, ordinary-night plan/progress and the three terminal settlements,
`NIGHT_TASKS_COMPLETED`, then the next dawn/day. The repository settlement
contract remains the authority for plan/progress/completion. Execution and
death are separate facts. Ghost-vote, tie-matrix, Slice 3, B18, and broad
Storyteller automation remain out of scope.

## C1 authority and stop

The accepted C1 authority is internally consistent at:

```text
actualAcceptedC1EventCountBefore2C=40
acceptedC1BranchCount=59
codeDomainEventPayloadCount=40
historicalC1DescriptorDelta=0
```

The accepted event map has no canonical nomination, vote, execution, death,
ordinary-plan, ordinary-target, or ordinary-settlement event families. The
A–R loop consequently needs a non-zero additive descriptor delta (at minimum
the seven day/death subjects and three ordinary-night subjects). Reusing
`PhaseTransitioned` would erase canonical replay facts and is forbidden.

```text
newStructuralDeltaRequired=true
newStructuralDeltaCount>=1
historicalC1DescriptorDelta=0
C1HistoricalPrefixMutation=false
```

Because this authorization explicitly says a required new C1 structural delta
is a true STOP, no implementation, tests, workflow, coverage, Hosted CI, push,
PR, or Slice 3 work starts. A new governance decision must authorize the
minimal additive C1 descriptor extension before implementation can proceed.

## Evidence and next action

Scoped evidence is recorded in
`docs/rules/evidence/2C-post-foundation-exact-fixture.md`, reusing accepted
Dreamer/Cerenovus/Vortox, nightsheet, and execution/death sources. This design
requires a fresh independent review; with the structural prerequisite still
forbidden, the operative verdict is `HUMAN_BLOCKED` and
`implementationAuthorized=false`.
