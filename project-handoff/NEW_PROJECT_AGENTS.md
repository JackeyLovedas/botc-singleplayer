# AGENTS.md Draft For New Project

## Project Start

Before planning or coding, read these handoff files in order:

1. `00-README-FIRST.md`
2. `PROJECT_HANDOFF.md`
3. `PRODUCT_SCOPE.md`
4. `RULES_BASELINE.md`
5. `ARCHITECTURE_INPUT.md`
6. `IMPLEMENTATION_GUARDRAILS.md`
7. `OPEN_RISKS.md`
8. `DEVELOPMENT_ROADMAP.md`

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

## Architecture Guardrails

- AI must never receive `canonicalGameState`.
- LLM output must become a candidate command, not an authoritative event.
- Random behavior must record seed and candidate set.
- Storyteller decisions must record legal candidates and final choice.
- Player view, AI memory, public state and replay truth must stay separate.
