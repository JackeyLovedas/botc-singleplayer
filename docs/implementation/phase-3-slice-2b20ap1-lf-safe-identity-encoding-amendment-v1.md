# Phase 3 Slice 2B20AP1 — LF-Safe Identity Encoding Amendment V1

## 1. Metadata and authority

| Field | Exact value |
|---|---|
| `amendmentId` | `2B20AP1-LF1` |
| `parentDesignPath` | `docs/implementation/phase-3-slice-2b20ap1-design-round-3.md` |
| `parentDesignSha256` | `4f2fab7b877ca98e1fb46974661874353dd78a1c6b388cb91d3031c59608e003` |
| `parentDesignVerdict` | `RULE_DESIGN_PASS` |
| `candidateBlockedHead` | `9fa3bcd2816616105081cba3e20d00f41b220af1` |
| `exactBlocker` | `FROZEN_RAW_VITEST_NAME_LF_CONTRACT_CONFLICT` |
| `authorization` | `USER_AUTHORIZED_2B20AP1_LF_SAFE_IDENTITY_ENCODING_AMENDMENT_AND_LOCAL_END_TO_END_CLOSURE` |
| `infrastructureDesignChanged` | `true` |
| `infrastructureDesignChangeScope` | `IDENTITY_ENCODING_ONLY` |
| `productBehaviorChanged` | `false` |
| `ruleSemanticsChanged` | `false` |
| `testSemanticsChanged` | `false` |
| `testTitlesChanged` | `false` |
| `markerPlanChanged` | `false` |
| `topologyChanged` | `false` |
| `profileChanged` | `false` |
| `implementationAuthorized` | `false` |
| `infrastructureRepairRound` | `0/2` |
| `identityEncodingVersion` | `vitest-semantic-identity-json-tuple-v1` |
| `status` | `PENDING_INDEPENDENT_2B20AP1_LF_AMENDMENT_REVIEW` |

This is not Design Round 4. The parent Round 3 design and its independent
`RULE_DESIGN_PASS` archive remain immutable history. This amendment supersedes
only the parent clauses that reject LF in a legal Vitest name, use raw
line-framing for the complete candidate inventory, depend on CR/LF prohibition
for record boundaries, or emit `VITEST_RAW_INVENTORY_INVALID_NAME` solely
because a legal identity contains LF.

Everything else in Round 3 remains binding, including the accepted-authority
supersession model and dispositions, canonical `[2B20A-*]` marker plan, 37
active criteria, 37 unique primary targets, 37 unique `SUP` targets, C32
Static `PASS` / Hosted `PENDING`, nine ordinary groups, eleven coverage groups,
W1–W7, unchanged project/process topology, unchanged coverage profile, and
zero product or rule change.

## 2. Recovery and fresh evidence

The amendment was prepared from clean infrastructure HEAD
`9fa3bcd2816616105081cba3e20d00f41b220af1` on branch
`infra/2b20ap1-ownership-supersession-routing-v1`. Commit
`167d800e20bed5431764092877085886df4b7c93` is an ancestor. The product branch
still resolves to that exact commit. PR #46 was read only and remained
`OPEN`, unmerged, and at remote HEAD
`dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`. Infrastructure Repair remained
`0/2`.

One fresh inventory was collected without running tests or coverage:

```text
Node: v24.15.0
Corepack pnpm: 11.7.0
command: corepack pnpm exec vitest list --workspace vitest.workspace.ts --json=.codex-tmp-2b20ap1-lf1-inventory.json
records: 1572
source fields: file, name, projectName
source structured ancestor/title fields: absent
raw inventory bytes: 436062
raw inventory SHA-256: f596c3ef79d5f37dcbd06326ea97efc59bddc35588a00702c364c57b76064bcf
LF-bearing records: 12
CR-bearing records: 0
exact structured tuple duplicates under the current repository interpretation: 0
```

The raw inventory and the repository-local analysis result were temporary.
The analysis result was valid JSON, `5818` bytes, SHA-256
`cb4e87bc3aa96abcfa0a4baa324c093d277ada35b5ba1ae9e1bf011d91faa43e`;
both temporary files were removed and are not commit inputs.

The prior external operational artifacts were inspected only:

| Artifact | Size | SHA-256 | Secret assessment | Disposition |
|---|---:|---|---|---|
| `C:\Users\wjl\AppData\Local\Temp\tmp30A8.tmp` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | Empty; no secret | `OPERATIONAL_RECOVERY_TEMP_ARTIFACT_RETAINED_NON_GATING` |
| `C:\Users\wjl\AppData\Local\Temp\tmp30A8.tmp.inventory.json` | 435728 | `a76758ea7c162cc96710c7a3765fadf622091e0e7e32cd393e47692e2920074f` | Vitest names/project/file metadata only; no credential or canonical game secret. Absolute local paths expose machine/user path metadata. | `OPERATIONAL_RECOVERY_TEMP_ARTIFACT_RETAINED_NON_GATING` |

Both exact parents were validated as the OS temporary directory. One
non-recursive literal-path deletion attempt was rejected by tool policy before
execution. It is not retried, consumes no repair round, and no later candidate
may read or depend on either old file. The old candidate path
`C:\Users\wjl\AppData\Local\Temp\tmp30A8.tmp.candidate.json` does not exist.

## 3. The twelve LF identities

All twelve entries are in project `application`, file
`packages/application/src/mathematician-information.test.ts`, under ancestor
`"2B18B structural batch and replay tamper contracts"`. Each complete title
contains exactly two LF code units, contains no CR or CRLF, and contains no
literal ` > `. LF occurs in `title`, never in `ancestorPath`.

The source is the existing `it.each(tamperCases)` title
`"[REPLAY-TAMPER-%s] rejects stored %s tampering"`. Vitest stringifies the
second `%s` function argument, preserving the function body's two LFs in the
actual generated test title. The same source exists at accepted base
`5a69c90f2d3947556ff45c15c467902b1e28ca43`; these are legal accepted 2B18B
identities, not 2B20A additions and not display-only corruption.

The complete raw names below are JSON-escaped strings. No raw LF is used as a
line-record boundary:

```json
[
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-task] rejects stored (payload) => {\n      payload.taskId = \"first-night-v1:MATHEMATICIAN_INFORMATION:seat-12\";\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-source] rejects stored (payload) => {\n      payload.sourceContract.sourcePlayerId = \"wrong-player\";\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-window] rejects stored (payload) => {\n      payload.windowSnapshot.endEventSequence = delivery.windowSnapshot.endEventSequence + 1;\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-truth] rejects stored (payload) => {\n      payload.trueCount = (delivery.trueCount + 1) % 12;\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-abnormal players] rejects stored (payload) => {\n      payload.distinctAbnormalPlayers = [{ playerId: \"wrong\", seatNumber: 1, supportingFactIds: [] }];\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-fact IDs] rejects stored (payload) => {\n      payload.qualifyingAbnormalFactIds = [\"wrong-fact\"];\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-selected count] rejects stored (payload) => {\n      payload.selectedCount = (delivery.selectedCount + 1) % 12;\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-candidates] rejects stored (payload) => {\n      payload.legalCandidateCounts = [11];\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-source effectiveness] rejects stored (payload) => {\n      payload.sourceEffectiveness = { kind: \"KNOWN_DRUNK\", representedImpairments: [] };\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-Vortox variant] rejects stored (payload) => {\n      payload.vortoxConstraint = { kind: \"NONE_NO_CURRENT_VORTOX\", evaluatedCharacterStateRevision: delivery.settlementCharacterStateRevision + 1 };\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-policy] rejects stored (payload) => {\n      payload.simulationPolicyVersion = \"wrong-policy\";\n    } tampering",
  "2B18B structural batch and replay tamper contracts > [REPLAY-TAMPER-extra field] rejects stored (payload) => {\n      payload.unexpected = true;\n    } tampering"
]
```

For the twelve entries, the raw-list-only diagnostic interpretation is:
split on the exact string `" > "`, retain every code unit, take the final
segment as `title`, and take prior segments as `ancestorPath`. This diagnostic
interpretation produced nonempty fields and the facts above. It is not the
future semantic authority defined in section 4.

### Required eight answers

1. **LF belongs to the real test title:** yes; each title has two LF code
   units.
2. **LF belongs to an ancestor title:** no; all affected `ancestorPath` arrays
   are LF-free.
3. **LF is only raw-display formatting:** no. The raw display carries LF, but
   it originates in the actual dynamically formatted title value.
4. **The twelve already exist in accepted history:** yes, at accepted base
   `5a69c90f2d3947556ff45c15c467902b1e28ca43`.
5. **They are new 2B20A identities:** no; they are `[REPLAY-TAMPER-*]` tests in
   the 2B18B suite.
6. **They participate in old frozen baseline hashes:** no. The accepted
   A3A/A3B1/A3B2/B19B inventories are marker-scoped to
   `packages/application/src/game-application-service.test.ts`; these twelve
   are in `mathematician-information.test.ts`. The frozen physical-file hash
   hashes the registered contract file set, not these titles.
7. **They only affect candidate transport/serialization:** they affect the
   complete candidate's identity inventory and its serialization, but do not
   change any accepted frozen ownership hash or product/test semantics.
8. **Can distinct structured inventories collide under the old line
   encoding:** yes. One tuple with title `"t\nq\tg\t\tu"` and two tuples with
   titles `"t"` and `"u"` can both encode as
   `"p\tf\t\tt\nq\tg\t\tu\n"`. JSON tuple arrays encode them differently.

## 4. Structured identity authority and raw-source equivalence

The sole semantic identity definition remains:

```text
[project, canonicalRepositoryRelativeFile, ancestorPath, completeTitle]
```

`ancestorPath` is a dense ordered array of strings. `rawName` is transport and
display metadata only. It is never sufficient semantic authority.

The current `vitest list --json` source exposes only `projectName`, `file`, and
raw `name`. Therefore implementation must obtain the structured test task
identity from the same existing Vitest discovery execution, using the
installed Vitest programmatic task graph or a structured reporter/adapter that
does not execute test bodies. It may not add a Vitest project or process
group.

The raw-list output is checked against the structured source as a complete
multiset:

1. Canonicalize project and repository-relative file under the existing path
   rules.
2. Project each structured identity to the display value
   `[...ancestorPath, title].join(" > ")` without normalization.
3. Compare exact multiplicities of `[project,file,projectedRawName]` against
   the raw list's `[projectName,file,name]`.
4. Require both multisets to have the same size and zero missing or unexpected
   records.
5. Build canonical tuples only from the structured source.

This remains unambiguous even if a structured component itself contains
`" > "`, because raw projection is only an equivalence check and never
reconstructs the tuple. If the same-discovery structured source cannot be
obtained or the multiset comparison fails, fail closed with
`VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE` or
`VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH`; do not fall back to LF splitting,
`split(/\r?\n/)`, trimming, folding, or title rewriting.

The existing length-prefixed `semanticIdentityKey` may remain an in-memory
projectless ownership-grouping key. Where a one-to-one full-identity key is
needed, it must be project-bound as
`encodeFields([project, semanticIdentityKey(identity)])`. Parsing that
length-prefixed form and the JSON tuple must produce field-by-field identical
values. The projectless grouping key is not an artifact identity and cannot
replace the four-field tuple.

## 5. Frozen LF-safe canonical encoding

`identityEncodingVersion` is exactly
`vitest-semantic-identity-json-tuple-v1`.

For one identity:

```js
const canonicalTuple = [project, file, ancestorPath, title];
const canonicalBytes = Buffer.from(JSON.stringify(canonicalTuple), "utf8");
```

For the complete inventory:

1. Validate every tuple and reject duplicates before hashing.
2. Compute `JSON.stringify(tuple)` for ordinal comparison only.
3. Sort tuples by the existing raw-code-unit comparator
   `left < right ? -1 : left > right ? 1 : 0`; never use `localeCompare`,
   `Intl.Collator`, or environment locale.
4. Encode exactly
   `Buffer.from(JSON.stringify(sortedCanonicalTuples) + "\n", "utf8")`.

The fresh 1572-entry diagnostic encoding produced `300873` bytes and SHA-256
`e363aad75c564f7dc1d577302becff7be8064472453369895340c2f595d2cefc`.
That value is evidence for the clean blocked HEAD, not a frozen future
candidate hash; approved marker migrations will intentionally change future
identity tuples.

JSON escapes LF as `\n`, CR as `\r`, and losslessly represents tab, quote,
backslash and NUL under JavaScript's exact JSON behavior. No Unicode
normalization is performed. No string is trimmed, folded, line-normalized, or
rewritten. `ancestorPath` order and segmentation are preserved. File paths use
only the repository's existing cross-platform canonicalization. Windows and
Linux therefore receive identical canonical bytes for identical structured
fields.

Raw fields must never be tab-joined and then LF-framed for the candidate hash.
The implementation may pretty-print the candidate JSON document, but the
authoritative inventory hash is always over the exact compact canonical bytes
above.

## 6. Accepted-hash protection and bridge decision

The current accepted ownership implementation has three distinct mechanisms:

- `semanticIdentityKey` is a length-prefixed in-memory key.
- `semanticInventorySha256`, `currentProjectInventorySha256`, and
  `nonMarkerOwnershipSha256` use legacy tab/LF canonical lines.
- `authorityInventorySha256` and `physicalTestFileSetSha256` hash sorted
  marker/file strings with LF record framing.

All frozen A3A, A3B1, A3B2, and B19B values remain byte-for-byte unchanged.
Their registered inventories are confined to
`packages/application/src/game-application-service.test.ts`; the twelve LF
titles are outside those contract inventories. The coverage verifier already
uses JSON-string identity keys, so LF is escaped inside a JSON string before
any key-list hash. Only the proposed full candidate transport in Round 3 used
unsafe raw tab/LF framing.

Therefore:

```text
legacyHashesChanged=false
acceptedInventoryMigrationRequired=false
dualHashBridgeRequired=false
dualHashBridgeStatus=NOT_APPLICABLE_NO_ACCEPTED_INVENTORY_MIGRATION
```

The future candidate must separately record:

- every unchanged accepted contract ID and its complete frozen baseline
  object as legacy authority evidence;
- `identityEncodingVersion`;
- the LF-safe complete candidate `inventorySha256`;
- the exact structured identity count.

The accepted baselines prove historical authority. The new candidate hash
proves the proposed complete structured inventory. Neither substitutes for,
rewrites, or silently migrates the other. If implementation discovers that an
accepted inventory actually must migrate, it must stop with
`LF_SAFE_ENCODING_CANNOT_PRESERVE_ACCEPTED_IDENTITY_HISTORY`; this amendment
does not authorize creation of a bridge after review.

## 7. Mandatory self-tests

The implementation must freeze and pass all twenty:

1. title containing LF round-trips exactly;
2. `ancestorPath` containing LF round-trips exactly;
3. raw name containing LF with valid structured fields is accepted;
4. CR, CRLF, and LF each round-trip without equivalence;
5. tab, pipe, ` > `, quote, and backslash round-trip;
6. NUL round-trips;
7. astral Unicode and unpaired surrogates follow exact JavaScript/JSON
   behavior without normalization;
8. identities that differ only by LF position have different encodings;
9. `[file="a\nb",title="c"]` and `[file="a",title="b\nc"]` do not collide;
10. different ancestor segmentation does not collide;
11. JSON parse is strictly field-by-field equal;
12. duplicate full semantic identity is rejected;
13. noncanonical repository path is rejected;
14. sparse `ancestorPath` is rejected;
15. extra or missing tuple/artifact fields are rejected;
16. all twelve observed LF identities encode successfully;
17. a candidate containing all twelve observed identities emits successfully;
18. every unaffected accepted frozen hash remains exact;
19. because no bridge applies, any candidate-supplied bridge is rejected as an
   unexpected field; the generic bridge validator, if retained, rejects a
   wrong hash;
20. two complete candidate generations from the same structured inventory are
   byte-identical.

No test title may be changed to satisfy these checks.

## 8. Exact future implementation allowlist

Only these files may change after an independent reviewer returns
`RULE_DESIGN_PASS` with no remaining blocker:

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

The first three existing script/self-test files own the minimum LF-safe
adapter, encoding, candidate validation, and self-tests; no new script or test
file is authorized. The two test files and traceability file remain limited to
the already reviewed Round 3 marker/supersession plan. In particular,
`packages/application/src/mathematician-information.test.ts` is not in the
allowlist.

No production file, product-rule semantic change, LF-title edit, new project,
new process group, coverage profile, timeout, dependency, Linux worker RPC
diagnostic, Windows W7 global-error diagnostic, product branch, PR #46, or
remote state is authorized.

## 9. Review and stop condition

This amendment alone does not authorize implementation. The controller must
freeze and commit this document plus the four control files, then obtain a new
independent read-only amendment review. The valid verdicts are exactly
`RULE_DESIGN_PASS`, `RULE_DESIGN_FIX_REQUIRED`, or `HUMAN_BLOCKED`.

Only `RULE_DESIGN_PASS` with `remainingBlockers=[]` releases the combined
Round 3 plus amendment implementation. Until then the exact state is
`PENDING_INDEPENDENT_2B20AP1_LF_AMENDMENT_REVIEW`,
`implementationAuthorized=false`, and Infrastructure Repair remains `0/2`.

**Terminal: `READY_FOR_INDEPENDENT_2B20AP1_LF_AMENDMENT_REVIEW`**
