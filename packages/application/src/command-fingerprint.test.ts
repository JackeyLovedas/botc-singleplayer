import { describe, expect, it } from "vitest";
import type { SupportedCommandEnvelope } from "@botc/domain-core";
import {
  COMMAND_CANONICALIZATION_ALGORITHM,
  COMMAND_FINGERPRINT_DIGEST_ALGORITHM,
  COMMAND_FINGERPRINT_SCHEMA_VERSION,
  captureSupportedCommand,
  commandFingerprintsRepresentSameCommand,
  createCommandFingerprintFromCanonicalJson,
  validateCommandFingerprint
} from "@botc/application";
import { createGameCommand } from "@botc/test-harness";

const capture = (value: unknown) => captureSupportedCommand(value as SupportedCommandEnvelope);

const requireCapture = (value: unknown) => {
  const result = capture(value);
  if (!result.valid) throw new Error(result.reason);
  return result.captured;
};

describe("supported command structural fingerprints", () => {
  it("uses the exact tagged canonical tree, six-key fingerprint, UTF-8 length, and SHA-256 vector", () => {
    const value = {
      ownUndefined: undefined,
      nil: null,
      b: 1,
      a: "女裁缝"
    };

    const { fingerprint } = requireCapture(value);
    const canonical = "[\"OBJECT\",[[\"a\",[\"STRING\",\"女裁缝\"]],[\"b\",[\"INTEGER\",\"1\"]],[\"nil\",[\"NULL\"]],[\"ownUndefined\",[\"UNDEFINED\"]]]]";

    expect(Object.keys(fingerprint)).toStrictEqual([
      "schemaVersion",
      "canonicalizationAlgorithm",
      "canonicalCommandJson",
      "canonicalCommandJsonUtf8ByteLength",
      "digestAlgorithm",
      "digestHex"
    ]);
    expect(fingerprint).toStrictEqual({
      schemaVersion: COMMAND_FINGERPRINT_SCHEMA_VERSION,
      canonicalizationAlgorithm: COMMAND_CANONICALIZATION_ALGORITHM,
      canonicalCommandJson: canonical,
      canonicalCommandJsonUtf8ByteLength: 111,
      digestAlgorithm: COMMAND_FINGERPRINT_DIGEST_ALGORITHM,
      digestHex: "8baf95bb080ffb729c9ae6abe58ab64370ead5943e8e27b2297519a9ce7ed542"
    });
    expect(fingerprint.canonicalCommandJsonUtf8ByteLength).toBeGreaterThan(canonical.length);
    expect(validateCommandFingerprint(fingerprint)).toBe(true);
  });

  it("sorts object keys by code unit, preserves array order, and distinguishes absent from own undefined", () => {
    const left = requireCapture({ z: [1, 2], a: { y: true, x: false } });
    const reordered = requireCapture({ a: { x: false, y: true }, z: [1, 2] });
    const reversedArray = requireCapture({ a: { x: false, y: true }, z: [2, 1] });
    const absent = requireCapture({ a: 1 });
    const ownUndefined = requireCapture({ a: 1, optional: undefined });

    expect(left.fingerprint.canonicalCommandJson).toBe(reordered.fingerprint.canonicalCommandJson);
    expect(commandFingerprintsRepresentSameCommand(left.fingerprint, reordered.fingerprint)).toBe(true);
    expect(reversedArray.fingerprint.canonicalCommandJson).not.toBe(left.fingerprint.canonicalCommandJson);
    expect(ownUndefined.fingerprint.canonicalCommandJson).not.toBe(absent.fingerprint.canonicalCommandJson);
  });

  it("captures repeated acyclic references by value and produces an immutable deep plain snapshot", () => {
    const shared = { text: "same" };
    const command = createGameCommand() as SupportedCommandEnvelope & { extra?: unknown };
    command.extra = { first: shared, second: shared, values: [1, { nested: true }] };

    const { snapshot } = requireCapture(command);
    const snapshotExtra = (snapshot as SupportedCommandEnvelope & {
      readonly extra: {
        readonly first: { readonly text: string };
        readonly second: { readonly text: string };
        readonly values: readonly [number, { readonly nested: boolean }];
      };
    }).extra;

    shared.text = "mutated";
    expect(snapshotExtra.first).toStrictEqual({ text: "same" });
    expect(snapshotExtra.second).toStrictEqual({ text: "same" });
    expect(snapshotExtra.first).not.toBe(snapshotExtra.second);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshotExtra)).toBe(true);
    expect(Object.isFrozen(snapshotExtra.values)).toBe(true);
    expect(Object.isFrozen(snapshotExtra.values[1])).toBe(true);
  });

  it.each([
    ["object accessor", () => Object.defineProperty({ gameId: "game" }, "payload", { enumerable: true, get: () => ({}) })],
    ["non-enumerable custom field", () => Object.defineProperty({ gameId: "game" }, "hidden", { value: true })],
    ["symbol key", () => Object.defineProperty({ gameId: "game" }, Symbol("hidden"), { value: true, enumerable: true })],
    ["symbol value", () => ({ gameId: "game", extra: Symbol("value") })],
    ["function", () => ({ gameId: "game", extra: () => undefined })],
    ["bigint", () => ({ gameId: "game", extra: 1n })],
    ["unsafe integer", () => ({ gameId: "game", extra: Number.MAX_SAFE_INTEGER + 1 })],
    ["non-integer", () => ({ gameId: "game", extra: 1.5 })],
    ["negative zero", () => ({ gameId: "game", extra: -0 })],
    ["non-plain object", () => ({ gameId: "game", extra: new Date(0) })],
    ["sparse array", () => ({ gameId: "game", extra: new Array(2) })],
    ["array accessor", () => {
      const array = [1];
      Object.defineProperty(array, "0", { enumerable: true, get: () => 1 });
      return { gameId: "game", extra: array };
    }],
    ["array extra key", () => {
      const array = [1] as number[] & { extra?: boolean };
      array.extra = true;
      return { gameId: "game", extra: array };
    }],
    ["nonstandard array length", () => {
      const array = [1];
      Object.defineProperty(array, "length", { writable: false });
      return { gameId: "game", extra: array };
    }],
    ["cycle", () => {
      const value: { gameId: string; self?: unknown } = { gameId: "game" };
      value.self = value;
      return value;
    }],
    ["revoked proxy", () => {
      const revocable = Proxy.revocable({ gameId: "game" }, {});
      revocable.revoke();
      return revocable.proxy;
    }]
  ])("rejects unsupported command structure: %s", (_name, makeValue) => {
    expect(capture(makeValue())).toMatchObject({ valid: false });
  });

  it("fails stored fingerprints closed for tampered content, metadata, key shape, and accessors", () => {
    const incoming = requireCapture({ a: 1 }).fingerprint;
    const other = requireCapture({ a: 2 }).fingerprint;
    const copiedDigest = { ...other, digestHex: incoming.digestHex };
    const tamperedDigest = { ...incoming, digestHex: "0".repeat(64) };
    const tamperedLength = { ...incoming, canonicalCommandJsonUtf8ByteLength: incoming.canonicalCommandJsonUtf8ByteLength + 1 };
    const wrongSchema = { ...incoming, schemaVersion: "future" };
    const extraKey = { ...incoming, extra: true };
    const nonEnumerableExtra = Object.defineProperty({ ...incoming }, "hidden", { value: true });
    const symbolExtra = Object.defineProperty({ ...incoming }, Symbol("hidden"), { value: true });
    const accessor = Object.defineProperty({ ...incoming }, "digestHex", { enumerable: true, get: () => incoming.digestHex });

    for (const invalid of [copiedDigest, tamperedDigest, tamperedLength, wrongSchema, extraKey, nonEnumerableExtra, symbolExtra, accessor]) {
      expect(validateCommandFingerprint(invalid)).toBe(false);
      expect(commandFingerprintsRepresentSameCommand(invalid, incoming)).toBe(false);
    }
    expect(commandFingerprintsRepresentSameCommand(other, incoming)).toBe(false);
  });

  it("rejects every stored fingerprint Proxy before revoked, reflection, property, or late traps can run", () => {
    const incoming = requireCapture({ a: 1 }).fingerprint;
    const revocable = Proxy.revocable(incoming, {});
    revocable.revoke();
    let canonicalReadsSinceValidationStarted = 0;
    const lateThrowingProxy = new Proxy({ ...incoming }, {
      get: (target, property, receiver) => {
        if (property === "schemaVersion") canonicalReadsSinceValidationStarted = 0;
        if (property === "canonicalCommandJson" && ++canonicalReadsSinceValidationStarted > 4) {
          throw new Error("hostile post-validation property access");
        }
        return Reflect.get(target, property, receiver) as unknown;
      }
    });
    const proxyValues: readonly unknown[] = [
      new Proxy({ ...incoming }, {}),
      revocable.proxy,
      new Proxy({}, { getPrototypeOf: () => { throw new Error("hostile prototype reflection"); } }),
      new Proxy({}, { ownKeys: () => { throw new Error("hostile own-key reflection"); } }),
      new Proxy({ ...incoming }, {
        getOwnPropertyDescriptor: () => { throw new Error("hostile descriptor reflection"); }
      }),
      new Proxy({ ...incoming }, { get: () => { throw new Error("hostile property access"); } }),
      lateThrowingProxy
    ];

    for (const proxy of proxyValues) {
      expect(() => validateCommandFingerprint(proxy)).not.toThrow();
      expect(validateCommandFingerprint(proxy)).toBe(false);
      expect(() => commandFingerprintsRepresentSameCommand(proxy, incoming)).not.toThrow();
      expect(commandFingerprintsRepresentSameCommand(proxy, incoming)).toBe(false);
    }
    expect(canonicalReadsSinceValidationStarted).toBe(0);
  });

  it("rejects a nonthrowing Proxy that swaps canonical A for canonical B on the final equality read", () => {
    const fingerprintA = requireCapture({ a: 1 }).fingerprint;
    const fingerprintB = requireCapture({ a: 2 }).fingerprint;
    let canonicalReadsSinceValidationStarted = 0;
    const swapOnFinalReadProxy = new Proxy({ ...fingerprintA }, {
      get: (target, property, receiver) => {
        if (property === "schemaVersion") canonicalReadsSinceValidationStarted = 0;
        if (property === "canonicalCommandJson") {
          canonicalReadsSinceValidationStarted += 1;
          return canonicalReadsSinceValidationStarted <= 4
            ? fingerprintA.canonicalCommandJson
            : fingerprintB.canonicalCommandJson;
        }
        return Reflect.get(target, property, receiver) as unknown;
      }
    });

    expect(fingerprintA.canonicalCommandJson).not.toBe(fingerprintB.canonicalCommandJson);
    expect(() => commandFingerprintsRepresentSameCommand(swapOnFinalReadProxy, fingerprintB)).not.toThrow();
    expect(commandFingerprintsRepresentSameCommand(swapOnFinalReadProxy, fingerprintB)).toBe(false);
    expect(validateCommandFingerprint(swapOnFinalReadProxy)).toBe(false);
    expect(canonicalReadsSinceValidationStarted).toBe(0);
  });

  it("constructs a validated fingerprint from the complete canonical string without truncation", () => {
    const canonical = "x".repeat(16_384);
    const fingerprint = createCommandFingerprintFromCanonicalJson(canonical);

    expect(fingerprint.canonicalCommandJson).toBe(canonical);
    expect(fingerprint.canonicalCommandJsonUtf8ByteLength).toBe(16_384);
    expect(fingerprint.digestHex).toMatch(/^[0-9a-f]{64}$/);
    expect(validateCommandFingerprint(fingerprint)).toBe(true);
  });
});
