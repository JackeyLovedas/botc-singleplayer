reviewedPR: `#23 https://github.com/JackeyLovedas/botc-singleplayer/pull/23`

reviewedHead: `faf3b44714b62f7723ecb319e6d244a324215088`

reviewTimestamp: `2026-07-12T14:17:25.0806757Z`

reviewScope:
- Independent read-only final repair-2 review of the complete PR diff/body and frozen feature head.
- Compared the implementation against Design 3.2, its independent `RULE_DESIGN_PASS`, `2B18-resolved.md`, the four approved Mathematician simulator overrides, the role coverage matrix, and both previous complete final-review reports.
- Independently retrieved all pinned official Wiki revisions with `action=raw`, the pinned Chinese Mathematician revision, and the pinned official nightsheet. Every SHA-256 matched `docs/rules/evidence/2B18-resolved.md`.
- Confirmed push CI `29195691651` and PR CI `29195693110` are successful for exact head `faf3b44714b62f7723ecb319e6d244a324215088`. Green CI was treated as execution evidence, not as rule proof.
- Reviewed the complete internal context and override carrier; canonical base/V1/V2 identity and accepted-chain validation; all 16 evidence variants and the replay provenance boundary; terminal role semantics; ledger/window provenance; count classification/support/ordering; adversarial tests; PR claims; coverage claims; Snake/Vortox/unresolved handling; replay integration; cloning; projections; accepted-contract compatibility; Mathematician fail-closed behavior; and 2B18B/2B19 scope.

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
- `docs/implementation/phase-3-slice-2b18a-final-review-round-2.md`
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
1. `PASS — The frozen internal context fields and override carrier are now present.` The module-private context includes the required version, source role/kind, resolution sequence, roster snapshot, window, ledger, and internally constructed exact four-override carrier. The public resolver still accepts only `stateBeforeResolution: unknown`.

2. `BLOCKER — Canonical context validation still does not prove the complete accepted task/insertion subgraph.` The call to `validateFirstNightTaskPlanRuntimeState` supplies `insertedTasks` by filtering the plan’s own tasks, rather than reconstructing them from `state.firstNightTaskInsertions`. Its “runtime task equals insertion event” comparison is therefore tautological. `instanceFor` separately inspects insertion/grant/opportunity records, but compares only a subset of their accepted fields and does not prove the complete V1/V2 insertion payload, catalog, order, role snapshot, opportunity task, grant identity, and task-source chain. A locally consistent forged subgraph can still pass parts of the state-bound boundary.

3. `BLOCKER — V1/V2 canonical ability-instance validation still permits generation mixing.` The shared gained-task grammar accepts both `first-night-v1` and `first-night-v2`, while `validateFirstNightAbilityInstanceProvenance` does not require `PHILOSOPHER_GAINED_TASK_V1` to contain a V1 task ID or V2 to contain a V2 task ID. It also does not bind the task’s `from-<role>` segment and grant’s `from-<role>` segment to each other and to `abilityRoleId`. Thus public provenance validation can accept cross-generation or internally mismatched canonical-looking identities even though the replay adapter normally emits a stronger chain.

4. `PASS — The replay append boundary now proves exact canonical-source equality.` `applyFirstNightAbilityOutcomeLedger` validates the existing ledger, derives from the validated terminal pre-state/envelope, calls fact validation with that canonical source, requires byte-semantic equality with a fresh derivation, rejects duplicate fact identity, and validates the appended ledger. Accepted event, payload, and batch contracts remain unchanged.

5. `BLOCKER — Standalone fact/ledger validation remains weaker than the frozen semantic contract used by the public state resolver.` `validateFirstNightAbilityOutcomeLedger` invokes fact validation without a canonical source. A caller-supplied state can therefore contain a self-consistent but forged ledger that passes the standalone validators and is consumed by the public resolver. The context does not re-derive each ledger fact from accepted history, bind all fact player/seat pairs to the fixed roster, or prove that the anchor’s `firstNightInitializedEventId` is the accepted initialization event. The PR now documents the standalone/replay distinction more accurately, but the state-only resolver’s hostile-input contract is not thereby satisfied.

6. `BLOCKER — Several standalone role-semantic cross-links remain incomplete.` Clockmaker false-distance facts can use a drunkenness/poisoning cause without matching impairment evidence; Dreamer impairment cause is not required to match the recorded impairment kind; Seamstress mismatches can similarly claim an impairment cause without the corresponding impairment evidence; and Cerenovus’s choice ID, marker ID, chosen role, target, and delivery relationships are not fully checked by standalone fact validation. Canonical replay derivation produces stronger values, but forged combinations can still pass the exported validators and enter a caller-supplied resolver state.

7. `PASS — Snake Charmer and Dreamer/Vortox emitted classifications remain correct.` Ineffective Snake Charmer distinguishes historical non-Demon `NORMAL`, Demon `ABNORMAL`, and unprovable history `UNRESOLVED`. Dreamer preserves normal truth, represented impairment, proven Vortox, and unproven Vortox applicability without inventing missing tenure evidence.

8. `PASS — Witch and Cerenovus emitted behavior remains within the frozen scope.` Effective Witch pending-marker creation is `NORMAL`; ineffective Witch is `PENDING_TRIGGER`. Cerenovus marker creation emits no fact, while supported effective instruction delivery emits a `NORMAL` fact. No unsupported impaired Cerenovus event is invented.

9. `PASS — Lower-window ordering and unresolved redundancy are enforced.` Ledger facts must occur strictly after the exclusive anchor and in increasing event-sequence order. Only a retained qualifying abnormal fact makes a same-player unresolved fact redundant; own, future, normal, and pending facts cannot do so.

10. `BLOCKER — Count-result validation proves coverage, but not correct classification against the ledger.` `validateMathematicianCountResolution` now enforces unique support ownership, nonempty supports, unique seats, stable player ordering, exact-once ledger coverage, and count equality. It does not verify that an `ABNORMAL` fact is in `qualifyingAbnormalFactIds`, a `NORMAL` fact is in `ignoredNormalFactIds`, a pending fact is in `ignoredPendingFactIds`, or that own/future/unresolved classifications match the supplied window and resolving identity. For example, a canonical `ABNORMAL` ledger fact can be placed solely in `ignoredNormalFactIds` with count zero and still satisfy the validator. It also does not bind distinct-player seats to the internal roster snapshot. This leaves prior count-classification blocker 10 materially open.

11. `PASS — Replay integration, cloning, projection isolation, and accepted compatibility remain sound within the reviewed paths.` The ledger is derived state, nested clones do not share the tested references, ledger/count/context data are not projected to player or AI views, and no accepted event/payload/command/batch/receipt contract changed.

12. `PASS — Mathematician delivery remains fail closed and outside this slice.` `MATHEMATICIAN_INFORMATION` still returns `ApplicationNotConfigured` before settlement. No `MathematicianInformationDelivered`, number selection, receipt, settlement, game-version increment, 2B18B, or 2B19 implementation was added.

13. `BLOCKER — Direct adversarial traceability remains insufficient for the frozen design and evidence requirements.` The dedicated ledger suite contains 17 tests. It covers exact top-level evidence shapes, selected ID grammar, one gained-V2 positive resolver, selected hostile values, Snake quadrants, and Dreamer/Vortox cases. It does not directly cover successful base and V1 resolver contexts, V1/V2 generation-mixing rejection, full insertion/grant/opportunity subgraph forgery, anchor-event forgery, roster-to-ledger mismatch, every terminal minimum/conditional set, per-variant canonical-source mismatch, Clockmaker/Seamstress/Cerenovus cause-chain forgeries, or wrong-category count results. The full 940-test green suite cannot substitute for these missing rule-contract assertions.

14. `BLOCKER — PR and coverage claims still overstate demonstrated guarantees.` The PR says canonical base/V1/V2 chains, all 16 canonical-source proofs, exact ledger-bound classification, and hostile forged-subgraph rejection are complete. The role coverage matrix similarly claims V1/V2 provenance and strict canonical context/count behavior. Findings 2, 3, 5, 6, 10, and 13 show these guarantees remain incomplete. Keeping Mathematician `PARTIAL` is correct, but the individual implementation claims are still too broad.

15. `PASS — No earlier scope regression was found.` Own-instance exclusion remains source-player plus exact provenance identity rather than global role exclusion; later/future ordering remains one-way; no current Mathematician result feeds itself; no general dawn reset or later-night ledger was added; and no private Mathematician number is exposed.

codeVerdict: `CODE_REVIEW_FIX_REQUIRED`

ruleVerdict: `RULE_REVIEW_FIX_REQUIRED`

remainingBlockers:
- Validate runtime inserted tasks against the canonical `firstNightTaskInsertions` records rather than the plan’s own filtered tasks, and enforce the complete accepted base/V1/V2 task-insertion-grant-opportunity chain.
- Reject V1/V2 generation mixing and bind task/grant role segments, plan generation, and `abilityRoleId` in canonical ability-instance provenance validation.
- Close the caller-supplied state boundary by binding ledger facts, roster identities, anchor identity, and semantic evidence to canonical accepted state/history, or narrow the public contract so forged standalone ledgers cannot be treated as canonical.
- Enforce Clockmaker, Dreamer, Seamstress, Cerenovus, and impairment cause/evidence semantic cross-links in the validator path consumed by the public resolver.
- Make count-result validation recompute and verify each fact’s correct category from the ledger, window, resolving source/instance, and roster—not merely exact-once membership.
- Add direct adversarial regression tests for these remaining contracts and narrow the PR body and role coverage matrix to guarantees actually enforced and tested.
