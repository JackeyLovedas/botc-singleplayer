# ADR-007: Rule Task Separation

## Status

Accepted

## Context

The Phase 2 umbrella `NightTask` model risked forcing active, passive, triggered, and continuous rules into one queue. Sects & Violets needs dynamic scheduled night actions, day actions, death/event triggers, and ongoing continuous pressure.

## Decision

Separate rule execution into:

- `ScheduledTask`;
- `ActionOpportunity`;
- `EventSubscription`;
- `ContinuousRule`.

`DAY_PASSIVE` and `CONTINUOUS_PASSIVE` must not remain executable night task types.

## Alternatives

| Alternative | Reason Rejected |
| --- | --- |
| One permanent night order array | Violates baseline; fails role changes and conditional triggers |
| One generic `NightTask` for all rules | Conflates scheduled, passive, triggered, and continuous behavior |
| Role-specific custom handlers only | Encourages giant if/else and inconsistent lifecycle handling |

## Consequences

- Dynamic night order remains explicit.
- Passive and continuous rules are recalculated rather than queued.
- Event-triggered roles such as Sage and Sweetheart are easier to test.
- Implementation must maintain clear interfaces between task, effect, information, and victory engines.
