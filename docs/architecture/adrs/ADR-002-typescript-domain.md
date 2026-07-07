# ADR-002: TypeScript Domain

## Status

Accepted

## Context

The project needs a deterministic rule engine, typed projections, AI command contracts, local persistence payloads, and a future desktop UI. The first implementation should keep the rule core independent from UI and Electron.

## Decision

Use TypeScript for the domain, application, projections, AI gateway contracts, persistence payload definitions, and tests.

The rule core is an independent package with no Electron or UI dependency.

## Alternatives

| Alternative | Reason Rejected |
| --- | --- |
| C#/.NET domain | Strong Windows fit but less direct shared typing with future web-style UI and AI gateway code |
| Python domain | Fast prototyping but weaker long-term type guarantees for complex rules |
| Rust domain | Strong correctness but unnecessary complexity for first implementation |

## Consequences

- Strong shared contracts across domain, projections, AI, and UI.
- Test and simulation tooling can run headlessly.
- Type discipline is required to keep hidden state out of projections.
- Runtime validation remains necessary at persistence and AI boundaries.
