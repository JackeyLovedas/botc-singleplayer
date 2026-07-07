# Application Layer

## Purpose

The application layer serializes commands, coordinates persistence, invokes the domain kernel, publishes projections, and schedules follow-up commands. It does not own game rules.

## Components

### GameApplicationService

Entry point for user, AI, system, and Storyteller commands.

Responsibilities:

- accept `CommandEnvelope`;
- deduplicate by `commandId`;
- load game state through `UnitOfWork`;
- check `expectedGameVersion`;
- call command validators and domain handlers;
- persist the resulting domain event batch;
- publish projections after commit;
- schedule follow-up commands.

It must not contain role-specific rules.

### GameSessionRunner

Owns the logical single-writer session for one game.

Responsibilities:

- maintain one serial command queue per game;
- order human commands, AI commands, system tasks, and Storyteller choices;
- prevent concurrent writes to the same game;
- revalidate stale asynchronous AI responses;
- drain follow-up commands produced by domain events.

### CommandBus

Routes commands into the correct `GameSessionRunner`.

Responsibilities:

- require `commandId`, `gameId`, `expectedGameVersion`, `actor`, `issuedAt`, and `correlationId`;
- reject malformed envelopes before loading domain state;
- preserve command order per game;
- emit audit events for duplicate or rejected commands.

### UnitOfWork

Defines the atomic transaction boundary for one command.

Responsibilities:

- load latest valid snapshot;
- load domain events after the snapshot;
- rebuild canonical state;
- append one domain event batch atomically;
- save required decision log and random selection records in the same transaction;
- update `gameVersion`;
- attempt snapshot update after event append when policy requires it.

Snapshot save failure must not roll back already committed domain events.

### DomainEventStore

Persists and loads authoritative domain events.

Responsibilities:

- keep event sequence numbers unique and continuous per game;
- enforce optimistic game version checks;
- store event schema version and rules baseline version;
- expose rebuild streams for replay;
- exclude audit and infrastructure events from canonical rebuild streams.

### ProjectionPublisher

Publishes projections only after domain event commit.

Responsibilities:

- build `publicGameState`, `playerKnowledgeView`, `storytellerView`, AI projections, and replay projections from committed state;
- avoid publishing on failed transactions;
- tag projection version with the committed `gameVersion`;
- fail closed if a projection leakage check fails.

## Single-Writer Rules

1. Each game has exactly one logical writer.
2. Human commands, AI commands, system tasks, and Storyteller choices enter the same serial command queue.
3. Duplicate `commandId` values must not settle twice.
4. `expectedGameVersion` mismatch is rejected or triggers reload and revalidation.
5. A command's domain events commit atomically.
6. Projection publication happens only after successful event append.
7. Snapshot failure cannot cause domain event loss.
8. AI asynchronous responses are revalidated against current game version when they return.
9. AI responses must not continue stale operations from old state.

## Command Flow

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

## Follow-Up Commands

Domain handlers may request follow-up commands, such as victory checks, continuous rule recalculation, projection rebuild, or next scheduled task presentation. Follow-up commands must enter the same queue and carry causation and correlation ids.

Follow-up scheduling does not bypass command validation.

## Failure Handling

| Failure | Handling |
| --- | --- |
| Duplicate command | Return previous outcome if known, or ignore with audit event |
| Expected version mismatch | Reject or rebuild from latest state and ask caller to resubmit |
| Domain validation failure | No domain events appended; audit rejection |
| Event append failure | Transaction rolls back |
| Snapshot save failure | Domain events remain committed; infrastructure failure logged |
| Projection build failure | Event commit remains; projection publisher retries or marks projection unavailable |
| AI stale response | Reject and optionally request a fresh AI turn from current projection |
