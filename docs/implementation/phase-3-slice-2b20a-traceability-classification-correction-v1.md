# Phase 3 Slice 2B20A Traceability Classification Correction V1

## Metadata

- sliceId: `2B20A`
- appendixId: `2B20A-TRACEABILITY-CLASSIFICATION-CORRECTION-V1`
- authorization: `USER_AUTHORIZED_2B20A_TRACEABILITY_V1_1_CORRECTION_AND_CONDITIONAL_IMPLEMENTATION`
- status: `APPENDIX_READY`
- designRound: `2 / 2`
- maxDesignRounds: `2`
- correctionKind: `CLASSIFICATION_CORRECTION_APPENDIX`
- parentDesignPath: `docs/implementation/phase-3-slice-2b20a-design-round-2.md`
- parentDesignSha256: `22c79b8965549a2c32cb2c9199aa1a020fbb17ca3dc1af0b9e080d8825ae120f`
- parentReviewPath: `docs/implementation/phase-3-slice-2b20a-design-review-round-2.md`
- parentReviewSha256: `4b8b24d65ebd8a806bcdeecc73d343780866b1526254706e053e101e6f1c44d3`
- exactBlocker: `2B20A_DESIGN_TRACEABILITY_V1_1_PRIMARY_CLASSIFICATION_STILL_INVALID`
- ruleEvidencePath: `docs/rules/evidence/2B20A-resolved.md`
- ruleEvidenceSha256: `47e6c5a70b1eae70f51e9a4e0d78c8ab0d2ddf272babb3f9c76e51970c893189`
- behaviorDesignChanged: `false`
- ruleSemanticsChanged: `false`
- scopeChanged: `false`
- overrideChanged: `false`
- productionChanged: `false`
- testsChanged: `false`
- designReleasePass: `false`
- implementationAuthorized: `false`

This appendix corrects only the primary evidence classification and atomization
of the three reviewed criteria. It is not Design Round 3, does not rewrite the
frozen Round 2 design or review, and does not authorize implementation. The
Round 2 design remains the behavior contract; this appendix supersedes only the
active traceability rows identified below.

## 1. Blocker and Affected Original Criteria

Exact blocker:

```text
2B20A_DESIGN_TRACEABILITY_V1_1_PRIMARY_CLASSIFICATION_STILL_INVALID
```

Affected original criteria:

- `C02`
- `C08`
- `C09`

Supersession mapping:

```text
C02 -> C34, C35, C36
C08 -> C37, C38, C39
C09 -> C40
```

Corrected active criterion set:

```text
C01
C03-C07
C10-C33
C34-C40
```

The original `C02`, `C08`, and `C09` rows remain immutable historical evidence
inside the parent design but are inactive for design release, implementation,
test ownership, and final acceptance.

## 2. Original Nine-Field Rows

These rows are copied from the immutable Round 2 design without changing any
field.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C02 | New capability is narrowly gated | Exact canonical drunk base Dreamer plus unique Fang Gu resolves new capability; adjacent states do not | `CANONICAL_CAPABILITY_RESOLUTION_MATRIX` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `ACCEPTED_STREAM_INTEGRATION` | supported only for frozen path | `AUTH-B`; C01 accepted setup support |
| C08 | Philosopher is causal provenance only | Ledger rejects Philosopher/target as fact source and prevents double count | `CANONICAL_LEDGER_SOURCE_ATTRIBUTION_VALIDATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `ACCEPTED_STREAM_INTEGRATION` | reject substitution/double count | `AUTH-G`; resolved evidence authority |
| C09 | No delivery means no fact | Unsupported/failed command yields no V7 fact and contribution 0 | `CANONICAL_NO_DELIVERY_LEDGER_DERIVATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `ACCEPTED_STREAM_INTEGRATION` | no fact; zero | `AUTH-G`; application failure support |

## 3. Reviewer Findings

### 3.1 C02 finding

Severity: BLOCKER

File/symbol:
`docs/implementation/phase-3-slice-2b20a-design-round-2.md`, C02
`CANONICAL_CAPABILITY_RESOLUTION_MATRIX`

Failure scenario: A direct capability resolver matrix is classified as
`ACCEPTED_STREAM_INTEGRATION`. It does not itself exercise the successful
producer → accepted events → receipt → append → rebuild → projection chain.
The governance ADR explicitly treats a direct validator/resolver represented
as accepted-stream integration as a blocking classification error.

Required correction: Classify the direct capability resolver under its actual
pure-policy/domain seam, or redefine the primary mechanism as a real successful
accepted-stream application path. Keep direct resolver coverage supporting-only
if the accepted stream remains primary.

Required regression tests: A direct exhaustive capability matrix plus a
separate real application-command accepted-stream test proving the frozen path
and adjacent-state rejection.

Atomized: `yes`

Corrected criteria: `C34`, `C35`, `C36`

### 3.2 C08 finding

Severity: BLOCKER

File/symbol: same parent design, C08
`CANONICAL_LEDGER_SOURCE_ATTRIBUTION_VALIDATION`

Failure scenario: One row combines the positive accepted-stream claim that the
base Dreamer is counted once with a separate “reject Philosopher/target
substitution” claim. Substitution rejection requires structural validation or
hostile persisted-history replay depending on the mutation boundary; it is not
established by the positive accepted stream. The row therefore mixes distinct
primary mechanisms and trust boundaries.

Required correction: Split positive accepted-stream ledger attribution from
substitution rejection. Give the positive derivation its accepted-stream
authority and give direct forged-fact validation or persisted-history tampering
its actual `STRUCTURAL_VALIDATION` or `HOSTILE_REPLAY_REJECTION`
classification.

Required regression tests: Positive accepted-stream count of the base Dreamer
exactly once; direct malformed fact-source rejection if such a boundary exists;
and hostile replay rejection for persisted delivery/provenance substitution.

Atomized: `yes`

Corrected criteria: `C37`, `C38`, `C39`

### 3.3 C09 finding

Severity: BLOCKER

File/symbol: same parent design, C09
`CANONICAL_NO_DELIVERY_LEDGER_DERIVATION`

Failure scenario: “Unsupported/failed command yields no V7 fact” is classified
as `ACCEPTED_STREAM_INTEGRATION`. A rejected or failed formal command with no
committed delivery is `R1 + APPLICATION_COMMAND_INTEGRATION`, including its
no-event, no-mutation, receipt, version and retry boundary. It cannot be
accepted-stream evidence.

Required correction: Reclassify C09 as `APPLICATION_COMMAND_INTEGRATION`, use
the real application entry, and require assertions for no committed events,
unchanged state/version, receipt/failure result, retry semantics and zero ledger
contribution.

Required regression tests: Real unsupported/failed `SubmitDreamerAction` test
proving no V7 event, no settlement, no ledger fact, zero Mathematician
contribution, unchanged state/version and the specified receipt/retry contract.

Atomized: `no`

Corrected criterion: `C40`

## 4. Old and Corrected Classification

| Original | Original primary classification | Correction | Corrected primary classifications |
|---|---|---|---|
| `C02` | direct resolver mechanism classified as `ACCEPTED_STREAM_INTEGRATION` | atomize direct resolver, successful accepted stream, and adjacent formal failures | `C34 PURE_POLICY_SEAM`; `C35 ACCEPTED_STREAM_INTEGRATION`; `C36 APPLICATION_COMMAND_INTEGRATION` |
| `C08` | positive derivation and two distinct rejection boundaries combined as `ACCEPTED_STREAM_INTEGRATION` | atomize positive accepted history, direct malformed cross-link, and coordinated persisted-history mutation | `C37 ACCEPTED_STREAM_INTEGRATION`; `C38 STRUCTURAL_VALIDATION`; `C39 HOSTILE_REPLAY_REJECTION` |
| `C09` | rejected/no-delivery command classified as `ACCEPTED_STREAM_INTEGRATION` | one-to-one reclassification at the real command boundary | `C40 APPLICATION_COMMAND_INTEGRATION` |

## 5. Atomization Map

| Source criterion | Atomized | Replacement | One primary mechanism proved by replacement |
|---|---|---|---|
| `C02` | `yes` | `C34` | direct exhaustive capability resolution |
| `C02` | `yes` | `C35` | real successful accepted product chain |
| `C02` | `yes` | `C36` | adjacent unsupported formal command failures |
| `C08` | `yes` | `C37` | positive accepted-stream ledger attribution |
| `C08` | `yes` | `C38` | direct malformed ledger source cross-link rejection |
| `C08` | `yes` | `C39` | coordinated persisted-history attribution substitution rejection |
| `C09` | `no` | `C40` | real no-delivery application failure sequence |

No corrected row combines two primary mechanisms, reachability classes, trust
boundaries, or primary layers.

## 6. Corrected Nine-Field Rows

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C34 | The capability resolver narrowly recognizes the frozen state. | Direct exhaustive resolver invocation returns `CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED` only for exact canonical base-Dreamer impairment plus unique Fang Gu; poisoned/duplicate/conflicting/stale/No Dashii/Vortox/other-Demon/unprovable adjacent states retain frozen results. | `DIRECT_CANONICAL_CAPABILITY_RESOLUTION_MATRIX` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `PURE_POLICY_SEAM` | exact supported variant only for frozen state; adjacent unchanged/fail closed | `PLANNED_SUPPORTING_AUTHORITY`: purpose accepted canonical prefix; status `ACCEPTED`; mutation `NONE`; consumer `C34`; does not decide primary |
| C35 | The newly supported capability is exercised by the real successful product chain. | Real `SubmitDreamerAction` frozen state produces accepted target/V7/settlement batch, receipt, append, rebuild, authorized private projection. | `REAL_ACCEPTED_CAPABILITY_GATED_COMMAND_STREAM` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `ACCEPTED_STREAM_INTEGRATION` | complete deterministic success | `PLANNED_SUPPORTING_AUTHORITY`: purpose direct C34 matrix corroborates only; status `ACCEPTED`; mutation `NONE`; consumer `C35`; does not decide primary |
| C36 | Adjacent unsupported capability states remain formal application failures. | Real `SubmitDreamerAction` adjacent unsupported states produce frozen retryable/rejected result, no committed V7/settlement, no receipt where receipt-free, no state/version mutation. | `REAL_ADJACENT_STATE_COMMAND_REJECTION_MATRIX` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | fail closed exact per-state contract | `PLANNED_SUPPORTING_AUTHORITY`: purpose C34 outputs are explanatory only; status `ACCEPTED`; mutation `NONE`; consumer `C36`; does not decide primary |
| C37 | Positive accepted-stream ledger attribution counts only base Dreamer. | Rebuild real accepted FALSE V7 stream derives exactly one fact `sourcePlayerId=ai-seat-01`, `ABNORMAL`, `SOURCE_DRUNKENNESS`, `causedByAnotherCharacterAbility=true`; Mathematician counts base Dreamer once, Philosopher zero, no double count. | `REAL_ACCEPTED_FALSE_LEDGER_ATTRIBUTION_STREAM` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `ACCEPTED_STREAM_INTEGRATION` | one base-Dreamer abnormal fact and one distinct-player contribution | `PLANNED_SUPPORTING_AUTHORITY`: purpose resolved evidence is semantic only and TRUE control corroborates zero; status `ACCEPTED`; mutation `NONE`; consumer `C37`; does not decide primary |
| C38 | Directly malformed ledger fact cannot substitute Philosopher, target, or other player for Dreamer source. | `validateFirstNightAbilityOutcomeFactShape` rejects real-derived fact with inconsistently replaced `sourcePlayerId` or source/task/ability/evidence cross-links; exception-safe. | `DIRECT_MALFORMED_LEDGER_SOURCE_CROSS_LINK_VALIDATION` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | malformed source substitution rejected | `PLANNED_SUPPORTING_AUTHORITY`: purpose valid real-derived fact seed; status `ACCEPTED`; mutation `CLONE_MUTATED`; consumer `C38`; does not decide primary |
| C39 | Coordinated persisted-history source or impairment substitution cannot survive replay. | From accepted V7 stream, cloned persisted delivery/provenance mutation substituting Philosopher, target, or other player for base-Dreamer source/count is rejected by replay/rebuild even if local shape links are coordinated. | `HOSTILE_PERSISTED_DREAMER_ATTRIBUTION_SUBSTITUTION_REPLAY` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `HOSTILE_REPLAY_REJECTION` | fail closed, no accepted fact/projection | `PLANNED_SUPPORTING_AUTHORITY`: purpose immutable accepted V7 seed; status `ACCEPTED`; mutation `PERSISTED_OR_IMPORTED_MUTATED`; consumer `C39`; does not decide primary |
| C40 | No committed delivery means no outcome fact or Mathematician contribution. | Real unsupported or fault-injected `SubmitDreamerAction` asserts formal failure, no V7, no settlement, unchanged state/version, exact receipt/retry contract, no V7 ledger fact, zero new contribution. | `REAL_NO_DELIVERY_APPLICATION_FAILURE_SEQUENCE` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | atomic mutation-free contribution-free | `PLANNED_SUPPORTING_AUTHORITY`: purpose accepted pre-command prefix plus ledger baseline; status `ACCEPTED`; mutation `NONE`; consumer `C40`; does not decide primary |

## 7. Expected Primary Mechanisms

### C34 — direct capability seam

The primary proof invokes the capability resolver exhaustively against the
canonical derived input matrix. It proves only resolver classification and
does not claim event production, receipt storage, append, replay, or projection.

### C35 — real accepted success

The primary proof begins at the real `SubmitDreamerAction` boundary and must
observe, in one coherent product chain:

```text
command
target/V7/settlement events
receipt
append
rebuild
authorized private projection
```

Direct resolver assertions may explain the result but cannot substitute for
this accepted-stream chain.

### C36 — adjacent formal failures

The primary proof begins at the same real application command boundary for
each adjacent unsupported state and checks its frozen retryable or rejected
contract, event absence, settlement absence, applicable receipt absence, and
unchanged state/version.

### C37 — positive ledger attribution

The primary proof starts from the real accepted FALSE V7 stream, rebuilds it,
derives the ledger, and proves exactly one base-Dreamer abnormal fact and one
distinct-player contribution. It does not prove hostile substitution rejection.

### C38 — direct malformed cross-link

The primary proof crosses the direct structural validation boundary with a
clone-mutated real-derived fact. Source and linked task/ability/evidence
inconsistency must be rejected exception-safely.

### C39 — coordinated persisted mutation

The primary proof mutates a cloned persisted or imported accepted V7 history
coherently enough to pass local shape checks, then requires full replay/rebuild
to reject the substituted attribution and produce no accepted fact/projection.

### C40 — real no-delivery failure

The primary proof uses a real unsupported or fault-injected command and proves
the complete atomic no-delivery contract, including no V7 ledger fact and zero
new Mathematician contribution.

## 8. Planned Supporting Authority

Every supporting item in C34–C40 is design-time only:

- purpose identifies why the supporting evidence is useful;
- status identifies the expected authority state;
- mutation identifies whether the supporting seed remains immutable or is
  deliberately altered;
- consumer identifies exactly one corrected criterion;
- supporting evidence never determines the primary layer, mechanism,
  reachability, trust, or result.

Stable future support identifiers using the `SUP-2B20A-` prefix may be assigned
only after implementation creates real executable evidence. This appendix
assigns no future support identifier and claims no executed test ownership.

## 9. Design-Time Field Boundary

Each corrected criterion contains exactly these nine design-time fields:

1. `CriterionId`
2. `RuleClaim`
3. `CompletionCriterion`
4. `RequiredEvidenceMechanism`
5. `ExpectedReachability`
6. `ExpectedTrust`
7. `ExpectedPrimaryLayer`
8. `ExpectedResult`
9. `SupportingAuthorityRequirement`

This appendix records expected design contracts only. It contains no
implementation-time test identity, physical owner binding, executed mechanism
match, run result, or post-implementation support identifier. Those records may
be created only by the future implementer and verified independently after a
design release pass.

## 10. Frozen Nonchanges

The correction does not change:

- BOTC rule semantics or source revisions;
- user overrides;
- resolved evidence or role coverage;
- the bounded accepted state;
- V7 version, exact 22-key payload, candidate model, deterministic selection,
  Fang Gu constraint, or reliability shape;
- `SubmitDreamerAction`, fingerprints, receipts, idempotency, target V2, V3
  opportunity, or the atomic target/V7/settlement batch;
- prospective validation, replay, persistence, or legacy V1–V6 compatibility;
- base-Dreamer ledger attribution, nine evidence variants, or Mathematician
  aggregation;
- player/AI projection shape or privacy;
- production/test allowlists or the `1000` added-production-LOC ceiling;
- explicit out-of-scope behavior, including poisoning, No Dashii, gained
  impairment, ineffective Vortox, other night, `FIRST_NIGHT → DAY`,
  nomination, voting, death, and Phase 2C.

Exact flags:

```text
behaviorDesignChanged=false
ruleSemanticsChanged=false
scopeChanged=false
overrideChanged=false
productionChanged=false
testsChanged=false
designRound=2
maxDesignRounds=2
```

## 11. Design Release Conditions

An independent read-only reviewer must read:

- the frozen Round 2 design and exact SHA;
- the complete Round 2 blocked review and exact SHA;
- this appendix;
- the governance ADR and review protocol;
- resolved rule evidence and role coverage matrix;
- all production and test files named by the frozen design.

The release reviewer must verify:

1. C02, C08, and C09 are inactive historical rows only.
2. The corrected active set is exactly
   `C01,C03-C07,C10-C33,C34-C40`.
3. C34–C40 each have exactly nine design-time fields.
4. Every corrected row has one primary mechanism, reachability, trust, layer,
   and result.
5. C34/C35/C36 close the C02 finding without conflating direct resolver,
   accepted success, and adjacent command failures.
6. C37/C38/C39 close the C08 finding without conflating positive attribution,
   direct malformed validation, and hostile persisted replay.
7. C40 closes the C09 finding at the real application boundary.
8. Planned supporting authority remains non-primary and design-time only.
9. No behavior, rule, scope, override, production, test, design round, or
   implementation authorization changed.

The only passing release verdict is:

```text
DESIGN_RELEASE_PASS
```

Until one complete independent release report returns that exact verdict:

```text
ruleReady=true
ruleDesignPass=false
designReleasePass=false
implementationAuthorized=false
```

No production or test implementation may begin, and no Design Round 3 may be
created or inferred.

APPENDIX_READY_FOR_DESIGN_RELEASE_REVIEW
