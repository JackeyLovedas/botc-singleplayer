# Project Agent Instructions

## Project Start

Before planning or coding, read these handoff files in order:

1. `project-handoff/00-README-FIRST.md`
2. `project-handoff/PROJECT_HANDOFF.md`
3. `project-handoff/PRODUCT_SCOPE.md`
4. `project-handoff/RULES_BASELINE.md`
5. `project-handoff/ARCHITECTURE_INPUT.md`
6. `project-handoff/IMPLEMENTATION_GUARDRAILS.md`
7. `project-handoff/OPEN_RISKS.md`
8. `project-handoff/DEVELOPMENT_ROADMAP.md`
9. `project-handoff/DOMAIN_GLOSSARY.md`
10. `project-handoff/TEST_COVERAGE_SUMMARY.md`

Then check:

- `project-handoff/rules/`
- `project-handoff/tests/`
- `docs/architecture/`

## Current Phase

Current phase: Phase 2.1 - implementation-ready architecture finalization.

Phase 2.1 may add or refine architecture documents only. It must not start Phase 3 coding.

Locked decisions:

- Language: TypeScript.
- Architecture: modular monolith.
- Desktop container: Electron later, not during early domain implementation.
- Local persistence: SQLite.
- Rule core: independent domain package with no UI or Electron dependency.
- AI input: only legal player projections.
- AI output: candidate commands only.
- Rules baseline: Phase One v2.1.

## Rules

- Do not restart rule research unless a documented contradiction is found.
- Do not rewrite the rule baseline to fit implementation convenience.
- For any rule conflict, check `RULES_BASELINE.md` first, then the referenced rule file and tests.
- For any role implementation, check the role specification and related tests first.
- `PARTIAL` roles require additional tests before implementation.
- Plan before implementation.
- Complete one verifiable milestone at a time.
- Do not generate the entire game in one pass.
- Do not create rough AI-style UI.
- Do not replace missing design with placeholder text.
- Do not modify rules to suit code.
- Do not hide failures.
- Every meaningful change must include tests or a documented validation method.
- When a rule is undefined, stop that feature and record the open question.
- Do not expand scope silently.

## Phase 2.1 Constraints

- Do not initialize a formal project framework.
- Do not create code package directories such as `apps/` or `packages/` before Phase 3 is explicitly approved.
- Do not write business code.
- Do not create UI.
- Do not implement role abilities.
- Do not implement AI players.
- Do not generate a demo.
- Do not move `PARTIAL` roles to `VERIFIED_CORE`.
- Do not change rules to match technical design.
- Do not proceed to Phase 3 until `docs/architecture/24-phase-2-final-status.md` has no implementation-level architecture blocker and the user explicitly continues.

## Architecture Guardrails

- AI must never receive `canonicalGameState`.
- LLM output must become a candidate command, not an authoritative event.
- Random behavior must record seed and candidate set.
- Storyteller decisions must record legal candidates and final choice.
- Player view, AI memory, public state and replay truth must stay separate.
- Each game has one logical writer.
- Human commands, AI commands, system tasks, and Storyteller choices enter the same serial command queue.
- Domain events are the authoritative source for game state.
- Snapshots are rebuildable caches, not independent truth.
- Audit events and infrastructure events must not rebuild canonical state.
- Task execution must distinguish `ScheduledTask`, `ActionOpportunity`, `EventSubscription`, and `ContinuousRule`.
- Player and AI visible options must not leak hidden role, alignment, or truth information.
- Ability effectiveness must be evaluated at settlement time, not stored as a permanent task fact.
- Information evaluation must keep semantic truth, reliability, truth constraint, registration, and simulation reason separate.
- Effects must support multiple sources and dependency-aware recalculation.
- Player knowledge must be derived from knowledge and information events, not maintained as a manually editable truth object.
