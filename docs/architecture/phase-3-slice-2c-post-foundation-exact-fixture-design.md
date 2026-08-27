# Phase 3 Slice 2C — Exact-Fixture Rescope Design

## Design identity and gate

```text
sliceId=2C
designKind=POST_FOUNDATION_EXACT_FIXTURE_2C_DESIGN
parentFoundationCloseout=4faaa859d7a0fb3bc5ffb78fbb3d4b16a5b13366
fresh2CDesignCorrectionCount=2/2
implementationCorrectionBudget=0/3
implementationAuthorized=false
designReviewer=NOT_YET_REVIEWED
designVerdict=HUMAN_BLOCKED
```

This is the current design after the second bounded correction. Earlier
Fang Gu/Mathematician/Barber candidates are historical only and are not the
current fixture, scope, or authorization. This round is design-only: no
production, test, C/C1, workflow, coverage, or routing files are changed.

## Exact production fixture census

The existing production `SeededSectsAndVioletsSetupGenerator` accepts the exact
role constraint below. A targeted test invocation passed; the generator and
role catalog were not modified.

```text
scriptId=sects-and-violets
rootSeed=2c-exact-dreamer-cerenovus-vortox
playerCount=12
exactRoleIds=[clockmaker,dreamer,savant,seamstress,philosopher,artist,sage,mutant,klutz,evil_twin,cerenovus,vortox]
generatorStatus=success
actualRoleCount=12
preModifierCounts=7/2/2/1
postModifierCounts=7/2/2/1
demon=vortox
roleIdsUnique=true
forbiddenRoleIdsPresent=[]
```

The fixture contains no Fang Gu, Witch, Pit Hag, or Mathematician. The
first-night path must settle and persist `PHILOSOPHER_ACTION` and
`SEAMSTRESS_ACTION` as spent; Philosopher's legal deterministic choice is
`artist`, and Seamstress' pair is `mutant` plus `savant`. These are fixture
facts, not a claim that this round implements the behavior. The ordinary-night
blocking capability budget is exactly three:

```text
firstNightSpent=[PHILOSOPHER_ACTION,SEAMSTRESS_ACTION]
ordinaryNightBlockingCapabilityKinds=[DREAMER_ACTION,CERENOVUS_ACTION,GENERIC_DEMON_KILL]
ordinaryNightBlockingCapabilityCount=3
vortoxTreatment=CONTINUOUS_RULE_NOT_SCHEDULED_TASK
```

The generic Demon kill is only a bounded living-target phase-flow capability;
it does not add a role row, transfer, promotion, alignment change, or general
effect framework. If the implementation cannot prove the two spent facts, it
must fail closed rather than infer them.

## A–R bounded flow

The intended path uses existing setup/assignment and phase policy, then
settles first-night tasks, crosses dawn, records one legal nomination and vote,
records execution separately from any death, closes the day, and settles the
three ordinary-night capabilities before the next dawn/day. The repository
ordinary-night settlement contract owns plan/progress/terminal-settlement
completion. No direct phase bypass, fake settlement, ghost-vote framework,
Slice 3 behavior, or win-condition behavior is included.

## C1 classification correction

The accepted C1 authority and code agree:

```text
actualAcceptedC1EventCountBefore2C=40
acceptedC1BranchCount=59
codeDomainEventPayloadCount=40
historicalC1DescriptorDelta=0
historicalPrefixMutation=false
```

The accepted `createC1AdditiveStructuralSchemaCandidate` seam permits dense,
append-only descriptor candidates while preserving the frozen 40/59 prefix.
The prior `NEW_C1_STRUCTURAL_DELTA_REQUIRED` stop was a classification error:
the additions below are descriptor/branch/node candidates under that accepted
seam, not new approved structural-delta bindings.

```text
additions.deltaBindings=[]
newApprovedStructuralDeltaCount=0
C1DescriptorExtensionStatus=AUTHORIZED_BY_ACCEPTED_ADDITIVE_SEAM
C1StructuralDeltaStatus=NOT_REQUIRED
```

## Per-event A–R descriptor audit

Each subject is currently absent from the 40-event payload map, so its
descriptor, branch, and payload nodes are new candidates. Existing structural
node kinds and refinements are sufficient; no new node kind or approved delta
is proposed.

| eventSubject | eventType | payloadShape | requiredNodeKinds | requiresNewDescriptor/Branch/Node | requiresNewApprovedStructuralDelta | requiredDeltaId |
| --- | --- | --- | --- | --- | --- | --- |
| nomination declaration | `NominationDeclared` | exact record: nomination, nominator, nominee, day | `EXACT_RECORD`, existing ID refinements, `SAFE_INTEGER` | `true/true/true` | `false` | `NONE` |
| vote | `VoteCast` | exact record: nomination, voter, choice, day | `EXACT_RECORD`, existing ID refinements, `ENUM`, `SAFE_INTEGER` | `true/true/true` | `false` | `NONE` |
| block transition | `BlockStateUpdated` | exact record: entity, state, reason | `EXACT_RECORD`, `STRING`, `ENUM` | `true/true/true` | `false` | `NONE` |
| execution declaration | `ExecutionDeclared` | exact record: nomination, target, day, occurred | `EXACT_RECORD`, existing ID refinements, `SAFE_INTEGER`, `BOOLEAN` | `true/true/true` | `false` | `NONE` |
| death fact | `PlayerDied` | exact record: player, day, cause | `EXACT_RECORD`, existing ID refinements, `SAFE_INTEGER`, `ENUM` | `true/true/true` | `false` | `NONE` |
| execution resolution | `ExecutionResolved` | exact record: nomination, nullable target, day, occurred | `EXACT_RECORD`, `NULLABLE`, existing ID refinements, `SAFE_INTEGER`, `BOOLEAN` | `true/true/true` | `false` | `NONE` |
| no-execution day close | `DayClosedWithoutExecution` | exact record: day, reason literal | `EXACT_RECORD`, `SAFE_INTEGER`, `LITERAL` | `true/true/true` | `false` | `NONE` |
| ordinary-night plan | `OrdinaryNightTaskPlanCreated` | exact record: plan, night, task array | `EXACT_RECORD`, existing ID refinements, `SAFE_INTEGER`, `ARRAY`, `EXACT_RECORD` | `true/true/true` | `false` | `NONE` |
| ordinary-night target | `OrdinaryNightTargetDerived` | exact record: task, night, nullable target, target kind | `EXACT_RECORD`, existing ID refinements, `SAFE_INTEGER`, `NULLABLE`, `ENUM` | `true/true/true` | `false` | `NONE` |
| ordinary-night settlement | `OrdinaryNightTaskSettled` | exact record: task, capability, night, outcome | `EXACT_RECORD`, existing ID refinements, `ENUM`, `SAFE_INTEGER` | `true/true/true` | `false` | `NONE` |

The table distinguishes new domain-event/descriptor candidates from approved
structural deltas. `EXACT_RECORD`, `STRING`, `SAFE_INTEGER`, `BOOLEAN`,
`LITERAL`, `ENUM`, `ARRAY`, `NULLABLE`, existing unions, and existing ID
refinements are the complete proposed vocabulary.

## Rule and lifecycle boundary

The companion evidence record binds accepted Dreamer/Cerenovus/Vortox,
nightsheet, and execution/death sources. Official nightsheet order remains
canonical; the optional Chinese order is not selected. Historical source
evidence is not rewritten. B18 remains `HUMAN_BLOCKED_UNCHANGED`.

No permanent registry, scheduler, publication framework, or effect system is
introduced. Any future fixture artifact is temporary and must be archived or
deleted according to the current lifecycle policy.

## Verdict and required next action

```text
designVerdict=HUMAN_BLOCKED
implementationAuthorized=false
requiredNextAction=FRESH_INDEPENDENT_RULE_DESIGN_REVIEW
```

The former C1 stop is closed as a classification error: the accepted additive
seam can express the ten descriptor candidates with zero approved delta
bindings. This correction still does not authorize implementation. A fresh
independent reviewer must return `RULE_DESIGN_PASS` before any implementation
branch or production/test change is permitted.
