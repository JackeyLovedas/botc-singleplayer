import {
  DomainError,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  MINION_INFORMATION_KNOWLEDGE_STAGE,
  DEMON_INFORMATION_KNOWLEDGE_STAGE,
  DREAMER_INFORMATION_STAGE,
  SEAMSTRESS_INFORMATION_STAGE,
  PRIVATE_VIEW_SEAMSTRESS_MODEL_VERSION,
  EVIL_TWIN_SETUP_KNOWLEDGE_STAGE,
  SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION,
  SUPPORTED_EVIL_TWIN_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  cloneRoleSetupSnapshot,
  cloneKnownPlayerReference,
  findEvilTwinCounterpartForViewer,
  isPlainRecord,
  validateFirstNightInitializedPayloadShape,
  validateInitialOwnCharacterKnowledgePayload,
  validatePlayerPrivateKnowledgeViewShape,
  validateStoredMinionInformationDelivered,
  validateStoredDemonInformationDelivered,
  validateStoredDreamerInformationDelivered,
  validateStoredEvilTwinInformationDelivered,
  validateStoredEvilTwinPairEstablished,
  validateStoredSeamstressInformationDelivered,
  isSeamstressActionOpportunityV2,
  sameRoleSetupSnapshot,
  validateSeamstressActionOpportunityV2Shape
} from "@botc/domain-core";
import type {
  GameState,
  InitialPrivateKnowledgeEstablishedPayload,
  InitialKnowledgeEntry,
  InitialOwnCharacterKnowledgeEntry,
  PlayerId,
  PlayerPrivateKnowledgeStage,
  PlayerPrivateKnowledgeView,
  RoleSetupSnapshot,
  ScheduledTaskSettlement,
  SeamstressInformationDeliveredPayload
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

const storedDreamerDeliveries = (state: GameState): readonly unknown[] => {
  const information: unknown = state.dreamerInformation;
  if (information === undefined) {
    return [];
  }
  if (!isPlainRecord(information) || !Array.isArray(information.deliveries)) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Stored Dreamer information set must contain a deliveries array");
  }

  return information.deliveries;
};

const storedFirstNightSettlements = (state: GameState): readonly unknown[] => {
  const progress: unknown = state.firstNightTaskProgress;
  if (progress === undefined) {
    return [];
  }
  if (!isPlainRecord(progress) || !Array.isArray(progress.settlements)) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Stored first-night task progress must contain a settlements array");
  }

  return progress.settlements;
};

const matchingStoredDreamerSettlement = (
  settlements: readonly unknown[],
  delivery: unknown
): ScheduledTaskSettlement | undefined => {
  if (
    !isPlainRecord(delivery) ||
    typeof delivery.taskId !== "string" ||
    typeof delivery.taskType !== "string"
  ) {
    return undefined;
  }

  const matchingSettlements = settlements.filter((settlement) =>
    isPlainRecord(settlement) &&
    settlement.taskId === delivery.taskId &&
    settlement.taskType === delivery.taskType
  );
  return matchingSettlements.length === 1
    ? matchingSettlements[0] as ScheduledTaskSettlement
    : undefined;
};

const requireDeliveredDreamerInformationIsSettled = (state: GameState): void => {
  if (state.dreamerInformation === undefined && state.firstNightTaskProgress === undefined) {
    return;
  }

  if (state.setup === undefined || state.roster === undefined || state.firstNightTaskPlan === undefined) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Dreamer information projection requires setup, roster, and task plan facts");
  }

  const deliveries = storedDreamerDeliveries(state);
  const settlements = storedFirstNightSettlements(state);
  for (const delivery of deliveries) {
    const settlement = matchingStoredDreamerSettlement(settlements, delivery);
    const validation = validateStoredDreamerInformationDelivered(delivery, {
      rulesBaselineVersion: state.rulesBaselineVersion,
      setup: state.setup,
      roster: state.roster.entries,
      firstNightTaskPlan: state.firstNightTaskPlan,
      choices: state.dreamerTargetChoices,
      settlement
    });
    if (!validation.valid) {
      throw new DomainError("PrivateKnowledgeUnavailable", validation.reason);
    }
  }

  for (const settlement of settlements) {
    if (!isPlainRecord(settlement)) {
      throw new DomainError("PrivateKnowledgeUnavailable", "Stored ScheduledTaskSettled fact must be a plain object");
    }
    if (
      settlement.taskType === "DREAMER_ACTION" &&
      deliveries.some((delivery) =>
        isPlainRecord(delivery) &&
        delivery.taskId === settlement.taskId &&
        delivery.sourceCharacterStateRevision === settlement.characterStateRevision
      ) !== true
    ) {
      throw new DomainError("PrivateKnowledgeUnavailable", "DREAMER_ACTION settlement exists without delivered Dreamer information");
    }
  }
};

const storedSeamstressDeliveries = (state: GameState): readonly unknown[] => {
  const information: unknown = state.seamstressInformation;
  if (information === undefined) return [];
  if (!isPlainRecord(information) || !Array.isArray(information.deliveries)) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Stored Seamstress information set must contain a deliveries array");
  }
  return information.deliveries;
};

const requireDeliveredSeamstressInformationIsSettled = (state: GameState): void => {
  if (state.seamstressInformation === undefined && state.firstNightTaskProgress === undefined) return;
  const deliveries = storedSeamstressDeliveries(state);
  const settlements = storedFirstNightSettlements(state);
  const seenOpportunityIds = new Set<string>();
  const seenTaskIds = new Set<string>();
  const seenAbilityUseEntitlementIds = new Set<string>();
  for (const delivery of deliveries) {
    if (!isPlainRecord(delivery) || typeof delivery.opportunityId !== "string" || typeof delivery.taskId !== "string" ||
        typeof delivery.abilityUseEntitlementId !== "string") {
      throw new DomainError("PrivateKnowledgeUnavailable", "Stored Seamstress delivery must expose its historical chain keys");
    }
    if (seenOpportunityIds.has(delivery.opportunityId) || seenTaskIds.has(delivery.taskId) ||
        seenAbilityUseEntitlementIds.has(delivery.abilityUseEntitlementId)) {
      throw new DomainError(
        "PrivateKnowledgeUnavailable",
        "Stored Seamstress deliveries must use unique opportunity, settlement, and ability-spend chains"
      );
    }
    seenOpportunityIds.add(delivery.opportunityId);
    seenTaskIds.add(delivery.taskId);
    seenAbilityUseEntitlementIds.add(delivery.abilityUseEntitlementId);
    const validation = validateStoredSeamstressInformationDelivered({
      rulesBaselineVersion: state.rulesBaselineVersion,
      delivery,
      choices: state.seamstressTargetChoices,
      spends: state.seamstressAbilitySpends,
      settlements
    });
    if (!validation.valid) throw new DomainError("PrivateKnowledgeUnavailable", validation.reason);
    const validatedDelivery = delivery as unknown as SeamstressInformationDeliveredPayload;
    const matchingOpportunities = state.firstNightActionOpportunities?.opportunities.filter((opportunity) =>
      opportunity.opportunityId === validatedDelivery.opportunityId
    ) ?? [];
    const opportunity = matchingOpportunities[0];
    const opportunityShape = validateSeamstressActionOpportunityV2Shape(opportunity);
    if (matchingOpportunities.length !== 1 || opportunity === undefined || !opportunityShape.valid ||
        !isSeamstressActionOpportunityV2(opportunity) || opportunity.opportunityStatus !== "CLOSED" ||
        opportunity.taskId !== validatedDelivery.taskId || opportunity.taskType !== validatedDelivery.taskType ||
        opportunity.sourcePlayerId !== validatedDelivery.sourcePlayerId || opportunity.sourceSeatNumber !== validatedDelivery.sourceSeatNumber ||
        !sameRoleSetupSnapshot(opportunity.sourceRole, validatedDelivery.sourceRole) ||
        opportunity.sourceRoleTenureId !== validatedDelivery.sourceRoleTenureId ||
        opportunity.abilityInstanceId !== validatedDelivery.abilityInstanceId ||
        opportunity.abilityUseEntitlementId !== validatedDelivery.abilityUseEntitlementId ||
        opportunity.sourceCharacterStateRevision !== validatedDelivery.opportunityCharacterStateRevision) {
      throw new DomainError("PrivateKnowledgeUnavailable", "Stored Seamstress delivery requires one exact historical V2 opportunity");
    }
  }
  for (const settlement of settlements) {
    if (!isPlainRecord(settlement)) {
      throw new DomainError("PrivateKnowledgeUnavailable", "Stored ScheduledTaskSettled fact must be a plain object");
    }
    if (settlement.outcomeType === "SEAMSTRESS_INFORMATION_DELIVERED" && !deliveries.some((delivery) =>
      isPlainRecord(delivery) && delivery.taskId === settlement.taskId &&
      delivery.settlementCharacterStateRevision === settlement.characterStateRevision
    )) {
      throw new DomainError("PrivateKnowledgeUnavailable", "Seamstress information settlement exists without one historical delivery");
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

  if (state.dreamerInformation?.deliveries.some((delivery) => delivery.sourcePlayerId === viewerPlayerId) === true) {
    stages.push(DREAMER_INFORMATION_STAGE);
  }

  if (state.seamstressInformation?.deliveries.some((delivery) => delivery.sourcePlayerId === viewerPlayerId) === true) {
    stages.push(SEAMSTRESS_INFORMATION_STAGE);
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
  requireDeliveredDreamerInformationIsSettled(state);
  requireDeliveredSeamstressInformationIsSettled(state);
  const knownDemon = deliveredTeamEntries.find((entry) => entry.kind === "DEMON_IDENTITY");
  const knownMinions = deliveredTeamEntries
    .filter((entry) => entry.kind === "MINION_IDENTITIES")
    .flatMap((entry) => entry.kind === "MINION_IDENTITIES" ? entry.minions.map(cloneKnownPlayerReference) : []);
  const demonBluffs = deliveredTeamEntries
    .filter((entry) => entry.kind === "DEMON_BLUFFS")
    .flatMap((entry) => entry.kind === "DEMON_BLUFFS" ? entry.roles.map(cloneRoleSetupSnapshot) : []);
  const evilTwinCounterpart = findEvilTwinCounterpartForViewer(state.evilTwinInformation, viewerPlayerId);
  const dreamerDelivery = state.dreamerInformation?.deliveries.find((delivery) => delivery.sourcePlayerId === viewerPlayerId);
  const seamstressDeliveries = state.seamstressInformation?.deliveries.filter((delivery) =>
    delivery.sourcePlayerId === viewerPlayerId
  ) ?? [];

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
    ...(dreamerDelivery === undefined
      ? {}
      : {
          dreamerInformation: {
            target: cloneKnownPlayerReference({
              playerId: dreamerDelivery.targetPlayerId,
              seatNumber: dreamerDelivery.targetSeatNumber
            }),
            goodRole: cloneRoleSetupSnapshot(dreamerDelivery.goodRole),
            evilRole: cloneRoleSetupSnapshot(dreamerDelivery.evilRole)
          },
          dreamerKnowledgeModelVersion: SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION
        }),
    ...(seamstressDeliveries.length === 0
      ? {}
      : {
          seamstressInformation: seamstressDeliveries.map((delivery) => ({
            targets: [
              cloneKnownPlayerReference({ playerId: delivery.targetPlayerIds[0], seatNumber: delivery.targetSeatNumbers[0] }),
              cloneKnownPlayerReference({ playerId: delivery.targetPlayerIds[1], seatNumber: delivery.targetSeatNumbers[1] })
            ] as const,
            deliveredAnswer: delivery.deliveredAnswer
          })),
          seamstressKnowledgeModelVersion: PRIVATE_VIEW_SEAMSTRESS_MODEL_VERSION
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
