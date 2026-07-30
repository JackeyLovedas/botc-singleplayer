import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  CANONICAL_RUNTIME_LIMITS,
  CANONICAL_RUNTIME_SERIALIZATION_VERSION,
  CANONICAL_RUNTIME_VALUE_VERSION,
  captureCanonicalRuntimeValue,
  isCanonicalDataValue,
  sameCanonicalDataValue,
  serializeCanonicalRuntimeValue
} from "@botc/domain-core";
import {
  readCanonicalRuntimeBackingForStructuralValidation
} from "./canonical-runtime-value.js";
import type {
  CanonicalRuntimeFailureCode,
  CanonicalRuntimeDiagnostic,
  CanonicalRuntimeResourceMetrics,
  CapturedCanonicalRuntimeValue
} from "@botc/domain-core";

const capture = (
  value: unknown
): {
  readonly token: CapturedCanonicalRuntimeValue;
  readonly metrics: CanonicalRuntimeResourceMetrics;
} => {
  const result = captureCanonicalRuntimeValue(value);
  if (!result.ok) {
    throw new Error(`capture failed: ${result.diagnostic.code}`);
  }
  return { token: result.token, metrics: result.metrics };
};

const serialize = (token: unknown): Uint8Array => {
  const result = serializeCanonicalRuntimeValue(token);
  if (!result.ok) {
    throw new Error(`serialization failed: ${result.diagnostic.code}`);
  }
  return result.bytes;
};

const bytesOf = (value: unknown): Uint8Array => serialize(capture(value).token);

const hex = (bytes: Uint8Array): string =>
  [...bytes].map((byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ");

const failure = (
  value: unknown,
  code: CanonicalRuntimeFailureCode
): CanonicalRuntimeDiagnostic => {
  const result = captureCanonicalRuntimeValue(value);
  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error("expected capture failure");
  }
  expect(result.diagnostic.code).toBe(code);
  return result.diagnostic;
};

const invalidToken = (value: unknown): CanonicalRuntimeDiagnostic => {
  const result = serializeCanonicalRuntimeValue(value);
  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error("expected token failure");
  }
  expect(result.diagnostic.code).toBe("INVALID_CAPTURE_TOKEN");
  return result.diagnostic;
};

const trapNames = [
  "getPrototypeOf",
  "setPrototypeOf",
  "isExtensible",
  "preventExtensions",
  "getOwnPropertyDescriptor",
  "defineProperty",
  "has",
  "get",
  "set",
  "deleteProperty",
  "ownKeys"
] as const;

type TrapName = (typeof trapNames)[number];
type TrapCounts = Record<TrapName, number>;

const proxyHarness = <T extends object>(): {
  readonly counts: TrapCounts;
  readonly handler: ProxyHandler<T>;
} => {
  const counts = Object.fromEntries(trapNames.map((name) => [name, 0])) as TrapCounts;
  const hit = (name: TrapName): void => {
    counts[name] += 1;
  };
  return {
    counts,
    handler: {
      getPrototypeOf: (target) => {
        hit("getPrototypeOf");
        return Reflect.getPrototypeOf(target);
      },
      setPrototypeOf: (target, prototype) => {
        hit("setPrototypeOf");
        return Reflect.setPrototypeOf(target, prototype);
      },
      isExtensible: (target) => {
        hit("isExtensible");
        return Reflect.isExtensible(target);
      },
      preventExtensions: (target) => {
        hit("preventExtensions");
        return Reflect.preventExtensions(target);
      },
      getOwnPropertyDescriptor: (target, property) => {
        hit("getOwnPropertyDescriptor");
        return Reflect.getOwnPropertyDescriptor(target, property);
      },
      defineProperty: (target, property, attributes) => {
        hit("defineProperty");
        return Reflect.defineProperty(target, property, attributes);
      },
      has: (target, property) => {
        hit("has");
        return Reflect.has(target, property);
      },
      get: (target, property, receiver) => {
        hit("get");
        return Reflect.get(target, property, receiver) as unknown;
      },
      set: (target, property, value, receiver) => {
        hit("set");
        return Reflect.set(target, property, value, receiver);
      },
      deleteProperty: (target, property) => {
        hit("deleteProperty");
        return Reflect.deleteProperty(target, property);
      },
      ownKeys: (target) => {
        hit("ownKeys");
        return Reflect.ownKeys(target);
      }
    }
  };
};

const expectZeroTraps = (counts: TrapCounts): void => {
  expect(counts).toStrictEqual(Object.fromEntries(trapNames.map((name) => [name, 0])));
};

const nestedArrays = (depth: number, leaf: unknown = null): unknown => {
  let value = leaf;
  for (let index = 0; index < depth; index += 1) {
    value = [value];
  }
  return value;
};

const nodeBoundaryValue = (oneOver: boolean): readonly unknown[] =>
  Array.from({ length: 9_999 }, (_unused, index) =>
    Array.from(
      { length: index === 9_998 ? (oneOver ? 19 : 18) : 9 },
      () => null
    )
  );

const objectWithKeys = (count: number): Record<string, null> => {
  const value: Record<string, null> = Object.create(null) as Record<string, null>;
  for (let index = 0; index < count; index += 1) {
    value[`k${index.toString().padStart(5, "0")}`] = null;
  }
  return value;
};

const serializedBoundaryValue = (oneOver: boolean): readonly string[] => {
  const full = "a".repeat(CANONICAL_RUNTIME_LIMITS.maxStringUtf8Bytes);
  const remainder = "a".repeat(1_048_481 + (oneOver ? 1 : 0));
  return [...Array.from({ length: 15 }, () => full), remainder];
};

describe("canonical runtime capture and TLV foundation", () => {
  it("A-C01 captures null and reports exact version and metrics", () => {
    const result = captureCanonicalRuntimeValue(null);
    expect(result).toMatchObject({
      ok: true,
      valueVersion: CANONICAL_RUNTIME_VALUE_VERSION,
      metrics: {
        nodesVisited: 1,
        maximumDepthVisited: 0,
        serializedBytes: 11
      }
    });
  });

  it("A-C01 captures both booleans as detached tokens", () => {
    expect(hex(bytesOf(false))).toBe("42 4F 54 43 43 52 56 2B 30 31 01");
    expect(hex(bytesOf(true))).toBe("42 4F 54 43 43 52 56 2B 30 31 02");
    expect(capture(false).token).not.toBe(capture(false).token);
  });

  it("A-C01 captures safe integers excluding negative zero", () => {
    for (const value of [Number.MIN_SAFE_INTEGER, -1, 0, 1, Number.MAX_SAFE_INTEGER]) {
      expect(captureCanonicalRuntimeValue(value).ok).toBe(true);
    }
    failure(-0, "INVALID_NUMBER");
  });

  it("A-C01 captures well-formed empty and non-empty strings", () => {
    expect(hex(bytesOf(""))).toBe("42 4F 54 43 43 52 56 2B 30 31 04 00 00 00 00");
    expect(captureCanonicalRuntimeValue("血染钟楼").ok).toBe(true);
  });

  it("A-C01 captures dense arrays and plain records", () => {
    const result = captureCanonicalRuntimeValue({
      values: [null, true, 7, "text"],
      nested: { empty: [] }
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.metrics.nodesVisited).toBe(8);
      expect(result.metrics.maximumDepthVisited).toBe(2);
    }
  });

  it("A-C01 erases Object-prototype versus null-prototype record identity", () => {
    const ordinary = { a: null, b: [true] };
    const nullPrototype = Object.create(null) as Record<string, unknown>;
    nullPrototype.b = [true];
    nullPrototype.a = null;
    expect(bytesOf(nullPrototype)).toStrictEqual(bytesOf(ordinary));
    const specialKeys = Object.create(null) as Record<string, unknown>;
    Object.defineProperty(specialKeys, "__proto__", {
      enumerable: true,
      value: null
    });
    Object.defineProperty(specialKeys, "", {
      enumerable: true,
      value: true
    });
    expect(captureCanonicalRuntimeValue(specialKeys).ok).toBe(true);
  });

  it("A-C02 rejects an ordinary transparent Proxy with zero installed traps", () => {
    const harness = proxyHarness<Record<string, unknown>>();
    failure(new Proxy({ a: 1 }, harness.handler), "PROXY_OR_DESCRIPTOR_FAILURE");
    expectZeroTraps(harness.counts);
  });

  it("A-C02 rejects a revoked Proxy with zero installed traps", () => {
    const harness = proxyHarness<Record<string, unknown>>();
    const revocable = Proxy.revocable({ a: 1 }, harness.handler);
    revocable.revoke();
    failure(revocable.proxy, "PROXY_OR_DESCRIPTOR_FAILURE");
    expectZeroTraps(harness.counts);
  });

  it("A-C02 rejects nested and array-wrapped Proxies with zero installed traps", () => {
    const objectHarness = proxyHarness<Record<string, unknown>>();
    const arrayHarness = proxyHarness<unknown[]>();
    failure({ nested: new Proxy({}, objectHarness.handler) }, "PROXY_OR_DESCRIPTOR_FAILURE");
    failure([new Proxy([], arrayHarness.handler)], "PROXY_OR_DESCRIPTOR_FAILURE");
    expectZeroTraps(objectHarness.counts);
    expectZeroTraps(arrayHarness.counts);
  });

  it("A-C02 converts throwing Proxy descriptor operations to fixed failure", () => {
    const harness = proxyHarness<Record<string, unknown>>();
    const proxy = new Proxy({ a: 1 }, {
      ...harness.handler,
      getOwnPropertyDescriptor: () => {
        harness.counts.getOwnPropertyDescriptor += 1;
        throw new Error("must not execute");
      }
    });
    const result = failure(proxy, "PROXY_OR_DESCRIPTOR_FAILURE");
    expect(result).toStrictEqual({
      code: "PROXY_OR_DESCRIPTOR_FAILURE",
      phase: "CAPTURE",
      path: [],
      limitSummary: { kind: "NOT_APPLICABLE" },
      quarantineRecommended: true
    });
    expectZeroTraps(harness.counts);
  });

  it("A-C02 rejects getter and setter descriptors with zero invocations", () => {
    let getterCalls = 0;
    let setterCalls = 0;
    const getter = Object.defineProperty({}, "a", {
      enumerable: true,
      get: () => {
        getterCalls += 1;
        return 1;
      }
    });
    const setter = Object.defineProperty({}, "a", {
      enumerable: true,
      set: () => {
        setterCalls += 1;
      }
    });
    failure(getter, "ACCESSOR_PROPERTY");
    failure(setter, "ACCESSOR_PROPERTY");
    failure(Object.defineProperty({}, "hidden", { value: true }), "NON_ENUMERABLE_PROPERTY");
    expect({ getterCalls, setterCalls }).toStrictEqual({ getterCalls: 0, setterCalls: 0 });
  });

  it("A-C02 rejects symbol keys without reading sibling values", () => {
    let getterCalls = 0;
    const value = Object.defineProperty({}, "a", {
      enumerable: true,
      get: () => {
        getterCalls += 1;
        return 1;
      }
    });
    Object.defineProperty(value, Symbol("hidden"), { enumerable: true, value: 1 });
    failure(value, "SYMBOL_KEY");
    expect(getterCalls).toBe(0);
  });

  it("A-C03 rejects undefined at root, record value, and array element", () => {
    failure(undefined, "UNSUPPORTED_TYPE");
    failure({ value: undefined }, "UNSUPPORTED_TYPE");
    failure([undefined], "UNSUPPORTED_TYPE");
  });

  it("A-C03 classifies invalid and unsafe numbers exactly", () => {
    for (const value of [1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, -0]) {
      failure(value, "INVALID_NUMBER");
    }
    for (const value of [Number.MAX_SAFE_INTEGER + 1, Number.MIN_SAFE_INTEGER - 1]) {
      failure(value, "UNSAFE_INTEGER");
    }
  });

  it("A-C03 rejects bigint, symbol value, and function", () => {
    failure(1n, "UNSUPPORTED_TYPE");
    failure(Symbol("value"), "SYMBOL_VALUE");
    failure(() => undefined, "UNSUPPORTED_TYPE");
  });

  it("A-C03 rejects class instances and boxed primitives", () => {
    class Example {
      readonly value = 1;
    }
    for (const value of [new Example(), new Boolean(true), new Number(1), new String("x")]) {
      failure(value, "NONPLAIN_OBJECT");
    }
  });

  it("A-C03 rejects exotic built-ins, buffers, views, typed arrays, and Promise", () => {
    const buffer = new ArrayBuffer(8);
    const values: unknown[] = [
      new Map(),
      new Set(),
      new Date(0),
      /x/,
      new Error("failure"),
      buffer,
      new DataView(buffer),
      new Uint8Array(buffer),
      Promise.resolve()
    ];
    if (typeof SharedArrayBuffer !== "undefined") {
      values.push(new SharedArrayBuffer(8));
    }
    for (const value of values) {
      failure(value, "NONPLAIN_OBJECT");
    }
  });

  it("A-C03 rejects direct and nested cycles", () => {
    const direct: { self?: unknown } = {};
    direct.self = direct;
    const nested: { child: { parent?: unknown } } = { child: {} };
    nested.child.parent = nested;
    failure(direct, "CYCLE");
    failure(nested, "CYCLE");
  });

  it("A-C04 rejects primitive and null token candidates", () => {
    for (const value of [
      null,
      undefined,
      false,
      0,
      "",
      1n,
      Symbol("token"),
      new Uint8Array()
    ]) {
      const result = invalidToken(value);
      expect(result.phase).toBe("TOKEN_AUTHENTICATION");
    }
  });

  it("A-C04 rejects Proxy and revoked-Proxy token candidates with zero traps", () => {
    const token = capture({ value: true }).token;
    const harness = proxyHarness<object>();
    const proxy = new Proxy(token, harness.handler);
    invalidToken(proxy);
    expectZeroTraps(harness.counts);
    const revokedHarness = proxyHarness<Record<string, unknown>>();
    const revocable = Proxy.revocable({}, revokedHarness.handler);
    revocable.revoke();
    invalidToken(revocable.proxy);
    expectZeroTraps(revokedHarness.counts);
  });

  it("A-C04 rejects spread, JSON, structured clone, and shaped lookalikes", () => {
    const token = capture({ a: 1 }).token;
    const candidates = [
      { ...token },
      Object.assign({}, token),
      JSON.parse(JSON.stringify(token)) as unknown,
      structuredClone(token),
      Object.freeze(Object.create(null) as object)
    ];
    for (const candidate of candidates) {
      invalidToken(candidate);
      expect(readCanonicalRuntimeBackingForStructuralValidation(candidate)).toMatchObject({
        ok: false,
        diagnostic: { code: "INVALID_CAPTURE_TOKEN", phase: "INTERNAL_READ" }
      });
    }
  });

  it("A-C04 rejects a token identity from a distinct module instance", async () => {
    const first = await import("./canonical-runtime-value.js");
    const firstResult = first.captureCanonicalRuntimeValue({ a: 1 });
    expect(firstResult.ok).toBe(true);
    if (!firstResult.ok) {
      throw new Error("first capture failed");
    }
    vi.resetModules();
    const second = await import("./canonical-runtime-value.js");
    expect(second.serializeCanonicalRuntimeValue(firstResult.token)).toMatchObject({
      ok: false,
      diagnostic: { code: "INVALID_CAPTURE_TOKEN" }
    });
  });

  it("A-C05 source mutation after capture does not change later bytes", () => {
    const source = { nested: { value: 1 }, values: [true, false] };
    const token = capture(source).token;
    const before = serialize(token);
    source.nested.value = 2;
    source.values.reverse();
    expect(serialize(token)).toStrictEqual(before);
  });

  it("A-C05 repeated acyclic aliases detach independently and count per occurrence", () => {
    const shared = { text: "same" };
    const result = capture({ first: shared, second: shared });
    expect(result.metrics.nodesVisited).toBe(5);
    const backing = readCanonicalRuntimeBackingForStructuralValidation(result.token);
    expect(backing.ok).toBe(true);
    if (backing.ok && backing.value.kind === "OBJECT") {
      expect(backing.value.entries[0]!.value).not.toBe(backing.value.entries[1]!.value);
    }
  });

  it("A-C05 token is null-prototype, zero-key, frozen and maps to deep-frozen backing", () => {
    const token = capture({ nested: [1] }).token;
    expect(Reflect.getPrototypeOf(token)).toBeNull();
    expect(Reflect.ownKeys(token)).toStrictEqual([]);
    expect(Object.isFrozen(token)).toBe(true);
    const backing = readCanonicalRuntimeBackingForStructuralValidation(token);
    expect(backing.ok).toBe(true);
    if (backing.ok && backing.value.kind === "OBJECT") {
      expect(Object.isFrozen(backing.value)).toBe(true);
      expect(Object.isFrozen(backing.value.entries)).toBe(true);
      expect(Object.isFrozen(backing.value.entries[0])).toBe(true);
      expect(Object.isFrozen(backing.value.entries[0]!.value)).toBe(true);
    }
  });

  it("A-C06 repeated serialization returns equal bytes in distinct Uint8Array objects", () => {
    const token = capture({ a: [1, true] }).token;
    const firstResult = serializeCanonicalRuntimeValue(token);
    const secondResult = serializeCanonicalRuntimeValue(token);
    expect(firstResult).toMatchObject({
      ok: true,
      byteLength: 35,
      valueVersion: CANONICAL_RUNTIME_VALUE_VERSION,
      serializationVersion: CANONICAL_RUNTIME_SERIALIZATION_VERSION
    });
    expect(secondResult.ok).toBe(true);
    if (!firstResult.ok || !secondResult.ok) {
      throw new Error("serialization failed");
    }
    const first = firstResult.bytes;
    const second = secondResult.bytes;
    expect(first).toStrictEqual(second);
    expect(first).not.toBe(second);
    expect(first).toBeInstanceOf(Uint8Array);
    expect(first.buffer).not.toBe(second.buffer);
  });

  it("A-C06 mutation of one returned byte array cannot affect later output", () => {
    const token = capture("immutable").token;
    const original = serialize(token);
    const expected = original.slice();
    original.fill(0);
    expect(serialize(token)).toStrictEqual(expected);
  });

  it("A-C07 depth exact limit succeeds and first one-over fails", () => {
    expect(captureCanonicalRuntimeValue(nestedArrays(CANONICAL_RUNTIME_LIMITS.maxDepth)).ok).toBe(true);
    const result = failure(
      nestedArrays(CANONICAL_RUNTIME_LIMITS.maxDepth + 1),
      "RESOURCE_DEPTH_EXCEEDED"
    );
    expect(result.limitSummary).toStrictEqual({
      kind: "LIMIT",
      resource: "DEPTH",
      limit: 128,
      observed: 129
    });
  });

  it("A-C07 node exact limit succeeds and first one-over fails", () => {
    const exact = captureCanonicalRuntimeValue(nodeBoundaryValue(false));
    expect(exact.ok).toBe(true);
    if (exact.ok) {
      expect(exact.metrics.nodesVisited).toBe(CANONICAL_RUNTIME_LIMITS.maxNodes);
    }
    const result = failure(nodeBoundaryValue(true), "RESOURCE_NODE_LIMIT_EXCEEDED");
    expect(result.limitSummary).toStrictEqual({
      kind: "LIMIT",
      resource: "NODE_COUNT",
      limit: 100_000,
      observed: 100_001
    });
  });

  it("A-C07 array-length exact limit succeeds and first one-over fails", () => {
    expect(captureCanonicalRuntimeValue(
      Array(CANONICAL_RUNTIME_LIMITS.maxArrayLength).fill(null)
    ).ok).toBe(true);
    failure(
      Array(CANONICAL_RUNTIME_LIMITS.maxArrayLength + 1).fill(null),
      "RESOURCE_ARRAY_LIMIT_EXCEEDED"
    );
  });

  it("A-C07 object-key exact limit succeeds and first one-over fails", () => {
    expect(captureCanonicalRuntimeValue(
      objectWithKeys(CANONICAL_RUNTIME_LIMITS.maxObjectKeys)
    ).ok).toBe(true);
    failure(
      objectWithKeys(CANONICAL_RUNTIME_LIMITS.maxObjectKeys + 1),
      "RESOURCE_OBJECT_KEY_LIMIT_EXCEEDED"
    );
  });

  it("A-C07 string UTF-8 byte exact limit succeeds and first one-over fails", () => {
    const exact = "é".repeat(CANONICAL_RUNTIME_LIMITS.maxStringUtf8Bytes / 2);
    expect(captureCanonicalRuntimeValue(exact).ok).toBe(true);
    failure(`${exact}a`, "RESOURCE_STRING_LIMIT_EXCEEDED");
  });

  it("A-C07 object-key UTF-8 byte exact limit succeeds and first one-over fails", () => {
    const exact = "a".repeat(CANONICAL_RUNTIME_LIMITS.maxObjectKeyUtf8Bytes);
    expect(captureCanonicalRuntimeValue({ [exact]: null }).ok).toBe(true);
    failure({ [`${exact}a`]: null }, "RESOURCE_KEY_LIMIT_EXCEEDED");
  });

  it("A-C07 total serialized-byte exact limit succeeds and first one-over fails", () => {
    const exact = captureCanonicalRuntimeValue(serializedBoundaryValue(false));
    expect(exact.ok).toBe(true);
    if (exact.ok) {
      expect(exact.metrics.serializedBytes).toBe(
        CANONICAL_RUNTIME_LIMITS.maxSerializedBytes
      );
    }
    failure(
      serializedBoundaryValue(true),
      "RESOURCE_SERIALIZED_BYTE_LIMIT_EXCEEDED"
    );
  });

  it("A-C08 emits the exact ten-byte ASCII BOTCCRV+01 header once", () => {
    const bytes = bytesOf(null);
    expect([...bytes.slice(0, 10)]).toStrictEqual([
      0x42, 0x4f, 0x54, 0x43, 0x43, 0x52, 0x56, 0x2b, 0x30, 0x31
    ]);
    expect(bytes.length).toBe(11);
  });

  it("A-C08 emits exact null and boolean tags", () => {
    expect(bytesOf(null)[10]).toBe(0x00);
    expect(bytesOf(false)[10]).toBe(0x01);
    expect(bytesOf(true)[10]).toBe(0x02);
  });

  it("A-C08 emits exact string, array, and object u32be lengths and counts", () => {
    expect(hex(bytesOf("A"))).toBe(
      "42 4F 54 43 43 52 56 2B 30 31 04 00 00 00 01 41"
    );
    expect(hex(bytesOf([null, true]))).toBe(
      "42 4F 54 43 43 52 56 2B 30 31 05 00 00 00 02 00 02"
    );
    expect(hex(bytesOf({ a: null }))).toBe(
      "42 4F 54 43 43 52 56 2B 30 31 06 00 00 00 01 00 00 00 01 61 00"
    );
  });

  it("A-C08 emits nested child nodes without repeated headers", () => {
    const bytes = bytesOf([[null], { a: true }]);
    const header = "42 4F 54 43 43 52 56 2B 30 31";
    expect(hex(bytes).split(header).length - 1).toBe(1);
    expect(hex(bytes)).toBe(
      "42 4F 54 43 43 52 56 2B 30 31 05 00 00 00 02 " +
      "05 00 00 00 01 00 06 00 00 00 01 00 00 00 01 61 02"
    );
  });

  it("A-C09 emits exact UTF-8 for valid supplementary-plane pairs", () => {
    expect(hex(bytesOf("😀"))).toBe(
      "42 4F 54 43 43 52 56 2B 30 31 04 00 00 00 04 F0 9F 98 80"
    );
    failure("\ud800", "INVALID_UNICODE");
    failure("\udc00", "INVALID_UNICODE");
    failure({ ["\ud800"]: null }, "INVALID_UNICODE");
  });

  it("A-C09 preserves distinct CR, LF, and CRLF byte vectors", () => {
    const cr = bytesOf("\r");
    const lf = bytesOf("\n");
    const crlf = bytesOf("\r\n");
    expect(cr).not.toStrictEqual(lf);
    expect(crlf).not.toStrictEqual(cr);
    expect(hex(crlf).endsWith("0D 0A")).toBe(true);
  });

  it("A-C09 preserves distinct composed and decomposed Unicode vectors", () => {
    const composed = bytesOf("\u00e9");
    const decomposed = bytesOf("e\u0301");
    expect(composed).not.toStrictEqual(decomposed);
    expect(hex(composed).endsWith("C3 A9")).toBe(true);
    expect(hex(decomposed).endsWith("65 CC 81")).toBe(true);
  });

  it("A-C10 emits exact i64be bytes for boundary safe integers", () => {
    const payload = (value: number): string => hex(bytesOf(value).slice(10));
    expect(payload(0)).toBe("03 00 00 00 00 00 00 00 00");
    expect(payload(1)).toBe("03 00 00 00 00 00 00 00 01");
    expect(payload(-1)).toBe("03 FF FF FF FF FF FF FF FF");
    expect(payload(Number.MAX_SAFE_INTEGER)).toBe("03 00 1F FF FF FF FF FF FF");
    expect(payload(Number.MIN_SAFE_INTEGER)).toBe("03 FF E0 00 00 00 00 00 01");
  });

  it("A-C11 record insertion permutations emit identical sorted bytes", () => {
    expect(bytesOf({ z: null, a: true, m: 1 })).toStrictEqual(
      bytesOf({ m: 1, z: null, a: true })
    );
  });

  it("A-C11 numeric-looking keys use raw UTF-16 lexical order", () => {
    const bytes = hex(bytesOf({ "10": null, "2": null, "1": null }));
    const one = bytes.indexOf("00 00 00 01 31 00");
    const ten = bytes.indexOf("00 00 00 02 31 30 00");
    const two = bytes.indexOf("00 00 00 01 32 00");
    expect(one).toBeLessThan(ten);
    expect(ten).toBeLessThan(two);
  });

  it("A-C11 supplementary and prefix keys use exact UTF-16 code-unit order", () => {
    const value = Object.create(null) as Record<string, unknown>;
    value["😀"] = 3;
    value.a = 1;
    value.aa = 2;
    const backing = readCanonicalRuntimeBackingForStructuralValidation(capture(value).token);
    expect(backing.ok).toBe(true);
    if (backing.ok && backing.value.kind === "OBJECT") {
      expect(backing.value.entries.map((entry) => entry.key)).toStrictEqual([
        "a",
        "aa",
        "😀"
      ]);
    }
  });

  it("A-C12 dense array order is preserved and permutations differ", () => {
    expect(bytesOf([1, 2])).not.toStrictEqual(bytesOf([2, 1]));
    expect(bytesOf([1, 2])).toStrictEqual(bytesOf([1, 2]));
  });

  it("A-C12 sparse, keyed, out-of-range, and invalid-length arrays fail exactly", () => {
    failure(new Array(2), "SPARSE_ARRAY");
    const keyed = [1] as number[] & { extra?: boolean };
    keyed.extra = true;
    failure(keyed, "KEYED_ARRAY");
    const outOfRange = [1] as number[] & Record<string, unknown>;
    Object.defineProperty(outOfRange, "2", { enumerable: true, value: 2 });
    failure(outOfRange, "SPARSE_ARRAY");
    const invalidLength = [1];
    Object.defineProperty(invalidLength, "length", { writable: false });
    failure(invalidLength, "INVALID_ARRAY_LENGTH_DESCRIPTOR");
    const nonstandardPrototype = [1];
    Object.setPrototypeOf(nonstandardPrototype, null);
    failure(nonstandardPrototype, "NONPLAIN_OBJECT");
    const accessor = [1];
    Object.defineProperty(accessor, "0", { enumerable: true, get: () => 1 });
    failure(accessor, "ACCESSOR_PROPERTY");
  });

  it("A-C13 representative failures expose stable bounded diagnostics", () => {
    const symbol = failure({ nested: [Symbol("secret")] }, "SYMBOL_VALUE");
    expect(symbol).toStrictEqual({
      code: "SYMBOL_VALUE",
      phase: "CAPTURE",
      path: [
        { kind: "OBJECT_KEY_ORDINAL", ordinal: 0 },
        { kind: "ARRAY_INDEX", index: 0 }
      ],
      limitSummary: { kind: "NOT_APPLICABLE" },
      quarantineRecommended: true
    });
    const unsupported = failure(undefined, "UNSUPPORTED_TYPE");
    expect(unsupported.quarantineRecommended).toBe(false);
    expect(JSON.stringify(symbol)).not.toContain("secret");
  });

  it("A-C13 diagnostic truncation retains 31 segments and one TRUNCATED segment", () => {
    const result = failure(nestedArrays(40, Symbol("hidden")), "SYMBOL_VALUE");
    expect(result.path).toHaveLength(32);
    expect(result.path.slice(0, 31).every((segment) => segment.kind === "ARRAY_INDEX")).toBe(true);
    expect(result.path[31]).toStrictEqual({ kind: "TRUNCATED" });
    expect(JSON.stringify(result)).not.toContain("hidden");
  });

  it("A-C14 new API and versions remain distinct while legacy behavior is unchanged", () => {
    expect(CANONICAL_RUNTIME_VALUE_VERSION).toBe("botc-canonical-runtime-value-v1");
    expect(CANONICAL_RUNTIME_SERIALIZATION_VERSION).toBe(
      "botc-canonical-runtime-tlv-be-v1"
    );
    expect(CANONICAL_RUNTIME_VALUE_VERSION).not.toBe(
      CANONICAL_RUNTIME_SERIALIZATION_VERSION
    );
    expect(isCanonicalDataValue({ a: 1 })).toBe(true);
    expect(sameCanonicalDataValue({ b: 2, a: 1 }, { a: 1, b: 2 })).toBe(true);
  });

  it("A-C15 frozen literal vectors are locale-independent and ready for later host evidence", () => {
    const before = bytesOf({ "10": "é", "2": "e\u0301", "😀": -1 });
    const previous = process.env.LANG;
    process.env.LANG = "tr_TR.UTF-8";
    try {
      expect(bytesOf({ "😀": -1, "2": "e\u0301", "10": "é" })).toStrictEqual(before);
    } finally {
      if (previous === undefined) {
        delete process.env.LANG;
      } else {
        process.env.LANG = previous;
      }
    }
    const source = readFileSync(
      new URL("./canonical-runtime-value.ts", import.meta.url),
      "utf8"
    );
    expect(source).not.toContain("localeCompare");
    expect(source).not.toContain("Intl.Collator");
    expect(source).not.toContain("normalize(");
  });
});
