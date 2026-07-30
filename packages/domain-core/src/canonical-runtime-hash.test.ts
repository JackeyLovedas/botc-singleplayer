import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  captureCanonicalRuntimeValue,
  serializeCanonicalRuntimeValue
} from "@botc/domain-core";
import {
  CANONICAL_RUNTIME_INTEGRITY_ALGORITHM,
  CANONICAL_RUNTIME_INTEGRITY_DIGEST_ENCODING,
  CANONICAL_RUNTIME_INTEGRITY_MAX_A_TLV_BYTES,
  CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION,
  FUTURE_BINDING_VERSION,
  createCanonicalValueIntegrity,
  createFutureBindingIntegrity,
  createRawATlvIntegrity,
  verifyCanonicalValueIntegrity,
  verifyFutureBindingIntegrity,
  verifyRawATlvIntegrity
} from "./canonical-runtime-hash.js";
import type {
  CanonicalRuntimeIntegrityFailure,
  DirectCanonicalRuntimeIntegrityRecord,
  FutureBindingIntegrityRecord
} from "./canonical-runtime-hash.js";

const bytesOf = (value: unknown): Uint8Array => {
  const capture = captureCanonicalRuntimeValue(value);
  if (!capture.ok) {
    throw new Error(`capture failed: ${capture.diagnostic.code}`);
  }
  const serialized = serializeCanonicalRuntimeValue(capture.token);
  if (!serialized.ok) {
    throw new Error(`serialization failed: ${serialized.diagnostic.code}`);
  }
  return serialized.bytes;
};

const directRecord = (
  result: ReturnType<
    typeof createRawATlvIntegrity | typeof createCanonicalValueIntegrity
  >
): DirectCanonicalRuntimeIntegrityRecord => {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(`unexpected failure: ${result.failure.code}`);
  }
  return result.record;
};

const bindingRecord = (
  result: ReturnType<typeof createFutureBindingIntegrity>
): FutureBindingIntegrityRecord => {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(`unexpected failure: ${result.failure.code}`);
  }
  return result.record;
};

type FailableResult =
  | {
      readonly ok: true;
    }
  | {
      readonly ok: false;
      readonly failure: CanonicalRuntimeIntegrityFailure;
    };

const expectFailure = (
  result: FailableResult,
  expected: CanonicalRuntimeIntegrityFailure
): void => {
  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error("expected failure");
  }
  expect(result.failure).toStrictEqual(expected);
  expect(Object.keys(result.failure)).toStrictEqual([
    "code",
    "phase",
    "inputKind"
  ]);
  expect(Object.isFrozen(result.failure)).toBe(true);
};

const withField = <T extends object>(
  value: T,
  field: string,
  replacement: unknown
): Record<string, unknown> => ({ ...value, [field]: replacement });

type FailureMatrixEntry = {
  readonly name: string;
  readonly code: CanonicalRuntimeIntegrityFailure["code"];
  readonly phase: CanonicalRuntimeIntegrityFailure["phase"];
  readonly inputKind: CanonicalRuntimeIntegrityFailure["inputKind"];
  readonly expectedFailClosedBehavior:
    "RETURN_EXACT_FAILURE_NO_THROW_NO_PARTIAL_RESULT";
  readonly invoke?: () => FailableResult;
};

const exerciseCompleteFailureMatrix = (): void => {
  const bytes = bytesOf(null);
  const record = directRecord(createRawATlvIntegrity(bytes));
  const canonicalRecord = directRecord(createCanonicalValueIntegrity(bytes));
  const bindingMetadata = bytesOf("metadata");
  const boundPayload = bytesOf("payload");
  const futureRecord = bindingRecord(
    createFutureBindingIntegrity(bindingMetadata, boundPayload)
  );
  const entries: FailureMatrixEntry[] = [];
  const addRuntime = (
    name: string,
    invoke: () => FailableResult,
    code: CanonicalRuntimeIntegrityFailure["code"],
    phase: CanonicalRuntimeIntegrityFailure["phase"],
    inputKind: CanonicalRuntimeIntegrityFailure["inputKind"]
  ): void => {
    entries.push({
      name,
      code,
      phase,
      inputKind,
      expectedFailClosedBehavior:
        "RETURN_EXACT_FAILURE_NO_THROW_NO_PARTIAL_RESULT",
      invoke
    });
  };
  const addStatic = (
    name: string,
    code: CanonicalRuntimeIntegrityFailure["code"],
    phase: CanonicalRuntimeIntegrityFailure["phase"],
    inputKind: CanonicalRuntimeIntegrityFailure["inputKind"]
  ): void => {
    entries.push({
      name,
      code,
      phase,
      inputKind,
      expectedFailClosedBehavior:
        "RETURN_EXACT_FAILURE_NO_THROW_NO_PARTIAL_RESULT"
    });
  };
  const withoutField = (source: object, field: string) => {
    const result = { ...source } as Record<string, unknown>;
    Reflect.deleteProperty(result, field);
    return result;
  };
  const withDescriptor = (
    source: object,
    field: string,
    descriptor: PropertyDescriptor
  ) => {
    const result = { ...source } as Record<string, unknown>;
    Object.defineProperty(result, field, descriptor);
    return result;
  };

  let byteTrapCalls = 0;
  const laterBytes = new Proxy(new Uint8Array([1]), {
    get: (target, property, receiver) => {
      byteTrapCalls += 1;
      return Reflect.get(target, property, receiver) as unknown;
    }
  });
  let recordProxyTrapCalls = 0;
  const proxyRecord = new Proxy(record, {
    get: (target, property, receiver) => {
      recordProxyTrapCalls += 1;
      return Reflect.get(target, property, receiver) as unknown;
    },
    getPrototypeOf: (target) => {
      recordProxyTrapCalls += 1;
      return Reflect.getPrototypeOf(target);
    },
    ownKeys: (target) => {
      recordProxyTrapCalls += 1;
      return Reflect.ownKeys(target);
    }
  });
  let accessorCalls = 0;
  const accessorRecord = (
    field: string,
    value: unknown
  ): Record<string, unknown> =>
    withDescriptor(record, field, {
      configurable: true,
      enumerable: true,
      get: () => {
        accessorCalls += 1;
        return value;
      }
    });

  addRuntime(
    "invalid raw TLV position",
    () => createRawATlvIntegrity(null),
    "INVALID_BYTE_INPUT",
    "TLV_INPUT_ACCEPTANCE",
    "TLV_BYTES"
  );
  addRuntime(
    "invalid canonical-value TLV position",
    () => createCanonicalValueIntegrity(null),
    "INVALID_BYTE_INPUT",
    "TLV_INPUT_ACCEPTANCE",
    "TLV_BYTES"
  );
  addRuntime(
    "invalid future metadata position",
    () => createFutureBindingIntegrity(null, laterBytes),
    "INVALID_BYTE_INPUT",
    "TLV_INPUT_ACCEPTANCE",
    "BINDING_METADATA"
  );
  addRuntime(
    "invalid future bound-payload position",
    () => createFutureBindingIntegrity(bindingMetadata, null),
    "INVALID_BYTE_INPUT",
    "TLV_INPUT_ACCEPTANCE",
    "TLV_BYTES"
  );
  addRuntime(
    "proxy TLV bytes",
    () => createRawATlvIntegrity(laterBytes),
    "PROXY_BYTE_INPUT",
    "TLV_INPUT_ACCEPTANCE",
    "TLV_BYTES"
  );
  addRuntime(
    "proxy binding metadata",
    () => createFutureBindingIntegrity(laterBytes, boundPayload),
    "PROXY_BYTE_INPUT",
    "TLV_INPUT_ACCEPTANCE",
    "BINDING_METADATA"
  );
  addRuntime(
    "wrong TLV view",
    () => createCanonicalValueIntegrity(new Uint16Array(1)),
    "WRONG_BYTE_VIEW",
    "TLV_INPUT_ACCEPTANCE",
    "TLV_BYTES"
  );
  addRuntime(
    "wrong metadata view",
    () => createFutureBindingIntegrity(new Uint16Array(1), boundPayload),
    "WRONG_BYTE_VIEW",
    "TLV_INPUT_ACCEPTANCE",
    "BINDING_METADATA"
  );
  if (typeof SharedArrayBuffer !== "undefined") {
    addRuntime(
      "shared TLV backing",
      () =>
        createRawATlvIntegrity(new Uint8Array(new SharedArrayBuffer(1))),
      "SHARED_BYTE_BUFFER",
      "TLV_INPUT_ACCEPTANCE",
      "TLV_BYTES"
    );
    addRuntime(
      "shared metadata backing",
      () =>
        createFutureBindingIntegrity(
          new Uint8Array(new SharedArrayBuffer(1)),
          boundPayload
        ),
      "SHARED_BYTE_BUFFER",
      "TLV_INPUT_ACCEPTANCE",
      "BINDING_METADATA"
    );
  }
  const detachedTlvBuffer = new ArrayBuffer(1);
  const detachedTlv = new Uint8Array(detachedTlvBuffer);
  structuredClone(detachedTlvBuffer, { transfer: [detachedTlvBuffer] });
  const detachedMetadataBuffer = new ArrayBuffer(1);
  const detachedMetadata = new Uint8Array(detachedMetadataBuffer);
  structuredClone(detachedMetadataBuffer, {
    transfer: [detachedMetadataBuffer]
  });
  addRuntime(
    "detached TLV backing",
    () => createRawATlvIntegrity(detachedTlv),
    "DETACHED_BYTE_BUFFER",
    "TLV_INPUT_ACCEPTANCE",
    "TLV_BYTES"
  );
  addRuntime(
    "detached metadata backing",
    () => createFutureBindingIntegrity(detachedMetadata, boundPayload),
    "DETACHED_BYTE_BUFFER",
    "TLV_INPUT_ACCEPTANCE",
    "BINDING_METADATA"
  );
  const oversized = new Uint8Array(
    CANONICAL_RUNTIME_INTEGRITY_MAX_A_TLV_BYTES + 1
  );
  addRuntime(
    "oversized TLV bytes",
    () => createRawATlvIntegrity(oversized),
    "BYTE_INPUT_TOO_LARGE",
    "TLV_INPUT_ACCEPTANCE",
    "TLV_BYTES"
  );
  addRuntime(
    "oversized metadata bytes",
    () => createFutureBindingIntegrity(oversized, boundPayload),
    "BYTE_INPUT_TOO_LARGE",
    "TLV_INPUT_ACCEPTANCE",
    "BINDING_METADATA"
  );
  for (const inputKind of ["TLV_BYTES", "BINDING_METADATA"] as const) {
    addStatic(
      `${inputKind} copy allocation failure`,
      "BYTE_COPY_ALLOCATION_FAILED",
      "TLV_INPUT_ACCEPTANCE",
      inputKind
    );
    addStatic(
      `${inputKind} intrinsic copy failure`,
      "BYTE_COPY_FAILED",
      "TLV_INPUT_ACCEPTANCE",
      inputKind
    );
  }

  addRuntime(
    "invalid stored record type",
    () => verifyRawATlvIntegrity(null, bytes),
    "INVALID_RECORD_TYPE",
    "BINDING_METADATA_VALIDATION",
    "BINDING_METADATA"
  );
  addRuntime(
    "proxy stored record",
    () => verifyRawATlvIntegrity(proxyRecord, bytes),
    "PROXY_RECORD",
    "BINDING_METADATA_VALIDATION",
    "BINDING_METADATA"
  );
  addRuntime(
    "nonplain stored record",
    () =>
      verifyRawATlvIntegrity(
        Object.assign(Object.create({}), record),
        bytes
      ),
    "NONPLAIN_RECORD",
    "BINDING_METADATA_VALIDATION",
    "BINDING_METADATA"
  );
  addRuntime(
    "symbol stored-record key",
    () =>
      verifyRawATlvIntegrity(
        { ...record, [Symbol("hostile")]: true },
        bytes
      ),
    "SYMBOL_RECORD_KEY",
    "BINDING_METADATA_VALIDATION",
    "BINDING_METADATA"
  );

  const fieldContexts = [
    {
      field: "domain",
      value: record.domain,
      inputKind: "HASH_DOMAIN" as const
    },
    {
      field: "digestHex",
      value: record.digestHex,
      inputKind: "DIGEST_TEXT" as const
    },
    {
      field: "algorithm",
      value: record.algorithm,
      inputKind: "BINDING_METADATA" as const
    }
  ];
  for (const context of fieldContexts) {
    addRuntime(
      `missing ${context.field}`,
      () => verifyRawATlvIntegrity(withoutField(record, context.field), bytes),
      "MISSING_RECORD_FIELD",
      "BINDING_METADATA_VALIDATION",
      context.inputKind
    );
    addRuntime(
      `accessor ${context.field}`,
      () =>
        verifyRawATlvIntegrity(
          accessorRecord(context.field, context.value),
          bytes
        ),
      "ACCESSOR_RECORD_FIELD",
      "BINDING_METADATA_VALIDATION",
      context.inputKind
    );
    addRuntime(
      `non-enumerable ${context.field}`,
      () =>
        verifyRawATlvIntegrity(
          withDescriptor(record, context.field, {
            configurable: true,
            enumerable: false,
            value: context.value
          }),
          bytes
        ),
      "NONENUMERABLE_RECORD_FIELD",
      "BINDING_METADATA_VALIDATION",
      context.inputKind
    );
    addRuntime(
      `wrong field type ${context.field}`,
      () => verifyRawATlvIntegrity(withField(record, context.field, 1), bytes),
      "INVALID_RECORD_FIELD_TYPE",
      "BINDING_METADATA_VALIDATION",
      context.inputKind
    );
  }
  addRuntime(
    "extra stored-record field",
    () => verifyRawATlvIntegrity({ ...record, extra: true }, bytes),
    "EXTRA_RECORD_FIELD",
    "BINDING_METADATA_VALIDATION",
    "BINDING_METADATA"
  );
  addRuntime(
    "unsupported domain",
    () => verifyRawATlvIntegrity(withField(record, "domain", "UNKNOWN"), bytes),
    "UNSUPPORTED_DOMAIN",
    "BINDING_METADATA_VALIDATION",
    "HASH_DOMAIN"
  );
  addRuntime(
    "supported but mismatched domain",
    () => verifyRawATlvIntegrity(canonicalRecord, bytes),
    "DOMAIN_MISMATCH",
    "BINDING_METADATA_VALIDATION",
    "HASH_DOMAIN"
  );
  const versionCases = [
    {
      name: "algorithm",
      field: "algorithm",
      value: "SHA-1",
      code: "UNSUPPORTED_ALGORITHM" as const
    },
    {
      name: "hash protocol",
      field: "hashProtocolVersion",
      value: "v2",
      code: "UNSUPPORTED_HASH_PROTOCOL_VERSION" as const
    },
    {
      name: "A value",
      field: "canonicalRuntimeValueVersion",
      value: "v2",
      code: "UNSUPPORTED_CANONICAL_RUNTIME_VALUE_VERSION" as const
    },
    {
      name: "A serialization",
      field: "canonicalRuntimeSerializationVersion",
      value: "v2",
      code: "UNSUPPORTED_CANONICAL_RUNTIME_SERIALIZATION_VERSION" as const
    }
  ];
  for (const versionCase of versionCases) {
    addRuntime(
      `unsupported ${versionCase.name}`,
      () =>
        verifyRawATlvIntegrity(
          withField(record, versionCase.field, versionCase.value),
          bytes
        ),
      versionCase.code,
      "BINDING_METADATA_VALIDATION",
      "BINDING_METADATA"
    );
  }
  addRuntime(
    "unsupported future-binding version",
    () =>
      verifyFutureBindingIntegrity(
        withField(futureRecord, "bindingVersion", "v2"),
        bindingMetadata,
        boundPayload
      ),
    "UNSUPPORTED_BINDING_VERSION",
    "BINDING_METADATA_VALIDATION",
    "BINDING_METADATA"
  );
  addRuntime(
    "invalid metadata length",
    () =>
      verifyRawATlvIntegrity(
        withField(record, "payloadByteLength", -1),
        bytes
      ),
    "INVALID_METADATA_LENGTH",
    "BINDING_METADATA_VALIDATION",
    "BINDING_METADATA"
  );
  addRuntime(
    "metadata length mismatch",
    () =>
      verifyRawATlvIntegrity(
        withField(record, "payloadByteLength", record.payloadByteLength + 1),
        bytes
      ),
    "METADATA_LENGTH_MISMATCH",
    "BINDING_METADATA_VALIDATION",
    "BINDING_METADATA"
  );
  addRuntime(
    "invalid digest encoding before byte admission",
    () =>
      verifyRawATlvIntegrity(
        withField(record, "digestEncoding", "bad"),
        laterBytes
      ),
    "INVALID_DIGEST_ENCODING",
    "BINDING_METADATA_VALIDATION",
    "DIGEST_TEXT"
  );
  addRuntime(
    "invalid digest length",
    () =>
      verifyRawATlvIntegrity(
        withField(record, "digestHex", record.digestHex.slice(1)),
        bytes
      ),
    "INVALID_DIGEST_LENGTH",
    "BINDING_METADATA_VALIDATION",
    "DIGEST_TEXT"
  );
  addRuntime(
    "invalid digest character",
    () =>
      verifyRawATlvIntegrity(
        withField(record, "digestHex", `g${record.digestHex.slice(1)}`),
        bytes
      ),
    "INVALID_DIGEST_HEX",
    "BINDING_METADATA_VALIDATION",
    "DIGEST_TEXT"
  );
  addStatic(
    "binding-envelope arithmetic overflow",
    "ARITHMETIC_OVERFLOW",
    "HASH_PREIMAGE_BUILD",
    "BINDING_METADATA"
  );
  addStatic(
    "outer-frame arithmetic overflow",
    "ARITHMETIC_OVERFLOW",
    "HASH_PREIMAGE_BUILD",
    "HASH_DOMAIN"
  );
  addStatic(
    "binding-envelope allocation failure",
    "BINDING_ALLOCATION_FAILED",
    "HASH_PREIMAGE_BUILD",
    "BINDING_METADATA"
  );
  addStatic(
    "outer-frame allocation failure",
    "FRAME_ALLOCATION_FAILED",
    "HASH_PREIMAGE_BUILD",
    "HASH_DOMAIN"
  );
  addStatic(
    "internal SHA-256 failure",
    "INTERNAL_HASH_FAILURE",
    "DIGEST_COMPUTATION",
    "DIGEST_BYTES"
  );
  addRuntime(
    "validly encoded but mismatched digest",
    () =>
      verifyRawATlvIntegrity(
        withField(
          record,
          "digestHex",
          `${record.digestHex[0] === "0" ? "1" : "0"}${record.digestHex.slice(1)}`
        ),
        bytes
      ),
    "DIGEST_MISMATCH",
    "DIGEST_VERIFICATION",
    "DIGEST_BYTES"
  );

  const source = readFileSync(
    new URL("./canonical-runtime-hash.ts", import.meta.url),
    "utf8"
  );
  for (const entry of entries) {
    expect(entry.expectedFailClosedBehavior, entry.name).toBe(
      "RETURN_EXACT_FAILURE_NO_THROW_NO_PARTIAL_RESULT"
    );
    if (entry.invoke === undefined) {
      expect(source, entry.name).toContain(`"${entry.code}"`);
    } else {
      expectFailure(entry.invoke(), {
        code: entry.code,
        phase: entry.phase,
        inputKind: entry.inputKind
      });
    }
  }

  const allFailureCodes: readonly CanonicalRuntimeIntegrityFailure["code"][] = [
    "INVALID_BYTE_INPUT",
    "PROXY_BYTE_INPUT",
    "WRONG_BYTE_VIEW",
    "SHARED_BYTE_BUFFER",
    "DETACHED_BYTE_BUFFER",
    "BYTE_INPUT_TOO_LARGE",
    "BYTE_COPY_ALLOCATION_FAILED",
    "BYTE_COPY_FAILED",
    "INVALID_RECORD_TYPE",
    "PROXY_RECORD",
    "NONPLAIN_RECORD",
    "SYMBOL_RECORD_KEY",
    "MISSING_RECORD_FIELD",
    "EXTRA_RECORD_FIELD",
    "ACCESSOR_RECORD_FIELD",
    "NONENUMERABLE_RECORD_FIELD",
    "INVALID_RECORD_FIELD_TYPE",
    "UNSUPPORTED_DOMAIN",
    "DOMAIN_MISMATCH",
    "UNSUPPORTED_ALGORITHM",
    "UNSUPPORTED_HASH_PROTOCOL_VERSION",
    "UNSUPPORTED_CANONICAL_RUNTIME_VALUE_VERSION",
    "UNSUPPORTED_CANONICAL_RUNTIME_SERIALIZATION_VERSION",
    "UNSUPPORTED_BINDING_VERSION",
    "INVALID_METADATA_LENGTH",
    "METADATA_LENGTH_MISMATCH",
    "INVALID_DIGEST_ENCODING",
    "INVALID_DIGEST_LENGTH",
    "INVALID_DIGEST_HEX",
    "ARITHMETIC_OVERFLOW",
    "BINDING_ALLOCATION_FAILED",
    "FRAME_ALLOCATION_FAILED",
    "INTERNAL_HASH_FAILURE",
    "DIGEST_MISMATCH"
  ];
  expect(new Set(entries.map((entry) => entry.code))).toStrictEqual(
    new Set(allFailureCodes)
  );
  expect(allFailureCodes).toHaveLength(34);
  expect(recordProxyTrapCalls).toBe(0);
  expect(accessorCalls).toBe(0);
  expect(byteTrapCalls).toBe(0);
};

describe("P2F1R-B deterministic integrity hash foundation", () => {
  it("B-C01_RAW_COPY_BOUNDARY admits exact Uint8Array bytes and rejects hostile views", () => {
    const source = bytesOf({ a: null });
    const record = directRecord(createRawATlvIntegrity(source));
    const digestBeforeMutation = record.digestHex;
    source[0] = source[0]! ^ 0xff;
    expect(record.digestHex).toBe(digestBeforeMutation);

    expectFailure(createRawATlvIntegrity(null), {
      code: "INVALID_BYTE_INPUT",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "TLV_BYTES"
    });
    expectFailure(createRawATlvIntegrity(Buffer.from([1])), {
      code: "WRONG_BYTE_VIEW",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "TLV_BYTES"
    });
    class BytesSubclass extends Uint8Array {}
    expectFailure(createRawATlvIntegrity(new BytesSubclass(1)), {
      code: "WRONG_BYTE_VIEW",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "TLV_BYTES"
    });
    expectFailure(createRawATlvIntegrity(new Uint16Array(1)), {
      code: "WRONG_BYTE_VIEW",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "TLV_BYTES"
    });
    for (const view of [
      new Int8Array(1),
      new Int16Array(1),
      new Uint16Array(1),
      new Float32Array(1)
    ]) {
      Object.setPrototypeOf(view, Uint8Array.prototype);
      expectFailure(createRawATlvIntegrity(view), {
        code: "WRONG_BYTE_VIEW",
        phase: "TLV_INPUT_ACCEPTANCE",
        inputKind: "TLV_BYTES"
      });
    }

    let conversionCalls = 0;
    const coercionHostile = {
      get byteLength() {
        conversionCalls += 1;
        return 1;
      },
      [Symbol.iterator]() {
        conversionCalls += 1;
        return [1][Symbol.iterator]();
      },
      valueOf() {
        conversionCalls += 1;
        return 1;
      },
      toString() {
        conversionCalls += 1;
        return "1";
      }
    };
    expectFailure(createRawATlvIntegrity(coercionHostile), {
      code: "WRONG_BYTE_VIEW",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "TLV_BYTES"
    });
    expect(conversionCalls).toBe(0);

    const traps = { getPrototypeOf: 0, get: 0, ownKeys: 0 };
    const proxy = new Proxy(new Uint8Array([1]), {
      getPrototypeOf: (target) => {
        traps.getPrototypeOf += 1;
        return Reflect.getPrototypeOf(target);
      },
      get: (target, property, receiver) => {
        traps.get += 1;
        return Reflect.get(target, property, receiver) as unknown;
      },
      ownKeys: (target) => {
        traps.ownKeys += 1;
        return Reflect.ownKeys(target);
      }
    });
    expectFailure(createRawATlvIntegrity(proxy), {
      code: "PROXY_BYTE_INPUT",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "TLV_BYTES"
    });
    expect(traps).toStrictEqual({ getPrototypeOf: 0, get: 0, ownKeys: 0 });

    const revoked = Proxy.revocable(new Uint8Array([1]), {});
    revoked.revoke();
    expectFailure(createRawATlvIntegrity(revoked.proxy), {
      code: "PROXY_BYTE_INPUT",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "TLV_BYTES"
    });

    if (typeof SharedArrayBuffer !== "undefined") {
      expectFailure(
        createRawATlvIntegrity(new Uint8Array(new SharedArrayBuffer(1))),
        {
          code: "SHARED_BYTE_BUFFER",
          phase: "TLV_INPUT_ACCEPTANCE",
          inputKind: "TLV_BYTES"
        }
      );
      const spoofedSharedBuffer = new SharedArrayBuffer(1);
      const spoofedSharedView = new Uint8Array(spoofedSharedBuffer);
      Object.setPrototypeOf(spoofedSharedBuffer, ArrayBuffer.prototype);
      expectFailure(createRawATlvIntegrity(spoofedSharedView), {
        code: "SHARED_BYTE_BUFFER",
        phase: "TLV_INPUT_ACCEPTANCE",
        inputKind: "TLV_BYTES"
      });
    }

    const detachedBuffer = new ArrayBuffer(1);
    const detachedView = new Uint8Array(detachedBuffer);
    structuredClone(detachedBuffer, { transfer: [detachedBuffer] });
    expectFailure(createRawATlvIntegrity(detachedView), {
      code: "DETACHED_BYTE_BUFFER",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "TLV_BYTES"
    });

    expectFailure(
      createRawATlvIntegrity(
        new Uint8Array(CANONICAL_RUNTIME_INTEGRITY_MAX_A_TLV_BYTES + 1)
      ),
      {
        code: "BYTE_INPUT_TOO_LARGE",
        phase: "TLV_INPUT_ACCEPTANCE",
        inputKind: "TLV_BYTES"
      }
    );

    const uint8IteratorDescriptor = Object.getOwnPropertyDescriptor(
      Uint8Array.prototype,
      Symbol.iterator
    );
    let iteratorCalls = 0;
    const hostileIterator = () => {
      iteratorCalls += 1;
      throw new Error("HOSTILE_ITERATOR_EXECUTED");
    };
    try {
      Object.defineProperty(Uint8Array.prototype, Symbol.iterator, {
        configurable: true,
        value: hostileIterator
      });
      const iteratorSafeRecord = directRecord(
        createRawATlvIntegrity(new Uint8Array([1, 2, 3]))
      );
      expect(
        verifyRawATlvIntegrity(iteratorSafeRecord, new Uint8Array([1, 2, 3]))
      ).toStrictEqual({ ok: true, matchesExactBytes: true });
      expect(iteratorCalls).toBe(0);
    } finally {
      if (uint8IteratorDescriptor === undefined) {
        Reflect.deleteProperty(Uint8Array.prototype, Symbol.iterator);
      } else {
        Object.defineProperty(
          Uint8Array.prototype,
          Symbol.iterator,
          uint8IteratorDescriptor
        );
      }
    }
  });

  it("B-C02_RAW_TLV_HASH matches exact raw known-answer vectors", () => {
    expect(directRecord(createRawATlvIntegrity(new Uint8Array()))).toMatchObject({
      domain: "RAW_A_TLV_INTEGRITY",
      payloadByteLength: 0,
      framedPreimageByteLength: 176,
      digestHex:
        "aff01a6e6280a1d199fe48523a012f0389dd3d1c17c89e0277e31277b3af299e"
    });
    expect(directRecord(createRawATlvIntegrity(bytesOf(null)))).toMatchObject({
      payloadByteLength: 11,
      framedPreimageByteLength: 187,
      digestHex:
        "bf8cc45b3e7fa358cdae010d62c9b98c792c88ebc34fe2fd8075f9f5f338b24d"
    });
  });

  it("B-C03_CANONICAL_VALUE_HASH consumes A bytes without calling A internally", () => {
    const nullBytes = bytesOf(null);
    const first = directRecord(createCanonicalValueIntegrity(nullBytes));
    const second = directRecord(createCanonicalValueIntegrity(nullBytes.slice()));
    expect(first).toStrictEqual(second);
    expect(first).toMatchObject({
      domain: "CANONICAL_VALUE_INTEGRITY",
      payloadByteLength: 11,
      framedPreimageByteLength: 193,
      digestHex:
        "ae69f6ddf0bf00b8169ff7fd71b8ff4ae805d9f802c669971b16cf17a55cb16b"
    });

    const source = readFileSync(
      new URL("./canonical-runtime-hash.ts", import.meta.url),
      "utf8"
    );
    expect(source).not.toContain("captureCanonicalRuntimeValue");
    expect(source).not.toContain("serializeCanonicalRuntimeValue");
    expect(source).not.toContain("readCanonicalRuntimeBacking");
    expect(source).not.toContain("./canonical-runtime-value");
  });

  it("B-C04_FUTURE_BINDING_HASH binds two ordered opaque byte sequences", () => {
    const metadata = bytesOf(null);
    const payload = bytesOf(true);
    const record = bindingRecord(
      createFutureBindingIntegrity(metadata, payload)
    );
    expect(record).toStrictEqual({
      domain: "FUTURE_BINDING_INTEGRITY",
      hashProtocolVersion: CANONICAL_RUNTIME_INTEGRITY_PROTOCOL_VERSION,
      algorithm: CANONICAL_RUNTIME_INTEGRITY_ALGORITHM,
      canonicalRuntimeValueVersion: "botc-canonical-runtime-value-v1",
      canonicalRuntimeSerializationVersion:
        "botc-canonical-runtime-tlv-be-v1",
      bindingVersion: FUTURE_BINDING_VERSION,
      bindingMetadataTlvByteLength: 11,
      boundPayloadTlvByteLength: 11,
      payloadByteLength: 83,
      framedPreimageByteLength: 264,
      digestEncoding: CANONICAL_RUNTIME_INTEGRITY_DIGEST_ENCODING,
      digestHex:
        "02e73017cc61bb6c2040bf845b2547d8b54090523b422d6ec6521087beacca3a"
    });
    expect(
      bindingRecord(createFutureBindingIntegrity(payload, metadata)).digestHex
    ).not.toBe(record.digestHex);
    expect(verifyFutureBindingIntegrity(record, metadata, payload)).toStrictEqual({
      ok: true,
      matchesExactBytes: true
    });
  });

  it("B-C05_ROLE_DOMAIN_SEPARATION freezes one preimage and complete structural vectors", () => {
    const bytes = bytesOf(null);
    const raw = directRecord(createRawATlvIntegrity(bytes));
    const canonical = directRecord(createCanonicalValueIntegrity(bytes));
    expect(raw.digestHex).not.toBe(canonical.digestHex);
    expect(raw.framedPreimageByteLength).toBe(187);
    expect(canonical.framedPreimageByteLength).toBe(193);

    expect(
      directRecord(createCanonicalValueIntegrity(bytesOf({ a: null })))
    ).toMatchObject({
      payloadByteLength: 21,
      framedPreimageByteLength: 203,
      digestHex:
        "0be0bd6f6ad7b00235d8cd4fba920e14b2826dc000d11f77d2f509e90e8957eb"
    });
    expect(
      directRecord(createCanonicalValueIntegrity(bytesOf(["a", null])))
    ).toMatchObject({
      payloadByteLength: 22,
      framedPreimageByteLength: 204,
      digestHex:
        "fd69af3bee7fffd9742863adf8b27521d69ac7c40f8b4d6ba9dba4e3471f2044"
    });
  });

  it("B-C06_RESULT_METADATA rejects hostile exact-shape and metadata mutations", () => {
    const bytes = bytesOf(null);
    const record = directRecord(createRawATlvIntegrity(bytes));
    expect(Object.keys(record)).toStrictEqual([
      "domain",
      "hashProtocolVersion",
      "algorithm",
      "canonicalRuntimeValueVersion",
      "canonicalRuntimeSerializationVersion",
      "payloadByteLength",
      "framedPreimageByteLength",
      "digestEncoding",
      "digestHex"
    ]);

    expectFailure(verifyRawATlvIntegrity(null, bytes), {
      code: "INVALID_RECORD_TYPE",
      phase: "BINDING_METADATA_VALIDATION",
      inputKind: "BINDING_METADATA"
    });
    expectFailure(
      verifyRawATlvIntegrity(withField(record, "extra", true), bytes),
      {
        code: "EXTRA_RECORD_FIELD",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "BINDING_METADATA"
      }
    );
    expectFailure(
      verifyRawATlvIntegrity(
        withField(record, "hashProtocolVersion", "future"),
        bytes
      ),
      {
        code: "UNSUPPORTED_HASH_PROTOCOL_VERSION",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "BINDING_METADATA"
      }
    );
    expectFailure(
      verifyRawATlvIntegrity(withField(record, "payloadByteLength", 10), bytes),
      {
        code: "METADATA_LENGTH_MISMATCH",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "BINDING_METADATA"
      }
    );

    let getterCalls = 0;
    const getterRecord = { ...record };
    Object.defineProperty(getterRecord, "digestHex", {
      enumerable: true,
      get: () => {
        getterCalls += 1;
        return record.digestHex;
      }
    });
    expectFailure(verifyRawATlvIntegrity(getterRecord, bytes), {
      code: "ACCESSOR_RECORD_FIELD",
      phase: "BINDING_METADATA_VALIDATION",
      inputKind: "DIGEST_TEXT"
    });
    expect(getterCalls).toBe(0);

    const symbolRecord = { ...record, [Symbol("hostile")]: true };
    expectFailure(verifyRawATlvIntegrity(symbolRecord, bytes), {
      code: "SYMBOL_RECORD_KEY",
      phase: "BINDING_METADATA_VALIDATION",
      inputKind: "BINDING_METADATA"
    });
  });

  it("B-C07_DIGEST_VERIFICATION detects bytes, domains, encoding and digest mutation", () => {
    const bytes = bytesOf(null);
    const record = directRecord(createRawATlvIntegrity(bytes));
    expect(verifyRawATlvIntegrity(record, bytes)).toStrictEqual({
      ok: true,
      matchesExactBytes: true
    });

    const mutated = bytes.slice();
    mutated[mutated.length - 1] =
      mutated[mutated.length - 1]! ^ 0x01;
    expectFailure(verifyRawATlvIntegrity(record, mutated), {
      code: "DIGEST_MISMATCH",
      phase: "DIGEST_VERIFICATION",
      inputKind: "DIGEST_BYTES"
    });
    expectFailure(verifyCanonicalValueIntegrity(record, bytes), {
      code: "DOMAIN_MISMATCH",
      phase: "BINDING_METADATA_VALIDATION",
      inputKind: "HASH_DOMAIN"
    });
    expectFailure(
      verifyRawATlvIntegrity(withField(record, "domain", "OTHER"), bytes),
      {
        code: "UNSUPPORTED_DOMAIN",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "HASH_DOMAIN"
      }
    );
    expectFailure(
      verifyRawATlvIntegrity(withField(record, "digestEncoding", "hex"), bytes),
      {
        code: "INVALID_DIGEST_ENCODING",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "DIGEST_TEXT"
      }
    );
    expectFailure(
      verifyRawATlvIntegrity(
        withField(record, "digestHex", record.digestHex.toUpperCase()),
        bytes
      ),
      {
        code: "INVALID_DIGEST_HEX",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "DIGEST_TEXT"
      }
    );
    const validButWrong =
      (record.digestHex[0] === "0" ? "1" : "0") + record.digestHex.slice(1);
    expectFailure(
      verifyRawATlvIntegrity(withField(record, "digestHex", validButWrong), bytes),
      {
        code: "DIGEST_MISMATCH",
        phase: "DIGEST_VERIFICATION",
        inputKind: "DIGEST_BYTES"
      }
    );
  });

  it("B-C08_FAILURE_PRECEDENCE returns the first closed triple without later reads", () => {
    exerciseCompleteFailureMatrix();
  });

  it("B-C09_HASH_NOT_AUTHORITY exposes integrity records rather than authority handles", () => {
    const record = directRecord(createRawATlvIntegrity(bytesOf(null)));
    expect(Object.keys(record)).not.toContain("authority");
    expect(Object.keys(record)).not.toContain("token");
    expect(Object.keys(record)).not.toContain("accepted");

    const source = readFileSync(
      new URL("./canonical-runtime-hash.ts", import.meta.url),
      "utf8"
    );
    expect(source).not.toMatch(/GameState|TrustedHistory|CanonicalStateHandle/);
    expect(source).not.toMatch(/createAuthority|issueAuthority|acceptedHistory/);
  });

  it("B-C10_CACHE_ONLY contains no snapshot, rebuild, replay or state capability", () => {
    const source = readFileSync(
      new URL("./canonical-runtime-hash.ts", import.meta.url),
      "utf8"
    );
    expect(source).not.toMatch(/snapshot|rebuild|replay|event/i);
    expect(source).not.toMatch(/canonicalStateHash|snapshotHash/);
  });

  it("B-C11_LEGACY_ISOLATION remains source-local and does not import application hashing", () => {
    const source = readFileSync(
      new URL("./canonical-runtime-hash.ts", import.meta.url),
      "utf8"
    );
    expect(source).not.toContain("@botc/application");
    expect(source).not.toContain("command-fingerprint");
    expect(source).not.toContain("canonicalCommandJson");
    expect(source).not.toContain("JSON.");
  });

  it("B-C12_PLATFORM_VECTOR_READINESS is deterministic for Unicode and newline A bytes", () => {
    expect(
      directRecord(createCanonicalValueIntegrity(bytesOf("😀")))
    ).toMatchObject({
      framedPreimageByteLength: 201,
      digestHex:
        "67766958407313afa18fd70edebe68fbee0ab73d3a81538cfb743550cb21b67b"
    });
    expect(
      directRecord(createCanonicalValueIntegrity(bytesOf("\n")))
    ).toMatchObject({
      framedPreimageByteLength: 198,
      digestHex:
        "8c333023fb93e9f1771e44610d78ba36c1a1d4c5a8655e44682fc5258f068adb"
    });
    expect(
      directRecord(createCanonicalValueIntegrity(bytesOf("\r\n")))
    ).toMatchObject({
      framedPreimageByteLength: 199,
      digestHex:
        "9cf2d5c3a8c79306ca1869c0aa574fa359e2ff2e0ab9ecf12ff0452892ba7e93"
    });
    for (const record of [
      directRecord(createRawATlvIntegrity(bytesOf(null))),
      directRecord(createCanonicalValueIntegrity(bytesOf(null)))
    ]) {
      expect(record.digestHex).toMatch(/^[0-9a-f]{64}$/);
      expect(record.digestHex).not.toContain("\n");
      expect(record.digestHex).not.toContain("\ufeff");
    }
  });
});
