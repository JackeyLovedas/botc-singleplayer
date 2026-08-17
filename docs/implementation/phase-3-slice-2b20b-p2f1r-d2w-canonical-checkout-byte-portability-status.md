# Phase 3 Slice 2B20B-P2F1R-D2W Canonical Checkout Byte Portability Status

## 1. Identity and authorization

```text
sliceId=2B20B-P2F1R-D2W
sliceName=Canonical Checkout Byte Portability Foundation
documentKind=STATIC_IMPLEMENTATION_STATUS
authorization=USER_AUTHORIZED_2B20B_P2F1R_D2W_EXCEPTIONAL_DOCS_ONLY_REACHABILITY_ENUMERATION_CLOSURE_AND_CONDITIONAL_LOCAL_IMPLEMENTATION
D2WStatus=STATIC_IMPLEMENTATION_DECLARED_PENDING_EXTERNAL_EXACT_HEAD_EVIDENCE
D2WFinalAccepted=false
```

This document is a pre-freeze static declaration. Post-freeze exact-head results and traceability bindings belong exclusively to the fresh independent external Code Review report and are not written back here.

## 2. Reviewed corrected design authority

```text
correctedDesignPath=docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-final-design-correction-1-v1.md
correctedDesignSha256=6634ed6b7d7929ec91247c7dcac7196f34b477bc59febd408177036b187f7ae9
correctedDesignReviewHead=7716eb6509658e26b3740a042e06f3c35e6530ee
correctedDesignReviewVerdict=RULE_DESIGN_PASS
remainingDesignBlockers=[]
D2W-DESIGN-001=CLOSED
D2W-DESIGN-002=CLOSED_BY_EXPLICIT_MANDATORY_REACHABILITY_CLASS_ENUMERATION
```

Exceptional correction disposition:

```text
exceptionalDocsCorrectionUsed=true
exceptionalDocsCorrectionKind=REACHABILITY_EMPTY_CLASS_ENUMERATION_ONLY
newDesignCorrectionRoundCreated=false
designCorrectionRound2Created=false
governanceResliceCreated=false
exceptionalDocsCorrectionUnexpectedNormativeChanges=0
```

## 3. Implementation base

```text
implementationBase=7716eb6509658e26b3740a042e06f3c35e6530ee
implementationBranch=phase-3/2b20b-p2f1r-d2w-canonical-checkout-byte-portability
implementationRepairRound=0/2
oldUnacceptedD2Head=0fc4288c9b0e22787eee3e2c87d7b0c54e432769
oldUnacceptedD2Disposition=HISTORICAL_UNACCEPTED_BLOCKED_BY_D2W
oldUnacceptedD2HeadIsImplementationAncestor=false
```

## 4. Exact implementation allowlist

```text
.gitattributes
docs/implementation/phase-3-slice-2b20b-p2f1r-d2w-canonical-checkout-byte-portability-status.md
```

```text
modifiedFilesMaximum=2
productionFilesMaximum=0
testFilesMaximum=0
verifierFilesMaximum=0
workflowFilesMaximum=0
thirdRepositoryEvidenceFileAuthorized=false
```

## 5. Frozen `.gitattributes` contract

The root policy is exactly:

```gitattributes
/docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5-routing-baseline-manifest.json text eol=lf
/docs/implementation/coverage-profiles/*.json text eol=lf
/docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json text eol=lf
```

```text
frozenDesignValue.gitattributesByteLength=248
frozenDesignValue.gitattributesLfCount=3
frozenDesignValue.gitattributesCrlfCount=0
frozenDesignValue.gitattributesBom=false
frozenDesignValue.gitattributesSha256=e04dab79f8142beae706f5fb37ac10fe3e2f08aeeeb719d0adbdeaade4bcbb09
frozenDesignValue.ruleCount=3
frozenDesignValue.broadRuleAllowed=false
frozenDesignValue.customFilterAllowed=false
```

## 6. Declared affected-path census

```text
declaredExistingTrackedMatchedPaths=2
declaredFutureMatchedPaths=1
declaredAffectedPathCount=3
declaredExistingProfilePatternMatchCount=1
declaredRenormalizedFileCount=0
```

The one existing profile-pattern match is expected to remain:

```text
docs/implementation/coverage-profiles/phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1.json
```

The future D2 bundle path is expected to remain absent during D2W.

## 7. Expected canonical Git blob contracts

Routing baseline manifest:

```text
expected.path=docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5-routing-baseline-manifest.json
expected.gitBlobOid=7d69d6800140324a46f9953b67e82a9e82a0973e
expected.gitBlobByteLength=3208
expected.gitBlobSha256=1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12
expected.gitBlobLfCount=118
expected.gitBlobCrlfCount=0
expected.resolvedTextAttribute=set
expected.resolvedEolAttribute=lf
```

Active standalone coverage profile:

```text
expected.path=docs/implementation/coverage-profiles/phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1.json
expected.gitBlobOid=a68aca2320745a269e9165e6f24313a750402d37
expected.gitBlobByteLength=3160
expected.gitBlobSha256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
expected.gitBlobLfCount=102
expected.gitBlobCrlfCount=0
expected.resolvedTextAttribute=set
expected.resolvedEolAttribute=lf
```

Future D2 bundle declaration:

```text
expected.path=docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json
expected.pathStatus=ABSENT_DURING_D2W
expected.resolvedTextAttribute=set
expected.resolvedEolAttribute=lf
expected.futureEncoding=UTF8
expected.futureEol=LF
```

## 8. Expected dual-checkout contracts

```text
expected.windowsCheckoutId=D2W-WINDOWS-AUTOCRLF-TRUE
expected.windowsCoreAutocrlf=true
expected.windowsExactHead=SAME_FROZEN_IMPLEMENTATION_HEAD
expected.windowsRoutingWorktreeEol=LF
expected.windowsRoutingWorktreeSha256=1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12
expected.windowsProfileWorktreeEol=LF
expected.windowsProfileWorktreeSha256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
expected.windowsRunnerSelfTestCount=40/40
expected.lfCheckoutId=D2W-LF-AUTOCRLF-FALSE
expected.lfCoreAutocrlf=false
expected.lfExactHead=SAME_FROZEN_IMPLEMENTATION_HEAD
expected.lfRoutingWorktreeEol=LF
expected.lfRoutingWorktreeSha256=1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12
expected.lfProfileWorktreeEol=LF
expected.lfProfileWorktreeSha256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
expected.lfRunnerSelfTestCount=40/40
```

These are expected design constants, not post-freeze results.

## 9. Expected D0 Catalog preservation

```text
expected.catalogPath=docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md
expected.catalogBlobOid=4f9a376e56f19b241d76ce2a75be83b70859ae25
expected.catalogBlobByteLength=264855
expected.catalogBlobSha256=e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6
expected.catalogBlobLfCount=626
expected.catalogTextAttribute=unspecified
expected.catalogEolAttribute=unspecified
expected.windowsCatalogByteLength=265481
expected.windowsCatalogSha256=7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7
expected.windowsCatalogEol=626_CRLF
expected.windowsCatalogClassification=LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY
expected.lfCatalogByteLength=264855
expected.lfCatalogSha256=e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6
expected.lfCatalogEol=626_LF
expected.lfCatalogClassification=MATCHES_REPOSITORY_BLOB
D0Compatibility=PRESERVED
```

## 10. Expected ownership, routing, profile, registry and selector invariants

```text
expected.acceptedVersion=ACCEPTED_1572_V1
expected.acceptedStructuredIdentities=1572
expected.acceptedPhysicalTestFiles=31
expected.acceptedInventorySha256=58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8
expected.acceptedCandidateByteLength=391257
expected.acceptedCandidateSha256=d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129
expected.candidateVersion=CANDIDATE_1712_D1_V1
expected.candidateStructuredIdentities=1712
expected.candidatePhysicalTestFiles=36
expected.candidateInventorySha256=540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2
expected.candidatePhysicalTestFileSetSha256=c8c0a52de9c52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0
expected.ordinarySemanticIdentities=1712
expected.coverageSemanticIdentities=1712
expected.ordinaryLogicalGroups=9
expected.ordinaryPhysicalGroups=11
expected.coverageLogicalGroups=11
expected.coveragePhysicalGroups=12
expected.windowsPhysicalGroups=3
expected.profileId=phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1
expected.profileSourceHead=8898f62ceb90433634cf02e83ad5d4ff95db4499
expected.CI_COVERAGE_PROFILE=phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1
expected.registryBlobOid=81de9cee0a7d9bb88652e9d4aa2ac2eb41eb3f65
expected.registryByteLength=11704
expected.registrySha256=890ef0a49ecdf810f7026f4353d2242732da108221bc54b9cf19aab70608acfc
```

## 11. Expected renormalization contract

```text
renormalizationRequired=false
expectedRenormalizedFileCount=0
expectedExistingArtifactContentDiffCount=0
repositoryWideRenormalizationAllowed=false
```

## 12. Governance Traceability V1.1 expected mapping

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `D2W-C01` | Repository policy is the sole portability authority for scoped canonical artifacts | Exact three rules; existing matches 2; future match 1; no forbidden match | Policy-blob audit, exact `git check-attr`, census | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | Exact contract and no broad rule | `NONE` |
| `D2W-C02` | Standard Windows checkout preserves canonical worktree bytes | `core.autocrlf=true` exact-H checkout yields canonical target bytes and passes unchanged gates | Fresh true checkout, raw-byte audit, runner self-test, ordinary | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `CROSS_PLATFORM_CI` | Routing/profile blob-worktree equality | `NONE` |
| `D2W-C03` | LF checkout preserves the same canonical bytes and behavior | `core.autocrlf=false` exact-H checkout yields the same target bytes and inventory | Fresh false checkout, raw-byte audit, runner self-test, ordinary | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `CROSS_PLATFORM_CI` | Same canonical SHA and inventory as C02 | `NONE` |
| `D2W-C04` | D0 Catalog authority and historical checkout classification remain unchanged | Catalog unmatched; blob frozen; true checkout CRLF-only; false checkout equals blob; D0 test succeeds | Attribute audit, raw classifier, existing D0 test | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | D0 contract preserved | `NONE` |
| `D2W-C05` | No protected authority or identity changes | Exact allowlist, frozen hashes/inventories, zero renormalization and ordinary gates | Diff, blob, ownership, routing, profile and ordinary audits | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | Only two allowlisted files differ | `NONE` |

Expected reachability census:

```text
R1=[]
R2=[]
R3=[]
R4=[D2W-C01,D2W-C02,D2W-C03,D2W-C04,D2W-C05]
criterionCount=5
duplicateReachabilityAssignments=0
missingReachabilityAssignments=0
```

This section contains expected fields only. The external Code Review report owns all evaluated traceability bindings.

## 13. External dynamic evidence ownership

```text
dynamicEvidenceAuthority=FRESH_INDEPENDENT_EXTERNAL_EXACT_HEAD_CODE_REVIEW_REPORT
repositoryDynamicEvidenceFile=NONE
dynamicEvidenceWriteBackAllowed=false
dynamicExactHeadEvidenceStatus=PENDING_EXTERNAL
actualBindingsStatus=PENDING_EXTERNAL
mechanismMatchStatus=PENDING_EXTERNAL_NOT_EVALUATED
codeReviewStatus=PENDING_EXTERNAL
ruleReviewStatus=PENDING_EXTERNAL
```

## 14. Expected post-freeze gate set

```text
expected.policyRawByteAudit=REQUIRED_EXTERNAL
expected.attributeResolutionAudit=REQUIRED_EXTERNAL
expected.affectedPathCensus=REQUIRED_EXTERNAL
expected.historicalBlobAudit=REQUIRED_EXTERNAL
expected.routingProfileRawByteEquality=REQUIRED_EXTERNAL
expected.runnerSelfTest=REQUIRED_EXTERNAL
expected.ownershipSelfTest=REQUIRED_EXTERNAL
expected.D0CatalogRegression=REQUIRED_EXTERNAL
expected.profileByteAudit=REQUIRED_EXTERNAL
expected.registrySelectorAudit=REQUIRED_EXTERNAL
expected.D2ProtectedManifestRegression=REQUIRED_EXTERNAL
expected.pathLimitedRenormalizationAudit=REQUIRED_EXTERNAL
expected.typecheck=REQUIRED_EXTERNAL
expected.lint=REQUIRED_EXTERNAL
expected.fullOrdinary=REQUIRED_EXTERNAL
expected.coverage=FORBIDDEN
expected.hostedCI=FORBIDDEN
```

No post-freeze gate result is recorded in this repository document.

## 15. Frozen impact declarations

```text
productionFilesChanged=0
testFilesChanged=0
testIdentityChanged=false
semanticTestInventoryChanged=false
profileChanged=false
registryChanged=false
selectorChanged=false
routingManifestContentChanged=false
ownershipChanged=false
workflowChanged=false
packageScriptChanged=false
dependencyChanged=false
eventDefinitionsChanged=false
semanticValidatorsChanged=false
roleCoverageMatrixChanged=false
catalogArtifactChanged=false
d15eEvidenceChanged=false
normalizationAllowed=false
globalGitConfigRequired=false
coverageExecuted=false
hostedCIExecuted=false
pushPerformed=false
PRCreated=false
D2Resumed=false
D3Started=false
```

## 16. Review-pending lifecycle

```text
D2WStatus=STATIC_IMPLEMENTATION_DECLARED_PENDING_EXTERNAL_EXACT_HEAD_EVIDENCE
D2WFinalAccepted=false
dynamicExactHeadEvidenceStatus=PENDING_EXTERNAL
actualBindingsStatus=PENDING_EXTERNAL
mechanismMatchStatus=PENDING_EXTERNAL_NOT_EVALUATED
codeReviewStatus=PENDING_EXTERNAL
ruleReviewStatus=PENDING_EXTERNAL
postGateTrackedWriteAllowed=false
evidenceInheritanceAcrossHeadsAllowed=false
requiredNextAction=FREEZE_IMPLEMENTATION_HEAD_AND_RUN_EXTERNAL_EXACT_HEAD_GATES
```

The tracked status remains static after the implementation commit. Any tracked edit after the gate epoch begins invalidates both checkout result sets and requires a new candidate HEAD under the frozen repair budget.
