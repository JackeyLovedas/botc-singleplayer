# Phase 3 Slice 2B20B-P2F1 — Canonical Runtime Validation and Deterministic Serialization Foundation Design Round 1

## Metadata

- sliceId: `2B20B-P2F1`
- designRound: `1`
- documentType: `STANDALONE_IMPLEMENTABLE_DESIGN`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1_CANONICAL_RUNTIME_VALIDATION_AND_DETERMINISTIC_SERIALIZATION_DESIGN_ROUND_1`
- authorizationScope: `DESIGN_ONLY`
- parentPrecheckPath: `docs/architecture/2B20B-P2F1-canonical-runtime-validation-deterministic-serialization-governance-precheck.md`
- parentPrecheckSha256: `c269d9348b50cace72931c99c0e0efd08c47443663a2b77abc33394e18cc0b63`
- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- currentHead: `bef395287d5400043565acd5b794d02810d7bbca`
- acceptedMainBase: `0dc046aa62b3a72cbd97d99808e0932bf408a09c`
- phase: `Phase 3 — controlled vertical slices`
- package: `@botc/domain-core`
- packageChangeKind: `ADDITIVE_FOUNDATION`
- reviewStatus: `NOT_REVIEWED`
- implementationAuthorized: `false`
- eventSchemaChanged: `false`
- receiptSchemaChanged: `false`
- snapshotSchemaChanged: `false`
- acceptedBehaviorChanged: `false`
- BOTCRuleChanged: `false`
- P2FDesignChanged: `false`
- P2FStatus: `HUMAN_BLOCKED_PENDING_P2F1`

This document awaits independent rule-design review, does not authorize implementation, and does not change the P2F precheck or either P2F design.

## Design outcome

P2F1 adds one non-authoritative domain-core foundation with four bounded capabilities:

1. descriptor-safe capture of a closed canonical runtime value domain;
2. exhaustive exact unknown-to-typed validation of the current 40 domain events;
3. deterministic canonical TLV serialization;
4. four role-separated SHA-256 integrity results.

P2F1 never:

- proves that an event was accepted;
- proves accepted-history provenance;
- parses or approves replay JSON;
- rebuilds game state;
- compares a snapshot with rebuilt state;
- owns quarantine;
- issues trusted-history authority;
- issues canonical-state authority.

Later P2F may consume P2F1 results only as structural and integrity evidence inside its separately reviewed accepted-source pipeline.

## Scope

### In scope

- one canonical runtime value version;
- one canonical TLV serialization version;
- descriptor-safe capture from `unknown`;
- bounded, non-secret diagnostics;
- a complete 40-event runtime inventory;
- exact context-free envelope and payload schemas;
- one post-validation internal event cast;
- raw-byte capture and exact raw-byte digest;
- canonical value, canonical state, and aggregate binding digest roles;
- pure deterministic vectors;
- Linux and Windows equality checks;
- additive domain-core exports;
- documentation of compatibility, rollback, and stop-loss.

### Non-goals

- no BOTC rule implementation or interpretation;
- no role behavior;
- no Effect Engine;
- no P2 impairment resolution;
- no command integration;
- no accepted receipt or store integration;
- no command fingerprint change;
- no event, payload, receipt, snapshot, state, or persistence schema change;
- no replay JSON parser;
- no duplicate-key JSON parser;
- no artifact approval registry;
- no live journal;
- no quarantine state;
- no authority handle;
- no state rebuild;
- no projection;
- no migration;
- no application behavior change.

## Preserved architecture invariants

P2F1 does not alter:

- domain events as canonical game truth;
- event ordering;
- serial command processing;
- one logical writer per game;
- atomic accepted batches;
- prospective validation;
- retry and receipt boundaries;
- event-only replay;
- historical knowledge as stored fact;
- settlement-time effectiveness;
- separation of truth, reliability, registration, constraints, and simulation reason;
- snapshot status as rebuildable cache;
- projection safety;
- cross-platform deterministic ID and order rules.

P2F1 admission is structural only. Existing stateful replay remains mandatory after structural admission whenever a later consumer needs event semantics.

## Module boundary

The future implementation is additive inside `@botc/domain-core`.

```text
unknown value
  -> canonical-runtime-value.ts
     descriptor-safe capture
     resource limits
     immutable canonical value
  -> domain-event-payload-shape-v1.ts
     exact context-free payload schemas
  -> unknown-domain-event.ts
     exact envelope
     exhaustive type/version dispatch
     one post-validation internal cast

validated canonical value
  -> canonical-runtime-value.ts
     deterministic TLV

validated copied raw bytes or canonical TLV
  -> canonical-runtime-hash.ts
     role-separated SHA-256 integrity result
```

No arrow issues authority. No module calls `rebuildGameState`, `applyDomainEvent`, `validateDomainBatchSemantics`, an application service, a command store, a receipt store, or a projection.

## Frozen version and algorithm literals

```ts
export const CANONICAL_RUNTIME_VALUE_VERSION =
  "botc-canonical-runtime-value-v1" as const;

export const CANONICAL_RUNTIME_SERIALIZATION_VERSION =
  "botc-canonical-runtime-tlv-be-v1" as const;

export const CANONICAL_RUNTIME_DIGEST_ALGORITHM =
  "SHA-256" as const;

export const RAW_BYTE_HASH_VERSION =
  "botc-raw-byte-sha256-v1" as const;

export const CANONICAL_VALUE_HASH_VERSION =
  "botc-canonical-value-sha256-v1" as const;

export const CANONICAL_STATE_HASH_VERSION =
  "botc-canonical-state-sha256-v1" as const;

export const AGGREGATE_BINDING_HASH_VERSION =
  "botc-aggregate-binding-sha256-v1" as const;
```

There is no `latest`, implicit fallback, version coercion, or automatic migration. Changing any value-domain, TLV, ordering, Unicode, limit, framing, or digest-input rule requires a new version and separate design review.

## Canonical runtime value domain

### Accepted values

The exact admitted recursive domain is:

```ts
export type CanonicalRuntimeValue =
  | null
  | boolean
  | string
  | number
  | readonly CanonicalRuntimeValue[]
  | { readonly [key: string]: CanonicalRuntimeValue };
```

The type is descriptive. Only a successful `captureCanonicalRuntimeValue(unknown)` result establishes runtime admission.

Accepted values are:

- `null`;
- `false` and `true`;
- well-formed UTF-16 strings with no lone surrogate;
- safe integers excluding negative zero;
- dense standard arrays of admitted values;
- plain records with `Object.prototype` or `null` prototype and admitted enumerable data fields.

Repeated acyclic references are encoded by value. Each occurrence is traversed and counted independently. Reference aliasing is not semantic.

### Rejected values

The exact rejected set includes:

- `undefined`;
- fraction;
- `NaN`;
- positive or negative infinity;
- unsafe integer;
- negative zero;
- `bigint`;
- symbol value;
- function;
- accessor property;
- Proxy;
- revoked Proxy;
- cycle;
- sparse array;
- keyed array;
- array with a modified or invalid `length` descriptor;
- nonplain object;
- `Map`;
- `Set`;
- `Date`;
- `RegExp`;
- `Error`;
- `Promise`;
- `ArrayBuffer`;
- `SharedArrayBuffer`;
- `DataView`;
- any typed array;
- class instance;
- lone high surrogate;
- lone low surrogate;
- non-enumerable object property;
- symbol key.

No rejected value is coerced, stringified, normalized, repaired, skipped, or converted to `null`.

## Descriptor-safe capture

### Inspection order

For every object candidate:

1. reject with `PROXY_VALUE` if `node:util` `types.isProxy` reports a Proxy, including a revoked Proxy;
2. check recursion ancestry before descending;
3. inspect the prototype;
4. read own keys once with `Reflect.ownKeys`;
5. reject any symbol key;
6. obtain all own property descriptors once;
7. reject accessors before reading any descriptor value;
8. enforce array or plain-record descriptor rules;
9. recursively capture descriptor `value` fields;
10. construct a detached result;
11. deep-freeze the detached result before returning success.

The implementation must not:

- read a candidate property through ordinary property access;
- invoke a getter or setter;
- invoke an iterator;
- call `toString`, `valueOf`, `toJSON`, inspection hooks, or user code;
- use object spread over caller data;
- use `JSON.stringify` for capture;
- retain a caller object, array, descriptor, view, or byte buffer.

### Array rules

An admitted array must:

- have exactly `Array.prototype`;
- have the standard own non-enumerable, non-configurable, writable `length` data descriptor;
- have a nonnegative safe-integer length;
- have exactly indices `0` through `length - 1`;
- have each index as an own enumerable data property;
- have no hole;
- have no extra string key;
- have no symbol key.

Array order is retained exactly.

### Record rules

An admitted record must:

- have `Object.prototype` or `null` prototype;
- contain only own string keys;
- contain only enumerable data properties;
- contain no accessor;
- contain no symbol key.

The detached record uses a null prototype and is frozen. Input prototype choice is not part of canonical equality.

## Resource limits

The exact limits are:

```ts
export const CANONICAL_RUNTIME_LIMITS = Object.freeze({
  maxDepth: 128,
  maxNodes: 100_000,
  maxArrayLength: 10_000,
  maxObjectKeys: 10_000,
  maxStringUtf8Bytes: 1_048_576,
  maxObjectKeyUtf8Bytes: 65_535,
  maxSerializedBytes: 16_777_216
});
```

Rules:

- root depth is `0`;
- every scalar, array, and object occurrence counts as one node;
- repeated references count again at every occurrence;
- key bytes count toward serialized size;
- the eight-byte TLV header counts toward serialized size;
- limits are checked before allocation or append where possible;
- crossing any limit returns `RESOURCE_LIMIT_EXCEEDED`;
- no partial value, partial bytes, partial event, or partial digest is returned.

## Canonical diagnostics

### Generic diagnostic contract

Generic canonical capture has no quarantine field.

```ts
export type CanonicalRuntimeFailureCode =
  | "PROXY_VALUE"
  | "UNDEFINED_VALUE"
  | "UNSUPPORTED_VALUE_TYPE"
  | "INVALID_NUMBER"
  | "LONE_SURROGATE"
  | "ACCESSOR_PROPERTY"
  | "SYMBOL_KEY"
  | "CYCLIC_VALUE"
  | "SPARSE_ARRAY"
  | "KEYED_ARRAY"
  | "INVALID_ARRAY_LENGTH_DESCRIPTOR"
  | "NONPLAIN_OBJECT"
  | "NON_ENUMERABLE_PROPERTY"
  | "RESOURCE_LIMIT_EXCEEDED"
  | "SERIALIZATION_FAILED";

export type CanonicalDiagnosticPathSegment =
  | {
      readonly kind: "KNOWN_FIELD";
      readonly field: KnownSchemaFieldName;
    }
  | {
      readonly kind: "OBJECT_KEY_ORDINAL";
      readonly sortedOrdinal: number;
    }
  | {
      readonly kind: "ARRAY_INDEX";
      readonly index: number;
    }
  | {
      readonly kind: "TRUNCATED";
    };

export type CanonicalRuntimeDiagnostic = {
  readonly code: CanonicalRuntimeFailureCode;
  readonly path: readonly CanonicalDiagnosticPathSegment[];
  readonly valueKind: CanonicalDiagnosticValueKind;
};

export type CaptureCanonicalRuntimeValueResult =
  | {
      readonly valid: true;
      readonly valueVersion: typeof CANONICAL_RUNTIME_VALUE_VERSION;
      readonly value: CanonicalRuntimeValue;
    }
  | {
      readonly valid: false;
      readonly diagnostic: CanonicalRuntimeDiagnostic;
    };
```

`CanonicalDiagnosticValueKind` is a closed non-reflective enum:

```text
NULL
BOOLEAN
STRING
NUMBER
ARRAY
PLAIN_OBJECT
UNDEFINED
BIGINT
SYMBOL
FUNCTION
PROXY
NONPLAIN_OBJECT
UNKNOWN
```

### Safe path rules

- maximum path length is 32 segments;
- when the failure is deeper, the first 31 safe segments plus `TRUNCATED` are returned;
- numeric array indices are allowed;
- a fixed known envelope or payload field name is allowed only after the corresponding schema node is recognized;
- arbitrary caller object keys are never echoed;
- generic objects use the zero-based ordinal of the key in raw UTF-16 sorted order;
- an extra unknown schema key is identified only by its sorted ordinal at the recognized parent;
- no path contains a value, identifier, event content, bytes, state, receipt, player data, or arbitrary key text;
- diagnostics never retain the rejected input.

The generic API has no `quarantineRecommended`, advisory, or source classification.

## Canonical TLV serialization

### Header

Every standalone serialization begins with exactly these eight bytes:

```text
42 4F 54 43 43 52 56 01
```

This is ASCII `BOTCCRV` followed by byte `0x01`.

The header appears once at the root and never before a child value.

### Integer primitives

- `u32be` is an unsigned 32-bit integer in network byte order.
- `u64be` is an unsigned 64-bit integer in network byte order.
- `i64be` is a signed two's-complement 64-bit integer in network byte order.
- admitted JavaScript safe integers fit exactly in `i64be`.

### Value tags and bodies

| Tag | Value | Body |
|---|---|---|
| `00` | `null` | none |
| `01` | `false` | none |
| `02` | `true` | none |
| `03` | integer | exact `i64be` |
| `04` | string | `u32be` UTF-8 byte length, then strict UTF-8 bytes |
| `05` | array | `u32be` element count, then each child TLV without a header |
| `06` | object | `u32be` property count, then sorted entries |

Each object entry is:

```text
u32be key UTF-8 byte length
key UTF-8 bytes
child value TLV without a header
```

Object keys do not receive tag `04`.

### String policy

- reject a lone high or low UTF-16 surrogate before UTF-8 encoding;
- accept valid surrogate pairs;
- use WHATWG `TextEncoder` after scalar-string validation;
- preserve every admitted code point exactly;
- preserve CR, LF, and CRLF as distinct sequences;
- perform no Unicode normalization;
- perform no case conversion;
- perform no trimming;
- perform no locale transformation.

### Ordering policy

Object keys use raw JavaScript UTF-16 code-unit ordering:

```ts
left < right ? -1 : left > right ? 1 : 0
```

There is no `localeCompare`, `Intl.Collator`, environment locale, insertion order, or platform collation.

Arrays retain input order.

### Serialization API

```ts
export type CanonicalSerializationResult =
  | {
      readonly valid: true;
      readonly serializationVersion:
        typeof CANONICAL_RUNTIME_SERIALIZATION_VERSION;
      readonly bytes: Uint8Array;
    }
  | {
      readonly valid: false;
      readonly diagnostic: CanonicalRuntimeDiagnostic;
    };

export const captureCanonicalRuntimeValue:
  (input: unknown) => CaptureCanonicalRuntimeValueResult;

export const serializeCanonicalRuntimeValue:
  (value: CanonicalRuntimeValue) => CanonicalSerializationResult;
```

The serializer is a T3 pure core over a successfully captured value. It returns a new non-shared `Uint8Array`. It never returns an internal growable buffer or partial bytes.

## Existing `createdAt` policy

`createdAt` remains an existing opaque string field.

P2F1:

- validates it as a string in the exact envelope;
- applies the scalar-string and resource rules;
- includes it in exact event canonical serialization;
- preserves its exact CR/LF and Unicode content if admitted;
- does not parse it;
- does not require ISO syntax;
- does not construct `Date`;
- does not convert a time zone;
- does not normalize or reformat it.

No timestamp or event-schema behavior changes.

## Exact current domain-event inventory

The runtime registry contains exactly:

```ts
export const DOMAIN_EVENT_TYPES_V1 = [
  "GameCreated",
  "ScriptSelected",
  "SeamstressResolutionCapabilityDeclared",
  "SetupGenerated",
  "PlayerRosterCreated",
  "CharactersAssigned",
  "PhaseTransitioned",
  "FirstNightInitialized",
  "InitialPrivateKnowledgeEstablished",
  "FirstNightTaskPlanCreated",
  "FirstNightActionOpportunityCreated",
  "PhilosopherActionDeferred",
  "SeamstressActionDeferred",
  "SeamstressTargetsChosen",
  "SeamstressAbilitySpent",
  "SeamstressInformationDelivered",
  "PhilosopherAbilityChosen",
  "PhilosopherAbilityGranted",
  "AbilityImpairmentApplied",
  "FirstNightTaskInserted",
  "FirstNightTaskInsertedV2",
  "SnakeCharmerTargetChosen",
  "SnakeCharmerDemonSwapApplied",
  "SnakeCharmerNoSwapResolved",
  "SnakeCharmerIneffectiveResolved",
  "WitchTargetChosen",
  "WitchDeathPendingMarked",
  "WitchIneffectiveResolved",
  "CerenovusChoiceRecorded",
  "CerenovusMadnessMarked",
  "CerenovusMadnessInstructionDelivered",
  "DreamerTargetChosen",
  "DreamerInformationDelivered",
  "ClockmakerInformationDelivered",
  "MathematicianInformationDelivered",
  "EvilTwinPairEstablished",
  "EvilTwinInformationDelivered",
  "MinionInformationDelivered",
  "DemonInformationDelivered",
  "ScheduledTaskSettled"
] as const satisfies readonly DomainEventType[];
```

Compile-time and runtime parity are both required:

```ts
type PayloadShapeRegistryV1 = {
  readonly [TEvent in DomainEventType]:
    ContextFreePayloadShapeValidator<TEvent>;
};
```

The registry object has exactly the same 40 keys. A new or removed `DomainEventType` fails compilation and runtime inventory tests until a separate design update is approved.

## Exact unknown event envelope

The root must be a safely captured plain record with exactly these keys:

```text
category
eventId
gameId
eventSequence
batchId
gameVersion
eventType
eventVersion
rulesBaselineVersion
commandId
createdAt
correlationId
causationId
payload
```

Context-free rules:

- `category === "domain"`;
- `eventId` is a string;
- `gameId` is a string;
- `eventSequence` is a positive safe integer;
- `batchId` is a string;
- `gameVersion` is a positive safe integer;
- `eventType` is one of `DOMAIN_EVENT_TYPES_V1`;
- `eventVersion === 1`;
- `rulesBaselineVersion` is a string;
- `commandId` is a string;
- `createdAt` is an opaque string;
- `correlationId` is a string;
- `causationId` is a string;
- `payload` is a plain captured record passing the matching exact payload schema.

Nonemptiness, branded-ID meaning, baseline support, sequence continuity, batch continuity, source relations, and state meaning remain existing semantic validation responsibilities unless the current exact payload schema already freezes a literal or primitive range.

## Exact context-free payload schemas

`domain-event-payload-shape-v1.ts` owns all 40 new context-free schema adapters. This closes ownership without treating existing export names as proof of unknown-input safety.

Each adapter:

- receives only a successfully captured canonical plain record;
- has no `GameState`, source facts, prior events, task plan, opportunity, settlement, receipt, or store parameter;
- declares the exact required root keys for every supported current variant;
- declares any exact optional-key set;
- validates every nested array and record recursively;
- validates every current version or discriminator literal;
- rejects a missing or extra key;
- rejects an unsupported payload version literal;
- returns no typed payload on failure;
- does not remove or replace later stateful validation.

The exact adapter registry is:

| Event | Context-free adapter owned by `domain-event-payload-shape-v1.ts` | Semantic validation retained by |
|---|---|---|
| `GameCreated` | `validateGameCreatedPayloadShapeV1` | `event-applier.ts`, stream and batch validation |
| `ScriptSelected` | `validateScriptSelectedPayloadShapeV1` | `event-applier.ts`, batch validation |
| `SeamstressResolutionCapabilityDeclared` | `validateSeamstressResolutionCapabilityDeclaredPayloadShapeV1` | Seamstress and event-applier state relations |
| `SetupGenerated` | `validateSetupGeneratedPayloadShapeV1` | internal setup validation and event applier |
| `PlayerRosterCreated` | `validatePlayerRosterCreatedPayloadShapeV1` | roster and event-applier validation |
| `CharactersAssigned` | `validateCharactersAssignedPayloadShapeV1` | assignment, tenure, batch, and event-applier validation |
| `PhaseTransitioned` | `validatePhaseTransitionedPayloadShapeV1` | phase-transition policy, batch, and event applier |
| `FirstNightInitialized` | `validateFirstNightInitializedPayloadShapeV1` | initialization provenance and event applier |
| `InitialPrivateKnowledgeEstablished` | `validateInitialPrivateKnowledgeEstablishedPayloadShapeV1` | source-fact and event-applier validation |
| `FirstNightTaskPlanCreated` | `validateFirstNightTaskPlanCreatedPayloadShapeV1` | task-plan source/state validation |
| `FirstNightActionOpportunityCreated` | `validateFirstNightActionOpportunityCreatedPayloadShapeV1` | opportunity source/state validation |
| `PhilosopherActionDeferred` | `validatePhilosopherActionDeferredPayloadShapeV1` | opportunity, task, and settlement validation |
| `SeamstressActionDeferred` | `validateSeamstressActionDeferredPayloadShapeV1` | opportunity, task, and settlement validation |
| `SeamstressTargetsChosen` | `validateSeamstressTargetsChosenPayloadShapeV1` | canonical target/source state validation |
| `SeamstressAbilitySpent` | `validateSeamstressAbilitySpentPayloadShapeV1` | choice/spend chain validation |
| `SeamstressInformationDelivered` | `validateSeamstressInformationDeliveredPayloadShapeV1` | canonical historical-state information validation |
| `PhilosopherAbilityChosen` | `validatePhilosopherAbilityChosenPayloadShapeV1` | opportunity/source/state validation |
| `PhilosopherAbilityGranted` | `validatePhilosopherAbilityGrantedPayloadShapeV1` | grant/source/state validation |
| `AbilityImpairmentApplied` | `validateAbilityImpairmentAppliedPayloadShapeV1` | impairment source and state validation |
| `FirstNightTaskInserted` | `validateFirstNightTaskInsertedPayloadShapeV1` | task-plan/source/state validation |
| `FirstNightTaskInsertedV2` | `validateFirstNightTaskInsertedV2PayloadShapeV1` | task-plan/source/state validation |
| `SnakeCharmerTargetChosen` | `validateSnakeCharmerTargetChosenPayloadShapeV1` | opportunity and current-state validation |
| `SnakeCharmerDemonSwapApplied` | `validateSnakeCharmerDemonSwapAppliedPayloadShapeV1` | settlement and state-transition validation |
| `SnakeCharmerNoSwapResolved` | `validateSnakeCharmerNoSwapResolvedPayloadShapeV1` | settlement and effectiveness validation |
| `SnakeCharmerIneffectiveResolved` | `validateSnakeCharmerIneffectiveResolvedPayloadShapeV1` | impairment and effectiveness validation |
| `WitchTargetChosen` | `validateWitchTargetChosenPayloadShapeV1` | opportunity and current-state validation |
| `WitchDeathPendingMarked` | `validateWitchDeathPendingMarkedPayloadShapeV1` | pending-death and settlement validation |
| `WitchIneffectiveResolved` | `validateWitchIneffectiveResolvedPayloadShapeV1` | impairment and effectiveness validation |
| `CerenovusChoiceRecorded` | `validateCerenovusChoiceRecordedPayloadShapeV1` | opportunity and canonical-state validation |
| `CerenovusMadnessMarked` | `validateCerenovusMadnessMarkedPayloadShapeV1` | choice/marker chain validation |
| `CerenovusMadnessInstructionDelivered` | `validateCerenovusMadnessInstructionDeliveredPayloadShapeV1` | instruction chain and state validation |
| `DreamerTargetChosen` | `validateDreamerTargetChosenPayloadShapeV1` | opportunity, tenure, and current-state validation |
| `DreamerInformationDelivered` | `validateDreamerInformationDeliveredPayloadShapeV1` | source, historical-state, reliability, and constraint validation |
| `ClockmakerInformationDelivered` | `validateClockmakerInformationDeliveredPayloadShapeV1` | canonical-state information validation |
| `MathematicianInformationDelivered` | `validateMathematicianInformationDeliveredPayloadShapeV1` | window, provenance, and canonical-state validation |
| `EvilTwinPairEstablished` | `validateEvilTwinPairEstablishedPayloadShapeV1` | task, settlement, and canonical-state validation |
| `EvilTwinInformationDelivered` | `validateEvilTwinInformationDeliveredPayloadShapeV1` | established-pair and state validation |
| `MinionInformationDelivered` | `validateMinionInformationDeliveredPayloadShapeV1` | team-information source/state validation |
| `DemonInformationDelivered` | `validateDemonInformationDeliveredPayloadShapeV1` | team-information and bluff source/state validation |
| `ScheduledTaskSettled` | `validateScheduledTaskSettledPayloadShapeV1` | task progress and batch settlement validation |

The implementer has no choice to omit an adapter, use `Record<string, unknown>` as success, fabricate semantic context, or make replay validation optional.

For current payload unions, the adapter must enumerate every currently supported discriminant/version branch and exact key set present at the frozen HEAD. A branch not represented by current `DomainEventPayloadByType` rejects. An unrecognized payload version returns `UNSUPPORTED_PAYLOAD_VERSION_LITERAL`.

## Structural versus semantic ownership

### P2F1 structural ownership

- descriptor safety;
- exact plain-data domain;
- exact envelope keys and primitive kinds;
- exact known event type and version;
- exact payload root/nested keys;
- current payload discriminator and version literals;
- dense arrays;
- resource bounds;
- canonical TLV;
- digest shape and framing.

### Existing replay ownership

- accepted event order;
- game identity across a stream;
- rules-baseline compatibility;
- event-sequence continuity;
- batch contiguity and atomic semantics;
- game-version progression;
- phase/state preconditions;
- source-event and source-fact links;
- opportunity/task/settlement relations;
- setup, roster, assignment, tenure, impairment, and information meaning;
- canonical rebuild;
- historical knowledge stability;
- prospective validation.

Structural success never bypasses semantic validation.

## Unknown event result and advisory

### Failure codes

Unknown-event validation adds:

```ts
export type UnknownDomainEventFailureCode =
  | CanonicalRuntimeFailureCode
  | "EVENT_ENVELOPE_MISSING_KEY"
  | "EVENT_ENVELOPE_EXTRA_KEY"
  | "EVENT_ENVELOPE_FIELD_TYPE"
  | "UNKNOWN_EVENT_TYPE"
  | "UNSUPPORTED_EVENT_VERSION"
  | "EVENT_PAYLOAD_MISSING_KEY"
  | "EVENT_PAYLOAD_EXTRA_KEY"
  | "EVENT_PAYLOAD_FIELD_TYPE"
  | "UNSUPPORTED_PAYLOAD_VERSION_LITERAL"
  | "INVALID_EVENT_PAYLOAD";

export type UnknownDomainEventAdvisory =
  | "NONE"
  | "QUARANTINE_SOURCE_IF_PERSISTED_OR_PREVIOUSLY_ACCEPTED";
```

### Result

```ts
export type ValidateUnknownDomainEventResult =
  | {
      readonly valid: true;
      readonly event: AnyDomainEventEnvelope;
      readonly canonicalValue: CanonicalRuntimeValue;
      readonly advisory: "NONE";
    }
  | {
      readonly valid: false;
      readonly diagnostic: {
        readonly code: UnknownDomainEventFailureCode;
        readonly path: readonly CanonicalDiagnosticPathSegment[];
        readonly valueKind: CanonicalDiagnosticValueKind;
      };
      readonly advisory:
        "QUARANTINE_SOURCE_IF_PERSISTED_OR_PREVIOUSLY_ACCEPTED";
    };

export const validateUnknownDomainEvent:
  (input: unknown) => ValidateUnknownDomainEventResult;
```

Only this unknown-event T1 result carries a quarantine advisory. It is conditional advice to a future source-owning consumer. P2F1 never quarantines a game, artifact, stream, event, or state.

No result includes:

- caller object keys;
- arbitrary field values;
- IDs;
- bytes;
- state;
- events other than the complete valid detached event;
- receipts;
- source classification;
- authority.

### Only permitted internal cast

The single raw-to-domain cast occurs inside `unknown-domain-event.ts` after:

1. complete descriptor-safe capture;
2. exact envelope-key validation;
3. exact primitive validation;
4. known `eventType`;
5. supported `eventVersion`;
6. exact matching payload validation.

It narrows one detached event to the exact `DomainEventEnvelope<TEvent>` member. No collection cast, pre-dispatch cast, or caller assertion is accepted.

### Whole-candidate failure

For one event candidate:

- any failure rejects the entire event;
- no partial event or payload returns;
- no child is skipped;
- no unknown type is downgraded;
- no domain event becomes an audit or infrastructure event;
- no value is coerced or repaired.

A later collection consumer must reject its complete candidate collection if any member rejects. P2F1 itself does not define a replay collection parser.

## Raw-byte T1 boundary

### Purpose and limit

Raw-byte hashing binds exact bytes only. It does not decode UTF-8, parse JSON, detect duplicate JSON keys, or approve a replay artifact.

```ts
export const MAX_RAW_BYTE_HASH_INPUT_BYTES = 16_777_216;
```

### Exact failure codes

```ts
export type RawByteCaptureFailureCode =
  | "RAW_BYTE_PROXY_VALUE"
  | "RAW_BYTE_NOT_UINT8_ARRAY"
  | "RAW_BYTE_SHARED_ARRAY_BUFFER"
  | "RAW_BYTE_DETACHED_OR_INVALID_VIEW"
  | "RAW_BYTE_RESOURCE_LIMIT_EXCEEDED"
  | "RAW_BYTE_COPY_FAILED";
```

### T1 capture order

The public input is `unknown`.

1. Call `node:util` `types.isProxy` before any reflection or property access.
2. A Proxy or revoked Proxy returns `RAW_BYTE_PROXY_VALUE`.
3. Use `node:util` typed-array brand checks to require a genuine `Uint8Array`.
4. Reject every other typed array, `DataView`, `ArrayBuffer`, object lookalike, accessor-bearing lookalike, and primitive with `RAW_BYTE_NOT_UINT8_ARRAY`.
5. Obtain backing-buffer, offset, and length only through intrinsic typed-array brand/accessor operations, never caller properties.
6. Reject a `SharedArrayBuffer` backing with `RAW_BYTE_SHARED_ARRAY_BUFFER`.
7. Reject a detached buffer, invalid offset/length, or invalid view with `RAW_BYTE_DETACHED_OR_INVALID_VIEW`.
8. Reject length greater than `MAX_RAW_BYTE_HASH_INPUT_BYTES` with `RAW_BYTE_RESOURCE_LIMIT_EXCEEDED`.
9. Allocate one new non-shared `Uint8Array` of the validated length.
10. Copy once with intrinsic typed-array operations that do not invoke a caller iterator, getter, species constructor, or method.
11. Any intrinsic validation/copy failure returns `RAW_BYTE_COPY_FAILED` unless it is already classified as detached/invalid.
12. Hash only the copied bytes.

The copied bytes are the complete raw evidence. The caller's view is never retained or reread.

### Contract

```ts
export type CapturedRawBytes = {
  readonly byteLength: number;
  readonly bytes: Uint8Array;
};

export type CaptureRawBytesResult =
  | {
      readonly valid: true;
      readonly captured: CapturedRawBytes;
    }
  | {
      readonly valid: false;
      readonly code: RawByteCaptureFailureCode;
    };

export const captureRawBytes:
  (input: unknown) => CaptureRawBytesResult;
```

`CapturedRawBytes.bytes` is a new non-shared copy. Callers must not receive the mutable internal array used during hashing; the hash API returns only the digest result.

## Replay JSON exclusion

P2F1 does not:

- decode replay bytes as UTF-8;
- parse replay JSON;
- detect duplicate JSON keys;
- enforce BOM, whitespace, comment, or trailing-comma rules;
- validate a replay bundle root;
- approve an artifact identity;
- maintain an approval registry;
- admit imported history.

Strict replay JSON and duplicate-key parsing remain later P2F/replay design work unless separately authorized.

`RawByteHash` proves only that one validated copied byte sequence hashes to one digest. A caller may hash arbitrary bytes; this conveys no replay validity or authority.

## Digest result

Every hash result has:

```ts
export type Sha256IntegrityResult<TVersion extends string> = {
  readonly hashVersion: TVersion;
  readonly algorithm: typeof CANONICAL_RUNTIME_DIGEST_ALGORITHM;
  readonly byteLength: number;
  readonly sha256Hex: string;
};
```

`sha256Hex` is exactly 64 lowercase hexadecimal characters.

The pure SHA-256 operation over already validated copied bytes is T3. The raw `unknown` capture is a separate T1 boundary.

## Common canonical hash framing

Canonical value, state, and aggregate binding hashes use:

```text
ASCII "BOTC-HASH-V1"
u32be domain UTF-8 byte length
domain UTF-8 bytes
u32be serialization-version UTF-8 byte length
serialization-version UTF-8 bytes
u64be canonical serialized byte length
canonical serialized bytes, including the eight-byte BOTCCRV header
```

The serialization-version field is exactly:

```text
botc-canonical-runtime-tlv-be-v1
```

No platform-default encoding, delimiter concatenation, locale, JSON stringification, or omitted length is allowed.

## Four frozen hash roles

### 1. Raw byte hash

- hash version: `botc-raw-byte-sha256-v1`;
- input: the exact copied bytes only;
- framing: none;
- algorithm: SHA-256;
- byte length: copied raw byte length.

The raw digest is transport/integrity evidence only.

### 2. Canonical value hash

- hash version: `botc-canonical-value-sha256-v1`;
- domain: `BOTC_CANONICAL_VALUE_V1`;
- input value: one successfully captured `CanonicalRuntimeValue`;
- serialization: exact `botc-canonical-runtime-tlv-be-v1`;
- preimage: common canonical hash framing.

### 3. Canonical state hash

- hash version: `botc-canonical-state-sha256-v1`;
- domain: `BOTC_CANONICAL_STATE_V1`;
- input value: a canonical runtime value supplied only after an existing semantic replay consumer has validated and rebuilt state;
- serialization: exact `botc-canonical-runtime-tlv-be-v1`;
- preimage: common canonical hash framing.

P2F1 does not rebuild, validate, select, or authorize that state. The distinct role prevents a generic value digest from being mislabeled as a state digest.

### 4. Aggregate binding hash

- hash version: `botc-aggregate-binding-sha256-v1`;
- domain: `BOTC_AGGREGATE_BINDING_V1`;
- input: one exact binding record;
- serialization: exact `botc-canonical-runtime-tlv-be-v1`;
- preimage: common canonical hash framing.

The binding record has exactly these keys:

```ts
export type AggregateBindingHashInput = {
  readonly bindingVersion:
    typeof AGGREGATE_BINDING_HASH_VERSION;
  readonly serializationVersion:
    typeof CANONICAL_RUNTIME_SERIALIZATION_VERSION;
  readonly gameId: string;
  readonly rulesBaselineVersion: string;
  readonly finalGameVersion: number;
  readonly finalEventSequence: number;
  readonly orderedEventHashes: readonly string[];
  readonly orderedBatchHashes: readonly string[];
  readonly orderedReceiptHashes: readonly string[];
  readonly canonicalStateHash: string | null;
};
```

Validation:

- exact keys only;
- exact version literals;
- strings remain exact canonical strings;
- final versions/sequences are positive safe integers;
- every hash is exactly lowercase 64-hex;
- arrays are dense and retain order;
- `canonicalStateHash` is lowercase 64-hex or `null`;
- empty arrays remain explicit empty arrays;
- no member is sorted, deduplicated, repaired, or omitted.

The binding digest proves deterministic integrity of this exact record only. It does not prove that any event, batch, receipt, state, or source was accepted.

## Hash APIs

```ts
export const hashRawBytes:
  (input: unknown) =>
    | {
        readonly valid: true;
        readonly hash:
          Sha256IntegrityResult<typeof RAW_BYTE_HASH_VERSION>;
      }
    | {
        readonly valid: false;
        readonly code: RawByteCaptureFailureCode;
      };

export const hashCanonicalValue:
  (value: CanonicalRuntimeValue) =>
    Sha256IntegrityResult<typeof CANONICAL_VALUE_HASH_VERSION>;

export const hashCanonicalStateValue:
  (value: CanonicalRuntimeValue) =>
    Sha256IntegrityResult<typeof CANONICAL_STATE_HASH_VERSION>;

export const hashAggregateBinding:
  (input: AggregateBindingHashInput) =>
    | {
        readonly valid: true;
        readonly hash:
          Sha256IntegrityResult<
            typeof AGGREGATE_BINDING_HASH_VERSION
          >;
      }
    | {
        readonly valid: false;
        readonly diagnostic: CanonicalRuntimeDiagnostic;
      };
```

No API accepts a caller-supplied digest as proof of valid content. No API returns an authority handle.

## Hash is not authority

All four hashes are integrity evidence.

They do not prove:

- who produced the bytes or value;
- that a command succeeded;
- that an event was persisted;
- that a receipt is authentic;
- that a batch was atomic;
- that a stream is complete;
- that replay succeeded;
- that state is canonical;
- that a replay artifact is approved;
- that a snapshot matches events;
- that a source may receive authority.

A caller may produce self-consistent values and hashes. They remain untrusted data. Only later P2F may combine P2F1 integrity evidence with a repository-controlled accepted source and issue authority.

## Snapshot boundary

P2F1 treats snapshot-shaped data only as a canonical value that may receive the canonical value or canonical state hash role after its caller meets that role's precondition.

P2F1 does not:

- define a snapshot schema;
- change a snapshot schema;
- parse a snapshot artifact;
- rebuild state;
- compare a snapshot with events;
- compare two state values for semantic equality;
- select a snapshot;
- repair events from a snapshot;
- make a snapshot source authority;
- issue state authority.

Snapshot remains `CACHE_ONLY`. Event-to-snapshot relation, event-only rebuild, equality, mismatch, selection, and rejection semantics remain later P2F/existing replay ownership.

## Compatibility and nonmigration

- existing events remain byte-for-byte unchanged;
- existing `eventVersion` remains `1`;
- existing payloads remain unchanged;
- existing replay functions remain unchanged;
- existing accepted commands and receipts remain unchanged;
- existing snapshots remain unchanged;
- existing command fingerprints retain their own command-specific format;
- `canonical-data.ts` remains unchanged and retains its current private encoding/equality purpose;
- no persisted artifact is rewritten;
- no existing digest is reinterpreted as a P2F1 digest;
- no P2F1 version is inferred for old data;
- no migration runs;
- no product path consumes P2F1 until separately authorized.

This is an additive foundation, not a replacement or compatibility alias.

## Public export boundary

`packages/domain-core/src/index.ts` may add exports only for:

- version and limit constants;
- canonical runtime value/result/diagnostic types;
- `captureCanonicalRuntimeValue`;
- `serializeCanonicalRuntimeValue`;
- exact domain-event inventory;
- `validateUnknownDomainEvent`;
- hash result/input types;
- `hashRawBytes`;
- `hashCanonicalValue`;
- `hashCanonicalStateValue`;
- `hashAggregateBinding`.

Forbidden exports:

- payload registry internals;
- individual payload adapter functions;
- internal cast helpers;
- mutable buffers;
- capture builders;
- serializer writers;
- SHA implementation state;
- fake authority/test hooks;
- quarantine functions;
- replay parsers;
- approval APIs;
- handle types.

## Exact future file allowlist

Implementation remains dormant until independent design pass and explicit implementation authorization.

### Production — maximum five files

1. new `packages/domain-core/src/canonical-runtime-value.ts`
2. new `packages/domain-core/src/canonical-runtime-hash.ts`
3. new `packages/domain-core/src/domain-event-payload-shape-v1.ts`
4. new `packages/domain-core/src/unknown-domain-event.ts`
5. existing `packages/domain-core/src/index.ts` — additive exports only

Production estimate:

- expected added production lines: `1300–1800`;
- hard maximum added production lines: `2000`;
- maximum production files touched: `5`.

### Tests — maximum four files

1. new `packages/domain-core/src/canonical-runtime-value.test.ts`
2. new `packages/domain-core/src/canonical-runtime-hash.test.ts`
3. new `packages/domain-core/src/domain-event-payload-shape-v1.test.ts`
4. new `packages/domain-core/src/unknown-domain-event.test.ts`

### Documentation

A future implementation may add only the separately authorized P2F1 implementation traceability/status document required by the agent loop.

## Exact denylist

No implementation change is allowed to:

- `packages/domain-core/src/events.ts`;
- `packages/domain-core/src/canonical-data.ts`;
- `packages/domain-core/src/event-stream-validator.ts`;
- `packages/domain-core/src/event-applier.ts`;
- `packages/domain-core/src/domain-batch-semantics.ts`;
- `packages/domain-core/src/rebuild.ts`;
- `packages/domain-core/src/game-state.ts`;
- any application command fingerprint file;
- `GameApplicationService`;
- any command-store interface or implementation;
- the memory command store;
- any role module;
- any projection;
- any persistence schema or adapter;
- any event, payload, receipt, snapshot, state, or command schema;
- any workflow;
- any dependency or lockfile;
- any CI timeout or coverage threshold;
- P2F design or precheck documents;
- agent-loop control files during implementation unless separately authorized.

## Acceptance checks

A future implementation is acceptable only if it proves:

1. all exact constants and failure codes match this design;
2. generic diagnostics have no quarantine field;
3. generic paths never echo arbitrary keys;
4. unknown-event failure alone carries the conditional advisory;
5. Proxy and revoked Proxy reject before reflection;
6. getters, iterators, coercion, and caller code are not invoked;
7. captures are detached and deeply frozen;
8. all resource limits reject atomically;
9. TLV header, tags, lengths, integers, ordering, Unicode, and header-once rule match byte vectors;
10. lone surrogates reject and CR/LF/CRLF remain distinct;
11. `createdAt` is opaque and exact;
12. all 40 events have exact context-free schemas;
13. unknown type/version and invalid payload reject;
14. only the post-validation internal cast exists;
15. no event or child is skipped, downgraded, converted, or partially returned;
16. raw byte input is genuine non-shared `Uint8Array`, bounded and copied once;
17. detached/shared/other-view/lookalike raw values reject with exact codes;
18. P2F1 has no JSON parser or artifact approval;
19. four hash roles have exact distinct versions, domains, inputs, framing, and results;
20. raw hash covers copied bytes only;
21. canonical hashes include exact common framing and the TLV header;
22. hash remains non-authoritative;
23. snapshot behavior is structural/hash-only and non-authoritative;
24. existing semantic replay remains unchanged;
25. no schema, migration, product behavior, or P2F design changes;
26. production and test files remain within the allowlist;
27. production additions remain at or below 2000 lines;
28. Linux and Windows vectors are byte-for-byte equal;
29. required exact-head CI is green;
30. independent final review supplies the required verdicts.

## Test design

### `canonical-runtime-value.test.ts`

- every accepted scalar;
- every rejected scalar;
- safe-integer boundaries;
- negative zero;
- valid surrogate pairs;
- lone high and low surrogates in values and keys;
- ASCII, Chinese, combining sequences;
- CR, LF, and CRLF;
- dense and sparse arrays;
- keyed and modified-length arrays;
- plain and null-prototype records;
- class and built-in instances;
- Proxy and revoked Proxy trap counters;
- accessors with zero getter invocation;
- symbol and non-enumerable properties;
- cycles and repeated acyclic references;
- every resource boundary at limit and one over;
- deep-freeze and detachment;
- safe ordinal paths and 32-segment truncation;
- exact TLV vectors.

### `canonical-runtime-hash.test.ts`

- raw T1 primitive/lookalike/Proxy/revoked/shared/detached/other-view rejection;
- exact failure codes;
- bounded raw size;
- copy-once mutation isolation;
- raw SHA-256 known answers;
- canonical value framing known answers;
- state-domain separation;
- aggregate exact-key and hash-shape validation;
- member order, omission, duplicate, boundary, version, and null-state cases;
- all four version literals;
- lowercase 64-hex results;
- domain separation;
- no authority-shaped export.

### `domain-event-payload-shape-v1.test.ts`

- one valid fixture for every current payload variant;
- missing root key for every adapter;
- extra root key for every adapter;
- wrong primitive type;
- every nested exact-key mutation;
- every supported discriminator/version branch;
- unsupported version literal;
- state/source semantic invalidity remains outside the adapter and is still rejected by existing replay tests;
- registry compile-time and runtime parity.

### `unknown-domain-event.test.ts`

- all 40 exact events;
- exact 14-key envelope;
- missing/extra/accessor/symbol/proxy/cycle cases;
- unknown event type;
- unsupported event version;
- payload failure code mapping;
- only valid results expose a complete detached typed event;
- invalid results expose no partial event;
- generic capture has no advisory;
- valid unknown-event result has `NONE`;
- invalid unknown-event result has `QUARANTINE_SOURCE_IF_PERSISTED_OR_PREVIOUSLY_ACCEPTED`;
- diagnostic key secrecy;
- only one internal post-validation cast;
- no replay JSON or artifact approval API.

## CI

Future implementation requires:

- file-scoped Vitest during development;
- file-scoped ESLint for each changed TypeScript file;
- `pnpm typecheck`;
- `pnpm lint`;
- `pnpm test`;
- `pnpm test:coverage`;
- required Linux and Windows exact-byte/digest vector execution;
- exact frozen feature HEAD CI before independent final review.

Cross-platform tests compare literal expected hexadecimal bytes and SHA-256 strings. They do not compare only two platform-produced values with each other.

This design run performs no CI.

## Design-time Governance Traceability V1.1

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `P2F1-C01_EXHAUSTIVE_REGISTRY` | The exact 40-event registry is complete | Compile-time mapped registry and runtime list contain every current type once and no extra | Direct registry parity validation | `R3` | `T1` | `STRUCTURAL_VALIDATION` | initialization/compilation fails on mismatch | current `DomainEventPayloadByType`; no schema change |
| `P2F1-C02_PROXY_FIRST` | Proxy values reject before reflection | top-level and nested Proxy/revoked Proxy trigger no installed trap | Direct hostile unknown capture | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `PROXY_VALUE`; no partial result | Node `util.types.isProxy` |
| `P2F1-C03_DESCRIPTOR_CAPTURE` | Capture never invokes caller behavior | accessors, symbols, cycles, sparse/keyed arrays, nonplain objects reject; getter count zero | Direct descriptor-hostility matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact code and safe path; detached success only | valid plain-data controls |
| `P2F1-C04_EXACT_ENVELOPE` | The envelope has exactly 14 fields and exact primitive rules | missing, extra, wrong-kind, invalid literal, and integer cases reject | Direct unknown-envelope validator | `R3` | `T1` | `STRUCTURAL_VALIDATION` | only exact envelope advances | frozen current envelope schema |
| `P2F1-C05_EXACT_PAYLOADS` | Every current payload has a context-free exact schema | every current variant passes; missing/extra/nested/version mutations reject | Per-event direct payload-shape matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | all 40 adapters exact; stateful checks unchanged | current payload contracts and validators |
| `P2F1-C06_UNKNOWN_TYPE_VERSION` | Unknown event types and versions fail closed | unknown type, unsupported event version, and unsupported payload version reject before cast | Direct discriminator/version validation | `R3` | `T1` | `STRUCTURAL_VALIDATION` | no fallback, skip, downgrade, or partial event | exact registry and event version 1 |
| `P2F1-C07_CANONICAL_DOMAIN` | Only the closed canonical value domain admits | every forbidden value class rejects and accepted values detach/freeze | Direct canonical capture matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact failure code or immutable value | frozen value-domain version |
| `P2F1-C08_NULL_UNDEFINED_MISSING` | Null, undefined, and missing remain distinct | null admits; undefined, hole, and present-undefined reject; missing schema key has its own code | Direct scalar/container/schema validation | `R3` | `T1` | `STRUCTURAL_VALIDATION` | no omission or substitution | canonical domain and exact schemas |
| `P2F1-C09_UNICODE_NEWLINE` | Unicode and newline bytes are exact | Unicode vectors match, normalization forms differ, lone surrogates reject, CR/LF/CRLF differ | Pure serializer known-answer vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | exact TLV bytes | frozen scalar-string policy |
| `P2F1-C10_ORDERING` | Objects use raw code-unit order and arrays retain order | object insertion permutations match; array permutations differ; locale cannot affect output | Pure ordering and TLV vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | deterministic bytes | frozen comparator and TLV |
| `P2F1-C11_RESOURCE_LIMITS` | Every limit fails atomically | at-limit candidate succeeds when otherwise valid; one-over candidate returns resource failure with no partial output | Direct boundary matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `RESOURCE_LIMIT_EXCEEDED` | frozen limits |
| `P2F1-C12_TIMESTAMP_OPACITY` | `createdAt` remains an exact opaque string | exact string is serialized; no parse, ISO restriction, timezone, or normalization occurs | Direct envelope plus serialization vectors | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact field retained | current envelope field only |
| `P2F1-C13_SERIALIZATION_VERSION` | TLV is explicit and immutable | exact header/tags/framing/version pass; unknown version has no fallback | Pure TLV/version policy vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | exact `botc-canonical-runtime-tlv-be-v1` bytes | frozen design constants |
| `P2F1-C14A_RAW_BYTE_CAPTURE` | Raw hashing starts with a safe copied byte view | Proxy first, genuine Uint8Array brand, non-shared/non-detached/bounded checks, and one intrinsic copy all pass | Direct hostile `unknown` raw-byte boundary | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact raw failure or validated copy; no caller view retained | Node typed-array brands/intrinsics |
| `P2F1-C14B_RAW_BYTE_DIGEST` | Raw digest covers copied bytes only | standard SHA vectors and one-byte mutations produce exact results with no framing | Pure digest known-answer vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | `botc-raw-byte-sha256-v1` result | validated copied bytes only |
| `P2F1-C15_CANONICAL_VALUE_HASH` | Canonical value hash uses exact common framing and value domain | literal preimage and digest vectors match | Pure framed-hash vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | value-domain digest only | captured canonical value |
| `P2F1-C16_CANONICAL_STATE_HASH` | State hash has a distinct role and no validation authority | same bytes under value/state domains differ; API performs no rebuild | Pure domain-separation vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | state-role digest only | future caller supplies semantically validated value |
| `P2F1-C17_AGGREGATE_BINDING_HASH` | Aggregate input is exact, ordered, versioned, and domain-separated | exact keys/hashes/count/order/null rules pass; mutations alter/reject | Pure binding-policy vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | aggregate integrity digest only | validated member digests; no provenance claim |
| `P2F1-C18_HASH_NOT_AUTHORITY` | No P2F1 hash or result can issue authority | self-consistent caller hashes remain data; no register/issue/handle API exists | Export and direct result-shape inspection | `R3` | `T1` | `STRUCTURAL_VALIDATION` | integrity evidence only | later P2F unique issuer remains required |
| `P2F1-C19_SNAPSHOT_BOUNDARY` | Snapshot handling is structural/hash-only | pure value/hash API performs no rebuild, equality, selection, repair, or issuance | Pure boundary and export inspection | `R4` | `T3` | `PURE_POLICY_SEAM` | `CACHE_ONLY`; no semantic result | later P2F/existing replay owns relation |
| `P2F1-C20_SAFE_DIAGNOSTICS` | Diagnostics are bounded and secret-safe | arbitrary keys/values/IDs/bytes/state/receipts never appear; ordinals and truncation are exact; generic result has no advisory | Direct hostile diagnostic matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | fixed code/path/valueKind only | recognized schema field constants |
| `P2F1-C21_COMPATIBILITY` | The foundation is additive and nonmigrating | existing schemas, replay, fingerprints, persistence, and behavior are byte/behavior unchanged | Static boundary and compatibility inspection | `R4` | `T3` | `STRUCTURAL_VALIDATION` | no migration or alias | exact allowlist and denylist |
| `P2F1-C22_CROSS_PLATFORM` | Canonical bytes and digests are platform-independent | literal vectors pass on Linux and Windows at exact reviewed HEAD | Required OS-matrix execution | `R4` | `T3` | `CROSS_PLATFORM_CI` | identical expected TLV and SHA values | frozen TLV, TextEncoder, ordering, framing |

Every row has exactly one reachability class, one trust class, and one primary layer. There is no accepted-stream integration criterion.

## Documentation

Future implementation documentation must:

- bind every criterion above to its actual test;
- record exact version literals and vectors;
- list actual production/test files and added production LOC;
- distinguish structural success from semantic replay;
- state that raw hashing does not parse JSON;
- state that hashes are not authority;
- state that P2F1 never quarantines or issues authority;
- record Linux and Windows exact-head results;
- preserve the P2F `HUMAN_BLOCKED` status until required gates pass.

## Rollback

Future rollback:

1. remove the four new domain-core production modules;
2. remove their four new test files;
3. remove only the additive P2F1 exports from `packages/domain-core/src/index.ts`;
4. remove P2F1 implementation traceability documentation.

No event, payload, receipt, snapshot, state, command, persistence, or product data rewrite is required because none may change.

## Stop-loss

Stop and reslice if:

- any sixth production file is required;
- any production file outside the allowlist must change;
- added production lines exceed `2000`;
- any dependency or lockfile change is required;
- any event, payload, receipt, snapshot, state, command, persistence, or workflow schema must change;
- any application behavior must change;
- any P2F design or agent-loop control file must change;
- any event lacks an exact context-free schema;
- any adapter requires fabricated state or source facts;
- any existing stateful validator must be weakened, removed, or bypassed;
- any raw-to-domain cast is required before complete per-event validation;
- any collection-wide cast is required;
- any event or child may skip, downgrade, convert, repair, or partially return;
- Proxy rejection cannot occur before reflection;
- caller code, getter, iterator, coercion, species constructor, or inspection hook must run;
- arbitrary caller keys or values must enter diagnostics;
- generic capture requires quarantine metadata;
- P2F1 must own quarantine;
- raw hashing must accept shared, detached, non-Uint8Array, unbounded, or caller-retained bytes;
- P2F1 must parse replay JSON or detect duplicate JSON keys;
- P2F1 must approve a replay artifact;
- canonical TLV differs from the exact header, tags, lengths, endianness, ordering, Unicode, or resource rules;
- lone surrogates must be replaced rather than rejected;
- timestamp parsing or normalization is required;
- any hash role loses its exact version, domain, framing, input, or separation;
- a hash must be treated as source authority;
- snapshot rebuild, equality, selection, repair, or authority is required;
- P2F1 must issue or validate a trusted-history or canonical-state handle;
- Linux and Windows literal vectors cannot agree;
- an independent reviewer does not return the protocol-defined passing design verdict.

## Independent design-review checklist

The reviewer must verify:

- exact authorization and parent SHA;
- standalone design status and no implementation authorization;
- all controller refinements are closed;
- generic diagnostics have no quarantine field;
- diagnostic paths cannot leak arbitrary keys or values;
- only unknown-event failure carries the advisory;
- raw T1 and pure raw SHA are separate;
- genuine non-shared Uint8Array brand, detachment, limit, and copy rules are exact;
- P2F1 has no replay JSON parser or artifact approval;
- TLV bytes and resource limits are fully frozen;
- Unicode, lone surrogate, newline, ordering, and timestamp policies are exact;
- all 40 events appear once;
- payload schema ownership is context-free and exhaustive;
- semantic replay remains unchanged and mandatory;
- only the post-validation internal cast exists;
- whole-candidate rejection has no skip/downgrade/partial result;
- four hash roles are distinct and non-authoritative;
- snapshot is structural/hash-only;
- exports, allowlist, denylist, and LOC ceiling are exact;
- compatibility requires no migration;
- traceability has exactly the nine design-time fields;
- R4/T3 classifications are used for future pure serialization/hash behavior;
- raw hostile input is `R3 / T1 / STRUCTURAL_VALIDATION`;
- cross-platform evidence is `R4 / T3 / CROSS_PLATFORM_CI`;
- no criterion claims accepted-stream integration;
- no passing design-review verdict is claimed by this document;
- P2F remains blocked;
- implementation remains unauthorized.

## Design disposition

- reviewStatus: `NOT_REVIEWED`
- implementationAuthorized: `false`
- eventSchemaChanged: `false`
- acceptedBehaviorChanged: `false`
- migrationRequired: `false`
- P2FDesignChanged: `false`
- P2FStatus: `HUMAN_BLOCKED_PENDING_P2F1`
- nextRequiredAction: `INDEPENDENT_RULE_DESIGN_REVIEW_P2F1_ROUND_1`

READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW_P2F1_ROUND_1
