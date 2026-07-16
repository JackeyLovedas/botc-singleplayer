import { isCanonicalDataValue, isDenseCanonicalArray, sameCanonicalDataValue } from "./canonical-data.js";
import { DomainError } from "./errors.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { FirstNightTaskType, ScheduledTask } from "./first-night-task-plan.js";
import { validateFirstNightTaskPlanRuntimeState } from "./first-night-task-plan.js";
import type { GameState } from "./game-state.js";
import {
  scheduledTaskFromFirstNightTaskInsertedPayload,
  validateFirstNightTaskInsertedPayload,
  validateFirstNightTaskInsertedV2Payload
} from "./philosopher-ability.js";
import { validateCerenovusInstructionAgainstChain } from "./cerenovus.js";
import {
  parseBaseDreamerV2FirstNightActionOpportunityId,
  parseFirstNightActionOpportunityId,
  validateFirstNightActionOpportunityStateShape
} from "./first-night-action-opportunity.js";
import type {
  ActionOpportunityKind,
  ActionOpportunityStatus,
  FirstNightActionOpportunity
} from "./first-night-action-opportunity.js";
import { hasExactRoleSetupSnapshotShape } from "./initial-private-knowledge.js";
import type {
  AbilityImpairmentId, AbilityInstanceId, ActionOpportunityId, BatchId, EventId, GameId,
  GrantedAbilityId, PlayerId, RoleId, RoleTenureId, ScheduledTaskId
} from "./ids.js";
import { validatePlayerRoster } from "./player-roster.js";
import type { SeatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";
import type { MathematicianCount, MathematicianDeliveryId } from "./mathematician.js";

export const FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION = "first-night-ability-outcome-ledger-v1" as const;
export const FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION = "first-night-ability-outcome-audit-v1" as const;
export const FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION = "first-night-ability-outcome-window-v1" as const;

export type OutcomeLedgerValidationResult = { readonly valid: true } | { readonly valid: false; readonly reason: string };
export type FirstNightAbilityInstanceId = string & { readonly __brand: "FirstNightAbilityInstanceId" };
export type FirstNightAbilityOutcomeFactId = string & { readonly __brand: "FirstNightAbilityOutcomeFactId" };

export type FirstNightAbilityOutcomeWindowAnchor = {
  readonly windowVersion: typeof FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION;
  readonly gameId: GameId;
  readonly nightNumber: 1;
  readonly rulesBaselineVersion: string;
  readonly firstNightInitializedEventId: EventId;
  readonly startEventSequence: number;
  readonly startBoundary: "EXCLUSIVE";
};

export type FirstNightInitializationEnvelopeProvenance = {
  readonly provenanceVersion: "first-night-initialization-envelope-provenance-v1";
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly eventId: EventId;
  readonly eventSequence: number;
};

type ProvenanceBase = { readonly provenanceVersion: "first-night-ability-instance-provenance-v1"; readonly abilityInstanceId: FirstNightAbilityInstanceId; readonly abilityRoleId: RoleId; readonly taskId: ScheduledTaskId; readonly sourcePlayerId: PlayerId; readonly sourceSeatNumber: SeatNumber };
export type FirstNightAbilityInstanceProvenance =
  | ProvenanceBase & { readonly kind: "BASE_ROLE_TASK" }
  | ProvenanceBase & { readonly kind: "PHILOSOPHER_GAINED_TASK_V1"; readonly philosopherOpportunityId: ActionOpportunityId; readonly grantId: GrantedAbilityId; readonly sourceCharacterStateRevision: number }
  | ProvenanceBase & { readonly kind: "PHILOSOPHER_GAINED_TASK_V2"; readonly philosopherOpportunityId: ActionOpportunityId; readonly grantId: GrantedAbilityId; readonly sourceCharacterStateRevision: number; readonly schedulingVersion: "philosopher-gained-first-night-scheduling-v2" }
  | ProvenanceBase & { readonly kind: "EXPLICIT_DOMAIN_INSTANCE"; readonly sourceRoleTenureId: RoleTenureId; readonly existingInstanceId: AbilityInstanceId };

export type TerminalAbilityOutcomeEventType =
  | "PhilosopherActionDeferred" | "PhilosopherAbilityGranted"
  | "SnakeCharmerNoSwapResolved" | "SnakeCharmerIneffectiveResolved" | "SnakeCharmerDemonSwapApplied"
  | "EvilTwinInformationDelivered" | "WitchDeathPendingMarked" | "WitchIneffectiveResolved"
  | "CerenovusMadnessInstructionDelivered" | "ClockmakerInformationDelivered"
  | "DreamerInformationDelivered" | "SeamstressInformationDelivered"
  | "MathematicianInformationDelivered";

export type SourceEventEvidence = { readonly kind: "SOURCE_EVENT"; readonly eventId: EventId; readonly eventType: TerminalAbilityOutcomeEventType; readonly eventSequence: number; readonly batchId: BatchId };
export type TaskEvidence = { readonly kind: "TASK"; readonly taskId: ScheduledTaskId; readonly taskType: FirstNightTaskType };
export type ActionOpportunityEvidence = {
  readonly kind: "ACTION_OPPORTUNITY";
  readonly opportunityVersion: "first-night-action-opportunity-v1";
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: ActionOpportunityKind;
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly taskId: ScheduledTaskId;
  readonly taskType: FirstNightTaskType;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
};
export type AbilityImpairmentEvidence = { readonly kind: "ABILITY_IMPAIRMENT"; readonly impairmentId: AbilityImpairmentId; readonly impairmentKind: "DRUNK" | "POISONED"; readonly affectedPlayerId: PlayerId; readonly affectedSeatNumber: SeatNumber; readonly affectedRoleId: RoleId; readonly sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" | "SNAKE_CHARMER_DEMON_HIT"; readonly appliedCharacterStateRevision: number };
export type RoleTenureEvidence = { readonly kind: "ROLE_TENURE"; readonly roleTenureId: RoleTenureId; readonly playerId: PlayerId; readonly seatNumber: SeatNumber; readonly roleId: RoleId; readonly acquiredCharacterStateRevision: number; readonly statusAtEvaluation: "ACTIVE" | "INACTIVE" };
export type CharacterStateEvidence = { readonly kind: "CHARACTER_STATE"; readonly characterStateRevision: number };
export type PlayerRoleAtRevisionEvidence = { readonly kind: "PLAYER_ROLE_AT_REVISION"; readonly playerId: PlayerId; readonly seatNumber: SeatNumber; readonly roleId: RoleId; readonly characterType: "TOWNSFOLK" | "OUTSIDER" | "MINION" | "DEMON"; readonly defaultAlignment: "GOOD" | "EVIL"; readonly characterStateRevision: number };
export type PhilosopherGrantEvidence = { readonly kind: "PHILOSOPHER_GRANT"; readonly grantId: GrantedAbilityId; readonly philosopherOpportunityId: ActionOpportunityId; readonly sourcePlayerId: PlayerId; readonly sourceSeatNumber: SeatNumber; readonly chosenRoleId: RoleId; readonly sourceCharacterStateRevision: number };
export type FirstNightTaskInsertionEvidence = { readonly kind: "FIRST_NIGHT_TASK_INSERTION"; readonly taskId: ScheduledTaskId; readonly philosopherOpportunityId: ActionOpportunityId; readonly sourcePlayerId: PlayerId; readonly sourceSeatNumber: SeatNumber; readonly chosenRoleId: RoleId; readonly generation: { readonly kind: "V1"; readonly taskPlanVersion: "first-night-task-plan-v1" } | { readonly kind: "V2"; readonly taskPlanVersion: "first-night-task-plan-v2"; readonly grantId: GrantedAbilityId; readonly schedulingVersion: "philosopher-gained-first-night-scheduling-v2" } };
export type SnakeCharmerResolutionEvidence = { readonly kind: "SNAKE_CHARMER_RESOLUTION"; readonly resolutionKind: "NON_DEMON_NO_SWAP" | "INEFFECTIVE_NO_SWAP" | "DEMON_HIT_SWAP"; readonly taskId: ScheduledTaskId; readonly opportunityId: ActionOpportunityId; readonly targetPlayerId: PlayerId; readonly targetSeatNumber: SeatNumber; readonly targetRoleIdAtResolution: RoleId; readonly resolutionEventId: EventId };
export type EvilTwinPairEvidence = { readonly kind: "EVIL_TWIN_PAIR"; readonly pairId: string; readonly evilTwinPlayerId: PlayerId; readonly goodTwinPlayerId: PlayerId; readonly establishedTaskId: ScheduledTaskId; readonly informationDeliveryEventId: EventId };
export type WitchPendingMarkerEvidence = { readonly kind: "WITCH_PENDING_MARKER"; readonly pendingDeathId: string; readonly sourcePlayerId: PlayerId; readonly targetPlayerId: PlayerId; readonly taskId: ScheduledTaskId; readonly opportunityId: ActionOpportunityId; readonly terminalEventId: EventId };
export type CerenovusInstructionEvidence = { readonly kind: "CERENOVUS_INSTRUCTION"; readonly deliveryId: string; readonly choiceId: string; readonly markerId: string; readonly sourcePlayerId: PlayerId; readonly targetPlayerId: PlayerId; readonly chosenRoleId: RoleId; readonly taskId: ScheduledTaskId; readonly terminalEventId: EventId };
export type ClockmakerDeliveryEvidence = { readonly kind: "CLOCKMAKER_DELIVERY"; readonly deliveryId: string; readonly taskId: ScheduledTaskId; readonly sourcePlayerId: PlayerId; readonly ruleCorrectDistance: number; readonly selectedDistance: number; readonly terminalEventId: EventId };
export type DreamerDeliveryEvidence = { readonly kind: "DREAMER_DELIVERY"; readonly taskId: ScheduledTaskId; readonly opportunityId: ActionOpportunityId; readonly sourcePlayerId: PlayerId; readonly targetPlayerId: PlayerId; readonly deliveredGoodRoleId: RoleId; readonly deliveredEvilRoleId: RoleId; readonly terminalEventId: EventId };
export type SeamstressDeliveryEvidence = { readonly kind: "SEAMSTRESS_DELIVERY"; readonly taskId: ScheduledTaskId; readonly opportunityId: ActionOpportunityId; readonly sourcePlayerId: PlayerId; readonly firstTargetPlayerId: PlayerId; readonly secondTargetPlayerId: PlayerId; readonly ruleCorrectAnswer: "YES" | "NO"; readonly deliveredAnswer: "YES" | "NO"; readonly terminalEventId: EventId };
export type MathematicianDeliveryEvidence = { readonly kind: "MATHEMATICIAN_DELIVERY"; readonly deliveryId: MathematicianDeliveryId; readonly taskId: ScheduledTaskId; readonly sourcePlayerId: PlayerId; readonly trueCount: MathematicianCount; readonly selectedCount: MathematicianCount; readonly terminalEventId: EventId };
export type AbilityOutcomeEvidenceReference = SourceEventEvidence | TaskEvidence | ActionOpportunityEvidence | AbilityImpairmentEvidence | RoleTenureEvidence | CharacterStateEvidence | PlayerRoleAtRevisionEvidence | PhilosopherGrantEvidence | FirstNightTaskInsertionEvidence | SnakeCharmerResolutionEvidence | EvilTwinPairEvidence | WitchPendingMarkerEvidence | CerenovusInstructionEvidence | ClockmakerDeliveryEvidence | DreamerDeliveryEvidence | SeamstressDeliveryEvidence | MathematicianDeliveryEvidence;

export type AbilityOutcomeStatus = "NORMAL" | "ABNORMAL" | "UNRESOLVED" | "PENDING_TRIGGER";
export type AbilityOutcomeCause = "NO_OTHER_CHARACTER_ABILITY" | "SOURCE_DRUNKENNESS" | "SOURCE_POISONING" | "VORTOX_FALSE_INFORMATION" | "DREAMER_VORTOX_CONSTRAINT_UNRECORDED" | "VORTOX_APPLICABILITY_NOT_PROVEN" | "CAUSE_NOT_PROVEN";
export type FirstNightAbilityOutcomeFact = {
  readonly auditFactId: FirstNightAbilityOutcomeFactId; readonly auditModelVersion: typeof FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION;
  readonly windowVersion: typeof FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION; readonly sourcePlayerId: PlayerId; readonly sourceSeatNumber: SeatNumber;
  readonly abilityRoleId: RoleId; readonly abilityTaskId: ScheduledTaskId; readonly abilityInstance: FirstNightAbilityInstanceProvenance;
  readonly sourceEventId: EventId; readonly sourceBatchId: BatchId; readonly sourceEventSequence: number; readonly evaluatedCharacterStateRevision: number;
  readonly outcomeStatus: AbilityOutcomeStatus; readonly causeKind: AbilityOutcomeCause; readonly causedByAnotherCharacterAbility: boolean;
  readonly evidenceReferences: readonly AbilityOutcomeEvidenceReference[]; readonly detectedAtEventSequence: number;
};
export type FirstNightAbilityOutcomeLedger = { readonly ledgerVersion: typeof FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION; readonly auditModelVersion: typeof FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION; readonly windowAnchor: FirstNightAbilityOutcomeWindowAnchor; readonly facts: readonly FirstNightAbilityOutcomeFact[] };

const fail = (reason: string): OutcomeLedgerValidationResult => ({ valid: false, reason });
const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const canonicalIdentifier = (v: unknown): v is string => nonEmpty(v) && v.trim() === v && ![...v].some((character) => {
  const code = character.charCodeAt(0);
  return code <= 31 || code === 127;
});
const positive = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v > 0;
const plain = (v: unknown): v is Record<string, unknown> => {
  if (!isCanonicalDataValue(v) || v === null || typeof v !== "object" || Array.isArray(v)) return false;
  const proto: unknown = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};
const exact = (v: Record<string, unknown>, keys: readonly string[]): boolean => {
  const actual = Object.keys(v).sort(); const expected = [...keys].sort();
  if (actual.length !== expected.length) return false;
  for (let index = 0; index < actual.length; index += 1) {
    if (actual[index] !== expected[index]) return false;
  }
  return true;
};
const clone = <T>(v: T): T => {
  if(!isCanonicalDataValue(v))throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Clone input must be canonical data");
  const copy=(value:unknown):unknown=>Array.isArray(value)?value.map(copy):value!==null&&typeof value==="object"?Object.fromEntries(Object.keys(value).map((key)=>[key,copy((value as Record<string,unknown>)[key])])):value;
  return copy(v) as T;
};

export const formatBaseFirstNightAbilityInstanceId = (taskId: ScheduledTaskId): FirstNightAbilityInstanceId => `first-night-ability-instance-v1:base-task:${taskId}` as FirstNightAbilityInstanceId;
export const formatPhilosopherGainedV1AbilityInstanceId = (input: { readonly taskId: ScheduledTaskId; readonly grantId: GrantedAbilityId }): FirstNightAbilityInstanceId => `first-night-ability-instance-v1:philosopher-gained-v1:${input.taskId}:grant:${input.grantId}` as FirstNightAbilityInstanceId;
export const formatPhilosopherGainedV2AbilityInstanceId = (input: { readonly taskId: ScheduledTaskId; readonly grantId: GrantedAbilityId }): FirstNightAbilityInstanceId => `first-night-ability-instance-v1:philosopher-gained-v2:${input.taskId}:grant:${input.grantId}` as FirstNightAbilityInstanceId;
export const formatExplicitFirstNightAbilityInstanceId = (input: { readonly roleId: RoleId; readonly existingInstanceId: AbilityInstanceId }): FirstNightAbilityInstanceId => `first-night-ability-instance-v1:explicit:${input.roleId}:${input.existingInstanceId}` as FirstNightAbilityInstanceId;
type ParsedTaskId = { readonly generation: "BASE" | "V1" | "V2"; readonly taskType: FirstNightTaskType; readonly embeddedSeat: SeatNumber; readonly embeddedRoleId?: RoleId };
const parseCanonicalFirstNightTaskId=(value:string):ParsedTaskId|undefined=>{
  const taskTypes="PHILOSOPHER_ACTION|MINION_INFO|DEMON_INFO|SNAKE_CHARMER_ACTION|EVIL_TWIN_SETUP|WITCH_ACTION|CERENOVUS_ACTION|CLOCKMAKER_INFORMATION|DREAMER_ACTION|SEAMSTRESS_ACTION|MATHEMATICIAN_INFORMATION";
  const base=new RegExp(`^first-night-v1:(${taskTypes}):seat-(0[1-9]|1[0-2])$`).exec(value);
  if(base?.[1]!==undefined&&base[2]!==undefined)return {generation:"BASE",taskType:base[1] as FirstNightTaskType,embeddedSeat:Number(base[2]) as SeatNumber};
  const gained=new RegExp(`^first-night-v(1|2):PHILOSOPHER_GAINED:(${taskTypes}):seat-(0[1-9]|1[0-2]):from-([a-z][a-z0-9_]*)$`).exec(value);
  if(gained?.[1]!==undefined&&gained[2]!==undefined&&gained[3]!==undefined&&gained[4]!==undefined)return {generation:gained[1]==="1"?"V1":"V2",taskType:gained[2] as FirstNightTaskType,embeddedSeat:Number(gained[3]) as SeatNumber,embeddedRoleId:gained[4] as RoleId};
  return undefined;
};
const parseCanonicalGrantId=(value:string):{readonly embeddedSeat:SeatNumber;readonly embeddedRoleId:RoleId}|undefined=>{const match=/^philosopher-grant-v1:seat-(0[1-9]|1[0-2]):from-([a-z][a-z0-9_]*)$/.exec(value);return match?.[1]!==undefined&&match[2]!==undefined?{embeddedSeat:Number(match[1]) as SeatNumber,embeddedRoleId:match[2] as RoleId}:undefined;};
export const parseFirstNightAbilityInstanceId = (value: unknown): { readonly valid: true; readonly canonicalId: FirstNightAbilityInstanceId; readonly kind: FirstNightAbilityInstanceProvenance["kind"]; readonly taskId?: ScheduledTaskId; readonly grantId?: GrantedAbilityId; readonly roleId?: RoleId; readonly existingInstanceId?: AbilityInstanceId; readonly generation?: "BASE" | "V1" | "V2"; readonly taskType?: FirstNightTaskType; readonly embeddedSeat?: SeatNumber; readonly embeddedRoleId?: RoleId } | { readonly valid: false; readonly reason: string } => {
  if (!nonEmpty(value) || value.trim() !== value || [...value].some((character) => { const code=character.charCodeAt(0); return code <= 31 || code === 127; })) return { valid: false, reason: "Ability instance ID must be a canonical non-empty string" };
  let match = /^first-night-ability-instance-v1:base-task:(.+)$/.exec(value);
  if (match?.[1] !== undefined) { const parsedTask=parseCanonicalFirstNightTaskId(match[1]);if(parsedTask?.generation==="BASE")return { valid: true, kind: "BASE_ROLE_TASK", canonicalId: value as FirstNightAbilityInstanceId, taskId: match[1] as ScheduledTaskId, ...parsedTask }; }
  match = /^first-night-ability-instance-v1:philosopher-gained-(v1|v2):(.+):grant:(.+)$/.exec(value);
  if (match?.[1] !== undefined && value.split(":grant:").length===2 && match[2]!==undefined&&match[3]!==undefined) { const parsedTask=parseCanonicalFirstNightTaskId(match[2]);const parsedGrant=parseCanonicalGrantId(match[3]);const generation=match[1]==="v1"?"V1":"V2";if(parsedTask?.generation===generation&&parsedGrant!==undefined&&parsedTask.embeddedSeat===parsedGrant.embeddedSeat&&parsedTask.embeddedRoleId===parsedGrant.embeddedRoleId)return { valid: true, kind: generation === "V1" ? "PHILOSOPHER_GAINED_TASK_V1" : "PHILOSOPHER_GAINED_TASK_V2", canonicalId: value as FirstNightAbilityInstanceId, taskId: match[2] as ScheduledTaskId, grantId: match[3] as GrantedAbilityId, ...parsedTask }; }
  match = /^first-night-ability-instance-v1:explicit:([^:]+):(.+)$/.exec(value);
  if (nonEmpty(match?.[1]) && nonEmpty(match?.[2])) return { valid: true, kind: "EXPLICIT_DOMAIN_INSTANCE", canonicalId: value as FirstNightAbilityInstanceId, roleId: match[1] as RoleId, existingInstanceId: match[2] as AbilityInstanceId };
  return { valid: false, reason: "Ability instance ID has invalid canonical grammar" };
};
const provenanceKeys:Record<FirstNightAbilityInstanceProvenance["kind"],readonly string[]>={BASE_ROLE_TASK:["provenanceVersion","kind","abilityInstanceId","abilityRoleId","taskId","sourcePlayerId","sourceSeatNumber"],PHILOSOPHER_GAINED_TASK_V1:["provenanceVersion","kind","abilityInstanceId","abilityRoleId","taskId","sourcePlayerId","sourceSeatNumber","philosopherOpportunityId","grantId","sourceCharacterStateRevision"],PHILOSOPHER_GAINED_TASK_V2:["provenanceVersion","kind","abilityInstanceId","abilityRoleId","taskId","sourcePlayerId","sourceSeatNumber","philosopherOpportunityId","grantId","sourceCharacterStateRevision","schedulingVersion"],EXPLICIT_DOMAIN_INSTANCE:["provenanceVersion","kind","abilityInstanceId","abilityRoleId","taskId","sourcePlayerId","sourceSeatNumber","sourceRoleTenureId","existingInstanceId"]};
export const validateFirstNightAbilityInstanceProvenanceShape=(value:unknown):OutcomeLedgerValidationResult=>{
  try{
    if(!plain(value)||!nonEmpty(value.kind)||!(value.kind in provenanceKeys)||!exact(value,provenanceKeys[value.kind as FirstNightAbilityInstanceProvenance["kind"]]))return fail("Invalid ability instance provenance shape");
    const p=value as unknown as FirstNightAbilityInstanceProvenance;const parsed=parseFirstNightAbilityInstanceId(p.abilityInstanceId);
    if(!parsed.valid||parsed.kind!==p.kind||!nonEmpty(p.abilityRoleId)||!nonEmpty(p.taskId)||!nonEmpty(p.sourcePlayerId)||!positive(p.sourceSeatNumber)||p.sourceSeatNumber>12)return fail("Ability instance provenance fields are invalid");
    if(p.kind==="BASE_ROLE_TASK"&&(parsed.taskId!==p.taskId||parsed.generation!=="BASE"||parsed.embeddedSeat!==p.sourceSeatNumber||parsed.taskType===undefined||roleForTask[parsed.taskType]!==p.abilityRoleId||p.abilityInstanceId!==formatBaseFirstNightAbilityInstanceId(p.taskId)))return fail("Base ability instance does not round-trip");
    if(p.kind==="PHILOSOPHER_GAINED_TASK_V1"&&(parsed.taskId!==p.taskId||parsed.grantId!==p.grantId||parsed.generation!=="V1"||parsed.embeddedSeat!==p.sourceSeatNumber||parsed.embeddedRoleId!==p.abilityRoleId||parsed.taskType===undefined||roleForTask[parsed.taskType]!==p.abilityRoleId||!nonEmpty(p.philosopherOpportunityId)||!positive(p.sourceCharacterStateRevision)||p.abilityInstanceId!==formatPhilosopherGainedV1AbilityInstanceId({taskId:p.taskId,grantId:p.grantId})))return fail("Gained V1 instance chain does not round-trip");
    if(p.kind==="PHILOSOPHER_GAINED_TASK_V2"&&(parsed.taskId!==p.taskId||parsed.grantId!==p.grantId||parsed.generation!=="V2"||parsed.embeddedSeat!==p.sourceSeatNumber||parsed.embeddedRoleId!==p.abilityRoleId||parsed.taskType===undefined||roleForTask[parsed.taskType]!==p.abilityRoleId||!nonEmpty(p.philosopherOpportunityId)||!positive(p.sourceCharacterStateRevision)||p.schedulingVersion!=="philosopher-gained-first-night-scheduling-v2"||p.abilityInstanceId!==formatPhilosopherGainedV2AbilityInstanceId({taskId:p.taskId,grantId:p.grantId})))return fail("Gained V2 instance chain does not round-trip");
    if(p.kind==="EXPLICIT_DOMAIN_INSTANCE"&&(parsed.roleId!==p.abilityRoleId||parsed.existingInstanceId!==p.existingInstanceId||!nonEmpty(p.sourceRoleTenureId)||p.abilityInstanceId!==formatExplicitFirstNightAbilityInstanceId({roleId:p.abilityRoleId,existingInstanceId:p.existingInstanceId})))return fail("Explicit instance chain does not round-trip");
    return {valid:true};
  }catch{return fail("Ability instance provenance must fail closed");}
};
export const cloneFirstNightAbilityInstanceProvenance=(value:FirstNightAbilityInstanceProvenance):FirstNightAbilityInstanceProvenance=>{
  const validation=validateFirstNightAbilityInstanceProvenanceShape(value);
  if(!validation.valid)throw new DomainError("InvalidFirstNightAbilityInstance",validation.reason);
  return clone(value);
};
export const formatFirstNightAbilityOutcomeFactId = (sourceEventId: EventId): FirstNightAbilityOutcomeFactId => `first-night-ability-outcome-fact-v1:${sourceEventId}` as FirstNightAbilityOutcomeFactId;
export const parseFirstNightAbilityOutcomeFactId = (value: unknown): { readonly valid: true; readonly canonicalId: FirstNightAbilityOutcomeFactId; readonly sourceEventId: EventId } | { readonly valid: false; readonly reason: string } => {
  if (!nonEmpty(value)) return { valid: false, reason: "Fact ID must be non-empty" };
  const prefix = "first-night-ability-outcome-fact-v1:"; const source = value.startsWith(prefix) ? value.slice(prefix.length) : "";
  return nonEmpty(source) ? { valid: true, canonicalId: value as FirstNightAbilityOutcomeFactId, sourceEventId: source as EventId } : { valid: false, reason: "Fact ID has invalid canonical grammar" };
};

const WINDOW_ANCHOR_KEYS = ["windowVersion", "gameId", "nightNumber", "rulesBaselineVersion", "firstNightInitializedEventId", "startEventSequence", "startBoundary"];
export const validateFirstNightAbilityOutcomeWindowAnchorShape = (value: unknown): OutcomeLedgerValidationResult => plain(value) && exact(value, WINDOW_ANCHOR_KEYS) && value.windowVersion === FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION && canonicalIdentifier(value.gameId) && value.nightNumber === 1 && nonEmpty(value.rulesBaselineVersion) && canonicalIdentifier(value.firstNightInitializedEventId) && positive(value.startEventSequence) && value.startBoundary === "EXCLUSIVE" ? { valid: true } : fail("Invalid first-night outcome window anchor");
export const cloneFirstNightAbilityOutcomeWindowAnchor = (value: FirstNightAbilityOutcomeWindowAnchor): FirstNightAbilityOutcomeWindowAnchor => {
  const validation = validateFirstNightAbilityOutcomeWindowAnchorShape(value);
  if (!validation.valid) throw new DomainError("InvalidFirstNightAbilityOutcomeWindow", validation.reason);
  return clone(value);
};

const validateFirstNightInitializationEnvelopeProvenance=(value:unknown):OutcomeLedgerValidationResult=>
  plain(value)&&exact(value,["provenanceVersion","gameId","rulesBaselineVersion","eventId","eventSequence"])&&
  value.provenanceVersion==="first-night-initialization-envelope-provenance-v1"&&canonicalIdentifier(value.gameId)&&
  nonEmpty(value.rulesBaselineVersion)&&canonicalIdentifier(value.eventId)&&positive(value.eventSequence)
    ?{valid:true}:fail("Invalid first-night initialization envelope provenance");

const evidenceKeys: Record<AbilityOutcomeEvidenceReference["kind"], readonly string[]> = {
  SOURCE_EVENT: ["kind","eventId","eventType","eventSequence","batchId"], TASK: ["kind","taskId","taskType"], ACTION_OPPORTUNITY: ["kind","opportunityVersion","nightNumber","opportunityId","opportunityKind","opportunityStatus","taskId","taskType","sourcePlayerId","sourceSeatNumber","sourceRole","sourceCharacterStateRevision"],
  ABILITY_IMPAIRMENT: ["kind","impairmentId","impairmentKind","affectedPlayerId","affectedSeatNumber","affectedRoleId","sourceKind","appliedCharacterStateRevision"], ROLE_TENURE: ["kind","roleTenureId","playerId","seatNumber","roleId","acquiredCharacterStateRevision","statusAtEvaluation"], CHARACTER_STATE: ["kind","characterStateRevision"], PLAYER_ROLE_AT_REVISION: ["kind","playerId","seatNumber","roleId","characterType","defaultAlignment","characterStateRevision"], PHILOSOPHER_GRANT: ["kind","grantId","philosopherOpportunityId","sourcePlayerId","sourceSeatNumber","chosenRoleId","sourceCharacterStateRevision"], FIRST_NIGHT_TASK_INSERTION: ["kind","taskId","philosopherOpportunityId","sourcePlayerId","sourceSeatNumber","chosenRoleId","generation"], SNAKE_CHARMER_RESOLUTION: ["kind","resolutionKind","taskId","opportunityId","targetPlayerId","targetSeatNumber","targetRoleIdAtResolution","resolutionEventId"], EVIL_TWIN_PAIR: ["kind","pairId","evilTwinPlayerId","goodTwinPlayerId","establishedTaskId","informationDeliveryEventId"], WITCH_PENDING_MARKER: ["kind","pendingDeathId","sourcePlayerId","targetPlayerId","taskId","opportunityId","terminalEventId"], CERENOVUS_INSTRUCTION: ["kind","deliveryId","choiceId","markerId","sourcePlayerId","targetPlayerId","chosenRoleId","taskId","terminalEventId"], CLOCKMAKER_DELIVERY: ["kind","deliveryId","taskId","sourcePlayerId","ruleCorrectDistance","selectedDistance","terminalEventId"], DREAMER_DELIVERY: ["kind","taskId","opportunityId","sourcePlayerId","targetPlayerId","deliveredGoodRoleId","deliveredEvilRoleId","terminalEventId"], SEAMSTRESS_DELIVERY: ["kind","taskId","opportunityId","sourcePlayerId","firstTargetPlayerId","secondTargetPlayerId","ruleCorrectAnswer","deliveredAnswer","terminalEventId"], MATHEMATICIAN_DELIVERY: ["kind","deliveryId","taskId","sourcePlayerId","trueCount","selectedCount","terminalEventId"]
};
const ranks = Object.fromEntries(Object.keys(evidenceKeys).map((key, i) => [key, i])) as Record<string, number>;
const primary = (e: AbilityOutcomeEvidenceReference): string => {
  switch(e.kind){
    case "SOURCE_EVENT":return e.eventId;case "TASK":return e.taskId;case "ACTION_OPPORTUNITY":return e.opportunityId;
    case "ABILITY_IMPAIRMENT":return e.impairmentId;case "ROLE_TENURE":return e.roleTenureId;case "CHARACTER_STATE":return String(e.characterStateRevision);
    case "PLAYER_ROLE_AT_REVISION":return `${e.playerId}@revision-${e.characterStateRevision}`;case "PHILOSOPHER_GRANT":return e.grantId;
    case "FIRST_NIGHT_TASK_INSERTION":return `${e.generation.kind}:${e.taskId}`;case "SNAKE_CHARMER_RESOLUTION":return e.resolutionEventId;
    case "EVIL_TWIN_PAIR":return e.pairId;case "WITCH_PENDING_MARKER":return e.pendingDeathId;case "CERENOVUS_INSTRUCTION":return e.deliveryId;
    case "CLOCKMAKER_DELIVERY":return e.deliveryId;case "DREAMER_DELIVERY":return e.terminalEventId;case "SEAMSTRESS_DELIVERY":return e.terminalEventId;case "MATHEMATICIAN_DELIVERY":return e.deliveryId;
  }
};
type ParsedMathematicianEvidenceIdentity =
  | { readonly valid: true; readonly taskId: ScheduledTaskId; readonly generation: "BASE" | "V1" | "V2" }
  | { readonly valid: false };
const parseMathematicianEvidenceIdentity = (
  deliveryIdValue: unknown,
  taskIdValue: unknown
): ParsedMathematicianEvidenceIdentity => {
  if (!nonEmpty(deliveryIdValue) || !nonEmpty(taskIdValue) ||
      deliveryIdValue !== `mathematician-delivery-v1:${taskIdValue}`) return { valid: false };
  if (/^first-night-v1:MATHEMATICIAN_INFORMATION:seat-(0[1-9]|1[0-2])$/.test(taskIdValue)) {
    return { valid: true, taskId: taskIdValue as ScheduledTaskId, generation: "BASE" };
  }
  if (/^first-night-v1:PHILOSOPHER_GAINED:MATHEMATICIAN_INFORMATION:seat-(0[1-9]|1[0-2]):from-mathematician$/.test(taskIdValue)) {
    return { valid: true, taskId: taskIdValue as ScheduledTaskId, generation: "V1" };
  }
  if (/^first-night-v2:PHILOSOPHER_GAINED:MATHEMATICIAN_INFORMATION:seat-(0[1-9]|1[0-2]):from-mathematician$/.test(taskIdValue)) {
    return { valid: true, taskId: taskIdValue as ScheduledTaskId, generation: "V2" };
  }
  return { valid: false };
};
export const validateAbilityOutcomeEvidenceReferenceShape = (value: unknown): OutcomeLedgerValidationResult => {
  try {
    if (!plain(value) || !nonEmpty(value.kind) || !(value.kind in evidenceKeys) || !exact(value, evidenceKeys[value.kind as AbilityOutcomeEvidenceReference["kind"]])) return fail("Evidence reference must have one exact closed variant shape");
    const e=value as unknown as AbilityOutcomeEvidenceReference;const id=(v:unknown):boolean=>nonEmpty(v);const seat=(v:unknown):boolean=>typeof v==="number"&&Number.isSafeInteger(v)&&v>=1&&v<=12;
    let valid=false;
    switch(e.kind){
      case "SOURCE_EVENT":valid=id(e.eventId)&&terminalTypes.has(e.eventType)&&positive(e.eventSequence)&&id(e.batchId);break;
      case "TASK":valid=id(e.taskId)&&Object.hasOwn(roleForTask,e.taskType);break;
      case "ACTION_OPPORTUNITY": {
        const parsedOpportunity = e.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V2" ||
          e.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3"
          ? parseBaseDreamerV2FirstNightActionOpportunityId(e.opportunityId)
          : parseFirstNightActionOpportunityId(e.opportunityId);
        valid=e.opportunityVersion==="first-night-action-opportunity-v1"&&e.nightNumber===1&&parsedOpportunity.valid&&
          ["PHILOSOPHER_FIRST_NIGHT_ACTION","SNAKE_CHARMER_FIRST_NIGHT_ACTION","WITCH_FIRST_NIGHT_ACTION","CERENOVUS_FIRST_NIGHT_ACTION","DREAMER_FIRST_NIGHT_ACTION","DREAMER_FIRST_NIGHT_ACTION_V2","DREAMER_FIRST_NIGHT_ACTION_V3","SEAMSTRESS_FIRST_NIGHT_ACTION"].includes(e.opportunityKind)&&
          ["OPEN","CLOSED"].includes(e.opportunityStatus)&&id(e.taskId)&&Object.hasOwn(roleForTask,e.taskType)&&
          id(e.sourcePlayerId)&&seat(e.sourceSeatNumber)&&hasExactRoleSetupSnapshotShape(e.sourceRole)&&positive(e.sourceCharacterStateRevision)&&
          parsedOpportunity.taskType===e.taskType&&parsedOpportunity.seatNumber===e.sourceSeatNumber;
        break;
      }
      case "ABILITY_IMPAIRMENT":valid=id(e.impairmentId)&&["DRUNK","POISONED"].includes(e.impairmentKind)&&id(e.affectedPlayerId)&&seat(e.affectedSeatNumber)&&id(e.affectedRoleId)&&["PHILOSOPHER_CHOSEN_DUPLICATE","SNAKE_CHARMER_DEMON_HIT"].includes(e.sourceKind)&&positive(e.appliedCharacterStateRevision);break;
      case "ROLE_TENURE":valid=id(e.roleTenureId)&&id(e.playerId)&&seat(e.seatNumber)&&id(e.roleId)&&positive(e.acquiredCharacterStateRevision)&&["ACTIVE","INACTIVE"].includes(e.statusAtEvaluation);break;
      case "CHARACTER_STATE":valid=positive(e.characterStateRevision);break;
      case "PLAYER_ROLE_AT_REVISION":valid=id(e.playerId)&&seat(e.seatNumber)&&id(e.roleId)&&["TOWNSFOLK","OUTSIDER","MINION","DEMON"].includes(e.characterType)&&["GOOD","EVIL"].includes(e.defaultAlignment)&&positive(e.characterStateRevision);break;
      case "PHILOSOPHER_GRANT":valid=id(e.grantId)&&id(e.philosopherOpportunityId)&&id(e.sourcePlayerId)&&seat(e.sourceSeatNumber)&&id(e.chosenRoleId)&&positive(e.sourceCharacterStateRevision);break;
      case "FIRST_NIGHT_TASK_INSERTION":valid=id(e.taskId)&&id(e.philosopherOpportunityId)&&id(e.sourcePlayerId)&&seat(e.sourceSeatNumber)&&id(e.chosenRoleId)&&plain(e.generation)&&((e.generation.kind==="V1"&&exact(e.generation,["kind","taskPlanVersion"])&&e.generation.taskPlanVersion==="first-night-task-plan-v1")||(e.generation.kind==="V2"&&exact(e.generation,["grantId","kind","schedulingVersion","taskPlanVersion"])&&e.generation.taskPlanVersion==="first-night-task-plan-v2"&&id(e.generation.grantId)&&e.generation.schedulingVersion==="philosopher-gained-first-night-scheduling-v2"));break;
      case "SNAKE_CHARMER_RESOLUTION":valid=["NON_DEMON_NO_SWAP","INEFFECTIVE_NO_SWAP","DEMON_HIT_SWAP"].includes(e.resolutionKind)&&id(e.taskId)&&id(e.opportunityId)&&id(e.targetPlayerId)&&seat(e.targetSeatNumber)&&id(e.targetRoleIdAtResolution)&&id(e.resolutionEventId);break;
      case "EVIL_TWIN_PAIR":valid=id(e.pairId)&&id(e.evilTwinPlayerId)&&id(e.goodTwinPlayerId)&&id(e.establishedTaskId)&&id(e.informationDeliveryEventId);break;
      case "WITCH_PENDING_MARKER":valid=id(e.pendingDeathId)&&id(e.sourcePlayerId)&&id(e.targetPlayerId)&&id(e.taskId)&&id(e.opportunityId)&&id(e.terminalEventId);break;
      case "CERENOVUS_INSTRUCTION":valid=id(e.deliveryId)&&id(e.choiceId)&&id(e.markerId)&&id(e.sourcePlayerId)&&id(e.targetPlayerId)&&id(e.chosenRoleId)&&id(e.taskId)&&id(e.terminalEventId);break;
      case "CLOCKMAKER_DELIVERY":valid=id(e.deliveryId)&&id(e.taskId)&&id(e.sourcePlayerId)&&typeof e.ruleCorrectDistance==="number"&&Number.isSafeInteger(e.ruleCorrectDistance)&&typeof e.selectedDistance==="number"&&Number.isSafeInteger(e.selectedDistance)&&id(e.terminalEventId);break;
      case "DREAMER_DELIVERY":valid=id(e.taskId)&&id(e.opportunityId)&&id(e.sourcePlayerId)&&id(e.targetPlayerId)&&id(e.deliveredGoodRoleId)&&id(e.deliveredEvilRoleId)&&e.deliveredGoodRoleId!==e.deliveredEvilRoleId&&id(e.terminalEventId);break;
      case "SEAMSTRESS_DELIVERY":valid=id(e.taskId)&&id(e.opportunityId)&&id(e.sourcePlayerId)&&id(e.firstTargetPlayerId)&&id(e.secondTargetPlayerId)&&e.firstTargetPlayerId!==e.secondTargetPlayerId&&["YES","NO"].includes(e.ruleCorrectAnswer)&&["YES","NO"].includes(e.deliveredAnswer)&&id(e.terminalEventId);break;
      case "MATHEMATICIAN_DELIVERY": {
        const parsed = parseMathematicianEvidenceIdentity(e.deliveryId, e.taskId);
        valid=parsed.valid&&id(e.sourcePlayerId)&&typeof e.trueCount==="number"&&Number.isSafeInteger(e.trueCount)&&e.trueCount>=0&&e.trueCount<=11&&typeof e.selectedCount==="number"&&Number.isSafeInteger(e.selectedCount)&&e.selectedCount>=0&&e.selectedCount<=11&&id(e.terminalEventId);
        break;
      }
    }
    return valid?{valid:true}:fail("Evidence reference fields are not canonical");
  } catch { return fail("Evidence reference must fail closed"); }
};
export const cloneAbilityOutcomeEvidenceReference = (value: AbilityOutcomeEvidenceReference): AbilityOutcomeEvidenceReference => {
  const validation = validateAbilityOutcomeEvidenceReferenceShape(value);
  if (!validation.valid) throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence", validation.reason);
  return clone(value);
};
const mathematicianEvidenceSlot = (
  evidence: AbilityOutcomeEvidenceReference,
  delivery: MathematicianDeliveryEvidence
): number => {
  switch (evidence.kind) {
    case "SOURCE_EVENT": return 1;
    case "TASK": return 2;
    case "ACTION_OPPORTUNITY": return 3;
    case "CHARACTER_STATE": return 4;
    case "PLAYER_ROLE_AT_REVISION":
      if (evidence.playerId === delivery.sourcePlayerId) return 5;
      if (evidence.roleId === "vortox") return 10;
      break;
    case "ROLE_TENURE":
      if (evidence.playerId === delivery.sourcePlayerId) return 6;
      if (evidence.roleId === "vortox") return 11;
      break;
    case "PHILOSOPHER_GRANT": return 7;
    case "FIRST_NIGHT_TASK_INSERTION": return 8;
    case "ABILITY_IMPAIRMENT":
      if (evidence.affectedPlayerId === delivery.sourcePlayerId && evidence.affectedRoleId === "mathematician") return 9;
      if (evidence.affectedRoleId === "vortox") return 12;
      break;
    case "MATHEMATICIAN_DELIVERY": return 13;
    default:
      break;
  }
  throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence", "Mathematician evidence does not fit the frozen 13-slot matrix");
};
export const canonicalizeAbilityOutcomeEvidenceReferences = (values: unknown): readonly AbilityOutcomeEvidenceReference[] => {
  if (!isDenseCanonicalArray(values)) throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence", "Evidence must be a dense canonical array");
  const captured = values.map((v) => { const result = validateAbilityOutcomeEvidenceReferenceShape(v); if (!result.valid) throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence", result.reason); return clone(v as AbilityOutcomeEvidenceReference); });
  const deliveries = captured.filter((entry): entry is MathematicianDeliveryEvidence => entry.kind === "MATHEMATICIAN_DELIVERY");
  const sorted = deliveries.length === 0
    ? captured.sort((a,b) => (ranks[a.kind]!-ranks[b.kind]!) || (primary(a)<primary(b)?-1:primary(a)>primary(b)?1:0))
    : (() => {
        if (deliveries.length !== 1) throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence", "Mathematician evidence requires one delivery identity");
        const delivery = deliveries[0]!;
        const slotted = captured.map((entry) => ({ entry, slot: mathematicianEvidenceSlot(entry, delivery) }));
        const seenSlots = new Set<number>();
        for (const item of slotted) {
          if (seenSlots.has(item.slot)) throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence", "Mathematician evidence slots cannot repeat");
          seenSlots.add(item.slot);
        }
        return slotted.sort((left, right) => left.slot - right.slot).map((item) => item.entry);
      })();
  const out: AbilityOutcomeEvidenceReference[]=[];
  for (const e of sorted) { const prior=out.at(-1); if (prior?.kind===e.kind && primary(prior)===primary(e)) { if (!sameCanonicalDataValue(prior,e)) throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Conflicting evidence primary identity"); } else out.push(e); }
  return out;
};

const FACT_KEYS=["auditFactId","auditModelVersion","windowVersion","sourcePlayerId","sourceSeatNumber","abilityRoleId","abilityTaskId","abilityInstance","sourceEventId","sourceBatchId","sourceEventSequence","evaluatedCharacterStateRevision","outcomeStatus","causeKind","causedByAnotherCharacterAbility","evidenceReferences","detectedAtEventSequence"];
export const validateFirstNightAbilityOutcomeFactShape = (value: unknown): OutcomeLedgerValidationResult => {
  try {
    if (!plain(value)||!exact(value,FACT_KEYS)||parseFirstNightAbilityOutcomeFactId(value.auditFactId).valid===false||value.auditFactId!==formatFirstNightAbilityOutcomeFactId(value.sourceEventId as EventId)||value.auditModelVersion!==FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION||value.windowVersion!==FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION||!positive(value.sourceEventSequence)||value.detectedAtEventSequence!==value.sourceEventSequence||!positive(value.evaluatedCharacterStateRevision)||!isDenseCanonicalArray(value.evidenceReferences)||!validateFirstNightAbilityInstanceProvenanceShape(value.abilityInstance).valid) return fail("Invalid outcome fact shape or identity");
    const combinations = (value.outcomeStatus==="NORMAL"&&value.causeKind==="NO_OTHER_CHARACTER_ABILITY"&&value.causedByAnotherCharacterAbility===false)||(value.outcomeStatus==="ABNORMAL"&&["SOURCE_DRUNKENNESS","SOURCE_POISONING","VORTOX_FALSE_INFORMATION"].includes(value.causeKind as string)&&value.causedByAnotherCharacterAbility===true)||(value.outcomeStatus==="UNRESOLVED"&&["DREAMER_VORTOX_CONSTRAINT_UNRECORDED","VORTOX_APPLICABILITY_NOT_PROVEN","CAUSE_NOT_PROVEN"].includes(value.causeKind as string)&&value.causedByAnotherCharacterAbility===false)||(value.outcomeStatus==="PENDING_TRIGGER"&&["SOURCE_DRUNKENNESS","SOURCE_POISONING"].includes(value.causeKind as string)&&value.causedByAnotherCharacterAbility===true);
    if(!combinations)return fail("Outcome status, cause, and boolean combination is invalid");
    const canonical=canonicalizeAbilityOutcomeEvidenceReferences(value.evidenceReferences);if(!sameCanonicalDataValue(canonical,value.evidenceReferences))return fail("Evidence must already be canonical");
    const sources=canonical.filter((entry)=>entry.kind==="SOURCE_EVENT");const tasks=canonical.filter((entry)=>entry.kind==="TASK");
    const fact=value as unknown as FirstNightAbilityOutcomeFact;const sourceEvent=sources[0];
    const terminalTaskTypes:Record<TerminalAbilityOutcomeEventType,FirstNightTaskType>={PhilosopherActionDeferred:"PHILOSOPHER_ACTION",PhilosopherAbilityGranted:"PHILOSOPHER_ACTION",SnakeCharmerNoSwapResolved:"SNAKE_CHARMER_ACTION",SnakeCharmerIneffectiveResolved:"SNAKE_CHARMER_ACTION",SnakeCharmerDemonSwapApplied:"SNAKE_CHARMER_ACTION",EvilTwinInformationDelivered:"EVIL_TWIN_SETUP",WitchDeathPendingMarked:"WITCH_ACTION",WitchIneffectiveResolved:"WITCH_ACTION",CerenovusMadnessInstructionDelivered:"CERENOVUS_ACTION",ClockmakerInformationDelivered:"CLOCKMAKER_INFORMATION",DreamerInformationDelivered:"DREAMER_ACTION",SeamstressInformationDelivered:"SEAMSTRESS_ACTION",MathematicianInformationDelivered:"MATHEMATICIAN_INFORMATION"};
    if(sources.length!==1||tasks.length!==1||sourceEvent?.eventId!==fact.sourceEventId||sourceEvent.eventSequence!==fact.sourceEventSequence||sourceEvent.batchId!==fact.sourceBatchId||tasks[0]?.taskId!==fact.abilityTaskId||tasks[0].taskType!==terminalTaskTypes[sourceEvent.eventType]||fact.abilityInstance.taskId!==fact.abilityTaskId||fact.abilityInstance.sourcePlayerId!==fact.sourcePlayerId||fact.abilityInstance.sourceSeatNumber!==fact.sourceSeatNumber||fact.abilityInstance.abilityRoleId!==fact.abilityRoleId)return fail("Fact source/task/instance cross-link is invalid");
    const kinds=(kind:AbilityOutcomeEvidenceReference["kind"]):AbilityOutcomeEvidenceReference[]=>canonical.filter((entry)=>entry.kind===kind);const character=kinds("CHARACTER_STATE");const roles=kinds("PLAYER_ROLE_AT_REVISION") as PlayerRoleAtRevisionEvidence[];const opportunities=kinds("ACTION_OPPORTUNITY") as ActionOpportunityEvidence[];
    const sourceRole=roles.find((role)=>role.playerId===fact.sourcePlayerId&&role.seatNumber===fact.sourceSeatNumber&&role.characterStateRevision===fact.evaluatedCharacterStateRevision);if(character.length!==1||(character[0] as CharacterStateEvidence).characterStateRevision!==fact.evaluatedCharacterStateRevision||sourceRole===undefined||(fact.abilityInstance.kind!=="PHILOSOPHER_GAINED_TASK_V1"&&fact.abilityInstance.kind!=="PHILOSOPHER_GAINED_TASK_V2"&&sourceRole.roleId!==fact.abilityRoleId))return fail("Fact historical source evidence is incomplete");
    const terminalOpportunity=opportunities.find((entry)=>entry.taskId===fact.abilityTaskId);
    const expectedOpportunitySourceRoleId:RoleId=(fact.abilityInstance.kind==="PHILOSOPHER_GAINED_TASK_V1"||fact.abilityInstance.kind==="PHILOSOPHER_GAINED_TASK_V2")?"philosopher" as RoleId:fact.abilityRoleId;
    const requireOpportunity=():boolean=>terminalOpportunity!==undefined&&opportunities.filter((entry)=>entry.taskId===fact.abilityTaskId).length===1&&
      terminalOpportunity.taskType===tasks[0]?.taskType&&terminalOpportunity.opportunityKind===(
        tasks[0].taskType==="DREAMER_ACTION"&&terminalOpportunity.opportunityKind==="DREAMER_FIRST_NIGHT_ACTION_V3"
          ? "DREAMER_FIRST_NIGHT_ACTION_V3"
          : opportunityKindForTask(tasks[0].taskType)
      )&&
      terminalOpportunity.opportunityStatus===expectedPreTerminalOpportunityStatus(sourceEvent.eventType)&&terminalOpportunity.sourcePlayerId===fact.sourcePlayerId&&
      terminalOpportunity.sourceSeatNumber===fact.sourceSeatNumber&&terminalOpportunity.sourceRole.roleId===expectedOpportunitySourceRoleId&&
      terminalOpportunity.sourceCharacterStateRevision<=fact.evaluatedCharacterStateRevision;
    const exactKinds=(allowed:readonly AbilityOutcomeEvidenceReference["kind"][]):boolean=>{for(let index=0;index<canonical.length;index+=1){const entry=canonical[index];if(entry===undefined||!allowed.includes(entry.kind))return false;}return true;};let setValid=false;
    switch(sourceEvent.eventType){
      case "PhilosopherActionDeferred":setValid=requireOpportunity()&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION"]);break;
      case "PhilosopherAbilityGranted":setValid=requireOpportunity()&&kinds("PHILOSOPHER_GRANT").length===1&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","PHILOSOPHER_GRANT"]);break;
      case "SnakeCharmerNoSwapResolved":case "SnakeCharmerDemonSwapApplied":setValid=requireOpportunity()&&roles.length>=1&&kinds("SNAKE_CHARMER_RESOLUTION").length===1&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","SNAKE_CHARMER_RESOLUTION","PHILOSOPHER_GRANT","FIRST_NIGHT_TASK_INSERTION"]);break;
      case "SnakeCharmerIneffectiveResolved":setValid=requireOpportunity()&&roles.length>=1&&kinds("ABILITY_IMPAIRMENT").length===1&&((fact.outcomeStatus==="UNRESOLVED"&&fact.causeKind==="CAUSE_NOT_PROVEN"&&kinds("SNAKE_CHARMER_RESOLUTION").length===0)||(kinds("SNAKE_CHARMER_RESOLUTION").length===1))&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","ABILITY_IMPAIRMENT","SNAKE_CHARMER_RESOLUTION","PHILOSOPHER_GRANT","FIRST_NIGHT_TASK_INSERTION"]);break;
      case "EvilTwinInformationDelivered":setValid=roles.length===2&&kinds("EVIL_TWIN_PAIR").length===1&&exactKinds(["SOURCE_EVENT","TASK","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","EVIL_TWIN_PAIR"]);break;
      case "WitchDeathPendingMarked":setValid=requireOpportunity()&&roles.length>=1&&kinds("WITCH_PENDING_MARKER").length===1&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","WITCH_PENDING_MARKER"]);break;
      case "WitchIneffectiveResolved":setValid=requireOpportunity()&&roles.length>=1&&kinds("ABILITY_IMPAIRMENT").length===1&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","ABILITY_IMPAIRMENT"]);break;
      case "CerenovusMadnessInstructionDelivered":setValid=requireOpportunity()&&roles.length>=1&&kinds("ROLE_TENURE").length===1&&kinds("CERENOVUS_INSTRUCTION").length===1&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","ROLE_TENURE","CERENOVUS_INSTRUCTION"]);break;
      case "ClockmakerInformationDelivered":setValid=kinds("CLOCKMAKER_DELIVERY").length===1&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","ABILITY_IMPAIRMENT","ROLE_TENURE","CLOCKMAKER_DELIVERY","PHILOSOPHER_GRANT","FIRST_NIGHT_TASK_INSERTION"]);break;
      case "DreamerInformationDelivered":setValid=requireOpportunity()&&roles.length>=1&&kinds("DREAMER_DELIVERY").length===1&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","ABILITY_IMPAIRMENT","ROLE_TENURE","DREAMER_DELIVERY"]);break;
      case "SeamstressInformationDelivered":setValid=requireOpportunity()&&roles.length>=2&&kinds("ROLE_TENURE").length>=1&&kinds("SEAMSTRESS_DELIVERY").length===1&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","ABILITY_IMPAIRMENT","ROLE_TENURE","SEAMSTRESS_DELIVERY","PHILOSOPHER_GRANT","FIRST_NIGHT_TASK_INSERTION"]);break;
      case "MathematicianInformationDelivered":setValid=kinds("MATHEMATICIAN_DELIVERY").length===1&&exactKinds(["SOURCE_EVENT","TASK","ACTION_OPPORTUNITY","CHARACTER_STATE","PLAYER_ROLE_AT_REVISION","ABILITY_IMPAIRMENT","ROLE_TENURE","MATHEMATICIAN_DELIVERY","PHILOSOPHER_GRANT","FIRST_NIGHT_TASK_INSERTION"]);break;
    }
    const gained=fact.abilityInstance.kind==="PHILOSOPHER_GAINED_TASK_V1"||fact.abilityInstance.kind==="PHILOSOPHER_GAINED_TASK_V2";const expectedGainedOpportunityCount=opportunityKindForTask(tasks[0].taskType)===undefined?1:2;if(gained&&(kinds("PHILOSOPHER_GRANT").length!==1||kinds("FIRST_NIGHT_TASK_INSERTION").length!==1||opportunities.length!==expectedGainedOpportunityCount))setValid=false;if(!gained&&sourceEvent.eventType!=="PhilosopherAbilityGranted"&&(kinds("PHILOSOPHER_GRANT").length!==0||kinds("FIRST_NIGHT_TASK_INSERTION").length!==0))setValid=false;if(fact.abilityInstance.kind==="EXPLICIT_DOMAIN_INSTANCE"){const tenureId=fact.abilityInstance.sourceRoleTenureId;if(!kinds("ROLE_TENURE").some((entry)=>(entry as RoleTenureEvidence).roleTenureId===tenureId))setValid=false;}
    if(gained){const grant=kinds("PHILOSOPHER_GRANT")[0] as PhilosopherGrantEvidence|undefined;const insertion=kinds("FIRST_NIGHT_TASK_INSERTION")[0] as FirstNightTaskInsertionEvidence|undefined;const provenance=fact.abilityInstance;const philosopherOpportunity=opportunities.find((entry)=>entry.opportunityId===provenance.philosopherOpportunityId);if(grant===undefined||insertion===undefined||philosopherOpportunity===undefined||philosopherOpportunity===terminalOpportunity||philosopherOpportunity.opportunityKind!=="PHILOSOPHER_FIRST_NIGHT_ACTION"||philosopherOpportunity.opportunityStatus!=="CLOSED"||philosopherOpportunity.taskType!=="PHILOSOPHER_ACTION"||philosopherOpportunity.sourceRole.roleId!=="philosopher"||philosopherOpportunity.sourcePlayerId!==grant.sourcePlayerId||philosopherOpportunity.sourceSeatNumber!==grant.sourceSeatNumber||philosopherOpportunity.sourceCharacterStateRevision!==grant.sourceCharacterStateRevision||(terminalOpportunity!==undefined&&terminalOpportunity.sourceCharacterStateRevision!==provenance.sourceCharacterStateRevision)||grant.grantId!==provenance.grantId||grant.philosopherOpportunityId!==provenance.philosopherOpportunityId||grant.chosenRoleId!==fact.abilityRoleId||grant.sourceCharacterStateRevision!==provenance.sourceCharacterStateRevision||insertion.taskId!==fact.abilityTaskId||insertion.philosopherOpportunityId!==grant.philosopherOpportunityId||insertion.sourcePlayerId!==grant.sourcePlayerId||insertion.sourceSeatNumber!==grant.sourceSeatNumber||insertion.chosenRoleId!==grant.chosenRoleId||(provenance.kind==="PHILOSOPHER_GAINED_TASK_V2"&&(insertion.generation.kind!=="V2"||insertion.generation.grantId!==provenance.grantId))||(provenance.kind==="PHILOSOPHER_GAINED_TASK_V1"&&insertion.generation.kind!=="V1"))setValid=false;}
    const hasRole=(playerIdValue:PlayerId):boolean=>roles.some((role)=>role.playerId===playerIdValue&&role.characterStateRevision===fact.evaluatedCharacterStateRevision);const roleOf=(playerIdValue:PlayerId):PlayerRoleAtRevisionEvidence|undefined=>roles.find((role)=>role.playerId===playerIdValue&&role.characterStateRevision===fact.evaluatedCharacterStateRevision);const opportunity=terminalOpportunity;for(const entry of canonical){if(entry.kind==="ABILITY_IMPAIRMENT"){if(sourceEvent.eventType==="MathematicianInformationDelivered"){if(entry.appliedCharacterStateRevision>fact.evaluatedCharacterStateRevision||entry.affectedPlayerId!==fact.sourcePlayerId&&entry.affectedRoleId!=="vortox"||entry.affectedPlayerId===fact.sourcePlayerId&&(entry.affectedSeatNumber!==fact.sourceSeatNumber||entry.affectedRoleId!=="mathematician"&&entry.affectedRoleId!==sourceRole.roleId))setValid=false;}else if(entry.affectedPlayerId!==fact.sourcePlayerId||entry.affectedSeatNumber!==fact.sourceSeatNumber||entry.affectedRoleId!==sourceRole.roleId||entry.appliedCharacterStateRevision>fact.evaluatedCharacterStateRevision)setValid=false;}if(entry.kind==="ROLE_TENURE"&&(entry.acquiredCharacterStateRevision>fact.evaluatedCharacterStateRevision||!hasRole(entry.playerId)))setValid=false;if(entry.kind==="SNAKE_CHARMER_RESOLUTION"&&(entry.taskId!==fact.abilityTaskId||entry.opportunityId!==opportunity?.opportunityId||entry.resolutionEventId!==fact.sourceEventId||roleOf(entry.targetPlayerId)?.seatNumber!==entry.targetSeatNumber||roleOf(entry.targetPlayerId)?.roleId!==entry.targetRoleIdAtResolution))setValid=false;if(entry.kind==="WITCH_PENDING_MARKER"&&(entry.taskId!==fact.abilityTaskId||entry.opportunityId!==opportunity?.opportunityId||entry.sourcePlayerId!==fact.sourcePlayerId||entry.terminalEventId!==fact.sourceEventId||!hasRole(entry.targetPlayerId)))setValid=false;if(entry.kind==="CERENOVUS_INSTRUCTION"&&(entry.taskId!==fact.abilityTaskId||entry.sourcePlayerId!==fact.sourcePlayerId||entry.terminalEventId!==fact.sourceEventId||!hasRole(entry.targetPlayerId)))setValid=false;if(entry.kind==="CLOCKMAKER_DELIVERY"&&(entry.taskId!==fact.abilityTaskId||entry.sourcePlayerId!==fact.sourcePlayerId||entry.terminalEventId!==fact.sourceEventId))setValid=false;if(entry.kind==="MATHEMATICIAN_DELIVERY"&&(entry.taskId!==fact.abilityTaskId||entry.sourcePlayerId!==fact.sourcePlayerId||entry.terminalEventId!==fact.sourceEventId))setValid=false;if(entry.kind==="DREAMER_DELIVERY"&&(entry.taskId!==fact.abilityTaskId||entry.opportunityId!==opportunity?.opportunityId||entry.sourcePlayerId!==fact.sourcePlayerId||entry.terminalEventId!==fact.sourceEventId||!hasRole(entry.targetPlayerId)))setValid=false;if(entry.kind==="SEAMSTRESS_DELIVERY"&&(entry.taskId!==fact.abilityTaskId||entry.opportunityId!==opportunity?.opportunityId||entry.sourcePlayerId!==fact.sourcePlayerId||entry.terminalEventId!==fact.sourceEventId||!hasRole(entry.firstTargetPlayerId)||!hasRole(entry.secondTargetPlayerId)))setValid=false;if(entry.kind==="EVIL_TWIN_PAIR"&&(entry.establishedTaskId!==fact.abilityTaskId||entry.informationDeliveryEventId!==fact.sourceEventId||!hasRole(entry.evilTwinPlayerId)||!hasRole(entry.goodTwinPlayerId)))setValid=false;}
    if(fact.causeKind==="VORTOX_FALSE_INFORMATION"&&(!roles.some((role)=>role.roleId==="vortox")||!kinds("ROLE_TENURE").some((entry)=>(entry as RoleTenureEvidence).roleId==="vortox"&&(entry as RoleTenureEvidence).statusAtEvaluation==="ACTIVE")))setValid=false;
    if(fact.causeKind==="DREAMER_VORTOX_CONSTRAINT_UNRECORDED"&&(!roles.some((role)=>role.roleId==="vortox")||!kinds("ROLE_TENURE").some((entry)=>(entry as RoleTenureEvidence).roleId==="vortox"&&(entry as RoleTenureEvidence).statusAtEvaluation==="ACTIVE")))setValid=false;
    if(fact.causeKind==="VORTOX_APPLICABILITY_NOT_PROVEN"&&(!roles.some((role)=>role.roleId==="vortox")||kinds("ROLE_TENURE").some((entry)=>(entry as RoleTenureEvidence).roleId==="vortox"&&(entry as RoleTenureEvidence).statusAtEvaluation==="ACTIVE")))setValid=false;
    const impairmentEvidence=kinds("ABILITY_IMPAIRMENT") as AbilityImpairmentEvidence[];const sourceImpairmentEvidence=sourceEvent.eventType==="MathematicianInformationDelivered"?impairmentEvidence.filter((entry)=>entry.affectedPlayerId===fact.sourcePlayerId&&entry.affectedSeatNumber===fact.sourceSeatNumber):impairmentEvidence;if(fact.causeKind==="SOURCE_DRUNKENNESS"&&(sourceImpairmentEvidence.length!==1||sourceImpairmentEvidence[0]?.impairmentKind!=="DRUNK"))setValid=false;if(fact.causeKind==="SOURCE_POISONING"&&(sourceImpairmentEvidence.length!==1||sourceImpairmentEvidence[0]?.impairmentKind!=="POISONED"))setValid=false;
    const clockmaker=kinds("CLOCKMAKER_DELIVERY")[0] as ClockmakerDeliveryEvidence|undefined;if(clockmaker!==undefined){const correct=clockmaker.ruleCorrectDistance===clockmaker.selectedDistance;if((correct&&fact.outcomeStatus!=="NORMAL")||(!correct&&fact.outcomeStatus!=="ABNORMAL")||(fact.outcomeStatus==="NORMAL"&&fact.causeKind!=="NO_OTHER_CHARACTER_ABILITY"))setValid=false;}
    const dreamer=kinds("DREAMER_DELIVERY")[0] as DreamerDeliveryEvidence|undefined;if(dreamer!==undefined){const targetRole=roleOf(dreamer.targetPlayerId);const containsTruth=targetRole!==undefined&&(targetRole.roleId===dreamer.deliveredGoodRoleId||targetRole.roleId===dreamer.deliveredEvilRoleId);if(fact.outcomeStatus==="NORMAL"&&!containsTruth)setValid=false;if(fact.outcomeStatus==="ABNORMAL"&&(containsTruth||!kinds("ABILITY_IMPAIRMENT").length))setValid=false;if(fact.outcomeStatus==="UNRESOLVED"&&!["DREAMER_VORTOX_CONSTRAINT_UNRECORDED","VORTOX_APPLICABILITY_NOT_PROVEN","CAUSE_NOT_PROVEN"].includes(fact.causeKind))setValid=false;}
    const seamstress=kinds("SEAMSTRESS_DELIVERY")[0] as SeamstressDeliveryEvidence|undefined;if(seamstress!==undefined){const correct=seamstress.ruleCorrectAnswer===seamstress.deliveredAnswer;if((correct&&fact.outcomeStatus!=="NORMAL")||(!correct&&fact.outcomeStatus!=="ABNORMAL"))setValid=false;}
    const mathematician=kinds("MATHEMATICIAN_DELIVERY")[0] as MathematicianDeliveryEvidence|undefined;if(mathematician!==undefined){
      const correct=mathematician.trueCount===mathematician.selectedCount;
      if((correct&&(fact.outcomeStatus!=="NORMAL"||fact.causeKind!=="NO_OTHER_CHARACTER_ABILITY"||fact.causedByAnotherCharacterAbility))||(!correct&&(fact.outcomeStatus!=="ABNORMAL"||!fact.causedByAnotherCharacterAbility||!(fact.causeKind==="SOURCE_DRUNKENNESS"||fact.causeKind==="SOURCE_POISONING"||fact.causeKind==="VORTOX_FALSE_INFORMATION"))))setValid=false;
      const parsed=parseMathematicianEvidenceIdentity(mathematician.deliveryId,mathematician.taskId);
      const tenures=kinds("ROLE_TENURE") as RoleTenureEvidence[];
      const sourceRoles=roles.filter((entry)=>entry.playerId===fact.sourcePlayerId&&entry.seatNumber===fact.sourceSeatNumber);
      const sourceTenures=tenures.filter((entry)=>entry.playerId===fact.sourcePlayerId&&entry.seatNumber===fact.sourceSeatNumber);
      const sourceImpairments=impairmentEvidence.filter((entry)=>entry.affectedPlayerId===fact.sourcePlayerId&&entry.affectedSeatNumber===fact.sourceSeatNumber&&entry.affectedRoleId==="mathematician");
      const vortoxRoles=roles.filter((entry)=>entry.roleId==="vortox"&&entry.playerId!==fact.sourcePlayerId);
      const vortoxTenures=tenures.filter((entry)=>entry.roleId==="vortox"&&entry.playerId!==fact.sourcePlayerId);
      const vortoxImpairments=impairmentEvidence.filter((entry)=>entry.affectedRoleId==="vortox"&&entry.affectedPlayerId!==fact.sourcePlayerId);
      const expectedGeneration=fact.abilityInstance.kind==="BASE_ROLE_TASK"?"BASE":fact.abilityInstance.kind==="PHILOSOPHER_GAINED_TASK_V1"?"V1":fact.abilityInstance.kind==="PHILOSOPHER_GAINED_TASK_V2"?"V2":undefined;
      const expectedSourceRoleId:RoleId=expectedGeneration==="BASE"?"mathematician" as RoleId:"philosopher" as RoleId;
      if(!parsed.valid||parsed.generation!==expectedGeneration||mathematician.taskId!==fact.abilityTaskId||mathematician.sourcePlayerId!==fact.sourcePlayerId||mathematician.terminalEventId!==fact.sourceEventId||sourceRoles.length!==1||sourceRoles[0]?.roleId!==expectedSourceRoleId||sourceTenures.length!==1||sourceTenures[0]?.roleId!==expectedSourceRoleId||sourceTenures[0].statusAtEvaluation!=="ACTIVE")setValid=false;
      if(expectedGeneration==="BASE"&&(opportunities.length!==0||kinds("PHILOSOPHER_GRANT").length!==0||kinds("FIRST_NIGHT_TASK_INSERTION").length!==0))setValid=false;
      if(expectedGeneration==="V1"&&(opportunities.length!==1||kinds("PHILOSOPHER_GRANT").length!==1||(kinds("FIRST_NIGHT_TASK_INSERTION")[0] as FirstNightTaskInsertionEvidence|undefined)?.generation.kind!=="V1"))setValid=false;
      if(expectedGeneration==="V2"&&(opportunities.length!==1||kinds("PHILOSOPHER_GRANT").length!==1||(kinds("FIRST_NIGHT_TASK_INSERTION")[0] as FirstNightTaskInsertionEvidence|undefined)?.generation.kind!=="V2"))setValid=false;
      if(fact.causeKind==="NO_OTHER_CHARACTER_ABILITY"&&sourceImpairments.length!==0)setValid=false;
      if((fact.causeKind==="SOURCE_DRUNKENNESS"||fact.causeKind==="SOURCE_POISONING")&&sourceImpairments.length!==1)setValid=false;
      if(fact.causeKind==="VORTOX_FALSE_INFORMATION"){
        if(vortoxRoles.length!==1||vortoxTenures.length!==1||vortoxImpairments.length!==0)setValid=false;
      }else if(vortoxRoles.length+vortoxTenures.length+vortoxImpairments.length>0){
        if(vortoxRoles.length!==1||vortoxTenures.length!==1||vortoxImpairments.length!==1)setValid=false;
      }
      const vortoxRole=vortoxRoles[0];const vortoxTenure=vortoxTenures[0];const vortoxImpairment=vortoxImpairments[0];
      if(vortoxRole!==undefined&&vortoxTenure!==undefined&&(vortoxRole.playerId!==vortoxTenure.playerId||vortoxRole.seatNumber!==vortoxTenure.seatNumber||vortoxTenure.statusAtEvaluation!=="ACTIVE"))setValid=false;
      if(vortoxRole!==undefined&&vortoxImpairment!==undefined&&(vortoxRole.playerId!==vortoxImpairment.affectedPlayerId||vortoxRole.seatNumber!==vortoxImpairment.affectedSeatNumber))setValid=false;
    }
    if(!setValid)return fail("Terminal minimum or conditional evidence set is invalid");
    return {valid:true};
  } catch { return fail("Outcome fact must fail closed"); }
};
export const cloneFirstNightAbilityOutcomeFact = (v: FirstNightAbilityOutcomeFact): FirstNightAbilityOutcomeFact => {
  const validation = validateFirstNightAbilityOutcomeFactShape(v);
  if (!validation.valid) throw new DomainError("InvalidFirstNightAbilityOutcomeFact", validation.reason);
  return clone(v);
};
export const validateFirstNightAbilityOutcomeLedgerShape = (value: unknown): OutcomeLedgerValidationResult => {
  try { if (!plain(value)||!exact(value,["ledgerVersion","auditModelVersion","windowAnchor","facts"])||value.ledgerVersion!==FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION||value.auditModelVersion!==FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION||!validateFirstNightAbilityOutcomeWindowAnchorShape(value.windowAnchor).valid||!isDenseCanonicalArray(value.facts)) return fail("Invalid outcome ledger shape"); const anchor=value.windowAnchor as FirstNightAbilityOutcomeWindowAnchor;let seq=anchor.startEventSequence; const ids=new Set<string>(); for(const fact of value.facts){const v=validateFirstNightAbilityOutcomeFactShape(fact);if(!v.valid)return v;const f=fact as FirstNightAbilityOutcomeFact;if(f.sourceEventSequence<=anchor.startEventSequence||f.sourceEventSequence<=seq||ids.has(f.auditFactId))return fail("Outcome facts must be after the exclusive lower boundary, unique, and sorted");seq=f.sourceEventSequence;ids.add(f.auditFactId);}return {valid:true}; } catch{return fail("Outcome ledger must fail closed");}
};
export const cloneFirstNightAbilityOutcomeLedger=(v:FirstNightAbilityOutcomeLedger):FirstNightAbilityOutcomeLedger=>{
  const validation = validateFirstNightAbilityOutcomeLedgerShape(v);
  if (!validation.valid) throw new DomainError("InvalidFirstNightAbilityOutcomeLedger", validation.reason);
  return clone(v);
};

const terminalTypes = new Set<TerminalAbilityOutcomeEventType>(["PhilosopherActionDeferred","PhilosopherAbilityGranted","SnakeCharmerNoSwapResolved","SnakeCharmerIneffectiveResolved","SnakeCharmerDemonSwapApplied","EvilTwinInformationDelivered","WitchDeathPendingMarked","WitchIneffectiveResolved","CerenovusMadnessInstructionDelivered","ClockmakerInformationDelivered","DreamerInformationDelivered","SeamstressInformationDelivered","MathematicianInformationDelivered"]);
const roleForTask: Record<FirstNightTaskType, RoleId> = {PHILOSOPHER_ACTION:"philosopher" as RoleId,MINION_INFO:"" as RoleId,DEMON_INFO:"" as RoleId,SNAKE_CHARMER_ACTION:"snake_charmer" as RoleId,EVIL_TWIN_SETUP:"evil_twin" as RoleId,WITCH_ACTION:"witch" as RoleId,CERENOVUS_ACTION:"cerenovus" as RoleId,CLOCKMAKER_INFORMATION:"clockmaker" as RoleId,DREAMER_ACTION:"dreamer" as RoleId,SEAMSTRESS_ACTION:"seamstress" as RoleId,MATHEMATICIAN_INFORMATION:"mathematician" as RoleId};
const taskFor = (state: GameState, id: unknown): ScheduledTask | undefined => {const matches=state.firstNightTaskPlan?.tasks.filter((task)=>task.taskId===id)??[];return matches.length===1?matches[0]:undefined;};
const sourceFor = (state: GameState, task: ScheduledTask, payload: Record<string,unknown>): {playerId:PlayerId;seatNumber:SeatNumber;roleId:RoleId}|undefined => {
  if(task.source.kind==="SYSTEM")return undefined;
  const taskSource=task.source;
  if((payload.sourcePlayerId!==undefined&&payload.sourcePlayerId!==taskSource.playerId)||(payload.sourceSeatNumber!==undefined&&payload.sourceSeatNumber!==taskSource.seatNumber))throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Terminal source must equal the accepted task source");
  const roster=state.roster?.entries.filter((entry)=>entry.playerId===taskSource.playerId&&entry.seatNumber===taskSource.seatNumber)??[];
  const current=state.currentCharacterState?.entries.filter((entry)=>entry.playerId===taskSource.playerId&&entry.seatNumber===taskSource.seatNumber)??[];
  const expectedCurrentRole=taskSource.kind==="ROLE"?taskSource.role.roleId:taskSource.sourceRole.roleId;
  if(roster.length!==1||current.length!==1||current[0]?.role.roleId!==expectedCurrentRole)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Terminal task source must match fixed roster and historical character state");
  const role = taskSource.kind==="ROLE"?taskSource.role:taskSource.chosenRole;
  if(roleForTask[task.taskType]!==role.roleId)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Task type and ability role must match");
  return {playerId:taskSource.playerId,seatNumber:taskSource.seatNumber,roleId:role.roleId};
};
const roleEvidenceFor=(state:GameState,playerIdValue:PlayerId,revision:number):PlayerRoleAtRevisionEvidence=>{
  const matches=state.currentCharacterState?.entries.filter((candidate)=>candidate.playerId===playerIdValue)??[];const entry=matches[0];
  const rosterMatches=entry===undefined?[]:state.roster?.entries.filter((candidate)=>candidate.playerId===entry.playerId&&candidate.seatNumber===entry.seatNumber)??[];
  if(matches.length!==1||entry===undefined||rosterMatches.length!==1)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Player role evidence requires one roster-bound current character entry");
  return {kind:"PLAYER_ROLE_AT_REVISION",playerId:entry.playerId,seatNumber:entry.seatNumber,roleId:entry.role.roleId,characterType:entry.role.characterType,defaultAlignment:entry.role.defaultAlignment,characterStateRevision:revision};
};
const tenureEvidenceFor=(state:GameState,tenureId:RoleTenureId,revision:number):RoleTenureEvidence=>{
  const matches=state.seamstressRoleTenureState?.records.filter((record)=>record.roleTenureId===tenureId)??[];const record=matches[0];if(matches.length!==1||record===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Role tenure evidence requires one canonical record");const active=record.acquiredCharacterStateRevision<=revision&&(record.endedCharacterStateRevision===undefined||record.endedCharacterStateRevision>revision);return {kind:"ROLE_TENURE",roleTenureId:record.roleTenureId,playerId:record.playerId,seatNumber:record.seatNumber,roleId:record.roleId as RoleId,acquiredCharacterStateRevision:record.acquiredCharacterStateRevision,statusAtEvaluation:active?"ACTIVE":"INACTIVE"};
};
type HistoricalVortoxApplicability={readonly kind:"NONE"}|{readonly kind:"PROVEN";readonly playerId:PlayerId;readonly seatNumber:SeatNumber;readonly tenureId:RoleTenureId}|{readonly kind:"UNRESOLVED";readonly playerId?:PlayerId};
const historicalVortoxApplicability=(state:GameState,revision:number):HistoricalVortoxApplicability=>{
  const current=state.currentCharacterState?.entries.filter((entry)=>entry.role.roleId==="vortox")??[];if(current.length===0)return {kind:"NONE"};if(current.length!==1)return {kind:"UNRESOLVED"};const entry=current[0]!;const tenures=state.seamstressRoleTenureState?.records.filter((record)=>record.roleId==="vortox"&&record.playerId===entry.playerId&&record.seatNumber===entry.seatNumber&&record.acquiredCharacterStateRevision<=revision&&(record.endedCharacterStateRevision===undefined||record.endedCharacterStateRevision>revision))??[];return tenures.length===1&&tenures[0]!==undefined?{kind:"PROVEN",playerId:entry.playerId,seatNumber:entry.seatNumber,tenureId:tenures[0].roleTenureId}:{kind:"UNRESOLVED",playerId:entry.playerId};
};
const opportunityKindForTask=(taskType:FirstNightTaskType):ActionOpportunityKind|undefined=>{
  switch(taskType){
    case "PHILOSOPHER_ACTION":return "PHILOSOPHER_FIRST_NIGHT_ACTION";
    case "SNAKE_CHARMER_ACTION":return "SNAKE_CHARMER_FIRST_NIGHT_ACTION";
    case "WITCH_ACTION":return "WITCH_FIRST_NIGHT_ACTION";
    case "CERENOVUS_ACTION":return "CERENOVUS_FIRST_NIGHT_ACTION";
    case "DREAMER_ACTION":return "DREAMER_FIRST_NIGHT_ACTION";
    case "SEAMSTRESS_ACTION":return "SEAMSTRESS_FIRST_NIGHT_ACTION";
    default:return undefined;
  }
};
const expectedPreTerminalOpportunityStatus=(eventType:TerminalAbilityOutcomeEventType):ActionOpportunityStatus=>
  eventType==="PhilosopherAbilityGranted"||eventType==="CerenovusMadnessInstructionDelivered"?"CLOSED":"OPEN";
const opportunityEvidenceFrom=(opportunity:FirstNightActionOpportunity):ActionOpportunityEvidence=>({
  kind:"ACTION_OPPORTUNITY",opportunityVersion:"first-night-action-opportunity-v1",nightNumber:1,
  opportunityId:opportunity.opportunityId,opportunityKind:opportunity.opportunityKind,opportunityStatus:opportunity.opportunityStatus,
  taskId:opportunity.taskId,taskType:opportunity.taskType,sourcePlayerId:opportunity.sourcePlayerId,sourceSeatNumber:opportunity.sourceSeatNumber,
  sourceRole:clone(opportunity.sourceRole),sourceCharacterStateRevision:opportunity.sourceCharacterStateRevision
});
const validateGainedTerminalOpportunityRevision=(input:{
  readonly task:ScheduledTask;
  readonly abilityInstance:FirstNightAbilityInstanceProvenance;
  readonly terminalOpportunity:FirstNightActionOpportunity;
}):void=>{
  if(input.task.source.kind!=="PHILOSOPHER_GAINED_ABILITY"||
    (input.abilityInstance.kind!=="PHILOSOPHER_GAINED_TASK_V1"&&input.abilityInstance.kind!=="PHILOSOPHER_GAINED_TASK_V2"))return;
  if(input.abilityInstance.sourceCharacterStateRevision!==input.task.source.sourceCharacterStateRevision)
    throw new DomainError("InvalidFirstNightAbilityInstance","Gained ability instance revision must equal canonical Philosopher task-source revision");
  if(input.terminalOpportunity.sourceCharacterStateRevision!==input.abilityInstance.sourceCharacterStateRevision)
    throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Gained terminal opportunity revision must equal canonical Philosopher grant revision");
};
const opportunityEvidenceFor=(state:GameState,opportunityIdValue:unknown,task:ScheduledTask,source:{playerId:PlayerId;seatNumber:SeatNumber;roleId:RoleId},eventType:TerminalAbilityOutcomeEventType,abilityInstance:FirstNightAbilityInstanceProvenance,expectedDreamerV3=false):ActionOpportunityEvidence=>{
  const opportunityStateValidation=validateFirstNightActionOpportunityStateShape(state.firstNightActionOpportunities);
  if(!opportunityStateValidation.valid)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence",opportunityStateValidation.reason);
  const matches=state.firstNightActionOpportunities!.opportunities.filter((candidate)=>candidate.opportunityId===opportunityIdValue);const opportunity=matches[0];
  const expectedKind=expectedDreamerV3?"DREAMER_FIRST_NIGHT_ACTION_V3":opportunityKindForTask(task.taskType);const parsed=opportunity===undefined?undefined:(expectedDreamerV3?parseBaseDreamerV2FirstNightActionOpportunityId(opportunity.opportunityId):parseFirstNightActionOpportunityId(opportunity.opportunityId));
  const expectedRole=task.source.kind==="ROLE"?task.source.role:task.source.kind==="PHILOSOPHER_GAINED_ABILITY"?task.source.sourceRole:undefined;
  if(matches.length!==1||opportunity===undefined||expectedKind===undefined||expectedRole===undefined||!parsed?.valid||
    opportunity.opportunityStatus!==expectedPreTerminalOpportunityStatus(eventType)||opportunity.opportunityKind!==expectedKind||
    opportunity.taskId!==task.taskId||opportunity.taskType!==task.taskType||parsed.taskType!==task.taskType||parsed.seatNumber!==source.seatNumber||
    opportunity.sourcePlayerId!==source.playerId||opportunity.sourceSeatNumber!==source.seatNumber||!sameRoleSetupSnapshot(opportunity.sourceRole,expectedRole)||
    opportunity.sourceCharacterStateRevision<1||
    (state.currentCharacterState!==undefined&&opportunity.sourceCharacterStateRevision>state.currentCharacterState.revision))
    throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Terminal outcome requires one exact accepted action opportunity");
  validateGainedTerminalOpportunityRevision({task,abilityInstance,terminalOpportunity:opportunity});
  return opportunityEvidenceFrom(opportunity);
};
const impairmentEvidenceFor=(state:GameState,impairmentIdValue:unknown,source:{playerId:PlayerId;seatNumber:SeatNumber;roleId:RoleId}):AbilityImpairmentEvidence=>{
  const matches=state.abilityImpairments?.impairments.filter((candidate)=>candidate.impairmentId===impairmentIdValue)??[];const impairment=matches[0];
  if(matches.length!==1||impairment===undefined||impairment.affectedPlayerId!==source.playerId||impairment.affectedSeatNumber!==source.seatNumber||impairment.affectedRole.roleId!==source.roleId||(state.currentCharacterState!==undefined&&impairment.sourceCharacterStateRevision>state.currentCharacterState.revision))throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Ineffective outcome requires one matching player, seat, role, revision, and impairment");
  return {kind:"ABILITY_IMPAIRMENT",impairmentId:impairment.impairmentId,impairmentKind:impairment.kind,affectedPlayerId:impairment.affectedPlayerId,affectedSeatNumber:impairment.affectedSeatNumber,affectedRoleId:impairment.affectedRole.roleId,sourceKind:impairment.sourceKind,appliedCharacterStateRevision:impairment.sourceCharacterStateRevision};
};
const canonicalInsertedTasks=(state:GameState):ReadonlyMap<ScheduledTaskId,{readonly task:ScheduledTask;readonly insertion:NonNullable<GameState["firstNightTaskInsertions"]>["insertions"][number]}>=>{
  const plan=state.firstNightTaskPlan;
  if(plan===undefined||state.setup===undefined||state.roster===undefined||state.assignment===undefined||state.firstNight===undefined||state.initialPrivateKnowledge===undefined)throw new DomainError("InvalidFirstNightAbilityInstance","Accepted task provenance requires complete first-night source facts");
  const raw=state.firstNightTaskInsertions?.insertions??[];
  if(!isDenseCanonicalArray(raw))throw new DomainError("InvalidFirstNightAbilityInstance","Accepted insertion facts must be a dense canonical array");
  const basePlan={...plan,tasks:plan.tasks.filter((candidate)=>candidate.source.kind!=="PHILOSOPHER_GAINED_ABILITY")};
  const validated:NonNullable<GameState["firstNightTaskInsertions"]>["insertions"][number][]=[];
  const rebuilt=new Map<ScheduledTaskId,{readonly task:ScheduledTask;readonly insertion:NonNullable<GameState["firstNightTaskInsertions"]>["insertions"][number]}>();
  for(const insertion of raw){
    if(!plain(insertion))throw new DomainError("InvalidFirstNightAbilityInstance","Insertion fact must be one plain exact payload");
    const prior=validated.length===0?undefined:{insertions:validated};
    const validation=Object.hasOwn(insertion,"schedulingVersion")?validateFirstNightTaskInsertedV2Payload(insertion,{firstNightTaskPlan:basePlan,grants:state.philosopherGrantedAbilities,insertions:prior}):validateFirstNightTaskInsertedPayload(insertion,{firstNightTaskPlan:basePlan,grants:state.philosopherGrantedAbilities,insertions:prior});
    if(!validation.valid)throw new DomainError("InvalidFirstNightAbilityInstance",validation.reason);
    const scheduled=scheduledTaskFromFirstNightTaskInsertedPayload(insertion);
    if(rebuilt.has(scheduled.taskId))throw new DomainError("InvalidFirstNightAbilityInstance","Insertion facts must map to unique task identities");
    rebuilt.set(scheduled.taskId,{task:scheduled,insertion});validated.push(insertion);
  }
  const runtime=plan.tasks.filter((candidate)=>candidate.source.kind==="PHILOSOPHER_GAINED_ABILITY");
  const planValidation=validateFirstNightTaskPlanRuntimeState(plan,{sourceFacts:{setup:state.setup,roster:state.roster.entries,assignment:state.assignment.assignments,firstNight:state.firstNight,initialPrivateKnowledge:state.initialPrivateKnowledge},insertedTasks:[...rebuilt.values()].map((entry)=>entry.task)});
  if(!planValidation.valid||runtime.length!==rebuilt.size||runtime.some((task)=>{const expected=rebuilt.get(task.taskId);return expected===undefined||!sameCanonicalDataValue(expected.task,task);} ))throw new DomainError("InvalidFirstNightAbilityInstance",planValidation.valid?"Runtime gained tasks must equal accepted insertion facts":planValidation.reason);
  return rebuilt;
};
const PHILOSOPHER_CHOICE_KEYS=["rulesBaselineVersion","nightNumber","taskId","taskType","opportunityId","decisionKind","sourcePlayerId","sourceSeatNumber","sourceRole","sourceCharacterStateRevision","chosenRole","chosenRoleId","roleCatalogSignature"] as const;
const PHILOSOPHER_GRANT_KEYS=["grantId","sourcePlayerId","sourceSeatNumber","sourceRole","sourceCharacterStateRevision","chosenRole","chosenRoleId","chosenRoleCatalogSignature","grantedAtTaskId","grantedAtOpportunityId"] as const;
const instanceFor=(task:ScheduledTask,source:{playerId:PlayerId;seatNumber:SeatNumber;roleId:RoleId},state:GameState):FirstNightAbilityInstanceProvenance=>{
  if(task.source.kind==="PHILOSOPHER_GAINED_ABILITY") {
    const opportunityStateValidation=validateFirstNightActionOpportunityStateShape(state.firstNightActionOpportunities);
    if(!opportunityStateValidation.valid)throw new DomainError("InvalidFirstNightAbilityInstance",opportunityStateValidation.reason);
    const gainedSource=task.source;const accepted=canonicalInsertedTasks(state).get(task.taskId);const insertion=accepted?.insertion as unknown as Record<string,unknown>|undefined;
    const grants=state.philosopherGrantedAbilities?.abilities.filter((entry)=>entry.grantedAtOpportunityId===gainedSource.opportunityId&&entry.chosenRoleId===gainedSource.chosenRole.roleId)??[];const grant=grants[0];
    const choices=state.philosopherAbilityChoices?.choices.filter((entry)=>entry.opportunityId===gainedSource.opportunityId)??[];const choice=choices[0];
    const opportunities=state.firstNightActionOpportunities!.opportunities.filter((entry)=>entry.opportunityId===gainedSource.opportunityId);const opportunity=opportunities[0];
    const parsedTask=parseCanonicalFirstNightTaskId(task.taskId);const parsedGrant=grant===undefined?undefined:parseCanonicalGrantId(grant.grantId);const v2=state.firstNightTaskPlan?.taskPlanVersion==="first-night-task-plan-v2";const insertionSource=insertion?.source as Record<string,unknown>|undefined;const insertionMatches=insertion!==undefined&&insertion.taskId===task.taskId&&(insertion.sourcePlayerId??insertionSource?.playerId)===source.playerId&&(insertion.sourceSeatNumber??insertionSource?.seatNumber)===source.seatNumber&&insertion.sourceCharacterStateRevision===gainedSource.sourceCharacterStateRevision&&((insertion.chosenRole as Record<string,unknown>|undefined)?.roleId===source.roleId||insertion.targetRoleId===source.roleId)&&(insertion.philosopherOpportunityId??insertionSource?.opportunityId)===gainedSource.opportunityId;
    const choiceShape=choice!==undefined&&plain(choice)&&exact(choice,PHILOSOPHER_CHOICE_KEYS)&&choice.rulesBaselineVersion===state.rulesBaselineVersion&&choice.nightNumber===1&&choice.taskType==="PHILOSOPHER_ACTION"&&choice.decisionKind==="CHOOSE_GOOD_CHARACTER"&&hasExactRoleSetupSnapshotShape(choice.sourceRole)&&hasExactRoleSetupSnapshotShape(choice.chosenRole)&&choice.chosenRoleId===choice.chosenRole.roleId&&choice.roleCatalogSignature===state.setup?.roleCatalogSignature;
    const grantShape=grant!==undefined&&plain(grant)&&exact(grant,PHILOSOPHER_GRANT_KEYS)&&hasExactRoleSetupSnapshotShape(grant.sourceRole)&&hasExactRoleSetupSnapshotShape(grant.chosenRole)&&grant.chosenRoleId===grant.chosenRole.roleId&&grant.chosenRoleCatalogSignature===state.setup?.roleCatalogSignature;
    const parsedOpportunity=opportunity===undefined?undefined:parseFirstNightActionOpportunityId(opportunity.opportunityId);
    const originalChainMatches=isDenseCanonicalArray(state.philosopherAbilityChoices?.choices)&&isDenseCanonicalArray(state.philosopherGrantedAbilities?.abilities)&&choice!==undefined&&grant!==undefined&&opportunity!==undefined&&choiceShape&&grantShape&&
      opportunity.opportunityKind==="PHILOSOPHER_FIRST_NIGHT_ACTION"&&opportunity.opportunityStatus==="CLOSED"&&opportunity.taskType==="PHILOSOPHER_ACTION"&&
      opportunity.taskId===choice.taskId&&grant.grantedAtTaskId===choice.taskId&&grant.grantedAtOpportunityId===choice.opportunityId&&
      parsedOpportunity?.valid===true&&parsedOpportunity.taskType==="PHILOSOPHER_ACTION"&&parsedOpportunity.seatNumber===source.seatNumber&&
      choice.sourcePlayerId===source.playerId&&choice.sourceSeatNumber===source.seatNumber&&choice.sourceCharacterStateRevision===gainedSource.sourceCharacterStateRevision&&
      opportunity.sourcePlayerId===choice.sourcePlayerId&&opportunity.sourceSeatNumber===choice.sourceSeatNumber&&opportunity.sourceCharacterStateRevision===choice.sourceCharacterStateRevision&&
      choice.sourceRole.roleId==="philosopher"&&sameRoleSetupSnapshot(opportunity.sourceRole,choice.sourceRole)&&sameRoleSetupSnapshot(choice.sourceRole,gainedSource.sourceRole)&&
      choice.chosenRoleId===source.roleId&&sameRoleSetupSnapshot(choice.chosenRole,gainedSource.chosenRole)&&sameRoleSetupSnapshot(grant.chosenRole,gainedSource.chosenRole)&&
      grant.sourcePlayerId===choice.sourcePlayerId&&grant.sourceSeatNumber===choice.sourceSeatNumber&&grant.sourceCharacterStateRevision===choice.sourceCharacterStateRevision&&sameRoleSetupSnapshot(grant.sourceRole,choice.sourceRole);
    if(accepted===undefined||grants.length!==1||choices.length!==1||opportunities.length!==1||grant===undefined||choice===undefined||opportunity===undefined)
      throw new DomainError("InvalidFirstNightAbilityInstance","Gained task requires unique accepted insertion, grant, choice, and Philosopher opportunity records");
    if(!originalChainMatches)throw new DomainError("InvalidFirstNightAbilityInstance","Gained task original Philosopher opportunity, choice, and grant contract is inconsistent");
    if(parsedTask?.generation!==(v2?"V2":"V1")||parsedTask.embeddedSeat!==source.seatNumber||parsedTask.embeddedRoleId!==source.roleId||parsedGrant?.embeddedSeat!==source.seatNumber||parsedGrant.embeddedRoleId!==source.roleId)
      throw new DomainError("InvalidFirstNightAbilityInstance","Gained task and grant identifiers must bind generation, role, and seat");
    if(!insertionMatches||!((v2&&insertion.schedulingVersion==="philosopher-gained-first-night-scheduling-v2"&&insertion.grantId===grant.grantId)||(!v2&&insertion.schedulingVersion===undefined&&insertion.grantId===undefined)))
      throw new DomainError("InvalidFirstNightAbilityInstance","Gained task insertion must bind the accepted generation, grant, role, seat, source, and revision");
    {
      const grantId=grant.grantId;
      const common={provenanceVersion:"first-night-ability-instance-provenance-v1" as const,abilityRoleId:source.roleId,taskId:task.taskId,sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber,philosopherOpportunityId:gainedSource.opportunityId,grantId,sourceCharacterStateRevision:gainedSource.sourceCharacterStateRevision};
      if(v2)return {...common,kind:"PHILOSOPHER_GAINED_TASK_V2",abilityInstanceId:formatPhilosopherGainedV2AbilityInstanceId({taskId:task.taskId,grantId}),schedulingVersion:"philosopher-gained-first-night-scheduling-v2"};
      return {...common,kind:"PHILOSOPHER_GAINED_TASK_V1",abilityInstanceId:formatPhilosopherGainedV1AbilityInstanceId({taskId:task.taskId,grantId})};
    }
  }
  const parsed=parseCanonicalFirstNightTaskId(task.taskId);if(task.source.kind!=="ROLE"||parsed?.generation!=="BASE"||parsed.embeddedSeat!==source.seatNumber||parsed.taskType!==task.taskType||roleForTask[task.taskType]!==source.roleId)throw new DomainError("InvalidFirstNightAbilityInstance","Base task provenance must use one canonical role task without grant or insertion");
  return {provenanceVersion:"first-night-ability-instance-provenance-v1",kind:"BASE_ROLE_TASK",abilityInstanceId:formatBaseFirstNightAbilityInstanceId(task.taskId),abilityRoleId:source.roleId,taskId:task.taskId,sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber};
};
export const classifyMathematicianTerminalOutcomeForInternalValidation=(
  trueCount:unknown,
  selectedCount:unknown,
  informationReliability:unknown
):{readonly outcomeStatus:AbilityOutcomeStatus;readonly causeKind:AbilityOutcomeCause;readonly causedByAnotherCharacterAbility:boolean}=>{
  const correct=trueCount===selectedCount;
  if(informationReliability==="RULE_CORRECT"){
    if(!correct)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Effective Mathematician information must equal the true count");
    return {outcomeStatus:"NORMAL",causeKind:"NO_OTHER_CHARACTER_ABILITY",causedByAnotherCharacterAbility:false};
  }
  if(informationReliability==="DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"){
    if(correct)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Drunk Mathematician information must be false");
    return {outcomeStatus:"ABNORMAL",causeKind:"SOURCE_DRUNKENNESS",causedByAnotherCharacterAbility:true};
  }
  if(informationReliability==="DETERMINISTIC_FALSE_WITH_KNOWN_POISONING"){
    if(correct)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Poisoned Mathematician information must be false");
    return {outcomeStatus:"ABNORMAL",causeKind:"SOURCE_POISONING",causedByAnotherCharacterAbility:true};
  }
  if(informationReliability==="VORTOX_CONSTRAINED_FALSE"){
    if(correct)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Vortox-constrained Mathematician information must be false");
    return {outcomeStatus:"ABNORMAL",causeKind:"VORTOX_FALSE_INFORMATION",causedByAnotherCharacterAbility:true};
  }
  throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Mathematician information reliability is invalid");
};
export const deriveFirstNightAbilityOutcomeFact=(input:{readonly stateBefore:GameState;readonly event:AnyDomainEventEnvelope}):FirstNightAbilityOutcomeFact|undefined=>{
  if(!terminalTypes.has(input.event.eventType as TerminalAbilityOutcomeEventType))return undefined;
  if(input.stateBefore.roster===undefined||!validatePlayerRoster(input.stateBefore.roster.entries).valid)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Outcome derivation requires one exact canonical roster");
  const p=input.event.payload as unknown as Record<string,unknown>; const task=taskFor(input.stateBefore,p.taskId); if(task===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Terminal outcome requires one canonical task"); const source=sourceFor(input.stateBefore,task,p); if(source===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Terminal outcome requires a role source"); let instance=instanceFor(task,source,input.stateBefore);const revision=input.stateBefore.currentCharacterState?.revision??1;
  if(input.event.eventType==="CerenovusMadnessInstructionDelivered"||input.event.eventType==="SeamstressInformationDelivered"){const opportunity=input.stateBefore.firstNightActionOpportunities?.opportunities.find((entry)=>entry.opportunityId===p.opportunityId) as unknown as Record<string,unknown>|undefined;const tenureId=p.sourceRoleTenureId??opportunity?.sourceRoleTenureId;const existingId=p.abilityInstanceId??opportunity?.sourceAbilityInstanceId;if(nonEmpty(tenureId)&&nonEmpty(existingId))instance={provenanceVersion:"first-night-ability-instance-provenance-v1",kind:"EXPLICIT_DOMAIN_INSTANCE",abilityInstanceId:formatExplicitFirstNightAbilityInstanceId({roleId:source.roleId,existingInstanceId:existingId as AbilityInstanceId}),abilityRoleId:source.roleId,taskId:task.taskId,sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber,sourceRoleTenureId:tenureId as RoleTenureId,existingInstanceId:existingId as AbilityInstanceId};}
  let status:AbilityOutcomeStatus="NORMAL",cause:AbilityOutcomeCause="NO_OTHER_CHARACTER_ABILITY",caused=false;
  if(input.event.eventType==="WitchIneffectiveResolved"){status="PENDING_TRIGGER";cause=p.sourceImpairmentKind==="POISONED"?"SOURCE_POISONING":"SOURCE_DRUNKENNESS";caused=true;}
  else if(input.event.eventType==="SnakeCharmerIneffectiveResolved"){const target=input.stateBefore.currentCharacterState?.entries.find((entry)=>entry.playerId===p.targetPlayerId&&entry.seatNumber===p.targetSeatNumber);if(target===undefined){status="UNRESOLVED";cause="CAUSE_NOT_PROVEN";}else if(target.role.characterType==="DEMON"){status="ABNORMAL";cause=p.sourceImpairmentKind==="POISONED"?"SOURCE_POISONING":"SOURCE_DRUNKENNESS";caused=true;}}
  else if(input.event.eventType==="ClockmakerInformationDelivered"&&p.informationReliability==="DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"){status="ABNORMAL";cause="SOURCE_DRUNKENNESS";caused=true;}
  else if(input.event.eventType==="ClockmakerInformationDelivered"&&p.informationReliability==="VORTOX_CONSTRAINED_FALSE"){status="ABNORMAL";cause="VORTOX_FALSE_INFORMATION";caused=true;}
  else if(input.event.eventType==="MathematicianInformationDelivered"){
    const classification=classifyMathematicianTerminalOutcomeForInternalValidation(p.trueCount,p.selectedCount,p.informationReliability);
    status=classification.outcomeStatus;cause=classification.causeKind;caused=classification.causedByAnotherCharacterAbility;
  }
  else if(input.event.eventType==="SeamstressInformationDelivered"&&p.informationReliability==="VORTOX_CONSTRAINED_FALSE"){status="ABNORMAL";cause="VORTOX_FALSE_INFORMATION";caused=true;}
  else if(input.event.eventType==="SeamstressInformationDelivered"&&plain(p.comparison)&&p.deliveredAnswer!==p.comparison.ruleCorrectAnswer){
    const represented=plain(p.sourceEffectiveness)&&isDenseCanonicalArray(p.sourceEffectiveness.representedImpairments)?p.sourceEffectiveness.representedImpairments:[];
    const first=represented[0];if(represented.length===0||!plain(first)||!(["DRUNK","POISONED"] as const).includes(first.impairmentKind as "DRUNK"|"POISONED"))throw new DomainError("InvalidFirstNightAbilityOutcomeFact","False Seamstress information requires a represented source impairment or Vortox constraint");
    status="ABNORMAL";cause=first.impairmentKind==="POISONED"?"SOURCE_POISONING":"SOURCE_DRUNKENNESS";caused=true;
  }
  else if(input.event.eventType==="DreamerInformationDelivered"&&plain(p.informationReliability)){
    const target=input.stateBefore.currentCharacterState?.entries.find((entry)=>entry.playerId===p.targetPlayerId&&entry.seatNumber===p.targetSeatNumber);const good=p.goodRole as Record<string,unknown>;const evil=p.evilRole as Record<string,unknown>;const containsTruth=target!==undefined&&(target.role.roleId===good.roleId||target.role.roleId===evil.roleId);const dreamerV2=p.deliverySchemaVersion==="dreamer-information-delivered-v2";
    if(dreamerV2){if(target===undefined||p.informationReliability.kind!=="EFFECTIVE"||!containsTruth)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","V2 normal Dreamer delivery must contain settlement-time truth");}
    else {const vortox=historicalVortoxApplicability(input.stateBefore,revision);if(vortox.kind==="PROVEN"){status="UNRESOLVED";cause="DREAMER_VORTOX_CONSTRAINT_UNRECORDED";}else if(vortox.kind==="UNRESOLVED"){status="UNRESOLVED";cause="VORTOX_APPLICABILITY_NOT_PROVEN";}else if(target===undefined){status="UNRESOLVED";cause="CAUSE_NOT_PROVEN";}else if(p.informationReliability.kind==="EFFECTIVE"&&!containsTruth)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Effective Dreamer false pair without Vortox is invalid");else if(p.informationReliability.kind==="SOURCE_IMPAIRED"&&!containsTruth){status="ABNORMAL";cause=p.informationReliability.sourceImpairmentKind==="POISONED"?"SOURCE_POISONING":"SOURCE_DRUNKENNESS";caused=true;}}
  }
  const evidence:AbilityOutcomeEvidenceReference[]=[{kind:"SOURCE_EVENT",eventId:input.event.eventId,eventType:input.event.eventType as TerminalAbilityOutcomeEventType,eventSequence:input.event.eventSequence,batchId:input.event.batchId},{kind:"TASK",taskId:task.taskId,taskType:task.taskType},{kind:"CHARACTER_STATE",characterStateRevision:revision},roleEvidenceFor(input.stateBefore,source.playerId,revision)];
  if(p.opportunityId!==undefined)evidence.push(opportunityEvidenceFor(input.stateBefore,p.opportunityId,task,source,input.event.eventType as TerminalAbilityOutcomeEventType,instance,input.event.eventType==="DreamerInformationDelivered"&&p.deliverySchemaVersion==="dreamer-information-delivered-v2"));
  if(instance.kind==="EXPLICIT_DOMAIN_INSTANCE")evidence.push(tenureEvidenceFor(input.stateBefore,instance.sourceRoleTenureId,revision));
  if(input.event.eventType==="MathematicianInformationDelivered"){
    const sourceContract=p.sourceContract;
    if(!plain(sourceContract)||!plain(sourceContract.sourceRoleTenure)||!nonEmpty(sourceContract.sourceRoleTenure.roleTenureId))throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Mathematician source requires one carried active tenure");
    evidence.push(tenureEvidenceFor(input.stateBefore,sourceContract.sourceRoleTenure.roleTenureId as RoleTenureId,revision));
  }
  if(input.event.eventType==="DreamerInformationDelivered"&&p.deliverySchemaVersion==="dreamer-information-delivered-v2"){
    const sourceContract=p.sourceContract;if(!plain(sourceContract)||sourceContract.sourceContractVersion!=="dreamer-base-source-contract-v1"||sourceContract.taskPlanVersion!=="first-night-task-plan-v2"||sourceContract.taskId!==task.taskId||sourceContract.sourcePlayerId!==source.playerId||sourceContract.sourceSeatNumber!==source.seatNumber||sourceContract.sourceRoleId!=="dreamer"||!nonEmpty(sourceContract.sourceRoleTenureId)||sourceContract.sourceAbilityInstanceId!==instance.abilityInstanceId)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","V2 Dreamer source contract must bind task, tenure, source, and base ability instance");
    evidence.push(tenureEvidenceFor(input.stateBefore,sourceContract.sourceRoleTenureId as RoleTenureId,revision));
  }
  if(input.event.eventType==="PhilosopherAbilityGranted")evidence.push({kind:"PHILOSOPHER_GRANT",grantId:p.grantId as GrantedAbilityId,philosopherOpportunityId:p.opportunityId as ActionOpportunityId,sourcePlayerId:p.sourcePlayerId as PlayerId,sourceSeatNumber:p.sourceSeatNumber as SeatNumber,chosenRoleId:p.chosenRoleId as RoleId,sourceCharacterStateRevision:p.sourceCharacterStateRevision as number});
  if(p.sourceImpairmentId!==undefined)evidence.push(impairmentEvidenceFor(input.stateBefore,p.sourceImpairmentId,source));
  if(input.event.eventType==="ClockmakerInformationDelivered"&&plain(p.sourceEffectiveness)&&isDenseCanonicalArray(p.sourceEffectiveness.representedImpairmentIds))for(const id of p.sourceEffectiveness.representedImpairmentIds)evidence.push(impairmentEvidenceFor(input.stateBefore,id,source));
  if(input.event.eventType==="SeamstressInformationDelivered"&&plain(p.sourceEffectiveness)&&isDenseCanonicalArray(p.sourceEffectiveness.representedImpairments))for(const represented of p.sourceEffectiveness.representedImpairments)if(plain(represented))evidence.push(impairmentEvidenceFor(input.stateBefore,represented.impairmentId,source));
  if(input.event.eventType==="MathematicianInformationDelivered"&&plain(p.sourceEffectiveness)&&isDenseCanonicalArray(p.sourceEffectiveness.representedImpairments))for(const represented of p.sourceEffectiveness.representedImpairments)if(plain(represented))evidence.push(impairmentEvidenceFor(input.stateBefore,represented.impairmentId,source));
  if(input.event.eventType==="DreamerInformationDelivered"&&plain(p.informationReliability)&&p.informationReliability.kind==="SOURCE_IMPAIRED")evidence.push(impairmentEvidenceFor(input.stateBefore,p.informationReliability.sourceImpairmentId,source));
  if(input.event.eventType==="DreamerInformationDelivered"&&p.deliverySchemaVersion!=="dreamer-information-delivered-v2"){const vortox=historicalVortoxApplicability(input.stateBefore,revision);if(vortox.kind==="PROVEN")evidence.push(roleEvidenceFor(input.stateBefore,vortox.playerId,revision),tenureEvidenceFor(input.stateBefore,vortox.tenureId,revision));else if(vortox.kind==="UNRESOLVED"&&vortox.playerId!==undefined)evidence.push(roleEvidenceFor(input.stateBefore,vortox.playerId,revision));}
  if((input.event.eventType==="ClockmakerInformationDelivered"||input.event.eventType==="SeamstressInformationDelivered")){const constraint=(input.event.eventType==="ClockmakerInformationDelivered"?p.vortoxConstraint:p.deliveryConstraint);if(plain(constraint)&&constraint.kind==="VORTOX_FALSE_REQUIRED")evidence.push(roleEvidenceFor(input.stateBefore,constraint.vortoxPlayerId as PlayerId,revision),tenureEvidenceFor(input.stateBefore,constraint.vortoxRoleTenureId as RoleTenureId,revision));}
  if(input.event.eventType==="MathematicianInformationDelivered"&&plain(p.vortoxConstraint)&&(p.vortoxConstraint.kind==="VORTOX_FALSE_REQUIRED"||p.vortoxConstraint.kind==="NONE_CURRENT_VORTOX_KNOWN_IMPAIRED")&&plain(p.vortoxConstraint.vortoxRoleTenure)){
    const vortoxSource={playerId:p.vortoxConstraint.vortoxPlayerId as PlayerId,seatNumber:p.vortoxConstraint.vortoxSeatNumber as SeatNumber,roleId:"vortox" as RoleId};
    evidence.push(roleEvidenceFor(input.stateBefore,vortoxSource.playerId,revision),tenureEvidenceFor(input.stateBefore,p.vortoxConstraint.vortoxRoleTenure.roleTenureId as RoleTenureId,revision));
    if(p.vortoxConstraint.kind==="NONE_CURRENT_VORTOX_KNOWN_IMPAIRED"&&plain(p.vortoxConstraint.impairment))evidence.push(impairmentEvidenceFor(input.stateBefore,p.vortoxConstraint.impairment.impairmentId,vortoxSource));
  }
  if(instance.kind==="PHILOSOPHER_GAINED_TASK_V1"||instance.kind==="PHILOSOPHER_GAINED_TASK_V2"){
    const grant=input.stateBefore.philosopherGrantedAbilities?.abilities.find((candidate)=>candidate.grantId===instance.grantId);
    const insertion=input.stateBefore.firstNightTaskInsertions?.insertions.find((candidate)=>candidate.taskId===task.taskId) as unknown as Record<string,unknown>|undefined;
    const philosopherOpportunities=input.stateBefore.firstNightActionOpportunities?.opportunities.filter((candidate)=>candidate.opportunityId===instance.philosopherOpportunityId)??[];
    if(grant===undefined||insertion===undefined||philosopherOpportunities.length!==1||philosopherOpportunities[0]===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Gained instance requires grant, insertion, and original Philosopher opportunity evidence");
    evidence.push(opportunityEvidenceFrom(philosopherOpportunities[0]));
    evidence.push({kind:"PHILOSOPHER_GRANT",grantId:grant.grantId,philosopherOpportunityId:grant.grantedAtOpportunityId,sourcePlayerId:grant.sourcePlayerId,sourceSeatNumber:grant.sourceSeatNumber,chosenRoleId:grant.chosenRoleId,sourceCharacterStateRevision:grant.sourceCharacterStateRevision});
    evidence.push({kind:"FIRST_NIGHT_TASK_INSERTION",taskId:task.taskId,philosopherOpportunityId:grant.grantedAtOpportunityId,sourcePlayerId:grant.sourcePlayerId,sourceSeatNumber:grant.sourceSeatNumber,chosenRoleId:grant.chosenRoleId,generation:instance.kind==="PHILOSOPHER_GAINED_TASK_V2"?{kind:"V2",taskPlanVersion:"first-night-task-plan-v2",grantId:grant.grantId,schedulingVersion:"philosopher-gained-first-night-scheduling-v2"}:{kind:"V1",taskPlanVersion:"first-night-task-plan-v1"}});
  }
  if(input.event.eventType.startsWith("SnakeCharmer")){
    const targetId=p.targetPlayerId as PlayerId;const targetEntry=input.stateBefore.currentCharacterState?.entries.find((entry)=>entry.playerId===targetId&&entry.seatNumber===p.targetSeatNumber);
    if(targetEntry!==undefined){const target=roleEvidenceFor(input.stateBefore,targetId,revision);evidence.push(target,{kind:"SNAKE_CHARMER_RESOLUTION",resolutionKind:input.event.eventType==="SnakeCharmerDemonSwapApplied"?"DEMON_HIT_SWAP":input.event.eventType==="SnakeCharmerIneffectiveResolved"?"INEFFECTIVE_NO_SWAP":"NON_DEMON_NO_SWAP",taskId:task.taskId,opportunityId:p.opportunityId as ActionOpportunityId,targetPlayerId:target.playerId,targetSeatNumber:target.seatNumber,targetRoleIdAtResolution:target.roleId,resolutionEventId:input.event.eventId});}
  } else if(input.event.eventType==="EvilTwinInformationDelivered"){
    const pairs=input.stateBefore.evilTwinPairs?.pairs.filter((candidate)=>candidate.pairId===p.pairId)??[];const pair=pairs[0];if(pairs.length!==1||pair===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Evil Twin delivery requires one pair evidence record");evidence.push(roleEvidenceFor(input.stateBefore,pair.evilTwinPlayer.playerId,revision),roleEvidenceFor(input.stateBefore,pair.goodTwinPlayer.playerId,revision),{kind:"EVIL_TWIN_PAIR",pairId:pair.pairId,evilTwinPlayerId:pair.evilTwinPlayer.playerId,goodTwinPlayerId:pair.goodTwinPlayer.playerId,establishedTaskId:pair.taskId,informationDeliveryEventId:input.event.eventId});
  } else if(input.event.eventType==="WitchDeathPendingMarked"){
    evidence.push(roleEvidenceFor(input.stateBefore,p.targetPlayerId as PlayerId,revision),{kind:"WITCH_PENDING_MARKER",pendingDeathId:p.pendingDeathId as string,sourcePlayerId:source.playerId,targetPlayerId:p.targetPlayerId as PlayerId,taskId:task.taskId,opportunityId:p.opportunityId as ActionOpportunityId,terminalEventId:input.event.eventId});
  } else if(input.event.eventType==="WitchIneffectiveResolved") evidence.push(roleEvidenceFor(input.stateBefore,p.targetPlayerId as PlayerId,revision));
  else if(input.event.eventType==="CerenovusMadnessInstructionDelivered"){
    const choices=input.stateBefore.cerenovusChoices?.choices.filter((candidate)=>candidate.choiceId===p.choiceId)??[];const markers=input.stateBefore.cerenovusMadnessMarkers?.markers.filter((candidate)=>candidate.markerId===p.markerId)??[];const choice=choices[0];const marker=markers[0];const chain=choice===undefined||marker===undefined?undefined:validateCerenovusInstructionAgainstChain(choice,marker,input.event.payload);if(choices.length!==1||markers.length!==1||choice===undefined||marker===undefined||chain?.valid!==true||choice.taskId!==task.taskId||choice.sourcePlayerId!==source.playerId||choice.sourceSeatNumber!==source.seatNumber||choice.targetPlayerId!==p.recipientPlayerId||choice.targetSeatNumber!==p.recipientSeatNumber||choice.chosenGoodRoleId!==p.madAboutRoleId||marker.choiceId!==choice.choiceId)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Cerenovus instruction requires one canonical choice-marker-delivery chain");evidence.push(roleEvidenceFor(input.stateBefore,p.recipientPlayerId as PlayerId,revision),{kind:"CERENOVUS_INSTRUCTION",deliveryId:p.deliveryId as string,choiceId:p.choiceId as string,markerId:p.markerId as string,sourcePlayerId:source.playerId,targetPlayerId:p.recipientPlayerId as PlayerId,chosenRoleId:p.madAboutRoleId as RoleId,taskId:task.taskId,terminalEventId:input.event.eventId});
  } else if(input.event.eventType==="ClockmakerInformationDelivered") evidence.push({kind:"CLOCKMAKER_DELIVERY",deliveryId:p.deliveryId as string,taskId:task.taskId,sourcePlayerId:source.playerId,ruleCorrectDistance:p.ruleCorrectDistance as number,selectedDistance:p.selectedDistance as number,terminalEventId:input.event.eventId});
  else if(input.event.eventType==="MathematicianInformationDelivered") evidence.push({kind:"MATHEMATICIAN_DELIVERY",deliveryId:p.deliveryId as MathematicianDeliveryId,taskId:task.taskId,sourcePlayerId:source.playerId,trueCount:p.trueCount as MathematicianCount,selectedCount:p.selectedCount as MathematicianCount,terminalEventId:input.event.eventId});
  else if(input.event.eventType==="DreamerInformationDelivered") evidence.push(roleEvidenceFor(input.stateBefore,p.targetPlayerId as PlayerId,revision),{kind:"DREAMER_DELIVERY",taskId:task.taskId,opportunityId:p.opportunityId as ActionOpportunityId,sourcePlayerId:source.playerId,targetPlayerId:p.targetPlayerId as PlayerId,deliveredGoodRoleId:(p.goodRole as Record<string,unknown>).roleId as RoleId,deliveredEvilRoleId:(p.evilRole as Record<string,unknown>).roleId as RoleId,terminalEventId:input.event.eventId});
  else if(input.event.eventType==="SeamstressInformationDelivered"){
    const targets=p.targetPlayerIds as readonly [PlayerId,PlayerId];const comparison=p.comparison as Record<string,unknown>;evidence.push(roleEvidenceFor(input.stateBefore,targets[0],revision),roleEvidenceFor(input.stateBefore,targets[1],revision),{kind:"SEAMSTRESS_DELIVERY",taskId:task.taskId,opportunityId:p.opportunityId as ActionOpportunityId,sourcePlayerId:source.playerId,firstTargetPlayerId:targets[0],secondTargetPlayerId:targets[1],ruleCorrectAnswer:comparison.ruleCorrectAnswer as "YES"|"NO",deliveredAnswer:p.deliveredAnswer as "YES"|"NO",terminalEventId:input.event.eventId});
  }
  const fact:FirstNightAbilityOutcomeFact={auditFactId:formatFirstNightAbilityOutcomeFactId(input.event.eventId),auditModelVersion:FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,windowVersion:FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION,sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber,abilityRoleId:source.roleId,abilityTaskId:task.taskId,abilityInstance:instance,sourceEventId:input.event.eventId,sourceBatchId:input.event.batchId,sourceEventSequence:input.event.eventSequence,evaluatedCharacterStateRevision:input.stateBefore.currentCharacterState?.revision??1,outcomeStatus:status,causeKind:cause,causedByAnotherCharacterAbility:caused,evidenceReferences:canonicalizeAbilityOutcomeEvidenceReferences(evidence),detectedAtEventSequence:input.event.eventSequence}; return fact;
};
const validateFactAgainstCanonicalSource=(stateBefore:GameState,event:AnyDomainEventEnvelope,candidate:FirstNightAbilityOutcomeFact):OutcomeLedgerValidationResult=>{
  const shape=validateFirstNightAbilityOutcomeFactShape(candidate);if(!shape.valid)return shape;
  const expected=deriveFirstNightAbilityOutcomeFact({stateBefore,event});
  return expected!==undefined&&sameCanonicalDataValue(expected,candidate)?{valid:true}:fail("Fact does not equal its unique canonical pre-event source derivation");
};
export const applyFirstNightAbilityOutcomeLedger=(stateBefore:GameState|undefined,event:AnyDomainEventEnvelope,next:GameState):GameState=>{
  if(event.eventType==="FirstNightInitialized"){
    if(stateBefore===undefined||stateBefore.firstNightAbilityOutcomeLedger!==undefined||stateBefore.firstNightInitializationProvenance!==undefined)
      throw new DomainError("InvalidFirstNightAbilityOutcomeLedger","FirstNightInitialized must be the unique event-created ledger anchor source");
    const provenance:FirstNightInitializationEnvelopeProvenance={provenanceVersion:"first-night-initialization-envelope-provenance-v1",gameId:event.gameId,rulesBaselineVersion:event.rulesBaselineVersion,eventId:event.eventId,eventSequence:event.eventSequence};
    const created:FirstNightAbilityOutcomeLedger={ledgerVersion:FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION,auditModelVersion:FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,windowAnchor:{windowVersion:FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION,gameId:event.gameId,nightNumber:1,rulesBaselineVersion:event.rulesBaselineVersion,firstNightInitializedEventId:event.eventId,startEventSequence:event.eventSequence,startBoundary:"EXCLUSIVE"},facts:[]};
    if(!validateFirstNightInitializationEnvelopeProvenance(provenance).valid||!validateFirstNightAbilityOutcomeLedgerShape(created).valid)throw new DomainError("InvalidFirstNightAbilityOutcomeLedger","Derived first-night ledger anchor is invalid");return {...next,firstNightInitializationProvenance:provenance,firstNightAbilityOutcomeLedger:created};
  }
  if(stateBefore===undefined)return next;
  if(stateBefore.firstNightAbilityOutcomeLedger===undefined){if(stateBefore.firstNightInitializationProvenance!==undefined||next.firstNightAbilityOutcomeLedger!==undefined||next.firstNightInitializationProvenance!==undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeLedger","Ledger and initialization provenance must be created together by FirstNightInitialized");return next;}
  const existingValidation=validateFirstNightAbilityOutcomeLedgerShape(stateBefore.firstNightAbilityOutcomeLedger);if(!existingValidation.valid)throw new DomainError("InvalidFirstNightAbilityOutcomeLedger",existingValidation.reason);
  const provenanceValidation=validateFirstNightInitializationEnvelopeProvenance(stateBefore.firstNightInitializationProvenance);if(!provenanceValidation.valid)throw new DomainError("InvalidFirstNightAbilityOutcomeLedger",provenanceValidation.reason);
  const provenance=stateBefore.firstNightInitializationProvenance!;const anchor=stateBefore.firstNightAbilityOutcomeLedger.windowAnchor;
  if(anchor.gameId!==stateBefore.gameId||anchor.gameId!==event.gameId||anchor.rulesBaselineVersion!==stateBefore.rulesBaselineVersion||anchor.rulesBaselineVersion!==event.rulesBaselineVersion||
    anchor.gameId!==provenance.gameId||anchor.rulesBaselineVersion!==provenance.rulesBaselineVersion||anchor.firstNightInitializedEventId!==provenance.eventId||anchor.startEventSequence!==provenance.eventSequence||
    event.eventSequence<=anchor.startEventSequence||!sameCanonicalDataValue(next.firstNightAbilityOutcomeLedger,stateBefore.firstNightAbilityOutcomeLedger)||!sameCanonicalDataValue(next.firstNightInitializationProvenance,provenance))
    throw new DomainError("InvalidFirstNightAbilityOutcomeLedger","Ledger anchor must match its unique initialization envelope provenance and remain immutable");
  const fact=deriveFirstNightAbilityOutcomeFact({stateBefore,event});if(fact===undefined)return next;const factValidation=validateFactAgainstCanonicalSource(stateBefore,event,fact);if(!factValidation.valid)throw new DomainError("InvalidFirstNightAbilityOutcomeFact",factValidation.reason);
  const duplicate=stateBefore.firstNightAbilityOutcomeLedger.facts.find((entry)=>entry.auditFactId===fact.auditFactId);if(duplicate!==undefined)throw new DomainError(sameCanonicalDataValue(duplicate,fact)?"DuplicateFirstNightAbilityOutcomeFactConflict":"DuplicateFirstNightAbilityOutcomeFactConflict","Outcome fact identity already exists");
  const appended:FirstNightAbilityOutcomeLedger={...stateBefore.firstNightAbilityOutcomeLedger,facts:[...stateBefore.firstNightAbilityOutcomeLedger.facts,fact]};const ledgerValidation=validateFirstNightAbilityOutcomeLedgerShape(appended);if(!ledgerValidation.valid)throw new DomainError("InvalidFirstNightAbilityOutcomeLedger",ledgerValidation.reason);return {...next,firstNightInitializationProvenance:provenance,firstNightAbilityOutcomeLedger:appended};
};
