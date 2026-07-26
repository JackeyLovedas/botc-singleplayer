# Phase 3 Slice 2B20AP1 — accepted-history supersession and 2B20A ownership repair

## Frozen authority and classification

- `sliceId`: `2B20AP1`
- `taskType`: `CI_TEST_INFRASTRUCTURE_PREREQUISITE / NON_PRODUCT`
- `governanceCommit`: `aa063f9784ae94a54d83151b931828df4948c56c`
- `governancePath`: `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md`
- `governanceSha256`: `583f1778582c168935b380b19e453117b000d8caf18dd3a4cd7731365cdb3537`
- `acceptedMain`: `5a69c90f2d3947556ff45c15c467902b1e28ca43`
- `acceptedApplicationBlob`: `0ff733004899f17ff82b20b40b0f41b888ba85d0`
- `branch`: `infra/2b20ap1-ownership-supersession-routing-v1`
- product/rule assertion changes: forbidden.

The writer must materialize this exact body at `docs/implementation/phase-3-slice-2b20ap1-design.md`, then record its byte length, LF-normalized line count, and SHA-256 of the exact UTF-8 file bytes in the task-control/status files. Those values are derived metadata, not author choices.

## Scope and non-goals

This slice only: (1) adds accepted-history supersession validation; (2) gives the 37 active 2B20A criteria non-borrowed, unique primary identities; (3) removes compound 2B20A ownership markers; (4) adds a parser-compatible supporting-authority registry; (5) routes canonical 2B20A application tests into the existing Dreamer coverage shard; (6) adds verifier self-tests and updates traceability/control docs. No production file, business assertion, event/runtime shape, replay rule, projection behavior, coverage profile, dependency, timeout, test count, Vitest project, process group, Linux RPC behavior, or Windows W7 exit behavior may change. No test may be deleted, skipped, weakened, converted to `.only`, or have assertions removed.

## Accepted-history supersession schema

Implement only in `scripts/vitest-ownership-contracts.mjs`; export these exact constants:

`ACCEPTED_HISTORY_CONTRACT_IDS = ["2B19A2","2B19A3A","2B19A3B1","2B19B","2B20A"]`

`SUPERSESSION_SCOPE = ["WHOLE_TEST","SUBCASE","MARKER_ALIAS"]`

`SUPERSESSION_DISPOSITION = ["WHOLE_TEST_SEMANTIC_SUPERSESSION","SUBCASE_SUPERSESSION","RETIRED_NONPRIMARY_ALIAS"]`

Every registry record has exactly:
`{ supersessionId, predecessor, scope, subcaseKey, disposition, successor, rationale }`.

`predecessor` has exactly:
`{ acceptedHead, acceptedBlobOid, contractId, criterionId, ownerProject, file, ancestorPath, title }`.

`successor` has exactly:
`{ contractId, criterionId, ownerProject, file, ancestorPath, title }`.

Types: all scalar fields are non-empty strings; `ancestorPath` is a non-empty array of non-empty strings; `acceptedHead` and `acceptedBlobOid` are lowercase 40-hex Git object IDs. `subcaseKey` is `null` for `WHOLE_TEST`, the exact canonical key for `SUBCASE`, and the retired criterion token for `MARKER_ALIAS`. Identity comparison uses UTF-16 code-unit ordering and exact, normalization-free string equality. Predecessor key is `contractId\tcriterionId\tacceptedHead\tfile\tancestorPath.join(" > ")\ttitle`; successor key omits `acceptedHead`. Git verification is `git cat-file -e <head>^{commit}`, `git merge-base --is-ancestor <head> HEAD`, `git rev-parse <head>:<file>` equals `acceptedBlobOid`, and exact historical title occurrence equals one.

Registry is exactly:

1. `SUPR-2B20AP1-001`: predecessor A3A/C17, `WHOLE_TEST`, null, `WHOLE_TEST_SEMANTIC_SUPERSESSION`; head/blob above; project `dreamer-vortox`; file `packages/application/src/game-application-service.test.ts`; ancestor `["GameApplicationService"]`; title `[2B19A3A-C17] fails a represented DRUNK base Dreamer receipt-free through the real Philosopher chain`; successor 2B20A/C35, same project/file/ancestor, title `[2B20A-C35] accepts the reachable canonical-drunk base Dreamer through the real Philosopher chain`.
2. `SUPR-2B20AP1-002`: predecessor A3B1/C18, `WHOLE_TEST`, null, `WHOLE_TEST_SEMANTIC_SUPERSESSION`; same head/blob/file; project `dreamer-vortox`; ancestor `["Phase 3 Slice 2B19A3B1 canonical-drunk Vortox Dreamer"]`; title `[2B19A3B1-C18/C28] keeps canonical DRUNK without effective Vortox receipt-free, OPEN, and retryable`; successor is the same 2B20A/C35 identity above.
3. `SUPR-2B20AP1-003`: predecessor A3B1/C28 with the same historical physical identity as item 2, `MARKER_ALIAS`, subcaseKey `C28`, `RETIRED_NONPRIMARY_ALIAS`; successor A3B1/C28, project/file/ancestor unchanged, title `[2B19A3B1-C28/C29] proves every V4 failure stage is atomic retryable and converges exactly once`. This record does not supersede that preserved primary.
4. `SUPR-2B20AP1-004`: predecessor A2/C20, project `information-and-later-actions`, same head/blob/file, ancestor `["GameApplicationService"]`, title `[2B19A2-C20] keeps every retryable unsupported or dependency path receipt-free and mutation-free`; `SUBCASE`, subcaseKey `A2_C20_DRUNK_NO_CURRENT_VORTOX`, `SUBCASE_SUPERSESSION`; successor is 2B20A/C35 above. The key means only the removed Philosopher-caused `DRUNK`/no-current-Vortox case. The preserved `no-dashii`, `dependency`, and `prospective` cases are not superseded.

Reject exactly: malformed keys/types `INVALID_ACCEPTED_AUTHORITY_SUPERSESSION_REGISTRY`; unknown contract `ACCEPTED_AUTHORITY_UNKNOWN_CONTRACT`; missing head `ACCEPTED_AUTHORITY_PREDECESSOR_HEAD_MISSING`; non-ancestor head `ACCEPTED_AUTHORITY_PREDECESSOR_HEAD_NOT_ANCESTOR`; missing blob/file `ACCEPTED_AUTHORITY_PREDECESSOR_BLOB_MISSING`; wrong blob OID `ACCEPTED_AUTHORITY_PREDECESSOR_BLOB_HASH_MISMATCH`; absent/non-unique historical identity `ACCEPTED_AUTHORITY_PREDECESSOR_IDENTITY_MISSING`; absent subcase key `ACCEPTED_AUTHORITY_PREDECESSOR_SUBCASE_MISSING`; duplicate predecessor+scope+subcase with different successor `ACCEPTED_AUTHORITY_MULTIPLE_SUCCESSORS`; whole plus subcase for the same contract/criterion/test `ACCEPTED_AUTHORITY_WHOLE_SUBCASE_OVERLAP`; DFS cycle `ACCEPTED_AUTHORITY_SUPERSESSION_CYCLE`; missing current successor `ACCEPTED_AUTHORITY_SUCCESSOR_MISSING`; missing preserved A3B1 C28 primary `ACCEPTED_AUTHORITY_PRESERVED_PRIMARY_MISSING`; alias used as a primary `ACCEPTED_AUTHORITY_ALIAS_IS_PRIMARY`. Any rejection exits nonzero and prints only deterministic code plus sorted identity keys.

## 2B20A ownership contract and exact primary mapping

Append one contract with the existing contract shape: `contractId:"2B20A"`, `ownerProject:"dreamer-vortox"`, `applicationTestFile:"packages/application/src/game-application-service.test.ts"`, `markerPrefix:"[2B20A-"`, `markerPattern:/^\[2B20A-[^\]]+\]/u`, `criterionIds:["C01","C03","C04","C05","C06","C07","C10","C11","C12","C13","C14","C15","C16","C17","C18","C19","C20","C21","C22","C23","C24","C25","C26","C27","C28","C29","C30","C31","C32","C33","C34","C35","C36","C37","C38","C39","C40"]`, `traceabilityPath:"docs/implementation/phase-3-slice-2b20a-traceability.md"`, `supportingAuthorityPattern:/^SUP-2B20A-\d{3}$/u`. Frozen counts are `projectExecutionsBefore:22`, `projectExecutionsAfter:22`, `traceabilityRowCount:37`, `dynamicTestAuthorityRows:36`, `supportingAuthorityCount:37`; its three SHA-256 inventory fields are deterministic literals emitted by `node scripts/verify-vitest-ownership-contracts.mjs --emit-candidate-baseline 2B20A` after all title/doc changes. The writer copies that output verbatim once; any second different output is a stop condition. Existing A3A/A3B1/B19B contract objects and hashes remain byte-for-byte unchanged.

The six legitimate unmarked primaries below are a closed exact whitelist `EXPLICIT_UNMARKED_2B20A_PRIMARIES`; each has `{criterionId,file,ancestorPath,title}` and may appear in exactly one 2B20A trace row. They are not ownership markers and must not be counted in the 22 application ownership executions. No other unmarked primary is legal.

The 37 primary rows are exactly:

|Criterion|File|Ancestor/title (exact final identity)|
|---|---|---|
|C01|`packages/application/src/game-application-service.test.ts`|`GameApplicationService > [2B20A-C01] proves the exact reachable source impairment and Fang Gu precondition snapshot`|
|C03|same|`GameApplicationService > [2B20A-C03] reaches a naturally selected TRUE V7 stream through the real command boundary`|
|C04|same|`GameApplicationService > [2B20A-C04] reaches a naturally selected FALSE V7 stream through the real command boundary`|
|C05|same|`GameApplicationService > [2B20A-C05] settles the base Dreamer task and closes its V3 opportunity atomically`|
|C06|same|`GameApplicationService > [2B20A-C06] derives TRUE as a normal base-Dreamer fact with zero contribution`|
|C07|same|`GameApplicationService > [2B20A-C07] derives FALSE as one abnormal base-Dreamer drunkenness contribution`|
|C10|same|`GameApplicationService > [2B20A-C10] records the exact nine existing evidence variants for V7`|
|C11|same|`GameApplicationService > rejects invalid Dreamer submissions with deterministic receipts` (whitelisted unmarked)|
|C12|same|`GameApplicationService > [2B20A-C12] rejects an unrepresented Traveller target id at the real command boundary`|
|C13|same|`GameApplicationService > [2B20A-C13] rejects a forged V3 opportunity id without appending a batch`|
|C14|same|`GameApplicationService > [2B20A-C14] preserves success receipt replay and fingerprint conflict semantics`|
|C15|same|`GameApplicationService > keeps SubmitDreamerAction metadata generation failures classified independently` (whitelisted unmarked)|
|C16|`packages/domain-core/src/dreamer.test.ts`|`Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer > [2B20A-C16] constructs the complete raw-UTF16 ordered GOOD by EVIL candidate product`|
|C17|same|`Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer > [2B20A-C17] selects the first candidate in the parity-selected truth class`|
|C18|same|`Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer > [2B20A-C18] validates the exact 22-key V7 payload and selected top-level roles`|
|C19|same|`Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer > [2B20A-C19] deep-clones and compares every V7 nested canonical decision`|
|C20|same|`Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer > [2B20A-C20] rejects getter Proxy symbol cycle sparse and nonplain V7 inputs with zero getter calls`|
|C21|application file|`GameApplicationService > [2B20A-C21] rebuilds the complete accepted V7 stream identically`|
|C22|same|`GameApplicationService > [2B20A-C22] rejects reordered or missing V7 batch members during replay`|
|C23|same|`GameApplicationService > [2B20A-C23] rejects persisted V7 candidate and policy mutations during replay`|
|C24|`packages/domain-core/src/rebuild.test.ts`|`rebuildGameState > rejects malformed Dreamer replay batches` (whitelisted unmarked)|
|C25|application file|`GameApplicationService > [2B20A-C25] projects the accepted V7 pair only to its source player`|
|C26|same|`GameApplicationService > [2B20A-C26] omits accepted V7 information from every other player`|
|C27|same|`GameApplicationService > [2B20A-C27] leaks no V7 impairment candidate policy Demon or ledger metadata`|
|C28|`packages/projections/src/player-views.test.ts`|`[2B20A-C28] projects only the accepted V7 state-derived Dreamer pair`|
|C29|same|`[2B20A-C29] keeps hostile V7 audit metadata out of every private player view`|
|C30|application file|`Phase 3 Slice 2B19A3B2 Mathematician > [2B19A3B2-LEGACY] preserves accepted legacy and prior Dreamer authorities without migration` (whitelisted unmarked; marker is not a registered ownership prefix)|
|C31|application file|`GameApplicationService > [2B20A-C31] preserves Philosopher Dreamer Mathematician first-night order without phase transition`|
|C32|`.github/workflows/ci.yml`|static identity `coverage / dreamer-core selector contains (?:2B19A3A|2B19A3B1|2B20A)-`|
|C33|`packages/domain-core/src/dreamer.test.ts`|`Dreamer domain model > does not use locale-based sorting in the Dreamer domain model` (whitelisted unmarked)|
|C34|same|`Phase 3 Slice 2B20A canonical-drunk Fang Gu Dreamer > [2B20A-C34] resolves only the exact canonical-drunk Fang Gu capability`|
|C35|application file|`GameApplicationService > [2B20A-C35] accepts the reachable canonical-drunk base Dreamer through the real Philosopher chain`|
|C36|application file|`GameApplicationService > rejects SubmitDreamerAction accessors before receipt or event work` (whitelisted unmarked)|
|C37|same|`GameApplicationService > [2B20A-C37] attributes the FALSE contribution to Dreamer and never to Philosopher`|
|C38|same|`GameApplicationService > [2B20A-C38] rejects direct malformed V7 ledger source cross-links fail closed`|
|C39|same|`GameApplicationService > [2B20A-C39] rejects coordinated persisted V7 source and impairment substitution`|
|C40|same|`GameApplicationService > [2B20A-C40] leaves no delivery fact or contribution when the real No Dashii command fails`|

`C15` and `C36` are distinct physical identities. No row may name `[2B19A2-C06]`, `[2B19A2-C20]`, `[2B19A3B1-C08/C30/C36-S14/S16/S17]`, `[2B19A2-C30]`, or `[2B19B-S20]` as primary. The preserved A3B1 C28/C29 test remains unchanged and is support only.

Exact marker edits: for C01,C03,C04,C05,C06,C07,C10,C12,C13,C14,C21,C22,C23,C25,C26,C27,C31,C37,C38,C39,C40 replace leading `[2B19A3B1-2B20A][2B20A-Cxx]` with `[2B20A-Cxx]`; for C35 replace `[2B19A3A-C17][2B20A-C35]` with `[2B20A-C35]`. No other test title changes. Final compound-marker count is zero.

## Supporting-authority registry

In `docs/implementation/phase-3-slice-2b20a-traceability.md`, add one table whose header is exactly:

`SupportingAuthorityId | ProducerKind | ProducerIdentity | AuthorityRole | UsedByCriteria | MutationDisposition`

Allowed `ProducerKind`: `RULE_EVIDENCE`, `ACCEPTED_PREDECESSOR`, `PRESERVED_ACCEPTED_TEST`, `STATIC_REPOSITORY_WIRING`. `AuthorityRole` is always `SUPPORTING_ONLY`; it can never satisfy a primary row. `UsedByCriteria` is exactly one active criterion. Allowed `MutationDisposition`: `NONE`, `SUPERSEDED_PREDECESSOR_ONLY`, `PRESERVED_UNCHANGED`. IDs match `^SUP-2B20A-\d{3}$`, are defined once and referenced once. The criterion rows’ `SupportingAuthorityIds` cells reference the following exact registry:

- `SUP-2B20A-001`→C01, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C01`, `NONE`
- `SUP-2B20A-002`→C03, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C03`, `NONE`
- `SUP-2B20A-003`→C04, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C04`, `NONE`
- `SUP-2B20A-004`→C05, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C05`, `NONE`
- `SUP-2B20A-005`→C06, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C06`, `NONE`
- `SUP-2B20A-006`→C07, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C07`, `NONE`
- `SUP-2B20A-007`→C10, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C10`, `NONE`
- `SUP-2B20A-008`→C11, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C11`, `NONE`
- `SUP-2B20A-009`→C12, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C12`, `NONE`
- `SUP-2B20A-010`→C13, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C13`, `NONE`
- `SUP-2B20A-011`→C14, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C14`, `NONE`
- `SUP-2B20A-012`→C15, `PRESERVED_ACCEPTED_TEST`, `2B19A2/C20 subcases dependency+prospective`, `PRESERVED_UNCHANGED`
- `SUP-2B20A-013`→C16, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C16`, `NONE`
- `SUP-2B20A-014`→C17, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C17`, `NONE`
- `SUP-2B20A-015`→C18, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C18`, `NONE`
- `SUP-2B20A-016`→C19, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C19`, `NONE`
- `SUP-2B20A-017`→C20, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C20`, `NONE`
- `SUP-2B20A-018`→C21, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C21`, `NONE`
- `SUP-2B20A-019`→C22, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C22`, `NONE`
- `SUP-2B20A-020`→C23, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C23`, `NONE`
- `SUP-2B20A-021`→C24, `PRESERVED_ACCEPTED_TEST`, `2B19A3B1/C08/C30/C36-S14/S16/S17 replay evidence-and-ledger cases`, `PRESERVED_UNCHANGED`
- `SUP-2B20A-022`→C25, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C25`, `NONE`
- `SUP-2B20A-023`→C26, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C26`, `NONE`
- `SUP-2B20A-024`→C27, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C27`, `NONE`
- `SUP-2B20A-025`→C28, `PRESERVED_ACCEPTED_TEST`, `2B19A3B1/C28 primary [2B19A3B1-C28/C29]`, `PRESERVED_UNCHANGED`
- `SUP-2B20A-026`→C29, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C29`, `NONE`
- `SUP-2B20A-027`→C30, `PRESERVED_ACCEPTED_TEST`, `accepted V1-V6 Dreamer replay fixtures and authorities`, `PRESERVED_UNCHANGED`
- `SUP-2B20A-028`→C31, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C31`, `NONE`
- `SUP-2B20A-029`→C32, `STATIC_REPOSITORY_WIRING`, `.github/workflows/ci.yml dreamer-core selector`, `NONE`
- `SUP-2B20A-030`→C33, `PRESERVED_ACCEPTED_TEST`, `2B19B/S20 nondeterminism guard`, `PRESERVED_UNCHANGED`
- `SUP-2B20A-031`→C34, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C34`, `NONE`
- `SUP-2B20A-032`→C35, `ACCEPTED_PREDECESSOR`, `SUPR-2B20AP1-001+002+004`, `SUPERSEDED_PREDECESSOR_ONLY`
- `SUP-2B20A-033`→C36, `PRESERVED_ACCEPTED_TEST`, `2B19A2/C20 subcases no-dashii+dependency+prospective`, `PRESERVED_UNCHANGED`
- `SUP-2B20A-034`→C37, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C37`, `NONE`
- `SUP-2B20A-035`→C38, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C38`, `NONE`
- `SUP-2B20A-036`→C39, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C39`, `NONE`
- `SUP-2B20A-037`→C40, `RULE_EVIDENCE`, `docs/rules/evidence/2b20a.md#C40`, `NONE`

For compact rows above, `002` means `SUP-2B20A-002` and `...#Cxx` means the exact path `docs/rules/evidence/2b20a.md#Cxx`; materialization must expand both abbreviations. Foreign, missing, duplicate, or unused IDs fail with existing deterministic supporting-authority errors. The A3A/A3B1/A2 predecessors and B19B S20 remain support/provenance, never 2B20A primaries.

## C32 status split

C32 has two independent fields outside the 37-row table:

- `StaticWiringStatus: PASS` only after local selector text, contract registration, verifier self-test, ordinary partition, coverage partition, and Windows inventory all pass.
- `HostedEvidenceStatus: PENDING_EXACT_HEAD_CI` until required GitHub CI for the exact frozen feature HEAD is green. Local success must never rewrite it to `PASS`, `ACCEPTED`, or an equivalent. Only post-push exact-head evidence may replace it, with HEAD SHA and run URL/id.

## Routing contracts

`.github/workflows/ci.yml` **must change exactly once**: replace the dreamer-core test-name selector `\[(?:2B19A3A|2B19A3B1)-` with `\[(?:2B19A3A|2B19A3B1|2B20A)-`. Make the identical one-token alternation change in `scripts/verify-vitest-coverage-groups.mjs`. No other workflow step, selector, command, timeout, matrix, project, or coverage profile changes.

Ordinary inventory remains 9 groups and exactly 1572 executions, ordered counts `207,363,465,90,52,82,26,46,241`; union equals the 1572-workspace inventory; missing, unexpected, and every pairwise intersection are empty. Coverage inventory remains 11 groups and exactly 1572 executions, ordered counts `207,363,465,90,52,73,9,26,36,10,241`; union equals workspace; missing, unexpected, wrongOwner, and every pairwise intersection are empty. The Dreamer-core group remains 36: marker migration changes ownership text, not its selected execution set. Any count drift fails; do not refresh a profile.

Windows verifier remains 305 executions: W1=9, W2=90, W3=52, W4=73, W5=9, W6=26, W7=46; exact union, zero missing/unexpected, zero pairwise intersections. W7 is the existing unfiltered project and receives no selector or exit-behavior change. Linux RPC behavior and Windows W7 unknown-exit behavior are out of scope.

## Immutability, verification, and delivery

All unsuperseded A3A, A3B1, and B19B titles, assertions, frozen inventories, counts, hashes, trace rows, and ownership-contract literals are immutable. The A3B1 C28/C29 primary remains byte-identical. The A2 C20 test may only lose the already-removed `drunk` subcase as documented by `SUPR-2B20AP1-004`; its `no-dashii`, `dependency`, and `prospective` bodies/assertions remain unchanged. Old accepted hashes are evidence and must never be refreshed to current drift. Shape validation is not accepted-history provenance.

### Verifier positive/negative matrix

Extend `node scripts/verify-vitest-ownership-contracts.mjs --self-test` without filesystem mutation. Positive fixtures must prove: all four registry records validate; whole A3A and A3B1 predecessors resolve to C35; A3B1 C28 alias resolves to its preserved primary; A2 C20 exact subcase alone resolves; the six exact unmarked primaries bind once; 37 rows produce 37 distinct primary keys; 37 SUP definitions/references are bijective; C32 is static and remains `PENDING_EXACT_HEAD_CI`; LF/CRLF input yields identical canonical hashes.

Negative fixtures, one isolated mutation each, must assert the exact rejection code: malformed/extra/missing schema; unknown predecessor or successor contract; missing head; non-ancestor head; missing blob/file; wrong blob hash; missing or duplicate historical title; missing/wrong subcase key; duplicate/multiple successor; cycle of length 2 and self-cycle; whole/subcase overlap; alias promoted to primary; missing preserved A3B1 C28; missing current successor; compound marker; marker not leading; two registered markers; borrowed primary; duplicate C15/C36 physical key; old accepted hash refresh; foreign/missing/duplicate/unused SUP id; C32 hosted status falsely passed; ownership inventory missing/unexpected/project drift; six-whitelist missing/extra/duplicate; unknown unmarked primary. Sort all diagnostic identities by raw UTF-16 code units.

Coverage self-tests must include a canonical 2B20A marker routed once to dreamer-core plus negative missing, unexpected, wrong-owner and intersection fixtures. Windows self-tests retain W1-W7 positives and missing/unexpected/intersection negatives; add no W selector. No self-test may shell out to Linux RPC or alter W7 exit handling.

### File allowlist

Only these files may differ from the branch base:

- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `.github/workflows/ci.yml`
- `packages/application/src/game-application-service.test.ts` (the exact 22 marker-prefix edits only; no body/assertion change)
- `docs/implementation/phase-3-slice-2b20a-traceability.md`
- `docs/implementation/phase-3-slice-2b20ap1-design.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/IMPLEMENTATION_STATUS.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `project-handoff/01-PROJECT-CONTROL.md`
- `project-handoff/03-IMPLEMENTATION-STATUS.md`

No role evidence, role-coverage matrix, production source, package manifest, lockfile, coverage profile, accepted review archive, or unrelated docs may change. If an exact projection filename in the existing C28/C29 trace rows differs from the spelling shown in this design, the existing path is authoritative and this is a rule-design-review fix condition; the implementer must not guess or silently substitute.

### Acceptance checks and local gates

Run in this order with Node 24.15.0/pnpm 11.7.0:

1. `node scripts/verify-vitest-ownership-contracts.mjs --self-test`
2. `node scripts/verify-vitest-ownership-contracts.mjs`
3. `node scripts/verify-vitest-coverage-groups.mjs --self-test`
4. `node scripts/verify-vitest-coverage-groups.mjs`
5. `node scripts/verify-vitest-windows-inventory.mjs --self-test`
6. `node scripts/verify-vitest-windows-inventory.mjs`
7. `pnpm exec vitest run --workspace vitest.workspace.ts packages/application/src/game-application-service.test.ts`
8. `pnpm exec eslint scripts/vitest-ownership-contracts.mjs scripts/verify-vitest-ownership-contracts.mjs scripts/verify-vitest-coverage-groups.mjs packages/application/src/game-application-service.test.ts --max-warnings 0`
9. `pnpm typecheck`
10. `pnpm lint`
11. `pnpm test`
12. `pnpm test:coverage`

Before review, also require: `git diff --check`; allowlist-only diff; zero `skip|only` additions; zero deleted tests/assertions; Vitest list total exactly 1572; ordinary/coverage/Windows contracts exactly as frozen; governance file hash unchanged; accepted A3A/A3B1/B19B hashes unchanged; exact 37/37 unique primaries; zero compound/borrowed/cross-contract primaries; exact 37/37 SUP bijection; C32 static PASS and hosted PENDING. CI must run the same ownership, routing, Windows, typecheck, lint, test, and coverage gates on the exact feature HEAD. This design does not authorize push, PR, or implementation until independent rule-design review returns exactly `RULE_DESIGN_PASS`.

### Documentation

Traceability must record the governance tuple, four supersession records, 37 primary rows, expanded 37-entry SUP registry, marker migration list, immutable predecessor dispositions, exact partition counts, and C32 split status. Task-control/status/log files may report only observed commands and hashes; they may not synthesize review verdicts. `ROLE_COVERAGE_MATRIX.md` is unchanged because this infrastructure prerequisite implements no role criterion.

### Rollback

Rollback is one revert of the 2B20AP1 infrastructure commit before any later product slice. It restores the prior workflow selector, verifier logic, 22 compound/shared titles, traceability/control docs, and removes the new 2B20A contract/supersession registry. Then rerun the six verifier commands and full gates. Never rollback by deleting tests, refreshing old baselines, or editing production code. Because the pre-slice live ownership verifier already exposes accepted-history drift, rollback restores that known blocked state; it must not be reported green.

### Infrastructure Repair and stop conditions

`Infrastructure Repair` is limited to at most two repair attempts, each confined to the allowlist and followed by the failing narrow verifier first. Stop immediately with `HUMAN_BLOCKED` on: governance/hash/source unavailability; any substantive rule conflict; predecessor blob/title/subcase mismatch; projection-path mismatch noted above; inability to keep 1572/305 exact inventories; any required production/assertion/test deletion or weakening; any need to refresh an old accepted hash/profile; any new dependency/project/process group/timeout; any Linux RPC or W7-exit change; permission failure; dirty unrelated overlap; or the same deterministic failure after the second attempt. Do not design or begin 2B20A product work in this slice.

READY_FOR_RULE_DESIGN_REVIEW
