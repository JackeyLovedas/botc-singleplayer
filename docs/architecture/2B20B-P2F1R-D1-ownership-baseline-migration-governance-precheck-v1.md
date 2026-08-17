# Phase 3 Slice 2B20B-P2F1R-D1 Ownership Baseline Migration Governance Precheck V1

## Governance identity

- `sliceId`: `2B20B-P2F1R-D1`
- `sliceName`: `Ownership Baseline Migration`
- `currentHead`: `3d03590b7945290bf8aff9efc0156c71b2267847`
- `branch`: `phase-3/2b20b-p2f1r-d1-ownership-baseline-migration`
- `parentSlice`: `2B20B-P2F1R-D`
- `parentDStatus`: `FROZEN_UNACCEPTED_HUMAN_BLOCKED`
- `resliceKind`: `NEW_BOUNDED_RESLICE`
- `consumesParentDRepairRound`: `false`
- `createsDDesignCorrectionRound3`: `false`
- `DDesignCorrectionRound3Authorized`: `false`
- `implementationAuthorized`: `false`

D1 is a new, bounded reslice for ownership-baseline migration only. It does not
repair, revive, accept, or continue the frozen parent D design. It consumes no
parent D implementation-repair budget and creates no third D design correction.

## Historical accepted baseline

The accepted ownership candidate remains the exact historical `1572` baseline:

| Identity | Frozen accepted value |
|---|---|
| Semantic identities | `1572` |
| LF-sensitive identities | `12` |
| Canonical inventory SHA-256 | `58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8` |
| Candidate bytes | `391257` |
| Candidate SHA-256 | `d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129` |
| Physical test files | `31` |
| Physical file-set SHA-256 | `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab` |

This accepted baseline is immutable. D1 may not refresh, overwrite, reorder, or
reinterpret it from current repository state.

## Current unaccepted candidate

The current repository candidate is:

| Identity | Frozen observed candidate value |
|---|---|
| Semantic identities | `1712` |
| Canonical inventory SHA-256 | `540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2` |
| Physical test files | `36` |
| Physical file-set SHA-256 | `c8c0a52de9f52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0` |
| Accepted/candidate intersection | `1572` |
| Accepted/candidate union | `1712` |
| Added identities | `140` |
| Removed identities | `0` |
| Duplicate identities | `0` |
| Borrowed identities | `0` |
| Missing identities | `0` |
| Wrong-owner identities | `0` |

The exact five-file increment is:

| File | Candidate identities |
|---|---:|
| `packages/domain-core/src/canonical-runtime-value.test.ts` | 52 |
| `packages/domain-core/src/canonical-runtime-hash.test.ts` | 14 |
| `packages/domain-core/src/domain-event-structural-schema-ast.test.ts` | 25 |
| `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts` | 21 |
| `packages/domain-core/src/domain-event-structural-validator.test.ts` | 28 |
| Total | 140 |

- `incrementFileSetSHA256`:
  `ddfa7a0070c6c4d08a6665a9b138f5aaae71cef02a82a5ce5190f9ccabc7a032`

The `1712` inventory is an unaccepted candidate. These values are governance
inputs only and must be independently re-materialized and verified by the later
D1 implementation. They do not impersonate an accepted main baseline.

## Immutable accepted contracts

The five existing accepted contracts are frozen:

1. `2B20A`;
2. `2B19A3B2`;
3. `2B19B`;
4. `2B19A3B1`;
5. `2B19A3A`.

`ACCEPTED_CONTRACT_BASELINES` and every value, contract order, marker, owner,
project, hash, count, and accepted identity within those five contracts are
immutable. D1 must not rewrite, refresh, reorder, replace, or learn them from
the unaccepted candidate.

## Versioned dual-baseline design obligation

D1 must use two explicitly versioned authorities:

- `ACCEPTED_1572_V1`: immutable accepted authority;
- `CANDIDATE_1712_D1_V1`: unaccepted candidate requiring fresh D1
  materialization, exact delta proof, independent review, and later acceptance.

The candidate may become accepted only through the complete D1 gates. Until
then, callers and reports must preserve the accepted/candidate distinction and
must never silently substitute `1712` for `1572`.

## Bounded scope and exact allowlist

Future D1 implementation may modify only:

- `scripts/vitest-ownership-contracts.mjs`;
- `scripts/verify-vitest-ownership-contracts.mjs`;
- documentation paths explicitly belonging to `2B20B-P2F1R-D1`.

Every other surface has a zero-file budget:

- production: `0`;
- tests and test identities: `0`;
- workflow and hosted CI: `0`;
- coverage profiles or execution: `0`;
- routing groups, filters, or semantics: `0`;
- dependencies and lockfile: `0`;
- runtime, provider, and timeout policy: `0`;
- rule semantics or rule-source files: `0`;
- role-coverage matrix/status: `0`.

D1 documentation cannot host executable logic or evade the two-script limit.
`D-C01` and `D-C03` belong to frozen parent D and are not D1 criteria,
primaries, supporting authorities, or completion claims.

## Stop conditions

Stop D1 if any of the following occurs:

1. the accepted 1572 baseline or any accepted contract must change;
2. the candidate cannot be independently reproduced with exact hashes and delta;
3. candidate 1712 must be represented as already accepted;
4. any production, test, workflow, coverage, routing, dependency, timeout, rule, or role-matrix change is required;
5. any file outside the two scripts and D1 documentation is required;
6. a new test identity, project, group, filter, marker, or owner is required;
7. D1 must consume a parent D repair round or create D Design Correction Round 3;
8. D-C01 or D-C03 would be transferred into D1;
9. rule truth, accepted behavior, replay, privacy, or trusted-history meaning would change;
10. mandatory D1 rule evidence, bounded design, or independent `RULE_DESIGN_PASS` is absent.

## Governance decision

- `precheckVerdict`: `GO`
- `reentryScope`: `D1_RULE_EVIDENCE_THEN_BOUNDED_DESIGN_ONLY`
- `implementationAuthorized`: `false`
- `requiredNextAction`: `MATERIALIZE_D1_RULE_EVIDENCE_THEN_RUN_D1_DESIGN_GATES`
- `nextSliceAuthorized`: `false`

This GO authorizes only D1 rule-evidence materialization and a separately
controlled bounded design. It is not a design pass or implementation authority.

READY_FOR_RULE_EVIDENCE_AND_D1_DESIGN
