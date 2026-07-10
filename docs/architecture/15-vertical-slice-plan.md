# Vertical Slice Plan

## Purpose

This is the recommended next minimal path after Phase 2 is reviewed. It is not authorization to start Phase 3 in this stage.

## Slice 1: Domain Event Spine

Scope:

- Define minimal command and event contracts.
- Apply events to canonical state.
- Rebuild state from event log.
- No UI, no AI, no role abilities.

Acceptance:

- A short event log rebuilds the same canonical state every time.
- Invalid event ordering is rejected by tests.

## Slice 2A: Phase State Machine Core

Scope:

- Create game.
- Define strict game phase types.
- Define phase transition policy and day/night counter policy.
- Add `PhaseTransitioned` as the only domain event that changes `GameState.phase`.
- Use a real multi-event batch for `SelectScript`: `ScriptSelected` plus `PhaseTransitioned`.
- Wire `GameCommandBus` to `GameSessionRunner` and `GameApplicationService`.
- Advance only from game creation to script selection, then to setup generation.
- Test later phase paths through pure policy tests and explicit test fixtures only.

Acceptance:

- `GameCreated` rebuilds to `SCRIPT_SELECTION`, `dayNumber = 0`, and `nightNumber = 0`.
- `SelectScript` atomically records two domain events in one batch and rebuilds to `SETUP_GENERATION`.
- Stage counters follow the documented transition policy.
- `CommandBus` serializes commands per game and allows independent games to proceed concurrently.
- No setup placeholder, fake assignment, or forced phase domain event is introduced.

## Slice 2B1: Seeded Sects & Violets Setup Foundation

Scope:

- Lock first-release script support to official Sects & Violets metadata.
- Add the 25-role Sects & Violets catalog without implementing role abilities.
- Generate a legal 12-player actual role set from `GameState.rootSeed`.
- Apply Fang Gu and Vigormortis setup modifiers before filling role type counts.
- Generate three demon bluffs from out-of-play good roles.
- Record `SetupGenerated` plus `PhaseTransitioned(SETUP_GENERATED)` in one atomic batch.
- Advance only from `SETUP_GENERATION` to `CHARACTER_ASSIGNMENT`.

Acceptance:

- Same seed and constraints produce the same actual role set and demon bluffs.
- `SetupGenerated` stores replayable role snapshots, not only role id strings.
- Bare `SetupGenerated` and bare `PhaseTransitioned(SETUP_GENERATED)` are rejected.
- No seat roster, player assignment, character ability, first night, AI, UI, or persistence adapter is introduced.

## Slice 2B2: Seat Roster and Character Assignment

Scope:

- Execute only after Slice 2B1 is accepted.
- Build a fixed 12-seat roster with exactly one human player and eleven AI-controlled player slots.
- Build deterministic character assignment facts from generated setup, roster, root seed, and role catalog signature.
- Keep actual roles, demon bluffs, seats, assignments, and player knowledge separate.
- Integrate `CHARACTERS_ASSIGNED` only with real assignment facts.
- Advance from `CHARACTER_ASSIGNMENT` to `FIRST_NIGHT` only in the same batch as `CharactersAssigned`.

Acceptance:

- The generated setup can be assigned to the 12 seats without creating player private knowledge or AI prompts.
- Character assignment is replayable and does not reinterpret old setup events through a future role catalog.
- Bare `CharactersAssigned` and bare `PhaseTransitioned(CHARACTERS_ASSIGNED)` are rejected.
- Assignment validation binds player id, seat, role snapshot, setup actual roles, and setup role catalog snapshot.
- No first night tasks, night order, demon/minion information display, or player private role knowledge is introduced.

## Slice 2B3: First Night Private Knowledge Bootstrap

Scope:

- Execute only after Slice 2B2 is accepted and merged.
- Initialize first night with real setup, roster, and character assignment facts.
- Record `FirstNightInitialized` and `InitialPrivateKnowledgeEstablished` in one atomic batch.
- Generate initial private knowledge through an application-defined port and a separate `information-engine` package.
- Establish only each player's own `OWN_CHARACTER` knowledge.
- Defer evil-team information to future ordered `MINION_INFO` and `DEMON_INFO` task settlement.
- Build player and AI private knowledge projections from established knowledge events only.
- Keep projection output free of complete assignments, role catalog snapshots, hidden truth labels, and Storyteller internals.

Acceptance:

- `InitializeFirstNight` emits exactly two domain events and leaves phase at `FIRST_NIGHT`.
- Replay rejects bare, reversed, reordered, metadata-mismatched, and non-canonical private knowledge events.
- Builder runtime failures are retryable execution failures and do not write command receipts.
- Deterministic knowledge generation failures become structured rejected command receipts.
- `InitialPrivateKnowledgeEstablished` contains exactly twelve `OWN_CHARACTER` entries.
- The demon does not see minions or demon bluffs during initialization.
- Minions do not see the demon or other minions during initialization.
- Player and AI views use the same projection isolation boundary.
- The phase remains `FIRST_NIGHT`.
- No night task, role ability, AI decision, UI, Electron, or SQLite adapter is introduced.

## Slice 2B4: First Night Task Plan and ScheduledTask Skeleton

Scope:

- Execute only after Slice 2B3 is accepted and merged.
- Create a static first-night task plan from real setup, roster, assignment, first-night, and own-character knowledge facts.
- Define the `ScheduledTask` domain skeleton without executing tasks.
- Bind the plan to the official first-night ordering.
- Reserve deterministic order keys for future dynamic task insertion.
- Include `MINION_INFO` and `DEMON_INFO` as system information tasks, but do not settle them.
- Do not execute role abilities, generate task results, or deliver evil-team information.

Acceptance:

- The task catalog contains the eleven supported first-night definitions in canonical order.
- Task ids are deterministic and do not use UUID, time, random values, or infrastructure generators.
- The golden assignment produces exactly six scheduled tasks: Philosopher, `MINION_INFO`, `DEMON_INFO`, Evil Twin, Witch, and Dreamer.
- Role tasks record only their source fact and use settlement-time source reevaluation.
- `MINION_INFO` and `DEMON_INFO` do not freeze recipients or current evil-team identities.
- `PlanFirstNightTasks` emits exactly one `FirstNightTaskPlanCreated` event and leaves phase at `FIRST_NIGHT`.
- Player and AI private knowledge projections do not expose the task plan or task sources.
- No task execution, role ability, minion/demon information delivery, AI decision, UI, Electron, or SQLite adapter is introduced.

## Slice 2B5: MINION_INFO and DEMON_INFO Ordered Settlement

Scope:

- Execute only after Slice 2B4 is accepted and merged.
- Consume the pending `MINION_INFO` and `DEMON_INFO` scheduled tasks in first-night order.
- Resolve the current evil team at settlement time, not from frozen task recipients.
- Deliver minion/demon information through explicit private knowledge or information delivery events.
- Keep `canonicalGameState`, full assignment, task source roles, and Storyteller-only reasons out of player and AI projections.
- Do not execute role abilities beyond the two system information tasks.
- Do not add AI decisions, UI, Electron, or SQLite adapters.

Implementation update:

- `SettleFirstNightSystemTask` is the only new command in this slice.
- `MinionInformationDelivered` and `DemonInformationDelivered` are always paired with `ScheduledTaskSettled` in the same domain batch.
- `FirstNightTaskProgress` records settled system tasks without mutating the original task plan.
- The current evil team is resolved from `CurrentCharacterStateSet` at settlement time.
- The default golden plan still blocks `MINION_INFO` when `PHILOSOPHER_ACTION` is the next unsettled task.
- A no-Philosopher fixture validates adjacent `MINION_INFO` then `DEMON_INFO` settlement.
- Role tasks remain pending and no role ability execution is introduced.

Acceptance:

- `MINION_INFO` settlement uses the current demon/minion facts available at settlement time.
- `DEMON_INFO` settlement uses current demon identity and setup demon bluffs at settlement time.
- Replaying the same event stream reproduces the same delivered information.
- Settling the same task twice is rejected.
- Role tasks remain pending after this slice.
- Projection leakage tests cover delivered information and still do not expose task plan internals.

## Slice 2B6: Philosopher Action Opportunity And Defer Settlement

Scope:

- Execute only after Slice 2B5 is accepted and merged.
- Open the current next `PHILOSOPHER_ACTION` task as a deterministic first-night `ActionOpportunity`.
- Expose only a safe opportunity schema: `canDefer`, `supportedDecisionKinds = [DEFER]`, and `futureUnsupportedDecisionKinds = [CHOOSE_GOOD_CHARACTER]`.
- Accept `SubmitPhilosopherAction` only for `DEFER`.
- Close the opportunity through `PhilosopherActionDeferred`.
- Settle the scheduled task with `ScheduledTaskSettled.outcomeType = PHILOSOPHER_DEFERRED`.
- Keep player and AI private knowledge projections free of opportunity ids, task ids, role-action task types, and decision schemas.

Acceptance:

- Golden `MINION_INFO` is still blocked before Philosopher action handling.
- `FirstNightActionOpportunityCreated` is a single-event batch.
- `PhilosopherActionDeferred -> ScheduledTaskSettled` is the only accepted DEFER settlement batch.
- After DEFER, `MINION_INFO` and then `DEMON_INFO` can settle in order.
- `CHOOSE_GOOD_CHARACTER` is rejected as not implemented.
- No ability gain, no drunkenness, no dynamic task insertion, and no other role ability behavior is implemented.

## Slice 2B7: Philosopher Ability Choice And Dynamic Task Insertion Foundation

Scope:

- Execute only after Slice 2B6 is accepted and merged.
- Accept `SubmitPhilosopherAction({ kind: "CHOOSE_GOOD_CHARACTER", roleId })` for legal GOOD role catalog entries.
- Record Philosopher ability choice and granted ability facts without mutating `assignment` or `currentCharacterState`.
- Record a `DRUNK` impairment marker when the chosen GOOD role is currently in play.
- Insert one pending gained first-night task for `clockmaker`, `dreamer`, `snake_charmer`, `seamstress`, or `mathematician`.
- Settle the original `PHILOSOPHER_ACTION` task with `PHILOSOPHER_ABILITY_CHOSEN`.
- Keep inserted tasks pending and unexecuted.
- Keep player and AI private knowledge projections free of chosen role internals, granted ability facts, impairment markers, and inserted task facts.
- Do not implement gained ability settlement, Snake Charmer exchange, drunkenness effects, AI decisions, UI, Electron, SQLite, or first-night phase completion.

Implementation update:

- `PhilosopherAbilityChosen -> PhilosopherAbilityGranted -> [AbilityImpairmentApplied] -> [FirstNightTaskInserted] -> ScheduledTaskSettled` is the accepted batch shape.
- Optional impairment is required exactly when the chosen role is currently in play.
- Optional insertion is required exactly when the chosen role maps to a first-night gained task.
- Inserted task ids use `first-night-v1:PHILOSOPHER_GAINED:<TASK_TYPE>:seat-<NN>:from-<chosenRoleId>`.
- Inserted tasks use `orderKey = { baseOrder: 100, insertionOrder: 1 }`, which places them after the Philosopher wake and before base `MINION_INFO`.

Acceptance:

- Legal GOOD choices are accepted; Demon, Minion, unknown, malformed, and unsupported choices are rejected.
- Choosing an in-play GOOD role records the duplicate-role impairment marker.
- Choosing an out-of-play GOOD role does not record an impairment marker.
- Choosing `snake_charmer` inserts `SNAKE_CHARMER_ACTION` before `MINION_INFO`.
- Inserted tasks are not executed in this slice.
- `assignment` and `currentCharacterState` remain unchanged.
- Golden base task count remains six and golden base order is unchanged.
- Replay rejects naked, reversed, mixed, incomplete, and payload-mismatched ability choice batches.
- Player and AI projections do not expose ability choice, grant, impairment, insertion, or task internals.

## Slice 2B8: Philosopher-Gained Snake Charmer Non-Demon Settlement

Scope:

- Execute only after Slice 2B7 is accepted and merged.
- Validate runtime first-night task plans that contain real `FirstNightTaskInserted` tasks.
- Open a deterministic `SNAKE_CHARMER_FIRST_NIGHT_ACTION` opportunity only for a Philosopher-gained `SNAKE_CHARMER_ACTION` task.
- Add `SubmitSnakeCharmerAction` for the supported decision `{ kind: "CHOOSE_PLAYER", targetPlayerId }`.
- Settle only the non-Demon target path as a no-swap result.
- Record `SnakeCharmerTargetChosen`, `SnakeCharmerNoSwapResolved`, and `ScheduledTaskSettled.outcomeType = SNAKE_CHARMER_NON_DEMON_NO_SWAP` in one atomic batch.
- Close the Snake Charmer action opportunity and advance first-night task progress so base `MINION_INFO` becomes the next task.
- Keep `assignment` and `currentCharacterState` unchanged.
- Keep player and AI private knowledge projections free of target choices, opportunity internals, inserted task facts, and Snake Charmer settlement internals.
- Do not implement Demon-hit swap, old-Demon poison, drunkenness or poisoning effectiveness, AI decision, UI, Electron, SQLite, or first-night phase completion.

Implementation update:

- `PhilosopherAbilityChoiceNotImplemented` is removed from command rejection codes because Philosopher GOOD-role choice is now implemented.
- Runtime task-plan validation accepts only real inserted tasks derived from `FirstNightTaskInserted`.
- The Snake Charmer opportunity id is deterministic:

```text
first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-<NN>:from-snake_charmer:opportunity-01
```

- The safe visible schema exposes only target selection shape:

```text
canChooseTarget = true
supportedDecisionKinds = [CHOOSE_PLAYER]
targetSchema = ANY_LIVING_PLAYER
```

- Valid non-Demon no-swap batches contain exactly:

```text
SnakeCharmerTargetChosen
SnakeCharmerNoSwapResolved
ScheduledTaskSettled
```

Acceptance:

- Golden base task count remains six and golden base order is unchanged.
- Choosing `snake_charmer` as Philosopher still inserts `SNAKE_CHARMER_ACTION` before `MINION_INFO`.
- The inserted Snake Charmer task can be opened as an action opportunity.
- Non-source Human or AI actors cannot submit the Snake Charmer action.
- Source Human, source AI, Storyteller, and System actors can submit the supported action.
- Unknown targets, malformed decisions, wrong task ids, missing opportunities, closed opportunities, and unsupported role-action tasks are rejected deterministically.
- Choosing a non-Demon target records target choice, no-swap resolution, and task settlement without leaking target role facts.
- Choosing a current Demon target is rejected as `SnakeCharmerDemonHitNotImplemented` and writes no domain events.
- After non-Demon no-swap settlement, `MINION_INFO` and then `DEMON_INFO` can settle in order.
- Replay rejects naked, reversed, mixed, incomplete, overlong, metadata-mismatched, payload-mismatched, Demon-target no-swap, and hidden-role-leaking Snake Charmer batches.
- Player and AI projections do not expose Snake Charmer target choices or no-swap internals.

## Slice 2B9: Snake Charmer Demon-Hit Swap And Poison Marker

Scope:

- Execute only after Slice 2B8 is accepted and merged.
- Replace the active `SnakeCharmerDemonHitNotImplemented` path for Philosopher-gained Snake Charmer actions.
- Record `SnakeCharmerTargetChosen`, `SnakeCharmerDemonSwapApplied`, `AbilityImpairmentApplied`, and `ScheduledTaskSettled` in one atomic demon-hit batch.
- Swap current role and current alignment between the Snake Charmer source and the chosen Demon.
- Increment `CurrentCharacterState.revision` and validate the resulting runtime state without rewriting initial assignment facts.
- Record the old Demon as `AbilityImpairmentApplied(kind = POISONED, sourceKind = SNAKE_CHARMER_DEMON_HIT)`.
- Keep `assignment`, `setup`, `firstNightTaskPlan.taskCatalogSnapshot`, and initial private knowledge unchanged.
- Preserve the non-Demon no-swap path from Slice 2B8.
- Ensure later `MINION_INFO` and `DEMON_INFO` resolve the current evil team from the post-swap revision.
- Keep player and AI projections free of swap, poison, target, task, and opportunity internals.
- Do not implement poisoned or drunk effectiveness evaluation, base Snake Charmer action, AI decision, UI, Electron, SQLite, or first-night phase completion.

Implementation update:

- `SnakeCharmerDemonSwapApplied` records exact current-state snapshots:

```text
sourceBefore
targetBefore
sourceAfter
targetAfter
swapReason = SNAKE_CHARMER_DEMON_HIT
```

- Valid demon-hit batches contain exactly:

```text
SnakeCharmerTargetChosen
SnakeCharmerDemonSwapApplied
AbilityImpairmentApplied
ScheduledTaskSettled
```

- `ScheduledTaskSettled` records:

```text
taskType = SNAKE_CHARMER_ACTION
outcomeType = SNAKE_CHARMER_DEMON_HIT_SWAP
characterStateRevision = nextCharacterStateRevision
```

Acceptance:

- Choosing a current Demon target succeeds and produces the four-event demon-hit batch.
- `sourceAfter` receives the Demon role and alignment.
- `targetAfter` receives the source player's previous role and alignment.
- `currentCharacterState.revision` increments by one.
- The old Demon receives a `POISONED` impairment marker bound to the post-swap revision.
- The old `SnakeCharmerDemonHitNotImplemented` rejection is removed or no longer reachable.
- `MINION_INFO` after the swap tells minions the new Demon identity.
- `DEMON_INFO` after the swap is delivered to the new Demon, not to the old Demon.
- Golden base task count remains six and golden base order is unchanged.
- Replay rejects naked, incomplete, reversed, non-Demon swap, Demon-target no-swap, mismatched swap, mismatched poison, mismatched settlement, mixed-event, and extra-field demon-hit batches.
- Player and AI projections do not expose the swap or poison marker before team information is delivered.

## Slice 2B10: Base Snake Charmer Action And Effectiveness Gate

Scope:

- Execute only after Slice 2B9 is accepted and merged.
- Open base in-play `snake_charmer` first-night `SNAKE_CHARMER_ACTION` tasks.
- Reuse the existing safe Snake Charmer target selection schema for base and Philosopher-gained sources.
- Evaluate source drunkenness or poisoning at settlement time.
- Record ineffective settlements without no-swap or demon-hit mechanical effects when the source is impaired.
- Preserve historical assignment and setup facts while allowing current character state to remain authoritative for settlement.
- Do not implement broader drunk/poison duration rules, AI decisions, UI, Electron, SQLite, or first-night completion.

Implementation update:

- Base and Philosopher-gained Snake Charmer source forms are both accepted by `SubmitSnakeCharmerAction`.
- `SnakeCharmerIneffectiveResolved` records an impaired source no-effect fact.
- `ScheduledTaskSettled.outcomeType = SNAKE_CHARMER_INEFFECTIVE` settles the impaired path.
- The effective non-Demon and Demon-hit paths from Slices 2B8 and 2B9 remain unchanged.

Acceptance:

- Base Snake Charmer can open an action opportunity when it is the next task.
- Source `DRUNK` or `POISONED` impairment prevents no-swap and demon-hit effects.
- Ineffective settlement leaves `assignment` and `currentCharacterState` unchanged.
- Player and AI projections do not expose opportunity, target, swap, poison, or ineffective internals.
- Golden base task count remains six and golden base order is unchanged.

## Slice 2B11: Evil Twin Setup And Pair Knowledge

Scope:

- Execute only after Slice 2B10 is accepted and merged.
- Settle the supported first-night `EVIL_TWIN_SETUP` role setup task.
- Establish one deterministic Evil Twin pair from the current Evil Twin source and the lowest-seat current GOOD candidate.
- Deliver exactly two mutual private knowledge entries so each twin knows only the counterpart identity.
- Settle the scheduled task with `ScheduledTaskSettled.outcomeType = EVIL_TWIN_PAIR_ESTABLISHED`.
- Keep `assignment` and `currentCharacterState` unchanged.
- Keep player and AI private projections free of full pair facts, roles, assignment, pairing policy, and task internals.
- Do not implement Evil Twin victory conditions, death interactions, Vigormortis special rules, AI decisions, UI, Electron, SQLite, or first-night completion.

Implementation update:

- `SettleEvilTwinSetup` is the new command for this slice.
- Valid Evil Twin setup batches contain exactly:

```text
EvilTwinPairEstablished
EvilTwinInformationDelivered
ScheduledTaskSettled
```

- Pairing uses `pairingPolicyVersion = evil-twin-pairing-policy-v1`.
- Private knowledge uses `knowledgeModelVersion = evil-twin-knowledge-model-v1` and `knowledgeStage = EVIL_TWIN_SETUP_INFORMATION`.

Acceptance:

- Evil Twin setup succeeds only when the next unsettled task is `EVIL_TWIN_SETUP`.
- The source must still be current `evil_twin` and current `EVIL`.
- If no legal current GOOD candidate exists, the command is rejected as `NoLegalEvilTwinPair`.
- After settlement, `WITCH_ACTION` becomes the next task in the current supported no-Philosopher path.
- Replay rejects naked, reversed, incomplete, wrong-outcome, wrong-revision, mismatched-pair, and malformed-knowledge batches.
- Player and AI views expose only `evilTwinCounterpart` to the two twin players.

## Slice 2B12: Witch Action Target Selection And Deferred Death Marker

Scope:

- Execute only after Slice 2B11 is accepted and merged.
- Open base in-play `witch` first-night `WITCH_ACTION` tasks as safe `ActionOpportunity` facts.
- Accept `SubmitWitchAction({ kind: "CHOOSE_PLAYER", targetPlayerId })` from the source player, Storyteller, or System.
- Record `WitchTargetChosen` for both effective and ineffective paths without target role, target alignment, death prediction, or effectiveness leakage.
- Evaluate source DRUNK or POISONED impairment at settlement time.
- If effective, record `WitchDeathPendingMarked` with `trigger = TARGET_NOMINATES_TOMORROW`.
- If impaired, record `WitchIneffectiveResolved` and do not create a pending death marker.
- Settle the scheduled task with `WITCH_DEATH_PENDING_MARKED` or `WITCH_INEFFECTIVE`.
- Keep `assignment`, `currentCharacterState`, and the original task plan unchanged.
- Keep player and AI private projections free of Witch action, target, pending death, impairment, task, and opportunity internals.
- Do not implement daytime nomination, actual death, three-alive Witch ability loss, AI target choice, UI, Electron, SQLite, or first-night completion.

Implementation update:

- `packages/domain-core/src/witch.ts` owns Witch target choice, pending death, ineffective resolution, effectiveness, and replay helpers.
- The Witch opportunity id is deterministic:

```text
first-night-v1:WITCH_ACTION:seat-<NN>:opportunity-01
```

- The safe visible schema exposes only target selection shape:

```text
canChooseTarget = true
supportedDecisionKinds = [CHOOSE_PLAYER]
targetSchema = ANY_PLAYER
```

- Effective Witch batches contain exactly:

```text
WitchTargetChosen
WitchDeathPendingMarked
ScheduledTaskSettled
```

- Ineffective Witch batches contain exactly:

```text
WitchTargetChosen
WitchIneffectiveResolved
ScheduledTaskSettled
```

Acceptance:

- Base Witch can open an action opportunity when it is the next task.
- Any roster player can be chosen as target, including self, because death/living restrictions are not modeled yet.
- Source Human and AI actors must match the opportunity source player; Storyteller and System can submit.
- Source `DRUNK` or `POISONED` prevents pending death marker creation.
- Ineffective settlement still records `WitchTargetChosen`.
- Effective settlement records exactly one pending death marker.
- After Witch settlement, `DREAMER_ACTION` becomes the next task in the current supported no-Philosopher path.
- `SettleFirstNightSystemTask` cannot skip Dreamer and `OpenFirstNightRoleActionOpportunity(DREAMER_ACTION)` remains unsupported until a later slice.
- Golden base task count remains six and golden base order is unchanged.
- Replay rejects naked, reversed, mixed, mismatched, wrong-outcome, wrong-impairment, and hidden-field Witch batches.
- Player and AI projections do not expose Witch action or deferred death internals.

## Slice 2B13: Dreamer Action Opportunity And Information Skeleton

Scope:

- Execute only after Slice 2B12 is accepted and merged.
- Open base in-play `dreamer` first-night `DREAMER_ACTION` tasks as safe `ActionOpportunity` facts.
- Accept `SubmitDreamerAction({ kind: "CHOOSE_PLAYER", targetPlayerId })` from the source player, Storyteller, or System.
- Record `DreamerTargetChosen` without target role, target alignment, correct-answer, false-role, impairment, or effectiveness leakage.
- Record `DreamerInformationDelivered` with one GOOD role and one EVIL role.
- For effective information, require one delivered role to be the target's current role.
- For source-impaired information, still deliver one GOOD role and one EVIL role, but mark the canonical event as unreliable due to source impairment.
- Settle the scheduled task with `DREAMER_INFORMATION_DELIVERED`.
- Keep `assignment`, `currentCharacterState`, and the original task plan unchanged.
- Project Dreamer information only to the Dreamer source player, without reliability, impairment, false-role policy, or correct-role metadata.
- Do not implement Vortox, Storyteller free false-role choice, AI target choice, UI, Electron, SQLite, Seamstress resolution, or first-night completion.

Implementation update:

- `packages/domain-core/src/dreamer.ts` owns Dreamer target choice, information delivery, false-role policy, effectiveness, validation, and replay helpers.
- The Dreamer opportunity id is deterministic:

```text
first-night-v1:DREAMER_ACTION:seat-<NN>:opportunity-01
```

- The safe visible schema exposes only target selection shape:

```text
canChooseTarget = true
supportedDecisionKinds = [CHOOSE_PLAYER]
targetSchema = OTHER_NON_TRAVELLER_PLAYER
```

- Valid Dreamer batches contain exactly:

```text
DreamerTargetChosen
DreamerInformationDelivered
ScheduledTaskSettled
```

Acceptance:

- Base Dreamer can open an action opportunity when it is the next task.
- The target must be a roster and current-character-state player other than the Dreamer source.
- Source Human and AI actors must match the opportunity source player; Storyteller and System can submit.
- Effective GOOD targets place the target's current role in `goodRole`.
- Effective EVIL targets place the target's current role in `evilRole`.
- Source `DRUNK` or `POISONED` still delivers Dreamer information and marks the canonical reliability as `SOURCE_IMPAIRED`.
- Private projections hide reliability, source impairment, false-role policy, current character state, assignment, and correctness metadata.
- After Dreamer settlement, `SEAMSTRESS_ACTION` becomes the next task in the supported no-Philosopher path.
- `SettleFirstNightSystemTask` cannot skip Seamstress and `OpenFirstNightRoleActionOpportunity(SEAMSTRESS_ACTION)` remains unsupported until a later slice.
- Golden base task count remains six and golden base order is unchanged.
- Replay rejects naked, reversed, mixed, mismatched, wrong-reliability, wrong-role, and hidden-field Dreamer batches.

## Slice 2B14: Seamstress First-Night DEFER Skeleton

Scope:

- Execute only after Slice 2B13 is accepted and merged.
- Open only base in-play `seamstress` first-night `SEAMSTRESS_ACTION` tasks as safe `ActionOpportunity` facts.
- Accept only `SubmitSeamstressAction({ kind: "DEFER" })` from the matching source player, Storyteller, or System.
- Record `SeamstressActionDeferred` and settle the current wake with `SEAMSTRESS_DEFERRED` in one exact two-event batch.
- Close the opportunity without selecting players, producing same-alignment information, or creating ability-use or ability-spent state.
- Keep `assignment`, `setup`, `currentCharacterState`, the original task plan, impairment facts, and private knowledge unchanged.
- Keep player and AI private projections structurally unchanged.
- Do not implement `CHOOSE_TWO_PLAYERS`, target legality, information truth or reliability, registration, impairment, Vortox, Barista, other-night recurrence, Philosopher-gained execution, AI choice, UI, Electron, persistence, or first-night completion.

Implementation update:

- The deterministic opportunity id is:

```text
first-night-v1:SEAMSTRESS_ACTION:seat-<NN>:opportunity-01
```

- The safe visible schema exposes only the supported deferral and names the future unsupported choice:

```text
canDefer = true
supportedDecisionKinds = [DEFER]
futureUnsupportedDecisionKinds = [CHOOSE_TWO_PLAYERS]
```

- Valid Seamstress deferral batches contain exactly:

```text
SeamstressActionDeferred
ScheduledTaskSettled(outcomeType = SEAMSTRESS_DEFERRED)
```

Acceptance:

- Base Seamstress can open an action opportunity only when it is the next unsettled task; Philosopher-gained Seamstress execution remains rejected.
- Source Human and AI actors must match the opportunity source player; Storyteller and System can submit.
- Exact `DEFER` closes the opportunity and settles the task without creating information or ability-spent state.
- `CHOOSE_TWO_PLAYERS` rejects as unsupported; malformed, extra, hidden, mismatched, and unauthorized inputs reject deterministically without domain events.
- Replay and prospective validation reject naked, reversed, overlong, mixed, duplicate, malformed, and cross-field-mismatched batches.
- Player and AI projections do not expose Seamstress action, source, decision, task, opportunity, impairment, truth, reliability, or registration internals.
- Catalog definitions and signature remain unchanged at `canonical-first-night-task-catalog-v1:20514c1a`; the supported subset proves only that Dreamer precedes Seamstress.
- Steward and the full official-order evidence regression remain unsupported.
- This slice covers only the first-night deferral/non-consumption half of evidence test 3 and the unsupported-input boundary portion of evidence test 5.
- Overall Seamstress coverage remains `SKELETON`; only its base first-night opportunity and `DEFER` dimension is partial.

## Slice 2B15: Seamstress First-Night Choice And Private Information

Scope:

- Execute only after Slice 2B14 is accepted and merged and after fresh 2B15 evidence plus independent v3/v3.1 `RULE_DESIGN_PASS`.
- Declare a public Seamstress V2 resolution capability during supported script selection without inspecting hidden setup or assignment.
- Preserve exact V1 replay and defer-only behavior for legacy streams without the capability.
- Create V2 opportunities for base and Philosopher-granted first-night Seamstress task sources through one stable tenure/instance/entitlement model.
- Accept exactly two distinct non-self modeled players, canonicalize them by numeric seat, spend the referenced once-per-game entitlement, deliver private same-alignment information, and settle in one atomic batch.
- Evaluate target alignments, represented impairment facts, and the represented active Vortox constraint at settlement revision `M`, while preserving opportunity revision `N` and continuous source-tenure identity across `[N, M]`.
- Project validated historical targets and delivered answer only to the source player and source AI.
- Return only event type/count summaries for accepted Seamstress commands while keeping full canonical event envelopes in the event store.
- Enforce exact structural command identity for idempotency without exposing canonical command strings or digests.

Implementation update:

- New supported script selection batches contain exactly:

```text
ScriptSelected
SeamstressResolutionCapabilityDeclared
PhaseTransitioned
```

- Legacy two-event script-selection batches remain replayable. Only streams with the exact public capability can create a V2 Seamstress opportunity.
- V2 opportunity visibility is exactly:

```text
visibilitySchemaVersion = seamstress-first-night-action-v2
resolutionCapabilityVersion = seamstress-snv-first-night-resolution-v1
canDefer = true
canChooseTargets = true
supportedDecisionKinds = [DEFER, CHOOSE_TWO_PLAYERS]
futureUnsupportedDecisionKinds = []
targetSchema = EXACTLY_TWO_DISTINCT_OTHER_MODELED_PLAYERS
```

- Base and Philosopher-granted sources use distinct deterministic opportunity IDs and ability-instance source branches. Ability-instance IDs contain tenure/grant identity, never scheduled-task identity.
- A legal choice batch contains exactly:

```text
SeamstressTargetsChosen
SeamstressAbilitySpent
SeamstressInformationDelivered
ScheduledTaskSettled(outcomeType = SEAMSTRESS_INFORMATION_DELIVERED)
```

- V1 and V2 `DEFER` retain the exact two-event `SeamstressActionDeferred` plus `ScheduledTaskSettled(SEAMSTRESS_DEFERRED)` shape and do not spend.
- Represented `DRUNK` or `POISONED` evidence makes effectiveness `KNOWN_INEFFECTIVE`, but a legal use still spends. With no represented impairment, effectiveness is `NOT_PROVEN`, never `EFFECTIVE`.
- An active represented Vortox tenure selects the false-only legal candidate even when the source is impaired. Without that constraint, the truth-favoring policy selects the true candidate.
- No Dashii presence does not derive poison or change acceptance/event shape; continuous poison remains unresolved.
- Source private history is an ordered array of `{ targets, deliveredAnswer }`. Stored opportunity, choice, spend, delivery, and settlement facts must correlate exactly before projection.
- Accepted Seamstress results use `accepted-event-summary-v1` and expose only ordered event types/count. Other command accepted results remain unchanged.
- New accepted and rejected receipts store `supported-command-structural-fingerprint-v1`. Exact canonical command strings decide equality; SHA-256 only checks integrity. Missing, malformed, or different fingerprints fail closed as `CommandIdempotencyConflict` and are not overwritten.

Acceptance:

- V1/V2 opportunity and defer schemas reject missing, extra, hybrid, or wrong-version fields.
- Base and Philosopher-granted V2 choices share the same target, spend, information, replay, and projection pipeline while retaining independent entitlements.
- Target count, density, identity, non-self rule, existence, roster correlation, and numeric-seat canonical order are validated before event creation.
- Duplicate spend and stale leave/reacquire opportunities reject; exact source continuity permits `M > N` only while the same tenure remains active.
- Choice, spend, delivery, and settlement share one exact task/opportunity/source/tenure/instance/entitlement/target/revision chain.
- Equal native alignments store rule-correct `YES`; mixed native alignments store rule-correct `NO`; Vortox forces the delivered false candidate under the represented model.
- Accepted summaries have the same eight-key shape and four ordered event types across unmodified, represented-impaired, No-Dashii-containing, and Vortox assignments, with no modifier or payload leakage.
- Same command ID plus the same captured structure returns the original receipt idempotently. A different structure conflicts without events, receipt overwrite, or fingerprint disclosure.
- Replay rejects malformed, incomplete, reordered, overlong, mixed, duplicate-spend, cross-linked, revision-mismatched, and tenure-mismatched chains.
- Multiple validated deliveries project in canonical history order; later current-role or alignment changes do not recompute stored information.
- Player/AI views and accepted summaries exclude correct answer, target alignments, truth, impairment, effectiveness, Vortox, reliability, candidate, task, opportunity, tenure, instance, and entitlement internals.
- Overall Seamstress coverage advances only to `PARTIAL`.

Non-goals:

- No other-night scheduling or recurrence.
- No life, death, revival, or Traveller model.
- No Spy/Recluse registration, Barista execution, No Dashii neighbor/poison derivation, or general role/effect lifecycle.
- No Storyteller free answer policy, AI target choice, UI, Electron, SQLite, network, production persistence adapter, or global accepted-result migration.

## Slice 2C: Integrated Basic Phase Flow

Scope:

- Execute only after real setup, roster, assignment, and initial private knowledge events exist.
- Move from first night initialization toward executable first-night task planning.
- Move from first night to first day.
- Add nomination, voting, day end, ordinary night, and dawn transitions.
- Validate one complete day/night loop.

Acceptance:

- One basic day/night cycle is testable using real setup and assignment facts.
- Execution and death remain separate events.
- No incomplete setup fact is written into the authoritative event log.

## Slice 3: Command Validation Surface

Scope:

- Validate nomination, vote, execution, and phase commands.
- Reject illegal actor and phase commands.
- Record rejected commands as audit, not domain facts.

Acceptance:

- Dead player nomination rejection is tested.
- Ghost vote consumption behavior is testable.

## Slice 4: Projection Safety

Scope:

- Build public projection and one player projection from canonical state.
- Add forbidden-field leakage tests.

Acceptance:

- Player projection does not contain hidden assignments, truth statuses, or hidden effect causes.

## Slice 5: One Verified Interaction

Scope:

- Choose a narrow `VERIFIED_CORE` interaction only after Slice 1-5 pass.
- Recommended first candidate: nomination, voting, execution, and Evil Twin victory check, because it stresses execution/victory separation without broad night scheduling.

Acceptance:

- Uses existing test ids.
- Does not introduce `PARTIAL` role implementation.

## Stop Conditions

- Stop if a rule conflict appears.
- Stop if projection leakage is detected.
- Stop if a slice needs UI or AI to pass.
- Stop before adding broad role ability coverage.
