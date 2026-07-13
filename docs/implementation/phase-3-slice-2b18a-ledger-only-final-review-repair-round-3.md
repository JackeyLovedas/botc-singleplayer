reviewedPR: `#23 https://github.com/JackeyLovedas/botc-singleplayer/pull/23`

reviewedHead: `9c5d693fd4a2f0392a2deef8b4fba9436d0611a2`

reviewTimestamp: `2026-07-13T02:20:38.1407971Z`

reviewScope:

- Fresh independent read-only final review of PR #23 against base `89143b56ba7cb2e8c6aa6a2ce97c7a5dbe82794f`.
- Verified local HEAD, remote feature HEAD, and PR HEAD all equal `9c5d693fd4a2f0392a2deef8b4fba9436d0611a2`; the worktree is clean and the PR is open, non-draft, and merge-state clean.
- Reviewed the complete PR diff, PR body, retained Design 3.2 ledger classifications, ledger-only rescope, both scope-review reports, rule evidence and approved overrides, current control/status/coverage documents, production implementation, changed tests, relevant pre-existing role/replay tests, projections, and public exports.
- Independently checked the pinned official BOTC role/state revisions and official nightsheet evidence. No BOTC interpretation or approved override change was found.
- Verified exact-head push CI `29218907974` and pull-request CI `29218909579` both succeeded for the reviewed HEAD. Ubuntu ran typecheck, lint, full tests, and coverage; the configured Windows deterministic suite also succeeded. Green CI was treated as execution evidence, not as rule-contract proof.
- Checked removal of the public count resolver/result/context/window-snapshot/runtime-carrier contracts; accepted insertion reconstruction; base/V1/V2 identities and chains; terminal pre-state derivation; fact equality; shape/provenance separation; anchor and roster boundaries; role-specific classifications and evidence; hostile shapes; replay/projection behavior; rule-to-test traceability; scope exclusions; and documentation claims.

productionFilesReviewed:

- `AGENTS.md`
- `README.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/implementation/phase-3-slice-2b18a-status.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/current-character-state.ts`
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
- `packages/projections/src/private-knowledge-view.ts`
- `packages/projections/src/index.ts`

testFilesReviewed:

- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-task-plan.test.ts`
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

ruleEvidenceReviewed:

- `docs/rules/USER_OVERRIDES.md`, SHA-256 `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`
- `docs/rules/evidence/2B18.md`
- `docs/rules/evidence/2B18-resolved.md`, SHA-256 `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`, terminal `RULE_READY`, coverage `PARTIAL`
- `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md`, SHA-256 `615f4cb303cbcb6884f37cf6f46eb6733e1df631c68a9a3fa9085da26134d865`
- `docs/implementation/phase-3-slice-2b18a-design-review-round-3-2.md`
- `docs/implementation/phase-3-slice-2b18a-ledger-only-rescope.md`, SHA-256 `3415944f1a42bcaee8f0a7a990a6d8d148ad0169fea0a9e4697acfbfc9f44b44`
- `docs/implementation/phase-3-slice-2b18a-ledger-only-scope-review-round-1.md`, SHA-256 `52e987c1709b429e43457bbe2b2008ba9bdd8e615f6d87e349da5a9aefe436cc`
- `docs/implementation/phase-3-slice-2b18a-ledger-only-scope-review-round-2.md`, SHA-256 `00177a72d33d9be71e3c281edaea908dd2e98b49509c6aa8d257260fc719967a`, terminal `SCOPE_REVIEW_PASS`
- Official Mathematician Wiki revision `3109`
- Official States Wiki revision `1039`
- Official Vortox Wiki revision `3017`
- Official Philosopher Wiki revision `2421`
- Official Snake Charmer Wiki revision `2905`
- Official Witch Wiki revision `2682`
- Official Cerenovus Wiki revision `3048`
- Official Clockmaker Wiki revision `2967`
- Official Dreamer Wiki revision `2904`
- Official Seamstress Wiki revision `1999`
- Official Evil Twin Wiki revision `3101`
- Official Abilities Wiki revision `1376`
- User-specified Chinese Wiki revisions recorded in `2B18-resolved.md`, including Mathematician `6214`
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, recorded SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`

findings:

1. `PASS — Ledger-only scope reduction is correctly reflected in the runtime surface.` The package root no longer exports `resolveFirstNightMathematicianTrueCountFromState`, `MathematicianCountResolution`, its validators/clones, resolving context, count-window snapshot, or runtime override carrier. No renamed state-, ledger-, context-, window-, or instance-supplied count decision API was found.

2. `PASS — Mathematician execution remains outside 2B18A.` `MATHEMATICIAN_INFORMATION` remains fail closed with `ApplicationNotConfigured`, retryability, no receipt, no domain event, no settlement, and no version increment. No `MathematicianInformationDelivered`, private number, candidate-number selection, Vortox final number, 2B18B, or 2B19 implementation exists.

3. `PASS — The retained public API is structurally scoped.` Public ledger, fact, anchor, evidence, identifier, clone, and explicitly named `...Shape` validation contracts remain. `AGENTS.md`, `REVIEW_PROTOCOL.md`, status, README, and the PR body state that shape validation is not accepted-history provenance.

4. `PASS — The primary insertion self-certification defect was materially repaired.` `canonicalInsertedTasks` reads `state.firstNightTaskInsertions`, validates each generation-specific accepted payload, reconstructs tasks with `scheduledTaskFromFirstNightTaskInsertedPayload`, passes the reconstructed tasks to runtime-plan validation, and requires exact equality with runtime gained tasks. It no longer generates its expected inserted-task set by merely filtering the plan.

5. `PASS — Canonical identifier grammar is stricter.` Base, V1, and V2 task IDs are parsed into distinct generations. Task type, embedded seat, embedded role, grant role segment, provenance kind, and formatted ability-instance identity receive structural cross-checks, and direct parser tests reject V1/V2 ID mixing.

6. `BLOCKER — The complete accepted grant/opportunity subgraph required by the rescope is still not independently enforced or tested.` In `instanceFor`, the original Philosopher opportunity is selected by ID and checked for source player, seat, and revision, but its `taskId`, opportunity kind/type/status, and exact Philosopher task/source contract are not checked there. The user-required case “mismatched opportunity task is rejected” has no ledger-chain test. Full accepted replay normally protects this through earlier event validation, but PR/status claims that the retained ledger adapter itself completes and directly proves the full task–insertion–grant–opportunity chain. That stronger claim is not demonstrated.

7. `BLOCKER — The existing-ledger anchor check does not reject the expressly required anchor-event-ID tampering case.` `applyFirstNightAbilityOutcomeLedger` checks anchor game ID, rules baseline, and lower sequence boundary, but it has no retained canonical source against which to re-check `firstNightInitializedEventId`, and it does not reject a nonempty altered anchor event ID in a supplied predecessor state. Only initial creation copies the envelope ID. The rescope explicitly requires direct rejection of altered anchor event ID and sequence; only shape validation and the at/before-boundary case are tested.

8. `PASS — Terminal append re-derives exact facts.` The wrapper applies the existing terminal event validation first, derives from terminal pre-state, derives the expected fact again, requires canonical equality, rejects duplicate fact identity, validates the appended ledger, and changes no accepted event or payload contract.

9. `PASS — Frozen emitted classifications inspected remain consistent.` Effective Witch pending is `NORMAL`; impaired Witch is `PENDING_TRIGGER`; ineffective Snake Charmer distinguishes historical non-Demon `NORMAL`, Demon `ABNORMAL`, and insufficient target truth `UNRESOLVED`; Dreamer retains normal truth, impaired-false abnormality, proven-Vortox unresolved, and unproven-applicability unresolved behavior. No unsupported Cerenovus impaired event is invented.

10. `PASS — Count and delivery rescope did not change BOTC rules or overrides.` The four Mathematician override records are byte-identical to their recorded evidence hash. The retained ledger classifications follow the frozen Design 3.2 policy, and no new override or conflicting interpretation was introduced.

11. `BLOCKER — The mandatory direct adversarial test contract is substantially incomplete.` The rescope requires 59 enumerated checks. The dedicated ledger suite contains 15 tests. It directly covers structural shapes, selected ID mixing, canonical evidence ordering/conflicts, hostile values, lower anchor boundary, the Snake matrix, and part of Dreamer/Vortox. It does not directly cover, among other required cases:
   - accepted base Mathematician, gained V1, and gained V2 canonical chains;
   - V1-plan/V2-insertion and V2-plan/V1-insertion rejection;
   - missing/duplicate insertion, grant, and opportunity records;
   - mismatched opportunity task;
   - forged runtime gained task without insertion;
   - tampered catalog signature, order, task class, or settlement policy through the ledger adapter;
   - altered anchor event ID/sequence;
   - source or target roster player/seat mismatch at ledger derivation;
   - later character changes preserving earlier facts;
   - Clockmaker drunk/Vortox and missing/wrong impairment cross-links;
   - Dreamer impairment-kind mismatch;
   - Seamstress wrong-answer impairment/Vortox chains;
   - Cerenovus choice/marker/role/target mismatch chains;
   - cross-platform identical canonical-ledger output.
   The three added rebuild assertions cover Witch and Dreamer happy paths only. Existing role tests validate their underlying accepted payloads but do not replace the required ledger-fact/canonical-evidence adapter tests.

12. `BLOCKER — PR rule-to-test traceability and status claims overstate the executed evidence.` The PR says `rebuild.test.ts` proves accepted insertion reconstruction, plan self-certification rejection, malformed insertion/runtime plans, deterministic ledger replay, and later-state preservation. The PR diff adds no such rebuild tests; it adds only three terminal ledger assertions. The status similarly claims direct Clockmaker, Seamstress, Cerenovus, V1/V2 subgraph, anchor, and roster evidence that is absent. The exact-head 938-test green result cannot substitute for the explicitly required rule-to-test links.

13. `PASS — Projection non-leakage is directly guarded.` Player and AI projection tests inject ledger sentinels and verify that the ledger, fact ID, and evidence are absent. No production projection path reads the new ledger.

14. `PASS — No main test weakening was found.` Relative to base main, changed existing test files add assertions; no base-main test was removed. Resolver/count-only PR tests were removed as allowed by the rescope, although their required replacement coverage remains incomplete as described above.

15. `PASS — Hostile structural inputs covered by the dedicated suite fail closed.` Getters, revoked proxies, sparse arrays, cycles, symbols, non-plain objects, missing/extra evidence keys, duplicate conflicting identities, noncanonical IDs, and out-of-order/duplicate facts are rejected in the inspected structural paths.

16. `PASS — Exact-head CI provenance is valid but does not close the missing-contract findings.` Push run `29218907974` and PR run `29218909579` both completed successfully for the reviewed SHA. The Windows job does not directly execute the dedicated ledger suite or compare an identical canonical ledger fixture with Ubuntu, so the explicit cross-platform ledger-equivalence requirement remains unproven.

codeVerdict: `CODE_REVIEW_FIX_REQUIRED`

ruleVerdict: `RULE_REVIEW_FIX_REQUIRED`

remainingBlockers:

- Complete or accurately narrow the retained task–insertion–grant–opportunity contract: specifically bind the original Philosopher opportunity’s task/kind/status/source contract, and directly prove rejection of a mismatched opportunity task and the other required V1/V2 subgraph corruptions.
- Enforce and directly test the required canonical anchor-tampering boundary, including altered `firstNightInitializedEventId` and altered start sequence, without representing standalone shape validation as provenance.
- Add the missing direct adversarial ledger tests required by the approved rescope, especially base/V1/V2 accepted chains, insertion/grant/opportunity failures, roster/anchor binding, Clockmaker, Dreamer impairment mismatch, Seamstress, Cerenovus, later-state immutability, and cross-platform canonical-ledger equivalence.
- Correct the PR body, implementation status, and coverage-matrix traceability claims so they describe only contracts actually enforced and directly tested.
