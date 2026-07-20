# Command Capture Proxy Rejection V1 Exact Coverage Profile

## Identity

- Profile ID: `foundation-command-capture-proxy-rejection-v1-ea08ddd`
- Source HEAD: `ea08ddd979bc8d3e825efdf5b290bd0c3e85942f`
- Source kind: `TEN_PROCESS_COMMAND_CAPTURE_PROXY_REJECTION_V1`
- Source commit: `fix: reject Proxy values at command capture`
- Profile commit: `456027283f884d634ed3925d610fb0410d0d8e87`
- Foundation state: `FINAL_REVIEW_REPAIR_ROUND_1_FROZEN`
- Profile state: `RECORDED_SELECTOR_ACTIVE`
- Pull request: `#43`, `https://github.com/JackeyLovedas/botc-singleplayer/pull/43`
- Repair base / prior reviewed HEAD: `456027283f884d634ed3925d610fb0410d0d8e87`; this is not the unknown repair commit HEAD
- Prior-reviewed-head CI: push `29733785911` and pull request `29733791099`, both `SUCCESS / 23 of 23`; fresh repair-head CI is required
- Foundation repair: `repairRound=1/2`; `infrastructureRepairRound=1/2`; implementation is unauthorized and frozen for review
- Current blocker: `PENDING_EXACT_HEAD_FINAL_REVIEW`
- Required next action: `PUSH_WAIT_EXACT_HEAD_CI_AND_RUN_FINAL_REVIEW`

The profile remains bound to the source commit, not to its profile commit. It appends one exact approved profile, preserves every older profile, and changed only the workflow's explicit profile selector in the already-existing profile commit. Production, tests, ownership, topology, commands, timeouts, dependencies and thresholds are unchanged from the source HEAD.

## Three effective candidates

Three wholly fresh ten-process candidates ran from the clean exact source HEAD. Each passed all ten shards, ten per-group merges, the global test/coverage merge, inventory/semantic ownership audit and canonical obligation audit.

| Candidate | Group wall total | Manifest SHA-256 | Inventory SHA-256 | Raw coverage SHA-256 | Risk hits |
|---|---:|---|---|---|---:|
| 1 | `180.904s` | `b9066e9d4007c869d88d1a01bc862abbd5b506a01bd6082302aa64f397299712` | `d1741d50d9aa420a43bc12799945b44ce2bb6a5e0a9664c8572050434bcca768` | `f352a5f2544c6fb50828d5b361c468016230454d93e52aea6f567940c078657a` | `0` |
| 2 | `187.246s` | `7ca66c0a0b11ce6ea4e9058be8742adaaa5313d2db4119d4dfb44dfe39d56a41` | `d1741d50d9aa420a43bc12799945b44ce2bb6a5e0a9664c8572050434bcca768` | `0b79833989bc1e70cf0fe53e4f224b445ce6a46750de49f99d50312e813a4aae` | `0` |
| 3 | `177.635s` | `d3cffa46c2d2ed9c24700aafd6061b5bec99bf6ab17980192795c3e0aa9f293d` | `d1741d50d9aa420a43bc12799945b44ce2bb6a5e0a9664c8572050434bcca768` | `f2d62945aff835673900571007613849e4d8d6b1c0c9a03b115b208de1b969e1` | `0` |

The differing raw merged coverage hashes are non-authoritative runner artifacts. Candidate comparisons returned `COVERAGE_SEMANTIC_OBLIGATIONS_EQUAL`; all canonical identities below are identical.

## Canonical profile authority

- Physical test files: `31`
- Workspace executions: `35`
- Semantic tests: `1535`
- Group tests: `207 / 357 / 465 / 90 / 52 / 73 / 26 / 16 / 10 / 239`
- Ordinary execution SHA-256: `f764c30ac1baaaf56aa0c2e7ad8c712ebeac38e65d42fb574146f58eafed3a18`
- Coverage execution SHA-256: `f98832bbc0c7b878c10b5db0dec98fd202b1ad35177a55812dc75c949c1483b3`
- Semantic inventory SHA-256: `c002db40d8d188aed38e37ba2ebad67d7a4821e9cdf0266d680436601f77167f`
- Missing / duplicate / unexpected / wrong-owner: `0 / 0 / 0 / 0`
- Source files: `63`, SHA-256 `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691`
- Zero-hit statements: `3206`, SHA-256 `e92487ebecdb3e1d91878ea849682a399e53bad1be3fe90afd8dbc4e28276307`
- Zero-hit functions: `23`, SHA-256 `4fdf762b692b151aed1686a73441f38a913ed796a6d5193021d127ed6703dbec`
- Zero-hit lines: `3206`, SHA-256 `20b968074484d3f6e6745aa340eef2164141a60056d7b15b53c0bfbf4a187b27`
- Zero-hit branch arms: `1800`, SHA-256 `a85b196fe4da848fd32ac824c09ef6247f0a5a27ddea94abed9b790a0bfaad63`

All three candidates return `COVERAGE_APPROVED_PROFILE_MATCH` for the new exact ID. External stability evidence is `%LOCALAPPDATA%\BOTCRepoVisibility\coverage-experiments\command-capture-proxy-rejection-v1-ea08ddd\three-candidate-stability.md`, SHA-256 `09e629e96f4643e933d0220cef10973e1712e1689df170057fc32f2db77992de`.

## Transparent harness corrections

`coverageHarnessCorrection=2`; Foundation infrastructure repair remains `0/2` because neither correction changed repository, code, tests, configuration, topology or commands.

1. `PRE_CANDIDATE_POWERSHELL_STDERR_CLASSIFICATION_ERROR`: PowerShell upgraded a legal workspace-deprecation stderr warning before Vitest produced a test result or artifact. Effective count stayed `0/3`.
2. `CANDIDATE_MERGE_LOG_COLOCATION_HARNESS_ERROR`: ten shards exited zero, but an empty redirected log was placed inside a merge-input directory and Vitest merge exited one while parsing it. This was not counted. All evidence remains external.

The corrected harness placed logs in sibling `logs/` directories and prevalidated every merge input: each group input contained exactly one expected nonempty blob; the global input contained exactly ten expected nonempty blobs and no log or metadata. Effective candidates reported zero timeout, `onTaskUpdate`, shard/merge exit-one, missing artifact or inventory mismatch.

## Scope and delivery

The registry change is append-only. The workflow diff changes only the exact selector from `phase-3-slice-2b19b-dcfa530-split-coverage-v1` to `foundation-command-capture-proxy-rejection-v1-ea08ddd`. No product/test byte changes exist relative to source HEAD.

The attributed profile commit `456027283f884d634ed3925d610fb0410d0d8e87` already has exact source HEAD `ea08ddd979bc8d3e825efdf5b290bd0c3e85942f` as its parent. The profile's `sourceHead` remains that source HEAD and does not self-reference the profile commit. This docs-only repair does not change the profile tuple, registry record, workflow selector, topology, thresholds, source kind, or any canonical identity.
