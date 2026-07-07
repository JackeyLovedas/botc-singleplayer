# ADR-005: Single Writer Game Session

## Status

Accepted

## Context

Human input, AI responses, Storyteller choices, and system follow-ups can arrive at different times. If multiple writers modify the same game concurrently, stale AI responses and race conditions can corrupt hidden information and event ordering.

## Decision

Each game has one logical writer managed by `GameSessionRunner`.

All human commands, AI commands, system tasks, and Storyteller choices enter the same serial command queue. Every command carries `commandId`, `gameId`, `expectedGameVersion`, `actor`, `issuedAt`, and `correlationId`.

## Alternatives

| Alternative | Reason Rejected |
| --- | --- |
| Let each subsystem write independently | Race-prone and hard to audit |
| Lock only at database write time | Too late; stale AI decisions may already have been validated |
| Fully concurrent aggregate writes | Unnecessary for a local single-player game |

## Consequences

- Command processing is simpler and deterministic.
- Async AI responses must be revalidated on return.
- Long-running AI work cannot block state correctness.
- Throughput is lower than concurrent writes, but sufficient for one local game session.
