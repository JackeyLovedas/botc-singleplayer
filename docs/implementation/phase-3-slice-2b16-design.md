# Phase 3 Slice 2B16 Repair-Round-1 Design: Effective-Only Cerenovus

## status

- Repair round: `1 / 2`.
- Current PR: `#18`.
- Frozen reviewed HEAD `86d973485e940c0ef0469dd169db3ab1dc7a417d` returned `CODE_REVIEW_FIX_REQUIRED` and `RULE_REVIEW_FIX_REQUIRED`.
- Implementation is paused. This document does not authorize production or test edits before a renewed independent `RULE_DESIGN_PASS`.
- The effective-only event contract is unchanged.

## provenance

- Corrected rule evidence: `docs/rules/evidence/2B16.md`.
- Corrected evidence SHA-256: `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`.
- Prior effective-only design SHA-256 `7c1c2bd7f849913b3cacf2e5a14c8ce83a32dbdecef8591267074e6cf4ef0e3f` is superseded.
- Prior effective-only design review SHA-256 `5d1c60eb2f42f4cab01243f8dd00ab0ad38ca4fc5a98a094345ef7f663c0af16` is superseded for implementation authorization.
- Frozen final-review report is preserved verbatim at `docs/implementation/phase-3-slice-2b16-final-review-round-1.md`, SHA-256 `7af520124ee01a5c195ca5d1aecd146a86b5ed109ef8ba4795c5be4847e0ab3c`.
- Old exact-head CI runs `29138672803` and `29138673732` succeeded for `86d9734...` but are historical only after any repair commit.

## feasibility

All four final-review blockers are repairable inside `CERENOVUS_EFFECTIVE_ONLY`. No event name, command scope, impairment producer/import/injection, Vortox runtime, alignment-change runtime, lifecycle behavior, or other role implementation is added.

## sourcedRuleConclusions

- Vortox falsifies information from Townsfolk abilities. Cerenovus is a Minion, so no retrieved rule transforms its selected character, effective marker, Cerenovus identity shown to the target, or instruction. No Vortox runtime is added and coverage remains incomplete.
- Character and alignment are independent. Ordinary selected-character legality is based on character type `TOWNSFOLK | OUTSIDER`, not the current alignment of a player holding that character. An evil Townsfolk/Outsider remains legal; a good Minion/Demon does not become ordinarily legal.
- Target alignment does not alter target legality, stored role, marker, or instruction. Source alignment change alone does not remove the Cerenovus character or ability.
- Alignment-change runtime remains out of scope.

## unchangedEffectiveOnlyEventContract

Accepted healthy execution remains exactly:

1. `CerenovusChoiceRecorded`
2. `CerenovusMadnessMarked`
3. `CerenovusMadnessInstructionDelivered`
4. `ScheduledTaskSettled` with `CERENOVUS_MADNESS_MARKED`

No impaired-resolution event, fake notification event, phase transition, execution, death, marker-removal, Vortox, alignment-change, or recurrence event is permitted.

## invariants

1. Every outer source field is bound to the exact referenced opportunity, task, tenure record, parsed tenure ID, and parsed ability-instance ID.
2. Capability evaluation always uses the validated opportunity source, never a choice payload source.
3. Exact keys and primitives are checked before formatter calls; a canonical Cerenovus opportunity ID is required before any cast or formatting.
4. `recipientSeatNumber` is validated before instruction delivery-ID formatting.
5. A choice is not canonical merely because its derived marker/instruction agree with forged outer provenance.
6. Replay, integrated-batch validation, application validation, projection, and prospective validation enforce the same source chain.
7. Projection validates stored historical source links but does not recompute already delivered knowledge from later current character or impairment state.
8. Every design requirement maps to an exact test file and exact test name. Broad unrelated-suite claims are not traceability.
9. Constructed impairment sets are explicitly test-only/noncanonical and never appended as `AbilityImpairmentApplied` history.
10. Cerenovus remains `PARTIAL`.

## canonicalOpportunityIdValidation

Add a non-throwing helper:

```ts
const isCanonicalCerenovusOpportunityId = (
  value: unknown
): value is ActionOpportunityId =>
  typeof value === "string" &&
  /^first-night-v1:CERENOVUS_ACTION:seat-(0[1-9]|1[0-2]):opportunity-(0[1-9][0-9]*)$/.test(value);
```

Choice, marker, and instruction shape validation order is exact:

1. exact enumerable keys;
2. primitive types and non-empty strings;
3. canonical Cerenovus opportunity ID;
4. valid seat values, including recipient seat before delivery formatting;
5. formatter comparisons and embedded-ID reproduction;
6. role snapshot and discriminated-union validation.

The validators return invalid without throwing for `undefined`, `null`, `false`, `0`, `1`, `{}`, `[]`, empty/blank strings, malformed IDs, Witch IDs, seat `00`, and opportunity `00`.

## choiceShapeProvenanceBinding

After parsing tenure and ability instance, require all of:

```text
tenureId.valid
tenureId.roleId === cerenovus
tenureId.seatNumber === sourceSeatNumber
tenureId.acquiredCharacterStateRevision === abilitySource.acquiredCharacterStateRevision
abilityInstance.valid
abilityInstance.roleTenureId === sourceRoleTenureId
abilityInstance.seatNumber === sourceSeatNumber
abilityInstance.acquiredCharacterStateRevision === abilitySource.acquiredCharacterStateRevision
abilitySource.kind === ROLE_TENURE
abilitySource.abilityRoleId === cerenovus
abilitySource.roleTenureId === sourceRoleTenureId
```

## choiceOpportunityTenureBinding

`validateCerenovusChoiceAgainstState` accepts stored `RoleTenureState` and binds exact:

```ts
type ValidateCerenovusChoiceAgainstStateInput = {
  readonly choice: CerenovusChoiceRecordedPayload;
  readonly opportunity: CerenovusActionOpportunity;
  readonly roster: PlayerRoster;
  readonly setup: GeneratedSetup;
  readonly roleTenures: RoleTenureState;
};
```

Choice equals opportunity for `nightNumber`, `taskId`, `taskType`, `opportunityId`, `sourcePlayerId`, `sourceSeatNumber`, `sourceRole` via `sameRoleSetupSnapshot`, `sourceCharacterStateRevision`, `sourceRoleTenureId`, `sourceAbilityInstanceId`, and every `abilitySource` field.

Exactly one stored tenure record must match. It binds player, seat, role `cerenovus`, acquisition revision, tenure ID, opportunity, and choice. Parsed tenure identity reproduces the same seat, role, and acquisition revision.

## currentSourceAndTaskBinding

Application and replay additionally require:

- exactly one current character entry for the opportunity source player/seat;
- current role snapshot equals opportunity source role and is Cerenovus;
- tenure remains continuous from opportunity through settlement revision;
- task source player, seat, and role snapshot equal the opportunity;
- task is the current next unsettled `CERENOVUS_ACTION`;
- opportunity is exact, open, unique, and at the expected revision.

## capabilityGateAuthority

Application, integrated batch, and event replay call only:

```ts
evaluateCerenovusEffectiveOnlyCapability({
  sourcePlayerId: opportunity.sourcePlayerId,
  abilityImpairments: state.abilityImpairments
});
```

The external failure remains `ApplicationNotConfigured / first-night-role-action / retryable`, with the existing generic message and no metadata, batch, event, prospective, receipt, opportunity closure, or version change.

## replayValidation

Event application order for choice is: resolve opportunity; validate opportunity and choice shapes; resolve task; resolve exactly one tenure; bind full source chain; evaluate capability with opportunity source; require continuity/revision; check uniqueness; close/apply.

Reject naked, missing, duplicate, reordered, mixed, wrong-metadata, nonconsecutive, stale/closed/mismatched/duplicate-opportunity, forged-provenance, and impairment-conflicting histories. A forged unaffected payload source cannot bypass impairment of the actual opportunity source.

## integratedBatchAndProspectiveValidation

Integrated batch validation resolves and validates opportunity before capability evaluation, passes stored tenure state, uses opportunity source, retains the exact four-event order, reconstructs marker/instruction/settlement, and compares every field.

Corrupted prospective input fails atomically with no event, receipt, version, task, or opportunity mutation. The same command ID remains retryable after the test fault is removed. Use an existing test-only fault harness or narrow spy; add no production injection API.

## storedProjectionValidation

Projection passes stored tenure state into choice-chain validation and checks the same source/opportunity/task/tenure/ability linkage. It rejects missing, duplicate, sparse, hostile, extra-key, or cross-linked choice/marker/instruction/settlement/opportunity/task facts. Only the target receives `selectedByCharacter`, `madAboutRoleId`, and `instructionWindow`; source and internal fields remain hidden.

## VortoxAndAlignmentRuntimeBoundary

- No Vortox event, state, projection transformation, answer candidate, or false-information branch is introduced.
- No alignment-change command, event, replay path, projection, or lifecycle is introduced.
- Sourced conclusions are documentation and regression-prohibition claims only.

## testPlan

1. Verify official first-night raw order `witch -> cerenovus -> fearmonger`.
2. Verify official other-night raw order `witch -> cerenovus -> pithag`.
3. Preserve supported subset order without calling the supported successor the official immediate successor.
4. Open the opportunity only when Cerenovus is next.
5. Allow System to open it.
6. Allow Storyteller to open it.
7. Reject Human/AI opening attempts without events or opportunity creation.
8. Reject non-base, stale, closed, duplicate, mismatched-source, mismatched-role/seat, or wrong-revision opportunity state.
9. Require exactly one active base Cerenovus tenure and canonical ability instance with complete player/seat/role/acquisition binding.
10. Allow source Human submission.
11. Allow source AI submission.
12. Reject non-source Human/AI.
13. Reject Storyteller/System submission.
14. Accept and fully project self-target.
15. Accept every modeled roster player without claiming life-state completeness.
16. Reject unknown target.
17. Accept on-script Townsfolk.
18. Accept on-script Outsider.
19. Accept a legal character absent from assignments.
20. Reject Minion.
21. Reject Demon.
22. Reject Traveller, Fabled, off-script role, and Goblin without reviewed jinx capability.
23. Reject malformed/extra-key decisions and hostile primitives without throwing.
24. Reject actor-supplied source, impairment, effectiveness, marker, instruction, execution, Vortox, or alignment outcomes.
25. Produce exactly the four effective events.
26. Verify shared batch ID, command ID, committed version, consecutive sequences, and baseline.
27. Bind every choice source field to opportunity, task, tenure, parsed tenure, ability instance, current source, catalog, and revisions.
28. Verify exact marker payload, window, and recorded removal policy.
29. Verify exact instruction payload and absence of source/internal fields.
30. Verify settlement outcome and linkage.
31. Verify next supported task without a phase transition.
32. Project only to selected target.
33. Project to source only when self-targeted.
34. Hide from non-target source.
35. Hide from every other player.
36. Keep player and AI views identical.
37. Hide source identity, canonical state, IDs, impairment, effectiveness, execution, Storyteller, Vortox, and alignment internals.
38. Verify stage/value/model-version coupling and ordering.
39. Validate complete choice-marker-instruction-settlement-opportunity-task-tenure chain.
40. Reject every missing chain position.
41. Reject duplicate choice, marker, instruction, settlement, opportunity, and task links.
42. Reject independently and jointly cross-linked source player, seat, role, catalog, tenure, ability source, instance, target, revision, marker, and delivery.
43. Reject malformed versions, sparse collections, extra keys, hostile opportunity-ID primitives, malformed canonical IDs, and hostile recipient seats without throwing.
44. Reject tampered canonical projection state while preserving later-state historical behavior.
45. Reject each naked Cerenovus event.
46. Reject every event reordering.
47. Reject mismatched batch ID, command ID, committed version, and nonconsecutive sequence.
48. Reject unrelated or forbidden phase/execution/death/removal/recurrence events mixed into the batch.
49. Unit-test constructed noncanonical DRUNK gate input with exact no-write result.
50. Unit-test constructed noncanonical POISONED gate input identically.
51. Verify gate and application failure disclose no impairment details or receipt/event authorization.
52. Verify healthy canonical state passes without claiming immunity.
53. Verify no Cerenovus test appends fake canonical `AbilityImpairmentApplied` history.
54. Reject effective replay against impairment of the actual opportunity source, including forged unaffected payload source.
55. Reject corrupted prospective batches atomically and allow same command ID after fault removal.
56. Verify accepted event-summary idempotent retry appends nothing.
57. Verify different fingerprint on the same command ID conflicts.
58. Verify Cerenovus-specific metadata failure at each event position, construction failure, prospective failure, and accepted-commit failure are retryable/no-burn and succeed after fault removal.
59. Preserve Witch, Evil Twin, Dreamer, and Seamstress behavior and projection stages.
60. Verify sourced Vortox/alignment conclusions remain runtime out of scope and matrix remains `PARTIAL`.
61. Run typecheck, lint, focused tests, complete tests, coverage, and `git diff --check`.
62. Verify deterministic behavior on exact-head Ubuntu and Windows CI.

## exactTestNameTraceability

Status values here describe the repair plan, not completed implementation. `EXISTING_REVALIDATE` means a direct test exists but must be rerun after repairs; `PLANNED_REPAIR` means the exact direct test must be added or renamed before claiming completion.

| Item | Rule/contract claim | Exact test file | Exact test name | Status |
|---:|---|---|---|---|
| 1 | First-night official order | `packages/rules-snv/src/catalog.test.ts` | `preserves official Cerenovus first-night neighbors witch and fearmonger` | PLANNED_REPAIR |
| 2 | Other-night official order | `packages/rules-snv/src/catalog.test.ts` | `preserves official Cerenovus other-night neighbors witch and pithag` | PLANNED_REPAIR |
| 3 | Supported subset order | `packages/rules-snv/src/catalog.test.ts` | `orders the supported subset Witch then Cerenovus then Clockmaker without claiming official adjacency` | PLANNED_REPAIR |
| 4 | Next-task opportunity | `packages/application/src/game-application-service.test.ts` | `opens the Cerenovus opportunity only when its task is next` | PLANNED_REPAIR |
| 5 | System opening | `packages/application/src/game-application-service.test.ts` | `allows System to open the Cerenovus opportunity when its task is next` | EXISTING_REVALIDATE |
| 6 | Storyteller opening | `packages/application/src/game-application-service.test.ts` | `allows Storyteller to open the Cerenovus opportunity when its task is next` | EXISTING_REVALIDATE |
| 7 | Human/AI opening denied | `packages/application/src/game-application-service.test.ts` | `rejects Human and AI Cerenovus opening attempts without event or opportunity creation` | PLANNED_REPAIR |
| 8 | Invalid opportunity state | `packages/domain-core/src/cerenovus-replay.test.ts` | `rejects stale closed mismatched duplicate and wrong-revision Cerenovus opportunities` | PLANNED_REPAIR |
| 9 | Exact tenure/instance | `packages/domain-core/src/cerenovus.test.ts` | `binds the opportunity and choice to exactly one canonical active base Cerenovus tenure and ability instance` | PLANNED_REPAIR |
| 10 | Source Human submits | `packages/application/src/game-application-service.test.ts` | `accepts SubmitCerenovusAction from the source Human` | PLANNED_REPAIR |
| 11 | Source AI submits | `packages/application/src/game-application-service.test.ts` | `accepts SubmitCerenovusAction from the source AI` | PLANNED_REPAIR |
| 12 | Non-source submits denied | `packages/application/src/game-application-service.test.ts` | `rejects SubmitCerenovusAction from non-source Human and AI actors` | PLANNED_REPAIR |
| 13 | Privileged submit denied | `packages/application/src/game-application-service.test.ts` | `rejects Storyteller and System SubmitCerenovusAction submissions` | PLANNED_REPAIR |
| 14 | Full self-target | `packages/application/src/game-application-service.test.ts` | `accepts and projects a complete self-targeted Cerenovus action` | PLANNED_REPAIR |
| 15 | Any roster target | `packages/domain-core/src/cerenovus.test.ts` | `accepts every modeled roster player without consulting life state` | PLANNED_REPAIR |
| 16 | Unknown target denied | `packages/application/src/game-application-service.test.ts` | `rejects an unknown Cerenovus target without append` | PLANNED_REPAIR |
| 17 | Townsfolk legal | `packages/domain-core/src/cerenovus.test.ts` | `accepts an on-script Townsfolk selected character` | PLANNED_REPAIR |
| 18 | Outsider legal | `packages/domain-core/src/cerenovus.test.ts` | `accepts an on-script Outsider selected character` | PLANNED_REPAIR |
| 19 | Out-of-play legal | `packages/domain-core/src/cerenovus.test.ts` | `accepts a legal selected character absent from assignments` | PLANNED_REPAIR |
| 20 | Minion denied | `packages/domain-core/src/cerenovus.test.ts` | `rejects an ordinary Minion selected character` | PLANNED_REPAIR |
| 21 | Demon denied | `packages/domain-core/src/cerenovus.test.ts` | `rejects an ordinary Demon selected character` | PLANNED_REPAIR |
| 22 | Unsupported types/jinx denied | `packages/domain-core/src/cerenovus.test.ts` | `rejects Traveller Fabled off-script and unsupported Goblin selections` | PLANNED_REPAIR |
| 23 | Exact hostile decision shape | `packages/domain-core/src/cerenovus.test.ts` | `rejects malformed extra-key and hostile-primitive Cerenovus decisions without throwing` | PLANNED_REPAIR |
| 24 | No actor-supplied outcomes | `packages/application/src/game-application-service.test.ts` | `rejects actor-supplied Cerenovus source impairment effectiveness marker instruction execution Vortox and alignment outcomes` | PLANNED_REPAIR |
| 25 | Exact four events | `packages/application/src/game-application-service.test.ts` | `commits exactly choice marker instruction and settlement for healthy Cerenovus` | PLANNED_REPAIR |
| 26 | Exact metadata/sequences | `packages/application/src/game-application-service.test.ts` | `commits one Cerenovus batch with shared metadata and consecutive sequences` | PLANNED_REPAIR |
| 27 | Complete source binding | `packages/domain-core/src/cerenovus.test.ts` | `binds every choice source field to the referenced opportunity` | PLANNED_REPAIR |
| 27 | Forged source replay | `packages/domain-core/src/cerenovus-replay.test.ts` | `rejects forged Cerenovus source provenance independently and in combination` | PLANNED_REPAIR |
| 28 | Marker payload | `packages/domain-core/src/cerenovus.test.ts` | `records the exact effective Cerenovus marker window and removal policy` | PLANNED_REPAIR |
| 29 | Instruction privacy | `packages/domain-core/src/cerenovus.test.ts` | `records the exact target instruction without source or internal fields` | PLANNED_REPAIR |
| 30 | Settlement linkage | `packages/domain-core/src/cerenovus-replay.test.ts` | `settles Cerenovus only after one exact complete effective chain` | PLANNED_REPAIR |
| 31 | Next supported task | `packages/application/src/game-application-service.test.ts` | `exposes the next supported task after Cerenovus without a phase transition` | PLANNED_REPAIR |
| 32 | Target-only projection | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `projects the Cerenovus instruction only to the selected target` | PLANNED_REPAIR |
| 33 | Self-target visibility | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `projects the Cerenovus instruction to the source only when self-targeted` | PLANNED_REPAIR |
| 34 | Non-target source hidden | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `hides the Cerenovus instruction from a non-target source` | PLANNED_REPAIR |
| 35 | Others hidden | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `hides the Cerenovus instruction from every other player` | PLANNED_REPAIR |
| 36 | Player/AI equality | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `keeps Cerenovus player and AI private views identical` | PLANNED_REPAIR |
| 37 | Internal privacy | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `hides every Cerenovus source canonical internal impairment execution Vortox and alignment field` | PLANNED_REPAIR |
| 38 | Stage coupling/order | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `couples Cerenovus stage value and model version in canonical order` | PLANNED_REPAIR |
| 39 | Complete stored chain | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `validates one complete Cerenovus choice marker instruction settlement opportunity task and tenure chain` | PLANNED_REPAIR |
| 40 | Missing chain facts | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `rejects every missing Cerenovus choice marker instruction settlement opportunity and task position` | PLANNED_REPAIR |
| 41 | Duplicate chain facts | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `rejects duplicate Cerenovus choice marker instruction settlement opportunity and task links` | PLANNED_REPAIR |
| 42 | Cross-linked chain facts | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `rejects independently and jointly cross-linked Cerenovus source target catalog tenure ability marker and delivery facts` | PLANNED_REPAIR |
| 43 | Hostile payload shapes | `packages/domain-core/src/cerenovus.test.ts` | `rejects hostile opportunityId and recipient-seat primitives malformed canonical IDs and extra payload keys without throwing` | PLANNED_REPAIR |
| 43 | Sparse stored collections | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `rejects sparse Cerenovus choice marker and instruction collections` | PLANNED_REPAIR |
| 44 | Historical projection | `packages/projections/src/cerenovus-private-knowledge.test.ts` | `does not recompute historical Cerenovus instruction from later character impairment Vortox or alignment state` | PLANNED_REPAIR |
| 45 | Naked events | `packages/domain-core/src/cerenovus-replay.test.ts` | `rejects each naked Cerenovus event` | PLANNED_REPAIR |
| 46 | Reordering | `packages/domain-core/src/cerenovus-replay.test.ts` | `rejects every Cerenovus event reordering` | PLANNED_REPAIR |
| 47 | Wrong metadata | `packages/domain-core/src/cerenovus-replay.test.ts` | `rejects mismatched Cerenovus batch command version and sequence metadata` | PLANNED_REPAIR |
| 48 | Mixed forbidden events | `packages/domain-core/src/cerenovus-replay.test.ts` | `rejects unrelated and forbidden lifecycle events mixed into a Cerenovus batch` | PLANNED_REPAIR |
| 49 | DRUNK gate | `packages/domain-core/src/cerenovus.test.ts` | `fails closed for constructed noncanonical DRUNK Cerenovus capability input` | EXISTING_REVALIDATE |
| 50 | POISONED gate | `packages/domain-core/src/cerenovus.test.ts` | `fails closed for constructed noncanonical POISONED Cerenovus capability input` | EXISTING_REVALIDATE |
| 51 | Generic no-write gate | `packages/application/src/game-application-service.test.ts` | `returns the exact no-write application boundary for constructed-noncanonical Cerenovus source impairment` | EXISTING_REVALIDATE |
| 52 | Healthy gate | `packages/domain-core/src/cerenovus.test.ts` | `allows healthy represented state without claiming immunity` | EXISTING_REVALIDATE |
| 53 | No fake history | `packages/domain-core/src/cerenovus-replay.test.ts` | `uses constructed impairment only as test state and never appends AbilityImpairmentApplied history` | PLANNED_REPAIR |
| 54 | Actual-source impairment replay | `packages/domain-core/src/cerenovus-replay.test.ts` | `rejects actual-source impairment replay even when payload forges an unaffected source` | PLANNED_REPAIR |
| 55 | Prospective atomicity/retry | `packages/application/src/game-application-service.test.ts` | `keeps corrupted Cerenovus prospective failure atomic and retryable with the same command ID` | PLANNED_REPAIR |
| 56 | Idempotent summary | `packages/application/src/game-application-service.test.ts` | `returns the stored Cerenovus event summary idempotently without append` | PLANNED_REPAIR |
| 57 | Fingerprint conflict | `packages/application/src/game-application-service.test.ts` | `rejects a changed Cerenovus fingerprint on the same command ID` | PLANNED_REPAIR |
| 58 | Fault retry/no-burn | `packages/application/src/game-application-service.test.ts` | `keeps every Cerenovus metadata construction prospective and commit fault retryable without burning the command ID` | PLANNED_REPAIR |
| 59 | Prior-role regression | `packages/application/src/game-application-service.test.ts` | `preserves Witch Evil Twin Dreamer and Seamstress behavior after Cerenovus repair` | PLANNED_REPAIR |
| 60 | Vortox/alignment/matrix boundary | `packages/domain-core/src/cerenovus.test.ts` | `keeps Vortox and alignment-change runtime out of scope and Cerenovus coverage PARTIAL` | PLANNED_REPAIR |
| 61 | Local gates | `docs/implementation/phase-3-slice-2b16-status.md` | `repair-round-1 local gate record for exact repaired HEAD` | PLANNED_REPAIR |
| 62 | Exact-head CI | `.github/workflows/ci.yml` (existing; no workflow edit) | Pending exact repaired-HEAD Ubuntu and Windows deterministic CI runs after authorized push | PLANNED_REPAIR |

## explicitOutOfScope

- Drunk/poisoned simulation, impairment production/import/injection, Vortox runtime, alignment-change runtime, character/life/effect lifecycle, marker cleanup, judgment, execution, other-night recurrence, Goblin jinx, Vigormortis retention, gained Cerenovus, UI, Electron, persistence, and Slice 2B17.

## implementationFileBoundaryAfterRenewedPass

Production edits, only after renewed `RULE_DESIGN_PASS`, are limited to:

- `packages/domain-core/src/cerenovus.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/projections/src/index.ts`
- `packages/application/src/game-application-service.ts`
- optionally `packages/domain-core/src/first-night-action-opportunity.ts` only for shared validation hardening

Tests are limited to existing Cerenovus/application tests, new `cerenovus-replay.test.ts`, new `cerenovus-private-knowledge.test.ts`, and optional direct opportunity tests. No existing test weakening.

## completionCriteria

- Corrected evidence has every mandatory heading, both Vortox revisions/hashes, 27 regressions, `PARTIAL`, and `RULE_READY`.
- A renewed independent reviewer returns `RULE_DESIGN_PASS` for the exact evidence/design/control/PR diff.
- Full source/opportunity/tenure binding and canonical ID validation are implemented without changing the event contract.
- Capability evaluation always uses opportunity source.
- Every exact-name test exists and passes before completion is claimed.
- Local and exact-head Ubuntu/Windows gates pass on the repaired frozen HEAD.
- Final complete review returns `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS`, no blockers, with both audit comments reverified.

READY_FOR_RULE_DESIGN_REREVIEW
