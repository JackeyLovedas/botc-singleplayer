# Phase 3 Slice 2B13 Status: Dreamer Action Opportunity And Information Skeleton

## Status

Implemented on branch `phase-3/dreamer-action-information-skeleton`.

PR #14 was merged before this slice with merge commit `82a2476ab39f53775b6ca530f2a86ad864b10825` and tagged as `phase-3-slice-2b12-witch-action-target-marker`.

## Scope Delivered

- Enabled base in-play `DREAMER_ACTION` opportunities for the current `dreamer` role task.
- Added `SubmitDreamerAction` for the supported `{ kind: "CHOOSE_PLAYER", targetPlayerId }` decision.
- Added `packages/domain-core/src/dreamer.ts` for target choice, information delivery, effectiveness, validation, and replay helpers.
- Added `DreamerTargetChosen` as the canonical safe target-choice fact.
- Added `DreamerInformationDelivered` as the canonical information fact for both effective and source-impaired Dreamer information.
- Added `ScheduledTaskSettled.outcomeType = DREAMER_INFORMATION_DELIVERED`.
- Added Dreamer private knowledge projection fields visible only to the Dreamer source player.
- Kept `assignment`, `currentCharacterState`, `setup`, and the original first-night task plan unchanged.
- Kept player and AI projections free of information reliability, source impairment, false-role policy, complete assignment, current character state, and correctness markers.

## Dreamer Action Opportunity

Base first-night Dreamer tasks create deterministic opportunities with:

```text
first-night-v1:DREAMER_ACTION:seat-<NN>:opportunity-01
```

The visible schema is:

```text
canChooseTarget = true
supportedDecisionKinds = [CHOOSE_PLAYER]
targetSchema = OTHER_NON_TRAVELLER_PLAYER
```

The project has not modeled Travellers yet, so this slice enforces only `targetPlayerId != sourcePlayerId`. The visible schema does not expose target role, target alignment, correct answer, false role candidates, source impairment, Vortox status, assignment, or current character state.

## SubmitDreamerAction Boundary

`SubmitDreamerAction` accepts only:

```text
taskId
opportunityId
decision.kind = CHOOSE_PLAYER
decision.targetPlayerId
```

The command rejects hidden payload fields such as target seat number supplied by the actor, target role, target alignment, good role, evil role, correct role id, effectiveness, or Storyteller choice.

Allowed actors:

```text
source Human
source AI
Storyteller
System
```

Human and AI actors must match `opportunity.sourcePlayerId`; otherwise the command is rejected as `ActorPlayerMismatch`. Storyteller and System remain allowed for deterministic orchestration tests.

The command validates the game phase, open opportunity, task id, next unsettled task, current Dreamer source, roster target, current-character-state target, and non-self target before creating events.

## DreamerTargetChosen

`DreamerTargetChosen` records the safe target-selection input:

```text
rulesBaselineVersion
nightNumber = 1
taskId
taskType = DREAMER_ACTION
opportunityId
decisionKind = CHOOSE_PLAYER
sourcePlayerId
sourceSeatNumber
sourceRole
sourceCharacterStateRevision
targetPlayerId
targetSeatNumber
```

It intentionally excludes target role, target character type, target alignment, correct answer, effectiveness, and candidate false roles.

## DreamerInformationDelivered

`DreamerInformationDelivered` records:

```text
knowledgeModelVersion = dreamer-information-model-v1
knowledgeStage = DREAMER_INFORMATION
falseRolePolicyVersion = dreamer-false-role-policy-v1
goodRole
evilRole
informationReliability
```

Effective Dreamer information always contains exactly one GOOD role and one EVIL role. If the target's current role is GOOD, `goodRole` is the target's current role and `evilRole` is the deterministic false role. If the target's current role is EVIL, `evilRole` is the target's current role and `goodRole` is the deterministic false role.

False roles are selected from the role catalog snapshot using stable string ordering over `roleId`. No randomness, clock, assignment order, locale collation, or Storyteller free choice is used.

## Effective Vs Source-Impaired Information

Dreamer effectiveness is evaluated at settlement time. A source player with an active `DRUNK` or `POISONED` impairment receives source-impaired information:

```text
informationReliability.kind = SOURCE_IMPAIRED
reason = SOURCE_DRUNK | SOURCE_POISONED
sourceImpairmentId
sourceImpairmentKind = DRUNK | POISONED
```

The impaired path still records `DreamerTargetChosen`, still records `DreamerInformationDelivered`, and still delivers one GOOD role plus one EVIL role. It does not require either delivered role to be the target's true current role.

When multiple source impairments apply, the lowest `impairmentId` by explicit stable string comparison wins. `localeCompare`, `Intl.Collator`, default object sorting, randomness, and environment locale behavior are not used.

## Why Vortox Is Not Implemented

This slice does not implement Vortox because the current architecture has not introduced the role-specific false-candidate solving needed to force composite information false while preserving the Dreamer output shape. The open architecture risk around composite false-candidate builders remains outside this slice.

## Why Storyteller Free False-Role Choice Is Not Implemented

Storyteller free false-role choice requires recorded legal candidates and a recorded final Storyteller choice. This slice uses a deterministic false-role policy so replay, tests, and projections can be validated before adding discretionary candidate selection.

## Projection Boundary

`buildPlayerPrivateKnowledgeView` and `buildAiPrivateKnowledgeView` expose Dreamer information only to the Dreamer source player after the matching delivery and settlement exist.

Before either projection reads a stored delivery, `validateStoredDreamerInformationDelivered` now verifies the exact outer and nested runtime shapes, supported model/stage/policy versions, reliability discriminated union, GOOD/EVIL role-catalog bindings, historical `DreamerTargetChosen`, planned `DREAMER_ACTION`, and the exact matching `ScheduledTaskSettled` task, outcome, and revision. Malformed delivery or settlement records fail closed as `PrivateKnowledgeUnavailable`, including null and non-object stored values.

This stored-fact validation intentionally does not read latest `currentCharacterState` or latest `abilityImpairments`. Delivered information remains historical knowledge after later role or impairment changes.

The visible Dreamer private view contains only:

```text
target
goodRole
evilRole
dreamerKnowledgeModelVersion = dreamer-information-model-v1
deliveredKnowledgeStages += DREAMER_INFORMATION
```

It does not expose `informationReliability`, `SOURCE_DRUNK`, `SOURCE_POISONED`, `sourceImpairmentId`, `falseRolePolicyVersion`, correct-role markers, target true role, target alignment, full assignment, current character state, or Storyteller explanation. Other players and AI views for other seats do not receive the Dreamer information.

## Batch And Replay Semantics

Valid Dreamer action batches contain exactly:

```text
DreamerTargetChosen
DreamerInformationDelivered
ScheduledTaskSettled
```

The batch validator requires shared metadata, consecutive event sequence, matching task id, matching opportunity id, matching source, matching target, valid role-catalog roles, correct effective-source truth inclusion, correct impaired-source reliability, and `ScheduledTaskSettled.outcomeType = DREAMER_INFORMATION_DELIVERED`.

Replay rejects naked Dreamer events, reversed batches, mixed batches, mismatched target/task/opportunity/source, effective information without the target's current role, wrong role alignment, missing impaired reliability, wrong impairment id, extra hidden payload fields, and unrelated events mixed into the Dreamer batch.

## Failure Boundary

Player or deterministic state rejections continue to save command receipts for existing validation categories, including actor mismatch, missing task, already settled task, non-next task, missing opportunity, closed opportunity, unsupported role action, invalid Dreamer target, and expected game version mismatch.

Internal construction and prospective-validation `DomainError` failures for `SubmitDreamerAction` are classified as:

```text
DependencyExecutionFailed
failureStage = first-night-role-action
retryable = true
```

Metadata generation failures remain independent:

```text
MetadataGenerationFailed
failureStage = event-metadata
```

## Golden Behavior

The golden base first-night plan remains six tasks:

```text
PHILOSOPHER_ACTION
MINION_INFO
DEMON_INFO
EVIL_TWIN_SETUP
WITCH_ACTION
DREAMER_ACTION
```

The task count and existing order are unchanged. In the supported no-Philosopher path used by this slice, settling `DREAMER_ACTION` advances the next task to `SEAMSTRESS_ACTION`. Seamstress action opening remains unsupported in this slice.

## Tests

Local tests cover:

- Dreamer action opportunity opening and deterministic id shape.
- Safe Dreamer visibility schema.
- `SubmitDreamerAction` actor and target validation.
- Effective GOOD target information.
- Effective EVIL target information.
- Source-impaired information delivery with canonical unreliable reliability.
- Stable impairment ordering without locale sorting.
- Static regression check that Dreamer code does not use `localeCompare` or `Intl.Collator`.
- Replay and batch rejection cases for malformed Dreamer batches.
- Stored-delivery rejection for unsupported versions, invalid reliability unions, role alignment/catalog mismatches, duplicate or mismatched task/choice/settlement facts, forbidden hidden fields, and nested extra fields.
- Player and AI private projection non-leakage and fail-closed parity for malformed stored facts.
- Historical Dreamer projection stability after later current-character-state and impairment changes.
- Windows-scoped `@botc/application` test command execution across all three application test files.
- Witch, Evil Twin, Snake Charmer, Philosopher, team knowledge, and existing projection regression paths.

Final local validation after the stored-fact repair:

```text
pnpm typecheck: passed
pnpm lint: passed
pnpm test: passed, 613 tests
pnpm test:coverage: passed, 613 tests
```

## Non-Goals

- No Vortox implementation.
- No Storyteller free false-role choice.
- No AI target decision.
- No Seamstress implementation.
- No first-night completion.
- No UI, Electron, SQLite, or persistence adapter work.
- No mutation to `assignment` or `currentCharacterState`.

## Blockers

The stored Dreamer projection-validation blocker and the no-op Windows application test command were repaired. Merge remains gated on independent reviewer `PASS`, current PR CI, reviewed HEAD equality, and a clean worktree.

## Next Step

Suggested next slice after review and merge: Phase 3 Slice 2B14 Seamstress Action Opportunity and Same-Alignment Information Skeleton. Do not start Slice 2B14 from this PR.
