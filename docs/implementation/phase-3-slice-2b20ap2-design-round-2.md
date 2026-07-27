# Phase 3 Slice 2B20AP2 Complete Frozen Design Round 2

## 1. Standalone authority

This document is the complete standalone Design Round 2 for:

```text
2B20AP2 — Hosted Exact-Head CI Execution Closure V1
```

It directly incorporates every still-valid design contract and all required
Round-1 corrections. Implementation does not need to read the Round-1 design
to execute this design.

- task type: `CI_TEST_INFRASTRUCTURE / NON_PRODUCT`
- authorization:
  `USER_AUTHORIZED_2B20AP2_HOSTED_HISTORY_DREAMER_PROCESS_ISOLATION_COVERAGE_PROFILE_AND_CONDITIONAL_2B20A_CLOSEOUT`
- Round-2 baseline:
  `f71fffa9a043334283e8e95da27af33833976da1`
- branch:
  `infra/2b20ap1-ownership-supersession-routing-v1`
- infrastructure PR: `#47`
- product PR: `#46`
- rule evidence:
  `docs/rules/evidence/2B20AP2.md`
- rule verdict: `RULE_READY`
- governance:
  `docs/architecture/2B20AP2-go-no-go-under-governance-v1.md`
- governance verdict: `GO`
- Round-1 review:
  `docs/implementation/phase-3-slice-2b20ap2-design-review-round-1.md`
- Round-1 verdict: `RULE_DESIGN_FIX_REQUIRED`
- design round: `2/2`
- CI remediation round before implementation: `0/2`

Implementation remains forbidden until a final independent reviewer returns
`RULE_DESIGN_PASS` with `remainingBlockers=[]`.

## 2. Preserved non-product boundary

The design coordinates only:

- H1:
  `HOSTED_ACCEPTED_HISTORY_UNAVAILABLE_IN_SHALLOW_CHECKOUT`;
- H2:
  `COVERAGE_PROFILE_STALE_AFTER_AUTHORIZED_PRODUCT_SOURCE_CHANGE`;
- H3:
  `DREAMER_VORTOX_DURATION_SENSITIVE_WORKER_RPC_OR_SHUTDOWN_FAILURE`;
- H4:
  `WINDOWS_W7_NONZERO_EXIT_WITHOUT_SAME_PROCESS_GLOBAL_ERROR_CHANNEL`.

Dreamer remains `PARTIAL`. There is no product production, product behavior,
BOTC rule, event, accepted-history, replay, idempotency, projection, private
knowledge, AI knowledge, Storyteller knowledge, canonical-secret, privacy,
test-assertion, title, marker, timeout, dependency, Vitest-project, logical
group, coverage-include, old-profile, or role-coverage change.

## 3. Governance V1.1 classification

### 3.1 Reachability classes

- `R1 — ACCEPTED_DIRECT_EXECUTION`: a normal exact-head accepted-path
  execution required to pass.
- `R2 — ACCEPTED_HISTORY_COMPATIBILITY`: accepted predecessor/history evidence
  required to validate the current successor without rewriting history.
- `R3 — HOSTILE_OR_MALFORMED_REJECTION`: adversarial, malformed, missing,
  spoofed, or incomplete input required to fail closed.
- `R4 — FROZEN_DIFF_INVARIANT`: repository-wide proof that a prohibited
  product/authority surface did not change.

An `R3` test proves rejection only. It never serves as accepted `R1` or `R2`
authority and cannot justify a successful product, history, profile, or merge
claim.

### 3.2 Trust entry points

- `T1 — PROCESS_OR_REPOSITORY_BOUNDARY`: Git history, launcher, filesystem,
  subprocess, workflow artifact, coverage profile, or repository diff input.
- `T2 — TEST_IDENTITY_ROUTING_BOUNDARY`: discovered test identities, segment
  ownership, physical blobs, logical groups, or Windows shard routing.
- `T3 — CANONICALIZATION_BOUNDARY`: stable JSON, ordering, hashes, manifests,
  and deterministic report identity.

### 3.3 Exact design-time criterion matrix

Each row has exactly the nine governance fields below.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `C01` | Hosted accepted history that is absent from the checkout is not a true graph split. | A local shallow-repository fixture lacking the accepted object returns only `SUPERSESSION_ACCEPTED_HISTORY_UNAVAILABLE`; full-history exact-head validation proceeds. | Ownership-verifier self-test plus hosted validate/test-merge/coverage-merge checkout audit. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Full-history hosted jobs pass; shallow fixture fails with the exact unavailable code. | `SUP-2B20AP2-001` |
| `C02` | The frozen accepted commit is an ancestor and its frozen application-test blob matches before successor validation. | Exact accepted object, ancestry, `<acceptedHead>:<file>` OID/content, and current successor all validate in the frozen order. | Local full Git graph, verifier positive fixture, and exact hosted semantic gate. | `R2` | `T1` | `LEGACY_REPLAY_COMPATIBILITY` | Accepted history passes without changing accepted HEAD/blob/dispositions. | `SUP-2B20AP2-001` |
| `C03` | Hostile Git state cannot impersonate accepted authority. | True non-ancestor, blob mismatch, missing file, command exit greater than one, spawn failure, and malformed Git output each fail with the exact distinct code. | Isolated temporary Git repositories with no network. | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | Every hostile state is rejected; none is accepted authority. | `SUP-2B20AP2-001` |
| `C04` | The runner uses a locally installed, version-pinned, shell-free pnpm/Vitest launcher. | Safe launcher resolution succeeds with Node `24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`; absent/spoofed/ambiguous/wrong-version launchers fail before inventory. | Runner self-tests for npm_execpath, Windows wrapper parsing, POSIX PATH scanning, and version probes. | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | Exact local launcher executes; unsafe or wrong versions fail closed. | `SUP-2B20AP2-002` |
| `C05` | Artifact roots and every consumed artifact remain inside repository-owned fixed roots with no link/reparse escape. | Run accepts only absent/empty fixed root; verify accepts only existing valid root; every ancestor/artifact lstat and realpath passes; nonempty/spoofed/link/reparse/escape inputs fail. | Cross-platform filesystem self-tests and manifest verification. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Safe roots pass; every hostile path fails with the exact artifact-root code. | `SUP-2B20AP2-002` |
| `C06` | Dreamer/Vortox identity ownership is exactly legacy `14`, 2B20A `22`, gained `10`, union `46`, with no overlap/gap/unexpected identity. | One pre-run list produces exact counts and structured identity union. | Real Vitest list plus runner inventory verifier and hostile inventory fixtures. | `R1` | `T2` | `CROSS_PLATFORM_CI` | `14/22/10`, union `46`, all discrepancy counts zero. | `SUP-2B20AP2-003` |
| `C07` | Runner manifests, sidecars, logical reports, and verification output are deterministic canonical evidence. | Repeated identical fixtures produce byte-identical UTF-8 JSON, code-unit order, stable identities, exact schemas, and one terminal LF. | Determinism/self-test with reversed input ordering and cross-platform path fixtures. | `R1` | `T3` | `PURE_POLICY_SEAM` | Hashes and bytes are identical; locale/time/randomness have no effect. | `SUP-2B20AP2-003` |
| `C08` | Eleven ordinary mergeable blobs preserve nine logical groups and all `1572` identities. | Eight unsplit blobs plus three Dreamer blobs are present exactly once; real Vitest merge succeeds; authoritative logical inventory is eight unsplit reports plus one Dreamer logical report. | Ordinary workflow artifact audit, real Vitest merge, and routing verifier. | `R1` | `T2` | `CROSS_PLATFORM_CI` | `11 physical -> 9 logical`, union `1572`, zero duplicate/missing/unexpected. | `SUP-2B20AP2-004` |
| `C09` | Twelve coverage mergeable blobs preserve eleven logical groups, all `1572` identities, and all coverage hits. | Ten unsplit physical blobs plus two core blobs merge exactly once; core logical report is `36`, gained remains `10`; coverage JSON has no lost hit or duplicated identity. | Real Vitest coverage merge, coverage routing verifier, merged inventory, and coverage hash audit. | `R1` | `T2` | `CROSS_PLATFORM_CI` | `12 physical -> 11 logical`, union `1572`, core `36`, gained `10`, no coverage loss. | `SUP-2B20AP2-005` |
| `C10` | Windows remains W1-W7/305 while W7 executes same-process `14/22/10` evidence. | W1-W6 remain unchanged; W7 has three mergeable blobs and three matching sidecars; all exits/global errors are zero; union is `46`; Windows union is `305`. | Windows inventory verifier, W7 runner self-test, and hosted Windows artifact audit. | `R1` | `T1` | `CROSS_PLATFORM_CI` | `W1-W7`, `305`, W7 `46/46`, zero exit/signal/spawn/global errors. | `SUP-2B20AP2-006` |
| `C11` | A real nonzero subprocess exit remains authoritative even when every assertion passes. | Fixture and real subprocess with all-pass assertion blob plus exit `1` produces `SUBRUN_NONZERO_EXIT`, failed logical report, and nonzero runner exit. | Hostile-process self-test and exact segment evidence. | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | Assertion PASS never converts exit `1` to success. | `SUP-2B20AP2-007` |
| `C12` | Vitest global errors come from the same subprocess as assertions and exits. | Custom reporter sidecar captures public `onFinished(files, errors)` once with matching nonce/profile/segment; any global error fails; no diagnostic rerun occurs. | Dual-reporter integration test and injected same-process global error fixture. | `R1` | `T1` | `CROSS_PLATFORM_CI` | Zero global errors required for PASS; injected error is retained and fails. | `SUP-2B20AP2-007` |
| `C13` | Missing, extra, renamed, malformed, mismatched, substituted, or linked artifacts cannot become merge authority. | Strict root inventory, fixed names, hashes, schemas, nonce/profile/segment, lstat/realpath, and raw-diagnostic non-substitution all validate. | Hostile blob/sidecar/artifact fixtures and verify-mode tests. | `R3` | `T1` | `STRUCTURAL_VALIDATION` | Every hostile artifact is rejected with its exact failure code. | `SUP-2B20AP2-008` |
| `C14` | A new coverage profile is append-only and bound to exact source-head coverage. | Full source coverage, canonical delta, no disappeared source/lost hit, reviewer PASS, old profile byte-identical, new ID/sourceHead exact, workflow switched only in child. | Coverage-profile audit, artifact hashes, independent profile review, and obligation verifier. | `R1` | `T1` | `CROSS_PLATFORM_CI` | New profile passes without changing old profile or consuming a child repair round. | `SUP-2B20AP2-009` |
| `C15` | The complete slice has zero product and authority-semantic diff. | Exact diff audit proves no production/test/title/marker/rule/matrix/include/timeout/dependency/project/logical-group/accepted/old-profile change. | Frozen baseline path/hash allowlist audit and independent implementation review. | `R4` | `T1` | `STRUCTURAL_VALIDATION` | Forbidden diff is empty and Dreamer remains `PARTIAL`. | `SUP-2B20AP2-010` |

All `C01-C15` require their listed primary layer. A supporting authority never
substitutes for the primary evidence mechanism.

### 3.4 Planned supporting-authority registry

| SupportId | Producer | AuthorityStatus | Purpose | MutationDisposition | UsedByCriteria |
|---|---|---|---|---|---|
| `SUP-2B20AP2-001` | Frozen accepted Git graph, accepted application-test blob, supersession registry, and local Git fixtures | `PLANNED_SUPPORT_ONLY / LEGACY_GIT_AUTHORITY` | Bind unavailable, accepted, and hostile history checks to the immutable accepted record. | Accepted HEAD/blob/dispositions remain byte-identical; only verifier/workflow evidence may change. | `C01,C02,C03` |
| `SUP-2B20AP2-002` | Runner launcher resolver, version probes, repository-root resolver, artifact-root validator | `PLANNED_SUPPORT_ONLY / LAUNCHER_AND_ROOT_TRUST` | Support executable launcher and filesystem trust anchors. | New runner only; no dependency, lockfile, PATH, or machine configuration mutation. | `C04,C05` |
| `SUP-2B20AP2-003` | Real Vitest list inventory plus canonical manifest/report self-tests | `PLANNED_SUPPORT_ONLY / FORTY_SIX_IDENTITY_INVENTORY` | Support exact `14/22/10` and deterministic evidence identity. | No test title, marker, project, or logical ownership mutation. | `C06,C07` |
| `SUP-2B20AP2-004` | Ordinary eight unsplit blobs, three Dreamer blobs, Dreamer logical report, real Vitest merge | `PLANNED_SUPPORT_ONLY / ORDINARY_PHYSICAL_LOGICAL_MAPPING` | Support `11 physical -> 9 logical -> 1572`. | Workflow and verifier adaptation only; logical groups remain nine. | `C08` |
| `SUP-2B20AP2-005` | Coverage ten unsplit blobs, two core blobs, core logical report, gained report, merged coverage JSON | `PLANNED_SUPPORT_ONLY / COVERAGE_PHYSICAL_LOGICAL_MAPPING` | Support `12 physical -> 11 logical`, hit preservation, and profile input. | No coverage include reduction or old profile mutation. | `C09` |
| `SUP-2B20AP2-006` | Windows W1-W7 inventory and W7 three-subrun same-process artifacts | `PLANNED_SUPPORT_ONLY / WINDOWS_W7_AUTHORITY` | Support W7 `14/22/10` while Windows remains `305`. | Only W7 physical execution changes; W1-W7 logical ownership remains fixed. | `C10` |
| `SUP-2B20AP2-007` | Hostile process fixtures, real process exits, and same-process public reporter sidecars | `PLANNED_SUPPORT_ONLY / HOSTILE_PROCESS_EVIDENCE` | Prove exit `1` and global errors remain failures. | Test harness/self-test evidence only; no timeout or diagnostic rerun. | `C11,C12` |
| `SUP-2B20AP2-008` | Hostile missing/extra/renamed/malformed/mismatched artifact fixtures | `PLANNED_SUPPORT_ONLY / HOSTILE_ARTIFACT_EVIDENCE` | Prove raw diagnostics and hostile artifacts cannot become merge authority. | Self-test fixtures only; accepted artifacts and product tests unchanged. | `C13` |
| `SUP-2B20AP2-009` | Exact-source coverage artifact, canonical tuple delta, profile audit, independent profile review | `PLANNED_SUPPORT_ONLY / COVERAGE_DELTA_AUTHORITY` | Support append-only new profile provenance. | Append one new profile and switch child workflow; old profile byte-identical. | `C14` |
| `SUP-2B20AP2-010` | Git path/hash diff audit against frozen baseline and independent implementation review | `PLANNED_SUPPORT_ONLY / FROZEN_DIFF_AUTHORITY` | Prove zero prohibited product/authority mutation. | Forbidden paths remain unchanged; role matrix not allowlisted. | `C15` |

Every support ID is unique, defined once, used by at least one criterion, and
does not define a primary result.

## 4. H1 accepted-history contract

### 4.1 Hosted checkout

Every GitHub job that executes accepted-history supersession validation uses:

```yaml
with:
  fetch-depth: 0
```

This includes validate, test merge and semantic gates, and coverage merge and
semantic gates. The existing full-history coverage merge must not regress.
There is no verifier-side fetch.

### 4.2 Exact verifier order

For each accepted supersession record:

1. `git cat-file -e <acceptedHead>^{commit}`;
2. `git merge-base --is-ancestor <acceptedHead> HEAD`;
3. `git rev-parse <acceptedHead>:<acceptedFile>`;
4. `git show <acceptedHead>:<acceptedFile>`;
5. compare the accepted blob/content identity;
6. validate the current successor identity.

No later step runs after an earlier failure.

### 4.3 Exact history failures

- missing accepted commit object:
  `SUPERSESSION_ACCEPTED_HISTORY_UNAVAILABLE`;
- available accepted commit not an ancestor:
  `SUPERSESSION_ACCEPTED_HEAD_NOT_ANCESTOR`;
- accepted blob/content mismatch:
  `SUPERSESSION_ACCEPTED_BLOB_MISMATCH`;
- any other Git spawn, exit, or malformed-output failure:
  `GIT_COMMAND_FAILED`.

`merge-base` exit `1` means non-ancestor. Exit greater than `1` means
`GIT_COMMAND_FAILED`.

### 4.4 Immutable accepted authority

The following remain unchanged:

- accepted HEAD:
  `5a69c90f2d3947556ff45c15c467902b1e28ca43`;
- accepted application-test blob:
  `0ff733004899f17ff82b20b40b0f41b888ba85d0`;
- accepted file/title/ancestor identities;
- supersession dispositions;
- historical hashes;
- accepted test semantics.

All Git tests use isolated local repositories. No network client, `git fetch`,
GitHub request, or remote mutation is allowed in the verifier.

## 5. One runner and same-process reporter

Create exactly:

```text
scripts/run-vitest-logical-group.mjs
```

The same file:

- is the CLI;
- default-exports `SameProcessEvidenceReporter`;
- contains `--self-test`;
- does not run CLI code when imported as a Vitest reporter;
- creates no second runner, reporter, fixture, config, or self-test file.

The import guard compares the invoked script real URL to `import.meta.url`.

## 6. Exact CLI and repository-owned roots

### 6.1 Accepted CLI

The only accepted commands are:

```text
node scripts/run-vitest-logical-group.mjs --self-test
node scripts/run-vitest-logical-group.mjs run --profile ordinary-dreamer-vortox
node scripts/run-vitest-logical-group.mjs run --profile coverage-dreamer-vortox-core
node scripts/run-vitest-logical-group.mjs run --profile windows-w7
node scripts/run-vitest-logical-group.mjs verify --profile ordinary-dreamer-vortox
node scripts/run-vitest-logical-group.mjs verify --profile coverage-dreamer-vortox-core
node scripts/run-vitest-logical-group.mjs verify --profile windows-w7
```

There is no `--output-dir`. Unknown, missing, duplicate, reordered, extra,
short, combined, or positional arguments fail
`LOGICAL_GROUP_INVALID_ARGUMENTS`. Unknown profile fails `UNKNOWN_PROFILE`.

### 6.2 Repository root

The runner resolves its own module file with `realpath`, takes its parent
`scripts`, then its parent as repository root. The root must contain regular,
non-linked `package.json`, `pnpm-lock.yaml`, and `vitest.workspace.ts`.
`process.cwd()` must realpath-equal this repository root before any launcher,
inventory, or artifact operation.

### 6.3 Exact artifact roots

Profiles map to these fixed repository-relative roots:

```text
ordinary-dreamer-vortox
  .vitest-test/segmented/application-service-dreamer-vortox

coverage-dreamer-vortox-core
  .vitest-coverage/segmented/application-service-dreamer-vortox-core

windows-w7
  .vitest-windows-application/segmented/W7
```

`run` accepts a root only if absent or an empty valid directory. If absent, it
creates each directory component one at a time after validating its parent.
`verify` requires the root and its exact expected entries to exist.

Every repository-to-root ancestor and every artifact is checked with `lstat`
and `realpath`. A symbolic link, junction, reparse-point classification,
hard-linked unexpected artifact, path escape, case-folded escape, wrong type,
nonempty run root, or unexpected entry fails closed. The runner never deletes
or recursively cleans the root.

### 6.4 Exact root entries

Ordinary and Windows roots contain exactly:

```text
blobs/
sidecars/
logs/
logical-report.json
manifest.json
verification.json
```

Coverage core contains exactly:

```text
blobs/
sidecars/
logs/
coverage/
logical-report.json
manifest.json
verification.json
```

No sidecar or raw log may appear in `blobs/`, a merge directory, or an
artifact namespace consumed as mergeable blobs.

## 7. Exact launcher and versions

### 7.1 Common rules

- no shell;
- no `npx`;
- no `corepack prepare`;
- no package install;
- no network;
- no command string;
- no locale-dependent selection.

Subprocesses use `spawn`, repository cwd, `windowsHide: true`, and:

```text
VITEST_MAX_FORKS=1
FORCE_COLOR=0
NO_COLOR=1
```

### 7.2 Launcher resolution order

1. If `npm_execpath` is present, it must be an absolute path to a regular,
   non-linked file named exactly `pnpm.cjs` or `pnpm.mjs`, remain inside its
   real package root, and contain no path escape. Spawn:
   `process.execPath <pnpm-js-entry>`.
2. On Windows with no accepted `npm_execpath`, spawn the fixed system
   `where.exe pnpm.cmd` without shell. Parse output by CR/LF, reject control
   characters, lstat/realpath every candidate, require one unique safe regular
   `pnpm.cmd`, read it as bounded text, and extract exactly one absolute safe
   `pnpm.cjs` or `pnpm.mjs` reference. Spawn that JS entry with
   `process.execPath`.
3. On POSIX with no accepted `npm_execpath`, split `PATH` by the platform
   delimiter, discard empty/relative entries, sort candidate absolute paths by
   explicit code-unit order, and accept one unique regular, non-linked,
   executable `pnpm` file. Spawn it directly with `shell:false`.

Absent launcher is `PNPM_LAUNCHER_NOT_FOUND`. Spoofed, linked, ambiguous,
unsafe wrapper/reference, path escape, or invalid executable is
`PNPM_LAUNCHER_UNSAFE`.

### 7.3 Exact version gates

Before inventory:

```text
process.versions.node === "24.15.0"
pnpm --version stdout.trim() === "11.7.0"
pnpm exec vitest --version resolves exactly Vitest "3.2.6"
```

Failures are respectively:

```text
NODE_VERSION_MISMATCH
PNPM_LAUNCHER_VERSION_MISMATCH
VITEST_VERSION_MISMATCH
```

The pnpm version error is also exposed under the required public alias
`PNPM_VERSION_MISMATCH`; serialization uses
`PNPM_LAUNCHER_VERSION_MISMATCH` as the canonical code and verifies that the
alias maps to the same runner exit.

## 8. Exact test target and segment inventory

All profiles freeze:

```text
workspace=vitest.workspace.ts
project=application-service-dreamer-vortox
file=packages/application/src/game-application-service.test.ts
```

| segmentId | Exact pattern | Exact count |
|---|---|---:|
| `legacy` | `\[(?:2B19A3A|2B19A3B1)-` | `14` |
| `2b20a` | `\[2B20A-` | `22` |
| `gained` | `\[2B19B-` | `10` |

One pre-run Vitest list obtains structured identities. Ordinary and W7 require
`14/22/10`, union `46`, pairwise intersection `0`, missing `0`, unexpected
`0`. Coverage core executes legacy plus 2B20A, union `36`; gained remains the
existing separate logical coverage group with `10`.

Failures:

```text
INVENTORY_LIST_FAILED
INVENTORY_COUNT_MISMATCH
INVENTORY_OVERLAP
INVENTORY_MISSING
INVENTORY_UNEXPECTED
```

Any inventory failure prevents subruns.

## 9. Ordered dual-reporter subruns

Ordinary and W7 order:

```text
legacy -> 2b20a -> gained
```

Coverage core order:

```text
legacy -> 2b20a
```

After valid inventory, a segment failure does not suppress later segments.
The runner continues ordered evidence, retains real failures, writes every
obtainable artifact, creates a failed logical report, and exits nonzero.

### 9.1 Exact ordinary and W7 command

For each segment:

```text
<pnpm-launcher> exec vitest run
  --workspace=vitest.workspace.ts
  --project=application-service-dreamer-vortox
  packages/application/src/game-application-service.test.ts
  --testNamePattern=<exact-segment-pattern>
  --reporter=blob
  --reporter=./scripts/run-vitest-logical-group.mjs
  --outputFile=<fixed-absolute-blob-path>
```

Arguments are discrete spawn arguments. The fixed blob path is inside the
profile's `blobs/` directory.

### 9.2 Exact coverage command

Coverage core uses the same command plus:

```text
--coverage
--coverage.include=packages/*/src/**/*.ts
--coverage.reporter=json
--coverage.reportsDirectory=<fixed-absolute-segment-coverage-directory>
```

The include is exactly the existing workflow include. Coverage directories are
`coverage/legacy` and `coverage/2b20a`, each containing the segment's
`coverage-final.json`. There is no coverage include or threshold change.

### 9.3 Fixed mergeable blob names

Ordinary:

```text
blobs/application-service-dreamer-vortox--legacy.blob
blobs/application-service-dreamer-vortox--2b20a.blob
blobs/application-service-dreamer-vortox--gained.blob
```

Coverage core:

```text
blobs/application-service-dreamer-vortox-core--legacy.blob
blobs/application-service-dreamer-vortox-core--2b20a.blob
```

Windows W7:

```text
blobs/W7--legacy.blob
blobs/W7--2b20a.blob
blobs/W7--gained.blob
```

Only Vitest's `blob` reporter writes these files. The custom reporter never
writes, renames, parses, or substitutes a mergeable blob.

## 10. Same-process reporter sidecar

### 10.1 Reporter environment

Each subprocess receives exact values:

```text
BOTC_VITEST_EVIDENCE_OUTPUT=<fixed absolute sidecar path>
BOTC_VITEST_RUN_NONCE=<64 lowercase hex>
BOTC_VITEST_PROFILE=<exact profile>
BOTC_VITEST_SEGMENT=<exact segment>
```

The run nonce is generated once per segment with a cryptographic random source,
is not a canonical game/test identity, and must match the manifest and sidecar.
The runner never logs it before the sidecar is secured.

### 10.2 Public reporter boundary

`SameProcessEvidenceReporter` uses only:

```text
onFinished(files, errors)
```

It reads public file/task result state and the callback's `errors`. It does not
read private Vitest task internals, invoke getters on unknown values, enumerate
proxies, perform network access, spawn a process, or execute a diagnostic
rerun.

### 10.3 Exact sidecar schema

The sidecar schema version is:

```text
botc-vitest-same-process-evidence-v1
```

Every sidecar has exactly eight top-level keys:

```text
schemaVersion
runNonce
profileId
logicalGroupId
segmentId
reporterProcess
assertions
globalErrors
```

`reporterProcess` has exactly:

```text
pid: positive integer
node: "24.15.0"
platform: string
arch: string
```

`assertions` has exactly:

```text
selected: nonnegative integer
passed: nonnegative integer
failed: nonnegative integer
skipped: nonnegative integer
todo: nonnegative integer
```

`selected = passed + failed + skipped + todo`.

Each `globalErrors` item has exactly:

```text
index: nonnegative integer
type: string
name: string
message: string
redactedStack: string
```

Indexes are contiguous from zero. Successful segments require an empty array.

The reporter writes stable UTF-8 JSON with schema key order, two spaces, LF
only, one terminal LF, and atomic temporary-close-rename publication.

### 10.4 Fixed sidecar and log names

Sidecars:

```text
sidecars/<logicalGroupId>--<segment>.same-process.json
```

Logs:

```text
logs/<logicalGroupId>--<segment>.stdout.log
logs/<logicalGroupId>--<segment>.stderr.log
```

Streams retain at most `1,048,576` UTF-8 bytes, end overflow with
`<output-truncated>\n`, and are redacted through the accepted 2B20AP1 safe
diagnostic boundary.

## 11. Manifest, logical report, and verification

### 11.1 Manifest

`manifest.json` has exact keys:

```text
schemaVersion
profileId
logicalGroupId
repositoryRoot
runtime
inventory
segments
```

Schema is `botc-vitest-logical-manifest-v1`. Repository root is serialized as
`<repo-root>`, not an absolute machine path. Each segment entry records exact
expected relative blob, sidecar, stdout, stderr, optional coverage path,
nonce, and SHA-256 after creation.

### 11.2 Logical report

`logical-report.json` has exact keys:

```text
schemaVersion
profileId
logicalGroupId
selectedIdentities
segments
totals
evidenceStatus
```

Schema is `botc-vitest-logical-group-report-v1`.

Each selected identity is exactly:

```text
[project, file, ancestorPath, title]
```

Segments remain in frozen execution order. Totals have exactly:

```text
selected
passed
failed
skipped
todo
globalErrors
```

`evidenceStatus` is exactly:

- `COMPLETE`;
- `EVIDENCE_INCOMPLETE`;
- `COVERAGE_EVIDENCE_INCOMPLETE`.

Missing/malformed blob or sidecar is incomplete; missing required coverage is
coverage-incomplete. Neither passes.

### 11.3 Verification

`verification.json` has exact keys:

```text
schemaVersion
profileId
logicalGroupId
manifestSha256
logicalReportSha256
verifiedArtifacts
result
failureCodes
```

Schema is `botc-vitest-logical-verification-v1`. `result` is `PASS` or `FAIL`.
`failureCodes` is code-unit sorted and empty only for PASS.

### 11.4 Canonicalization

All JSON is UTF-8, two-space indentation, schema key order, LF only, one
terminal LF. Identities and unordered sets use explicit UTF-16 code-unit
comparison. `localeCompare`, `Intl.Collator`, locale, wall-clock identity,
PID identity, random filenames, and platform directory order are forbidden.

### 11.5 Exact logical segment record

Each `segments` item in `logical-report.json` has exactly:

```text
segmentId
command
runtime
process
assertions
globalErrors
blob
sidecar
coverage
stdout
stderr
evidenceStatus
```

`command` has exactly:

```text
executable: safe placeholder string
args: string[]
cwd: "<repo-root>"
environment: {
  VITEST_MAX_FORKS: "1"
  FORCE_COLOR: "0"
  NO_COLOR: "1"
  BOTC_VITEST_EVIDENCE_OUTPUT: fixed safe relative sidecar path
  BOTC_VITEST_RUN_NONCE: 64 lowercase hex
  BOTC_VITEST_PROFILE: exact profile
  BOTC_VITEST_SEGMENT: exact segment
}
```

`runtime` has exactly:

```text
node: "24.15.0"
pnpm: "11.7.0"
vitest: "3.2.6"
platform: string
arch: string
```

`process` has exactly:

```text
exitCode: integer | null
signal: string | null
spawnError: null | {
  name: string
  message: string
  redactedStack: string
}
wallTimeMs: nonnegative integer
```

A spawn failure has null exit/signal and a non-null safe error. A started
process has null `spawnError`.

`blob` and `sidecar` each have exactly:

```text
path: fixed safe relative path
sha256: lowercase 64-hex | null
status: "AVAILABLE" | "MISSING" | "INVALID"
```

`coverage` has exactly:

```text
path: fixed safe relative path
sha256: lowercase 64-hex | null
status: "AVAILABLE" | "NOT_APPLICABLE" | "MISSING" | "INVALID"
```

`AVAILABLE` requires a hash; every other status requires null. Ordinary/W7
coverage is `NOT_APPLICABLE`; coverage-core requires `AVAILABLE`.

`stdout` and `stderr` each have exactly:

```text
path: fixed safe relative path
sha256: lowercase 64-hex
bytes: nonnegative integer
truncated: boolean
```

The segment `assertions` and `globalErrors` are exact validated copies of the
matching sidecar. `evidenceStatus` uses the three values in section 11.2.

## 12. Process and artifact success

For every segment, the runner records real:

- command and runtime;
- exit code;
- signal;
- spawn error;
- wall time;
- assertion counts;
- same-process global errors;
- mergeable blob path/hash;
- sidecar path/hash;
- coverage path/hash when required;
- stdout/stderr path/hash/bytes/truncation.

Success requires:

- exact selected count;
- all assertions passed;
- zero failed/skipped/todo;
- exit `0`;
- no signal;
- no spawn error;
- zero global errors;
- exactly one correctly named valid mergeable blob;
- exactly one correctly named valid matching sidecar;
- required coverage JSON;
- complete manifest/logical/verification schemas.

Passing assertions never override a nonzero exit.

## 13. Exact public failure codes and exits

### 13.1 CLI, launcher, root, inventory, and process

```text
LOGICAL_GROUP_INVALID_ARGUMENTS
UNKNOWN_PROFILE
NODE_VERSION_MISMATCH
PNPM_LAUNCHER_NOT_FOUND
PNPM_LAUNCHER_UNSAFE
PNPM_LAUNCHER_VERSION_MISMATCH
PNPM_VERSION_MISMATCH
VITEST_VERSION_MISMATCH
ARTIFACT_ROOT_INVALID
ARTIFACT_ROOT_NOT_EMPTY
ARTIFACT_PATH_ESCAPE
ARTIFACT_SYMLINK
INVENTORY_LIST_FAILED
INVENTORY_COUNT_MISMATCH
INVENTORY_OVERLAP
INVENTORY_MISSING
INVENTORY_UNEXPECTED
SUBRUN_SPAWN_FAILED
SUBRUN_NONZERO_EXIT
SUBRUN_SIGNALLED
ASSERTION_FAILURE
GLOBAL_ERROR
COVERAGE_MISSING
```

### 13.2 Mergeable blob and sidecar

```text
MERGEABLE_BLOB_MISSING
MERGEABLE_BLOB_EXTRA
MERGEABLE_BLOB_RENAMED
MERGEABLE_BLOB_INVALID
MERGEABLE_BLOB_MERGE_FAILED
SIDECAR_MISSING
SIDECAR_EXTRA
SIDECAR_RENAMED
SIDECAR_PARSE_FAILED
SIDECAR_SCHEMA_INVALID
SIDECAR_NONCE_MISMATCH
SIDECAR_PROFILE_MISMATCH
SIDECAR_SEGMENT_MISMATCH
SIDECAR_PROCESS_MISMATCH
RAW_DIAGNOSTIC_NOT_AUTHORITY
```

### 13.3 Aggregate

```text
LOGICAL_MERGE_FAILED
VERIFICATION_FAILED
PROFILE_DELTA_EVIDENCE_INSUFFICIENT
INTERNAL_ERROR
```

### 13.4 Exit mapping

| Exit | Meaning |
|---:|---|
| `0` | complete PASS |
| `20` | CLI, launcher, version, or artifact-root failure |
| `21` | inventory failure |
| `22` | subprocess, mergeable-blob, sidecar, assertion, global-error, coverage, or evidence failure |
| `23` | logical merge, verification, or profile-delta failure |
| `24` | internal invariant or atomic artifact-write failure |

Multiple failures use severity `24 > 23 > 22 > 21 > 20` while retaining every
individual failure code.

## 14. Ordinary workflow mapping

The ordinary matrix remains exactly nine logical entries. Only
`application-service-dreamer-vortox` delegates to the runner.

The Dreamer test-blob artifact contains only the three fixed mergeable blobs.
Dreamer raw diagnostics are a separate artifact containing root manifest,
logical report, verification, sidecars, and logs. Sidecars/logs never enter
test-blob artifact namespaces or merge input.

After download, the ordinary merge input has exactly eleven regular `.blob`
files:

- eight unsplit logical groups, one fixed blob each;
- one `application-service-dreamer-vortox/` group directory containing the
  three fixed Dreamer blobs.

No other regular file is in the merge input. Vitest merges all eleven blobs
exactly once. Raw global diagnostics remain separate and cannot substitute for
a blob.

Logical identity authority is:

- eight existing unsplit logical reports;
- one authoritative Dreamer runner logical report with `46`.

Required result:

```text
physical blobs=11
logical groups=9
identity union=1572
overlap=0
missing=0
unexpected=0
```

The Dreamer run step uses `continue-on-error: true`. Diagnostics and blob
uploads use `if: always()`. A final `verify` enforcement step restores the
authoritative failure.

## 15. Coverage workflow mapping

The logical coverage topology remains exactly eleven. Only
`application-service-dreamer-vortox-core` delegates to the runner. The gained
logical group remains unchanged and separately executes `10`.

The core coverage-blob artifact contains only the two fixed mergeable blobs.
Core raw diagnostics are a separate artifact containing manifest, logical
report, verification, two sidecars, logs, and per-segment coverage JSON.

After download, coverage merge input has exactly twelve regular `.blob` files:

- ten unchanged physical blobs, including the unchanged gained group;
- one core group directory containing the two fixed core blobs.

All twelve participate exactly once in the real Vitest coverage merge. Raw
core/global diagnostics never enter merge input and cannot substitute for a
blob.

Logical identity authority is:

- the authoritative core runner logical report with `36`;
- unchanged gained logical report with `10`;
- the other nine unchanged logical reports.

Required result:

```text
physical blobs=12
logical groups=11
identity union=1572
core=36
gained=10
overlap=0
missing=0
unexpected=0
wrong-owner=0
lost prior hit=0
duplicate coverage identity=0
```

`scripts/verify-vitest-coverage-groups.mjs` accepts only the existing strict
legacy Vitest JSON or the strict
`botc-vitest-logical-group-report-v1`. Hybrid, unknown, extra/missing-key,
malformed, duplicate, or inconsistent input fails.

## 16. Windows mapping

Windows remains:

```text
W1=9
W2=90
W3=52
W4=73
W5=9
W6=26
W7=46
total=305
```

Only W7 delegates to the runner. Its blob artifact contains only three fixed
mergeable blobs; diagnostics are separate. W7 success requires:

- legacy `14`, 2B20A `22`, gained `10`;
- union `46`;
- three exits `0`;
- no signal or spawn error;
- zero global errors;
- `46/46` assertions passed;
- three matching same-process sidecars;
- zero overlap/missing/unexpected.

There is no second run to infer a first-run failure and no Linux-to-Windows
cause inference.

## 17. Safe diagnostics

Error extraction reads only safe own native-error data and opaque primitives.
It does not enumerate unknown objects, invoke getters, inspect proxies,
serialize cycles, or expose canonical secrets. Repository, home, temp, runner,
drive, UNC, file-URL, query-token, userinfo, and credential-like material uses
the accepted 2B20AP1 redaction contract. Name, message, and redacted stack are
each bounded to `8192` UTF-8 bytes.

Artifacts are written to sibling temporary files, explicitly closed, then
renamed. A write/close/rename failure produces `INTERNAL_ERROR`; a partial final
file is invalid.

## 18. Required correction tests

The following twenty-two correction tests are mandatory:

1. accept only the seven exact CLI forms and reject any `--output-dir` or
   malformed argument;
2. derive repository root from the real runner parent and map each profile to
   its exact fixed root;
3. accept absent/empty run root and existing exact verify root;
4. reject nonempty, wrong-type, spoofed, symlink, junction, reparse, hard-link,
   case-folded, and realpath-escape roots/artifacts;
5. resolve one safe absolute `npm_execpath` pnpm JS entry;
6. with no ambient `npm_execpath`, parse one safe Windows `where.exe pnpm.cmd`
   wrapper reference;
7. with no ambient `npm_execpath`, perform deterministic POSIX direct
   executable PATH resolution and reject relative/ambiguous/spoofed entries;
8. reject Node other than `24.15.0`;
9. reject missing/unsafe pnpm and pnpm other than `11.7.0`;
10. reject Vitest other than `3.2.6` before inventory;
11. prove exact real-list inventory `14/22/10`, union `46`, and reject
    count/overlap/missing/unexpected/list failures;
12. prove each subrun invokes both `blob` and custom reporters with exact env,
    fixed blob, sidecar, log, and coverage separation;
13. perform a real Vitest merge of the three ordinary Dreamer blobs and prove
    logical `46`;
14. perform a real Vitest coverage merge of the two core blobs, prove core
    logical `36`, and preserve hits;
15. reject missing, extra, renamed, invalid, linked, or wrong-hash mergeable
    blobs;
16. reject missing, extra, renamed, malformed, extra-key, missing-key, or
    wrong-hash sidecars;
17. reject nonce, profile, logical-group, segment, and reporter-process
    mismatch;
18. prove raw diagnostics, custom sidecar, or logical report cannot substitute
    for a missing mergeable blob;
19. prove all-pass assertions plus real exit `1` yields
    `SUBRUN_NONZERO_EXIT`, failed verification, and nonzero runner exit;
20. inject a same-process `onFinished` global error, retain it safely, and fail
    without a diagnostic rerun;
21. prove reversed discovery/artifact input yields byte-identical stable
    identities, manifests, reports, and verification;
22. prove ordinary `11->9/1572`, coverage `12->11/1572` with core `36` and
    gained `10`, and Windows W1-W7/305 with W7 `46`, with no overlap, omission,
    duplicate identity, or lost coverage hit.

## 19. Source commit

The first implementation commit is the 2B20AP2 source commit. It contains:

- H1 checkout/history classification;
- runner/reporter/self-tests;
- same-process sidecars and diagnostics;
- ordinary, coverage-core, and W7 segmentation;
- real mergeable-blob mappings;
- merge/routing/verifier adaptations;
- status/control updates.

It contains no new coverage profile and no workflow profile switch. It consumes
`ciRemediationRound=1/2`.

### 19.1 Exact source allowlist

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

The allowlist is a ceiling. An allowlisted file changes only when required.

## 20. Exact-source coverage and append-only profile

On the exact source commit, before profile creation, run full local coverage:

```text
12 physical blobs
11 logical groups
1572 identities
core=36
gained=10
zero overlap/missing/unexpected/wrong-owner
merged coverage-final.json
merged inventory audit
exact artifact SHA-256
```

The new profile ID is:

```text
phase-3-slice-2b20ap2-${sourceHead.slice(0,7)}-hosted-execution-v1
```

`sourceHead` is the full 40-hex source commit, not the child.

The old profile
`phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2` remains byte-identical.
The new profile is appended; no old profile record, tuple, hash, source head,
ID, or metadata is edited/deleted.

## 21. Coverage profile audit

Create:

```text
docs/implementation/phase-3-slice-2b20ap2-coverage-profile-audit.md
```

It records exact full:

- old profile ID/source HEAD;
- new profile ID/full source HEAD;
- source-file count/hash;
- zero-hit statements count/hash;
- zero-hit lines count/hash;
- zero-hit functions count/hash;
- zero-hit branch arms count/hash;
- complete added tuples;
- complete removed tuples;
- unchanged tuple count;
- logical/physical topology;
- coverage execution identity;
- merged artifact SHA-256.

It proves no source disappears, no prior hit is lost, additions trace to
authorized source/instrumentation change, every removal has positive hit
evidence, identity union is unchanged, and the profile conceals no assertion,
routing, merge, or coverage failure. Otherwise:

```text
PROFILE_DELTA_EVIDENCE_INSUFFICIENT
```

and `HUMAN_BLOCKED`.

## 22. Independent profile review and child

Before the child, a new independent read-only reviewer inspects the exact
source commit, full artifacts, canonical delta, metadata, intended workflow
switch, and byte-identical old profile.

Verdict:

- `COVERAGE_PROFILE_REVIEW_PASS`;
- `COVERAGE_PROFILE_REVIEW_FIX_REQUIRED`;
- `HUMAN_BLOCKED`.

Only PASS with no blockers authorizes the child.

### 22.1 Exact child allowlist

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

The child appends the reviewed profile and switches the workflow to its exact
ID. It does not consume a separate remediation round.

## 23. Forbidden implementation

Both commits forbid:

- `packages/*/src` production changes;
- product assertions, titles, LF titles, or ownership markers;
- new Vitest projects or logical GitHub groups;
- timeout/dependency/lockfile changes;
- reduced coverage include;
- accepted HEAD/blob/hash/disposition changes;
- old profile changes;
- event/replay/idempotency/projection/privacy changes;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`.

The role matrix is intentionally outside both allowlists.

## 24. Local validation

Use Node `24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`.

Mandatory:

- runner `--self-test`, including all twenty-two corrections;
- accepted-history available/unavailable/nonancestor/blob/Git-failure tests;
- real ordinary three-blob merge;
- real core two-blob coverage merge;
- all runner profiles and verify modes;
- ownership, traceability, support, ordinary, coverage, Windows audits;
- exact `11/9`, `12/11`, W1-W7/305;
- targeted lint for changed scripts;
- `pnpm typecheck`;
- `pnpm lint`;
- `pnpm test`;
- `pnpm test:coverage`;
- exact-source coverage/profile obligation validation;
- exact allowlists and forbidden diff.

Unrun gates remain `NOT_RUN`, never PASS.

## 25. Independent implementation review

After source and reviewed child are locally complete, a new independent
read-only reviewer reruns local gates and verifies:

- zero product diff;
- unchanged logical topology;
- exact physical mapping;
- real mergeable blobs separated from sidecars;
- executable launcher/root anchors;
- genuine accepted history;
- same-process errors and true exits;
- append-only exact profile delta;
- unchanged old profile;
- exact allowlists and rollback.

Verdict:

- `INFRASTRUCTURE_IMPLEMENTATION_REVIEW_PASS`;
- `INFRASTRUCTURE_IMPLEMENTATION_REVIEW_FIX_REQUIRED`;
- `HUMAN_BLOCKED`.

Only PASS with no blockers authorizes publication.

## 26. Remediation budget

The source commit consumes `1/2`. If independent implementation review or the
first new exact-head CI fails only within accepted history, launcher/root,
segmented runner, mergeable blob/sidecar, logical merge, diagnostics, or
profile scope, one source repair may consume `2/2`.

Round 2 requires full local gates and a new independent implementation review.
The profile child does not consume a round. There is no round 3.

## 27. Hosted exact-head gates

After local implementation review PASS:

1. update PR #47 body with source, child, profile, topology, local evidence,
   and old-run classifications;
2. push the same infrastructure branch;
3. do not rerun old runs `30247984028` or `30248052689`;
4. wait for new push and PR workflows on the exact HEAD;
5. download/audit every failure artifact;
6. require full history, `11/9`, `12/11`, W7 same-process evidence, full gates,
   and profile validation on that exact HEAD.

One targeted rerun is allowed only for proven
`CI_EXTERNAL_RUNNER_FAILURE`. Worker RPC, Windows exit `1`, profile mismatch,
history, assertion, deterministic script, or timeout failures are not
rerunnable.

## 28. Final reviews and conditional closeout

Only after PR #47 exact-head CI is green:

- freeze HEAD;
- obtain one complete independent final review;
- require `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`,
  `remainingBlockers=[]`;
- publish the complete report verbatim in both required audit comments;
- reread and verify both comments against current PR HEAD;
- merge PR #47 with a merge commit into the product branch, not main.

Then wait for PR #46's new exact-head CI. Only if green may PR #46 receive a
fresh complete final review, two verbatim comments, merge commit to main,
merge CI, accepted tag, and post-merge docs-only closeout/archive. Any commit
after PASS invalidates the review. Dreamer remains `PARTIAL`.

## 29. Rollback and stop

Rollback:

1. revert profile child and restore prior workflow profile ID;
2. revert source commit and restore prior workflow/runner/verifier/diagnostic;
3. preserve accepted history, old profiles, failure artifacts, reviews,
   Product Repair history, and 2B20AP1 repair history.

Stop `HUMAN_BLOCKED` on:

- product/rule/test/title/marker/include/timeout/dependency/project/logical
  change;
- accepted-history or old-profile rewrite;
- unavailable exact evidence;
- unprovable profile delta;
- unsafe launcher/root requirement;
- design/profile/implementation/final reviewer `HUMAN_BLOCKED`;
- deterministic failure after `2/2`;
- failure outside authorized scope;
- unsafe rollback or permission failure.

Never reset, rebase, amend, force-push, conceal failure, or start 2B20B.

## 30. Round-2 disposition

```text
designRound=2
maxDesignRounds=2
ruleReady=true
ruleDesignPass=false
implementationAuthorized=false
ciRemediationRound=0
maxCiRemediationRounds=2
remainingBlockers=[
  PENDING_FINAL_INDEPENDENT_2B20AP2_RULE_DESIGN_REVIEW_ROUND_2
]
requiredNextAction=RUN_FINAL_INDEPENDENT_2B20AP2_RULE_DESIGN_REVIEW_ROUND_2
```

READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW_ROUND_2
