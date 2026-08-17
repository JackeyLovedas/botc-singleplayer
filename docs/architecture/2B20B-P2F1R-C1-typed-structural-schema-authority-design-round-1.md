# Phase 3 Slice 2B20B-P2F1R-C1 Design Round 1

## Typed Structural Schema Authority and Seamstress Variadic Compatibility Closure

## Metadata

- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_C1_TYPED_STRUCTURAL_SCHEMA_AUTHORITY_DESIGN_ROUND_1_ONLY`
- designRound: `1`
- currentHead: `30793b662b99bb7f4689811e56b91afe365c2fd4`
- branch: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`
- ruleEvidence: `docs/rules/evidence/2B20B-P2F1R-C1.md`
- ruleEvidenceSha256: `a484067a98056e83d11f9b41fadfa1140d738c811850a139075bd57cfe0650fe`
- ruleVerdict: `RULE_READY`
- coverageStatus: `SKELETON`
- SeamstressRoleCoverage: `PARTIAL`
- unresolvedRuleConflicts: `[]`
- implementationAuthorized: `false`

The unaccepted C worktree rooted at this HEAD is failure evidence only. It is not a design or implementation baseline and must never be copied into, committed with, or silently reused by C1. C1 does not change rule semantics, accepted behavior, persisted event schemas, producers, semantic validators, replay, A, or B.

## Scope and outcome

C1 establishes one runtime structural authority and closes the accepted Seamstress variadic compatibility gap:

```text
Typed Structural Schema AST
  -> deterministic health validation and recursive deep freeze
  -> Healthy Structural Schema Authority
       -> AST-derived runtime structural validator
       -> deterministic generated V2 audit catalog
```

The Typed Structural Schema AST is the sole runtime structural authority. TypeScript payload types are compile-time compatibility targets only. The generated catalog is an audit artifact only. Existing validators are semantic or historical comparison evidence only.

C1 specifically prohibits all of the following authority sources:

- a document-DSL runtime parser;
- TypeScript runtime reflection or compiler-API extraction;
- a manually maintained event or payload shape map;
- fallback to a legacy or semantic validator;
- parsing a generated catalog at runtime;
- deriving an AST from accepted history.

## Non-goals

C1 does not establish accepted-event, trusted-history, replay, canonical-state, producer, state, batch, sequence, snapshot, task, role, or storyteller authority. It does not alter BOTC rules, Dreamer, impairment behavior, No Dashii, Seamstress behavior, information legality, or any persisted event. It does not begin P2F1R-D or P2F.

## Frozen protocol versions

The exact protocol identifiers are:

```text
botc-domain-event-structural-schema-ast-v1
botc-domain-event-structural-refinement-v1
botc-domain-event-structural-audit-catalog-v2
botc-domain-event-structural-validator-from-ast-v1
```

They are ASCII constants and participate in the relevant health, diagnostic, digest, and audit projections. Version identifiers may not be synthesized from time, environment, file paths, or source locations.

## AST representation boundary

Every schema node has a closed `kind` and a stable `nodeId`. A `nodeId` is a stable ASCII identifier. It may not contain or derive from time, randomness, UUIDs, filesystem paths, locale, insertion-order names, object addresses, line numbers, or implementation comments.

Nodes contain no functions, callbacks, classes, symbols, `Map`, `Set`, lazy resolvers, semantic validators, open metadata bags, or runtime extension points. All children are explicit node references in the closed graph.

The algebra is a discriminated union of exactly these fifteen node kinds:

1. `NULL`
2. `BOOLEAN`
3. `SAFE_INTEGER`
4. `STRING`
5. `LITERAL`
6. `ENUM`
7. `NULLABLE`
8. `EXACT_RECORD`
9. `ARRAY`
10. `NON_EMPTY_ARRAY`
11. `BOUNDED_ARRAY`
12. `TUPLE`
13. `TAGGED_UNION`
14. `CLOSED_UNION`
15. `REFINEMENT`

Unknown kinds make the candidate authority unhealthy. There is no default acceptance branch.

## Frozen AST algebra

### `NULL`

- Identity and fields: `{ kind: "NULL"; nodeId }`; no children.
- Validation: accepts only `null`.
- Diagnostic: every non-null value yields `TYPE_MISMATCH`.
- Path: preserves the current path.
- Determinism: one exact comparison; no coercion.

### `BOOLEAN`

- Identity and fields: `{ kind: "BOOLEAN"; nodeId }`; no children.
- Validation: accepts only primitive booleans.
- Diagnostic: non-booleans yield `TYPE_MISMATCH`.
- Path: preserves the current path.
- Determinism: no truthiness or object coercion.

### `SAFE_INTEGER`

- Identity and fields: `{ kind: "SAFE_INTEGER"; nodeId }`; no children.
- Validation: requires a number for which `Number.isSafeInteger(value)` is true.
- Diagnostic: a non-number yields `TYPE_MISMATCH`; a number outside the finite safe-integer domain yields `VALUE_MISMATCH`.
- Path: preserves the current path.
- Determinism: no positivity, seat, revision, ordinal, or domain-semantic checks are implied.

### `STRING`

- Identity and fields: `{ kind: "STRING"; nodeId }`; no children.
- Validation: accepts only primitive strings.
- Diagnostic: non-strings yield `TYPE_MISMATCH`.
- Path: preserves the current path.
- Determinism: no Unicode normalization, trimming, locale handling, or coercion occurs.

### `LITERAL`

- Identity and fields: `{ kind: "LITERAL"; nodeId; value }`, where `value` is `null`, a boolean, a safe integer other than negative zero, or a string; no children.
- Validation: requires exact primitive-kind and exact value equality.
- Diagnostic: a primitive-kind mismatch yields `TYPE_MISMATCH`; a same-kind unequal value yields `LITERAL_MISMATCH`.
- Path: preserves the current path.
- Determinism: negative zero is an unhealthy AST declaration. No normalization or coercion is allowed.

### `ENUM`

- Identity and fields: `{ kind: "ENUM"; nodeId; values }`, with a non-empty, duplicate-free, canonically sorted readonly literal list; no children.
- Validation: requires an exact member.
- Diagnostic: a primitive-kind mismatch yields `TYPE_MISMATCH`; an absent same-domain member yields `ENUM_MISMATCH`.
- Path: preserves the current path.
- Determinism: canonical literal order is `null`, `false`, `true`, numbers ascending, then strings by raw UTF-16 code-unit order. `localeCompare` and locale-dependent ordering are forbidden.

### `NULLABLE`

- Identity and fields: `{ kind: "NULLABLE"; nodeId; child }`; one child reference.
- Validation: accepts `null` immediately; otherwise validates through `child`.
- Diagnostic: child diagnostics are preserved. Missing and `undefined` remain distinct from `null`.
- Path: the child receives the unchanged current path.
- Determinism: nested `NULLABLE` declarations are unhealthy; one null branch is sufficient.

### `EXACT_RECORD`

- Identity and fields: `{ kind: "EXACT_RECORD"; nodeId; fields }`. Each field is `{ fieldOrdinal; name; presence: "REQUIRED" | "OPTIONAL"; child }`.
- Children: one child per field.
- Health: field ordinals are unique, contiguous, and one-based. Names are unique and raw UTF-16 code-unit sorted. The current migration has zero optional fields.
- Validation: input must be an exact plain captured record. It admits only declared own data fields and recursively validates each value. Open records and `additionalProperties` are impossible.
- Diagnostic precedence: record type first; required fields by ordinal; extra fields by raw code-unit name order; child failures by field ordinal. Codes are respectively `TYPE_MISMATCH`, `REQUIRED_FIELD_MISSING`, `EXTRA_FIELD`, or the child diagnostic.
- Path: a field child appends `FIELD(fieldName)`.
- Determinism: no getter, prototype, inherited field, symbol, iterator, or enumeration-order behavior is consulted beyond authenticated A backing.

### `ARRAY`

- Identity and fields: `{ kind: "ARRAY"; nodeId; element }`; one child.
- Validation: requires a dense array of length zero or greater; each element uses the same child schema.
- Diagnostic: non-arrays yield `TYPE_MISMATCH`; child failures are returned in ascending index order.
- Path: each child appends `INDEX(index)`.
- Determinism: no fixed maximum is invented beyond A's already accepted resource boundary.

### `NON_EMPTY_ARRAY`

- Identity and fields: `{ kind: "NON_EMPTY_ARRAY"; nodeId; element }`; one child.
- Validation: requires a dense homogeneous array of length at least one, without a fixed maximum beyond A's resource boundary.
- Diagnostic: non-arrays yield `TYPE_MISMATCH`; an empty array yields `ARRAY_CARDINALITY_MISMATCH`; child failures are ascending by index.
- Path: each child appends `INDEX(index)`.
- Determinism: its compile-time inference is `readonly [T, ...T[]]`, never a fixed tuple.

### `BOUNDED_ARRAY`

- Identity and fields: `{ kind: "BOUNDED_ARRAY"; nodeId; element; minItems; maxItems }`; one child.
- Health: bounds are safe non-negative integers and `minItems <= maxItems`.
- Validation: requires a dense homogeneous array whose length is within the inclusive bounds.
- Diagnostic: non-arrays yield `TYPE_MISMATCH`; out-of-range lengths yield `ARRAY_CARDINALITY_MISMATCH`; child failures follow index order.
- Path: each child appends `INDEX(index)`.
- Determinism: a bound may be declared only when the accepted structural contract supplies it; C1 may not invent a maximum.

### `TUPLE`

- Identity and fields: `{ kind: "TUPLE"; nodeId; elements }`; an ordered child list, including an empty list.
- Validation: requires a dense array of exactly the declared length and validates each element against its positional child.
- Diagnostic: non-arrays yield `TYPE_MISMATCH`; an incorrect length yields `TUPLE_LENGTH_MISMATCH`; child failures are ascending by index.
- Path: each child appends `INDEX(index)`.
- Determinism: tuples are never variadic.

### `TAGGED_UNION`

- Identity and fields: `{ kind: "TAGGED_UNION"; nodeId; tagField; branches }`, with a non-empty ordered branch list.
- Children: every branch is an `EXACT_RECORD` with the same required tag field and a distinct literal tag value.
- Validation: reads the authenticated tag field and dispatches directly to the corresponding branch. It never performs first-success matching.
- Diagnostic: a missing tag yields `UNION_TAG_MISSING`; an unsupported tag yields `UNION_TAG_UNSUPPORTED`; the selected branch then produces its own deterministic diagnostic.
- Path: tag failures append `FIELD(tagField)`; branch validation uses normal record paths.
- Determinism: branch order and unique literal discriminators are health-validated.

### `CLOSED_UNION`

- Identity and fields: `{ kind: "CLOSED_UNION"; nodeId; selection: "EXACTLY_ONE"; branches }`, with at least two ordered branches.
- Health: pairwise disjointness must be proven through primitive kinds, literals, tuple lengths, discriminators, or exact key sets. Duplicate empty records are forbidden.
- Validation: evaluates branches in ordinal order and accepts exactly one structural match.
- Diagnostic: zero matches yield `CLOSED_UNION_NO_MATCH`; more than one yields `CLOSED_UNION_AMBIGUOUS`.
- Path: a union-level failure remains at the union node's current path; the sole selected branch follows its own paths.
- Determinism: first-success semantics are forbidden.

### `REFINEMENT`

- Identity and fields: `{ kind: "REFINEMENT"; nodeId; refinementVersion; refinementKind; alias?; base }`.
- Children: `base` is `STRING`.
- Closed registry: only `NON_EMPTY_TRIMMED_STRING` and `ID_STRING(alias)` are admitted under `botc-domain-event-structural-refinement-v1`.
- Validation: the base string validation runs first. `NON_EMPTY_TRIMMED_STRING` requires a non-empty value equal to its own trim result. `ID_STRING(alias)` applies the frozen structural ID-string predicate; `alias` is audit identity only and does not select a callback.
- Diagnostic: wrong primitive kind yields the base `TYPE_MISMATCH`; a failed registered predicate yields `REFINEMENT_FAILED`.
- Path: preserves the current path.
- Determinism: arbitrary callbacks, semantic lookup, runtime extension, and alias-selected behavior are forbidden.

## Structural versus semantic refinement

A structural refinement may inspect only the current primitive value or current container cardinality without external context. It may not inspect another field, history, state, role, producer, task, or event.

The following remain explicitly semantic and outside C1:

- producer legitimacy;
- event sequence, batch, or game-version progression;
- task, state, replay, or cross-event links;
- cross-field uniqueness or sorting;
- impairment truth or applicability;
- target distinctness or source-role truth;
- Vortox behavior or information legality;
- Seamstress impairment sorting, duplication, tenure, or source truth.

Discovering a required cross-field or stateful refinement is a stop condition, not permission to extend this AST.

## Declaration and authority lifecycle

The AST is declared directly through typed constructors. There are no `schemaExpression` strings, V1 DSL expressions, copied `CSchemaRuntimeShapeByBranchId`, compiler-API extractors, declaration-file parsers, or legacy dispatch tables.

An in-module declaration is a candidate, not authority. Construction produces one of these closed results:

```text
HEALTHY { authority, health }
UNHEALTHY { diagnostic, health }
```

Only `HEALTHY` exposes immutable roots, descriptors, the AST-derived validator, census, and digest. `UNHEALTHY` exposes no partial authority and enables no fallback.

Health validation proceeds in this exact deterministic order:

1. protocol versions;
2. the 40-event bidirectional event-key inventory;
3. all 59 payload branches;
4. the 13 explicit-version and 46 unversioned branch policies;
5. branch ordinal uniqueness;
6. global node-ID uniqueness;
7. exactly one root owner per branch;
8. branch-ordered graph traversal;
9. node-ID syntax and object-identity uniqueness;
10. three-color cycle detection;
11. per-kind invariants;
12. exact-record field order and ordinals;
13. enum canonical order;
14. tagged-union discriminator closure;
15. closed-union pairwise disjointness;
16. closed refinement registry;
17. orphan-node detection;
18. all 40 compile-time exactness proofs are literal `true`;
19. pre-freeze census;
20. recursive deep freeze;
21. post-freeze identity, reference, census, and `Object.isFrozen` audit;
22. canonical audit projection;
23. unchanged A capture and canonical TLV serialization;
24. unchanged B `CANONICAL_VALUE_INTEGRITY` digest;
25. authority publication.

Any failure yields `UNHEALTHY`. There is no partial registry, repair, dynamic registration, mutation, patch, reload, fallback descriptor, or live replacement.

Shared child nodes are permitted only when every reference points to the same node object. Reusing one node ID for different objects is unhealthy. Cycles are unhealthy. The candidate graph, every nested object and array, health reports, census reports, audit projection, and digest record are recursively frozen.

The frozen inventory is exactly:

- 40 event types;
- 59 payload branches;
- 13 explicit-version branches;
- 46 unversioned branches;
- existing `C-B01` through `C-B59` identities and ordinals;
- one root per branch.

Shared child nodes do not alter root ownership. C1 does not change persisted events.

## Compile-time compatibility binding

One exhaustive `InferStructuralSchema<Node>` derives the TypeScript value represented by every AST node:

- null, boolean, number, string;
- exact literals and enums;
- nullable values;
- exact objects;
- readonly arrays;
- non-empty readonly tuple-rest arrays;
- bounded readonly arrays;
- exact tuples;
- tagged and closed unions;
- refinement primitives.

`RuntimeShape<T>` removes nominal brands from primitive values only. It never broadens object keys, cardinalities, literals, or union structure.

For each of exactly 40 event keys, the union of that event's AST branch roots is checked bidirectionally against `RuntimeShape<DomainEventPayloadByType[EventType]>` through an `ExactRuntimeShape` proof. Every proof must resolve to the literal type `true`.

The following are prohibited:

- a manually maintained 59-entry expected-shape map;
- `any`;
- `unknown` or `as unknown as` escape hatches;
- ignored type errors;
- open index signatures;
- payload type-name strings;
- default or one-way compatibility checks;
- generated declarations that are not bound directly to the AST.

This proof detects both directions of drift, including the distinction between a fixed tuple and a non-empty variable array. TypeScript remains compile-time evidence, never runtime authority.

## AST-derived validator

The C1 validator is package-internal. It consumes only authenticated immutable A backing together with an exact branch identity. It does not accept raw input and is not root-exported. A future C boundary may call it only after A capture and branch dispatch.

It may not call producers, semantic validators, role validators, replay, state, snapshots, the V1 catalog, a document parser, TypeScript reflection, or any fallback validator.

A success result states only:

```text
STRUCTURAL_MATCH_ONLY
branchId
rootNodeId
astVersion
schemaDigest
```

It does not issue an accepted, trusted, replayable, authorized, canonical-history, or canonical-state token.

The closed diagnostic-code union is exactly:

```text
AUTHORITY_UNHEALTHY
BRANCH_UNKNOWN
TYPE_MISMATCH
VALUE_MISMATCH
LITERAL_MISMATCH
ENUM_MISMATCH
REQUIRED_FIELD_MISSING
EXTRA_FIELD
ARRAY_CARDINALITY_MISMATCH
TUPLE_LENGTH_MISMATCH
UNION_TAG_MISSING
UNION_TAG_UNSUPPORTED
CLOSED_UNION_NO_MATCH
CLOSED_UNION_AMBIGUOUS
REFINEMENT_FAILED
INTERNAL_FAILURE
```

Every diagnostic contains only `code`, `validatorVersion`, `astVersion`, `nodeId | null`, a frozen structural path, and `failClosed: true`. It contains no payload value, text value, collected keys, callback, thrown error, stack, filesystem path, or machine data.

A path is a frozen sequence of `FIELD(string)` or `INDEX(number)` segments. The root path is empty. Nullable nodes preserve the path. Tagged-union tag errors identify the tag field. Closed-union ambiguity/no-match stays at the union node.

Traversal is deterministic: record field ordinal and raw code-unit key order, ascending array indices, exact tagged dispatch, closed-union ordinal order, and the closed refinement registry. Implementation uses an iterative work stack and a memo of internal node/backing pairs. It invokes no getters, coercion hooks, iterators, locale APIs, time, randomness, or environment inputs.

## Seamstress variadic compatibility closure

`C-B26` expresses `sourceEffectiveness` as a `TAGGED_UNION` on `kind`.

For `KNOWN_INEFFECTIVE`, `representedImpairments` is a `NON_EMPTY_ARRAY` whose exact-record item has these four required fields:

- `appliedCharacterStateRevision`: `SAFE_INTEGER`;
- `impairmentId`: `ID_STRING(AbilityImpairmentId)`;
- `impairmentKind`: `ENUM(DRUNK, POISONED)`;
- `impairmentSourceKind`: `ENUM(PHILOSOPHER_CHOSEN_DUPLICATE, SNAKE_CHARMER_DEMON_HIT)`.

The array has `minLength = 1`, has no fixed maximum beyond A's resource boundary, and is homogeneous and exact. For `NOT_PROVEN`, `representedImpairments` remains an exact empty `TUPLE`.

Required compatibility vectors are:

- one represented impairment: accepted structurally;
- two represented impairments: accepted structurally;
- three represented impairments: accepted structurally;
- zero represented impairments under `KNOWN_INEFFECTIVE`: rejected with `ARRAY_CARDINALITY_MISMATCH`;
- malformed or extra item fields: rejected deterministically;
- an implementation that accepts only exactly two items: rejected by the compatibility proof;
- zero represented impairments under `NOT_PROVEN`: accepted as the frozen empty tuple.

C1 does not change the accepted TypeScript payload, producer, semantic validator, or event behavior. It adds no sorting, duplicate, source-truth, revision, tenure, drunk, poison, Vortox, information, or opportunity-spending semantics.

## V1 migration and bounded structural delta

The historical artifact remains immutable:

- path: `docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md`
- SHA-256: `bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26`
- status: `DEPRECATED_NON_RUNTIME_AUTHORITY`

V1 is migration and parity evidence only. Production and tests may never import, parse, or read it as runtime authority.

All 58 non-B26 branches preserve their expanded structural meaning. The sole semantic structural correction is the old fixed `T2` impairment evidence becoming `NON_EMPTY_ARRAY`. Allowed representational normalization consists only of typed nodes, shared child nodes, `TAGGED_UNION`, and the closed `REFINEMENT` kind. No other field, literal, enum, requiredness, tuple, nullability, version, branch, or primitive contract changes.

The frozen expanded-occurrence census after correction is:

| Measure | Expected |
|---|---:|
| events | 40 |
| roots | 59 |
| root references | 59 |
| expanded nodes | 2467 |
| child references | 2408 |
| exact records | 389 |
| record fields | 2264 |
| required fields | 2264 |
| optional fields | 0 |
| ordinary arrays | 31 |
| non-empty arrays | 1 |
| bounded arrays | 0 |
| tuples | 39 |
| union nodes | 19 |
| nullable nodes | 5 |
| enums | 257 |
| literals | 588 |
| strings | 116 |
| safe integers | 487 |
| booleans | 2 |
| ID refinements | 533 |
| unresolved references | 0 |
| cycles | 0 |
| open records | 0 |
| additional-properties nodes | 0 |
| required-undefined fields | 0 |

The generator reports both a unique-graph census and this expanded-occurrence census. If the census and the bidirectional compile-time proof cannot both close, implementation stops.

## Schema digest

Only a healthy, deeply frozen AST can produce the detached canonical audit projection. That projection contains exactly:

- protocol versions;
- ordered event and branch descriptors;
- ordered unique nodes;
- branch-root ownership;
- version policies;
- node attributes and child IDs;
- unique-graph and expanded-occurrence census values.

It excludes the digest itself, functions, memory addresses, time, environment, filesystem paths, randomness, source lines, validators, and comments.

The projection is captured through unchanged A, serialized through A's canonical TLV, and hashed through unchanged B using `CANONICAL_VALUE_INTEGRITY`. The display digest is lowercase SHA-256. Any A or B failure makes the candidate unhealthy. C1 may not introduce JSON, an ad hoc serializer, or a new hash implementation.

The digest is integrity evidence only. It creates no event, replay, history, state, or authorization authority.

## Generated V2 audit catalog

The deterministic generated artifact path is:

`docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md`

Its header states:

- `GENERATED_AUDIT_ARTIFACT_NON_RUNTIME_AUTHORITY`;
- `sourceAstVersion`;
- `catalogVersion`.

Runtime code never reads this file. Its byte contract is UTF-8 without BOM, LF line endings, exactly one terminal LF, raw UTF-16 code-unit ordering, no locale/time/environment/path input, six-digit ordinals, and canonical literal escaping.

Sections occur in this exact order:

1. metadata;
2. digest;
3. health;
4. 40-entry descriptor manifest;
5. 59-entry branch manifest;
6. unique-node manifest;
7. root-ownership manifest;
8. unique-graph census;
9. expanded-occurrence census;
10. V1 migration statement;
11. non-semantic authority boundary.

An exact in-memory byte comparator verifies the checked-in artifact. Any difference fails closed. The artifact may not be hand-repaired; the AST must be corrected and the artifact regenerated. The generator may not parse V1, TypeScript source or declarations, or validators.

The dependency direction is immutable:

```text
Typed AST authority
  -> AST-derived validator
  -> generated audit catalog
```

Reverse dependencies are forbidden. TypeScript is compile-time compatibility evidence; old validators are semantic/historical comparison evidence; the digest is integrity evidence; a structural match is not accepted-history provenance.

## Reachability and trust

- `R1 = {}`
- `R2 = {}`
- `R3`: direct AST-validator evidence for malformed payloads, B26 cardinality vectors, and structural mutations.
- `R4`: health, immutability, compile-time proof, generated catalog, digest, V1 bounded-delta audit, and no-authority/no-fallback evidence.

The module candidate, health checker, AST-backing validator, renderer, and exact byte comparator are all `T3`. A future C raw-input boundary remains `T1` and is outside C1.

## Traceability V1.1 plan

`R1` and `R2` remain empty. Physical test titles are not frozen at design time. Each row has exactly the nine required fields.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C1-C01 | The typed AST is the sole runtime structural authority. | Dependency audit finds no document parser, manual map, compiler extraction, validator fallback, or runtime catalog parsing. | Static dependency and export audit. | R4 | T3 | PURE_POLICY_SEAM | Exactly one authority chain. | C1 design and V1 non-runtime boundary. |
| C1-C02 | The algebra is closed to the frozen 15 deterministic node kinds. | Exhaustive health evidence covers every kind and rejects an unknown kind without fallback. | Exhaustive type proof plus health-fault matrix. | R4 | T3 | PURE_POLICY_SEAM | All valid kinds healthy; unknown kind impossible or fail closed. | Frozen AST union. |
| C1-C03 | The authority is complete, acyclic, and recursively immutable. | 40/59/13/46 inventories close; duplicate, cycle, orphan, open-record, and post-freeze faults close deterministically. | Health report, closed fault injection, and post-freeze audit. | R4 | T3 | PURE_POLICY_SEAM | `HEALTHY` or one closed fail-closed result; zero forbidden counters. | Accepted C inventory. |
| C1-C04 | AST event shapes match accepted TypeScript payloads bidirectionally. | Exactly 40 event proofs resolve to literal `true`, with no manual expected-shape map. | Typecheck compatibility fixture bound to AST roots. | R4 | T3 | PURE_POLICY_SEAM | 40/40 exact proofs. | `DomainEventPayloadByType`. |
| C1-C05 | Runtime structural validation is derived only from the healthy AST. | Representative node evidence and all 59 roots use one traversal core with no fallback. | Internal validator matrix and dependency audit. | R3 | T3 | STRUCTURAL_VALIDATION | Structural match or closed diagnostic only. | Healthy AST authority. |
| C1-C06 | Exact records reject missing and extra fields with frozen precedence. | Missing, extra, and child mutations bind to the specified code and path precedence. | Direct AST-validator mutation vectors. | R3 | T3 | STRUCTURAL_VALIDATION | Deterministic closed diagnostics. | Authenticated A backing. |
| C1-C07 | Array, non-empty array, bounded array, and tuple cardinalities remain distinct. | Zero, boundary, and overflow vectors distinguish all collection kinds. | Direct cardinality vectors. | R3 | T3 | STRUCTURAL_VALIDATION | Only the declared cardinality contract matches. | Frozen AST algebra. |
| C1-C08 | Tagged and closed unions are deterministic and exclusive. | Tag and pairwise-disjointness vectors prove direct dispatch and exactly-one behavior, never first-success. | Union health and runtime vectors. | R3 | T3 | STRUCTURAL_VALIDATION | One branch or frozen union diagnostic. | Union health contract. |
| C1-C09 | Refinements remain context-free structural checks. | Primitive refinement tests pass and dependency audit finds no state, producer, role, replay, or callback access. | Direct refinement vectors plus dependency audit. | R4 | T3 | PURE_POLICY_SEAM | Closed structural refinement only. | C1 rule/semantic boundary. |
| C1-C10 | B26 represents impairment evidence as a non-empty variable array. | Lengths 1, 2, and 3 pass; empty `KNOWN_INEFFECTIVE` fails; empty `NOT_PROVEN` remains valid. | Accepted Seamstress public-shape vectors through the AST validator. | R3 | T3 | STRUCTURAL_VALIDATION | Variadic compatibility closed without behavior change. | Accepted Seamstress payload contract. |
| C1-C11 | The V2 catalog is deterministic audit output and never runtime authority. | Exact bytes reproduce and runtime dependency audit finds no catalog read. | Renderer golden-byte comparison and dependency audit. | R4 | T3 | PURE_POLICY_SEAM | Exact artifact; zero runtime consumers. | Healthy AST and V2 artifact contract. |
| C1-C12 | The schema digest is deterministic integrity evidence only. | Repeated unchanged A/B processing yields identical digest and export audit exposes no authority claim. | Repeat digest vectors and authority/export audit. | R4 | T3 | PURE_POLICY_SEAM | Stable lowercase digest; no authority token. | Frozen A and B contracts. |
| C1-C13 | V1 migration preserves every non-B26 structure and bounds the delta to B26 cardinality. | Census and branch audit show only the fixed-tuple-to-non-empty-array change. | V1 SHA-bound migration audit and B26 diff evidence. | R4 | T3 | PURE_POLICY_SEAM | Exactly one bounded structural correction. | Immutable V1 artifact and accepted B26 shape. |
| C1-C14 | C1 changes no BOTC rule, event behavior, or persisted history. | Allowlist audit reports zero forbidden file or semantic changes. | Diff/allowlist audit. | R4 | T3 | PURE_POLICY_SEAM | Zero forbidden changes. | Rule evidence and accepted compatibility matrix. |

Implementation assigns unique `SUP-*` identifiers to supporting authorities. No fixture is allowed to define or replace a primary mechanism.

## Future implementation allowlist

The only permitted production files are:

- `packages/domain-core/src/domain-event-structural-schema-ast.ts`
- `packages/domain-core/src/domain-event-structural-schema-validator.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.ts`

There is no root export and no `index.ts` change.

The only permitted tests are the matching three test files:

- `packages/domain-core/src/domain-event-structural-schema-ast.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-validator.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`

The only permitted implementation-stage documentation is:

- the generated V2 catalog;
- C1 implementation traceability;
- one C1 implementation-review artifact.

This design and the C1 rule evidence are design-stage artifacts, not implementation allowlist expansion.

The following are explicitly forbidden:

- the unaccepted `canonical-domain-event.ts`, `domain-event-structural-validator.ts`, or its test;
- A or B files;
- event definition files;
- Seamstress or its tests;
- producers or semantic validators;
- replay, state, batch, snapshot, application, projection, or role code;
- Dreamer, impairment, or No Dashii code;
- workflow, coverage, ownership, or CI files;
- D or P2F work.

The estimated production additions are 900–1250 lines for the AST, 250–400 for the validator, and 150–250 for the catalog generator, for a total of 1300–1900. More than 2000 added production lines is a hard stop. One-line DSLs, minification, compression, base64, and blob encodings may not evade the limit.

## Local implementation acceptance gates

A separately authorized implementation must run, using Node 24.15.0 and pnpm 11.7.0:

- all three focused C1 test files;
- domain-core tests;
- `pnpm typecheck`;
- `pnpm lint`;
- `pnpm test`.

Coverage profiles, hosted CI, Windows evidence, and D publication are outside this local C1 component task.

Acceptance requires all of the following:

- healthy authority;
- 40/59/13/46 inventory closure;
- zero mismatch and zero forbidden health counters;
- both censuses match;
- B26 lengths 1, 2, and 3 pass and length zero fails for `KNOWN_INEFFECTIVE`;
- V1 is absent from runtime dependencies;
- no validator fallback exists;
- the generated catalog matches exact bytes;
- repeated schema digest is stable;
- A, B, and every forbidden file are unchanged;
- all local gates pass;
- every Traceability mechanism match is `PASS`;
- a fresh independent implementation review passes.

## Alternatives and decision

Rejected alternatives are:

- retaining the document DSL as runtime authority;
- using TypeScript runtime reflection as authority;
- maintaining a manual 59-branch shape map;
- falling back to semantic validators;
- parsing the generated catalog at runtime;
- generating the AST from history.

The selected architecture is a directly declared typed AST single graph, bidirectional compile-time compatibility, one AST traversal validator, and one deterministic audit renderer. Its cost is substantial explicit source. Its benefit is one enforceable runtime structural authority with no reverse or fallback authority path.

## Rollback

Rollback removes only the three C1 production files, their three tests, the generated V2 catalog, and C1 implementation traceability/review documentation. It requires no event, state, or history migration. V1 remains historical and is never reactivated as authority.

## Stop-loss conditions

Implementation stops immediately if any of the following occurs:

- the current unaccepted C worktree must be reused or committed;
- A, B, events, Seamstress, producers, semantic validators, replay, state, batch, snapshot, application, projection, roles, workflow, coverage, ownership, or CI must change;
- a fourth production file or an `index.ts` export is needed;
- production additions exceed 2000 lines;
- a DSL, manual shape map, compiler extractor, or validator fallback is required;
- inventory, exact-type proof, census, or post-freeze health cannot close;
- a semantic or cross-context refinement is required;
- B26 requires accepted behavior change;
- runtime catalog parsing or a new hash implementation is required;
- the graph retains an unresolved reference or cycle;
- partial authority or a public authority token is proposed;
- work expands into D, P2F, hosted CI, coverage, workflow, or ownership;
- role coverage would be promoted or a rule conflict appears.

## Design-stage gate

This document does not self-assert a design verdict. Implementation remains unauthorized until this exact document is materialized and a fresh independent reviewer reads the rule evidence and sources, role coverage matrix, this design, accepted TypeScript payload types, Seamstress behavior, V1 artifact, A, B, and the review protocol.

Only an exact `RULE_DESIGN_PASS`, followed by separate user implementation authorization, permits C1 implementation. That implementation must start from a clean baseline that excludes the current unaccepted C worktree.

## Design self-check

- AST is the sole runtime structural authority: frozen.
- The 15-kind algebra and deterministic diagnostics are closed: frozen.
- Health, immutability, cycles, duplicates, inventory, and publication are closed: frozen.
- Runtime validation is AST-derived with no fallback: frozen.
- Catalog is a deterministic non-authority artifact: frozen.
- B26 is a non-empty variable array and accepted behavior is unchanged: frozen.
- TypeScript provides only bidirectional compile-time compatibility: frozen.
- V1 remains immutable historical evidence: frozen.
- A and B are consumed unchanged: frozen.
- Traceability, allowlist, alternatives, rollback, and stop-loss are explicit: frozen.
- Implementation authorization remains false: confirmed.

READY_FOR_INDEPENDENT_C1_RULE_DESIGN_REVIEW
