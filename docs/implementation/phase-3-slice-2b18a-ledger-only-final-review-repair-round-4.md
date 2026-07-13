reviewedPR: `#23`

reviewedHead: `65121bb4c057e125f0304ff826970ae95427fee3`

reviewTimestamp: `2026-07-13T04:16:35.6048891Z`

reviewScope:

- Independent read-only final review of PR #23 against base `89143b56ba7cb2e8c6aa6a2ce97c7a5dbe82794f`.
- Reviewed the complete production, test, documentation, and control-state diff.
- Re-read the updated PR body and exact-head CI records.
- Independently checked the applicable user overrides, official BOTC Wiki revisions, user-specified Chinese Wiki revisions, and pinned official nightsheet.
- Evaluated only the authorized Slice 2B18A ledger-only repair-round-4 scope. No 2B18B or 2B19 behavior was treated as required.

productionFilesReviewed:

- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/event-stream-validator.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/witch.ts`
- `packages/domain-core/src/cerenovus.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/evil-twin.ts`
- `packages/domain-core/src/player-roster.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/application/src/game-application-service.ts`
- Relevant application and projection consumers were searched for ledger business reads, public exports, and private-data leakage.

testFilesReviewed:

- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- Relevant pre-existing Philosopher, Snake Charmer, Witch, Cerenovus, Clockmaker, Dreamer, Seamstress, roster, replay, and task-plan tests.
- `.github/workflows/ci.yml` and package validation scripts.

ruleEvidenceReviewed:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B18.md`
- `docs/rules/evidence/2B18-resolved.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md`
- `docs/implementation/phase-3-slice-2b18a-ledger-only-rescope.md`
- `docs/implementation/phase-3-slice-2b18a-ledger-only-scope-review-round-1.md`
- `docs/implementation/phase-3-slice-2b18a-ledger-only-scope-review-round-2.md`
- `docs/implementation/phase-3-slice-2b18a-ledger-only-final-review-repair-round-3.md`
- `docs/implementation/phase-3-slice-2b18a-status.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- Official BOTC Wiki revisions: Mathematician `3109`, States `1039`, Vortox `3017`, Philosopher `2421`, Snake Charmer `2905`, Witch `2682`, Cerenovus `3048`, Clockmaker `2967`, Dreamer `2904`, Seamstress `1999`, Evil Twin `3101`, and Abilities `1376`.
- User-specified Chinese Wiki revisions, including Mathematician `6214` and Philosopher `5125`.
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`; retrieved SHA-256 matched `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.
- Recorded hashes for `USER_OVERRIDES.md`, `2B18-resolved.md`, the ledger-only rescope, and the prior final-review report were independently confirmed.
- Official first-night order was independently checked: Philosopher 13, Snake Charmer 36, Evil Twin 40, Witch 41, Cerenovus 42, Clockmaker 59, Dreamer 60, Seamstress 61, Mathematician 76, dawn 77.

findings:

1. `BLOCKER — The gained-role terminal opportunity’s source revision is still not canonically bound to the retained Philosopher chain.`

   In `opportunityEvidenceFor`, `sourceCharacterStateRevision` is accepted whenever it is positive and no later than the current character-state revision. The fact validator similarly requires only:

   `terminalOpportunity.sourceCharacterStateRevision <= fact.evaluatedCharacterStateRevision`

   The gained-chain validation binds the original Philosopher opportunity, choice, grant, insertion, task source, and ability-instance provenance to one revision, but it never requires the gained-role terminal action opportunity to use that same revision.

   Consequently, a constructed pre-terminal state can keep the task source, grant, insertion, original Philosopher opportunity, and ability-instance provenance on one valid in-range revision while placing the gained-role terminal opportunity on a different earlier in-range revision. The ledger adapter’s generic upper-bound checks do not reject that mismatch.

   This conflicts directly with the round-4 contract requiring task source, action opportunity, grant, insertion, player, seat, role, and revision to be mutually consistent for gained V1 and V2 chains.

2. `BLOCKER — R4-22 does not prove the missing exact revision relationship.`

   `[R4-22] rejects a gained-role opportunity source revision mismatch` changes the fixture’s revision from `1` to `2` while the evaluated/current revision remains `1`. It therefore fails the existing future-revision upper bound. It does not demonstrate rejection of an earlier but still in-range revision that disagrees with the grant/insertion/task-source revision.

   The V2 adversarial group likewise checks insertion, generation, grant identity, catalog, order, class, settlement policy, opportunity task identity, and role segment, but does not directly prove exact gained-role opportunity revision binding.

   Because the authorized repair explicitly requires direct ledger-adapter evidence rather than relying on earlier accepted-event validation, the green underlying role tests do not close this gap.

3. `PASS — FirstNightInitialized provenance and anchor tamper resistance are materially enforced.`

   Ledger creation records internal provenance from the unique accepted initialization envelope. Subsequent application requires immutable equality between the anchor and retained provenance. Rebuild checks the unique initialization envelope against the retained anchor and provenance, and event-stream validation rejects duplicate initialization. The direct anchor mutations cover event ID, sequence, game, baseline, premature ledger presence, duplicate initialization, and later replacement attempts.

4. `PASS — The retained ledger remains derived audit state rather than accepted-history provenance or business-decision input.`

   Terminal facts are re-derived from the pre-event state and compared canonically before append. No public root export exposes the derivation/application functions as a caller-supplied accepted-history certification API. No application business path was found reading the ledger to decide gameplay.

5. `PASS — The ledger-only rescope remains intact.`

   No public or internal Mathematician true-count resolver, count-resolution result, resolving context, count-window snapshot, runtime override carrier, number selection, information delivery, projection, or settlement implementation was found. `MATHEMATICIAN_INFORMATION` continues to fail closed without event, receipt, settlement, or version advancement.

6. `PASS — Anchor, roster, identity grammar, deterministic replay, projection non-leakage, and supported classification coverage are otherwise directly exercised.`

   Base, V1, and V2 identity grammars are distinct; insertions reconstruct canonical runtime tasks; duplicate/conflicting evidence fails closed; canonical ordering is deterministic; repeated rebuild and payload-key reordering retain equal ledgers; player and AI projections exclude injected ledger sentinels. No base-main test weakening was found.

7. `PASS — Rule semantics and source revisions remain unchanged.`

   The four user-approved Mathematician overrides are unchanged. No Witch, Dreamer/Vortox, drunkenness, poisoning, character-change, alignment-change, or Storyteller-discretion rule was newly simplified or reclassified. Role coverage remains `PARTIAL` or `SKELETON`; no role is incorrectly marked `COMPLETE`.

8. `PASS — Dynamic PR and CI provenance are current and exact.`

   At readback, local HEAD, remote feature HEAD, and PR #23 HEAD all equaled `65121bb4c057e125f0304ff826970ae95427fee3`; the worktree was clean. PR #23 was open, non-draft, mergeable, and `CLEAN`. Push CI `29222876582` and pull-request CI `29222877872` both succeeded for that exact SHA, including Ubuntu and Windows jobs. The PR body accurately records these results and states that independent review is still in progress.

9. `FAIL — The PR’s complete opportunity-binding claim remains broader than the implementation and direct tests.`

   The PR claims that Philosopher-gained V1/V2 facts bind the complete gained-role opportunity chain and that source revision is covered by `[R4-22]`. Because the retained adapter permits the in-range mismatch described above, that rule claim and traceability statement are not yet accurate.

codeVerdict: `CODE_REVIEW_FIX_REQUIRED`

ruleVerdict: `RULE_REVIEW_FIX_REQUIRED`

remainingBlockers:

- Require the gained-role terminal action opportunity’s `sourceCharacterStateRevision` to equal the canonical revision carried by the gained task source, grant, insertion, original Philosopher chain, and ability-instance provenance, while preserving any explicitly supported task-specific N/M historical semantics such as Seamstress V2.
- Add direct V1 and V2 ledger-adapter adversarial cases proving that an in-range stale/mismatched gained-role opportunity revision is rejected; do not rely only on the existing future-revision upper-bound failure.
- Narrow the PR/status/matrix claim if the exact relationship is intentionally unsupported. Otherwise, the current “complete canonical opportunity binding” claim remains unproven.

Under `USER_AUTHORIZED_2B18A_LEDGER_ONLY_FINAL_REPAIR_ROUND_4`, no fifth repair round is authorized. Because both pass verdicts were not returned, the controller must stop and transition the goal to `HUMAN_BLOCKED`.
