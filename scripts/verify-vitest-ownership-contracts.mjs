import { Buffer } from "node:buffer";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdtempSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
  writeSync
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { Writable } from "node:stream";
import { URL } from "node:url";
import { TextDecoder, types as utilTypes } from "node:util";
import { createVitest } from "vitest/node";
import {
  ACCEPTED_AUTHORITY_SUPERSESSIONS,
  ACCEPTED_CONTRACT_BASELINES,
  IDENTITY_ENCODING_VERSION,
  OwnershipContractError,
  auditOwnershipContracts,
  build2B20ACandidate,
  candidateBytes,
  canonicalizeStructuredVitestIdentities,
  sha256CanonicalLines,
  validateAcceptedAuthoritySupersessionRegistry,
  validateAcceptedAuthoritySupersessions,
  validateAcceptedGitAuthority,
  validateOwnershipContracts
} from "./vitest-ownership-contracts.mjs";

const APPLICATION_FILE = "packages/application/src/synthetic.test.ts";
const LEGACY_PROJECTS = Object.freeze(["legacy-a", "legacy-b"]);
const NON_OWNED_POLICY =
  "GLOBAL_APPLICATION_NON_OWNED_EXACT_SHA256_WITH_FROZEN_LEGACY_MARKERS";
const ZERO_SHA256 = "0".repeat(64);
const CANDIDATE_LIFECYCLE_ERRORS = new WeakSet();

class CandidateLifecycleError extends Error {
  constructor(code, details = "", diagnostics = []) {
    super(details.length === 0 ? code : `${code}: ${details}`);
    this.name = "CandidateLifecycleError";
    this.code = code;
    this.diagnostics = diagnostics;
    CANDIDATE_LIFECYCLE_ERRORS.add(this);
  }
}

function candidateFail(code, details = "", diagnostics = []) {
  throw new CandidateLifecycleError(code, details, diagnostics);
}

const DIAGNOSTIC_KEYS = Object.freeze([
  "phase",
  "classification",
  "source",
  "ordinal",
  "name",
  "message"
]);
const DIAGNOSTIC_SOURCES = Object.freeze([
  "PUBLIC_PROMISE_REJECTION",
  "PUBLIC_INJECTED_STDERR",
  "PUBLIC_INJECTED_STDERR_CAPTURE"
]);
const DIAGNOSTIC_REDACTION_SCHEMA_VERSION =
  "vitest-lifecycle-diagnostic-redaction-v1";
const DIAGNOSTIC_INPUT_LIMIT = 4096;
const DIAGNOSTIC_OUTPUT_LIMIT = 500;
const DIAGNOSTIC_CAUSE_DEPTH_LIMIT = 4;
const REDACTED_TOKEN = "<redacted-token>";
const REDACTED_VALUE = "<redacted>";
const REDACTED_OPAQUE = "<redacted:opaque>";
const SENSITIVE_QUERY_NAME_SEGMENTS = Object.freeze(
  new Set([
    "auth",
    "authorization",
    "credential",
    "key",
    "passwd",
    "password",
    "pwd",
    "secret",
    "sig",
    "signature",
    "token"
  ])
);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function pathVariantPattern(value, placeholder) {
  const normalized = path.resolve(value).replaceAll("\\", "/");
  const source = escapeRegExp(normalized).replaceAll("/", "[\\\\/]+");
  return Object.freeze({
    normalized,
    pattern: new RegExp(source, "giu"),
    placeholder
  });
}

const SENSITIVE_PATH_ROOTS = Object.freeze(
  [
    [path.resolve(process.cwd()), "<repo-root>"],
    [path.resolve(tmpdir()), "<temp>"],
    [path.resolve(homedir()), "<home>"]
  ]
    .sort(([left], [right]) => right.length - left.length)
    .map(([value, placeholder]) => pathVariantPattern(value, placeholder))
);

function boundedDiagnosticText(value) {
  return value.slice(0, DIAGNOSTIC_OUTPUT_LIMIT);
}

function normalizeDiagnosticControls(value) {
  let normalized = "";
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    normalized +=
      codePoint === 9 ||
      codePoint === 10 ||
      codePoint === undefined ||
      (codePoint >= 32 && codePoint !== 127)
        ? character
        : "\uFFFD";
  }
  return normalized;
}

function safePathBasename(value) {
  const withoutLineColumn = value.replace(/:\d+(?::\d+)?$/u, "");
  const lineColumn = value.slice(withoutLineColumn.length);
  const parts = withoutLineColumn.split("/").filter((part) => part.length > 0);
  const basename = parts.at(-1);
  return basename === undefined
    ? ""
    : `/${basename}${lineColumn}`;
}

function classifyAbsolutePath(value, sensitivePathRoots = SENSITIVE_PATH_ROOTS) {
  let canonical = value.replaceAll("\\", "/").replace(/\/+/gu, "/");
  if (/^\/[A-Za-z]:\//u.test(canonical)) canonical = canonical.slice(1);
  const lower = canonical.toLowerCase();
  const classifyKnownRoot = ({ normalized, placeholder }) => {
    const rootLower = normalized.toLowerCase();
    return lower === rootLower ||
      (lower.startsWith(rootLower) && canonical[normalized.length] === "/")
      ? `${placeholder}${canonical.slice(normalized.length)}`
      : null;
  };
  const repositoryRoot = sensitivePathRoots.find(
    ({ placeholder }) => placeholder === "<repo-root>"
  );
  const repositoryPath =
    repositoryRoot === undefined ? null : classifyKnownRoot(repositoryRoot);
  if (repositoryPath !== null) return repositoryPath;
  if (
    /^\/home\/runner\/work\/[^/]+\/[^/]+(?:\/|$)/u.test(canonical) ||
    /^[A-Za-z]:\/a\/[^/]+\/[^/]+(?:\/|$)/u.test(canonical)
  ) {
    const workspace = canonical.match(
      /^(?:\/home\/runner\/work\/[^/]+\/[^/]+|[A-Za-z]:\/a\/[^/]+\/[^/]+)/u
    )?.[0];
    return `<runner-workspace>${canonical.slice(workspace?.length ?? canonical.length)}`;
  }
  for (const root of sensitivePathRoots) {
    if (root.placeholder === "<repo-root>") continue;
    const classified = classifyKnownRoot(root);
    if (classified !== null) return classified;
  }
  const portableTemporaryRoot = canonical.match(
    /^(?:\/private\/tmp|\/var\/tmp|\/tmp)(?:\/|$)/u
  )?.[0]?.replace(/\/$/u, "");
  if (portableTemporaryRoot !== undefined) {
    return `<temp>${canonical.slice(portableTemporaryRoot.length)}`;
  }
  const portableHomeRoot = canonical.match(
    /^\/(?:home|Users)\/[^/]+(?:\/|$)/u
  )?.[0]?.replace(/\/$/u, "");
  if (portableHomeRoot !== undefined) {
    return `<home>${canonical.slice(portableHomeRoot.length)}`;
  }
  if (value.startsWith("\\\\") || value.startsWith("//")) {
    return `<unc-path>${safePathBasename(canonical)}`;
  }
  return `<absolute-path>${safePathBasename(canonical)}`;
}

function redactFileUrlToken(value, sensitivePathRoots = SENSITIVE_PATH_ROOTS) {
  const withoutUserinfo = value.replace(
    /^file:\/\/[^/@\s]+@/iu,
    "file://"
  );
  try {
    const parsed = new URL(withoutUserinfo);
    if (parsed.protocol !== "file:") {
      return "<absolute-path>/<basename>";
    }
    const decodedPathname = decodeURIComponent(parsed.pathname);
    const host =
      parsed.hostname.length > 0 && parsed.hostname.toLowerCase() !== "localhost"
        ? decodeURIComponent(parsed.hostname)
        : "";
    const absolutePath =
      host.length > 0
        ? `//${host}${decodedPathname}`
        : decodedPathname;
    return (
      classifyAbsolutePath(absolutePath, sensitivePathRoots) +
      parsed.search +
      parsed.hash
    );
  } catch {
    return /^file:(?:\\\\|\/\/[^/])/iu.test(value)
      ? "<unc-path>/<basename>"
      : "<absolute-path>/<basename>";
  }
}

function redactFileUrls(value, sensitivePathRoots = SENSITIVE_PATH_ROOTS) {
  const render = (fileUrl) =>
    redactFileUrlToken(fileUrl, sensitivePathRoots);
  return value
    .replace(
      /\bfile:(?:\/{2,3})?[A-Za-z]:[\\/](?:[^\\/\r\n"'<>|]+[\\/])+[^\\/\r\n"'<>|]*?(?:\.[A-Za-z0-9_-]+)+(?::\d+(?::\d+)?)?/giu,
      render
    )
    .replace(
      /\bfile:(?:\\\\|\/\/)[^\\/\r\n"'<>]+[\\/][^\\/\r\n"'<>]+(?:[\\/][^\\/\r\n"'<>]+)*?[\\/][^\\/\r\n"'<>]*?(?:\.[A-Za-z0-9_-]+)+(?::\d+(?::\d+)?)?/giu,
      render
    )
    .replace(
      /\bfile:[^\s"'<>),;]+/giu,
      render
    );
}

function redactWindowsAbsolutePaths(value) {
  const redactDrive = (drivePath) => classifyAbsolutePath(drivePath);
  const redactUnc = (uncPath) => classifyAbsolutePath(uncPath);
  return value
    .replace(
      /\b[A-Za-z]:[\\/](?:[^\\/\r\n"'<>|]+[\\/])+[^\\/\r\n"'<>|]*?(?:\.[A-Za-z0-9_-]+)+(?::\d+(?::\d+)?)?/gu,
      (drivePath) => redactDrive(drivePath)
    )
    .replace(
      /(^|[\s(=[{])((?:\\\\|\/\/)[^\\/\r\n"'<>]+[\\/][^\\/\r\n"'<>]+(?:[\\/][^\\/\r\n"'<>]+)*?[\\/][^\\/\r\n"'<>]*?(?:\.[A-Za-z0-9_-]+)+(?::\d+(?::\d+)?)?)/gmu,
      (_match, prefix, uncPath) => `${prefix}${redactUnc(uncPath)}`
    )
    .replace(
      /\b[A-Za-z]:[\\/][^\r\n"'<>|]*/gu,
      "<absolute-path>/<basename>"
    )
    .replace(
      /(^|[\s(=[{])(?:\\\\|\/\/)[^\r\n"'<>]*/gmu,
      (_match, prefix) => `${prefix}<unc-path>/<basename>`
    );
}

function redactSensitiveQueryValues(value) {
  return value.replace(
    /([?&])([^=&#\s]+)=([^&#\s]*)/gu,
    (match, separator, name) => {
      const isSensitive = name
        .toLowerCase()
        .split(/[_-]+/u)
        .some((segment) => SENSITIVE_QUERY_NAME_SEGMENTS.has(segment));
      return isSensitive
        ? `${separator}${name}=${REDACTED_VALUE}`
        : match;
    }
  );
}

function redactDiagnosticString(value) {
  let text = value
    .slice(0, DIAGNOSTIC_INPUT_LIMIT)
    .replace(/\r\n/gu, "\n")
    .replace(/\r/gu, "\n");
  text = normalizeDiagnosticControls(text);
  text = redactFileUrls(text);
  text = text
    .replace(
      /\b([a-z][a-z0-9+.-]*:\/\/)[^/\s:@]+(?::[^/\s@]*)?@/giu,
      `$1<redacted-userinfo>@`
    )
    .replace(
      /\bBearer[ \t]+[A-Za-z0-9._~+/=-]+/giu,
      `Bearer ${REDACTED_TOKEN}`
    )
    .replace(
      /\b(?:github_pat_[A-Za-z0-9_]{12,}|gh[pousr]_[A-Za-z0-9]{12,}|npm_[A-Za-z0-9]{12,}|sk-(?:proj-)?[A-Za-z0-9_-]{12,})\b/gu,
      REDACTED_TOKEN
    )
    .replace(
      /\b(api[_-]?key|authorization|credential|password|passwd|pwd|secret|token)([ \t]*[:=][ \t]*)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s,;&#]+)/giu,
      `$1$2${REDACTED_TOKEN}`
    )
    .replace(
      /\b(candidate(?:[_-]?(?:bytes?|baseline))?|baseline(?:[_-]?bytes?)?|canonical(?:[_-]?game)?[_-]?secret)([ \t]*[:=][ \t]*)(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\s,;&#]+)/giu,
      `$1$2${REDACTED_VALUE}`
    )
    .replace(
      /\b(?:CANONICAL_GAME_SECRET|CANDIDATE_BYTES|BASELINE_BYTES)_[A-Z0-9_-]{4,}\b/gu,
      REDACTED_VALUE
    )
    .replace(
      /\b(?:eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}|[A-Fa-f0-9]{32,}|[A-Za-z0-9+/]{48,}={0,2})\b/gu,
      REDACTED_TOKEN
    );
  const repositoryRoot = SENSITIVE_PATH_ROOTS.find(
    ({ placeholder }) => placeholder === "<repo-root>"
  );
  if (repositoryRoot !== undefined) {
    text = text.replace(repositoryRoot.pattern, repositoryRoot.placeholder);
  }
  text = text
    .replace(
      /\/home\/runner\/work\/[^/\s"'<>]+\/[^/\s"'<>]+(?:\/[^\s"'<>),;]*)?/gu,
      (runnerPath) => classifyAbsolutePath(runnerPath)
    )
    .replace(
      /\b[A-Za-z]:[\\/]a[\\/][^\\/\s"'<>]+[\\/][^\\/\s"'<>]+(?:[\\/][^\s"'<>),;]*)?/gu,
      (runnerPath) => classifyAbsolutePath(runnerPath)
    );
  for (const { pattern, placeholder } of SENSITIVE_PATH_ROOTS) {
    if (placeholder === "<repo-root>") continue;
    text = text.replace(pattern, placeholder);
  }
  text = redactWindowsAbsolutePaths(text);
  return boundedDiagnosticText(
    redactSensitiveQueryValues(
      text
      .replace(
        /\\\\[^\\/\s"'<>]+[\\/][^\\/\s"'<>]+(?:[\\/][^\s"'<>),;]+)*/gu,
        (uncPath) => classifyAbsolutePath(uncPath)
      )
      .replace(
        /\b[A-Za-z]:[\\/][^\s"'<>|),;]*/gu,
        (absolutePath) => classifyAbsolutePath(absolutePath)
      )
      .replace(
        /^\/(?:[^/\s"'<>),;]+\/)*[^/\s"'<>),;]*/gu,
        (absolutePath) => classifyAbsolutePath(absolutePath)
      )
      .replace(
        /([\s(=[{])\/(?:[^/\s"'<>),;]+\/)*[^/\s"'<>),;]*/gu,
        (_match, prefix) =>
          `${prefix}${classifyAbsolutePath(_match.slice(prefix.length))}`
      )
      .replace(
        /(<repo-root>|<home>|<temp>|<runner-workspace>)[\\/][^\s"'<>),;]*/gu,
        (classifiedPath) => classifiedPath.replaceAll("\\", "/")
      )
    )
  );
}

function safeOwnDataValue(value, key) {
  if (!utilTypes.isNativeError(value)) return undefined;
  try {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    return descriptor !== undefined && "value" in descriptor
      ? descriptor.value
      : undefined;
  } catch {
    return undefined;
  }
}

function nativeErrorName(error) {
  if (!utilTypes.isNativeError(error)) return "OpaqueFailure";
  const ownName = safeOwnDataValue(error, "name");
  if (typeof ownName === "string" && ownName.length > 0) {
    return redactDiagnosticString(ownName);
  }
  let prototype;
  try {
    prototype = Object.getPrototypeOf(error);
  } catch {
    return "Error";
  }
  const known = [
    [AggregateError.prototype, "AggregateError"],
    [EvalError.prototype, "EvalError"],
    [RangeError.prototype, "RangeError"],
    [ReferenceError.prototype, "ReferenceError"],
    [SyntaxError.prototype, "SyntaxError"],
    [TypeError.prototype, "TypeError"],
    [URIError.prototype, "URIError"]
  ];
  return known.find(([candidate]) => prototype === candidate)?.[1] ?? "Error";
}

function primitiveDiagnosticText(value) {
  if (value === null) return "";
  if (typeof value === "string") return redactDiagnosticString(value);
  if (
    typeof value === "undefined" ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "symbol"
  ) {
    return redactDiagnosticString(String(value));
  }
  return REDACTED_OPAQUE;
}

function nativeErrorSummary(error, seen = new Set(), depth = 0) {
  if (!utilTypes.isNativeError(error)) return REDACTED_OPAQUE;
  if (seen.has(error)) return "<redacted:cycle>";
  if (depth >= DIAGNOSTIC_CAUSE_DEPTH_LIMIT) return "<redacted:depth>";
  seen.add(error);
  try {
    const name = nativeErrorName(error);
    const rawMessage = safeOwnDataValue(error, "message");
    const message =
      typeof rawMessage === "string"
        ? redactDiagnosticString(rawMessage)
        : rawMessage === undefined
          ? ""
          : REDACTED_OPAQUE;
    const parts = [message];
    const rawStack = safeOwnDataValue(error, "stack");
    if (typeof rawStack === "string") {
      const normalizedStack = rawStack
        .replace(/\r\n/gu, "\n")
        .replace(/\r/gu, "\n");
      const defaultPrefix =
        message.length === 0 ? name : `${name}: ${rawMessage}`;
      const isDefaultStack =
        normalizedStack === defaultPrefix ||
        normalizedStack.startsWith(`${defaultPrefix}\n    at `);
      if (!isDefaultStack) {
        parts.push(`stack=${redactDiagnosticString(normalizedStack)}`);
      }
    }
    const cause = safeOwnDataValue(error, "cause");
    if (cause !== undefined) {
      const causeSummary = utilTypes.isNativeError(cause)
        ? nativeErrorSummary(cause, seen, depth + 1)
        : primitiveDiagnosticText(cause);
      parts.push(`cause=${causeSummary}`);
    }
    return boundedDiagnosticText(parts.filter((part) => part.length > 0).join(" | "));
  } catch {
    return REDACTED_OPAQUE;
  }
}

function safeDiagnosticMessage(value) {
  try {
    return utilTypes.isNativeError(value)
      ? nativeErrorSummary(value)
      : primitiveDiagnosticText(value);
  } catch {
    return REDACTED_OPAQUE;
  }
}

function lifecycleDiagnostic({
  phase,
  classification,
  source,
  ordinal,
  error = null,
  name,
  message
}) {
  if (
    typeof phase !== "string" ||
    phase.length === 0 ||
    typeof classification !== "string" ||
    classification.length === 0 ||
    !DIAGNOSTIC_SOURCES.includes(source) ||
    !Number.isSafeInteger(ordinal) ||
    ordinal < 0
  ) {
    throw new Error("Invalid lifecycle diagnostic");
  }
  return {
    phase,
    classification,
    source,
    ordinal,
    name: safeDiagnosticMessage(name ?? nativeErrorName(error)),
    message: safeDiagnosticMessage(message ?? error)
  };
}

function lifecycleDiagnosticBytes(diagnostics) {
  const lines = diagnostics.map((diagnostic) => {
    if (
      Object.keys(diagnostic).join(",") !== DIAGNOSTIC_KEYS.join(",") ||
      !DIAGNOSTIC_SOURCES.includes(diagnostic.source)
    ) {
      throw new Error("Invalid external lifecycle diagnostic shape");
    }
    return JSON.stringify(diagnostic);
  });
  return Buffer.from(lines.length === 0 ? "" : `${lines.join("\n")}\n`, "utf8");
}

function writeLifecycleDiagnostics(diagnostics, writable = process.stderr) {
  const bytes = lifecycleDiagnosticBytes(diagnostics);
  if (bytes.length > 0) writable.write(bytes);
  return bytes;
}

function writeCandidateFailure(error, writable = process.stderr) {
  const isCandidateLifecycleError =
    (typeof error === "object" && error !== null) ||
    typeof error === "function"
      ? CANDIDATE_LIFECYCLE_ERRORS.has(error)
      : false;
  const diagnostics = isCandidateLifecycleError
    ? safeOwnDataValue(error, "diagnostics")
    : undefined;
  if (Array.isArray(diagnostics) && diagnostics.length > 0) {
    return writeLifecycleDiagnostics(diagnostics, writable);
  }
  if (!isCandidateLifecycleError) {
    return writeLifecycleDiagnostics(
      [
        lifecycleDiagnostic({
          phase: "FAILED",
          classification: "UNEXPECTED_CANDIDATE_FAILURE",
          source: "PUBLIC_PROMISE_REJECTION",
          ordinal: 0,
          error
        })
      ],
      writable
    );
  }
  const message = safeOwnDataValue(error, "code");
  if (typeof message !== "string") {
    return writeLifecycleDiagnostics(
      [
        lifecycleDiagnostic({
          phase: "FAILED",
          classification: "UNEXPECTED_CANDIDATE_FAILURE",
          source: "PUBLIC_PROMISE_REJECTION",
          ordinal: 0,
          error
        })
      ],
      writable
    );
  }
  const bytes = Buffer.from(`${message}\n`, "utf8");
  writable.write(bytes);
  return bytes;
}

function createPhaseCapture(phaseState) {
  const records = [];
  let ordinal = 0;
  const writable = new Writable({
    write(chunk, encoding, callback) {
      let bytes;
      try {
        bytes =
          typeof chunk === "string"
            ? Buffer.from(chunk, encoding)
            : Buffer.isBuffer(chunk) || chunk instanceof Uint8Array
              ? Buffer.from(chunk)
              : null;
        records.push({
          ordinal,
          phase: phaseState.phase,
          bytes,
          encoding: typeof encoding === "string" ? encoding : "",
          sha256:
            bytes === null
              ? null
              : createHash("sha256").update(bytes).digest("hex")
        });
        ordinal += 1;
        callback();
      } catch (error) {
        callback(error);
      }
    }
  });
  return { records, writable };
}

function classifyClosingCapture(records) {
  const decoder = new TextDecoder("utf-8", { fatal: true });
  return records
    .filter((record) => record.phase === "CLOSING")
    .map((record) => {
      if (record.bytes === null) {
        return {
          ...record,
          classification: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID",
          source: "PUBLIC_INJECTED_STDERR_CAPTURE",
          text: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID",
          isCloseError: true
        };
      }
      let text;
      try {
        text = decoder.decode(record.bytes);
      } catch {
        return {
          ...record,
          classification: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID",
          source: "PUBLIC_INJECTED_STDERR_CAPTURE",
          text: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID",
          isCloseError: true
        };
      }
      const normalized = text
        .replace(/\r\n/gu, "\n")
        .replace(/\r/gu, "\n")
        .replace(/\n+$/gu, "");
      if (normalized.length === 0) {
        return {
          ...record,
          classification: "EMPTY_FORMATTING",
          source: "PUBLIC_INJECTED_STDERR",
          text: "",
          isCloseError: false
        };
      }
      if (
        normalized === "error during close" ||
        /^error during close(?: |\t|\n)/u.test(normalized)
      ) {
        return {
          ...record,
          classification: "CLOSE_FAILED",
          source: "PUBLIC_INJECTED_STDERR",
          text: normalized,
          isCloseError: true
        };
      }
      return {
        ...record,
        classification: "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC",
        source: "PUBLIC_INJECTED_STDERR",
        text: normalized,
        isCloseError: false
      };
    });
}

async function executeCandidateLifecycle({
  create,
  collect,
  validate,
  encode,
  publish
}) {
  const phaseState = { phase: "CREATING" };
  const stdoutCapture = createPhaseCapture(phaseState);
  const stderrCapture = createPhaseCapture(phaseState);
  let vitest;
  let encoded;
  let primaryDiagnostic = null;
  let primaryClassification = null;
  let closeDiagnostic = null;
  let closeInvocationCount = 0;
  try {
    vitest = await create({
      stdout: stdoutCapture.writable,
      stderr: stderrCapture.writable
    });
    phaseState.phase = "COLLECTING";
    const collected = await collect(vitest);
    phaseState.phase = "VALIDATING_OR_ENCODING";
    const validated = await validate(collected);
    encoded = await encode(validated);
  } catch (error) {
    primaryDiagnostic = error;
    primaryClassification =
      vitest === undefined
        ? "CREATE_FAILED"
        : phaseState.phase === "COLLECTING"
          ? "COLLECT_FAILED"
          : "VALIDATE_OR_ENCODE_FAILED";
  } finally {
    if (vitest !== undefined) {
      phaseState.phase = "CLOSING";
      closeInvocationCount += 1;
      try {
        await vitest.close();
      } catch (error) {
        closeDiagnostic = error;
      }
    }
  }
  const closingRecords = classifyClosingCapture(stderrCapture.records);
  const closeErrors = closingRecords.filter(
    (record) => record.isCloseError
  );
  const closeNonErrors = closingRecords.filter(
    (record) =>
      record.classification === "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC"
  );
  if (
    vitest !== undefined &&
    (closeInvocationCount !== 1 ||
      closeDiagnostic !== null ||
      closeErrors.length > 0)
  ) {
    encoded = undefined;
    const diagnostics = [];
    if (primaryDiagnostic !== null) {
      diagnostics.push(
        lifecycleDiagnostic({
          phase:
            primaryClassification === "CREATE_FAILED"
              ? "CREATING"
              : primaryClassification === "COLLECT_FAILED"
                ? "COLLECTING"
                : "VALIDATING_OR_ENCODING",
          classification: primaryClassification,
          source: "PUBLIC_PROMISE_REJECTION",
          ordinal: 0,
          error: primaryDiagnostic
        })
      );
    }
    if (closeDiagnostic !== null) {
      diagnostics.push(
        lifecycleDiagnostic({
          phase: "CLOSING",
          classification: "CLOSE_FAILED",
          source: "PUBLIC_PROMISE_REJECTION",
          ordinal: 0,
          error: closeDiagnostic
        })
      );
    }
    for (const [ordinal, record] of closeErrors.entries()) {
      diagnostics.push(
        lifecycleDiagnostic({
          phase: "CLOSING",
          classification: record.classification,
          source: record.source,
          ordinal,
          name:
            record.source === "PUBLIC_INJECTED_STDERR_CAPTURE"
              ? "PublicStderrCapture"
              : "PublicStderrRecord",
          message: record.text
        })
      );
    }
    for (const [ordinal, record] of closeNonErrors.entries()) {
      diagnostics.push(
        lifecycleDiagnostic({
          phase: "CLOSING",
          classification: record.classification,
          source: record.source,
          ordinal,
          name: "PublicStderrRecord",
          message: record.text
        })
      );
    }
    candidateFail(
      "CLOSE_FAILED",
      [
        closeDiagnostic === null ? "" : safeDiagnosticMessage(closeDiagnostic),
        ...closeErrors.map((record) => record.text)
      ].filter(Boolean).join(" | "),
      diagnostics
    );
  }
  if (primaryDiagnostic !== null) {
    encoded = undefined;
    const diagnostics = [
      lifecycleDiagnostic({
        phase:
          primaryClassification === "CREATE_FAILED"
            ? "CREATING"
            : primaryClassification === "COLLECT_FAILED"
              ? "COLLECTING"
              : "VALIDATING_OR_ENCODING",
        classification: primaryClassification,
        source: "PUBLIC_PROMISE_REJECTION",
        ordinal: 0,
        error: primaryDiagnostic
      })
    ];
    for (const [ordinal, record] of closeNonErrors.entries()) {
      diagnostics.push(
        lifecycleDiagnostic({
          phase: "CLOSING",
          classification: record.classification,
          source: record.source,
          ordinal,
          name: "PublicStderrRecord",
          message: record.text
        })
      );
    }
    candidateFail(
      primaryClassification,
      safeDiagnosticMessage(primaryDiagnostic),
      diagnostics
    );
  }
  if (!Buffer.isBuffer(encoded)) {
    candidateFail("VALIDATE_OR_ENCODE_FAILED", "candidate bytes are unavailable");
  }
  phaseState.phase = "PUBLISHING";
  await publish(encoded);
  phaseState.phase = "SUCCEEDED";
  return {
    bytes: encoded,
    closeInvocationCount,
    closingRecords,
    closeNonErrors,
    diagnostics: closeNonErrors.map((record, ordinal) =>
      lifecycleDiagnostic({
        phase: "CLOSING",
        classification: record.classification,
        source: record.source,
        ordinal,
        name: "PublicStderrRecord",
        message: record.text
      })
    ),
    stdoutRecords: stdoutCapture.records,
    stderrRecords: stderrCapture.records
  };
}

function canonicalModuleFile(repoRoot, moduleId) {
  if (typeof moduleId !== "string" || moduleId.length === 0) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "moduleId is missing"
    );
  }
  const absolute = path.resolve(moduleId);
  const relative = path.relative(repoRoot, absolute);
  if (
    relative.length === 0 ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      `module outside repository: ${moduleId}`
    );
  }
  return relative.split(path.sep).join("/");
}

function testAncestorPath(test, module) {
  const reversed = [];
  let parent = test.parent;
  const visited = new Set();
  while (parent !== module) {
    if (
      parent === undefined ||
      parent === null ||
      visited.has(parent) ||
      parent.type !== "suite" ||
      typeof parent.name !== "string" ||
      parent.name.length === 0
    ) {
      candidateFail(
        "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
        "malformed TestCase ancestor chain"
      );
    }
    visited.add(parent);
    reversed.push(parent.name);
    parent = parent.parent;
  }
  return reversed.reverse();
}

function assertPublicPendingTestCase(test) {
  if (
    test === null ||
    typeof test !== "object" ||
    typeof test.result !== "function"
  ) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "public TestCase.result is unavailable"
    );
  }
  let result;
  try {
    result = test.result();
  } catch {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "public TestCase.result threw"
    );
  }
  if (
    result === null ||
    typeof result !== "object" ||
    Array.isArray(result) ||
    result.state !== "pending"
  ) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "TestCase is not in the exact supported pending state"
    );
  }
  return result;
}

async function collectSemanticInventory(vitest, repoRoot) {
  if (typeof vitest.collect !== "function") {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "public collect is unavailable"
    );
  }
  const result = await vitest.collect([]);
  if (
    result === null ||
    typeof result !== "object" ||
    !Array.isArray(result.testModules) ||
    !Array.isArray(result.unhandledErrors) ||
    result.unhandledErrors.length !== 0
  ) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      "malformed public collection result"
    );
  }
  const identities = [];
  const rawProjection = [];
  const seenTests = new Set();
  for (const module of result.testModules) {
    const moduleErrors =
      module !== null &&
      typeof module === "object" &&
      typeof module.errors === "function"
        ? module.errors()
        : null;
    if (
      module === null ||
      typeof module !== "object" ||
      typeof module.errors !== "function" ||
      !Array.isArray(moduleErrors) ||
      moduleErrors.length !== 0 ||
      module.children === null ||
      typeof module.children !== "object" ||
      typeof module.children.allTests !== "function"
    ) {
      candidateFail(
        "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
        "malformed TestModule"
      );
    }
    const tests = [...module.children.allTests()];
    for (const test of tests) {
      assertPublicPendingTestCase(test);
      if (
        seenTests.has(test) ||
        test.module !== module ||
        typeof test.name !== "string" ||
        test.name.length === 0 ||
        typeof test.fullName !== "string" ||
        typeof test.project?.name !== "string" ||
        test.project.name.length === 0
      ) {
        candidateFail(
          "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
          "malformed or executed TestCase"
        );
      }
      seenTests.add(test);
      const ancestorPath = testAncestorPath(test, module);
      const projectedName = [...ancestorPath, test.name].join(" > ");
      if (test.fullName !== projectedName) {
        candidateFail(
          "VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH",
          test.fullName
        );
      }
      const file = canonicalModuleFile(repoRoot, module.moduleId);
      identities.push({
        project: test.project.name,
        file,
        ancestorPath,
        title: test.name
      });
      rawProjection.push([
        test.project.name,
        file,
        test.fullName,
        test
      ]);
    }
  }
  if (identities.length !== 1572 || rawProjection.length !== identities.length) {
    candidateFail(
      "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
      `expected=1572, actual=${identities.length}`
    );
  }
  const canonical = canonicalizeStructuredVitestIdentities(repoRoot, identities);
  for (const identity of canonical) {
    const nonTitleFields = [
      identity.project,
      identity.file,
      ...identity.ancestorPath
    ];
    if (
      nonTitleFields.some((field) => field.includes("\n")) ||
      [...nonTitleFields, identity.title].some((field) => field.includes("\r"))
    ) {
      candidateFail(
        "VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH",
        "LF must occur only in titles and CR is forbidden in the frozen inventory"
      );
    }
  }
  const lfTests = rawProjection.filter(([, , , test]) => test.name.includes("\n"));
  if (
    lfTests.length !== 12 ||
    lfTests.some(([, , , test]) => test.name.split("\n").length - 1 !== 2)
  ) {
    candidateFail(
      "VITEST_RAW_STRUCTURED_IDENTITY_MISMATCH",
      `LF identities=${lfTests.length}`
    );
  }
  return canonical;
}

function assertCandidatePath(candidatePath, { mustExist }) {
  if (!path.isAbsolute(candidatePath)) {
    candidateFail("CANDIDATE_PATH_INVALID", "path must be absolute");
  }
  const resolved = path.resolve(candidatePath);
  if (path.dirname(resolved) !== path.resolve(tmpdir())) {
    candidateFail("CANDIDATE_PATH_INVALID", "parent must be the OS temp directory");
  }
  if (existsSync(resolved) !== mustExist) {
    candidateFail(
      mustExist ? "CANDIDATE_FILE_MISSING" : "CANDIDATE_OUTPUT_COLLISION",
      resolved
    );
  }
  return resolved;
}

function publishCandidateAtomically(
  finalPath,
  bytes,
  operations = {
    exists: existsSync,
    open: openSync,
    write: writeSync,
    fsync: fsyncSync,
    close: closeSync,
    rename: renameSync,
    unlink: unlinkSync
  }
) {
  const temporaryPath = path.join(
    path.dirname(finalPath),
    `.${path.basename(finalPath)}.2b20ap1.tmp`
  );
  if (operations.exists(temporaryPath)) {
    candidateFail("CANDIDATE_TEMP_COLLISION", temporaryPath);
  }
  let descriptor;
  try {
    descriptor = operations.open(temporaryPath, "wx");
    let offset = 0;
    while (offset < bytes.length) {
      const written = operations.write(
        descriptor,
        bytes,
        offset,
        bytes.length - offset
      );
      if (written <= 0) {
        candidateFail("PUBLISH_FAILED", "candidate write made no progress");
      }
      offset += written;
    }
    operations.fsync(descriptor);
    operations.close(descriptor);
    descriptor = undefined;
    operations.rename(temporaryPath, finalPath);
  } catch (error) {
    if (descriptor !== undefined) {
      try {
        operations.close(descriptor);
      } catch {
        // Preserve the primary publication error.
      }
    }
    if (operations.exists(temporaryPath)) operations.unlink(temporaryPath);
    candidateFail(
      "PUBLISH_FAILED",
      safeDiagnosticMessage(error)
    );
  }
}

function parseCandidateArguments(argv) {
  if (
    argv.length === 7 &&
    argv[0] === "--emit-candidate-baseline" &&
    argv[1] === "2B20A" &&
    argv[2] === "--workspace" &&
    argv[3] === "vitest.workspace.ts" &&
    argv[4] === "--output"
  ) {
    return { mode: "emit", candidatePath: argv[5], trailing: argv[6] };
  }
  if (
    argv.length === 6 &&
    argv[0] === "--emit-candidate-baseline" &&
    argv[1] === "2B20A" &&
    argv[2] === "--workspace" &&
    argv[3] === "vitest.workspace.ts" &&
    argv[4] === "--output"
  ) {
    return { mode: "emit", candidatePath: argv[5] };
  }
  if (
    argv.length === 6 &&
    argv[0] === "--verify-candidate-baseline" &&
    argv[1] === "2B20A" &&
    argv[2] === "--workspace" &&
    argv[3] === "vitest.workspace.ts" &&
    argv[4] === "--candidate"
  ) {
    return { mode: "verify", candidatePath: argv[5] };
  }
  candidateFail("INVALID_CANDIDATE_ARGUMENTS");
}

async function runCandidateCommand(options) {
  if (options.trailing !== undefined) {
    candidateFail("INVALID_CANDIDATE_ARGUMENTS");
  }
  const repoRoot = path.resolve(process.cwd());
  const workspace = path.resolve(repoRoot, "vitest.workspace.ts");
  const candidatePath = assertCandidatePath(options.candidatePath, {
    mustExist: options.mode === "verify"
  });
  const result = await executeCandidateLifecycle({
    create: ({ stdout, stderr }) =>
      createVitest(
        "test",
        {
          root: repoRoot,
          workspace,
          run: true,
          watch: false,
          passWithNoTests: false,
          reporters: [],
          color: false
        },
        {},
        { stdout, stderr }
    ),
    collect: (vitest) => collectSemanticInventory(vitest, repoRoot),
    validate: (inventory) => inventory,
    encode: (inventory) => candidateBytes(build2B20ACandidate(repoRoot, inventory)),
    publish: async (bytes) => {
      if (options.mode === "emit") {
        publishCandidateAtomically(candidatePath, bytes);
        return;
      }
      const actual = readFileSync(candidatePath);
      if (!actual.equals(bytes)) {
        candidateFail("CANDIDATE_BASELINE_REPEAT_MISMATCH");
      }
    }
  });
  writeLifecycleDiagnostics(result.diagnostics);
  if (options.mode === "emit") process.stdout.write(result.bytes);
  else process.stdout.write("CANDIDATE_BASELINE_VERIFIED 2B20A\n");
}

function identity(project, title, ancestorPath = ["synthetic ownership"] ) {
  return { project, file: APPLICATION_FILE, ancestorPath, title };
}

function traceability(contractId, title, options = {}) {
  const criterion = options.criterion ?? "C01";
  const supportingReference = options.supportingReference ?? `SUP-${contractId}-001`;
  const mechanism = options.mechanism ?? "PASS";
  const criterionRows = options.criterionRows ?? [
    `| ${criterion} | \`${APPLICATION_FILE}\` | \`${title}\` | R1 | T1 | LAYER | ${supportingReference} | ${mechanism} | synthetic |`
  ];
  const registryRows = options.registryRows ?? [
    `| SUP-${contractId}-001 | synthetic supporting authority |`
  ];
  return `${[...criterionRows, ...registryRows].join("\n")}\n`;
}

function writeFixture(root, relative, content) {
  const destination = path.resolve(root, relative);
  mkdirSync(path.dirname(destination), { recursive: true });
  writeFileSync(destination, content, "utf8");
}

function encodeFields(fields) {
  return fields.map((field) => `${field.length}:${field}`).join("|");
}

function semanticKey(entry) {
  return encodeFields([
    entry.file,
    encodeFields(entry.ancestorPath),
    entry.title
  ]);
}

function makeContract({
  contractId,
  ownerProject,
  traceabilityFile,
  fullInventory,
  registeredContractIds,
  criterionIds = ["C01"],
  dynamicTestAuthorityRows = 1,
  supportingAuthorityCount = 1,
  traceabilityRowCount = criterionIds.length
}) {
  const markerPrefix = `[${contractId}-`;
  const owned = fullInventory.filter((entry) => entry.title.includes(markerPrefix));
  const semanticLines = new Map();
  for (const entry of owned) {
    semanticLines.set(
      semanticKey(entry),
      [entry.file, entry.ancestorPath.join(" > "), entry.title].join("\t")
    );
  }
  const nonOwned = fullInventory.filter(
    (entry) =>
      !registeredContractIds.some((id) => entry.title.includes(`[${id}-`))
  );
  const nonOwnedOwners = new Map();
  for (const entry of nonOwned) {
    const key = semanticKey(entry);
    const existing = nonOwnedOwners.get(key) ?? { entry, owners: new Set() };
    existing.owners.add(entry.project);
    nonOwnedOwners.set(key, existing);
  }
  const nonOwnedLines = [...nonOwnedOwners.values()].map(({ entry, owners }) =>
    [
      entry.file,
      entry.ancestorPath.join(" > "),
      entry.title,
      [...owners].sort((left, right) => (left < right ? -1 : left > right ? 1 : 0)).join(",")
    ].join("\t")
  );
  const projectLines = owned.map((entry) =>
    [entry.project, entry.file, entry.ancestorPath.join(" > "), entry.title].join("\t")
  );
  return {
    applicationTestFile: APPLICATION_FILE,
    contractId,
    criterionIds: [...criterionIds],
    frozenBaseline: {
      authorityInventorySha256: sha256CanonicalLines(
        new Set(owned.map((entry) => /^\[([^\]]+)\]/u.exec(entry.title)?.[1] ?? ""))
      ),
      currentProjectInventorySha256: sha256CanonicalLines(projectLines),
      dynamicTestAuthorityRows,
      nonMarkerOwnershipSha256: sha256CanonicalLines(nonOwnedLines),
      nonOwnedInventoryPolicy: NON_OWNED_POLICY,
      physicalTestFileSetSha256: sha256CanonicalLines(
        new Set(fullInventory.map((entry) => entry.file))
      ),
      projectExecutionsAfter: owned.length,
      projectExecutionsBefore: owned.length,
      projectInventorySha256: ZERO_SHA256,
      semanticInventorySha256: sha256CanonicalLines(semanticLines.values()),
      supportingAuthorityCount,
      traceabilityRowCount
    },
    markerPattern: `^\\[${contractId}-[^\\]]+\\]`,
    markerPrefix,
    ownerProject,
    status: "ACTIVE",
    supportingAuthorityPrefix: `SUP-${contractId}-`,
    traceabilityFile
  };
}

function expectCode(code, operation) {
  try {
    operation();
  } catch (error) {
    if (error instanceof OwnershipContractError && error.code === code) return;
    throw new Error(
      `expected ${code}; received ${error instanceof Error ? error.message : String(error)}`
    );
  }
  throw new Error(`expected ${code}; operation passed`);
}

function expectRejected(operation) {
  try {
    operation();
  } catch (error) {
    if (error instanceof OwnershipContractError) return;
    throw error;
  }
  throw new Error("expected ownership contract rejection; operation passed");
}

function audit(root, contracts, inventory) {
  return auditOwnershipContracts({
    repoRoot: root,
    contracts,
    fullInventory: inventory,
    legacyApplicationServiceProjects: LEGACY_PROJECTS
  });
}

function createFixture(root, ids = ["2BTESTA"], options = {}) {
  const legacy = identity("legacy-a", "[2BLEGACY-01] frozen accepted marker");
  const owned = ids.map((id, index) =>
    identity(`owner-${id}`, `[${id}-C01] synthetic ${index + 1}`)
  );
  const inventory = options.withoutLegacy ? [...owned] : [legacy, ...owned];
  const contracts = ids.map((id, index) => {
    const traceabilityFile = `trace/${id.toLowerCase()}.md`;
    writeFixture(root, traceabilityFile, traceability(id, owned[index].title));
    return makeContract({
      contractId: id,
      ownerProject: `owner-${id}`,
      traceabilityFile,
      fullInventory: inventory,
      registeredContractIds: ids
    });
  });
  return { contracts, inventory, legacy, owned };
}

function runSelfTest() {
  const root = mkdtempSync(path.join(tmpdir(), "botc-ownership-contracts-"));
  const results = [];
  const check = (name, operation) => {
    operation();
    results.push(name);
  };
  try {
    check("01 single contract and frozen legacy marker pass", () => {
      const fixture = createFixture(root);
      const result = audit(root, fixture.contracts, fixture.inventory);
      if (result.length !== 1 || result[0].semanticTests !== 1) {
        throw new Error("single-contract audit summary is incorrect");
      }
    });

    check("02 two non-overlapping contracts pass", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const result = audit(root, fixture.contracts, fixture.inventory);
      if (result.length !== 2) throw new Error("two-contract audit did not pass");
    });

    check("03 overlapping marker configuration rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const broad = { ...fixture.contracts[0], markerPrefix: "[2BTEST" };
      expectCode("OVERLAPPING_OWNERSHIP_MARKER_PATTERNS", () =>
        validateOwnershipContracts([broad, fixture.contracts[1]], {
          repoRoot: root
        })
      );
    });

    check("04 duplicate contractId rejects", () => {
      const fixture = createFixture(root);
      expectCode("DUPLICATE_OWNERSHIP_CONTRACT_ID", () =>
        validateOwnershipContracts([fixture.contracts[0], { ...fixture.contracts[0] }], {
          repoRoot: root
        })
      );
    });

    check("05 duplicate supporting prefix rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const hostile = {
        ...fixture.contracts[1],
        supportingAuthorityPrefix: fixture.contracts[0].supportingAuthorityPrefix
      };
      expectCode("DUPLICATE_SUPPORTING_AUTHORITY_PREFIX", () =>
        validateOwnershipContracts([fixture.contracts[0], hostile], {
          repoRoot: root
        })
      );
    });

    check("06 unknown marker addition and legacy mutation reject", () => {
      const fixture = createFixture(root);
      expectCode("UNREGISTERED_SLICE_OWNERSHIP_MARKER", () =>
        audit(root, fixture.contracts, [
          ...fixture.inventory,
          identity("legacy-a", "[2BUNKNOWN-01] new marker")
        ])
      );
      expectCode("UNREGISTERED_SLICE_OWNERSHIP_MARKER", () =>
        audit(root, fixture.contracts, [
          identity("legacy-a", "[2BLEGACY-02] changed accepted marker"),
          ...fixture.owned
        ])
      );
    });

    check("07 duplicate semantic project execution rejects", () => {
      const fixture = createFixture(root);
      expectCode("SEMANTIC_OWNERSHIP_MISMATCH", () =>
        audit(root, fixture.contracts, [
          ...fixture.inventory,
          { ...fixture.owned[0], project: "legacy-a" }
        ])
      );
    });

    check("08 wrong owner project rejects", () => {
      const fixture = createFixture(root);
      expectCode("SEMANTIC_OWNERSHIP_MISMATCH", () =>
        audit(root, fixture.contracts, [
          fixture.legacy,
          { ...fixture.owned[0], project: "legacy-a" }
        ])
      );
    });

    check("09 missing traceability file rejects", () => {
      const fixture = createFixture(root);
      const contract = {
        ...fixture.contracts[0],
        traceabilityFile: "trace/missing.md"
      };
      expectCode("OWNERSHIP_TRACEABILITY_FILE_MISSING", () =>
        audit(root, [contract], fixture.inventory)
      );
    });

    check("10 missing criterion rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        `| SUP-2BTESTA-001 | authority |\n`
      );
      expectCode("TRACEABILITY_CRITERION_MISMATCH", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("11 duplicate criterion rejects", () => {
      const fixture = createFixture(root);
      const row = `| C01 | \`${APPLICATION_FILE}\` | \`${fixture.owned[0].title}\` | R | T | L | SUP-2BTESTA-001 | PASS | note |`;
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        `${row}\n${row}\n| SUP-2BTESTA-001 | authority |\n`
      );
      expectCode("DUPLICATE_TRACEABILITY_CRITERION", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("12 missing supporting authority rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          supportingReference: "SUP-2BTESTA-002"
        })
      );
      expectCode("SUPPORTING_AUTHORITY_MISSING", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("13 unused supporting authority rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          registryRows: [
            "| SUP-2BTESTA-001 | authority |",
            "| SUP-2BTESTA-002 | unused |"
          ]
        })
      );
      expectCode("SUPPORTING_AUTHORITY_UNUSED", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("14 non-PASS MechanismMatch rejects", () => {
      const fixture = createFixture(root);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, { mechanism: "FAIL" })
      );
      expectCode("TRACEABILITY_MECHANISM_MISMATCH", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("15 non-leading authority marker rejects", () => {
      const title = "prefix [2BTESTA-C01] misplaced";
      const inventory = [identity("owner-2BTESTA", title)];
      const traceabilityFile = "trace/misplaced.md";
      writeFixture(root, traceabilityFile, traceability("2BTESTA", title));
      const contract = makeContract({
        contractId: "2BTESTA",
        ownerProject: "owner-2BTESTA",
        traceabilityFile,
        fullInventory: inventory,
        registeredContractIds: ["2BTESTA"]
      });
      expectCode("TITLE_HAS_NO_EXACT_AUTHORITY_MARKER", () =>
        audit(root, [contract], inventory)
      );
    });

    check("16 hostile and noncanonical registry shapes reject without getters", () => {
      const fixture = createFixture(root);
      const base = fixture.contracts[0];
      expectRejected(() =>
        validateOwnershipContracts([{ ...base, unknown: true }], {
          repoRoot: root
        })
      );
      let getterCalls = 0;
      const getterRecord = { ...base };
      Object.defineProperty(getterRecord, "ownerProject", {
        enumerable: true,
        get() {
          getterCalls += 1;
          return "owner-2BTESTA";
        }
      });
      expectRejected(() =>
        validateOwnershipContracts([getterRecord], { repoRoot: root })
      );
      if (getterCalls !== 0) throw new Error(`getter calls=${getterCalls}`);
      const symbolRecord = { ...base };
      symbolRecord[Symbol("hostile")] = true;
      expectRejected(() =>
        validateOwnershipContracts([symbolRecord], { repoRoot: root })
      );
      const sparse = [];
      sparse.length = 1;
      expectRejected(() =>
        validateOwnershipContracts(sparse, { repoRoot: root })
      );
      const keyedArray = [base];
      keyedArray.hostile = true;
      expectRejected(() =>
        validateOwnershipContracts(keyedArray, { repoRoot: root })
      );
      const inheritedArray = [base];
      Object.setPrototypeOf(inheritedArray, Object.create(Array.prototype));
      expectRejected(() =>
        validateOwnershipContracts(inheritedArray, { repoRoot: root })
      );
      const nonplain = Object.assign(Object.create(null), base);
      expectRejected(() =>
        validateOwnershipContracts([nonplain], { repoRoot: root })
      );
      const target = {};
      const revoked = Proxy.revocable(target, {});
      revoked.revoke();
      expectRejected(() =>
        validateOwnershipContracts(revoked.proxy, { repoRoot: root })
      );
    });

    check("17 output order is independent of registry input order", () => {
      const fixture = createFixture(root, ["2BTESTB", "2BTESTA"]);
      const forward = audit(root, fixture.contracts, fixture.inventory);
      const reverse = audit(root, [...fixture.contracts].reverse(), fixture.inventory);
      const forwardIds = forward.map((entry) => entry.contractId).join(",");
      const reverseIds = reverse.map((entry) => entry.contractId).join(",");
      if (forwardIds !== "2BTESTA,2BTESTB" || forwardIds !== reverseIds) {
        throw new Error(`unstable output order: ${forwardIds}; ${reverseIds}`);
      }
    });

    check("18 contract A cannot bind contract B semantic test", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[1].title)
      );
      expectCode("TRACEABILITY_BINDING_WRONG_OWNERSHIP_CONTRACT", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.legacy.title)
      );
      expectCode("TRACEABILITY_BINDING_WRONG_OWNERSHIP_CONTRACT", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("19 reciprocal cross-contract traceability swap rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[1].title)
      );
      writeFixture(
        root,
        fixture.contracts[1].traceabilityFile,
        traceability("2BTESTB", fixture.owned[0].title)
      );
      expectCode("TRACEABILITY_BINDING_WRONG_OWNERSHIP_CONTRACT", () =>
        audit(root, [...fixture.contracts].reverse(), fixture.inventory)
      );
    });

    check("20 registered foreign supporting authority rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          supportingReference: "SUP-2BTESTB-001"
        })
      );
      expectCode("INVALID_SUPPORTING_AUTHORITY_REFERENCE", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
      writeFixture(
        root,
        fixture.contracts[0].traceabilityFile,
        traceability("2BTESTA", fixture.owned[0].title, {
          registryRows: ["| SUP-2BTESTB-001 | foreign registry entry |"]
        })
      );
      expectCode("INVALID_SUPPORTING_AUTHORITY_REGISTRY_ENTRY", () =>
        audit(root, fixture.contracts, fixture.inventory)
      );
    });

    check("21 unregistered foreign mixed and unknown support never become zero", () => {
      const fixture = createFixture(root);
      const zeroSupportingContract = {
        ...fixture.contracts[0],
        frozenBaseline: {
          ...fixture.contracts[0].frozenBaseline,
          supportingAuthorityCount: 0
        }
      };
      for (const supportingReference of [
        "SUP-2BTESTB-001",
        "NONE SUP-2BTESTA-001",
        "UNKNOWN"
      ]) {
        writeFixture(
          root,
          zeroSupportingContract.traceabilityFile,
          traceability("2BTESTA", fixture.owned[0].title, {
            registryRows: [],
            supportingReference
          })
        );
        expectCode("INVALID_SUPPORTING_AUTHORITY_REFERENCE", () =>
          audit(root, [zeroSupportingContract], fixture.inventory)
        );
      }
    });

    check("22 duplicate active traceability file rejects", () => {
      const fixture = createFixture(root, ["2BTESTA", "2BTESTB"]);
      const duplicateFileContract = {
        ...fixture.contracts[1],
        traceabilityFile: fixture.contracts[0].traceabilityFile
      };
      expectCode("DUPLICATE_OWNERSHIP_TRACEABILITY_FILE", () =>
        validateOwnershipContracts(
          [fixture.contracts[0], duplicateFileContract],
          { repoRoot: root }
        )
      );
    });

    return results;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

async function runCompleteSelfTest() {
  const results = runSelfTest();
  const check = async (name, execute) => {
    await execute();
    results.push(name);
  };
  const expectLifecycleCode = async (code, execute) => {
    try {
      await execute();
    } catch (error) {
      if (error instanceof CandidateLifecycleError && error.code === code) {
        return error;
      }
      throw error;
    }
    throw new Error(`Expected lifecycle code ${code}`);
  };
  const parseDiagnosticBytes = (bytes) => {
    const text = bytes.toString("utf8");
    if (text.length === 0 || !text.endsWith("\n")) {
      throw new Error("diagnostic JSONL has no terminal LF");
    }
    return text.slice(0, -1).split("\n").map((line) => {
      const record = JSON.parse(line);
      if (
        Object.keys(record).join(",") !== DIAGNOSTIC_KEYS.join(",") ||
        !DIAGNOSTIC_SOURCES.includes(record.source)
      ) {
        throw new Error("diagnostic JSONL shape mismatch");
      }
      return record;
    });
  };
  const captureFailure = async (code, execute) => {
    const error = await expectLifecycleCode(code, execute);
    const chunks = [];
    const stderr = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      }
    });
    const direct = writeCandidateFailure(error, stderr);
    const captured = Buffer.concat(chunks);
    if (!captured.equals(direct)) {
      throw new Error("external diagnostic capture differs from serializer");
    }
    const records = parseDiagnosticBytes(captured);
    if (records.length !== error.diagnostics.length) {
      throw new Error("external diagnostic record count mismatch");
    }
    return { bytes: captured, error, records };
  };
  const assertDiagnostic = (actual, expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(
        `diagnostic mismatch expected=${JSON.stringify(expected)} actual=${JSON.stringify(actual)}`
      );
    }
  };
  const assertSanitized = (
    label,
    input,
    forbiddenFragments,
    expectedFragments = []
  ) => {
    const sanitized = safeDiagnosticMessage(input);
    if (
      sanitized.length > DIAGNOSTIC_OUTPUT_LIMIT ||
      sanitized.includes("\r") ||
      safeDiagnosticMessage(sanitized) !== sanitized
    ) {
      throw new Error(`${label} diagnostic normalization is not bounded/idempotent`);
    }
    for (const fragment of forbiddenFragments) {
      if (fragment.length > 0 && sanitized.toLowerCase().includes(fragment.toLowerCase())) {
        throw new Error(`${label} retained sensitive diagnostic material`);
      }
    }
    for (const fragment of expectedFragments) {
      if (!sanitized.includes(fragment)) {
        throw new Error(`${label} missing exact redaction placeholder ${fragment}`);
      }
    }
    return sanitized;
  };
  const rootPlaceholderPattern =
    /<(?:repo-root|home|temp|runner-workspace|absolute-path|unc-path)>/gu;
  const virtualWindowsRoots = Object.freeze([
    Object.freeze({
      normalized: "C:/Users/Alice Doe/work/botc",
      placeholder: "<repo-root>"
    }),
    Object.freeze({
      normalized: "C:/Users/Alice Doe/AppData/Local/Temp",
      placeholder: "<temp>"
    }),
    Object.freeze({
      normalized: "C:/Users/Alice Doe",
      placeholder: "<home>"
    })
  ]);
  const virtualPosixRoots = Object.freeze([
    Object.freeze({
      normalized: "/opt/botc/repository",
      placeholder: "<repo-root>"
    }),
    Object.freeze({
      normalized: "/tmp",
      placeholder: "<temp>"
    }),
    Object.freeze({
      normalized: "/home/alice",
      placeholder: "<home>"
    })
  ]);
  const assertSingleClassifiedFileUrl = ({
    expected,
    forbidden,
    input,
    label,
    placeholderCount = 1,
    roots
  }) => {
    const sanitized =
      roots === undefined
        ? safeDiagnosticMessage(input)
        : redactFileUrls(input, roots);
    if (sanitized !== expected) {
      throw new Error(
        `${label} file URL mismatch expected=${expected} actual=${sanitized}`
      );
    }
    const placeholders = sanitized.match(rootPlaceholderPattern) ?? [];
    if (
      placeholders.length !== placeholderCount ||
      /<(?:repo-root|home|temp|runner-workspace|absolute-path|unc-path)><|<(?:repo-root|home|temp|runner-workspace|absolute-path|unc-path)>\/<(?:repo-root|home|temp|runner-workspace|absolute-path|unc-path)>/u.test(
        sanitized
      ) ||
      safeDiagnosticMessage(sanitized) !== sanitized
    ) {
      throw new Error(`${label} file URL classification is not singular/idempotent`);
    }
    for (const fragment of forbidden) {
      if (sanitized.toLowerCase().includes(fragment.toLowerCase())) {
        throw new Error(`${label} retained file URL root material`);
      }
    }
    return sanitized;
  };
  const localFileUrl = (absolutePath) => {
    const normalized = absolutePath.replaceAll("\\", "/");
    return `file://${normalized.startsWith("/") ? "" : "/"}${normalized}`;
  };
  const currentRepositoryFileUrl = localFileUrl(
    `${path.resolve(process.cwd())}${path.sep}private${path.sep}repo.ts:1:2`
  );
  const currentHomeFileUrl = localFileUrl(
    `${path.resolve(homedir())}${path.sep}private${path.sep}home.ts:3:4`
  );
  const currentTemporaryFileUrl = localFileUrl(
    `${path.resolve(tmpdir())}${path.sep}private${path.sep}temp.ts:5:6`
  );
  const fileUrlSingleClassificationCases = [
    {
      label: "current repository file URL",
      input: currentRepositoryFileUrl,
      expected: "<repo-root>/private/repo.ts:1:2",
      forbidden: [path.resolve(process.cwd()), "file:"]
    },
    {
      label: "current home file URL",
      input: currentHomeFileUrl,
      expected: "<home>/private/home.ts:3:4",
      forbidden: [path.resolve(homedir()), "file:"]
    },
    {
      label: "current temporary file URL",
      input: currentTemporaryFileUrl,
      expected: "<temp>/private/temp.ts:5:6",
      forbidden: [path.resolve(tmpdir()), "file:"]
    },
    {
      label: "Windows repository file URL",
      input: "file:///C:/Users/Alice%20Doe/work/botc/private/repo.ts:7:8",
      expected: "<repo-root>/private/repo.ts:7:8",
      forbidden: ["C:/Users", "Alice", "file:"],
      roots: virtualWindowsRoots
    },
    {
      label: "Windows home file URL",
      input: "file:///C:/Users/Alice%20Doe/private/home.ts",
      expected: "<home>/private/home.ts",
      forbidden: ["C:/Users", "Alice", "file:"],
      roots: virtualWindowsRoots
    },
    {
      label: "Windows temporary file URL",
      input:
        "file:///C:/Users/Alice%20Doe/AppData/Local/Temp/private/temp.ts",
      expected: "<temp>/private/temp.ts",
      forbidden: ["C:/Users", "Alice", "AppData", "file:"],
      roots: virtualWindowsRoots
    },
    {
      label: "POSIX repository file URL",
      input: "file:///opt/botc/repository/private/repo.ts",
      expected: "<repo-root>/private/repo.ts",
      forbidden: ["/opt/botc", "file:"],
      roots: virtualPosixRoots
    },
    {
      label: "POSIX home file URL",
      input: "file:///home/alice/private/home.ts",
      expected: "<home>/private/home.ts",
      forbidden: ["/home/alice", "file:"],
      roots: virtualPosixRoots
    },
    {
      label: "POSIX temporary file URL",
      input: "file:///tmp/private/temp.ts",
      expected: "<temp>/private/temp.ts",
      forbidden: ["/tmp", "file:"],
      roots: virtualPosixRoots
    },
    {
      label: "runner workspace file URL",
      input: "file:///home/runner/work/project/project/private/runner.ts",
      expected: "<runner-workspace>/private/runner.ts",
      forbidden: ["/home/runner", "project/project", "file:"]
    },
    {
      label: "UNC file URL",
      input: "file://server/share/private/unc.ts:9:10",
      expected: "<unc-path>/unc.ts:9:10",
      forbidden: ["server", "share", "file:"]
    },
    {
      label: "encoded space and non-ASCII file URL",
      input:
        "file:///C:/Users/Alice%20Doe/work/botc/private/encoded%20%E9%92%9F%E6%A5%BC.ts",
      expected: "<repo-root>/private/encoded 钟楼.ts",
      forbidden: ["C:/Users", "Alice", "%20", "%E9", "file:"],
      roots: virtualWindowsRoots
    },
    {
      label: "two file URLs in one message",
      input:
        "first file:///home/alice/private/one.ts then file:///tmp/private/two.ts",
      expected: "first <home>/private/one.ts then <temp>/private/two.ts",
      forbidden: ["/home/alice", "/tmp", "file:"],
      placeholderCount: 2
    }
  ];
  const diagnosticSafetyCases = [
    [
      "repository path",
      `${path.resolve(process.cwd())}${path.sep}private${path.sep}secret.txt:12:3`,
      [path.resolve(process.cwd())],
      ["<repo-root>/private/secret.txt:12:3"]
    ],
    [
      "repository alternate case and separators",
      `${path.resolve(process.cwd()).toUpperCase().replaceAll("\\", "/")}/private/secret.txt`,
      [path.resolve(process.cwd()).toUpperCase().replaceAll("\\", "/")],
      ["<repo-root>/private/secret.txt"]
    ],
    [
      "home path",
      `${path.resolve(homedir())}${path.sep}.ssh${path.sep}id_rsa`,
      [path.resolve(homedir())],
      ["<home>/.ssh/id_rsa"]
    ],
    [
      "temporary path",
      `${path.resolve(tmpdir())}${path.sep}candidate-private.json`,
      [path.resolve(tmpdir())],
      ["<temp>/candidate-private.json"]
    ],
    [
      "POSIX absolute path",
      "/work/private/repository/file.ts",
      ["/work/private"],
      ["<absolute-path>/file.ts"]
    ],
    [
      "POSIX home path",
      "/home/alice/.ssh/id_rsa",
      ["/home/alice"],
      ["<home>/.ssh/id_rsa"]
    ],
    [
      "macOS home path",
      "/Users/alice/Library/private.txt",
      ["/Users/alice"],
      ["<home>/Library/private.txt"]
    ],
    [
      "POSIX temporary path",
      "/tmp/private-candidate.json",
      ["/tmp/private"],
      ["<temp>/private-candidate.json"]
    ],
    [
      "var temporary path",
      "/var/tmp/private-candidate.json",
      ["/var/tmp/private"],
      ["<temp>/private-candidate.json"]
    ],
    [
      "macOS temporary path",
      "/private/tmp/private-candidate.json",
      ["/private/tmp/private"],
      ["<temp>/private-candidate.json"]
    ],
    [
      "GitHub workspace path",
      "/home/runner/work/project/project/private.test.ts",
      ["/home/runner/work"],
      ["<runner-workspace>/private.test.ts"]
    ],
    [
      "other drive path",
      "Z:\\outside\\private\\secret.txt",
      ["Z:\\outside"],
      ["<absolute-path>/secret.txt"]
    ],
    [
      "Windows drive path with spaces and line column",
      "C:\\Users\\Alice Doe\\private\\secret.txt:12:3",
      ["C:\\Users", "Alice Doe", "\\private\\"],
      ["<absolute-path>/secret.txt:12:3"]
    ],
    [
      "Windows mixed path separators case and spaces",
      "c:/USERS\\Alice Doe/Private\\Mixed.File.TS:8",
      ["c:/USERS", "Alice Doe", "/Private"],
      ["<absolute-path>/Mixed.File.TS:8"]
    ],
    [
      "UNC path",
      "\\\\server\\share\\private\\secret.txt",
      ["server", "share"],
      ["<unc-path>/secret.txt"]
    ],
    [
      "UNC path with spaces",
      "\\\\server name\\share name\\private\\secret.txt",
      ["server name", "share name", "\\private\\"],
      ["<unc-path>/secret.txt"]
    ],
    [
      "Windows file URL",
      "file:///C:/Users/alice/private/secret.txt",
      ["C:/Users/alice"],
      ["<absolute-path>/secret.txt"]
    ],
    [
      "Windows file URL with spaces",
      "file:///C:/Users/Alice Doe/private/secret.txt:9:2",
      ["file:///", "C:/Users", "Alice Doe", "/private/"],
      ["<absolute-path>/secret.txt:9:2"]
    ],
    [
      "POSIX file URL",
      "file:///home/alice/private/secret.txt",
      ["/home/alice"],
      ["<home>/private/secret.txt"]
    ],
    [
      "repository file URL",
      `file:///${path.resolve(process.cwd()).replaceAll("\\", "/")}/private/file.ts`,
      [path.resolve(process.cwd()).replaceAll("\\", "/")],
      ["<repo-root>/private/file.ts"]
    ],
    [
      "Bearer token",
      "Bearer bearer-secret-0123456789",
      ["bearer-secret"],
      ["Bearer <redacted-token>"]
    ],
    [
      "GitHub classic token",
      "ghp_abcdefghijklmnopqrstuvwxyz1234",
      ["ghp_"],
      [REDACTED_TOKEN]
    ],
    [
      "GitHub fine-grained token",
      "github_pat_abcdefghijklmnopqrstuvwxyz123456",
      ["github_pat_"],
      [REDACTED_TOKEN]
    ],
    [
      "npm token",
      "npm_abcdefghijklmnopqrstuvwxyz123456",
      ["npm_"],
      [REDACTED_TOKEN]
    ],
    [
      "API token",
      "sk-proj-abcdefghijklmnopqrstuvwxyz123456",
      ["sk-proj-"],
      [REDACTED_TOKEN]
    ],
    [
      "URL userinfo",
      "https://alice:password-secret@example.test/path",
      ["alice", "password-secret"],
      ["https://<redacted-userinfo>@example.test/path"]
    ],
    [
      "sensitive token query",
      "https://example.test/path?view=public&token=query-secret-value",
      ["query-secret-value"],
      ["token=<redacted>"]
    ],
    [
      "sensitive API query",
      "https://example.test/path?api_key=query-api-secret",
      ["query-api-secret"],
      ["api_key=<redacted>"]
    ],
    [
      "compound sensitive query names",
      "https://example.test/safe/path?client_secret=client-value&private-key=private-value&signing_signature=signing-value&authorization_token=authorization-value&view=public",
      [
        "client-value",
        "private-value",
        "signing-value",
        "authorization-value"
      ],
      [
        "https://example.test/safe/path?",
        "client_secret=<redacted>",
        "private-key=<redacted>",
        "signing_signature=<redacted>",
        "authorization_token=<redacted>",
        "view=public"
      ]
    ],
    [
      "compound sensitive query case variants",
      "https://example.test/path?Client-Secret=first-value&AUTHORIZATION_TOKEN=second-value",
      ["first-value", "second-value"],
      ["Client-Secret=<redacted>", "AUTHORIZATION_TOKEN=<redacted>"]
    ],
    [
      "legacy exact sensitive query names remain redacted",
      "https://example.test/path?auth=auth-value&password=password-value&passwd=passwd-value&pwd=pwd-value",
      ["auth-value", "password-value", "passwd-value", "pwd-value"],
      [
        "auth=<redacted>",
        "password=<redacted>",
        "passwd=<redacted>",
        "pwd=<redacted>"
      ]
    ],
    [
      "safe query substrings remain unchanged",
      "https://example.test/safe/path?view=public&monkey=banana&hockey=ice",
      [],
      ["https://example.test/safe/path?view=public&monkey=banana&hockey=ice"]
    ],
    [
      "candidate bytes sentinel",
      "candidateBytes=CANDIDATE_BYTES_SENTINEL_ALPHA",
      ["CANDIDATE_BYTES_SENTINEL_ALPHA"],
      ["candidateBytes=<redacted>"]
    ],
    [
      "baseline bytes sentinel",
      "baselineBytes=BASELINE_BYTES_SENTINEL_BETA",
      ["BASELINE_BYTES_SENTINEL_BETA"],
      ["baselineBytes=<redacted>"]
    ],
    [
      "canonical game secret sentinel",
      "canonicalGameSecret=CANONICAL_GAME_SECRET_SENTINEL_GAMMA",
      ["CANONICAL_GAME_SECRET_SENTINEL_GAMMA"],
      ["canonicalGameSecret=<redacted>"]
    ]
  ];
  let realIntegrationPromise;
  let realIntegrationCollectEntries = 0;
  let realIntegrationPublishedBytes;
  const getRealIntegration = () => {
    realIntegrationPromise ??= executeCandidateLifecycle({
      create: ({ stdout, stderr }) =>
        createVitest(
          "test",
          {
            root: process.cwd(),
            workspace: path.resolve(process.cwd(), "vitest.workspace.ts"),
            run: true,
            watch: false,
            passWithNoTests: false,
            reporters: [],
            color: false
          },
          {},
          { stdout, stderr }
        ),
      collect: async (vitest) => {
        realIntegrationCollectEntries += 1;
        return collectSemanticInventory(vitest, process.cwd());
      },
      validate: (inventory) => inventory,
      encode: (inventory) =>
        candidateBytes(build2B20ACandidate(process.cwd(), inventory)),
      publish: async (bytes) => {
        realIntegrationPublishedBytes = Buffer.from(bytes);
      }
    });
    return realIntegrationPromise;
  };
  await check("23 exact supersession authority and Git provenance pass", async () => {
    if (
      ACCEPTED_AUTHORITY_SUPERSESSIONS.length !== 4 ||
      validateAcceptedAuthoritySupersessionRegistry(
        ACCEPTED_AUTHORITY_SUPERSESSIONS
      ).length !== 4 ||
      validateAcceptedAuthoritySupersessions(process.cwd()).length !== 4
    ) {
      throw new Error("supersession count mismatch");
    }
    const cloneSupersessions = () =>
      JSON.parse(JSON.stringify(ACCEPTED_AUTHORITY_SUPERSESSIONS));
    const extra = cloneSupersessions();
    extra[0].extra = true;
    let rejectedExtra = false;
    try {
      validateAcceptedAuthoritySupersessionRegistry(extra);
    } catch {
      rejectedExtra = true;
    }
    let getterCalls = 0;
    const hostile = cloneSupersessions();
    Object.defineProperty(hostile[0], "rationale", {
      enumerable: true,
      get() {
        getterCalls += 1;
        return "hostile";
      }
    });
    let rejectedGetter = false;
    try {
      validateAcceptedAuthoritySupersessionRegistry(hostile);
    } catch {
      rejectedGetter = true;
    }
    const selfEdge = cloneSupersessions();
    selfEdge[0].successor = {
      contractId: selfEdge[0].predecessor.contractId,
      criterionId: selfEdge[0].predecessor.criterionId,
      ownerProject: selfEdge[0].predecessor.ownerProject,
      file: selfEdge[0].predecessor.file,
      ancestorPath: [...selfEdge[0].predecessor.ancestorPath],
      title: selfEdge[0].predecessor.title
    };
    let rejectedSelfEdge = false;
    try {
      validateAcceptedAuthoritySupersessionRegistry(selfEdge);
    } catch {
      rejectedSelfEdge = true;
    }
    if (
      !rejectedExtra ||
      !rejectedGetter ||
      getterCalls !== 0 ||
      !rejectedSelfEdge
    ) {
      throw new Error("supersession negative validation mismatch");
    }
    const gitRoot = mkdtempSync(path.join(tmpdir(), "2b20ap2-git-authority-"));
    const git = (arguments_, options = {}) => {
      const result = spawnSync("git", arguments_, {
        cwd: gitRoot,
        encoding: "utf8",
        windowsHide: true,
        shell: false,
        ...options
      });
      if (result.error || result.status !== 0) {
        throw new Error(`git fixture failed: ${arguments_.join(" ")}`);
      }
      return result.stdout.trim();
    };
    try {
      git(["init", "--initial-branch=main"]);
      git(["config", "user.name", "BOTC Test"]);
      git(["config", "user.email", "botc-test@example.invalid"]);
      writeFileSync(path.join(gitRoot, "authority.txt"), "accepted\n", "utf8");
      git(["add", "authority.txt"]);
      git(["commit", "-m", "accepted"]);
      const acceptedHead = git(["rev-parse", "HEAD"]);
      const acceptedBlob = git(["rev-parse", `${acceptedHead}:authority.txt`]);
      writeFileSync(path.join(gitRoot, "current.txt"), "current\n", "utf8");
      git(["add", "current.txt"]);
      git(["commit", "-m", "current"]);
      validateAcceptedGitAuthority(
        gitRoot,
        acceptedHead,
        "authority.txt",
        acceptedBlob
      );
      expectCode("SUPERSESSION_ACCEPTED_HISTORY_UNAVAILABLE", () =>
        validateAcceptedGitAuthority(
          gitRoot,
          "f".repeat(40),
          "authority.txt",
          acceptedBlob
        )
      );
      expectCode("SUPERSESSION_ACCEPTED_BLOB_MISMATCH", () =>
        validateAcceptedGitAuthority(
          gitRoot,
          acceptedHead,
          "authority.txt",
          "0".repeat(40)
        )
      );
      const tree = git(["rev-parse", "HEAD^{tree}"]);
      const sibling = git(
        ["commit-tree", tree, "-m", "sibling"],
        { input: "sibling\n" }
      );
      git(["update-ref", "refs/heads/sibling", sibling]);
      git(["switch", "sibling"]);
      expectCode("SUPERSESSION_ACCEPTED_HEAD_NOT_ANCESTOR", () =>
        validateAcceptedGitAuthority(
          gitRoot,
          acceptedHead,
          "authority.txt",
          acceptedBlob
        )
      );
    } finally {
      rmSync(gitRoot, { recursive: true, force: true });
    }
  });
  await check("24 candidate versions and immutable baseline order are exact", async () => {
    if (
      IDENTITY_ENCODING_VERSION !== "vitest-semantic-identity-json-tuple-v1" ||
      ACCEPTED_CONTRACT_BASELINES.map(({ contractId }) => contractId).join(",") !==
        "2B19A3A,2B19A3B1,2B19A3B2,2B19B"
    ) {
      throw new Error("candidate authority mismatch");
    }
  });
  await check("25 structured identity encoding preserves LF and ordinal order", async () => {
    const firstRoot = path.resolve(tmpdir(), "2b20ap1-self-root-a");
    const secondRoot = path.resolve(tmpdir(), "2b20ap1-self-root-b");
    const make = (root) => [
      {
        project: "p",
        file: path.join(root, "b.test.ts"),
        ancestorPath: [],
        title: "line 1\nline 2"
      },
      {
        project: "p",
        file: path.join(root, "a.test.ts"),
        ancestorPath: ["suite"],
        title: "plain"
      }
    ];
    const left = canonicalizeStructuredVitestIdentities(firstRoot, make(firstRoot));
    const right = canonicalizeStructuredVitestIdentities(secondRoot, make(secondRoot));
    const project = (value) =>
      value.map((identity) => [
        identity.project,
        identity.file,
        identity.ancestorPath,
        identity.title
      ]);
    if (JSON.stringify(project(left)) !== JSON.stringify(project(right))) {
      throw new Error("cross-root structured identities differ");
    }
  });
  await check("26 lifecycle group 1 create rejection", async () => {
    let collections = 0;
    let closes = 0;
    let publications = 0;
    const failure = await captureFailure("CREATE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => {
          throw new Error("create actual message");
        },
        collect: async () => {
          collections += 1;
          return [];
        },
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          publications += 1;
        }
      })
    );
    assertDiagnostic(failure.records[0], {
      phase: "CREATING",
      classification: "CREATE_FAILED",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "Error",
      message: "create actual message"
    });
    if (
      DIAGNOSTIC_REDACTION_SCHEMA_VERSION !==
      "vitest-lifecycle-diagnostic-redaction-v1"
    ) {
      throw new Error("diagnostic redaction schema version mismatch");
    }
    for (const fileUrlCase of fileUrlSingleClassificationCases) {
      assertSingleClassifiedFileUrl(fileUrlCase);
    }
    const fileUrlMessageAndStack = new Error(currentRepositoryFileUrl);
    Object.defineProperty(fileUrlMessageAndStack, "stack", {
      configurable: true,
      value: `Error: ${currentRepositoryFileUrl}\nat ${currentTemporaryFileUrl}`
    });
    const fileUrlMessageAndStackSummary = safeDiagnosticMessage(
      fileUrlMessageAndStack
    );
    if (
      (fileUrlMessageAndStackSummary.match(rootPlaceholderPattern) ?? [])
        .length !== 3 ||
      !fileUrlMessageAndStackSummary.includes(
        "<repo-root>/private/repo.ts:1:2"
      ) ||
      !fileUrlMessageAndStackSummary.includes(
        "<temp>/private/temp.ts:5:6"
      ) ||
      fileUrlMessageAndStackSummary.includes("file:") ||
      fileUrlMessageAndStackSummary.includes("<unc-path>/<basename><") ||
      safeDiagnosticMessage(fileUrlMessageAndStackSummary) !==
        fileUrlMessageAndStackSummary
    ) {
      throw new Error(
        "message and stack file URL single-classification mismatch"
      );
    }
    for (const [
      label,
      input,
      forbiddenFragments,
      expectedFragments
    ] of diagnosticSafetyCases) {
      assertSanitized(label, input, forbiddenFragments, expectedFragments);
    }
    const nestedCause = new Error(
      "nested token=nested-cause-secret",
      { cause: null }
    );
    Object.defineProperty(nestedCause, "stack", {
      configurable: true,
      value:
        `nested stack ${path.resolve(process.cwd())}${path.sep}nested.ts\n` +
        "at /home/alice/private/nested.ts\n" +
        "at Z:\\outside\\Alice Doe\\private\\nested.ts"
    });
    const outerError = new Error("outer api_key=outer-secret", {
      cause: nestedCause
    });
    Object.defineProperty(outerError, "stack", {
      configurable: true,
      value:
        "outer stack at \\\\server\\share\\private\\outer.ts\n" +
        "at file:///home/alice/private/outer.ts"
    });
    Object.defineProperty(nestedCause, "cause", {
      configurable: true,
      value: outerError
    });
    const nestedSummary = assertSanitized(
      "nested and cyclic native Error",
      outerError,
      [
        "outer-secret",
        "nested-cause-secret",
        path.resolve(process.cwd()),
        "/home/alice/private",
        "Z:\\outside",
        "Alice Doe",
        "server",
        "share"
      ]
    );
    if (
      !nestedSummary.includes("stack=") ||
      !nestedSummary.includes("cause=") ||
      !nestedSummary.includes("<redacted:cycle>")
    ) {
      throw new Error("native Error stack/cause summary is incomplete");
    }
    assertSanitized(
      "safe primitive native Error cause",
      new Error("outer primitive cause", {
        cause: "Bearer primitive-cause-secret"
      }),
      ["primitive-cause-secret"],
      ["cause=Bearer <redacted-token>"]
    );
    assertSanitized(
      "native Error cause path and compound query",
      new Error("outer cause boundary", {
        cause: new Error(
          "cause at C:\\Users\\Alice Doe\\private\\cause.txt:7:4 " +
            "https://example.test/path?client_secret=cause-query-secret"
        )
      }),
      [
        "C:\\Users",
        "Alice Doe",
        "\\private\\",
        "cause-query-secret"
      ],
      [
        "cause=cause at ",
        "<absolute-path>/cause.txt:7:4",
        "client_secret=<redacted>"
      ]
    );
    let getterCalls = 0;
    const getterError = new Error();
    for (const key of ["name", "message", "stack", "cause"]) {
      Object.defineProperty(getterError, key, {
        configurable: true,
        get() {
          getterCalls += 1;
          return "must-not-read";
        }
      });
    }
    if (
      safeDiagnosticMessage(getterError) !== "" ||
      getterCalls !== 0
    ) {
      throw new Error("native Error diagnostic getter was invoked");
    }
    let proxyTrapCalls = 0;
    const hostileProxy = new Proxy(
      {},
      {
        get() {
          proxyTrapCalls += 1;
          throw new Error("must not get");
        },
        getOwnPropertyDescriptor() {
          proxyTrapCalls += 1;
          throw new Error("must not inspect");
        },
        getPrototypeOf() {
          proxyTrapCalls += 1;
          throw new Error("must not inspect prototype");
        }
      }
    );
    const revoked = Proxy.revocable({}, {});
    revoked.revoke();
    if (
      safeDiagnosticMessage(hostileProxy) !== REDACTED_OPAQUE ||
      safeDiagnosticMessage(revoked.proxy) !== REDACTED_OPAQUE ||
      proxyTrapCalls !== 0
    ) {
      throw new Error("opaque Proxy diagnostic boundary mismatch");
    }
    const unexpectedChunks = [];
    const unexpectedWritable = new Writable({
      write(chunk, _encoding, callback) {
        unexpectedChunks.push(Buffer.from(chunk));
        callback();
      }
    });
    const unexpectedFirst = writeCandidateFailure(
      revoked.proxy,
      unexpectedWritable
    );
    const unexpectedSecond = writeCandidateFailure(
      revoked.proxy,
      new Writable({
        write(_chunk, _encoding, callback) {
          callback();
        }
      })
    );
    if (
      !unexpectedFirst.equals(unexpectedSecond) ||
      !Buffer.concat(unexpectedChunks).equals(unexpectedFirst)
    ) {
      throw new Error("unexpected failure diagnostics are not deterministic");
    }
    assertDiagnostic(parseDiagnosticBytes(unexpectedFirst)[0], {
      phase: "FAILED",
      classification: "UNEXPECTED_CANDIDATE_FAILURE",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "OpaqueFailure",
      message: REDACTED_OPAQUE
    });
    let brandedProxyTrapCalls = 0;
    const brandedProxy = new Proxy(
      new CandidateLifecycleError("MUST_NOT_ESCAPE"),
      {
        get() {
          brandedProxyTrapCalls += 1;
          throw new Error("must not read branded proxy");
        },
        getOwnPropertyDescriptor() {
          brandedProxyTrapCalls += 1;
          throw new Error("must not inspect branded proxy");
        },
        getPrototypeOf() {
          brandedProxyTrapCalls += 1;
          throw new Error("must not inspect branded proxy prototype");
        }
      }
    );
    const brandedProxyBytes = writeCandidateFailure(
      brandedProxy,
      new Writable({
        write(_chunk, _encoding, callback) {
          callback();
        }
      })
    );
    assertDiagnostic(parseDiagnosticBytes(brandedProxyBytes)[0], {
      phase: "FAILED",
      classification: "UNEXPECTED_CANDIDATE_FAILURE",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "OpaqueFailure",
      message: REDACTED_OPAQUE
    });
    if (brandedProxyTrapCalls !== 0) {
      throw new Error("CandidateLifecycleError Proxy trap was invoked");
    }
    if (collections !== 0 || closes !== 0 || publications !== 0) {
      throw new Error("create rejection entered a later lifecycle boundary");
    }
  });
  await check("27 lifecycle group 2 create collect close success", async () => {
    let collectionEntries = 0;
    let closes = 0;
    let publications = 0;
    const clean = await executeCandidateLifecycle({
      create: async () => ({
        close: async () => {
          closes += 1;
        }
      }),
      collect: async () => {
        collectionEntries += 1;
        return [];
      },
      validate: (value) => value,
      encode: async () => Buffer.from("candidate\n"),
      publish: async () => {
        publications += 1;
      }
    });
    let warningPublications = 0;
    const warning = await executeCandidateLifecycle({
      create: async ({ stderr }) => ({
        close: async () => {
          stderr.write("ordinary close warning actual\n");
        }
      }),
      collect: async () => [],
      validate: (value) => value,
      encode: async () => Buffer.from("candidate\n"),
      publish: async () => {
        warningPublications += 1;
      }
    });
    const warningBytes = lifecycleDiagnosticBytes(warning.diagnostics);
    const warningRecords = parseDiagnosticBytes(warningBytes);
    assertDiagnostic(warningRecords[0], {
      phase: "CLOSING",
      classification: "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC",
      source: "PUBLIC_INJECTED_STDERR",
      ordinal: 0,
      name: "PublicStderrRecord",
      message: "ordinary close warning actual"
    });
    const sensitiveWarningText =
      `warning ${path.resolve(process.cwd())}${path.sep}private.test.ts ` +
      "C:\\Users\\Alice Doe\\private\\warning.txt:5:2 " +
      "\\\\server name\\share name\\private\\warning.log " +
      "Bearer warning-secret-0123456789\r\n" +
      "file:///home/alice/private/warning.ts" +
      "?client_secret=query-warning-secret&view=public";
    const sensitiveWarning = await executeCandidateLifecycle({
      create: async ({ stderr }) => ({
        close: async () => {
          stderr.write(sensitiveWarningText);
        }
      }),
      collect: async () => [],
      validate: (value) => value,
      encode: async () => Buffer.from("candidate\n"),
      publish: async () => {}
    });
    const sensitiveWarningBytes = lifecycleDiagnosticBytes(
      sensitiveWarning.diagnostics
    );
    const sensitiveWarningRecords = parseDiagnosticBytes(sensitiveWarningBytes);
    if (
      sensitiveWarningRecords.length !== 1 ||
      sensitiveWarningRecords[0].classification !==
        "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC" ||
      sensitiveWarningRecords[0].message.includes("\r") ||
      sensitiveWarningBytes.includes(Buffer.from("warning-secret")) ||
      sensitiveWarningBytes.includes(Buffer.from("Alice Doe")) ||
      sensitiveWarningBytes.includes(Buffer.from("server name")) ||
      sensitiveWarningBytes.includes(Buffer.from("share name")) ||
      sensitiveWarningBytes.includes(Buffer.from(path.resolve(process.cwd()))) ||
      !sensitiveWarningRecords[0].message.includes(
        "<absolute-path>/warning.txt:5:2"
      ) ||
      !sensitiveWarningRecords[0].message.includes(
        "<unc-path>/warning.log"
      ) ||
      !sensitiveWarningRecords[0].message.includes(
        "client_secret=<redacted>&view=public"
      ) ||
      !sensitiveWarningBytes.equals(
        lifecycleDiagnosticBytes(sensitiveWarning.diagnostics)
      )
    ) {
      throw new Error("sensitive warning diagnostic redaction mismatch");
    }
    if (
      collectionEntries !== 1 ||
      closes !== 1 ||
      publications !== 1 ||
      warningPublications !== 1 ||
      clean.diagnostics.length !== 0
    ) {
      throw new Error("successful lifecycle count mismatch");
    }
  });
  await check("28 lifecycle group 3 collection failure", async () => {
    let closes = 0;
    let publications = 0;
    const failure = await captureFailure("COLLECT_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            closes += 1;
          }
        }),
        collect: async () => {
          throw new Error("collect actual message");
        },
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          publications += 1;
        }
      })
    );
    assertDiagnostic(failure.records[0], {
      phase: "COLLECTING",
      classification: "COLLECT_FAILED",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "Error",
      message: "collect actual message"
    });
    if (closes !== 1 || publications !== 0) {
      throw new Error("collection failure cleanup mismatch");
    }
  });
  await check("29 lifecycle group 4 validation failure", async () => {
    let closes = 0;
    let encodes = 0;
    const failure = await captureFailure("VALIDATE_OR_ENCODE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            closes += 1;
          }
        }),
        collect: async () => [],
        validate: async () => {
          throw new Error("validation actual message");
        },
        encode: async () => {
          encodes += 1;
          return Buffer.from("x");
        },
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    assertDiagnostic(failure.records[0], {
      phase: "VALIDATING_OR_ENCODING",
      classification: "VALIDATE_OR_ENCODE_FAILED",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "Error",
      message: "validation actual message"
    });
    if (closes !== 1 || encodes !== 0) {
      throw new Error("validation failure boundary mismatch");
    }
  });
  await check("30 lifecycle group 5 encoding failure", async () => {
    let closes = 0;
    let validations = 0;
    const failure = await captureFailure("VALIDATE_OR_ENCODE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            closes += 1;
          }
        }),
        collect: async () => [],
        validate: async (value) => {
          validations += 1;
          return value;
        },
        encode: async () => {
          throw new Error("encoding actual message");
        },
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    assertDiagnostic(failure.records[0], {
      phase: "VALIDATING_OR_ENCODING",
      classification: "VALIDATE_OR_ENCODE_FAILED",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "Error",
      message: "encoding actual message"
    });
    if (closes !== 1 || validations !== 1) {
      throw new Error("encoding failure boundary mismatch");
    }
  });
  await check("31 lifecycle group 6 close failure", async () => {
    const rejected = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            throw new Error("close promise actual message");
          }
        }),
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    assertDiagnostic(rejected.records[0], {
      phase: "CLOSING",
      classification: "CLOSE_FAILED",
      source: "PUBLIC_PROMISE_REJECTION",
      ordinal: 0,
      name: "Error",
      message: "close promise actual message"
    });
    const closeCause = new Error("token=close-cause-secret");
    const closeSecretError = new Error("api_key=close-promise-secret", {
      cause: closeCause
    });
    Object.defineProperty(closeSecretError, "stack", {
      configurable: true,
      value:
        `close stack ${path.resolve(homedir())}${path.sep}private.ts\n` +
        "at /home/runner/work/project/project/private.ts"
    });
    const closeSensitive = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            throw closeSecretError;
          }
        }),
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    if (
      closeSensitive.records.length !== 1 ||
      closeSensitive.records[0].name !== "Error" ||
      !closeSensitive.records[0].message.includes("stack=") ||
      !closeSensitive.records[0].message.includes("cause=") ||
      closeSensitive.bytes.includes(Buffer.from("close-promise-secret")) ||
      closeSensitive.bytes.includes(Buffer.from("close-cause-secret")) ||
      closeSensitive.bytes.includes(Buffer.from(path.resolve(homedir())))
    ) {
      throw new Error("close Promise diagnostic redaction mismatch");
    }
    const sentinel = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr }) => ({
          close: async () => {
            stderr.write("error during close sentinel actual\r\n");
          }
        }),
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    assertDiagnostic(sentinel.records[0], {
      phase: "CLOSING",
      classification: "CLOSE_FAILED",
      source: "PUBLIC_INJECTED_STDERR",
      ordinal: 0,
      name: "PublicStderrRecord",
      message: "error during close sentinel actual"
    });
    const sensitiveSentinelText =
      "error during close at \\\\server name\\share name\\private\\close.ts " +
      "https://example.test/path?signing_signature=close-query-secret " +
      "github_pat_abcdefghijklmnopqrstuvwxyz123456";
    const sensitiveSentinel = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr }) => ({
          close: async () => {
            stderr.write(sensitiveSentinelText);
          }
        }),
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    if (
      sensitiveSentinel.records.length !== 1 ||
      sensitiveSentinel.records[0].source !== "PUBLIC_INJECTED_STDERR" ||
      sensitiveSentinel.bytes.includes(Buffer.from("server name")) ||
      sensitiveSentinel.bytes.includes(Buffer.from("share name")) ||
      sensitiveSentinel.bytes.includes(Buffer.from("close-query-secret")) ||
      sensitiveSentinel.bytes.includes(Buffer.from("github_pat_")) ||
      !sensitiveSentinel.records[0].message.includes("<unc-path>/close.ts") ||
      !sensitiveSentinel.records[0].message.includes(
        "signing_signature=<redacted>"
      )
    ) {
      throw new Error("close stderr diagnostic redaction mismatch");
    }
    const invalid = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr }) => ({
          close: async () => {
            stderr.write(Buffer.from([0xff]));
          }
        }),
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    assertDiagnostic(invalid.records[0], {
      phase: "CLOSING",
      classification: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID",
      source: "PUBLIC_INJECTED_STDERR_CAPTURE",
      ordinal: 0,
      name: "PublicStderrCapture",
      message: "CLOSE_DIAGNOSTIC_CAPTURE_INVALID"
    });
    const boundary = classifyClosingCapture([
      {
        ordinal: 0,
        phase: "CLOSING",
        bytes: Buffer.from("prefix error during close"),
        encoding: "utf8",
        sha256: ""
      },
      {
        ordinal: 1,
        phase: "CLOSING",
        bytes: Buffer.from("Error during close"),
        encoding: "utf8",
        sha256: ""
      },
      {
        ordinal: 2,
        phase: "CLOSING",
        bytes: Buffer.from("error during close\tcause"),
        encoding: "utf8",
        sha256: ""
      }
    ]);
    if (
      boundary[0].classification !== "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC" ||
      boundary[1].classification !== "CLOSE_STDERR_NON_ERROR_DIAGNOSTIC" ||
      boundary[2].classification !== "CLOSE_FAILED"
    ) {
      throw new Error("close sentinel classifier mismatch");
    }
  });
  await check("32 lifecycle group 7 primary plus close failure", async () => {
    const promise = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => ({
          close: async () => {
            throw new Error("close rejection after primary");
          }
        }),
        collect: async () => {
          throw new Error("primary collection");
        },
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    if (
      promise.records.map(({ classification }) => classification).join(",") !==
        "COLLECT_FAILED,CLOSE_FAILED" ||
      promise.records.map(({ source }) => source).join(",") !==
        "PUBLIC_PROMISE_REJECTION,PUBLIC_PROMISE_REJECTION"
    ) {
      throw new Error("primary plus close Promise diagnostics mismatch");
    }
    const stderr = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr: publicStderr }) => ({
          close: async () => {
            publicStderr.write("error during close after encoding");
          }
        }),
        collect: async () => [],
        validate: (value) => value,
        encode: async () => {
          throw new Error("primary encoding");
        },
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    if (
      stderr.records.map(({ classification }) => classification).join(",") !==
        "VALIDATE_OR_ENCODE_FAILED,CLOSE_FAILED" ||
      stderr.records.map(({ source }) => source).join(",") !==
        "PUBLIC_PROMISE_REJECTION,PUBLIC_INJECTED_STDERR"
    ) {
      throw new Error("primary plus close stderr diagnostics mismatch");
    }
    const both = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr: publicStderr }) => ({
          close: async () => {
            publicStderr.write("error during close both");
            throw new Error("close rejection both");
          }
        }),
        collect: async () => {
          throw new Error("primary both");
        },
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    if (
      both.records.map(({ classification }) => classification).join(",") !==
        "COLLECT_FAILED,CLOSE_FAILED,CLOSE_FAILED" ||
      both.records.map(({ ordinal }) => ordinal).join(",") !== "0,0,0"
    ) {
      throw new Error("primary plus both close channels mismatch");
    }
    const sensitiveCombined = await captureFailure("CLOSE_FAILED", () =>
      executeCandidateLifecycle({
        create: async ({ stderr: publicStderr }) => ({
          close: async () => {
            publicStderr.write(
              "error during close file:///home/alice/private/close.ts " +
                "npm_abcdefghijklmnopqrstuvwxyz123456"
            );
            throw new Error("token=combined-close-secret");
          }
        }),
        collect: async () => {
          throw new Error(
            `candidateBytes=CANDIDATE_BYTES_SENTINEL_PRIMARY at ` +
              `${path.resolve(process.cwd())}${path.sep}primary.ts`
          );
        },
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {
          throw new Error("must not publish");
        }
      })
    );
    for (const forbidden of [
      "CANDIDATE_BYTES_SENTINEL_PRIMARY",
      path.resolve(process.cwd()),
      "/home/alice/private",
      "npm_",
      "combined-close-secret"
    ]) {
      if (sensitiveCombined.bytes.toString("utf8").includes(forbidden)) {
        throw new Error("combined primary/close diagnostics retained sensitive data");
      }
    }
  });
  await check("33 lifecycle group 8 atomic candidate write failure", async () => {
    const bytes = Buffer.from("atomic candidate\n");
    for (const failureStage of ["write", "close", "rename"]) {
      const root = mkdtempSync(
        path.join(tmpdir(), `2b20ap1-${failureStage}-self-test-`)
      );
      const destination = path.join(root, "candidate.json");
      const temporary = path.join(root, ".candidate.json.2b20ap1.tmp");
      let closeInjectionPending = failureStage === "close";
      const operations = {
        exists: existsSync,
        open: openSync,
        write(descriptor, source, offset, length) {
          if (failureStage === "write") throw new Error("injected write");
          return writeSync(descriptor, source, offset, length);
        },
        fsync: fsyncSync,
        close(descriptor) {
          if (closeInjectionPending) {
            closeInjectionPending = false;
            closeSync(descriptor);
            throw new Error("injected close");
          }
          closeSync(descriptor);
        },
        rename(source, target) {
          if (failureStage === "rename") throw new Error("injected rename");
          renameSync(source, target);
        },
        unlink: unlinkSync
      };
      try {
        await expectLifecycleCode("PUBLISH_FAILED", async () =>
          publishCandidateAtomically(destination, bytes, operations)
        );
        if (existsSync(destination) || existsSync(temporary)) {
          throw new Error(`${failureStage} exposed a partial candidate`);
        }
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    }
  });
  await check("34 lifecycle group 9 deterministic repetition", async () => {
    const generate = async () => {
      let published;
      const result = await executeCandidateLifecycle({
        create: async () => ({ close: async () => {} }),
        collect: async () => ["stable"],
        validate: (value) => value,
        encode: async (value) =>
          candidateBytes({ schemaVersion: "self-test", value }),
        publish: async (bytes) => {
          published = Buffer.from(bytes);
        }
      });
      if (!result.bytes.equals(published)) {
        throw new Error("generated and published bytes differ");
      }
      return result.bytes;
    };
    const first = await generate();
    const second = await generate();
    const firstFailure = await captureFailure("CREATE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => {
          throw new Error("stable diagnostic");
        },
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {}
      })
    );
    const secondFailure = await captureFailure("CREATE_FAILED", () =>
      executeCandidateLifecycle({
        create: async () => {
          throw new Error("stable diagnostic");
        },
        collect: async () => [],
        validate: (value) => value,
        encode: async () => Buffer.from("x"),
        publish: async () => {}
      })
    );
    const deterministicCause = new Error("token=deterministic-cause-secret");
    const deterministicError = new Error(
      "candidateBytes=CANDIDATE_BYTES_DETERMINISTIC_SECRET",
      { cause: deterministicCause }
    );
    Object.defineProperty(deterministicError, "stack", {
      configurable: true,
      value:
        `deterministic stack ${path.resolve(process.cwd())}${path.sep}one.ts\n` +
        "at /home/runner/work/project/project/two.ts\n" +
        "at \\\\server\\share\\three.ts"
    });
    Object.defineProperty(deterministicCause, "cause", {
      configurable: true,
      value: deterministicError
    });
    const deterministicFailure = async () =>
      captureFailure("CREATE_FAILED", () =>
        executeCandidateLifecycle({
          create: async () => {
            throw deterministicError;
          },
          collect: async () => [],
          validate: (value) => value,
          encode: async () => Buffer.from("x"),
          publish: async () => {}
        })
      );
    const firstDeterministicFailure = await deterministicFailure();
    const secondDeterministicFailure = await deterministicFailure();
    if (
      !first.equals(second) ||
      !firstFailure.bytes.equals(secondFailure.bytes) ||
      !firstDeterministicFailure.bytes.equals(secondDeterministicFailure.bytes)
    ) {
      throw new Error("repeated candidate or diagnostic bytes differ");
    }
  });
  await check("35 lifecycle group 10 authoritative wrapper entry", async () => {
    let wrapperEntries = 0;
    await executeCandidateLifecycle({
      create: async () => ({ close: async () => {} }),
      collect: async () => {
        wrapperEntries += 1;
        return [];
      },
      validate: (value) => value,
      encode: async () => Buffer.from("x"),
      publish: async () => {}
    });
    const publicOnlyPending = {
      result() {
        return { state: "pending", errors: undefined };
      }
    };
    if (
      wrapperEntries !== 1 ||
      "task" in publicOnlyPending ||
      assertPublicPendingTestCase(publicOnlyPending).state !== "pending"
    ) {
      throw new Error("public wrapper-entry or pending result mismatch");
    }
    const invalidCases = [
      { result: undefined },
      { result: "not a function" },
      { result: () => { throw new Error("result failure"); } },
      { result: () => ({ state: "passed" }) },
      { result: () => ({ state: "failed" }) },
      { result: () => ({ state: "skipped" }) }
    ];
    for (const testCase of invalidCases) {
      await expectLifecycleCode(
        "VITEST_STRUCTURED_IDENTITY_SOURCE_UNAVAILABLE",
        async () => assertPublicPendingTestCase(testCase)
      );
    }
    const privateAccessToken = [".", "task"].join("");
    if (
      collectSemanticInventory.toString().includes(privateAccessToken) ||
      assertPublicPendingTestCase.toString().includes(privateAccessToken)
    ) {
      throw new Error("candidate collection reads a private TestCase field");
    }
  });
  await check("36 lifecycle group 11 real Vitest 1572 and 12 LF", async () => {
    const result = await getRealIntegration();
    const candidate = JSON.parse(result.bytes.toString("utf8"));
    if (
      candidate.structuredIdentityCount !== 1572 ||
      candidate.lfIdentityCount !== 12 ||
      candidate.structuredIdentities.filter((tuple) =>
        tuple[3].includes("\n")
      ).length !== 12 ||
      createHash("sha256").update(result.bytes).digest("hex") !==
        "d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129" ||
      candidate.inventorySha256 !==
        "58bd4b6959c1f234ac74b90b1188cccf08ebeb5bdfaecdebd900e49d69a0e1b8" ||
      !result.bytes.equals(realIntegrationPublishedBytes)
    ) {
      throw new Error("real structured inventory mismatch");
    }
  });
  await check("37 lifecycle group 12 real public close and natural exit", async () => {
    const result = await getRealIntegration();
    if (
      realIntegrationCollectEntries !== 1 ||
      result.closeInvocationCount !== 1 ||
      result.closingRecords.length !== 0 ||
      result.closeNonErrors.length !== 0 ||
      result.diagnostics.length !== 0
    ) {
      throw new Error("real public close integration mismatch");
    }
  });
  process.stdout.write(
    `${JSON.stringify(
      {
        verdict: "OWNERSHIP_CONTRACT_SELF_TEST_PASS",
        checksPassed: results.length,
        checksExpected: 37,
        checks: results
      },
      null,
      2
    )}\n`
  );
}

try {
  const argv = process.argv.slice(2);
  if (argv.length === 1 && argv[0] === "--self-test") {
    await runCompleteSelfTest();
  } else {
    await runCandidateCommand(parseCandidateArguments(argv));
  }
} catch (error) {
  writeCandidateFailure(error);
  process.exitCode = 1;
}
