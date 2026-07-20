# Phase 3 Slice 2B19A3B2 Independent Rule Design Review — Round 1

reviewedDesign: `docs/implementation/phase-3-slice-2b19a3b2-design.md`
reviewedDesignSha256: `23c1912280c51a5a7fea08b0e35011fb24318160b8a79047ca9e85eddcb1306e`
reviewedGovernance: `docs/architecture/2B19A3B2-go-no-go-under-governance-v1.md`
reviewedGovernanceSha256: `000964cc050c86d427fe198dc01d782f6eda8fa15c58fb561140de9bc27d88d7`
reviewedRuleEvidence: `docs/rules/evidence/2B19A3B2.md`
reviewedRuleEvidenceSha256: `64607c71c5d9b947b78063cdc8e914f684b975748cb2c183fe2e4119b4036eb0`
reviewTimestamp: `2026-07-20T15:24:16.2101811+08:00`
reviewedRepositoryHead: `c0c0cdfef1c1aa4cebb841f9867007a319701459`
reviewedBranch: `phase-3/combined-dreamer-mathematician-integration`
reviewScope: independent pre-implementation BOTC rule/design/governance review; repository remained read-only; no production/test implementation was authorized or inspected as a 2B19A3B2 change.

## Sources independently read and verified

I did not rely on the rule-researcher or architect summaries. I independently re-read `AGENTS.md`, the ordered `project-handoff` files, `AUTOPILOT_PROMPT.md`, `REVIEW_PROTOCOL.md`, accepted Governance Traceability V1.1 ADR, `USER_OVERRIDES.md`, `ROLE_COVERAGE_MATRIX.md`, the full evidence/governance/design files, the latest user authorization attachment, accepted parent designs/traces/reviews, relevant production code/tests, and every mandatory live rule source.

Live source retrieval status: all mandatory sources available; HTTP 200; no snapshot used. Independently downloaded UTF-8 bodies matched the evidence hashes exactly:

Chinese Wiki:
- 首页 oldid `5855`, SHA-256 `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49`.
- 数学家 oldid `6214`, SHA-256 `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`.
- 筑梦师 oldid `3046`, SHA-256 `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`.
- 哲学家 oldid `5125`, SHA-256 `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be`.
- 涡流 oldid `6198`, SHA-256 `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`.
- 醉酒 oldid `5720`, SHA-256 `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e`.
- 中毒 oldid `6294`, SHA-256 `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0`.

Official BOTC Wiki:
- Mathematician oldid `3109`, SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`.
- Dreamer oldid `2904`, SHA-256 `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`.
- Philosopher oldid `2421`, SHA-256 `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`.
- Vortox oldid `3017`, SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`.
- States oldid `1039`, SHA-256 `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`.
- Abilities oldid `1376`, SHA-256 `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40`.

Official nightsheet:
- repository HEAD `915347e627c3f6cd1f438f82b6001784e11b3e8b`;
- last file-changing commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`;
- body SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.
- Independently parsed first night: Philosopher index 13, Dreamer 60, Seamstress 61, Mathematician 76, Dawn 77, Vortox absent; 80 entries.
- Independently parsed other night: Philosopher 10, Vortox 46, Dreamer 78, Seamstress 82, Mathematician 95, Dawn 97; 99 entries.

User-approved authority:
- `docs/rules/USER_OVERRIDES.md`, SHA-256 `9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5`; all six cited policies are APPROVED and unsuperseded.
- current authorization attachment, SHA-256 `9ce698f21a73cf826456d73c10f8ec5205ad8c44f3e20526049cd1be115a788e`.

Source-conflict result: no substantive conflict. The authoritative ability sentence and Chinese detailed marker procedure establish player-count semantics; different official/Chinese Vortox example numbers are both legal false values, not a contradiction. `unresolvedConflicts=[]` and `RULE_READY` are supported.

## Production, test, architecture and accepted authorities independently read

Production authorities:
- `packages/domain-core/src/mathematician.ts` (`5f9fe798e2bc460ca74cc3ec1701b4462437a3df59c4bf15e68c7ec91ea6a62d`): exact 31-key delivery, `0..11`, window, source/effectiveness/Vortox unions, ordering/uniqueness validation.
- `packages/domain-core/src/mathematician-internal.ts` (`fe8eaa07dbd18aca6437dc764083c22116488fa66e8db008bf61a642dc081311`): accepted-prefix capture, canonical source/tenure/instance, multi-fact classification, `Map<PlayerId,...>` aggregation, seat/player and code-unit ordering, dynamic count, Vortox candidate selection, prospective/replay/stored projection proof.
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts` (`116531503a7e22755f0817a2f7a5222aa3016f9c72b685b5ef1f7dfc5f9a2da2`): V4/V6/Mathematician terminal fact derivation and exact evidence/provenance.
- `packages/domain-core/src/first-night-action-opportunity.ts` (`05aa5bbf3247fdfb1c8c20f52661ec640a7186eb5651573d38a1235da8d`), `dreamer.ts` (`0780b833d0b9de56f7febb1abc98be933b23ce4d822e1929226656132c5b7db0`), `domain-batch-semantics.ts` (`8dc311906bd341d2eca077d7af11755e1f68ccaa17e93b8a28660f21d6d0fb45`), `event-applier.ts` (`34daa2fbb6be52afa305cc1ce61f66b405e01cf7794f803a5dcdb34b648d863d`).
- `packages/application/src/game-application-service.ts` (`589993a7bf8de6673920a21344336831886c77c75ee26f0bde728650ce53ad90`): real `SettleMathematicianInformation`, exact two-event batch, prospective validation and fault staging.
- `packages/projections/src/index.ts` (`9bc79744d67bec2cb8dfbcaef123d0aeb1755456d5b3388fc5427321bb9a2d24`): accepted-stream-only settled Mathematician projection and source-only count.

Test/CI authorities:
- `packages/application/src/mathematician-information.test.ts` (`69960633bbd8aa62deb9954c6ff9d1350a6df313294ea8614a925fead1e34f91`).
- `packages/application/src/game-application-service.test.ts` (`4cda3f8f736d51e744c4a9215f092a53cb0232d505bd12682f4f27062568369e`).
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` (`f72f737bce68b24311fb2231b17b3ec87688e1a506e2acb99a8c6653445b30a0`), `dreamer.test.ts` (`c37c80cc3304f9d6255683f0a40dfa208567da8b297d11d0f5eef3344b6cdc6f`), `first-night-action-opportunity.test.ts` (`a4b1de2947cd96d67e9abc4880175e82f3afe8317e2f227ed2e76923ca64ebfd`).
- ownership/workspace/workflow/profile authorities: `scripts/vitest-ownership-contracts.mjs` (`c952cce06f700bbd595c893991e4906474eef6831452e01d485d2def1f6cc72b`), `vitest.workspace.ts` (`880fd6b085b4d5c49f928f4a08a780706488adf53560d376ebb3ea966a80a90d`), `.github/workflows/ci.yml` (`85338407463dea735d2758db3cdffc6726b14769f3df2dca03526147bd0e508a`), `scripts/verify-coverage-obligations.mjs` (`47b4e2936408fb94760ecc069ef29a477a005e4669c2ea38dba9bee36f6c84be`).

Accepted parent authorities:
- 2B18B Round 3 design `066be05f5ee8c0fccb83b00fd8471e439e7e6d2c8c8366af8c86aebceac0a792`.
- 2B19A3B1 Round 2 design `f4c92477dc43fab23588220947a2599932ba3dff02191eb3fa0be6adac2147b0`.
- 2B19B Round 2 design `28ee07ab14cb6007c2c3091cbe73a9cf282bd8fa9ca7a9a57b90e9c85cf6087d` and traceability `b258d49f71d87957b8b1c6308fb2a16d8372440c748cd895059813e896bce17c`.
- PR #41 archived code/rule reviews `9859ed3adef5606a0007aa34cb4447dc93a8fafa7c2bb8c59a30ce9a46bd7303` / `ec4e26e51a53d6f7e732a619b319a28b3efa623c896b24c736fbae5a331eb72e`, both recording pass verdicts and empty blockers.

Bounded read-only execution evidence:
- Node `24.15.0`; `corepack pnpm 11.7.0` confirmed.
- existing `packages/application/src/mathematician-information.test.ts`: `424/424` passed.
- exact 2B19B real V5/V6-to-Seamstress-to-Mathematician-boundary authority: `1/1` passed under project `application-service-dreamer-vortox`.
These checks support design implementability only; they are not 2B19A3B2 implementation or exact-head release CI.

## Independent BOTC rule checks

1. Mathematician counts distinct players whose abilities worked abnormally due to another character; it does not count fact quantity, returned roles, causes or evidence records. PASS.
2. Multiple qualifying facts for one source player produce one abnormal-player row while all unique supporting fact IDs remain available. PASS.
3. Native Dreamer P1 and Philosopher P2 remain different players; Philosopher gains an ability without becoming Dreamer. PASS.
4. Effective Philosopher choosing in-play Dreamer canonically DRUNKs P1; P2 is not impaired by that marker. PASS.
5. Under the accepted attribution policy, native V4 is one ABNORMAL/VORTOX_FALSE_INFORMATION terminal fact with exact DRUNK evidence, not two terminal facts. PASS.
6. Effective gained Dreamer V6 is an independent ABNORMAL/VORTOX_FALSE_INFORMATION fact sourced to P2. PASS.
7. Both occur after the exclusive FirstNightInitialized anchor and before the inclusive pre-Mathematician upper anchor. PASS.
8. Mathematician’s current source/instance is excluded; its Vortox false delivery cannot feed its own current true count. PASS.
9. Dynamic count is `distinctAbnormalPlayers.length`; the frozen no-third-player stream yields `trueCount=2`, never a general constant. PASS.
10. Effective Vortox constrains Mathematician `selectedCount`, not underlying facts/trueCount. Existing `0..11` smallest-false policy produces `selectedCount=0`, public reliability literal `VORTOX_CONSTRAINED_FALSE`. PASS.
11. No-current-Vortox effective control yields selected=true and `RULE_CORRECT`. PASS.
12. Dreamer false-role Storyteller discretion is not completed; source-impaired/POISONED/No Dashii/lifecycle/other-night/FIRST_NIGHT completion/DAY remain unsupported. PASS.
13. Coverage remains `PARTIAL / COMBINED_NATIVE_AND_GAINED_DREAMER_FIRST_NIGHT_COUNT_ONLY`; Dreamer/Mathematician/Philosopher remain PARTIAL; Vortox standalone remains NOT_STARTED. PASS.

## Frozen design and governance checks

1. Accepted dependencies: 2B19A3B1 and 2B19B are accepted in current main; the archived PR #41 review and current code prove the frozen V4/V6 authority. PASS.
2. Real bridge: design requires only `GameApplicationService.execute` and the real command store from CreateGame through Philosopher grant, both Dreamer settlements, real Seamstress DEFER and formal Math settlement. It forbids handwritten state/ledger, direct append, skipped tasks and fake progress. PASS.
3. Reachability: R1 successful/rejected/fault/projection paths, R2 exact legacy histories, R3 hostile history, and R4 future unsupported behaviors are all explicit and mutually classified. PASS.
4. Trust: T1 command/persistence/projection boundaries retain exact runtime hostile-data gates; T2 rebuilt state/ledger/tenure/window keeps canonical cross-links; T3 pure grouping/sorting/candidate logic stays private and deterministic. PASS.
5. Accepted bridge implementability: current helper is parameterized by exact role IDs, so the new authority can use a legal roster containing Dreamer, Philosopher, Vortox and base Mathematician while omitting Clockmaker; the real continuation reaches Seamstress then base Math. This permits the frozen no-third-abnormal-player scenario without production change. PASS.
6. Native/gained identities: design freezes native BASE_ROLE_TASK and gained PHILOSOPHER_GAINED_TASK_V2 instance grammars, distinct sourcePlayerIds, distinct abilityInstanceIds and distinct fact IDs derived from source event IDs. PASS.
7. Window: exact existing `first-night-ability-outcome-window-v1`, FirstNightInitialized sequence exclusive, final accepted pre-delivery sequence inclusive, delivery exactly end+1, current Math fact outside. PASS.
8. Classification: own-instance, resolving-source, NORMAL, PENDING, qualifying ABNORMAL, redundant/blocking unresolved precedence is explicit; no fact is silently dropped. PASS.
9. Aggregation: exact player grouping, supporting-ID preservation/dedup/order, seat then player ordering, union ordering, and `trueCount=length` are frozen. It does not dedupe by role/cause/instance/fact count. PASS.
10. True/selected separation: dynamic true count and the exact Vortox/no-Vortox matrices are frozen with accepted literal/version contracts; public payload is unchanged. PASS.
11. Formal settlement: success is exactly persisted delivery then ScheduledTaskSettled, same metadata/version, contiguous sequences, one atomic commit; the one Math ledger fact is derived by the applier and is not a third persisted event. PASS.
12. Replay/prospective validation: design requires accepted-prefix reconstruction, exact decision rebuilding, exact pair comparison, batch validation, prospective rebuild/fingerprint and only then commit; payload self-authentication and caller ledgers/windows/facts are forbidden. PASS.
13. Historical stability: projection and stored validation use accepted delivery/checkpoints rather than latest ledger/current role recomputation; current Math fact cannot retroactively change its delivery. PASS.
14. Projection/privacy: source player and source AI receive exactly `{count:selectedCount}`; all other viewers omit Math information; true count, abnormal players, roles, facts, impairment, Vortox, window, reliability and provenance remain hidden. PASS.
15. Receipts/idempotency/failure: deterministic rejections and receipt semantics are separated from receipt-free retryable dependency failures; metadata/prospective/read/rebuild/commit/receipt stages, zero-event atomicity, unchanged version/pending task, same-command recovery and no duplicate delivery/fact are frozen. PASS.
16. Hostile/persistence matrix: duplicate IDs/support, wrong source/seat/task/instance/tenure/window/count/classification/Vortox provenance, partial/reordered/cross-batch pairs and proxy/revoked/getter/symbol/cycle/sparse/nonplain values fail closed; getter-call count is frozen at zero. PASS.
17. Legacy: accepted base/V1/V2 Math and Dreamer V1-V6 histories retain exact meaning; legacy V1 base+gained Option A remains unsupported without migration. PASS.
18. Ownership/traceability: all new application tests are confined to `game-application-service.test.ts`, shard/owner `application-service-information-and-later-actions`; marker/criterion/support-prefix contracts are exact and activate only after artifacts exist; A3A/A3B1/2B19B contracts remain immutable. PASS.
19. CI/profile: existing 9 ordinary / 10 coverage process topology is retained. New tests fall in the existing information-and-later-actions project/group, so no topology or group-membership change is needed. Three identical full coverage candidates, exact sourceHead binding, profile-only commit and 23 exact-head jobs are explicitly required. PASS.
20. Stop-loss: production allowlist is empty, predicted production files/LOC are 0/0, one product risk only. Any production code, new event/state/evidence/payload/order/override/ledger abstraction/Dreamer change/topology change immediately requires reslice. PASS.

## Criterion-level review

C01-C13: the real command prefix, exact canonical DRUNK, native V4, gained V6, terminal ledger, distinct source/instance IDs, exact window, qualifying sets, no third contributor, dynamic player count and exact support IDs all have an R1 accepted-stream primary mechanism. PASS.

C14-C18: ordering, same-player dedup/support completeness and NORMAL/PENDING classification use the currently reachable production pure resolver with `PURE_POLICY_SEAM`, T3, and do not masquerade as accepted-stream integration. PASS.

C19-C26: own/source exclusion, hostile outside-window/invalid facts, formal delivery/settlement, Vortox true=2/selected=0 false result and real no-Vortox truth control are appropriately separated among accepted stream, hostile replay and pure support. PASS.

C27-C31: source-player/source-AI exact one-key projection, non-source omission, no leakage and deterministic replay are explicit. PASS.

C32-C36: mutated persisted prefix/payload/provenance/window/count/classifications are correctly R3 + HOSTILE_REPLAY_REJECTION, not R1. PASS.

C37-C42: atomic pair, idempotency, one derived fact, real fault ports, same-command recovery and R2 legacy meaning are complete. PASS.

C43-C46: prior-slice contract regressions, 9 ordinary, 10 coverage and Windows deterministic exact-head gates are frozen. PASS.

S01-S12: exact command, unique IDs, provenance, window anchors, dense/ordered arrays, complete hostile-object matrix, accepted-provenance prohibition, exact effectiveness/Vortox provenance, historical isolated projection, sole ownership, complete 58-row traceability and deterministic primitive audit are each assigned an appropriate structural/replay/projection/CI mechanism. PASS.

All C01-C46 and S01-S12 rows contain the nine mandatory design-time traceability fields. Planned supporting authorities specify accepted/legacy/hostile status and mutation disposition without prematurely freezing physical test names. No criterion uses a pure fixture as R1 accepted-stream authority.

## Exact-shape, replay and safety conclusion

The current production seam supports the design without modification:
- `resolveMathematicianCountFromValidatedFactsForInternalValidation` consumes the full validated ledger, classifies all facts, groups qualifying entries with `Map<PlayerId,...>`, preserves each player’s supporting IDs, stable-sorts IDs and player rows, and derives `trueCount` from the number of player rows.
- `buildReady` derives the exclusive/inclusive window from canonical state, resolves exact base source/tenure/ability-instance and current Vortox provenance, derives legal candidates and creates the unchanged exact payload.
- `SettleMathematicianInformation` creates exactly delivery + settlement; prospective pair/batch validation executes before atomic commit.
- the event applier derives one Math terminal fact; accepted-stream replay/stored validation independently authenticates it.
- accepted-stream projection validates the settled stored chain and exposes only the selected count to the historical source.
- the accepted 2B19B command stream already proves V4 plus V6 and a real intervening Seamstress settlement ending with Math next; a base-Mathematician exact roster can be selected through the existing parameterized fixture without changing product code.

No public Dreamer V1-V6 behavior, Mathematician event/payload/projection schema, role-tenure schema, first-night order, ledger evidence union, ownership schema, CI topology, rule override or trust boundary changes are designed.

## Findings

`[]`

No `BLOCKER`, `BACKLOG_HIGH`, or `BACKLOG_NORMAL` finding was identified in this pre-implementation design review. Passing existing tests was not treated as rule truth; the conclusion is grounded in independently retrieved external rules plus current source-code and governance inspection.

## Required implementation constraints carried forward

- Implementation may begin only after the sole writer materializes this complete report and sets the exact gate state.
- Production allowlist remains empty. Any production change triggers `RESLICE_REQUIRED`; it is not an ordinary repair.
- The product/test commit may touch only the frozen test/ownership/traceability/role/control/status allowlist; the profile-only child commit may touch only the frozen profile/selector/control allowlist.
- The implementation must prove every C01-C46 and S01-S12 row, use one primary layer per physical test identity, register ownership only after physical artifacts exist, and keep all `MechanismMatch=PASS` semantically justified.
- The complete R1 scenario must have only P1 and P2 as qualifying players; true count must be derived and equal 2 only for that stream. Effective current Vortox must yield selected 0 with `VORTOX_CONSTRAINED_FALSE`; no-Vortox control must yield selected=true and `RULE_CORRECT`.
- Any commit after a final pass invalidates exact-head CI/review/comment evidence and requires a new complete final gate.

remainingBlockers: `[]`

verdict: `RULE_DESIGN_PASS`

RULE_DESIGN_PASS
