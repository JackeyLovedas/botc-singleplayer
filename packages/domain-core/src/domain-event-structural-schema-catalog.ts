import { createHash } from "node:crypto";
import {
  DOMAIN_EVENT_STRUCTURAL_AUDIT_CATALOG_VERSION, DOMAIN_EVENT_STRUCTURAL_AUDIT_PROJECTION_VERSION,
  DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION, DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION,
  DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION,
  DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION,
  formatStructuralOrdinal, type HealthyStructuralSchemaAuthorityV1,
  type StructuralLiteralV1, type StructuralSchemaCensusV1, type StructuralSchemaNodeV1
} from "./domain-event-structural-schema-ast.js";
export const APPROVED_C1_DELTA_REGISTRY_VERSION = "APPROVED_C1_DELTA_REGISTRY_V1" as const;
export const DOMAIN_EVENT_STRUCTURAL_SCHEMA_ARTIFACT_VERSION = "botc-domain-event-structural-schema-artifact-v1" as const;
export const C1_CATALOG_SCOPE = "COMPLETE_C1_40_EVENT_59_BRANCH_AST_AUDIT" as const;
export const CATALOG_V1_SOURCE_SHA256 = "bb8be14de51c2c668b310869983db36d1200c6959830303e953bbc7af2023b26" as const;
export type AtomicDeltaRecordV1 = {
  readonly DeltaId: string; readonly EventType: string; readonly BranchId: string;
  readonly FieldPath: string; readonly PriorRepresentation: string;
  readonly AcceptedAuthority: string; readonly V2AstRepresentation: string;
  readonly RuntimeInputSetChanged: boolean; readonly BehaviorChanged: boolean;
  readonly JustificationAuthority: string;
};
export type ApprovedC1DeltaRegistryV1 = {
  readonly RegistryVersion: typeof APPROVED_C1_DELTA_REGISTRY_VERSION; readonly AstVersion: typeof DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION;
  readonly TraversalVersion: typeof DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION; readonly NormalizationVersion: typeof DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION;
  readonly ProjectionVersion: typeof DOMAIN_EVENT_STRUCTURAL_AUDIT_PROJECTION_VERSION; readonly CatalogVersion: typeof DOMAIN_EVENT_STRUCTURAL_AUDIT_CATALOG_VERSION;
  readonly V1SourceSha256: typeof CATALOG_V1_SOURCE_SHA256;
  readonly ApprovedDeltaCount: 2; readonly UnchangedBranchCount: 57; readonly OtherBranchDeltaCount: 0;
  readonly Records: readonly [AtomicDeltaRecordV1, AtomicDeltaRecordV1];
};
export type C1SupportingAuthorityBinding = {
  readonly SupportingAuthorityId:
    | "SUP-2B20B-P2F1R-C1-001"
    | "SUP-2B20B-P2F1R-C1-002"
    | "SUP-2B20B-P2F1R-C1-003";
  readonly AuthorityDescription: string; readonly Producer: string;
  readonly SourceTestOrFixture: string;
  readonly AuthorityStatus: "ACCEPTED" | "LEGACY";
  readonly UsedByCriteria: readonly string[]; readonly MutationDisposition: "NONE";
};
const deepFreeze = <T>(root: T): T => {
  if (typeof root !== "object" || root === null) return root;
  const pending: object[] = [root];
  const seen = new WeakSet<object>();
  while (pending.length > 0) {
    const current = pending.pop();
    if (current === undefined || seen.has(current)) continue;
    seen.add(current);
    for (const key of Reflect.ownKeys(current)) {
      const descriptor = Object.getOwnPropertyDescriptor(current, key);
      if (descriptor !== undefined && "value" in descriptor) {
        const value: unknown = descriptor.value;
        if (typeof value === "object" && value !== null) pending.push(value);
      }
    }
    Object.freeze(current);
  }
  return root;
};
const B26_DELTA: AtomicDeltaRecordV1 = {
  DeltaId: "B26_SEAMSTRESS_VARIADIC_DELTA",
  EventType: "SeamstressInformationDelivered",
  BranchId: "C-B26-SEAMSTRESS-DELIVERY-U",
  FieldPath: "P|$/f:sourceEffectiveness/t:kind=KNOWN_INEFFECTIVE/f:representedImpairments",
  PriorRepresentation: "CATALOG_V1:TUPLE(length=2,itemSchema=SEAMSTRESS_REPRESENTED_IMPAIRMENT_EVIDENCE_EXACT_RECORD_V1,itemsStructurallyIdentical=true)",
  AcceptedAuthority: "ACCEPTED_B26:SeamstressInformationDeliveredPayload+SeamstressSourceEffectiveness+SeamstressRepresentedImpairmentEvidence;producer=resolveSeamstressSourceEffectiveness;validator=validateSeamstressInformationDeliveredPayloadShape;acceptedHistoricalTests=true",
  V2AstRepresentation: "NON_EMPTY_ARRAY(elementSchema=SEAMSTRESS_REPRESENTED_IMPAIRMENT_EVIDENCE_EXACT_RECORD_V1,minLength=1,maxLength=none,astMinItems=1,astMaxItems=null)",
  RuntimeInputSetChanged: false, BehaviorChanged: false,
  JustificationAuthority: "SUPSET|2|SUP-2B20B-P2F1R-C1-001|SUP-2B20B-P2F1R-C1-002"
};
const B54_DELTA: AtomicDeltaRecordV1 = {
  DeltaId: "B54_PLACEHOLDER_UNION_NORMALIZATION_DELTA",
  EventType: "MathematicianInformationDelivered",
  BranchId: "C-B54-MATHEMATICIAN-DELIVERY-U",
  FieldPath: "S|3|$/f:sourceContract/t:kind=BASE_MATHEMATICIAN/f:abilityInstance|$/f:sourceContract/t:kind=PHILOSOPHER_GAINED_MATHEMATICIAN_V1/f:abilityInstance|$/f:sourceContract/t:kind=PHILOSOPHER_GAINED_MATHEMATICIAN_V2/f:abilityInstance",
  PriorRepresentation: "CATALOG_V1:eachOccurrence=CLOSED_UNION(selection=EXACTLY_ONE,sourceMemberCount=4,survivorCount=1,identicalEmptyPlaceholderCount=3)",
  AcceptedAuthority: "ACCEPTED_B54:MathematicianSourceContract+FirstNightAbilityInstanceProvenance;producers=abilityInstanceFor+sourceContractFor;validators=validSource+validateFirstNightAbilityInstanceProvenanceShape;acceptedAuthorityAuditTestLedger=true",
  V2AstRepresentation: "sourceContract=TAGGED_UNION(tag=kind,memberCount=3);BASE_MATHEMATICIAN.abilityInstance=B54_BASE_ROLE_TASK_EXACT_RECORD_V1;PHILOSOPHER_GAINED_MATHEMATICIAN_V1.abilityInstance=B54_PHILOSOPHER_GAINED_TASK_V1_EXACT_RECORD_V1;PHILOSOPHER_GAINED_MATHEMATICIAN_V2.abilityInstance=B54_PHILOSOPHER_GAINED_TASK_V2_EXACT_RECORD_V1;generalFirstNightAbilityInstanceProvenance=TAGGED_UNION(tag=kind,memberCount=4)",
  RuntimeInputSetChanged: false, BehaviorChanged: false,
  JustificationAuthority: "SUPSET|1|SUP-2B20B-P2F1R-C1-003"
};
export const APPROVED_C1_DELTA_REGISTRY_V1: ApprovedC1DeltaRegistryV1 =
  deepFreeze({
    RegistryVersion: APPROVED_C1_DELTA_REGISTRY_VERSION,
    AstVersion: DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION,
    TraversalVersion: DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION,
    NormalizationVersion: DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION,
    ProjectionVersion: DOMAIN_EVENT_STRUCTURAL_AUDIT_PROJECTION_VERSION,
    CatalogVersion: DOMAIN_EVENT_STRUCTURAL_AUDIT_CATALOG_VERSION,
    V1SourceSha256: CATALOG_V1_SOURCE_SHA256,
    ApprovedDeltaCount: 2,
    UnchangedBranchCount: 57,
    OtherBranchDeltaCount: 0,
    Records: [B26_DELTA, B54_DELTA]
  });
export const C1_SUPPORTING_AUTHORITY_BINDINGS: readonly C1SupportingAuthorityBinding[] =
  deepFreeze([
    {
      SupportingAuthorityId: "SUP-2B20B-P2F1R-C1-001",
      AuthorityDescription: "Accepted Seamstress B26 shape",
      Producer: "resolveSeamstressSourceEffectiveness",
      SourceTestOrFixture: "packages/domain-core/src/seamstress.test.ts :: accepted Seamstress information delivery fixtures",
      AuthorityStatus: "ACCEPTED",
      UsedByCriteria: ["C1-C04A", "C1-C16"],
      MutationDisposition: "NONE"
    },
    {
      SupportingAuthorityId: "SUP-2B20B-P2F1R-C1-002",
      AuthorityDescription: "Immutable V1 migration baseline",
      Producer: "C V1 schema-catalog materialization artifact",
      SourceTestOrFixture: "docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md",
      AuthorityStatus: "LEGACY",
      UsedByCriteria: ["C1-C13"],
      MutationDisposition: "NONE"
    },
    {
      SupportingAuthorityId: "SUP-2B20B-P2F1R-C1-003",
      AuthorityDescription: "Accepted B54 Mathematician source and provenance authority",
      Producer: "abilityInstanceFor and sourceContractFor in packages/domain-core/src/mathematician-internal.ts",
      SourceTestOrFixture: "packages/application/src/mathematician-information.test.ts :: accepted base, gained V1, and gained V2 source-contract fixtures",
      AuthorityStatus: "ACCEPTED",
      UsedByCriteria: ["C1-C04B", "C1-C13", "C1-C16"],
      MutationDisposition: "NONE"
    }
  ]);
export type ApprovedDeltaRegistryAuditResultV1 =
  | {
      readonly valid: true; readonly code: "APPROVED_C1_DELTA_REGISTRY_V1_MATCH";
      readonly approvedDeltaCount: 2; readonly unchangedBranchCount: 57; readonly otherBranchDeltaCount: 0;
    }
  | {
      readonly valid: false; readonly code: "INVALID_REGISTRY_SHAPE" | "INVALID_REGISTRY_VALUE" | "INVALID_REGISTRY_COUNTS" | "INVALID_DELTA_RECORD" | "INVALID_SUPPORTING_AUTHORITY";
      readonly failClosed: true;
    };
const REGISTRY_KEYS = Object.freeze(["RegistryVersion", "AstVersion", "TraversalVersion", "NormalizationVersion", "ProjectionVersion", "CatalogVersion", "V1SourceSha256", "ApprovedDeltaCount", "UnchangedBranchCount", "OtherBranchDeltaCount", "Records"] as const);
const DELTA_KEYS = Object.freeze(["DeltaId", "EventType", "BranchId", "FieldPath", "PriorRepresentation", "AcceptedAuthority", "V2AstRepresentation", "RuntimeInputSetChanged", "BehaviorChanged", "JustificationAuthority"] as const);
const SUPPORT_KEYS = Object.freeze(["SupportingAuthorityId", "AuthorityDescription", "Producer", "SourceTestOrFixture", "AuthorityStatus", "UsedByCriteria", "MutationDisposition"] as const);
const isExactOwnKeySet = (value: object, expectedKeys: readonly string[]): boolean => {
  if (Object.getOwnPropertySymbols(value).length !== 0) return false;
  const keys = Object.keys(value);
  return (
    keys.length === expectedKeys.length &&
    expectedKeys.every((key) => Object.hasOwn(value, key))
  );
};
const isUnknownArray = (value: unknown): value is readonly unknown[] =>
  Array.isArray(value);
const isExactDeltaRecord = (
  candidate: unknown,
  expected: AtomicDeltaRecordV1
): boolean => {
  if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate)) {
    return false;
  }
  if (!isExactOwnKeySet(candidate, DELTA_KEYS)) return false;
  const record = candidate as Readonly<Record<string, unknown>>;
  return DELTA_KEYS.every((key) => record[key] === expected[key]);
};
export const auditApprovedC1DeltaRegistry = (
  candidate: unknown,
  supportingAuthorities: unknown = C1_SUPPORTING_AUTHORITY_BINDINGS
): ApprovedDeltaRegistryAuditResultV1 => {
  if (typeof candidate !== "object" || candidate === null || Array.isArray(candidate)) {
    return { valid: false, code: "INVALID_REGISTRY_SHAPE", failClosed: true };
  }
  if (!isExactOwnKeySet(candidate, REGISTRY_KEYS)) {
    return { valid: false, code: "INVALID_REGISTRY_SHAPE", failClosed: true };
  }
  const record = candidate as Readonly<Record<string, unknown>>;
  if (
    record.RegistryVersion !== APPROVED_C1_DELTA_REGISTRY_VERSION ||
    record.AstVersion !== DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION ||
    record.TraversalVersion !==
      DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION ||
    record.NormalizationVersion !== DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION ||
    record.ProjectionVersion !== DOMAIN_EVENT_STRUCTURAL_AUDIT_PROJECTION_VERSION ||
    record.CatalogVersion !== DOMAIN_EVENT_STRUCTURAL_AUDIT_CATALOG_VERSION ||
    record.V1SourceSha256 !== CATALOG_V1_SOURCE_SHA256
  ) {
    return { valid: false, code: "INVALID_REGISTRY_VALUE", failClosed: true };
  }
  if (
    record.ApprovedDeltaCount !== 2 ||
    record.UnchangedBranchCount !== 57 ||
    record.OtherBranchDeltaCount !== 0
  ) {
    return { valid: false, code: "INVALID_REGISTRY_COUNTS", failClosed: true };
  }
  if (
    !Array.isArray(record.Records) ||
    record.Records.length !== 2 ||
    !isExactDeltaRecord(record.Records[0], B26_DELTA) ||
    !isExactDeltaRecord(record.Records[1], B54_DELTA)
  ) {
    return { valid: false, code: "INVALID_DELTA_RECORD", failClosed: true };
  }
  if (
    !isUnknownArray(supportingAuthorities) ||
    supportingAuthorities.length !== C1_SUPPORTING_AUTHORITY_BINDINGS.length ||
    supportingAuthorities.some((entry, index) => {
      const expected = C1_SUPPORTING_AUTHORITY_BINDINGS[index];
      if (
        expected === undefined ||
        typeof entry !== "object" ||
        entry === null ||
        isUnknownArray(entry) ||
        !isExactOwnKeySet(entry, SUPPORT_KEYS)
      ) return true;
      const record = entry as Readonly<Record<string, unknown>>;
      return SUPPORT_KEYS.some((key) =>
        key === "UsedByCriteria"
          ? !Array.isArray(record[key]) ||
            record[key].length !== expected[key].length ||
            record[key].some((value, criterionIndex) => value !== expected[key][criterionIndex])
          : record[key] !== expected[key]
      );
    })
  ) {
    return { valid: false, code: "INVALID_SUPPORTING_AUTHORITY", failClosed: true };
  }
  return {
    valid: true,
    code: "APPROVED_C1_DELTA_REGISTRY_V1_MATCH",
    approvedDeltaCount: 2,
    unchangedBranchCount: 57,
    otherBranchDeltaCount: 0
  };
};
const quote = (value: string): string => {
  let result = '"';
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) {
        throw new TypeError("Lone surrogate is not canonical");
      }
      result += value[index] ?? "";
      result += value[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      throw new TypeError("Lone surrogate is not canonical");
    }
    switch (codeUnit) {
      case 0x08:
        result += "\\b";
        break;
      case 0x09:
        result += "\\t";
        break;
      case 0x0a:
        result += "\\n";
        break;
      case 0x0c:
        result += "\\f";
        break;
      case 0x0d:
        result += "\\r";
        break;
      case 0x22:
        result += '\\"';
        break;
      case 0x5c:
        result += "\\\\";
        break;
      default:
        if (codeUnit <= 0x1f || codeUnit === 0x7f) {
          result += `\\u${codeUnit.toString(16).padStart(4, "0")}`;
        } else {
          result += value[index] ?? "";
        }
    }
  }
  return `${result}"`;
};
const renderLiteral = (value: StructuralLiteralV1): string => {
  if (value === null) return "null";
  if (typeof value === "boolean") return `b:${String(value)}`;
  if (typeof value === "number") return `i:${value.toString(10)}`;
  return `s:${quote(value)}`;
};
const renderList = (values: readonly string[]): string => `[${values.join(",")}]`;
const renderNode = (
  ordinal: number,
  node: StructuralSchemaNodeV1
): string => {
  const prefix = `N|${formatStructuralOrdinal(ordinal)}|kind=${node.kind}|nodeId=${quote(node.nodeId)}`;
  switch (node.kind) {
    case "NULL":
    case "BOOLEAN":
    case "SAFE_INTEGER":
    case "STRING":
      return prefix;
    case "LITERAL":
      return `${prefix}|literal=${renderLiteral(node.value)}`;
    case "ENUM":
      return `${prefix}|values=${renderList(node.values.map(renderLiteral))}`;
    case "NULLABLE":
      return `${prefix}|child=${quote(node.childNodeId)}`;
    case "EXACT_RECORD":
      return `${prefix}|fields=${renderList(
        node.fields.map(
          (field) =>
            `(${formatStructuralOrdinal(field.fieldOrdinal)},${quote(field.fieldName)},REQUIRED,NOT_OPTIONAL,${quote(field.childNodeId)})`
        )
      )}`;
    case "ARRAY":
      return `${prefix}|element=${quote(node.elementNodeId)}`;
    case "NON_EMPTY_ARRAY":
      return `${prefix}|minItems=1|maxItems=null|element=${quote(node.elementNodeId)}`;
    case "BOUNDED_ARRAY":
      return `${prefix}|minItems=${node.minItems}|maxItems=${node.maxItems}|element=${quote(node.elementNodeId)}`;
    case "TUPLE":
      return `${prefix}|tupleLength=${node.elementNodeIds.length}|elements=${renderList(node.elementNodeIds.map(quote))}`;
    case "TAGGED_UNION":
      return `${prefix}|tagField=${quote(node.tagField)}|branches=${renderList(
        node.branches.map(
          (branch) =>
            `(${formatStructuralOrdinal(branch.branchOrdinal)},${renderLiteral(branch.tagLiteral)},${quote(branch.childNodeId)})`
        )
      )}`;
    case "CLOSED_UNION":
      return `${prefix}|selection=EXACTLY_ONE|branches=${renderList(node.branchNodeIds.map(quote))}`;
    case "REFINEMENT":
      return node.refinementKind === "ID_STRING"
        ? `${prefix}|refinementVersion=${quote(node.refinementVersion)}|refinementKind=ID_STRING|alias=${quote(node.alias)}|base=${quote(node.baseNodeId)}`
        : `${prefix}|refinementVersion=${quote(node.refinementVersion)}|refinementKind=NON_EMPTY_TRIMMED_STRING|base=${quote(node.baseNodeId)}`;
  }
};
const renderDelta = (record: AtomicDeltaRecordV1): string =>
  `D|DeltaId=${quote(record.DeltaId)}|EventType=${quote(record.EventType)}|BranchId=${quote(record.BranchId)}|FieldPath=${quote(record.FieldPath)}|PriorRepresentation=${quote(record.PriorRepresentation)}|AcceptedAuthority=${quote(record.AcceptedAuthority)}|V2AstRepresentation=${quote(record.V2AstRepresentation)}|RuntimeInputSetChanged=${String(record.RuntimeInputSetChanged)}|BehaviorChanged=${String(record.BehaviorChanged)}|JustificationAuthority=${quote(record.JustificationAuthority)}`;
const renderCensus = (prefix: "U" | "X", census: StructuralSchemaCensusV1): string =>
  `${prefix}|events=${census.events}|roots=${census.roots}|rootReferences=${census.rootReferences}|nodes=${census.nodes}|childReferences=${census.childReferences}|exactRecords=${census.exactRecords}|recordFields=${census.recordFields}|requiredFields=${census.requiredFields}|optionalFields=${census.optionalFields}|arrays=${census.arrays}|nonEmptyArrays=${census.nonEmptyArrays}|boundedArrays=${census.boundedArrays}|tuples=${census.tuples}|taggedUnions=${census.taggedUnions}|closedUnions=${census.closedUnions}|nullableNodes=${census.nullableNodes}|enums=${census.enums}|literals=${census.literals}|strings=${census.strings}|safeIntegers=${census.safeIntegers}|booleans=${census.booleans}|idRefinements=${census.idRefinements}|unresolvedReferences=${census.unresolvedReferences}|cycles=${census.cycles}|openRecords=${census.openRecords}|additionalPropertiesNodes=${census.additionalPropertiesNodes}|requiredUndefinedFields=${census.requiredUndefinedFields}`;
export type CanonicalSchemaArtifactV1 = {
  readonly artifactVersion: typeof DOMAIN_EVENT_STRUCTURAL_SCHEMA_ARTIFACT_VERSION;
  readonly bytes: readonly number[];
  readonly byteLength: number;
  readonly sha256: string;
  readonly lines: readonly string[];
};
const eventDescriptorLines = (
  authority: HealthyStructuralSchemaAuthorityV1
): readonly string[] =>
  Array.from(
    authority.candidate.roots.reduce((events, root) => {
      const existing = events.get(root.eventOrdinal);
      if (existing === undefined) {
        events.set(root.eventOrdinal, {
          eventType: root.eventType,
          resultTypeNames: [root.resultTypeName],
          branchOrdinals: [root.branchOrdinal]
        });
      } else {
        existing.resultTypeNames.push(root.resultTypeName);
        existing.branchOrdinals.push(root.branchOrdinal);
      }
      return events;
    }, new Map<number, { eventType: string; resultTypeNames: string[]; branchOrdinals: number[] }>()),
    ([eventOrdinal, event]) =>
      `E|${formatStructuralOrdinal(eventOrdinal)}|eventType=${quote(event.eventType)}|resultTypes=${renderList(event.resultTypeNames.map(quote))}|branchOrdinals=${renderList(event.branchOrdinals.map(formatStructuralOrdinal))}`
  );
const buildArtifactLines = (
  authority: HealthyStructuralSchemaAuthorityV1,
  registry: ApprovedC1DeltaRegistryV1
): readonly string[] => [
  `A|artifactVersion=${quote(DOMAIN_EVENT_STRUCTURAL_SCHEMA_ARTIFACT_VERSION)}`,
  `A|catalogScope=${quote(C1_CATALOG_SCOPE)}`,
  `A|astVersion=${quote(DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION)}`,
  `A|traversalVersion=${quote(DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION)}`,
  `A|normalizationVersion=${quote(DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION)}`,
  `A|projectionVersion=${quote(DOMAIN_EVENT_STRUCTURAL_AUDIT_PROJECTION_VERSION)}`,
  `A|catalogVersion=${quote(DOMAIN_EVENT_STRUCTURAL_AUDIT_CATALOG_VERSION)}`,
  `A|deltaRegistryVersion=${quote(APPROVED_C1_DELTA_REGISTRY_VERSION)}`,
  `H|status=HEALTHY|rootReferences=${authority.health.rootReferenceCount}|uniqueNodes=${authority.health.uniqueNodeCount}|unresolvedReferences=0|cycles=0`,
  ...eventDescriptorLines(authority),
  ...authority.candidate.roots
    .slice()
    .sort((left, right) => left.branchOrdinal - right.branchOrdinal)
    .map(
      (root) =>
        `R|${formatStructuralOrdinal(root.branchOrdinal)}|branchId=${quote(root.branchId)}|eventOrdinal=${formatStructuralOrdinal(root.eventOrdinal)}|eventType=${quote(root.eventType)}|version=${root.versionPolicy.kind === "UNVERSIONED" ? "U" : `E(field=${quote(root.versionPolicy.fieldName)},literal=${renderLiteral(root.versionPolicy.acceptedLiteral)})`}|rootNodeId=${quote(root.rootNodeId)}|resultType=${quote(root.resultTypeName)}`
    ),
  ...authority.traversal.uniqueNodes.map((entry) =>
    renderNode(entry.nodeOrdinal, entry.node)
  ),
  renderCensus("U", authority.uniqueGraphCensus),
  renderCensus("X", authority.expandedOccurrenceCensus),
  `C|approvedDeltaCount=${registry.ApprovedDeltaCount}|unchangedBranchCount=${registry.UnchangedBranchCount}|otherBranchDeltaCount=${registry.OtherBranchDeltaCount}`,
  ...registry.Records.map(renderDelta),
  ...C1_SUPPORTING_AUTHORITY_BINDINGS.map(
    (binding) =>
      `S|SupportingAuthorityId=${quote(binding.SupportingAuthorityId)}|AuthorityStatus=${binding.AuthorityStatus}|UsedByCriteria=${renderList(binding.UsedByCriteria.map(quote))}|MutationDisposition=${binding.MutationDisposition}`
  ),
  "Z|authority=AUDIT_ONLY|runtimeAuthority=false|eventAuthority=false|historyAuthority=false|replayAuthority=false|stateAuthority=false"
];
export const createCanonicalSchemaArtifact = (
  authority: HealthyStructuralSchemaAuthorityV1,
  registry: ApprovedC1DeltaRegistryV1 = APPROVED_C1_DELTA_REGISTRY_V1
): CanonicalSchemaArtifactV1 => {
  const audit = auditApprovedC1DeltaRegistry(registry);
  if (!audit.valid) throw new TypeError(audit.code);
  const lines = buildArtifactLines(authority, registry);
  const encoded = new TextEncoder().encode(`${lines.join("\n")}\n`);
  const bytes = Array.from(encoded);
  const sha256 = createHash("sha256").update(encoded).digest("hex");
  return deepFreeze({
    artifactVersion: DOMAIN_EVENT_STRUCTURAL_SCHEMA_ARTIFACT_VERSION,
    bytes,
    byteLength: bytes.length,
    sha256,
    lines
  });
};
export const renderGeneratedStructuralSchemaCatalogV2 = (
  authority: HealthyStructuralSchemaAuthorityV1
): string => {
  const artifact = createCanonicalSchemaArtifact(authority);
  const sections = [
    "# BOTC Domain Event Structural Schema Catalog V2",
    "## 1. Metadata",
    `M|artifactStatus=${quote("GENERATED_AUDIT_ARTIFACT_NON_RUNTIME_AUTHORITY")}`,
    `M|catalogScope=${quote(C1_CATALOG_SCOPE)}`,
    `M|projectionVersion=${quote(DOMAIN_EVENT_STRUCTURAL_AUDIT_PROJECTION_VERSION)}`,
    `M|traversalVersion=${quote(DOMAIN_EVENT_STRUCTURAL_UNIQUE_NODE_TRAVERSAL_VERSION)}`,
    `M|normalizationVersion=${quote(DOMAIN_EVENT_STRUCTURAL_NORMALIZATION_VERSION)}`,
    `M|sourceAstVersion=${quote(DOMAIN_EVENT_STRUCTURAL_SCHEMA_AST_VERSION)}`,
    `M|refinementVersion=${quote(DOMAIN_EVENT_STRUCTURAL_REFINEMENT_VERSION)}`,
    `M|catalogVersion=${quote(DOMAIN_EVENT_STRUCTURAL_AUDIT_CATALOG_VERSION)}`,
    `M|validatorImplemented=false`,
    `M|deltaRegistryVersion=${quote(APPROVED_C1_DELTA_REGISTRY_VERSION)}`,
    "## 2. Canonical Schema Artifact",
    `G|artifactVersion=${quote(artifact.artifactVersion)}|artifactByteLength=${artifact.byteLength}|artifactSha256=${quote(artifact.sha256)}|digestMechanism=${quote("DIRECT_SHA256_OVER_CANONICAL_ARTIFACT_BYTES_NOT_B")}`,
    "## 3. Health",
    `H|status=HEALTHY|nodeKinds=15|roots=${authority.health.rootReferenceCount}|uniqueNodes=${authority.health.uniqueNodeCount}|unresolvedReferences=0|cycles=0`,
    "## 4. Event Descriptor Manifest",
    ...eventDescriptorLines(authority),
    "## 5. Payload Branch Manifest",
    ...authority.candidate.roots
      .slice()
      .sort((left, right) => left.branchOrdinal - right.branchOrdinal)
      .map(
        (root) =>
          `B|${formatStructuralOrdinal(root.branchOrdinal)}|branchId=${quote(root.branchId)}|eventOrdinal=${formatStructuralOrdinal(root.eventOrdinal)}|eventType=${quote(root.eventType)}|version=${root.versionPolicy.kind === "UNVERSIONED" ? "U" : `E(field=${quote(root.versionPolicy.fieldName)},literal=${renderLiteral(root.versionPolicy.acceptedLiteral)})`}|rootNodeId=${quote(root.rootNodeId)}|resultType=${quote(root.resultTypeName)}`
      ),
    "## 6. Unique Node Manifest",
    ...authority.traversal.uniqueNodes.map((entry) =>
      renderNode(entry.nodeOrdinal, entry.node)
    ),
    "## 7. Root Ownership Manifest",
    ...authority.candidate.roots
      .slice()
      .sort((left, right) => left.branchOrdinal - right.branchOrdinal)
      .map(
        (root) =>
          `R|${formatStructuralOrdinal(root.branchOrdinal)}|branchId=${quote(root.branchId)}|rootNodeId=${quote(root.rootNodeId)}`
      ),
    "## 8. Unique Graph Census",
    renderCensus("U", authority.uniqueGraphCensus),
    "## 9. Expanded Occurrence Census",
    renderCensus("X", authority.expandedOccurrenceCensus),
    "## 10. Approved Delta Registry V1",
    `C|approvedDeltaCount=2|unchangedBranchCount=57|otherBranchDeltaCount=0|auditResult=${quote("APPROVED_C1_DELTA_REGISTRY_V1_MATCH")}`,
    ...APPROVED_C1_DELTA_REGISTRY_V1.Records.map(renderDelta),
    "## 11. Supporting Authority Mapping",
    ...C1_SUPPORTING_AUTHORITY_BINDINGS.map(
      (binding) =>
        `S|SupportingAuthorityId=${quote(binding.SupportingAuthorityId)}|AuthorityDescription=${quote(binding.AuthorityDescription)}|AuthorityStatus=${binding.AuthorityStatus}|UsedByCriteria=${renderList(binding.UsedByCriteria.map(quote))}|MutationDisposition=${binding.MutationDisposition}`
    ),
    "## 12. V1 Migration Baseline",
    `V|baselinePath=${quote("docs/architecture/2B20B-P2F1R-C-domain-event-structural-schema-catalog-v1.md")}`,
    `V|baselineSha256=${quote(CATALOG_V1_SOURCE_SHA256)}`,
    "## 13. Non-Semantic Authority Boundary",
    "Z|fullEventInventoryMaterialized=true|eventExactnessProofs=40|runtimeValidatorImplemented=false|catalogRuntimeAuthority=false|eventAuthority=false|historyAuthority=false|replayAuthority=false|stateAuthority=false",
    "Z|C1-C04A=UNCLAIMED|C1-C04B=UNCLAIMED|C1-C09A=UNCLAIMED|C1-C10=HISTORICAL_INACTIVE|C1-C15=UNCLAIMED"
  ];
  return `${sections.join("\n")}\n`;
};
