# Phase 3 Slice 2B19A2 Status

- Slice: `2B19A2 — Effective Base Dreamer V2 Normal Information`
- Authorization: `USER_AUTHORIZED_2B19A2_EFFECTIVE_BASE_DREAMER_V2_NORMAL_INFORMATION`
- Branch: `phase-3/dreamer-v2-base-normal-information`
- Rule evidence: `docs/rules/evidence/2B19A2.md`, verdict `RULE_READY`
- Final design: `docs/implementation/phase-3-slice-2b19a2-design-round-2.md`, SHA-256 `7e4016b89f6cc5f5b07bcf32f6a6e14c9e12db39c7cb66960b1934efb1911687`
- Design review: `docs/implementation/phase-3-slice-2b19a2-design-review-round-2.md`, SHA-256 `7bb36bd0e79200d8a803c2f43c1b1cc78669ad15969be58138a48417e3ff65b2`, verdict `RULE_DESIGN_PASS`
- Design round: `2 / 2`
- Repair round: `0 / 2`
- Slice coverage: `PARTIAL / NORMAL_INFORMATION_ONLY`
- Dreamer role coverage: `PARTIAL`
- Publication status: `LOCAL_GATES_PASS / PENDING_PUBLICATION_CI_AND_REVIEW`

## Implemented

- New V2-plan base Dreamer production opens the exact actionable V3 opportunity while immutable V1 and 2B19A1 V2 history remains replayable without migration.
- V3 target selection accepts exactly one other modeled player and records a V2 target payload bound to the base Dreamer tenure, base ability instance, task, opportunity, player, seat, role, and settlement revision.
- Effective base Dreamer normal information includes the target's current role and one deterministic opposite-alignment role selected by stable code-unit `roleId` ordering.
- Target, delivery, and settlement commit as one exact atomic three-event batch; restart replay reproduces the same state and records one `NORMAL` outcome-ledger fact.
- Source-player and source-AI projections receive only the historical target and two delivered roles. Non-source views omit the delivery, and later character or impairment changes do not rewrite it.
- Represented source DRUNK/POISONED, effective Vortox, current No Dashii, inconsistent provenance, and dependency failures stay receipt-free and do not close or settle the opportunity.
- Accepted-stream replay, hostile replay, and ledger authorities use a shared test-only harness that executes real `GameApplicationService` commands and captures the committed event stream before any test mutation.

## Explicitly Unsupported

- DRUNK or POISONED Dreamer information generation.
- Vortox forced-false Dreamer information.
- No Dashii adjacency or poisoning derivation.
- Philosopher-gained Dreamer execution.
- Storyteller discretionary false-role choice, Travellers, other-night behavior, life/death behavior, FIRST_NIGHT completion, DAY, Phase 2C, 2B19A3, or 2B19B.

## Production Scope

Only the six frozen production files changed:

- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/application/src/game-application-service.ts`

Production additions: `813` lines, below the `1500`-line stop-loss. No event type, event version, `GameState`, workflow, dependency, timeout, or Vitest configuration changed.

## Local Validation

- Frozen authority IDs: `2B19A2-C01` through `2B19A2-C31`, plus `2B19A2-S01` and `2B19A2-S02`; each appears once.
- Typecheck: `PASS`.
- Focused suite: `10 files / 662 tests PASS`.
- Application suite within that run: `4 projects / 236 tests PASS`.
- Rebuild: `204 / 204 PASS`.
- Dreamer policy/shape: `51 / 51 PASS`.
- Ledger: `47 / 47 PASS`.
- Projection: `78 / 78 PASS`.
- Batch semantics: `44 / 44 PASS`.
- V3 opportunity structure: `2 / 2 PASS`.
- Full lint: `PASS`.
- Full ordinary tests: `34 files / 1456 tests PASS`.
- Single-fork full coverage: `34 files / 1456 tests PASS`; `87.12%` statements/lines, `82.09%` branches, `97.74%` functions.
- Diff/scope/static/JSON/design-hash/authority-uniqueness audits: `PASS`.
- Exact-head CI, PR publication, and independent final review remain pending.

Dreamer remains `PARTIAL`; this Slice does not claim complete Dreamer rules.
