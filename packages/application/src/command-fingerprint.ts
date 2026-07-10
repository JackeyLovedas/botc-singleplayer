import { createHash } from "node:crypto";
import { Buffer } from "node:buffer";
import type { SupportedCommandEnvelope } from "@botc/domain-core";

export const COMMAND_FINGERPRINT_SCHEMA_VERSION =
  "supported-command-structural-fingerprint-v1" as const;
export const COMMAND_CANONICALIZATION_ALGORITHM =
  "plain-data-tagged-tree-code-unit-keys-v1" as const;
export const COMMAND_FINGERPRINT_DIGEST_ALGORITHM = "SHA-256" as const;
export const COMMAND_FINGERPRINT_DIGEST_HEX_LENGTH = 64 as const;

export type CommandFingerprint = {
  readonly schemaVersion: typeof COMMAND_FINGERPRINT_SCHEMA_VERSION;
  readonly canonicalizationAlgorithm: typeof COMMAND_CANONICALIZATION_ALGORITHM;
  readonly canonicalCommandJson: string;
  readonly canonicalCommandJsonUtf8ByteLength: number;
  readonly digestAlgorithm: typeof COMMAND_FINGERPRINT_DIGEST_ALGORITHM;
  readonly digestHex: string;
};

type TaggedNode =
  | readonly ["NULL"]
  | readonly ["UNDEFINED"]
  | readonly ["BOOLEAN", boolean]
  | readonly ["STRING", string]
  | readonly ["INTEGER", string]
  | readonly ["ARRAY", readonly TaggedNode[]]
  | readonly ["OBJECT", readonly (readonly [string, TaggedNode])[]];

export type CapturedCommand = {
  readonly snapshot: SupportedCommandEnvelope;
  readonly fingerprint: CommandFingerprint;
};

export type CaptureCommandResult =
  | { readonly valid: true; readonly captured: CapturedCommand }
  | { readonly valid: false; readonly reason: string };

const FINGERPRINT_KEYS = [
  "canonicalCommandJson",
  "canonicalCommandJsonUtf8ByteLength",
  "canonicalizationAlgorithm",
  "digestAlgorithm",
  "digestHex",
  "schemaVersion"
] as const;

const compareCodeUnits = (left: string, right: string): number =>
  left === right ? 0 : left < right ? -1 : 1;

const sha256Utf8 = (value: string): string =>
  createHash("sha256").update(value, "utf8").digest("hex");

const isPlainObject = (value: object): boolean => {
  const prototype = Object.getPrototypeOf(value) as unknown;
  return prototype === Object.prototype || prototype === null;
};

const hasExactOwnEnumerableDataKeys = (value: object, expected: readonly string[]): boolean => {
  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.some((key) => typeof key === "symbol")) return false;
  const actual = (ownKeys as string[]).sort(compareCodeUnits);
  const sortedExpected = [...expected].sort(compareCodeUnits);
  if (actual.length !== sortedExpected.length || !actual.every((key, index) => key === sortedExpected[index])) {
    return false;
  }
  const descriptors = Object.getOwnPropertyDescriptors(value);
  return actual.every((key) => {
    const descriptor = descriptors[key];
    return descriptor !== undefined && "value" in descriptor && descriptor.enumerable;
  });
};

const captureNode = (
  value: unknown,
  ancestors: Set<object>
): { readonly snapshot: unknown; readonly node: TaggedNode } => {
  if (value === null) return { snapshot: null, node: ["NULL"] };
  if (value === undefined) return { snapshot: undefined, node: ["UNDEFINED"] };
  if (typeof value === "boolean") return { snapshot: value, node: ["BOOLEAN", value] };
  if (typeof value === "string") return { snapshot: value, node: ["STRING", value] };
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value) || Object.is(value, -0)) {
      throw new Error("Command numbers must be safe integers other than negative zero");
    }
    return { snapshot: value, node: ["INTEGER", String(value)] };
  }
  if (typeof value !== "object") {
    throw new Error("Command values must be plain data");
  }
  if (ancestors.has(value)) throw new Error("Command object graph must not contain cycles");
  ancestors.add(value);
  try {
    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.some((key) => typeof key === "symbol")) {
      throw new Error("Command objects and arrays must not contain symbol keys");
    }
    const descriptors = Object.getOwnPropertyDescriptors(value);
    if (Array.isArray(value)) {
      const lengthDescriptor = descriptors.length;
      if (lengthDescriptor === undefined || !("value" in lengthDescriptor) || lengthDescriptor.enumerable ||
          lengthDescriptor.configurable || !lengthDescriptor.writable || lengthDescriptor.value !== value.length) {
        throw new Error("Command arrays must use a standard length property");
      }
      const expectedKeys = Array.from({ length: value.length }, (_, index) => String(index));
      const stringKeys = ownKeys.filter((key): key is string => typeof key === "string" && key !== "length");
      if (stringKeys.length !== expectedKeys.length || stringKeys.some((key, index) => key !== expectedKeys[index])) {
        throw new Error("Command arrays must be dense and contain no extra keys");
      }
      const snapshots: unknown[] = [];
      const nodes: TaggedNode[] = [];
      for (const key of expectedKeys) {
        const descriptor = descriptors[key];
        if (descriptor === undefined || !("value" in descriptor) || !descriptor.enumerable) {
          throw new Error("Command array elements must be enumerable data properties");
        }
        const child = captureNode(descriptor.value, ancestors);
        snapshots.push(child.snapshot);
        nodes.push(child.node);
      }
      return { snapshot: Object.freeze(snapshots), node: ["ARRAY", nodes] };
    }
    if (!isPlainObject(value)) throw new Error("Command objects must have Object.prototype or null prototype");
    const stringKeys = ownKeys as string[];
    const sortedKeys = [...stringKeys].sort(compareCodeUnits);
    const snapshot: Record<string, unknown> = {};
    const entries: Array<readonly [string, TaggedNode]> = [];
    for (const key of sortedKeys) {
      const descriptor = descriptors[key];
      if (descriptor === undefined || !("value" in descriptor) || !descriptor.enumerable) {
        throw new Error("Command object fields must be enumerable data properties");
      }
      const child = captureNode(descriptor.value, ancestors);
      Object.defineProperty(snapshot, key, {
        value: child.snapshot,
        enumerable: true,
        configurable: false,
        writable: false
      });
      entries.push([key, child.node]);
    }
    return { snapshot: Object.freeze(snapshot), node: ["OBJECT", entries] };
  } finally {
    ancestors.delete(value);
  }
};

export const createCommandFingerprintFromCanonicalJson = (
  canonicalCommandJson: string
): CommandFingerprint => {
  const canonicalCommandJsonUtf8ByteLength = Buffer.byteLength(canonicalCommandJson, "utf8");
  if (!Number.isSafeInteger(canonicalCommandJsonUtf8ByteLength) || canonicalCommandJsonUtf8ByteLength <= 0) {
    throw new Error("Canonical command JSON must have a positive safe UTF-8 byte length");
  }
  return {
    schemaVersion: COMMAND_FINGERPRINT_SCHEMA_VERSION,
    canonicalizationAlgorithm: COMMAND_CANONICALIZATION_ALGORITHM,
    canonicalCommandJson,
    canonicalCommandJsonUtf8ByteLength,
    digestAlgorithm: COMMAND_FINGERPRINT_DIGEST_ALGORITHM,
    digestHex: sha256Utf8(canonicalCommandJson)
  };
};

export const captureSupportedCommand = (command: SupportedCommandEnvelope): CaptureCommandResult => {
  try {
    const captured = captureNode(command, new Set<object>());
    const canonicalCommandJson = JSON.stringify(captured.node);
    return {
      valid: true,
      captured: {
        snapshot: captured.snapshot as SupportedCommandEnvelope,
        fingerprint: createCommandFingerprintFromCanonicalJson(canonicalCommandJson)
      }
    };
  } catch (error: unknown) {
    return { valid: false, reason: error instanceof Error ? error.message : "Command snapshot failed" };
  }
};

export const validateCommandFingerprint = (value: unknown): value is CommandFingerprint => {
  if (value === null || typeof value !== "object" || Array.isArray(value) || !isPlainObject(value) ||
      !hasExactOwnEnumerableDataKeys(value, FINGERPRINT_KEYS)) return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.schemaVersion !== COMMAND_FINGERPRINT_SCHEMA_VERSION ||
      candidate.canonicalizationAlgorithm !== COMMAND_CANONICALIZATION_ALGORITHM ||
      candidate.digestAlgorithm !== COMMAND_FINGERPRINT_DIGEST_ALGORITHM ||
      typeof candidate.canonicalCommandJson !== "string" || candidate.canonicalCommandJson.length === 0 ||
      !Number.isSafeInteger(candidate.canonicalCommandJsonUtf8ByteLength) ||
      (candidate.canonicalCommandJsonUtf8ByteLength as number) <= 0 ||
      candidate.canonicalCommandJsonUtf8ByteLength !== Buffer.byteLength(candidate.canonicalCommandJson, "utf8") ||
      typeof candidate.digestHex !== "string" ||
      !/^[0-9a-f]{64}$/.test(candidate.digestHex) || candidate.digestHex.length !== COMMAND_FINGERPRINT_DIGEST_HEX_LENGTH) return false;
  return candidate.digestHex === sha256Utf8(candidate.canonicalCommandJson);
};

export const commandFingerprintsRepresentSameCommand = (
  stored: unknown,
  incoming: CommandFingerprint
): boolean => validateCommandFingerprint(stored) &&
  stored.canonicalCommandJson === incoming.canonicalCommandJson;
