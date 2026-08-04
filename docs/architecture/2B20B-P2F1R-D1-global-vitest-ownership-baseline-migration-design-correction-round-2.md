# Phase 3 Slice 2B20B-P2F1R-D1 Global Vitest Ownership Baseline Migration — Design Correction Round 2

## 1. Correction identity

- `sliceId`: `2B20B-P2F1R-D1`
- `sliceName`: `Global Vitest Ownership Baseline Migration`
- `documentKind`: `BOUNDED_DESIGN_CORRECTION_ROUND_2`
- `documentTarget`:
  `docs/architecture/2B20B-P2F1R-D1-global-vitest-ownership-baseline-migration-design-correction-round-2.md`
- `corrects`:
  `docs/architecture/2B20B-P2F1R-D1-global-vitest-ownership-baseline-migration-design-round-1.md`
- `parentDesignSha256`:
  `463f73df6b2aa8f9802632a30155758bd14a70c7b0a246f415c90d451dda171f`
- `designRound`: `2/2`
- `designRoundMaximum`: `2`
- `designRound3Authorized`: `false`
- `designRound3Forbidden`: `true`
- `implementationRepairRound`: `0/2`
- `implementationRepairRound3Authorized`: `false`
- `parentDDesignCorrection`: `false`
- `parentDRepairRoundConsumed`: `false`
- `implementationAuthorized`: `false`
- `requiredDesignReviewVerdict`: `RULE_DESIGN_PASS`

This is D1’s single bounded Design Correction Round 2. It is not a parent-D correction, parent-D revival, parent-D Design Correction Round 3, D1 Design Round 3, implementation repair, implementation authorization, or later-slice authorization.

## 2. Correction boundary

This correction closes exactly two Design Round 1 blockers:

1. freeze every authoritative accepted physical-test-file-set hash as one exact 64-lowercase-hex value and reject any missing or changed nibble;
2. align the unique primaries for `D1-C01` and `D1-C05` with their real external CLI, collected-input, persisted-artifact, and closed-report boundaries.

No other Round 1 contract changes.

The following remain frozen from Design Round 1:

- one primary risk;
- two explicitly versioned baselines;
- accepted and candidate counts;
- accepted and candidate inventories;
- accepted serialized byte authority;
- the five accepted contracts;
- `ACCEPTED_CONTRACT_BASELINES`;
- identity tuple generation;
- ordinal ordering;
- exact delta and five-file partition;
- candidate/report shapes;
- validation and publication order;
- atomic publication and retry behavior;
- hostile-mutation obligations;
- five criteria;
- `R1=[]`;
- `R2=[]`;
- `D1-C02`, `D1-C03`, and `D1-C04`;
- file allowlist;
- zero-file budgets;
- line ceilings;
- tests and acceptance commands;
- CI and review gates;
- documentation and rollback requirements;
- stop conditions;
- no production, test, workflow, coverage, routing, dependency, timeout, rule, or role-matrix change.

Where this correction conflicts with Design Round 1, only the corrected clauses below supersede it. Every other Design Round 1 clause remains binding.

## 3. Corrected accepted physical-file-set authority

The only authoritative accepted physical-test-file-set SHA-256 for D1 is exactly:

```text
55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab
```

Properties of this value:

- lowercase hexadecimal only;
- exactly 64 characters;
- exactly 32 digest bytes;
- no prefix;
- no suffix;
- no whitespace;
- no truncation;
- no abbreviation in an authoritative field.

Every authoritative occurrence in the D1 design, implementation, candidate validation, report validation, traceability, self-test, documentation, and review must use that exact value.

A value with even one missing, added, reordered, uppercased, or changed nibble rejects. Prefix matching, suffix matching, case folding, padding, truncation, normalization, inferred completion, or “close enough” comparison is forbidden.

The validator must require both:

```text
/^[0-9a-f]{64}$/
```

and exact equality to:

```text
55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab
```

A regex match alone is insufficient.

## 4. Complete immutable accepted authority

`ACCEPTED_1572_V1` remains exactly:

| Field | Exact accepted value |
|---|---:|
| Semantic identities | `1572` |
| LF-sensitive identities | `12` |
| Canonical inventory SHA-256 | `58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8` |
| Serialized candidate bytes | `391257` |
| Serialized candidate SHA-256 | `d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129` |
| Physical test files | `31` |
| Physical test-file-set SHA-256 | `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab` |
| Identity encoding | `vitest-semantic-identity-json-tuple-v1` |
| Candidate schema | `vitest-ownership-candidate-baseline-v2` |
| Acceptance status | `ACCEPTED` |

All values other than the corrected exact spelling and validation of the physical-test-file-set hash are unchanged.

The accepted artifact must still reproduce exactly:

```text
1572 identities
12 LF-sensitive identities
58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8
391257 bytes
d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129
31 physical files
55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab
```

A matching identity count, inventory hash, or candidate hash cannot compensate for a malformed or mismatched physical-file-set hash.

## 5. Accepted contract preservation

The five active accepted contracts remain byte-stable and retain their current registry order:

1. `2B20A`
2. `2B19A3B2`
3. `2B19B`
4. `2B19A3B1`
5. `2B19A3A`

Every accepted contract’s authoritative `physicalTestFileSetSha256` must equal exactly:

```text
55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab
```

This correction does not authorize rewriting any contract. It confirms and enforces the exact accepted value. If any current contract contains a different spelling or length, implementation must stop rather than silently refresh or normalize it.

The existing exported `ACCEPTED_CONTRACT_BASELINES` remains unchanged in content and order:

1. `2B19A3A`
2. `2B19A3B1`
3. `2B19A3B2`
4. `2B19B`

`2B20A` remains represented through the existing top-level accepted `frozenBaseline`. It is not inserted into `ACCEPTED_CONTRACT_BASELINES`.

No accepted count, marker, owner, project, criterion, traceability path, supporting-authority prefix, inventory hash, contract order, or other baseline value changes.

## 6. Candidate and delta remain frozen

`CANDIDATE_1712_D1_V1` remains an unaccepted candidate requiring fresh materialization:

| Field | Exact candidate value |
|---|---:|
| Semantic identities | `1712` |
| Canonical inventory SHA-256 | `540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2` |
| Physical test files | `36` |
| Physical file-set SHA-256 | `c8c0a52de9f52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0` |
| Acceptance status | `UNACCEPTED_CANDIDATE` |

The required delta remains:

| Metric | Exact result |
|---|---:|
| Accepted | `1572` |
| Candidate | `1712` |
| Intersection | `1572` |
| Union | `1712` |
| Added | `140` |
| Removed | `0` |
| Duplicate | `0` |
| Borrowed | `0` |
| Missing | `0` |
| Wrong owner | `0` |

The five-file increment remains:

| File | Added identities |
|---|---:|
| `packages/domain-core/src/canonical-runtime-value.test.ts` | `52` |
| `packages/domain-core/src/canonical-runtime-hash.test.ts` | `14` |
| `packages/domain-core/src/domain-event-structural-schema-ast.test.ts` | `25` |
| `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts` | `21` |
| `packages/domain-core/src/domain-event-structural-validator.test.ts` | `28` |

The increment file-set SHA-256 remains exactly:

```text
ddfa7a0070c6c4d08a6665a9b138f5aaae71cef02a82a5ce5190f9ccabc7a032
```

Any accepted removal remains:

```text
HUMAN_BLOCKED / ACCEPTED_1572_HISTORY_REMOVAL
```

## 7. Corrected primary-layer rule

A pure selector, comparator, or formatter test cannot be the primary authority for a criterion whose completion claim depends on:

- the public CLI;
- real Vitest collection;
- external or persisted candidate bytes;
- exact runtime-shape validation;
- version parsing at the external boundary;
- report parsing or validation;
- atomic publication;
- byte-for-byte verification.

For such criteria, the public boundary and its main assertion determine the primary layer.

Accordingly:

- `D1-C01` has exactly one primary:
  `T1 EXTERNAL_OR_PERSISTED_BOUNDARY + STRUCTURAL_VALIDATION`;
- `D1-C05` has exactly one primary:
  `T1 EXTERNAL_OR_PERSISTED_BOUNDARY + STRUCTURAL_VALIDATION`.

Pure selector and deterministic formatter tests remain useful, but they are supporting-only. They cannot replace, duplicate, or be reported as the unique criterion primary.

This correction changes no product behavior and introduces no application-command or accepted-stream claim.

## 8. Corrected reachability inventory

The reachability inventory remains:

- `R1 CURRENTLY_REACHABLE_APPLICATION_PATH`: `[]`
- `R2 LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`: `[]`
- `R3 HOSTILE_OR_CORRUPTED_HISTORY`:
  `[D1-C02, D1-C03, D1-C04]`
- `R4 FUTURE_HYPOTHETICAL_STATE`:
  `[D1-C01, D1-C05]`

`D1-C01` and `D1-C05` retain `R4` because D1 designs future engineering CLI/report behavior not yet present at the reviewed design HEAD. Their T1 classification describes the trust boundary that will exist after implementation; it does not convert them into an R1 game-application path.

Hostile subcases exercised through the future `D1-C01` or `D1-C05` boundary are supporting mutation cases for those criteria. They do not create a second primary, a mixed reachability row, or a new criterion. The criterion’s main completion assertion and unique primary remain the successful or fail-closed structural contract of the future R4 boundary.

## 9. Corrected D1-C01 nine-field traceability

| Field | Corrected frozen value |
|---|---|
| `CriterionId` | `D1-C01` |
| `RuleClaim` | No BOTC rule claim; immutable accepted engineering history must not be reinterpreted, refreshed from current state, or replaced by the candidate. |
| `CompletionCriterion` | Through the real explicit-version CLI and persisted-artifact boundary, `ACCEPTED_1572_V1` materialization and verification reproduce exactly `1572` semantic identities, `12` LF-sensitive identities, inventory SHA-256 `58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8`, `391257` serialized bytes, candidate SHA-256 `d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129`, `31` physical files, physical-test-file-set SHA-256 `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab`, the five unchanged accepted contracts, and unchanged `ACCEPTED_CONTRACT_BASELINES` content/order. A one-nibble hash omission or change rejects. |
| `RequiredEvidenceMechanism` | Invoke the real public verifier CLI with the exact `ACCEPTED_1572_V1` selector, collect through the real public Vitest boundary, materialize the accepted projection, exact-shape validate it, publish it atomically to a permitted OS-temporary artifact, read it back through verify mode, and assert all exact values plus byte-for-byte equality. The primary test must exercise the external/persisted boundary; calling only the pure selector or builder is insufficient. |
| `ExpectedReachability` | `R4 FUTURE_HYPOTHETICAL_STATE` |
| `ExpectedTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `ExpectedPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ExpectedResult` | Exact accepted materialization and persisted verification pass; missing/unknown version, altered shape, altered accepted value, malformed physical-file-set hash, any missing or changed hash nibble, contract mutation, partial artifact, or candidate substitution rejects closed without changing accepted authority. |
| `SupportingAuthorityRequirement` | `PLANNED_SUPPORTING_AUTHORITY_REQUIRED`: pure `selectOwnershipBaseline` and accepted-builder policy tests are supporting-only. At implementation they receive unique `SUP-2B20BP2F1RD1-*` IDs, resolve exactly once, use `AuthorityStatus=ACCEPTED`, `MutationDisposition=NONE`, and list `UsedByCriteria=[D1-C01]`. They may prove selector determinism and policy constants, but cannot be the `D1-C01` primary and cannot borrow, reference as their producer, or impersonate any C, C1, CE, D0, or parent-D primary. |

## 10. Corrected D1-C05 nine-field traceability

| Field | Corrected frozen value |
|---|---|
| `CriterionId` | `D1-C05` |
| `RuleClaim` | No BOTC rule claim; baseline version selection and the migration report must be explicit, closed, deterministic, and externally verifiable. |
| `CompletionCriterion` | Through the real public CLI and candidate/report parsing boundary, only `ACCEPTED_1572_V1` and `CANDIDATE_1712_D1_V1` are accepted selectors; no default, alias, count-derived choice, “latest,” or fallback exists. The migration report uses the exact closed runtime shape and key order frozen in Design Round 1, contains the exact accepted physical-test-file-set SHA-256 `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab`, and repeats byte-identically across reversed input order and separate fresh collection. |
| `RequiredEvidenceMechanism` | Invoke the real public CLI for emit, verify, and migration-report operations; pass valid, missing, duplicated, malformed, reordered, trailing, and unknown selector arguments; validate persisted candidate/report bytes through the exact closed public parsers; compare complete output bytes from independent fresh runs; and assert no output is published on boundary failure. Pure selector or formatter calls may support but cannot replace this boundary mechanism. |
| `ExpectedReachability` | `R4 FUTURE_HYPOTHETICAL_STATE` |
| `ExpectedTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `ExpectedPrimaryLayer` | `STRUCTURAL_VALIDATION` |
| `ExpectedResult` | Both exact selectors dispatch only to their named versions; valid closed reports repeat byte-identically; missing, duplicated, malformed, reordered, trailing, unknown, implicit, or fallback selection rejects; extra/missing report fields, changed key order, nondeterministic values, or any altered authoritative accepted-hash nibble reject without publication. |
| `SupportingAuthorityRequirement` | `PLANNED_SUPPORTING_AUTHORITY_REQUIRED`: pure selector, ordinal-comparator, and deterministic report-formatter tests are supporting-only. At implementation they receive unique `SUP-2B20BP2F1RD1-*` IDs, resolve exactly once, use `AuthorityStatus=ACCEPTED`, `MutationDisposition=NONE`, and list `UsedByCriteria=[D1-C05]`. Hostile CLI/report mutations remain assertions of the T1 structural primary rather than a second pure primary. Supporting records cannot borrow, bind to, replace, or impersonate any C, C1, CE, D0, or parent-D primary. |

## 11. Unchanged D1-C02 through D1-C04

The following Design Round 1 fields remain unchanged in full.

### D1-C02

- `CriterionId`: `D1-C02`
- `RuleClaim`: no BOTC rule claim; the current engineering inventory must be freshly authenticated and remain candidate-only.
- `CompletionCriterion`: a real public Vitest collection materializes exactly `1712`, inventory `540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2`, `36` files, file set `c8c0a52de9f52037eda418323ac57b281ea30633162a22b963d0100cb8ca38f0`, and status `UNACCEPTED_CANDIDATE`, with deterministic repeated bytes.
- `RequiredEvidenceMechanism`: direct exact-shape validation of a fresh real Vitest inventory and the closed D1 candidate artifact; precheck values do not substitute for fresh materialization.
- `ExpectedReachability`: `R3 HOSTILE_OR_CORRUPTED_HISTORY`
- `ExpectedTrust`: `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`
- `ExpectedPrimaryLayer`: `STRUCTURAL_VALIDATION`
- `ExpectedResult`: exact candidate values pass; stale, partial, malformed, wrong-version, or mutated input rejects.
- `SupportingAuthorityRequirement`: `NONE`

### D1-C03

- `CriterionId`: `D1-C03`
- `RuleClaim`: no BOTC rule claim; migration must be additive and exact.
- `CompletionCriterion`: authenticated accepted/candidate sets yield intersection `1572`, union `1712`, added `140`, removed `0`; the five increments are `52/14/25/21/28`; increment-set hash is `ddfa7a0070c6c4d08a6665a9b138f5aaae71cef02a82a5ce5190f9ccabc7a032`; duplicate, borrowed, missing, and wrong-owner are all zero.
- `RequiredEvidenceMechanism`: direct set-delta and file-partition validator over canonical, version-authenticated tuple sets.
- `ExpectedReachability`: `R3 HOSTILE_OR_CORRUPTED_HISTORY`
- `ExpectedTrust`: `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`
- `ExpectedPrimaryLayer`: `STRUCTURAL_VALIDATION`
- `ExpectedResult`: exact delta passes; any removal maps to `HUMAN_BLOCKED`; every other mismatch rejects closed.
- `SupportingAuthorityRequirement`: `NONE`

### D1-C04

- `CriterionId`: `D1-C04`
- `RuleClaim`: no BOTC rule claim; hostile ownership input must never acquire accepted authority.
- `CompletionCriterion`: closed validators reject duplicate, borrowed, missing, wrong-owner, wrong-file, wrong-project, malformed-shape, accessor/proxy, accepted-contract mutation, and report mutation without publication or getter invocation.
- `RequiredEvidenceMechanism`: mutation matrix against public candidate, report, and registry boundaries, including atomic no-publication assertions.
- `ExpectedReachability`: `R3 HOSTILE_OR_CORRUPTED_HISTORY`
- `ExpectedTrust`: `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`
- `ExpectedPrimaryLayer`: `STRUCTURAL_VALIDATION`
- `ExpectedResult`: every hostile case returns the expected stable failure class, leaves no destination or temporary artifact, and emits no pass verdict.
- `SupportingAuthorityRequirement`: `NONE`

## 12. Frozen primary census

D1 retains exactly five criteria and exactly five unique primaries:

| Criterion | Unique primary layer | Reachability | Trust |
|---|---|---|---|
| `D1-C01` | `STRUCTURAL_VALIDATION` | `R4` | `T1` |
| `D1-C02` | `STRUCTURAL_VALIDATION` | `R3` | `T1` |
| `D1-C03` | `STRUCTURAL_VALIDATION` | `R3` | `T1` |
| `D1-C04` | `STRUCTURAL_VALIDATION` | `R3` | `T1` |
| `D1-C05` | `STRUCTURAL_VALIDATION` | `R4` | `T1` |

Exact census:

- criteria: `5`
- unique primaries: `5`
- criteria missing a primary: `0`
- criteria with multiple primaries: `0`
- duplicate primary bindings: `0`
- borrowed primary bindings: `0`
- C/C1/CE/D0/parent-D primaries used by D1: `0`
- D1 primaries used by C/C1/CE/D0/parent D: `0`
- `PURE_POLICY_SEAM` primaries: `0`
- pure-policy supporting bindings: `2`
- `ACCEPTED_STREAM_INTEGRATION` primaries: `0`
- `APPLICATION_COMMAND_INTEGRATION` primaries: `0`
- `LEGACY_REPLAY_COMPATIBILITY` primaries: `0`
- `HOSTILE_REPLAY_REJECTION` primaries: `0`
- `PROJECTION` primaries: `0`
- `CROSS_PLATFORM_CI` primaries: `0`

One physical primary identity may bind only one D1 criterion. If implementation combines two criteria into one physical test identity, splits a criterion across multiple purported primaries, or reports a pure supporting test as primary, `MechanismMatch=FAIL`.

## 13. Supporting-authority rules

The two planned pure-policy supports exist only to assist the corrected T1 structural primaries:

1. accepted-version selector/builder policy support for `D1-C01`;
2. selector/comparator/report-formatter policy support for `D1-C05`.

At implementation:

- each support receives one unique final `SUP-2B20BP2F1RD1-NNN` ID;
- each ID resolves exactly once;
- `Producer` identifies only the D1 script self-test producer;
- `SourceTestOrFixture` identifies the actual supporting check;
- `AuthorityStatus=ACCEPTED`;
- `MutationDisposition=NONE`;
- `UsedByCriteria` contains only its designated D1 criterion;
- the primary row references the final support ID;
- no support is unused;
- no support is shared unless the actual traceability explicitly proves a single support has both bounded purposes without creating a primary collision;
- no support names or borrows a C, C1, CE, D0, or parent-D authority;
- no support substitutes for the real T1 CLI/persisted-artifact/report test.

Hostile selector and formatter mutations may be executed as subcases of the real T1 primary. They do not require a second supporting authority and cannot change the primary layer.

## 14. Test correction

The Design Round 1 self-test groups remain five planned D1 groups, and the complete verifier remains expected to report `42/42`.

The corrected authority mapping is:

- check 38, `D1-C01`: real explicit accepted-version CLI, real collection, atomic persisted accepted artifact, read-back verification, exact 64-nibble physical-file-set hash, and historical byte identity are the primary assertions;
- check 39, `D1-C02`: unchanged T1 structural primary;
- check 40, `D1-C03`: unchanged T1 structural primary;
- check 41, `D1-C04`: unchanged T1 structural primary;
- check 42, `D1-C05`: real CLI argument parsing, persisted candidate/report parsing, exact closed shape, rejection behavior, and repeated complete report bytes are the primary assertions.

Pure selector, builder, comparator, and formatter calls may occur inside checks 38 and 42 only as clearly identified supporting assertions. Traceability must not assign those pure calls a second primary layer.

Check 36 continues to preserve the real accepted `1572 / 12 / 391257 /
d8ae... / 58bd... / 31` authority and must assert the exact physical-test-file-set SHA-256:

```text
55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab
```

Required additional hostile hash cases include:

- remove the first nibble;
- remove the last nibble;
- remove one middle nibble;
- replace one nibble with another valid lowercase hexadecimal nibble;
- append one nibble;
- uppercase one hexadecimal letter;
- provide a 64-character nonmatching hexadecimal value;
- provide the correct value with leading or trailing whitespace.

Every case rejects before success serialization or publication.

## 15. Scope and zero-change freeze

The executable allowlist remains exactly:

1. `scripts/vitest-ownership-contracts.mjs`
2. `scripts/verify-vitest-ownership-contracts.mjs`

Only D1-specific architecture, implementation, traceability, report, and mandatory agent-loop documentation may otherwise change.

Every other surface retains a zero-file budget:

- production/domain/application: `0`
- Vitest test files and identities: `0`
- workflow and hosted CI: `0`
- coverage profiles, selectors, execution, and thresholds: `0`
- routing groups, owners, filters, and segmentation: `0`
- dependencies and lockfiles: `0`
- runtime, provider, install, and timeout policy: `0`
- rules and rule sources: `0`
- role coverage matrix: `0`
- README files: `0`
- event, schema, replay, state, receipt, and projection files: `0`

The Design Round 1 line estimates and hard ceilings remain unchanged. This correction does not increase them.

## 16. Explicit exclusions

The following remain out of scope:

- parent-D implementation or acceptance;
- parent-D Design Correction Round 3;
- D1 Design Round 3;
- `D-C01`;
- `D-C03`;
- C/CE ownership publication;
- hosted evidence;
- Windows domain-core execution;
- ordinary or coverage routing changes;
- coverage profile creation or selection;
- production or test changes;
- rule or accepted-behavior changes;
- role coverage changes;
- event sourcing, replay, projection, or historical-knowledge changes;
- branch creation, push, PR creation, CI execution, merge, or later-slice design.

No D1 primary may be used to claim any excluded work.

## 17. Corrected review checks

The fresh independent rule-design reviewer must verify:

1. every authoritative accepted physical-test-file-set hash is exactly the same 64-character value:
   `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab`;
2. the validator requires exact 64-lowercase-hex shape and exact equality;
3. one missing or changed nibble rejects;
4. every other accepted value is unchanged;
5. all five accepted contracts remain byte-stable and ordered;
6. `ACCEPTED_CONTRACT_BASELINES` remains byte-stable and ordered;
7. D1 still has exactly five criteria;
8. `D1-C01` has one `T1 + STRUCTURAL_VALIDATION` primary and retains `R4`;
9. `D1-C05` has one `T1 + STRUCTURAL_VALIDATION` primary and retains `R4`;
10. pure selector, builder, comparator, and formatter checks are supporting-only;
11. the two planned pure-policy supporting bindings are explicit, bounded, uniquely resolvable after implementation, and cannot borrow a C primary;
12. `D1-C02`, `D1-C03`, and `D1-C04` are unchanged;
13. the primary census is exactly `5/5`, with duplicate `0` and borrowed `0`;
14. `R1=[]` and `R2=[]`;
15. `D-C01` and `D-C03` remain out of scope;
16. production, tests, workflow, coverage, routing, dependencies, timeouts, rules, and role matrix remain zero-change;
17. Design Round 2 is final and does not authorize Round 3;
18. implementation remains unauthorized pending a fresh `RULE_DESIGN_PASS`.

## 18. Stop conditions

In addition to all unchanged Design Round 1 stop conditions, stop D1 if:

1. any authoritative accepted physical-test-file-set hash is not exactly
   `55783dc1c8ff4078b2fd5b1b6d49ec6ae40d1a1ae38ed3b6cbb97bb8a5c4a2ab`;
2. any code or document accepts a shortened, padded, normalized, case-folded, prefix-matched, or suffix-matched accepted hash;
3. any accepted value other than the corrected exact hash spelling or validation must change;
4. `D1-C01` or `D1-C05` is implemented or traced with a pure-policy primary;
5. the real CLI, real collected input, persisted artifact, or closed report is absent from either corrected primary;
6. a corrected criterion has multiple primaries or mixed primary layers;
7. a pure-policy supporting check is represented as accepted-stream, application-command, replay, projection, cross-platform CI, or a second primary;
8. any supporting authority borrows or impersonates a C, C1, CE, D0, or parent-D primary;
9. the five-criterion/five-unique-primary census differs;
10. duplicate or borrowed primary count is nonzero;
11. any third D1 design round or third implementation repair is requested without new explicit user authorization;
12. implementation requires any expansion beyond the unchanged Round 1 allowlist, budgets, or non-goals.

A failure of the exact accepted hash or a requirement to alter accepted history is `HUMAN_BLOCKED`, not an architecture choice.

## 19. Correction disposition

- `priorDesignRound`: `1/2`
- `currentDesignRound`: `2/2`
- `correctionScope`:
  `[EXACT_ACCEPTED_PHYSICAL_FILE_SET_SHA256, D1_C01_PRIMARY_ALIGNMENT, D1_C05_PRIMARY_ALIGNMENT]`
- `criterionCount`: `5`
- `uniquePrimaryCount`: `5`
- `duplicatePrimaryCount`: `0`
- `borrowedPrimaryCount`: `0`
- `ruleSemanticsChanged`: `false`
- `acceptedBehaviorChanged`: `false`
- `acceptedHistoryChanged`: `false`
- `roleCoverageChanged`: `false`
- `implementationAuthorized`: `false`
- `designRound3Authorized`: `false`
- `remainingBlockers`:
  `[PENDING_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW_D1_ROUND_2]`
- `requiredNextAction`:
  `MATERIALIZE_THIS_EXACT_CORRECTION_THEN_RUN_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW`
- `nextSliceAuthorized`: `false`

READY_FOR_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW_D1_ROUND_2
