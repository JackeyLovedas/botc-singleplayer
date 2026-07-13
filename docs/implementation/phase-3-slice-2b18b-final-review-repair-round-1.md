reviewedPR: `#24` — `https://github.com/JackeyLovedas/botc-singleplayer/pull/24`

reviewedHead: `8b273eec34502906d6c2aa12031c4065ec97725c`

reviewTimestamp: `2026-07-13T13:09:20.0560300Z`

reviewScope:

- Independently reviewed the frozen PR head against base `8e0555b445de9ad65fd96dc43b1fa4ec1ceb51b9`.
- Verified the worktree is clean, the remote PR head equals `reviewedHead`, PR #24 is open and mergeable, and no later commit exists.
- Reviewed all changed production, test-support, rule-matrix, implementation-status, traceability, and agent-control files.
- Reviewed the complete PR body and its five required rule-consistency sections.
- Independently checked the official Mathematician, Philosopher, States, and Vortox rule material, the recorded Chinese Wiki material, the user-approved overrides, both 2B18B evidence documents, the official nightsheet, the Round 3 implementation authority, the Round 3 design review, and the role coverage matrix.
- Verified exact-head push CI `29251259989` and pull-request CI `29251425251`; both completed successfully for `reviewedHead`.
- Performed a read-only review. No repository, branch, PR, or GitHub state was modified.

productionFilesReviewed:

- `packages/application/src/command-result.ts`
- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/command.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/mathematician-internal.ts`
- `packages/domain-core/src/mathematician.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/projections/src/index.ts`

testFilesReviewed:

- `packages/application/src/mathematician-information.test.ts`
- `packages/application/src/mathematician-test-fixtures.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/philosopher-ability.test.ts`
- `packages/domain-core/src/clockmaker.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- Exact-head CI evidence for the complete `30 files / 1397 tests` suite and deterministic cross-platform job was also reviewed.

ruleEvidenceReviewed:

- `docs/rules/USER_OVERRIDES.md`, recorded SHA-256 `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`.
- `docs/rules/evidence/2B18B.md`, SHA-256 `eae53e0eed5d54c5c4a78d31543749787359f61b2e9b7c3f0ceb27069d2471c1`.
- `docs/rules/evidence/2B18B-resolved.md`, SHA-256 `0c4893de8f38dfc05876f89744976a7c54afc6bd41465f2e1198d22b0844a4c8`.
- `docs/implementation/phase-3-slice-2b18b-design-round-3.md`, SHA-256 `066be05f5ee8c0fccb83b00fd8471e439e7e6d2c8c8366af8c86aebceac0a792`.
- `docs/implementation/phase-3-slice-2b18b-design-review-round-3.md`, SHA-256 `a05dc0fcb3959863448620b7b064bef38db95987b92708475f77eaf34e308808`.
- `docs/rules/ROLE_COVERAGE_MATRIX.md`.
- Official BOTC Wiki Mathematician revision `3109`, Philosopher revision `2421`, States revision `1039`, and Vortox revision `3017`.
- User-specified Chinese Wiki revisions recorded in the evidence: Mathematician `6214`, Philosopher `5125`, and Vortox `6198`. The direct live API rejected the independent request, but current indexed page material was available and corroborated the relevant interaction rule.
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`. Fixed and current bytes matched. The verified first-night order places Mathematician immediately before Dawn.
- No external rule conflict was found. Option A remains an explicit implementation-support boundary rather than an official-rule claim, and Mathematician correctly remains `PARTIAL`.

findings:

1. `[PASS] Frozen-head and scope integrity`

   PR #24 points to the exact reviewed head, the worktree is clean, no deleted tests or prohibited nondeterministic ID/ordering calls were found in changed production files, and Slice 2B19 was not started. Both exact-head GitHub workflow runs are green. The commit contains the required `Co-Authored-By: Codex GPT-5 <noreply@openai.com>` trailer.

2. `[PASS] External rule baseline and high-level slice boundary`

   The official rule material supports counting players whose abilities malfunctioned because of another character, excluding the Mathematician’s own ability, and treating drunk/poisoned-but-correct information as non-malfunctioning. The verified nightsheet supports the implemented first-night position. The PR does not claim other-night, Traveller, unrestricted Storyteller-discretion, or general poisoning-engine support, and the coverage matrix remains `PARTIAL`.

3. `[BLOCKER] The mandatory branded canonical context architecture was not implemented`

   Round 3 requires a private `CanonicalMathematicianContext` branded with a unique symbol, obtainable only through `buildContextFromAcceptedEventStream` and `buildContextFromReplayPreEventState`. Layer A and Layer C must share the pure derivation only through that branded context.

   None of the required context type, brand, or builders exists in production. Instead, `packages/domain-core/src/mathematician-internal.ts:589` implements `resolveFromState(state: GameState, taskId)`, exports `resolveMathematicianInformationFromStateForInternalValidation` at line 628, and has both accepted-stream and replay paths call the raw-state resolver directly. This leaves a caller-created `GameState` resolution seam and does not satisfy the reviewed security boundary.

4. `[BLOCKER] Layer B’s exact result contract is missing`

   The frozen authority requires:

   - success with `prospectiveStateFingerprint`;
   - failure with one closed `code` from the five specified literals plus `reason`.

   `packages/domain-core/src/mathematician-internal.ts:670` instead defines only `{ valid: true } | { valid: false; reason: string }`. The validator therefore neither returns the required fingerprint nor exposes the closed failure classification needed to distinguish expected-decision, settlement, batch, stream, and rebuild failures.

5. `[BLOCKER] `MathematicianDeliveryEvidence` identity and exact-shape validation are weaker than the frozen contract`

   `packages/domain-core/src/first-night-ability-outcome-ledger.ts:102` declares `deliveryId: string`, `trueCount: number`, and `selectedCount: number`, rather than `MathematicianDeliveryId` and `MathematicianCount`.

   Its standalone validator at line 251 accepts any non-empty delivery ID and checks only numeric range. It does not perform the required canonical delivery-ID parse/round-trip, task/generation binding, source binding, or terminal-event/source-event identity validation. Consequently malformed or conflicting evidence can pass shape validation even though later replay paths may reject some instances. The design explicitly says shape validation is not a substitute for accepted-history provenance.

6. `[BLOCKER] The frozen Mathematician evidence-slot ordering and branch matrix were not implemented`

   Round 3 requires a Mathematician-specific 13-slot canonicalization branch while leaving existing non-Mathematician ordering unchanged.

   `packages/domain-core/src/first-night-ability-outcome-ledger.ts:261` continues to sort every evidence array solely by the global evidence-kind rank and primary identity. There is no Mathematician-specific branch. This cannot enforce the required distinction and order between source role/tenure/impairment evidence and Vortox role/tenure/impairment evidence.

   In addition, the `NONE_CURRENT_VORTOX_KNOWN_IMPAIRED` branch is materially incomplete. Lines 530–534 add source impairment evidence and add Vortox role/tenure only for `VORTOX_FALSE_REQUIRED`. They never add the known-impaired Vortox’s role, active tenure, or represented Vortox impairment. The frozen branch matrix requires all three. The resulting terminal fact loses the historical proof that Vortox was present but impaired.

7. `[BLOCKER] Source and Vortox impairment applicability is not tenure-bounded`

   In `packages/domain-core/src/mathematician-internal.ts:427`, source effectiveness accepts an impairment whenever player, seat, role ID, and `sourceCharacterStateRevision <= settlementCharacterStateRevision` match. It does not require the impairment revision to fall inside the carried source tenure or prove the same tenure remained active through settlement.

   The Vortox calculation at lines 441–460 has the same defect: it finds the current Vortox tenure but accepts any earlier matching impairment revision without proving that the impairment belongs to that tenure interval.

   A stale impairment from an earlier tenure can therefore alter the current Mathematician or Vortox result. This violates the frozen historical-tenure contract and can change whether the selected number must be true or false.

8. `[BLOCKER] Target validation occurs after the Option A unsupported return`

   Round 3 freezes the internal order as target existence/type first, then complete inventory and Option A classification, followed by settled/next/source checks.

   `packages/domain-core/src/mathematician-internal.ts:589–610` builds and classifies the inventory and returns `UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER` before looking up the requested task. Therefore, in a V1 base-plus-gained history, a command containing a syntactically valid but nonexistent Mathematician task ID receives receipt-free `ApplicationNotConfigured` instead of the required receipt-bearing `ScheduledTaskNotFound` rejection.

9. `[BLOCKER] Public payload validators do not fully freeze required canonical identity and ordering`

   `packages/domain-core/src/mathematician.ts:343–353` checks only nondecreasing seat numbers for `distinctAbnormalPlayers`. It does not enforce player-ID code-unit ordering for equal seats or code-unit ordering of each `supportingFactIds` array.

   The `validVortox` branch at lines 322–339 validates the general role and impairment shapes but does not bind the carried tenure player/seat to the carried Vortox player/seat, nor bind the represented impairment’s affected player/seat and role snapshot to that Vortox identity. Later canonical recomputation catches some accepted-stream tampering, but the required exact public payload contract itself is not enforced.

10. `[BLOCKER] Claimed rule-to-test traceability does not cover the mandatory contracts above`

    The dedicated suite contains strong integration, hostile replay, candidate, V1/V2, and projection coverage, and exact-head CI is green. However, its Layer A/B/C tests verify function arity and selected source-text properties rather than the required branded-context construction. No production occurrence of `CanonicalMathematicianContext`, `buildContextFromAcceptedEventStream`, `buildContextFromReplayPreEventState`, or the unique-symbol brand exists.

    No test covers the required known-impaired Vortox evidence triple or stale-impairment rejection across tenure boundaries. Existing tests also accept `{ valid: true }` from Layer B, directly freezing the weakened result contract. Therefore the assertion that all 224 locally executable authority IDs are covered with zero gaps is not supported by the implementation.

11. `[BLOCKER] Frozen control documentation and PR traceability do not describe the actual reviewed state`

    The committed control documents still say there is no commit, push, PR, product-head CI, or final review and that the next action is to create the PR:

    - `docs/agent-loop/AUTOPILOT_STATE.json:2–4,64–66,771`
    - `docs/agent-loop/CURRENT_TASK.md:33–36`
    - `docs/agent-loop/PROJECT_STATE.md:6–18`
    - `docs/implementation/phase-3-slice-2b18b-status.md:3–32`

    The PR body likewise leaves `Original-140` as `EXTERNAL_GATE_PENDING`, although exact-head push and pull-request CI have completed successfully. This contradicts the requirement that all documentation and the complete PR body be finalized before freezing the feature branch for independent review.

codeVerdict: `CODE_REVIEW_FIX_REQUIRED`

ruleVerdict: `RULE_REVIEW_FIX_REQUIRED`

remainingBlockers:

- Implement the exact private branded `CanonicalMathematicianContext` and the two authorized builders; remove the raw caller-created `GameState` resolution seam.
- Implement Layer B’s exact closed result union and prospective-state fingerprint contract.
- Strengthen `MathematicianDeliveryEvidence` types and validation to enforce canonical delivery identity and every required cross-link.
- Add the Mathematician-specific evidence canonicalization branch and enforce the complete source/Vortox branch matrix.
- Record the required role, active tenure, and represented impairment evidence for `NONE_CURRENT_VORTOX_KNOWN_IMPAIRED`.
- Make source and Vortox impairment applicability depend on the correct continuous tenure interval.
- Validate requested task existence/type before returning the Option A unsupported boundary.
- Enforce canonical same-seat player ordering, supporting-fact ordering, and complete Vortox identity cross-links.
- Add regressions for every repaired contract and correct the zero-gap traceability claim.
- Synchronize the control documents and PR body with PR #24, frozen head `8b273eec34502906d6c2aa12031c4065ec97725c`, and exact-head CI provenance before a new freeze and independent review.