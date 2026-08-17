# Phase 3 Slice 2B20B-P2F1R-D1 Repair Round 1 and Asset Lifecycle

## Review authority and bounded repair

- Reviewed implementation HEAD: `8fca3bdb3b94ff1e610cfd20311d178e8500e7a4`.
- Independent reviewer: `/root/d1_implementation_review_fresh`; timestamp `2026-08-04T02:31:36.8470903Z`.
- Initial verdict: `CODE_REVIEW_FIX_REQUIRED`; this document does not replace or upgrade that verdict.
- Repair round: `1/2`; no Round 3; no production, Vitest test/title/identity, workflow, coverage, routing, dependency, rule, role-matrix, D2, or D3 change.
- Closed repair targets: raw accepted registry order; real C01/C05 T1 process primaries; Option-A accepted-loss classification; bounded C04 matrix; atomic no-replace publication.

## Repair result

1. Raw order is authenticated as `2B20A,2B19A3B2,2B19B,2B19A3B1,2B19A3A`; generic registry/audit and identity inventories remain ordinal.
2. C01 and C05 use distinct child-process primaries with real Vitest collection, OS-temp artifacts, read-back, exact exits/stdout/stderr/bytes/SHA, and fail-closed publication assertions.
3. Option A is selected because the frozen design mandates `ACCEPTED_1572_HISTORY_REMOVAL`. Deletion, rename, ancestor/file/project-reowner change, and delete-plus-compensating-add all use that classification; one deletion is proven through the public CLI.
4. C04 is exactly `14/14/14/0/0` planned/executed/rejected/missing/duplicate-mechanism and contains only the authorized ownership cases.
5. Publication is exclusive-temp, complete-write, fsync, close, atomic no-replace link, cleanup. Existing and late targets are never removed, retried, or overwritten.

## Lifecycle questions

Each row answers all six required questions. `D3 cleanup audit` means D3 must re-run G01-G13 and exact scope/hash checks before any authorized deletion; it is not permission to delete now.

| Named asset | Classification | Q1 产品运行时是否依赖 | Q2 日常测试是否依赖 | Q3 后续新增测试是否需要 | Q4 是否仅本次1572→1712迁移需要 | Q5 D3接受后是否可删除 | Q6 删除后的验证方式 |
|---|---|---|---|---|---|---|---|
| accepted 1572 registry support | `RELEASE_ARCHIVE` | No | Yes, while dual-baseline verification exists | No | No; it preserves accepted history | No; retain as release evidence | Re-run accepted emit/verify and require `391257`, `d8ae...`, `58bd...`, `31`, `55783...`, and raw five-contract order |
| candidate 1712 registry support | `PERMANENT_TEST_GUARD` | No | Yes | Yes, as the current full ownership authority | No; it becomes the retained full-inventory guard, not a sixth `PERMANENT_CANDIDATE` status | Not automatically; D3 cleanup audit decides long-term retention | Re-run candidate emit/verify twice and require `1712`, `425559`, `576a...`, `540e...`, `36`, `c8c0...` |
| canonical identity verifier | `PERMANENT_TEST_GUARD` | No | Yes | Yes | No | Not automatically; closest enumerated permanent class, with D3 cleanup audit required | Re-run identity/ordering self-tests, G01/G02, duplicate rejection, and exact inventory hashes |
| migration delta calculator | `DELETE_AFTER_D3_ACCEPTANCE` | No | Yes, only during migration | No | Yes | Yes, only after accepted D3 and explicit cleanup review | Remove only D1 delta entry points, then require canonical verifier, accepted archive read, full candidate verifier, typecheck, lint, and no dangling imports |
| five-file 140 identity census | `RELEASE_ARCHIVE` | No | Yes during migration | No | Yes | No; retain as the accepted migration explanation | Recompute `52/14/25/21/28`, total `140`, file-set `ddfa...`, and compare to archived report |
| atomic publication helper | `PERMANENT_TEST_GUARD` | No | Yes | Yes for future verifier artifacts | No | Not automatically | Re-run absent/present/late-collision/determinism matrix and prove target preservation plus temp cleanup |
| hostile mutation matrix | `PERMANENT_TEST_GUARD` | No | Yes | Yes for regression protection | No | Not automatically | Require `planned=14`, `executed=14`, `rejected=14`, `missing=0`, `duplicateMechanism=0` and public accepted-loss rejection |
| D1 Traceability | `RELEASE_ARCHIVE` | No | No | No | Yes | No; retain with release evidence | Parse all five rows, prove five unique primaries/two supports, exact physical identities, and zero borrowed/duplicate/missing bindings |
| D1 migration report | `RELEASE_ARCHIVE` | No | No | No | Yes | No; retain with release evidence | Verify report SHA/bytes, dual hashes, raw/baseline orders, delta, gate ledger, and independent review linkage |
| CLI persistence evidence fixtures | `TEMPORARY_MIGRATION` | No | No after each gate | No | Yes | Already deleted after each bounded run; nothing waits for D3 | Assert exact OS-temp targets are absent after recording argv/cwd/exit/stdout/stderr/bytes/SHA and no-overwrite results |

## Lifecycle census and stop rule

- `PERMANENT_CORE=0`; `PERMANENT_TEST_GUARD=4`; `TEMPORARY_MIGRATION=1`; `RELEASE_ARCHIVE=4`; `DELETE_AFTER_D3_ACCEPTANCE=1`; total `10`.
- No non-enumerated lifecycle value exists. In particular, `PERMANENT_CANDIDATE` is retention guidance only and is mapped to `PERMANENT_TEST_GUARD`.
- D3 acceptance does not itself delete anything. Deletion requires explicit D3 cleanup authorization, an allowlist, a fresh lifecycle audit, and all named post-deletion verification.
