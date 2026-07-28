# Phase 3 Slice 2B20AP1 — Design Round 2 replacement

## Metadata

- `sliceId`: `2B20AP1`
- `designRound`: `2 / 2`; `maxDesignRounds`: `2`
- `targetPath`: `docs/implementation/phase-3-slice-2b20ap1-design-round-2.md`
- `parentDesignPath`: `docs/implementation/phase-3-slice-2b20ap1-design.md`
- `parentDesignSha256`: `622d5e8572e933a38c5503fa80ee342c8acee084b62ed1578ede0569a3e22c46`
- `round1ReviewPath`: `docs/implementation/phase-3-slice-2b20ap1-design-review-round-1.md`
- `round1ReviewSha256`: `eedea1f3c721c1878683700b275cd164ee62c090eeb1298b88a39588db548943`
- `round1Verdict`: `RULE_DESIGN_FIX_REQUIRED`
- `governanceCommit`: `aa063f9784ae94a54d83151b931828df4948c56c`
- `governancePath`: `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md`
- `governanceSha256`: `583f1778582c168935b380b19e453117b000d8caf18dd3a4cd7731365cdb3537`
- `acceptedMain`: `5a69c90f2d3947556ff45c15c467902b1e28ca43`
- `acceptedApplicationBlob`: `0ff733004899f17ff82b20b40b0f41b888ba85d0`
- `taskType`: `CI_TEST_INFRASTRUCTURE_PREREQUISITE / NON_PRODUCT`
- `behaviorDesignChanged=false`; `ruleSemanticsChanged=false`; `coverageProfileChanged=false`; `topologyChanged=false`; `processGroupChanged=false`; `timeoutChanged=false`; `dependencyChanged=false`; `implementationAuthorized=false`.

This is the complete self-contained replacement for Round 1, not an erratum. It closes D01–D09 and preserves the governance GO boundary. It changes no product behavior, BOTC rule, event/runtime shape, replay/projection semantics, test assertion, coverage profile, dependency, timeout, Vitest project/process group, Linux worker-RPC behavior, Windows W7 exit behavior, or hosted-CI authority.

## Scope and non-goals

The future implementation may only add append-only accepted-history supersession validation, register canonical 2B20A ownership, repair 2B20A traceability/supporting authority, remove compound ownership markers, retitle one existing unmarked legacy replay test for C30 without changing its body, and update the existing Dreamer-core selector. No test is added/deleted/weakened/skipped/`.only`; total remains 1572. No role evidence or role-coverage status changes.

## D09/D01 — exact supersession runtime schema and graph

Add to `scripts/vitest-ownership-contracts.mjs` frozen enums: scopes `WHOLE_TEST|SUBCASE|MARKER_ALIAS`; dispositions `WHOLE_TEST_SEMANTIC_SUPERSESSION|SUBCASE_SUPERSESSION|RETIRED_NONPRIMARY_ALIAS`; known contracts `2B19A2,2B19A3A,2B19A3B1,2B19A3B2,2B19B,2B20A`.

Each record has exactly `{ supersessionId, predecessor, scope, subcaseKey, disposition, successor, rationale }`. `predecessor` has exactly `{ acceptedHead, acceptedBlobOid, contractId, criterionId, ownerProject, file, ancestorPath, title, historicalLocator }`; `successor` exactly `{ contractId, criterionId, ownerProject, file, ancestorPath, title }`. Records/arrays are dense own-data plain canonical objects: no getters, symbols, sparse slots, extra/missing keys, or non-string array entries. Git IDs are lowercase 40-hex; repo paths canonical; strings nonempty. `subcaseKey` is null for whole, `C28` for alias, and `A2_C20_DRUNK_NO_CURRENT_VORTOX` for A2.

One unified head-independent graph node key is used for both ends: `encode([contractId,criterionId,file,encode(ancestorPath),title])`, with `encode(fields)=fields.map(v=>v.length+":"+v).join("|")`. Accepted HEAD/blob are evidence attributes, never node identity; a successor at generation N therefore matches the identical later accepted predecessor. Each record adds one edge. DFS rejects self-, two-node, and multi-generation cycles. Active-successor key is predecessor node + scope + (`*` for whole, exact subcase/alias otherwise). Identical repeated edge=`ACCEPTED_AUTHORITY_DUPLICATE_SUCCESSOR`; different target for one active key=`ACCEPTED_AUTHORITY_MULTIPLE_SUCCESSORS`; whole plus SUBCASE on one predecessor node=`ACCEPTED_AUTHORITY_WHOLE_SUBCASE_OVERLAP`. Alias is non-primary and does not supersede the preserved successor.

`historicalLocator` is exactly one of: `{kind:"EXACT_TEST_TITLE",titleOccurrence:1}` for whole/alias, with exact title and ancestor verified by the deterministic brace/string-literal scanner; or `{kind:"LF_BOUNDED_SOURCE_SHA256",wholeStart,wholeEndExclusive,wholeChars,wholeSha256,subcaseStart,subcaseEndExclusive,subcaseChars,subcaseSha256}` for A2/C20. Read `git show <head>:<file>`, normalize CRLF/CR to LF, locate every sentinel ordinally exactly once, and SHA-256 the UTF-8 start-inclusive/end-exclusive substring without adding LF.

A2/C20 proof is frozen:

- `wholeStart`: `  it("[2B19A2-C20] keeps every retryable unsupported or dependency path receipt-free and mutation-free", async () => {`
- `wholeEndExclusive`: `  it("[2B19A2-C21] retries the same command after a transient metadata dependency recovers", async () => {`
- `wholeChars=5835`; `wholeSha256=e06c3a7f9d4cb2ac2a2eed24f2082ff6cf5819b0af7388c11e47e478b0e34531`
- `subcaseStart`: `    const drunk = makeService();`
- `subcaseEndExclusive`: `    const dependencyStore = new OneShotDomainEventLoadFailureStore();`
- `subcaseChars=1746`; `subcaseSha256=b5ccb8e06ca99b5e21bca2ce60806fcd6f2f9d7f509dece50d217dd3f7e6ae85`.

Missing/renamed/duplicate sentinels, wrong bounds/count/body/hash use `ACCEPTED_AUTHORITY_PREDECESSOR_SUBCASE_MISSING` or `ACCEPTED_AUTHORITY_PREDECESSOR_SUBCASE_HASH_MISMATCH`.

Exact dispositions:

1. `SUPR-2B20AP1-001`: A3A/C17 whole at accepted head/blob above, owner `application-service-dreamer-vortox`, application test file, ancestor `["GameApplicationService"]`, title `[2B19A3A-C17] fails a represented DRUNK base Dreamer receipt-free through the real Philosopher chain`; successor 2B20A/C35 same owner/file/ancestor, title `[2B20A-C35] accepts the reachable canonical-drunk base Dreamer through the real Philosopher chain`.
2. `SUPR-2B20AP1-002`: A3B1/C18 whole, same head/blob/file/owner, ancestor `["Phase 3 Slice 2B19A3B1 canonical-drunk Vortox Dreamer"]`, title `[2B19A3B1-C18/C28] keeps canonical DRUNK without effective Vortox receipt-free, OPEN, and retryable`; successor C35 above.
3. `SUPR-2B20AP1-003`: A3B1/C28 alias on that historical title, `subcaseKey:C28`, resolving to preserved A3B1/C28 same owner/file/ancestor, title `[2B19A3B1-C28/C29] proves every V4 failure stage is atomic retryable and converges exactly once`; preserved primary stays byte-identical.
4. `SUPR-2B20AP1-004`: A2/C20 subcase, owner `application-service-information-and-later-actions`, application file, ancestor `["GameApplicationService"]`, locator above; successor C35. Only canonical Philosopher-caused DRUNK/no-current-Vortox is superseded; `no-dashii`, `dependency`, `prospective` remain support.

Also reject malformed registry, unknown contract, missing/non-ancestor head, missing blob/file, wrong blob OID, wrong ancestor/title, missing successor, alias-as-primary, missing preserved C28, and all graph/locator failures. Diagnostics sort raw UTF-16 and exit nonzero.

## D01/D02 — exact ownership contract

Append one exact `RAW_OWNERSHIP_CONTRACTS` object with the current runtime key set (no aliases/RegExp values):

- `applicationTestFile:"packages/application/src/game-application-service.test.ts"`
- `contractId:"2B20A"`
- `criterionIds:["C01","C03","C04","C05","C06","C07","C10","C11","C12","C13","C14","C15","C16","C17","C18","C19","C20","C21","C22","C23","C24","C25","C26","C27","C28","C29","C30","C31","C32","C33","C34","C35","C36","C37","C38","C39","C40"]`
- `markerPattern:"^\\[2B20A-[^\\]]+\\]"`; `markerPrefix:"[2B20A-"`
- `ownerProject:"application-service-dreamer-vortox"`; `status:"ACTIVE"`
- `supportingAuthorityPrefix:"SUP-2B20A-"`
- `traceabilityFile:"docs/implementation/phase-3-slice-2b20a-test-traceability.md"`
- `frozenBaseline` has exactly current `BASELINE_KEYS`: `authorityInventorySha256,currentProjectInventorySha256,dynamicTestAuthorityRows,nonMarkerOwnershipSha256,nonOwnedInventoryPolicy,physicalTestFileSetSha256,projectExecutionsAfter,projectExecutionsBefore,projectInventorySha256,semanticInventorySha256,supportingAuthorityCount,traceabilityRowCount`. Counts are `projectExecutionsBefore:22`, `projectExecutionsAfter:22`, `traceabilityRowCount:37`, `dynamicTestAuthorityRows:36`, `supportingAuthorityCount:37`; `nonOwnedInventoryPolicy` remains `GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS`. All six SHA fields are lowercase 64-hex literals produced only by the frozen candidate CLI in [3/4]. Existing A3A/A3B1/A3B2/B19B objects/literals remain byte-identical.

`EXPLICIT_UNMARKED_2B20A_PRIMARIES` is a closed exact five-record whitelist `{criterionId,file,ancestorPath,title}` for C11,C15,C24,C33,C36 below. `parseTraceability` accepts an unmarked test only when all four fields exactly equal one whitelist record and that record is consumed once; it remains outside application ownership execution count. Unknown/missing/duplicate whitelist records reject. C30 is not whitelisted: it receives a canonical marker.

## D03/D04 — exact 37 unique physical primaries

Every row below is exact `file :: ancestor > title`; `app` means `packages/application/src/game-application-service.test.ts :: GameApplicationService`.

- C01 app > `[2B20A-C01] proves the exact reachable source impairment and Fang Gu precondition snapshot`
- C03 app > `[2B20A-C03] reaches a naturally selected TRUE V7 stream through the real command boundary`
- C04 app > `[2B20A-C04] reaches a naturally selected FALSE V7 stream through the real command boundary`
- C05 app > `[2B20A-C05] settles the base Dreamer task and closes its V3 opportunity atomically`
- C06 app > `[2B20A-C06] derives TRUE as a normal base-Dreamer fact with zero contribution`
- C07 app > `[2B20A-C07] derives FALSE as one abnormal base-Dreamer drunkenness contribution`
- C10 app > `[2B20A-C10] records the exact nine existing evidence variants for V7`
- C11 app > `rejects invalid Dreamer submissions with deterministic receipts` (exact unmarked whitelist)
- C12 app > `[2B20A-C12] rejects an unrepresented Traveller target id at the real command boundary`
- C13 app > `[2B20A-C13] rejects a forged V3 opportunity id without appending a batch`
- C14 app > `[2B20A-C14] preserves success receipt replay and fingerprint conflict semantics`
- C15 app > `keeps SubmitDreamerAction metadata generation failures classified independently` (whitelist)
- C16 `packages/domain-core/src/dreamer.test.ts :: Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer` > `[2B20A-C16] constructs the complete raw-UTF16 ordered GOOD by EVIL candidate product`
- C17 same > `[2B20A-C17] selects the first candidate in the parity-selected truth class`
- C18 same > `[2B20A-C18] validates the exact 22-key V7 payload and selected top-level roles`
- C19 same > `[2B20A-C19] deep-clones and compares every V7 nested canonical decision`
- C20 same > `[2B20A-C20] rejects getter Proxy symbol cycle sparse and nonplain V7 inputs with zero getter calls`
- C21 app > `[2B20A-C21] rebuilds the complete accepted V7 stream identically`
- C22 app > `[2B20A-C22] rejects reordered or missing V7 batch members during replay`
- C23 app > `[2B20A-C23] rejects persisted V7 candidate and policy mutations during replay`
- C24 `packages/domain-core/src/rebuild.test.ts :: domain event rebuild` > `rejects malformed Dreamer replay batches` (whitelist)
- C25 app > `[2B20A-C25] projects the accepted V7 pair only to its source player`
- C26 app > `[2B20A-C26] omits accepted V7 information from every other player`
- C27 app > `[2B20A-C27] leaks no V7 impairment candidate policy Demon or ledger metadata`
- C28 `packages/projections/src/private-knowledge-view.test.ts :: Phase 3 Slice 2B19A3A accepted-stream Dreamer projection` > `[2B20A-C28] rejects state-only V7 for both player and AI projection authority`
- C29 same > `[2B20A-C29] rejects hostile state-only V7 accessors and proxies without invoking getters`
- C30 `packages/domain-core/src/rebuild.test.ts :: domain event rebuild` > `[2B20A-C30] rebuilds accepted legacy Dreamer information for an EVIL target without reinterpretation`
- C31 app > `[2B20A-C31] preserves Philosopher Dreamer Mathematician first-night order without phase transition`
- C32 `.github/workflows/ci.yml` > `coverage / application-service-dreamer-vortox-core testNamePattern=\\[(?:2B19A3A|2B19A3B1|2B20A)-`
- C33 `packages/domain-core/src/dreamer.test.ts :: Dreamer domain model` > `does not use locale-based sorting in the Dreamer domain model` (whitelist)
- C34 `packages/domain-core/src/dreamer.test.ts :: Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer` > `[2B20A-C34] resolves only the exact canonical-drunk Fang Gu capability`
- C35 app > `[2B20A-C35] accepts the reachable canonical-drunk base Dreamer through the real Philosopher chain`
- C36 app > `rejects SubmitDreamerAction accessors before receipt or event work` (whitelist)
- C37 app > `[2B20A-C37] attributes the FALSE contribution to Dreamer and never to Philosopher`
- C38 app > `[2B20A-C38] rejects direct malformed V7 ledger source cross-links fail closed`
- C39 app > `[2B20A-C39] rejects coordinated persisted V7 source and impairment substitution`
- C40 app > `[2B20A-C40] leaves no delivery fact or contribution when the real No Dashii command fails`

C30 is a title-only migration of the existing unmarked test `rebuilds Dreamer information for an EVIL target with the target role in the EVIL slot`; its body, assertions, timeout and count remain byte-identical. `[2B19A2-C30]` and ACTIVE `[2B19A3B2-LEGACY]` are support only and can never bind C30 primary. Final: 37 rows/37 distinct physical keys, C15≠C36, zero borrowed/cross-contract primary, zero compound primary.

## Canonical marker migrations

In the application test, replace only the leading ownership text for exactly C01,C03,C04,C05,C06,C07,C10,C12,C13,C14,C21,C22,C23,C25,C26,C27,C31,C37,C38,C39,C40: `[2B19A3B1-2B20A][2B20A-Cxx]` → `[2B20A-Cxx]`; C35 `[2B19A3A-C17][2B20A-C35]` → `[2B20A-C35]`. Add only the C30 title prefix/title above in rebuild test. No other title/body/assertion edit. A3B1 C28/C29 and all unsuperseded A3A/A3B1/A3B2/B19B authorities stay unchanged.

## D05 — REVIEW_PROTOCOL-conformant supporting authority

The implementation traceability file is exactly `docs/implementation/phase-3-slice-2b20a-test-traceability.md`. Its registry table header is exactly:
`SupportingAuthorityId | Producer | SourceTestOrFixture | AuthorityStatus | UsedByCriteria | MutationDisposition`.

`AuthorityStatus` domain is exactly `ACCEPTED|LEGACY|HOSTILE`; `MutationDisposition` exactly `NONE|CLONE_MUTATED|PERSISTED_OR_IMPORTED_MUTATED`. All cells are nonempty; `UsedByCriteria` is one active criterion; every `SUP-2B20A-###` is defined once, referenced once by its criterion’s nine-field implementation row, and never primary. The optional supersession relationship is a separate table, not a replacement protocol field: `SupportingAuthorityId | SupersessionRecordIds`, with only `SUP-2B20A-032 | SUPR-2B20AP1-001,SUPR-2B20AP1-002,SUPR-2B20AP1-004`; every other support implicitly has no supersession link.

For compactness define exact tuple aliases that must be expanded into the six columns in the materialized traceability: `R=(rule-researcher,docs/rules/evidence/2B20A-resolved.md,ACCEPTED,NONE)`; `V=(test-harness,loadAcceptedBaseDreamerVortoxV3StreamFixture,ACCEPTED,NONE)`; `VC=(test-harness,loadAcceptedBaseDreamerVortoxV3StreamFixture,ACCEPTED,CLONE_MUTATED)`; `VP=(test-harness,loadAcceptedBaseDreamerVortoxV3StreamFixture,ACCEPTED,PERSISTED_OR_IMPORTED_MUTATED)`; `A2=(accepted-history,packages/application/src/game-application-service.test.ts@[2B19A2-C20],LEGACY,NONE)`; `A3B1=(accepted-history,packages/application/src/game-application-service.test.ts@[2B19A3B1-C08/C30/C36-S14/S16/S17],LEGACY,PERSISTED_OR_IMPORTED_MUTATED)`; `L=(domain-core,acceptedLegacyDreamerV1(),LEGACY,NONE)`; `B=(accepted-history,packages/domain-core/src/dreamer.test.ts@[2B19B-S20],LEGACY,NONE)`; `W=(repository,.github/workflows/ci.yml,ACCEPTED,NONE)`; `S=(accepted-history,SUPR-2B20AP1-001+SUPR-2B20AP1-002+SUPR-2B20AP1-004,LEGACY,NONE)`.

Exact registry mapping `(ID→criterion:tuple)` is:
`001→C01:R,002→C03:V,003→C04:V,004→C05:V,005→C06:V,006→C07:V,007→C10:V,008→C11:R,009→C12:R,010→C13:V,011→C14:V,012→C15:A2,013→C16:R,014→C17:R,015→C18:VC,016→C19:VC,017→C20:VC,018→C21:V,019→C22:VP,020→C23:VP,021→C24:A3B1,022→C25:V,023→C26:V,024→C27:V,025→C28:VC,026→C29:VC,027→C30:L,028→C31:V,029→C32:W,030→C33:B,031→C34:R,032→C35:S,033→C36:A2,034→C37:V,035→C38:VC,036→C39:VP,037→C40:V`, where every numeric token expands to `SUP-2B20A-###`. Invalid/missing/duplicate/unused/foreign ID, invalid status/disposition, wrong consumer, or support-as-primary rejects deterministically. This closes D05 without inventing alternate protocol domains.

## D07 — complete candidate-baseline CLI contract

Extend only `scripts/verify-vitest-ownership-contracts.mjs` with two exact modes while retaining `--self-test`:

1. `node scripts/verify-vitest-ownership-contracts.mjs --emit-candidate-baseline 2B20A --inventory ABS_JSON --output ABS_JSON`
2. `node scripts/verify-vitest-ownership-contracts.mjs --verify-candidate-baseline 2B20A --inventory ABS_JSON --candidate ABS_JSON`

All three paths must be absolute; emit output must not exist and is created with exclusive write. Inventory is Vitest-list JSON array of exact `{projectName,file,name}` entries. Only literal contract `2B20A` is allowed; otherwise `CANDIDATE_BASELINE_CONTRACT_NOT_ALLOWED`. Unknown/missing/duplicate options, relative paths, bad JSON/shape, output collision, traceability mismatch, or noncanonical inventory exit 1 with one stable code on stderr and zero stdout.

Candidate mode uses frozen 2B20A metadata from [2/4], current final traceability, full inventory, existing registered marker metadata plus 2B20A, and the exact five-entry unmarked whitelist. It does not call `auditOwnershipContracts` and does not compare/refresh any accepted contract baseline. It computes only requested 2B20A’s 12-key `frozenBaseline` using the same `semanticIdentityKey`, `tabIdentity`, `sha256CanonicalLines`, non-owned policy, physical-file set and traceability parser as live audit. `projectInventorySha256=currentProjectInventorySha256` for this new nondeduplicated contract. Output is UTF-8/LF, terminal LF, pretty JSON with exact keys `{schemaVersion:"vitest-ownership-candidate-baseline-v1",contractId:"2B20A",inventorySha256,traceabilitySha256,frozenBaseline}`; no absolute path, timestamp, locale, random value or environment field. Emit prints the identical JSON to stdout and file, exit 0, empty stderr. Verify recomputes, requires byte equality with candidate, prints `CANDIDATE_BASELINE_VERIFIED 2B20A\n`, exit 0; mismatch is `CANDIDATE_BASELINE_REPEAT_MISMATCH`, exit 1. Run emit then verify once; copy the exact 12 literals into the contract; a different second emission is a stop condition. Self-tests cover repeated/LF-CRLF determinism, only-requested-contract output, old-baseline isolation, and mismatch.

## D06/C32 — static versus hosted

C32 implementation row uses `.github/workflows/ci.yml`, `MechanismMatch=PASS` for static wiring only. Separate metadata fields are `StaticWiringStatus: PASS` only after authorized local gates and `HostedEvidenceStatus: PENDING_EXACT_HEAD_CI`. Local work never changes hosted status or claims GitHub/Windows-hosted/full-coverage success. No local `pnpm test:coverage`; no GitHub Actions run is required/authorized by this design.

## Routing and exact inventories

In both `.github/workflows/ci.yml` and `scripts/verify-vitest-coverage-groups.mjs`, change only Dreamer core selector `\\[(?:2B19A3A|2B19A3B1)-` → `\\[(?:2B19A3A|2B19A3B1|2B20A)-`. In `classifyDreamerVortoxMarker`, add exact 2B20A match; add `2B20A` bucket; expected core is A3A+A3B1+2B20A; summary marker map includes 2B20A. No gained/info/W selector changes.

Ordinary nine counts remain `207,363,465,90,52,82,26,46,241` (union 1572; missing/unexpected/intersection 0). Coverage eleven remain `207,363,465,90,52,73,9,26,36,10,241` (union 1572; missing/unexpected/wrongOwner/intersection 0); Dreamer core remains 36. Windows inventory remains baseline 305, `W1=9,W2=90,W3=52,W4=73,W5=9,W6=26,W7=46`, exact union and zero missing/duplicate/unexpected/pairwise intersections. W7 stays unfiltered; no W7 exit investigation.

## D08 — exact allowlists

Round-2 materialization is docs/control-only and may change/create only:
`docs/implementation/phase-3-slice-2b20ap1-design-round-2.md`, `docs/agent-loop/CURRENT_TASK.md`, `docs/agent-loop/PROJECT_STATE.md`, `docs/agent-loop/AUTOPILOT_STATE.json`, `docs/agent-loop/AUTOPILOT_LOG.md`. The original design/review/governance files remain immutable.

After independent `RULE_DESIGN_PASS`, the future implementation allowlist is exactly:

- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `.github/workflows/ci.yml`
- `packages/application/src/game-application-service.test.ts` (22 prefix-only edits)
- `packages/domain-core/src/rebuild.test.ts` (C30 title only)
- `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
- the Round-2 design and the four actual control files above.

`packages/projections/src/private-knowledge-view.test.ts`, `packages/domain-core/src/dreamer.test.ts`, `scripts/verify-vitest-windows-application-groups.mjs`, all production files, rule evidence, `ROLE_COVERAGE_MATRIX.md`, coverage profiles/obligations, `vitest.workspace.ts`, package manifests/lockfile, dependencies, timeouts, accepted contracts/reviews and unrelated docs are read-only. No nonexistent project-handoff/control path may be created.

## Self-test and acceptance matrix

Ownership self-test positives: exact current contract shape; four dispositions; accepted head/blob/title/ancestor proof; A2 bounded hashes; C28 preserved alias; unified cross-generation graph; 37 distinct primaries; five whitelist records once each; C30 canonical/nonborrowed; 37 SUP definitions/references and exact domains; C32 static/hosted split; candidate emit/verify repeat determinism.

One-mutation negatives assert exact codes for: missing/extra/wrong-type contract/baseline/supersession keys; RegExp markerPattern; missing status/frozenBaseline; unknown contract; missing/non-ancestor head; missing file/blob; wrong blob OID/title/ancestor; A2 missing/renamed/duplicate sentinel, wrong whole/subcase count/hash, subcase outside whole; missing successor/preserved C28; alias primary; self/two-node/multi-generation cycle; duplicate/multiple successor; whole/subcase overlap; compound/non-leading/multiple marker; borrowed/cross-contract primary including ACTIVE A3B2; duplicate C15/C36; whitelist missing/extra/duplicate/unknown; C28/C29 wrong path/title/ancestor; SUP missing/duplicate/unused/foreign, invalid `AuthorityStatus`/`MutationDisposition`, support-as-primary; candidate invalid args/relative path/output collision/old-contract refresh/repeat mismatch; C32 false hosted pass. Coverage self-tests add 2B20A exactly to core and reject missing/unexpected/wrong-owner/intersection. Existing Windows CLI invalid mode, missing arg and relative target remain nonzero; the verifier file itself is unchanged.

## Authorized local gates (no full coverage or hosted gate)

Use Node 24.15.0/Corepack pnpm 11.7.0. Run:

1. `node scripts/verify-vitest-ownership-contracts.mjs --self-test`.
2. Candidate capture exactly once plus byte verification: create one `New-TemporaryFile` seed; derive nonexisting absolute sibling paths `<seed>.inventory.json` and `<seed>.candidate.json`; `pnpm exec vitest list --workspace vitest.workspace.ts --json=<ABS_INVENTORY_JSON>`; run both candidate CLI commands from [3/4]; in `finally`, remove only the three exact temp files with `Remove-Item -LiteralPath` after verifying their resolved parents equal the OS temp directory.
3. `node scripts/verify-vitest-coverage-groups.mjs` after copying the verified literals; require exact 9/11 partitions and all ownership audits.
4. Real Windows inventory only: `$tmp=New-TemporaryFile; try { node scripts/verify-vitest-windows-application-groups.mjs inventory --output $tmp.FullName; if($LASTEXITCODE -ne 0){throw}; $j=Get-Content -LiteralPath $tmp.FullName -Raw | ConvertFrom-Json; if($j.verdict -ne 'PASS'){throw} } finally { Remove-Item -LiteralPath $tmp.FullName -Force }`. This is inventory only; never `run`/`verify`.
5. `pnpm exec vitest run --workspace vitest.workspace.ts packages/application/src/game-application-service.test.ts`.
6. `pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/rebuild.test.ts`.
7. `pnpm exec eslint scripts/vitest-ownership-contracts.mjs scripts/verify-vitest-ownership-contracts.mjs scripts/verify-vitest-coverage-groups.mjs packages/application/src/game-application-service.test.ts packages/domain-core/src/rebuild.test.ts --max-warnings 0`.
8. `pnpm typecheck`; `pnpm lint`; `pnpm test`.

Also require `git diff --check`, allowlist-only diff, zero production/profile/topology/dependency/timeout change, no test/assertion deletion, no `.skip/.only`, total 1572, governance/parent/review hashes unchanged, old contract literals unchanged, 37/37 unique primary, zero compound/borrowed/collision, 37/37 SUP bijection, static C32 PASS and hosted `PENDING_EXACT_HEAD_CI`. `pnpm test:coverage`, GitHub Actions, hosted Windows and Linux worker RPC are explicitly not local acceptance gates and remain unrun/pending.

## Documentation and CI boundary

Traceability must use the real path, a nine-field primary table compatible with `parseTraceability`, the six-field SUP table, optional separate supersession links, four dispositions, exact mappings, exact partition evidence, and C32 fields. Control files record only observed hashes/commands/status; they cannot synthesize a review verdict. `.github/workflows/ci.yml` receives only the selector token change; this design neither runs nor requires hosted CI. Future PR merge gates remain governed by AGENTS/REVIEW_PROTOCOL, but they are not implementation-local authorization.

## Rollback

One bounded infrastructure revert restores the three scripts, workflow selector, 22 application prefixes, C30 title, traceability and four control docs; removes the new contract/supersession registry and candidate CLI; then reruns authorized narrow inventory/self-test/typecheck/lint/ordinary gates. Never rollback via test deletion, old-baseline refresh, production/profile edits, or Linux/W7 work. Rollback returns to the known pre-slice ownership-drift blocker and must not be called green.

## Infrastructure Repair and stop-loss

Infrastructure Repair maximum is 2. Each attempt is allowlist-only and reruns the narrow failing gate first, then requires fresh independent review. Stop `HUMAN_BLOCKED` immediately on unavailable/incorrect governance or accepted source; substantive rule conflict; any predecessor/locator/hash mismatch; inability to keep 1572/305 and 9/11/W counts; need for product/assertion/profile/topology/process/timeout/dependency change; need for full local coverage/hosted CI/Linux RPC/W7-exit investigation; old accepted baseline refresh; dirty unrelated overlap/permission failure; same deterministic failure after attempt 2; or Round-2 independent review not returning `RULE_DESIGN_PASS`.

## D01–D09 closure ledger

- D01: exact current 10 contract keys and 12 baseline keys, strings/status/nested object frozen.
- D02: real traceability path; real Windows verifier and `inventory --output ABS_JSON` only.
- D03: exact `private-knowledge-view.test.ts` C28/C29 identities and ancestor.
- D04: C30 is a new canonical title on an existing unmarked rebuild test; A2/A3B2 are support only.
- D05: exact REVIEW_PROTOCOL six fields/domains; supersession link is separate optional data.
- D06: no local full coverage or hosted/GitHub success gate.
- D07: complete emit/verify CLI, JSON schema, algorithm, stderr/exit, old-baseline isolation and repeat stop code.
- D08: only real control paths, including `AUTOPILOT_STATE.json` and `PROJECT_STATE.md`.
- D09: one head-independent graph node identity plus auditable A2 whole/subcase sentinels, lengths and SHA-256.

No later slice is designed or authorized.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_2
