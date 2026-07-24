# Phase 3 Slice 2B20A Implementation Status

## Status

- sliceId: `2B20A`
- disposition: `UNACCEPTED`
- implementation: `COMPLETE_PENDING_PRODUCT_COMMIT_PUSH_CI_AND_FINAL_REVIEW`
- coverage: `PARTIAL / REACHABLE_BASE_DREAMER_SETTLEABILITY_ONLY`
- Dreamer role coverage: `PARTIAL`
- behaviorDesignChangedDuringImplementation: `false`
- ruleSemanticsChanged: `false`
- repairRound: `0 / 2`
- productRepairRoundConsumed: `false`

## Implemented Product Boundary

The implementation closes only the real accepted first-night path with base
Dreamer `ai-seat-01`, Philosopher `ai-seat-10`, one canonical
`PHILOSOPHER_CHOSEN_DUPLICATE` drunkenness record, unique current Fang Gu, no
current Vortox or No Dashii, an open V3 opportunity, and a legal non-self
modeled target.

`SubmitDreamerAction` now commits the existing target event, additive V7
delivery, and existing settlement event atomically. V7 records the complete
canonical GOOD-by-EVIL apparent-pair candidate set, raw UTF-16 ordering,
deterministic parity choice, exact source impairment, and unique current Fang
Gu constraint. Immediate-state batch and replay validation rebuild the same
result.

TRUE produces a normal base-Dreamer fact with no contribution. FALSE produces
one abnormal `SOURCE_DRUNKENNESS` base-Dreamer fact. Philosopher remains causal
impairment provenance and is never substituted as delivery source or counted
player.

Accepted-history projection exposes only the existing target reference and
delivered pair to the source player or source AI. State-only or hostile V7
objects remain unavailable, including accessor and revoked-Proxy input with
zero getter calls.

## Preserved and Unsupported

- V1 through V6 accepted replay and projection remain additive and unchanged.
- Normal and effective-current-Vortox base Dreamer behavior remain unchanged.
- Philosopher-gained Dreamer behavior remains unchanged.
- Rejected command receipts, retryable failures, idempotency, fingerprints,
  replay, and persistence remain under their accepted contracts.
- No top-level `GameState` field, command, event type, event version, ledger
  schema, evidence kind, generic effect engine, fixture, workflow, dependency,
  timeout, ownership topology, or coverage profile was added.
- Poisoned success, No Dashii derivation, gained-Dreamer impairment,
  impaired/dead Vortox, other-night behavior, first-night completion/day entry,
  nomination, voting, execution, death, and Phase 2C remain unsupported.

## Changed Product Files

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

`packages/domain-core/src/event-applier.ts` is unchanged.

## Test Evidence

The exact 37 active criterion bindings are recorded in
`docs/implementation/phase-3-slice-2b20a-test-traceability.md`.

Current local result:

- all six required focused test files pass;
- typecheck passes;
- lint passes;
- the full ordinary suite passes (`35` files / `1572` tests);
- the full coverage suite passes all `35` files / `1572` tests and emits the
  coverage report (`73.57%` statements, `83.38%` branches, `97.34%`
  functions), but the Vitest parent process exits `1` after one unhandled
  `[vitest-worker]: Timeout calling "onTaskUpdate"` infrastructure error;
- the local shell resolves pnpm `11.9.0` while `package.json` pins
  `pnpm@11.7.0`; Node matches the required `v24.15.0`;
- independent governance classification is
  `CONDITIONAL_PRODUCT_CANDIDATE_ALLOWED`: the single local coverage-process
  failure is recorded without conversion to pass, consumes no product repair
  round, and leaves C32 pending exact-head CI;
- the ownership verifier self-test passes (`22 / 22`);
- the traceability inventory is exact (`37` active criteria, `37` unique
  primary identities, `37` unique supporting-authority identities);
- static scope, diff, and forbidden nondeterminism checks pass; production
  additions are `572` lines across the exact five-file allowlist and
  `event-applier.ts` remains unchanged;
- exact pushed-head CI and independent complete final review remain mandatory.

PRODUCT_CANDIDATE_COMPLETE_PENDING_CONTROLLER_PUSH_EXACT_HEAD_CI_AND_FINAL_REVIEW
