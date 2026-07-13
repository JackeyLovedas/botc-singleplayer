# PR 23 Final Code Review Archive

- PR: [#23](https://github.com/JackeyLovedas/botc-singleplayer/pull/23)
- Frozen feature HEAD: `671622b9f368a6201840ea0cb3d5b8254065bff8`
- Merge SHA: `00a12062e2dc7a99ef01b2fbddc3a5dc4d666fa6`
- Original comment: [4954799981](https://github.com/JackeyLovedas/botc-singleplayer/pull/23#issuecomment-4954799981)
- Created: `2026-07-13T05:43:30Z`
- Updated: `2026-07-13T05:46:58Z`
- Exact original UTF-8 body SHA-256: `eb5b5ad26848a78a51ec59467dc2e56170601b9fbdd6c5932e561f1262b6ef6e`
- Exact original body bytes: `12180`

## Verbatim Original Comment Body

The exact body is the byte sequence after the LF terminating the BEGIN delimiter and before the LF introducing the END delimiter.

----- BEGIN EXACT ORIGINAL COMMENT BODY -----
<!-- BOTC_FINAL_CODE_REVIEW
reviewedHead=671622b9f368a6201840ea0cb3d5b8254065bff8
-->
reviewedPR: `#23` — `https://github.com/JackeyLovedas/botc-singleplayer/pull/23`

reviewedHead: `671622b9f368a6201840ea0cb3d5b8254065bff8`

reviewTimestamp: `2026-07-13T05:37:54.8394911Z`

reviewScope:

- Independent read-only final review of PR #23 against base main `89143b56ba7cb2e8c6aa6a2ce97c7a5dbe82794f`.
- Reviewed the complete base-to-HEAD production, test, documentation, and control-state diff, with focused re-review of the user-authorized repair-round-5 gained-opportunity revision microfix.
- Re-read the complete current PR body, all seven review threads, PR state, exact feature HEAD, and exact-head CI.
- Independently checked the applicable user overrides, resolved and historical rule evidence, live pinned external rule sources, official nightsheet, immutable ledger-only authorities, prior round-4 final review, and current role coverage matrix.
- Verified no new BOTC interpretation, override, Slice 2B18B, Slice 2B19, Mathematician count resolver, number delivery, private projection, or settlement was introduced.
- Independently reran the four directly affected suites: ledger, rebuild, application, and projection; `4 files / 531 tests` passed.

productionFilesReviewed:

- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/event-stream-validator.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/player-roster.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/witch.ts`
- `packages/domain-core/src/cerenovus.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/evil-twin.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/private-knowledge-view.ts`

testFilesReviewed:

- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `.github/workflows/ci.yml`
- `package.json`
- `vitest.workspace.ts`

ruleEvidenceReviewed:

- `AGENTS.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B18.md`, SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`
- `docs/rules/evidence/2B18-resolved.md`, SHA-256 `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md`, SHA-256 `615f4cb303cbcb6884f37cf6f46eb6733e1df631c68a9a3fa9085da26134d865`
- `docs/implementation/phase-3-slice-2b18a-ledger-only-rescope.md`, SHA-256 `3415944f1a42bcaee8f0a7a990a6d8d148ad0169fea0a9e4697acfbfc9f44b44`
- `docs/implementation/phase-3-slice-2b18a-ledger-only-scope-review-round-2.md`, SHA-256 `00177a72d33d9be71e3c281edaea908dd2e98b49509c6aa8d257260fc719967a`
- `docs/implementation/phase-3-slice-2b18a-ledger-only-final-review-repair-round-4.md`, SHA-256 `d5a8c728070a34faf931ec2a1c913fb21c6680d62cf125c6dc769237be381ae1`
- `docs/implementation/phase-3-slice-2b18a-status.md`
- Official BOTC Wiki revisions: Mathematician `3109`, States `1039`, Vortox `3017`, Philosopher `2421`, Snake Charmer `2905`, Witch `2682`, Cerenovus `3048`, Clockmaker `2967`, Dreamer `2904`, Seamstress `1999`, Evil Twin `3101`, and Abilities `1376`
- User-specified Chinese Wiki Mathematician revision `6214`
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`; retrieved SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- Official first-night order independently confirmed: Philosopher `13`, Snake Charmer `36`, Evil Twin `40`, Witch `41`, Cerenovus `42`, Clockmaker `59`, Dreamer `60`, Seamstress `61`, Mathematician `76`, dawn `77`

findings:

1. `PASS — The round-4 exact gained-opportunity revision blocker is closed at canonical derivation.`

   `instanceFor` first validates the unique gained task, Philosopher choice, grant, generation-specific recorded insertion, closed original Philosopher opportunity, task/role/seat identities, and their shared historical revision. Before terminal `ACTION_OPPORTUNITY` evidence is generated, the internal non-exported helper requires the gained V1/V2 ability-instance revision to equal the task-source revision and requires the terminal gained-role opportunity revision to equal that same canonical revision. The failure uses `InvalidFirstNightAbilityOutcomeEvidence` with the stable reason `Gained terminal opportunity revision must equal canonical Philosopher grant revision`.

2. `PASS — The complete canonical revision chain is exact without being tied to the later evaluation revision.`

   Existing canonical-source validators bind:

   - gained scheduled-task source;
   - `PhilosopherAbilityChosen`;
   - `PhilosopherAbilityGranted`;
   - V1 or V2 `FirstNightTaskInserted`;
   - original Philosopher action opportunity;
   - gained ability-instance provenance.

   The round-5 helper adds the terminal gained-role opportunity before evidence creation. Generated `PHILOSOPHER_GRANT` and `ACTION_OPPORTUNITY` evidence retain that revision. The retained upper bound remains `canonicalGainedRevision <= evaluatedCharacterStateRevision`; no code requires equality with the later evaluated revision.

3. `PASS — Standalone fact cross-link validation enforces the same relationship honestly.`

   For `PHILOSOPHER_GAINED_TASK_V1` and `PHILOSOPHER_GAINED_TASK_V2`, fact-shape validation requires grant evidence and the original Philosopher opportunity evidence to match ability-instance provenance. When a terminal gained-role opportunity exists, its revision must also match that provenance. No revision field was invented for `FIRST_NIGHT_TASK_INSERTION` evidence; the real insertion revision remains a canonical pre-event validation responsibility. Shape validation is still not represented as accepted-history provenance.

4. `PASS — V1 directly proves the required N/M matrix.`

   `[R5-V1-POSITIVE]` succeeds with canonical gained revision `N=2` and evaluated revision `M=3`. `[R5-V1-STALE]` changes only the terminal gained opportunity to `K=1`; `[R5-V1-LATER]` changes only that field to `K=3`. Both values remain positive and within `M`, both forged standalone facts fail shape validation, both derivations fail with the specified stable mismatch reason, and restoration of the single changed field reproduces the exact baseline state.

5. `PASS — V2 directly proves the required N/M matrix.`

   `[R5-V2-POSITIVE]` succeeds with `N=2 < M=3`. `[R5-V2-STALE]` and `[R5-V2-LATER]` independently reject terminal revisions `1` and `3` while the validated V2 task/choice/grant/insertion/original-opportunity chain remains at `2`. These cases use a complete V2 application-derived fixture and prove the same standalone and canonical-derivation boundaries as V1.

6. `PASS — Future-revision coverage is retained separately.`

   `[R4-22] rejects a future gained-role opportunity revision` remains present and green. The suite therefore distinguishes future upper-bound failure from earlier in-range mismatch, later in-range mismatch, and valid historical `N < M`.

7. `PASS — The microfix is correctly confined to ordinary gained V1/V2 action opportunities.`

   The helper returns without applying a new equality rule to base `ROLE` tasks or non-gained provenance. Seamstress V2 is converted to `EXPLICIT_DOMAIN_INSTANCE` before terminal opportunity evidence validation and retains its role-tenure/ability-instance N/M semantics. Gained Clockmaker remains valid without a terminal action opportunity. Base Snake Charmer, Cerenovus, Dreamer, Clockmaker, gained V1/V2 Snake Charmer, and Seamstress V2 regressions all remain green.

8. `PASS — Ledger-only scope and fail-closed Mathematician behavior remain intact.`

   Repository and package-root scans found no public or internal true-count resolver, `MathematicianCountResolution`, resolving context, count-window snapshot, runtime override carrier, caller-supplied count decision API, number selection, `MathematicianInformationDelivered`, private count projection, or Mathematician settlement. `MATHEMATICIAN_INFORMATION` remains fail closed without receipt, domain event, settlement, or version advancement. Slice 2B18B and Slice 2B19 have not started.

9. `PASS — Rule truth and night order remain unchanged.`

   The four approved Mathematician simulator overrides were not modified by round 5. Live pinned official and Chinese sources remain consistent with the ledger classifications and the Philosopher gained-ability timing used by the existing authority. The pinned official nightsheet hash and role ordering match the recorded evidence. No Witch, Dreamer/Vortox, drunkenness, poisoning, character-change, alignment-change, death, or Storyteller-discretion interpretation was changed.

10. `PASS — PR and coverage traceability now match the implementation.`

   The current PR body contains all required sections: `Rule Evidence`, `Rule Claims Implemented`, `Explicitly Unsupported Rules`, `Rule Source Revisions`, and `Rule-to-Test Traceability`. It identifies all six R5 tests and retained R4-22, limits claims to the ledger foundation, records the exact frozen HEAD and both successful CI runs, and states that independent review is in progress. The status and role matrix retain `PARTIAL / UNACCEPTED / RUNNING`, explicitly preserve unsupported count/delivery/settlement behavior, and mark no role `COMPLETE`.

11. `PASS — No test weakening, nondeterministic identity, or projection leakage was introduced.`

   Relative to base main, no test file was deleted. The changed test files add a net `774` lines. The round-5 commit adds six direct tests without deleting prior coverage. `git diff --check` passes. No new `localeCompare`, `Intl.Collator`, `Math.random`, canonical `Date.now`, random UUID, raw `JSON.stringify` semantic comparison, or sparse-array `every` validation was introduced. Player and AI projection tests continue to exclude ledger sentinels.

12. `PASS — Historical GitHub review threads do not leave a current blocker.`

   All seven automated review threads are outdated and refer to superseded code. Nested insertion evidence is now exact-shape validated; ability-instance identities cross-link their provenance; exclusive anchor ordering is enforced; impaired non-Demon Snake Charmer classification is corrected; and the three count-resolver findings were eliminated by the approved ledger-only rescope. No current issue comment or final audit comment exists before this review, as required.

13. `PASS — Exact-head validation and repository state satisfy the pre-publication gate.`

   Local HEAD, remote feature HEAD, and PR HEAD all equal `671622b9f368a6201840ea0cb3d5b8254065bff8`; the worktree is clean. PR #23 is open, non-draft, and mergeable. Push CI `29226220051` and pull-request CI `29226221291` both completed successfully for that exact SHA. Ubuntu executed typecheck, lint, all `29 files / 986 tests`, and coverage; Windows executed the deterministic setup, assignment, knowledge, projection, task, role-action, Philosopher, Snake Charmer, Evil Twin, Witch, Dreamer, and Clockmaker suites. Coverage reports `86.35%` statements/lines, `81.20%` branches, and `97.57%` functions.

codeVerdict: `CODE_REVIEW_PASS`

ruleVerdict: `RULE_REVIEW_PASS`

remainingBlockers: []
----- END EXACT ORIGINAL COMMENT BODY -----
