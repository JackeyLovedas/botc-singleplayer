# Phase 3 Slice 2B20B-P2F1R-C1 Design Correction Round 1

## Metadata

- sliceId: `2B20B-P2F1R-C1`
- designCorrectionRound: `1`
- currentHead: `30793b662b99bb7f4689811e56b91afe365c2fd4`
- branch: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`
- parentDesign: `docs/architecture/2B20B-P2F1R-C1-typed-structural-schema-authority-design-round-1.md`
- parentDesignSha256: `275b8d17f3e01d830355627de90cc526f323b117c15c6a7bfcc41d5516b832f1`
- ruleEvidence: `docs/rules/evidence/2B20B-P2F1R-C1.md`
- ruleEvidenceSha256: `a484067a98056e83d11f9b41fadfa1140d738c811850a139075bd57cfe0650fe`
- ruleReady: `true`
- ruleSemanticsChanged: `false`
- eventSemanticsChanged: `false`
- implementationAuthorized: `false`
- designReviewStatus: `PENDING_INDEPENDENT_REVIEW`

## 1. Correction authority and scope

This correction preserves the parent design except where this document explicitly replaces its contracts for:

1. refinement aliases and `ID_STRING`;
2. canonical audit projection, digest bytes, and catalog bytes;
3. `C1-C09` traceability classification;
4. planned supporting authorities for `C1-C10` and `C1-C13`;
5. the V1 bounded-delta audit.

The following parent contracts remain unchanged:

- the Typed Structural Schema AST is the sole runtime structural authority;
- the runtime validator is derived one-way from a healthy AST;
- the generated catalog is a non-authoritative audit artifact;
- A capture/TLV and B hashing remain unchanged;
- Seamstress B26 `KNOWN_INEFFECTIVE.representedImpairments` is a non-empty variable array with `minItems = 1` and no fixed maximum;
- all event semantics, producers, stateful validation, replay, batch, snapshot, A, and B behavior remain unchanged;
- the parent implementation allowlist remains unchanged;
- D and P2F remain out of scope.

The following parent statements are revoked:

- an implementation-defined refinement alias set;
- an implementation-defined audit projection shape;
- an implementation-defined catalog escaping grammar;
- combined runtime/static classification under one `C1-C09` criterion;
- implementation-time assignment of supporting-authority identities;
- a V1 bounded-delta audit without an executable test-only mechanism.

## 2. F01 — Refinement ID contract closure

### 2.1 Closed refinement representation

`REFINEMENT` remains a closed tagged union:

```ts
type StructuralRefinementNodeV1 =
  | {
      readonly kind: "REFINEMENT";
      readonly nodeId: string;
      readonly refinementVersion:
        "botc-domain-event-structural-refinement-v1";
      readonly refinementKind: "NON_EMPTY_TRIMMED_STRING";
      readonly baseNodeId: string;
    }
  | {
      readonly kind: "REFINEMENT";
      readonly nodeId: string;
      readonly refinementVersion:
        "botc-domain-event-structural-refinement-v1";
      readonly refinementKind: "ID_STRING";
      readonly alias: StructuralIdAliasV1;
      readonly baseNodeId: string;
    };
```

Both variants require `baseNodeId` to resolve to a `STRING` node. No callback, function reference, registry extension, parser, coercion hook, or external lookup is permitted.

### 2.2 Complete V1 alias whitelist

```ts
type StructuralIdAliasV1 =
  | "AbilityImpairmentId"
  | "AbilityInstanceId"
  | "AbilityUseEntitlementId"
  | "ActionOpportunityId"
  | "CandidateId"
  | "DreamerApparentPairCandidateId"
  | "EventId"
  | "FirstNightAbilityInstanceId"
  | "FirstNightAbilityOutcomeFactId"
  | "GameId"
  | "GrantedAbilityId"
  | "MathematicianDeliveryId"
  | "PlayerId"
  | "RoleId"
  | "RoleTenureId"
  | "ScheduledTaskId";
```

This is the complete whitelist. It is ordered by raw UTF-16 code unit and is not extensible at runtime.

An alias is nominal audit identity only. Every alias uses the same predicate and cannot select behavior.

### 2.3 Exact `ID_STRING` predicate

After the authenticated A backing has produced a primitive string, `ID_STRING(alias)` succeeds exactly when:

```text
value.length > 0
AND
value === intrinsicTrim(value)
```

`intrinsicTrim` is the module-captured intrinsic `%String.prototype.trim%`, invoked through the captured intrinsic call path. It performs no object coercion.

Consequences:

- `""` fails;
- whitespace-only strings fail;
- leading whitespace fails;
- trailing whitespace fails;
- an otherwise non-empty string with internal whitespace is not rejected by this structural predicate;
- no semantic ID grammar, prefix, role lookup, player lookup, history lookup, or producer lookup is performed.

### 2.4 Unknown alias behavior

An unknown alias is an AST health failure before authority publication.

The internal health diagnostic is exactly:

```ts
type UnsupportedRefinementAliasHealthDiagnostic = {
  readonly code: "UNSUPPORTED_REFINEMENT_ALIAS";
  readonly phase: "REFINEMENT_REGISTRY_VALIDATION";
  readonly nodeId: string;
  readonly path: readonly [
    {
      readonly kind: "AST_NODE";
      readonly nodeId: string;
    },
    {
      readonly kind: "FIELD";
      readonly field: "alias";
    }
  ];
  readonly failClosed: true;
};
```

Effects:

- authority status becomes `UNHEALTHY`;
- no validator, projection, digest, or catalog is published;
- the public validator returns its existing `AUTHORITY_UNHEALTHY` diagnostic;
- the alias is never interpreted as a callback name.

### 2.5 Required refinement evidence

Runtime refinement vectors must cover:

- all 16 legal aliases;
- empty string;
- whitespace-only strings;
- leading whitespace;
- trailing whitespace;
- primitive type mismatch;
- valid internal whitespace.

Static evidence must prove:

- the refinement AST contains no function-valued member;
- alias lookup yields only membership validation;
- all aliases dispatch to the same predicate;
- no callback, coercion, `valueOf`, `toString`, iterator, role lookup, state lookup, replay lookup, or external registry is reachable.

## 3. F02 — Canonical audit projection

### 3.1 Projection protocol

```ts
const DOMAIN_EVENT_STRUCTURAL_AUDIT_PROJECTION_VERSION =
  "botc-domain-event-structural-audit-projection-v1" as const;
```

Only a healthy, recursively frozen AST can produce this projection. Every object is an exact record; every array is dense and immutable. Extra own keys, missing keys, accessors, symbols, cycles, sparse arrays, and nonplain objects are forbidden.

### 3.2 Closed literal projection

```ts
type AuditLiteralV1 =
  | { readonly kind: "NULL" }
  | { readonly kind: "BOOLEAN"; readonly value: boolean }
  | { readonly kind: "SAFE_INTEGER"; readonly decimal: string }
  | { readonly kind: "STRING"; readonly value: string };
```

`SAFE_INTEGER.decimal` is ASCII:

```text
0
or
-?[1-9][0-9]*
```

Negative zero, leading plus, leading zeroes, exponent notation, decimal points, `NaN`, and infinities are forbidden.

### 3.3 Version and result identity

```ts
type AuditVersionPolicyV1 =
  | {
      readonly kind: "UNVERSIONED";
    }
  | {
      readonly kind: "EXPLICIT_LITERAL";
      readonly fieldName: string;
      readonly acceptedLiteral: AuditLiteralV1;
    };

type AuditResultIdentityV1 = {
  readonly eventType: string;
  readonly resultTypeName: string;
};
```

### 3.4 Descriptor, branch, and root projections

```ts
type AuditEventDescriptorV1 = {
  readonly eventOrdinal: number;
  readonly eventType: string;
  readonly resultIdentity: AuditResultIdentityV1;
  readonly branchOrdinals: readonly number[];
};

type AuditPayloadBranchV1 = {
  readonly branchOrdinal: number;
  readonly branchId: string;
  readonly eventOrdinal: number;
  readonly eventType: string;
  readonly versionPolicy: AuditVersionPolicyV1;
  readonly rootNodeId: string;
  readonly resultIdentity: AuditResultIdentityV1;
};

type AuditRootOwnershipV1 = {
  readonly branchOrdinal: number;
  readonly branchId: string;
  readonly rootNodeId: string;
};
```

Ordering is frozen:

- descriptors by `eventOrdinal`;
- branches by `branchOrdinal`;
- descriptor `branchOrdinals` numerically ascending;
- root ownership by `branchOrdinal`;
- strings used for health comparisons by raw UTF-16 code-unit order.

### 3.5 Closed node projection

```ts
type AuditRecordFieldV1 = {
  readonly fieldOrdinal: number;
  readonly fieldName: string;
  readonly required: true;
  readonly optional: false;
  readonly childNodeId: string;
};

type AuditTaggedBranchV1 = {
  readonly branchOrdinal: number;
  readonly tagLiteral: AuditLiteralV1;
  readonly childNodeId: string;
};

type AuditSchemaNodeV1 =
  | { readonly nodeOrdinal: number; readonly nodeId: string; readonly kind: "NULL" }
  | { readonly nodeOrdinal: number; readonly nodeId: string; readonly kind: "BOOLEAN" }
  | { readonly nodeOrdinal: number; readonly nodeId: string; readonly kind: "SAFE_INTEGER" }
  | { readonly nodeOrdinal: number; readonly nodeId: string; readonly kind: "STRING" }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "LITERAL";
      readonly literal: AuditLiteralV1;
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "ENUM";
      readonly values: readonly AuditLiteralV1[];
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "NULLABLE";
      readonly childNodeId: string;
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "EXACT_RECORD";
      readonly fields: readonly AuditRecordFieldV1[];
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "ARRAY";
      readonly elementNodeId: string;
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "NON_EMPTY_ARRAY";
      readonly minItems: 1;
      readonly maxItems: null;
      readonly elementNodeId: string;
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "BOUNDED_ARRAY";
      readonly minItems: number;
      readonly maxItems: number;
      readonly elementNodeId: string;
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "TUPLE";
      readonly tupleLength: number;
      readonly elementNodeIds: readonly string[];
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "TAGGED_UNION";
      readonly tagField: string;
      readonly branches: readonly AuditTaggedBranchV1[];
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "CLOSED_UNION";
      readonly selection: "EXACTLY_ONE";
      readonly branchNodeIds: readonly string[];
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "REFINEMENT";
      readonly refinementVersion:
        "botc-domain-event-structural-refinement-v1";
      readonly refinementKind: "NON_EMPTY_TRIMMED_STRING";
      readonly baseNodeId: string;
    }
  | {
      readonly nodeOrdinal: number;
      readonly nodeId: string;
      readonly kind: "REFINEMENT";
      readonly refinementVersion:
        "botc-domain-event-structural-refinement-v1";
      readonly refinementKind: "ID_STRING";
      readonly alias: StructuralIdAliasV1;
      readonly baseNodeId: string;
    };
```

Field arrays use `fieldOrdinal`; enum values use canonical literal order; tuple and union arrays preserve declared ordinal order. Shared nodes appear once in `nodes` and are referenced only by `nodeId`.

### 3.6 Census and health projection

```ts
type AuditSchemaCensusV1 = {
  readonly events: number;
  readonly roots: number;
  readonly rootReferences: number;
  readonly nodes: number;
  readonly childReferences: number;
  readonly exactRecords: number;
  readonly recordFields: number;
  readonly requiredFields: number;
  readonly optionalFields: number;
  readonly arrays: number;
  readonly nonEmptyArrays: number;
  readonly boundedArrays: number;
  readonly tuples: number;
  readonly taggedUnions: number;
  readonly closedUnions: number;
  readonly nullableNodes: number;
  readonly enums: number;
  readonly literals: number;
  readonly strings: number;
  readonly safeIntegers: number;
  readonly booleans: number;
  readonly idRefinements: number;
  readonly unresolvedReferences: number;
  readonly cycles: number;
  readonly openRecords: number;
  readonly additionalPropertiesNodes: number;
  readonly requiredUndefinedFields: number;
};

type AuditHealthV1 = {
  readonly status: "HEALTHY";
  readonly completedCheckCount: 25;
  readonly eventDescriptorCount: 40;
  readonly payloadBranchCount: 59;
  readonly explicitVersionBranchCount: 13;
  readonly unversionedBranchCount: 46;
  readonly unresolvedReferenceCount: 0;
  readonly cycleCount: 0;
  readonly openRecordCount: 0;
  readonly additionalPropertiesNodeCount: 0;
  readonly requiredUndefinedFieldCount: 0;
};
```

### 3.7 Complete audit projection

```ts
type CanonicalSchemaAuditProjectionV1 = {
  readonly projectionVersion:
    "botc-domain-event-structural-audit-projection-v1";
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

The projection contains no digest, functions, callbacks, source locations, comments, timestamps, filesystem paths, environment data, random data, event history, game state, or authority token.

### 3.8 Exact A/B digest path

The only digest path is:

```text
CanonicalSchemaAuditProjectionV1
  -> captureCanonicalRuntimeValue
  -> serializeCanonicalRuntimeValue
  -> createCanonicalValueIntegrity
```

Frozen protocol values are:

- A value version: `botc-canonical-runtime-value-v1`;
- A serialization version: `botc-canonical-runtime-tlv-be-v1`;
- B domain: `CANONICAL_VALUE_INTEGRITY`;
- B protocol: `botc-canonical-runtime-integrity-sha256-framed-v1`;
- algorithm: `SHA-256`;
- digest bytes: 32 bytes;
- display encoding: 64 lowercase hexadecimal characters.

No JSON serialization, alternative hash, normalization, or reconstruction is permitted. A or B failure makes the AST authority unhealthy.

Required golden evidence includes:

- projection → A TLV → B digest repeated deterministically;
- field-value mutation changes the digest;
- literal mutation changes the digest;
- child-reference mutation changes the digest;
- node-order or descriptor-order mutation changes the detached projection digest and separately makes a candidate AST unhealthy when canonical ordering is violated;
- no digest record creates authority.

## 4. Generated catalog exact-byte contract

### 4.1 File encoding

The generated V2 catalog is:

`docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md`

Its byte contract is:

- UTF-8;
- no BOM;
- LF only;
- no CR;
- exactly one terminal LF;
- no trailing spaces;
- exactly one empty line between sections;
- no locale-sensitive operation;
- no Unicode normalization;
- dynamic rows use the ordering of the canonical audit projection.

### 4.2 String escaping

`Q(value)` emits `"` followed by escaped content followed by `"`.

Escaping is exactly:

- `"` → `\"`;
- `\` → `\\`;
- U+0008 → `\b`;
- U+0009 → `\t`;
- U+000A → `\n`;
- U+000C → `\f`;
- U+000D → `\r`;
- remaining U+0000–U+001F and U+007F → lowercase `\u00xx`;
- every other valid Unicode scalar value is emitted unchanged and then UTF-8 encoded.

Lone surrogates cannot reach the renderer because A-compatible canonical strings reject them. `/` is not escaped. Unicode is not NFC- or NFD-normalized.

### 4.3 Scalar and list grammar

```text
ORD6       := exactly six ASCII decimal digits
BOOL       := true | false
INT        := 0 | -?[1-9][0-9]*
NULL       := null
LITERAL    := null | b:true | b:false | i:INT | s:Q
LIST(x)    := [] | [x(,x)*]
VERSION    := U | E(field=Q,literal=LITERAL)
FIELD      := (ORD6,Q,REQUIRED,NOT_OPTIONAL,Q)
TAGBRANCH  := (ORD6,LITERAL,Q)
```

Commas and equals signs contain no surrounding whitespace.

### 4.4 Exact section and row order

The physical sections are exactly:

```text
# BOTC Domain Event Structural Schema Catalog V2

## 1. Metadata

## 2. Digest

## 3. Health

## 4. Event Descriptor Manifest

## 5. Payload Branch Manifest

## 6. Unique Node Manifest

## 7. Root Ownership Manifest

## 8. Unique Graph Census

## 9. Expanded Occurrence Census

## 10. V1 Migration Statement

## 11. Non-Semantic Authority Boundary
```

Metadata rows occur in this exact order:

```text
M|artifactStatus="GENERATED_AUDIT_ARTIFACT_NON_RUNTIME_AUTHORITY"
M|projectionVersion="botc-domain-event-structural-audit-projection-v1"
M|sourceAstVersion="botc-domain-event-structural-schema-ast-v1"
M|refinementVersion="botc-domain-event-structural-refinement-v1"
M|catalogVersion="botc-domain-event-structural-audit-catalog-v2"
M|validatorVersion="botc-domain-event-structural-validator-from-ast-v1"
M|canonicalValueVersion="botc-canonical-runtime-value-v1"
M|canonicalSerializationVersion="botc-canonical-runtime-tlv-be-v1"
M|digestDomain="CANONICAL_VALUE_INTEGRITY"
M|digestAlgorithm="SHA-256"
M|digestEncoding="lowercase-hex"
```

Digest row:

```text
G|payloadByteLength=INT|framedPreimageByteLength=INT|digestHex="[0-9a-f]{64}"
```

Health rows:

```text
H|status=HEALTHY|completedChecks=25
H|events=40|branches=59|explicitVersionBranches=13|unversionedBranches=46
H|unresolvedReferences=0|cycles=0|openRecords=0|additionalPropertiesNodes=0|requiredUndefinedFields=0
```

Descriptor row:

```text
E|ORD6|eventType=Q|resultType=Q|branchOrdinals=LIST(ORD6)
```

Branch row:

```text
B|ORD6|branchId=Q|eventOrdinal=ORD6|eventType=Q|version=VERSION|rootNodeId=Q|resultType=Q
```

Node rows are exactly one of:

```text
N|ORD6|kind=NULL|nodeId=Q
N|ORD6|kind=BOOLEAN|nodeId=Q
N|ORD6|kind=SAFE_INTEGER|nodeId=Q
N|ORD6|kind=STRING|nodeId=Q
N|ORD6|kind=LITERAL|nodeId=Q|literal=LITERAL
N|ORD6|kind=ENUM|nodeId=Q|values=LIST(LITERAL)
N|ORD6|kind=NULLABLE|nodeId=Q|child=Q
N|ORD6|kind=EXACT_RECORD|nodeId=Q|fields=LIST(FIELD)
N|ORD6|kind=ARRAY|nodeId=Q|element=Q
N|ORD6|kind=NON_EMPTY_ARRAY|nodeId=Q|minItems=1|maxItems=null|element=Q
N|ORD6|kind=BOUNDED_ARRAY|nodeId=Q|minItems=INT|maxItems=INT|element=Q
N|ORD6|kind=TUPLE|nodeId=Q|tupleLength=INT|elements=LIST(Q)
N|ORD6|kind=TAGGED_UNION|nodeId=Q|tagField=Q|branches=LIST(TAGBRANCH)
N|ORD6|kind=CLOSED_UNION|nodeId=Q|selection=EXACTLY_ONE|branches=LIST(Q)
N|ORD6|kind=REFINEMENT|nodeId=Q|refinementVersion="botc-domain-event-structural-refinement-v1"|refinementKind=NON_EMPTY_TRIMMED_STRING|base=Q
N|ORD6|kind=REFINEMENT|nodeId=Q|refinementVersion="botc-domain-event-structural-refinement-v1"|refinementKind=ID_STRING|alias=Q|base=Q
```

Root row:

```text
R|ORD6|branchId=Q|rootNodeId=Q
```

Both census sections use the field order frozen in `AuditSchemaCensusV1`:

```text
U|events=INT|roots=INT|rootReferences=INT|nodes=INT|childReferences=INT|exactRecords=INT|recordFields=INT|requiredFields=INT|optionalFields=INT|arrays=INT|nonEmptyArrays=INT|boundedArrays=INT|tuples=INT|taggedUnions=INT|closedUnions=INT|nullableNodes=INT|enums=INT|literals=INT|strings=INT|safeIntegers=INT|booleans=INT|idRefinements=INT|unresolvedReferences=INT|cycles=INT|openRecords=INT|additionalPropertiesNodes=INT|requiredUndefinedFields=INT
X|events=INT|roots=INT|rootReferences=INT|nodes=INT|childReferences=INT|exactRecords=INT|recordFields=INT|requiredFields=INT|optionalFields=INT|arrays=INT|nonEmptyArrays=INT|boundedArrays=INT|tuples=INT|taggedUnions=INT|closedUnions=INT|nullableNodes=INT|enums=INT|literals=INT|strings=INT|safeIntegers=INT|booleans=INT|idRefinements=INT|unresolvedReferences=INT|cycles=INT|openRecords=INT|additionalPropertiesNodes=INT|requiredUndefinedFields=INT
```

Final rows:

```text
V|baselinePath="docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md"
V|baselineSha256="bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26"
V|nonB26Branches=58|exactParity=true
V|branchId="C-B26-SEAMSTRESS-DELIVERY-U"|onlyDelta="KNOWN_INEFFECTIVE.representedImpairments:T2_TO_NON_EMPTY_ARRAY_MIN_1_NO_MAX"
Z|authority="AUDIT_ONLY"|runtimeConsumers=0|eventAuthority=false|historyAuthority=false|stateAuthority=false|replayAuthority=false
```

Required golden evidence covers:

- the complete checked-in catalog bytes;
- backslash, quote, newline, control characters, and non-ASCII Unicode;
- exactly one terminal LF;
- no BOM and no CR;
- field, node, literal, child-reference, and order mutations;
- zero production reads of the generated catalog.

## 5. F03 — C1-C09 traceability split

The original `C1-C09` is retained only as a historical grouping label. It is not an acceptance criterion and has no primary-layer classification.

It is replaced by:

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C1-C09A | Runtime refinements apply only the frozen context-free predicates. | All 16 aliases and string boundary vectors execute through the AST-derived validator with deterministic diagnostics. | Direct refinement runtime vectors. | R3 | T3 | STRUCTURAL_VALIDATION | Valid values match; invalid values fail with the frozen structural diagnostic. | Healthy AST and authenticated A backing. |
| C1-C09B | Refinements have no callback, coercion, producer, role, state, replay, or external lookup dependency. | Type and dependency audits prove a closed alias whitelist, one predicate implementation, and zero function-valued refinement fields or forbidden imports. | Static type proof and dependency/no-callback audit. | R4 | T3 | PURE_POLICY_SEAM | No behavior-selecting alias and no external dependency. | C1 rule/semantic boundary. |

`MIXED` and `MULTI_LAYER` remain forbidden.

## 6. F04 — Planned supporting-authority ledger

The following identities are frozen at design time.

| SupportingAuthorityId | LedgerState | Purpose | ExpectedEvidenceStatus | MutationExpectation | ConsumingCriteria |
|---|---|---|---|---|---|
| `SUP-2B20B-P2F1R-C1-001-ACCEPTED-SEAMSTRESS-B26-SHAPE` | `PLANNED_SUPPORTING_AUTHORITY` | Bind B26 cardinality evidence to an accepted Seamstress public payload shape without making the fixture primary authority. | `ACCEPTED` | Authentic source shape remains immutable; cloned zero-length, cardinality, field, literal, and branch mutations must be rejected or produce the expected structural mismatch. | `C1-C10` |
| `SUP-2B20B-P2F1R-C1-002-IMMUTABLE-V1-MIGRATION-BASELINE` | `PLANNED_SUPPORTING_AUTHORITY` | Bind the bounded-delta audit to the immutable V1 artifact and its exact SHA. | `LEGACY` | The source artifact is never modified; any byte or SHA mutation fails before parsing; cloned parsed mutations may be used only as hostile negative evidence. | `C1-C13` |

Both entries are supporting-only:

- neither may replace the AST validator, compile-time proof, exact-byte comparator, or bounded-delta mechanism;
- neither establishes event occurrence, producer legitimacy, replay validity, state validity, or accepted-history authority;
- implementation must record their physical test binding without changing these identities, purposes, statuses, mutation expectations, or consumers.

Updated requirements:

| CriterionId | SupportingAuthorityRequirement |
|---|---|
| C1-C10 | `SUP-2B20B-P2F1R-C1-001-ACCEPTED-SEAMSTRESS-B26-SHAPE` |
| C1-C13 | `SUP-2B20B-P2F1R-C1-002-IMMUTABLE-V1-MIGRATION-BASELINE` |

## 7. F05 — Executable V1 bounded-delta audit

### 7.1 Authority and location

The immutable V1 source is:

- path: `docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md`
- SHA-256: `bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26`

The mechanism is test-only and lives inside:

`packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`

No production module may read, parse, import, or depend on V1.

### 7.2 Exact audit sequence

The test performs these steps in order:

1. read V1 as raw bytes;
2. compute SHA-256 over the exact bytes;
3. fail immediately unless the digest equals the frozen SHA;
4. decode UTF-8 with fatal invalid-sequence handling;
5. isolate only section `## 4. Literal 59-root catalog`;
6. require exactly subsections `4.1` through `4.59`;
7. require exactly one `EventType`, `BranchId`, `VersionPolicy`, `RootSchemaId`, `ResultIdentity`, and fenced schema expression per subsection;
8. parse the frozen V1 DSL with a test-only closed parser supporting only `R`, `A`, `Tn`, `U(EXACTLY_ONE)`, `Q`, `E`, `L`, `ID`, `I`, `S`, `B`, and `Z`;
9. reject unknown forms, trailing input, unresolved references, duplicate fields, duplicate branches, malformed escapes, and noncanonical ordinals;
10. expand each V1 root into a path-addressed occurrence projection;
11. expand each C1 AST root into the same comparison projection without reading the generated V2 catalog;
12. compare all branch metadata and expanded structures.

The test-only parser is not imported by production and is not shared with the AST generator or runtime validator.

### 7.3 Exact parity rule

For the 58 branches other than `C-B26-SEAMSTRESS-DELIVERY-U`, comparison requires exact equality of:

- EventType;
- BranchId;
- VersionPolicy;
- RootSchemaId ownership;
- ResultIdentity;
- requiredness and optionality;
- record field names;
- primitive kinds;
- literals and enums;
- nullability;
- tuple cardinality;
- array structure;
- refinement aliases;
- all expanded paths.

For B26, the test first proves equality outside this path:

```text
KNOWN_INEFFECTIVE.representedImpairments
```

At that exact path, and only there, the authorized transformation is:

```text
V1: T2(element0, element1)
->
C1: NON_EMPTY_ARRAY(element, minItems=1, maxItems=null)
```

The audit must additionally prove:

- both V1 tuple elements have identical expanded structure;
- the C1 array element has that same expanded structure;
- no field, literal, enum, refinement, nullability, child structure, branch identity, or result identity changes;
- B26 lengths 1, 2, and 3 are accepted;
- B26 length 0 is rejected;
- no fixed maximum is introduced.

Any V1 SHA mismatch or any other delta is a stop condition. The baseline must not be updated to make the audit pass.

## 8. Updated affected traceability

All unaffected parent criteria remain unchanged. The affected rows are:

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C1-C09A | Runtime refinements apply only frozen context-free predicates. | Exact alias and string-boundary vectors pass through the derived validator. | Direct runtime refinement vectors. | R3 | T3 | STRUCTURAL_VALIDATION | Deterministic structural match or failure. | Healthy AST and authenticated A backing. |
| C1-C09B | Refinements have no behavior-selecting alias or external dependency. | Static proof finds one predicate and no callbacks, coercion, state, role, replay, producer, or external registry. | Type and dependency audit. | R4 | T3 | PURE_POLICY_SEAM | Closed dependency surface. | C1 semantic boundary. |
| C1-C10 | B26 uses a non-empty variable impairment array. | Lengths 1, 2, and 3 pass; zero fails for `KNOWN_INEFFECTIVE`; `NOT_PROVEN` remains unchanged. | Accepted public-shape vectors through the AST-derived validator. | R3 | T3 | STRUCTURAL_VALIDATION | Variadic accepted shape without behavior change. | `SUP-2B20B-P2F1R-C1-001-ACCEPTED-SEAMSTRESS-B26-SHAPE` |
| C1-C11 | The generated catalog has one deterministic exact-byte representation and no runtime authority. | Complete-file golden bytes, escape vectors, and dependency audit pass. | Renderer golden and zero-runtime-consumer audit. | R4 | T3 | PURE_POLICY_SEAM | Exact reproducible artifact; zero authority. | Healthy AST and frozen catalog grammar. |
| C1-C12 | The schema digest binds the exact closed projection using unchanged A and B. | Projection golden, A TLV, B digest, mutation sensitivity, and authority-negative audit pass. | Canonical projection and digest vectors. | R4 | T3 | PURE_POLICY_SEAM | Stable lowercase digest; no authority token. | Frozen A/B contracts. |
| C1-C13 | V1 parity is exact outside the single B26 cardinality correction. | Exact V1 SHA, 58-branch parity, and the one authorized B26 delta pass. | Test-only static V1 parser and expanded bounded-delta comparator. | R4 | T3 | PURE_POLICY_SEAM | Exactly one authorized delta. | `SUP-2B20B-P2F1R-C1-002-IMMUTABLE-V1-MIGRATION-BASELINE` |

`R1 = {}` and `R2 = {}` remain unchanged.

## 9. Allowlist and non-goals

The parent allowlist is unchanged.

Production:

- `packages/domain-core/src/domain-event-structural-schema-ast.ts`
- `packages/domain-core/src/domain-event-structural-schema-validator.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.ts`

Tests:

- `packages/domain-core/src/domain-event-structural-schema-ast.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-validator.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`

Implementation documentation remains limited to the generated V2 catalog, C1 implementation traceability, and one C1 implementation-review artifact.

Still forbidden:

- A or B changes;
- event-definition or payload-type changes;
- Seamstress production or test changes;
- producer, replay, batch, snapshot, state, application, projection, or role changes;
- runtime parsing of V1 or V2 documentation;
- a second serialization or hash implementation;
- D or P2F work;
- event, history, state, replay, or authority claims derived from structural matching.

## 10. Stop conditions

Stop without implementation if any of the following occurs:

- an AST payload requires an ID alias outside the frozen 16-alias set;
- an alias requires behavior different from the one frozen ID predicate;
- the exact projection cannot pass unchanged A capture and serialization;
- the projection exceeds unchanged A resource limits;
- the catalog requires JSON, locale-sensitive ordering, Unicode normalization, or another serializer;
- the V1 SHA differs from the frozen value;
- any non-B26 parity difference exists;
- B26 contains any difference beyond the frozen cardinality transformation;
- either planned supporting authority cannot be materialized with its frozen status and purpose;
- implementation requires a file outside the unchanged allowlist;
- A, B, event semantics, or Seamstress behavior would need modification.

## 11. Independent review handoff

The independent reviewer must verify:

1. the 16-alias whitelist is complete and closed;
2. the ID predicate rejects empty, whitespace-only, leading-whitespace, and trailing-whitespace values;
3. aliases cannot select callbacks;
4. the audit projection is a complete closed value;
5. node kinds, literals, child references, descriptor order, and census fields are fully represented;
6. the digest uses unchanged A and unchanged B `CANONICAL_VALUE_INTEGRITY`;
7. catalog rendering has one exact grammar and escaping algorithm;
8. `C1-C09A` and `C1-C09B` have distinct valid primary layers;
9. the two planned supporting-authority identities and lifecycle expectations are frozen;
10. the V1 audit is executable, test-only, SHA-bound, and permits only the B26 cardinality delta;
11. A/B, event semantics, allowlist, and non-authority boundaries remain unchanged.

## 12. Self-check

- F01 refinement alias and predicate contract: closed.
- F02 projection, digest, catalog grammar, and byte boundary: closed.
- F03 runtime/static traceability split: closed.
- F04 planned supporting-authority ledger: closed.
- F05 executable V1 bounded-delta mechanism: closed.
- Production implementation performed: no.
- Design-review verdict asserted by this document: no.
- D/P2F started: no.

READY_FOR_INDEPENDENT_C1_DESIGN_CORRECTION_ROUND_1_REVIEW
