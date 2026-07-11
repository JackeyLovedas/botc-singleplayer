## reviewRound

`1 / 2`

## reviewedEvidence

`docs/rules/evidence/2B17.md`

## reviewedEvidenceHash

`db1fb83335e6a2083f85797b83516b8b646538ee3afcfd5ac92319147432d97e`

Hash matches the requested evidence exactly. Evidence verdict is `RULE_READY`, coverage is `PARTIAL`, and `unresolvedConflicts` is empty.

## reviewedDesign

`docs/implementation/phase-3-slice-2b17-design.md`

## reviewedDesignHash

`c35e45b8f863167af6d18311a3072d7100d696d112377f361c1d36121ff0aa51`

Hash matches the requested design exactly.

## externalSources

Independently retrieved and verified:

- `docs/rules/USER_OVERRIDES.md`: SHA-256 `9ec14eb794fa1f0fd47d674d7b4df5acbceed17e1b51fcde2c227a3496e4dab3`; no applicable override.
- 中文钟表匠 oldid `6181`: SHA-256 `51a4393246c618ccee2a7b5ee2076f289d7f19fdad07a6a729d3a786a86bdf0f`.
- Official Clockmaker oldid `2967`: SHA-256 `02871d3cff2ee4e40eb0486ddce72c9b1a5c513cf724595dfacf36cf50b9da9a`.
- Official Vortox oldid `3017`: SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`.
- Official States oldid `1039`: SHA-256 `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`.
- Official Glossary oldid `2874`: SHA-256 `75a4ce2fae80808172b90401f87041a2ab8a5101a8330b115739ddd9fc414fee`.
- Official Abilities oldid `1376`: SHA-256 `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40`.
- Official Storyteller Advice oldid `2552`: SHA-256 `9ddb0953b1d6a993d390096a7a163ae572ea82e11bd81426947cbc13afba5d12`.
- Official Character Types oldid `1495`: SHA-256 `0558da745c592375f1a9286eccec61eb7cf535b986f982e7a2276955fb15ed20`.
- Official Travellers oldid `2853`: SHA-256 `bd03e9244464fc756b07bc6f909a2cc9729ab3f1f7fbdf9d4980b18db4ff0734`.
- Official Spy oldid `3013`: SHA-256 `5441848fe35f5fe061007594d0abaf23b16672ab89de67700569d91915d258f4`.
- Official Recluse oldid `3007`: SHA-256 `e93ec63963124371e1581fd6f246044e4403f0865afaa34b9a088813a1836931`.
- Official Summoner oldid `3014`: SHA-256 `b3398670eda87752e7cf3e142b638e242f6ceef3d5f9b17fcfa8760679992aa6`.
- Official Philosopher oldid `2421`: SHA-256 `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`.
- Official Snake Charmer oldid `2905`: SHA-256 `34fc48e81127875a4713042efd38c6fe5e07b39f2476df7a6fcd188155d53a67`.
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`: SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

All retrieved revisions, MediaWiki SHA-1 values, and SHA-256 values match the evidence.

The nightsheet independently confirms one-based positions including dusk:

- Philosopher `14`
- Minion info `20`
- Demon info `24`
- Snake Charmer `37`
- Clockmaker `60`
- Dreamer `61`
- Seamstress `62`

Clockmaker has no ordinary other-night entry.

## repositoryFilesReviewed

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/rules/evidence/2B17.md`
- `docs/implementation/phase-3-slice-2b17-design.md`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/application/src/game-application-service.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/application/src/command-fingerprint.ts`
- `packages/projections/src/index.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/task-engine/src/index.ts`
- `packages/task-engine/src/first-night-task-planner.test.ts`
- `packages/rules-snv/src/catalog.test.ts`
- `.github/workflows/ci.yml`

## findings

1. The rule evidence is source-consistent. No material conflict exists between the official Clockmaker text, the more detailed Chinese Clockmaker page, Vortox, States, Philosopher, Snake Charmer, registration roles, Travellers, or the official nightsheet.

2. The circular geometry is correct. For distinct seats in `1..12`, the proposed bidirectional formulas yield positive directional values `1..11` and nearest distance `1..6`. Adjacent seats return `1`, opposite seats return `6`, and taking the minimum across both canonical Minions avoids the common off-by-one and single-Minion errors.

3. The design correctly classifies Demon and Minion using settlement-time `CurrentCharacterState.role.characterType`, not `currentAlignment` or initial assignment. It therefore correctly includes a good native Demon, excludes an evil Townsfolk or Traveller, and uses the post-Snake-Charmer Demon seat for the later base task.

4. The base/gained timing distinction is correct. Base Clockmaker follows Snake Charmer. Philosopher-gained Clockmaker is already inserted at `{100,1}`, after Philosopher and before Minion information, and can use the earlier current-state revision.

5. Canonical original-Clockmaker drunkenness is reachable through the existing `PHILOSOPHER_CHOSEN_DUPLICATE` event. The design correctly keeps truth legal for ordinary drunk or poisoned information while distinguishing that rule-legal set from the deterministic smallest-false simulation policy.

6. Vortox priority is correct. An effective Vortox must exclude truth even when the Clockmaker source is drunk or poisoned. The design does not incorrectly treat source impairment as permission to return truth under Vortox.

7. Poison helper scope is correctly separated. Pure candidate helpers may model poisoned legality, while canonical event creation fails closed because current accepted history cannot leave a poisoned player holding Clockmaker.

8. Registration, zero-result histories, Travellers, death, multiple Demons and unsupported character changes remain explicit rule truth but are not represented as canonical implementation coverage. The design does not claim native-type resolution implements registration.

9. The finite output domain and zero provenance are sufficiently explicit: positive canonical geometry is `1..6`; `0` comes from sourced no-Demon/no-Minion cases. This slice may use `0` as a false candidate but must not emit a canonical no-Demon/no-Minion success event.

10. Player projection is appropriately minimal: only delivered distance, model version and stage reach the source player/AI view. Demon/Minion identities, pair calculations, truth, candidates, impairment, Vortox, policy, assignment and task facts remain hidden.

11. The historical-snapshot principle is correct: replay recomputes against the pre-event settlement state, while later projection must validate the stored historical chain without recalculating the answer from newer current role, alignment or impairment state.

12. The exact two-event batch is implementable using the existing event-applier, batch-semantics and prospective-validation architecture. `ClockmakerInformationDelivered` can be validated against pre-event state, and `ScheduledTaskSettled` can require the intermediate delivery. Existing atomic commit and retry infrastructure supports the proposed failure boundaries.

13. The Vortox tenure requirement is implementable. `CharactersAssigned` already bootstraps Vortox tenures, and Snake Charmer role transitions end/create relevant tenures. A current Vortox after a Demon-hit swap can therefore have one active tenure at the Clockmaker settlement revision without adding a generic tenure system.

14. Blocking finding: stored validation does not explicitly bind `KNOWN_DRUNK.representedImpairmentIds` back to the exact preserved `AbilityImpairmentApplied` historical fact. Replay-time reconstruction is insufficient for hostile or corrupted stored state. A forged or missing impairment could otherwise support a false stored number that projection accepts. Stored validation must require exactly one matching historical impairment with the same ID, `DRUNK`, `PHILOSOPHER_CHOSEN_DUPLICATE`, source, affected player/seat, Clockmaker role, chosen role and applicable revision. Later unrelated impairment changes may be ignored, but the represented historical fact cannot be missing or cross-linked.

15. Blocking finding: stored validation also does not explicitly bind `VORTOX_FALSE_REQUIRED.vortoxRoleTenureId` to the actual preserved role-tenure record active at `settlementCharacterStateRevision`, or verify that no represented impairment disabled that tenure at that revision. Merely parsing the tenure ID and internally validating the payload is insufficient. This historical link can be validated without consulting later current role state.

16. Blocking finding: the test plan does not directly exercise the Vortox resolver’s most important fail-closed branches. The design requires multiple Vortox entries, missing tenure, conflicting tenure, malformed impairment, and unsupported impaired-Vortox state to fail rather than silently become `NONE`, but no trace row directly asserts these cases. This is particularly important because the existing Seamstress resolver currently returns `NONE` for a missing Vortox tenure; copying that behavior would violate the new design.

17. Blocking finding: the canonical-history inventory and traceability criteria are inconsistent. `supportedCanonicalHistories` lists eight concrete histories plus idempotent retry of every supported history, while `completionCriteria` requires only “six” scenarios. The 95-row plan has no direct canonical gained-Clockmaker-plus-Vortox integration test, despite that combination being explicitly supported, and its single generic idempotency row does not establish idempotent retry for every claimed supported history. The design must either narrow its supported-history claims or add direct/parameterized event-history assertions and reconcile the exact required count.

18. Blocking finding: row 38 is simultaneously presented as an exact `catalog.test.ts` test and left for the implementer to choose between a documentation test and `EXTERNAL_RULE_EVIDENCE`. That decision belongs in the reviewed design. It must be explicitly classified as external evidence, or defined as a real approved-artifact/hash validation. A local literal or a test that merely repeats the evidence text cannot prove official order. Runtime supported-subset order should remain a separate real assertion.

19. The remaining 95-row plan is generally concrete and maps the requested distance, two-Minion, character-type, settlement-state, source-contract, poison boundary, replay, batch, prospective, receipt, projection and regression behaviors to directly assertable tests. Test-name existence alone must continue to be rejected as coverage.

20. The coverage boundary is honest. Clockmaker may become `PARTIAL`, never `COMPLETE`, only after the reviewed implementation and regressions pass.

## remainingBlockers

1. Add an explicit stored-history contract and direct projection tests binding represented Clockmaker drunkenness to the exact canonical impairment fact.

2. Add an explicit stored-history contract and direct tests binding the Vortox constraint to the exact active historical tenure and its settlement-time effectiveness. Directly test missing, multiple/conflicting tenure, malformed impairment and impaired-Vortox fail-closed behavior.

3. Reconcile the supported canonical-history list, the “six scenarios” completion criterion and the trace plan. Add or remove claims so gained Clockmaker plus Vortox and idempotency coverage are exact and directly asserted.

4. Resolve trace row 38 in the design itself as `EXTERNAL_RULE_EVIDENCE` or a precisely defined approved-artifact/hash check; do not delegate that semantic choice to implementation and do not use a test-local official-order literal.

## authorizationBoundary

Implementation remains unauthorized.

Round 2 may modify only evidence/design/control documentation needed to close the four blockers. It must not begin production or test implementation until a new exact design receives independent `RULE_DESIGN_PASS`.

The corrected design must preserve:

- native `characterType` identity and unsupported registration;
- settlement-time `CurrentCharacterState`;
- exact base and Philosopher-gained source contracts;
- two-event atomic delivery/settlement;
- canonical original-Clockmaker drunkenness;
- truth-allowed ordinary impairment semantics;
- Vortox false-only priority;
- pure-only poisoned helper boundary;
- minimal source-only historical projection;
- external full-order versus runtime supported-subset separation;
- `PARTIAL` coverage.

## designVerdict

`RULE_DESIGN_FIX_REQUIRED`
