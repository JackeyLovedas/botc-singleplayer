# Phase 3 Slice 2B16 Design — Effective-Only Cerenovus First Night

## Provenance

- Slice: `2B16`.
- Scope authorization: `CERENOVUS_EFFECTIVE_ONLY`.
- Rule authority: corrected `docs/rules/evidence/2B16.md`.
- The prior design SHA-256 beginning `4f474b7a` and its prior `RULE_DESIGN_PASS` are superseded.
- The current feature branch and dirty worktree are preserved; no product event has been committed, pushed, or persisted.
- Implementation remains paused until a new independent reviewer returns `RULE_DESIGN_PASS` for this exact evidence, design, and current diff.

## ruleClaims

1. Cerenovus acts on the first night.
2. It chooses one player and one on-script Townsfolk or Outsider character.
3. Any modeled roster player is legal, including the source itself.
4. Formal rules permit dead targets; this repository has no life-state model and therefore adds no alive-only restriction.
5. The selected character may be in or out of play.
6. For the effective path, one real `MAD` marker is established.
7. The instruction applies during the next day and following night.
8. Its natural removal is the next dawn; source death, leaving play, or ability loss can end it earlier.
9. This slice records the marker and removal policy but executes no expiry, removal, judgment, or punishment.
10. Only the selected target receives the private instruction.
11. The target learns the Cerenovus character and the character about which it should be mad, not the identity of the Cerenovus player.
12. Drunk/poisoned rules remain true, but simulated settlement is unsupported in this effective-only slice.
13. Official first-night order is `witch -> cerenovus -> fearmonger`.
14. Official other-night order is `witch -> cerenovus -> pithag`.
15. Cerenovus remains `PARTIAL`.

## invariants

- Domain events are canonical truth.
- One accepted command produces exactly four events in fixed order.
- The marker is immutable historical future-trigger policy, not a general active-effect engine.
- No accepted effective batch may be created or replayed when a represented impairment affects the source player.
- The application capability failure occurs before batch IDs, event metadata, events, receipts, opportunity closure, or version changes.
- Stored private knowledge is validated from its historical chain and is not recomputed from later character or impairment state.
- The target view contains no source player or seat identity.
- Source status alone grants no visibility; self-targeting grants visibility only because source and recipient are the same player.
- This slice adds no canonical impairment producer.
- IDs and comparisons are deterministic and locale-independent.

## domainTypes

```ts
const CERENOVUS_CHOICE_MODEL_VERSION = "cerenovus-choice-v1";
const CERENOVUS_MADNESS_MARKER_VERSION = "cerenovus-madness-marker-v1";
const CERENOVUS_MADNESS_INSTRUCTION_MODEL_VERSION =
  "cerenovus-madness-instruction-v1";
const CERENOVUS_INFORMATION_STAGE = "CERENOVUS_INFORMATION";

type CerenovusInstructionWindow = "TOMORROW_DAY_AND_NIGHT";
type CerenovusMarkerRemovalRule =
  "NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY";

type CerenovusActionDecision = {
  readonly kind: "CHOOSE_PLAYER_AND_CHARACTER";
  readonly targetPlayerId: PlayerId;
  readonly chosenRoleId: RoleId;
};

type CerenovusAbilitySourceDescriptor = {
  readonly kind: "ROLE_TENURE";
  readonly abilityRoleId: "cerenovus";
  readonly roleTenureId: RoleTenureId;
  readonly acquiredCharacterStateRevision: number;
};

type CerenovusEffectiveOnlyCapabilityGateResult =
  | { readonly supported: true }
  | {
      readonly supported: false;
      readonly reason:
        "SOURCE_IMPAIRMENT_UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY";
      readonly eventPolicy: "CREATE_NO_EVENTS";
      readonly receiptPolicy: "WRITE_NO_RECEIPT";
      readonly opportunityPolicy: "KEEP_OPEN";
    };
```

The existing opportunity remains a base-role-only `CERENOVUS_FIRST_NIGHT_ACTION` with exact player, seat, role snapshot, role tenure, Cerenovus ability instance, opportunity revision, target schema `ANY_MODELED_ROSTER_PLAYER`, and character schema `ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER`.

```ts
type CerenovusChoiceSet = {
  readonly choices: readonly CerenovusChoiceRecordedPayload[];
};
type CerenovusMadnessMarkerSet = {
  readonly markers: readonly CerenovusMadnessMarkedPayload[];
};
type CerenovusMadnessInstructionSet = {
  readonly deliveries:
    readonly CerenovusMadnessInstructionDeliveredPayload[];
};
```

Remove the uncommitted `CerenovusResolution` effective/impaired union and `CerenovusResolutionSet`.

## commands

```ts
type SubmitCerenovusActionCommandPayload = {
  readonly commandType: "SubmitCerenovusAction";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly decision: CerenovusActionDecision;
};
type SubmitCerenovusActionCommand =
  CommandEnvelope<SubmitCerenovusActionCommandPayload>;
```

Actor policy:

- source Human or source AI: allowed;
- non-source Human/AI: rejected;
- Storyteller/System submission: rejected;
- Storyteller/System may use the existing opportunity-opening command.

The decision accepts no source identity, role snapshot, target role/alignment, impairment, effectiveness, marker, instruction, execution, or lifecycle outcome.

Application order is exact:

1. Capture and fingerprint command.
2. Resolve an existing receipt.
3. Load and rebuild canonical state.
4. Validate expected version.
5. Validate phase, actor, exact payload, task, opportunity, next-task status, source tenure/instance, roster target, and selected character.
6. Run the effective-only capability gate.
7. Only when supported, allocate metadata and construct the batch.

The gate matches any represented `DRUNK` or `POISONED` impairment whose `affectedPlayerId` equals the opportunity source player. Its external failure discloses no impairment details.

## events

Use exactly:

1. `CerenovusChoiceRecorded`
2. `CerenovusMadnessMarked`
3. `CerenovusMadnessInstructionDelivered`
4. `ScheduledTaskSettled`

Settlement outcome is `CERENOVUS_MADNESS_MARKED`.

Remove the uncommitted `CerenovusResolutionRecorded`, `CerenovusPrivateNotificationDelivered`, `CERENOVUS_ACTION_RECORDED`, and all impaired resolution payload/state contracts.

## eventOrder

```text
CerenovusChoiceRecorded
-> CerenovusMadnessMarked
-> CerenovusMadnessInstructionDelivered
-> ScheduledTaskSettled
```

No `AbilityImpairmentApplied`, ineffective-resolution, phase-transition, execution, death, marker-removal, or recurrence event is legal in the batch.

## payloadShapes

### CerenovusChoiceRecorded

```ts
{
  rulesBaselineVersion: string;
  modelVersion: "cerenovus-choice-v1";
  nightNumber: 1;
  choiceId: string;
  taskId: ScheduledTaskId;
  taskType: "CERENOVUS_ACTION";
  opportunityId: ActionOpportunityId;
  decisionKind: "CHOOSE_PLAYER_AND_CHARACTER";
  sourcePlayerId: PlayerId;
  sourceSeatNumber: SeatNumber;
  sourceRole: RoleSetupSnapshot;
  sourceRoleTenureId: RoleTenureId;
  sourceAbilityInstanceId: AbilityInstanceId;
  abilitySource: CerenovusAbilitySourceDescriptor;
  opportunityCharacterStateRevision: number;
  settlementCharacterStateRevision: number;
  targetPlayerId: PlayerId;
  targetSeatNumber: SeatNumber;
  chosenGoodRoleId: RoleId;
  chosenGoodRole: RoleSetupSnapshot;
  roleCatalogSignature: string;
}
```

`chosenGoodRole.characterType` is exactly `TOWNSFOLK` or `OUTSIDER`; default alignment alone is insufficient.

### CerenovusMadnessMarked

```ts
{
  rulesBaselineVersion: string;
  markerVersion: "cerenovus-madness-marker-v1";
  nightNumber: 1;
  appliedNightNumber: 1;
  markerId: string;
  choiceId: string;
  taskId: ScheduledTaskId;
  taskType: "CERENOVUS_ACTION";
  opportunityId: ActionOpportunityId;
  sourcePlayerId: PlayerId;
  sourceSeatNumber: SeatNumber;
  sourceRole: RoleSetupSnapshot;
  sourceRoleTenureId: RoleTenureId;
  sourceAbilityInstanceId: AbilityInstanceId;
  abilitySource: CerenovusAbilitySourceDescriptor;
  sourceCharacterStateRevision: number;
  targetPlayerId: PlayerId;
  targetSeatNumber: SeatNumber;
  madAboutRoleId: RoleId;
  madAboutRole: RoleSetupSnapshot;
  roleCatalogSignature: string;
  markerStatus: "ESTABLISHED";
  instructionWindow: "TOMORROW_DAY_AND_NIGHT";
  removalRule: "NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY";
  sourceAbilityDependency: {
    readonly kind: "SOURCE_ABILITY_INSTANCE";
    readonly permanentLossPolicy: "REMOVE_MARKER";
    readonly reacquisitionPolicy: "NEW_INSTANCE_DOES_NOT_RESUME";
  };
}
```

This is history plus future policy; it does not claim executable expiry/removal.

### CerenovusMadnessInstructionDelivered

```ts
{
  rulesBaselineVersion: string;
  modelVersion: "cerenovus-madness-instruction-v1";
  nightNumber: 1;
  deliveryId: string;
  choiceId: string;
  markerId: string;
  taskId: ScheduledTaskId;
  taskType: "CERENOVUS_ACTION";
  opportunityId: ActionOpportunityId;
  recipientPlayerId: PlayerId;
  recipientSeatNumber: SeatNumber;
  selectedByCharacter: "cerenovus";
  madAboutRoleId: RoleId;
  madAboutRole: RoleSetupSnapshot;
  roleCatalogSignature: string;
  instructionWindow: "TOMORROW_DAY_AND_NIGHT";
  deliveryCharacterStateRevision: number;
  deliveryStatus: "DELIVERED";
}
```

The delivery intentionally contains no source player/seat, tenure/instance, impairment/effectiveness, execution eligibility, or Storyteller note. It derives only from validated choice and marker facts.

### ScheduledTaskSettled

```ts
{
  rulesBaselineVersion: string;
  nightNumber: 1;
  taskId: ScheduledTaskId;
  taskType: "CERENOVUS_ACTION";
  settlementVersion: "scheduled-task-settlement-v1";
  outcomeType: "CERENOVUS_MADNESS_MARKED";
  characterStateRevision: number;
}
```

## stateChanges

- Choice closes exactly one matching open opportunity and appends immutable choice history.
- Marker appends one immutable marker/policy fact, not a generic effect, timer, execution authority, or lifecycle query.
- Instruction appends immutable delivered knowledge.
- Settlement updates ordinary first-night progress; existing task-progress calculation exposes the next supported task without a transition event.
- The fail-closed impairment gate changes no state.

## privateProjection

Persist stage order:

```text
EVIL_TWIN_SETUP_INFORMATION
CERENOVUS_INFORMATION
DREAMER_INFORMATION
```

```ts
type PlayerCerenovusMadnessInstructionView = {
  readonly selectedByCharacter: "cerenovus";
  readonly madAboutRoleId: RoleId;
  readonly instructionWindow: "TOMORROW_DAY_AND_NIGHT";
};
```

The parent private view adds optional `cerenovusMadnessInstruction` and `cerenovusKnowledgeModelVersion: "cerenovus-madness-instruction-v1"`. It exposes no source identity, marker/task/opportunity IDs, assignment/current state, other-player roles, impairment, execution, or Storyteller data. Player and AI views use the same stored fact.

## storedValidation

Before rendering any instruction:

1. Require setup, historical roster, catalog, task plan, opportunity state, choice/marker/delivery collections, and settlement progress.
2. Validate every exact runtime shape and supported model version.
3. Require globally unique choice, marker, delivery, opportunity, and Cerenovus task IDs.
4. Require exactly one closed Cerenovus opportunity per choice.
5. Require one base Cerenovus task with matching source player, seat, and role snapshot.
6. Bind target and chosen role to historical roster/catalog facts.
7. Revalidate chosen type as `TOWNSFOLK | OUTSIDER`.
8. Require exactly one marker per choice.
9. Require exact choice-to-marker source, target, role, task, opportunity, catalog, tenure, instance, and revision linkage.
10. Require exactly one delivery per marker and choice.
11. Require recipient equals the choice target.
12. Require selected character and window equal the marker.
13. Require exactly one matching settlement.
14. Require outcome `CERENOVUS_MADNESS_MARKED` and matching revision.
15. Require reverse completeness: no orphan marker, delivery, or settlement.
16. Reject extra keys, sparse arrays, duplicates, malformed versions, and cross-linked chains.

Projection does not consult latest `currentCharacterState` or `abilityImpairments` to recompute historical delivery.

## replayValidation

- Choice requires exact open opportunity, current base tenure/instance, current task/revision, legal target/role, and no represented source impairment.
- Marker requires one preceding choice, no duplicate marker, and deterministic equality with the marker derived from that choice.
- Instruction requires matching choice/marker and deterministic equality with the derived instruction.
- Settlement requires the complete preceding chain.
- Naked, reordered, duplicate, malformed, extra-key, revision-mismatched, cross-linked, or impairment-conflicting events fail closed.
- Later impairment does not retroactively invalidate already delivered historical knowledge during projection.

## batchSemantics

The accepted batch has exactly four ordered events, one batch ID, one command ID, one committed game version, consecutive sequences, one rules baseline, one valid open opportunity, no matching source impairment in input state, and no unrelated event. Batch validation reconstructs marker, instruction, and settlement from choice and compares every field.

## prospectiveValidation

Before append, validate integrated semantics, apply all four events to isolated prospective state, verify opportunity closure plus one choice/marker/delivery/settlement and next-task computation, then reject every partial, reordered, mismatched, duplicate, or impairment-conflicting batch. Prospective failures are retryable at `first-night-role-action` with no receipt or partial append.

## receiptSemantics

```ts
{
  status: "accepted";
  resultSchemaVersion: "accepted-event-summary-v1";
  eventDisclosure: "EVENT_TYPES_ONLY";
  eventCount: 4;
  eventTypes: readonly [
    "CerenovusChoiceRecorded",
    "CerenovusMadnessMarked",
    "CerenovusMadnessInstructionDelivered",
    "ScheduledTaskSettled"
  ];
}
```

The receipt exposes no source, target, chosen character, marker, or instruction payload. Exact retry returns the stored idempotent summary; changed fingerprint conflicts. The impairment gate stores no receipt, leaving the command ID retryable after future capability support.

## failureBoundary

For a valid submission whose source has a represented matching `DRUNK` or `POISONED` fact:

```ts
{
  status: "failed";
  code: "ApplicationNotConfigured";
  failureStage: "first-night-role-action";
  retryable: true;
  currentGameVersion: number;
}
```

Use the generic message `Cerenovus effective-only settlement is not configured for the current canonical state`. Do not disclose impairment kind, source, ID, or effectiveness. Return after deterministic validation but before any batch/event ID, clock, construction, prospective work, receipt, or append; keep task unsettled and opportunity open.

The pure gate may be unit-tested with a constructed `AbilityImpairmentSet`, explicitly identified as noncanonical/unreachable in current stored history. No integration fixture may fabricate a canonical impairment history. Other construction, dependency, metadata, prospective, and commit failures retain existing retryable classifications; `MetadataGenerationFailed` remains distinct.

## deterministicIds

```text
role-tenure-v1:seat-SS:role-cerenovus:acquired-revision-R
cerenovus-ability-instance-v1:ROLE_TENURE:seat-SS:role-cerenovus:acquired-revision-R
cerenovus-choice-v1:<canonical-opportunity-id>
cerenovus-madness-marker-v1:<canonical-opportunity-id>
cerenovus-madness-instruction-v1:<canonical-opportunity-id>:recipient-seat-SS
```

Every parser reproduces embedded values. No `Date.now`, `Math.random`, random UUID, `localeCompare`, `Intl.Collator`, environment locale, or insertion-order-dependent selection is allowed.

## compatibilityAndMigration

- No Cerenovus product event was committed or persisted, so renaming uncommitted events needs no migration.
- Existing snapshots omit optional new collections and remain rebuildable.
- Adding Cerenovus to role-tenure grammar is backward compatible.
- The new optional stage/view preserves older views.
- Existing receipt schemas remain compatible.
- Do not retain aliases for discarded uncommitted event names; aliases would freeze an unsupported impaired contract.

## testPlan

1. Verify official first-night raw order `witch -> cerenovus -> fearmonger`.
2. Verify official other-night raw order `witch -> cerenovus -> pithag`.
3. Preserve supported subset order `WITCH_ACTION(600) -> CERENOVUS_ACTION(700) -> CLOCKMAKER_INFORMATION(800)` without calling Clockmaker the official immediate successor.
4. Open the Cerenovus opportunity only when its task is next.
5. Allow System to open it.
6. Allow Storyteller to open it.
7. Reject Human/AI opening attempts.
8. Reject a non-base, stale, closed, duplicate, mismatched-role, mismatched-seat, or mismatched-revision opportunity.
9. Require one active base Cerenovus role tenure and ability instance.
10. Allow source Human submission.
11. Allow source AI submission.
12. Reject non-source Human/AI.
13. Reject Storyteller/System submission.
14. Accept self-target.
15. Accept every modeled roster player without checking alive/dead state.
16. Reject unknown target.
17. Accept on-script Townsfolk.
18. Accept on-script Outsider.
19. Accept a legal role absent from assignments.
20. Reject Minion.
21. Reject Demon.
22. Reject off-script role and Goblin without reviewed jinx capability.
23. Reject malformed and extra-key decisions.
24. Reject actor-supplied impairment, effectiveness, marker, instruction, or execution outcomes.
25. Produce exactly the four-event effective batch.
26. Verify shared batch ID, command ID, version, and consecutive sequences.
27. Verify exact choice payload and historical catalog binding.
28. Verify exact marker payload, `TOMORROW_DAY_AND_NIGHT`, and recorded removal policy.
29. Verify exact instruction payload contains no source player or seat fields.
30. Verify settlement outcome `CERENOVUS_MADNESS_MARKED`.
31. Verify settlement exposes the next supported task without a phase transition.
32. Verify the selected target receives the instruction.
33. Verify the source receives it only when self-targeted.
34. Verify a non-target source does not receive it.
35. Verify every other player receives no Cerenovus instruction.
36. Verify player and AI views are identical.
37. Verify projections contain no source identity, assignment, state, marker ID, task/opportunity ID, impairment, or execution fact.
38. Verify stage/value/model-version coupling and ordering.
39. Validate the complete stored choice-marker-delivery-settlement chain.
40. Reject missing marker, delivery, or settlement.
41. Reject duplicate marker, delivery, settlement, choice, opportunity, or task links.
42. Reject cross-linked source, target, role, catalog, revision, tenure, ability-instance, marker, and delivery values.
43. Reject malformed model versions, sparse arrays, and extra fields.
44. Reject tampered canonical state during projection.
45. Reject naked Cerenovus events.
46. Reject reordered events.
47. Reject wrong batch metadata or nonconsecutive sequences.
48. Reject any forbidden phase, execution, death, removal, or recurrence event mixed into the batch.
49. Unit-test constructed `DRUNK` gate input as unsupported with no event/receipt authorization.
50. Unit-test constructed `POISONED` gate input identically.
51. Verify gate result contains no impairment details.
52. Verify healthy canonical state passes the gate; do not describe this as immunity.
53. Verify no Cerenovus test constructs a fake canonical `AbilityImpairmentApplied` history.
54. Verify replay rejects an effective choice against a directly constructed impairment-conflicting state.
55. Verify prospective validation rejects partial or corrupted batches without append.
56. Verify accepted idempotent retry appends nothing.
57. Verify different fingerprint on the same command ID conflicts.
58. Verify metadata, construction, prospective, and commit failures remain retryable and do not burn the command ID.
59. Preserve Witch, Evil Twin, Dreamer, and Seamstress behavior and projection stages.
60. Verify coverage matrix remains `PARTIAL`.
61. Run typecheck, lint, complete tests, coverage, and `git diff --check`.
62. Verify deterministic behavior on Ubuntu and Windows.

## ruleToTestTraceability

- Target/self/dead-model boundary: 14–16.
- Townsfolk/Outsider and out-of-play rule: 17–22.
- Effective marker and instruction: 25–30.
- Private knowledge boundary: 32–38.
- Stored historical validation: 39–44.
- Atomic/replay/prospective guarantees: 45–48 and 54–58.
- Impaired rule truth plus unsupported execution boundary: 49–53.
- Night order: 1–3.
- Honest partial coverage: 59–62.

## explicitOutOfScope

- Drunk/poisoned Cerenovus simulated choice, marker suppression, and target notification.
- Generic or role-specific impairment production, import, or injection.
- Actual madness conduct detection or Storyteller judgment.
- Actual execution, death, day ending, or execution accounting.
- Marker expiry, removal, suspension, resumption, source-death cleanup, or source-leaves-play cleanup.
- Life state, dead-player enforcement, Travellers, and exile.
- Goblin jinx and Vigormortis.
- Gained Cerenovus abilities and general character change.
- Other-night recurrence.
- First-night completion or phase transition.
- AI choice generation.
- UI, Electron, SQLite.
- Any other slice, including 2B17.
- Any claim of complete Cerenovus support or Cerenovus immunity.

## completionCriteria

- Corrected evidence retains full impaired rule truth and records unsupported canonical reachability.
- Revised implementation contains no impaired settlement event or union.
- No generic impairment source, import, or injection is added.
- The effective-only application guard has exact retryable no-write behavior.
- Accepted path uses the exact four events and settlement outcome.
- Target and character validation match sourced rules.
- Marker history records future window/removal policy without executing lifecycle.
- Target-only projections hide source identity and all internal facts.
- Stored validation proves one complete closed chain.
- Replay, batch, prospective, receipt, retry, and deterministic contracts pass.
- New and existing tests pass on Ubuntu and Windows.
- Matrix and PR body mark impaired settlement, lifecycle, judgment, execution, and recurrence unsupported.
- Cerenovus remains `PARTIAL`.
- A new independent reviewer returns `RULE_DESIGN_PASS` for the exact corrected evidence, design, and current diff before implementation resumes.

READY_FOR_RULE_DESIGN_REVIEW
