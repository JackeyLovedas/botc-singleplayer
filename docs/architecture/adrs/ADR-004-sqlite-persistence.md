# ADR-004: SQLite Persistence

## Status

Accepted

## Context

The first release is a local Windows single-player game. It needs durable saves, replay, event logs, snapshots, migrations, and inspectable local storage. It does not need server coordination or online multiplayer.

## Decision

Use SQLite for local persistence.

SQLite stores domain events, snapshots, decisions, audit events, infrastructure events, projection caches, migration logs, and replay indexes.

## Alternatives

| Alternative | Reason Rejected |
| --- | --- |
| JSON files only | Harder to maintain atomic event batches, indexes, and migrations |
| PostgreSQL | Operationally excessive for local single-player first release |
| Browser storage | Ties persistence to UI container and weakens headless testing |

## Consequences

- Transactional event appends are practical.
- Local save files remain portable and inspectable.
- Schema migration and checksum checks are required.
- SQLite is not a multiplayer synchronization solution; online play remains out of scope.
