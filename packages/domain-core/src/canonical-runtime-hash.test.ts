import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
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
  readonly branchLocation: string;
  readonly expectedFailClosedBehavior:
    | "FC-A_BYTE_REJECT"
    | "FC-B_RECORD_REJECT"
    | "FC-C_PREIMAGE_REJECT"
    | "FC-D_DIGEST_REJECT"
    | "FC-E_VERIFY_REJECT";
  readonly primaryTestBinding:
    | "B-C08a Byte Admission Contexts"
    | "B-C08b Verification Failure Contexts";
  readonly sourceNeedles?: readonly string[];
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
  const behaviorFor = (
    phase: CanonicalRuntimeIntegrityFailure["phase"]
  ): FailureMatrixEntry["expectedFailClosedBehavior"] => {
    switch (phase) {
      case "TLV_INPUT_ACCEPTANCE":
        return "FC-A_BYTE_REJECT";
      case "BINDING_METADATA_VALIDATION":
        return "FC-B_RECORD_REJECT";
      case "HASH_PREIMAGE_BUILD":
        return "FC-C_PREIMAGE_REJECT";
      case "DIGEST_COMPUTATION":
        return "FC-D_DIGEST_REJECT";
      case "DIGEST_VERIFICATION":
        return "FC-E_VERIFY_REJECT";
    }
  };
  const bindingFor = (
    phase: CanonicalRuntimeIntegrityFailure["phase"]
  ): FailureMatrixEntry["primaryTestBinding"] =>
    phase === "TLV_INPUT_ACCEPTANCE"
      ? "B-C08a Byte Admission Contexts"
      : "B-C08b Verification Failure Contexts";
  const branchFor = (
    code: CanonicalRuntimeIntegrityFailure["code"],
    phase: CanonicalRuntimeIntegrityFailure["phase"],
    inputKind: CanonicalRuntimeIntegrityFailure["inputKind"]
  ): string => {
    if (phase === "TLV_INPUT_ACCEPTANCE") {
      return `canonical-runtime-hash.ts:admitBytes/${code}/${inputKind}`;
    }
    if (phase === "BINDING_METADATA_VALIDATION") {
      return code === "METADATA_LENGTH_MISMATCH"
        ? "canonical-runtime-hash.ts:verifyDirect-or-verifyFutureBindingIntegrity/length-preimage-gate"
        : `canonical-runtime-hash.ts:admitRecord/${code}/${inputKind}`;
    }
    if (phase === "HASH_PREIMAGE_BUILD") {
      return inputKind === "HASH_DOMAIN"
        ? `canonical-runtime-hash.ts:buildPreimage/${code}`
        : `canonical-runtime-hash.ts:buildBindingEnvelope/${code}`;
    }
    if (phase === "DIGEST_COMPUTATION") {
      return `canonical-runtime-hash.ts:digestPreimage/${code}`;
    }
    return `canonical-runtime-hash.ts:compareDigest/${code}`;
  };
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
      branchLocation: branchFor(code, phase, inputKind),
      expectedFailClosedBehavior: behaviorFor(phase),
      primaryTestBinding: bindingFor(phase),
      invoke
    });
  };
  const addStatic = (
    name: string,
    code: CanonicalRuntimeIntegrityFailure["code"],
    phase: CanonicalRuntimeIntegrityFailure["phase"],
    inputKind: CanonicalRuntimeIntegrityFailure["inputKind"],
    sourceNeedles: readonly string[]
  ): void => {
    entries.push({
      name,
      code,
      phase,
      inputKind,
      branchLocation: branchFor(code, phase, inputKind),
      expectedFailClosedBehavior: behaviorFor(phase),
      primaryTestBinding: bindingFor(phase),
      sourceNeedles
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

  const detachedBytes = (): Uint8Array => {
    const buffer = new ArrayBuffer(1);
    const view = new Uint8Array(buffer);
    structuredClone(buffer, { transfer: [buffer] });
    return view;
  };
  const oversized = new Uint8Array(
    CANONICAL_RUNTIME_INTEGRITY_MAX_A_TLV_BYTES + 1
  );
  const byteFailureFamilies = [
    {
      label: "invalid",
      code: "INVALID_BYTE_INPUT" as const,
      candidate: (): unknown => null
    },
    {
      label: "proxy",
      code: "PROXY_BYTE_INPUT" as const,
      candidate: (): unknown =>
        new Proxy(new Uint8Array([1]), {
          get: (target, property, receiver) => {
            byteTrapCalls += 1;
            return Reflect.get(target, property, receiver) as unknown;
          }
        })
    },
    {
      label: "wrong-view",
      code: "WRONG_BYTE_VIEW" as const,
      candidate: (): unknown => new Uint16Array(1)
    },
    {
      label: "shared",
      code: "SHARED_BYTE_BUFFER" as const,
      candidate: (): unknown =>
        new Uint8Array(new SharedArrayBuffer(1))
    },
    {
      label: "detached",
      code: "DETACHED_BYTE_BUFFER" as const,
      candidate: detachedBytes
    },
    {
      label: "oversized",
      code: "BYTE_INPUT_TOO_LARGE" as const,
      candidate: (): unknown => oversized
    }
  ];
  for (const family of byteFailureFamilies) {
    addRuntime(
      `${family.label} raw TLV position`,
      () => createRawATlvIntegrity(family.candidate()),
      family.code,
      "TLV_INPUT_ACCEPTANCE",
      "TLV_BYTES"
    );
    addRuntime(
      `${family.label} canonical-value TLV position`,
      () => createCanonicalValueIntegrity(family.candidate()),
      family.code,
      "TLV_INPUT_ACCEPTANCE",
      "TLV_BYTES"
    );
    addRuntime(
      `${family.label} future metadata position`,
      () => createFutureBindingIntegrity(family.candidate(), laterBytes),
      family.code,
      "TLV_INPUT_ACCEPTANCE",
      "BINDING_METADATA"
    );
    addRuntime(
      `${family.label} future bound-payload position`,
      () =>
        createFutureBindingIntegrity(bindingMetadata, family.candidate()),
      family.code,
      "TLV_INPUT_ACCEPTANCE",
      "TLV_BYTES"
    );
  }
  for (const inputKind of ["TLV_BYTES", "BINDING_METADATA"] as const) {
    addStatic(
      `${inputKind} copy allocation failure`,
      "BYTE_COPY_ALLOCATION_FAILED",
      "TLV_INPUT_ACCEPTANCE",
      inputKind,
      [
        '"BYTE_COPY_ALLOCATION_FAILED"',
        '"TLV_INPUT_ACCEPTANCE"',
        "inputKind"
      ]
    );
    addStatic(
      `${inputKind} intrinsic copy failure`,
      "BYTE_COPY_FAILED",
      "TLV_INPUT_ACCEPTANCE",
      inputKind,
      ['"BYTE_COPY_FAILED"', '"TLV_INPUT_ACCEPTANCE"', "inputKind"]
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
    "BINDING_METADATA",
    [
      'const buildBindingEnvelope = (',
      'return failure("ARITHMETIC_OVERFLOW", "HASH_PREIMAGE_BUILD", inputKind)'
    ]
  );
  addStatic(
    "outer-frame arithmetic overflow",
    "ARITHMETIC_OVERFLOW",
    "HASH_PREIMAGE_BUILD",
    "HASH_DOMAIN",
    [
      'const buildPreimage = (',
      'return failure("ARITHMETIC_OVERFLOW", "HASH_PREIMAGE_BUILD", inputKind)'
    ]
  );
  addStatic(
    "binding-envelope allocation failure",
    "BINDING_ALLOCATION_FAILED",
    "HASH_PREIMAGE_BUILD",
    "BINDING_METADATA",
    [
      'const buildBindingEnvelope = (',
      '"BINDING_ALLOCATION_FAILED"',
      '"BINDING_METADATA"'
    ]
  );
  addStatic(
    "outer-frame allocation failure",
    "FRAME_ALLOCATION_FAILED",
    "HASH_PREIMAGE_BUILD",
    "HASH_DOMAIN",
    ['const buildPreimage = (', '"FRAME_ALLOCATION_FAILED"', '"HASH_DOMAIN"']
  );
  addStatic(
    "internal SHA-256 failure",
    "INTERNAL_HASH_FAILURE",
    "DIGEST_COMPUTATION",
    "DIGEST_BYTES",
    [
      'const digestPreimage = (',
      '"INTERNAL_HASH_FAILURE"',
      '"DIGEST_COMPUTATION"',
      '"DIGEST_BYTES"'
    ]
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
  const normalizedSource = source.replace(/\s+/g, " ");
  for (const entry of entries) {
    expect(entry.branchLocation, entry.name).toMatch(
      /^canonical-runtime-hash\.ts:/
    );
    expect(entry.primaryTestBinding, entry.name).toBe(
      bindingFor(entry.phase)
    );
    if (entry.invoke === undefined) {
      for (const needle of entry.sourceNeedles ?? []) {
        expect(normalizedSource, `${entry.name}: ${needle}`).toContain(
          needle.replace(/\s+/g, " ")
        );
      }
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
  for (const code of [
    "INVALID_BYTE_INPUT",
    "PROXY_BYTE_INPUT",
    "WRONG_BYTE_VIEW",
    "SHARED_BYTE_BUFFER",
    "DETACHED_BYTE_BUFFER",
    "BYTE_INPUT_TOO_LARGE"
  ] as const) {
    expect(
      entries.filter((entry) => entry.code === code),
      `${code}: all four public byte positions`
    ).toHaveLength(4);
  }
  expect(
    new Set(entries.map((entry) => entry.expectedFailClosedBehavior))
  ).toStrictEqual(
    new Set([
      "FC-A_BYTE_REJECT",
      "FC-B_RECORD_REJECT",
      "FC-C_PREIMAGE_REJECT",
      "FC-D_DIGEST_REJECT",
      "FC-E_VERIFY_REJECT"
    ])
  );
  expect(entries.every((entry) => entry.sourceNeedles !== undefined ||
    entry.invoke !== undefined)).toBe(true);
  expect(source).not.toMatch(
    /__test|testHook|forceFailure|injectFailure|mockHash/
  );
  const sourceScope = (start: string, end: string): string =>
    source.slice(source.indexOf(start), source.indexOf(end));
  const admitBytesSource = sourceScope(
    "const admitBytes = (",
    "const checkedSum = ("
  );
  expect(admitBytesSource).toContain('"BYTE_COPY_ALLOCATION_FAILED"');
  expect(admitBytesSource).toContain('"BYTE_COPY_FAILED"');
  expect(admitBytesSource).toContain('"TLV_INPUT_ACCEPTANCE"');
  expect(admitBytesSource).toContain("inputKind");
  const checkedSumSource = sourceScope(
    "const checkedSum = (",
    "const writeU32Be = ("
  );
  expect(checkedSumSource).toContain('"ARITHMETIC_OVERFLOW"');
  expect(checkedSumSource).toContain('"HASH_PREIMAGE_BUILD"');
  expect(checkedSumSource).toContain("inputKind");
  const bindingSource = sourceScope(
    "const buildBindingEnvelope = (",
    "const buildPreimage = ("
  );
  expect(bindingSource).toContain('"BINDING_METADATA"');
  expect(bindingSource).toContain('"BINDING_ALLOCATION_FAILED"');
  const preimageSource = sourceScope(
    "const buildPreimage = (",
    'const hexAlphabet = "0123456789abcdef"'
  );
  expect(preimageSource).toContain('"HASH_DOMAIN"');
  expect(preimageSource).toContain('"FRAME_ALLOCATION_FAILED"');
  const digestSource = sourceScope(
    "const digestPreimage = (",
    "const decodeHex = ("
  );
  expect(digestSource).toContain('"INTERNAL_HASH_FAILURE"');
  expect(digestSource).toContain('"DIGEST_COMPUTATION"');
  expect(digestSource).toContain('"DIGEST_BYTES"');
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

    expectFailure(createCanonicalValueIntegrity(null), {
      code: "INVALID_BYTE_INPUT",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "TLV_BYTES"
    });
    expectFailure(createFutureBindingIntegrity(null, source), {
      code: "INVALID_BYTE_INPUT",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "BINDING_METADATA"
    });
    expectFailure(createFutureBindingIntegrity(source, null), {
      code: "INVALID_BYTE_INPUT",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "TLV_BYTES"
    });

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

  it("B-C05a Binding Envelope and Preimage Vector Contract", () => {
    const bytes = bytesOf(null);
    const raw = directRecord(createRawATlvIntegrity(bytes));
    const canonical = directRecord(createCanonicalValueIntegrity(bytes));
    expect(raw.digestHex).not.toBe(canonical.digestHex);
    expect(raw.framedPreimageByteLength).toBe(187);
    expect(canonical.framedPreimageByteLength).toBe(193);

    const vectors = [
      {
        value: { a: null },
        payloadHex: "424f54434352562b30310600000001000000016100",
        preimageHex:
          "424f54434352482b303100000031626f74632d63616e6f6e6963616c2d72756e74696d652d696e746567726974792d7368613235362d6672616d65642d76310000001943414e4f4e4943414c5f56414c55455f494e54454752495459000000075348412d3235360000001f626f74632d63616e6f6e6963616c2d72756e74696d652d76616c75652d763100000020626f74632d63616e6f6e6963616c2d72756e74696d652d746c762d62652d76310000000000000015424f54434352562b30310600000001000000016100",
        frameLength: 203,
        digestHex:
          "0be0bd6f6ad7b00235d8cd4fba920e14b2826dc000d11f77d2f509e90e8957eb"
      },
      {
        value: ["a", null],
        payloadHex: "424f54434352562b3031050000000204000000016100",
        preimageHex:
          "424f54434352482b303100000031626f74632d63616e6f6e6963616c2d72756e74696d652d696e746567726974792d7368613235362d6672616d65642d76310000001943414e4f4e4943414c5f56414c55455f494e54454752495459000000075348412d3235360000001f626f74632d63616e6f6e6963616c2d72756e74696d652d76616c75652d763100000020626f74632d63616e6f6e6963616c2d72756e74696d652d746c762d62652d76310000000000000016424f54434352562b3031050000000204000000016100",
        frameLength: 204,
        digestHex:
          "fd69af3bee7fffd9742863adf8b27521d69ac7c40f8b4d6ba9dba4e3471f2044"
      }
    ] as const;
    for (const vector of vectors) {
      const payload = bytesOf(vector.value);
      expect(Buffer.from(payload).toString("hex")).toBe(vector.payloadHex);
      expect(Buffer.from(vector.preimageHex, "hex")).toHaveLength(
        vector.frameLength
      );
      expect(
        createHash("sha256")
          .update(Buffer.from(vector.preimageHex, "hex"))
          .digest("hex")
      ).toBe(vector.digestHex);
      const vectorRecord = directRecord(
        createCanonicalValueIntegrity(payload)
      );
      expect(vectorRecord).toMatchObject({
        payloadByteLength: payload.length,
        framedPreimageByteLength: vector.frameLength,
        digestHex: vector.digestHex
      });
      const mutated = payload.slice();
      mutated[mutated.length - 1] =
        mutated[mutated.length - 1]! ^ 0x01;
      expectFailure(
        verifyCanonicalValueIntegrity(vectorRecord, mutated),
        {
          code: "DIGEST_MISMATCH",
          phase: "DIGEST_VERIFICATION",
          inputKind: "DIGEST_BYTES"
        }
      );
    }

    const bindingMetadataTlvBytes = Buffer.from(
      "424f54434352562b303100",
      "hex"
    );
    const boundPayloadTlvBytes = Buffer.from(
      "424f54434352562b303102",
      "hex"
    );
    const u32be = (value: number): Buffer => {
      const encoded = Buffer.alloc(4);
      encoded.writeUInt32BE(value);
      return encoded;
    };
    const u64be = (value: number): Buffer => {
      const encoded = Buffer.alloc(8);
      encoded.writeBigUInt64BE(BigInt(value));
      return encoded;
    };
    const frameText = (value: string): Buffer => {
      const encoded = Buffer.from(value, "ascii");
      return Buffer.concat([u32be(encoded.length), encoded]);
    };
    const envelope = Buffer.concat([
      Buffer.from("BOTCCRB+01", "ascii"),
      frameText("botc-future-binding-envelope-v1"),
      u64be(bindingMetadataTlvBytes.length),
      bindingMetadataTlvBytes,
      u64be(boundPayloadTlvBytes.length),
      boundPayloadTlvBytes
    ]);
    const domainFrame = Buffer.concat([
      Buffer.from("BOTCCRH+01", "ascii"),
      frameText("botc-canonical-runtime-integrity-sha256-framed-v1"),
      frameText("FUTURE_BINDING_INTEGRITY"),
      frameText("SHA-256")
    ]);
    const fullPreimage = Buffer.concat([
      domainFrame,
      frameText("botc-canonical-runtime-value-v1"),
      frameText("botc-canonical-runtime-tlv-be-v1"),
      u64be(envelope.length),
      envelope
    ]);
    expect(bindingMetadataTlvBytes.toString("hex")).toBe(
      "424f54434352562b303100"
    );
    expect(boundPayloadTlvBytes.toString("hex")).toBe(
      "424f54434352562b303102"
    );
    expect(envelope.toString("hex")).toBe(
      "424f54434352422b30310000001f626f74632d6675747572652d62696e64696e672d656e76656c6f70652d7631000000000000000b424f54434352562b303100000000000000000b424f54434352562b303102"
    );
    expect(envelope).toHaveLength(83);
    expect(domainFrame.toString("hex")).toBe(
      "424f54434352482b303100000031626f74632d63616e6f6e6963616c2d72756e74696d652d696e746567726974792d7368613235362d6672616d65642d7631000000184655545552455f42494e44494e475f494e54454752495459000000075348412d323536"
    );
    expect(fullPreimage.toString("hex")).toBe(
      "424f54434352482b303100000031626f74632d63616e6f6e6963616c2d72756e74696d652d696e746567726974792d7368613235362d6672616d65642d7631000000184655545552455f42494e44494e475f494e54454752495459000000075348412d3235360000001f626f74632d63616e6f6e6963616c2d72756e74696d652d76616c75652d763100000020626f74632d63616e6f6e6963616c2d72756e74696d652d746c762d62652d76310000000000000053424f54434352422b30310000001f626f74632d6675747572652d62696e64696e672d656e76656c6f70652d7631000000000000000b424f54434352562b303100000000000000000b424f54434352562b303102"
    );
    expect(fullPreimage).toHaveLength(264);
    const digestHex = createHash("sha256").update(fullPreimage).digest("hex");
    expect(digestHex).toBe(
      "02e73017cc61bb6c2040bf845b2547d8b54090523b422d6ec6521087beacca3a"
    );
    expect(
      bindingRecord(
        createFutureBindingIntegrity(
          new Uint8Array(bindingMetadataTlvBytes),
          new Uint8Array(boundPayloadTlvBytes)
        )
      )
    ).toStrictEqual({
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
      digestHex
    });
  });

  it("B-C05b Future Binding Integrity Vector Contract", () => {
    const metadata = new Uint8Array(
      Buffer.from("424f54434352562b303100", "hex")
    );
    const payload = new Uint8Array(
      Buffer.from("424f54434352562b303102", "hex")
    );
    const record = bindingRecord(
      createFutureBindingIntegrity(metadata, payload)
    );
    expect(
      bindingRecord(createFutureBindingIntegrity(metadata, payload))
    ).toStrictEqual(record);
    expect(
      verifyFutureBindingIntegrity(record, metadata, payload)
    ).toStrictEqual({ ok: true, matchesExactBytes: true });

    const metadataMutation = metadata.slice();
    metadataMutation[metadataMutation.length - 1] =
      metadataMutation[metadataMutation.length - 1]! ^ 0x01;
    const payloadMutation = payload.slice();
    payloadMutation[payloadMutation.length - 1] =
      payloadMutation[payloadMutation.length - 1]! ^ 0x01;
    for (const [label, mutatedMetadata, mutatedPayload] of [
      ["metadata", metadataMutation, payload],
      ["payload", metadata, payloadMutation]
    ] as const) {
      expect(
        bindingRecord(
          createFutureBindingIntegrity(mutatedMetadata, mutatedPayload)
        ).digestHex,
        label
      ).not.toBe(record.digestHex);
      expectFailure(
        verifyFutureBindingIntegrity(
          record,
          mutatedMetadata,
          mutatedPayload
        ),
        {
          code: "DIGEST_MISMATCH",
          phase: "DIGEST_VERIFICATION",
          inputKind: "DIGEST_BYTES"
        }
      );
    }
    expect(
      bindingRecord(createFutureBindingIntegrity(payload, metadata)).digestHex
    ).not.toBe(record.digestHex);

    for (const field of [
      "bindingMetadataTlvByteLength",
      "boundPayloadTlvByteLength",
      "payloadByteLength",
      "framedPreimageByteLength"
    ] as const) {
      expectFailure(
        verifyFutureBindingIntegrity(
          withField(record, field, record[field] + 1),
          metadata,
          payload
        ),
        {
          code: "METADATA_LENGTH_MISMATCH",
          phase: "BINDING_METADATA_VALIDATION",
          inputKind: "BINDING_METADATA"
        }
      );
    }
    for (const [field, value, code, inputKind] of [
      [
        "bindingVersion",
        "botc-future-binding-envelope-v2",
        "UNSUPPORTED_BINDING_VERSION",
        "BINDING_METADATA"
      ],
      [
        "hashProtocolVersion",
        "botc-canonical-runtime-integrity-sha256-framed-v2",
        "UNSUPPORTED_HASH_PROTOCOL_VERSION",
        "BINDING_METADATA"
      ],
      [
        "domain",
        "CANONICAL_VALUE_INTEGRITY",
        "DOMAIN_MISMATCH",
        "HASH_DOMAIN"
      ],
      ["domain", "UNKNOWN", "UNSUPPORTED_DOMAIN", "HASH_DOMAIN"]
    ] as const) {
      expectFailure(
        verifyFutureBindingIntegrity(
          withField(record, field, value),
          metadata,
          payload
        ),
        {
          code,
          phase: "BINDING_METADATA_VALIDATION",
          inputKind
        }
      );
    }
    expectFailure(
      verifyFutureBindingIntegrity(
        withField(
          record,
          "digestHex",
          `${record.digestHex[0] === "0" ? "1" : "0"}${record.digestHex.slice(1)}`
        ),
        metadata,
        payload
      ),
      {
        code: "DIGEST_MISMATCH",
        phase: "DIGEST_VERIFICATION",
        inputKind: "DIGEST_BYTES"
      }
    );
    expectFailure(
      verifyFutureBindingIntegrity(
        withField(record, "digestHex", record.digestHex.slice(1)),
        metadata,
        payload
      ),
      {
        code: "INVALID_DIGEST_LENGTH",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "DIGEST_TEXT"
      }
    );
    expectFailure(
      verifyFutureBindingIntegrity(
        withField(record, "digestHex", `g${record.digestHex.slice(1)}`),
        metadata,
        payload
      ),
      {
        code: "INVALID_DIGEST_HEX",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "DIGEST_TEXT"
      }
    );
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

    const metadata = bytesOf("metadata");
    const payload = bytesOf("payload");
    const futureRecord = bindingRecord(
      createFutureBindingIntegrity(metadata, payload)
    );
    expect(
      verifyFutureBindingIntegrity(futureRecord, metadata, payload)
    ).toStrictEqual({ ok: true, matchesExactBytes: true });
    const mutatedMetadata = metadata.slice();
    mutatedMetadata[mutatedMetadata.length - 1] =
      mutatedMetadata[mutatedMetadata.length - 1]! ^ 0x01;
    expectFailure(
      verifyFutureBindingIntegrity(futureRecord, mutatedMetadata, payload),
      {
        code: "DIGEST_MISMATCH",
        phase: "DIGEST_VERIFICATION",
        inputKind: "DIGEST_BYTES"
      }
    );
    const mutatedPayload = payload.slice();
    mutatedPayload[mutatedPayload.length - 1] =
      mutatedPayload[mutatedPayload.length - 1]! ^ 0x01;
    expectFailure(
      verifyFutureBindingIntegrity(futureRecord, metadata, mutatedPayload),
      {
        code: "DIGEST_MISMATCH",
        phase: "DIGEST_VERIFICATION",
        inputKind: "DIGEST_BYTES"
      }
    );
    expectFailure(
      verifyFutureBindingIntegrity(
        withField(
          futureRecord,
          "bindingMetadataTlvByteLength",
          futureRecord.bindingMetadataTlvByteLength + 1
        ),
        metadata,
        payload
      ),
      {
        code: "METADATA_LENGTH_MISMATCH",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "BINDING_METADATA"
      }
    );
    expectFailure(
      verifyFutureBindingIntegrity(
        withField(futureRecord, "bindingVersion", "future"),
        metadata,
        payload
      ),
      {
        code: "UNSUPPORTED_BINDING_VERSION",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "BINDING_METADATA"
      }
    );
  });

  it("B-C08a Byte Admission Contexts", () => {
    const directBytes = bytesOf(null);
    const metadata = bytesOf("metadata");
    const payload = bytesOf("payload");
    const rawRecord = directRecord(createRawATlvIntegrity(directBytes));
    const canonicalRecord = directRecord(
      createCanonicalValueIntegrity(directBytes)
    );
    const futureRecord = bindingRecord(
      createFutureBindingIntegrity(metadata, payload)
    );
    const detached = (): Uint8Array => {
      const buffer = new ArrayBuffer(1);
      const view = new Uint8Array(buffer);
      structuredClone(buffer, { transfer: [buffer] });
      return view;
    };
    class Uint8Subclass extends Uint8Array {}
    const forbiddenPrototype = (): Uint8Array => {
      const view = new Uint8Array([1]);
      const prototype = Object.create(Uint8Array.prototype) as object;
      Object.setPrototypeOf(view, prototype);
      return view;
    };
    const proxyTrapCounts: number[] = [];
    const trappedProxy = (): unknown => {
      let calls = 0;
      proxyTrapCounts.push(calls);
      const index = proxyTrapCounts.length - 1;
      return new Proxy(new Uint8Array([1]), {
        get() {
          proxyTrapCounts[index] = ++calls;
          throw new Error("BYTE_PROXY_GET_EXECUTED");
        },
        getPrototypeOf() {
          proxyTrapCounts[index] = ++calls;
          throw new Error("BYTE_PROXY_PROTOTYPE_EXECUTED");
        },
        ownKeys() {
          proxyTrapCounts[index] = ++calls;
          throw new Error("BYTE_PROXY_KEYS_EXECUTED");
        }
      });
    };
    const revokedProxy = (): unknown => {
      const pair = Proxy.revocable(new Uint8Array([1]), {});
      pair.revoke();
      return pair.proxy;
    };
    const families: {
      readonly label: string;
      readonly code: CanonicalRuntimeIntegrityFailure["code"];
      readonly create: () => unknown;
    }[] = [
      { label: "null", code: "INVALID_BYTE_INPUT", create: () => null },
      { label: "number", code: "INVALID_BYTE_INPUT", create: () => 1 },
      { label: "Proxy", code: "PROXY_BYTE_INPUT", create: trappedProxy },
      {
        label: "revoked Proxy",
        code: "PROXY_BYTE_INPUT",
        create: revokedProxy
      },
      {
        label: "Uint16Array",
        code: "WRONG_BYTE_VIEW",
        create: () => new Uint16Array(1)
      },
      {
        label: "DataView",
        code: "WRONG_BYTE_VIEW",
        create: () => new DataView(new ArrayBuffer(1))
      },
      {
        label: "ArrayBuffer",
        code: "WRONG_BYTE_VIEW",
        create: () => new ArrayBuffer(1)
      },
      {
        label: "Buffer",
        code: "WRONG_BYTE_VIEW",
        create: () => Buffer.from([1])
      },
      {
        label: "Uint8Array subclass",
        code: "WRONG_BYTE_VIEW",
        create: () => new Uint8Subclass([1])
      },
      {
        label: "forbidden prototype",
        code: "WRONG_BYTE_VIEW",
        create: forbiddenPrototype
      },
      {
        label: "detached",
        code: "DETACHED_BYTE_BUFFER",
        create: detached
      },
      {
        label: "oversized",
        code: "BYTE_INPUT_TOO_LARGE",
        create: () =>
          new Uint8Array(CANONICAL_RUNTIME_INTEGRITY_MAX_A_TLV_BYTES + 1)
      }
    ];
    if (typeof SharedArrayBuffer !== "undefined") {
      families.push({
        label: "SharedArrayBuffer backing",
        code: "SHARED_BYTE_BUFFER",
        create: () => new Uint8Array(new SharedArrayBuffer(1))
      });
    }

    const positions: readonly {
      readonly label: string;
      readonly inputKind: CanonicalRuntimeIntegrityFailure["inputKind"];
      readonly invoke: (candidate: unknown) => FailableResult;
    }[] = [
      {
        label: "raw create payload",
        inputKind: "TLV_BYTES",
        invoke: createRawATlvIntegrity
      },
      {
        label: "raw verify payload",
        inputKind: "TLV_BYTES",
        invoke: (candidate) => verifyRawATlvIntegrity(rawRecord, candidate)
      },
      {
        label: "canonical create payload",
        inputKind: "TLV_BYTES",
        invoke: createCanonicalValueIntegrity
      },
      {
        label: "canonical verify payload",
        inputKind: "TLV_BYTES",
        invoke: (candidate) =>
          verifyCanonicalValueIntegrity(canonicalRecord, candidate)
      },
      {
        label: "future create metadata",
        inputKind: "BINDING_METADATA",
        invoke: (candidate) => createFutureBindingIntegrity(candidate, payload)
      },
      {
        label: "future create payload",
        inputKind: "TLV_BYTES",
        invoke: (candidate) => createFutureBindingIntegrity(metadata, candidate)
      },
      {
        label: "future verify metadata",
        inputKind: "BINDING_METADATA",
        invoke: (candidate) =>
          verifyFutureBindingIntegrity(futureRecord, candidate, payload)
      },
      {
        label: "future verify payload",
        inputKind: "TLV_BYTES",
        invoke: (candidate) =>
          verifyFutureBindingIntegrity(futureRecord, metadata, candidate)
      }
    ];
    for (const family of families) {
      for (const position of positions) {
        expectFailure(position.invoke(family.create()), {
          code: family.code,
          phase: "TLV_INPUT_ACCEPTANCE",
          inputKind: position.inputKind
        });
      }
    }
    expect(proxyTrapCounts.every((count) => count === 0)).toBe(true);

    let laterArgumentTrapCalls = 0;
    const laterArgument = new Proxy(new Uint8Array([1]), {
      get() {
        laterArgumentTrapCalls += 1;
        throw new Error("LATER_BYTE_ARGUMENT_ACCESSED");
      }
    });
    expectFailure(createFutureBindingIntegrity(null, laterArgument), {
      code: "INVALID_BYTE_INPUT",
      phase: "TLV_INPUT_ACCEPTANCE",
      inputKind: "BINDING_METADATA"
    });
    expectFailure(
      verifyFutureBindingIntegrity(futureRecord, null, laterArgument),
      {
        code: "INVALID_BYTE_INPUT",
        phase: "TLV_INPUT_ACCEPTANCE",
        inputKind: "BINDING_METADATA"
      }
    );
    expect(laterArgumentTrapCalls).toBe(0);

    const callerMetadata = bytesOf("metadata");
    const callerPayload = bytesOf("payload");
    const retainedMetadata = callerMetadata.slice();
    const retainedPayload = callerPayload.slice();
    const isolatedRecord = bindingRecord(
      createFutureBindingIntegrity(callerMetadata, callerPayload)
    );
    const isolatedRecordSnapshot = { ...isolatedRecord };
    callerMetadata[callerMetadata.length - 1] =
      callerMetadata[callerMetadata.length - 1]! ^ 0x01;
    callerPayload[callerPayload.length - 1] =
      callerPayload[callerPayload.length - 1]! ^ 0x01;
    expect(isolatedRecord).toStrictEqual(isolatedRecordSnapshot);
    expect(
      verifyFutureBindingIntegrity(
        isolatedRecord,
        retainedMetadata,
        retainedPayload
      )
    ).toStrictEqual({ ok: true, matchesExactBytes: true });

    const source = readFileSync(
      new URL("./canonical-runtime-hash.ts", import.meta.url),
      "utf8"
    );
    const admitBytesSource = source.slice(
      source.indexOf("const admitBytes = ("),
      source.indexOf("const checkedSum = (")
    );
    for (const needle of [
      '"BYTE_COPY_ALLOCATION_FAILED"',
      '"BYTE_COPY_FAILED"',
      '"TLV_INPUT_ACCEPTANCE"',
      '"TLV_BYTES"',
      '"BINDING_METADATA"'
    ]) {
      expect(admitBytesSource).toContain(needle);
    }
    expect(source).not.toMatch(
      /__test|testHook|forceFailure|injectFailure|mockHash/
    );
  });

  it("B-C08b Verification Failure Contexts", () => {
    exerciseCompleteFailureMatrix();

    const bytes = bytesOf(null);
    const record = directRecord(createRawATlvIntegrity(bytes));
    const metadata = bytesOf("metadata");
    const payload = bytesOf("payload");
    const futureRecord = bindingRecord(
      createFutureBindingIntegrity(metadata, payload)
    );
    for (const candidate of [
      null,
      undefined,
      false,
      0,
      0n,
      "",
      Symbol("record"),
      () => undefined
    ]) {
      expectFailure(verifyRawATlvIntegrity(candidate, bytes), {
        code: "INVALID_RECORD_TYPE",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "BINDING_METADATA"
      });
    }

    let recordTrapCalls = 0;
    const recordProxy = new Proxy(record, {
      get() {
        recordTrapCalls += 1;
        throw new Error("RECORD_PROXY_GET_EXECUTED");
      },
      getPrototypeOf() {
        recordTrapCalls += 1;
        throw new Error("RECORD_PROXY_PROTOTYPE_EXECUTED");
      },
      ownKeys() {
        recordTrapCalls += 1;
        throw new Error("RECORD_PROXY_KEYS_EXECUTED");
      }
    });
    expectFailure(verifyRawATlvIntegrity(recordProxy, bytes), {
      code: "PROXY_RECORD",
      phase: "BINDING_METADATA_VALIDATION",
      inputKind: "BINDING_METADATA"
    });
    const revokedRecord = Proxy.revocable(record, {});
    revokedRecord.revoke();
    expectFailure(verifyRawATlvIntegrity(revokedRecord.proxy, bytes), {
      code: "PROXY_RECORD",
      phase: "BINDING_METADATA_VALIDATION",
      inputKind: "BINDING_METADATA"
    });
    expect(recordTrapCalls).toBe(0);

    class RecordClass {
      readonly marker = true;
    }
    for (const candidate of [
      [],
      new Date(0),
      Object.assign(new RecordClass(), record),
      Object.assign(Object.create({ forbidden: true }), record)
    ]) {
      expectFailure(verifyRawATlvIntegrity(candidate, bytes), {
        code: "NONPLAIN_RECORD",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "BINDING_METADATA"
      });
    }

    const omitField = (source: object, field: string): Record<string, unknown> => {
      const clone = { ...source } as Record<string, unknown>;
      Reflect.deleteProperty(clone, field);
      return clone;
    };
    const descriptorField = (
      source: object,
      field: string,
      descriptor: PropertyDescriptor
    ): Record<string, unknown> => {
      const clone = { ...source } as Record<string, unknown>;
      Object.defineProperty(clone, field, descriptor);
      return clone;
    };
    let getterCalls = 0;
    for (const context of [
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
    ]) {
      expectFailure(
        verifyRawATlvIntegrity(omitField(record, context.field), bytes),
        {
          code: "MISSING_RECORD_FIELD",
          phase: "BINDING_METADATA_VALIDATION",
          inputKind: context.inputKind
        }
      );
      expectFailure(
        verifyRawATlvIntegrity(
          descriptorField(record, context.field, {
            configurable: true,
            enumerable: true,
            get() {
              getterCalls += 1;
              return context.value;
            }
          }),
          bytes
        ),
        {
          code: "ACCESSOR_RECORD_FIELD",
          phase: "BINDING_METADATA_VALIDATION",
          inputKind: context.inputKind
        }
      );
      expectFailure(
        verifyRawATlvIntegrity(
          descriptorField(record, context.field, {
            configurable: true,
            enumerable: false,
            value: context.value
          }),
          bytes
        ),
        {
          code: "NONENUMERABLE_RECORD_FIELD",
          phase: "BINDING_METADATA_VALIDATION",
          inputKind: context.inputKind
        }
      );
      expectFailure(
        verifyRawATlvIntegrity(withField(record, context.field, 1), bytes),
        {
          code: "INVALID_RECORD_FIELD_TYPE",
          phase: "BINDING_METADATA_VALIDATION",
          inputKind: context.inputKind
        }
      );
    }
    expect(getterCalls).toBe(0);
    expectFailure(
      verifyRawATlvIntegrity({ ...record, [Symbol("hostile")]: true }, bytes),
      {
        code: "SYMBOL_RECORD_KEY",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "BINDING_METADATA"
      }
    );
    expectFailure(
      verifyRawATlvIntegrity({ ...record, extra: true }, bytes),
      {
        code: "EXTRA_RECORD_FIELD",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "BINDING_METADATA"
      }
    );

    const directLengthFields = [
      "payloadByteLength",
      "framedPreimageByteLength"
    ] as const;
    const futureLengthFields = [
      "bindingMetadataTlvByteLength",
      "boundPayloadTlvByteLength",
      "payloadByteLength",
      "framedPreimageByteLength"
    ] as const;
    const invalidNumericLengths = [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      -1,
      1.5,
      Number.MAX_SAFE_INTEGER + 1
    ];
    for (const field of directLengthFields) {
      expectFailure(
        verifyRawATlvIntegrity(withField(record, field, "1"), bytes),
        {
          code: "INVALID_RECORD_FIELD_TYPE",
          phase: "BINDING_METADATA_VALIDATION",
          inputKind: "BINDING_METADATA"
        }
      );
      for (const invalidLength of invalidNumericLengths) {
        expectFailure(
          verifyRawATlvIntegrity(
            withField(record, field, invalidLength),
            bytes
          ),
          {
            code: "INVALID_METADATA_LENGTH",
            phase: "BINDING_METADATA_VALIDATION",
            inputKind: "BINDING_METADATA"
          }
        );
      }
      expectFailure(
        verifyRawATlvIntegrity(
          withField(record, field, record[field] + 1),
          bytes
        ),
        {
          code: "METADATA_LENGTH_MISMATCH",
          phase: "BINDING_METADATA_VALIDATION",
          inputKind: "BINDING_METADATA"
        }
      );
    }
    for (const field of futureLengthFields) {
      expectFailure(
        verifyFutureBindingIntegrity(
          withField(futureRecord, field, "1"),
          metadata,
          payload
        ),
        {
          code: "INVALID_RECORD_FIELD_TYPE",
          phase: "BINDING_METADATA_VALIDATION",
          inputKind: "BINDING_METADATA"
        }
      );
      for (const invalidLength of invalidNumericLengths) {
        expectFailure(
          verifyFutureBindingIntegrity(
            withField(futureRecord, field, invalidLength),
            metadata,
            payload
          ),
          {
            code: "INVALID_METADATA_LENGTH",
            phase: "BINDING_METADATA_VALIDATION",
            inputKind: "BINDING_METADATA"
          }
        );
      }
      expectFailure(
        verifyFutureBindingIntegrity(
          withField(futureRecord, field, futureRecord[field] + 1),
          metadata,
          payload
        ),
        {
          code: "METADATA_LENGTH_MISMATCH",
          phase: "BINDING_METADATA_VALIDATION",
          inputKind: "BINDING_METADATA"
        }
      );
    }

    const directMutation = bytes.slice();
    directMutation[directMutation.length - 1] =
      directMutation[directMutation.length - 1]! ^ 0x01;
    expectFailure(verifyRawATlvIntegrity(record, directMutation), {
      code: "DIGEST_MISMATCH",
      phase: "DIGEST_VERIFICATION",
      inputKind: "DIGEST_BYTES"
    });
    const metadataMutation = metadata.slice();
    metadataMutation[metadataMutation.length - 1] =
      metadataMutation[metadataMutation.length - 1]! ^ 0x01;
    const payloadMutation = payload.slice();
    payloadMutation[payloadMutation.length - 1] =
      payloadMutation[payloadMutation.length - 1]! ^ 0x01;
    expectFailure(
      verifyFutureBindingIntegrity(futureRecord, metadataMutation, payload),
      {
        code: "DIGEST_MISMATCH",
        phase: "DIGEST_VERIFICATION",
        inputKind: "DIGEST_BYTES"
      }
    );
    expectFailure(
      verifyFutureBindingIntegrity(futureRecord, metadata, payloadMutation),
      {
        code: "DIGEST_MISMATCH",
        phase: "DIGEST_VERIFICATION",
        inputKind: "DIGEST_BYTES"
      }
    );

    let laterFieldGetterCalls = 0;
    let laterBytesTrapCalls = 0;
    const missingDomain = omitField(record, "domain");
    Object.defineProperty(missingDomain, "digestHex", {
      configurable: true,
      enumerable: true,
      get() {
        laterFieldGetterCalls += 1;
        return record.digestHex;
      }
    });
    const hostileLaterBytes = new Proxy(new Uint8Array([1]), {
      get() {
        laterBytesTrapCalls += 1;
        throw new Error("LATER_VERIFY_BYTES_ACCESSED");
      }
    });
    expectFailure(
      verifyRawATlvIntegrity(missingDomain, hostileLaterBytes),
      {
        code: "MISSING_RECORD_FIELD",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "HASH_DOMAIN"
      }
    );
    expectFailure(
      verifyRawATlvIntegrity(
        withField(record, "payloadByteLength", Number.NaN),
        hostileLaterBytes
      ),
      {
        code: "INVALID_METADATA_LENGTH",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "BINDING_METADATA"
      }
    );
    expectFailure(
      verifyRawATlvIntegrity(
        withField(record, "digestEncoding", "hex"),
        hostileLaterBytes
      ),
      {
        code: "INVALID_DIGEST_ENCODING",
        phase: "BINDING_METADATA_VALIDATION",
        inputKind: "DIGEST_TEXT"
      }
    );
    expect(laterFieldGetterCalls).toBe(0);
    expect(laterBytesTrapCalls).toBe(0);

    const source = readFileSync(
      new URL("./canonical-runtime-hash.ts", import.meta.url),
      "utf8"
    );
    const directBody = source.slice(
      source.indexOf("const verifyDirect = ("),
      source.indexOf("export const verifyRawATlvIntegrity")
    );
    expect(directBody.indexOf("record.payloadByteLength")).toBeLessThan(
      directBody.indexOf("buildPreimage(domain, admitted.bytes)")
    );
    const futureBody = source.slice(
      source.indexOf("export const verifyFutureBindingIntegrity = (")
    );
    expect(
      futureBody.indexOf("record.bindingMetadataTlvByteLength")
    ).toBeLessThan(
      futureBody.indexOf(
        "buildBindingEnvelope(metadata.bytes, payload.bytes)"
      )
    );
    expect(futureBody.indexOf("record.payloadByteLength")).toBeLessThan(
      futureBody.indexOf(
        'buildPreimage("FUTURE_BINDING_INTEGRITY", envelope.bytes)'
      )
    );
    const recordBody = source.slice(
      source.indexOf("const admitRecord = ("),
      source.indexOf("const createDirect =")
    );
    expect(recordBody).toContain("getPrototypeOf(candidate)");
    expect(recordBody).toContain("keys = ownKeys(candidate)");
    expect(recordBody).toContain(
      "const descriptor = getOwnPropertyDescriptor(candidate, key)"
    );
    expect(recordBody).toContain('"INVALID_RECORD_TYPE"');
    const comparisonBody = source.slice(
      source.indexOf("const compareDigest = ("),
      source.indexOf("const fieldInputKind = (")
    );
    expect(comparisonBody).toContain(
      "for (let index = 0; index < 32; index += 1)"
    );
    expect(comparisonBody).toContain(
      "difference |= actual[index]! ^ expected[index]!"
    );
    expect(source).not.toMatch(
      /__test|testHook|forceFailure|injectFailure|mockHash/
    );
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
