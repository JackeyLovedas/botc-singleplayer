import type {
  AnyDomainEventEnvelope,
  DomainEventType
} from "./events.js";

export type StructurallyValidatedDomainEventToken = object;

export type DomainEventPayloadBranchId = string;
export type DomainEventPayloadSchemaIdentity = string;

export type DomainEventStructuralDiagnosticCode =
  | "C1_AUTHORITY_UNHEALTHY"
  | "CAPTURE_REJECTED"
  | "INVALID_CAPTURE_TOKEN"
  | "INVALID_ENVELOPE"
  | "MISSING_REQUIRED_FIELD"
  | "EXTRA_FIELD"
  | "INVALID_FIELD_TYPE"
  | "INVALID_FIELD_VALUE"
  | "UNKNOWN_EVENT_TYPE"
  | "UNSUPPORTED_EVENT_VERSION"
  | "INVALID_PAYLOAD_DISCRIMINANT"
  | "INVALID_PAYLOAD_BRANCH"
  | "INVALID_AST_NODE"
  | "INVALID_REFINEMENT"
  | "INVALID_PAYLOAD_STRUCTURE"
  | "AMBIGUOUS_UNION"
  | "VALIDATED_BACKING_CONSTRUCTION_FAILED"
  | "INVALID_STRUCTURAL_TOKEN"
  | "INTERNAL_STRUCTURAL_VALIDATION_FAILURE";

export type DomainEventStructuralDiagnosticPhase =
  | "AUTHORITY_ADMISSION"
  | "CAPTURE"
  | "BACKING_AUTHENTICATION"
  | "ENVELOPE"
  | "EVENT_DISPATCH"
  | "VERSION_DISPATCH"
  | "PAYLOAD_DISCRIMINANT"
  | "PAYLOAD_ACQUISITION"
  | "AST_TRAVERSAL"
  | "BACKING_CONSTRUCTION"
  | "TOKEN_ISSUE"
  | "TOKEN_CONSUMPTION"
  | "INTERNAL";

export type DomainEventStructuralSafeSummary =
  | "AUTHORITY_UNAVAILABLE"
  | "INPUT_CAPTURE_FAILED"
  | "CAPTURE_TOKEN_REJECTED"
  | "ENVELOPE_REJECTED"
  | "EVENT_TYPE_REJECTED"
  | "EVENT_VERSION_REJECTED"
  | "PAYLOAD_DISCRIMINANT_REJECTED"
  | "PAYLOAD_BRANCH_REJECTED"
  | "AMBIGUOUS_BRANCH"
  | "PAYLOAD_REJECTED"
  | "BACKING_CONSTRUCTION_FAILED"
  | "STRUCTURAL_TOKEN_REJECTED"
  | "INTERNAL_FAILURE";

export type DomainEventStructuralRetryability =
  | "NEVER"
  | "AFTER_INPUT_CORRECTION"
  | "AFTER_PROCESS_RESTART";

export type DomainEventStructuralPathSegment =
  | {
      readonly kind: "CAPTURE_ARRAY_INDEX";
      readonly index: number;
    }
  | {
      readonly kind: "CAPTURE_OBJECT_KEY_ORDINAL";
      readonly ordinal: number;
    }
  | {
      readonly kind: "ENVELOPE_FIELD_ORDINAL";
      readonly ordinal: number;
    }
  | {
      readonly kind: "ENVELOPE_EXTRA_ENTRY_ORDINAL";
      readonly ordinal: number;
    }
  | {
      readonly kind: "PAYLOAD_DISCRIMINANT_ORDINAL";
      readonly ordinal: number;
    }
  | {
      readonly kind: "PAYLOAD_FIELD_ORDINAL";
      readonly ordinal: number;
    }
  | {
      readonly kind: "PAYLOAD_EXTRA_ENTRY_ORDINAL";
      readonly ordinal: number;
    }
  | {
      readonly kind: "ARRAY_INDEX";
      readonly index: number;
    }
  | {
      readonly kind: "TUPLE_INDEX";
      readonly index: number;
    }
  | {
      readonly kind: "UNION_BRANCH_ORDINAL";
      readonly ordinal: number;
    }
  | {
      readonly kind: "TRUNCATED";
    };

export type DomainEventStructuralDiagnostic = {
  readonly code: DomainEventStructuralDiagnosticCode;
  readonly phase: DomainEventStructuralDiagnosticPhase;
  readonly path: readonly DomainEventStructuralPathSegment[];
  readonly safeSummary: DomainEventStructuralSafeSummary;
  readonly quarantineRecommended: boolean;
  readonly retryability: DomainEventStructuralRetryability;
  readonly failClosed: true;
};

export type DomainEventStructuralValidationResult =
  | {
      readonly ok: true;
      readonly structuralStatus: "STRUCTURALLY_VALIDATED_DOMAIN_EVENT";
      readonly semanticStatus: "NOT_SEMANTICALLY_ACCEPTED";
      readonly token: StructurallyValidatedDomainEventToken;
      readonly eventType: DomainEventType;
      readonly eventVersion: 1;
      readonly payloadBranchId: DomainEventPayloadBranchId;
      readonly payloadSchemaIdentity: DomainEventPayloadSchemaIdentity;
    }
  | {
      readonly ok: false;
      readonly diagnostic: DomainEventStructuralDiagnostic;
    };

export type InternalValidatedDomainEvent = {
  readonly eventType: DomainEventType;
  readonly eventVersion: 1;
  readonly payloadBranchId: string;
  readonly payloadSchemaIdentity: string;
  readonly event: AnyDomainEventEnvelope;
};

export type ReadStructurallyValidatedDomainEventResult =
  | {
      readonly ok: true;
      readonly value: InternalValidatedDomainEvent;
    }
  | {
      readonly ok: false;
      readonly diagnostic: DomainEventStructuralDiagnostic;
    };

export const DOMAIN_EVENT_STRUCTURAL_FAILURE_CONTEXT_IDS = Object.freeze([
  "F01",
  "F02",
  "F03",
  "F04",
  "F05",
  "F06",
  "F07",
  "F08",
  "F09",
  "F10",
  "F11",
  "F12",
  "F13",
  "F14",
  "F15",
  "F16",
  "F17",
  "F18",
  "F19",
  "F20",
  "F21",
  "F22",
  "F23",
  "F24",
  "F25",
  "F26",
  "F27",
  "F28",
  "F29",
  "F30",
  "F31",
  "F32",
  "F33",
  "F34"
] as const);

export type DomainEventStructuralFailureContextId =
  (typeof DOMAIN_EVENT_STRUCTURAL_FAILURE_CONTEXT_IDS)[number];

export type DomainEventStructuralDiagnosticPolicy = {
  readonly contextId: DomainEventStructuralFailureContextId;
  readonly code: DomainEventStructuralDiagnosticCode;
  readonly phase: DomainEventStructuralDiagnosticPhase;
  readonly safeSummary: DomainEventStructuralSafeSummary;
  readonly quarantineRecommended: boolean;
  readonly retryability: DomainEventStructuralRetryability;
  readonly directBranchBinding: string;
};

const policy = (
  contextId: DomainEventStructuralFailureContextId,
  code: DomainEventStructuralDiagnosticCode,
  phase: DomainEventStructuralDiagnosticPhase,
  safeSummary: DomainEventStructuralSafeSummary,
  quarantineRecommended: boolean,
  retryability: DomainEventStructuralRetryability,
  directBranchBinding: string
): DomainEventStructuralDiagnosticPolicy =>
  Object.freeze({
    contextId,
    code,
    phase,
    safeSummary,
    quarantineRecommended,
    retryability,
    directBranchBinding
  });

export const DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY_TUPLE = Object.freeze([
  policy("F01", "C1_AUTHORITY_UNHEALTHY", "AUTHORITY_ADMISSION", "AUTHORITY_UNAVAILABLE", true, "AFTER_PROCESS_RESTART", "admit-authority"),
  policy("F02", "CAPTURE_REJECTED", "CAPTURE", "INPUT_CAPTURE_FAILED", false, "AFTER_INPUT_CORRECTION", "translate-correctable-capture"),
  policy("F03", "CAPTURE_REJECTED", "CAPTURE", "INPUT_CAPTURE_FAILED", true, "AFTER_INPUT_CORRECTION", "translate-hostile-capture"),
  policy("F04", "CAPTURE_REJECTED", "CAPTURE", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "translate-internal-capture"),
  policy("F05", "INVALID_CAPTURE_TOKEN", "BACKING_AUTHENTICATION", "CAPTURE_TOKEN_REJECTED", true, "NEVER", "authenticate-capture-token"),
  policy("F06", "INTERNAL_STRUCTURAL_VALIDATION_FAILURE", "BACKING_AUTHENTICATION", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "read-capture-backing"),
  policy("F07", "INVALID_ENVELOPE", "ENVELOPE", "ENVELOPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "require-envelope-object"),
  policy("F08", "MISSING_REQUIRED_FIELD", "ENVELOPE", "ENVELOPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "require-envelope-field"),
  policy("F09", "EXTRA_FIELD", "ENVELOPE", "ENVELOPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "reject-envelope-extra"),
  policy("F10", "INVALID_FIELD_TYPE", "ENVELOPE", "ENVELOPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-envelope-kind"),
  policy("F11", "INVALID_FIELD_VALUE", "ENVELOPE", "ENVELOPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-envelope-value"),
  policy("F12", "UNKNOWN_EVENT_TYPE", "EVENT_DISPATCH", "EVENT_TYPE_REJECTED", false, "AFTER_INPUT_CORRECTION", "lookup-event-type"),
  policy("F13", "UNSUPPORTED_EVENT_VERSION", "VERSION_DISPATCH", "EVENT_VERSION_REJECTED", false, "NEVER", "validate-envelope-version"),
  policy("F14", "INVALID_FIELD_TYPE", "PAYLOAD_ACQUISITION", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "require-payload-object"),
  policy("F15", "INVALID_PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT_REJECTED", false, "AFTER_INPUT_CORRECTION", "require-discriminator"),
  policy("F16", "INVALID_PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-discriminator-kind"),
  policy("F17", "INVALID_PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT", "PAYLOAD_DISCRIMINANT_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-discriminator-literal"),
  policy("F18", "INVALID_PAYLOAD_BRANCH", "PAYLOAD_DISCRIMINANT", "PAYLOAD_BRANCH_REJECTED", false, "AFTER_INPUT_CORRECTION", "reject-zero-branch"),
  policy("F19", "INVALID_PAYLOAD_BRANCH", "PAYLOAD_DISCRIMINANT", "AMBIGUOUS_BRANCH", true, "NEVER", "reject-multiple-branches"),
  policy("F20", "INVALID_AST_NODE", "INTERNAL", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "resolve-ast-node"),
  policy("F21", "MISSING_REQUIRED_FIELD", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "require-ast-field"),
  policy("F22", "EXTRA_FIELD", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "reject-ast-extra"),
  policy("F23", "INVALID_FIELD_TYPE", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-ast-kind"),
  policy("F24", "INVALID_FIELD_VALUE", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-ast-literal"),
  policy("F25", "INVALID_PAYLOAD_STRUCTURE", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "validate-cardinality"),
  policy("F26", "INVALID_PAYLOAD_STRUCTURE", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "select-tagged-union"),
  policy("F27", "INVALID_PAYLOAD_STRUCTURE", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "reject-zero-union-match"),
  policy("F28", "AMBIGUOUS_UNION", "AST_TRAVERSAL", "PAYLOAD_REJECTED", true, "NEVER", "reject-multiple-union-match"),
  policy("F29", "INVALID_REFINEMENT", "AST_TRAVERSAL", "PAYLOAD_REJECTED", false, "AFTER_INPUT_CORRECTION", "apply-refinement-predicate"),
  policy("F30", "INVALID_REFINEMENT", "INTERNAL", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "validate-refinement-metadata"),
  policy("F31", "VALIDATED_BACKING_CONSTRUCTION_FAILED", "BACKING_CONSTRUCTION", "BACKING_CONSTRUCTION_FAILED", true, "AFTER_PROCESS_RESTART", "construct-detached-backing"),
  policy("F32", "INTERNAL_STRUCTURAL_VALIDATION_FAILURE", "TOKEN_ISSUE", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "issue-structural-token"),
  policy("F33", "INVALID_STRUCTURAL_TOKEN", "TOKEN_CONSUMPTION", "STRUCTURAL_TOKEN_REJECTED", true, "NEVER", "consume-structural-token"),
  policy("F34", "INTERNAL_STRUCTURAL_VALIDATION_FAILURE", "INTERNAL", "INTERNAL_FAILURE", true, "AFTER_PROCESS_RESTART", "contain-internal-failure")
] as const);

const diagnosticPolicyRecord = Object.create(null) as Record<
  DomainEventStructuralFailureContextId,
  DomainEventStructuralDiagnosticPolicy
>;
for (const entry of DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY_TUPLE) {
  diagnosticPolicyRecord[entry.contextId] = entry;
}
export const DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY = Object.freeze(
  diagnosticPolicyRecord
);

const MAX_PATH_SEGMENTS = 32;

export const boundDomainEventStructuralPath = (
  path: readonly DomainEventStructuralPathSegment[]
): readonly DomainEventStructuralPathSegment[] => {
  if (path.length <= MAX_PATH_SEGMENTS) {
    return Object.freeze(path.map((segment) => Object.freeze({ ...segment })));
  }
  return Object.freeze([
    ...path.slice(0, MAX_PATH_SEGMENTS - 1).map((segment) =>
      Object.freeze({ ...segment })
    ),
    Object.freeze({ kind: "TRUNCATED" as const })
  ]);
};

export const createDomainEventStructuralDiagnostic = (
  contextId: DomainEventStructuralFailureContextId,
  path: readonly DomainEventStructuralPathSegment[] = []
): DomainEventStructuralDiagnostic => {
  const selected = DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY[contextId];
  return Object.freeze({
    code: selected.code,
    phase: selected.phase,
    path: boundDomainEventStructuralPath(path),
    safeSummary: selected.safeSummary,
    quarantineRecommended: selected.quarantineRecommended,
    retryability: selected.retryability,
    failClosed: true as const
  });
};

const issuedStructuralTokens = new WeakSet<object>();
const structuralBackings = new WeakMap<object, InternalValidatedDomainEvent>();

export type IssueStructurallyValidatedDomainEventResult =
  | {
      readonly ok: true;
      readonly token: StructurallyValidatedDomainEventToken;
    }
  | {
      readonly ok: false;
      readonly diagnostic: DomainEventStructuralDiagnostic;
    };

export const issueStructurallyValidatedDomainEvent = (
  value: InternalValidatedDomainEvent
): IssueStructurallyValidatedDomainEventResult => {
  try {
    const token = Object.freeze(Object.create(null) as object);
    structuralBackings.set(token, value);
    issuedStructuralTokens.add(token);
    return Object.freeze({ ok: true as const, token });
  } catch {
    return Object.freeze({
      ok: false as const,
      diagnostic: createDomainEventStructuralDiagnostic("F32")
    });
  }
};

export const readStructurallyValidatedDomainEvent = (
  token: unknown
): ReadStructurallyValidatedDomainEventResult => {
  if (
    typeof token !== "object" ||
    token === null ||
    !issuedStructuralTokens.has(token)
  ) {
    return Object.freeze({
      ok: false as const,
      diagnostic: createDomainEventStructuralDiagnostic("F33")
    });
  }
  const value = structuralBackings.get(token);
  if (value === undefined) {
    return Object.freeze({
      ok: false as const,
      diagnostic: createDomainEventStructuralDiagnostic("F33")
    });
  }
  return Object.freeze({ ok: true as const, value });
};
