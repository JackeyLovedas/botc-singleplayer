import {
  DomainError,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  cloneKnownPlayerReference,
  cloneRoleSetupSnapshot,
  validateInitialPrivateKnowledgePayload
} from "@botc/domain-core";
import type {
  GameState,
  InitialKnowledgeEntry,
  InitialPrivateKnowledgeEstablishedPayload,
  KnownPlayerReference,
  PlayerId,
  PlayerPrivateKnowledgeView,
  RoleSetupSnapshot
} from "@botc/domain-core";

type SupportedInitialPrivateKnowledgePayload = InitialPrivateKnowledgeEstablishedPayload & {
  readonly knowledgeModelVersion: typeof SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION;
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

  const validation = validateInitialPrivateKnowledgePayload(state.initialPrivateKnowledge, {
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

const findOwnCharacter = (entries: readonly InitialKnowledgeEntry[]): RoleSetupSnapshot | undefined => {
  const entry = entries.find((candidate) => candidate.kind === "OWN_CHARACTER");
  return entry?.kind === "OWN_CHARACTER" ? entry.role : undefined;
};

const findKnownDemon = (entries: readonly InitialKnowledgeEntry[]): KnownPlayerReference | undefined => {
  const entry = entries.find((candidate) => candidate.kind === "DEMON_IDENTITY");
  return entry?.kind === "DEMON_IDENTITY" ? entry.demon : undefined;
};

const findKnownMinions = (entries: readonly InitialKnowledgeEntry[]): readonly KnownPlayerReference[] => {
  const entry = entries.find((candidate) => candidate.kind === "MINION_IDENTITIES");
  return entry?.kind === "MINION_IDENTITIES" ? entry.minions : [];
};

const findDemonBluffs = (entries: readonly InitialKnowledgeEntry[]): readonly RoleSetupSnapshot[] => {
  const entry = entries.find((candidate) => candidate.kind === "DEMON_BLUFFS");
  return entry?.kind === "DEMON_BLUFFS" ? entry.roles : [];
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

  const knownDemon = findKnownDemon(viewerEntries);
  const viewBase = {
    viewerPlayerId,
    viewerSeatNumber: rosterEntry.seatNumber,
    viewerDisplayName: rosterEntry.displayName,
    ownCharacter: cloneRoleSetupSnapshot(ownCharacter),
    knownMinions: findKnownMinions(viewerEntries).map(cloneKnownPlayerReference),
    demonBluffs: findDemonBluffs(viewerEntries).map(cloneRoleSetupSnapshot),
    knowledgeModelVersion: privateKnowledge.knowledgeModelVersion
  };

  if (knownDemon === undefined) {
    return viewBase;
  }

  return {
    ...viewBase,
    knownDemon: cloneKnownPlayerReference(knownDemon)
  };
};

export const buildAiPrivateKnowledgeView = (
  state: GameState,
  viewerPlayerId: PlayerId
): PlayerPrivateKnowledgeView => buildPlayerPrivateKnowledgeView(state, viewerPlayerId);
