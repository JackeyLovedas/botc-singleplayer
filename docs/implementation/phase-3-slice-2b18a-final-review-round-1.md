reviewedPR: `#23 https://github.com/JackeyLovedas/botc-singleplayer/pull/23`

reviewedHead: `245e32f85e3a553c6d5302aa0b4bd434b0a3490c`

reviewTimestamp: `2026-07-12T13:12:49.3136008Z`

reviewScope:
- Independent read-only final code and rule review of the frozen PR head.
- Compared the complete PR diff and body against Design 3.2, its independent `RULE_DESIGN_PASS` report, resolved rule evidence, approved overrides, role coverage matrix, existing domain contracts, and the exact-head CI records.
- Re-fetched the pinned official Mathematician, States, Vortox, and Philosopher revisions, the Chinese Mathematician revision, and the pinned official nightsheet. Their SHA-256 values matched `docs/rules/evidence/2B18-resolved.md`.
- Confirmed push CI `29193767716` and pull-request CI `29193768978` both completed successfully for the exact reviewed head.
- Checked ledger reconstruction, window boundaries, the 16 evidence variants, canonical identities and cross-links, hostile validation, cloning, state-bound resolution, internal-context requirements, player deduplication, own-instance exclusion, duplicate-holder temporal behavior, unresolved/pending behavior, all terminal role adapters, Vortox handling, projection boundaries, accepted-event compatibility, the existing Mathematician fail-closed boundary, and 2B18B/2B19 scope.
- Green CI was treated as execution evidence only and not as proof of rule correctness.

productionFilesReviewed:
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/evil-twin.ts`
- `packages/domain-core/src/witch.ts`
- `packages/domain-core/src/cerenovus.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`
- `packages/rules-snv/src/index.ts`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/implementation/phase-3-slice-2b18a-status.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`

testFilesReviewed:
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/philosopher-ability.test.ts`
- `packages/domain-core/src/snake-charmer.test.ts`
- `packages/domain-core/src/evil-twin.test.ts`
- `packages/domain-core/src/witch.test.ts`
- `packages/domain-core/src/cerenovus.test.ts`
- `packages/domain-core/src/cerenovus-replay.test.ts`
- `packages/domain-core/src/clockmaker.test.ts`
- `packages/domain-core/src/clockmaker-replay.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/seamstress.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/rules-snv/src/catalog.test.ts`

ruleEvidenceReviewed:
- `docs/rules/evidence/2B18.md`
- `docs/rules/evidence/2B18-resolved.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md`
- `docs/implementation/phase-3-slice-2b18a-design-review-round-3-2.md`
- Official Mathematician Wiki revision `oldid=3109`, SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`
- Official States Wiki revision `oldid=1039`, SHA-256 `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`
- Official Vortox Wiki revision `oldid=3017`, SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`
- Official Philosopher Wiki revision `oldid=2421`, SHA-256 `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`
- Chinese Mathematician Wiki revision `oldid=6214`, SHA-256 `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`

findings:
1. `BLOCKER — Snake Charmer rule classification is wrong.` In `first-night-ability-outcome-ledger.ts:215`, every `SnakeCharmerIneffectiveResolved` event becomes `ABNORMAL`. The sourced rule and Design 3.2 require impaired plus non-Demon no-swap to be `NORMAL`, and only impaired plus Demon no-swap to be `ABNORMAL`; missing historical target truth must become `UNRESOLVED`. This implementation counts a poisoned Snake Charmer choosing a Townsfolk even though the official Mathematician example explicitly says that outcome worked normally and is not counted.

2. `BLOCKER — Dreamer/Vortox behavior is not implemented.` The Dreamer adapter only branches on `SOURCE_IMPAIRED` at lines 219–223. An effective Dreamer with proven or potentially applicable Vortox falls through to `NORMAL`. Design 3.2 requires proven effective Vortox to produce `UNRESOLVED / DREAMER_VORTOX_CONSTRAINT_UNRECORDED`, unresolved applicability to produce `UNRESOLVED / VORTOX_APPLICABILITY_NOT_PROVEN`, and effective false information without Vortox to fail as an invalid accepted invariant. No historical Vortox tenure/evidence path exists.

3. `BLOCKER — The public state-only resolver is not canonically state-bound.` `resolveFirstNightMathematicianTrueCountFromState` validates only that its argument is a plain canonical object with a ledger and task plan. It does not construct or validate the frozen module-private `InternalResolvingMathematicianContext`; it does not verify game ID, baseline, phase/night, `FirstNightInitialized`, anchor consistency, fixed 12-player roster, current character revision, task-plan validity, task status, unique next/unsettled Mathematician task, current source character, or V1/V2 insertion-grant-opportunity provenance. The new tests intentionally pass severely incomplete fabricated objects and expect resolution to succeed, contradicting the reviewed security contract.

4. `BLOCKER — The 16 evidence contracts are only superficial top-level shapes.` `validateAbilityOutcomeEvidenceReference` checks enumerable keys but does not validate field values, canonical IDs, positive revisions/sequences, enum values, nested V1/V2 generation exact shapes, canonical record existence, or any per-variant semantic cross-link. Empty IDs, incorrect task types, invalid nested generation objects, and role-specific records unrelated to the terminal fact can pass.

5. `BLOCKER — Required evidence identities are implemented incorrectly.` The generic `primary()` loop selects `taskId` before role-specific accepted identities. Consequently Snake resolution, Witch pending marker, Cerenovus delivery, Clockmaker delivery, Dreamer delivery, and Seamstress delivery are keyed by task ID rather than the frozen identities: terminal event ID, `pendingDeathId`, `deliveryId`, or terminal event ID as applicable. This breaks deterministic duplicate/conflict handling and the exact identity contract Design 3.2 was created to establish.

6. `BLOCKER — Fact validation does not enforce terminal minimum or conditional evidence.` `validateFirstNightAbilityOutcomeFact` requires only one matching `SOURCE_EVENT` and one matching `TASK`. It does not enforce source/target role snapshots, action opportunity, impairment, grant/insertion, explicit tenure, role-specific accepted record, Vortox evidence, or prohibited evidence kinds. The test fixture for `WitchDeathPendingMarked` contains only source-event and task evidence and is accepted, although Design 3.2 requires the Witch pending marker, source and target role evidence, opportunity, character revision, and exact cross-links.

7. `BLOCKER — Ability-instance identity and provenance validation are incomplete.` The parser accepts noncanonical segments and the provenance validator checks only ID kind, not formatter round-trip or embedded task/grant/role/existing-instance equality. It also does not cross-link the provenance source player, seat, role, and task to the containing fact. A fact can therefore carry a different canonical task or source inside its ability instance and still validate.

8. `BLOCKER — Ledger/window validation permits impossible history.` The ledger validator does not require facts to occur strictly after its `FirstNightInitialized` lower bound, does not cross-link ledger game/baseline to the state, and does not prove that facts came from the same accepted stream. The resolver only labels sequences above `lastEventSequence` as future; it can count a forged fact at or before the exclusive lower boundary.

9. `BLOCKER — Unresolved redundancy is missing.` The reviewed pipeline requires an in-window, non-own, retained `ABNORMAL` fact to make a same-player unresolved fact redundant. The implementation places every `UNRESOLVED` fact into the blocking list and always returns `redundantUnresolvedFactIds: []`. It therefore returns `UNRESOLVED` even when the unresolved fact cannot change the distinct-player count.

10. `BLOCKER — Count-result validation does not validate the result contract.` `validateMathematicianCountResolution` accepts any canonical plain object whose `status` is `RESOLVED` or `UNRESOLVED`. It does not enforce exact variant keys, `0..11`, count equality, nonempty unresolved facts, unique/stable arrays, supporting fact IDs, classification completeness, window consistency, or mutual exclusion of `trueCount` and `currentPartialCount`.

11. `HIGH — Derived facts and appended ledgers are not validated at the integration boundary.` `applyFirstNightAbilityOutcomeLedger` appends the adapter result without running the frozen fact/ledger validation or detecting duplicate/conflicting fact identities with the required DomainError. Several declared error codes are therefore not exercised by the actual replay path.

12. `HIGH — Conditional Vortox and historical evidence are absent from other adapters.` Clockmaker and Seamstress can be labeled `VORTOX_FALSE_INFORMATION`, but their adapters do not add the required Vortox `PLAYER_ROLE_AT_REVISION` and `ROLE_TENURE` references. Historical-source and explicit-instance tenure conditions are likewise not fully enforced.

13. `HIGH — Test traceability in the PR body is materially inaccurate.` The test named “accepts all closed evidence shapes” exercises only `SOURCE_EVENT`, not all 16 variants. There are no positive/negative cross-link tests per variant, no nested insertion-generation tests, no terminal-specific minimum-set tests, no context-forgery rejection tests, no Snake quadrant tests, no Dreamer/Vortox tests, no unresolved-redundancy tests, no lower-window hostile test, and no exact count-result validation tests. Repository search shows the existing role, rebuild, application, and projection test files contain no assertions over `firstNightAbilityOutcomeLedger`; their unchanged green status cannot provide the claimed terminal integration or projection traceability.

14. `HIGH — Deep-clone requirements are under-tested and only partially demonstrated.` Clone helpers all delegate to unrestricted `structuredClone`; tests check only the ledger object and top-level facts array identity. Nested ability provenance, evidence arrays/objects, window snapshots, distinct-player supporting IDs, unresolved facts, and count results are not checked against shared-reference leakage or hostile runtime inputs.

15. `HIGH — The role coverage matrix overstates accepted behavior.` It marks Mathematician `PARTIAL` for represented impairment, Vortox classifications, provenance, own-instance exclusion, temporal visibility, and historical revision evidence. Findings 1–12 show those claims are incomplete or incorrect at the reviewed head, so the matrix cannot be accepted as accurate implementation evidence.

16. `PASSING SCOPE CHECKS.` The PR does not add or modify accepted event, payload, command, batch, receipt, or settlement contracts. The application still returns `ApplicationNotConfigured` before Mathematician settlement and emits no Mathematician delivery. No package-root internal context API is exposed, no ledger field is added to projection contracts, and no 2B18B or 2B19 implementation was found. The first-night anchor is created at `FirstNightInitialized`, Witch effective pending-marker classification remains `NORMAL`, Witch ineffective classification remains `PENDING_TRIGGER`, and exact-head push/PR CI is green. These passing checks do not offset the rule and validation blockers above.

codeVerdict: `CODE_REVIEW_FIX_REQUIRED`

ruleVerdict: `RULE_REVIEW_FIX_REQUIRED`

remainingBlockers:
- Correct Snake Charmer classification using the historical target role and emit `UNRESOLVED` when that history cannot be proved.
- Implement the frozen Dreamer/Vortox applicability matrix and its real historical role/tenure evidence without inventing missing records.
- Implement and validate the complete module-private resolving Mathematician context from the canonical pre-resolution state; reject fabricated or incomplete state subgraphs.
- Implement all 16 evidence value validators, nested exact shapes, frozen primary identities, canonical-source checks, per-variant fact cross-links, and terminal minimum/conditional evidence sets.
- Enforce canonical ability-instance grammar, round-trip identity, provenance-chain validation, and fact/source/task cross-links.
- Enforce the exclusive lower window boundary and complete ledger/state provenance.
- Implement same-player unresolved redundancy after retained abnormal-player deduplication.
- Implement the exact `MathematicianCountResolution` validators and classification/count invariants.
- Validate facts and ledger appends at replay integration and enforce duplicate/conflict DomainErrors.
- Add direct regression tests for every rule claim and hostile contract identified above; existing green tests cannot substitute for them.
- Correct the PR rule-to-test traceability and role coverage matrix so they describe only behavior actually proved at the frozen head.
