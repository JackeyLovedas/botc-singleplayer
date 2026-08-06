# Phase 3 Slice 2B20B-P2F1R-D1.5R SOURCE_HEAD_S status

## Control

```text
authorization=USER_AUTHORIZED_2B20B_P2F1R_D1_5R_HUMAN_COMPLEXITY_BUDGET_ADJUDICATION_AND_CONDITIONAL_SP_E_IMPLEMENTATION
implementationBase=59164cac35592c88e85dadbd74d41f23aa3a7047
implementationStage=SOURCE_HEAD_S
ruleVerdict=RULE_READY
finalDesignVerdict=RULE_DESIGN_PASS
remainingDesignBlockers=[]
coverageExecuted=false
profileChildPExists=false
evidenceCommitEExists=false
hostedCIExecuted=false
pushPerformed=false
PRCreated=false
D2Started=false
```

## Materialized source boundary

- `scripts/coverage-profile-registry.mjs` is the sole registry module. It is pure frozen data with schema `botc-coverage-profile-registry-v3`, four exports, 17 records, 15 ordered fields per record, 16 `HISTORICAL` records, one `LEGACY_SELECTED` record, and one exact selector mapping.
- `scripts/verify-coverage-obligations.mjs` imports the registry directly. The 17 legacy profile objects remain in-memory immutable artifact data and retain their order and values. The verifier has no verifier-source read, registry-source read, profile/registry marker search, sentinel, suffix/tail search, fixed source offset, source-span extraction, source-text hash authority, source-fragment renderer, compatibility parser, or inferred-profile success path.
- `scripts/run-vitest-logical-group.mjs` retains its existing CLI and topology. Its ordinary and coverage totals are `1712`; ordinary is `9 logical / 11 physical`; coverage is `11 logical / 12 physical`; Windows remains `1 logical / 3 physical / 46`; `domain-core-rest=503`.
- The routing-baseline manifest preserves immutable `ACCEPTED_1572_V1` history and records `CANDIDATE_1712_D1_V1` as `UNACCEPTED_CANDIDATE`, inventory `540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2`, exact delta `+140/-0`, `69` covered sources, and ordered routing counts.
- The workflow selector remains `phase-3-slice-2b20a-4d576e2-final-restoration-v1`. No workflow file or topology changed.

## Terminal mechanism census

```text
sourceParserSymbolCount=0
selfSourceReads=0
registrySourceReads=0
profileMarkerSearchCount=0
registryMarkerSearchCount=0
sentinelSearchCount=0
suffixSearchCount=0
tailSearchCount=0
fixedSourceOffsetCount=0
sourceSpanCount=0
sourceTextShaAuthorityCount=0
sourceFragmentRendererCount=0
compatibilityParserPathCount=0
fallbackPathCount=0
latestSelectorCount=0
dynamicSelectorCount=0
registryMutationApiCount=0
```

Historical profile strings containing the word `MARKER_PARTITION` are immutable data values, not searches or executable authority mechanisms.

## Complexity convergence

```text
permanentConceptsAdded=9
permanentConceptsRemoved=19
complexityNet=-10
permanentRegistryModulesAdded=1
permanentProfileArtifactsAddedAtS=0
permanentMigrationExecutablesAdded=0
newCLICommands=0
newWorkflowJobsOrMatrices=0
newTestFiles=0
newTestIdentities=0
```

The added concepts are the final design's metadata module, 15-field schema, lifecycle enum, selector map, closed artifact resolver, P JSON schema, canonical profile-body hash, registry/artifact cross-binding, and E hash-evidence schema. The removed concepts are the source-fragment/parser/marker/sentinel/suffix/tail/span/offset/close/downstream-symbol/compatibility/fallback/source-text-custody families enumerated by the final design. No equivalent abstraction repackages them.

## Gate record

Gate results are recorded only after their local commands complete. Coverage and Hosted CI are excluded from SOURCE_HEAD_S.

```text
focusedScriptAudits=PASS
historical1572=PASS_1572_IDENTITIES_INVENTORY_58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8
candidate1712=PASS_1712_IDENTITIES_INVENTORY_540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2
ownership=PASS_42_OF_42_AND_MIGRATION_PLUS_140_MINUS_0
ordinaryRouting=PASS_9_LOGICAL_11_PHYSICAL_1712
coverageRoutingStatic=PASS_11_LOGICAL_12_PHYSICAL_1712
windowsRoutingStatic=PASS_1_LOGICAL_3_PHYSICAL_46
manifestOrderDomain=PASS
traceability=PASS_9_ACTIVE_PRIMARY_ROWS
selectorUnchanged=PASS_PHASE_3_SLICE_2B20A_4D576E2_FINAL_RESTORATION_V1
typecheck=PASS
lint=PASS
fullOrdinary=PASS_40_FILES_1712_TESTS
complexityNetAudit=PASS_PLUS_9_MINUS_19_NET_MINUS_10
protectedTreeDiffs=PASS
worktreeClean=REQUIRED_AFTER_SOURCE_COMMIT
```

The existing legacy coverage-routing verifier was also invoked diagnostically. It failed closed before writing output because it intentionally binds the accepted 31-file ownership baseline, while D1's unaccepted candidate contains 36 files. That accepted-history contract is outside this S slice and was not modified. The authorized static routing audit instead used the existing Vitest list contract and passed with `11 logical / 12 physical / 1712`, no missing file, no unexpected file, and no overlap. Coverage itself was not executed.

## Frozen scope

Product code, existing Vitest files/titles/identities/assertions, A/B/C/C1, event definitions, semantic validators, replay/state/projection, rules, role coverage, historical profile bodies, workflow topology, dependencies, and D2 remain unchanged. No role coverage status changes and no incomplete role is promoted.
