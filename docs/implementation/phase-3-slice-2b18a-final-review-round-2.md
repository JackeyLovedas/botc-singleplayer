reviewedPR: `#23 https://github.com/JackeyLovedas/botc-singleplayer/pull/23`

reviewedHead: `aade6cf2cbf1dba70f346c7c016aa6143423a395`

reviewTimestamp: `2026-07-12T13:52:29.6681692Z`

reviewScope:
- Independent read-only repair review of the complete PR diff/body and frozen repaired head.
- Compared the implementation against Design 3.2, its independent `RULE_DESIGN_PASS`, the resolved evidence, four approved simulator overrides, role coverage matrix, prior 16-finding final review, existing accepted domain contracts, and exact-head CI.
- Re-fetched all pinned official role-rule revisions, the pinned Chinese Mathematician revision, and the pinned official nightsheet. Every raw-content SHA-256 matched `docs/rules/evidence/2B18-resolved.md`.
- Confirmed push CI `29194922516` and PR CI `29194923859` are successful for the exact reviewed head.
- Re-ran the dedicated ledger suite: 19/19 passed. Green tests and CI were treated as execution evidence only, not as rule proof.
- Audited Snake historical classification; Dreamer/Vortox behavior; public state-bound resolution; module-private context; all 16 evidence shapes, identities, values, nested generation, cross-links and minimum sets; ability-instance grammar/provenance; window/ledger provenance; unresolved redundancy; count-result validation; replay integration; conditional tenure/Vortox evidence; cloning; projections; accepted-contract compatibility; Mathematician fail-closed behavior; and 2B18B/2B19 scope.

productionFilesReviewed:
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/ids.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/player-roster.ts`
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
- `docs/implementation/phase-3-slice-2b18a-final-review-round-1.md`
- Official Mathematician Wiki `oldid=3109`, SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`
- Official States Wiki `oldid=1039`, SHA-256 `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`
- Official Vortox Wiki `oldid=3017`, SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`
- Official Philosopher Wiki `oldid=2421`, SHA-256 `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`
- Official Snake Charmer Wiki `oldid=2905`, SHA-256 `34fc48e81127875a4713042efd38c6fe5e07b39f2476df7a6fcd188155d53a67`
- Official Witch Wiki `oldid=2682`, SHA-256 `330953478cfc8a035a49fcbf379edff35d5f50c9efa37310323ccc40b2f364ef`
- Official Cerenovus Wiki `oldid=3048`, SHA-256 `fd60de683c2aade3618f4784123184bfb7b9d50c3c5e6ed804261edbd187fa5c`
- Official Clockmaker Wiki `oldid=2967`, SHA-256 `02871d3cff2ee4e40eb0486ddce72c9b1a5c513cf724595dfacf36cf50b9da9a`
- Official Dreamer Wiki `oldid=2904`, SHA-256 `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`
- Official Seamstress Wiki `oldid=1999`, SHA-256 `63b151afa4ca7ffa200f037057ea15baf1673cd5fc80b496f621d83e4b17350d`
- Official Evil Twin Wiki `oldid=3101`, SHA-256 `7c030a4de658ec7c710da0813b93a9fc333666d0e68952c14defa300bf28d0b6`
- Official Abilities Wiki `oldid=1376`, SHA-256 `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40`
- Chinese Mathematician Wiki `oldid=6214`, SHA-256 `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
findings:
1. `PASS — Snake Charmer historical classification was repaired.` `SnakeCharmerIneffectiveResolved` now distinguishes historical non-Demon (`NORMAL`), Demon (`ABNORMAL`), and unprovable target history (`UNRESOLVED`). Direct tests cover all three outcomes.

2. `PASS — The frozen Dreamer/Vortox classification matrix was added.` Normal no-Vortox truth, proven Vortox tenure, unproven applicability, and effective false pair without Vortox are represented with the required outcomes. Missing tenure is not fabricated.

3. `BLOCKER — The public resolver still does not construct or validate the complete frozen internal context.` The module-private type at `first-night-ability-outcome-ledger.ts:348` omits the required `contextVersion`, `sourceAbilityRoleId`, `taskSourceKind`, `resolutionLastEventSequence`, fixed roster snapshot, and `applicableOverrides`. The four approved overrides exist only as an exported constant/type and are never internally instantiated or verified. The builder also does not call the existing task-plan runtime/progress validators, validate the canonical task catalog/scheduled-task shape, or require the next task’s canonical `PENDING` status. The passing resolver fixture itself contains `taskCatalogSnapshot: {}` and an otherwise synthetic plan that is not a valid canonical runtime plan. Consequently fabricated but locally consistent state subgraphs can still reach a result, contrary to Design 3.2 and prior blocker 3.

4. `BLOCKER — Ability-instance grammar and gained provenance remain insufficiently canonical.` `parseFirstNightAbilityInstanceId` accepts arbitrary greedy task/grant segments and does not enforce the Design 3.2 canonical scheduled-task grammar, leading-zero rules, or legal structural separators. `instanceFor` finds an insertion by task ID but does not validate the complete insertion/grant/opportunity/source/seat/chosen-role/generation chain before constructing provenance. Public provenance validation round-trips the locally supplied strings but cannot establish that they are canonical accepted IDs. Prior blocker 7 is therefore not fully closed.

5. `BLOCKER — Evidence validation is still not the required canonical-source validation.` The 16 exact top-level shapes, nested V1/V2 shapes, and frozen primary identities are present, but `validateAbilityOutcomeEvidenceReference` validates only local field shape/value. `validateFirstNightAbilityOutcomeFact` checks selected internal relationships, not that every reference equals its unique pre-event canonical source record. Examples include no canonical task-plan validation, no full accepted opportunity/impairment/grant/insertion lookup, no Cerenovus choice-marker-delivery chain validation, and no full role-catalog snapshot comparison. A forged self-consistent evidence object can therefore pass the public validators. Prior blockers 4 and 6 are only partially closed.

6. `BLOCKER — Several per-role semantic cross-links required by Design 3.2 remain unenforced by fact validation.` Clockmaker evidence is not checked against rule-correct versus selected distance and the fact status/cause. Dreamer delivery roles are not checked by the validator against historical target truth and its status/cause matrix. Seamstress evidence is not checked against stored comparison versus delivered answer and its status/cause. The adapters derive some of these values correctly, but the public fact validator accepts forged combinations, violating the frozen runtime-validation contract.

7. `PASS — Frozen evidence primary identities and canonical ordering were repaired.` Snake uses terminal event ID, Witch uses `pendingDeathId`, Cerenovus and Clockmaker use accepted `deliveryId`, Dreamer and Seamstress use terminal event ID, and player-role identity is player plus revision. Equal duplicates deduplicate and conflicting same identities fail.

8. `PARTIAL/BLOCKER — Lower-window enforcement was added, but complete ledger/state provenance remains absent.` Facts at or before the exclusive anchor are rejected and ordering is enforced. However, the internal context does not prove the anchor’s `firstNightInitializedEventId` against canonical accepted history and relies on an incomplete synthetic-plan validation path. Prior blocker 8 is not fully closed.

9. `PASS — Same-player unresolved redundancy was repaired.` Only a retained qualifying abnormal fact for that player makes an in-window unresolved fact redundant; otherwise it remains blocking.

10. `BLOCKER — Count-result validation remains incomplete.` Exact resolved/unresolved top-level keys and count equality were added, but the validator does not prove that every qualifying fact ID appears exactly once in one distinct player’s nonempty support list, does not reject one supporting fact assigned to multiple players, does not enforce unique roster seats or full stable tie ordering, and does not validate complete classification against the ledger. The resolver’s locally generated result is stronger than the exported validator contract, so prior blocker 10 is only partially closed.

11. `PASS — Replay integration now validates the existing ledger, derived fact, appended ledger, and duplicate fact identity before accepting the next state.` The ledger hook remains derived state and accepted event/payload/batch contracts are unchanged.

12. `PASS — Conditional Vortox and explicit-tenure adapters were added.` Proven Clockmaker/Seamstress Vortox constraints add role and tenure evidence; Dreamer distinguishes proven from missing tenure; explicit Cerenovus/Seamstress instances add source tenure.

13. `BLOCKER — Required direct test traceability remains materially incomplete.` The dedicated suite has only 19 tests. It checks each evidence variant’s top-level missing/extra field but not each variant’s canonical-source and wrong-cross-link cases; it has no full terminal minimum/conditional matrix, no hostile canonical task-plan/status/gained-chain forgery matrix, no override-carrier/context exact-shape test, no canonical ability-ID grammar/leading-zero tests, and no complete count-classification adversarial tests. The single “incomplete fabricated resolving state” assertion does not cover self-consistent forged subgraphs. The PR body’s claim that all 16 variants have provenance/cross-link hostile coverage is therefore unsupported.

14. `PASS/PARTIAL — Deep cloning was materially improved.` Ledger, provenance, evidence, window, count, and nested supporting-ID objects are recursively cloned with canonical-input rejection. Direct tests cover important nested references, though not every exported clone helper.

15. `BLOCKER — The role coverage matrix and PR summary overstate the repaired implementation.` They claim strict state-bound context validation, exact provenance, and complete 16-variant cross-links, while findings 3–6, 8, 10, and 13 remain unresolved. Mathematician may remain `PARTIAL`, but those individual claims must be narrowed to behavior actually enforced and tested.

16. `PASS — Scope and compatibility remain bounded.` No accepted event, payload, command, batch, receipt, or settlement contract changed. `MATHEMATICIAN_INFORMATION` still fails closed with `ApplicationNotConfigured`; no Mathematician number or settlement is emitted. Ledger/count data are absent from player/AI projection output. No 2B18B or 2B19 work was found. Witch classifications remain frozen.

codeVerdict: `CODE_REVIEW_FIX_REQUIRED`

ruleVerdict: `RULE_REVIEW_FIX_REQUIRED`

remainingBlockers:
- Implement and validate the complete Design 3.2 module-private Mathematician context, including internally constructed exact override carrier, canonical roster snapshot, complete task-plan/progress/task-status validation, source kind/role, and resolution sequence.
- Enforce canonical ability-instance ID grammar and the full base/V1/V2 accepted insertion-grant-opportunity provenance chain.
- Make evidence/fact validation prove all 16 references against their unique canonical pre-event sources and enforce the missing Clockmaker, Dreamer, Seamstress, Cerenovus, and gained-instance semantic cross-links.
- Complete ledger/anchor-to-state provenance validation.
- Complete count-result classification/support/seat/order invariants against the canonical ledger.
- Add direct adversarial regression tests for every remaining security and semantic contract, then correct the PR traceability and coverage claims to match demonstrated behavior.
