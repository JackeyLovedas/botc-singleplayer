import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CharacterAssignmentSet } from "./character-assignment.js";
import type { CurrentAlignment, CurrentCharacterStateSet } from "./current-character-state.js";
import { DomainError } from "./errors.js";
import type {
  AbilityImpairmentId,
  AbilityInstanceId,
  AbilityUseEntitlementId,
  ActionOpportunityId,
  CandidateId,
  EventId,
  GrantedAbilityId,
  PlayerId,
  RoleTenureId,
  RoleTenureTransitionFactId,
  ScheduledTaskId
} from "./ids.js";
import {
  abilityInstanceId,
  abilityUseEntitlementId,
  candidateId,
  grantedAbilityId,
  roleTenureId,
  roleTenureTransitionFactId
} from "./ids.js";
import {
  hasExactEnumerableKeys,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord
} from "./initial-private-knowledge.js";
import type { AbilityImpairmentSet, PhilosopherGrantedAbility } from "./philosopher-ability.js";
import type { SeatNumber } from "./player-roster.js";
import type { ScheduledTaskSettlement, ScheduledTaskSettledPayload } from "./first-night-task-plan.js";
import {
  SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  validateScheduledTaskSettlementShape
} from "./first-night-task-plan.js";
import type { SnakeCharmerDemonSwapAppliedPayload } from "./snake-charmer.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import { SUPPORTED_SCRIPT_ID } from "./setup-types.js";

export const SEAMSTRESS_RESOLUTION_CAPABILITY_VERSION =
  "seamstress-snv-first-night-resolution-v1" as const;
export const SEAMSTRESS_DELIVERY_POLICY_VERSION =
  "seamstress-truth-favoring-delivery-policy-v1" as const;
export const SEAMSTRESS_INFORMATION_MODEL_VERSION = "seamstress-information-model-v1" as const;
export const SEAMSTRESS_INFORMATION_STAGE = "SEAMSTRESS_INFORMATION" as const;
export const SEAMSTRESS_ANSWER_CANDIDATE_MODEL_VERSION =
  "seamstress-answer-candidates-v1" as const;
export const PRIVATE_VIEW_SEAMSTRESS_MODEL_VERSION = "seamstress-private-knowledge-v1" as const;
export const SEAMSTRESS_ACTION_SCHEMA_VERSION = "seamstress-action-v2" as const;
export const SEAMSTRESS_SPEND_MODEL_VERSION = "seamstress-ability-spend-v1" as const;

export type SeamstressResolutionCapabilityDeclaredPayload = {
  readonly rulesBaselineVersion: string;
  readonly capabilityVersion: typeof SEAMSTRESS_RESOLUTION_CAPABILITY_VERSION;
  readonly scriptId: typeof SUPPORTED_SCRIPT_ID;
  readonly supportedRoleCatalogSignature: "canonical-role-catalog-v1:60ac4718";
  readonly targetPopulationModel: "FIXED_ROSTER_WITHOUT_LIFE_OR_TRAVELLER_STATE";
  readonly alignmentModel: "NATIVE_CURRENT_ALIGNMENT_ONLY";
  readonly sourceEffectCoverage: "REPRESENTED_IMPAIRMENTS_WITH_UNRESOLVED_CONTINUOUS_EFFECTS";
  readonly deliveryPolicyVersion: typeof SEAMSTRESS_DELIVERY_POLICY_VERSION;
};

export type SeamstressRelevantRoleId = "cerenovus" | "philosopher" | "seamstress" | "vortox";

export type RoleTenureStartFact =
  | {
      readonly kind: "CHARACTERS_ASSIGNED";
      readonly sourceEventId: EventId;
      readonly sourceEventSequence: number;
      readonly characterStateRevision: 1;
    }
  | {
      readonly kind: "ROLE_TENURE_TRANSITION";
      readonly transitionFactId: RoleTenureTransitionFactId;
      readonly sourceEventId: EventId;
      readonly sourceEventSequence: number;
      readonly previousCharacterStateRevision: number;
      readonly nextCharacterStateRevision: number;
    };

export type RoleTenureRecord = {
  readonly roleTenureId: RoleTenureId;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: SeamstressRelevantRoleId;
  readonly acquiredCharacterStateRevision: number;
  readonly endedCharacterStateRevision?: number;
  readonly startedBy: RoleTenureStartFact;
};

export type RoleTenureState = {
  readonly records: readonly RoleTenureRecord[];
  readonly processedTransitionFactIds: readonly RoleTenureTransitionFactId[];
};

export type RoleTenureTransitionFact = {
  readonly transitionFactId: RoleTenureTransitionFactId;
  readonly sourceEventId: EventId;
  readonly sourceEventSequence: number;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly previousCharacterStateRevision: number;
  readonly nextCharacterStateRevision: number;
  readonly beforeRole: RoleSetupSnapshot;
  readonly afterRole: RoleSetupSnapshot;
};

export type SeamstressAbilitySourceDescriptor =
  | {
      readonly kind: "ROLE_TENURE";
      readonly abilityRoleId: "seamstress";
      readonly roleTenureId: RoleTenureId;
      readonly acquiredCharacterStateRevision: number;
    }
  | {
      readonly kind: "PHILOSOPHER_GRANT";
      readonly abilityRoleId: "seamstress";
      readonly grantId: GrantedAbilityId;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly acquiredCharacterStateRevision: number;
    };

export type SeamstressAbilityInstance = {
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityRoleId: "seamstress";
  readonly holderPlayerId: PlayerId;
  readonly holderSeatNumber: SeatNumber;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly source: SeamstressAbilitySourceDescriptor;
  readonly acquiredCharacterStateRevision: number;
  readonly endedCharacterStateRevision?: number;
};

export type SeamstressAbilityUseEntitlement = {
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly abilityInstanceId: AbilityInstanceId;
  readonly entitlementKind: "BASE_ONCE_PER_GAME";
  readonly status: "UNSPENT" | "SPENT";
};

export type SeamstressAbilityState = {
  readonly instances: readonly SeamstressAbilityInstance[];
  readonly entitlements: readonly SeamstressAbilityUseEntitlement[];
};

export type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

const fail = (reason: string): ValidationResult => ({ valid: false, reason });
const isPositiveInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value > 0;
const isSeatNumber = (value: unknown): value is SeatNumber =>
  typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 12;
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) return false;
  }
  return true;
};
const seatText = (seatNumber: SeatNumber): string => String(seatNumber).padStart(2, "0");
const isRelevantRoleId = (value: unknown): value is SeamstressRelevantRoleId =>
  value === "cerenovus" || value === "philosopher" || value === "seamstress" || value === "vortox";

const CAPABILITY_KEYS = [
  "alignmentModel",
  "capabilityVersion",
  "deliveryPolicyVersion",
  "rulesBaselineVersion",
  "scriptId",
  "sourceEffectCoverage",
  "supportedRoleCatalogSignature",
  "targetPopulationModel"
] as const;

export const createSeamstressResolutionCapabilityDeclaredPayload = (
  rulesBaselineVersion: string
): SeamstressResolutionCapabilityDeclaredPayload => ({
  rulesBaselineVersion,
  capabilityVersion: SEAMSTRESS_RESOLUTION_CAPABILITY_VERSION,
  scriptId: SUPPORTED_SCRIPT_ID,
  supportedRoleCatalogSignature: "canonical-role-catalog-v1:60ac4718",
  targetPopulationModel: "FIXED_ROSTER_WITHOUT_LIFE_OR_TRAVELLER_STATE",
  alignmentModel: "NATIVE_CURRENT_ALIGNMENT_ONLY",
  sourceEffectCoverage: "REPRESENTED_IMPAIRMENTS_WITH_UNRESOLVED_CONTINUOUS_EFFECTS",
  deliveryPolicyVersion: SEAMSTRESS_DELIVERY_POLICY_VERSION
});

export const validateSeamstressResolutionCapabilityDeclaredPayload = (
  value: unknown
): ValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, CAPABILITY_KEYS)) {
    return fail("SeamstressResolutionCapabilityDeclared payload must have exact runtime shape");
  }
  const expected = createSeamstressResolutionCapabilityDeclaredPayload(
    typeof value.rulesBaselineVersion === "string" ? value.rulesBaselineVersion : ""
  );
  for (const key of CAPABILITY_KEYS) {
    if (value[key] !== expected[key]) {
      return fail("SeamstressResolutionCapabilityDeclared payload contains unsupported values");
    }
  }
  return { valid: true };
};

export const formatRoleTenureId = (input: {
  readonly seatNumber: SeatNumber;
  readonly roleId: SeamstressRelevantRoleId;
  readonly acquiredCharacterStateRevision: number;
}): RoleTenureId => {
  if (!isSeatNumber(input.seatNumber) || !isRelevantRoleId(input.roleId) ||
      !isPositiveInteger(input.acquiredCharacterStateRevision)) {
    throw new DomainError("InvalidRoleTenureId", "Role tenure ID input must use a canonical seat, role, and revision");
  }
  return roleTenureId(
    `role-tenure-v1:seat-${seatText(input.seatNumber)}:role-${input.roleId}:acquired-revision-${input.acquiredCharacterStateRevision}`
  );
};

export type ParseRoleTenureIdResult =
  | {
      readonly valid: true;
      readonly seatNumber: SeatNumber;
      readonly roleId: SeamstressRelevantRoleId;
      readonly acquiredCharacterStateRevision: number;
    }
  | { readonly valid: false; readonly reason: string };

export const parseRoleTenureId = (value: unknown): ParseRoleTenureIdResult => {
  if (typeof value !== "string") return { valid: false, reason: "RoleTenureId must be a string" };
  const match = /^role-tenure-v1:seat-(0[1-9]|1[0-2]):role-(cerenovus|philosopher|seamstress|vortox):acquired-revision-([1-9][0-9]*)$/.exec(value);
  if (match === null) return { valid: false, reason: "RoleTenureId does not match the canonical grammar" };
  const parsed = {
    seatNumber: Number(match[1]) as SeatNumber,
    roleId: match[2] as SeamstressRelevantRoleId,
    acquiredCharacterStateRevision: Number(match[3])
  };
  if (!Number.isSafeInteger(parsed.acquiredCharacterStateRevision) ||
      formatRoleTenureId(parsed) !== value) {
    return { valid: false, reason: "RoleTenureId is not canonical" };
  }
  return { valid: true, ...parsed };
};

export const sameRoleTenureId = (left: unknown, right: unknown): boolean => {
  const a = parseRoleTenureId(left);
  const b = parseRoleTenureId(right);
  return a.valid && b.valid && a.seatNumber === b.seatNumber && a.roleId === b.roleId &&
    a.acquiredCharacterStateRevision === b.acquiredCharacterStateRevision && left === right;
};

export const formatRoleTenureTransitionFactId = (input: {
  readonly sourceEventSequence: number;
  readonly seatNumber: SeatNumber;
  readonly nextCharacterStateRevision: number;
}): RoleTenureTransitionFactId => {
  if (!isPositiveInteger(input.sourceEventSequence) || !isSeatNumber(input.seatNumber) ||
      !isPositiveInteger(input.nextCharacterStateRevision)) {
    throw new DomainError("InvalidRoleTenureTransitionFact", "Role tenure transition ID input is invalid");
  }
  return roleTenureTransitionFactId(
    `role-tenure-transition-v1:event-sequence-${input.sourceEventSequence}:seat-${seatText(input.seatNumber)}:next-revision-${input.nextCharacterStateRevision}`
  );
};

export type ParseRoleTenureTransitionFactIdResult =
  | { readonly valid: true; readonly sourceEventSequence: number; readonly seatNumber: SeatNumber; readonly nextCharacterStateRevision: number }
  | { readonly valid: false; readonly reason: string };

export const parseRoleTenureTransitionFactId = (value: unknown): ParseRoleTenureTransitionFactIdResult => {
  if (typeof value !== "string") return { valid: false, reason: "RoleTenureTransitionFactId must be a string" };
  const match = /^role-tenure-transition-v1:event-sequence-([1-9][0-9]*):seat-(0[1-9]|1[0-2]):next-revision-([1-9][0-9]*)$/.exec(value);
  if (match === null) return { valid: false, reason: "RoleTenureTransitionFactId does not match the canonical grammar" };
  const parsed = {
    sourceEventSequence: Number(match[1]),
    seatNumber: Number(match[2]) as SeatNumber,
    nextCharacterStateRevision: Number(match[3])
  };
  if (!Number.isSafeInteger(parsed.sourceEventSequence) || !Number.isSafeInteger(parsed.nextCharacterStateRevision) ||
      formatRoleTenureTransitionFactId(parsed) !== value) {
    return { valid: false, reason: "RoleTenureTransitionFactId is not canonical" };
  }
  return { valid: true, ...parsed };
};

const cloneRoleTenureRecord = (record: RoleTenureRecord): RoleTenureRecord => ({
  roleTenureId: record.roleTenureId,
  playerId: record.playerId,
  seatNumber: record.seatNumber,
  roleId: record.roleId,
  acquiredCharacterStateRevision: record.acquiredCharacterStateRevision,
  ...(record.endedCharacterStateRevision === undefined ? {} : { endedCharacterStateRevision: record.endedCharacterStateRevision }),
  startedBy: { ...record.startedBy }
});

export const cloneRoleTenureState = (state: RoleTenureState | undefined): RoleTenureState => ({
  records: state?.records.map(cloneRoleTenureRecord) ?? [],
  processedTransitionFactIds: [...(state?.processedTransitionFactIds ?? [])]
});

export const bootstrapRoleTenuresFromCharactersAssigned = (input: {
  readonly assignments: CharacterAssignmentSet;
  readonly sourceEventId: EventId;
  readonly sourceEventSequence: number;
}): RoleTenureState => ({
  records: input.assignments
    .filter((assignment) => isRelevantRoleId(assignment.role.roleId))
    .sort((left, right) => left.seatNumber - right.seatNumber)
    .map((assignment) => ({
      roleTenureId: formatRoleTenureId({
        seatNumber: assignment.seatNumber,
        roleId: assignment.role.roleId as SeamstressRelevantRoleId,
        acquiredCharacterStateRevision: 1
      }),
      playerId: assignment.playerId,
      seatNumber: assignment.seatNumber,
      roleId: assignment.role.roleId as SeamstressRelevantRoleId,
      acquiredCharacterStateRevision: 1,
      startedBy: {
        kind: "CHARACTERS_ASSIGNED" as const,
        sourceEventId: input.sourceEventId,
        sourceEventSequence: input.sourceEventSequence,
        characterStateRevision: 1 as const
      }
    })),
  processedTransitionFactIds: []
});

export const validateRoleTenureTransitionFact = (fact: unknown): ValidationResult => {
  const keys = ["afterRole", "beforeRole", "nextCharacterStateRevision", "playerId", "previousCharacterStateRevision", "seatNumber", "sourceEventId", "sourceEventSequence", "transitionFactId"] as const;
  if (!isPlainRecord(fact) || !hasExactEnumerableKeys(fact, keys)) return fail("RoleTenureTransitionFact must have exact runtime shape");
  if (!isNonEmptyString(fact.playerId) || !isSeatNumber(fact.seatNumber) || !isNonEmptyString(fact.sourceEventId) ||
      !isPositiveInteger(fact.sourceEventSequence) || !isPositiveInteger(fact.previousCharacterStateRevision) ||
      fact.nextCharacterStateRevision !== fact.previousCharacterStateRevision + 1 ||
      !hasExactRoleSetupSnapshotShape(fact.beforeRole) || !hasExactRoleSetupSnapshotShape(fact.afterRole) ||
      fact.beforeRole.roleId === fact.afterRole.roleId) {
    return fail("RoleTenureTransitionFact fields are invalid");
  }
  const parsed = parseRoleTenureTransitionFactId(fact.transitionFactId);
  if (!parsed.valid || parsed.sourceEventSequence !== fact.sourceEventSequence || parsed.seatNumber !== fact.seatNumber ||
      parsed.nextCharacterStateRevision !== fact.nextCharacterStateRevision) {
    return fail("RoleTenureTransitionFact ID must exactly match the fact");
  }
  return { valid: true };
};

export const roleTenureTransitionFactsFromSnakeCharmerDemonSwap = (input: {
  readonly eventId: EventId;
  readonly eventSequence: number;
  readonly payload: SnakeCharmerDemonSwapAppliedPayload;
}): readonly RoleTenureTransitionFact[] => {
  const pairs = [
    [input.payload.sourceBefore, input.payload.sourceAfter],
    [input.payload.targetBefore, input.payload.targetAfter]
  ] as const;
  return pairs
    .filter(([before, after]) => before.role.roleId !== after.role.roleId)
    .map(([before, after]) => ({
      transitionFactId: formatRoleTenureTransitionFactId({
        sourceEventSequence: input.eventSequence,
        seatNumber: before.seatNumber,
        nextCharacterStateRevision: input.payload.nextCharacterStateRevision
      }),
      sourceEventId: input.eventId,
      sourceEventSequence: input.eventSequence,
      playerId: before.playerId,
      seatNumber: before.seatNumber,
      previousCharacterStateRevision: input.payload.previousCharacterStateRevision,
      nextCharacterStateRevision: input.payload.nextCharacterStateRevision,
      beforeRole: cloneRoleSetupSnapshot(before.role),
      afterRole: cloneRoleSetupSnapshot(after.role)
    }))
    .sort((left, right) => left.seatNumber - right.seatNumber);
};

export const applyRoleTenureTransitionFact = (
  state: RoleTenureState | undefined,
  fact: RoleTenureTransitionFact
): RoleTenureState => {
  const validation = validateRoleTenureTransitionFact(fact);
  if (!validation.valid) throw new DomainError("InvalidRoleTenureTransitionFact", validation.reason);
  const current = cloneRoleTenureState(state);
  if (current.processedTransitionFactIds.includes(fact.transitionFactId)) {
    throw new DomainError("InvalidRoleTenureTransitionFact", "Role tenure transition fact was already processed");
  }
  const beforeRelevant = isRelevantRoleId(fact.beforeRole.roleId);
  const afterRelevant = isRelevantRoleId(fact.afterRole.roleId);
  const activeBefore = current.records.filter((record) =>
    record.playerId === fact.playerId && record.seatNumber === fact.seatNumber &&
    record.roleId === fact.beforeRole.roleId && record.endedCharacterStateRevision === undefined
  );
  const matchingActiveBefore = activeBefore[0];
  if (beforeRelevant && (activeBefore.length !== 1 || matchingActiveBefore === undefined ||
      matchingActiveBefore.acquiredCharacterStateRevision > fact.previousCharacterStateRevision)) {
    throw new DomainError("InvalidRoleTenureTransitionFact", "Role tenure transition requires exactly one matching active before tenure");
  }
  if (!beforeRelevant && activeBefore.length !== 0) {
    throw new DomainError("InvalidRoleTenureTransitionFact", "Irrelevant before role cannot have a tracked active tenure");
  }
  const nextId = afterRelevant ? formatRoleTenureId({
    seatNumber: fact.seatNumber,
    roleId: fact.afterRole.roleId,
    acquiredCharacterStateRevision: fact.nextCharacterStateRevision
  }) : undefined;
  if (nextId !== undefined && current.records.some((record) => record.roleTenureId === nextId)) {
    throw new DomainError("InvalidRoleTenureTransitionFact", "Role tenure transition would create a duplicate tenure ID");
  }
  const records = current.records.map((record) =>
    activeBefore.some((active) => active.roleTenureId === record.roleTenureId)
      ? { ...record, endedCharacterStateRevision: fact.nextCharacterStateRevision }
      : record
  );
  if (afterRelevant && nextId !== undefined) {
    records.push({
      roleTenureId: nextId,
      playerId: fact.playerId,
      seatNumber: fact.seatNumber,
      roleId: fact.afterRole.roleId,
      acquiredCharacterStateRevision: fact.nextCharacterStateRevision,
      startedBy: {
        kind: "ROLE_TENURE_TRANSITION",
        transitionFactId: fact.transitionFactId,
        sourceEventId: fact.sourceEventId,
        sourceEventSequence: fact.sourceEventSequence,
        previousCharacterStateRevision: fact.previousCharacterStateRevision,
        nextCharacterStateRevision: fact.nextCharacterStateRevision
      }
    });
  }
  return {
    records,
    processedTransitionFactIds: [...current.processedTransitionFactIds, fact.transitionFactId]
  };
};

export const isRoleTenureActiveAt = (record: RoleTenureRecord, revision: number): boolean =>
  record.acquiredCharacterStateRevision <= revision &&
  (record.endedCharacterStateRevision === undefined || revision < record.endedCharacterStateRevision);

export const isRoleTenureContinuousAcross = (record: RoleTenureRecord, start: number, end: number): boolean =>
  isPositiveInteger(start) && isPositiveInteger(end) && end >= start &&
  record.acquiredCharacterStateRevision <= start &&
  (record.endedCharacterStateRevision === undefined || record.endedCharacterStateRevision > end);

export type ParsedSeamstressAbilityInstanceId =
  | {
      readonly valid: true;
      readonly sourceKind: "ROLE_TENURE";
      readonly sourceRoleTenureId: RoleTenureId;
      readonly seatNumber: SeatNumber;
      readonly acquiredCharacterStateRevision: number;
    }
  | {
      readonly valid: true;
      readonly sourceKind: "PHILOSOPHER_GRANT";
      readonly sourceRoleTenureId: RoleTenureId;
      readonly grantId: GrantedAbilityId;
      readonly seatNumber: SeatNumber;
      readonly acquiredCharacterStateRevision: number;
    }
  | { readonly valid: false; readonly reason: string };

export const formatBaseSeamstressAbilityInstanceId = (
  sourceRoleTenureId: RoleTenureId
): AbilityInstanceId => {
  const parsed = parseRoleTenureId(sourceRoleTenureId);
  if (!parsed.valid || parsed.roleId !== "seamstress") {
    throw new DomainError("InvalidSeamstressAbilityInstanceId", "Base Seamstress instance requires a canonical Seamstress role tenure");
  }
  return abilityInstanceId(
    `seamstress-ability-instance-v1:ROLE_TENURE:seat-${seatText(parsed.seatNumber)}:role-seamstress:acquired-revision-${parsed.acquiredCharacterStateRevision}`
  );
};

const parsePhilosopherGrantId = (value: unknown): { readonly valid: true; readonly seatNumber: SeatNumber } | { readonly valid: false } => {
  if (typeof value !== "string") return { valid: false };
  const match = /^philosopher-grant-v1:seat-(0[1-9]|1[0-2]):from-seamstress$/.exec(value);
  if (match === null) return { valid: false };
  return { valid: true, seatNumber: Number(match[1]) as SeatNumber };
};

export const formatPhilosopherGrantedSeamstressAbilityInstanceId = (input: {
  readonly sourceRoleTenureId: RoleTenureId;
  readonly grantId: GrantedAbilityId;
  readonly grant: PhilosopherGrantedAbility;
  readonly tenure: RoleTenureRecord;
}): AbilityInstanceId => {
  const tenureId = parseRoleTenureId(input.sourceRoleTenureId);
  const grantIdResult = parsePhilosopherGrantId(input.grantId);
  if (!tenureId.valid || tenureId.roleId !== "philosopher" || !grantIdResult.valid ||
      grantIdResult.seatNumber !== tenureId.seatNumber || input.tenure.roleTenureId !== input.sourceRoleTenureId ||
      input.tenure.playerId !== input.grant.sourcePlayerId || input.tenure.seatNumber !== input.grant.sourceSeatNumber ||
      input.tenure.roleId !== "philosopher" || input.grant.sourceRole.roleId !== "philosopher" ||
      input.grant.chosenRoleId !== "seamstress" || input.grant.grantId !== input.grantId ||
      input.grant.sourceSeatNumber !== tenureId.seatNumber) {
    throw new DomainError("InvalidSeamstressAbilityInstanceId", "Philosopher Seamstress instance inputs must match one exact grant and tenure");
  }
  return abilityInstanceId(
    `seamstress-ability-instance-v1:PHILOSOPHER_GRANT:seat-${seatText(tenureId.seatNumber)}:role-philosopher:acquired-revision-${tenureId.acquiredCharacterStateRevision}:grant-from-seamstress`
  );
};

export const parseSeamstressAbilityInstanceId = (value: unknown): ParsedSeamstressAbilityInstanceId => {
  if (typeof value !== "string") return { valid: false, reason: "AbilityInstanceId must be a string" };
  const base = /^seamstress-ability-instance-v1:ROLE_TENURE:seat-(0[1-9]|1[0-2]):role-seamstress:acquired-revision-([1-9][0-9]*)$/.exec(value);
  if (base !== null) {
    const sourceRoleTenureId = formatRoleTenureId({
      seatNumber: Number(base[1]) as SeatNumber,
      roleId: "seamstress",
      acquiredCharacterStateRevision: Number(base[2])
    });
    if (formatBaseSeamstressAbilityInstanceId(sourceRoleTenureId) !== value) return { valid: false, reason: "AbilityInstanceId is not canonical" };
    return {
      valid: true,
      sourceKind: "ROLE_TENURE",
      sourceRoleTenureId,
      seatNumber: Number(base[1]) as SeatNumber,
      acquiredCharacterStateRevision: Number(base[2])
    };
  }
  const grant = /^seamstress-ability-instance-v1:PHILOSOPHER_GRANT:seat-(0[1-9]|1[0-2]):role-philosopher:acquired-revision-([1-9][0-9]*):grant-from-seamstress$/.exec(value);
  if (grant === null) return { valid: false, reason: "AbilityInstanceId does not match a canonical source-kind branch" };
  const seatNumber = Number(grant[1]) as SeatNumber;
  const acquiredCharacterStateRevision = Number(grant[2]);
  if (!Number.isSafeInteger(acquiredCharacterStateRevision)) return { valid: false, reason: "AbilityInstanceId revision is invalid" };
  return {
    valid: true,
    sourceKind: "PHILOSOPHER_GRANT",
    sourceRoleTenureId: formatRoleTenureId({ seatNumber, roleId: "philosopher", acquiredCharacterStateRevision }),
    grantId: grantedAbilityId(`philosopher-grant-v1:seat-${seatText(seatNumber)}:from-seamstress`),
    seatNumber,
    acquiredCharacterStateRevision
  };
};

export const sameAbilityInstanceId = (left: unknown, right: unknown): boolean => {
  const a = parseSeamstressAbilityInstanceId(left);
  const b = parseSeamstressAbilityInstanceId(right);
  if (!a.valid || !b.valid || a.sourceKind !== b.sourceKind || left !== right) return false;
  return a.sourceRoleTenureId === b.sourceRoleTenureId &&
    (a.sourceKind === "ROLE_TENURE" || (b.sourceKind === "PHILOSOPHER_GRANT" && a.grantId === b.grantId));
};

export const formatSeamstressAbilityUseEntitlementId = (
  instanceId: AbilityInstanceId
): AbilityUseEntitlementId => {
  if (!parseSeamstressAbilityInstanceId(instanceId).valid) {
    throw new DomainError("InvalidSeamstressAbilityUseEntitlementId", "Entitlement requires a canonical Seamstress ability instance ID");
  }
  return abilityUseEntitlementId(`seamstress-use-entitlement-v1:${instanceId}:BASE_ONCE_PER_GAME`);
};

export const parseSeamstressAbilityUseEntitlementId = (
  value: unknown
): { readonly valid: true; readonly abilityInstanceId: AbilityInstanceId } | { readonly valid: false; readonly reason: string } => {
  if (typeof value !== "string") return { valid: false, reason: "AbilityUseEntitlementId must be a string" };
  const prefix = "seamstress-use-entitlement-v1:";
  const suffix = ":BASE_ONCE_PER_GAME";
  if (!value.startsWith(prefix) || !value.endsWith(suffix)) return { valid: false, reason: "AbilityUseEntitlementId has invalid grammar" };
  const parsedInstance = value.slice(prefix.length, -suffix.length) as AbilityInstanceId;
  if (!parseSeamstressAbilityInstanceId(parsedInstance).valid || formatSeamstressAbilityUseEntitlementId(parsedInstance) !== value) {
    return { valid: false, reason: "AbilityUseEntitlementId is not canonical" };
  }
  return { valid: true, abilityInstanceId: parsedInstance };
};

const baseAbilityForTenure = (tenure: RoleTenureRecord): { readonly instance: SeamstressAbilityInstance; readonly entitlement: SeamstressAbilityUseEntitlement } => {
  const instanceId = formatBaseSeamstressAbilityInstanceId(tenure.roleTenureId);
  return {
    instance: {
      abilityInstanceId: instanceId,
      abilityRoleId: "seamstress",
      holderPlayerId: tenure.playerId,
      holderSeatNumber: tenure.seatNumber,
      sourceRoleTenureId: tenure.roleTenureId,
      source: {
        kind: "ROLE_TENURE",
        abilityRoleId: "seamstress",
        roleTenureId: tenure.roleTenureId,
        acquiredCharacterStateRevision: tenure.acquiredCharacterStateRevision
      },
      acquiredCharacterStateRevision: tenure.acquiredCharacterStateRevision,
      ...(tenure.endedCharacterStateRevision === undefined ? {} : { endedCharacterStateRevision: tenure.endedCharacterStateRevision })
    },
    entitlement: {
      abilityUseEntitlementId: formatSeamstressAbilityUseEntitlementId(instanceId),
      abilityInstanceId: instanceId,
      entitlementKind: "BASE_ONCE_PER_GAME",
      status: "UNSPENT"
    }
  };
};

export const bootstrapSeamstressAbilityState = (tenures: RoleTenureState): SeamstressAbilityState => {
  const pairs = tenures.records.filter((record) => record.roleId === "seamstress").map(baseAbilityForTenure);
  return { instances: pairs.map((pair) => pair.instance), entitlements: pairs.map((pair) => pair.entitlement) };
};

export const cloneSeamstressAbilityState = (state: SeamstressAbilityState | undefined): SeamstressAbilityState => ({
  instances: state?.instances.map((instance) => ({
    ...instance,
    source: { ...instance.source },
    ...(instance.endedCharacterStateRevision === undefined ? {} : { endedCharacterStateRevision: instance.endedCharacterStateRevision })
  })) ?? [],
  entitlements: state?.entitlements.map((entitlement) => ({ ...entitlement })) ?? []
});

export const reconcileSeamstressAbilityStateWithRoleTenures = (
  state: SeamstressAbilityState | undefined,
  tenures: RoleTenureState
): SeamstressAbilityState => {
  const current = cloneSeamstressAbilityState(state);
  let instances = current.instances.map((instance) => {
    const tenure = tenures.records.find((record) => record.roleTenureId === instance.sourceRoleTenureId);
    return tenure?.endedCharacterStateRevision !== undefined && instance.endedCharacterStateRevision === undefined
      ? { ...instance, endedCharacterStateRevision: tenure.endedCharacterStateRevision }
      : instance;
  });
  let entitlements = [...current.entitlements];
  for (const tenure of tenures.records.filter((record) => record.roleId === "seamstress")) {
    const pair = baseAbilityForTenure(tenure);
    if (!instances.some((instance) => instance.abilityInstanceId === pair.instance.abilityInstanceId)) {
      instances = [...instances, pair.instance];
      entitlements = [...entitlements, pair.entitlement];
    }
  }
  return { instances, entitlements };
};

export const appendPhilosopherGrantedSeamstressAbility = (input: {
  readonly state: SeamstressAbilityState | undefined;
  readonly roleTenures: RoleTenureState;
  readonly grant: PhilosopherGrantedAbility;
}): SeamstressAbilityState => {
  if (input.grant.chosenRoleId !== "seamstress") return cloneSeamstressAbilityState(input.state);
  const tenures = input.roleTenures.records.filter((tenure) =>
    tenure.playerId === input.grant.sourcePlayerId && tenure.seatNumber === input.grant.sourceSeatNumber &&
    tenure.roleId === "philosopher" && isRoleTenureActiveAt(tenure, input.grant.sourceCharacterStateRevision)
  );
  if (tenures.length !== 1 || tenures[0] === undefined) {
    throw new DomainError("InvalidSeamstressAbilityInstanceId", "Philosopher Seamstress grant requires one active Philosopher tenure");
  }
  const tenure = tenures[0];
  const instanceId = formatPhilosopherGrantedSeamstressAbilityInstanceId({
    sourceRoleTenureId: tenure.roleTenureId,
    grantId: input.grant.grantId,
    grant: input.grant,
    tenure
  });
  const current = cloneSeamstressAbilityState(input.state);
  if (current.instances.some((instance) => instance.abilityInstanceId === instanceId)) return current;
  const instance: SeamstressAbilityInstance = {
    abilityInstanceId: instanceId,
    abilityRoleId: "seamstress",
    holderPlayerId: tenure.playerId,
    holderSeatNumber: tenure.seatNumber,
    sourceRoleTenureId: tenure.roleTenureId,
    source: {
      kind: "PHILOSOPHER_GRANT",
      abilityRoleId: "seamstress",
      grantId: input.grant.grantId,
      sourceRoleTenureId: tenure.roleTenureId,
      acquiredCharacterStateRevision: tenure.acquiredCharacterStateRevision
    },
    acquiredCharacterStateRevision: tenure.acquiredCharacterStateRevision
  };
  return {
    instances: [...current.instances, instance],
    entitlements: [...current.entitlements, {
      abilityUseEntitlementId: formatSeamstressAbilityUseEntitlementId(instanceId),
      abilityInstanceId: instanceId,
      entitlementKind: "BASE_ONCE_PER_GAME",
      status: "UNSPENT"
    }]
  };
};

export const findActiveSeamstressAbilityForSource = (input: {
  readonly roleTenures: RoleTenureState | undefined;
  readonly abilityState: SeamstressAbilityState | undefined;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceKind: "ROLE" | "PHILOSOPHER_GAINED_ABILITY";
  readonly revision: number;
  readonly grantId?: GrantedAbilityId;
}): { readonly tenure: RoleTenureRecord; readonly instance: SeamstressAbilityInstance; readonly entitlement: SeamstressAbilityUseEntitlement } | undefined => {
  const instances = input.abilityState?.instances.filter((instance) => {
    const tenure = input.roleTenures?.records.find((record) => record.roleTenureId === instance.sourceRoleTenureId);
    return instance.holderPlayerId === input.sourcePlayerId && instance.holderSeatNumber === input.sourceSeatNumber &&
      tenure !== undefined && isRoleTenureContinuousAcross(tenure, input.revision, input.revision) &&
      (input.sourceKind === "ROLE" ? instance.source.kind === "ROLE_TENURE" :
        instance.source.kind === "PHILOSOPHER_GRANT" && (input.grantId === undefined || instance.source.grantId === input.grantId));
  }) ?? [];
  if (instances.length !== 1 || instances[0] === undefined) return undefined;
  const instance = instances[0];
  const tenure = input.roleTenures?.records.find((record) => record.roleTenureId === instance.sourceRoleTenureId);
  const entitlement = input.abilityState?.entitlements.find((entry) => entry.abilityInstanceId === instance.abilityInstanceId);
  return tenure === undefined || entitlement === undefined ? undefined : { tenure, instance, entitlement };
};

export type SeamstressTargetsChosenPayload = {
  readonly rulesBaselineVersion: string;
  readonly actionSchemaVersion: typeof SEAMSTRESS_ACTION_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SEAMSTRESS_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly decisionKind: "CHOOSE_TWO_PLAYERS";
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly opportunityCharacterStateRevision: number;
  readonly settlementCharacterStateRevision: number;
  readonly targetPlayerIds: readonly [PlayerId, PlayerId];
  readonly targetSeatNumbers: readonly [SeatNumber, SeatNumber];
};

export type SeamstressAbilitySpentPayload = {
  readonly rulesBaselineVersion: string;
  readonly spendModelVersion: typeof SEAMSTRESS_SPEND_MODEL_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SEAMSTRESS_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly opportunityCharacterStateRevision: number;
  readonly settlementCharacterStateRevision: number;
  readonly spendReason: "LEGAL_TWO_PLAYER_SELECTION";
};

export type SeamstressAlignmentComparison = {
  readonly characterStateRevision: number;
  readonly alignmentModel: "NATIVE_CURRENT_ALIGNMENT_ONLY";
  readonly targets: readonly [
    { readonly playerId: PlayerId; readonly seatNumber: SeatNumber; readonly currentAlignment: CurrentAlignment },
    { readonly playerId: PlayerId; readonly seatNumber: SeatNumber; readonly currentAlignment: CurrentAlignment }
  ];
  readonly ruleCorrectAnswer: "YES" | "NO";
};

export type SeamstressRepresentedImpairmentEvidence = {
  readonly impairmentId: AbilityImpairmentId;
  readonly impairmentKind: "DRUNK" | "POISONED";
  readonly impairmentSourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" | "SNAKE_CHARMER_DEMON_HIT";
  readonly appliedCharacterStateRevision: number;
};

export type SeamstressSourceEffectiveness =
  | {
      readonly kind: "KNOWN_INEFFECTIVE";
      readonly representedImpairments: readonly [
        SeamstressRepresentedImpairmentEvidence,
        ...SeamstressRepresentedImpairmentEvidence[]
      ];
      readonly unresolvedEffectKinds: readonly ["CONTINUOUS_POISON_NOT_MODELED"];
    }
  | {
      readonly kind: "NOT_PROVEN";
      readonly representedImpairments: readonly [];
      readonly unresolvedEffectKinds: readonly ["CONTINUOUS_POISON_NOT_MODELED"];
    };

export type SeamstressDeliveryConstraint =
  | { readonly kind: "NONE" }
  | {
      readonly kind: "VORTOX_FALSE_REQUIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleTenureId: RoleTenureId;
    };

export type SeamstressAnswerCandidate = {
  readonly candidateId: CandidateId;
  readonly answer: "YES" | "NO";
  readonly truthValue: "TRUE" | "FALSE";
};

export type SeamstressCandidateLegalityKnowledge =
  | {
      readonly kind: "COMPLETE";
      readonly legalCandidateIds: readonly [CandidateId] | readonly [CandidateId, CandidateId];
    }
  | {
      readonly kind: "PARTIAL";
      readonly knownLegalCandidateIds: readonly [CandidateId];
      readonly unresolvedCandidateIds: readonly [CandidateId];
    };

export type SeamstressAnswerCandidateSet = {
  readonly candidateModelVersion: typeof SEAMSTRESS_ANSWER_CANDIDATE_MODEL_VERSION;
  readonly candidates: readonly [SeamstressAnswerCandidate, SeamstressAnswerCandidate];
  readonly legalityKnowledge: SeamstressCandidateLegalityKnowledge;
  readonly selectedCandidateId: CandidateId;
};

export type SeamstressInformationReliability =
  | "RULE_CORRECT_SELECTED_WITH_EFFECTIVENESS_NOT_PROVEN"
  | "RULE_CORRECT_SELECTED_WITH_KNOWN_IMPAIRMENT"
  | "VORTOX_CONSTRAINED_FALSE";

export type SeamstressSimulationReason =
  | "TRUTH_FAVORING_DEFAULT"
  | "TRUTH_ALLOWED_WHILE_REPRESENTED_IMPAIRED"
  | "FALSE_REQUIRED_BY_VORTOX";

export type SeamstressInformationDeliveredPayload = {
  readonly rulesBaselineVersion: string;
  readonly informationModelVersion: typeof SEAMSTRESS_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof SEAMSTRESS_INFORMATION_STAGE;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SEAMSTRESS_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly opportunityCharacterStateRevision: number;
  readonly settlementCharacterStateRevision: number;
  readonly targetPlayerIds: readonly [PlayerId, PlayerId];
  readonly targetSeatNumbers: readonly [SeatNumber, SeatNumber];
  readonly comparison: SeamstressAlignmentComparison;
  readonly sourceEffectiveness: SeamstressSourceEffectiveness;
  readonly deliveryConstraint: SeamstressDeliveryConstraint;
  readonly answerCandidateSet: SeamstressAnswerCandidateSet;
  readonly informationReliability: SeamstressInformationReliability;
  readonly simulationReason: SeamstressSimulationReason;
  readonly deliveredAnswer: "YES" | "NO";
};

export type SeamstressTargetChoiceSet = { readonly choices: readonly SeamstressTargetsChosenPayload[] };
export type SeamstressAbilitySpendSet = { readonly spends: readonly SeamstressAbilitySpentPayload[] };
export type SeamstressInformationSet = { readonly deliveries: readonly SeamstressInformationDeliveredPayload[] };

export const formatSeamstressAnswerCandidateId = (input: {
  readonly opportunityId: ActionOpportunityId;
  readonly answer: "YES" | "NO";
}): CandidateId => candidateId(`seamstress-answer-candidate-v1:${input.opportunityId}:${input.answer}`);

export const parseSeamstressAnswerCandidateId = (value: unknown):
  | { readonly valid: true; readonly opportunityId: ActionOpportunityId; readonly answer: "YES" | "NO" }
  | { readonly valid: false; readonly reason: string } => {
  if (typeof value !== "string") return { valid: false, reason: "CandidateId must be a string" };
  const match = /^seamstress-answer-candidate-v1:(.+):(YES|NO)$/.exec(value);
  if (match === null || match[1] === undefined || match[1].trim().length === 0) {
    return { valid: false, reason: "CandidateId has invalid grammar" };
  }
  const opportunityId = match[1] as ActionOpportunityId;
  const answer = match[2] as "YES" | "NO";
  if (formatSeamstressAnswerCandidateId({ opportunityId, answer }) !== value) return { valid: false, reason: "CandidateId is not canonical" };
  return { valid: true, opportunityId, answer };
};

export const canonicalizeSeamstressTargets = (input: {
  readonly sourcePlayerId: PlayerId;
  readonly targetPlayerIds: readonly [PlayerId, PlayerId];
  readonly currentCharacterState: CurrentCharacterStateSet;
}): { readonly valid: true; readonly targetPlayerIds: readonly [PlayerId, PlayerId]; readonly targetSeatNumbers: readonly [SeatNumber, SeatNumber] } |
  { readonly valid: false; readonly reason: string } => {
  const [firstId, secondId] = input.targetPlayerIds;
  if (firstId === secondId || firstId === input.sourcePlayerId || secondId === input.sourcePlayerId) {
    return { valid: false, reason: "Seamstress targets must be distinct players other than the source" };
  }
  const targets = input.currentCharacterState.entries.filter((entry) => entry.playerId === firstId || entry.playerId === secondId);
  if (targets.length !== 2 || new Set(targets.map((target) => target.playerId)).size !== 2) {
    return { valid: false, reason: "Seamstress targets must each exist exactly once in current character state" };
  }
  targets.sort((left, right) => left.seatNumber - right.seatNumber);
  return {
    valid: true,
    targetPlayerIds: [targets[0]!.playerId, targets[1]!.playerId],
    targetSeatNumbers: [targets[0]!.seatNumber, targets[1]!.seatNumber]
  };
};

export const resolveSeamstressSourceEffectiveness = (input: {
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRoleTenure: RoleTenureRecord;
  readonly settlementCharacterStateRevision: number;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): SeamstressSourceEffectiveness => {
  const representedImpairments = (input.abilityImpairments?.impairments ?? [])
    .filter((impairment) =>
      impairment.affectedPlayerId === input.sourcePlayerId &&
      impairment.affectedSeatNumber === input.sourceSeatNumber &&
      impairment.affectedRole.roleId === input.sourceRoleTenure.roleId &&
      impairment.sourceCharacterStateRevision >= input.sourceRoleTenure.acquiredCharacterStateRevision &&
      impairment.sourceCharacterStateRevision <= input.settlementCharacterStateRevision &&
      (input.sourceRoleTenure.endedCharacterStateRevision === undefined ||
        impairment.sourceCharacterStateRevision < input.sourceRoleTenure.endedCharacterStateRevision)
    )
    .map((impairment): SeamstressRepresentedImpairmentEvidence => ({
      impairmentId: impairment.impairmentId,
      impairmentKind: impairment.kind,
      impairmentSourceKind: impairment.sourceKind,
      appliedCharacterStateRevision: impairment.sourceCharacterStateRevision
    }))
    .sort((left, right) => left.impairmentId === right.impairmentId ? 0 : left.impairmentId < right.impairmentId ? -1 : 1);
  return representedImpairments.length === 0
    ? { kind: "NOT_PROVEN", representedImpairments: [], unresolvedEffectKinds: ["CONTINUOUS_POISON_NOT_MODELED"] }
    : {
        kind: "KNOWN_INEFFECTIVE",
        representedImpairments: representedImpairments as [SeamstressRepresentedImpairmentEvidence, ...SeamstressRepresentedImpairmentEvidence[]],
        unresolvedEffectKinds: ["CONTINUOUS_POISON_NOT_MODELED"]
      };
};

export const resolveSeamstressDeliveryConstraint = (input: {
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roleTenures: RoleTenureState;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): SeamstressDeliveryConstraint => {
  const vortoxEntries = input.currentCharacterState.entries.filter((entry) => entry.role.roleId === "vortox");
  if (vortoxEntries.length !== 1 || vortoxEntries[0] === undefined) return { kind: "NONE" };
  const vortox = vortoxEntries[0];
  const tenures = input.roleTenures.records.filter((tenure) =>
    tenure.playerId === vortox.playerId && tenure.seatNumber === vortox.seatNumber && tenure.roleId === "vortox" &&
    isRoleTenureActiveAt(tenure, input.currentCharacterState.revision)
  );
  if (tenures.length !== 1 || tenures[0] === undefined) return { kind: "NONE" };
  const tenure = tenures[0];
  const impaired = (input.abilityImpairments?.impairments ?? []).some((impairment) =>
    impairment.affectedPlayerId === vortox.playerId && impairment.affectedSeatNumber === vortox.seatNumber &&
    impairment.affectedRole.roleId === "vortox" &&
    impairment.sourceCharacterStateRevision >= tenure.acquiredCharacterStateRevision &&
    impairment.sourceCharacterStateRevision <= input.currentCharacterState.revision &&
    (tenure.endedCharacterStateRevision === undefined || impairment.sourceCharacterStateRevision < tenure.endedCharacterStateRevision)
  );
  return impaired ? { kind: "NONE" } : {
    kind: "VORTOX_FALSE_REQUIRED",
    evaluatedCharacterStateRevision: input.currentCharacterState.revision,
    vortoxPlayerId: vortox.playerId,
    vortoxSeatNumber: vortox.seatNumber,
    vortoxRoleTenureId: tenure.roleTenureId
  };
};

type SeamstressResolutionSource = {
  readonly rulesBaselineVersion: string;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly opportunityCharacterStateRevision: number;
};

export const createSeamstressTargetsChosenPayload = (input: SeamstressResolutionSource & {
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly targetPlayerIds: readonly [PlayerId, PlayerId];
}): SeamstressTargetsChosenPayload => {
  const targets = canonicalizeSeamstressTargets({
    sourcePlayerId: input.sourcePlayerId,
    targetPlayerIds: input.targetPlayerIds,
    currentCharacterState: input.currentCharacterState
  });
  if (!targets.valid) throw new DomainError("InvalidSeamstressTarget", targets.reason);
  return {
    rulesBaselineVersion: input.rulesBaselineVersion,
    actionSchemaVersion: SEAMSTRESS_ACTION_SCHEMA_VERSION,
    nightNumber: 1,
    taskId: input.taskId,
    taskType: "SEAMSTRESS_ACTION",
    opportunityId: input.opportunityId,
    decisionKind: "CHOOSE_TWO_PLAYERS",
    abilityInstanceId: input.abilityInstanceId,
    abilityUseEntitlementId: input.abilityUseEntitlementId,
    sourceRoleTenureId: input.sourceRoleTenureId,
    sourcePlayerId: input.sourcePlayerId,
    sourceSeatNumber: input.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(input.sourceRole),
    opportunityCharacterStateRevision: input.opportunityCharacterStateRevision,
    settlementCharacterStateRevision: input.currentCharacterState.revision,
    targetPlayerIds: targets.targetPlayerIds,
    targetSeatNumbers: targets.targetSeatNumbers
  };
};

export const createSeamstressAbilitySpentPayload = (
  choice: SeamstressTargetsChosenPayload
): SeamstressAbilitySpentPayload => ({
  rulesBaselineVersion: choice.rulesBaselineVersion,
  spendModelVersion: SEAMSTRESS_SPEND_MODEL_VERSION,
  nightNumber: 1,
  taskId: choice.taskId,
  taskType: "SEAMSTRESS_ACTION",
  opportunityId: choice.opportunityId,
  abilityInstanceId: choice.abilityInstanceId,
  abilityUseEntitlementId: choice.abilityUseEntitlementId,
  sourceRoleTenureId: choice.sourceRoleTenureId,
  sourcePlayerId: choice.sourcePlayerId,
  sourceSeatNumber: choice.sourceSeatNumber,
  opportunityCharacterStateRevision: choice.opportunityCharacterStateRevision,
  settlementCharacterStateRevision: choice.settlementCharacterStateRevision,
  spendReason: "LEGAL_TWO_PLAYER_SELECTION"
});

export const createSeamstressInformationDeliveredPayload = (input: {
  readonly choice: SeamstressTargetsChosenPayload;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly sourceRoleTenure: RoleTenureRecord;
  readonly roleTenures: RoleTenureState;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): SeamstressInformationDeliveredPayload => {
  const targetStates = input.choice.targetPlayerIds.map((targetId) =>
    input.currentCharacterState.entries.find((entry) => entry.playerId === targetId)
  );
  if (targetStates[0] === undefined || targetStates[1] === undefined) {
    throw new DomainError("InvalidSeamstressTarget", "Seamstress delivery requires both current targets");
  }
  const ruleCorrectAnswer = targetStates[0].currentAlignment === targetStates[1].currentAlignment ? "YES" : "NO";
  const comparison: SeamstressAlignmentComparison = {
    characterStateRevision: input.currentCharacterState.revision,
    alignmentModel: "NATIVE_CURRENT_ALIGNMENT_ONLY",
    targets: [
      { playerId: targetStates[0].playerId, seatNumber: targetStates[0].seatNumber, currentAlignment: targetStates[0].currentAlignment },
      { playerId: targetStates[1].playerId, seatNumber: targetStates[1].seatNumber, currentAlignment: targetStates[1].currentAlignment }
    ],
    ruleCorrectAnswer
  };
  const sourceEffectiveness = resolveSeamstressSourceEffectiveness({
    sourcePlayerId: input.choice.sourcePlayerId,
    sourceSeatNumber: input.choice.sourceSeatNumber,
    sourceRoleTenure: input.sourceRoleTenure,
    settlementCharacterStateRevision: input.currentCharacterState.revision,
    abilityImpairments: input.abilityImpairments
  });
  const deliveryConstraint = resolveSeamstressDeliveryConstraint({
    currentCharacterState: input.currentCharacterState,
    roleTenures: input.roleTenures,
    abilityImpairments: input.abilityImpairments
  });
  const yesId = formatSeamstressAnswerCandidateId({ opportunityId: input.choice.opportunityId, answer: "YES" });
  const noId = formatSeamstressAnswerCandidateId({ opportunityId: input.choice.opportunityId, answer: "NO" });
  const trueId = ruleCorrectAnswer === "YES" ? yesId : noId;
  const falseId = ruleCorrectAnswer === "YES" ? noId : yesId;
  const candidates: readonly [SeamstressAnswerCandidate, SeamstressAnswerCandidate] = [
    { candidateId: yesId, answer: "YES", truthValue: ruleCorrectAnswer === "YES" ? "TRUE" : "FALSE" },
    { candidateId: noId, answer: "NO", truthValue: ruleCorrectAnswer === "NO" ? "TRUE" : "FALSE" }
  ];
  const answerCandidateSet: SeamstressAnswerCandidateSet = deliveryConstraint.kind === "VORTOX_FALSE_REQUIRED"
    ? {
        candidateModelVersion: SEAMSTRESS_ANSWER_CANDIDATE_MODEL_VERSION,
        candidates,
        legalityKnowledge: { kind: "COMPLETE", legalCandidateIds: [falseId] },
        selectedCandidateId: falseId
      }
    : sourceEffectiveness.kind === "KNOWN_INEFFECTIVE"
      ? {
          candidateModelVersion: SEAMSTRESS_ANSWER_CANDIDATE_MODEL_VERSION,
          candidates,
          legalityKnowledge: { kind: "COMPLETE", legalCandidateIds: [yesId, noId] },
          selectedCandidateId: trueId
        }
      : {
          candidateModelVersion: SEAMSTRESS_ANSWER_CANDIDATE_MODEL_VERSION,
          candidates,
          legalityKnowledge: { kind: "PARTIAL", knownLegalCandidateIds: [trueId], unresolvedCandidateIds: [falseId] },
          selectedCandidateId: trueId
        };
  const selected = candidates.find((candidate) => candidate.candidateId === answerCandidateSet.selectedCandidateId)!;
  const informationReliability: SeamstressInformationReliability = deliveryConstraint.kind === "VORTOX_FALSE_REQUIRED"
    ? "VORTOX_CONSTRAINED_FALSE"
    : sourceEffectiveness.kind === "KNOWN_INEFFECTIVE"
      ? "RULE_CORRECT_SELECTED_WITH_KNOWN_IMPAIRMENT"
      : "RULE_CORRECT_SELECTED_WITH_EFFECTIVENESS_NOT_PROVEN";
  const simulationReason: SeamstressSimulationReason = deliveryConstraint.kind === "VORTOX_FALSE_REQUIRED"
    ? "FALSE_REQUIRED_BY_VORTOX"
    : sourceEffectiveness.kind === "KNOWN_INEFFECTIVE"
      ? "TRUTH_ALLOWED_WHILE_REPRESENTED_IMPAIRED"
      : "TRUTH_FAVORING_DEFAULT";
  return {
    rulesBaselineVersion: input.choice.rulesBaselineVersion,
    informationModelVersion: SEAMSTRESS_INFORMATION_MODEL_VERSION,
    knowledgeStage: SEAMSTRESS_INFORMATION_STAGE,
    nightNumber: 1,
    taskId: input.choice.taskId,
    taskType: "SEAMSTRESS_ACTION",
    opportunityId: input.choice.opportunityId,
    abilityInstanceId: input.choice.abilityInstanceId,
    abilityUseEntitlementId: input.choice.abilityUseEntitlementId,
    sourceRoleTenureId: input.choice.sourceRoleTenureId,
    sourcePlayerId: input.choice.sourcePlayerId,
    sourceSeatNumber: input.choice.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(input.choice.sourceRole),
    opportunityCharacterStateRevision: input.choice.opportunityCharacterStateRevision,
    settlementCharacterStateRevision: input.choice.settlementCharacterStateRevision,
    targetPlayerIds: [...input.choice.targetPlayerIds],
    targetSeatNumbers: [...input.choice.targetSeatNumbers],
    comparison,
    sourceEffectiveness,
    deliveryConstraint,
    answerCandidateSet,
    informationReliability,
    simulationReason,
    deliveredAnswer: selected.answer
  };
};

export const createSeamstressInformationDeliveredScheduledTaskSettlement = (
  delivery: SeamstressInformationDeliveredPayload
): ScheduledTaskSettledPayload => ({
  rulesBaselineVersion: delivery.rulesBaselineVersion,
  taskId: delivery.taskId,
  taskType: "SEAMSTRESS_ACTION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "SEAMSTRESS_INFORMATION_DELIVERED",
  characterStateRevision: delivery.settlementCharacterStateRevision
});

const TARGETS_CHOSEN_KEYS = [
  "abilityInstanceId", "abilityUseEntitlementId", "actionSchemaVersion", "decisionKind", "nightNumber",
  "opportunityCharacterStateRevision", "opportunityId", "rulesBaselineVersion", "settlementCharacterStateRevision",
  "sourcePlayerId", "sourceRole", "sourceRoleTenureId", "sourceSeatNumber", "targetPlayerIds", "targetSeatNumbers",
  "taskId", "taskType"
] as const;
const ABILITY_SPENT_KEYS = [
  "abilityInstanceId", "abilityUseEntitlementId", "nightNumber", "opportunityCharacterStateRevision", "opportunityId",
  "rulesBaselineVersion", "settlementCharacterStateRevision", "sourcePlayerId", "sourceRoleTenureId", "sourceSeatNumber",
  "spendModelVersion", "spendReason", "taskId", "taskType"
] as const;
const INFORMATION_DELIVERED_KEYS = [
  "abilityInstanceId", "abilityUseEntitlementId", "answerCandidateSet", "comparison", "deliveredAnswer",
  "deliveryConstraint", "informationModelVersion", "informationReliability", "knowledgeStage", "nightNumber",
  "opportunityCharacterStateRevision", "opportunityId", "rulesBaselineVersion", "settlementCharacterStateRevision",
  "simulationReason", "sourceEffectiveness", "sourcePlayerId", "sourceRole", "sourceRoleTenureId", "sourceSeatNumber",
  "targetPlayerIds", "targetSeatNumbers", "taskId", "taskType"
] as const;

const isExactTuple = (value: unknown, length: number): value is readonly unknown[] =>
  Array.isArray(value) && isDenseArray(value) && value.length === length;

export const validateSeamstressTargetsChosenPayloadShape = (value: unknown): ValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, TARGETS_CHOSEN_KEYS)) return fail("SeamstressTargetsChosen payload must have exact runtime shape");
  if (value.actionSchemaVersion !== SEAMSTRESS_ACTION_SCHEMA_VERSION || value.nightNumber !== 1 ||
      value.taskType !== "SEAMSTRESS_ACTION" || value.decisionKind !== "CHOOSE_TWO_PLAYERS" ||
      !isNonEmptyString(value.rulesBaselineVersion) || !isNonEmptyString(value.taskId) || !isNonEmptyString(value.opportunityId) ||
      !isNonEmptyString(value.sourcePlayerId) || !isSeatNumber(value.sourceSeatNumber) || !hasExactRoleSetupSnapshotShape(value.sourceRole) ||
      !isPositiveInteger(value.opportunityCharacterStateRevision) || !isPositiveInteger(value.settlementCharacterStateRevision) ||
      value.settlementCharacterStateRevision < value.opportunityCharacterStateRevision ||
      !parseRoleTenureId(value.sourceRoleTenureId).valid || !parseSeamstressAbilityInstanceId(value.abilityInstanceId).valid ||
      !parseSeamstressAbilityUseEntitlementId(value.abilityUseEntitlementId).valid ||
      !isExactTuple(value.targetPlayerIds, 2) || value.targetPlayerIds.some((id) => !isNonEmptyString(id)) ||
      !isExactTuple(value.targetSeatNumbers, 2) || value.targetSeatNumbers.some((seat) => !isSeatNumber(seat)) ||
      value.targetPlayerIds[0] === value.targetPlayerIds[1] || value.targetPlayerIds.includes(value.sourcePlayerId) ||
      (value.targetSeatNumbers[0] as number) >= (value.targetSeatNumbers[1] as number)) {
    return fail("SeamstressTargetsChosen fields must use supported canonical values");
  }
  const entitlement = parseSeamstressAbilityUseEntitlementId(value.abilityUseEntitlementId);
  const instance = parseSeamstressAbilityInstanceId(value.abilityInstanceId);
  const tenure = parseRoleTenureId(value.sourceRoleTenureId);
  if (!entitlement.valid || !instance.valid || !tenure.valid ||
      entitlement.abilityInstanceId !== value.abilityInstanceId ||
      instance.sourceRoleTenureId !== value.sourceRoleTenureId || tenure.seatNumber !== value.sourceSeatNumber ||
      tenure.roleId !== value.sourceRole.roleId || tenure.acquiredCharacterStateRevision > value.opportunityCharacterStateRevision) {
    return fail("SeamstressTargetsChosen IDs and source must form one exact ability chain");
  }
  return { valid: true };
};

export const validateSeamstressAbilitySpentPayloadShape = (value: unknown): ValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ABILITY_SPENT_KEYS)) return fail("SeamstressAbilitySpent payload must have exact runtime shape");
  if (value.spendModelVersion !== SEAMSTRESS_SPEND_MODEL_VERSION || value.nightNumber !== 1 || value.taskType !== "SEAMSTRESS_ACTION" ||
      value.spendReason !== "LEGAL_TWO_PLAYER_SELECTION" || !isNonEmptyString(value.rulesBaselineVersion) || !isNonEmptyString(value.taskId) ||
      !isNonEmptyString(value.opportunityId) || !isNonEmptyString(value.sourcePlayerId) || !isSeatNumber(value.sourceSeatNumber) ||
      !isPositiveInteger(value.opportunityCharacterStateRevision) || !isPositiveInteger(value.settlementCharacterStateRevision) ||
      value.settlementCharacterStateRevision < value.opportunityCharacterStateRevision ||
      !parseRoleTenureId(value.sourceRoleTenureId).valid || !parseSeamstressAbilityInstanceId(value.abilityInstanceId).valid ||
      !parseSeamstressAbilityUseEntitlementId(value.abilityUseEntitlementId).valid) {
    return fail("SeamstressAbilitySpent fields must use supported canonical values");
  }
  const entitlement = parseSeamstressAbilityUseEntitlementId(value.abilityUseEntitlementId);
  const instance = parseSeamstressAbilityInstanceId(value.abilityInstanceId);
  const tenure = parseRoleTenureId(value.sourceRoleTenureId);
  if (!entitlement.valid || !instance.valid || !tenure.valid ||
      entitlement.abilityInstanceId !== value.abilityInstanceId || instance.sourceRoleTenureId !== value.sourceRoleTenureId ||
      tenure.seatNumber !== value.sourceSeatNumber || tenure.acquiredCharacterStateRevision > value.opportunityCharacterStateRevision) {
    return fail("SeamstressAbilitySpent IDs must form one exact ability chain");
  }
  return { valid: true };
};

const canonicalJson = (value: unknown): string => {
  const normalize = (candidate: unknown): unknown => {
    if (Array.isArray(candidate)) return candidate.map(normalize);
    if (isPlainRecord(candidate)) {
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(candidate).sort((a, b) => a === b ? 0 : a < b ? -1 : 1)) {
        result[key] = normalize(candidate[key]);
      }
      return result;
    }
    return candidate;
  };
  return JSON.stringify(normalize(value));
};

const validateComparisonShape = (value: unknown): value is SeamstressAlignmentComparison => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["alignmentModel", "characterStateRevision", "ruleCorrectAnswer", "targets"]) ||
      value.alignmentModel !== "NATIVE_CURRENT_ALIGNMENT_ONLY" || !isPositiveInteger(value.characterStateRevision) ||
      (value.ruleCorrectAnswer !== "YES" && value.ruleCorrectAnswer !== "NO") || !isExactTuple(value.targets, 2)) return false;
  const targets = value.targets;
  if (targets.some((target) => !isPlainRecord(target) || !hasExactEnumerableKeys(target, ["currentAlignment", "playerId", "seatNumber"]) ||
      !isNonEmptyString(target.playerId) || !isSeatNumber(target.seatNumber) ||
      (target.currentAlignment !== "GOOD" && target.currentAlignment !== "EVIL"))) return false;
  const typed = targets as SeamstressAlignmentComparison["targets"];
  return typed[0].seatNumber < typed[1].seatNumber && typed[0].playerId !== typed[1].playerId &&
    value.ruleCorrectAnswer === (typed[0].currentAlignment === typed[1].currentAlignment ? "YES" : "NO");
};

const validateSourceEffectivenessShape = (value: unknown): value is SeamstressSourceEffectiveness => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["kind", "representedImpairments", "unresolvedEffectKinds"]) ||
      !isExactTuple(value.unresolvedEffectKinds, 1) || value.unresolvedEffectKinds[0] !== "CONTINUOUS_POISON_NOT_MODELED" ||
      !Array.isArray(value.representedImpairments) || !isDenseArray(value.representedImpairments)) return false;
  if (value.kind === "NOT_PROVEN") return value.representedImpairments.length === 0;
  if (value.kind !== "KNOWN_INEFFECTIVE" || value.representedImpairments.length === 0) return false;
  let previous = "";
  for (const evidence of value.representedImpairments) {
    if (!isPlainRecord(evidence) || !hasExactEnumerableKeys(evidence, ["appliedCharacterStateRevision", "impairmentId", "impairmentKind", "impairmentSourceKind"]) ||
        !isNonEmptyString(evidence.impairmentId) || !isPositiveInteger(evidence.appliedCharacterStateRevision) ||
        (evidence.impairmentKind !== "DRUNK" && evidence.impairmentKind !== "POISONED") ||
        (evidence.impairmentSourceKind !== "PHILOSOPHER_CHOSEN_DUPLICATE" && evidence.impairmentSourceKind !== "SNAKE_CHARMER_DEMON_HIT") ||
        previous >= evidence.impairmentId) return false;
    previous = evidence.impairmentId;
  }
  return true;
};

const validateDeliveryConstraintShape = (value: unknown): value is SeamstressDeliveryConstraint => {
  if (!isPlainRecord(value)) return false;
  if (value.kind === "NONE") return hasExactEnumerableKeys(value, ["kind"]);
  return value.kind === "VORTOX_FALSE_REQUIRED" &&
    hasExactEnumerableKeys(value, ["evaluatedCharacterStateRevision", "kind", "vortoxPlayerId", "vortoxRoleTenureId", "vortoxSeatNumber"]) &&
    isPositiveInteger(value.evaluatedCharacterStateRevision) && isNonEmptyString(value.vortoxPlayerId) &&
    isSeatNumber(value.vortoxSeatNumber) && parseRoleTenureId(value.vortoxRoleTenureId).valid;
};

const validateAnswerCandidateSetShape = (
  value: unknown,
  opportunityId: ActionOpportunityId,
  ruleCorrectAnswer: "YES" | "NO"
): value is SeamstressAnswerCandidateSet => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["candidateModelVersion", "candidates", "legalityKnowledge", "selectedCandidateId"]) ||
      value.candidateModelVersion !== SEAMSTRESS_ANSWER_CANDIDATE_MODEL_VERSION || !isExactTuple(value.candidates, 2) ||
      !isNonEmptyString(value.selectedCandidateId)) return false;
  const answers = ["YES", "NO"] as const;
  for (const [index, candidate] of value.candidates.entries()) {
    if (!isPlainRecord(candidate) || !hasExactEnumerableKeys(candidate, ["answer", "candidateId", "truthValue"]) ||
        candidate.answer !== answers[index] || candidate.candidateId !== formatSeamstressAnswerCandidateId({ opportunityId, answer: answers[index]! }) ||
        candidate.truthValue !== (candidate.answer === ruleCorrectAnswer ? "TRUE" : "FALSE")) return false;
  }
  const candidates = value.candidates as readonly [SeamstressAnswerCandidate, SeamstressAnswerCandidate];
  const ids = candidates.map((candidate) => candidate.candidateId);
  if (!ids.includes(value.selectedCandidateId as CandidateId) || !isPlainRecord(value.legalityKnowledge)) return false;
  const legalityKnowledge = value.legalityKnowledge;
  if (legalityKnowledge.kind === "COMPLETE") {
    if (!hasExactEnumerableKeys(legalityKnowledge, ["kind", "legalCandidateIds"]) || !Array.isArray(legalityKnowledge.legalCandidateIds) ||
        !isDenseArray(legalityKnowledge.legalCandidateIds) || legalityKnowledge.legalCandidateIds.length < 1 ||
        legalityKnowledge.legalCandidateIds.length > 2 || new Set(legalityKnowledge.legalCandidateIds).size !== legalityKnowledge.legalCandidateIds.length ||
        legalityKnowledge.legalCandidateIds.some((id) => !ids.includes(id as CandidateId)) ||
        !legalityKnowledge.legalCandidateIds.includes(value.selectedCandidateId)) return false;
    const legalIds = legalityKnowledge.legalCandidateIds;
    return legalIds.every((id, index) => ids.indexOf(id as CandidateId) >= (index === 0 ? 0 : ids.indexOf(legalIds[index - 1] as CandidateId)));
  }
  if (legalityKnowledge.kind !== "PARTIAL" ||
      !hasExactEnumerableKeys(legalityKnowledge, ["kind", "knownLegalCandidateIds", "unresolvedCandidateIds"]) ||
      !isExactTuple(legalityKnowledge.knownLegalCandidateIds, 1) || !isExactTuple(legalityKnowledge.unresolvedCandidateIds, 1)) return false;
  const known = legalityKnowledge.knownLegalCandidateIds[0];
  const unresolved = legalityKnowledge.unresolvedCandidateIds[0];
  return known !== unresolved && ids.includes(known as CandidateId) && ids.includes(unresolved as CandidateId) && value.selectedCandidateId === known;
};

export const validateSeamstressInformationDeliveredPayloadShape = (value: unknown): ValidationResult => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, INFORMATION_DELIVERED_KEYS)) return fail("SeamstressInformationDelivered payload must have exact runtime shape");
  if (value.informationModelVersion !== SEAMSTRESS_INFORMATION_MODEL_VERSION || value.knowledgeStage !== SEAMSTRESS_INFORMATION_STAGE ||
      value.nightNumber !== 1 || value.taskType !== "SEAMSTRESS_ACTION" || !isNonEmptyString(value.rulesBaselineVersion) ||
      !isNonEmptyString(value.taskId) || !isNonEmptyString(value.opportunityId) || !isNonEmptyString(value.sourcePlayerId) ||
      !isSeatNumber(value.sourceSeatNumber) || !hasExactRoleSetupSnapshotShape(value.sourceRole) ||
      !isPositiveInteger(value.opportunityCharacterStateRevision) || !isPositiveInteger(value.settlementCharacterStateRevision) ||
      value.settlementCharacterStateRevision < value.opportunityCharacterStateRevision || !parseRoleTenureId(value.sourceRoleTenureId).valid ||
      !parseSeamstressAbilityInstanceId(value.abilityInstanceId).valid || !parseSeamstressAbilityUseEntitlementId(value.abilityUseEntitlementId).valid ||
      !isExactTuple(value.targetPlayerIds, 2) || value.targetPlayerIds.some((id) => !isNonEmptyString(id)) ||
      !isExactTuple(value.targetSeatNumbers, 2) || value.targetSeatNumbers.some((seat) => !isSeatNumber(seat)) ||
      value.targetPlayerIds[0] === value.targetPlayerIds[1] || value.targetPlayerIds.includes(value.sourcePlayerId) ||
      (value.targetSeatNumbers[0] as number) >= (value.targetSeatNumbers[1] as number) ||
      !validateComparisonShape(value.comparison) || value.comparison.characterStateRevision !== value.settlementCharacterStateRevision ||
      canonicalJson(value.comparison.targets.map((target) => target.playerId)) !== canonicalJson(value.targetPlayerIds) ||
      canonicalJson(value.comparison.targets.map((target) => target.seatNumber)) !== canonicalJson(value.targetSeatNumbers) ||
      !validateSourceEffectivenessShape(value.sourceEffectiveness) || !validateDeliveryConstraintShape(value.deliveryConstraint) ||
      !validateAnswerCandidateSetShape(value.answerCandidateSet, value.opportunityId as ActionOpportunityId, value.comparison.ruleCorrectAnswer) ||
      (value.deliveredAnswer !== "YES" && value.deliveredAnswer !== "NO")) {
    return fail("SeamstressInformationDelivered fields must use supported canonical values");
  }
  const delivery = value as unknown as SeamstressInformationDeliveredPayload;
  const sourceTenure = parseRoleTenureId(delivery.sourceRoleTenureId);
  if (!sourceTenure.valid || sourceTenure.seatNumber !== delivery.sourceSeatNumber ||
      sourceTenure.roleId !== delivery.sourceRole.roleId ||
      sourceTenure.acquiredCharacterStateRevision > delivery.opportunityCharacterStateRevision ||
      delivery.sourceEffectiveness.representedImpairments.some((evidence) =>
        evidence.appliedCharacterStateRevision < sourceTenure.acquiredCharacterStateRevision ||
        evidence.appliedCharacterStateRevision > delivery.settlementCharacterStateRevision
      )) {
    return fail("SeamstressInformationDelivered source history must match its exact tenure and N/M interval");
  }
  if (delivery.deliveryConstraint.kind === "VORTOX_FALSE_REQUIRED") {
    const vortoxTenure = parseRoleTenureId(delivery.deliveryConstraint.vortoxRoleTenureId);
    if (!vortoxTenure.valid || vortoxTenure.roleId !== "vortox" ||
        vortoxTenure.seatNumber !== delivery.deliveryConstraint.vortoxSeatNumber ||
        vortoxTenure.acquiredCharacterStateRevision > delivery.deliveryConstraint.evaluatedCharacterStateRevision ||
        delivery.deliveryConstraint.evaluatedCharacterStateRevision !== delivery.settlementCharacterStateRevision) {
      return fail("Seamstress Vortox constraint must match one canonical active-tenure snapshot at M");
    }
  }
  const selected = delivery.answerCandidateSet.candidates.find((candidate) => candidate.candidateId === delivery.answerCandidateSet.selectedCandidateId);
  if (selected?.answer !== delivery.deliveredAnswer) return fail("Seamstress delivered answer must equal the selected candidate");
  if (delivery.deliveryConstraint.kind === "VORTOX_FALSE_REQUIRED") {
    if (delivery.informationReliability !== "VORTOX_CONSTRAINED_FALSE" || delivery.simulationReason !== "FALSE_REQUIRED_BY_VORTOX" ||
        delivery.answerCandidateSet.legalityKnowledge.kind !== "COMPLETE" || delivery.answerCandidateSet.legalityKnowledge.legalCandidateIds.length !== 1 ||
        selected.truthValue !== "FALSE") return fail("Vortox-constrained Seamstress information must select the false-only candidate");
  } else if (delivery.sourceEffectiveness.kind === "KNOWN_INEFFECTIVE") {
    if (delivery.informationReliability !== "RULE_CORRECT_SELECTED_WITH_KNOWN_IMPAIRMENT" ||
        delivery.simulationReason !== "TRUTH_ALLOWED_WHILE_REPRESENTED_IMPAIRED" || delivery.answerCandidateSet.legalityKnowledge.kind !== "COMPLETE" ||
        delivery.answerCandidateSet.legalityKnowledge.legalCandidateIds.length !== 2 || selected.truthValue !== "TRUE") {
      return fail("Represented-impaired Seamstress information must use the truth-favoring complete candidate set");
    }
  } else if (delivery.informationReliability !== "RULE_CORRECT_SELECTED_WITH_EFFECTIVENESS_NOT_PROVEN" ||
      delivery.simulationReason !== "TRUTH_FAVORING_DEFAULT" || delivery.answerCandidateSet.legalityKnowledge.kind !== "PARTIAL" || selected.truthValue !== "TRUE") {
    return fail("Unproven Seamstress information must use the truth-favoring partial candidate set");
  }
  return { valid: true };
};

export const validateSeamstressChoiceSpendChain = (input: {
  readonly choice: SeamstressTargetsChosenPayload;
  readonly spend: SeamstressAbilitySpentPayload;
}): ValidationResult => {
  const choiceShape = validateSeamstressTargetsChosenPayloadShape(input.choice);
  if (!choiceShape.valid) return choiceShape;
  const spendShape = validateSeamstressAbilitySpentPayloadShape(input.spend);
  if (!spendShape.valid) return spendShape;
  const sharedChoice = {
    rulesBaselineVersion: input.choice.rulesBaselineVersion,
    nightNumber: input.choice.nightNumber,
    taskId: input.choice.taskId,
    taskType: input.choice.taskType,
    opportunityId: input.choice.opportunityId,
    abilityInstanceId: input.choice.abilityInstanceId,
    abilityUseEntitlementId: input.choice.abilityUseEntitlementId,
    sourceRoleTenureId: input.choice.sourceRoleTenureId,
    sourcePlayerId: input.choice.sourcePlayerId,
    sourceSeatNumber: input.choice.sourceSeatNumber,
    opportunityCharacterStateRevision: input.choice.opportunityCharacterStateRevision,
    settlementCharacterStateRevision: input.choice.settlementCharacterStateRevision
  };
  const sharedSpend = {
    rulesBaselineVersion: input.spend.rulesBaselineVersion,
    nightNumber: input.spend.nightNumber,
    taskId: input.spend.taskId,
    taskType: input.spend.taskType,
    opportunityId: input.spend.opportunityId,
    abilityInstanceId: input.spend.abilityInstanceId,
    abilityUseEntitlementId: input.spend.abilityUseEntitlementId,
    sourceRoleTenureId: input.spend.sourceRoleTenureId,
    sourcePlayerId: input.spend.sourcePlayerId,
    sourceSeatNumber: input.spend.sourceSeatNumber,
    opportunityCharacterStateRevision: input.spend.opportunityCharacterStateRevision,
    settlementCharacterStateRevision: input.spend.settlementCharacterStateRevision
  };
  return canonicalJson(sharedChoice) === canonicalJson(sharedSpend)
    ? { valid: true }
    : fail("Seamstress choice and spend must share one exact chain");
};

export const validateSeamstressInformationAgainstCanonicalState = (input: {
  readonly choice: SeamstressTargetsChosenPayload;
  readonly spend: SeamstressAbilitySpentPayload;
  readonly delivery: SeamstressInformationDeliveredPayload;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roleTenures: RoleTenureState;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): ValidationResult => {
  const chain = validateSeamstressChoiceSpendChain({ choice: input.choice, spend: input.spend });
  if (!chain.valid) return chain;
  const shape = validateSeamstressInformationDeliveredPayloadShape(input.delivery);
  if (!shape.valid) return shape;
  const tenure = input.roleTenures.records.find((record) => record.roleTenureId === input.choice.sourceRoleTenureId);
  if (tenure === undefined || !isRoleTenureContinuousAcross(tenure, input.choice.opportunityCharacterStateRevision, input.choice.settlementCharacterStateRevision)) {
    return fail("Seamstress source tenure must remain continuously active across opportunity and settlement revisions");
  }
  const expected = createSeamstressInformationDeliveredPayload({
    choice: input.choice,
    currentCharacterState: input.currentCharacterState,
    sourceRoleTenure: tenure,
    roleTenures: input.roleTenures,
    abilityImpairments: input.abilityImpairments
  });
  return canonicalJson(expected) === canonicalJson(input.delivery)
    ? { valid: true }
    : fail("SeamstressInformationDelivered must equal the canonical settlement-time resolution");
};

export const appendSeamstressTargetChoice = (
  state: SeamstressTargetChoiceSet | undefined,
  payload: SeamstressTargetsChosenPayload
): SeamstressTargetChoiceSet => ({ choices: [...(state?.choices ?? []), payload] });

export const appendSeamstressAbilitySpend = (
  state: SeamstressAbilitySpendSet | undefined,
  payload: SeamstressAbilitySpentPayload
): SeamstressAbilitySpendSet => ({ spends: [...(state?.spends ?? []), payload] });

export const spendSeamstressAbilityEntitlement = (
  state: SeamstressAbilityState | undefined,
  payload: SeamstressAbilitySpentPayload
): SeamstressAbilityState => {
  const current = cloneSeamstressAbilityState(state);
  const matches = current.entitlements.filter((entry) => entry.abilityUseEntitlementId === payload.abilityUseEntitlementId);
  if (matches.length !== 1 || matches[0]?.abilityInstanceId !== payload.abilityInstanceId) {
    throw new DomainError("InvalidSeamstressAbilitySpentPayload", "Seamstress spend must reference one exact entitlement");
  }
  if (matches[0].status === "SPENT") throw new DomainError("AbilityUseEntitlementAlreadySpent", "Seamstress ability entitlement is already spent");
  return {
    instances: current.instances,
    entitlements: current.entitlements.map((entry) => entry.abilityUseEntitlementId === payload.abilityUseEntitlementId ? { ...entry, status: "SPENT" } : entry)
  };
};

export const appendSeamstressInformationDelivery = (
  state: SeamstressInformationSet | undefined,
  payload: SeamstressInformationDeliveredPayload
): SeamstressInformationSet => ({ deliveries: [...(state?.deliveries ?? []), payload] });

export const hasSeamstressInformationForSettlement = (
  deliveries: SeamstressInformationSet | undefined,
  settlement: Pick<ScheduledTaskSettledPayload, "taskId" | "taskType" | "outcomeType" | "characterStateRevision">
): boolean => settlement.taskType === "SEAMSTRESS_ACTION" && settlement.outcomeType === "SEAMSTRESS_INFORMATION_DELIVERED" &&
  (deliveries?.deliveries.some((delivery) => delivery.taskId === settlement.taskId &&
    delivery.settlementCharacterStateRevision === settlement.characterStateRevision) ?? false);

export const validateStoredSeamstressInformationDelivered = (input: {
  readonly rulesBaselineVersion: string;
  readonly delivery: unknown;
  readonly choices: unknown;
  readonly spends: unknown;
  readonly settlements: readonly unknown[];
}): ValidationResult => {
  const shape = validateSeamstressInformationDeliveredPayloadShape(input.delivery);
  if (!shape.valid) return shape;
  if (!isNonEmptyString(input.rulesBaselineVersion) ||
      !isPlainRecord(input.choices) || !hasExactEnumerableKeys(input.choices, ["choices"]) ||
      !Array.isArray(input.choices.choices) || !isDenseArray(input.choices.choices) ||
      !isPlainRecord(input.spends) || !hasExactEnumerableKeys(input.spends, ["spends"]) ||
      !Array.isArray(input.spends.spends) || !isDenseArray(input.spends.spends) ||
      !Array.isArray(input.settlements) || !isDenseArray(input.settlements)) {
    return fail("Stored Seamstress information requires exact choice, spend, and settlement collections");
  }
  for (const choice of input.choices.choices) {
    const choiceShape = validateSeamstressTargetsChosenPayloadShape(choice);
    if (!choiceShape.valid) return choiceShape;
  }
  for (const spend of input.spends.spends) {
    const spendShape = validateSeamstressAbilitySpentPayloadShape(spend);
    if (!spendShape.valid) return spendShape;
  }
  for (const settlement of input.settlements) {
    const settlementShape = validateScheduledTaskSettlementShape(settlement);
    if (!settlementShape.valid) return settlementShape;
  }
  const delivery = input.delivery as SeamstressInformationDeliveredPayload;
  if (delivery.rulesBaselineVersion !== input.rulesBaselineVersion) {
    return fail("Stored Seamstress information rules baseline must match canonical state");
  }
  const choiceValues = input.choices.choices as readonly SeamstressTargetsChosenPayload[];
  const spendValues = input.spends.spends as readonly SeamstressAbilitySpentPayload[];
  const settlementValues = input.settlements as readonly ScheduledTaskSettlement[];
  const choices = choiceValues.filter((choice) => choice.opportunityId === delivery.opportunityId);
  const spends = spendValues.filter((spend) => spend.opportunityId === delivery.opportunityId);
  const settlements = settlementValues.filter((settlement) => settlement.taskId === delivery.taskId &&
    settlement.outcomeType === "SEAMSTRESS_INFORMATION_DELIVERED");
  if (choices.length !== 1 || spends.length !== 1 || settlements.length !== 1 || choices[0] === undefined || spends[0] === undefined || settlements[0] === undefined) {
    return fail("Stored Seamstress information requires exactly one choice, spend, and settlement");
  }
  const chain = validateSeamstressChoiceSpendChain({ choice: choices[0], spend: spends[0] });
  if (!chain.valid) return chain;
  const deliveryShared = {
    rulesBaselineVersion: delivery.rulesBaselineVersion,
    nightNumber: delivery.nightNumber,
    taskId: delivery.taskId,
    taskType: delivery.taskType,
    opportunityId: delivery.opportunityId,
    abilityInstanceId: delivery.abilityInstanceId,
    abilityUseEntitlementId: delivery.abilityUseEntitlementId,
    sourceRoleTenureId: delivery.sourceRoleTenureId,
    sourcePlayerId: delivery.sourcePlayerId,
    sourceSeatNumber: delivery.sourceSeatNumber,
    sourceRole: delivery.sourceRole,
    opportunityCharacterStateRevision: delivery.opportunityCharacterStateRevision,
    settlementCharacterStateRevision: delivery.settlementCharacterStateRevision,
    targetPlayerIds: delivery.targetPlayerIds,
    targetSeatNumbers: delivery.targetSeatNumbers
  };
  const choiceShared = {
    rulesBaselineVersion: choices[0].rulesBaselineVersion,
    nightNumber: choices[0].nightNumber,
    taskId: choices[0].taskId,
    taskType: choices[0].taskType,
    opportunityId: choices[0].opportunityId,
    abilityInstanceId: choices[0].abilityInstanceId,
    abilityUseEntitlementId: choices[0].abilityUseEntitlementId,
    sourceRoleTenureId: choices[0].sourceRoleTenureId,
    sourcePlayerId: choices[0].sourcePlayerId,
    sourceSeatNumber: choices[0].sourceSeatNumber,
    sourceRole: choices[0].sourceRole,
    opportunityCharacterStateRevision: choices[0].opportunityCharacterStateRevision,
    settlementCharacterStateRevision: choices[0].settlementCharacterStateRevision,
    targetPlayerIds: choices[0].targetPlayerIds,
    targetSeatNumbers: choices[0].targetSeatNumbers
  };
  const settlement = settlements[0];
  return canonicalJson(deliveryShared) === canonicalJson(choiceShared) && settlement.taskType === "SEAMSTRESS_ACTION" &&
    settlement.nightNumber === 1 && settlement.settlementVersion === SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION &&
    settlement.characterStateRevision === delivery.settlementCharacterStateRevision
    ? { valid: true }
    : fail("Stored Seamstress information chain fields do not correlate");
};
