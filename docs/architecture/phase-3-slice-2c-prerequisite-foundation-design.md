# Phase 3 Slice 2C Prerequisite Foundation Design

Status: `CONTRACT_CLOSURE_RESLICE_DESIGN_REVIEW_REQUIRED`

This is a new bounded prerequisite foundation. It is not 2C Design Correction
Round 4 and does not modify the historical blocked design at
`a42df3c150faed4e6463e809dd1e26d9d3ab6fbe`.

## Frozen inputs

- Foundation base: `7fc337325f274c669a356a30c7485e2fdf134643`.
- Prior 2C design: `a42df3c150faed4e6463e809dd1e26d9d3ab6fbe`.
- Prior 2C design disposition: `HISTORICAL_BLOCKED_DESIGN_INPUT`.
- Prior 2C correction count: `3/3`.
- `priorFoundationDesignHead=7c76fa9b6898658c20ac218799590088917b718c`.
- `priorFoundationDesignCorrectionCount=2/2`.
- `priorFoundationDesignCorrectionExhausted=true`.
- `priorFoundationDesignDisposition=HISTORICAL_FOUNDATION_DESIGN_EXHAUSTED_PENDING_CONTRACT_CLOSURE_RESLICE`.
- `contractClosureResliceDesignCorrectionCount=0/2`.
- `contractClosureResliceDesignCorrectionBudgetRemaining=2`.
- `currentDesignDisposition=CONTRACT_CLOSURE_RESLICE`.
- Foundation implementation authorization: `false` until an independent
  `RULE_DESIGN_PASS`.

## Scope and non-goals

The foundation closes three prerequisites only:

1. an additive production descriptor seam for the frozen C1 authority;
2. a pure-data ordinary-night inventory authority;
3. direct URL binding for the Fang Gu and Witch rule evidence.

It does not implement nomination, voting, execution, death, dawn, phase
transitions, ordinary-night settlement, role effects, a rule engine, a global
night queue, or a new validator framework. `newPlayableBehaviorCount=0`.

## C1 authority census

The authoritative runtime definitions are `DomainEventType` and
`DomainEventPayloadByType` in `packages/domain-core/src/events.ts`.
`FULL_C1_SCHEMA_NODE_DECLARATIONS` and
`FULL_C1_SCHEMA_ROOT_DECLARATIONS` are hand-materialized in
`packages/domain-core/src/domain-event-structural-schema-ast.ts`; the
repository has no separate C1 generator/materializer. The catalog renderer in
`domain-event-structural-schema-catalog.ts` emits audit artifacts and is not a
second runtime authority.

The frozen C1 candidate is:

```text
eventCount = 40
branchCount = 59
explicitVersionBranches = 13
unversionedBranches = 46
nodes = 2455
childReferences = 2396
exactRecords = 380
recordFields = 2264
unresolvedReferences = 0
cycles = 0
openShapes = 0
additionalProperties = 0
undefinedNodes = 0
```

Existing event ordinals `1..40`, branch ordinals `1..59`, B26/B54 delta
bindings, node identities, field order, and payload exactness are immutable.
Node identities use the existing `C1.SHA256.<64hex>` canonical structural
representation hash and deterministic DFS first-discovery traversal.

## Additive descriptor seam

The foundation adds one deterministic additive-candidate constructor around the
existing `StructuralSchemaCandidateV1` and reuses
`createStructuralSchemaAuthority`. It does not mutate the frozen candidate and
does not create C2 or a parallel validator.

The seam accepts only explicit new roots and node bindings. It enforces:

- new event ordinals start at `41` and are contiguous;
- new branch ordinals start at `60` and are contiguous;
- multi-branch events append their branches contiguously;
- historical roots/branches/node bindings have exact identity and semantic
  delta `0`;
- duplicate event types, duplicate ordinals, ordinal gaps, duplicate node
  IDs, unresolved child nodes, malformed shapes, unsupported node kinds, and
  descriptor mismatches fail closed;
- existing B26/B54 delta bindings remain unchanged;
- the complete census is recomputed and must be `HEALTHY`.

No production 2C event is added by this foundation. A synthetic descriptor,
if needed by tests, exists only as an in-memory test candidate and is not a
domain event, event type, or accepted production descriptor.

## Ordinary-night inventory authority

The inventory is pure data adjacent to the existing S&V role metadata and
first-night catalog in `packages/rules-snv`. It is versioned independently as
`snv-ordinary-night-inventory-v1` and is derived from the pinned official
nightsheet plus the researched role sources.

Each of the 25 Sects & Violets roles has one record with:

```text
roleId
ordinaryNightPresence
baseOrder
taskKind
executionModel = ScheduledTask | ActionOpportunity | EventSubscription | ContinuousRule
supportStatus = SUPPORTED | UNSUPPORTED | NOT_PRESENT
```

The canonical order is the pinned official `otherNight` ordinal, never
alphabetical role order. The inventory records `witch` at ordinary-night
ordinal 27, `imp` at ordinal 40, `fanggu` at ordinal 45, and `dawn` at ordinal
98. First-night-only roles are `NOT_PRESENT` in the ordinary-night inventory.

`FANG_GU_DEMON_KILL` and `WITCH_ACTION` are present in the authority but have
`supportStatus=UNSUPPORTED`. The inventory records presence only; it does not
implement Fang Gu transfer/death/promotion or Witch curse/subscription/death.
Unsupported tasks must fail closed and cannot be silently omitted or converted
to no-op completion. No empty-night bypass is allowed.

## Rule evidence binding

The existing `docs/rules/evidence/2C.md` is append-only. The foundation adds
the direct URLs, revision facts, and hashes for:

- Fang Gu: https://wiki.bloodontheclocktower.com/index.php?title=Fang_Gu&oldid=2974
  (`SHA-256 5e617ccd960342505aa490e7fac01baa43ef6a2c71cd26287fbca6aaa95c7284`).
- Witch: https://wiki.bloodontheclocktower.com/index.php?title=Witch&oldid=2682
  (`SHA-256 330953478cfc8a035a49fcbf379edff35d5f50c9efa37310323ccc40b2f364ef`).
- Pinned nightsheet:
  https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json
  (`SHA-256 99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`).

The research verdict for this bounded scope is `RULE_READY`; it does not
authorize role-effect implementation. `B18Status=HUMAN_BLOCKED_UNCHANGED` and
`B18ConflictsTouched=none`.

## Implementation allowlist and stop-loss

After design review, implementation may modify only the C1 additive seam,
the pure-data S&V inventory, their tests, this foundation documentation, and
the existing 2C evidence file. It may not modify accepted C1 descriptors,
production role behavior, tests' identity generation, workflow, dependencies,
coverage/routing systems, B18, C, or Slice 3.

Historical foundation correction budget was `0/2` at design creation and is
now exhausted at `2/2`; that historical budget is not reused by this reslice.
The contract-closure reslice has its own `0/2` design budget and does not permit
mutation of historical C1 semantics, a second validator/framework, role
effects, or new playable behavior.

## Required independent review

The reviewer must verify the C1 historical prefix delta is zero, the append
policy is deterministic, the existing validator is reused, the inventory is
nightsheet-derived for all 25 roles, Fang Gu/Witch remain unsupported, direct
URLs are present, and no product behavior is added. Until a complete fresh
review returns `RULE_DESIGN_PASS`, implementation remains unauthorized.

## Historical prior design correction 1/2 — exact seam, snapshot, and inventory contract

This correction closes the prior design review findings without changing the
foundation scope. The approved role-source fallback is bound by
`docs/rules/evidence/2C-official-role-source-snapshot.md` (UTF-8 LF bytes
`1690`, LF count `49`, CR count `0`, SHA-256
`751dcb35aed610ab729c663544edb979e6745f276e167370ace7cc9e761d4724`). The
snapshot is evidence only, is not a user override, and is used because the
official pages were available but not reliably fetchable from the current
Codex runtime. The Fang Gu and Witch URLs, revision bindings, and captured
claims are reproduced in the evidence file; the prior Fang Gu oldid is
historical context only and is not claimed to have been reread.

### C1 additive candidate contract

The implementation seam is an ordinary typed function, not a new schema or
validator:

```ts
type C1AdditiveDescriptorInputV1 = {
  readonly historical: StructuralSchemaCandidateV1;
  readonly additions: {
    readonly roots: readonly StructuralSchemaRootV1[];
    readonly nodeBindings: readonly StructuralSchemaNodeBindingV1[];
    readonly deltaBindings: readonly StructuralDeltaBindingV1[];
  };
};

type StructuralSchemaCandidateV1 = {
  readonly astVersion: "botc-domain-event-structural-schema-ast-v1";
  readonly traversalVersion: "botc-domain-event-structural-unique-node-traversal-v1";
  readonly normalizationVersion: "botc-domain-event-structural-normalization-v1";
  readonly expectedEventCount: number;
  readonly expectedBranchCount: number;
  readonly expectedExplicitVersionBranchCount: number;
  readonly expectedUnversionedBranchCount: number;
  readonly roots: readonly StructuralSchemaRootV1[];
  readonly nodeBindings: readonly StructuralSchemaNodeBindingV1[];
  readonly deltaBindings: readonly StructuralDeltaBindingV1[];
};
```

The constructor copies, never mutates, `historical`, appends additions, and
then calls the existing `createStructuralSchemaAuthority` exactly once on the
result. Additions must use event ordinals `41..N` and branch ordinals `60..M`,
with no gaps; branches for one event remain contiguous. The historical
projection is compared byte-for-byte by the existing canonical projection:
all protocol-version fields, roots through branch ordinal 59, node bindings
reachable from those roots, and the two approved delta bindings must have
zero additions, removals, replacements, or reordered canonical fields. The
candidate’s expected counts are the historical counts plus the appended
counts. No new hash algorithm is introduced: node IDs continue to use the
existing canonical structural representation and SHA-256 implementation that
produces `C1.SHA256.<64 lowercase hex>`; audit artifact hashes continue to use
the existing direct SHA-256 over canonical artifact bytes.

Failure is fail-closed with existing `StructuralSchemaHealthCodeV1` values:
`INVALID_OBJECT_SHAPE` (input shape), `INVALID_BRANCH_INVENTORY` (duplicate,
gap, or non-contiguous ordinals), `ORDINAL_LIMIT_EXCEEDED` (non-additive
ordinal), `NODE_BINDING_MISMATCH` (historical prefix drift),
`DUPLICATE_NODE_ID`/`DUPLICATE_NODE_OBJECT` (identity collision),
`UNRESOLVED_NODE_REFERENCE` (missing child), `INVALID_NODE_INVARIANT`
(non-canonical descriptor), `INVALID_DELTA_BINDING` (anything other than the
two frozen bindings), or `POST_FREEZE_AUDIT_FAILED` (final census/delta not
healthy). No generic security harness or second validator is introduced.

### Contract-closure ordinary-night S&V inventory (25 rows)

This active table has two independent authority dimensions. The nightsheet
columns are facts from the pinned official `otherNight` list
(`3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256
`99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`). The
runtime execution model is assigned from accepted architecture and ability
semantics, never mechanically from wake-slot presence. Because no ordinary-
night settlement path is accepted by this foundation, `baselineSupportStatus`
is `UNSUPPORTED` for every present row and `NOT_APPLICABLE` for absent rows.
`SUPPORTED` is empty.

| roleId | nightsheetOtherNightPresence | nightsheetOtherNightOrder | executionModel | taskKind | baselineSupportStatus | sourceBinding |
|---|---|---:|---|---|---|---|
| clockmaker | ABSENT | null | NONE | null | NOT_APPLICABLE | CATALOG+NIGHTSHEET |
| dreamer | PRESENT | 79 | SCHEDULED_TASK | DREAMER_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| snake_charmer | PRESENT | 23 | SCHEDULED_TASK | SNAKE_CHARMER_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| mathematician | PRESENT | 96 | SCHEDULED_TASK | MATHEMATICIAN_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| flowergirl | PRESENT | 80 | SCHEDULED_TASK | FLOWERGIRL_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| town_crier | PRESENT | 81 | SCHEDULED_TASK | TOWN_CRIER_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| oracle | PRESENT | 82 | SCHEDULED_TASK | ORACLE_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| savant | ABSENT | null | NONE | null | NOT_APPLICABLE | CATALOG+NIGHTSHEET |
| seamstress | PRESENT | 83 | SCHEDULED_TASK | SEAMSTRESS_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| philosopher | PRESENT | 11 | SCHEDULED_TASK | PHILOSOPHER_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| artist | ABSENT | null | NONE | null | NOT_APPLICABLE | CATALOG+NIGHTSHEET |
| juggler | PRESENT | 84 | SCHEDULED_TASK | JUGGLER_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| sage | PRESENT | 63 | EVENT_SUBSCRIPTION | null | UNSUPPORTED | CATALOG+NIGHTSHEET |
| mutant | ABSENT | null | NONE | null | NOT_APPLICABLE | CATALOG+NIGHTSHEET |
| sweetheart | PRESENT | 61 | EVENT_SUBSCRIPTION | null | UNSUPPORTED | CATALOG+NIGHTSHEET |
| barber | PRESENT | 60 | EVENT_SUBSCRIPTION | null | UNSUPPORTED | CATALOG+NIGHTSHEET |
| klutz | ABSENT | null | NONE | null | NOT_APPLICABLE | CATALOG+NIGHTSHEET |
| evil_twin | ABSENT | null | NONE | null | NOT_APPLICABLE | CATALOG+NIGHTSHEET |
| witch | PRESENT | 27 | ACTION_OPPORTUNITY | null | UNSUPPORTED | CATALOG+NIGHTSHEET+APPROVED_SNAPSHOT |
| cerenovus | PRESENT | 28 | SCHEDULED_TASK | CERENOVUS_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| pit_hag | PRESENT | 29 | SCHEDULED_TASK | PIT_HAG_ACTION | UNSUPPORTED | CATALOG+NIGHTSHEET |
| fang_gu | PRESENT | 45 | ACTION_OPPORTUNITY | null | UNSUPPORTED | CATALOG+NIGHTSHEET+APPROVED_SNAPSHOT |
| vigormortis | PRESENT | 49 | CONTINUOUS_RULE | null | UNSUPPORTED | CATALOG+NIGHTSHEET |
| no_dashii | PRESENT | 46 | CONTINUOUS_RULE | null | UNSUPPORTED | CATALOG+NIGHTSHEET |
| vortox | PRESENT | 47 | CONTINUOUS_RULE | null | UNSUPPORTED | CATALOG+NIGHTSHEET |

Invariants: ABSENT implies order `null`; `SCHEDULED_TASK` implies a non-null
task kind; non-scheduled models have a null task kind; and `SUPPORTED` requires
an existing executable path. The table has `roleCount=25`, `presentCount=19`,
`absentCount=6`, `baselineSupportedRoleCount=0`. `dawn` at ordinal 98 is a
nightsheet boundary, not a role row. Fang Gu and Witch remain unsupported; no
transfer, curse lifecycle, death, promotion, alignment, or next-day trigger is
implemented or inferred.

### Review and authorization boundary

The correction is design-only. It changes documentation/evidence only, leaves
C/C1/A/B and all product behavior untouched, and does not alter workflow,
coverage, routing, or Hosted CI. The independent reviewer must check the exact
snapshot hash, the typed seam and historical zero-delta comparison, all 25
inventory rows and ordinals, and the empty `SUPPORTED` set. Until that fresh
review returns `RULE_DESIGN_PASS`, `implementationAuthorized=false`.

## Historical prior design correction 2/2 — frozen authority binding and digest preimage

This final correction supersedes the earlier caller-supplied `historical`
field. The historical prefix is not an implementation-selected input. It is
bound internally to the exact candidate returned by
`createFullC1StructuralSchemaAuthority()` from
`packages/domain-core/src/domain-event-structural-schema-ast.ts`; if that
authority is unhealthy, the additive constructor returns the same
`StructuralSchemaAuthorityResultV1` failure and appends nothing.

The closed runtime contract is:

```ts
type C1AdditiveDescriptorInputV1 = {
  readonly additions: {
    readonly roots: readonly StructuralSchemaRootV1[];
    readonly nodeBindings: readonly StructuralSchemaNodeBindingV1[];
    readonly deltaBindings: readonly StructuralDeltaBindingV1[];
  };
};

declare function createC1AdditiveStructuralSchemaAuthority(
  input: C1AdditiveDescriptorInputV1
): StructuralSchemaAuthorityResultV1;
```

The function constructs a fresh candidate as
`frozenFullC1Candidate + input.additions`, then compares the complete frozen
prefix—not a self-comparison—before calling the existing
`createStructuralSchemaAuthority`. Prefix equality covers the three protocol
version literals, expected-count fields, every historical root in branch
ordinal order `1..59`, every reachable historical node binding in traversal
ordinal order, and both approved delta bindings. Any changed node field,
field order, branch, root, node ID, delta record, or count is a hard
`NODE_BINDING_MISMATCH`/`INVALID_BRANCH_INVENTORY` failure. Success returns the
existing `HEALTHY` result with its `StructuralSchemaCandidateV1`, traversal,
censuses, and health record; failure returns the existing `UNHEALTHY`
diagnostic with `failClosed=true`. There is no partial result or fallback
authority.

### Canonical identity and digest binding

The seam reuses the inherited C1 canonical representation; it does not add a
serializer. Node identity preimages are the exact `renderNode` representation
from `domain-event-structural-schema-catalog.ts`: ASCII structural tags,
`formatStructuralOrdinal` six-digit ordinals, deterministic DFS first
discovery, raw UTF-16 code-unit ordering where the existing comparator is
specified, and the existing `quote` escaping (including rejection of lone
surrogates). Canonical artifact bytes are the `TextEncoder` UTF-8 encoding of
the ordered lines joined by `LF` with one terminal `LF`; `CR` is never emitted.
The digest field is excluded from its own preimage. Artifact SHA-256 remains
the existing direct SHA-256 over those canonical bytes.

Where a runtime integrity record is required, the only accepted binding path
is the existing `createCanonicalValueIntegrity` /
`verifyCanonicalValueIntegrity` pair in
`packages/domain-core/src/canonical-runtime-hash.ts`, using the existing
`CANONICAL_VALUE_INTEGRITY` framed preimage, UTF-8 TLV bytes, byte-length
metadata, lowercase hexadecimal digest, and protocol/version fields. The
constructor may not call a new hash helper, alter escaping, normalize line
endings, include a digest inside its own input, or substitute a different
domain. Known-answer vectors must cover a historical node, field reordering,
one altered canonical byte, and identical bytes produced on Windows and
Linux.

This consumes the second and final foundation design correction slot (`2/2`);
any further contract change requires a new bounded reslice. Implementation
remains unauthorized until a fresh independent review of this exact commit
returns `RULE_DESIGN_PASS`.

## Contract-closure reslice (active, correction 0/2)

This section is the active `CONTRACT_CLOSURE_RESLICE`; the two sections above
are historical exhausted input and are not additional active corrections. The
reslice closes only F01–F05. It does not amend the prior reviewed commits, add
a second foundation, create C2, or change C/C1 descriptors.

### F01 state and F02 evidence truth

```text
priorFoundationDesignHead=7c76fa9b6898658c20ac218799590088917b718c
priorFoundationDesignCorrectionCount=2/2
priorFoundationDesignCorrectionBudgetRemaining=0
priorFoundationDesignDisposition=HISTORICAL_FOUNDATION_DESIGN_EXHAUSTED_PENDING_CONTRACT_CLOSURE_RESLICE
contractClosureResliceDesignCorrectionCount=0/2
contractClosureResliceDesignCorrectionBudgetRemaining=2
rootUserWorktreeTouched=false
```

The active evidence state is:

```text
sourceAvailabilityFailureHistorical=CODEX_RUNTIME_HTTP_418
resolution=USER_APPROVED_MINIMAL_OFFICIAL_ROLE_SOURCE_SNAPSHOT
activeSnapshotPath=docs/rules/evidence/2C-official-role-source-snapshot.md
activeSnapshotSHA256=751dcb35aed610ab729c663544edb979e6745f276e167370ace7cc9e761d4724
snapshotBytes=1690
snapshotLfCount=49
snapshotCrCount=0
snapshotStatus=APPROVED_ACTIVE_RULE_SOURCE_SNAPSHOT
```

The snapshot is not a USER_OVERRIDE and does not replace the preserved HTTP
418 history. No active statement claims that no snapshot exists or that it was
unused.

### F04 concrete C1 projection binding

The existing callable projection authority is:

```text
existingProjectionImplementationFile=packages/domain-core/src/domain-event-structural-schema-catalog.ts
existingProjectionExport=createCanonicalSchemaArtifact
existingProjectionVersion=botc-domain-event-structural-audit-projection-v1
```

`createCanonicalSchemaArtifact(healthyAuthority)` is the only projection path.
It uses the existing `buildArtifactLines`/`eventDescriptorLines`/`renderNode`
builders in that file and returns canonical `lines`, UTF-8 bytes, byte length,
and SHA-256. The seam must consume that output; it may not duplicate those
private builders or introduce a second format. If implementation needs a
prefix helper, it is a pure exposure/factorization of this same builder with
identical bytes, projection version, catalog version, and known-answer vectors.

Historical prefix equality is computed from the same projection output for
BEFORE and AFTER and checks, for events `1..40` and branches `1..59`: event
ordinal/type; branch ordinal/ID; version policy; root node ID; result type;
and reachable canonical node identity lines. Required deltas are:

```text
historicalEventPrefixDelta=0
historicalBranchPrefixDelta=0
historicalNodeIdentityDelta=0
historicalDescriptorSemanticDelta=0
```

The implementation tests repeated projection byte identity, one synthetic
append with exact historical prefix, deliberate historical mutation rejection,
and the existing accepted C1 projection vectors.

### F05 exact-empty delta policy and final additive seam

The active seam input is:

```ts
type ContractClosureAdditiveInputV1 = {
  readonly baseline: HealthyStructuralSchemaAuthorityV1;
  readonly additions: readonly {
    readonly eventOrdinal: number;
    readonly eventType: string;
    readonly branchOrdinal: number;
    readonly branchId: string;
    readonly versionPolicy: StructuralSchemaRootV1["versionPolicy"];
    readonly rootNodeId: string;
    readonly resultTypeName: string;
    readonly nodeBindings: readonly StructuralSchemaNodeBindingV1[];
    readonly deltaBindings: readonly [];
  }[];
};
```

`baseline` must be the exact healthy FULL_C1 authority/candidate from
`createFullC1StructuralSchemaAuthority()`. The output is exactly one
`StructuralSchemaCandidateV1`, formed by appending ordered additions; the
caller then invokes only `createStructuralSchemaAuthority(output)`. The seam
does not return a trusted authority directly. Baseline B26/B54 bindings remain
byte-identical, and `additions.deltaBindings` is always an empty tuple. A
non-empty additive delta fails closed with existing `INVALID_DELTA_BINDING`;
there is no delta-extension mechanism and no new error code.

The seam preflight is deliberately minimal: exact healthy FULL_C1 baseline;
first event ordinal `41`; dense event append; first branch ordinal `60`; dense
branch append; no historical event/branch/ID mutation; no duplicate IDs; and
empty additive deltas. Node graph invariants, unresolved references, exact
schema shape, freeze, census, and health remain delegated to the existing C1
validator.

### Downstream fresh 2C boundary

The foundation records `baselineSupportedTaskKinds=[]` and does not select a
role. A fresh 2C design may later add at most one bounded ordinary-night
capability, but only after fresh rule research and `RULE_DESIGN_PASS`; it may
not be Fang Gu or Witch and may not require broad effect-engine semantics.
The fixture condition becomes:

```text
requiredTaskKinds ⊆ baselineSupportedTaskKinds ∪ {oneNewBounded2CCapability}
```

Two or more new capabilities, a Fang Gu/Witch-only fixture, or any B18/Slice 3
dependency is `HUMAN_BLOCKED`.

### Active review gate

This contract-closure reslice currently has
`contractClosureResliceDesignCorrectionCount=0/2` and
`implementationAuthorized=false`. A fresh independent reviewer must return
F01–F05 all `CLOSED`, no new blocker, and `RULE_DESIGN_PASS` before any
Foundation implementation. No workflow, Hosted CI, product behavior, test
identity, coverage, routing, or dependency change is authorized by this design.
