import {
  DomainError,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  cloneRoleSetupSnapshot,
  validateFirstNightInitializedPayloadShape,
  validateInitialOwnCharacterKnowledgePayload
} from "@botc/domain-core";
import type {
  GameState,
  InitialPrivateKnowledgeEstablishedPayload,
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

  return {
    viewerPlayerId,
    viewerSeatNumber: rosterEntry.seatNumber,
    viewerDisplayName: rosterEntry.displayName,
    ownCharacter: cloneRoleSetupSnapshot(ownCharacter),
    knownMinions: [],
    demonBluffs: [],
    knowledgeModelVersion: privateKnowledge.knowledgeModelVersion
  };
};

export const buildAiPrivateKnowledgeView = (
  state: GameState,
  viewerPlayerId: PlayerId
): PlayerPrivateKnowledgeView => buildPlayerPrivateKnowledgeView(state, viewerPlayerId);
