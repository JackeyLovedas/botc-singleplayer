# Phase 3 Slice 2B20B-P2F1R Canonical Validation Foundation Rescope Governance Precheck

## Metadata

- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_CANONICAL_VALIDATION_FOUNDATION_RESCOPE_PRECHECK_ONLY`
- currentHead: `bef395287d5400043565acd5b794d02810d7bbca`
- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- scope: `GOVERNANCE_RESCOPE_PRECHECK_ONLY`
- implementationAuthorized: `false`
- reviewMode: `READ_ONLY_ARCHITECTURE_PRECHECK`
- generatedFor: `docs/architecture/2B20B-P2F1R-canonical-validation-foundation-rescope-governance-precheck.md`

## Authorities inspected

- `AGENTS.md`
- `docs/architecture/2B20B-P2F1-canonical-runtime-validation-deterministic-serialization-design-round-1.md`
  - SHA-256: `85152ec636b87b08b253c20dcaba9f961ba26eaa2e46b75fd80ac108a026cf2a`
- `docs/architecture/2B20B-P2F1-canonical-runtime-validation-deterministic-serialization-design-correction-round-1.md`
  - SHA-256: `74123ae058e21e86aade02bf71a877a82edd97c221ab387ee8aafcfc48d1f112`
- `docs/architecture/2B20B-P2F-trusted-accepted-history-authority-precheck.md`
  - SHA-256: `9edf58e5b244ff729f73351d4a83edbabe9ad54855999673a5d63177a41f2a4a`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
  - SHA-256: `4f9328a73172e4a70f8ef64be431a55e23f96bb78e553673d3aef0845ea00b64`
- current event schema, replay validator, event applier, canonical comparison, ownership, coverage, workflow, and Windows-routing sources.

## Current-state finding

The corrected P2F1 design is still `NOT_REVIEWED`, `implementationAuthorized=false`, and its parent P2F state remains `HUMAN_BLOCKED_PENDING_P2F1`.

Its D01-D06 contract assigns one Slice all of the following:

1. hostile-input-safe process-local opaque capture;
2. canonical runtime-value representation and deterministic TLV serialization;
3. exact 14-field domain-event envelope validation and all 40 BOTC payload schemas;
4. raw, canonical-value, canonical-state-role, and aggregate SHA-256 contracts;
5. diagnostics and failure precedence;
6. traceability, ownership inventory, coverage-profile mutation, workflow selection, and Windows execution evidence.

These are not one primary risk. They form at least four independently reviewable layers with different dependencies, failure modes, and publication lifecycles.

The accepted governance ADR requires one Slice to own one primary risk, requires a second independent infrastructure risk to be split, and requires reslicing when one PR owns three or more independent subsystems. Current P2F1 violates those conditions.

There is also a concrete execution contradiction in D06. The design adds four test files while `scripts/run-vitest-logical-group.mjs` currently freezes `EXPECTED_TOTAL` at `1580`. Any new semantic test identity changes that inventory, but D06 forbids changing this runner. Therefore the proposed allowlist cannot satisfy the repository's current ownership/coverage gates. This is an architectural rescope signal, not a BOTC rule conflict.

## Identified layers

### Layer A — Canonical Runtime Capture and TLV Foundation

Primary responsibility:

- fail-closed inspection of unknown runtime input before ordinary object operations;
- Proxy, revoked-Proxy, accessor, nonplain, cycle, and resource-bound handling;
- process-local opaque capture token;
- canonical runtime-value model;
- deterministic, locale-independent TLV bytes;
- canonical-capture and TLV diagnostics.

Explicit non-responsibilities:

- BOTC event names, versions, envelope fields, or payload schemas;
- SHA-256 role assignment;
- accepted-history authority;
- replay semantics;
- `GameState` reconstruction;
- coverage profile or workflow mutation.

### Layer B — Deterministic Integrity Hash Foundation

Primary responsibility:

- exact raw-byte capture contract;
- role-separated SHA-256 framing and domain separation;
- raw-input hash;
- canonical-value hash;
- canonical-state-role hash;
- aggregate hash;
- hash diagnostics and deterministic compatibility vectors.

Dependencies:

- Layer A only for canonical-value and TLV-derived hashes.
- Raw-byte hashing remains independently defined inside Layer B.

Explicit non-responsibilities:

- BOTC payload validation;
- event replay or acceptance;
- trusted-history authority;
- CI/profile lifecycle.

### Layer C — BOTC Domain Event Structural Validation

Primary responsibility:

- exact 14-field event-envelope validation;
- version-aware dispatch across the enumerated 40 BOTC payload schemas;
- missing, extra, wrong-type, and wrong-literal rejection;
- event-specific structural diagnostics, stable precedence, and advisory data;
- conversion from unknown captured input into a structurally validated domain-event value.

Dependencies:

- Layer A for hostile-safe input capture and canonical structural inspection.
- No dependency on Layer B is required for structural validity.

Explicit non-responsibilities:

- stateful event meaning;
- accepted-history provenance;
- replay ordering, game, batch, version, or baseline policy;
- role semantics owned today by `event-applier.ts` and role modules;
- hashes or CI/profile lifecycle.

### Layer D — Evidence, Ownership, Coverage Profile, and Cross-Platform Execution Closure

Primary responsibility:

- implementation-time traceability bindings for accepted source/test heads;
- semantic test-identity ownership registration;
- canonical inventory and physical-set hashes;
- append-only coverage profile creation and active-profile selection;
- Linux ordinary/coverage routing evidence;
- explicit Windows execution ownership for TLV/hash vectors where required;
- exact-head publication evidence.

Dependencies:

- frozen source and test inventories from Layers A-C.

Explicit non-responsibilities:

- production runtime behavior;
- BOTC rules;
- canonical serialization or hash algorithms;
- domain payload semantics.

## Dependency graph

```text
Layer A: Canonical Capture + TLV
        |                    \
        v                     v
Layer B: Hash Foundation   Layer C: BOTC Event Structural Validation
        \                     /
         \                   /
          v                 v
     Later P2F Trusted Accepted-History Authority
             (not part of P2F1R)

A/B/C frozen test identities
             |
             v
Layer D: Ownership + Coverage Profile + CI/Windows Evidence

Layer D has no runtime dependency back into A, B, or C.
Layer C does not depend on Layer B.
Replay, event-applier state semantics, and role behavior remain outside all four layers.
```

## Candidate split evaluation

### Option A — Keep corrected P2F1 as one Slice

Rejected.

Reasons:

- owns at least four independent risks;
- crosses product-foundation, BOTC-domain, and CI-infrastructure boundaries;
- triggers the ADR three-independent-subsystems stop-loss;
- D06's file allowlist cannot accommodate the current hard-coded test inventory;
- a single final review would conflate generic trust-boundary safety, BOTC schema completeness, and CI evidence correctness.

### Option B — Split into two Slices

Candidate shape:

1. foundation = Layers A+B;
2. domain validation and evidence = Layers C+D.

Rejected as insufficient.

Reasons:

- A and B still own different failure surfaces: hostile-runtime capture/serialization versus cryptographic role separation and framing;
- C and D still mix production domain validation with a separate infrastructure/evidence lifecycle;
- the second Slice would still violate the rule that CI infrastructure must be separate from product behavior;
- exact test inventory and profile evidence cannot be safely frozen before the domain-validation implementation is frozen.

### Option C — Four controlled Slices

Recommended.

This is the smallest split that gives every Slice one primary risk, preserves a one-way dependency graph, keeps infrastructure separate from product code, and allows exact-head evidence to be created only after source/test inventories are frozen.

## Recommended slices

1. `2B20B-P2F1R-A — Canonical Runtime Capture and TLV Foundation`
   - owns Layer A only;
   - no BOTC event schemas and no hashes.
2. `2B20B-P2F1R-B — Deterministic Integrity Hash Foundation`
   - owns Layer B only;
   - consumes the accepted A contract;
   - no BOTC event schemas.
3. `2B20B-P2F1R-C — BOTC Domain Event Structural Validation`
   - owns Layer C only;
   - consumes the accepted A contract;
   - does not alter event-applier, replay semantics, or role modules.
4. `2B20B-P2F1R-D — Test Ownership, Coverage Profile, and Cross-Platform Evidence Closure`
   - owns Layer D only;
   - contains no production code;
   - runs only after A-C source/test identities are frozen.

Required sequence:

- A first;
- B and C only after A is accepted; repository governance may execute them sequentially;
- D only after the exact A-C implementation/test heads are frozen;
- the parent P2F trusted-history authority remains blocked until the required accepted outputs exist and receives its own later design/review gate.

## D01-D06 reassignment table

| Original area | Child owner | Corrected responsibility | Explicit exclusion |
|---|---|---|---|
| `D01` | A, B, C; publication to D | A owns capture/TLV; B owns hashes; C owns BOTC structural schemas; D owns evidence publication | no child may use former combined D01 to enter another child's scope |
| `D02` | A and B | A owns canonical token/TLV; B owns raw-byte and hash-role tokens | C defines no competing capture; raw token does not remain in A |
| `D03` | C | exact envelope, 40 payload schemas, version dispatch, structural output | A and B contain no BOTC event switch or role validator |
| `D04` | A, B, C | A owns capture/TLV failures; B owns raw/hash failures and framing; C owns event failures, precedence, and advisory | accepted-history authority remains outside A-D |
| `D05` | A, B, C, D | replace unified matrix with parent-to-child mapping and complete child matrices; D binds evidence | no silent criterion loss or primary-layer relabeling |
| `D06` | A-C runtime/test files; D evidence files | A-C own only their source/tests/docs; D owns ownership, runner totals, coverage, workflow, and reviewed Windows route | no new Vitest project/group |

## D01Assignment

Decompose D01 across A, B, and C:

- A owns hostile-safe opaque capture, canonical value, TLV, resource limits, and serialization diagnostics.
- B owns raw, canonical, state-role, and aggregate hash contracts and framing.
- C owns the 14-field envelope and 40 payload-schema dispatch.
- The existing non-authority, non-replay, non-`GameState` constraints are inherited by all three.
- Publication and evidence obligations move to D.

No child Slice may cite the former combined D01 as authorization to enter another child's responsibility.

## D02Assignment

- A exclusively owns canonical runtime-value capture, the process-local canonical token, deterministic TLV, and capture/TLV limits.
- B owns the raw-byte capture token and any aggregate/hash-role token whose only purpose is hash integrity.
- C consumes A's validated canonical representation but does not define a competing capture mechanism.

The corrected design's `capturedRawBytes` concept must not remain in A merely because it was colocated in old D02.

## D03Assignment

C exclusively owns:

- the 14-field event envelope;
- the enumerated 40 event payload schemas;
- version-aware event dispatch;
- exact-key and exact-literal validation;
- unknown-domain-event structural output.

A and B must contain no BOTC event type switch and no role-specific validator.

## D04Assignment

- A owns canonical-capture and TLV error codes, resource-limit failures, and precedence within its boundary.
- B owns raw-byte-boundary failures, hash framing/domain separation, four hash outputs, and hash diagnostics.
- C owns unknown-event, envelope, payload-shape, unsupported-version, and event-specific diagnostic precedence/advisory.
- Snapshot cache-only hash roles, if retained, belong to B and remain expressly non-authoritative.
- Accepted-history authority remains outside A-D.

## D05Assignment

The single 22-row matrix is retired as implementation authority and replaced by a parent-to-child mapping plus a complete nine-field design-time matrix in each child design.

Recommended parent-criterion mapping:

- A: `C02`, `C03`, `C07`, `C09`, `C10`, `C11`, `C13`, plus child `C08A` for canonical null/undefined distinction and child `C21A` for A compatibility.
- B: `C14A`, `C14B`, `C15`, `C16`, `C17`, `C18`, `C19`, plus child `C21B` for hash compatibility and `C22B` for hash cross-platform vectors.
- C: `C01`, `C04`, `C05`, `C06`, `C12`, `C20`, plus child `C08B` for schema missing-versus-null distinction and child `C21C` for schema compatibility.
- D: implementation evidence and cross-platform execution bindings only. `C22A` binds TLV cross-platform evidence; `C22B` binds hash cross-platform evidence. C receives `C22C` only if its future design proves a platform-sensitive algorithm; it is not added mechanically.

Original-to-child mapping remains explicit so no criterion silently disappears or changes meaning. A criterion split across distinct risks receives child suffixes rather than one physical test identity being assigned multiple primary layers.

Expected R1 and R2 matrices remain empty unless independently established by accepted product behavior. Foundation tests must not be relabeled as accepted-stream or replay evidence.

## D06Assignment

A, B, and C each own only:

- their exact production files;
- their exact test files;
- their per-slice design/traceability/status documentation.

D exclusively owns the necessary repository evidence and routing files, subject to its own design review:

- `scripts/vitest-ownership-contracts.mjs`;
- `scripts/run-vitest-logical-group.mjs`;
- `scripts/verify-coverage-obligations.mjs`;
- `.github/workflows/ci.yml`;
- and, only if the reviewed Windows route requires it, `scripts/verify-vitest-windows-application-groups.mjs`.

`vitest.workspace.ts` and `scripts/verify-vitest-coverage-groups.mjs` are expected to remain unchanged because the current globs and `domain-core-rest` routing already include new domain-core test files, but D verifies this from the frozen inventory rather than inheriting it as an assumption.

No new Vitest project or logical group is authorized by this precheck.

## Traceability impact

- The old unified D05 matrix cannot serve as final implementation authority after reslicing.
- Every child design contains the accepted Traceability V1.1 nine design-time fields and one primary layer per physical semantic test identity.
- Likely classifications:
  - hostile, raw, and external structural boundaries: `R3 / T1 / STRUCTURAL_VALIDATION`;
  - pure TLV, hash, and compatibility functions: `R4 / T3 / PURE_POLICY_SEAM`;
  - cross-platform execution/profile assertions: `R4 / T3 / CROSS_PLATFORM_CI`.
- Supporting authority may reference another child's accepted evidence but cannot change primary-layer ownership.
- Implementation-time actual bindings are created only after the relevant tests exist.
- D binds and verifies evidence; D must not manufacture product truth or relabel R4 foundation checks as R1/R2 accepted behavior.

## Ownership impact

Expected primary routing, subject to exact child designs:

- A: `canonical-runtime-value.test.ts` -> `domain-core-rest` / `domain-core`.
- B: `canonical-runtime-hash.test.ts` -> `domain-core-rest` / `domain-core`.
- C: `domain-event-payload-shape-v1.test.ts` and `unknown-domain-event.test.ts` -> `domain-core-rest` / `domain-core`.

Requirements:

- no borrowed Slice marker or title;
- one physical test identity, one primary layer;
- canonical inventory increases by the actual discovered semantic identities, not by an assumed count of four files;
- physical-set hashes and all ownership totals update only after the child test inventories are frozen;
- `scripts/run-vitest-logical-group.mjs` is reconciled in D because its hard-coded `EXPECTED_TOTAL` currently equals `1580`;
- no new project or group unless a later reviewed infrastructure design establishes necessity.

## Coverage impact

- Current workspace globs automatically route new domain-core source and tests through `domain-core-rest`.
- The accepted P1 profile is immutable and cannot remain the claimed exact profile after new source/test topology is added.
- D appends a new exact coverage profile or an explicitly reviewed aggregate stacked profile after A-C are frozen; it must not mutate historical profiles.
- The active workflow selector changes only with the exact matching source/test/profile head.
- Linux ordinary and coverage totals are recalculated from actual inventory.
- Windows TLV/hash evidence has explicit ownership. It is not added as an unowned direct workflow command.
- D freezes whether Windows evidence is a standalone named owned step or an extension of an existing verifier; the current application W1-W7 verifier does not own domain-core foundation tests.
- No timeout, dependency, Node, pnpm, Vitest, or coverage-threshold change is implied or authorized.

## Governance decision

Current P2F1 is too broad and its D06 publication contract is inconsistent with current repository inventory enforcement. This is an architecture and release-responsibility problem. It does not establish a BOTC rule conflict, does not require a rules override, and does not authorize any production behavior change.

The correct disposition is `RESLICE_REQUIRED` using Option C.

No child design, implementation, test, control-state mutation, branch, commit, push, PR, or CI action is authorized by this precheck alone.

## Final fields

currentHead: `bef395287d5400043565acd5b794d02810d7bbca`

branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`

scope: `GOVERNANCE_RESCOPE_PRECHECK_ONLY`

currentP2F1Status: `RULE_DESIGN_FIX_REQUIRED / IMPLEMENTATION_UNAUTHORIZED / P2F_PARENT_HUMAN_BLOCKED_PENDING_P2F1`

identifiedLayers: `[CANONICAL_RUNTIME_CAPTURE_AND_TLV, DETERMINISTIC_INTEGRITY_HASH, BOTC_DOMAIN_EVENT_STRUCTURAL_VALIDATION, EVIDENCE_OWNERSHIP_COVERAGE_AND_CROSS_PLATFORM_CLOSURE]`

layerResponsibility: `A=hostile-safe canonical capture and deterministic TLV; B=raw/canonical/state-role/aggregate hash framing and outputs; C=14-field BOTC event envelope and 40 payload structural schemas; D=traceability binding, ownership inventory, append-only coverage profile, workflow and Windows evidence lifecycle`

dependencyGraph: `A -> B; A -> C; A+B+C frozen test identities -> D; accepted A+B+C -> later P2F trusted-history authority; no D runtime back-edge; no C -> B dependency`

D01Assignment: `decompose scope across A capture/TLV, B hashes, C BOTC structural schemas; move publication evidence to D; inherit non-authority/non-replay constraints`

D02Assignment: `A owns canonical capture token and TLV; B owns raw-byte and hash-role tokens; C consumes A and defines no competing capture`

D03Assignment: `C exclusively owns the exact event envelope, 40 payload schemas, version dispatch, and structural unknown-event validation`

D04Assignment: `A owns capture/TLV failures; B owns raw boundary, role-separated hash framing and four hashes; C owns event structural failures and precedence; accepted-history authority remains outside A-D`

D05Assignment: `replace the unified 22-row authority with explicit parent-to-child criterion mapping and complete nine-field matrices per child; split C08/C21/C22 with child suffixes; D binds evidence without changing primary ownership`

D06Assignment: `A-C own only their production/tests/traceability docs; D owns ownership registry, hard-coded runner totals, coverage obligations, workflow selection and reviewed Windows routing; no new Vitest project/group authorized`

splitRecommendation: `OPTION_C_FOUR_CONTROLLED_SLICES`

recommendedSlices: `[2B20B-P2F1R-A Canonical Runtime Capture and TLV Foundation, 2B20B-P2F1R-B Deterministic Integrity Hash Foundation, 2B20B-P2F1R-C BOTC Domain Event Structural Validation, 2B20B-P2F1R-D Test Ownership Coverage Profile and Cross-Platform Evidence Closure]`

traceabilityImpact: `reauthor per-slice nine-field design matrices, preserve explicit parent-to-child criterion mapping, keep one primary layer per physical test identity, retain empty R1/R2 unless independently evidenced, and prevent D from manufacturing product truth`

ownershipImpact: `all four proposed tests route to domain-core-rest/domain-core, but semantic inventory and physical hashes must be recomputed from frozen tests; scripts/run-vitest-logical-group.mjs expected total 1580 must be updated in D`

coverageImpact: `append an exact new profile after A-C freeze; do not mutate P1 profile; recalculate ordinary/coverage totals; give Windows TLV/hash evidence explicit ownership; no automatic project/group/timeout/dependency change`

requiredArchitectureChange: `true`

requiredRuleChange: `false`

requiredProductChange: `false`

designVerdict: `RESLICE_REQUIRED`

implementationAuthorized: `false`

filesChanged: `1`

commitCreated: `false`

pushPerformed: `false`

PRCreated: `false`

CIrerunPerformed: `false`

requiredNextAction: `OBTAIN_EXPLICIT_AUTHORIZATION_FOR_SEPARATE_CHILD_DESIGNS_BEGINNING_WITH_2B20B_P2F1R_A_CANONICAL_RUNTIME_CAPTURE_AND_TLV_FOUNDATION; DO_NOT_IMPLEMENT_OR_START_P2F_AUTHORITY`
