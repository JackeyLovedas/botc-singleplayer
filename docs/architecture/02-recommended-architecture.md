# Recommended Architecture

## Architecture Style

Use a modular monolith with a deterministic domain kernel.

Do not use microservices, a network backend, or a game engine as the primary architecture. The first version is a local Windows single-player product. Distribution would add failure modes without helping rule correctness.

## Layers

| Layer | Responsibility | May Read Canonical State | May Write Canonical State |
| --- | --- | --- | --- |
| Domain kernel | Command validation, event application, rule resolution, victory checks | Yes | Only through validated events |
| Role capability modules | Role-specific rule hooks and task specs | Through domain kernel interfaces | No direct writes |
| Storyteller policy | Chooses among legal candidates and records decisions | Storyteller view only | No direct writes |
| Projection service | Builds public, player, AI, replay, and Storyteller views | Yes | No |
| AI gateway | Calls AI models and converts output into candidate commands | No | No |
| Persistence | Stores event log, snapshots, migrations, replay data | Stored canonical records | No rule decisions |
| Desktop shell and UI | Presents legal views and submits commands | No | No |

## Core Flow

```text
receive command
-> deduplicate
-> load snapshot/events
-> check expected version
-> validate actor and phase
-> execute domain handler
-> produce domain events
-> append transactionally
-> update snapshot if required
-> publish projections
-> schedule follow-up commands
```

## Event-Sourced Domain State With Snapshots

Use event-sourced domain state with periodic snapshots. The domain event log is the authoritative source for game state. Canonical state is recovered by loading the latest valid snapshot and applying later domain events.

Snapshots are rebuildable caches. A snapshot must never contain state that cannot be explained by the domain event log, and deleting snapshots must still allow full recovery from domain events. Audit events and infrastructure events do not participate in canonical state rebuilding.

Old rule-version events must not be silently reinterpreted under new rules. Migration must either preserve the old event meaning through upcasters or mark the save as requiring compatibility handling.

## Major Boundaries

- AI cannot call domain internals and cannot receive canonical state.
- UI cannot receive truth labels during a live game.
- Storyteller policy cannot invent domain events; it chooses from legal candidates.
- Role modules cannot mutate state directly; they emit candidate effects through the resolver.
- Random choices must be made through named seeded streams and recorded as decisions.
- Each game has one logical writer; human commands, AI commands, system tasks, and Storyteller choices enter the same serial command queue.
- Events are committed before projections are published.
- Snapshot failure must not roll back already committed domain events.

## Accepted Trade-offs

- A modular monolith requires discipline in module boundaries, but avoids premature service boundaries.
- Electron is heavier than native Windows UI, but keeps the domain, UI, and AI integration in one language.
- SQLite is local and simple, but not a multi-user database. That is acceptable because online multiplayer is out of scope.
- Event-sourced domain state plus snapshots requires event versioning and migration discipline, but it is necessary for replay, truth review, deterministic debugging, and hidden-information audit.
