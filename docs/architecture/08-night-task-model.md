# Rule Task Model

## Goal

The old umbrella `NightTask` term is replaced by four explicit execution models:

- `ScheduledTask`
- `ActionOpportunity`
- `EventSubscription`
- `ContinuousRule`

This prevents passive or continuous abilities from being forced into a night-task queue and removes the need for a permanent global night order array.

## ScheduledTask

Use `ScheduledTask` for night actions that require player, AI, or Storyteller input in a scheduled window.

Examples:

- Dreamer choosing a player.
- Witch choosing a target.
- Cerenovus choosing a player and good character.
- Pit-Hag choosing a player and character.
- Demon night kill.
- Barber-created demon choice at night.
- Seamstress optional once-per-game night choice.

Fields:

```text
ScheduledTask(
  taskId,
  gameId,
  ownerPlayerId,
  sourceRoleId,
  sourceAbilityId,
  scheduleWindow,
  slotKey,
  triggerEventId,
  visibleInputSchema,
  visibleOptions,
  hiddenValidationRules,
  storytellerLegalCandidates,
  presentationRequired,
  simulationAllowed,
  status,
  queuedAtVersion,
  presentedAtVersion,
  inputReceivedAtVersion,
  resolvedAtVersion,
  abilityEvaluationIds
)
```

## ActionOpportunity

Use `ActionOpportunity` for optional day actions and player-initiated abilities outside the scheduled night queue.

Examples:

- Artist asking a yes/no question.
- Savant visiting the Storyteller.
- Juggler public first-day guesses.
- Klutz public choice when they learn they died.

`ActionOpportunity` has the same visible/hidden candidate boundary as `ScheduledTask`, but is opened by phase, trigger, or knowledge timing instead of a night slot.

## EventSubscription

Use `EventSubscription` for abilities that listen to domain events and may create follow-up events or opportunities.

Examples:

- Sage triggered by being killed by the Demon.
- Sweetheart triggered by death.
- Witch curse triggered by the cursed player nominating.
- Evil Twin triggered by good twin execution.
- Vortox day-end no-execution check.
- Fang Gu death replacement when killing the first Outsider.

Event subscriptions must declare:

- subscribed event types;
- source ability;
- activation predicate;
- hidden validation rules;
- output candidate builder;
- whether Storyteller choice is needed.

## ContinuousRule

Use `ContinuousRule` for active rule pressure that is recalculated from current canonical state.

Examples:

- No Dashii nearest Townsfolk poisoning.
- Vortox forced false Townsfolk information.
- Vigormortis dead-minion ability retention and neighbor poisoning.
- Evil Twin ordinary Good-win blocker.
- Witch losing ability and curse removal at three alive.

Continuous rules may derive `EffectInstance` records. They are not queue items and are not considered completed once per night.

## Deprecated Task Types

The following labels may remain as imported rule metadata, but must not be used as executable night task types:

- `DAY_PASSIVE`
- `CONTINUOUS_PASSIVE`

Map them to `ActionOpportunity`, `EventSubscription`, or `ContinuousRule` during architecture and implementation.

## Dynamic Insertion

Role changes can create new `ScheduledTask` instances if the relevant scheduled slot has not passed. If the slot has passed, the opportunity waits until the next applicable window. Philosopher gaining a start-knowing ability remains a special immediate processing case from the baseline.

## Presentation Versus Settlement

Presentation is not effectiveness. A task may be presented because simulation is required, while the ability later proves ineffective.

Do not store `abilityActive` as a permanent task fact. Use `AbilityEvaluation` at least:

- before task presentation;
- after input receipt;
- before final settlement.

Every task settlement must reference the `AbilityEvaluation` used.

## Hidden Candidate Safety

Player and AI views receive `visibleInputSchema` and `visibleOptions` only. Hidden target legality, hidden role checks, Storyteller legal candidates, and truth-bearing reasons stay inside the domain kernel or Storyteller view.

No UI or AI prompt may reveal hidden truth by disabling options that are only invalid because of hidden information.
