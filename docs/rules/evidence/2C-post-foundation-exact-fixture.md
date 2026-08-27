# Phase 3 Slice 2C Post-Foundation Exact Fixture Rule Evidence

## Gate and authority

```text
sliceId=2C
evidenceKind=POST_FOUNDATION_EXACT_FIXTURE_DESIGN_INPUT
authorization=USER_ADJUDICATED_2C_REPOSITORY_ORDINARY_NIGHT_SETTLEMENT_CONTRACT_V1_AND_AUTHORIZED_FRESH_2C_CONTINUATION
repositorySettlementContract=BOTC-SIM-ORDINARY-NIGHT-SETTLEMENT-CONTRACT-V1
repositorySettlementContractKind=REPOSITORY_SIMULATION_CONTRACT
externalRuleVerdict=RULE_READY
implementationAuthorized=false
```

The repository settlement contract is simulation architecture, not a BOTC rule
claim. External rule evidence remains responsible for role behavior, while
the repository contract owns plan/progress/settlement/completion/replay.

## Exact production fixture

The existing production setup generator was exercised with an exact role
constraint. No setup algorithm, role catalog, assignment, or test identity was
changed.

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

The deterministic primary path executes the Mathematician during the day
before the ordinary night. The ordinary-night living role requirements then
contain Dreamer and Cerenovus scheduled actions plus the Fang Gu ordinary-night
demon-kill capability. Fang Gu's selected target is a living townsfolk in the
fixture, so the transfer branch is not triggered. This is a bounded generic
demon-kill path, not a Fang Gu transfer implementation.

## Scoped external claims

The role claims are bound to the previously accepted official source evidence:

- Official Dreamer oldid `2904`, with the ordinary-night `each night` action
  wording recorded in the existing accepted role evidence.
- Official Cerenovus oldid `3048`, with the ordinary-night choice and madness
  effect recorded in the existing accepted role evidence.
- Official Fang Gu oldid `2974`, SHA-256
  `7fbe29d04b493ee749cef7585f0615ee97738e9a60250b6ffd3465d7ae2f9fab`.
- Official Glossary oldid `2874`, SHA-256
  `75a4ce2fae80808172b90401f87041a2ab8a5101a8330b115739ddd9fc414fee`.
- Pinned official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`,
  SHA-256
  `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

The approved source snapshot remains limited to the Fang Gu/Witch claim
boundary and is not a user rule override. No Fang Gu transfer, role promotion,
alignment transfer, Witch curse lifecycle, or cross-day effect framework is in
scope.

## Scoped capability set

```text
ordinaryNightCapabilityKinds=[DREAMER_ACTION,CERENOVUS_ACTION,GENERIC_DEMON_KILL]
ordinaryNightCapabilityCount=3
ordinaryNightBlockingTaskCount=3
ordinaryNightUnsupportedBlockingTaskKinds=[]
FangGuTransferTriggered=false
WitchPresent=false
```

The inventory remains the sole role-row authority. Scheduled actions are
ordered using `nightsheetOtherNightOrder`; the generic demon-kill action uses
the same ordinary-night boundary but does not infer a new role inventory row.
No unsupported task is filtered or converted to a no-op. If any additional
unsupported scheduled or action-opportunity requirement becomes live, planning
fails closed.

## Rule boundaries retained

- `BOTC-SIM-EXECUTION-DEATH-SEPARATION-V1` remains active: execution and death
  are independent facts.
- Official nightsheet remains canonical; the optional Chinese order alternative
  is not selected.
- B18 remains `HUMAN_BLOCKED_UNCHANGED`; no B18 conflict is touched.
- Slice 3 remains not started.

## Design authorization status

```text
scopedCandidateRuleResearch=READY_FOR_INDEPENDENT_REVIEW
freshDesignKind=POST_FOUNDATION_EXACT_FIXTURE_2C_DESIGN
freshDesignCorrectionCount=0/2
implementationAuthorized=false
ruleEvidenceMutation=additive_only
```

This record supplies the exact fixture and the three-capability scope for a
fresh independent design review. It does not authorize implementation before
that review returns `RULE_DESIGN_PASS`.
