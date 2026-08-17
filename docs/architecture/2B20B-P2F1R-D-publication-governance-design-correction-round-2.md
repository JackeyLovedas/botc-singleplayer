# Phase 3 Slice 2B20B-P2F1R-D Publication Governance Design Correction Round 2

## 1. Correction authority

- `authorization`:
  `USER_AUTHORIZED_2B20B_P2F1R_D_DESIGN_CORRECTION_ROUND_2_ONLY`
- `authorizationDisposition`:
  `BOUNDED_STOP_LOSS_CONTRACT_SATISFIED_BY_EXPLICIT_ROUND_2_AUTHORIZATION`
- `authorizationIsGeneralOverride`: `false`
- `currentHead`: `2ed49fa69306adf247fcf31284188246e4be3450`
- `parentDesign`:
  `docs/architecture/2B20B-P2F1R-D-publication-governance-design-round-1.md`
- `parentDesignSHA256`:
  `0922ebd05cbc3036ee97e2cadede5c3c0c90b671dc07fd6a90a702d5fb6abaae`
- `correctionRound`: `2/2`
- `ruleVerdict`: `RULE_READY`
- `ruleSemanticsChanged`: `false`
- `acceptedBehaviorChanged`: `false`
- `productionBehaviorChanged`: `false`
- `roleCoverageChanged`: `false`
- `implementationAuthorized`: `false`

Round 1 is immutable. This standalone correction closes only prior findings
`F01` and `F02` and is the sole authority for D-C16 decomposition, the D
criterion/primary census, implementation file and line budgets, repair-round
limits, and the corrected stop-loss contract. Every other Round 1 fact remains
unchanged and authoritative.

- `priorDesignVerdict`: `RULE_DESIGN_FIX_REQUIRED`
- `priorFindingIds`: `[F01, F02]`
- `closedByThisCorrection`: `[F01, F02]`
- `additionalScope`: `none`

## 2. Corrected D-C16 publication conjunction

D-C16 is a historical grouping parent only. It has no primary identity,
borrows no C primary, and is satisfied only by the conjunction of D-C16A and
D-C16B at the same final feature head P.

### 2.1 Corrected nine-field traceability rows

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| D-C16 | Final publication binds the same P across CI and the complete audit chain | D-C16A and D-C16B both pass and bind the same exact P | Historical grouping conjunction over D-C16A and D-C16B; no primary | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | NONE | `D-C16A=PASS` and `D-C16B=PASS` at the same head P | NONE |
| D-C16A | Final hosted push CI is authoritative only at exact P | GitHub push run head, checkout, and PR head all equal P; every required Linux/Windows job, artifact, log, and hash is complete | Exactly one GitHub push-run primary at P | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | CROSS_PLATFORM_CI | Exact success with no stale, missing, partial, or truncated evidence | NONE |
| D-C16B | PR, independent review, and both audit comments bind exact P | Live PR metadata, complete reviewer report, both markers, and all referenced hashes bind P; verdicts are CODE/RULE PASS; blockers are empty; bodies are verbatim | Exactly one structural-audit primary reading live PR metadata, reviewer report, comments, markers, and hashes | R4_FUTURE_HYPOTHETICAL_STATE | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | Complete and internally consistent PR/review/comment audit at P | NONE |

### 2.2 Primary identity and mechanism classification

| CriterionId | PrimaryIdentity | primaryCardinality | kind | MechanismMatch | Additional boundary |
|---|---|---:|---|---|---|
| D-C16 | `NONE` | 0 | `HISTORICAL_GROUPING_PARENT` | `NONE` | Grouping conjunction only; no primary |
| D-C16A | `ONE_EXACT_P_GITHUB_PUSH_RUN` | 1 | `HOSTED_EXACT_HEAD_CI` | `PENDING_IMPLEMENTATION` | Required jobs, artifacts, logs, and hashes are parts of the one run primary |
| D-C16B | `ONE_LIVE_PR_REVIEW_COMMENT_STRUCTURAL_AUDIT` | 1 | `PR_REVIEW_COMMENT_STRUCTURAL_AUDIT` | `PENDING_IMPLEMENTATION` | The two comments are structural-audit inputs, not separate primaries |

`MechanismMatch=PASS` remains forbidden until the corresponding implementation
exists and its exact primary has executed. D-C01 through D-C15 are unchanged
from Round 1.

## 3. Corrected criterion and ownership census

- `R1=[]`
- `R2=[]`
- `R3=[D-C03, D-C09, D-C14]`
- `R4=[D-C01, D-C02, D-C04, D-C05, D-C06, D-C07, D-C08, D-C10, D-C11, D-C12, D-C13, D-C15, D-C16, D-C16A, D-C16B]`
- `criterionCount=18`
- `groupingCriterionCount=1`
- `primaryCriterionCount=17`
- `uniquePrimaryIdentityCount=17`
- `withoutPrimaryCount=1`
- `withoutPrimary=[D-C16]`
- `duplicatePrimaryCount=0`
- `borrowedPrimaryCount=0`
- `borrowedCPrimaryCount=0`
- `mixedReachabilityCount=0`
- `multiLayerCount=0`
- `unresolvedPrimaryCount=0`
- `supportingAuthorityCount=2`

D-C16A owns the single hosted exact-head push-run primary. D-C16B owns the
single live PR/review/comment structural-audit primary. Their layers are
distinct and non-borrowed. D-C16 is the only criterion without a primary.

## 4. Corrected implementation budgets

### 4.1 File budget

| Surface | Maximum | Exact allowlist |
|---|---:|---|
| Production | 0 | `[]` |
| Vitest tests | 0 | `[]` |
| Workflow | 1 | `.github/workflows/ci.yml` |
| Scripts | 2 | `scripts/run-vitest-logical-group.mjs`; `scripts/verify-coverage-obligations.mjs` |

The Round 1 script entries `scripts/vitest-ownership-contracts.mjs` and
`scripts/verify-vitest-ownership-contracts.mjs` are excluded. They must not be
edited by D.

`scripts/run-vitest-logical-group.mjs` owns routing, inventory collection,
canonicalization, manifests, evidence production, clean-output-root checks,
self-test coverage, and the C publication partition. It hosts the new C
publication contract without changing the existing application ownership
registry or accepted application baselines.

`scripts/verify-coverage-obligations.mjs` owns the append-only exact-source
coverage profile registry and profile verification.

### 4.2 Line ceilings

| File/surface | Maximum additions | Maximum deletions |
|---|---:|---:|
| `scripts/run-vitest-logical-group.mjs` | 420 | 40 |
| `scripts/verify-coverage-obligations.mjs` | 180 | 10 |
| Aggregate scripts | 600 | 50 |
| `.github/workflows/ci.yml` | 32 | 2 |
| Aggregate non-documentation | 632 | 52 |

- workflow files changed: maximum `1`;
- new workflows: `0`;
- new jobs: `0`;
- new matrices: `0`;
- production files added/changed: `0`;
- test files added/changed: `0`.

Documentation is unbounded only within the exact D documentation/review
allowlist already frozen by Round 1. Documentation may not host executable
logic, generated code, embedded scripts, or any evasion of these file/line
budgets.

Any extra file, third script, line overrun, second workflow, new job/matrix, or
production/test change stops as
`BUDGET_INSUFFICIENT_REQUIRES_USER_READJUDICATION`.

## 5. Workflow necessity and exact extension

The existing `CI` workflow already provides exact checkout, Node `24.15.0`,
pnpm `11.7.0`, frozen-lockfile installation, Linux ordinary and coverage
shards, and the existing `deterministic-windows` job. The only workflow gap is
execution of the already existing ordinary `domain-core-rest` group on
Windows.

The exact command is:

```text
node scripts/run-vitest-logical-group.mjs run --mode ordinary --logical-group-id domain-core-rest
```

The exact always-upload contract is:

- action: `actions/upload-artifact@v4`;
- artifact name: `windows-domain-core-rest-evidence`;
- path: `.vitest-test/segmented/domain-core-rest`;
- `if: always()`;
- `if-no-files-found: error`;
- `include-hidden-files: true`;
- `retention-days: 7`.

`continue-on-error` is permitted only so the artifact can upload. A later
always-run enforcement step must require the execution outcome to be exactly
`success`.

D adds no workflow, job, matrix, runner, timeout, provider, dependency,
runtime, install command, or test command. If the exact extension cannot fit
the one-file `+32/-2` workflow budget, implementation stops for user
readjudication.

## 6. Coverage S-to-P model preserved

The append-only two-commit model is unchanged:

1. `D_SOURCE_HEAD_S` contains only the two-script bounded plumbing and Windows
   workflow wiring. S contains no new profile record and no selector change.
2. `D_PROFILE_CHILD_P` is the direct child and final feature head. P may add
   exactly one profile, change the selector once, and add D publication
   documentation/review archives. P changes no production, tests, routing
   semantics, or product behavior.

The profile ID remains
`phase-3-slice-2b20b-p2f1r-d-<first7(S)>-publication-v1`; `sourceHead` is the
full S.

The profile must freeze:

- `69` exact production TypeScript files;
- `1712` exact semantic test identities;
- source delta `+6/-0`;
- test delta `+140/-0`;
- unexplained removal or positive-coverage loss `0`;
- ordinary and coverage unions exactly `1712` and byte-identical;
- all source, test, topology, coverage-final, global-manifest, tuple-set,
  zero-hit, and complete-delta counts and hashes.

Collection rejects a nonempty, stale, partial, mixed-head, duplicate, renamed,
symlink, junction, interrupted, foreign-profile, or wrong-head root/evidence
set. The interrupted CE coverage output is always prohibited.

## 7. Hosted exact-head authority preserved

Exactly one GitHub push run at P supplies D-C16A. It must prove:

`run head = checkout HEAD = PR head = P = independently reviewed head = both audit-marker heads`.

Linux evidence is complete only when ordinary and coverage
`domain-core-rest`, both global unions, the exact-source profile, typecheck,
lint, artifacts, logs, and hashes all pass at P.

Windows preserves W7 unchanged and adds `domain-core-rest`:

- selected/passed `503/503`;
- Windows unique union `549`;
- new A/B/C1/C subset `140`;
- failed/skipped/todo/global errors `0/0/0/0`;
- process exit `0`;
- artifact, runner, manifest, result, stdout/stderr, and log hashes complete;
- retention exactly `7` days.

The hosted evidence remains behavior-neutral engineering evidence. It grants no
rule, role, product, replay, accepted-history, privacy, or trusted-history
authority.

## 8. Repair and correction round budgets

- `DImplementationRepairRound=0`
- `DImplementationRepairRoundMax=2`
- `DImplementationRepairRound3Authorized=false`
- `DImplementationRepairRound3Forbidden=true`
- `DDesignCorrectionRound=2`
- `DDesignCorrectionRoundMax=2`
- `DDesignCorrectionRound3Authorized=false`
- `DDesignCorrectionRound3Forbidden=true`

An implementation repair may not expand the file allowlist, line ceilings,
workflow budget, rule/product scope, or test identity set. After two failed
implementation repair rounds, the result is `HUMAN_BLOCKED`. Any non-PASS
fresh review of this correction stops implementation; there is no third design
correction without new explicit user readjudication.

## 9. Corrected stop-loss contract

Implementation stops immediately on any of these conditions:

1. any product, production, Vitest, C Traceability, role-status, rule, replay, privacy, accepted-history, or trusted-history change;
2. any file outside the corrected exact allowlist;
3. any third script or edit to either excluded ownership script;
4. any script, workflow, or aggregate line-ceiling overrun;
5. any new workflow, job, matrix, runner, timeout, provider, dependency, runtime, install command, or test command;
6. Windows `domain-core-rest` cannot reuse the existing runner behavior-neutrally;
7. S contains a profile/selector change or P is not the direct child/final feature head;
8. the old profile is modified or more than one profile/selector change occurs;
9. source/test inventories differ from 69/1712 or deltas differ from +6/-0 and +140/-0;
10. ordinary/coverage unions differ, or routing has a gap, overlap, duplicate, ambiguity, unexpected identity, or wrong owner;
11. coverage input/output is nonempty, stale, partial, mixed, linked, interrupted, foreign, wrong-head, or contaminated;
12. exact-P hosted evidence, artifacts, logs, hashes, retention, PR, review, or comments are missing, stale, partial, truncated, or inconsistent;
13. D-C16 owns a primary, either child has other than one unique primary, or a comment is counted as a primary;
14. any census, R inventory, supporting-authority count, or C-primary non-borrowing invariant differs;
15. a complete authentic predecessor/final review body is unavailable or would require reconstruction;
16. implementation needs executable documentation or another budget evasion;
17. any further design correction or third implementation repair is requested without new user authorization;
18. fresh independent review does not pass this exact correction with no blocker.

No implicit repair, rerun, profile overwrite, scope expansion, next slice, or
budget increase is permitted. If the corrected budgets are insufficient, stop
with `BUDGET_INSUFFICIENT_REQUIRES_USER_READJUDICATION`.

## 10. Fresh independent review checklist

The fresh reviewer must verify exactly these 15 items:

1. D-C16 is a grouping parent with layer NONE, primary NONE, cardinality zero, and MechanismMatch NONE.
2. D-C16A owns exactly one hosted exact-head CI primary at CROSS_PLATFORM_CI.
3. D-C16B owns exactly one PR/review/comment structural-audit primary at STRUCTURAL_VALIDATION.
4. Both comments are inputs to D-C16B and are not separate primaries.
5. The corrected 18/1/17/17 census and every zero invalid/borrowed/duplicate count are exact.
6. The corrected R1/R2/R3/R4 inventory is complete with no MIXED or MULTI_LAYER criterion.
7. Production and Vitest budgets are both zero.
8. The implementation script allowlist is exactly two files and excludes both ownership scripts.
9. Per-script and aggregate script ceilings are exact and cannot be evaded through docs.
10. Exactly one workflow file may change within `+32/-2`, with no workflow/job/matrix expansion.
11. Windows execution reuses the existing runner and is behavior-neutral.
12. The append-only S/P model, exact profile ID/sourceHead, 69/1712 inventories, and +6/+140 deltas are preserved.
13. Hosted evidence binds one exact-P push run and complete Linux/Windows evidence, artifacts, logs, hashes, and retention.
14. C production/tests/Traceability/primaries and all rules, roles, accepted behavior, replay, privacy, and trusted-history boundaries remain frozen.
15. Round 2 authorization is bounded, not a general override; implementation remains unauthorized pending a passing fresh review.

## 11. Final correction disposition

- `priorDesignVerdict`: `RULE_DESIGN_FIX_REQUIRED`
- `priorFindingIds`: `[F01, F02]`
- `correctionFindingDisposition`: `[F01=CLOSED_BY_ROUND_2, F02=CLOSED_BY_ROUND_2]`
- `designVerdict`: `READY_FOR_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW`
- `implementationAuthorized`: `false`
- `blockers`:
  `[PENDING_FRESH_INDEPENDENT_REVIEW_OF_DESIGN_CORRECTION_ROUND_2]`
- `requiredNextAction`:
  `MATERIALIZE_DESIGN_CORRECTION_ROUND_2_THEN_RUN_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW`
- `nextSliceAuthorized`: `false`

READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW_ROUND_2
