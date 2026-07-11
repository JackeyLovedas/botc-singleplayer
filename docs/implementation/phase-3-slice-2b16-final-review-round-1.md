BEGIN_FINAL_PR18_FIX_REQUIRED_REPORT
## reviewedPR

- PR: `#18`
- URL: `https://github.com/JackeyLovedas/botc-singleplayer/pull/18`
- Base: `main`
- Branch: `phase-3/cerenovus-first-night-madness-marker`
- State: open, ready, mergeable

## reviewedHead

`86d973485e940c0ef0469dd169db3ab1dc7a417d`

Local HEAD, remote branch HEAD, and GitHub PR HEAD were independently verified equal. The worktree was clean.

## reviewTimestamp

`2026-07-11T12:02:08+08:00`

## reviewScope

- Full PR body and complete `main...reviewedHead` diff.
- All 26 changed files.
- Complete changed production and test files.
- Current `AGENTS.md`, `AUTOPILOT_PROMPT.md`, and `REVIEW_PROTOCOL.md`.
- Rule evidence, effective-only design, preserved design review, implementation status, controller state, log, and role coverage matrix.
- Command validation, actor policy, opportunity creation, stable tenure/ability identity, capability-gate ordering, no-write failure behavior, event construction, replay, integrated-batch validation, prospective application, receipt summaries, idempotency, stored-chain validation, projection privacy, hostile inputs, determinism, and test coverage.
- Independent live/pinned rule-source retrieval and official nightsheet verification.
- Exact frozen-HEAD CI:
  - Push run `29138672803`: success; head SHA matched.
  - Pull-request run `29138673732`: success; head SHA matched.
  - Ubuntu validation ran typecheck, lint, tests, and coverage successfully.
  - Windows deterministic chain completed successfully.

Artifact hashes were independently verified:

- Evidence: `f0d8d976cd9366d7e4603173caeb01d3fd7461c27c484501f79d8d0b0ce5175a`
- Design: `7c1c2bd7f849913b3cacf2e5a14c8ce83a32dbdecef8591267074e6cf4ef0e3f`
- Effective-only design review: `5d1c60eb2f42f4cab01243f8dd00ab0ad38ca4fc5a98a094345ef7f663c0af16`

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

Changed test files reviewed completely:

1. `packages/application/src/game-application-service.test.ts`
2. `packages/domain-core/src/cerenovus.test.ts`

Related existing regression coverage was also inventoried in:

- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/rules-snv/src/catalog.test.ts`

The related existing suites contain no Cerenovus-specific replay, reordered-batch, hostile-metadata, or impairment-conflicting replay cases.

## ruleEvidenceReviewed

Repository and control material:

1. `AGENTS.md`
2. `docs/agent-loop/AUTOPILOT_PROMPT.md`
3. `docs/agent-loop/REVIEW_PROTOCOL.md`
4. `docs/agent-loop/AUTOPILOT_LOG.md`
5. `docs/agent-loop/AUTOPILOT_STATE.json`
6. `docs/agent-loop/CURRENT_TASK.md`
7. `docs/agent-loop/PROJECT_STATE.md`
8. `docs/implementation/phase-3-slice-2b16-design.md`
9. `docs/implementation/phase-3-slice-2b16-effective-only-design-review.md`
10. `docs/implementation/phase-3-slice-2b16-status.md`
11. `docs/rules/ROLE_COVERAGE_MATRIX.md`
12. `docs/rules/USER_OVERRIDES.md`
13. `docs/rules/evidence/2B16.md`

External sources independently reopened:

- Official Cerenovus Wiki revision `3048`
- Official States Wiki revision `1039`
- Official Glossary Wiki revision `2874`
- Official Abilities revision `1376`
- Official Storyteller Advice revision `2552`
- Official Character Types revision `1495`
- Official Goblin revision `2976`
- Official Vigormortis revision `3015`
- Chinese Cerenovus revision `4198`
- Chinese Madness revision `5883`
- Chinese Goblin revision `6148`
- Official `nightsheet.json`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`

The external sources agree on the reviewed rule interpretation:

- Any player, including self and dead players, is a legal target.
- The ordinary selected character is an on-script Townsfolk or Outsider and may be out of play.
- Effective execution records a real marker and privately informs the selected target of Cerenovus plus the selected character.
- The instruction covers the next day and following night.
- Marker removal is next dawn or earlier source ability loss; lifecycle execution remains out of scope.
- Drunk/poisoned sources still perform a normal-looking choice and simulated notification but create no real marker or execution authority.
- Storyteller judgment and execution remain discretionary.
- First-night order is `witch -> cerenovus -> fearmonger`.
- Other-night order is `witch -> cerenovus -> pithag`.
- `PARTIAL` is the only honest current coverage status.

## findings

1. **[BLOCKER] Replay validation does not bind choice source provenance to its opportunity.**

   In `packages/domain-core/src/cerenovus.ts:327-330`, `validateCerenovusChoiceAgainstState` compares the opportunity ID, task, tenure ID, ability-instance ID, and revision, but omits equality checks for:

   - `sourcePlayerId`
   - `sourceSeatNumber`
   - `sourceRole`
   - the complete `abilitySource`

   `validateCerenovusChoiceRecordedPayloadShape` also does not require the parsed tenure seat to equal `sourceSeatNumber`.

   In `packages/domain-core/src/event-applier.ts:1430`, the impairment gate then evaluates attacker-supplied `payload.sourcePlayerId`. A forged four-event replay batch can retain a real opportunity, tenure, and ability instance while substituting another source player/seat/role snapshot. Integrated batch validation derives the marker and instruction from that forged choice, so it does not correct the provenance. This can bypass a represented impairment on the actual opportunity source and admit invalid canonical history. Projection later failing closed does not repair replay acceptance.

   Required correction:

   - Bind all source fields exactly to the referenced opportunity using stable snapshot equality.
   - Bind the tenure record’s player, seat, role, and acquisition revision to the choice and opportunity.
   - Evaluate the capability gate using the validated opportunity source.
   - Add hostile replay tests changing each source field independently and in combination.

2. **[BLOCKER] Marker and instruction shape validators accept a non-string opportunity ID under crafted matching IDs.**

   In `packages/domain-core/src/cerenovus.ts:291-318`, the marker and instruction validators pass `value.opportunityId` through formatter calls using a TypeScript cast but never require it to be a non-empty string. At runtime, a payload with `opportunityId: undefined` and IDs containing the literal `undefined` can satisfy these standalone shape checks.

   The subsequent chain comparison prevents this particular value from entering the normal application-generated chain, but the exported event shape validators themselves do not satisfy the repository’s exact-runtime-shape requirement.

   Required correction:

   - Explicitly require a non-empty canonical opportunity ID before formatting or casting.
   - Add hostile primitive tests for `undefined`, `null`, numbers, empty strings, and malformed opportunity IDs for choice, marker, and instruction payloads.

3. **[BLOCKER] The claimed 62-item reviewed test plan is not implemented or traceable.**

   The changed tests cover the healthy chain, basic role legality, basic tampering, opening actors, effective-only gate, target/non-target projection, and receipt idempotency. They do not directly cover several mandatory reviewed design cases, including:

   - Human source submission.
   - Non-source Human/AI rejection.
   - Unknown target rejection.
   - Full self-targeted application/projection behavior.
   - Stale, mismatched, closed, duplicate, or wrong-revision Cerenovus opportunities.
   - Complete batch metadata and consecutive-sequence assertions.
   - Missing or duplicate choice, marker, settlement, opportunity, and task links.
   - Cross-linked source, seat, role snapshot, catalog, tenure, and ability-source provenance.
   - Sparse arrays and hostile primitive payload fields.
   - Naked Cerenovus events.
   - Reordered events.
   - Wrong batch metadata/nonconsecutive sequences.
   - Forbidden unrelated events mixed into the batch.
   - Effective replay against an impairment-conflicting state.
   - Cerenovus-specific corrupted prospective batches.
   - Cerenovus-specific metadata, construction, prospective, and commit failure retry behavior.

   The broad references to existing batch/rebuild/projection suites do not provide Cerenovus coverage; those suites contain no Cerenovus-specific cases. Consequently the PR body and `phase-3-slice-2b16-status.md` overstate rule-to-test traceability and completion of the reviewed plan.

   Required correction:

   - Add direct Cerenovus tests for the missing high-risk cases, particularly source-provenance replay, impairment-conflicting replay, batch ordering/metadata, malformed stored chains, and prospective atomicity.
   - Replace broad suite-level traceability claims with exact test names or test-file/claim mappings.
   - Re-run all focused, full, coverage, Ubuntu, and Windows gates on the repaired HEAD.

4. **[BLOCKER] The rule-evidence artifact does not satisfy the mandatory evidence schema.**

   `docs/rules/evidence/2B16.md` uses related but nonconforming headings and omits required explicit fields. In particular, it has `role` instead of `involvedRoles`, `coverageStatus` instead of `ruleCoverageStatus`, and lacks explicit sections for:

   - `abilityRules`
   - `interactions`
   - `drunkennessRules`
   - `poisoningRules`
   - `VortoxRules`
   - `alignmentChangeRules`

   Some of this information is scattered under differently named headings, but the mandatory rule-truth protocol requires the named fields. `VortoxRules` and alignment-change handling are not explicitly researched and recorded.

   Required correction:

   - Materialize every mandatory evidence field explicitly.
   - Preserve the existing sourced claims and revisions.
   - Record the Cerenovus/Vortox and alignment-change conclusions rather than leaving them implicit.
   - Recompute evidence/design provenance and repeat any invalidated rule-design and final-review gates.

5. **[NON-BLOCKING VERIFIED] The normal application path otherwise follows the effective-only contract.**

   - Deterministic validation precedes the capability gate.
   - The gate precedes generator, batch ID, event metadata, prospective validation, receipt creation, opportunity closure, and version mutation.
   - Its failure result has the required generic code, stage, retryability, and no receipt.
   - Healthy execution constructs exactly the reviewed four events in order.
   - Accepted results disclose only event types and count.
   - Idempotent retry and fingerprint conflict use the established receipt path.

6. **[NON-BLOCKING VERIFIED] Projection privacy is correctly minimal on the generated path.**

   The player/AI view exposes only:

   - `selectedByCharacter`
   - `madAboutRoleId`
   - `instructionWindow`

   It does not expose source player/seat, tenure, ability instance, marker ID, task/opportunity IDs, impairment, effectiveness, execution eligibility, or Storyteller notes. Player and AI views share the same validated historical path.

7. **[NON-BLOCKING VERIFIED] Scope and rules are otherwise represented honestly.**

   The matrix and PR body retain `PARTIAL`, preserve drunk/poison truth as unsupported rather than immunity, add no fake impairment producer or canonical test event, and keep judgment, execution, lifecycle, Goblin jinx, Vigormortis, Traveller, gained ability, character-change, and other-night behavior explicitly unsupported.

8. **[NON-BLOCKING VERIFIED] CI is green but cannot substitute for the missing replay binding and tests.**

   Both exact-HEAD GitHub runs succeeded, and reported coverage is 85.34% statements/lines, 77.96% branches, and 97.72% functions. These results do not exercise the forged source-provenance path or the missing reviewed negative cases.

## codeVerdict

`CODE_REVIEW_FIX_REQUIRED`

## ruleVerdict

`RULE_REVIEW_FIX_REQUIRED`

## remainingBlockers

```text
[
  "Bind every Cerenovus choice source field and tenure fact to the referenced opportunity and use the validated opportunity source for impairment evaluation.",
  "Make marker and instruction opportunityId runtime validation exact and add hostile primitive cases.",
  "Implement the missing Cerenovus-specific replay, batch, prospective, actor, target, stored-chain, metadata, and retry tests required by the reviewed 62-item plan; correct traceability claims.",
  "Bring docs/rules/evidence/2B16.md into the mandatory evidence schema, explicitly including VortoxRules and alignmentChangeRules, then renew every invalidated provenance/review/CI gate."
]
```
END_FINAL_PR18_FIX_REQUIRED_REPORT
