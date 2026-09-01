# Phase 3 Slice 3 Coverage Profile Forward Migration

This document records the bounded forward migration of the active coverage
profile for the frozen Slice 3 product head. It is evidence for profile
selection only; it does not change product, test, rule, ownership, routing, or
workflow topology behavior.

## Binding

- `sourceHead`: `c5c8f6fabe863f9ec45536305d87c1d5ad2e209b`
- `previousProfile`: `phase-3-slice-2c-closure-52c4e97-coverage-v1` (historical,
  immutable source `52c4e975ea0b3e38890318ed253718f552d77427`)
- `profileId`: `phase-3-slice-3-c5c8f6f-coverage-v1`
- `profileArtifact`: `docs/implementation/coverage-profiles/phase-3-slice-3-c5c8f6f-coverage-v1.json`
- `profileSha256`: `0fcecef418cb0878eb12d63b055fc26ab3bbb67bf8e39da92df30788eb7efc26`

## Fresh segmented capture

All eleven logical coverage groups and twelve physical blobs completed with
`PASS`; aggregate verification returned `PASS`. The capture selected 1,733
canonical identities and 72 source files. Canonical full inventory SHA-256 is
`0f9ad191903de1e5afd572d5a6646f2b2f41a00909cf8d1ca3441d7c1312a3a2`.

The normalized tuple artifact SHA-256 is
`ee9bc892ce6fca1f838d49a06659d66a1fa0ebc25ec4916ee2cbe96db6409034`.
The raw aggregate manifest and coverage-final hashes are retained as
provenance (`5d6d7d859c765bbfff2a92c974fe830ba64fc0f541c2dddb98b1321296b87683`
and `d0c7efaa68d70ae4d766b9d6098da118d36fff60417d64bb37928b80ab6a9dec`);
raw coverage-final bytes are not the semantic authority.

## Profile obligations

| Obligation | Count | SHA-256 |
| --- | ---: | --- |
| source files | 72 | `49747524abf0192dcdc15e16e1dc68e990fde1da519e5bc6e3b62cb3f7ba634a` |
| zero-hit statements | 3802 | `f527f2d363e8bb2fa2bc2fb6e287f9b1df59b26f914ddde3141c4f4bd3dcfda0` |
| zero-hit functions | 27 | `4cd7ccbc65ef670fe0e355ea21673e3c2db35c71014f0f767a29341e59299e48` |
| zero-hit lines | 3802 | `04943aad0a1c4c619de9eb84a43b55c09445f6d892748cf271ab0458ea9c1cff` |
| zero-hit branch arms | 2345 | `f95eb4b40d2efc25eeff9cfd5364a655a570c64daa9802b08ef82086687c2052` |

## Delta and lifecycle

The previous active profile had 1,728 identities. The forward delta is
`+5/-0`; source-file delta is `0/0`. No source or identity was removed, and no
unexplained positive-to-zero regression was observed by the semantic verifier.
The old artifact remains byte-immutable and is now `HISTORICAL`; the new
profile is the sole `ACTIVE` selector. No permanent registry or new selector
framework was introduced.

The profile binding is the only workflow change: the existing coverage merge
step selects this exact profile ID. Matrix shape, commands, runners,
timeouts, retries, and test behavior are unchanged.

## Verification

`node scripts/verify-coverage-obligations.mjs --validate-candidate
.vitest-coverage/segmented-global/coverage-output/coverage-final.json --profile
phase-3-slice-3-c5c8f6f-coverage-v1` returned
`COVERAGE_APPROVED_PROFILE_MATCH`. Temporary segmented output is not part of
the commit.
