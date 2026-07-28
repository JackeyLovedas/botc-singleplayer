# Phase 3 Slice 2B20AP1 — LF-Safe Identity Encoding Amendment V1 Correction 2

## 1. Final correction metadata

| Field | Exact value |
|---|---|
| `correctionId` | `2B20AP1-LF1-CORRECTION-2` |
| `amendmentId` | `2B20AP1-LF1` |
| `parentCorrectionPath` | `docs/implementation/phase-3-slice-2b20ap1-lf-safe-identity-encoding-amendment-v1-correction-1.md` |
| `parentCorrectionSha256` | `7731bd5092689e8b0604090736955bd54f649bf8d5070ce9f6266b49dc30efe7` |
| `parentCorrectionCommit` | `41d3eac2cd0184bb2063b0f4de6b79dafbc78c66` |
| `reviewPath` | `docs/implementation/phase-3-slice-2b20ap1-lf-safe-identity-encoding-amendment-review-round-2.md` |
| `reviewSha256` | `fcc833748531d3c05a7e130f25efbea0eaccc23e23105714071d1b3256f97cef` |
| `reviewedHead` | `41d3eac2cd0184bb2063b0f4de6b79dafbc78c66` |
| `reviewVerdict` | `RULE_DESIGN_FIX_REQUIRED` |
| `closedFindingId` | `LF3-VITEST-WORKSPACE-DEPRECATION_CAPTURE_CONTRADICTION` |
| `authorization` | `USER_AUTHORIZED_2B20AP1_LF_SAFE_IDENTITY_ENCODING_AMENDMENT_AND_LOCAL_END_TO_END_CLOSURE` |
| `amendmentCorrectionRound` | `2/2` |
| `maxAmendmentCorrectionRounds` | `2` |
| `thirdCorrectionAuthorized` | `false` |
| `infrastructureRepairRound` | `0/2` |
| `implementationAuthorized` | `false` |
| `status` | `PENDING_FINAL_INDEPENDENT_2B20AP1_LF_AMENDMENT_CORRECTION_2_REVIEW` |

This is the standalone final LF amendment authority. It is not Design Round 4
and does not modify the immutable Round 3 design, amendment, Correction 1, or
either review. It incorporates all LF1 and LF2 contracts from Correction 1,
closes only LF3 at design-contract level, and supplies every implementation
literal needed below. It consumes no Infrastructure Repair.

Authority precedence is:

1. unchanged 2B20AP1 governance and Round 3 rule, supersession, ownership,
   traceability, routing, marker, topology and allowlist contracts;
2. this final correction for all LF identity collection, encoding, candidate
   schema, diagnostic handling and candidate gates;
3. immutable accepted A3A/A3B1/A3B2/B19B literals.

The next independent review alone may return `RULE_DESIGN_PASS`. A missing,
truncated, unknown or non-pass result, or any nonempty blocker, immediately
returns 2B20AP1-LF1 to `HUMAN_BLOCKED`; there is no Correction 3.

## 2. Complete inherited identity and scope contract

The sole semantic identity is:

```text
[project, canonicalRepositoryRelativeFile, ancestorPath, completeTitle]
```

`ancestorPath` is a dense ordered string array. Raw `fullName` is
display/projection metadata only. No LF, CR, CRLF, tab, pipe, ` > `, quote,
backslash, NUL, astral code point or unpaired surrogate is trimmed, folded,
normalized, removed or rewritten. Unicode normalization is forbidden.
Repository-relative path canonicalization is the only path normalization.

`identityEncodingVersion` is exactly
`vitest-semantic-identity-json-tuple-v1`. One tuple's canonical bytes are
UTF-8 bytes of `JSON.stringify(tuple)`. The full inventory is validated,
deduplicated, sorted by ordinal comparison of compact tuple JSON using only
`left < right ? -1 : left > right ? 1 : 0`, and encoded exactly as:

```js
Buffer.from(JSON.stringify(sortedCanonicalTuples) + "\n", "utf8")
```

The SHA-256 of those bytes is `inventorySha256`. `localeCompare`,
`Intl.Collator`, environment locale, tab-field framing, raw LF record framing
and delimiter assumptions are forbidden. A projectless length-prefixed
`semanticIdentityKey` may remain an in-memory ownership grouping key only; it
is not the persisted full identity.

The exact live facts remain:

```text
structuredIdentityCount=1572
lfIdentityCount=12
crIdentityCount=0
all twelve LF fields=title
LF code units per affected title=2
accepted history owner=2B18B
2B20A addition=false
LF title change=false
```

The twelve identities remain in project `application`, file
`packages/application/src/mathematician-information.test.ts`, ancestor
`2B18B structural batch and replay tamper contracts`. That source blob matches
accepted head `5a69c90f2d3947556ff45c15c467902b1e28ca43` and remains excluded from edits.

Accepted history remains:

```text
legacyHashesChanged=false
acceptedInventoryMigrationRequired=false
dualHashBridgeRequired=false
dualHashBridgeStatus=NOT_APPLICABLE_NO_ACCEPTED_INVENTORY_MIGRATION
```

No accepted baseline may be refreshed or rewritten, and no bridge field is
legal. A required accepted migration stops with
`LF_SAFE_ENCODING_CANNOT_PRESERVE_ACCEPTED_IDENTITY_HISTORY`.

Product behavior, rule semantics, test semantics, LF titles, marker plan,
coverage profile, timeout, dependency, workspace, package, lockfile, Vitest
projects and process groups remain unchanged. Ordinary topology is nine
groups; coverage is eleven groups; Windows is W1–W7. Dreamer, Philosopher and
Mathematician remain `PARTIAL`; Vortox remains `NOT_STARTED`.

## 3. Complete LF1 contract — same-object single discovery

### 3.1 Exact lifecycle

`scripts/verify-vitest-ownership-contracts.mjs` owns the only candidate
collector and imports only public `createVitest` from `vitest/node`. In each
emit or verify CLI process it creates exactly one Vitest instance and invokes
public `Vitest.collectTests` exactly once:

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
  lifecyclePhase = "INITIALIZING";
  await vitest.init();
  lifecyclePhase = "INITIALIZED";
  const specifications = await vitest.globTestSpecifications([]);
  lifecyclePhase = "COLLECTING";
  collectionInvocationCount += 1;
  const result = await vitest.collectTests(specifications);
  lifecyclePhase = "COLLECTED";
  // strict validation and same-object derivation
} finally {
  lifecyclePhase = "CLOSING";
  await vitest.close();
  lifecyclePhase = "CLOSED";
}
```

`repoRoot` is the resolved process working directory.
`absoluteWorkspacePath` is exactly
`path.resolve(repoRoot,"vitest.workspace.ts")`, a canonical file strictly
inside `repoRoot`. `collectionInvocationCount` begins at zero and must equal
one. `globTestSpecifications([])` occurs once and is not a task collection.
No call to `collect`, `start`, `runTestSpecifications`,
`rerunTestSpecifications`, a second `collectTests`, or any test callback is
permitted.

Missing methods, a failed `createVitest`/`init`/glob/collect, malformed
specifications, malformed/non-array `testModules`, nonempty
`unhandledErrors`, or any `TestModule.errors()` value other than an exact
empty canonical array returns
`VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE`.

### 3.2 Same task objects and result state

Traverse returned `TestModule` values once and each
`testModule.children.allTests()` once. Every `TestCase.module` must be the same
module reference. Retain one `TestCase[]`; both projections carry that same
object reference:

- raw is
  `{project:test.project.name,file:test.module.moduleId,name:test.fullName}`;
- structured project is `test.project.name`;
- file is the canonicalized `test.module.moduleId`;
- title is exact `test.name`;
- ancestors are suite names obtained by following `test.parent` references to
  the module and reversing them;
- tuple is `[project,file,ancestorPath,title]`;
- structured raw projection is
  `[...ancestorPath,title].join(" > ")`.

Require same-reference pairing and exact multiset equality of compact JSON
`[project,canonicalFile,rawName]`, including values and multiplicities.
Require `test.fullName` to equal the structured raw projection. Any mismatch is
`VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH`.

Both projections must have `1572` task references; the exact same `12`
references contain U+000A. Full tuples are unique. Every non-skipped collected
test remains `pending`; none is `passed` or `failed`. The collector never
accesses or calls a test function.

### 3.3 Exact commands

The external `vitest list --json` artifact and every `--inventory` argument
are superseded. Exact emit:

```text
node scripts/verify-vitest-ownership-contracts.mjs --emit-candidate-baseline 2B20A --workspace vitest.workspace.ts --output <ABS_NONEXISTENT_CANDIDATE_JSON>
```

Exact verify:

```text
node scripts/verify-vitest-ownership-contracts.mjs --verify-candidate-baseline 2B20A --workspace vitest.workspace.ts --candidate <ABS_EXISTING_CANDIDATE_JSON>
```

Arguments occur exactly once and in that order. The contract/workspace
literals are case-sensitive. Candidate paths are absolute, OS-temp-parent
validated and noncolliding. Emit uses exclusive creation. Unknown, reordered,
repeated, missing or combined args fail. Emit stdout equals candidate bytes;
verify stdout is only `CANDIDATE_BASELINE_VERIFIED 2B20A\n`. Successful
external stderr is empty.

Emit and verify are separate invocations. Each performs its own one-instance,
one-collection lifecycle and never combines task objects between processes.

## 4. Complete LF2 contract — candidate v2

### 4.1 Exact schema

`schemaVersion` is exactly
`vitest-ownership-candidate-baseline-v2`. The exact ten top-level own data
string keys, in order, are:

```text
schemaVersion
contractId
identityEncodingVersion
structuredIdentityCount
lfIdentityCount
inventorySha256
traceabilitySha256
structuredIdentities
frozenBaseline
acceptedContractBaselines
```

Their exact meanings and fixed values are:

```json
{
  "schemaVersion": "vitest-ownership-candidate-baseline-v2",
  "contractId": "2B20A",
  "identityEncodingVersion": "vitest-semantic-identity-json-tuple-v1",
  "structuredIdentityCount": 1572,
  "lfIdentityCount": 12,
  "inventorySha256": "<recomputed-lowercase-64-hex>",
  "traceabilitySha256": "<recomputed-lowercase-64-hex>",
  "structuredIdentities": "<complete-sorted-1572-tuple-array>",
  "frozenBaseline": "<complete-2B20A-baseline>",
  "acceptedContractBaselines": "<complete-ordered-four-contract-array>"
}
```

`structuredIdentities` is the persisted round-trip authority, not a sample.
Each tuple is a canonical dense length-four array with no symbol/extra own key:
nonempty primitive project/file/title strings, canonical repository-relative
`/` file, and a dense array of nonempty primitive ancestor strings. No
accessor, sparse slot, noncanonical prototype or non-string component is
allowed. Tuples are strictly ascending by ordinal compact-tuple JSON and may
not repeat. Parse/re-stringify is byte- and field-identical.

`inventorySha256` is recomputed only over compact
`JSON.stringify(structuredIdentities) + LF`. `traceabilitySha256` reads the
complete traceability file as UTF-8, normalizes CRLF/lone CR to LF, removes
exactly one final empty sentinel caused by terminal LF, preserves every other
line, rejects NUL, ordinal-sorts, joins with LF, appends one LF, and hashes.

Candidate document bytes are exactly
`Buffer.from(JSON.stringify(candidate,null,2) + "\n","utf8")`: two spaces, LF
only, one terminal LF, no BOM/root/time/locale/environment/random/bridge field.

### 4.2 Complete 2B20A baseline

The `frozenBaseline` keys and order are:

```text
projectExecutionsBefore=22
projectExecutionsAfter=22
projectInventorySha256=<recomputed>
currentProjectInventorySha256=<same recomputed value>
semanticInventorySha256=<recomputed>
authorityInventorySha256=<recomputed>
nonOwnedInventoryPolicy=GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS
nonMarkerOwnershipSha256=<recomputed>
physicalTestFileSetSha256=<recomputed>
traceabilityRowCount=37
dynamicTestAuthorityRows=36
supportingAuthorityCount=37
```

The six hashes use the unchanged shared ownership audit and legacy
`sha256CanonicalLines` only within ownership baselines. Emit and verify
recompute all twelve fields; neither reads candidate literals as authority.

### 4.3 Complete accepted baselines

`acceptedContractBaselines` order is exact exported registry order
`2B19A3A,2B19A3B1,2B19A3B2,2B19B`. Each entry has exact ordered keys
`contractId,frozenBaseline`. Every nested baseline has this exact key order:

```text
projectExecutionsBefore,projectExecutionsAfter,projectInventorySha256,
currentProjectInventorySha256,semanticInventorySha256,
authorityInventorySha256,nonOwnedInventoryPolicy,
nonMarkerOwnershipSha256,physicalTestFileSetSha256,
traceabilityRowCount,dynamicTestAuthorityRows,supportingAuthorityCount
```

Complete immutable literals:

```json
[
  {"contractId":"2B19A3A","frozenBaseline":{"projectExecutionsBefore":34,"projectExecutionsAfter":10,"projectInventorySha256":"3829eb2a26e28e22a568d7e393e22c68aedb8979021a3e3b4522b9e53b6d3c8e","currentProjectInventorySha256":"147ad97c8e5169f135fd5eddbfc25dcb4f29adb0c0902023e80b0efcce0c466d","semanticInventorySha256":"5e544f734381f99f20ac715513b7af7e5a33af6726ca9cad8a0c6d8c1fe7b2cb","authorityInventorySha256":"e098696e88ed4f3d050b6d24511b05522aa26afed43d4f8d09d668c81309f676","nonOwnedInventoryPolicy":"GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS","nonMarkerOwnershipSha256":"764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8","physicalTestFileSetSha256":"55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab","traceabilityRowCount":92,"dynamicTestAuthorityRows":83,"supportingAuthorityCount":2}},
  {"contractId":"2B19A3B1","frozenBaseline":{"projectExecutionsBefore":6,"projectExecutionsAfter":6,"projectInventorySha256":"9d8726005537db396683c3701546a85f0094b3e84ca062f1d7113a66b3eef189","currentProjectInventorySha256":"9d8726005537db396683c3701546a85f0094b3e84ca062f1d7113a66b3eef189","semanticInventorySha256":"bd194c778f83c42c4bc46307f028e1a289b01c50a49c2169ce2a07c267a317f4","authorityInventorySha256":"c42fc09726d54c1e9ea6f7d88756435340f7e329cd5fd45f00c9030979e574c6","nonOwnedInventoryPolicy":"GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS","nonMarkerOwnershipSha256":"764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8","physicalTestFileSetSha256":"55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab","traceabilityRowCount":60,"dynamicTestAuthorityRows":58,"supportingAuthorityCount":4}},
  {"contractId":"2B19A3B2","frozenBaseline":{"projectExecutionsBefore":9,"projectExecutionsAfter":9,"projectInventorySha256":"57a203ad425956791886c56ea8b906b2252186aaf8c5a66be19e7bcf7b0d718e","currentProjectInventorySha256":"57a203ad425956791886c56ea8b906b2252186aaf8c5a66be19e7bcf7b0d718e","semanticInventorySha256":"3379844b47a12a8053869a7db73a300030c0e6029acee9cadf54e64d2500c147","authorityInventorySha256":"65adffd5fe6242cfc64d215629b39a0cf6c5f68bfbb30d1426fdb133f9c5a039","nonOwnedInventoryPolicy":"GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS","nonMarkerOwnershipSha256":"764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8","physicalTestFileSetSha256":"55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab","traceabilityRowCount":58,"dynamicTestAuthorityRows":51,"supportingAuthorityCount":10}},
  {"contractId":"2B19B","frozenBaseline":{"projectExecutionsBefore":10,"projectExecutionsAfter":10,"projectInventorySha256":"92bcddf3603962ff040338874429f43b98f711a0dd4fa02adfbc0ed80bec32c8","currentProjectInventorySha256":"92bcddf3603962ff040338874429f43b98f711a0dd4fa02adfbc0ed80bec32c8","semanticInventorySha256":"8121c6d14bb462f9c0dfe31750bc77890f53d600ff542b1a13450d231e42f482","authorityInventorySha256":"e7e88b9d6be6771d351ac8665b05dcaec305516f402d1a92655b845cba942e81","nonOwnedInventoryPolicy":"GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS","nonMarkerOwnershipSha256":"764888ea567eb545303c17d0cc89706d0b871360a5271912910257397f2829a8","physicalTestFileSetSha256":"55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab","traceabilityRowCount":80,"dynamicTestAuthorityRows":78,"supportingAuthorityCount":10}}
]
```

Altered, omitted, duplicated, reordered or additional contracts reject. No
baseline refresh path exists.

### 4.4 Strict byte authority

Construction uses descriptor-based exact plain object/array validators:
canonical prototype, dense indices, exact own string-key set/order, no symbol,
accessor, extra or missing field. Versions, counts, hashes, tuple order and
accepted literals are exact.

Verify performs one fresh collection, constructs and validates expected v2,
serializes expected bytes, then compares candidate raw `Buffer` bytes before
parsing. Any difference is `CANDIDATE_BASELINE_REPEAT_MISMATCH`. Only equal,
internally generated bytes are parsed and validated again. Duplicate JSON
keys, wrong order, BOM, CRLF, extra whitespace, missing/extra fields and bridge
fields therefore reject before permissive `JSON.parse` behavior.

## 5. LF3 closure — exact workspace diagnostic contract

### 5.1 Static runtime authority

The locked runtime is Node `24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`.
Static authority is installed
`node_modules/vitest/dist/chunks/cli-api.DWGBtMmz.js`, SHA-256
`123e44ea39aee4f9e7a0d8f91fd78d9091c161e56d0f15ece5ab7e807ac5eaed`,
`339628` bytes:

- `Vitest.resolveProjects` resolves the workspace during `vitest.init()`;
- after `resolveWorkspaceConfigPath()` returns the required workspace and
  before `this.import(workspaceConfigPath)`, it calls `logger.deprecate` once;
- `Logger.deprecate(message)` calls
  `this.error(c.bold(c.bgYellow(" DEPRECATED ")),c.yellow(message))`;
- `Logger.error` calls `Console.error`, which inserts one argument separator
  and one terminal LF into the internal stderr sink.

The repository has exactly `vitest.workspace.ts`, SHA-256
`880fd6b085b4d5c49f928f4a08a780706488adf53560d376ebb3ea966a80a90d`,
`4633` bytes, and no `vite.config.*` or `vitest.config.*`. The exact Vitest
label rule is:

```js
const configFile = vitest.vite.config.configFile
  ? resolve(vitest.vite.config.root, vitest.vite.config.configFile)
  : "the root config file";
```

For this repository `vitest.vite.config.configFile` must be falsy and
`configFile` must equal literal `the root config file`. A truthy config file,
different label, or workspace hash/path mismatch is
`VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE`; dynamic absolute labels are
not accepted.

### 5.2 Exact one permitted diagnostic

`internalStderrSink` is a `Writable` with `decodeStrings:false`. It records
each write's primitive string value and current lifecycle phase without
forwarding it. Any non-string chunk is immediately invalid. Chunks are joined
in write order only after close; chunk boundaries are not semantic.

Exactly one logical workspace diagnostic must occur, wholly during
`INITIALIZING`. Its exact color-free bytes are:

```json
" DEPRECATED  The workspace file is deprecated and will be removed in the next major. Please, use the `test.projects` field in the root config file instead.\n"
```

The two spaces after `DEPRECATED` are significant: one is inside
`" DEPRECATED "` and one is `Console.error`'s argument separator.

Because locked `tinyrainbow` color support varies with OS/CI/`NO_COLOR`, the
only other accepted raw byte sequence is exactly:

```json
"\u001b[1m\u001b[43m DEPRECATED \u001b[49m\u001b[22m \u001b[33mThe workspace file is deprecated and will be removed in the next major. Please, use the `test.projects` field in the root config file instead.\u001b[39m\n"
```

The only permitted controls are exactly the six shown SGR sequences
`ESC[1m`, `ESC[43m`, `ESC[49m`, `ESC[22m`, `ESC[33m`, `ESC[39m`, in that
order, plus the one terminal LF. No CR, tab, BEL, OSC, cursor, erase or other
C0/C1/control sequence is permitted.

The joined raw diagnostic must equal exactly one of those two complete strings;
this proves occurrence count one and rejects altered, additional or repeated
diagnostics. After raw equality, Node's `stripVTControlCharacters` must produce
the exact color-free string above. The stripper is a confirmation only, never
a whitelist: arbitrary control-bearing input fails raw equality first.

The expected diagnostic is consumed internally only after all of these checks.
It never reaches external stderr and is not classified as a failure. No other
warning, deprecation or diagnostic is whitelisted by message prefix, regex,
severity, source, or phase.

### 5.3 Exception-safe failure and close

Capture starts before `createVitest` and remains active through `close()`.
`internalStdoutSink` must remain exactly empty. All stderr writes must occur
during `INITIALIZING` and concatenate to the exact one diagnostic. Output
during `CREATED`, `INITIALIZED`, `COLLECTING`, `COLLECTED`, `CLOSING` or
`CLOSED` is additional and fails.

The collector records a primary exception without forwarding it, then attempts
`vitest.close()` exactly once whenever an instance was created. A close
exception is recorded without replacing the primary exception. After the
close attempt it validates both internal sinks and lifecycle counters.

Any primary error, close error, missing/altered/repeated/non-string diagnostic,
unexpected phase, nonempty internal stdout, nonempty `unhandledErrors`,
module collection error, malformed `testModules`, missing public API, wrong
workspace/config label, instance count other than one, collection count other
than one, or execution/test-callback count other than zero returns exactly
`VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE`, exit one, zero stdout, and
one stable external stderr line. Internal diagnostics and exception text are
never forwarded. If no Vitest instance was created, no close is attempted.

Emit/candidate bytes are possible only after successful close and exact
diagnostic consumption. Verify likewise does not report success until its own
fresh instance is closed and its exact diagnostic is consumed.

This exception changes no workspace, package, dependency, profile, topology,
project or process group. It is not a general warning allowance.

## 6. Complete frozen regression matrix

All Correction 1 tests remain mandatory:

1. title LF round-trip;
2. ancestor LF round-trip;
3. raw LF plus valid structured fields;
4. distinct CR/CRLF/LF;
5. tab/pipe/` > `/quote/backslash;
6. NUL;
7. astral/unpaired-surrogate exact JSON;
8. LF-position collision;
9. file/title LF-boundary collision;
10. ancestor segmentation collision;
11. strict parse equality;
12. duplicate tuple;
13. noncanonical path;
14. sparse ancestor;
15. extra/missing tuple field;
16. all 12 live LF identities encode;
17. all 12 persist in candidate;
18. accepted hashes exact;
19. bridge rejected;
20. deterministic repeated candidate;
21. emit calls `collectTests` once;
22. verify calls `collectTests` once;
23. same 1572 task references;
24. exact raw/structured value and multiplicity;
25. same 12 LF references;
26. unavailable/malformed structured data stable error;
27. raw/structured value mismatch stable error;
28. multiplicity mismatch stable error;
29. zero callbacks/execution APIs;
30. ordinary 9 / coverage 11 / no topology addition;
31. exact v2 top-level keys/order/version;
32. exact 2B20A baseline keys/order/counts;
33. exact accepted baseline keys/order/literals;
34. altered/omitted/duplicate/reordered accepted contract;
35. altered hash/count/contract/encoding/schema;
36. strict persisted tuple parse/order/equality;
37. all 12 persisted tuples round-trip;
38. duplicate/unsorted/missing/extra tuple;
39. byte-identical v2 emission;
40. top-level/nested bridge rejection;
41. duplicate JSON key rejected before parse;
42. verify regeneration equality/mismatch.

The five required LF3 groups are additionally frozen:

43. current exact workspace initialization emits exactly one permitted
    diagnostic and collection remains eligible;
44. both exact colored and color-free variants normalize to the exact message,
    are consumed internally, and external success stderr remains empty;
45. altered text, altered config label, missing/repeated/additional diagnostic,
    any other control sequence, wrong phase, non-string chunk or nonempty
    internal stdout returns
    `VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE`;
46. nonempty `unhandledErrors`, one module error, malformed/non-array
    `testModules`, missing public API, init/glob/collect error and close error
    each independently return the same stable error;
47. for both emit and verify, expected diagnostic handling preserves exactly
    one instance, one `collectTests`, one close when created, zero execution
    APIs and zero test callbacks.

Negative cases mutate one dimension and assert the exact stable error. No test
may change a title, create a new test/script file, or add a project, process,
dependency, timeout or profile.

## 7. Unchanged complete Round 3 implementation boundary

Only after final independent `RULE_DESIGN_PASS` with
`remainingBlockers=[]`, implementation must still complete:

- four accepted-authority supersession records and exact A3A C17, A3B1
  C18/C28 and A2 C20 dispositions;
- canonical `[2B20A-*]` markers and independent 2B20A ownership;
- 37 active criteria, 37 unique primaries and 37 used `SUP` records;
- zero compound, borrowed, duplicate or cross-contract primaries;
- C32 Static `PASS`, Hosted `PENDING`;
- ordinary 9, coverage 11 and Windows W1–W7 routing;
- unchanged unsuperseded accepted history, exact partitions and rollback.

Exact future implementation allowlist:

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

No new script/test file is authorized.
`packages/application/src/mathematician-information.test.ts`, all production,
rule/matrix/profile/workspace/package/lock/dependency/timeout files, Windows
verifier, Linux/W7 diagnostics, product branch, PR #46 and remote state remain
excluded.

Candidate local gate uses one OS-temp seed and candidate path, runs the exact
emit then verify commands, records candidate/baseline hashes, and removes only
the validated exact temp files in `finally`. There is no raw inventory file.
All other Round 3 local gates remain. Full coverage, GitHub Actions, hosted
Windows, Linux worker RPC and W7-exit investigation remain prohibited.

## 8. Final amendment review gate

After materialization the exact state is:

```text
HUMAN_BLOCKED / PENDING_FINAL_INDEPENDENT_2B20AP1_LF_AMENDMENT_CORRECTION_2_REVIEW
amendmentCorrectionRound=2/2
infrastructureRepairRound=0/2
implementationAuthorized=false
```

Required next action is one final fresh independent read-only LF amendment
review. Only exact `RULE_DESIGN_PASS` with `remainingBlockers=[]` releases the
combined Round 3 plus this final authority. Any other result is immediately
`HUMAN_BLOCKED / 2B20AP1_LF_AMENDMENT_CORRECTION_BUDGET_EXHAUSTED`; no third
correction, implementation, repair, push, PR, CI or next slice is authorized.

**Terminal: `READY_FOR_FINAL_INDEPENDENT_2B20AP1_LF_AMENDMENT_CORRECTION_2_REVIEW`**
