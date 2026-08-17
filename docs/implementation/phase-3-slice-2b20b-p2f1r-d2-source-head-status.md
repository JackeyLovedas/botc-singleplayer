# Phase 3 Slice 2B20B-P2F1R-D2 final replacement source-head status

## Authorization and adjudication

```text
authorization=USER_AUTHORIZED_2B20B_P2F1R_D2_GITHUB_JOB_IDENTITY_PROVIDER_BOUNDARY_CORRECTION_AND_FRESH_H_LOCAL_CLOSURE
documentKind=PRE_HOSTED_SOURCE_HEAD_STATUS
adjudicationKind=D2T_BASELINE_H_REMATERIALIZATION
newImplementationRepairRoundCreated=false
repairRound3Created=false
newDesignCorrectionCreated=false
newGovernanceResliceCreated=false
newNegativeClassCreated=false
newCriterionCreated=false
newSupportingAuthorityCreated=false
finalJsonBoundaryAdjudicationUsed=false
freshD2TBasedHRematerializationUsed=true
freshD2TBasedHRematerializationAttempt=1/1
implementationBase=d4e211cd1f9221d2ebdeb93743447c09e7721dd2
implementationBranch=phase-3/2b20b-p2f1r-d2-provider-identity-final-h
expectedDirectParent=d4e211cd1f9221d2ebdeb93743447c09e7721dd2
expectedSourceHeadBinding=EXTERNAL_GIT_COMMIT_AFTER_LOCAL_GATES
hostedEvidenceStatus=PENDING_NOT_YET_EXECUTED
D2THead=d4e211cd1f9221d2ebdeb93743447c09e7721dd2
D2TStatus=LOCAL_C15A_EXTERNAL_PROCESS_TIMEOUT_BOUNDARY_CLOSED
```

This document does not self-reference its future source commit. Git resolves the
final source HEAD and direct parent after the sole attributed commit is created.

## Frozen authorities

```text
D2DesignHead=075000fc181ee50a110157f4ce62f89972323c77
D2DesignSHA256=df3f12468460819d3b73585be8846f432a245f5c62f472e1f2ff57bab7f702d7
D2RuleEvidenceHead=418b2fdb1c68578fa279fe915307efb802402247
D2RuleEvidenceSHA256=671827090c071cc1062dd9c2199da09dd27f983b24f80855bc976d9d0eeb6505
D2WFrozenHead=5fe0f4566ac200a710203b95f69ab49e87005530
parentArtifactHeadP=0bf487afc49069f6191dd7409362d5c227aa50dc
parentEvidenceHeadE=15b7e61682d3b34e45401cf132fa1a77b6347c22
settledBaselineHeadS=8898f62ceb90433634cf02e83ad5d4ff95db4499
profileToken=phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1
profileBodySHA256=4f047c39739b22ac0b4a04dda8eddc8125d902a8bcd281d448d8f61626986426
profileArtifactSHA256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
inventory=1712_IDENTITIES_36_PHYSICAL_TEST_FILES
domainCoreRestIdentityCount=503
```

Historical unaccepted H objects remain immutable:

| Head | Disposition |
|---|---|
| `0fc4288c9b0e22787eee3e2c87d7b0c54e432769` | `HISTORICAL_UNACCEPTED_BLOCKED_BY_D2W` |
| `c482b5a52e0c099e9441aba7d6b3e671c5877a54` | `HISTORICAL_UNACCEPTED_T1_ACQUISITION_BOUNDARY_INCOMPLETE` |
| `df9e1c39faad73fcbb597d28092892bf6fdf0b52` | `HISTORICAL_UNACCEPTED_UNTRUSTED_JSON_DEPTH_BOUNDARY_INCOMPLETE` |
| `aed925a6c5edcf05902d6fe8bef1169bfa68fbf2` | `HISTORICAL_LOCALLY_REVIEWED_HOSTED_FAILED_PRE_D2T` |

## Allowlist and behavior boundary

The fresh D2T-based H changes exactly:

1. `.github/workflows/ci.yml`
2. `scripts/verify-p2f1r-d2-publication-evidence.mjs`
3. `docs/implementation/phase-3-slice-2b20b-p2f1r-d2-source-head-status.md`
4. `docs/architecture/2B20B-P2F1R-D2-github-job-identity-provider-boundary-adjudication-v1.md`

The workflow remains byte-identical to the reviewed provider-correction H and
to the reviewed `aed925a6` workflow blob. The verifier is intentionally changed
by the provider identity correction; it is the provider-corrected verifier and
is not claimed to be unchanged from the pre-correction `aed925a6` verifier.
The provider-boundary adjudication document is evidence-only and does not add
a new mechanism. The current verifier, adjudication document, and workflow
match the provider-corrected candidate `873f8b9` blobs; the status document is
the sole semantic correction in this replacement H.

This status document records the verifier correction explicitly:

```text
VERIFIER_INTENTIONALLY_CHANGED_BY_PROVIDER_IDENTITY_CORRECTION
verifierCorrectionBeforeGitBlobOid=ba6c0dc38e5fd6a133e2dad6af90b659d4f68a57
verifierCorrectionAfterGitBlobOid=3892f39469d6adf8801b91b79476af283c55d00c
verifierBlob873f=3892f39469d6adf8801b91b79476af283c55d00c
verifierBlobReplacement=3892f39469d6adf8801b91b79476af283c55d00c
verifierBlobParity=PASS
workflowBlob873f=a33e2b18f5e4e6c39e94fbff090eca5580003425
workflowBlobReplacement=a33e2b18f5e4e6c39e94fbff090eca5580003425
workflowBlobParity=PASS
adjudicationBlob873f=55aa7b45f5a41f46dae43546387b114f8b49699b
adjudicationBlobReplacement=55aa7b45f5a41f46dae43546387b114f8b49699b
adjudicationBlobParity=PASS
statusSemanticDifferenceCount=1
statusSemanticDifference=FALSE_VERIFIER_PARITY_CLAIM_REPLACED_WITH_TRUTHFUL_CORRECTION_STATEMENT
unexpectedSemanticDifferenceCount=0
```

The verifier correction is limited to logical job ID authority, numeric
run-job instance ID authority, provider display-name support-only treatment,
and the related existing negative-class subcases. No production file, test
file, profile, registry, selector, ownership contract, routing contract,
coverage profile, catalog, criterion, supporting authority, verifier mode,
negative class, dependency, or permanent framework changes.

## Preserved JSON resource-boundary contract

The stack exhaustion was at recursive `scanJsonForDuplicateKeys.value()`
before `JSON.parse`. A native `RangeError` escaped `parseJsonBytes` and the
public catch mapped it to `D2_INTERNAL_ERROR / exit 2`.

The reviewed `aed925a6` implementation includes the resource-admission
preflight immediately after strict UTF-8 decoding and before duplicate-key
scanning, `JSON.parse`, schema traversal, canonical serialization, or hash
traversal. This rematerialization does not alter that implementation.

```text
depthAuthoritySource=FROZEN_CLOSED_SCHEMA_CONSTRUCTORS
schemaMaxDepth=5
configuredMaxDepth=5
maxDepthEqualityAudit=PASS
depthScannerRecursive=false
depthScannerBeforeDuplicateScan=true
depthScannerBeforeJsonParse=true
depthScannerBeforeSchemaTraversal=true
depthFailureSemanticCode=D2_TYPE_INVALID
depthFailurePhase=RESOURCE_BOUNDARY_ADMISSION
depthFailureExitCode=1
deepInputLeaksStack=false
semanticFailureBranchCount=1
internalFailureBranchCount=1
knownInputFailuresMappedToExit1=41
knownInputFailuresReachingExit2=0
```

Depth five is derived by iterative traversal of the existing frozen closed
schema constructors and witnesses. The deepest admitted D2 JSON shape is the
existing runner segment-evidence identity/ancestor-path structure. Capture,
acquisition, provider, and final bundle shapes are shallower. The configured
limit is checked against the computed maximum on every self-test and is not an
independent runtime schema authority.

## Preserved acquisition evidence

```text
acquisitionFilesystemSchemaAuthorityCount=1
recursiveAcquisitionValidatorCount=1
shallowAcquisitionPathAuthorityCount=0
acquisitionRootCount=4
requiredRecursivePathCount=25
observedRecursivePathCount=25
missingRecursivePathCount=0
unexpectedRecursivePathCount=0
wrongKindPathCount=0
duplicatePathCount=0
requiredPathMutationCount=25
requiredPathMutationRejectedCount=25
requiredPathMutationInternalErrorCount=0
N2Boundary=7/7
N3Boundary=3/3
N7Boundary=3/3
verifierModeCount=3
negativeClassCount=7
negativeMatrixPass=7/7
unexpectedBehaviorClassCount=0
canonicalSerialization=PASS
```

N2/N3/N7 remain the same seven negative classes. New depth rows belong to the
existing semantic invalid-input family and do not create an eighth class.

## Local gates at materialization time

Node `v24.15.0` and pnpm `11.7.0` were used.

| Gate | Result |
|---|---|
| Verifier modes and negative matrix | PASS — 3 modes, 7/7 classes |
| Schema maximum derivation | PASS — computed 5 |
| Configured/computed equality | PASS — 5 equals 5 |
| Precommit exact-max/string scanner evidence | PASS; exact-HEAD public success rerun required after commit |
| max+1 acquisition-manifest public CLI | PASS — exit 1, `D2_TYPE_INVALID` |
| 12,000-depth provider public CLI | PASS — exit 1, no stack or `D2_INTERNAL_ERROR` |
| Malformed JSON public CLI | PASS — existing semantic exit 1 |
| Duplicate-key public CLI | PASS — existing semantic exit 1 |
| True internal-failure regression | PASS — sanitized `D2_INTERNAL_ERROR`, exit 2 |
| Acquisition root/path census | PASS — 4 roots, 25/25 paths |
| Required-path mutation | PASS — 25/25 rejected, zero internal |
| N2/N3/N7 public boundary | PASS — 7/7, 3/3, 3/3 |
| Canonical serialization | PASS |
| Workflow YAML/topology | PASS — existing workflow/jobs/matrices/triggers |
| Workflow semantic comparison to H3 | PASS — zero difference |
| D2W `.gitattributes` | PASS — 248 bytes, SHA-256 `e04dab79f8142beae706f5fb37ac10fe3e2f08aeeeb719d0adbdeaade4bcbb09` |
| Future bundle attributes | PASS — `text=set`, `eol=lf` |
| Windows/LF canonical-byte evidence | PRESERVED_FROM_D2W_AND_H3; no semantic input reopened |
| P/E/S/design/rule ancestry | PASS |
| Active profile/registry/selector | PASS — unchanged by exact diff |
| Ownership | PASS — 42/42 |
| Routing | PASS — 40/40 |
| Ordinary domain-core-rest | PASS — 503 identities |
| Coverage profile and Catalog | PASS — unchanged by exact diff |
| Test identities | PASS — 1712 identities, 36 files |
| Typecheck | PASS |
| Lint | PASS |
| Full ordinary | PASS — 40 files, 1712 tests |
| A/B/C/C1, events, semantic validators | PASS — unchanged |
| Lifecycle and old-H preservation | PASS |
| Residue | PASS — no `.vitest-test/`, bundle, or temporary fixture retained |

The exact-HEAD standard fixture and exact-max public success cases are required
as local gates after the sole commit, when Git can resolve the current verifier
and workflow blobs at that exact HEAD. No second commit is authorized.

Coverage was forbidden and was not executed.

## Complexity and lifecycle

```text
workflowSemanticDifferenceFromH3=0
unexpectedSemanticDifferences=0
newFilesAddedVsH3=0
newVerifierAdded=0
newVerifierModeCount=0
newNegativeClassCount=0
newSchemaRegistryCount=0
newCriterionCount=0
newSupportingAuthorityCount=0
newFrameworkCount=0
newPermanentConceptCount=0
newTemporaryConceptCount=1
temporaryConcept=RAW_JSON_DEPTH_PREFLIGHT
keepOperationalAssetCount=0
archiveCategoryCount=4
deleteAfterD3CategoryCount=8
hostedArtifactRetentionDays=7
verifierLifecycle=DELETE_AFTER_D3
workflowD2StepsLifecycle=DELETE_AFTER_D3
```

## No-future-facts declaration

No future source commit SHA, hosted run or attempt, job/artifact/log identifier
or digest, E2 SHA, reviewer verdict, merge/tag state, acceptance state, or D3
fact is recorded here. Push, Hosted CI, E2, PR, merge, tag, and D3 have not
occurred.

## Source-head closure status

```text
D2SourceStatus=LOCAL_D2_SOURCE_HEAD_H_CLOSED_PENDING_NEW_EXACT_HEAD_RUN
frozenLocalD2SourceHead=<new H SHA>
D2FinalAccepted=false
```

## Provider job identity correction

This bounded correction addresses only the external provider boundary exposed by
the historical hosted run `31992410503`. GitHub's stable machine identity is
the workflow `job_id` captured as `GITHUB_JOB`/`github.job`, together with the
numeric REST job database ID for the run instance. The provider `name` field is
stored as `providerDisplayName` supporting metadata only; it is not compared,
normalized, truncated, prefixed, or used to decide platform, matrix, or
mechanism match.

```text
priorSuccessfulRunId=31992410503
priorRunDisposition=HISTORICAL_SUCCESSFUL_RUN_BLOCKED_BY_IDENTITY_CONTRACT
providerDisplayNameDisposition=SUPPORTING_PROVIDER_METADATA_ONLY
logicalJobIdentityAuthority=GITHUB_JOB
runJobInstanceIdentityAuthority=GITHUB_REST_NUMERIC_JOB_DATABASE_ID
linuxLogicalJobId=test-shard
linuxMatrixIdentity=domain-core-rest
windowsLogicalJobId=deterministic-windows
workflowChanged=false
workflowBlobParity=REQUIRED_BYTE_IDENTICAL_TO_REVIEWED_H
verifierModeCount=3
negativeClassCount=7
newNegativeClassCount=0
newCriterionCount=0
newSupportingAuthorityCount=0
```

The existing wrong-platform/job-mapping negative class contains the minimal
provider-boundary cases: truncated display with the correct logical job is
accepted; wrong logical ID, wrong platform, and wrong Linux matrix are rejected
closed, including the case where the numeric job ID is otherwise correct.
The old run remains supporting provider-behavior evidence only and is not
promoted to D-C16A primary evidence. No future source SHA, hosted run, artifact,
log, review, E2, merge, tag, or D3 fact is recorded here.
