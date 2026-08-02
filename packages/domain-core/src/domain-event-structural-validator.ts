import {
  CANONICAL_RUNTIME_LIMITS,
  captureCanonicalRuntimeValue,
  readCanonicalRuntimeBackingForStructuralValidation
} from "./canonical-runtime-value.js";
import type {
  CanonicalRuntimeDiagnostic,
  CapturedCanonicalRuntimeValue,
  InternalCanonicalRuntimeObjectEntry,
  InternalCanonicalRuntimeValue
} from "./canonical-runtime-value.js";
import {
  DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
  STRUCTURAL_ID_ALIASES_V1,
  createFullC1StructuralSchemaAuthority
} from "./domain-event-structural-schema-ast.js";
import type {
  HealthyStructuralSchemaAuthorityV1,
  StructuralLiteralV1,
  StructuralRecordFieldV1,
  StructuralSchemaAuthorityResultV1,
  StructuralSchemaNodeV1,
  StructuralSchemaRootV1
} from "./domain-event-structural-schema-ast.js";
import type {
  AnyDomainEventEnvelope,
  DomainEventType
} from "./events.js";
import {
  boundDomainEventStructuralPath,
  createDomainEventStructuralDiagnostic,
  issueStructurallyValidatedDomainEvent
} from "./canonical-domain-event.js";
import type {
  DomainEventStructuralDiagnostic,
  DomainEventStructuralDiagnosticLeafIdV1,
  DomainEventStructuralPathSegment,
  DomainEventStructuralValidationResult,
  InternalValidatedDomainEvent,
  TaggedUnionCoordinateV1
} from "./canonical-domain-event.js";

const F01 = "L01_F01_AUTHORITY_UNHEALTHY" as const;
const F02 = "L02_F02_CAPTURE_CORRECTABLE" as const;
const F03 = "L03_F03_CAPTURE_HOSTILE" as const;
const F04 = "L04_F04_CAPTURE_INTERNAL" as const;
const F05 = "L05_F05_CAPTURE_TOKEN_INVALID" as const;
const F06 = "L06_F06_CAPTURE_BACKING_MISSING" as const;
const F07 = "L07_F07_ENVELOPE_NOT_OBJECT" as const;
const F08 = "L08_F08_ENVELOPE_FIELD_MISSING" as const;
const F09 = "L09_F09_ENVELOPE_FIELD_EXTRA" as const;
const F10 = "L10_F10_ENVELOPE_FIELD_WRONG_KIND" as const;
const F11 = "L11_F11_ENVELOPE_FIELD_INVALID_VALUE" as const;
const F12 = "L12_F12_EVENT_TYPE_UNKNOWN" as const;
const F13 = "L13_F13_EVENT_VERSION_UNSUPPORTED" as const;
const F14 = "L14_F14_PAYLOAD_NOT_OBJECT" as const;
const F15 = "L15_F15_ROOT_DISCRIMINATOR_MISSING" as const;
const F16 = "L16_F16_ROOT_DISCRIMINATOR_WRONG_KIND" as const;
const F17 = "L17_F17_ROOT_DISCRIMINATOR_UNKNOWN" as const;
const F18 = "L18_F18_ROOT_SELECTION_ZERO" as const;
const F19 = "L19_F19_ROOT_SELECTION_MULTIPLE" as const;
const F20 = "L20_F20_AST_NODE_LOOKUP_MISSING" as const;
const F20_NODE_ORDINAL = "L21_F20_AST_NODE_ORDINAL_LOOKUP_MISSING" as const;
const F20_EVENT_BRANCH = "L22_F20_EVENT_BRANCH_ORDINAL_INVALID" as const;
const F20_TAGGED_VARIANT = "L23_F20_TAGGED_VARIANT_ORDINAL_INVALID" as const;
const F20_TAGGED_FIELD = "L24_F20_TAGGED_FIELD_COORDINATE_INVARIANT" as const;
const F20_TAGGED_MULTIPLE = "L25_F20_TAGGED_MULTIPLE_LITERAL_MATCH" as const;
const F21 = "L26_F21_RECORD_MISSING_PLAIN" as const;
const F21_TAGGED = "L27_F21_RECORD_MISSING_IN_KNOWN_TAGGED_VARIANT" as const;
const F22 = "L28_F22_RECORD_EXTRA_PLAIN" as const;
const F22_TAGGED = "L29_F22_RECORD_EXTRA_IN_KNOWN_TAGGED_VARIANT" as const;
const F23 = "L30_F23_KIND_MISMATCH_PLAIN" as const;
const F23_TAGGED = "L31_F23_KIND_MISMATCH_IN_KNOWN_TAGGED_VARIANT" as const;
const F24 = "L32_F24_LITERAL_MISMATCH_PLAIN" as const;
const F24_TAGGED = "L33_F24_LITERAL_MISMATCH_IN_KNOWN_TAGGED_VARIANT" as const;
const F25 = "L34_F25_CARDINALITY_MISMATCH_PLAIN" as const;
const F25_TAGGED = "L35_F25_CARDINALITY_MISMATCH_IN_KNOWN_TAGGED_VARIANT" as const;
const F26_MISSING = "L36_F26_TAGGED_DISCRIMINATOR_MISSING" as const;
const F26_WRONG_KIND = "L37_F26_TAGGED_DISCRIMINATOR_WRONG_KIND" as const;
const F26_UNKNOWN = "L38_F26_TAGGED_DISCRIMINATOR_UNKNOWN" as const;
const F27 = "L39_F27_CLOSED_UNION_ZERO_MATCH" as const;
const F28 = "L40_F28_CLOSED_UNION_MULTIPLE_MATCH" as const;
const F29 = "L41_F29_REFINEMENT_REJECTED_PLAIN" as const;
const F29_TAGGED = "L42_F29_REFINEMENT_REJECTED_IN_KNOWN_TAGGED_VARIANT" as const;
const F30 = "L43_F30_REFINEMENT_METADATA_INVALID" as const;
const F31 = "L44_F31_BACKING_CONSTRUCTION_FAILED" as const;
const F34 = "L47_F34_INTERNAL_CONTAINMENT" as const;

const intrinsicApply = Reflect.apply;
const intrinsicStringTrim = Object.getOwnPropertyDescriptor(
  String.prototype,
  "trim"
)?.value as (this: string) => string;
const noArguments = Object.freeze([]);

const trimPrimitiveString = (value: string): string => {
  const trimmed: unknown = intrinsicApply(
    intrinsicStringTrim,
    value,
    noArguments
  );
  return typeof trimmed === "string" ? trimmed : "";
};

const compareRawUtf16CodeUnits = (left: string, right: string): number => {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const difference = left.charCodeAt(index) - right.charCodeAt(index);
    if (difference !== 0) {
      return difference;
    }
  }
  return left.length - right.length;
};

const literalEquals = (
  left: StructuralLiteralV1,
  right: StructuralLiteralV1
): boolean => left === right;

const literalKey = (value: StructuralLiteralV1): string => {
  if (value === null) {
    return "z:";
  }
  switch (typeof value) {
    case "boolean":
      return value ? "b:1" : "b:0";
    case "number":
      return `n:${String(value)}`;
    case "string":
      return `s:${value}`;
  }
};

export type DomainEventStructuralValidationObservation = {
  readonly diagnosticLeafId: DomainEventStructuralDiagnosticLeafIdV1 | null;
  readonly authorityChecked: boolean;
  readonly captureEntered: boolean;
  readonly envelopeKeySetChecked: boolean;
  readonly envelopeFieldReads: number;
  readonly eventTypeReads: number;
  readonly eventVersionReads: number;
  readonly payloadKeyPresenceChecked: boolean;
  readonly payloadKeyPresent: boolean;
  readonly payloadNodeAcquired: boolean;
  readonly payloadDiscriminatorReads: number;
  readonly payloadContentReads: number;
  readonly astTraversalEntered: boolean;
  readonly validatedBackingConstructed: boolean;
  readonly tokenIssued: boolean;
};

type MutableObservation = {
  diagnosticLeafId: DomainEventStructuralDiagnosticLeafIdV1 | null;
  authorityChecked: boolean;
  captureEntered: boolean;
  envelopeKeySetChecked: boolean;
  envelopeFieldReads: number;
  eventTypeReads: number;
  eventVersionReads: number;
  payloadKeyPresenceChecked: boolean;
  payloadKeyPresent: boolean;
  payloadNodeAcquired: boolean;
  payloadDiscriminatorReads: number;
  payloadContentReads: number;
  astTraversalEntered: boolean;
  validatedBackingConstructed: boolean;
  tokenIssued: boolean;
};

const createObservation = (): MutableObservation => ({
  diagnosticLeafId: null,
  authorityChecked: false,
  captureEntered: false,
  envelopeKeySetChecked: false,
  envelopeFieldReads: 0,
  eventTypeReads: 0,
  eventVersionReads: 0,
  payloadKeyPresenceChecked: false,
  payloadKeyPresent: false,
  payloadNodeAcquired: false,
  payloadDiscriminatorReads: 0,
  payloadContentReads: 0,
  astTraversalEntered: false,
  validatedBackingConstructed: false,
  tokenIssued: false
});

const freezeObservation = (
  observation: MutableObservation
): DomainEventStructuralValidationObservation =>
  Object.freeze({ ...observation });

type CFailure = {
  readonly ok: false;
  readonly leafId: DomainEventStructuralDiagnosticLeafIdV1;
  readonly path: readonly DomainEventStructuralPathSegment[];
  readonly taggedUnionCoordinate: TaggedUnionCoordinateV1 | null;
};

type CResult<T> =
  | {
      readonly ok: true;
      readonly value: T;
    }
  | CFailure;

const success = <T>(value: T): CResult<T> => ({ ok: true, value });

const failure = (
  leafId: DomainEventStructuralDiagnosticLeafIdV1,
  path: readonly DomainEventStructuralPathSegment[] = [],
  taggedUnionCoordinate: TaggedUnionCoordinateV1 | null = null
): CFailure => ({ ok: false, leafId, path, taggedUnionCoordinate });

const toPublicFailure = (
  value: CFailure,
  observation?: MutableObservation
): DomainEventStructuralValidationResult => {
  if (observation !== undefined) observation.diagnosticLeafId = value.leafId;
  return Object.freeze({
    ok: false as const,
    diagnostic: createDomainEventStructuralDiagnostic(
      value.leafId,
      value.path,
      value.taggedUnionCoordinate
    )
  });
};

type LiteralDecisionCase = {
  readonly literal: StructuralLiteralV1;
  readonly next: BranchDecision;
};

type BranchDecision =
  | {
      readonly kind: "LEAF";
      readonly root: StructuralSchemaRootV1;
    }
  | {
      readonly kind: "EXPLICIT_VERSION";
      readonly fieldName: string;
      readonly discriminatorOrdinal: number;
      readonly cases: readonly LiteralDecisionCase[];
      readonly absent: BranchDecision | null;
    }
  | {
      readonly kind: "LITERAL";
      readonly fieldName: string;
      readonly discriminatorOrdinal: number;
      readonly cases: readonly LiteralDecisionCase[];
    }
  | {
      readonly kind: "PRESENCE";
      readonly fieldName: string;
      readonly discriminatorOrdinal: number;
      readonly present: BranchDecision;
      readonly absent: BranchDecision;
    };

type AdmittedEventDescriptor = {
  readonly eventType: string;
  readonly eventOrdinal: number;
  readonly roots: readonly StructuralSchemaRootV1[];
  readonly decision:
    | {
        readonly kind: "ENVELOPE_RESOLVABLE_BRANCH";
        readonly root: StructuralSchemaRootV1;
      }
    | {
        readonly kind: "PAYLOAD_DISCRIMINATED_BRANCH";
        readonly tree: BranchDecision;
      };
};

type HealthyC1ConsumerAuthority = {
  readonly status: "HEALTHY";
  readonly c1: HealthyStructuralSchemaAuthorityV1;
  readonly nodesById: Readonly<Record<string, StructuralSchemaNodeV1>>;
  readonly nodeOrdinalsByNodeId: Readonly<Record<string, number>>;
  readonly eventsByType: Readonly<Record<string, AdmittedEventDescriptor>>;
  readonly eventTypes: readonly string[];
  readonly eventCount: 40;
  readonly branchCount: 59;
  readonly explicitVersionBranchCount: 13;
  readonly unversionedBranchCount: 46;
  readonly envelopeResolvableBranchCount: 35;
  readonly payloadDiscriminatedBranchCount: 24;
  readonly discriminatorPathCount: 7;
  readonly refinementAliasCount: 16;
};

type UnhealthyC1ConsumerAuthority = {
  readonly status: "UNHEALTHY";
};

export type CAuthorityAdmissionResult =
  | HealthyC1ConsumerAuthority
  | UnhealthyC1ConsumerAuthority;

type DecisionBuildState = {
  readonly discriminatorOrdinals: Record<string, number>;
  nextDiscriminatorOrdinal: number;
};

const getNode = (
  nodesById: Readonly<Record<string, StructuralSchemaNodeV1>>,
  nodeId: string
): StructuralSchemaNodeV1 | undefined => nodesById[nodeId];

const topRecordFields = (
  root: StructuralSchemaRootV1,
  nodesById: Readonly<Record<string, StructuralSchemaNodeV1>>
): readonly StructuralRecordFieldV1[] | null => {
  const node = getNode(nodesById, root.rootNodeId);
  return node?.kind === "EXACT_RECORD" ? node.fields : null;
};

const topField = (
  root: StructuralSchemaRootV1,
  fieldName: string,
  nodesById: Readonly<Record<string, StructuralSchemaNodeV1>>
): StructuralRecordFieldV1 | undefined =>
  topRecordFields(root, nodesById)?.find(
    (field) => field.fieldName === fieldName
  );

const topLiteral = (
  root: StructuralSchemaRootV1,
  fieldName: string,
  nodesById: Readonly<Record<string, StructuralSchemaNodeV1>>
): StructuralLiteralV1 | undefined => {
  const field = topField(root, fieldName, nodesById);
  if (field === undefined) {
    return undefined;
  }
  const node = getNode(nodesById, field.childNodeId);
  return node?.kind === "LITERAL" ? node.value : undefined;
};

const discriminatorOrdinal = (
  fieldName: string,
  state: DecisionBuildState
): number => {
  const existing = state.discriminatorOrdinals[fieldName];
  if (existing !== undefined) {
    return existing;
  }
  const next = state.nextDiscriminatorOrdinal;
  state.nextDiscriminatorOrdinal += 1;
  state.discriminatorOrdinals[fieldName] = next;
  return next;
};

const freezeDecision = (decision: BranchDecision): BranchDecision => {
  switch (decision.kind) {
    case "LEAF":
      return Object.freeze(decision);
    case "EXPLICIT_VERSION":
      return Object.freeze({
        ...decision,
        cases: Object.freeze(
          decision.cases.map((entry) =>
            Object.freeze({
              literal: entry.literal,
              next: freezeDecision(entry.next)
            })
          )
        ),
        absent:
          decision.absent === null ? null : freezeDecision(decision.absent)
      });
    case "LITERAL":
      return Object.freeze({
        ...decision,
        cases: Object.freeze(
          decision.cases.map((entry) =>
            Object.freeze({
              literal: entry.literal,
              next: freezeDecision(entry.next)
            })
          )
        )
      });
    case "PRESENCE":
      return Object.freeze({
        ...decision,
        present: freezeDecision(decision.present),
        absent: freezeDecision(decision.absent)
      });
  }
};

const groupRootsByLiteral = (
  roots: readonly StructuralSchemaRootV1[],
  values: readonly StructuralLiteralV1[]
): readonly {
  readonly literal: StructuralLiteralV1;
  readonly roots: readonly StructuralSchemaRootV1[];
}[] => {
  const groups = Object.create(null) as Record<
    string,
    { literal: StructuralLiteralV1; roots: StructuralSchemaRootV1[] }
  >;
  for (let index = 0; index < roots.length; index += 1) {
    const literal = values[index];
    const root = roots[index];
    if (literal === undefined || root === undefined) {
      throw new Error("decision literal invariant");
    }
    const key = literalKey(literal);
    const existing = groups[key];
    if (existing === undefined) {
      groups[key] = { literal, roots: [root] };
    } else {
      existing.roots.push(root);
    }
  }
  return Object.freeze(
    Object.keys(groups)
      .sort(compareRawUtf16CodeUnits)
      .map((key) => {
        const group = groups[key];
        if (group === undefined) {
          throw new Error("decision group invariant");
        }
        return Object.freeze({
          literal: group.literal,
          roots: Object.freeze([...group.roots])
        });
      })
  );
};

const buildDecision = (
  roots: readonly StructuralSchemaRootV1[],
  nodesById: Readonly<Record<string, StructuralSchemaNodeV1>>,
  state: DecisionBuildState
): BranchDecision => {
  if (roots.length === 0) {
    throw new Error("zero-root decision");
  }
  if (roots.length === 1) {
    const root = roots[0];
    if (root === undefined) {
      throw new Error("leaf invariant");
    }
    return Object.freeze({ kind: "LEAF" as const, root });
  }

  const explicitRoots = roots.filter(
    (root) => root.versionPolicy.kind === "EXPLICIT_LITERAL"
  );
  if (explicitRoots.length > 0) {
    const versionFields = Array.from(
      new Set(
        explicitRoots.map((root) =>
          root.versionPolicy.kind === "EXPLICIT_LITERAL"
            ? root.versionPolicy.fieldName
            : ""
        )
      )
    ).sort(compareRawUtf16CodeUnits);
    if (versionFields.length !== 1) {
      throw new Error("multiple explicit version fields");
    }
    const fieldName = versionFields[0];
    if (fieldName === undefined || fieldName.length === 0) {
      throw new Error("missing explicit version field");
    }
    const explicitValues = explicitRoots.map((root) => {
      if (root.versionPolicy.kind !== "EXPLICIT_LITERAL") {
        throw new Error("explicit root invariant");
      }
      return root.versionPolicy.acceptedLiteral;
    });
    const groups = groupRootsByLiteral(explicitRoots, explicitValues);
    if (groups.some((group) => group.roots.length !== 1)) {
      throw new Error("overlapping explicit version literal");
    }
    const unversioned = roots.filter(
      (root) => root.versionPolicy.kind === "UNVERSIONED"
    );
    return freezeDecision({
      kind: "EXPLICIT_VERSION",
      fieldName,
      discriminatorOrdinal: discriminatorOrdinal(fieldName, state),
      cases: groups.map((group) => ({
        literal: group.literal,
        next: buildDecision(group.roots, nodesById, state)
      })),
      absent:
        unversioned.length === 0
          ? null
          : buildDecision(unversioned, nodesById, state)
    });
  }

  const firstFields = topRecordFields(
    roots[0] as StructuralSchemaRootV1,
    nodesById
  );
  if (firstFields === null) {
    throw new Error("nonrecord decision root");
  }
  const commonLiteralFields = firstFields
    .map((field) => field.fieldName)
    .filter((fieldName) =>
      roots.every(
        (root) => topLiteral(root, fieldName, nodesById) !== undefined
      )
    )
    .sort(compareRawUtf16CodeUnits);
  for (const fieldName of commonLiteralFields) {
    const values = roots.map((root) =>
      topLiteral(root, fieldName, nodesById)
    );
    if (values.some((value) => value === undefined)) {
      continue;
    }
    const groups = groupRootsByLiteral(
      roots,
      values as readonly StructuralLiteralV1[]
    );
    if (groups.length > 1) {
      return freezeDecision({
        kind: "LITERAL",
        fieldName,
        discriminatorOrdinal: discriminatorOrdinal(fieldName, state),
        cases: groups.map((group) => ({
          literal: group.literal,
          next: buildDecision(group.roots, nodesById, state)
        }))
      });
    }
  }

  const allFieldNames = Array.from(
    new Set(
      roots.flatMap(
        (root) =>
          topRecordFields(root, nodesById)?.map((field) => field.fieldName) ??
          []
      )
    )
  ).sort(compareRawUtf16CodeUnits);
  for (const fieldName of allFieldNames) {
    const present = roots.filter(
      (root) => topField(root, fieldName, nodesById) !== undefined
    );
    const absent = roots.filter(
      (root) => topField(root, fieldName, nodesById) === undefined
    );
    if (present.length > 0 && absent.length > 0) {
      return freezeDecision({
        kind: "PRESENCE",
        fieldName,
        discriminatorOrdinal: discriminatorOrdinal(fieldName, state),
        present: buildDecision(present, nodesById, state),
        absent: buildDecision(absent, nodesById, state)
      });
    }
  }
  throw new Error("nonprogressing decision");
};

const unhealthyAdmission = (): UnhealthyC1ConsumerAuthority =>
  Object.freeze({ status: "UNHEALTHY" as const });

export const admitC1Authority = (
  result: StructuralSchemaAuthorityResultV1
): CAuthorityAdmissionResult => {
  try {
    if (
      result.status !== "HEALTHY" ||
      result.health.status !== "HEALTHY" ||
      result.health.eventDescriptorCount !== 40 ||
      result.health.payloadBranchCount !== 59 ||
      result.health.explicitVersionBranchCount !== 13 ||
      result.health.unversionedBranchCount !== 46 ||
      result.health.nodeKindCount !== 15 ||
      result.health.unresolvedReferenceCount !== 0 ||
      result.health.cycleCount !== 0
    ) {
      return unhealthyAdmission();
    }

    const aliasRecord = Object.create(null) as Record<string, true>;
    for (const alias of STRUCTURAL_ID_ALIASES_V1) {
      if (aliasRecord[alias] === true) {
        return unhealthyAdmission();
      }
      aliasRecord[alias] = true;
    }
    if (Object.keys(aliasRecord).length !== 16) {
      return unhealthyAdmission();
    }
    Object.freeze(aliasRecord);

    const nodesById = Object.create(null) as Record<
      string,
      StructuralSchemaNodeV1
    >;
    for (const binding of result.candidate.nodeBindings) {
      if (
        binding.nodeId !== binding.node.nodeId ||
        nodesById[binding.nodeId] !== undefined
      ) {
        return unhealthyAdmission();
      }
      nodesById[binding.nodeId] = binding.node;
    }
    Object.freeze(nodesById);

    const nodeOrdinalsByNodeId = Object.create(null) as Record<string, number>;
    let expectedNodeOrdinal = 1;
    for (const entry of result.traversal.uniqueNodes) {
      if (
        entry.nodeOrdinal !== expectedNodeOrdinal ||
        entry.nodeId !== entry.node.nodeId ||
        nodesById[entry.nodeId] !== entry.node ||
        nodeOrdinalsByNodeId[entry.nodeId] !== undefined
      ) {
        return unhealthyAdmission();
      }
      nodeOrdinalsByNodeId[entry.nodeId] = entry.nodeOrdinal;
      expectedNodeOrdinal += 1;
    }
    if (
      expectedNodeOrdinal !== result.traversal.uniqueNodeCount + 1 ||
      Object.keys(nodeOrdinalsByNodeId).length !==
        Object.keys(nodesById).length
    ) {
      return unhealthyAdmission();
    }
    Object.freeze(nodeOrdinalsByNodeId);

    const rootGroups = Object.create(null) as Record<
      string,
      StructuralSchemaRootV1[]
    >;
    let expectedBranchOrdinal = 1;
    const seenBranchIds = Object.create(null) as Record<string, true>;
    for (const root of result.candidate.roots) {
      if (
        root.branchOrdinal !== expectedBranchOrdinal ||
        seenBranchIds[root.branchId] === true ||
        getNode(nodesById, root.rootNodeId) === undefined
      ) {
        return unhealthyAdmission();
      }
      expectedBranchOrdinal += 1;
      seenBranchIds[root.branchId] = true;
      const group = rootGroups[root.eventType];
      if (group === undefined) {
        rootGroups[root.eventType] = [root];
      } else {
        group.push(root);
      }
    }
    if (expectedBranchOrdinal !== 60) {
      return unhealthyAdmission();
    }

    const eventTypes = Object.keys(rootGroups).sort((left, right) => {
      const leftRoot = rootGroups[left]?.[0];
      const rightRoot = rootGroups[right]?.[0];
      if (leftRoot === undefined || rightRoot === undefined) {
        throw new Error("event group invariant");
      }
      return (
        leftRoot.eventOrdinal - rightRoot.eventOrdinal ||
        compareRawUtf16CodeUnits(left, right)
      );
    });
    if (eventTypes.length !== 40) {
      return unhealthyAdmission();
    }

    const decisionState: DecisionBuildState = {
      discriminatorOrdinals: Object.create(null) as Record<string, number>,
      nextDiscriminatorOrdinal: 1
    };
    const eventsByType = Object.create(null) as Record<
      string,
      AdmittedEventDescriptor
    >;
    let singletonBranches = 0;
    let multiBranches = 0;
    let expectedEventOrdinal = 1;
    for (const eventType of eventTypes) {
      const mutableRoots = rootGroups[eventType];
      if (mutableRoots === undefined || mutableRoots.length === 0) {
        return unhealthyAdmission();
      }
      const roots = Object.freeze(
        [...mutableRoots].sort(
          (left, right) => left.branchOrdinal - right.branchOrdinal
        )
      );
      if (
        roots.some((root) => root.eventOrdinal !== expectedEventOrdinal) ||
        roots.some((root) => root.eventType !== eventType)
      ) {
        return unhealthyAdmission();
      }
      expectedEventOrdinal += 1;
      if (roots.length === 1) {
        singletonBranches += 1;
        eventsByType[eventType] = Object.freeze({
          eventType,
          eventOrdinal: roots[0]?.eventOrdinal ?? 0,
          roots,
          decision: Object.freeze({
            kind: "ENVELOPE_RESOLVABLE_BRANCH" as const,
            root: roots[0] as StructuralSchemaRootV1
          })
        });
      } else {
        multiBranches += roots.length;
        const tree = buildDecision(roots, nodesById, decisionState);
        eventsByType[eventType] = Object.freeze({
          eventType,
          eventOrdinal: roots[0]?.eventOrdinal ?? 0,
          roots,
          decision: Object.freeze({
            kind: "PAYLOAD_DISCRIMINATED_BRANCH" as const,
            tree
          })
        });
      }
    }
    Object.freeze(eventsByType);
    Object.freeze(decisionState.discriminatorOrdinals);

    if (
      expectedEventOrdinal !== 41 ||
      singletonBranches !== 35 ||
      multiBranches !== 24 ||
      Object.keys(decisionState.discriminatorOrdinals).length !== 7
    ) {
      return unhealthyAdmission();
    }

    return Object.freeze({
      status: "HEALTHY" as const,
      c1: result,
      nodesById,
      nodeOrdinalsByNodeId,
      eventsByType,
      eventTypes: Object.freeze([...eventTypes]),
      eventCount: 40 as const,
      branchCount: 59 as const,
      explicitVersionBranchCount: 13 as const,
      unversionedBranchCount: 46 as const,
      envelopeResolvableBranchCount: 35 as const,
      payloadDiscriminatedBranchCount: 24 as const,
      discriminatorPathCount: 7 as const,
      refinementAliasCount: 16 as const
    });
  } catch {
    return unhealthyAdmission();
  }
};

const defaultAuthority: CAuthorityAdmissionResult = (() => {
  try {
    return admitC1Authority(createFullC1StructuralSchemaAuthority());
  } catch {
    return unhealthyAdmission();
  }
})();

const findEntry = (
  object: Extract<InternalCanonicalRuntimeValue, { readonly kind: "OBJECT" }>,
  key: string
): InternalCanonicalRuntimeObjectEntry | undefined =>
  object.entries.find((entry) => entry.key === key);

const hasEntry = (
  object: Extract<InternalCanonicalRuntimeValue, { readonly kind: "OBJECT" }>,
  key: string
): boolean => object.entries.some((entry) => entry.key === key);

const translateCapturePath = (
  diagnostic: CanonicalRuntimeDiagnostic
): readonly DomainEventStructuralPathSegment[] =>
  diagnostic.path.map((segment) => {
    switch (segment.kind) {
      case "ARRAY_INDEX":
        return Object.freeze({
          kind: "CAPTURE_ARRAY_INDEX" as const,
          index: segment.index
        });
      case "OBJECT_KEY_ORDINAL":
        return Object.freeze({
          kind: "CAPTURE_OBJECT_KEY_ORDINAL" as const,
          ordinal: segment.ordinal
        });
      case "TRUNCATED":
        return Object.freeze({ kind: "TRUNCATED" as const });
    }
  });

const translateCaptureFailure = (
  diagnostic: CanonicalRuntimeDiagnostic
): CFailure => {
  switch (diagnostic.code) {
    case "UNSUPPORTED_TYPE":
    case "INVALID_NUMBER":
    case "UNSAFE_INTEGER":
    case "INVALID_UNICODE":
    case "NONPLAIN_OBJECT":
    case "RESOURCE_DEPTH_EXCEEDED":
    case "RESOURCE_NODE_LIMIT_EXCEEDED":
    case "RESOURCE_ARRAY_LIMIT_EXCEEDED":
    case "RESOURCE_OBJECT_KEY_LIMIT_EXCEEDED":
    case "RESOURCE_STRING_LIMIT_EXCEEDED":
    case "RESOURCE_KEY_LIMIT_EXCEEDED":
    case "RESOURCE_SERIALIZED_BYTE_LIMIT_EXCEEDED":
      return failure(F02, translateCapturePath(diagnostic));
    case "ACCESSOR_PROPERTY":
    case "NON_ENUMERABLE_PROPERTY":
    case "SYMBOL_KEY":
    case "SYMBOL_VALUE":
    case "CYCLE":
    case "SPARSE_ARRAY":
    case "KEYED_ARRAY":
    case "INVALID_ARRAY_LENGTH_DESCRIPTOR":
    case "PROXY_OR_DESCRIPTOR_FAILURE":
      return failure(F03, translateCapturePath(diagnostic));
    case "INVALID_CAPTURE_TOKEN":
      return failure(F05);
    case "INTERNAL_BACKING_MISSING":
      return failure(F06);
    case "INTERNAL_SERIALIZATION_FAILURE":
      return failure(F04);
  }
};

const ENVELOPE_FIELDS = Object.freeze([
  "category",
  "eventId",
  "gameId",
  "eventSequence",
  "batchId",
  "gameVersion",
  "eventType",
  "eventVersion",
  "rulesBaselineVersion",
  "commandId",
  "createdAt",
  "correlationId",
  "causationId",
  "payload"
] as const);

type EnvelopeFieldName = (typeof ENVELOPE_FIELDS)[number];

type ValidatedEnvelopeFields = {
  readonly category: "domain";
  readonly eventId: string;
  readonly gameId: string;
  readonly eventSequence: number;
  readonly batchId: string;
  readonly gameVersion: number;
  readonly eventTypeText: string;
  readonly eventVersionValue: number;
  readonly rulesBaselineVersion: string;
  readonly commandId: string;
  readonly createdAt: string;
  readonly correlationId: string;
  readonly causationId: string;
};

const envelopePath = (
  ordinal: number
): readonly DomainEventStructuralPathSegment[] =>
  Object.freeze([
    Object.freeze({
      kind: "ENVELOPE_FIELD_ORDINAL" as const,
      ordinal
    })
  ]);

const requireEnvelopeString = (
  object: Extract<InternalCanonicalRuntimeValue, { readonly kind: "OBJECT" }>,
  field: EnvelopeFieldName,
  ordinal: number,
  observation: MutableObservation
): CResult<string> => {
  const entry = findEntry(object, field);
  if (entry === undefined) {
    return failure(F08, envelopePath(ordinal));
  }
  observation.envelopeFieldReads += 1;
  return entry.value.kind === "STRING"
    ? success(entry.value.value)
    : failure(F10, envelopePath(ordinal));
};

const requireEnvelopeInteger = (
  object: Extract<InternalCanonicalRuntimeValue, { readonly kind: "OBJECT" }>,
  field: EnvelopeFieldName,
  ordinal: number,
  observation: MutableObservation
): CResult<number> => {
  const entry = findEntry(object, field);
  if (entry === undefined) {
    return failure(F08, envelopePath(ordinal));
  }
  observation.envelopeFieldReads += 1;
  return entry.value.kind === "INTEGER"
    ? success(entry.value.value)
    : failure(F10, envelopePath(ordinal));
};

const requireNonblankEnvelopeString = (
  value: CResult<string>,
  ordinal: number
): CResult<string> => {
  if (!value.ok) {
    return value;
  }
  return trimPrimitiveString(value.value).length > 0
    ? value
    : failure(F11, envelopePath(ordinal));
};

const validateEnvelope = (
  backing: InternalCanonicalRuntimeValue,
  observation: MutableObservation
): CResult<{
  readonly object: Extract<
    InternalCanonicalRuntimeValue,
    { readonly kind: "OBJECT" }
  >;
  readonly fields: ValidatedEnvelopeFields;
}> => {
  if (backing.kind !== "OBJECT") {
    return failure(F07);
  }
  observation.envelopeKeySetChecked = true;
  observation.payloadKeyPresenceChecked = true;
  observation.payloadKeyPresent = hasEntry(backing, "payload");

  for (let index = 0; index < ENVELOPE_FIELDS.length; index += 1) {
    const field = ENVELOPE_FIELDS[index];
    if (field === undefined || !hasEntry(backing, field)) {
      return failure(F08, envelopePath(index + 1));
    }
  }
  for (let index = 0; index < backing.entries.length; index += 1) {
    const entry = backing.entries[index];
    if (
      entry !== undefined &&
      !ENVELOPE_FIELDS.some((field) => field === entry.key)
    ) {
      return failure(
        F09,
        Object.freeze([
          Object.freeze({
            kind: "ENVELOPE_EXTRA_ENTRY_ORDINAL" as const,
            ordinal: index + 1
          })
        ])
      );
    }
  }

  const category = requireEnvelopeString(
    backing,
    "category",
    1,
    observation
  );
  if (!category.ok) return category;
  if (category.value !== "domain") return failure(F11, envelopePath(1));
  const eventId = requireNonblankEnvelopeString(
    requireEnvelopeString(backing, "eventId", 2, observation),
    2
  );
  if (!eventId.ok) return eventId;
  const gameId = requireNonblankEnvelopeString(
    requireEnvelopeString(backing, "gameId", 3, observation),
    3
  );
  if (!gameId.ok) return gameId;
  const eventSequence = requireEnvelopeInteger(
    backing,
    "eventSequence",
    4,
    observation
  );
  if (!eventSequence.ok) return eventSequence;
  const batchId = requireNonblankEnvelopeString(
    requireEnvelopeString(backing, "batchId", 5, observation),
    5
  );
  if (!batchId.ok) return batchId;
  const gameVersion = requireEnvelopeInteger(
    backing,
    "gameVersion",
    6,
    observation
  );
  if (!gameVersion.ok) return gameVersion;
  const eventTypeText = requireEnvelopeString(
    backing,
    "eventType",
    7,
    observation
  );
  if (!eventTypeText.ok) return eventTypeText;
  const eventVersionValue = requireEnvelopeInteger(
    backing,
    "eventVersion",
    8,
    observation
  );
  if (!eventVersionValue.ok) return eventVersionValue;
  const rulesBaselineVersion = requireEnvelopeString(
    backing,
    "rulesBaselineVersion",
    9,
    observation
  );
  if (!rulesBaselineVersion.ok) return rulesBaselineVersion;
  const commandId = requireNonblankEnvelopeString(
    requireEnvelopeString(backing, "commandId", 10, observation),
    10
  );
  if (!commandId.ok) return commandId;
  const createdAt = requireEnvelopeString(
    backing,
    "createdAt",
    11,
    observation
  );
  if (!createdAt.ok) return createdAt;
  const correlationId = requireNonblankEnvelopeString(
    requireEnvelopeString(backing, "correlationId", 12, observation),
    12
  );
  if (!correlationId.ok) return correlationId;
  const causationId = requireNonblankEnvelopeString(
    requireEnvelopeString(backing, "causationId", 13, observation),
    13
  );
  if (!causationId.ok) return causationId;

  return success({
    object: backing,
    fields: Object.freeze({
      category: "domain" as const,
      eventId: eventId.value,
      gameId: gameId.value,
      eventSequence: eventSequence.value,
      batchId: batchId.value,
      gameVersion: gameVersion.value,
      eventTypeText: eventTypeText.value,
      eventVersionValue: eventVersionValue.value,
      rulesBaselineVersion: rulesBaselineVersion.value,
      commandId: commandId.value,
      createdAt: createdAt.value,
      correlationId: correlationId.value,
      causationId: causationId.value
    })
  });
};

type DiscriminatorCacheEntry = {
  readonly present: boolean;
  readonly value?: InternalCanonicalRuntimeValue;
};

type DiscriminatorCache = Record<string, DiscriminatorCacheEntry>;

const primitiveLiteral = (
  value: InternalCanonicalRuntimeValue
): CResult<StructuralLiteralV1> => {
  switch (value.kind) {
    case "NULL":
      return success(null);
    case "BOOLEAN":
    case "INTEGER":
    case "STRING":
      return success(value.value);
    case "ARRAY":
    case "OBJECT":
      return failure(F16);
  }
};

const readDiscriminator = (
  object: Extract<InternalCanonicalRuntimeValue, { readonly kind: "OBJECT" }>,
  fieldName: string,
  ordinal: number,
  cache: DiscriminatorCache,
  observation: MutableObservation
): CResult<DiscriminatorCacheEntry> => {
  const cached = cache[fieldName];
  if (cached !== undefined) {
    return success(cached);
  }
  observation.payloadDiscriminatorReads += 1;
  const entry = findEntry(object, fieldName);
  const captured =
    entry === undefined
      ? Object.freeze({ present: false as const })
      : Object.freeze({
          present: true as const,
          value: entry.value
        });
  cache[fieldName] = captured;
  if (ordinal < 1) {
    return failure(F18);
  }
  return success(captured);
};

const discriminatorPath = (
  ordinal: number
): readonly DomainEventStructuralPathSegment[] =>
  Object.freeze([
    Object.freeze({
      kind: "ENVELOPE_FIELD_ORDINAL" as const,
      ordinal: 14
    }),
    Object.freeze({
      kind: "PAYLOAD_DISCRIMINANT_ORDINAL" as const,
      ordinal
    })
  ]);

const selectBranch = (
  tree: BranchDecision,
  payload: Extract<
    InternalCanonicalRuntimeValue,
    { readonly kind: "OBJECT" }
  >,
  cache: DiscriminatorCache,
  observation: MutableObservation
): CResult<StructuralSchemaRootV1> => {
  let current = tree;
  while (current.kind !== "LEAF") {
    const read = readDiscriminator(
      payload,
      current.fieldName,
      current.discriminatorOrdinal,
      cache,
      observation
    );
    if (!read.ok) {
      return read;
    }
    if (current.kind === "PRESENCE") {
      current = read.value.present ? current.present : current.absent;
      continue;
    }
    if (!read.value.present || read.value.value === undefined) {
      if (current.kind === "EXPLICIT_VERSION" && current.absent !== null) {
        current = current.absent;
        continue;
      }
      return failure(F15, discriminatorPath(current.discriminatorOrdinal));
    }
    const literal = primitiveLiteral(read.value.value);
    if (!literal.ok) {
      return failure(F16, discriminatorPath(current.discriminatorOrdinal));
    }
    const matches = current.cases.filter((entry) =>
      literalEquals(entry.literal, literal.value)
    );
    if (matches.length === 0) {
      return failure(F17, discriminatorPath(current.discriminatorOrdinal));
    }
    if (matches.length > 1) {
      return failure(F19, discriminatorPath(current.discriminatorOrdinal));
    }
    const match = matches[0];
    if (match === undefined) {
      return failure(F18, discriminatorPath(current.discriminatorOrdinal));
    }
    current = match.next;
  }
  return success(current.root);
};

type TraversalContext = {
  readonly authority: {
    readonly nodesById: Readonly<Record<string, StructuralSchemaNodeV1>>;
    readonly nodeOrdinalsByNodeId: Readonly<Record<string, number>>;
  };
  readonly eventBranchOrdinal: number;
  readonly observation: MutableObservation;
  readonly discriminatorCache: DiscriminatorCache;
};

const pathWith = (
  path: readonly DomainEventStructuralPathSegment[],
  segment: DomainEventStructuralPathSegment
): readonly DomainEventStructuralPathSegment[] => [...path, segment];

const acquireObjectChild = (
  object: Extract<InternalCanonicalRuntimeValue, { readonly kind: "OBJECT" }>,
  fieldName: string,
  isPayloadRoot: boolean,
  context: TraversalContext
): InternalCanonicalRuntimeObjectEntry | undefined => {
  const entry = findEntry(object, fieldName);
  if (entry !== undefined) {
    if (
      !isPayloadRoot ||
      context.discriminatorCache[fieldName]?.value !== entry.value
    ) {
      context.observation.payloadContentReads += 1;
    }
  }
  return entry;
};

const structuralLiteralMatches = (
  node: InternalCanonicalRuntimeValue,
  literal: StructuralLiteralV1
): boolean => {
  if (literal === null) return node.kind === "NULL";
  switch (typeof literal) {
    case "boolean":
      return node.kind === "BOOLEAN" && node.value === literal;
    case "number":
      return node.kind === "INTEGER" && node.value === literal;
    case "string":
      return node.kind === "STRING" && node.value === literal;
  }
};

const literalKindMatches = (
  node: InternalCanonicalRuntimeValue,
  literal: StructuralLiteralV1
): boolean => {
  if (literal === null) return node.kind === "NULL";
  switch (typeof literal) {
    case "boolean":
      return node.kind === "BOOLEAN";
    case "number":
      return node.kind === "INTEGER";
    case "string":
      return node.kind === "STRING";
  }
};

const isInternalTraversalFailure = (value: CFailure): boolean =>
  value.leafId === F20 ||
  value.leafId === F20_NODE_ORDINAL ||
  value.leafId === F20_EVENT_BRANCH ||
  value.leafId === F20_TAGGED_VARIANT ||
  value.leafId === F20_TAGGED_FIELD ||
  value.leafId === F20_TAGGED_MULTIPLE ||
  value.leafId === F30 ||
  value.leafId === F34;

const leafForTaggedContext = (
  plain: DomainEventStructuralDiagnosticLeafIdV1,
  tagged: DomainEventStructuralDiagnosticLeafIdV1,
  coordinate: TaggedUnionCoordinateV1 | null
): DomainEventStructuralDiagnosticLeafIdV1 =>
  coordinate === null ? plain : tagged;

const findEntryWithOrdinal = (
  object: Extract<InternalCanonicalRuntimeValue, { readonly kind: "OBJECT" }>,
  key: string
): { readonly entry: InternalCanonicalRuntimeObjectEntry; readonly ordinal: number } | null => {
  for (let index = 0; index < object.entries.length; index += 1) {
    const entry = object.entries[index];
    if (entry !== undefined && entry.key === key) {
      return Object.freeze({ entry, ordinal: index + 1 });
    }
  }
  return null;
};

const createTaggedCoordinate = (
  eventBranchOrdinal: number,
  astNodeOrdinal: number,
  path: readonly DomainEventStructuralPathSegment[],
  fieldOrdinal: number | null,
  state: TaggedUnionCoordinateV1["state"],
  taggedVariantOrdinal?: number
): TaggedUnionCoordinateV1 | null => {
  if (
    !Number.isSafeInteger(eventBranchOrdinal) ||
    eventBranchOrdinal < 1 ||
    eventBranchOrdinal > 59 ||
    !Number.isSafeInteger(astNodeOrdinal) ||
    astNodeOrdinal < 1 ||
    (fieldOrdinal !== null &&
      (!Number.isSafeInteger(fieldOrdinal) || fieldOrdinal < 1))
  ) {
    return null;
  }
  const taggedUnionPath = boundDomainEventStructuralPath(path);
  if (state === "MISSING_DISCRIMINANT") {
    return Object.freeze({
      eventBranchOrdinal,
      astNodeOrdinal,
      taggedUnionPath,
      field: null,
      state
    });
  }
  if (fieldOrdinal === null) return null;
  const field = Object.freeze({
    containerPath: taggedUnionPath,
    canonicalObjectEntryOrdinal: fieldOrdinal
  });
  if (state === "KNOWN_VARIANT") {
    if (
      taggedVariantOrdinal === undefined ||
      !Number.isSafeInteger(taggedVariantOrdinal) ||
      taggedVariantOrdinal < 1
    ) {
      return null;
    }
    return Object.freeze({
      eventBranchOrdinal,
      astNodeOrdinal,
      taggedUnionPath,
      field,
      state,
      taggedVariantOrdinal
    });
  }
  return Object.freeze({
    eventBranchOrdinal,
    astNodeOrdinal,
    taggedUnionPath,
    field,
    state
  });
};

type RefinementExecutionMetadata = {
  readonly refinementVersion: string;
  readonly refinementKind: string;
  readonly baseNodeKind: string;
  readonly alias?: string;
};

const executeRefinement = (
  metadata: RefinementExecutionMetadata,
  value: unknown,
  path: readonly DomainEventStructuralPathSegment[],
  activeTaggedUnionCoordinate: TaggedUnionCoordinateV1 | null = null
): CResult<string> => {
  if (
    metadata.refinementVersion !==
      DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION ||
    metadata.baseNodeKind !== "STRING" ||
    typeof value !== "string"
  ) {
    return failure(F30, path);
  }
  if (metadata.refinementKind === "NON_EMPTY_TRIMMED_STRING") {
    if (metadata.alias !== undefined) {
      return failure(F30, path);
    }
    return trimPrimitiveString(value).length > 0
      ? success(value)
      : failure(
          leafForTaggedContext(F29, F29_TAGGED, activeTaggedUnionCoordinate),
          path,
          activeTaggedUnionCoordinate
        );
  }
  if (
    metadata.refinementKind !== "ID_STRING" ||
    metadata.alias === undefined ||
    !STRUCTURAL_ID_ALIASES_V1.some((alias) => alias === metadata.alias)
  ) {
    return failure(F30, path);
  }
  return value.length > 0 && value === trimPrimitiveString(value)
    ? success(value)
    : failure(
        leafForTaggedContext(F29, F29_TAGGED, activeTaggedUnionCoordinate),
        path,
        activeTaggedUnionCoordinate
      );
};

const traverseNode = (
  nodeId: string,
  input: InternalCanonicalRuntimeValue,
  path: readonly DomainEventStructuralPathSegment[],
  context: TraversalContext,
  isPayloadRoot = false,
  activeTaggedUnionCoordinate: TaggedUnionCoordinateV1 | null = null
): CResult<unknown> => {
  const schema = getNode(context.authority.nodesById, nodeId);
  if (schema === undefined) {
    return failure(F20, path);
  }
  const astNodeOrdinal = context.authority.nodeOrdinalsByNodeId[nodeId];
  if (astNodeOrdinal === undefined) {
    return failure(F20_NODE_ORDINAL, path);
  }
  const kindFailure = (): CFailure =>
    failure(
      leafForTaggedContext(F23, F23_TAGGED, activeTaggedUnionCoordinate),
      path,
      activeTaggedUnionCoordinate
    );
  const literalFailure = (): CFailure =>
    failure(
      leafForTaggedContext(F24, F24_TAGGED, activeTaggedUnionCoordinate),
      path,
      activeTaggedUnionCoordinate
    );
  const cardinalityFailure = (): CFailure =>
    failure(
      leafForTaggedContext(F25, F25_TAGGED, activeTaggedUnionCoordinate),
      path,
      activeTaggedUnionCoordinate
    );
  switch (schema.kind) {
    case "NULL":
      return input.kind === "NULL" ? success(null) : kindFailure();
    case "BOOLEAN":
      return input.kind === "BOOLEAN"
        ? success(input.value)
        : kindFailure();
    case "SAFE_INTEGER":
      return input.kind === "INTEGER"
        ? success(input.value)
        : kindFailure();
    case "STRING":
      return input.kind === "STRING"
        ? success(input.value)
        : kindFailure();
    case "LITERAL":
      return structuralLiteralMatches(input, schema.value)
        ? success(
            input.kind === "NULL"
              ? null
              : input.kind === "BOOLEAN" ||
                  input.kind === "INTEGER" ||
                  input.kind === "STRING"
                ? input.value
                : null
          )
        : input.kind === "ARRAY" || input.kind === "OBJECT"
          ? kindFailure()
          : literalFailure();
    case "ENUM": {
      if (
        input.kind !== "NULL" &&
        input.kind !== "BOOLEAN" &&
        input.kind !== "INTEGER" &&
        input.kind !== "STRING"
      ) {
        return kindFailure();
      }
      const matched = schema.values.some((literal) =>
        structuralLiteralMatches(input, literal)
      );
      if (!matched) return literalFailure();
      return success(
        input.kind === "NULL" ? null : input.value
      );
    }
    case "NULLABLE":
      return input.kind === "NULL"
        ? success(null)
        : traverseNode(
            schema.childNodeId,
            input,
            path,
            context,
            isPayloadRoot,
            activeTaggedUnionCoordinate
          );
    case "EXACT_RECORD": {
      if (input.kind !== "OBJECT") return kindFailure();
      for (const field of schema.fields) {
        if (!hasEntry(input, field.fieldName)) {
          return failure(
            leafForTaggedContext(F21, F21_TAGGED, activeTaggedUnionCoordinate),
            pathWith(path, {
              kind: "PAYLOAD_FIELD_ORDINAL",
              ordinal: field.fieldOrdinal
            }),
            activeTaggedUnionCoordinate
          );
        }
      }
      for (let index = 0; index < input.entries.length; index += 1) {
        const entry = input.entries[index];
        if (
          entry !== undefined &&
          !schema.fields.some((field) => field.fieldName === entry.key)
        ) {
          return failure(
            leafForTaggedContext(F22, F22_TAGGED, activeTaggedUnionCoordinate),
            pathWith(path, {
              kind: "PAYLOAD_EXTRA_ENTRY_ORDINAL",
              ordinal: index + 1
            }),
            activeTaggedUnionCoordinate
          );
        }
      }
      const output = Object.create(null) as Record<string, unknown>;
      for (const field of schema.fields) {
        const entry = acquireObjectChild(
          input,
          field.fieldName,
          isPayloadRoot,
          context
        );
        if (entry === undefined) {
          return failure(
            leafForTaggedContext(F21, F21_TAGGED, activeTaggedUnionCoordinate),
            pathWith(path, {
              kind: "PAYLOAD_FIELD_ORDINAL",
              ordinal: field.fieldOrdinal
            }),
            activeTaggedUnionCoordinate
          );
        }
        const childPath = pathWith(path, {
          kind: "PAYLOAD_FIELD_ORDINAL",
          ordinal: field.fieldOrdinal
        });
        const child = traverseNode(
          field.childNodeId,
          entry.value,
          childPath,
          context,
          false,
          activeTaggedUnionCoordinate
        );
        if (!child.ok) return child;
        output[field.fieldName] = child.value;
      }
      return success(Object.freeze(output));
    }
    case "ARRAY":
    case "NON_EMPTY_ARRAY":
    case "BOUNDED_ARRAY": {
      if (input.kind !== "ARRAY") return kindFailure();
      const minimum =
        schema.kind === "ARRAY" ? 0 : schema.minItems;
      const maximum =
        schema.kind === "ARRAY" || schema.kind === "NON_EMPTY_ARRAY"
          ? null
          : schema.maxItems;
      if (
        input.values.length < minimum ||
        (maximum !== null && input.values.length > maximum)
      ) {
        return cardinalityFailure();
      }
      const output: unknown[] = [];
      for (let index = 0; index < input.values.length; index += 1) {
        const childInput = input.values[index];
        if (childInput === undefined) return cardinalityFailure();
        context.observation.payloadContentReads += 1;
        const child = traverseNode(
          schema.elementNodeId,
          childInput,
          pathWith(path, { kind: "ARRAY_INDEX", index }),
          context,
          false,
          activeTaggedUnionCoordinate
        );
        if (!child.ok) return child;
        output.push(child.value);
      }
      return success(Object.freeze(output));
    }
    case "TUPLE": {
      if (input.kind !== "ARRAY") return kindFailure();
      if (input.values.length !== schema.elementNodeIds.length) {
        return cardinalityFailure();
      }
      const output: unknown[] = [];
      for (let index = 0; index < schema.elementNodeIds.length; index += 1) {
        const childNodeId = schema.elementNodeIds[index];
        const childInput = input.values[index];
        if (childNodeId === undefined || childInput === undefined) {
          return cardinalityFailure();
        }
        context.observation.payloadContentReads += 1;
        const child = traverseNode(
          childNodeId,
          childInput,
          pathWith(path, { kind: "TUPLE_INDEX", index }),
          context,
          false,
          activeTaggedUnionCoordinate
        );
        if (!child.ok) return child;
        output.push(child.value);
      }
      return success(Object.freeze(output));
    }
    case "TAGGED_UNION": {
      if (input.kind !== "OBJECT") return kindFailure();
      if (
        !Number.isSafeInteger(context.eventBranchOrdinal) ||
        context.eventBranchOrdinal < 1 ||
        context.eventBranchOrdinal > 59
      ) {
        return failure(F20_EVENT_BRANCH);
      }
      const located = findEntryWithOrdinal(input, schema.tagField);
      if (located === null) {
        const coordinate = createTaggedCoordinate(
          context.eventBranchOrdinal,
          astNodeOrdinal,
          path,
          null,
          "MISSING_DISCRIMINANT"
        );
        if (coordinate === null) return failure(F20_TAGGED_FIELD, path);
        return failure(F26_MISSING, path, coordinate);
      }
      if (
        !Number.isSafeInteger(located.ordinal) ||
        located.ordinal < 1 ||
        located.ordinal > input.entries.length
      ) {
        return failure(F20_TAGGED_FIELD, path);
      }
      context.observation.payloadContentReads += 1;
      if (
        !schema.branches.some((branch) =>
          literalKindMatches(located.entry.value, branch.tagLiteral)
        )
      ) {
        const coordinate = createTaggedCoordinate(
          context.eventBranchOrdinal,
          astNodeOrdinal,
          path,
          located.ordinal,
          "INVALID_DISCRIMINANT_TYPE"
        );
        if (coordinate === null) return failure(F20_TAGGED_FIELD, path);
        return failure(F26_WRONG_KIND, path, coordinate);
      }
      let match:
        | (typeof schema.branches)[number]
        | undefined;
      let matchCount = 0;
      for (let index = 0; index < schema.branches.length; index += 1) {
        const branch = schema.branches[index];
        if (
          branch === undefined ||
          branch.branchOrdinal !== index + 1 ||
          branch.branchOrdinal < 1
        ) {
          return failure(F20_TAGGED_VARIANT, path);
        }
        if (structuralLiteralMatches(located.entry.value, branch.tagLiteral)) {
          match = branch;
          matchCount += 1;
        }
      }
      if (matchCount === 0 || match === undefined) {
        const coordinate = createTaggedCoordinate(
          context.eventBranchOrdinal,
          astNodeOrdinal,
          path,
          located.ordinal,
          "UNKNOWN_DISCRIMINANT_VALUE"
        );
        if (coordinate === null) return failure(F20_TAGGED_FIELD, path);
        return failure(F26_UNKNOWN, path, coordinate);
      }
      if (matchCount > 1) {
        return failure(F20_TAGGED_MULTIPLE, path);
      }
      const coordinate = createTaggedCoordinate(
        context.eventBranchOrdinal,
        astNodeOrdinal,
        path,
        located.ordinal,
        "KNOWN_VARIANT",
        match.branchOrdinal
      );
      if (coordinate === null) return failure(F20_TAGGED_FIELD, path);
      return traverseNode(
        match.childNodeId,
        input,
        pathWith(path, {
          kind: "UNION_BRANCH_ORDINAL",
          ordinal: match.branchOrdinal
        }),
        context,
        isPayloadRoot,
        coordinate
      );
    }
    case "CLOSED_UNION": {
      const matches: { ordinal: number; value: unknown }[] = [];
      for (let index = 0; index < schema.branchNodeIds.length; index += 1) {
        const branchNodeId = schema.branchNodeIds[index];
        if (branchNodeId === undefined) return failure(F20, path);
        const branch = traverseNode(
          branchNodeId,
          input,
          pathWith(path, {
            kind: "UNION_BRANCH_ORDINAL",
            ordinal: index + 1
          }),
          context,
          isPayloadRoot,
          activeTaggedUnionCoordinate
        );
        if (branch.ok) {
          matches.push({ ordinal: index + 1, value: branch.value });
        } else if (isInternalTraversalFailure(branch)) {
          return branch;
        }
      }
      if (matches.length === 0) return failure(F27, path);
      if (matches.length > 1) return failure(F28, path);
      return success(matches[0]?.value);
    }
    case "REFINEMENT": {
      const baseSchema = getNode(
        context.authority.nodesById,
        schema.baseNodeId
      );
      if (baseSchema === undefined) {
        return failure(F30, path);
      }
      const base = traverseNode(
        schema.baseNodeId,
        input,
        path,
        context,
        isPayloadRoot,
        activeTaggedUnionCoordinate
      );
      if (!base.ok) return base;
      return executeRefinement(
        {
          refinementVersion: schema.refinementVersion,
          refinementKind: schema.refinementKind,
          baseNodeKind: baseSchema.kind,
          ...(schema.refinementKind === "ID_STRING"
            ? { alias: schema.alias }
            : {})
        },
        base.value,
        path,
        activeTaggedUnionCoordinate
      );
    }
  }
};

const acquirePayloadObject = (
  envelope: Extract<
    InternalCanonicalRuntimeValue,
    { readonly kind: "OBJECT" }
  >,
  observation: MutableObservation
): CResult<
  Extract<InternalCanonicalRuntimeValue, { readonly kind: "OBJECT" }>
> => {
  const payload = findEntry(envelope, "payload");
  observation.payloadNodeAcquired = true;
  if (payload === undefined || payload.value.kind !== "OBJECT") {
    return failure(F14, envelopePath(14));
  }
  return success(payload.value);
};

const isKnownEventType = (
  authority: HealthyC1ConsumerAuthority,
  value: string
): value is DomainEventType => authority.eventsByType[value] !== undefined;

const buildDetachedEvent = (
  fields: ValidatedEnvelopeFields,
  eventType: DomainEventType,
  payload: unknown
): AnyDomainEventEnvelope => {
  const value = Object.create(null) as Record<string, unknown>;
  value.category = "domain";
  value.eventId = fields.eventId;
  value.gameId = fields.gameId;
  value.eventSequence = fields.eventSequence;
  value.batchId = fields.batchId;
  value.gameVersion = fields.gameVersion;
  value.eventType = eventType;
  value.eventVersion = 1;
  value.rulesBaselineVersion = fields.rulesBaselineVersion;
  value.commandId = fields.commandId;
  value.createdAt = fields.createdAt;
  value.correlationId = fields.correlationId;
  value.causationId = fields.causationId;
  value.payload = payload;
  return Object.freeze(value) as unknown as AnyDomainEventEnvelope;
};

const validateCapturedInternal = (
  token: unknown,
  authority: CAuthorityAdmissionResult,
  observation: MutableObservation
): DomainEventStructuralValidationResult => {
  observation.authorityChecked = true;
  if (authority.status !== "HEALTHY") {
    return toPublicFailure(failure(F01), observation);
  }
  const authenticated =
    readCanonicalRuntimeBackingForStructuralValidation(token);
  if (!authenticated.ok) {
    return toPublicFailure(
      authenticated.diagnostic.code === "INVALID_CAPTURE_TOKEN"
        ? failure(F05)
        : failure(F06),
      observation
    );
  }
  const envelope = validateEnvelope(authenticated.value, observation);
  if (!envelope.ok) return toPublicFailure(envelope, observation);

  observation.eventTypeReads += 1;
  if (!isKnownEventType(authority, envelope.value.fields.eventTypeText)) {
    return toPublicFailure(failure(F12, envelopePath(7)), observation);
  }
  const eventType = envelope.value.fields.eventTypeText;
  const descriptor = authority.eventsByType[eventType];
  if (descriptor === undefined) {
    return toPublicFailure(failure(F12, envelopePath(7)), observation);
  }

  observation.eventVersionReads += 1;
  if (envelope.value.fields.eventVersionValue !== 1) {
    return toPublicFailure(failure(F13, envelopePath(8)), observation);
  }

  const discriminatorCache = Object.create(null) as DiscriminatorCache;
  let payload:
    | Extract<InternalCanonicalRuntimeValue, { readonly kind: "OBJECT" }>
    | undefined;
  let selectedRoot: StructuralSchemaRootV1;
  if (descriptor.decision.kind === "ENVELOPE_RESOLVABLE_BRANCH") {
    selectedRoot = descriptor.decision.root;
  } else {
    const acquired = acquirePayloadObject(
      envelope.value.object,
      observation
    );
    if (!acquired.ok) return toPublicFailure(acquired, observation);
    payload = acquired.value;
    const selected = selectBranch(
      descriptor.decision.tree,
      payload,
      discriminatorCache,
      observation
    );
    if (!selected.ok) return toPublicFailure(selected, observation);
    selectedRoot = selected.value;
  }

  if (payload === undefined) {
    const acquired = acquirePayloadObject(
      envelope.value.object,
      observation
    );
    if (!acquired.ok) return toPublicFailure(acquired, observation);
    payload = acquired.value;
  }

  if (
    !Number.isSafeInteger(selectedRoot.branchOrdinal) ||
    selectedRoot.branchOrdinal < 1 ||
    selectedRoot.branchOrdinal > 59
  ) {
    return toPublicFailure(failure(F20_EVENT_BRANCH), observation);
  }

  observation.astTraversalEntered = true;
  const traversed = traverseNode(
    selectedRoot.rootNodeId,
    payload,
    [],
    {
      authority,
      eventBranchOrdinal: selectedRoot.branchOrdinal,
      observation,
      discriminatorCache
    },
    true
  );
  if (!traversed.ok) return toPublicFailure(traversed, observation);

  let event: AnyDomainEventEnvelope;
  let backing: InternalValidatedDomainEvent;
  try {
    event = buildDetachedEvent(
      envelope.value.fields,
      eventType,
      traversed.value
    );
    backing = Object.freeze({
      eventType,
      eventVersion: 1 as const,
      payloadBranchId: selectedRoot.branchId,
      payloadSchemaIdentity: selectedRoot.rootNodeId,
      event
    });
    observation.validatedBackingConstructed = true;
  } catch {
    return toPublicFailure(failure(F31), observation);
  }

  const issued = issueStructurallyValidatedDomainEvent(backing);
  if (!issued.ok) {
    return Object.freeze({ ok: false as const, diagnostic: issued.diagnostic });
  }
  observation.tokenIssued = true;
  return Object.freeze({
    ok: true as const,
    structuralStatus: "STRUCTURALLY_VALIDATED_DOMAIN_EVENT" as const,
    semanticStatus: "NOT_SEMANTICALLY_ACCEPTED" as const,
    token: issued.token,
    eventType,
    eventVersion: 1 as const,
    payloadBranchId: selectedRoot.branchId,
    payloadSchemaIdentity: selectedRoot.rootNodeId
  });
};

const validateUnknownInternal = (
  input: unknown,
  observation: MutableObservation
): DomainEventStructuralValidationResult => {
  observation.authorityChecked = true;
  if (defaultAuthority.status !== "HEALTHY") {
    return toPublicFailure(failure(F01), observation);
  }
  observation.captureEntered = true;
  const captured = captureCanonicalRuntimeValue(input);
  if (!captured.ok) {
    return toPublicFailure(
      translateCaptureFailure(captured.diagnostic),
      observation
    );
  }
  return validateCapturedInternal(
    captured.token,
    defaultAuthority,
    observation
  );
};

export const validateDomainEventStructure = (
  input: unknown
): DomainEventStructuralValidationResult => {
  const observation = createObservation();
  try {
    return validateUnknownInternal(input, observation);
  } catch {
    return toPublicFailure(failure(F34), observation);
  }
};

export const validateCapturedDomainEventStructure = (
  token: CapturedCanonicalRuntimeValue
): DomainEventStructuralValidationResult => {
  const observation = createObservation();
  try {
    return validateCapturedInternal(token, defaultAuthority, observation);
  } catch {
    return toPublicFailure(failure(F34), observation);
  }
};

export type DomainEventStructuralValidationWithObservation = {
  readonly result: DomainEventStructuralValidationResult;
  readonly observation: DomainEventStructuralValidationObservation;
};

export const validateDomainEventStructureWithObservationForTest = (
  input: unknown
): DomainEventStructuralValidationWithObservation => {
  const observation = createObservation();
  let result: DomainEventStructuralValidationResult;
  try {
    result = validateUnknownInternal(input, observation);
  } catch {
    result = toPublicFailure(failure(F34), observation);
  }
  return Object.freeze({
    result,
    observation: freezeObservation(observation)
  });
};

export const validateCapturedDomainEventStructureWithObservationForTest = (
  token: CapturedCanonicalRuntimeValue
): DomainEventStructuralValidationWithObservation => {
  const observation = createObservation();
  let result: DomainEventStructuralValidationResult;
  try {
    result = validateCapturedInternal(token, defaultAuthority, observation);
  } catch {
    result = toPublicFailure(failure(F34), observation);
  }
  return Object.freeze({
    result,
    observation: freezeObservation(observation)
  });
};

export const inspectDefaultDomainEventStructuralAuthorityForTest = (): Readonly<{
  readonly status: "HEALTHY" | "UNHEALTHY";
  readonly eventCount: number;
  readonly branchCount: number;
  readonly explicitVersionBranchCount: number;
  readonly unversionedBranchCount: number;
  readonly envelopeResolvableBranchCount: number;
  readonly payloadDiscriminatedBranchCount: number;
  readonly discriminatorPathCount: number;
  readonly refinementAliasCount: number;
  readonly astNodeKindCount: number;
}> =>
  defaultAuthority.status === "HEALTHY"
    ? Object.freeze({
        status: "HEALTHY" as const,
        eventCount: defaultAuthority.eventCount,
        branchCount: defaultAuthority.branchCount,
        explicitVersionBranchCount:
          defaultAuthority.explicitVersionBranchCount,
        unversionedBranchCount: defaultAuthority.unversionedBranchCount,
        envelopeResolvableBranchCount:
          defaultAuthority.envelopeResolvableBranchCount,
        payloadDiscriminatedBranchCount:
          defaultAuthority.payloadDiscriminatedBranchCount,
        discriminatorPathCount: defaultAuthority.discriminatorPathCount,
        refinementAliasCount: defaultAuthority.refinementAliasCount,
        astNodeKindCount:
          defaultAuthority.c1.health.nodeKindCount
      })
    : Object.freeze({
        status: "UNHEALTHY" as const,
        eventCount: 0,
        branchCount: 0,
        explicitVersionBranchCount: 0,
        unversionedBranchCount: 0,
        envelopeResolvableBranchCount: 0,
        payloadDiscriminatedBranchCount: 0,
        discriminatorPathCount: 0,
        refinementAliasCount: 0,
        astNodeKindCount: 0
      });

export const validateDomainEventStructuralRefinementForTest = (
  metadata: Readonly<{
    readonly refinementVersion: string;
    readonly refinementKind: string;
    readonly baseNodeKind: string;
    readonly alias?: string;
  }>,
  value: unknown
):
  | {
      readonly ok: true;
      readonly value: string;
    }
  | {
      readonly ok: false;
      readonly diagnosticLeafId: DomainEventStructuralDiagnosticLeafIdV1;
      readonly diagnostic: DomainEventStructuralDiagnostic;
    } => {
  const result = executeRefinement(metadata, value, []);
  return result.ok
    ? Object.freeze({ ok: true as const, value: result.value })
    : Object.freeze({
        ok: false as const,
        diagnosticLeafId: result.leafId,
        diagnostic: createDomainEventStructuralDiagnostic(
          result.leafId,
          result.path,
          result.taggedUnionCoordinate
        )
      });
};

export const validateDomainEventStructuralNodeForTest = (
  authorityResult: StructuralSchemaAuthorityResultV1,
  nodeId: string,
  input: unknown
):
  | { readonly ok: true; readonly value: unknown }
  | {
      readonly ok: false;
      readonly diagnosticLeafId: DomainEventStructuralDiagnosticLeafIdV1;
      readonly diagnostic: DomainEventStructuralDiagnostic;
    } => {
  if (authorityResult.status !== "HEALTHY") {
    return Object.freeze({
      ok: false as const,
      diagnosticLeafId: F20,
      diagnostic: createDomainEventStructuralDiagnostic(F20)
    });
  }
  const captured = captureCanonicalRuntimeValue(input);
  if (!captured.ok) {
    return Object.freeze({
      ok: false as const,
      diagnosticLeafId: translateCaptureFailure(captured.diagnostic).leafId,
      diagnostic: createDomainEventStructuralDiagnostic(
        translateCaptureFailure(captured.diagnostic).leafId
      )
    });
  }
  const authenticated = readCanonicalRuntimeBackingForStructuralValidation(
    captured.token
  );
  if (!authenticated.ok) {
    return Object.freeze({
      ok: false as const,
      diagnosticLeafId: F06,
      diagnostic: createDomainEventStructuralDiagnostic(F06)
    });
  }
  const nodesById = Object.create(null) as Record<
    string,
    StructuralSchemaNodeV1
  >;
  for (const binding of authorityResult.candidate.nodeBindings) {
    nodesById[binding.nodeId] = binding.node;
  }
  Object.freeze(nodesById);
  const nodeOrdinalsByNodeId = Object.create(null) as Record<string, number>;
  for (const entry of authorityResult.traversal.uniqueNodes) {
    if (
      !Number.isSafeInteger(entry.nodeOrdinal) ||
      entry.nodeOrdinal < 1 ||
      entry.nodeId !== entry.node.nodeId ||
      nodesById[entry.nodeId] !== entry.node
    ) {
      return Object.freeze({
        ok: false as const,
        diagnosticLeafId: F20_NODE_ORDINAL,
        diagnostic: createDomainEventStructuralDiagnostic(F20_NODE_ORDINAL)
      });
    }
    nodeOrdinalsByNodeId[entry.nodeId] = entry.nodeOrdinal;
  }
  Object.freeze(nodeOrdinalsByNodeId);
  const eventBranchOrdinal = authorityResult.candidate.roots[0]?.branchOrdinal;
  if (
    eventBranchOrdinal === undefined ||
    !Number.isSafeInteger(eventBranchOrdinal) ||
    eventBranchOrdinal < 1 ||
    eventBranchOrdinal > 59
  ) {
    return Object.freeze({
      ok: false as const,
      diagnosticLeafId: F20_EVENT_BRANCH,
      diagnostic: createDomainEventStructuralDiagnostic(F20_EVENT_BRANCH)
    });
  }
  const traversed = traverseNode(
    nodeId,
    authenticated.value,
    [],
    {
      authority: { nodesById, nodeOrdinalsByNodeId },
      eventBranchOrdinal,
      observation: createObservation(),
      discriminatorCache: Object.freeze(
        Object.create(null) as Record<string, DiscriminatorCacheEntry>
      )
    }
  );
  return traversed.ok
    ? Object.freeze({ ok: true as const, value: traversed.value })
    : Object.freeze({
        ok: false as const,
        diagnosticLeafId: traversed.leafId,
        diagnostic: createDomainEventStructuralDiagnostic(
          traversed.leafId,
          traversed.path,
          traversed.taggedUnionCoordinate
        )
      });
};

export const DOMAIN_EVENT_STRUCTURAL_VALIDATION_RESOURCE_LIMIT =
  CANONICAL_RUNTIME_LIMITS.maxDiagnosticPathSegments;
