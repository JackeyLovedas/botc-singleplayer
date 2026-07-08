import {
  DomainError,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  cloneRoleSetupSnapshot,
  cloneKnownPlayerReference,
  validateFirstNightInitializedPayloadShape,
  validateInitialOwnCharacterKnowledgePayload,
  validateMinionInformationDeliveredPayload,
  validateDemonInformationDeliveredPayload
} from "@botc/domain-core";
import type {
  GameState,
  FirstNightTaskProgress,
  InitialPrivateKnowledgeEstablishedPayload,
  InitialKnowledgeEntry,
  InitialOwnCharacterKnowledgeEntry,
  PlayerId,
  PlayerPrivateKnowledgeView,
  RoleSetupSnapshot
} from "@botc/domain-core";

type SupportedInitialPrivateKnowledgePayload = InitialPrivateKnowledgeEstablishedPayload & {
  readonly knowledgeModelVersion: typeof SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION;
};

const requireFirstNightInitialized = (state: GameState): void => {
  if (state.firstNight === undefined || state.setup === undefined || state.roster === undefined || state.assignment === undefined) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Initial private knowledge requires first night, setup, roster, and assignment facts");
  }

  const shapeValidation = validateFirstNightInitializedPayloadShape(state.firstNight);
  if (!shapeValidation.valid) {
    throw new DomainError("PrivateKnowledgeUnavailable", shapeValidation.reason);
  }

  if (
    state.firstNight.initializationVersion !== SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION ||
    state.firstNight.nightNumber !== 1 ||
    state.firstNight.rosterVersion !== state.roster.rosterVersion ||
    state.firstNight.assignmentAlgorithmVersion !== state.assignment.assignmentAlgorithmVersion ||
    state.firstNight.roleCatalogSignature !== state.setup.roleCatalogSignature ||
    state.firstNight.roleCatalogSignature !== state.assignment.roleCatalogSignature
  ) {
    throw new DomainError("PrivateKnowledgeUnavailable", "FirstNightInitialized metadata does not match current setup, roster, and assignment facts");
  }
};

const requireInitialPrivateKnowledge = (state: GameState): SupportedInitialPrivateKnowledgePayload => {
  if (
    state.firstNight === undefined ||
    state.setup === undefined ||
    state.roster === undefined ||
    state.assignment === undefined ||
    state.initialPrivateKnowledge === undefined
  ) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Initial private knowledge is not established for this game");
  }

  requireFirstNightInitialized(state);

  const validation = validateInitialOwnCharacterKnowledgePayload(state.initialPrivateKnowledge, {
    roster: state.roster.entries,
    assignment: state.assignment.assignments,
    setup: state.setup,
    rosterVersion: state.roster.rosterVersion,
    assignmentAlgorithmVersion: state.assignment.assignmentAlgorithmVersion,
    roleCatalogSignature: state.setup.roleCatalogSignature
  });
  if (!validation.valid) {
    throw new DomainError("PrivateKnowledgeUnavailable", validation.reason);
  }

  return state.initialPrivateKnowledge as SupportedInitialPrivateKnowledgePayload;
};

const findOwnCharacter = (entries: readonly InitialOwnCharacterKnowledgeEntry[]): RoleSetupSnapshot | undefined => {
  const entry = entries.find((candidate) => candidate.kind === "OWN_CHARACTER");
  return entry?.kind === "OWN_CHARACTER" ? entry.role : undefined;
};

const progressBeforeTask = (state: GameState, taskId: string): FirstNightTaskProgress | undefined => {
  if (state.firstNightTaskPlan === undefined || state.firstNightTaskProgress === undefined) {
    return undefined;
  }

  const taskIndex = state.firstNightTaskPlan.tasks.findIndex((task) => task.taskId === taskId);
  if (taskIndex < 0) {
    return undefined;
  }

  const priorTaskIds = new Set(state.firstNightTaskPlan.tasks.slice(0, taskIndex).map((task) => task.taskId));
  return {
    settlements: state.firstNightTaskProgress.settlements.filter((settlement) => priorTaskIds.has(settlement.taskId))
  };
};

const hasSettlement = (state: GameState, taskId: string, taskType: string): boolean =>
  state.firstNightTaskProgress?.settlements.some((settlement) => settlement.taskId === taskId && settlement.taskType === taskType) ?? false;

const requireDeliveredTeamInformationIsSettled = (state: GameState): readonly InitialKnowledgeEntry[] => {
  if (state.minionInformation === undefined && state.demonInformation === undefined && state.firstNightTaskProgress === undefined) {
    return [];
  }

  if (
    state.setup === undefined ||
    state.roster === undefined ||
    state.currentCharacterState === undefined ||
    state.firstNightTaskPlan === undefined
  ) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Team information projection requires setup, roster, task plan, and current character state");
  }

  const deliveredEntries: InitialKnowledgeEntry[] = [];
  if (state.minionInformation !== undefined) {
    const validation = validateMinionInformationDeliveredPayload(state.minionInformation, {
      currentCharacterState: state.currentCharacterState,
      roster: state.roster.entries,
      rosterVersion: state.roster.rosterVersion,
      setup: state.setup,
      firstNightTaskPlan: state.firstNightTaskPlan,
      firstNightTaskProgress: progressBeforeTask(state, state.minionInformation.taskId)
    });
    if (!validation.valid || !hasSettlement(state, state.minionInformation.taskId, state.minionInformation.taskType)) {
      throw new DomainError("PrivateKnowledgeUnavailable", validation.valid ? "Minion information is not settled" : validation.reason);
    }

    deliveredEntries.push(...state.minionInformation.entries);
  }

  if (state.demonInformation !== undefined) {
    const validation = validateDemonInformationDeliveredPayload(state.demonInformation, {
      currentCharacterState: state.currentCharacterState,
      roster: state.roster.entries,
      rosterVersion: state.roster.rosterVersion,
      setup: state.setup,
      firstNightTaskPlan: state.firstNightTaskPlan,
      firstNightTaskProgress: progressBeforeTask(state, state.demonInformation.taskId)
    });
    if (!validation.valid || !hasSettlement(state, state.demonInformation.taskId, state.demonInformation.taskType)) {
      throw new DomainError("PrivateKnowledgeUnavailable", validation.valid ? "Demon information is not settled" : validation.reason);
    }

    deliveredEntries.push(...state.demonInformation.entries);
  }

  for (const settlement of state.firstNightTaskProgress?.settlements ?? []) {
    if (settlement.taskType === "MINION_INFO" && state.minionInformation === undefined) {
      throw new DomainError("PrivateKnowledgeUnavailable", "MINION_INFO settlement exists without delivered information");
    }

    if (settlement.taskType === "DEMON_INFO" && state.demonInformation === undefined) {
      throw new DomainError("PrivateKnowledgeUnavailable", "DEMON_INFO settlement exists without delivered information");
    }
  }

  return deliveredEntries;
};

export const buildPlayerPrivateKnowledgeView = (
  state: GameState,
  viewerPlayerId: PlayerId
): PlayerPrivateKnowledgeView => {
  const privateKnowledge = requireInitialPrivateKnowledge(state);
  const rosterEntry = state.roster?.entries.find((entry) => entry.playerId === viewerPlayerId);
  if (rosterEntry === undefined) {
    throw new DomainError("UnknownPlayerPrivateKnowledgeViewer", "viewerPlayerId does not exist in the game roster");
  }

  const viewerEntries = privateKnowledge.entries.filter((entry) => entry.recipientPlayerId === viewerPlayerId);
  const ownCharacter = findOwnCharacter(viewerEntries);
  if (ownCharacter === undefined) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Viewer has no OWN_CHARACTER private knowledge entry");
  }

  const deliveredTeamEntries = requireDeliveredTeamInformationIsSettled(state).filter((entry) => entry.recipientPlayerId === viewerPlayerId);
  const knownDemon = deliveredTeamEntries.find((entry) => entry.kind === "DEMON_IDENTITY");
  const knownMinions = deliveredTeamEntries
    .filter((entry) => entry.kind === "MINION_IDENTITIES")
    .flatMap((entry) => entry.kind === "MINION_IDENTITIES" ? entry.minions.map(cloneKnownPlayerReference) : []);
  const demonBluffs = deliveredTeamEntries
    .filter((entry) => entry.kind === "DEMON_BLUFFS")
    .flatMap((entry) => entry.kind === "DEMON_BLUFFS" ? entry.roles.map(cloneRoleSetupSnapshot) : []);

  return {
    viewerPlayerId,
    viewerSeatNumber: rosterEntry.seatNumber,
    viewerDisplayName: rosterEntry.displayName,
    ownCharacter: cloneRoleSetupSnapshot(ownCharacter),
    ...(knownDemon?.kind === "DEMON_IDENTITY" ? { knownDemon: cloneKnownPlayerReference(knownDemon.demon) } : {}),
    knownMinions,
    demonBluffs,
    knowledgeModelVersion: privateKnowledge.knowledgeModelVersion
  };
};

export const buildAiPrivateKnowledgeView = (
  state: GameState,
  viewerPlayerId: PlayerId
): PlayerPrivateKnowledgeView => buildPlayerPrivateKnowledgeView(state, viewerPlayerId);
