# Phase 3 Slice 2B16 Repair Round 2 Design

## gateStatus

- Slice: `2B16`.
- Role: Cerenovus.
- Scope: `CERENOVUS_EFFECTIVE_ONLY`.
- Frozen reviewed HEAD: `45aabfe825d45329a80a178a943cce3bb6491ce1`.
- Exact-head push CI `29140790900`: success.
- Exact-head pull-request CI `29140792281`: success.
- Final-review verdicts: `CODE_REVIEW_FIX_REQUIRED` and `RULE_REVIEW_FIX_REQUIRED`.
- Repair round: `2 / 2`.
- Evidence remains `docs/rules/evidence/2B16.md`, SHA-256 `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`, terminal `RULE_READY`, coverage `PARTIAL`.
- Complete round-2 final review is preserved at `docs/implementation/phase-3-slice-2b16-final-review-round-2.md`.
- This document authorizes no implementation. A renewed independent `RULE_DESIGN_PASS` is mandatory before production or test edits.

## round2Findings

The reviewed HEAD closes the prior attacker-controlled capability-source and hostile-primitive formatter defects, but does not pass final review because:

1. A syntactically canonical Cerenovus opportunity ID can encode a seat different from `sourceSeatNumber` while the remaining source, task, tenure and ability facts consistently use the source seat.
2. Several exact-name tests overstate what their assertions cover: event order, metadata, lifecycle mixing, provenance, duplicate/cross-link projection, historical behavior, failure injection and prior-role regression.
3. Current-truth status and coverage artifacts at the reviewed HEAD are stale or overstate completed traceability.

Round 2 changes semantic ID binding and direct regression precision only. It does not reinterpret the external BOTC rules.

## unchangedRuleClaims

- Any modeled player is a legal target, including the Cerenovus.
- The ordinary selected character must be an on-script Townsfolk or Outsider and may be out of play.
- A healthy supported action records one choice, one effective marker, one private target instruction and one scheduled settlement.
- The selected target alone receives `selectedByCharacter`, `madAboutRoleId` and `instructionWindow`.
- Drunkenness and poisoning are real BOTC behavior but remain unsupported in currently reachable canonical Cerenovus history; this is not immunity.
- Vortox false-information rules apply to Townsfolk abilities and do not transform this Minion marker/instruction chain under the retrieved sources.
- Character type and alignment remain independent.
- Madness judgment and execution remain Storyteller discretion and are unimplemented.
- Cerenovus remains `PARTIAL`.

## unchangedEffectiveOnlyContract

The only successful event order remains:

1. `CerenovusChoiceRecorded`
2. `CerenovusMadnessMarked`
3. `CerenovusMadnessInstructionDelivered`
4. `ScheduledTaskSettled` with outcome `CERENOVUS_MADNESS_MARKED`

No event name, version, payload field, settlement outcome, command surface, projection output or receipt disclosure changes in this repair.

## canonicalOpportunityIdentityInvariant

For every Cerenovus opportunity, choice, marker, replay batch and stored projection chain:

```text
parse(opportunityId).taskType == CERENOVUS_ACTION
parse(opportunityId).seatNumber == sourceSeatNumber
opportunity.taskId == canonical Cerenovus task for sourceSeatNumber
sourceRoleTenureId == canonical active base Cerenovus tenure for sourceSeatNumber
sourceAbilityInstanceId == deterministic instance derived from sourceRoleTenureId
abilitySource.kind == ROLE_TENURE
abilitySource.abilityRoleId == cerenovus
abilitySource.roleTenureId == sourceRoleTenureId
abilitySource.acquiredCharacterStateRevision == tenure.acquiredCharacterStateRevision
```

The embedded-seat equality is an independent semantic invariant, not a side effect of tenure or task validation.

### opportunity validation

`packages/domain-core/src/first-night-action-opportunity.ts` must require:

```ts
parsedId.seatNumber === value.sourceSeatNumber
```

inside the Cerenovus opportunity branch. Shared opportunity parsing and other roles are unchanged.

### choice and marker validation

`packages/domain-core/src/cerenovus.ts` must use a non-throwing local parse result, or an equivalent helper, that exposes the canonical embedded seat.

- Choice shape requires the embedded opportunity seat to equal `sourceSeatNumber`.
- Marker shape requires the embedded opportunity seat to equal `sourceSeatNumber`.
- Against-state choice validation still binds every provenance field to the stored opportunity, task, tenure and current source.
- Hostile primitives remain invalid without reaching formatter exceptions.

### instruction privacy

The instruction payload does not gain `sourceSeatNumber` or any source identity.

Its source-seat integrity is established indirectly through:

```text
instruction.opportunityId
  -> exact choice
  -> exact marker
  -> exact stored opportunity
  -> parsed embedded seat == stored sourceSeatNumber
```

## boundedProductionFiles

Required production edits are limited to:

- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/cerenovus.ts`

The following may change only if a newly added direct regression exposes a real validation gap:

- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/projections/src/index.ts`
- `packages/application/src/game-application-service.ts`

No speculative refactor or new injection surface is allowed.

## externalNightOrderTraceability

Official night ordering is external rule evidence, not an internally modeled complete runtime catalog.

- First night, independently verified from the pinned official nightsheet: `eviltwin → witch → cerenovus → fearmonger → harpy`.
- Other nights, independently verified from the pinned official nightsheet: `devilsadvocate → witch → cerenovus → pithag → fearmonger`.
- Evidence source/hash: `docs/rules/evidence/2B16.md`, nightsheet SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`.

The two tests that only asserted locally hard-coded official-order arrays must be removed or renamed so they do not masquerade as external rule proof.

The real supported-runtime catalog regression remains:

```text
WITCH_ACTION < CERENOVUS_ACTION < CLOCKMAKER_INFORMATION
```

It proves supported subset order only and must not claim Clockmaker is the official adjacent successor.

## directRegressionPlan

Every item below requires an assertion that directly constructs or observes the named condition. Green unrelated suites and literal test-name presence are not substitutes.

### domain semantic identity

1. Standalone opportunity with canonical `seat-02` ID and otherwise consistent seat-1 source/task/tenure/ability facts is invalid.
2. Choice with both `opportunityId` and `choiceId` moved to canonical `seat-02`, while `sourceSeatNumber` stays 1, fails shape validation.
3. The same choice fails against-state validation even when its other provenance fields match the tampered opportunity.
4. Marker with canonical rewritten `opportunityId`, `choiceId` and `markerId`, but unchanged source seat, fails shape validation.
5. Instruction retains its minimal shape; a canonical ID cross-link to a different choice/marker/opportunity chain fails chain validation.
6. All existing hostile primitive and malformed canonical-ID values remain non-throwing invalid results.

### replay exact order

7. Canonical four-event order is the sole successful control.
8. Generate all 24 permutations of the four distinct events.
9. Assert the canonical permutation succeeds.
10. Assert each of the other 23 permutations fails independently.

The test name must say `rejects all 23 noncanonical Cerenovus event permutations`, not the overbroad prior name backed by three swaps.

### replay metadata

11. Independently mutate `batchId` on one event and reject.
12. Independently mutate `commandId` on one event and reject.
13. Independently mutate `gameVersion` on one event and reject.
14. Independently corrupt event sequence position 1 and reject.
15. Independently corrupt event sequence position 2 and reject.
16. Independently corrupt event sequence position 3 and reject.
17. Independently corrupt event sequence position 4 and reject.

The canonical control must keep shared metadata and consecutive sequences.

### replay lifecycle and duplicates

18. Insert a real `PhaseTransitioned` envelope into the otherwise canonical Cerenovus batch.
19. Align its batch, command, game version and sequence metadata so rejection proves forbidden lifecycle mixing rather than incidental metadata mismatch.
20. Independently duplicate the Cerenovus settlement and reject it as a duplicate, not as a claimed lifecycle event.

Claims must be limited to the actually exercised `PhaseTransitioned` lifecycle fact unless additional lifecycle types are each tested.

### stored opportunity mutations

21. Independently mutate stored opportunity `sourcePlayerId` and reject replay.
22. Independently mutate stored opportunity `sourceSeatNumber` and reject replay.
23. Independently mutate stored opportunity `sourceRole` and reject replay.
24. Independently mutate its canonical ID embedded seat while all other stored source fields stay consistent and reject replay.
25. Reject closed opportunity.
26. Reject duplicate opportunity.
27. Reject stale or wrong current character revision.

### choice provenance replay mutations

28. Baseline.
29. Night number.
30. Task ID.
31. Task type.
32. Opportunity ID, with dependent canonical IDs updated so the semantic mismatch is reached.
33. Source player.
34. Source seat.
35. Source role snapshot.
36. Source tenure ID.
37. Source ability-instance ID.
38. `abilitySource.kind`.
39. Ability role.
40. Ability tenure ID.
41. Ability acquisition revision.
42. Opportunity character-state revision.
43. Settlement character-state revision.
44. One multi-field combined provenance forgery.
45. Actual opportunity-source impairment still rejects effective replay even when payload source is forged unaffected.

### projection duplicates

46. Duplicate choice.
47. Duplicate marker.
48. Duplicate instruction.
49. Duplicate settlement.
50. Duplicate opportunity.
51. Duplicate task.

Each duplicate has its own constructed state and assertion.

### projection independent cross-links

52. Source player.
53. Source seat.
54. Source role snapshot.
55. Role catalog signature or selected-role catalog snapshot.
56. Tenure ID.
57. Ability-source kind.
58. Ability role.
59. Ability tenure ID.
60. Ability acquisition revision.
61. Ability-instance ID.
62. Opportunity revision.
63. Settlement revision.
64. Target player.
65. Target seat.
66. Marker ID.
67. Choice ID.
68. Delivery ID.
69. Opportunity ID, including semantic embedded-seat mismatch.
70. Task ID.
71. One multi-field combined cross-link forgery.

Each independently named link must have an independent assertion. A combined missing-tenure/changed-role state cannot stand in for the individual items.

### historical non-recomputation

72. Later source current-role change does not recompute the already delivered target instruction.
73. Later source current-alignment change does not recompute it.
74. Later target role change does not recompute it.
75. Later target alignment change does not recompute it.
76. Test-only later source impairment does not recompute it.

These tests prove historical non-recomputation only. They do not claim a canonical impairment producer, Vortox runtime, alignment lifecycle or character-change lifecycle.

### application metadata, prospective and commit faults

For each fault below, assert the precise failure code/stage, `retryable`, no receipt, no new event, unchanged game version, still-open opportunity, and successful retry of the same command ID after removing the fault:

77. Batch-ID generation failure.
78. Event-ID generation failure at event position 1.
79. Event-ID generation failure at event position 2.
80. Event-ID generation failure at event position 3.
81. Event-ID generation failure at event position 4.
82. If `common()` reads the clock once per event, clock failure at position 1.
83. Clock failure at position 2.
84. Clock failure at position 3.
85. Clock failure at position 4.
86. Event construction throws after validation but before prospective acceptance.
87. Prospective batch corruption.
88. `failBeforeCommit`.
89. `failDuringCommit`.

The fault harness remains test-only. No production injection API is added.

## priorRoleRegressionTraceability

Delete or rename the test that only checks task-definition presence while claiming Witch, Evil Twin, Dreamer and Seamstress behavior.

Prior-role execution behavior is traced to existing tests that genuinely execute it:

- Witch: `submits an effective Witch target choice and records a deferred death marker`.
- Evil Twin: `settles EVIL_TWIN_SETUP as pair, private information, and scheduled settlement`.
- Dreamer: `submits an effective Dreamer choice for a GOOD target and delivers isolated role information`.
- Seamstress: `settles a V2 Seamstress choice through the four-event canonical batch and summary-only result`.

Prior-role private projection is traced to the existing direct Evil Twin, Dreamer and Seamstress projection tests in `packages/projections/src/private-knowledge-view.test.ts`, plus the direct Witch canonical-fact non-leakage assertion. Exact names must be copied from those files during implementation; the design must not invent substitute behavior claims.

## statusAndCoverageRepair

After renewed design approval and implementation, synchronize the current-truth files named by the architect:

- repair round `2 / 2`;
- frozen reviewed HEAD `45aabfe...`, its successful CI and its round-2 final review become historical after a new commit;
- remove `PENDING_THIS_BOOKKEEPING_COMMIT` and instructions to create the already-existing old commit;
- do not claim every trace row is covered unless each assertion is verified;
- Cerenovus remains `PARTIAL`;
- do not self-reference an unknown commit SHA inside the commit;
- use Git and PR `headRefOid` as exact current-HEAD authority after push;
- use GitHub checks on that exact HEAD as CI authority without creating an infinite docs-only commit chain.

The role coverage matrix must state the effective-only mechanisms actually implemented, keep historical projection `PARTIAL`, preserve unsupported impairment and lifecycle boundaries, and remove stale round-1-pending language.

## explicitOutOfScope

- Drunk/poison producer, import or arbitrary canonical injection.
- Impaired simulated Cerenovus choice or target notification.
- Actual madness sincerity judgment.
- Execution, death, day ending or life accounting.
- Marker removal, expiry or cleanup.
- Other-night recurrence.
- Vortox runtime.
- Alignment-change or character-change lifecycle.
- Gained Cerenovus.
- Goblin jinx.
- Vigormortis retention.
- Traveller-specific runtime beyond the current modeled roster boundary.
- Slice 2B17.
- UI, Electron and persistence.

## acceptanceGates

1. One independent read-only reviewer returns `RULE_DESIGN_PASS` for this exact round-2 design before implementation begins.
2. Focused tests cover Cerenovus domain, replay, projection, application, supported rules catalog and prior-role private projection.
3. File-scoped lint passes for every modified production and test file.
4. `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage` and `git diff --check` pass.
5. Report actual test counts and coverage; do not pre-write fixed future results.
6. Freeze and push one new exact HEAD.
7. Ubuntu and Windows CI pass for that exact SHA.
8. One complete independent final report for the frozen SHA returns both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS` with `remainingBlockers = []`.
9. Publish and re-read the two required verbatim GitHub audit comments before merge.

READY_FOR_RULE_DESIGN_REREVIEW
