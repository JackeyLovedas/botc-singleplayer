# Phase 3 Slice 2C Implementation Traceability and Support Authority

## Binding status

This is the bounded implementation traceability artifact for the Slice 2C
closure. It records the physical tests that exist in the repository and does
not create a new registry, verifier, or evidence framework. The source
implementation head at materialization is `52c4e975ea0b3e38890318ed253718f552d77427`.
The later documentation commit that carries this file is not a product-head
binding.

The accepted C1 prefix remains `40/59`. Slice 2C additive structural rows are
`41..50 / 60..69`; this artifact does not change either descriptor source.
Every row below has one primary layer and one exact physical test identity.
`SUP authority=NONE` is intentional: the named physical test is the primary
authority and no unresolved supporting authority is planned. Existing tests
that exercise more than one assertion remain one physical identity; they do
not create additional event identities.

Reachability uses the active design vocabulary: `R1` producer/application,
`R2` accepted replay, and `R3` structural or hostile rejection. Trust uses
`T1` canonical runtime/accepted-history evidence, `T2` derived state evidence,
and `T3` pure-policy evidence.

## GI-C01 through GI-C15

| Criterion | Exact physical test identity | Primary layer | Reachability | Trust | Production entry | Fault mechanism | Main assertion | SUP authority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GI-C01 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `GameApplicationService.execute` | invalid producer command or append/rebuild divergence | bounded producer appends canonical phase/event chain and rebuilds | NONE |
| GI-C02 | `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts` — `[2C-F01] captures every additive subject against the immutable C1 prefix` | STRUCTURAL_VALIDATION | R3 | T1 | `validateTwoCDomainEventStructure` | duplicate ordinal, branch, or accepted-prefix mutation | additive census is exactly ten rows with immutable C1 prefix | NONE |
| GI-C03 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | LEGACY_REPLAY_COMPATIBILITY | R2 | T1 | `rebuildOptionalGameState` | reordered or altered accepted event stream | valid bounded history rebuilds to the same canonical state | NONE |
| GI-C04 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | HOSTILE_REPLAY_REJECTION | R3 | T1 | `rebuildOptionalGameState` | forged cause, reordered death, or missing predecessor | hostile persisted history is rejected closed | NONE |
| GI-C05 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `DeclareNomination` through `GameApplicationService.execute` | duplicate nominee/nominator or alias event | only `NominationDeclared` is appended and daily uniqueness holds | NONE |
| GI-C06 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `CastVote` / `CompleteVote` | malformed vote or aggregate mismatch | `VoteCast` and `BlockStateUpdated` remain distinct canonical facts | NONE |
| GI-C07 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `ResolveExecution` | death outcome and mutation mismatch | execution resolution may be `DID_NOT_DIE`; death is separate | NONE |
| GI-C08 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `ResolveExecution` / `SettleOrdinaryNightTask` | forged cause, seat, source, or duplicate death | one `PlayerDied` contract binds execution and generic Demon causes | NONE |
| GI-C09 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `ResolveExecution` followed by `BeginNight` | late role-task creation after death | daytime Pit-Hag execution precedes `NIGHT_TASKS` and suppresses its task | NONE |
| GI-C10 | `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts` — `[2C-F03] rejects one malformed descriptor for each additive subject` | STRUCTURAL_VALIDATION | R3 | T1 | `validateTwoCDomainEventStructure` | wrong literal, field kind, or task placeholder | ordinary plan and every additive descriptor reject malformed shape | NONE |
| GI-C11 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `SettleOrdinaryNightTask` | duplicate or reordered target/death events | `OrdinaryNightTargetDerived` is the singular generic action fact | NONE |
| GI-C12 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `SettleOrdinaryNightTask` | dead source acts or causal death is missing | Flowergirl source settles `SOURCE_INELIGIBLE` after causal death | NONE |
| GI-C13 | `packages/domain-core/src/domain-batch-semantics.test.ts` — `replays the exact capability fact and rejects a literal-tampered stream` | LEGACY_REPLAY_COMPATIBILITY | R2 | T1 | `rebuildGameState` | altered accepted payload or missing predecessor | replay accepts the exact stream and rejects tampering | NONE |
| GI-C14 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | APPLICATION_COMMAND_INTEGRATION | R1 | T1 | `GameApplicationService.execute` | same command retry after accepted append | retry is idempotent and appends no second canonical fact | NONE |
| GI-C15 | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | APPLICATION_COMMAND_INTEGRATION | R1 | T1 | `GameApplicationService.execute` | command-id fingerprint conflict | changed payload under the same command identity is rejected without mutation | NONE |

## A–R physical identity matrix

The rows below bind the complete fixture chain to its actual producer or
structural test. Where one integration test observes consecutive events, the
event subjects remain separate rows but retain the same physical test identity;
the primary layer is still singular per row. `SUP authority=NONE` means there
is no pending support obligation.

| A–R | Canonical subject | Exact physical test identity | Primary layer | Reachability | Trust | Production entry | Fault mechanism | Main assertion | SUP authority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | setup/assignment | `packages/application/src/game-application-service.test.ts` — `assigns characters deterministically and transitions to FIRST_NIGHT` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `AssignCharacters` | invalid assignment or phase | accepted setup reaches deterministic assignment | NONE |
| B | roster/character state | `packages/application/src/game-application-service.test.ts` — `assigns characters deterministically and transitions to FIRST_NIGHT` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `AssignCharacters` | roster/state mismatch | canonical roster and character state are retained | NONE |
| C | first-night initialization | `packages/application/src/game-application-service.test.ts` — `plans first-night tasks with one event and leaves phase at FIRST_NIGHT` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `InitializeFirstNight` | missing prerequisite or duplicate initialization | first-night initialization is one accepted batch | NONE |
| D | first-night task plan | `packages/application/src/game-application-service.test.ts` — `plans first-night tasks with one event and leaves phase at FIRST_NIGHT` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `PlanFirstNightTasks` | malformed task plan | plan is persisted once with canonical tasks | NONE |
| E | first-night settlement | `packages/domain-core/src/domain-batch-semantics.test.ts` — `accepts and replays a fully settled FIRST_NIGHT_COMPLETED transition` | LEGACY_REPLAY_COMPATIBILITY | R2 | T1 | `rebuildGameState` | incomplete settlement progress | complete first-night history is replayable | NONE |
| F | dawn/day boundary | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `CompleteNight` / `PublishDawn` | invalid phase transition | dawn opens the bounded day flow | NONE |
| G | nomination window | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `OpenNominations` | wrong phase or transition | nomination window is reached canonically | NONE |
| H | `NominationDeclared` | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `DeclareNomination` | dead actor, duplicate nominator, or duplicate nominee | one legal nomination is appended | NONE |
| I | `VoteCast` | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `CastVote` | duplicate vote or ghost-token misuse | vote fact is canonical and bounded | NONE |
| J | `BlockStateUpdated` | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `CompleteVote` | tie/threshold/tally mismatch | strict-highest block is recorded | NONE |
| K | execution declaration/resolution | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `ResolveExecution` | incomplete execution chain | declaration, resolution, and transition are ordered | NONE |
| L | execution death | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `ResolveExecution` | wrong cause or missing death predecessor | `PlayerDied(cause=EXECUTION)` is linked to resolution | NONE |
| M | night-task boundary | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `ResolveExecution` / `BeginNight` | late or duplicate transition | execution ends the day and opens `NIGHT_TASKS` | NONE |
| N | death suppression | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `BeginNight` | dead role action inferred | no Pit-Hag task is planned after daytime death | NONE |
| O | `OrdinaryNightTaskPlanCreated` | `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts` — `[2C-F03] rejects one malformed descriptor for each additive subject` | STRUCTURAL_VALIDATION | R3 | T1 | `validateTwoCDomainEventStructure` | placeholder or wrong task order | exact generic-Demon then Flowergirl shape | NONE |
| P | generic target/death | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `SettleOrdinaryNightTask` | target derivation, cause, or order mismatch | target, `PlayerDied`, and settlement form one canonical chain | NONE |
| Q | Flowergirl settlement | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | ACCEPTED_STREAM_INTEGRATION | R1 | T1 | `SettleOrdinaryNightTask` | live/dead source mismatch | source-ineligible settlement is terminal and causal | NONE |
| R | replay and hostile replay | `packages/domain-core/src/domain-batch-semantics.test.ts` — `rejects standalone execution PlayerDied replay without its canonical predecessor`; `rejects standalone generic-demon PlayerDied replay without its canonical predecessor`; `rejects standalone ExecutionResolved replay without its canonical execution chain` | HOSTILE_REPLAY_REJECTION | R3 | T1 | `validateDomainBatchSemantics` / `rebuildGameState` | orphan, reordered, forged, or missing predecessor | no standalone death or resolution event bypasses canonical provenance | NONE |

## Static closure checks

- GI criterion rows: 15; duplicate criterion IDs: 0.
- A–R rows: 18; duplicate A–R IDs: 0.
- Every row has exactly one `Primary layer`, one physical test identity, and a
  resolved `SUP authority` value; no support row is `PLANNED` or unresolved.
- C1 accepted prefix: unchanged (`40/59`). 2C additive descriptor census:
  unchanged (`41..50 / 60..69`).
- The artifact is documentation-only and has no runtime, production, test
  identity-generation, workflow-topology, dependency, or rule-authority
  effect.
