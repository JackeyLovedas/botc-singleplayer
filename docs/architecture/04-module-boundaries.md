# Module Boundaries

## Proposed Modules

| Module | Owns | Does Not Own |
| --- | --- | --- |
| `domain-core` | Game aggregate, commands, events, state machine, event applier | UI rendering, AI prompts |
| `application` | Game application service, session runner, command queue, unit of work orchestration | Domain rule decisions |
| `rules-baseline` | Versioned rule constants and role metadata from Phase One v2.1 | Changing rule status or source authority |
| `setup-engine` | Script validation, setup generation, role assignment, demon bluffs | Runtime role changes |
| `command-validator` | Legal command checks by phase and actor | Storyteller strategy |
| `ability-resolver` | Role capability registry and event hooks | Giant role if/else |
| `task-engine` | `ScheduledTask`, `ActionOpportunity`, `EventSubscription`, and `ContinuousRule` orchestration | Permanent global night array |
| `effect-engine` | `EffectInstance` lifecycle and suppression/resume logic | Player claims |
| `information-engine` | Candidate sets, `InformationEvaluation`, Vortox false information, registration projection | Player-facing truth disclosure |
| `storyteller-policy` | Legal candidate selection and decision logs | Freeform winner selection |
| `victory-resolver` | Victory candidate collection and resolution | UI messaging |
| `projection-engine` | Public/player/AI/Storyteller/replay views | Domain mutation |
| `ai-gateway` | AI prompts, memory, candidate command parsing, audit | Canonical state access |
| `persistence` | Event log, snapshots, migrations, replay indexes | Rule decisions |
| `test-harness` | Fixtures, golden replays, leakage checks, role coverage gates | Production behavior |

## Role Capability Boundary

Each role should be represented by metadata plus capability hooks. A role module may declare:

- setup modifier;
- night task specs;
- day action specs;
- command validators;
- event listeners;
- effect producers;
- information candidate builders;
- victory modifiers;
- projection rules.

It must not directly mutate canonical state. It returns candidate effects or events to the resolver.

## Dependency Direction

```text
desktop shell -> projections -> application -> domain-core
ai-gateway -> projections -> application -> command-validator -> domain-core
storyteller-policy -> legal candidates -> application -> domain-core
persistence -> application -> domain-core event/snapshot contracts
role modules -> domain-core rule interfaces
```

Lower-level modules must not import UI, AI provider, or desktop packaging code.
Application coordinates command handling, persistence, projection publishing, and follow-up scheduling. It must not absorb role rules or mutate canonical state directly.

## Forbidden Couplings

- UI reading `canonicalGameState`.
- AI gateway importing domain internals that expose hidden truth.
- Role modules sharing a mutable global night array.
- Storyteller policy creating events that were not produced as legal candidates.
- Persistence migrations silently changing rule meaning.
