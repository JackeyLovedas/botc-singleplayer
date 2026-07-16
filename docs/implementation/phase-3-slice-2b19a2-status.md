# Phase 3 Slice 2B19A2 Status

- Slice: `2B19A2 — Effective Base Dreamer V2 Normal Information`
- Authorization: `USER_AUTHORIZED_2B19A2_EFFECTIVE_BASE_DREAMER_V2_NORMAL_INFORMATION`
- Accepted branch: `phase-3/dreamer-v2-base-normal-information`; current branch: `main`
- Rule evidence: `docs/rules/evidence/2B19A2.md`, verdict `RULE_READY`
- Final design: `docs/implementation/phase-3-slice-2b19a2-design-round-2.md`, SHA-256 `7e4016b89f6cc5f5b07bcf32f6a6e14c9e12db39c7cb66960b1934efb1911687`
- Design review: `docs/implementation/phase-3-slice-2b19a2-design-review-round-2.md`, SHA-256 `7bb36bd0e79200d8a803c2f43c1b1cc78669ad15969be58138a48417e3ff65b2`, verdict `RULE_DESIGN_PASS`
- Design round: `2 / 2`
- Repair round: `3 / 3`
- Slice coverage: `PARTIAL / NORMAL_INFORMATION_ONLY`
- Dreamer role coverage: `PARTIAL`
- Publication status: `COMPLETED / ACCEPTED / PENDING_CLOSEOUT_COMMIT_CI`

## Implemented

- New V2-plan base Dreamer production opens the exact actionable V3 opportunity while immutable V1 and 2B19A1 V2 history remains replayable without migration.
- V3 target selection accepts exactly one other modeled player and records a V2 target payload bound to the base Dreamer tenure, base ability instance, task, opportunity, player, seat, role, and settlement revision.
- Effective base Dreamer normal information includes the target's current role and one deterministic opposite-alignment role selected by stable code-unit `roleId` ordering.
- Target, delivery, and settlement commit as one exact atomic three-event batch; restart replay reproduces the same state and records one `NORMAL` outcome-ledger fact.
- Source-player and source-AI projections receive only the historical target and two delivered roles. Non-source views omit the delivery, and later character or impairment changes do not rewrite it.
- Represented source DRUNK/POISONED, effective Vortox, current No Dashii, inconsistent provenance, and dependency failures stay receipt-free and do not close or settle the opportunity.
- Accepted-stream authority is a two-link test-only chain: application C07 executes real `GameApplicationService` commands and compares the committed 31-event stream to the immutable fixture with `toStrictEqual`; replay, hostile-replay, and ledger authorities clone that application-verified fixture before any mutation.

## Repair Round 1

- Frozen feature HEAD `99f04a89bb06a66336c429af0e27c337bfc29af6` passed all `34 / 1456` test assertions in push CI `29493114740` and PR CI `29493159871`, but both Coverage jobs failed after test execution with Vitest worker RPC error `Timeout calling "onTaskUpdate"`.
- Root cause: `@botc/test-harness` eagerly re-exported the live Dreamer capture helper, so domain-core fixture consumers loaded and repeatedly executed the full application capture path inside the single-fork coverage worker.
- The repair removes that eager live-capture export, exports only the immutable captured fixture to domain tests, and keeps live `GameApplicationService` generation plus exact fixture verification in application C07. Production, workflows, dependencies, timeouts, Vitest configuration, criteria, and test count are unchanged.

## Repair Round 2

- Repair Round 1 HEAD `bdb56f2c7314a4fba43b634a720aa7591d7c2b8b` passed push CI `29494706705`; PR CI `29494709511` again passed `34 / 1456` before the same worker RPC timeout. The successful runner completed rebuild `204` in `34.563s` and the suite in `117.06s`; the failed runner took `64.827s` and `213.78s`.
- C14 still rejects the same seven duplicate/reversed/naked/partial/mixed/schema/cross-batch cases, and S02 still rejects the same nine source cross-links. Each now rebuilds its accepted prefix once, then validates every hostile suffix through the canonical full-stream validator, batch replay, event application, and role-tenure replay checks on a defensive cloned prefix state.
- C01 and C30 share a lazy defensive accepted V1 capture. Either test still rebuilds independently when run alone; the cache only removes C30's duplicate accepted legacy Dreamer rebuild in the complete file run.
- This final repair changes only `rebuild.test.ts` and status/control documentation. Production, design, fixture provenance, test IDs/count, workflows, dependencies, timeouts, and Vitest configuration remain unchanged.

## Final Frozen-Design Repair Round 3

- Authorization `USER_AUTHORIZED_2B19A2_FINAL_FROZEN_DESIGN_REPAIR_ROUND_3` overrides the prior `2 / 2` repair ceiling exactly once. Repair is now `3 / 3`; no Repair Round 4 exists.
- Stored canonical Dreamer V3 opportunities now accept both legal lifecycle states, `OPEN` and `CLOSED`. Creation payloads still require `OPEN`, the immutable 2B19A1 non-actionable V2 contract still permits only `OPEN`, and `SubmitDreamerAction` still rejects a `CLOSED` V3 opportunity without appending.
- One real command stream now settles effective V3 Dreamer information, opens the immediately following Seamstress opportunity, settles real Seamstress information, validates the accepted stream, and rebuilds both closed opportunities and terminal settlements. The continuation test measured `479–719ms` across focused, ordinary, and single-fork coverage runs; no timeout changed.
- Dreamer V2 target and delivery T1 validators now apply an exception-safe canonical-data gate before semantic field access and wrap the remaining validation boundary fail closed. Throwing and revoked proxies, accessors, enumerable symbols, cycles, and non-plain objects are rejected; the direct accessor matrix proves zero getter invocations.
- S01 now covers every target and delivery missing key, every top-level wrong type, frozen literal discriminants, every source-contract missing key and wrong type, all source-contract frozen literals, and the effective/impaired reliability rejection matrix.
- This repair changes only `first-night-action-opportunity.ts`, `dreamer.ts`, their direct tests, the accepted-stream application test, and status/control/traceability documentation. It does not change rules, evidence, design, event versions, information selection, ledger, projection, receipt behavior, workflows, dependencies, timeouts, or Vitest configuration.

## Explicitly Unsupported

- DRUNK or POISONED Dreamer information generation.
- Vortox forced-false Dreamer information.
- No Dashii adjacency or poisoning derivation.
- Philosopher-gained Dreamer execution.
- Storyteller discretionary false-role choice, Travellers, other-night behavior, life/death behavior, FIRST_NIGHT completion, DAY, Phase 2C, 2B19A3, or 2B19B.

## Production Scope

The complete Slice still contains the six frozen production files:

- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/application/src/game-application-service.ts`

Production additions: `885` lines, below the `1500`-line stop-loss. No event type, event version, `GameState`, workflow, dependency, timeout, or Vitest configuration changed.

Round 3 production changes are confined to `packages/domain-core/src/first-night-action-opportunity.ts` and `packages/domain-core/src/dreamer.ts`.

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
- Full ordinary tests: `34 files / 1457 tests PASS`.
- Rebuild focused run: `204 / 204 PASS`; `17.78s` tests (`17.88s` standalone validation).
- Single-fork full coverage: `34 files / 1457 tests PASS`; `128.4s`; `87.24%` statements/lines, `82.11%` branches, `97.76%` functions; no `onTaskUpdate` failure.
- Diff/scope/static/JSON/design-hash/authority-uniqueness audits: `PASS`.
- PR `#34` merged. Frozen feature HEAD `f5d5fe8b2d270fe760644e374e722f4aa1dd7dfe` passed push/PR CI `29503106606 / 29503110162`; complete independent review returned `CODE_REVIEW_PASS / RULE_REVIEW_PASS`, `remainingBlockers=[]`.
- Merge `55738229962173b0f0772cff1f69d1453c14af1d` passed merge-main CI `29504378316`; accepted tag `phase-3-slice-2b19a2-dreamer-v2-base-normal-information` passed tag CI `29504409993` on the same SHA.
- Final review archives: `docs/reviews/pr-34-code-review-final.md` and `docs/reviews/pr-34-rule-review-final.md`. The future docs-only closeout commit CI remains `PENDING` and inherits no prior status.

Dreamer remains `PARTIAL`; this Slice does not claim complete Dreamer rules.
