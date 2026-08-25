import {
  SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM,
  SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION,
  SUPPORTED_SCRIPT_EDITION,
  SUPPORTED_SCRIPT_ID,
  SUPPORTED_SCRIPT_NAME,
  calculateFirstNightTaskCatalogSignature,
  cloneFirstNightTaskCatalogSnapshot,
  compareStableId,
  roleId
} from "@botc/domain-core";
import type {
  CharacterType,
  DefaultAlignment,
  FirstNightTaskCatalogSnapshot,
  FirstNightTaskDefinition,
  RoleDefinition,
  ScriptDefinition,
  SetupModifier
} from "@botc/domain-core";

const zeroModifier: SetupModifier = {
  outsiderDelta: 0,
  townsfolkDelta: 0
};

const role = (
  id: string,
  nameZh: string,
  nameEn: string,
  characterType: CharacterType,
  verificationStatus: RoleDefinition["verificationStatus"],
  setupModifier: SetupModifier = zeroModifier
): RoleDefinition => {
  const defaultAlignment: DefaultAlignment = characterType === "MINION" || characterType === "DEMON" ? "EVIL" : "GOOD";

  return {
    roleId: roleId(id),
    nameZh,
    nameEn,
    edition: SUPPORTED_SCRIPT_EDITION,
    characterType,
    defaultAlignment,
    setupModifier,
    sourceDocument:
      characterType === "DEMON"
        ? "project-handoff/rules/19-sects-and-violets-demons.md"
        : "project-handoff/rules/18-sects-and-violets-roles.md",
    verificationStatus
  };
};

export const SECTS_AND_VIOLETS_ROLES: readonly RoleDefinition[] = [
  role("clockmaker", "钟表匠", "Clockmaker", "TOWNSFOLK", "PARTIAL"),
  role("dreamer", "筑梦师", "Dreamer", "TOWNSFOLK", "PARTIAL"),
  role("snake_charmer", "舞蛇人", "Snake Charmer", "TOWNSFOLK", "PARTIAL"),
  role("mathematician", "数学家", "Mathematician", "TOWNSFOLK", "VERIFIED_CORE"),
  role("flowergirl", "卖花女孩", "Flowergirl", "TOWNSFOLK", "PARTIAL"),
  role("town_crier", "城镇公告员", "Town Crier", "TOWNSFOLK", "PARTIAL"),
  role("oracle", "神谕者", "Oracle", "TOWNSFOLK", "PARTIAL"),
  role("savant", "博学者", "Savant", "TOWNSFOLK", "PARTIAL"),
  role("seamstress", "女裁缝", "Seamstress", "TOWNSFOLK", "PARTIAL"),
  role("philosopher", "哲学家", "Philosopher", "TOWNSFOLK", "VERIFIED_CORE"),
  role("artist", "艺术家", "Artist", "TOWNSFOLK", "PARTIAL"),
  role("juggler", "杂耍艺人", "Juggler", "TOWNSFOLK", "PARTIAL"),
  role("sage", "贤者", "Sage", "TOWNSFOLK", "PARTIAL"),
  role("mutant", "畸形秀演员", "Mutant", "OUTSIDER", "PARTIAL"),
  role("sweetheart", "心上人", "Sweetheart", "OUTSIDER", "PARTIAL"),
  role("barber", "理发师", "Barber", "OUTSIDER", "VERIFIED_CORE"),
  role("klutz", "呆瓜", "Klutz", "OUTSIDER", "PARTIAL"),
  role("evil_twin", "镜像双子", "Evil Twin", "MINION", "VERIFIED_CORE"),
  role("witch", "女巫", "Witch", "MINION", "VERIFIED_CORE"),
  role("cerenovus", "洗脑师", "Cerenovus", "MINION", "VERIFIED_CORE"),
  role("pit_hag", "麻脸巫婆", "Pit-Hag", "MINION", "VERIFIED_CORE"),
  role("fang_gu", "方古", "Fang Gu", "DEMON", "VERIFIED_CORE", {
    outsiderDelta: 1,
    townsfolkDelta: -1
  }),
  role("vigormortis", "亡骨魔", "Vigormortis", "DEMON", "VERIFIED_CORE", {
    outsiderDelta: -1,
    townsfolkDelta: 1
  }),
  role("no_dashii", "诺-达鲺", "No Dashii", "DEMON", "VERIFIED_CORE"),
  role("vortox", "涡流", "Vortox", "DEMON", "VERIFIED_CORE")
];

export const SECTS_AND_VIOLETS_SCRIPT: ScriptDefinition = {
  scriptId: SUPPORTED_SCRIPT_ID,
  scriptName: SUPPORTED_SCRIPT_NAME,
  edition: SUPPORTED_SCRIPT_EDITION,
  roles: SECTS_AND_VIOLETS_ROLES
};

const expectedAlignment = (characterType: CharacterType): DefaultAlignment =>
  characterType === "MINION" || characterType === "DEMON" ? "EVIL" : "GOOD";

type ExpectedRoleMetadata = {
  readonly characterType: CharacterType;
  readonly defaultAlignment: DefaultAlignment;
  readonly setupModifier: SetupModifier;
};

const expectedRole = (characterType: CharacterType, setupModifier: SetupModifier = zeroModifier): ExpectedRoleMetadata => ({
  characterType,
  defaultAlignment: expectedAlignment(characterType),
  setupModifier
});

const EXPECTED_SECTS_AND_VIOLETS_ROLE_METADATA: Readonly<Record<string, ExpectedRoleMetadata>> = {
  clockmaker: expectedRole("TOWNSFOLK"),
  dreamer: expectedRole("TOWNSFOLK"),
  snake_charmer: expectedRole("TOWNSFOLK"),
  mathematician: expectedRole("TOWNSFOLK"),
  flowergirl: expectedRole("TOWNSFOLK"),
  town_crier: expectedRole("TOWNSFOLK"),
  oracle: expectedRole("TOWNSFOLK"),
  savant: expectedRole("TOWNSFOLK"),
  seamstress: expectedRole("TOWNSFOLK"),
  philosopher: expectedRole("TOWNSFOLK"),
  artist: expectedRole("TOWNSFOLK"),
  juggler: expectedRole("TOWNSFOLK"),
  sage: expectedRole("TOWNSFOLK"),
  mutant: expectedRole("OUTSIDER"),
  sweetheart: expectedRole("OUTSIDER"),
  barber: expectedRole("OUTSIDER"),
  klutz: expectedRole("OUTSIDER"),
  evil_twin: expectedRole("MINION"),
  witch: expectedRole("MINION"),
  cerenovus: expectedRole("MINION"),
  pit_hag: expectedRole("MINION"),
  fang_gu: expectedRole("DEMON", {
    outsiderDelta: 1,
    townsfolkDelta: -1
  }),
  vigormortis: expectedRole("DEMON", {
    outsiderDelta: -1,
    townsfolkDelta: 1
  }),
  no_dashii: expectedRole("DEMON"),
  vortox: expectedRole("DEMON")
};

export const assertValidSectsAndVioletsCatalog = (script: ScriptDefinition = SECTS_AND_VIOLETS_SCRIPT): void => {
  const roles = [...script.roles];
  const roleIds = new Set(roles.map((candidate) => candidate.roleId));

  if (
    script.scriptId !== SUPPORTED_SCRIPT_ID ||
    script.scriptName !== SUPPORTED_SCRIPT_NAME ||
    script.edition !== SUPPORTED_SCRIPT_EDITION
  ) {
    throw new Error("Sects & Violets script metadata is invalid");
  }

  if (roles.length !== 25 || roleIds.size !== 25) {
    throw new Error("Sects & Violets catalog must contain exactly 25 unique roles");
  }

  const expectedRoleIds = Object.keys(EXPECTED_SECTS_AND_VIOLETS_ROLE_METADATA).sort(compareStableId);
  const actualRoleIds = roles.map((candidate) => candidate.roleId).sort(compareStableId);
  if (actualRoleIds.join(",") !== expectedRoleIds.join(",")) {
    throw new Error("Sects & Violets catalog must match the exact expected role ids");
  }

  const counts = {
    TOWNSFOLK: roles.filter((candidate) => candidate.characterType === "TOWNSFOLK").length,
    OUTSIDER: roles.filter((candidate) => candidate.characterType === "OUTSIDER").length,
    MINION: roles.filter((candidate) => candidate.characterType === "MINION").length,
    DEMON: roles.filter((candidate) => candidate.characterType === "DEMON").length
  };

  if (counts.TOWNSFOLK !== 13 || counts.OUTSIDER !== 4 || counts.MINION !== 4 || counts.DEMON !== 4) {
    throw new Error("Sects & Violets catalog type counts are invalid");
  }

  for (const candidate of roles) {
    const expected = EXPECTED_SECTS_AND_VIOLETS_ROLE_METADATA[candidate.roleId];
    if (
      expected === undefined ||
      candidate.nameZh.trim().length === 0 ||
      candidate.nameEn.trim().length === 0 ||
      candidate.edition !== SUPPORTED_SCRIPT_EDITION ||
      candidate.characterType !== expected.characterType ||
      candidate.defaultAlignment !== expected.defaultAlignment ||
      candidate.setupModifier.outsiderDelta !== expected.setupModifier.outsiderDelta ||
      candidate.setupModifier.townsfolkDelta !== expected.setupModifier.townsfolkDelta
    ) {
      throw new Error("Sects & Violets catalog role metadata is invalid");
    }
  }
};

assertValidSectsAndVioletsCatalog();

export const ORDINARY_NIGHT_EXECUTION_MODELS = [
  "SCHEDULED_TASK",
  "ACTION_OPPORTUNITY",
  "EVENT_SUBSCRIPTION",
  "CONTINUOUS_RULE",
  "NONE"
] as const;
export type OrdinaryNightExecutionModel = (typeof ORDINARY_NIGHT_EXECUTION_MODELS)[number];
export type OrdinaryNightBaselineSupportStatus = "SUPPORTED" | "UNSUPPORTED" | "NOT_APPLICABLE";
export type OrdinaryNightInventoryRow = {
  readonly roleId: RoleDefinition["roleId"];
  readonly nightsheetOtherNightPresence: "PRESENT" | "ABSENT";
  readonly nightsheetOtherNightOrder: number | null;
  readonly executionModel: OrdinaryNightExecutionModel;
  readonly taskKind: string | null;
  readonly baselineSupportStatus: OrdinaryNightBaselineSupportStatus;
  readonly sourceBinding: string;
};

const ORDINARY_NIGHT_NIGHTSHEET_BINDING =
  "SECTS_AND_VIOLETS_ROLES@25;NIGHTSHEET_COMMIT=3d6d930a9e600321f93b2567a2e88948a675bc1e;NIGHTSHEET_SHA256=99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75";
const ORDINARY_NIGHT_ROLE_SNAPSHOT_BINDING =
  `${ORDINARY_NIGHT_NIGHTSHEET_BINDING};SNAPSHOT_SHA256=751dcb35aed610ab729c663544edb979e6745f276e167370ace7cc9e761d4724`;

const ordinaryNightRow = (
  roleIdValue: string,
  presence: OrdinaryNightInventoryRow["nightsheetOtherNightPresence"],
  order: number | null,
  executionModel: OrdinaryNightExecutionModel,
  taskKind: string | null,
  baselineSupportStatus: OrdinaryNightBaselineSupportStatus,
  sourceBinding = ORDINARY_NIGHT_NIGHTSHEET_BINDING
): OrdinaryNightInventoryRow => ({
  roleId: roleId(roleIdValue),
  nightsheetOtherNightPresence: presence,
  nightsheetOtherNightOrder: order,
  executionModel,
  taskKind,
  baselineSupportStatus,
  sourceBinding
});

export const SECTS_AND_VIOLETS_ORDINARY_NIGHT_INVENTORY: readonly OrdinaryNightInventoryRow[] = Object.freeze([
  ordinaryNightRow("clockmaker", "ABSENT", null, "NONE", null, "NOT_APPLICABLE"),
  ordinaryNightRow("dreamer", "PRESENT", 79, "SCHEDULED_TASK", "DREAMER_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("snake_charmer", "PRESENT", 23, "SCHEDULED_TASK", "SNAKE_CHARMER_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("mathematician", "PRESENT", 96, "SCHEDULED_TASK", "MATHEMATICIAN_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("flowergirl", "PRESENT", 80, "SCHEDULED_TASK", "FLOWERGIRL_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("town_crier", "PRESENT", 81, "SCHEDULED_TASK", "TOWN_CRIER_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("oracle", "PRESENT", 82, "SCHEDULED_TASK", "ORACLE_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("savant", "ABSENT", null, "NONE", null, "NOT_APPLICABLE"),
  ordinaryNightRow("seamstress", "PRESENT", 83, "SCHEDULED_TASK", "SEAMSTRESS_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("philosopher", "PRESENT", 11, "SCHEDULED_TASK", "PHILOSOPHER_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("artist", "ABSENT", null, "NONE", null, "NOT_APPLICABLE"),
  ordinaryNightRow("juggler", "PRESENT", 84, "SCHEDULED_TASK", "JUGGLER_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("sage", "PRESENT", 63, "EVENT_SUBSCRIPTION", null, "UNSUPPORTED"),
  ordinaryNightRow("mutant", "ABSENT", null, "NONE", null, "NOT_APPLICABLE"),
  ordinaryNightRow("sweetheart", "PRESENT", 61, "EVENT_SUBSCRIPTION", null, "UNSUPPORTED"),
  ordinaryNightRow("barber", "PRESENT", 60, "EVENT_SUBSCRIPTION", null, "UNSUPPORTED"),
  ordinaryNightRow("klutz", "ABSENT", null, "NONE", null, "NOT_APPLICABLE"),
  ordinaryNightRow("evil_twin", "ABSENT", null, "NONE", null, "NOT_APPLICABLE"),
  ordinaryNightRow("witch", "PRESENT", 27, "EVENT_SUBSCRIPTION", null, "UNSUPPORTED", ORDINARY_NIGHT_ROLE_SNAPSHOT_BINDING),
  ordinaryNightRow("cerenovus", "PRESENT", 28, "SCHEDULED_TASK", "CERENOVUS_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("pit_hag", "PRESENT", 29, "SCHEDULED_TASK", "PIT_HAG_ACTION", "UNSUPPORTED"),
  ordinaryNightRow("fang_gu", "PRESENT", 45, "EVENT_SUBSCRIPTION", null, "UNSUPPORTED", ORDINARY_NIGHT_ROLE_SNAPSHOT_BINDING),
  ordinaryNightRow("vigormortis", "PRESENT", 49, "CONTINUOUS_RULE", null, "UNSUPPORTED"),
  ordinaryNightRow("no_dashii", "PRESENT", 46, "CONTINUOUS_RULE", null, "UNSUPPORTED"),
  ordinaryNightRow("vortox", "PRESENT", 47, "CONTINUOUS_RULE", null, "UNSUPPORTED")
]);

const isDenseOrdinaryNightArray = (value: unknown): value is readonly OrdinaryNightInventoryRow[] => {
  if (!Array.isArray(value) || Object.getOwnPropertySymbols(value).length !== 0) return false;
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(value, index)) return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (descriptor === undefined || !("value" in descriptor) || descriptor.get || descriptor.set) return false;
  }
  return true;
};

const isExactOrdinaryNightRow = (value: unknown): value is OrdinaryNightInventoryRow => {
  if (typeof value !== "object" || value === null || Array.isArray(value) || Object.getOwnPropertySymbols(value).length !== 0) return false;
  const object = value;
  const keys = Object.getOwnPropertyNames(object);
  const expected = ["roleId", "nightsheetOtherNightPresence", "nightsheetOtherNightOrder", "executionModel", "taskKind", "baselineSupportStatus", "sourceBinding"];
  if (keys.length !== expected.length || !keys.every((key) => expected.includes(key))) return false;
  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(object, key);
    if (descriptor === undefined || !("value" in descriptor) || descriptor.get || descriptor.set) return false;
  }
  return typeof (value as { roleId: unknown }).roleId === "string" &&
    (typeof (value as { nightsheetOtherNightPresence: unknown }).nightsheetOtherNightPresence === "string") &&
    (typeof (value as { executionModel: unknown }).executionModel === "string") &&
    (typeof (value as { baselineSupportStatus: unknown }).baselineSupportStatus === "string") &&
    (typeof (value as { sourceBinding: unknown }).sourceBinding === "string") &&
    ((value as { nightsheetOtherNightOrder: unknown }).nightsheetOtherNightOrder === null || typeof (value as { nightsheetOtherNightOrder: unknown }).nightsheetOtherNightOrder === "number") &&
    ((value as { taskKind: unknown }).taskKind === null || (typeof (value as { taskKind: unknown }).taskKind === "string" && (value as { taskKind: string }).taskKind.length > 0));
};

export const assertValidSectsAndVioletsOrdinaryNightInventory = (
  inventory: readonly OrdinaryNightInventoryRow[] = SECTS_AND_VIOLETS_ORDINARY_NIGHT_INVENTORY
): void => {
  if (!Array.isArray(inventory) || !isDenseOrdinaryNightArray(inventory) || inventory.length !== 25) throw new Error("ordinary-night inventory must contain exactly 25 roles");
  const catalogIds = new Set(SECTS_AND_VIOLETS_ROLES.map((candidate) => candidate.roleId));
  const inventoryIds = new Set<string>();
  const executionModels = new Set<string>(ORDINARY_NIGHT_EXECUTION_MODELS);
  const supportStatuses = new Set<OrdinaryNightBaselineSupportStatus>(["SUPPORTED", "UNSUPPORTED", "NOT_APPLICABLE"]);
  const snapshotBoundRoles = new Set(["witch", "fang_gu"]);
  const orders = new Set<number>();
  for (const row of inventory) {
    if (!isExactOrdinaryNightRow(row)) throw new Error("ordinary-night inventory row shape is invalid");
    const rowId = String(row.roleId);
    if (!catalogIds.has(row.roleId) || inventoryIds.has(rowId)) throw new Error("ordinary-night inventory role ids must be unique and canonical");
    inventoryIds.add(rowId);
    if (row.nightsheetOtherNightPresence !== "PRESENT" && row.nightsheetOtherNightPresence !== "ABSENT") throw new Error("ordinary-night presence is invalid");
    if (!executionModels.has(row.executionModel) || !supportStatuses.has(row.baselineSupportStatus)) throw new Error("ordinary-night model or support status is invalid");
    const expectedSourceBinding = snapshotBoundRoles.has(rowId) ? ORDINARY_NIGHT_ROLE_SNAPSHOT_BINDING : ORDINARY_NIGHT_NIGHTSHEET_BINDING;
    if (row.sourceBinding !== expectedSourceBinding) throw new Error("ordinary-night source binding is not authoritative");
    if (row.nightsheetOtherNightPresence === "ABSENT" && row.nightsheetOtherNightOrder !== null) {
      throw new Error("absent ordinary-night role cannot have a nightsheet order");
    }
    if (row.nightsheetOtherNightPresence === "PRESENT") {
      if (row.nightsheetOtherNightOrder === null || !Number.isSafeInteger(row.nightsheetOtherNightOrder) || row.nightsheetOtherNightOrder < 1 || orders.has(row.nightsheetOtherNightOrder)) {
        throw new Error("present ordinary-night roles must have unique positive orders");
      }
      orders.add(row.nightsheetOtherNightOrder);
      if (row.baselineSupportStatus === "NOT_APPLICABLE") {
        throw new Error("present ordinary-night role cannot be not applicable");
      }
    } else if (row.baselineSupportStatus !== "NOT_APPLICABLE") {
      throw new Error("absent ordinary-night role must be not applicable");
    } else if (row.executionModel !== "NONE" || row.taskKind !== null) {
      throw new Error("absent ordinary-night role must use NONE with no task kind");
    }
    if (row.executionModel === "SCHEDULED_TASK" && row.taskKind === null) {
      throw new Error("scheduled ordinary-night task must have a task kind");
    }
    if (row.executionModel !== "SCHEDULED_TASK" && row.taskKind !== null) {
      throw new Error("non-scheduled ordinary-night model cannot have a task kind");
    }
    if (row.baselineSupportStatus === "SUPPORTED") {
      throw new Error("ordinary-night foundation cannot claim unsupported executable paths");
    }
  }
  if (inventoryIds.size !== 25 || [...catalogIds].some((id) => !inventoryIds.has(id))) throw new Error("ordinary-night inventory must match the Sects & Violets catalog");
};

assertValidSectsAndVioletsOrdinaryNightInventory();

const firstNightRoleTask = (
  taskType: FirstNightTaskDefinition["taskType"],
  taskClass: Extract<FirstNightTaskDefinition, { readonly sourceKind: "ROLE" }>["taskClass"],
  baseOrder: number,
  roleIdValue: string
): FirstNightTaskDefinition => ({
  taskType,
  taskClass,
  baseOrder,
  sourceKind: "ROLE",
  settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT",
  roleId: roleId(roleIdValue)
});

const firstNightSystemTask = (
  taskType: "MINION_INFO" | "DEMON_INFO",
  baseOrder: number
): FirstNightTaskDefinition => ({
  taskType,
  taskClass: "SYSTEM_INFORMATION",
  baseOrder,
  sourceKind: "SYSTEM",
  settlementPolicy: "RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT",
  systemTaskType: taskType
});

const SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_DEFINITIONS: readonly FirstNightTaskDefinition[] = [
  firstNightRoleTask("PHILOSOPHER_ACTION", "ROLE_ACTION", 100, "philosopher"),
  firstNightSystemTask("MINION_INFO", 200),
  firstNightSystemTask("DEMON_INFO", 300),
  firstNightRoleTask("SNAKE_CHARMER_ACTION", "ROLE_ACTION", 400, "snake_charmer"),
  firstNightRoleTask("EVIL_TWIN_SETUP", "ROLE_SETUP", 500, "evil_twin"),
  firstNightRoleTask("WITCH_ACTION", "ROLE_ACTION", 600, "witch"),
  firstNightRoleTask("CERENOVUS_ACTION", "ROLE_ACTION", 700, "cerenovus"),
  firstNightRoleTask("CLOCKMAKER_INFORMATION", "ROLE_INFORMATION", 800, "clockmaker"),
  firstNightRoleTask("DREAMER_ACTION", "ROLE_ACTION", 900, "dreamer"),
  firstNightRoleTask("SEAMSTRESS_ACTION", "ROLE_ACTION", 1000, "seamstress"),
  firstNightRoleTask("MATHEMATICIAN_INFORMATION", "ROLE_INFORMATION", 1100, "mathematician")
] as const;

const taskCatalogSignature = calculateFirstNightTaskCatalogSignature({
  taskCatalogVersion: SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION,
  definitions: SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_DEFINITIONS
});

export const SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_CATALOG: FirstNightTaskCatalogSnapshot = {
  taskCatalogVersion: SUPPORTED_FIRST_NIGHT_TASK_CATALOG_VERSION,
  taskCatalogSignatureAlgorithm: SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE_ALGORITHM,
  taskCatalogSignature: taskCatalogSignature,
  definitions: SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_DEFINITIONS
};

export const createSectsAndVioletsFirstNightTaskCatalogSnapshot = (): FirstNightTaskCatalogSnapshot =>
  cloneFirstNightTaskCatalogSnapshot(SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_CATALOG);
