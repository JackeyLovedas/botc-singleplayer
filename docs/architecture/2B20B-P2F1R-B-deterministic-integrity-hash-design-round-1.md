# Phase 3 Slice 2B20B-P2F1R-B — Deterministic Integrity Hash Foundation

## Design Round 1

## 1. Metadata and authority

- `sliceId`: `2B20B-P2F1R-B`
- `authorization`:
  `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_B_DESIGN_MATERIALIZATION_AND_INDEPENDENT_REVIEW_RETRY_ONLY`
- `originalDesignAuthorization`:
  `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_B_DESIGN_ROUND_1_ONLY`
- `designRound`: `1 / 2`
- `designStatus`: `NOT_REVIEWED`
- `implementationAuthorized`: `false`
- `currentHead`: `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`
- `branch`: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`
- `acceptedMain`: `0dc046aa62b3a72cbd97d99808e0932bf408a09c`
- `AInputCommit`: `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`
- `AProductionProvenance`: `f3be36c7b195c3743df4d8213734d72908fed7e5`
- `ruleEvidence`: `docs/rules/evidence/2B20B-P2F1R-B.md`
- `ruleEvidenceSha256`:
  `d4be6aff94194d8f403a1abfb47aa6fc08ef02020e28cf78038f24e4e537c7d7`
- `ruleVerdict`: `RULE_READY`
- `unresolvedRuleConflicts`: `[]`
- `governancePrecheck`:
  `docs/architecture/2B20B-P2F1R-B-deterministic-integrity-hash-governance-precheck.md`
- `governancePrecheckSha256`:
  `cb753d93665ceabcab9ca51723d72c0f9a2ef371683e889ad0bc691def9d94d4`
- `governancePrecheckVerdict`: `GO`
- `sliceCoverageTarget`: `FOUNDATION`
- `roleCoverageImpact`: `NONE`
- `PRAcceptance`: `UNACCEPTED`

This file is the complete Design Round 1 authority for B. It does not authorize
implementation. A later implementation requires both an independent
`RULE_DESIGN_PASS` on this exact file and a separate user authorization.

## 2. Bounded objective

B freezes one transformation:

```text
caller-supplied byte view
  -> hostile-safe private byte copy
  -> domain-separated binary frame
  -> SHA-256 digest bytes
  -> lowercase hexadecimal display
```

B owns only:

- three integrity domains;
- deterministic binary framing;
- a generic two-component future-binding envelope;
- SHA-256 generation and verification;
- exact closed result records;
- exact closed diagnostics;
- deterministic failure precedence.

B proves only equality of exact copied bytes under one frozen domain and
protocol. It does not prove origin, authenticity, acceptance, semantic
validity, history completeness, state truth, or authority.

## 3. Exact scope and non-goals

### 3.1 The only three domains

1. `RAW_A_TLV_INTEGRITY`
2. `CANONICAL_VALUE_INTEGRITY`
3. `FUTURE_BINDING_INTEGRITY`

No fourth domain is authorized.

### 3.2 Explicit non-goals

B does not define, validate, modify, or authorize:

- A capture, A tokens, A private backing, or A TLV serialization;
- a TLV parser, decoder, repairer, normalizer, or header validator;
- event types, event payloads, batches, receipts, commands, journals, or
  streams;
- replay, rebuild, accepted history, persistence, or aggregate authority;
- `GameState`, canonical state, snapshots, or state handles;
- `canonicalStateHash` or `snapshotHash`;
- application idempotency or existing command fingerprints;
- projections, player knowledge, Storyteller knowledge, roles, tasks,
  impairments, ledgers, Dreamer, Vigormortis, or No Dashii;
- ownership registries, coverage profiles, workflows, Windows routing, CI, or
  publication evidence.

Snapshots remain `CACHE_ONLY`. A valid B digest cannot promote any snapshot,
event stream, state, or artifact into authority.

## 4. Dependency and authority graph

```text
frozen A byte contract ──> B deterministic integrity module
                       \
                        └──> C structural event validation

frozen A + B + C outputs ──> later P2F trusted-history design
frozen A + B + C tests   ──> D evidence/publication closure
```

The constraints are:

- A does not depend on B.
- B has no runtime import from or call into A.
- C depends on A only and must not consume B.
- Later P2F may separately consume A, B, and C.
- D may consume frozen test identities as evidence, but has no runtime
  dependency and cannot change B semantics.
- A, C, D, and P2F are not modified or started by this design.

## 5. Mandatory A compatibility boundary

B consumes bytes only.

B must not:

- import or call `captureCanonicalRuntimeValue`;
- accept, authenticate, inspect, or invoke an A token;
- import or call `serializeCanonicalRuntimeValue`;
- import or call A's package-private backing reader;
- parse, decode, validate, canonicalize, normalize, modify, or reinterpret A
  TLV;
- issue an A token or a competing provenance token;
- access the original value from which bytes were produced.

Positive test setup may call A outside B and then pass only the resulting byte
array into B. B itself still receives `unknown`.

The A literals:

- `botc-canonical-runtime-value-v1`;
- `botc-canonical-runtime-tlv-be-v1`;

are copied into B as frozen protocol metadata. This is a literal compatibility
contract, not an A runtime dependency.

`CANONICAL_VALUE_INTEGRITY` is a semantic role selected by the caller. B cannot
prove that the supplied bytes came from A. Structurally admissible arbitrary
bytes can be hashed, but the result must never be described as authenticated,
accepted, issued, or canonicalized by B.

The same input bytes under `RAW_A_TLV_INTEGRITY` and
`CANONICAL_VALUE_INTEGRITY` must yield different frames and digests solely
because the domain identifiers differ.

## 6. Frozen protocol identifiers

Every identifier is case-sensitive ASCII. The bytes below are normative.

| Meaning | ASCII | Length | Hex bytes |
|---|---|---:|---|
| outer frame magic | `BOTCCRH+01` | 10 | `424f54434352482b3031` |
| hash protocol version | `botc-canonical-runtime-integrity-sha256-framed-v1` | 49 | `626f74632d63616e6f6e6963616c2d72756e74696d652d696e746567726974792d7368613235362d6672616d65642d7631` |
| algorithm | `SHA-256` | 7 | `5348412d323536` |
| raw domain | `RAW_A_TLV_INTEGRITY` | 19 | `5241575f415f544c565f494e54454752495459` |
| canonical-value domain | `CANONICAL_VALUE_INTEGRITY` | 25 | `43414e4f4e4943414c5f56414c55455f494e54454752495459` |
| future-binding domain | `FUTURE_BINDING_INTEGRITY` | 24 | `4655545552455f42494e44494e475f494e54454752495459` |
| A value version | `botc-canonical-runtime-value-v1` | 31 | `626f74632d63616e6f6e6963616c2d72756e74696d652d76616c75652d7631` |
| A serialization version | `botc-canonical-runtime-tlv-be-v1` | 32 | `626f74632d63616e6f6e6963616c2d72756e74696d652d746c762d62652d7631` |
| binding-envelope magic | `BOTCCRB+01` | 10 | `424f54434352422b3031` |
| binding version | `botc-future-binding-envelope-v1` | 31 | `626f74632d6675747572652d62696e64696e672d656e76656c6f70652d7631` |
| display encoding | `lowercase-hex` | 13 | `6c6f776572636173652d686578` |

There is no NUL terminator, BOM, newline, normalization, case conversion,
padding, or platform-default encoding.

## 7. Hash-domain contract

### 7.1 `RAW_A_TLV_INTEGRITY`

- Domain identifier: exact ASCII `RAW_A_TLV_INTEGRITY`.
- Input: one exact private copy of the supplied byte view.
- Version: hash protocol, A value, and A serialization versions in section 6.
- Payload: the copied bytes without parsing or modification.
- Output: exactly 32 SHA-256 digest bytes internally and exactly 64 lowercase
  hexadecimal characters externally.
- Meaning: exact-byte integrity under the raw semantic role only.

It does not prove the bytes originated from A.

### 7.2 `CANONICAL_VALUE_INTEGRITY`

- Domain identifier: exact ASCII `CANONICAL_VALUE_INTEGRITY`.
- Input: one exact private copy of the supplied byte view.
- Version: hash protocol, A value, and A serialization versions in section 6.
- Payload: the copied bytes without parsing or modification.
- Output: exactly 32 SHA-256 digest bytes internally and exactly 64 lowercase
  hexadecimal characters externally.
- Meaning: exact-byte integrity under the caller-selected canonical-value
  semantic role.

It does not authenticate the A producer or establish semantic canonicality.

### 7.3 `FUTURE_BINDING_INTEGRITY`

- Domain identifier: exact ASCII `FUTURE_BINDING_INTEGRITY`.
- Input: two separately admitted and copied opaque byte views:
  binding metadata TLV bytes followed by bound payload TLV bytes.
- Version: hash protocol, A value, A serialization, and binding-envelope
  versions in section 6.
- Payload: the exact binary binding envelope in section 9.
- Output: exactly 32 SHA-256 digest bytes internally and exactly 64 lowercase
  hexadecimal characters externally.
- Meaning: integrity of one ordered relationship between two exact opaque byte
  sequences.

It does not validate either member or issue state, event, replay, snapshot, or
history authority.

## 8. Outer domain-separation frame

The complete SHA-256 preimage is exactly:

```text
10 bytes  ASCII "BOTCCRH+01"

u32be     hashProtocolVersion ASCII byte length
bytes     "botc-canonical-runtime-integrity-sha256-framed-v1"

u32be     domain ASCII byte length
bytes     selected domain identifier

u32be     algorithm ASCII byte length
bytes     "SHA-256"

u32be     A value-version ASCII byte length
bytes     "botc-canonical-runtime-value-v1"

u32be     A serialization-version ASCII byte length
bytes     "botc-canonical-runtime-tlv-be-v1"

u64be     payload byte length
bytes     exact private payload bytes
```

The order is immutable. There are no delimiters, terminators, JSON values,
implicit coercions, trailing bytes, or optional fields.

### 8.1 Integer widths

- `u32be` is exactly four unsigned big-endian bytes, range
  `0..4_294_967_295`.
- `u64be` is exactly eight unsigned big-endian bytes, range
  `0..18_446_744_073_709_551_615`.
- Runtime byte lengths start as bounded nonnegative safe integers.
- A length is converted to `BigInt` only for `u64be` encoding.
- Checked additions occur before allocation.
- An unsafe or overflowing result returns `ARITHMETIC_OVERFLOW`.

### 8.2 Exact frame overheads

Outer overhead is `157 + domainByteLength`:

- raw: `176` bytes plus payload;
- canonical value: `182` bytes plus payload;
- future binding: `181` bytes plus payload.

## 9. Nested future-binding envelope

The outer payload for `FUTURE_BINDING_INTEGRITY` is exactly:

```text
10 bytes  ASCII "BOTCCRB+01"

u32be     bindingVersion ASCII byte length
bytes     "botc-future-binding-envelope-v1"

u64be     bindingMetadataTlvBytes length
bytes     exact private copy of bindingMetadataTlvBytes

u64be     boundPayloadTlvBytes length
bytes     exact private copy of boundPayloadTlvBytes
```

Rules:

- components are admitted and copied separately, left to right;
- each component has its own `16_777_216` byte maximum;
- if the second admission fails, the first private copy is discarded;
- neither component is parsed, inspected, canonicalized, or modified;
- component order cannot vary;
- no timestamp, environment, machine, path, random value, event, receipt,
  history, state, snapshot, or authority field is added;
- the maximum envelope length is `33_554_493` bytes;
- the maximum outer future-binding frame length is `33_554_674` bytes.

## 10. Hostile-safe byte admission and private copying

Every byte parameter is `unknown`.

The exact admission order for each candidate is:

1. Reject `null` or a non-object with `INVALID_BYTE_INPUT`.
2. Invoke captured `node:util` `types.isProxy` before any array/view,
   prototype, or property operation.
3. If Proxy identity is true or the probe throws, return
   `PROXY_BYTE_INPUT`. No installed Proxy trap may execute.
4. Use captured typed-array intrinsics to require a genuine
   `Uint8Array` internal slot. Reject `DataView`, other typed-array kinds,
   `ArrayBuffer`, and forged views as `WRONG_BYTE_VIEW`.
5. After the Proxy probe, reject Node `Buffer` using the captured
   `Buffer.isBuffer` operation.
6. After the Proxy probe, use the captured intrinsic
   `Object.getPrototypeOf` and require identity equality with the current
   realm's exact `Uint8Array.prototype`. This rejects `Buffer`, subclasses,
   cross-realm variants, and nonstandard prototypes with
   `WRONG_BYTE_VIEW`.
7. Read buffer, byte offset, and byte length only through captured intrinsic
   typed-array getters; never read caller-shadowable properties.
8. Reject `SharedArrayBuffer` backing with `SHARED_BYTE_BUFFER`.
9. Require a genuine ordinary `ArrayBuffer`.
10. Reconstruct a native `Uint8Array` view over the captured
    buffer/offset/length inside an exception boundary. Failure returns
    `DETACHED_BYTE_BUFFER`.
11. Reject byte length greater than `16_777_216` with
    `BYTE_INPUT_TOO_LARGE`.
12. Allocate one private ordinary non-shared `Uint8Array`. Allocation failure
    returns `BYTE_COPY_ALLOCATION_FAILED`.
13. Copy with the captured intrinsic typed-array set operation. Copy failure
    returns `BYTE_COPY_FAILED`.
14. Use only the private copy thereafter.

The implementation must capture the relevant intrinsics at module load and
must not invoke caller-controlled getters, iterators, coercions, species
constructors, or methods.

An empty genuine `Uint8Array` is admissible because B does not enforce or
redefine A's TLV header. Hashing it does not claim that it is a valid A
serialization.

Arguments are handled left to right. No later argument is inspected after an
earlier failure. Caller mutation after copying cannot change the framed bytes.
No private input copy is retained after the operation.

## 11. SHA-256 and digest-display contract

- Algorithm: SHA-256 from the existing Node runtime.
- Preimage: exactly one complete outer frame.
- Digest bytes: exactly 32 module-private bytes.
- Display/storage value: exactly 64 lowercase ASCII hexadecimal characters.
- Display pattern: `^[0-9a-f]{64}$`.
- Hex alphabet: exact `0123456789abcdef`.
- No `0x` prefix, uppercase, whitespace, newline, truncation, or BOM.
- Public records expose only `digestHex`, never internal digest bytes.
- Verification decodes valid hex into a fresh private 32-byte array.
- Comparison processes all 32 positions without early exit.
- A digest implementation result other than exactly 32 bytes returns
  `INTERNAL_HASH_FAILURE`.

Digest bytes and display hex are distinct representations. Display encoding
does not change or extend the digest.

## 12. Exact source-module API

The following surface exists only in
`packages/domain-core/src/canonical-runtime-hash.ts`. It is not exported from
`packages/domain-core/src/index.ts`.

```ts
export const CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION =
  "botc-canonical-runtime-integrity-sha256-framed-v1" as const;

export const CANONICAL_RUNTIME_INTEGRITY_ALGORITHM =
  "SHA-256" as const;

export const CANONICAL_RUNTIME_INTEGRITY_DIGEST_ENCODING =
  "lowercase-hex" as const;

export const CANONICAL_RUNTIME_INTEGRITY_MAX_A_TLV_BYTES =
  16_777_216 as const;

export const FUTURE_BINDING_VERSION =
  "botc-future-binding-envelope-v1" as const;

export type CanonicalRuntimeIntegrityDomain =
  | "RAW_A_TLV_INTEGRITY"
  | "CANONICAL_VALUE_INTEGRITY"
  | "FUTURE_BINDING_INTEGRITY";
```

### 12.1 Exact direct-record shape

Raw and canonical-value records have exactly nine enumerable own data fields:

```ts
export type DirectCanonicalRuntimeIntegrityRecord = {
  readonly domain:
    | "RAW_A_TLV_INTEGRITY"
    | "CANONICAL_VALUE_INTEGRITY";
  readonly hashProtocolVersion:
    typeof CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION;
  readonly algorithm:
    typeof CANONICAL_RUNTIME_INTEGRITY_ALGORITHM;
  readonly canonicalRuntimeValueVersion:
    "botc-canonical-runtime-value-v1";
  readonly canonicalRuntimeSerializationVersion:
    "botc-canonical-runtime-tlv-be-v1";
  readonly payloadByteLength: number;
  readonly framedPreimageByteLength: number;
  readonly digestEncoding:
    typeof CANONICAL_RUNTIME_INTEGRITY_DIGEST_ENCODING;
  readonly digestHex: string;
};
```

### 12.2 Exact future-binding record shape

Future-binding records have exactly twelve enumerable own data fields:

```ts
export type FutureBindingIntegrityRecord = {
  readonly domain: "FUTURE_BINDING_INTEGRITY";
  readonly hashProtocolVersion:
    typeof CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION;
  readonly algorithm:
    typeof CANONICAL_RUNTIME_INTEGRITY_ALGORITHM;
  readonly canonicalRuntimeValueVersion:
    "botc-canonical-runtime-value-v1";
  readonly canonicalRuntimeSerializationVersion:
    "botc-canonical-runtime-tlv-be-v1";
  readonly bindingVersion: typeof FUTURE_BINDING_VERSION;
  readonly bindingMetadataTlvByteLength: number;
  readonly boundPayloadTlvByteLength: number;
  readonly payloadByteLength: number;
  readonly framedPreimageByteLength: number;
  readonly digestEncoding:
    typeof CANONICAL_RUNTIME_INTEGRITY_DIGEST_ENCODING;
  readonly digestHex: string;
};
```

For direct records, `payloadByteLength` is the copied byte length. For future
binding, it is the complete nested-envelope length.

### 12.3 Closed result unions

```ts
export type CreateCanonicalRuntimeIntegrityResult<
  TRecord extends
    | DirectCanonicalRuntimeIntegrityRecord
    | FutureBindingIntegrityRecord,
> =
  | {
      readonly ok: true;
      readonly record: TRecord;
    }
  | {
      readonly ok: false;
      readonly failure: CanonicalRuntimeIntegrityFailure;
    };

export type VerifyCanonicalRuntimeIntegrityResult =
  | {
      readonly ok: true;
      readonly matchesExactBytes: true;
    }
  | {
      readonly ok: false;
      readonly failure: CanonicalRuntimeIntegrityFailure;
    };
```

### 12.4 Exact functions

```ts
export function createRawATlvIntegrity(
  rawATlvBytes: unknown,
): CreateCanonicalRuntimeIntegrityResult<
  DirectCanonicalRuntimeIntegrityRecord & {
    readonly domain: "RAW_A_TLV_INTEGRITY";
  }
>;

export function verifyRawATlvIntegrity(
  storedCandidate: unknown,
  rawATlvBytes: unknown,
): VerifyCanonicalRuntimeIntegrityResult;

export function createCanonicalValueIntegrity(
  canonicalValueTlvBytes: unknown,
): CreateCanonicalRuntimeIntegrityResult<
  DirectCanonicalRuntimeIntegrityRecord & {
    readonly domain: "CANONICAL_VALUE_INTEGRITY";
  }
>;

export function verifyCanonicalValueIntegrity(
  storedCandidate: unknown,
  canonicalValueTlvBytes: unknown,
): VerifyCanonicalRuntimeIntegrityResult;

export function createFutureBindingIntegrity(
  bindingMetadataTlvBytes: unknown,
  boundPayloadTlvBytes: unknown,
): CreateCanonicalRuntimeIntegrityResult<
  FutureBindingIntegrityRecord
>;

export function verifyFutureBindingIntegrity(
  storedCandidate: unknown,
  bindingMetadataTlvBytes: unknown,
  boundPayloadTlvBytes: unknown,
): VerifyCanonicalRuntimeIntegrityResult;
```

Creation does not accept domain, algorithm, version, length, encoding, or
digest metadata from callers. Verification accepts the stored record as
`unknown`, validates its exact shape, and then recomputes from newly copied
bytes.

## 13. Closed diagnostic union

```ts
export type CanonicalRuntimeIntegrityFailurePhase =
  | "BYTE_ADMISSION"
  | "RECORD_ADMISSION"
  | "BINDING"
  | "FRAMING"
  | "DIGEST"
  | "COMPARISON";

export type CanonicalRuntimeIntegrityFailureInput =
  | "RAW_A_TLV_BYTES"
  | "CANONICAL_VALUE_TLV_BYTES"
  | "BINDING_METADATA_TLV_BYTES"
  | "BOUND_PAYLOAD_TLV_BYTES"
  | "STORED_RECORD"
  | "INTERNAL";

export type CanonicalRuntimeIntegrityFailureCode =
  | "INVALID_BYTE_INPUT"
  | "PROXY_BYTE_INPUT"
  | "WRONG_BYTE_VIEW"
  | "SHARED_BYTE_BUFFER"
  | "DETACHED_BYTE_BUFFER"
  | "BYTE_INPUT_TOO_LARGE"
  | "BYTE_COPY_ALLOCATION_FAILED"
  | "BYTE_COPY_FAILED"
  | "INVALID_RECORD_TYPE"
  | "PROXY_RECORD"
  | "NONPLAIN_RECORD"
  | "SYMBOL_RECORD_KEY"
  | "MISSING_RECORD_FIELD"
  | "EXTRA_RECORD_FIELD"
  | "ACCESSOR_RECORD_FIELD"
  | "NONENUMERABLE_RECORD_FIELD"
  | "INVALID_RECORD_FIELD_TYPE"
  | "UNSUPPORTED_DOMAIN"
  | "DOMAIN_MISMATCH"
  | "UNSUPPORTED_ALGORITHM"
  | "UNSUPPORTED_HASH_PROTOCOL_VERSION"
  | "UNSUPPORTED_CANONICAL_RUNTIME_VALUE_VERSION"
  | "UNSUPPORTED_CANONICAL_RUNTIME_SERIALIZATION_VERSION"
  | "UNSUPPORTED_BINDING_VERSION"
  | "INVALID_METADATA_LENGTH"
  | "METADATA_LENGTH_MISMATCH"
  | "INVALID_DIGEST_ENCODING"
  | "INVALID_DIGEST_LENGTH"
  | "INVALID_DIGEST_HEX"
  | "ARITHMETIC_OVERFLOW"
  | "BINDING_ALLOCATION_FAILED"
  | "FRAME_ALLOCATION_FAILED"
  | "INTERNAL_HASH_FAILURE"
  | "DIGEST_MISMATCH";

export type CanonicalRuntimeIntegrityFailure = {
  readonly code: CanonicalRuntimeIntegrityFailureCode;
  readonly phase: CanonicalRuntimeIntegrityFailurePhase;
  readonly input: CanonicalRuntimeIntegrityFailureInput;
};
```

Every failure has exactly these three enumerable own data fields. There is no
open string message, exception text, property name, caller value, path, byte
excerpt, frame excerpt, or digest excerpt.

Failure never returns a partial record, partial digest, private byte copy, or
authority claim.

## 14. Stored-record admission and verification precedence

Verification uses this exact order:

1. stored candidate is `null` or non-object;
2. Proxy identity or Proxy-probe failure;
3. array or nonplain prototype;
4. own-key acquisition failure;
5. symbol key;
6. descriptor capture failure without reading values;
7. `domain` missing, accessor, non-enumerable, or wrong type;
8. unsupported domain;
9. domain mismatch with the selected wrapper;
10. missing domain-specific fields in frozen declaration order;
11. extra string fields, ordered by raw UTF-16 code units;
12. accessor fields in frozen declaration order;
13. non-enumerable fields in frozen declaration order;
14. remaining field runtime types;
15. unsupported algorithm;
16. unsupported hash-protocol version;
17. unsupported A value version;
18. unsupported A serialization version;
19. unsupported future-binding version;
20. length fields are not nonnegative safe integers;
21. digest encoding is not exact `lowercase-hex`;
22. digest is not a string of exactly 64 code units;
23. digest contains a non-lowercase-ASCII-hex character;
24. input-byte admission and copying in function-argument order;
25. binding-envelope checked arithmetic and allocation;
26. component-length comparisons in record-field order;
27. payload-length comparison;
28. outer-frame checked arithmetic and allocation;
29. framed-preimage-length comparison;
30. SHA-256 execution and exact 32-byte result validation;
31. all-position 32-byte comparison;
32. digest mismatch.

Only the first failure is returned. No later field or argument is examined
after failure.

Creation uses:

1. byte admission and copying in argument order;
2. checked binding-envelope arithmetic and allocation when applicable;
3. checked outer-frame arithmetic and allocation;
4. SHA-256;
5. complete record construction.

## 15. Metadata participation

| Field | Digest participation |
|---|---|
| outer magic | participates |
| hash protocol version | participates |
| selected domain | participates |
| algorithm | participates |
| A value version | participates |
| A serialization version | participates |
| payload length | participates as `u64be` |
| payload bytes | participates |
| binding-envelope magic | participates for future binding |
| binding version | participates for future binding |
| each binding component length | participates for future binding |
| each binding component bytes | participates for future binding |
| record `payloadByteLength` | derived display field; verified against recomputation |
| component-length record fields | derived display fields; verified against recomputation |
| `framedPreimageByteLength` | derived display field; verified against recomputation |
| `digestEncoding` | exact display contract |
| `digestHex` | display/storage representation of digest bytes |

The following never participate and are absent from records:

- timestamp;
- locale;
- environment;
- process identifier;
- host or machine identifier;
- filesystem path;
- platform marker;
- random data;
- object identity;
- insertion order.

## 16. Module-private core

The production module may have private implementations for:

- byte admission and private copying;
- constant ASCII framing;
- checked length arithmetic;
- `u32be` and `u64be` writing;
- future-binding envelope construction;
- outer-frame construction;
- SHA-256 execution;
- lowercase hexadecimal encoding and decoding;
- fixed-length digest comparison;
- exact stored-record validation.

None is exported. There is no test-only export, alternative framing API,
dependency injection hook, or authority token.

Allocation, copy, and internal-hash failure codes remain mandatory runtime
semantics. When the supported runtime offers no safe deterministic way to
force those platform failures, their evidence is static source review and
exception-boundary inspection. Tests must not install production test hooks,
monkey-patch trusted intrinsics, or claim a fabricated runtime path.

## 17. Normative known-answer vectors

All hexadecimal payloads are contiguous bytes; spaces are not part of input.

| Case | Domain | Payload hex | Frame length | Digest hex |
|---|---|---|---:|---|
| empty opaque sequence | `RAW_A_TLV_INTEGRITY` | empty | 176 | `aff01a6e6280a1d199fe48523a012f0389dd3d1c17c89e0277e31277b3af299e` |
| same empty sequence under another role | `CANONICAL_VALUE_INTEGRITY` | empty | 182 | `5823f4d83dc4807f4ebf0822bf74efc66c013576af6eea81a19ab4913b3933c6` |
| A V1 `null` TLV | `RAW_A_TLV_INTEGRITY` | `424f54434352562b303100` | 187 | `bf8cc45b3e7fa358cdae010d62c9b98c792c88ebc34fe2fd8075f9f5f338b24d` |
| same A V1 `null` TLV | `CANONICAL_VALUE_INTEGRITY` | `424f54434352562b303100` | 193 | `ae69f6ddf0bf00b8169ff7fd71b8ff4ae805d9f802c669971b16cf17a55cb16b` |
| A V1 U+1F600 string TLV | `CANONICAL_VALUE_INTEGRITY` | `424f54434352562b30310400000004f09f9880` | 201 | `67766958407313afa18fd70edebe68fbee0ab73d3a81538cfb743550cb21b67b` |
| A V1 LF string TLV | `CANONICAL_VALUE_INTEGRITY` | `424f54434352562b303104000000010a` | 198 | `8c333023fb93e9f1771e44610d78ba36c1a1d4c5a8655e44682fc5258f068adb` |
| A V1 CRLF string TLV | `CANONICAL_VALUE_INTEGRITY` | `424f54434352562b303104000000020d0a` | 199 | `9cf2d5c3a8c79306ca1869c0aa574fa359e2ff2e0ab9ecf12ff0452892ba7e93` |
| A V1 object vector | `CANONICAL_VALUE_INTEGRITY` | frozen in implementation test as one literal A vector | 203 | `0be0bd6f6ad7b00235d8cd4fba920e14b2826dc000d11f77d2f509e90e8957eb` |
| A V1 array vector | `CANONICAL_VALUE_INTEGRITY` | frozen in implementation test as one literal A vector | 204 | `fd69af3bee7fffd9742863adf8b27521d69ac7c40f8b4d6ba9dba4e3471f2044` |
| binding: A null metadata + A true payload | `FUTURE_BINDING_INTEGRITY` | nested envelope below | 264 | `02e73017cc61bb6c2040bf845b2547d8b54090523b422d6ec6521087beacca3a` |
| 16 MiB zero bytes | `RAW_A_TLV_INTEGRITY` | `00` repeated `16_777_216` times | 16,777,392 | `5b16291767acea6df17e0c12b4b76888ded0d8bd59c611744afa1b9771a74e68` |

The future-binding envelope vector is exactly:

```text
424f54434352422b3031
0000001f
626f74632d6675747572652d62696e64696e672d656e76656c6f70652d7631
000000000000000b
424f54434352562b303100
000000000000000b
424f54434352562b303102
```

Its envelope length is `83`, and the outer future-binding frame length is
`264`.

The implementation test must materialize the full object and array payload
hex before using their listed digests. If the independent recomputation does
not reproduce a listed frame length and digest, implementation stops rather
than changing the protocol silently.

## 18. Verification behavior

Generation:

- admits and privately copies bytes;
- builds the exact domain frame;
- computes SHA-256;
- emits a complete exact record.

Verification:

- validates the candidate record as hostile `unknown`;
- admits and privately copies supplied bytes;
- rebuilds all derived lengths and frames;
- recomputes SHA-256;
- compares all digest bytes;
- returns only verified exact-byte equality or one closed failure.

The following fail closed:

- any byte mutation;
- metadata or binding-component mutation;
- hash-protocol version mutation;
- A value or serialization version mutation;
- binding version mutation;
- domain substitution;
- algorithm substitution;
- missing, extra, accessor, symbol, or non-enumerable fields;
- false stored lengths;
- uppercase, prefixed, truncated, extended, or malformed digest encoding;
- digest mismatch;
- internal framing, allocation, arithmetic, copy, or hash failure.

## 19. Non-authority invariants

A B record or successful verification:

- is not an authority token;
- cannot create canonical state;
- cannot create trusted or accepted history;
- cannot admit replay;
- cannot validate event order or atomic batches;
- cannot validate receipts;
- cannot establish persistence compatibility;
- cannot prove a snapshot matches events;
- cannot authorize an artifact;
- cannot prove A provenance;
- cannot prove semantic validity.

A caller can create self-consistent bytes and hashes. They remain untrusted
until a later separately designed semantic owner validates and authorizes them.

No export, field, type, function, or diagnostic may contain issuer, accepted,
trusted, approval, replay-authority, state-authority, or provenance-handle
semantics.

## 20. Legacy isolation

`packages/application/src/command-fingerprint.ts` remains a separate legacy,
application-specific SHA-256 mechanism.

B must not:

- import it;
- edit it or its tests;
- alias or migrate its schema;
- replace its canonical JSON with A TLV;
- reinterpret an existing fingerprint as a B digest;
- change idempotency or stored receipt behavior.

Legacy tests may be run unchanged as supporting compatibility evidence only.

## 21. Traceability V1.1 plan

### 21.1 Reachability and trust sets

```text
ExpectedR1PrimarySet = []
ExpectedR2PrimarySet = []
ExpectedR3PrimarySet = [
  hostile or invalid byte input,
  hostile stored record,
  unsupported domain or version,
  invalid digest encoding,
  digest mismatch
]
ExpectedR4PrimarySet = [
  deterministic raw-byte integrity,
  deterministic canonical-value-role integrity,
  deterministic future-binding integrity,
  domain separation,
  non-authority and additive compatibility
]
```

Public creation and verification wrappers are `T1`. Module-private framing,
SHA-256, hexadecimal conversion, and comparison are `T3`. There is no B `T2`
entry.

R1 and R2 stay empty. No criterion or physical test may use `MIXED`,
`MULTI_LAYER`, or more than one primary layer.

### 21.2 Nine-field matrix

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `B-C01_RAW_COPY_BOUNDARY` | Every byte input is admitted without caller behavior and copied once to private storage | null/nonobject, Proxy, revoked Proxy, wrong view, Buffer, subclass, nonstandard prototype, shared, detached, oversized, and mutation cases fail or remain isolated; platform-only allocation/copy failures retain reviewed exception boundaries | hostile public-wrapper matrix plus static source review for unreachable allocation/copy branches; no test hook | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact private copy or closed failure, zero installed Proxy traps, no retained caller view | A maximum size and Node typed-array/Proxy runtime behavior are supporting authority |
| `B-C02_RAW_TLV_HASH` | Raw role binds exact copied bytes under its frozen domain | literal vectors match; a one-byte change changes verification; no A provenance is claimed | public raw wrapper and literal known-answer vectors, with A serialization used only outside B for positive setup | `R4` | `T1` | `PURE_POLICY_SEAM` | exact raw-role record and digest | frozen A bytes/version contract is setup authority only |
| `B-C03_CANONICAL_VALUE_HASH` | Canonical-value role is deterministic and distinct while consuming bytes only | equal supplied A TLV bytes match; unequal bytes differ; B never accepts a token or calls A | external A setup followed by public B byte-only wrapper and literal vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | exact canonical-value-role record without provenance claim | frozen A token/TLV flow is supporting setup outside B |
| `B-C04_FUTURE_BINDING_HASH` | Future binding binds two ordered opaque byte sequences without semantic authority | equal pairs match; component, order, byte, and binding-version mutations fail or differ | public binding wrapper and literal nested-envelope vectors | `R4` | `T1` | `PURE_POLICY_SEAM` | exact binding-integrity record only | future semantic owner remains external and unimplemented |
| `B-C05_ROLE_DOMAIN_SEPARATION` | Identical payload bytes under distinct roles cannot alias | raw and canonical roles produce different literal frames and digests; future binding has its own domain and nested envelope | literal framed-preimage and digest vectors | `R4` | `T3` | `PURE_POLICY_SEAM` | three unambiguous domain-separated digests | exact protocol/domain literals in this design |
| `B-C06_RESULT_METADATA` | Stored records have exact closed shape and deterministic metadata | missing, extra, symbol, accessor, non-enumerable, wrong-type, false-length, wrong-algorithm, and wrong-version candidates reject in precedence order | hostile public verification record matrix | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact closed failure or fully validated record | no external supporting authority |
| `B-C07_DIGEST_VERIFICATION` | Verification recomputes instead of trusting stored metadata or digest | valid records verify; byte, domain, version, length, encoding, and digest mutations reject | public verification matrix with known-answer positives | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `matchesExactBytes:true` or one closed failure | known-answer vectors support positive cases |
| `B-C08_FAILURE_PRECEDENCE` | Compound invalid input returns one deterministic bounded failure | combined-invalid candidates follow section 14, do not throw, do not inspect later inputs, and disclose no caller data | compound hostile matrix with trap/getter counters | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact first applicable three-field failure | frozen failure order in this design |
| `B-C09_HASH_NOT_AUTHORITY` | Integrity evidence cannot issue state/history/replay authority | exports and result shapes contain no token, issuer, registry, approval, accepted-source, or authority capability | source/export/result-shape inspection plus self-consistent caller-created control | `R4` | `T3` | `PURE_POLICY_SEAM` | integrity evidence only | later P2F authority remains separately required |
| `B-C10_CACHE_ONLY` | Snapshot-shaped bytes remain non-authoritative cache data | no snapshot/state semantic API, hash role, rebuild, comparison, repair, selection, or authority exists | source and allowlist inspection plus generic binding control | `R4` | `T3` | `PURE_POLICY_SEAM` | generic byte-integrity result only | replay and state owners remain outside B |
| `B-C11_LEGACY_ISOLATION` | B is additive and does not migrate existing hashes | A and application fingerprint files remain byte-identical; B has no alias, import, reinterpretation, or package-root export | changed-file denylist, source inspection, and unchanged regression execution | `R4` | `T3` | `PURE_POLICY_SEAM` | no migration or legacy behavior change | existing regressions are supporting evidence only |
| `B-C12_PLATFORM_VECTOR_READINESS` | Binary framing and known-answer vectors have no platform-dependent input | literals use ASCII, big-endian lengths, SHA-256, and fixed hex with no locale, time, environment, path, random, JSON, or platform branch | literal-vector audit and production-source determinism inspection | `R4` | `T3` | `PURE_POLICY_SEAM` | identical expected frames and digests | later D-owned Windows/Linux execution is planned supporting authority |

Implementation traceability must bind each physical test identity exactly once.
It must not invent an R1/R2 primary identity or claim unavailable cross-platform
execution evidence.

## 22. Implementation allowlist

This design does not authorize implementation. If the user later authorizes B
implementation, the complete file allowlist is:

### Production

- new `packages/domain-core/src/canonical-runtime-hash.ts`

### Tests

- new `packages/domain-core/src/canonical-runtime-hash.test.ts`

### B-only documentation

- this design;
- one B implementation traceability document;
- independently produced B design/implementation review documents when
  separately authorized.

There is no fixture file, second source module, package-root export, or
dependency change.

## 23. Exact denylist

B must not modify:

- `packages/domain-core/src/canonical-runtime-value.ts`;
- `packages/domain-core/src/canonical-runtime-value.test.ts`;
- `packages/domain-core/src/index.ts`;
- any A architecture, traceability, or review artifact;
- `canonical-data.ts`;
- any event, event schema, applier, validator, stream, replay, rebuild,
  `GameState`, state, snapshot, persistence, or receipt file;
- any application, command-fingerprint, role, task, projection, impairment,
  ledger, Dreamer, Vigormortis, or No Dashii file;
- package manifests, lockfile, dependencies, runtime, package-manager,
  TypeScript, ESLint, Vitest, timeout, project, or logical-group configuration;
- ownership registries, inventories, coverage configuration, workflow, Windows
  routing, CI scripts, or agent-loop controls;
- the role coverage matrix.

## 24. Planned local validation for a later implementation

A separately authorized implementation would run:

```text
corepack pnpm@11.7.0 exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/canonical-runtime-hash.test.ts
corepack pnpm@11.7.0 exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/canonical-runtime-value.test.ts
corepack pnpm@11.7.0 exec vitest run --workspace vitest.workspace.ts packages/application/src/command-fingerprint.test.ts
corepack pnpm@11.7.0 exec eslint packages/domain-core/src/canonical-runtime-hash.ts packages/domain-core/src/canonical-runtime-hash.test.ts --max-warnings 0
corepack pnpm@11.7.0 typecheck
corepack pnpm@11.7.0 lint
corepack pnpm@11.7.0 test
git diff --check
```

Coverage, Windows/Linux evidence, workflow routing, exact-head hosted CI, and
publication remain D scope and are not claimed by B.

## 25. Rollback

Rollback of a future B implementation removes only:

- `packages/domain-core/src/canonical-runtime-hash.ts`;
- `packages/domain-core/src/canonical-runtime-hash.test.ts`;
- B-only implementation traceability/review documents.

There is no migration, stored-data reinterpretation, A change, history rewrite,
or legacy hash relabeling.

## 26. Stop-Loss

Return `RESLICE_REQUIRED` if any of these becomes necessary:

1. any A file change;
2. `index.ts` or another shared production change;
3. more than one B production module;
4. an event, batch, receipt, command, replay, state, or snapshot schema;
5. a fourth hash domain;
6. `canonicalStateHash` or `snapshotHash`;
7. migration, aliasing, or reinterpretation of command fingerprints;
8. a package-root public export;
9. ownership, coverage, workflow, Windows, CI, or publication work;
10. a future semantic owner's validation inside B;
11. an R1/R2 primary criterion without new accepted evidence;
12. `MIXED` or `MULTI_LAYER` traceability;
13. a second production/test file or a test-only production hook.

Return `HUMAN_BLOCKED` if:

- the exact A input commit or production provenance cannot be verified;
- deterministic SHA-256 framing cannot be implemented under the frozen
  runtime;
- hostile byte admission cannot remain exception-safe and caller-behavior-free;
- a hash must become authority to satisfy a consumer;
- accepted history would need rewrite or reinterpretation;
- a substantive rule conflict appears;
- safe continuation needs ungranted permissions or external mutation.

No test, diagnostic, or review requirement may be satisfied by weakening the
contract or inventing a path that the runtime cannot produce safely.

## 27. Independent design-review protocol

The fresh reviewer must be read-only and independent from the design architect,
materializing writer, and controller. It must inspect this actual repository
artifact, not an in-memory summary.

The reviewer independently checks:

1. the file exists and is bound to the exact authorization, HEAD, evidence,
   and precheck hash;
2. exactly three complete hash domains exist;
3. the outer and nested binary frames are unambiguous and non-JSON;
4. SHA-256, digest bytes, lowercase hex, and fixed lengths are complete;
5. participating and excluded metadata are deterministic;
6. generation and hostile verification fail closed;
7. failures are a closed union with deterministic precedence;
8. B consumes only bytes and does not redefine or call A;
9. B creates no authority, event, replay, state, snapshot, or application
   capability;
10. all twelve traceability rows contain exactly the required nine fields,
    R1/R2 remain empty, and primary layers are legal;
11. allowlist and denylist are enforceable;
12. no production code, tests, commit, push, PR, CI, C, D, or P2F work has
    started.

The verdict is exactly one of:

- `RULE_DESIGN_PASS`;
- `RULE_DESIGN_FIX_REQUIRED`;
- `HUMAN_BLOCKED`.

Even `RULE_DESIGN_PASS` leaves `implementationAuthorized=false`.

## 28. Terminal state

designStatus: `READY_FOR_INDEPENDENT_DESIGN_REVIEW`

implementationAuthorized: `false`

productionCodeChanged: `false`

testsChanged: `false`

AChanged: `false`

eventReplayStateSnapshotChanged: `false`

P2F1R_C_D_Started: `false`

P2FAuthorityStarted: `false`

requiredNextAction:
`RUN_ONE_FRESH_INDEPENDENT_READ_ONLY_DESIGN_REVIEW; DO_NOT_IMPLEMENT`

READY_FOR_INDEPENDENT_DESIGN_REVIEW_ROUND_1
