# Phase 3 Slice 1: Domain Event Spine Status

## 1. Actual Packages Created

- `packages/domain-core`
- `packages/application`
- `packages/test-harness`

No Electron, UI, AI SDK, SQLite, role engine, setup engine, task engine, effect engine, information engine, or victory engine package was created.

## 2. Commands Implemented

- `CreateGame`
- `SelectScript`

Both commands use `CommandEnvelope<TPayload>` with `commandId`, `gameId`, `expectedGameVersion`, `actor`, `issuedAt`, `correlationId`, and `payload`.

## 3. Domain Events Implemented

- `GameCreated`
- `ScriptSelected`

`GameCreated` enforces the first-release player counts:

- `playerCount = 12`
- `humanPlayerCount = 1`
- `aiPlayerCount = 11`
- `storytellerCount = 1`

The Storyteller remains outside the 12 player count.

## 4. Event And State Invariants

- Only `DomainEventEnvelope` values rebuild canonical state.
- `AuditEventEnvelope` and `InfrastructureEventEnvelope` are separate types.
- Event sequences must be continuous.
- `GameCreated` must be first and cannot repeat.
- `ScriptSelected` requires an existing game.
- Unsupported event versions are rejected.
- Rebuild is deterministic and does not mutate input events.
- A command produces one atomic domain event batch in this slice.
- `gameVersion` increments once per committed command batch.
- Duplicate `commandId` returns the original result without appending events.
- `expectedGameVersion` mismatch rejects without writing domain events.

## 5. Test Checklist

Implemented tests cover:

1. Empty event stream behavior.
2. `GameCreated` state creation.
3. `ScriptSelected` requires `GameCreated`.
4. Duplicate `GameCreated` rejection.
5. Event sequence jump rejection.
6. Event sequence duplicate rejection.
7. Unsupported event version rejection.
8. Deterministic rebuild.
9. Rebuild does not mutate input events.
10. Audit events rejected at rebuild type boundary.
11. Infrastructure events rejected at rebuild type boundary.
12. `CreateGame` produces one atomic event batch.
13. One batch increments `gameVersion` once.
14. Duplicate `commandId` is idempotent.
15. Version mismatch writes no event.
16. Rejected command receipt does not alter canonical state.
17. `SelectScript` before game creation is rejected.
18. Same-game commands serialize.
19. Different games do not share queue state.
20. Event store failure does not record success.
21. Queue continues after a failed command.
22. `domain-core` has no Electron, SQLite, React, or AI SDK dependency.
23. `application` does not depend on concrete AI or SQLite adapters.
24. Audit and infrastructure events do not participate in state rebuild.

Additional tests cover successful `SelectScript` and duplicate rejected command idempotency.

## 6. Test Run Results

- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm test`: passed, 26 tests.
- `pnpm test:coverage`: passed.

## 7. Not Implemented

- Basic day/night flow.
- Nomination, voting, execution, death, or victory behavior.
- Role abilities.
- Setup generator.
- AI players.
- UI or Electron shell.
- SQLite persistence adapter.
- Projections beyond package boundary tests.

## 8. Known Limitations

- The event store is an application port only; production SQLite implementation is intentionally deferred.
- The test harness memory stores are test-only and are not a production persistence adapter.
- `ScriptSelected` records script identity only; it does not validate role pools or perform setup.
- Event batches contain one event in this slice, though the batch contract supports multiple events.

## 9. Next Slice Recommendation

Next slice: Phase 3 basic phase flow.

Suggested scope:

- Introduce explicit phase state commands.
- Add `PhaseTransitioned` or equivalent domain event.
- Keep execution/death, roles, AI, and UI out until later slices.

## 10. BLOCKER Status

No BLOCKER identified for this slice.
