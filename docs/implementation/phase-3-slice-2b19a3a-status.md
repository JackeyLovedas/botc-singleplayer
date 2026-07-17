# Phase 3 Slice 2B19A3A Status

- Slice: `2B19A3A — Effective Base Dreamer + Effective Vortox Forced-False Information`
- Authorization: `USER_AUTHORIZED_2B19A3A_EFFECTIVE_SOURCE_VORTOX_IMPLEMENTATION`
- Classification authorization: `USER_AUTHORIZED_GOVERNANCE_TRACEABILITY_V1_1_APPLICATION_COMMAND_LAYER`
- Branch: `phase-3/dreamer-vortox-effective-source`
- Design round: `3 / 3`; repair round: `0 / 2`
- Rule status: `RULE_READY`; design release: `DESIGN_RELEASE_PASS`
- Coverage: `PARTIAL / EFFECTIVE_SOURCE_VORTOX_FALSE_ONLY`
- Publication status: `RUNNING / LOCAL_GATES_PASS / PENDING_FEATURE_COMMIT_AND_EXACT_HEAD_CI`

## Frozen authority

| Artifact | Recorded SHA-256 |
|---|---|
| `docs/rules/evidence/2B19A3A.md` | `7c427b38240ef888e7b9851b5c8ce9a67377224722be01fa8f3154e5f731a7eb` |
| `docs/implementation/phase-3-slice-2b19a3a-design-round-3.md` | `ff191fe9b0877b9fc613fb0f98341fa757a19019918f83b875d564d5e8a91b57` |
| `docs/implementation/phase-3-slice-2b19a3a-design-review-round-3.md` | `fb98868d6953dd8a686f18e75532a19a519e599273496c5e2947cb181133ec69` |
| `docs/implementation/phase-3-slice-2b19a3a-design-release-review-under-governance-v1-1.md` | `cc5fb0b1443cd4a4b08ccedacfa038d8f51a2a358e22df49838ea01fe9b3ad6c` |

Round 3 remains immutable product design. The release review changes only C17 and C27-C32 engineering classification to the accepted V1.1 `APPLICATION_COMMAND_INTEGRATION` layer and supplies the two planned supporting-authority contracts. It changes no rule, behavior, payload, event, ledger schema, projection, receipt, allowlist, or coverage boundary.

## Implemented behavior

- An effective base Dreamer facing one effective current Vortox produces an exact V3 delivery with `VORTOX_FORCED_FALSE`, one native GOOD role and one native EVIL role; neither role is the target's settlement-time character.
- Target choice, V3 delivery, and settlement form one deterministic atomic three-event batch. The application prepares the result before event construction and does not re-resolve during the batch.
- Replay independently reconstructs the same Vortox capability from canonical pre-delivery state. Missing, duplicate, stale, mismatched, or conflicting Vortox tenure/applicability facts fail closed.
- The existing closed ledger evidence union derives one `ABNORMAL / VORTOX_FALSE_INFORMATION` fact with exactly nine evidence entries when the target is Vortox and ten otherwise, with zero impairment evidence.
- The existing Mathematician consumer counts the Dreamer source once for Vortox-caused false information and zero for normal Dreamer information. No Mathematician production file changed.
- Accepted-stream player and AI projections reveal only target, GOOD role, and EVIL role to the Dreamer source. State-only V3 projection and non-source disclosure fail closed without leaking Vortox, tenure, reliability, truth, or impairment facts.
- V1 and normal V2 replay/projection meaning remains unchanged. A successful V3 Dreamer chain continues through a real terminal Seamstress action.
- Source DRUNK remains a reachable, formal, receipt-free `ApplicationNotConfigured` result. Source POISONED, impaired Vortox, No Dashii, shortage, and hostile provenance remain in their frozen non-success classifications.

## Scope

Production files are exactly the five frozen paths:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

Production additions are `522` lines across those five files, below the `1000`-line stop-loss. The seven frozen test paths are the only changed tests. The only new support file is `packages/test-harness/src/dreamer-vortox-v3-accepted-stream.ts` (`166` lines); it is not exported from the public harness index. The three accepted baseline Dreamer harness paths remain byte-unchanged.

No new event type, event version, `GameState` field, evidence union member, Mathematician production API, public trust boundary, workflow, dependency, timeout, Vitest configuration, or coverage threshold was added.

## Supporting authorities

- `SUP-2B19A3A-001`: real accepted Philosopher-choice and V3-open command prefix for the represented-DRUNK base Dreamer; accepted, unmodified, used only by C17.
- `SUP-2B19A3A-002`: real accepted effective-base-Dreamer/effective-current-Vortox V3-open prefix produced by the application test helper; accepted, unmodified, used by C27-C32 and supporting C33.

Both IDs resolve exactly once in `phase-3-slice-2b19a3a-test-traceability.md`. Neither authority determines a primary layer or substitutes for the formal command assertions.

## Validation state

- C48 focused: `1 / 1 PASS`.
- Dreamer Slice-focused including C49/C50: `10 / 10 PASS`; C46 standalone: `1 / 1 PASS`.
- Mathematician C38/C39 focused: `2 / 2 PASS`.
- Complete affected-path run after compatibility repairs: `10 projects / 1136 tests PASS`.
- Ledger plus projection compatibility run: `131 / 131 PASS`.
- Typecheck: `PASS`.
- Full lint: `PASS`.
- Full ordinary tests: `34 files / 1512 tests PASS`; `33.34s`.
- Full single-fork coverage: `34 files / 1512 tests PASS`; `51.1s`; `87.44%` statements/lines, `82.45%` branches, `97.88%` functions; no worker RPC timeout.
- Diff/allowlist/baseline fixture/traceability schema/SUP resolution/reachability-layer/serialization/determinism/test-disable audits: `PASS`.
- Exact-head push/PR CI and independent final review: `PENDING` until the frozen feature HEAD exists and is published.

## Explicitly unsupported

- Source-impaired Dreamer information, impaired-current-Vortox forced-false information, and No Dashii adjacency derivation.
- Philosopher-gained Dreamer V2 execution, Storyteller false-role choice, Traveller targets, other-night behavior, death behavior, and full drunk/poison information evaluation.
- FIRST_NIGHT completion, DAY, Phase 2C, 2B19A3B, and 2B19B.

Dreamer remains `PARTIAL`; Vortox remains `NOT_STARTED`; Mathematician remains `PARTIAL`. No role is promoted to `COMPLETE`.
