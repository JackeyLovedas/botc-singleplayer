import {
  DomainError,
  SUPPORTED_FIRST_NIGHT_INITIALIZATION_VERSION,
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  MINION_INFORMATION_KNOWLEDGE_STAGE,
  DEMON_INFORMATION_KNOWLEDGE_STAGE,
  DREAMER_INFORMATION_STAGE,
  DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION,
  DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION,
  CERENOVUS_INFORMATION_STAGE,
  CERENOVUS_MADNESS_INSTRUCTION_MODEL_VERSION,
  CLOCKMAKER_INFORMATION_MODEL_VERSION,
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
  validateStoredClockmakerInformationDelivered,
  isCanonicalDataValue,
  isDenseCanonicalArray,
  validateCerenovusActionOpportunityShape,
  validateCerenovusChoiceAgainstState,
  validateCerenovusChoiceRecordedPayloadShape,
  validateCerenovusInstructionAgainstChain,
  validateCerenovusMadnessInstructionDeliveredPayloadShape,
  validateCerenovusMarkerAgainstChoice,
  validateCerenovusMadnessMarkedPayloadShape,
  validateScheduledTaskSettlementShape,
  isSeamstressActionOpportunityV2,
  sameRoleSetupSnapshot,
  validateSeamstressActionOpportunityV2Shape
  ,MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION
  ,MATHEMATICIAN_INFORMATION_STAGE
  ,validateMathematicianInformationDeliveredPayloadShape
  ,formatFirstNightAbilityOutcomeFactId
} from "@botc/domain-core";
import { replayTrustedMathematicianProjectionStream } from "../../domain-core/src/mathematician-internal.js";
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
  CerenovusChoiceRecordedPayload,
  CerenovusMadnessInstructionDeliveredPayload,
  CerenovusMadnessMarkedPayload,
  SeamstressInformationDeliveredPayload,
  ClockmakerInformationDeliveredPayload
  ,MathematicianInformationDeliveredPayload
  ,AnyDomainEventEnvelope
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
    const pairValidation = validateStoredEvilTwinPairEstablished({ rulesBaselineVersion: state.rulesBaselineVersion, ...pair }, {
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
  if (!isCanonicalDataValue(progress) || !isPlainRecord(progress) || !Array.isArray(progress.settlements)) {
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

const requireDeliveredCerenovusMadnessInstructionsAreSettled = (
  state: GameState
): readonly CerenovusMadnessInstructionDeliveredPayload[] => {
  const cerenovusSettlements = storedFirstNightSettlements(state).filter((settlement) =>
    isPlainRecord(settlement) && settlement.taskType === "CERENOVUS_ACTION"
  );
  if (state.cerenovusChoices === undefined && state.cerenovusMadnessMarkers === undefined &&
      state.cerenovusMadnessInstructions === undefined && cerenovusSettlements.length === 0) return [];
  if (state.setup === undefined || state.roster === undefined || state.firstNightTaskPlan === undefined || state.seamstressRoleTenureState === undefined ||
      state.firstNightActionOpportunities === undefined || !isPlainRecord(state.cerenovusChoices) ||
      !Array.isArray(state.cerenovusChoices.choices) || !isPlainRecord(state.cerenovusMadnessMarkers) ||
      !Array.isArray(state.cerenovusMadnessMarkers.markers) || !isPlainRecord(state.cerenovusMadnessInstructions) ||
      !Array.isArray(state.cerenovusMadnessInstructions.deliveries)) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Cerenovus projection requires complete stored chain collections and canonical setup state");
  }
  const choices: readonly unknown[] = state.cerenovusChoices.choices;
  const markers: readonly unknown[] = state.cerenovusMadnessMarkers.markers;
  const instructions: readonly unknown[] = state.cerenovusMadnessInstructions.deliveries;
  const unique = (values: readonly unknown[]): boolean => values.every((value, index) =>
    typeof value === "string" && value.length > 0 && values.indexOf(value) === index
  );
  const choiceIds = choices.map((entry) => isPlainRecord(entry) ? entry.choiceId : undefined);
  const choiceOpportunityIds = choices.map((entry) => isPlainRecord(entry) ? entry.opportunityId : undefined);
  const choiceTaskIds = choices.map((entry) => isPlainRecord(entry) ? entry.taskId : undefined);
  const markerIds = markers.map((entry) => isPlainRecord(entry) ? entry.markerId : undefined);
  const markerChoiceIds = markers.map((entry) => isPlainRecord(entry) ? entry.choiceId : undefined);
  const deliveryIds = instructions.map((entry) => isPlainRecord(entry) ? entry.deliveryId : undefined);
  const deliveryChoiceIds = instructions.map((entry) => isPlainRecord(entry) ? entry.choiceId : undefined);
  const settlementTaskIds = cerenovusSettlements.map((entry) => isPlainRecord(entry) ? entry.taskId : undefined);
  if (![choiceIds, choiceOpportunityIds, choiceTaskIds, markerIds, markerChoiceIds, deliveryIds, deliveryChoiceIds, settlementTaskIds].every(unique) ||
      choices.length !== markers.length || choices.length !== instructions.length || choices.length !== cerenovusSettlements.length) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Cerenovus stored facts must form globally unique one-to-one chains");
  }

  const validatedInstructions: CerenovusMadnessInstructionDeliveredPayload[] = [];
  for (const rawChoice of choices) {
    const choiceShape = validateCerenovusChoiceRecordedPayloadShape(rawChoice);
    if (!choiceShape.valid) throw new DomainError("PrivateKnowledgeUnavailable", choiceShape.reason);
    const choice = rawChoice as CerenovusChoiceRecordedPayload;
    const matchingOpportunities = state.firstNightActionOpportunities.opportunities.filter((entry) => entry.opportunityId === choice.opportunityId);
    const opportunity = matchingOpportunities[0];
    const opportunityShape = validateCerenovusActionOpportunityShape(opportunity);
    const task = state.firstNightTaskPlan.tasks.filter((entry) => entry.taskId === choice.taskId);
    if (matchingOpportunities.length !== 1 || opportunity === undefined || !opportunityShape.valid ||
        opportunity.opportunityKind !== "CERENOVUS_FIRST_NIGHT_ACTION" || opportunity.opportunityStatus !== "CLOSED" ||
        task.length !== 1 || task[0]?.taskType !== "CERENOVUS_ACTION" || task[0].source.kind !== "ROLE" ||
        task[0].source.playerId !== choice.sourcePlayerId || task[0].source.seatNumber !== choice.sourceSeatNumber ||
        !sameRoleSetupSnapshot(task[0].source.role, choice.sourceRole)) {
      throw new DomainError("PrivateKnowledgeUnavailable", "Cerenovus choice requires one exact closed opportunity and base task source");
    }
    const choiceStateValidation = validateCerenovusChoiceAgainstState({
      choice,
      opportunity,
      roster: state.roster.entries,
      setup: state.setup,
      roleTenures: state.seamstressRoleTenureState
    });
    if (!choiceStateValidation.valid) throw new DomainError("PrivateKnowledgeUnavailable", choiceStateValidation.reason);
    const matchingMarkers = markers.filter((entry) => isPlainRecord(entry) && entry.choiceId === choice.choiceId);
    const matchingInstructions = instructions.filter((entry) => isPlainRecord(entry) && entry.choiceId === choice.choiceId);
    const matchingSettlements = cerenovusSettlements.filter((entry) => isPlainRecord(entry) && entry.taskId === choice.taskId);
    if (matchingMarkers.length !== 1 || matchingInstructions.length !== 1 || matchingSettlements.length !== 1) {
      throw new DomainError("PrivateKnowledgeUnavailable", "Cerenovus choice requires one marker, instruction, and settlement");
    }
    const markerShape = validateCerenovusMadnessMarkedPayloadShape(matchingMarkers[0]);
    const instructionShape = validateCerenovusMadnessInstructionDeliveredPayloadShape(matchingInstructions[0]);
    const settlementShape = validateScheduledTaskSettlementShape(matchingSettlements[0]);
    if (!markerShape.valid) throw new DomainError("PrivateKnowledgeUnavailable", markerShape.reason);
    if (!instructionShape.valid) throw new DomainError("PrivateKnowledgeUnavailable", instructionShape.reason);
    if (!settlementShape.valid) throw new DomainError("PrivateKnowledgeUnavailable", settlementShape.reason);
    const marker = matchingMarkers[0] as CerenovusMadnessMarkedPayload;
    const instruction = matchingInstructions[0] as CerenovusMadnessInstructionDeliveredPayload;
    const settlement = matchingSettlements[0] as ScheduledTaskSettlement;
    const markerLink = validateCerenovusMarkerAgainstChoice(choice, marker);
    const instructionLink = validateCerenovusInstructionAgainstChain(choice, marker, instruction);
    if (!markerLink.valid || !instructionLink.valid || settlement.taskType !== "CERENOVUS_ACTION" ||
        settlement.outcomeType !== "CERENOVUS_MADNESS_MARKED" || settlement.characterStateRevision !== choice.settlementCharacterStateRevision) {
      throw new DomainError("PrivateKnowledgeUnavailable", !markerLink.valid ? markerLink.reason : !instructionLink.valid ? instructionLink.reason : "Cerenovus settlement does not match its complete chain");
    }
    validatedInstructions.push(instruction);
  }
  return validatedInstructions;
};

const requireDeliveredClockmakerInformationIsSettled = (
  state: GameState
): readonly ClockmakerInformationDeliveredPayload[] => {
  const settlements = storedFirstNightSettlements(state);
  if (!isDenseCanonicalArray(settlements)) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Clockmaker projection requires one strict dense settlement collection");
  }
  const clockmakerSettlements = settlements.filter((entry) => isPlainRecord(entry) && entry.outcomeType === "CLOCKMAKER_INFORMATION_DELIVERED");
  const information: unknown = state.clockmakerInformation;
  if (information === undefined && clockmakerSettlements.length === 0) return [];
  if (!isCanonicalDataValue(information) || !isPlainRecord(information) || Object.keys(information).length !== 1 || !Object.hasOwn(information, "deliveries") ||
      !isDenseCanonicalArray(information.deliveries) || state.firstNightTaskPlan === undefined ||
      state.roster === undefined || state.setup === undefined || state.seamstressRoleTenureState === undefined) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Clockmaker projection requires one dense delivery collection and complete historical source facts");
  }
  const deliveries: readonly unknown[] = information.deliveries;
  const deliveryIds = deliveries.map((entry) => isPlainRecord(entry) ? entry.deliveryId : undefined);
  const taskIds = deliveries.map((entry) => isPlainRecord(entry) ? entry.taskId : undefined);
  if (deliveries.length !== clockmakerSettlements.length || deliveryIds.some((id, index) => typeof id !== "string" || deliveryIds.indexOf(id) !== index) ||
      taskIds.some((id, index) => typeof id !== "string" || taskIds.indexOf(id) !== index)) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Clockmaker deliveries and settlements must form unique one-to-one chains");
  }
  const validated: ClockmakerInformationDeliveredPayload[] = [];
  for (const delivery of deliveries) {
    const validation = validateStoredClockmakerInformationDelivered({ rulesBaselineVersion: state.rulesBaselineVersion, delivery,
      firstNightTaskPlan: state.firstNightTaskPlan, roster: state.roster.entries, setup: state.setup,
      ...(state.philosopherAbilityChoices === undefined ? {} : { choices: state.philosopherAbilityChoices }),
      ...(state.philosopherGrantedAbilities === undefined ? {} : { grants: state.philosopherGrantedAbilities }),
      ...(state.firstNightTaskInsertions === undefined ? {} : { insertions: state.firstNightTaskInsertions }),
      ...(state.abilityImpairments === undefined ? {} : { impairments: state.abilityImpairments }),
      roleTenures: state.seamstressRoleTenureState, settlements });
    if (!validation.valid) throw new DomainError("PrivateKnowledgeUnavailable", validation.reason);
    validated.push(delivery as ClockmakerInformationDeliveredPayload);
  }
  return validated;
};

const requireDeliveredMathematicianInformationIsSettled = (
  state: GameState
): readonly MathematicianInformationDeliveredPayload[] => {
  const settlements = storedFirstNightSettlements(state).filter((entry) =>
    isPlainRecord(entry) && entry.outcomeType === "MATHEMATICIAN_INFORMATION_DELIVERED"
  );
  const information = state.mathematicianInformation;
  if (information === undefined && settlements.length === 0) return [];
  if (information === undefined || !isDenseCanonicalArray(information.deliveries) ||
      state.firstNightAbilityOutcomeLedger === undefined) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Mathematician projection requires delivery, settlement, and outcome ledger state");
  }
  if (information.deliveries.length !== settlements.length) {
    throw new DomainError("PrivateKnowledgeUnavailable", "Mathematician deliveries and settlements must form one-to-one chains");
  }
  const ids = new Set<string>(); const tasks = new Set<string>(); const instances = new Set<string>();
  for (const delivery of information.deliveries) {
    const shape = validateMathematicianInformationDeliveredPayloadShape(delivery);
    const settlement = settlements.find((candidate) => isPlainRecord(candidate) && candidate.taskId === delivery.taskId);
    const fact = state.firstNightAbilityOutcomeLedger.facts.find((candidate) =>
      candidate.sourceEventSequence === delivery.deliveryEventSequence && candidate.abilityTaskId === delivery.taskId &&
      candidate.abilityInstance.abilityInstanceId === delivery.resolvingAbilityInstanceId
    );
    if (!shape.valid || !isPlainRecord(settlement) || settlement.taskType !== "MATHEMATICIAN_INFORMATION" ||
        settlement.outcomeType !== "MATHEMATICIAN_INFORMATION_DELIVERED" ||
        settlement.characterStateRevision !== delivery.settlementCharacterStateRevision || fact === undefined ||
        fact.auditFactId !== formatFirstNightAbilityOutcomeFactId(fact.sourceEventId) ||
        ids.has(delivery.deliveryId) || tasks.has(delivery.taskId) || instances.has(delivery.resolvingAbilityInstanceId)) {
      throw new DomainError("PrivateKnowledgeUnavailable", shape.valid ? "Mathematician stored delivery/fact/settlement chain is invalid" : shape.reason);
    }
    ids.add(delivery.deliveryId); tasks.add(delivery.taskId); instances.add(delivery.resolvingAbilityInstanceId);
  }
  return information.deliveries;
};

const deliveredStagesForViewer = (
  state: GameState,
  viewerPlayerId: PlayerId,
  clockmakerDeliveries: readonly ClockmakerInformationDeliveredPayload[],
  mathematicianDeliveries: readonly MathematicianInformationDeliveredPayload[]
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

  if (state.cerenovusMadnessInstructions?.deliveries.some((entry) => entry.recipientPlayerId === viewerPlayerId) === true) {
    stages.push(CERENOVUS_INFORMATION_STAGE);
  }

  if (clockmakerDeliveries.some((delivery) => delivery.sourceContract.sourcePlayerId === viewerPlayerId)) {
    stages.push("CLOCKMAKER_INFORMATION");
  }

  if (state.dreamerInformation?.deliveries.some((delivery) => delivery.sourcePlayerId === viewerPlayerId) === true) {
    stages.push(DREAMER_INFORMATION_STAGE);
  }

  if (state.seamstressInformation?.deliveries.some((delivery) => delivery.sourcePlayerId === viewerPlayerId) === true) {
    stages.push(SEAMSTRESS_INFORMATION_STAGE);
  }

  if (mathematicianDeliveries.some((delivery) => delivery.sourceContract.sourcePlayerId === viewerPlayerId)) {
    stages.push(MATHEMATICIAN_INFORMATION_STAGE);
  }

  return stages;
};

const buildPlayerPrivateKnowledgeViewInternal = (
  state: GameState,
  viewerPlayerId: PlayerId,
  allowAcceptedStreamOnlyHistory: boolean
): PlayerPrivateKnowledgeView => {
  if (!allowAcceptedStreamOnlyHistory && (state.mathematicianInformation !== undefined ||
      state.firstNightTaskProgress?.settlements.some((entry) => entry.outcomeType === "MATHEMATICIAN_INFORMATION_DELIVERED") === true)) {
    throw new DomainError("PrivateKnowledgeUnavailable", "State-only private projection cannot authenticate Mathematician history; use the accepted-event-stream builder");
  }
  if (!allowAcceptedStreamOnlyHistory && state.dreamerInformation?.deliveries.some((delivery) =>
    isPlainRecord(delivery) &&
    "deliverySchemaVersion" in delivery &&
    (delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION ||
      delivery.deliverySchemaVersion === DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION)
  ) === true) {
    throw new DomainError("PrivateKnowledgeUnavailable", "State-only private projection cannot authenticate versioned Vortox Dreamer history; use the accepted-event-stream builder");
  }
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
  const cerenovusInstructions = requireDeliveredCerenovusMadnessInstructionsAreSettled(state);
  const clockmakerDeliveries = requireDeliveredClockmakerInformationIsSettled(state);
  const mathematicianDeliveries = allowAcceptedStreamOnlyHistory ? requireDeliveredMathematicianInformationIsSettled(state) : [];
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
  const cerenovusInstruction = cerenovusInstructions.find((delivery) => delivery.recipientPlayerId === viewerPlayerId);
  const dreamerDelivery = state.dreamerInformation?.deliveries.find((delivery) => delivery.sourcePlayerId === viewerPlayerId);
  const viewerClockmakerDeliveries = clockmakerDeliveries.filter((delivery) => delivery.sourceContract.sourcePlayerId === viewerPlayerId);
  if (viewerClockmakerDeliveries.length > 1) throw new DomainError("PrivateKnowledgeUnavailable", "Viewer has multiple Clockmaker deliveries in the supported first-night history");
  const clockmakerDelivery = viewerClockmakerDeliveries[0];
  const viewerMathematicianDeliveries = mathematicianDeliveries.filter((delivery) =>
    delivery.sourceContract.sourcePlayerId === viewerPlayerId
  );
  if (viewerMathematicianDeliveries.length > 1) throw new DomainError("PrivateKnowledgeUnavailable", "Viewer has multiple Mathematician deliveries in the supported first-night history");
  const mathematicianDelivery = viewerMathematicianDeliveries[0];
  const seamstressDeliveries = state.seamstressInformation?.deliveries.filter((delivery) =>
    delivery.sourcePlayerId === viewerPlayerId
  ) ?? [];

  const deliveredKnowledgeStages = deliveredStagesForViewer(state, viewerPlayerId, clockmakerDeliveries, mathematicianDeliveries);
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
    ...(cerenovusInstruction === undefined
      ? {}
      : {
          cerenovusMadnessInstruction: {
            selectedByCharacter: "cerenovus" as const,
            madAboutRoleId: cerenovusInstruction.madAboutRoleId,
            instructionWindow: cerenovusInstruction.instructionWindow
          },
          cerenovusKnowledgeModelVersion: CERENOVUS_MADNESS_INSTRUCTION_MODEL_VERSION
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
    ...(clockmakerDelivery === undefined
      ? {}
      : {
          clockmakerInformation: { distance: clockmakerDelivery.selectedDistance },
          clockmakerKnowledgeModelVersion: CLOCKMAKER_INFORMATION_MODEL_VERSION
        }),
    ...(mathematicianDelivery === undefined
      ? {}
      : {
          mathematicianInformation: { count: mathematicianDelivery.selectedCount },
          mathematicianKnowledgeModelVersion: MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION
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

export const buildPlayerPrivateKnowledgeView = (
  state: GameState,
  viewerPlayerId: PlayerId
): PlayerPrivateKnowledgeView => buildPlayerPrivateKnowledgeViewInternal(state, viewerPlayerId, false);

export const buildPlayerPrivateKnowledgeViewFromAcceptedEventStream = (
  events: readonly AnyDomainEventEnvelope[],
  viewerPlayerId: PlayerId
): PlayerPrivateKnowledgeView => buildPlayerPrivateKnowledgeViewInternal(
  replayTrustedMathematicianProjectionStream(events).finalState,
  viewerPlayerId,
  true
);

export const buildAiPrivateKnowledgeView = (
  state: GameState,
  viewerPlayerId: PlayerId
): PlayerPrivateKnowledgeView => buildPlayerPrivateKnowledgeView(state, viewerPlayerId);

export const buildAiPrivateKnowledgeViewFromAcceptedEventStream = (
  events: readonly AnyDomainEventEnvelope[],
  viewerPlayerId: PlayerId
): PlayerPrivateKnowledgeView => buildPlayerPrivateKnowledgeViewFromAcceptedEventStream(events, viewerPlayerId);
