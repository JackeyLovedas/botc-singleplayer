## reviewRound

`3 / 3`

User-authorized additional design round.

## reviewedEvidence

`docs/rules/evidence/2B17.md`

## reviewedEvidenceHash

`db1fb83335e6a2083f85797b83516b8b646538ee3afcfd5ac92319147432d97e`

The evidence hash is exact and unchanged. Evidence remains `RULE_READY`, `PARTIAL`, with no applicable override and no unresolved source conflict.

## reviewedDesign

`docs/implementation/phase-3-slice-2b17-design.md`

## reviewedDesignHash

`fde5aebea89e003c38938c338abfd4fdd1370c88814f965c41a0dcda7b3d1e06`

The design hash matches the requested round-3 artifact exactly.

## externalSources

The fixed sources were independently retrieved again:

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
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`: Git blob `e5242b7e31299cb6d685f921aeaffc5e403be08f`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

Verified one-based positions including dusk:

- Philosopher `14`
- Minion info `20`
- Demon info `24`
- Snake Charmer `37`
- Clockmaker `60`
- Dreamer `61`
- Seamstress `62`

Clockmaker remains absent from the ordinary other-night list.

## repositoryFilesReviewed

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/rules/evidence/2B17.md`
- `docs/implementation/phase-3-slice-2b17-design.md`
- `docs/implementation/phase-3-slice-2b17-design-review-round-2.md`
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

1. The unique round-2 blocker is fully closed. The design now defines an explicit strict biconditional at `settlementCharacterStateRevision`:

   `VORTOX_FALSE_REQUIRED` if and only if the delivery’s single historical native Demon role is the exact setup-catalog Vortox.

2. The true branch is complete. It requires:

   - exactly one stored native Demon reference;
   - exact setup-catalog Vortox role snapshot;
   - constraint player and seat equal to that native Demon;
   - evaluated revision equal to settlement revision;
   - exactly one preserved tenure matching the stored tenure ID;
   - tenure player and seat equal to both constraint and native Demon;
   - tenure role `vortox`;
   - canonical tenure ID reproduction;
   - tenure active at settlement;
   - no represented impairment disabling the tenure at or before settlement.

3. The false branch is complete. It requires:

   - the stored native Demon is not Vortox;
   - the constraint is exactly `NONE`;
   - no preserved Vortox tenure is active at settlement;
   - no conflicting tenure or malformed relevant impairment makes absence indeterminate.

4. The historical validator is explicitly prohibited from consulting later `CurrentCharacterState`. It uses only the immutable delivery Demon snapshot, setup catalog, preserved tenure history, preserved impairment history and settlement revision. Later role, alignment or unrelated impairment changes cannot rewrite the delivered fact.

5. The design explicitly rejects all four previously missing hostile stored-state cases:

   - native Vortox with missing tenure and constraint downgraded to `NONE`;
   - native Vortox with constraint cross-linked to another player or seat;
   - non-Vortox native Demon with forged `VORTOX_FALSE_REQUIRED`;
   - valid-looking tenure/constraint whose player, seat or role differs from the stored native Demon.

6. Rows 86–89 map those four corruptions to four independent direct projection tests. The design expressly forbids combining them into one name-only assertion.

7. The strict biconditional is implementable with the current repository. Vortox tenures are bootstrapped from `CharactersAssigned`, Snake Charmer transitions update relevant tenures, tenure IDs encode seat/role/acquisition revision, and historical tenure activity can be checked at the stored settlement revision.

8. The original 95 trace rows remain present and materially unweakened. Four new direct rows produce a continuous `1..99` matrix. Row 34 remains external evidence rather than a local literal test.

9. The seven supported canonical histories remain unchanged. Rows 91–97 directly cover each accepted history, and row 98 requires identical-command idempotent retry, identical stored summary, unchanged version and zero append for all seven.

10. Distance geometry remains correct: 12-seat ring, adjacent `1`, opposite `6`, both native Minions evaluated, shortest pair selected, and canonical truth restricted to `1..6`.

11. Native identity remains settlement-time `CurrentCharacterState.role.characterType`, not alignment or initial assignment. Snake Charmer’s preceding transition and Philosopher’s earlier gained insertion remain correctly separated.

12. `KNOWN_DRUNK` remains bound to the exact preserved Philosopher choice/grant/impairment chain. Ordinary drunk or poisoned legality still permits truth without Vortox, while deterministic policy remains a separately identified simulation choice.

13. Vortox still forces false information for effective, drunk and pure-helper poisoned sources. Canonical poisoned Clockmaker and impaired Vortox remain unsupported and fail closed.

14. Registration, Travellers, death, unsupported native counts, later-night acquisition and general character/alignment systems remain explicitly out of scope. No registration or tenure framework expansion is authorized.

15. The exact two-event chain remains unchanged:

   - `ClockmakerInformationDelivered`
   - `ScheduledTaskSettled`

   Replay, batch, prospective validation, summary-only receipt disclosure, metadata failure and atomic commit boundaries remain consistent with existing architecture.

16. Projection remains source-only and historical. It exposes only distance, model version and knowledge stage and hides identity, geometry, truth, candidates, impairment, Vortox, tenure, policy, assignment, tasks and canonical state.

17. Full official nightsheet order and runtime supported-subset order remain correctly separated. Row 34 pins external evidence; runtime tests inspect only actual production task definitions.

18. Coverage remains honestly `PARTIAL`, never `COMPLETE`.

19. No rule conflict, design contradiction, implementation infeasibility, traceability gap or remaining authorization blocker was found.

## remainingBlockers

`[]`

## authorizationBoundary

`RULE_DESIGN_PASS` authorizes implementation only of the exact bounded Slice 2B17 round-3 design at SHA-256 `fde5aebea89e003c38938c338abfd4fdd1370c88814f965c41a0dcda7b3d1e06`, using unchanged evidence SHA-256 `db1fb83335e6a2083f85797b83516b8b646538ee3afcfd5ac92319147432d97e`.

Authorization is limited to:

- the exact two-event Clockmaker first-night information pipeline;
- the seven named canonical histories;
- the 99-row traceability contract;
- strict stored native-Demon/Vortox/tenure biconditional;
- exact preserved `KNOWN_DRUNK` provenance;
- bounded source-only historical projection;
- existing application receipt, retry and CI gates;
- `PARTIAL` coverage.

It does not authorize registration, Travellers, death/revival, canonical poisoned Clockmaker, impaired Vortox, unsupported native counts, later-night acquisition, recurring Clockmaker, generic tenure/ability refactoring, general character/alignment changes, UI, persistence or Slice 2B18.

Implementation, tests and documentation must remain within the design’s listed files and forbidden-change boundaries. Merge remains separately gated by exact-head CI, complete independent final review, both pass verdicts, empty blockers and verified GitHub audit comments.

## designVerdict

`RULE_DESIGN_PASS`
