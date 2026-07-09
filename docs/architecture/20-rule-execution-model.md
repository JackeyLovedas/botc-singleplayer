# Rule Execution Model

## Purpose

The rule execution model explains how `ScheduledTask`, `ActionOpportunity`, `EventSubscription`, and `ContinuousRule` work together without leaking hidden information or storing stale ability effectiveness.

## Four Execution Models

| Model | Used For | Examples |
| --- | --- | --- |
| `ScheduledTask` | Scheduled night input or presentation | Dreamer, Witch, Cerenovus, Pit-Hag, Demon kill |
| `ActionOpportunity` | Player-initiated day or timing-based action | Artist, Savant, Juggler, Klutz |
| `EventSubscription` | Reactions to domain events | Sage, Sweetheart, Witch curse, Evil Twin, Fang Gu |
| `ContinuousRule` | Ongoing recalculated rule pressure | No Dashii, Vortox, Vigormortis, Evil Twin win blocker |

`DAY_PASSIVE` and `CONTINUOUS_PASSIVE` are not executable task types. They are imported rule metadata that must map into `EventSubscription` or `ContinuousRule`.

## Shared Input Boundary

Any model that can receive player, AI, or Storyteller input must split:

```text
visibleInputSchema
visibleOptions
hiddenValidationRules
storytellerLegalCandidates
```

Rules:

- Player and AI projections receive only visible schema and safe visible options.
- Hidden validation runs inside the domain kernel on canonical state.
- Storyteller view may include full legal candidates and hidden reasons.
- UI option availability must not leak hidden role, alignment, poisoning, drunkenness, registration, or truth constraints.

## AbilityEvaluation

Ability effectiveness is evaluated at settlement time, not stored as a permanent task fact.

```text
AbilityEvaluation(
  evaluationId,
  evaluatedAtEventVersion,
  sourceAbilityId,
  effective,
  suppressionSources,
  retentionSources,
  explanation
)
```

Evaluate at least:

- before task presentation;
- after input receipt;
- before final settlement.

Any task or opportunity settlement must record which `AbilityEvaluation` it used.

## ScheduledTask Flow

```text
build scheduled task candidates
-> evaluate presentation requirement
-> publish visible schema/options
-> receive input
-> re-evaluate ability
-> apply hidden validation
-> build effect/information/death/change candidates
-> record Storyteller decision if needed
-> append domain events
```

Example: a poisoned Cerenovus may be presented and may choose a target, but final settlement records ineffective ability and creates no `MadnessRequirement`.

## First-Night Task Plan Skeleton

Slice 2B4 implements only the planning boundary for first-night `ScheduledTask` values.

The current plan model records:

- a fixed first-night task catalog snapshot;
- deterministic task ids;
- `FirstNightTaskOrderKey(baseOrder, insertionOrder)`;
- `PENDING` status only;
- source facts for role tasks;
- system task markers for `MINION_INFO` and `DEMON_INFO`;
- settlement policies that force source or evil-team re-resolution at settlement time.

The base order is:

```text
100  PHILOSOPHER_ACTION
200  MINION_INFO
300  DEMON_INFO
400  SNAKE_CHARMER_ACTION
500  EVIL_TWIN_SETUP
600  WITCH_ACTION
700  CERENOVUS_ACTION
800  CLOCKMAKER_INFORMATION
900  DREAMER_ACTION
1000 SEAMSTRESS_ACTION
1100 MATHEMATICIAN_INFORMATION
```

`MINION_INFO` and `DEMON_INFO` are system information tasks. They do not freeze recipients, demon identity, minion identities, or demon bluffs in the task plan. Those facts must be resolved when the task settles.

Role tasks use `REEVALUATE_SOURCE_AT_SETTLEMENT`. System information tasks use `RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT`.

Slice 2B5 adds settlement only for the two system information tasks:

```text
SettleFirstNightSystemTask
-> confirm requested task is the next unsettled supported system task
-> resolve current evil team from CurrentCharacterStateSet
-> freeze DeliveredEvilTeamSnapshot for this delivery
-> create MinionInformationDelivered or DemonInformationDelivered
-> create ScheduledTaskSettled in the same batch
-> append FirstNightTaskProgress from replay
```

`ScheduledTaskSettled` is a progress fact, not a replacement for the original task plan. It records task id, task type, night number, settlement version, outcome type, and current character state revision. It must be paired with the matching information delivery event in the same batch.

Slice 2B6 adds settlement only for Philosopher DEFER:

```text
OpenFirstNightRoleActionOpportunity
-> confirm PHILOSOPHER_ACTION is the next unsettled role action task
-> create deterministic FirstNightActionOpportunityCreated

SubmitPhilosopherAction(DEFER)
-> validate opportunity, actor, source role snapshot, and character-state revision
-> create PhilosopherActionDeferred
-> create ScheduledTaskSettled(outcomeType = PHILOSOPHER_DEFERRED) in the same batch
-> append FirstNightTaskProgress from replay
```

`FirstNightActionOpportunityCreated` is a single-event batch. `PhilosopherActionDeferred` is valid only when immediately followed by its matching `ScheduledTaskSettled` event. The DEFER path closes the opportunity and settles the current wake. It does not consume the Philosopher once-per-game ability, grant another ability, make the original role drunk, insert dynamic tasks, or execute any other role ability.

Slice 2B7 adds settlement for Philosopher ability choice:

```text
SubmitPhilosopherAction(CHOOSE_GOOD_CHARACTER)
-> validate chosen role exists in the setup role catalog and is GOOD
-> create PhilosopherAbilityChosen
-> create PhilosopherAbilityGranted
-> if the chosen role is currently in play, create AbilityImpairmentApplied(kind = DRUNK)
-> if the chosen role has a mapped first-night task, create FirstNightTaskInserted
-> create ScheduledTaskSettled(outcomeType = PHILOSOPHER_ABILITY_CHOSEN) in the same batch
-> append FirstNightTaskProgress from replay
```

Valid ability-choice batches are:

```text
PhilosopherAbilityChosen
PhilosopherAbilityGranted
[AbilityImpairmentApplied]
[FirstNightTaskInserted]
ScheduledTaskSettled
```

The impairment event is required exactly when the chosen role is currently in play. The insertion event is required exactly when the chosen role maps to a gained first-night task.

Mapped gained first-night tasks:

```text
clockmaker      -> CLOCKMAKER_INFORMATION
dreamer         -> DREAMER_ACTION
snake_charmer   -> SNAKE_CHARMER_ACTION
seamstress      -> SEAMSTRESS_ACTION
mathematician   -> MATHEMATICIAN_INFORMATION
```

Inserted tasks use `orderKey = { baseOrder: 100, insertionOrder: 1 }`, so they are ordered after the Philosopher wake and before base `MINION_INFO`. Inserted tasks remain pending in Slice 2B7. This slice records the granted ability and duplicate-role impairment marker, but it does not apply drunkenness effects, execute the gained ability, perform Snake Charmer exchange, or mutate `assignment` or `currentCharacterState`.

Slice 2B8 adds the first settlement path for a Philosopher-gained Snake Charmer task:

```text
OpenFirstNightRoleActionOpportunity
-> confirm the next unsettled task is a PHILOSOPHER_GAINED_ABILITY SNAKE_CHARMER_ACTION
-> create deterministic FirstNightActionOpportunityCreated(opportunityKind = SNAKE_CHARMER_FIRST_NIGHT_ACTION)

SubmitSnakeCharmerAction(CHOOSE_PLAYER)
-> validate source actor, open opportunity, task id, current next task, and target player
-> if the target is not the current Demon, create SnakeCharmerTargetChosen
-> create SnakeCharmerNoSwapResolved
-> create ScheduledTaskSettled(outcomeType = SNAKE_CHARMER_NON_DEMON_NO_SWAP) in the same batch
-> append FirstNightTaskProgress from replay
```

The Snake Charmer visible action schema is intentionally safe:

```text
canChooseTarget = true
supportedDecisionKinds = [CHOOSE_PLAYER]
targetSchema = ANY_LIVING_PLAYER
```

It does not expose target role, target alignment, whether the target is a Demon, whether a swap will occur, the full assignment, or the current character state.

Valid non-Demon no-swap batches are:

```text
SnakeCharmerTargetChosen
SnakeCharmerNoSwapResolved
ScheduledTaskSettled
```

The no-swap branch closes the opportunity, settles only the inserted Snake Charmer task, leaves `assignment` and `currentCharacterState` unchanged, and allows the next base task to become `MINION_INFO`.

Slice 2B9 adds the Demon-hit branch for the same Philosopher-gained Snake Charmer task:

```text
SubmitSnakeCharmerAction(CHOOSE_PLAYER)
-> validate source actor, open opportunity, task id, current next task, and target player
-> if the target is the current Demon, create SnakeCharmerTargetChosen
-> create SnakeCharmerDemonSwapApplied
-> create AbilityImpairmentApplied(kind = POISONED, sourceKind = SNAKE_CHARMER_DEMON_HIT)
-> create ScheduledTaskSettled(outcomeType = SNAKE_CHARMER_DEMON_HIT_SWAP) in the same batch
-> append FirstNightTaskProgress from replay
```

Valid Demon-hit batches are:

```text
SnakeCharmerTargetChosen
SnakeCharmerDemonSwapApplied
AbilityImpairmentApplied
ScheduledTaskSettled
```

`SnakeCharmerDemonSwapApplied` mutates only `CurrentCharacterStateSet`:

```text
sourceAfter.role = targetBefore.role
sourceAfter.currentAlignment = targetBefore.currentAlignment
targetAfter.role = sourceBefore.role
targetAfter.currentAlignment = sourceBefore.currentAlignment
nextCharacterStateRevision = previousCharacterStateRevision + 1
```

`assignment`, `setup`, the original task catalog snapshot, and initial private knowledge remain historical facts. The old Demon poison marker is recorded as a fact, but poisoned or drunk effectiveness evaluation, base Snake Charmer action support, and AI target selection remain unimplemented.

Slice 2B10 adds base Snake Charmer action support and source-effectiveness gating:

```text
OpenFirstNightRoleActionOpportunity
-> confirm the next unsettled task is either base ROLE SNAKE_CHARMER_ACTION or a PHILOSOPHER_GAINED_ABILITY SNAKE_CHARMER_ACTION
-> create deterministic FirstNightActionOpportunityCreated(opportunityKind = SNAKE_CHARMER_FIRST_NIGHT_ACTION)

SubmitSnakeCharmerAction(CHOOSE_PLAYER)
-> validate actor, open opportunity, task id, current next task, source snapshot, and target player
-> record SnakeCharmerTargetChosen
-> evaluate source DRUNK or POISONED impairment at settlement time
-> if impaired, create SnakeCharmerIneffectiveResolved
-> create ScheduledTaskSettled(outcomeType = SNAKE_CHARMER_INEFFECTIVE)
```

The impaired path is a no-effect branch. It does not create no-swap or demon-hit effects, does not mutate `currentCharacterState`, does not mutate `assignment`, and does not expose impairment internals to player or AI private views.

Valid impaired Snake Charmer batches are:

```text
SnakeCharmerTargetChosen
SnakeCharmerIneffectiveResolved
ScheduledTaskSettled
```

Slice 2B11 adds settlement for the Evil Twin setup task:

```text
SettleEvilTwinSetup
-> confirm the next unsettled task is EVIL_TWIN_SETUP
-> revalidate the task source as current evil_twin with current EVIL alignment
-> select the lowest-seat current GOOD player who is not the Evil Twin source
-> create EvilTwinPairEstablished(pairingPolicyVersion = evil-twin-pairing-policy-v1)
-> create EvilTwinInformationDelivered(knowledgeModelVersion = evil-twin-knowledge-model-v1)
-> create ScheduledTaskSettled(outcomeType = EVIL_TWIN_PAIR_ESTABLISHED)
-> append FirstNightTaskProgress from replay
```

Valid Evil Twin setup batches are:

```text
EvilTwinPairEstablished
EvilTwinInformationDelivered
ScheduledTaskSettled
```

`EvilTwinPairEstablished` is the canonical pair fact and records task id, night number, both player references, both role snapshots, both current alignments, the current character-state revision, and the pairing policy version. `EvilTwinInformationDelivered` records exactly two mutual `EVIL_TWIN_PAIR` entries, each containing only the recipient and counterpart player reference.

The private projection may expose `evilTwinCounterpart` only to the two paired players. It must not expose counterpart role, counterpart alignment, full pair fact, assignment, `currentCharacterState`, `pairId`, `pairingPolicyVersion`, task id, or Storyteller-only selection reasons. Evil Twin victory conditions, death interactions, Vigormortis special rules, AI decisions, and first-night completion remain unimplemented.

Slice 2B12 adds settlement for the base Witch first-night action task:

```text
OpenFirstNightRoleActionOpportunity
-> confirm the next unsettled task is base ROLE WITCH_ACTION
-> create deterministic FirstNightActionOpportunityCreated(opportunityKind = WITCH_FIRST_NIGHT_ACTION)

SubmitWitchAction(CHOOSE_PLAYER)
-> validate actor, open opportunity, task id, current next task, source snapshot, and roster target
-> record WitchTargetChosen
-> evaluate source DRUNK or POISONED impairment at settlement time
-> if effective, create WitchDeathPendingMarked(trigger = TARGET_NOMINATES_TOMORROW)
-> if impaired, create WitchIneffectiveResolved
-> create ScheduledTaskSettled(outcomeType = WITCH_DEATH_PENDING_MARKED | WITCH_INEFFECTIVE)
```

The Witch visible action schema is intentionally safe:

```text
canChooseTarget = true
supportedDecisionKinds = [CHOOSE_PLAYER]
targetSchema = ANY_PLAYER
```

It does not expose target role, target alignment, whether the target will die, source impairment, effectiveness, assignment, or current character state.

Valid effective Witch batches are:

```text
WitchTargetChosen
WitchDeathPendingMarked
ScheduledTaskSettled
```

Valid impaired Witch batches are:

```text
WitchTargetChosen
WitchIneffectiveResolved
ScheduledTaskSettled
```

`WitchDeathPendingMarked` records only a deferred marker for a future daytime nomination trigger. Slice 2B12 does not implement the trigger, actual death, living-player target filtering, the Witch three-alive rule, or AI target choice. The ineffective path records the chosen target as an auditable input fact, then records no effect and creates no pending death marker. Both branches keep `assignment`, `currentCharacterState`, and the original task plan unchanged.

Player and AI private projections must not expose `WitchTargetChosen`, `WitchDeathPendingMarked`, `WitchIneffectiveResolved`, `targetPlayerId`, `pendingDeathId`, `trigger`, `sourceImpairmentId`, `SOURCE_DRUNK`, `SOURCE_POISONED`, task id, or opportunity id.

### Settlement And Snapshot Revision Binding

System team information settlement requires three revision facts to agree:

```text
InformationDelivered.characterStateRevision
InformationDelivered.resolvedEvilTeam.characterStateRevision
ScheduledTaskSettled.characterStateRevision
```

The settlement validator still uses `CurrentCharacterStateSet` to resolve the current demon and minions at the moment of settlement.

Stored-fact projection validation uses the delivered snapshot plus the matching settlement. It does not recalculate historical team knowledge from the latest current character state.

### Different Tasks May Use Different Character Revisions

`MINION_INFO` and `DEMON_INFO` are separate scheduled tasks. A future role-change implementation may produce a new current character revision between them.

That means:

- `MINION_INFO` can be bound to revision `N`;
- `DEMON_INFO` can be bound to revision `N + 1`;
- each delivered event remains bound to its own `DeliveredEvilTeamSnapshot`;
- projections must preserve each delivered fact independently.

The model still does not execute broad inserted role tasks, create general role ability effects, implement drunk or poison duration expiry, implement Evil Twin victory rules, implement Witch nomination-triggered death, or make AI decisions. The visible role-action schemas currently supported are the narrow Philosopher first-night DEFER and GOOD-character choice opportunity, Snake Charmer target-selection opportunities for base and Philosopher-gained sources, and the base Witch target-selection opportunity.

## ActionOpportunity Flow

```text
open opportunity
-> publish visible action schema
-> receive player or AI command
-> validate timing and actor
-> evaluate ability
-> resolve information or mechanical effect
-> close or retain opportunity
```

Example: Artist can ask a yes/no question during the day; the information result uses `InformationEvaluation`, not a single truth label.

## EventSubscription Flow

```text
domain event appended
-> find matching subscriptions
-> evaluate source ability
-> apply trigger predicate
-> produce follow-up domain events or opportunities
```

Example: Sage listens for a Demon-kill death event. Pit-Hag arbitrary death killing Sage does not satisfy the subscription.

## ContinuousRule Flow

```text
state changed
-> identify affected continuous rules
-> evaluate source ability
-> recalculate derived effects or constraints
-> append effect lifecycle events if changed
```

Example: No Dashii recalculates nearest Townsfolk when role changes or No Dashii loses ability. It must not clear all poison sources on the target.

## Hidden Candidate Examples

- Dreamer sees target selection options that do not reveal whether a target is a Demon or poisoned.
- Cerenovus sees visible legal target shape, while hidden validation checks whether the selected character is a current good character icon.
- Storyteller sees all legal false candidates under Vortox; players receive only the delivered information.
- AI receives the same safe visible options as a human player in that seat.
