## reviewedPR

- PR: `#18`
- URL: `https://github.com/JackeyLovedas/botc-singleplayer/pull/18`
- Base: `main`
- Branch: `phase-3/cerenovus-first-night-madness-marker`
- State: open, non-draft, mergeable
- Local worktree: clean
- Local, remote, and PR HEAD were independently confirmed equal.

## reviewedHead

`45aabfe825d45329a80a178a943cce3bb6491ce1`

## reviewTimestamp

`2026-07-11T13:20:27+08:00`

## reviewScope

- Complete PR body and `main...45aabfe825d45329a80a178a943cce3bb6491ce1` diff: 32 files, 3,525 insertions, 1,151 deletions.
- Every changed production, test, rule-evidence, design, review, status, coverage-matrix, and controller document.
- Command validation, actor policy, opportunity creation, tenure and ability-instance identity, capability authority, event construction, replay, integrated batches, prospective validation, receipts, idempotency, private projection, hostile inputs, determinism, and historical-state behavior.
- All four prior final-review blockers.
- Full PR rule-to-test traceability, including whether each named test’s assertions actually cover its claimed behavior.
- User overrides, official and Chinese fixed rule revisions, and live official nightsheet.
- Exact frozen-HEAD CI:
  - Push run `29140790900`: success, head SHA matched.
  - Pull-request run `29140792281`: success, head SHA matched.
  - Both Ubuntu validation and Windows deterministic jobs succeeded.
- Independent focused execution:
  - Five files passed.
  - 293 tests passed.
  - Worktree remained clean.
- `git diff --check`: passed.

## productionFilesReviewed

1. `packages/application/src/command-result.ts`
2. `packages/application/src/game-application-service.ts`
3. `packages/domain-core/src/cerenovus.ts`
4. `packages/domain-core/src/command.ts`
5. `packages/domain-core/src/domain-batch-semantics.ts`
6. `packages/domain-core/src/errors.ts`
7. `packages/domain-core/src/event-applier.ts`
8. `packages/domain-core/src/events.ts`
9. `packages/domain-core/src/first-night-action-opportunity.ts`
10. `packages/domain-core/src/first-night-task-plan.ts`
11. `packages/domain-core/src/game-state.ts`
12. `packages/domain-core/src/index.ts`
13. `packages/domain-core/src/initial-private-knowledge.ts`
14. `packages/domain-core/src/seamstress.ts`
15. `packages/projections/src/index.ts`

## testFilesReviewed

1. `packages/application/src/game-application-service.test.ts`
2. `packages/domain-core/src/cerenovus.test.ts`
3. `packages/domain-core/src/cerenovus-replay.test.ts`
4. `packages/projections/src/cerenovus-private-knowledge.test.ts`
5. `packages/rules-snv/src/catalog.test.ts`

Related replay, batch, projection, receipt, task-plan, and deterministic CI coverage was also checked to determine whether another test supplied assertions missing from the named traceability tests.

## ruleEvidenceReviewed

Repository material:

1. `docs/rules/USER_OVERRIDES.md`
2. `docs/rules/evidence/2B16.md`
3. `docs/rules/ROLE_COVERAGE_MATRIX.md`
4. `docs/implementation/phase-3-slice-2b16-design.md`
5. `docs/implementation/phase-3-slice-2b16-effective-only-design-review.md`
6. `docs/implementation/phase-3-slice-2b16-final-review-round-1.md`
7. `docs/implementation/phase-3-slice-2b16-repair-round-1-design-review.md`
8. `docs/implementation/phase-3-slice-2b16-repair-round-1-design-revalidation.md`
9. `docs/implementation/phase-3-slice-2b16-status.md`
10. `docs/agent-loop/AUTOPILOT_LOG.md`
11. `docs/agent-loop/AUTOPILOT_STATE.json`
12. `docs/agent-loop/CURRENT_TASK.md`
13. `docs/agent-loop/PROJECT_STATE.md`
14. Complete current PR body

Verified artifact hashes:

- Evidence: `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`
- Current design: `743affb3d47d0a16fc25b849b1dbe97bf9af07c9ff000cd793a61a5268300a12`
- Renewed design review: `363271a48ae4f2595ef7287e850d8a38b4fa1b94e42f97b6b15b25d5de9da645`
- Targeted design revalidation: `643e1e1a5dee2030cf8205594f9a08a7f2415c514ea0466d35b988ec1874b34c`

External sources independently retrieved:

- Official Cerenovus revision `3048`
- Official States revision `1039`
- Official Glossary revision `2874`
- Official Abilities revision `1376`
- Official Storyteller Advice revision `2552`
- Official Character Types revision `1495`
- Official Goblin revision `2976`
- Official Vigormortis revision `3015`
- Official Vortox revision `3017`
- Chinese Cerenovus revision `4198`
- Chinese Madness revision `5883`
- Chinese Goblin revision `6148`
- Chinese Vortox revision `6198`
- Official live `nightsheet.json`

The retrieved revision timestamps, MediaWiki SHA-1 values, UTF-8 SHA-256 values, and nightsheet metadata matched the evidence. The nightsheet was 2,923 bytes with SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

Confirmed order:

- First night: `eviltwin → witch → cerenovus → fearmonger → harpy`
- Other nights: `devilsadvocate → witch → cerenovus → pithag → fearmonger`

No user override or external-source conflict exists. `PARTIAL` remains the correct coverage status.

## findings

1. **[BLOCKER] Canonical opportunity identity does not bind its encoded seat to the source seat.**

   `validateCerenovusActionOpportunityShape` verifies that the opportunity ID has canonical Cerenovus syntax and parses its task type, but does not require `parsedId.seatNumber === sourceSeatNumber`.

   Consequently, an opportunity such as:

   - ID containing `seat-02`
   - `sourceSeatNumber: 1`
   - tenure, ability source, ability instance, source role, task and choice all consistently using seat 1

   passes the standalone Cerenovus opportunity shape. `validateCerenovusChoiceAgainstState` binds the choice to that opportunity but never closes this encoded-seat mismatch. Stored projection validation therefore does not reject this class of tampered canonical state.

   This conflicts with the reviewed requirements for exact canonical opportunity identity, mismatched-seat opportunity rejection, and tampered canonical projection rejection.

   Required correction:

   - Bind the parsed opportunity-ID seat to `sourceSeatNumber`.
   - Add direct domain/replay/projection tests for a syntactically canonical Cerenovus ID whose embedded seat conflicts with opportunity, task, tenure and source facts.

2. **[BLOCKER] The exact-name traceability matrix still materially overstates direct regression coverage.**

   All 63 locally resolvable names exist, but several named tests do not assert the behavior their names and mapped rule claims promise:

   - `rejects every Cerenovus event reordering` checks only three adjacent swaps, not every reordering.
   - `rejects mismatched Cerenovus batch command version and sequence metadata` changes command ID, game version and one sequence, but never batch ID.
   - `rejects unrelated and forbidden lifecycle events mixed into a Cerenovus batch` appends a duplicate settlement; it does not exercise a phase/lifecycle event.
   - `rejects forged Cerenovus source provenance independently and in combination` changes only source player, seat and role. It omits direct replay mutations for tenure ID, ability source, ability instance, task and revisions.
   - `rejects stale closed mismatched duplicate and wrong-revision Cerenovus opportunities` covers closed, duplicate and current revision only; it does not directly mutate the opportunity’s source/role/seat bindings.
   - `rejects duplicate Cerenovus choice marker instruction settlement opportunity and task links` duplicates choice, marker, instruction and opportunity, but not settlement or task.
   - `rejects independently and jointly cross-linked Cerenovus source target catalog tenure ability marker and delivery facts` exercises only a forged recipient and one combined missing-tenure/changed-role case. It does not independently cover the listed source, catalog, tenure, ability-source, ability-instance, revision, marker and delivery links.
   - `keeps every Cerenovus metadata construction prospective and commit fault retryable without burning the command ID` tests batch-ID generation and pre-commit failure only. It does not cover each event metadata position, construction failure, or the full failure set claimed by design item 58.
   - `preserves Witch Evil Twin Dreamer and Seamstress behavior after Cerenovus repair` only checks that task definitions remain present; it does not execute those behaviors or verify projection stages.
   - The historical-state test changes the target to Vortox with evil alignment but does not directly test later source impairment or the broader historical-state combinations named in its trace claim.

   Green tests and literal name presence therefore do not establish the required rule-to-test traceability. Prior blocker 3 is only partially resolved.

3. **[BLOCKER] Canonical status and coverage documents are stale at the frozen HEAD and overstate completion.**

   At exact final HEAD:

   - `AUTOPILOT_STATE.json` still says `WAITING_CI`, `finalDocsHead: PENDING_THIS_BOOKKEEPING_COMMIT`, and exact-head CI pending.
   - `CURRENT_TASK.md`, `PROJECT_STATE.md`, and `phase-3-slice-2b16-status.md` still instruct the controller to create/push the bookkeeping commit and wait for CI, although the final commit and CI already exist.
   - `ROLE_COVERAGE_MATRIX.md` says source binding and stored-chain repair are pending.
   - The status document says all trace rows resolve, despite the assertion gaps above.

   These are current-truth and rule-coverage artifacts, not harmless historical reports. They must distinguish implemented behavior, remaining test gaps, final HEAD and completed CI accurately.

4. **[VERIFIED] The main provenance and capability-authority repair is implemented.**

   Choice validation now binds source player, seat, role snapshot, tenure, acquisition revision, ability source and ability-instance identity to the referenced opportunity and stored tenure. Application, integrated-batch and replay capability checks use `opportunity.sourcePlayerId`, preventing a forged payload source from bypassing actual-source impairment.

5. **[VERIFIED] Hostile primitive validation is substantially repaired.**

   Choice, marker and instruction validators check exact keys, primitive types, canonical opportunity-ID syntax and recipient-seat bounds before formatter use. The direct hostile values return invalid without throwing. The remaining defect is the semantic encoded-seat mismatch described in finding 1.

6. **[VERIFIED] Effective execution retains the reviewed bounded event contract.**

   Healthy application creates exactly:

   1. `CerenovusChoiceRecorded`
   2. `CerenovusMadnessMarked`
   3. `CerenovusMadnessInstructionDelivered`
   4. `ScheduledTaskSettled` with `CERENOVUS_MADNESS_MARKED`

   No impaired-resolution, Vortox, alignment-change, execution, death, phase-transition, removal, recurrence or fake impairment event was added.

7. **[VERIFIED] Generated-path projection privacy remains correct.**

   Only the selected target receives `selectedByCharacter`, `madAboutRoleId`, and `instructionWindow`. Source identity, tenure, ability instance, marker identity, impairment, effectiveness, execution and Storyteller internals remain hidden. Player and AI views share the same validated path.

8. **[VERIFIED] The corrected evidence satisfies the mandatory schema.**

   All mandatory headings are present. It records fixed source URLs/revisions/hashes, 27 sequential regression requirements, explicit drunkenness, poisoning, Vortox, character-change and alignment-change rules, storyteller discretion, unsupported mechanisms, no unresolved conflict, `PARTIAL`, and terminal `RULE_READY`.

   Prior blocker 4 is resolved.

9. **[VERIFIED] The external rule interpretation is sound and honestly scoped.**

   - Any player is a legal Cerenovus target.
   - Ordinary selected characters are on-script Townsfolk or Outsiders and may be out of play.
   - Drunk/poisoned simulation is real BOTC behavior but remains unsupported, not immunity.
   - Vortox false-information requirements apply to Townsfolk abilities; no sourced rule transforms this Minion marker/instruction chain.
   - Character type and alignment are independent.
   - Madness judgment and execution remain Storyteller-discretionary and unimplemented.
   - Other-night recurrence, lifecycle cleanup, Goblin jinx and Vigormortis handling remain unsupported.
   - Cerenovus remains `PARTIAL`.

10. **[VERIFIED] Exact-head CI is genuine but cannot substitute for the missing assertions.**

    Both push and pull-request runs used the exact frozen SHA and completed all required Ubuntu and Windows jobs successfully. The focused suites also pass independently. These successes do not exercise the omitted negative cases identified above.

## codeVerdict

`CODE_REVIEW_FIX_REQUIRED`

## ruleVerdict

`RULE_REVIEW_FIX_REQUIRED`

## remainingBlockers

```text
[
  "Bind the canonical Cerenovus opportunity ID's encoded seat to sourceSeatNumber and add direct malformed-semantic opportunity/replay/projection regressions.",
  "Replace the overbroad exact-name tests with genuinely exhaustive direct assertions, or narrow each rule/test claim honestly; specifically close replay ordering/metadata/lifecycle/provenance, projection duplicate/cross-link/historical-state, metadata-failure, and prior-role regression gaps.",
  "Synchronize AUTOPILOT_STATE, CURRENT_TASK, PROJECT_STATE, the Slice status document, PR traceability claims, and ROLE_COVERAGE_MATRIX with the actual frozen HEAD, completed CI, remaining gaps, and honest PARTIAL coverage.",
  "After repair, freeze a new exact HEAD, run fresh full and coverage gates plus exact-head Ubuntu/Windows CI, and obtain a new complete independent final code/rule review."
]
```
