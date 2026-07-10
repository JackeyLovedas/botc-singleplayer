# Agent Instructions

## Authority
- Current phase: **Phase 3 — controlled vertical slices**.
- Treat the checked-out repository and GitHub as current truth; use `docs/agent-loop/CURRENT_TASK.md` for the active slice.
- Before planning or coding, read the handoff files in the order listed by `project-handoff/00-README-FIRST.md`, then the relevant `project-handoff/rules/`, `project-handoff/tests/`, architecture, and latest implementation status.
- Rules baseline: Phase One v2.1. Do not rewrite rules for implementation convenience.
- A `PARTIAL` role requires relevant tests before its implementation expands.

## Package Manager
- Use **pnpm 11.7.0** with Node **24.15.0**.
- Install with `pnpm install --frozen-lockfile`.

## File-Scoped Commands
| Task | Command |
|---|---|
| Test | `pnpm exec vitest run --workspace vitest.workspace.ts path/to/file.test.ts` |
| Lint | `pnpm exec eslint path/to/file.ts --max-warnings 0` |
| Typecheck | No reliable file-scoped command; use `pnpm typecheck` |

## Full Gates
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:coverage`.
- Merge only when the independent reviewer passes, required CI is green, reviewed HEAD equals PR HEAD, and the worktree is clean.

## Agent Workflow
- Controller coordinates; `architect` and `reviewer` are read-only; `implementer` is the sole writer.
- Keep one bounded slice, one writing agent, one feature branch, and one open slice PR at a time.
- Do not merge a new PR or begin the next slice before review and gates pass.
- Stop the affected feature on unresolved rule conflict, unsafe history rewrite, permissions failure, or repeated identical failure.
- Follow `docs/agent-loop/REVIEW_PROTOCOL.md`; record progress in `docs/agent-loop/AUTOPILOT_LOG.md`.

## Key Conventions
- TypeScript modular monolith; the domain core has no UI or Electron dependency.
- Domain events are canonical truth; snapshots are rebuildable caches, and audit/infrastructure events do not rebuild game state.
- Human, AI, System, and Storyteller commands use one serial command queue and one logical writer per game.
- AI never receives canonical state; LLM output is a candidate command, never an authoritative event.
- Player views, AI memory, public state, Storyteller state, and replay truth stay separate.
- Delivered knowledge is a historical fact: validate stored facts before projection and never recompute them from newer character state.
- Evaluate ability effectiveness at settlement; keep truth, reliability, registration, constraints, and simulation reason separate.
- Use exact runtime payload validation, replay validation, atomic batch semantics, and prospective validation for every new event flow.
- Canonical IDs and ordering must not use `Date.now`, `Math.random`, random UUIDs, `localeCompare`, `Intl.Collator`, or environment locale.
- Distinguish `ScheduledTask`, `ActionOpportunity`, `EventSubscription`, and `ContinuousRule`.
- Record random candidate sets/seeds and Storyteller legal candidates/final choices.
- Never hide failures, weaken tests, or expand scope silently.

## Commit Attribution
- AI commits MUST include `Co-Authored-By: Codex GPT-5 <noreply@openai.com>`.
