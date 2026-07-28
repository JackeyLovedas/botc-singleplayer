# Phase 3 Slice 2B20AP1 — LF-Safe Identity Encoding Amendment V1 Correction 1

## 1. Metadata and authority

| Field | Exact value |
|---|---|
| `correctionId` | `2B20AP1-LF1-CORRECTION-1` |
| `amendmentId` | `2B20AP1-LF1` |
| `parentAmendmentPath` | `docs/implementation/phase-3-slice-2b20ap1-lf-safe-identity-encoding-amendment-v1.md` |
| `parentAmendmentSha256` | `8afd177afb888a55f5482cb633207d974f79248d968c99d70651ee112c274b20` |
| `parentAmendmentCommit` | `609b01d352c194424c778fcb7013a868cc768af8` |
| `reviewPath` | `docs/implementation/phase-3-slice-2b20ap1-lf-safe-identity-encoding-amendment-review-round-1.md` |
| `reviewSha256` | `d6b386265d30ebfc6fff2b190179909a168b0f673789027f4097d628f9dd9e8b` |
| `reviewedHead` | `609b01d352c194424c778fcb7013a868cc768af8` |
| `reviewVerdict` | `RULE_DESIGN_FIX_REQUIRED` |
| `closedFindingIds` | `LF1-SAME-DISCOVERY-CONTRACT,LF2-CANDIDATE-SCHEMA-CONTRACT` |
| `authorization` | `USER_AUTHORIZED_2B20AP1_LF_SAFE_IDENTITY_ENCODING_AMENDMENT_AND_LOCAL_END_TO_END_CLOSURE` |
| `amendmentCorrectionRound` | `1/2` |
| `infrastructureRepairRound` | `0/2` |
| `implementationAuthorized` | `false` |
| `status` | `PENDING_INDEPENDENT_2B20AP1_LF_AMENDMENT_CORRECTION_1_REVIEW` |

This document is the standalone replacement authority for every
identity-encoding clause in the parent amendment. It is not Design Round 4,
does not alter the immutable Round 3 design or prior amendment/review bytes,
and consumes no Infrastructure Repair. It incorporates every amendment
contract that passed review and supplies the two previously missing exact
contracts. An implementer must not infer or fill any schema field, ordering,
collection route, or CLI argument from the superseded amendment.

Authority precedence for implementation is:

1. unchanged 2B20AP1 governance and Round 3 rules, supersession, ownership,
   traceability, routing, title-migration, topology and allowlist contracts;
2. this correction for all LF identity collection, encoding, candidate schema
   and candidate gate details;
3. accepted A3A/A3B1/A3B2/B19B contract literals, which remain immutable.

This correction explicitly replaces:

- Round 3's `canonicalizeRawVitestInventory` raw-name parsing as candidate
  identity authority;
- the external `pnpm exec vitest list ... --json=<inventory>` capture;
- both candidate commands' `--inventory` argument;
- candidate schema
  `vitest-ownership-candidate-baseline-v1`;
- every CR/LF prohibition used only to make raw line framing possible.

It does not replace any Round 3 supersession disposition, primary identity,
supporting authority, marker migration, traceability relation, selector,
partition, count, rollback boundary, or future implementation allowlist.

## 2. Inherited passed contracts

The semantic identity remains the exact structured tuple:

```text
[project, canonicalRepositoryRelativeFile, ancestorPath, completeTitle]
```

`ancestorPath` is a dense ordered string array. `rawName` is display/projection
metadata only and is never authoritative. No LF, CR, CRLF, tab, pipe,
` > `, quote, backslash, NUL, astral code point, or unpaired surrogate is
trimmed, folded, normalized, removed, or rewritten. Unicode normalization is
forbidden. Existing repository-relative path canonicalization is the only path
normalization.

The encoding version remains exactly:

```text
vitest-semantic-identity-json-tuple-v1
```

For one identity, canonical bytes are UTF-8 bytes of
`JSON.stringify([project,file,ancestorPath,title])`. For a complete inventory:

1. strictly validate each tuple;
2. reject duplicate full tuples;
3. sort tuples by ordinal comparison of each tuple's compact
   `JSON.stringify(tuple)`, using only
   `left < right ? -1 : left > right ? 1 : 0`;
4. encode exactly
   `Buffer.from(JSON.stringify(sortedCanonicalTuples) + "\n", "utf8")`;
5. SHA-256 those bytes for `inventorySha256`.

`localeCompare`, `Intl.Collator`, environment locale, tab-field framing, raw
LF record framing and title delimiter assumptions are forbidden. The existing
projectless length-prefixed `semanticIdentityKey` remains only an in-memory
ownership grouping key. A full length-prefixed identity key, if needed, must
bind the project as `encodeFields([project,semanticIdentityKey(identity)])`.
It is not the persisted candidate representation.

The fresh blocked-HEAD facts remain:

```text
structuredIdentityCount=1572
LFIdentityCount=12
CRIdentityCount=0
LF field for all twelve=title
LF code units per affected title=2
accepted history owner=2B18B
2B20A identity addition=false
test title change=false
```

All twelve live identities are in project `application`, file
`packages/application/src/mathematician-information.test.ts`, under ancestor
`2B18B structural batch and replay tamper contracts`. Their source blob
matches accepted head `5a69c90f2d3947556ff45c15c467902b1e28ca43`.
That file remains excluded from all future edits.

The accepted hash decision remains:

```text
legacyHashesChanged=false
acceptedInventoryMigrationRequired=false
dualHashBridgeRequired=false
dualHashBridgeStatus=NOT_APPLICABLE_NO_ACCEPTED_INVENTORY_MIGRATION
```

The twelve LF titles are outside every accepted registered
`applicationTestFile` inventory. A3A, A3B1, A3B2 and B19B baseline objects
remain value-for-value unchanged. No bridge field is legal in the candidate.
If implementation discovers a required accepted-inventory migration, it must
stop with `LF_SAFE_ENCODING_CANNOT_PRESERVE_ACCEPTED_IDENTITY_HISTORY`.

Product behavior, rule semantics, test semantics, LF titles, marker plan,
coverage profile, timeout, dependency, Vitest projects and process groups
remain unchanged. Ordinary topology stays nine projects, coverage stays eleven
projects, and Windows stays W1–W7. Dreamer, Philosopher and Mathematician
remain `PARTIAL`; Vortox remains `NOT_STARTED`.

## 3. Finding LF1 closure — one exact discovery flow

### 3.1 Exact public API ownership

`scripts/verify-vitest-ownership-contracts.mjs` owns the only candidate
collector. In each CLI process it creates exactly one Vitest instance and
invokes the public `Vitest.collectTests` method exactly once. It must import
`createVitest` from `vitest/node`; no private Vitest module or CLI JSON
formatter may be imported.

The exact lifecycle in both emit and verify is:

```js
const vitest = await createVitest(
  "test",
  {
    root: repoRoot,
    workspace: absoluteWorkspacePath,
    run: true,
    watch: false,
    passWithNoTests: false,
    reporters: [],
    color: false
  },
  {},
  { stdout: internalStdoutSink, stderr: internalStderrSink }
);
try {
  await vitest.init();
  const specifications = await vitest.globTestSpecifications([]);
  collectionInvocationCount += 1;
  const result = await vitest.collectTests(specifications);
  // derive and validate both projections from result.testModules
} finally {
  await vitest.close();
}
```

`repoRoot` is the resolved process working directory.
`absoluteWorkspacePath` is exactly
`path.resolve(repoRoot,"vitest.workspace.ts")`, must be a canonical file
strictly inside `repoRoot`, and is supplied by the exact CLI literal described
below. Both internal sinks are local `Writable` instances and prevent Vitest
reporter output from contaminating the frozen command stdout/stderr contract.
Any nonempty captured error output, collection error, missing public method,
missing structured property, non-array `testModules`, or nonempty
`unhandledErrors` fails with
`VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE`.

`collectionInvocationCount` begins at zero inside each CLI invocation,
increments immediately before the sole `collectTests` call, and must equal one
before artifact generation or verification. Neither `collect`,
`start`, `runTestSpecifications`, `rerunTestSpecifications`, nor a second
`collectTests` call is allowed. `globTestSpecifications([])` discovers
specifications but is not a task collection and may occur exactly once.

### 3.2 Same-object raw and structured derivation

Traverse each returned `TestModule` once in returned order and enumerate
`testModule.children.allTests()` once. Capture one ordered `TestCase[]`;
require every test's `module` reference to equal that `TestModule`. No
serialized copy may become the source.

For each exact `TestCase` object:

- raw projection is exact own data
  `{project:test.project.name,file:test.module.moduleId,name:test.fullName}`;
- structured project is `test.project.name`;
- structured file is `test.module.moduleId`, canonicalized by the inherited
  cross-platform repository-relative path validator;
- structured title is exact `test.name`;
- structured ancestors are obtained by walking `test.parent` references to
  the module, collecting each `TestSuite.name`, then reversing that list;
- structured tuple is `[project,file,ancestorPath,title]`;
- structured raw projection is
  `[...ancestorPath,title].join(" > ")`.

The implementation retains the source `TestCase` reference beside both
derived records and requires reference equality before comparison. It compares
the two complete multisets keyed as compact JSON
`[project,canonicalFile,rawName]`, including exact string values and exact
multiplicity. It also requires `test.fullName` to equal the structured raw
projection for that same task. Any value or multiplicity mismatch is exactly
`VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH`.

After the reviewed Round 3 title migrations, both projections must contain
exactly `1572` tests. Exactly `12` raw projections contain U+000A, and exactly
`12` structured tuples contain U+000A in at least one of project, file,
ancestor elements or title. The two LF-bearing task-reference sets must be
identical. Counts other than `1572/12`, a duplicate full tuple, or a projected
value mismatch fail closed; candidate bytes are not produced.

`collectTests` loads test modules to collect definitions but does not invoke
test callbacks. The collector must not access or call any test function.
Every collected non-skipped `TestCase.result().state` must remain `pending`;
no result may be `passed` or `failed`. Regression instrumentation must prove
zero calls to `start`, `runTestSpecifications`,
`rerunTestSpecifications`, test callbacks, and all other execution APIs.

### 3.3 Exact replacement commands

Round 3's external raw inventory command and both `--inventory` arguments are
deleted from the combined authority. The exact emit command is:

```text
node scripts/verify-vitest-ownership-contracts.mjs --emit-candidate-baseline 2B20A --workspace vitest.workspace.ts --output <ABS_NONEXISTENT_CANDIDATE_JSON>
```

The exact verify command is:

```text
node scripts/verify-vitest-ownership-contracts.mjs --verify-candidate-baseline 2B20A --workspace vitest.workspace.ts --candidate <ABS_EXISTING_CANDIDATE_JSON>
```

Arguments occur exactly once and in that order. `2B20A` and
`vitest.workspace.ts` are literal, case-sensitive values. Output/candidate
paths are absolute, distinct from the workspace, scripts, traceability and
repository files, and have a validated OS-temp parent. Emit uses exclusive
creation and refuses an existing output. Unknown, reordered, repeated, missing
or combined mode arguments fail with the inherited stable CLI-argument error.
There is no inventory artifact and no `--inventory` option.

Emit performs one fresh collection, produces candidate v2 bytes, writes the
same bytes to stdout and the exclusive file, emits empty stderr and exits zero.
Verify is a separate invocation: it creates one new Vitest instance, performs
one fresh collection, reconstructs all v2 bytes, and byte-compares them with
the candidate. It prints only
`CANDIDATE_BASELINE_VERIFIED 2B20A\n` on success. Each invocation therefore
has internally single-discovery provenance; verify never combines its
collection with emit's in-memory objects.

## 4. Finding LF2 closure — exact candidate v2

### 4.1 Schema and serialization

`schemaVersion` is exactly:

```text
vitest-ownership-candidate-baseline-v2
```

The top-level object has exactly these ten own data string keys in this order:

1. `schemaVersion`
2. `contractId`
3. `identityEncodingVersion`
4. `structuredIdentityCount`
5. `lfIdentityCount`
6. `inventorySha256`
7. `traceabilitySha256`
8. `structuredIdentities`
9. `frozenBaseline`
10. `acceptedContractBaselines`

The exact shape is:

```json
{
  "schemaVersion": "vitest-ownership-candidate-baseline-v2",
  "contractId": "2B20A",
  "identityEncodingVersion": "vitest-semantic-identity-json-tuple-v1",
  "structuredIdentityCount": 1572,
  "lfIdentityCount": 12,
  "inventorySha256": "<lowercase-64-hex>",
  "traceabilitySha256": "<lowercase-64-hex>",
  "structuredIdentities": [
    ["<project>", "<file>", ["<ancestor>", "..."], "<title>"]
  ],
  "frozenBaseline": {
    "projectExecutionsBefore": 22,
    "projectExecutionsAfter": 22,
    "projectInventorySha256": "<lowercase-64-hex>",
    "currentProjectInventorySha256": "<same-lowercase-64-hex>",
    "semanticInventorySha256": "<lowercase-64-hex>",
    "authorityInventorySha256": "<lowercase-64-hex>",
    "nonOwnedInventoryPolicy": "GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS",
    "nonMarkerOwnershipSha256": "<lowercase-64-hex>",
    "physicalTestFileSetSha256": "<lowercase-64-hex>",
    "traceabilityRowCount": 37,
    "dynamicTestAuthorityRows": 36,
    "supportingAuthorityCount": 37
  },
  "acceptedContractBaselines": [
    {"contractId": "2B19A3A", "frozenBaseline": {}},
    {"contractId": "2B19A3B1", "frozenBaseline": {}},
    {"contractId": "2B19A3B2", "frozenBaseline": {}},
    {"contractId": "2B19B", "frozenBaseline": {}}
  ]
}
```

The example's empty accepted baseline objects are replaced by the complete
exact literals in section 4.3; omission is never permitted.

`structuredIdentities` is the complete sorted 1572-tuple inventory, not a
sample. It is the persistent round-trip evidence. Each tuple is a canonical
dense array of length four with no symbol or extra own key:

- project, file and title are nonempty primitive strings;
- file is already canonical repository-relative `/` form;
- `ancestorPath` is a canonical dense array of nonempty primitive strings;
- no accessor, sparse slot, noncanonical prototype, extra property or
  non-string component is permitted.

Tuples are strictly ascending by ordinal comparison of compact
`JSON.stringify(tuple)` and may not repeat. Parsing and re-stringifying each
tuple must produce the same compact tuple bytes and field-by-field strict
equality. `structuredIdentityCount` equals the array length.
`lfIdentityCount` counts tuples for which project, file, any ancestor string,
or title contains U+000A and must equal `12`.

`inventorySha256` is recomputed only from
`Buffer.from(JSON.stringify(structuredIdentities) + "\n","utf8")`.
`traceabilitySha256` retains the Round 3 algorithm: read the complete
traceability file as UTF-8; normalize CRLF and lone CR to LF; split; remove
exactly one terminal empty sentinel created by a final LF; retain all other
lines including blanks/duplicates; reject NUL; ordinal-sort the lines, join
with LF, add one terminal LF, then hash the UTF-8 bytes.

The candidate document bytes are exactly
`Buffer.from(JSON.stringify(candidate,null,2) + "\n","utf8")`: two-space
indent, LF only, one terminal LF, no BOM, CR, timestamp, root, locale,
environment, randomness or bridge field.

### 4.2 2B20A baseline construction

The `frozenBaseline` object uses exactly the twelve keys and order shown in
section 4.1. Counts and policy are the shown literals. The six SHA values are
recomputed by the unchanged shared ownership audit:

- `projectInventorySha256` and `currentProjectInventorySha256` are identical
  for the new nondeduplicated 2B20A project inventory and use
  `sha256CanonicalLines` over the project-bearing `tabIdentity` records;
- `semanticInventorySha256` uses the unique projectless semantic identities
  and their legacy tab representation;
- `authorityInventorySha256` uses the exact authority-marker set;
- `nonMarkerOwnershipSha256` uses the unchanged registered non-marker
  ownership calculation;
- `physicalTestFileSetSha256` uses the unchanged registered contract file set.

`sha256CanonicalLines` remains exact UTF-8 SHA-256 of
`ordinalSort(lines).join("\n") + "\n"`. This legacy calculation is confined to
the accepted/2B20A ownership baselines; it is not the full structured
candidate-inventory hash. Emit recomputes all twelve fields rather than reading
candidate literals. Verify recomputes them again from its one fresh
collection.

### 4.3 Exact accepted-contract array

The array order is the actual exported `OWNERSHIP_CONTRACTS` registry order:
raw-code-unit ascending contract ID
`2B19A3A,2B19A3B1,2B19A3B2,2B19B`. Each entry has exactly the own data keys
`contractId,frozenBaseline` in that order. Every accepted `frozenBaseline`
uses exactly this key order:

1. `projectExecutionsBefore`
2. `projectExecutionsAfter`
3. `projectInventorySha256`
4. `currentProjectInventorySha256`
5. `semanticInventorySha256`
6. `authorityInventorySha256`
7. `nonOwnedInventoryPolicy`
8. `nonMarkerOwnershipSha256`
9. `physicalTestFileSetSha256`
10. `traceabilityRowCount`
11. `dynamicTestAuthorityRows`
12. `supportingAuthorityCount`

The complete literal array is:

```json
[
  {
    "contractId": "2B19A3A",
    "frozenBaseline": {
      "projectExecutionsBefore": 34,
      "projectExecutionsAfter": 10,
      "projectInventorySha256": "3829eb2a26e28e22a568d7e393e22c68aedb8979021a3e3b4522b9e53b6d3c8e",
      "currentProjectInventorySha256": "147ad97c8e5169f135fd5eddbfc25dcb4f29adb0c0902023e80b0efcce0c466d",
      "semanticInventorySha256": "5e544f734381f99f20ac715513b7af7e5a33af6726ca9cad8a0c6d8c1fe7b2cb",
      "authorityInventorySha256": "e098696e88ed4f3d050b6d24511b05522aa26afed43d4f8d09d668c81309f676",
      "nonOwnedInventoryPolicy": "GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS",
      "nonMarkerOwnershipSha256": "764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8",
      "physicalTestFileSetSha256": "55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab",
      "traceabilityRowCount": 92,
      "dynamicTestAuthorityRows": 83,
      "supportingAuthorityCount": 2
    }
  },
  {
    "contractId": "2B19A3B1",
    "frozenBaseline": {
      "projectExecutionsBefore": 6,
      "projectExecutionsAfter": 6,
      "projectInventorySha256": "9d8726005537db396683c3701546a85f0094b3e84ca062f1d7113a66b3eef189",
      "currentProjectInventorySha256": "9d8726005537db396683c3701546a85f0094b3e84ca062f1d7113a66b3eef189",
      "semanticInventorySha256": "bd194c778f83c42c4bc46307f028e1a289b01c50a49c2169ce2a07c267a317f4",
      "authorityInventorySha256": "c42fc09726d54c1e9ea6f7d88756435340f7e329cd5fd45f00c9030979e574c6",
      "nonOwnedInventoryPolicy": "GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS",
      "nonMarkerOwnershipSha256": "764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8",
      "physicalTestFileSetSha256": "55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab",
      "traceabilityRowCount": 60,
      "dynamicTestAuthorityRows": 58,
      "supportingAuthorityCount": 4
    }
  },
  {
    "contractId": "2B19A3B2",
    "frozenBaseline": {
      "projectExecutionsBefore": 9,
      "projectExecutionsAfter": 9,
      "projectInventorySha256": "57a203ad425956791886c56ea8b906b2252186aaf8c5a66be19e7bcf7b0d718e",
      "currentProjectInventorySha256": "57a203ad425956791886c56ea8b906b2252186aaf8c5a66be19e7bcf7b0d718e",
      "semanticInventorySha256": "3379844b47a12a8053869a7db73a300030c0e6029acee9cadf54e64d2500c147",
      "authorityInventorySha256": "65adffd5fe6242cfc64d215629b39a0cf6c5f68bfbb30d1426fdb133f9c5a039",
      "nonOwnedInventoryPolicy": "GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS",
      "nonMarkerOwnershipSha256": "764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8",
      "physicalTestFileSetSha256": "55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab",
      "traceabilityRowCount": 58,
      "dynamicTestAuthorityRows": 51,
      "supportingAuthorityCount": 10
    }
  },
  {
    "contractId": "2B19B",
    "frozenBaseline": {
      "projectExecutionsBefore": 10,
      "projectExecutionsAfter": 10,
      "projectInventorySha256": "92bcddf3603962ff040338874429f43b98f711a0dd4fa02adfbc0ed80bec32c8",
      "currentProjectInventorySha256": "92bcddf3603962ff040338874429f43b98f711a0dd4fa02adfbc0ed80bec32c8",
      "semanticInventorySha256": "8121c6d14bb462f9c0dfe31750bc77890f53d600ff542b1a13450d231e42f482",
      "authorityInventorySha256": "e7e88b9d6be6771d351ac8665b05dcaec305516f402d1a92655b845cba942e81",
      "nonOwnedInventoryPolicy": "GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS",
      "nonMarkerOwnershipSha256": "764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8",
      "physicalTestFileSetSha256": "55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab",
      "traceabilityRowCount": 80,
      "dynamicTestAuthorityRows": 78,
      "supportingAuthorityCount": 10
    }
  }
]
```

The array must contain exactly those four entries. Altered, omitted,
duplicated, reordered or additional accepted contracts reject. Every field is
compared to the current validated registry and the frozen literals above;
there is no baseline refresh path.

### 4.4 Strict candidate validation and duplicate keys

Candidate construction and self-tests use descriptor-based validators:
canonical plain objects/arrays only; exact prototype; exact dense indices;
exact string-key set and order; no symbol, accessor, extra or missing field.
Version, contract ID, encoding version, counts, SHA shape, tuple order,
baseline values and accepted-contract order are all exact.

Actual verify does not parse untrusted candidate JSON before proving canonical
bytes. It:

1. performs its one fresh collection;
2. constructs and descriptor-validates the expected v2 object;
3. serializes exact expected bytes;
4. reads candidate bytes as a `Buffer`;
5. compares candidate and expected bytes byte-for-byte;
6. on any difference returns
   `CANDIDATE_BASELINE_REPEAT_MISMATCH`, exit one, zero stdout;
7. only after equality, parses the now-known generated bytes and reruns the
   strict object/tuple validator.

Consequently an external document with duplicate JSON object keys, wrong key
order, BOM, CRLF, extra whitespace, missing/extra fields, bridge fields, or
duplicate accepted-contract entries cannot exploit `JSON.parse` last-key
behavior: its bytes differ and it is rejected before parsing. Emit is the sole
producer of accepted candidate bytes. This byte-first rule is the frozen
duplicate-key-aware boundary; no general permissive JSON candidate parser is
authorized.

## 5. Frozen regression and self-test matrix

The original twenty amendment tests remain mandatory:

1. title LF round-trip;
2. ancestor LF round-trip;
3. raw LF with valid structured fields;
4. distinct CR, CRLF and LF round-trips;
5. tab, pipe, ` > `, quote and backslash;
6. NUL;
7. astral Unicode and unpaired surrogate exact JSON behavior;
8. LF-position collision rejection;
9. file/title LF-boundary collision rejection;
10. ancestor segmentation collision rejection;
11. parse then strict field equality;
12. duplicate tuple rejection;
13. noncanonical path rejection;
14. sparse ancestor rejection;
15. extra/missing field rejection;
16. all twelve live LF identities encode;
17. all twelve appear in a successful candidate;
18. every accepted hash remains exact;
19. any bridge field or wrong generic bridge hash rejects;
20. repeated candidate generation is byte-identical.

The following correction regressions are additionally mandatory:

21. each emit process invokes `collectTests` exactly once;
22. each verify process invokes `collectTests` exactly once;
23. raw and structured records retain the same 1572 `TestCase` references;
24. raw and structured multisets match all 1572 values and multiplicities;
25. exactly the same 12 task references carry LF in both projections;
26. absent/malformed public structured task data returns
    `VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE`;
27. injected raw/structured value mismatch returns
    `VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH`;
28. injected multiplicity mismatch returns the same mismatch code;
29. test callback and all execution API invocation counters remain zero;
30. project counts remain ordinary 9 / coverage 11, with no new project or
    process group;
31. v2 top-level key set, key order, nesting and schema version are exact;
32. 2B20A baseline key set/order and all fixed counts are exact;
33. each accepted baseline key set/order and every literal are exact;
34. altered, omitted, duplicated, reordered or extra accepted contracts
    reject;
35. altered accepted hash, 2B20A hash, structured count, LF count, contract ID,
    encoding version or schema version rejects;
36. every persisted tuple passes strict dense parse, ordering and
    field-equality validation;
37. all twelve live tuples parse and round-trip from the persisted candidate;
38. duplicate tuple, unsorted tuple, missing tuple and extra tuple reject;
39. repeated full v2 emission is byte-identical;
40. top-level or nested bridge field rejects;
41. duplicate JSON object-key bytes reject before `JSON.parse`;
42. verify's fresh single collection regenerates bytes exactly or fails
    `CANDIDATE_BASELINE_REPEAT_MISMATCH`.

No regression may change a test title. Self-tests use pure injected collectors
or task fixtures where possible and may not create a new test file, Vitest
project, process group, dependency, timeout or profile.

## 6. Unchanged Round 3 implementation contract

After and only after a fresh independent reviewer returns
`RULE_DESIGN_PASS` with `remainingBlockers=[]`, the combined authority still
requires the complete Round 3 implementation:

- four accepted-authority supersession records and exact A3A C17, A3B1
  C18/C28 and A2 C20 dispositions;
- canonical `[2B20A-*]` markers and the independent 2B20A ownership contract;
- exactly 37 active criteria, 37 unique primaries and 37 used `SUP` records;
- zero compound, borrowed, duplicate or cross-contract primary;
- C32 Static `PASS` and Hosted `PENDING`;
- ordinary 9-group, coverage 11-group and Windows W1–W7 routing;
- unchanged unsuperseded accepted history and exact union/intersection/
  missing/unexpected contracts;
- original rollback and local-gate boundaries.

The future implementation allowlist remains exactly:

```text
scripts/vitest-ownership-contracts.mjs
scripts/verify-vitest-ownership-contracts.mjs
scripts/verify-vitest-coverage-groups.mjs
.github/workflows/ci.yml
packages/application/src/game-application-service.test.ts
packages/domain-core/src/rebuild.test.ts
docs/implementation/phase-3-slice-2b20a-test-traceability.md
docs/agent-loop/CURRENT_TASK.md
docs/agent-loop/PROJECT_STATE.md
docs/agent-loop/AUTOPILOT_STATE.json
docs/agent-loop/AUTOPILOT_LOG.md
```

No new script or test file is authorized.
`packages/application/src/mathematician-information.test.ts`, all production
files, rule/matrix/profile/workspace/package/lock/dependency/timeout files,
Windows verifier, Linux/W7 diagnostics, product branch, PR #46 and remote state
remain excluded.

The corrected candidate local gate replaces Round 3 gate 2 with:

1. create one OS-temp seed and one nonexisting absolute sibling candidate path;
2. run the exact emit command in section 3.3;
3. run the exact verify command in section 3.3;
4. record the verified v2 candidate hash and computed 2B20A baseline values;
5. in `finally`, remove only the validated seed and candidate exact paths.

There is no raw inventory file. All other authorized Round 3 local gates remain
unchanged. Full coverage, GitHub Actions, hosted Windows, Linux worker RPC and
W7-exit investigation remain prohibited in this local milestone.

## 7. Review gate and stop

The exact active state after materialization is:

```text
HUMAN_BLOCKED / PENDING_INDEPENDENT_2B20AP1_LF_AMENDMENT_CORRECTION_1_REVIEW
amendmentCorrectionRound=1/2
infrastructureRepairRound=0/2
implementationAuthorized=false
```

The required next action is one fresh independent read-only correction review.
Only exact `RULE_DESIGN_PASS` with `remainingBlockers=[]` releases combined
Round 3 plus this replacement authority for implementation. A reviewer
finding remains reviewer-owned; the controller cannot synthesize a pass.
Linux worker RPC and Windows W7 unknown-exit blockers remain downstream.

**Terminal: `READY_FOR_INDEPENDENT_2B20AP1_LF_AMENDMENT_CORRECTION_1_REVIEW`**
