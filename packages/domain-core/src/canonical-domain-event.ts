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

export type TaggedUnionFieldCoordinateV1 = {
  readonly containerPath: readonly DomainEventStructuralPathSegment[];
  readonly canonicalObjectEntryOrdinal: number;
};

export type TaggedUnionCoordinateV1 =
  | {
      readonly eventBranchOrdinal: number;
      readonly astNodeOrdinal: number;
      readonly taggedUnionPath: readonly DomainEventStructuralPathSegment[];
      readonly field: null;
      readonly state: "MISSING_DISCRIMINANT";
    }
  | {
      readonly eventBranchOrdinal: number;
      readonly astNodeOrdinal: number;
      readonly taggedUnionPath: readonly DomainEventStructuralPathSegment[];
      readonly field: TaggedUnionFieldCoordinateV1;
      readonly state: "INVALID_DISCRIMINANT_TYPE";
    }
  | {
      readonly eventBranchOrdinal: number;
      readonly astNodeOrdinal: number;
      readonly taggedUnionPath: readonly DomainEventStructuralPathSegment[];
      readonly field: TaggedUnionFieldCoordinateV1;
      readonly state: "UNKNOWN_DISCRIMINANT_VALUE";
    }
  | {
      readonly eventBranchOrdinal: number;
      readonly astNodeOrdinal: number;
      readonly taggedUnionPath: readonly DomainEventStructuralPathSegment[];
      readonly field: TaggedUnionFieldCoordinateV1;
      readonly state: "KNOWN_VARIANT";
      readonly taggedVariantOrdinal: number;
    };

export type DomainEventStructuralDiagnostic = {
  readonly code: DomainEventStructuralDiagnosticCode;
  readonly phase: DomainEventStructuralDiagnosticPhase;
  readonly path: readonly DomainEventStructuralPathSegment[];
  readonly safeSummary: DomainEventStructuralSafeSummary;
  readonly quarantineRecommended: boolean;
  readonly retryability: DomainEventStructuralRetryability;
  readonly taggedUnionCoordinate: TaggedUnionCoordinateV1 | null;
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

export const DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_IDS = Object.freeze([
  "L01_F01_AUTHORITY_UNHEALTHY", "L02_F02_CAPTURE_CORRECTABLE", "L03_F03_CAPTURE_HOSTILE",
  "L04_F04_CAPTURE_INTERNAL", "L05_F05_CAPTURE_TOKEN_INVALID", "L06_F06_CAPTURE_BACKING_MISSING",
  "L07_F07_ENVELOPE_NOT_OBJECT", "L08_F08_ENVELOPE_FIELD_MISSING", "L09_F09_ENVELOPE_FIELD_EXTRA",
  "L10_F10_ENVELOPE_FIELD_WRONG_KIND", "L11_F11_ENVELOPE_FIELD_INVALID_VALUE", "L12_F12_EVENT_TYPE_UNKNOWN",
  "L13_F13_EVENT_VERSION_UNSUPPORTED", "L14_F14_PAYLOAD_NOT_OBJECT", "L15_F15_ROOT_DISCRIMINATOR_MISSING",
  "L16_F16_ROOT_DISCRIMINATOR_WRONG_KIND", "L17_F17_ROOT_DISCRIMINATOR_UNKNOWN", "L18_F18_ROOT_SELECTION_ZERO",
  "L19_F19_ROOT_SELECTION_MULTIPLE", "L20_F20_AST_NODE_LOOKUP_MISSING", "L21_F20_AST_NODE_ORDINAL_LOOKUP_MISSING",
  "L22_F20_EVENT_BRANCH_ORDINAL_INVALID", "L23_F20_TAGGED_VARIANT_ORDINAL_INVALID",
  "L24_F20_TAGGED_FIELD_COORDINATE_INVARIANT", "L25_F20_TAGGED_MULTIPLE_LITERAL_MATCH",
  "L26_F21_RECORD_MISSING_PLAIN", "L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT",
  "L28_F22_RECORD_EXTRA_PLAIN", "L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT",
  "L30_F23_KIND_MISMATCH_PLAIN", "L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT",
  "L32_F24_LITERAL_MISMATCH_PLAIN", "L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT",
  "L34_F25_CARDINALITY_MISMATCH_PLAIN", "L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT",
  "L36_F26_TAGGED_DISCRIMINATOR_MISSING", "L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND",
  "L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN", "L39_F27_CLOSED_UNION_ZERO_MATCH",
  "L40_F28_CLOSED_UNION_MULTIPLE_MATCH", "L41_F29_REFINEMENT_REJECTED_PLAIN",
  "L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT", "L43_F30_REFINEMENT_METADATA_INVALID",
  "L44_F31_BACKING_CONSTRUCTION_FAILED", "L45_F32_TOKEN_ISSUE_FAILED", "L46_F33_TOKEN_INVALID",
  "L47_F34_INTERNAL_CONTAINMENT"
] as const);

export type DomainEventStructuralDiagnosticLeafIdV1 =
  (typeof DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_IDS)[number];

export type DomainEventStructuralDiagnosticEvidenceKind =
  | "CALLABLE_PRIMARY_TEST"
  | "STATIC_BRANCH_BINDING";

export type DomainEventStructuralTaggedCoordinatePolicy =
  | "NULL"
  | "MISSING_DISCRIMINANT"
  | "INVALID_DISCRIMINANT_TYPE"
  | "UNKNOWN_DISCRIMINANT_VALUE"
  | "KNOWN_VARIANT_STACK_LOCAL";

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

export type DomainEventStructuralDiagnosticLeafPolicyV1 = {
  readonly leafId: DomainEventStructuralDiagnosticLeafIdV1;
  readonly publicContextId: DomainEventStructuralFailureContextId;
  readonly triggerCondition: string;
  readonly code: DomainEventStructuralDiagnosticCode;
  readonly phase: DomainEventStructuralDiagnosticPhase;
  readonly pathPolicy: string;
  readonly safeSummary: DomainEventStructuralSafeSummary;
  readonly quarantineRecommended: boolean;
  readonly retryability: DomainEventStructuralRetryability;
  readonly payloadReadBudget: string;
  readonly evidenceKind: DomainEventStructuralDiagnosticEvidenceKind;
  readonly taggedCoordinatePolicy: DomainEventStructuralTaggedCoordinatePolicy;
  readonly exactSourceBinding: string;
};

const leafPolicy = (
  leafId: DomainEventStructuralDiagnosticLeafIdV1,
  publicContextId: DomainEventStructuralFailureContextId,
  triggerCondition: string,
  pathPolicy: string,
  payloadReadBudget: string,
  evidenceKind: DomainEventStructuralDiagnosticEvidenceKind,
  taggedCoordinatePolicy: DomainEventStructuralTaggedCoordinatePolicy,
  exactSourceBinding: string
): DomainEventStructuralDiagnosticLeafPolicyV1 => {
  const selected = DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_POLICY[publicContextId];
  return Object.freeze({
    leafId, publicContextId, triggerCondition,
    code: selected.code, phase: selected.phase, pathPolicy,
    safeSummary: selected.safeSummary,
    quarantineRecommended: selected.quarantineRecommended,
    retryability: selected.retryability, payloadReadBudget, evidenceKind,
    taggedCoordinatePolicy, exactSourceBinding
  });
};

const C = "CALLABLE_PRIMARY_TEST" as const;
const S = "STATIC_BRANCH_BINDING" as const;
const N = "NULL" as const;

export const DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE = Object.freeze([
  leafPolicy("L01_F01_AUTHORITY_UNHEALTHY", "F01", "authority unhealthy", "EMPTY", "ZERO", S, N, "admitC1Authority"),
  leafPolicy("L02_F02_CAPTURE_CORRECTABLE", "F02", "correctable A capture", "A_PATH", "A_ONLY", C, N, "translateCaptureFailure.correctable"),
  leafPolicy("L03_F03_CAPTURE_HOSTILE", "F03", "hostile A capture", "A_PATH", "A_ONLY", C, N, "translateCaptureFailure.hostile"),
  leafPolicy("L04_F04_CAPTURE_INTERNAL", "F04", "A internal capture", "EMPTY", "ZERO", S, N, "translateCaptureFailure.internal"),
  leafPolicy("L05_F05_CAPTURE_TOKEN_INVALID", "F05", "invalid A token", "EMPTY", "ZERO", C, N, "validateCapturedInternal.invalidToken"),
  leafPolicy("L06_F06_CAPTURE_BACKING_MISSING", "F06", "A backing missing", "EMPTY", "ZERO", S, N, "validateCapturedInternal.backingMissing"),
  leafPolicy("L07_F07_ENVELOPE_NOT_OBJECT", "F07", "envelope not object", "EMPTY", "NO_PAYLOAD", C, N, "validateEnvelope.rootKind"),
  leafPolicy("L08_F08_ENVELOPE_FIELD_MISSING", "F08", "envelope field missing", "ENVELOPE_FIELD", "NO_PAYLOAD", C, N, "validateEnvelope.requiredField"),
  leafPolicy("L09_F09_ENVELOPE_FIELD_EXTRA", "F09", "envelope field extra", "ENVELOPE_EXTRA", "NO_PAYLOAD", C, N, "validateEnvelope.extraField"),
  leafPolicy("L10_F10_ENVELOPE_FIELD_WRONG_KIND", "F10", "envelope field wrong kind", "ENVELOPE_FIELD", "NO_PAYLOAD", C, N, "validateEnvelope.fieldKind"),
  leafPolicy("L11_F11_ENVELOPE_FIELD_INVALID_VALUE", "F11", "envelope value invalid", "ENVELOPE_FIELD", "NO_PAYLOAD", C, N, "validateEnvelope.fieldValue"),
  leafPolicy("L12_F12_EVENT_TYPE_UNKNOWN", "F12", "event type unknown", "ENVELOPE_7", "NO_PAYLOAD", C, N, "validateCapturedInternal.eventType"),
  leafPolicy("L13_F13_EVENT_VERSION_UNSUPPORTED", "F13", "event version unsupported", "ENVELOPE_8", "NO_PAYLOAD", C, N, "validateCapturedInternal.eventVersion"),
  leafPolicy("L14_F14_PAYLOAD_NOT_OBJECT", "F14", "payload not object", "ENVELOPE_14", "NODE_ONLY", C, N, "acquirePayloadObject"),
  leafPolicy("L15_F15_ROOT_DISCRIMINATOR_MISSING", "F15", "root discriminator missing", "ROOT_DISCRIMINATOR", "DISCRIMINATOR_ONLY", C, N, "selectBranch.missing"),
  leafPolicy("L16_F16_ROOT_DISCRIMINATOR_WRONG_KIND", "F16", "root discriminator wrong kind", "ROOT_DISCRIMINATOR", "DISCRIMINATOR_ONLY", C, N, "selectBranch.wrongKind"),
  leafPolicy("L17_F17_ROOT_DISCRIMINATOR_UNKNOWN", "F17", "root discriminator unknown", "ROOT_DISCRIMINATOR", "DISCRIMINATOR_ONLY", C, N, "selectBranch.unknown"),
  leafPolicy("L18_F18_ROOT_SELECTION_ZERO", "F18", "root selection zero", "ENVELOPE_14", "DISCRIMINATOR_ONLY", S, N, "selectBranch.zeroInvariant"),
  leafPolicy("L19_F19_ROOT_SELECTION_MULTIPLE", "F19", "root selection multiple", "ENVELOPE_14", "DISCRIMINATOR_ONLY", S, N, "selectBranch.multipleInvariant"),
  leafPolicy("L20_F20_AST_NODE_LOOKUP_MISSING", "F20", "AST node missing", "CURRENT", "PRIOR_AST", S, N, "traverseNode.nodeLookup"),
  leafPolicy("L21_F20_AST_NODE_ORDINAL_LOOKUP_MISSING", "F20", "AST node ordinal missing", "CURRENT", "BEFORE_NODE", S, N, "traverseNode.nodeOrdinal"),
  leafPolicy("L22_F20_EVENT_BRANCH_ORDINAL_INVALID", "F20", "event branch ordinal invalid", "EMPTY", "BEFORE_AST", S, N, "validateCapturedInternal.eventBranchOrdinal"),
  leafPolicy("L23_F20_TAGGED_VARIANT_ORDINAL_INVALID", "F20", "tagged variant ordinal invalid", "TAGGED_PATH", "TAG_ONLY", S, N, "traverseNode.taggedVariantOrdinal"),
  leafPolicy("L24_F20_TAGGED_FIELD_COORDINATE_INVARIANT", "F20", "tagged field coordinate invalid", "TAGGED_PATH", "TAG_ONLY", S, N, "traverseNode.taggedFieldCoordinate"),
  leafPolicy("L25_F20_TAGGED_MULTIPLE_LITERAL_MATCH", "F20", "tagged literals multiple match", "TAGGED_PATH", "TAG_ONLY", S, N, "traverseNode.taggedMultiple"),
  leafPolicy("L26_F21_RECORD_MISSING_PLAIN", "F21", "plain record missing", "FIELD", "SELECTED_AST", C, N, "traverseNode.recordMissingPlain"),
  leafPolicy("L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT", "F21", "tagged child record missing", "VARIANT_FIELD", "SELECTED_CHILD", C, "KNOWN_VARIANT_STACK_LOCAL", "traverseNode.recordMissingTagged"),
  leafPolicy("L28_F22_RECORD_EXTRA_PLAIN", "F22", "plain record extra", "EXTRA", "SELECTED_AST", C, N, "traverseNode.recordExtraPlain"),
  leafPolicy("L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT", "F22", "tagged child record extra", "VARIANT_EXTRA", "SELECTED_CHILD", C, "KNOWN_VARIANT_STACK_LOCAL", "traverseNode.recordExtraTagged"),
  leafPolicy("L30_F23_KIND_MISMATCH_PLAIN", "F23", "plain kind mismatch", "CURRENT", "SELECTED_AST", C, N, "traverseNode.kindPlain"),
  leafPolicy("L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT", "F23", "tagged child kind mismatch", "VARIANT_CURRENT", "SELECTED_CHILD", C, "KNOWN_VARIANT_STACK_LOCAL", "traverseNode.kindTagged"),
  leafPolicy("L32_F24_LITERAL_MISMATCH_PLAIN", "F24", "plain literal mismatch", "CURRENT", "SELECTED_AST", C, N, "traverseNode.literalPlain"),
  leafPolicy("L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT", "F24", "tagged child literal mismatch", "VARIANT_CURRENT", "SELECTED_CHILD", C, "KNOWN_VARIANT_STACK_LOCAL", "traverseNode.literalTagged"),
  leafPolicy("L34_F25_CARDINALITY_MISMATCH_PLAIN", "F25", "plain cardinality mismatch", "CURRENT", "SELECTED_AST", C, N, "traverseNode.cardinalityPlain"),
  leafPolicy("L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT", "F25", "tagged child cardinality mismatch", "VARIANT_CURRENT", "SELECTED_CHILD", C, "KNOWN_VARIANT_STACK_LOCAL", "traverseNode.cardinalityTagged"),
  leafPolicy("L36_F26_TAGGED_DISCRIMINATOR_MISSING", "F26", "tagged discriminator missing", "TAGGED_PATH", "NO_CHILD", C, "MISSING_DISCRIMINANT", "traverseNode.taggedMissing"),
  leafPolicy("L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND", "F26", "tagged discriminator wrong kind", "TAGGED_FIELD", "NO_CHILD", C, "INVALID_DISCRIMINANT_TYPE", "traverseNode.taggedWrongKind"),
  leafPolicy("L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN", "F26", "tagged discriminator unknown", "TAGGED_FIELD", "NO_CHILD", C, "UNKNOWN_DISCRIMINANT_VALUE", "traverseNode.taggedUnknown"),
  leafPolicy("L39_F27_CLOSED_UNION_ZERO_MATCH", "F27", "closed union zero match", "CURRENT", "ALL_CLOSED_BRANCHES", C, N, "traverseNode.closedZero"),
  leafPolicy("L40_F28_CLOSED_UNION_MULTIPLE_MATCH", "F28", "closed union multiple match", "CURRENT", "ALL_CLOSED_BRANCHES", S, N, "traverseNode.closedMultiple"),
  leafPolicy("L41_F29_REFINEMENT_REJECTED_PLAIN", "F29", "plain refinement rejected", "CURRENT", "ONE_PREDICATE", C, N, "executeRefinement.plain"),
  leafPolicy("L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT", "F29", "tagged child refinement rejected", "VARIANT_CURRENT", "ONE_PREDICATE", C, "KNOWN_VARIANT_STACK_LOCAL", "executeRefinement.tagged"),
  leafPolicy("L43_F30_REFINEMENT_METADATA_INVALID", "F30", "refinement metadata invalid", "CURRENT", "NO_SEMANTIC_READ", S, N, "executeRefinement.metadata"),
  leafPolicy("L44_F31_BACKING_CONSTRUCTION_FAILED", "F31", "backing construction failed", "EMPTY", "TRAVERSAL_COMPLETE", S, N, "validateCapturedInternal.backingConstruction"),
  leafPolicy("L45_F32_TOKEN_ISSUE_FAILED", "F32", "token issue failed", "EMPTY", "BACKING_COMPLETE", S, N, "issueStructurallyValidatedDomainEvent"),
  leafPolicy("L46_F33_TOKEN_INVALID", "F33", "token invalid", "EMPTY", "ZERO", C, N, "readStructurallyValidatedDomainEvent"),
  leafPolicy("L47_F34_INTERNAL_CONTAINMENT", "F34", "internal containment", "EMPTY", "CATCH_BOUND", S, N, "publicOuterCatch")
] as const);

const leafPolicyRecord = Object.create(null) as Record<
  DomainEventStructuralDiagnosticLeafIdV1,
  DomainEventStructuralDiagnosticLeafPolicyV1
>;
for (const entry of DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY_TUPLE) {
  leafPolicyRecord[entry.leafId] = entry;
}
export const DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY = Object.freeze(
  leafPolicyRecord
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
  leafId: DomainEventStructuralDiagnosticLeafIdV1,
  path: readonly DomainEventStructuralPathSegment[] = [],
  taggedUnionCoordinate: TaggedUnionCoordinateV1 | null = null
): DomainEventStructuralDiagnostic => {
  const selected = DOMAIN_EVENT_STRUCTURAL_DIAGNOSTIC_LEAF_POLICY[leafId];
  return Object.freeze({
    code: selected.code,
    phase: selected.phase,
    path: boundDomainEventStructuralPath(path),
    safeSummary: selected.safeSummary,
    quarantineRecommended: selected.quarantineRecommended,
    retryability: selected.retryability,
    taggedUnionCoordinate,
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
      diagnostic: createDomainEventStructuralDiagnostic("L45_F32_TOKEN_ISSUE_FAILED")
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
      diagnostic: createDomainEventStructuralDiagnostic("L46_F33_TOKEN_INVALID")
    });
  }
  const value = structuralBackings.get(token);
  if (value === undefined) {
    return Object.freeze({
      ok: false as const,
      diagnostic: createDomainEventStructuralDiagnostic("L46_F33_TOKEN_INVALID")
    });
  }
  return Object.freeze({ ok: true as const, value });
};
