# Phase 3 Slice 2B20B-P2F1R-D2W Canonical Checkout Byte Portability Final Design V1

## 1. Design identity

```text
sliceId=2B20B-P2F1R-D2W
sliceName=Canonical Checkout Byte Portability Foundation
documentKind=FINAL_IMPLEMENTATION_DESIGN
AuthorityStatus=CURRENT_AND_COMPLETE_D2W_DESIGN_AUTHORITY
authorization=USER_AUTHORIZED_2B20B_P2F1R_D2W_CANONICAL_CHECKOUT_BYTE_PORTABILITY_FOUNDATION_AND_CONDITIONAL_LOCAL_CLOSURE
designRound=1
designCorrectionRound=0/1
implementationRepairRound=0/2
designBaseHead=70aef13b8e252761aa17f7040f94c72af5a4347c
implementationAuthorized=false
designVerdict=PENDING_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW
remainingDesignBlockers=[PENDING_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW]
```

Design path:

```text
docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-final-design-v1.md
```

Expected materialized SHA field:

```text
designSHA256=<TO_BE_COMPUTED_FROM_EXACT_MATERIALIZED_UTF8_BYTES_BY_SOLE_WRITER>
```

This document is the complete D2W implementation design authority only after a fresh independent reviewer returns `RULE_DESIGN_PASS` with `remainingDesignBlockers=[]`. This document does not issue that verdict and does not authorize implementation by itself.

## 2. Prerequisite authority

### 2.1 Rule evidence

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

All four mandatory rule sources were available. No approved snapshot was needed and no unresolved source conflict exists.

D2W is an engineering portability foundation. It changes no ability, night order, interaction, impairment rule, character or alignment transition, Storyteller discretion, product-visible behavior, domain event, replay meaning, projection or role coverage.

### 2.2 Governance authority

```text
governancePath=docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-governance-v1.md
governanceHead=70aef13b8e252761aa17f7040f94c72af5a4347c
governanceSha256=a269ee8d6e03c1194887e9e4bae248bef7aba69a34e6c2c50ad18effeda753d2
governanceVerdict=GO
governanceRemainingBlockers=[]
selectedSolution=A_MINIMAL_REPOSITORY_GITATTRIBUTES_EOL_CONTRACT
```

The governance decision is frozen. This design must not reopen solution B, solution C or an unreviewed fourth authority.

### 2.3 D2 relationship

```text
currentD2DesignHead=075000fc181ee50a110157f4ce62f89972323c77
currentD2DesignVerdict=RULE_DESIGN_PASS
oldUnacceptedD2Head=0fc4288c9b0e22787eee3e2c87d7b0c54e432769
oldUnacceptedD2Disposition=HISTORICAL_UNACCEPTED_BLOCKED_BY_D2W
```

`075000f` is an ancestor of the D2W design base. `0fc4288` is not an ancestor of the D2W design base and remains frozen, historical and unaccepted.

## 3. Objective

Introduce exactly one permanent repository concept:

```text
CANONICAL_EOL_CONTRACT
```

The contract must make the two existing tracked worktree-canonical artifacts and the one future D2 canonical bundle path checkout as LF on Windows and Linux, independent of `core.autocrlf`, while preserving:

- their existing Git blob bytes;
- current verifier behavior;
- D0 Catalog Git-blob authority and Windows CRLF diagnostic classification;
- all product, test, ownership, routing, coverage, profile, registry and selector identities;
- the current workflow;
- ordinary test inventory `1712`;
- the existing D2 design without resuming old H.

The implementation must not create an EOL registry, normalization service, platform adapter, checkout abstraction, new helper framework or new dependency.

## 4. Scope

D2W implementation is limited to:

1. adding one root `.gitattributes`;
2. adding one D2W implementation/status document;
3. proving the contract in two clean checkouts of the same exact implementation HEAD;
4. running the frozen local gates;
5. obtaining fresh independent Code and Rule reviews;
6. recording local closure without push, PR, merge, tag, Hosted CI or acceptance.

## 5. Non-goals

D2W does not authorize:

- D2 Hosted CI;
- D2 capture generation or acquisition;
- the D2 evidence bundle;
- D-C16A or D-C16B closure;
- resumption or acceptance of `0fc4288`;
- D3;
- production code;
- test files, test titles, semantic test identities or ownership;
- A, B, C or C1 changes;
- event definitions, payload schemas or semantic validators;
- routing topology or routing manifest content;
- coverage execution, thresholds or profiles;
- profile registry or selector changes;
- workflow, job, matrix, checkout action or runner changes;
- package scripts or dependencies;
- a global `.editorconfig`;
- a global `* text=auto eol=lf` policy;
- broad `*.json`, `*.md`, `*.mjs` or source-code EOL rules;
- global or user-machine Git configuration;
- a CI `dos2unix`, `sed`, PowerShell replacement or checkout mutation;
- read-time CRLF normalization;
- role coverage changes;
- push, PR, merge, tag or accepted status.

## 6. Frozen authority decision

### 6.1 Selected authority

For the paths in section 7:

```text
canonicalCheckoutAuthority=REPOSITORY_DECLARED_PATH_SCOPED_GIT_ATTRIBUTES
canonicalStoredBytes=GIT_BLOB_UTF8_LF
canonicalWorktreeProjection=EXACT_GIT_BLOB_BYTES
localNormalizationAllowed=false
verifierNormalizationAllowed=false
workflowNormalizationAllowed=false
globalGitConfigRequired=false
```

The root `.gitattributes` is the sole checkout-portability authority for this artifact class.

The Git blob stores canonical LF bytes. The checked-out file is a constrained projection of that blob and must have the same raw SHA-256. The worktree is not a second independent authority and may not be normalized after checkout.

### 6.2 Rejected alternatives

The following remain rejected:

```text
B_GIT_BLOB_AS_RUNTIME_AUTHORITY_FOR_SCOPED_WORKTREE_ARTIFACTS
C_LOCAL_OR_CI_CANONICALIZATION
```

D2W must not:

- change the runner or profile verifier to `git show` or `git cat-file`;
- make verifier success depend on repository object availability;
- ignore modified worktree artifacts;
- normalize CRLF in memory;
- mutate checked-out artifacts before validation.

D0 remains a deliberately different, previously frozen artifact role and is not evidence for reopening this decision.

## 7. Exact `.gitattributes` contract

The new root `.gitattributes` blob must contain exactly these three ASCII/UTF-8 lines in this order, with LF after every line, including the final line:

```gitattributes
/docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5-routing-baseline-manifest.json text eol=lf
/docs/implementation/coverage-profiles/*.json text eol=lf
/docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json text eol=lf
```

Frozen raw policy bytes:

```text
gitattributesByteLength=248
gitattributesLfCount=3
gitattributesCrlfCount=0
gitattributesBom=false
gitattributesSha256=e04dab79f8142beae706f5fb37ac10fe3e2f08aeeeb719d0adbdeaade4bcbb09
```

No blank line, comment, alternate pattern, additional attribute, wildcard broadening or generated entry is permitted.

The `.gitattributes` worktree representation is semantic Git policy and is not itself a canonical product artifact. Its committed blob must nevertheless equal the frozen 248-byte content.

## 8. Exact affected paths and patterns

| Declaration | Status at design base | Match count | Contract |
|---|---|---:|---|
| `/docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5-routing-baseline-manifest.json` | Existing tracked file | 1 | `text eol=lf` |
| `/docs/implementation/coverage-profiles/*.json` | Existing stable narrow pattern | 1 | `text eol=lf` |
| `/docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json` | Future exact path; absent | 0 | `text eol=lf` |

Frozen counts:

```text
existingTrackedMatchedPaths=2
futureDeclaredMatchedPaths=1
affectedPathCount=3
renormalizedFileCount=0
```

The current profile-pattern match is exactly:

```text
docs/implementation/coverage-profiles/phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1.json
```

If the implementation base contains a second profile JSON, a renamed routing manifest or a pre-existing D2 bundle, the match census has changed and implementation must stop for design review.

## 9. Canonical artifact contracts

### 9.1 Routing baseline manifest

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

Both required clean checkouts must produce exactly these worktree bytes.

`run-vitest-logical-group.mjs::verifyD15Baseline` remains unchanged and must continue reading the worktree file and comparing it with canonical serialization using raw `Buffer.equals`.

### 9.2 Coverage profile artifact

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

Both clean checkouts must produce exactly these worktree bytes.

`verify-coverage-obligations.mjs::validateProfileArtifactBytes` remains unchanged and must continue to require byte equality with `JSON.stringify(value, null, 2) + "\n"`.

### 9.3 Future D2 publication bundle

```text
path=docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json
designBaseStatus=ABSENT
expectedAttributeText=set
expectedAttributeEol=lf
futureEncoding=UTF8
futureEol=LF
```

D2W does not create this file, its bytes, its digest or E2. The exact path declaration only prevents the same checkout defect when a future reviewed D2 rematerialization creates the bundle.

No future D2 bundle SHA, commit, evidence verdict or PASS may be invented in D2W.

## 10. Git blob contract

For both existing matched artifacts:

- the implementation must not modify their index entries;
- blob OIDs must remain the values in section 9;
- raw blob byte length, SHA-256 and EOL counts must remain unchanged;
- checkout filters may only produce the exact same LF bytes;
- no clean filter other than Git's built-in `text eol=lf` behavior is allowed;
- no smudge filter, external filter driver or encoding conversion is allowed.

The implementation status must record, for each clean checkout and each existing artifact:

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
```

Required result in both checkouts:

```text
blobEqualsWorktree=true
```

## 11. Windows checkout contract

The normative Windows/adversarial checkout is:

```text
checkoutId=D2W-WINDOWS-AUTOCRLF-TRUE
exactHead=<same frozen implementation HEAD used by LF checkout>
core.autocrlf=true
```

It must be a fresh clean clone or equivalent isolated checkout. Configuration may be written only to that disposable clone before its checkout. No global configuration, shared-repository configuration or user-machine configuration may change.

Required facts:

```text
routingWorktreeEol=LF
routingWorktreeSha256=1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12
profileWorktreeEol=LF
profileWorktreeSha256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
runnerSelfTestExpected=PASS_40_OF_40
```

The `core.autocrlf=true` setting is an adversarial checkout condition, not the byte authority. `.gitattributes` must override it for the three declared paths.

This checkout also serves as the required standard/default Git for Windows behavior test. If an ambient default is inspected, its origin and value are diagnostic only. Correctness is established by the explicitly recorded effective `true` condition in the disposable checkout.

## 12. Linux/LF checkout contract

The normative LF checkout is:

```text
checkoutId=D2W-LF-AUTOCRLF-FALSE
exactHead=<same frozen implementation HEAD used by Windows checkout>
core.autocrlf=false
```

It must be a separate fresh clean clone or equivalent isolated checkout. Any local configuration write is limited to that disposable clone.

Required facts:

```text
routingWorktreeEol=LF
routingWorktreeSha256=1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12
profileWorktreeEol=LF
profileWorktreeSha256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
runnerSelfTestExpected=PASS_40_OF_40
```

`core.eol` must be recorded with origin and effective value when set; `UNSET` is valid because `eol=lf` is path authority.

## 13. Same-exact-HEAD checkout construction

The implementation evidence must use two independent checkout roots.

A conforming construction is:

1. resolve the complete 40-character implementation HEAD;
2. create disposable empty directories outside the shared worktree;
3. clone with `--no-checkout --no-local`;
4. set only the disposable clone's local `core.autocrlf` to the required value;
5. checkout the exact detached HEAD;
6. verify `git rev-parse HEAD` equals the same frozen HEAD in both clones;
7. verify `git status --porcelain=v1` is empty before gates;
8. install dependencies only if required, using `pnpm install --frozen-lockfile`;
9. run the audit and ordinary gates;
10. verify unchanged HEAD and clean tracked worktree after gates.

Equivalent temporary worktrees are permitted only if they reproduce the effective `true` and `false` checkout conditions without modifying shared, global or user configuration.

The evidence must record:

```text
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

Temporary checkout roots must never be the dirty shared worktree or the old H worktree.

## 14. Git attribute audit

In both checkouts, `git check-attr text eol -- <path>` must return:

| Path | `text` | `eol` |
|---|---|---|
| routing baseline manifest | `set` | `lf` |
| current coverage profile | `set` | `lf` |
| future D2 bundle path | `set` | `lf` |
| Catalog V2 | `unspecified` | `unspecified` |
| D1.5E evidence bundle | `unspecified` | `unspecified` |
| coverage registry module | `unspecified` | `unspecified` |
| runner source | `unspecified` | `unspecified` |
| workflow | `unspecified` | `unspecified` |

`git ls-files --eol` must report index LF and worktree LF for the two existing matched artifacts in both checkouts.

The future D2 path is absent and therefore has no `git ls-files --eol` row, but `git check-attr` must still resolve `text=set` and `eol=lf`.

## 15. D0 Catalog preservation

The Catalog path remains outside every D2W pattern:

```text
catalogPath=docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md
catalogBlobOid=4f9a376e56f19b241d76ce2a75be83b70859ae25
catalogBlobByteLength=264855
catalogBlobSha256=e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6
catalogBlobLfCount=626
```

Required checkout results:

| Checkout | Worktree bytes | Worktree SHA-256 | EOL | D0 classification |
|---|---:|---|---|---|
| `core.autocrlf=true` | `265481` | `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7` | 626 CRLF | `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY` |
| `core.autocrlf=false` | `264855` | `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` | 626 LF | `MATCHES_REPOSITORY_BLOB` |

The existing suite and title remain:

```text
file=packages/domain-core/src/domain-event-structural-schema-catalog.test.ts
suite=Catalog V2 audit projection
title=matches the checked-in frozen generated Catalog V2 path byte-for-byte
```

D2W must run this focused test in both checkouts without editing it. D0's Git-blob audit authority, fixed OID, digest, path, title and accepted dual-worktree classification remain unchanged.

## 16. Historical artifact preservation

The following historical artifacts must remain byte-identical at the implementation HEAD:

| Path | Blob OID | Byte length | SHA-256 |
|---|---|---:|---|
| Routing baseline manifest | `7d69d6800140324a46f9953b67e82a9e82a0973e` | 3208 | `1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12` |
| Active standalone profile | `a68aca2320745a269e9165e6f24313a750402d37` | 3160 | `2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567` |
| Coverage registry | `81de9cee0a7d9bb88652e9d4aa2ac2eb41eb3f65` | 11704 | `890ef0a49ecdf810f7026f4353d2242732da108221bc54b9cf19aab70608acfc` |
| D1.5E evidence bundle | `7b591fb785d55e399037e27c49f92ab586ed14ac` | 39515 | `54c2b6827d260c8d4200c29818c5950170b1bf0ff8d3e87cc9cc39cc345d9da2` |
| Catalog V2 | `4f9a376e56f19b241d76ce2a75be83b70859ae25` | 264855 | `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` |
| Runner | `394dd8b63023edac3e35b09c6c512441d91a175e` | 97542 | `8767c4cbd47ba4c69943ad62ca5a26196ac0545ef4a4a8650d381c6fe3f7a67c` |
| Coverage verifier | `9b20929c5dab80c01f5d5ecca72aaa4aa7d7e525` | 71463 | `1f910f3c40c110a88f4965f3a6dc672d44f4c2b4ed27c92e6d8467efbaa69aed` |
| Workflow | `c20640b1d186fbe827d70426dfcb52fef93c4350` | 8517 | `314eacd27774d8f25243bf698aedc80ab3ef036f5c37c0caa33c88ae63f6d0c0` |

D2W does not rewrite accepted history, regenerate artifacts or repair historical evidence.

## 17. Ownership, routing and profile invariants

### 17.1 Ownership

The existing ownership verifier must remain unchanged and its self-test must pass.

Frozen accepted authority:

```text
acceptedVersion=ACCEPTED_1572_V1
acceptedStructuredIdentities=1572
acceptedPhysicalTestFiles=31
acceptedInventorySha256=58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8
acceptedCandidateByteLength=391257
acceptedCandidateSha256=d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129
```

Frozen candidate authority:

```text
candidateVersion=CANDIDATE_1712_D1_V1
candidateStructuredIdentities=1712
candidatePhysicalTestFiles=36
candidateInventorySha256=540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2
candidatePhysicalTestFileSetSha256=c8c0a52de9c52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0
```

### 17.2 Routing

`node scripts/run-vitest-logical-group.mjs --self-test` must pass `40/40` in both checkouts.

Frozen runner totals:

```text
ordinarySemanticIdentities=1712
coverageSemanticIdentities=1712
ordinaryLogicalGroups=9
ordinaryPhysicalGroups=11
coverageLogicalGroups=11
coveragePhysicalGroups=12
windowsPhysicalGroups=3
```

No routing entry, count, group, owner or manifest content may change.

### 17.3 Profile, registry and selector

The active standalone profile remains the sole full profile artifact authority. Registry remains metadata-only.

Frozen selector:

```text
CI_COVERAGE_PROFILE=phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1
```

The implementation audit must prove:

- profile raw bytes are canonical in both checkouts;
- profile ID, source head, topology and embedded hashes are unchanged;
- registry blob and exported records are unchanged;
- selector value is unchanged;
- the narrow profile pattern matches exactly one tracked file;
- no profile is appended, removed, promoted or reserialized.

Coverage data must not be generated to prove these facts.

## 18. Verifier and workflow contract

Frozen implementation effects:

```text
existingVerifierLogicChangesRequired=0
verifierFilesChanged=0
workflowChangesRequired=0
workflowFilesChanged=0
newPermanentScripts=0
newDependencies=0
```

Specifically forbidden:

- edits to `scripts/run-vitest-logical-group.mjs`;
- edits to `scripts/verify-coverage-obligations.mjs`;
- edits to either ownership script;
- edits to any D0 test or verifier;
- restoration of the old H D2 verifier;
- workflow checkout options;
- workflow normalization steps;
- new package commands.

If the attribute-only change cannot pass existing verifiers, implementation stops. It may not consume a repair round to change the verifier or workflow. Any such need requires the single authorized design correction and a new independent design review.

## 19. Renormalization policy

```text
renormalizationRequired=false
expectedRenormalizedFileCount=0
expectedExistingArtifactContentDiffCount=0
```

In a disposable checkout of the candidate HEAD:

1. run a path-limited renormalization dry audit for the two existing matches;
2. if necessary for conclusive evidence, run `git add --renormalize` only against those two paths in the disposable checkout;
3. require an empty cached diff for both paths;
4. require their blob OIDs to remain frozen;
5. do not run repository-wide renormalization.

The feature diff must not contain either existing artifact.

Any existing-file content diff, mode change, delete/add pair, reserialization, reordered keys or changed blob OID is a stop condition. It must not be committed as EOL cleanup.

## 20. Exact file allowlist

### 20.1 Design-stage documents

Before implementation, the sole writer may materialize only the design/review documents required by the design gate:

```text
docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-final-design-v1.md
docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-design-review-v1.md
```

If the first review returns `RULE_DESIGN_FIX_REQUIRED`, the only authorized correction documents are:

```text
docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-final-design-correction-1-v1.md
docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-design-correction-1-review-v1.md
```

No second correction exists.

### 20.2 Implementation allowlist

After `RULE_DESIGN_PASS`, the implementation diff may contain exactly:

```text
.gitattributes
docs/implementation/phase-3-slice-2b20b-p2f1r-d2w-canonical-checkout-byte-portability-status.md
```

Maximum implementation files:

```text
modifiedFilesMaximum=2
productionFilesMaximum=0
testFilesMaximum=0
verifierFilesMaximum=0
workflowFilesMaximum=0
```

There is no optional test or verifier file in this design. Governance and isolated simulation already proved existing entry points are sufficient.

Any need for a third file is outside the frozen design.

## 21. Implementation/status document contract

The status document must be created before final implementation review and must record observed evidence without inventing future commits or verdicts.

Required sections:

1. identity and authorization;
2. reviewed design authority and design-review verdict;
3. implementation base;
4. exact diff allowlist;
5. exact `.gitattributes` raw contract;
6. affected-path census;
7. Git blob audit;
8. `core.autocrlf=true` checkout evidence;
9. `core.autocrlf=false` checkout evidence;
10. D0 Catalog evidence;
11. ownership/routing/profile/registry/selector evidence;
12. renormalization audit;
13. typecheck/lint/ordinary results;
14. no-coverage/no-Hosted/no-push record;
15. V1.1 actual traceability bindings;
16. impact flags;
17. review-pending lifecycle.

The document must not self-reference its future commit SHA. Exact final HEAD and reviewer verdicts remain external exact-head evidence until a later separately authorized closeout.

Before independent reviews its lifecycle must be:

```text
D2WStatus=LOCAL_GATES_RECORDED_PENDING_INDEPENDENT_REVIEWS
D2WFinalAccepted=false
codeVerdict=PENDING_INDEPENDENT_CODE_REVIEW
ruleVerdict=PENDING_INDEPENDENT_RULE_REVIEW
```

It must not predeclare either pass verdict.

## 22. Governance Traceability V1.1

### 22.1 Design-time criteria

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `D2W-C01` | Repository policy is the sole portability authority for the scoped canonical artifacts | `.gitattributes` has exactly three frozen rules; existing matches are 2, future match is 1, and no forbidden path matches | Raw policy-blob SHA/length/EOL audit plus exact `git check-attr` and match census | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | Exact contract and exact match set; no broad rule | `NONE` |
| `D2W-C02` | Standard Windows checkout must preserve canonical worktree bytes | Same exact HEAD under `core.autocrlf=true` yields LF worktree bytes equal to both frozen blobs; runner self-test and ordinary suite succeed naturally | Fresh isolated true checkout, raw blob/worktree audit, EOL census, existing runner self-test, full ordinary | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `CROSS_PLATFORM_CI` | Routing/profile blob-worktree equality and canonical gate success | `NONE` |
| `D2W-C03` | LF checkout must preserve the same canonical worktree bytes and behavior | Same exact HEAD under `core.autocrlf=false` yields the same LF bytes, verifier result and ordinary inventory as C02 | Separate fresh isolated false checkout, raw blob/worktree audit, EOL census, existing runner self-test, full ordinary | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `CROSS_PLATFORM_CI` | Same canonical SHA and semantic inventory as C02 | `NONE` |
| `D2W-C04` | D0 Catalog authority and historical Windows classification remain unchanged | Catalog is not matched; raw Git blob remains frozen; true checkout remains CRLF-only conversion; false checkout matches blob; existing D0 test succeeds | `git check-attr`, raw blob/worktree classifier, existing Catalog V2 focused test in both checkouts | `R4_FUTURE_HYPOTHETICAL_STATE` | `T3_MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | D0 dual-worktree contract unchanged | `NONE` |
| `D2W-C05` | The portability slice changes no test, product, routing, ownership, profile, registry, selector or workflow authority | Exact allowlist diff; frozen hashes and inventories; zero renormalized files; typecheck, lint and ordinary pass | Diff census, blob audits, ownership self-test, routing self-test, profile/registry/selector audit, renormalization audit and local gates | `R4_FUTURE_HYPOTHETICAL_STATE` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | Only `.gitattributes` and status doc differ; all protected authorities unchanged | `NONE` |

### 22.2 Actual bindings

The implementation status document must retain all nine expected fields and add exactly:

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

For non-Vitest Git/platform command gates, the actual binding must identify the exact recorded executable command gate and evidence section rather than inventing a Vitest title. For existing test/script authorities, it must bind their real file and existing self-test or test title.

`MechanismMatch=PASS` may be recorded only after the exact required command completes and its full result matches the criterion. A command result from another HEAD or checkout cannot be inherited.

No `SUP-*` record is planned. Raw Git objects, the existing D0 test and the same-HEAD checkout outputs are direct evidence mechanisms, not borrowed supporting authority.

## 23. Required checkout gate sequence

Run this sequence independently in both checkouts:

1. verify exact detached HEAD;
2. verify clean tracked worktree;
3. record effective Git config and origins;
4. verify `.gitattributes` raw blob contract;
5. run exact attribute and affected-path census;
6. read raw Git blobs without text decoding or EOL normalization;
7. read raw worktree bytes;
8. record SHA-256, byte length and EOL census;
9. require routing/profile blob-worktree equality;
10. run `node scripts/run-vitest-logical-group.mjs --self-test`;
11. run `node scripts/verify-vitest-ownership-contracts.mjs --self-test`;
12. run the existing focused D0 Catalog V2 test;
13. run the profile/registry/selector non-coverage audit;
14. run path-limited renormalization audit;
15. run typecheck;
16. run lint;
17. run full ordinary tests;
18. rerun protected hash/diff census;
19. verify same HEAD and clean tracked worktree.

Raw SHA inspection must use binary-safe tools. PowerShell text pipelines must not be used to transport Git blob bytes.

## 24. Local gates

The exact local gate set is:

| Gate | Required in true checkout | Required in false checkout | Frozen outcome |
|---|---:|---:|---|
| `.gitattributes` raw policy audit | Yes | Yes | 248 bytes, frozen SHA, three LF |
| Attribute resolution audit | Yes | Yes | scoped paths `text/set eol/lf`; forbidden paths unspecified |
| Affected-path census | Yes | Yes | existing `2`, future `1` |
| Historical raw blob SHA audit | Yes | Yes | all section 16 constants unchanged |
| Raw worktree canonical audit | Yes | Yes | routing/profile equal their blobs |
| Runner self-test | Yes | Yes | existing `40/40` authority succeeds |
| Ownership verifier self-test | Yes | Yes | accepted/candidate authorities unchanged |
| D0 Catalog regression | Yes | Yes | frozen dual-worktree classifications |
| Coverage profile byte audit | Yes | Yes | active profile canonical and unchanged |
| Registry/selector audit | Yes | Yes | metadata and selector unchanged |
| D2 protected manifest regression | Yes | Yes | routing manifest canonical; D2 bundle absent |
| Renormalization diff audit | Yes | Yes | zero existing-file diff |
| `pnpm typecheck` | Yes | Yes | succeeds |
| `pnpm lint` | Yes | Yes | succeeds |
| `pnpm test` | Yes | Yes | succeeds with unchanged 1712 identity authority |
| Coverage | **Forbidden** | **Forbidden** | `coverageExecuted=false` |
| Hosted CI | **Forbidden** | **Forbidden** | `hostedCIExecuted=false` |

No result is asserted in advance. Failure of any required gate blocks review.

## 25. Exact no-change audit

Against the reviewed implementation base, the final implementation diff must prove:

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

Only the two allowlisted paths may appear.

The ordinary identity authority must remain:

```text
semanticIdentities=1712
physicalTestFiles=36
inventorySha256=540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2
physicalTestFileSetSha256=c8c0a52de9c52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0
```

## 26. Implementation sequence

Only after a fresh independent reviewer returns:

```text
designVerdict=RULE_DESIGN_PASS
remainingDesignBlockers=[]
```

the controller may authorize the sole writer to:

1. resolve the exact reviewed design baseline HEAD;
2. confirm the reviewed baseline descends from `70aef13`;
3. create:

```text
phase-3/2b20b-p2f1r-d2w-canonical-checkout-byte-portability
```

4. branch from the exact reviewed design baseline, not from `0fc4288`;
5. add the exact three-line `.gitattributes`;
6. run preliminary attribute, blob and renormalization audits;
7. add the one implementation/status document with actual local evidence;
8. commit with required attribution;
9. freeze the candidate HEAD;
10. create both clean checkouts from that exact HEAD;
11. run all local gates;
12. finalize the status document before final review if evidence recording requires it;
13. freeze a new exact review HEAD;
14. request fresh independent Code review;
15. only after Code review passes, request fresh independent Rule review;
16. stop after local closure or a stop condition.

No push, PR, merge, tag or Hosted run is part of this sequence.

## 27. Independent design review

The fresh read-only design reviewer must independently inspect:

- rule evidence and `RULE_READY`;
- governance and `GO`;
- this complete design;
- actual baseline Git objects;
- `.gitattributes` absence at the base;
- exact current profile count;
- routing/profile raw-byte consumers;
- D0 governance/design/test;
- ownership, registry, selector and routing authorities;
- old H disposition;
- current D2 design and dependency;
- V1.1 traceability;
- file allowlist and repair budgets.

Required review questions:

1. Is the byte authority unique?
2. Are the three patterns exact and minimal?
3. Is standard Windows checkout reachable without global configuration?
4. Does Linux/LF checkout preserve the same bytes?
5. Is Catalog expressly unmatched?
6. Is D0 history unchanged?
7. Is renormalized existing-file count necessarily zero?
8. Are verifier and workflow changes truly unnecessary?
9. Are product, test, ownership, profile, registry and selector identities frozen?
10. Can D2 be rematerialized from a future frozen D2W HEAD without using old H?
11. Does the design introduce only `CANONICAL_EOL_CONTRACT`?
12. Are all five V1.1 criteria correctly classified and independently provable?

Legal verdicts:

```text
RULE_DESIGN_PASS
RULE_DESIGN_FIX_REQUIRED
HUMAN_BLOCKED
```

The reviewer must return complete findings and `remainingDesignBlockers`.

One docs-only correction is authorized after the first `RULE_DESIGN_FIX_REQUIRED`. If the correction review is not `RULE_DESIGN_PASS` with an empty blocker list, stop. No second correction or silent design widening exists.

## 28. Independent Code review

After the final candidate HEAD and both checkout gates are frozen, a fresh independent read-only Code reviewer must inspect:

- exact reviewed design authority;
- exact candidate diff;
- both clean-checkout records;
- raw blobs and worktree bytes;
- attributes and match census;
- D0 regression;
- ownership/routing/profile/registry/selector evidence;
- renormalization evidence;
- typecheck, lint and full ordinary outputs;
- absence of coverage and Hosted execution;
- old H and D2 status;
- actual V1.1 bindings.

It must confirm:

- implementation exactly matches the three-line policy;
- no broad pattern exists;
- no global or shared Git config is required;
- no local/CI normalization workaround exists;
- no existing artifact was renormalized;
- D0 history remains true;
- true and false checkouts use the same exact HEAD;
- existing verifiers pass unchanged;
- no product, test, profile, registry, selector, routing, ownership or workflow file changed;
- the D2 blocker is closed at its repository-byte prerequisite, without claiming D2 closure.

Legal code verdicts:

```text
CODE_REVIEW_PASS
CODE_REVIEW_FIX_REQUIRED
HUMAN_BLOCKED
```

Local closure requires `CODE_REVIEW_PASS` and `remainingBlockers=[]`.

## 29. Independent Rule review

Only after Code review passes, a fresh independent Rule reviewer must verify:

- D2W remains a no-role engineering foundation;
- BOTC rules and product behavior are unchanged;
- event schema and replay meaning are unchanged;
- test identity is unchanged;
- C/C1 and Catalog authority are unchanged;
- rule evidence remains applicable;
- role matrix remains unchanged;
- D2 has not resumed;
- D3 has not started;
- the implementation matches the rule evidence's explicit non-goals.

Legal rule verdicts:

```text
RULE_REVIEW_PASS
RULE_REVIEW_FIX_REQUIRED
HUMAN_BLOCKED
```

Local closure requires `RULE_REVIEW_PASS` and `remainingBlockers=[]`.

No controller-authored combined PASS is permitted.

## 30. Repair accounting

```text
initialImplementationRepairRound=0/2
maximumImplementationRepairRounds=2
thirdRepairAuthorized=false
```

Initial implementation is not a repair round.

A Code- or Rule-review fix that changes either allowlisted implementation file consumes one repair round. Each repair invalidates prior local gates and reviews and requires:

- a new exact HEAD;
- both fresh checkouts;
- all local gates;
- new Code review;
- new Rule review.

After repair round `2/2`, any remaining blocker stops the slice. A need to edit a forbidden file is not a repair; it is a design stop condition.

Documentation-only progress recording after a frozen review is not allowed on the reviewed HEAD.

## 31. Lifecycle

The permitted lifecycle is:

```text
GOVERNANCE_GO
  -> DESIGN_PENDING_REVIEW
  -> RULE_DESIGN_PASS
  -> IMPLEMENTATION_AUTHORIZED
  -> LOCAL_GATES_RECORDED_PENDING_INDEPENDENT_REVIEWS
  -> CODE_REVIEW_PASS
  -> RULE_REVIEW_PASS
  -> LOCAL_CANONICAL_CHECKOUT_BYTE_PORTABILITY_CLOSED
```

At local closure:

```text
D2WStatus=LOCAL_CANONICAL_CHECKOUT_BYTE_PORTABILITY_CLOSED
D2WFinalAccepted=false
frozenD2WHead=<exact externally recorded reviewed HEAD>
coverageExecuted=false
hostedCIExecuted=false
pushPerformed=false
PRCreated=false
D2Resumed=false
D3Started=false
```

Local closure is not repository acceptance and does not satisfy the project merge gate.

## 32. D2 handoff

After successful D2W local closure, the only permitted next action is:

```text
AUTHORIZE_D2_H_REMATERIALIZATION_ON_FROZEN_D2W_BASELINE
```

The next D2 source head must:

- branch from the exact frozen D2W reviewed HEAD;
- use the already reviewed current D2 design;
- rematerialize D2 implementation from that new base;
- rerun all D2 local gates;
- obtain fresh D2 Code and Rule reviews;
- create new exact-H evidence identities;
- treat `0fc4288` only as historical failure evidence.

It must not:

- branch from `0fc4288`;
- cherry-pick old H as accepted implementation;
- inherit old local test results or reviews;
- inherit D2W review verdicts as D2 verdicts;
- claim E2, D-C16A or D-C16B before new exact evidence exists.

D2W closes only:

```text
D2-H-CR-002_WINDOWS_CHECKOUT_CANONICAL_BYTE_PORTABILITY
```

It does not close D2.

## 33. Rollback

Before D2 rematerialization depends on D2W, rollback is a non-history-rewriting revert limited to:

```text
.gitattributes
docs/implementation/phase-3-slice-2b20b-p2f1r-d2w-canonical-checkout-byte-portability-status.md
```

Rollback must not:

- rewrite existing artifact blobs;
- modify Git global or user configuration;
- regenerate routing/profile/Catalog artifacts;
- change verifier or workflow;
- reset or clean the shared dirty worktree;
- rewrite old H or accepted history.

After D2 evidence depends on the contract, `.gitattributes` must not be removed independently. D2 must first be stopped and its canonical input authority re-established through a separately reviewed slice.

## 34. Stop conditions

Stop immediately if any condition occurs:

- rule evidence is no longer `RULE_READY`;
- governance is not `GO`;
- design review is not `RULE_DESIGN_PASS`;
- the implementation branch cannot start from the reviewed design baseline;
- old H becomes an implementation ancestor;
- `.gitattributes` requires any fourth rule;
- existing match count is not exactly two;
- future declared path count is not exactly one;
- Catalog or another forbidden path is matched;
- a target blob differs from its frozen OID or SHA;
- `core.autocrlf=true` checkout does not produce canonical LF target bytes;
- the two checkouts do not use the same exact HEAD;
- any existing artifact appears in the implementation diff;
- renormalized file count is nonzero;
- verifier, workflow, product, test, profile, registry, selector, routing or ownership changes are required;
- local or CI normalization is required;
- global/user-machine Git config must change;
- typecheck, lint, ordinary, runner, ownership, D0 or profile audit fails;
- coverage or Hosted CI is started;
- a third implementation file is required;
- design correction budget or implementation repair budget is exhausted;
- Code or Rule review returns `HUMAN_BLOCKED`;
- the same unresolved failure repeats after the permitted repair boundary;
- D2 or D3 begins before D2W local closure.

A failure must be reported with exact HEAD, checkout, command, exit code and evidence. It must not be hidden by weakening a gate.

## 35. Frozen impact flags

```text
AuthorityStatus=CURRENT_AND_COMPLETE_D2W_DESIGN_AUTHORITY
selectedSolution=A_MINIMAL_REPOSITORY_GITATTRIBUTES_EOL_CONTRACT
selectedAuthority=REPOSITORY_DECLARED_PATH_SCOPED_GIT_ATTRIBUTES
canonicalArtifactCount=3
existingCanonicalArtifactCount=2
futureCanonicalArtifactCount=1
existingAttributesPath=ABSENT_AT_DESIGN_BASE
newAttributesPath=.gitattributes
attributesChanged=true
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
renormalizationRequired=false
renormalizedFileCount=0
normalizationAllowed=false
globalGitConfigRequired=false
coverageExecuted=false
hostedCIExecuted=false
pushPerformed=false
PRCreated=false
D2Resumed=false
D3Started=false
implementationAuthorized=false
designVerdict=PENDING_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW
remainingDesignBlockers=[PENDING_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW]
requiredNextAction=FRESH_INDEPENDENT_D2W_RULE_DESIGN_REVIEW
```

## 36. Terminal

```text
READY_FOR_FRESH_INDEPENDENT_D2W_RULE_DESIGN_REVIEW_V1
```

---

单列交付字段：

```text
designPath=docs/architecture/2B20B-P2F1R-D2W-canonical-checkout-byte-portability-final-design-v1.md
expectedDesignSHA256=<TO_BE_COMPUTED_AFTER_EXACT_MATERIALIZATION>
AuthorityStatus=CURRENT_AND_COMPLETE_D2W_DESIGN_AUTHORITY
designVerdict=PENDING_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW
remainingDesignBlockers=[PENDING_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW]
implementationRepairRound=0/2
implementationAuthorized=false
```
