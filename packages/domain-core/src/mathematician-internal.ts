import { sameCanonicalDataValue } from "./canonical-data.js";
import { DomainError } from "./errors.js";
import type { AnyDomainEventEnvelope, DomainEventEnvelope } from "./events.js";
import {
  FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,
  FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION,
  FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION,
  formatBaseFirstNightAbilityInstanceId,
  formatPhilosopherGainedV1AbilityInstanceId,
  formatPhilosopherGainedV2AbilityInstanceId,
  validateFirstNightAbilityOutcomeLedgerShape
} from "./first-night-ability-outcome-ledger.js";
import type {
  FirstNightAbilityInstanceProvenance,
  FirstNightAbilityOutcomeFact,
  FirstNightAbilityOutcomeFactId
} from "./first-night-ability-outcome-ledger.js";
import { compareFirstNightTaskOrder, getNextUnsettledFirstNightTask, isFirstNightTaskSettled, validateFirstNightTaskPlanRuntimeState } from "./first-night-task-plan.js";
import type { ScheduledTask, ScheduledTaskSettledPayload } from "./first-night-task-plan.js";
import type { GameState } from "./game-state.js";
import type { EventId, PlayerId, ScheduledTaskId } from "./ids.js";
import {
  MATHEMATICIAN_COUNT_DOMAIN,
  MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION,
  MATHEMATICIAN_FIXED_12_NUMBER_DOMAIN_VERSION,
  MATHEMATICIAN_INFORMATION_STAGE,
  MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION,
  MATHEMATICIAN_SMALLEST_FALSE_POLICY_VERSION,
  appendMathematicianInformationDelivery,
  createMathematicianInformationDeliveredScheduledTaskSettlement,
  formatMathematicianDeliveryId,
  validateMathematicianInformationDeliveredPayloadShape
} from "./mathematician.js";
import type {
  BaseMathematicianSourceContract,
  FirstNightMathematicianCountWindow,
  MathematicianAbnormalPlayer,
  MathematicianCount,
  MathematicianInformationDeliveredPayload,
  MathematicianRepresentedImpairment,
  MathematicianRoleTenureSnapshot,
  MathematicianSourceContract,
  MathematicianSourceEffectiveness,
  MathematicianVortoxConstraint,
  PhilosopherGainedMathematicianV1SourceContract,
  PhilosopherGainedMathematicianV2SourceContract
} from "./mathematician.js";
import { rebuildGameState } from "./rebuild.js";
import { applyDomainEvent } from "./event-applier.js";
import { validateDomainBatchSemantics } from "./domain-batch-semantics.js";
import { isRoleTenureActiveAt } from "./seamstress.js";
import type { RoleTenureRecord } from "./seamstress.js";
import { validateDomainEventStream } from "./event-stream-validator.js";
import { scheduledTaskFromFirstNightTaskInsertedPayload } from "./philosopher-ability.js";
import type {
  AnyFirstNightTaskInsertedPayload,
  FirstNightTaskInsertedPayload,
  FirstNightTaskInsertedV2Payload,
  PhilosopherAbilityChosenPayload,
  PhilosopherAbilityGrantedPayload
} from "./philosopher-ability.js";
import type { FirstNightActionOpportunity } from "./first-night-action-opportunity.js";
import type { PlayerRosterEntry } from "./player-roster.js";
import type { CurrentCharacterState } from "./current-character-state.js";

export type MathematicianBlockingUnresolvedFact = {
  readonly auditFactId: FirstNightAbilityOutcomeFactId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: import("./player-roster.js").SeatNumber;
  readonly abilityRoleId: import("./ids.js").RoleId;
  readonly abilityTaskId: ScheduledTaskId;
  readonly causeKind: import("./first-night-ability-outcome-ledger.js").AbilityOutcomeCause;
};

export type InternalMathematicianResolution =
  | { readonly kind: "READY"; readonly rebuiltState: GameState; readonly deliveryPayload: MathematicianInformationDeliveredPayload; readonly settlementPayload: ScheduledTaskSettledPayload }
  | { readonly kind: "DETERMINISTIC_REJECTION"; readonly code: "ScheduledTaskNotFound" | "UnsupportedMathematicianInformationTask" | "ScheduledTaskAlreadySettled" | "ScheduledTaskNotNext" | "InformationSourceNoLongerValid"; readonly message: string }
  | { readonly kind: "UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER"; readonly rebuiltState: GameState; readonly diagnostic: { readonly reason: "LEGACY_V1_DUPLICATE_MATHEMATICIAN_ORDER_UNSUPPORTED"; readonly taskPlanVersion: "first-night-task-plan-v1"; readonly baseTaskId: ScheduledTaskId; readonly gainedTaskId: ScheduledTaskId } }
  | { readonly kind: "LEDGER_UNRESOLVED"; readonly rebuiltState: GameState; readonly blockingUnresolvedFacts: readonly MathematicianBlockingUnresolvedFact[] }
  | { readonly kind: "SOURCE_EFFECTIVENESS_UNRESOLVED"; readonly rebuiltState: GameState; readonly reason: "MULTIPLE_APPLICABLE_IMPAIRMENTS" | "IMPAIRMENT_SOURCE_CHAIN_INVALID" | "IMPAIRMENT_TENURE_NOT_PROVEN"; readonly conflictingImpairmentIds: readonly import("./ids.js").AbilityImpairmentId[] }
  | { readonly kind: "VORTOX_CONSTRAINT_UNRESOLVED"; readonly rebuiltState: GameState; readonly reason: "VORTOX_IDENTITY_NOT_UNIQUE" | "VORTOX_TENURE_MISSING_OR_INCONSISTENT" | "VORTOX_EFFECTIVENESS_CONFLICT" | "VORTOX_APPLICABILITY_NOT_PROVEN"; readonly candidatePlayerIds: readonly PlayerId[]; readonly candidateRoleTenureIds: readonly import("./ids.js").RoleTenureId[]; readonly conflictingImpairmentIds: readonly import("./ids.js").AbilityImpairmentId[] }
  | { readonly kind: "CANONICAL_HISTORY_INVALID"; readonly reason: string; readonly offendingEventIds: readonly EventId[] }
  | { readonly kind: "CONSTRUCTION_FAILED"; readonly reason: string };

const compareCodeUnit = (left: string, right: string): number => left === right ? 0 : left < right ? -1 : 1;

const tenureSnapshot = (record: RoleTenureRecord): MathematicianRoleTenureSnapshot => ({
  roleTenureId: record.roleTenureId,
  playerId: record.playerId,
  seatNumber: record.seatNumber,
  roleId: record.roleId as MathematicianRoleTenureSnapshot["roleId"],
  acquiredCharacterStateRevision: record.acquiredCharacterStateRevision,
  endedCharacterStateRevision: record.endedCharacterStateRevision ?? null
});

const activeTenureFor = (state: GameState, playerId: PlayerId, roleId: MathematicianRoleTenureSnapshot["roleId"]): RoleTenureRecord | undefined => {
  const revision = state.currentCharacterState?.revision;
  if (revision === undefined) return undefined;
  const matches = state.seamstressRoleTenureState?.records.filter((entry) =>
    entry.playerId === playerId && entry.roleId === roleId && isRoleTenureActiveAt(entry, revision)
  ) ?? [];
  return matches.length === 1 ? matches[0] : undefined;
};

type ValidatedGainedMathematicianChain = {
  readonly task: ScheduledTask;
  readonly insertion: AnyFirstNightTaskInsertedPayload;
  readonly choice: PhilosopherAbilityChosenPayload;
  readonly grant: PhilosopherAbilityGrantedPayload;
  readonly originalOpportunity: FirstNightActionOpportunity;
  readonly sourceRosterEntry: PlayerRosterEntry;
  readonly sourceRoleAtGrant: CurrentCharacterState;
  readonly abilityInstance: FirstNightAbilityInstanceProvenance;
};

export type ValidatedMathematicianSupportInput = {
  readonly taskPlanVersion: "first-night-task-plan-v1" | "first-night-task-plan-v2";
  readonly baseTasks: readonly ScheduledTask[];
  readonly gainedV1Chains: readonly ValidatedGainedMathematicianChain[];
  readonly gainedV2Chains: readonly ValidatedGainedMathematicianChain[];
  readonly recordedInsertions: readonly AnyFirstNightTaskInsertedPayload[];
};

export type LegacyMathematicianSupportClassification =
  | "SUPPORTED_BASE_ONLY"
  | "SUPPORTED_V1_GAINED_ONLY"
  | "SUPPORTED_V2_GAINED_ONLY"
  | "SUPPORTED_V2_BASE_AND_GAINED"
  | "UNSUPPORTED_V1_BASE_AND_GAINED"
  | "INVALID_MIXED_GENERATION";

export const classifyLegacyMathematicianSupport = (
  input: ValidatedMathematicianSupportInput
): LegacyMathematicianSupportClassification => {
  const hasBase = input.baseTasks.length > 0;
  const hasV1 = input.gainedV1Chains.length > 0;
  const hasV2 = input.gainedV2Chains.length > 0;
  const mixed = hasV1 && hasV2 ||
    input.taskPlanVersion === "first-night-task-plan-v1" && hasV2 ||
    input.taskPlanVersion === "first-night-task-plan-v2" && hasV1 ||
    input.recordedInsertions.some((entry) =>
      Object.hasOwn(entry, "schedulingVersion") !== (input.taskPlanVersion === "first-night-task-plan-v2")
    );
  if (mixed) return "INVALID_MIXED_GENERATION";
  if (hasBase && hasV1) return "UNSUPPORTED_V1_BASE_AND_GAINED";
  if (hasBase && hasV2) return "SUPPORTED_V2_BASE_AND_GAINED";
  if (hasV1) return "SUPPORTED_V1_GAINED_ONLY";
  if (hasV2) return "SUPPORTED_V2_GAINED_ONLY";
  return "SUPPORTED_BASE_ONLY";
};

export const orderValidatedMathematicianGainedTasksForInternalValidation = (
  input: ValidatedMathematicianSupportInput
): readonly ScheduledTask[] => [...input.gainedV1Chains, ...input.gainedV2Chains]
  .map((chain) => chain.task)
  .sort(compareFirstNightTaskOrder);

type MathematicianInventoryResult =
  | { readonly valid: true; readonly input: ValidatedMathematicianSupportInput; readonly classification: LegacyMathematicianSupportClassification }
  | { readonly valid: false; readonly reason: string };

const buildValidatedMathematicianInventory = (state: GameState): MathematicianInventoryResult => {
  const plan = state.firstNightTaskPlan;
  if (plan === undefined || state.setup === undefined || state.roster === undefined || state.assignment === undefined ||
      state.firstNight === undefined || state.initialPrivateKnowledge === undefined || state.currentCharacterState === undefined) {
    return { valid: false, reason: "Mathematician inventory requires complete first-night source facts" };
  }
  const recordedInsertions = state.firstNightTaskInsertions?.insertions ?? [];
  const planValidation = validateFirstNightTaskPlanRuntimeState(plan, {
    sourceFacts: {
      setup: state.setup,
      roster: state.roster.entries,
      assignment: state.assignment.assignments,
      firstNight: state.firstNight,
      initialPrivateKnowledge: state.initialPrivateKnowledge
    },
    insertedTasks: recordedInsertions.map(scheduledTaskFromFirstNightTaskInsertedPayload)
  });
  if (!planValidation.valid) return { valid: false, reason: planValidation.reason };

  const mathTasks = plan.tasks.filter((task) => task.taskType === "MATHEMATICIAN_INFORMATION");
  const baseTasks = mathTasks.filter((task) => task.source.kind === "ROLE");
  const gainedTasks = mathTasks.filter((task) => task.source.kind === "PHILOSOPHER_GAINED_ABILITY");
  if (baseTasks.length > 1 || mathTasks.some((task) => task.source.kind === "SYSTEM")) {
    return { valid: false, reason: "Mathematician inventory has an invalid base or system task multiplicity" };
  }
  const mathInsertions = recordedInsertions.filter((entry) => entry.taskType === "MATHEMATICIAN_INFORMATION");
  if (mathInsertions.length !== gainedTasks.length ||
      new Set(mathInsertions.map((entry) => entry.taskId)).size !== mathInsertions.length) {
    return { valid: false, reason: "Mathematician gained tasks require unique one-to-one insertion facts" };
  }

  for (const base of baseTasks) {
    if (base.source.kind !== "ROLE" || base.source.role.roleId !== "mathematician" ||
        !base.taskId.startsWith("first-night-v1:MATHEMATICIAN_INFORMATION:seat-") ||
        mathInsertions.some((entry) => entry.taskId === base.taskId)) {
      return { valid: false, reason: "Mathematician base task provenance is invalid" };
    }
  }

  const gainedV1Chains: ValidatedGainedMathematicianChain[] = [];
  const gainedV2Chains: ValidatedGainedMathematicianChain[] = [];
  const usedChoices = new Set<string>();
  const usedGrants = new Set<string>();
  const usedOpportunities = new Set<string>();
  for (const task of gainedTasks) {
    if (task.source.kind !== "PHILOSOPHER_GAINED_ABILITY" || task.source.sourceRole.roleId !== "philosopher" ||
        task.source.chosenRole.roleId !== "mathematician") {
      return { valid: false, reason: "Mathematician gained task source role is invalid" };
    }
    const source = task.source;
    const insertions = mathInsertions.filter((entry) => entry.taskId === task.taskId);
    const insertion = insertions[0];
    if (insertions.length !== 1 || insertion === undefined ||
        !sameCanonicalDataValue(scheduledTaskFromFirstNightTaskInsertedPayload(insertion), task)) {
      return { valid: false, reason: "Mathematician gained task does not equal its accepted insertion" };
    }
    const v2 = Object.hasOwn(insertion, "schedulingVersion");
    if (v2 !== task.taskId.startsWith("first-night-v2:") ||
        (!v2 && !task.taskId.startsWith("first-night-v1:"))) {
      return { valid: false, reason: "Mathematician task and insertion generations are mixed" };
    }
    const opportunityId = v2
      ? (insertion as FirstNightTaskInsertedV2Payload).philosopherOpportunityId
      : (insertion as FirstNightTaskInsertedPayload).insertedByOpportunityId;
    const grants = state.philosopherGrantedAbilities?.abilities.filter((entry) =>
      entry.grantedAtOpportunityId === opportunityId &&
      entry.sourcePlayerId === source.playerId && entry.sourceSeatNumber === source.seatNumber &&
      entry.sourceCharacterStateRevision === source.sourceCharacterStateRevision &&
      entry.chosenRoleId === "mathematician" &&
      sameCanonicalDataValue(entry.sourceRole, source.sourceRole) &&
      sameCanonicalDataValue(entry.chosenRole, source.chosenRole) &&
      (!v2 || entry.grantId === (insertion as FirstNightTaskInsertedV2Payload).grantId)
    ) ?? [];
    const grant = grants[0];
    if (grants.length !== 1 || grant === undefined || usedGrants.has(grant.grantId)) {
      return { valid: false, reason: "Mathematician insertion requires one unused matching grant" };
    }
    const choices = state.philosopherAbilityChoices?.choices.filter((entry) =>
      entry.opportunityId === opportunityId && entry.taskId === grant.grantedAtTaskId &&
      entry.sourcePlayerId === grant.sourcePlayerId && entry.sourceSeatNumber === grant.sourceSeatNumber &&
      entry.sourceCharacterStateRevision === grant.sourceCharacterStateRevision &&
      entry.chosenRoleId === grant.chosenRoleId && entry.roleCatalogSignature === grant.chosenRoleCatalogSignature &&
      sameCanonicalDataValue(entry.sourceRole, grant.sourceRole) && sameCanonicalDataValue(entry.chosenRole, grant.chosenRole)
    ) ?? [];
    const choice = choices[0];
    if (choices.length !== 1 || choice === undefined || usedChoices.has(choice.opportunityId)) {
      return { valid: false, reason: "Mathematician grant requires one unused matching choice" };
    }
    const opportunities = state.firstNightActionOpportunities?.opportunities.filter((entry) =>
      entry.opportunityId === opportunityId && entry.opportunityKind === "PHILOSOPHER_FIRST_NIGHT_ACTION" &&
      entry.opportunityStatus === "CLOSED" && entry.taskId === choice.taskId &&
      entry.sourcePlayerId === choice.sourcePlayerId && entry.sourceSeatNumber === choice.sourceSeatNumber &&
      entry.sourceCharacterStateRevision === choice.sourceCharacterStateRevision &&
      sameCanonicalDataValue(entry.sourceRole, choice.sourceRole)
    ) ?? [];
    const opportunity = opportunities[0];
    if (opportunities.length !== 1 || opportunity === undefined || usedOpportunities.has(opportunity.opportunityId)) {
      return { valid: false, reason: "Mathematician choice requires one unused original closed Philosopher opportunity" };
    }
    const rosterEntries = state.roster.entries.filter((entry) =>
      entry.playerId === choice.sourcePlayerId && entry.seatNumber === choice.sourceSeatNumber
    );
    const sourceRoleAtGrant = state.currentCharacterState.entries.filter((entry) =>
      entry.playerId === choice.sourcePlayerId && entry.seatNumber === choice.sourceSeatNumber &&
      entry.role.roleId === "philosopher"
    );
    const catalogRoles = state.setup.roleCatalogSnapshot.roles.filter((role) =>
      role.roleId === "mathematician" && sameCanonicalDataValue(role, choice.chosenRole)
    );
    if (rosterEntries.length !== 1 || sourceRoleAtGrant.length !== 1 || catalogRoles.length !== 1 ||
        choice.sourceCharacterStateRevision > state.currentCharacterState.revision) {
      return { valid: false, reason: "Mathematician gained chain roster, catalog, role, or revision proof is invalid" };
    }
    const abilityInstance = v2 ? {
      provenanceVersion: "first-night-ability-instance-provenance-v1" as const,
      kind: "PHILOSOPHER_GAINED_TASK_V2" as const,
      abilityInstanceId: formatPhilosopherGainedV2AbilityInstanceId({ taskId: task.taskId, grantId: grant.grantId }),
      abilityRoleId: grant.chosenRoleId, taskId: task.taskId, sourcePlayerId: source.playerId,
      sourceSeatNumber: source.seatNumber, philosopherOpportunityId: opportunityId, grantId: grant.grantId,
      sourceCharacterStateRevision: source.sourceCharacterStateRevision,
      schedulingVersion: "philosopher-gained-first-night-scheduling-v2" as const
    } : {
      provenanceVersion: "first-night-ability-instance-provenance-v1" as const,
      kind: "PHILOSOPHER_GAINED_TASK_V1" as const,
      abilityInstanceId: formatPhilosopherGainedV1AbilityInstanceId({ taskId: task.taskId, grantId: grant.grantId }),
      abilityRoleId: grant.chosenRoleId, taskId: task.taskId, sourcePlayerId: source.playerId,
      sourceSeatNumber: source.seatNumber, philosopherOpportunityId: opportunityId, grantId: grant.grantId,
      sourceCharacterStateRevision: source.sourceCharacterStateRevision
    };
    const chain: ValidatedGainedMathematicianChain = {
      task, insertion, choice, grant: { ...grant, rulesBaselineVersion: state.rulesBaselineVersion, nightNumber: 1,
        taskId: grant.grantedAtTaskId, opportunityId: grant.grantedAtOpportunityId },
      originalOpportunity: opportunity, sourceRosterEntry: rosterEntries[0]!, sourceRoleAtGrant: sourceRoleAtGrant[0]!, abilityInstance
    };
    (v2 ? gainedV2Chains : gainedV1Chains).push(chain);
    usedChoices.add(choice.opportunityId); usedGrants.add(grant.grantId); usedOpportunities.add(opportunity.opportunityId);
  }

  const mathChoices = state.philosopherAbilityChoices?.choices.filter((entry) => entry.chosenRoleId === "mathematician") ?? [];
  const mathGrants = state.philosopherGrantedAbilities?.abilities.filter((entry) => entry.chosenRoleId === "mathematician") ?? [];
  if (mathChoices.length !== gainedTasks.length || mathGrants.length !== gainedTasks.length) {
    return { valid: false, reason: "Mathematician inventory contains orphan choice or grant facts" };
  }
  const input: ValidatedMathematicianSupportInput = {
    taskPlanVersion: plan.taskPlanVersion,
    baseTasks,
    gainedV1Chains,
    gainedV2Chains,
    recordedInsertions: mathInsertions
  };
  const canonicalGainedTaskIds = orderValidatedMathematicianGainedTasksForInternalValidation(input).map((task) => task.taskId);
  if (!sameCanonicalDataValue(canonicalGainedTaskIds, gainedTasks.map((task) => task.taskId))) {
    return { valid: false, reason: "Mathematician gained tasks are not in canonical stable order" };
  }
  return { valid: true, input, classification: classifyLegacyMathematicianSupport(input) };
};

const abilityInstanceFor = (
  state: GameState,
  task: ScheduledTask,
  inventory?: ValidatedMathematicianSupportInput
): FirstNightAbilityInstanceProvenance | undefined => {
  if (task.source.kind === "ROLE") return {
    provenanceVersion: "first-night-ability-instance-provenance-v1",
    kind: "BASE_ROLE_TASK",
    abilityInstanceId: formatBaseFirstNightAbilityInstanceId(task.taskId),
    abilityRoleId: task.source.role.roleId,
    taskId: task.taskId,
    sourcePlayerId: task.source.playerId,
    sourceSeatNumber: task.source.seatNumber
  };
  if (task.source.kind !== "PHILOSOPHER_GAINED_ABILITY") return undefined;
  const validatedChain = [...(inventory?.gainedV1Chains ?? []), ...(inventory?.gainedV2Chains ?? [])]
    .find((chain) => chain.task.taskId === task.taskId);
  if (validatedChain !== undefined) return validatedChain.abilityInstance;
  const source = task.source;
  const grants = state.philosopherGrantedAbilities?.abilities.filter((grant) =>
    grant.sourcePlayerId === source.playerId && grant.sourceSeatNumber === source.seatNumber &&
    grant.grantedAtOpportunityId === source.opportunityId && grant.sourceCharacterStateRevision === source.sourceCharacterStateRevision &&
    grant.chosenRoleId === "mathematician"
  ) ?? [];
  const grant = grants[0];
  if (grants.length !== 1 || grant === undefined) return undefined;
  const v2 = task.taskId.startsWith("first-night-v2:");
  const common = {
    provenanceVersion: "first-night-ability-instance-provenance-v1" as const,
    abilityRoleId: grant.chosenRoleId,
    taskId: task.taskId,
    sourcePlayerId: source.playerId,
    sourceSeatNumber: source.seatNumber,
    philosopherOpportunityId: source.opportunityId,
    grantId: grant.grantId,
    sourceCharacterStateRevision: source.sourceCharacterStateRevision
  };
  return v2 ? {
    ...common,
    kind: "PHILOSOPHER_GAINED_TASK_V2",
    abilityInstanceId: formatPhilosopherGainedV2AbilityInstanceId({ taskId: task.taskId, grantId: grant.grantId }),
    schedulingVersion: "philosopher-gained-first-night-scheduling-v2"
  } : {
    ...common,
    kind: "PHILOSOPHER_GAINED_TASK_V1",
    abilityInstanceId: formatPhilosopherGainedV1AbilityInstanceId({ taskId: task.taskId, grantId: grant.grantId })
  };
};

const sourceContractFor = (
  state: GameState,
  task: ScheduledTask,
  inventory?: ValidatedMathematicianSupportInput
): MathematicianSourceContract | undefined => {
  const revision = state.currentCharacterState?.revision;
  const planVersion = state.firstNightTaskPlan?.taskPlanVersion;
  if (revision === undefined || planVersion === undefined) return undefined;
  const instance = abilityInstanceFor(state, task, inventory);
  if (instance === undefined) return undefined;
  if (task.source.kind === "ROLE") {
    const source = task.source;
    const current = state.currentCharacterState?.entries.find((entry) => entry.playerId === source.playerId && entry.seatNumber === source.seatNumber);
    const tenure = activeTenureFor(state, source.playerId, "mathematician");
    if (source.role.roleId !== "mathematician" || current?.role.roleId !== "mathematician" || tenure === undefined || instance.kind !== "BASE_ROLE_TASK") return undefined;
    return {
      kind: "BASE_MATHEMATICIAN", taskPlanVersion: planVersion, taskId: task.taskId,
      sourcePlayerId: source.playerId, sourceSeatNumber: source.seatNumber,
      sourceRole: structuredClone(source.role), sourceRoleAtSettlement: structuredClone(current.role),
      sourceRoleTenure: tenureSnapshot(tenure), settlementCharacterStateRevision: revision, abilityInstance: instance
    } satisfies BaseMathematicianSourceContract;
  }
  if (task.source.kind !== "PHILOSOPHER_GAINED_ABILITY") return undefined;
  const source = task.source;
  const current = state.currentCharacterState?.entries.find((entry) => entry.playerId === source.playerId && entry.seatNumber === source.seatNumber);
  const tenure = activeTenureFor(state, source.playerId, "philosopher");
  const validatedChain = [...(inventory?.gainedV1Chains ?? []), ...(inventory?.gainedV2Chains ?? [])]
    .find((chain) => chain.task.taskId === task.taskId);
  const grant = validatedChain?.grant ?? state.philosopherGrantedAbilities?.abilities.find((entry) => entry.grantId === (instance.kind === "PHILOSOPHER_GAINED_TASK_V1" || instance.kind === "PHILOSOPHER_GAINED_TASK_V2" ? instance.grantId : undefined));
  if (current?.role.roleId !== "philosopher" || source.sourceRole.roleId !== "philosopher" || source.chosenRole.roleId !== "mathematician" || tenure === undefined || grant === undefined) return undefined;
  const common = {
    taskId: task.taskId, sourcePlayerId: source.playerId, sourceSeatNumber: source.seatNumber,
    sourceRole: structuredClone(source.sourceRole), sourceRoleAtSettlement: structuredClone(current.role), sourceRoleTenure: tenureSnapshot(tenure),
    chosenRole: structuredClone(source.chosenRole), philosopherTaskId: grant.grantedAtTaskId,
    philosopherOpportunityId: grant.grantedAtOpportunityId, grantId: grant.grantId,
    sourceCharacterStateRevision: source.sourceCharacterStateRevision, settlementCharacterStateRevision: revision
  };
  if (instance.kind === "PHILOSOPHER_GAINED_TASK_V1" && planVersion === "first-night-task-plan-v1") return {
    ...common, kind: "PHILOSOPHER_GAINED_MATHEMATICIAN_V1", taskPlanVersion: planVersion, abilityInstance: instance
  } satisfies PhilosopherGainedMathematicianV1SourceContract;
  if (instance.kind === "PHILOSOPHER_GAINED_TASK_V2" && planVersion === "first-night-task-plan-v2") return {
    ...common, kind: "PHILOSOPHER_GAINED_MATHEMATICIAN_V2", taskPlanVersion: planVersion,
    schedulingVersion: "philosopher-gained-first-night-scheduling-v2", abilityInstance: instance
  } satisfies PhilosopherGainedMathematicianV2SourceContract;
  return undefined;
};

const representedImpairment = (state: GameState, impairment: NonNullable<GameState["abilityImpairments"]>["impairments"][number]): MathematicianRepresentedImpairment | undefined => {
  const provenance = state.mathematicianImpairmentEventProvenance?.entries.filter((entry) => entry.impairmentId === impairment.impairmentId) ?? [];
  if (provenance.length !== 1 || provenance[0] === undefined) return undefined;
  return {
    impairmentId: impairment.impairmentId, kind: impairment.kind, sourceKind: impairment.sourceKind,
    sourcePlayerId: impairment.sourcePlayerId, affectedPlayerId: impairment.affectedPlayerId,
    affectedSeatNumber: impairment.affectedSeatNumber, affectedRoleId: impairment.affectedRole.roleId,
    affectedRole: structuredClone(impairment.affectedRole), appliedCharacterStateRevision: impairment.sourceCharacterStateRevision,
    appliedByEventId: provenance[0].eventId, appliedByEventSequence: provenance[0].eventSequence
  };
};

const effectivenessFor = (state: GameState, source: MathematicianSourceContract): MathematicianSourceEffectiveness | undefined => {
  const relevant = state.abilityImpairments?.impairments.filter((entry) =>
    entry.affectedPlayerId === source.sourcePlayerId && entry.affectedSeatNumber === source.sourceSeatNumber &&
    entry.affectedRole.roleId === "mathematician" && entry.sourceCharacterStateRevision <= source.settlementCharacterStateRevision
  ) ?? [];
  if (relevant.length === 0) return { kind: "EFFECTIVE", representedImpairments: [] };
  if (relevant.length !== 1 || relevant[0] === undefined) return undefined;
  const represented = representedImpairment(state, relevant[0]);
  if (represented === undefined) return undefined;
  return represented.kind === "DRUNK"
    ? { kind: "KNOWN_DRUNK", representedImpairments: [represented] }
    : { kind: "KNOWN_POISONED", representedImpairments: [represented] };
};

export const resolveMathematicianVortoxConstraintForInternalValidation = (
  state: GameState
): MathematicianVortoxConstraint | undefined => {
  const revision = state.currentCharacterState?.revision;
  if (revision === undefined) return undefined;
  const players = state.currentCharacterState?.entries.filter((entry) => entry.role.roleId === "vortox") ?? [];
  const tenures = state.seamstressRoleTenureState?.records.filter((entry) => entry.roleId === "vortox" && isRoleTenureActiveAt(entry, revision)) ?? [];
  if (players.length === 0 && tenures.length === 0) return { kind: "NONE_NO_CURRENT_VORTOX", evaluatedCharacterStateRevision: revision };
  if (players.length !== 1 || tenures.length !== 1 || players[0] === undefined || tenures[0] === undefined ||
      players[0].playerId !== tenures[0].playerId || players[0].seatNumber !== tenures[0].seatNumber) return undefined;
  const impairmentEntries = state.abilityImpairments?.impairments.filter((entry) =>
    entry.affectedPlayerId === players[0]!.playerId && entry.affectedSeatNumber === players[0]!.seatNumber &&
    entry.affectedRole.roleId === "vortox" && entry.sourceCharacterStateRevision <= revision
  ) ?? [];
  const common = { evaluatedCharacterStateRevision: revision, vortoxPlayerId: players[0].playerId, vortoxSeatNumber: players[0].seatNumber,
    vortoxRoleSnapshot: structuredClone(players[0].role), vortoxRoleTenure: tenureSnapshot(tenures[0]) };
  if (impairmentEntries.length === 0) return { kind: "VORTOX_FALSE_REQUIRED", ...common };
  if (impairmentEntries.length !== 1 || impairmentEntries[0] === undefined) return undefined;
  const impairment = representedImpairment(state, impairmentEntries[0]);
  return impairment === undefined ? undefined : { kind: "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED", ...common, impairment };
};

export type InternalMathematicianCountResolution = {
  readonly trueCount: MathematicianCount;
  readonly qualifyingAbnormalFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly distinctAbnormalPlayers: readonly MathematicianAbnormalPlayer[];
  readonly excludedResolvingSourceFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly excludedOwnAbilityFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredNormalFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredPendingFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly redundantUnresolvedFactIds: readonly FirstNightAbilityOutcomeFactId[];
  readonly blocking: readonly MathematicianBlockingUnresolvedFact[];
};

export const resolveMathematicianCountFromValidatedFactsForInternalValidation = (
  facts: readonly FirstNightAbilityOutcomeFact[],
  resolvingSourcePlayerId: PlayerId,
  resolvingAbilityInstanceId: FirstNightAbilityInstanceProvenance["abilityInstanceId"]
): InternalMathematicianCountResolution => {
  const own: FirstNightAbilityOutcomeFactId[] = []; const sourceFacts: FirstNightAbilityOutcomeFactId[] = [];
  const normal: FirstNightAbilityOutcomeFactId[] = []; const pending: FirstNightAbilityOutcomeFactId[] = [];
  const abnormal = new Map<PlayerId, FirstNightAbilityOutcomeFact[]>(); const unresolved = new Map<PlayerId, FirstNightAbilityOutcomeFact[]>();
  for (const fact of facts) {
    if (fact.abilityInstance.abilityInstanceId === resolvingAbilityInstanceId) { own.push(fact.auditFactId); continue; }
    if (fact.sourcePlayerId === resolvingSourcePlayerId) { sourceFacts.push(fact.auditFactId); continue; }
    if (fact.outcomeStatus === "NORMAL") { normal.push(fact.auditFactId); continue; }
    if (fact.outcomeStatus === "PENDING_TRIGGER") { pending.push(fact.auditFactId); continue; }
    if (fact.outcomeStatus === "ABNORMAL" && fact.causedByAnotherCharacterAbility) {
      const list = abnormal.get(fact.sourcePlayerId) ?? []; list.push(fact); abnormal.set(fact.sourcePlayerId, list); continue;
    }
    if (fact.outcomeStatus === "UNRESOLVED") { const list = unresolved.get(fact.sourcePlayerId) ?? []; list.push(fact); unresolved.set(fact.sourcePlayerId, list); }
  }
  const distinct = [...abnormal.entries()].map(([playerId, playerFacts]) => ({
    playerId, seatNumber: playerFacts[0]!.sourceSeatNumber,
    supportingFactIds: playerFacts.map((fact) => fact.auditFactId).sort(compareCodeUnit)
  })).sort((left, right) => left.seatNumber - right.seatNumber || compareCodeUnit(left.playerId, right.playerId));
  const redundant: FirstNightAbilityOutcomeFactId[] = []; const blocking: MathematicianBlockingUnresolvedFact[] = [];
  for (const [playerId, playerFacts] of unresolved) {
    if (abnormal.has(playerId)) redundant.push(...playerFacts.map((fact) => fact.auditFactId));
    else blocking.push(...playerFacts.map((fact) => ({ auditFactId: fact.auditFactId, sourcePlayerId: fact.sourcePlayerId,
      sourceSeatNumber: fact.sourceSeatNumber, abilityRoleId: fact.abilityRoleId, abilityTaskId: fact.abilityTaskId, causeKind: fact.causeKind })));
  }
  const sort = (values: FirstNightAbilityOutcomeFactId[]): readonly FirstNightAbilityOutcomeFactId[] => values.sort(compareCodeUnit);
  return { trueCount: distinct.length as MathematicianCount, qualifyingAbnormalFactIds: sort(distinct.flatMap((entry) => [...entry.supportingFactIds])),
    distinctAbnormalPlayers: distinct, excludedResolvingSourceFactIds: sort(sourceFacts), excludedOwnAbilityFactIds: sort(own),
    ignoredNormalFactIds: sort(normal), ignoredPendingFactIds: sort(pending), redundantUnresolvedFactIds: sort(redundant), blocking };
};

export type InternalMathematicianCandidateResolution = {
  readonly legalCandidateCounts: readonly MathematicianCount[];
  readonly selectedCount: MathematicianCount;
  readonly informationReliability: MathematicianInformationDeliveredPayload["informationReliability"];
};

export const resolveMathematicianCandidatesForInternalValidation = (
  trueCount: MathematicianCount,
  sourceEffectivenessKind: MathematicianSourceEffectiveness["kind"],
  vortoxConstraintKind: MathematicianVortoxConstraint["kind"]
): InternalMathematicianCandidateResolution => {
  const falseRequired = vortoxConstraintKind === "VORTOX_FALSE_REQUIRED";
  const impaired = sourceEffectivenessKind !== "EFFECTIVE";
  const legalCandidateCounts = falseRequired
    ? MATHEMATICIAN_COUNT_DOMAIN.filter((value) => value !== trueCount)
    : impaired ? [...MATHEMATICIAN_COUNT_DOMAIN] : [trueCount];
  const selectedCount = (falseRequired || impaired
    ? legalCandidateCounts.find((value) => value !== trueCount)
    : trueCount);
  if (selectedCount === undefined) throw new Error("No legal Mathematician candidate exists");
  return {
    legalCandidateCounts,
    selectedCount,
    informationReliability: falseRequired ? "VORTOX_CONSTRAINED_FALSE" :
      sourceEffectivenessKind === "KNOWN_DRUNK" ? "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS" :
        sourceEffectivenessKind === "KNOWN_POISONED" ? "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING" : "RULE_CORRECT"
  };
};

const resolveCount = (state: GameState, source: MathematicianSourceContract): InternalMathematicianCountResolution =>
  resolveMathematicianCountFromValidatedFactsForInternalValidation(
    state.firstNightAbilityOutcomeLedger?.facts ?? [],
    source.sourcePlayerId,
    source.abilityInstance.abilityInstanceId
  );

const buildReady = (
  state: GameState,
  task: ScheduledTask,
  inventory: ValidatedMathematicianSupportInput
): InternalMathematicianResolution => {
  const source = sourceContractFor(state, task, inventory);
  if (source === undefined) return { kind: "DETERMINISTIC_REJECTION", code: "InformationSourceNoLongerValid", message: "Mathematician information source no longer matches canonical history" };
  const count = resolveCount(state, source);
  if (count.blocking.length > 0) return { kind: "LEDGER_UNRESOLVED", rebuiltState: state, blockingUnresolvedFacts: count.blocking };
  const effectiveness = effectivenessFor(state, source);
  if (effectiveness === undefined) return { kind: "SOURCE_EFFECTIVENESS_UNRESOLVED", rebuiltState: state, reason: "IMPAIRMENT_SOURCE_CHAIN_INVALID", conflictingImpairmentIds: [] };
  const vortox = resolveMathematicianVortoxConstraintForInternalValidation(state);
  if (vortox === undefined) return { kind: "VORTOX_CONSTRAINT_UNRESOLVED", rebuiltState: state, reason: "VORTOX_TENURE_MISSING_OR_INCONSISTENT", candidatePlayerIds: [], candidateRoleTenureIds: [], conflictingImpairmentIds: [] };
  const candidates = resolveMathematicianCandidatesForInternalValidation(count.trueCount, effectiveness.kind, vortox.kind);
  const initialization = state.firstNightInitializationProvenance!;
  const window: FirstNightMathematicianCountWindow = {
    windowVersion: FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION, gameId: state.gameId, nightNumber: 1,
    rulesBaselineVersion: state.rulesBaselineVersion, firstNightInitializedEventId: initialization.eventId,
    startEventSequence: initialization.eventSequence, startBoundary: "EXCLUSIVE", endEventSequence: state.lastEventSequence, endBoundary: "INCLUSIVE"
  };
  const payload: MathematicianInformationDeliveredPayload = {
    rulesBaselineVersion: state.rulesBaselineVersion, nightNumber: 1, taskId: task.taskId, taskType: "MATHEMATICIAN_INFORMATION",
    deliveryId: formatMathematicianDeliveryId(task.taskId), deliveryEventSequence: state.lastEventSequence + 1, sourceContract: source,
    resolutionModelVersion: MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION, windowSnapshot: window,
    ledgerVersion: FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION, auditModelVersion: FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,
    resolvingAbilityInstanceId: source.abilityInstance.abilityInstanceId,
    qualifyingAbnormalFactIds: count.qualifyingAbnormalFactIds, distinctAbnormalPlayers: count.distinctAbnormalPlayers,
    excludedResolvingSourceFactIds: count.excludedResolvingSourceFactIds, excludedOwnAbilityFactIds: count.excludedOwnAbilityFactIds,
    ignoredNormalFactIds: count.ignoredNormalFactIds, ignoredPendingFactIds: count.ignoredPendingFactIds,
    redundantUnresolvedFactIds: count.redundantUnresolvedFactIds, trueCount: count.trueCount,
    numberDomainVersion: MATHEMATICIAN_FIXED_12_NUMBER_DOMAIN_VERSION, candidateDomain: [...MATHEMATICIAN_COUNT_DOMAIN],
    legalCandidateCounts: candidates.legalCandidateCounts, selectedCount: candidates.selectedCount,
    sourceEffectiveness: effectiveness, vortoxConstraint: vortox,
    simulationPolicyVersion: MATHEMATICIAN_SMALLEST_FALSE_POLICY_VERSION,
    informationReliability: candidates.informationReliability,
    knowledgeModelVersion: MATHEMATICIAN_KNOWLEDGE_MODEL_VERSION, knowledgeStage: MATHEMATICIAN_INFORMATION_STAGE,
    settlementCharacterStateRevision: state.currentCharacterState!.revision
  };
  const shape = validateMathematicianInformationDeliveredPayloadShape(payload);
  if (!shape.valid) return { kind: "CONSTRUCTION_FAILED", reason: shape.reason };
  return { kind: "READY", rebuiltState: state, deliveryPayload: payload,
    settlementPayload: createMathematicianInformationDeliveredScheduledTaskSettlement(payload) };
};

const resolveFromState = (state: GameState, taskId: ScheduledTaskId): InternalMathematicianResolution => {
  if (state.firstNightTaskPlan === undefined || state.firstNightTaskProgress === undefined || state.currentCharacterState === undefined ||
      state.firstNightAbilityOutcomeLedger === undefined || state.firstNightInitializationProvenance === undefined ||
      !validateFirstNightAbilityOutcomeLedgerShape(state.firstNightAbilityOutcomeLedger).valid) {
    return { kind: "CANONICAL_HISTORY_INVALID", reason: "Mathematician resolution requires complete canonical first-night state", offendingEventIds: [] };
  }
  const inventory = buildValidatedMathematicianInventory(state);
  if (!inventory.valid || inventory.classification === "INVALID_MIXED_GENERATION") {
    return { kind: "CANONICAL_HISTORY_INVALID", reason: inventory.valid ? "Mathematician inventory mixes V1 and V2 generations" : inventory.reason, offendingEventIds: [] };
  }
  if (inventory.classification === "UNSUPPORTED_V1_BASE_AND_GAINED") {
    const base = inventory.input.baseTasks[0];
    const gained = inventory.input.gainedV1Chains[0]?.task;
    if (base === undefined || gained === undefined) {
      return { kind: "CANONICAL_HISTORY_INVALID", reason: "Legacy V1 duplicate classification lacks exact task identities", offendingEventIds: [] };
    }
    return { kind: "UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER", rebuiltState: state,
      diagnostic: { reason: "LEGACY_V1_DUPLICATE_MATHEMATICIAN_ORDER_UNSUPPORTED", taskPlanVersion: "first-night-task-plan-v1",
        baseTaskId: base.taskId, gainedTaskId: gained.taskId } };
  }
  const task = state.firstNightTaskPlan.tasks.find((entry) => entry.taskId === taskId);
  if (task === undefined) return { kind: "DETERMINISTIC_REJECTION", code: "ScheduledTaskNotFound", message: "Mathematician task was not found" };
  if (task.taskType !== "MATHEMATICIAN_INFORMATION" || task.taskClass !== "ROLE_INFORMATION" ||
      (task.source.kind !== "ROLE" && task.source.kind !== "PHILOSOPHER_GAINED_ABILITY")) return {
    kind: "DETERMINISTIC_REJECTION", code: "UnsupportedMathematicianInformationTask", message: "Task is not a supported Mathematician information task"
  };
  if (isFirstNightTaskSettled(state.firstNightTaskProgress, task.taskId)) return {
    kind: "DETERMINISTIC_REJECTION", code: "ScheduledTaskAlreadySettled", message: "Mathematician task is already settled"
  };
  if (getNextUnsettledFirstNightTask(state.firstNightTaskPlan, state.firstNightTaskProgress)?.taskId !== task.taskId) return {
    kind: "DETERMINISTIC_REJECTION", code: "ScheduledTaskNotNext", message: "Mathematician task is not the next unsettled task"
  };
  return buildReady(state, task, inventory.input);
};

export const classifyValidatedMathematicianSupportStateForInternalValidation = (
  state: GameState
): MathematicianInventoryResult => buildValidatedMathematicianInventory(state);

export const resolveMathematicianInformationFromStateForInternalValidation = (
  state: GameState,
  taskId: ScheduledTaskId
): InternalMathematicianResolution => resolveFromState(state, taskId);

const mathematicianPipelineStateFingerprint = (state: GameState) => ({
  gameId: state.gameId,
  gameVersion: state.gameVersion,
  lastEventSequence: state.lastEventSequence,
  phase: state.phase,
  nextTask: state.firstNightTaskPlan === undefined
    ? null
    : getNextUnsettledFirstNightTask(state.firstNightTaskPlan, state.firstNightTaskProgress) ?? null,
  firstNightAbilityOutcomeLedger: state.firstNightAbilityOutcomeLedger,
  roster: state.roster,
  currentCharacterState: state.currentCharacterState
});

export const mathematicianPipelineStatesMatchForInternalValidation = (
  pipelineState: GameState,
  layerARebuiltState: GameState
): boolean => sameCanonicalDataValue(
  mathematicianPipelineStateFingerprint(pipelineState),
  mathematicianPipelineStateFingerprint(layerARebuiltState)
);

export const resolveMathematicianInformationDecisionFromAcceptedEventStream = (
  events: readonly AnyDomainEventEnvelope[],
  taskId: ScheduledTaskId
): InternalMathematicianResolution => {
  try {
    const captured = structuredClone(events);
    validateDomainEventStream(captured);
    return resolveFromState(rebuildGameState(captured), taskId);
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return { kind: "CANONICAL_HISTORY_INVALID", reason: error.message, offendingEventIds: [] };
    }
    throw error;
  }
};

export type MathematicianProspectivePairValidationResult = { readonly valid: true } | { readonly valid: false; readonly reason: string };
export const validateProspectiveMathematicianInformationPair = (input: {
  readonly priorAcceptedEvents: readonly AnyDomainEventEnvelope[];
  readonly deliveryEvent: DomainEventEnvelope<"MathematicianInformationDelivered">;
  readonly settlementEvent: DomainEventEnvelope<"ScheduledTaskSettled">;
}): MathematicianProspectivePairValidationResult => {
  const decision = resolveMathematicianInformationDecisionFromAcceptedEventStream(input.priorAcceptedEvents, input.deliveryEvent.payload.taskId);
  if (decision.kind !== "READY") return { valid: false, reason: `Mathematician prospective pair has no READY decision: ${decision.kind}` };
  if (input.deliveryEvent.eventSequence + 1 !== input.settlementEvent.eventSequence || input.deliveryEvent.batchId !== input.settlementEvent.batchId ||
      input.deliveryEvent.commandId !== input.settlementEvent.commandId || input.deliveryEvent.gameVersion !== input.settlementEvent.gameVersion ||
      input.deliveryEvent.createdAt !== input.settlementEvent.createdAt ||
      !sameCanonicalDataValue(input.deliveryEvent.payload, decision.deliveryPayload) ||
      !sameCanonicalDataValue(input.settlementEvent.payload, decision.settlementPayload)) {
    return { valid: false, reason: "Mathematician prospective pair does not equal the canonical complete-stream decision" };
  }
  try { rebuildGameState([...input.priorAcceptedEvents, input.deliveryEvent, input.settlementEvent]); }
  catch (error: unknown) { return { valid: false, reason: error instanceof Error ? error.message : "Prospective Mathematician replay failed" }; }
  return { valid: true };
};

const validateIncomingMathematicianInformationDelivered = (input: {
  readonly stateBefore: GameState;
  readonly deliveryEvent: DomainEventEnvelope<"MathematicianInformationDelivered">;
}): { readonly valid: true; readonly canonicalPayload: MathematicianInformationDeliveredPayload } | { readonly valid: false; readonly reason: string } => {
  if (input.stateBefore.lastEventSequence !== input.deliveryEvent.eventSequence - 1) return { valid: false, reason: "Mathematician replay upper boundary is not the pre-event sequence" };
  const decision = resolveFromState(input.stateBefore, input.deliveryEvent.payload.taskId);
  if (decision.kind === "UNSUPPORTED_LEGACY_V1_DUPLICATE_HOLDER_ORDER") {
    throw new DomainError("UnsupportedLegacyV1MathematicianReplay", "Legacy V1 duplicate Mathematician delivery is not replayable");
  }
  if (decision.kind !== "READY") return { valid: false, reason: `Mathematician replay decision is ${decision.kind}` };
  if (!sameCanonicalDataValue(decision.deliveryPayload, input.deliveryEvent.payload)) return { valid: false, reason: "Stored Mathematician delivery differs from the replay canonical decision" };
  return { valid: true, canonicalPayload: decision.deliveryPayload };
};

export const applyMathematicianInformationDeliveredReplayAdapter = (
  stateBefore: GameState,
  event: DomainEventEnvelope<"MathematicianInformationDelivered">
): NonNullable<GameState["mathematicianInformation"]> => {
  const validation = validateIncomingMathematicianInformationDelivered({ stateBefore, deliveryEvent: event });
  if (!validation.valid) throw new DomainError("InvalidMathematicianInformationDeliveredPayload", validation.reason);
  return appendMathematicianInformationDelivery(stateBefore.mathematicianInformation, validation.canonicalPayload);
};

export type MathematicianValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

export type MathematicianDeliveryCheckpoint = {
  readonly deliveryEventIndex: number;
  readonly preEventState: GameState;
  readonly deliveryEvent: DomainEventEnvelope<"MathematicianInformationDelivered">;
  readonly stateAfterDelivery: GameState;
  readonly settlementEvent: DomainEventEnvelope<"ScheduledTaskSettled">;
  readonly stateAfterSettlement: GameState;
};

const matchingMathematicianFact = (
  state: GameState,
  delivery: MathematicianInformationDeliveredPayload
): FirstNightAbilityOutcomeFact | undefined => {
  const matches = state.firstNightAbilityOutcomeLedger?.facts.filter((fact) =>
    fact.abilityRoleId === "mathematician" &&
    fact.abilityTaskId === delivery.taskId &&
    fact.sourcePlayerId === delivery.sourceContract.sourcePlayerId &&
    fact.sourceSeatNumber === delivery.sourceContract.sourceSeatNumber &&
    fact.sourceEventSequence === delivery.deliveryEventSequence &&
    fact.evaluatedCharacterStateRevision === delivery.settlementCharacterStateRevision &&
    fact.abilityInstance.abilityInstanceId === delivery.resolvingAbilityInstanceId &&
    fact.evidenceReferences.some((evidence) =>
      evidence.kind === "MATHEMATICIAN_DELIVERY" &&
      evidence.deliveryId === delivery.deliveryId &&
      evidence.taskId === delivery.taskId &&
      evidence.sourcePlayerId === delivery.sourceContract.sourcePlayerId &&
      evidence.trueCount === delivery.trueCount &&
      evidence.selectedCount === delivery.selectedCount &&
      evidence.terminalEventId === fact.sourceEventId
    )
  ) ?? [];
  return matches.length === 1 ? matches[0] : undefined;
};

export const validateStoredMathematicianInformationDelivered = (input: {
  readonly acceptedEvents: readonly AnyDomainEventEnvelope[];
  readonly checkpoint: MathematicianDeliveryCheckpoint;
  readonly finalState: GameState;
}): MathematicianValidationResult => {
  try {
    const { checkpoint } = input;
    const deliveryAtIndex = input.acceptedEvents[checkpoint.deliveryEventIndex];
    const settlementAtIndex = input.acceptedEvents[checkpoint.deliveryEventIndex + 1];
    if (deliveryAtIndex === undefined || settlementAtIndex === undefined ||
        deliveryAtIndex.eventType !== "MathematicianInformationDelivered" ||
        settlementAtIndex.eventType !== "ScheduledTaskSettled" ||
        !sameCanonicalDataValue(deliveryAtIndex, checkpoint.deliveryEvent) ||
        !sameCanonicalDataValue(settlementAtIndex, checkpoint.settlementEvent)) {
      return { valid: false, reason: "Mathematician checkpoint does not match one adjacent accepted delivery pair" };
    }
    if (checkpoint.preEventState.lastEventSequence !== checkpoint.deliveryEvent.eventSequence - 1 ||
        checkpoint.stateAfterDelivery.lastEventSequence !== checkpoint.deliveryEvent.eventSequence ||
        checkpoint.stateAfterSettlement.lastEventSequence !== checkpoint.settlementEvent.eventSequence ||
        checkpoint.deliveryEvent.batchId !== checkpoint.settlementEvent.batchId ||
        checkpoint.settlementEvent.eventSequence !== checkpoint.deliveryEvent.eventSequence + 1) {
      return { valid: false, reason: "Mathematician checkpoint boundaries are not exact" };
    }

    const decision = resolveFromState(checkpoint.preEventState, checkpoint.deliveryEvent.payload.taskId);
    if (decision.kind !== "READY" ||
        !sameCanonicalDataValue(decision.deliveryPayload, checkpoint.deliveryEvent.payload) ||
        !sameCanonicalDataValue(decision.settlementPayload, checkpoint.settlementEvent.payload)) {
      return { valid: false, reason: `Stored Mathematician pair differs from its historical canonical decision (${decision.kind})` };
    }

    const postDeliveryMatches = checkpoint.stateAfterDelivery.mathematicianInformation?.deliveries.filter((entry) =>
      entry.deliveryId === checkpoint.deliveryEvent.payload.deliveryId &&
      sameCanonicalDataValue(entry, checkpoint.deliveryEvent.payload)
    ) ?? [];
    if (postDeliveryMatches.length !== 1 ||
        matchingMathematicianFact(checkpoint.stateAfterDelivery, checkpoint.deliveryEvent.payload) === undefined ||
        isFirstNightTaskSettled(checkpoint.stateAfterDelivery.firstNightTaskProgress, checkpoint.deliveryEvent.payload.taskId)) {
      return { valid: false, reason: "Post-delivery Mathematician state must contain one delivery and fact while the task remains pending" };
    }

    if (!isFirstNightTaskSettled(checkpoint.stateAfterSettlement.firstNightTaskProgress, checkpoint.deliveryEvent.payload.taskId) ||
        matchingMathematicianFact(checkpoint.stateAfterSettlement, checkpoint.deliveryEvent.payload) === undefined ||
        checkpoint.stateAfterSettlement.mathematicianInformation?.deliveries.filter((entry) =>
          entry.deliveryId === checkpoint.deliveryEvent.payload.deliveryId && sameCanonicalDataValue(entry, checkpoint.deliveryEvent.payload)
        ).length !== 1) {
      return { valid: false, reason: "Post-settlement Mathematician state does not preserve the unique delivery and fact" };
    }

    const finalDelivery = input.finalState.mathematicianInformation?.deliveries.filter((entry) =>
      entry.deliveryId === checkpoint.deliveryEvent.payload.deliveryId && sameCanonicalDataValue(entry, checkpoint.deliveryEvent.payload)
    ) ?? [];
    const finalSettlement = input.finalState.firstNightTaskProgress?.settlements.filter((entry) =>
      entry.taskId === checkpoint.deliveryEvent.payload.taskId &&
      entry.outcomeType === "MATHEMATICIAN_INFORMATION_DELIVERED" &&
      entry.characterStateRevision === checkpoint.deliveryEvent.payload.settlementCharacterStateRevision
    ) ?? [];
    if (finalDelivery.length !== 1 || finalSettlement.length !== 1 ||
        matchingMathematicianFact(input.finalState, checkpoint.deliveryEvent.payload) === undefined) {
      return { valid: false, reason: "Final state does not preserve the validated Mathematician chain" };
    }
    return { valid: true };
  } catch (error: unknown) {
    return { valid: false, reason: error instanceof Error ? error.message : "Stored Mathematician validation failed closed" };
  }
};

const consecutiveBatches = (
  events: readonly AnyDomainEventEnvelope[]
): readonly (readonly AnyDomainEventEnvelope[])[] => {
  const batches: AnyDomainEventEnvelope[][] = [];
  for (const event of events) {
    const current = batches.at(-1);
    if (current === undefined || current[0]?.batchId !== event.batchId) batches.push([event]);
    else current.push(event);
  }
  return batches;
};

export const replayTrustedMathematicianProjectionStream = (
  events: readonly AnyDomainEventEnvelope[]
): { readonly finalState: GameState; readonly checkpoints: readonly MathematicianDeliveryCheckpoint[] } => {
  const captured = structuredClone(events);
  validateDomainEventStream(captured);
  let state: GameState | undefined;
  const checkpoints: MathematicianDeliveryCheckpoint[] = [];
  let eventIndex = 0;
  for (const batch of consecutiveBatches(captured)) {
    validateDomainBatchSemantics(state, batch);
    for (let batchIndex = 0; batchIndex < batch.length; batchIndex += 1) {
      const event = batch[batchIndex]!;
      if (event.eventType === "MathematicianInformationDelivered") {
        if (state === undefined) throw new DomainError("MissingGameCreated", "Mathematician delivery requires reconstructed pre-event state");
        const settlement = batch[batchIndex + 1];
        if (settlement?.eventType !== "ScheduledTaskSettled") {
          throw new DomainError("InvalidMathematicianInformationDeliveredPayload", "Mathematician delivery requires an adjacent settlement checkpoint");
        }
        const preEventState = structuredClone(state);
        state = applyDomainEvent(state, event);
        const stateAfterDelivery = structuredClone(state);
        state = applyDomainEvent(state, settlement);
        const stateAfterSettlement = structuredClone(state);
        checkpoints.push({
          deliveryEventIndex: eventIndex,
          preEventState,
          deliveryEvent: structuredClone(event),
          stateAfterDelivery,
          settlementEvent: structuredClone(settlement),
          stateAfterSettlement
        });
        batchIndex += 1;
        eventIndex += 2;
        continue;
      }
      state = applyDomainEvent(state, event);
      eventIndex += 1;
    }
  }
  if (state === undefined) throw new DomainError("EmptyEventStream", "Cannot replay an empty Mathematician projection stream");
  const finalState = structuredClone(state);
  for (const checkpoint of checkpoints) {
    const validation = validateStoredMathematicianInformationDelivered({ acceptedEvents: captured, checkpoint, finalState });
    if (!validation.valid) throw new DomainError("InvalidMathematicianInformationDeliveredPayload", validation.reason);
  }
  return { finalState, checkpoints };
};
