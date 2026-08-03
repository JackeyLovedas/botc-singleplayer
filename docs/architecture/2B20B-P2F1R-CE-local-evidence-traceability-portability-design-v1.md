# Phase 3 Slice 2B20B-P2F1R-CE — Local Evidence, Traceability and Portability Closure Design V1

## 1. Authorization

| Field | Frozen value |
|---|---|
| `sliceId` | `2B20B-P2F1R-CE` |
| `authorization` | `USER_AUTHORIZED_2B20B_P2F1R_CE_LOCAL_PRIMARY_EVIDENCE_TRACEABILITY_AND_CATALOG_PORTABILITY_CLOSURE` |
| `designBaseHead` | `95de2bac424a9cfa99dc7985f8eff01218a79c21` |
| `branch` | `phase-3/2b20b-p2f1r-ce-c-evidence-portability-closure` |
| `governanceReentry` | `docs/architecture/2B20B-P2F1R-CE-governance-reentry-after-d0-v1.md` |
| `governanceReentrySha256` | `3da1051d0e87199101c85e89b88c46e6a30181bcbad65e640bc72cf22da751f4` |
| `ruleEvidence` | `docs/rules/evidence/2B20B-P2F1R-CE.md` |
| `ruleEvidenceSha256` | `30dd9af61008298a6202bca0f4b7008d59b9ca8a8ecd95b2b10aaeb5e0df75fb` |
| `ruleVerdict` | `RULE_READY` |
| `ruleCoverageStatus` | `SKELETON` |
| `involvedRoles` | `[]` |
| `roleCoverageImpact` | `NONE` |
| `ruleSemanticsChanged` | `false` |
| `acceptedBehaviorChanged` | `false` |
| `productionBehaviorChanged` | `false` |
| `CEvidenceClosureRound` | `0/2` |
| `CComponentRepairRound` | `2/2 EXHAUSTED` |
| `StopLossOverride` | `1/1 EXHAUSTED` |
| `newCComponentRepairRoundCreated` | `false` |
| `newStopLossOverrideCreated` | `false` |
| `implementationAuthorized` | `false` |

This specification becomes implementation authority only after a fresh independent read-only reviewer returns `RULE_DESIGN_PASS` with `remainingBlockers=[]`. It does not itself supply that verdict.

## 2. Scope

CE closes exactly four evidence findings without changing C behavior:

| Finding | Owner | CE closure |
|---|---|---|
| `C-R2-F01_EXACT_ENVELOPE_EXECUTABLE_MATRIX_INCOMPLETE` | `CE_CALLABLE_EVIDENCE` | Complete the accepted 14-field public envelope matrix, including exact observation tuples, successful token readback, repeatability and nonleakage. |
| `C-R2-F02_CALLABLE_LEAF_MECHANISM_MATCH_FALSE` | `CE_CALLABLE_EVIDENCE` | Bind all 31 callable leaves to frozen real public entries and authentic C1 roots, with complete diagnostics, observations, coordinates and repeat equality. |
| `C-R2-F04_STATIC_LEAF_EVIDENCE_INCOMPLETE` | `CE_STATIC_EVIDENCE` | Replace whole-file regex evidence with a declaration- and branch-scoped TypeScript AST audit for all 16 static leaves. |
| `C-R2-F05_TRACEABILITY_AND_SUPPORT_PROVENANCE_INVALID` | `CE_TRACEABILITY` | Materialize real AP1 canonical Vitest identities, exact production symbol bindings, legal primary ownership and legal support provenance. |

D0 already closed the separate Catalog checkout-portability prerequisite. CE re-executes that accepted D0 mechanism at the final CE candidate HEAD in both required clean worktrees; CE does not redesign or modify D0.

The exact current census is frozen as:

- diagnostic leaves: `47`;
- public contexts: `34`;
- public codes: `19`;
- callable leaves: `31`;
- static-only leaves: `16`;
- C traceability rows: `33`;
- grouping rows: `5`;
- active rows: `28`.

## 3. Non-goals

CE does not:

- change C production behavior or public runtime shapes;
- create C Component Repair Round 3 or Stop-Loss Override 2;
- modify A, B, C1, event definitions, semantic validators, replay, batch, snapshot, state, application, projection, receipts or roles;
- change the 40 event types, 59 payload branches, 15 AST node kinds, 34 contexts, 19 codes or 47 leaf policies;
- reopen F20 or change its precedence;
- change B26, B54, the C1 AST, Catalog generation, Catalog V2 content or any expected digest;
- make Catalog V2 or any digest runtime, semantic, replay, history or rule authority;
- use `validateDomainEventStructuralNodeForTest` or a synthetic AST authority as callable primary evidence;
- create a new test-identity protocol;
- change a Vitest project, suite or title;
- alter ownership, coverage, workflow, package scripts, `.gitattributes`, global runner totals or Git configuration;
- run coverage, ownership publication, hosted CI or P2F1R-D;
- promote any role coverage status.

## 4. Frozen C production hashes

`FROZEN_C_BEHAVIOR_SOURCE_V1` is the exact canonical Git-blob/LF byte identity:

| File | SHA-256 |
|---|---|
| `packages/domain-core/src/canonical-domain-event.ts` | `41020fbbc0cc23194c565c2b0ace5ce907942e86204e8373b29449a94b07a5b3` |
| `packages/domain-core/src/domain-event-structural-validator.ts` | `a7d7cd0294c877317ba35957f957859fda586c459aeec40a361fb8853d1531e6` |
| `packages/domain-core/src/index.ts` | `ac142d2c83a77c73aae244dc2bd3d6da9e7f01ca923fff4d22139ed10c024353` |

The implementer must verify these hashes before the first edit, before each local gate series, before review and at final freeze. Any mismatch or any evidence requirement that needs a production edit is `HUMAN_BLOCKED`.

## 5. Finding map

| Finding | Exact defect | Product defect | Correct mechanism | Stop condition |
|---|---|---:|---|---|
| F01 | Existing 84 executions omit accepted-value token readback and complete per-row observation/repeat/nonleak checks. | No | Strengthen existing C-C02 through the frozen observed public entry and authentic token reader. | Any accepted-language change is required. |
| F02 | Existing C-C15b gathers leaf IDs but does not prove each full tuple; C-C15c uses a synthetic node seam. | No | One frozen 31-row public matrix plus public-root tagged-coordinate assertions. | A callable leaf cannot be reached through a frozen formal public or formally equivalent entry. |
| F04 | Broad source regex can be satisfied outside the named declaration and does not prove exact branch/return/order. | No | C-only TypeScript AST audit with an adversarial self-test. | Audit needs a production hook or source modification. |
| F05 | All 28 recorded identities omit the ancestor path; five support rows use illegal enums/prose; several symbol bindings are global-text matches. | No | AP1 canonical inventory, one-primary audit, declaration-scoped symbol audit, legal `NONE`/SUP mapping. | A real active criterion lacks a valid primary mechanism. |
| Catalog portability | Former worktree CRLF comparison failed. | No | Reuse D0’s fixed `HEAD:path` blob mechanism and dual-worktree gates. | D0 regression fails or canonical bytes differ. |

## 6. Callable evidence model

### 6.1 Allowed formal entries

Callable primary evidence may use only:

- `validateDomainEventStructureWithObservationForTest` for an unknown input entering the real capture and C validation path;
- `validateCapturedDomainEventStructureWithObservationForTest` solely for the authentic formal captured-token entry and its forged-token rejection;
- `readStructurallyValidatedDomainEvent` for the F33 structural-token consumer;
- `readStructurallyValidatedDomainEvent` after a successful validation to prove accepted envelope values are preserved.

The observation wrappers are frozen formal test equivalents of the public validator. No module-private traversal helper is primary evidence.

### 6.2 Callable row contract

Each of the 31 rows is a literal record containing:

- `leafId`;
- `publicContextId`;
- `entry`;
- exact input-construction recipe;
- authentic C1 `eventBranchOrdinal` and mutation path when applicable;
- expected complete diagnostic:
  `code`, `phase`, `path`, `safeSummary`,
  `quarantineRecommended`, `retryability`,
  `taggedUnionCoordinate`, `failClosed=true`;
- expected complete 15-field observation, or the explicit F33 `ZERO` policy where no observation API exists;
- expected policy `payloadReadBudget`;
- exact nonleak sentinels;
- equality of two independent executions;
- the one canonical primary test identity.

Expected data must be authored as literal case authority. A test must not derive expected diagnostics or observations from the result under test.

### 6.3 Frozen 31-row callable inventory

Observation abbreviation:

```text
A=authorityChecked
C=captureEntered
K=envelopeKeySetChecked
P=payloadKeyPresenceChecked
p=payloadKeyPresent
N=payloadNodeAcquired
T=astTraversalEntered
B=validatedBackingConstructed
I=tokenIssued
```

All omitted counters are zero. All rows require repeat equality and no raw input, secret literal, source node ID, stack, message or payload value in the public diagnostic.

| Leaf | Exact entry/input | Code / phase | Exact path | Reads (`envelope,eventType,eventVersion,discriminator,content`) and flags | Coordinate |
|---|---|---|---|---|---|
| L02 | observed unknown entry; `undefined` | `CAPTURE_REJECTED / CAPTURE` | empty | `0,0,0,0,0`; `AC` | null |
| L03 | observed unknown entry; null-prototype object with enumerable getter `category` | `CAPTURE_REJECTED / CAPTURE` | `CAPTURE_OBJECT_KEY_ORDINAL:0` | `0,0,0,0,0`; `AC`; getter calls `0` | null |
| L05 | observed captured entry; forged `{}` token | `INVALID_CAPTURE_TOKEN / BACKING_AUTHENTICATION` | empty | `0,0,0,0,0`; `A` | null |
| L07 | observed unknown entry; `null` | `INVALID_ENVELOPE / ENVELOPE` | empty | `0,0,0,0,0`; `AC` | null |
| L08 | root 1 envelope, delete payload | `MISSING_REQUIRED_FIELD / ENVELOPE` | `ENVELOPE_FIELD_ORDINAL:14` | `0,0,0,0,0`; `ACKP`, `p=false` | null |
| L09 | root 1 envelope plus `extra:true` | `EXTRA_FIELD / ENVELOPE` | `ENVELOPE_EXTRA_ENTRY_ORDINAL:11` | `0,0,0,0,0`; `ACKPp` | null |
| L10 | root 1; `eventSequence:"1"` | `INVALID_FIELD_TYPE / ENVELOPE` | `ENVELOPE_FIELD_ORDINAL:4` | `4,0,0,0,0`; `ACKPp` | null |
| L11 | root 1; `category:"audit"` | `INVALID_FIELD_VALUE / ENVELOPE` | `ENVELOPE_FIELD_ORDINAL:1` | `1,0,0,0,0`; `ACKPp` | null |
| L12 | root 1; `eventType:"FutureEvent"` | `UNKNOWN_EVENT_TYPE / EVENT_DISPATCH` | `ENVELOPE_FIELD_ORDINAL:7` | `13,1,0,0,0`; `ACKPp` | null |
| L13 | root 1; `eventVersion:2` | `UNSUPPORTED_EVENT_VERSION / VERSION_DISPATCH` | `ENVELOPE_FIELD_ORDINAL:8` | `13,1,1,0,0`; `ACKPp` | null |
| L14 | root 1; payload string | `INVALID_FIELD_TYPE / PAYLOAD_ACQUISITION` | `ENVELOPE_FIELD_ORDINAL:14` | `13,1,1,0,0`; `ACKPpN` | null |
| L15 | root 11; remove `opportunityKind` | `INVALID_PAYLOAD_DISCRIMINANT / PAYLOAD_DISCRIMINANT` | `ENVELOPE_FIELD_ORDINAL:14 / PAYLOAD_DISCRIMINANT_ORDINAL:2` | `13,1,1,2,0`; `ACKPpN` | null |
| L16 | root 11; `opportunityKind:{}` | same as L15 | same as L15 | `13,1,1,2,0`; `ACKPpN` | null |
| L17 | root 11; `opportunityKind:"FUTURE"` | same as L15 | same as L15 | `13,1,1,2,0`; `ACKPpN` | null |
| L26 | root 1; remove `aiPlayerCount` | `MISSING_REQUIRED_FIELD / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:1` | `13,1,1,0,0`; `ACKPpNT` | null |
| L28 | root 1; add root `__c_extra` | `EXTRA_FIELD / AST_TRAVERSAL` | `PAYLOAD_EXTRA_ENTRY_ORDINAL:1` | `13,1,1,0,0`; `ACKPpNT` | null |
| L30 | root 1; `gameId` base becomes object | `INVALID_FIELD_TYPE / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:2` | `13,1,1,0,2`; `ACKPpNT` | null |
| L32 | root 2; mutate `edition` literal | `INVALID_FIELD_VALUE / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:1` | `13,1,1,0,1`; `ACKPpNT` | null |
| L34 | root 11; invalid `visibility.futureUnsupportedDecisionKinds` cardinality | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:12 / PAYLOAD_FIELD_ORDINAL:2` | `13,1,1,2,20`; `ACKPpNT` | null |
| L39 | root 10; zero-match closed-union at `taskCatalogSnapshot.definitions[0]` | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:10 / PAYLOAD_FIELD_ORDINAL:1 / ARRAY_INDEX:0` | `13,1,1,0,12`; `ACKPpNT` | null |
| L41 | root 1; blank refined `gameId` | `INVALID_REFINEMENT / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:2` | `13,1,1,0,2`; `ACKPpNT` | null |
| L27 | root 20; remove `abilitySource<1>.abilityRoleId` | `MISSING_REQUIRED_FIELD / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:2 / UNION_BRANCH_ORDINAL:1 / PAYLOAD_FIELD_ORDINAL:1` | `13,1,1,3,2`; `ACKPpNT` | branch `20`, node `161`, tagged path field `2`, field entry `3`, `KNOWN_VARIANT`, variant `1` |
| L29 | root 20; add `abilitySource<1>.__c_extra` | `EXTRA_FIELD / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:2 / UNION_BRANCH_ORDINAL:1 / PAYLOAD_EXTRA_ENTRY_ORDINAL:1` | `13,1,1,3,2`; `ACKPpNT` | branch `20`, node `161`, tagged path field `2`, field entry `5`, `KNOWN_VARIANT`, variant `1` |
| L31 | root 20; wrong kind at `abilitySource<1>.grantId` base | `INVALID_FIELD_TYPE / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:2 / UNION_BRANCH_ORDINAL:1 / PAYLOAD_FIELD_ORDINAL:3` | `13,1,1,3,5`; `ACKPpNT` | branch `20`, node `161`, tagged path field `2`, field entry `4`, `KNOWN_VARIANT`, variant `1` |
| L33 | root 20; mutate `abilitySource<1>.abilityRoleId` literal | `INVALID_FIELD_VALUE / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:2 / UNION_BRANCH_ORDINAL:1 / PAYLOAD_FIELD_ORDINAL:1` | `13,1,1,3,3`; `ACKPpNT` | branch `20`, node `161`, tagged path field `2`, field entry `4`, `KNOWN_VARIANT`, variant `1` |
| L35 | root 53; empty `sourceEffectiveness<1>.representedImpairmentIds` | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:20 / UNION_BRANCH_ORDINAL:1 / PAYLOAD_FIELD_ORDINAL:2` | `13,1,1,0,93`; `ACKPpNT` | branch `53`, node `336`, tagged path field `20`, field entry `1`, `KNOWN_VARIANT`, variant `1` |
| L42 | root 20; blank `abilitySource<1>.grantId` | `INVALID_REFINEMENT / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:2 / UNION_BRANCH_ORDINAL:1 / PAYLOAD_FIELD_ORDINAL:3` | `13,1,1,3,5`; `ACKPpNT` | branch `20`, node `161`, tagged path field `2`, field entry `4`, `KNOWN_VARIANT`, variant `1` |
| L36 | root 20; remove `abilitySource.kind` | `INVALID_PAYLOAD_STRUCTURE / AST_TRAVERSAL` | `PAYLOAD_FIELD_ORDINAL:2` | `13,1,1,3,1`; `ACKPpNT` | branch `20`, node `161`, tagged path field `2`, `field=null`, `MISSING_DISCRIMINANT` |
| L37 | root 20; `abilitySource.kind={}` | same code/phase/path as L36 | same | `13,1,1,3,2`; `ACKPpNT` | branch `20`, node `161`, field entry `4`, `INVALID_DISCRIMINANT_TYPE` |
| L38 | root 20; `abilitySource.kind="__C_UNKNOWN_TAG__"` | same code/phase/path as L36 | same | `13,1,1,3,2`; `ACKPpNT` | branch `20`, node `161`, field entry `4`, `UNKNOWN_DISCRIMINANT_VALUE` |
| L46 | `readStructurallyValidatedDomainEvent({})` | `INVALID_STRUCTURAL_TOKEN / TOKEN_CONSUMPTION` | empty | policy budget `ZERO`; no observation API | null |

For every row, `safeSummary`, quarantine and retryability must equal the frozen leaf/context policy. C-C15b must assert the entire row, not only the leaf set. C-C15c must use the nine real-public-authority tagged rows above and may not retain its synthetic authority as primary evidence.

## 7. Static evidence model

Freeze these paths:

- verifier: `scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs`;
- self-test: `scripts/verify-p2f1r-c-static-diagnostic-bindings.test.mjs`.

The verifier uses the installed TypeScript compiler API. Regex or substring presence is not an acceptance mechanism.

For each binding it must:

1. parse the exact frozen source file;
2. resolve one named top-level declaration;
3. resolve the exact branch node within that declaration;
4. prove the leaf constant binds the expected literal;
5. prove the leaf policy row binds the expected context, evidence kind, read-budget policy and exact source binding;
6. prove the branch’s returned/assigned diagnostic is the expected leaf;
7. prove required predecessor/successor ordering;
8. reject fallthrough or catch-all substitution;
9. prove the leaf has `STATIC_BRANCH_BINDING`, not callable primary;
10. report mapped, missing, duplicate, orphan, invalid-symbol, invalid-policy and invalid-return counts.

The self-test mutates in-memory source fixtures to prove rejection of:

- matching text outside the named declaration;
- missing, moved or duplicate branch;
- wrong leaf or context;
- wrong return/assignment;
- branch fallthrough;
- extra F34 catch;
- removed F34 catch;
- policy changed to callable;
- wrong read budget;
- reordered F20 guards.

No self-test may edit a repository file or expose a production hook.

## 8. Envelope executable matrix

The exact envelope order remains:

1. `category`
2. `eventId`
3. `gameId`
4. `eventSequence`
5. `batchId`
6. `gameVersion`
7. `eventType`
8. `eventVersion`
9. `rulesBaselineVersion`
10. `commandId`
11. `createdAt`
12. `correlationId`
13. `causationId`
14. `payload`

Each logical row has:

```text
field, ordinal, caseKind, applicable, exactInput, expectedAcceptance,
expectedDiagnostic, expectedPath, expectedObservation, expectedReadback
```

The logical `14 × 6` grid has:

- applicable cells: `77`;
- explicitly skipped non-applicable cells: `7`;
- supplementary boundary vectors: `6`;
- actual execution vectors: `83`.

The seven N/A cells are:

- `empty` and `whitespace` for each of
  `eventSequence`, `gameVersion`, `eventVersion`;
- `whitespace` for payload.

They must be recorded as N/A and not executed or counted as structural-language evidence.

Field policy:

| Field family | Applicable cases |
|---|---|
| `category` | missing, null, empty, whitespace, wrong primitive, valid literal `domain`; supplementary wrong string literal `audit` |
| six nonblank IDs | missing, null, empty, whitespace, wrong primitive, valid whitespace-bearing string |
| `eventSequence`, `gameVersion` | missing, null, wrong primitive, valid; the valid cell expands to `-1`, `0`, `1` and must preserve all three |
| `eventType` | missing, null, empty, whitespace, wrong primitive, known value |
| `eventVersion` | missing, null, wrong primitive, supported `1`; supplementary unsupported `2` |
| `rulesBaselineVersion` | missing, null, empty accepted, whitespace accepted, wrong primitive, normal string accepted |
| `createdAt` | missing, null, empty accepted, whitespace accepted, wrong primitive, normal string accepted |
| `payload` | missing, null, empty exact record reaching AST, wrong primitive, authentic object; whitespace is N/A |

Every successful vector must:

- run through `validateDomainEventStructureWithObservationForTest`;
- produce an authentic C token;
- be read with `readStructurallyValidatedDomainEvent`;
- preserve the exact original accepted primitive value, including leading/trailing whitespace;
- never trim-write-back or date-parse;
- return an identical result and observation on repeat.

Every failure vector must assert the complete diagnostic and observation. No broad “fails” assertion substitutes for the row expectation.

## 9. Diagnostic leaf matrix

The frozen diagnostic census remains:

- `47/47` leaf IDs unique;
- `34/34` public contexts unique;
- `19/19` public codes;
- `31/31` callable;
- `16/16` static;
- orphan leaves `0`;
- duplicate bindings `0`;
- missing evidence `0`.

The 16 static rows are:

| Leaf | Source | Declaration and exact branch |
|---|---|---|
| L01 | validator | `admitC1Authority`: unhealthy result returns `unhealthyAdmission()` before any consumption |
| L04 | validator | `translateCaptureFailure`: exact `INTERNAL_SERIALIZATION_FAILURE` case returns `failure(F04)` |
| L06 | validator | `validateCapturedInternal`: backing-authentication failure’s non-`INVALID_CAPTURE_TOKEN` branch returns F06 |
| L18 | validator | `selectBranch`: no matched branch returns F18 at the current discriminator path |
| L19 | validator | `selectBranch`: match count greater than one returns F19 before a root is selected |
| L20 | validator | `traverseNode`: missing schema lookup returns F20 at current path |
| L21 | validator | `traverseNode`: missing AST ordinal returns `F20_NODE_ORDINAL` at current path |
| L22 | validator | `validateCapturedInternal`: unsafe/out-of-range event branch ordinal returns `F20_EVENT_BRANCH` before AST entry |
| L23 | validator | `traverseNode`: tagged branch ordinal mismatch returns `F20_TAGGED_VARIANT` before discriminator read/coordinate/child/F26 |
| L24 | validator | `traverseNode`: failed tagged field-coordinate construction returns `F20_TAGGED_FIELD` |
| L25 | validator | `traverseNode`: tagged literal match count greater than one returns `F20_TAGGED_MULTIPLE` |
| L40 | validator | `traverseNode`: closed-union match count greater than one returns F28; it is not a tagged-union fallback |
| L43 | validator | `executeRefinement`: invalid refinement metadata returns F30 before semantic read |
| L44 | validator | `validateCapturedInternal`: detached backing construction catch returns F31 |
| L45 | canonical domain event | `issueStructurallyValidatedDomainEvent`: issuer catch returns the exact L45 diagnostic |
| L47 | validator | exact outer-catch set of `validateDomainEventStructure`, `validateCapturedDomainEventStructure`, `validateDomainEventStructureWithObservationForTest`, and `validateCapturedDomainEventStructureWithObservationForTest`; exactly four F34 containment branches, no additional branch |

The audit additionally freezes all six L20–L25 guards as separate ordered branches and proves L47 cannot satisfy another row.

## 10. Canonical Vitest identity model

The only semantic identity is the accepted AP1 tuple:

```text
[project, canonicalRepositoryRelativeFile, ancestorPath, title]
```

Inventory generation must use an existing public Vitest lifecycle or existing candidate-list inventory and the accepted utilities in `scripts/vitest-ownership-contracts.mjs`:

- `canonicalizeRawVitestInventory` or
  `canonicalizeStructuredVitestIdentities`;
- `structuredInventoryBytes`;
- `structuredInventorySha256`.

The target inventory is collected, not hand-authored. The collected target identities must have:

```text
project = "domain-core"
file = "packages/domain-core/src/domain-event-structural-validator.test.ts"
ancestorPath = ["P2F1R-C domain event structural validation"]
```

The implementation records the complete target inventory SHA-256. It must reject missing, duplicate, unexpected or ambiguous identities.

No Vitest suite/title is added or changed. The 28 active C identities remain 28. Static C-C15d uses the protocol-approved executable static mechanism instead of pretending that its former broad-regex Vitest assertion is the primary branch proof; its existing Vitest title may self-test integration but cannot replace the static verifier.

## 11. Traceability V1.1 materialization

The C traceability document remains:

- total rows: `33`;
- grouping rows: `5`;
- active rows: `28`.

Grouping IDs remain:

- `C-C03`
- `C-C06`
- `C-C09`
- `C-C12`
- `C-C15`

Grouping rows contain only the nine design-time fields. They have no physical primary, do not compete with children and do not claim `MechanismMatch=PASS`.

Every active row contains the exact nine design fields:

- `CriterionId`
- `RuleClaim`
- `CompletionCriterion`
- `RequiredEvidenceMechanism`
- `ExpectedReachability`
- `ExpectedTrust`
- `ExpectedPrimaryLayer`
- `ExpectedResult`
- `SupportingAuthorityRequirement`

and the exact implementation bindings:

- `ActualTestFile`
- `ActualTestTitle`
- `ActualPrimaryLayer`
- `ActualReachability`
- `ActualTrust`
- `SupportingAuthorityId`
- `MechanismMatch`

It also records actual main assertion, production entry and fault mechanism.

Required mapping corrections:

- C-C02: complete 83-vector envelope mechanism;
- C-C15b: complete 31-row callable matrix;
- C-C15c: real public C1-root coordinate mechanism;
- C-C15d: executable TypeScript AST verifier as primary;
- C-C15a: semantic traceability parser/audit, not source grep;
- all other active rows: collected canonical identity and declaration-scoped actual symbol binding.

Final semantic audit requires:

- active criteria `28`;
- unique primary mechanisms `28`;
- duplicate primary `0`;
- borrowed primary `0`;
- missing primary `0`;
- invalid symbol binding `0`;
- invalid Vitest identity `0`;
- invalid supporting authority `0`;
- `MechanismMatch=PASS` exactly `28/28`;
- `R1=[]`;
- `R2=[]`.

A row stays `FAIL` until its real primary evidence passes.

## 12. Supporting Authority provenance

The five current support records are invalid and must not be renamed into false authority.

Design disposition:

- design/review/governance documents are not accepted, legacy or hostile test/fixture support;
- A and C1 test suites do not become C primary evidence;
- the C public tests directly exercise the frozen A/C1 runtime contracts and therefore do not require a SUP row merely because those modules are dependencies;
- D0 remains the primary owner of C1-C11 Catalog portability and is not borrowed as a C primary;
- REVIEW_PROTOCOL is governance, not `SUP-*`.

The default C active-row value is therefore `SupportingAuthorityId=NONE`.

A SUP record may be retained only if an exact existing accepted/legacy/hostile test or fixture is actually necessary. Such a record must contain:

- `SUP-<slice-or-task>-NNN`;
- exact producer;
- exact file and physical test/fixture identity;
- `AuthorityStatus=ACCEPTED|LEGACY|HOSTILE`;
- consuming criteria;
- `MutationDisposition=NONE|CLONE_MUTATED|PERSISTED_OR_IMPORTED_MUTATED`.

No planned or future D evidence receives a final SUP ID in CE. Final invalid support count must be zero.

## 13. Catalog local portability evidence

CE reuses the already reviewed D0 contract unchanged:

| Fact | Frozen value |
|---|---|
| Catalog path | `docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md` |
| Git blob OID | `4f9a376e56f19b241d76ce2a75be83b70859ae25` |
| raw/generated length | `264855` |
| raw/generated SHA-256 | `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` |
| default checkout SHA-256 | `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7` |
| default classification | `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY` |
| LF classification | `MATCHES_REPOSITORY_BLOB` |
| Catalog runtime authority | `false` |

CE does not modify the D0 test. At the final CE candidate HEAD it must prove:

- `HEAD:path` still resolves the exact blob;
- Git raw blob equals in-memory generated bytes exactly;
- default worktree is either exact or the sole accepted LF-to-CRLF diagnostic conversion;
- LF worktree equals the blob;
- both focused Catalog suites pass 21/21;
- Catalog and digest remain audit-only.

D0’s C1-C11 identity remains its sole primary. CE records this as a prerequisite/local gate, not as a new competing C traceability primary.

## 14. Default/LF worktree test contract

After the implementation commit, create two new clean detached worktrees from the same exact CE candidate HEAD:

1. default Windows checkout using ordinary repository policy;
2. LF checkout using command-scoped, nonpersistent
   `-c core.autocrlf=false -c core.eol=lf`.

For both record:

- exact absolute path;
- HEAD;
- `git status --short`;
- Node and pnpm versions;
- `core.autocrlf` value and source;
- `git ls-files --eol` for Catalog;
- Catalog worktree SHA and line-ending census;
- raw blob OID/SHA;
- generated SHA;
- focused results and full ordinary result.

Both must remain clean, resolve the same HEAD and naturally pass. No tracked file may be normalized or rewritten to prepare a gate.

The protected old dirty C worktree is not either evidence worktree and must retain all 11 entries and all 11 hashes.

## 15. Production/test/doc allowlist

Production changes: exactly `0`.

Allowed implementation files:

- `packages/domain-core/src/domain-event-structural-validator.test.ts`;
- `docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md`;
- `scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs`;
- `scripts/verify-p2f1r-c-static-diagnostic-bindings.test.mjs`;
- CE design-review, implementation-status and review documents.

No new test fixture is authorized by this design.

Forbidden:

- the three frozen C production files;
- A/B/C1 files;
- event definitions and semantic validators;
- replay, batch, snapshot, state, application and role code/tests;
- Catalog generator, generated Catalog or expected digest;
- D0 test;
- ownership, coverage, workflow, package scripts, dependencies and `.gitattributes`;
- agent-loop control files;
- protected old worktree.

## 16. Local acceptance gates

At the final candidate HEAD, in both clean worktrees where applicable:

1. static verifier self-test passes;
2. real-source static audit reports `16 mapped`, all error counts zero;
3. 31-row callable matrix passes;
4. nine real-public tagged-coordinate rows pass;
5. envelope audit reports `14 fields`, `77 applicable logical cells`, `7 N/A`, `6 supplementary vectors`, `83 executions`;
6. diagnostic totality reports `47/34/19/31/16`;
7. traceability parser reports `33/5/28`;
8. traceability semantic audit reports 28 unique valid primaries and all invalid/duplicate/borrowed/missing counts zero;
9. AP1 identity inventory audit passes and records SHA;
10. focused `domain-event-structural-validator.test.ts` passes;
11. D0 focused Catalog test passes `21/21`;
12. domain-core tests pass, expected current baseline `20 files / 503 tests`;
13. `pnpm typecheck` passes;
14. `pnpm lint` passes;
15. `pnpm test` passes, expected current baseline `40 files / 1712 tests` unless the reviewed identity inventory proves an authorized evidence-only count change;
16. event census `40/40`;
17. payload branch census `59/59`;
18. AST kind census `15/15`;
19. all three frozen C production hashes match;
20. A/B/C1, event definitions and semantic validators are unchanged;
21. protected old worktree remains `11/11`.

A test-count change caused only by an unauthorized new Vitest title is a blocker. No coverage, ownership, hosted CI or D command is run.

## 17. Deferred D evidence

CE does not close:

- ownership registry publication;
- routing;
- coverage profile;
- hosted Windows/Linux execution;
- exact-head GitHub CI;
- PR publication review;
- combined A/B/C1/C publication;
- final Catalog SHA reconciliation for release;
- PR, merge, tag or acceptance.

Successful CE status is only:

```text
LOCAL_COMPONENT_TECHNICALLY_CLOSED_PENDING_P2F1R_D_PUBLICATION_EVIDENCE
```

`CFinalAccepted=false`.

## 18. CE evidence correction budget

Before implementation:

```text
CEvidenceClosureRound=0/2
```

The first edit to a C test, C traceability document or static evidence script sets:

```text
CEvidenceClosureRound=1/2
```

If the independent Code Review returns `CODE_REVIEW_FIX_REQUIRED` and every finding is confined to:

- test evidence;
- traceability;
- static audit;
- local portability evidence;

one final bounded repair is allowed:

```text
CEvidenceClosureRound=2/2
```

All gates must rerun on the new HEAD, followed by a fresh review. There is no round 3.

A docs-only design correction is a separate design-review budget: one correction and one fresh rereview are allowed after the first bounded `RULE_DESIGN_FIX_REQUIRED`; a second failed design review stops.

## 19. Stop-Loss

Immediately return `HUMAN_BLOCKED` if:

- any frozen C production hash changes;
- A, B, C1, an event definition or semantic validator must change;
- the accepted 14-field language or diagnostic output must change;
- a callable leaf lacks a real public/formally equivalent entry;
- static proof requires a new production hook;
- the 47/31/16 or 33/5/28 census changes without a separately reviewed design correction;
- Catalog raw/generated bytes differ;
- D0 no longer passes in either worktree;
- identity collection requires a new protocol or a title/suite/project change;
- any active criterion lacks a unique primary;
- invalid SUP provenance cannot be removed without a false claim;
- the old dirty worktree cannot be preserved;
- either worktree becomes dirty or differs in HEAD;
- correction budgets are exhausted;
- a reviewer returns `HUMAN_BLOCKED`;
- independent Rule Review does not pass after Code Review.

Rollback is a normal non-history-rewriting revert of CE-only test, traceability, script and CE documentation changes. It must not reset, clean, amend, rebase, rewrite history or touch the protected worktree. Rollback does not constitute CE success.

## 20. Independent design review

A fresh independent read-only reviewer must independently read:

- all mandatory external rule sources or their fixed approved evidence;
- `docs/rules/evidence/2B20B-P2F1R-CE.md`;
- official nightsheet;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`;
- CE governance and failure audit;
- D0 design, traceability and final evidence;
- C recovery design chain;
- the frozen production files;
- C test and traceability;
- AP1 identity utilities;
- REVIEW_PROTOCOL.

It must check:

1. C production is byte-frozen;
2. F01/F02/F04/F05 remain evidence-only;
3. all 31 callable rows use real allowed entries;
4. all complete diagnostics, observations, coordinates, repeatability and nonleak obligations are frozen;
5. all 16 static rows have executable declaration/branch-scoped proof;
6. the 14-field matrix preserves the accepted language and records N/A honestly;
7. AP1 identities are collectable rather than hand-authored;
8. one primary per active criterion is enforceable;
9. the 33/5/28 traceability materialization conforms to V1.1;
10. support provenance is legal and D is not borrowed;
11. D0 portability remains exact-byte evidence without becoming runtime authority;
12. both clean worktrees can pass full ordinary at the same HEAD;
13. the allowlist has zero production changes;
14. stop-loss and correction budgets are enforceable;
15. no role, rule, event, replay, history, projection or semantic behavior is changed.

Allowed design verdicts are only:

- `RULE_DESIGN_PASS`
- `RULE_DESIGN_FIX_REQUIRED`
- `HUMAN_BLOCKED`

Implementation remains forbidden until the independent reviewer returns `RULE_DESIGN_PASS` and `remainingBlockers=[]`.

```text
designReady=true
remainingDesignBlockers=[]
implementationAuthorized=false
requiredNextAction=FRESH_INDEPENDENT_CE_RULE_DESIGN_REVIEW
```
