# Phase 3 Slice 2B20B-P2F1R-CE Failure Audit

## 1. Audit identity

- `sliceId`: `2B20B-P2F1R-CE`
- `authorization`: `USER_AUTHORIZED_2B20B_P2F1R_CE_LOCAL_PRIMARY_EVIDENCE_TRACEABILITY_AND_CATALOG_PORTABILITY_CLOSURE`
- `auditHead`: `54d95e88398271e596e366cdec635a1aed82b384`
- `auditBranch`: `phase-3/2b20b-p2f1r-ce-c-evidence-portability-closure`
- `auditBase`: `54d95e88398271e596e366cdec635a1aed82b384`
- `parentStageHead`: `52ab1e483328cb05a16606a7d1976dc4e378b038`
- `CImplementationBase`: `7fc337325f274c669a356a30c7485e2fdf134643`
- `CComponentRepairRound`: `2/2 EXHAUSTED`
- `StopLossOverride`: `1/1 EXHAUSTED`
- `newCComponentRepairRoundCreated`: `false`
- `newStopLossOverrideCreated`: `false`
- `CEvidenceClosureRound`: `0/2`
- `codeReviewOnly`: `true`
- `ruleReviewStatus`: `NOT_RUN_CODE_REVIEW_ONLY`

This audit materializes the complete independent review evidence that postdates
the reviewed commits. The review output could not already be content of the
HEAD it reviewed. Its provenance is the complete independent reviewer output,
not a controller reconstruction. This document makes no code or rule verdict.

## 2. Site and history audit

The clean CE worktree was created from exact C candidate HEAD
`54d95e88398271e596e366cdec635a1aed82b384`.

The relevant commit chain is:

1. `7fc337325f274c669a356a30c7485e2fdf134643` — C implementation base;
2. `6bcfcb4` — recovery design;
3. `f0cd35e` — C implementation;
4. `57a14cc` — Repair Round 1;
5. `d58ce58` — recovery design diagnostics;
6. `04fa689` — diagnostic-leaf design correction V3;
7. `68f9c2e` — V3 independent design-review archive;
8. `52ab1e483328cb05a16606a7d1976dc4e378b038` — Repair Round 2;
9. `54d95e88398271e596e366cdec635a1aed82b384` — frozen-contract Stop-Loss implementation.

The C behavior diff from the C implementation base contains only the authorized
C architecture, implementation evidence, three C production files, the C test,
and the necessary named export. The focused Stop-Loss delta
`52ab1e4..54d95e8` contains exactly:

- `docs/implementation/phase-3-slice-2b20b-p2f1r-c-frozen-contract-restoration-evidence-stop-loss-override-v1.md`;
- `docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md`;
- `packages/domain-core/src/domain-event-structural-validator.test.ts`;
- `packages/domain-core/src/domain-event-structural-validator.ts`.

The CE worktree was clean before this audit. No pre-existing CE draft existed.

## 3. Frozen C production bytes

These SHA-256 values form `FROZEN_C_BEHAVIOR_SOURCE_V1`:

| File | SHA-256 |
|---|---|
| `packages/domain-core/src/canonical-domain-event.ts` | `41020fbbc0cc23194c565c2b0ace5ce907942e86204e8373b29449a94b07a5b3` |
| `packages/domain-core/src/domain-event-structural-validator.ts` | `a7d7cd0294c877317ba35957f957859fda586c459aeec40a361fb8853d1531e6` |
| `packages/domain-core/src/index.ts` | `ac142d2c83a77c73aae244dc2bd3d6da9e7f01ca923fff4d22139ed10c024353` |

All three values are SHA-256 digests of the exact `54d95e8` Git blob/LF
canonical bytes, not default Windows CRLF working-tree bytes.

CE is not authorized to change any byte in these files. A need to change one of
them is `HUMAN_BLOCKED`, not evidence closure.

The following remain outside CE and unchanged:

- A, B, and C1;
- event definitions;
- semantic validators;
- replay, batch, snapshot, state, and application code;
- ownership, coverage, workflow, and agent-loop controls.

## 4. Protected old unaccepted C worktree

The protected worktree is:

`C:\Users\wjl\Documents\血染钟楼`

It remains at branch
`phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`, HEAD
`7fc337325f274c669a356a30c7485e2fdf134643`, with exactly 11 dirty entries.

| # | Path | SHA-256 |
|---:|---|---|
| 1 | `packages/domain-core/src/index.ts` | `2c27ba30e471c7b8d87ae30cf2fc1b26e1799acaf0fd887bfe0c9ad1ae335e4f` |
| 2 | `docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md` | `bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26` |
| 3 | `docs/architecture/2B20B-P2F1R-C-domain-event-structural-validation-design-correction-round-1.md` | `0bf52860cbb0b97610eb109eeff1379bb2008842cd3c307ad59ae2fa46be3acc` |
| 4 | `docs/architecture/2B20B-P2F1R-C-domain-event-structural-validation-design-correction-round-2.md` | `82275dcaf38827e75ebda39f7e39abd5d9d6b5ae61ff1a2b429ed2fc1aee8c6a` |
| 5 | `docs/architecture/2B20B-P2F1R-C-domain-event-structural-validation-design-round-1.md` | `8da690d5262fa5754370e941907c898a51874e171f822f6402e2eed97e940fd6` |
| 6 | `docs/architecture/2B20B-P2F1R-C-domain-event-structural-validation-governance-precheck.md` | `44f24304c2723b7f5dc401c01fadcd0eaab5cc9db51afdd26593f2dd5e06102a` |
| 7 | `docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md` | `fe66dc3842aeea27a5cf95380c1088742ae3933dd3c7443492d8fbdd22f982cf` |
| 8 | `docs/rules/evidence/2B20B-P2F1R-C.md` | `5e8e45da7e1f0f3fba7b10514f67d8545a8f7032e540c5b3beec163ff73b13d1` |
| 9 | `packages/domain-core/src/canonical-domain-event.ts` | `b086fddd331d6c821ec3cc88f71d2282b5f04bea43115fee08d75ca075b557c2` |
| 10 | `packages/domain-core/src/domain-event-structural-validator.test.ts` | `731d29912562cc4234f2067190595347e7ca20d929a788af20f8453d522c4988` |
| 11 | `packages/domain-core/src/domain-event-structural-validator.ts` | `5a41176270e04bc46a4a58c64c8ead5c59f855d8956b6bb18348a4da720df36a` |

No file from this worktree is a CE input. It must not be staged, copied, reset,
cleaned, restored, or deleted.

## 5. Independent review at `52ab1e4`

- `reviewedPR`: `LOCAL_ONLY`
- `reviewedHead`: `52ab1e483328cb05a16606a7d1976dc4e378b038`
- `reviewTimestamp`: `2026-08-02T20:49:37.2598504+08:00`
- `codeVerdict`: `CODE_REVIEW_FIX_REQUIRED`
- `ruleVerdict`: `NOT_RUN_CODE_REVIEW_ONLY`

### Review scope

- Complete diff `7fc337325f274c669a356a30c7485e2fdf134643...52ab1e483328cb05a16606a7d1976dc4e378b038`.
- Recovery Design V1, Corrections V1/V2/V3, V3 independent design review, implementation traceability.
- All affected production code, tests, exports, and exact-head local gates.
- Code and implementation-contract review only.

### Files reviewed

Production:

- `packages/domain-core/src/canonical-domain-event.ts`
- `packages/domain-core/src/domain-event-structural-validator.ts`
- `packages/domain-core/src/index.ts`

Tests:

- `packages/domain-core/src/domain-event-structural-validator.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`
- related exact-head domain-core and full-ordinary regression tests

Rule-boundary material:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- the nonsemantic boundary in the C design chain

### Exact findings

#### `C-R2-F01_SECTION12_EVIDENCE_MATRIX_INCOMPLETE`

- Severity: `BLOCKER`
- Basis: `A / G`
- Reachability/trust: `R3 / T1`
- Affected evidence: C-C02, C-C03c, C-C05, C-C06a and their traceability rows.
- Exact cause: the 14-field matrix omitted required accepted-language cases and exact diagnostics; C-C03c did not execute the public dispatch path; C-C05 did not prove every pre-payload leaf and exact counter tuple; C-C06a did not prove zero discriminator reads for all 35 singleton roots.
- Required correction: a complete Section 12 matrix with exact leaf, public diagnostic, path, observer tuple, and production entry.
- Required regression: complete 14-field language, F02/F03/F05/F07-F13 tuples, 35 singleton zero-read cases, and a real admitted-authority-to-public-dispatch success.

#### `C-R2-F02_CALLABLE_LEAF_MECHANISM_MATCH_FALSE`

- Severity: `BLOCKER`
- Basis: `A / G`
- Reachability/trust: `R3 / T1`
- Affected evidence: C-C15b.
- Exact cause: collecting 31 leaf IDs did not prove the exact diagnostic, path, read budget, coordinate, repeatability, or nonleak contract for every leaf.
- Required correction: an explicit 31-row callable evidence matrix through real entries.
- Required regression: 31 distinct cases, complete tuple, deterministic repeat, and nonleak assertions.

#### `C-R2-F03_F20_FIRST_FAILURE_ORDER_DIVERGES_FROM_FROZEN_DESIGN`

- Severity: `BLOCKER`
- Basis: `A`
- Reachability/trust: `R4 / T3`
- Production symbol: `traverseNode`
- Exact cause: tagged coordinate/discriminator work preceded the frozen L23 branch-ordinal invariant.
- Required correction: L23 must precede coordinate construction and F26.
- Required regression: exact L20-L25 ordering, unchanged healthy F26 behavior, and F28 restricted to closed-union multiple match.

#### `C-R2-F04_STATIC_LEAF_EVIDENCE_NOT_EXACT`

- Severity: `BLOCKER`
- Basis: `A / G`
- Reachability/trust: `R4 / T3`
- Affected evidence: C-C15d.
- Exact cause: string presence did not prove the exact source declaration, guard branch, return leaf, policy, or no-fallthrough behavior.
- Required correction: 16 exact source-symbol/branch/fail-closed bindings.
- Required regression: exact binding, unique return, no F34 fallthrough, six F20 guards, and F28 closed-union restriction.

#### `C-R2-F05_TRACEABILITY_PRIMARY_BINDINGS_ARE_NOT_ALL_REAL_SYMBOLS`

- Severity: `BLOCKER`
- Basis: `G`
- Exact cause: several `ProductionEntry` values were prose rather than real symbols; the audit did not prove symbol resolution.
- Required correction: bind all active criteria to real, unique, locatable production symbols and recalculate `MechanismMatch`.
- Required regression: 28 distinct physical identities, symbol existence and uniqueness, and zero duplicate, borrowed, missing, or pending primary mechanisms.

### Remaining blockers at `52ab1e4`

- `C-R2-F01_SECTION12_EVIDENCE_MATRIX_INCOMPLETE`
- `C-R2-F02_CALLABLE_LEAF_MECHANISM_MATCH_FALSE`
- `C-R2-F03_F20_FIRST_FAILURE_ORDER_DIVERGES_FROM_FROZEN_DESIGN`
- `C-R2-F04_STATIC_LEAF_EVIDENCE_NOT_EXACT`
- `C-R2-F05_TRACEABILITY_PRIMARY_BINDINGS_ARE_NOT_ALL_REAL_SYMBOLS`

## 6. Independent review at `54d95e8`

- `reviewedPR`: `LOCAL_ONLY`
- `reviewedHead`: `54d95e88398271e596e366cdec635a1aed82b384`
- `reviewTimestamp`: `2026-08-02T22:03:04.212+08:00`
- `codeVerdict`: `CODE_REVIEW_FIX_REQUIRED`
- `ruleVerdict`: `NOT_RUN_CODE_REVIEW_ONLY`

### Review scope

- Complete C diff `7fc337325f274c669a356a30c7485e2fdf134643..54d95e88398271e596e366cdec635a1aed82b384`.
- Complete focused Stop-Loss delta `52ab1e483328cb05a16606a7d1976dc4e378b038..54d95e88398271e596e366cdec635a1aed82b384`.
- Runtime behavior, exact payload shapes, fail-closed ordering, read budgets, deterministic diagnostics and coordinates, authority provenance, traceability, frozen design compliance, protected-worktree preservation, and CI configuration.
- Code review only; no external BOTC rule adjudication.

### Files reviewed

Production:

- `packages/domain-core/src/canonical-domain-event.ts`
- `packages/domain-core/src/domain-event-structural-validator.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/canonical-runtime-value.ts`
- `packages/domain-core/src/canonical-runtime-hash.ts`
- `packages/domain-core/src/domain-event-structural-schema-ast.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`

Tests:

- `packages/domain-core/src/domain-event-structural-validator.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-ast.test.ts`
- `packages/domain-core/src/canonical-runtime-value.test.ts`

Governance and architecture:

- `AGENTS.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- the complete C recovery design and review chain
- `docs/implementation/phase-3-slice-2b20b-p2f1r-c-frozen-contract-restoration-evidence-stop-loss-override-v1.md`
- `docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md`
- `.github/workflows/ci.yml`

### Census confirmed by the reviewer

- 47 diagnostic leaves
- 34 public diagnostic contexts
- 19 public diagnostic codes
- 31 callable leaves
- 16 static leaves
- 33 traceability rows
- 5 grouping rows
- 28 active rows
- 28 invalid recorded physical identities because every recorded title omits the collected ancestor path
- 5 supporting-authority rows with invalid protocol enum values

### Exact open findings

#### `C-R2-F01_EXACT_ENVELOPE_EXECUTABLE_MATRIX_INCOMPLETE`

- Test: `C-C02 preserves the exact 14-field accepted envelope runtime language`
- Entries: `validateDomainEventStructure`, `readStructurallyValidatedDomainEvent`
- Exact cause: all 84 rows assert acceptance or failure code/path, but accepted values are not read back from authentic tokens; no row binds its exact observation/read budget.
- Unproven behavior:
  - all six branded-ID whitespace-preserving values;
  - empty and whitespace `rulesBaselineVersion`;
  - empty and whitespace `createdAt`;
  - all per-row observer tuples;
  - repeat determinism and nonleak for failure rows.
- Correct evidence action: drive every row through the observed public entry, assert the complete failure tuple and exact observation, and read authentic successful token backing to prove byte-for-value preservation.

#### `C-R2-F02_CALLABLE_LEAF_MECHANISM_MATCH_FALSE`

- Tests:
  - `C-C15b binds all 31 callable diagnostic leaves to real failure entry points`
  - `C-C15c proves all nine tagged-union coordinate states without identity leakage`
- Exact cause:
  - `publicLeaf` often proves only `ok=false` and records a leaf ID;
  - public AST rows use partial `toMatchObject`;
  - path, complete observation, coordinate, repeat, and nonleak are incomplete;
  - C-C15c uses synthetic `nodeFixtureAuthority` and package-private `validateDomainEventStructuralNodeForTest`.
- Correct evidence action: a 31-row matrix through the frozen public observation entry and authentic C1 roots, with complete diagnostic, complete observation, coordinate/null policy, repeat equality, and nonleak.
- The nine tagged cases must be part of the same real-public-authority mechanism.

#### `C-R2-F04_STATIC_LEAF_EVIDENCE_INCOMPLETE`

- Test: `C-C15d binds all 16 static leaves to exact fail-closed source guards`
- Exact cause: broad regular expressions search an entire file. Several use `[\s\S]*?`, so text in another declaration can satisfy a row. They do not prove the complete tuple, exact branch, read budget, no fallthrough, F34 exclusion, or noncallable rationale.
- Correct evidence action: a structurally scoped, executable source audit that resolves the named declaration and exact branch before evaluating the expected leaf, tuple, return, and ordering.
- Required negative evidence: matching text outside the named symbol, missing/moved/duplicate/wrong-return/fallthrough branches, and individual F34 exclusion.

#### `C-R2-F05_TRACEABILITY_AND_SUPPORT_PROVENANCE_INVALID`

- Exact invalid support values:
  - `FROZEN_SUPPORTING_ONLY`
  - `LOCAL_COMPONENT_REVIEWED_SUPPORTING_ONLY`
  - `ACCEPTED_SUPPORTING_ONLY`
  - `GOVERNANCE_SUPPORTING_ONLY`
  - prose mutation dispositions such as `C implementation cannot mutate`
- Protocol domains are exactly:
  - `AuthorityStatus`: `ACCEPTED | LEGACY | HOSTILE`
  - `MutationDisposition`: `NONE | CLONE_MUTATED | PERSISTED_OR_IMPORTED_MUTATED`
- Every active `ActualTestTitle` omits ancestor path
  `P2F1R-C domain event structural validation`.
- The current audit searches for `it("title"` and globally present symbol text. It does not prove collected physical identity or declaration-scoped binding.
- At least C-C02, C-C15b, C-C15c, and C-C15d falsely claim `MechanismMatch=PASS`.

The actual semantic identities for the four directly affected tests are:

```text
[
  "domain-core",
  "packages/domain-core/src/domain-event-structural-validator.test.ts",
  ["P2F1R-C domain event structural validation"],
  "C-C02 preserves the exact 14-field accepted envelope runtime language"
]
[
  "domain-core",
  "packages/domain-core/src/domain-event-structural-validator.test.ts",
  ["P2F1R-C domain event structural validation"],
  "C-C15b binds all 31 callable diagnostic leaves to real failure entry points"
]
[
  "domain-core",
  "packages/domain-core/src/domain-event-structural-validator.test.ts",
  ["P2F1R-C domain event structural validation"],
  "C-C15c proves all nine tagged-union coordinate states without identity leakage"
]
[
  "domain-core",
  "packages/domain-core/src/domain-event-structural-validator.test.ts",
  ["P2F1R-C domain event structural validation"],
  "C-C15d binds all 16 static leaves to exact fail-closed source guards"
]
```

These identities must be collected from the public Vitest lifecycle and
canonicalized using the existing AP1 identity contract. They must not be
hand-authored into an implementation PASS claim.

### Closed finding

`C-R2-F03_F20_PRECEDENCE_NOT_EXECUTABLY_PROVEN` is closed.

- Frozen context: `L23_F20_TAGGED_VARIANT_ORDINAL_INVALID`
- Production symbol: `traverseNode`
- Frozen behavior: branch ordinal validation occurs before discriminator read, coordinate construction, child entry, or F26.
- Current evidence: multi-invalid inputs deterministically return L23, empty path, null coordinate, and `payloadContentReads=0`.
- It must not be reopened without a production delta.

### Current remaining blockers

- `C-R2-F01_EXACT_ENVELOPE_EXECUTABLE_MATRIX_INCOMPLETE`
- `C-R2-F02_CALLABLE_LEAF_MECHANISM_MATCH_FALSE`
- `C-R2-F04_STATIC_LEAF_EVIDENCE_INCOMPLETE`
- `C-R2-F05_TRACEABILITY_AND_SUPPORT_PROVENANCE_INVALID`
- `LOCAL_FULL_ORDINARY_GATE_NOT_GREEN`

## 7. Exact current evidence locations

| Finding | Physical test | Traceability rows | Production entries/symbols |
|---|---|---|---|
| F01 | C-C02; C-C13 reader support | C-C02 | `validateDomainEventStructure`, `validateDomainEventStructureWithObservationForTest`, `readStructurallyValidatedDomainEvent`, `validateEnvelope` |
| F02 | C-C15b; C-C15c | C-C15b, C-C15c | `validateDomainEventStructureWithObservationForTest`, `validateCapturedDomainEventStructureWithObservationForTest`, `readStructurallyValidatedDomainEvent`; package-private `validateDomainEventStructuralNodeForTest` is not valid public primary evidence |
| F04 | C-C15d | C-C15d | `admitC1Authority`, `translateCaptureFailure`, `validateCapturedInternal`, `selectBranch`, `traverseNode`, `executeRefinement`, `issueStructurallyValidatedDomainEvent`, `validateDomainEventStructure` |
| F05 | C-C15a traceability audit and the C traceability document | all 5 grouping and 28 active rows | every actual entry must resolve to a real declaration or exact static branch |

The current frozen observation tuple contains:

- `diagnosticLeafId`
- `authorityChecked`
- `captureEntered`
- `envelopeKeySetChecked`
- `envelopeFieldReads`
- `eventTypeReads`
- `eventVersionReads`
- `payloadKeyPresenceChecked`
- `payloadKeyPresent`
- `payloadNodeAcquired`
- `payloadDiscriminatorReads`
- `payloadContentReads`
- `astTraversalEntered`
- `validatedBackingConstructed`
- `tokenIssued`

The complete public diagnostic tuple is:

- `code`
- `phase`
- `path`
- `safeSummary`
- `quarantineRecommended`
- `retryability`
- `taggedUnionCoordinate`
- `failClosed=true`

## 8. Catalog V2 byte audit

### Failure command

```powershell
corepack pnpm exec vitest run `
  --workspace vitest.workspace.ts `
  packages/domain-core/src/domain-event-structural-schema-catalog.test.ts `
  --reporter=dot
```

### Failing physical test

```text
Catalog V2 audit projection >
matches the checked-in frozen generated Catalog V2 path byte-for-byte
```

The assertion is:

```ts
expect(readFileSync(generatedCatalogUrl, "utf8")).toBe(
  renderGeneratedStructuralSchemaCatalogV2(healthyAuthority())
);
```

The received value is checkout working-tree text. The expected value is the
in-memory LF renderer result.

### Exact artifact facts

- Path:
  `docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md`
- Git blob object ID:
  `4f9a376e56f19b241d76ce2a75be83b70859ae25`
- Git blob raw byte length:
  `264855`
- Git blob raw SHA-256:
  `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`
- Git blob line endings:
  `626 LF`, `0 CRLF`
- Default Windows working-tree byte length:
  `265481`
- Default Windows working-tree SHA-256:
  `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7`
- Default Windows line endings:
  `626 CRLF`, `0 lone LF`
- LF working-tree byte length:
  `264855`
- LF working-tree SHA-256:
  `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`
- Generated Catalog V2 canonical UTF-8 bytes SHA-256:
  `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`
- First blob/default differing byte offset:
  `48`
- First blob/LF differing byte offset:
  `NONE`
- BOM:
  `NONE` in blob, default checkout, and LF checkout
- Difference classification:
  `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY`

The embedded canonical schema artifact is a distinct object:

- `artifactByteLength=255513`
- `artifactSha256=25994ef263865433466dea9f8d033d7ff13a6aec40c377ec53e39e665a8b8cc4`

That digest is not the raw Catalog V2 file digest and is not the received object
of the failing Vitest string comparison.

### Git configuration provenance

Default CE worktree:

```text
core.autocrlf source:
file:C:/Program Files/Git/etc/gitconfig

core.autocrlf:
true

git ls-files --eol:
i/lf w/crlf attr/
```

Existing LF exact-head worktree:

```text
live core.autocrlf source:
file:C:/Program Files/Git/etc/gitconfig

live core.autocrlf:
true

git ls-files --eol:
i/lf w/lf attr/
```

The LF worktree content is an explicitly LF-materialized checkout state. The
live configuration does not supply a repository policy guaranteeing that state.
This is why one clean worktree passes while an ordinary Windows checkout fails.

### Gate results

- Default Windows focused Catalog gate: `20/21 PASS`, `1 FAIL`.
- LF focused Catalog gate: `21/21 PASS`.
- Default Windows full ordinary: `FAIL`, same Catalog test only.
- LF full ordinary at exact HEAD: `40 files / 1712 tests PASS`.

No C or C1 runtime behavior differs between those runs.

## 9. Finding ownership classification

| Finding | Exact Cause | Product Behavior Defect | Test Evidence Defect | Traceability Defect | Portability Defect | Correct Owner |
|---|---|---:|---:|---:|---:|---|
| `C-R2-F01_EXACT_ENVELOPE_EXECUTABLE_MATRIX_INCOMPLETE` | Accepted values are not read back; 84 rows lack exact observer budgets and repeat/nonleak evidence | No | Yes | Yes | No | `CE_CALLABLE_EVIDENCE` |
| `C-R2-F02_CALLABLE_LEAF_MECHANISM_MATCH_FALSE` | Leaf census and partial assertions do not prove 31 exact real-public-entry tuples; nine tagged cases use a synthetic seam | No | Yes | Yes | No | `CE_CALLABLE_EVIDENCE` |
| `C-R2-F04_STATIC_LEAF_EVIDENCE_INCOMPLETE` | Whole-file regex matches do not prove symbol-scoped branch, tuple, return, order, or no-fallthrough | No | Yes | Yes | No | `CE_STATIC_EVIDENCE` |
| `C-R2-F05_TRACEABILITY_AND_SUPPORT_PROVENANCE_INVALID` | Invalid SUP enums, incomplete physical identity, unscoped symbols, and false MechanismMatch claims | No | Yes | Yes | No | `CE_TRACEABILITY` |
| `LOCAL_FULL_ORDINARY_GATE_NOT_GREEN` | Git checkout converts an LF blob to CRLF while the renderer emits LF; existing test compares working-tree text | No | No | No | Yes | `D_PUBLICATION_EVIDENCE` |

No current finding is owned by `PRODUCT_BEHAVIOR` or `C1_AUTHORITY`.

The first four findings are technically suitable for a zero-production-change
CE evidence implementation. The fifth is not closable under the current CE
allowlist because the only honest repairs require one of:

1. changing `domain-event-structural-schema-catalog.test.ts` to compare the
   generated bytes with Git blob or another checkout-independent canonical
   byte source;
2. adding a separately governed binary/canonical fixture and changing that
   test to consume it;
3. changing `.gitattributes` or checkout policy;
4. moving checkout/publication portability into P2F1R-D.

All four are outside this CE authorization. Transiently rewriting the tracked
Catalog file, monkey-patching filesystem reads, filtering CRLF before equality,
skipping the test, or changing the expected digest is not valid evidence.

## 10. Audit conclusion

- `CBehaviorChanged`: `false`
- `C1AuthorityChanged`: `false`
- `F20Status`: `CLOSED`
- `callableLeafCount`: `31`
- `staticLeafCount`: `16`
- `envelopeFieldCount`: `14`
- `currentEnvelopeExecutedCaseCount`: `84`
- `traceabilityRowCount`: `33`
- `historicalGroupingCount`: `5`
- `activeCriterionCount`: `28`
- `currentInvalidVitestIdentityCount`: `28`
- `currentInvalidSupportingAuthorityCount`: `5`
- `catalogDifferenceClassification`: `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY`
- `governanceInputVerdict`: `RESLICE_REQUIRED`
- `implementationAuthorized`: `false`
- `requiredNextAction`:
  `AUTHORIZE_CATALOG_TEST_ONLY_PORTABILITY_FOUNDATION_OR_P2F1R_D_BEFORE_RESUMING_CE`
