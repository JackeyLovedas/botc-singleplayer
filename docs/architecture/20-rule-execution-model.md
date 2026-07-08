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
-> create MinionInformationDelivered or DemonInformationDelivered
-> create ScheduledTaskSettled in the same batch
-> append FirstNightTaskProgress from replay
```

`ScheduledTaskSettled` is a progress fact, not a replacement for the original task plan. It records task id, task type, night number, settlement version, outcome type, and current character state revision. It must be paired with the matching information delivery event in the same batch.

The model still does not create active role tasks, visible options, task inputs, role task results, role ability effects, dynamic task insertion, or AI decisions.

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
