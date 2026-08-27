import {
  createC1AdditiveStructuralSchemaAuthority,
  type C1AdditiveDescriptorV1
} from "./domain-event-structural-schema-additive.js";
import {
  createFullC1StructuralSchemaAuthority,
  type StructuralSchemaAuthorityResultV1,
  type StructuralSchemaNodeV1
} from "./domain-event-structural-schema-ast.js";

const stringNode = (nodeId: string): StructuralSchemaNodeV1 => ({ nodeId, kind: "STRING" });
const integerNode = (nodeId: string): StructuralSchemaNodeV1 => ({ nodeId, kind: "SAFE_INTEGER" });
const booleanNode = (nodeId: string): StructuralSchemaNodeV1 => ({ nodeId, kind: "BOOLEAN" });
const literalNode = (nodeId: string, value: string): StructuralSchemaNodeV1 => ({ nodeId, kind: "LITERAL", value });
const enumNode = (nodeId: string, values: readonly string[]): StructuralSchemaNodeV1 => ({ nodeId, kind: "ENUM", values: [...values].sort((left, right) => left < right ? -1 : left === right ? 0 : 1) });
const nullableStringNode = (nodeId: string, childNodeId: string): StructuralSchemaNodeV1 => ({ nodeId, kind: "NULLABLE", childNodeId });
const arrayNode = (nodeId: string, elementNodeId: string): StructuralSchemaNodeV1 => ({ nodeId, kind: "ARRAY", elementNodeId });

const recordNode = (nodeId: string, fields: readonly { readonly fieldName: string; readonly childNodeId: string }[]): StructuralSchemaNodeV1 => ({
  nodeId,
  kind: "EXACT_RECORD",
  fields: [...fields].sort((left, right) => left.fieldName < right.fieldName ? -1 : left.fieldName === right.fieldName ? 0 : 1).map((field, index) => ({ fieldOrdinal: index + 1, fieldName: field.fieldName, required: true, optional: false, childNodeId: field.childNodeId }))
});

type DescriptorSpec = {
  readonly eventOrdinal: number;
  readonly eventType: string;
  readonly branchOrdinal: number;
  readonly branchId: string;
  readonly fieldKinds: readonly ("STRING" | "INTEGER" | "BOOLEAN" | "NOMINATION" | "NULLABLE_STRING" | "ENUM" | "LITERAL" | "ARRAY_STRING")[];
  readonly fields: readonly string[];
  readonly literals?: Readonly<Record<number, string>>;
  readonly enums?: Readonly<Record<number, readonly string[]>>;
};

const SPECS: readonly DescriptorSpec[] = [
  { eventOrdinal: 41, eventType: "NominationDeclared", branchOrdinal: 60, branchId: "C-2C-NOMINATION-DECLARED", fields: ["rulesBaselineVersion", "nominationId", "nominatorPlayerId", "nomineePlayerId", "dayNumber", "nominationOrdinal"], fieldKinds: ["STRING", "STRING", "STRING", "STRING", "INTEGER", "INTEGER"] },
  { eventOrdinal: 42, eventType: "VoteCast", branchOrdinal: 61, branchId: "C-2C-VOTE-CAST", fields: ["rulesBaselineVersion", "voteId", "nominationId", "voterPlayerId", "voterSeatNumber", "choice", "ghostVoteConsumed"], fieldKinds: ["STRING", "STRING", "STRING", "STRING", "INTEGER", "ENUM", "BOOLEAN"], enums: { 5: ["YES", "NO"] } },
  { eventOrdinal: 43, eventType: "BlockStateUpdated", branchOrdinal: 62, branchId: "C-2C-BLOCK-UPDATED", fields: ["rulesBaselineVersion", "nominationId", "dayNumber", "livingPlayerCount", "threshold", "leaderNominationId", "leaderVoteCount", "tied"], fieldKinds: ["STRING", "STRING", "INTEGER", "INTEGER", "INTEGER", "NULLABLE_STRING", "INTEGER", "BOOLEAN"] },
  { eventOrdinal: 44, eventType: "ExecutionDeclared", branchOrdinal: 63, branchId: "C-2C-EXECUTION-DECLARED", fields: ["rulesBaselineVersion", "executionId", "blockId", "targetPlayerId", "dayNumber"], fieldKinds: ["STRING", "STRING", "STRING", "STRING", "INTEGER"] },
  { eventOrdinal: 45, eventType: "PlayerDied", branchOrdinal: 64, branchId: "C-2C-PLAYER-DIED", fields: ["rulesBaselineVersion", "deathId", "executionId", "playerId", "dayNumber", "cause"], fieldKinds: ["STRING", "STRING", "NULLABLE_STRING", "STRING", "INTEGER", "ENUM"], enums: { 5: ["EXECUTION", "GENERIC_DEMON_KILL"] } },
  { eventOrdinal: 46, eventType: "ExecutionResolved", branchOrdinal: 65, branchId: "C-2C-EXECUTION-RESOLVED", fields: ["rulesBaselineVersion", "executionId", "targetPlayerId", "dayNumber", "resolution", "deathOutcome"], fieldKinds: ["STRING", "STRING", "STRING", "INTEGER", "LITERAL", "ENUM"], literals: { 4: "EXECUTED" }, enums: { 5: ["DIED", "DID_NOT_DIE"] } },
  { eventOrdinal: 47, eventType: "DayClosedWithoutExecution", branchOrdinal: 66, branchId: "C-2C-DAY-CLOSED", fields: ["rulesBaselineVersion", "dayNumber", "blockId", "reason"], fieldKinds: ["STRING", "INTEGER", "NULLABLE_STRING", "LITERAL"], literals: { 3: "NO_EXECUTABLE_CANDIDATE" } },
  { eventOrdinal: 48, eventType: "OrdinaryNightTaskPlanCreated", branchOrdinal: 67, branchId: "C-2C-NIGHT-PLAN", fields: ["rulesBaselineVersion", "planVersion", "window", "nightNumber", "taskCount", "tasks"], fieldKinds: ["STRING", "LITERAL", "LITERAL", "INTEGER", "INTEGER", "ARRAY_STRING"], literals: { 1: "ordinary-night-v1", 2: "OTHER_NIGHT" } },
  { eventOrdinal: 49, eventType: "OrdinaryNightTargetDerived", branchOrdinal: 68, branchId: "C-2C-NIGHT-TARGET", fields: ["rulesBaselineVersion", "taskId", "taskType", "sourcePlayerId", "targetPlayerId", "candidateSet", "selectionIndex", "seed", "transferOutcome"], fieldKinds: ["STRING", "STRING", "STRING", "STRING", "STRING", "ARRAY_STRING", "INTEGER", "LITERAL", "LITERAL"], literals: { 7: "seed-1", 8: "NONE" } },
  { eventOrdinal: 50, eventType: "OrdinaryNightTaskSettled", branchOrdinal: 69, branchId: "C-2C-NIGHT-SETTLED", fields: ["rulesBaselineVersion", "planVersion", "window", "nightNumber", "taskId", "taskType", "sourcePlayerId", "targetPlayerId", "settlement", "transferOutcome"], fieldKinds: ["STRING", "LITERAL", "LITERAL", "INTEGER", "STRING", "STRING", "STRING", "STRING", "LITERAL", "LITERAL"], literals: { 1: "ordinary-night-v1", 2: "OTHER_NIGHT", 8: "RESOLVED", 9: "NONE" } }
] as const;

export const TWO_C_ADDITIVE_DESCRIPTORS: readonly C1AdditiveDescriptorV1[] = SPECS.map((spec) => {
  const nodes: StructuralSchemaNodeV1[] = [];
  const fields = spec.fields.map((fieldName, index) => {
    const nodeId = `C1.SHA256.2c-${spec.eventType}-${index + 1}`;
    const kind = spec.fieldKinds[index];
    if (kind === "INTEGER") nodes.push(integerNode(nodeId));
    else if (kind === "BOOLEAN") nodes.push(booleanNode(nodeId));
    else if (kind === "LITERAL") nodes.push(literalNode(nodeId, spec.literals?.[index] ?? ""));
    else if (kind === "ENUM") nodes.push(enumNode(nodeId, spec.enums?.[index] ?? []));
    else if (kind === "NULLABLE_STRING") nodes.push(nullableStringNode(nodeId, `${nodeId}-inner`), stringNode(`${nodeId}-inner`));
    else if (kind === "ARRAY_STRING") nodes.push(arrayNode(nodeId, `${nodeId}-element`), stringNode(`${nodeId}-element`));
    else nodes.push(stringNode(nodeId));
    return { fieldName, childNodeId: nodeId };
  });
  const rootNodeId = `C1.SHA256.2c-${spec.eventType}-root`;
  nodes.push(recordNode(rootNodeId, fields));
  return {
    eventOrdinal: spec.eventOrdinal,
    eventType: spec.eventType,
    branchOrdinal: spec.branchOrdinal,
    branchId: spec.branchId,
    versionPolicy: { kind: "UNVERSIONED" },
    rootNodeId,
    resultTypeName: `${spec.eventType}Payload`,
    nodeBindings: nodes.map((node) => ({ nodeId: node.nodeId, node })),
    deltaBindings: []
  };
});

export const createTwoCAdditiveStructuralSchemaAuthority = (): StructuralSchemaAuthorityResultV1 => {
  const baseline = createFullC1StructuralSchemaAuthority();
  if (baseline.status === "UNHEALTHY") return baseline;
  return createC1AdditiveStructuralSchemaAuthority({ baseline, additions: TWO_C_ADDITIVE_DESCRIPTORS });
};
