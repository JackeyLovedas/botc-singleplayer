# Phase 3 Slice 2B20AP1 — Design Round 3 final replacement

## Metadata and authority

- `sliceId=2B20AP1`; `taskType=CI_TEST_INFRASTRUCTURE_PREREQUISITE / NON_PRODUCT`.
- `designRound=3/3`; `designCorrectionRound=2/2`; `maxCorrection=2`; this is the final complete replacement, not an erratum and not a later slice.
- `targetPath=docs/implementation/phase-3-slice-2b20ap1-design-round-3.md`.
- Branch/inspected HEAD: `infra/2b20ap1-ownership-supersession-routing-v1` / `fbfe07427a3cc789e8166936615c3f16b2fd77d0`; worktree `CLEAN`; the branch is local/unpushed. `origin/main=5a69c90f2d3947556ff45c15c467902b1e28ca43`; PR #46 remains OPEN at `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8` and is unrelated/unmodified.
- Governance is immutable `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md` / `583f1778582c168935b380b19e453117b000d8caf18dd3a4cd7731365cdb3537` / `GO`.
- Rule authority is immutable `docs/rules/evidence/2B20A-resolved.md` / `47e6c5a70b1eae70f51e9a4e0d78c8ab0d2ddf272babb3f9c76e51970c893189` / `RULE_READY`; original evidence remains `1a51a2aebae79e831ca2146aaae47f423b472108bb9759cfc3d452dc344efe00`. The current role matrix was read at SHA-256 `be3926e3d93a9daf0b76e4a61e9ec58c920796310671192d8192ea82b26a1105`; Dreamer remains `PARTIAL` and no matrix edit is authorized.
- Immutable design chain: original design `622d5e8572e933a38c5503fa80ee342c8acee084b62ed1578ede0569a3e22c46`; Round-1 review `eedea1f3c721c1878683700b275cd164ee62c090eeb1298b88a39588db548943`; Round-2 replacement `aac241bc6207af83d78125c0ac311d608207113d1f3340f9cb846a88c74747bc`; Round-2 review `3710c07c099cc268725e8550bdfa72030e2ed4d01453096a78dab3100cf368de`.
- `behaviorDesignChanged=false`; `ruleSemanticsChanged=false`; `coverageProfileChanged=false`; `topologyChanged=false`; `processGroupChanged=false`; `timeoutChanged=false`; `dependencyChanged=false`; `implementationAuthorized=false`.

The sole writer materializes this exact body once. Its exact UTF-8 byte SHA-256 becomes `finalDesignSha256`; controls record that derived value. The independent Round-3 reviewer reviews that exact SHA. Only a complete `RULE_DESIGN_PASS` with empty blockers authorizes implementation; until then no implementation write is allowed.

## Scope and non-goals

One coupled infrastructure risk only: append-only accepted-authority supersession; canonical 2B20A ownership; exact 37-row traceability and 37-entry supporting registry; unchanged-topology ordinary/coverage/Windows routing. No production behavior, BOTC rule, domain event/runtime shape, replay/atomic/prospective/retry/projection contract, test assertion, test count, profile, dependency, timeout, Vitest project/process group, Linux worker-RPC behavior, Windows W7 exit behavior, or hosted-CI authority changes. No test is added/deleted/weakened/skipped/`.only`; ordinary inventory remains 1572.

## Accepted-history supersession contract (Round-2 contracts retained)

In `scripts/vitest-ownership-contracts.mjs`, add exact scopes `WHOLE_TEST|SUBCASE|MARKER_ALIAS`, dispositions `WHOLE_TEST_SEMANTIC_SUPERSESSION|SUBCASE_SUPERSESSION|RETIRED_NONPRIMARY_ALIAS`, and known contracts `2B19A2,2B19A3A,2B19A3B1,2B19A3B2,2B19B,2B20A`. Each record has exactly `{supersessionId,predecessor,scope,subcaseKey,disposition,successor,rationale}`; predecessor exactly `{acceptedHead,acceptedBlobOid,contractId,criterionId,ownerProject,file,ancestorPath,title,historicalLocator}`; successor exactly `{contractId,criterionId,ownerProject,file,ancestorPath,title}`. Enforce dense own-data canonical arrays/plain objects, exact keys, nonempty strings, canonical repo paths and lowercase 40-hex Git IDs; reject accessors, symbols, sparse/extra/missing data.

Unified graph node key is head-independent `encode([contractId,criterionId,file,encode(ancestorPath),title])`, `encode(xs)=xs.map(x=>x.length+":"+x).join("|")`. Accepted HEAD/blob are provenance, not node identity. Reject duplicate edge, multiple successor, whole/subcase overlap, self/two-node/multigeneration cycle, unknown contract, missing/non-ancestor head, absent/wrong blob/file/title/ancestor, missing current successor, alias-as-primary and missing preserved C28. Diagnostics use raw UTF-16 code-unit order and stable codes.

Exact records, all at accepted head `5a69c90f2d3947556ff45c15c467902b1e28ca43` and application blob `0ff733004899f17ff82b20b40b0f41b888ba85d0`:

1. `SUPR-2B20AP1-001`: A3A/C17 WHOLE, historical `[2B19A3A-C17] fails a represented DRUNK base Dreamer receipt-free through the real Philosopher chain`, ancestor `GameApplicationService`, to 2B20A/C35.
2. `SUPR-2B20AP1-002`: A3B1/C18 WHOLE, historical `[2B19A3B1-C18/C28] keeps canonical DRUNK without effective Vortox receipt-free, OPEN, and retryable`, ancestor `Phase 3 Slice 2B19A3B1 canonical-drunk Vortox Dreamer`, to C35.
3. `SUPR-2B20AP1-003`: the obsolete C28 token on item 2 is `MARKER_ALIAS/C28`, resolving only to preserved `[2B19A3B1-C28/C29] proves every V4 failure stage is atomic retryable and converges exactly once`; that primary stays byte-identical and is not superseded.
4. `SUPR-2B20AP1-004`: A2/C20 `SUBCASE/A2_C20_DRUNK_NO_CURRENT_VORTOX`, ancestor `GameApplicationService`, to C35. `no-dashii`, dependency and prospective cases remain preserved support.

Whole/alias locators are exact-title occurrence 1 plus exact ancestor. A2 uses LF-normalized bounded source: whole sentinels `[2B19A2-C20]...` to `[2B19A2-C21]...`, `wholeChars=5835`, SHA `e06c3a7f9d4cb2ac2a2eed24f2082ff6cf5819b0af7388c11e47e478b0e34531`; subcase `const drunk = makeService();` to `const dependencyStore = new OneShotDomainEventLoadFailureStore();`, `subcaseChars=1746`, SHA `b5ccb8e06ca99b5e21bca2ce60806fcd6f2f9d7f509dece50d217dd3f7e6ae85`. Missing/duplicate/renamed sentinel, bounds/count/hash mismatch fail closed.

Historical baseline reconciliation is append-only: a validated WHOLE record supplies exactly one virtual predecessor identity only to its predecessor contract’s accepted-authority baseline/old trace binding; it never becomes a live execution or 2B20A primary. MARKER_ALIAS and SUBCASE add no virtual test. Old A3A/A3B1/A3B2/B19B literals remain byte-identical; current 2B20A uses live inventory. This restores auditable accepted authority without refreshing an old hash or rewriting history.

## Exact 2B20A ownership contract

Append one `RAW_OWNERSHIP_CONTRACTS` object with the current exact ten keys: `applicationTestFile,contractId,criterionIds,frozenBaseline,markerPattern,markerPrefix,ownerProject,status,supportingAuthorityPrefix,traceabilityFile`. Values are:

- `applicationTestFile="packages/application/src/game-application-service.test.ts"`; `contractId="2B20A"`; `markerPattern="^\\[2B20A-[^\\]]+\\]"`; `markerPrefix="[2B20A-"`; `ownerProject="application-service-dreamer-vortox"`; `status="ACTIVE"`; `supportingAuthorityPrefix="SUP-2B20A-"`; `traceabilityFile="docs/implementation/phase-3-slice-2b20a-test-traceability.md"`.
- `criterionIds=[C01,C03,C04,C05,C06,C07,C10,C11,C12,C13,C14,C15,C16,C17,C18,C19,C20,C21,C22,C23,C24,C25,C26,C27,C28,C29,C30,C31,C32,C33,C34,C35,C36,C37,C38,C39,C40]`.
- `frozenBaseline` has exactly the current twelve `BASELINE_KEYS`: `authorityInventorySha256,currentProjectInventorySha256,dynamicTestAuthorityRows,nonMarkerOwnershipSha256,nonOwnedInventoryPolicy,physicalTestFileSetSha256,projectExecutionsAfter,projectExecutionsBefore,projectInventorySha256,semanticInventorySha256,supportingAuthorityCount,traceabilityRowCount`. Counts are `22,22,36,37,37` respectively for before, after, dynamic rows, support and trace rows; policy remains `GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS`; all six hashes are lowercase 64-hex verified candidate literals. `projectInventorySha256=currentProjectInventorySha256` for this nondeduplicated new contract.

`EXPLICIT_UNMARKED_2B20A_PRIMARIES` is an exact five-record `{criterionId,file,ancestorPath,title}` whitelist for C11,C15,C24,C33,C36 below. Each is consumed once; any other/missing/duplicate unmarked primary rejects. It is not counted among the 22 application ownership executions. C30 is canonical marked, not whitelisted.

## Exact 37 final primary identities

Notation: `APP=packages/application/src/game-application-service.test.ts`; `SLICE=["Phase 3 Slice 2B19A3B1 canonical-drunk Vortox Dreamer"]`; `GAS=["GameApplicationService"]`. Every test identity below is exact `{project,file,ancestorPath,title}` after authorized title migration; C32 is the one static repository primary.

- C01,C03,C04,C05,C06,C07,C10 use project `application-service-dreamer-vortox`, file APP, ancestor SLICE, titles respectively: `[2B20A-C01] proves the exact reachable source impairment and Fang Gu precondition snapshot`; `[2B20A-C03] reaches a naturally selected TRUE V7 stream through the real command boundary`; `[2B20A-C04] reaches a naturally selected FALSE V7 stream through the real command boundary`; `[2B20A-C05] settles the base Dreamer task and closes its V3 opportunity atomically`; `[2B20A-C06] derives TRUE as a normal base-Dreamer fact with zero contribution`; `[2B20A-C07] derives FALSE as one abnormal base-Dreamer drunkenness contribution`; `[2B20A-C10] records the exact nine existing evidence variants for V7`.
- C11: `application-service-information-and-later-actions`, APP, GAS, `rejects invalid Dreamer submissions with deterministic receipts` (unmarked).
- C12,C13,C14: dreamer-vortox, APP, SLICE, `[2B20A-C12] rejects an unrepresented Traveller target id at the real command boundary`; `[2B20A-C13] rejects a forged V3 opportunity id without appending a batch`; `[2B20A-C14] preserves success receipt replay and fingerprint conflict semantics`.
- C15: information-and-later-actions, APP, GAS, `keeps SubmitDreamerAction metadata generation failures classified independently` (unmarked).
- C16–C20: project `domain-core`, file `packages/domain-core/src/dreamer.test.ts`, ancestor `["Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer"]`, titles `[2B20A-C16] constructs the complete raw-UTF16 ordered GOOD by EVIL candidate product`; `[2B20A-C17] selects the first candidate in the parity-selected truth class`; `[2B20A-C18] validates the exact 22-key V7 payload and selected top-level roles`; `[2B20A-C19] deep-clones and compares every V7 nested canonical decision`; `[2B20A-C20] rejects getter Proxy symbol cycle sparse and nonplain V7 inputs with zero getter calls`.
- C21,C22,C23: dreamer-vortox, APP, SLICE, `[2B20A-C21] rebuilds the complete accepted V7 stream identically`; `[2B20A-C22] rejects reordered or missing V7 batch members during replay`; `[2B20A-C23] rejects persisted V7 candidate and policy mutations during replay`.
- C24: `domain-core-rebuild`, `packages/domain-core/src/rebuild.test.ts`, `["domain event rebuild"]`, `rejects malformed Dreamer replay batches` (unmarked).
- C25,C26,C27: dreamer-vortox, APP, SLICE, `[2B20A-C25] projects the accepted V7 pair only to its source player`; `[2B20A-C26] omits accepted V7 information from every other player`; `[2B20A-C27] leaks no V7 impairment candidate policy Demon or ledger metadata`.
- C28,C29: project `projections`, `packages/projections/src/private-knowledge-view.test.ts`, exact `ancestorPath=[]`, titles `[2B20A-C28] rejects state-only V7 for both player and AI projection authority`; `[2B20A-C29] rejects hostile state-only V7 accessors and proxies without invoking getters`.
- C30: `domain-core-rebuild`, rebuild file, `["domain event rebuild"]`, `[2B20A-C30] rebuilds accepted legacy Dreamer information for an EVIL target without reinterpretation`.
- C31: dreamer-vortox, APP, SLICE, `[2B20A-C31] preserves Philosopher Dreamer Mathematician first-night order without phase transition`.
- C32: `.github/workflows/ci.yml`, no test project/ancestor, static identity `coverage / application-service-dreamer-vortox-core testNamePattern=\\[(?:2B19A3A|2B19A3B1|2B20A)-`.
- C33: `domain-core`, dreamer test file, exact ancestor `["Dreamer information model"]`, title `does not use locale-based sorting in the Dreamer domain model` (unmarked).
- C34: `domain-core`, dreamer test file, ancestor `["Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer"]`, `[2B20A-C34] resolves only the exact canonical-drunk Fang Gu capability`.
- C35: dreamer-vortox, APP, GAS, `[2B20A-C35] accepts the reachable canonical-drunk base Dreamer through the real Philosopher chain`.
- C36: information-and-later-actions, APP, GAS, `rejects SubmitDreamerAction accessors before receipt or event work` (unmarked).
- C37,C38,C39,C40: dreamer-vortox, APP, SLICE, `[2B20A-C37] attributes the FALSE contribution to Dreamer and never to Philosopher`; `[2B20A-C38] rejects direct malformed V7 ledger source cross-links fail closed`; `[2B20A-C39] rejects coordinated persisted V7 source and impairment substitution`; `[2B20A-C40] leaves no delivery fact or contribution when the real No Dashii command fails`.

The exact real-list contract is therefore: the 21 marked APP rows C01,C03–C07,C10,C12–C14,C21–C23,C25–C27,C31,C37–C40 use SLICE; C35/C11/C15/C36 use GAS; C28/C29 use `[]`; C33 uses `Dreamer information model`; all other identities are as listed. Real Vitest inventory must resolve 36 test rows exactly once; C32 supplies the 37th primary; all 37 keys are distinct.

## Title migrations only

For exactly the 21 SLICE APP rows replace leading `[2B19A3B1-2B20A][2B20A-Cxx]` with `[2B20A-Cxx]`; for C35 replace `[2B19A3A-C17][2B20A-C35]` with `[2B20A-C35]`. Retitle only the existing rebuild test `rebuilds Dreamer information for an EVIL target with the target role in the EVIL slot` to the exact C30 title. Bodies, assertions, timeouts and counts remain byte-identical. All unsuperseded A3A/A3B1/A3B2/B19B tests, especially A3B1 C28/C29, remain unchanged. Final compound, borrowed, duplicate and cross-contract primaries are zero.

## One raw-inventory canonicalization and provenance contract

Export from `scripts/vitest-ownership-contracts.mjs` one helper used without duplication by both candidate CLI and live `verify-vitest-coverage-groups.mjs`: `canonicalizeRawVitestInventory(repoRoot,rawInventory)`. The live verifier removes its private `normalizeTestFile/splitTestName/canonicalizeInventoryEntry` path and calls this helper before ownership/routing audit.

Input is a dense canonical array. Every entry is an own-data plain object with exact key set `{name,file,projectName}`; all three values are nonempty strings with no NUL/CR/LF/tab. Reject symbols, accessors, extra/missing keys, sparse arrays and nonplain values. `repoRoot` and each `file` must be absolute in one detected path flavor: `path.win32` for drive/UNC roots, otherwise `path.posix`; mixed flavor rejects. Resolve lexically, require the file to be strictly inside the resolved repo root (not root itself, not another drive, not `..`/outside), then emit a repo-relative path with `/` separators and no empty/dot/dot-dot segment. Split `name` by the exact delimiter `" > "`; every segment must be nonempty; last segment is `title`, all preceding segments are `ancestorPath` (therefore the undelimited C28/C29 names produce `[]`). Output exact own-data `{project:projectName,file,ancestorPath,title}`. Reject duplicate full canonical identity `encode([project,file,encode(ancestorPath),title])`; the live verifier retains its additional duplicate-semantic-identity gate. Stable codes distinguish invalid array/entry/name/path/outside/duplicate.

`ordinalCompare(a,b)` remains raw UTF-16 `<`/`>` ordering. `sha256CanonicalLines(lines)` is exactly SHA-256 of UTF-8 bytes `sort(ordinalCompare).join("\n")+"\n"`. Fields cannot contain tab/newline. Define:

- `canonicalInventoryLines = canonicalInventory.map(i => [i.project,i.file,i.ancestorPath.join(" > "),i.title].join("\t"))`.
- candidate `inventorySha256=sha256CanonicalLines(canonicalInventoryLines)`; absolute roots never enter a line.
- candidate `traceabilitySha256`: read the entire exact traceability file as UTF-8, normalize CRLF and lone CR to LF, split; if a final LF created one terminal empty sentinel remove exactly that sentinel, retain every other line including duplicate/blank lines, reject NUL, then call `sha256CanonicalLines`. Thus LF/CRLF and terminal-LF presence are equivalent while content is exact and sorting/UTF-8/one terminal LF are frozen.

Self-tests prove identical canonical identities, all six baseline hashes, `inventorySha256` and `traceabilitySha256` for equivalent inventories under two absolute roots and Windows/POSIX path flavors; C28/C29 empty ancestors; exact key-set rejection; empty/bad name; relative/mixed/outside path; duplicate full identity; LF/CRLF; repeat order reversal. Candidate and live audit must import the same helper/functions; copied conversion logic is forbidden.

## Candidate-baseline CLI

Retain `--self-test` and add only:

1. `node scripts/verify-vitest-ownership-contracts.mjs --emit-candidate-baseline 2B20A --inventory ABS_JSON --output ABS_JSON`
2. `node scripts/verify-vitest-ownership-contracts.mjs --verify-candidate-baseline 2B20A --inventory ABS_JSON --candidate ABS_JSON`

Only literal `2B20A`; exact options once each; all JSON paths absolute; emit output must not exist and uses exclusive creation. Inventory is the raw exact array above. Bad/missing/duplicate/unknown args, bad JSON/shape, relative/colliding paths, traceability mismatch or noncanonical inventory: exit 1, zero stdout, one stable code on stderr. Candidate mode uses isolated frozen 2B20A metadata, final traceability, supersession registry, five unmarked whitelist records and existing marker metadata; it never invokes accepted-contract comparison, changes a file, or learns/refreshes an old baseline. It computes the same 12-key baseline via shared `semanticIdentityKey`, `tabIdentity`, `sha256CanonicalLines`, trace parser and live ownership calculation.

Emit output exact pretty JSON key order `{schemaVersion:"vitest-ownership-candidate-baseline-v1",contractId:"2B20A",inventorySha256,traceabilitySha256,frozenBaseline}`, UTF-8/LF/terminal LF, no root/timestamp/locale/random/environment value; identical bytes go to stdout and exclusive file, empty stderr, exit 0. Verify recomputes and requires candidate byte equality, printing only `CANDIDATE_BASELINE_VERIFIED 2B20A\n`; mismatch is `CANDIDATE_BASELINE_REPEAT_MISMATCH`, exit 1. Emit once, verify, copy exact 12 literals; a second nonidentical emission is a stop condition. Tests cover requested-contract isolation and proof that no existing baseline can be emitted/refreshed.

## Traceability and supporting authority

Rewrite `docs/implementation/phase-3-slice-2b20a-test-traceability.md` into the parser-compatible nine-field implementation binding table using the exact identities above, plus the exact REVIEW_PROTOCOL table header:
`SupportingAuthorityId | Producer | SourceTestOrFixture | AuthorityStatus | UsedByCriteria | MutationDisposition`.
Domains are `ACCEPTED|LEGACY|HOSTILE` and `NONE|CLONE_MUTATED|PERSISTED_OR_IMPORTED_MUTATED`; every cell nonempty; each `SUP-2B20A-###` is defined once, referenced once by its one active criterion and never primary. Separate optional link table `SupportingAuthorityId | SupersessionRecordIds` has only `SUP-2B20A-032 | SUPR-2B20AP1-001,SUPR-2B20AP1-002,SUPR-2B20AP1-004`.

Tuple aliases expanded in the file: `R=(rule-researcher,docs/rules/evidence/2B20A-resolved.md,ACCEPTED,NONE)`; `V=(test-harness,loadAcceptedBaseDreamerVortoxV3StreamFixture,ACCEPTED,NONE)`; `VC=(test-harness,same,ACCEPTED,CLONE_MUTATED)`; `VP=(test-harness,same,ACCEPTED,PERSISTED_OR_IMPORTED_MUTATED)`; `A2=(accepted-history,APP@[2B19A2-C20],LEGACY,NONE)`; `A3B1=(accepted-history,APP@[2B19A3B1-C08/C30/C36-S14/S16/S17],LEGACY,PERSISTED_OR_IMPORTED_MUTATED)`; `L=(domain-core,acceptedLegacyDreamerV1(),LEGACY,NONE)`; `B=(accepted-history,dreamer.test.ts@[2B19B-S20],LEGACY,NONE)`; `W=(repository,.github/workflows/ci.yml,ACCEPTED,NONE)`; `S=(accepted-history,SUPR-001+002+004,LEGACY,NONE)`.

Exact `ID→criterion:tuple`: `001→C01:R,002→C03:V,003→C04:V,004→C05:V,005→C06:V,006→C07:V,007→C10:V,008→C11:R,009→C12:R,010→C13:V,011→C14:V,012→C15:A2,013→C16:R,014→C17:R,015→C18:VC,016→C19:VC,017→C20:VC,018→C21:V,019→C22:VP,020→C23:VP,021→C24:A3B1,022→C25:V,023→C26:V,024→C27:V,025→C28:VC,026→C29:VC,027→C30:L,028→C31:V,029→C32:W,030→C33:B,031→C34:R,032→C35:S,033→C36:A2,034→C37:V,035→C38:VC,036→C39:VP,037→C40:V`. Prefix every numeric ID with `SUP-2B20A-` in the file. Invalid status/disposition/consumer, missing/duplicate/unused/foreign ID and support-as-primary reject deterministically.

C32 separately records `StaticWiringStatus=PASS` only after local gates and `HostedEvidenceStatus=PENDING_EXACT_HEAD_CI`; local work cannot claim hosted/full-coverage/Ubuntu/Windows PASS.

## Coverage self-test and routing

Add exact no-filesystem-mutation CLI `node scripts/verify-vitest-coverage-groups.mjs --self-test`. It performs no spawn, temp creation, workflow, coverage or hosted action. Reuse the pure live partition/classifier functions. Seven isolated cases run: exactly-once positive with A3A+A3B1+2B20A core and B19B gained; missing; unexpected; wrong-owner; pairwise intersection; gained/core cross-placement; unknown marker. Each negative must throw its expected deterministic code; otherwise self-test fails. Success: stdout `VITEST_COVERAGE_GROUPS_SELF_TEST_PASS 7/7\n`, empty stderr, exit 0. Any failure: zero stdout, one `VITEST_COVERAGE_GROUPS_SELF_TEST_FAILED <caseId> <code>\n`, exit 1. Unknown/combined CLI args remain nonzero.

In script and workflow change only core selector `\\[(?:2B19A3A|2B19A3B1)-` to `\\[(?:2B19A3A|2B19A3B1|2B20A)-`; classifier gains exact 2B20A bucket; expected core/map include it. No gained/info/Windows selector changes.

## Frozen inventories and unchanged topology

Ordinary remains 9 groups, ordered counts `207,363,465,90,52,82,26,46,241`, union 1572, missing/unexpected/intersection 0. Coverage remains 11 groups, `207,363,465,90,52,73,9,26,36,10,241`, union 1572, missing/unexpected/wrongOwner/intersection 0; Dreamer core stays 36. Windows inventory remains baseline 305, `W1=9,W2=90,W3=52,W4=73,W5=9,W6=26,W7=46`, exact union and zero missing/duplicate/unexpected/pairwise intersections. W7 remains the existing unfiltered project. Count/hash drift fails; no profile refresh, project/group, Linux RPC or W7-exit change.

## Materialization and implementation allowlists; immutable final design

Round-3 docs-only materialization may create/change only `docs/implementation/phase-3-slice-2b20ap1-design-round-3.md` and the four active controls `docs/agent-loop/{CURRENT_TASK.md,PROJECT_STATE.md,AUTOPILOT_STATE.json,AUTOPILOT_LOG.md}`. Governance, evidence, matrix, original/Round-2 designs and both prior reviews are immutable.

After the complete independent Round-3 review is archived, implementation is authorized only if its exact verdict is `RULE_DESIGN_PASS`, blockers are empty, and both `finalDesignSha256` and the complete Round-3 review SHA are recorded. The final design and all three reviews are then read-only and are deliberately absent from the implementation allowlist. Future implementation may change exactly:

- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `.github/workflows/ci.yml`
- `packages/application/src/game-application-service.test.ts` (22 prefix-only edits)
- `packages/domain-core/src/rebuild.test.ts` (C30 title only)
- `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
- the four active control files above.

Read-only/excluded: final design/reviews/governance; `scripts/verify-vitest-windows-application-groups.mjs`; `packages/domain-core/src/dreamer.test.ts`; `packages/projections/src/private-knowledge-view.test.ts`; all production/rule/matrix/profile/obligation/workspace/package/lock/dependency/timeout files; unrelated docs. Before every implementation commit, local gate and rollback gate, recompute the final-design SHA and review SHA and require exact recorded equality. Any design-byte change is an allowlist/hash failure; control-only status updates remain permitted.

## Required verifier tests

Ownership `--self-test` covers: exact 10/12-key contract shape and wrong/missing/extra/accessor/RegExp variants; four supersession records; Git predecessor/ancestor/blob/title proof; A2 bounds/counts/hashes; virtual predecessor reconciliation without old-baseline mutation; unified cycles/duplicate/multiple/overlap; preserved C28 alias; exact raw canonical helper cases; exact 37 identities with 21 SLICE, four GAS, empty C28/C29 and C33 ancestor; five whitelist records once; C30 marked/nonborrowed; 37 distinct keys; zero compound/borrowed/cross-contract; 37 SUP bijection/domains; C32 split; deterministic candidate emit/verify and old-contract isolation. Each negative is one mutation and asserts its stable code.

Coverage `--self-test` is the frozen 7/7 matrix above. Existing Windows CLI negative contracts remain: invalid mode, missing arg and relative target are nonzero; the Windows verifier file is unchanged. Live tests prove 37 rows resolve once, wrong/missing/extra ancestor rejects, C28/C29 empty ancestors and C33 exact ancestor are directly covered.

## Authorized local gates

Use Node `24.15.0` and Corepack pnpm `11.7.0`. No full local coverage or hosted execution is authorized.

1. `node scripts/verify-vitest-ownership-contracts.mjs --self-test`.
2. Candidate capture: make one OS-temp seed; derive nonexisting absolute sibling inventory/candidate paths; `pnpm exec vitest list --workspace vitest.workspace.ts --json=<ABS_INVENTORY_JSON>`; run exact emit then verify commands; copy verified 12 literals; in `finally` remove only those exact temp files after proving their resolved parent is the OS temp directory.
3. `node scripts/verify-vitest-coverage-groups.mjs --self-test` (must report 7/7).
4. `node scripts/verify-vitest-coverage-groups.mjs` (live 9/11 partitions plus all ownership audits).
5. Inventory-only Windows command: `$tmp=New-TemporaryFile; try { node scripts/verify-vitest-windows-application-groups.mjs inventory --output $tmp.FullName; if($LASTEXITCODE -ne 0){throw}; $j=Get-Content -Raw -LiteralPath $tmp.FullName|ConvertFrom-Json; if($j.verdict -ne 'PASS'){throw} } finally { Remove-Item -Force -LiteralPath $tmp.FullName }`. Never use `run`/`verify` here.
6. `pnpm exec vitest run --workspace vitest.workspace.ts packages/application/src/game-application-service.test.ts`.
7. `pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/rebuild.test.ts`.
8. `pnpm exec eslint scripts/vitest-ownership-contracts.mjs scripts/verify-vitest-ownership-contracts.mjs scripts/verify-vitest-coverage-groups.mjs packages/application/src/game-application-service.test.ts packages/domain-core/src/rebuild.test.ts --max-warnings 0`.
9. `pnpm typecheck`; `pnpm lint`; `pnpm test`.
10. `git diff --check`; exact allowlist; final design/review/governance/prior-chain hashes; no production/profile/topology/process/dependency/timeout diff; no test/assertion deletion or `.skip/.only`; list total 1572; exact 37/37 primaries, 37/37 SUP, zero compound/borrowed/collision; C32 static PASS/hosted pending.

`pnpm test:coverage`, GitHub Actions, hosted Windows, Linux worker RPC and W7 exit investigation are explicitly not implementation-local gates and remain unrun/pending. A future publication/merge, if separately authorized, still obeys AGENTS/REVIEW_PROTOCOL exact-feature-HEAD full CI and independent final-review audit chain; this local slice does not push, create/modify a PR, or claim that authority.

## Acceptance and documentation

Acceptance requires all self-tests/live audits/local gates above; exact predecessor/source proof; immutable old baselines; 37 unique current primaries; exact raw-to-canonical cross-root determinism; byte-repeat candidate verification; exact 9/11/W topology; production/rule/profile/workspace/dependency/timeout diffs zero. Traceability records governance/design/review hashes, four dispositions, exact 37 mappings, expanded six-field SUP table/link, candidate provenance hashes, partitions and C32 split. Controls record only observed commands/hashes/status and never synthesize reviewer verdicts. No role matrix change.

## Rollback

One bounded infrastructure revert restores the three scripts, workflow selector, 22 APP prefixes, C30 title, traceability and four control files; removes the 2B20A contract, supersession registry and candidate/coverage-self-test CLIs. The final Round-3 design and reviews are never reverted or edited and their exact SHA gates still run. Then rerun authorized narrow self-test/inventory/focused/typecheck/lint/ordinary gates. Never rollback through test deletion, production/profile edits, baseline refresh or Linux/W7 work. Rollback returns the known accepted-history ownership-drift blocker and must not be called green.

## Final correction stop-loss

Design correction budget is exhausted by this document: `designRound=3/3`, `designCorrectionRound=2/2`, `maxCorrection=2`. The next action is one fresh independent Round-3 rule-design review only. A missing/truncated/unknown verdict, any nonempty blocker, `RULE_DESIGN_FIX_REQUIRED`, or `HUMAN_BLOCKED` is non-PASS and immediately yields 2B20AP1 stop-loss/HUMAN_BLOCKED; there is no Round 4 and no controller-authored PASS. Also stop immediately for unavailable/wrong governance or accepted source, substantive rule conflict, predecessor/locator/hash mismatch, inability to keep 1572/305 or exact partitions, any need for product/rule/profile/topology/process/timeout/dependency/full-local-coverage/hosted/Linux/W7 change, old-baseline refresh, dirty unrelated overlap, permission failure, or test deletion/weakening. Infrastructure Repair remains separately `0/2` and can begin only after design PASS and implementation authorization; it cannot reopen design correction.

No later slice is designed or authorized. `implementationAuthorized=false`.

READY_FOR_FINAL_RULE_DESIGN_REVIEW_ROUND_3
