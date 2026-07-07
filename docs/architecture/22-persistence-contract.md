# Persistence Contract

## Core Guarantees

- `gameVersion` is monotonically increasing.
- One command produces zero or one domain event batch.
- A non-empty domain event batch commits in one transaction.
- Event sequence numbers are unique and continuous per game.
- Decision log entries and random selections needed by domain events commit atomically with the event batch.
- Snapshot save failure does not roll back committed domain events.
- Snapshot records the last applied domain event sequence.
- Duplicate commands are idempotent.
- Export files include the rules baseline version.

## Game Version

`gameVersion` starts at 0. A committed domain event batch increments it by 1. Audit or infrastructure events do not increment game version.

Each command includes `expectedGameVersion`. If it differs from current game version:

- reject with an audit event; or
- reload current projection and ask caller to issue a new command.

Do not silently apply a stale command.

## Domain Event Sequence

Each domain event has:

- `gameId`;
- `eventSequence`;
- `batchId`;
- `gameVersion`;
- `eventType`;
- `eventVersion`;
- `rulesBaselineVersion`;
- `payload`;
- `payloadChecksum`;
- `createdAt`;
- `correlationId`;
- `causationId`.

`eventSequence` is unique and continuous per game.

## Transaction Contents

A command transaction includes:

- command receipt or idempotency record;
- domain event batch;
- required Storyteller decision logs;
- required random selection records;
- updated game version;
- optional outbox records for projection publishing and follow-up commands.

Audit and infrastructure events may be persisted in the same physical database, but must be distinguishable from domain events.

## Snapshot Contract

Snapshot record:

- `gameId`;
- `snapshotVersion`;
- `lastAppliedEventSequence`;
- `rulesBaselineVersion`;
- `statePayload`;
- `stateChecksum`;
- `createdAt`.

Snapshot rules:

- A snapshot is valid only if all domain events through `lastAppliedEventSequence` exist and checksums match.
- Snapshot state must be explainable by the event log.
- Delete snapshot and rebuild must produce the same canonical state.
- Snapshot failure after event commit records `SnapshotSaveFailed` infrastructure event and schedules retry.

## SQLite Recovery

Use SQLite transactions for event batch commits. On restart:

1. Open database.
2. Verify schema and migration version.
3. Check each game for continuous domain event sequence.
4. Ignore incomplete projection cache records.
5. Load latest valid snapshot.
6. Apply later domain events.
7. Rebuild missing projections.
8. Retry pending snapshot or projection outbox work.

If event sequence or checksum validation fails, mark the save as corrupted and do not continue silently.

## Checksums

Use checksums for:

- event payload;
- event batch;
- snapshot payload;
- exported replay package.

Checksums detect corruption, not malicious tampering. This is sufficient for local first release unless later threat modeling expands the requirement.

## Idempotency

`commandId` is unique per game. Repeated command handling:

- if already committed, return the prior accepted result;
- if previously rejected, return the prior rejection;
- if in-flight after crash, recover by checking whether a domain event batch with the command id committed.

Never settle the same command twice.

## Export Contract

Exported saves or replay packages include:

- app schema version;
- event schema versions;
- rules baseline version;
- role data version;
- export visibility level;
- payload checksum.

Player-visible exports must be built from projections, not by late redaction of canonical state.
