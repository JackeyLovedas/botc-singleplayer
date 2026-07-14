import { isCanonicalDataValue, sameCanonicalDataValue } from "./canonical-data.js";
import { validateCharacterAssignments } from "./character-assignment.js";
import { validateCurrentCharacterStateSet } from "./current-character-state.js";
import { DomainError } from "./errors.js";
import type {
  CharactersAssignedPayload,
  FirstNightInitializedPayload,
  FirstNightTaskPlanCreatedPayload,
  InitialPrivateKnowledgeEstablishedPayload,
  PlayerRosterCreatedPayload,
  SetupGeneratedPayload
} from "./events.js";
import {
  formatBaseFirstNightAbilityInstanceId,
  validateFirstNightAbilityInstanceProvenanceShape,
  validateFirstNightAbilityOutcomeLedgerShape
} from "./first-night-ability-outcome-ledger.js";
import type {
  FirstNightAbilityInstanceProvenance,
  FirstNightAbilityOutcomeLedger,
  FirstNightInitializationEnvelopeProvenance
} from "./first-night-ability-outcome-ledger.js";
import { getNextUnsettledFirstNightTask, validateFirstNightTaskPlanRuntimeState, validateFirstNightTaskProgress } from "./first-night-task-plan.js";
import type { FirstNightTaskProgress, ScheduledTask } from "./first-night-task-plan.js";
import type { GameState } from "./game-state.js";
import type { SnakeCharmerDemonSwapAppliedPayload, SnakeCharmerDemonSwapSet } from "./snake-charmer.js";
import type { GameId, PlayerId, RoleId, ScheduledTaskId } from "./ids.js";
import type { GamePhase } from "./game-phase.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import type { PlayerRoster } from "./player-roster.js";
import { validatePlayerRoster } from "./player-roster.js";
import type { FirstNightActionOpportunityState } from "./first-night-action-opportunity.js";
import { formatBaseDreamerV2ActionOpportunityId, validateFirstNightActionOpportunityStateShape } from "./first-night-action-opportunity.js";
import type {
  AbilityImpairmentSet,
  FirstNightTaskInsertedV2Payload,
  FirstNightTaskInsertion,
  GrantedAbilitySet,
  PhilosopherAbilityChoiceSet
} from "./philosopher-ability.js";
import {
  createPhilosopherAbilityGrantedPayload,
  PHILOSOPHER_GAINED_TASK_BY_ROLE_ID,
  scheduledTaskFromFirstNightTaskInsertedPayload,
  validateAbilityImpairmentAppliedPayload,
  validateFirstNightTaskInsertedV2Payload
} from "./philosopher-ability.js";
import type { MathematicianImpairmentEventProvenanceState } from "./mathematician.js";
import { validateMathematicianImpairmentEventProvenanceStateShape } from "./mathematician.js";
import {
  formatRoleTenureTransitionFactId,
  isRoleTenureActiveAt,
  isRoleTenureContinuousAcross,
  parseRoleTenureId,
  parseRoleTenureTransitionFactId
} from "./seamstress.js";
import type { RoleTenureRecord, RoleTenureState } from "./seamstress.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";
import {
  DREAMER_V2_CANONICAL_CONTEXT_VERSION,
  formatDreamerV2DeliveryId,
  formatDreamerV2TargetChoiceId,
  DREAMER_V2_PIPELINE_FINGERPRINT_VERSION,
  DREAMER_V2_SOURCE_CONTRACT_VERSION
} from "./dreamer-v2.js";
import type {
  BaseDreamerV2SourceContract,
  DreamerInformationSet,
  DreamerTargetChoiceSet,
  DreamerActionOpportunityV2,
  DreamerV2ResolutionBoundary,
  DreamerV2SourceContract,
  DreamerV2VortoxConstraint
} from "./dreamer-v2.js";
import type { DreamerV2SourceEffectiveness } from "./dreamer-v2.js";
import {
  validateDreamerInformationSetV1V2,
  validateDreamerTargetChoiceSetV1V2
} from "./dreamer-v2.js";
import type { DreamerInformationDeliveredPayload, DreamerTargetChosenPayload } from "./dreamer.js";
import { validateStoredDreamerInformationDelivered } from "./dreamer.js";
import { validateDreamerV2SourceContractShapeForInternalUse } from "./dreamer-v2-contract-internal.js";
import {
  hasExactRoleSetupSnapshotShape,
  validateFirstNightInitializedPayloadShape,
  validateInitialKnowledgeSourceFacts,
  validateInitialOwnCharacterKnowledgePayload
} from "./initial-private-knowledge.js";

const canonicalDreamerV2ContextBrand: unique symbol = Symbol("canonicalDreamerV2ContextBrand");

type CanonicalDreamerV2Context = {
  readonly contextVersion: typeof DREAMER_V2_CANONICAL_CONTEXT_VERSION;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly phase: "FIRST_NIGHT";
  readonly dayNumber: 0;
  readonly nightNumber: 1;
  readonly firstNight: FirstNightInitializedPayload;
  readonly firstNightInitializationProvenance: FirstNightInitializationEnvelopeProvenance;
  readonly initialPrivateKnowledge: InitialPrivateKnowledgeEstablishedPayload;
  readonly setup: SetupGeneratedPayload;
  readonly roster: PlayerRosterCreatedPayload;
  readonly assignment: CharactersAssignedPayload;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly firstNightTaskPlan: FirstNightTaskPlanCreatedPayload;
  readonly firstNightTaskProgress: FirstNightTaskProgress;
  readonly firstNightTaskInsertions: FirstNightTaskInsertion;
  readonly philosopherAbilityChoices: PhilosopherAbilityChoiceSet;
  readonly philosopherGrantedAbilities: GrantedAbilitySet;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState;
  readonly abilityImpairments: AbilityImpairmentSet;
  readonly impairmentEventProvenance: MathematicianImpairmentEventProvenanceState;
  readonly roleTenures: RoleTenureState;
  readonly snakeCharmerDemonSwaps: SnakeCharmerDemonSwapSet;
  readonly dreamerTargetChoices: DreamerTargetChoiceSet;
  readonly dreamerInformationDeliveries: DreamerInformationSet;
  readonly firstNightAbilityOutcomeLedger: FirstNightAbilityOutcomeLedger;
  readonly targetTask: ScheduledTask;
  readonly sourceContract: DreamerV2SourceContract;
  readonly sourceAbilityInstance: FirstNightAbilityInstanceProvenance;
  readonly resolutionBoundary: DreamerV2ResolutionBoundary;
  readonly [canonicalDreamerV2ContextBrand]: true;
};

type CanonicalDreamerV2ContextData = Omit<CanonicalDreamerV2Context, typeof canonicalDreamerV2ContextBrand>;

const CANONICAL_DREAMER_V2_CONTEXT_KEYS = [
  "contextVersion", "gameId", "rulesBaselineVersion", "gameVersion", "lastEventSequence", "phase", "dayNumber",
  "nightNumber", "firstNight", "firstNightInitializationProvenance", "initialPrivateKnowledge", "setup", "roster",
  "assignment", "currentCharacterState", "firstNightTaskPlan", "firstNightTaskProgress", "firstNightTaskInsertions",
  "philosopherAbilityChoices", "philosopherGrantedAbilities", "firstNightActionOpportunities", "abilityImpairments",
  "impairmentEventProvenance", "roleTenures", "snakeCharmerDemonSwaps", "dreamerTargetChoices", "dreamerInformationDeliveries",
  "firstNightAbilityOutcomeLedger", "targetTask", "sourceContract", "sourceAbilityInstance", "resolutionBoundary"
] as const;
const GAME_STATE_KEYS = new Set([
  "gameId", "gameVersion", "lastEventSequence", "phase", "dayNumber", "nightNumber", "created", "rootSeed",
  "rulesBaselineVersion", "playerCounts", "selectedScript", "seamstressResolutionCapability", "setup", "roster",
  "assignment", "currentCharacterState", "seamstressRoleTenureState", "seamstressAbilityState", "firstNight",
  "firstNightInitializationProvenance", "firstNightAbilityOutcomeLedger", "initialPrivateKnowledge", "firstNightTaskPlan",
  "firstNightActionOpportunities", "philosopherAbilityChoices", "philosopherGrantedAbilities", "abilityImpairments",
  "firstNightTaskInsertions", "snakeCharmerTargetChoices", "snakeCharmerNoSwapResolutions",
  "snakeCharmerIneffectiveResolutions", "snakeCharmerDemonSwaps", "witchTargetChoices", "witchDeathPending",
  "witchIneffectiveResolutions", "cerenovusChoices", "cerenovusMadnessMarkers", "cerenovusMadnessInstructions",
  "dreamerTargetChoices", "dreamerInformation", "clockmakerInformation", "mathematicianInformation",
  "mathematicianImpairmentEventProvenance", "seamstressTargetChoices", "seamstressAbilitySpends", "seamstressInformation",
  "evilTwinPairs", "evilTwinInformation", "minionInformation", "demonInformation", "firstNightTaskProgress"
]);
const exactKeys = (value: unknown, keys: readonly string[]): value is Record<string, unknown> =>
  isCanonicalDataValue(value) && value !== null && typeof value === "object" && !Array.isArray(value) &&
  Object.keys(value).length === keys.length && Object.keys(value).every((key) => keys.includes(key));
const safeNonNegative = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && !Object.is(value, -0);
const positive = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const seat = (value: unknown): boolean => positive(value) && value <= 12;
const uniqueBy = (values: readonly unknown[], identity: (value: Record<string, unknown>) => unknown): boolean => {
  const seen = new Set<unknown>();
  for (const value of values) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
    const key = identity(value as Record<string, unknown>);
    if (typeof key !== "string" || key.length === 0 || seen.has(key)) return false;
    seen.add(key);
  }
  return true;
};
const validateContainer = (value: unknown, key: string, identity: (value: Record<string, unknown>) => unknown): boolean =>
  exactKeys(value, [key]) && Array.isArray(value[key]) && uniqueBy(value[key], identity);
const collectObjectReferences = (value: unknown, output: Set<object>): void => {
  if (value === null || typeof value !== "object" || output.has(value)) return;
  output.add(value);
  for (const key of Object.keys(value)) collectObjectReferences((value as Record<string, unknown>)[key], output);
};

const PHILOSOPHER_CHOICE_KEYS = [
  "rulesBaselineVersion", "nightNumber", "taskId", "taskType", "opportunityId", "decisionKind", "sourcePlayerId",
  "sourceSeatNumber", "sourceRole", "sourceCharacterStateRevision", "chosenRole", "chosenRoleId", "roleCatalogSignature"
] as const;
const PHILOSOPHER_GRANT_KEYS = [
  "grantId", "sourcePlayerId", "sourceSeatNumber", "sourceRole", "sourceCharacterStateRevision", "chosenRole",
  "chosenRoleId", "chosenRoleCatalogSignature", "grantedAtTaskId", "grantedAtOpportunityId"
] as const;
const BASE_TENURE_START_KEYS = ["kind", "sourceEventId", "sourceEventSequence", "characterStateRevision"] as const;
const TRANSITION_TENURE_START_KEYS = [
  "kind", "transitionFactId", "sourceEventId", "sourceEventSequence", "previousCharacterStateRevision",
  "nextCharacterStateRevision"
] as const;
const TRACKED_ROLE_IDS = new Set<string>(["cerenovus", "dreamer", "mathematician", "philosopher", "seamstress", "vortox"]);

const validateStoredPhilosopherChain = (context: CanonicalDreamerV2ContextData): boolean => {
  if (!validateContainer(context.philosopherAbilityChoices, "choices", (entry) => entry.opportunityId) ||
      !validateContainer(context.philosopherGrantedAbilities, "abilities", (entry) => entry.grantId)) return false;
  const choices = context.philosopherAbilityChoices.choices;
  const grants = context.philosopherGrantedAbilities.abilities;
  for (const choice of choices) {
    if (!exactKeys(choice, PHILOSOPHER_CHOICE_KEYS) || choice.rulesBaselineVersion !== context.rulesBaselineVersion ||
        choice.nightNumber !== 1 || choice.taskType !== "PHILOSOPHER_ACTION" ||
        choice.decisionKind !== "CHOOSE_GOOD_CHARACTER" || !nonEmpty(choice.taskId) || !nonEmpty(choice.opportunityId) ||
        !nonEmpty(choice.sourcePlayerId) || !seat(choice.sourceSeatNumber) || !positive(choice.sourceCharacterStateRevision) ||
        !hasExactRoleSetupSnapshotShape(choice.sourceRole) || choice.sourceRole.roleId !== "philosopher" ||
        !hasExactRoleSetupSnapshotShape(choice.chosenRole) || choice.chosenRoleId !== choice.chosenRole.roleId ||
        choice.roleCatalogSignature !== context.setup.roleCatalogSignature) return false;
    const catalogRoles = context.setup.roleCatalogSnapshot.roles.filter((role) => role.roleId === choice.chosenRoleId);
    const tasks = context.firstNightTaskPlan.tasks.filter((task) => task.taskId === choice.taskId && task.taskType === "PHILOSOPHER_ACTION");
    const opportunities = context.firstNightActionOpportunities.opportunities.filter((entry) => entry.opportunityId === choice.opportunityId);
    const opportunity = opportunities[0];
    if (catalogRoles.length !== 1 || !sameRoleSetupSnapshot(catalogRoles[0]!, choice.chosenRole) ||
        tasks.length !== 1 || opportunities.length !== 1 || opportunity === undefined ||
        opportunity.opportunityKind !== "PHILOSOPHER_FIRST_NIGHT_ACTION" || opportunity.opportunityStatus !== "CLOSED" ||
        opportunity.taskId !== choice.taskId || opportunity.sourcePlayerId !== choice.sourcePlayerId ||
        opportunity.sourceSeatNumber !== choice.sourceSeatNumber || !sameRoleSetupSnapshot(opportunity.sourceRole, choice.sourceRole) ||
        opportunity.sourceCharacterStateRevision !== choice.sourceCharacterStateRevision) return false;
  }
  for (const grant of grants) {
    if (!exactKeys(grant, PHILOSOPHER_GRANT_KEYS) || !nonEmpty(grant.grantId) || !nonEmpty(grant.sourcePlayerId) ||
        !seat(grant.sourceSeatNumber) || !positive(grant.sourceCharacterStateRevision) ||
        !hasExactRoleSetupSnapshotShape(grant.sourceRole) || !hasExactRoleSetupSnapshotShape(grant.chosenRole) ||
        grant.chosenRoleId !== grant.chosenRole.roleId || grant.chosenRoleCatalogSignature !== context.setup.roleCatalogSignature ||
        !nonEmpty(grant.grantedAtTaskId) || !nonEmpty(grant.grantedAtOpportunityId)) return false;
    const matches = choices.filter((choice) => choice.opportunityId === grant.grantedAtOpportunityId && choice.taskId === grant.grantedAtTaskId);
    const choice = matches[0];
    if (matches.length !== 1 || choice === undefined) return false;
    const expected = createPhilosopherAbilityGrantedPayload({ rulesBaselineVersion: context.rulesBaselineVersion, choice });
    if (grant.grantId !== expected.grantId || grant.sourcePlayerId !== expected.sourcePlayerId ||
        grant.sourceSeatNumber !== expected.sourceSeatNumber || !sameRoleSetupSnapshot(grant.sourceRole, expected.sourceRole) ||
        grant.sourceCharacterStateRevision !== expected.sourceCharacterStateRevision ||
        !sameRoleSetupSnapshot(grant.chosenRole, expected.chosenRole) || grant.chosenRoleId !== expected.chosenRoleId ||
        grant.chosenRoleCatalogSignature !== expected.chosenRoleCatalogSignature ||
        grant.grantedAtTaskId !== expected.grantedAtTaskId || grant.grantedAtOpportunityId !== expected.grantedAtOpportunityId) return false;
  }
  return choices.every((choice) => grants.filter((grant) => grant.grantedAtOpportunityId === choice.opportunityId).length === 1) &&
    grants.every((grant) => choices.filter((choice) => choice.opportunityId === grant.grantedAtOpportunityId).length === 1);
};

const validateStoredInsertions = (context: CanonicalDreamerV2ContextData): boolean => {
  if (!validateContainer(context.firstNightTaskInsertions, "insertions", (entry) => entry.taskId)) return false;
  const insertions = context.firstNightTaskInsertions.insertions;
  if (insertions.some((entry) => !("schedulingVersion" in entry))) return false;
  const insertionIds = new Set(insertions.map((entry) => entry.taskId));
  const basePlan = { ...context.firstNightTaskPlan, tasks: context.firstNightTaskPlan.tasks.filter((task) => !insertionIds.has(task.taskId)) };
  const accepted: FirstNightTaskInsertedV2Payload[] = [];
  for (const insertionValue of insertions) {
    const insertion = insertionValue as FirstNightTaskInsertedV2Payload;
    const validation = validateFirstNightTaskInsertedV2Payload(insertion, {
      firstNightTaskPlan: basePlan,
      grants: context.philosopherGrantedAbilities,
      insertions: { insertions: accepted }
    });
    if (!validation.valid) return false;
    const tasks = context.firstNightTaskPlan.tasks.filter((task) => task.taskId === insertion.taskId);
    const expectedTask = scheduledTaskFromFirstNightTaskInsertedPayload(insertion);
    const grants = context.philosopherGrantedAbilities.abilities.filter((grant) => grant.grantId === insertion.grantId);
    const choices = context.philosopherAbilityChoices.choices.filter((choice) => choice.opportunityId === insertion.philosopherOpportunityId);
    if (tasks.length !== 1 || !sameCanonicalDataValue(tasks[0], expectedTask) || grants.length !== 1 || choices.length !== 1 ||
        grants[0]!.grantedAtOpportunityId !== insertion.philosopherOpportunityId ||
        choices[0]!.chosenRoleId !== insertion.targetRoleId) return false;
    accepted.push(insertion);
  }
  for (const grant of context.philosopherGrantedAbilities.abilities) {
    if (Object.hasOwn(PHILOSOPHER_GAINED_TASK_BY_ROLE_ID, grant.chosenRoleId) &&
        insertions.filter((entry) => "grantId" in entry && entry.grantId === grant.grantId).length !== 1) return false;
  }
  return true;
};

const validateStoredImpairments = (context: CanonicalDreamerV2ContextData): boolean => {
  if (!validateContainer(context.abilityImpairments, "impairments", (entry) => entry.impairmentId) ||
      !validateMathematicianImpairmentEventProvenanceStateShape(context.impairmentEventProvenance).valid) return false;
  for (const impairment of context.abilityImpairments.impairments) {
    const validation = validateAbilityImpairmentAppliedPayload(
      { ...impairment, rulesBaselineVersion: context.rulesBaselineVersion },
      { currentCharacterState: context.currentCharacterState, grants: context.philosopherGrantedAbilities }
    );
    const rosterMatches = context.roster.entries.filter((entry) =>
      entry.playerId === impairment.affectedPlayerId && entry.seatNumber === impairment.affectedSeatNumber
    );
    const provenanceMatches = context.impairmentEventProvenance.entries.filter((entry) => entry.impairmentId === impairment.impairmentId);
    if (!validation.valid || rosterMatches.length !== 1 || provenanceMatches.length !== 1) return false;
  }
  return context.impairmentEventProvenance.entries.every((entry) =>
    context.abilityImpairments.impairments.filter((impairment) => impairment.impairmentId === entry.impairmentId).length === 1
  );
};

const validateRoleTenureStateInternal = (context: CanonicalDreamerV2ContextData): boolean => {
  const state = context.roleTenures;
  const records: readonly RoleTenureRecord[] = state.records;
  const processedTransitionFactIds: RoleTenureState["processedTransitionFactIds"] = state.processedTransitionFactIds;
  if (!exactKeys(state, ["records", "processedTransitionFactIds"]) || !Array.isArray(state.records) ||
      !Array.isArray(state.processedTransitionFactIds) || !uniqueBy(records, (entry) => entry.roleTenureId) ||
      processedTransitionFactIds.some((id) => !parseRoleTenureTransitionFactId(id).valid) ||
      new Set(processedTransitionFactIds).size !== processedTransitionFactIds.length) return false;
  const initialAssignments = context.assignment.assignments.filter((entry) => TRACKED_ROLE_IDS.has(entry.role.roleId));
  const baseRecords = records.filter((record) => record.startedBy.kind === "CHARACTERS_ASSIGNED");
  if (baseRecords.length !== initialAssignments.length) return false;
  for (const assignment of initialAssignments) {
    if (baseRecords.filter((record) => record.playerId === assignment.playerId && record.seatNumber === assignment.seatNumber &&
        record.roleId === assignment.role.roleId && record.acquiredCharacterStateRevision === 1).length !== 1) return false;
  }
  const initialSources = new Set(baseRecords.map((record) => `${record.startedBy.sourceEventSequence}:${record.startedBy.sourceEventId}`));
  if (baseRecords.length > 0 && (initialSources.size !== 1 ||
      baseRecords.some((record) => record.startedBy.sourceEventSequence >= context.firstNightInitializationProvenance.eventSequence))) return false;

  const swaps = context.snakeCharmerDemonSwaps.swaps;
  if (!exactKeys(context.snakeCharmerDemonSwaps, ["swaps"]) || !Array.isArray(swaps) ||
      !uniqueBy(swaps, (entry) => `${String(entry.taskId)}:${String(entry.opportunityId)}`)) return false;
  const linkedSwaps = swaps.flatMap((rawSwap): readonly [{
    readonly swap: SnakeCharmerDemonSwapAppliedPayload;
    readonly fact: FirstNightAbilityOutcomeLedger["facts"][number];
    readonly source: Extract<FirstNightAbilityOutcomeLedger["facts"][number]["evidenceReferences"][number], { readonly kind: "SOURCE_EVENT" }>;
    readonly sourceTransitionId: RoleTenureState["processedTransitionFactIds"][number];
    readonly targetTransitionId: RoleTenureState["processedTransitionFactIds"][number];
  }] | readonly [] => {
    const swap = rawSwap as SnakeCharmerDemonSwapAppliedPayload;
    if (!exactKeys(rawSwap, ["rulesBaselineVersion", "nightNumber", "taskId", "taskType", "opportunityId", "sourcePlayerId",
          "sourceSeatNumber", "targetPlayerId", "targetSeatNumber", "previousCharacterStateRevision", "nextCharacterStateRevision",
          "sourceBefore", "targetBefore", "sourceAfter", "targetAfter", "swapReason"]) ||
        swap.rulesBaselineVersion !== context.rulesBaselineVersion || swap.nightNumber !== 1 || swap.taskType !== "SNAKE_CHARMER_ACTION" ||
        !nonEmpty(swap.taskId) || !nonEmpty(swap.opportunityId) || !nonEmpty(swap.sourcePlayerId) || !seat(swap.sourceSeatNumber) ||
        !nonEmpty(swap.targetPlayerId) || !seat(swap.targetSeatNumber) || swap.sourcePlayerId === swap.targetPlayerId ||
        !positive(swap.previousCharacterStateRevision) || swap.nextCharacterStateRevision !== swap.previousCharacterStateRevision + 1 ||
        swap.swapReason !== "SNAKE_CHARMER_DEMON_HIT") return [];
    for (const entry of [swap.sourceBefore, swap.targetBefore, swap.sourceAfter, swap.targetAfter]) {
      if (!exactKeys(entry, ["playerId", "seatNumber", "role", "currentAlignment"]) || !nonEmpty(entry.playerId) ||
          !seat(entry.seatNumber) || !hasExactRoleSetupSnapshotShape(entry.role) || !["GOOD", "EVIL"].includes(entry.currentAlignment)) return [];
    }
    if (swap.sourceBefore.playerId !== swap.sourcePlayerId || swap.sourceBefore.seatNumber !== swap.sourceSeatNumber ||
        swap.targetBefore.playerId !== swap.targetPlayerId || swap.targetBefore.seatNumber !== swap.targetSeatNumber ||
        swap.sourceAfter.playerId !== swap.sourcePlayerId || swap.sourceAfter.seatNumber !== swap.sourceSeatNumber ||
        swap.targetAfter.playerId !== swap.targetPlayerId || swap.targetAfter.seatNumber !== swap.targetSeatNumber ||
        !sameRoleSetupSnapshot(swap.sourceAfter.role, swap.targetBefore.role) ||
        !sameRoleSetupSnapshot(swap.targetAfter.role, swap.sourceBefore.role) ||
        swap.sourceAfter.currentAlignment !== swap.targetBefore.currentAlignment ||
        swap.targetAfter.currentAlignment !== swap.sourceBefore.currentAlignment) return [];
    const facts = context.firstNightAbilityOutcomeLedger.facts.filter((fact) => {
      const source = fact.evidenceReferences.find((entry): entry is Extract<typeof entry, { readonly kind: "SOURCE_EVENT" }> =>
        entry.kind === "SOURCE_EVENT" && entry.eventType === "SnakeCharmerDemonSwapApplied");
      const resolution = fact.evidenceReferences.find((entry): entry is Extract<typeof entry, { readonly kind: "SNAKE_CHARMER_RESOLUTION" }> =>
        entry.kind === "SNAKE_CHARMER_RESOLUTION" && entry.resolutionKind === "DEMON_HIT_SWAP");
      const sourceRole = fact.evidenceReferences.find((entry): entry is Extract<typeof entry, { readonly kind: "PLAYER_ROLE_AT_REVISION" }> => entry.kind === "PLAYER_ROLE_AT_REVISION" &&
        entry.playerId === swap.sourcePlayerId && entry.characterStateRevision === swap.previousCharacterStateRevision);
      const targetRole = fact.evidenceReferences.find((entry): entry is Extract<typeof entry, { readonly kind: "PLAYER_ROLE_AT_REVISION" }> => entry.kind === "PLAYER_ROLE_AT_REVISION" &&
        entry.playerId === swap.targetPlayerId && entry.characterStateRevision === swap.previousCharacterStateRevision);
      return source?.eventId === fact.sourceEventId && source.eventSequence === fact.sourceEventSequence &&
        resolution?.resolutionEventId === source.eventId && resolution.taskId === swap.taskId &&
        resolution.opportunityId === swap.opportunityId && resolution.targetPlayerId === swap.targetPlayerId &&
        resolution.targetSeatNumber === swap.targetSeatNumber && resolution.targetRoleIdAtResolution === swap.targetBefore.role.roleId &&
        fact.abilityTaskId === swap.taskId && fact.sourcePlayerId === swap.sourcePlayerId && fact.sourceSeatNumber === swap.sourceSeatNumber &&
        fact.evaluatedCharacterStateRevision === swap.previousCharacterStateRevision &&
        sourceRole?.seatNumber === swap.sourceSeatNumber && sourceRole.roleId === swap.sourceBefore.role.roleId &&
        sourceRole.characterType === swap.sourceBefore.role.characterType && sourceRole.defaultAlignment === swap.sourceBefore.role.defaultAlignment &&
        targetRole?.seatNumber === swap.targetSeatNumber && targetRole.roleId === swap.targetBefore.role.roleId &&
        targetRole.characterType === swap.targetBefore.role.characterType && targetRole.defaultAlignment === swap.targetBefore.role.defaultAlignment;
    });
    const fact = facts[0];
    const source = fact?.evidenceReferences.find((entry): entry is Extract<typeof entry, { readonly kind: "SOURCE_EVENT" }> =>
      entry.kind === "SOURCE_EVENT" && entry.eventType === "SnakeCharmerDemonSwapApplied");
    if (facts.length !== 1 || fact === undefined || source === undefined) return [];
    return [{ swap, fact, source, sourceTransitionId: formatRoleTenureTransitionFactId({
      sourceEventSequence: source.eventSequence, seatNumber: swap.sourceSeatNumber, nextCharacterStateRevision: swap.nextCharacterStateRevision
    }), targetTransitionId: formatRoleTenureTransitionFactId({
      sourceEventSequence: source.eventSequence, seatNumber: swap.targetSeatNumber, nextCharacterStateRevision: swap.nextCharacterStateRevision
    }) }];
  });
  const terminalSnakeSwapFactCount = context.firstNightAbilityOutcomeLedger.facts.filter((fact) =>
    fact.evidenceReferences.some((entry) => entry.kind === "SOURCE_EVENT" && entry.eventType === "SnakeCharmerDemonSwapApplied")
  ).length;
  if (linkedSwaps.length !== swaps.length || linkedSwaps.length !== terminalSnakeSwapFactCount) return false;
  const expectedTransitionIds = linkedSwaps.flatMap((entry) => [entry.sourceTransitionId, entry.targetTransitionId]);
  if (expectedTransitionIds.length !== processedTransitionFactIds.length ||
      expectedTransitionIds.some((id) => !processedTransitionFactIds.includes(id)) ||
      processedTransitionFactIds.some((id) => !expectedTransitionIds.includes(id))) return false;
  for (const record of records) {
    const keys = record.endedCharacterStateRevision === undefined
      ? ["roleTenureId", "playerId", "seatNumber", "roleId", "acquiredCharacterStateRevision", "startedBy"]
      : ["roleTenureId", "playerId", "seatNumber", "roleId", "acquiredCharacterStateRevision", "endedCharacterStateRevision", "startedBy"];
    const parsed = parseRoleTenureId(record.roleTenureId);
    if (!exactKeys(record, keys) || !parsed.valid || parsed.seatNumber !== record.seatNumber || parsed.roleId !== record.roleId ||
        parsed.acquiredCharacterStateRevision !== record.acquiredCharacterStateRevision || !nonEmpty(record.playerId) ||
        !seat(record.seatNumber) || !positive(record.acquiredCharacterStateRevision) ||
        (record.endedCharacterStateRevision !== undefined &&
          (!positive(record.endedCharacterStateRevision) || record.endedCharacterStateRevision <= record.acquiredCharacterStateRevision)) ||
        context.roster.entries.filter((entry) => entry.playerId === record.playerId && entry.seatNumber === record.seatNumber).length !== 1) return false;
    const startedBy = record.startedBy;
    if (startedBy.kind === "CHARACTERS_ASSIGNED") {
      if (!exactKeys(startedBy, BASE_TENURE_START_KEYS) || record.acquiredCharacterStateRevision !== 1 ||
          startedBy.characterStateRevision !== 1 || !nonEmpty(startedBy.sourceEventId) ||
          !positive(startedBy.sourceEventSequence)) return false;
    } else if (startedBy.kind === "ROLE_TENURE_TRANSITION") {
      const transition = parseRoleTenureTransitionFactId(startedBy.transitionFactId);
      if (!exactKeys(startedBy, TRANSITION_TENURE_START_KEYS) || !transition.valid ||
          transition.sourceEventSequence !== startedBy.sourceEventSequence ||
          transition.nextCharacterStateRevision !== startedBy.nextCharacterStateRevision ||
          transition.seatNumber !== record.seatNumber || startedBy.nextCharacterStateRevision !== record.acquiredCharacterStateRevision ||
          startedBy.previousCharacterStateRevision + 1 !== startedBy.nextCharacterStateRevision ||
          !processedTransitionFactIds.includes(startedBy.transitionFactId) || !nonEmpty(startedBy.sourceEventId)) return false;
      const side = linkedSwaps.flatMap((entry) => [
        { link: entry, transitionId: entry.sourceTransitionId, playerId: entry.swap.sourcePlayerId,
          seatNumber: entry.swap.sourceSeatNumber, afterRoleId: entry.swap.sourceAfter.role.roleId },
        { link: entry, transitionId: entry.targetTransitionId, playerId: entry.swap.targetPlayerId,
          seatNumber: entry.swap.targetSeatNumber, afterRoleId: entry.swap.targetAfter.role.roleId }
      ]).find((entry) => entry.transitionId === startedBy.transitionFactId);
      if (side === undefined || startedBy.sourceEventId !== side.link.source.eventId ||
          startedBy.sourceEventSequence !== side.link.source.eventSequence || record.playerId !== side.playerId ||
          record.seatNumber !== side.seatNumber || record.roleId !== side.afterRoleId ||
          record.acquiredCharacterStateRevision !== side.link.swap.nextCharacterStateRevision ||
          !TRACKED_ROLE_IDS.has(side.afterRoleId)) return false;
    } else return false;
  }
  for (const link of linkedSwaps) {
    for (const side of [
      { transitionId: link.sourceTransitionId, playerId: link.swap.sourcePlayerId, seatNumber: link.swap.sourceSeatNumber,
        beforeRoleId: link.swap.sourceBefore.role.roleId, afterRoleId: link.swap.sourceAfter.role.roleId },
      { transitionId: link.targetTransitionId, playerId: link.swap.targetPlayerId, seatNumber: link.swap.targetSeatNumber,
        beforeRoleId: link.swap.targetBefore.role.roleId, afterRoleId: link.swap.targetAfter.role.roleId }
    ]) {
      const previousRecords = records.filter((record) => record.playerId === side.playerId && record.seatNumber === side.seatNumber &&
        record.roleId === side.beforeRoleId && record.acquiredCharacterStateRevision <= link.swap.previousCharacterStateRevision &&
        record.endedCharacterStateRevision === link.swap.nextCharacterStateRevision);
      const nextRecords = records.filter((record) => record.startedBy.kind === "ROLE_TENURE_TRANSITION" &&
        record.startedBy.transitionFactId === side.transitionId && record.playerId === side.playerId &&
        record.seatNumber === side.seatNumber && record.roleId === side.afterRoleId &&
        record.acquiredCharacterStateRevision === link.swap.nextCharacterStateRevision);
      if ((TRACKED_ROLE_IDS.has(side.beforeRoleId) ? previousRecords.length !== 1 : previousRecords.length !== 0) ||
          (TRACKED_ROLE_IDS.has(side.afterRoleId) ? nextRecords.length !== 1 : nextRecords.length !== 0)) return false;
    }
  }
  for (let leftIndex = 0; leftIndex < records.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < records.length; rightIndex += 1) {
      const left = records[leftIndex]!; const right = records[rightIndex]!;
      if (left.playerId !== right.playerId) continue;
      const leftEnd = left.endedCharacterStateRevision ?? Number.MAX_SAFE_INTEGER;
      const rightEnd = right.endedCharacterStateRevision ?? Number.MAX_SAFE_INTEGER;
      if (left.acquiredCharacterStateRevision < rightEnd && right.acquiredCharacterStateRevision < leftEnd) return false;
    }
  }
  return true;
};

const validateDreamerV2CrossLinks = (context: CanonicalDreamerV2ContextData): boolean => {
  const v2Opportunities = context.firstNightActionOpportunities.opportunities.filter((entry): entry is DreamerActionOpportunityV2 =>
    "opportunitySchemaVersion" in entry && entry.opportunitySchemaVersion === "dreamer-first-night-action-v2"
  );
  for (const opportunity of v2Opportunities) {
    const tasks = context.firstNightTaskPlan.tasks.filter((task) => task.taskId === opportunity.taskId);
    const task = tasks[0];
    if (tasks.length !== 1 || task === undefined || task.taskType !== "DREAMER_ACTION" ||
        !validateDreamerV2SourceContractShapeForInternalUse(opportunity.sourceContract).valid ||
        opportunity.sourceContract.taskId !== task.taskId || opportunity.sourceContract.sourcePlayerId !== opportunity.sourcePlayerId ||
        opportunity.sourceContract.sourceSeatNumber !== opportunity.sourceSeatNumber ||
        !sameRoleSetupSnapshot(opportunity.sourceContract.sourceRole, opportunity.sourceRole) ||
        opportunity.sourceContract.opportunityCharacterStateRevision !== opportunity.sourceCharacterStateRevision) return false;
    if (task.source.kind !== "ROLE" || task.source.playerId !== opportunity.sourcePlayerId ||
        task.source.seatNumber !== opportunity.sourceSeatNumber || !sameRoleSetupSnapshot(task.source.role, opportunity.sourceRole) ||
        !sameRoleSetupSnapshot(opportunity.sourceContract.abilityRole, opportunity.sourceRole)) return false;
  }

  const v1Choices = context.dreamerTargetChoices.choices.filter((entry): entry is DreamerTargetChosenPayload =>
    !("targetChoiceSchemaVersion" in entry));
  const v1Deliveries = context.dreamerInformationDeliveries.deliveries.filter((entry): entry is DreamerInformationDeliveredPayload =>
    !("deliverySchemaVersion" in entry));
  const v2Choices = context.dreamerTargetChoices.choices.filter((entry) => "targetChoiceSchemaVersion" in entry);
  const v2Deliveries = context.dreamerInformationDeliveries.deliveries.filter((entry) => "deliverySchemaVersion" in entry);
  const generationsByTask = new Map<string, Set<"V1" | "V2">>();
  for (const entry of [...v1Choices, ...v1Deliveries]) {
    const generations = generationsByTask.get(entry.taskId) ?? new Set<"V1" | "V2">();
    generations.add("V1"); generationsByTask.set(entry.taskId, generations);
  }
  for (const entry of [...v2Choices, ...v2Deliveries]) {
    const generations = generationsByTask.get(entry.taskId) ?? new Set<"V1" | "V2">();
    generations.add("V2"); generationsByTask.set(entry.taskId, generations);
  }
  if ([...generationsByTask.values()].some((generations) => generations.size !== 1)) return false;
  for (const choice of v1Choices) {
    if (v1Deliveries.filter((delivery) => delivery.taskId === choice.taskId && delivery.opportunityId === choice.opportunityId).length !== 1) return false;
  }
  for (const delivery of v1Deliveries) {
    const settlements = context.firstNightTaskProgress.settlements.filter((entry) => entry.taskId === delivery.taskId);
    if (settlements.length !== 1 || !validateStoredDreamerInformationDelivered(delivery, {
      rulesBaselineVersion: context.rulesBaselineVersion,
      setup: context.setup,
      roster: context.roster.entries,
      firstNightTaskPlan: context.firstNightTaskPlan,
      choices: { choices: v1Choices },
      settlement: settlements[0]
    }).valid) return false;
  }
  for (const choice of v2Choices) {
    const opportunities = v2Opportunities.filter((entry) => entry.opportunityId === choice.opportunityId);
    const opportunity = opportunities[0];
    const rosterTargets = context.roster.entries.filter((entry) =>
      entry.playerId === choice.targetPlayerId && entry.seatNumber === choice.targetSeatNumber
    );
    if (opportunities.length !== 1 || opportunity === undefined || opportunity.taskId !== choice.taskId ||
        choice.targetChoiceId !== formatDreamerV2TargetChoiceId(choice.taskId) ||
        !sameCanonicalDataValue(choice.sourceContract, opportunity.sourceContract) || rosterTargets.length !== 1 ||
        choice.targetPlayerId === opportunity.sourcePlayerId) return false;
  }
  for (const delivery of v2Deliveries) {
    const choices = v2Choices.filter((choice) => choice.targetChoiceId === delivery.targetChoiceId);
    const choice = choices[0];
    const opportunities = v2Opportunities.filter((entry) => entry.opportunityId === delivery.opportunityId);
    const opportunity = opportunities[0];
    if (choices.length !== 1 || choice === undefined || opportunities.length !== 1 || opportunity === undefined ||
        opportunity.opportunityStatus !== "CLOSED" || delivery.deliveryId !== formatDreamerV2DeliveryId(delivery.taskId) ||
        delivery.taskId !== choice.taskId || delivery.opportunityId !== choice.opportunityId ||
        delivery.targetTruth.targetPlayerId !== choice.targetPlayerId || delivery.targetTruth.targetSeatNumber !== choice.targetSeatNumber ||
        delivery.targetTruth.targetCharacterStateRevision !== choice.settlementCharacterStateRevision ||
        delivery.settlementCharacterStateRevision !== choice.settlementCharacterStateRevision ||
        !sameCanonicalDataValue(delivery.sourceContract, choice.sourceContract) ||
        !sameCanonicalDataValue(delivery.sourceContract, opportunity.sourceContract)) return false;
    const settlements = context.firstNightTaskProgress.settlements.filter((settlement) => settlement.taskId === delivery.taskId);
    if (settlements.length > 1 || (settlements.length === 0 && context.resolutionBoundary.deliveryId !== delivery.deliveryId) ||
        (settlements[0] !== undefined && (settlements[0].taskType !== "DREAMER_ACTION" ||
          settlements[0].outcomeType !== "DREAMER_INFORMATION_DELIVERED" ||
          settlements[0].characterStateRevision !== delivery.settlementCharacterStateRevision))) return false;
    const facts = context.firstNightAbilityOutcomeLedger.facts.filter((fact) =>
      fact.evidenceReferences.some((evidence) => evidence.kind === "DREAMER_V2_DELIVERY" && evidence.deliveryId === delivery.deliveryId)
    );
    const fact = facts[0];
    if (facts.length !== 1 || fact === undefined || fact.abilityTaskId !== delivery.taskId ||
        fact.sourcePlayerId !== delivery.sourceContract.sourcePlayerId ||
        fact.sourceSeatNumber !== delivery.sourceContract.sourceSeatNumber ||
        !sameCanonicalDataValue(fact.abilityInstance, delivery.sourceContract.abilityInstance) ||
        fact.evaluatedCharacterStateRevision !== delivery.settlementCharacterStateRevision) return false;
    const sourceEvidence = fact.evidenceReferences.filter((evidence) => evidence.kind === "SOURCE_EVENT");
    const opportunityEvidence = fact.evidenceReferences.filter((evidence) => evidence.kind === "DREAMER_V2_ACTION_OPPORTUNITY");
    const deliveryEvidence = fact.evidenceReferences.filter((evidence) => evidence.kind === "DREAMER_V2_DELIVERY");
    const tenureEvidence = fact.evidenceReferences.filter((evidence) => evidence.kind === "ROLE_TENURE" &&
      evidence.roleTenureId === delivery.sourceContract.sourceRoleTenure.roleTenureId);
    const impairmentEvidence = fact.evidenceReferences.filter((evidence) => evidence.kind === "ABILITY_IMPAIRMENT");
    if (sourceEvidence.length !== 1 || sourceEvidence[0]!.eventType !== "DreamerInformationDeliveredV2" ||
        sourceEvidence[0]!.eventId !== fact.sourceEventId || sourceEvidence[0]!.eventSequence !== fact.sourceEventSequence ||
        opportunityEvidence.length !== 1 || opportunityEvidence[0]!.opportunityId !== delivery.opportunityId ||
        opportunityEvidence[0]!.taskId !== delivery.taskId ||
        opportunityEvidence[0]!.abilityInstanceId !== delivery.sourceContract.abilityInstance.abilityInstanceId ||
        deliveryEvidence.length !== 1 || deliveryEvidence[0]!.terminalEventId !== fact.sourceEventId ||
        deliveryEvidence[0]!.taskId !== delivery.taskId || deliveryEvidence[0]!.opportunityId !== delivery.opportunityId ||
        deliveryEvidence[0]!.sourcePlayerId !== delivery.sourceContract.sourcePlayerId ||
        deliveryEvidence[0]!.abilityInstanceId !== delivery.sourceContract.abilityInstance.abilityInstanceId ||
        deliveryEvidence[0]!.targetPlayerId !== delivery.targetTruth.targetPlayerId ||
        deliveryEvidence[0]!.targetTrueRoleId !== delivery.targetTruth.targetTrueRole.roleId ||
        deliveryEvidence[0]!.deliveredGoodRoleId !== delivery.selectedGoodRole.roleId ||
        deliveryEvidence[0]!.deliveredEvilRoleId !== delivery.selectedEvilRole.roleId || tenureEvidence.length !== 1 ||
        impairmentEvidence.length !== delivery.sourceEffectiveness.representedImpairments.length ||
        !delivery.sourceEffectiveness.representedImpairments.every((represented) =>
          impairmentEvidence.some((evidence) => evidence.impairmentId === represented.impairmentId &&
            context.abilityImpairments.impairments.some((impairment) => impairment.impairmentId === represented.impairmentId)))) return false;
  }
  if (!v2Choices.every((choice) => {
    const deliveries = v2Deliveries.filter((delivery) => delivery.targetChoiceId === choice.targetChoiceId);
    return deliveries.length === 1 || (deliveries.length === 0 && context.resolutionBoundary.targetChoiceId === choice.targetChoiceId);
  })) return false;
  return context.firstNightAbilityOutcomeLedger.facts.every((fact) => fact.evidenceReferences.every((evidence) =>
    evidence.kind !== "DREAMER_V2_DELIVERY" ||
    v2Deliveries.filter((delivery) => delivery.deliveryId === evidence.deliveryId).length === 1
  ));
};

const validateCanonicalDreamerV2ContextInternal = (value: unknown): value is CanonicalDreamerV2ContextData => {
  try {
    if (!exactKeys(value, CANONICAL_DREAMER_V2_CONTEXT_KEYS)) return false;
    const context = value as unknown as CanonicalDreamerV2ContextData;
    if (context.contextVersion !== DREAMER_V2_CANONICAL_CONTEXT_VERSION || !nonEmpty(context.gameId) ||
        !nonEmpty(context.rulesBaselineVersion) || !safeNonNegative(context.gameVersion) ||
        !safeNonNegative(context.lastEventSequence) || context.phase !== "FIRST_NIGHT" || context.dayNumber !== 0 ||
        context.nightNumber !== 1 || !validateFirstNightInitializedPayloadShape(context.firstNight).valid ||
        !exactKeys(context.firstNightInitializationProvenance, ["provenanceVersion", "gameId", "rulesBaselineVersion", "eventId", "eventSequence"]) ||
        context.firstNightInitializationProvenance.provenanceVersion !== "first-night-initialization-envelope-provenance-v1" ||
        context.firstNightInitializationProvenance.gameId !== context.gameId ||
        context.firstNightInitializationProvenance.rulesBaselineVersion !== context.rulesBaselineVersion ||
        !nonEmpty(context.firstNightInitializationProvenance.eventId) ||
        !positive(context.firstNightInitializationProvenance.eventSequence) ||
        context.firstNightAbilityOutcomeLedger.windowAnchor.gameId !== context.firstNightInitializationProvenance.gameId ||
        context.firstNightAbilityOutcomeLedger.windowAnchor.rulesBaselineVersion !== context.firstNightInitializationProvenance.rulesBaselineVersion ||
        context.firstNightAbilityOutcomeLedger.windowAnchor.firstNightInitializedEventId !== context.firstNightInitializationProvenance.eventId ||
        context.firstNightAbilityOutcomeLedger.windowAnchor.startEventSequence !== context.firstNightInitializationProvenance.eventSequence ||
        context.firstNightAbilityOutcomeLedger.windowAnchor.startBoundary !== "EXCLUSIVE" ||
        context.firstNightAbilityOutcomeLedger.windowAnchor.nightNumber !== 1 ||
        context.firstNight.rulesBaselineVersion !== context.firstNightInitializationProvenance.rulesBaselineVersion ||
        context.firstNightAbilityOutcomeLedger.facts.some((fact) =>
          fact.sourceEventSequence <= context.firstNightInitializationProvenance.eventSequence ||
          fact.sourceEventSequence > context.lastEventSequence || fact.detectedAtEventSequence !== fact.sourceEventSequence)) return false;

    if (!exactKeys(context.roster, ["rulesBaselineVersion", "rosterVersion", "entries"]) ||
        !validatePlayerRoster(context.roster.entries).valid ||
        !exactKeys(context.assignment, ["rulesBaselineVersion", "rosterVersion", "assignmentAlgorithmVersion", "randomAlgorithmVersion", "randomStream", "roleCatalogSignature", "assignments"]) ||
        !exactKeys(context.setup, ["rulesBaselineVersion", "scriptId", "setupAlgorithmVersion", "randomAlgorithmVersion", "randomStream", "roleCatalogVersion", "roleCatalogSnapshot", "roleCatalogSignature", "roleCatalogSignatureAlgorithm", "constraintsSnapshot", "preModifierCounts", "postModifierCounts", "actualRoles", "demonRole", "setupModifiersApplied", "demonBluffs", "validationSummary"]) ||
        !validateInitialKnowledgeSourceFacts({ roster: context.roster.entries, setup: context.setup, assignment: context.assignment.assignments }).valid ||
        !validateCharacterAssignments({ assignments: context.assignment.assignments, roster: context.roster.entries,
          actualRoles: context.setup.actualRoles, roleCatalogRoles: context.setup.roleCatalogSnapshot.roles }).valid ||
        !validateInitialOwnCharacterKnowledgePayload(context.initialPrivateKnowledge, {
          roster: context.roster.entries, setup: context.setup, assignment: context.assignment.assignments,
          rosterVersion: context.roster.rosterVersion, assignmentAlgorithmVersion: context.assignment.assignmentAlgorithmVersion,
          roleCatalogSignature: context.setup.roleCatalogSignature
        }).valid ||
        !validateCurrentCharacterStateSet({ currentCharacterState: context.currentCharacterState, roster: context.roster.entries, setup: context.setup }).valid) return false;

    if (context.firstNight.rulesBaselineVersion !== context.rulesBaselineVersion || context.setup.rulesBaselineVersion !== context.rulesBaselineVersion ||
        context.roster.rulesBaselineVersion !== context.rulesBaselineVersion || context.assignment.rulesBaselineVersion !== context.rulesBaselineVersion ||
        context.initialPrivateKnowledge.rulesBaselineVersion !== context.rulesBaselineVersion ||
        context.firstNight.rosterVersion !== context.roster.rosterVersion || context.assignment.rosterVersion !== context.roster.rosterVersion ||
        context.firstNight.assignmentAlgorithmVersion !== context.assignment.assignmentAlgorithmVersion ||
        context.firstNight.roleCatalogSignature !== context.setup.roleCatalogSignature ||
        !validateStoredPhilosopherChain(context) || !validateStoredInsertions(context) ||
        !validateStoredImpairments(context) || !validateRoleTenureStateInternal(context) ||
        !validateFirstNightActionOpportunityStateShape(context.firstNightActionOpportunities).valid ||
        !validateDreamerTargetChoiceSetV1V2(context.dreamerTargetChoices).valid ||
        !validateDreamerInformationSetV1V2(context.dreamerInformationDeliveries).valid ||
        !validateFirstNightAbilityOutcomeLedgerShape(context.firstNightAbilityOutcomeLedger).valid ||
        !validateFirstNightAbilityInstanceProvenanceShape(context.sourceAbilityInstance).valid ||
        !validateDreamerV2SourceContractShapeForInternalUse(context.sourceContract).valid ||
        !sameCanonicalDataValue(context.sourceAbilityInstance, context.sourceContract.abilityInstance)) return false;

    const planValidation = validateFirstNightTaskPlanRuntimeState(context.firstNightTaskPlan, {
      sourceFacts: { setup: context.setup, roster: context.roster.entries, assignment: context.assignment.assignments,
        firstNight: context.firstNight, initialPrivateKnowledge: context.initialPrivateKnowledge },
      insertedTasks: context.firstNightTaskInsertions.insertions.map(scheduledTaskFromFirstNightTaskInsertedPayload)
    });
    if (!planValidation.valid || !validateFirstNightTaskProgress(context.firstNightTaskPlan, context.firstNightTaskProgress).valid ||
        !validateDreamerV2CrossLinks(context)) return false;

    const tasks = context.firstNightTaskPlan.tasks.filter((task) => task.taskId === context.targetTask.taskId);
    const opportunities = context.firstNightActionOpportunities.opportunities.filter((entry) =>
      entry.opportunityId === context.resolutionBoundary.opportunityId && "opportunitySchemaVersion" in entry);
    const opportunity = opportunities[0] as DreamerActionOpportunityV2 | undefined;
    if (tasks.length !== 1 || !sameCanonicalDataValue(tasks[0], context.targetTask) || context.targetTask.taskType !== "DREAMER_ACTION" ||
        opportunities.length !== 1 || opportunity === undefined || opportunity.taskId !== context.targetTask.taskId ||
        !sameCanonicalDataValue(opportunity.sourceContract, context.sourceContract) ||
        !exactKeys(context.resolutionBoundary, ["boundaryVersion", "stage", "opportunityId", "targetPlayerId", "targetChoiceId", "deliveryId"]) ||
        context.resolutionBoundary.boundaryVersion !== "dreamer-resolution-boundary-v2" ||
        context.roster.entries.filter((entry) => entry.playerId === context.resolutionBoundary.targetPlayerId).length !== 1 ||
        context.resolutionBoundary.targetPlayerId === opportunity.sourcePlayerId) return false;
    const boundary = context.resolutionBoundary;
    const boundaryChoices = context.dreamerTargetChoices.choices.filter((entry) => "targetChoiceSchemaVersion" in entry &&
      entry.taskId === context.targetTask.taskId && entry.opportunityId === boundary.opportunityId);
    const boundaryDeliveries = context.dreamerInformationDeliveries.deliveries.filter((entry): entry is Extract<
      DreamerInformationSet["deliveries"][number], { readonly deliverySchemaVersion: string }
    > => "deliverySchemaVersion" in entry &&
      entry.taskId === context.targetTask.taskId && entry.opportunityId === boundary.opportunityId);
    if ((boundary.stage === "PRE_TARGET" && (boundary.targetChoiceId !== null || boundary.deliveryId !== null ||
          opportunity.opportunityStatus !== "OPEN" || boundaryChoices.length !== 0 || boundaryDeliveries.length !== 0)) ||
        (boundary.stage === "PRE_DELIVERY" && (boundary.targetChoiceId !== formatDreamerV2TargetChoiceId(context.targetTask.taskId) ||
          boundary.deliveryId !== null || opportunity.opportunityStatus !== "OPEN" || boundaryChoices.length !== 1 ||
          boundaryChoices[0]!.targetPlayerId !== boundary.targetPlayerId || boundaryDeliveries.length !== 0)) ||
        (boundary.stage === "PRE_SETTLEMENT" && (boundary.targetChoiceId !== formatDreamerV2TargetChoiceId(context.targetTask.taskId) ||
          boundary.deliveryId !== formatDreamerV2DeliveryId(context.targetTask.taskId) || opportunity.opportunityStatus !== "CLOSED" ||
          boundaryChoices.length !== 1 || boundaryChoices[0]!.targetPlayerId !== boundary.targetPlayerId ||
          boundaryDeliveries.length !== 1 || boundaryDeliveries[0]!.targetTruth.targetPlayerId !== boundary.targetPlayerId)) ||
        !["PRE_TARGET", "PRE_DELIVERY", "PRE_SETTLEMENT"].includes(boundary.stage)) return false;
    return true;
  } catch {
    return false;
  }
};

const fail = (message: string): never => {
  throw new DomainError("InvalidDreamerV2CanonicalContext", message);
};
const nonEmpty = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0 && value.trim() === value;
const activeTenure = (
  records: readonly RoleTenureRecord[],
  sourcePlayerId: PlayerId,
  roleId: "dreamer" | "philosopher" | "vortox",
  revision: number
): RoleTenureRecord => {
  const matches = records.filter((record) =>
    record.playerId === sourcePlayerId && record.roleId === roleId && isRoleTenureActiveAt(record, revision)
  );
  const match = matches[0];
  if (matches.length !== 1) fail("Dreamer V2 source requires one active canonical role tenure");
  return match ?? fail("Dreamer V2 source requires one active canonical role tenure");
};
const tenureSnapshot = (record: RoleTenureRecord) => ({
  roleTenureId: record.roleTenureId,
  playerId: record.playerId,
  seatNumber: record.seatNumber,
  roleId: record.roleId as RoleId,
  acquiredCharacterStateRevision: record.acquiredCharacterStateRevision,
  endedCharacterStateRevision: record.endedCharacterStateRevision ?? null,
  statusAtEvaluation: "ACTIVE" as const
});

export const resolveDreamerV2TargetTruthForInternalValidation = (input: {
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roster: PlayerRoster;
  readonly targetPlayerId: PlayerId;
}) => {
  const currentMatches = input.currentCharacterState.entries.filter((entry) => entry.playerId === input.targetPlayerId);
  const rosterMatches = input.roster.filter((entry) => entry.playerId === input.targetPlayerId);
  const current = currentMatches[0];
  const roster = rosterMatches[0];
  if (currentMatches.length !== 1 || rosterMatches.length !== 1 || current === undefined || roster === undefined ||
      current.seatNumber !== roster.seatNumber) {
    return fail("Dreamer V2 target truth requires one current player at the canonical roster seat");
  }
  return {
    targetPlayerId: current.playerId,
    targetSeatNumber: current.seatNumber,
    targetCharacterStateRevision: input.currentCharacterState.revision,
    targetTrueRole: structuredClone(current.role),
    targetNativeSide: current.role.defaultAlignment
  };
};

export const validateDreamerV2SourceContinuityForInternalValidation = (input: {
  readonly sourceContract: DreamerV2SourceContract;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roleTenures: RoleTenureState;
}): { readonly valid: true } => {
  const source = input.sourceContract;
  const currentMatches = input.currentCharacterState.entries.filter((entry) =>
    entry.playerId === source.sourcePlayerId && entry.seatNumber === source.sourceSeatNumber
  );
  const current = currentMatches[0];
  if (currentMatches.length !== 1 || current === undefined || !sameRoleSetupSnapshot(current.role, source.sourceRole)) {
    return fail("Dreamer V2 source role or seat continuity is invalid");
  }
  const tenureMatches = input.roleTenures.records.filter((record) =>
    record.roleTenureId === source.sourceRoleTenure.roleTenureId &&
    record.playerId === source.sourcePlayerId &&
    record.seatNumber === source.sourceSeatNumber &&
    record.roleId === source.sourceRole.roleId
  );
  const tenure = tenureMatches[0];
  if (tenureMatches.length !== 1 || tenure === undefined ||
      tenure.acquiredCharacterStateRevision !== source.sourceRoleTenure.acquiredCharacterStateRevision ||
      (tenure.endedCharacterStateRevision ?? null) !== source.sourceRoleTenure.endedCharacterStateRevision ||
      !isRoleTenureContinuousAcross(
        tenure,
        source.opportunityCharacterStateRevision,
        input.currentCharacterState.revision
      )) {
    return fail("Dreamer V2 source tenure continuity is invalid");
  }
  return { valid: true };
};

export const resolveDreamerV2SourceEffectivenessForInternalValidation = (input: {
  readonly sourceContract: DreamerV2SourceContract;
  readonly abilityImpairments: AbilityImpairmentSet;
}): DreamerV2SourceEffectiveness => {
  const source = input.sourceContract;
  const represented = input.abilityImpairments.impairments.filter((entry) =>
    entry.affectedPlayerId === source.sourcePlayerId &&
    entry.affectedSeatNumber === source.sourceSeatNumber &&
    entry.affectedRole.roleId === source.sourceRole.roleId
  );
  if (represented.length > 1) return fail("Dreamer V2 source has multiple applicable impairments");
  const impairment = represented[0];
  if (impairment === undefined) return { kind: "EFFECTIVE", representedImpairments: [] };
  return {
    kind: impairment.kind === "DRUNK" ? "KNOWN_DRUNK" : "KNOWN_POISONED",
    representedImpairments: [{
      impairmentId: impairment.impairmentId,
      impairmentKind: impairment.kind,
      sourceKind: impairment.sourceKind,
      sourcePlayerId: impairment.sourcePlayerId,
      affectedPlayerId: impairment.affectedPlayerId,
      affectedSeatNumber: impairment.affectedSeatNumber,
      affectedRoleId: impairment.affectedRole.roleId,
      affectedRole: structuredClone(impairment.affectedRole),
      appliedCharacterStateRevision: impairment.sourceCharacterStateRevision
    }]
  };
};

const buildSourceContract = (
  state: GameState,
  task: ScheduledTask,
  opportunity: Pick<DreamerActionOpportunityV2,"sourcePlayerId"|"sourceSeatNumber"|"sourceCharacterStateRevision">
): DreamerV2SourceContract => {
  const revision = state.currentCharacterState!.revision;
  if (task.source.kind === "ROLE") {
    if (task.source.role.roleId !== "dreamer" || task.source.playerId !== opportunity.sourcePlayerId ||
        task.source.seatNumber !== opportunity.sourceSeatNumber) fail("Dreamer V2 base task source is invalid");
    const tenure = activeTenure(state.seamstressRoleTenureState!.records, task.source.playerId, "dreamer", revision);
    if (!isRoleTenureContinuousAcross(tenure, opportunity.sourceCharacterStateRevision, revision)) {
      fail("Dreamer V2 base source tenure is discontinuous");
    }
    const abilityInstance: Extract<FirstNightAbilityInstanceProvenance, { readonly kind: "BASE_ROLE_TASK" }> = {
      provenanceVersion: "first-night-ability-instance-provenance-v1",
      kind: "BASE_ROLE_TASK",
      abilityInstanceId: formatBaseFirstNightAbilityInstanceId(task.taskId),
      abilityRoleId: task.source.role.roleId,
      taskId: task.taskId,
      sourcePlayerId: task.source.playerId,
      sourceSeatNumber: task.source.seatNumber
    };
    const result: BaseDreamerV2SourceContract = {
      sourceContractVersion: DREAMER_V2_SOURCE_CONTRACT_VERSION,
      kind: "BASE_DREAMER_V2",
      taskPlanVersion: "first-night-task-plan-v2",
      taskId: task.taskId,
      taskType: "DREAMER_ACTION",
      sourcePlayerId: task.source.playerId,
      sourceSeatNumber: task.source.seatNumber,
      sourceRole: structuredClone(task.source.role),
      abilityRole: structuredClone(task.source.role),
      sourceRoleTenure: tenureSnapshot(tenure),
      opportunityCharacterStateRevision: opportunity.sourceCharacterStateRevision,
      abilityInstance
    };
    return result;
  }
  return fail("Dreamer V2 supports base role tasks only");
};

export const createDreamerV2ActionOpportunityForInternalApplication=(state:GameState,taskId:ScheduledTaskId):DreamerActionOpportunityV2=>{
  if(state.firstNightTaskPlan?.taskPlanVersion!=="first-night-task-plan-v2"||state.currentCharacterState===undefined||state.seamstressRoleTenureState===undefined)return fail("Dreamer V2 opportunity requires V2 plan, current state, and role tenure state");
  const tasks=state.firstNightTaskPlan.tasks.filter((entry)=>entry.taskId===taskId);const task=tasks[0];if(tasks.length!==1||task===undefined||task.taskType!=="DREAMER_ACTION"||task.source.kind!=="ROLE")return fail("Dreamer V2 opportunity requires one canonical base Dreamer task");
  const sourcePlayerId=task.source.playerId;const sourceSeatNumber=task.source.seatNumber;const sourceRole=task.source.role;
  const current=state.currentCharacterState.entries.filter((entry)=>entry.playerId===sourcePlayerId&&entry.seatNumber===sourceSeatNumber);if(current.length!==1||current[0]?.role.roleId!==sourceRole.roleId)return fail("Dreamer V2 opportunity source is not current");
  const opportunityId=formatBaseDreamerV2ActionOpportunityId({seatNumber:sourceSeatNumber});
  const stub={sourcePlayerId,sourceSeatNumber,sourceCharacterStateRevision:state.currentCharacterState.revision};const sourceContract=buildSourceContract(state,task,stub);
  validateDreamerV2SourceContinuityForInternalValidation({sourceContract,currentCharacterState:state.currentCharacterState,roleTenures:state.seamstressRoleTenureState});
  return {opportunitySchemaVersion:"dreamer-first-night-action-v2",nightNumber:1,opportunityId,opportunityKind:"DREAMER_FIRST_NIGHT_ACTION",opportunityStatus:"OPEN",taskId:task.taskId,taskType:"DREAMER_ACTION",sourcePlayerId,sourceSeatNumber,sourceRole:structuredClone(sourceRole),sourceCharacterStateRevision:state.currentCharacterState.revision,sourceContract,visibility:{visibilitySchemaVersion:"dreamer-first-night-action-v2",resolutionCapabilityVersion:"dreamer-first-night-resolution-capability-v2",canChooseTarget:true,supportedDecisionKinds:["CHOOSE_PLAYER"],targetSchema:"OTHER_NON_TRAVELLER_MODELED_PLAYER"}};
};

type CanonicalDreamerV2ContextClone = (value: CanonicalDreamerV2ContextData) => unknown;

const buildCanonicalDreamerV2ContextFromStateUsingClone = (
  state: GameState,
  taskId: ScheduledTaskId,
  boundary: DreamerV2ResolutionBoundary,
  cloneCanonicalContext: CanonicalDreamerV2ContextClone
): CanonicalDreamerV2Context => {
  if (!isCanonicalDataValue(state) || Object.keys(state).some((key) => !GAME_STATE_KEYS.has(key)) ||
      !isCanonicalDataValue(boundary)) {
    return fail("Dreamer V2 canonical context inputs must be recursively canonical data");
  }
  if (!nonEmpty(state.gameId) || !nonEmpty(state.rulesBaselineVersion) ||
      state.phase !== "FIRST_NIGHT" || state.dayNumber !== 0 || state.nightNumber !== 1 ||
      state.firstNight === undefined || state.firstNightInitializationProvenance === undefined ||
      state.initialPrivateKnowledge === undefined || state.setup === undefined || state.roster === undefined ||
      state.assignment === undefined || state.currentCharacterState === undefined ||
      state.firstNightTaskPlan === undefined || state.firstNightAbilityOutcomeLedger === undefined) {
    return fail("Dreamer V2 canonical context requires complete first-night source facts");
  }
  if (state.firstNightTaskPlan.taskPlanVersion !== "first-night-task-plan-v2") {
    return fail("Dreamer V2 canonical context requires a V2 task plan");
  }
  const progress = state.firstNightTaskProgress ?? { settlements: [] };
  const insertions = state.firstNightTaskInsertions ?? { insertions: [] };
  const choices = state.philosopherAbilityChoices ?? { choices: [] };
  const grants = state.philosopherGrantedAbilities ?? { abilities: [] };
  const opportunities = state.firstNightActionOpportunities ?? { opportunities: [] };
  const impairments = state.abilityImpairments ?? { impairments: [] };
  const roleTenures = state.seamstressRoleTenureState ?? { records: [], processedTransitionFactIds: [] };
  const snakeCharmerDemonSwaps = state.snakeCharmerDemonSwaps ?? { swaps: [] };
  const targetChoices = state.dreamerTargetChoices ?? { choices: [] };
  const deliveries = state.dreamerInformation ?? { deliveries: [] };
  const impairmentProvenance = state.mathematicianImpairmentEventProvenance ?? { entries: [] };
  const targetTask = state.firstNightTaskPlan.tasks.find((task) => task.taskId === taskId);
  if (targetTask === undefined || targetTask.taskType !== "DREAMER_ACTION") return fail("Dreamer V2 target task is absent or invalid");
  const opportunity = opportunities.opportunities.find((entry) => entry.opportunityId === boundary.opportunityId) as
    DreamerActionOpportunityV2 | undefined;
  if (opportunity === undefined || !("opportunitySchemaVersion" in opportunity) ||
      opportunity.opportunitySchemaVersion !== "dreamer-first-night-action-v2" ||
      opportunity.taskId !== taskId || opportunity.sourcePlayerId === boundary.targetPlayerId) {
    return fail("Dreamer V2 resolution boundary does not reference one canonical V2 opportunity");
  }
  if (boundary.boundaryVersion !== "dreamer-resolution-boundary-v2" ||
      (boundary.stage === "PRE_TARGET" && (boundary.targetChoiceId !== null || boundary.deliveryId !== null)) ||
      (boundary.stage === "PRE_DELIVERY" && (boundary.targetChoiceId === null || boundary.deliveryId !== null)) ||
      (boundary.stage === "PRE_SETTLEMENT" && (boundary.targetChoiceId === null || boundary.deliveryId === null))) {
    return fail("Dreamer V2 resolution boundary is invalid");
  }
  const matchingChoices=targetChoices.choices.filter((entry)=>"targetChoiceSchemaVersion" in entry&&entry.targetChoiceId===boundary.targetChoiceId&&entry.taskId===taskId&&entry.opportunityId===boundary.opportunityId&&entry.targetPlayerId===boundary.targetPlayerId);
  const matchingDeliveries=deliveries.deliveries.filter((entry)=>"deliverySchemaVersion" in entry&&entry.deliveryId===boundary.deliveryId&&entry.targetChoiceId===boundary.targetChoiceId&&entry.taskId===taskId&&entry.opportunityId===boundary.opportunityId&&entry.targetTruth.targetPlayerId===boundary.targetPlayerId);
  if(boundary.stage==="PRE_TARGET"&&(opportunity.opportunityStatus!=="OPEN"||matchingChoices.length!==0||matchingDeliveries.length!==0))return fail("PRE_TARGET requires one open opportunity and no V2 target or delivery");
  if(boundary.stage==="PRE_DELIVERY"&&(opportunity.opportunityStatus!=="OPEN"||matchingChoices.length!==1||matchingDeliveries.length!==0))return fail("PRE_DELIVERY requires one exact target and no delivery");
  if(boundary.stage==="PRE_SETTLEMENT"&&(opportunity.opportunityStatus!=="CLOSED"||matchingChoices.length!==1||matchingDeliveries.length!==1))return fail("PRE_SETTLEMENT requires one exact target and delivery");
  const planValidation = validateFirstNightTaskPlanRuntimeState(state.firstNightTaskPlan, {
    sourceFacts: {
      setup: state.setup,
      roster: state.roster.entries,
      assignment: state.assignment.assignments,
      firstNight: state.firstNight,
      initialPrivateKnowledge: state.initialPrivateKnowledge
    },
    insertedTasks: insertions.insertions.map(scheduledTaskFromFirstNightTaskInsertedPayload)
  });
  if (!planValidation.valid) return fail(planValidation.reason);
  if (!validateFirstNightAbilityOutcomeLedgerShape(state.firstNightAbilityOutcomeLedger).valid) {
    return fail("Dreamer V2 canonical context has an invalid outcome ledger");
  }
  const sourceContract = opportunity.sourceContract;
  validateDreamerV2SourceContinuityForInternalValidation({
    sourceContract,
    currentCharacterState: state.currentCharacterState,
    roleTenures
  });
  const plain = {
    contextVersion: DREAMER_V2_CANONICAL_CONTEXT_VERSION,
    gameId: state.gameId,
    rulesBaselineVersion: state.rulesBaselineVersion,
    gameVersion: state.gameVersion,
    lastEventSequence: state.lastEventSequence,
    phase: "FIRST_NIGHT" as const,
    dayNumber: 0 as const,
    nightNumber: 1 as const,
    firstNight: state.firstNight,
    firstNightInitializationProvenance: state.firstNightInitializationProvenance,
    initialPrivateKnowledge: state.initialPrivateKnowledge,
    setup: state.setup,
    roster: state.roster,
    assignment: state.assignment,
    currentCharacterState: state.currentCharacterState,
    firstNightTaskPlan: state.firstNightTaskPlan,
    firstNightTaskProgress: progress,
    firstNightTaskInsertions: insertions,
    philosopherAbilityChoices: choices,
    philosopherGrantedAbilities: grants,
    firstNightActionOpportunities: opportunities,
    abilityImpairments: impairments,
    impairmentEventProvenance: impairmentProvenance,
    roleTenures,
    snakeCharmerDemonSwaps,
    dreamerTargetChoices: targetChoices,
    dreamerInformationDeliveries: deliveries,
    firstNightAbilityOutcomeLedger: state.firstNightAbilityOutcomeLedger,
    targetTask,
    sourceContract,
    sourceAbilityInstance: sourceContract.abilityInstance,
    resolutionBoundary: boundary
  };
  if (!validateCanonicalDreamerV2ContextInternal(plain)) return fail("Dreamer V2 canonical context validation failed before cloning");
  const cloned = cloneCanonicalContext(plain);
  if (!validateCanonicalDreamerV2ContextInternal(cloned)) return fail("Dreamer V2 canonical context validation failed after cloning");
  const plainReferences = new Set<object>();
  const stateReferences = new Set<object>();
  const cloneReferences = new Set<object>();
  collectObjectReferences(plain, plainReferences);
  collectObjectReferences(state, stateReferences);
  collectObjectReferences(boundary, stateReferences);
  collectObjectReferences(cloned, cloneReferences);
  if ([...plainReferences].some((reference) => cloneReferences.has(reference)) ||
      [...stateReferences].some((reference) => cloneReferences.has(reference))) {
    return fail("Dreamer V2 canonical context clone shares mutable identity with its plain or state input");
  }
  const branded = cloned as CanonicalDreamerV2Context;
  Object.defineProperty(branded, canonicalDreamerV2ContextBrand, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false
  });
  return branded;
};

const buildCanonicalDreamerV2ContextFromState = (
  state: GameState,
  taskId: ScheduledTaskId,
  boundary: DreamerV2ResolutionBoundary
): CanonicalDreamerV2Context =>
  buildCanonicalDreamerV2ContextFromStateUsingClone(state, taskId, boundary, (plain) => structuredClone(plain));

export type DreamerV2PipelineStateFingerprint = {
  readonly fingerprintVersion: typeof DREAMER_V2_PIPELINE_FINGERPRINT_VERSION;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly phase: GamePhase;
  readonly dayNumber: number;
  readonly nightNumber: number;
  readonly firstNight: FirstNightInitializedPayload;
  readonly firstNightInitializationProvenance: FirstNightInitializationEnvelopeProvenance;
  readonly initialPrivateKnowledgeFingerprint: InitialPrivateKnowledgeEstablishedPayload;
  readonly setupFingerprint: SetupGeneratedPayload;
  readonly rosterFingerprint: PlayerRosterCreatedPayload;
  readonly assignmentFingerprint: CharactersAssignedPayload;
  readonly currentCharacterStateFingerprint: CurrentCharacterStateSet;
  readonly taskPlanFingerprint: FirstNightTaskPlanCreatedPayload;
  readonly taskProgressFingerprint: FirstNightTaskProgress;
  readonly insertionFingerprint: FirstNightTaskInsertion;
  readonly philosopherChoiceFingerprint: PhilosopherAbilityChoiceSet;
  readonly philosopherGrantFingerprint: GrantedAbilitySet;
  readonly actionOpportunityFingerprint: FirstNightActionOpportunityState;
  readonly impairmentFingerprint: AbilityImpairmentSet;
  readonly impairmentEventProvenanceFingerprint: MathematicianImpairmentEventProvenanceState;
  readonly roleTenureFingerprint: RoleTenureState;
  readonly dreamerChoiceFingerprint: DreamerTargetChoiceSet;
  readonly dreamerDeliveryFingerprint: DreamerInformationSet;
  readonly ledgerFingerprint: FirstNightAbilityOutcomeLedger;
  readonly targetTaskFingerprint: ScheduledTask;
  readonly nextTaskFingerprint: ScheduledTask | null;
  readonly sourceContractFingerprint: DreamerV2SourceContract;
  readonly sourceAbilityInstanceFingerprint: FirstNightAbilityInstanceProvenance;
  readonly resolutionBoundaryFingerprint: DreamerV2ResolutionBoundary;
};

const buildDreamerV2PipelineStateFingerprint = (
  context: CanonicalDreamerV2Context
): DreamerV2PipelineStateFingerprint => ({
  fingerprintVersion: DREAMER_V2_PIPELINE_FINGERPRINT_VERSION,
  gameId: context.gameId,
  rulesBaselineVersion: context.rulesBaselineVersion,
  gameVersion: context.gameVersion,
  lastEventSequence: context.lastEventSequence,
  phase: context.phase,
  dayNumber: context.dayNumber,
  nightNumber: context.nightNumber,
  firstNight: structuredClone(context.firstNight),
  firstNightInitializationProvenance: structuredClone(context.firstNightInitializationProvenance),
  initialPrivateKnowledgeFingerprint: structuredClone(context.initialPrivateKnowledge),
  setupFingerprint: structuredClone(context.setup),
  rosterFingerprint: structuredClone(context.roster),
  assignmentFingerprint: structuredClone(context.assignment),
  currentCharacterStateFingerprint: structuredClone(context.currentCharacterState),
  taskPlanFingerprint: structuredClone(context.firstNightTaskPlan),
  taskProgressFingerprint: structuredClone(context.firstNightTaskProgress),
  insertionFingerprint: structuredClone(context.firstNightTaskInsertions),
  philosopherChoiceFingerprint: structuredClone(context.philosopherAbilityChoices),
  philosopherGrantFingerprint: structuredClone(context.philosopherGrantedAbilities),
  actionOpportunityFingerprint: structuredClone(context.firstNightActionOpportunities),
  impairmentFingerprint: structuredClone(context.abilityImpairments),
  impairmentEventProvenanceFingerprint: structuredClone(context.impairmentEventProvenance),
  roleTenureFingerprint: structuredClone(context.roleTenures),
  dreamerChoiceFingerprint: structuredClone(context.dreamerTargetChoices),
  dreamerDeliveryFingerprint: structuredClone(context.dreamerInformationDeliveries),
  ledgerFingerprint: structuredClone(context.firstNightAbilityOutcomeLedger),
  targetTaskFingerprint: structuredClone(context.targetTask),
  nextTaskFingerprint: structuredClone(getNextUnsettledFirstNightTask(context.firstNightTaskPlan, context.firstNightTaskProgress) ?? null),
  sourceContractFingerprint: structuredClone(context.sourceContract),
  sourceAbilityInstanceFingerprint: structuredClone(context.sourceAbilityInstance),
  resolutionBoundaryFingerprint: structuredClone(context.resolutionBoundary)
});

export type CaptureDreamerV2PipelineFingerprintInput = {
  readonly state: GameState;
  readonly taskId: ScheduledTaskId;
  readonly boundary: DreamerV2ResolutionBoundary;
};
export const captureDreamerV2PipelineFingerprintForInternalApplication = (
  input: CaptureDreamerV2PipelineFingerprintInput
): DreamerV2PipelineStateFingerprint =>
  buildDreamerV2PipelineStateFingerprint(buildCanonicalDreamerV2ContextFromState(input.state, input.taskId, input.boundary));

export type DreamerV2CanonicalCaptureInspection = {
  readonly contextStringKeys: readonly string[];
  readonly contextSymbolCount: number;
  readonly brandDescriptor: {
    readonly value: unknown;
    readonly enumerable: boolean | undefined;
    readonly configurable: boolean | undefined;
    readonly writable: boolean | undefined;
  };
  readonly sharesNestedReferenceWithState: boolean;
  readonly fingerprintSymbolCount: number;
  readonly fingerprintStringKeys: readonly string[];
};

export const inspectDreamerV2CanonicalCaptureForInternalValidation = (
  input: CaptureDreamerV2PipelineFingerprintInput
): DreamerV2CanonicalCaptureInspection => {
  const context = buildCanonicalDreamerV2ContextFromState(input.state, input.taskId, input.boundary);
  const symbols = Object.getOwnPropertySymbols(context);
  const descriptor = symbols[0] === undefined ? undefined : Object.getOwnPropertyDescriptor(context, symbols[0]);
  const contextReferences = new Set<object>();
  const stateReferences = new Set<object>();
  collectObjectReferences(context, contextReferences);
  collectObjectReferences(input.state, stateReferences);
  collectObjectReferences(input.boundary, stateReferences);
  const fingerprint = buildDreamerV2PipelineStateFingerprint(context);
  return {
    contextStringKeys: Object.keys(context),
    contextSymbolCount: symbols.length,
    brandDescriptor: {
      value: descriptor !== undefined && "value" in descriptor ? descriptor.value : undefined,
      enumerable: descriptor?.enumerable,
      configurable: descriptor?.configurable,
      writable: descriptor !== undefined && "writable" in descriptor ? descriptor.writable : undefined
    },
    sharesNestedReferenceWithState: [...contextReferences].some((reference) => stateReferences.has(reference)),
    fingerprintSymbolCount: Object.getOwnPropertySymbols(fingerprint).length,
    fingerprintStringKeys: Object.keys(fingerprint)
  };
};

export const probeDreamerV2PostCloneRevalidationFailureForInternalValidation = (
  input: CaptureDreamerV2PipelineFingerprintInput
): { readonly rejected: boolean; readonly brandAppliedToRejectedClone: boolean } => {
  let rejectedClone: object | undefined;
  try {
    buildCanonicalDreamerV2ContextFromStateUsingClone(input.state, input.taskId, input.boundary, (plain) => {
      const clone = structuredClone(plain) as Record<string, unknown>;
      clone.unexpectedPostCloneField = true;
      rejectedClone = clone;
      return clone;
    });
    return { rejected: false, brandAppliedToRejectedClone: false };
  } catch {
    return {
      rejected: true,
      brandAppliedToRejectedClone: rejectedClone !== undefined && Object.getOwnPropertySymbols(rejectedClone).length > 0
    };
  }
};

export const sameDreamerV2PipelineStateFingerprint = (
  left: DreamerV2PipelineStateFingerprint,
  right: DreamerV2PipelineStateFingerprint
): boolean => sameCanonicalDataValue(left, right);

export const resolveDreamerV2VortoxConstraintForInternalValidation = (input: {
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roleTenures: RoleTenureState;
  readonly abilityImpairments: AbilityImpairmentSet;
}): DreamerV2VortoxConstraint => {
  const currentVortox = input.currentCharacterState.entries.filter((entry) => entry.role.roleId === "vortox");
  if (currentVortox.length === 0) return {
    kind: "NONE_NO_CURRENT_VORTOX",
    evaluatedCharacterStateRevision: input.currentCharacterState.revision,
    aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT"
  };
  if (currentVortox.length !== 1 || currentVortox[0] === undefined) {
    throw new DomainError("VortoxIdentityNotUnique", "Dreamer V2 requires zero or one current Vortox");
  }
  const entry = currentVortox[0];
  const tenure = activeTenure(input.roleTenures.records, entry.playerId, "vortox", input.currentCharacterState.revision);
  if (tenure.roleId !== "vortox") throw new DomainError("VortoxTenureMissingOrInconsistent", "Dreamer V2 Vortox tenure is unavailable");
  const applicable = input.abilityImpairments.impairments.filter((impairment) =>
    impairment.affectedPlayerId === entry.playerId && impairment.affectedRole.roleId === "vortox" &&
    impairment.sourceCharacterStateRevision <= input.currentCharacterState.revision
  );
  if (applicable.length > 1) throw new DomainError("VortoxEffectivenessConflict", "Dreamer V2 Vortox has conflicting impairments");
  const snapshot = tenureSnapshot(tenure);
  if (applicable[0] !== undefined) {
    const impairment = applicable[0];
    return {
      kind: "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED",
      evaluatedCharacterStateRevision: input.currentCharacterState.revision,
      aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT",
      vortoxPlayerId: entry.playerId,
      vortoxSeatNumber: entry.seatNumber,
      vortoxRoleSnapshot: structuredClone(entry.role),
      vortoxRoleTenure: snapshot,
      representedImpairments: [{
        impairmentId: impairment.impairmentId,
        impairmentKind: impairment.kind,
        sourceKind: impairment.sourceKind,
        sourcePlayerId: impairment.sourcePlayerId,
        affectedPlayerId: impairment.affectedPlayerId,
        affectedSeatNumber: impairment.affectedSeatNumber,
        affectedRoleId: impairment.affectedRole.roleId,
        affectedRole: structuredClone(impairment.affectedRole),
        appliedCharacterStateRevision: impairment.sourceCharacterStateRevision
      }]
    };
  }
  return {
    kind: "VORTOX_FALSE_REQUIRED",
    evaluatedCharacterStateRevision: input.currentCharacterState.revision,
    aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT",
    vortoxPlayerId: entry.playerId,
    vortoxSeatNumber: entry.seatNumber,
    vortoxRoleSnapshot: structuredClone(entry.role),
    vortoxRoleTenure: snapshot
  };
};
