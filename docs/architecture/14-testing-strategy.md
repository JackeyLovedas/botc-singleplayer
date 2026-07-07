# Testing Strategy

## Test Layers

| Layer | Purpose |
| --- | --- |
| Domain unit tests | Event applier, state transitions, value objects |
| Command validation tests | Legal and illegal commands by phase, actor, role, and visibility |
| Role fixture tests | One role or interaction per fixture, mapped to rule test ids |
| Dynamic night task tests | Queue insertion, skipping, simulation, role-change timing |
| Effect lifecycle tests | Create, suppress, resume, expire, remove |
| Information tests | Candidate generation, Vortox false info, drunk/poison unreliable info |
| Projection leakage tests | Assert hidden truth is absent from player and AI views |
| Hidden candidate tests | Assert visible options do not reveal hidden legality |
| Single-writer tests | Assert duplicate commands, stale versions, and concurrent commands are handled serially |
| Event category tests | Assert only `DomainEvent` records rebuild canonical state |
| Ability evaluation tests | Assert effectiveness is re-evaluated before presentation, after input, and before settlement |
| Information evaluation tests | Assert semantic truth, reliability, truth constraints, registration, and simulation reason combine correctly |
| Effect stacking tests | Assert multiple drunk/poisoned sources derive final state without clearing unrelated sources |
| Victory resolver tests | Candidate collection, blocking, simultaneous conditions |
| Seed determinism tests | Same seed and inputs produce same setup/events |
| Golden replay tests | Event logs rebuild the same canonical and projected timelines |
| Persistence migration tests | Old events and snapshots migrate safely |
| Persistence transaction tests | Event batch atomicity, snapshot failure recovery, idempotent command handling |
| AI contract tests | AI output remains candidate commands and can be rejected |

## Existing Baseline

The current effective test count is 76. Coverage status is role-specific and must not be simplified into a total count.

`VERIFIED_CORE` roles:

Mathematician, Philosopher, Barber, Evil Twin, Witch, Cerenovus, Pit-Hag, Fang Gu, Vigormortis, No Dashii, Vortox.

`PARTIAL` roles:

Clockmaker, Dreamer, Snake Charmer, Flowergirl, Town Crier, Oracle, Savant, Seamstress, Artist, Juggler, Sage, Mutant, Sweetheart, Klutz.

## PARTIAL Role Gate

Before implementing a `PARTIAL` role:

1. Read that role's spec and related tests.
2. Define missing interaction branches.
3. Add targeted tests for those branches.
4. Keep role status as `PARTIAL` until coverage review updates it.
5. Do not change `PARTIAL` to `VERIFIED_CORE` as part of implementation convenience.

## Test ID Policy

Use `SV-ROLE-SCENARIO` style ids. Each test must include:

- preconditions;
- canonical state;
- player visible state;
- Given/When/Then;
- expected events;
- forbidden events;
- expected state changes;
- forbidden state changes;
- source URL or local rule reference;
- coverage status.

## Required Early Test Gates

- Projection leakage tests before any AI integration.
- Hidden candidate leakage tests before any player or AI option rendering.
- Single-writer and expected-version tests before asynchronous AI responses are accepted.
- Domain/audit/infrastructure event separation tests before replay work.
- Deterministic setup tests before setup UI or save export.
- Event replay tests before save/resume.
- Command/event separation tests before accepting LLM output.
- Orthogonal information evaluation tests before Vortox or drunk/poisoned information roles are implemented.
- Effect stacking tests before No Dashii, Vigormortis, Sweetheart, Witch, or Philosopher effects are implemented.
- Victory resolver tests before role implementations that can alter win conditions.
