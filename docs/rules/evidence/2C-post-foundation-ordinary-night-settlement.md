# Phase 3 Slice 2C Post-Foundation Ordinary-Night Settlement Evidence

## Evidence status

```text
sliceId=2C
evidenceKind=POST_FOUNDATION_FRESH_DESIGN_INPUT
authorization=USER_ADJUDICATED_2C_REPOSITORY_ORDINARY_NIGHT_SETTLEMENT_CONTRACT_V1_AND_AUTHORIZED_FRESH_2C_CONTINUATION
repositorySettlementContract=BOTC-SIM-ORDINARY-NIGHT-SETTLEMENT-CONTRACT-V1
repositorySettlementContractKind=REPOSITORY_SIMULATION_CONTRACT
externalRuleVerdict=RULE_READY
implementationAuthorized=false
```

This is an additive post-foundation evidence record. It does not rewrite the
historical `docs/rules/evidence/2C.md` record, does not add a BOTC rule
override, and does not authorize implementation.

## Authority boundary

External BOTC sources are authoritative for role ability, night window/order,
targets, outcomes, and execution/death semantics. Repository simulation
authority is authoritative for task-plan representation, progress, terminal
settlement, completion predicate, transition guard, replay, and idempotency.
The repository contract must not be presented as a claim made by the external
rule sources.

The approved repository contract is:

```text
ordinaryNightComplete iff
  a valid current ordinary-night plan exists
  and every blocking task has exactly one valid terminal settlement
  and no duplicate or unknown settlement exists
  and getNextUnsettledOrdinaryNightTask(plan, progress) === undefined
  and no triggered mandatory blocking opportunity remains unresolved
```

An unsupported blocking requirement is fail-closed: no fake settlement, no
no-op completion, and no phase transition.

## Reused rule evidence

The ordinary-night external rule evidence remains the accepted appendix in
`docs/rules/evidence/2C.md` and its approved source snapshot. The relevant
canonical source bindings are:

- Official BOTC Glossary oldid `2874`, SHA-256
  `75a4ce2fae80808172b90401f87041a2ab8a5101a8330b115739ddd9fc414fee`.
- Official BOTC States oldid `1039`, SHA-256
  `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`.
- Official Imp oldid `1741`, SHA-256
  `7fbe29d04b493ee749cef7585f0615ee97738e9a60250b6ffd3465d7ae2f9fab`.
- Pinned official nightsheet commit
  `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256
  `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

The accepted execution/death adjudication remains
`BOTC-SIM-EXECUTION-DEATH-SEPARATION-V1`: execution and death are independent
facts; execution does not imply death.

## Foundation inventory authority

The only ordinary-night inventory is
`SECTS_AND_VIOLETS_ORDINARY_NIGHT_INVENTORY` from
`packages/rules-snv/src/index.ts`. It contains 25 roles and records the pinned
nightsheet order, execution model, task kind, support status, and source
binding. No second inventory is created and no setup result is hand-edited.

## Deterministic fixture census

The census invokes the existing `SeededSectsAndVioletsSetupGenerator` without
changing its algorithm, constraints, or output. The generator currently
accepts only `playerCount=12`; unsupported counts are not treated as legal
fixtures.

```text
playerCountsChecked=[12]
seedRangePerPlayerCount={12:[0,99]}
successfulSetups=100
viableFixtureCount=0
ordinaryNightBlockingRule=
  present && executionModel=SCHEDULED_TASK && baselineSupportStatus=UNSUPPORTED
minimumUnsupportedBlockingTasksObserved=5
maximumUnsupportedBlockingTasksObserved=10
emptyNightBypassCount=0
fangGuOrWitchSkipped=0
```

Every successful setup selected at least five present scheduled tasks whose
inventory support status is `UNSUPPORTED`. The smallest observed blocking set
included five distinct task kinds (for example, seed
`2c-census-12-0`: `DREAMER_ACTION`, `FLOWERGIRL_ACTION`, `ORACLE_ACTION`,
`PHILOSOPHER_ACTION`, and `PIT_HAG_ACTION`). The census therefore finds no
fixture satisfying the approved bound of one newly implemented ordinary-night
capability. `EVENT_SUBSCRIPTION` and `CONTINUOUS_RULE` rows were not promoted
to blocking tasks, and no unsupported row was silently filtered.

## Census disposition

```text
fixtureCensusVerdict=NO_VIABLE_FIXTURE_WITHIN_ONE_CAPABILITY
stopCondition=UNABLE_TO_FIND_REAL_FIXTURE_REQUIRING_AT_MOST_ONE_NEW_CAPABILITY
candidateCapability=NOT_SELECTED
scopedCandidateRuleResearch=NOT_STARTED
B18Status=HUMAN_BLOCKED_UNCHANGED
Slice3ScopePulledForward=false
```

The result is a genuine bounded-scope stop, not a rule-source failure. A
continuation would require a new governance decision that changes the fixture
or capability budget; this task does not authorize that change.
