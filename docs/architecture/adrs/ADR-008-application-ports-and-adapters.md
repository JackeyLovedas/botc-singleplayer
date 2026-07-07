# ADR-008: Application Ports And Adapters

## Status

Accepted

## Context

Phase 3 introduces the first implementation slice. The Phase 2.1 package direction implied that `application` might depend directly on concrete persistence and AI packages. That would invert the intended boundary and make domain/application tests depend on infrastructure.

## Decision

Use a ports-and-adapters boundary around `application`.

`application` defines the ports it needs, including persistence, command receipts, projection publishing, clocks, id generation, and future AI interfaces. Concrete adapters such as `persistence-sqlite` and `ai-gateway` implement those ports.

The future composition root, such as `apps/desktop`, instantiates concrete adapters and injects them into application services.

## Alternatives

| Alternative | Reason Rejected |
| --- | --- |
| `application` imports `persistence-sqlite` directly | Couples command orchestration to one storage implementation |
| `application` imports `ai-gateway` directly | Makes AI provider details part of core command flow |
| Put ports in infrastructure packages | Forces application to depend outward and risks circular dependencies |

## Consequences

- Application tests can use memory adapters without SQLite or AI SDK dependencies.
- `domain-core` and `application` stay headless and deterministic.
- Concrete adapters are replaceable.
- Composition root has explicit wiring responsibility.
- Port contracts need to remain small and implementation-neutral.
