# Phase 3 Slice 2B20AP2 — Design Release Correction V1

## 1. Metadata

```text
correctionId=2B20AP2-DESIGN-RELEASE-CORRECTION-V1
authorization=USER_AUTHORIZED_2B20AP2_DESIGN_RELEASE_CORRECTION_CONDITIONAL_IMPLEMENTATION_AND_CLOSEOUT
taskType=CI_TEST_INFRASTRUCTURE / NON_PRODUCT
currentLocalHead=d8c85c93a9fad45808e2722e0ea4c1e1e6d07212
parentDesignPath=docs/implementation/phase-3-slice-2b20ap2-design-round-2.md
parentDesignSha256=c10e94186566b399bee42c8ed145e216cc6f4abae819800bd30c407400b50f6c
parentReviewPath=docs/implementation/phase-3-slice-2b20ap2-design-review-round-2.md
parentReviewSha256=d6e13ba8de627dec662eceb4babc92366526ae30aaaa0ece0742bbd65d43b4d7
ruleEvidencePath=docs/rules/evidence/2B20AP2.md
ruleVerdict=RULE_READY
unresolvedRuleConflicts=[]
roleCoverage=Dreamer PARTIAL
designCorrectionKind=AUTHORIZED_APPENDIX_NOT_DESIGN_ROUND_3
exactBlockers=[
  MISSING_GOVERNANCE_V1_1_DESIGN_TRACEABILITY_AND_R_T_CLASSIFICATION,
  VITEST_MERGEABLE_BLOB_AND_SIDECAR_CONTRACT_NOT_FROZEN,
  RUNNER_PNPM_AND_ARTIFACT_ROOT_TRUST_ANCHORS_NOT_EXECUTABLE_AS_DESIGNED
]
behaviorDesignChanged=false
productBehaviorChanged=false
productProductionChanged=false
ruleSemanticsChanged=false
testSemanticsChanged=false
testTitlesChanged=false
logicalTopologyChanged=false
coverageIncludeChanged=false
timeoutChanged=false
dependencyChanged=false
oldProfileChanged=false
acceptedHistoryChanged=false
roleCoverageChanged=false
newVitestProject=false
implementationAuthorized=false
ciRemediationRound=0/2
futureCommitShaRecorded=false
```

The parent Round 2 design and its `HUMAN_BLOCKED` review remain immutable
history. This appendix supersedes only the three blocked contracts named above.
All parent contracts not expressly replaced here remain in force.

Implementation becomes authorized only after a new independent read-only
Design Release Review returns:

```text
designReleaseVerdict=DESIGN_RELEASE_PASS
remainingBlockers=[]
```

## 2. Preserved H1–H4 and non-goals

The following diagnoses remain unchanged:

- H1: `HOSTED_ACCEPTED_HISTORY_UNAVAILABLE_IN_SHALLOW_CHECKOUT`.
- H2: `COVERAGE_PROFILE_STALE_AFTER_AUTHORIZED_PRODUCT_SOURCE_CHANGE`.
- H3: `DREAMER_VORTOX_DURATION_SENSITIVE_WORKER_RPC_OR_SHUTDOWN_FAILURE`.
- H4: `WINDOWS_W7_NONZERO_EXIT_WITHOUT_SAME_PROCESS_GLOBAL_ERROR_CHANNEL`.

This appendix changes no accepted commit, accepted blob, supersession
disposition, or historical hash; ordinary `9`, coverage `11`, or Windows
`W1-W7` logical topology; Dreamer inventory `14/22/10`; either ordinary or
coverage semantic union `1572`; Windows inventory `305`; product production,
events, replay, idempotency, receipts, projections, privacy, historical
knowledge, or rule semantics; tests, assertions, titles, LF identities,
markers, ownership, or supported/unsupported boundary; timeout, dependency,
lockfile, coverage include, or Vitest project count; old profiles or Dreamer
`PARTIAL`; source/profile-child separation; or CI remediation budget `0/2`.
No synthetic or rewritten blob, multi-project topology, new logical group, or
test-identity migration is authorized.

## 3. Executed probe record

### 3.1 Blob and coverage compatibility probe

```text
vitestVersion=3.2.6
ordinary.legacy:
  physicalBlobCount=1
  processExit=0
  singletonPass=14
  singletonSkip=32
ordinary.2B20A:
  physicalBlobCount=1
  processExit=0
  singletonPass=22
  singletonSkip=24
ordinary.gained:
  physicalBlobCount=1
  processExit=0
  singletonPass=10
  singletonSkip=36
ordinary.selectedUnion=46
ordinary.pairwiseSelectedIntersection=0

flatThreeBlobMergeProcessExit=0
mergedTotal=138
mergedPass=42
mergedSkip=96
uniquePassIdentityCount=14
duplicatePassIdentityCount=28
missingExpectedIdentityCount=32
cause=VITEST_TASK_ID_COLLISION_ACROSS_FILTERED_SAME_PROJECT_BLOBS

physicalCoverageBlobCount=12
allPhysicalBlobProcessesExit0=true
flatCoverageMergeRootRegularFiles=12
singletonSelectedIdentityUnion=1572
singletonCrossBlobDuplicateIdentityCount=0
dreamerCoreLogicalCount=36
gainedLogicalCount=10
flatCoverageMergeProducedCoverageMap=true
normalizedCoverageFingerprint:
  sourceFiles=63
  statements=3217
  functions=23
  lines=3217
  branchArms=1809
current11PhysicalCombinedCoreReferenceFingerprint:
  sourceFiles=63
  statements=3217
  functions=23
  lines=3217
  branchArms=1809
fingerprintsEqual=true
```

Multi-blob merged test JSON is not identity, assertion, ownership, or logical
group authority. No global ordinary multi-blob test merge or synthetic
combined Dreamer blob is permitted. Coverage merged test JSON is diagnostic
only; the coverage map becomes authoritative only after all twelve blobs pass
singleton identity and evidence validation. The fingerprint proves probed
source compatibility, not a future exact-source profile delta.

### 3.2 Vitest executable probe

```text
result=PASS
node=24.15.0
vitestPackage=vitest
vitestPackageVersion=3.2.6
publicBin=vitest.mjs
executable=process.execPath
cliPath=absolute validated public package bin
shell=false
windowsRealExecutionExit=0
pnpmUsedByRunner=false
PATHLookupUsedByRunner=false
shellShimUsedByRunner=false
```

### 3.3 Repository and artifact-root probe

```text
result=PASS
gitTopLevelRealpathEqualsCwd=true
fixedRepositoryOwnedRoots=true
lexicalEscapeRejected=true
absoluteExternalPathRejected=true
junctionEscapeRejected=true
segmentIdsEnumerated=true
atomicTemporaryWrite=true
fileFsync=true
atomicRename=true
partialCleanup=true
githubWorkspaceAbsentBranchTested=true
githubWorkspacePresentEquality=pendingHostedExactHeadEvidence
```

## 4. Governance V1.1 contract

### 4.1 Exact existing classifications

Reachability:

- `R1 CURRENTLY_REACHABLE_APPLICATION_PATH`: currently callable formal path;
  here the real runner/workflow path is R1 without becoming application-command
  integration.
- `R2 LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`: accepted historical authority.
- `R3 HOSTILE_OR_CORRUPTED_HISTORY`: malformed, missing, forged, substituted,
  incomplete, or invalid authority fails closed.
- `R4 FUTURE_HYPOTHETICAL_STATE`: no producer, accepted event, or callable
  path creates the behavior.

Trust: `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`, `T2 CANONICAL_DERIVED_STATE`, and
`T3 MODULE_PRIVATE_PURE_CORE`.

The only primary layers, in order, are
`ACCEPTED_STREAM_INTEGRATION`, `APPLICATION_COMMAND_INTEGRATION`,
`LEGACY_REPLAY_COMPATIBILITY`, `HOSTILE_REPLAY_REJECTION`,
`STRUCTURAL_VALIDATION`, `PURE_POLICY_SEAM`, `PROJECTION`, and
`CROSS_PLATFORM_CI`.

For AP2, R4 is empty. Application-command, accepted-stream, hostile-replay, and
projection layers are unused. Direct validators are R3 structural validation;
aggregation/canonicalization cores are T3 pure-policy seams; real runner,
merge, workflow, and exact-head execution is cross-platform CI; accepted
Git/blob/profile compatibility is R2 legacy compatibility.

### 4.2 Supporting-authority notation

`PSA(status, mutation, purpose)` denotes a design-time
`PLANNED_SUPPORTING_AUTHORITY`; status is `ACCEPTED`, `LEGACY`, or `HOSTILE`;
mutation is `NONE` or `CLONE_MUTATED`. It supports but never decides the
primary layer, consumes the current criterion row, and later receives exactly
one unique resolvable `SUP-2B20AP2-NNN`; no physical support ID is frozen now.

### 4.3 Complete nine-field matrix

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `GT-AP2-001` | Accepted commit availability | Required hosted jobs possess the frozen accepted commit before supersession validation. | Real exact-head hosted Git-object gate. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Availability passes without verifier-side fetch. | `PSA(LEGACY,NONE,frozen accepted commit)` |
| `GT-AP2-002` | Unavailable is not non-ancestor | A fixture lacking the object returns only `SUPERSESSION_ACCEPTED_HISTORY_UNAVAILABLE`. | Direct missing-object fixture. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Exact unavailable code; no ancestry/blob check. | `PSA(HOSTILE,CLONE_MUTATED,missing-object graph)` |
| `GT-AP2-003` | True non-ancestor is distinct | A present commit without ancestry returns only `SUPERSESSION_ACCEPTED_HEAD_NOT_ANCESTOR`. | Direct ancestry fixture. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Exact non-ancestor code. | `PSA(HOSTILE,CLONE_MUTATED,non-ancestor graph)` |
| `GT-AP2-004` | Accepted blob retains meaning | Frozen commit/file resolves to frozen blob/content identity. | Accepted-history compatibility check. | `R2` | `T1` | `LEGACY_REPLAY_COMPATIBILITY` | Accepted blob passes byte-identically. | `PSA(LEGACY,NONE,frozen accepted blob)` |
| `GT-AP2-005` | Blob substitution fails closed | Altered content returns only `SUPERSESSION_ACCEPTED_BLOB_MISMATCH`. | Direct blob-identity fixture. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Exact mismatch code. | `PSA(HOSTILE,CLONE_MUTATED,substituted blob)` |
| `GT-AP2-006` | Ordinary legacy remains 14 | Legacy segment executes 14 identities once. | Real ordinary legacy subprocess. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Selected/pass 14; exit 0; zero global errors. | `PSA(ACCEPTED,NONE,legacy inventory)` |
| `GT-AP2-007` | Ordinary 2B20A remains 22 | 2B20A segment executes 22 identities once. | Real ordinary 2B20A subprocess. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Selected/pass 22; exit 0; zero global errors. | `PSA(ACCEPTED,NONE,2B20A inventory)` |
| `GT-AP2-008` | Ordinary gained remains 10 | Gained segment executes 10 identities once. | Real ordinary gained subprocess. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Selected/pass 10; exit 0; zero global errors. | `PSA(ACCEPTED,NONE,gained inventory)` |
| `GT-AP2-009` | Dreamer ordinary union remains 46 | Pure union returns 46 with no overlap/gap. | T3 identity-set aggregation. | `R1` | `T3` | `PURE_POLICY_SEAM` | `14+22+10=46`; discrepancies empty. | `PSA(ACCEPTED,NONE,validated segment evidence)` |
| `GT-AP2-010` | Ordinary remains 11 physical to 9 logical | Eleven singleton blobs and nine manifests yield union 1572. | Singleton executions plus hosted manifest gate; no global test merge. | `R1` | `T1` | `CROSS_PLATFORM_CI` | `11->9`, union 1572, zero discrepancy. | `PSA(ACCEPTED,NONE,ordinary singleton evidence)` |
| `GT-AP2-011` | Coverage legacy remains 14 | Coverage legacy executes 14 once. | Real coverage legacy subprocess. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Selected/pass 14; coverage available. | `PSA(ACCEPTED,NONE,legacy coverage inventory)` |
| `GT-AP2-012` | Coverage 2B20A remains 22 | Coverage 2B20A executes 22 once. | Real coverage 2B20A subprocess. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Selected/pass 22; coverage available. | `PSA(ACCEPTED,NONE,2B20A coverage inventory)` |
| `GT-AP2-013` | Coverage core remains 36 | Pure union of legacy and 2B20A returns 36. | T3 coverage-core aggregation. | `R1` | `T3` | `PURE_POLICY_SEAM` | `14+22=36`; discrepancies empty. | `PSA(ACCEPTED,NONE,validated core evidence)` |
| `GT-AP2-014` | Gained coverage remains independent 10 | Existing gained group executes 10 and is not absorbed. | Real gained coverage subprocess. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Pass 10; ownership unchanged. | `PSA(LEGACY,NONE,gained coverage authority)` |
| `GT-AP2-015` | Coverage remains 12 physical to 11 logical | Twelve singleton authorities pass and coverage-only merge produces map. | Exact-head coverage merge and manifest gate. | `R1` | `T1` | `CROSS_PLATFORM_CI` | `12->11`, union 1572, core 36, gained 10, no loss/wrong owner. | `PSA(ACCEPTED,NONE,coverage blobs and maps)` |
| `GT-AP2-016` | W7 legacy remains 14 | W7 legacy executes 14 in its own process. | Hosted Windows legacy execution. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Pass 14; exit 0; zero global errors. | `PSA(ACCEPTED,NONE,W7 legacy inventory)` |
| `GT-AP2-017` | W7 2B20A remains 22 | W7 2B20A executes 22 in its own process. | Hosted Windows 2B20A execution. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Pass 22; exit 0; zero global errors. | `PSA(ACCEPTED,NONE,W7 2B20A inventory)` |
| `GT-AP2-018` | W7 gained remains 10 | W7 gained executes 10 in its own process. | Hosted Windows gained execution. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Pass 10; exit 0; zero global errors. | `PSA(ACCEPTED,NONE,W7 gained inventory)` |
| `GT-AP2-019` | W7 remains one logical group | W7 union is 46 and W1-W7 remains 305. | T3 W7 aggregation. | `R1` | `T3` | `PURE_POLICY_SEAM` | W7 46; Windows 305; no discrepancy. | `PSA(ACCEPTED,NONE,validated W1-W7 reports)` |
| `GT-AP2-020` | Failed segment retains evidence | Fault process produces failure envelope and is merge-ineligible. | Real runner failure execution. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Failed blob is retained as evidence but excluded from merge authority. | `PSA(HOSTILE,CLONE_MUTATED,failing process)` |
| `GT-AP2-021` | Malformed sidecar is not authority | Missing/malformed/mismatched/substituted/linked record fails. | Reporter-record schema/path/hash fixtures. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Exact sidecar code; ineligible. | `PSA(HOSTILE,CLONE_MUTATED,hostile reporter records)` |
| `GT-AP2-022` | Global errors are same-process facts | Reporter captures public completion error channel without diagnostic rerun. | Same-process reporter execution. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Error copied to envelope; nonzero. | `PSA(HOSTILE,CLONE_MUTATED,global-error injection)` |
| `GT-AP2-023` | Real exit remains authoritative | Assertions pass but process exits 1. | Real exit-path execution. | `R1` | `T1` | `CROSS_PLATFORM_CI` | `SUBRUN_NONZERO_EXIT`; failed. | `PSA(HOSTILE,CLONE_MUTATED,exit-1 process)` |
| `GT-AP2-024` | Direct Vitest trust anchor works | Validated public 3.2.6 bin runs with `process.execPath`, shell false. | Real Linux/Windows execution. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Pinned CLI executes both platforms. | `PSA(ACCEPTED,NONE,installed Vitest package)` |
| `GT-AP2-025` | Unsafe Vitest anchor fails early | Unsafe package/bin/version fails before inventory. | Direct package/bin validator fixtures. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Exact trust failure; no run. | `PSA(HOSTILE,CLONE_MUTATED,unsafe package layouts)` |
| `GT-AP2-026` | Hosted repository root is exact | Git/cwd/module/workspace agree by realpath. | Real hosted root gate. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Equality passes Linux/Windows. | `PSA(ACCEPTED,NONE,actual checkout root)` |
| `GT-AP2-027` | Hostile repository root fails | Wrong/missing/mismatched/linked/escaped root rejected. | Root-validator fixtures. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | No artifact/process starts. | `PSA(HOSTILE,CLONE_MUTATED,invalid roots)` |
| `GT-AP2-028` | Fixed artifact roots work | Every mode writes only enumerated root. | Real root creation/write/verify gate. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Fixed roots pass. | `PSA(ACCEPTED,NONE,fixed root map)` |
| `GT-AP2-029` | Hostile artifact paths fail | External/traversal/invalid/link/unexpected paths rejected. | Path/root fixtures. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | No out-of-root write/delete. | `PSA(HOSTILE,CLONE_MUTATED,path attacks)` |
| `GT-AP2-030` | Raw blob remains opaque | Name/type/size/hash/binding/placement validate without rewrite. | Direct blob metadata/path/hash validator. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Invalid blob rejected. | `PSA(HOSTILE,CLONE_MUTATED,hostile blob fixtures)` |
| `GT-AP2-031` | Reporter record has exact schema | Exact keys/types/identity/process/tasks/errors validate. | Direct reporter-record validator. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Extra/missing/mismatch rejected. | `PSA(HOSTILE,CLONE_MUTATED,reporter schema fixtures)` |
| `GT-AP2-032` | Manifest/envelope schemas are exact | Segment/logical/global evidence closed schemas and links validate. | Direct schema/cross-link validators. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Malformed/inconsistent rejected. | `PSA(HOSTILE,CLONE_MUTATED,manifest fixtures)` |
| `GT-AP2-033` | Canonical stable projection is deterministic | Pure projection omits ephemeral fields and canonicalizes. | T3 canonical serializer comparison. | `R1` | `T3` | `PURE_POLICY_SEAM` | Semantic equality is byte equality. | `PSA(ACCEPTED,NONE,validated evidence objects)` |
| `GT-AP2-034` | Merge eligibility is closed policy | Pure policy admits only complete success tuples. | T3 exhaustive-union policy test. | `R1` | `T3` | `PURE_POLICY_SEAM` | Only complete success eligible. | `NONE` |
| `GT-AP2-035` | Old profile remains immutable | Old ID/head/tuples/hashes/bytes unchanged. | Accepted profile compatibility audit. | `R2` | `T1` | `LEGACY_REPLAY_COMPATIBILITY` | Old profile byte-identical. | `PSA(LEGACY,NONE,old profile)` |
| `GT-AP2-036` | Profile metadata cannot conflate commits | Invalid source/child/non-append mutation fails. | Direct profile metadata validator. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Invalid separation rejected. | `PSA(HOSTILE,CLONE_MUTATED,invalid profile records)` |
| `GT-AP2-037` | Source and child commits remain separate | Git proves child descends/names source and is not sourceHead. | Exact-head Git topology gate. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Source/child/registry/workflow agree. | `PSA(ACCEPTED,NONE,source-child graph)` |
| `GT-AP2-038` | Profile delta is deterministic | Pure comparison returns canonical added/removed/unchanged/source sets. | T3 delta comparator. | `R1` | `T3` | `PURE_POLICY_SEAM` | Reordered input identical. | `PSA(LEGACY,NONE,validated profiles)` |
| `GT-AP2-039` | Delta has exact-source proof | Exact-source coverage proves no disappeared source/lost hit. | Hosted exact-source profile audit. | `R1` | `T1` | `CROSS_PLATFORM_CI` | PASS or insufficient-evidence code. | `PSA(ACCEPTED,NONE,exact-source coverage)` |
| `GT-AP2-040` | Linux exact-head execution is required | Complete Linux workflow runs reviewed HEAD. | GitHub-hosted Linux exact-head CI. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Required Linux jobs succeed. | `PSA(ACCEPTED,NONE,Linux run artifacts)` |
| `GT-AP2-041` | Windows exact-head execution is required | Windows runs W1-W7 and same-process evidence. | GitHub-hosted Windows exact-head CI. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Required Windows jobs succeed. | `PSA(ACCEPTED,NONE,Windows run artifacts)` |
| `GT-AP2-042` | Forbidden product/authority diff is empty | Allowlist proves prohibited surfaces unchanged. | Hosted repository diff gate. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Forbidden diff empty; Dreamer `PARTIAL`. | `PSA(LEGACY,NONE,frozen base and role matrix)` |

```text
R1=GT-AP2-001,006-020,022-024,026,028,033-034,037-042
R2=GT-AP2-004,035
R3=GT-AP2-002,003,005,021,025,027,029-032,036
R4=[]
```

## 5. Physical and logical topology

### 5.1 Ordinary

Logical groups are exactly:

```text
domain-core-rebuild
domain-core-rest
application
application-service-core
application-service-role-actions
application-service-information-and-later-actions
application-service-compatibility-and-failure-boundaries
application-service-dreamer-vortox
engines-and-projections
```

Physical IDs are exactly:

```text
domain-core-rebuild--full
domain-core-rest--full
application--full
application-service-core--full
application-service-role-actions--full
application-service-information-and-later-actions--full
application-service-compatibility-and-failure-boundaries--full
application-service-dreamer-vortox--legacy
application-service-dreamer-vortox--2b20a
application-service-dreamer-vortox--gained
engines-and-projections--full
```

Each blob is consumed by exactly one singleton `--merge-reports`; no ordinary
invocation receives two blobs. Authority flows reporter record → parent segment
envelope → singleton consistency → logical manifest → T3 union of nine
manifests. There is no global ordinary test merge or authoritative
`merged-tests.json`. Required:
`physicalBlobs=11`, `logicalGroups=9`, `selectedIdentityUnion=1572`,
`crossPhysicalDuplicateSelectedIdentityCount=0`, `missingIdentityCount=0`,
`unexpectedIdentityCount=0`.

### 5.2 Coverage

Logical groups are exactly:

```text
domain-core-rebuild
domain-core-rest
application
application-service-core
application-service-role-actions
application-service-information-and-later-actions-base
application-service-information-and-later-actions-a3b2
application-service-compatibility-and-failure-boundaries
application-service-dreamer-vortox-core
application-service-dreamer-vortox-gained
engines-and-projections
```

Physical IDs are exactly:

```text
domain-core-rebuild--full
domain-core-rest--full
application--full
application-service-core--full
application-service-role-actions--full
application-service-information-and-later-actions-base--full
application-service-information-and-later-actions-a3b2--full
application-service-compatibility-and-failure-boundaries--full
application-service-dreamer-vortox-core--legacy
application-service-dreamer-vortox-core--2b20a
application-service-dreamer-vortox-gained--full
engines-and-projections--full
```

Every blob first receives a singleton diagnostic merge. The same twelve
immutable blobs are then copied byte-for-byte to a flat coverage-only root,
named `<physical-id>.blob`. That root contains exactly twelve regular blobs and
nothing else. Coverage map is authoritative after fingerprint/obligation
validation; merged test JSON is diagnostic only. Required: `12->11`, union
`1572`, core `36`, gained `10`, cross-physical duplicate/missing/unexpected/
wrong-owner/lost-prior-hit/duplicate-coverage-identity all `0`, and
`coverageMapAvailable=true`.

### 5.3 Windows

W1-W6 remain unchanged. W7 physical IDs are `W7--legacy`, `W7--2b20a`, and
`W7--gained`. Each has one singleton merge; T3 union forms logical W7. No
multi-blob W7 test merge. Counts remain `W1=9`, `W2=90`, `W3=52`, `W4=73`,
`W5=9`, `W6=26`, `W7=46`, total `305`, W7 physical `3`, logical `1`.

## 6. Fixed repository roots

The runner accepts no artifact-root argument.

```text
ORDINARY_SEGMENT_ROOT=.vitest-test/segmented
ORDINARY_GLOBAL_ROOT=.vitest-test/segmented-global
COVERAGE_SEGMENT_ROOT=.vitest-coverage/segmented
COVERAGE_GLOBAL_ROOT=.vitest-coverage/segmented-global
WINDOWS_SEGMENT_ROOT=.vitest-windows-application/segmented
```

```text
<segment-root>/<logicalGroupId>/
  physical-blobs/
  reporter-records/
  singleton-input/<physicalBlobId>/
  singleton-raw-reports/
  singleton-diagnostics/
  segment-evidence/
  coverage/<physicalBlobId>/        # coverage only
  logs/
  logical-manifest.json
  verification.json

.vitest-test/segmented-global/
  incoming-blobs/
  incoming-evidence/
  logical-manifests/
  global-manifest.json
  verification.json

.vitest-coverage/segmented-global/
  incoming-blobs/
  incoming-evidence/
  singleton-diagnostics/
  logical-manifests/
  coverage-merge-input/
  coverage-merge-work/
  coverage-output/coverage-final.json
  merged-test-diagnostic.json
  global-manifest.json
  verification.json
```

No sidecar, envelope, manifest, log, or JSON diagnostic enters a merge root.

## 7. Root trust and cleanup algorithm

Before any operation: (1) run `git rev-parse --show-toplevel` without shell;
(2) realpath it; (3) require cwd realpath equality; (4) require runner under
`<repo>/scripts`; (5) require regular `package.json`, `pnpm-lock.yaml`, and
`vitest.workspace.ts`; (6) when present require `GITHUB_WORKSPACE` realpath
equality; (7) resolve fixed root lexically and through nearest existing
ancestor realpath; (8) require strict repository containment; (9) reject
symlink, junction, reparse/case-folded escape, `..`, absolute override, and
wrong type.

Cleanup validates each ancestor; never follows a link; deletes only exact
enumerated files or exact physical-ID directories; deletes deepest-first;
rejects unexpected entries; never recursively deletes caller input; removes
stale `.tmp` only at exact authorized paths; and removes stale final blobs or
envelopes only during initialization of their exact fixed root.

## 8. Vitest executable contract

Resolution is ordered: (1) `createRequire(import.meta.url).resolve(
"vitest/package.json")`; (2) realpath package JSON/root; (3) exact name
`vitest`; (4) exact version `3.2.6`; (5) exact public `bin.vitest=vitest.mjs`;
(6) resolve bin relative to real package root; (7) require it within both real
package root and repository-owned installed dependency tree; (8) require
regular readable file; (9) invoke by `process.execPath`, discrete argv,
repository cwd, `shell:false`, `windowsHide:true`; (10) strict `--version`
token equals `3.2.6`; (11) `process.versions.node === "24.15.0"`.

The runner must not invoke pnpm, pnpm.cmd, npx, corepack, PATH lookup, shell
strings, or `shell=true`. Workflow installation may continue using pinned
setup actions and `pnpm install --frozen-lockfile`; runner subprocesses may not.

## 9. Runner CLI

Only these forms are accepted, with exact argument order and no artifact-root
or output-directory argument:

```text
node scripts/run-vitest-logical-group.mjs --self-test
node scripts/run-vitest-logical-group.mjs run --mode ordinary --logical-group-id <ordinary enum>
node scripts/run-vitest-logical-group.mjs run --mode coverage --logical-group-id <coverage enum>
node scripts/run-vitest-logical-group.mjs run --mode windows --logical-group-id W7
node scripts/run-vitest-logical-group.mjs verify --mode ordinary --logical-group-id <ordinary enum>
node scripts/run-vitest-logical-group.mjs verify --mode coverage --logical-group-id <coverage enum>
node scripts/run-vitest-logical-group.mjs verify --mode windows --logical-group-id W7
node scripts/run-vitest-logical-group.mjs aggregate --mode ordinary
node scripts/run-vitest-logical-group.mjs aggregate --mode coverage
```

Windows accepts only W7. Missing, duplicate, reordered, positional, short,
combined, unknown, or extra arguments fail before root mutation. A logical run
executes physical IDs in frozen order. Dreamer/W7 continue gathering obtainable
evidence after a segment failure and exit nonzero.

## 10. Exact Vitest commands

Executable is `process.execPath`. Physical argv starts with validated
`vitest.mjs`, `run`,
`--workspace=vitest.workspace.ts`, frozen project/file/pattern arguments, then:

```text
--reporter=blob
--reporter=<repo>/scripts/run-vitest-logical-group.mjs
--outputFile.blob=<fixed absolute blob path>
```

Coverage adds `--coverage`, `--coverage.include=packages/*/src/**/*.ts`,
`--coverage.reporter=json`, and
`--coverage.reportsDirectory=<fixed absolute physical directory>`. Controlled
environment overwrites exactly `VITEST_MAX_FORKS=1`, `FORCE_COLOR=0`,
`NO_COLOR=1`,
`BOTC_VITEST_REPORTER_RECORD`, `BOTC_VITEST_COMMAND_IDENTITY`,
`BOTC_VITEST_MODE`, `BOTC_VITEST_LOGICAL_GROUP_ID`,
`BOTC_VITEST_PHYSICAL_BLOB_ID`, and `BOTC_VITEST_SEGMENT_ID`.
Those BOTC values are respectively the fixed absolute reporter-record path,
64-lowercase-hex command identity, `ordinary|coverage|windows`, exact logical
enum, exact physical enum, and `full|legacy|2b20a|gained`.

Singleton merge uses validated public bin,
preceded by `process.execPath`, `--merge-reports=<one-file fixed directory>`,
`--reporter=json`, and `--outputFile=<fixed raw report>`;
source/staged hashes match before and after. Coverage global merge uses the
validated bin preceded by `process.execPath`,
`--merge-reports=<fixed flat twelve-blob directory>`, `--coverage`,
`--coverage.reporter=json`, fixed reports directory, `--reporter=json`, and
fixed diagnostic output. Only the validated coverage map is atomically
promoted; diagnostic merged-test JSON is never authority.

## 11. Stable command identity

`commandIdentity` is SHA-256 of canonical UTF-8 JSON with exactly, in order:
`schemaVersion`, `mode`, `logicalGroupId`, `physicalBlobId`, `segmentId`,
`workspace`, `projects`, `files`, `testNamePattern`, `coverageEnabled`,
`coverageInclude`, `reporters`, `normalizedOutputPaths`, `nodeVersion`,
`vitestVersion`. Paths are repository-relative `/`; root is `<repo-root>`;
arrays retain argv order; absent pattern is null; JSON is two-space/LF/one
terminal LF; hash is lowercase hex. PID, clock, duration, nonce, randomness,
platform paths, locale, and environment order are excluded. Random nonce is
removed; fixed initialization, exclusive creation, cross-links, PID, identity,
and record hash prevent stale substitution.

## 12. Exact evidence schemas

### 12.1 Same-process reporter record

Schema `botc-vitest-same-process-record-v1`; exact keys:
`schemaVersion`, `commandIdentity`, `mode`, `logicalGroupId`,
`physicalBlobId`, `segmentId`, `reporterProcess`, `taskResults`,
`globalErrors`. Reporter process has positive `pid`, node `24.15.0`,
platform, arch. Task entries have identity
`[project,file,ancestorPath,title]` and state `PASS|FAIL|SKIP|TODO`.
Global errors have contiguous index, type, name, message, redactedStack.
Reporter uses only public `onFinished(files, errors)` and performs no
subprocess, stdout parsing, network, unknown-object enumeration,
getter/proxy traversal, or rerun.

### 12.2 Normalized singleton diagnostic

Schema `botc-vitest-singleton-diagnostic-v1`; exact keys:
`schemaVersion`, `commandIdentity`, `physicalBlobId`, `rawReportPath`,
`rawReportSha256`, `total`, `passed`, `failed`, `skipped`, `todo`,
`taskIdentities`, `result`. Result is `CONSISTENT|INCONSISTENT`. Filtered
segments may report all 46 with complement skips; validation uses frozen
expected sets, not pass position/task ID.

### 12.3 Final segment evidence envelope

Schema `botc-vitest-segment-evidence-v1`; exact keys:
`schemaVersion`, `commandIdentity`, `mode`, `logicalGroupId`,
`physicalBlobId`, `segmentId`, `command`, `runtime`, `process`,
`reporterRecord`, `taskEvidence`, `globalErrors`, `blob`,
`singletonDiagnostic`, `coverage`, `stdout`, `stderr`, `evidenceStatus`,
`mergeEligibility`, `failureCodes`.

Command records executable, validated CLI path, normalized args, `<repo-root>`
cwd, controlled environment, with exact keys `executable`, `cliPath`, `args`,
`cwd`, `controlledEnvironment`. Runtime exact keys are `node`, `vitest`,
`platform`, `arch`. Process exact keys are `pid`, `exitCode`, `signal`,
`spawnError`, `startedAtUnixMs`, `endedAtUnixMs`, `wallDurationMs`: PID is
positive integer or null; exit integer or null; signal string or null;
spawnError safe object or null; times and duration nonnegative integers.
Reporter record exact keys are `path`, `sha256`, `status`, with status
`AVAILABLE|MISSING|INVALID` and hash 64-hex or null. Blob exact keys are
`path`, `sha256`, `bytes`, `status`, with hash/bytes nullable and status
`AVAILABLE|MISSING|INVALID`; singleton diagnostic exact keys are `path`,
`sha256`, `status`, with status `AVAILABLE|MISSING|INVALID`.
Coverage exact keys are `path`, `sha256`, `status`, whose status includes
`AVAILABLE|NOT_APPLICABLE|MISSING|INVALID`. Logs exact keys are `path`,
`sha256`, `bytes`, `truncated`. Task evidence is null until reporter and
singleton both validate; then exact keys are `expectedSelectedIdentities`,
`observedSelectedIdentities`, `filteredComplementIdentities`, `counts`, and
`singletonConsistency:"CONSISTENT"`; counts contain selected, passed, failed,
skipped, todo, complementSkipped.
Global errors are null until reporter validates and otherwise copied exactly,
never inferred from logs. Evidence status is `COMPLETE`,
`EVIDENCE_INCOMPLETE`, or `COVERAGE_EVIDENCE_INCOMPLETE`.

Missing reporter/blob/coverage, spawn failure, nonzero exit, signal, malformed
singleton, failed assertion, selected skip/TODO, global error, or inconsistent
hash still produces a final envelope with unavailable fields nullable and
`mergeEligibility=false`.

### 12.4 Logical manifest

Schema `botc-vitest-logical-manifest-v1`; exact keys: `schemaVersion`, `mode`,
`logicalGroupId`, `expectedPhysicalBlobIds`, `segmentEvidence`,
`selectedIdentities`, `totals`, `discrepancy`, `evidenceStatus`,
`mergeEligibility`, `failureCodes`. Discrepancy has intersection, missing,
unexpected, duplicate. Authority derives only from validated final envelopes.

### 12.5 Global manifest

Schema `botc-vitest-global-manifest-v1`; exact keys: `schemaVersion`, `mode`,
`expectedLogicalGroupIds`, `expectedPhysicalBlobIds`, `logicalManifests`,
`selectedIdentities`, `topology`, `discrepancy`, `coverage`, `result`,
`failureCodes`. Topology records physical/logical counts. Coverage records
closed status, final path/hash/fingerprint, diagnostic path/hash, and
`mergedTestDiagnosticAuthority:false`.

The global `topology` exact keys are `physicalBlobCount` and
`logicalGroupCount`. Its `coverage` exact keys are `status`,
`coverageFinalPath`, `coverageFinalSha256`, `normalizedFingerprint`,
`mergedTestDiagnosticPath`, `mergedTestDiagnosticSha256`, and
`mergedTestDiagnosticAuthority`; status is
`NOT_APPLICABLE|AVAILABLE|INVALID`, and authority is always false.

### 12.6 Canonical stable projection

Production envelopes retain real evidence. Stable projection contains exactly
`schemaVersion`, `commandIdentity`, `mode`, `logicalGroupId`,
`physicalBlobId`, `segmentId`, `taskEvidence`, `globalErrors`,
`evidenceStatus`, `mergeEligibility`, `failureCodes`; it excludes platform,
arch, PID, timestamps, duration, logs, and artifact paths/hashes/bytes.
Determinism compares this projection. Full-envelope tests inject fixed clock,
process adapter, paths, and bytes.

## 13. Canonical JSON and artifact publication

Repository JSON has closed keys, UTF-8, two-space indentation, LF, one terminal
LF, code-unit sorting, and no locale or enumeration/random/clock identity.
Atomic publication exclusively creates sibling `.tmp`, writes, fsyncs, closes,
same-directory renames, validates final hash, and on failure removes only that
exact validated temporary file. Raw blobs are never modified or rewritten.

## 14. Merge and identity algorithms

Segment authority is ordered: (1) resolve frozen identities; (2) execute real
Vitest with both reporters; (3) secure raw reporter record; (4) record real
exit/signal/spawn/time/logs; (5) validate/hash opaque blob; (6) copy it
byte-identically to one-file singleton root; (7) verify source/staged hashes;
(8) run singleton JSON merge; (9) cross-validate reporter, singleton, and
expected identities; (10) build final envelope; (11) admit only the complete
success tuple. Singleton JSON never overrides same-process evidence.

Ordinary: Dreamer pure union is 46; nine manifests pure-union to 1572; no
multi-blob merge. Coverage: core union 36, gained 10, eleven manifests union
1572, twelve immutable blobs produce one coverage map whose test JSON is
diagnostic. W7: three independent processes/envelopes pure-union to 46 and
W1-W7 total 305; no rerun replaces first-process evidence.

## 15. Merge eligibility

A segment is eligible only when: expected set valid; process started;
`exitCode=0`; signal and spawnError null; reporter AVAILABLE; commandIdentity,
mode, logical group, physical blob, and segment match; reporter PID matches;
selected count exact; every selected identity PASS; no selected
FAIL/SKIP/TODO; global errors empty; blob AVAILABLE with valid
name/type/size/hash; singleton AVAILABLE and CONSISTENT; required coverage
AVAILABLE; stdout/stderr complete; and failureCodes empty. Logical eligibility requires every
expected physical ID exactly once, all eligible, and discrepancy-free union.
Coverage global staging occurs only after all twelve checks pass.

## 16. Exhaustive public failure codes

```text
SUPERSESSION_ACCEPTED_HISTORY_UNAVAILABLE
SUPERSESSION_ACCEPTED_HEAD_NOT_ANCESTOR
SUPERSESSION_ACCEPTED_BLOB_MISMATCH
GIT_COMMAND_FAILED
LOGICAL_GROUP_INVALID_ARGUMENTS
UNKNOWN_MODE
UNKNOWN_LOGICAL_GROUP
UNKNOWN_PHYSICAL_BLOB
NODE_VERSION_MISMATCH
VITEST_PACKAGE_NOT_FOUND
VITEST_PACKAGE_INVALID
VITEST_PACKAGE_VERSION_MISMATCH
VITEST_PUBLIC_BIN_INVALID
VITEST_PUBLIC_BIN_ESCAPE
VITEST_VERSION_MISMATCH
REPOSITORY_ROOT_INVALID
GITHUB_WORKSPACE_MISMATCH
ARTIFACT_ROOT_INVALID
ARTIFACT_ROOT_NOT_EMPTY
ARTIFACT_PATH_ESCAPE
ARTIFACT_SYMLINK
ARTIFACT_JUNCTION
ARTIFACT_UNEXPECTED_ENTRY
ARTIFACT_CLEANUP_FAILED
INVALID_SEGMENT_ID
INVENTORY_LIST_FAILED
INVENTORY_COUNT_MISMATCH
INVENTORY_OVERLAP
INVENTORY_MISSING
INVENTORY_UNEXPECTED
SUBRUN_SPAWN_FAILED
SUBRUN_NONZERO_EXIT
SUBRUN_SIGNALLED
ASSERTION_FAILURE
SELECTED_TEST_SKIPPED
SELECTED_TEST_TODO
GLOBAL_ERROR
COVERAGE_MISSING
SIDECAR_MISSING
SIDECAR_EXTRA
SIDECAR_RENAMED
SIDECAR_PARSE_FAILED
SIDECAR_SCHEMA_INVALID
SIDECAR_COMMAND_IDENTITY_MISMATCH
SIDECAR_PROFILE_MISMATCH
SIDECAR_LOGICAL_GROUP_MISMATCH
SIDECAR_PHYSICAL_BLOB_MISMATCH
SIDECAR_SEGMENT_MISMATCH
SIDECAR_PROCESS_MISMATCH
MERGEABLE_BLOB_MISSING
MERGEABLE_BLOB_EXTRA
MERGEABLE_BLOB_RENAMED
MERGEABLE_BLOB_INVALID
MERGEABLE_BLOB_HASH_MISMATCH
SINGLETON_STAGE_COLLISION
SINGLETON_STAGE_HASH_MISMATCH
SINGLETON_MERGE_FAILED
SINGLETON_REPORT_INVALID
SINGLETON_IDENTITY_MISMATCH
SINGLETON_ASSERTION_MISMATCH
RAW_DIAGNOSTIC_NOT_AUTHORITY
MULTI_BLOB_TEST_IDENTITY_AUTHORITY_FORBIDDEN
LOGICAL_MANIFEST_INVALID
LOGICAL_IDENTITY_OVERLAP
LOGICAL_IDENTITY_MISSING
LOGICAL_IDENTITY_UNEXPECTED
LOGICAL_IDENTITY_DUPLICATE
ORDINARY_GLOBAL_TEST_MERGE_FORBIDDEN
COVERAGE_MERGE_ROOT_INVALID
COVERAGE_GLOBAL_MERGE_FAILED
COVERAGE_MAP_MISSING
COVERAGE_FINGERPRINT_MISMATCH
COVERAGE_OBLIGATION_LOSS
MERGED_TEST_REPORT_AUTHORITY_FORBIDDEN
VERIFICATION_FAILED
PROFILE_SOURCE_HEAD_INVALID
PROFILE_CHILD_AS_SOURCE_HEAD
PROFILE_NOT_APPEND_ONLY
PROFILE_DELTA_EVIDENCE_INSUFFICIENT
ATOMIC_WRITE_FAILED
PARTIAL_ARTIFACT_PRESENT
INTERNAL_ERROR
```

Exit meanings are 0 complete PASS; 20 CLI/version/root; 21 inventory; 22
process/reporter/blob/singleton/assertion/error/segment coverage; 23 aggregate/
coverage/profile; 24 internal/cleanup/atomic. Retain all codes and choose
severity `24>23>22>21>20`.

## 17. Workflow contract

Hosted `validate`, ordinary merge/semantic, and coverage merge/semantic jobs
use:

```yaml
with:
  fetch-depth: 0
```

Verifier-side fetch is forbidden. Physical jobs attach both reporters and
upload separate opaque blob plus reporter/envelope/log diagnostics with
`if: always()`; a final verifier reasserts the real authoritative failure.
Ordinary aggregation downloads exactly eleven
blobs/evidence, revalidates singleton authority, builds nine manifests, and
never runs global Vitest test merge. Coverage downloads twelve, validates
singleton/logical authority, builds flat coverage root, runs coverage merge
once, treats merged tests as diagnostic, and validates map/fingerprint/
ownership/obligations. W7 runs three processes, retains all evidence, never
reruns diagnostically, and verifies 46/305.

## 18. Coverage profile and commit separation

Old profile `phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2` is immutable.
Source implementation commit contains no new profile/switch. Only after it
exists may an append-only child create
`phase-3-slice-2b20ap2-<sourceHead first 7 hex>-hosted-execution-v1`, recording
full source SHA; child SHA is not sourceHead. Audit records complete old/new
tuples and proves no source disappeared; no prior hit became zero; every added
obligation traces to authorized source or instrumentation; every removed
zero-hit tuple has positive-hit evidence; singleton union remains frozen;
segmentation conceals no assertion, routing, merge, process, or coverage
failure; and old profile remains byte-identical. Only independent
`COVERAGE_PROFILE_REVIEW_PASS` with no blockers authorizes the child/switch.

## 19. Exact file allowlists

### 19.1 Correction materialization

```text
docs/implementation/phase-3-slice-2b20ap2-design-release-correction-v1.md
docs/agent-loop/AUTOPILOT_STATE.json
docs/agent-loop/CURRENT_TASK.md
docs/agent-loop/PROJECT_STATE.md
docs/agent-loop/AUTOPILOT_LOG.md
```

### 19.2 Design Release Review archive

```text
docs/implementation/phase-3-slice-2b20ap2-design-release-review-correction-v1.md
docs/agent-loop/AUTOPILOT_STATE.json
docs/agent-loop/CURRENT_TASK.md
docs/agent-loop/PROJECT_STATE.md
docs/agent-loop/AUTOPILOT_LOG.md
```

### 19.3 Source implementation commit

```text
.github/workflows/ci.yml
scripts/run-vitest-logical-group.mjs
scripts/verify-vitest-ownership-contracts.mjs
scripts/vitest-ownership-contracts.mjs
scripts/verify-vitest-coverage-groups.mjs
scripts/verify-vitest-windows-application-groups.mjs
scripts/collect-vitest-shard-diagnostics.mjs
docs/implementation/phase-3-slice-2b20ap2-implementation-status.md
docs/agent-loop/AUTOPILOT_STATE.json
docs/agent-loop/CURRENT_TASK.md
docs/agent-loop/PROJECT_STATE.md
docs/agent-loop/AUTOPILOT_LOG.md
```

### 19.4 Profile child

```text
.github/workflows/ci.yml
scripts/verify-coverage-obligations.mjs
docs/implementation/phase-3-slice-2b20ap2-coverage-profile-audit.md
docs/implementation/phase-3-slice-2b20ap2-coverage-profile-review.md
docs/implementation/phase-3-slice-2b20ap2-implementation-status.md
docs/agent-loop/AUTOPILOT_STATE.json
docs/agent-loop/CURRENT_TASK.md
docs/agent-loop/PROJECT_STATE.md
docs/agent-loop/AUTOPILOT_LOG.md
```

Allowlist is a ceiling. Any required file outside it is `HUMAN_BLOCKED`.
Source implementation is limited to seven infrastructure source files and at
most 2000 added non-documentation lines.

## 20. Mandatory tests

At minimum:

1. Static audit of 42 unique criteria, nine fields, exact R/T/layer enums, and R4 empty.
2. Reject `APPLICATION_COMMAND_INTEGRATION` for every runner/CLI criterion.
3. Available accepted commit positive path.
4. Missing object unavailable code.
5. Present non-ancestor distinct code.
6. Accepted blob positive compatibility.
7. Blob mismatch rejection.
8. Resolve installed `vitest/package.json`, exact package/version/public bin.
9. Direct Windows execution using `process.execPath`, exit 0.
10. Hosted Linux execution using the same contract.
11. Reject missing, linked, escaped, wrong-package, wrong-bin, and wrong-version Vitest.
12. Reject every invalid CLI shape.
13. Repository root equality and `GITHUB_WORKSPACE` present/absent branches.
14. Reject lexical, absolute, symlink, junction, reparse, case-folded, and realpath escapes.
15. Enumerated safe cleanup; reject unknown entry.
16. Atomic write, fsync, rename, and partial cleanup.
17. Reporter-record exact schema.
18. Exact `SIDECAR_LOGICAL_GROUP_MISMATCH`.
19. Parent copies validated global errors and never parses stdout for them.
20. Missing reporter record still produces a failed final envelope.
21. All-pass plus exit 1 remains failed.
22. Same-process injected global error remains failed without rerun.
23. Opaque blob byte identity before/after singleton staging.
24. One regular blob per singleton input root.
25. Singleton legacy `14 pass / 32 skip`.
26. Singleton 2B20A `22 pass / 24 skip`.
27. Singleton gained `10 pass / 36 skip`.
28. Pure selected union 46 and pairwise intersection 0.
29. Reproduce unsafe three-blob collision result and prove it is rejected as authority.
30. Prove ordinary global multi-blob test merge is never invoked.
31. Prove all 11 ordinary blobs are singleton-consumed exactly once.
32. Prove ordinary `11 physical -> 9 logical -> 1572`.
33. Prove coverage legacy 14 and 2B20A 22 singleton authority.
34. Prove coverage core 36 and gained 10.
35. Prove all 12 coverage blobs are singleton-consumed exactly once.
36. Reject directory, symlink, extra file, collision, traversal, or wrong hash in coverage merge staging.
37. Real flat 12-blob coverage merge produces a map.
38. Probe fixture produces equal normalized fingerprint `63/3217/23/3217/1809`.
39. Prove merged coverage test JSON cannot enter identity or ownership validation.
40. Prove coverage `12 physical -> 11 logical -> 1572`.
41. W7 `14/22/10`, pure union 46, and total Windows 305.
42. Canonical stable projection byte equality under reversed input order.
43. Full-envelope equality with injected fixed clock/process adapter.
44. Production envelope retains real nonnegative duration.
45. Old profile byte-identical.
46. Source commit/profile child separation.
47. Complete canonical coverage delta.
48. Forbidden product/rule/test/title/profile/include/timeout/dependency/project/matrix diff empty.
49. `pnpm typecheck`.
50. `pnpm lint`.
51. `pnpm test`.
52. Full segmented `pnpm test:coverage`.

Unrun gates remain `NOT_RUN`.

## 21. Design Release Review

One independent read-only reviewer checks only: all three blockers closed;
probe results accurate; no multi-blob test JSON authority; ordinary/W7
singleton-plus-manifest authority; coverage singleton authority plus
coverage-only flat merge; separate reporter record/parent envelope; real exits
and same-process errors authoritative; nonce removed; executable direct public
bin; safe roots/cleanup/atomic writes; semantically correct 42-row matrix; and
unchanged H1-H4/topology/product/tests/profiles/budgets/allowlists/stop-loss.

```text
DESIGN_RELEASE_PASS
DESIGN_RELEASE_FIX_REQUIRED
HUMAN_BLOCKED
```

At most two docs-only corrections within the three blockers do not consume CI
remediation budget.

## 22. CI, implementation review, and release gates

After Design Release PASS: (1) source implementation consumes remediation
`1/2`; (2) run every local gate; (3) create exact-source coverage; (4) obtain
independent profile review; (5) create append-only profile child; (6) obtain
independent infrastructure implementation review; (7) push a new exact HEAD to
PR 47; (8) never rerun old runs `30247984028` or `30248052689`; (9) wait for
new push/PR workflows; (10) one deterministic failure may consume `2/2` and
there is no third round; (11) only proven `CI_EXTERNAL_RUNNER_FAILURE` permits
one targeted rerun; (12) exact-head CI must pass before final review; (13) a
passing review freezes the branch and any later commit invalidates it.

## 23. Rollback

Revert profile child and selected ID, then source commit, then restore prior
workflow/runner/verifiers/diagnostics. Preserve accepted history, old profiles,
failure artifacts, probe/review/Product Repair/2B20AP1 history. Never reset,
rebase, amend, force-push, delete history, or reconstruct evidence.

## 24. Stop conditions

Return `HUMAN_BLOCKED` on any required product/rule/event/replay/projection/
test/title/marker/timeout/dependency/project/logical-group/coverage-include/
role-matrix/accepted-history/old-profile change; any multi-blob test JSON
authority; inability to keep blobs opaque or obtain same-process evidence;
conflating missing evidence with zero errors; inability to use direct public
bin; unsafe roots/cleanup/staging/atomicity; unexplained coverage delta;
allowlist/size breach; deterministic failure after `2/2`; unavailable evidence;
reviewer block; unsafe rollback; or permission failure.

```text
unclassifiableGovernanceConflicts=[]
```

## 25. Disposition

```text
correctionId=2B20AP2-DESIGN-RELEASE-CORRECTION-V1
parentDesignImmutable=true
parentReviewImmutable=true
designRound3Created=false
threeBlockersAddressed=true
ruleReady=true
ruleDesignPass=false
designReleasePass=false
implementationAuthorized=false
ciRemediationRound=0
maxCiRemediationRounds=2
remainingBlockers=[
  PENDING_INDEPENDENT_2B20AP2_DESIGN_RELEASE_REVIEW_CORRECTION_V1
]
requiredNextAction=RUN_INDEPENDENT_2B20AP2_DESIGN_RELEASE_REVIEW_CORRECTION_V1
```

`READY_FOR_INDEPENDENT_2B20AP2_DESIGN_RELEASE_REVIEW_CORRECTION_V1`
