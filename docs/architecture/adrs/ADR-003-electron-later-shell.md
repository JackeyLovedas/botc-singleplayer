# ADR-003: Electron Later Shell

## Status

Accepted

## Context

The product is a Windows local app, but the next work is rule-engine correctness, not UI. Starting with a desktop shell would risk coupling domain logic to rendering and packaging too early.

## Decision

Use Electron as the planned desktop container later. Do not introduce Electron into the rule core or early domain slices.

## Alternatives

| Alternative | Reason Rejected |
| --- | --- |
| Build Electron immediately | Encourages UI-first work before rule architecture is proven |
| Tauri first | Smaller shell but adds Rust boundary before it is needed |
| Native .NET UI first | Good Windows fit but changes the TypeScript-first domain decision |

## Consequences

- Domain and application packages remain headless and testable.
- UI can consume projections later without reading canonical state.
- Packaging decisions are deferred until rules, persistence, and projections are stable.
- Electron weight remains an accepted future tradeoff.
