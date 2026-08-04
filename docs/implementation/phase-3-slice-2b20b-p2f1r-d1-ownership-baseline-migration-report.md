# Phase 3 Slice 2B20B-P2F1R-D1 Ownership Baseline Migration Report

## Status and authority

- implementation base HEAD: `6a6d8026b1a3e23d7f9ab54a69e2e1a4516472b2`.
- branch: `phase-3/2b20b-p2f1r-d1-ownership-baseline-migration`.
- rule evidence: `RULE_READY`; BOTC rule changes: `none`.
- independent design gate: `/root/d1_design_review_round2_fresh`; reviewed HEAD `6a6d8026b1a3e23d7f9ab54a69e2e1a4516472b2`; timestamp `2026-08-04T00:39:25.5578714Z`; design SHA-256 `584a39cbcec7d6bf0ad895037efc1aefea4bbdf9507cd96fe1483f34ba163b67`; `findings=[]`; `remainingDesignBlockers=[]`; `RULE_DESIGN_PASS`.
- slice coverage: `SKELETON`; role coverage: unchanged; PR acceptance: `UNACCEPTED`.
- The authorization shorthand `CANDIDATE_1712_V1` was resolved by the controller as a report label. The reviewed frozen executable token is exclusively `CANDIDATE_1712_D1_V1`; no alias or fallback was added.

## Dual baseline result

| Field | `ACCEPTED_1572_V1` | `CANDIDATE_1712_D1_V1` |
|---|---:|---:|
| acceptance status | `ACCEPTED` | `UNACCEPTED_CANDIDATE` |
| semantic identities | `1572` | `1712` |
| LF-sensitive identities | `12` | `12` |
| inventory SHA-256 | `58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8` | `540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2` |
| physical test files | `31` | `36` |
| physical file-set SHA-256 | `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab` | `c8c0a52de9f52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0` |
| serialized bytes | `391257` | `425559` |
| serialized SHA-256 | `d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129` | `576a39e85d372b383aa5e24ebe70c3fdbfaa516a0927c07d161b620e7ec29dc9` |

Two separately created real Vitest instances produced byte-identical candidate artifacts. The candidate remains unaccepted; no command auto-promotes it or rewrites accepted constants.

## Closed migration result

- schema: `vitest-ownership-baseline-migration-report-v1`.
- verdict: `OWNERSHIP_BASELINE_MIGRATION_PASS`.
- accepted/candidate/intersection/union: `1572/1712/1572/1712`.
- added/removed: `140/0`.
- duplicate/borrowed/missing/wrong-owner: `0/0/0/0`.
- increment file-set SHA-256: `ddfa7a0070c6c4d08a6665a9b138f5aaae71cef02a82a5ce5190f9ccabc7a032`.
- increment identity bindings: `140`; every binding contains the canonical `(project,file,ancestorPath,title)` tuple plus exact `file`, `range`, logical `owner`, and provenance `reason`.
- accepted contract registry order: `2B20A,2B19A3B2,2B19B,2B19A3B1,2B19A3A`.
- accepted baseline export order: `2B19A3A,2B19A3B1,2B19A3B2,2B19B`.

| File | Count | Range | Logical owner | Reason |
|---|---:|---|---|---|
| `packages/domain-core/src/canonical-runtime-value.test.ts` | `52` | `1-52` | `domain-core-rest` | `2B20B-P2F1R-A` canonical runtime capture authority |
| `packages/domain-core/src/canonical-runtime-hash.test.ts` | `14` | `1-14` | `domain-core-rest` | `2B20B-P2F1R-B` deterministic integrity hash authority |
| `packages/domain-core/src/domain-event-structural-schema-ast.test.ts` | `25` | `1-25` | `domain-core-rest` | `2B20B-P2F1R-C1` structural schema AST authority |
| `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts` | `21` | `1-21` | `domain-core-rest` | `2B20B-P2F1R-C1` structural schema catalog authority |
| `packages/domain-core/src/domain-event-structural-validator.test.ts` | `28` | `1-28` | `domain-core-rest` | `2B20B-P2F1R-C` structural validation authority |

The executable report retains all 140 identity-level bindings; they are not duplicated into this document because the design forbids generated identity inventories in documentation.

## Validation record

| Gate | Result |
|---|---|
| ownership verifier | `PASS / OWNERSHIP_CONTRACT_SELF_TEST_PASS / 42 of 42` |
| accepted emit and verify | `PASS / exact frozen accepted artifact` |
| candidate emit A/B and verify | `PASS / byte-identical / 425559 bytes / 576a39e85d372b383aa5e24ebe70c3fdbfaa516a0927c07d161b620e7ec29dc9` |
| migration audit | `PASS / OWNERSHIP_BASELINE_MIGRATION_PASS` |
| inventory audit | `PASS / 1572 -> 1712 / +140 / -0 / five named files / 140 bindings` |
| traceability audit | `PASS / 5 criteria / 5 unique primaries / 2 resolved supports / duplicate-borrowed-missing 0-0-0` |
| `corepack pnpm typecheck` | `PASS / tsc --noEmit -p tsconfig.json` |
| `corepack pnpm lint` | `PASS / eslint . --max-warnings 0` |
| `git diff --check` | `PASS` |

## Scope and non-authority

- executable changes: only `scripts/vitest-ownership-contracts.mjs` and `scripts/verify-vitest-ownership-contracts.mjs`.
- documentation changes: only these two D1 implementation records.
- production, Vitest tests/titles/identities, A/B/C/C1 behavior, events, semantic validators, replay, workflow, coverage, routing, dependencies, timeouts, BOTC rules, user overrides, and `ROLE_COVERAGE_MATRIX`: unchanged.
- D1 ownership evidence does not prove event semantics, accepted-history provenance, replay correctness, producer authority, projection safety, or role completion.
- full coverage, publication, hosted CI, D2, and D3 were not run or started.
