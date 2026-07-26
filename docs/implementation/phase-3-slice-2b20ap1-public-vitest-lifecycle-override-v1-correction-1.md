# Phase 3 Slice 2B20AP1 — Public Vitest Lifecycle Override v1 Correction 1

## 1. Standalone authority and metadata

| Field | Frozen value |
|---|---|
| Correction ID | `2B20AP1-PUBLIC-VITEST-LIFECYCLE-OVERRIDE-V1-CORRECTION-1` |
| Authorization | `USER_AUTHORIZED_2B20AP1_PUBLIC_VITEST_LIFECYCLE_OVERRIDE_AND_LOCAL_END_TO_END_CLOSURE` |
| Classification | `STANDALONE_PUBLIC_CLOSE_DIAGNOSTIC_REPLACEMENT / NON_PRODUCT / DOCS_CONTROL_ONLY` |
| Design-round classification | `NOT_DESIGN_ROUND_4` |
| Lifecycle correction | `1/2` |
| Infrastructure Repair | `0/2` |
| Implementation authorized | `false` |
| Candidate authorized in this materialization | `false` |
| Repository branch | `infra/2b20ap1-ownership-supersession-routing-v1` |
| Materialization parent HEAD | `99be3e69957bc4ca53b9cab9785b079be73fbf8d` |
| Parent override path | `docs/implementation/phase-3-slice-2b20ap1-public-vitest-lifecycle-override-v1.md` |
| Parent override SHA-256 | `f944d431e9003a52eb4b0d1c8d5f5fcc20e820430d185f3649521e1605010d0b` |
| Round-1 review path | `docs/implementation/phase-3-slice-2b20ap1-public-vitest-lifecycle-override-review-round-1.md` |
| Round-1 review SHA-256 | `275a0fe3bd0ea99a6f5e7b917a033de1ed8936992a7d64b8d7474b54b248b0aa` |
| Reviewed override HEAD | `99be3e69957bc4ca53b9cab9785b079be73fbf8d` |
| Review timestamp | `2026-07-26T11:34:14.0459835Z` |
| Review verdict | `RULE_DESIGN_FIX_REQUIRED` |
| Finding closed at design-contract level | `LFC1-PUBLIC-CLOSE-FULFILLED-WITH-ERROR-DIAGNOSTIC` |
| Governance path | `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md` |
| Governance SHA-256 | `583f1778582c168935b380b19e453117b000d8caf18dd3a4cd7731365cdb3537` |
| Parent Round 3 path | `docs/implementation/phase-3-slice-2b20ap1-design-round-3.md` |
| Parent Round 3 SHA-256 | `4f2fab7b877ca98e1fb46974661874353dd78a1c6b388cb91d3031c59608e003` |
| Latest LF authority path | `docs/implementation/phase-3-slice-2b20ap1-lf-safe-identity-encoding-amendment-v1-correction-2.md` |
| Latest LF authority SHA-256 | `2b07ac52427a9bd95ee535e71de37d6d0a7c2eb662b28048115ce4377d09b10c` |
| Final LF review SHA-256 | `df96cfa33fb2c23e570896ab3722d1ceece6f223568301a3459eac135960a1b9` |
| Vitest version | `3.2.6` |
| Node / pnpm | Node `24.15.0`; pnpm `11.7.0` |
| Review state | `HUMAN_BLOCKED / PENDING_INDEPENDENT_2B20AP1_PUBLIC_VITEST_LIFECYCLE_OVERRIDE_CORRECTION_1_REVIEW` |
| Required next action | `RUN_INDEPENDENT_2B20AP1_PUBLIC_VITEST_LIFECYCLE_OVERRIDE_CORRECTION_1_REVIEW` |

This is the complete standalone replacement authority for the public Vitest
lifecycle override. A future implementer and reviewer need not combine
conflicting prose from the parent override to determine the lifecycle
contract: this document inherits every independently passing parent contract
below, replaces the incomplete close-success test, and closes only
`LFC1-PUBLIC-CLOSE-FULFILLED-WITH-ERROR-DIAGNOSTIC` at design-contract level.

The parent override and its Round-1 review remain immutable evidence. This
correction is not an edit to either file, is not Correction 3 of the earlier LF
chain, and is not Design Round 4. It records the exact parent commit already
reviewed but does not prewrite the future commit that will materialize this
document.

## 2. Exact locked public evidence

### 2.1 Public type surface

The installed, lockfile-selected package is Vitest `3.2.6`. Public declarations
in
`node_modules/.pnpm/vitest@3.2.6_@types+node@24.13.2/node_modules/vitest/dist/chunks/reporters.d.BuRON0I0.d.ts`,
SHA-256
`ab80d2cb170a92c61ca8c822d0db0fc50eb15c7c6cf1a24cb01852a5a15a7db8`,
expose:

- `VitestOptions.stdout?: NodeJS.WriteStream | Writable`;
- `VitestOptions.stderr?: NodeJS.WriteStream | Writable`; and
- `Vitest.close(): Promise<void>`.

The package manifest at
`node_modules/.pnpm/vitest@3.2.6_@types+node@24.13.2/node_modules/vitest/package.json`
has SHA-256
`86c8529110b6690e7ed95e243c867ee9b3118ac91d8ae8857d22f228666252c4`.
The injected `stderr` writable is therefore a public construction option, not
a private field, monkey patch or generated-hook dependency.

### 2.2 Locked Vitest 3.2.6 close behavior

The installed implementation at
`node_modules/.pnpm/vitest@3.2.6_@types+node@24.13.2/node_modules/vitest/dist/chunks/cli-api.DWGBtMmz.js`,
SHA-256
`123e44ea39aee4f9e7a0d8f91fd78d9091c161e56d0f15ece5ab7e807ac5eaed`,
constructs its logger from public `options.stdout` and `options.stderr`.

Its public `close()` implementation:

1. performs global-setup teardown;
2. builds close promises for projects, the core workspace project when
   applicable, the pool and registered close listeners;
3. awaits those promises with `Promise.allSettled`;
4. for each rejected settled result calls public-observable logger output
   equivalent to `logger.error("error during close", rejectionReason)`; and
5. fulfills the outer cached close Promise after logging those settled
   rejections.

Therefore public Promise fulfillment alone does not prove that all resource
close operations succeeded. The public injected stderr record is a second
observable result channel. This correction relies only on those two public
channels. It does not read the private cached promise, project arrays, pool,
listener list or internal hook order.

### 2.3 Evidence boundary

The source path and hashes above lock why this correction is necessary for
Vitest `3.2.6`; future implementation acceptance remains behavioral:

- call public `close()` exactly once;
- observe its public Promise settlement;
- observe records written to the public injected stderr while the repository
  wrapper phase is `CLOSING`; and
- apply the normalization and classification below.

No test may import the generated implementation chunk, read private properties
or assert the number/order of project, pool, listener or plugin hook calls.
The source hash is provenance, not a runtime private-implementation gate.

## 3. Inherited passing contracts

The Round-1 reviewer returned `PASS`, `PASS_STATIC` or `PASS` for every surface
listed here. This correction inherits them without modification.

### 3.1 Create

Before awaiting public `createVitest`, the repository wrapper phase is
`CREATING`. Diagnostics received by the public injected streams during that
await belong to the observable create phase; no private emission order is
frozen.

If `createVitest` rejects:

- classification is `CREATE_FAILED`;
- no usable instance was returned;
- repository collection is not entered;
- repository close is not called;
- no candidate bytes are encoded or published;
- safe error name, message and stack may be retained; and
- no pre-return cleanup proof is required or fabricated.

### 3.2 Collection

After successful create, the repository enters its own
`collectSemanticInventory` wrapper exactly once. That wrapper may use public
Vitest `3.2.6` `collect(filters?)`, or public `globTestSpecifications` followed
by public `collectTests(specifications)`, and traverses structured
`TestModule` / `TestCase` data.

The repository wrapper-entry count is authoritative. Vitest's internal glob
invocation count is not. Collection may load modules as part of public collect
semantics but must not run test callbacks. A thrown, rejected, unhandled or
malformed collection result is `COLLECT_FAILED`, still reaches the close gate
for the returned instance and publishes no candidate.

### 3.3 LF-safe validation and encoding

The one structured collection deterministically produces exact tuples
`[project,file,ancestorPath,title]`. Literal LF, CR and CRLF remain string
content and never become record framing. The implementation retains:

- all `1572` semantic identities;
- exactly `12` legal LF-bearing titles;
- zero title edits;
- dense ancestor paths;
- canonical project and repository-relative file paths;
- fail-closed duplicate and lossy-projection collision checks;
- locale-independent ordinal ordering;
- `vitest-semantic-identity-json-tuple-v1`;
- `UTF-8(JSON.stringify(sortedCanonicalTuples) + LF)` inventory bytes;
- exact `vitest-ownership-candidate-baseline-v2`;
- ten ordered candidate top-level keys;
- raw-byte-first candidate verification; and
- accepted histories ordered
  `2B19A3A, 2B19A3B1, 2B19A3B2, 2B19B`.

Validation or encoding failure is `VALIDATE_OR_ENCODE_FAILED`, reaches close
exactly once for the returned instance and publishes no candidate. Accepted
hashes are not rewritten and no migration or dual-hash bridge is introduced.

### 3.4 Candidate publication

Candidate bytes are derived in memory from the same successful structured
collection. They remain private and unusable until the corrected close gate in
section 5 succeeds.

Publication then uses the inherited safe output path plus same-directory
temporary file and atomic replacement/equivalent same-filesystem operation.
Any path, temporary creation, write, temporary close or replacement failure is
`PUBLISH_FAILED`; no partial final artifact is exposed and a clean rerun is
possible.

### 3.5 Topology, ownership and non-product boundaries

This correction changes no ownership, supersession, traceability or routing
contract. The following remain frozen:

- ordinary topology: `9` groups;
- coverage topology: `11` groups;
- Windows topology: `W1–W7`;
- `C32 Static=PASS`;
- `C32 Hosted=PENDING`;
- `37/37` unique ownership primary/supporting-authority contract;
- accepted-authority supersession and history protection; and
- the existing eleven-file future implementation allowlist in section 8.

All of these remain `false`:

- `ruleSemanticsChanged`;
- `productBehaviorChanged`;
- `productionCodeChanged`;
- `testSemanticsChanged`;
- `testIdentityChanged`;
- `testTitlesChanged`;
- `ownershipTopologyChanged`;
- `coverageProfileChanged`;
- `coverageProjectChanged`;
- `processGroupChanged`;
- `timeoutChanged`;
- `dependencyChanged`;
- `newProjectOrProcessGroup`;
- `infrastructureRepairRoundConsumed`; and
- `implementationAuthorized`.

Linux worker-RPC and Windows W7 blockers remain downstream and out of scope.

### 3.6 Historical lifecycle non-blockers

The original three LF lifecycle findings remain historical only:

| Historical finding | Frozen disposition |
|---|---|
| `LF3-DIAGNOSTIC_PHASE_PRECEDES_CREATEVITEST_RETURN` | `DESIGN_CONTRACT_REPLACED_BY_PUBLIC_API_PHASE_AWARE_DIAGNOSTICS` |
| `LF1-GLOB_INVOCATION_COUNT_CONTRADICTION` | `INTERNAL_INVOCATION_COUNT_NOT_AN_ACCEPTANCE_AUTHORITY` |
| `LF3-CREATEVITEST_PRE_RETURN_CLOSE_UNPROVABLE` | `PRE_RETURN_CLOSE_NOT_REQUIRED_AND_NOT_EXPRESSIBLE` |

This correction does not rename or revive them. It still forbids acceptance
requirements based on private `closingPromise`, plugin hook ordering,
`configureServer` closing the whole instance, internal glob counts or a close
call after rejected create.

## 4. Public injected stderr capture and normalization

### 4.1 Per-invocation public capture

Each repository lifecycle invocation supplies its own repository-owned
`Writable` through public `VitestOptions.stderr` when calling `createVitest`.
The capture is not shared across concurrent or successive lifecycle
invocations.

The writable records each public `write` request synchronously before invoking
its write callback. Each record stores:

- a zero-based arrival ordinal local to the invocation;
- the repository wrapper phase at write entry;
- the original bytes;
- the caller-supplied encoding when applicable; and
- a safe SHA-256 of the original bytes for diagnostic correlation.

The capture must accept the ordinary Node writable chunk forms used by the
public API. A non-string/non-byte chunk or invalid UTF-8 becomes a deterministic
`CLOSE_DIAGNOSTIC_CAPTURE_INVALID` close-error record when its write phase is
`CLOSING`; it is never silently discarded.

The wrapper sets `phase=CLOSING` synchronously immediately before calling
public `vitest.close()`. It keeps that phase through Promise settlement and
classification of all write requests synchronously recorded by the injected
writable. Only after classification may it enter `PUBLISHING` or terminal
failure.

This phase boundary is repository-observable. It does not claim when an
internal project, pool, listener or plugin hook ran. Under the locked
implementation, `logger.error("error during close", reason)` writes before the
outer `close()` Promise fulfills, so the synchronous capture contains the
public close diagnostic before the close gate is evaluated.

### 4.2 Deterministic record normalization

Normalization applies independently to each captured public stderr write
record:

1. retain original bytes and ordinal for evidence;
2. decode the complete record as strict UTF-8;
3. replace CRLF with LF, then replace remaining CR with LF;
4. remove terminal LF characters only for classification;
5. preserve all other characters exactly; and
6. do not case-fold, trim leading whitespace, collapse internal whitespace,
   apply Unicode normalization or broadly remove ANSI sequences.

The exact Vitest `3.2.6` close-error sentinel is ASCII
`error during close`. A normalized record is a close-error record when its
normalized text:

- equals `error during close`; or
- begins `error during close` followed immediately by ASCII space, horizontal
  tab or LF.

Matching is anchored at character zero and case-sensitive. A substring later
in an unrelated warning is not a match. An ANSI-prefixed, altered-case or
lookalike string is not silently reclassified; it remains a non-error
diagnostic record and is preserved under section 4.3. Invalid capture itself
is the explicit synthetic close-error code
`CLOSE_DIAGNOSTIC_CAPTURE_INVALID`.

This normalization tolerates platform line endings without hiding, rewriting
or inventing diagnostic meaning. It does not depend on how many internal close
operations produced the public messages.

### 4.3 Non-error close diagnostics are not swallowed

Every non-empty normalized stderr record captured during `CLOSING` that is not
a close-error record is classified
`CLOSE_STDERR_NON_ERROR_DIAGNOSTIC`. It is retained in arrival order, passed
through the inherited safe redaction boundary and emitted through the
deterministic external diagnostic contract in section 6.

Such a record is not arbitrarily swallowed and is not falsely renamed
`CLOSE_FAILED`. Consistent with the exact success definition in section 5,
non-error diagnostics alone do not make public close fail. The actual
repository integration nevertheless requires zero close-stage stderr records,
so any newly observed warning is visible evidence rather than hidden drift.

A record that becomes empty only because terminal line endings were removed is
classified `EMPTY_FORMATTING`, counted for audit and omitted from external
human-facing text. This is the sole formatting-only omission and is exact, not
a content-based warning allowlist.

## 5. Corrected close gate

### 5.1 Exact close-success definition

For every successfully returned Vitest instance, repository code calls public
`vitest.close()` exactly once and awaits it. Close succeeds if and only if:

1. the public `close()` Promise fulfills; and
2. the public injected stderr capture contains zero normalized close-error
   records whose recorded wrapper phase is `CLOSING`.

`closeSucceeded` is therefore equivalent to:

```text
closePromiseStatus == FULFILLED
AND closingCloseErrorRecords.length == 0
```

Invalid/malformed close-stage capture is represented as a normalized synthetic
close-error record, so it cannot bypass condition 2.

### 5.2 Corrected lifecycle algorithm

The complete lifecycle is equivalent to:

```text
vitest = undefined
candidateBytes = undefined
primaryDiagnostic = undefined
closePromiseDiagnostic = undefined
closingStderrRecords = []

phase = CREATING
try:
  vitest = await createVitest(..., stderr = publicCaptureWritable)

  phase = COLLECTING
  collected = await collectSemanticInventory(vitest)  // wrapper entry once

  phase = VALIDATING_OR_ENCODING
  identities = validateStructuredInventory(collected)
  candidateBytes = encodeCandidateFromSameCollection(identities)
catch error:
  primaryDiagnostic = retainSafeDiagnostic(error, phase)
finally:
  if vitest is not undefined:
    phase = CLOSING
    try:
      await vitest.close()                             // public call once
    catch error:
      closePromiseDiagnostic = retainSafeDiagnostic(error, CLOSING)

    closingStderrRecords =
      normalizeAndClassify(capture.recordsWherePhaseIs(CLOSING))

closeErrorRecords =
  closingStderrRecords where classification is CLOSE_ERROR

if closePromiseDiagnostic exists OR closeErrorRecords is not empty:
  classification = CLOSE_FAILED
  candidateBytes = undefined

emit deterministic diagnostics, preserving primary and close channels

if primaryDiagnostic exists OR classification is CLOSE_FAILED:
  candidateBytes = undefined
  do not publish candidate
  fail

phase = PUBLISHING
atomic publish candidateBytes in final path directory
phase = SUCCEEDED
```

The pseudocode is semantic and does not authorize a new implementation file.
If create rejects, `vitest` remains undefined, the close block is not entered
and no close obligation is fabricated.

### 5.3 Close failure cases

Each of these is `CLOSE_FAILED`:

- public `close()` rejects;
- public `close()` fulfills but one or more normalized close-error records were
  captured during `CLOSING`;
- public `close()` rejects and close-error records were also captured; or
- close-stage capture is invalid and produces
  `CLOSE_DIAGNOSTIC_CAPTURE_INVALID`.

For every close failure:

- candidate bytes are immediately discarded from memory;
- no temporary candidate file is opened;
- no final candidate is published;
- process outcome is non-zero;
- close Promise and close stderr diagnostics are both retained when both
  exist; and
- no error overwrites another error.

### 5.4 Primary plus close failure

If collection, validation or encoding already produced a primary diagnostic
and close then rejects or produces a close-error record:

- the primary diagnostic remains primary;
- all close diagnostics remain close diagnostics;
- external reporting contains both channels in the fixed order in section 6;
- candidate bytes are undefined;
- no publication operation begins; and
- terminal classification includes `CLOSE_FAILED` without erasing the primary
  classification.

### 5.5 Fulfilled clean close and warning-only close

If public close fulfills and there are zero close-error records, close
succeeds. Candidate publication is permitted only if create, collect,
validation and encoding also succeeded.

A non-error close diagnostic remains visible under section 4.3 but does not
change the exact close-success result. The normal real-workspace acceptance
case is stricter evidence: public close fulfills, the total close-stage stderr
record count is zero, candidate publication succeeds and the process exits
naturally.

## 6. Deterministic external diagnostic contract

### 6.1 No raw diagnostic leak

Raw public stderr bytes are evidence for normalization but are not copied
blindly to external output. Each retained record passes through the inherited
safe diagnostic/redaction boundary. Candidate bytes, credentials, canonical
game secrets and unredacted machine-local absolute paths must never be emitted.

### 6.2 Stable serialization and ordering

External lifecycle diagnostics use one UTF-8 JSON object per line with exactly
these keys in this order:

```text
phase
classification
source
ordinal
name
message
```

Every line is `JSON.stringify(record) + LF`. Strings use JSON escaping, so
embedded LF/CR cannot create extra records. No timestamp, locale-sensitive
value, random ID or environment-dependent collation is permitted.

Records are emitted in this deterministic order:

1. the primary create/collect/validation/encoding diagnostic, if any;
2. the public close Promise rejection diagnostic, if any;
3. normalized close-error stderr records in capture ordinal order; and
4. normalized non-error close stderr records in capture ordinal order.

The fixed `source` values are:

- `PUBLIC_PROMISE_REJECTION`;
- `PUBLIC_INJECTED_STDERR`; and
- `PUBLIC_INJECTED_STDERR_CAPTURE`.

The fixed close classifications are:

- `CLOSE_FAILED` for a public Promise rejection;
- `CLOSE_FAILED` for a normalized `error during close` record;
- `CLOSE_DIAGNOSTIC_CAPTURE_INVALID` for capture integrity failure; and
- `CLOSE_STDERR_NON_ERROR_DIAGNOSTIC` for preserved non-error output.

`ordinal` is the local diagnostic ordinal within the corresponding fixed
output category, beginning at zero. `name` and `message` use the inherited
safe normalization; absent names are the empty string. Equivalent injected
inputs therefore produce byte-identical external diagnostic bytes.

### 6.3 Outcome invariants

An observable close error always produces non-zero exit, `CLOSE_FAILED`, no
candidate and no partial final artifact, even when public close fulfilled.
Warnings are preserved deterministically rather than silently consumed.
Successful actual integration has no close diagnostic output and exits
naturally.

## 7. Existing twelve self-test groups with bounded extensions

The parent override's twelve group IDs remain exact. There is no thirteenth
group and no new script or test file. Only groups 2, 6, 7 and the already-real
resource integration assertions in group 12 gain the following subcases.

### Group 2 — create/collect/close success

Retain the existing clean-success assertions and add:

- public close fulfills;
- normalized close-error record count is zero;
- with zero total close-stage diagnostics, candidate publication occurs once;
- with a fulfilled close plus a non-error stderr warning, the warning is
  preserved in deterministic external diagnostics, is not mislabeled
  `CLOSE_FAILED`, and candidate publication still occurs once; and
- repository collection wrapper entry and close call counts remain exactly
  one.

### Group 6 — close failure

Group 6 contains both required close-failure subcases:

1. public close rejects: `CLOSE_FAILED`, no candidate; and
2. public close fulfills but injected stderr records
   `error during close` during `CLOSING`: `CLOSE_FAILED`, error record retained,
   in-memory candidate bytes discarded and no candidate published.

It also proves the classification boundary: a sentinel substring not anchored
at character zero is retained as a non-error diagnostic, not silently dropped
and not promoted to a close error.

### Group 7 — primary plus close failure

Retain primary-plus-close-rejection and add:

- a collection/validation/encoding primary failure;
- public close fulfills;
- injected stderr records `error during close` during `CLOSING`;
- primary and close diagnostic channels are both present in fixed output
  order;
- neither diagnostic overwrites the other; and
- no candidate is published.

### Group 12 — actual public close and natural exit

The real Vitest `3.2.6` integration must prove:

- one returned instance receives one public close call;
- the public close Promise fulfills;
- total public injected stderr record count during `CLOSING` is zero;
- normalized close-error record count is zero;
- no private `closingPromise` or hook-order observation occurs;
- no watch resource hangs; and
- the command exits naturally under the existing harness and timeout policy.

All other groups remain exactly as frozen:

1. create rejection;
3. collection failure;
4. validation failure;
5. encoding failure;
8. atomic candidate-write failure;
9. deterministic repeated candidate bytes;
10. one repository collection-wrapper entry with no internal glob assertion;
11. real `1572` identities / `12` LF titles / literal LF preservation; and
12. the resource-close integration above.

No new timeout, sleep, polling threshold, watchdog, process split or profile is
authorized.

## 8. Exact future implementation allowlist

Only a future independent `RULE_DESIGN_PASS` with `remainingBlockers=[]` may
authorize implementation. The exact inherited eleven-file upper bound remains:

1. `scripts/vitest-ownership-contracts.mjs`
2. `scripts/verify-vitest-ownership-contracts.mjs`
3. `scripts/verify-vitest-coverage-groups.mjs`
4. `.github/workflows/ci.yml`
5. `packages/application/src/game-application-service.test.ts`
6. `packages/domain-core/src/rebuild.test.ts`
7. `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
8. `docs/agent-loop/CURRENT_TASK.md`
9. `docs/agent-loop/PROJECT_STATE.md`
10. `docs/agent-loop/AUTOPILOT_STATE.json`
11. `docs/agent-loop/AUTOPILOT_LOG.md`

It is an upper bound, not a requirement to modify every file. Explicitly
forbidden remain:

- a new script or test file;
- production code;
- mathematician test-title files or any LF-title rewrite;
- `vitest.workspace.ts`;
- `package.json`;
- `pnpm-lock.yaml`;
- a new workspace project, ordinary/coverage process group or profile;
- timeout or dependency changes;
- Linux worker-RPC or Windows W7 remediation;
- product PR #46 mutation; and
- the next slice.

## 9. Independent correction review gate

The next independent read-only reviewer must inspect:

- this complete standalone correction;
- the immutable parent override and verbatim Round-1 review;
- locked Vitest `3.2.6` public `VitestOptions.stderr` and `close()` evidence;
- observable capture/normalization and external diagnostic boundaries;
- inherited LF, candidate, topology and allowlist contracts; and
- all four active controls.

The review must decide whether `LFC1` is closed by:

- Promise fulfillment plus zero normalized close-error records as the exact
  close-success condition;
- fulfilled-with-`error during close` mapping to `CLOSE_FAILED`;
- primary and close diagnostic preservation;
- candidate-byte discard and no publication for every close error;
- warning preservation without arbitrary swallowing;
- exact public phase/capture boundaries;
- deterministic safe external diagnostics;
- bounded extensions to existing groups 2/6/7 and actual group-12 integration;
  and
- no private field or hook-order dependency.

Valid verdicts remain:

- `RULE_DESIGN_PASS`;
- `RULE_DESIGN_FIX_REQUIRED`; or
- `HUMAN_BLOCKED`.

Implementation remains unauthorized unless one complete independent review of
this correction returns exact `RULE_DESIGN_PASS` with
`remainingBlockers=[]`. A wholly in-scope fix-required verdict may use the
final docs/control-only lifecycle Correction `2/2`; it consumes no
Infrastructure Repair. An out-of-scope requirement, public-evidence conflict,
`HUMAN_BLOCKED` verdict or non-pass after Correction 2 stops the lifecycle
design.

This correction creates no candidate, runs no test or coverage gate, changes
no implementation file, consumes no Infrastructure Repair, pushes nothing,
creates no PR and performs no Linux/Windows investigation.

`READY_FOR_INDEPENDENT_2B20AP1_PUBLIC_VITEST_LIFECYCLE_OVERRIDE_CORRECTION_1_REVIEW`
