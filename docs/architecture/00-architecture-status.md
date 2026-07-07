# Phase 2 Architecture Status

## Status

Phase: Phase 2 - 技术架构与领域模型设计

Result: Proposed for review

Implementation status: no project framework, no UI, no business code, no role ability implementation, no AI implementation.

## Baseline

- Rules baseline: Phase One v2.1
- Baseline status: 有条件通过
- First release scope: 12 人《梦殒春宵》
- Human players: 1
- AI players: 11
- Automated Storyteller: 1, not counted as a player
- Valid rule tests: 76, using `RULES_BASELINE.md`, `TEST_COVERAGE_SUMMARY.md`, `tests/25-rule-test-cases.md`, and `tests/31-test-coverage-report.md` as the current authority
- No current `blocksDevelopment = Yes` rule issue

## Inputs Checked

Required handoff files were read from `project-handoff/` because the listed files were not present at repository root.

- `project-handoff/00-README-FIRST.md`
- `project-handoff/PROJECT_HANDOFF.md`
- `project-handoff/PRODUCT_SCOPE.md`
- `project-handoff/RULES_BASELINE.md`
- `project-handoff/ARCHITECTURE_INPUT.md`
- `project-handoff/IMPLEMENTATION_GUARDRAILS.md`
- `project-handoff/OPEN_RISKS.md`
- `project-handoff/DEVELOPMENT_ROADMAP.md`
- `project-handoff/DOMAIN_GLOSSARY.md`
- `project-handoff/TEST_COVERAGE_SUMMARY.md`
- `project-handoff/rules/`
- `project-handoff/tests/`

`AGENTS.md` was requested but does not exist in the project root or subdirectories. `project-handoff/NEW_PROJECT_AGENTS.md` was inspected as the intended draft for a future project `AGENTS.md`; it matches the phase constraints and guardrails.

## Architecture Decisions Summary

- Use a local modular monolith, not microservices.
- Separate a deterministic domain kernel from desktop shell, AI gateway, persistence, and future UI.
- Use command validation plus event-sourced domain state with periodic snapshots.
- Keep canonical state private to the rules engine and Storyteller view.
- Generate player and AI projections from canonical state; never pass canonical state to AI.
- Model rule execution as `ScheduledTask`, `ActionOpportunity`, `EventSubscription`, and `ContinuousRule`, not one permanent order array.
- Model drunk, poisoned, madness, No Dashii, Vigormortis, Vortox, Witch, Sweetheart, Philosopher and related ongoing effects as `EffectInstance` records.
- Treat information as candidate-set generation plus orthogonal `InformationEvaluation`; hide evaluation metadata from player and AI views.
- Use a victory resolver that collects and resolves `VictoryCandidate` values; the Storyteller cannot freely pick a winner.
- Use fixed seeded random streams and record candidate sets plus selected indexes.
- Use domain events as the authoritative state source; snapshots are rebuildable caches and replay does not re-call AI.

## Constraints Preserved

- `PARTIAL` roles remain `PARTIAL`.
- Rules are not changed to fit the architecture.
- Custom script, setup, and assignment stay separate.
- Execution and death stay separate.
- Registration is a check-time projection, not a real role or alignment mutation.
- LLM output is never a domain event; it is only a candidate command.

## Input Inconsistencies

`tests/28-test-deduplication-report.md` says the final effective test count is 51, while `RULES_BASELINE.md`, `TEST_COVERAGE_SUMMARY.md`, `tests/25-rule-test-cases.md`, and `tests/31-test-coverage-report.md` confirm 76. Architecture uses 76 as the current v2.1 authority and records the old 51 value as a documentation cleanup risk.

## Stop Condition

Phase 2 stops at this architecture package. Phase 3 must not begin until the architecture is reviewed and accepted.
