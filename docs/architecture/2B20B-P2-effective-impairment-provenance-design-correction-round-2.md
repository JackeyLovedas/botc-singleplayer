# Phase 3 Slice 2B20B-P2 — Effective Impairment Provenance Design Correction Round 2

## Metadata

- `sliceId`: `2B20B-P2`
- `documentType`: `STANDALONE_DESIGN_CORRECTION`
- `designCorrectionRound`: `2`
- `authorizationSource`: `EXPLICIT_USER_REQUEST_IN_CURRENT_THREAD`
- `authorizationScope`: `DESIGN_CORRECTION_ROUND_2_ONLY`
- `parentDesignPath`: `docs/architecture/2B20B-P2-effective-impairment-provenance-separation-design.md`
- `parentDesignSha256`: `2f397430ba8325bb07ba885f1769726235f91236a886bdbe55d10e042a36c277`
- `round1DesignPath`: `docs/architecture/2B20B-P2-effective-impairment-provenance-design-correction-round-1.md`
- `ruleEvidencePath`: `docs/rules/evidence/2B20B-P2-impairment-state-provenance.md`
- `ruleVerdict`: `RULE_READY`
- `priorExactDesignReviewVerdict`: `HUMAN_BLOCKED`
- `designVerdict`: `NOT_REVIEWED`
- `implementationAuthorized`: `false`
- `ruleSemanticsChanged`: `false`
- `acceptedBehaviorChanged`: `false`
- `eventSchemaChanged`: `false`
- `snapshotSchemaChanged`: `false`
- `receiptSchemaChanged`: `false`
- `productionChangeAuthorized`: `false`
- `testChangeAuthorized`: `false`
- `workflowChangeAuthorized`: `false`
- `profileChangeAuthorized`: `false`
- `prCreationAuthorized`: `false`
- `recommendedDisposition`: `HUMAN_BLOCKED / RESLICE_REQUIRED`
- `requiredPrerequisite`: `TRUSTED_ACCEPTED_HISTORY_AUTHORITY_FOUNDATION`
- `requiredNextAction`: `RESLICE_T1_FOUNDATION_BEFORE_P2_IMPLEMENTATION`

This document does not claim `RULE_DESIGN_PASS`. It records a complete corrected contract and the remaining architectural conflict. No production code, tests, event schema, workflow, profile, branch publication, or PR work is authorized.

## Authority and supersession

The parent design and Round 1 correction remain immutable historical evidence. This Round 2 document is standalone and contains the complete corrected authority needed to understand the proposed P2 behavior, the required T1 foundation, the C19 conflict, the hostile matrices, and the stop condition.

Where this document conflicts with the parent or Round 1, this document controls for future P2 consideration. It does not retroactively change the meaning or verdict of either earlier artifact.

The following repository facts remain authoritative:

1. `validateDomainEventStream` accepts a typed `readonly AnyDomainEventEnvelope[]`; it is not an `unknown` exact-shape boundary.
2. `rebuildGameState` validates typed stream ordering, batch semantics, event application, and selected replay invariants; it is not an external or persisted-data parser.
3. `CommandCommitStore.loadDomainEvents` returns typed event envelopes but does not prove persisted-record shape, checksums, snapshot equality, or complete receipt enumeration.
4. `MemoryCommandCommitStore` validates accepted writes and stores events, receipts, and game versions, but exposes neither an authority bundle nor event/batch checksums or snapshot records.
5. `DomainEventEnvelope` currently has no `payloadChecksum`.
6. The persistence architecture describes event, batch, snapshot, and export checksums, but no implemented production persistence adapter or snapshot provider supplies that contract.
7. A TypeScript type, cast, fixture object, or shape-only event array does not prove accepted-history authority.

## Scope

The intended P2 product behavior remains narrow:

- derive the effective canonical player-condition set `NONE`, `DRUNK`, `POISONED`, or `DRUNK + POISONED`;
- evaluate only at a complete committed `gameVersion`;
- use canonical rebuilt current-character and impairment state;
- attach exact known provenance only when established by accepted canonical history;
- preserve Philosopher-caused DRUNK and Snake Charmer Demon-hit POISONED mappings;
- expose no ability identity;
- call no Dreamer or other role-specific ability resolver;
- add no producer for `UNKNOWN_SOURCE` or `ROLE_EFFECT`.

The newly identified prerequisite is broader than this product behavior: a reusable T1 accepted-history authority capable of proving that an event prefix, its committed batches, receipts, checksums, and optional snapshot form one accepted canonical history. Under repository stop-loss rules, that prerequisite must be a separate foundation Slice.

## Explicit non-goals

This design does not authorize:

- POISONED Dreamer behavior;
- No Dashii impairment derivation;
- Vigormortis death, retained-Minion, adjacency, poison, or other-night mechanics;
- gained-Dreamer impairment;
- current/dead/impaired Vortox expansion;
- a generic impairment engine;
- `EffectInstance` or `ContinuousRule`;
- a generic ability registry;
- changes to Dreamer, Philosopher, Snake Charmer, projections, ledgers, or accepted P1 behavior;
- new domain events or payload versions;
- snapshot persistence implementation;
- SQLite implementation;
- FIRST_NIGHT completion;
- DAWN_RESOLUTION or DAY_DISCUSSION;
- nomination, voting, execution, death, or Phase 2C.

## Rule behavior retained from Round 1

### Sole time authority

`gameVersion` is the only effective-condition query and interval domain.

- `eventSequence` orders events and proves complete prefixes.
- `batchId` identifies atomic grouping.
- current-character revision is a provenance cross-link, not a global clock.
- no query may stop inside a committed batch.
- historical version `G` rebuilds only the complete prefix through `G`.
- `CURRENT` means the final complete committed game version.

For an accepted impairment event in game version `G`:

```text
effectiveFromGameVersion = G
effectiveUntilGameVersionExclusive = null
```

The condition is absent before the complete `G` batch and present at the complete `G` boundary. No end event is invented.

### Effective-condition authority

The authority chain must be:

```text
trusted accepted-history producer
  -> exact T1 bundle capture and validation
  -> validated complete event prefix
  -> canonical event-only rebuild
  -> runtime-issued canonical-state handle
  -> producer-neutral effective-condition derivation
  -> separately authorized future role-specific resolver
```

P2 owns only the producer-neutral derivation after the T1 foundation exists. It does not identify or execute an ability.

## T1 accepted-history foundation requirement

### Required separate Slice

Before P2 implementation, create and independently review a separate bounded foundation, suggested identifier:

```text
2B20B-P2F — Trusted Accepted History Authority Foundation
```

That foundation owns:

- accepted-history authority production;
- exact unknown bundle capture;
- event-envelope and payload dispatch validation;
- batch/receipt/checksum reconciliation;
- optional snapshot validation;
- runtime authority issuance;
- approved frozen replay-bundle admission;
- hostile external/import rejection.

P2 must not absorb this infrastructure into its impairment resolver.

### Authority sources

Only these sources may eventually issue trusted history:

1. `TRUSTED_COMMIT_JOURNAL`

   A repository-controlled journal observes successful `commitAcceptedCommand` transactions. It records a batch only after the underlying accepted commit resolves. It retains the exact accepted batch and accepted receipt that participated in that transaction.

2. `APPROVED_FROZEN_REPLAY_BUNDLE`

   Raw replay bytes are accepted only when an immutable repository approval registry contains the exact bundle identity, SHA-256, revision, and purpose. The bytes are still parsed and fully validated. Approval does not bypass validation.

There is currently no implemented producer for either source. A caller-provided `sourceKind` string, bundle object, interface implementation, typed port, cast, or constructor call is never authority.

External/imported history without an approved frozen-bundle registry entry must return `UNTRUSTED_AUTHORITY_SOURCE`.

## Complete future T1 bundle contract

The following is a future foundation contract, not an existing type or implementation:

```ts
import type {
  AnyDomainEventEnvelope,
  BatchId,
  CommandId,
  EventId,
  GameId,
  GameState,
} from "@botc/domain-core";

export const TRUSTED_ACCEPTED_HISTORY_BUNDLE_VERSION =
  "trusted-accepted-history-bundle-v1" as const;

export const TRUSTED_HISTORY_CANONICALIZATION_ALGORITHM =
  "plain-data-tagged-tree-code-unit-keys-v1" as const;

export const TRUSTED_HISTORY_DIGEST_ALGORITHM =
  "SHA-256" as const;

export type Sha256Hex = string;

export type TrustedHistoryAuthorityMetadata =
  | {
      readonly sourceKind: "TRUSTED_COMMIT_JOURNAL";
      readonly sourceIdentity: string;
      readonly sourceRevision: string;
      readonly capturedAt: string;
    }
  | {
      readonly sourceKind: "APPROVED_FROZEN_REPLAY_BUNDLE";
      readonly sourceIdentity: string;
      readonly sourceRevision: string;
      readonly capturedAt: string;
      readonly approvalId: string;
      readonly approvedBundleSha256: Sha256Hex;
    };

export type EventChecksumRecord = {
  readonly eventId: EventId;
  readonly eventSequence: number;
  readonly sha256: Sha256Hex;
};

export type BatchChecksumRecord = {
  readonly batchId: BatchId;
  readonly commandId: CommandId;
  readonly gameVersion: number;
  readonly firstEventSequence: number;
  readonly lastEventSequence: number;
  readonly eventCount: number;
  readonly sha256: Sha256Hex;
};

export type TrustedSnapshotRecord = {
  readonly snapshotVersion: string;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly gameVersion: number;
  readonly lastAppliedEventSequence: number;
  readonly eventPrefixSha256: Sha256Hex;
  readonly statePayload: unknown;
  readonly stateSha256: Sha256Hex;
  readonly createdAt: string;
};

export type TrustedAcceptedHistoryBundleV1 = {
  readonly bundleVersion:
    typeof TRUSTED_ACCEPTED_HISTORY_BUNDLE_VERSION;
  readonly canonicalizationAlgorithm:
    typeof TRUSTED_HISTORY_CANONICALIZATION_ALGORITHM;
  readonly digestAlgorithm:
    typeof TRUSTED_HISTORY_DIGEST_ALGORITHM;
  readonly authorityMetadata: TrustedHistoryAuthorityMetadata;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly events: readonly unknown[];
  readonly acceptedReceipts: readonly unknown[];
  readonly eventChecksums: readonly EventChecksumRecord[];
  readonly batchChecksums: readonly BatchChecksumRecord[];
  readonly snapshot: TrustedSnapshotRecord | null;
  readonly bundleSha256: Sha256Hex;
};

export type TrustedAcceptedHistoryCaptureFailureCode =
  | "UNTRUSTED_AUTHORITY_SOURCE"
  | "UNAPPROVED_REPLAY_BUNDLE"
  | "INVALID_BUNDLE_SHAPE"
  | "INVALID_AUTHORITY_METADATA"
  | "INVALID_SHA256"
  | "BUNDLE_CHECKSUM_MISMATCH"
  | "INVALID_EVENT_SHAPE"
  | "INVALID_EVENT_PAYLOAD"
  | "INVALID_EVENT_ID"
  | "INVALID_EVENT_METADATA"
  | "EVENT_CHECKSUM_MISSING"
  | "EVENT_CHECKSUM_DUPLICATE"
  | "EVENT_CHECKSUM_MISMATCH"
  | "BATCH_CHECKSUM_MISSING"
  | "BATCH_CHECKSUM_DUPLICATE"
  | "BATCH_CHECKSUM_MISMATCH"
  | "INVALID_EVENT_SEQUENCE"
  | "INVALID_BATCH_SEQUENCE"
  | "INVALID_GAME_VERSION"
  | "INVALID_BATCH_MEMBERSHIP"
  | "ACCEPTED_RECEIPT_MISSING"
  | "ACCEPTED_RECEIPT_DUPLICATE"
  | "ACCEPTED_RECEIPT_MISMATCH"
  | "UNEXPECTED_RECEIPT"
  | "INVALID_RECEIPT_SHAPE"
  | "INVALID_COMMAND_FINGERPRINT"
  | "SNAPSHOT_RELATION_MISMATCH"
  | "SNAPSHOT_CHECKSUM_MISMATCH"
  | "SNAPSHOT_STATE_MISMATCH"
  | "REBUILD_FAILED";

export type TrustedAcceptedHistoryCaptureResult =
  | {
      readonly ok: true;
      readonly history: TrustedAcceptedHistoryHandle;
    }
  | {
      readonly ok: false;
      readonly code: TrustedAcceptedHistoryCaptureFailureCode;
    };
```

`events`, `acceptedReceipts`, and `statePayload` remain `unknown` at the raw boundary. They are never narrowed by cast.

## Bundle exact-shape and semantic validation

### Descriptor-safe capture

Before domain validation, the foundation must capture the entire object graph without executing application-defined code.

It must:

- reject Proxy objects, including revoked Proxy objects;
- reject accessor descriptors;
- reject symbol keys;
- reject cyclic graphs;
- reject nonplain objects;
- reject sparse arrays;
- reject arrays with extra properties or nonstandard `length`;
- reject missing or extra fields;
- reject non-enumerable declared data fields;
- accept only safe integers other than negative zero where numeric integers are required;
- read values only from verified data descriptors;
- catch every reflection or descriptor failure and fail closed;
- invoke zero getters.

The canonical snapshot and SHA-256 input use code-unit-sorted object keys and preserve array order. Hashes detect corruption only. They do not establish source authority and do not replace shape, payload, stream, batch, receipt, rebuild, or snapshot validation.

### Exact envelope dispatch

Every event must have exactly these envelope keys:

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

Validation requires:

- `category === "domain"`;
- supported exact `eventType`;
- `eventVersion` equals the repository-supported version;
- non-empty canonical ID strings through the existing ID constructors or stronger role-specific parsers where defined;
- positive safe `eventSequence` and `gameVersion`;
- one game and rules baseline per stream;
- exact `eventType -> payload validator` registry dispatch;
- exact payload keys and literals;
- envelope and payload rules-baseline equality;
- canonical timestamp representation;
- continuous event sequence from `1`;
- continuous game versions by atomic batch;
- one contiguous batch per `batchId`;
- one `commandId` per batch;
- no successful `commandId` in multiple batches;
- all existing batch-semantic and rebuild checks.

The current typed `validateDomainEventStream` remains a later internal step. It cannot substitute for this unknown-boundary validation.

### Receipt reconciliation

Every accepted batch must map to exactly one accepted receipt with matching:

- `gameId`;
- `commandId`;
- accepted result status;
- committed `gameVersion`.

Both existing receipt forms may be read:

- legacy receipt: exact keys `commandId`, `gameId`, `result`, with no own `commandFingerprint`;
- fingerprinted receipt: exact keys `commandId`, `gameId`, `commandFingerprint`, `result`.

A fingerprinted receipt must pass the current command-fingerprint validator.

For full-event accepted results, stored events must exactly equal the corresponding canonical batch. For event-summary accepted results, `eventCount` and ordered `eventTypes` must exactly equal the batch.

Receipts prove that a command/batch transaction was accepted. They do not independently prove event payload semantics, replay validity, impairment provenance, or snapshot correctness.

Missing, duplicate, mismatched, rejected, failed, or extra receipts fail closed.

### Checksums

Each event has exactly one out-of-band checksum over the exact captured event envelope.

Each batch has exactly one checksum over:

- batch ID;
- command ID;
- game version;
- first and last event sequence;
- event count;
- the ordered event checksums.

The bundle checksum covers every field other than `bundleSha256`, including receipt data and the nullable snapshot record.

No checksum is added to a domain event, receipt, or snapshot schema by P2.

### Optional snapshot relationship

A missing snapshot is valid. Canonical state rebuilds from the complete event log.

If a snapshot is present:

1. `gameId` and rules baseline must match the bundle.
2. `lastAppliedEventSequence` must identify a complete batch boundary.
3. `gameVersion` must equal that batch’s game version.
4. `eventPrefixSha256` must equal the exact event prefix digest.
5. `stateSha256` must equal the canonical captured `statePayload`.
6. Event-only rebuild through `lastAppliedEventSequence` must succeed.
7. Snapshot state must be exactly equal to the event-only rebuilt state.
8. Applying later events to the validated snapshot must equal a full event-only rebuild.

A snapshot is cache only. Snapshot absence never changes canonical meaning. A snapshot mismatch rejects the bundle; it never repairs or overrides the event log.

The current repository has no snapshot provider satisfying this contract. Present-snapshot testing and production support therefore remain foundation work, not P2 work.

## Runtime authority and non-forgeable handle

The T1 foundation and P2 resolver must share one module-private runtime authority implementation. TypeScript shape is not the authority.

```ts
const trustedHistoryHandleBrand = Symbol(
  "TrustedAcceptedHistoryHandle"
);

const trustedCanonicalStateHandleBrand = Symbol(
  "TrustedCanonicalStateAtGameVersion"
);

const issuedHistoryHandles = new WeakSet<object>();
const historyDataByHandle =
  new WeakMap<object, InternalValidatedAcceptedHistory>();

const issuedStateHandles = new WeakSet<object>();
const stateDataByHandle =
  new WeakMap<object, InternalCanonicalStateAtGameVersion>();

export type TrustedAcceptedHistoryHandle = {
  readonly authorityVersion:
    "trusted-accepted-history-authority-v1";
  readonly gameId: GameId;
  readonly finalGameVersion: number;
  readonly finalEventSequence: number;
  readonly [trustedHistoryHandleBrand]: true;
};

export type TrustedCanonicalStateAtGameVersion = {
  readonly authorityVersion:
    "trusted-canonical-state-at-game-version-v1";
  readonly gameId: GameId;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly [trustedCanonicalStateHandleBrand]: true;
};
```

The brand symbols, constructors, issuer functions, WeakSets, WeakMaps, and internal state types must not be exported.

Each handle is:

- created only after complete T1 validation;
- an exact frozen object;
- backed by closure-private WeakMap data;
- registered in the matching WeakSet;
- furnished with the private symbol through an exact non-writable, non-configurable data property.

The public resolver performs `issuedStateHandles.has(input)` before inspecting any caller-visible property. Therefore:

- plain lookalikes fail;
- casts fail;
- fake constructors fail;
- fake string or symbol fields fail;
- spread copies fail;
- `structuredClone` results fail;
- serialized/deserialized objects fail;
- proxies and revoked proxies fail;
- mutated revision or provenance lookalikes fail.

The canonical rebuilt `GameState` and impairment evidence are stored only in the private WeakMap. They are not exposed as mutable handle fields.

Fixtures may obtain authority only through:

1. real accepted application commands committed through the future trusted commit journal; or
2. an approved frozen replay bundle admitted through the same T1 validator and issuer.

`as`, `any`, manually forged events, manual receipts, direct WeakSet access, exported brand symbols, or test-only fake issuers are forbidden.

## Canonical state issuance

The future foundation API must behave equivalently to:

```ts
export type TrustedCanonicalStateBuildFailureCode =
  | "INVALID_HISTORY_AUTHORITY"
  | "INVALID_QUERY_GAME_VERSION"
  | "QUERY_GAME_VERSION_NOT_FOUND"
  | "INCOMPLETE_GAME_VERSION_PREFIX"
  | "REBUILD_FAILED"
  | "REBUILT_VERSION_MISMATCH"
  | "REBUILT_SEQUENCE_MISMATCH"
  | "SNAPSHOT_RELATION_MISMATCH"
  | "IMPAIRMENT_EVENT_STATE_MISMATCH"
  | "UNSUPPORTED_IMPAIRMENT_PROVENANCE";

export type TrustedCanonicalStateBuildResult =
  | {
      readonly ok: true;
      readonly canonicalState:
        TrustedCanonicalStateAtGameVersion;
    }
  | {
      readonly ok: false;
      readonly code:
        TrustedCanonicalStateBuildFailureCode;
    };

export const rebuildTrustedCanonicalStateAtGameVersion:
  (input: {
    readonly history: unknown;
    readonly queryGameVersion: number | "CURRENT";
  }) => TrustedCanonicalStateBuildResult;
```

Mandatory order:

1. verify `history` is a runtime-issued history handle;
2. retrieve private validated history;
3. select the complete prefix for the requested game version;
4. require the prefix to end at the final event of its batch;
5. invoke the typed stream validator;
6. invoke batch-semantic validation;
7. rebuild event-only canonical state;
8. require rebuilt `gameVersion` and `lastEventSequence` to equal the selected boundary;
9. cross-check impairment state against accepted impairment-event evidence;
10. perform the snapshot cross-check when a validated snapshot covers the boundary;
11. issue a fresh runtime canonical-state handle.

## P2 effective-condition contract

The existing Round 1 output contract remains:

```ts
export const EFFECTIVE_CONDITIONS =
  ["DRUNK", "POISONED"] as const;

export type EffectiveCondition =
  (typeof EFFECTIVE_CONDITIONS)[number];

export type EffectiveConditionState =
  | {
      readonly kind: "NONE";
      readonly conditions: readonly [];
    }
  | {
      readonly kind: "IMPAIRED";
      readonly conditions:
        | readonly ["DRUNK"]
        | readonly ["POISONED"]
        | readonly ["DRUNK", "POISONED"];
    };

export type EstablishingEventReference = {
  readonly eventId: EventId;
  readonly eventSequence: number;
  readonly batchId: BatchId;
  readonly gameVersion: number;
};

export type PhilosopherDrunkAbilitySourceProvenance = {
  readonly kind: "ABILITY_SOURCE";
  readonly sourceKind:
    "PHILOSOPHER_CHOSEN_DUPLICATE";
  readonly impairmentId: AbilityImpairmentId;
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRole: RoleSetupSnapshot;
  readonly chosenRoleId: RoleId;
  readonly sourceCharacterStateRevision: number;
  readonly establishingEvent:
    EstablishingEventReference;
};

export type SnakeCharmerPoisonAbilitySourceProvenance = {
  readonly kind: "ABILITY_SOURCE";
  readonly sourceKind:
    "SNAKE_CHARMER_DEMON_HIT";
  readonly impairmentId: AbilityImpairmentId;
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly establishingEvent:
    EstablishingEventReference;
};

export type CurrentConditionProvenance =
  | PhilosopherDrunkAbilitySourceProvenance
  | SnakeCharmerPoisonAbilitySourceProvenance;

export type EffectiveConditionRecord = {
  readonly condition: EffectiveCondition;
  readonly effectiveAtQueryGameVersion: true;
  readonly effectiveFromGameVersion: number;
  readonly effectiveUntilGameVersionExclusive: null;
  readonly provenance: CurrentConditionProvenance;
};

export type EffectiveConditionSnapshot = {
  readonly playerId: PlayerId;
  readonly gameVersion: number;
  readonly currentCharacterStateRevision: number;
  readonly state: EffectiveConditionState;
  readonly records:
    readonly EffectiveConditionRecord[];
};

export type EffectiveConditionResolutionFailureCode =
  | "INVALID_CANONICAL_STATE_AUTHORITY"
  | "PLAYER_NOT_FOUND_AT_GAME_VERSION"
  | "DUPLICATE_PLAYER_AT_GAME_VERSION"
  | "IMPAIRMENT_PROVENANCE_MISSING"
  | "IMPAIRMENT_PROVENANCE_DUPLICATE"
  | "IMPAIRMENT_PROVENANCE_MISMATCH"
  | "ROLE_EFFECT_NOT_SUPPORTED"
  | "UNKNOWN_SOURCE_NOT_AUTHORIZED"
  | "NON_CANONICAL_CONDITION_ORDER";

export type EffectiveConditionResolution =
  | {
      readonly ok: true;
      readonly snapshot: EffectiveConditionSnapshot;
    }
  | {
      readonly ok: false;
      readonly code:
        EffectiveConditionResolutionFailureCode;
    };

export const resolveEffectiveConditionsAtGameVersion:
  (input: {
    readonly canonicalState: unknown;
    readonly playerId: PlayerId;
  }) => EffectiveConditionResolution;
```

The exported resolver’s callable boundary is T1 because it receives an untrusted runtime object. Its first operation is the WeakSet authority check. Only its private derivation core operates at T2/T3.

The resolver:

1. retrieves private rebuilt state and impairment evidence;
2. requires exactly one current-character entry for the player;
3. selects canonical impairments for that player;
4. requires one exact accepted establishing event per impairment;
5. cross-checks payload, envelope, player, seat, role, revision, and source;
6. orders DRUNK before POISONED, then onset game version, event sequence, and code-unit impairment ID;
7. returns the closed condition tuple.

Provenance explains an established condition. It never selects whether the player is impaired.

## Future ability-adoption boundary

P2 has no ability consumer.

A future role Slice may use the P2 result only when it separately freezes:

- the exact role-specific ability resolver;
- the canonical role tenure or granted-ability authority;
- the ability instance and entitlement contract where applicable;
- settlement-time effectiveness;
- privacy and projection behavior;
- accepted-stream and hostile-history evidence.

No Dreamer file, Dreamer resolver, opportunity, target, delivery, settlement, ledger, or projection change belongs to P2.

## C19 conflict and correction

### C19-A — requested legacy-history authority

The requested classification was:

```text
ExpectedReachability = R2
ExpectedTrust = T1
ExpectedPrimaryLayer = LEGACY_REPLAY_COMPATIBILITY
```

That classification cannot currently be satisfied honestly.

The repository currently contains R1 producers for the represented Philosopher DRUNK and Snake Charmer POISONED histories. No exact frozen pre-current P2 history, imported accepted-history format, migration promise, approved replay bundle, or immutable R2 revision was identified.

A current R1 accepted history does not become R2 merely because a test reloads or rebuilds it. A payload shape validator, typed event array, manually assembled fixture, or accepted current stream cannot substitute for `LEGACY_REPLAY_COMPATIBILITY`.

Therefore `P2-C19A_LEGACY_HISTORY_AUTHENTICITY` is frozen as an unresolved design conflict, not as a passing criterion.

Protocol-correct alternatives are:

1. create the separate T1 foundation and prove current formal producer history as `R1 / T1 / ACCEPTED_STREAM_INTEGRATION`; or
2. later identify and approve a real frozen R2 artifact with an exact compatibility promise, then authorize a separate design correction.

The controller and reviewer must not relabel current R1 history as R2.

### C19-B — condition derivation

Condition derivation remains:

```text
ExpectedReachability = R1
ExpectedTrust = T2
ExpectedPrimaryLayer = PURE_POLICY_SEAM
```

Its input must be a runtime-issued canonical-state handle. The pure assertion is the deterministic `NONE`, `DRUNK`, `POISONED`, or combined tuple and exact known provenance.

History authenticity and condition derivation are separate criteria and must never share one primary test identity.

## C20 hostile matrices

### C20-H1 — persisted event/batch history

Classification:

```text
R3 / T1 / HOSTILE_REPLAY_REJECTION
```

Start from a real trusted accepted prefix, clone it, mutate one declared fact, then require T1 rejection before handle issuance.

Required cases include:

- missing authority producer;
- missing or duplicate receipt;
- receipt/batch command mismatch;
- receipt game-version mismatch;
- invalid event sequence;
- missing event;
- duplicate event;
- partial batch;
- noncontiguous batch;
- wrong batch ID;
- wrong command ID;
- wrong game version;
- missing event checksum;
- duplicate event checksum;
- event checksum mismatch;
- missing batch checksum;
- duplicate batch checksum;
- batch checksum mismatch;
- missing snapshot relation;
- wrong snapshot sequence;
- wrong snapshot event-prefix checksum;
- wrong snapshot state checksum;
- snapshot/event-only state mismatch;
- extra field;
- missing field;
- wrong literal or type;
- unsupported event version;
- invalid ID;
- Proxy;
- revoked Proxy;
- getter;
- symbol key;
- cycle;
- sparse array;
- nonplain object.

Getter invocation count must remain zero.

### C20-H2 — forged canonical-state handle

Classification:

```text
R3 / T1 / STRUCTURAL_VALIDATION
```

Because the exported resolver accepts an untrusted runtime object, this is not a T2 hostile matrix.

Required cases:

- plain object with matching visible fields;
- fake string brand;
- guessed symbol brand;
- fake constructor instance;
- spread copy;
- `structuredClone`;
- JSON serialization and parse;
- Proxy;
- revoked Proxy;
- getter-bearing lookalike;
- symbol-bearing lookalike;
- revision mismatch;
- provenance mismatch;
- state metadata mismatch.

All fail at the initial runtime authority check. Zero getters are invoked. No caller object reaches the T2 core.

### C20-H3 — external/imported bundle

Classification:

```text
R3 / T1 / HOSTILE_REPLAY_REJECTION
```

Required cases:

- no approved authority;
- unknown source identity;
- unknown source revision;
- noncanonical bundle revision;
- approval ID mismatch;
- approved SHA mismatch;
- bundle checksum mismatch;
- altered event or receipt;
- altered event/batch checksum;
- altered snapshot relation;
- an otherwise structurally valid self-signed bundle.

A self-consistent caller-created bundle remains untrusted because checksums do not establish authority.

## Supporting Authority disposition

`SUP-2B20B-P1-011` remains immutable historical P1 support:

| Field | Value |
|---|---|
| `AuthorityStatus` | `ACCEPTED` |
| P1 applicability | existing restricted P1 purpose |
| P2 applicability | `NOT_APPLICABLE` |
| P2 primary authority | forbidden |
| Status rewrite | forbidden |

`NOT_APPLICABLE` is an applicability statement, not an `AuthorityStatus`.

The only permitted supporting-authority statuses remain:

```text
ACCEPTED
LEGACY
HOSTILE
```

`RESTRICTED`, `NOT_APPLICABLE`, `INSUFFICIENT_SUPPORT`, or similar scope descriptions must not be stored as statuses.

At design time, planned P2 support records may identify purpose, expected status, mutation expectation, and consuming criteria. Final `SUP-*` IDs, physical test files, and titles belong to implementation-time traceability after a valid implementation authorization.

No P2 primary authority currently exists.

## Reachability and trust inventory

| Path | Reachability | Trust | Primary layer | Current disposition |
|---|---|---|---|---|
| Real Philosopher accepted history through trusted journal | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | foundation required |
| Real Snake Charmer accepted history through trusted journal | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | foundation required |
| Missing optional snapshot | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | allowed after foundation |
| Present validated snapshot | R4 | T1 | STRUCTURAL_VALIDATION | no producer currently |
| Requested C19 legacy history | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | no qualifying artifact; conflict |
| Effective-condition derivation | R1 | T2 | PURE_POLICY_SEAM | P2 behavior after foundation |
| Persisted event/batch mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | foundation requirement |
| Forged runtime state handle | R3 | T1 | STRUCTURAL_VALIDATION | foundation requirement |
| Hostile external/import bundle | R3 | T1 | HOSTILE_REPLAY_REJECTION | foundation requirement |
| ROLE_EFFECT | R4 | T3 | PURE_POLICY_SEAM | unsupported |
| UNKNOWN_SOURCE | R4 | T3 | PURE_POLICY_SEAM | unsupported |
| Future Dreamer adoption | R4 | role-specific | not frozen here | separate Slice |

No semantic criterion uses `CROSS_PLATFORM_CI` as primary evidence.

## Design-time Governance Traceability V1.1

This table contains exactly the nine permitted design-time fields.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `P2-F01_TRUSTED_COMMIT_JOURNAL_AUTHORITY` | Current accepted history must originate from a real committed command transaction | Real commands produce accepted batches and receipts observed by a runtime-authorized journal; one complete bundle handle is issued | Successful formal command, accepted events, receipt, append, journal capture, event-only rebuild | `R1` | `T1` | `ACCEPTED_STREAM_INTEGRATION` | runtime history handle issued only after complete reconciliation | real accepted application stream; no manual bundle |
| `P2-F02_COMPLETE_PREFIX_AND_RECEIPT_RECONCILIATION` | Every accepted batch in the prefix has exactly one matching accepted receipt | Continuous event/batch/version sequence and exact receipt mappings validate before rebuild | trusted journal export followed by exact T1 reconciliation | `R1` | `T1` | `ACCEPTED_STREAM_INTEGRATION` | missing, duplicate, or mismatched relation rejects | accepted receipts remain support, not event-semantic authority |
| `P2-F03_MISSING_SNAPSHOT_REBUILDS_FROM_EVENTS` | Snapshot absence cannot remove canonical authority | A trusted history with `snapshot=null` rebuilds entirely from events | real accepted journal history without snapshot | `R1` | `T1` | `ACCEPTED_STREAM_INTEGRATION` | canonical handle issued from event-only rebuild | no snapshot support required |
| `P2-F04_PRESENT_SNAPSHOT_IS_CACHE_ONLY` | A present snapshot must equal event-only reconstruction | Validate sequence, prefix checksum, state checksum, and exact state equality | exact snapshot structural and relation validation | `R4` | `T1` | `STRUCTURAL_VALIDATION` | mismatch rejects; no producer required for P2 | future foundation snapshot authority only |
| `P2-F05_RUNTIME_AUTHORITY_IS_NONFORGEABLE` | Typed or shape-equal objects cannot enter canonical derivation | Only module-issued WeakSet/WeakMap handles pass; copies and lookalikes fail | direct runtime authority validation | `R3` | `T1` | `STRUCTURAL_VALIDATION` | reject before reading caller fields; zero getter calls | no supporting authority |
| `P2-C19A_LEGACY_HISTORY_AUTHENTICITY` | Valid legacy/imported accepted history must retain exact meaning | A real frozen R2 artifact with exact revision and compatibility promise rebuilds through the T1 authority | approved immutable legacy/import replay bundle | `R2` | `T1` | `LEGACY_REPLAY_COMPATIBILITY` | `HUMAN_BLOCKED_NO_QUALIFYING_R2_AUTHORITY` | cannot use current R1 Philosopher/Snake history |
| `P2-C19B_EFFECTIVE_CONDITION_DERIVATION` | Canonical impairment state yields the effective condition tuple | Runtime-issued state derives NONE, DRUNK, POISONED, or both deterministically | pure derivation from runtime-authorized canonical state | `R1` | `T2` | `PURE_POLICY_SEAM` | exact tuple and exact known provenance | R1 accepted history is supporting context only |
| `P2-C20H1_PERSISTED_HISTORY_HOSTILE_MATRIX` | Corrupted persisted provenance never reaches T2 | Every specified single mutation rejects before history/state handle issuance | accepted-prefix clone with one persisted mutation and replay rejection | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | fail closed; zero getter calls for accessor cases | original accepted prefix is `ACCEPTED` support |
| `P2-C20H2_FORGED_STATE_HANDLE_MATRIX` | Caller-created state objects must not enter the T2 core | Lookalikes, clones, serialization, Proxy, getters, and mismatches fail WeakSet authority | direct public resolver boundary validation | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `INVALID_CANONICAL_STATE_AUTHORITY`; zero getter calls | no supporting authority |
| `P2-C20H3_EXTERNAL_IMPORT_HOSTILE_MATRIX` | Unapproved or corrupted imported bundles must fail closed | Missing approval, unknown provenance, revision/checksum/snapshot mismatch rejects | hostile persisted/import replay admission | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | no history handle issued | an approved immutable bundle may support only after it exists |
| `P2-SUP011_SCOPE` | P1 historical support must not become P2 authority | Preserve `AuthorityStatus=ACCEPTED`; record P2 applicability as NOT_APPLICABLE | immutable authority-registry inspection | `R4` | `T3` | `STRUCTURAL_VALIDATION` | no status rewrite and no P2 primary use | `SUP-2B20B-P1-011` historical record only |
| `P2-R4_NO_UNKNOWN_OR_ROLE_EFFECT_PRODUCER` | P2 introduces no unsupported provenance producer | Static dependency and closed-union inspection finds no producer or consumer | pure/static scope inspection | `R4` | `T3` | `PURE_POLICY_SEAM` | unreachable and non-gating | none |

Implementation-time fields, physical tests, titles, final `SUP-*` IDs, and `MechanismMatch` are deliberately absent.

## Foundation acceptance criteria

A separate T1 foundation may pass only when:

1. one repository-controlled authority producer exists;
2. raw bundles are captured descriptor-safely from `unknown`;
3. all exact envelope and payload variants dispatch through runtime validators;
4. event sequence, batch, game version, command ID, receipt, and checksum relations are complete;
5. hashes supplement rather than replace semantic validation;
6. snapshots are optional caches;
7. present snapshots equal event-only rebuild;
8. raw external/import bundles default to rejection;
9. approved replay admission uses an immutable exact SHA registry;
10. runtime handles use private symbols plus WeakSet/WeakMap issuance;
11. no brand symbol, issuer, constructor, or private state is exported;
12. hostile Proxy/getter/symbol/cycle/sparse/nonplain cases fail closed;
13. getter invocation count is zero;
14. no event, receipt, or snapshot schema is changed;
15. accepted history and replay meaning remain unchanged.

## P2 acceptance criteria after the foundation

After the foundation is accepted and P2 is separately reauthorized:

1. `gameVersion` remains the sole effective-condition time domain.
2. No partial-batch query is possible.
3. canonical state comes only from a runtime-issued handle.
4. Philosopher DRUNK provenance uses exact accepted fields.
5. Snake Charmer POISONED provenance uses the exact accepted same-batch chain.
6. no invented tenure, ability-instance, effect-instance, or end-event identity appears.
7. provenance never selects condition effectiveness.
8. condition ordering is deterministic.
9. `UNKNOWN_SOURCE` and `ROLE_EFFECT` remain unsupported.
10. no ability consumer is added.
11. Dreamer and projections remain unchanged.
12. role coverage remains unchanged.
13. C19 history authenticity and condition derivation have separate primary authorities.
14. all C20 hostile matrices use the frozen R/T/layer classifications.
15. a genuine R2 artifact exists before C19-A can pass.

## File and change boundaries

### Current Round 2

Permitted:

- add only this design correction document through the sole writer;
- synchronize docs/control only if separately authorized.

Forbidden:

- production code;
- tests;
- events or payloads;
- snapshots;
- receipts;
- workflow or profile;
- branch publication;
- PR creation.

### Future T1 foundation

The exact allowlist must be frozen by its own design. It must not be inferred from this P2 document.

### Future P2 implementation

No allowlist is active. P2 requires new authorization after:

1. the foundation is designed, independently passed, implemented, reviewed, and accepted;
2. C19-A is corrected through a real R2 artifact or explicitly removed/rescoped through user authorization;
3. a fresh independent P2 design review returns `RULE_DESIGN_PASS`.

## Tradeoff decision

Rejected:

- trusting `readonly AnyDomainEventEnvelope[]`;
- using `validateDomainEventStream` as an unknown parser;
- casting an event array after shallow checks;
- trusting a caller-supplied bundle source string;
- treating matching SHA-256 values as source authority;
- exposing a constructible branded type;
- storing mutable `GameState` on the public handle;
- treating current R1 histories as legacy R2;
- mixing T1 hostile-object assertions into a T2 pure-policy criterion;
- implementing the foundation inside P2.

Selected:

```text
separate T1 accepted-history authority foundation
  -> private runtime authority
  -> canonical complete-prefix state handle
  -> bounded P2 effective-condition derivation
  -> separate future role-specific adoption
```

This preserves the event log as canonical truth, snapshots as caches, receipts as transaction evidence, and provenance as audit evidence rather than gameplay truth selection.

## Stop conditions

Stop and return non-pass when:

- a raw typed event array is treated as trusted;
- source authority is represented only by fields inside caller-controlled data;
- exact payload dispatch is absent;
- checksum equality replaces semantic validation;
- a snapshot can override event-only rebuild;
- a runtime brand can be copied, serialized, constructed, or cast into validity;
- tests use fake issuers or manually trusted fixtures;
- current R1 history is labeled R2;
- C19-A has no exact frozen legacy/import artifact;
- P2 is required to own the T1 foundation;
- an event, receipt, snapshot, Dreamer, or projection schema must change;
- `UNKNOWN_SOURCE`, `ROLE_EFFECT`, No Dashii, Vigormortis behavior, or a Dreamer consumer becomes a current P2 prerequisite;
- an independent reviewer does not return the exact permitted design verdict.

## Review checklist

The independent reviewer must confirm:

- Round 1’s false assumption about an existing exact unknown event validator is removed.
- The T1 producer and raw bundle are separate from caller-controlled authority metadata.
- Receipts prove accepted transaction mapping, not event semantics.
- Event and batch checksums are out-of-band and corruption-only.
- Snapshot absence is accepted and present snapshots are cross-checked against event-only rebuild.
- Runtime issuance uses private WeakSet/WeakMap state and an unexported symbol.
- Public forged-state rejection is T1, not T2.
- C19-A honestly records the missing R2 authority.
- C19-B remains the T2 condition derivation.
- C20-H1, H2, and H3 use exact R3/T1 classifications.
- SUP011 status remains `ACCEPTED` while P2 applicability is `NOT_APPLICABLE`.
- The traceability table contains exactly the nine design-time fields.
- No semantic primary is assigned to `CROSS_PLATFORM_CI`.
- No implementation authorization, production change, test change, schema change, workflow change, profile change, or PR action is implied.
- The separate T1 foundation is required by stop-loss.

## Design disposition

- `ruleVerdict`: `RULE_READY`
- `designVerdict`: `NOT_REVIEWED`
- `implementationAuthorized`: `false`
- `behaviorDesignChanged`: `false`
- `trustBoundaryDesignChanged`: `true`
- `newSharedInfrastructureRequired`: `true`
- `legacyAuthorityConflictResolved`: `false`
- `architectDisposition`: `HUMAN_BLOCKED / RESLICE_REQUIRED`
- `recommendedIndependentVerdict`: `HUMAN_BLOCKED`
- `remainingBlockers`:
  - `TRUSTED_ACCEPTED_HISTORY_AUTHORITY_FOUNDATION_MISSING`
  - `C19A_NO_QUALIFYING_R2_LEGACY_OR_IMPORTED_AUTHORITY`
- `requiredNextAction`: `AUTHORIZE_AND_DESIGN_SEPARATE_T1_FOUNDATION_RESLICE`
- `productionFilesChanged`: `0`
- `testFilesChanged`: `0`

`HUMAN_BLOCKED_RESLICE_REQUIRED_TRUSTED_ACCEPTED_HISTORY_FOUNDATION`
