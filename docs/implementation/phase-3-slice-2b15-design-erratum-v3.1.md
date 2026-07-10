# Seamstress vertical slice — corrected v3.1 erratum (complete replacement)

This document replaces the earlier v3.1 erratum in full. It changes only the capability literal, Seamstress accepted-result disclosure, and shared receipt-idempotency contract. All previously reviewed rule semantics, canonical event payloads/order, settlement behavior, and modifier behavior remain unchanged. The architect made no repository edits.

## 1. Capability literal: exact repository value

Every Seamstress capability payload and fixture MUST use:

```ts
export const SUPPORTED_SCRIPT_ID = "sects-and-violets" as const;
```

The capability creator MUST reference `SUPPORTED_SCRIPT_ID`; it MUST NOT repeat a second literal. Validation MUST require strict equality with the canonical preceding `ScriptSelected.payload.scriptId`. Do not trim, case-fold, Unicode-normalize, or accept underscore/alias spellings. `sects_and_violets`, case variants, padded strings, normalization variants, and any other mismatch fail application validation, prospective batch validation, and replay validation.

## 2. Accepted-result contract: exact type/count summary, scoped to Seamstress

Do not redact selected payload fields. Add a reusable accepted-summary variant, but emit it in this slice only for every accepted `SubmitSeamstressAction` path: V1/V2 DEFER and V2 choice, for every actor/modifier. Existing non-Seamstress commands retain their full-event accepted result.

Use `number` for game versions; this repository has no `GameVersion` brand and this erratum does not authorize one.

```ts
export const ACCEPTED_EVENT_SUMMARY_RESULT_VERSION =
  "accepted-event-summary-v1" as const;

export type FullEventCommandAccepted = {
  readonly status: "accepted";
  readonly gameId: GameId;
  readonly gameVersion: number;
  readonly events: readonly AnyDomainEventEnvelope[];
  readonly idempotent: boolean;
  readonly resultSchemaVersion?: never;
  readonly eventDisclosure?: never;
  readonly eventCount?: never;
  readonly eventTypes?: never;
};

export type EventSummaryCommandAccepted = {
  readonly status: "accepted";
  readonly resultSchemaVersion: "accepted-event-summary-v1";
  readonly eventDisclosure: "EVENT_TYPES_ONLY";
  readonly gameId: GameId;
  readonly gameVersion: number;
  readonly eventCount: number;
  readonly eventTypes: readonly DomainEventType[];
  readonly idempotent: boolean;
  readonly events?: never;
};

export type CommandAccepted =
  | FullEventCommandAccepted
  | EventSummaryCommandAccepted;
```

The summary constructor MUST create exactly these enumerable keys, in this order:

```text
status
resultSchemaVersion
eventDisclosure
gameId
gameVersion
eventCount
eventTypes
idempotent
```

It MUST NOT create an `events` property, including one whose value is `undefined`.

The accepted V2 choice summary is exactly:

```ts
{
  status: "accepted",
  resultSchemaVersion: "accepted-event-summary-v1",
  eventDisclosure: "EVENT_TYPES_ONLY",
  gameId,
  gameVersion: batch.committedGameVersion,
  eventCount: 4,
  eventTypes: [
    "SeamstressTargetsChosen",
    "SeamstressAbilitySpent",
    "SeamstressInformationDelivered",
    "ScheduledTaskSettled",
  ],
  idempotent: false,
}
```

The accepted DEFER summary is exactly:

```ts
{
  status: "accepted",
  resultSchemaVersion: "accepted-event-summary-v1",
  eventDisclosure: "EVENT_TYPES_ONLY",
  gameId,
  gameVersion: batch.committedGameVersion,
  eventCount: 2,
  eventTypes: [
    "SeamstressActionDeferred",
    "ScheduledTaskSettled",
  ],
  idempotent: false,
}
```

These are the canonical literals; there are no generic placeholders and no fallback spelling. V2 choice keeps the same four public types under every reliability, registration, impairment, Vortox, constraint, or simulation branch. No event payload, delivered fact, correct/delivered answer, truth value, reliability, registration, effectiveness, constraint, simulation reason, target, role, or internal evaluation data may enter the summary.

Full canonical envelopes remain unchanged in `DomainEventBatch.events`. `CommitAcceptedCommandInput` continues to carry that full batch separately from the receipt result. Before atomic commit, the store MUST validate:

```ts
summary.eventCount === eventBatch.events.length
summary.eventTypes.length === eventBatch.events.length
summary.eventTypes.every(
  (eventType, index) => eventType === eventBatch.events[index]?.eventType
)
```

An idempotent retry returns the stored summary with only `idempotent` changed to `true`; it neither reconstructs nor exposes events. Tests/internal consumers needing canonical payloads read the event store by command/batch ID. A global conversion of other accepted results is deferred and unauthorized.

## 3. Exact structural command identity; SHA-256 is not equality

Structural equivalence is defined at the application object boundary, not by transport bytes. JSON whitespace, original object-property insertion order, and an upstream serializer's byte representation are not identity inputs.

At `execute` entry, capture the entire `SupportedCommandEnvelope` once from own property descriptors into an immutable deep plain-data snapshot. Use that same snapshot for canonicalization and every later command read. Include all envelope fields — `commandId`, `gameId`, `expectedGameVersion`, `actor`, `issuedAt`, `correlationId`, and `payload` — plus every extra own enumerable data field.

Canonical tagged nodes are exactly:

```text
null                         -> ["NULL"]
undefined                    -> ["UNDEFINED"]
boolean                      -> ["BOOLEAN", value]
string                       -> ["STRING", exactValue]
safe integer except -0       -> ["INTEGER", String(value)]
dense array                  -> ["ARRAY", [childNode, ...]]
plain object                 -> ["OBJECT", [[key, valueNode], ...]]
```

Plain objects have prototype `Object.prototype` or `null`. Their own string keys are sorted with exact UTF-16 code-unit comparison:

```ts
const compareCodeUnits = (left: string, right: string): number =>
  left === right ? 0 : left < right ? -1 : 1;
```

Arrays preserve element order and may contain only dense own index data properties plus the standard non-enumerable `length`. Reject holes, array accessors, and extra array keys. Reject object accessors, non-enumerable custom fields, symbol keys/values, functions, bigint, unsafe/non-integer numbers, negative zero, non-plain objects, and cycles. A repeated acyclic reference is represented by value at each occurrence. Distinguish an absent field from an own field whose value is `undefined`. Do not use locale, `localeCompare`, `Intl.Collator`, time, or randomness.

Serialize the tagged root with `JSON.stringify` and no whitespace. This produced string is the exact authoritative canonical command representation.

Use these exact constants and type:

```ts
export const COMMAND_FINGERPRINT_SCHEMA_VERSION =
  "supported-command-structural-fingerprint-v1" as const;
export const COMMAND_CANONICALIZATION_ALGORITHM =
  "plain-data-tagged-tree-code-unit-keys-v1" as const;
export const COMMAND_FINGERPRINT_DIGEST_ALGORITHM = "SHA-256" as const;
export const COMMAND_FINGERPRINT_DIGEST_HEX_LENGTH = 64 as const;

export type CommandFingerprint = {
  readonly schemaVersion:
    typeof COMMAND_FINGERPRINT_SCHEMA_VERSION;
  readonly canonicalizationAlgorithm:
    typeof COMMAND_CANONICALIZATION_ALGORITHM;
  readonly canonicalCommandJson: string;
  readonly canonicalCommandJsonUtf8ByteLength: number;
  readonly digestAlgorithm:
    typeof COMMAND_FINGERPRINT_DIGEST_ALGORITHM;
  readonly digestHex: string;
};
```

The constructor creates exactly these enumerable keys, in this order:

```text
schemaVersion
canonicalizationAlgorithm
canonicalCommandJson
canonicalCommandJsonUtf8ByteLength
digestAlgorithm
digestHex
```

`canonicalCommandJson` is a variable-length TypeScript/ECMAScript `string` containing the complete canonical tagged-tree JSON. It is never truncated, abbreviated, redacted, normalized, or replaced by the digest. `canonicalCommandJsonUtf8ByteLength` is a positive safe integer exactly equal to the UTF-8 byte length of that complete string. This slice does not invent an arbitrary maximum that could change the currently accepted command set. A store unable to persist the complete string atomically must fail the write; adding a bounded durable column requires a separately reviewed adapter/migration design.

`digestHex` is SHA-256 over the UTF-8 bytes of `canonicalCommandJson`, rendered as exactly 64 lowercase hexadecimal characters (32 digest bytes). The digest is internal audit/index metadata only. It MUST NOT authorize equality.

A stored fingerprint is valid only when it has the exact key set and literals above, a string `canonicalCommandJson`, a matching positive safe-integer UTF-8 byte length, `/^[0-9a-f]{64}$/` digest text, and:

```ts
stored.digestHex === sha256Utf8(stored.canonicalCommandJson)
```

The incoming fingerprint is created by the same checked constructor. Exact command equivalence is solely:

```ts
sameCommand =
  validStoredFingerprint(stored) &&
  stored.canonicalCommandJson === incoming.canonicalCommandJson;
```

The string comparison is exact JS code-unit equality. Digest equality alone is never sufficient, so SHA-256 collision resistance is not part of the correctness argument. A store may use the digest to narrow/index candidates only if it subsequently compares the complete canonical strings.

Neither `canonicalCommandJson` nor `digestHex` may appear in any `CommandResult`, rejection/failure details, error message, log, event, public serialization, or telemetry. The application returns only `receipt.result`; it never returns or serializes the receipt/fingerprint. Internal test inspection of the memory-store receipt is permitted only to verify this contract.

If snapshot/canonicalization fails, use the existing retryable `DependencyExecutionFailed` result at `failureStage: "command-validation"`; do not read/write a receipt, allocate event metadata, generate events, or persist a failure. The typed service boundary must have an own data-property `gameId` usable for that failure result; grossly malformed values lacking it remain adapter-boundary violations, not persistable commands.

## 4. Receipt types: only `CommandReceiptResult` is persistable

Preserve these aliases exactly:

```ts
export type CommandReceiptResult = CommandAccepted | CommandRejected;
export type CommandResult = CommandReceiptResult | CommandExecutionFailed;
```

A receipt MUST never use `CommandResult`; retryable `CommandExecutionFailed` values remain non-persistable.

```ts
export type LegacyCommandReceipt = {
  readonly commandId: CommandId;
  readonly gameId: GameId;
  readonly result: CommandReceiptResult;
  readonly commandFingerprint?: never;
};

export type FingerprintedCommandReceipt<
  TResult extends CommandReceiptResult = CommandReceiptResult,
> = {
  readonly commandId: CommandId;
  readonly gameId: GameId;
  readonly commandFingerprint: CommandFingerprint;
  readonly result: TResult;
};

export type CommandReceipt =
  | LegacyCommandReceipt
  | FingerprintedCommandReceipt;

export type CommitAcceptedCommandInput = {
  readonly expectedGameVersion: number;
  readonly eventBatch: DomainEventBatch;
  readonly receipt: FingerprintedCommandReceipt<CommandAccepted>;
};

export type RecordRejectedCommandInput = {
  readonly gameId: GameId;
  readonly commandId: CommandId;
  readonly receipt: FingerprintedCommandReceipt<CommandRejected>;
};
```

A new fingerprinted receipt has exactly the enumerable keys `commandId`, `gameId`, `commandFingerprint`, `result`; a legacy receipt has exactly `commandId`, `gameId`, `result` and no runtime `commandFingerprint` property. `findCommandReceipt` may return either form for legacy reads. Both write methods require the fingerprinted form and must runtime-validate the fingerprint. `markIdempotent` should accept and return `CommandReceiptResult`, not widen its input/output to a persistable `CommandResult`:

```ts
export const markIdempotent = (
  result: CommandReceiptResult
): CommandReceiptResult => /* accepted/rejected copy with idempotent: true */;
```

## 5. Exact lookup/write flow and conflict

Use the immutable captured snapshot throughout:

1. Capture/validate the snapshot and construct its `CommandFingerprint`.
2. Read receipt by captured `(gameId, commandId)`.
3. If a receipt exists and `sameCommand` above is true, return `markIdempotent(existingReceipt.result)` immediately. Do not load/rebuild state, validate the command, allocate metadata, or emit events.
4. If a receipt exists but its fingerprint is absent, malformed, unknown-versioned, digest-invalid, byte-length-invalid, or has a different `canonicalCommandJson`, load/rebuild only enough to obtain accurate `currentGameVersion`; return the exact conflict below. Do not run normal command validation, generate events, allocate metadata, write/overwrite a receipt, or expose either canonical JSON or digest.
5. If no receipt exists, run the normal path from the captured snapshot. Store the same constructed fingerprint with every accepted or rejected `CommandReceiptResult`.

Exact conflict:

```ts
{
  status: "rejected",
  gameId,
  code: "CommandIdempotencyConflict",
  message: "commandId is already associated with a different command",
  currentGameVersion,
  idempotent: false,
}
```

Add `CommandIdempotencyConflict` to the general rejection-code union. The conflict has exactly the normal `GeneralCommandRejected` keys and no `details`, events, event types, canonical JSON, digest, comparison reason, modifier data, or internal metadata. It is not recorded because the receipt key belongs to the original command. If state load/rebuild fails while obtaining the version, return the existing retryable execution failure and make no writes.

Legacy receipts without a fingerprint and malformed/unknown fingerprints fail closed as this conflict, even if the incoming command appears identical. Do not reconstruct/backfill identity from domain events: replay cannot recover the complete original actor, expected version, issued time, payload representation, or extra own fields. A future adapter may migrate only from a retained complete original command envelope. Current domain-event replay remains unchanged.

## 6. Bounded implementation surface

Authorized by this erratum:

- `packages/domain-core/src/seamstress.ts`: exact `sects-and-violets` literal and reuse of `SUPPORTED_SCRIPT_ID`.
- the existing domain event registry/export integration needed to expose the exact Seamstress event literals listed above; no event rename or new rule behavior.
- `packages/application/src/command-result.ts`: accepted union/summary constructor, general conflict code, and receipt-result-only `markIdempotent`.
- new focused `packages/application/src/command-fingerprint.ts`: descriptor snapshot, tagged canonicalization, exact canonical string/size, digest, and runtime validator.
- `packages/application/src/ports/command-commit-store.ts`: legacy-read/fingerprinted-write receipt types using only `CommandReceiptResult`.
- `packages/application/src/game-application-service.ts`: snapshot-before-lookup flow, exact canonical comparison, conflict handling, and summary only for accepted Seamstress commands.
- `packages/test-harness/src/memory-stores.ts`: fingerprint validation and summary-to-full-batch validation.
- directly corresponding tests/exports.

Not authorized: UI/network changes, a persistence schema, global accepted-result migration, per-field payload redaction, transport-byte equality, a `GameVersion` brand, persisting retryable failures, rule/event semantic changes, or unrelated refactors. If a production adapter appears and cannot atomically store the complete canonical string plus receipt, stop with `HUMAN_BLOCKED` and request a separate adapter/migration review.

## 7. Required tests

1. Exact capability literal is `sects-and-violets`; underscore/case/trim/normalization aliases fail application, prospective batch, and replay validation.
2. V2 choice result has the exact eight summary keys and exact ordered types `SeamstressTargetsChosen`, `SeamstressAbilitySpent`, `SeamstressInformationDelivered`, `ScheduledTaskSettled` under every modifier branch.
3. DEFER result has the same exact key set and ordered types `SeamstressActionDeferred`, `ScheduledTaskSettled`.
4. First result, stored receipt result, and idempotent retry contain no runtime `events` property and no payload/evaluation leakage; retry changes only `idempotent`.
5. Event store still contains the complete ordered canonical envelopes/payloads for four-event choice and two-event DEFER batches.
6. Memory store rejects a summary whose count, type-array length, or any ordered type differs from `eventBatch.events`.
7. `gameVersion` and `currentGameVersion` remain `number`; no `GameVersion` brand is introduced.
8. Compile-time tests retain that `CommandReceiptResult` rejects every `CommandExecutionFailed`; accepted-write input rejects a rejected/failed result and rejected-write input rejects an accepted/failed result.
9. Fingerprint has the exact six keys/literals; Unicode vectors verify `canonicalCommandJsonUtf8ByteLength`; digest is the SHA-256 UTF-8 lowercase 64-hex value.
10. Same structural command with different object-property insertion order produces identical complete canonical JSON and is idempotent; array order remains significant.
11. Own `undefined` differs from absent; changing target/order/decision, actor, expected version, issuedAt, correlationId, payload field, or extra own enumerable field produces different canonical JSON and the exact conflict with no writes/events/overwrite.
12. A stored record with a different canonical JSON but a copied/equal incoming digest still conflicts; digest equality never authorizes idempotence.
13. A stored record with the same canonical JSON but tampered digest, byte length, key set, schema, or algorithm is malformed and conflicts fail-closed.
14. Accessors, non-enumerable custom fields, symbols, sparse/extra-key arrays, non-plain objects, cycles, bigint, unsafe/non-integer numbers, and negative zero fail before receipt I/O/event work.
15. Every new accepted and rejected receipt stores a valid complete canonical string and digest; legacy missing-fingerprint receipts conflict and are not overwritten.
16. `JSON.stringify` of every returned accepted/rejected/failed result contains neither `canonicalCommandJson` nor `digestHex`; conflict messages/details never reveal them.
17. Seamstress payload assertions read the event store; existing non-Seamstress accepted-result tests remain unchanged.

Put focused identity vectors in `packages/application/src/command-fingerprint.test.ts`, service behavior in `game-application-service.test.ts`, memory-store invariants in `memory-stores.test.ts`, and capability/prospective/replay coverage beside the existing domain batch/rebuild tests.

Bounded verdict: feasible without an architecture blocker in the current in-memory repository. The sole new stop condition is discovery of a durable adapter unable to persist the complete canonical representation atomically with the receipt.

READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW
