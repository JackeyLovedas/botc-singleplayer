# Phase 3 Slice 2B20AP2 Hosted CI Failure Audit

## Audit boundary

- exact infrastructure HEAD:
  `03a4184282cde5f972a9ccab94f36e3a2aa79ed5`
- push run: `30247984028`, attempt `1`, result `FAILURE`
- pull-request run: `30248052689`, attempt `1`, result `FAILURE`
- accepted main:
  `5a69c90f2d3947556ff45c15c467902b1e28ca43`
- accepted application-test blob:
  `0ff733004899f17ff82b20b40b0f41b888ba85d0`
- old coverage profile:
  `phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2`
- audit date: `2026-07-27`

Both runs are immutable failure evidence and `MUST_NOT_RERUN`. Values shortened
with `...` below are the available evidence strings supplied by the run audit,
not guessed full digests. Their exact full value is therefore
`EVIDENCE_INCOMPLETE`.

## Run and artifact inventory

| Surface | Push | Pull request | Evidence completeness |
|---|---|---|---|
| Validate job | `89919235166` | `89919463406` | complete for classification and checkout depth |
| Linux ordinary Dreamer/Vortox job | `89919235251` | `89919463591` | partial; upload skipped after exit `1` |
| Linux coverage core job/artifact | `89919235286` / `8645802456` | `89919463483` / `8645844744` | complete for uploaded core blobs; digest strings abbreviated |
| Coverage merge job | `89919573250` | not separately supplied | complete through final profile comparison except merged coverage SHA |
| Windows W7 job/artifact | `89919235153` / `8645876170` | `89919463499` / `8645903208` | partial; same-process global-error channel absent |

## H1 — HOSTED_ACCEPTED_HISTORY_UNAVAILABLE_IN_SHALLOW_CHECKOUT

Classification: `CONFIRMED`

- Validate jobs `89919235166` and `89919463406` used checkout
  `fetch-depth: 1`.
- Both reported `SUPERSESSION_ACCEPTED_HEAD_NOT_ANCESTOR`.
- The local complete graph proves accepted commit
  `5a69c90f2d3947556ff45c15c467902b1e28ca43` exists and is an ancestor of
  `03a4184282cde5f972a9ccab94f36e3a2aa79ed5`.
- The false hosted classification is therefore caused by unavailable accepted
  history in the shallow checkout, not a real graph split.
- The accepted application-test blob remains frozen at
  `0ff733004899f17ff82b20b40b0f41b888ba85d0`.
- Coverage merge already uses `fetch-depth: 0` and must not regress.

Required classification boundary:

- unavailable accepted commit object:
  `SUPERSESSION_ACCEPTED_HISTORY_UNAVAILABLE`;
- present commit that is not an ancestor:
  `SUPERSESSION_ACCEPTED_HEAD_NOT_ANCESTOR`;
- accepted blob mismatch:
  `SUPERSESSION_ACCEPTED_BLOB_MISMATCH`.

The verifier must not fetch from the network. Workflow checkouts that execute
supersession history validation must supply the required history.

## H2 — COVERAGE_PROFILE_STALE_AFTER_AUTHORIZED_PRODUCT_SOURCE_CHANGE

Classification: `CONFIRMED`

Coverage merge job `89919573250` passed all eleven blob, merge, inventory, and
semantic-routing gates. Its only terminal mismatch was the old profile
`phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2`.

| Obligation | Old | Actual | Evidence completeness |
|---|---:|---:|---|
| source files | `63`, `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` | unchanged | complete |
| zero-hit statements | `3204`, `d535141a...1644` | `3217`, `851add3e...24fe` | counts complete; full hashes unavailable |
| zero-hit lines | `3204`, `fc2ec99a...691e` | `3217`, `c37a009f...166f` | counts complete; full hashes unavailable |
| zero-hit functions | `23`, `4fdf762b...bec` | `23`, `f4c97e3e...00be` | counts complete; full hashes unavailable |
| zero-hit branch arms | `1795`, `6d8ba5d9...15f5` | `1809`, `51cef7ea...745` | counts complete; full hashes unavailable |

The merged coverage artifact SHA is `EVIDENCE_INCOMPLETE` until exact-source
local coverage is produced. The old profile must remain immutable. No new
profile may be appended until the exact source commit, local eleven-logical-group
coverage, canonical tuple delta, and independent profile review exist.

## H3 — DREAMER_VORTOX_DURATION_SENSITIVE_WORKER_RPC_OR_SHUTDOWN_FAILURE

Classification: `CONFIRMED`

### Linux ordinary

Jobs `89919235251` and `89919463591` announced a blob and then exited `1`.
Upload was success-gated and skipped, so selected/pass/skip/fail counts, global
errors, blob SHA, and the exact failure phase are `EVIDENCE_INCOMPLETE`.
The failures must not be called assertion failures.

The accepted logical segmentation is:

- legacy `14`;
- 2B20A `22`;
- gained `10`;
- union `46`;
- pairwise intersection `0`.

This changes the physical ordinary blob count from `9` to `11` while logical
ordinary routing remains `9`.

### Linux coverage core

| Field | Push | Pull request |
|---|---|---|
| job | `89919235286` | `89919463483` |
| artifact | `8645802456` | `8645844744` |
| artifact digest | `1744d168...77961` | `fc82dcc2...8e15` |
| blob SHA | `d3d9bbe3...95b9` | `16afdd08...e774` |
| coverage JSON SHA | `2f833b4f...e90f` | `2f833b4f...e90f` |
| selected / pass / filtered / fail | `36 / 36 / 10 / 0` | `36 / 36 / 10 / 0` |
| global errors | `0` | `1` |
| global error | none | `[vitest-worker]: Timeout calling "onTaskUpdate"` |
| wall time | `52035.305322ms` | `75920.373349ms` |
| file time | `50422.930158ms` | `73856.186833ms` |
| process outcome | success | failure |

Digest and blob strings are abbreviated, so their exact full values remain
`EVIDENCE_INCOMPLETE`; counts, error text, timing, and process outcomes are
complete.

Coverage core must segment as `14+22=36`; gained stays `10`. Logical coverage
remains `11`, while physical coverage blobs may increase to `12`. There is no
authorization to increase a timeout.

## H4 — WINDOWS_W7_NONZERO_EXIT_WITHOUT_SAME_PROCESS_GLOBAL_ERROR_CHANNEL

Classification: `CONFIRMED`

| Field | Push | Pull request |
|---|---|---|
| job / artifact | `89919235153` / `8645876170` | `89919463499` / `8645903208` |
| artifact digest | `9f19a689...de94` | `3dd6c6c2...0f7b` |
| W7 report SHA | `cbed8682...a4a` | `3cf79526...5aa` |
| suites / tests | `6/6` / `46/46` | `6/6` / `46/46` |
| JSON success | `true` | `true` |
| process exit | `1` | `1` |
| signal / spawn error | `null` / `null` | `null` / `null` |
| risk-string matches | `0` | `0` |
| global errors | `UNKNOWN` | `UNKNOWN` |
| wall time | `79610ms` | `78379ms` |
| evidence completeness | `PARTIAL` | `PARTIAL` |

The same-process global-error channel was absent. These artifacts prove a real
nonzero process exit after all assertions passed; they do not prove a Linux
worker-RPC cause. Windows inventory was exact:

```text
total=305
W1=9 W2=90 W3=52 W4=73 W5=9 W6=26 W7=46
missing=0 overlap=0 unexpected=0
```

W7 must preserve one logical group while producing same-process evidence for
ordered `14/22/10` subruns. Each real exit remains authoritative.

## Profile expected/actual summary

- expected by the old profile: the old source-head obligation tuples shown in
  H2;
- actual at `03a4184282cde5f972a9ccab94f36e3a2aa79ed5`: unchanged `63` source
  files, changed zero-hit counts and tuple hashes shown in H2;
- exact merged coverage SHA: `EVIDENCE_INCOMPLETE`;
- authorized resolution: append a new profile from an exact 2B20AP2 source
  commit and an independently reviewed canonical delta;
- prohibited resolution: edit/delete the old profile or guess any hash.

## Audit conclusion

```text
H1=CONFIRMED
H2=CONFIRMED
H3=CONFIRMED
H4=CONFIRMED
UNEXPECTED_PRODUCT_OR_AUTHORITY_REGRESSION=false
OLD_RUNS=MUST_NOT_RERUN
```

No evidence identifies a product assertion, ownership contract, traceability,
or routing regression. Missing ordinary blobs, abbreviated digests, absent
Windows same-process global errors, and the missing exact source-coverage SHA
remain explicitly incomplete evidence; they are not converted into PASS.
