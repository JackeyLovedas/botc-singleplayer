# Phase 3 Slice 2B20B-P2F1R-D1.5R P coverage-profile audit

## Scope and lifecycle

- Source HEAD S: `8898f62ceb90433634cf02e83ad5d4ff95db4499`.
- Capture purpose: `D1_5R_PROFILE_MATERIALIZATION_ONLY`.
- Capture attempts: `1`; infrastructure retries: `0`.
- Coverage execution: `11` logical-group runs plus exactly one aggregate, all exit `0`.
- P materializes only the validated standalone artifact, registry transition, exact workflow selector token, and this slice's documentation. E, Hosted CI, push, PR, acceptance, and D2 remain pending or unstarted.

## Exact capture result

```text
semanticIdentities=1712
sourceFiles=69
ordinaryTopology=9_LOGICAL_11_PHYSICAL
coverageTopology=11_LOGICAL_12_PHYSICAL
sourceDelta=PLUS_6_MINUS_0
testDelta=PLUS_140_MINUS_0
sourceClassification=62_UNCHANGED_1_CHANGED_6_ADDED_0_REMOVED
missingSources=0
unexpectedSources=0
removedSources=0
removedTests=0
unexplainedPriorPositiveLoss=0
```

The sole changed existing covered source is `packages/domain-core/src/index.ts`; the six added covered sources are the six D1.5R canonical runtime/schema modules. The classification is based on exact Git blobs at the historical source and S, while the complete four-kind old/source tuple maps establish zero unexplained prior-positive loss on unchanged sources.

## Bound artifacts

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| source global manifest | 427763 | `ca9eeb8d2e7a3b4d50b4856fcc32edcbe528d45d85d40c2678d43e9fae524319` |
| source coverage final | 5432661 | `3369f4163add3194d9369a6ebd26fc8f05412478b1aeaf75bff2c4f2db368e95` |
| normalized tuple sets | 783393 | `8c7bc3f7633053d80e97785147bcf1f70c42cad341b60b2ee51bc41fc0fc2a54` |
| complete tuple census | 23916419 | `79db242f87a5f22ceca3365a75045d977cb9acee9f9616e82723258110979cfb` |
| complete delta record | 32189 | `075458c4beebde6d0137261e52c64f811d6e11e703f02ff007a9ce10c4c12dc4` |
| standalone profile artifact | 3160 | `2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567` |
| profile metadata candidate | 851 | `e3a31e558d90efa99be46730456d551404dde7942dcc62f04b5706c7a1a07b71` |

The four temporary materialization outputs were generated independently into two empty directories from the same single capture. Every corresponding byte sequence and SHA-256 matched. No source fragment or executable output was produced.

## Profile bindings

- Active profile: `phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1`.
- Profile-body SHA-256: `4f047c39739b22ac0b4a04dda8eddc8125d902a8bcd281d448d8f61626986426`.
- Candidate inventory SHA-256: `540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2`.
- Zero-hit obligations: statements `3682`, functions `27`, lines `3682`, branch arms `2102`; their exact set hashes are owned by the standalone artifact.
- Historical profile `phase-3-slice-2b20a-4d576e2-final-restoration-v1` transitions only from `LEGACY_SELECTED` to `HISTORICAL`; its artifact body is unchanged.

## Explicit exclusions

This audit does not claim a P independent review, E evidence commit, Hosted CI, push, PR, acceptance, merge, or D2 result. No additional coverage execution is authorized in P.
