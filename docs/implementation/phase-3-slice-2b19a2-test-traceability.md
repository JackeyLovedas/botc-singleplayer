# Phase 3 Slice 2B19A2 Rule-to-Test Traceability

The sole design authority is `docs/implementation/phase-3-slice-2b19a2-design-round-2.md`. Every frozen primary criterion has one physical test bearing its exact identifier. Supporting structural and hostile-replay authorities are separate.

| IDs | Primary file | Covered contract |
|---|---|---|
| C01-C02 | `packages/domain-core/src/rebuild.test.ts` | Exact immutable V1 and 2B19A1 V2 replay |
| C03, C06-C07, C12, C15, C17-C18, C20-C21, C29 | `packages/application/src/game-application-service.test.ts` | Real producer/submit/append/rebuild, exact live-capture-to-fixture equality in C07, deterministic rejection, atomicity, real DRUNK/Vortox/No Dashii plus injected dependency/prospective receipt-free no-mutation paths, retry, phase boundary |
| C04-C05 | `packages/domain-core/src/first-night-action-opportunity.test.ts` | Exact V3 shape, legal stored OPEN/CLOSED lifecycle, immutable V2 OPEN-only storage, and canonical ID grammar |
| C08-C11, C16, C19, C31 | `packages/domain-core/src/dreamer.test.ts` | Normal GOOD/EVIL pairs, stable false role, permutation invariance, represented poisoning branch, shortage, cross-platform vector |
| C13-C14, C30 | `packages/domain-core/src/rebuild.test.ts` | V3 restart replay from the application-verified accepted-stream fixture; seven cloned-fixture hostile suffixes replayed against one defensive accepted prefix state; lazy defensive accepted-V1 state shared by C01/C30 without losing standalone execution; legacy subsystem regression |
| C22-C23 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | Application-verified accepted-stream fixture rebuilds one NORMAL delivery fact; accepted pre-settlement ledger remains unchanged when the cloned captured settlement is applied |
| C24-C28 | `packages/projections/src/private-knowledge-view.test.ts` | Source player/AI delivery, non-source omission, leakage scan, historical stability |
| S01 | `packages/domain-core/src/dreamer.test.ts` | Exhaustive V2 target/delivery missing-key, wrong-type/literal, source-contract, and reliability matrices plus exception-safe proxy/accessor/symbol/cycle/non-plain rejection with getter count zero |
| S02 | `packages/domain-core/src/rebuild.test.ts` | Nine source/task/player/seat/role/revision/tenure/ability/catalog/opportunity cross-links mutated after fixture clone and replayed through full-stream, batch, event, and tenure validation from one defensive pre-opportunity prefix state |

The accepted-stream authority has two explicit test-only links. `packages/test-harness/src/dreamer-v3-accepted-stream.ts` executes prerequisite and terminal commands through `GameApplicationService` and reads the committed store. Application C07 compares that live result to `packages/test-harness/src/fixtures/dreamer-v3-accepted-stream.json` with object-level `toStrictEqual`, including terminal indexes `28 / 29 / 30`. `packages/test-harness/src/dreamer-v3-accepted-stream-fixture.ts` then supplies defensive clones of that verified fixture to C13/C14/S02/C22/C23 without importing or executing the live application capture path in those domain tests. No test compares serialized JSON text, and no domain test constructs a replacement envelope.

Final Frozen-Design Repair Round 3 adds one supporting accepted-stream authority in `packages/application/src/game-application-service.test.ts`: real V3 Dreamer success continues through a real terminal Seamstress information action, while the same test directly proves stored V3 CLOSED replay, V3 creation-payload CLOSED rejection, and closed-V3 submit rejection without append. C04 separately proves stored V3 OPEN/CLOSED and immutable 2B19A1 V2 OPEN-only behavior. No frozen primary ID was duplicated or reassigned.

Round 3 local result: typecheck and full lint `PASS`; direct focused `6 projects / 290 tests PASS`; ordinary and single-fork coverage `34 files / 1457 tests PASS`; single-fork total `128.4s`; coverage `87.24 / 82.11 / 97.76`; no `onTaskUpdate` failure. Publication, fresh exact-head CI, and complete independent final review remain pending; no Repair Round 4 exists.
