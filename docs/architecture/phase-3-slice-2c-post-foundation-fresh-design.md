# Phase 3 Slice 2C — Post-Foundation Fresh Bounded Design

## Status and gate

```text
sliceId=2C
designKind=POST_FOUNDATION_FRESH_2C_DESIGN
parentFoundationCloseout=4faaa859d7a0fb3bc5ffb78fbb3d4b16a5b13366
foundationSourceHead=2bdb60789a67f1ae846851fec88cc5f6240e3531
foundationFinalAccepted=true
priorDesignDisposition=HISTORICAL_BLOCKED_PRE_FOUNDATION_DESIGN
freshDesignCorrectionCount=0/2
implementationAuthorized=false
designReviewer=NOT_YET_REVIEWED
designVerdict=HUMAN_BLOCKED
```

This document starts a fresh post-foundation design. It does not amend the
historical pre-foundation design or create Design Correction Round 4. It is
design-only: no production, test, workflow, coverage, routing, dependency, or
C1 descriptor changes are part of this document.

## Approved authority split

`BOTC-SIM-ORDINARY-NIGHT-SETTLEMENT-CONTRACT-V1` is a repository simulation
contract, not a BOTC rule override. External rule evidence governs role
ability, nightsheet order, targets, outcomes, and the separation of execution
from death. Repository authority governs task-plan and progress representation,
terminal settlement, completion, phase guards, replay, and idempotency.

The single inventory authority is
`SECTS_AND_VIOLETS_ORDINARY_NIGHT_INVENTORY`, containing 25 canonical role
rows. There is no second inventory and no application copy of the role table.

## Intended bounded capability

The implementation target, if a viable fixture and independent design pass are
obtained, is one ordinary-night `SCHEDULED_TASK` capability only. The role is
not selected yet because the deterministic fixture census found no legal setup
with at most one unsupported blocking task. Fang Gu and Witch are explicitly
excluded; no role-specific rule research has started.

No generic workflow engine, universal scheduler, effect framework, dynamic
selector, broad storyteller automation, or Slice 3 behavior is proposed.

## Planned task contract

The eventual design uses the first-night pattern without reusing its frozen
first-night-specific type:

```text
OrdinaryNightTaskPlanV1 (immutable)
  nightNumber >= 2
  taskPlanVersion
  accepted inventory/source binding
  tasks ordered by nightsheetOtherNightOrder

OrdinaryNightTaskProgressV1 (separate)
  settlements[]
```

Each blocking task has a canonical task ID, task kind, order, source player /
seat / role snapshot, and `PENDING` status. A settlement binds the task ID,
task kind, night number, outcome, and required source/revision facts. The
completion predicate is valid only when every blocking task has exactly one
valid terminal settlement; duplicate and unknown settlements are rejected;
the next-unsettled query is `undefined`; and no triggered mandatory action
opportunity remains unresolved.

An unsupported blocking task fails closed with no fake settlement, no no-op
completion, and no phase transition.

## Planned phase-flow boundary

The complete intended happy path is:

```text
first-night plan/progress settlement
 -> FIRST_NIGHT_COMPLETED
 -> DAWN_RESOLUTION
 -> DAY_DISCUSSION
 -> nomination window
 -> one legal nomination and vote lifecycle
 -> execution resolution (death remains independent)
 -> NIGHT_TASKS
 -> ordinary-night plan
 -> one real supported settlement
 -> NIGHT_TASKS_COMPLETED
 -> DAWN_RESOLUTION
 -> next DAY_DISCUSSION
```

The existing phase policy remains authoritative. No direct first-night bypass,
naked transition, asynchronous progress repair, or new transition reason is
allowed. Execution and death are separate event facts under
`BOTC-SIM-EXECUTION-DEATH-SEPARATION-V1`.

## Fixture census gate

The bounded census is recorded in
`docs/rules/evidence/2C-post-foundation-ordinary-night-settlement.md`.
The current setup generator accepts only 12 players. For seeds
`2c-census-12-0` through `2c-census-12-99`, it produced 100 successful setups
and zero viable fixtures. Every setup had at least five present
`SCHEDULED_TASK` rows whose `baselineSupportStatus` is `UNSUPPORTED`.

The minimum is structural: the 12-player Sects & Violets composition requires
seven townsfolk and three minions, while the frozen inventory has only three
absent townsfolk rows and only one absent minion row. Consequently, even
before role-specific selection, more than one unsupported scheduled task is
required. The observed census confirms this for all 100 seeds.

```text
playerCountsChecked=[12]
seedRangesChecked={12:[0,99]}
successfulSetups=100
viableFixtureCount=0
blockingTaskKindsByFixture=at least 5 unsupported scheduled kinds per fixture
ordinaryNightCapabilityCountAdded=NOT_SELECTED
```

No setup algorithm, role output, required task, or unsupported row was edited
or filtered to obtain this result.

## Stop-loss disposition

```text
stopCondition=UNABLE_TO_FIND_REAL_FIXTURE_WITH_AT_MOST_ONE_NEW_CAPABILITY
designVerdict=HUMAN_BLOCKED
implementationAuthorized=false
scopedRuleResearch=NOT_STARTED
designCorrectionBudget=0/2
implementationCorrectionBudget=0/3
B18Status=HUMAN_BLOCKED_UNCHANGED
B18ConflictsTouched=none
Slice3ScopePulledForward=false
```

The blocker is fixture/capability feasibility, not missing external rule
authority. Continuing would require changing the approved one-capability
budget, changing the setup generator, or treating unsupported scheduled tasks
as non-blocking; all are outside this authorization. No implementation branch
commit is authorized by this design.

## File and behavior boundary for a future resumption

Only after a new governance decision supplies a viable bounded fixture may an
independent reviewer assess the eventual smallest subset of existing
phase/event/application files plus bounded tests. C, C1 historical
descriptors, A, B, the inventory, setup/assignment behavior, workflows,
coverage/routing, dependencies, and accepted history remain frozen. No role
may be promoted to `COMPLETE` by this slice.

## Required next gate

The fresh design is ready for independent review as a feasibility record. A
`RULE_DESIGN_PASS` cannot authorize implementation while `viableFixtureCount`
is zero. Required next action is human rescope or fixture/capability
adjudication; do not enter implementation or Slice 3.
