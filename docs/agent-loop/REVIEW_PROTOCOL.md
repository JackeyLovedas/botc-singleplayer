# Review Protocol

## Required Evidence
1. Inspect actual Git state, PR diff and HEAD, affected production code, tests, rule sources, architecture, implementation status, and CI commands/results.
2. Every new event flow needs exact runtime payload validation, event application/replay validation, atomic batch semantics, prospective validation, and malformed/negative tests.
3. Rebuild from accepted domain events must reproduce canonical state; snapshots are caches only.
4. Command inputs must not carry computed secret outcomes. Deterministic actor/phase/version/order errors may persist rejected receipts.
5. Planner, resolver, generated-event, dependency, and prospective-validation failures remain retryable and must not burn a command id. Metadata generation remains a distinct failure stage.

## Information Safety
1. AI and player projections never expose canonical state, complete assignment, task-plan internals, correct-answer markers, impairment reasons, Storyteller notes, or unauthorized private conversations.
2. Validate every stored delivered-information fact before projection: exact shape, supported versions, source snapshots/catalog entries, task, and matching settlement.
3. Delivered knowledge is historical. Projection validation must not recompute old knowledge from later `currentCharacterState` or later impairments.
4. Keep semantic truth, reliability, truth constraints, registration, and simulation reason separate.

## Determinism And Rules
1. No canonical `Date.now`, `Math.random`, random UUID, `localeCompare`, `Intl.Collator`, environment locale, or insertion-order dependence.
2. Random choices record seed and candidate set; Storyteller choices record legal candidates and final choice.
3. Check the role specification and related handoff tests. Stop the feature when the rule is undefined or sources conflict.
4. Do not silently change assignment, current character state, setup, task plan, or accepted event history outside the slice contract.

## Merge Gate
1. `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:coverage` pass.
2. Required Ubuntu and Windows CI steps demonstrably execute and pass.
3. Reviewer decision is `PASS`, reviewed HEAD equals PR HEAD, no blocker remains, and worktree is clean.
4. Never delete or weaken tests, merge around a gate, or start the next slice early.
