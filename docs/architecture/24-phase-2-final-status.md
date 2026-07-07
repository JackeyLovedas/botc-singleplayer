# Phase 2.1 Final Status

## Status

Phase: Phase 2.1 - 实施前架构定稿

Result: Ready for user review

Implementation status: no framework initialization, no code packages, no UI, no role implementation, no AI implementation, no demo.

Phase 3 status: user explicitly approved Phase 3 Slice 1 on 2026-07-07.

## Phase 3 Entry Corrections

Before Phase 3 implementation, two Phase 2.1 inconsistencies were corrected:

- Package dependency direction now uses application-defined ports and concrete adapters. `application` does not depend on `persistence-sqlite` or `ai-gateway`; the future composition root wires adapters.
- Nomination and voting state transitions now return from `VOTING` to `NOMINATION_WINDOW` after `CompleteVote` and `BlockStateUpdated`. `CloseNominations` is the only normal transition to execution or no-execution day close.

## Locked Decisions

- Language: TypeScript.
- Architecture: modular monolith.
- Desktop container: Electron later.
- Local persistence: SQLite.
- Rule core: independent domain package with no UI or Electron dependency.
- AI input: player legal projections only.
- AI output: candidate commands only.
- Rules baseline: Phase One v2.1.

## Acceptance Checklist

| Requirement | Status | Evidence |
| --- | --- | --- |
| Application layer explicit | Pass | `19-application-layer.md` |
| Single writer explicit | Pass | `19-application-layer.md`, `ADR-005-single-writer-game-session.md` |
| Unique source of truth explicit | Pass | `ADR-001-event-log-authority.md`, `13-persistence-and-replay.md` |
| Three event types separated | Pass | `06-command-event-model.md`, `13-persistence-and-replay.md` |
| Task/passive/continuous rules separated | Pass | `08-night-task-model.md`, `20-rule-execution-model.md`, `ADR-007-rule-task-separation.md` |
| Hidden candidates do not leak | Pass | `06-command-event-model.md`, `07-state-and-projections.md`, `20-rule-execution-model.md` |
| Information truth uses orthogonal model | Pass | `10-information-model.md`, `ADR-006-orthogonal-information-evaluation.md` |
| Effect supports multi-source stacking | Pass | `09-effect-lifecycle.md` |
| Knowledge derives from events | Pass | `05-domain-model.md`, `07-state-and-projections.md` |
| Phase state machine explicit | Pass | `21-phase-state-machine.md` |
| SQLite transaction boundaries explicit | Pass | `22-persistence-contract.md`, `13-persistence-and-replay.md` |
| Project package structure explicit | Pass | `23-project-structure.md` |
| ADRs completed | Pass | `docs/architecture/adrs/ADR-001` through `ADR-007` |
| Root `AGENTS.md` exists | Pass | `AGENTS.md` |
| No implementation-level architecture blocker | Pass | No blocker identified in this status document |

## Required Phase 3 Entry Gates

Phase 3 may begin only after explicit user approval. Before writing implementation code, the next turn should:

1. Re-read `AGENTS.md`.
2. Re-read `docs/architecture/24-phase-2-final-status.md`.
3. Confirm the first Phase 3 vertical slice scope.
4. Create only the minimal project structure needed for that approved slice.
5. Add tests before implementing risky rule behavior.

## Non-Goals Preserved

- No full game implementation.
- No role ability implementation.
- No AI player implementation.
- No UI.
- No demo.
- No rule baseline rewrite.
- No `PARTIAL` to `VERIFIED_CORE` status change.
- No project package directories created during Phase 2.1.

## Residual Non-Blocking Notes

- `OQ-V2-001` remains a product policy question for non-standard sandbox mode and Pit-Hag pool-outside roles. It is out of standard first-release scope.
- `OQ-V2-004` remains an implementation strategy question for Vortox composite false-candidate solving. It does not block Phase 3 if first slices avoid that role behavior or add targeted tests before implementation.
- `tests/28-test-deduplication-report.md` still contains the old count of 51 while current authority documents confirm 76 effective tests.

## Stop Condition

Phase 3 Slice 1 may proceed because the user explicitly approved it. Do not proceed beyond Domain Event Spine into Slice 2, role abilities, AI players, UI, Electron, SQLite implementation, or full game development without separate approval.
