# Project Structure

## Proposed Structure

This is a design target only. Phase 2.1 must not create these actual code directories.

```text
apps/
  desktop/

packages/
  domain-core/
  application/
  rules-baseline/
  rules-snv/
  setup-engine/
  task-engine/
  effect-engine/
  information-engine/
  victory-engine/
  projections/
  persistence-sqlite/
  ai-gateway/
  test-harness/

docs/
  architecture/
  rules/
```

## Package Responsibilities

| Package | Responsibility |
| --- | --- |
| `apps/desktop` | Future Electron shell and UI only |
| `packages/domain-core` | Aggregates, commands, domain events, state machine, event applier, core value objects |
| `packages/application` | `GameApplicationService`, `GameSessionRunner`, `CommandBus`, `UnitOfWork`, orchestration |
| `packages/rules-baseline` | Phase One v2.1 rule status, glossary, coverage metadata |
| `packages/rules-snv` | Sects & Violets role definitions and rule hooks |
| `packages/setup-engine` | Script validation, 12-player setup, assignment, demon bluffs |
| `packages/task-engine` | `ScheduledTask`, `ActionOpportunity`, `EventSubscription`, `ContinuousRule` coordination |
| `packages/effect-engine` | Effect instances, stacking, source dependencies, recalculation |
| `packages/information-engine` | Candidate sets, `InformationEvaluation`, registration projection, Vortox constraints |
| `packages/victory-engine` | Victory candidate collection and resolution |
| `packages/projections` | Public, player, AI, Storyteller, and replay projections |
| `packages/persistence-sqlite` | SQLite event store, snapshots, migrations, recovery |
| `packages/ai-gateway` | AI provider adapters, prompt construction from projections, candidate command parsing |
| `packages/test-harness` | Fixtures, golden replay, leakage tests, deterministic seed tests |

## Dependency Direction

Allowed direction:

```text
apps/desktop
  -> packages/application
  -> packages/domain-core

packages/application
  -> domain-core
  -> setup-engine
  -> task-engine
  -> effect-engine
  -> information-engine
  -> victory-engine
  -> projections
  -> persistence-sqlite
  -> ai-gateway

rules-snv -> rules-baseline -> domain-core public rule interfaces
engines -> domain-core public interfaces
projections -> domain-core read models and event contracts
persistence-sqlite -> domain-core event/snapshot contracts
ai-gateway -> projections and application command contracts
test-harness -> all packages under test
```

## Hard Boundaries

- `domain-core` must not depend on Electron, SQLite, AI SDKs, or UI packages.
- `domain-core` owns domain contracts but not application orchestration.
- `application` coordinates command handling and persistence; it must not absorb role rules.
- Role modules depend only on public domain rule interfaces.
- `persistence-sqlite` persists contracts; it must not decide rules.
- `ai-gateway` receives projections and returns candidate commands; it must not import canonical state builders.
- No circular dependencies.

## Phase Boundary

Do not create `apps/` or `packages/` during Phase 2.1. These directories become eligible only after the user explicitly starts Phase 3.
