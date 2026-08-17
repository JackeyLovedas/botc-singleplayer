import { types as utilTypes } from "node:util";

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
  maxDiagnosticPathSegments: 32
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
      readonly valueVersion: typeof CANONICAL_RUNTIME_VALUE_VERSION;
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
      readonly valueVersion: typeof CANONICAL_RUNTIME_VALUE_VERSION;
      readonly serializationVersion:
        typeof CANONICAL_RUNTIME_SERIALIZATION_VERSION;
    }
  | {
      readonly ok: false;
      readonly diagnostic: CanonicalRuntimeDiagnostic;
    };

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

export type ReadCanonicalRuntimeBackingResult =
  | {
      readonly ok: true;
      readonly value: InternalCanonicalRuntimeValue;
    }
  | {
      readonly ok: false;
      readonly diagnostic: CanonicalRuntimeDiagnostic;
    };

type CaptureFailure = Extract<CaptureCanonicalRuntimeValueResult, { readonly ok: false }>;

type CaptureNodeResult =
  | {
      readonly ok: true;
      readonly node: InternalCanonicalRuntimeValue;
    }
  | CaptureFailure;

type MutableMetrics = {
  nodesVisited: number;
  maximumDepthVisited: number;
  maximumArrayLengthObserved: number;
  maximumObjectKeysObserved: number;
  maximumStringUtf8BytesObserved: number;
  maximumObjectKeyUtf8BytesObserved: number;
};

type CaptureState = {
  readonly ancestors: WeakSet<object>;
  readonly metrics: MutableMetrics;
};

const issuedCanonicalRuntimeTokens = new WeakSet<object>();
const canonicalRuntimeBackings =
  new WeakMap<object, InternalCanonicalRuntimeValue>();

const textEncoder = new TextEncoder();
const headerBytes = [
  0x42, 0x4f, 0x54, 0x43, 0x43, 0x52, 0x56, 0x2b, 0x30, 0x31
] as const;

const quarantinedCodes = new Set<CanonicalRuntimeFailureCode>([
  "PROXY_OR_DESCRIPTOR_FAILURE",
  "ACCESSOR_PROPERTY",
  "SYMBOL_KEY",
  "SYMBOL_VALUE",
  "CYCLE",
  "INVALID_CAPTURE_TOKEN",
  "INTERNAL_BACKING_MISSING",
  "INTERNAL_SERIALIZATION_FAILURE"
]);

const freezePath = (
  path: readonly CanonicalRuntimePathSegment[]
): readonly CanonicalRuntimePathSegment[] =>
  Object.freeze(path.map((segment) => Object.freeze({ ...segment })));

const diagnostic = (
  code: CanonicalRuntimeFailureCode,
  phase: CanonicalRuntimeFailurePhase,
  path: readonly CanonicalRuntimePathSegment[] = [],
  limitSummary: CanonicalRuntimeLimitSummary = { kind: "NOT_APPLICABLE" }
): CaptureFailure => ({
  ok: false,
  diagnostic: Object.freeze({
    code,
    phase,
    path: freezePath(path),
    limitSummary: Object.freeze(limitSummary),
    quarantineRecommended: quarantinedCodes.has(code)
  })
});

const resourceFailure = (
  code: CanonicalRuntimeFailureCode,
  path: readonly CanonicalRuntimePathSegment[],
  resource: CanonicalRuntimeResourceKind,
  limit: number,
  observed: number
): CaptureFailure =>
  diagnostic(code, "CAPTURE", path, {
    kind: "LIMIT",
    resource,
    limit,
    observed
  });

const appendPath = (
  path: readonly CanonicalRuntimePathSegment[],
  segment: CanonicalRuntimePathSegment
): readonly CanonicalRuntimePathSegment[] => {
  if (path.at(-1)?.kind === "TRUNCATED") {
    return path;
  }
  if (path.length < CANONICAL_RUNTIME_LIMITS.maxDiagnosticPathSegments - 1) {
    return [...path, segment];
  }
  return [
    ...path.slice(0, CANONICAL_RUNTIME_LIMITS.maxDiagnosticPathSegments - 1),
    { kind: "TRUNCATED" }
  ];
};

const compareUtf16CodeUnits = (left: string, right: string): number => {
  const limit = Math.min(left.length, right.length);
  for (let index = 0; index < limit; index += 1) {
    const delta = left.charCodeAt(index) - right.charCodeAt(index);
    if (delta !== 0) {
      return delta < 0 ? -1 : 1;
    }
  }
  return left.length < right.length ? -1 : left.length > right.length ? 1 : 0;
};

const utf8Length = (
  value: string,
  path: readonly CanonicalRuntimePathSegment[],
  code: "RESOURCE_STRING_LIMIT_EXCEEDED" | "RESOURCE_KEY_LIMIT_EXCEEDED",
  resource: "STRING_UTF8_BYTES" | "OBJECT_KEY_UTF8_BYTES",
  limit: number
): number | CaptureFailure => {
  for (let index = 0; index < value.length; index += 1) {
    const unit = value.charCodeAt(index);
    if (unit >= 0xd800 && unit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!Number.isInteger(next) || next < 0xdc00 || next > 0xdfff) {
        return diagnostic("INVALID_UNICODE", "CAPTURE", path);
      }
      index += 1;
    } else if (unit >= 0xdc00 && unit <= 0xdfff) {
      return diagnostic("INVALID_UNICODE", "CAPTURE", path);
    }
  }
  const length = textEncoder.encode(value).length;
  return length > limit
    ? resourceFailure(code, path, resource, limit, length)
    : length;
};

const enterNode = (
  state: CaptureState,
  depth: number,
  path: readonly CanonicalRuntimePathSegment[]
): CaptureFailure | undefined => {
  if (depth > CANONICAL_RUNTIME_LIMITS.maxDepth) {
    return resourceFailure(
      "RESOURCE_DEPTH_EXCEEDED",
      path,
      "DEPTH",
      CANONICAL_RUNTIME_LIMITS.maxDepth,
      depth
    );
  }
  const nodesVisited = state.metrics.nodesVisited + 1;
  if (nodesVisited > CANONICAL_RUNTIME_LIMITS.maxNodes) {
    return resourceFailure(
      "RESOURCE_NODE_LIMIT_EXCEEDED",
      path,
      "NODE_COUNT",
      CANONICAL_RUNTIME_LIMITS.maxNodes,
      nodesVisited
    );
  }
  state.metrics.nodesVisited = nodesVisited;
  state.metrics.maximumDepthVisited =
    Math.max(state.metrics.maximumDepthVisited, depth);
  return undefined;
};

const serializedSizeFailure = (
  encodedNodeBytes: number,
  path: readonly CanonicalRuntimePathSegment[]
): CaptureFailure | undefined => {
  const observed = headerBytes.length + encodedNodeBytes;
  return observed > CANONICAL_RUNTIME_LIMITS.maxSerializedBytes
    ? resourceFailure(
        "RESOURCE_SERIALIZED_BYTE_LIMIT_EXCEEDED",
        path,
        "SERIALIZED_BYTES",
        CANONICAL_RUNTIME_LIMITS.maxSerializedBytes,
        observed
      )
    : undefined;
};

const guardedIsProxy = (value: object): boolean | undefined => {
  try {
    return utilTypes.isProxy(value);
  } catch {
    return undefined;
  }
};

const guardedIsArray = (value: object): boolean | undefined => {
  try {
    return Array.isArray(value);
  } catch {
    return undefined;
  }
};

const guardedPrototype = (value: object): object | null | undefined => {
  try {
    return Reflect.getPrototypeOf(value);
  } catch {
    return undefined;
  }
};

const guardedOwnKeys = (value: object): readonly PropertyKey[] | undefined => {
  try {
    return Reflect.ownKeys(value);
  } catch {
    return undefined;
  }
};

const guardedDescriptor = (
  value: object,
  key: PropertyKey
): PropertyDescriptor | undefined | null => {
  try {
    return Reflect.getOwnPropertyDescriptor(value, key);
  } catch {
    return null;
  }
};

const capturePrimitive = (
  value: unknown,
  depth: number,
  path: readonly CanonicalRuntimePathSegment[],
  state: CaptureState
): CaptureNodeResult | undefined => {
  if (value === null) {
    const entryFailure = enterNode(state, depth, path);
    return entryFailure ?? {
      ok: true,
      node: { kind: "NULL", encodedNodeBytes: 1 }
    };
  }
  if (typeof value === "boolean") {
    const entryFailure = enterNode(state, depth, path);
    return entryFailure ?? {
      ok: true,
      node: { kind: "BOOLEAN", value, encodedNodeBytes: 1 }
    };
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value) || !Number.isInteger(value) || Object.is(value, -0)) {
      return diagnostic("INVALID_NUMBER", "CAPTURE", path);
    }
    if (!Number.isSafeInteger(value)) {
      return diagnostic("UNSAFE_INTEGER", "CAPTURE", path);
    }
    const entryFailure = enterNode(state, depth, path);
    return entryFailure ?? {
      ok: true,
      node: { kind: "INTEGER", value, encodedNodeBytes: 9 }
    };
  }
  if (typeof value === "string") {
    const entryFailure = enterNode(state, depth, path);
    if (entryFailure !== undefined) {
      return entryFailure;
    }
    const length = utf8Length(
      value,
      path,
      "RESOURCE_STRING_LIMIT_EXCEEDED",
      "STRING_UTF8_BYTES",
      CANONICAL_RUNTIME_LIMITS.maxStringUtf8Bytes
    );
    if (typeof length !== "number") {
      return length;
    }
    state.metrics.maximumStringUtf8BytesObserved =
      Math.max(state.metrics.maximumStringUtf8BytesObserved, length);
    const encodedNodeBytes = 5 + length;
    return serializedSizeFailure(encodedNodeBytes, path) ?? {
      ok: true,
      node: {
        kind: "STRING",
        value,
        utf8ByteLength: length,
        encodedNodeBytes
      }
    };
  }
  if (typeof value === "symbol") {
    return diagnostic("SYMBOL_VALUE", "CAPTURE", path);
  }
  if (typeof value !== "object") {
    return diagnostic("UNSUPPORTED_TYPE", "CAPTURE", path);
  }
  return undefined;
};

const captureArray = (
  value: object,
  ownKeys: readonly PropertyKey[],
  depth: number,
  path: readonly CanonicalRuntimePathSegment[],
  state: CaptureState
): CaptureNodeResult => {
  const lengthDescriptor = guardedDescriptor(value, "length");
  if (lengthDescriptor === null) {
    return diagnostic("PROXY_OR_DESCRIPTOR_FAILURE", "CAPTURE", path);
  }
  if (
    lengthDescriptor === undefined ||
    !("value" in lengthDescriptor) ||
    typeof lengthDescriptor.value !== "number" ||
    !Number.isSafeInteger(lengthDescriptor.value) ||
    lengthDescriptor.value < 0 ||
    lengthDescriptor.enumerable !== false ||
    lengthDescriptor.configurable !== false ||
    lengthDescriptor.writable !== true
  ) {
    return diagnostic("INVALID_ARRAY_LENGTH_DESCRIPTOR", "CAPTURE", path);
  }

  const length = lengthDescriptor.value;
  state.metrics.maximumArrayLengthObserved =
    Math.max(state.metrics.maximumArrayLengthObserved, length);
  if (length > CANONICAL_RUNTIME_LIMITS.maxArrayLength) {
    return resourceFailure(
      "RESOURCE_ARRAY_LIMIT_EXCEEDED",
      path,
      "ARRAY_LENGTH",
      CANONICAL_RUNTIME_LIMITS.maxArrayLength,
      length
    );
  }

  const stringKeys = ownKeys.filter(
    (key): key is string => typeof key === "string" && key !== "length"
  );
  const keySet = new Set(stringKeys);
  for (let index = 0; index < length; index += 1) {
    if (!keySet.has(String(index))) {
      return diagnostic("SPARSE_ARRAY", "CAPTURE", path);
    }
  }
  if (stringKeys.length !== length) {
    return diagnostic("KEYED_ARRAY", "CAPTURE", path);
  }

  const descriptors: PropertyDescriptor[] = [];
  for (let index = 0; index < length; index += 1) {
    const descriptor = guardedDescriptor(value, String(index));
    if (descriptor === null) {
      return diagnostic("PROXY_OR_DESCRIPTOR_FAILURE", "CAPTURE", path);
    }
    if (descriptor === undefined) {
      return diagnostic("SPARSE_ARRAY", "CAPTURE", path);
    }
    descriptors.push(descriptor);
  }
  for (let index = 0; index < descriptors.length; index += 1) {
    const descriptor = descriptors[index]!;
    const childPath = appendPath(path, { kind: "ARRAY_INDEX", index });
    if (!("value" in descriptor)) {
      return diagnostic("ACCESSOR_PROPERTY", "CAPTURE", childPath);
    }
    if (descriptor.enumerable !== true) {
      return diagnostic("NON_ENUMERABLE_PROPERTY", "CAPTURE", childPath);
    }
  }

  const values: InternalCanonicalRuntimeValue[] = [];
  let encodedNodeBytes = 5;
  for (let index = 0; index < descriptors.length; index += 1) {
    const descriptor = descriptors[index]!;
    const childPath = appendPath(path, { kind: "ARRAY_INDEX", index });
    const child = captureNode(descriptor.value, depth + 1, childPath, state);
    if (!child.ok) {
      return child;
    }
    values.push(child.node);
    encodedNodeBytes += child.node.encodedNodeBytes;
    const sizeFailure = serializedSizeFailure(encodedNodeBytes, path);
    if (sizeFailure !== undefined) {
      return sizeFailure;
    }
  }
  return {
    ok: true,
    node: { kind: "ARRAY", values, encodedNodeBytes }
  };
};

const captureObject = (
  value: object,
  ownKeys: readonly PropertyKey[],
  depth: number,
  path: readonly CanonicalRuntimePathSegment[],
  state: CaptureState
): CaptureNodeResult => {
  const keys = (ownKeys as readonly string[]).slice().sort(compareUtf16CodeUnits);
  state.metrics.maximumObjectKeysObserved =
    Math.max(state.metrics.maximumObjectKeysObserved, keys.length);
  if (keys.length > CANONICAL_RUNTIME_LIMITS.maxObjectKeys) {
    return resourceFailure(
      "RESOURCE_OBJECT_KEY_LIMIT_EXCEEDED",
      path,
      "OBJECT_KEY_COUNT",
      CANONICAL_RUNTIME_LIMITS.maxObjectKeys,
      keys.length
    );
  }

  const descriptors: PropertyDescriptor[] = [];
  for (const key of keys) {
    const descriptor = guardedDescriptor(value, key);
    if (descriptor === null) {
      return diagnostic("PROXY_OR_DESCRIPTOR_FAILURE", "CAPTURE", path);
    }
    if (descriptor === undefined) {
      return diagnostic("PROXY_OR_DESCRIPTOR_FAILURE", "CAPTURE", path);
    }
    descriptors.push(descriptor);
  }
  for (let ordinal = 0; ordinal < descriptors.length; ordinal += 1) {
    const descriptor = descriptors[ordinal]!;
    const childPath = appendPath(path, {
      kind: "OBJECT_KEY_ORDINAL",
      ordinal
    });
    if (!("value" in descriptor)) {
      return diagnostic("ACCESSOR_PROPERTY", "CAPTURE", childPath);
    }
    if (descriptor.enumerable !== true) {
      return diagnostic("NON_ENUMERABLE_PROPERTY", "CAPTURE", childPath);
    }
  }

  const keyLengths: number[] = [];
  for (let ordinal = 0; ordinal < keys.length; ordinal += 1) {
    const childPath = appendPath(path, {
      kind: "OBJECT_KEY_ORDINAL",
      ordinal
    });
    const length = utf8Length(
      keys[ordinal]!,
      childPath,
      "RESOURCE_KEY_LIMIT_EXCEEDED",
      "OBJECT_KEY_UTF8_BYTES",
      CANONICAL_RUNTIME_LIMITS.maxObjectKeyUtf8Bytes
    );
    if (typeof length !== "number") {
      return length;
    }
    state.metrics.maximumObjectKeyUtf8BytesObserved =
      Math.max(state.metrics.maximumObjectKeyUtf8BytesObserved, length);
    keyLengths.push(length);
  }

  const entries: InternalCanonicalRuntimeObjectEntry[] = [];
  let encodedNodeBytes = 5;
  for (let ordinal = 0; ordinal < keys.length; ordinal += 1) {
    const childPath = appendPath(path, {
      kind: "OBJECT_KEY_ORDINAL",
      ordinal
    });
    const descriptor = descriptors[ordinal]!;
    const child = captureNode(descriptor.value, depth + 1, childPath, state);
    if (!child.ok) {
      return child;
    }
    const keyUtf8ByteLength = keyLengths[ordinal]!;
    entries.push({
      key: keys[ordinal]!,
      keyUtf8ByteLength,
      value: child.node
    });
    encodedNodeBytes += 4 + keyUtf8ByteLength + child.node.encodedNodeBytes;
    const sizeFailure = serializedSizeFailure(encodedNodeBytes, path);
    if (sizeFailure !== undefined) {
      return sizeFailure;
    }
  }
  return {
    ok: true,
    node: { kind: "OBJECT", entries, encodedNodeBytes }
  };
};

const captureNode = (
  value: unknown,
  depth: number,
  path: readonly CanonicalRuntimePathSegment[],
  state: CaptureState
): CaptureNodeResult => {
  const primitive = capturePrimitive(value, depth, path, state);
  if (primitive !== undefined) {
    return primitive;
  }

  const objectValue = value as object;
  const proxy = guardedIsProxy(objectValue);
  if (proxy !== false) {
    return diagnostic("PROXY_OR_DESCRIPTOR_FAILURE", "CAPTURE", path);
  }
  const entryFailure = enterNode(state, depth, path);
  if (entryFailure !== undefined) {
    return entryFailure;
  }
  if (state.ancestors.has(objectValue)) {
    return diagnostic("CYCLE", "CAPTURE", path);
  }
  state.ancestors.add(objectValue);
  try {
    const array = guardedIsArray(objectValue);
    if (array === undefined) {
      return diagnostic("PROXY_OR_DESCRIPTOR_FAILURE", "CAPTURE", path);
    }
    const prototype = guardedPrototype(objectValue);
    if (prototype === undefined) {
      return diagnostic("PROXY_OR_DESCRIPTOR_FAILURE", "CAPTURE", path);
    }
    if (
      (array && prototype !== Array.prototype) ||
      (!array && prototype !== Object.prototype && prototype !== null)
    ) {
      return diagnostic("NONPLAIN_OBJECT", "CAPTURE", path);
    }
    const ownKeys = guardedOwnKeys(objectValue);
    if (ownKeys === undefined) {
      return diagnostic("PROXY_OR_DESCRIPTOR_FAILURE", "CAPTURE", path);
    }
    if (ownKeys.some((key) => typeof key === "symbol")) {
      return diagnostic("SYMBOL_KEY", "CAPTURE", path);
    }
    return array
      ? captureArray(objectValue, ownKeys, depth, path, state)
      : captureObject(objectValue, ownKeys, depth, path, state);
  } finally {
    state.ancestors.delete(objectValue);
  }
};

const deeplyFreezeBacking = (
  value: InternalCanonicalRuntimeValue
): InternalCanonicalRuntimeValue => {
  if (value.kind === "ARRAY") {
    for (const child of value.values) {
      deeplyFreezeBacking(child);
    }
    Object.freeze(value.values);
  } else if (value.kind === "OBJECT") {
    for (const entry of value.entries) {
      deeplyFreezeBacking(entry.value);
      Object.freeze(entry);
    }
    Object.freeze(value.entries);
  }
  return Object.freeze(value);
};

const authenticate = (
  token: unknown,
  phase: "TOKEN_AUTHENTICATION" | "INTERNAL_READ"
): ReadCanonicalRuntimeBackingResult => {
  if (
    typeof token !== "object" ||
    token === null ||
    !issuedCanonicalRuntimeTokens.has(token)
  ) {
    return diagnostic("INVALID_CAPTURE_TOKEN", phase);
  }
  const backing = canonicalRuntimeBackings.get(token);
  return backing === undefined
    ? diagnostic("INTERNAL_BACKING_MISSING", phase)
    : { ok: true, value: backing };
};

export const captureCanonicalRuntimeValue = (
  input: unknown
): CaptureCanonicalRuntimeValueResult => {
  const state: CaptureState = {
    ancestors: new WeakSet<object>(),
    metrics: {
      nodesVisited: 0,
      maximumDepthVisited: 0,
      maximumArrayLengthObserved: 0,
      maximumObjectKeysObserved: 0,
      maximumStringUtf8BytesObserved: 0,
      maximumObjectKeyUtf8BytesObserved: 0
    }
  };
  try {
    const captured = captureNode(input, 0, [], state);
    if (!captured.ok) {
      return captured;
    }
    const serializedBytes = headerBytes.length + captured.node.encodedNodeBytes;
    if (serializedBytes > CANONICAL_RUNTIME_LIMITS.maxSerializedBytes) {
      return resourceFailure(
        "RESOURCE_SERIALIZED_BYTE_LIMIT_EXCEEDED",
        [],
        "SERIALIZED_BYTES",
        CANONICAL_RUNTIME_LIMITS.maxSerializedBytes,
        serializedBytes
      );
    }
    const backing = deeplyFreezeBacking(captured.node);
    const token = Object.freeze(Object.create(null) as object);
    try {
      canonicalRuntimeBackings.set(token, backing);
      issuedCanonicalRuntimeTokens.add(token);
    } catch {
      canonicalRuntimeBackings.delete(token);
      return diagnostic("INTERNAL_SERIALIZATION_FAILURE", "CAPTURE");
    }
    const metrics: CanonicalRuntimeResourceMetrics = Object.freeze({
      ...state.metrics,
      serializedBytes
    });
    return {
      ok: true,
      token,
      valueVersion: CANONICAL_RUNTIME_VALUE_VERSION,
      metrics
    };
  } catch {
    return diagnostic("INTERNAL_SERIALIZATION_FAILURE", "CAPTURE");
  }
};

const writeU32 = (bytes: Uint8Array, offset: number, value: number): number => {
  bytes[offset] = (value >>> 24) & 0xff;
  bytes[offset + 1] = (value >>> 16) & 0xff;
  bytes[offset + 2] = (value >>> 8) & 0xff;
  bytes[offset + 3] = value & 0xff;
  return offset + 4;
};

const writeI64 = (bytes: Uint8Array, offset: number, value: number): number => {
  let unsigned = BigInt.asUintN(64, BigInt(value));
  for (let index = 7; index >= 0; index -= 1) {
    bytes[offset + index] = Number(unsigned & 0xffn);
    unsigned >>= 8n;
  }
  return offset + 8;
};

const writeUtf8 = (
  bytes: Uint8Array,
  offset: number,
  value: string,
  expectedLength: number
): number => {
  const result = textEncoder.encodeInto(value, bytes.subarray(offset, offset + expectedLength));
  if (result.read !== value.length || result.written !== expectedLength) {
    throw new Error("UTF-8 invariant failed");
  }
  return offset + expectedLength;
};

const writeNode = (
  bytes: Uint8Array,
  offset: number,
  value: InternalCanonicalRuntimeValue
): number => {
  switch (value.kind) {
    case "NULL":
      bytes[offset] = 0x00;
      return offset + 1;
    case "BOOLEAN":
      bytes[offset] = value.value ? 0x02 : 0x01;
      return offset + 1;
    case "INTEGER":
      bytes[offset] = 0x03;
      return writeI64(bytes, offset + 1, value.value);
    case "STRING": {
      bytes[offset] = 0x04;
      const contentOffset = writeU32(bytes, offset + 1, value.utf8ByteLength);
      return writeUtf8(bytes, contentOffset, value.value, value.utf8ByteLength);
    }
    case "ARRAY": {
      bytes[offset] = 0x05;
      let next = writeU32(bytes, offset + 1, value.values.length);
      for (const child of value.values) {
        next = writeNode(bytes, next, child);
      }
      return next;
    }
    case "OBJECT": {
      bytes[offset] = 0x06;
      let next = writeU32(bytes, offset + 1, value.entries.length);
      for (const entry of value.entries) {
        next = writeU32(bytes, next, entry.keyUtf8ByteLength);
        next = writeUtf8(bytes, next, entry.key, entry.keyUtf8ByteLength);
        next = writeNode(bytes, next, entry.value);
      }
      return next;
    }
  }
};

export const serializeCanonicalRuntimeValue = (
  token: unknown
): SerializeCanonicalRuntimeValueResult => {
  const authenticated = authenticate(token, "TOKEN_AUTHENTICATION");
  if (!authenticated.ok) {
    return authenticated;
  }
  const totalBytes = headerBytes.length + authenticated.value.encodedNodeBytes;
  if (
    !Number.isSafeInteger(totalBytes) ||
    totalBytes > CANONICAL_RUNTIME_LIMITS.maxSerializedBytes
  ) {
    return diagnostic("INTERNAL_SERIALIZATION_FAILURE", "SERIALIZATION");
  }
  try {
    const bytes = new Uint8Array(totalBytes);
    bytes.set(headerBytes, 0);
    const finalOffset = writeNode(bytes, headerBytes.length, authenticated.value);
    if (finalOffset !== totalBytes) {
      return diagnostic("INTERNAL_SERIALIZATION_FAILURE", "SERIALIZATION");
    }
    return {
      ok: true,
      bytes,
      byteLength: bytes.length,
      valueVersion: CANONICAL_RUNTIME_VALUE_VERSION,
      serializationVersion: CANONICAL_RUNTIME_SERIALIZATION_VERSION
    };
  } catch {
    return diagnostic("INTERNAL_SERIALIZATION_FAILURE", "SERIALIZATION");
  }
};

export const readCanonicalRuntimeBackingForStructuralValidation = (
  token: unknown
): ReadCanonicalRuntimeBackingResult => authenticate(token, "INTERNAL_READ");
