# Phase 3 Slice 2B20B-P2F1R-D1 Global Vitest Ownership Baseline Migration — Design Round 1

## 1. Design identity

- `sliceId`: `2B20B-P2F1R-D1`
- `sliceName`: `Global Vitest Ownership Baseline Migration`
- `documentKind`: `STANDALONE_BOUNDED_DESIGN_ROUND_1`
- `designTarget`:
  `docs/architecture/2B20B-P2F1R-D1-global-vitest-ownership-baseline-migration-design-round-1.md`
- `designRound`: `1/2`
- `implementationRepairRound`: `0/2`
- `designRound3Authorized`: `false`
- `implementationRepairRound3Authorized`: `false`
- `implementationAuthorized`: `false`
- `designReviewRequired`: `RULE_DESIGN_PASS`
- `parentSlice`: `2B20B-P2F1R-D`
- `parentDStatus`: `FROZEN_UNACCEPTED_HUMAN_BLOCKED`
- `resliceKind`: `NEW_BOUNDED_RESLICE`
- `consumesParentDRepairRound`: `false`
- `createsParentDDesignCorrectionRound3`: `false`

## 2. Authority and inspected state

This design is based on the clean local worktree:

- path:
  `C:\Users\wjl\AppData\Local\Temp\botc-d1-ownership-baseline`
- branch:
  `phase-3/2b20b-p2f1r-d1-ownership-baseline-migration`
- exact design HEAD:
  `992248f4220ddee99283f9cfa3bf3fbf297d6836`
- parent:
  `3d03590b7945290bf8aff9efc0156c71b2267847`
- local porcelain: empty
- upstream tracking branch: none
- remote D1 branch: absent
- open GitHub pull requests: none
- exact-head hosted CI for `992248f4220ddee99283f9cfa3bf3fbf297d6836`:
  absent
- remote `main`:
  `0dc046aa62b3a72cbd97d99808e0932bf408a09c`

The latest hosted CI belongs to older accepted or merged heads and supplies no D1 authority.

The D1 precheck and rule evidence were created at research HEAD
`3d03590b7945290bf8aff9efc0156c71b2267847` and are present unchanged at the design HEAD. Their conclusions remain applicable because the only later commit materialized those two D1 governance documents; no production, test, ownership-script, workflow, rule, or role-matrix change intervened.

Mandatory rule-truth order is satisfied:

- fresh rule research checked the user overrides, fixed Chinese Wiki revision, fixed official BOTC Wiki revision, and pinned official nightsheet;
- the sole writer materialized
  `docs/rules/evidence/2B20B-P2F1R-D1.md`;
- all required sources were available;
- `applicableOverrides=[]`;
- `unresolvedConflicts=[]`;
- the exact rule-researcher verdict is `RULE_READY`.

This design does not infer rule truth from code, tests, README files, or model memory.

## 3. Current role coverage

The current `docs/rules/ROLE_COVERAGE_MATRIX.md` was read before design.

D1 involves no BOTC roles:

- `involvedRoles=[]`
- `ruleCoverageStatus=SKELETON`
- `sliceCoverageTarget=NON_ROLE_OWNERSHIP_BASELINE_MIGRATION`
- `roleCoverageChanged=false`
- `ROLE_COVERAGE_MATRIX` edits: `0`
- role promotions: none
- no incomplete role becomes `COMPLETE`

Dreamer, Philosopher, Mathematician, and all other existing role statuses remain exactly as recorded in the current matrix.

## 4. Primary risk and design objective

D1 has exactly one primary risk:

> Migrate the global Vitest ownership authority from one immutable accepted 1572-identity baseline to a separately versioned, freshly materialized 1712-identity candidate without rewriting accepted history or silently replacing constants.

The implementation must maintain two authorities simultaneously:

1. `ACCEPTED_1572_V1` — immutable historical accepted authority.
2. `CANDIDATE_1712_D1_V1` — explicitly unaccepted D1 candidate.

No caller, report, validator, or CLI path may silently treat the candidate as the accepted baseline.

## 5. Frozen historical accepted authority

`ACCEPTED_1572_V1` freezes all of the following:

| Field | Exact value |
|---|---:|
| Semantic identities | `1572` |
| LF-sensitive identities | `12` |
| Canonical inventory SHA-256 | `58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8` |
| Serialized candidate bytes | `391257` |
| Serialized candidate SHA-256 | `d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129` |
| Physical test files | `31` |
| Physical file-set SHA-256 | `55783dc1c8ff407b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab` |
| Identity encoding | `vitest-semantic-identity-json-tuple-v1` |

The accepted candidate remains serialized using its existing exact
`vitest-ownership-candidate-baseline-v2` runtime shape. No new field may be inserted into that accepted serialization because doing so would alter the frozen `391257` bytes and SHA-256.

The accepted materialization must reproduce all `391257` bytes exactly. A matching inventory count without the exact serialized hash is insufficient.

## 6. Frozen accepted ownership contracts

The five active accepted contracts remain in their current registry order:

1. `2B20A`
2. `2B19A3B2`
3. `2B19B`
4. `2B19A3B1`
5. `2B19A3A`

Every existing value remains immutable, including:

- contract IDs;
- criterion arrays and order;
- marker prefixes and patterns;
- application test files;
- owner projects;
- traceability files;
- supporting-authority prefixes;
- statuses;
- every frozen baseline count and hash.

The existing exported `ACCEPTED_CONTRACT_BASELINES` array also remains byte-for-byte and order-stable in its current four-entry form:

1. `2B19A3A`
2. `2B19A3B1`
3. `2B19A3B2`
4. `2B19B`

`2B20A` continues to be represented by the existing top-level `frozenBaseline` field in the accepted candidate shape. D1 must not insert it into, remove entries from, reorder, refresh, or regenerate `ACCEPTED_CONTRACT_BASELINES`.

The apparent difference between the five active contracts and the four exported historical contract-baseline entries is existing accepted structure, not a D1 defect to normalize.

## 7. Candidate authority requiring fresh materialization

`CANDIDATE_1712_D1_V1` is frozen as an expected result, but it must be obtained from a fresh real Vitest collection at implementation and review time.

| Field | Required exact value |
|---|---:|
| Semantic identities | `1712` |
| Canonical inventory SHA-256 | `540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2` |
| Physical test files | `36` |
| Physical file-set SHA-256 | `c8c0a52de9f52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0` |

The candidate serialized byte count and candidate-file SHA-256 are not copied from the precheck. They must be calculated from fresh materialization, recorded in the deterministic report, and reproduced byte-identically by a second independent collection in the same clean exact-HEAD environment.

The candidate remains labeled:

- `baselineVersion=CANDIDATE_1712_D1_V1`
- `acceptanceStatus=UNACCEPTED_CANDIDATE`

No green local command, ownership report, or CI run alone may change that status.

## 8. Identity and ordering invariants

D1 must not change identity generation.

The canonical identity remains exactly:

```text
(project, file, ancestorPath, title)
```

The concrete serialized tuple remains exactly:

```text
[project, file, ancestorPath, title]
```

The following existing functions and semantics remain authoritative and unchanged:

- `IDENTITY_ENCODING_VERSION`
- `structuredIdentityTuple`
- `compactStructuredIdentityTuple`
- `canonicalizeRawVitestInventory`
- `canonicalizeStructuredVitestIdentities`
- `structuredInventoryBytes`
- `structuredInventorySha256`
- repository-relative forward-slash file normalization
- LF preservation inside tuple string fields
- duplicate tuple rejection

All tuple ordering, set ordering, file ordering, per-file summaries, contract ordering, report arrays, and hashing inputs use the existing ordinal comparator:

```text
left < right ? -1 : left > right ? 1 : 0
```

Forbidden canonical ordering or identity inputs remain:

- `localeCompare`
- `Intl.Collator`
- environment locale
- filesystem enumeration order
- object insertion order as an unvalidated source of authority
- `Date.now`
- `Math.random`
- random UUIDs

Input permutation must not alter output bytes.

## 9. Exact accepted/candidate delta

After authenticating both versions, the implementation must compute set relations using compact canonical tuple identity.

Required exact delta:

| Metric | Exact result |
|---|---:|
| Accepted identities | `1572` |
| Candidate identities | `1712` |
| Intersection | `1572` |
| Union | `1712` |
| Added | `140` |
| Removed | `0` |
| Duplicate | `0` |
| Borrowed | `0` |
| Missing | `0` |
| Wrong owner | `0` |

The increment is limited to these five files:

| File | Added identities |
|---|---:|
| `packages/domain-core/src/canonical-runtime-value.test.ts` | `52` |
| `packages/domain-core/src/canonical-runtime-hash.test.ts` | `14` |
| `packages/domain-core/src/domain-event-structural-schema-ast.test.ts` | `25` |
| `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts` | `21` |
| `packages/domain-core/src/domain-event-structural-validator.test.ts` | `28` |
| Total | `140` |

The canonical five-file increment-set SHA-256 is:

```text
ddfa7a0070c6c4d08a6665a9b138f5aaae71cef02a82a5ce5190f9ccabc7a032
```

The accepted view may be projected from the fresh candidate only by excluding this exact five-file increment and then authenticating the result against all frozen accepted values, including the exact `391257` serialized bytes and
`d8ae2d1f...9129` hash. File exclusion alone is not accepted authority.

This is not constant replacement:

- the old builder and accepted serialization remain the accepted path;
- the new candidate uses a distinct versioned builder and runtime shape;
- the accepted constants are independently checked;
- the candidate values are independently checked;
- set-delta proof binds the two.

If an accepted identity is absent, altered, renamed, moved, or re-owned, accepted authentication fails. It must not be compensated for by another addition.

Any observed or inferable `removed > 0` is immediately:

```text
HUMAN_BLOCKED / ACCEPTED_1572_HISTORY_REMOVAL
```

It is not a repairable architecture choice.

## 10. Explicit version dispatch

Every candidate emit, verify, or migration-report operation must receive an explicit baseline selector.

Allowed selector values are exactly:

```text
ACCEPTED_1572_V1
CANDIDATE_1712_D1_V1
```

There is no default, “latest,” environment-derived, branch-derived, count-derived, or fallback version.

The dispatcher is a closed pure function:

```text
selectOwnershipBaseline(version)
```

Required outcomes:

- `ACCEPTED_1572_V1` selects the immutable accepted builder and specification.
- `CANDIDATE_1712_D1_V1` selects the D1 candidate builder and specification.
- missing, duplicated, malformed, non-string, or unknown selectors fail with a stable public error code.
- no path selects a version from the observed identity count.
- no candidate mismatch falls back to accepted or vice versa.

Exact CLI forms introduced by D1 are:

```text
node scripts/verify-vitest-ownership-contracts.mjs --emit-candidate-baseline 2B20A --workspace vitest.workspace.ts --baseline-version ACCEPTED_1572_V1 --output <os-temp-file>
```

```text
node scripts/verify-vitest-ownership-contracts.mjs --emit-candidate-baseline 2B20A --workspace vitest.workspace.ts --baseline-version CANDIDATE_1712_D1_V1 --output <os-temp-file>
```

```text
node scripts/verify-vitest-ownership-contracts.mjs --verify-candidate-baseline 2B20A --workspace vitest.workspace.ts --baseline-version <exact-version> --candidate <os-temp-file>
```

```text
node scripts/verify-vitest-ownership-contracts.mjs --verify-ownership-baseline-migration 2B20B-P2F1R-D1 --workspace vitest.workspace.ts --baseline-version CANDIDATE_1712_D1_V1 --candidate <os-temp-file>
```

Argument count, order, tokens, and paths remain closed. Extra, reordered, duplicated, or trailing arguments reject.

`--self-test` remains its own exact one-token mode.

## 11. Candidate and report runtime shapes

### 11.1 Accepted candidate

The accepted artifact retains its existing exact V2 shape and bytes. D1 does not alter that shape.

### 11.2 D1 candidate

The D1 candidate has this exact key order and no additional keys:

```json
{
  "schemaVersion": "vitest-ownership-candidate-baseline-d1-v1",
  "baselineVersion": "CANDIDATE_1712_D1_V1",
  "acceptanceStatus": "UNACCEPTED_CANDIDATE",
  "contractId": "2B20A",
  "identityEncodingVersion": "vitest-semantic-identity-json-tuple-v1",
  "structuredIdentityCount": 1712,
  "lfIdentityCount": 12,
  "inventorySha256": "540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2",
  "physicalTestFileCount": 36,
  "physicalTestFileSetSha256": "c8c0a52de9f52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0",
  "structuredIdentities": [],
  "frozenBaseline": {},
  "acceptedContractBaselines": []
}
```

The displayed empty array and objects denote their existing full values:

- `structuredIdentities` contains all 1712 canonical tuples in ordinal order;
- `frozenBaseline` is the immutable authenticated `2B20A` accepted baseline calculated from the authenticated accepted view;
- `acceptedContractBaselines` is the unchanged existing four-entry export.

The shape validator must reject missing/extra fields, altered key types, nonplain objects, sparse or keyed arrays, symbols, accessors, proxies, cycles, invalid strings, noncanonical files, duplicate tuples, and out-of-order tuples.

### 11.3 Closed migration report

Successful migration verification emits exactly one UTF-8 JSON document followed by one LF. It contains no timestamp, absolute path, hostname, username, temporary path, stack, locale output, or nondeterministic identifier.

Exact top-level key order:

```text
schemaVersion
sliceId
identityEncodingVersion
acceptedVersion
candidateVersion
accepted
candidate
delta
increment
ownership
acceptedContracts
candidateArtifact
verdict
```

Required scalar values:

```text
schemaVersion = vitest-ownership-baseline-migration-report-v1
sliceId = 2B20B-P2F1R-D1
identityEncodingVersion = vitest-semantic-identity-json-tuple-v1
acceptedVersion = ACCEPTED_1572_V1
candidateVersion = CANDIDATE_1712_D1_V1
verdict = OWNERSHIP_BASELINE_MIGRATION_PASS
```

The nested sections record:

- all accepted count/hash/byte/file values;
- all candidate count/hash/file values;
- intersection `1572`, union `1712`, added `140`, removed `0`;
- the five ordinally sorted increment-file records and increment-set hash;
- duplicate/borrowed/missing/wrong-owner counts, each zero;
- the unchanged five-contract registry order;
- the unchanged four-entry `ACCEPTED_CONTRACT_BASELINES` order;
- freshly computed candidate artifact byte count and SHA-256.

Every nested object also uses a frozen closed key order. Validation completes before serialization or publication.

## 12. Validation and publication sequence

One operation uses this order:

1. Parse the exact CLI form.
2. Resolve the explicit version selector.
3. Create one real Vitest instance through the existing public lifecycle.
4. Collect through the existing public structured-identity source.
5. Close Vitest exactly once.
6. Canonicalize the complete raw inventory.
7. Authenticate the candidate inventory.
8. Derive the accepted view using the fixed increment-file boundary.
9. Authenticate the accepted view, including exact accepted bytes.
10. Validate all five accepted contracts without changing them.
11. Calculate and validate intersection, union, added, removed, duplicate, borrowed, missing, and wrong-owner results.
12. Validate the five-file increment and per-file counts.
13. Build and exact-shape validate the selected artifact.
14. Build and exact-shape validate the migration report when requested.
15. Encode deterministically.
16. Publish atomically or compare an existing candidate byte-for-byte.
17. Emit only the closed public success output.

No report or artifact may be written before every prospective check succeeds.

## 13. Atomicity, replay, retry, and historical stability

D1 adds no domain event flow, canonical game-state mutation, snapshot, projection, command receipt, or persistence schema.

Accordingly:

- domain-event batch semantics: unchanged;
- accepted event replay: unchanged;
- prospective domain-event validation: unchanged;
- player/AI/Storyteller projections: unchanged;
- delivered historical knowledge: unchanged;
- information truth, reliability, registration, constraints, and simulation reason: unchanged.

For D1’s file publication boundary, atomicity remains mandatory:

- destination creation uses the existing same-directory temporary file;
- temporary open remains exclusive;
- partial writes are completed or fail;
- bytes are flushed before close;
- rename is the only publication point;
- write, flush, close, or rename failure exposes neither a partial destination nor a leftover temporary file;
- an existing destination is not silently overwritten;
- verify mode performs no write;
- a failed collection, validation, encoding, or publication consumes no accepted state and changes no version status.

Retry boundaries:

- failures before publication are retryable after temporary cleanup;
- retry uses the same explicit version;
- identical input produces identical artifact and report bytes;
- a candidate failure never mutates or refreshes accepted constants;
- version mismatch, historical removal, contract mutation, or required hash mismatch is fail-closed and cannot be retried into acceptance by changing a constant.

## 14. Hostile-mutation coverage

The existing verifier self-test is extended inside
`scripts/verify-vitest-ownership-contracts.mjs`; no Vitest test file or identity is added.

Planned self-test groups:

- `38 D1 C01 immutable accepted 1572 history`
- `39 D1 C02 fresh 1712 materialization`
- `40 D1 C03 exact dual-baseline delta`
- `41 D1 C04 hostile ownership migration rejection`
- `42 D1 C05 explicit version dispatch and deterministic closed report`

The existing check count advances from `37` to `42`. Existing checks are not deleted or weakened.

Check 36 continues to prove the real accepted `1572 / 12 / 391257 /
d8ae... / 58bd... / 55783...` authority through the explicit accepted-version path. It is not changed to expect 1712.

Required hostile cases include:

- accepted count mutation;
- accepted LF count mutation;
- accepted inventory-hash mutation;
- accepted byte-count mutation;
- accepted candidate-hash mutation;
- accepted physical-file count or hash mutation;
- any accepted tuple removal, title change, suite-path change, project change, or file move;
- candidate count, inventory hash, file count, or file-set hash mutation;
- addition outside the exact five files;
- incorrect per-file increment count;
- increment-file-set hash mutation;
- duplicate tuple;
- borrowed identity;
- missing identity;
- wrong project or wrong owner;
- accepted contract value, order, marker, project, or hash mutation;
- `ACCEPTED_CONTRACT_BASELINES` content or order mutation;
- missing or unknown version;
- version selected from count or implicit fallback;
- sparse, keyed, inherited, symbol-bearing, getter-bearing, nonplain, cyclic, or proxy-backed records and arrays;
- extra or missing report/candidate fields;
- out-of-order tuple or report arrays;
- CR in a frozen identity;
- input-order reversal;
- Windows/POSIX repository-root differences;
- first and second fresh candidate bytes differing;
- write, close, or rename failure exposing a partial artifact.

Hostile inputs must fail with stable public codes and must not invoke getters, expose private paths, publish bytes, or emit a success verdict.

## 15. Reachability inventory

Every D1 criterion has exactly one primary class.

- `R1 CURRENTLY_REACHABLE_APPLICATION_PATH`: `[]`
- `R2 LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`: `[]`
- `R3 HOSTILE_OR_CORRUPTED_HISTORY`:
  `[D1-C02, D1-C03, D1-C04]`
- `R4 FUTURE_HYPOTHETICAL_STATE`:
  `[D1-C01, D1-C05]`

D1 does not claim an accepted application stream, application command, legacy domain replay, domain projection, or current player-visible behavior.

No D1 criterion owns, borrows, replaces, or covers any C, C1, CE, D0, or parent-D primary. In particular:

- `D-C01` is out of scope;
- `D-C03` is out of scope;
- publication, hosted evidence, Windows domain-core execution, routing, and coverage-profile work are out of scope.

## 16. Design-time traceability

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `D1-C01` | No BOTC rule claim; immutable accepted engineering history must not be reinterpreted. | Explicit `ACCEPTED_1572_V1` materialization reproduces `1572`, `12`, `58bd...`, `391257`, `d8ae...`, `31`, `55783...`, the five accepted contracts, and unchanged `ACCEPTED_CONTRACT_BASELINES` content/order. | Pure version-policy selection followed by exact deterministic accepted-artifact reproduction; no current-count constant substitution. | `R4 FUTURE_HYPOTHETICAL_STATE` | `T3 MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | Exact historical values and accepted bytes match; every mutation rejects. | `NONE` |
| `D1-C02` | No BOTC rule claim; the current engineering inventory must be freshly authenticated and remain candidate-only. | A real public Vitest collection materializes exactly `1712`, inventory `540e...`, `36` files, file set `c8c0...`, status `UNACCEPTED_CANDIDATE`, with deterministic repeated bytes. | Direct exact-shape validation of a fresh real Vitest inventory and the closed D1 candidate artifact; no precheck-copy authority. | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | Exact candidate values pass; stale, partial, malformed, wrong-version, or mutated input rejects. | `NONE` |
| `D1-C03` | No BOTC rule claim; migration must be additive and exact. | Authenticated accepted/candidate sets yield intersection `1572`, union `1712`, added `140`, removed `0`; the five increments are `52/14/25/21/28`; increment-set hash is `ddfa...`; duplicate/borrowed/missing/wrongOwner are all zero. | Direct set-delta and file-partition validator over already canonical, version-authenticated tuple sets. | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | Exact delta passes; any removal is mapped to `HUMAN_BLOCKED`; all other mismatch classes reject closed. | `NONE` |
| `D1-C04` | No BOTC rule claim; hostile ownership input must never acquire accepted authority. | Closed validators reject duplicate, borrowed, missing, wrong-owner, wrong-file, wrong-project, malformed-shape, accessor/proxy, contract mutation, and report mutation without publication or getter invocation. | Mutation matrix against public candidate/report/registry boundaries, including atomic no-publication assertions. | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | Every hostile case returns the expected stable failure class, leaves no destination/temp artifact, and emits no pass verdict. | `NONE` |
| `D1-C05` | No BOTC rule claim; version dispatch and reporting must be explicit and deterministic. | Only the two exact versions dispatch; there is no default or fallback; the closed report has exact schema/key order and repeats byte-identically under reversed input and separate fresh collection. | Pure selector/report policy tests plus deterministic byte comparison; environment-dependent APIs are forbidden. | `R4 FUTURE_HYPOTHETICAL_STATE` | `T3 MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | Exact versions and report pass; missing/unknown versions and nondeterministic or extra-shaped output reject. | `NONE` |

No design row contains implementation-time `Actual*` fields. After implementation, the D1 traceability document must add the exact actual bindings required by the review protocol and must map each criterion to one unique primary.

## 17. Scope and exact file allowlist

### 17.1 Implementation scripts

Only these executable files may change:

1. `scripts/vitest-ownership-contracts.mjs`
2. `scripts/verify-vitest-ownership-contracts.mjs`

No executable logic may be moved into documentation to evade this limit.

### 17.2 D1 documentation

Only D1-specific documentation and D1-specific sections of mandatory control files may change:

- `docs/architecture/2B20B-P2F1R-D1-global-vitest-ownership-baseline-migration-design-round-1.md`
- `docs/implementation/phase-3-slice-2b20b-p2f1r-d1-test-traceability.md`
- `docs/implementation/phase-3-slice-2b20b-p2f1r-d1-ownership-baseline-migration-report.md`
- D1-only updates in:
  - `docs/agent-loop/CURRENT_TASK.md`
  - `docs/agent-loop/PROJECT_STATE.md`
  - `docs/agent-loop/AUTOPILOT_STATE.json`
  - `docs/agent-loop/AUTOPILOT_LOG.md`

The precheck and rule-evidence files are inputs and remain unchanged during implementation.

### 17.3 Zero-file budgets

- production/domain/application files: `0`
- Vitest test files: `0`
- Vitest identities or titles: `0`
- workflow/hosted CI files: `0`
- coverage profiles or selectors: `0`
- routing groups, filters, owners, or segmentation: `0`
- dependencies or lockfiles: `0`
- runtime/provider/install policy: `0`
- timeouts: `0`
- rules or source snapshots: `0`
- `ROLE_COVERAGE_MATRIX`: `0`
- README files: `0`
- event/schema/replay/projection files: `0`

## 18. Line estimates and hard budgets

Estimated implementation delta:

| File class | Estimated delta |
|---|---:|
| `scripts/vitest-ownership-contracts.mjs` | `+180/-10` |
| `scripts/verify-vitest-ownership-contracts.mjs` | `+260/-15` |
| D1 implementation/traceability/control documentation | `+250/-0` |
| Production | `0` |
| Tests/workflow/profile/routing/rules/matrix | `0` |

Hard ceilings:

- contracts script: at most `+250/-25`;
- verifier script: at most `+350/-25`;
- aggregate executable script additions: at most `+600`;
- aggregate executable script deletions: at most `50`;
- D1 implementation/traceability documentation: at most `+450`;
- production additions or deletions: exactly `0`.

Exceeding a per-script or aggregate ceiling requires stop and reslice/user readjudication. Documentation cannot contain generated identity inventories or executable code merely to evade the script ceiling.

## 19. Non-goals

D1 does not:

- accept or revive parent D;
- perform parent D publication;
- transfer `D-C01` or `D-C03`;
- add C/CE ownership registration;
- modify any C/C1/CE/D0 primary;
- change ordinary or coverage topology;
- add Windows execution or artifacts;
- create or select a coverage profile;
- publish predecessor/final review bodies;
- modify hosted CI;
- change any test identity;
- change accepted BOTC behavior;
- change event meaning, validation, replay, provenance, or state;
- change player, AI, public, Storyteller, or replay projection;
- change rule semantics, night order, or role coverage;
- create a branch, push, PR, merge, or GitHub comment as part of design;
- authorize a later slice.

## 20. Acceptance checks

### 20.1 Focused deterministic checks

The implementer must run:

```text
node scripts/verify-vitest-ownership-contracts.mjs --self-test
```

Expected result:

```text
OWNERSHIP_CONTRACT_SELF_TEST_PASS
checksPassed=42
checksExpected=42
```

Using safe OS-temporary files, run accepted emit and verify with the explicit accepted selector. Required exact result:

- `1572`;
- `12`;
- `58bd...`;
- `391257`;
- `d8ae...`;
- `31`;
- `55783...`.

Run candidate emit twice from two separately created real Vitest instances with the explicit candidate selector. Required result:

- each collection returns `1712`;
- each returns inventory `540e...`;
- each returns `36` files and `c8c0...`;
- complete candidate bytes are identical;
- candidate byte counts and hashes are recorded freshly.

Verify the emitted candidate and generate the migration report. The report must return:

- intersection `1572`;
- union `1712`;
- added `140`;
- removed `0`;
- `52/14/25/21/28`;
- increment file-set `ddfa...`;
- duplicate/borrowed/missing/wrongOwner `0/0/0/0`;
- `OWNERSHIP_BASELINE_MIGRATION_PASS`.

Run the hostile matrix and atomic publication injections. Every case must reject with no partial artifact or success output.

### 20.2 Static scope checks

Review must prove:

- only the exact allowlist changed;
- production/test/workflow/profile/routing/dependency/timeout/rule/matrix diffs are empty;
- no test title or identity changed;
- identity generation functions are unchanged;
- the five active contracts are byte-stable and remain in order;
- `ACCEPTED_CONTRACT_BASELINES` is byte-stable and remains in order;
- accepted serialization remains exactly `391257 / d8ae...`;
- no accepted constant was replaced with a candidate value;
- no implicit version selector exists;
- no environment-locale or nondeterministic API was introduced;
- `git diff --check` passes.

### 20.3 Repository gates

Using Node `24.15.0` and pnpm `11.7.0`:

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
```

All must pass without timeout, threshold, workflow, profile, routing, or dependency changes.

## 21. CI and independent review

D1 adds or modifies no CI configuration.

After implementation is finalized:

1. freeze the exact feature HEAD;
2. push that exact HEAD;
3. create one D1 PR;
4. wait for all required CI associated with that exact HEAD;
5. require all existing Ubuntu and Windows merge-gating checks to succeed;
6. run one complete independent final review on the frozen exact PR HEAD;
7. publish the complete reviewer output verbatim under both required GitHub audit markers;
8. re-read both comments from GitHub and verify exact reviewed-HEAD equality, complete fields, both pass verdicts, and empty `remainingBlockers`;
9. do not commit after passing review.

Existing older CI runs do not satisfy D1. No closeout, merge, or next slice is authorized by this design.

Before implementation begins, an independent read-only rule-design reviewer must independently read:

- the mandatory rule sources or fixed live revisions;
- `docs/rules/evidence/2B20B-P2F1R-D1.md`;
- the official nightsheet identity;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`;
- this complete design;
- both ownership scripts.

Implementation may begin only after exact verdict:

```text
RULE_DESIGN_PASS
```

## 22. Documentation obligations

Implementation documentation must record:

- exact source HEAD;
- explicit accepted and candidate versions;
- all accepted fixed values;
- freshly observed candidate byte count and SHA-256;
- complete closed migration report;
- exact delta and five-file partition;
- self-test result;
- full-gate results;
- unchanged-contract hashes or byte comparisons;
- exact file allowlist and line deltas;
- design-to-actual traceability;
- Slice coverage: `SKELETON`;
- Role coverage: unchanged;
- PR acceptance: `UNACCEPTED` until all final gates pass.

Documentation must not characterize ownership evidence as:

- BOTC rule proof;
- event semantic proof;
- producer authorization;
- accepted-history provenance;
- replay correctness;
- role completion;
- projection safety proof beyond the zero-change assertion.

## 23. Rollback

Before acceptance, rollback is branch-local:

- close or abandon the unaccepted D1 branch/PR;
- restore the two scripts to their pre-D1 blobs through a normal revert commit or branch abandonment;
- remove only unaccepted D1 implementation/report documents;
- remove temporary candidate files from the exact OS-temporary paths used for validation;
- retain the immutable precheck and rule evidence as historical governance records unless separately authorized otherwise.

Rollback must not:

- rewrite accepted Git history;
- delete or alter the accepted 1572 authority;
- refresh accepted contract values;
- change tests, production, workflow, profiles, routing, rules, or role coverage;
- claim that the 1712 candidate was accepted.

After acceptance, any rollback requires a separately reviewed forward or revert change that preserves the accepted audit chain; this design does not authorize it.

## 24. Stop conditions

Stop D1 immediately and report `HUMAN_BLOCKED` or reslice-required, as specified, if:

1. `RULE_READY` evidence is withdrawn, conflicting, unavailable, or found incomplete;
2. independent review does not return `RULE_DESIGN_PASS`;
3. any accepted `1572` identity is removed, renamed, moved, altered, or re-owned;
4. `removed > 0`; this is always
   `HUMAN_BLOCKED / ACCEPTED_1572_HISTORY_REMOVAL`;
5. any accepted count, LF count, inventory hash, byte count, candidate hash, file count, or file-set hash changes;
6. any of the five accepted contracts or `ACCEPTED_CONTRACT_BASELINES` must change;
7. candidate `1712 / 540e... / 36 / c8c0...` cannot be freshly reproduced twice;
8. the exact delta is not `1572/1712/+140/-0`;
9. the five-file counts or `ddfa...` hash differ;
10. duplicate, borrowed, missing, or wrong-owner count is nonzero;
11. an implicit/default version or candidate-to-accepted fallback is required;
12. identity tuple generation or ordinal ordering must change;
13. any production, test, workflow, coverage, routing, dependency, timeout, rule, or role-matrix file must change;
14. any file outside the two scripts and D1 documentation is required;
15. a new test identity, title, project, logical group, filter, marker, owner, workflow job, runner, artifact, or profile is required;
16. `D-C01`, `D-C03`, publication, hosted evidence, or coverage work is requested;
17. runtime shape, atomic publication, failure redaction, retry behavior, or cross-platform determinism must be weakened;
18. script or documentation hard budgets are exceeded;
19. a third design correction or third implementation repair is requested without new explicit user authorization;
20. exact-head CI, complete final review, audit comments, reviewed-HEAD equality, or clean-worktree evidence is absent;
21. a substantive BOTC rule conflict is discovered;
22. any required fixed rule source becomes unavailable without an approved snapshot.

No stop condition authorizes constant replacement, scope expansion, parent-D revival, an implicit repair, or a later slice.

## 25. Design disposition

- `ruleResearchVerdict`: `RULE_READY`
- `designVerdict`: `READY_FOR_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW`
- `implementationAuthorized`: `false`
- `remainingBlockers`:
  `[PENDING_INDEPENDENT_RULE_DESIGN_REVIEW_D1_ROUND_1]`
- `requiredNextAction`:
  `MATERIALIZE_THIS_EXACT_DESIGN_THEN_RUN_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW`
- `nextSliceAuthorized`: `false`

READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW_D1_ROUND_1
