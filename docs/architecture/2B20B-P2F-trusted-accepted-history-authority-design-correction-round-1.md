# Phase 3 Slice 2B20B-P2F — Trusted Accepted History Authority Design Correction Round 1

## Metadata

- sliceId: `2B20B-P2F`
- documentType: `STANDALONE_DESIGN_CORRECTION`
- designCorrectionRound: `1`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F_DESIGN_CORRECTION_ROUND_1_ONLY`
- authorizationScope: `DESIGN_ONLY`
- parentDesignPath: `docs/architecture/2B20B-P2F-trusted-accepted-history-authority-design-round-1.md`
- parentDesignSha256: `2fec5625ae287b76c82d1a6f2f40ae4335d79dae0ea7f4e9fa617a2c8881ad24`
- currentHead: `bef395287d5400043565acd5b794d02810d7bbca`
- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- ruleVerdict: `RULE_READY`
- designReviewStatus: `NOT_REVIEWED`
- architectRecommendation: `SUBMIT_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`
- architectRecommendationIsReviewerVerdict: `false`
- implementationAuthorized: `false`
- productionChangeAuthorized: `false`
- testChangeAuthorized: `false`
- ruleSemanticsChanged: `false`
- acceptedBehaviorChanged: `false`
- eventSchemaChanged: `false`
- payloadSchemaChanged: `false`
- receiptSchemaChanged: `false`
- snapshotSchemaChanged: `false`
- workflowChangeAuthorized: `false`
- profileChangeAuthorized: `false`
- dependencyChangeAuthorized: `false`
- sevenPriorBlockersTargeted: `true`
- openReviewerDecisions: `0`
- openImplementerDecisions: `0`

This document does not claim `RULE_DESIGN_PASS`. It supersedes every conflicting or open clause in the parent design for future P2F consideration. It authorizes no implementation or repository change beyond materializing this design correction.

## Correction scope

This correction closes exactly seven prior design blockers:

1. one unique application-owned authority runtime and command-store decorator;
2. complete journal failure, quarantine, retry, and rollback semantics;
3. one exhaustive descriptor-safe unknown-to-typed event dispatcher;
4. one exact canonicalization, checksum, raw-byte, and authority-binding contract;
5. one closed opaque-handle lifecycle, epoch, cache, and revocation contract;
6. one non-issuing hostile/snapshot evidence seam based on real accepted commands;
7. one exact future implementation allowlist and stop-loss.

All other parent scope remains frozen unless this correction explicitly replaces it.

## Non-goals

This correction does not authorize or design:

- POISONED Dreamer;
- any new POISONED or DRUNK gameplay producer;
- No Dashii impairment;
- Vigormortis death, retained-Minion, adjacency, poison, or other-night behavior;
- `EffectInstance`, `ContinuousRule`, or an Effect Engine;
- a generic ability registry;
- changes to `GameApplicationService`;
- changes to application business commands;
- changes to Dreamer, Philosopher, Snake Charmer, ledgers, or projections;
- changes to domain events, payloads, receipts, or snapshot schemas;
- package-index exports;
- production persistence or restart recovery;
- a current successful R2 replay admission;
- workflow, profile, dependency, or timeout changes;
- first-night completion, Dawn, Day, nomination, voting, execution, death, or Phase 2C.

## Authority and supporting evidence

### Source authority

Exactly one package-internal application runtime owns authority:

```text
packages/application/src/trusted-history/
  TrustedHistoryAuthorityRuntime
```

It alone owns:

- the live successful-commit journal;
- live journal aggregate state;
- the empty-or-approved raw-byte replay registry;
- both issued-handle `WeakSet`s;
- both private-record `WeakMap`s;
- per-game epoch tables;
- aggregate generations;
- quarantine state;
- cache state;
- admission orchestration;
- rebuild orchestration;
- handle issuance;
- internal disposal and authority replacement.

There is no second issuer.

Domain core supplies existing pure exact validators, stream validation, batch semantics, and rebuild functions. Domain core:

- never issues a handle;
- never registers a handle;
- never stores an authority epoch;
- never owns a journal;
- never owns a replay approval registry;
- never exposes an authority hydrator;
- never decides whether a caller is trusted.

The rebuild submodule receives only private validated records from `TrustedHistoryAuthorityRuntime`. It cannot issue or register handles.

### Supporting evidence

These mechanisms support validation but never establish source authority alone:

- exact event and payload validation;
- accepted receipts;
- event checksums;
- batch checksums;
- journal checksums;
- bundle checksums;
- canonical-state checksums;
- optional snapshots;
- typed stream validation;
- batch semantics;
- event-only rebuild.

A caller controlling both data and supporting evidence remains untrusted.

## Unique issuer and command-store decorator

### Internal factory

Future implementation uses:

```ts
createTrustedHistoryCommandCommitStore(
  inner: CommandCommitStore,
): TrustedHistoryCommandCommitStoreDecorator
```

The factory is exported only from its internal source module for package-internal composition. It is not exported from the application package index.

The decorator result is:

```ts
type TrustedHistoryCommandCommitStoreDecorator = {
  readonly store: CommandCommitStore;
  readonly authorityReader: TrustedHistoryAuthorityReader;
};
```

`store` delegates the normal `CommandCommitStore` contract. `authorityReader` is package-internal and cannot issue authority; it can only request the owning runtime to admit the current live aggregate or rebuild a state handle.

The wrapper observes exact committed events and the accepted receipt only after:

```text
inner.commitAcceptedCommand(...) succeeds
```

The application business service receives a normal `CommandCommitStore`. It is not modified and does not know that the store is decorated.

### Forbidden exports

The following are not package-index exports:

- `createTrustedHistoryCommandCommitStore`;
- `TrustedHistoryAuthorityRuntime`;
- the decorator concrete type;
- the authority reader;
- journal types;
- replay registry types;
- issuer functions;
- registration functions;
- hydrators;
- authority brands;
- authority epochs;
- handle-record types;
- test issuers;
- fake journal constructors.

### Composition

The future implementation constructs the decorator in new P2F test composition and future separately authorized application composition. It does not change `GameApplicationService`.

## Exact conceptual TypeScript contract

This contract is design authority, not production code.

```ts
import type {
  CommandCommitStore,
  CommandReceipt,
} from "../command-commit-store.js";
import type {
  AnyDomainEventEnvelope,
  DomainEventType,
  GameState,
} from "@botc/domain-core";
import type {
  BatchId,
  CommandId,
  EventId,
  GameId,
} from "@botc/domain-core";

export const TRUSTED_HISTORY_RUNTIME_VERSION =
  "trusted-history-runtime-v1" as const;

export const TRUSTED_HISTORY_BUNDLE_VERSION =
  "trusted-history-bundle-v1" as const;

export const TRUSTED_HISTORY_REPLAY_REGISTRY_VERSION =
  "trusted-history-replay-registry-v1" as const;

export const TRUSTED_HISTORY_CANONICALIZATION_VERSION =
  "plain-data-tagged-tree-code-unit-keys-v1" as const;

export const SUPPORTED_DOMAIN_EVENT_VERSION = 1 as const;

export type Sha256Hex = string;
export type AuthorityEpoch = number;
export type AggregateGeneration = number;

export type TrustedHistoryRuntimeId = object;

export type TrustedAcceptedHistoryHandle = object;
export type CanonicalGameStateAtVersionHandle = object;

export type TrustedHistoryRuntimeStatus =
  | "ACTIVE"
  | "QUARANTINED"
  | "DISPOSED";

export type TrustedHistoryQuarantineReason =
  | "POST_COMMIT_CAPTURE_FAILED"
  | "POST_COMMIT_CHECKSUM_FAILED"
  | "LIVE_ADMISSION_CHECKSUM_FAILED"
  | "LIVE_REBUILD_FAILED"
  | "RUNTIME_INTEGRITY_FAILED"
  | "AUTHORITY_REPLACED"
  | "EXPLICIT_INTERNAL_DISPOSE";

export type TrustedHistoryJournalEventChecksum = {
  readonly eventId: EventId;
  readonly eventSequence: number;
  readonly sha256: Sha256Hex;
};

export type TrustedHistoryJournalBatchChecksum = {
  readonly batchId: BatchId;
  readonly commandId: CommandId;
  readonly gameVersion: number;
  readonly firstEventSequence: number;
  readonly lastEventSequence: number;
  readonly eventCount: number;
  readonly orderedEventIds: readonly EventId[];
  readonly orderedEventChecksums: readonly Sha256Hex[];
  readonly sha256: Sha256Hex;
};

export type TrustedHistoryJournalReceiptRecord = {
  readonly commandId: CommandId;
  readonly gameId: GameId;
  readonly gameVersion: number;
  readonly receipt: CommandReceipt;
  readonly sha256: Sha256Hex;
};

export type TrustedHistoryJournalSnapshot = {
  readonly runtimeId: TrustedHistoryRuntimeId;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly authorityEpoch: AuthorityEpoch;
  readonly aggregateGeneration: AggregateGeneration;
  readonly firstEventSequence: 1;
  readonly finalEventSequence: number;
  readonly finalGameVersion: number;
  readonly events: readonly AnyDomainEventEnvelope[];
  readonly receipts:
    readonly TrustedHistoryJournalReceiptRecord[];
  readonly eventChecksums:
    readonly TrustedHistoryJournalEventChecksum[];
  readonly batchChecksums:
    readonly TrustedHistoryJournalBatchChecksum[];
  readonly journalSha256: Sha256Hex;
};

export type TrustedHistoryOptionalSnapshot = {
  readonly snapshotVersion: string;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly gameVersion: number;
  readonly lastAppliedEventSequence: number;
  readonly eventPrefixSha256: Sha256Hex;
  readonly statePayload: unknown;
  readonly canonicalStateSha256: Sha256Hex;
  readonly createdAt: string;
};

export type TrustedHistoryRawBundleV1 = {
  readonly bundleVersion:
    typeof TRUSTED_HISTORY_BUNDLE_VERSION;
  readonly canonicalizationVersion:
    typeof TRUSTED_HISTORY_CANONICALIZATION_VERSION;
  readonly sourceKind:
    | "LIVE_SUCCESSFUL_COMMIT_JOURNAL"
    | "APPROVED_RAW_REPLAY";
  readonly sourceIdentity: string;
  readonly sourceRevision: string;
  readonly gameId: unknown;
  readonly rulesBaselineVersion: unknown;
  readonly events: unknown;
  readonly receipts: unknown;
  readonly eventChecksums: unknown;
  readonly batchChecksums: unknown;
  readonly journalSha256: unknown;
  readonly snapshot: unknown;
  readonly bundleSha256: unknown;
};

export type ApprovedRawReplayRecord = {
  readonly registryVersion:
    typeof TRUSTED_HISTORY_REPLAY_REGISTRY_VERSION;
  readonly approvalId: string;
  readonly artifactId: string;
  readonly artifactRevision: string;
  readonly artifactPurpose:
    "LEGACY_REPLAY_COMPATIBILITY";
  readonly compatibilityPromiseId: string;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly rawByteLength: number;
  readonly rawBytesSha256: Sha256Hex;
  readonly approvedAt: string;
  readonly approvalSourceRevision: string;
};

export type TrustedHistoryAdmissionFailureCode =
  | "INVALID_AUTHORITY_SOURCE"
  | "AUTHORITY_QUARANTINED"
  | "AUTHORITY_REVOKED"
  | "INVALID_RAW_BYTES"
  | "RAW_REPLAY_BOM_FORBIDDEN"
  | "RAW_REPLAY_TRAILING_BYTES"
  | "INVALID_UTF8"
  | "INVALID_JSON"
  | "DUPLICATE_JSON_KEY"
  | "UNAPPROVED_REPLAY_ARTIFACT"
  | "REPLAY_APPROVAL_MISMATCH"
  | "RAW_BYTES_LENGTH_MISMATCH"
  | "RAW_BYTES_CHECKSUM_MISMATCH"
  | "INVALID_BUNDLE_SHAPE"
  | "INVALID_BUNDLE_VERSION"
  | "INVALID_CANONICALIZATION_VERSION"
  | "INVALID_SOURCE_METADATA"
  | "INVALID_EVENT_COLLECTION"
  | "INVALID_EVENT_SHAPE"
  | "UNKNOWN_EVENT_TYPE"
  | "UNSUPPORTED_EVENT_VERSION"
  | "INVALID_EVENT_PAYLOAD"
  | "INVALID_EVENT_CHECKSUM"
  | "EVENT_CHECKSUM_MISSING"
  | "EVENT_CHECKSUM_DUPLICATE"
  | "EVENT_CHECKSUM_MISMATCH"
  | "INVALID_EVENT_SEQUENCE"
  | "INVALID_GAME_VERSION"
  | "INVALID_BATCH_MEMBERSHIP"
  | "INVALID_BATCH_SEQUENCE"
  | "INVALID_BATCH_CHECKSUM"
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
  | "JOURNAL_CHECKSUM_MISMATCH"
  | "BUNDLE_CHECKSUM_MISMATCH"
  | "TYPED_STREAM_VALIDATION_FAILED"
  | "BATCH_SEMANTICS_FAILED"
  | "REBUILD_FAILED"
  | "REBUILT_VERSION_MISMATCH"
  | "REBUILT_SEQUENCE_MISMATCH"
  | "CANONICAL_STATE_CHECKSUM_MISMATCH"
  | "AUTHORITY_BINDING_MISMATCH"
  | "INVALID_SNAPSHOT_SHAPE"
  | "SNAPSHOT_RELATION_MISMATCH"
  | "SNAPSHOT_STATE_MISMATCH";

export type CanonicalStateFailureCode =
  | "INVALID_HISTORY_AUTHORITY"
  | "AUTHORITY_QUARANTINED"
  | "AUTHORITY_REVOKED"
  | "INVALID_QUERY_GAME_VERSION"
  | "QUERY_GAME_VERSION_NOT_FOUND"
  | "INCOMPLETE_GAME_VERSION_PREFIX"
  | "TYPED_STREAM_VALIDATION_FAILED"
  | "BATCH_SEMANTICS_FAILED"
  | "REBUILD_FAILED"
  | "REBUILT_VERSION_MISMATCH"
  | "REBUILT_SEQUENCE_MISMATCH"
  | "CANONICAL_STATE_CHECKSUM_MISMATCH"
  | "AUTHORITY_BINDING_MISMATCH";

export type CandidateValidationDiagnostic = {
  readonly stage: string;
  readonly code: TrustedHistoryAdmissionFailureCode;
  readonly eventSha256: Sha256Hex | null;
  readonly batchSha256: Sha256Hex | null;
  readonly journalSha256: Sha256Hex | null;
  readonly canonicalStateSha256: Sha256Hex | null;
  readonly authorityBindingSha256: Sha256Hex | null;
};

export type CandidateValidationResult =
  | {
      readonly valid: true;
      readonly diagnostic:
        Omit<CandidateValidationDiagnostic, "code">;
    }
  | {
      readonly valid: false;
      readonly diagnostic:
        CandidateValidationDiagnostic;
    };

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

export type CanonicalStateResult =
  | {
      readonly ok: true;
      readonly canonicalStateHandle:
        CanonicalGameStateAtVersionHandle;
    }
  | {
      readonly ok: false;
      readonly code: CanonicalStateFailureCode;
    };

type TrustedHistoryAuthorityReader = {
  readonly admitCurrentLiveHistory:
    (gameId: GameId) =>
      TrustedHistoryAdmissionResult;
  readonly rebuildCanonicalGameStateAtVersion:
    (
      historyHandle: unknown,
      queryGameVersion: number | "CURRENT",
    ) => CanonicalStateResult;
  readonly validateCandidateWithoutIssuance:
    (candidate: unknown) =>
      CandidateValidationResult;
  readonly admitApprovedRawReplay:
    (
      rawBytes: unknown,
      approvalId: string,
    ) => TrustedHistoryAdmissionResult;
};

type TrustedHistoryCommandCommitStoreDecorator = {
  readonly store: CommandCommitStore;
  readonly authorityReader:
    TrustedHistoryAuthorityReader;
};

declare function createTrustedHistoryCommandCommitStore(
  inner: CommandCommitStore,
): TrustedHistoryCommandCommitStoreDecorator;
```

`createTrustedHistoryCommandCommitStore` and all types after `TrustedHistoryAdmissionResult` are package-internal. No application package-index export is permitted.

## Failure and quarantine state machine

### Runtime states

```text
ACTIVE
  -> QUARANTINED
  -> ACTIVE only through authority replacement

ACTIVE
  -> DISPOSED

QUARANTINED
  -> DISPOSED
```

There is no automatic healing transition.

Authority replacement:

- is package-internal;
- creates a new per-game epoch;
- requires a newly constructed runtime aggregate from an independently authorized source;
- invalidates all handles from the prior epoch;
- is not triggered by retry.

### Failure matrix

| Situation | Inner store result | Journal state | Authority state | Retry behavior | Rollback |
|---|---|---|---|---|---|
| append/commit fails before accepted commit | preserve exact inner failure/throw contract | unchanged | unchanged | delegate normal inner retry semantics | none; nothing accepted |
| inner commit succeeds, journal capture fails | return exact successful commit result; wrapper must not throw | mark capture failure; do not append partial journal record | increment game epoch; set `QUARANTINED`; logically invalidate dependent handles | same command returns existing receipt; no recapture and no silent heal | forbidden |
| inner commit succeeds, journal checksum fails | return exact successful commit result | discard candidate journal append; retain prior immutable journal aggregate only for diagnostics | increment epoch; `QUARANTINED` | existing receipt returned; quarantine persists | forbidden |
| journal capture succeeds, optional snapshot capture/validation fails | return exact successful commit result | accepted event/receipt journal remains valid; snapshot cache rejected or ignored | remain `ACTIVE` | normal idempotent retry; no duplicate journal append | forbidden |
| live admission checksum fails | no history handle | preserve raw candidate diagnostic; no partial authority | increment epoch; `QUARANTINED` | no issuance; retry remains blocked until authority replacement | forbidden |
| approved replay admission checksum fails | no history handle | preserve exact raw bytes outside canonical state | quarantine that artifact identity; live game epoch unchanged | repeated artifact remains rejected | not applicable |
| canonical rebuild fails for live history | no state handle | preserve validated journal for diagnostics | increment epoch; `QUARANTINED`; invalidate all dependent handles | no issuance; command processing may continue | forbidden |
| canonical rebuild fails for replay artifact | no state handle | preserve raw artifact outside canonical state | quarantine artifact identity | repeated artifact remains rejected | not applicable |
| process dies after inner commit but before journal capture | accepted events/receipt remain committed in inner store | in-process journal evidence is lost | new process has no authority | same command may return existing receipt, but no journal reconstruction or authority issuance | forbidden |
| idempotent retry after successful journal capture | return existing receipt | no duplicate append; generation unchanged | unchanged | exact receipt returned | forbidden |
| idempotent retry after post-commit quarantine | return existing receipt | no capture retry and no silent repair | remains `QUARANTINED` | exact receipt returned | forbidden |

### Post-commit no-throw rule

After `inner.commitAcceptedCommand` succeeds, every journal operation is caught internally. Journal failure:

- never changes the application result;
- never reclassifies the accepted command as append failure;
- never throws through the normal store contract;
- never deletes or rewrites accepted events;
- never deletes or rewrites the receipt;
- never decrements game version;
- never retries the accepted append inside the same call;
- always quarantines the affected authority epoch when accepted-history evidence is incomplete or inconsistent.

Accepted command processing may continue while authority is quarantined. New history/state handle issuance for that game remains blocked.

### Snapshot failure

Snapshot is cache only. Snapshot creation, capture, checksum, or relation failure:

- rejects or ignores that cache candidate;
- does not roll back accepted events or receipt;
- does not invalidate event authority when event journal evidence is complete;
- cannot become source authority;
- cannot repair an invalid journal.

### Restart

Restart invalidates all handles. The current store cannot enumerate all accepted receipts, so it cannot reconstruct complete authority. No history or state handle may be issued after restart until a separately authorized durable authority path exists.

## Exhaustive descriptor-safe event dispatcher

### Exact envelope

Before any typed cast, each raw event must be a captured plain object with exactly these enumerable data keys:

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

Required envelope rules:

- `category === "domain"`;
- `eventVersion === SUPPORTED_DOMAIN_EVENT_VERSION`;
- positive safe integer event sequence and game version;
- canonical non-empty identifiers;
- exact validated timestamp string;
- exact rules-baseline consistency;
- no missing or extra key;
- no accessor;
- no symbol key;
- no Proxy;
- no cycle;
- no sparse array;
- no nonplain object.

### Exhaustive current event registry

The descriptor-safe T1 dispatcher contains exactly:

```ts
const CURRENT_DOMAIN_EVENT_TYPES = [
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
  "ScheduledTaskSettled",
] as const satisfies readonly DomainEventType[];
```

The implementation includes one registry member for every key of current `DomainEventPayloadByType` and no other member:

```ts
type ExactPayloadValidator = (
  value: unknown,
) => { readonly valid: true } |
  { readonly valid: false };

type PayloadValidatorRegistry = {
  readonly [TEvent in DomainEventType]:
    ExactPayloadValidator;
};

const payloadValidators:
  PayloadValidatorRegistry = {
  GameCreated: validateGameCreatedPayload,
  ScriptSelected: validateScriptSelectedPayload,
  SeamstressResolutionCapabilityDeclared:
    validateSeamstressResolutionCapabilityDeclaredPayload,
  SetupGenerated: validateSetupGeneratedPayload,
  PlayerRosterCreated:
    validatePlayerRosterCreatedPayload,
  CharactersAssigned:
    validateCharactersAssignedPayload,
  PhaseTransitioned:
    validatePhaseTransitionedPayload,
  FirstNightInitialized:
    validateFirstNightInitializedPayload,
  InitialPrivateKnowledgeEstablished:
    validateInitialPrivateKnowledgeEstablishedPayload,
  FirstNightTaskPlanCreated:
    validateFirstNightTaskPlanCreatedPayload,
  FirstNightActionOpportunityCreated:
    validateFirstNightActionOpportunityCreatedPayload,
  PhilosopherActionDeferred:
    validatePhilosopherActionDeferredPayload,
  SeamstressActionDeferred:
    validateSeamstressActionDeferredPayload,
  SeamstressTargetsChosen:
    validateSeamstressTargetsChosenPayload,
  SeamstressAbilitySpent:
    validateSeamstressAbilitySpentPayload,
  SeamstressInformationDelivered:
    validateSeamstressInformationDeliveredPayload,
  PhilosopherAbilityChosen:
    validatePhilosopherAbilityChosenPayload,
  PhilosopherAbilityGranted:
    validatePhilosopherAbilityGrantedPayload,
  AbilityImpairmentApplied:
    validateAbilityImpairmentAppliedPayload,
  FirstNightTaskInserted:
    validateFirstNightTaskInsertedPayload,
  FirstNightTaskInsertedV2:
    validateFirstNightTaskInsertedV2Payload,
  SnakeCharmerTargetChosen:
    validateSnakeCharmerTargetChosenPayload,
  SnakeCharmerDemonSwapApplied:
    validateSnakeCharmerDemonSwapAppliedPayload,
  SnakeCharmerNoSwapResolved:
    validateSnakeCharmerNoSwapResolvedPayload,
  SnakeCharmerIneffectiveResolved:
    validateSnakeCharmerIneffectiveResolvedPayload,
  WitchTargetChosen:
    validateWitchTargetChosenPayload,
  WitchDeathPendingMarked:
    validateWitchDeathPendingMarkedPayload,
  WitchIneffectiveResolved:
    validateWitchIneffectiveResolvedPayload,
  CerenovusChoiceRecorded:
    validateCerenovusChoiceRecordedPayload,
  CerenovusMadnessMarked:
    validateCerenovusMadnessMarkedPayload,
  CerenovusMadnessInstructionDelivered:
    validateCerenovusMadnessInstructionDeliveredPayload,
  DreamerTargetChosen:
    validateDreamerTargetChosenPayload,
  DreamerInformationDelivered:
    validateDreamerInformationDeliveredPayload,
  ClockmakerInformationDelivered:
    validateClockmakerInformationDeliveredPayload,
  MathematicianInformationDelivered:
    validateMathematicianInformationDeliveredPayload,
  EvilTwinPairEstablished:
    validateEvilTwinPairEstablishedPayload,
  EvilTwinInformationDelivered:
    validateEvilTwinInformationDeliveredPayload,
  MinionInformationDelivered:
    validateMinionInformationDeliveredPayload,
  DemonInformationDelivered:
    validateDemonInformationDeliveredPayload,
  ScheduledTaskSettled:
    validateScheduledTaskSettledPayload,
};
```

Validator identifiers above are conceptual adapter names. Each adapter must call the current exact runtime validator for that event payload. If any current event lacks an exact validator that can enforce exact keys at T1, implementation stops and reslices; it must not add a permissive validator.

The registry is compile-time exhaustive against `DomainEventPayloadByType`. Adding a domain event makes the registry fail compilation until a separately authorized design update.

### Only permitted cast

The only raw-to-domain cast is internal and occurs after:

1. descriptor-safe capture;
2. exact envelope-key validation;
3. known `eventType`;
4. exact supported event version;
5. successful registry payload validation;
6. event checksum validation.

It narrows one detached record to its exact `DomainEventEnvelope<TEvent>` member. No collection-wide cast precedes per-event validation.

### Failure behavior

| Failure | Live source | Replay/import source |
|---|---|---|
| unknown event type | preserve accepted store; quarantine game epoch; no handle | preserve raw bytes outside canonical state; quarantine artifact identity; no handle |
| unsupported event version | same | same |
| missing/extra envelope field | same | same |
| invalid payload or exact keys | same | same |
| invalid event checksum | same | same |
| dispatcher reflection failure | same | same |

No event is skipped, downgraded, coerced, defaulted, repaired, or treated as unknown-but-usable.

## Exact canonicalization and hashing

### Accepted values

Canonical tagged-tree input is limited to:

- `null`;
- boolean;
- string;
- safe integer excluding negative zero;
- dense arrays of accepted values;
- plain objects with accepted enumerable data fields and no symbol keys.

Forbidden:

- `Date`;
- `BigInt`;
- `undefined`;
- symbol;
- function;
- accessor;
- Proxy or revoked Proxy;
- cycle;
- sparse array;
- nonplain object;
- non-enumerable declared field;
- array extra property;
- negative zero;
- non-safe or non-integer number.

### Grammar

The grammar is identical to current `canonical-data.ts`:

```text
null       := z
false      := b0
true       := b1
integer    := n<base-10-decimal>;
string     := s<UTF-16-code-unit-length>:<raw-string>
array      := a<count>[<encoded-element-0>...<encoded-element-n>]
object     := o<count>{<encoded-key-0><encoded-value-0>...}
```

Object keys use raw UTF-16 code-unit ordering:

```ts
left < right ? -1 : left > right ? 1 : 0
```

Arrays preserve input order.

There is:

- no Unicode normalization;
- no case normalization;
- no `localeCompare`;
- no `Intl.Collator`;
- no environment locale;
- no time-zone conversion;
- no date parsing;
- no timestamp reformatting.

Strings and timestamps hash byte-for-byte after their existing validators accept the exact string.

The encoded tagged-tree string becomes UTF-8 bytes through WHATWG `TextEncoder`. SHA-256 output is lowercase exactly 64 hexadecimal characters.

### Raw replay format

Approved replay input is:

- raw bytes;
- strict UTF-8;
- JSON;
- duplicate-key-rejecting parser;
- exact root shape;
- no UTF-8 BOM;
- no bytes before the root;
- no whitespace or other bytes after the root;
- no permissive comments, trailing comma, `NaN`, or infinity.

The approval SHA-256 covers the exact raw bytes before decoding or parsing.

After parsing and descriptor-safe capture, parsed bundle digests use the tagged-tree grammar.

### Frozen digest inputs

All digest inputs are tagged-tree arrays. Field order is exactly:

```text
EventChecksumInput :=
[
  "trusted-history-event-v1",
  exactEventEnvelope
]
```

```text
BatchChecksumInput :=
[
  "trusted-history-batch-v1",
  batchId,
  commandId,
  gameVersion,
  firstEventSequence,
  lastEventSequence,
  eventCount,
  orderedEventIds,
  orderedEventChecksums
]
```

```text
ReceiptChecksumInput :=
[
  "trusted-history-receipt-v1",
  gameId,
  commandId,
  committedGameVersion,
  exactAcceptedReceipt
]
```

```text
JournalChecksumInput :=
[
  "trusted-history-journal-v1",
  gameId,
  rulesBaselineVersion,
  firstEventSequence,
  finalEventSequence,
  finalGameVersion,
  orderedEventChecksums,
  orderedBatchChecksums,
  orderedReceiptChecksums
]
```

```text
BundleChecksumInput :=
[
  "trusted-history-bundle-v1",
  bundleVersion,
  canonicalizationVersion,
  sourceKind,
  sourceIdentity,
  sourceRevision,
  gameId,
  rulesBaselineVersion,
  exactEvents,
  exactReceipts,
  exactEventChecksumRecords,
  exactBatchChecksumRecords,
  journalSha256,
  nullableSnapshotRecord
]
```

```text
CanonicalStateChecksumInput :=
[
  "trusted-history-canonical-state-v1",
  gameId,
  rulesBaselineVersion,
  gameVersion,
  lastEventSequence,
  exactEventOnlyRebuiltGameState
]
```

```text
AuthorityBindingInput :=
[
  "trusted-history-authority-binding-v1",
  gameId,
  rulesBaselineVersion,
  gameVersion,
  lastEventSequence,
  journalSha256,
  canonicalStateSha256
]
```

Source authority hash is the SHA-256 of `AuthorityBindingInput`.

Snapshot data is excluded from:

- journal source authority;
- canonical event source authority;
- authority binding.

Snapshot has its own relation fields and canonical state hash only.

## Opaque handle contract

### Construction

Both handle kinds are created exactly:

```ts
const handle = Object.freeze(Object.create(null));
```

Each handle has:

- null prototype;
- zero own string keys;
- zero own symbol keys;
- no visible brand;
- no visible game, version, epoch, generation, state, or metadata.

### Private runtime state

```ts
type HistoryHandleRecord = {
  readonly runtimeId: TrustedHistoryRuntimeId;
  readonly gameId: GameId;
  readonly sourceEpoch: AuthorityEpoch;
  readonly generation: AggregateGeneration;
  readonly finalGameVersion: number;
  readonly finalEventSequence: number;
  readonly journalSha256: Sha256Hex;
};

type StateHandleRecord = {
  readonly runtimeId: TrustedHistoryRuntimeId;
  readonly historyHandle: object;
  readonly gameId: GameId;
  readonly sourceEpoch: AuthorityEpoch;
  readonly generation: AggregateGeneration;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly authorityBindingSha256: Sha256Hex;
  readonly state: GameState;
};

const issuedHistoryHandles = new WeakSet<object>();
const historyByHandle =
  new WeakMap<object, HistoryHandleRecord>();

const issuedStateHandles = new WeakSet<object>();
const stateByHandle =
  new WeakMap<object, StateHandleRecord>();
```

The runtime also owns:

```ts
const currentEpochByGame = new Map<GameId, AuthorityEpoch>();
const currentGenerationByGame =
  new Map<GameId, AggregateGeneration>();
const runtimeStatusByGame =
  new Map<GameId, TrustedHistoryRuntimeStatus>();
const exactStateCacheByHistory =
  new WeakMap<object, Map<number, object>>();
const currentStateCacheByHistory =
  new WeakMap<object, {
    readonly generation: AggregateGeneration;
    readonly handle: object;
  }>();
```

### Runtime ID

`runtimeId` is a private zero-field object identity created during runtime construction. It is not a string, timestamp, UUID, persisted ID, or caller value.

### Public API shape

Authority APIs take the candidate handle as the direct first positional argument:

```ts
rebuildCanonicalGameStateAtVersion(
  historyHandle: unknown,
  queryGameVersion: number | "CURRENT",
): CanonicalStateResult
```

Future P2:

```ts
resolveEffectiveConditionsAtGameVersion(
  canonicalStateHandle: unknown,
  playerId: PlayerId,
): EffectiveConditionResolution
```

### Validation order

1. primitive/null exclusion;
2. `WeakSet.has(candidate)`;
3. private `WeakMap.get(candidate)`;
4. private `runtimeId` identity comparison;
5. private game epoch comparison;
6. private runtime status check;
7. only then private record use.

No caller property, key, descriptor, prototype, iterator, stringification, or serialization is inspected.

Getter invocation count is zero.

### Epoch and revocation

No public revoke functions exist.

Per-game epoch increments only on:

- runtime integrity failure;
- post-commit authority quarantine;
- explicit package-internal dispose;
- package-internal authority replacement.

Epoch mismatch logically invalidates all history and state handles for the prior epoch. WeakMaps do not need enumeration.

Authority quarantine, replacement, or dispose revokes:

- all history handles for that game and prior epoch;
- all dependent state handles;
- all `CURRENT` cache entries;
- all exact-version cache entries for invalid source epochs.

### Historical validity

An exact-version historical state handle remains valid across later successful journal generations when:

- the game remains in the same authority epoch;
- runtime status remains `ACTIVE`;
- its source history handle remains valid;
- no quarantine, replacement, or dispose occurs.

Later commits do not mutate historical handles.

### CURRENT cache

`CURRENT` cache binds to one history handle and exact generation. Generation advance invalidates the prior `CURRENT` cache entry. A new `CURRENT` query rebuilds or returns the handle for the new generation.

### Exact-version cache

Exact-version cache binds to:

- issued history-handle identity;
- exact game version;
- source epoch.

Cache eviction alone does not revoke an already-issued exact-version handle. A later rebuild may issue a distinct semantically equivalent handle.

### Cross-command and cross-runtime behavior

- Same-command idempotent retry never advances generation twice.
- Conflicting command reuse quarantines authority if observed after accepted-store success.
- Cross-runtime handles fail `INVALID_HISTORY_AUTHORITY` or `AUTHORITY_REVOKED`.
- Cross-game handles fail.
- Clones, spreads, JSON values, fake brands, fake constructors, and Proxy wrappers fail.
- Process restart invalidates every handle.

### Recovery

Current restart recovery is unsupported.

Old events can receive new authority only when:

- an active live runtime still holds complete accepted journal evidence; or
- a future approved raw replay artifact exists.

The current store cannot enumerate complete receipts, so it cannot reissue authority after restart.

## Candidate validation-only seam

### Purpose

Hostile and snapshot evidence uses:

```ts
validateCandidateWithoutIssuance(
  candidate: unknown,
): CandidateValidationResult
```

This T1 seam:

- runs descriptor-safe capture;
- runs exhaustive dispatch;
- runs relation, checksum, snapshot, typed replay, and rebuild validation as applicable;
- returns failure codes and diagnostic digests;
- never issues a history handle;
- never issues a state handle;
- never registers authority;
- never exposes canonical `GameState`;
- never mutates live runtime state;
- never accepts caller authority metadata.

### Real accepted base

Every gating hostile base begins with:

1. a real successful `GameApplicationService` command;
2. a real `CommandCommitStore` decorated by `createTrustedHistoryCommandCommitStore`;
3. the exact accepted events, receipt, and persisted batch observed after inner commit success;
4. package-internal serialization/detachment of that accepted material.

A package-internal test fixture builder may serialize and detach accepted material. It cannot:

- register a journal;
- register a handle;
- issue a handle;
- set an epoch;
- bypass the decorator;
- construct an accepted receipt manually;
- claim replay approval.

### Mutation rule

Each hostile artifact is a detached clone with exactly one semantic mutation.

Supporting digests may be recomputed only when required to pass earlier layers and reach the intended rejection layer. The traceability record must state:

- the one semantic mutation;
- every recomputed supporting digest;
- why recomputation is required;
- the intended failure code.

Recomputed hashes never establish authority.

## Hostile and snapshot evidence matrix

| Artifact group | Base authority | One semantic mutation | Permitted supporting recomputation | Required failure |
|---|---|---|---|---|
| event checksum corruption | real accepted decorated-store capture | change one event checksum | none | `EVENT_CHECKSUM_MISMATCH` |
| event payload corruption reaching checksum layer | real accepted capture | change one payload field | event checksum only when the target is later payload/rebuild validation and the mutation is recorded | `INVALID_EVENT_PAYLOAD` or declared later invariant |
| batch membership mutation | real accepted capture | move/remove/duplicate one event relative to one batch | event checksums may remain; batch and journal digests may be recomputed only to reach membership validation | `INVALID_BATCH_MEMBERSHIP` |
| batch boundary checksum mutation | real accepted capture | alter one boundary/count/order field | none when checksum is target | `BATCH_CHECKSUM_MISMATCH` |
| game-version mutation | real accepted capture | alter one batch/event version | upstream digests may be recomputed only to reach semantic version validation | `INVALID_GAME_VERSION` |
| rebuilt-version mutation path | real accepted capture | produce one internally consistent earlier structure whose rebuild boundary contradicts declared version | all supporting digests required to reach rebuild | `REBUILT_VERSION_MISMATCH` |
| snapshot state mutation | snapshot-absent accepted base plus synthetic present snapshot candidate for validation-only seam | alter one snapshot state field | snapshot state digest may remain stale when checksum is target; may be recomputed only to reach equality check | `SNAPSHOT_STATE_MISMATCH` |
| snapshot relation mutation | same validation-only base | alter one sequence/version/prefix relation | snapshot state digest may be recomputed if unrelated | `SNAPSHOT_RELATION_MISMATCH` |
| history handle epoch damage | one real issued history handle | increment the private game epoch through quarantine or authority replacement | none | `AUTHORITY_REVOKED` |
| cross-runtime history handle | one real issued handle from runtime A | present it to runtime B | none | `INVALID_HISTORY_AUTHORITY` |
| state handle epoch damage | one real issued state handle | increment its game epoch through quarantine or replacement | none | `AUTHORITY_REVOKED` |

Fake objects are additional H2 rejection inputs, but authority-metadata damage evidence must use a real issued handle after epoch change or cross-runtime presentation.

### Snapshot reachability

- snapshot-absent positive: `R1`, gating;
- snapshot-present positive producer: `R4`, non-gating, because the current repository has no snapshot producer;
- snapshot-present hostile candidate: `R3`, gating through the non-issuing validation seam.

P2F does not create a snapshot producer.

### Replay approval reachability

The approved replay registry is empty.

- approved replay positive: `R2`, deferred, non-gating;
- external/import hostile validation: `R3`, gating through the non-issuing seam;
- deep R3 validation never uses fake approval or fake authority.

## Replay approval artifact

### Exact record

```ts
type ApprovedLegacyReplayArtifact = {
  readonly registryVersion:
    "trusted-history-replay-registry-v1";
  readonly approvalId: string;
  readonly artifactId: string;
  readonly artifactRevision: string;
  readonly artifactPurpose:
    "LEGACY_REPLAY_COMPATIBILITY";
  readonly compatibilityPromiseId: string;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly rawByteLength: number;
  readonly rawBytesSha256: Sha256Hex;
  readonly approvedAt: string;
  readonly approvalSourceRevision: string;
};
```

The runtime registry is immutable and package-internal.

No record currently exists.

A current R1 live history cannot be copied or relabeled into this registry. A future record requires explicit artifact approval and a fresh design review.

## C19 disposition

### C19-A

```text
R2 / T1 / LEGACY_REPLAY_COMPATIBILITY
```

Status: `DEFERRED_NON_GATING_NO_APPROVED_R2_ARTIFACT`.

It has no positive producer in this Slice. No fake R2 is permitted.

### C19-B

```text
R1 / T2 / PURE_POLICY_SEAM
```

Status: `FUTURE_P2_HANDOFF_ONLY`.

P2F issues canonical-state authority but implements no effective-condition behavior. C19-A and C19-B remain separate primary criteria.

## C20 disposition

- H1: `R3 / T1 / HOSTILE_REPLAY_REJECTION`.
- H2: `R3 / T1 / STRUCTURAL_VALIDATION`.
- H3: `R3 / T1 / HOSTILE_REPLAY_REJECTION`.

No row combines R1 and R3.

## Supporting Authority

`SUP-2B20B-P1-011` remains immutable:

| Field | Value |
|---|---|
| AuthorityStatus | `ACCEPTED` |
| Historical P1 purpose | unchanged |
| P2F applicability | `NOT_APPLICABLE` |
| P2 applicability | `NOT_APPLICABLE` |
| POISONED authority | `FORBIDDEN` |
| P2F primary authority | `FORBIDDEN` |
| Status rewrite | `FORBIDDEN` |

`NOT_APPLICABLE` is scope, not status. SUP-2B20B-P1-011 cannot support POISONED, P2F authority, replay approval, a handle, or a semantic primary.

## Consumer policy

### Permitted package-internal consumers

- the command-store decorator;
- the unique authority runtime;
- canonicalization and dispatch submodules;
- replay admission submodule;
- package-internal P2F tests;
- a future separately reviewed P2 consumer through the positional handle API.

### Forbidden consumers

- `GameApplicationService` business logic;
- application business commands;
- package-index callers;
- UI;
- player or AI views;
- public, private, or Storyteller projections;
- Dreamer or other role resolvers in this Slice;
- event payloads;
- receipts;
- snapshot payloads;
- serialization/export as authority;
- LLM inputs.

Projection code must never consume a handle directly. A future reviewed canonical policy may derive already privacy-bounded data, but the handle and private canonical state never cross the projection boundary.

## Dependency direction

```text
CommandCommitStore inner implementation
  -> internal trusted-history command-store decorator
  -> unique TrustedHistoryAuthorityRuntime
  -> internal event-dispatch/canonicalization/replay submodules
  -> existing domain-core pure validators, stream validation,
     batch semantics, and rebuild
```

Forbidden:

- domain core importing application authority;
- domain core issuing/registering handles;
- application business service importing authority runtime;
- projections importing authority;
- replay registry importing role behavior;
- tests exporting issuer hooks;
- package index exporting any P2F submodule.

## Migration and compatibility

- no event migration;
- no payload migration;
- no receipt migration;
- no snapshot migration;
- no store migration;
- no handle serialization;
- no replay rewrite;
- no role coverage change;
- no accepted behavior change.

Existing events remain replayable through current typed replay. They obtain P2F authority only from a complete active live journal or a future approved artifact.

Restart invalidates all handles. Current-store restart recovery remains unsupported.

## Rollback

Future rollback removes only the internal decorator/runtime/dispatch/canonicalization/replay modules, their new tests, and P2F traceability documentation.

Because no schema, persisted state, event, receipt, snapshot, business command, or projection changes, rollback requires no data rewrite. All process-local authority disappears.

## Exact future implementation allowlist

This allowlist is dormant until an independent design pass and explicit implementation authorization.

### Production — new files only

1. `packages/application/src/trusted-history/trusted-history-authority.ts`
2. `packages/application/src/trusted-history/trusted-history-command-store-decorator.ts`
3. `packages/application/src/trusted-history/trusted-history-event-dispatch.ts`
4. `packages/application/src/trusted-history/trusted-history-canonicalization.ts`
5. `packages/application/src/trusted-history/trusted-history-replay.ts`

### Tests — new files only

- corresponding `packages/application/src/trusted-history/*.test.ts` files.

### Documentation

- `docs/implementation/phase-3-slice-2b20b-p2f-test-traceability.md`;
- this correction and separately authorized required P2F control documentation.

### Forbidden files

No existing file may change, including:

- `GameApplicationService`;
- domain-core source or exports;
- application package index or exports;
- existing command-store interfaces/implementations;
- Dreamer;
- role modules;
- application business commands;
- projections;
- No Dashii;
- POISONED behavior;
- event or payload schemas;
- receipts;
- snapshots;
- workflow;
- coverage profiles;
- dependencies;
- timeouts.

Future production estimate:

- at most five production files;
- at most `1800` added production lines.

Stop and reslice if:

- production additions exceed `2000` lines;
- any existing production file becomes necessary;
- any business behavior or event/schema change becomes necessary;
- any sixth production file becomes necessary.

There are no open reviewer or implementer choices inside the allowlist.

## Design-time Governance Traceability V1.1

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `P2F-CR1-F01_UNIQUE_ISSUER_LIVE_CAPTURE` | One application runtime is the only authority issuer and observes real accepted commits through a decorator | Real `GameApplicationService` command succeeds through decorated store; exact committed batch and receipt reach the unique runtime after inner success; no business-service change | Real formal command through internal decorated `CommandCommitStore` | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | one journal generation captured; no second issuer or public registration path | real accepted command, events, receipt, and persisted batch |
| `P2F-CR1-F02_POST_COMMIT_QUARANTINE` | Authority failure after accepted commit must not alter the application result or accepted history | Inject one capture/checksum failure after inner success; exact success result returns; epoch increments; game becomes quarantined; handles invalidate; retry returns existing receipt without healing | Real successful application command with package-internal post-commit failure injection | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | no throw, rollback, reclassification, duplicate append, or silent recovery | original accepted transaction is support |
| `P2F-CR1-F03_IDEMPOTENT_RETRY` | Same-command retry never duplicates journal history or repairs quarantine | Real command is retried after successful capture and after quarantine | Formal retry through decorated store | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | existing receipt returned; generation unchanged; quarantine persists when present | accepted receipt and command fingerprint |
| `P2F-CR1-F04_UNKNOWN_EXACT_ENVELOPE` | Unknown values must satisfy exact envelope shape before type dispatch | Every exact envelope key, literal, ID, integer, and version is validated descriptor-safely | Validation-only T1 candidate seam over detached real accepted material | `R3` | `T1` | `STRUCTURAL_VALIDATION` | missing/extra/accessor/symbol/proxy/cycle/sparse/nonplain rejects; zero getters | real accepted detached base; no authority issuance |
| `P2F-CR1-F05_EXHAUSTIVE_PAYLOAD_DISPATCH` | Every current event type has one exact payload validator and unknown types never downgrade | Registry is exhaustive for all listed current event types at version 1; only post-validation per-event cast exists | Compile-time exhaustive registry plus validation-only hostile candidates | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact payload passes; unknown type/version or invalid payload rejects | current `DomainEventPayloadByType` and existing exact validators |
| `P2F-CR1-F06_LIVE_HISTORY_ADMISSION` | Complete live accepted history must reconcile command, receipt, append, checksums, typed replay, and rebuild before issuance | One real decorated-store history passes every stage and receives one zero-field history handle | End-to-end accepted command journal admission and event-only rebuild | `R1` | `T1` | `ACCEPTED_STREAM_INTEGRATION` | handle issued only after complete journal and canonical rebuild | real command, receipt, events, append, checksums, rebuild |
| `P2F-CR1-F07_STATE_HANDLE_ISSUANCE` | Canonical state authority binds one complete version of one admitted history | Positional history identity, epoch, exact prefix, typed validation, batch semantics, rebuild, checksums, and authority binding pass | Admitted live history rebuilt at exact committed version | `R1` | `T1` | `ACCEPTED_STREAM_INTEGRATION` | zero-field state handle issued with private backing only | authentic live history handle |
| `P2F-CR1-F08_CANONICALIZATION_CROSS_PLATFORM` | Canonical tagged-tree bytes and all frozen digests are platform-independent | Identical canonical fixtures produce identical encoding and lowercase SHA-256 on Linux and Windows | Frozen canonicalization vectors executed on required OS matrix | `R1` | `T3` | `CROSS_PLATFORM_CI` | byte-for-byte encodings and digests match | tagged-tree grammar and TextEncoder contract |
| `P2F-CR1-F09_HISTORICAL_HANDLE_VALIDITY` | Exact-version handles remain valid across later generations in the same active epoch | Issue exact-version handle, append later successful command, then reuse historical handle | Pure private lifecycle policy over real issued handles | `R1` | `T2` | `PURE_POLICY_SEAM` | historical handle remains valid; CURRENT cache advances | authentic same-epoch handles |
| `P2F-CR1-F10_EPOCH_REVOCATION` | Quarantine, replacement, or dispose logically revokes all dependent authority | Issue real history/state handles, increment game epoch through internal quarantine, then present old handles | Pure epoch and private-record policy over real issued handles | `R1` | `T2` | `PURE_POLICY_SEAM` | old handles return `AUTHORITY_REVOKED`; no WeakMap enumeration required | authentic handles; no fake object |
| `P2F-CR1-F11_SNAPSHOT_ABSENT_POSITIVE` | Snapshot absence preserves event authority | Real live journal with no snapshot completes admission and state rebuild | Formal command, decorated store, null snapshot, event-only rebuild | `R1` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | history/state handles issue without snapshot | real accepted live history |
| `P2F-CR1-C19A_APPROVED_R2_REPLAY` | Positive legacy replay requires a genuine immutable approved artifact | Exact approval record and raw bytes exist and pass full admission | Approved raw-byte legacy replay registry admission | `R2` | `T1` | `LEGACY_REPLAY_COMPATIBILITY` | `DEFERRED_NON_GATING_EMPTY_APPROVAL_REGISTRY` | no current R1 substitute permitted |
| `P2F-CR1-C19B_FUTURE_P2_HANDOFF` | Effective-condition derivation remains a future pure consumer | Future P2 receives private T2 state only after authentic state-handle validation | Pure future condition seam over issued authority | `R1` | `T2` | `PURE_POLICY_SEAM` | handoff frozen; no P2 behavior implemented here | future P2 evidence only |
| `P2F-CR1-H1_EVENT_CHECKSUM` | Event corruption must reject before authority | Clone real accepted material and mutate one event checksum | Validation-only candidate seam with one checksum mutation | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | `EVENT_CHECKSUM_MISMATCH`; no handle | real accepted detached base |
| `P2F-CR1-H1_BATCH_MEMBERSHIP` | Batch membership and boundary corruption must reject | Clone real accepted material and apply one membership/boundary mutation with declared supporting recomputation | Validation-only candidate seam with one batch semantic mutation | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | `INVALID_BATCH_MEMBERSHIP` or `BATCH_CHECKSUM_MISMATCH` | real accepted detached base and recorded recomputations |
| `P2F-CR1-H1_GAME_VERSION` | Game-version corruption must reject | Clone real accepted material and mutate one declared version relation | Validation-only candidate seam with one version mutation | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | `INVALID_GAME_VERSION` or `REBUILT_VERSION_MISMATCH` | real accepted detached base and recorded recomputations |
| `P2F-CR1-H1_DESCRIPTOR_GRAPH` | Hostile object graphs must fail closed without getter invocation | Proxy, revoked Proxy, accessor, symbol, cycle, sparse array, and nonplain variants enter T1 seam | Validation-only descriptor-safe capture | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | exact rejection; getter count zero | real accepted content transformed into one hostile graph |
| `P2F-CR1-H2_HANDLE_AUTHORITY` | Fake, cross-runtime, and revoked handles never reach private state | Present zero-field lookalikes, clones, real cross-runtime handle, and real post-epoch handle | Direct positional handle authority boundary | `R3` | `T1` | `STRUCTURAL_VALIDATION` | fake/cross-runtime returns `INVALID_HISTORY_AUTHORITY`; epoch damage returns `AUTHORITY_REVOKED`; zero getters | real issued handle required for authority-metadata cases |
| `P2F-CR1-H3_IMPORTED_REPLAY` | Unapproved or altered raw replay never receives authority | Empty approval, unknown ID, byte SHA, strict JSON, self-signed bundle, and altered-content cases enter non-issuing seam | Raw-byte replay rejection and validation-only deep candidate seam | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | no handle; exact replay failure code | empty immutable registry; no fake approval |
| `P2F-CR1-SNAPSHOT_PRESENT_HOSTILE` | Supplied snapshot can never override events | Attach one snapshot state or relation mutation to real event history | Validation-only candidate seam with one snapshot mutation | `R3` | `T1` | `HOSTILE_REPLAY_REJECTION` | `SNAPSHOT_STATE_MISMATCH` or `SNAPSHOT_RELATION_MISMATCH` | snapshot-absent real base; present positive remains non-gating |
| `P2F-CR1-SUP011_SCOPE` | Historical P1 support cannot become P2F or POISONED authority | Preserve status and record P2F/P2 applicability as not applicable | Immutable supporting-authority inspection | `R4` | `T3` | `STRUCTURAL_VALIDATION` | status remains ACCEPTED; no P2F/POISONED use | `SUP-2B20B-P1-011` historical record only |

Every row has one reachability class, one trust class, one primary layer, and an explicit supporting-authority requirement.

## Verification strategy

Future implementation, only after separate authorization, must prove:

1. real `GameApplicationService` command through the decorator;
2. exact accepted batch, receipt, and persistence result;
3. post-commit no-throw quarantine;
4. idempotent retry without duplicate append or healing;
5. exhaustive event registry parity with `DomainEventPayloadByType`;
6. descriptor-safe zero-getter behavior;
7. event/batch/receipt/journal/bundle/state/binding digests;
8. event-only rebuild;
9. null snapshot positive;
10. snapshot-present hostile rejection;
11. zero-field handle invariants;
12. cross-runtime and epoch invalidation using real handles;
13. historical exact-version validity across generation advance;
14. CURRENT cache invalidation;
15. empty replay registry positive remains deferred;
16. deep import hostility through the non-issuing seam;
17. package-index export absence;
18. no existing file change;
19. production additions within `1800` estimated lines and never above `2000`;
20. Linux and Windows canonicalization equality.

## Stop-loss

Stop and reslice if:

- more than one runtime can issue authority;
- domain core must issue or register handles;
- `GameApplicationService` must change;
- an existing production file must change;
- a sixth production file is required;
- production additions exceed `2000` lines;
- post-commit capture failure must alter the accepted result;
- accepted events or receipt must roll back;
- idempotent retry must heal quarantine;
- current-store restart recovery must be claimed;
- any raw event is cast before exact envelope and payload validation;
- any current event lacks an exact validator;
- unknown event/type/version/payload can skip or downgrade;
- canonicalization differs from the frozen grammar;
- timestamps require date/time-zone normalization;
- snapshot contributes to source authority;
- handle contains an own key;
- any public revoke/register/issue/hydrate/test authority API is required;
- epoch invalidation requires enumerating WeakMaps;
- fake handles replace real issued handle evidence;
- fake replay approval is needed;
- current R1 history is labeled R2;
- snapshot-present positive is made gating;
- P2F must implement P2, POISONED, No Dashii, Vigormortis, Dreamer, a projection, or an Effect Engine;
- an event, payload, receipt, snapshot, workflow, profile, dependency, or business behavior changes;
- the independent reviewer does not return the protocol-defined passing verdict.

## Closed design decisions

The following are final for this correction and are not left to reviewer or implementer discretion:

- unique issuer: application package-internal `TrustedHistoryAuthorityRuntime`;
- live integration: internal `CommandCommitStore` decorator;
- business service modification: forbidden;
- package-index export: forbidden;
- post-commit failure: accepted result preserved, authority quarantined;
- quarantine recovery: authority replacement only, never retry healing;
- snapshot failure: cache rejected/ignored, event authority retained when otherwise complete;
- restart recovery: unsupported;
- event dispatch: exhaustive exact registry, version `1`;
- raw-to-typed cast: one per event after full exact validation;
- canonicalization: frozen tagged-tree and WHATWG `TextEncoder`;
- source authority: journal digest plus event-only canonical-state digest;
- snapshot contribution to source authority: none;
- handle shape: frozen zero-field null-prototype object;
- authority validation: WeakSet identity before caller property access;
- revocation: private epoch-based cascading invalidation;
- exact historical validity: survives later generation within same epoch;
- CURRENT cache: generation-bound;
- cache eviction: does not revoke issued exact-version handle;
- hostile base: real accepted command through real decorator;
- hostile seam: validation-only and non-issuing;
- snapshot-present positive: R4 non-gating;
- approved replay positive: R2 deferred non-gating with empty registry;
- future implementation: exactly five new production files, no existing file changes;
- open reviewer decisions: none;
- open implementer decisions: none.

## Design-review checklist

The independent reviewer must verify:

- exact authorization and parent SHA;
- all seven prior blockers are closed;
- one application runtime is the only issuer;
- domain core remains pure and non-issuing;
- decorator captures only after inner commit success;
- application success is preserved after post-commit journal failure;
- quarantine increments epoch and blocks issuance without rollback;
- retries never duplicate or heal;
- snapshot failure remains cache-only;
- restart recovery is explicitly unsupported;
- all current event names are present exactly once;
- registry is exhaustive and exact-versioned;
- no cast precedes exact envelope/payload/checksum validation;
- canonical grammar and all digest inputs are fully frozen;
- raw replay is strict UTF-8 JSON with duplicate-key rejection and exact raw-byte approval SHA;
- snapshot is excluded from source authority;
- handles have zero own keys and private WeakSet/WeakMap authority;
- public APIs check positional identity before caller property access;
- lifecycle, epoch, generation, cache, cross-command, revocation, and restart rules are closed;
- projections cannot consume handles directly;
- real R2 artifact is absent and no R1 relabeling occurs;
- C19-A and C19-B remain separate;
- H1, H2, and H3 use their exact classifications;
- hostile authority metadata evidence uses real issued handles;
- snapshot-present positive and replay-positive paths remain non-gating;
- SUP-2B20B-P1-011 remains historically ACCEPTED and not applicable;
- traceability has exactly the nine required design-time fields and legal primary layers;
- future allowlist is five new application files only;
- there are no open reviewer or implementer decisions;
- implementation remains unauthorized.

## Design disposition

- ruleVerdict: `RULE_READY`
- designReviewStatus: `NOT_REVIEWED`
- architectRecommendation: `SUBMIT_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`
- architectRecommendationIsReviewerVerdict: `false`
- sevenPriorBlockersClosedByDesign: `true`
- implementationAuthorized: `false`
- productionFilesChanged: `0`
- testFilesChanged: `0`
- openReviewerDecisions: `0`
- openImplementerDecisions: `0`
- requiredNextAction: `INDEPENDENT_RULE_DESIGN_REVIEW_P2F_CORRECTION_ROUND_1`

`READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW_P2F_CORRECTION_ROUND_1`
