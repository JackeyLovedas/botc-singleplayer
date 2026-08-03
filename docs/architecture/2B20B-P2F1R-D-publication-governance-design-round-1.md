# Phase 3 Slice 2B20B-P2F1R-D Publication Governance Design Round 1

## 1. Authorization

- `authorization`:
  `USER_AUTHORIZED_2B20B_P2F1R_D_BOUNDED_PUBLICATION_GOVERNANCE_DESIGN_ROUND_1_ONLY`
- `designRound`: `1`
- `currentDesignHead`: `fe3ed9f3d5309db4f0da4deaa3cab0780cd7d390`
- `precheck`:
  `docs/architecture/2B20B-P2F1R-D-governance-precheck-v1.md`
- `precheckCommit`: `f937c9830bb0618b0249bf103b64ce9e88950e7e`
- `ruleEvidence`: `docs/rules/evidence/2B20B-P2F1R-D.md`
- `ruleEvidenceCommit`: `fe3ed9f3d5309db4f0da4deaa3cab0780cd7d390`
- `ruleEvidenceSHA256`:
  `74703e74f478699a59b17f594708c963d820f8b7021593b8e78d9885c879ca53`
- `ruleVerdict`: `RULE_READY`
- `ruleCoverageStatus`: `SKELETON`
- `sliceCoverageTarget`: `NON_ROLE_PUBLICATION_GOVERNANCE`
- `involvedRoles`: `[]`
- `applicableOverrides`: `[]`
- `requiredRuleChanges`: `none`
- `requiredProductChanges`: `none`
- `ruleSemanticsChanged`: `false`
- `acceptedBehaviorChanged`: `false`
- `productionBehaviorChanged`: `false`
- `roleCoverageChanged`: `false`
- `implementationAuthorized`: `false`
- `designVerdict`: `PENDING_INDEPENDENT_RULE_DESIGN_REVIEW`

D owns only ownership publication, routing reconciliation, an append-only
exact-source coverage profile, Windows/Linux evidence binding, exact-head CI,
review publication, and Catalog representation reconciliation. It owns no
product behavior, rule meaning, role mechanism, test identity, C primary
evidence, accepted-history authority, or trusted-history authority.

This document is a bounded design awaiting fresh independent rule-design
review. It is not `RULE_DESIGN_PASS` and authorizes no implementation.

## 2. Frozen inputs

### 2.1 Frozen heads

| Input | Frozen identity |
|---|---|
| C/CE documentation closure | `1ea5b388335cb63c81547c3a4b4ef7aa22594915` |
| C H2 source/evidence execution | `cdbca657adf27a9050877cca4bad5d718781cacc` |
| D0 execution source S | `f2ec59dbffdfb3235b87e151d892b4986e2ef23b` |
| D0 docs-only evidence child E | `ac65163d3952ed4ea1b3955c5a7d712b4191a2a9` |
| Old exact-source coverage baseline | `4d576e205cb20c37ba913b923a1cd39e8d800d18` |

### 2.2 Frozen Git-blob/LF production identities

| Layer | File | SHA-256 |
|---|---|---|
| A | `packages/domain-core/src/canonical-runtime-value.ts` | `c023e9ae4201fe590c759170959f921559bfd5941bc6234a364a17de1a38278d` |
| B | `packages/domain-core/src/canonical-runtime-hash.ts` | `b7c3b4e53b07f9200cdd9b398e7261961d0053f65cb37518515df65f3aa53313` |
| C1 | `packages/domain-core/src/domain-event-structural-schema-ast.ts` | `38246dd89ea2c099b7f307a4597c2899eb40c95494c73c6b6847ff80d8e66156` |
| C1 | `packages/domain-core/src/domain-event-structural-schema-catalog.ts` | `218e7a9d2f68f7b6d0c7f06df00eb8afcc4b06bc1385bc907e147d0764c30aa5` |
| C | `packages/domain-core/src/canonical-domain-event.ts` | `41020fbbc0cc23194c565c2b0ace5ce907942e86204e8373b29449a94b07a5b3` |
| C | `packages/domain-core/src/domain-event-structural-validator.ts` | `a7d7cd0294c877317ba35957f957859fda586c459aeec40a361fb8853d1531e6` |
| C export boundary | `packages/domain-core/src/index.ts` | `ac142d2c83a77c73aae244dc2bd3d6da9e7f01ca923fff4d22139ed10c024353` |

Every hash and behavior remains frozen. Dreamer, Seamstress, Philosopher, and
Mathematician remain `PARTIAL`; Vortox remains `NOT_STARTED`. No role status,
rule, override, nightsheet order, product behavior, replay behavior, privacy
boundary, or accepted-history meaning changes in D.

## 3. C evidence boundary

The frozen C evidence inventory is:

- grouping criteria: `5`;
- total criteria: `33`;
- active primary criteria: `28`;
- Vitest primaries: `27`;
- executable static primaries: `1`;
- physical Vitest identities: `28`;
- support-only Vitest identities: `1`;
- supporting-authority rows: `0`;
- all current `SupportingAuthorityId` values: `NONE`;
- duplicate/borrowed/missing/invalid counts: `0 / 0 / 0 / 0`;
- `MechanismMatch`: `28/28 PASS`.

The five non-primary grouping parents are:

`[C-C03, C-C06, C-C09, C-C12, C-C15]`.

The 28 active criterion IDs are:

`[C-C01, C-C02, C-C03a, C-C03b, C-C03c, C-C04, C-C05, C-C06a, C-C06b, C-C07, C-C08, C-C09a, C-C09b, C-C10, C-C11, C-C12a, C-C12b, C-C12c, C-C13, C-C14, C-C15a, C-C15b, C-C15c, C-C15d, C-C16, C-C17, C-C18, C-C19]`.

C-C15d has one executable static primary:

- file: `scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs`;
- identity: `STATIC_C_C15D_16_EXACT_AST_BINDINGS`.

The same-titled C-C15d Vitest identity remains physical support only. D must
not transfer the C primary to that Vitest, invent a second primary, or alter C
Traceability. The interrupted CE coverage attempt is prohibited evidence: it
must never enter D ownership, routing, coverage, artifact, review, or
publication inputs.

## 4. D ownership boundary

The existing application ownership registry and every accepted application
contract remain unchanged. D appends a separate registry collection named
`TRACEABILITY_PHYSICAL_PARTITION_CONTRACTS_V1` with this exact contract:

- `contractKind`: `TRACEABILITY_PHYSICAL_PARTITION_V1`;
- `contractId`: `C`;
- `publisher`: `D`;
- `owner`: `C`;
- `project`: `domain-core`;
- `testFile`:
  `packages/domain-core/src/domain-event-structural-validator.test.ts`;
- `traceabilityFile`:
  `docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md`;
- `ancestorPath`: `[P2F1R-C domain event structural validation]`;
- `groupingCriteria`: `[C-C03, C-C06, C-C09, C-C12, C-C15]`;
- `vitestPrimaryCriteria`: every active criterion in section 3 except C-C15d;
- `staticPrimary`: C-C15d at
  `STATIC_C_C15D_16_EXACT_AST_BINDINGS`;
- `supportOnlyVitest`: the physical C-C15d Vitest identity;
- `supportingAuthorityPrefix`: `SUP-2B20B-P2F1R-C-`;
- `status`: `ACTIVE`.

A physical identity is the exact tuple
`project / file / ancestorPath / title`. Canonical comparison and ordering use
raw UTF-16 ordinal order only; locale comparison, collators, time, randomness,
and environment-dependent ordering are forbidden.

The contract freezes:

- physical identities `28`;
- Vitest primaries `27`;
- executable static primaries `1`;
- support-only Vitest identities `1`;
- grouping criteria `5`;
- total criteria `33`;
- supporting authorities `0`;
- duplicate/borrowed/missing/invalid/wrongProject/wrongFile/wrongAncestor/
  unowned counts all `0`;
- structured physical inventory SHA-256
  `dc7acb226c45a39932ebf27c3928e1ad9a51566172221071470b2ea4bd43e720`.

Validation fails closed on unknown fields, getters, symbols, proxies, sparse or
non-plain structures, duplicate keys, marker overlap, primary transfer,
cross-contract borrowing, missing/extra criteria, title/ancestor/project/file
substitution, static/Vitest type substitution, malformed supporting authority,
wrong owner, or unowned physical identity. No new test identity, project,
group, filter, or Traceability row is permitted.

## 5. Routing design

### 5.1 Ordinary topology

Ordinary routing freezes `9` logical groups, `11` physical blobs, and a
`1712`-identity union:

| Logical group | Identities | Physical partition |
|---|---:|---|
| `domain-core-rebuild` | 207 | 1 |
| `domain-core-rest` | 503 | 1 |
| `application` | 465 | 1 |
| `application-service-core` | 90 | 1 |
| `application-service-role-actions` | 52 | 1 |
| `application-service-information-and-later-actions` | 82 | 1 |
| `application-service-compatibility-and-failure-boundaries` | 26 | 1 |
| `application-service-dreamer-vortox` | 46 | 3: `14 / 22 / 10` |
| `engines-and-projections` | 241 | 1 |

The ordinary union requires intersection `0`, missing `0`, unexpected `0`,
and wrong-owner `0`.

### 5.2 Coverage topology

Coverage routing freezes `11` logical groups, `12` physical blobs, and the
same `1712` semantic identities:

| Logical group | Identities | Physical partition |
|---|---:|---|
| `domain-core-rebuild` | 207 | 1 |
| `domain-core-rest` | 503 | 1 |
| `application` | 465 | 1 |
| `application-service-core` | 90 | 1 |
| `application-service-role-actions` | 52 | 1 |
| `application-service-information-and-later-actions-base` | 73 | 1 |
| `application-service-information-and-later-actions-a3b2` | 9 | 1 |
| `application-service-compatibility-and-failure-boundaries` | 26 | 1 |
| `application-service-dreamer-vortox-core` | 36 | 2: `14 / 22` |
| `application-service-dreamer-vortox-gained` | 10 | 1 |
| `engines-and-projections` | 241 | 1 |

Coverage requires zero gap, overlap, duplicate execution, ambiguous identity,
unexpected identity, and wrong owner. Its semantic union must be byte-identical
to the ordinary semantic union.

### 5.3 Windows topology

Windows retains existing W7 as `1` logical group, `3` physical segments, and
`46` identities, and adds the existing ordinary `domain-core-rest` runner as
`1 / 1 / 503`. The resulting Windows topology is exactly `2` logical groups,
`4` physical segments, and `549` unique identities, with zero gap, overlap,
duplicate, ambiguous identity, or wrong owner.

The increment inside `domain-core-rest` relative to the old 1572 inventory is
exactly:

- A: `52`;
- B: `14`;
- C1 AST: `25`;
- C1 Catalog: `21`;
- C: `28`;
- total: `140`.

D adds no project, group, filter, test, suite, ancestor, or title.

## 6. Coverage profile design

D uses a strict two-commit model:

1. `D_SOURCE_HEAD_S` contains bounded D plumbing but no new profile record and
   no selector change.
2. `D_PROFILE_CHILD_P` is the direct child of S and the final feature head. P
   may change only the appended profile, the workflow selector, and D
   publication documentation/review archives.

The new profile ID is
`phase-3-slice-2b20b-p2f1r-d-<first7(S)>-publication-v1`, and its `sourceHead`
is the full 40-character S. D must prove `P^=S`, direct ancestry, zero
production/test change in P, and identical S/P inventories of `69` production
TypeScript files and `1712` semantic tests.

The old profile
`phase-3-slice-2b20a-4d576e2-final-restoration-v1` is immutable. Exactly one
new profile is appended, and the workflow selector changes exactly once in P.

The exact source inventory contains `69` production TypeScript files. The six
files added relative to the old `63` are:

- `packages/domain-core/src/canonical-domain-event.ts`;
- `packages/domain-core/src/canonical-runtime-hash.ts`;
- `packages/domain-core/src/canonical-runtime-value.ts`;
- `packages/domain-core/src/domain-event-structural-schema-ast.ts`;
- `packages/domain-core/src/domain-event-structural-schema-catalog.ts`;
- `packages/domain-core/src/domain-event-structural-validator.ts`.

`packages/domain-core/src/index.ts` is modified, not added.

The profile freezes the sorted source-inventory SHA, structured 1712-test
inventory SHA, full logical/physical topology, coverage-final SHA, global
manifest SHA, complete normalized tuple-set SHA, and exact source/zero-hit
statement/function/line/branch-arm count-and-SHA tuples.

For every tuple group, the delta records old/new count and SHA, added/removed
count and tuple SHA, set equality, and full delta SHA. Required changes are
source `+6 / -0`, semantic tests `+140 / -0`, and unexplained removals or
positive-coverage loss `0`. Counts-only equivalence never passes.

Collection begins only with an absent or verified-empty output root. It rejects
stale, partial, renamed, mixed-head, duplicate, symlink, junction,
interrupted, cross-profile, foreign-run, or pre-existing output. CE's
interrupted coverage attempt is always forbidden.

## 7. Hosted evidence design

Linux hosted authority includes the existing ordinary and coverage
`domain-core-rest` artifacts plus global ordinary/coverage unions, the exact
profile result, typecheck, and lint.

Windows retains existing application evidence and adds this exact existing
runner command:

```text
node scripts/run-vitest-logical-group.mjs run --mode ordinary --logical-group-id domain-core-rest
```

The new artifact is:

- name: `windows-domain-core-rest-evidence`;
- path: `.vitest-test/segmented/domain-core-rest`;
- selected/passed: `503 / 503`;
- failed/skipped/todo/global errors: `0 / 0 / 0 / 0`;
- process exit: `0`;
- merge eligibility/completeness: `true / true`;
- identity, manifest, result, stdout/stderr, and artifact hashes: complete and
  untruncated.

Final authority comes only from the exact final push run where GitHub
`headSha = checkout HEAD = PR head = independently reviewed head = P`. A PR
merge-ref run is supplemental and cannot replace exact-P push authority.

Failures remain classified as exactly `CI_PRODUCT_FAILURE`,
`CI_TEST_INFRASTRUCTURE_FAILURE`, or `CI_EXTERNAL_RUNNER_FAILURE`. D changes no
timeout, dependency, runtime, install, retry, or failure-classification policy.

## 8. Workflow extension boundary

The workflow remains `.github/workflows/ci.yml`, name `CI`, triggers
`push`/`pull_request`, Node `24.15.0`, pnpm `11.7.0`, and frozen-lockfile
installation.

The only semantic workflow changes are:

1. at S, add Windows `domain-core-rest` execution, exact artifact upload, and
   always-run success enforcement inside the existing `deterministic-windows`
   job;
2. at P, change the coverage profile selector to the single new D profile.

The Windows execution may use `continue-on-error` only to guarantee artifact
upload; a later `if: always()` enforcement step must require exact `success`.
The upload uses `actions/upload-artifact@v4`, `if: always()`, exact name/path,
`if-no-files-found: error`, `include-hidden-files: true`, and
`retention-days: 7`.

D must not add or replace a job, workflow, matrix, runner, trigger, timeout,
install step, dependency, runtime, provider, or existing command. Existing
commands and artifact semantics may not broaden.

## 9. Catalog reconciliation

The reconciled Catalog identity is:

- path:
  `docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md`;
- blob OID: `4f9a376e56f19b241d76ce2a75be83b70859ae25`;
- blob/generated bytes: `264855`;
- blob/generated SHA-256:
  `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`;
- default-Windows checkout bytes: `265481`;
- default-Windows checkout SHA-256:
  `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7`;
- LF checkout SHA-256:
  `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`;
- canonical LF count: `626`;
- classification: `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY`;
- `runtimeAuthority`: `false`.

Blob bytes, generated bytes, and checkout bytes are compared separately. Only
blob/generated bytes are canonical. The sole permitted Windows delta is the
`626` LF-to-CRLF conversion. BOM, mixed line endings, content, OID, length,
generator, or non-line-ending mismatch fails closed.

## 10. Publication review

### 10.1 Authentic predecessor review archives

D must materialize these four complete final reports verbatim:

- `docs/implementation/reviews/2B20B-P2F1R-C-code-review-final.md`;
- `docs/implementation/reviews/2B20B-P2F1R-C-rule-review-final.md`;
- `docs/implementation/reviews/2B20B-P2F1R-D0-code-review-final.md`;
- `docs/implementation/reviews/2B20B-P2F1R-D0-rule-review-final.md`.

Each archive records review kind, slice, exact reviewed head, timestamp,
transport provenance, body byte length/SHA-256, and a clearly delimited verbatim
body. It must never reconstruct a body from a summary, verdict, controller
memory, CE re-entry statement, or historical 4fd review. Missing, truncated,
unverifiable, or non-verbatim source output is a stop condition.

### 10.2 Final D independent review

Final review begins only after P is pushed, the PR body is complete, exact-P
push CI is green, and the branch is frozen. One fresh independent read-only
reviewer returns one complete report containing every REVIEW_PROTOCOL field:

- `reviewedPR`;
- `reviewedHead`;
- `reviewTimestamp`;
- `reviewScope`;
- `productionFilesReviewed`;
- `testFilesReviewed`;
- `ruleEvidenceReviewed`;
- `findings`;
- `codeVerdict`;
- `ruleVerdict`;
- `remainingBlockers`.

Acceptance requires `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`, and
`remainingBlockers=[]` at exact P. The complete report is published verbatim
under both exact GitHub audit markers and re-read from GitHub before merge. A
commit after review invalidates CI, review, and both comments.

### 10.3 Independent design-review checklist

The independent rule-design reviewer must verify all 15 items:

1. no C production, test, Traceability, rule, role-status, or accepted-behavior change;
2. exact 5/33/28 and 27-Vitest/1-static/1-support ownership partition;
3. hostile ownership shapes, borrowing, primary transfer, and wrong tuple bindings fail closed;
4. exact ordinary and coverage 1712 unions with zero routing gap/collision;
5. Windows reuses the ordinary `domain-core-rest` runner without new identity or foundation;
6. the S/P direct-child append-only profile model is non-self-referential and exact;
7. coverage rejects contamination, stale output, mixed heads, and interrupted CE output;
8. old profiles stay immutable and the selector changes exactly once at P;
9. workflow change is minimal and preserves runtime/install/timeout/provider policy;
10. hosted authority binds exact P, complete artifacts, hashes, logs, and retention;
11. Catalog remains audit-only with only LF-to-CRLF checkout conversion;
12. C and D0 final review bodies are authentic, complete, verbatim, and not reconstructed;
13. `R1=[]` and `R2=[]`, with no mixed or multi-layer criterion;
14. every supporting authority resolves once and no review-body SUP is fabricated;
15. the implementation allowlist and all stop-loss boundaries are exact and sufficient.

## 11. Artifact retention

Retention is exactly `7` days for:

- existing `test-evidence-domain-core-rest` on Ubuntu;
- existing `coverage-evidence-domain-core-rest` on Ubuntu;
- existing `windows-application-evidence`, unchanged;
- new `windows-domain-core-rest-evidence`.

The publication manifest records workflow, run ID and URL, run attempt, event,
head SHA, job and step, artifact name, artifact ID, digest, creation time,
expiry time, retention days, download time, and status. Expired, missing,
wrong-head, partial, failed, skipped, truncated, or unverifiable artifacts
cannot be reconstructed or promoted. The repository stores hashes and
provenance, not artifact binaries.

## 12. Traceability

The design-time reachability partition is:

- `R1=[]`;
- `R2=[]`;
- `R3=[D-C03, D-C09, D-C14]`;
- `R4=[D-C01, D-C02, D-C04, D-C05, D-C06, D-C07, D-C08, D-C10, D-C11, D-C12, D-C13, D-C15, D-C16]`.

No criterion is `MIXED` or `MULTI_LAYER`. D creates no test identity and uses
no C primary as a D primary. `MechanismMatch=PASS` is forbidden before the
implementation exists and its exact mechanisms have executed.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| D-C01 | D is publication-only | All frozen product/rule/test/Traceability/role identities have zero drift | Exact Git-object, inventory, and status comparison | R4_FUTURE_HYPOTHETICAL_STATE | T3_MODULE_PRIVATE_PURE_CORE | PURE_POLICY_SEAM | Zero drift across every frozen input | NONE |
| D-C02 | C physical/primary partition remains exact | 5 grouping, 33 total, 28 active, 27 Vitest primary, 1 static primary, 1 support-only, SUP=0 | Exact traceability plus physical inventory partition audit | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | Exact partition and all invalid counters zero | NONE |
| D-C03 | Ownership fails closed under hostile bindings | Every malformed, borrowed, duplicate, missing, transferred, wrong-project/file/ancestor, and unowned mutant is rejected | Executable ownership hostile-shape and mutation suite | R3_HOSTILE_OR_CORRUPTED_HISTORY | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | All hostile mutants rejected without getter/proxy execution | SUP-2B20B-P2F1R-D-001 |
| D-C04 | Ordinary routing owns the complete inventory once | Nine logical/eleven physical groups form exact 1712 union | Exact ordinary list collection, per-group manifests, and global union audit | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | 1712 union; intersection/missing/unexpected/wrong-owner all zero | NONE |
| D-C05 | Coverage routing matches ordinary semantics | Eleven logical/twelve physical groups form the same 1712 semantic union | Exact coverage list collection, group manifests, and cross-mode union comparison | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | Coverage union byte-identical to ordinary; all gaps/overlaps zero | NONE |
| D-C06 | Windows covers the frozen application and domain-core sets | Existing W7 46 plus reused domain-core-rest 503 yield 549 unique, including exact new 140 | Windows runner manifests, identity union, and artifact evidence | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | CROSS_PLATFORM_CI | 2 logical/4 physical/549; zero fail/skip/todo/gap/overlap | NONE |
| D-C07 | Coverage profile is append-only and source-bound | P is direct child of S; one profile appended; selector changes once; old profiles unchanged | Git ancestry/diff allowlist and exact profile-registry comparison | R4_FUTURE_HYPOTHETICAL_STATE | T3_MODULE_PRIVATE_PURE_CORE | PURE_POLICY_SEAM | `P^=S`, immutable old registry, exact new ID/sourceHead | SUP-2B20B-P2F1R-D-002 |
| D-C08 | Exact-source profile captures the full current obligations | Freeze 69 sources, 1712 tests, complete tuples, +6/+140, zero removal/loss | Exact-source profile verifier with full set/delta hashes | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | Exact tuple equality; source +6/-0; tests +140/-0; unexplained loss zero | SUP-2B20B-P2F1R-D-002 |
| D-C09 | Coverage evidence rejects contamination | Stale/partial/renamed/mixed-head/duplicate/link/interrupted/cross-profile inputs all fail | Contamination and hostile-output-root mutation suite | R3_HOSTILE_OR_CORRUPTED_HISTORY | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | Every contaminated candidate rejected; clean absent/empty root accepted | NONE |
| D-C10 | Linux hosted evidence is exact and complete | Ordinary/coverage domain-core-rest plus global unions/profile/typecheck/lint bind exact P | Exact-run manifests, logs, artifact digests, and GitHub run metadata | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | CROSS_PLATFORM_CI | Exact-P Linux evidence complete and green | NONE |
| D-C11 | Windows domain-core evidence is exact | Existing runner selects/passes 503 with complete merge-eligible evidence | Windows run logs, result/manifest hashes, artifact digest, and union audit | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | CROSS_PLATFORM_CI | 503/503, exit 0, no fail/skip/todo/global error | NONE |
| D-C12 | Workflow change and retention are minimal | Only Windows execution/upload/enforcement and P selector change; retention exactly 7 | Static workflow AST/text contract and artifact configuration audit | R4_FUTURE_HYPOTHETICAL_STATE | T3_MODULE_PRIVATE_PURE_CORE | PURE_POLICY_SEAM | No job/runtime/install/timeout/provider expansion; exact artifact policy | NONE |
| D-C13 | Catalog representations reconcile without authority drift | Blob/generated/default/LF identities match the frozen three-form contract | Git blob, generator bytes, checkout bytes, EOL, length, and SHA comparison | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY; runtimeAuthority=false | NONE |
| D-C14 | Catalog mutations fail closed | BOM/mixed/content/OID/length/generator mutations are rejected | Hostile Catalog representation mutation suite | R3_HOSTILE_OR_CORRUPTED_HISTORY | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | Only exact 626 LF-to-CRLF conversion accepted | NONE |
| D-C15 | Review publication preserves authentic complete bodies | Four predecessor and final D reports retain exact provenance and verbatim body hashes | Source-output acquisition, delimiter, byte-length, SHA, and completeness audit | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | No missing/truncated/reconstructed report; required verdict fields present | NONE |
| D-C16 | Final publication binds exact P everywhere | Push CI, checkout, PR, independent review, and both audit comments all bind P | GitHub run/PR/comment reread and complete reviewer-report audit | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | CROSS_PLATFORM_CI | Exact-P green CI, both PASS verdicts, blockers empty, comments complete | NONE |

## 13. Supporting Authority

Exactly two D supporting authorities are planned:

| SupportingAuthorityId | Accepted source | Used by | Mutation policy |
|---|---|---|---|
| `SUP-2B20B-P2F1R-D-001` | Accepted multi-slice ownership registry `ACCEPTED_CONTRACT_BASELINES` in `scripts/vitest-ownership-contracts.mjs` | D-C03 | `CLONE_MUTATED` |
| `SUP-2B20B-P2F1R-D-002` | Accepted exact-source profile `phase-3-slice-2b20a-4d576e2-final-restoration-v1` | D-C07, D-C08 | `NONE` |

Each supporting authority must resolve exactly once. No C/CE/D0 review output,
summary, evidence manifest, test, or Traceability row receives a fabricated
SUP identifier.

## 14. Stop-loss

### 14.1 Exact future implementation allowlist

- production: `[]`;
- Vitest tests: `[]`;
- scripts:
  - `scripts/vitest-ownership-contracts.mjs`;
  - `scripts/verify-vitest-ownership-contracts.mjs`;
  - `scripts/run-vitest-logical-group.mjs`;
  - `scripts/verify-coverage-obligations.mjs`;
- workflow:
  - `.github/workflows/ci.yml`;
- documentation:
  - `docs/implementation/vitest-multi-slice-ownership-contract-registry-v1.md`;
  - `docs/implementation/phase-3-slice-2b20b-p2f1r-d-test-traceability.md`;
  - `docs/implementation/phase-3-slice-2b20b-p2f1r-d-coverage-profile.md`;
  - `docs/implementation/phase-3-slice-2b20b-p2f1r-d-publication-manifest.md`;
  - `docs/implementation/reviews/2B20B-P2F1R-C-code-review-final.md`;
  - `docs/implementation/reviews/2B20B-P2F1R-C-rule-review-final.md`;
  - `docs/implementation/reviews/2B20B-P2F1R-D0-code-review-final.md`;
  - `docs/implementation/reviews/2B20B-P2F1R-D0-rule-review-final.md`.

No other file is allowed. Explicitly forbidden are A/B/C1/C production,
tests, C Traceability, Catalog content, event types/payloads, semantic
validators, application/replay/state/batch/snapshot logic, roles, P2F product
integration, dependencies, lockfile, workspace config, timeouts, providers,
Node/pnpm versions, rule evidence, and role coverage matrix/status changes.

### 14.2 Future local and hosted gates

After authorization, the future implementation must run:

1. ownership self-test;
2. logical runner self-test;
3. exact ownership census;
4. exact ordinary/coverage routing census and union audit;
5. exact S/P profile, source, tuple, delta, and contamination audit;
6. exact Catalog three-form and hostile-mutation audit;
7. `pnpm typecheck`;
8. `pnpm lint`;
9. `pnpm test`;
10. `pnpm test:coverage` from a clean absent/empty output root;
11. final clean-worktree and exact-allowlist audit.

Hosted final checks must verify exact P for push run, checkout, PR head,
ordinary/coverage unions, profile, Linux/Windows artifacts, typecheck, lint,
complete logs/hashes, independent final review, and both reread audit comments.

### 14.3 Stop conditions

Stop without implicit repair when any of these 14 conditions occurs:

1. any frozen A/B/C1/C behavior, hash, rule, role-status, test identity, or Traceability drift;
2. any new test identity, project, group, filter, suite, ancestor, or title is required;
3. C-C15d or any other C primary must transfer, duplicate, or become a D primary;
4. an accepted old coverage profile must be edited, replaced, reordered, or deleted;
5. S/P direct ancestry, source binding, or inventory equality cannot be proven;
6. coverage evidence is stale, partial, mixed-head, linked, interrupted, contaminated, or not from an absent/empty root;
7. ordinary, coverage, or Windows routing has a collision, gap, duplicate, ambiguity, unexpected identity, or wrong owner;
8. Windows evidence requires a new foundation, dependency, timeout, runtime, provider, retry, or semantic change;
9. Catalog differs by anything other than the exact 626 LF-to-CRLF checkout conversion;
10. any complete original C or final D0 review output is unavailable, truncated, unverifiable, or would need reconstruction;
11. CI, PR, checkout, artifact, review, or audit comments bind a wrong, stale, merge-ref-only, or post-review head;
12. implementation requires a path outside the exact allowlist;
13. any rule, product behavior, replay, privacy, accepted-history, canonical-state, or trusted-history change is required;
14. fresh independent review does not return `RULE_DESIGN_PASS` with no remaining blocker.

There is no implicit rerun, repair, profile overwrite, scope expansion, or next
slice. Rollback is limited to abandoning unaccepted work or an ordinary revert;
never reset, rebase, force-push, delete profiles, rewrite accepted history, or
conceal failed evidence.

- `designVerdict`: `PENDING_INDEPENDENT_RULE_DESIGN_REVIEW`
- `implementationAuthorized`: `false`
- `blockers`: `[PENDING_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW]`
- `requiredNextAction`:
  `MATERIALIZE_THIS_DESIGN_THEN_RUN_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW`
- `nextSliceAuthorized`: `false`

READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW
