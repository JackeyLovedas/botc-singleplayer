import {
  DomainError,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  MINION_INFORMATION_KNOWLEDGE_STAGE,
  DEMON_INFORMATION_KNOWLEDGE_STAGE,
  EVIL_TWIN_SETUP_KNOWLEDGE_STAGE,
  SUPPORTED_EVIL_TWIN_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  cloneRoleSetupSnapshot,
  cloneKnownPlayerReference,
  findEvilTwinCounterpartForViewer,
  validateFirstNightInitializedPayloadShape,
  validateInitialOwnCharacterKnowledgePayload,
  validatePlayerPrivateKnowledgeViewShape,
  validateStoredMinionInformationDelivered,
  validateStoredDemonInformationDelivered,
  validateStoredEvilTwinInformationDelivered,
  validateStoredEvilTwinPairEstablished
} from "@botc/domain-core";
import type {
  GameState,
  InitialPrivateKnowledgeEstablishedPayload,
  InitialKnowledgeEntry,
  InitialOwnCharacterKnowledgeEntry,
  PlayerId,
  PlayerPrivateKnowledgeStage,
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

const findSettlement = (state: GameState, taskId: string, taskType: string) =>
  state.firstNightTaskProgress?.settlements.find((settlement) => settlement.taskId === taskId && settlement.taskType === taskType);

const requireDeliveredTeamInformationIsSettled = (state: GameState): readonly InitialKnowledgeEntry[] => {
  if (state.minionInformation === undefined && state.demonInformation === undefined && state.firstNightTaskProgress === undefined) {
    return [];
  }

  if (
    state.setup === undefined ||
    state.roster === undefined ||
    state.firstNightTaskPlan === undefined
  ) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Team information projection requires setup, roster, and task plan facts");
  }

  const deliveredEntries: InitialKnowledgeEntry[] = [];
  if (state.minionInformation !== undefined) {
    const settlement = findSettlement(state, state.minionInformation.taskId, state.minionInformation.taskType);
    const validation = validateStoredMinionInformationDelivered(state.minionInformation, {
      roster: state.roster.entries,
      rosterVersion: state.roster.rosterVersion,
      setup: state.setup,
      firstNightTaskPlan: state.firstNightTaskPlan,
      settlement
    });
    if (!validation.valid) {
      throw new DomainError("PrivateKnowledgeUnavailable", validation.reason);
    }

    deliveredEntries.push(...state.minionInformation.entries);
  }

  if (state.demonInformation !== undefined) {
    const settlement = findSettlement(state, state.demonInformation.taskId, state.demonInformation.taskType);
    const validation = validateStoredDemonInformationDelivered(state.demonInformation, {
      roster: state.roster.entries,
      rosterVersion: state.roster.rosterVersion,
      setup: state.setup,
      firstNightTaskPlan: state.firstNightTaskPlan,
      settlement
    });
    if (!validation.valid) {
      throw new DomainError("PrivateKnowledgeUnavailable", validation.reason);
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

const requireDeliveredEvilTwinInformationIsSettled = (state: GameState): void => {
  if (state.evilTwinPairs === undefined && state.evilTwinInformation === undefined && state.firstNightTaskProgress === undefined) {
    return;
  }

  if (state.firstNightTaskPlan === undefined) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Evil Twin information projection requires task plan facts");
  }

  const pair = state.evilTwinPairs?.pairs[0];
  if (pair !== undefined) {
    const settlement = findSettlement(state, pair.taskId, pair.taskType);
    const pairValidation = validateStoredEvilTwinPairEstablished(pair, {
      firstNightTaskPlan: state.firstNightTaskPlan,
      settlement
    });
    if (!pairValidation.valid) {
      throw new DomainError("PrivateKnowledgeUnavailable", pairValidation.reason);
    }
  }

  if (state.evilTwinInformation !== undefined) {
    const settlement = findSettlement(state, state.evilTwinInformation.taskId, state.evilTwinInformation.taskType);
    const validation = validateStoredEvilTwinInformationDelivered(state.evilTwinInformation, {
      pair,
      settlement
    });
    if (!validation.valid) {
      throw new DomainError("PrivateKnowledgeUnavailable", validation.reason);
    }
  }

  for (const settlement of state.firstNightTaskProgress?.settlements ?? []) {
    if (settlement.taskType === "EVIL_TWIN_SETUP" && state.evilTwinInformation === undefined) {
      throw new DomainError("PrivateKnowledgeUnavailable", "EVIL_TWIN_SETUP settlement exists without delivered Evil Twin information");
    }
  }
};

const deliveredStagesForViewer = (
  state: GameState,
  viewerPlayerId: PlayerId
): readonly PlayerPrivateKnowledgeStage[] => {
  const stages: PlayerPrivateKnowledgeStage[] = [INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE];
  if (state.minionInformation?.entries.some((entry) => entry.recipientPlayerId === viewerPlayerId) === true) {
    stages.push(MINION_INFORMATION_KNOWLEDGE_STAGE);
  }

  if (state.demonInformation?.entries.some((entry) => entry.recipientPlayerId === viewerPlayerId) === true) {
    stages.push(DEMON_INFORMATION_KNOWLEDGE_STAGE);
  }

  if (state.evilTwinInformation?.entries.some((entry) => entry.recipientPlayerId === viewerPlayerId) === true) {
    stages.push(EVIL_TWIN_SETUP_KNOWLEDGE_STAGE);
  }

  return stages;
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
  requireDeliveredEvilTwinInformationIsSettled(state);
  const knownDemon = deliveredTeamEntries.find((entry) => entry.kind === "DEMON_IDENTITY");
  const knownMinions = deliveredTeamEntries
    .filter((entry) => entry.kind === "MINION_IDENTITIES")
    .flatMap((entry) => entry.kind === "MINION_IDENTITIES" ? entry.minions.map(cloneKnownPlayerReference) : []);
  const demonBluffs = deliveredTeamEntries
    .filter((entry) => entry.kind === "DEMON_BLUFFS")
    .flatMap((entry) => entry.kind === "DEMON_BLUFFS" ? entry.roles.map(cloneRoleSetupSnapshot) : []);
  const evilTwinCounterpart = findEvilTwinCounterpartForViewer(state.evilTwinInformation, viewerPlayerId);

  const deliveredKnowledgeStages = deliveredStagesForViewer(state, viewerPlayerId);
  const hasTeamKnowledge = deliveredKnowledgeStages.some((stage) =>
    stage === MINION_INFORMATION_KNOWLEDGE_STAGE ||
    stage === DEMON_INFORMATION_KNOWLEDGE_STAGE
  );
  const view = {
    viewerPlayerId,
    viewerSeatNumber: rosterEntry.seatNumber,
    viewerDisplayName: rosterEntry.displayName,
    ownCharacter: cloneRoleSetupSnapshot(ownCharacter),
    ...(knownDemon?.kind === "DEMON_IDENTITY" ? { knownDemon: cloneKnownPlayerReference(knownDemon.demon) } : {}),
    knownMinions,
    demonBluffs,
    ...(evilTwinCounterpart === undefined
      ? {}
      : {
          evilTwinCounterpart: cloneKnownPlayerReference(evilTwinCounterpart),
          evilTwinKnowledgeModelVersion: SUPPORTED_EVIL_TWIN_KNOWLEDGE_MODEL_VERSION
        }),
    ownCharacterKnowledgeModelVersion: privateKnowledge.knowledgeModelVersion,
    ...(hasTeamKnowledge
      ? { teamKnowledgeModelVersion: SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION }
      : {}),
    deliveredKnowledgeStages
  };
  const validation = validatePlayerPrivateKnowledgeViewShape(view);
  if (!validation.valid) {
    throw new DomainError("PrivateKnowledgeUnavailable", validation.reason);
  }

  return view;
};

export const buildAiPrivateKnowledgeView = (
  state: GameState,
  viewerPlayerId: PlayerId
): PlayerPrivateKnowledgeView => buildPlayerPrivateKnowledgeView(state, viewerPlayerId);
