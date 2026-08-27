# Phase 3 Slice 2C — Post-Foundation Exact Fixture Rule Evidence

## Evidence identity and authority

```text
sliceId=2C
evidenceKind=POST_FOUNDATION_EXACT_FIXTURE_DESIGN_INPUT
freshDesignKind=POST_FOUNDATION_EXACT_FIXTURE_2C_DESIGN
externalRuleVerdict=RULE_READY
implementationAuthorized=false
historicalCandidateStatus=SUPERSEDED
```

`BOTC-SIM-ORDINARY-NIGHT-SETTLEMENT-CONTRACT-V1` is a repository simulation
contract. It governs plan/progress/settlement/replay shape only. External BOTC
sources govern role timing and outcomes; neither layer substitutes for the
other.

## Exact production setup result

The existing production `SeededSectsAndVioletsSetupGenerator` was exercised by
the targeted setup-engine test with an exact role constraint. The test passed;
no setup algorithm, role catalog, assignment, test identity, or production
file was changed.

```text
verificationCommand=pnpm exec vitest run --workspace vitest.workspace.ts packages/setup-engine/src/setup-generator.test.ts -t "temporary verifies the post-foundation non-Fang-Gu exact 2C fixture" --reporter=verbose
verificationResult=PASS
verificationArtifact=temporary probe removed before documentation commit
```

```text
scriptId=sects-and-violets
playerCount=12
rootSeed=2c-exact-dreamer-cerenovus-vortox
exactRoleIds=[clockmaker,dreamer,savant,seamstress,philosopher,artist,sage,mutant,klutz,evil_twin,cerenovus,vortox]
generatorStatus=success
actualRoleCount=12
preModifierCounts=7/2/2/1
postModifierCounts=7/2/2/1
demon=vortox
roleIdsUnique=true
forbiddenRoleIdsPresent=[]
```

The current fixture therefore contains no Fang Gu, Witch, Pit Hag, or
Mathematician. The prior Fang Gu/Mathematician candidate is historical only
and is not evidence for the current design.

## Bounded capability evidence

The fixture records the Philosopher and Seamstress first-night tasks as spent
before the ordinary-night window. This is an explicit design precondition, not
a claim made by setup generation; an implementation must prove the spent facts
and fail closed if they are absent. Vortox is a continuous rule and is not a
scheduled task. The only ordinary-night blocking capability kinds are:

```text
firstNightSpent=[PHILOSOPHER_ACTION,SEAMSTRESS_ACTION]
ordinaryNightBlockingCapabilityKinds=[DREAMER_ACTION,CERENOVUS_ACTION,GENERIC_DEMON_KILL]
ordinaryNightBlockingCapabilityCount=3
continuousRule=[vortox]
unsupportedLiveBlockingKinds=[]
```

The generic demon-kill capability is a bounded living-target phase-flow fact,
not a new role row, transfer, promotion, alignment-change, Witch lifecycle, or
general effect framework. Dreamer and Cerenovus are the two role-action kinds;
no additional capability kind is admitted in this design.

## Source bindings

The role and phase claims reuse accepted, pinned evidence rather than inventing
new source authority:

- Official Dreamer revision `oldid=2904` and Cerenovus revision `oldid=3048`
  are recorded in `docs/rules/evidence/2C.md`.
- Official Vortox revision `oldid=3017`, SHA-256
  `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`, is
  recorded in `docs/rules/evidence/2B16.md`; Vortox remains a continuous rule.
- Official Glossary `oldid=2874` and States `oldid=1039` support the existing
  phase/death boundary and are recorded in the accepted 2C evidence.
- Pinned official nightsheet commit
  `3d6d930a9e600321f93b2567a2e88948a675bc1e` has SHA-256
  `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.
- `BOTC-SIM-EXECUTION-DEATH-SEPARATION-V1` remains the approved bounded
  simulator override: execution and death are distinct facts.

The optional Chinese night-order alternative is not selected; the official
nightsheet remains canonical. B18 remains `HUMAN_BLOCKED_UNCHANGED`.

## A–R canonical subject audit

The following subjects are absent from the accepted C1 event payload set. Each
would need one append-only descriptor candidate, but none requires an approved
structural-delta binding:

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

`EXACT_RECORD`, `STRING`, `SAFE_INTEGER`, `BOOLEAN`, `LITERAL`, `ENUM`,
`ARRAY`, `NULLABLE`, existing ID refinements, and existing unions are sufficient
for this descriptor design. No new node kind is proposed. The table is a
design audit, not an implementation or accepted-schema mutation.

## C1 classification correction

```text
acceptedC1EventCount=40
acceptedC1BranchCount=59
codeDomainEventPayloadCount=40
historicalC1DescriptorDelta=0
historicalPrefixMutation=false
additions.deltaBindings=[]
newApprovedStructuralDeltaCount=0
C1DescriptorExtensionStatus=AUTHORIZED_BY_ACCEPTED_ADDITIVE_SEAM
C1StructuralDeltaStatus=NOT_REQUIRED
```

The accepted `createC1AdditiveStructuralSchemaCandidate` seam permits dense
append-only descriptor candidates while preserving the frozen 40/59 prefix.
The earlier stop was a classification error: these ten descriptor candidates
are an additive-seam extension and do not bind either approved delta
(`B26_SEAMSTRESS_VARIADIC_DELTA` or `B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA`).
No approved structural delta is added in this design correction.

## Design correction gate

```text
fresh2CDesignCorrectionCount=2/2
designVerdict=HUMAN_BLOCKED
implementationAuthorized=false
requiredNextAction=FRESH_INDEPENDENT_RULE_DESIGN_REVIEW
```

The current design is ready for a fresh independent design review, but it is
not implementation authorization. The review must confirm the exact role set,
three-kind ordinary-night boundary, first-night-spent precondition, Vortox
continuous-rule treatment, per-event descriptor audit, and zero approved
structural-delta bindings. Until `RULE_DESIGN_PASS`, there are no production,
test, C1, workflow, coverage, Hosted CI, push, PR, or Slice 3 actions.
