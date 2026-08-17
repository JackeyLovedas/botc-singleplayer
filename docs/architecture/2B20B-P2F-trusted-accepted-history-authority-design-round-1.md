# Phase 3 Slice 2B20B-P2F — Trusted Accepted History Authority Design Round 1

## Metadata

- sliceId: `2B20B-P2F`
- documentType: `STANDALONE_FOUNDATION_DESIGN`
- designRound: `1`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F_TRUSTED_ACCEPTED_HISTORY_AUTHORITY_DESIGN_ROUND_1`
- currentHead: `bef395287d5400043565acd5b794d02810d7bbca`
- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- parentPrecheckPath: `docs/architecture/2B20B-P2F-trusted-accepted-history-authority-precheck.md`
- parentPrecheckSha256: `9edf58e5b244ff729f73351d4a83edbabe9ad54855999673a5d63177a41f2a4a`
- ruleEvidencePath: `docs/rules/evidence/2B20B-P2-impairment-state-provenance.md`
- ruleVerdict: `RULE_READY`
- designReviewStatus: `NOT_REVIEWED`
- architectRecommendation: `SUBMIT_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`
- architectRecommendationIsReviewerVerdict: `false`
- implementationAuthorized: `false`
- productionChangeAuthorized: `false`
- testChangeAuthorized: `false`
- eventSchemaChanged: `false`
- snapshotSchemaChanged: `false`
- receiptSchemaChanged: `false`
- workflowChangeAuthorized: `false`
- profileChangeAuthorized: `false`
- prCreationAuthorized: `false`
- acceptedBehaviorChanged: `false`
- requiredArchitectureChange: `true`
- requiredRuleChange: `false`
- requiredProductChange: `true (future foundation only)`

This document is a design contract, not an implementation authorization and not a reviewer verdict. No production code, tests, schema, workflow, profile, commit, push, pull request, or CI action is authorized.

## Scope

Design one reusable foundation that can issue process-local runtime authority for:

1. one exact accepted canonical history; and
2. one exact canonical game state rebuilt at a complete committed `gameVersion`.

The foundation must:

- admit live history only through a repository-controlled successful-commit journal;
- admit replay bytes only through an immutable approved raw-byte registry;
- capture raw values descriptor-safely;
- validate exact event envelopes and payloads before typed replay;
- reconcile batches, accepted receipts, event checksums, batch checksums, and the bundle checksum;
- accept snapshot absence;
- treat a present snapshot only as a cache that must equal event-only rebuild;
- issue zero-field opaque handles backed by module-private `WeakSet` and `WeakMap` state;
- rebuild only complete atomic-batch prefixes;
- preserve event sourcing, prospective validation, replay validation, and cross-platform deterministic ordering;
- expose no canonical state, events, receipts, snapshot payload, or provenance through public handle fields;
- provide a bounded authority handoff for a separately reviewed future P2 condition seam.

## Non-goals

This design does not authorize or implement:

- POISONED Dreamer behavior;
- any new DRUNK or POISONED gameplay producer;
- No Dashii impairment;
- Vigormortis kill, death, retained-Minion, adjacency, poison, or other-night behavior;
- `EffectInstance`, `ContinuousRule`, or a general Effect Engine;
- a generic ability registry;
- Dreamer, Philosopher, Snake Charmer, ledger, projection, or role-coverage changes;
- event, payload, receipt, or snapshot schema changes;
- SQLite or another production persistence adapter;
- a snapshot producer;
- a real legacy/imported R2 artifact;
- restart recovery from the current store;
- first-night completion, Dawn, Day, nomination, voting, execution, death, or Phase 2C;
- changes to accepted 2B20A or P1 behavior.

## Authority model

### Source authority

Source authority answers: “Who is permitted to present this history for validation?”

Exactly two source classes are designed:

1. `LIVE_SUCCESSFUL_COMMIT_JOURNAL`
   - Repository-controlled.
   - Observes a successful `commitAcceptedCommand`.
   - Captures the exact accepted batch and exact accepted receipt only after the commit succeeds.
   - Maintains a continuous in-process aggregate for one game.
   - Cannot be implemented or impersonated by an arbitrary caller.

2. `APPROVED_RAW_REPLAY_ARTIFACT`
   - Repository-controlled immutable approval registry.
   - Binds artifact ID, revision, purpose, exact byte length, exact SHA-256, game, rules baseline, and approval identity.
   - Admission begins from raw bytes and still performs the complete validation pipeline.
   - Approval is necessary but never sufficient without validation.

No caller-controlled `sourceKind`, interface implementation, object shape, type annotation, checksum set, or signature establishes source authority.

### Supporting evidence

Supporting evidence explains or corroborates accepted history but cannot issue authority:

- accepted receipts prove accepted command/batch transaction mapping;
- event checksums detect event corruption;
- batch checksums detect membership/order corruption;
- the bundle checksum detects aggregate corruption;
- optional snapshots accelerate rebuild only after equality with event-only state;
- event and payload validators prove supported runtime shape and semantics;
- batch validators prove atomic ordering and batch semantics;
- rebuild proves the canonical event-derived state.

No single supporting mechanism, and no caller-created combination of them, substitutes for a repository-controlled authority source.

## Trust classification

| Boundary | Trust | Meaning |
|---|---|---|
| raw bytes, raw objects, caller arrays, store outputs, replay inputs | T1 | untrusted until complete admission |
| public history-handle and state-handle API arguments | T1 | runtime identity must be checked before caller property access |
| private validated history stored in the authority module | T2 | canonical accepted-history authority |
| private canonical state stored behind an issued state handle | T2 | canonical state at one complete game version |
| pure canonicalization, ordering, and digest helpers over already captured plain data | T3 | isolated policy computation |

Typed values remain T1 at public or persisted boundaries. TypeScript does not confer trust.

## Exact conceptual TypeScript contract

The following freezes the intended public and internal contracts. It is not production code.

```ts
import type {
  BatchId,
  CommandId,
  EventId,
  GameId,
} from "./ids.js";
import type { GameState } from "./game-state.js";

export const TRUSTED_HISTORY_AUTHORITY_VERSION =
  "trusted-history-authority-v1" as const;

export const TRUSTED_HISTORY_BUNDLE_VERSION =
  "trusted-accepted-history-bundle-v1" as const;

export const TRUSTED_REPLAY_APPROVAL_REGISTRY_VERSION =
  "trusted-replay-approval-registry-v1" as const;

export const TRUSTED_HISTORY_CANONICALIZATION_ALGORITHM =
  "plain-data-tagged-tree-code-unit-keys-v1" as const;

export const TRUSTED_HISTORY_DIGEST_ALGORITHM =
  "SHA-256" as const;

export type Sha256Hex = string;

export type AcceptedEventChecksumRecord = {
  readonly eventId: EventId;
  readonly eventSequence: number;
  readonly sha256: Sha256Hex;
};

export type AcceptedBatchChecksumRecord = {
  readonly batchId: BatchId;
  readonly commandId: CommandId;
  readonly gameVersion: number;
  readonly firstEventSequence: number;
  readonly lastEventSequence: number;
  readonly eventCount: number;
  readonly orderedEventIds: readonly EventId[];
  readonly sha256: Sha256Hex;
};

export type OptionalTrustedSnapshotRecord = {
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

export type LiveJournalAuthorityMetadata = {
  readonly sourceKind: "LIVE_SUCCESSFUL_COMMIT_JOURNAL";
  readonly journalId: string;
  readonly authorityEpoch: string;
  readonly aggregateGeneration: number;
  readonly capturedAt: string;
};

export type ApprovedReplayAuthorityMetadata = {
  readonly sourceKind: "APPROVED_RAW_REPLAY_ARTIFACT";
  readonly approvalId: string;
  readonly artifactId: string;
  readonly artifactRevision: string;
  readonly artifactPurpose:
    | "RECOVERY"
    | "LEGACY_REPLAY_COMPATIBILITY";
  readonly rawByteLength: number;
  readonly rawBytesSha256: Sha256Hex;
  readonly capturedAt: string;
};

export type TrustedHistoryAuthorityMetadata =
  | LiveJournalAuthorityMetadata
  | ApprovedReplayAuthorityMetadata;

export type RawTrustedAcceptedHistoryBundleV1 = {
  readonly bundleVersion:
    typeof TRUSTED_HISTORY_BUNDLE_VERSION;
  readonly canonicalizationAlgorithm:
    typeof TRUSTED_HISTORY_CANONICALIZATION_ALGORITHM;
  readonly digestAlgorithm:
    typeof TRUSTED_HISTORY_DIGEST_ALGORITHM;
  readonly authorityMetadata: unknown;
  readonly gameId: unknown;
  readonly rulesBaselineVersion: unknown;
  readonly events: unknown;
  readonly acceptedReceipts: unknown;
  readonly eventChecksums: unknown;
  readonly batchChecksums: unknown;
  readonly snapshot: unknown;
  readonly bundleSha256: unknown;
};

export type TrustedReplayApprovalRecord = {
  readonly approvalId: string;
  readonly artifactId: string;
  readonly artifactRevision: string;
  readonly artifactPurpose:
    | "RECOVERY"
    | "LEGACY_REPLAY_COMPATIBILITY";
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly rawByteLength: number;
  readonly rawBytesSha256: Sha256Hex;
  readonly approvedAt: string;
  readonly approvalSourceRevision: string;
};

export type TrustedReplayApprovalRegistry = {
  readonly registryVersion:
    typeof TRUSTED_REPLAY_APPROVAL_REGISTRY_VERSION;
  readonly records:
    readonly TrustedReplayApprovalRecord[];
};

export type SuccessfulCommitJournalCapture = {
  readonly journalId: string;
  readonly authorityEpoch: string;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly expectedPriorGameVersion: number;
  readonly expectedPriorEventSequence: number;
  readonly committedGameVersion: number;
  readonly acceptedEvents: readonly unknown[];
  readonly acceptedReceipt: unknown;
};

export type LiveJournalCaptureFailureCode =
  | "INVALID_JOURNAL_AUTHORITY"
  | "JOURNAL_REVOKED"
  | "GAME_ID_MISMATCH"
  | "RULES_BASELINE_MISMATCH"
  | "PRIOR_VERSION_MISMATCH"
  | "PRIOR_SEQUENCE_MISMATCH"
  | "INVALID_COMMITTED_GAME_VERSION"
  | "INVALID_ACCEPTED_BATCH"
  | "INVALID_ACCEPTED_RECEIPT"
  | "RECEIPT_BATCH_MISMATCH"
  | "CROSS_COMMAND_CONFLICT"
  | "AGGREGATE_DISCONTINUITY";

export type LiveJournalCaptureResult =
  | {
      readonly ok: true;
      readonly aggregateGeneration: number;
    }
  | {
      readonly ok: false;
      readonly code: LiveJournalCaptureFailureCode;
    };

export type TrustedHistoryAdmissionFailureCode =
  | "INVALID_AUTHORITY_SOURCE"
  | "AUTHORITY_REVOKED"
  | "INVALID_RAW_BYTES"
  | "UNAPPROVED_REPLAY_ARTIFACT"
  | "REPLAY_APPROVAL_MISMATCH"
  | "RAW_BYTES_CHECKSUM_MISMATCH"
  | "RAW_BYTES_LENGTH_MISMATCH"
  | "INVALID_UTF8"
  | "INVALID_SERIALIZATION"
  | "INVALID_BUNDLE_SHAPE"
  | "INVALID_AUTHORITY_METADATA"
  | "INVALID_SHA256"
  | "BUNDLE_CHECKSUM_MISMATCH"
  | "INVALID_EVENT_COLLECTION"
  | "INVALID_EVENT_SHAPE"
  | "INVALID_EVENT_TYPE"
  | "INVALID_EVENT_VERSION"
  | "INVALID_EVENT_PAYLOAD"
  | "INVALID_EVENT_ID"
  | "INVALID_EVENT_METADATA"
  | "INVALID_EVENT_SEQUENCE"
  | "INVALID_GAME_VERSION"
  | "INVALID_BATCH_MEMBERSHIP"
  | "INVALID_BATCH_SEQUENCE"
  | "EVENT_CHECKSUM_MISSING"
  | "EVENT_CHECKSUM_DUPLICATE"
  | "EVENT_CHECKSUM_MISMATCH"
  | "BATCH_CHECKSUM_MISSING"
  | "BATCH_CHECKSUM_DUPLICATE"
  | "BATCH_CHECKSUM_MISMATCH"
  | "INVALID_RECEIPT_COLLECTION"
  | "INVALID_RECEIPT_SHAPE"
  | "INVALID_COMMAND_FINGERPRINT"
  | "ACCEPTED_RECEIPT_MISSING"
  | "ACCEPTED_RECEIPT_DUPLICATE"
  | "ACCEPTED_RECEIPT_MISMATCH"
  | "UNEXPECTED_RECEIPT"
  | "INVALID_SNAPSHOT_SHAPE"
  | "SNAPSHOT_RELATION_MISMATCH"
  | "SNAPSHOT_CHECKSUM_MISMATCH"
  | "SNAPSHOT_STATE_MISMATCH"
  | "TYPED_STREAM_VALIDATION_FAILED"
  | "BATCH_SEMANTICS_FAILED"
  | "REBUILD_FAILED"
  | "REBUILT_VERSION_MISMATCH"
  | "REBUILT_SEQUENCE_MISMATCH";

export type TrustedHistoryAdmissionResult =
  | {
      readonly ok: true;
      readonly historyHandle:
        TrustedAcceptedHistoryHandle;
    }
  | {
      readonly ok: false;
      readonly code:
        TrustedHistoryAdmissionFailureCode;
    };

export type CanonicalStateAtVersionFailureCode =
  | "INVALID_HISTORY_AUTHORITY"
  | "AUTHORITY_REVOKED"
  | "INVALID_QUERY_GAME_VERSION"
  | "QUERY_GAME_VERSION_NOT_FOUND"
  | "INCOMPLETE_GAME_VERSION_PREFIX"
  | "TYPED_STREAM_VALIDATION_FAILED"
  | "BATCH_SEMANTICS_FAILED"
  | "REBUILD_FAILED"
  | "REBUILT_VERSION_MISMATCH"
  | "REBUILT_SEQUENCE_MISMATCH"
  | "SNAPSHOT_RELATION_MISMATCH"
  | "HISTORY_AGGREGATE_MISMATCH";

export type CanonicalGameStateAtVersionResult =
  | {
      readonly ok: true;
      readonly canonicalStateHandle:
        CanonicalGameStateAtVersionHandle;
    }
  | {
      readonly ok: false;
      readonly code:
        CanonicalStateAtVersionFailureCode;
    };

// Opaque compile-time names only. Runtime authority is WeakSet identity.
export type TrustedAcceptedHistoryHandle = object;
export type CanonicalGameStateAtVersionHandle = object;

export function admitCurrentLiveJournalHistory(
  liveJournalAuthority: unknown,
  gameId: GameId,
): TrustedHistoryAdmissionResult;

export function admitApprovedReplayArtifact(
  rawBytes: unknown,
  approvalId: string,
): TrustedHistoryAdmissionResult;

export function rebuildCanonicalGameStateAtVersion(
  historyHandle: unknown,
  queryGameVersion: number | "CURRENT",
): CanonicalGameStateAtVersionResult;

export function revokeTrustedHistoryAuthority(
  historyHandle: unknown,
): boolean;

export function revokeCanonicalStateAuthority(
  canonicalStateHandle: unknown,
): boolean;
```

The handle type aliases provide documentation and return-type naming only. A caller can construct an `object`, but cannot construct authority.

## Internal authority contract

```ts
type InternalValidatedAcceptedHistory = {
  readonly authorityVersion:
    typeof TRUSTED_HISTORY_AUTHORITY_VERSION;
  readonly authorityEpoch: string;
  readonly aggregateGeneration: number;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly finalGameVersion: number;
  readonly finalEventSequence: number;
  readonly events: readonly object[];
  readonly acceptedReceipts: readonly object[];
  readonly eventChecksums:
    readonly AcceptedEventChecksumRecord[];
  readonly batchChecksums:
    readonly AcceptedBatchChecksumRecord[];
  readonly snapshot:
    OptionalTrustedSnapshotRecord | null;
  readonly canonicalBundleSha256: Sha256Hex;
};

type InternalCanonicalGameStateAtVersion = {
  readonly authorityVersion:
    typeof TRUSTED_HISTORY_AUTHORITY_VERSION;
  readonly authorityEpoch: string;
  readonly aggregateGeneration: number;
  readonly historyHandle: object;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly state: GameState;
};

const issuedHistoryHandles = new WeakSet<object>();
const historyDataByHandle =
  new WeakMap<object, InternalValidatedAcceptedHistory>();

const issuedStateHandles = new WeakSet<object>();
const stateDataByHandle =
  new WeakMap<object, InternalCanonicalGameStateAtVersion>();

const stateCacheByHistory =
  new WeakMap<object, Map<number, object>>();

const issueZeroFieldHandle = (): object => {
  const handle = Object.create(null) as object;
  Object.freeze(handle);
  return handle;
};
```

Issuers, `WeakSet`s, `WeakMap`s, internal data, cache, and authority sources are module-private. There is no exported brand symbol, constructor, registration function, test issuer, or hydration function.

Every issued handle is exactly:

- created with `Object.create(null)`;
- frozen with `Object.freeze`;
- zero own string keys;
- zero own symbol keys;
- no prototype;
- no getter, setter, data field, revision, ID, state, event, receipt, or brand property;
- registered in exactly one module-private authority `WeakSet`;
- backed by exactly one module-private `WeakMap` record.

## Public positional authority checks

Authority-bearing public APIs receive the candidate handle directly as their first positional argument.

The mandatory first operation is equivalent to:

```ts
const requireIssuedHistory = (
  candidate: unknown,
): InternalValidatedAcceptedHistory | undefined => {
  if (
    (typeof candidate !== "object" || candidate === null) &&
    typeof candidate !== "function"
  ) return undefined;

  try {
    const objectCandidate = candidate as object;
    if (!issuedHistoryHandles.has(objectCandidate)) {
      return undefined;
    }
    return historyDataByHandle.get(objectCandidate);
  } catch {
    return undefined;
  }
};
```

The state-handle check is identical except for its state `WeakSet` and `WeakMap`.

Before `WeakSet.has`, the function may perform only the primitive/null check shown above. It must not:

- read a property;
- enumerate keys;
- inspect a descriptor;
- inspect a prototype;
- call a caller method;
- stringify;
- serialize;
- clone;
- compare visible fields.

Therefore plain lookalikes, Proxy wrappers, revoked Proxy wrappers, getters, symbols, fake constructors, casts, spread copies, `structuredClone`, and JSON round trips fail without invoking getters. Public authority checks guarantee zero caller getter invocations.

## Live successful-commit journal

### Ownership

The journal belongs to the application commit boundary, not to domain roles, projections, UI, or storage callers.

Its only capture point is after one successful accepted commit returns:

```text
validated command
  -> prospective canonical state and atomic batch validation
  -> accepted commit
  -> accepted receipt and committed events returned
  -> journal capture
```

Rejected, failed, retried-but-not-committed, or partially returned commands are never captured.

### Aggregate invariants

One journal aggregate is bound to:

- one game;
- one rules baseline;
- one process authority epoch;
- one continuous sequence of successful commands;
- one monotonically increasing aggregate generation.

For each capture:

- `expectedPriorGameVersion` equals the journal’s current final version;
- `expectedPriorEventSequence` equals its current final sequence;
- the accepted batch begins at the next event sequence;
- the batch game version equals prior version plus one;
- every batch event shares the committed game version, command, and batch;
- the receipt maps exactly to that command and game version;
- the command ID has not previously succeeded in a different batch;
- a retry that returns the same accepted receipt does not append twice;
- a conflicting retry returns `CROSS_COMMAND_CONFLICT`;
- the aggregate is updated atomically or not at all.

Each successful capture computes event, batch, and aggregate checksums using the frozen canonicalization algorithm. The journal does not mutate domain events or receipts.

### Journal authority identity

The live journal’s constructor and registration remain application-internal. A public object cannot claim journal authority. Admission checks the journal instance against a private journal registry before reading journal state.

### Current limitation

The existing command commit store cannot enumerate all accepted receipts for a game. Therefore the current store cannot reconstruct a complete journal aggregate after process restart. This design does not claim restart recovery is implemented.

## Approved raw-byte replay registry

### Raw-byte boundary

`admitApprovedReplayArtifact` accepts `rawBytes: unknown`.

It must:

1. require an immutable byte view of the supported type;
2. copy the bytes before parsing;
3. enforce a frozen maximum byte length;
4. compute the exact raw-byte SHA-256;
5. find exactly one immutable approval record by `approvalId`;
6. match byte length and SHA before parsing;
7. decode strict UTF-8;
8. parse the frozen serialization format;
9. begin descriptor-safe T1 bundle capture;
10. complete every admission stage.

An approval record is compiled or loaded from repository-controlled immutable configuration. A caller cannot add, replace, or override records at runtime.

### Current R2 state

No approved raw-byte R2 replay artifact currently exists. The registry may be empty. Successful R2 admission is therefore unreachable until a separate artifact approval is authorized and reviewed.

The absence of an R2 artifact does not block P2F’s live-journal foundation design. It does keep P2 C19-A deferred and non-gating.

## History admission pipeline

Every stage has one input, one successful output, and declared failures. Any failure returns a terminal rejection. There is:

- no downgrade;
- no “unknown but continue” state;
- no partial authority;
- no warning-only authority;
- no caller override;
- no best-effort reconstruction;
- no fallback from approved replay to live journal;
- no fallback from a failed snapshot to event-only acceptance when a snapshot was supplied;
- no handle issuance before the last stage.

| Stage | Input | Successful output | Failure behavior |
|---|---|---|---|
| 0 — source admission | private live journal instance or raw bytes plus approval ID | admitted source context | reject invalid/revoked journal, missing approval, source mismatch, byte length/SHA mismatch |
| 1 — immutable capture | journal aggregate snapshot or copied raw bytes | detached raw bundle value | reject invalid UTF-8, invalid serialization, reflection failure, Proxy, getter, symbol, cycle, sparse array, nonplain value |
| 2 — exact bundle shape | detached raw bundle | exact bundle fields and version literals | reject missing/extra/non-enumerable fields, wrong versions, unsafe numbers, invalid strings |
| 3 — authority metadata | exact bundle | validated live or approved replay metadata | reject caller-controlled or inconsistent source metadata |
| 4 — event envelope dispatch | raw event collection | exact supported event records | reject unknown event type/version, invalid ID/metadata, payload mismatch, extra/missing fields |
| 5 — event continuity | exact event records | one continuous game stream | reject mixed game/baseline, gaps, duplicates, invalid starting sequence |
| 6 — batch reconstruction | continuous events | contiguous complete batches | reject partial, interleaved, repeated, mismatched command, invalid game-version transitions |
| 7 — receipt capture | raw receipt collection | exact validated accepted receipts | reject malformed receipt, invalid fingerprint, failed/rejected result |
| 8 — receipt reconciliation | batches and accepted receipts | one-to-one accepted command mapping | reject missing, duplicate, extra, command/game/version/event mismatch |
| 9 — event checksums | exact events and raw checksum records | one matching digest per event | reject missing, duplicate, extra, malformed, or mismatched digest |
| 10 — batch checksums | exact batches and raw checksum records | one matching digest per batch | reject missing, duplicate, extra, membership/order/range/digest mismatch |
| 11 — bundle checksum | all captured bundle fields | verified aggregate digest | reject malformed or mismatched digest |
| 12 — typed stream validation | exact captured events narrowed internally | validated typed event stream | reject any typed stream invariant failure |
| 13 — batch semantics | typed stream | replay-valid atomic batches | reject any domain batch semantic failure |
| 14 — event-only rebuild | validated typed stream | canonical final `GameState` | reject rebuild or replay invariant failure |
| 15 — rebuild boundary | final state and stream boundary | exact version/sequence match | reject rebuilt game-version or sequence mismatch |
| 16 — optional snapshot | null or exact raw snapshot record plus event-only state | null or validated cache relation | accept null; reject every supplied snapshot mismatch |
| 17 — handle issuance | complete validated internal history | zero-field history handle and private backing | reject issuance invariant failure; never expose partial state |

Descriptor-safe capture uses code-unit-sorted object keys, preserves array order, accepts only canonical plain data, safe integers excluding negative zero, and verified enumerable data descriptors. Getter invocation count is zero.

## Checksum contract

### Event checksum

SHA-256 over the canonical tagged-tree encoding of the exact captured event envelope, including payload.

### Batch checksum

SHA-256 over a canonical record containing:

- `batchId`;
- `commandId`;
- `gameVersion`;
- `firstEventSequence`;
- `lastEventSequence`;
- `eventCount`;
- ordered event IDs;
- ordered event checksums.

### Bundle checksum

SHA-256 over every canonical captured bundle field except `bundleSha256`, including:

- authority metadata;
- game and baseline;
- exact events;
- exact accepted receipts;
- event checksum records;
- batch checksum records;
- nullable snapshot record.

Checksum equality never establishes source authority.

## Receipt contract

Every accepted batch maps to exactly one accepted receipt.

Supported existing receipt forms:

- legacy: exact `commandId`, `gameId`, `result`, no own `commandFingerprint`;
- fingerprinted: exact `commandId`, `gameId`, `commandFingerprint`, `result`.

Fingerprint values pass the current exact validator.

Accepted result reconciliation:

- full-event result: exact ordered events equal the accepted batch;
- summary result: exact event count and ordered event types equal the batch;
- committed game version equals the batch game version.

Missing, duplicate, extra, rejected, failed, or mismatched receipts reject authority.

## Snapshot contract

Snapshot absence is valid.

When `snapshot === null`:

- event-only rebuild is canonical;
- no snapshot failure is reported;
- canonical state handle issuance may continue.

When a snapshot is supplied:

- exact snapshot shape is required;
- game and rules baseline match;
- `lastAppliedEventSequence` ends a complete batch;
- snapshot `gameVersion` equals that batch version;
- prefix digest equals the exact event prefix;
- state digest equals the exact captured state payload;
- event-only rebuild through the snapshot boundary succeeds;
- snapshot state exactly equals that event-only state;
- applying later events to the validated snapshot equals full event-only rebuild.

Any supplied snapshot mismatch rejects the entire history. A snapshot is never authority by itself.

## Canonical state at version

### Query

```ts
rebuildCanonicalGameStateAtVersion(
  historyHandle: unknown,
  queryGameVersion: number | "CURRENT",
)
```

The history handle is the first positional argument. Its WeakSet identity is checked before any caller property access.

### Complete-prefix rules

For target version `G`:

- `G` is a positive safe integer;
- `G` exists in the history;
- every event with game version `<= G` is included;
- no event with version `> G` is included;
- the prefix ends at the final event of `G`’s batch;
- event sequence remains continuous from `1`;
- the typed stream validator passes;
- batch semantics pass;
- event-only rebuild passes;
- rebuilt `state.gameVersion === G`;
- rebuilt `state.lastEventSequence` equals the prefix’s last sequence.

`CURRENT` selects the history handle’s private final complete game version.

### State-handle issuance

After all checks, the module issues a new zero-field opaque state handle and stores:

- authority version and epoch;
- aggregate generation;
- source history-handle identity;
- game and rules baseline;
- exact game version;
- exact last event sequence;
- detached canonical `GameState`.

No public field exposes these values.

## Handle lifecycle

### Game binding

One history handle belongs to exactly one game and rules baseline. One state handle belongs to that same game/baseline and one exact version.

Cross-game use fails `INVALID_HISTORY_AUTHORITY` or `HISTORY_AGGREGATE_MISMATCH`.

### Version binding

A state handle never advances. A later query returns another handle. `CURRENT` is resolved at query time against the supplied immutable history handle, not against a global latest state.

### Aggregate generation

Each successful live-journal append increments its private aggregate generation. Issuing a history handle snapshots one generation. Later commits do not mutate that handle’s history.

A new history handle represents the later aggregate. A state handle records the source handle and generation privately.

### Cross-command continuity

The journal admits only the exact next successful command batch. Repeated idempotent retrieval of the same accepted result does not append again. Conflicting command reuse rejects the aggregate.

### Authority epoch

Each authority-module process instance has a unique internal epoch obtained from repository-controlled initialization. It is never accepted from caller data.

Handles from another process, module instance, or epoch are absent from the local WeakSets and fail.

The epoch must not use locale-dependent ordering. If an identifier is persisted for diagnostics, it is not authority and must be supplied by an approved deterministic process contract rather than `Date.now`, randomness, or random UUID generation.

### Cache

The state cache is private:

```text
history-handle identity -> gameVersion -> state-handle identity
```

Rules:

- cache keys use issued identity, never structural fields;
- cache values are issued state handles;
- cache lookup occurs only after history authority validation;
- cache cannot mix history handles or aggregate generations;
- cache eviction is allowed;
- eviction never changes canonical meaning;
- rebuilding after eviction may issue a new equivalent handle;
- callers may compare handle identity only for same-process cache behavior, not semantic equality.

### Revocation

Revocation deletes the handle from its WeakSet, removes WeakMap backing, and removes associated cache entries where applicable.

After revocation:

- every public use fails;
- no consumer can restore authority;
- clones and cached caller references remain invalid;
- dependent state handles may also be revoked by the frozen implementation policy.

The design reviewer must select either mandatory cascading state-handle revocation or immutable already-issued state-handle survival. The recommended choice is mandatory cascading revocation because source authority has been explicitly withdrawn.

### Process restart and recovery

All handles become invalid on process restart.

Old events may receive new handles only when:

1. a live journal still has complete verifiable accepted events, all accepted receipts, checksums, and continuity evidence in the current authority process; or
2. a future approved raw-byte artifact exists and passes the complete admission pipeline.

The current store cannot enumerate complete accepted receipts. Therefore restart recovery from the current store is not supported and must not be claimed.

Persisting handle shape, brand, object bytes, cache records, or private diagnostic IDs does not preserve authority.

## Consumer policy

### Allowed after separate authorization

- the P2F authority module itself;
- the application successful-commit journal adapter;
- exact replay/recovery admission code;
- a separately reviewed domain-core consumer whose public API takes the state handle as the first positional argument;
- future P2 effective-condition derivation after P2F acceptance and fresh P2 authorization.

### Denied

- UI;
- player or AI context builders;
- public or private projections;
- serialization/export code treating handles as data;
- domain event payloads;
- snapshots;
- receipts;
- LLM inputs;
- role-specific resolver code without its own reviewed adoption Slice;
- generic service locators or dependency injection that lets arbitrary callers issue authority;
- tests using fake issuers.

Projection code must never consume a canonical-state handle directly. A reviewed canonical consumer may derive an already privacy-bounded projection input, but the handle, private canonical state, events, receipts, checksums, provenance, and authority metadata must not cross into projection output.

## Dependency direction

```text
application accepted-command commit owner
  -> application trusted commit journal adapter
  -> domain-core trusted-history authority port
  -> existing exact event/payload validators
  -> existing stream validator and batch semantics
  -> existing canonical rebuild

future reviewed domain-core consumer
  -> trusted-history authority public state-handle check
  -> private canonical state
```

Forbidden dependency directions:

- domain core importing application services;
- authority module importing role consumers;
- projection importing authority internals;
- persistence issuing handles;
- consumers registering their own issuer;
- tests exporting private authority hooks.

## Replay and historical compatibility

### Existing events

No existing event is changed. Event schemas and payload versions remain byte-for-byte compatible.

Typed replay remains authoritative only after T1 admission. P2F wraps rather than weakens:

- exact payload validators;
- `validateDomainEventStream`;
- domain batch semantics;
- `rebuildGameState`.

### Serialization

Handles are not serialized.

Only a raw bundle may be serialized, and serialization does not preserve authority. Re-admission starts at T1 and issues new process-local handles.

### Old history

Old history is not automatically trusted. It is admissible only if:

- the live journal still retains complete verifiable evidence in the issuing process; or
- it is a separately approved raw-byte artifact.

The current store’s typed event loading alone is insufficient.

### Snapshot

Snapshot absence is accepted. A present snapshot remains an optional cache and must equal event-only reconstruction.

## Real R2 artifact

### Exact artifact definition

A qualifying R2 artifact requires:

```ts
export type LegacyReplayCompatibilityApproval = {
  readonly registryVersion:
    "trusted-replay-approval-registry-v1";
  readonly approvalId: string;
  readonly artifactId: string;
  readonly artifactRevision: string;
  readonly artifactPurpose:
    "LEGACY_REPLAY_COMPATIBILITY";
  readonly compatibilityPromiseId: string;
  readonly compatibilityFromVersion: string;
  readonly compatibilityToVersion: string;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly rawByteLength: number;
  readonly rawBytesSha256: Sha256Hex;
  readonly approvedAt: string;
  readonly approvalSourceRevision: string;
};
```

It must:

- represent a genuinely older or separately imported supported format;
- exist before the pending compatibility assertion;
- be immutable;
- have exact repository approval;
- have exact raw bytes, byte length, SHA, revision, and compatibility promise;
- pass the same T1 admission pipeline;
- remain reproducible without rewriting current events.

### Current state

No qualifying R2 artifact exists.

Current Philosopher or Snake Charmer R1 histories do not become R2 when copied, stored, loaded, rebuilt, or relabeled. P2F must not create a fake R2 artifact to satisfy P2.

## C19 handoff

### C19-A — deferred legacy authority

```text
ExpectedReachability = R2
ExpectedTrust = T1
ExpectedPrimaryLayer = LEGACY_REPLAY_COMPATIBILITY
```

Disposition: `DEFERRED_NON_GATING_NO_QUALIFYING_R2_ARTIFACT`.

This row does not pass, does not block P2F live-foundation design, and cannot be used to authorize P2. A real artifact and fresh review are required.

### C19-B — future condition seam

```text
ExpectedReachability = R1
ExpectedTrust = T2
ExpectedPrimaryLayer = PURE_POLICY_SEAM
```

Disposition: `FUTURE_P2_HANDOFF_ONLY`.

P2F supplies only the canonical-state handle. It does not derive DRUNK/POISONED state, call a role resolver, or implement P2 behavior.

C19-A and C19-B must use distinct primary evidence identities.

## C20 hostile matrices

### H1 — persisted history

```text
ExpectedReachability = R3
ExpectedTrust = T1
ExpectedPrimaryLayer = HOSTILE_REPLAY_REJECTION
```

Required single-mutation families:

- authority source missing or revoked;
- event missing, duplicated, reordered, cross-game, cross-baseline, wrong version, or malformed;
- batch partial, interleaved, duplicated, wrong command, wrong game version, or discontinuous;
- receipt missing, duplicated, extra, failed, rejected, fingerprint-invalid, or batch-mismatched;
- event, batch, or bundle checksum missing, duplicated, extra, malformed, or mismatched;
- snapshot boundary, prefix digest, state digest, state value, or later-event relation mismatched;
- Proxy, revoked Proxy, getter, setter, symbol, cycle, sparse array, nonplain object, non-enumerable field, or extra field.

Every case rejects before handle issuance. Getter invocation count is zero.

### H2 — forged handle

```text
ExpectedReachability = R3
ExpectedTrust = T1
ExpectedPrimaryLayer = STRUCTURAL_VALIDATION
```

Required cases:

- `{}`;
- `Object.create(null)`;
- frozen empty null-prototype object;
- fake constructor;
- cast;
- fake string or symbol brand;
- spread copy;
- `structuredClone`;
- JSON round trip;
- Proxy;
- revoked Proxy;
- getter/symbol lookalike;
- handle from another process/module instance;
- revoked handle;
- wrong history aggregate or game/version cache entry.

Every case fails the initial WeakSet identity check before caller property access.

### H3 — external/imported bundle

```text
ExpectedReachability = R3
ExpectedTrust = T1
ExpectedPrimaryLayer = HOSTILE_REPLAY_REJECTION
```

Required cases:

- no approval;
- unknown approval;
- artifact ID/revision/purpose mismatch;
- byte length mismatch;
- raw-byte SHA mismatch;
- invalid UTF-8 or serialization;
- self-signed caller bundle;
- altered event, receipt, checksum, or snapshot;
- bundle SHA mismatch;
- a structurally valid but unapproved artifact.

No history handle is issued.

## Supporting Authority

`SUP-2B20B-P1-011` remains immutable:

| Field | Value |
|---|---|
| AuthorityStatus | `ACCEPTED` |
| Historical P1 purpose | unchanged |
| P2F applicability | `NOT_APPLICABLE` |
| Current P2 applicability | `NOT_APPLICABLE` |
| POISONED authority | `FORBIDDEN` |
| P2F primary authority | `FORBIDDEN` |
| Status rewrite | `FORBIDDEN` |

`NOT_APPLICABLE` describes scope and is not an authority status. SUP-2B20B-P1-011 cannot support trusted history, a handle, POISONED Dreamer, general POISONED state, or any P2F semantic primary.

## Design-time Governance Traceability V1.1

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `P2F-F01_LIVE_JOURNAL_ADMISSION` | Live authority begins only after a real successful accepted command | Repository-controlled journal captures exact accepted batch, receipt, version, and prior aggregate boundary after commit success | Formal application command through successful commit and journal capture | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | one continuous journal generation captured; rejected/failed/retried conflict does not append | real accepted application flow; no manual journal |
| `P2F-F02_EXACT_BUNDLE_SHAPE` | Raw bundle data must be captured without caller code execution | Exact versioned bundle with only verified enumerable data descriptors is detached before semantics | Descriptor-safe unknown graph capture and exact-field validation | `R1` | `T1` | `STRUCTURAL_VALIDATION` | exact plain bundle passes; Proxy/getter/symbol/cycle/sparse/nonplain fails closed | admitted live journal source only |
| `P2F-F03_EVENT_BATCH_RECEIPT_RELATION` | Events, batches, commands, versions, and accepted receipts form one exact history | Continuous events reconstruct complete batches and map one-to-one to exact accepted receipts | Exact structural and relational validation over admitted live bundle | `R1` | `T1` | `STRUCTURAL_VALIDATION` | missing, duplicate, extra, discontinuous, or mismatch rejects | live journal capture is support, not substitute |
| `P2F-F04_EVENT_BATCH_BUNDLE_HASHES` | Checksums detect corruption without becoming authority | One exact event digest, batch digest, and bundle digest matches canonical captured content | Code-unit canonical encoding and SHA-256 relation validation | `R1` | `T1` | `STRUCTURAL_VALIDATION` | all hashes match or admission rejects | repository-controlled source still required |
| `P2F-F05_SNAPSHOT_ABSENT` | Snapshot absence preserves event-log authority | Trusted live history with `snapshot=null` rebuilds completely from events | Exact nullable snapshot validation plus event-only rebuild | `R1` | `T1` | `STRUCTURAL_VALIDATION` | history and state handles may issue without snapshot | no snapshot producer required |
| `P2F-F06_SNAPSHOT_PRESENT` | Present snapshot is cache only | Exact boundary/digest/state equality with event-only rebuild and later-event equality | Snapshot structural and event-only relation validation | `R4` | `T1` | `STRUCTURAL_VALIDATION` | exact cache may pass; any mismatch rejects; no current producer required | future snapshot support only |
| `P2F-F07_HISTORY_HANDLE_ISSUANCE` | Accepted history authority is non-forgeable runtime identity | Zero-field frozen null-prototype handle is issued only after complete T1 admission and backed by private WeakSet/WeakMap state | Runtime issuance and private identity validation | `R1` | `T1` | `STRUCTURAL_VALIDATION` | authentic handle issues; no public field, constructor, brand, issuer, or backing state | no structural object can support issuance |
| `P2F-F08_STATE_HANDLE_ISSUANCE` | Canonical state authority binds one complete version of one history | Authentic history handle, complete prefix, typed validation, batch semantics, rebuild, and boundary equality precede issuance | Positional history-handle check and exact-version rebuild | `R1` | `T1` | `STRUCTURAL_VALIDATION` | process-local state handle issues for exact complete version | authentic history handle required |
| `P2F-F09_HANDLE_LIFECYCLE` | Handles remain process-local, immutable, aggregate-bound, and revocable | Cross-game, cross-generation, clone, serialization, restart, revoked, and cache-mismatch use fails | Direct authority identity, epoch, aggregate, cache, and revocation validation | `R3` | `T1` | `STRUCTURAL_VALIDATION` | invalid authority before private state access | no supporting authority |
| `P2F-C19A_LEGACY_AUTHORITY` | Legacy compatibility requires one genuine approved older/imported artifact | Exact approval schema, bytes, SHA, revision, and compatibility promise exist and pass T1 admission | Approved immutable legacy replay artifact admission | `R2` | `T1` | `LEGACY_REPLAY_COMPATIBILITY` | `DEFERRED_NON_GATING_NO_QUALIFYING_R2_ARTIFACT` | current R1 histories forbidden as substitute |
| `P2F-C19B_FUTURE_P2_HANDOFF` | Future condition derivation consumes canonical authority without owning admission | Future P2 receives an authentic state handle and derives its closed condition result in a separate Slice | Pure consumer contract over private T2 canonical state | `R1` | `T2` | `PURE_POLICY_SEAM` | handoff defined; P2F implements no condition behavior | future P2 evidence only |
| `P2F-C20H1_PERSISTED_HISTORY_HOSTILE` | Corrupted persisted history never receives authority | Every declared single event/batch/receipt/hash/snapshot/descriptor mutation rejects before issuance | One mutation of an admitted accepted-history source | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | fail closed; zero getter calls for accessor cases | original live history may be accepted support |
| `P2F-C20H2_FORGED_HANDLE_HOSTILE` | Caller-created lookalikes never reach private canonical data | Every object, cast, clone, serialization, Proxy, cross-epoch, and revoked candidate fails initial identity check | Direct public positional handle-boundary validation | `R3` | `T1` | `STRUCTURAL_VALIDATION` | invalid authority; no caller property read and zero getter calls | none |
| `P2F-C20H3_IMPORTED_BUNDLE_HOSTILE` | Unapproved or altered raw replay bytes remain untrusted | Missing approval, identity/revision/purpose/length/SHA mismatch, self-signature, or altered contents reject | Raw-byte replay admission with one approval or content mutation | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | no history handle issued | immutable registry record only when it exists |
| `P2F-SUP011_SCOPE` | Historical P1 support cannot become P2F or POISONED authority | Preserve historical status and record P2F/P2 applicability as not applicable | Immutable supporting-authority registry inspection | `R4` | `T3` | `STRUCTURAL_VALIDATION` | status remains ACCEPTED; no P2F primary or POISONED use | `SUP-2B20B-P1-011` historical record only |

Each row has one reachability, one trust class, and one primary layer.

## Conceptual future implementation allowlist

This allowlist is dormant. It becomes active only after an independent passing design review and separate implementation authorization.

### New production modules

- `packages/domain-core/src/trusted-accepted-history-authority.ts`
  - descriptor-safe bundle capture;
  - exact validation pipeline;
  - checksum policy;
  - replay admission;
  - opaque history/state handles;
  - canonical state rebuild.

- `packages/application/src/trusted-accepted-history-commit-journal.ts`
  - repository-controlled journal;
  - successful-commit observation;
  - aggregate continuity;
  - exact receipt capture.

### Narrow existing integration points

- the single application source file that owns `commitAcceptedCommand`
  - one post-success journal callback only;
  - no command, event, receipt, retry, or commit behavior change.

- the domain-core public export file
  - only safe public types and functions;
  - no issuer, constructor, brand, WeakSet, WeakMap, backing state, or test hook.

If repository inspection cannot identify exactly one existing commit owner and one export file before implementation, stop and correct the allowlist.

### New tests

- one domain-core authority test file;
- one application journal test file.

No existing role, Dreamer, projection, event, payload, receipt, snapshot, replay, batch, or rebuild test file may be changed. Existing suites may be executed read-only as regression gates.

### Documentation

- one P2F implementation traceability document;
- explicitly authorized P2F control updates only.

No other file is permitted without a new design correction and independent review.

## Migration

- no event migration;
- no receipt migration;
- no snapshot migration;
- no persisted handle migration;
- no role-state migration;
- no replay rewrite;
- no accepted behavior change.

Live journal authority begins only for successful commits observed after the future feature is enabled in the current process.

Earlier events do not automatically receive authority. They require complete live-journal evidence still available in process or a future approved replay artifact.

## Rollback

Rollback removes:

- the successful-commit journal callback;
- the two additive foundation modules;
- safe public exports;
- new tests and P2F implementation traceability.

Because no domain event, receipt, snapshot, or persistent state schema changes, rollback requires no data rewrite. All process-local handles become invalid and consumers must stop using the feature.

## Verification and gates for a future implementation

Only after separate authorization:

1. exact file-scope tests for new authority and journal modules;
2. hostile matrices H1, H2, and H3;
3. full typecheck;
4. lint;
5. ordinary test suite;
6. approved coverage process;
7. Linux and Windows required CI on the exact frozen feature HEAD;
8. independent complete final code and rule review.

Cross-platform CI supplements semantic primary evidence. It is not the primary layer for journal admission, structural authority, legacy compatibility, policy, or hostile rejection.

## Stop-loss

Stop and return `HUMAN_BLOCKED` if:

- the live journal cannot be placed after exactly one successful accepted commit point;
- the current transaction result cannot supply the exact accepted batch and receipt;
- receipt capture changes receipt schema or command semantics;
- a caller-controlled interface or metadata field must establish source authority;
- raw bundle validation requires a cast before exact capture and dispatch;
- exact event-type/payload dispatch cannot cover every supported event;
- batch or receipt enumeration is incomplete;
- checksum equality must substitute for semantic validation;
- snapshot absence cannot be accepted;
- a supplied snapshot can override event-only rebuild;
- the public handle must contain fields;
- an issuer, constructor, brand, WeakSet, WeakMap, backing state, or test hook must be exported;
- any caller property must be read before WeakSet identity validation;
- handles must survive cloning, serialization, or process restart;
- restart recovery must be claimed from the current store;
- a current R1 history must be relabeled R2;
- a fake R2 artifact must be generated;
- P2F must change events, payloads, receipts, snapshots, Dreamer, projections, role coverage, or gameplay;
- P2F must implement POISONED, No Dashii, Vigormortis, `EffectInstance`, `ContinuousRule`, or an Effect Engine;
- the conceptual allowlist must expand;
- tests require a fake issuer or manually trusted fixture;
- independent review does not return the protocol-defined passing verdict.

## Open reviewer checks

The independent reviewer must determine:

1. whether the post-success journal callback can observe the exact committed batch and exact accepted receipt without changing commit semantics;
2. whether mandatory cascading revocation from history handle to state handles is the correct final policy;
3. whether the empty approved replay registry should ship with the foundation or wait for a later artifact Slice;
4. whether the conceptual existing-file integration points resolve to exactly one commit owner and one export file;
5. whether every supported event payload has an existing exact runtime validator suitable for T1 dispatch;
6. whether the canonical timestamp and raw serialization formats are sufficiently frozen for deterministic hashing;
7. whether the live journal’s in-process authority can be tested exclusively through real accepted commands without a fake issuer;
8. whether all H1/H2/H3 mutations are complete and non-overlapping;
9. whether P2F can remain additive without changing the current store;
10. whether current receipt-enumeration limits are accurately represented as restart recovery unsupported.

An unresolved substantive conflict returns `HUMAN_BLOCKED`; it is not an architecture choice.

## Design disposition

- ruleVerdict: `RULE_READY`
- designReviewStatus: `NOT_REVIEWED`
- architectRecommendation: `SUBMIT_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`
- architectRecommendationIsReviewerVerdict: `false`
- selectedAuthorityOption: `OPAQUE_HANDLE`
- currentR2Artifact: `ABSENT`
- c19AStatus: `DEFERRED_NON_GATING_NO_QUALIFYING_R2_ARTIFACT`
- c19BStatus: `FUTURE_P2_HANDOFF_ONLY`
- currentStoreRestartRecovery: `UNSUPPORTED`
- implementationAuthorized: `false`
- productionFilesChanged: `0`
- testFilesChanged: `0`
- requiredNextAction: `INDEPENDENT_RULE_DESIGN_REVIEW`

`READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`
