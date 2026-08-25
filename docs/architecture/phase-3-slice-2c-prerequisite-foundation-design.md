# Phase 3 Slice 2C Prerequisite Foundation Design

Status: `FOUNDATION_DESIGN_REVIEW_REQUIRED`

This is a new bounded prerequisite foundation. It is not 2C Design Correction
Round 4 and does not modify the historical blocked design at
`a42df3c150faed4e6463e809dd1e26d9d3ab6fbe`.

## Frozen inputs

- Foundation base: `7fc337325f274c669a356a30c7485e2fdf134643`.
- Prior 2C design: `a42df3c150faed4e6463e809dd1e26d9d3ab6fbe`.
- Prior 2C design disposition: `HISTORICAL_BLOCKED_DESIGN_INPUT`.
- Prior 2C correction count: `3/3`.
- Foundation design correction count: `0/2`.
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

Foundation correction budget is `0/2` at design creation and `0/2` for
implementation repair. A requirement to mutate historical C1 semantics, add a
second validator/framework, implement role effects, or create a new playable
behavior is `HUMAN_BLOCKED` and requires a new bounded reslice.

## Required independent review

The reviewer must verify the C1 historical prefix delta is zero, the append
policy is deterministic, the existing validator is reused, the inventory is
nightsheet-derived for all 25 roles, Fang Gu/Witch remain unsupported, direct
URLs are present, and no product behavior is added. Until a complete fresh
review returns `RULE_DESIGN_PASS`, implementation remains unauthorized.

## Design correction 1/2 — exact seam, snapshot, and inventory contract

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

### Complete ordinary-night S&V inventory (25 rows)

The inventory is a fixed data table, sourced from the pinned nightsheet
(`3d6d930a9e600321f93b2567a2e88948a675bc1e`, SHA-256
`99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`) and the
`SECTS_AND_VIOLETS_ROLES@25` catalog. `PRESENT` means the role has an
`otherNight` slot; `ABSENT` means `order=null`, `taskKind=null`, and
`supportStatus=NOT_APPLICABLE`. Every present row is
`executionModel=SCHEDULED_TASK` and `supportStatus=UNSUPPORTED` in this
foundation: `SUPPORTED` is intentionally empty because no ordinary-night
settlement path is accepted here.

| roleId | presence | otherNight ordinal | taskKind | executionModel | supportStatus |
|---|---|---:|---|---|---|
| clockmaker | ABSENT | null | null | null | NOT_APPLICABLE |
| dreamer | PRESENT | 79 | DREAMER_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| snake_charmer | PRESENT | 23 | SNAKE_CHARMER_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| mathematician | PRESENT | 96 | MATHEMATICIAN_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| flowergirl | PRESENT | 80 | FLOWERGIRL_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| town_crier | PRESENT | 81 | TOWN_CRIER_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| oracle | PRESENT | 82 | ORACLE_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| savant | ABSENT | null | null | null | NOT_APPLICABLE |
| seamstress | PRESENT | 83 | SEAMSTRESS_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| philosopher | PRESENT | 11 | PHILOSOPHER_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| artist | ABSENT | null | null | null | NOT_APPLICABLE |
| juggler | PRESENT | 84 | JUGGLER_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| sage | PRESENT | 63 | SAGE_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| mutant | ABSENT | null | null | null | NOT_APPLICABLE |
| sweetheart | PRESENT | 61 | SWEETHEART_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| barber | PRESENT | 60 | BARBER_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| klutz | ABSENT | null | null | null | NOT_APPLICABLE |
| evil_twin | ABSENT | null | null | null | NOT_APPLICABLE |
| witch | PRESENT | 27 | WITCH_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| cerenovus | PRESENT | 28 | CERENOVUS_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| pit_hag | PRESENT | 29 | PIT_HAG_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| fang_gu | PRESENT | 45 | FANG_GU_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| vigormortis | PRESENT | 49 | VIGORMORTIS_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| no_dashii | PRESENT | 46 | NO_DASHII_ACTION | SCHEDULED_TASK | UNSUPPORTED |
| vortox | PRESENT | 47 | VORTOX_ACTION | SCHEDULED_TASK | UNSUPPORTED |

The table has `roleCount=25`, `presentCount=19`, `absentCount=6`, and
`supportedCount=0`. `dawn` is the nightsheet boundary at ordinal 98 and is not
a role row. Fang Gu and Witch remain explicitly unsupported; no transfer,
curse, death, promotion, or nomination-trigger behavior is inferred. A later
fixture census must stop rather than silently skip an unsupported present task.

### Review and authorization boundary

The correction is design-only. It changes documentation/evidence only, leaves
C/C1/A/B and all product behavior untouched, and does not alter workflow,
coverage, routing, or Hosted CI. The independent reviewer must check the exact
snapshot hash, the typed seam and historical zero-delta comparison, all 25
inventory rows and ordinals, and the empty `SUPPORTED` set. Until that fresh
review returns `RULE_DESIGN_PASS`, `implementationAuthorized=false`.
