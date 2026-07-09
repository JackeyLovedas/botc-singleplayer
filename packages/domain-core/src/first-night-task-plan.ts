import type { CharacterAssignmentSet } from "./character-assignment.js";
import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import { assertNever } from "./errors.js";
import type { ActionOpportunityId, PlayerId, RoleId, ScheduledTaskId } from "./ids.js";
import { scheduledTaskId } from "./ids.js";
import {
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  hasExactEnumerableKeys,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord,
  validateFirstNightInitializedPayloadShape,
  validateInitialKnowledgeSourceFacts,
  validateInitialOwnCharacterKnowledgePayload
} from "./initial-private-knowledge.js";
import type {
  FirstNightInitializedPayload,
  InitialPrivateKnowledgeEstablishedPayload
} from "./events.js";
import type { PlayerRoster, SeatNumber } from "./player-roster.js";
import type { GeneratedSetup, RoleSetupSnapshot } from "./setup-types.js";
import { compareStableId, sameRoleSetupSnapshot } from "./setup-types.js";

export const SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION = "snv-first-night-task-catalog-v1" as const;
export const SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION = "first-night-task-plan-v1" as const;
export const SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM = "canonical-first-night-task-catalog-v1" as const;
export const SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE = "canonical-first-night-task-catalog-v1:20514c1a" as const;

export type ScheduledTaskStatus = "PENDING";
export type ScheduledTaskClass =
  | "SYSTEM_INFORMATION"
  | "ROLE_ACTION"
  | "ROLE_INFORMATION"
  | "ROLE_SETUP";
export type FirstNightTaskType =
  | "PHILOSOPHER_ACTION"
  | "MINION_INFO"
  | "DEMON_INFO"
  | "SNAKE_CHARMER_ACTION"
  | "EVIL_TWIN_SETUP"
  | "WITCH_ACTION"
  | "CERENOVUS_ACTION"
  | "CLOCKMAKER_INFORMATION"
  | "DREAMER_ACTION"
  | "SEAMSTRESS_ACTION"
  | "MATHEMATICIAN_INFORMATION";
export type FirstNightSystemTaskType = "MINION_INFO" | "DEMON_INFO";
export type FirstNightTaskSourceKind = "ROLE" | "SYSTEM" | "PHILOSOPHER_GAINED_ABILITY";
export type ScheduledTaskSettlementPolicy =
  | "REEVALUATE_SOURCE_AT_SETTLEMENT"
  | "RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT";

export type FirstNightTaskOrderKey = {
  readonly baseOrder: number;
  readonly insertionOrder: number;
};

export type RoleTaskSource = {
  readonly kind: "ROLE";
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly role: RoleSetupSnapshot;
};

export type SystemTaskSource = {
  readonly kind: "SYSTEM";
  readonly systemTaskType: FirstNightSystemTaskType;
};

export type PhilosopherGainedAbilityTaskSource = {
  readonly kind: "PHILOSOPHER_GAINED_ABILITY";
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly chosenRole: RoleSetupSnapshot;
  readonly opportunityId: ActionOpportunityId;
  readonly sourceCharacterStateRevision: number;
};

export type ScheduledTaskSource = RoleTaskSource | SystemTaskSource | PhilosopherGainedAbilityTaskSource;

export type ScheduledTask = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: FirstNightTaskType;
  readonly taskClass: ScheduledTaskClass;
  readonly orderKey: FirstNightTaskOrderKey;
  readonly source: ScheduledTaskSource;
  readonly status: ScheduledTaskStatus;
  readonly settlementPolicy: ScheduledTaskSettlementPolicy;
};

export const SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION = "scheduled-task-settlement-v1" as const;

export type ScheduledTaskSettlementOutcomeType =
  | "MINION_INFORMATION_DELIVERED"
  | "DEMON_INFORMATION_DELIVERED"
  | "PHILOSOPHER_DEFERRED"
  | "PHILOSOPHER_ABILITY_CHOSEN"
  | "SNAKE_CHARMER_NON_DEMON_NO_SWAP"
  | "SNAKE_CHARMER_INEFFECTIVE"
  | "SNAKE_CHARMER_DEMON_HIT_SWAP";

export type ScheduledTaskSettlement = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: FirstNightTaskType;
  readonly nightNumber: 1;
  readonly settlementVersion: typeof SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION;
  readonly outcomeType: ScheduledTaskSettlementOutcomeType;
  readonly characterStateRevision: number;
};

export type ScheduledTaskSettledPayload = ScheduledTaskSettlement & {
  readonly rulesBaselineVersion: string;
};

export type FirstNightTaskProgress = {
  readonly settlements: readonly ScheduledTaskSettlement[];
};

export type RoleFirstNightTaskDefinition = {
  readonly taskType: FirstNightTaskType;
  readonly taskClass: ScheduledTaskClass;
  readonly baseOrder: number;
  readonly sourceKind: "ROLE";
  readonly settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT";
  readonly roleId: RoleId;
};

export type SystemFirstNightTaskDefinition = {
  readonly taskType: FirstNightSystemTaskType;
  readonly taskClass: "SYSTEM_INFORMATION";
  readonly baseOrder: number;
  readonly sourceKind: "SYSTEM";
  readonly settlementPolicy: "RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT";
  readonly systemTaskType: FirstNightSystemTaskType;
};

export type FirstNightTaskDefinition = RoleFirstNightTaskDefinition | SystemFirstNightTaskDefinition;

export type FirstNightTaskCatalogSnapshot = {
  readonly taskCatalogVersion: typeof SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION;
  readonly taskCatalogSignatureAlgorithm: typeof SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM;
  readonly taskCatalogSignature: string;
  readonly definitions: readonly FirstNightTaskDefinition[];
};

export type FirstNightTaskPlan = {
  readonly nightNumber: 1;
  readonly taskPlanVersion: typeof SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION;
  readonly taskCatalogVersion: typeof SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION;
  readonly taskCatalogSignatureAlgorithm: typeof SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM;
  readonly taskCatalogSignature: string;
  readonly taskCatalogSnapshot: FirstNightTaskCatalogSnapshot;
  readonly rosterVersion: string;
  readonly assignmentAlgorithmVersion: string;
  readonly roleCatalogSignature: string;
  readonly knowledgeModelVersion: typeof SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION;
  readonly knowledgeStage: typeof INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE;
  readonly tasks: readonly ScheduledTask[];
};

export type FirstNightTaskPlanningFailureCode =
  | "InvalidFirstNightState"
  | "InvalidTaskCatalog"
  | "InvalidTaskPlan";

export type FirstNightTaskPlanningFailure = {
  readonly status: "failure";
  readonly failureCode: FirstNightTaskPlanningFailureCode;
  readonly message: string;
  readonly conflictingTaskIds: readonly ScheduledTaskId[];
  readonly conflictingRoleIds: readonly RoleId[];
};

export type FirstNightTaskPlanningSuccess = {
  readonly status: "success";
  readonly taskPlan: FirstNightTaskPlan;
};

export type FirstNightTaskPlanningResult =
  | FirstNightTaskPlanningSuccess
  | FirstNightTaskPlanningFailure;

export type FirstNightTaskPlannerInput = {
  readonly nightNumber: 1;
  readonly setup: GeneratedSetup;
  readonly roster: PlayerRoster;
  readonly assignment: CharacterAssignmentSet;
  readonly firstNight: FirstNightInitializedPayload;
  readonly initialPrivateKnowledge: InitialPrivateKnowledgeEstablishedPayload;
  readonly taskCatalogSnapshot: FirstNightTaskCatalogSnapshot;
};

export type FirstNightTaskPlanValidationSourceFacts = {
  readonly setup: unknown;
  readonly roster: unknown;
  readonly assignment: unknown;
  readonly firstNight: unknown;
  readonly initialPrivateKnowledge: unknown;
};

type ValidationFailure = { readonly valid: false; readonly reason: string };

export type FirstNightTaskPlanValidationResult =
  | { readonly valid: true }
  | ValidationFailure;

type FirstNightTaskDefinitionParseResult =
  | { readonly valid: true; readonly definitions: readonly FirstNightTaskDefinition[] }
  | { readonly valid: false; readonly reason: string };

type ScheduledTaskParseResult =
  | { readonly valid: true; readonly tasks: readonly ScheduledTask[] }
  | { readonly valid: false; readonly reason: string };

export const FIRST_NIGHT_TASK_TYPES: readonly FirstNightTaskType[] = [
  "PHILOSOPHER_ACTION",
  "MINION_INFO",
  "DEMON_INFO",
  "SNAKE_CHARMER_ACTION",
  "EVIL_TWIN_SETUP",
  "WITCH_ACTION",
  "CERENOVUS_ACTION",
  "CLOCKMAKER_INFORMATION",
  "DREAMER_ACTION",
  "SEAMSTRESS_ACTION",
  "MATHEMATICIAN_INFORMATION"
] as const;

export const FIRST_NIGHT_BASE_ORDER_BY_TASK_TYPE: Readonly<Record<FirstNightTaskType, number>> = {
  PHILOSOPHER_ACTION: 100,
  MINION_INFO: 200,
  DEMON_INFO: 300,
  SNAKE_CHARMER_ACTION: 400,
  EVIL_TWIN_SETUP: 500,
  WITCH_ACTION: 600,
  CERENOVUS_ACTION: 700,
  CLOCKMAKER_INFORMATION: 800,
  DREAMER_ACTION: 900,
  SEAMSTRESS_ACTION: 1000,
  MATHEMATICIAN_INFORMATION: 1100
} as const;

export const ROLE_ID_BY_FIRST_NIGHT_TASK_TYPE: Readonly<Partial<Record<FirstNightTaskType, RoleId>>> = {
  PHILOSOPHER_ACTION: "philosopher" as RoleId,
  SNAKE_CHARMER_ACTION: "snake_charmer" as RoleId,
  EVIL_TWIN_SETUP: "evil_twin" as RoleId,
  WITCH_ACTION: "witch" as RoleId,
  CERENOVUS_ACTION: "cerenovus" as RoleId,
  CLOCKMAKER_INFORMATION: "clockmaker" as RoleId,
  DREAMER_ACTION: "dreamer" as RoleId,
  SEAMSTRESS_ACTION: "seamstress" as RoleId,
  MATHEMATICIAN_INFORMATION: "mathematician" as RoleId
} as const;

const TASK_CLASS_BY_FIRST_NIGHT_TASK_TYPE: Readonly<Record<FirstNightTaskType, ScheduledTaskClass>> = {
  PHILOSOPHER_ACTION: "ROLE_ACTION",
  MINION_INFO: "SYSTEM_INFORMATION",
  DEMON_INFO: "SYSTEM_INFORMATION",
  SNAKE_CHARMER_ACTION: "ROLE_ACTION",
  EVIL_TWIN_SETUP: "ROLE_SETUP",
  WITCH_ACTION: "ROLE_ACTION",
  CERENOVUS_ACTION: "ROLE_ACTION",
  CLOCKMAKER_INFORMATION: "ROLE_INFORMATION",
  DREAMER_ACTION: "ROLE_ACTION",
  SEAMSTRESS_ACTION: "ROLE_ACTION",
  MATHEMATICIAN_INFORMATION: "ROLE_INFORMATION"
} as const;

const FIRST_NIGHT_TASK_PLAN_PAYLOAD_KEYS = [
  "rulesBaselineVersion",
  "nightNumber",
  "taskPlanVersion",
  "taskCatalogVersion",
  "taskCatalogSignatureAlgorithm",
  "taskCatalogSignature",
  "taskCatalogSnapshot",
  "rosterVersion",
  "assignmentAlgorithmVersion",
  "roleCatalogSignature",
  "knowledgeModelVersion",
  "knowledgeStage",
  "tasks"
] as const;
const FIRST_NIGHT_TASK_PLAN_RUNTIME_STATE_KEYS = FIRST_NIGHT_TASK_PLAN_PAYLOAD_KEYS;
const FIRST_NIGHT_TASK_CATALOG_SNAPSHOT_KEYS = [
  "taskCatalogVersion",
  "taskCatalogSignatureAlgorithm",
  "taskCatalogSignature",
  "definitions"
] as const;
const ROLE_TASK_DEFINITION_KEYS = ["taskType", "taskClass", "baseOrder", "sourceKind", "settlementPolicy", "roleId"] as const;
const SYSTEM_TASK_DEFINITION_KEYS = ["taskType", "taskClass", "baseOrder", "sourceKind", "settlementPolicy", "systemTaskType"] as const;
const SCHEDULED_TASK_KEYS = ["taskId", "taskType", "taskClass", "orderKey", "source", "status", "settlementPolicy"] as const;
const TASK_ORDER_KEY_KEYS = ["baseOrder", "insertionOrder"] as const;
const ROLE_TASK_SOURCE_KEYS = ["kind", "playerId", "seatNumber", "role"] as const;
const SYSTEM_TASK_SOURCE_KEYS = ["kind", "systemTaskType"] as const;
const PHILOSOPHER_GAINED_ABILITY_TASK_SOURCE_KEYS = [
  "chosenRole",
  "kind",
  "opportunityId",
  "playerId",
  "seatNumber",
  "sourceCharacterStateRevision",
  "sourceRole"
] as const;
const SCHEDULED_TASK_SETTLEMENT_KEYS = [
  "characterStateRevision",
  "nightNumber",
  "outcomeType",
  "settlementVersion",
  "taskId",
  "taskType"
] as const;
const SCHEDULED_TASK_SETTLED_PAYLOAD_KEYS = [
  "characterStateRevision",
  "nightNumber",
  "outcomeType",
  "rulesBaselineVersion",
  "settlementVersion",
  "taskId",
  "taskType"
] as const;
const FIRST_NIGHT_TASK_PROGRESS_KEYS = ["settlements"] as const;

const fail = (reason: string): ValidationFailure => ({ valid: false, reason });

const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      return false;
    }
  }

  return true;
};

export const isFirstNightTaskType = (value: unknown): value is FirstNightTaskType =>
  typeof value === "string" && (FIRST_NIGHT_TASK_TYPES as readonly string[]).includes(value);

const isFirstNightSystemTaskType = (value: unknown): value is FirstNightSystemTaskType =>
  value === "MINION_INFO" || value === "DEMON_INFO";

const isScheduledTaskClass = (value: unknown): value is ScheduledTaskClass =>
  value === "SYSTEM_INFORMATION" || value === "ROLE_ACTION" || value === "ROLE_INFORMATION" || value === "ROLE_SETUP";

const isSettlementPolicy = (value: unknown): value is ScheduledTaskSettlementPolicy =>
  value === "REEVALUATE_SOURCE_AT_SETTLEMENT" || value === "RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT";

export const isScheduledTaskSettlementOutcomeType = (value: unknown): value is ScheduledTaskSettlementOutcomeType =>
  value === "MINION_INFORMATION_DELIVERED" ||
  value === "DEMON_INFORMATION_DELIVERED" ||
  value === "PHILOSOPHER_DEFERRED" ||
  value === "PHILOSOPHER_ABILITY_CHOSEN" ||
  value === "SNAKE_CHARMER_NON_DEMON_NO_SWAP" ||
  value === "SNAKE_CHARMER_INEFFECTIVE" ||
  value === "SNAKE_CHARMER_DEMON_HIT_SWAP";

export const compareFirstNightTaskOrder = (left: ScheduledTask, right: ScheduledTask): number => {
  const base = left.orderKey.baseOrder - right.orderKey.baseOrder;
  if (base !== 0) {
    return base;
  }

  const insertion = left.orderKey.insertionOrder - right.orderKey.insertionOrder;
  if (insertion !== 0) {
    return insertion;
  }

  return compareStableId(left.taskId, right.taskId);
};

const compareTaskDefinitions = (left: FirstNightTaskDefinition, right: FirstNightTaskDefinition): number => {
  const base = left.baseOrder - right.baseOrder;
  if (base !== 0) {
    return base;
  }

  return compareStableId(left.taskType, right.taskType);
};

const canonicalDefinitionSource = (definition: FirstNightTaskDefinition): string =>
  definition.sourceKind === "ROLE"
    ? `roleId=${definition.roleId}`
    : `systemTaskType=${definition.systemTaskType}`;

export const serializeFirstNightTaskCatalogCanonical = (
  catalog: Pick<FirstNightTaskCatalogSnapshot, "taskCatalogVersion" | "definitions">
): string => {
  const definitionLines = [...catalog.definitions].sort(compareTaskDefinitions).map((definition) => [
    definition.taskType,
    definition.taskClass,
    String(definition.baseOrder),
    definition.sourceKind,
    definition.settlementPolicy,
    canonicalDefinitionSource(definition)
  ].join("|"));

  return [
    `taskCatalogVersion|${catalog.taskCatalogVersion}`,
    ...definitionLines
  ].join("\n");
};

export const calculateFirstNightTaskCatalogSignature = (
  catalog: Pick<FirstNightTaskCatalogSnapshot, "taskCatalogVersion" | "definitions">
): string => {
  const serialized = serializeFirstNightTaskCatalogCanonical(catalog);
  let hash = 0x811c9dc5;
  for (let index = 0; index < serialized.length; index += 1) {
    hash = Math.imul(hash ^ serialized.charCodeAt(index), 0x01000193) >>> 0;
  }

  return `${SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM}:${hash.toString(16).padStart(8, "0")}`;
};

export const roleScheduledTaskId = (taskType: FirstNightTaskType, seatNumber: SeatNumber): ScheduledTaskId =>
  scheduledTaskId(`first-night-v1:${taskType}:seat-${String(seatNumber).padStart(2, "0")}`);

export const systemScheduledTaskId = (systemTaskType: FirstNightSystemTaskType): ScheduledTaskId =>
  scheduledTaskId(`first-night-v1:${systemTaskType}:system`);

const expectedRoleTaskId = (task: ScheduledTask): ScheduledTaskId | undefined =>
  task.source.kind === "ROLE" ? roleScheduledTaskId(task.taskType, task.source.seatNumber) : undefined;

const expectedSystemTaskId = (task: ScheduledTask): ScheduledTaskId | undefined =>
  task.source.kind === "SYSTEM" ? systemScheduledTaskId(task.source.systemTaskType) : undefined;

const validateCanonicalTaskId = (task: ScheduledTask): FirstNightTaskPlanValidationResult => {
  const parts = task.taskId.split(":");
  if (parts.length !== 3 || parts[0] !== "first-night-v1" || parts[1] !== task.taskType) {
    return fail("scheduled task id must use first-night-v1 canonical format");
  }

  if (task.source.kind === "SYSTEM") {
    if (parts[2] !== "system" || task.taskId !== expectedSystemTaskId(task)) {
      return fail("system scheduled task id must use canonical system format");
    }
    return { valid: true };
  }

  const expected = expectedRoleTaskId(task);
  if (expected === undefined || parts[2] !== `seat-${String(task.source.seatNumber).padStart(2, "0")}` || task.taskId !== expected) {
    return fail("role scheduled task id must use canonical role seat format");
  }

  return { valid: true };
};

const parseRoleTaskDefinitionShape = (value: Record<string, unknown>): RoleFirstNightTaskDefinition | ValidationFailure => {
  if (
    !hasExactEnumerableKeys(value, ROLE_TASK_DEFINITION_KEYS) ||
    !isFirstNightTaskType(value.taskType) ||
    !isScheduledTaskClass(value.taskClass) ||
    typeof value.baseOrder !== "number" ||
    !Number.isInteger(value.baseOrder) ||
    value.sourceKind !== "ROLE" ||
    value.settlementPolicy !== "REEVALUATE_SOURCE_AT_SETTLEMENT" ||
    typeof value.roleId !== "string" ||
    value.roleId.trim().length === 0
  ) {
    return fail("role first-night task definition must have exact runtime shape");
  }

  return value as unknown as RoleFirstNightTaskDefinition;
};

const parseSystemTaskDefinitionShape = (value: Record<string, unknown>): SystemFirstNightTaskDefinition | ValidationFailure => {
  if (
    !hasExactEnumerableKeys(value, SYSTEM_TASK_DEFINITION_KEYS) ||
    !isFirstNightSystemTaskType(value.taskType) ||
    value.taskClass !== "SYSTEM_INFORMATION" ||
    typeof value.baseOrder !== "number" ||
    !Number.isInteger(value.baseOrder) ||
    value.sourceKind !== "SYSTEM" ||
    value.settlementPolicy !== "RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT" ||
    !isFirstNightSystemTaskType(value.systemTaskType)
  ) {
    return fail("system first-night task definition must have exact runtime shape");
  }

  return value as unknown as SystemFirstNightTaskDefinition;
};

const parseTaskDefinitionShape = (value: unknown): FirstNightTaskDefinition | ValidationFailure => {
  if (!isPlainRecord(value)) {
    return fail("first-night task definition must be a non-null plain object");
  }

  if (value.sourceKind === "ROLE") {
    return parseRoleTaskDefinitionShape(value);
  }

  if (value.sourceKind === "SYSTEM") {
    return parseSystemTaskDefinitionShape(value);
  }

  return fail("first-night task definition sourceKind must be ROLE or SYSTEM");
};

const validateOfficialTaskDefinition = (definition: FirstNightTaskDefinition): FirstNightTaskPlanValidationResult => {
  if (definition.baseOrder !== FIRST_NIGHT_BASE_ORDER_BY_TASK_TYPE[definition.taskType]) {
    return fail("first-night task definition baseOrder must match official order");
  }

  if (definition.taskClass !== TASK_CLASS_BY_FIRST_NIGHT_TASK_TYPE[definition.taskType]) {
    return fail("first-night task definition taskClass must match official task type");
  }

  if (definition.sourceKind === "SYSTEM") {
    if (
      definition.taskType !== definition.systemTaskType ||
      (definition.taskType !== "MINION_INFO" && definition.taskType !== "DEMON_INFO")
    ) {
      return fail("system task definition must match MINION_INFO or DEMON_INFO");
    }
    return { valid: true };
  }

  const expectedRoleId = ROLE_ID_BY_FIRST_NIGHT_TASK_TYPE[definition.taskType];
  if (expectedRoleId === undefined || definition.roleId !== expectedRoleId) {
    return fail("role task definition must match its exact supported role id");
  }

  return { valid: true };
};

const parseTaskDefinitions = (definitions: unknown): FirstNightTaskDefinitionParseResult => {
  if (!Array.isArray(definitions)) {
    return fail("first-night task catalog definitions must be a real array");
  }

  if (!isDenseArray(definitions)) {
    return fail("first-night task catalog definitions array must not contain sparse holes");
  }

  const parsed: FirstNightTaskDefinition[] = [];
  for (const definition of definitions) {
    const result = parseTaskDefinitionShape(definition);
    if ("valid" in result) {
      return result;
    }
    parsed.push(result);
  }

  return { valid: true, definitions: parsed };
};

export const validateFirstNightTaskCatalogSnapshot = (
  value: unknown
): FirstNightTaskPlanValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, FIRST_NIGHT_TASK_CATALOG_SNAPSHOT_KEYS)) {
    return fail("first-night task catalog snapshot must have exact runtime shape");
  }

  if (
    value.taskCatalogVersion !== SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION ||
    value.taskCatalogSignatureAlgorithm !== SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM ||
    typeof value.taskCatalogSignature !== "string"
  ) {
    return fail("first-night task catalog metadata must use supported versions");
  }

  const definitionsResult = parseTaskDefinitions(value.definitions);
  if (!definitionsResult.valid) {
    return definitionsResult;
  }

  const definitions = definitionsResult.definitions;
  if (definitions.length !== FIRST_NIGHT_TASK_TYPES.length) {
    return fail("first-night task catalog must contain exactly 11 definitions");
  }

  if (!definitions.every((definition, index) => index === 0 || compareTaskDefinitions(definitions[index - 1] ?? definition, definition) < 0)) {
    return fail("first-night task catalog definitions must use canonical order");
  }

  const taskTypes = new Set<FirstNightTaskType>();
  const baseOrders = new Set<number>();
  for (const definition of definitions) {
    if (taskTypes.has(definition.taskType)) {
      return fail("first-night task catalog taskType values must be unique");
    }
    taskTypes.add(definition.taskType);

    if (baseOrders.has(definition.baseOrder)) {
      return fail("first-night task catalog baseOrder values must be unique");
    }
    baseOrders.add(definition.baseOrder);

    const officialValidation = validateOfficialTaskDefinition(definition);
    if (!officialValidation.valid) {
      return officialValidation;
    }
  }

  for (const taskType of FIRST_NIGHT_TASK_TYPES) {
    if (!taskTypes.has(taskType)) {
      return fail("first-night task catalog must contain every supported task type");
    }
  }

  const calculated = calculateFirstNightTaskCatalogSignature({
    taskCatalogVersion: value.taskCatalogVersion,
    definitions
  });
  if (value.taskCatalogSignature !== calculated || value.taskCatalogSignature !== SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE) {
    return fail("first-night task catalog signature must match canonical supported catalog");
  }

  return { valid: true };
};

const parseOrderKey = (value: unknown): FirstNightTaskOrderKey | ValidationFailure => {
  if (
    !isPlainRecord(value) ||
    !hasExactEnumerableKeys(value, TASK_ORDER_KEY_KEYS) ||
    typeof value.baseOrder !== "number" ||
    !Number.isInteger(value.baseOrder) ||
    typeof value.insertionOrder !== "number" ||
    !Number.isInteger(value.insertionOrder)
  ) {
    return fail("scheduled task orderKey must have exact runtime shape");
  }

  return value as FirstNightTaskOrderKey;
};

const parseScheduledTaskSource = (value: unknown): ScheduledTaskSource | ValidationFailure => {
  if (!isPlainRecord(value)) {
    return fail("scheduled task source must be a non-null plain object");
  }

  if (value.kind === "SYSTEM") {
    if (!hasExactEnumerableKeys(value, SYSTEM_TASK_SOURCE_KEYS) || !isFirstNightSystemTaskType(value.systemTaskType)) {
      return fail("system scheduled task source must have exact runtime shape");
    }
    return value as unknown as SystemTaskSource;
  }

  if (value.kind === "ROLE") {
    if (
      !hasExactEnumerableKeys(value, ROLE_TASK_SOURCE_KEYS) ||
      typeof value.playerId !== "string" ||
      value.playerId.trim().length === 0 ||
      typeof value.seatNumber !== "number" ||
      !Number.isInteger(value.seatNumber) ||
      value.seatNumber < 1 ||
      value.seatNumber > 12 ||
      !hasExactRoleSetupSnapshotShape(value.role)
    ) {
      return fail("role scheduled task source must have exact runtime shape");
    }
    return value as unknown as RoleTaskSource;
  }

  if (value.kind === "PHILOSOPHER_GAINED_ABILITY") {
    if (
      !hasExactEnumerableKeys(value, PHILOSOPHER_GAINED_ABILITY_TASK_SOURCE_KEYS) ||
      typeof value.playerId !== "string" ||
      value.playerId.trim().length === 0 ||
      typeof value.seatNumber !== "number" ||
      !Number.isInteger(value.seatNumber) ||
      value.seatNumber < 1 ||
      value.seatNumber > 12 ||
      !hasExactRoleSetupSnapshotShape(value.sourceRole) ||
      !hasExactRoleSetupSnapshotShape(value.chosenRole) ||
      typeof value.opportunityId !== "string" ||
      value.opportunityId.trim().length === 0 ||
      typeof value.sourceCharacterStateRevision !== "number" ||
      !Number.isInteger(value.sourceCharacterStateRevision) ||
      value.sourceCharacterStateRevision <= 0
    ) {
      return fail("philosopher gained ability scheduled task source must have exact runtime shape");
    }
    return value as unknown as PhilosopherGainedAbilityTaskSource;
  }

  return fail("scheduled task source kind must be ROLE, SYSTEM, or PHILOSOPHER_GAINED_ABILITY");
};

export const parseScheduledTaskShape = (value: unknown): ScheduledTask | ValidationFailure => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, SCHEDULED_TASK_KEYS)) {
    return fail("scheduled task must have exact runtime shape");
  }

  const orderKey = parseOrderKey(value.orderKey);
  if ("valid" in orderKey) {
    return orderKey;
  }

  const source = parseScheduledTaskSource(value.source);
  if ("valid" in source) {
    return source;
  }

  if (
    typeof value.taskId !== "string" ||
    value.taskId.trim().length === 0 ||
    !isFirstNightTaskType(value.taskType) ||
    !isScheduledTaskClass(value.taskClass) ||
    value.status !== "PENDING" ||
    !isSettlementPolicy(value.settlementPolicy)
  ) {
    return fail("scheduled task fields must use supported primitive values");
  }

  return {
    taskId: scheduledTaskId(value.taskId),
    taskType: value.taskType,
    taskClass: value.taskClass,
    orderKey,
    source,
    status: value.status,
    settlementPolicy: value.settlementPolicy
  };
};

const parseScheduledTaskSettlementShape = (value: unknown): ScheduledTaskSettlement | ValidationFailure => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, SCHEDULED_TASK_SETTLEMENT_KEYS)) {
    return fail("ScheduledTaskSettlement must have exact runtime shape");
  }

  if (
    typeof value.taskId !== "string" ||
    value.taskId.trim().length === 0 ||
    !isFirstNightTaskType(value.taskType) ||
    value.nightNumber !== 1 ||
    value.settlementVersion !== SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION ||
    !isScheduledTaskSettlementOutcomeType(value.outcomeType) ||
    typeof value.characterStateRevision !== "number" ||
    !Number.isInteger(value.characterStateRevision) ||
    value.characterStateRevision <= 0
  ) {
    return fail("ScheduledTaskSettlement fields must use supported primitive values");
  }

  return {
    taskId: scheduledTaskId(value.taskId),
    taskType: value.taskType,
    nightNumber: value.nightNumber,
    settlementVersion: value.settlementVersion,
    outcomeType: value.outcomeType,
    characterStateRevision: value.characterStateRevision
  };
};

export const validateScheduledTaskSettledPayloadShape = (value: unknown): FirstNightTaskPlanValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, SCHEDULED_TASK_SETTLED_PAYLOAD_KEYS)) {
    return fail("ScheduledTaskSettled payload must have exact runtime shape");
  }

  const parsed = parseScheduledTaskSettlementShape({
    characterStateRevision: value.characterStateRevision,
    nightNumber: value.nightNumber,
    outcomeType: value.outcomeType,
    settlementVersion: value.settlementVersion,
    taskId: value.taskId,
    taskType: value.taskType
  });
  if ("valid" in parsed) {
    return parsed;
  }

  if (typeof value.rulesBaselineVersion !== "string") {
    return fail("ScheduledTaskSettled rulesBaselineVersion must be a string");
  }

  return { valid: true };
};

const parseFirstNightTaskProgressShape = (value: unknown): { readonly valid: true; readonly progress: FirstNightTaskProgress } | ValidationFailure => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, FIRST_NIGHT_TASK_PROGRESS_KEYS)) {
    return fail("FirstNightTaskProgress must have exact runtime shape");
  }

  if (!Array.isArray(value.settlements) || !isDenseArray(value.settlements)) {
    return fail("FirstNightTaskProgress settlements must be a dense array");
  }

  const settlements: ScheduledTaskSettlement[] = [];
  for (const settlement of value.settlements) {
    const parsed = parseScheduledTaskSettlementShape(settlement);
    if ("valid" in parsed) {
      return parsed;
    }
    settlements.push(parsed);
  }

  return { valid: true, progress: { settlements } };
};

export const cloneScheduledTaskSettlement = (settlement: ScheduledTaskSettlement): ScheduledTaskSettlement => ({
  taskId: settlement.taskId,
  taskType: settlement.taskType,
  nightNumber: settlement.nightNumber,
  settlementVersion: settlement.settlementVersion,
  outcomeType: settlement.outcomeType,
  characterStateRevision: settlement.characterStateRevision
});

export const cloneFirstNightTaskProgress = (progress: FirstNightTaskProgress | undefined): FirstNightTaskProgress => ({
  settlements: progress?.settlements.map(cloneScheduledTaskSettlement) ?? []
});

export const isFirstNightTaskSettled = (
  progress: FirstNightTaskProgress | undefined,
  taskIdValue: ScheduledTaskId
): boolean => progress?.settlements.some((settlement) => settlement.taskId === taskIdValue) ?? false;

export const getNextUnsettledFirstNightTask = (
  plan: Pick<FirstNightTaskPlan, "tasks">,
  progress: FirstNightTaskProgress | undefined
): ScheduledTask | undefined => {
  const settledTaskIds = new Set(progress?.settlements.map((settlement) => settlement.taskId) ?? []);
  return plan.tasks.find((task) => !settledTaskIds.has(task.taskId));
};

export const validateFirstNightTaskProgress = (
  plan: Pick<FirstNightTaskPlan, "tasks">,
  value: unknown
): FirstNightTaskPlanValidationResult => {
  const parsedProgress = parseFirstNightTaskProgressShape(value);
  if (!parsedProgress.valid) {
    return parsedProgress;
  }

  const progress = parsedProgress.progress;
  const taskById = new Map<ScheduledTaskId, ScheduledTask>(plan.tasks.map((task) => [task.taskId, task]));
  const settledTaskIds = new Set<ScheduledTaskId>();

  for (const [index, settlement] of progress.settlements.entries()) {
    const plannedTask = taskById.get(settlement.taskId);
    if (plannedTask === undefined) {
      return fail("ScheduledTaskSettlement must reference a task in the first-night task plan");
    }

    if (plannedTask.taskType !== settlement.taskType) {
      return fail("ScheduledTaskSettlement taskType must match the planned task");
    }

    if (settledTaskIds.has(settlement.taskId)) {
      return fail("ScheduledTaskSettlement taskId values must be unique");
    }

    const expectedTask = plan.tasks[index];
    if (expectedTask === undefined || expectedTask.taskId !== settlement.taskId) {
      return fail("FirstNightTaskProgress settlements must be a prefix of the first-night task plan order");
    }

    settledTaskIds.add(settlement.taskId);
  }

  return { valid: true };
};

const parseScheduledTasks = (tasks: unknown): ScheduledTaskParseResult => {
  if (!Array.isArray(tasks)) {
    return fail("first-night task plan tasks must be a real array");
  }

  if (!isDenseArray(tasks)) {
    return fail("first-night task plan tasks array must not contain sparse holes");
  }

  const parsed: ScheduledTask[] = [];
  for (const task of tasks) {
    const result = parseScheduledTaskShape(task);
    if ("valid" in result) {
      return result;
    }
    parsed.push(result);
  }

  return { valid: true, tasks: parsed };
};

const validateSourceFacts = (
  sourceFacts: FirstNightTaskPlanValidationSourceFacts
): FirstNightTaskPlanValidationResult => {
  const knowledgeSourceValidation = validateInitialKnowledgeSourceFacts({
    roster: sourceFacts.roster,
    assignment: sourceFacts.assignment,
    setup: sourceFacts.setup
  });
  if (!knowledgeSourceValidation.valid) {
    return knowledgeSourceValidation;
  }

  const firstNightShape = validateFirstNightInitializedPayloadShape(sourceFacts.firstNight);
  if (!firstNightShape.valid) {
    return firstNightShape;
  }

  const roster = sourceFacts.roster as PlayerRoster;
  const setup = sourceFacts.setup as GeneratedSetup;
  const assignment = sourceFacts.assignment as CharacterAssignmentSet;
  const firstNight = sourceFacts.firstNight as FirstNightInitializedPayload;
  const initialKnowledge = sourceFacts.initialPrivateKnowledge as InitialPrivateKnowledgeEstablishedPayload;
  if (
    firstNight.initializationVersion !== SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION ||
    firstNight.nightNumber !== 1 ||
    firstNight.rosterVersion !== initialKnowledge.rosterVersion ||
    firstNight.assignmentAlgorithmVersion !== initialKnowledge.assignmentAlgorithmVersion ||
    firstNight.roleCatalogSignature !== setup.roleCatalogSignature ||
    firstNight.roleCatalogSignature !== initialKnowledge.roleCatalogSignature
  ) {
    return fail("FirstNightInitialized metadata must match setup and initial private knowledge");
  }

  const initialKnowledgeValidation = validateInitialOwnCharacterKnowledgePayload(sourceFacts.initialPrivateKnowledge, {
    roster,
    assignment,
    setup,
    rosterVersion: firstNight.rosterVersion,
    assignmentAlgorithmVersion: firstNight.assignmentAlgorithmVersion,
    roleCatalogSignature: firstNight.roleCatalogSignature
  });
  if (!initialKnowledgeValidation.valid) {
    return initialKnowledgeValidation;
  }

  return { valid: true };
};

const taskDefinitionsByTaskType = (
  catalog: FirstNightTaskCatalogSnapshot
): ReadonlyMap<FirstNightTaskType, FirstNightTaskDefinition> =>
  new Map(catalog.definitions.map((definition) => [definition.taskType, definition]));

const roleDefinitionsByRoleId = (
  catalog: FirstNightTaskCatalogSnapshot
): ReadonlyMap<RoleId, RoleFirstNightTaskDefinition> => {
  const entries = catalog.definitions
    .filter((definition): definition is RoleFirstNightTaskDefinition => definition.sourceKind === "ROLE")
    .map((definition) => [definition.roleId, definition] as const);

  return new Map(entries);
};

export const validateScheduledTasksAgainstSourceFacts = (
  tasks: unknown,
  catalog: FirstNightTaskCatalogSnapshot,
  sourceFacts: FirstNightTaskPlanValidationSourceFacts
): FirstNightTaskPlanValidationResult => {
  const catalogValidation = validateFirstNightTaskCatalogSnapshot(catalog);
  if (!catalogValidation.valid) {
    return catalogValidation;
  }

  const sourceValidation = validateSourceFacts(sourceFacts);
  if (!sourceValidation.valid) {
    return sourceValidation;
  }

  const parsedTasks = parseScheduledTasks(tasks);
  if (!parsedTasks.valid) {
    return parsedTasks;
  }

  const roster = sourceFacts.roster as PlayerRoster;
  const setup = sourceFacts.setup as GeneratedSetup;
  const assignment = sourceFacts.assignment as CharacterAssignmentSet;
  const definitionsByTaskType = taskDefinitionsByTaskType(catalog);
  const roleDefinitionByRoleId = roleDefinitionsByRoleId(catalog);
  const rosterByPlayerId = new Map(roster.map((entry) => [entry.playerId, entry]));
  const assignmentByPlayerId = new Map(assignment.map((entry) => [entry.playerId, entry]));
  const catalogRolesByRoleId = new Map(setup.roleCatalogSnapshot.roles.map((entry) => [entry.roleId, entry]));

  const taskIds = new Set<ScheduledTaskId>();
  const roleTaskKeys = new Set<string>();
  let minionInfoCount = 0;
  let demonInfoCount = 0;

  for (const [index, task] of parsedTasks.tasks.entries()) {
    if (taskIds.has(task.taskId)) {
      return fail("scheduled task ids must be unique");
    }
    taskIds.add(task.taskId);

    if (index > 0 && compareFirstNightTaskOrder(parsedTasks.tasks[index - 1] ?? task, task) >= 0) {
      return fail("scheduled tasks must use canonical order");
    }

    if (task.status !== "PENDING" || task.orderKey.insertionOrder !== 0) {
      return fail("base first-night scheduled tasks must be PENDING with insertionOrder 0");
    }

    const idValidation = validateCanonicalTaskId(task);
    if (!idValidation.valid) {
      return idValidation;
    }

    const definition = definitionsByTaskType.get(task.taskType);
    if (definition === undefined) {
      return fail("scheduled task taskType must exist in catalog");
    }

    if (
      task.taskClass !== definition.taskClass ||
      task.orderKey.baseOrder !== definition.baseOrder ||
      task.settlementPolicy !== definition.settlementPolicy
    ) {
      return fail("scheduled task class, order, and settlement policy must match catalog definition");
    }

    if (task.source.kind === "SYSTEM") {
      if (
        definition.sourceKind !== "SYSTEM" ||
        task.source.systemTaskType !== definition.systemTaskType ||
        task.taskType !== task.source.systemTaskType ||
        task.settlementPolicy !== "RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT"
      ) {
        return fail("system scheduled task must match system catalog definition");
      }

      if (task.taskType === "MINION_INFO") {
        minionInfoCount += 1;
      }

      if (task.taskType === "DEMON_INFO") {
        demonInfoCount += 1;
      }

      continue;
    }

    if (task.source.kind === "PHILOSOPHER_GAINED_ABILITY") {
      return fail("base first-night task plan cannot contain inserted philosopher gained ability tasks");
    }

    if (definition.sourceKind !== "ROLE" || task.settlementPolicy !== "REEVALUATE_SOURCE_AT_SETTLEMENT") {
      return fail("role scheduled task must match role catalog definition");
    }

    const rosterEntry = rosterByPlayerId.get(task.source.playerId);
    const assignmentEntry = assignmentByPlayerId.get(task.source.playerId);
    const catalogRole = catalogRolesByRoleId.get(task.source.role.roleId);
    if (
      rosterEntry === undefined ||
      assignmentEntry === undefined ||
      rosterEntry.seatNumber !== task.source.seatNumber ||
      assignmentEntry.seatNumber !== task.source.seatNumber ||
      definition.roleId !== task.source.role.roleId ||
      !sameRoleSetupSnapshot(task.source.role, assignmentEntry.role) ||
      catalogRole === undefined ||
      !sameRoleSetupSnapshot(task.source.role, catalogRole)
    ) {
      return fail("role scheduled task source must match roster, assignment, and role catalog");
    }

    const roleTaskKey = `${task.source.playerId}|${task.taskType}`;
    if (roleTaskKeys.has(roleTaskKey)) {
      return fail("role scheduled tasks must be unique by player and task type");
    }
    roleTaskKeys.add(roleTaskKey);
  }

  if (minionInfoCount !== 1 || demonInfoCount !== 1) {
    return fail("first-night task plan must include exactly one MINION_INFO and one DEMON_INFO task");
  }

  for (const assignmentEntry of assignment) {
    const definition = roleDefinitionByRoleId.get(assignmentEntry.role.roleId);
    const key = definition === undefined ? undefined : `${assignmentEntry.playerId}|${definition.taskType}`;
    if (definition !== undefined && (key === undefined || !roleTaskKeys.has(key))) {
      return fail("first-night task plan must include every in-play role task definition");
    }
  }

  for (const task of parsedTasks.tasks) {
    if (task.source.kind === "ROLE" && !roleDefinitionByRoleId.has(task.source.role.roleId)) {
      return fail("first-night task plan must not include role tasks for roles without first-night definitions");
    }
  }

  return { valid: true };
};

const scheduledTaskSourcesEqual = (left: ScheduledTaskSource, right: ScheduledTaskSource): boolean => {
  if (left.kind !== right.kind) {
    return false;
  }

  switch (left.kind) {
    case "SYSTEM":
      return right.kind === "SYSTEM" && left.systemTaskType === right.systemTaskType;

    case "ROLE":
      return right.kind === "ROLE" &&
        left.playerId === right.playerId &&
        left.seatNumber === right.seatNumber &&
        sameRoleSetupSnapshot(left.role, right.role);

    case "PHILOSOPHER_GAINED_ABILITY":
      return right.kind === "PHILOSOPHER_GAINED_ABILITY" &&
        left.playerId === right.playerId &&
        left.seatNumber === right.seatNumber &&
        left.opportunityId === right.opportunityId &&
        left.sourceCharacterStateRevision === right.sourceCharacterStateRevision &&
        sameRoleSetupSnapshot(left.sourceRole, right.sourceRole) &&
        sameRoleSetupSnapshot(left.chosenRole, right.chosenRole);

    default:
      return assertNever(left);
  }
};

const scheduledTasksEqual = (left: ScheduledTask, right: ScheduledTask): boolean =>
  left.taskId === right.taskId &&
  left.taskType === right.taskType &&
  left.taskClass === right.taskClass &&
  left.orderKey.baseOrder === right.orderKey.baseOrder &&
  left.orderKey.insertionOrder === right.orderKey.insertionOrder &&
  left.status === right.status &&
  left.settlementPolicy === right.settlementPolicy &&
  scheduledTaskSourcesEqual(left.source, right.source);

const validateRuntimeInsertedTask = (
  task: ScheduledTask,
  catalog: FirstNightTaskCatalogSnapshot
): FirstNightTaskPlanValidationResult => {
  if (task.source.kind !== "PHILOSOPHER_GAINED_ABILITY") {
    return fail("runtime inserted first-night task must use PHILOSOPHER_GAINED_ABILITY source");
  }

  const expectedRoleId = ROLE_ID_BY_FIRST_NIGHT_TASK_TYPE[task.taskType];
  const definition = catalog.definitions.find((candidate) => candidate.taskType === task.taskType);
  if (
    expectedRoleId === undefined ||
    definition === undefined ||
    definition.sourceKind !== "ROLE" ||
    task.source.sourceRole.roleId !== ("philosopher" as RoleId) ||
    task.source.chosenRole.roleId !== expectedRoleId ||
    task.taskClass !== definition.taskClass ||
    task.orderKey.baseOrder !== 100 ||
    task.orderKey.insertionOrder !== 1 ||
    task.status !== "PENDING" ||
    task.settlementPolicy !== definition.settlementPolicy
  ) {
    return fail("runtime inserted first-night task must match its philosopher gained role definition");
  }

  const expectedId = `first-night-v1:PHILOSOPHER_GAINED:${task.taskType}:seat-${String(task.source.seatNumber).padStart(2, "0")}:from-${task.source.chosenRole.roleId}`;
  if (task.taskId !== expectedId) {
    return fail("runtime inserted first-night task id must match the deterministic philosopher gained format");
  }

  return { valid: true };
};

export const validateFirstNightTaskPlanRuntimeState = (
  value: unknown,
  input: {
    readonly sourceFacts: FirstNightTaskPlanValidationSourceFacts;
    readonly insertedTasks?: readonly unknown[];
  }
): FirstNightTaskPlanValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, FIRST_NIGHT_TASK_PLAN_RUNTIME_STATE_KEYS)) {
    return fail("runtime first-night task plan state must have exact runtime shape");
  }

  if (
    typeof value.rulesBaselineVersion !== "string" ||
    value.nightNumber !== 1 ||
    value.taskPlanVersion !== SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION ||
    value.taskCatalogVersion !== SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION ||
    value.taskCatalogSignatureAlgorithm !== SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM ||
    typeof value.taskCatalogSignature !== "string" ||
    typeof value.rosterVersion !== "string" ||
    typeof value.assignmentAlgorithmVersion !== "string" ||
    typeof value.roleCatalogSignature !== "string" ||
    value.knowledgeModelVersion !== SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION ||
    value.knowledgeStage !== INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE
  ) {
    return fail("runtime first-night task plan state fields must use supported primitive values");
  }

  const catalogValidation = validateFirstNightTaskCatalogSnapshot(value.taskCatalogSnapshot);
  if (!catalogValidation.valid) {
    return catalogValidation;
  }

  const catalog = value.taskCatalogSnapshot as FirstNightTaskCatalogSnapshot;
  if (
    value.taskCatalogVersion !== catalog.taskCatalogVersion ||
    value.taskCatalogSignatureAlgorithm !== catalog.taskCatalogSignatureAlgorithm ||
    value.taskCatalogSignature !== catalog.taskCatalogSignature
  ) {
    return fail("runtime first-night task plan catalog metadata must match taskCatalogSnapshot");
  }

  const firstNight = input.sourceFacts.firstNight as FirstNightInitializedPayload;
  const initialKnowledge = input.sourceFacts.initialPrivateKnowledge as InitialPrivateKnowledgeEstablishedPayload;
  if (
    value.rosterVersion !== firstNight.rosterVersion ||
    value.assignmentAlgorithmVersion !== firstNight.assignmentAlgorithmVersion ||
    value.roleCatalogSignature !== firstNight.roleCatalogSignature ||
    value.knowledgeModelVersion !== initialKnowledge.knowledgeModelVersion ||
    value.knowledgeStage !== initialKnowledge.knowledgeStage
  ) {
    return fail("runtime first-night task plan metadata must match first-night and private knowledge facts");
  }

  const parsedPlanTasks = parseScheduledTasks(value.tasks);
  if (!parsedPlanTasks.valid) {
    return parsedPlanTasks;
  }

  const parsedInsertedTasks = parseScheduledTasks(input.insertedTasks ?? []);
  if (!parsedInsertedTasks.valid) {
    return parsedInsertedTasks;
  }

  if (parsedInsertedTasks.tasks.some((task) => task.source.kind !== "PHILOSOPHER_GAINED_ABILITY")) {
    return fail("runtime inserted task facts must come from FirstNightTaskInserted philosopher gained tasks");
  }

  const runtimeInsertedTasks = parsedPlanTasks.tasks.filter((task) => task.source.kind === "PHILOSOPHER_GAINED_ABILITY");
  const baseTasks = parsedPlanTasks.tasks.filter((task) => task.source.kind !== "PHILOSOPHER_GAINED_ABILITY");

  if (runtimeInsertedTasks.length > 1 || parsedInsertedTasks.tasks.length > 1) {
    return fail("runtime first-night task plan supports at most one philosopher gained inserted task");
  }

  if (runtimeInsertedTasks.length !== parsedInsertedTasks.tasks.length) {
    return fail("runtime inserted first-night task must come from a matching FirstNightTaskInserted event");
  }

  const taskIds = new Set<ScheduledTaskId>();
  for (const [index, task] of parsedPlanTasks.tasks.entries()) {
    if (taskIds.has(task.taskId)) {
      return fail("runtime first-night task ids must be unique");
    }
    taskIds.add(task.taskId);

    if (index > 0 && compareFirstNightTaskOrder(parsedPlanTasks.tasks[index - 1] ?? task, task) >= 0) {
      return fail("runtime first-night tasks must use canonical order");
    }
  }

  const baseValidation = validateScheduledTasksAgainstSourceFacts(baseTasks, catalog, input.sourceFacts);
  if (!baseValidation.valid) {
    return baseValidation;
  }

  const [runtimeInsertedTask] = runtimeInsertedTasks;
  const [expectedInsertedTask] = parsedInsertedTasks.tasks;
  if (runtimeInsertedTask === undefined || expectedInsertedTask === undefined) {
    return { valid: true };
  }

  const insertedValidation = validateRuntimeInsertedTask(runtimeInsertedTask, catalog);
  if (!insertedValidation.valid) {
    return insertedValidation;
  }

  if (!scheduledTasksEqual(runtimeInsertedTask, expectedInsertedTask)) {
    return fail("runtime inserted first-night task must exactly match the FirstNightTaskInserted event");
  }

  const philosopherIndex = parsedPlanTasks.tasks.findIndex((task) => task.taskType === "PHILOSOPHER_ACTION");
  const minionInfoIndex = parsedPlanTasks.tasks.findIndex((task) => task.taskType === "MINION_INFO");
  const insertedIndex = parsedPlanTasks.tasks.findIndex((task) => task.taskId === runtimeInsertedTask.taskId);
  if (
    philosopherIndex < 0 ||
    minionInfoIndex < 0 ||
    insertedIndex <= philosopherIndex ||
    insertedIndex >= minionInfoIndex
  ) {
    return fail("runtime inserted first-night task must be after PHILOSOPHER_ACTION and before MINION_INFO");
  }

  return { valid: true };
};

export const validateFirstNightTaskPlanCreatedPayload = (
  value: unknown,
  sourceFacts: FirstNightTaskPlanValidationSourceFacts
): FirstNightTaskPlanValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, FIRST_NIGHT_TASK_PLAN_PAYLOAD_KEYS)) {
    return fail("FirstNightTaskPlanCreated payload must have exact runtime shape");
  }

  if (
    typeof value.rulesBaselineVersion !== "string" ||
    value.nightNumber !== 1 ||
    value.taskPlanVersion !== SUPPORTED_FIRST_NIGHT_TASK_PLAN_VERSION ||
    value.taskCatalogVersion !== SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION ||
    value.taskCatalogSignatureAlgorithm !== SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM ||
    typeof value.taskCatalogSignature !== "string" ||
    typeof value.rosterVersion !== "string" ||
    typeof value.assignmentAlgorithmVersion !== "string" ||
    typeof value.roleCatalogSignature !== "string" ||
    value.knowledgeModelVersion !== SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION ||
    value.knowledgeStage !== INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE
  ) {
    return fail("FirstNightTaskPlanCreated payload fields must use supported primitive values");
  }

  const catalogValidation = validateFirstNightTaskCatalogSnapshot(value.taskCatalogSnapshot);
  if (!catalogValidation.valid) {
    return catalogValidation;
  }

  const catalog = value.taskCatalogSnapshot as FirstNightTaskCatalogSnapshot;
  if (
    value.taskCatalogVersion !== catalog.taskCatalogVersion ||
    value.taskCatalogSignatureAlgorithm !== catalog.taskCatalogSignatureAlgorithm ||
    value.taskCatalogSignature !== catalog.taskCatalogSignature
  ) {
    return fail("FirstNightTaskPlanCreated catalog metadata must match taskCatalogSnapshot");
  }

  const firstNight = sourceFacts.firstNight as FirstNightInitializedPayload;
  const initialKnowledge = sourceFacts.initialPrivateKnowledge as InitialPrivateKnowledgeEstablishedPayload;
  if (
    value.rosterVersion !== firstNight.rosterVersion ||
    value.assignmentAlgorithmVersion !== firstNight.assignmentAlgorithmVersion ||
    value.roleCatalogSignature !== firstNight.roleCatalogSignature ||
    value.knowledgeModelVersion !== initialKnowledge.knowledgeModelVersion ||
    value.knowledgeStage !== initialKnowledge.knowledgeStage
  ) {
    return fail("FirstNightTaskPlanCreated metadata must match first-night and private knowledge facts");
  }

  return validateScheduledTasksAgainstSourceFacts(value.tasks, catalog, sourceFacts);
};

export const cloneFirstNightTaskDefinition = (definition: FirstNightTaskDefinition): FirstNightTaskDefinition => {
  if (definition.sourceKind === "ROLE") {
    return {
      taskType: definition.taskType,
      taskClass: definition.taskClass,
      baseOrder: definition.baseOrder,
      sourceKind: definition.sourceKind,
      settlementPolicy: definition.settlementPolicy,
      roleId: definition.roleId
    };
  }

  return {
    taskType: definition.taskType,
    taskClass: definition.taskClass,
    baseOrder: definition.baseOrder,
    sourceKind: definition.sourceKind,
    settlementPolicy: definition.settlementPolicy,
    systemTaskType: definition.systemTaskType
  };
};

export const cloneFirstNightTaskCatalogSnapshot = (
  snapshot: FirstNightTaskCatalogSnapshot
): FirstNightTaskCatalogSnapshot => ({
  taskCatalogVersion: snapshot.taskCatalogVersion,
  taskCatalogSignatureAlgorithm: snapshot.taskCatalogSignatureAlgorithm,
  taskCatalogSignature: snapshot.taskCatalogSignature,
  definitions: snapshot.definitions.map(cloneFirstNightTaskDefinition)
});

export const cloneScheduledTaskSource = (source: ScheduledTaskSource): ScheduledTaskSource => {
  switch (source.kind) {
    case "ROLE":
      return {
        kind: source.kind,
        playerId: source.playerId,
        seatNumber: source.seatNumber,
        role: cloneRoleSetupSnapshot(source.role)
      };

    case "SYSTEM":
      return {
        kind: source.kind,
        systemTaskType: source.systemTaskType
      };

    case "PHILOSOPHER_GAINED_ABILITY":
      return {
        kind: source.kind,
        playerId: source.playerId,
        seatNumber: source.seatNumber,
        sourceRole: cloneRoleSetupSnapshot(source.sourceRole),
        chosenRole: cloneRoleSetupSnapshot(source.chosenRole),
        opportunityId: source.opportunityId,
        sourceCharacterStateRevision: source.sourceCharacterStateRevision
      };

    default:
      return assertNever(source);
  }
};

export const cloneScheduledTask = (task: ScheduledTask): ScheduledTask => ({
  taskId: task.taskId,
  taskType: task.taskType,
  taskClass: task.taskClass,
  orderKey: {
    baseOrder: task.orderKey.baseOrder,
    insertionOrder: task.orderKey.insertionOrder
  },
  source: cloneScheduledTaskSource(task.source),
  status: task.status,
  settlementPolicy: task.settlementPolicy
});

export const cloneFirstNightTaskPlan = (plan: FirstNightTaskPlan): FirstNightTaskPlan => ({
  nightNumber: plan.nightNumber,
  taskPlanVersion: plan.taskPlanVersion,
  taskCatalogVersion: plan.taskCatalogVersion,
  taskCatalogSignatureAlgorithm: plan.taskCatalogSignatureAlgorithm,
  taskCatalogSignature: plan.taskCatalogSignature,
  taskCatalogSnapshot: cloneFirstNightTaskCatalogSnapshot(plan.taskCatalogSnapshot),
  rosterVersion: plan.rosterVersion,
  assignmentAlgorithmVersion: plan.assignmentAlgorithmVersion,
  roleCatalogSignature: plan.roleCatalogSignature,
  knowledgeModelVersion: plan.knowledgeModelVersion,
  knowledgeStage: plan.knowledgeStage,
  tasks: plan.tasks.map(cloneScheduledTask)
});
