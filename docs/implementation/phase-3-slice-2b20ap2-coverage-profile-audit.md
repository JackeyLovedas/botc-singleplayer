# Phase 3 Slice 2B20AP2 Coverage Profile Audit

## Disposition

- Slice: `2B20AP2`.
- Task type: `CI_TEST_INFRASTRUCTURE / NON_PRODUCT`.
- Source HEAD:
  `cc82a95a258ad943e1d1a28b9c44ea51fe45bfa1`.
- Old profile:
  `phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2`.
- New profile:
  `phase-3-slice-2b20ap2-cc82a95-hosted-execution-v1`.
- Profile source kind: `EXACT_SOURCE_SEGMENTED_COVERAGE_AUTHORITY`.
- CI remediation remains `1/2`; the profile child does not consume another
  remediation round.
- Rule design recovery review: `RULE_DESIGN_PASS`, `remainingBlockers=[]`,
  archived at
  `docs/implementation/phase-3-slice-2b20ap2-rule-design-review-recovery.md`.
- Profile-review status:
  `READY_FOR_INDEPENDENT_COVERAGE_PROFILE_REVIEW`.

No raw unsegmented `pnpm test:coverage` command was run for this profile. The
authority is one complete exact-source segmented execution.

## Evidence roots

The generated evidence is preserved outside the repository at:

```text
C:\Users\wjl\AppData\Local\Temp\botc-2b20ap2-profile-child-cc82a95\.vitest-coverage
```

The complete raw old/new tuple delta is:

```text
coverage-profile-audit/full-tuple-delta.json
bytes=687120
sha256=4f45f1b09311f8994c2fb0fff336303e2ef2e742233b96a400070a47f855338a
```

That closed-schema artifact contains every added tuple, every removed tuple,
the complete direct-positive-hit records, all authorized coordinate-change
records, source-blob/commit provenance, and the positive-coverage loss audit.
The lists below are counts and dispositions; they do not replace the complete
arrays in that artifact.

The old profile coverage authority copied into the same evidence root is:

```text
coverage-profile-audit/old-profile-coverage-final.json
bytes=4557509
sha256=ce042c350ee27c283dbf82e2c62e6fad961d5e3dafbe835fd02fb089a7bf2887
```

## Complete old/new obligation tuple

| Obligation | Old count | Old SHA-256 | New count | New SHA-256 |
|---|---:|---|---:|---|
| `sourceFiles` | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| `zeroHitStatements` | 3204 | `d535141afb3c60331af1ca6dcd7cab6dff5df2e2f8db75e943a72ab1963d1644` | 3217 | `851add3e897ea59b8b1d86fbde3c52b792d466902f3705958d97dfba174224fe` |
| `zeroHitFunctions` | 23 | `4fdf762b692b151aed1686a73441f38a913ed796a6d5193021d127ed6703dbec` | 23 | `f4c97e3e3270830939cf6a337358de3dbe4ce0ae354f000d3e6001c7cb7a00be` |
| `zeroHitLines` | 3204 | `fc2ec99a8cbafa2b2a4bb6fef99430a72d83bdf1da74cca00b38000400c5691e` | 3217 | `c37a009f8cbca2bfa30ece8349b5864751e4274b4e4c19ca29bf0ea03acb166f` |
| `zeroHitBranchArms` | 1795 | `6d8ba5d94a86dddf1b045f73e58e4e2c826bcf7c6d004a8ed7fd8d575aa315f5` | 1808 | `12e72ae3e8a02fa18425f14f804c9f630537dff1534e9dcb0168833718622a7d` |

## Complete raw tuple delta disposition

| Obligation | Unchanged | Added | Removed | Removed with same-tuple positive hit | Removed by authorized coordinate change | Unexplained |
|---|---:|---:|---:|---:|---:|---:|
| `sourceFiles` | 63 | 0 | 0 | 0 | 0 | 0 |
| `zeroHitStatements` | 2171 | 1046 | 1033 | 17 | 1016 | 0 |
| `zeroHitFunctions` | 16 | 7 | 7 | 0 | 7 | 0 |
| `zeroHitLines` | 2334 | 883 | 870 | 760 | 110 | 0 |
| `zeroHitBranchArms` | 1221 | 587 | 574 | 2 | 572 | 0 |

The raw canonical identities include source positions. Therefore an authorized
insertion or replacement can remove an old coordinate identity and add its
relocated identity without removing a semantic coverage obligation. The full
delta classifies these separately from a genuine removal. Every stable
same-coordinate removal has positive-hit evidence; every coordinate-invalidated
record names an authorized changed source file and its old/new Git blob.

The only unchanged-source instrumentation identity contraction is recorded
explicitly:

```text
old positive branch:
packages/domain-core/src/seamstress.ts|type:"branch"|branch:825:21-853:2|arm:0|location:825:21-853:2

candidate positive counterpart:
packages/domain-core/src/seamstress.ts|type:"branch"|branch:825:21-839:3|arm:0|location:825:21-839:3

candidate hits=19373
```

It has the same file, branch type, start position, and arm over unchanged source
and remains positively executed. It is a merge/instrumentation identity
contraction, not a new zero-hit obligation or lost hit.

## Added-obligation and source provenance

All added zero-hit tuples belong to source files changed by the already
authorized product history between the old source and this exact source.
No added tuple is unexplained. Provenance commits are:

```text
dbfa424c96a8bcf06a0d2a77205626a532aa2ec8
0ab9cbb1d31f46fb989f049b804638b69ee399ba
79af6c75149b7a6b04b34329f9d2d338e41c19e9
29fefae499fc905995d0b30d3ed7d94fb819e8bf
2e7ecb95e589eceff38484d928017260314bfb36
```

Production source files with changed coordinates are:

```text
packages/application/src/game-application-service.ts
packages/domain-core/src/domain-batch-semantics.ts
packages/domain-core/src/dreamer.ts
packages/domain-core/src/first-night-ability-outcome-ledger.ts
packages/projections/src/index.ts
```

The evidence artifact records each path's old/new Git blob and contributing
commit list. Tests, this infrastructure child, and the profile append introduce
no product source change.

## No lost prior hits

The positive-coverage loss audit records:

```text
stable prior-positive statement tuples becoming zero=0
stable prior-positive function tuples becoming zero=0
stable prior-positive line tuples becoming zero=0
stable prior-positive branch-arm tuples becoming zero=0
unexplained removed prior-positive statements=0
unexplained removed prior-positive functions=0
unexplained removed prior-positive lines=0
unexplained removed prior-positive branch arms=0
instrumentation positive counterpart records=1
```

No source file disappeared, no stable prior hit became zero, and no raw tuple
delta remains unexplained.

## Segmented execution authority

The exact-source execution passed:

```text
physical coverage blobs=12
logical coverage groups=11
semantic identity union=1572
Dreamer/Vortox core=14+22=36
Dreamer/Vortox gained=10
duplicate=0
intersection=0
missing=0
unexpected=0
failure codes=[]
aggregate result=PASS
```

The logical-group counts are:

```text
207 / 363 / 465 / 90 / 52 / 73 / 9 / 26 / 36 / 10 / 241 = 1572
```

The physical/logical split changes no logical group and conceals no assertion,
process-exit, signal, spawn, reporter-global-error, routing, merge, or coverage
failure.

## Primary artifact hashes

| Artifact below the evidence root | Bytes | SHA-256 |
|---|---:|---|
| `segmented-global/global-manifest.json` | 393593 | `02d152e2c223f98c09b57e696b263acd0494a35b5e0a8e71914afbe5529dfca4` |
| `segmented-global/coverage-output/coverage-final.json` | 4647617 | `e97ab10ab7d763aee40f1cba0ff288aca2bcff963d21d4acf6b14780004dfe2b` |
| `segmented-global/coverage-output/coverage-normalized-tuples.json` | 669415 | `5e6d1e333f99f77fb5d4b8c71adc2d00146f0d1f52c72b933a36f3a807448f82` |
| `segmented-global/merged-test-diagnostic.json` | 604287 | `3c4d797685f6dc922ab9121d19b0fe2293253239566a20f93615c915270c6a90` |
| `coverage-profile-audit/full-tuple-delta.json` | 687120 | `4f45f1b09311f8994c2fb0fff336303e2ef2e742233b96a400070a47f855338a` |

## Logical manifest and physical blob hashes

| Logical group / physical blob | Logical manifest SHA-256 | Physical blob SHA-256 |
|---|---|---|
| `application` / `application--full` | `afddef27d5c70e5f64ac7a762d4c876fbc6b5f9972229e03e185f09d41765d50` | `37d855f903b996514f56c6e413a58382791e70f72158cc16a9eac1246bd70806` |
| `application-service-compatibility-and-failure-boundaries` / `--full` | `83c157c2443e30adbdf5990128c2a934dece9c317b52afcf57be383d3eca37a6` | `c3378d8bc5b8a899154e55807d0cb401e7b4f80734c242ef9bb0c574788aaccf` |
| `application-service-core` / `--full` | `4faf22b63c41b578aa401facb09a523af2395ff6baece94ab0402f2aa48e3263` | `1d3150afcc18b08300dc457fae330b8d350815ba89706db14e6b8c72b1af1609` |
| `application-service-dreamer-vortox-core` / `--legacy` | `8892fc9e6929618558e450c01fa6178f330d0c9ecb21b2d071d41143a8247dc0` | `87cd2a26d32befc87a649eed0a85fb62a781fb29138bbc640b4acf54f8f4ed99` |
| `application-service-dreamer-vortox-core` / `--2b20a` | `8892fc9e6929618558e450c01fa6178f330d0c9ecb21b2d071d41143a8247dc0` | `b1fc1bded747469354ab6cf256dced98a590d5525b930b81d38b8ef73e6d627e` |
| `application-service-dreamer-vortox-gained` / `--full` | `0d5e102a307b6277494fb3de1c9d15e6365631d02c23b704dffaab45186742a6` | `2e829014f1c7ea9cc0baba726021b02aefbb34de56fc92c641ac008fa5cceb95` |
| `application-service-information-and-later-actions-a3b2` / `--full` | `42453200ff9bdfb878f31ed821a9743ba274017aac5d2651c9525778e73ee181` | `348233e4c3657a7f7010292b2e89a72136ba8e6be0924ace9e58ddafb9e3f277` |
| `application-service-information-and-later-actions-base` / `--full` | `9f7e0d4d27223da5ceabca201575097b4e1632678f91792cadb86b85dd033ad8` | `71ecb3cfdefaa375fb7e88c2d69a269d45cdd6be91115ff7b038e89ab88d3915` |
| `application-service-role-actions` / `--full` | `3b6f1b27881d1eae59369077de6f08175e0f526a656e3d3a3c21da5472090e29` | `25d729054245c52539cfaa2bf74e40a66a65704ccecf25b486cf3435fa09523a` |
| `domain-core-rebuild` / `--full` | `1c9f639ccc34759a9a0d2185074da6d5d1bc3a7c32930385f3fe101b42985b5c` | `76729961b07b6ed34ddc6af51e6179d589a5c1719b5145924d1a1a552f0bea36` |
| `domain-core-rest` / `--full` | `c7d10b81c4b01956be36dc90026fda90fc184abd60628080f3b5b996773811e4` | `10b0b2daf4c95426becf91be01c1901ec0bf53bd5a22192edba8d62743328656` |
| `engines-and-projections` / `--full` | `52b93f9c9b2ef779d8ff261a177bdf8d89d50beecbf6a092020a8d16f5f7d635` | `2456d768b8e81d9f10801f831aac3099b6ea8583585b8e837d85ca1b67f1c0e3` |

## Append-only profile proof

The Git-canonical LF bytes of the complete old profile record, excluding only
its array separator, are identical before and after the append:

```text
bytes=3648
beforeSha256=76b668f49635373bff2df22adc7d2638720ff6620f00b378f6e59eade8d9c76e
afterSha256=76b668f49635373bff2df22adc7d2638720ff6620f00b378f6e59eade8d9c76e
equal=true
```

The old ID, source HEAD, source kind, topology, all tuple counts, all tuple
hashes, and hosted evidence metadata are unchanged. The workflow selector alone
moves from the old profile ID to the appended exact-source profile ID.

## Scope and role-coverage audit

This child changes only the authorized workflow selector, append-only verifier
registry, profile/review/status documentation, and four control records. It
changes no product source/test, assertion/title/marker, rule evidence, role
matrix, coverage include, timeout, dependency, lockfile, Vitest project,
logical group, accepted authority, or old profile. Dreamer, Philosopher, and
Mathematician remain `PARTIAL`; Vortox remains `NOT_STARTED`.
