# Phase 3 Slice 2B19A2 Rule-to-Test Traceability

The sole design authority is `docs/implementation/phase-3-slice-2b19a2-design-round-2.md`. Every frozen primary criterion has one physical test bearing its exact identifier. Supporting structural and hostile-replay authorities are separate.

| IDs | Primary file | Covered contract |
|---|---|---|
| C01-C02 | `packages/domain-core/src/rebuild.test.ts` | Exact immutable V1 and 2B19A1 V2 replay |
| C03, C06-C07, C12, C15, C17-C18, C20-C21, C29 | `packages/application/src/game-application-service.test.ts` | Real producer/submit/append/rebuild, deterministic rejection, atomicity, real DRUNK/Vortox/No Dashii plus injected dependency/prospective receipt-free no-mutation paths, retry, phase boundary |
| C04-C05 | `packages/domain-core/src/first-night-action-opportunity.test.ts` | Exact V3 shape and canonical ID grammar |
| C08-C11, C16, C19, C31 | `packages/domain-core/src/dreamer.test.ts` | Normal GOOD/EVIL pairs, stable false role, permutation invariance, represented poisoning branch, shortage, cross-platform vector |
| C13-C14, C30 | `packages/domain-core/src/rebuild.test.ts` | V3 restart replay from a stream produced and appended through real `GameApplicationService` commands; captured-stream hostile batch mutations; legacy subsystem regression |
| C22-C23 | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | Real application-produced stream rebuilds one NORMAL delivery fact; captured accepted pre-settlement ledger remains unchanged when the captured settlement is applied |
| C24-C28 | `packages/projections/src/private-knowledge-view.test.ts` | Source player/AI delivery, non-source omission, leakage scan, historical stability |
| S01 | `packages/domain-core/src/dreamer.test.ts` | V2 target/delivery/reliability/source-contract exact-shape mutation matrix |
| S02 | `packages/domain-core/src/rebuild.test.ts` | Source/task/player/seat/role/revision/tenure/ability/catalog/opportunity cross-links mutated only after a real application-appended accepted stream is captured |

The shared test-only capture authority is `packages/test-harness/src/dreamer-v3-accepted-stream.ts`. It executes the prerequisite and terminal commands through `GameApplicationService`, reads the committed event store, and returns a defensive copy plus exact terminal indexes. It does not construct domain envelopes manually and is not production behavior.

Local focused result: `10 files / 662 tests PASS`; typecheck `PASS`. Full gates and independent final review remain pending.
