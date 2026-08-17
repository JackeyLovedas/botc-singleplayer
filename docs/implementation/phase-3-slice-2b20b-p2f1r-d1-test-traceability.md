# Phase 3 Slice 2B20B-P2F1R-D1 Test Traceability

## Authority

- Design base: `6a6d8026b1a3e23d7f9ab54a69e2e1a4516472b2`.
- Rule evidence verdict: `RULE_READY`.
- Fresh independent design review: `/root/d1_design_review_round2_fresh`, reviewed exact design HEAD `6a6d8026b1a3e23d7f9ab54a69e2e1a4516472b2` at `2026-08-04T00:39:25.5578714Z`; design SHA-256 `584a39cbcec7d6bf0ad895037efc1aefea4bbdf9507cd96fe1483f34ba163b67`; `findings=[]`; `remainingDesignBlockers=[]`; `RULE_DESIGN_PASS`.
- Physical primary file: `scripts/verify-vitest-ownership-contracts.mjs`.
- These script self-test checks are engineering structural validators, not Vitest product-test identities or BOTC rule authority.

## Implementation-time bindings

### D1-C01

| Field | Binding |
|---|---|
| `CriterionId` | `D1-C01` |
| `RuleClaim` | No BOTC rule claim; immutable accepted engineering history is not refreshed, reinterpreted, or replaced. |
| `CompletionCriterion` | The real explicit-version CLI and persisted-artifact boundary reproduce exact accepted values `1572 / 12 / 58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8 / 391257 / d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129 / 31 / 55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab`, five accepted contracts, and unchanged four-entry baseline order. |
| `RequiredEvidenceMechanism` | Real public CLI, real Vitest collection, accepted projection, exact-shape encoding, atomic OS-temp publication, and byte-for-byte read-back verification. |
| `ExpectedReachability` | `R4 FUTURE_HYPOTHETICAL_STATE` |
| `ExpectedTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `ExpectedPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ExpectedResult` | Exact accepted artifact passes; version, hash, shape, contract, partial-artifact, and candidate-substitution mutations reject. |
| `SupportingAuthorityRequirement` | `PLANNED_SUPPORTING_AUTHORITY_REQUIRED` |
| `ActualTestFile` | `scripts/verify-vitest-ownership-contracts.mjs` |
| `ActualTestTitle` | `38 D1 C01 immutable accepted 1572 history` |
| `ActualPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ActualReachability` | `R4 FUTURE_HYPOTHETICAL_STATE` |
| `ActualTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `SupportingAuthorityId` | `SUP-2B20BP2F1RD1-001` |
| `MechanismMatch` | `PASS` |
| Actual main assertion / entry / fault | Physical primary `scripts/verify-vitest-ownership-contracts.mjs :: 38 D1 C01 immutable accepted 1572 history` spawns the same script as a child process through `runD1Cli -> runCandidateCommand`; exact argv/cwd drive real `createVitest`, collection, no-replace OS-temp publication, persisted read-back, and public verify. Exit/stdout/stderr, `391257` bytes, `d8ae...`, collision preservation, and exact accepted values are asserted. The selector/builder calls are supporting-only. |

### D1-C02

| Field | Binding |
|---|---|
| `CriterionId` | `D1-C02` |
| `RuleClaim` | No BOTC rule claim; the current engineering inventory is freshly authenticated and remains candidate-only. |
| `CompletionCriterion` | Two real collections produce `1712`, inventory `540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2`, `36` files, file-set `c8c0a52de9f52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0`, and `UNACCEPTED_CANDIDATE`, with identical complete bytes. |
| `RequiredEvidenceMechanism` | Exact-shape validation of fresh real Vitest collections and the closed persisted D1 candidate. |
| `ExpectedReachability` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` |
| `ExpectedTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `ExpectedPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ExpectedResult` | Exact candidate passes; stale, partial, malformed, wrong-version, or mutated input rejects. |
| `SupportingAuthorityRequirement` | `NONE` |
| `ActualTestFile` | `scripts/verify-vitest-ownership-contracts.mjs` |
| `ActualTestTitle` | `39 D1 C02 fresh 1712 materialization` |
| `ActualPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ActualReachability` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` |
| `ActualTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `SupportingAuthorityId` | `NONE` |
| `MechanismMatch` | `PASS` |
| Actual main assertion / entry / fault | Two separate real public Vitest lifecycles produce identical candidate bytes; any candidate authority mismatch rejects before publication. |

### D1-C03

| Field | Binding |
|---|---|
| `CriterionId` | `D1-C03` |
| `RuleClaim` | No BOTC rule claim; migration is additive and exact. |
| `CompletionCriterion` | Authenticated sets yield intersection `1572`, union `1712`, added `140`, removed `0`; named file counts are `52/14/25/21/28`; increment hash is `ddfa7a0070c6c4d08a6665a9b138f5aaae71cef02a82a5ce5190f9ccabc7a032`; duplicate/borrowed/missing/wrong-owner are zero. |
| `RequiredEvidenceMechanism` | Direct set-delta and five-file partition validation over canonical version-authenticated tuples. |
| `ExpectedReachability` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` |
| `ExpectedTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `ExpectedPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ExpectedResult` | Exact delta passes; accepted removal is `ACCEPTED_1572_HISTORY_REMOVAL`; every other mismatch rejects closed. |
| `SupportingAuthorityRequirement` | `NONE` |
| `ActualTestFile` | `scripts/verify-vitest-ownership-contracts.mjs` |
| `ActualTestTitle` | `40 D1 C03 exact dual-baseline delta` |
| `ActualPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ActualReachability` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` |
| `ActualTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `SupportingAuthorityId` | `NONE` |
| `MechanismMatch` | `PASS` |
| Actual main assertion / entry / fault | Migration audit authenticates both versions before computing the exact set relation, five partitions, and 140 file/range/owner/reason bindings. |

### D1-C04

| Field | Binding |
|---|---|
| `CriterionId` | `D1-C04` |
| `RuleClaim` | No BOTC rule claim; hostile ownership input never acquires accepted authority. |
| `CompletionCriterion` | The bounded ownership matrix rejects duplicate, borrowed, missing owner, wrong project/file/ancestorPath/title, malformed persisted registry, extra/missing field, non-array inventory, duplicate registry entry, and candidate/accepted SHA mismatch. |
| `RequiredEvidenceMechanism` | Fourteen named, unique mutation mechanisms at the public candidate/report/registry/inventory boundaries; no proxy/getter/fuzz/general-security expansion. Accepted-history loss is a separate Option-A gate. |
| `ExpectedReachability` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` |
| `ExpectedTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `ExpectedPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ExpectedResult` | Every hostile case returns a stable failure class and no pass verdict or artifact. |
| `SupportingAuthorityRequirement` | `NONE` |
| `ActualTestFile` | `scripts/verify-vitest-ownership-contracts.mjs` |
| `ActualTestTitle` | `41 D1 C04 hostile ownership migration rejection` |
| `ActualPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ActualReachability` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` |
| `ActualTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `SupportingAuthorityId` | `NONE` |
| `MechanismMatch` | `PASS` |
| Actual main assertion / entry / fault | Physical primary `scripts/verify-vitest-ownership-contracts.mjs :: 41 D1 C04 hostile ownership migration rejection` executes `planned=14 / executed=14 / rejected=14 / missing=0 / duplicateMechanism=0`. It separately proves deletion, title/ancestor/file/project-reowner alteration, and delete-plus-compensating-add map to `ACCEPTED_1572_HISTORY_REMOVAL`; a real child verify process proves missing accepted identity emits that public code and no success bytes. |

### D1-C05

| Field | Binding |
|---|---|
| `CriterionId` | `D1-C05` |
| `RuleClaim` | No BOTC rule claim; version dispatch and reporting are explicit, closed, deterministic, and externally verifiable. |
| `CompletionCriterion` | Only `ACCEPTED_1572_V1` and `CANDIDATE_1712_D1_V1` dispatch; exact CLI order is mandatory; closed candidate/report bytes repeat under reversed input and separate collection. |
| `RequiredEvidenceMechanism` | Real emit/verify/migration CLI forms, invalid argument matrix, persisted-byte comparison, closed report-key audit, and complete deterministic byte comparison. |
| `ExpectedReachability` | `R4 FUTURE_HYPOTHETICAL_STATE` |
| `ExpectedTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `ExpectedPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ExpectedResult` | Exact versions and report pass; missing, duplicate, reordered, trailing, unknown, implicit, fallback, extra, missing, or nondeterministic input rejects. |
| `SupportingAuthorityRequirement` | `PLANNED_SUPPORTING_AUTHORITY_REQUIRED` |
| `ActualTestFile` | `scripts/verify-vitest-ownership-contracts.mjs` |
| `ActualTestTitle` | `42 D1 C05 explicit version dispatch and deterministic closed report` |
| `ActualPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ActualReachability` | `R4 FUTURE_HYPOTHETICAL_STATE` |
| `ActualTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `SupportingAuthorityId` | `SUP-2B20BP2F1RD1-002` |
| `MechanismMatch` | `PASS` |
| Actual main assertion / entry / fault | The sole physical primary is `scripts/verify-vitest-ownership-contracts.mjs :: 42 D1 C05 explicit version dispatch and deterministic closed report`. Its primary assertions are only the real CLI and persistence boundary: two exact candidate-emit argv vectors, one exact verify vector, two exact migration vectors, exact cwd, exit, no process error, stdout/stderr, persisted candidate/report byte counts and SHA-256 values, reload equality, absent invalid destinations, and present/late destination preservation with temp cleanup. Missing, duplicate, reordered, trailing, malformed, and unknown selector argv each assert their exact stable stderr. Reversed inventory, selector, ordinal comparator, and formatter assertions are supporting-only under `SUP-2B20BP2F1RD1-002`; they are not a second primary. |

## Supporting authorities

| SupportingAuthorityId | Producer | SourceTestOrFixture | AuthorityStatus | UsedByCriteria | MutationDisposition |
|---|---|---|---|---|---|
| `SUP-2B20BP2F1RD1-001` | D1 verifier self-test | Pure selector and accepted-builder assertions inside check 38 | `ACCEPTED` | `D1-C01` | `NONE` |
| `SUP-2B20BP2F1RD1-002` | D1 verifier self-test | Pure exact two-selector dispatch, ordinal-comparator ordering, deterministic `candidateBytes` report formatting, and complete report-byte equality after reversed inventory inside check 42 | `ACCEPTED` | `D1-C05` | `NONE` |

## Census

- criteria: `5`; unique primaries: `5`; missing: `0`; multiple: `0`.
- duplicate primary bindings: `0`; borrowed primary bindings: `0`.
- supporting authorities: `2`; duplicate/unresolved/unused supports: `0/0/0`.
- all five primaries: `STRUCTURAL_VALIDATION`; `R1=[]`; `R2=[]`; `R3=[D1-C02,D1-C03,D1-C04]`; `R4=[D1-C01,D1-C05]`; all trust: `T1`.
- C, C1, CE, D0, parent-D criteria or primaries changed/borrowed: `0`.

## Real primary symbols and process boundary

- C01 symbol chain: `runCompleteSelfTest -> runD1Cli -> child process entry -> parseCandidateArguments -> runCandidateCommand -> executeCandidateLifecycle -> createVitest -> collectSemanticInventory -> validatePersistedCandidate -> publishCandidateNoReplace`.
- C05 primary symbol chain: `runCompleteSelfTest -> runD1Cli -> child process entry -> parseCandidateArguments -> runCandidateCommand -> executeCandidateLifecycle -> createVitest -> collectSemanticInventory -> validatePersistedCandidate/validateMigrationReportBytes`, plus persisted publication/reload. `SUP-2B20BP2F1RD1-002` separately exercises `selectOwnershipBaseline`, `ordinalCompare`, `auditOwnershipBaselineMigration`, and `candidateBytes`; none is reported as primary.
- C01 and C05 each have one distinct physical identity: exact file plus exact check title above. C02/C03/C04 retain their distinct checks 39/40/41; no physical primary is shared.
- Candidate/report identity serialization remains ordinal and deterministic. The separately authenticated raw registry order is historical report data, not an ordering input for canonical identities or inventory hashes.
