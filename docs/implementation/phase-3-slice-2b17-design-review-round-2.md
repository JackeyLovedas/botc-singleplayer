## reviewRound

`2 / 2`

Final permitted design-review round.

## reviewedEvidence

`docs/rules/evidence/2B17.md`

## reviewedEvidenceHash

`db1fb83335e6a2083f85797b83516b8b646538ee3afcfd5ac92319147432d97e`

The evidence hash is unchanged and exact. Evidence remains `RULE_READY`, `PARTIAL`, with no unresolved source conflict.

## reviewedDesign

`docs/implementation/phase-3-slice-2b17-design.md`

## reviewedDesignHash

`0892e4e8b74279f445100a7912f1b5220aba9ab51369aac8ce3a8603d62a1787`

The design hash matches the requested round-2 artifact exactly.

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

The pinned nightsheet was independently retrieved through GitHub’s content API after the raw host was temporarily unavailable. Its exact bytes and hash remained available.

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
- `docs/implementation/phase-3-slice-2b17-design-review-round-1.md`
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

1. The rule conclusions remain correct. Distance is a 12-seat circular shortest-path calculation with adjacent distance `1`, opposite distance `6`, both canonical Minions evaluated, and native truth in `1..6`.

2. Identity remains correctly based on settlement-time `CurrentCharacterState.role.characterType`, never alignment or initial assignment. The design still handles the post-Snake-Charmer Demon seat and keeps registration explicitly unsupported.

3. Base and Philosopher-gained source contracts remain bounded and implementable. The gained task remains after Philosopher and before Minion information; the base task remains after Snake Charmer.

4. The two-event delivery/settlement chain remains internally consistent and implementable through existing replay, batch, prospective-validation, receipt and atomic-commit infrastructure.

5. Ordinary drunk/poison candidate legality and deterministic simulation policy remain separate. Truth remains legal without Vortox; the deterministic policy may choose the smallest false value without presenting that policy as the official rule.

6. Vortox still correctly excludes truth for effective, drunk and pure-helper poisoned sources. Poisoned Clockmaker and impaired Vortox remain outside canonical event support.

7. Round-1 blocker 1 is closed. `KNOWN_DRUNK` now binds its represented impairment ID to one exact preserved Philosopher choice/grant/impairment chain, including every identity, role, revision and canonical-ID field. Projection tests directly cover missing, forged and cross-linked impairment facts.

8. The runtime portion of round-1 blocker 2 is closed. Current Vortox resolution now explicitly fails closed for missing, multiple, conflicting or cross-linked tenure, malformed impairment and represented impaired Vortox. It explicitly forbids copying the existing Seamstress behavior that converts missing tenure to `NONE`.

9. Round-1 blocker 3 is closed. The design now defines exactly seven supported canonical histories, rows 87–93 directly integrate each history, and row 94 requires identical-command idempotent retry with zero append for all seven.

10. Round-1 blocker 4 is closed. Row 34 is definitively `EXTERNAL_RULE_EVIDENCE`, pins the exact nightsheet commit and SHA-256, and is not a `catalog.test.ts` or test-local literal. Runtime supported-subset order remains independently tested against production definitions.

11. The 95-row trace is otherwise concrete and implementable. It covers geometry, identity, source contracts, candidate legality, command/event shapes, two-event metadata, replay, prospective rejection, receipts, projection leakage, seven canonical histories and prior-feature regressions.

12. Projection remains source-only and historical. No Demon/Minion identities, pair calculations, truth, impairment, Vortox, policy, assignment, task or canonical state is exposed. Coverage remains `PARTIAL`.

13. One blocking stored-history gap remains. The stored Vortox contract is not explicitly cross-linked to the delivery’s historical `nativeDemonReferences`.

14. For `VORTOX_FALSE_REQUIRED`, the design requires a valid preserved Vortox tenure matching the constraint fields, but never explicitly requires that the same player, seat and exact Vortox role snapshot are the delivery’s single stored native Demon reference.

15. For stored `NONE`, the design requires only “no preserved active Vortox tenure at settlement.” That is insufficient for hostile stored state. If a stored delivery contains a native Demon reference whose exact role is Vortox while its Vortox tenure is removed and its constraint is changed to `NONE`, the written stored-validation rule can accept the absence instead of recognizing it as a missing required tenure.

16. The inverse corruption is also unspecified: a stored `VORTOX_FALSE_REQUIRED` constraint and valid-looking tenure must be rejected when the delivery’s historical native Demon reference is not that same Vortox player/seat/role.

17. Replay would reject these corruptions at event-application time, but the design separately requires projection to reject hostile stored facts. Replay correctness therefore does not close the stored-projection gap.

18. Rows 84–85 test missing/conflicting/inactive tenure and impaired Vortox, but do not directly assert the required historical identity biconditional or the `VORTOX_FALSE_REQUIRED ↔ stored native Vortox reference` downgrade/upgrade mutations.

19. This residual gap is material because changing or deleting stored role-tenure state and changing the constraint to `NONE` could convert mandatory-false Vortox information into an apparently effective truth delivery during projection validation.

## remainingBlockers

1. The stored-history contract must require the following biconditional at `settlementCharacterStateRevision`:

   `vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED"` if and only if the delivery’s exact historical native Demon reference is the exact catalog Vortox.

   When true, the constraint player/seat must equal that native Demon reference and exactly one matching preserved Vortox tenure must be active and effective. When false, the stored native Demon reference must not be Vortox and no preserved active Vortox tenure may conflict with that absence.

   Direct stored-projection tests must reject:

   - native Vortox reference plus missing tenure plus constraint downgraded to `NONE`;
   - native Vortox reference plus constraint cross-linked to another player or seat;
   - non-Vortox native Demon reference plus forged `VORTOX_FALSE_REQUIRED`;
   - valid Vortox tenure/constraint whose player, seat or role snapshot does not equal the stored native Demon reference.

## authorizationBoundary

Implementation is not authorized.

This was design round `2 / 2`. The maximum design-repair round has been reached with a remaining blocker. The controller must stop this slice under the governed workflow; this report does not authorize a third design round, production changes, test implementation, branch creation, PR creation, or partial implementation.

The valid portions of the design remain non-authorizing reference material only. No implementation may begin by assuming the missing stored Vortox identity link.

## designVerdict

`RULE_DESIGN_FIX_REQUIRED`
