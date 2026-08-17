# Phase 3 Slice 2B20B-P2F1R-C1 Design Correction Round 2

## Metadata

- sliceId: `2B20B-P2F1R-C1`
- designCorrectionRound: `2`
- currentHead: `30793b662b99bb7f4689811e56b91afe365c2fd4`
- branch: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`
- parentDesign: `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-round-1.md`
- parentDesignSha256: `275b8d17f3e01d830355627de90cc526f323b117c15c6a7bfcc41d5516b832f1`
- previousCorrection: `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-correction-round-1.md`
- previousCorrectionSha256: `7aa2d382669c5957255def6ae8257b8e89e72679076df9f61a6b237fa91d4898`
- correctionPath: `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-correction-round-2.md`
- ruleReady: `true`
- ruleSemanticsChanged: `false`
- eventSemanticsChanged: `false`
- allowlistChanged: `false`
- implementationAuthorized: `false`
- designReviewStatus: `PENDING_INDEPENDENT_REVIEW`

## 1. Authority and bounded scope

This document corrects only:

1. `C1-DR1-001_UNIQUE_NODE_ORDERING_NOT_FROZEN`;
2. `C1-DR1-002_SUPPORTING_AUTHORITY_ID_FORMAT_INVALID`.

The parent design and Design Correction Round 1 remain authoritative for every contract not explicitly replaced below.

This correction does not change:

- the 15-kind AST algebra;
- the 16-alias refinement whitelist;
- the `ID_STRING` predicate;
- AST health semantics except to make traversal order exact;
- the one-way AST-to-validator dependency;
- the canonical audit projection except for its required traversal-version field;
- unchanged A capture and TLV serialization;
- unchanged B `CANONICAL_VALUE_INTEGRITY`;
- catalog escaping or section grammar except for its required traversal-version metadata row;
- Seamstress B26 structure or behavior;
- event types, payload types, producers, replay, batch, snapshot, or state;
- `C1-C09A` classification;
- `C1-C09B` classification;
- the implementation allowlist;
- the prohibition on D or P2F work.

The following Design Correction Round 1 statements are replaced:

- any implicit or implementation-selected ordering of `CanonicalSchemaAuditProjectionV1.nodes`;
- supporting-authority IDs containing descriptive suffixes.

## 2. Canonical Unique Node Traversal V1

### 2.1 Protocol identity

```ts
export const DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION =
  "botc-domain-event-structural-unique-node-traversal-v1" as const;
```

The protocol has one purpose: derive the sole deterministic ordered unique-node sequence used by:

- health check 8;
- unique-node identity and cycle checks;
- `CanonicalSchemaAuditProjectionV1.nodes`;
- unchanged A capture and TLV serialization;
- unchanged B `CANONICAL_VALUE_INTEGRITY`;
- the V2 unique-node manifest;
- exact-byte and digest regression evidence.

No other traversal, sorted copy, renderer-local order, insertion order, or secondary node enumeration may be used.

### 2.2 Traversal strategy

The algorithm is:

```text
GLOBAL-BRANCH-ORDINAL ROOT ORDER
→ DEPTH-FIRST SEARCH
→ PREORDER NODE DISCOVERY
→ KIND-SPECIFIC CANONICAL CHILD ORDER
```

It is not BFS and not postorder.

A node receives its ordinal immediately when first discovered, before its children are visited.

Rationale:

- preorder binds a node before any outgoing reference is rendered;
- DFS permits deterministic active-path cycle detection;
- branch-ordered roots preserve the accepted 59-branch inventory;
- one traversal result can be reused without later sorting.

BFS, postorder, source-line order, object-property insertion order, map insertion order, filesystem order, and hash-table order are rejected alternatives.

## 3. Root start order

### 3.1 Canonical roots

Traversal starts from the 59 payload-branch roots.

The root sequence is the branches ordered by numeric `branchOrdinal` ascending:

```text
C-B01 root
C-B02 root
...
C-B59 root
```

The numeric domain is exactly:

```text
1 through 59
```

A branch ordinal is global, unique, dense, and one-based.

`eventOrdinal`, `eventType`, `branchId`, source declaration position, and registry insertion order do not override `branchOrdinal`.

### 3.2 Root construction policy

The branch descriptor set is first validated for:

- exactly 59 entries;
- unique `branchOrdinal`;
- complete ordinals `1..59`;
- unique `branchId`;
- exactly one root reference per branch;
- resolvable root `nodeId`.

After validation, the root sequence is canonicalized from the numeric branch ordinals.

The physical insertion order of:

- the descriptor object;
- the source declaration;
- the node repository;
- a map used to hold descriptors;

is ignored.

Changing physical insertion order while keeping all frozen identities and ordinals unchanged must produce identical traversal, projection, TLV bytes, digest, and catalog bytes.

Changing, duplicating, omitting, or making a branch ordinal non-dense makes the candidate unhealthy. It is not silently repaired.

### 3.3 Shared roots

If two or more branches reference the same valid node identity:

- the earliest `branchOrdinal` discovers the node;
- that first discovery assigns the node ordinal;
- later roots emit only their root reference;
- later roots do not duplicate the node in the unique-node sequence.

Root ownership remains one row per branch even when roots are shared.

## 4. Node identity and deduplication

### 4.1 Identity contract

`nodeId` is the canonical node identity.

Before or during traversal, the candidate must prove a bijection:

```text
one nodeId
↔
one exact node object
```

The following are unhealthy:

- one `nodeId` bound to two distinct node objects;
- one node object presented under two different `nodeId` values;
- an unresolved child `nodeId`;
- a child reference to an object whose declared `nodeId` differs from the reference;
- an orphan declared node not reached from any of the 59 roots.

Object identity is used only to detect inconsistent candidate declarations. It is never serialized, hashed, rendered, or exposed as authority.

### 4.2 First-discovery rule

Traversal maintains:

```ts
type NodeVisitState = "UNSEEN" | "VISITING" | "VISITED";
```

For an `UNSEEN` node:

1. validate the `nodeId` binding;
2. assign the next `nodeOrdinal`;
3. append the node once to the unique-node sequence;
4. mark it `VISITING`;
5. visit children in the frozen kind-specific order;
6. mark it `VISITED`.

For a `VISITED` node:

- emit or retain only the referencing `nodeId`;
- do not assign another ordinal;
- do not revisit its children.

No structural equality, digest equality, or value equality may merge two different `nodeId` values.

## 5. Ordinal contract

### 5.1 Node ordinal domain

`nodeOrdinal` is:

- dense;
- unique;
- one-based;
- assigned by first preorder discovery;
- in the numeric domain `1..999999`.

The first unique node is ordinal `1`, rendered as `000001`.

Ordinal `0` and rendered value `000000` are invalid.

### 5.2 ORD6 rendering

The existing Correction Round 1 grammar is refined as:

```text
ORD6 := one integer in 1..999999 rendered as exactly six ASCII digits
```

Examples:

```text
1      → 000001
9      → 000009
10     → 000010
999999 → 999999
```

No sign, separator, whitespace, locale digit, exponent, decimal point, or wider representation is permitted.

`nodeOrdinal` is presentation and deterministic-order evidence. `nodeId` remains identity.

## 6. Canonical child order by node kind

The traversal child sequence is exhaustive over all 15 node kinds.

### 6.1 Leaf kinds

These kinds have no child-node references:

- `NULL`;
- `BOOLEAN`;
- `SAFE_INTEGER`;
- `STRING`;
- `LITERAL`;
- `ENUM`.

Their child sequence is exactly:

```text
[]
```

Literal values and enum members are data, not child nodes.

### 6.2 `NULLABLE`

Child sequence:

```text
[childNodeId]
```

The sole nullable child is visited once.

### 6.3 `EXACT_RECORD`

The field order is frozen by raw UTF-16 code-unit comparison of `fieldName`.

The comparator is:

1. compare UTF-16 code units from index zero;
2. the lower unequal code unit sorts first;
3. when one string is a prefix of another, the shorter string sorts first;
4. no locale, collation, normalization, or case folding is used.

The field list must satisfy:

- field names are unique;
- `fieldOrdinal` values are dense and one-based;
- ordinal `1` is the first field in raw code-unit order;
- the physical field array is already in that canonical order.

A noncanonical field array is unhealthy. It is not silently sorted.

Child sequence:

```text
fields[0].childNodeId
fields[1].childNodeId
...
fields[n - 1].childNodeId
```

An empty exact record has child sequence `[]`.

### 6.4 `ARRAY`

Child sequence:

```text
[elementNodeId]
```

### 6.5 `NON_EMPTY_ARRAY`

Child sequence:

```text
[elementNodeId]
```

`minItems = 1` and `maxItems = null` do not add children.

### 6.6 `BOUNDED_ARRAY`

Child sequence:

```text
[elementNodeId]
```

`minItems` and `maxItems` do not add children.

### 6.7 `TUPLE`

Tuple position is structural meaning and is not sorted.

Child sequence is array-index order:

```text
elementNodeIds[0]
elementNodeIds[1]
...
elementNodeIds[tupleLength - 1]
```

The element list length must equal `tupleLength`.

A zero-length tuple has child sequence `[]`.

Reordering tuple elements is a structural mutation and must change the projection and digest when the resulting candidate remains otherwise valid.

### 6.8 Canonical literal comparator

`TAGGED_UNION` branch order and enum health checks use this closed comparator:

```text
NULL
<
BOOLEAN
<
SAFE_INTEGER
<
STRING
```

Within a kind:

- `BOOLEAN`: `false < true`;
- `SAFE_INTEGER`: numeric ascending comparison;
- `STRING`: raw UTF-16 code-unit comparison;
- `NULL`: only one value.

Negative zero is already forbidden. Strings are not normalized.

### 6.9 `TAGGED_UNION`

`tagField` is scalar metadata and is not a child.

Branches must satisfy:

- each branch has a unique tag literal;
- `branchOrdinal` is dense and one-based;
- tag literals are in canonical literal order;
- `branchOrdinal` corresponds to that order;
- the physical branch array is already in canonical order.

A noncanonical branch array is unhealthy and is not silently sorted.

Child sequence:

```text
branches[0].childNodeId
branches[1].childNodeId
...
branches[n - 1].childNodeId
```

The tag literal is rendered before the child reference in the branch row but does not create a traversal node.

An empty tagged union is unhealthy.

### 6.10 `CLOSED_UNION`

`selection` remains exactly `EXACTLY_ONE`.

Because closed-union branch identity is the referenced `nodeId`, its canonical branch order is raw UTF-16 code-unit order of `branchNodeId`.

Requirements:

- at least two branch references;
- unique `branchNodeId`;
- the physical branch array is already in canonical node-ID order.

A noncanonical array is unhealthy and is not silently sorted.

Child sequence is that canonical branch order.

This ordering does not introduce first-success behavior. Runtime acceptance still requires exactly one matching branch.

### 6.11 `REFINEMENT`

For both:

- `NON_EMPTY_TRIMMED_STRING`;
- `ID_STRING(alias)`;

child sequence is:

```text
[baseNodeId]
```

`refinementVersion`, `refinementKind`, and `alias` are scalar metadata. They never select another child or callback.

## 7. Candidate ordering policy

The policy is exact:

| Candidate surface | Policy |
|---|---|
| Node repository or map insertion order | Ignored |
| Event descriptor object-key insertion order | Ignored |
| Root sequence | Canonicalized from validated global `branchOrdinal` |
| `EXACT_RECORD.fields` | Must already be canonical; otherwise reject |
| `TAGGED_UNION.branches` | Must already be canonical; otherwise reject |
| `CLOSED_UNION.branchNodeIds` | Must already be canonical; otherwise reject |
| `TUPLE.elementNodeIds` | Preserved as structural index order |
| Single-child node references | Preserved |
| Enum values | Must already satisfy the existing canonical literal order; otherwise reject |
| Catalog renderer input | Must be the retained traversal result; independent sorting forbidden |

There is no general-purpose “sort whatever was supplied” fallback.

Canonicalization is allowed only where a validated set has a separate frozen ordinal identity: the 59 root descriptors.

## 8. Cycle detection

### 8.1 VISITING rule

DFS maintains the active traversal stack.

When a child reference targets:

- `UNSEEN`: discover normally;
- `VISITED`: retain a reference only;
- `VISITING`: detect a cycle immediately.

A `VISITING` reference yields an unhealthy traversal result containing the deterministic witness:

```ts
type CanonicalTraversalCycleWitnessV1 = {
  readonly kind: "CYCLE";
  readonly fromNodeId: string;
  readonly childOrdinal: number;
  readonly targetNodeId: string;
  readonly activeNodeIds: readonly string[];
  readonly failClosed: true;
};
```

`childOrdinal` is zero-based within the parent’s frozen child sequence. `activeNodeIds` contains the DFS stack from its root through `fromNodeId`.

The witness is health evidence only. It is not included in a healthy projection, digest, or catalog.

### 8.2 Cycle consequences

On cycle detection:

- traversal stops at the first canonical cycle witness;
- the candidate is unhealthy;
- the partially assigned ordinals are discarded;
- no authority, validator, projection, digest, or catalog is published;
- no alternate root or child order is attempted.

Self-cycles and multi-node cycles follow the same rule.

## 9. Retained traversal result

A successful health-check traversal produces exactly one recursively frozen value:

```ts
type CanonicalUniqueNodeTraversalV1 = {
  readonly traversalVersion:
    "botc-domain-event-structural-unique-node-traversal-v1";
  readonly rootBranchOrdinals: readonly number[];
  readonly rootNodeIds: readonly string[];
  readonly uniqueNodes: readonly {
    readonly nodeOrdinal: number;
    readonly nodeId: string;
  }[];
  readonly uniqueNodeCount: number;
  readonly rootReferenceCount: 59;
};
```

Requirements:

- `rootBranchOrdinals` is exactly `[1, 2, ..., 59]`;
- `rootNodeIds[index]` is the root of branch ordinal `index + 1`;
- `uniqueNodes` is exactly the DFS preorder result;
- `uniqueNodeCount === uniqueNodes.length`;
- every assigned ordinal equals its array index plus one;
- every declared node occurs exactly once in `uniqueNodes`;
- every reference resolves to one entry;
- the value and all nested arrays and records are frozen.

Health check 8 creates and retains this value. Projection, digest, and catalog generation must consume this exact retained value. They may not rerun traversal.

Later health checks may validate the retained result, but may not reorder it.

## 10. Projection correction

Design Correction Round 1’s `CanonicalSchemaAuditProjectionV1` gains exactly one required field:

```ts
type CanonicalSchemaAuditProjectionV1 = {
  readonly projectionVersion:
    "botc-domain-event-structural-audit-projection-v1";
  readonly traversalVersion:
    "botc-domain-event-structural-unique-node-traversal-v1";
  readonly astVersion:
    "botc-domain-event-structural-schema-ast-v1";
  readonly refinementVersion:
    "botc-domain-event-structural-refinement-v1";
  readonly catalogVersion:
    "botc-domain-event-structural-audit-catalog-v2";
  readonly validatorVersion:
    "botc-domain-event-structural-validator-from-ast-v1";
  readonly health: AuditHealthV1;
  readonly descriptors: readonly AuditEventDescriptorV1[];
  readonly branches: readonly AuditPayloadBranchV1[];
  readonly nodes: readonly AuditSchemaNodeV1[];
  readonly rootOwnership: readonly AuditRootOwnershipV1[];
  readonly uniqueGraphCensus: AuditSchemaCensusV1;
  readonly expandedOccurrenceCensus: AuditSchemaCensusV1;
};
```

`nodes` is populated only from `CanonicalUniqueNodeTraversalV1.uniqueNodes`.

For each traversal entry:

- projection `nodeOrdinal` is copied unchanged;
- projection `nodeId` is copied unchanged;
- remaining node fields are projected from that exact node;
- child references remain `nodeId` references;
- no second ordering pass occurs.

The traversal version participates in unchanged A capture, A TLV bytes, and unchanged B digest.

## 11. Catalog correction

### 11.1 Metadata row

In the Correction Round 1 metadata section, insert this exact row immediately after `projectionVersion`:

```text
M|traversalVersion="botc-domain-event-structural-unique-node-traversal-v1"
```

The metadata prefix is therefore:

```text
M|artifactStatus="GENERATED_AUDIT_ARTIFACT_NON_RUNTIME_AUTHORITY"
M|projectionVersion="botc-domain-event-structural-audit-projection-v1"
M|traversalVersion="botc-domain-event-structural-unique-node-traversal-v1"
M|sourceAstVersion="botc-domain-event-structural-schema-ast-v1"
```

All remaining metadata rows retain their Correction Round 1 order.

### 11.2 Unique-node rows

The unique-node manifest emits one `N|...` row per retained traversal entry.

Rows are emitted in ascending `nodeOrdinal`, which is identical to retained array order.

No renderer-local sort is permitted.

Child references continue to use escaped `nodeId` through `Q`. They never substitute the referenced node ordinal.

Forward and backward references are both valid because node identity is `nodeId`.

### 11.3 Empty lists and references

Correction Round 1 byte grammar is retained:

- an empty list is exactly `[]`;
- a non-empty list is `[x(,x)*]`;
- there is no whitespace inside lists;
- node references are `Q(nodeId)`;
- ordinals use corrected one-based `ORD6`;
- no missing list is represented by `null`;
- no empty list is omitted.

Examples:

```text
N|000001|kind=EXACT_RECORD|nodeId="root"|fields=[]
N|000002|kind=TUPLE|nodeId="empty-tuple"|tupleLength=0|elements=[]
N|000003|kind=CLOSED_UNION|nodeId="union"|selection=EXACTLY_ONE|branches=["a","b"]
```

The first two examples are grammar examples; actual AST health rules still decide whether a given empty construct is allowed.

## 12. Digest alignment

The digest chain remains exactly:

```text
retained CanonicalUniqueNodeTraversalV1
→ CanonicalSchemaAuditProjectionV1
→ captureCanonicalRuntimeValue
→ serializeCanonicalRuntimeValue
→ createCanonicalValueIntegrity
```

The traversal implementation must not:

- hash node repository insertion order;
- hash object identities;
- hash memory addresses;
- hash source locations;
- sort the projection after A capture;
- reconstruct child order in the catalog generator;
- introduce JSON or another serializer;
- use `localeCompare`, `Intl.Collator`, time, randomness, paths, or environment data.

Equivalent candidate graphs differing only in ignored repository or descriptor insertion order must yield identical:

- traversal result;
- projection;
- A TLV bytes;
- B digest;
- catalog bytes.

A semantic child-order, literal, ordinal, node-ID, or reference mutation must either:

- make the candidate unhealthy; or
- produce different projection, TLV, digest, and catalog bytes when the mutated graph remains valid.

## 13. Golden regression vectors

The future implementation must materialize all vectors below within the unchanged C1 test allowlist.

### TRV-01 — Root ordering

Input:

- branch ordinals supplied through a physically reordered descriptor container;
- identities and ordinal values remain valid.

Expected:

- root order is `1..59`;
- traversal output equals the canonical baseline byte-for-byte.

### TRV-02 — Invalid root ordinal

Mutations:

- duplicate ordinal;
- missing ordinal;
- ordinal zero;
- non-dense ordinal;
- ordinal greater than 59.

Expected:

- unhealthy before projection;
- no digest or catalog.

### TRV-03 — DFS preorder with shared nodes

Canonical graph:

```text
branch 1 root R1
R1 EXACT_RECORD children: S, A
A ARRAY child: N
branch 2 root R2
R2 TUPLE children: S, N
```

Expected unique sequence:

```text
000001 R1
000002 S
000003 A
000004 N
000005 R2
```

`S` and `N` appear once. Branch 2 retains references only.

### TRV-04 — Repository insertion independence

Declare the TRV-03 node repository in at least two opposite physical insertion orders.

Expected:

- identical traversal;
- identical projection;
- identical TLV;
- identical digest;
- identical catalog.

### TRV-05 — Exact-record order

Vectors:

- fields already in raw code-unit order;
- two fields swapped;
- field ordinals duplicated;
- field ordinals non-dense;
- field ordinal not matching code-unit position.

Expected:

- canonical vector passes;
- every invalid vector is unhealthy;
- no silent sorting.

### TRV-06 — Tagged-union order

Vectors:

- canonical literal order;
- physical branch swap;
- duplicate tag literal;
- branch ordinal mismatch;
- branch ordinal gap.

Expected:

- canonical vector passes;
- every mutation is unhealthy;
- direct dispatch behavior remains unchanged.

### TRV-07 — Closed-union order

Vectors:

- branch node IDs in raw code-unit order;
- swapped node IDs;
- duplicate node ID;
- one-branch union.

Expected:

- canonical vector passes;
- every invalid vector is unhealthy;
- no first-success behavior is introduced.

### TRV-08 — Tuple semantic order

Create two otherwise valid tuples with reversed child positions.

Expected:

- both retain their declared index order;
- their projections differ;
- their TLV bytes and digests differ;
- neither is normalized by node ID.

### TRV-09 — All node-kind child matrix

One fixture must bind each of the 15 node kinds to its exact child sequence:

- six leaf kinds produce `[]`;
- `NULLABLE`, all three array kinds, and both refinement variants produce one child;
- `EXACT_RECORD`, `TUPLE`, `TAGGED_UNION`, and `CLOSED_UNION` follow their frozen ordered lists.

Expected:

- the explicit expected node-ID preorder matches exactly.

### TRV-10 — Shared-node deduplication

Multiple parent edges and multiple roots reference the same node.

Expected:

- one node ordinal;
- multiple preserved `nodeId` references;
- unique-node census counts the node once;
- expanded-occurrence census counts every occurrence according to the existing census contract.

### TRV-11 — Identity violations

Vectors:

- duplicate `nodeId` with different objects;
- one object under different IDs;
- unresolved child;
- child/object ID mismatch;
- orphan node.

Expected:

- unhealthy;
- no projection, digest, or catalog.

### TRV-12 — Cycle detection

Vectors:

- direct self-cycle;
- two-node cycle;
- longer cycle;
- shared acyclic node.

Expected:

- cycle vectors stop at the first canonical `VISITING` edge;
- partial ordinals are discarded;
- shared acyclic vector succeeds as a reference-only revisit.

### TRV-13 — ORD6 boundaries

Expected exact encodings:

```text
1 → 000001
9 → 000009
10 → 000010
999999 → 999999
```

Zero, negative values, locale digits, and values above `999999` fail health.

### TRV-14 — Empty list grammar

Golden rows cover:

- empty record fields;
- empty tuple elements;
- leaf child sequence;
- non-empty union references.

Expected:

- exact `[]`;
- no spaces;
- no `null`;
- no omitted field.

### TRV-15 — Traversal version binding

Mutate only `traversalVersion` in a detached projection vector.

Expected:

- A TLV differs;
- B digest differs;
- catalog metadata differs.

A runtime candidate with an unsupported traversal version is unhealthy.

### TRV-16 — Single-sequence consumption

A dependency and instrumentation audit proves:

- health check 8 runs traversal once;
- projection consumes its retained result;
- digest consumes that projection;
- catalog consumes the same projection/node order;
- no independent renderer sort or secondary graph walk exists.

## 14. Supporting-authority ID correction

### 14.1 Exact terminal IDs

The only supporting-authority IDs introduced by C1 are:

```text
SUP-2B20B-P2F1R-C1-001
SUP-2B20B-P2F1R-C1-002
```

These conform exactly to:

```text
SUP-<slice-or-task>-NNN
```

No descriptive suffix may follow `NNN`.

The former suffixed identities are invalid and must not appear in implementation traceability.

### 14.2 Design-time authority ledger

| SupportingAuthorityId | AuthorityDescription | LedgerState | Purpose | ExpectedAuthorityStatus | MutationExpectation | UsedByCriteria |
|---|---|---|---|---|---|---|
| `SUP-2B20B-P2F1R-C1-001` | `Accepted Seamstress B26 shape` | `PLANNED_SUPPORTING_AUTHORITY` | Bind B26 cardinality evidence to an authentic accepted Seamstress public payload shape without replacing the AST validator as the primary mechanism. | `ACCEPTED` | The authentic support remains immutable. Negative vectors use detached clones; mutation never changes the source authority’s accepted status. | `C1-C10` |
| `SUP-2B20B-P2F1R-C1-002` | `Immutable V1 migration baseline` | `PLANNED_SUPPORTING_AUTHORITY` | Bind the test-only bounded-delta audit to the immutable V1 artifact and its frozen SHA-256. | `LEGACY` | The source artifact remains immutable. SHA or parsed-structure mutations use detached hostile clones and never rewrite the baseline. | `C1-C13` |

`AuthorityDescription` carries descriptive text previously embedded in the invalid IDs. It is not part of identity.

### 14.3 Implementation-time required fields

Each ID must resolve exactly once in implementation traceability with all fields below:

```ts
type C1SupportingAuthorityBinding = {
  readonly SupportingAuthorityId:
    | "SUP-2B20B-P2F1R-C1-001"
    | "SUP-2B20B-P2F1R-C1-002";
  readonly AuthorityDescription: string;
  readonly Producer: string;
  readonly SourceTestOrFixture: string;
  readonly AuthorityStatus: "ACCEPTED" | "LEGACY" | "HOSTILE";
  readonly UsedByCriteria: readonly string[];
  readonly MutationDisposition:
    | "NONE"
    | "CLONE_MUTATED"
    | "PERSISTED_OR_IMPORTED_MUTATED";
};
```

Open strings in this documentation type do not authorize placeholder values. Implementation must bind concrete, reviewable identities.

For `SUP-2B20B-P2F1R-C1-001`:

- `AuthorityDescription` is exactly `Accepted Seamstress B26 shape`;
- `Producer` identifies the concrete accepted producer or accepted event-shape construction path;
- `SourceTestOrFixture` identifies one exact existing source test title or fixture path containing the authentic accepted B26 shape;
- `AuthorityStatus` is exactly `ACCEPTED`;
- `UsedByCriteria` is exactly `["C1-C10"]`;
- the authentic ledger row has `MutationDisposition = "NONE"`;
- detached negative clones are recorded by the primary test mechanism as `CLONE_MUTATED`, not by changing the accepted support row.

For `SUP-2B20B-P2F1R-C1-002`:

- `AuthorityDescription` is exactly `Immutable V1 migration baseline`;
- `Producer` identifies the C V1 schema-catalog materialization artifact;
- `SourceTestOrFixture` is exactly `docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md`;
- `AuthorityStatus` is exactly `LEGACY`;
- `UsedByCriteria` is exactly `["C1-C13"]`;
- the immutable ledger row has `MutationDisposition = "NONE"`;
- detached SHA or parsed-structure mutations are primary hostile inputs and do not mutate the legacy support row.

The implementation may record a fixture hash or revision in addition to these fields, but may not omit or rename any required field.

### 14.4 Supporting-only boundary

Neither support may:

- determine the primary layer;
- replace the primary assertion;
- replace the AST-derived validator;
- replace the exact-byte comparator;
- replace the V1 SHA-bound parser and bounded-delta comparator;
- establish event occurrence, producer legitimacy, replay validity, state validity, or accepted-history authority.

## 15. Traceability corrections

`C1-C09A` and `C1-C09B` remain exactly:

| CriterionId | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer |
|---|---|---|---|
| `C1-C09A` | `R3` | `T3` | `STRUCTURAL_VALIDATION` |
| `C1-C09B` | `R4` | `T3` | `PURE_POLICY_SEAM` |

Their rule claims, completion criteria, evidence mechanisms, expected results, and supporting-authority requirements remain unchanged from Design Correction Round 1.

Only the following authority references are replaced:

| CriterionId | SupportingAuthorityRequirement |
|---|---|
| `C1-C10` | `SUP-2B20B-P2F1R-C1-001` |
| `C1-C13` | `SUP-2B20B-P2F1R-C1-002` |

The implementation-time traceability table must retain all design-time expected fields and add:

- `ActualTestFile`;
- `ActualTestTitle`;
- `ActualPrimaryLayer`;
- `ActualReachability`;
- `ActualTrust`;
- `SupportingAuthorityId`;
- `MechanismMatch`.

Every authority ID must resolve exactly once to the implementation-time ledger defined above.

`R1 = {}` and `R2 = {}` remain unchanged.

## 16. Allowlist

The allowlist is unchanged.

Permitted production files:

- `packages/domain-core/src/domain-event-structural-schema-ast.ts`
- `packages/domain-core/src/domain-event-structural-schema-validator.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.ts`

Permitted test files:

- `packages/domain-core/src/domain-event-structural-schema-ast.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-validator.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`

Permitted implementation-stage documentation remains:

- the generated V2 catalog;
- C1 implementation traceability;
- one C1 implementation-review artifact.

No root export or `index.ts` change is authorized.

Still forbidden:

- A or B modifications;
- event-definition or payload-type modifications;
- the unaccepted legacy C implementation;
- Seamstress production or test changes;
- producer, replay, batch, snapshot, state, application, projection, or role changes;
- workflow, ownership, coverage, or CI changes;
- D or P2F work.

This design-correction document is a design artifact and does not expand the implementation allowlist.

## 17. Acceptance checks for a later authorized implementation

A later implementation is acceptable only if:

1. the retained traversal version is exact;
2. root traversal begins in global branch-ordinal order;
3. DFS preorder is used;
4. node ordinals are dense, one-based, and first-discovery assigned;
5. every node-kind child order matches this document;
6. node identity and deduplication are `nodeId`-based after the object-identity bijection check;
7. cycles fail at the first canonical `VISITING` reference;
8. insertion-order-only changes produce identical bytes;
9. invalid semantic order fails or changes the digest as specified;
10. health, projection, digest, and catalog consume one retained sequence;
11. all 16 golden traversal vectors pass;
12. only the two terminal SUP IDs occur;
13. both support rows contain every required implementation-time field;
14. `C1-C09A` and `C1-C09B` classifications remain unchanged;
15. the allowlist audit finds no out-of-scope file.

## 18. Stop conditions

Stop without implementation or publication if:

- a second traversal or renderer-specific node order is required;
- any node kind lacks a deterministic child sequence;
- ordering requires locale or source insertion order;
- canonical ordering would change event semantics;
- a node cannot satisfy the `nodeId`/object bijection;
- cycles cannot fail closed before authority publication;
- the projection, digest, and catalog cannot consume the same retained sequence;
- an ordinal above `999999` is required;
- a supporting authority needs an ID outside the two frozen terminal IDs;
- an implementation-time supporting-authority field cannot be concretely bound;
- A, B, event types, Seamstress behavior, or the allowlist would need modification;
- D or P2F work becomes necessary.

## 19. Independent review handoff

The independent reviewer must verify:

1. root order is globally and uniquely frozen;
2. DFS preorder and first-discovery ordinal assignment are unambiguous;
3. all 15 node kinds have exact child order;
4. exact-record, tagged-union, closed-union, tuple, and refinement ordering cannot depend on insertion order;
5. shared nodes are emitted once and later referenced;
6. `nodeId` identity and object-identity conflict detection are distinct;
7. `VISITING` cycle detection is deterministic and fail closed;
8. `ORD6`, empty lists, child references, traversal version, projection, digest, and catalog are aligned;
9. health check 8, projection, digest, and catalog consume one retained sequence;
10. golden regression vectors cover every ordering and identity boundary;
11. the only SUP IDs are `SUP-2B20B-P2F1R-C1-001` and `SUP-2B20B-P2F1R-C1-002`;
12. descriptions no longer appear inside SUP IDs;
13. purpose, status, mutation, consumers, and implementation-time binding fields are complete;
14. `C1-C09A` remains `R3/T3/STRUCTURAL_VALIDATION`;
15. `C1-C09B` remains `R4/T3/PURE_POLICY_SEAM`;
16. no other frozen contract or allowlist boundary changed.

The reviewer, not this document, supplies the design verdict.

## 20. Self-check

- `C1-DR1-001` addressed with one versioned, deterministic traversal: yes.
- Root order frozen: yes.
- DFS/BFS choice frozen: DFS.
- Preorder/postorder choice frozen: preorder.
- All node-kind child orders frozen: yes.
- Shared-node ordinal rule frozen: dense one-based first discovery.
- Candidate insertion-order policy frozen: yes.
- Cycle detection frozen: tri-color `VISITING`.
- Projection, digest, and catalog sequence unified: yes.
- Golden regression vectors complete: 16.
- `C1-DR1-002` terminal SUP IDs corrected: yes.
- `AuthorityDescription` separated from identity: yes.
- Implementation-time authority fields required: yes.
- `C1-C09A` classification changed: no.
- `C1-C09B` classification changed: no.
- A/B changed: no.
- Event or Seamstress behavior changed: no.
- Allowlist expanded: no.
- D/P2F started: no.
- Implementation authorized: no.
- Review verdict asserted here: no.

READY_FOR_INDEPENDENT_C1_DESIGN_CORRECTION_ROUND_2_REVIEW
