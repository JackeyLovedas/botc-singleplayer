import { isCanonicalDataValue, isDenseCanonicalArray, sameCanonicalDataValue } from "./canonical-data.js";
import { DomainError } from "./errors.js";
import type { AnyDomainEventEnvelope } from "./events.js";
import type { FirstNightTaskType, ScheduledTask } from "./first-night-task-plan.js";
import { getNextUnsettledFirstNightTask } from "./first-night-task-plan.js";
import type { GameState } from "./game-state.js";
import type {
  AbilityImpairmentId, AbilityInstanceId, ActionOpportunityId, BatchId, EventId, GameId,
  GrantedAbilityId, PlayerId, RoleId, RoleTenureId, ScheduledTaskId
} from "./ids.js";
import type { SeatNumber } from "./player-roster.js";

export const FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION = "first-night-ability-outcome-ledger-v1" as const;
export const FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION = "first-night-ability-outcome-audit-v1" as const;
export const FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION = "first-night-ability-outcome-window-v1" as const;
export const FIRST_NIGHT_MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION = "first-night-mathematician-count-resolution-v1" as const;
export const MATHEMATICIAN_AUDIT_OVERRIDE_SET_VERSION = "mathematician-audit-override-set-v1" as const;

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
export type FirstNightAbilityOutcomeWindowSnapshot = FirstNightAbilityOutcomeWindowAnchor & {
  readonly endEventSequence: number;
  readonly endBoundary: "INCLUSIVE";
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
  | "DreamerInformationDelivered" | "SeamstressInformationDelivered";

export type SourceEventEvidence = { readonly kind: "SOURCE_EVENT"; readonly eventId: EventId; readonly eventType: TerminalAbilityOutcomeEventType; readonly eventSequence: number; readonly batchId: BatchId };
export type TaskEvidence = { readonly kind: "TASK"; readonly taskId: ScheduledTaskId; readonly taskType: FirstNightTaskType };
export type ActionOpportunityEvidence = { readonly kind: "ACTION_OPPORTUNITY"; readonly opportunityId: ActionOpportunityId; readonly taskId: ScheduledTaskId; readonly sourcePlayerId: PlayerId; readonly sourceSeatNumber: SeatNumber };
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
export type AbilityOutcomeEvidenceReference = SourceEventEvidence | TaskEvidence | ActionOpportunityEvidence | AbilityImpairmentEvidence | RoleTenureEvidence | CharacterStateEvidence | PlayerRoleAtRevisionEvidence | PhilosopherGrantEvidence | FirstNightTaskInsertionEvidence | SnakeCharmerResolutionEvidence | EvilTwinPairEvidence | WitchPendingMarkerEvidence | CerenovusInstructionEvidence | ClockmakerDeliveryEvidence | DreamerDeliveryEvidence | SeamstressDeliveryEvidence;

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

export type MathematicianAuditOverrideVersions = { readonly overrideSetVersion: typeof MATHEMATICIAN_AUDIT_OVERRIDE_SET_VERSION; readonly firstNightWindow: "BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1"; readonly ownAbilityExclusion: "BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1"; readonly numericDomain: "BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1"; readonly duplicateHolderTemporal: "BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1" };
export type MathematicianCountDistinctPlayer = { readonly playerId: PlayerId; readonly seatNumber: SeatNumber; readonly supportingFactIds: readonly FirstNightAbilityOutcomeFactId[] };
export type MathematicianCountUnresolvedFact = { readonly auditFactId: FirstNightAbilityOutcomeFactId; readonly sourcePlayerId: PlayerId; readonly sourceSeatNumber: SeatNumber; readonly abilityRoleId: RoleId; readonly abilityTaskId: ScheduledTaskId; readonly causeKind: AbilityOutcomeCause };
type CountCommon = { readonly resolutionModelVersion: typeof FIRST_NIGHT_MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION; readonly window: FirstNightAbilityOutcomeWindowSnapshot; readonly resolvingSourcePlayerId: PlayerId; readonly resolvingAbilityInstanceId: FirstNightAbilityInstanceId; readonly evaluatedThroughEventSequence: number; readonly qualifyingAbnormalFactIds: readonly FirstNightAbilityOutcomeFactId[]; readonly distinctAbnormalPlayers: readonly MathematicianCountDistinctPlayer[]; readonly excludedOwnFactIds: readonly FirstNightAbilityOutcomeFactId[]; readonly ignoredFutureFactIds: readonly FirstNightAbilityOutcomeFactId[]; readonly ignoredNormalFactIds: readonly FirstNightAbilityOutcomeFactId[]; readonly ignoredPendingFactIds: readonly FirstNightAbilityOutcomeFactId[]; readonly redundantUnresolvedFactIds: readonly FirstNightAbilityOutcomeFactId[] };
export type MathematicianCountResolved = CountCommon & { readonly status: "RESOLVED"; readonly trueCount: number };
export type MathematicianCountUnresolved = CountCommon & { readonly status: "UNRESOLVED"; readonly unresolvedFacts: readonly MathematicianCountUnresolvedFact[]; readonly currentPartialCount: number };
export type MathematicianCountResolution = MathematicianCountResolved | MathematicianCountUnresolved;

const fail = (reason: string): OutcomeLedgerValidationResult => ({ valid: false, reason });
const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const positive = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v > 0;
const plain = (v: unknown): v is Record<string, unknown> => {
  if (!isCanonicalDataValue(v) || v === null || typeof v !== "object" || Array.isArray(v)) return false;
  const proto: unknown = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};
const exact = (v: Record<string, unknown>, keys: readonly string[]): boolean => {
  const actual = Object.keys(v).sort(); const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
};
const clone = <T>(v: T): T => structuredClone(v);

export const formatBaseFirstNightAbilityInstanceId = (taskId: ScheduledTaskId): FirstNightAbilityInstanceId => `first-night-ability-instance-v1:base-task:${taskId}` as FirstNightAbilityInstanceId;
export const formatPhilosopherGainedV1AbilityInstanceId = (input: { readonly taskId: ScheduledTaskId; readonly grantId: GrantedAbilityId }): FirstNightAbilityInstanceId => `first-night-ability-instance-v1:philosopher-gained-v1:${input.taskId}:grant:${input.grantId}` as FirstNightAbilityInstanceId;
export const formatPhilosopherGainedV2AbilityInstanceId = (input: { readonly taskId: ScheduledTaskId; readonly grantId: GrantedAbilityId }): FirstNightAbilityInstanceId => `first-night-ability-instance-v1:philosopher-gained-v2:${input.taskId}:grant:${input.grantId}` as FirstNightAbilityInstanceId;
export const formatExplicitFirstNightAbilityInstanceId = (input: { readonly roleId: RoleId; readonly existingInstanceId: AbilityInstanceId }): FirstNightAbilityInstanceId => `first-night-ability-instance-v1:explicit:${input.roleId}:${input.existingInstanceId}` as FirstNightAbilityInstanceId;
export const parseFirstNightAbilityInstanceId = (value: unknown): { readonly valid: true; readonly canonicalId: FirstNightAbilityInstanceId; readonly kind: FirstNightAbilityInstanceProvenance["kind"]; readonly taskId?: ScheduledTaskId; readonly grantId?: GrantedAbilityId; readonly roleId?: RoleId; readonly existingInstanceId?: AbilityInstanceId } | { readonly valid: false; readonly reason: string } => {
  if (!nonEmpty(value) || value.trim() !== value || [...value].some((character) => { const code=character.charCodeAt(0); return code <= 31 || code === 127; })) return { valid: false, reason: "Ability instance ID must be a canonical non-empty string" };
  let match = /^first-night-ability-instance-v1:base-task:(.+)$/.exec(value);
  if (match?.[1] !== undefined && nonEmpty(match[1])) return { valid: true, kind: "BASE_ROLE_TASK", canonicalId: value as FirstNightAbilityInstanceId, taskId: match[1] as ScheduledTaskId };
  match = /^first-night-ability-instance-v1:philosopher-gained-(v1|v2):(.+):grant:(.+)$/.exec(value);
  if (match?.[1] !== undefined && value.split(":grant:").length===2 && nonEmpty(match[2]) && nonEmpty(match[3])) return { valid: true, kind: match[1] === "v1" ? "PHILOSOPHER_GAINED_TASK_V1" : "PHILOSOPHER_GAINED_TASK_V2", canonicalId: value as FirstNightAbilityInstanceId, taskId: match[2] as ScheduledTaskId, grantId: match[3] as GrantedAbilityId };
  match = /^first-night-ability-instance-v1:explicit:([^:]+):(.+)$/.exec(value);
  if (nonEmpty(match?.[1]) && nonEmpty(match?.[2])) return { valid: true, kind: "EXPLICIT_DOMAIN_INSTANCE", canonicalId: value as FirstNightAbilityInstanceId, roleId: match[1] as RoleId, existingInstanceId: match[2] as AbilityInstanceId };
  return { valid: false, reason: "Ability instance ID has invalid canonical grammar" };
};
const provenanceKeys:Record<FirstNightAbilityInstanceProvenance["kind"],readonly string[]>={BASE_ROLE_TASK:["provenanceVersion","kind","abilityInstanceId","abilityRoleId","taskId","sourcePlayerId","sourceSeatNumber"],PHILOSOPHER_GAINED_TASK_V1:["provenanceVersion","kind","abilityInstanceId","abilityRoleId","taskId","sourcePlayerId","sourceSeatNumber","philosopherOpportunityId","grantId","sourceCharacterStateRevision"],PHILOSOPHER_GAINED_TASK_V2:["provenanceVersion","kind","abilityInstanceId","abilityRoleId","taskId","sourcePlayerId","sourceSeatNumber","philosopherOpportunityId","grantId","sourceCharacterStateRevision","schedulingVersion"],EXPLICIT_DOMAIN_INSTANCE:["provenanceVersion","kind","abilityInstanceId","abilityRoleId","taskId","sourcePlayerId","sourceSeatNumber","sourceRoleTenureId","existingInstanceId"]};
export const validateFirstNightAbilityInstanceProvenance=(value:unknown):OutcomeLedgerValidationResult=>{try{if(!plain(value)||!nonEmpty(value.kind)||!(value.kind in provenanceKeys)||!exact(value,provenanceKeys[value.kind as FirstNightAbilityInstanceProvenance["kind"]]))return fail("Invalid ability instance provenance shape");const parsed=parseFirstNightAbilityInstanceId(value.abilityInstanceId);if(!parsed.valid||parsed.kind!==value.kind)return fail("Ability instance provenance ID does not match kind");return {valid:true};}catch{return fail("Ability instance provenance must fail closed");}};
export const cloneFirstNightAbilityInstanceProvenance=(value:FirstNightAbilityInstanceProvenance):FirstNightAbilityInstanceProvenance=>clone(value);
export const formatFirstNightAbilityOutcomeFactId = (sourceEventId: EventId): FirstNightAbilityOutcomeFactId => `first-night-ability-outcome-fact-v1:${sourceEventId}` as FirstNightAbilityOutcomeFactId;
export const parseFirstNightAbilityOutcomeFactId = (value: unknown): { readonly valid: true; readonly canonicalId: FirstNightAbilityOutcomeFactId; readonly sourceEventId: EventId } | { readonly valid: false; readonly reason: string } => {
  if (!nonEmpty(value)) return { valid: false, reason: "Fact ID must be non-empty" };
  const prefix = "first-night-ability-outcome-fact-v1:"; const source = value.startsWith(prefix) ? value.slice(prefix.length) : "";
  return nonEmpty(source) ? { valid: true, canonicalId: value as FirstNightAbilityOutcomeFactId, sourceEventId: source as EventId } : { valid: false, reason: "Fact ID has invalid canonical grammar" };
};

const WINDOW_ANCHOR_KEYS = ["windowVersion", "gameId", "nightNumber", "rulesBaselineVersion", "firstNightInitializedEventId", "startEventSequence", "startBoundary"];
const WINDOW_SNAPSHOT_KEYS = [...WINDOW_ANCHOR_KEYS, "endEventSequence", "endBoundary"];
export const validateFirstNightAbilityOutcomeWindowAnchor = (value: unknown): OutcomeLedgerValidationResult => plain(value) && exact(value, WINDOW_ANCHOR_KEYS) && value.windowVersion === FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION && nonEmpty(value.gameId) && value.nightNumber === 1 && nonEmpty(value.rulesBaselineVersion) && nonEmpty(value.firstNightInitializedEventId) && positive(value.startEventSequence) && value.startBoundary === "EXCLUSIVE" ? { valid: true } : fail("Invalid first-night outcome window anchor");
export const validateFirstNightAbilityOutcomeWindowSnapshot = (value: unknown): OutcomeLedgerValidationResult => plain(value) && exact(value, WINDOW_SNAPSHOT_KEYS) && validateFirstNightAbilityOutcomeWindowAnchor(Object.fromEntries(WINDOW_ANCHOR_KEYS.map((k) => [k, value[k]]))).valid && positive(value.endEventSequence) && value.endBoundary === "INCLUSIVE" && (value.endEventSequence) >= (value.startEventSequence as number) ? { valid: true } : fail("Invalid first-night outcome window snapshot");
export const cloneFirstNightAbilityOutcomeWindowAnchor = (value: FirstNightAbilityOutcomeWindowAnchor): FirstNightAbilityOutcomeWindowAnchor => clone(value);
export const cloneFirstNightAbilityOutcomeWindowSnapshot = (value: FirstNightAbilityOutcomeWindowSnapshot): FirstNightAbilityOutcomeWindowSnapshot => clone(value);

const evidenceKeys: Record<AbilityOutcomeEvidenceReference["kind"], readonly string[]> = {
  SOURCE_EVENT: ["kind","eventId","eventType","eventSequence","batchId"], TASK: ["kind","taskId","taskType"], ACTION_OPPORTUNITY: ["kind","opportunityId","taskId","sourcePlayerId","sourceSeatNumber"],
  ABILITY_IMPAIRMENT: ["kind","impairmentId","impairmentKind","affectedPlayerId","affectedSeatNumber","affectedRoleId","sourceKind","appliedCharacterStateRevision"], ROLE_TENURE: ["kind","roleTenureId","playerId","seatNumber","roleId","acquiredCharacterStateRevision","statusAtEvaluation"], CHARACTER_STATE: ["kind","characterStateRevision"], PLAYER_ROLE_AT_REVISION: ["kind","playerId","seatNumber","roleId","characterType","defaultAlignment","characterStateRevision"], PHILOSOPHER_GRANT: ["kind","grantId","philosopherOpportunityId","sourcePlayerId","sourceSeatNumber","chosenRoleId","sourceCharacterStateRevision"], FIRST_NIGHT_TASK_INSERTION: ["kind","taskId","philosopherOpportunityId","sourcePlayerId","sourceSeatNumber","chosenRoleId","generation"], SNAKE_CHARMER_RESOLUTION: ["kind","resolutionKind","taskId","opportunityId","targetPlayerId","targetSeatNumber","targetRoleIdAtResolution","resolutionEventId"], EVIL_TWIN_PAIR: ["kind","pairId","evilTwinPlayerId","goodTwinPlayerId","establishedTaskId","informationDeliveryEventId"], WITCH_PENDING_MARKER: ["kind","pendingDeathId","sourcePlayerId","targetPlayerId","taskId","opportunityId","terminalEventId"], CERENOVUS_INSTRUCTION: ["kind","deliveryId","choiceId","markerId","sourcePlayerId","targetPlayerId","chosenRoleId","taskId","terminalEventId"], CLOCKMAKER_DELIVERY: ["kind","deliveryId","taskId","sourcePlayerId","ruleCorrectDistance","selectedDistance","terminalEventId"], DREAMER_DELIVERY: ["kind","taskId","opportunityId","sourcePlayerId","targetPlayerId","deliveredGoodRoleId","deliveredEvilRoleId","terminalEventId"], SEAMSTRESS_DELIVERY: ["kind","taskId","opportunityId","sourcePlayerId","firstTargetPlayerId","secondTargetPlayerId","ruleCorrectAnswer","deliveredAnswer","terminalEventId"]
};
const ranks = Object.fromEntries(Object.keys(evidenceKeys).map((key, i) => [key, i])) as Record<string, number>;
const primary = (e: AbilityOutcomeEvidenceReference): string => {
  const r = e as unknown as Record<string, unknown>;
  if (e.kind === "PLAYER_ROLE_AT_REVISION") return `${e.playerId}@revision-${e.characterStateRevision}`;
  if (e.kind === "FIRST_NIGHT_TASK_INSERTION") return `${e.generation.kind}:${e.taskId}`;
  for (const key of ["eventId","taskId","opportunityId","impairmentId","roleTenureId","characterStateRevision","grantId","resolutionEventId","pairId","pendingDeathId","deliveryId","terminalEventId"]) { const value=r[key]; if (typeof value === "string" || typeof value === "number") return String(value); }
  return "";
};
export const validateAbilityOutcomeEvidenceReference = (value: unknown): OutcomeLedgerValidationResult => {
  try { if (!plain(value) || !nonEmpty(value.kind) || !(value.kind in evidenceKeys) || !exact(value, evidenceKeys[value.kind as AbilityOutcomeEvidenceReference["kind"]])) return fail("Evidence reference must have one exact closed variant shape"); return { valid: true }; } catch { return fail("Evidence reference must fail closed"); }
};
export const cloneAbilityOutcomeEvidenceReference = (value: AbilityOutcomeEvidenceReference): AbilityOutcomeEvidenceReference => clone(value);
export const canonicalizeAbilityOutcomeEvidenceReferences = (values: unknown): readonly AbilityOutcomeEvidenceReference[] => {
  if (!isDenseCanonicalArray(values)) throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence", "Evidence must be a dense canonical array");
  const sorted = values.map((v) => { const result = validateAbilityOutcomeEvidenceReference(v); if (!result.valid) throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence", result.reason); return clone(v as AbilityOutcomeEvidenceReference); }).sort((a,b) => (ranks[a.kind]!-ranks[b.kind]!) || (primary(a)<primary(b)?-1:primary(a)>primary(b)?1:0));
  const out: AbilityOutcomeEvidenceReference[]=[];
  for (const e of sorted) { const prior=out.at(-1); if (prior?.kind===e.kind && primary(prior)===primary(e)) { if (!sameCanonicalDataValue(prior,e)) throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Conflicting evidence primary identity"); } else out.push(e); }
  return out;
};

const FACT_KEYS=["auditFactId","auditModelVersion","windowVersion","sourcePlayerId","sourceSeatNumber","abilityRoleId","abilityTaskId","abilityInstance","sourceEventId","sourceBatchId","sourceEventSequence","evaluatedCharacterStateRevision","outcomeStatus","causeKind","causedByAnotherCharacterAbility","evidenceReferences","detectedAtEventSequence"];
export const validateFirstNightAbilityOutcomeFact = (value: unknown): OutcomeLedgerValidationResult => {
  try {
    if (!plain(value)||!exact(value,FACT_KEYS)||parseFirstNightAbilityOutcomeFactId(value.auditFactId).valid===false||value.auditFactId!==formatFirstNightAbilityOutcomeFactId(value.sourceEventId as EventId)||value.auditModelVersion!==FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION||value.windowVersion!==FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION||!positive(value.sourceEventSequence)||value.detectedAtEventSequence!==value.sourceEventSequence||!positive(value.evaluatedCharacterStateRevision)||!isDenseCanonicalArray(value.evidenceReferences)||!validateFirstNightAbilityInstanceProvenance(value.abilityInstance).valid) return fail("Invalid outcome fact shape or identity");
    const combinations = (value.outcomeStatus==="NORMAL"&&value.causeKind==="NO_OTHER_CHARACTER_ABILITY"&&value.causedByAnotherCharacterAbility===false)||(value.outcomeStatus==="ABNORMAL"&&["SOURCE_DRUNKENNESS","SOURCE_POISONING","VORTOX_FALSE_INFORMATION"].includes(value.causeKind as string)&&value.causedByAnotherCharacterAbility===true)||(value.outcomeStatus==="UNRESOLVED"&&["DREAMER_VORTOX_CONSTRAINT_UNRECORDED","VORTOX_APPLICABILITY_NOT_PROVEN","CAUSE_NOT_PROVEN"].includes(value.causeKind as string)&&value.causedByAnotherCharacterAbility===false)||(value.outcomeStatus==="PENDING_TRIGGER"&&["SOURCE_DRUNKENNESS","SOURCE_POISONING"].includes(value.causeKind as string)&&value.causedByAnotherCharacterAbility===true);
    if(!combinations)return fail("Outcome status, cause, and boolean combination is invalid");
    const canonical=canonicalizeAbilityOutcomeEvidenceReferences(value.evidenceReferences);if(!sameCanonicalDataValue(canonical,value.evidenceReferences))return fail("Evidence must already be canonical");
    const sources=canonical.filter((entry)=>entry.kind==="SOURCE_EVENT");const tasks=canonical.filter((entry)=>entry.kind==="TASK");
    if(sources.length!==1||tasks.length!==1||sources[0]?.eventId!==value.sourceEventId||sources[0]?.eventSequence!==value.sourceEventSequence||sources[0]?.batchId!==value.sourceBatchId||tasks[0]?.taskId!==value.abilityTaskId)return fail("Fact evidence source/task cross-link is invalid");
    return {valid:true};
  } catch { return fail("Outcome fact must fail closed"); }
};
export const cloneFirstNightAbilityOutcomeFact = (v: FirstNightAbilityOutcomeFact): FirstNightAbilityOutcomeFact => clone(v);
export const validateFirstNightAbilityOutcomeLedger = (value: unknown): OutcomeLedgerValidationResult => {
  try { if (!plain(value)||!exact(value,["ledgerVersion","auditModelVersion","windowAnchor","facts"])||value.ledgerVersion!==FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION||value.auditModelVersion!==FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION||!validateFirstNightAbilityOutcomeWindowAnchor(value.windowAnchor).valid||!isDenseCanonicalArray(value.facts)) return fail("Invalid outcome ledger shape"); let seq=0; const ids=new Set<string>(); for(const fact of value.facts){const v=validateFirstNightAbilityOutcomeFact(fact);if(!v.valid)return v;const f=fact as FirstNightAbilityOutcomeFact;if(f.sourceEventSequence<=seq||ids.has(f.auditFactId))return fail("Outcome facts must be unique and sorted");seq=f.sourceEventSequence;ids.add(f.auditFactId);}return {valid:true}; } catch{return fail("Outcome ledger must fail closed");}
};
export const cloneFirstNightAbilityOutcomeLedger=(v:FirstNightAbilityOutcomeLedger):FirstNightAbilityOutcomeLedger=>clone(v);

const terminalTypes = new Set<TerminalAbilityOutcomeEventType>(["PhilosopherActionDeferred","PhilosopherAbilityGranted","SnakeCharmerNoSwapResolved","SnakeCharmerIneffectiveResolved","SnakeCharmerDemonSwapApplied","EvilTwinInformationDelivered","WitchDeathPendingMarked","WitchIneffectiveResolved","CerenovusMadnessInstructionDelivered","ClockmakerInformationDelivered","DreamerInformationDelivered","SeamstressInformationDelivered"]);
const roleForTask: Record<FirstNightTaskType, RoleId> = {PHILOSOPHER_ACTION:"philosopher" as RoleId,MINION_INFO:"" as RoleId,DEMON_INFO:"" as RoleId,SNAKE_CHARMER_ACTION:"snakeCharmer" as RoleId,EVIL_TWIN_SETUP:"evilTwin" as RoleId,WITCH_ACTION:"witch" as RoleId,CERENOVUS_ACTION:"cerenovus" as RoleId,CLOCKMAKER_INFORMATION:"clockmaker" as RoleId,DREAMER_ACTION:"dreamer" as RoleId,SEAMSTRESS_ACTION:"seamstress" as RoleId,MATHEMATICIAN_INFORMATION:"mathematician" as RoleId};
const taskFor = (state: GameState, id: unknown): ScheduledTask | undefined => state.firstNightTaskPlan?.tasks.find((t)=>t.taskId===id);
const sourceFor = (task: ScheduledTask, payload: Record<string,unknown>): {playerId:PlayerId;seatNumber:SeatNumber;roleId:RoleId}|undefined => {
  if(task.source.kind==="SYSTEM")return undefined; const role = task.source.kind==="ROLE"?task.source.role:task.source.chosenRole;
  return {playerId:(payload.sourcePlayerId??task.source.playerId) as PlayerId,seatNumber:(payload.sourceSeatNumber??task.source.seatNumber) as SeatNumber,roleId:role.roleId};
};
const roleEvidenceFor=(state:GameState,playerIdValue:PlayerId,revision:number):PlayerRoleAtRevisionEvidence=>{
  const entry=state.currentCharacterState?.entries.find((candidate)=>candidate.playerId===playerIdValue);
  if(entry===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Player role evidence requires one current character entry");
  return {kind:"PLAYER_ROLE_AT_REVISION",playerId:entry.playerId,seatNumber:entry.seatNumber,roleId:entry.role.roleId,characterType:entry.role.characterType,defaultAlignment:entry.role.defaultAlignment,characterStateRevision:revision};
};
const opportunityEvidenceFor=(state:GameState,opportunityIdValue:unknown,task:ScheduledTask,source:{playerId:PlayerId;seatNumber:SeatNumber}):ActionOpportunityEvidence=>{
  const opportunity=state.firstNightActionOpportunities?.opportunities.find((candidate)=>candidate.opportunityId===opportunityIdValue);
  if(opportunity===undefined||opportunity.taskId!==task.taskId||opportunity.sourcePlayerId!==source.playerId||opportunity.sourceSeatNumber!==source.seatNumber)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Terminal outcome requires one matching action opportunity");
  return {kind:"ACTION_OPPORTUNITY",opportunityId:opportunity.opportunityId,taskId:task.taskId,sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber};
};
const impairmentEvidenceFor=(state:GameState,impairmentIdValue:unknown,source:{playerId:PlayerId;seatNumber:SeatNumber;roleId:RoleId}):AbilityImpairmentEvidence=>{
  const impairment=state.abilityImpairments?.impairments.find((candidate)=>candidate.impairmentId===impairmentIdValue);
  if(impairment===undefined||impairment.affectedPlayerId!==source.playerId)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Ineffective outcome requires one matching impairment");
  return {kind:"ABILITY_IMPAIRMENT",impairmentId:impairment.impairmentId,impairmentKind:impairment.kind,affectedPlayerId:impairment.affectedPlayerId,affectedSeatNumber:impairment.affectedSeatNumber,affectedRoleId:impairment.affectedRole.roleId,sourceKind:impairment.sourceKind,appliedCharacterStateRevision:impairment.sourceCharacterStateRevision};
};
const instanceFor=(task:ScheduledTask,source:{playerId:PlayerId;seatNumber:SeatNumber;roleId:RoleId},state:GameState):FirstNightAbilityInstanceProvenance=>{
  if(task.source.kind==="PHILOSOPHER_GAINED_ABILITY") {
    const gainedSource=task.source;
    const insertion=state.firstNightTaskInsertions?.insertions.find((i)=>i.taskId===task.taskId) as unknown as Record<string,unknown>|undefined;
    const grantId=(insertion?.grantId??state.philosopherGrantedAbilities?.abilities.find((g)=>g.grantedAtOpportunityId===gainedSource.opportunityId)?.grantId) as GrantedAbilityId|undefined;
    if(grantId!==undefined){
      const common={provenanceVersion:"first-night-ability-instance-provenance-v1" as const,abilityRoleId:source.roleId,taskId:task.taskId,sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber,philosopherOpportunityId:gainedSource.opportunityId,grantId,sourceCharacterStateRevision:gainedSource.sourceCharacterStateRevision};
      if(state.firstNightTaskPlan?.taskPlanVersion==="first-night-task-plan-v2")return {...common,kind:"PHILOSOPHER_GAINED_TASK_V2",abilityInstanceId:formatPhilosopherGainedV2AbilityInstanceId({taskId:task.taskId,grantId}),schedulingVersion:"philosopher-gained-first-night-scheduling-v2"};
      return {...common,kind:"PHILOSOPHER_GAINED_TASK_V1",abilityInstanceId:formatPhilosopherGainedV1AbilityInstanceId({taskId:task.taskId,grantId})};
    }
  }
  return {provenanceVersion:"first-night-ability-instance-provenance-v1",kind:"BASE_ROLE_TASK",abilityInstanceId:formatBaseFirstNightAbilityInstanceId(task.taskId),abilityRoleId:source.roleId,taskId:task.taskId,sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber};
};
export const deriveFirstNightAbilityOutcomeFact=(input:{readonly stateBefore:GameState;readonly event:AnyDomainEventEnvelope}):FirstNightAbilityOutcomeFact|undefined=>{
  if(!terminalTypes.has(input.event.eventType as TerminalAbilityOutcomeEventType))return undefined; const p=input.event.payload as unknown as Record<string,unknown>; const task=taskFor(input.stateBefore,p.taskId); if(task===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Terminal outcome requires one canonical task"); const source=sourceFor(task,p); if(source===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeFact","Terminal outcome requires a role source"); const instance=instanceFor(task,source,input.stateBefore);
  let status:AbilityOutcomeStatus="NORMAL",cause:AbilityOutcomeCause="NO_OTHER_CHARACTER_ABILITY",caused=false;
  if(input.event.eventType==="WitchIneffectiveResolved"){status="PENDING_TRIGGER";cause=p.sourceImpairmentKind==="POISONED"?"SOURCE_POISONING":"SOURCE_DRUNKENNESS";caused=true;}
  else if(input.event.eventType==="SnakeCharmerIneffectiveResolved"){status="ABNORMAL";cause=p.sourceImpairmentKind==="POISONED"?"SOURCE_POISONING":"SOURCE_DRUNKENNESS";caused=true;}
  else if(input.event.eventType==="ClockmakerInformationDelivered"&&p.informationReliability==="DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"){status="ABNORMAL";cause="SOURCE_DRUNKENNESS";caused=true;}
  else if(input.event.eventType==="ClockmakerInformationDelivered"&&p.informationReliability==="VORTOX_CONSTRAINED_FALSE"){status="ABNORMAL";cause="VORTOX_FALSE_INFORMATION";caused=true;}
  else if(input.event.eventType==="SeamstressInformationDelivered"&&p.informationReliability==="VORTOX_CONSTRAINED_FALSE"){status="ABNORMAL";cause="VORTOX_FALSE_INFORMATION";caused=true;}
  else if(input.event.eventType==="DreamerInformationDelivered"&&plain(p.informationReliability)&&p.informationReliability.kind==="SOURCE_IMPAIRED"){
    const target=input.stateBefore.currentCharacterState?.entries.find((entry)=>entry.playerId===p.targetPlayerId);const good=p.goodRole as Record<string,unknown>;const evil=p.evilRole as Record<string,unknown>;if(target===undefined||target.role.roleId!==good.roleId&&target.role.roleId!==evil.roleId){status="ABNORMAL";cause=p.informationReliability.sourceImpairmentKind==="POISONED"?"SOURCE_POISONING":"SOURCE_DRUNKENNESS";caused=true;}
  }
  const revision=input.stateBefore.currentCharacterState?.revision??1;
  const evidence:AbilityOutcomeEvidenceReference[]=[{kind:"SOURCE_EVENT",eventId:input.event.eventId,eventType:input.event.eventType as TerminalAbilityOutcomeEventType,eventSequence:input.event.eventSequence,batchId:input.event.batchId},{kind:"TASK",taskId:task.taskId,taskType:task.taskType},{kind:"CHARACTER_STATE",characterStateRevision:revision},roleEvidenceFor(input.stateBefore,source.playerId,revision)];
  if(p.opportunityId!==undefined)evidence.push(opportunityEvidenceFor(input.stateBefore,p.opportunityId,task,source));
  if(p.sourceImpairmentId!==undefined)evidence.push(impairmentEvidenceFor(input.stateBefore,p.sourceImpairmentId,source));
  if(input.event.eventType==="ClockmakerInformationDelivered"&&plain(p.sourceEffectiveness)&&isDenseCanonicalArray(p.sourceEffectiveness.representedImpairmentIds))for(const id of p.sourceEffectiveness.representedImpairmentIds)evidence.push(impairmentEvidenceFor(input.stateBefore,id,source));
  if(input.event.eventType==="SeamstressInformationDelivered"&&plain(p.sourceEffectiveness)&&isDenseCanonicalArray(p.sourceEffectiveness.representedImpairments))for(const represented of p.sourceEffectiveness.representedImpairments)if(plain(represented))evidence.push(impairmentEvidenceFor(input.stateBefore,represented.impairmentId,source));
  if(input.event.eventType==="DreamerInformationDelivered"&&plain(p.informationReliability)&&p.informationReliability.kind==="SOURCE_IMPAIRED")evidence.push(impairmentEvidenceFor(input.stateBefore,p.informationReliability.sourceImpairmentId,source));
  if(instance.kind==="PHILOSOPHER_GAINED_TASK_V1"||instance.kind==="PHILOSOPHER_GAINED_TASK_V2"){
    const grant=input.stateBefore.philosopherGrantedAbilities?.abilities.find((candidate)=>candidate.grantId===instance.grantId);
    const insertion=input.stateBefore.firstNightTaskInsertions?.insertions.find((candidate)=>candidate.taskId===task.taskId) as unknown as Record<string,unknown>|undefined;
    if(grant===undefined||insertion===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Gained instance requires grant and insertion evidence");
    evidence.push({kind:"PHILOSOPHER_GRANT",grantId:grant.grantId,philosopherOpportunityId:grant.grantedAtOpportunityId,sourcePlayerId:grant.sourcePlayerId,sourceSeatNumber:grant.sourceSeatNumber,chosenRoleId:grant.chosenRoleId,sourceCharacterStateRevision:grant.sourceCharacterStateRevision});
    evidence.push({kind:"FIRST_NIGHT_TASK_INSERTION",taskId:task.taskId,philosopherOpportunityId:grant.grantedAtOpportunityId,sourcePlayerId:grant.sourcePlayerId,sourceSeatNumber:grant.sourceSeatNumber,chosenRoleId:grant.chosenRoleId,generation:instance.kind==="PHILOSOPHER_GAINED_TASK_V2"?{kind:"V2",taskPlanVersion:"first-night-task-plan-v2",grantId:grant.grantId,schedulingVersion:"philosopher-gained-first-night-scheduling-v2"}:{kind:"V1",taskPlanVersion:"first-night-task-plan-v1"}});
  }
  if(input.event.eventType.startsWith("SnakeCharmer")){
    const targetId=p.targetPlayerId as PlayerId;evidence.push(roleEvidenceFor(input.stateBefore,targetId,revision));const target=roleEvidenceFor(input.stateBefore,targetId,revision);
    evidence.push({kind:"SNAKE_CHARMER_RESOLUTION",resolutionKind:input.event.eventType==="SnakeCharmerDemonSwapApplied"?"DEMON_HIT_SWAP":input.event.eventType==="SnakeCharmerIneffectiveResolved"?"INEFFECTIVE_NO_SWAP":"NON_DEMON_NO_SWAP",taskId:task.taskId,opportunityId:p.opportunityId as ActionOpportunityId,targetPlayerId:target.playerId,targetSeatNumber:target.seatNumber,targetRoleIdAtResolution:target.roleId,resolutionEventId:input.event.eventId});
  } else if(input.event.eventType==="EvilTwinInformationDelivered"){
    const pair=input.stateBefore.evilTwinPairs?.pairs.find((candidate)=>candidate.pairId===p.pairId);if(pair===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Evil Twin delivery requires pair evidence");evidence.push(roleEvidenceFor(input.stateBefore,pair.evilTwinPlayer.playerId,revision),roleEvidenceFor(input.stateBefore,pair.goodTwinPlayer.playerId,revision),{kind:"EVIL_TWIN_PAIR",pairId:pair.pairId,evilTwinPlayerId:pair.evilTwinPlayer.playerId,goodTwinPlayerId:pair.goodTwinPlayer.playerId,establishedTaskId:pair.taskId,informationDeliveryEventId:input.event.eventId});
  } else if(input.event.eventType==="WitchDeathPendingMarked"){
    evidence.push(roleEvidenceFor(input.stateBefore,p.targetPlayerId as PlayerId,revision),{kind:"WITCH_PENDING_MARKER",pendingDeathId:p.pendingDeathId as string,sourcePlayerId:source.playerId,targetPlayerId:p.targetPlayerId as PlayerId,taskId:task.taskId,opportunityId:p.opportunityId as ActionOpportunityId,terminalEventId:input.event.eventId});
  } else if(input.event.eventType==="WitchIneffectiveResolved") evidence.push(roleEvidenceFor(input.stateBefore,p.targetPlayerId as PlayerId,revision));
  else if(input.event.eventType==="CerenovusMadnessInstructionDelivered"){
    const choice=input.stateBefore.cerenovusChoices?.choices.find((candidate)=>candidate.choiceId===p.choiceId);if(choice===undefined)throw new DomainError("InvalidFirstNightAbilityOutcomeEvidence","Cerenovus instruction requires choice evidence");evidence.push(roleEvidenceFor(input.stateBefore,p.recipientPlayerId as PlayerId,revision),{kind:"CERENOVUS_INSTRUCTION",deliveryId:p.deliveryId as string,choiceId:p.choiceId as string,markerId:p.markerId as string,sourcePlayerId:source.playerId,targetPlayerId:p.recipientPlayerId as PlayerId,chosenRoleId:p.madAboutRoleId as RoleId,taskId:task.taskId,terminalEventId:input.event.eventId});
  } else if(input.event.eventType==="ClockmakerInformationDelivered") evidence.push({kind:"CLOCKMAKER_DELIVERY",deliveryId:p.deliveryId as string,taskId:task.taskId,sourcePlayerId:source.playerId,ruleCorrectDistance:p.ruleCorrectDistance as number,selectedDistance:p.selectedDistance as number,terminalEventId:input.event.eventId});
  else if(input.event.eventType==="DreamerInformationDelivered") evidence.push(roleEvidenceFor(input.stateBefore,p.targetPlayerId as PlayerId,revision),{kind:"DREAMER_DELIVERY",taskId:task.taskId,opportunityId:p.opportunityId as ActionOpportunityId,sourcePlayerId:source.playerId,targetPlayerId:p.targetPlayerId as PlayerId,deliveredGoodRoleId:(p.goodRole as Record<string,unknown>).roleId as RoleId,deliveredEvilRoleId:(p.evilRole as Record<string,unknown>).roleId as RoleId,terminalEventId:input.event.eventId});
  else if(input.event.eventType==="SeamstressInformationDelivered"){
    const targets=p.targetPlayerIds as readonly [PlayerId,PlayerId];const comparison=p.comparison as Record<string,unknown>;evidence.push(roleEvidenceFor(input.stateBefore,targets[0],revision),roleEvidenceFor(input.stateBefore,targets[1],revision),{kind:"SEAMSTRESS_DELIVERY",taskId:task.taskId,opportunityId:p.opportunityId as ActionOpportunityId,sourcePlayerId:source.playerId,firstTargetPlayerId:targets[0],secondTargetPlayerId:targets[1],ruleCorrectAnswer:comparison.ruleCorrectAnswer as "YES"|"NO",deliveredAnswer:p.deliveredAnswer as "YES"|"NO",terminalEventId:input.event.eventId});
  }
  const fact:FirstNightAbilityOutcomeFact={auditFactId:formatFirstNightAbilityOutcomeFactId(input.event.eventId),auditModelVersion:FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,windowVersion:FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION,sourcePlayerId:source.playerId,sourceSeatNumber:source.seatNumber,abilityRoleId:source.roleId,abilityTaskId:task.taskId,abilityInstance:instance,sourceEventId:input.event.eventId,sourceBatchId:input.event.batchId,sourceEventSequence:input.event.eventSequence,evaluatedCharacterStateRevision:input.stateBefore.currentCharacterState?.revision??1,outcomeStatus:status,causeKind:cause,causedByAnotherCharacterAbility:caused,evidenceReferences:canonicalizeAbilityOutcomeEvidenceReferences(evidence),detectedAtEventSequence:input.event.eventSequence}; return fact;
};
export const applyFirstNightAbilityOutcomeLedger=(stateBefore:GameState|undefined,event:AnyDomainEventEnvelope,next:GameState):GameState=>{
  if(event.eventType==="FirstNightInitialized")return {...next,firstNightAbilityOutcomeLedger:{ledgerVersion:FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION,auditModelVersion:FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,windowAnchor:{windowVersion:FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION,gameId:event.gameId,nightNumber:1,rulesBaselineVersion:event.rulesBaselineVersion,firstNightInitializedEventId:event.eventId,startEventSequence:event.eventSequence,startBoundary:"EXCLUSIVE"},facts:[]}};
  if(stateBefore===undefined||stateBefore.firstNightAbilityOutcomeLedger===undefined)return next; const fact=deriveFirstNightAbilityOutcomeFact({stateBefore,event}); if(fact===undefined)return next; return {...next,firstNightAbilityOutcomeLedger:{...stateBefore.firstNightAbilityOutcomeLedger,facts:[...stateBefore.firstNightAbilityOutcomeLedger.facts,fact]}};
};

export const resolveFirstNightMathematicianTrueCountFromState=(stateBeforeResolution:unknown):MathematicianCountResolution=>{
  if(!plain(stateBeforeResolution))throw new DomainError("InvalidMathematicianCountResolutionInput","State must be canonical"); const state=stateBeforeResolution as unknown as GameState; const ledger=state.firstNightAbilityOutcomeLedger; if(ledger===undefined||!validateFirstNightAbilityOutcomeLedger(ledger).valid||state.firstNightTaskPlan===undefined)throw new DomainError("InvalidMathematicianCountResolutionInput","State requires a valid outcome ledger and task plan"); const task=getNextUnsettledFirstNightTask(state.firstNightTaskPlan,state.firstNightTaskProgress); if(task?.taskType!=="MATHEMATICIAN_INFORMATION"||task.source.kind==="SYSTEM")throw new DomainError("InvalidResolvingMathematicianContext","Next unsettled task must be Mathematician information"); const source={playerId:task.source.playerId,seatNumber:task.source.seatNumber,roleId:roleForTask.MATHEMATICIAN_INFORMATION}; const instance=instanceFor(task,source,state); const window={...ledger.windowAnchor,endEventSequence:state.lastEventSequence,endBoundary:"INCLUSIVE" as const};
  const qualifying:FirstNightAbilityOutcomeFact[]=[];const own:FirstNightAbilityOutcomeFactId[]=[];const future:FirstNightAbilityOutcomeFactId[]=[];const normal:FirstNightAbilityOutcomeFactId[]=[];const pending:FirstNightAbilityOutcomeFactId[]=[];const unresolved:MathematicianCountUnresolvedFact[]=[];
  for(const fact of ledger.facts){if(fact.sourceEventSequence>state.lastEventSequence){future.push(fact.auditFactId);continue;}if(fact.sourcePlayerId===source.playerId&&sameCanonicalDataValue(fact.abilityInstance,instance)){own.push(fact.auditFactId);continue;}if(fact.outcomeStatus==="NORMAL"){normal.push(fact.auditFactId);continue;}if(fact.outcomeStatus==="PENDING_TRIGGER"){pending.push(fact.auditFactId);continue;}if(fact.outcomeStatus==="UNRESOLVED"){unresolved.push({auditFactId:fact.auditFactId,sourcePlayerId:fact.sourcePlayerId,sourceSeatNumber:fact.sourceSeatNumber,abilityRoleId:fact.abilityRoleId,abilityTaskId:fact.abilityTaskId,causeKind:fact.causeKind});continue;}qualifying.push(fact);}
  const players=new Map<PlayerId,MathematicianCountDistinctPlayer>();for(const fact of qualifying){const old=players.get(fact.sourcePlayerId);players.set(fact.sourcePlayerId,{playerId:fact.sourcePlayerId,seatNumber:fact.sourceSeatNumber,supportingFactIds:[...(old?.supportingFactIds??[]),fact.auditFactId]});}const distinct=[...players.values()].sort((a,b)=>a.seatNumber-b.seatNumber||(a.playerId<b.playerId?-1:a.playerId>b.playerId?1:0));const common:CountCommon={resolutionModelVersion:FIRST_NIGHT_MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION,window,resolvingSourcePlayerId:source.playerId,resolvingAbilityInstanceId:instance.abilityInstanceId,evaluatedThroughEventSequence:state.lastEventSequence,qualifyingAbnormalFactIds:qualifying.map((f)=>f.auditFactId),distinctAbnormalPlayers:distinct,excludedOwnFactIds:own,ignoredFutureFactIds:future,ignoredNormalFactIds:normal,ignoredPendingFactIds:pending,redundantUnresolvedFactIds:[]};return unresolved.length===0?{...common,status:"RESOLVED",trueCount:distinct.length}:{...common,status:"UNRESOLVED",unresolvedFacts:unresolved,currentPartialCount:distinct.length};
};
export const validateMathematicianCountResolution=(value:unknown):OutcomeLedgerValidationResult=>plain(value)&&isCanonicalDataValue(value)&&(value.status==="RESOLVED"||value.status==="UNRESOLVED")?{valid:true}:fail("Invalid Mathematician count resolution");
export const cloneMathematicianCountResolution=(value:MathematicianCountResolution):MathematicianCountResolution=>clone(value);
