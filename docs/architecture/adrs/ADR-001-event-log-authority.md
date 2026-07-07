# ADR-001: Event Log Authority

## Status

Accepted

## Context

The game requires save, replay, truth review, deterministic debugging, AI audit, hidden-information review, and rule-version migration. Snapshots are useful for resume speed, but they can become dangerous if treated as independent truth.

## Decision

Use event-sourced domain state with periodic snapshots.

The domain event log is the authoritative source for game state. Canonical state is recovered from the latest valid snapshot plus later domain events. Snapshots are rebuildable caches.

Audit events and infrastructure events do not participate in canonical state rebuild.

Old rule-version events must not be silently reinterpreted under new rules.

## Alternatives

| Alternative | Reason Rejected |
| --- | --- |
| Snapshot-only saves | Weak replay, weak audit, hard to debug hidden-information bugs |
| Mixed mutable state plus events | Creates conflicting truth sources |
| Full event sourcing without snapshots | Correct but inefficient for local resume and unnecessary rebuild cost |

## Consequences

- Domain events require stable schema and upcasters.
- Snapshots must record last applied event sequence and checksum.
- Deleting snapshots must not lose the game.
- Replay applies domain events only.
- Migration must preserve old rule semantics or require compatibility handling.
