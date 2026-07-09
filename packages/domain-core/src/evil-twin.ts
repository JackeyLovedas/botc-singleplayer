import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CurrentAlignment, CurrentCharacterState, CurrentCharacterStateSet } from "./current-character-state.js";
import { validateCurrentCharacterStateSet } from "./current-character-state.js";
import { DomainError } from "./errors.js";
import type {
  FirstNightTaskPlan,
  FirstNightTaskProgress,
  ScheduledTaskSettlement
} from "./first-night-task-plan.js";
import {
  getNextUnsettledFirstNightTask,
  isFirstNightTaskSettled
} from "./first-night-task-plan.js";
import type { PlayerId, ScheduledTaskId } from "./ids.js";
import type { KnownPlayerReference } from "./initial-private-knowledge.js";
import {
  cloneKnownPlayerReference,
  hasExactEnumerableKeys,
  hasExactKnownPlayerReferenceShape,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord
} from "./initial-private-knowledge.js";
import type { PlayerRoster } from "./player-roster.js";
import { validatePlayerRoster } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";

export const EVIL_TWIN_PAIRING_POLICY_VERSION = "evil-twin-pairing-policy-v1" as const;
export const SUPPORTED_EVIL_TWIN_KNOWLEDGE_MODEL_VERSION = "evil-twin-knowledge-model-v1" as const;
export const EVIL_TWIN_SETUP_KNOWLEDGE_STAGE = "EVIL_TWIN_SETUP_INFORMATION" as const;

export type EvilTwinPairingPolicyVersion = typeof EVIL_TWIN_PAIRING_POLICY_VERSION;
export type EvilTwinKnowledgeModelVersion = typeof SUPPORTED_EVIL_TWIN_KNOWLEDGE_MODEL_VERSION;
export type EvilTwinSetupKnowledgeStage = typeof EVIL_TWIN_SETUP_KNOWLEDGE_STAGE;

export type EvilTwinPair = {
  readonly pairId: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "EVIL_TWIN_SETUP";
  readonly evilTwinPlayer: KnownPlayerReference;
  readonly goodTwinPlayer: KnownPlayerReference;
  readonly evilTwinRole: RoleSetupSnapshot;
  readonly goodTwinRole: RoleSetupSnapshot;
  readonly evilTwinAlignment: "EVIL";
  readonly goodTwinAlignment: "GOOD";
  readonly characterStateRevision: number;
  readonly pairingPolicyVersion: EvilTwinPairingPolicyVersion;
};

export type EvilTwinPairSet = {
  readonly pairs: readonly EvilTwinPair[];
};

export type EvilTwinInformationEntry = {
  readonly recipientPlayerId: PlayerId;
  readonly kind: "EVIL_TWIN_PAIR";
  readonly counterpart: KnownPlayerReference;
};

export type EvilTwinPairEstablishedPayload = EvilTwinPair & {
  readonly rulesBaselineVersion: string;
};

export type EvilTwinInformationDeliveredPayload = {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "EVIL_TWIN_SETUP";
  readonly pairId: string;
  readonly knowledgeModelVersion: EvilTwinKnowledgeModelVersion;
  readonly knowledgeStage: EvilTwinSetupKnowledgeStage;
  readonly characterStateRevision: number;
  readonly entries: readonly EvilTwinInformationEntry[];
};

export type EvilTwinValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

export type EvilTwinPairCreationFailureCode =
  | "ScheduledTaskNotFound"
  | "ScheduledTaskAlreadySettled"
  | "ScheduledTaskNotNext"
  | "UnsupportedRoleSetupTask"
  | "ActionSourceNoLongerValid"
  | "NoLegalEvilTwinPair";

export type EvilTwinPairCreationResult =
  | { readonly status: "success"; readonly pair: EvilTwinPair }
  | { readonly status: "failure"; readonly failureCode: EvilTwinPairCreationFailureCode; readonly message: string };

const EVIL_TWIN_ROLE_ID = "evil_twin";

const EVIL_TWIN_PAIR_KEYS = [
  "characterStateRevision",
  "evilTwinAlignment",
  "evilTwinPlayer",
  "evilTwinRole",
  "goodTwinAlignment",
  "goodTwinPlayer",
  "goodTwinRole",
  "nightNumber",
  "pairId",
  "pairingPolicyVersion",
  "taskId",
  "taskType"
] as const;
const EVIL_TWIN_PAIR_ESTABLISHED_KEYS = ["rulesBaselineVersion", ...EVIL_TWIN_PAIR_KEYS] as const;
const EVIL_TWIN_INFORMATION_ENTRY_KEYS = ["counterpart", "kind", "recipientPlayerId"] as const;
const EVIL_TWIN_INFORMATION_DELIVERED_KEYS = [
  "characterStateRevision",
  "entries",
  "knowledgeModelVersion",
  "knowledgeStage",
  "nightNumber",
  "pairId",
  "rulesBaselineVersion",
  "taskId",
  "taskType"
] as const;

const fail = (reason: string): EvilTwinValidationResult => ({ valid: false, reason });

const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      return false;
    }
  }

  return true;
};

const playerReference = (entry: CurrentCharacterState): KnownPlayerReference => ({
  playerId: entry.playerId,
  seatNumber: entry.seatNumber
});

const sameKnownPlayerReference = (left: KnownPlayerReference, right: KnownPlayerReference): boolean =>
  left.playerId === right.playerId && left.seatNumber === right.seatNumber;

const rosterContainsReference = (roster: PlayerRoster, reference: KnownPlayerReference): boolean =>
  roster.some((entry) => entry.playerId === reference.playerId && entry.seatNumber === reference.seatNumber);

const expectedPairId = (input: {
  readonly taskId: ScheduledTaskId;
  readonly evilTwinPlayer: KnownPlayerReference;
  readonly goodTwinPlayer: KnownPlayerReference;
}): string =>
  `evil-twin-pair-v1:${input.taskId}:evil-seat-${String(input.evilTwinPlayer.seatNumber).padStart(2, "0")}:good-seat-${String(
    input.goodTwinPlayer.seatNumber
  ).padStart(2, "0")}`;

const creationFailure = (
  failureCode: EvilTwinPairCreationFailureCode,
  message: string
): Extract<EvilTwinPairCreationResult, { readonly status: "failure" }> => ({
  status: "failure",
  failureCode,
  message
});

const currentEntryForReference = (
  currentCharacterState: CurrentCharacterStateSet,
  reference: KnownPlayerReference
): CurrentCharacterState | undefined =>
  currentCharacterState.entries.find((entry) =>
    entry.playerId === reference.playerId &&
    entry.seatNumber === reference.seatNumber
  );

const legalGoodTwinCandidates = (
  currentCharacterState: CurrentCharacterStateSet,
  evilTwinPlayer: KnownPlayerReference
): readonly CurrentCharacterState[] =>
  currentCharacterState.entries
    .filter((entry) =>
      entry.currentAlignment === "GOOD" &&
      entry.playerId !== evilTwinPlayer.playerId &&
      entry.seatNumber !== evilTwinPlayer.seatNumber
    )
    .sort((left, right) => left.seatNumber - right.seatNumber);

const createPairFromEntries = (input: {
  readonly taskId: ScheduledTaskId;
  readonly evilTwinEntry: CurrentCharacterState;
  readonly goodTwinEntry: CurrentCharacterState;
  readonly characterStateRevision: number;
}): EvilTwinPair => {
  const evilTwinPlayer = playerReference(input.evilTwinEntry);
  const goodTwinPlayer = playerReference(input.goodTwinEntry);
  return {
    pairId: expectedPairId({
      taskId: input.taskId,
      evilTwinPlayer,
      goodTwinPlayer
    }),
    nightNumber: 1,
    taskId: input.taskId,
    taskType: "EVIL_TWIN_SETUP",
    evilTwinPlayer,
    goodTwinPlayer,
    evilTwinRole: cloneRoleSetupSnapshot(input.evilTwinEntry.role),
    goodTwinRole: cloneRoleSetupSnapshot(input.goodTwinEntry.role),
    evilTwinAlignment: "EVIL",
    goodTwinAlignment: "GOOD",
    characterStateRevision: input.characterStateRevision,
    pairingPolicyVersion: EVIL_TWIN_PAIRING_POLICY_VERSION
  };
};

export const cloneEvilTwinPair = (pair: EvilTwinPair): EvilTwinPair => ({
  pairId: pair.pairId,
  nightNumber: pair.nightNumber,
  taskId: pair.taskId,
  taskType: pair.taskType,
  evilTwinPlayer: cloneKnownPlayerReference(pair.evilTwinPlayer),
  goodTwinPlayer: cloneKnownPlayerReference(pair.goodTwinPlayer),
  evilTwinRole: cloneRoleSetupSnapshot(pair.evilTwinRole),
  goodTwinRole: cloneRoleSetupSnapshot(pair.goodTwinRole),
  evilTwinAlignment: pair.evilTwinAlignment,
  goodTwinAlignment: pair.goodTwinAlignment,
  characterStateRevision: pair.characterStateRevision,
  pairingPolicyVersion: pair.pairingPolicyVersion
});

export const cloneEvilTwinInformationEntry = (entry: EvilTwinInformationEntry): EvilTwinInformationEntry => ({
  recipientPlayerId: entry.recipientPlayerId,
  kind: entry.kind,
  counterpart: cloneKnownPlayerReference(entry.counterpart)
});

export const cloneEvilTwinInformationDeliveredPayload = (
  payload: EvilTwinInformationDeliveredPayload
): EvilTwinInformationDeliveredPayload => ({
  rulesBaselineVersion: payload.rulesBaselineVersion,
  nightNumber: payload.nightNumber,
  taskId: payload.taskId,
  taskType: payload.taskType,
  pairId: payload.pairId,
  knowledgeModelVersion: payload.knowledgeModelVersion,
  knowledgeStage: payload.knowledgeStage,
  characterStateRevision: payload.characterStateRevision,
  entries: payload.entries.map(cloneEvilTwinInformationEntry)
});

export const tryCreateEvilTwinPair = (input: {
  readonly taskId: ScheduledTaskId;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  readonly currentCharacterState: CurrentCharacterStateSet;
}): EvilTwinPairCreationResult => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return creationFailure("ScheduledTaskNotFound", `Scheduled task ${input.taskId} does not exist in the first-night task plan`);
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return creationFailure("ScheduledTaskAlreadySettled", `Scheduled task ${input.taskId} is already settled`);
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined) {
    return creationFailure("ScheduledTaskAlreadySettled", "All first-night tasks are already settled");
  }

  if (nextTask.taskId !== targetTask.taskId) {
    return creationFailure("ScheduledTaskNotNext", `Scheduled task ${targetTask.taskId} is not the next unsettled first-night task`);
  }

  if (
    targetTask.taskType !== "EVIL_TWIN_SETUP" ||
    targetTask.taskClass !== "ROLE_SETUP" ||
    targetTask.source.kind !== "ROLE" ||
    targetTask.source.role.roleId !== EVIL_TWIN_ROLE_ID
  ) {
    return creationFailure("UnsupportedRoleSetupTask", `SettleEvilTwinSetup cannot settle ${targetTask.taskType}`);
  }

  const source = targetTask.source;
  const evilTwinEntry = input.currentCharacterState.entries.find((entry) =>
    entry.playerId === source.playerId &&
    entry.seatNumber === source.seatNumber
  );
  if (
    evilTwinEntry === undefined ||
    evilTwinEntry.role.roleId !== EVIL_TWIN_ROLE_ID ||
    !sameRoleSetupSnapshot(evilTwinEntry.role, source.role) ||
    evilTwinEntry.currentAlignment !== "EVIL"
  ) {
    return creationFailure("ActionSourceNoLongerValid", "SettleEvilTwinSetup source is no longer a current Evil Twin with EVIL alignment");
  }

  const [goodTwinEntry] = legalGoodTwinCandidates(input.currentCharacterState, playerReference(evilTwinEntry));
  if (goodTwinEntry === undefined) {
    return creationFailure("NoLegalEvilTwinPair", "SettleEvilTwinSetup requires at least one current GOOD player");
  }

  return {
    status: "success",
    pair: createPairFromEntries({
      taskId: targetTask.taskId,
      evilTwinEntry,
      goodTwinEntry,
      characterStateRevision: input.currentCharacterState.revision
    })
  };
};

export const createEvilTwinPairEstablishedPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly taskId: ScheduledTaskId;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  readonly currentCharacterState: CurrentCharacterStateSet;
}): EvilTwinPairEstablishedPayload => {
  const result = tryCreateEvilTwinPair(input);
  if (result.status === "failure") {
    throw new DomainError("InvalidEvilTwinPairEstablishedPayload", result.message);
  }

  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    ...cloneEvilTwinPair(result.pair)
  };
};

export const expectedEvilTwinInformationEntries = (
  pair: EvilTwinPair
): readonly EvilTwinInformationEntry[] => [
  {
    recipientPlayerId: pair.evilTwinPlayer.playerId,
    kind: "EVIL_TWIN_PAIR",
    counterpart: cloneKnownPlayerReference(pair.goodTwinPlayer)
  },
  {
    recipientPlayerId: pair.goodTwinPlayer.playerId,
    kind: "EVIL_TWIN_PAIR",
    counterpart: cloneKnownPlayerReference(pair.evilTwinPlayer)
  }
];

export const createEvilTwinInformationDeliveredPayload = (input: {
  readonly rulesBaselineVersion: string;
  readonly pair: EvilTwinPair;
}): EvilTwinInformationDeliveredPayload => ({
  rulesBaselineVersion: input.rulesBaselineVersion,
  nightNumber: 1,
  taskId: input.pair.taskId,
  taskType: "EVIL_TWIN_SETUP",
  pairId: input.pair.pairId,
  knowledgeModelVersion: SUPPORTED_EVIL_TWIN_KNOWLEDGE_MODEL_VERSION,
  knowledgeStage: EVIL_TWIN_SETUP_KNOWLEDGE_STAGE,
  characterStateRevision: input.pair.characterStateRevision,
  entries: expectedEvilTwinInformationEntries(input.pair)
});

export const createEvilTwinPairEstablishedScheduledTaskSettlement = (input: {
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): ScheduledTaskSettlement => ({
  taskId: input.taskId,
  taskType: "EVIL_TWIN_SETUP",
  nightNumber: 1,
  settlementVersion: "scheduled-task-settlement-v1",
  outcomeType: "EVIL_TWIN_PAIR_ESTABLISHED",
  characterStateRevision: input.characterStateRevision
});

const validateEvilTwinPairShape = (value: unknown): { readonly valid: true; readonly pair: EvilTwinPair } | { readonly valid: false; readonly reason: string } => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, EVIL_TWIN_PAIR_KEYS)) {
    return { valid: false, reason: "EvilTwinPair must have exact runtime shape" };
  }

  if (
    typeof value.pairId !== "string" ||
    value.pairId.trim().length === 0 ||
    value.nightNumber !== 1 ||
    typeof value.taskId !== "string" ||
    value.taskId.trim().length === 0 ||
    value.taskType !== "EVIL_TWIN_SETUP" ||
    !hasExactKnownPlayerReferenceShape(value.evilTwinPlayer) ||
    !hasExactKnownPlayerReferenceShape(value.goodTwinPlayer) ||
    !hasExactRoleSetupSnapshotShape(value.evilTwinRole) ||
    !hasExactRoleSetupSnapshotShape(value.goodTwinRole) ||
    value.evilTwinAlignment !== "EVIL" ||
    value.goodTwinAlignment !== "GOOD" ||
    typeof value.characterStateRevision !== "number" ||
    !Number.isInteger(value.characterStateRevision) ||
    value.characterStateRevision <= 0 ||
    value.pairingPolicyVersion !== EVIL_TWIN_PAIRING_POLICY_VERSION
  ) {
    return { valid: false, reason: "EvilTwinPair fields must use supported exact values" };
  }

  const pair = value as unknown as EvilTwinPair;
  if (sameKnownPlayerReference(pair.evilTwinPlayer, pair.goodTwinPlayer)) {
    return { valid: false, reason: "EvilTwinPair players must be distinct" };
  }

  if (pair.evilTwinRole.roleId !== EVIL_TWIN_ROLE_ID) {
    return { valid: false, reason: "EvilTwinPair evilTwinRole must be evil_twin" };
  }

  if (pair.pairId !== expectedPairId(pair)) {
    return { valid: false, reason: "EvilTwinPair pairId must be deterministic from task and selected seats" };
  }

  return { valid: true, pair };
};

export const validateEvilTwinPairEstablishedPayloadAtSettlement = (
  payload: unknown,
  sourceFacts: {
    readonly firstNightTaskPlan: FirstNightTaskPlan;
    readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
    readonly currentCharacterState: CurrentCharacterStateSet;
    readonly roster: PlayerRoster;
  }
): EvilTwinValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, EVIL_TWIN_PAIR_ESTABLISHED_KEYS)) {
    return fail("EvilTwinPairEstablished payload must have exact runtime shape");
  }

  if (typeof payload.rulesBaselineVersion !== "string") {
    return fail("EvilTwinPairEstablished rulesBaselineVersion must be a string");
  }

  const pairValidation = validateEvilTwinPairShape({
    characterStateRevision: payload.characterStateRevision,
    evilTwinAlignment: payload.evilTwinAlignment,
    evilTwinPlayer: payload.evilTwinPlayer,
    evilTwinRole: payload.evilTwinRole,
    goodTwinAlignment: payload.goodTwinAlignment,
    goodTwinPlayer: payload.goodTwinPlayer,
    goodTwinRole: payload.goodTwinRole,
    nightNumber: payload.nightNumber,
    pairId: payload.pairId,
    pairingPolicyVersion: payload.pairingPolicyVersion,
    taskId: payload.taskId,
    taskType: payload.taskType
  });
  if (!pairValidation.valid) {
    return fail(pairValidation.reason);
  }

  const rosterValidation = validatePlayerRoster(sourceFacts.roster);
  if (!rosterValidation.valid) {
    return fail(rosterValidation.reason);
  }

  if (
    !rosterContainsReference(sourceFacts.roster, pairValidation.pair.evilTwinPlayer) ||
    !rosterContainsReference(sourceFacts.roster, pairValidation.pair.goodTwinPlayer)
  ) {
    return fail("EvilTwinPair references must exist in roster");
  }

  const currentValidation = validateCurrentCharacterStateSet({
    currentCharacterState: sourceFacts.currentCharacterState,
    roster: sourceFacts.roster
  });
  if (!currentValidation.valid) {
    return fail(currentValidation.reason);
  }

  const expected = tryCreateEvilTwinPair({
    taskId: pairValidation.pair.taskId,
    firstNightTaskPlan: sourceFacts.firstNightTaskPlan,
    firstNightTaskProgress: sourceFacts.firstNightTaskProgress,
    currentCharacterState: sourceFacts.currentCharacterState
  });
  if (expected.status === "failure") {
    return fail(expected.message);
  }

  if (!evilTwinPairsEqual(pairValidation.pair, expected.pair)) {
    return fail("EvilTwinPairEstablished payload must match deterministic current Evil Twin pairing");
  }

  return { valid: true };
};

const validatePlannedEvilTwinSetupTask = (input: {
  readonly taskId: ScheduledTaskId;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
}): EvilTwinValidationResult => {
  const plannedTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (plannedTask === undefined) {
    return fail("EvilTwinPair taskId must exist in first-night task plan");
  }

  if (
    plannedTask.taskType !== "EVIL_TWIN_SETUP" ||
    plannedTask.taskClass !== "ROLE_SETUP" ||
    plannedTask.source.kind !== "ROLE" ||
    plannedTask.source.role.roleId !== EVIL_TWIN_ROLE_ID
  ) {
    return fail("EvilTwinPair task must be the planned EVIL_TWIN_SETUP role setup task");
  }

  return { valid: true };
};

const validateMatchingSettlement = (input: {
  readonly settlement: ScheduledTaskSettlement | undefined;
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): EvilTwinValidationResult => {
  const settlement = input.settlement;
  if (settlement === undefined) {
    return fail("Evil Twin setup requires matching ScheduledTaskSettled");
  }

  if (
    settlement.taskId !== input.taskId ||
    settlement.taskType !== "EVIL_TWIN_SETUP" ||
    settlement.characterStateRevision !== input.characterStateRevision ||
    settlement.outcomeType !== "EVIL_TWIN_PAIR_ESTABLISHED"
  ) {
    return fail("ScheduledTaskSettled must match delivered Evil Twin pair information");
  }

  return { valid: true };
};

export const validateStoredEvilTwinPairEstablished = (
  payload: unknown,
  sourceFacts: {
    readonly firstNightTaskPlan: FirstNightTaskPlan;
    readonly settlement: ScheduledTaskSettlement | undefined;
  }
): EvilTwinValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, EVIL_TWIN_PAIR_ESTABLISHED_KEYS)) {
    return fail("Stored EvilTwinPairEstablished payload must have exact runtime shape");
  }

  const pairValidation = validateEvilTwinPairShape({
    characterStateRevision: payload.characterStateRevision,
    evilTwinAlignment: payload.evilTwinAlignment,
    evilTwinPlayer: payload.evilTwinPlayer,
    evilTwinRole: payload.evilTwinRole,
    goodTwinAlignment: payload.goodTwinAlignment,
    goodTwinPlayer: payload.goodTwinPlayer,
    goodTwinRole: payload.goodTwinRole,
    nightNumber: payload.nightNumber,
    pairId: payload.pairId,
    pairingPolicyVersion: payload.pairingPolicyVersion,
    taskId: payload.taskId,
    taskType: payload.taskType
  });
  if (!pairValidation.valid) {
    return fail(pairValidation.reason);
  }

  const taskValidation = validatePlannedEvilTwinSetupTask({
    taskId: pairValidation.pair.taskId,
    firstNightTaskPlan: sourceFacts.firstNightTaskPlan
  });
  if (!taskValidation.valid) {
    return taskValidation;
  }

  return validateMatchingSettlement({
    settlement: sourceFacts.settlement,
    taskId: pairValidation.pair.taskId,
    characterStateRevision: pairValidation.pair.characterStateRevision
  });
};

const parseEvilTwinInformationEntry = (
  entry: unknown
): { readonly valid: true; readonly entry: EvilTwinInformationEntry } | { readonly valid: false; readonly reason: string } => {
  if (!isPlainRecord(entry) || !hasExactEnumerableKeys(entry, EVIL_TWIN_INFORMATION_ENTRY_KEYS)) {
    return { valid: false, reason: "EvilTwinInformationEntry must have exact runtime shape" };
  }

  if (
    typeof entry.recipientPlayerId !== "string" ||
    entry.recipientPlayerId.trim().length === 0 ||
    entry.kind !== "EVIL_TWIN_PAIR" ||
    !hasExactKnownPlayerReferenceShape(entry.counterpart)
  ) {
    return { valid: false, reason: "EvilTwinInformationEntry fields must use supported exact values" };
  }

  return { valid: true, entry: entry as unknown as EvilTwinInformationEntry };
};

const validateEvilTwinInformationEntries = (
  entries: unknown,
  pair: EvilTwinPair
): { readonly valid: true; readonly entries: readonly EvilTwinInformationEntry[] } | { readonly valid: false; readonly reason: string } => {
  if (!Array.isArray(entries) || !isDenseArray(entries)) {
    return { valid: false, reason: "EvilTwinInformationDelivered entries must be a dense array" };
  }

  if (entries.length !== 2) {
    return { valid: false, reason: "EvilTwinInformationDelivered must contain exactly two entries" };
  }

  const parsed: EvilTwinInformationEntry[] = [];
  for (const entry of entries) {
    const result = parseEvilTwinInformationEntry(entry);
    if (!result.valid) {
      return result;
    }
    parsed.push(result.entry);
  }

  const expected = expectedEvilTwinInformationEntries(pair);
  if (!evilTwinInformationEntriesEqual(parsed, expected)) {
    return { valid: false, reason: "EvilTwinInformationDelivered entries must match the Evil Twin pair exactly" };
  }

  return { valid: true, entries: parsed };
};

const validateEvilTwinInformationPayloadShape = (
  payload: unknown,
  pair: EvilTwinPair
): { readonly valid: true; readonly payload: EvilTwinInformationDeliveredPayload } | { readonly valid: false; readonly reason: string } => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, EVIL_TWIN_INFORMATION_DELIVERED_KEYS)) {
    return { valid: false, reason: "EvilTwinInformationDelivered payload must have exact runtime shape" };
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    payload.taskId !== pair.taskId ||
    payload.taskType !== "EVIL_TWIN_SETUP" ||
    payload.pairId !== pair.pairId ||
    payload.knowledgeModelVersion !== SUPPORTED_EVIL_TWIN_KNOWLEDGE_MODEL_VERSION ||
    payload.knowledgeStage !== EVIL_TWIN_SETUP_KNOWLEDGE_STAGE ||
    payload.characterStateRevision !== pair.characterStateRevision
  ) {
    return { valid: false, reason: "EvilTwinInformationDelivered fields must match the established pair" };
  }

  const entries = validateEvilTwinInformationEntries(payload.entries, pair);
  if (!entries.valid) {
    return entries;
  }

  return { valid: true, payload: payload as unknown as EvilTwinInformationDeliveredPayload };
};

export const validateEvilTwinInformationDeliveredForState = (
  payload: unknown,
  sourceFacts: {
    readonly pairs: EvilTwinPairSet | undefined;
  }
): EvilTwinValidationResult => {
  const [pair] = sourceFacts.pairs?.pairs ?? [];
  if (pair === undefined) {
    return fail("EvilTwinInformationDelivered requires a preceding EvilTwinPairEstablished fact");
  }

  const validation = validateEvilTwinInformationPayloadShape(payload, pair);
  if (!validation.valid) {
    return fail(validation.reason);
  }

  return { valid: true };
};

export const validateStoredEvilTwinInformationDelivered = (
  payload: unknown,
  sourceFacts: {
    readonly pair: EvilTwinPair | undefined;
    readonly settlement: ScheduledTaskSettlement | undefined;
  }
): EvilTwinValidationResult => {
  if (sourceFacts.pair === undefined) {
    return fail("Stored EvilTwinInformationDelivered requires a stored EvilTwinPairEstablished fact");
  }

  const validation = validateEvilTwinInformationPayloadShape(payload, sourceFacts.pair);
  if (!validation.valid) {
    return fail(validation.reason);
  }

  return validateMatchingSettlement({
    settlement: sourceFacts.settlement,
    taskId: sourceFacts.pair.taskId,
    characterStateRevision: sourceFacts.pair.characterStateRevision
  });
};

export const appendEvilTwinPair = (
  set: EvilTwinPairSet | undefined,
  pair: EvilTwinPair
): EvilTwinPairSet => {
  const pairs = set?.pairs ?? [];
  if (pairs.some((candidate) => candidate.pairId === pair.pairId || candidate.taskId === pair.taskId)) {
    throw new DomainError("DuplicateEvilTwinPairEstablished", "EvilTwinPairEstablished cannot overwrite an existing pair");
  }

  if (pairs.length !== 0) {
    throw new DomainError("DuplicateEvilTwinPairEstablished", "This slice supports only one Evil Twin setup pair");
  }

  return { pairs: [...pairs.map(cloneEvilTwinPair), cloneEvilTwinPair(pair)] };
};

export const evilTwinPairsEqual = (left: EvilTwinPair, right: EvilTwinPair): boolean =>
  left.pairId === right.pairId &&
  left.nightNumber === right.nightNumber &&
  left.taskId === right.taskId &&
  left.taskType === right.taskType &&
  sameKnownPlayerReference(left.evilTwinPlayer, right.evilTwinPlayer) &&
  sameKnownPlayerReference(left.goodTwinPlayer, right.goodTwinPlayer) &&
  sameRoleSetupSnapshot(left.evilTwinRole, right.evilTwinRole) &&
  sameRoleSetupSnapshot(left.goodTwinRole, right.goodTwinRole) &&
  left.evilTwinAlignment === right.evilTwinAlignment &&
  left.goodTwinAlignment === right.goodTwinAlignment &&
  left.characterStateRevision === right.characterStateRevision &&
  left.pairingPolicyVersion === right.pairingPolicyVersion;

export const evilTwinInformationEntriesEqual = (
  left: readonly EvilTwinInformationEntry[],
  right: readonly EvilTwinInformationEntry[]
): boolean =>
  left.length === right.length &&
  left.every((entry, index) => {
    const other = right[index];
    return other !== undefined &&
      entry.recipientPlayerId === other.recipientPlayerId &&
      entry.kind === other.kind &&
      sameKnownPlayerReference(entry.counterpart, other.counterpart);
  });

export const hasEvilTwinPairForSettlement = (
  pairs: EvilTwinPairSet | undefined,
  settlement: ScheduledTaskSettlement
): boolean =>
  pairs?.pairs.some((pair) =>
    pair.taskId === settlement.taskId &&
    pair.taskType === settlement.taskType &&
    pair.characterStateRevision === settlement.characterStateRevision
  ) ?? false;

export const hasEvilTwinInformationForSettlement = (
  information: EvilTwinInformationDeliveredPayload | undefined,
  settlement: ScheduledTaskSettlement
): boolean =>
  information !== undefined &&
  information.taskId === settlement.taskId &&
  information.taskType === settlement.taskType &&
  information.characterStateRevision === settlement.characterStateRevision;

export const currentAlignmentIsSupported = (alignment: CurrentAlignment): alignment is "GOOD" | "EVIL" =>
  alignment === "GOOD" || alignment === "EVIL";

export const findEvilTwinCounterpartForViewer = (
  information: EvilTwinInformationDeliveredPayload | undefined,
  viewerPlayerId: PlayerId
): KnownPlayerReference | undefined =>
  information?.entries.find((entry) => entry.recipientPlayerId === viewerPlayerId)?.counterpart;

export const findCurrentEntryForEvilTwinReference = currentEntryForReference;
