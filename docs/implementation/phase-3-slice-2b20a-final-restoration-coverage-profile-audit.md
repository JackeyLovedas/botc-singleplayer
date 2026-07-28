# Phase 3 Slice 2B20A — Final Restoration Coverage Profile Audit

## Disposition

- Task: conditional coverage-profile child for the accepted-normal-Dreamer
  restoration.
- Exact source HEAD:
  `4d576e205cb20c37ba913b923a1cd39e8d800d18`.
- Exact source parent:
  `ba56c05fe4b3f3e2a6acc1c80a83a2ac5fca5b0a`.
- Branch: `phase-3/reachable-base-dreamer-settleability-closure`.
- Old profile:
  `phase-3-slice-2b20ap2-cc82a95-hosted-execution-v1`.
- New profile:
  `phase-3-slice-2b20a-4d576e2-final-restoration-v1`.
- Profile source kind: `EXACT_SOURCE_SEGMENTED_COVERAGE_AUTHORITY`.
- Status:
  `HUMAN_BLOCKED / PENDING_INDEPENDENT_COVERAGE_PROFILE_REVIEW`.
- Product Repair remains `2/2`; no Product Repair Round 3 exists. The
  user-authorized accepted-behavior restoration override remains active.

This profile is conditional evidence for the already committed one-symbol
restoration. It changes no product source, test, helper, rule, role matrix,
coverage include, timeout, dependency, lockfile, Vitest project, logical group,
ownership identity, routing identity, or old profile text.

## Exact evidence roots

The complete generated authority is preserved outside the repository at:

```text
C:\Users\wjl\AppData\Local\Temp\botc-2b20a-4d576e2-profile-child
```

The closed-schema old/new tuple artifact is:

```text
full-tuple-delta.json
schemaVersion=botc-2b20a-final-restoration-coverage-profile-delta-v1
bytes=41950
sha256=8e6ed9ebe2239b48dafd33e3ce1973054d8a5e6225d8f64c1513f3720090e206
evidenceSufficient=true
```

It contains every added and removed zero-hit tuple, all old positive-hit
records, deterministic source-coordinate relocation, positive instrumentation
counterparts, helper delta, and the positive-to-zero audit. The tables below
summarize that complete artifact; they do not replace its arrays.

The preserved old-profile authority is:

```text
old-profile-coverage-final.json
bytes=4647617
sha256=e97ab10ab7d763aee40f1cba0ff288aca2bcff963d21d4acf6b14780004dfe2b
```

## Complete old/new obligation tuple

| Obligation | Old count | Old SHA-256 | New count | New SHA-256 |
|---|---:|---|---:|---|
| `sourceFiles` | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| `zeroHitStatements` | 3217 | `851add3e897ea59b8b1d86fbde3c52b792d466902f3705958d97dfba174224fe` | 3213 | `b493744842f7a96e4bb82b54584d0db416c87719b6a69fcb39140fe2aeeff81a` |
| `zeroHitFunctions` | 23 | `f4c97e3e3270830939cf6a337358de3dbe4ce0ae354f000d3e6001c7cb7a00be` | 23 | `f4c97e3e3270830939cf6a337358de3dbe4ce0ae354f000d3e6001c7cb7a00be` |
| `zeroHitLines` | 3217 | `c37a009f8cbca2bfa30ece8349b5864751e4274b4e4c19ca29bf0ea03acb166f` | 3213 | `e611244a0d6e1f1720db6b1f83260ae17dd40af34a04b035a9c1116a318d0c86` |
| `zeroHitBranchArms` | 1808 | `12e72ae3e8a02fa18425f14f804c9f630537dff1534e9dcb0168833718622a7d` | 1807 | `6637b557feb45600e3904a16373b00bc65d76500d3e339c594879a745e0d96a3` |

No source file disappeared. The source-file and zero-hit-function sets are
identical.

## Closed-schema zero-hit delta

| Obligation | Unchanged | Added | Removed | Added/removed paths |
|---|---:|---:|---:|---|
| `sourceFiles` | 63 | 0 | 0 | none |
| `zeroHitStatements` | 3127 | 86 | 90 | `packages/domain-core/src/dreamer.ts` only |
| `zeroHitFunctions` | 23 | 0 | 0 | none |
| `zeroHitLines` | 3135 | 78 | 82 | `packages/domain-core/src/dreamer.ts` only |
| `zeroHitBranchArms` | 1744 | 63 | 64 | `packages/domain-core/src/dreamer.ts` only |

The sole production edit replaced the old zero-hit
`CURRENT_DEMON_CATALOG_MISMATCH` fallback at line 1451 with the six-line full
`NORMAL_INFORMATION_SUPPORTED` capability. It both covers the restored healthy
exact-match path and shifts later `dreamer.ts` source coordinates by six lines.
Every added or removed zero-hit tuple is therefore either the restored fallback
or its deterministic instrumentation relocation. No other source path appears
in either delta set.

The bounded helper
`packages/test-harness/src/dreamer-v3-accepted-stream.ts` has exact zero delta in
all five obligation classes:

```text
sourceFiles added=0 removed=0
zeroHitStatements added=0 removed=0
zeroHitFunctions added=0 removed=0
zeroHitLines added=0 removed=0
zeroHitBranchArms added=0 removed=0
```

Its two same-line positive statement identities have changed columns because of
the reviewed line-neutral optional parameterization. Both have direct positive
same-line counterparts; neither creates, removes, or conceals a zero-hit
obligation.

## No lost existing positive tuple

| Tuple class | Old positive | Direct/relocated positive preserved | Positive instrumentation counterparts | Stable positive became zero | Relocated positive became zero | Unmatched old positive | Old zero became positive |
|---|---:|---:|---:|---:|---:|---:|---:|
| statements | 23591 | 23589 | 2 | 0 | 0 | 0 | 3 |
| functions | 1065 | 1065 | 0 | 0 | 0 | 0 | 0 |
| lines | 23591 | 23591 | 0 | 0 | 0 | 0 | 4 |
| branch arms | 9238 | 9237 | 1 | 0 | 0 | 0 | 1 |

The three positive instrumentation counterparts are:

- two reviewed helper statements on the same source lines, each still positive;
- one `dreamer.ts` branch arm split by the restored fallback, with a direct
  positive candidate branch over the same canonical-drunk body.

No stable positive tuple became zero, no relocated positive tuple became zero,
and no prior positive tuple is unexplained. The new profile records the actual
obligations; it does not convert a missed positive path into an approved zero.

## Segmented execution authority

The exact source execution passed:

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

Logical counts:

```text
207 / 363 / 465 / 90 / 52 / 73 / 9 / 26 / 36 / 10 / 241 = 1572
```

Ownership and routing remain `1572 semantic tests / 37 primary authorities /
37 supporting authorities`. Physical and logical identities are unchanged.

| Artifact below the evidence root | Bytes | SHA-256 |
|---|---:|---|
| `.vitest-coverage/segmented-global/global-manifest.json` | 393593 | `1696dd46a40fe776423bb8fe7594d90906cc0376e25fcb587cca149e7259ce57` |
| `.vitest-coverage/segmented-global/coverage-output/coverage-final.json` | 4650921 | `79d0577a13a81ead79c47e55cb6a5010b129fb030e60a11b403438b1dffae22a` |
| `.vitest-coverage/segmented-global/coverage-output/coverage-normalized-tuples.json` | 668845 | `624e27cab000978c3c009fdf5fb613f29a8d7a04d4b40240780bdc0d8bf1967a` |
| `.vitest-coverage/segmented-global/merged-test-diagnostic.json` | 604397 | `3d9fd76a1679e210dbce5ebcc0790b5bb394eb7ad4fa39b1d3eda67787b31d88` |
| `full-tuple-delta.json` | 41950 | `8e6ed9ebe2239b48dafd33e3ce1973054d8a5e6225d8f64c1513f3720090e206` |

## Old profile preservation and exact matches

The Git-canonical LF bytes of the complete old AP2 profile record, excluding
only its array separator, are unchanged:

```text
bytes=2931
beforeSha256=15f755ab1786d5f2ecb73bb3eacd06951470a7e232c3fd35e97b95233516ed1c
afterSha256=15f755ab1786d5f2ecb73bb3eacd06951470a7e232c3fd35e97b95233516ed1c
equal=true
```

The old ID, source HEAD, source kind, topology, all counts, all tuple hashes,
and artifact metadata remain verbatim. The verifier results are:

```text
old authority + old profile=COVERAGE_APPROVED_PROFILE_MATCH
new authority + new profile=COVERAGE_APPROVED_PROFILE_MATCH
```

The workflow changes only its exact profile selector from the old ID to
`phase-3-slice-2b20a-4d576e2-final-restoration-v1`.

## Raw coverage diagnostic

The source commit's raw unsegmented `pnpm test:coverage` command is not
authority and is not represented as passing. All `35` files and `1572`
assertions were green, then one
`[vitest-worker]: Timeout calling "onTaskUpdate"` infrastructure error caused
exit `1`. It was not rerun. The complete segmented execution above is the
profile authority.

## Scope, role coverage, and next gate

This child is restricted to:

- this audit;
- append-only new profile registration;
- the exact workflow selector;
- the four active agent-loop controls.

Product source, tests, helper, old profile, rule evidence, and
`docs/rules/ROLE_COVERAGE_MATRIX.md` remain unchanged. Dreamer remains
`PARTIAL`; incomplete behavior is not promoted.

Sole remaining blocker:

```text
PENDING_INDEPENDENT_COVERAGE_PROFILE_REVIEW
```

Required next action:

```text
RUN_INDEPENDENT_2B20A_FINAL_RESTORATION_COVERAGE_PROFILE_REVIEW
```
