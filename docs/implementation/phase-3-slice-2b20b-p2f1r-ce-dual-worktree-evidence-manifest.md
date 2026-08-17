# Phase 3 Slice 2B20B-P2F1R-CE Final Dual-Worktree Evidence Manifest

## Non-self-referential binding and disposition

- `CEvidenceClosureRound`: `2/2`
- `manifestStatus`: `DUAL_WORKTREE_EVIDENCE_COMPLETE_PENDING_FRESH_REVIEWS`
- `bindingKind`: `DOCS_ONLY_CHILD_OF_EXECUTED_HEAD`
- `expectedParent`: `cdbca657adf27a9050877cca4bad5d718781cacc`
- `evidenceSourceHead`: `cdbca657adf27a9050877cca4bad5d718781cacc`
- `gatesExecutedAt`: `cdbca657adf27a9050877cca4bad5d718781cacc`
- `manifestChildExecutedGates`: `false`
- `CFinalAccepted`: `false`
- `freshCodeReview`: `PENDING`
- `freshRuleReview`: `PENDING`
- `SupportingAuthorityId`: `NONE`

Every acceptance gate in this manifest ran against the immutable H2 source HEAD
above. The commit containing this manifest is its docs-only child and does not
impersonate the executed tree. This evidence closes the requested local dual-
worktree run only; it does not supply or infer `CODE_REVIEW_PASS`,
`RULE_REVIEW_PASS`, final acceptance, merge readiness, hosted CI, ownership
publication, coverage, or P2F1R-D.

## External evidence source

- Evidence directory:
  `C:\Users\wjl\AppData\Local\Temp\botc-ce-h2-final-evidence-20260803-163718`
- Authoritative summary:
  `C:\Users\wjl\AppData\Local\Temp\botc-ce-h2-final-evidence-20260803-163718\final-evidence-summary.json`
- Default-Windows worktree:
  `C:\Users\wjl\AppData\Local\Temp\botc-ce-h2-final-default2-20260803-163718`
- LF worktree:
  `C:\Users\wjl\AppData\Local\Temp\botc-ce-h2-final-lf-20260803-163718`
- Node: `v24.15.0`
- pnpm: `11.7.0`
- Git: `git version 2.54.0.windows.1`

Only the `default2-*` and `lf-*` logs listed below are formal evidence.

## Worktree and line-ending identities

| Evidence worktree | Before HEAD | After HEAD | Before dirty | After dirty | Catalog EOL | Catalog checkout SHA-256 |
|---|---|---|---:|---:|---|---|
| Default-Windows | `cdbca657adf27a9050877cca4bad5d718781cacc` | `cdbca657adf27a9050877cca4bad5d718781cacc` | 0 | 0 | `i/lf w/crlf` | `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7` |
| LF | `cdbca657adf27a9050877cca4bad5d718781cacc` | `cdbca657adf27a9050877cca4bad5d718781cacc` | 0 | 0 | `i/lf w/lf` | `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` |

- Catalog artifact blob OID in both worktrees:
  `4f9a376e56f19b241d76ce2a75be83b70859ae25`.
- Default-Windows used the global `core.autocrlf=true` configuration and
  therefore checked the indexed LF Catalog artifact out as CRLF.
- The LF worktree was created with command-scoped `core.autocrlf=false` and
  `core.eol=lf`; these were creation-time overrides, not persistent repository
  configuration.
- The currently shared configuration has been restored to the global
  `core.autocrlf=true`. This manifest does not claim that the LF worktree now
  has repository-local `core.autocrlf=false`.
- The differing checkout hashes are exactly the expected CRLF-versus-LF byte
  representation of the same indexed Catalog blob.

## Whitelisted gate results

Both worktrees ran exactly the same eight whitelisted gates. Every gate exited
`0`.

| Gate | Exact accepted result |
|---|---|
| Static verifier self-test | `PASS`; `17/17` mutants rejected; `16` mapped |
| Static real-source audit | `mapped=16`; `missing=0`; `duplicate=0`; `orphan=0`; `invalidSymbol=0`; `invalidPolicy=0`; `invalidReturn=0`; `branchOccurrences=22` |
| Validator focused | `1 file / 28 tests PASS`; carries callable, envelope, diagnostic, and Traceability audits |
| Catalog focused | `1 file / 21 tests PASS` |
| Domain-core | `20 files / 503 tests PASS` |
| Typecheck | `PASS` |
| Lint | `PASS`; zero lint diagnostics |
| Full ordinary | `40 files / 1712 tests PASS` |

### Default-Windows execution record

| Gate | Start | End | Exit |
|---|---|---|---:|
| Static verifier self-test | `2026-08-03T16:39:19.5805809+08:00` | `2026-08-03T16:39:19.9680634+08:00` | 0 |
| Static real-source audit | `2026-08-03T16:39:20.0460617+08:00` | `2026-08-03T16:39:20.2790988+08:00` | 0 |
| Validator focused | `2026-08-03T16:39:20.2857406+08:00` | `2026-08-03T16:39:24.5555363+08:00` | 0 |
| Catalog focused | `2026-08-03T16:39:24.5565376+08:00` | `2026-08-03T16:39:26.6704698+08:00` | 0 |
| Domain-core | `2026-08-03T16:39:26.6714760+08:00` | `2026-08-03T16:39:31.6347810+08:00` | 0 |
| Typecheck | `2026-08-03T16:39:31.6367789+08:00` | `2026-08-03T16:39:37.6698091+08:00` | 0 |
| Lint | `2026-08-03T16:39:37.6713148+08:00` | `2026-08-03T16:39:51.8026942+08:00` | 0 |
| Full ordinary | `2026-08-03T16:39:51.8036933+08:00` | `2026-08-03T16:40:49.1766736+08:00` | 0 |

### LF execution record

| Gate | Start | End | Exit |
|---|---|---|---:|
| Static verifier self-test | `2026-08-03T16:41:01.4439233+08:00` | `2026-08-03T16:41:01.8559622+08:00` | 0 |
| Static real-source audit | `2026-08-03T16:41:01.9376059+08:00` | `2026-08-03T16:41:02.1686149+08:00` | 0 |
| Validator focused | `2026-08-03T16:41:02.1746371+08:00` | `2026-08-03T16:41:06.3342866+08:00` | 0 |
| Catalog focused | `2026-08-03T16:41:06.3352889+08:00` | `2026-08-03T16:41:08.4916783+08:00` | 0 |
| Domain-core | `2026-08-03T16:41:08.4926691+08:00` | `2026-08-03T16:41:13.3748494+08:00` | 0 |
| Typecheck | `2026-08-03T16:41:13.3758465+08:00` | `2026-08-03T16:41:19.4329851+08:00` | 0 |
| Lint | `2026-08-03T16:41:19.4340090+08:00` | `2026-08-03T16:41:33.2041778+08:00` | 0 |
| Full ordinary | `2026-08-03T16:41:33.2051734+08:00` | `2026-08-03T16:42:31.1218660+08:00` | 0 |

## Complete formal log inventory

| Log | Bytes | SHA-256 |
|---|---:|---|
| `default2-callable-validator-envelope-diagnostic-traceability.log` | 2872 | `e3796ad28fb660b73a36243b6e9dff79d811ccd9778881f1d8ae4e86b96f27f2` |
| `default2-catalog-21-of-21.log` | 2490 | `28bf4117ce4ddb7a6a744a1f3f4d66ede34865cbbcf3ff8307416a42d9bac89f` |
| `default2-domain-core.log` | 9748 | `cdbf7b913c28cdf1d03eedd383d3675f7ecdabf9b91d28c6573dfb49b983fb4e` |
| `default2-full-ordinary.log` | 59846 | `6812c959bfbdd066f7382f7f7b78579ceeb6032896de026f4b8134e15490013a` |
| `default2-install.log` | 1274 | `38185014d812bfaf4dec0c62947e82ce78df1500795f3eba8e83144b6de2516a` |
| `default2-lint.log` | 618 | `e7e878b332376b6cada7fd09451aad5bede2416b4018f4493c7235f1c88e77ad` |
| `default2-static-audit.log` | 6976 | `7e96503f70af1525f498c9237a3d735837997ed5e271159a2daace140ab77285` |
| `default2-static-self.log` | 110 | `250b37c72b0d07fcc4aa128278685bcb5af3edd153ebca121295994072cc0ad8` |
| `default2-typecheck.log` | 634 | `cd17ea7302c8eac825839c4b463dbd900b343b68ed936a5f1060566bf1885fc7` |
| `lf-callable-validator-envelope-diagnostic-traceability.log` | 2860 | `756ba5d3a9cca78a8e20d690a3da4deef551a90b3790131d1e69f4697f30eab6` |
| `lf-catalog-21-of-21.log` | 2480 | `39136080f99ceb7e7b567d0d6a819604b3f86145b10c0fe4562e3448e80c9533` |
| `lf-domain-core.log` | 9736 | `88b59e0d316b2502a73ca429c5b6c0244971c45458d149a0024911f661573154` |
| `lf-full-ordinary.log` | 59652 | `c92ba3f84350c744ad8864b11d5e4302b2b94d0e29a4eb894b145e50da032652` |
| `lf-install.log` | 1274 | `38185014d812bfaf4dec0c62947e82ce78df1500795f3eba8e83144b6de2516a` |
| `lf-lint.log` | 618 | `e7e878b332376b6cada7fd09451aad5bede2416b4018f4493c7235f1c88e77ad` |
| `lf-static-audit.log` | 6976 | `7e96503f70af1525f498c9237a3d735837997ed5e271159a2daace140ab77285` |
| `lf-static-self.log` | 110 | `250b37c72b0d07fcc4aa128278685bcb5af3edd153ebca121295994072cc0ad8` |
| `lf-typecheck.log` | 634 | `cd17ea7302c8eac825839c4b463dbd900b343b68ed936a5f1060566bf1885fc7` |

## Coverage boundary violation and deferred surfaces

`CE_COVERAGE_BOUNDARY_VIOLATION` is preserved as a non-acceptance incident:

- A prior `pnpm test:coverage` process was `SPAWNED_BUT_INTERRUPTED` after
  approximately `4.1` seconds.
- It was `NOT_COMPLETE`, returned `NO_EXIT_CODE`, is `NOT_PASS`, and produced
  no tracked or untracked repository change.
- It is not acceptance evidence and was not rerun during this H2 closure.

The other excluded surfaces remain exact:

- `coverage`: `NOT_RUN_IN_H2_CLOSURE`
- `ownership`: `NOT_RUN`
- `Hosted CI`: `NOT_RUN`
- `P2F1R-D`: `NOT_RUN`

## Frozen scope and current disposition

- The executed source/gate tree is exact H2 HEAD
  `cdbca657adf27a9050877cca4bad5d718781cacc`.
- Both formal evidence worktrees were clean before and after all whitelisted
  gates.
- H2 changed only its previously approved six evidence/test/script paths; it
  changed no production code.
- The C traceability file is frozen at H2 and was not modified by this manifest
  child.
- The two earlier evidence IDs bound to `34c60205...` remain invalid historical
  evidence and are not inherited here.

The final H2 dual-worktree evidence is locally complete. The slice remains
`PENDING_FRESH_CODE_AND_RULE_REVIEWS`, with `CFinalAccepted=false`; no reviewer
verdict is authored, summarized, inferred, or promoted by this manifest.
