# Persistence And Replay

## Storage Recommendation

Use local SQLite with versioned JSON payloads for domain events, snapshots, projection cache metadata, audit records, infrastructure records, and replay indexes.

The persistence model is:

```text
Event-sourced domain state with periodic snapshots
```

## Authority

The domain event log is the only authoritative source for canonical game state. Canonical state is recovered by:

```text
latest valid snapshot + later DomainEvent records
```

If snapshots are deleted, the game must still rebuild from domain events. A snapshot must not contain state that cannot be explained by domain events.

## Stored Records

| Record | Purpose | Rebuilds Canonical State |
| --- | --- | --- |
| `game` | Game id, rules baseline version, product scope, current status and version | No |
| `domain_event_log` | Append-only domain events with continuous sequence numbers | Yes |
| `snapshot` | Periodic canonical snapshots for resume | Cache only |
| `decision_log` | Storyteller and random decisions with legal candidates | Referenced by domain events; not independently applied |
| `audit_event_log` | Inputs, rejections, AI candidate commands, leakage checks | No |
| `infrastructure_event_log` | Snapshot, migration, export, projection-cache operations | No |
| `projection_checkpoint` | Optional cache metadata for fast replay | No |
| `ai_audit_log` | AI projection hashes and candidate command validation | No |
| `migration_log` | Applied schema and event upcasters | No |

## Save Model

Save files may contain canonical truth because the local game must resume accurately. The live UI must never expose that truth unless the game is over or the user enters explicit truth-review mode.

## Replay Modes

| Mode | Reader | Shows |
| --- | --- | --- |
| Public replay | Player during or after game | Public timeline only |
| Player-perspective replay | One player or AI review | What that player legally knew at each event |
| Truth replay | Post-game review | Full canonical truth, role history, alignment history, decisions, information evaluations |

Replay applies domain events. It may show audit and infrastructure events as diagnostic overlays, but they do not change reconstructed state.

## Determinism

All random choices must record:

- root seed;
- named stream id;
- candidate set;
- sorted candidate order;
- selected index;
- selected value.

AI calls are not assumed deterministic. Exact replay uses stored AI candidate commands and resulting domain events. Replay must not call the AI model again to reproduce a past game.

## Versioning

Every saved game and event should include:

- app schema version;
- domain event version;
- rules baseline version, initially `Phase One v2.1`;
- script definition version;
- role data version;
- migration version;
- event sequence number;
- game version.

## Migration Strategy

- Use event upcasters for old event payloads.
- Use snapshot migrations for canonical state snapshots.
- Never silently reinterpret old events under new rules.
- If a migration cannot preserve semantics, mark the save as requiring compatibility mode or manual review.
- Keep rules baseline version in exports and replay packages.

## Transaction Boundary

A command that produces domain events must persist the whole domain event batch atomically. If event append fails, no partial domain state is committed. If snapshot save fails after event append, domain events remain committed and snapshot can be rebuilt.

Decision log entries and random selections required to explain a domain event must be saved in the same transaction as the event batch.

## Hidden Information Safety

Logs and exported replay files must be typed by visibility. A player-visible export must be generated from projections, not by redacting canonical state late.
