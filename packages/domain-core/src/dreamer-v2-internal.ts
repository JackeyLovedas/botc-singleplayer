import { sameCanonicalDataValue } from "./canonical-data.js";
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
  formatPhilosopherGainedV2AbilityInstanceId,
  validateFirstNightAbilityOutcomeLedgerShape
} from "./first-night-ability-outcome-ledger.js";
import type {
  FirstNightAbilityInstanceProvenance,
  FirstNightAbilityOutcomeLedger,
  FirstNightInitializationEnvelopeProvenance
} from "./first-night-ability-outcome-ledger.js";
import { getNextUnsettledFirstNightTask, validateFirstNightTaskPlanRuntimeState } from "./first-night-task-plan.js";
import type { FirstNightTaskProgress, ScheduledTask } from "./first-night-task-plan.js";
import type { GameState } from "./game-state.js";
import type { GameId, PlayerId, RoleId, ScheduledTaskId } from "./ids.js";
import type { GamePhase } from "./game-phase.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import type { PlayerRoster } from "./player-roster.js";
import type { FirstNightActionOpportunityState } from "./first-night-action-opportunity.js";
import { formatBaseDreamerV2ActionOpportunityId, formatPhilosopherGainedDreamerV2ActionOpportunityId } from "./first-night-action-opportunity.js";
import type {
  AbilityImpairmentSet,
  FirstNightTaskInsertedV2Payload,
  FirstNightTaskInsertion,
  GrantedAbilitySet,
  PhilosopherAbilityChoiceSet
} from "./philosopher-ability.js";
import { scheduledTaskFromFirstNightTaskInsertedPayload } from "./philosopher-ability.js";
import type { MathematicianImpairmentEventProvenanceState } from "./mathematician.js";
import { cloneRoleTenureState, isRoleTenureActiveAt, isRoleTenureContinuousAcross } from "./seamstress.js";
import type { RoleTenureRecord, RoleTenureState } from "./seamstress.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";
import {
  DREAMER_V2_CANONICAL_CONTEXT_VERSION,
  DREAMER_V2_GAINED_ENTITLEMENT_VERSION,
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
  DreamerV2VortoxConstraint,
  PhilosopherGainedDreamerV2SourceContract
} from "./dreamer-v2.js";
import type { DreamerV2SourceEffectiveness } from "./dreamer-v2.js";

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
  readonly dreamerTargetChoices: DreamerTargetChoiceSet;
  readonly dreamerInformationDeliveries: DreamerInformationSet;
  readonly firstNightAbilityOutcomeLedger: FirstNightAbilityOutcomeLedger;
  readonly targetTask: ScheduledTask;
  readonly sourceContract: DreamerV2SourceContract;
  readonly sourceAbilityInstance: FirstNightAbilityInstanceProvenance;
  readonly resolutionBoundary: DreamerV2ResolutionBoundary;
  readonly [canonicalDreamerV2ContextBrand]: true;
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
  if (task.source.kind !== "PHILOSOPHER_GAINED_ABILITY" || task.source.chosenRole.roleId !== "dreamer") {
    return fail("Dreamer V2 task source must be base Dreamer or Philosopher-gained Dreamer");
  }
  const insertionCandidate = state.firstNightTaskInsertions!.insertions.find((entry) =>
    entry.taskId === task.taskId && "schedulingVersion" in entry
  );
  if (insertionCandidate === undefined || !("grantId" in insertionCandidate)) fail("Dreamer V2 gained source requires its V2 insertion");
  const insertion = insertionCandidate as FirstNightTaskInsertedV2Payload;
  const grant = state.philosopherGrantedAbilities!.abilities.find((entry) => entry.grantId === insertion.grantId);
  const choice = state.philosopherAbilityChoices!.choices.find((entry) =>
    entry.opportunityId === insertion.philosopherOpportunityId
  );
  const originalOpportunity = state.firstNightActionOpportunities!.opportunities.find((entry) =>
    entry.opportunityId === insertion.philosopherOpportunityId
  );
  if (grant === undefined || choice === undefined || originalOpportunity === undefined ||
      originalOpportunity.opportunityKind !== "PHILOSOPHER_FIRST_NIGHT_ACTION" ||
      originalOpportunity.opportunityStatus !== "CLOSED") fail("Dreamer V2 gained source chain is incomplete");
  const requiredChoice = choice ?? fail("Dreamer V2 gained source choice is unavailable");
  const tenure = activeTenure(state.seamstressRoleTenureState!.records, insertion.sourcePlayerId, "philosopher", revision);
  if (!isRoleTenureContinuousAcross(tenure, opportunity.sourceCharacterStateRevision, revision)) {
    fail("Dreamer V2 gained source tenure is discontinuous");
  }
  const abilityInstance: Extract<FirstNightAbilityInstanceProvenance, { readonly kind: "PHILOSOPHER_GAINED_TASK_V2" }> = {
    provenanceVersion: "first-night-ability-instance-provenance-v1",
    kind: "PHILOSOPHER_GAINED_TASK_V2",
    abilityInstanceId: formatPhilosopherGainedV2AbilityInstanceId({ taskId: task.taskId, grantId: insertion.grantId }),
    abilityRoleId: insertion.chosenRole.roleId,
    taskId: task.taskId,
    sourcePlayerId: insertion.sourcePlayerId,
    sourceSeatNumber: insertion.sourceSeatNumber,
    philosopherOpportunityId: insertion.philosopherOpportunityId,
    grantId: insertion.grantId,
    sourceCharacterStateRevision: insertion.sourceCharacterStateRevision,
    schedulingVersion: insertion.schedulingVersion
  };
  const result: PhilosopherGainedDreamerV2SourceContract = {
    sourceContractVersion: DREAMER_V2_SOURCE_CONTRACT_VERSION,
    kind: "PHILOSOPHER_GAINED_DREAMER_V2",
    taskPlanVersion: "first-night-task-plan-v2",
    schedulingVersion: insertion.schedulingVersion,
    taskId: task.taskId,
    taskType: "DREAMER_ACTION",
    sourcePlayerId: insertion.sourcePlayerId,
    sourceSeatNumber: insertion.sourceSeatNumber,
    sourceRole: structuredClone(insertion.sourceRole),
    abilityRole: structuredClone(insertion.chosenRole),
    sourceRoleTenure: tenureSnapshot(tenure),
    opportunityCharacterStateRevision: opportunity.sourceCharacterStateRevision,
    gainedEntitlement: {
      entitlementVersion: DREAMER_V2_GAINED_ENTITLEMENT_VERSION,
      taskPlanVersion: "first-night-task-plan-v2",
      schedulingVersion: insertion.schedulingVersion,
      insertedTaskId: insertion.taskId,
      insertedTaskType: "DREAMER_ACTION",
      philosopherTaskId: requiredChoice.taskId,
      philosopherOpportunityId: insertion.philosopherOpportunityId,
      grantId: insertion.grantId,
      sourcePlayerId: insertion.sourcePlayerId,
      sourceSeatNumber: insertion.sourceSeatNumber,
      sourceCharacterStateRevision: insertion.sourceCharacterStateRevision,
      sourceRole: structuredClone(insertion.sourceRole),
      chosenRole: structuredClone(insertion.chosenRole),
      originalOpportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION",
      originalOpportunityStatus: "CLOSED",
      insertionEventType: "FirstNightTaskInsertedV2"
    },
    abilityInstance
  };
  return result;
};

export const createDreamerV2ActionOpportunityForInternalApplication=(state:GameState,taskId:ScheduledTaskId):DreamerActionOpportunityV2=>{
  if(state.firstNightTaskPlan?.taskPlanVersion!=="first-night-task-plan-v2"||state.currentCharacterState===undefined||state.seamstressRoleTenureState===undefined)return fail("Dreamer V2 opportunity requires V2 plan, current state, and role tenure state");
  const tasks=state.firstNightTaskPlan.tasks.filter((entry)=>entry.taskId===taskId);const task=tasks[0];if(tasks.length!==1||task===undefined||task.taskType!=="DREAMER_ACTION"||task.source.kind==="SYSTEM")return fail("Dreamer V2 opportunity requires one canonical Dreamer task");
  const sourcePlayerId=task.source.playerId;const sourceSeatNumber=task.source.seatNumber;const sourceRole=task.source.kind==="ROLE"?task.source.role:task.source.sourceRole;
  const current=state.currentCharacterState.entries.filter((entry)=>entry.playerId===sourcePlayerId&&entry.seatNumber===sourceSeatNumber);if(current.length!==1||current[0]?.role.roleId!==sourceRole.roleId)return fail("Dreamer V2 opportunity source is not current");
  const opportunityId=task.source.kind==="ROLE"?formatBaseDreamerV2ActionOpportunityId({seatNumber:sourceSeatNumber}):formatPhilosopherGainedDreamerV2ActionOpportunityId({seatNumber:sourceSeatNumber});
  const stub={sourcePlayerId,sourceSeatNumber,sourceCharacterStateRevision:state.currentCharacterState.revision};const sourceContract=buildSourceContract(state,task,stub);
  validateDreamerV2SourceContinuityForInternalValidation({sourceContract,currentCharacterState:state.currentCharacterState,roleTenures:state.seamstressRoleTenureState});
  return {opportunitySchemaVersion:"dreamer-first-night-action-v2",nightNumber:1,opportunityId,opportunityKind:"DREAMER_FIRST_NIGHT_ACTION",opportunityStatus:"OPEN",taskId:task.taskId,taskType:"DREAMER_ACTION",sourcePlayerId,sourceSeatNumber,sourceRole:structuredClone(sourceRole),sourceCharacterStateRevision:state.currentCharacterState.revision,sourceContract,visibility:{visibilitySchemaVersion:"dreamer-first-night-action-v2",resolutionCapabilityVersion:"dreamer-first-night-resolution-capability-v2",canChooseTarget:true,supportedDecisionKinds:["CHOOSE_PLAYER"],targetSchema:"OTHER_NON_TRAVELLER_MODELED_PLAYER"}};
};

const buildCanonicalDreamerV2ContextFromState = (
  state: GameState,
  taskId: ScheduledTaskId,
  boundary: DreamerV2ResolutionBoundary
): CanonicalDreamerV2Context => {
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
  const sourceContract = buildSourceContract({ ...state, firstNightTaskProgress: progress, firstNightTaskInsertions: insertions,
    philosopherAbilityChoices: choices, philosopherGrantedAbilities: grants, firstNightActionOpportunities: opportunities,
    abilityImpairments: impairments, seamstressRoleTenureState: roleTenures }, targetTask, opportunity);
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
    firstNight: structuredClone(state.firstNight),
    firstNightInitializationProvenance: structuredClone(state.firstNightInitializationProvenance),
    initialPrivateKnowledge: structuredClone(state.initialPrivateKnowledge),
    setup: structuredClone(state.setup),
    roster: structuredClone(state.roster),
    assignment: structuredClone(state.assignment),
    currentCharacterState: structuredClone(state.currentCharacterState),
    firstNightTaskPlan: structuredClone(state.firstNightTaskPlan),
    firstNightTaskProgress: structuredClone(progress),
    firstNightTaskInsertions: structuredClone(insertions),
    philosopherAbilityChoices: structuredClone(choices),
    philosopherGrantedAbilities: structuredClone(grants),
    firstNightActionOpportunities: structuredClone(opportunities),
    abilityImpairments: structuredClone(impairments),
    impairmentEventProvenance: structuredClone(impairmentProvenance),
    roleTenures: cloneRoleTenureState(roleTenures),
    dreamerTargetChoices: structuredClone(targetChoices),
    dreamerInformationDeliveries: structuredClone(deliveries),
    firstNightAbilityOutcomeLedger: structuredClone(state.firstNightAbilityOutcomeLedger),
    targetTask: structuredClone(targetTask),
    sourceContract: structuredClone(sourceContract),
    sourceAbilityInstance: structuredClone(sourceContract.abilityInstance),
    resolutionBoundary: structuredClone(boundary)
  };
  const branded = plain as CanonicalDreamerV2Context;
  Object.defineProperty(branded, canonicalDreamerV2ContextBrand, { value: true, enumerable: false });
  return branded;
};

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
