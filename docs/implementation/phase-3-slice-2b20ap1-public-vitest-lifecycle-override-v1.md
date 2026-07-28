# Phase 3 Slice 2B20AP1 — Public Vitest Lifecycle Override v1

## 1. Authority, identity and frozen ancestry

| Field | Frozen value |
|---|---|
| Override ID | `2B20AP1-PUBLIC-VITEST-LIFECYCLE-OVERRIDE-V1` |
| Authorization | `USER_AUTHORIZED_2B20AP1_PUBLIC_VITEST_LIFECYCLE_OVERRIDE_AND_LOCAL_END_TO_END_CLOSURE` |
| Classification | `BOUNDED_PUBLIC_API_LIFECYCLE_REPLACEMENT / NON_PRODUCT / DOCS_CONTROL_ONLY` |
| Repository branch | `infra/2b20ap1-ownership-supersession-routing-v1` |
| Materialization parent HEAD | `0b895c4a2056fbe2bac41802b3a5efd6dcc82600` |
| Accepted product/base HEAD | `167d800e20bed5431764092877085886df4b7c93` |
| Frozen product PR | `#46`, open and unchanged |
| Frozen remote product HEAD | `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8` |
| Governance authority | `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md` |
| Governance SHA-256 | `583f1778582c168935b380b19e453117b000d8caf18dd3a4cd7731365cdb3537` |
| Parent design authority | `docs/implementation/phase-3-slice-2b20ap1-design-round-3.md` |
| Parent design SHA-256 | `4f2fab7b877ca98e1fb46974661874353dd78a1c6b388cb91d3031c59608e003` |
| Parent design review | `docs/implementation/phase-3-slice-2b20ap1-design-review-round-3.md` |
| Parent design review SHA-256 | `25489a5f49b599c62a7db5c69e50d7f2948df9c7c106669189184454cc393d14` |
| Latest LF authority before this override | `docs/implementation/phase-3-slice-2b20ap1-lf-safe-identity-encoding-amendment-v1-correction-2.md` |
| Latest LF authority SHA-256 | `2b07ac52427a9bd95ee535e71de37d6d0a7c2eb662b28048115ce4377d09b10c` |
| Final LF review | `docs/implementation/phase-3-slice-2b20ap1-lf-safe-identity-encoding-amendment-review-final.md` |
| Final LF review SHA-256 | `df96cfa33fb2c23e570896ab3722d1ceece6f223568301a3459eac135960a1b9` |
| Vitest version | `3.2.6` |
| Node / pnpm | Node `24.15.0`; pnpm `11.7.0` |
| Design-round classification | `NOT_DESIGN_ROUND_4` |
| Infrastructure Repair | `0/2` |
| Implementation authorized | `false` |
| Candidate authorized in this materialization | `false` |
| Review state | `HUMAN_BLOCKED / PENDING_INDEPENDENT_2B20AP1_PUBLIC_VITEST_LIFECYCLE_OVERRIDE_REVIEW` |
| Required next action | `RUN_INDEPENDENT_2B20AP1_PUBLIC_VITEST_LIFECYCLE_OVERRIDE_REVIEW` |

This document is the complete bounded replacement authority for the Vitest
creation, collection, validation/encoding, close, diagnostics and candidate
publication lifecycle. It does not amend rules, product behavior, canonical
test identities, accepted ownership hashes, test titles, ownership topology,
coverage profiles, process groups, timeouts or dependencies.

This document is not Correction 3 and is not Design Round 4. The Round 3 design,
its passing independent review, the LF amendment, both LF corrections and all
three LF review reports remain immutable historical evidence. Where Correction
2 or its predecessors prescribe internal Vitest timing, internal discovery
invocation counts, private close state or cleanup before `createVitest` returns,
this override controls. All compatible Round 3 and LF-safe identity/candidate
contracts remain inherited.

No materialization commit SHA is recorded here. The eventual docs/control
commit cannot be part of its own pre-commit authority.

## 2. Exact scope and inherited contracts

### 2.1 Replaced lifecycle surface

Only these contracts are replaced:

1. the meaning of a rejected `createVitest` call;
2. the authoritative collection-entry count;
3. diagnostic phase attribution;
4. close ownership and close-failure behavior;
5. the point at which candidate bytes may become externally visible; and
6. self-tests needed to prove those public, repository-observable boundaries.

The implementation must use documented/public Vitest `3.2.6` APIs exported
from `vitest/node`. It must not inspect, patch or assert private hooks, private
fields, generated chunk internals, `closingPromise`, internal Vite server
cleanup ordering or Vitest's internal calls to glob discovery.

### 2.2 Inherited identity and candidate authority

The following contracts remain frozen and are not reopened:

- canonical semantic identity is the exact tuple
  `[project,file,ancestorPath,title]`;
- title content is data, so LF, CR and CRLF inside any string field are
  preserved literally and are never used as record framing;
- canonical inventory encoding remains
  `vitest-semantic-identity-json-tuple-v1`;
- canonical inventory bytes remain
  `UTF-8(JSON.stringify(sortedCanonicalTuples) + LF)`;
- tuple ordering remains the already-frozen locale-independent ordinal
  ordering;
- all `1572` semantic identities, including exactly `12` legal LF-bearing
  titles, remain in scope;
- duplicate tuples, projection collisions, non-canonical paths, sparse
  ancestor paths and malformed structured results fail closed;
- accepted ownership contracts remain ordered
  `2B19A3A, 2B19A3B1, 2B19A3B2, 2B19B`;
- candidate schema remains exact
  `vitest-ownership-candidate-baseline-v2`, including all ten ordered
  top-level keys and complete embedded identity/baseline data;
- candidate verification remains raw-byte-first before JSON parsing;
- the twelve mathematician titles are unchanged; and
- no accepted inventory migration or dual-hash bridge is introduced.

Candidate bytes are derived from one successful collection result held in
memory. No external raw `vitest list --json` inventory, raw LF-delimited
intermediate representation or title rewrite may be introduced.

### 2.3 Unchanged project boundaries

The following remain `false`:

- `ruleSemanticsChanged`;
- `productBehaviorChanged`;
- `productionCodeChanged`;
- `testIdentityChanged`;
- `testTitleChanged`;
- `ownershipTopologyChanged`;
- `coverageProfileChanged`;
- `coverageProjectChanged`;
- `processGroupChanged`;
- `timeoutChanged`;
- `dependencyChanged`; and
- `infrastructureRepairRoundConsumed`.

Linux worker-RPC CI closure and Windows W7 unknown-exit closure remain
downstream work. They are not investigated or claimed closed by this override.

## 3. Historical findings and replacement disposition

The final Correction 2 review remains authoritative history. Its findings are
not renamed, deleted or reconstructed as new blockers. The new user
authorization supplies a bounded replacement contract for each one:

| Historical finding | Replacement disposition | Current meaning |
|---|---|---|
| `LF3-DIAGNOSTIC_PHASE_PRECEDES_CREATEVITEST_RETURN` | `DESIGN_CONTRACT_REPLACED_BY_PUBLIC_API_PHASE_AWARE_DIAGNOSTICS` | Diagnostics observed while awaiting `createVitest` belong to the repository wrapper's observable create phase. No private emission-order gate exists. |
| `LF1-GLOB_INVOCATION_COUNT_CONTRADICTION` | `INTERNAL_INVOCATION_COUNT_NOT_AN_ACCEPTANCE_AUTHORITY` | The repository collection wrapper is entered exactly once after successful creation. Vitest's internal glob calls are non-authoritative. |
| `LF3-CREATEVITEST_PRE_RETURN_CLOSE_UNPROVABLE` | `PRE_RETURN_CLOSE_NOT_REQUIRED_AND_NOT_EXPRESSIBLE` | If `createVitest` rejects, no usable instance was returned to the caller and the caller has no close obligation or permitted private recovery path. |

These three IDs remain historical findings only. While this override awaits
independent review, the active design blocker is exactly
`PENDING_INDEPENDENT_2B20AP1_PUBLIC_VITEST_LIFECYCLE_OVERRIDE_REVIEW`.
The independent reviewer must decide whether the replacement contract is
acceptable; the controller or implementer must not manufacture closure.

## 4. Observable public lifecycle contract

### 4.1 Repository-owned wrapper boundary

Each emit or verify CLI invocation owns one top-level lifecycle operation. Once
and only once after `createVitest` successfully returns a `Vitest` instance, it
enters the repository-owned `collectSemanticInventory` wrapper. That wrapper
uses only the public Vitest `3.2.6` surface:

- `globTestSpecifications(filters?)`;
- `collect(filters?)` or `collectTests(specifications)`; and
- structured `TestModule` / `TestCase` results and their public collection
  traversal.

The exact implementation may use public `collect(filters?)`, or public
`globTestSpecifications` followed by public `collectTests(specifications)`, so
long as the repository-owned `collectSemanticInventory` wrapper is entered
exactly once and produces one structured collection result. The wrapper-entry
count is the acceptance authority. Vitest may internally perform any number of
glob operations; no self-test, integration test or verifier may freeze or infer
that private invocation count.

Collection may load test modules because that is part of public Vitest
collection. The lifecycle must not invoke test case callbacks or run test
bodies. Missing public APIs, malformed results, collection diagnostics that
represent failure, or thrown/rejected collection errors fail closed.

### 4.2 Frozen lifecycle algorithm

The required control flow is equivalent to:

```text
vitest = undefined
candidateBytes = undefined
primaryError = undefined
closeError = undefined

phase = CREATING
try:
  vitest = await createVitest(...)

  phase = COLLECTING
  collected = await collectSemanticInventory(vitest)  // wrapper entry: once

  phase = VALIDATING_OR_ENCODING
  identities = validateStructuredInventory(collected)
  candidateBytes = encodeCandidateFromSameCollection(identities)
catch error:
  primaryError = retainSafeDiagnostic(error, phase)
finally:
  if vitest is not undefined:
    phase = CLOSING
    try:
      await vitest.close()
    catch error:
      closeError = retainSafeDiagnostic(error, phase)

if primaryError or closeError:
  publishFailureDiagnostics(primaryError, closeError)
  do not publish candidate
  fail

phase = PUBLISHING
publish candidateBytes by same-directory atomic replacement
phase = SUCCEEDED
```

The pseudocode is semantic, not permission to create new files outside the
future implementation allowlist. `candidateBytes` must remain private,
unpublished memory until successful close. The candidate must not be written
early and renamed later after a failed close.

### 4.3 Create phase

The repository wrapper sets observable phase `CREATING` before awaiting
`createVitest`. Any warning or deprecation received through the wrapper's
diagnostic capture while that promise is pending is a create-stage diagnostic.
The awaited public promise outcome and captured diagnostic record are
authoritative. No assertion may depend on an internal Vitest hook, source
chunk, Vite server sub-phase or whether a diagnostic text was emitted before
some private initialization step.

If `createVitest` rejects:

- the terminal failure classification is `CREATE_FAILED`;
- the caller received no usable Vitest instance;
- repository collection is not entered;
- repository close is not attempted;
- no candidate bytes are encoded, written or published;
- safe diagnostic name, message and stack may be retained; and
- the implementation must not claim or fabricate proof of cleanup for an
  instance or resource that public `createVitest` did not return.

Warnings or deprecations are captured and normalized as diagnostics without
being promoted into a private ordering acceptance gate. Success-facing stderr
remains controlled by the existing CLI contract, but the implementation must
not require the exact Correction 2 raw diagnostic phase, exact ANSI form,
exact occurrence count or internal source location to prove lifecycle safety.

### 4.4 Collection phase

After successful creation:

- observable phase becomes `COLLECTING`;
- `collectSemanticInventory` is entered exactly once;
- collection uses only the public APIs listed in section 4.1;
- canonical data comes from structured `TestModule` / `TestCase` objects;
- raw and structured projections, if both needed for inherited compatibility
  validation, come from the same returned structured collection;
- no raw LF line framing is used; and
- no test callback or test body is executed.

If collection throws, rejects, reports an unhandled collection failure, omits a
required public API or returns malformed structured data:

- terminal failure classification is `COLLECT_FAILED`;
- the returned instance is closed exactly once;
- no candidate is published; and
- diagnostic data is retained without leaking canonical secret state.

### 4.5 Validation and encoding phase

After successful collection, observable phase becomes
`VALIDATING_OR_ENCODING`. The implementation must:

1. walk the one structured result deterministically;
2. derive exact tuples `[project,file,ancestorPath,title]`;
3. preserve embedded LF, CR and CRLF characters as string data;
4. validate canonical project and repository-relative file paths;
5. validate dense, ordered ancestor paths;
6. fail on duplicate identities or lossy projection collisions;
7. order tuples with the frozen locale-independent ordinal comparator;
8. encode inventory using `vitest-semantic-identity-json-tuple-v1`; and
9. encode exact candidate schema
   `vitest-ownership-candidate-baseline-v2`.

Validation failure and encoding failure both classify as
`VALIDATE_OR_ENCODE_FAILED`. Either failure closes the returned instance
exactly once and publishes no candidate. No title, ancestor or file component
may be altered to make encoding easier.

### 4.6 Close phase

If and only if `createVitest` returned an instance, observable phase eventually
becomes `CLOSING` and repository code calls public `vitest.close()` exactly
once. This applies after:

- collection success;
- collection failure;
- validation failure;
- encoding failure; and
- successful in-memory candidate encoding.

Close is awaited. Candidate publication remains impossible until it resolves
successfully.

If close fails:

- terminal failure classification includes `CLOSE_FAILED`;
- no candidate is published;
- if no prior error exists, the close error is the primary observable failure;
- if a collection, validation or encoding error already exists, both that
  primary error and the close error are retained in deterministic diagnostics;
  neither replaces or hides the other; and
- any candidate bytes already encoded in memory are discarded.

No pre-return close is required or expressible when `createVitest` rejects. No
`configureServer` close, internal close-order proof or private
`closingPromise` observation is permitted.

### 4.7 Candidate publication phase

Candidate publication begins only after create, collection, validation,
encoding and close all succeed. It must use same-directory atomic publication:

1. validate the final candidate path;
2. create a uniquely owned temporary file in the final file's directory;
3. write the complete candidate bytes;
4. close the temporary file successfully;
5. atomically replace or rename it to the final path using an equivalent
   same-filesystem operation; and
6. remove the owned temporary file on failure when safely possible.

The final path must never expose partial bytes. Any path validation, temporary
creation, write, close, replacement or cleanup-related publication failure
classifies as publication failure, exits non-zero and leaves no partial final
candidate. An existing final candidate must not be partially overwritten. A
clean rerun after failure must be possible.

Candidate output is therefore a publication result, not evidence that earlier
lifecycle phases merely began. No caller may consume candidate bytes before
atomic publication succeeds.

### 4.8 Diagnostic and failure invariants

Observable wrapper phases are:

- `CREATING`;
- `COLLECTING`;
- `VALIDATING_OR_ENCODING`;
- `CLOSING`;
- `PUBLISHING`; and
- `SUCCEEDED`.

Failure classifications are:

- `CREATE_FAILED`;
- `COLLECT_FAILED`;
- `VALIDATE_OR_ENCODE_FAILED`;
- `CLOSE_FAILED`; and
- `PUBLISH_FAILED`.

Diagnostics record the wrapper phase active when the public operation settled
or failed. They may retain safe error name, message and stack plus primary/
close distinction. They must not expose candidate bytes, accepted baseline
contents beyond existing public repository data, credentials or canonical
game secrets. Every failure path exits non-zero, publishes no new candidate
and leaves no partial final file.

## 5. Required future wrapper self-tests

Future implementation must extend the existing ownership verifier's existing
`--self-test` surface with exactly these twelve lifecycle groups. These are
groups, not permission to create a new script or test file.

1. **Create rejection** — `createVitest` rejects; repository collection is
   never entered, close is not called, no candidate is published and
   `CREATE_FAILED` is retained.
2. **Create/collect/close success** — create returns an instance, repository
   collection wrapper entry count is exactly one, public close count is exactly
   one and candidate publication count is exactly one.
3. **Collection failure** — collection fails, close count is exactly one, no
   candidate is published and `COLLECT_FAILED` is retained.
4. **Validation failure** — structured validation fails, close count is exactly
   one and no candidate is published.
5. **Encoding failure** — canonical/candidate encoding fails, close count is
   exactly one and no candidate is published.
6. **Close failure** — close rejects, no candidate is published and
   `CLOSE_FAILED` is retained.
7. **Primary plus close failure** — collection/validation/encoding failure and
   close failure occur together; deterministic diagnostics retain both and no
   candidate is published.
8. **Atomic candidate-write failure** — publication fails at an injected
   temporary-write/close/replace boundary and no partial final candidate
   remains.
9. **Deterministic repetition** — two independent successful generations
   produce byte-identical candidate output.
10. **Authoritative wrapper entry** — repository
    `collectSemanticInventory` entry count is exactly one; the test contains no
    assertion about Vitest's internal `globTestSpecifications` invocation
    count.
11. **Real Vitest 3.2.6 integration** — the actual workspace yields exactly
    `1572` semantic identities and exactly `12` LF-bearing titles; literal LF
    data survives structured encoding, candidate generation succeeds and the
    process exits normally.
12. **Real resource close/no hang** — real create/collection is followed by
    successful public close; no watch resource hangs, the command ends
    normally and the test never reads private `closingPromise`.

No fixed elapsed-time assertion or new timeout is introduced. “No hang” means
the command returns normally under the repository's existing harness and
timeout policy; it is not permission to add a sleep, polling threshold,
watchdog, process split or profile.

## 6. Required actual integration evidence

The future implementation turn must prove, using the real installed Vitest
`3.2.6` and the existing workspace:

- exactly `1572` structured semantic identities;
- exactly `12` identities with literal LF in `title`;
- zero title edits;
- exact LF-safe tuple encoding;
- deterministic candidate-v2 bytes across two successful generations;
- successful public close before publication;
- ordinary command exit with no hanging watch resources; and
- no access to private Vitest lifecycle fields.

This actual integration is separate from injected self-tests. A mock-only pass
cannot close the lifecycle contract. Conversely, internal Vitest glob count,
private diagnostic ordering and private pre-return resources are explicit
non-blockers and must not be asserted.

## 7. Exact future implementation allowlist

Only a future turn that first receives an independent
`RULE_DESIGN_PASS` with `remainingBlockers=[]` may modify the inherited exact
eleven-file implementation allowlist:

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

This allowlist does not require every file to change. It is an upper bound.
The future implementation must prefer the smallest sufficient diff.

Explicitly forbidden:

- any new script or test file;
- `packages/application/src/mathematician-information.test.ts`;
- any other mathematician title source;
- production code;
- `vitest.workspace.ts`;
- `package.json`;
- `pnpm-lock.yaml`;
- a new workspace project, coverage profile, process group, dependency or
  timeout;
- Linux/Windows remediation;
- product PR #46 mutation; and
- work on 2B20B or any next slice.

## 8. Independent review gate and stop condition

The independent read-only reviewer must inspect this override, the immutable
Round 3/LF chain, the public Vitest `3.2.6` API surface, current production
scripts/tests and all four controls. The review scope is the observable public
lifecycle and its explicit non-blockers:

- no returned instance means no caller close obligation;
- one repository collection-wrapper entry is authoritative;
- public collection APIs and structured results are sufficient;
- internal glob invocation count is not authoritative;
- diagnostics use observable wrapper phases;
- close exactly once for each successfully returned instance;
- primary and close failures are both retained;
- publication occurs only after successful close;
- atomic same-directory publication exposes no partial final; and
- the twelve self-test groups plus real `1572`/`12` integration and normal
  exit/no-hang evidence are sufficient and bounded.

The only valid review verdicts are:

- `RULE_DESIGN_PASS`;
- `RULE_DESIGN_FIX_REQUIRED`; or
- `HUMAN_BLOCKED`.

Implementation remains unauthorized unless one complete independent review
returns exact `RULE_DESIGN_PASS` with `remainingBlockers=[]`. Up to two
docs/control-only corrections may be requested by a
`RULE_DESIGN_FIX_REQUIRED` verdict when they remain within this user-authorized
public-lifecycle scope. Such corrections consume no Infrastructure Repair
round. A rule conflict, unavailable public evidence, out-of-scope requirement
or `HUMAN_BLOCKED` verdict stops the slice.

This materialization creates no candidate, runs no product test or coverage
gate, consumes no Infrastructure Repair round, pushes nothing, creates no PR
and starts no downstream investigation.

`READY_FOR_INDEPENDENT_2B20AP1_PUBLIC_VITEST_LIFECYCLE_OVERRIDE_REVIEW`
