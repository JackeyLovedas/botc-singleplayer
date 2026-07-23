# PR #45 A3B2 Hosted Stability Profile V2

## Authority and scope

- PR: [#45](https://github.com/JackeyLovedas/botc-singleplayer/pull/45)
- branch: `infra/pr44-a3b2-evidence-process-isolation-v1`
- exact source HEAD: `6a4705c0a6685c6f954a1b0db9870457122f24f4`
- profile ID: `phase-3-slice-2b19a3b2-6a4705c-hosted-stability-v2`
- source kind: `THREE_ARTIFACT_COMPLETE_GITHUB_HOSTED_EXECUTIONS`
- hosted stability verdict: `PASS`
- profile status: `HOSTED_STABILITY_PROFILE_READY_PENDING_ATTRIBUTED_COMMIT`

This is a profile-only continuation of the exact PR #45 infrastructure source. It appends one immutable approved-profile record and changes the workflow's explicit profile selector. It changes no product code, test, fixture, ownership contract, topology, verifier logic, timeout, dependency, threshold, collector, merge algorithm, or role coverage.

The authoritative stability report is:

`C:\Users\wjl\AppData\Local\BOTCRepoVisibility\github-hosted-evidence\pr45-6a4705c\hosted-stability-H2-H3-H4.json`

Its SHA-256 is `008eb7bc033240bcf25311c717d033344ee9c831582b1a67071e0d873df828de`. The report records derivation from unmodified hosted Vitest `3.2.6` blobs, merged with `istanbul-lib-coverage` `3.2.2`; no test or local candidate was executed to create this profile.

## Three complete hosted executions

| Candidate | GitHub run | Attempt | Event | Candidate started at (UTC) | HEAD | Artifacts |
|---|---:|---:|---|---|---|---:|
| H2 | [30004324413](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/30004324413) | 1 | `pull_request` | `2026-07-23T11:45:19Z` | `6a4705c0a6685c6f954a1b0db9870457122f24f4` | 32 |
| H3 | [30004295030](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/30004295030/attempts/2) | 2 | `push` | `2026-07-23T11:50:30Z` | `6a4705c0a6685c6f954a1b0db9870457122f24f4` | 32 |
| H4 | [30007628335](https://github.com/JackeyLovedas/botc-singleplayer/actions/runs/30007628335) | 1 | `pull_request` | `2026-07-23T12:35:58Z` | `6a4705c0a6685c6f954a1b0db9870457122f24f4` | 32 |

The candidate-start column records each effective attempt's `run_started_at`; in particular, H3's `2026-07-23T11:50:30Z` is attempt 2 start time, while the original run was created at `2026-07-23T11:44:53Z`.

Every candidate records `onlyAllowedProfileFailure=true`: the hosted product/test evidence completed, and the only expected failure was the not-yet-materialized exact profile selector. Each candidate has zero timeout, `onTaskUpdate`, unhandled, coverage intersection, missing, duplicate, unexpected, wrong-owner, Windows missing, Windows duplicate, and Windows unexpected counts.

H1 is excluded. It was push run `30004295030`, attempt `1`; after the full rerun its artifacts were no longer retrievable. Its exact classification is `ARTIFACTS_NO_LONGER_RETRIEVABLE_AFTER_FULL_RERUN / NOT_A_TEST_FAILURE / NOT_INCLUDED_IN_ARTIFACT_HASH_SET`. H1 supplies no artifact hash or candidate authority.

## Artifact catalogs

The following three complete catalogs are the SHA-constrained authority for all 32 artifact IDs, names, sizes, digests, timestamps, workflow-run IDs, and exact source HEAD values for each candidate:

| Candidate | Complete catalog | Catalog SHA-256 | Entries |
|---|---|---|---:|
| H2 | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\github-hosted-evidence\pr45-6a4705c\hosted-H2\_metadata\artifacts.json` | `8a84bfcd69a5fe2ff6a7ac6312a8eca5d8da0c84cb1dc4aef51ae5abc2cbe1ef` | 32 |
| H3 | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\github-hosted-evidence\pr45-6a4705c\hosted-H3\_metadata\artifacts.json` | `782610eb9342caeb9523f36f5cefd9880fd661be7d8e7aa614595a7b3f1dcbf4` | 32 |
| H4 | `C:\Users\wjl\AppData\Local\BOTCRepoVisibility\github-hosted-evidence\pr45-6a4705c\hosted-H4\_metadata\artifacts.json` | `1ff0edaa7d7965695d25c560d52f1c93163e89a1272443aaf98ad3bc809f2dd0` | 32 |

These catalogs are referenced rather than copied into the repository so the complete GitHub artifact IDs and digests remain byte-verifiable against their original frozen JSON.

## PR reopen audit

H4 is an authorized replacement hosted event, not a metadata rewrite. The operation was authorized as `USER_AUTHORIZED_PR45_REOPEN_EVENT_REPLACEMENT_HOSTED_CANDIDATE_H4`.

- close requested: `2026-07-23T12:35:50.0859003Z`
- closed at: `2026-07-23T12:35:52Z`
- reopen requested: `2026-07-23T12:35:53.6251869Z`
- reopened observed: `2026-07-23T12:35:57.5700522Z`
- reopened `updated_at`: `2026-07-23T12:35:56Z`
- close executions / reopen executions: `1 / 1`
- closed and reopened HEAD: `6a4705c0a6685c6f954a1b0db9870457122f24f4`
- reopened base: `c8b89ce42b46d23d33e889e8d8e9fc0315114024`
- reopened body SHA-256: `21c9927b8c4e7e9796cd1bf8023fd716bc29b50831da1bd0aa5e3bad70684c59`
- closed/reopened merged state: `null / null`
- final state: `OPEN`
- metadata unchanged: `true`

## Ordinary, coverage, and Windows authority

All three candidates have:

- ordinary topology: `9` groups, `1,544 / 1,544` tests;
- ordinary group counts: `207 / 357 / 465 / 90 / 52 / 82 / 26 / 26 / 239`;
- coverage topology: `11` groups, `1,544 / 1,544` semantic tests;
- coverage group counts: `207 / 357 / 465 / 90 / 52 / 73 / 9 / 26 / 16 / 10 / 239`;
- physical test files: `31`;
- workspace project-file executions: `35`;
- missing / duplicate / unexpected / wrong-owner: `0 / 0 / 0 / 0`.

The Windows evidence is `285 / 285`, partitioned in stable W1-W7 order:

| Group | Tests | Canonical identity SHA-256 |
|---|---:|---|
| W1 | 9 | `c91e063c342e9272039394edb7428b15498a0139f85579bd10e3922d9907ad20` |
| W2 | 90 | `052ffea1a0d321b2f6bb193b2664f37f0a66eab23740f0edc28b147042f069a9` |
| W3 | 52 | `d3b7008ba572ea93cf2eb38778122d6504827445f292b0abdd2e4363169c4d3a` |
| W4 | 73 | `f2d8b65e8ed5f825cb501646d7b5ee616e368d553b224ce8b80b7f765a70e3a1` |
| W5 | 9 | `9ccef1668e0e179df080223454da6b83e90593279ce972ea604331c33d26ef1f` |
| W6 | 26 | `42c4d840a0971acc37e80b7e6bb7acd067bca78402f195086e479338ad848cb1` |
| W7 | 26 | `278c655e1a580a703db662c86f17a2fdae031b5d9cd8f7d9476d5f882a4370eb` |

The complete Windows inventory SHA-256 is `dd1642c6f9b2c5a1dfb07655005528a21503c23443559b909f12ddb75636a639`; the expected-inventory artifact SHA-256 is `c65f7030a2411d7fdb68b9fa7cda8b11cf7f6e364c11ba62ed44fa95f281bfc6`.

## Canonical identities and coverage obligations

Canonical identities are identical across H2, H3, and H4:

- ordinary execution / ownership inventory SHA-256: `f29bed32c2c644e31aa93666406b0a8e8f7072b13135ada18782a970c069878a`;
- semantic inventory SHA-256: `a56e28357c80e156709c3c1d714040d58c85a61a7c2b6fbc3e6c737738a12cf6`;
- coverage execution SHA-256: `1d6726c01527d43edd6bc9e1473268b55af54756472fb64d713ff3590d61cc3f`.

| Obligation set | Count | SHA-256 |
|---|---:|---|
| source files | 63 | `f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691` |
| zero-hit statements | 3,204 | `d535141afb3c60331af1ca6dcd7cab6dff5df2e2f8db75e943a72ab1963d1644` |
| zero-hit functions | 23 | `4fdf762b692b151aed1686a73441f38a913ed796a6d5193021d127ed6703dbec` |
| zero-hit lines | 3,204 | `fc2ec99a8cbafa2b2a4bb6fef99430a72d83bdf1da74cca00b38000400c5691e` |
| zero-hit branch arms | 1,795 | `6d8ba5d94a86dddf1b045f73e58e4e2c826bcf7c6d004a8ed7fd8d575aa315f5` |

All three pairwise comparisons return `COVERAGE_SEMANTIC_OBLIGATIONS_EQUAL`; each comparison artifact has SHA-256 `4d665e004cb4b664ae78b396b4b9d7a022b3f49d644138a1696ea52750d8b0fd`.

The raw hosted `coverage-final.json` SHA-256 values are `ce042c350ee27c283dbf82e2c62e6fad961d5e3dafbe835fd02fb089a7bf2887`, `ecd462e162b6dfad0c9332f17a85e88b902f2eb56dbc4a3d04190b8b31eba67c`, and `fc4385f485857c1f3e3a8fca205ff4ff6cb506b6b1e1f04d526f2421d1553d04`. Their byte hashes are non-authoritative because positive-hit Istanbul execution counts and serialization may vary. The canonical source and zero-hit obligation sets above are the approved profile authority.

## Profile boundary

All earlier approved profile records remain append-preserved and unchanged. This profile binds only source HEAD `6a4705c0a6685c6f954a1b0db9870457122f24f4`; it does not infer acceptance, review, merge, or CI for the later profile-only commit. The next gate is fresh exact-head CI for that profile-only commit, followed by the repository's independent final-review chain.
