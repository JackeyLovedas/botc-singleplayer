# Phase 3 Slice 2B20B-P2F1R-A Canonical Runtime Capture and TLV Foundation — Design Round 1

### Metadata

- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_A_DESIGN_ROUND_1_ONLY`
- designRound: `1 / 2`
- designStatus: `NOT_REVIEWED`
- implementationAuthorized: `false`
- currentHead: `bef395287d5400043565acd5b794d02810d7bbca`
- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- precheck: `docs/architecture/2B20B-P2F1R-A-canonical-runtime-capture-tlv-governance-precheck.md`
- precheckSha256: `14e4ab8ebb6e4c8751678176f58343575ba7a7ad86109731e0ba52a1741c59ec`
- sliceCoverageTarget: `FOUNDATION`
- roleCoverageChange: `NONE`
- authorityStatus: `DESIGN_AUTHORITY_PENDING_INDEPENDENT_REVIEW`

## 1. Authorization

This document is the sole Design Round 1 authority for `Phase 3 Slice 2B20B-P2F1R-A — Canonical Runtime Capture and TLV Foundation`.

The authorization permits design only. It does not permit production code, tests, control-state edits, implementation traceability, dependency changes, commits, pushes, pull requests, CI execution, or work on P2F1R-B, P2F1R-C, P2F1R-D, or the parent P2F trusted-history authority.

The governance precheck returned `GO` only for this bounded design. `GO` is not `RULE_DESIGN_PASS`. Implementation remains unauthorized unless a fresh independent read-only reviewer returns `RULE_DESIGN_PASS` and the user separately authorizes implementation.

The explicit latest authorization corrects the precheck’s earlier shorthand for the TLV header. The authoritative V1 header is the literal ten-byte ASCII sequence `BOTCCRV+01`, not the seven ASCII bytes `BOTCCRV` followed by binary byte `01`.

## 2. Scope

P2F1R-A owns one continuous generic trust boundary:

```text
unknown runtime input
        |
        v
Node util.types.isProxy identity probe
        |
        v
descriptor-safe structural capture
        |
        v
detached deeply frozen canonical backing
        |
        v
process-local opaque token
        |
        v
deterministic Canonical Runtime TLV V1 bytes
```

The Slice freezes:

1. the closed generic canonical runtime-value domain;
2. exception-safe, Proxy-first, descriptor-only capture;
3. one process-local token issuer and one runtime authentication mechanism;
4. a detached deeply frozen internal tagged tree;
5. deterministic TLV framing, ordering, Unicode, integer, and resource contracts;
6. generic diagnostics that do not expose caller data;
7. one package-private read-only seam for the later structural domain validator;
8. exact public APIs, exact result unions, exact allowlists, Traceability V1.1 criteria, and Stop-Loss conditions.

The Slice is a generic engineering foundation. It contains no BOTC character, event, history, replay, application, persistence, or projection behavior.

## 3. Non-goals

P2F1R-A does not design or implement:

- raw-byte capture;
- SHA, digest, cryptographic framing, canonical-value hash, canonical-state hash, aggregate hash, or hash authority;
- event envelope fields, event type dispatch, event versions, or any of the 40 BOTC payload schemas;
- domain-required or non-empty field rules;
- replay, rebuild, accepted-history provenance, canonical-state authority, snapshot authority, or persistence migration;
- event ordering, batch ordering, `gameVersion`, receipt, checksum, or journal semantics;
- `GameState`, event applier, event stream validator, application service, persistence, receipts, or projections;
- Dreamer, Vigormortis, Philosopher, Vortox, Drunk, Poisoned, impairment provenance, roles, tasks, ledgers, or rules;
- a decoder or unknown-header parser;
- test ownership registration, total-test inventory, coverage profile, workflow, Windows routing, exact-head publication evidence, or CI;
- a public canonical backing representation;
- a public token constructor, token clone, token hydration, token import, token export, or authority restoration mechanism;
- any change to accepted legacy serialization or command fingerprint formats.

P2F1R-B owns deterministic integrity hashes. P2F1R-C owns BOTC domain-event structural validation. P2F1R-D owns evidence, ownership, coverage, workflow, Windows execution, and publication closure. The parent P2F owns trusted-history authority only after its prerequisites are independently accepted.

## 4. Existing implementation inventory

The inspected repository establishes these constraints:

1. `packages/domain-core/src/canonical-data.ts` has a private `CanonicalData` representation, descriptor inspection, `structuredClone`, a legacy text encoder, and public `isCanonicalDataValue`, `isDenseCanonicalArray`, and `sameCanonicalDataValue`. It is not Proxy-first because `Array.isArray` precedes prototype, key, and descriptor inspection. It has no opaque token, private backing, TLV, or resource diagnostics. It remains an unchanged denylist precedent rather than a dependency or migration target.
2. `packages/application/src/command-fingerprint.ts` uses `node:util` `utilTypes.isProxy` before command-value reflection, descriptor-based capture, raw-code-unit sorting, JSON canonicalization, and SHA-256. It intentionally admits own `undefined`, is application-specific, and remains byte-for-byte and functionally unchanged. Its tests are supporting precedent only.
3. `packages/domain-core/src/event-stream-validator.ts` validates typed accepted event streams and throws `DomainError`. It is downstream domain/history behavior, is not an unknown-input parser, and remains excluded.
4. `packages/domain-core/src/initial-private-knowledge.ts` contains plain-record and exact-key helpers plus BOTC field policies. Those are downstream domain semantics and must not leak into A.
5. `packages/domain-core/src/index.ts` is the sole root barrel, and `packages/domain-core/package.json` exposes only `.` through `./src/index.ts`. A may add named public exports there, while a source-module export omitted from the index remains package-private in the repository architecture.
6. The new A production file and test do not exist at the reviewed HEAD. Existing hostile-input styles are useful precedent but not authority for the new contract. No accepted runtime-capture token or Canonical Runtime TLV implementation is being replaced.
7. Node `24.15.0` supplies `node:util` `types.isProxy`. This runtime identity operation is the mandatory first object probe and does not invoke ordinary or revoked Proxy traps.

The following authority hashes were read during the precheck and remain the design baseline:

| Authority | SHA-256 |
|---|---|
| P2F1R rescope precheck | `ed531a43732cdf87c227c0dcf9b1697d55b260ec0971708889f8122b054fb993` |
| original combined P2F1 design | `85152ec636b87b08b253c20dcaba9f961ba26eaa2e46b75fd80ac108a026cf2a` |
| combined P2F1 correction | `74123ae058e21e86aade02bf71a877a82edd97c221ab387ee8aafcfc48d1f112` |
| Traceability V1.1 ADR | `f32bcbc92feb710afb9d12f6105c89e8223a7ea98bd1d73ce249b15b3d59a432` |
| review protocol | `4f9328a73172e4a70f8ef64be431a55e23f96bb78e553673d3aef0845ea00b64` |

## 5. Threat model

Every public input is untrusted. Attackers or corrupt callers may provide:

- transparent, throwing, nested, ordinary, or revoked Proxies;
- accessors with observable getter or setter behavior;
- `toJSON`, `toString`, `valueOf`, `Symbol.toPrimitive`, iterator, inspection, or species hooks;
- symbols as values or keys;
- cyclic or repeatedly aliased graphs;
- sparse, keyed, nonstandard-prototype, or forged arrays;
- class instances, exotic built-ins, typed buffers, or nonplain prototypes;
- hostile descriptors and operations that throw;
- lone UTF-16 surrogates;
- resource-exhausting depth, width, node, string, key, or encoded-size inputs;
- primitive, cloned, spread, serialized, Proxy-wrapped, or fabricated token lookalikes;
- mutations after capture or mutations of previously returned byte arrays.

The foundation promises:

1. `util.types.isProxy` is invoked before `Array.isArray`, prototype inspection, own-key enumeration, or descriptor access for every object occurrence.
2. A positive or throwing Proxy identity result immediately fails. No later operation is performed on that input.
3. No installed Proxy trap is invoked by the mandatory identity probe for either ordinary or revoked Proxies under the frozen Node runtime.
4. No getter, setter, iterator, coercion, stringification, serialization hook, inspection hook, species constructor, or caller method is invoked.
5. Capture either returns one completely registered token or no authority.
6. Serialization either returns one complete newly allocated byte array or no bytes.
7. Diagnostics contain only fixed enums, bounded ordinal/index paths, numeric limit summaries, and a quarantine boolean.

The promise is zero user-observable Proxy trap invocation, not zero runtime identity operations.

## 6. Canonical value domain

The admitted domain is closed:

- `null`;
- `boolean`;
- JavaScript `number` only when it is a safe integer in `[-9007199254740991, 9007199254740991]` and is not negative zero;
- a string containing only well-formed Unicode scalar sequences, including the empty string;
- a dense current-realm standard array whose elements are admitted values;
- a plain record whose exact prototype is current-realm `Object.prototype` or `null` and whose own properties are enumerable string-keyed data properties containing admitted values.

The following reject:

- `undefined`;
- fraction, `NaN`, positive infinity, negative infinity, unsafe integer, and negative zero;
- `bigint`;
- symbol value;
- function;
- ordinary or revoked Proxy at any depth;
- accessor property;
- symbol key;
- non-enumerable custom property;
- cycle;
- sparse, keyed, out-of-range, or nonstandard-prototype array;
- boxed primitive;
- `Date`, `RegExp`, `Map`, `Set`, `Error`, `Promise`, `ArrayBuffer`, `SharedArrayBuffer`, `DataView`, every typed array, and every class instance;
- every other nonplain object;
- a lone high or low surrogate in a string value or object key.

`null` is a value. `undefined` is not omitted or converted to null. An empty string and an empty record key are admitted. Required-key, non-empty, ID, event, and domain-field constraints belong to P2F1R-C.

Input records with `Object.prototype` and `null` prototypes produce the same canonical value and bytes when their own data is otherwise equal. Prototype identity is deliberately erased.

## 7. Descriptor-safe capture algorithm

### Deterministic operation order

For each runtime value, capture performs this exact sequence:

1. Classify `null` and non-object primitives using only `typeof`, `Number` predicates, `Object.is`, and string validation.
2. For every object, call `types.isProxy(value)` from `node:util` inside an exception boundary before `Array.isArray`, `Reflect.getPrototypeOf`, `Reflect.ownKeys`, or descriptor reads.
3. When `types.isProxy` returns `true` or throws, return `PROXY_OR_DESCRIPTOR_FAILURE` and perform no further operation on the input.
4. Enforce the entry depth and node budgets, then check the current ancestor set for a cycle.
5. Call `Array.isArray` inside an exception boundary.
6. Call `Reflect.getPrototypeOf` inside an exception boundary. Arrays require exact current-realm `Array.prototype`; records require exact current-realm `Object.prototype` or `null`.
7. Call `Reflect.ownKeys` inside an exception boundary.
8. Reject symbol keys and enforce generic container-count limits.
9. For a record, sort string keys with the frozen UTF-16 comparator before descriptor reads. For an array, calculate the exact expected string-key set independent of the returned own-key order.
10. Fetch each descriptor using `Reflect.getOwnPropertyDescriptor` inside an exception boundary and retain only the runtime-created descriptor records in local variables.
11. Validate every descriptor in the current container before reading any descriptor record’s `.value`.
12. Reject accessors, non-enumerable custom properties, invalid array length, holes, extra array keys, and missing descriptors.
13. Recurse only through `.value` on validated runtime-created descriptor records in canonical order.
14. Validate Unicode and byte lengths and update checked encoded-size and resource accounting.
15. Build backing nodes only in local variables.
16. After complete root success, deeply freeze the backing, create a frozen null-prototype zero-key token, register its WeakSet and WeakMap entries, and return success.

No `await` or caller callback occurs, so capture has no asynchronous interleaving window.

### Normative pseudocode

```text
captureCanonicalRuntimeValue(input):
  accounting = new local accounting record
  ancestors = new local WeakSet
  captured = captureNode(input, depth 0, empty path, ancestors, accounting)
  if captured failed:
    return failed result
  totalBytes = checkedAdd(10, captured.node.encodedNodeBytes)
  if totalBytes exceeds maxSerializedBytes:
    return RESOURCE_SERIALIZED_BYTE_LIMIT_EXCEEDED
  deeplyFreeze(captured.node)
  token = Object.create(null)
  Object.freeze(token)
  issuedCanonicalRuntimeTokens.add(token)
  canonicalRuntimeBackings.set(token, captured.node)
  return success with token, version, and frozen metrics

captureNode(value, depth, path, ancestors, accounting):
  if value is null:
    account entry and return NULL node
  if typeof value is not object:
    validate admitted primitive, account entry, return scalar node

  proxyResult = guarded types.isProxy(value)
  if proxyResult failed or proxyResult is true:
    return PROXY_OR_DESCRIPTOR_FAILURE

  enforce depth and node entry limits
  if ancestors contains value:
    return CYCLE
  add value to ancestors

  arrayResult = guarded Array.isArray(value)
  prototype = guarded Reflect.getPrototypeOf(value)
  keys = guarded Reflect.ownKeys(value)
  validate prototype, symbols, counts, and exact container key set
  orderedKeys = numeric index order for array or UTF-16 sorted order for record

  descriptors = new local list
  for each ordered key:
    descriptor = guarded Reflect.getOwnPropertyDescriptor(value, key)
    require descriptor exists
    append descriptor to descriptors

  validate every descriptor without reading descriptor value
  nodes = new local list
  for each validated descriptor in canonical order:
    child = captureNode(descriptor value, depth plus one, bounded child path, ancestors, accounting)
    if child failed:
      remove value from ancestors
      return child failure
    append child node to nodes

  node = create detached array or object node from local copied keys and nodes
  remove value from ancestors
  return node
```

Every guarded host-operation failure maps to `PROXY_OR_DESCRIPTOR_FAILURE`. No original exception, message, stack, key, or value escapes.

## 8. Opaque token contract

The public token type is intentionally structural only:

```ts
export type CapturedCanonicalRuntimeValue = object;
```

There is no `unique symbol`, nominal brand, exported brand property, constructor, runtime tag, public issuer registry, cast helper, hydration function, or `as unknown as` path.

Runtime authority exists only through:

```ts
const issuedCanonicalRuntimeTokens = new WeakSet<object>();
const canonicalRuntimeBackings =
  new WeakMap<object, InternalCanonicalRuntimeValue>();
```

A valid token is:

- created only after full successful root capture;
- a current-module-instance object;
- `Object.create(null)`;
- frozen;
- free of own string or symbol keys;
- authenticated only by `issuedCanonicalRuntimeTokens.has`;
- mapped to exactly one backing by `canonicalRuntimeBackings.get`.

Token authentication performs:

1. `typeof candidate === "object"` and `candidate !== null`;
2. `issuedCanonicalRuntimeTokens.has(candidate)`;
3. `canonicalRuntimeBackings.get(candidate)`.

It performs no reflection, property read, enumeration, coercion, or Proxy trap. A foreign Proxy may be passed directly to WeakSet authentication and fails without invoking its traps.

Primitives, `null`, spreads, JSON results, structured clones, Proxy wrappers, objects with matching apparent shape, and tokens created by another module instance return `INVALID_CAPTURE_TOKEN`.

An issued token missing its backing is an internal invariant failure and returns `INTERNAL_BACKING_MISSING`. No public operation can create that state.

The token proves only that this module instance completed the generic structural capture. It is not event, replay, state, persistence, snapshot, or accepted-history authority.

## 9. Private backing contract

The backing is this exact closed union inside `canonical-runtime-value.ts`:

```ts
export type InternalCanonicalRuntimeValue =
  | {
      readonly kind: "NULL";
      readonly encodedNodeBytes: 1;
    }
  | {
      readonly kind: "BOOLEAN";
      readonly value: boolean;
      readonly encodedNodeBytes: 1;
    }
  | {
      readonly kind: "INTEGER";
      readonly value: number;
      readonly encodedNodeBytes: 9;
    }
  | {
      readonly kind: "STRING";
      readonly value: string;
      readonly utf8ByteLength: number;
      readonly encodedNodeBytes: number;
    }
  | {
      readonly kind: "ARRAY";
      readonly values: readonly InternalCanonicalRuntimeValue[];
      readonly encodedNodeBytes: number;
    }
  | {
      readonly kind: "OBJECT";
      readonly entries: readonly InternalCanonicalRuntimeObjectEntry[];
      readonly encodedNodeBytes: number;
    };

export type InternalCanonicalRuntimeObjectEntry = {
  readonly key: string;
  readonly keyUtf8ByteLength: number;
  readonly value: InternalCanonicalRuntimeValue;
};
```

These two aliases are source-module exports so the package-private Layer-C relative import has a complete declaration. They are omitted from `src/index.ts` and the package root and are never general public values.

Invariants:

- every node, values array, entries array, and entry record is newly allocated;
- every node, array, and entry is deeply frozen;
- no caller object, descriptor, typed array, `ArrayBuffer`, iterator, method, or byte buffer is retained;
- `encodedNodeBytes` excludes the ten-byte stream header;
- a root’s total serialized size is exactly `10 + root.encodedNodeBytes`;
- integer, count, and size arithmetic is checked;
- arrays store canonical child order;
- objects store raw-UTF-16-sorted entries;
- repeated acyclic references become independent backing subtrees;
- alias identity and admitted input prototype identity are erased.

No public API returns this union.

## 10. Public API contract

The package root may expose exactly this additive contract:

```ts
export const CANONICAL_RUNTIME_VALUE_VERSION =
  "botc-canonical-runtime-value-v1" as const;

export const CANONICAL_RUNTIME_SERIALIZATION_VERSION =
  "botc-canonical-runtime-tlv-be-v1" as const;

export const CANONICAL_RUNTIME_LIMITS = Object.freeze({
  maxDepth: 128,
  maxNodes: 100_000,
  maxArrayLength: 10_000,
  maxObjectKeys: 10_000,
  maxStringUtf8Bytes: 1_048_576,
  maxObjectKeyUtf8Bytes: 65_535,
  maxSerializedBytes: 16_777_216,
  maxDiagnosticPathSegments: 32,
} as const);

export type CapturedCanonicalRuntimeValue = object;

export type CanonicalRuntimeFailurePhase =
  | "CAPTURE"
  | "TOKEN_AUTHENTICATION"
  | "SERIALIZATION"
  | "INTERNAL_READ";

export type CanonicalRuntimeFailureCode =
  | "UNSUPPORTED_TYPE"
  | "INVALID_NUMBER"
  | "UNSAFE_INTEGER"
  | "INVALID_UNICODE"
  | "ACCESSOR_PROPERTY"
  | "NON_ENUMERABLE_PROPERTY"
  | "SYMBOL_KEY"
  | "SYMBOL_VALUE"
  | "CYCLE"
  | "SPARSE_ARRAY"
  | "KEYED_ARRAY"
  | "INVALID_ARRAY_LENGTH_DESCRIPTOR"
  | "NONPLAIN_OBJECT"
  | "PROXY_OR_DESCRIPTOR_FAILURE"
  | "RESOURCE_DEPTH_EXCEEDED"
  | "RESOURCE_NODE_LIMIT_EXCEEDED"
  | "RESOURCE_ARRAY_LIMIT_EXCEEDED"
  | "RESOURCE_OBJECT_KEY_LIMIT_EXCEEDED"
  | "RESOURCE_STRING_LIMIT_EXCEEDED"
  | "RESOURCE_KEY_LIMIT_EXCEEDED"
  | "RESOURCE_SERIALIZED_BYTE_LIMIT_EXCEEDED"
  | "INVALID_CAPTURE_TOKEN"
  | "INTERNAL_BACKING_MISSING"
  | "INTERNAL_SERIALIZATION_FAILURE";

export type CanonicalRuntimePathSegment =
  | {
      readonly kind: "ARRAY_INDEX";
      readonly index: number;
    }
  | {
      readonly kind: "OBJECT_KEY_ORDINAL";
      readonly ordinal: number;
    }
  | {
      readonly kind: "TRUNCATED";
    };

export type CanonicalRuntimeResourceKind =
  | "DEPTH"
  | "NODE_COUNT"
  | "ARRAY_LENGTH"
  | "OBJECT_KEY_COUNT"
  | "STRING_UTF8_BYTES"
  | "OBJECT_KEY_UTF8_BYTES"
  | "SERIALIZED_BYTES";

export type CanonicalRuntimeLimitSummary =
  | {
      readonly kind: "NOT_APPLICABLE";
    }
  | {
      readonly kind: "LIMIT";
      readonly resource: CanonicalRuntimeResourceKind;
      readonly limit: number;
      readonly observed: number;
    };

export type CanonicalRuntimeDiagnostic = {
  readonly code: CanonicalRuntimeFailureCode;
  readonly phase: CanonicalRuntimeFailurePhase;
  readonly path: readonly CanonicalRuntimePathSegment[];
  readonly limitSummary: CanonicalRuntimeLimitSummary;
  readonly quarantineRecommended: boolean;
};

export type CanonicalRuntimeResourceMetrics = {
  readonly nodesVisited: number;
  readonly maximumDepthVisited: number;
  readonly maximumArrayLengthObserved: number;
  readonly maximumObjectKeysObserved: number;
  readonly maximumStringUtf8BytesObserved: number;
  readonly maximumObjectKeyUtf8BytesObserved: number;
  readonly serializedBytes: number;
};

export type CaptureCanonicalRuntimeValueResult =
  | {
      readonly ok: true;
      readonly token: CapturedCanonicalRuntimeValue;
      readonly valueVersion:
        typeof CANONICAL_RUNTIME_VALUE_VERSION;
      readonly metrics: CanonicalRuntimeResourceMetrics;
    }
  | {
      readonly ok: false;
      readonly diagnostic: CanonicalRuntimeDiagnostic;
    };

export type SerializeCanonicalRuntimeValueResult =
  | {
      readonly ok: true;
      readonly bytes: Uint8Array;
      readonly byteLength: number;
      readonly valueVersion:
        typeof CANONICAL_RUNTIME_VALUE_VERSION;
      readonly serializationVersion:
        typeof CANONICAL_RUNTIME_SERIALIZATION_VERSION;
    }
  | {
      readonly ok: false;
      readonly diagnostic: CanonicalRuntimeDiagnostic;
    };

export function captureCanonicalRuntimeValue(
  input: unknown,
): CaptureCanonicalRuntimeValueResult;

export function serializeCanonicalRuntimeValue(
  token: unknown,
): SerializeCanonicalRuntimeValueResult;
```

`serializeCanonicalRuntimeValue` deliberately accepts `unknown`. TypeScript types do not downgrade its T1 authentication boundary.

The constants, result types, diagnostics, metrics, token alias, and two functions are the complete public surface for A. The TLV header is not exported as a mutable byte array.

## 11. Internal consumer seam

P2F1R-C may later use one package-private relative-import seam:

```ts
export type ReadCanonicalRuntimeBackingResult =
  | {
      readonly ok: true;
      readonly value: InternalCanonicalRuntimeValue;
    }
  | {
      readonly ok: false;
      readonly diagnostic: CanonicalRuntimeDiagnostic;
    };

export function readCanonicalRuntimeBackingForStructuralValidation(
  token: unknown,
): ReadCanonicalRuntimeBackingResult;
```

This seam:

- exists in `canonical-runtime-value.ts`;
- is not re-exported from `packages/domain-core/src/index.ts`;
- is not a package-root public API;
- performs object/non-null guard, `WeakSet.has`, and `WeakMap.get` only;
- returns `INVALID_CAPTURE_TOKEN` for every non-issued input;
- returns `INTERNAL_BACKING_MISSING` for an impossible issued-without-backing invariant breach;
- performs no caller reflection or property access;
- returns only the deeply frozen backing;
- conveys generic captured structure, not event validity or history authority;
- gives C no access to either registry and no ability to issue tokens.

P2F1R-B uses only the public serializer and does not use this seam.

## 12. TLV V1 binary contract

### Versions

- canonical value version: `botc-canonical-runtime-value-v1`
- serialization version: `botc-canonical-runtime-tlv-be-v1`

### Header

Every successful top-level serialization starts exactly once with the literal ASCII bytes for `BOTCCRV+01`:

```text
42 4F 54 43 43 52 56 2B 30 31
```

This is ten bytes. There is no NUL, BOM, terminator, binary version byte, or repeated child header.

### Node grammar

| Tag | Meaning | Exact body |
|---|---|---|
| `00` | null | no body |
| `01` | false | no body |
| `02` | true | no body |
| `03` | integer | signed two’s-complement eight-byte big-endian integer |
| `04` | string | four-byte unsigned big-endian UTF-8 byte length, then exact UTF-8 bytes |
| `05` | array | four-byte unsigned big-endian element count, then child nodes in preserved order |
| `06` | object | four-byte unsigned big-endian entry count, then sorted entries |

An object entry is:

```text
u32be key UTF-8 byte length
exact key UTF-8 bytes
one child node
```

Object keys have no string tag. Counts and lengths are exactly four bytes and never varints. Integers are never decimal text. The format uses no JSON, delimiter concatenation, platform-default encoding, or locale behavior.

### Normative known-answer vectors

| Value | Complete TLV hex |
|---|---|
| `null` | `42 4F 54 43 43 52 56 2B 30 31 00` |
| `false` | `42 4F 54 43 43 52 56 2B 30 31 01` |
| `true` | `42 4F 54 43 43 52 56 2B 30 31 02` |
| integer `0` | `42 4F 54 43 43 52 56 2B 30 31 03 00 00 00 00 00 00 00 00` |
| integer `-1` | `42 4F 54 43 43 52 56 2B 30 31 03 FF FF FF FF FF FF FF FF` |
| string `A` | `42 4F 54 43 43 52 56 2B 30 31 04 00 00 00 01 41` |
| `[null,true]` | `42 4F 54 43 43 52 56 2B 30 31 05 00 00 00 02 00 02` |
| `{a:null}` | `42 4F 54 43 43 52 56 2B 30 31 06 00 00 00 01 00 00 00 01 61 00` |

The header counts toward `maxSerializedBytes`; backing node sizes exclude it.

## 13. Unicode and string contract

Before UTF-8 encoding, every string value and key is scanned by UTF-16 code units:

- a high surrogate must be followed immediately by a low surrogate;
- a low surrogate without a preceding high surrogate rejects;
- valid pairs are accepted;
- every lone surrogate returns `INVALID_UNICODE`;
- validation occurs before `TextEncoder`, preventing replacement-character substitution.

Encoding uses standard WHATWG UTF-8 semantics after successful validation.

The foundation performs no:

- Unicode normalization;
- case folding;
- trimming;
- newline conversion;
- locale transformation;
- platform-default encoding.

Therefore:

- composed and decomposed canonically equivalent strings remain distinct;
- CR, LF, and CRLF remain distinct;
- valid supplementary-plane characters are encoded from their surrogate pair;
- empty strings and keys encode with zero UTF-8 byte length.

String limits use UTF-8 byte counts, not UTF-16 code-unit counts.

Object keys use this exact comparator:

```ts
const compareUtf16CodeUnits = (
  left: string,
  right: string,
): number => {
  const limit = Math.min(left.length, right.length);
  for (let index = 0; index < limit; index += 1) {
    const delta =
      left.charCodeAt(index) - right.charCodeAt(index);
    if (delta !== 0) {
      return delta < 0 ? -1 : 1;
    }
  }
  return left.length < right.length
    ? -1
    : left.length > right.length
      ? 1
      : 0;
};
```

`localeCompare`, `Intl.Collator`, normalization, numeric-key parsing, and insertion order are forbidden.

## 14. Numeric contract

The only numeric canonical values are JavaScript safe integers:

```text
-9007199254740991 through 9007199254740991 inclusive
```

Negative zero rejects using `Object.is(value, -0)`. Fractions, `NaN`, either infinity, and negative zero return `INVALID_NUMBER`. Integral numbers outside the JavaScript safe-integer range return `UNSAFE_INTEGER`.

Every admitted integer is converted exactly to signed two’s-complement 64-bit big-endian bytes. The safe-integer domain is strictly inside the signed 64-bit domain, so conversion is exact.

Normative properties:

- zero is eight `00` bytes;
- `-1` is eight `FF` bytes;
- positive values are sign-extended with `00`;
- negative values are sign-extended with `FF`;
- no floating-point representation bytes are emitted;
- no decimal string, exponent, or locale formatting is used.

The integer node’s `encodedNodeBytes` is always `9`: one tag byte plus eight payload bytes.

## 15. Array contract

An admitted array must satisfy all of the following:

1. Proxy identity was excluded first.
2. `Array.isArray` returned true inside the exception boundary.
3. Its exact prototype is the current realm’s `Array.prototype`.
4. Its `length` own descriptor exists and is a data descriptor.
5. `length.value` is a safe nonnegative integer no greater than `10_000`.
6. `length` is non-enumerable, non-configurable, and writable.
7. Its complete own-key set is exactly the strings `"0"` through `String(length - 1)` plus `"length"`.
8. It has no hole, symbol, non-index string, negative-looking key, out-of-range index, or extra own key.
9. Every index descriptor is an enumerable data descriptor.
10. Index descriptor `writable` and `configurable` values do not affect canonical meaning.

Validation compares the key set rather than trusting caller enumeration order. Child traversal and TLV serialization use numeric index order. Array order is preserved exactly.

Sparse arrays return `SPARSE_ARRAY`. Extra non-index or out-of-range keys return `KEYED_ARRAY`. An invalid `length` descriptor returns `INVALID_ARRAY_LENGTH_DESCRIPTOR`. Accessor elements return `ACCESSOR_PROPERTY` without invocation.

No BOTC tuple, roster, candidate, player, event, or role-specific length rule belongs here.

## 16. Object contract

An admitted record must satisfy:

1. Proxy identity was excluded first.
2. `Array.isArray` returned false.
3. Its exact prototype is current-realm `Object.prototype` or `null`.
4. All own keys are strings.
5. Every own property is an enumerable data property.
6. Every descriptor is acquired before any descriptor `.value` is read.
7. Values belong to the canonical domain.

Property `writable` and `configurable` attributes do not affect canonical meaning.

Only own properties participate. Inherited state is never read. Keys named `__proto__`, `constructor`, or `prototype` are ordinary copied data keys because backing uses frozen tuple entries rather than assignment into a prototype-bearing object.

String keys are sorted with `compareUtf16CodeUnits` before descriptor traversal and child recursion. Numeric-looking keys remain strings and are sorted lexically by raw UTF-16 code units.

Duplicate own keys cannot exist on a non-Proxy ECMAScript object. A never normalizes, folds, merges, or rewrites keys.

An exact `Object.prototype` record and a null-prototype record with equal own data yield the same backing and TLV.

## 17. Resource accounting

The exact generic limits are:

| Resource | Limit | Accounting rule |
|---|---:|---|
| depth | `128` | root depth is `0`; reject first child occurrence at depth `129` |
| nodes | `100000` | every scalar and container occurrence is one node |
| array length | `10000` | exact `length` value |
| object keys | `10000` | number of own string keys |
| string UTF-8 bytes | `1048576` | each string value after Unicode validation |
| object-key UTF-8 bytes | `65535` | each key after Unicode validation |
| total serialized bytes | `16777216` | ten-byte header plus root encoded node |
| diagnostic path segments | `32` | first 31 segments plus `TRUNCATED` when deeper |

Object keys are not nodes. Repeated acyclic references count once per occurrence. Maximum observations in metrics are initialized to zero and updated deterministically.

Capture checks:

1. depth and node budgets on value entry;
2. array and object counts after safe own-key acquisition;
3. Unicode validity before UTF-8 byte measurement;
4. string and key byte ceilings after measurement;
5. each node’s encoded byte size through checked safe-integer addition;
6. root total through checked `10 + encodedNodeBytes`.

Exact-limit candidates may succeed when otherwise valid. The first one-over returns the corresponding exact resource failure.

`CanonicalRuntimeResourceMetrics` on success contains:

- `nodesVisited`;
- `maximumDepthVisited`;
- `maximumArrayLengthObserved`;
- `maximumObjectKeysObserved`;
- `maximumStringUtf8BytesObserved`;
- `maximumObjectKeyUtf8BytesObserved`;
- `serializedBytes`.

Capture refuses to issue a token whose backing cannot serialize within the same V1 limit.

Serialization authenticates the token, validates the stored root byte invariant, checks `10 + encodedNodeBytes <= 16777216`, allocates exactly once, writes once, and verifies the final offset equals the allocation length.

These are generic safety limits. P2F1R-C may add stricter domain limits but may not weaken or reinterpret A’s limits.

## 18. Diagnostics

The exact public diagnostic fields are:

```ts
{
  readonly code: CanonicalRuntimeFailureCode;
  readonly phase: CanonicalRuntimeFailurePhase;
  readonly path:
    readonly CanonicalRuntimePathSegment[];
  readonly limitSummary: CanonicalRuntimeLimitSummary;
  readonly quarantineRecommended: boolean;
}
```

### Phases

`CAPTURE`, `TOKEN_AUTHENTICATION`, `SERIALIZATION`, `INTERNAL_READ`.

### Codes

`UNSUPPORTED_TYPE`, `INVALID_NUMBER`, `UNSAFE_INTEGER`, `INVALID_UNICODE`, `ACCESSOR_PROPERTY`, `NON_ENUMERABLE_PROPERTY`, `SYMBOL_KEY`, `SYMBOL_VALUE`, `CYCLE`, `SPARSE_ARRAY`, `KEYED_ARRAY`, `INVALID_ARRAY_LENGTH_DESCRIPTOR`, `NONPLAIN_OBJECT`, `PROXY_OR_DESCRIPTOR_FAILURE`, `RESOURCE_DEPTH_EXCEEDED`, `RESOURCE_NODE_LIMIT_EXCEEDED`, `RESOURCE_ARRAY_LIMIT_EXCEEDED`, `RESOURCE_OBJECT_KEY_LIMIT_EXCEEDED`, `RESOURCE_STRING_LIMIT_EXCEEDED`, `RESOURCE_KEY_LIMIT_EXCEEDED`, `RESOURCE_SERIALIZED_BYTE_LIMIT_EXCEEDED`, `INVALID_CAPTURE_TOKEN`, `INTERNAL_BACKING_MISSING`, `INTERNAL_SERIALIZATION_FAILURE`.

### Paths

Only:

- `{kind:"ARRAY_INDEX", index}`;
- `{kind:"OBJECT_KEY_ORDINAL", ordinal}`;
- `{kind:"TRUNCATED"}`.

Object ordinals use zero-based sorted-key order. Raw keys are never exposed. Paths are bounded during traversal rather than built unbounded and truncated later. At depth beyond the path capacity, retain the first 31 segments and use `TRUNCATED` as the final segment.

### Limit summaries

Non-resource failures use `{kind:"NOT_APPLICABLE"}`.

Resource failures use:

```ts
{
  readonly kind: "LIMIT";
  readonly resource: CanonicalRuntimeResourceKind;
  readonly limit: number;
  readonly observed: number;
}
```

The resource values are `DEPTH`, `NODE_COUNT`, `ARRAY_LENGTH`, `OBJECT_KEY_COUNT`, `STRING_UTF8_BYTES`, `OBJECT_KEY_UTF8_BYTES`, and `SERIALIZED_BYTES`.

### Quarantine

`quarantineRecommended` is `true` only for:

- `PROXY_OR_DESCRIPTOR_FAILURE`;
- `ACCESSOR_PROPERTY`;
- `SYMBOL_KEY`;
- `SYMBOL_VALUE`;
- `CYCLE`;
- `INVALID_CAPTURE_TOKEN`;
- `INTERNAL_BACKING_MISSING`;
- `INTERNAL_SERIALIZATION_FAILURE`.

It is `false` for every other code.

Diagnostics never contain raw key, value, ID, event field, serialized byte, exception message, stack, input reference, hash, state, receipt, or advisory. `KnownSchemaFieldName` and any event vocabulary are forbidden.

## 19. Immutability and aliasing

Capture is a one-time detached snapshot:

- scalar and key data are copied by value;
- arrays, object-entry arrays, entries, and nodes are newly allocated;
- the complete backing is deeply frozen before registration;
- caller objects and descriptors are not retained;
- mutation of input after successful capture cannot change backing or future serialization;
- repeated acyclic references are traversed, counted, and copied independently;
- alias identity is intentionally erased;
- cycles reject atomically;
- admitted record prototype identity is erased;
- no byte cache is stored in the token or backing.

The token is frozen, null-prototype, and has zero own keys. It carries no property containing authority, backing, version, bytes, or diagnostics.

Every serialization success returns a newly allocated ordinary, non-shared `Uint8Array`. Mutating one result cannot change the token, backing, or any later result.

## 20. Clone and serialization behavior

Authority is process-local and identity-based:

- spreading a token produces an unissued object;
- `structuredClone` produces an unissued object;
- JSON serialization produces no authority;
- parsing any token-shaped JSON produces no authority;
- a Proxy around a token is not the issued token identity;
- copying prototypes, descriptors, or apparent shape does not reproduce authority;
- a token from a second module instance is not registered in this instance.

All such inputs return `INVALID_CAPTURE_TOKEN` without reflection or trap invocation.

There is no token decoder, deserializer, hydrator, migration, or persistence format. Tokens are not expected to survive process restart.

The TLV result is data, not authority. A byte array cannot be passed back to A to recover a token or backing. Decoder and import semantics are outside A.

`serializeCanonicalRuntimeValue` does not invoke caller code, accepts only an authenticated local token, performs one exact allocation, emits the ten-byte header once, and returns:

```ts
{
  ok: true,
  bytes,
  byteLength: bytes.length,
  valueVersion:
    "botc-canonical-runtime-value-v1",
  serializationVersion:
    "botc-canonical-runtime-tlv-be-v1",
}
```

## 21. Compatibility and versioning

P2F1R-A is encoder-only. It accepts no header or version input and exposes no decoder. Therefore an unknown version has no A entry point and no fallback.

V1 is closed:

- the header is permanently the ten-byte ASCII literal `BOTCCRV+01`;
- tags `00` through `06` retain their exact meanings;
- count, length, integer, ordering, Unicode, and resource semantics cannot be reinterpreted;
- a new value kind or encoding requires a new value or serialization version and a distinct header;
- V1 must never silently decode, downgrade, or reinterpret a future version.

Canonical runtime versions are separate from:

- domain event schema versions;
- command fingerprint versions;
- replay and history authority versions;
- snapshot versions;
- hash and digest versions.

The implementation must not modify or relabel:

- `canonical-data.ts`;
- `command-fingerprint.ts` or its tests;
- event schemas or validators;
- replay or accepted history;
- any accepted hash.

The module may contain private pure comparator, size, and encoder functions. It may not expose a production-visible or test-only pure encoder hook merely to manufacture T3 evidence. The public serializer remains the only authority-bearing serialization entry.

## 22. Failure semantics

Both public functions are total over hostile input and return discriminated results. They do not intentionally throw for caller-controlled values.

Failure is:

- fail closed;
- deterministic for the same observable safe structure;
- the first failure in frozen traversal order;
- atomic;
- free of partial token, registry entry, backing, bytes, event, digest, or authority;
- free of coercion, normalization, salvage, omission, substitution, or silent fallback.

Capture precedence:

1. primitive-domain classification;
2. Proxy identity;
3. entry depth and node budgets;
4. cycle;
5. array classification;
6. prototype;
7. own keys, symbols, and container count;
8. descriptors;
9. descriptor shape;
10. child traversal in canonical order;
11. Unicode and byte limits at the encountered scalar or key;
12. checked encoded-size and root total.

Host-operation exceptions during capture return `PROXY_OR_DESCRIPTOR_FAILURE`.

Authentication precedence:

1. object and non-null guard;
2. WeakSet membership;
3. WeakMap backing lookup.

A non-issued value returns `INVALID_CAPTURE_TOKEN`. An issued token with missing backing returns `INTERNAL_BACKING_MISSING`.

Serialization authenticates first, validates stored size, allocates once, writes, and checks final offset. An impossible backing or encoder invariant failure returns `INTERNAL_SERIALIZATION_FAILURE` with no bytes.

No diagnostic includes an original exception.

## 23. Production allowlist

Only these production files may change during a separately authorized implementation:

1. `packages/domain-core/src/canonical-runtime-value.ts`
   - public constants, types, results, capture, and serializer;
   - private registries and backing;
   - exact generic diagnostics and limits;
   - one package-private Layer-C backing reader.
2. `packages/domain-core/src/index.ts`
   - named additive public exports only;
   - no backing types, backing reader, registries, constructors, or internal encoder exports.

Permitted documentation:

- this design;
- `docs/implementation/phase-3-slice-2b20b-p2f1r-a-implementation-traceability.md`;
- this Slice’s independent design-review archive.

No other production or documentation file is authorized.

Explicitly forbidden:

- hash, raw-byte, digest, or crypto files;
- `canonical-data.ts`;
- command fingerprint source or tests;
- event types, schemas, validators, applier, stream validator, replay, rebuild, `GameState`, snapshots, or history authority;
- application, persistence, receipts, projections, roles, Dreamer, Vigormortis, or impairment;
- dependency, lockfile, runtime, package-manager, Vitest, timeout, ownership, runner, coverage, profile, workflow, Windows, CI, or agent-loop control files.

## 24. Test allowlist

The only future test file is:

`packages/domain-core/src/canonical-runtime-value.test.ts`

No fixture file is authorized. Literal vectors belong in this test file. Existing legacy tests may be run unchanged as supporting evidence but may not be edited.

The following 51 planned semantic test identities are the minimum complete evidence inventory. They are design-time planned identities, not claims that tests already exist. Final implementation titles may be refined without changing their criterion, main assertion, or primary layer.

| No. | Criterion | Planned semantic identity |
|---:|---|---|
| 1 | `A-C01` | captures null and reports exact version and metrics |
| 2 | `A-C01` | captures both booleans as detached tokens |
| 3 | `A-C01` | captures safe integers excluding negative zero |
| 4 | `A-C01` | captures well-formed empty and non-empty strings |
| 5 | `A-C01` | captures dense arrays and plain records |
| 6 | `A-C01` | erases Object-prototype versus null-prototype record identity |
| 7 | `A-C02` | rejects an ordinary transparent Proxy with zero installed traps |
| 8 | `A-C02` | rejects a revoked Proxy with zero installed traps |
| 9 | `A-C02` | rejects nested and array-wrapped Proxies with zero installed traps |
| 10 | `A-C02` | converts a throwing Proxy identity or descriptor operation to fixed failure |
| 11 | `A-C02` | rejects getter and setter descriptors with zero invocations |
| 12 | `A-C02` | rejects symbol keys without reading sibling values |
| 13 | `A-C03` | rejects undefined at root, record value, and array element |
| 14 | `A-C03` | returns INVALID_NUMBER for fraction, NaN, infinities, and negative zero and UNSAFE_INTEGER for out-of-range integral numbers |
| 15 | `A-C03` | rejects bigint, symbol value, and function |
| 16 | `A-C03` | rejects class instances and boxed primitives |
| 17 | `A-C03` | rejects Map, Set, Date, RegExp, buffers, views, typed arrays, and Promise |
| 18 | `A-C03` | rejects direct and nested cycles |
| 19 | `A-C04` | rejects primitive and null token candidates |
| 20 | `A-C04` | rejects Proxy and revoked-Proxy token candidates with zero traps |
| 21 | `A-C04` | rejects spread, JSON, structured clone, and shaped lookalikes |
| 22 | `A-C04` | rejects a token identity from a distinct module instance |
| 23 | `A-C05` | source mutation after capture does not change later bytes |
| 24 | `A-C05` | repeated acyclic aliases detach independently and count per occurrence |
| 25 | `A-C05` | token has null prototype, zero own keys, and is frozen |
| 26 | `A-C06` | repeated serialization returns equal bytes in distinct Uint8Array objects |
| 27 | `A-C06` | mutation of one returned byte array cannot affect later output |
| 28 | `A-C07` | depth exact limit succeeds and first one-over fails |
| 29 | `A-C07` | node exact limit succeeds and first one-over fails |
| 30 | `A-C07` | array-length exact limit succeeds and first one-over fails |
| 31 | `A-C07` | object-key exact limit succeeds and first one-over fails |
| 32 | `A-C07` | string UTF-8 byte exact limit succeeds and first one-over fails |
| 33 | `A-C07` | object-key UTF-8 byte exact limit succeeds and first one-over fails |
| 34 | `A-C07` | total serialized-byte exact limit succeeds and first one-over fails |
| 35 | `A-C08` | emits the exact ten-byte ASCII BOTCCRV+01 header once |
| 36 | `A-C08` | emits exact null and boolean tags |
| 37 | `A-C08` | emits exact string, array, and object u32be lengths and counts |
| 38 | `A-C08` | emits nested child nodes without repeated headers |
| 39 | `A-C09` | emits exact UTF-8 for valid supplementary-plane pairs |
| 40 | `A-C09` | preserves distinct CR, LF, and CRLF byte vectors |
| 41 | `A-C09` | preserves distinct composed and decomposed Unicode vectors |
| 42 | `A-C10` | emits exact i64be bytes for zero, positive, negative, minimum, and maximum safe integers |
| 43 | `A-C11` | record insertion permutations emit identical sorted bytes |
| 44 | `A-C11` | numeric-looking keys use raw UTF-16 lexical order |
| 45 | `A-C11` | supplementary and prefix keys use exact UTF-16 code-unit order |
| 46 | `A-C12` | dense array order is preserved and permutations differ |
| 47 | `A-C12` | sparse, keyed, out-of-range, and invalid-length arrays fail exactly |
| 48 | `A-C13` | representative failures expose exact phase, code, bounded path, limit summary, and quarantine |
| 49 | `A-C13` | diagnostic truncation retains first 31 segments and one TRUNCATED segment without raw data |
| 50 | `A-C14` | new API and versions remain distinct while legacy source hashes and regressions stay unchanged |
| 51 | `A-C15` | frozen literal vector set is ready for later Windows and Linux byte-identity supporting authority |

Tests must not assert hashes, event semantics, replay, roles, application behavior, projection, persistence, workflow, coverage, or CI.

## 25. Traceability V1.1

### Reachability and trust inventory

```text
ExpectedR1PrimarySet = []
ExpectedR2PrimarySet = []
ExpectedR3PrimarySet = [
  hostile or unsupported runtime input,
  invalid or forged token
]
ExpectedR4PrimarySet = [
  valid future capture,
  immutable backing,
  deterministic TLV,
  additive compatibility
]
```

Public capture, token authentication, public serialization, and package-private token admission are T1 boundaries. The module-private backing comparator, size calculator, and encoder are T3 pure core. A has no T2 entry.

No criterion may use `MIXED`, `MULTI_LAYER`, accepted-stream, application-command, replay, hostile-replay, projection, or cross-platform-CI as its A primary layer. One physical semantic identity has exactly one primary layer.

### Design-time nine-field matrix

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `A-C01_VALID_CAPTURE` | admitted generic values create one detached local token | every admitted scalar and container succeeds with exact value version and metrics | direct public capture acceptance matrix | `R4` | `T1` | `STRUCTURAL_VALIDATION` | `{ok:true, valueVersion:"botc-canonical-runtime-value-v1"}` and issued token | no external supporting authority |
| `A-C02_PROXY_DESCRIPTOR` | Proxy and descriptor hostility never executes caller behavior | ordinary, revoked, throwing, nested Proxy and accessor/symbol cases reject with zero installed traps and getters | direct hostile capture matrix with counters | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `{ok:false}` with `PROXY_OR_DESCRIPTOR_FAILURE`, `ACCESSOR_PROPERTY`, or `SYMBOL_KEY` and no token | Node 24.15.0 `util.types.isProxy` behavior is supporting runtime authority only |
| `A-C03_DOMAIN_REJECTION` | values outside the closed domain fail without substitution | every unsupported scalar, invalid number, lone surrogate, exotic, nonplain object, symbol value, and cycle returns its exact code | direct rejected-domain matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `{ok:false}` with `UNSUPPORTED_TYPE`, `INVALID_NUMBER`, `UNSAFE_INTEGER`, `INVALID_UNICODE`, `SYMBOL_VALUE`, `NONPLAIN_OBJECT`, or `CYCLE` | closed value-version contract only |
| `A-C04_TOKEN_AUTHENTICATION` | only the local WeakSet-issued token identity is accepted | primitive, null, Proxy, revoked Proxy, clone, spread, JSON result, cross-instance token, and lookalike fail without reads or traps | direct hostile public serializer and internal-reader token-admission matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `{ok:false, diagnostic:{code:"INVALID_CAPTURE_TOKEN"}}` | private WeakSet and WeakMap are implementation authority; no nominal brand |
| `A-C05_BACKING_ISOLATION` | capture retains no caller object and erases alias identity | post-capture mutation cannot change bytes; repeated references detach and count independently; token has no inspectable backing | public capture, mutate, authenticate, and serialize isolation cases | `R4` | `T1` | `STRUCTURAL_VALIDATION` | issued frozen zero-key token and unchanged later serialization | command-fingerprint immutable-capture behavior is precedent only |
| `A-C06_PUBLIC_SERIALIZER_ISOLATION` | public T1 serialization returns isolated deterministic buffers | an issued token serializes repeatedly to equal bytes in distinct ordinary non-shared Uint8Array objects | public authenticated serializer repetition and buffer-mutation cases | `R4` | `T1` | `PURE_POLICY_SEAM` | `{ok:true, serializationVersion:"botc-canonical-runtime-tlv-be-v1"}` with equal fresh bytes and exact `byteLength` | backing integrity is supporting authority; token admission remains the public T1 wrapper |
| `A-C07_RESOURCE_LIMITS` | every generic ceiling fails atomically at first one-over | depth, nodes, array, keys, string bytes, key bytes, and serialized bytes prove exact-at-limit success and one-over failure | direct public capture resource-boundary matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact `RESOURCE_DEPTH_EXCEEDED`, `RESOURCE_NODE_LIMIT_EXCEEDED`, `RESOURCE_ARRAY_LIMIT_EXCEEDED`, `RESOURCE_OBJECT_KEY_LIMIT_EXCEEDED`, `RESOURCE_STRING_LIMIT_EXCEEDED`, `RESOURCE_KEY_LIMIT_EXCEEDED`, or `RESOURCE_SERIALIZED_BYTE_LIMIT_EXCEEDED` | frozen `CANONICAL_RUNTIME_LIMITS`; no domain limits |
| `A-C08_PURE_TLV_HEADER_TAGS` | the private pure encoder implements the exact V1 header, tags, counts, lengths, and nesting | already-captured backing known-answer vectors prove ten-byte header once, tags `00` through `06`, `u32be`, and nested framing | authenticated setup with main assertion on deterministic backing-to-byte output; no public test hook | `R4` | `T3` | `PURE_POLICY_SEAM` | exact literal bytes beginning `42 4F 54 43 43 52 56 2B 30 31` | C06 supports T1 admission but does not own this byte assertion |
| `A-C09_PURE_UNICODE` | the pure encoder preserves valid Unicode, newline, and normalization distinctions | supplementary-plane, CR, LF, CRLF, composed, and decomposed vectors emit exact distinct bytes | authenticated captured setup with main assertion on pure encoded bytes | `R4` | `T3` | `PURE_POLICY_SEAM` | exact UTF-8 TLV bytes with no normalization | C03 supports T1 lone-surrogate rejection |
| `A-C10_PURE_INTEGER` | the pure encoder emits fixed signed i64be bytes | zero, positive, negative, minimum-safe, and maximum-safe integers match literal vectors | authenticated captured setup with main assertion on pure integer bytes | `R4` | `T3` | `PURE_POLICY_SEAM` | tag `03` plus exact eight-byte signed big-endian value | C03 supports T1 invalid-number rejection |
| `A-C11_PURE_OBJECT_ORDER` | object order is raw UTF-16 code-unit order | insertion permutations, numeric-looking keys, prefix keys, and supplementary keys match the frozen comparator | authenticated captured setup with main assertion on exact sorted bytes | `R4` | `T3` | `PURE_POLICY_SEAM` | identical bytes for equal records regardless of insertion order | comparator source and no-locale denylist are supporting authority |
| `A-C12_ARRAY_STRUCTURE` | only dense standard arrays are captured and their order is preserved | dense controls succeed in order; sparse, keyed, out-of-range, invalid length, and accessor arrays fail exactly | direct hostile array capture matrix with ordered controls | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact success or `SPARSE_ARRAY`, `KEYED_ARRAY`, `INVALID_ARRAY_LENGTH_DESCRIPTOR`, `ACCESSOR_PROPERTY` | no role or event tuple authority |
| `A-C13_DIAGNOSTIC_STABILITY` | failures disclose only fixed bounded diagnostics | representative failure families prove exact code, phase, path, limit summary, quarantine, truncation, and absence of raw content | direct hostile capture, token, internal-read, and serializer diagnostic matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact five-field `CanonicalRuntimeDiagnostic` with no raw data | diagnostic enums and bounded path contract only |
| `A-C14_ADDITIVE_COMPATIBILITY` | A is additive and cannot relabel or migrate legacy formats | new constants and APIs are distinct, V1 is closed, denylisted legacy files remain byte-identical, and existing regressions remain green | API/version isolation assertion, static allowlist inspection, and unchanged legacy regression execution | `R4` | `T3` | `PURE_POLICY_SEAM` | no migration, alias, old digest relabeling, or legacy file change | existing command-fingerprint regression is supporting authority only |
| `A-C15_CROSS_PLATFORM_BYTES` | the frozen pure literal vectors are platform-independent | identical vector expectations are prepared for Windows and Linux execution without locale or platform branches | pure literal-vector assertions in A plus deferred exact-platform execution support | `R4` | `T3` | `PURE_POLICY_SEAM` | exact same TLV byte literals on every supported platform | `PLANNED_SUPPORTING_AUTHORITY {purpose:WINDOWS_LINUX_BYTE_IDENTITY, expectedStatus:ACCEPTED, mutationExpectation:NONE, consumers:[A-C15]}` owned later by P2F1R-D |

This design contains no implementation-time `Actual` fields. Final physical identities and `MechanismMatch` belong to implementation traceability after code and tests exist.

## 26. Stop-Loss

Stop immediately on any of these exact conditions:

1. Node `util.types.isProxy` cannot truthfully preserve the zero-installed-trap contract for ordinary and revoked Proxies under the frozen runtime.
2. implementation requires raw-byte capture, SHA, digest, cryptographic framing, or any hash change;
3. implementation requires an event type, event envelope, payload schema, or event validator;
4. implementation requires replay, rebuild, persistence, snapshot, or accepted-history authority;
5. implementation requires a BOTC domain field, ID, character, role, impairment, or non-empty-field rule;
6. implementation requires a second production module beyond `canonical-runtime-value.ts` plus additive `index.ts` exports;
7. implementation requires ownership, total-test runner, coverage, profile, workflow, Windows routing, or CI changes;
8. the token must become publicly constructible, branded by exported authority, hydratable, or persistable;
9. the backing reader must become an ordinary package-root public value or expose either registry;
10. the serializer cannot remain deterministic, single-allocation, and total for every issued token within the frozen limits;
11. the ten-byte header and cross-platform byte contract cannot be frozen without environment or locale dependence;
12. traceability cannot retain one criterion, one trust class, and one primary mechanism per physical semantic identity.

Disposition:

- return `HUMAN_BLOCKED` for a proven runtime, security, or authority impossibility;
- return `RESLICE_REQUIRED` for scope, file-allowlist, dependency, domain, hash, event, or CI expansion;
- never silently widen A;
- never weaken the threat model, diagnostics, limits, tests, or traceability to avoid Stop-Loss;
- never enter implementation without the independent design gate and separate user authorization.

## 27. Independent design review protocol

The next action is a fresh independent read-only design review. The reviewer must not be the design author, sole writer, or controller.

The reviewer independently reads:

- the P2F1R-A governance precheck;
- this complete design;
- current canonical-data, command fingerprint, event-stream-validator, package index, and package-boundary code;
- Node `24.15.0` Proxy identity authority;
- Traceability V1.1 ADR;
- `docs/agent-loop/REVIEW_PROTOCOL.md`;
- current git branch, HEAD, worktree, and the exact design SHA.

The review checks all 18 gates:

1. exact authorization, metadata, round, current HEAD, and precheck hash;
2. one-risk A scope and complete non-goals;
3. closed canonical value domain;
4. truthful Proxy-first, zero-installed-trap semantics;
5. descriptor-only, getter-free, exception-safe capture order;
6. token public type is `object` and runtime authority is only private WeakSet and WeakMap;
7. private backing union, deep freeze, detachment, and exact byte-size invariant;
8. exact public constants, types, result unions, diagnostics, metrics, and functions;
9. package-private C seam is omitted from the package root and cannot issue authority;
10. exact ten-byte ASCII `BOTCCRV+01` header and tags `00` through `06`;
11. Unicode, integer, array, object, comparator, and byte-framing determinism;
12. exact generic resource accounting, at-limit semantics, and bounded diagnostics;
13. token clone, lookalike, mutation, alias, and returned-buffer isolation;
14. compatibility, encoder-only versioning, and legacy denylist;
15. production, test, documentation, dependency, and infrastructure allowlists;
16. all 15 Traceability V1.1 rows have exactly nine design-time fields, R1 and R2 sets are empty, and T1/T3 mechanisms are not conflated;
17. all 12 Stop-Loss conditions and dispositions are enforceable;
18. no implementation, code, test, control-state, PR, CI, or future child Slice has started.

The reviewer returns exactly one verdict:

- `RULE_DESIGN_PASS`;
- `RULE_DESIGN_FIX_REQUIRED`;
- `HUMAN_BLOCKED`.

The reviewer’s complete output must be returned verbatim. The design author, writer, and controller may not manufacture, summarize into, or infer a passing verdict.

Even `RULE_DESIGN_PASS` leaves `implementationAuthorized=false` until the user separately authorizes implementation.

### Design terminal state

designStatus: `NOT_REVIEWED`

designVerdict: `PENDING_INDEPENDENT_DESIGN_REVIEW`

implementationAuthorized: `false`

productionCodeChanged: `false`

testsChanged: `false`

eventSchemaChanged: `false`

hashScopeEntered: `false`

P2FEntered: `false`

P2F1R_B_C_D_Started: `false`

requiredNextAction: `RUN_ONE_FRESH_INDEPENDENT_READ_ONLY_DESIGN_REVIEW; DO_NOT_IMPLEMENT`

READY_FOR_INDEPENDENT_DESIGN_REVIEW_ROUND_1
