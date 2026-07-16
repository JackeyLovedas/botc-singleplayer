# Phase 3 Slice 2B19A1 Status

- Slice: `2B19A1 — Base Dreamer V2 Opportunity Contract`
- Authorization: `USER_AUTHORIZED_2B19A1_BASE_DREAMER_V2_OPPORTUNITY_CONTRACT`
- Branch: `phase-3/dreamer-v2-base-opportunity-contract`
- Rule evidence: `docs/rules/evidence/2B19A1.md`
- Design: `docs/implementation/phase-3-slice-2b19a1-design.md`, SHA-256 `1526a95bcdb7c4d1288a457b068f3fb632d76cebdcc805629469f26310a427dc`
- Design review: `docs/implementation/phase-3-slice-2b19a1-design-review-round-1.md`, SHA-256 `602d27c6153edfa96d0d06b17cfe96607177ced79337691e37e65e1355804d16`, verdict `RULE_DESIGN_PASS`
- Design round: `1 / 2`
- Repair round: `0 / 2`
- Slice coverage: `FOUNDATION / OPPORTUNITY_CONTRACT`
- Dreamer role coverage: `PARTIAL`
- Rule evidence coverage: `SKELETON`
- Publication status: `LOCAL_IMPLEMENTATION_COMPLETE_READY_FOR_CONTROLLER_AUDIT`

## Implemented

- V1 plan generation and V1 replay remain exact.
- V2 plan accepts legacy V1 Dreamer opportunity history without migration.
- Base Dreamer V2 opening produces the exact distinct schema, visibility, source contract, canonical task ID, canonical opportunity ID, active Dreamer tenure, and base first-night ability-instance binding.
- Accepted replay recomputes the same canonical opportunity from state-before.
- Duplicate opportunity IDs, duplicate task IDs, and same-task V1/V2 mixing fail closed.
- OPEN V2 `SubmitDreamerAction` returns the exact retryable receipt-free unsupported result before validation or batch creation.
- V2 Philosopher-gained Dreamer opening returns the exact retryable receipt-free unsupported result when the task is current and next.
- V2 opening and failed submit do not change target facts, delivery facts, outcome ledger, private knowledge, task settlement, phase, or game version.

## Explicitly Unsupported

- V2 target selection or Dreamer information delivery.
- GOOD/EVIL candidate selection and Storyteller false-role discretion.
- Vortox, drunkenness, or poisoning evaluation for V2.
- V2 terminal outcome, ledger fact, or private Dreamer knowledge.
- Successful Philosopher-gained Dreamer execution.
- First-night completion, DAY, 2B19A2, 2B19A3, 2B19B, or Phase 2C.

## Production Scope

- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/application/src/game-application-service.ts`

Production additions: `480` lines (`446 + 34`), with `25` removed legacy-domain lines. No workflow, dependency, timeout, Vitest fork, event type, GameState, projection, or ledger production file changed.

## Validation

- Typecheck: `PASS`
- Targeted lint: `PASS`
- Application suite: `4 projects / 226 tests PASS`
- Combined application/rebuild/projection suite: `6 projects / 502 tests PASS`
- Mathematician compatibility suite: `1 file / 422 tests PASS`
- Full tests: `33 files / 1432 tests PASS`
- Full coverage: `33 files / 1432 tests PASS`; `86.94%` statements/lines, `81.80%` branches, `97.81%` functions
- Full lint: `PASS`
- Diff, scope, static, JSON, and authority-hash audit: `PASS`
- Cross-platform CI: `PENDING`
- Independent final review: `PENDING`

The feature remains unaccepted until full local gates, exact-head CI, complete independent final review, both verbatim GitHub audit comments, merge, tag, and post-merge closeout requirements pass.
