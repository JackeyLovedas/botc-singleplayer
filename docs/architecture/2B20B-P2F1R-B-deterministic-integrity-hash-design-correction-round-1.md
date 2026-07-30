# Phase 3 Slice 2B20B-P2F1R-B — Design Correction Round 1

## Failure Contract and Hash Preimage Closure

## 1. Metadata

- `sliceId`: `2B20B-P2F1R-B`
- `correctionRound`: `1 / 1`
- `authorization`:
  `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_B_DESIGN_CORRECTION_ROUND_1_ONLY`
- `correctionScope`: `B-DR1-B01_AND_B-DR1-B02_ONLY`
- `parentDesign`:
  `docs/architecture/2B20B-P2F1R-B-deterministic-integrity-hash-design-round-1.md`
- `parentDesignSha256`:
  `2e7d909af750b3a97e6a39484b635ee69acc7f6f78c09f69f1f63217fd29cf34`
- `reviewBlockers`:
  `[B-DR1-B01_FAILURE_TRIPLES_NOT_FROZEN,
  B-DR1-B02_TWO_NORMATIVE_PREIMAGES_UNSPECIFIED]`
- `ruleEvidence`: `docs/rules/evidence/2B20B-P2F1R-B.md`
- `ruleEvidenceVerdict`: `RULE_READY`
- `AInputCommit`: `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`
- `implementationAuthorized`: `false`
- `productionCodeChanged`: `false`
- `testsChanged`: `false`

This correction supplies:

1. the complete normative failure-path matrix missing under
   `B-DR1-B01_FAILURE_TRIPLES_NOT_FROZEN`;
2. the unique logical Canonical Hash Preimage V1 framing and two complete
   payload vectors missing under
   `B-DR1-B02_TWO_NORMATIVE_PREIMAGES_UNSPECIFIED`.

It changes no domain identifier, hash byte, digest, public create/verify
function, success-record shape, implementation allowlist, dependency
direction, authority boundary, or BOTC rule.

## 2. Supersession boundary

This correction and the exact parent design must be read together.

| Parent authority | Correction treatment |
|---|---|
| Section 8, outer frame | superseded by Section 5; exact byte sequence is unchanged |
| Section 9, future-binding envelope | superseded by Section 6; bytes and lengths are unchanged; positional and record-key order become explicit |
| Section 13, failure object | superseded completely by Sections 3–4 |
| Section 14, precedence | superseded completely by Sections 7–8 |
| Section 17 object/array rows | superseded by Section 9; all other vectors remain unchanged |
| Traceability row `B-C05` | superseded by Section 10.1 |
| Traceability row `B-C08` | superseded by Section 10.2 |
| Every other parent section and traceability row | unchanged and normative |

The failure-code vocabulary remains unchanged. The parent field `input` and
its parent phase/input literal vocabularies are removed from authority and
replaced by this correction's `inputKind` contract.

## 3. Corrected public failure contract

Every public failure has exactly three enumerable own data fields:

```ts
export type CanonicalRuntimeIntegrityFailurePhase =
  | "HASH_PREIMAGE_BUILD"
  | "DIGEST_COMPUTATION"
  | "DIGEST_VERIFICATION"
  | "TLV_INPUT_ACCEPTANCE"
  | "BINDING_METADATA_VALIDATION";

export type CanonicalRuntimeIntegrityFailureInputKind =
  | "TLV_BYTES"
  | "BINDING_METADATA"
  | "HASH_DOMAIN"
  | "DIGEST_BYTES"
  | "DIGEST_TEXT";

export type CanonicalRuntimeIntegrityFailure = {
  readonly code: CanonicalRuntimeIntegrityFailureCode;
  readonly phase: CanonicalRuntimeIntegrityFailurePhase;
  readonly inputKind: CanonicalRuntimeIntegrityFailureInputKind;
};
```

No compatibility alias for the parent `input` field is permitted.

Every failure object is complete and frozen. It has no optional field, nested
diagnostic, arbitrary string, object reference, key name, array index, raw
value, path, event, `GameState`, authority, payload byte, frame byte, digest
fragment, exception message, or stack.

### 3.1 Exact phase meanings

- `TLV_INPUT_ACCEPTANCE`: admission and private copying of a caller-supplied
  byte argument.
- `BINDING_METADATA_VALIDATION`: hostile validation of the unknown stored
  integrity record and its declared metadata.
- `HASH_PREIMAGE_BUILD`: checked construction of the nested binding envelope
  or outer Canonical Hash Preimage V1.
- `DIGEST_COMPUTATION`: SHA-256 execution and validation of its internal
  32-byte result.
- `DIGEST_VERIFICATION`: comparison of recomputed digest bytes with decoded
  stored digest bytes.

### 3.2 Exact input-kind meanings

- `TLV_BYTES`: raw, canonical-value, or bound-payload byte arguments.
- `BINDING_METADATA`: either the `bindingMetadataTlvBytes` positional
  argument, or the unknown stored integrity record and its
  non-domain/non-digest metadata.
- `HASH_DOMAIN`: the selected or stored hash-domain identifier and the outer
  domain frame.
- `DIGEST_BYTES`: module-private 32-byte digest output or comparison.
- `DIGEST_TEXT`: the stored `digestEncoding` and `digestHex` fields.

`BINDING_METADATA` is the permitted logical classification for hostile stored
record shape. It does not assert that the record is valid future-binding
metadata and confers no authority.

The only permitted input kinds are those five literals. Raw objects,
`GameState`, events, and authority are never diagnostic input kinds.

## 4. Complete normative failure diagnostic matrix

### 4.1 Field-to-input-kind mapping

| Expected stored field | `inputKind` |
|---|---|
| `domain` | `HASH_DOMAIN` |
| `digestEncoding` | `DIGEST_TEXT` |
| `digestHex` | `DIGEST_TEXT` |
| every other declared record field | `BINDING_METADATA` |

Errors not attributable to one expected field—invalid outer record, Proxy,
nonplain record, symbol key, extra key, or descriptor acquisition—use
`BINDING_METADATA`.

### 4.2 Byte-argument mapping

| Public argument | `inputKind` |
|---|---|
| `rawATlvBytes` | `TLV_BYTES` |
| `canonicalValueTlvBytes` | `TLV_BYTES` |
| `boundPayloadTlvBytes` | `TLV_BYTES` |
| `bindingMetadataTlvBytes` | `BINDING_METADATA` |

All four byte positions use phase `TLV_INPUT_ACCEPTANCE`.

### 4.3 Frozen fail-closed behavior profiles

The matrix binds every path to one exact behavior profile:

- `FC-A_BYTE_REJECT`:
  return the exact failure triple; stop before inspecting any later argument;
  discard every private copy already made; do not construct a binding
  envelope, preimage, digest, hex value, or success record.
- `FC-B_RECORD_REJECT`:
  return the exact failure triple; stop before byte-argument admission and
  hashing; do not read accessor values or later invalid fields; do not return
  validated metadata, a preimage, digest, or success record.
- `FC-C_PREIMAGE_REJECT`:
  return the exact failure triple; discard all private inputs and every
  partial envelope/frame allocation; do not initialize or run SHA-256; do not
  return bytes, digest text, or a success record.
- `FC-D_DIGEST_REJECT`:
  return the exact failure triple; discard preimage and digest state; do not
  return partial digest bytes, digest text, or a success record.
- `FC-E_VERIFY_REJECT`:
  return the exact failure triple after all-position comparison; discard
  private inputs and both digest byte arrays; do not return
  `matchesExactBytes:true`, bytes, or authority.

No implementation may weaken or combine these profiles.

### 4.4 Failure path matrix

| Code | Exact context | Exact phase | Exact inputKind | Exact failClosedBehavior |
|---|---|---|---|---|
| `INVALID_BYTE_INPUT` | raw, canonical-value, or bound-payload argument | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` | `FC-A_BYTE_REJECT` |
| `INVALID_BYTE_INPUT` | binding-metadata byte argument | `TLV_INPUT_ACCEPTANCE` | `BINDING_METADATA` | `FC-A_BYTE_REJECT` |
| `PROXY_BYTE_INPUT` | raw, canonical-value, or bound-payload argument | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` | `FC-A_BYTE_REJECT` |
| `PROXY_BYTE_INPUT` | binding-metadata byte argument | `TLV_INPUT_ACCEPTANCE` | `BINDING_METADATA` | `FC-A_BYTE_REJECT` |
| `WRONG_BYTE_VIEW` | raw, canonical-value, or bound-payload argument | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` | `FC-A_BYTE_REJECT` |
| `WRONG_BYTE_VIEW` | binding-metadata byte argument | `TLV_INPUT_ACCEPTANCE` | `BINDING_METADATA` | `FC-A_BYTE_REJECT` |
| `SHARED_BYTE_BUFFER` | raw, canonical-value, or bound-payload argument | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` | `FC-A_BYTE_REJECT` |
| `SHARED_BYTE_BUFFER` | binding-metadata byte argument | `TLV_INPUT_ACCEPTANCE` | `BINDING_METADATA` | `FC-A_BYTE_REJECT` |
| `DETACHED_BYTE_BUFFER` | raw, canonical-value, or bound-payload argument | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` | `FC-A_BYTE_REJECT` |
| `DETACHED_BYTE_BUFFER` | binding-metadata byte argument | `TLV_INPUT_ACCEPTANCE` | `BINDING_METADATA` | `FC-A_BYTE_REJECT` |
| `BYTE_INPUT_TOO_LARGE` | raw, canonical-value, or bound-payload argument | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` | `FC-A_BYTE_REJECT` |
| `BYTE_INPUT_TOO_LARGE` | binding-metadata byte argument | `TLV_INPUT_ACCEPTANCE` | `BINDING_METADATA` | `FC-A_BYTE_REJECT` |
| `BYTE_COPY_ALLOCATION_FAILED` | raw, canonical-value, or bound-payload copy | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` | `FC-A_BYTE_REJECT` |
| `BYTE_COPY_ALLOCATION_FAILED` | binding-metadata copy | `TLV_INPUT_ACCEPTANCE` | `BINDING_METADATA` | `FC-A_BYTE_REJECT` |
| `BYTE_COPY_FAILED` | raw, canonical-value, or bound-payload copy | `TLV_INPUT_ACCEPTANCE` | `TLV_BYTES` | `FC-A_BYTE_REJECT` |
| `BYTE_COPY_FAILED` | binding-metadata copy | `TLV_INPUT_ACCEPTANCE` | `BINDING_METADATA` | `FC-A_BYTE_REJECT` |
| `INVALID_RECORD_TYPE` | null, nonobject, or failed safe outer classification | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `PROXY_RECORD` | stored candidate is Proxy or Proxy probe fails | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `NONPLAIN_RECORD` | array, exotic, class instance, or forbidden prototype | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `SYMBOL_RECORD_KEY` | any own symbol key | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `MISSING_RECORD_FIELD` | missing `domain` | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` | `FC-B_RECORD_REJECT` |
| `MISSING_RECORD_FIELD` | missing `digestEncoding` or `digestHex` | `BINDING_METADATA_VALIDATION` | `DIGEST_TEXT` | `FC-B_RECORD_REJECT` |
| `MISSING_RECORD_FIELD` | any other missing required field | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `EXTRA_RECORD_FIELD` | any extra string field | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `ACCESSOR_RECORD_FIELD` | accessor at `domain` | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` | `FC-B_RECORD_REJECT` |
| `ACCESSOR_RECORD_FIELD` | accessor at `digestEncoding` or `digestHex` | `BINDING_METADATA_VALIDATION` | `DIGEST_TEXT` | `FC-B_RECORD_REJECT` |
| `ACCESSOR_RECORD_FIELD` | accessor at another required field | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `NONENUMERABLE_RECORD_FIELD` | non-enumerable `domain` | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` | `FC-B_RECORD_REJECT` |
| `NONENUMERABLE_RECORD_FIELD` | non-enumerable `digestEncoding` or `digestHex` | `BINDING_METADATA_VALIDATION` | `DIGEST_TEXT` | `FC-B_RECORD_REJECT` |
| `NONENUMERABLE_RECORD_FIELD` | another non-enumerable required field | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `INVALID_RECORD_FIELD_TYPE` | wrong runtime type for `domain` | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` | `FC-B_RECORD_REJECT` |
| `INVALID_RECORD_FIELD_TYPE` | wrong runtime type for `digestEncoding` or `digestHex` | `BINDING_METADATA_VALIDATION` | `DIGEST_TEXT` | `FC-B_RECORD_REJECT` |
| `INVALID_RECORD_FIELD_TYPE` | wrong runtime type for another field | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `UNSUPPORTED_DOMAIN` | string is not one of the three domains | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` | `FC-B_RECORD_REJECT` |
| `DOMAIN_MISMATCH` | supported domain differs from verify wrapper | `BINDING_METADATA_VALIDATION` | `HASH_DOMAIN` | `FC-B_RECORD_REJECT` |
| `UNSUPPORTED_ALGORITHM` | algorithm differs from `SHA-256` | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `UNSUPPORTED_HASH_PROTOCOL_VERSION` | hash protocol differs from V1 | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `UNSUPPORTED_CANONICAL_RUNTIME_VALUE_VERSION` | A value version differs | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `UNSUPPORTED_CANONICAL_RUNTIME_SERIALIZATION_VERSION` | A serialization version differs | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `UNSUPPORTED_BINDING_VERSION` | future-binding version differs | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `INVALID_METADATA_LENGTH` | any declared length is not a nonnegative safe integer | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `METADATA_LENGTH_MISMATCH` | component, payload, envelope, or preimage length differs | `BINDING_METADATA_VALIDATION` | `BINDING_METADATA` | `FC-B_RECORD_REJECT` |
| `INVALID_DIGEST_ENCODING` | `digestEncoding` is not exact `lowercase-hex` | `BINDING_METADATA_VALIDATION` | `DIGEST_TEXT` | `FC-B_RECORD_REJECT` |
| `INVALID_DIGEST_LENGTH` | `digestHex` is not exactly 64 code units | `BINDING_METADATA_VALIDATION` | `DIGEST_TEXT` | `FC-B_RECORD_REJECT` |
| `INVALID_DIGEST_HEX` | digest contains a non-lowercase-ASCII-hex character | `BINDING_METADATA_VALIDATION` | `DIGEST_TEXT` | `FC-B_RECORD_REJECT` |
| `ARITHMETIC_OVERFLOW` | future-binding envelope arithmetic | `HASH_PREIMAGE_BUILD` | `BINDING_METADATA` | `FC-C_PREIMAGE_REJECT` |
| `ARITHMETIC_OVERFLOW` | direct or future outer-frame arithmetic | `HASH_PREIMAGE_BUILD` | `HASH_DOMAIN` | `FC-C_PREIMAGE_REJECT` |
| `BINDING_ALLOCATION_FAILED` | nested future-binding envelope allocation | `HASH_PREIMAGE_BUILD` | `BINDING_METADATA` | `FC-C_PREIMAGE_REJECT` |
| `FRAME_ALLOCATION_FAILED` | complete Canonical Hash Preimage V1 allocation | `HASH_PREIMAGE_BUILD` | `HASH_DOMAIN` | `FC-C_PREIMAGE_REJECT` |
| `INTERNAL_HASH_FAILURE` | hash initialization, update, finalization, or non-32-byte result | `DIGEST_COMPUTATION` | `DIGEST_BYTES` | `FC-D_DIGEST_REJECT` |
| `DIGEST_MISMATCH` | all-position digest comparison is unequal | `DIGEST_VERIFICATION` | `DIGEST_BYTES` | `FC-E_VERIFY_REJECT` |

No failure code may be emitted with a context, phase, input kind, or behavior
absent from this matrix.

### 4.5 Exact representative triples

```ts
{
  code: "PROXY_RECORD",
  phase: "BINDING_METADATA_VALIDATION",
  inputKind: "BINDING_METADATA",
}

{
  code: "UNSUPPORTED_DOMAIN",
  phase: "BINDING_METADATA_VALIDATION",
  inputKind: "HASH_DOMAIN",
}

{
  code: "INVALID_DIGEST_HEX",
  phase: "BINDING_METADATA_VALIDATION",
  inputKind: "DIGEST_TEXT",
}

{
  code: "BINDING_ALLOCATION_FAILED",
  phase: "HASH_PREIMAGE_BUILD",
  inputKind: "BINDING_METADATA",
}

{
  code: "INTERNAL_HASH_FAILURE",
  phase: "DIGEST_COMPUTATION",
  inputKind: "DIGEST_BYTES",
}

{
  code: "DIGEST_MISMATCH",
  phase: "DIGEST_VERIFICATION",
  inputKind: "DIGEST_BYTES",
}
```

## 5. Unique Canonical Hash Preimage V1

There is exactly one normative preimage:

```text
CanonicalHashPreimageV1 =
  DomainFrame
  || VersionFrame
  || LengthFrame
  || PayloadFrame
```

`||` is exact byte concatenation without delimiter, conversion, padding,
alignment, or omitted empty frame. No alternate logical decomposition, JSON
form, text form, stream-header form, or serializer is permitted.

### 5.1 `DomainFrame`

```text
10 bytes  ASCII "BOTCCRH+01"

u32be     byte length 49
49 bytes  ASCII "botc-canonical-runtime-integrity-sha256-framed-v1"

u32be     byte length of selected domain
bytes     exactly one:
          "RAW_A_TLV_INTEGRITY"
          "CANONICAL_VALUE_INTEGRITY"
          "FUTURE_BINDING_INTEGRITY"

u32be     byte length 7
7 bytes   ASCII "SHA-256"
```

The hash-protocol identifier belongs to `DomainFrame` because it establishes
the versioned domain-separation namespace. This logical placement preserves
the parent byte sequence.

### 5.2 `VersionFrame`

```text
u32be     byte length 31
31 bytes  ASCII "botc-canonical-runtime-value-v1"

u32be     byte length 32
32 bytes  ASCII "botc-canonical-runtime-tlv-be-v1"
```

These are B protocol literals. Their presence does not import or call A.

### 5.3 `LengthFrame`

```text
u64be     exact PayloadFrame byte length
```

It is always eight unsigned big-endian bytes.

### 5.4 `PayloadFrame`

For `RAW_A_TLV_INTEGRITY`:

```text
bytes     exact private copy of supplied A TLV bytes
```

For `CANONICAL_VALUE_INTEGRITY`:

```text
bytes     exact private copy of supplied A canonical TLV bytes
```

For `FUTURE_BINDING_INTEGRITY`:

```text
bytes     exact FutureBindingEnvelopeV1 from Section 6
```

No payload has a tag or terminator beyond its preceding `u64be` length.

B never captures or serializes an A object, accepts an A token, or proves that
the byte precondition was honored.

### 5.5 Byte compatibility

The exact byte sequence remains:

```text
BOTCCRH+01
protocol length + protocol
domain length + domain
algorithm length + algorithm
A value-version length + version
A serialization-version length + version
payload u64 length
payload
```

All parent digests and frame lengths remain unchanged. Outer overhead remains:

- raw: `176` bytes;
- canonical value: `182` bytes;
- future binding: `181` bytes.

## 6. Exact Future Binding Envelope V1

```text
FutureBindingEnvelopeV1 =
  BindingHeader
  || BindingVersion
  || MetadataLength
  || MetadataPayload
  || BoundPayloadLength
  || BoundPayload
```

### 6.1 Exact binary grammar

```text
BindingHeader:
  10 bytes ASCII "BOTCCRB+01"

BindingVersion:
  u32be    byte length 31
  31 bytes ASCII "botc-future-binding-envelope-v1"

MetadataLength:
  u64be    bindingMetadataTlvBytes private-copy length

MetadataPayload:
  bytes    exact bindingMetadataTlvBytes private copy

BoundPayloadLength:
  u64be    boundPayloadTlvBytes private-copy length

BoundPayload:
  bytes    exact boundPayloadTlvBytes private copy
```

### 6.2 Positional and key order

The public argument order is immutable:

```ts
createFutureBindingIntegrity(
  bindingMetadataTlvBytes,
  boundPayloadTlvBytes,
);

verifyFutureBindingIntegrity(
  storedCandidate,
  bindingMetadataTlvBytes,
  boundPayloadTlvBytes,
);
```

The binding envelope is positional binary data. It accepts no object or map
keys and performs no runtime key sort. Its canonical key order is the closed
protocol declaration:

1. `bindingMetadataTlvBytes`;
2. `boundPayloadTlvBytes`.

Swapping them creates a different envelope.

The future-binding success record's enumerable data fields are created and
validated in this exact declaration order:

1. `domain`
2. `hashProtocolVersion`
3. `algorithm`
4. `canonicalRuntimeValueVersion`
5. `canonicalRuntimeSerializationVersion`
6. `bindingVersion`
7. `bindingMetadataTlvByteLength`
8. `boundPayloadTlvByteLength`
9. `payloadByteLength`
10. `framedPreimageByteLength`
11. `digestEncoding`
12. `digestHex`

Digest meaning never depends on JavaScript insertion order.

### 6.3 Length and nesting

```text
bindingEnvelopeLength =
  10
  + 4 + 31
  + 8 + bindingMetadataTlvByteLength
  + 8 + boundPayloadTlvByteLength

bindingEnvelopeLength =
  61
  + bindingMetadataTlvByteLength
  + boundPayloadTlvByteLength
```

Each component maximum is `16_777_216`.

- maximum envelope: `33_554_493` bytes;
- maximum complete future-binding preimage:
  `181 + 33_554_493 = 33_554_674` bytes.

There is one nesting level only. B does not recursively frame either
component.

No JSON, locale, timestamp, environment, host, machine, path, randomness,
object identity, or insertion order participates.

## 7. Corrected fail-closed precedence

### 7.1 Direct creation

1. admit and privately copy the one byte argument;
2. build `DomainFrame`;
3. build `VersionFrame`;
4. build `LengthFrame`;
5. build `PayloadFrame`;
6. allocate and complete `CanonicalHashPreimageV1`;
7. compute and validate the 32-byte SHA-256 digest;
8. encode 64 lowercase hexadecimal characters;
9. create the complete success record.

The first failure terminates processing. No partial artifact is returned.

### 7.2 Future-binding creation

1. admit and copy `bindingMetadataTlvBytes`;
2. admit and copy `boundPayloadTlvBytes`;
3. check envelope arithmetic;
4. allocate and complete `FutureBindingEnvelopeV1`;
5. build `DomainFrame`;
6. build `VersionFrame`;
7. build `LengthFrame`;
8. use the envelope as `PayloadFrame`;
9. allocate and complete `CanonicalHashPreimageV1`;
10. compute and validate the 32-byte SHA-256 digest;
11. encode 64 lowercase hexadecimal characters;
12. create the complete success record.

If step 2 or later fails, the first private copy is discarded.

### 7.3 Verification

1. reject stored candidate null/nonobject;
2. perform Proxy identity check before reflection;
3. reject array or nonplain prototype;
4. acquire own keys safely;
5. reject symbol keys;
6. acquire descriptors without reading field values;
7. validate `domain` descriptor and type;
8. reject unsupported domain;
9. reject domain mismatch with selected wrapper;
10. select the domain-specific expected key list;
11. check missing fields in declaration order;
12. check extra string fields using raw UTF-16 code-unit order;
13. check accessors in declaration order;
14. check non-enumerable fields in declaration order;
15. check remaining field types;
16. check algorithm;
17. check hash-protocol version;
18. check A value version;
19. check A serialization version;
20. check binding version when applicable;
21. validate every length as a nonnegative safe integer;
22. validate exact `digestEncoding`;
23. validate `digestHex` length;
24. validate every digest-text character;
25. admit and copy byte arguments left to right;
26. construct `FutureBindingEnvelopeV1` when applicable;
27. compare stored component lengths in record-field order;
28. compare stored `payloadByteLength`;
29. build complete `CanonicalHashPreimageV1`;
30. compare stored `framedPreimageByteLength`;
31. compute and validate internal SHA-256 output;
32. decode validated digest text;
33. compare all 32 positions without early exit;
34. return `{ok:true, matchesExactBytes:true}` only if all bytes match;
35. otherwise return `DIGEST_MISMATCH`.

Only the first failure is returned. Record and digest-text validation precede
byte admission. No later field, argument, hash operation, or comparison
executes after failure.

## 8. Three frozen byte-only domain inputs

| Domain | Creation input | Verification inputs | B claim |
|---|---|---|---|
| `RAW_A_TLV_INTEGRITY` | `rawATlvBytes: unknown` | stored candidate plus `rawATlvBytes` | equality of exact copied bytes under the raw domain |
| `CANONICAL_VALUE_INTEGRITY` | `canonicalValueTlvBytes: unknown` | stored candidate plus `canonicalValueTlvBytes` | equality of exact copied bytes under the canonical-value semantic domain |
| `FUTURE_BINDING_INTEGRITY` | two positional unknown byte inputs | stored candidate plus the same two inputs | equality of the exact ordered envelope |

B never accepts raw objects, A tokens, captured backing, `GameState`, events,
batches, receipts, histories, snapshots, or authority records.

B never calls A capture or serialization and never parses or canonicalizes
TLV.

## 9. Corrected normative represented-value vectors

These replace the two incomplete parent rows:

| Represented value | Domain | Complete payload hex | Payload length | Frame length | Digest hex |
|---|---|---|---:|---:|---|
| `{a:null}` | `CANONICAL_VALUE_INTEGRITY` | `424f54434352562b30310600000001000000016100` | 21 | 203 | `0be0bd6f6ad7b00235d8cd4fba920e14b2826dc000d11f77d2f509e90e8957eb` |
| `["a",null]` | `CANONICAL_VALUE_INTEGRITY` | `424f54434352562b3031050000000204000000016100` | 22 | 204 | `fd69af3bee7fffd9742863adf8b27521d69ac7c40f8b4d6ba9dba4e3471f2044` |

The represented values are labels only. B consumes the listed bytes and does
not reconstruct, inspect, or validate the values.

Tests must assert each complete payload, full preimage length, literal digest,
and at least one byte-mutation rejection.

All other parent known-answer vectors remain unchanged.

## 10. Traceability corrections

The design retains exactly twelve criteria. R1 and R2 remain empty. No row uses
`MIXED` or `MULTI_LAYER`.

Only `B-C05` and `B-C08` change.

### 10.1 Replacement `B-C05`

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `B-C05_ROLE_DOMAIN_SEPARATION` | One unique `CanonicalHashPreimageV1 = DomainFrame \|\| VersionFrame \|\| LengthFrame \|\| PayloadFrame` binds each domain without an alternate framing path | identical bytes under raw and canonical-value domains reproduce unchanged distinct frames/digests; future binding uses its domain plus exactly one envelope; `{a:null}` and `["a",null]` reproduce complete corrected vectors | literal full-preimage and digest vectors asserting every frame boundary, domain substitution, envelope nesting, and both complete payloads | `R4` | `T3` | `PURE_POLICY_SEAM` | exactly three unambiguous domain-separated digests under one byte-compatible preimage | parent protocol/domain literals and frozen A TLV bytes are setup authority only; no provenance or history authority |

### 10.2 Replacement `B-C08`

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `B-C08_FAILURE_PRECEDENCE` | Every public failure code has one correction-authorized phase/input-kind/behavior for its exact context, and compound invalid input returns the first safe failure | every code and context variant in Section 4 is covered; objects have exactly `code`, `phase`, `inputKind`; hostile record shape maps to `BINDING_METADATA`; compound cases follow Section 7 without later inspection, throw, disclosure, partial result, or authority | table-driven public-wrapper matrix plus compound Proxy/getter counters and static source inspection for safely unforceable allocation/copy/hash failures; no test hook or trusted-intrinsic monkey-patch | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact first three-field failure and its frozen fail-closed behavior, using only five phases and five input kinds | this correction matrix is design authority; no external authority or invented `SUP-*` ID |

The other ten criteria remain exactly as frozen by the parent.

## 11. Implementation boundary

This correction does not authorize:

- production or test edits;
- changes to A;
- C, D, or P2F work;
- commit, push, PR, CI, coverage, workflow, or publication;
- package-root exports or dependencies;
- a fourth hash domain;
- event, state, replay, snapshot, receipt, history, persistence, or authority
  hashes.

If separately authorized after `RULE_DESIGN_PASS`, B remains limited to:

- `packages/domain-core/src/canonical-runtime-hash.ts`;
- `packages/domain-core/src/canonical-runtime-hash.test.ts`;
- B-only reviewed documentation.

## 12. Correction-specific stop conditions

Stop rather than reinterpret this correction if:

1. a parent byte or digest must change;
2. a failure needs a phase or input kind outside the five-value vocabularies;
3. hostile stored-record shape cannot use `BINDING_METADATA`;
4. a code needs an unlisted context/triple/behavior;
5. a second preimage construction or serializer is required;
6. future binding requires JSON, recursive B framing, or domain-semantic keys;
7. implementation must accept an A token or call A;
8. a corrected vector fails independent recomputation;
9. a traceability row other than `B-C05` or `B-C08` must change;
10. code, A/C/D/P2F, infrastructure, or publication work enters this round.

## 13. Residual review points

- `BINDING_METADATA` deliberately covers both the future metadata-byte
  position and hostile stored integrity records. Phase and code distinguish
  them without introducing a forbidden sixth input kind.
- Allocation and internal-hash failures may be safely unforceable. Their
  triples and fail-closed behavior remain normative and require source review,
  never a production test hook.
- `DomainFrame` contains the hash-protocol identifier to preserve parent bytes
  and digests. Relocating it at the byte level would create an unauthorized
  protocol.
- Canonical-value integrity remains a caller-selected byte role and does not
  prove A provenance.

## 14. Independent review protocol

The fresh independent read-only reviewer must verify:

1. every failure context has one exact code/phase/inputKind/behavior;
2. only the five authorized phases and five input kinds appear;
3. raw objects, `GameState`, events, and authority are absent;
4. one Canonical Hash Preimage V1 preserves all parent bytes and digests;
5. the two completed vectors independently recompute;
6. future-binding order, version, encoding, length, and nesting are complete;
7. B remains byte-only and neither calls nor redefines A;
8. hash results remain non-authoritative and do not touch event/replay/state;
9. exactly twelve traceability rows remain, with only `B-C05` and `B-C08`
   replaced, R1/R2 empty, and no `MIXED`/`MULTI_LAYER`;
10. no production, test, A, C, D, P2F, commit, push, PR, or CI action occurred.

The verdict is exactly:

- `RULE_DESIGN_PASS`;
- `RULE_DESIGN_FIX_REQUIRED`;
- `HUMAN_BLOCKED`.

Even `RULE_DESIGN_PASS` leaves `implementationAuthorized=false`.

## 15. Terminal controls

```text
correctionStatus=READY_FOR_INDEPENDENT_REVIEW
implementationAuthorized=false
productionCodeChanged=false
testsChanged=false
parentBytesChanged=false
parentDigestsChanged=false
domainCount=3
traceabilityCriterionCount=12
updatedTraceabilityCriteria=[B-C05_ROLE_DOMAIN_SEPARATION,B-C08_FAILURE_PRECEDENCE]
R1PrimarySet=[]
R2PrimarySet=[]
codeStarted=false
P2F1R_C_Started=false
P2F1R_D_Started=false
P2FStarted=false
requiredNextAction=RUN_ONE_FRESH_INDEPENDENT_READ_ONLY_REVIEW;DO_NOT_IMPLEMENT
```

READY_FOR_INDEPENDENT_DESIGN_REVIEW_CORRECTION_ROUND_1
