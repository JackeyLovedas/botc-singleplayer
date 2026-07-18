# Vitest Multi-Slice Test Ownership Contract Registry V1

## Scope

This infrastructure slice removes the single-2B19A3A ownership control flow from
`scripts/verify-vitest-coverage-groups.mjs`. It does not change product code,
test files, the Vitest workspace, dependencies, timeout settings, coverage
profiles, BOTC rules, or any 2B19A3B design artifact.

The active registry contains exactly one materialized contract: `2B19A3A`.
There is no planned, empty, or provisional `2B19A3B` contract. A product slice
must register 2B19A3B only after its tests and traceability document exist and
their exact frozen values are known through the approved product workflow.

## Root Cause

The accepted verifier embedded the 2B19A3A marker, owner project, traceability
file, criterion set, supporting-authority expression, and frozen hashes in one
slice-specific function. A later slice marker could therefore enter the
2B19A3A non-owned inventory before that slice had a contract, making the shared
verifier unsuitable as a prerequisite for independently owned future slices.

## Ownership Contract Registry

`scripts/vitest-ownership-contracts.mjs` owns registry validation and generic
per-contract auditing. `scripts/verify-vitest-coverage-groups.mjs` continues to
own Vitest discovery, group-union verification, and merged-report verification,
then delegates ownership and traceability checks to the registry module.

Active contracts are sorted by explicit JavaScript code-unit `<` and `>`
comparison of `contractId`. The module does not use locale-sensitive ordering,
randomness, wall-clock values, UUIDs, `Array.every` as a dense-array check, or
`JSON.stringify` as object-semantic comparison.

## Exact Registry Schema

Each contract is a closed plain record with exactly these fields:

- `contractId`
- `markerPrefix`
- `markerPattern`
- `applicationTestFile`
- `ownerProject`
- `traceabilityFile`
- `criterionIds`
- `supportingAuthorityPrefix`
- `frozenBaseline`
- `status`

Each `frozenBaseline` is a closed plain record with exactly these fields:

- `projectExecutionsBefore`
- `projectExecutionsAfter`
- `projectInventorySha256`
- `currentProjectInventorySha256`
- `semanticInventorySha256`
- `authorityInventorySha256`
- `nonOwnedInventoryPolicy`
- `nonMarkerOwnershipSha256`
- `physicalTestFileSetSha256`
- `traceabilityRowCount`
- `dynamicTestAuthorityRows`
- `supportingAuthorityCount`

The V1 `nonOwnedInventoryPolicy` literal is
`GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS`.
It means that historical slice-like markers already present in the accepted
2B19A3A non-owned inventory are grandfathered only as part of the entire exact
frozen SHA-256 inventory. The registry does not learn or refresh that inventory
from a candidate. An addition, deletion, rename, or other change to the
non-owned application inventory fails first as
`UNREGISTERED_SLICE_OWNERSHIP_MARKER`. A future marker cannot become ordinary
non-owned inventory by omission from the registry.

Validation rejects empty registries, inactive or empty contracts, unknown
fields, accessor properties, symbol keys, sparse arrays, non-plain records,
noncanonical repository paths, non-lowercase SHA-256 values, duplicate
contract IDs, duplicate marker/supporting prefixes, duplicate criteria,
contract-unspecific markers, overlapping prefixes, and unavailable active
traceability files. Validated data is defensively cloned and frozen.

## Per-Contract Audit

For every active contract, the verifier independently checks:

1. exact leading authority-marker classification;
2. one semantic execution in the declared owner project;
3. zero executions in the legacy application-service projects;
4. semantic, authority, project, non-owned, and physical-file frozen hashes;
5. the exact criterion set in that contract's traceability file;
6. nine traceability fields and `MechanismMatch=PASS`;
7. unique resolution of every dynamic `.test.ts` binding;
8. exact supporting-authority registry/reference closure; and
9. stable output ordered by `contractId`.

With one active contract, the top-level verifier deliberately preserves the
accepted single-contract JSON output shape byte-for-byte at the field level.
With multiple contracts, it emits the ordered contract summaries under
`ownership.contracts`.

## A3A Frozen Baseline Preservation

The accepted 2B19A3A values were migrated without relearning or refreshing:

- semantic tests / executions after: `10 / 10`
- project executions before: `34`
- removed duplicate executions: `24`
- owner: `application-service-dreamer-vortox`
- semantic inventory SHA-256:
  `5e544f734381f99f20ac715513b7af7e5a33af6726ca9cad8a0c6d8c1fe7b2cb`
- authority inventory SHA-256:
  `e098696e88ed4f3d050b6d24511b05522aa26afed43d4f8d09d668c81309f676`
- baseline project inventory SHA-256:
  `3829eb2a26e28e22a568d7e393e22c68aedb8979021a3e3b4522b9e53b6d3c8e`
- current project inventory SHA-256:
  `147ad97c8e5169f135fd5eddbfc25dcb4f29adb0c0902023e80b0efcce0c466d`
- non-owned ownership SHA-256:
  `92f7e4197bf07f2186bb98e0ce5627964189ceff6f56e286a5a091166f74852c`
- physical test-file SHA-256:
  `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab`
- traceability: `92 / 92`
- dynamic test-authority rows: `83`
- supporting authorities: `2`

## Synthetic Multi-Contract Self-Test

Run:

```text
node scripts/verify-vitest-ownership-contracts.mjs --self-test
```

The standard-library-only harness uses a temporary directory outside the
repository and performs 17 named checks: one contract; two independent
contracts; marker overlap; duplicate contract ID; duplicate supporting prefix;
frozen legacy marker acceptance plus unknown-marker addition/mutation rejection;
duplicate project execution; wrong owner; missing traceability; missing and
duplicate criteria; missing and unused supporting authorities; non-PASS
mechanism; non-leading authority marker; hostile/noncanonical registry shapes;
and input-order-independent output. Its hostile-shape matrix includes unknown
fields, getters, symbols, sparse arrays, non-plain objects, and revoked proxies,
and asserts getter invocation count remains zero.

The harness creates no repository `.test.ts` file and changes no product test.

## Workflow Integration

The existing `validate` job has one additional lightweight step:

```text
node scripts/verify-vitest-ownership-contracts.mjs --self-test
```

The nine ordinary groups, ordinary merge, nine coverage groups, coverage merge,
Windows deterministic job, Node/pnpm versions, timeouts, and coverage profile
remain unchanged.

## Explicitly Out of Scope

- 2B19A3B Design Round 2 or product implementation
- any production or `.test.ts` change
- a 2B19A3B ownership contract
- traceability content changes
- new or changed Vitest projects/groups
- coverage baseline or profile changes
- dependency, timeout, rule, override, or role-coverage changes

`ruleSemanticsChanged=false`
