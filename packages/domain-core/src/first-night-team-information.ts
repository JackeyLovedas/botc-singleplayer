import type { CurrentCharacterStateSet } from "./current-character-state.js";
import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import {
  resolveCurrentEvilTeam,
  validateCurrentCharacterStateSet
} from "./current-character-state.js";
import type {
  FirstNightTaskProgress,
  FirstNightSystemTaskType,
  FirstNightTaskPlan,
  FirstNightTaskType
} from "./first-night-task-plan.js";
import {
  getNextUnsettledFirstNightTask
} from "./first-night-task-plan.js";
import type { PlayerId, ScheduledTaskId } from "./ids.js";
import type {
  DemonBluffsKnowledge,
  DemonIdentityKnowledge,
  KnownPlayerReference,
  MinionIdentitiesKnowledge
} from "./initial-private-knowledge.js";
import {
  cloneInitialKnowledgeEntry,
  cloneKnownPlayerReference,
  hasExactEnumerableKeys,
  isPlainRecord,
  parsePrivateKnowledgeEntryShape
} from "./initial-private-knowledge.js";
import type { PlayerRoster } from "./player-roster.js";
import type { GeneratedSetup, RoleSetupSnapshot } from "./setup-types.js";
import { compareStableId, sameRoleSetupSnapshot } from "./setup-types.js";

export const SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION = "first-night-team-knowledge-v1" as const;
export const MINION_INFORMATION_KNOWLEDGE_STAGE = "MINION_INFORMATION" as const;
export const DEMON_INFORMATION_KNOWLEDGE_STAGE = "DEMON_INFORMATION" as const;

export type FirstNightTeamKnowledgeModelVersion = typeof SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION;
export type FirstNightTeamKnowledgeStage =
  | typeof MINION_INFORMATION_KNOWLEDGE_STAGE
  | typeof DEMON_INFORMATION_KNOWLEDGE_STAGE;

export type MinionInformationEntry = DemonIdentityKnowledge | MinionIdentitiesKnowledge;
export type DemonInformationEntry = MinionIdentitiesKnowledge | DemonBluffsKnowledge;
export type FirstNightSystemInformationEntry = MinionInformationEntry | DemonInformationEntry;

export type FirstNightSystemInformationResolution = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: FirstNightSystemTaskType;
  readonly characterStateRevision: number;
  readonly knowledgeModelVersion: FirstNightTeamKnowledgeModelVersion;
  readonly knowledgeStage: FirstNightTeamKnowledgeStage;
  readonly entries: readonly FirstNightSystemInformationEntry[];
};

export type FirstNightSystemInformationFailureCode =
  | "InvalidCurrentCharacterState"
  | "InvalidTaskType"
  | "InvalidRoster"
  | "InvalidSetup"
  | "InvalidEvilTeam"
  | "InvalidKnowledgeResult";

export type FirstNightSystemInformationResolutionFailure = {
  readonly status: "failure";
  readonly failureCode: FirstNightSystemInformationFailureCode;
  readonly message: string;
  readonly conflictingPlayerIds: readonly PlayerId[];
};

export type FirstNightSystemInformationResolutionSuccess = {
  readonly status: "success";
  readonly resolution: FirstNightSystemInformationResolution;
};

export type FirstNightSystemInformationResolutionResult =
  | FirstNightSystemInformationResolutionSuccess
  | FirstNightSystemInformationResolutionFailure;

export type FirstNightSystemInformationResolverInput = {
  readonly taskType: FirstNightSystemTaskType;
  readonly taskId: ScheduledTaskId;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roster: PlayerRoster;
  readonly setup: GeneratedSetup;
};

export type MinionInformationDeliveredPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "MINION_INFO";
  readonly knowledgeModelVersion: FirstNightTeamKnowledgeModelVersion;
  readonly knowledgeStage: typeof MINION_INFORMATION_KNOWLEDGE_STAGE;
  readonly characterStateRevision: number;
  readonly rosterVersion: string;
  readonly roleCatalogSignature: string;
  readonly entries: readonly MinionInformationEntry[];
};

export type DemonInformationDeliveredPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DEMON_INFO";
  readonly knowledgeModelVersion: FirstNightTeamKnowledgeModelVersion;
  readonly knowledgeStage: typeof DEMON_INFORMATION_KNOWLEDGE_STAGE;
  readonly characterStateRevision: number;
  readonly rosterVersion: string;
  readonly roleCatalogSignature: string;
  readonly entries: readonly DemonInformationEntry[];
};

export type TeamInformationValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

const TEAM_INFORMATION_PAYLOAD_KEYS = [
  "characterStateRevision",
  "entries",
  "knowledgeModelVersion",
  "knowledgeStage",
  "nightNumber",
  "roleCatalogSignature",
  "rosterVersion",
  "rulesBaselineVersion",
  "taskId",
  "taskType"
] as const;

const fail = (reason: string): TeamInformationValidationResult => ({ valid: false, reason });

const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      return false;
    }
  }

  return true;
};

const sameKnownPlayerReference = (left: KnownPlayerReference, right: KnownPlayerReference): boolean =>
  left.playerId === right.playerId && left.seatNumber === right.seatNumber;

const knownPlayerReferencesEqual = (
  left: readonly KnownPlayerReference[],
  right: readonly KnownPlayerReference[]
): boolean =>
  left.length === right.length &&
  left.every((reference, index) => {
    const other = right[index];
    return other !== undefined && sameKnownPlayerReference(reference, other);
  });

const roleSnapshotsEqual = (
  left: readonly RoleSetupSnapshot[],
  right: readonly RoleSetupSnapshot[]
): boolean =>
  left.length === right.length &&
  left.every((role, index) => {
    const other = right[index];
    return other !== undefined && sameRoleSetupSnapshot(role, other);
  });

const entriesEqual = (
  left: readonly FirstNightSystemInformationEntry[],
  right: readonly FirstNightSystemInformationEntry[]
): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((entry, index) => {
    const other = right[index];
    if (other === undefined || entry.kind !== other.kind || entry.recipientPlayerId !== other.recipientPlayerId) {
      return false;
    }

    switch (entry.kind) {
      case "DEMON_IDENTITY":
        return other.kind === "DEMON_IDENTITY" && sameKnownPlayerReference(entry.demon, other.demon);

      case "MINION_IDENTITIES":
        return other.kind === "MINION_IDENTITIES" && knownPlayerReferencesEqual(entry.minions, other.minions);

      case "DEMON_BLUFFS":
        return other.kind === "DEMON_BLUFFS" && roleSnapshotsEqual(entry.roles, other.roles);
    }
  });
};

const parseTeamInformationEntries = (
  entries: unknown,
  allowedKinds: readonly FirstNightSystemInformationEntry["kind"][]
): { readonly valid: true; readonly entries: readonly FirstNightSystemInformationEntry[] } | { readonly valid: false; readonly reason: string } => {
  if (!Array.isArray(entries)) {
    return { valid: false, reason: "team information entries must be a real array" };
  }

  if (!isDenseArray(entries)) {
    return { valid: false, reason: "team information entries must not contain sparse holes" };
  }

  const parsed: FirstNightSystemInformationEntry[] = [];
  for (const entry of entries) {
    const result = parsePrivateKnowledgeEntryShape(entry);
    if ("valid" in result) {
      return { valid: false, reason: result.valid ? "team information entry parser returned no entry" : result.reason };
    }

    if (result.kind === "OWN_CHARACTER" || !allowedKinds.includes(result.kind)) {
      return { valid: false, reason: `${result.kind} is not valid for this team information payload` };
    }

    parsed.push(result);
  }

  return { valid: true, entries: parsed };
};

export const cloneFirstNightSystemInformationResolution = (
  resolution: FirstNightSystemInformationResolution
): FirstNightSystemInformationResolution => ({
  taskId: resolution.taskId,
  taskType: resolution.taskType,
  characterStateRevision: resolution.characterStateRevision,
  knowledgeModelVersion: resolution.knowledgeModelVersion,
  knowledgeStage: resolution.knowledgeStage,
  entries: resolution.entries.map((entry) => cloneInitialKnowledgeEntry(entry) as FirstNightSystemInformationEntry)
});

export const expectedMinionInformationEntries = (
  demon: KnownPlayerReference,
  minions: readonly KnownPlayerReference[]
): readonly MinionInformationEntry[] => {
  const orderedMinions = [...minions].sort((left, right) => left.seatNumber - right.seatNumber);
  return orderedMinions.flatMap((minion) => {
    const otherMinions = orderedMinions
      .filter((candidate) => candidate.playerId !== minion.playerId)
      .map(cloneKnownPlayerReference);
    return [
      {
        kind: "DEMON_IDENTITY" as const,
        recipientPlayerId: minion.playerId,
        demon: cloneKnownPlayerReference(demon)
      },
      {
        kind: "MINION_IDENTITIES" as const,
        recipientPlayerId: minion.playerId,
        minions: otherMinions
      }
    ];
  });
};

export const expectedDemonInformationEntries = (
  demon: KnownPlayerReference,
  minions: readonly KnownPlayerReference[],
  demonBluffs: readonly RoleSetupSnapshot[]
): readonly DemonInformationEntry[] => [
  {
    kind: "MINION_IDENTITIES",
    recipientPlayerId: demon.playerId,
    minions: [...minions].sort((left, right) => left.seatNumber - right.seatNumber).map(cloneKnownPlayerReference)
  },
  {
    kind: "DEMON_BLUFFS",
    recipientPlayerId: demon.playerId,
    roles: [...demonBluffs].sort((left, right) => compareStableId(left.roleId, right.roleId)).map(cloneRoleSetupSnapshot)
  }
];

const validateDemonBluffsForSetup = (setup: GeneratedSetup): TeamInformationValidationResult => {
  if (setup.demonBluffs.length !== 3) {
    return fail("setup.demonBluffs must contain exactly three roles");
  }

  const actualRoleIds = new Set(setup.actualRoles.map((role) => role.roleId));
  const catalogByRoleId = new Map(setup.roleCatalogSnapshot.roles.map((role) => [role.roleId, role]));
  const bluffRoleIds = new Set<string>();
  for (const [index, bluff] of setup.demonBluffs.entries()) {
    if (index > 0 && compareStableId(setup.demonBluffs[index - 1]?.roleId ?? "", bluff.roleId) >= 0) {
      return fail("setup.demonBluffs must be sorted by ASCII roleId");
    }

    if (bluffRoleIds.has(bluff.roleId)) {
      return fail("setup.demonBluffs role ids must be unique");
    }
    bluffRoleIds.add(bluff.roleId);

    const catalogRole = catalogByRoleId.get(bluff.roleId);
    if (
      catalogRole === undefined ||
      !sameRoleSetupSnapshot(bluff, catalogRole) ||
      actualRoleIds.has(bluff.roleId) ||
      bluff.defaultAlignment !== "GOOD" ||
      bluff.characterType === "MINION" ||
      bluff.characterType === "DEMON"
    ) {
      return fail("setup.demonBluffs must be good non-actual roles from the role catalog");
    }
  }

  return { valid: true };
};

const validateCommonTeamInformationPayload = (input: {
  readonly payload: unknown;
  readonly expectedTaskType: FirstNightSystemTaskType;
  readonly expectedKnowledgeStage: FirstNightTeamKnowledgeStage;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roster: PlayerRoster;
  readonly rosterVersion: string;
  readonly setup: GeneratedSetup;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
}): { readonly valid: true; readonly payload: Record<string, unknown> } | { readonly valid: false; readonly reason: string } => {
  if (!isPlainRecord(input.payload) || !hasExactEnumerableKeys(input.payload, TEAM_INFORMATION_PAYLOAD_KEYS)) {
    return { valid: false, reason: "team information payload must have exact runtime shape" };
  }

  if (
    input.payload.nightNumber !== 1 ||
    input.payload.taskType !== input.expectedTaskType ||
    typeof input.payload.taskId !== "string" ||
    input.payload.taskId.trim().length === 0 ||
    input.payload.knowledgeModelVersion !== SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION ||
    input.payload.knowledgeStage !== input.expectedKnowledgeStage ||
    typeof input.payload.characterStateRevision !== "number" ||
    !Number.isInteger(input.payload.characterStateRevision) ||
    input.payload.characterStateRevision <= 0 ||
    typeof input.payload.rosterVersion !== "string" ||
    typeof input.payload.roleCatalogSignature !== "string" ||
    typeof input.payload.rulesBaselineVersion !== "string"
  ) {
    return { valid: false, reason: "team information payload fields must use supported primitive values" };
  }

  if (
    input.payload.characterStateRevision !== input.currentCharacterState.revision ||
    input.payload.rosterVersion !== input.rosterVersion ||
    input.payload.roleCatalogSignature !== input.setup.roleCatalogSignature
  ) {
    return { valid: false, reason: "team information payload metadata must match current source facts" };
  }

  const currentValidation = validateCurrentCharacterStateSet({
    currentCharacterState: input.currentCharacterState,
    roster: input.roster,
    setup: input.setup
  });
  if (!currentValidation.valid) {
    return { valid: false, reason: currentValidation.reason };
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, undefined);
  if (nextTask === undefined) {
    return { valid: false, reason: "team information requires an unsettled first-night task" };
  }

  return { valid: true, payload: input.payload };
};

const validateExpectedTask = (input: {
  readonly taskId: ScheduledTaskId;
  readonly taskType: FirstNightTaskType;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
}): TeamInformationValidationResult => {
  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined) {
    return fail("team information requires an unsettled first-night task");
  }

  if (nextTask.taskId !== input.taskId) {
    return fail("team information task must be the current next unsettled task");
  }

  if (nextTask.taskType !== input.taskType) {
    return fail("team information taskType must match the current next unsettled task");
  }

  return { valid: true };
};

export const validateMinionInformationDeliveredPayload = (
  payload: unknown,
  sourceFacts: {
    readonly currentCharacterState: CurrentCharacterStateSet;
    readonly roster: PlayerRoster;
    readonly rosterVersion: string;
    readonly setup: GeneratedSetup;
    readonly firstNightTaskPlan: FirstNightTaskPlan;
    readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  }
): TeamInformationValidationResult => {
  const common = validateCommonTeamInformationPayload({
    ...sourceFacts,
    payload,
    expectedTaskType: "MINION_INFO",
    expectedKnowledgeStage: MINION_INFORMATION_KNOWLEDGE_STAGE
  });
  if (!common.valid) {
    return common;
  }

  const parsedEntries = parseTeamInformationEntries(common.payload.entries, ["DEMON_IDENTITY", "MINION_IDENTITIES"]);
  if (!parsedEntries.valid) {
    return parsedEntries;
  }

  const taskValidation = validateExpectedTask({
    taskId: common.payload.taskId as ScheduledTaskId,
    taskType: "MINION_INFO",
    firstNightTaskPlan: sourceFacts.firstNightTaskPlan,
    firstNightTaskProgress: sourceFacts.firstNightTaskProgress
  });
  if (!taskValidation.valid) {
    return taskValidation;
  }

  const team = resolveCurrentEvilTeam({
    currentCharacterState: sourceFacts.currentCharacterState,
    roster: sourceFacts.roster
  });
  if (team.status === "failure") {
    return fail(team.message);
  }

  const expected = expectedMinionInformationEntries(team.team.demon, team.team.minions);
  if (!entriesEqual(parsedEntries.entries, expected)) {
    return fail("MinionInformationDelivered entries must match current evil team exactly");
  }

  return { valid: true };
};

export const validateDemonInformationDeliveredPayload = (
  payload: unknown,
  sourceFacts: {
    readonly currentCharacterState: CurrentCharacterStateSet;
    readonly roster: PlayerRoster;
    readonly rosterVersion: string;
    readonly setup: GeneratedSetup;
    readonly firstNightTaskPlan: FirstNightTaskPlan;
    readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  }
): TeamInformationValidationResult => {
  const common = validateCommonTeamInformationPayload({
    ...sourceFacts,
    payload,
    expectedTaskType: "DEMON_INFO",
    expectedKnowledgeStage: DEMON_INFORMATION_KNOWLEDGE_STAGE
  });
  if (!common.valid) {
    return common;
  }

  const parsedEntries = parseTeamInformationEntries(common.payload.entries, ["MINION_IDENTITIES", "DEMON_BLUFFS"]);
  if (!parsedEntries.valid) {
    return parsedEntries;
  }

  const taskValidation = validateExpectedTask({
    taskId: common.payload.taskId as ScheduledTaskId,
    taskType: "DEMON_INFO",
    firstNightTaskPlan: sourceFacts.firstNightTaskPlan,
    firstNightTaskProgress: sourceFacts.firstNightTaskProgress
  });
  if (!taskValidation.valid) {
    return taskValidation;
  }

  const bluffValidation = validateDemonBluffsForSetup(sourceFacts.setup);
  if (!bluffValidation.valid) {
    return bluffValidation;
  }

  const team = resolveCurrentEvilTeam({
    currentCharacterState: sourceFacts.currentCharacterState,
    roster: sourceFacts.roster
  });
  if (team.status === "failure") {
    return fail(team.message);
  }

  const expected = expectedDemonInformationEntries(team.team.demon, team.team.minions, sourceFacts.setup.demonBluffs);
  if (!entriesEqual(parsedEntries.entries, expected)) {
    return fail("DemonInformationDelivered entries must match current evil team and setup bluffs exactly");
  }

  return { valid: true };
};
