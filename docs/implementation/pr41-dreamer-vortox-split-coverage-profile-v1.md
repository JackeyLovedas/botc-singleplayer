# PR #41 Dreamer-Vortox Split Coverage Exact Profile V1

## Identity

- authorization: `USER_AUTHORIZED_PR41_COMPLETE_PASSING_BLOB_CLASSIFICATION_AND_COVERAGE_SPLIT_ROUND_2`
- infrastructure repair: `2 / 2`
- source HEAD: `dcfa530540a57ce7b03e97958dd7de9926f71bbd`
- profile ID: `phase-3-slice-2b19b-dcfa530-split-coverage-v1`
- source kind: `TEN_PROCESS_COVERAGE_WITH_DREAMER_VORTOX_MARKER_PARTITION`
- supersedes for topology: `phase-3-slice-2b19b-c7313e2-ownership-v2-1`
- supersession reason: `DREAMER_VORTOX_CORE_AND_GAINED_COVERAGE_PROCESS_ISOLATION`
- environment: Node `v24.15.0`, pnpm `11.7.0`, Vitest `3.2.6`, Windows `10.0.26100.0`, `VITEST_MAX_FORKS=1`
- profile status: `EXACT_SPLIT_COVERAGE_PROFILE_FROZEN`

This profile-only child changes one appended immutable profile entry and the explicit workflow selector. It changes no production, tests, fixtures, ownership contract, traceability, rule evidence, role coverage, dependency, timeout, worker, pool, coverage subset, threshold, ordinary topology, coverage topology, verifier behavior, or collector behavior. All older profiles remain byte-identical.

## Frozen topology and inventory

Ordinary execution remains nine groups. Coverage remains the already source-committed ten-group topology:

| Coverage group | Existing project/filter | Passed tests | Exact skipped complement |
|---|---|---:|---:|
| `domain-core-rebuild` | `domain-core-rebuild` | 207 | 0 |
| `domain-core-rest` | `domain-core` | 357 | 0 |
| `application` | `application` | 456 | 0 |
| `application-service-core` | `application-service-core` | 90 | 0 |
| `application-service-role-actions` | `application-service-role-actions` | 52 | 0 |
| `application-service-information-and-later-actions` | same-named project | 73 | 0 |
| `application-service-compatibility-and-failure-boundaries` | same-named project | 20 | 0 |
| `application-service-dreamer-vortox-core` | `application-service-dreamer-vortox`; `\[(?:2B19A3A\|2B19A3B1)-` | 16 | 10 |
| `application-service-dreamer-vortox-gained` | `application-service-dreamer-vortox`; `\[2B19B-` | 10 | 16 |
| `engines-and-projections` | existing seven-project group | 239 | 0 |

The Markdown table escapes the alternation separator only for rendering. The exact runtime core filter is `\[(?:2B19A3A|2B19A3B1)-`.

- physical test files: `31`
- workspace project-file executions: `35`
- semantic tests and coverage passed union: `1,520 / 1,520`
- intersection / missing / duplicate / unexpected / wrong-owner: `0 / 0 / 0 / 0 / 0`
- ordinary project/inventory SHA-256: `684c9186767c10489cf95eb81e8cbb76106f3812f6031a4b20b6043ffa8a150f`
- coverage execution SHA-256: `f01b6bbd30d6baf64d8c39a27e5d21485d562b4f68850d357a6053ddc50b059b`
- semantic inventory SHA-256: `3624db27bb52305f2d8edbf02d76e1688f1ed85bc5dadbe9938da2542393f91c`
- A3A / A3B1 / 2B19B marker counts: `10 / 6 / 10`

Vitest's global filtered-blob JSON collision remains non-authoritative. Each final candidate instead proves exact passed identities and exact skipped complements through all ten single-group reports before the canonical verifier accepts the `1,520`-test union.

## Three wholly fresh final candidates

Every final candidate began and ended at clean exact source HEAD `dcfa530540a57ce7b03e97958dd7de9926f71bbd`. The runner fails if its candidate directory exists. No final candidate reuses a blob from the excluded preflight attempt or another final candidate.

| Candidate | Window (Asia/Shanghai) | Wall seconds | Groups/tests | Risk hits | Raw merged coverage SHA-256 | Inventory audit SHA-256 | Manifest SHA-256 |
|---|---|---:|---|---:|---|---|---|
| `final-candidate-run-1` | `2026-07-20T11:53:16.8115261+08:00` to `2026-07-20T11:57:48.6057311+08:00` | 271.792 | `10 / 10`; `1,520` | 0 | `676592f28a51031cef6de1e1e0f583744d9553f42e225badc519a79d9ca7d141` | `d9e4a3e710d2fa4beba64b9fb218f7bdbf6116f37c5173333f9f3967cbcd3919` | `d7a023034ec013bf8b105c2943cbd9eb21f93dec68b9d823ea1cf28f3018b71c` |
| `final-candidate-run-2` | `2026-07-20T11:58:03.6698009+08:00` to `2026-07-20T12:02:20.3513468+08:00` | 256.679 | `10 / 10`; `1,520` | 0 | `9d3465aae5374234682421f30543312d7fc400e2a6efbcae39bd80ec554df15d` | `d9e4a3e710d2fa4beba64b9fb218f7bdbf6116f37c5173333f9f3967cbcd3919` | `31c05b35174cc398b4a7f0dc16c9e59bafaa43151c2bea25b2cb6f95b996bd6d` |
| `final-candidate-run-3` | `2026-07-20T12:02:31.9246032+08:00` to `2026-07-20T12:06:51.3773635+08:00` | 259.451 | `10 / 10`; `1,520` | 0 | `788f460cf2faad286153f5d99fc55970a30e23c6235bb6c7e3a6c6733b909d8d` | `d9e4a3e710d2fa4beba64b9fb218f7bdbf6116f37c5173333f9f3967cbcd3919` | `acaa77d6ba389f0e55c1f0b83d80002aec5b295636ad0c4d4d2e9c6c1a3fb6a0` |

Each manifest records every group project/filter, wall duration, pass/pending/fail counts, risk hits, blob bytes/SHA-256, and single-report SHA-256. The raw merged coverage hashes vary and are retained as non-authoritative artifact hashes. A diagnostic normalization of full positive hit counts also varies; those hashes are not the user-authorized stability contract and are not stored in the approved profile.

## Frozen authoritative coverage obligations

All three final candidates have the same source set, zero-hit sets, counts, and canonical hashes:

| Obligation | Count | Canonical identity SHA-256 |
|---|---:|---|
| source files | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| zero-hit statements | 3204 | `aa2a04c353a155cf09b64abf887e404e22f639ed9179ca7c3daaf1b18dec3f70` |
| zero-hit functions | 23 | `1bd2399498399a94848b2fc51a717fa9cd89c6429a09d6d97ce87f7f6f274c1e` |
| zero-hit lines | 3204 | `f531da265036cb033c62e09249d6e899993333148b0e4b9bb9487cb447d30a75` |
| zero-hit branch arms | 1799 | `8f9427be3ed6e81b5bf818b648dc61a6601b9b67f936517c2c50fea16a7c02ef` |

The obligation result bytes are identical across all three candidates at SHA-256 `f1cd556998c667d501c8bb3989fee0860a7179d9fecf38fa4d3f39187d009ac4`.

## External evidence

Root: `%LOCALAPPDATA%\BOTCRepoVisibility\coverage-experiments\pr41-split-dreamer-vortox-coverage\profile-dcfa530-split-coverage-v1`

- final runner SHA-256: `6ab5de476f59309f44f18b52890e155bfb477d9967ff7d8471c09ea88fd01ce8`
- excluded preflight status SHA-256: `143e7e6d839769d5f8823871fd791fec01245f3cd48951fb1c904398c3345693`
- three-candidate stability evidence SHA-256: `887065bb6511bc0b32b57b97907c441d1b142c111e18838936d37984204523c8`
- verdict: `THREE_FINAL_CANDIDATE_AUTHORITATIVE_IDENTITIES_MATCH`

## Profile-only stop boundary

The appended registry entry freezes the source HEAD, source kind, ten groups, two exact filters, group counts, skipped complements, inventory hashes, stability-evidence hash, and five coverage-obligation counts/hashes. The workflow changes only the explicit profile selector. No push is authorized in this stage.

Freshness, old-profile retention, negative selector cases, ownership, formal verifier, typecheck, lint, full test, full coverage, and exact scope checks must all pass before the attributed profile-only commit.

## Final local validation

- New exact profile: `3 / 3 COVERAGE_APPROVED_PROFILE_MATCH`.
- Prior exact c7313e2 profile: `COVERAGE_APPROVED_PROFILE_MATCH` against the same unchanged obligations.
- Unknown profile, wrong existing profile, missing automatic selector with multiple matches, and duplicate selector: all exit nonzero fail-closed.
- Ownership contract self-test: `22 / 22 PASS`.
- Canonical ten-group verifier: `1,520 / 1,520`; intersection/missing/duplicate/unexpected/wrong-owner `0`; global JSON remains explicitly non-authoritative.
- `corepack pnpm typecheck`: `PASS` with pnpm `11.7.0`.
- `corepack pnpm lint`: `PASS`.
- `corepack pnpm test`: `35 / 35` files and `1,520 / 1,520` tests, Vitest duration `40.34s`, risk hits `0`.
- `corepack pnpm test:coverage`: `35 / 35` files and `1,520 / 1,520` tests, Vitest duration `58.95s`, aggregate `75.94 / 83.26 / 97.40`, risk hits `0`.
- Remaining local action: exact JSON/YAML/diff/scope audit and one attributed unpushed commit `ci: record exact split Dreamer-Vortox coverage profile`.
