# Effect Lifecycle

## EffectInstance

Effects are first-class records, not booleans.

```text
EffectInstance(
  effectId,
  effectType,
  stackingKey,
  stackingPolicy,
  sourcePlayerId,
  sourceRoleId,
  sourceEventId,
  sourceDependencyPolicy,
  targetPlayerId,
  targetScope,
  createdAt,
  startsAt,
  expiresAt,
  activationPredicate,
  recalculationStrategy,
  active,
  suppressionReason,
  resumeCondition,
  removalReason,
  visibility,
  metadata
)
```

## Lifecycle States

```text
Created
-> Active
-> Suppressed
-> Resumed
-> Expired
-> Removed
```

`Expired` means the rule duration ended. `Removed` means a rule condition no longer applies, such as No Dashii losing ability or Witch curse being cleared at three alive players.

## Suppression

An effect can be suppressed when the source ability is drunk, poisoned, dead without retention, transformed, or otherwise disabled. Suppression must preserve enough history to know whether it can resume.

`active` is a derived state at a given event version, not permission to delete other effects. Final player condition such as drunk or poisoned must be derived from all active effect instances targeting that player.

## Stacking And Dependency Fields

| Field | Purpose |
| --- | --- |
| `stackingKey` | Groups effects that contribute to the same final condition, such as `player:7:poisoned` |
| `stackingPolicy` | Defines whether effects are additive, exclusive, replacing, or highest-priority |
| `sourceDependencyPolicy` | Defines whether the effect requires source ability to remain active, survives source death, or is permanent once created |
| `activationPredicate` | Re-evaluates whether the effect is currently active under canonical state |
| `recalculationStrategy` | Defines when to recompute targets, such as on role change, death, phase boundary, or source suppression |

## Stacking Rules

- Multiple drunk or poisoned sources may target the same player at the same time.
- Removing one source must not clear the final condition if another active source remains.
- Do not implement recovery as `player.poisoned = false` or `player.drunk = false`.
- Recompute final player condition from active `EffectInstance` records.
- The projection may show only legally visible symptoms; it must not reveal hidden sources.

Example:

```text
effectivePoisoned(playerId) =
  exists active EffectInstance where targetPlayerId = playerId
  and effectType = POISONED
```

## Source Dependency Policies

| Policy | Meaning | Example |
| --- | --- | --- |
| `REQUIRES_SOURCE_ABILITY_ACTIVE` | Effect disappears or suppresses when the source ability stops being effective | No Dashii poison, Vortox forced false information |
| `SURVIVES_SOURCE_DEATH` | Effect remains after source death unless another rule removes it | Some death-created ongoing effects, subject to role rules |
| `PERMANENT_ONCE_CREATED` | Effect does not depend on the source after creation | Fang Gu once token consumption |
| `UNTIL_DURATION_EXPIRES` | Effect ends at a phase or event boundary | Witch curse duration |
| `RECALCULATED_FROM_CANONICAL` | Effect targets are derived from current state, not manually retained | No Dashii nearest Townsfolk |

## Recalculation Triggers

- Character changed.
- Alignment changed.
- Player died.
- Source ability gained or lost.
- Drunk or poisoned state changed.
- Alive count changed.
- Day/night boundary changed.
- Setup-derived relation changed through role change.

## Required Effect Examples

| Effect | Source | Lifecycle Note |
| --- | --- | --- |
| Sweetheart drunk | Sweetheart death | Not created if Sweetheart was poisoned or drunk |
| No Dashii poison | No Dashii continuous ability | Recalculates nearest Townsfolk; removed when No Dashii loses ability |
| Vigormortis dead-minion ability | Vigormortis kill | Removed when Vigormortis loses ability |
| Vigormortis neighbor poison | Vigormortis kill | Tied to retained dead-minion effect |
| Vortox forced false information | Vortox continuous ability | Applies while Vortox ability is active |
| Witch curse | Witch night choice | Expires after next day or removed immediately at three alive |
| Cerenovus madness | Cerenovus choice | Replaced or ended at next Cerenovus action |
| Philosopher original role drunk | Philosopher ability gain | Removed when Philosopher loses that gained ability |
| Snake Charmer old demon poison | Snake Charmer swap | Source and duration must be explicit |

## Invariants

- Do not collapse drunk and poisoned into one untyped failure flag.
- Do not remove history when an effect ends.
- Do not make Reminder Tokens the source of truth.
- Do not retroactively apply effects to past events unless a specific rule says so.
- Do not clear all effects of a type when one source expires.
- Do not store final drunk/poisoned state independently from effect derivation.
