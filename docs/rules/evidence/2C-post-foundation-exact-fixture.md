# Phase 3 Slice 2C Exact-Fixture Rule Evidence

```text
sliceId=2C
evidenceKind=POST_FOUNDATION_EXACT_FIXTURE_DESIGN_INPUT
repositorySettlementContract=BOTC-SIM-ORDINARY-NIGHT-SETTLEMENT-CONTRACT-V1
externalRuleVerdict=RULE_READY
implementationAuthorized=false
```

## Production exact setup

The existing `SeededSectsAndVioletsSetupGenerator` accepts this exact-role
constraint on its unchanged production path:

```text
scriptId=sects-and-violets
rootSeed=2c-exact-role-constraint-vortox
playerCount=12
exactRoleIds=[clockmaker,dreamer,savant,seamstress,philosopher,artist,sage,mutant,klutz,evil_twin,cerenovus,vortox]
generatorStatus=success
actualRoleCount=12
preModifierCounts=7/2/2/1
postModifierCounts=7/2/2/1
demon=vortox
roleIdsUnique=true
```

This set contains no Mathematician, Fang Gu, Witch, or Pit-Hag. Assignment
must use the production assignment path; no manual state mutation is valid.

## Scoped rule claims

Accepted Dreamer and Cerenovus evidence supplies their recurring action,
target/choice, information or madness delivery, and terminal settlement
semantics. Accepted Vortox evidence supplies a continuous information
constraint only. The pinned official nightsheet remains canonical for ordinary
night ordering (commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256
`99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`). The
execution/death separation override remains active. No new rule framework or
source snapshot is introduced here.

## Capability boundary

Philosopher and Seamstress must be genuinely settled on first night and their
canonical spent state must suppress later blocking tasks. The only allowed
ordinary-night blocking kinds are:

```text
ordinaryNightBlockingKinds=[DREAMER_ACTION,CERENOVUS_ACTION,GENERIC_DEMON_KILL]
ordinaryNightBlockingKindCount=3
demonKillTarget=Mutant_or_Klutz_living_target
vortoxScheduledTask=false
```

No capability is omitted or auto-settled to meet the budget. Any additional
mandatory unsupported requirement fails closed.

## Rule/design gate

This evidence is additive and bounded to the exact fixture and the repository
settlement contract. B18 remains `HUMAN_BLOCKED_UNCHANGED`; Slice 3 is not
started. The A–R replayable flow is not implementable on the accepted C1
authority without new structural descriptors: its canonical 40-event map has
no nomination, vote, execution/death, ordinary-plan, target, or ordinary
settlement event families. Therefore:

```text
actualAcceptedC1EventCountBefore2C=40
acceptedC1BranchCount=59
historicalC1DescriptorDelta=0
newStructuralDeltaRequired=true
newStructuralDeltaCount>=1
freshDesignVerdict=HUMAN_BLOCKED
implementationAuthorized=false
```

This is the explicit STOP condition in the current authorization, not a
permission to modify C1.
