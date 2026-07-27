# Phase 3 Slice 2B20AP2 Complete Frozen Design

## 1. Design identity and gate

- slice: `2B20AP2`
- name: `Hosted Exact-Head CI Execution Closure V1`
- task type: `CI_TEST_INFRASTRUCTURE / NON_PRODUCT`
- authorization:
  `USER_AUTHORIZED_2B20AP2_HOSTED_HISTORY_DREAMER_PROCESS_ISOLATION_COVERAGE_PROFILE_AND_CONDITIONAL_2B20A_CLOSEOUT`
- design baseline:
  `8881f54bcc8467502d56634be993ebffc53d009b`
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
- failure audit:
  `docs/implementation/phase-3-slice-2b20ap2-hosted-ci-failure-audit.md`
- design round: `1/2`
- CI remediation round before implementation: `0/2`

This design is complete and implementation-ready only after an independent
read-only reviewer returns `RULE_DESIGN_PASS` with
`remainingBlockers=[]`. Materializing this design does not authorize
implementation.

## 2. Frozen scope

The slice coordinates one hosted-execution closure across four independently
classified failures:

- H1:
  `HOSTED_ACCEPTED_HISTORY_UNAVAILABLE_IN_SHALLOW_CHECKOUT`;
- H2:
  `COVERAGE_PROFILE_STALE_AFTER_AUTHORIZED_PRODUCT_SOURCE_CHANGE`;
- H3:
  `DREAMER_VORTOX_DURATION_SENSITIVE_WORKER_RPC_OR_SHUTDOWN_FAILURE`;
- H4:
  `WINDOWS_W7_NONZERO_EXIT_WITHOUT_SAME_PROCESS_GLOBAL_ERROR_CHANNEL`.

The slice is non-product. Dreamer remains `PARTIAL`. Product production,
product behavior, BOTC rules, domain events, accepted history, replay,
idempotency, projections, private knowledge, AI knowledge, Storyteller
knowledge, canonical secrets, and privacy boundaries do not change.

## 3. Frozen decisions

### D01 — Exact baseline

All design decisions are relative to exact HEAD
`8881f54bcc8467502d56634be993ebffc53d009b`. Any unexplained baseline or
worktree difference is `HUMAN_BLOCKED`; there is no reset, rebase, amend, or
history rewrite.

### D02 — Rule and governance authority

`RULE_READY` and governance `GO` authorize this design only. The parent 2B20A
evidence remains the product-rule authority. No CI result, profile, runner, or
test report may alter rule semantics or role coverage.

### D03 — Repair-budget isolation

Product Repair remains immutable at `2/2 /
COMPLETE_WITH_EVIDENCE_ONLY_STOP_LOSS_OVERRIDE`. 2B20AP1 Infrastructure Repair
remains immutable at `2/2`. 2B20AP2 owns the separate
`ciRemediationRound=0/2`; it is not 2B20AP1 Repair 3.

### D04 — Old-run disposition

Push run `30247984028` and pull-request run `30248052689` are immutable audit
evidence and `MUST_NOT_RERUN`. Their incomplete evidence remains incomplete.

### D05 — H1 checkout coverage

Every GitHub job that performs accepted-history supersession validation must
checkout with:

```yaml
with:
  fetch-depth: 0
```

This applies to validate, test merge and semantic gates, and coverage merge and
semantic gates. The existing coverage-merge full-history checkout remains
full-history. A dynamically fetched substitute is forbidden.

### D06 — H1 verifier order

For each accepted supersession record, the verifier performs this exact order:

1. `git cat-file -e <acceptedHead>^{commit}`;
2. `git merge-base --is-ancestor <acceptedHead> HEAD`;
3. `git rev-parse <acceptedHead>:<acceptedFile>`;
4. `git show <acceptedHead>:<acceptedFile>`;
5. validate the accepted blob/content identity;
6. validate the current successor identity.

No later step runs after an earlier failure.

### D07 — H1 failure classification

The exact classifications are:

- unavailable accepted commit object:
  `SUPERSESSION_ACCEPTED_HISTORY_UNAVAILABLE`;
- available commit that is not an ancestor:
  `SUPERSESSION_ACCEPTED_HEAD_NOT_ANCESTOR`;
- accepted file/blob/content mismatch:
  `SUPERSESSION_ACCEPTED_BLOB_MISMATCH`;
- any other Git invocation failure:
  `GIT_COMMAND_FAILED`.

Exit `1` from `merge-base --is-ancestor` means non-ancestor. Exit greater than
`1`, spawn failure, or malformed output means `GIT_COMMAND_FAILED`.

### D08 — No verifier network

The verifier never calls `git fetch`, a network client, GitHub, or a remote.
Hosted checkout supplies history. Tests use local temporary repositories only.

### D09 — Accepted-history immutability

The accepted HEAD
`5a69c90f2d3947556ff45c15c467902b1e28ca43`, accepted application-test blob
`0ff733004899f17ff82b20b40b0f41b888ba85d0`, supersession dispositions,
historical hashes, predecessor identities, and accepted test meanings are
immutable.

### D10 — One bounded runner module

Create exactly one new executable module:

```text
scripts/run-vitest-logical-group.mjs
```

The same file:

- default-exports `SameProcessEvidenceReporter`;
- contains the CLI;
- contains its self-test;
- has no import-time CLI side effect when Vitest imports the reporter.

The entry guard compares the normalized `import.meta.url` to the invoked
script URL. No second runner, reporter, config, fixture, or self-test file is
created.

### D11 — Exact CLI

The only accepted invocations are:

```text
node scripts/run-vitest-logical-group.mjs --self-test
node scripts/run-vitest-logical-group.mjs run --profile <PROFILE> --output-dir <ABS>
node scripts/run-vitest-logical-group.mjs verify --profile <PROFILE> --output-dir <ABS>
```

`<PROFILE>` is exactly one of:

- `ordinary-dreamer-vortox`;
- `coverage-dreamer-vortox-core`;
- `windows-w7`.

Unknown, duplicate, missing, reordered, extra, `--key=value`, short-form, or
positional arguments fail `LOGICAL_GROUP_INVALID_ARGUMENTS`. Unknown profile
fails `UNKNOWN_PROFILE`.

### D12 — Output-path trust boundary

`--output-dir` must be an already-existing absolute directory, resolve without
symlink escape beneath the workflow-provided job artifact root or an explicitly
created OS temporary root in self-tests, and must not equal repository root,
drive root, user home, or the OS temporary root itself. Relative paths, UNC
device namespaces, NUL, traversal, missing paths, files, symlink escape, and
unapproved roots fail `OUTPUT_PATH_INVALID`. The runner never recursively
deletes an output directory.

### D13 — Fixed subprocess launch

The runner uses `node:child_process.spawn` with `shell: false`. It spawns:

```text
process.execPath <validated-pnpm-js-entry> exec vitest ...
```

The pnpm JS entry is the absolute `npm_execpath` of pnpm `11.7.0`, validated as
an existing file before use. The child working directory is the repository
root. The child environment inherits only the current environment plus these
forced values:

```text
VITEST_MAX_FORKS=1
FORCE_COLOR=0
NO_COLOR=1
```

`windowsHide: true` is mandatory. There is no shell, command string, locale
sort, uncontrolled concurrency, or second diagnostic execution.

### D14 — Fixed Vitest target

All three profiles use:

```text
workspace=vitest.workspace.ts
project=application-service-dreamer-vortox
file=packages/application/src/game-application-service.test.ts
```

The workspace, project, file, reporter module, fork count, and segment patterns
are read-only constants. CLI input cannot override them.

### D15 — Exact segment registry

The only segment definitions are:

| segmentId | test-name pattern | exact inventory |
|---|---|---:|
| `legacy` | `\[(?:2B19A3A|2B19A3B1)-` | `14` |
| `2b20a` | `\[2B20A-` | `22` |
| `gained` | `\[2B19B-` | `10` |

Pattern strings are passed as exact child arguments, not interpolated into a
shell.

### D16 — Pre-run inventory

Before any test subprocess, one Vitest list/discovery operation obtains the
fixed target's identities. The runner classifies every discovered identity
against all relevant segment patterns. For ordinary and W7:

```text
legacy=14
2b20a=22
gained=10
union=46
pairwise intersection=0
missing=0
unexpected=0
```

Coverage core requires `legacy=14`, `2b20a=22`, union `36`; the gained `10`
identities are recognized as the existing separate coverage logical group and
are not executed by the core profile.

### D17 — Inventory fail closed

Discovery spawn/exit/parse failure is `INVENTORY_LIST_FAILED`. Wrong per-segment
counts are `INVENTORY_COUNT_MISMATCH`. Multi-segment identity membership is
`INVENTORY_OVERLAP`. Expected identities not selected are
`INVENTORY_MISSING`. Non-authorized identities entering the bounded target are
`INVENTORY_UNEXPECTED`. Any inventory error prevents all test subruns.

### D18 — Ordered subruns

`ordinary-dreamer-vortox` and `windows-w7` run exactly:

```text
legacy -> 2b20a -> gained
```

`coverage-dreamer-vortox-core` runs exactly:

```text
legacy -> 2b20a
```

The runner starts one subprocess at a time and completes evidence capture for
the current segment before starting the next.

### D19 — Continue evidence after failure

After a valid inventory, a failed segment does not suppress later ordered
segments. The runner records the real failure, continues the remaining
segments, writes every obtainable artifact, produces a failed logical report,
and finally returns the authoritative failure exit. It never converts passing
assertions plus a nonzero process exit into success.

### D20 — Same-process reporter

`SameProcessEvidenceReporter` is the default export used by the exact test
subprocess. It captures Vitest's terminal callback:

```text
onFinished(files, errors)
```

The reporter derives assertion states and the `errors` array from that same
process and writes the segment's Vitest JSON blob atomically. It does not use a
second run, stdout risk-string inference, private task fields, getters, or
network access.

### D21 — Fixed artifact basenames

For each `<segmentId>`, the fixed basenames are:

```text
<segmentId>.vitest.json
<segmentId>.coverage-final.json
<segmentId>.stdout.log
<segmentId>.stderr.log
<segmentId>.segment-evidence.json
```

The coverage file is `NOT_APPLICABLE` for ordinary and W7. Profile-level output
is exactly:

```text
logical-report.json
inventory.json
```

No timestamp, PID, random UUID, locale text, or absolute sensitive path occurs
in a basename or semantic identity.

### D22 — Atomic artifact writes

Every JSON artifact is written to a sibling temporary file, explicitly closed,
then renamed to its final basename. Write, close, or rename failure is
`INTERNAL_ERROR`; no partial final artifact is accepted. Logs are bounded and
finalized before their hashes enter evidence.

### D23 — Segment-evidence top-level schema

The exact top-level keys, with no missing or extra key, are:

```text
schemaVersion
profileId
logicalGroupId
segmentId
command
runtime
process
assertions
globalErrors
blob
coverage
stdout
stderr
evidenceStatus
```

`schemaVersion` is exactly
`vitest-logical-segment-evidence-v1`. `profileId` is one of the three frozen
profiles. `logicalGroupId` is respectively
`application-service-dreamer-vortox`,
`application-service-dreamer-vortox-core`, or `W7`.

### D24 — Command and runtime shapes

`command` has exactly:

```text
executable: "<node>"
args: string[]
cwd: "<repo-root>"
environment: {
  VITEST_MAX_FORKS: "1",
  FORCE_COLOR: "0",
  NO_COLOR: "1"
}
```

Safe placeholders, not absolute machine paths, are serialized for executable
and repository root. `runtime` has exactly:

```text
node: string
pnpm: "11.7.0"
platform: string
arch: string
```

### D25 — Process shape

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

Spawn failure requires `exitCode=null`, `signal=null`, and non-null
`spawnError`. A started process requires `spawnError=null`.

### D26 — Assertion shape

`assertions` has exactly:

```text
selected: nonnegative integer
passed: nonnegative integer
failed: nonnegative integer
skipped: nonnegative integer
todo: nonnegative integer
```

For parsed evidence:

```text
selected = passed + failed + skipped + todo
```

The required successful segment has its frozen selected count, all selected
passed, and zero failed/skipped/todo.

### D27 — Global-error shape

`globalErrors` is an array. Each item has exactly:

```text
index: nonnegative integer
type: string
name: string
message: string
redactedStack: string
```

Indexes are contiguous from zero in source order. A successful segment has an
empty array.

### D28 — Blob and coverage shapes

`blob` has exactly:

```text
path: fixed relative basename
sha256: lowercase 64-hex | null
status: "AVAILABLE" | "MISSING" | "PARSE_FAILED"
```

`coverage` has exactly:

```text
path: fixed relative basename
sha256: lowercase 64-hex | null
status: "AVAILABLE" | "NOT_APPLICABLE" | "MISSING"
```

`AVAILABLE` requires a non-null hash. Every other status requires `sha256=null`.
Coverage profiles require `AVAILABLE`; ordinary and W7 require
`NOT_APPLICABLE`.

### D29 — Stdout/stderr shapes and bounds

`stdout` and `stderr` each have exactly:

```text
path: fixed relative basename
sha256: lowercase 64-hex
bytes: nonnegative integer
truncated: boolean
```

Each stream retains at most `1,048,576` UTF-8 bytes. Overflow is truncated at a
valid UTF-8 boundary and ends with the fixed marker
`<output-truncated>\n`. The recorded hash and byte count describe the retained
file.

### D30 — Safe diagnostics

Error capture reads only safe own data from native errors and opaque values. It
does not enumerate unknown objects, invoke getters, inspect proxies, serialize
cycles, or expose canonical secrets. Repository, home, temporary, runner,
drive, UNC, file-URL, query-token, userinfo, and credential-like material use
the accepted 2B20AP1 redaction boundary. `name`, `message`, and
`redactedStack` are each bounded to `8192` UTF-8 bytes after redaction.

### D31 — Evidence-status values

`evidenceStatus` is exactly one of:

- `COMPLETE`;
- `EVIDENCE_INCOMPLETE`;
- `COVERAGE_EVIDENCE_INCOMPLETE`.

Missing/malformed Vitest blob or unavailable assertion/global-error evidence is
`EVIDENCE_INCOMPLETE`. Missing required coverage JSON is
`COVERAGE_EVIDENCE_INCOMPLETE`. Neither value can pass verification.

### D32 — Logical-report schema

`logical-report.json` has exact top-level keys:

```text
schemaVersion
profileId
logicalGroupId
selectedIdentities
segments
totals
evidenceStatus
```

`schemaVersion` is exactly `vitest-logical-group-report-v1`.
`selectedIdentities` contains only identities authorized by the profile, each
as the exact four-string tuple:

```text
[project, file, ancestorPath, title]
```

`segments` contains the complete segment-evidence objects in frozen execution
order. `totals` has exactly:

```text
selected
passed
failed
skipped
todo
globalErrors
```

All values are nonnegative integers.

### D33 — Canonical JSON

All runner JSON uses UTF-8, two-space indentation, `\n` line endings, and
exactly one terminal LF. Object keys follow the schema order above. Sets and
identities are sorted by explicit UTF-16 code-unit comparison; `localeCompare`,
`Intl.Collator`, environment locale, time, random values, and platform path
ordering are forbidden. Repeated identical inputs produce byte-identical JSON.

### D34 — Logical success

Success requires every segment:

- expected selected count;
- all assertions passed;
- zero failed/skipped/todo;
- exit code `0`;
- no signal;
- no spawn error;
- zero global errors;
- valid blob;
- valid required coverage;
- `evidenceStatus=COMPLETE`.

Ordinary and W7 aggregate exactly `46/46`. Coverage core aggregates exactly
`36/36`; the existing gained coverage logical group remains exactly `10/10`.

### D35 — Logical failure

Any nonzero exit, signal, spawn error, assertion failure, global error,
missing/malformed blob, missing required coverage, schema error, hash error,
inventory discrepancy, duplicate identity, missing identity, or unexpected
identity makes the logical report fail. Verification does not privilege a JSON
reporter's `success=true` over the real process exit.

### D36 — Exact runner errors and exits

The only public runner error strings are:

```text
LOGICAL_GROUP_INVALID_ARGUMENTS
UNKNOWN_PROFILE
OUTPUT_PATH_INVALID
INVENTORY_LIST_FAILED
INVENTORY_COUNT_MISMATCH
INVENTORY_OVERLAP
INVENTORY_MISSING
INVENTORY_UNEXPECTED
SUBRUN_SPAWN_FAILED
SUBRUN_NONZERO_EXIT
SUBRUN_SIGNALLED
BLOB_MISSING
BLOB_PARSE_FAILED
ASSERTION_FAILURE
GLOBAL_ERROR
COVERAGE_MISSING
LOGICAL_MERGE_FAILED
VERIFICATION_FAILED
INTERNAL_ERROR
```

Exit codes are:

| Exit | Meaning |
|---:|---|
| `0` | complete PASS |
| `20` | CLI, profile, or output-path error |
| `21` | inventory error |
| `22` | subrun or segment-evidence failure |
| `23` | logical merge or verification failure |
| `24` | internal invariant or artifact-write failure |

When several failures occur, the final exit is the highest applicable severity
in the order `24 > 23 > 22 > 21 > 20`; all individual evidence remains
recorded.

### D37 — Ordinary workflow integration

The ordinary nine-logical-group matrix remains nine entries. Only
`application-service-dreamer-vortox` delegates to the runner. Its run step uses
`continue-on-error: true`; diagnostic collection, three segment blobs, the
logical report, and upload use `if: always()`. A final enforcement step invokes
`verify` and returns the real logical failure.

The test merge consumes `11` physical reports but emits and validates `9`
logical groups, total union `1572`, zero overlap, zero missing, and zero
unexpected identities.

### D38 — Coverage workflow integration

Only logical core `application-service-dreamer-vortox-core` delegates to the
runner and produces legacy `14` plus 2B20A `22`. The existing gained logical
group remains a separate unchanged `10`-test execution.

Core run uses `continue-on-error: true`; diagnostics, both core blobs, coverage
JSON, logical report, and upload use `if: always()`. Final enforcement verifies
the core report.

Coverage merge consumes `12` physical coverage blobs but validates `11`
logical groups, union `1572`, zero overlap/missing/unexpected/wrong-owner,
without lost hits or duplicate test identity calculation.

### D39 — Coverage verifier compatibility

`scripts/verify-vitest-coverage-groups.mjs` accepts exactly:

1. the existing legacy Vitest JSON shape for unchanged groups; or
2. `vitest-logical-group-report-v1` for the segmented core.

It rejects hybrid, unknown-version, extra-key, missing-key, malformed,
duplicate, or semantically inconsistent input. Compatibility does not relax
any existing ownership, union, intersection, or coverage check.

### D40 — Windows integration

Windows remains `W1-W7`, total `305`:

```text
W1=9 W2=90 W3=52 W4=73 W5=9 W6=26 W7=46
```

Only W7 delegates to the runner. W7 runs `14/22/10` in order and requires each
subprocess exit `0`, zero signal, zero spawn error, zero global error, all
assertions passed, logical union `46`, and zero overlap/missing/unexpected.
Each segment's evidence is from that same subprocess. No diagnostic rerun may
infer the first run's cause.

### D41 — Diagnostic upload on failure

Ordinary, coverage, and W7 upload segment evidence, stdout, stderr, blob, and
available coverage artifacts even when the runner fails. Artifact absence is
recorded as an explicit evidence status, never concealed by a success-only
upload condition.

### D42 — Source commit boundary

The first implementation commit is the `2B20AP2 source commit`. It contains H1
history availability, the runner/reporter/self-test, same-process diagnostics,
workflow segmentation, merge/verifier adaptations, and control/status records.
It contains no new coverage profile and no workflow switch to a new profile.
Creating it consumes `ciRemediationRound=1/2`.

### D43 — Exact source-commit allowlist

The source commit may change only:

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

An allowlisted file changes only if required by the reviewed design. The
allowlist is a ceiling, not a requirement to touch every file.

### D44 — Source exact-head local coverage

On the exact source commit, before profile creation, run the complete local
coverage topology with `12` physical blobs and `11` logical groups. Preserve:

- semantic identity union `1572`;
- Dreamer core `36`;
- gained `10`;
- zero intersection, missing, unexpected, and wrong-owner;
- merged `coverage-final.json`;
- merged inventory audit;
- exact artifact SHA-256.

This execution supplies the sole source for the new coverage obligation
candidate.

### D45 — New profile identity

The new profile ID is computed exactly:

```text
phase-3-slice-2b20ap2-${sourceHead.slice(0,7)}-hosted-execution-v1
```

`sourceHead` is the full 40-hex source-commit SHA. The profile child commit SHA
must not be used as `sourceHead`.

### D46 — Append-only profile

The old profile
`phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2` remains byte-identical and
registered. The new profile is appended to
`scripts/verify-coverage-obligations.mjs`; no old tuple, hash, source head,
profile ID, or metadata is edited or deleted.

### D47 — Profile audit contract

Create:

```text
docs/implementation/phase-3-slice-2b20ap2-coverage-profile-audit.md
```

It records exact full values for:

- old profile ID and old source HEAD;
- new profile ID and full source HEAD;
- source-file count and SHA-256;
- zero-hit statement count and SHA-256;
- zero-hit line count and SHA-256;
- zero-hit function count and SHA-256;
- zero-hit branch-arm count and SHA-256;
- full added canonical tuples;
- full removed canonical tuples;
- unchanged tuple count;
- logical and physical topology;
- coverage execution identity;
- merged coverage artifact SHA-256.

No abbreviated hash is accepted in this audit.

### D48 — Profile delta proof

The audit proves:

1. no production source file disappears from the coverage map;
2. segmentation creates no lost prior hit;
3. every added zero-hit tuple traces to authorized 2B20A source change or an
   explained instrumentation-location change;
4. every removed zero-hit tuple has positive hit evidence in the exact
   coverage artifact;
5. segmented and prior semantic test identity unions are equal;
6. the profile does not conceal assertion, routing, merge, or coverage loss.

Failure to prove any item is exactly
`PROFILE_DELTA_EVIDENCE_INSUFFICIENT` and `HUMAN_BLOCKED`.

### D49 — Independent profile review

Before the profile child commit, a new independent read-only reviewer examines
the exact source commit, complete coverage artifacts, canonical delta, profile
metadata, intended workflow switch, and unchanged old profile. Its verdict is
exactly one of:

- `COVERAGE_PROFILE_REVIEW_PASS`;
- `COVERAGE_PROFILE_REVIEW_FIX_REQUIRED`;
- `HUMAN_BLOCKED`.

Only `COVERAGE_PROFILE_REVIEW_PASS` with no blockers authorizes the profile
child.

### D50 — Exact profile-child allowlist

The profile child commit may change only:

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
profile ID. It does not consume another CI remediation round.

### D51 — Global forbidden diff

Both commits forbid:

- `packages/*/src` product production changes;
- product assertion, test-title, LF-title, or ownership-marker changes;
- new Vitest projects;
- new logical ordinary, coverage, or Windows groups;
- timeout increases;
- dependency or lockfile changes;
- reduced coverage include;
- accepted HEAD/blob/hash/supersession changes;
- old profile changes;
- domain event, replay, idempotency, projection, AI, Storyteller, private
  knowledge, or canonical-secret changes;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`.

The role coverage matrix is intentionally absent from both implementation
allowlists because this non-product slice does not change role coverage.

### D52 — Self-tests

The implementation self-tests must cover:

- accepted commit available;
- shallow/unavailable accepted history;
- true non-ancestor;
- accepted blob match and mismatch;
- other Git command failure;
- exact CLI/profile/output-path acceptance and rejection;
- repository/home/temp/root/symlink/path escape;
- exact `14/22/10` inventory;
- wrong count, overlap, missing, unexpected, and list failure;
- spawn failure, signal, nonzero exit with passing assertions;
- missing/malformed blob;
- assertion failure and same-process global error;
- missing coverage;
- continue-after-failure ordering;
- strict schema extra/missing/wrong-type rejection;
- safe redaction, bounds, getter/proxy/cycle opacity;
- deterministic byte-identical artifacts;
- Windows/POSIX path behavior;
- ordinary `11 physical / 9 logical / 1572`;
- coverage `12 physical / 11 logical / 1572`;
- W7 `14/22/10 / 46` and Windows `305`;
- no lost hits and no duplicate identity.

### D53 — Local gates

Use Node `24.15.0` and Corepack pnpm `11.7.0`. On the source commit, then again
on the profile child, run as applicable:

```text
node scripts/run-vitest-logical-group.mjs --self-test
node scripts/verify-vitest-ownership-contracts.mjs --self-test
node scripts/verify-vitest-coverage-groups.mjs --self-test
node scripts/verify-vitest-windows-application-groups.mjs inventory ...
```

Also run exact history tests, all three runner profiles and verification,
ownership/traceability/supporting-authority audits, ordinary routing, coverage
routing, Windows routing, targeted lint for changed scripts, and:

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
```

The source exact-head segmented coverage and profile obligation validation are
mandatory. An unrun gate remains `NOT_RUN`, never PASS.

### D54 — Independent implementation review

After source and reviewed profile child are locally complete, a new independent
read-only reviewer reruns the local gates and checks zero product-production
diff, unchanged logical topology, exact physical segmentation, genuine history
validation, same-process diagnostics, true exits, append-only profile, exact
delta, unchanged old profile, allowlists, and rollback.

Its verdict is exactly one of:

- `INFRASTRUCTURE_IMPLEMENTATION_REVIEW_PASS`;
- `INFRASTRUCTURE_IMPLEMENTATION_REVIEW_FIX_REQUIRED`;
- `HUMAN_BLOCKED`.

Only PASS with no blockers authorizes publication.

### D55 — Remediation round 2

If the independent implementation review or the first new exact-head CI fails
only within accepted-history availability, segmented runner, logical merge,
same-process diagnostics, or coverage-profile scope, one source repair may
consume `ciRemediationRound=2/2`. It requires full local gates and a new
independent implementation review. The profile child does not itself consume a
round. There is no round 3.

### D56 — Hosted exact-head gates

After local implementation review PASS:

1. update PR #47 body with source commit, profile child, new profile ID,
   topology, local evidence, and old-run classification;
2. push the same infrastructure branch;
3. do not rerun either old run;
4. wait for both new push and pull-request workflows on the exact new HEAD;
5. download and audit every failure artifact;
6. require full-history supersession checks, ordinary `11/9`, coverage
   `12/11`, Windows W7 same-process evidence, all four full gates, and profile
   validation to pass on that exact HEAD.

A single targeted rerun is allowed only for proven
`CI_EXTERNAL_RUNNER_FAILURE`. Worker RPC, Windows exit `1`, profile mismatch,
history failure, assertion failure, deterministic script failure, and timeout
are not rerunnable.

### D57 — Final review and conditional closeout

Only after PR #47 exact-head CI is fully green:

- freeze its HEAD;
- run one complete independent final review under
  `docs/agent-loop/REVIEW_PROTOCOL.md`;
- require `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`, and
  `remainingBlockers=[]`;
- publish the complete report verbatim in both required GitHub audit comments;
- re-read and verify both comments against current PR HEAD;
- merge PR #47 with a merge commit into the product branch, never directly to
  main.

Then wait for PR #46's new exact-head CI. Only if it is fully green may PR #46
receive its own fresh complete independent final review, two verbatim audit
comments, merge commit to main, merge CI, accepted tag, and post-merge
docs-only closeout/archive. Dreamer remains `PARTIAL`. A passing review is
invalidated by any later commit.

### D58 — Stop and rollback

Stop with `HUMAN_BLOCKED` on:

- any product/rule/test-title/assertion/marker/timeout/dependency/project or
  logical-topology requirement;
- accepted-history or old-profile rewrite;
- unavailable exact evidence or unprovable profile delta;
- independent design, profile, implementation, or final review
  `HUMAN_BLOCKED`;
- remediation `2/2` exhausted with deterministic failure;
- failure outside the authorized H1-H4/profile scope;
- unsafe rollback or permissions failure.

Rollback is commit-scoped and ordered: revert the profile child first to
restore the prior workflow profile ID, then revert the source commit to restore
the prior workflow/runner/verifier/diagnostic behavior. Preserve old profiles,
accepted history, failure artifacts, reviews, Product Repair history, and
2B20AP1 repair history. Never reset, rebase, amend, force-push, or conceal a
failure.

## 4. Acceptance matrix

| Boundary | Required success |
|---|---|
| H1 | full checkout; accepted object, ancestry, blob, successor all verified |
| Ordinary | `11` physical, `9` logical, Dreamer `14/22/10`, union `1572` |
| Coverage | `12` physical, `11` logical, core `36`, gained `10`, union `1572` |
| Windows | `W1-W7`, union `305`, W7 `14/22/10`, all exits/global errors zero |
| Diagnostics | same-process evidence, failed artifacts retained, true exit authoritative |
| Profile | exact-source coverage, full canonical delta, old profile unchanged, independent PASS |
| Product | zero production, behavior, rule, event, replay, projection, privacy, and role-coverage change |
| Governance | design PASS before implementation; implementation PASS before publication; exact-head CI before final review |

## 5. Current design disposition

```text
designRound=1
maxDesignRounds=2
ruleReady=true
ruleDesignPass=false
implementationAuthorized=false
ciRemediationRound=0
maxCiRemediationRounds=2
remainingBlockers=[
  PENDING_INDEPENDENT_2B20AP2_RULE_DESIGN_REVIEW
]
requiredNextAction=RUN_INDEPENDENT_2B20AP2_RULE_DESIGN_REVIEW
```

READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW
