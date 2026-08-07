# Phase 3 Slice 2B20B-P2F1R-D2W Canonical Checkout Byte Portability Final Design Correction 1 V1

## 1. Corrected design identity

```text
sliceId=2B20B-P2F1R-D2W
sliceName=Canonical Checkout Byte Portability Foundation
documentKind=COMPLETE_CORRECTED_FINAL_IMPLEMENTATION_DESIGN
AuthorityStatus=CURRENT_AND_COMPLETE_D2W_CORRECTED_DESIGN_AUTHORITY
authorization=USER_AUTHORIZED_2B20B_P2F1R_D2W_CANONICAL_CHECKOUT_BYTE_PORTABILITY_FOUNDATION_AND_CONDITIONAL_LOCAL_CLOSURE
correctionBaseHead=ae9e3011f8b3621a48cd6e8178732080453b3f1c
DesignCorrection=1/1_CONSUMED
additionalDesignCorrectionAuthorized=false
implementationRepairRound=0/2
implementationAuthorized=false
designVerdict=PENDING_FRESH_INDEPENDENT_CORRECTED_DESIGN_REVIEW
remainingDesignBlockers=[PENDING_FRESH_INDEPENDENT_CORRECTED_DESIGN_REVIEW]
```

Corrected design path:

```text
docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-final-design-correction-1-v1.md
```

Materialized SHA field:

```text
correctedDesignSHA256=<TO_BE_COMPUTED_FROM_EXACT_MATERIALIZED_UTF8_BYTES_BY_SOLE_WRITER>
```

This document is a complete, self-contained replacement implementation authority. It is not a patch to the parent design. It becomes operative only if a fresh independent reviewer returns `RULE_DESIGN_PASS` with `remainingDesignBlockers=[]`.

This document does not issue that verdict and does not authorize implementation by itself.

## 2. Parent design and review authority

### 2.1 Parent design

```text
parentDesignPath=docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-final-design-v1.md
parentDesignHead=ae9e3011f8b3621a48cd6e8178732080453b3f1c
parentDesignBlob=353a148a6d71596c37dce7845d29fd565e329205
parentDesignSha256=3058e9efb9c682036bbab2400fd5e33d2d5cbc18239926cdd64dfb7bc282c65d
parentDesignDisposition=SUPERSEDED_FOR_IMPLEMENTATION_BY_THIS_COMPLETE_CORRECTION_AFTER_REVIEW
```

### 2.2 Independent review result

```text
reviewedHead=ae9e3011f8b3621a48cd6e8178732080453b3f1c
reviewTimestamp=2026-08-07T15:38:00.0848245+08:00
designVerdict=RULE_DESIGN_FIX_REQUIRED
findingId=D2W-DESIGN-001
classification=BLOCKER
affectedReachability=R4_FUTURE_HYPOTHETICAL_STATE
affectedTrust=T1_EXTERNAL_OR_PERSISTED_BOUNDARY
implementationAuthorized=false
```

The finding is exact-head provenance and evidence-lifecycle conflict:

- the parent design required the tracked status document to contain observed dual-checkout results and V1.1 actual bindings;
- it also required that status document to be committed before candidate HEAD freeze;
- recording results after running gates necessarily created a new HEAD;
- the results from the old HEAD could not authorize the new HEAD;
- repeating the process caused an unbounded status-edit/new-HEAD loop.

Correction disposition:

```text
D2W-DESIGN-001=CORRECTED_PROSPECTIVELY_PENDING_FRESH_INDEPENDENT_CONFIRMATION
```

This correction changes only ownership and sequencing of static repository facts versus post-freeze dynamic exact-head evidence. It does not change the selected EOL authority, attributes, path census, D0 contract, implementation allowlist, product boundary or test boundary.

## 3. Rule, governance and D2 prerequisites

### 3.1 Rule evidence

```text
ruleEvidencePath=docs/rules/evidence/2B20B-P2F1R-D2W.md
ruleEvidenceSha256=f26ee4656c3431536a6a67dfcdf0e420e26bffaacca9b0994b738b26626e0d2b
ruleVerdict=RULE_READY
involvedRoles=[]
requiredRuleChange=false
productBehaviorChanged=false
ruleSemanticsChanged=false
eventSchemaChanged=false
ruleCoverageStatus=SKELETON
```

D2W remains a no-role engineering portability foundation. It changes no BOTC ability, night order, interaction, impairment, Storyteller discretion, event, replay meaning, projection, product behavior or role coverage.

### 3.2 Governance authority

```text
governancePath=docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-governance-v1.md
governanceSha256=a269ee8d6e03c1194887e9e4bae248bef7aba69a34e6c2c50ad18effeda753d2
governanceVerdict=GO
governanceRemainingBlockers=[]
selectedSolution=A_MINIMAL_REPOSITORY_GITATTRIBUTES_EOL_CONTRACT
```

### 3.3 D2 relationship

```text
currentD2DesignHead=075000fc181ee50a110157f4ce62f89972323c77
currentD2DesignVerdict=RULE_DESIGN_PASS
oldUnacceptedD2Head=0fc4288c9b0e22787eee3e2c87d7b0c54e432769
oldUnacceptedD2Disposition=HISTORICAL_UNACCEPTED_BLOCKED_BY_D2W
```

Old H remains historical and unaccepted. It is not an implementation base and supplies no inherited gate or review result.

## 4. Objective

Introduce exactly one permanent repository concept:

```text
CANONICAL_EOL_CONTRACT
```

The contract must make two existing worktree-canonical artifacts and one future exact D2 bundle path checkout as LF on Windows and Linux, independent of `core.autocrlf`, while preserving:

- their existing Git blobs;
- existing verifier behavior;
- D0 Catalog blob authority and Windows CRLF diagnostic classification;
- product and event behavior;
- test identities and ordinary inventory;
- ownership and routing;
- coverage profile, registry and selector;
- workflow and dependencies;
- current D2 design;
- the two-file implementation limit.

The corrected evidence lifecycle must converge:

```text
static status finalized
  -> commit and freeze exact H
  -> no tracked edits
  -> run both checkout gates at H
  -> external fresh Code Review owns dynamic evidence and Actual bindings
  -> external Rule Review reviews the same H
```

## 5. Scope

D2W implementation is limited to:

1. adding the exact root `.gitattributes`;
2. adding one static D2W implementation/status document;
3. committing both and freezing one exact implementation HEAD `H`;
4. running two independent clean checkouts from `H`;
5. keeping all dynamic results outside the repository;
6. obtaining fresh independent Code and Rule reviews of `H`;
7. recording conditional local closure externally without another tracked edit.

## 6. Non-goals

D2W does not authorize:

- D2 Hosted CI;
- D2 capture, acquisition or evidence bundle generation;
- D-C16A or D-C16B closure;
- reuse or acceptance of old H;
- D3;
- production code;
- test files, titles or semantic identities;
- A, B, C or C1 changes;
- event definitions or semantic validators;
- ownership, routing, coverage, profile, registry or selector changes;
- workflow, job, matrix, checkout action or runner changes;
- package script or dependency changes;
- `.editorconfig`;
- broad repository LF rules;
- global or user Git configuration;
- checkout mutation or local normalization;
- a third implementation file;
- a repository file for post-freeze gate results;
- writing reviewer evidence back to the reviewed HEAD;
- push, PR, merge, tag or acceptance.

## 7. Frozen byte authority

```text
canonicalCheckoutAuthority=REPOSITORY_DECLARED_PATH_SCOPED_GIT_ATTRIBUTES
canonicalStoredBytes=GIT_BLOB_UTF8_LF
canonicalWorktreeProjection=EXACT_GIT_BLOB_BYTES
localNormalizationAllowed=false
verifierNormalizationAllowed=false
workflowNormalizationAllowed=false
globalGitConfigRequired=false
```

The root `.gitattributes` is the sole checkout-portability authority for the scoped artifact class.

Git blobs store canonical LF bytes. For scoped artifacts, worktree bytes must equal those blobs. The worktree is a constrained projection, not an independent authority.

Rejected alternatives remain:

```text
B_GIT_BLOB_AS_RUNTIME_AUTHORITY_FOR_SCOPED_WORKTREE_ARTIFACTS
C_LOCAL_OR_CI_CANONICALIZATION
```

No verifier may switch to Git-object reads and no consumer may normalize CRLF.

## 8. Exact `.gitattributes` contract

The new root `.gitattributes` blob must contain exactly:

```gitattributes
/docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5-routing-baseline-manifest.json text eol=lf
/docs/implementation/coverage-profiles/*.json text eol=lf
/docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json text eol=lf
```

Frozen policy bytes:

```text
gitattributesByteLength=248
gitattributesLfCount=3
gitattributesCrlfCount=0
gitattributesBom=false
gitattributesSha256=e04dab79f8142beae706f5fb37ac10fe3e2f08aeeeb719d0adbdeaade4bcbb09
```

There must be:

- exactly three lines;
- the displayed order;
- LF after every line, including the final line;
- no BOM;
- no blank line or comment;
- no fourth rule;
- no broad wildcard;
- no custom filter or working-tree encoding attribute.

## 9. Exact affected paths and census

| Declaration | Base status | Match count | Contract |
|---|---|---:|---|
| `/docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5-routing-baseline-manifest.json` | Existing tracked | 1 | `text eol=lf` |
| `/docs/implementation/coverage-profiles/*.json` | Existing narrow pattern | 1 | `text eol=lf` |
| `/docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json` | Future exact path, absent | 0 | `text eol=lf` |

```text
existingTrackedMatchedPaths=2
futureDeclaredMatchedPaths=1
affectedPathCount=3
renormalizedFileCount=0
```

The single existing profile match is:

```text
docs/implementation/coverage-profiles/phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1.json
```

A changed census is a stop condition.

## 10. Canonical artifact contracts

### 10.1 Routing baseline manifest

```text
path=docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5-routing-baseline-manifest.json
gitBlobOid=7d69d6800140324a46f9953b67e82a9e82a0973e
canonicalByteLength=3208
canonicalSha256=1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12
canonicalLfCount=118
canonicalCrlfCount=0
expectedAttributeText=set
expectedAttributeEol=lf
```

`run-vitest-logical-group.mjs::verifyD15Baseline` remains unchanged and continues to read worktree bytes and use raw `Buffer.equals`.

### 10.2 Active coverage profile

```text
path=docs/implementation/coverage-profiles/phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1.json
gitBlobOid=a68aca2320745a269e9165e6f24313a750402d37
canonicalByteLength=3160
canonicalSha256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
canonicalLfCount=102
canonicalCrlfCount=0
expectedAttributeText=set
expectedAttributeEol=lf
profileId=phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1
profileSourceHead=8898f62ceb90433634cf02e83ad5d4ff95db4499
```

`verify-coverage-obligations.mjs::validateProfileArtifactBytes` remains unchanged.

### 10.3 Future D2 bundle

```text
path=docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json
designBaseStatus=ABSENT
expectedAttributeText=set
expectedAttributeEol=lf
futureEncoding=UTF8
futureEol=LF
```

D2W does not create this file or a future SHA.

## 11. Git blob and worktree contract

For both existing targets:

- index blob OIDs remain frozen;
- blob byte lengths and SHA-256 remain frozen;
- no target content diff is allowed;
- both exact-head checkouts must resolve `text=set`, `eol=lf`;
- both exact-head worktrees must equal their Git blobs byte-for-byte;
- no custom clean or smudge filter is allowed.

Each external checkout-evidence record must contain:

```text
path
gitBlobOid
gitBlobByteLength
gitBlobSha256
gitBlobLfCount
gitBlobCrlfCount
worktreeByteLength
worktreeSha256
worktreeLfCount
worktreeCrlfCount
resolvedTextAttribute
resolvedEolAttribute
blobEqualsWorktree
exactHead
```

Required dynamic result:

```text
blobEqualsWorktree=true
exactHead=reviewedHead
```

These are post-freeze facts and must not be written into the tracked status document.

## 12. Windows checkout contract

Normative checkout:

```text
checkoutId=D2W-WINDOWS-AUTOCRLF-TRUE
core.autocrlf=true
exactHead=H
```

It must be a fresh isolated checkout. Configuration may be written only inside the disposable checkout before checkout of `H`.

Expected contract:

```text
routingExpectedWorktreeEol=LF
routingExpectedWorktreeSha256=1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12
profileExpectedWorktreeEol=LF
profileExpectedWorktreeSha256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
runnerExpectedSelfTestCount=40/40
```

These values are design expectations. Whether `H` satisfies them is dynamic evidence owned by the external Code Review report.

## 13. LF checkout contract

Normative checkout:

```text
checkoutId=D2W-LF-AUTOCRLF-FALSE
core.autocrlf=false
exactHead=H
```

It must be a separate fresh isolated checkout.

Expected contract:

```text
routingExpectedWorktreeEol=LF
routingExpectedWorktreeSha256=1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12
profileExpectedWorktreeEol=LF
profileExpectedWorktreeSha256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
runnerExpectedSelfTestCount=40/40
```

`core.eol` is recorded externally with its origin; `UNSET` is valid.

## 14. Same-exact-HEAD checkout construction

After the implementation commit freezes `H`:

1. create two disposable empty directories outside the shared worktree;
2. clone with `--no-checkout --no-local`;
3. set only that disposable clone's local `core.autocrlf`;
4. checkout exact detached `H`;
5. verify both `git rev-parse HEAD` outputs equal `H`;
6. verify each tracked worktree is clean;
7. install dependencies only with `pnpm install --frozen-lockfile` if necessary;
8. run the full gate sequence;
9. preserve complete binary-safe outputs for the fresh Code reviewer;
10. make no tracked change in the implementation repository.

Each external record must include:

```text
checkoutId
checkoutRootKind
exactHead
gitVersion
nodeVersion
pnpmVersion
coreAutocrlfValue
coreAutocrlfOrigin
coreEolValue
coreEolOrigin
cleanBefore
cleanAfter
```

## 15. Git attribute audit

Both checkouts must dynamically prove:

| Path | Expected `text` | Expected `eol` |
|---|---|---|
| Routing baseline manifest | `set` | `lf` |
| Current profile | `set` | `lf` |
| Future D2 bundle path | `set` | `lf` |
| Catalog V2 | `unspecified` | `unspecified` |
| D1.5E evidence bundle | `unspecified` | `unspecified` |
| Coverage registry | `unspecified` | `unspecified` |
| Runner source | `unspecified` | `unspecified` |
| Workflow | `unspecified` | `unspecified` |

The two existing matched artifacts must report index LF/worktree LF through `git ls-files --eol`.

Dynamic observed values belong only to the external Code Review report.

## 16. D0 Catalog preservation

```text
catalogPath=docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md
catalogBlobOid=4f9a376e56f19b241d76ce2a75be83b70859ae25
catalogBlobByteLength=264855
catalogBlobSha256=e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6
catalogBlobLfCount=626
```

Expected dynamic classifications:

| Checkout | Expected bytes | Expected SHA-256 | Expected EOL | Expected classification |
|---|---:|---|---|---|
| `core.autocrlf=true` | `265481` | `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7` | 626 CRLF | `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY` |
| `core.autocrlf=false` | `264855` | `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` | 626 LF | `MATCHES_REPOSITORY_BLOB` |

Existing test authority remains:

```text
file=packages/domain-core/src/domain-event-structural-schema-catalog.test.ts
suite=Catalog V2 audit projection
title=matches the checked-in frozen generated Catalog V2 path byte-for-byte
```

The Catalog path must remain unmatched.

## 17. Historical artifact preservation

The following blobs remain frozen:

| Path | Blob OID | Bytes | SHA-256 |
|---|---|---:|---|
| Routing baseline manifest | `7d69d6800140324a46f9953b67e82a9e82a0973e` | 3208 | `1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12` |
| Active profile | `a68aca2320745a269e9165e6f24313a750402d37` | 3160 | `2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567` |
| Registry | `81de9cee0a7d9bb88652e9d4aa2ac2eb41eb3f65` | 11704 | `890ef0a49ecdf810f7026f4353d2242732da108221bc54b9cf19aab70608acfc` |
| D1.5E evidence | `7b591fb785d55e399037e27c49f92ab586ed14ac` | 39515 | `54c2b6827d260c8d4200c29818c5950170b1bf0ff8d3e87cc9cc39cc345d9da2` |
| Catalog V2 | `4f9a376e56f19b241d76ce2a75be83b70859ae25` | 264855 | `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` |
| Runner | `394dd8b63023edac3e35b09c6c512441d91a175e` | 97542 | `8767c4cbd47ba4c69943ad62ca5a26196ac0545ef4a4a8650d381c6fe3f7a67c` |
| Coverage verifier | `9b20929c5dab80c01f5d5ecca72aaa4aa7d7e525` | 71463 | `1f910f3c40c110a88f4965f3a6dc672d44f4c2b4ed27c92e6d8467efbaa69aed` |
| Workflow | `c20640b1d186fbe827d70426dfcb52fef93c4350` | 8517 | `314eacd27774d8f25243bf698aedc80ab3ef036f5c37c0caa33c88ae63f6d0c0` |

No historical artifact is regenerated or rewritten.

## 18. Ownership, routing and profile invariants

### 18.1 Ownership

```text
acceptedVersion=ACCEPTED_1572_V1
acceptedStructuredIdentities=1572
acceptedPhysicalTestFiles=31
acceptedInventorySha256=58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8
acceptedCandidateByteLength=391257
acceptedCandidateSha256=d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129
candidateVersion=CANDIDATE_1712_D1_V1
candidateStructuredIdentities=1712
candidatePhysicalTestFiles=36
candidateInventorySha256=540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2
candidatePhysicalTestFileSetSha256=c8c0a52de9c52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0
```

### 18.2 Routing

```text
ordinarySemanticIdentities=1712
coverageSemanticIdentities=1712
ordinaryLogicalGroups=9
ordinaryPhysicalGroups=11
coverageLogicalGroups=11
coveragePhysicalGroups=12
windowsPhysicalGroups=3
runnerExpectedSelfTestCount=40/40
```

### 18.3 Profile, registry and selector

```text
CI_COVERAGE_PROFILE=phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1
```

Profile, registry and selector bytes and semantics must remain unchanged. Coverage must not be generated.

## 19. Verifier and workflow contract

```text
existingVerifierLogicChangesRequired=0
verifierFilesChanged=0
workflowChangesRequired=0
workflowFilesChanged=0
newPermanentScripts=0
newDependencies=0
```

Forbidden changes include:

- runner;
- coverage verifier;
- ownership scripts;
- D0 test or verifier;
- old H D2 verifier;
- workflow checkout configuration;
- workflow normalization;
- package scripts.

Attribute-only implementation failure is a stop condition, not permission to widen implementation.

## 20. Renormalization policy

```text
renormalizationRequired=false
expectedRenormalizedFileCount=0
expectedExistingArtifactContentDiffCount=0
```

A disposable exact-head checkout may perform path-limited renormalization audit against only the two existing targets. It must produce no cached diff.

Repository-wide renormalization is forbidden.

Any changed blob, content diff, mode change, reserialization or delete/add pair is a stop condition.

## 21. Exact file allowlist

### 21.1 Correction and review documents

Design-stage materialization may add:

```text
docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-final-design-correction-1-v1.md
docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-design-correction-1-review-v1.md
```

No further design correction document is authorized.

### 21.2 Implementation allowlist

After corrected-design review passes, implementation may modify exactly:

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

No repository file may be added for dynamic gate evidence or final review results.

## 22. Corrected static status-document contract

The status document is a pre-freeze static implementation declaration. It is not the owner of post-freeze exact-head results.

It must be finalized before the implementation commit and may contain only:

1. slice identity and authorization;
2. corrected design path, materialized SHA and passed design-review authority already existing before implementation;
3. exact implementation base;
4. implementation repair round;
5. exact two-file allowlist;
6. exact three-line attribute contract;
7. declared existing/future path census;
8. expected blob OIDs, byte lengths, SHA-256 and EOL counts;
9. expected Windows and LF checkout contracts;
10. expected D0 classifications;
11. expected ownership, routing, profile, registry and selector invariants;
12. expected V1.1 mapping from section 24;
13. explicit external ownership of dynamic evidence;
14. explicit pending state for checkout results and Actual bindings;
15. static no-coverage/no-Hosted/no-push/no-PR/no-D2/no-D3 declarations;
16. review-pending lifecycle.

Required static lifecycle fields:

```text
D2WStatus=STATIC_IMPLEMENTATION_DECLARED_PENDING_EXTERNAL_EXACT_HEAD_EVIDENCE
D2WFinalAccepted=false
dynamicExactHeadEvidenceStatus=PENDING_EXTERNAL
actualBindingsStatus=PENDING_EXTERNAL
mechanismMatchStatus=PENDING_EXTERNAL_NOT_EVALUATED
codeReviewStatus=PENDING_EXTERNAL
ruleReviewStatus=PENDING_EXTERNAL
coverageExecuted=false
hostedCIExecuted=false
pushPerformed=false
PRCreated=false
D2Resumed=false
D3Started=false
```

The status document must not contain:

- an exact future/self implementation commit SHA;
- `reviewedHead` for the future implementation;
- `frozenD2WHead`;
- observed checkout roots or timestamps;
- observed worktree hashes or EOL counts;
- observed command exits or test totals;
- observed typecheck, lint or ordinary results;
- V1.1 Actual-binding rows;
- `MechanismMatch=PASS`;
- a Code-review pass claim;
- a Rule-review pass claim;
- a local-closure claim;
- evidence inherited from a parent candidate.

Expected constants are permitted only when explicitly labelled `expected`, `frozenDesignValue` or equivalent. They must not be represented as observations.

## 23. Dynamic exact-head evidence authority

All facts produced after `H` is frozen are owned exclusively by one fresh independent external exact-head Code Review report.

```text
dynamicEvidenceAuthority=FRESH_INDEPENDENT_EXTERNAL_EXACT_HEAD_CODE_REVIEW_REPORT
repositoryDynamicEvidenceFile=NONE
dynamicEvidenceWriteBackAllowed=false
```

The Code Review report must contain:

- `reviewedHead=H`;
- exact review timestamp;
- exact implementation diff;
- both checkout records;
- all attribute resolutions;
- all blob/worktree raw-byte results;
- both runner and ownership self-test results;
- D0 results;
- profile/registry/selector audit;
- renormalization result;
- typecheck, lint and ordinary results;
- absence of coverage and Hosted execution;
- the complete five-row V1.1 Actual mapping;
- findings;
- code verdict;
- remaining blockers.

The report is external to the reviewed repository HEAD. It must not be copied into the status document or committed after review.

The subsequent Rule Review may inspect and cite the external Code Review report but does not become the owner of duplicate checkout evidence or Actual mappings.

## 24. Governance Traceability V1.1 expected mapping

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `D2W-C01` | Repository policy is the sole portability authority for scoped canonical artifacts | Exact three rules; existing matches 2; future match 1; no forbidden match | Policy-blob audit, exact `git check-attr`, census | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | Exact contract and no broad rule | `NONE` |
| `D2W-C02` | Standard Windows checkout preserves canonical worktree bytes | `core.autocrlf=true` exact-H checkout yields canonical target bytes and passes unchanged gates | Fresh true checkout, raw-byte audit, runner self-test, ordinary | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `CROSS_PLATFORM_CI` | Routing/profile blob-worktree equality | `NONE` |
| `D2W-C03` | LF checkout preserves the same canonical bytes and behavior | `core.autocrlf=false` exact-H checkout yields the same target bytes and inventory | Fresh false checkout, raw-byte audit, runner self-test, ordinary | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `CROSS_PLATFORM_CI` | Same canonical SHA and inventory as C02 | `NONE` |
| `D2W-C04` | D0 Catalog authority and historical checkout classification remain unchanged | Catalog unmatched; blob frozen; true checkout CRLF-only; false checkout equals blob; D0 test succeeds | Attribute audit, raw classifier, existing D0 test | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | D0 contract preserved | `NONE` |
| `D2W-C05` | No protected authority or identity changes | Exact allowlist, frozen hashes/inventories, zero renormalization and ordinary gates | Diff, blob, ownership, routing, profile and ordinary audits | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | Only two allowlisted files differ | `NONE` |

The status document may reproduce this Expected table verbatim. It must not append Actual columns.

## 25. V1.1 Actual bindings

The external Code Review report, and only that report, must add for every criterion:

```text
CriterionId
ActualTestFile
ActualTestTitle
ActualPrimaryLayer
ActualReachability
ActualTrust
SupportingAuthorityId
MechanismMatch
```

Rules:

- actual fields are evaluated only after both clean checkouts complete at `H`;
- every relevant evidence record must have `exactHead=H`;
- the report must have `reviewedHead=H`;
- `MechanismMatch` is `PASS` or `FAIL` only in the external report;
- no result from another HEAD may be inherited;
- command gates must identify their real command/evidence source without inventing Vitest identities;
- existing test authorities must bind real existing titles;
- no `SUP-*` record is planned.

The status document records only:

```text
actualBindingsStatus=PENDING_EXTERNAL
mechanismMatchStatus=PENDING_EXTERNAL_NOT_EVALUATED
```

## 26. Corrected post-freeze gate sequence

The authoritative sequence is:

1. implement only `.gitattributes`;
2. prepare the static status document;
3. complete all pre-freeze static checks;
4. verify the working diff contains exactly the two allowlisted paths;
5. commit both files with required attribution;
6. resolve and freeze exact implementation HEAD `H`;
7. verify the implementation repository is clean;
8. begin the exact-head gate epoch;
9. create both clean checkouts from `H`;
10. run all true/false gates at `H`;
11. preserve outputs externally without editing tracked files;
12. request a fresh independent Code Review of `H`;
13. the Code reviewer independently validates outputs and records dynamic evidence plus Actual bindings in its complete report;
14. if Code review passes with no blockers, request a fresh independent Rule Review of the same `H`;
15. if both reviews pass with no blockers, record local closure externally;
16. make no post-gate tracked edit or commit.

Explicitly forbidden after step 8:

- editing or finalizing the status document;
- correcting a typo in any tracked file;
- adding a review archive;
- adding a gate report;
- committing a lifecycle update;
- changing `.gitattributes`;
- carrying results to a successor HEAD.

If any tracked edit is required, the current gate epoch is invalid.

## 27. Local gates

Both checkouts must run:

| Gate | True checkout | False checkout |
|---|---:|---:|
| Policy raw-byte audit | Required | Required |
| Attribute resolution | Required | Required |
| Affected-path census | Required | Required |
| Historical blob audit | Required | Required |
| Routing/profile raw-byte equality | Required | Required |
| Runner self-test | Required | Required |
| Ownership self-test | Required | Required |
| D0 Catalog regression | Required | Required |
| Profile byte audit | Required | Required |
| Registry/selector audit | Required | Required |
| D2 protected-manifest regression | Required | Required |
| Path-limited renormalization audit | Required | Required |
| `pnpm typecheck` | Required | Required |
| `pnpm lint` | Required | Required |
| `pnpm test` | Required | Required |
| Coverage | Forbidden | Forbidden |
| Hosted CI | Forbidden | Forbidden |

No result is asserted before execution. All observed results belong to the external Code Review report.

## 28. Required lifecycle checks

### 28.1 Negative pre-freeze status check

Before commit, an audit must reject the status document if it contains:

```text
MechanismMatch=PASS
```

or any:

- observed final-head checkout result;
- observed worktree SHA/EOL;
- actual binding;
- future/self implementation SHA;
- Code/Rule pass claim;
- local-closure claim.

Required outcome before freeze:

```text
dynamicExactHeadEvidenceStatus=PENDING_EXTERNAL
actualBindingsStatus=PENDING_EXTERNAL
mechanismMatchStatus=PENDING_EXTERNAL_NOT_EVALUATED
```

### 28.2 Negative invalidation check

If a tracked edit or commit occurs after either checkout gate begins:

```text
bothCheckoutEvidenceValid=false
codeReviewEvidenceValid=false
actualBindingsValid=false
inheritanceAllowed=false
```

The controller must:

1. discard both checkout result sets as release authority;
2. treat any review of the old HEAD as stale;
3. consume a repair round if the edit is an implementation repair;
4. commit a new candidate `H2`;
5. run both complete checkout gates again at `H2`;
6. request fresh Code and Rule reviews of `H2`.

Rerunning only one checkout is insufficient.

### 28.3 Positive lifecycle check

The only valid positive order is:

```text
finalize static status
  -> commit both allowlisted files
  -> freeze H
  -> verify clean H
  -> run true checkout at H
  -> run false checkout at H
  -> external Code Review report with reviewedHead=H
  -> external Actual bindings with exactHead=H
  -> Rule Review of H
  -> external local-closure record
```

Every true/false evidence row must satisfy:

```text
evidence.exactHead == codeReview.reviewedHead
```

### 28.4 Exact diff check

The final implementation diff must remain exactly:

```text
.gitattributes
docs/implementation/phase-3-slice-2b20b-p2f1r-d2w-canonical-checkout-byte-portability-status.md
```

```text
verifierChanged=false
workflowChanged=false
thirdFileAdded=false
```

## 29. Exact no-change audit

The external Code Review must prove:

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
```

Ordinary identity authority remains:

```text
semanticIdentities=1712
physicalTestFiles=36
inventorySha256=540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2
physicalTestFileSetSha256=c8c0a52de9c52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0
```

## 30. Corrected implementation sequence

Only after fresh corrected-design review returns:

```text
designVerdict=RULE_DESIGN_PASS
remainingDesignBlockers=[]
```

may the sole writer:

1. resolve the full reviewed corrected-design HEAD;
2. confirm it descends from `ae9e301`;
3. create:

```text
phase-3/2b20b-p2f1r-d2w-canonical-checkout-byte-portability
```

4. branch from that reviewed corrected-design HEAD;
5. add exact `.gitattributes`;
6. add the static status document;
7. run only pre-freeze static audits;
8. commit both allowlisted files;
9. freeze `H`;
10. make no further tracked changes;
11. run both exact-head checkout gates;
12. hand all outputs to the fresh Code reviewer;
13. proceed to Rule review only after Code review passes;
14. stop after external local closure or a stop condition.

There is no step permitting post-gate status finalization.

## 31. Fresh corrected-design review

The reviewer must inspect:

- this complete correction;
- parent design and `D2W-DESIGN-001`;
- rule evidence and governance;
- three exact attributes;
- 2+1 census;
- D0 preservation;
- two-file allowlist;
- static versus dynamic evidence ownership;
- Expected versus Actual V1.1 ownership;
- positive and negative lifecycle checks;
- invalidation behavior;
- repair budgets;
- D2 handoff.

Required questions:

1. Can the lifecycle converge on one frozen HEAD?
2. Does the tracked status contain only static facts?
3. Are dynamic results owned only by the external Code Review?
4. Is `MechanismMatch=PASS` impossible before exact-head execution?
5. Does any tracked post-gate edit invalidate both checkout results?
6. Are both checkout records required to equal `reviewedHead`?
7. Is the implementation diff still exactly two files?
8. Are attributes, D0 and all non-related contracts unchanged?

Legal verdicts:

```text
RULE_DESIGN_PASS
RULE_DESIGN_FIX_REQUIRED
HUMAN_BLOCKED
```

Because correction budget is consumed, any verdict other than `RULE_DESIGN_PASS` with `remainingDesignBlockers=[]` stops the slice. No Correction 2 exists.

## 32. Independent Code Review

The fresh external Code Review is both:

1. the independent code verdict authority; and
2. the exclusive dynamic exact-head evidence/Actual-binding authority.

Its complete report must include the project-required review fields and additionally:

```text
reviewedHead
trueCheckoutEvidence
falseCheckoutEvidence
exactHeadEqualityAudit
gateEpochIntegrity
trackedEditAfterGateStart
actualTraceabilityBindings
D2W-C01..D2W-C05 MechanismMatch
```

Required assertions:

- `reviewedHead=H`;
- both checkout exact heads equal `H`;
- no tracked edit or commit occurred after gate start;
- status dynamic fields remain pending/external;
- status contains no observed result or Actual binding;
- exact two-file diff;
- exact policy bytes;
- exact 2+1 census;
- routing/profile canonical equality;
- D0 preservation;
- zero renormalization;
- protected authorities unchanged;
- local gates completed without coverage or Hosted execution;
- D2 blocker prerequisite is closed without claiming D2 closure.

Legal verdicts:

```text
CODE_REVIEW_PASS
CODE_REVIEW_FIX_REQUIRED
HUMAN_BLOCKED
```

No pass is claimed by this design.

## 33. Independent Rule Review

Only after Code Review passes, a fresh Rule reviewer inspects the same `H`, rule evidence, corrected design, static status and external Code Review report.

It verifies:

- no BOTC semantic change;
- no product or event change;
- no test identity change;
- no C/C1 or Catalog authority change;
- no role-matrix change;
- D2 remains paused;
- D3 remains unstarted;
- the Code Review's dynamic evidence belongs to exact `H`;
- no tracked result archive was added.

Legal verdicts:

```text
RULE_REVIEW_PASS
RULE_REVIEW_FIX_REQUIRED
HUMAN_BLOCKED
```

No controller-authored combined pass is allowed.

## 34. Repair accounting and evidence invalidation

```text
DesignCorrection=1/1_CONSUMED
additionalDesignCorrectionAuthorized=false
initialImplementationRepairRound=0/2
maximumImplementationRepairRounds=2
thirdImplementationRepairAuthorized=false
```

Initial implementation is not a repair.

Any repair that changes `.gitattributes` or the status document:

- consumes one implementation repair round;
- creates a new candidate HEAD;
- invalidates both checkout result sets;
- invalidates Actual bindings;
- invalidates prior Code and Rule reviews;
- requires both complete gates and both reviews again.

A review-only external report does not alter the reviewed HEAD.

After repair `2/2`, any remaining blocker stops the slice.

## 35. Corrected lifecycle

Repository lifecycle:

```text
GOVERNANCE_GO
  -> PARENT_DESIGN_FIX_REQUIRED
  -> CORRECTION_1_PENDING_REVIEW
  -> RULE_DESIGN_PASS
  -> IMPLEMENTATION_AUTHORIZED
  -> STATIC_STATUS_FINALIZED
  -> IMPLEMENTATION_COMMITTED
  -> FROZEN_H_PENDING_EXTERNAL_EXACT_HEAD_GATES
```

External evidence lifecycle after frozen `H`:

```text
FROZEN_H
  -> TRUE_CHECKOUT_GATE_AT_H
  -> FALSE_CHECKOUT_GATE_AT_H
  -> EXTERNAL_CODE_REVIEW_OF_H_WITH_ACTUAL_BINDINGS
  -> EXTERNAL_RULE_REVIEW_OF_H
  -> LOCAL_CANONICAL_CHECKOUT_BYTE_PORTABILITY_CLOSED
```

The tracked status remains:

```text
D2WStatus=STATIC_IMPLEMENTATION_DECLARED_PENDING_EXTERNAL_EXACT_HEAD_EVIDENCE
D2WFinalAccepted=false
```

It is not updated after gates.

At successful external local closure, the controller may report outside the repository:

```text
D2WStatus=LOCAL_CANONICAL_CHECKOUT_BYTE_PORTABILITY_CLOSED
D2WFinalAccepted=false
frozenD2WHead=H
coverageExecuted=false
hostedCIExecuted=false
pushPerformed=false
PRCreated=false
D2Resumed=false
D3Started=false
```

Local closure is not repository acceptance.

## 36. D2 handoff

After both independent reviews pass on exact `H`, the only next action is:

```text
AUTHORIZE_D2_H_REMATERIALIZATION_ON_FROZEN_D2W_BASELINE
```

Future D2 must:

- branch from frozen D2W `H`;
- use the already reviewed D2 design;
- rematerialize implementation from the new base;
- rerun D2 gates and reviews;
- create new exact-H evidence.

It must not:

- branch from or cherry-pick old `0fc4288` as accepted work;
- inherit old D2 test results or reviews;
- inherit D2W reviews as D2 reviews;
- claim E2 or D-C16 closure early.

D2W closes only the repository byte-portability prerequisite.

## 37. Rollback

Before a future D2 depends on D2W, rollback is a non-history-rewriting revert limited to:

```text
.gitattributes
docs/implementation/phase-3-slice-2b20b-p2f1r-d2w-canonical-checkout-byte-portability-status.md
```

Rollback must not change artifacts, verifiers, workflow, Git global configuration or accepted history.

After D2 depends on the contract, `.gitattributes` cannot be removed independently.

## 38. Stop conditions

Stop immediately if:

- corrected design review does not pass;
- a second design correction is requested;
- implementation does not start from reviewed corrected-design baseline;
- old H becomes an ancestor;
- a fourth attribute rule is required;
- path census differs from 2+1;
- Catalog is matched;
- a protected blob changes;
- true checkout does not yield canonical targets;
- checkouts do not use the same `H`;
- the status contains observed dynamic results;
- the status contains an Actual binding or `MechanismMatch=PASS`;
- a tracked edit occurs after gate start;
- results are inherited by a successor HEAD;
- a third implementation file is required;
- verifier or workflow change is required;
- renormalization count is nonzero;
- coverage or Hosted CI starts;
- local gates fail;
- implementation repair budget is exhausted;
- Code or Rule review returns `HUMAN_BLOCKED`;
- D2 or D3 starts before D2W closure.

## 39. Frozen impact fields

```text
AuthorityStatus=CURRENT_AND_COMPLETE_D2W_CORRECTED_DESIGN_AUTHORITY
DesignCorrection=1/1_CONSUMED
selectedSolution=A_MINIMAL_REPOSITORY_GITATTRIBUTES_EOL_CONTRACT
selectedAuthority=REPOSITORY_DECLARED_PATH_SCOPED_GIT_ATTRIBUTES
canonicalArtifactCount=3
existingCanonicalArtifactCount=2
futureCanonicalArtifactCount=1
affectedPathCount=3
renormalizationRequired=false
renormalizedFileCount=0
implementationFilesMaximum=2
repositoryDynamicEvidenceFiles=0
statusEvidenceRole=STATIC_PRE_FREEZE_ONLY
dynamicEvidenceAuthority=EXTERNAL_FRESH_EXACT_HEAD_CODE_REVIEW_REPORT
postGateTrackedWriteAllowed=false
evidenceInheritanceAcrossHeadsAllowed=false
verifierChanged=false
workflowChanged=false
productionFilesChanged=0
testFilesChanged=0
testIdentityChanged=false
profileChanged=false
registryChanged=false
selectorChanged=false
ownershipChanged=false
routingChanged=false
coverageChanged=false
eventDefinitionsChanged=false
semanticValidatorChanged=false
productBehaviorChanged=false
ruleSemanticsChanged=false
eventSchemaChanged=false
roleCoverageChanged=false
D0Compatibility=PRESERVED
normalizationAllowed=false
globalGitConfigRequired=false
coverageExecuted=false
hostedCIExecuted=false
pushPerformed=false
PRCreated=false
D2Resumed=false
D3Started=false
implementationAuthorized=false
designVerdict=PENDING_FRESH_INDEPENDENT_CORRECTED_DESIGN_REVIEW
remainingDesignBlockers=[PENDING_FRESH_INDEPENDENT_CORRECTED_DESIGN_REVIEW]
requiredNextAction=FRESH_INDEPENDENT_D2W_CORRECTED_RULE_DESIGN_REVIEW
```

## 40. Terminal

```text
READY_FOR_FRESH_INDEPENDENT_D2W_CORRECTED_RULE_DESIGN_REVIEW_V1
```

---

Frozen field summary:

```text
correctedDesignPath=docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-final-design-correction-1-v1.md
correctedDesignSHA256=<TO_BE_COMPUTED_AFTER_EXACT_MATERIALIZATION>
AuthorityStatus=CURRENT_AND_COMPLETE_D2W_CORRECTED_DESIGN_AUTHORITY
parentDesignHead=ae9e3011f8b3621a48cd6e8178732080453b3f1c
parentDesignSha256=3058e9efb9c682036bbab2400fd5e33d2d5cbc18239926cdd64dfb7bc282c65d
reviewedFinding=D2W-DESIGN-001
findingDisposition=CORRECTED_PROSPECTIVELY_PENDING_FRESH_INDEPENDENT_CONFIRMATION
DesignCorrection=1/1_CONSUMED
implementationRepairRound=0/2
implementationAuthorized=false
designVerdict=PENDING_FRESH_INDEPENDENT_CORRECTED_DESIGN_REVIEW
remainingDesignBlockers=[PENDING_FRESH_INDEPENDENT_CORRECTED_DESIGN_REVIEW]
dynamicEvidenceAuthority=EXTERNAL_FRESH_EXACT_HEAD_CODE_REVIEW_REPORT
statusEvidenceRole=STATIC_PRE_FREEZE_ONLY
postGateTrackedWriteAllowed=false
thirdImplementationFileAuthorized=false
```
