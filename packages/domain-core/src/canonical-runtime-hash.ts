import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { types as utilTypes } from "node:util";

export const CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION =
  "botc-canonical-runtime-integrity-sha256-framed-v1" as const;

export const CANONICAL_RUNTIME_INTEGRITY_ALGORITHM = "SHA-256" as const;

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

export type DirectCanonicalRuntimeIntegrityRecord = {
  readonly domain:
    | "RAW_A_TLV_INTEGRITY"
    | "CANONICAL_VALUE_INTEGRITY";
  readonly hashProtocolVersion:
    typeof CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION;
  readonly algorithm: typeof CANONICAL_RUNTIME_INTEGRITY_ALGORITHM;
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

export type FutureBindingIntegrityRecord = {
  readonly domain: "FUTURE_BINDING_INTEGRITY";
  readonly hashProtocolVersion:
    typeof CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION;
  readonly algorithm: typeof CANONICAL_RUNTIME_INTEGRITY_ALGORITHM;
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
  readonly inputKind: CanonicalRuntimeIntegrityFailureInputKind;
};

export type CreateCanonicalRuntimeIntegrityResult<
  TRecord extends
    | DirectCanonicalRuntimeIntegrityRecord
    | FutureBindingIntegrityRecord
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

type IntegrityRecord =
  | DirectCanonicalRuntimeIntegrityRecord
  | FutureBindingIntegrityRecord;

type FailureResult = {
  readonly ok: false;
  readonly failure: CanonicalRuntimeIntegrityFailure;
};

type ByteAdmissionResult =
  | {
      readonly ok: true;
      readonly bytes: Uint8Array;
    }
  | FailureResult;

type DigestResult =
  | {
      readonly ok: true;
      readonly bytes: Uint8Array;
      readonly hex: string;
    }
  | FailureResult;

type RecordAdmissionResult =
  | {
      readonly ok: true;
      readonly record: IntegrityRecord;
    }
  | FailureResult;

const CANONICAL_RUNTIME_VALUE_VERSION =
  "botc-canonical-runtime-value-v1" as const;
const CANONICAL_RUNTIME_SERIALIZATION_VERSION =
  "botc-canonical-runtime-tlv-be-v1" as const;

const textEncoder = new TextEncoder();
const encodeAscii = (value: string): Uint8Array => textEncoder.encode(value);

const OUTER_MAGIC = encodeAscii("BOTCCRH+01");
const HASH_PROTOCOL_BYTES = encodeAscii(
  CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION
);
const ALGORITHM_BYTES = encodeAscii(CANONICAL_RUNTIME_INTEGRITY_ALGORITHM);
const VALUE_VERSION_BYTES = encodeAscii(CANONICAL_RUNTIME_VALUE_VERSION);
const SERIALIZATION_VERSION_BYTES = encodeAscii(
  CANONICAL_RUNTIME_SERIALIZATION_VERSION
);
const BINDING_MAGIC = encodeAscii("BOTCCRB+01");
const BINDING_VERSION_BYTES = encodeAscii(FUTURE_BINDING_VERSION);

const DOMAIN_BYTES: Readonly<
  Record<CanonicalRuntimeIntegrityDomain, Uint8Array>
> = Object.freeze({
  RAW_A_TLV_INTEGRITY: encodeAscii("RAW_A_TLV_INTEGRITY"),
  CANONICAL_VALUE_INTEGRITY: encodeAscii("CANONICAL_VALUE_INTEGRITY"),
  FUTURE_BINDING_INTEGRITY: encodeAscii("FUTURE_BINDING_INTEGRITY")
});

const DIRECT_KEYS = Object.freeze([
  "domain",
  "hashProtocolVersion",
  "algorithm",
  "canonicalRuntimeValueVersion",
  "canonicalRuntimeSerializationVersion",
  "payloadByteLength",
  "framedPreimageByteLength",
  "digestEncoding",
  "digestHex"
] as const);

const FUTURE_KEYS = Object.freeze([
  "domain",
  "hashProtocolVersion",
  "algorithm",
  "canonicalRuntimeValueVersion",
  "canonicalRuntimeSerializationVersion",
  "bindingVersion",
  "bindingMetadataTlvByteLength",
  "boundPayloadTlvByteLength",
  "payloadByteLength",
  "framedPreimageByteLength",
  "digestEncoding",
  "digestHex"
] as const);

const DIRECT_STRING_FIELDS = Object.freeze([
  "domain",
  "hashProtocolVersion",
  "algorithm",
  "canonicalRuntimeValueVersion",
  "canonicalRuntimeSerializationVersion",
  "digestEncoding",
  "digestHex"
] as const);

const FUTURE_STRING_FIELDS = Object.freeze([
  "domain",
  "hashProtocolVersion",
  "algorithm",
  "canonicalRuntimeValueVersion",
  "canonicalRuntimeSerializationVersion",
  "bindingVersion",
  "digestEncoding",
  "digestHex"
] as const);

const DIRECT_LENGTH_FIELDS = Object.freeze([
  "payloadByteLength",
  "framedPreimageByteLength"
] as const);

const FUTURE_LENGTH_FIELDS = Object.freeze([
  "bindingMetadataTlvByteLength",
  "boundPayloadTlvByteLength",
  "payloadByteLength",
  "framedPreimageByteLength"
] as const);

const getPrototypeOf = Object.getPrototypeOf;
const objectCreate = Object.create;
const freeze = Object.freeze;
const isArray = Array.isArray;
const isSafeInteger = Number.isSafeInteger;
const maxSafeInteger = Number.MAX_SAFE_INTEGER;
const ownKeys = Reflect.ownKeys;
const getOwnPropertyDescriptor = Reflect.getOwnPropertyDescriptor;
const reflectApply = Reflect.apply;
const isProxy = utilTypes.isProxy;
const isUint8Array = utilTypes.isUint8Array;
const isSharedArrayBuffer = utilTypes.isSharedArrayBuffer;
const isArrayBuffer = utilTypes.isArrayBuffer;
const isBuffer = Buffer.isBuffer.bind(Buffer);
const Uint8ArrayConstructor = Uint8Array;
const uint8ArrayPrototype = Uint8Array.prototype;
const arrayBufferPrototype = ArrayBuffer.prototype;
const plainObjectPrototype = Object.prototype;
const typedArrayPrototype = getPrototypeOf(uint8ArrayPrototype) as object;
const typedArrayBufferGetter = getOwnPropertyDescriptor(
  typedArrayPrototype,
  "buffer"
)?.get;
const typedArrayByteOffsetGetter = getOwnPropertyDescriptor(
  typedArrayPrototype,
  "byteOffset"
)?.get;
const typedArrayByteLengthGetter = getOwnPropertyDescriptor(
  typedArrayPrototype,
  "byteLength"
)?.get;
const typedArraySet = getOwnPropertyDescriptor(
  typedArrayPrototype,
  "set"
)?.value as
  | ((this: Uint8Array, source: ArrayLike<number>, offset?: number) => void)
  | undefined;
const stringCharCodeAt = getOwnPropertyDescriptor(
  String.prototype,
  "charCodeAt"
)?.value as (this: string, index: number) => number;
const hashProbe = createHash("sha256");
const hashPrototype = getPrototypeOf(hashProbe) as object;
const hashUpdate = getOwnPropertyDescriptor(hashPrototype, "update")?.value as (
  this: typeof hashProbe,
  data: Uint8Array
) => typeof hashProbe;
const hashDigest = getOwnPropertyDescriptor(hashPrototype, "digest")?.value as (
  this: typeof hashProbe
) => Buffer;

const failure = (
  code: CanonicalRuntimeIntegrityFailureCode,
  phase: CanonicalRuntimeIntegrityFailurePhase,
  inputKind: CanonicalRuntimeIntegrityFailureInputKind
): FailureResult => ({
  ok: false,
  failure: freeze({ code, phase, inputKind })
});

const safeIsProxy = (value: object): boolean | undefined => {
  try {
    return isProxy(value);
  } catch {
    return undefined;
  }
};

const admitBytes = (
  candidate: unknown,
  inputKind: "TLV_BYTES" | "BINDING_METADATA"
): ByteAdmissionResult => {
  if (candidate === null || typeof candidate !== "object") {
    return failure("INVALID_BYTE_INPUT", "TLV_INPUT_ACCEPTANCE", inputKind);
  }

  const proxy = safeIsProxy(candidate);
  if (proxy !== false) {
    return failure("PROXY_BYTE_INPUT", "TLV_INPUT_ACCEPTANCE", inputKind);
  }

  try {
    if (
      isBuffer(candidate) ||
      !isUint8Array(candidate) ||
      getPrototypeOf(candidate) !== uint8ArrayPrototype
    ) {
      return failure("WRONG_BYTE_VIEW", "TLV_INPUT_ACCEPTANCE", inputKind);
    }
  } catch {
    return failure("WRONG_BYTE_VIEW", "TLV_INPUT_ACCEPTANCE", inputKind);
  }

  if (
    typedArrayBufferGetter === undefined ||
    typedArrayByteOffsetGetter === undefined ||
    typedArrayByteLengthGetter === undefined
  ) {
    return failure("WRONG_BYTE_VIEW", "TLV_INPUT_ACCEPTANCE", inputKind);
  }

  let buffer: ArrayBufferLike;
  let byteOffset: number;
  let byteLength: number;
  try {
    buffer = reflectApply(
      typedArrayBufferGetter,
      candidate,
      []
    ) as ArrayBufferLike;
    byteOffset = reflectApply(
      typedArrayByteOffsetGetter,
      candidate,
      []
    ) as number;
    byteLength = reflectApply(
      typedArrayByteLengthGetter,
      candidate,
      []
    ) as number;
  } catch {
    return failure("WRONG_BYTE_VIEW", "TLV_INPUT_ACCEPTANCE", inputKind);
  }

  if (isSharedArrayBuffer(buffer)) {
    return failure("SHARED_BYTE_BUFFER", "TLV_INPUT_ACCEPTANCE", inputKind);
  }

  try {
    if (
      !isArrayBuffer(buffer) ||
      getPrototypeOf(buffer) !== arrayBufferPrototype
    ) {
      return failure("WRONG_BYTE_VIEW", "TLV_INPUT_ACCEPTANCE", inputKind);
    }
  } catch {
    return failure("WRONG_BYTE_VIEW", "TLV_INPUT_ACCEPTANCE", inputKind);
  }

  let source: Uint8Array;
  try {
    source = new Uint8ArrayConstructor(
      buffer,
      byteOffset,
      byteLength
    );
  } catch {
    return failure("DETACHED_BYTE_BUFFER", "TLV_INPUT_ACCEPTANCE", inputKind);
  }

  if (byteLength > CANONICAL_RUNTIME_INTEGRITY_MAX_A_TLV_BYTES) {
    return failure("BYTE_INPUT_TOO_LARGE", "TLV_INPUT_ACCEPTANCE", inputKind);
  }

  let copy: Uint8Array;
  try {
    copy = new Uint8ArrayConstructor(byteLength);
  } catch {
    return failure(
      "BYTE_COPY_ALLOCATION_FAILED",
      "TLV_INPUT_ACCEPTANCE",
      inputKind
    );
  }

  if (typedArraySet === undefined) {
    return failure("BYTE_COPY_FAILED", "TLV_INPUT_ACCEPTANCE", inputKind);
  }
  try {
    reflectApply(typedArraySet, copy, [source]);
  } catch {
    return failure("BYTE_COPY_FAILED", "TLV_INPUT_ACCEPTANCE", inputKind);
  }

  return { ok: true, bytes: copy };
};

const checkedSum = (
  values: readonly number[],
  inputKind: "BINDING_METADATA" | "HASH_DOMAIN"
): number | FailureResult => {
  let total = 0;
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]!;
    if (
      !isSafeInteger(value) ||
      value < 0 ||
      total > maxSafeInteger - value
    ) {
      return failure("ARITHMETIC_OVERFLOW", "HASH_PREIMAGE_BUILD", inputKind);
    }
    total += value;
  }
  return total;
};

const writeU32Be = (target: Uint8Array, offset: number, value: number): number => {
  target[offset] = (value >>> 24) & 0xff;
  target[offset + 1] = (value >>> 16) & 0xff;
  target[offset + 2] = (value >>> 8) & 0xff;
  target[offset + 3] = value & 0xff;
  return offset + 4;
};

const writeU64Be = (target: Uint8Array, offset: number, value: number): number => {
  let remaining = BigInt(value);
  for (let index = 7; index >= 0; index -= 1) {
    target[offset + index] = Number(remaining & 0xffn);
    remaining >>= 8n;
  }
  return offset + 8;
};

const writeBytes = (
  target: Uint8Array,
  offset: number,
  value: Uint8Array
): number => {
  if (typedArraySet === undefined) {
    throw new TypeError("typed array intrinsic unavailable");
  }
  reflectApply(typedArraySet, target, [value, offset]);
  return offset + value.length;
};

const writeLengthPrefixed = (
  target: Uint8Array,
  offset: number,
  value: Uint8Array
): number => writeBytes(target, writeU32Be(target, offset, value.length), value);

const buildBindingEnvelope = (
  metadata: Uint8Array,
  payload: Uint8Array
): ByteAdmissionResult => {
  const total = checkedSum(
    [
      BINDING_MAGIC.length,
      4,
      BINDING_VERSION_BYTES.length,
      8,
      metadata.length,
      8,
      payload.length
    ],
    "BINDING_METADATA"
  );
  if (typeof total !== "number") {
    return total;
  }

  let bytes: Uint8Array;
  try {
    bytes = new Uint8ArrayConstructor(total);
  } catch {
    return failure(
      "BINDING_ALLOCATION_FAILED",
      "HASH_PREIMAGE_BUILD",
      "BINDING_METADATA"
    );
  }

  try {
    let offset = writeBytes(bytes, 0, BINDING_MAGIC);
    offset = writeLengthPrefixed(bytes, offset, BINDING_VERSION_BYTES);
    offset = writeU64Be(bytes, offset, metadata.length);
    offset = writeBytes(bytes, offset, metadata);
    offset = writeU64Be(bytes, offset, payload.length);
    offset = writeBytes(bytes, offset, payload);
    if (offset !== bytes.length) {
      return failure(
        "ARITHMETIC_OVERFLOW",
        "HASH_PREIMAGE_BUILD",
        "BINDING_METADATA"
      );
    }
  } catch {
    return failure(
      "BINDING_ALLOCATION_FAILED",
      "HASH_PREIMAGE_BUILD",
      "BINDING_METADATA"
    );
  }

  return { ok: true, bytes };
};

const buildPreimage = (
  domain: CanonicalRuntimeIntegrityDomain,
  payload: Uint8Array
): ByteAdmissionResult => {
  const domainBytes = DOMAIN_BYTES[domain];
  const total = checkedSum(
    [
      OUTER_MAGIC.length,
      4,
      HASH_PROTOCOL_BYTES.length,
      4,
      domainBytes.length,
      4,
      ALGORITHM_BYTES.length,
      4,
      VALUE_VERSION_BYTES.length,
      4,
      SERIALIZATION_VERSION_BYTES.length,
      8,
      payload.length
    ],
    "HASH_DOMAIN"
  );
  if (typeof total !== "number") {
    return total;
  }

  let bytes: Uint8Array;
  try {
    bytes = new Uint8ArrayConstructor(total);
  } catch {
    return failure(
      "FRAME_ALLOCATION_FAILED",
      "HASH_PREIMAGE_BUILD",
      "HASH_DOMAIN"
    );
  }

  try {
    let offset = writeBytes(bytes, 0, OUTER_MAGIC);
    offset = writeLengthPrefixed(bytes, offset, HASH_PROTOCOL_BYTES);
    offset = writeLengthPrefixed(bytes, offset, domainBytes);
    offset = writeLengthPrefixed(bytes, offset, ALGORITHM_BYTES);
    offset = writeLengthPrefixed(bytes, offset, VALUE_VERSION_BYTES);
    offset = writeLengthPrefixed(bytes, offset, SERIALIZATION_VERSION_BYTES);
    offset = writeU64Be(bytes, offset, payload.length);
    offset = writeBytes(bytes, offset, payload);
    if (offset !== bytes.length) {
      return failure(
        "ARITHMETIC_OVERFLOW",
        "HASH_PREIMAGE_BUILD",
        "HASH_DOMAIN"
      );
    }
  } catch {
    return failure(
      "FRAME_ALLOCATION_FAILED",
      "HASH_PREIMAGE_BUILD",
      "HASH_DOMAIN"
    );
  }

  return { ok: true, bytes };
};

const hexAlphabet = "0123456789abcdef";

const digestPreimage = (preimage: Uint8Array): DigestResult => {
  let output: Uint8Array;
  try {
    const hash = createHash("sha256");
    reflectApply(hashUpdate, hash, [preimage]);
    const digest = reflectApply(hashDigest, hash, []);
    output = new Uint8ArrayConstructor(digest.length);
    if (typedArraySet === undefined) {
      throw new TypeError("typed array intrinsic unavailable");
    }
    reflectApply(typedArraySet, output, [digest]);
  } catch {
    return failure(
      "INTERNAL_HASH_FAILURE",
      "DIGEST_COMPUTATION",
      "DIGEST_BYTES"
    );
  }
  if (output.length !== 32) {
    return failure(
      "INTERNAL_HASH_FAILURE",
      "DIGEST_COMPUTATION",
      "DIGEST_BYTES"
    );
  }
  let hex = "";
  for (let index = 0; index < output.length; index += 1) {
    const byte = output[index]!;
    hex += hexAlphabet[byte >>> 4]! + hexAlphabet[byte & 0x0f]!;
  }
  return { ok: true, bytes: output, hex };
};

const decodeHex = (value: string): Uint8Array => {
  const bytes = new Uint8ArrayConstructor(32);
  for (let index = 0; index < bytes.length; index += 1) {
    const high = reflectApply(stringCharCodeAt, value, [index * 2]);
    const low = reflectApply(stringCharCodeAt, value, [index * 2 + 1]);
    bytes[index] =
      (high <= 0x39 ? high - 0x30 : high - 0x61 + 10) * 16 +
      (low <= 0x39 ? low - 0x30 : low - 0x61 + 10);
  }
  return bytes;
};

const compareDigest = (
  actual: Uint8Array,
  expectedHex: string
): VerifyCanonicalRuntimeIntegrityResult => {
  const expected = decodeHex(expectedHex);
  let difference = 0;
  for (let index = 0; index < 32; index += 1) {
    difference |= actual[index]! ^ expected[index]!;
  }
  return difference === 0
    ? { ok: true, matchesExactBytes: true }
    : failure("DIGEST_MISMATCH", "DIGEST_VERIFICATION", "DIGEST_BYTES");
};

const fieldInputKind = (
  field: string
): "BINDING_METADATA" | "HASH_DOMAIN" | "DIGEST_TEXT" =>
  field === "domain"
    ? "HASH_DOMAIN"
    : field === "digestEncoding" || field === "digestHex"
      ? "DIGEST_TEXT"
      : "BINDING_METADATA";

const recordFailure = (
  code:
    | "MISSING_RECORD_FIELD"
    | "ACCESSOR_RECORD_FIELD"
    | "NONENUMERABLE_RECORD_FIELD"
    | "INVALID_RECORD_FIELD_TYPE",
  field: string
): FailureResult =>
  failure(code, "BINDING_METADATA_VALIDATION", fieldInputKind(field));

const compareCodeUnits = (left: string, right: string): number => {
  const limit = left.length < right.length ? left.length : right.length;
  for (let index = 0; index < limit; index += 1) {
    const difference =
      reflectApply(stringCharCodeAt, left, [index]) -
      reflectApply(stringCharCodeAt, right, [index]);
    if (difference !== 0) {
      return difference < 0 ? -1 : 1;
    }
  }
  return left.length < right.length ? -1 : left.length > right.length ? 1 : 0;
};

const isSupportedDomain = (
  value: string
): value is CanonicalRuntimeIntegrityDomain =>
  value === "RAW_A_TLV_INTEGRITY" ||
  value === "CANONICAL_VALUE_INTEGRITY" ||
  value === "FUTURE_BINDING_INTEGRITY";

const findDescriptor = (
  keys: readonly PropertyKey[],
  descriptors: readonly PropertyDescriptor[],
  field: string
): PropertyDescriptor | undefined => {
  for (let index = 0; index < keys.length; index += 1) {
    if (keys[index] === field) {
      return descriptors[index];
    }
  }
  return undefined;
};

const containsExpectedKey = (
  expectedKeys: readonly string[],
  field: string
): boolean => {
  for (let index = 0; index < expectedKeys.length; index += 1) {
    if (expectedKeys[index] === field) {
      return true;
    }
  }
  return false;
};

const admitRecord = (
  candidate: unknown,
  expectedDomain: CanonicalRuntimeIntegrityDomain
): RecordAdmissionResult => {
  if (candidate === null || typeof candidate !== "object") {
    return failure(
      "INVALID_RECORD_TYPE",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }
  const proxy = safeIsProxy(candidate);
  if (proxy !== false) {
    return failure(
      "PROXY_RECORD",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }

  try {
    if (
      isArray(candidate) ||
      (getPrototypeOf(candidate) !== plainObjectPrototype &&
        getPrototypeOf(candidate) !== null)
    ) {
      return failure(
        "NONPLAIN_RECORD",
        "BINDING_METADATA_VALIDATION",
        "BINDING_METADATA"
      );
    }
  } catch {
    return failure(
      "INVALID_RECORD_TYPE",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }

  let keys: readonly PropertyKey[];
  let descriptors: readonly PropertyDescriptor[];
  try {
    keys = ownKeys(candidate);
    const capturedDescriptors: PropertyDescriptor[] = [];
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index]!;
      if (typeof key === "symbol") {
        return failure(
          "SYMBOL_RECORD_KEY",
          "BINDING_METADATA_VALIDATION",
          "BINDING_METADATA"
        );
      }
      const descriptor = getOwnPropertyDescriptor(candidate, key);
      if (descriptor === undefined) {
        return failure(
          "INVALID_RECORD_TYPE",
          "BINDING_METADATA_VALIDATION",
          "BINDING_METADATA"
        );
      }
      capturedDescriptors[index] = descriptor;
    }
    descriptors = capturedDescriptors;
  } catch {
    return failure(
      "INVALID_RECORD_TYPE",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }

  const domainDescriptor = findDescriptor(keys, descriptors, "domain");
  if (domainDescriptor === undefined) {
    return recordFailure("MISSING_RECORD_FIELD", "domain");
  }
  if (!("value" in domainDescriptor)) {
    return recordFailure("ACCESSOR_RECORD_FIELD", "domain");
  }
  if (domainDescriptor.enumerable !== true) {
    return recordFailure("NONENUMERABLE_RECORD_FIELD", "domain");
  }
  if (typeof domainDescriptor.value !== "string") {
    return recordFailure("INVALID_RECORD_FIELD_TYPE", "domain");
  }
  if (!isSupportedDomain(domainDescriptor.value)) {
    return failure(
      "UNSUPPORTED_DOMAIN",
      "BINDING_METADATA_VALIDATION",
      "HASH_DOMAIN"
    );
  }
  if (domainDescriptor.value !== expectedDomain) {
    return failure(
      "DOMAIN_MISMATCH",
      "BINDING_METADATA_VALIDATION",
      "HASH_DOMAIN"
    );
  }

  const expectedKeys =
    expectedDomain === "FUTURE_BINDING_INTEGRITY" ? FUTURE_KEYS : DIRECT_KEYS;
  for (let index = 0; index < expectedKeys.length; index += 1) {
    const key = expectedKeys[index]!;
    if (findDescriptor(keys, descriptors, key) === undefined) {
      return recordFailure("MISSING_RECORD_FIELD", key);
    }
  }
  let firstExtra: string | undefined;
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index]!;
    if (
      typeof key === "string" &&
      !containsExpectedKey(expectedKeys, key) &&
      (firstExtra === undefined || compareCodeUnits(key, firstExtra) < 0)
    ) {
      firstExtra = key;
    }
  }
  if (firstExtra !== undefined) {
    return failure(
      "EXTRA_RECORD_FIELD",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }
  for (let index = 0; index < expectedKeys.length; index += 1) {
    const key = expectedKeys[index]!;
    if (!("value" in findDescriptor(keys, descriptors, key)!)) {
      return recordFailure("ACCESSOR_RECORD_FIELD", key);
    }
  }
  for (let index = 0; index < expectedKeys.length; index += 1) {
    const key = expectedKeys[index]!;
    if (findDescriptor(keys, descriptors, key)!.enumerable !== true) {
      return recordFailure("NONENUMERABLE_RECORD_FIELD", key);
    }
  }

  const values = objectCreate(null) as Record<string, unknown>;
  for (let index = 0; index < expectedKeys.length; index += 1) {
    const key = expectedKeys[index]!;
    values[key] = findDescriptor(keys, descriptors, key)!.value;
  }
  const stringFields =
    expectedDomain === "FUTURE_BINDING_INTEGRITY"
      ? FUTURE_STRING_FIELDS
      : DIRECT_STRING_FIELDS;
  for (let index = 0; index < stringFields.length; index += 1) {
    const field = stringFields[index]!;
    if (typeof values[field] !== "string") {
      return recordFailure("INVALID_RECORD_FIELD_TYPE", field);
    }
  }
  const lengthFields =
    expectedDomain === "FUTURE_BINDING_INTEGRITY"
      ? FUTURE_LENGTH_FIELDS
      : DIRECT_LENGTH_FIELDS;
  for (let index = 0; index < lengthFields.length; index += 1) {
    const field = lengthFields[index]!;
    if (typeof values[field] !== "number") {
      return recordFailure("INVALID_RECORD_FIELD_TYPE", field);
    }
  }

  if (values.algorithm !== CANONICAL_RUNTIME_INTEGRITY_ALGORITHM) {
    return failure(
      "UNSUPPORTED_ALGORITHM",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }
  if (values.hashProtocolVersion !== CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION) {
    return failure(
      "UNSUPPORTED_HASH_PROTOCOL_VERSION",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }
  if (values.canonicalRuntimeValueVersion !== CANONICAL_RUNTIME_VALUE_VERSION) {
    return failure(
      "UNSUPPORTED_CANONICAL_RUNTIME_VALUE_VERSION",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }
  if (
    values.canonicalRuntimeSerializationVersion !==
    CANONICAL_RUNTIME_SERIALIZATION_VERSION
  ) {
    return failure(
      "UNSUPPORTED_CANONICAL_RUNTIME_SERIALIZATION_VERSION",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }
  if (
    expectedDomain === "FUTURE_BINDING_INTEGRITY" &&
    values.bindingVersion !== FUTURE_BINDING_VERSION
  ) {
    return failure(
      "UNSUPPORTED_BINDING_VERSION",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }
  for (let index = 0; index < lengthFields.length; index += 1) {
    const field = lengthFields[index]!;
    const value = values[field] as number;
    if (!isSafeInteger(value) || value < 0) {
      return failure(
        "INVALID_METADATA_LENGTH",
        "BINDING_METADATA_VALIDATION",
        "BINDING_METADATA"
      );
    }
  }
  if (values.digestEncoding !== CANONICAL_RUNTIME_INTEGRITY_DIGEST_ENCODING) {
    return failure(
      "INVALID_DIGEST_ENCODING",
      "BINDING_METADATA_VALIDATION",
      "DIGEST_TEXT"
    );
  }
  const digestHex = values.digestHex as string;
  if (digestHex.length !== 64) {
    return failure(
      "INVALID_DIGEST_LENGTH",
      "BINDING_METADATA_VALIDATION",
      "DIGEST_TEXT"
    );
  }
  for (let index = 0; index < digestHex.length; index += 1) {
    const code = reflectApply(stringCharCodeAt, digestHex, [index]);
    if (
      !(
        (code >= 0x30 && code <= 0x39) ||
        (code >= 0x61 && code <= 0x66)
      )
    ) {
      return failure(
        "INVALID_DIGEST_HEX",
        "BINDING_METADATA_VALIDATION",
        "DIGEST_TEXT"
      );
    }
  }

  return { ok: true, record: freeze(values) as IntegrityRecord };
};

const createDirect = <
  TDomain extends
    | "RAW_A_TLV_INTEGRITY"
    | "CANONICAL_VALUE_INTEGRITY"
>(
  domain: TDomain,
  candidate: unknown
): CreateCanonicalRuntimeIntegrityResult<
  DirectCanonicalRuntimeIntegrityRecord & {
    readonly domain: TDomain;
  }
> => {
  const admitted = admitBytes(candidate, "TLV_BYTES");
  if (!admitted.ok) {
    return admitted;
  }
  const preimage = buildPreimage(domain, admitted.bytes);
  if (!preimage.ok) {
    return preimage;
  }
  const digest = digestPreimage(preimage.bytes);
  if (!digest.ok) {
    return digest;
  }
  return {
    ok: true,
    record: freeze({
      domain,
      hashProtocolVersion: CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION,
      algorithm: CANONICAL_RUNTIME_INTEGRITY_ALGORITHM,
      canonicalRuntimeValueVersion: CANONICAL_RUNTIME_VALUE_VERSION,
      canonicalRuntimeSerializationVersion:
        CANONICAL_RUNTIME_SERIALIZATION_VERSION,
      payloadByteLength: admitted.bytes.length,
      framedPreimageByteLength: preimage.bytes.length,
      digestEncoding: CANONICAL_RUNTIME_INTEGRITY_DIGEST_ENCODING,
      digestHex: digest.hex
    })
  };
};

export const createRawATlvIntegrity = (
  rawATlvBytes: unknown
): CreateCanonicalRuntimeIntegrityResult<
  DirectCanonicalRuntimeIntegrityRecord & {
    readonly domain: "RAW_A_TLV_INTEGRITY";
  }
> => createDirect("RAW_A_TLV_INTEGRITY", rawATlvBytes);

export const createCanonicalValueIntegrity = (
  canonicalValueTlvBytes: unknown
): CreateCanonicalRuntimeIntegrityResult<
  DirectCanonicalRuntimeIntegrityRecord & {
    readonly domain: "CANONICAL_VALUE_INTEGRITY";
  }
> => createDirect("CANONICAL_VALUE_INTEGRITY", canonicalValueTlvBytes);

export const createFutureBindingIntegrity = (
  bindingMetadataTlvBytes: unknown,
  boundPayloadTlvBytes: unknown
): CreateCanonicalRuntimeIntegrityResult<FutureBindingIntegrityRecord> => {
  const metadata = admitBytes(bindingMetadataTlvBytes, "BINDING_METADATA");
  if (!metadata.ok) {
    return metadata;
  }
  const payload = admitBytes(boundPayloadTlvBytes, "TLV_BYTES");
  if (!payload.ok) {
    return payload;
  }
  const envelope = buildBindingEnvelope(metadata.bytes, payload.bytes);
  if (!envelope.ok) {
    return envelope;
  }
  const preimage = buildPreimage("FUTURE_BINDING_INTEGRITY", envelope.bytes);
  if (!preimage.ok) {
    return preimage;
  }
  const digest = digestPreimage(preimage.bytes);
  if (!digest.ok) {
    return digest;
  }
  return {
    ok: true,
    record: freeze({
      domain: "FUTURE_BINDING_INTEGRITY",
      hashProtocolVersion: CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION,
      algorithm: CANONICAL_RUNTIME_INTEGRITY_ALGORITHM,
      canonicalRuntimeValueVersion: CANONICAL_RUNTIME_VALUE_VERSION,
      canonicalRuntimeSerializationVersion:
        CANONICAL_RUNTIME_SERIALIZATION_VERSION,
      bindingVersion: FUTURE_BINDING_VERSION,
      bindingMetadataTlvByteLength: metadata.bytes.length,
      boundPayloadTlvByteLength: payload.bytes.length,
      payloadByteLength: envelope.bytes.length,
      framedPreimageByteLength: preimage.bytes.length,
      digestEncoding: CANONICAL_RUNTIME_INTEGRITY_DIGEST_ENCODING,
      digestHex: digest.hex
    })
  };
};

const verifyDirect = (
  domain: "RAW_A_TLV_INTEGRITY" | "CANONICAL_VALUE_INTEGRITY",
  storedCandidate: unknown,
  candidate: unknown
): VerifyCanonicalRuntimeIntegrityResult => {
  const stored = admitRecord(storedCandidate, domain);
  if (!stored.ok) {
    return stored;
  }
  const admitted = admitBytes(candidate, "TLV_BYTES");
  if (!admitted.ok) {
    return admitted;
  }
  const preimage = buildPreimage(domain, admitted.bytes);
  if (!preimage.ok) {
    return preimage;
  }
  const record = stored.record as DirectCanonicalRuntimeIntegrityRecord;
  if (
    record.payloadByteLength !== admitted.bytes.length ||
    record.framedPreimageByteLength !== preimage.bytes.length
  ) {
    return failure(
      "METADATA_LENGTH_MISMATCH",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }
  const digest = digestPreimage(preimage.bytes);
  return digest.ok ? compareDigest(digest.bytes, record.digestHex) : digest;
};

export const verifyRawATlvIntegrity = (
  storedCandidate: unknown,
  rawATlvBytes: unknown
): VerifyCanonicalRuntimeIntegrityResult =>
  verifyDirect("RAW_A_TLV_INTEGRITY", storedCandidate, rawATlvBytes);

export const verifyCanonicalValueIntegrity = (
  storedCandidate: unknown,
  canonicalValueTlvBytes: unknown
): VerifyCanonicalRuntimeIntegrityResult =>
  verifyDirect(
    "CANONICAL_VALUE_INTEGRITY",
    storedCandidate,
    canonicalValueTlvBytes
  );

export const verifyFutureBindingIntegrity = (
  storedCandidate: unknown,
  bindingMetadataTlvBytes: unknown,
  boundPayloadTlvBytes: unknown
): VerifyCanonicalRuntimeIntegrityResult => {
  const stored = admitRecord(storedCandidate, "FUTURE_BINDING_INTEGRITY");
  if (!stored.ok) {
    return stored;
  }
  const metadata = admitBytes(bindingMetadataTlvBytes, "BINDING_METADATA");
  if (!metadata.ok) {
    return metadata;
  }
  const payload = admitBytes(boundPayloadTlvBytes, "TLV_BYTES");
  if (!payload.ok) {
    return payload;
  }
  const envelope = buildBindingEnvelope(metadata.bytes, payload.bytes);
  if (!envelope.ok) {
    return envelope;
  }
  const preimage = buildPreimage("FUTURE_BINDING_INTEGRITY", envelope.bytes);
  if (!preimage.ok) {
    return preimage;
  }
  const record = stored.record as FutureBindingIntegrityRecord;
  if (
    record.bindingMetadataTlvByteLength !== metadata.bytes.length ||
    record.boundPayloadTlvByteLength !== payload.bytes.length ||
    record.payloadByteLength !== envelope.bytes.length ||
    record.framedPreimageByteLength !== preimage.bytes.length
  ) {
    return failure(
      "METADATA_LENGTH_MISMATCH",
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }
  const digest = digestPreimage(preimage.bytes);
  return digest.ok ? compareDigest(digest.bytes, record.digestHex) : digest;
};
