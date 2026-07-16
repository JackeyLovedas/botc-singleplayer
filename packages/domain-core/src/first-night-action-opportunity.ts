import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import { isCanonicalDataValue } from "./canonical-data.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import { DomainError } from "./errors.js";
import {
  SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  getNextUnsettledFirstNightTask,
  isFirstNightTaskSettled,
  roleScheduledTaskId
} from "./first-night-task-plan.js";
import {
  formatBaseFirstNightAbilityInstanceId,
  parseFirstNightAbilityInstanceId
} from "./first-night-ability-outcome-ledger.js";
import type { FirstNightAbilityInstanceId } from "./first-night-ability-outcome-ledger.js";
import type {
  FirstNightTaskPlan,
  FirstNightTaskProgress,
  FirstNightTaskType,
  ScheduledTask,
  ScheduledTaskSettlement
} from "./first-night-task-plan.js";
import { actionOpportunityId } from "./ids.js";
import type {
  AbilityInstanceId,
  AbilityUseEntitlementId,
  ActionOpportunityId,
  GrantedAbilityId,
  PlayerId,
  RoleId,
  RoleTenureId,
  ScheduledTaskId
} from "./ids.js";
import {
  hasExactEnumerableKeys,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord
} from "./initial-private-knowledge.js";
import type { SeatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";
import type { GrantedAbilitySet } from "./philosopher-ability.js";
import type {
  RoleTenureState,
  SeamstressAbilitySourceDescriptor,
  SeamstressAbilityState,
  SeamstressResolutionCapabilityDeclaredPayload
} from "./seamstress.js";
import { formatCerenovusAbilityInstanceId, parseCerenovusAbilityInstanceId } from "./cerenovus.js";
import type { CerenovusAbilitySourceDescriptor } from "./cerenovus.js";
import {
  findActiveSeamstressAbilityForSource,
  findUniqueActiveRoleTenure,
  isRoleTenureContinuousAcross,
  parseRoleTenureId,
  parseSeamstressAbilityInstanceId,
  parseSeamstressAbilityUseEntitlementId,
  SEAMSTRESS_RESOLUTION_CAPABILITY_VERSION
} from "./seamstress.js";

export type ActionOpportunityStatus = "OPEN" | "CLOSED";
export type ActionOpportunityKind =
  | "PHILOSOPHER_FIRST_NIGHT_ACTION"
  | "SNAKE_CHARMER_FIRST_NIGHT_ACTION"
  | "WITCH_FIRST_NIGHT_ACTION"
  | "CERENOVUS_FIRST_NIGHT_ACTION"
  | "DREAMER_FIRST_NIGHT_ACTION"
  | "DREAMER_FIRST_NIGHT_ACTION_V2"
  | "DREAMER_FIRST_NIGHT_ACTION_V3"
  | "SEAMSTRESS_FIRST_NIGHT_ACTION";
export type PhilosopherActionDecisionKind = "DEFER" | "CHOOSE_GOOD_CHARACTER";
export type SnakeCharmerActionDecisionKind = "CHOOSE_PLAYER";
export type WitchActionDecisionKind = "CHOOSE_PLAYER";
export type DreamerActionDecisionKind = "CHOOSE_PLAYER";
export type CerenovusActionDecisionKind = "CHOOSE_PLAYER_AND_CHARACTER";
export type SeamstressActionDecisionKind = "DEFER" | "CHOOSE_TWO_PLAYERS";

export type PhilosopherActionDecision =
  | {
      readonly kind: "DEFER";
    }
  | {
      readonly kind: "CHOOSE_GOOD_CHARACTER";
      readonly roleId: RoleId;
    };

export type SeamstressActionDecision =
  | { readonly kind: "DEFER" }
  | { readonly kind: "CHOOSE_TWO_PLAYERS"; readonly targetPlayerIds: readonly [PlayerId, PlayerId] };

export type PhilosopherActionOpportunityVisibility = {
  readonly canDefer: true;
  readonly supportedDecisionKinds: readonly ["DEFER", "CHOOSE_GOOD_CHARACTER"];
  readonly futureUnsupportedDecisionKinds: readonly [];
};

export type SnakeCharmerActionOpportunityVisibility = {
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly targetSchema: "ANY_LIVING_PLAYER";
};

export type WitchActionOpportunityVisibility = {
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly targetSchema: "ANY_PLAYER";
};

export const DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION =
  "dreamer-first-night-action-opportunity-v2" as const;
export const DREAMER_V2_VISIBILITY_SCHEMA_VERSION =
  "dreamer-first-night-action-visibility-v2" as const;
export const DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION =
  "dreamer-first-night-action-opportunity-v3" as const;
export const DREAMER_V3_VISIBILITY_SCHEMA_VERSION =
  "dreamer-first-night-action-visibility-v3" as const;
export const DREAMER_BASE_SOURCE_CONTRACT_VERSION =
  "dreamer-base-source-contract-v1" as const;
export type DreamerActionOpportunityVisibilityV1 = {
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly targetSchema: "OTHER_NON_TRAVELLER_PLAYER";
};

export type DreamerActionOpportunityVisibilityV2 = {
  readonly visibilitySchemaVersion: typeof DREAMER_V2_VISIBILITY_SCHEMA_VERSION;
  readonly canChooseTarget: false;
  readonly supportedDecisionKinds: readonly [];
  readonly futureUnsupportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly futureTargetSchema: "OTHER_NON_TRAVELLER_PLAYER";
};

export type DreamerActionOpportunityVisibilityV3 = {
  readonly visibilitySchemaVersion: typeof DREAMER_V3_VISIBILITY_SCHEMA_VERSION;
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly futureUnsupportedDecisionKinds: readonly [];
  readonly targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER";
};

export type DreamerActionOpportunityVisibility =
  | DreamerActionOpportunityVisibilityV1
  | DreamerActionOpportunityVisibilityV2
  | DreamerActionOpportunityVisibilityV3;

export type CerenovusActionOpportunityVisibility = {
  readonly canChooseTarget: true;
  readonly canChooseCharacter: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER_AND_CHARACTER"];
  readonly targetSchema: "ANY_MODELED_ROSTER_PLAYER";
  readonly characterSchema: "ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER";
};

export type SeamstressActionOpportunityVisibilityV1 = {
  readonly canDefer: true;
  readonly supportedDecisionKinds: readonly ["DEFER"];
  readonly futureUnsupportedDecisionKinds: readonly ["CHOOSE_TWO_PLAYERS"];
};

export type SeamstressActionOpportunityVisibilityV2 = {
  readonly visibilitySchemaVersion: "seamstress-first-night-action-v2";
  readonly resolutionCapabilityVersion: typeof SEAMSTRESS_RESOLUTION_CAPABILITY_VERSION;
  readonly canDefer: true;
  readonly canChooseTargets: true;
  readonly supportedDecisionKinds: readonly ["DEFER", "CHOOSE_TWO_PLAYERS"];
  readonly futureUnsupportedDecisionKinds: readonly [];
  readonly targetSchema: "EXACTLY_TWO_DISTINCT_OTHER_MODELED_PLAYERS";
};

export type SeamstressActionOpportunityVisibility =
  | SeamstressActionOpportunityVisibilityV1
  | SeamstressActionOpportunityVisibilityV2;

export type ActionOpportunityVisibility =
  | PhilosopherActionOpportunityVisibility
  | SnakeCharmerActionOpportunityVisibility
  | WitchActionOpportunityVisibility
  | CerenovusActionOpportunityVisibility
  | DreamerActionOpportunityVisibility
  | SeamstressActionOpportunityVisibility;

export type PhilosopherActionOpportunitySource = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: "PHILOSOPHER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
};

export type SnakeCharmerActionOpportunitySource = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SNAKE_CHARMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
};

export type WitchActionOpportunitySource = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: "WITCH_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
};

export type DreamerActionOpportunitySource = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
};

export type CerenovusActionOpportunitySource = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: "CERENOVUS_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
};

export type SeamstressActionOpportunitySource = {
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SEAMSTRESS_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
};

export type PhilosopherActionOpportunity = PhilosopherActionOpportunitySource & {
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly visibility: PhilosopherActionOpportunityVisibility;
};

export type SnakeCharmerActionOpportunity = SnakeCharmerActionOpportunitySource & {
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly visibility: SnakeCharmerActionOpportunityVisibility;
};

export type WitchActionOpportunity = WitchActionOpportunitySource & {
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "WITCH_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly visibility: WitchActionOpportunityVisibility;
};

export type BaseDreamerV2SourceContract = {
  readonly sourceContractVersion: typeof DREAMER_BASE_SOURCE_CONTRACT_VERSION;
  readonly kind: "BASE";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRoleId: "dreamer";
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceCharacterStateRevision: number;
  readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
};

export type DreamerActionOpportunityV1 = DreamerActionOpportunitySource & {
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly visibility: DreamerActionOpportunityVisibilityV1;
};

export type DreamerActionOpportunityV2 = DreamerActionOpportunitySource & {
  readonly opportunitySchemaVersion: typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V2";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly visibility: DreamerActionOpportunityVisibilityV2;
};

export type DreamerActionOpportunityV3 = DreamerActionOpportunitySource & {
  readonly opportunitySchemaVersion: typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V3";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly visibility: DreamerActionOpportunityVisibilityV3;
};

export type DreamerActionOpportunity =
  | DreamerActionOpportunityV1
  | DreamerActionOpportunityV2
  | DreamerActionOpportunityV3;

export type CerenovusActionOpportunity = CerenovusActionOpportunitySource & {
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "CERENOVUS_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceAbilityInstanceId: AbilityInstanceId;
  readonly abilitySource: CerenovusAbilitySourceDescriptor;
  readonly visibility: CerenovusActionOpportunityVisibility;
};

export type SeamstressActionOpportunityCommon = SeamstressActionOpportunitySource & {
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: ActionOpportunityStatus;
};

export type SeamstressActionOpportunityV1 = SeamstressActionOpportunityCommon & {
  readonly visibility: SeamstressActionOpportunityVisibilityV1;
};

export type SeamstressActionOpportunityV2 = SeamstressActionOpportunityCommon & {
  readonly sourceRoleTenureId: RoleTenureId;
  readonly abilitySource: SeamstressAbilitySourceDescriptor;
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly visibility: SeamstressActionOpportunityVisibilityV2;
};

export type SeamstressActionOpportunity = SeamstressActionOpportunityV1 | SeamstressActionOpportunityV2;

export type FirstNightActionOpportunity =
  | PhilosopherActionOpportunity
  | SnakeCharmerActionOpportunity
  | WitchActionOpportunity
  | CerenovusActionOpportunity
  | DreamerActionOpportunity
  | SeamstressActionOpportunity;

export type FirstNightActionOpportunityState = {
  readonly opportunities: readonly FirstNightActionOpportunity[];
};

export type FirstNightActionOpportunityCreatedPayload = FirstNightActionOpportunity & {
  readonly rulesBaselineVersion: string;
};

export type PhilosopherActionDeferredPayload = PhilosopherActionOpportunitySource & {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly decisionKind: "DEFER";
};

export type SeamstressActionDeferredPayloadV1 = SeamstressActionOpportunitySource & {
  readonly rulesBaselineVersion: string;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly decisionKind: "DEFER";
};

export type SeamstressActionDeferredPayloadV2 = {
  readonly rulesBaselineVersion: string;
  readonly deferSchemaVersion: "seamstress-action-deferred-v2";
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "SEAMSTRESS_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly decisionKind: "DEFER";
  readonly abilityInstanceId: AbilityInstanceId;
  readonly abilityUseEntitlementId: AbilityUseEntitlementId;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly opportunityCharacterStateRevision: number;
  readonly settlementCharacterStateRevision: number;
};

export type SeamstressActionDeferredPayload = SeamstressActionDeferredPayloadV1 | SeamstressActionDeferredPayloadV2;

type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

export type SeamstressActionDecisionValidationResult =
  | { readonly valid: true }
  | {
      readonly valid: false;
      readonly code: "InvalidSeamstressActionDecision" | "InvalidSeamstressTarget" | "UnsupportedSeamstressActionDecision";
      readonly reason: string;
    };

type OpportunityValidationInput = {
  readonly taskId: ScheduledTaskId;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState | undefined;
  readonly seamstressResolutionCapability?: SeamstressResolutionCapabilityDeclaredPayload | undefined;
  readonly seamstressRoleTenureState?: RoleTenureState | undefined;
  readonly seamstressAbilityState?: SeamstressAbilityState | undefined;
  readonly philosopherGrantedAbilities?: GrantedAbilitySet | undefined;
};

type CreateOpportunityResult =
  | { readonly valid: true; readonly opportunity: FirstNightActionOpportunity }
  | { readonly valid: false; readonly reason: string };
type CreatePhilosopherOpportunityResult =
  | { readonly valid: true; readonly opportunity: PhilosopherActionOpportunity }
  | { readonly valid: false; readonly reason: string };
type CreateSnakeCharmerOpportunityResult =
  | { readonly valid: true; readonly opportunity: SnakeCharmerActionOpportunity }
  | { readonly valid: false; readonly reason: string };
type CreateWitchOpportunityResult =
  | { readonly valid: true; readonly opportunity: WitchActionOpportunity }
  | { readonly valid: false; readonly reason: string };
type CreateCerenovusOpportunityResult =
  | { readonly valid: true; readonly opportunity: CerenovusActionOpportunity }
  | { readonly valid: false; readonly reason: string };
type CreateDreamerOpportunityResult =
  | { readonly valid: true; readonly opportunity: DreamerActionOpportunity }
  | { readonly valid: false; readonly reason: string };
type CreateSeamstressOpportunityResult =
  | { readonly valid: true; readonly opportunity: SeamstressActionOpportunity }
  | { readonly valid: false; readonly reason: string };

const PHILOSOPHER_ACTION_OPPORTUNITY_VISIBILITY_KEYS = [
  "canDefer",
  "futureUnsupportedDecisionKinds",
  "supportedDecisionKinds"
] as const;
const SNAKE_CHARMER_ACTION_OPPORTUNITY_VISIBILITY_KEYS = [
  "canChooseTarget",
  "supportedDecisionKinds",
  "targetSchema"
] as const;
const WITCH_ACTION_OPPORTUNITY_VISIBILITY_KEYS = [
  "canChooseTarget",
  "supportedDecisionKinds",
  "targetSchema"
] as const;
const CERENOVUS_ACTION_OPPORTUNITY_VISIBILITY_KEYS = [
  "canChooseCharacter",
  "canChooseTarget",
  "characterSchema",
  "supportedDecisionKinds",
  "targetSchema"
] as const;
const DREAMER_ACTION_OPPORTUNITY_VISIBILITY_KEYS = [
  "canChooseTarget",
  "supportedDecisionKinds",
  "targetSchema"
] as const;
const DREAMER_V2_ACTION_OPPORTUNITY_VISIBILITY_KEYS = [
  "canChooseTarget",
  "futureTargetSchema",
  "futureUnsupportedDecisionKinds",
  "supportedDecisionKinds",
  "visibilitySchemaVersion"
] as const;
const DREAMER_V3_ACTION_OPPORTUNITY_VISIBILITY_KEYS = [
  "canChooseTarget",
  "futureUnsupportedDecisionKinds",
  "supportedDecisionKinds",
  "targetSchema",
  "visibilitySchemaVersion"
] as const;
const DREAMER_V2_SOURCE_CONTRACT_KEYS = [
  "kind",
  "sourceAbilityInstanceId",
  "sourceCharacterStateRevision",
  "sourceContractVersion",
  "sourcePlayerId",
  "sourceRoleId",
  "sourceRoleTenureId",
  "sourceSeatNumber",
  "taskId",
  "taskPlanVersion",
  "taskType"
] as const;
const SEAMSTRESS_ACTION_OPPORTUNITY_VISIBILITY_V1_KEYS = [
  "canDefer",
  "futureUnsupportedDecisionKinds",
  "supportedDecisionKinds"
] as const;
const SEAMSTRESS_ACTION_OPPORTUNITY_VISIBILITY_V2_KEYS = [
  "canChooseTargets",
  "canDefer",
  "futureUnsupportedDecisionKinds",
  "resolutionCapabilityVersion",
  "supportedDecisionKinds",
  "targetSchema",
  "visibilitySchemaVersion"
] as const;
const FIRST_NIGHT_ACTION_OPPORTUNITY_KEYS = [
  "nightNumber",
  "opportunityId",
  "opportunityKind",
  "opportunityStatus",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "taskId",
  "taskType",
  "visibility"
] as const;
const FIRST_NIGHT_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS = [
  "nightNumber",
  "opportunityId",
  "opportunityKind",
  "opportunityStatus",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "taskId",
  "taskType",
  "visibility"
] as const;
const DREAMER_V2_ACTION_OPPORTUNITY_KEYS = [
  "nightNumber",
  "opportunityId",
  "opportunityKind",
  "opportunitySchemaVersion",
  "opportunityStatus",
  "sourceCharacterStateRevision",
  "sourceContract",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "taskId",
  "taskType",
  "visibility"
] as const;
const DREAMER_V2_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS = [
  ...DREAMER_V2_ACTION_OPPORTUNITY_KEYS,
  "rulesBaselineVersion"
] as const;
const DREAMER_V3_ACTION_OPPORTUNITY_KEYS = DREAMER_V2_ACTION_OPPORTUNITY_KEYS;
const DREAMER_V3_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS = DREAMER_V2_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS;
const SEAMSTRESS_ACTION_OPPORTUNITY_V2_KEYS = [
  ...FIRST_NIGHT_ACTION_OPPORTUNITY_KEYS,
  "abilityInstanceId",
  "abilitySource",
  "abilityUseEntitlementId",
  "sourceRoleTenureId"
] as const;
const CERENOVUS_ACTION_OPPORTUNITY_KEYS = [
  ...FIRST_NIGHT_ACTION_OPPORTUNITY_KEYS,
  "abilitySource",
  "sourceAbilityInstanceId",
  "sourceRoleTenureId"
] as const;
const CERENOVUS_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS = [
  ...FIRST_NIGHT_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS,
  "abilitySource",
  "sourceAbilityInstanceId",
  "sourceRoleTenureId"
] as const;
const SEAMSTRESS_ACTION_OPPORTUNITY_CREATED_PAYLOAD_V2_KEYS = [
  ...FIRST_NIGHT_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS,
  "abilityInstanceId",
  "abilitySource",
  "abilityUseEntitlementId",
  "sourceRoleTenureId"
] as const;
const SEAMSTRESS_ROLE_TENURE_ABILITY_SOURCE_KEYS = [
  "abilityRoleId",
  "acquiredCharacterStateRevision",
  "kind",
  "roleTenureId"
] as const;
const SEAMSTRESS_PHILOSOPHER_GRANT_ABILITY_SOURCE_KEYS = [
  "abilityRoleId",
  "acquiredCharacterStateRevision",
  "grantId",
  "kind",
  "sourceRoleTenureId"
] as const;
const PHILOSOPHER_ACTION_DEFERRED_PAYLOAD_KEYS = [
  "decisionKind",
  "nightNumber",
  "opportunityId",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "taskId",
  "taskType"
] as const;
const SEAMSTRESS_ACTION_DEFERRED_PAYLOAD_V1_KEYS = [
  "decisionKind",
  "nightNumber",
  "opportunityId",
  "rulesBaselineVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceSeatNumber",
  "taskId",
  "taskType"
] as const;
const SEAMSTRESS_ACTION_DEFERRED_PAYLOAD_V2_KEYS = [
  "abilityInstanceId",
  "abilityUseEntitlementId",
  "decisionKind",
  "deferSchemaVersion",
  "nightNumber",
  "opportunityCharacterStateRevision",
  "opportunityId",
  "rulesBaselineVersion",
  "settlementCharacterStateRevision",
  "sourcePlayerId",
  "sourceRole",
  "sourceRoleTenureId",
  "sourceSeatNumber",
  "taskId",
  "taskType"
] as const;

const PHILOSOPHER_ROLE_ID = "philosopher" as RoleId;
const SNAKE_CHARMER_ROLE_ID = "snake_charmer" as RoleId;
const WITCH_ROLE_ID = "witch" as RoleId;
const CERENOVUS_ROLE_ID = "cerenovus" as RoleId;
const DREAMER_ROLE_ID = "dreamer" as RoleId;
const SEAMSTRESS_ROLE_ID = "seamstress" as RoleId;
const FIRST_NIGHT_ACTION_OPPORTUNITY_ID_PATTERN =
  /^first-night-v1:(?:(PHILOSOPHER_ACTION|SNAKE_CHARMER_ACTION|WITCH_ACTION|CERENOVUS_ACTION|DREAMER_ACTION|SEAMSTRESS_ACTION):seat-(0[1-9]|1[0-2]):opportunity-(0[1-9][0-9]*)|PHILOSOPHER_GAINED:(SNAKE_CHARMER_ACTION|SEAMSTRESS_ACTION):seat-(0[1-9]|1[0-2]):from-(snake_charmer|seamstress):opportunity-(0[1-9][0-9]*))$/;
const BASE_DREAMER_V2_ACTION_OPPORTUNITY_ID_PATTERN = /^first-night-v2:DREAMER_ACTION:seat-(0[1-9]|1[0-2]):opportunity-01$/;

const fail = (reason: string): ValidationResult => ({ valid: false, reason });

const createPhilosopherActionOpportunityVisibility = (): PhilosopherActionOpportunityVisibility => ({
  canDefer: true,
  supportedDecisionKinds: ["DEFER", "CHOOSE_GOOD_CHARACTER"],
  futureUnsupportedDecisionKinds: []
});

const createSnakeCharmerActionOpportunityVisibility = (): SnakeCharmerActionOpportunityVisibility => ({
  canChooseTarget: true,
  supportedDecisionKinds: ["CHOOSE_PLAYER"],
  targetSchema: "ANY_LIVING_PLAYER"
});

const createWitchActionOpportunityVisibility = (): WitchActionOpportunityVisibility => ({
  canChooseTarget: true,
  supportedDecisionKinds: ["CHOOSE_PLAYER"],
  targetSchema: "ANY_PLAYER"
});

const createCerenovusActionOpportunityVisibility = (): CerenovusActionOpportunityVisibility => ({
  canChooseTarget: true,
  canChooseCharacter: true,
  supportedDecisionKinds: ["CHOOSE_PLAYER_AND_CHARACTER"],
  targetSchema: "ANY_MODELED_ROSTER_PLAYER",
  characterSchema: "ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER"
});

const createDreamerActionOpportunityVisibility = (): DreamerActionOpportunityVisibilityV1 => ({
  canChooseTarget: true,
  supportedDecisionKinds: ["CHOOSE_PLAYER"],
  targetSchema: "OTHER_NON_TRAVELLER_PLAYER"
});

const createDreamerActionOpportunityVisibilityV2 = (): DreamerActionOpportunityVisibilityV2 => ({
  visibilitySchemaVersion: DREAMER_V2_VISIBILITY_SCHEMA_VERSION,
  canChooseTarget: false,
  supportedDecisionKinds: [],
  futureUnsupportedDecisionKinds: ["CHOOSE_PLAYER"],
  futureTargetSchema: "OTHER_NON_TRAVELLER_PLAYER"
});

const createDreamerActionOpportunityVisibilityV3 = (): DreamerActionOpportunityVisibilityV3 => ({
  visibilitySchemaVersion: DREAMER_V3_VISIBILITY_SCHEMA_VERSION,
  canChooseTarget: true,
  supportedDecisionKinds: ["CHOOSE_PLAYER"],
  futureUnsupportedDecisionKinds: [],
  targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER"
});

const createSeamstressActionOpportunityVisibilityV1 = (): SeamstressActionOpportunityVisibilityV1 => ({
  canDefer: true,
  supportedDecisionKinds: ["DEFER"],
  futureUnsupportedDecisionKinds: ["CHOOSE_TWO_PLAYERS"]
});

const createSeamstressActionOpportunityVisibilityV2 = (): SeamstressActionOpportunityVisibilityV2 => ({
  visibilitySchemaVersion: "seamstress-first-night-action-v2",
  resolutionCapabilityVersion: SEAMSTRESS_RESOLUTION_CAPABILITY_VERSION,
  canDefer: true,
  canChooseTargets: true,
  supportedDecisionKinds: ["DEFER", "CHOOSE_TWO_PLAYERS"],
  futureUnsupportedDecisionKinds: [],
  targetSchema: "EXACTLY_TWO_DISTINCT_OTHER_MODELED_PLAYERS"
});

const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      return false;
    }
  }

  return true;
};

const hasExactPhilosopherActionOpportunityVisibilityShape = (value: unknown): value is PhilosopherActionOpportunityVisibility =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, PHILOSOPHER_ACTION_OPPORTUNITY_VISIBILITY_KEYS) &&
  value.canDefer === true &&
  Array.isArray(value.supportedDecisionKinds) &&
  isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 2 &&
  value.supportedDecisionKinds[0] === "DEFER" &&
  value.supportedDecisionKinds[1] === "CHOOSE_GOOD_CHARACTER" &&
  Array.isArray(value.futureUnsupportedDecisionKinds) &&
  isDenseArray(value.futureUnsupportedDecisionKinds) &&
  value.futureUnsupportedDecisionKinds.length === 0;

const hasExactSnakeCharmerActionOpportunityVisibilityShape = (value: unknown): value is SnakeCharmerActionOpportunityVisibility =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, SNAKE_CHARMER_ACTION_OPPORTUNITY_VISIBILITY_KEYS) &&
  value.canChooseTarget === true &&
  Array.isArray(value.supportedDecisionKinds) &&
  isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 1 &&
  value.supportedDecisionKinds[0] === "CHOOSE_PLAYER" &&
  value.targetSchema === "ANY_LIVING_PLAYER";

const hasExactWitchActionOpportunityVisibilityShape = (value: unknown): value is WitchActionOpportunityVisibility =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, WITCH_ACTION_OPPORTUNITY_VISIBILITY_KEYS) &&
  value.canChooseTarget === true &&
  Array.isArray(value.supportedDecisionKinds) &&
  isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 1 &&
  value.supportedDecisionKinds[0] === "CHOOSE_PLAYER" &&
  value.targetSchema === "ANY_PLAYER";

const hasExactCerenovusActionOpportunityVisibilityShape = (value: unknown): value is CerenovusActionOpportunityVisibility =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, CERENOVUS_ACTION_OPPORTUNITY_VISIBILITY_KEYS) &&
  value.canChooseTarget === true && value.canChooseCharacter === true &&
  Array.isArray(value.supportedDecisionKinds) && isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 1 && value.supportedDecisionKinds[0] === "CHOOSE_PLAYER_AND_CHARACTER" &&
  value.targetSchema === "ANY_MODELED_ROSTER_PLAYER" &&
  value.characterSchema === "ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER";

const hasExactDreamerActionOpportunityVisibilityShape = (value: unknown): value is DreamerActionOpportunityVisibilityV1 =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, DREAMER_ACTION_OPPORTUNITY_VISIBILITY_KEYS) &&
  value.canChooseTarget === true &&
  Array.isArray(value.supportedDecisionKinds) &&
  isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 1 &&
  value.supportedDecisionKinds[0] === "CHOOSE_PLAYER" &&
  value.targetSchema === "OTHER_NON_TRAVELLER_PLAYER";

const hasExactDreamerActionOpportunityVisibilityV2Shape = (value: unknown): value is DreamerActionOpportunityVisibilityV2 =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, DREAMER_V2_ACTION_OPPORTUNITY_VISIBILITY_KEYS) &&
  value.visibilitySchemaVersion === DREAMER_V2_VISIBILITY_SCHEMA_VERSION &&
  value.canChooseTarget === false &&
  Array.isArray(value.supportedDecisionKinds) &&
  isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 0 &&
  Array.isArray(value.futureUnsupportedDecisionKinds) &&
  isDenseArray(value.futureUnsupportedDecisionKinds) &&
  value.futureUnsupportedDecisionKinds.length === 1 &&
  value.futureUnsupportedDecisionKinds[0] === "CHOOSE_PLAYER" &&
  value.futureTargetSchema === "OTHER_NON_TRAVELLER_PLAYER";

const hasExactDreamerActionOpportunityVisibilityV3Shape = (value: unknown): value is DreamerActionOpportunityVisibilityV3 =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, DREAMER_V3_ACTION_OPPORTUNITY_VISIBILITY_KEYS) &&
  value.visibilitySchemaVersion === DREAMER_V3_VISIBILITY_SCHEMA_VERSION &&
  value.canChooseTarget === true &&
  Array.isArray(value.supportedDecisionKinds) &&
  isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 1 &&
  value.supportedDecisionKinds[0] === "CHOOSE_PLAYER" &&
  Array.isArray(value.futureUnsupportedDecisionKinds) &&
  isDenseArray(value.futureUnsupportedDecisionKinds) &&
  value.futureUnsupportedDecisionKinds.length === 0 &&
  value.targetSchema === "OTHER_NON_TRAVELLER_MODELED_PLAYER";

const hasExactBaseDreamerV2SourceContractShape = (value: unknown): value is BaseDreamerV2SourceContract =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, DREAMER_V2_SOURCE_CONTRACT_KEYS) &&
  value.sourceContractVersion === DREAMER_BASE_SOURCE_CONTRACT_VERSION &&
  value.kind === "BASE" &&
  value.taskPlanVersion === "first-night-task-plan-v2" &&
  typeof value.taskId === "string" &&
  value.taskId.length > 0 &&
  value.taskType === "DREAMER_ACTION" &&
  typeof value.sourcePlayerId === "string" &&
  value.sourcePlayerId.length > 0 &&
  Number.isSafeInteger(value.sourceSeatNumber) &&
  (value.sourceSeatNumber as number) >= 1 &&
  (value.sourceSeatNumber as number) <= 12 &&
  value.sourceRoleId === "dreamer" &&
  typeof value.sourceRoleTenureId === "string" &&
  Number.isSafeInteger(value.sourceCharacterStateRevision) &&
  (value.sourceCharacterStateRevision as number) > 0 &&
  typeof value.sourceAbilityInstanceId === "string";

const hasExactSeamstressActionOpportunityVisibilityV1Shape = (value: unknown): value is SeamstressActionOpportunityVisibilityV1 =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, SEAMSTRESS_ACTION_OPPORTUNITY_VISIBILITY_V1_KEYS) &&
  value.canDefer === true &&
  Array.isArray(value.supportedDecisionKinds) &&
  isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 1 &&
  value.supportedDecisionKinds[0] === "DEFER" &&
  Array.isArray(value.futureUnsupportedDecisionKinds) &&
  isDenseArray(value.futureUnsupportedDecisionKinds) &&
  value.futureUnsupportedDecisionKinds.length === 1 &&
  value.futureUnsupportedDecisionKinds[0] === "CHOOSE_TWO_PLAYERS";

const hasExactSeamstressActionOpportunityVisibilityV2Shape = (value: unknown): value is SeamstressActionOpportunityVisibilityV2 =>
  isPlainRecord(value) &&
  hasExactEnumerableKeys(value, SEAMSTRESS_ACTION_OPPORTUNITY_VISIBILITY_V2_KEYS) &&
  value.visibilitySchemaVersion === "seamstress-first-night-action-v2" &&
  value.resolutionCapabilityVersion === SEAMSTRESS_RESOLUTION_CAPABILITY_VERSION &&
  value.canDefer === true &&
  value.canChooseTargets === true &&
  Array.isArray(value.supportedDecisionKinds) &&
  isDenseArray(value.supportedDecisionKinds) &&
  value.supportedDecisionKinds.length === 2 &&
  value.supportedDecisionKinds[0] === "DEFER" &&
  value.supportedDecisionKinds[1] === "CHOOSE_TWO_PLAYERS" &&
  Array.isArray(value.futureUnsupportedDecisionKinds) &&
  isDenseArray(value.futureUnsupportedDecisionKinds) &&
  value.futureUnsupportedDecisionKinds.length === 0 &&
  value.targetSchema === "EXACTLY_TWO_DISTINCT_OTHER_MODELED_PLAYERS";

const hasExactSeamstressAbilitySourceShape = (value: unknown): value is SeamstressAbilitySourceDescriptor => {
  if (!isPlainRecord(value)) return false;
  if (value.kind === "ROLE_TENURE") {
    return hasExactEnumerableKeys(value, SEAMSTRESS_ROLE_TENURE_ABILITY_SOURCE_KEYS) &&
      value.abilityRoleId === "seamstress" && parseRoleTenureId(value.roleTenureId).valid &&
      typeof value.acquiredCharacterStateRevision === "number" && Number.isInteger(value.acquiredCharacterStateRevision) &&
      value.acquiredCharacterStateRevision > 0;
  }
  return value.kind === "PHILOSOPHER_GRANT" &&
    hasExactEnumerableKeys(value, SEAMSTRESS_PHILOSOPHER_GRANT_ABILITY_SOURCE_KEYS) &&
    value.abilityRoleId === "seamstress" && typeof value.grantId === "string" && value.grantId.trim().length > 0 &&
    parseRoleTenureId(value.sourceRoleTenureId).valid && typeof value.acquiredCharacterStateRevision === "number" &&
    Number.isInteger(value.acquiredCharacterStateRevision) && value.acquiredCharacterStateRevision > 0;
};

export const isSeamstressActionOpportunityV2 = (
  value: SeamstressActionOpportunity | FirstNightActionOpportunity
): value is SeamstressActionOpportunityV2 =>
  value.opportunityKind === "SEAMSTRESS_FIRST_NIGHT_ACTION" &&
  Object.hasOwn(value.visibility, "visibilitySchemaVersion");

export const isDreamerActionOpportunityV2 = (
  value: DreamerActionOpportunity | FirstNightActionOpportunity
): value is DreamerActionOpportunityV2 =>
  value.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V2" &&
  Object.hasOwn(value, "opportunitySchemaVersion") &&
  value.opportunitySchemaVersion === DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;

export const isDreamerActionOpportunityV3 = (
  value: DreamerActionOpportunity | FirstNightActionOpportunity
): value is DreamerActionOpportunityV3 =>
  value.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3" &&
  Object.hasOwn(value, "opportunitySchemaVersion") &&
  value.opportunitySchemaVersion === DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;

const hasExactFirstNightActionOpportunityShape = (value: unknown): value is FirstNightActionOpportunity => {
  if (!isPlainRecord(value)) {
    return false;
  }
  const seamstressV2 = value.opportunityKind === "SEAMSTRESS_FIRST_NIGHT_ACTION" && isPlainRecord(value.visibility) &&
    Object.hasOwn(value.visibility, "visibilitySchemaVersion");
  const cerenovus = value.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION";
  const dreamerV2 = value.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V2";
  const dreamerV3 = value.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3";
  if (!hasExactEnumerableKeys(value, dreamerV3
    ? DREAMER_V3_ACTION_OPPORTUNITY_KEYS
    : dreamerV2 ? DREAMER_V2_ACTION_OPPORTUNITY_KEYS
    : cerenovus
    ? CERENOVUS_ACTION_OPPORTUNITY_KEYS
    : seamstressV2
    ? SEAMSTRESS_ACTION_OPPORTUNITY_V2_KEYS
    : FIRST_NIGHT_ACTION_OPPORTUNITY_KEYS)) {
    return false;
  }

  const commonFieldsValid =
    value.nightNumber === 1 &&
    typeof value.opportunityId === "string" &&
    (dreamerV2 || dreamerV3
      ? parseBaseDreamerV2FirstNightActionOpportunityId(value.opportunityId).valid
      : parseFirstNightActionOpportunityId(actionOpportunityId(value.opportunityId)).valid) &&
    (value.opportunityStatus === "OPEN" || value.opportunityStatus === "CLOSED") &&
    typeof value.taskId === "string" &&
    value.taskId.trim().length > 0 &&
    typeof value.sourcePlayerId === "string" &&
    value.sourcePlayerId.trim().length > 0 &&
    typeof value.sourceSeatNumber === "number" &&
    Number.isInteger(value.sourceSeatNumber) &&
    value.sourceSeatNumber >= 1 &&
    value.sourceSeatNumber <= 12 &&
    hasExactRoleSetupSnapshotShape(value.sourceRole) &&
    typeof value.sourceCharacterStateRevision === "number" &&
    Number.isInteger(value.sourceCharacterStateRevision) &&
    value.sourceCharacterStateRevision > 0;
  if (!commonFieldsValid) {
    return false;
  }

  if (dreamerV2 || dreamerV3) {
    const parsedV2Id = parseBaseDreamerV2FirstNightActionOpportunityId(value.opportunityId);
    if (!hasExactBaseDreamerV2SourceContractShape(value.sourceContract)) return false;
    const sourceContract = value.sourceContract;
    const sourceRole = value.sourceRole as RoleSetupSnapshot;
    const taskId = value.taskId as ScheduledTaskId;
    const parsedTenure = parseRoleTenureId(sourceContract.sourceRoleTenureId);
    const parsedInstance = parseFirstNightAbilityInstanceId(sourceContract.sourceAbilityInstanceId);
    return value.opportunitySchemaVersion === (dreamerV3
        ? DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION
        : DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION) &&
      value.opportunityStatus === "OPEN" &&
      value.taskType === "DREAMER_ACTION" &&
      sourceRole.roleId === "dreamer" &&
      parsedV2Id.valid &&
      parsedV2Id.seatNumber === value.sourceSeatNumber &&
      sourceContract.taskId === value.taskId &&
      sourceContract.taskType === value.taskType &&
      sourceContract.sourcePlayerId === value.sourcePlayerId &&
      sourceContract.sourceSeatNumber === value.sourceSeatNumber &&
      sourceContract.sourceRoleId === sourceRole.roleId &&
      sourceContract.sourceCharacterStateRevision === value.sourceCharacterStateRevision &&
      parsedTenure.valid &&
      parsedTenure.seatNumber === value.sourceSeatNumber &&
      parsedTenure.roleId === "dreamer" &&
      parsedTenure.acquiredCharacterStateRevision <= value.sourceCharacterStateRevision &&
      parsedInstance.valid &&
      parsedInstance.kind === "BASE_ROLE_TASK" &&
      parsedInstance.generation === "BASE" &&
      parsedInstance.taskId === value.taskId &&
      parsedInstance.taskType === "DREAMER_ACTION" &&
      parsedInstance.embeddedSeat === value.sourceSeatNumber &&
      sourceContract.sourceAbilityInstanceId === formatBaseFirstNightAbilityInstanceId(taskId) &&
      (dreamerV3
        ? hasExactDreamerActionOpportunityVisibilityV3Shape(value.visibility)
        : hasExactDreamerActionOpportunityVisibilityV2Shape(value.visibility));
  }

  const parsedId = parseFirstNightActionOpportunityId(actionOpportunityId(value.opportunityId as string));
  if (!parsedId.valid) {
    return false;
  }

  if (value.opportunityKind === "PHILOSOPHER_FIRST_NIGHT_ACTION") {
    return (
      value.taskType === "PHILOSOPHER_ACTION" &&
      parsedId.taskType === "PHILOSOPHER_ACTION" &&
      hasExactPhilosopherActionOpportunityVisibilityShape(value.visibility)
    );
  }

  if (value.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION") {
    return (
      value.taskType === "SNAKE_CHARMER_ACTION" &&
      parsedId.taskType === "SNAKE_CHARMER_ACTION" &&
      hasExactSnakeCharmerActionOpportunityVisibilityShape(value.visibility)
    );
  }

  if (value.opportunityKind === "WITCH_FIRST_NIGHT_ACTION") {
    return (
      value.taskType === "WITCH_ACTION" &&
      parsedId.taskType === "WITCH_ACTION" &&
      hasExactWitchActionOpportunityVisibilityShape(value.visibility)
    );
  }

  if (value.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION") {
    if (value.taskType !== "CERENOVUS_ACTION" || parsedId.taskType !== "CERENOVUS_ACTION" ||
        parsedId.seatNumber !== value.sourceSeatNumber ||
        !hasExactCerenovusActionOpportunityVisibilityShape(value.visibility) ||
        !isPlainRecord(value.sourceRole) || value.sourceRole.roleId !== "cerenovus" ||
        !Number.isSafeInteger(value.sourceCharacterStateRevision) || (value.sourceCharacterStateRevision as number) < 1 ||
        !isPlainRecord(value.abilitySource) || !hasExactEnumerableKeys(value.abilitySource, ["abilityRoleId", "acquiredCharacterStateRevision", "kind", "roleTenureId"]) ||
        value.abilitySource.kind !== "ROLE_TENURE" || value.abilitySource.abilityRoleId !== "cerenovus" ||
        value.abilitySource.roleTenureId !== value.sourceRoleTenureId) return false;
    const tenure = parseRoleTenureId(value.sourceRoleTenureId);
    const instance = parseCerenovusAbilityInstanceId(value.sourceAbilityInstanceId);
    return tenure.valid && tenure.roleId === "cerenovus" && instance.valid &&
      tenure.seatNumber === value.sourceSeatNumber && tenure.acquiredCharacterStateRevision === value.abilitySource.acquiredCharacterStateRevision &&
      tenure.acquiredCharacterStateRevision <= (value.sourceCharacterStateRevision as number) && instance.roleTenureId === value.sourceRoleTenureId;
  }

  if (value.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION") {
    return (
      value.taskType === "DREAMER_ACTION" &&
      parsedId.taskType === "DREAMER_ACTION" &&
      hasExactDreamerActionOpportunityVisibilityShape(value.visibility)
    );
  }

  if (value.opportunityKind === "SEAMSTRESS_FIRST_NIGHT_ACTION") {
    if (value.taskType !== "SEAMSTRESS_ACTION" || parsedId.taskType !== "SEAMSTRESS_ACTION") return false;
    if (!seamstressV2) return hasExactSeamstressActionOpportunityVisibilityV1Shape(value.visibility);
    if (!hasExactSeamstressActionOpportunityVisibilityV2Shape(value.visibility) ||
        !hasExactSeamstressAbilitySourceShape(value.abilitySource) ||
        !parseRoleTenureId(value.sourceRoleTenureId).valid ||
        !parseSeamstressAbilityInstanceId(value.abilityInstanceId).valid ||
        !parseSeamstressAbilityUseEntitlementId(value.abilityUseEntitlementId).valid) return false;
    const sourceTenure = parseRoleTenureId(value.sourceRoleTenureId);
    const instance = parseSeamstressAbilityInstanceId(value.abilityInstanceId);
    const entitlement = parseSeamstressAbilityUseEntitlementId(value.abilityUseEntitlementId);
    const sourceRole = value.sourceRole as RoleSetupSnapshot;
    const sourceCharacterStateRevision = value.sourceCharacterStateRevision as number;
    if (!sourceTenure.valid || !instance.valid || !entitlement.valid ||
        sourceTenure.seatNumber !== value.sourceSeatNumber || sourceTenure.roleId !== sourceRole.roleId ||
        sourceTenure.acquiredCharacterStateRevision > sourceCharacterStateRevision ||
        instance.sourceRoleTenureId !== value.sourceRoleTenureId ||
        entitlement.abilityInstanceId !== value.abilityInstanceId) return false;
    return value.abilitySource.kind === "ROLE_TENURE"
      ? instance.sourceKind === "ROLE_TENURE" && sourceTenure.roleId === "seamstress" &&
        value.abilitySource.roleTenureId === value.sourceRoleTenureId &&
        value.abilitySource.acquiredCharacterStateRevision === instance.acquiredCharacterStateRevision
      : instance.sourceKind === "PHILOSOPHER_GRANT" && sourceTenure.roleId === "philosopher" &&
        value.abilitySource.sourceRoleTenureId === value.sourceRoleTenureId &&
        value.abilitySource.grantId === instance.grantId &&
        value.abilitySource.acquiredCharacterStateRevision === instance.acquiredCharacterStateRevision;
  }

  return false;
};

export const validateFirstNightActionOpportunityStateShape = (
  value: unknown
): ValidationResult => {
  if (!isCanonicalDataValue(value) || !isPlainRecord(value) || !hasExactEnumerableKeys(value, ["opportunities"]) ||
      !Array.isArray(value.opportunities) || !isDenseArray(value.opportunities)) {
    return fail("First-night action opportunity state must have one dense opportunities array");
  }

  const opportunityIds = new Set<string>();
  const taskIds = new Set<string>();
  const opportunities = value.opportunities as unknown[];
  for (let index = 0; index < value.opportunities.length; index += 1) {
    const opportunity = opportunities[index];
    if (!hasExactFirstNightActionOpportunityShape(opportunity)) {
      return fail("First-night action opportunity state contains a noncanonical opportunity");
    }
    if (opportunityIds.has(opportunity.opportunityId)) {
      return fail("First-night action opportunity identities must be unique");
    }
    if (taskIds.has(opportunity.taskId)) {
      return fail("First-night action opportunity task identities must be unique");
    }
    opportunityIds.add(opportunity.opportunityId);
    taskIds.add(opportunity.taskId);
  }

  return { valid: true };
};

export const validateSeamstressActionOpportunityV2Shape = (
  value: unknown
): ValidationResult => {
  if (!hasExactFirstNightActionOpportunityShape(value) ||
      value.opportunityKind !== "SEAMSTRESS_FIRST_NIGHT_ACTION" ||
      !isSeamstressActionOpportunityV2(value)) {
    return fail("Stored Seamstress opportunity must have the exact V2 runtime shape");
  }
  return { valid: true };
};

const cloneVisibility = (visibility: ActionOpportunityVisibility): ActionOpportunityVisibility => {
  if ("canChooseCharacter" in visibility) {
    return {
      canChooseTarget: true,
      canChooseCharacter: true,
      supportedDecisionKinds: ["CHOOSE_PLAYER_AND_CHARACTER"],
      targetSchema: "ANY_MODELED_ROSTER_PLAYER",
      characterSchema: "ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER"
    };
  }
  if (Object.hasOwn(visibility, "visibilitySchemaVersion")) {
    if ((visibility as { readonly visibilitySchemaVersion?: unknown }).visibilitySchemaVersion === DREAMER_V2_VISIBILITY_SCHEMA_VERSION) {
      return {
        visibilitySchemaVersion: DREAMER_V2_VISIBILITY_SCHEMA_VERSION,
        canChooseTarget: false,
        supportedDecisionKinds: [],
        futureUnsupportedDecisionKinds: ["CHOOSE_PLAYER"],
        futureTargetSchema: "OTHER_NON_TRAVELLER_PLAYER"
      };
    }
    if ((visibility as { readonly visibilitySchemaVersion?: unknown }).visibilitySchemaVersion === DREAMER_V3_VISIBILITY_SCHEMA_VERSION) {
      return createDreamerActionOpportunityVisibilityV3();
    }
    const seamstress = visibility as SeamstressActionOpportunityVisibilityV2;
    return {
      visibilitySchemaVersion: seamstress.visibilitySchemaVersion,
      resolutionCapabilityVersion: seamstress.resolutionCapabilityVersion,
      canDefer: seamstress.canDefer,
      canChooseTargets: seamstress.canChooseTargets,
      supportedDecisionKinds: ["DEFER", "CHOOSE_TWO_PLAYERS"],
      futureUnsupportedDecisionKinds: [],
      targetSchema: seamstress.targetSchema
    };
  }
  if ("canDefer" in visibility) {
    if (visibility.futureUnsupportedDecisionKinds[0] === "CHOOSE_TWO_PLAYERS") {
      return {
        canDefer: visibility.canDefer,
        supportedDecisionKinds: ["DEFER"],
        futureUnsupportedDecisionKinds: ["CHOOSE_TWO_PLAYERS"]
      };
    }

    return {
      canDefer: visibility.canDefer,
      supportedDecisionKinds: ["DEFER", "CHOOSE_GOOD_CHARACTER"],
      futureUnsupportedDecisionKinds: []
    };
  }

  const targetVisibility = visibility as
    | SnakeCharmerActionOpportunityVisibility
    | WitchActionOpportunityVisibility
    | DreamerActionOpportunityVisibilityV1;
  return {
    canChooseTarget: true,
    supportedDecisionKinds: ["CHOOSE_PLAYER"],
    targetSchema: targetVisibility.targetSchema
  };
};

const sameVisibility = (left: ActionOpportunityVisibility, right: ActionOpportunityVisibility): boolean => {
  if ("canChooseCharacter" in left || "canChooseCharacter" in right) {
    return "canChooseCharacter" in left && "canChooseCharacter" in right &&
      left.canChooseTarget === right.canChooseTarget && left.canChooseCharacter === right.canChooseCharacter &&
      left.targetSchema === right.targetSchema && left.characterSchema === right.characterSchema &&
      left.supportedDecisionKinds[0] === right.supportedDecisionKinds[0];
  }
  const leftV2 = Object.hasOwn(left, "visibilitySchemaVersion");
  const rightV2 = Object.hasOwn(right, "visibilitySchemaVersion");
  if (leftV2 || rightV2) {
    if (!leftV2 || !rightV2) return false;
    const leftVersion = (left as { readonly visibilitySchemaVersion: string }).visibilitySchemaVersion;
    const rightVersion = (right as { readonly visibilitySchemaVersion: string }).visibilitySchemaVersion;
    if (leftVersion === DREAMER_V2_VISIBILITY_SCHEMA_VERSION || rightVersion === DREAMER_V2_VISIBILITY_SCHEMA_VERSION) {
      if (leftVersion !== DREAMER_V2_VISIBILITY_SCHEMA_VERSION || rightVersion !== DREAMER_V2_VISIBILITY_SCHEMA_VERSION) return false;
      const a = left as DreamerActionOpportunityVisibilityV2;
      const b = right as DreamerActionOpportunityVisibilityV2;
      return a.canChooseTarget === b.canChooseTarget &&
        a.futureTargetSchema === b.futureTargetSchema &&
        a.supportedDecisionKinds.length === b.supportedDecisionKinds.length &&
        a.futureUnsupportedDecisionKinds.length === b.futureUnsupportedDecisionKinds.length &&
        a.futureUnsupportedDecisionKinds[0] === b.futureUnsupportedDecisionKinds[0];
    }
    if (leftVersion === DREAMER_V3_VISIBILITY_SCHEMA_VERSION || rightVersion === DREAMER_V3_VISIBILITY_SCHEMA_VERSION) {
      if (leftVersion !== DREAMER_V3_VISIBILITY_SCHEMA_VERSION || rightVersion !== DREAMER_V3_VISIBILITY_SCHEMA_VERSION) return false;
      const a = left as DreamerActionOpportunityVisibilityV3;
      const b = right as DreamerActionOpportunityVisibilityV3;
      return a.canChooseTarget === b.canChooseTarget && a.targetSchema === b.targetSchema &&
        a.supportedDecisionKinds.length === b.supportedDecisionKinds.length &&
        a.supportedDecisionKinds[0] === b.supportedDecisionKinds[0] &&
        a.futureUnsupportedDecisionKinds.length === b.futureUnsupportedDecisionKinds.length;
    }
    const a = left as SeamstressActionOpportunityVisibilityV2;
    const b = right as SeamstressActionOpportunityVisibilityV2;
    return a.visibilitySchemaVersion === b.visibilitySchemaVersion &&
      a.resolutionCapabilityVersion === b.resolutionCapabilityVersion && a.canDefer === b.canDefer &&
      a.canChooseTargets === b.canChooseTargets && a.targetSchema === b.targetSchema &&
      a.supportedDecisionKinds.every((value, index) => value === b.supportedDecisionKinds[index]) &&
      a.futureUnsupportedDecisionKinds.length === b.futureUnsupportedDecisionKinds.length;
  }
  if ("canDefer" in left || "canDefer" in right) {
    return "canDefer" in left &&
      "canDefer" in right &&
      left.canDefer === right.canDefer &&
      left.supportedDecisionKinds.length === right.supportedDecisionKinds.length &&
      left.supportedDecisionKinds.every((value, index) => value === right.supportedDecisionKinds[index]) &&
      left.futureUnsupportedDecisionKinds.length === right.futureUnsupportedDecisionKinds.length &&
      left.futureUnsupportedDecisionKinds.every((value, index) => value === right.futureUnsupportedDecisionKinds[index]);
  }

  const leftTarget = left as
    | SnakeCharmerActionOpportunityVisibility
    | WitchActionOpportunityVisibility
    | DreamerActionOpportunityVisibilityV1;
  const rightTarget = right as
    | SnakeCharmerActionOpportunityVisibility
    | WitchActionOpportunityVisibility
    | DreamerActionOpportunityVisibilityV1;
  return leftTarget.canChooseTarget === rightTarget.canChooseTarget &&
    leftTarget.supportedDecisionKinds.length === 1 &&
    rightTarget.supportedDecisionKinds.length === 1 &&
    leftTarget.supportedDecisionKinds[0] === rightTarget.supportedDecisionKinds[0] &&
    leftTarget.targetSchema === rightTarget.targetSchema;
};

const cloneFirstNightActionOpportunity = (
  opportunity: FirstNightActionOpportunity
): FirstNightActionOpportunity => {
  if (opportunity.opportunityKind === "PHILOSOPHER_FIRST_NIGHT_ACTION") {
    return {
      nightNumber: opportunity.nightNumber,
      opportunityId: opportunity.opportunityId,
      opportunityKind: opportunity.opportunityKind,
      opportunityStatus: opportunity.opportunityStatus,
      taskId: opportunity.taskId,
      taskType: opportunity.taskType,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceSeatNumber: opportunity.sourceSeatNumber,
      sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
      sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
      visibility: cloneVisibility(opportunity.visibility) as PhilosopherActionOpportunityVisibility
    };
  }

  if (opportunity.opportunityKind === "SNAKE_CHARMER_FIRST_NIGHT_ACTION") {
    return {
      nightNumber: opportunity.nightNumber,
      opportunityId: opportunity.opportunityId,
      opportunityKind: opportunity.opportunityKind,
      opportunityStatus: opportunity.opportunityStatus,
      taskId: opportunity.taskId,
      taskType: opportunity.taskType,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceSeatNumber: opportunity.sourceSeatNumber,
      sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
      sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
      visibility: cloneVisibility(opportunity.visibility) as SnakeCharmerActionOpportunityVisibility
    };
  }

  if (opportunity.opportunityKind === "WITCH_FIRST_NIGHT_ACTION") {
    return {
      nightNumber: opportunity.nightNumber,
      opportunityId: opportunity.opportunityId,
      opportunityKind: opportunity.opportunityKind,
      opportunityStatus: opportunity.opportunityStatus,
      taskId: opportunity.taskId,
      taskType: opportunity.taskType,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceSeatNumber: opportunity.sourceSeatNumber,
      sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
      sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
      visibility: cloneVisibility(opportunity.visibility) as WitchActionOpportunityVisibility
    };
  }

  if (opportunity.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION") {
    return {
      nightNumber: opportunity.nightNumber,
      opportunityId: opportunity.opportunityId,
      opportunityKind: opportunity.opportunityKind,
      opportunityStatus: opportunity.opportunityStatus,
      taskId: opportunity.taskId,
      taskType: opportunity.taskType,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceSeatNumber: opportunity.sourceSeatNumber,
      sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
      sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
      sourceRoleTenureId: opportunity.sourceRoleTenureId,
      sourceAbilityInstanceId: opportunity.sourceAbilityInstanceId,
      abilitySource: { ...opportunity.abilitySource },
      visibility: cloneVisibility(opportunity.visibility) as CerenovusActionOpportunityVisibility
    };
  }

  if (opportunity.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V2") {
    return {
      nightNumber: opportunity.nightNumber,
      opportunityId: opportunity.opportunityId,
      opportunityKind: opportunity.opportunityKind,
      opportunitySchemaVersion: opportunity.opportunitySchemaVersion,
      opportunityStatus: opportunity.opportunityStatus,
      taskId: opportunity.taskId,
      taskType: opportunity.taskType,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceSeatNumber: opportunity.sourceSeatNumber,
      sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
      sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
      sourceContract: { ...opportunity.sourceContract },
      visibility: cloneVisibility(opportunity.visibility) as DreamerActionOpportunityVisibilityV2
    };
  }

  if (opportunity.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3") {
    return {
      nightNumber: opportunity.nightNumber,
      opportunityId: opportunity.opportunityId,
      opportunityKind: opportunity.opportunityKind,
      opportunitySchemaVersion: opportunity.opportunitySchemaVersion,
      opportunityStatus: opportunity.opportunityStatus,
      taskId: opportunity.taskId,
      taskType: opportunity.taskType,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceSeatNumber: opportunity.sourceSeatNumber,
      sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
      sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
      sourceContract: { ...opportunity.sourceContract },
      visibility: cloneVisibility(opportunity.visibility) as DreamerActionOpportunityVisibilityV3
    };
  }

  if (opportunity.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION") {
    return {
      nightNumber: opportunity.nightNumber,
      opportunityId: opportunity.opportunityId,
      opportunityKind: opportunity.opportunityKind,
      opportunityStatus: opportunity.opportunityStatus,
      taskId: opportunity.taskId,
      taskType: opportunity.taskType,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceSeatNumber: opportunity.sourceSeatNumber,
      sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
      sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
      visibility: cloneVisibility(opportunity.visibility) as DreamerActionOpportunityVisibilityV1
    };
  }

  if (isSeamstressActionOpportunityV2(opportunity)) {
    return {
      nightNumber: opportunity.nightNumber,
      opportunityId: opportunity.opportunityId,
      opportunityKind: opportunity.opportunityKind,
      opportunityStatus: opportunity.opportunityStatus,
      taskId: opportunity.taskId,
      taskType: opportunity.taskType,
      sourcePlayerId: opportunity.sourcePlayerId,
      sourceSeatNumber: opportunity.sourceSeatNumber,
      sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
      sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
      sourceRoleTenureId: opportunity.sourceRoleTenureId,
      abilitySource: { ...opportunity.abilitySource },
      abilityInstanceId: opportunity.abilityInstanceId,
      abilityUseEntitlementId: opportunity.abilityUseEntitlementId,
      visibility: cloneVisibility(opportunity.visibility) as SeamstressActionOpportunityVisibilityV2
    };
  }

  return {
    nightNumber: opportunity.nightNumber,
    opportunityId: opportunity.opportunityId,
    opportunityKind: opportunity.opportunityKind,
    opportunityStatus: opportunity.opportunityStatus,
    taskId: opportunity.taskId,
    taskType: opportunity.taskType,
    sourcePlayerId: opportunity.sourcePlayerId,
    sourceSeatNumber: opportunity.sourceSeatNumber,
    sourceRole: cloneRoleSetupSnapshot(opportunity.sourceRole),
    sourceCharacterStateRevision: opportunity.sourceCharacterStateRevision,
    visibility: cloneVisibility(opportunity.visibility) as SeamstressActionOpportunityVisibilityV1
  };
};

export const sameOpportunityCore = (
  left: FirstNightActionOpportunity,
  right: FirstNightActionOpportunity
): boolean => {
  if (left.opportunityKind !== right.opportunityKind) return false;
  if ((left.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V2" && right.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V2" ||
       left.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3" && right.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3") &&
      (left.opportunitySchemaVersion !== right.opportunitySchemaVersion ||
       left.sourceContract.sourceContractVersion !== right.sourceContract.sourceContractVersion ||
       left.sourceContract.kind !== right.sourceContract.kind ||
       left.sourceContract.taskPlanVersion !== right.sourceContract.taskPlanVersion ||
       left.sourceContract.taskId !== right.sourceContract.taskId ||
       left.sourceContract.taskType !== right.sourceContract.taskType ||
       left.sourceContract.sourcePlayerId !== right.sourceContract.sourcePlayerId ||
       left.sourceContract.sourceSeatNumber !== right.sourceContract.sourceSeatNumber ||
       left.sourceContract.sourceRoleId !== right.sourceContract.sourceRoleId ||
       left.sourceContract.sourceRoleTenureId !== right.sourceContract.sourceRoleTenureId ||
       left.sourceContract.sourceCharacterStateRevision !== right.sourceContract.sourceCharacterStateRevision ||
       left.sourceContract.sourceAbilityInstanceId !== right.sourceContract.sourceAbilityInstanceId)) return false;
  if (left.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION" && right.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION" &&
      (left.sourceRoleTenureId !== right.sourceRoleTenureId || left.sourceAbilityInstanceId !== right.sourceAbilityInstanceId ||
       left.abilitySource.kind !== right.abilitySource.kind || left.abilitySource.abilityRoleId !== right.abilitySource.abilityRoleId ||
       left.abilitySource.roleTenureId !== right.abilitySource.roleTenureId ||
       left.abilitySource.acquiredCharacterStateRevision !== right.abilitySource.acquiredCharacterStateRevision)) return false;
  if (left.opportunityKind === "SEAMSTRESS_FIRST_NIGHT_ACTION" && right.opportunityKind === "SEAMSTRESS_FIRST_NIGHT_ACTION") {
    const leftV2 = isSeamstressActionOpportunityV2(left);
    const rightV2 = isSeamstressActionOpportunityV2(right);
    if (leftV2 !== rightV2) return false;
    if (leftV2 && rightV2) {
      if (left.sourceRoleTenureId !== right.sourceRoleTenureId ||
          left.abilityInstanceId !== right.abilityInstanceId ||
          left.abilityUseEntitlementId !== right.abilityUseEntitlementId ||
          left.abilitySource.kind !== right.abilitySource.kind ||
          left.abilitySource.abilityRoleId !== right.abilitySource.abilityRoleId ||
          left.abilitySource.acquiredCharacterStateRevision !== right.abilitySource.acquiredCharacterStateRevision) {
        return false;
      }
      if (left.abilitySource.kind === "ROLE_TENURE") {
        if (right.abilitySource.kind !== "ROLE_TENURE" ||
            left.abilitySource.roleTenureId !== right.abilitySource.roleTenureId) return false;
      } else if (right.abilitySource.kind !== "PHILOSOPHER_GRANT" ||
          left.abilitySource.grantId !== right.abilitySource.grantId ||
          left.abilitySource.sourceRoleTenureId !== right.abilitySource.sourceRoleTenureId) {
        return false;
      }
    }
  }
  return left.nightNumber === right.nightNumber &&
  left.opportunityId === right.opportunityId &&
  left.opportunityStatus === right.opportunityStatus &&
  left.taskId === right.taskId &&
  left.taskType === right.taskType &&
  left.sourcePlayerId === right.sourcePlayerId &&
  left.sourceSeatNumber === right.sourceSeatNumber &&
  sameRoleSetupSnapshot(left.sourceRole, right.sourceRole) &&
  left.sourceCharacterStateRevision === right.sourceCharacterStateRevision &&
  sameVisibility(left.visibility, right.visibility);
};

const currentPhilosopherEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (
    task.taskType !== "PHILOSOPHER_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    source.kind !== "ROLE" ||
    source.role.roleId !== PHILOSOPHER_ROLE_ID
  ) {
    return undefined;
  }

  const currentEntry = currentCharacterState.entries.find(
    (entry) =>
      entry.playerId === source.playerId &&
      entry.seatNumber === source.seatNumber
  );

  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== PHILOSOPHER_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.role)
  ) {
    return undefined;
  }

  return currentEntry;
};

const currentPhilosopherGainedSnakeCharmerEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (
    task.taskType !== "SNAKE_CHARMER_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    source.kind !== "PHILOSOPHER_GAINED_ABILITY" ||
    source.sourceRole.roleId !== PHILOSOPHER_ROLE_ID ||
    source.chosenRole.roleId !== SNAKE_CHARMER_ROLE_ID ||
    currentCharacterState.revision !== source.sourceCharacterStateRevision
  ) {
    return undefined;
  }

  const currentEntry = currentCharacterState.entries.find(
    (entry) =>
      entry.playerId === source.playerId &&
      entry.seatNumber === source.seatNumber
  );

  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== PHILOSOPHER_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.sourceRole)
  ) {
    return undefined;
  }

  return currentEntry;
};

const currentBaseSnakeCharmerEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (
    task.taskType !== "SNAKE_CHARMER_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    source.kind !== "ROLE" ||
    source.role.roleId !== SNAKE_CHARMER_ROLE_ID
  ) {
    return undefined;
  }

  const currentEntry = currentCharacterState.entries.find(
    (entry) =>
      entry.playerId === source.playerId &&
      entry.seatNumber === source.seatNumber
  );

  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== SNAKE_CHARMER_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.role)
  ) {
    return undefined;
  }

  return currentEntry;
};

const currentWitchEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (
    task.taskType !== "WITCH_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    source.kind !== "ROLE" ||
    source.role.roleId !== WITCH_ROLE_ID
  ) {
    return undefined;
  }

  const currentEntry = currentCharacterState.entries.find(
    (entry) =>
      entry.playerId === source.playerId &&
      entry.seatNumber === source.seatNumber
  );

  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== WITCH_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.role)
  ) {
    return undefined;
  }

  return currentEntry;
};

export const validateCerenovusActionOpportunityShape = (
  value: unknown
): ValidationResult =>
  hasExactFirstNightActionOpportunityShape(value) &&
  value.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION"
    ? { valid: true }
    : fail("Cerenovus action opportunity must have the exact supported runtime shape");

const currentCerenovusEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (task.taskType !== "CERENOVUS_ACTION" || task.taskClass !== "ROLE_ACTION" || source.kind !== "ROLE" ||
      source.role.roleId !== CERENOVUS_ROLE_ID) return undefined;
  const currentEntry = currentCharacterState.entries.find((entry) => entry.playerId === source.playerId && entry.seatNumber === source.seatNumber);
  return currentEntry !== undefined && currentEntry.role.roleId === CERENOVUS_ROLE_ID && sameRoleSetupSnapshot(currentEntry.role, source.role)
    ? currentEntry
    : undefined;
};

const currentDreamerEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (
    task.taskType !== "DREAMER_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    source.kind !== "ROLE" ||
    source.role.roleId !== DREAMER_ROLE_ID
  ) {
    return undefined;
  }

  const currentEntry = currentCharacterState.entries.find(
    (entry) =>
      entry.playerId === source.playerId &&
      entry.seatNumber === source.seatNumber
  );

  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== DREAMER_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.role)
  ) {
    return undefined;
  }

  return currentEntry;
};

const currentSeamstressEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (
    task.taskType !== "SEAMSTRESS_ACTION" ||
    task.taskClass !== "ROLE_ACTION" ||
    source.kind !== "ROLE" ||
    source.role.roleId !== SEAMSTRESS_ROLE_ID
  ) {
    return undefined;
  }

  const currentEntry = currentCharacterState.entries.find(
    (entry) =>
      entry.playerId === source.playerId &&
      entry.seatNumber === source.seatNumber
  );

  if (
    currentEntry === undefined ||
    currentEntry.role.roleId !== SEAMSTRESS_ROLE_ID ||
    !sameRoleSetupSnapshot(currentEntry.role, source.role)
  ) {
    return undefined;
  }

  return currentEntry;
};

const currentPhilosopherGainedSeamstressEntryForTask = (
  task: ScheduledTask,
  currentCharacterState: CurrentCharacterStateSet
) => {
  const source = task.source;
  if (task.taskType !== "SEAMSTRESS_ACTION" || task.taskClass !== "ROLE_ACTION" ||
      source.kind !== "PHILOSOPHER_GAINED_ABILITY" || source.sourceRole.roleId !== PHILOSOPHER_ROLE_ID ||
      source.chosenRole.roleId !== SEAMSTRESS_ROLE_ID) return undefined;
  const currentEntry = currentCharacterState.entries.find((entry) =>
    entry.playerId === source.playerId && entry.seatNumber === source.seatNumber
  );
  if (currentEntry === undefined || currentEntry.role.roleId !== PHILOSOPHER_ROLE_ID ||
      !sameRoleSetupSnapshot(currentEntry.role, source.sourceRole)) return undefined;
  return currentEntry;
};

export const formatFirstNightActionOpportunityId = (input: {
  readonly taskType: "PHILOSOPHER_ACTION" | "SNAKE_CHARMER_ACTION" | "WITCH_ACTION" | "CERENOVUS_ACTION" | "DREAMER_ACTION" | "SEAMSTRESS_ACTION";
  readonly seatNumber: SeatNumber;
  readonly opportunityIndex?: number;
}): ActionOpportunityId => {
  const index = input.opportunityIndex ?? 1;
  if (!Number.isInteger(input.seatNumber) || input.seatNumber < 1 || input.seatNumber > 12) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", "ActionOpportunityId seat number must be 1 through 12");
  }

  if (!Number.isInteger(index) || index < 1) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", "ActionOpportunityId opportunity index must be positive");
  }

  const seatSegment = String(input.seatNumber).padStart(2, "0");
  const opportunitySegment = String(index).padStart(2, "0");
  return actionOpportunityId(`first-night-v1:${input.taskType}:seat-${seatSegment}:opportunity-${opportunitySegment}`);
};

export const formatPhilosopherGainedSnakeCharmerActionOpportunityId = (input: {
  readonly seatNumber: SeatNumber;
  readonly opportunityIndex?: number;
}): ActionOpportunityId => {
  const index = input.opportunityIndex ?? 1;
  if (!Number.isInteger(input.seatNumber) || input.seatNumber < 1 || input.seatNumber > 12) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", "ActionOpportunityId seat number must be 1 through 12");
  }

  if (!Number.isInteger(index) || index < 1) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", "ActionOpportunityId opportunity index must be positive");
  }

  const seatSegment = String(input.seatNumber).padStart(2, "0");
  const opportunitySegment = String(index).padStart(2, "0");
  return actionOpportunityId(`first-night-v1:PHILOSOPHER_GAINED:SNAKE_CHARMER_ACTION:seat-${seatSegment}:from-snake_charmer:opportunity-${opportunitySegment}`);
};

export const formatPhilosopherGainedSeamstressActionOpportunityId = (input: {
  readonly seatNumber: SeatNumber;
  readonly opportunityIndex?: number;
}): ActionOpportunityId => {
  const index = input.opportunityIndex ?? 1;
  if (!Number.isInteger(input.seatNumber) || input.seatNumber < 1 || input.seatNumber > 12 ||
      !Number.isInteger(index) || index < 1) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", "ActionOpportunityId requires a canonical seat and positive index");
  }
  const seatSegment = String(input.seatNumber).padStart(2, "0");
  const opportunitySegment = String(index).padStart(2, "0");
  return actionOpportunityId(`first-night-v1:PHILOSOPHER_GAINED:SEAMSTRESS_ACTION:seat-${seatSegment}:from-seamstress:opportunity-${opportunitySegment}`);
};

export const formatBaseDreamerV2FirstNightActionOpportunityId = (input: {
  readonly seatNumber: SeatNumber;
}): ActionOpportunityId => {
  if (!Number.isInteger(input.seatNumber) || input.seatNumber < 1 || input.seatNumber > 12) {
    throw new DomainError(
      "InvalidFirstNightActionOpportunityCreatedPayload",
      "Base Dreamer V2 ActionOpportunityId seat number must be 1 through 12"
    );
  }
  return actionOpportunityId(
    `first-night-v2:DREAMER_ACTION:seat-${String(input.seatNumber).padStart(2, "0")}:opportunity-01`
  );
};

export const parseBaseDreamerV2FirstNightActionOpportunityId = (
  value: unknown
):
  | {
      readonly valid: true;
      readonly canonicalId: ActionOpportunityId;
      readonly taskType: "DREAMER_ACTION";
      readonly seatNumber: SeatNumber;
      readonly opportunityIndex: 1;
    }
  | { readonly valid: false; readonly reason: string } => {
  if (typeof value !== "string") {
    return { valid: false, reason: "Base Dreamer V2 ActionOpportunityId must be a primitive string" };
  }
  const match = BASE_DREAMER_V2_ACTION_OPPORTUNITY_ID_PATTERN.exec(value);
  if (match?.[1] === undefined) {
    return { valid: false, reason: "Base Dreamer V2 ActionOpportunityId must use the exact canonical grammar" };
  }
  const seatNumber = Number(match[1]) as SeatNumber;
  const canonicalId = formatBaseDreamerV2FirstNightActionOpportunityId({ seatNumber });
  if (canonicalId !== value) {
    return { valid: false, reason: "Base Dreamer V2 ActionOpportunityId must round-trip canonically" };
  }
  return {
    valid: true,
    canonicalId,
    taskType: "DREAMER_ACTION",
    seatNumber,
    opportunityIndex: 1
  };
};

export const parseFirstNightActionOpportunityId = (
  value: ActionOpportunityId
): {
  readonly valid: true;
  readonly taskType: "PHILOSOPHER_ACTION" | "SNAKE_CHARMER_ACTION" | "WITCH_ACTION" | "CERENOVUS_ACTION" | "DREAMER_ACTION" | "SEAMSTRESS_ACTION";
  readonly seatNumber: SeatNumber;
  readonly opportunityIndex: number;
} | {
  readonly valid: false;
  readonly reason: string;
} => {
  const match = FIRST_NIGHT_ACTION_OPPORTUNITY_ID_PATTERN.exec(value);
  if (match === null) {
    return { valid: false, reason: "ActionOpportunityId must use a supported first-night action opportunity format" };
  }

  const taskType = (match[1] ?? match[4]) as "PHILOSOPHER_ACTION" | "SNAKE_CHARMER_ACTION" | "WITCH_ACTION" | "CERENOVUS_ACTION" | "DREAMER_ACTION" | "SEAMSTRESS_ACTION";
  const seatNumber = Number(match[2] ?? match[5]);
  const opportunityIndex = Number(match[3] ?? match[7]);
  if ((match[4] === "SNAKE_CHARMER_ACTION" && match[6] !== "snake_charmer") ||
      (match[4] === "SEAMSTRESS_ACTION" && match[6] !== "seamstress")) {
    return { valid: false, reason: "ActionOpportunityId gained-ability source must match its task type" };
  }
  if (
    !Number.isInteger(seatNumber) ||
    seatNumber < 1 ||
    seatNumber > 12 ||
    !Number.isInteger(opportunityIndex) ||
    opportunityIndex < 1
  ) {
    return { valid: false, reason: "ActionOpportunityId contains an unsupported seat or opportunity index" };
  }

  return {
    valid: true,
    taskType,
    seatNumber: seatNumber as SeatNumber,
    opportunityIndex
  };
};

export const cloneFirstNightActionOpportunityState = (
  state: FirstNightActionOpportunityState | undefined
): FirstNightActionOpportunityState => ({
  opportunities: state?.opportunities.map(cloneFirstNightActionOpportunity) ?? []
});

export const findFirstNightActionOpportunityById = (
  state: FirstNightActionOpportunityState | undefined,
  opportunityIdValue: ActionOpportunityId
): FirstNightActionOpportunity | undefined =>
  state?.opportunities.find((opportunity) => opportunity.opportunityId === opportunityIdValue);

export const findFirstNightActionOpportunityForTask = (
  state: FirstNightActionOpportunityState | undefined,
  taskIdValue: ScheduledTaskId
): FirstNightActionOpportunity | undefined =>
  state?.opportunities.find((opportunity) => opportunity.taskId === taskIdValue);

export const createPhilosopherFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): PhilosopherActionOpportunity => {
  const result = tryCreatePhilosopherFirstNightActionOpportunity(input);
  if (!result.valid) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", result.reason);
  }

  return result.opportunity;
};

export const tryCreatePhilosopherFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreatePhilosopherOpportunityResult => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated must reference a task in the first-night task plan" };
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot target a settled task" };
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated must target the current next unsettled task" };
  }

  const currentEntry = currentPhilosopherEntryForTask(targetTask, input.currentCharacterState);
  if (currentEntry === undefined) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated source is no longer a current Philosopher" };
  }

  const existingOpportunity = findFirstNightActionOpportunityForTask(input.firstNightActionOpportunities, targetTask.taskId);
  if (existingOpportunity?.opportunityStatus === "OPEN") {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot create a duplicate open opportunity" };
  }

  if (existingOpportunity?.opportunityStatus === "CLOSED") {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot reopen a closed opportunity" };
  }

  return {
    valid: true,
    opportunity: {
      nightNumber: 1,
      opportunityId: formatFirstNightActionOpportunityId({
        taskType: "PHILOSOPHER_ACTION",
        seatNumber: currentEntry.seatNumber,
        opportunityIndex: 1
      }),
      opportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: targetTask.taskId,
      taskType: "PHILOSOPHER_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: cloneRoleSetupSnapshot(currentEntry.role),
      sourceCharacterStateRevision: input.currentCharacterState.revision,
      visibility: createPhilosopherActionOpportunityVisibility()
    }
  };
};

const validateCommonOpportunityTarget = (
  input: OpportunityValidationInput
): { readonly valid: true; readonly targetTask: ScheduledTask } | { readonly valid: false; readonly reason: string } => {
  const matchingTasks = input.firstNightTaskPlan.tasks.filter((task) => task.taskId === input.taskId);
  const targetTask = matchingTasks[0];
  if (matchingTasks.length !== 1 || targetTask === undefined) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated must reference exactly one task in the first-night task plan" };
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot target a settled task" };
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated must target the current next unsettled task" };
  }

  const existingOpportunity = findFirstNightActionOpportunityForTask(input.firstNightActionOpportunities, targetTask.taskId);
  if (existingOpportunity?.opportunityStatus === "OPEN") {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot create a duplicate open opportunity" };
  }

  if (existingOpportunity?.opportunityStatus === "CLOSED") {
    return { valid: false, reason: "FirstNightActionOpportunityCreated cannot reopen a closed opportunity" };
  }

  return { valid: true, targetTask };
};

export const tryCreateSnakeCharmerFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreateSnakeCharmerOpportunityResult => {
  const common = validateCommonOpportunityTarget(input);
  if (!common.valid) {
    return common;
  }

  const targetTask = common.targetTask;
  const baseCurrentEntry = currentBaseSnakeCharmerEntryForTask(targetTask, input.currentCharacterState);
  if (baseCurrentEntry !== undefined) {
    return {
      valid: true,
      opportunity: {
        nightNumber: 1,
        opportunityId: formatFirstNightActionOpportunityId({
          taskType: "SNAKE_CHARMER_ACTION",
          seatNumber: baseCurrentEntry.seatNumber,
          opportunityIndex: 1
        }),
        opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION",
        opportunityStatus: "OPEN",
        taskId: targetTask.taskId,
        taskType: "SNAKE_CHARMER_ACTION",
        sourcePlayerId: baseCurrentEntry.playerId,
        sourceSeatNumber: baseCurrentEntry.seatNumber,
        sourceRole: cloneRoleSetupSnapshot(baseCurrentEntry.role),
        sourceCharacterStateRevision: input.currentCharacterState.revision,
        visibility: createSnakeCharmerActionOpportunityVisibility()
      }
    };
  }

  const currentEntry = currentPhilosopherGainedSnakeCharmerEntryForTask(targetTask, input.currentCharacterState);
  if (currentEntry === undefined) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated source is not a current Snake Charmer or Philosopher gained snake_charmer task" };
  }

  return {
    valid: true,
    opportunity: {
      nightNumber: 1,
      opportunityId: formatPhilosopherGainedSnakeCharmerActionOpportunityId({
        seatNumber: currentEntry.seatNumber,
        opportunityIndex: 1
      }),
      opportunityKind: "SNAKE_CHARMER_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: targetTask.taskId,
      taskType: "SNAKE_CHARMER_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: cloneRoleSetupSnapshot(currentEntry.role),
      sourceCharacterStateRevision: input.currentCharacterState.revision,
      visibility: createSnakeCharmerActionOpportunityVisibility()
    }
  };
};

export const tryCreateWitchFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreateWitchOpportunityResult => {
  const common = validateCommonOpportunityTarget(input);
  if (!common.valid) {
    return common;
  }

  const targetTask = common.targetTask;
  const currentEntry = currentWitchEntryForTask(targetTask, input.currentCharacterState);
  if (currentEntry === undefined) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated source is no longer a current Witch" };
  }

  return {
    valid: true,
    opportunity: {
      nightNumber: 1,
      opportunityId: formatFirstNightActionOpportunityId({
        taskType: "WITCH_ACTION",
        seatNumber: currentEntry.seatNumber,
        opportunityIndex: 1
      }),
      opportunityKind: "WITCH_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: targetTask.taskId,
      taskType: "WITCH_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: cloneRoleSetupSnapshot(currentEntry.role),
      sourceCharacterStateRevision: input.currentCharacterState.revision,
      visibility: createWitchActionOpportunityVisibility()
    }
  };
};

export const tryCreateCerenovusFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreateCerenovusOpportunityResult => {
  const common = validateCommonOpportunityTarget(input);
  if (!common.valid) return common;
  const currentEntry = currentCerenovusEntryForTask(common.targetTask, input.currentCharacterState);
  if (currentEntry === undefined) return { valid: false, reason: "FirstNightActionOpportunityCreated source is no longer a current base Cerenovus" };
  const tenures = input.seamstressRoleTenureState?.records.filter((tenure) =>
    tenure.playerId === currentEntry.playerId && tenure.seatNumber === currentEntry.seatNumber && tenure.roleId === "cerenovus" &&
    isRoleTenureContinuousAcross(tenure, input.currentCharacterState.revision, input.currentCharacterState.revision)
  ) ?? [];
  if (tenures.length !== 1 || tenures[0] === undefined) return { valid: false, reason: "FirstNightActionOpportunityCreated Cerenovus source requires exactly one active base role tenure" };
  const tenure = tenures[0];
  return {
    valid: true,
    opportunity: {
      nightNumber: 1,
      opportunityId: formatFirstNightActionOpportunityId({ taskType: "CERENOVUS_ACTION", seatNumber: currentEntry.seatNumber, opportunityIndex: 1 }),
      opportunityKind: "CERENOVUS_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: common.targetTask.taskId,
      taskType: "CERENOVUS_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: cloneRoleSetupSnapshot(currentEntry.role),
      sourceCharacterStateRevision: input.currentCharacterState.revision,
      sourceRoleTenureId: tenure.roleTenureId,
      sourceAbilityInstanceId: formatCerenovusAbilityInstanceId({ roleTenureId: tenure.roleTenureId }),
      abilitySource: {
        kind: "ROLE_TENURE",
        abilityRoleId: "cerenovus",
        roleTenureId: tenure.roleTenureId,
        acquiredCharacterStateRevision: tenure.acquiredCharacterStateRevision
      },
      visibility: createCerenovusActionOpportunityVisibility()
    }
  };
};

export const tryCreateLegacyDreamerFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreateDreamerOpportunityResult => {
  const common = validateCommonOpportunityTarget(input);
  if (!common.valid) {
    return common;
  }

  const targetTask = common.targetTask;
  const currentEntry = currentDreamerEntryForTask(targetTask, input.currentCharacterState);
  if (currentEntry === undefined) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated source is no longer a current Dreamer" };
  }

  return {
    valid: true,
    opportunity: {
      nightNumber: 1,
      opportunityId: formatFirstNightActionOpportunityId({
        taskType: "DREAMER_ACTION",
        seatNumber: currentEntry.seatNumber,
        opportunityIndex: 1
      }),
      opportunityKind: "DREAMER_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: targetTask.taskId,
      taskType: "DREAMER_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: cloneRoleSetupSnapshot(currentEntry.role),
      sourceCharacterStateRevision: input.currentCharacterState.revision,
      visibility: createDreamerActionOpportunityVisibility()
    }
  };
};

const tryCreateBaseDreamerV2ReplayOpportunity = (
  input: OpportunityValidationInput
): CreateDreamerOpportunityResult => {
  if (input.firstNightTaskPlan.nightNumber !== 1 ||
      input.firstNightTaskPlan.taskPlanVersion !== "first-night-task-plan-v2") {
    return { valid: false, reason: "Base Dreamer V2 opportunity requires the V2 first-night task plan" };
  }
  const matchingTasks = input.firstNightTaskPlan.tasks.filter((task) => task.taskId === input.taskId);
  if (matchingTasks.length !== 1 || matchingTasks[0] === undefined) {
    return { valid: false, reason: "Base Dreamer V2 opportunity requires exactly one matching task" };
  }
  const common = validateCommonOpportunityTarget(input);
  if (!common.valid) return common;
  const task = common.targetTask;
  const currentEntry = currentDreamerEntryForTask(task, input.currentCharacterState);
  if (currentEntry === undefined || task.source.kind !== "ROLE") {
    return { valid: false, reason: "Base Dreamer V2 opportunity source is not the current base Dreamer" };
  }
  if (task.taskId !== roleScheduledTaskId("DREAMER_ACTION", currentEntry.seatNumber) ||
      input.currentCharacterState.revision < 1 ||
      !Number.isSafeInteger(input.currentCharacterState.revision)) {
    return { valid: false, reason: "Base Dreamer V2 opportunity requires canonical task and revision identity" };
  }
  if (input.seamstressRoleTenureState === undefined) {
    return { valid: false, reason: "Base Dreamer V2 opportunity requires canonical role-tenure state" };
  }
  let tenure;
  try {
    tenure = findUniqueActiveRoleTenure({
      state: input.seamstressRoleTenureState,
      playerId: currentEntry.playerId,
      seatNumber: currentEntry.seatNumber,
      roleId: "dreamer",
      revision: input.currentCharacterState.revision
    });
  } catch {
    return { valid: false, reason: "Base Dreamer V2 opportunity role-tenure state is invalid" };
  }
  if (tenure === undefined || tenure.playerId !== currentEntry.playerId ||
      tenure.seatNumber !== currentEntry.seatNumber || tenure.roleId !== "dreamer" ||
      tenure.acquiredCharacterStateRevision > input.currentCharacterState.revision ||
      (tenure.endedCharacterStateRevision !== undefined &&
       tenure.endedCharacterStateRevision <= input.currentCharacterState.revision)) {
    return { valid: false, reason: "Base Dreamer V2 opportunity requires exactly one matching active Dreamer tenure" };
  }
  const parsedTenure = parseRoleTenureId(tenure.roleTenureId);
  if (!parsedTenure.valid || parsedTenure.seatNumber !== currentEntry.seatNumber ||
      parsedTenure.roleId !== "dreamer" ||
      parsedTenure.acquiredCharacterStateRevision !== tenure.acquiredCharacterStateRevision) {
    return { valid: false, reason: "Base Dreamer V2 opportunity tenure identity must round-trip canonically" };
  }
  const sourceAbilityInstanceId = formatBaseFirstNightAbilityInstanceId(task.taskId);
  const parsedInstance = parseFirstNightAbilityInstanceId(sourceAbilityInstanceId);
  if (!parsedInstance.valid || parsedInstance.kind !== "BASE_ROLE_TASK" ||
      parsedInstance.generation !== "BASE" || parsedInstance.taskId !== task.taskId ||
      parsedInstance.taskType !== "DREAMER_ACTION" || parsedInstance.embeddedSeat !== currentEntry.seatNumber) {
    return { valid: false, reason: "Base Dreamer V2 ability instance must round-trip canonically" };
  }
  const sourceContract: BaseDreamerV2SourceContract = {
    sourceContractVersion: DREAMER_BASE_SOURCE_CONTRACT_VERSION,
    kind: "BASE",
    taskPlanVersion: "first-night-task-plan-v2",
    taskId: task.taskId,
    taskType: "DREAMER_ACTION",
    sourcePlayerId: currentEntry.playerId,
    sourceSeatNumber: currentEntry.seatNumber,
    sourceRoleId: "dreamer",
    sourceRoleTenureId: tenure.roleTenureId,
    sourceCharacterStateRevision: input.currentCharacterState.revision,
    sourceAbilityInstanceId
  };
  return {
    valid: true,
    opportunity: {
      opportunitySchemaVersion: DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION,
      nightNumber: 1,
      opportunityId: formatBaseDreamerV2FirstNightActionOpportunityId({ seatNumber: currentEntry.seatNumber }),
      opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V2",
      opportunityStatus: "OPEN",
      taskId: task.taskId,
      taskType: "DREAMER_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: cloneRoleSetupSnapshot(currentEntry.role),
      sourceCharacterStateRevision: input.currentCharacterState.revision,
      sourceContract,
      visibility: createDreamerActionOpportunityVisibilityV2()
    }
  };
};

const tryCreateBaseDreamerV3FirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreateDreamerOpportunityResult => {
  const replayV2 = tryCreateBaseDreamerV2ReplayOpportunity(input);
  if (!replayV2.valid) return replayV2;
  const source = replayV2.opportunity;
  if (!isDreamerActionOpportunityV2(source)) {
    return { valid: false, reason: "Base Dreamer V3 opportunity requires canonical base source provenance" };
  }
  return {
    valid: true,
    opportunity: {
      opportunitySchemaVersion: DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION,
      nightNumber: 1,
      opportunityId: source.opportunityId,
      opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V3",
      opportunityStatus: "OPEN",
      taskId: source.taskId,
      taskType: "DREAMER_ACTION",
      sourcePlayerId: source.sourcePlayerId,
      sourceSeatNumber: source.sourceSeatNumber,
      sourceRole: cloneRoleSetupSnapshot(source.sourceRole),
      sourceCharacterStateRevision: source.sourceCharacterStateRevision,
      sourceContract: { ...source.sourceContract },
      visibility: createDreamerActionOpportunityVisibilityV3()
    }
  };
};

export const tryCreateDreamerFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreateDreamerOpportunityResult =>
  input.firstNightTaskPlan.taskPlanVersion === "first-night-task-plan-v2"
    ? tryCreateBaseDreamerV3FirstNightActionOpportunity(input)
    : tryCreateLegacyDreamerFirstNightActionOpportunity(input);

export const tryCreateSeamstressFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreateSeamstressOpportunityResult => {
  const common = validateCommonOpportunityTarget(input);
  if (!common.valid) {
    return common;
  }

  if (input.seamstressResolutionCapability?.capabilityVersion !== SEAMSTRESS_RESOLUTION_CAPABILITY_VERSION) {
    return { valid: false, reason: "FirstNightActionOpportunityCreated V2 Seamstress source requires the public resolution capability" };
  }
  const targetTask = common.targetTask;
  const baseEntry = currentSeamstressEntryForTask(targetTask, input.currentCharacterState);
  const philosopherEntry = currentPhilosopherGainedSeamstressEntryForTask(targetTask, input.currentCharacterState);
  const currentEntry = baseEntry ?? philosopherEntry;
  if (currentEntry === undefined) return { valid: false, reason: "FirstNightActionOpportunityCreated source is not a current supported Seamstress ability holder" };
  let grantIdValue: GrantedAbilityId | undefined;
  if (targetTask.source.kind === "PHILOSOPHER_GAINED_ABILITY") {
    const philosopherSource = targetTask.source;
    const matchingGrants = input.philosopherGrantedAbilities?.abilities.filter((grant) =>
      grant.sourcePlayerId === philosopherSource.playerId && grant.sourceSeatNumber === philosopherSource.seatNumber &&
      grant.sourceCharacterStateRevision === philosopherSource.sourceCharacterStateRevision &&
      grant.grantedAtOpportunityId === philosopherSource.opportunityId && grant.chosenRoleId === SEAMSTRESS_ROLE_ID &&
      sameRoleSetupSnapshot(grant.sourceRole, philosopherSource.sourceRole) &&
      sameRoleSetupSnapshot(grant.chosenRole, philosopherSource.chosenRole)
    ) ?? [];
    if (matchingGrants.length !== 1 || matchingGrants[0] === undefined) {
      return { valid: false, reason: "FirstNightActionOpportunityCreated Philosopher Seamstress source requires one exact grant" };
    }
    grantIdValue = matchingGrants[0].grantId;
  }
  const active = findActiveSeamstressAbilityForSource({
    roleTenures: input.seamstressRoleTenureState,
    abilityState: input.seamstressAbilityState,
    sourcePlayerId: currentEntry.playerId,
    sourceSeatNumber: currentEntry.seatNumber,
    sourceKind: baseEntry === undefined ? "PHILOSOPHER_GAINED_ABILITY" : "ROLE",
    revision: input.currentCharacterState.revision,
    ...(grantIdValue === undefined ? {} : { grantId: grantIdValue })
  });
  if (active === undefined || active.entitlement.status !== "UNSPENT") {
    return { valid: false, reason: "FirstNightActionOpportunityCreated Seamstress instance must be active with an unspent entitlement" };
  }

  return {
    valid: true,
    opportunity: {
      nightNumber: 1,
      opportunityId: baseEntry === undefined
        ? formatPhilosopherGainedSeamstressActionOpportunityId({ seatNumber: currentEntry.seatNumber, opportunityIndex: 1 })
        : formatFirstNightActionOpportunityId({ taskType: "SEAMSTRESS_ACTION", seatNumber: currentEntry.seatNumber, opportunityIndex: 1 }),
      opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: targetTask.taskId,
      taskType: "SEAMSTRESS_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: cloneRoleSetupSnapshot(currentEntry.role),
      sourceCharacterStateRevision: input.currentCharacterState.revision,
      sourceRoleTenureId: active.tenure.roleTenureId,
      abilitySource: { ...active.instance.source },
      abilityInstanceId: active.instance.abilityInstanceId,
      abilityUseEntitlementId: active.entitlement.abilityUseEntitlementId,
      visibility: createSeamstressActionOpportunityVisibilityV2()
    }
  };
};

export const tryCreateLegacySeamstressFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): CreateSeamstressOpportunityResult => {
  const common = validateCommonOpportunityTarget(input);
  if (!common.valid) return common;
  const currentEntry = currentSeamstressEntryForTask(common.targetTask, input.currentCharacterState);
  if (currentEntry === undefined) return { valid: false, reason: "Legacy Seamstress opportunity requires the current base Seamstress" };
  return {
    valid: true,
    opportunity: {
      nightNumber: 1,
      opportunityId: formatFirstNightActionOpportunityId({ taskType: "SEAMSTRESS_ACTION", seatNumber: currentEntry.seatNumber, opportunityIndex: 1 }),
      opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION",
      opportunityStatus: "OPEN",
      taskId: common.targetTask.taskId,
      taskType: "SEAMSTRESS_ACTION",
      sourcePlayerId: currentEntry.playerId,
      sourceSeatNumber: currentEntry.seatNumber,
      sourceRole: cloneRoleSetupSnapshot(currentEntry.role),
      sourceCharacterStateRevision: input.currentCharacterState.revision,
      visibility: createSeamstressActionOpportunityVisibilityV1()
    }
  };
};

export const createLegacySeamstressFirstNightActionOpportunity = (
  input: OpportunityValidationInput
): SeamstressActionOpportunityV1 => {
  const result = tryCreateLegacySeamstressFirstNightActionOpportunity(input);
  if (!result.valid || isSeamstressActionOpportunityV2(result.opportunity)) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", result.valid ? "Legacy creator produced V2" : result.reason);
  }
  return result.opportunity;
};

export const tryCreateFirstNightRoleActionOpportunity = (
  input: OpportunityValidationInput
): CreateOpportunityResult => {
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask?.taskType === "PHILOSOPHER_ACTION") {
    return tryCreatePhilosopherFirstNightActionOpportunity(input);
  }

  if (targetTask?.taskType === "SNAKE_CHARMER_ACTION") {
    return tryCreateSnakeCharmerFirstNightActionOpportunity(input);
  }

  if (targetTask?.taskType === "WITCH_ACTION") {
    return tryCreateWitchFirstNightActionOpportunity(input);
  }

  if (targetTask?.taskType === "CERENOVUS_ACTION") {
    return tryCreateCerenovusFirstNightActionOpportunity(input);
  }

  if (targetTask?.taskType === "DREAMER_ACTION") {
    return tryCreateDreamerFirstNightActionOpportunity(input);
  }

  if (targetTask?.taskType === "SEAMSTRESS_ACTION") {
    return tryCreateSeamstressFirstNightActionOpportunity(input);
  }

  return { valid: false, reason: "FirstNightActionOpportunityCreated task type is not supported as a first-night role action opportunity" };
};

export const createFirstNightRoleActionOpportunity = (
  input: OpportunityValidationInput
): FirstNightActionOpportunity => {
  const result = tryCreateFirstNightRoleActionOpportunity(input);
  if (!result.valid) {
    throw new DomainError("InvalidFirstNightActionOpportunityCreatedPayload", result.reason);
  }

  return result.opportunity;
};

const validateFirstNightActionOpportunityCreatedPayloadInternal = (
  payload: unknown,
  input: OpportunityValidationInput
): ValidationResult => {
  if (!isCanonicalDataValue(payload) || !isPlainRecord(payload)) {
    return fail("FirstNightActionOpportunityCreated payload must have exact runtime shape");
  }
  const seamstressV2 = payload.opportunityKind === "SEAMSTRESS_FIRST_NIGHT_ACTION" && isPlainRecord(payload.visibility) &&
    Object.hasOwn(payload.visibility, "visibilitySchemaVersion");
  const cerenovus = payload.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION";
  const dreamerV2 = payload.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V2";
  const dreamerV3 = payload.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V3";
  if (!hasExactEnumerableKeys(payload, dreamerV3
    ? DREAMER_V3_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS
    : dreamerV2 ? DREAMER_V2_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS
    : cerenovus
    ? CERENOVUS_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS
    : seamstressV2
    ? SEAMSTRESS_ACTION_OPPORTUNITY_CREATED_PAYLOAD_V2_KEYS
    : FIRST_NIGHT_ACTION_OPPORTUNITY_CREATED_PAYLOAD_KEYS)) {
    return fail("FirstNightActionOpportunityCreated payload must have exact runtime shape");
  }

  if (typeof payload.rulesBaselineVersion !== "string") {
    return fail("FirstNightActionOpportunityCreated rulesBaselineVersion must be a string");
  }

  const opportunityCandidate = {
    nightNumber: payload.nightNumber,
    opportunityId: payload.opportunityId,
    opportunityKind: payload.opportunityKind,
    opportunityStatus: payload.opportunityStatus,
    sourceCharacterStateRevision: payload.sourceCharacterStateRevision,
    sourcePlayerId: payload.sourcePlayerId,
    sourceRole: payload.sourceRole,
    sourceSeatNumber: payload.sourceSeatNumber,
    taskId: payload.taskId,
    taskType: payload.taskType,
    visibility: payload.visibility,
    ...(dreamerV2 || dreamerV3 ? {
      opportunitySchemaVersion: payload.opportunitySchemaVersion,
      sourceContract: payload.sourceContract
    } : cerenovus ? {
      sourceRoleTenureId: payload.sourceRoleTenureId,
      sourceAbilityInstanceId: payload.sourceAbilityInstanceId,
      abilitySource: payload.abilitySource
    } : seamstressV2 ? {
      sourceRoleTenureId: payload.sourceRoleTenureId,
      abilitySource: payload.abilitySource,
      abilityInstanceId: payload.abilityInstanceId,
      abilityUseEntitlementId: payload.abilityUseEntitlementId
    } : {})
  };
  if (!hasExactFirstNightActionOpportunityShape(opportunityCandidate)) {
    return fail("FirstNightActionOpportunityCreated fields must use supported primitive values");
  }

  if (payload.opportunityStatus !== "OPEN") {
    return fail("FirstNightActionOpportunityCreated must create an OPEN opportunity");
  }

  const expected = payload.opportunityKind === "SEAMSTRESS_FIRST_NIGHT_ACTION" && !seamstressV2
    ? tryCreateLegacySeamstressFirstNightActionOpportunity(input)
    : payload.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION"
    ? tryCreateLegacyDreamerFirstNightActionOpportunity(input)
    : payload.opportunityKind === "DREAMER_FIRST_NIGHT_ACTION_V2"
    ? tryCreateBaseDreamerV2ReplayOpportunity(input)
    : tryCreateFirstNightRoleActionOpportunity(input);
  if (!expected.valid) {
    return expected;
  }

  if (!sameOpportunityCore(payload as unknown as FirstNightActionOpportunity, expected.opportunity)) {
    return fail("FirstNightActionOpportunityCreated must match the current role action task source and deterministic opportunity id");
  }

  return { valid: true };
};

export const validateFirstNightActionOpportunityCreatedPayload = (
  payload: unknown,
  input: OpportunityValidationInput
): ValidationResult => {
  try {
    return validateFirstNightActionOpportunityCreatedPayloadInternal(payload, input);
  } catch {
    return fail("FirstNightActionOpportunityCreated payload validation failed closed");
  }
};

export const validateSeamstressActionDecision = (
  decision: unknown
): SeamstressActionDecisionValidationResult => {
  if (!isPlainRecord(decision) || typeof decision.kind !== "string") {
    return {
      valid: false,
      code: "InvalidSeamstressActionDecision",
      reason: "SubmitSeamstressAction decision must be a non-null plain object with a supported kind"
    };
  }

  if (decision.kind === "CHOOSE_TWO_PLAYERS") {
    if (!hasExactEnumerableKeys(decision, ["kind", "targetPlayerIds"]) || !Array.isArray(decision.targetPlayerIds) ||
        !isDenseArray(decision.targetPlayerIds) || decision.targetPlayerIds.length !== 2 ||
        decision.targetPlayerIds.some((id) => typeof id !== "string" || id.trim().length === 0)) {
      return { valid: false, code: "InvalidSeamstressTarget", reason: "SubmitSeamstressAction requires exactly two dense player IDs" };
    }
    return { valid: true };
  }

  if (decision.kind !== "DEFER" || !hasExactEnumerableKeys(decision, ["kind"])) {
    return {
      valid: false,
      code: "InvalidSeamstressActionDecision",
      reason: "SubmitSeamstressAction decision must be exactly DEFER without extra fields"
    };
  }

  return { valid: true };
};

export const validateSeamstressActionDecisionForOpportunity = (
  decision: unknown,
  opportunity: SeamstressActionOpportunity
): SeamstressActionDecisionValidationResult => {
  const shape = validateSeamstressActionDecision(decision);
  if (!shape.valid) return shape;
  if ((decision as SeamstressActionDecision).kind === "CHOOSE_TWO_PLAYERS" && !isSeamstressActionOpportunityV2(opportunity)) {
    return { valid: false, code: "UnsupportedSeamstressActionDecision", reason: "Legacy V1 Seamstress opportunities are defer-only" };
  }
  return { valid: true };
};

export const validatePhilosopherActionDeferredPayload = (
  payload: unknown,
  input: Omit<OpportunityValidationInput, "taskId"> & {
    readonly taskId: ScheduledTaskId;
  }
): ValidationResult => {
  if (!isPlainRecord(payload) || !hasExactEnumerableKeys(payload, PHILOSOPHER_ACTION_DEFERRED_PAYLOAD_KEYS)) {
    return fail("PhilosopherActionDeferred payload must have exact runtime shape");
  }

  if (
    typeof payload.rulesBaselineVersion !== "string" ||
    payload.nightNumber !== 1 ||
    typeof payload.taskId !== "string" ||
    payload.taskId.trim().length === 0 ||
    payload.taskType !== "PHILOSOPHER_ACTION" ||
    typeof payload.opportunityId !== "string" ||
    payload.opportunityId.trim().length === 0 ||
    payload.decisionKind !== "DEFER" ||
    typeof payload.sourcePlayerId !== "string" ||
    payload.sourcePlayerId.trim().length === 0 ||
    typeof payload.sourceSeatNumber !== "number" ||
    !Number.isInteger(payload.sourceSeatNumber) ||
    payload.sourceSeatNumber < 1 ||
    payload.sourceSeatNumber > 12 ||
    !hasExactRoleSetupSnapshotShape(payload.sourceRole) ||
    typeof payload.sourceCharacterStateRevision !== "number" ||
    !Number.isInteger(payload.sourceCharacterStateRevision) ||
    payload.sourceCharacterStateRevision <= 0
  ) {
    return fail("PhilosopherActionDeferred fields must use supported primitive values");
  }

  const parsedId = parseFirstNightActionOpportunityId(actionOpportunityId(payload.opportunityId));
  if (!parsedId.valid) {
    return parsedId;
  }

  const opportunity = findFirstNightActionOpportunityById(
    input.firstNightActionOpportunities,
    actionOpportunityId(payload.opportunityId)
  );
  if (opportunity === undefined || opportunity.opportunityStatus !== "OPEN") {
    return fail("PhilosopherActionDeferred must reference an OPEN first-night action opportunity");
  }

  if (
    opportunity.taskId !== payload.taskId ||
    opportunity.taskId !== input.taskId ||
    opportunity.taskType !== payload.taskType ||
    opportunity.sourcePlayerId !== payload.sourcePlayerId ||
    opportunity.sourceSeatNumber !== payload.sourceSeatNumber ||
    !sameRoleSetupSnapshot(opportunity.sourceRole, payload.sourceRole) ||
    opportunity.sourceCharacterStateRevision !== payload.sourceCharacterStateRevision
  ) {
    return fail("PhilosopherActionDeferred must match the referenced first-night action opportunity");
  }

  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) {
    return fail("PhilosopherActionDeferred must reference a task in the first-night task plan");
  }

  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) {
    return fail("PhilosopherActionDeferred cannot target a settled task");
  }

  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId || nextTask.taskType !== "PHILOSOPHER_ACTION") {
    return fail("PhilosopherActionDeferred must target the current next unsettled Philosopher task");
  }

  const currentEntry = currentPhilosopherEntryForTask(targetTask, input.currentCharacterState);
  if (
    currentEntry === undefined ||
    currentEntry.playerId !== opportunity.sourcePlayerId ||
    currentEntry.seatNumber !== opportunity.sourceSeatNumber ||
    input.currentCharacterState.revision !== opportunity.sourceCharacterStateRevision
  ) {
    return fail("PhilosopherActionDeferred source is no longer the same current Philosopher state");
  }

  return { valid: true };
};

export const validateSeamstressActionDeferredPayload = (
  payload: unknown,
  input: Omit<OpportunityValidationInput, "taskId"> & {
    readonly taskId: ScheduledTaskId;
  }
): ValidationResult => {
  if (!isPlainRecord(payload)) {
    return fail("SeamstressActionDeferred payload must have exact runtime shape");
  }
  const v2 = Object.hasOwn(payload, "deferSchemaVersion");
  if (!hasExactEnumerableKeys(payload, v2 ? SEAMSTRESS_ACTION_DEFERRED_PAYLOAD_V2_KEYS : SEAMSTRESS_ACTION_DEFERRED_PAYLOAD_V1_KEYS)) {
    return fail("SeamstressActionDeferred payload must have exact versioned runtime shape");
  }
  if (typeof payload.rulesBaselineVersion !== "string" || payload.nightNumber !== 1 ||
      typeof payload.taskId !== "string" || payload.taskId.trim().length === 0 || payload.taskType !== "SEAMSTRESS_ACTION" ||
      typeof payload.opportunityId !== "string" || payload.opportunityId.trim().length === 0 || payload.decisionKind !== "DEFER" ||
      typeof payload.sourcePlayerId !== "string" || payload.sourcePlayerId.trim().length === 0 ||
      typeof payload.sourceSeatNumber !== "number" || !Number.isInteger(payload.sourceSeatNumber) ||
      payload.sourceSeatNumber < 1 || payload.sourceSeatNumber > 12 || !hasExactRoleSetupSnapshotShape(payload.sourceRole)) {
    return fail("SeamstressActionDeferred fields must use supported primitive values");
  }
  const parsedId = parseFirstNightActionOpportunityId(actionOpportunityId(payload.opportunityId));
  if (!parsedId.valid) return parsedId;
  const opportunity = findFirstNightActionOpportunityById(
    input.firstNightActionOpportunities,
    actionOpportunityId(payload.opportunityId)
  );
  if (opportunity === undefined || opportunity.opportunityStatus !== "OPEN" ||
      opportunity.opportunityKind !== "SEAMSTRESS_FIRST_NIGHT_ACTION") {
    return fail("SeamstressActionDeferred must reference an OPEN Seamstress first-night action opportunity");
  }
  if (opportunity.taskId !== payload.taskId || opportunity.taskId !== input.taskId || opportunity.taskType !== payload.taskType ||
      opportunity.sourcePlayerId !== payload.sourcePlayerId || opportunity.sourceSeatNumber !== payload.sourceSeatNumber ||
      !sameRoleSetupSnapshot(opportunity.sourceRole, payload.sourceRole)) {
    return fail("SeamstressActionDeferred must match the referenced first-night action opportunity");
  }
  const targetTask = input.firstNightTaskPlan.tasks.find((task) => task.taskId === input.taskId);
  if (targetTask === undefined) return fail("SeamstressActionDeferred must reference a task in the first-night task plan");
  if (isFirstNightTaskSettled(input.firstNightTaskProgress, input.taskId)) return fail("SeamstressActionDeferred cannot target a settled task");
  const nextTask = getNextUnsettledFirstNightTask(input.firstNightTaskPlan, input.firstNightTaskProgress);
  if (nextTask === undefined || nextTask.taskId !== targetTask.taskId || nextTask.taskType !== "SEAMSTRESS_ACTION") {
    return fail("SeamstressActionDeferred must target the current next unsettled Seamstress task");
  }
  if (!v2) {
    if (isSeamstressActionOpportunityV2(opportunity) || typeof payload.sourceCharacterStateRevision !== "number" ||
        !Number.isInteger(payload.sourceCharacterStateRevision) || payload.sourceCharacterStateRevision <= 0 ||
        payload.sourceCharacterStateRevision !== opportunity.sourceCharacterStateRevision ||
        input.currentCharacterState.revision !== opportunity.sourceCharacterStateRevision) {
      return fail("Legacy SeamstressActionDeferred must match V1 at creation revision");
    }
    const currentEntry = currentSeamstressEntryForTask(targetTask, input.currentCharacterState);
    return currentEntry !== undefined && currentEntry.playerId === opportunity.sourcePlayerId && currentEntry.seatNumber === opportunity.sourceSeatNumber
      ? { valid: true }
      : fail("Legacy SeamstressActionDeferred source is no longer the same base Seamstress state");
  }
  if (!isSeamstressActionOpportunityV2(opportunity) || payload.deferSchemaVersion !== "seamstress-action-deferred-v2" ||
      typeof payload.opportunityCharacterStateRevision !== "number" || !Number.isInteger(payload.opportunityCharacterStateRevision) ||
      typeof payload.settlementCharacterStateRevision !== "number" || !Number.isInteger(payload.settlementCharacterStateRevision) ||
      payload.opportunityCharacterStateRevision !== opportunity.sourceCharacterStateRevision ||
      payload.settlementCharacterStateRevision !== input.currentCharacterState.revision ||
      payload.settlementCharacterStateRevision < payload.opportunityCharacterStateRevision ||
      payload.sourceRoleTenureId !== opportunity.sourceRoleTenureId || payload.abilityInstanceId !== opportunity.abilityInstanceId ||
      payload.abilityUseEntitlementId !== opportunity.abilityUseEntitlementId) {
    return fail("V2 SeamstressActionDeferred must exactly match its opportunity and N/M revisions");
  }
  const tenure = input.seamstressRoleTenureState?.records.find((record) => record.roleTenureId === opportunity.sourceRoleTenureId);
  const instance = input.seamstressAbilityState?.instances.find((entry) => entry.abilityInstanceId === opportunity.abilityInstanceId);
  const entitlement = input.seamstressAbilityState?.entitlements.find((entry) => entry.abilityUseEntitlementId === opportunity.abilityUseEntitlementId);
  const currentEntry = input.currentCharacterState.entries.find((entry) => entry.playerId === opportunity.sourcePlayerId && entry.seatNumber === opportunity.sourceSeatNumber);
  if (tenure === undefined || instance === undefined || entitlement === undefined || entitlement.status !== "UNSPENT" ||
      !isRoleTenureContinuousAcross(tenure, opportunity.sourceCharacterStateRevision, input.currentCharacterState.revision) ||
      currentEntry === undefined || currentEntry.role.roleId !== tenure.roleId) {
    return fail("V2 SeamstressActionDeferred source tenure and unspent entitlement must remain active across N/M");
  }
  return { valid: true };
};

export const appendFirstNightActionOpportunity = (
  state: FirstNightActionOpportunityState | undefined,
  payload: FirstNightActionOpportunityCreatedPayload
): FirstNightActionOpportunityState => ({
  opportunities: [
    ...cloneFirstNightActionOpportunityState(state).opportunities,
    cloneFirstNightActionOpportunity(payload)
  ]
});

const closeFirstNightActionOpportunityWithError = (
  state: FirstNightActionOpportunityState | undefined,
  payload: Pick<FirstNightActionOpportunity, "opportunityId">,
  errorCode: "InvalidPhilosopherActionDeferredPayload" | "InvalidSeamstressActionDeferredPayload" | "InvalidSeamstressInformationDeliveredPayload" | "InvalidCerenovusChoiceRecordedPayload",
  eventName: "PhilosopherActionDeferred" | "SeamstressActionDeferred" | "SeamstressInformationDelivered" | "CerenovusChoiceRecorded"
): FirstNightActionOpportunityState => {
  const opportunities = cloneFirstNightActionOpportunityState(state).opportunities;
  let found = false;
  const nextOpportunities = opportunities.map((opportunity) => {
    if (opportunity.opportunityId !== payload.opportunityId) {
      return opportunity;
    }

    found = true;
    return {
      ...opportunity,
      opportunityStatus: "CLOSED" as const
    };
  });

  if (!found) {
    throw new DomainError(errorCode, `${eventName} cannot close an unknown opportunity`);
  }

  return {
    opportunities: nextOpportunities
  };
};

export const closeFirstNightActionOpportunity = (
  state: FirstNightActionOpportunityState | undefined,
  payload: Pick<PhilosopherActionDeferredPayload, "opportunityId">
): FirstNightActionOpportunityState =>
  closeFirstNightActionOpportunityWithError(
    state,
    payload,
    "InvalidPhilosopherActionDeferredPayload",
    "PhilosopherActionDeferred"
  );

export const closeSeamstressFirstNightActionOpportunity = (
  state: FirstNightActionOpportunityState | undefined,
  payload: Pick<SeamstressActionDeferredPayload, "opportunityId">
): FirstNightActionOpportunityState =>
  closeFirstNightActionOpportunityWithError(
    state,
    payload,
    "InvalidSeamstressActionDeferredPayload",
    "SeamstressActionDeferred"
  );

export const closeSeamstressInformationOpportunity = (
  state: FirstNightActionOpportunityState | undefined,
  payload: { readonly opportunityId: ActionOpportunityId }
): FirstNightActionOpportunityState =>
  closeFirstNightActionOpportunityWithError(
    state,
    payload,
    "InvalidSeamstressInformationDeliveredPayload",
    "SeamstressInformationDelivered"
  );

export const closeCerenovusFirstNightActionOpportunity = (
  state: FirstNightActionOpportunityState | undefined,
  payload: { readonly opportunityId: ActionOpportunityId }
): FirstNightActionOpportunityState =>
  closeFirstNightActionOpportunityWithError(
    state,
    payload,
    "InvalidCerenovusChoiceRecordedPayload",
    "CerenovusChoiceRecorded"
  );

export const createPhilosopherDeferredScheduledTaskSettlement = (input: {
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): ScheduledTaskSettlement => ({
  taskId: input.taskId,
  taskType: "PHILOSOPHER_ACTION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "PHILOSOPHER_DEFERRED",
  characterStateRevision: input.characterStateRevision
});

export const hasClosedPhilosopherOpportunityForSettlement = (
  state: FirstNightActionOpportunityState | undefined,
  settlement: Pick<ScheduledTaskSettlement, "taskId" | "taskType" | "characterStateRevision">
): boolean =>
  state?.opportunities.some((opportunity) =>
    opportunity.opportunityStatus === "CLOSED" &&
    opportunity.taskId === settlement.taskId &&
    opportunity.taskType === settlement.taskType &&
    opportunity.sourceCharacterStateRevision === settlement.characterStateRevision
  ) ?? false;

export const createSeamstressDeferredScheduledTaskSettlement = (input: {
  readonly taskId: ScheduledTaskId;
  readonly characterStateRevision: number;
}): ScheduledTaskSettlement => ({
  taskId: input.taskId,
  taskType: "SEAMSTRESS_ACTION",
  nightNumber: 1,
  settlementVersion: SUPPORTED_SCHEDULED_TASK_SETTLEMENT_VERSION,
  outcomeType: "SEAMSTRESS_DEFERRED",
  characterStateRevision: input.characterStateRevision
});

export const createSeamstressActionDeferredPayloadV2 = (input: {
  readonly rulesBaselineVersion: string;
  readonly opportunity: SeamstressActionOpportunityV2;
  readonly settlementCharacterStateRevision: number;
}): SeamstressActionDeferredPayloadV2 => ({
  rulesBaselineVersion: input.rulesBaselineVersion,
  deferSchemaVersion: "seamstress-action-deferred-v2",
  nightNumber: 1,
  taskId: input.opportunity.taskId,
  taskType: "SEAMSTRESS_ACTION",
  opportunityId: input.opportunity.opportunityId,
  decisionKind: "DEFER",
  abilityInstanceId: input.opportunity.abilityInstanceId,
  abilityUseEntitlementId: input.opportunity.abilityUseEntitlementId,
  sourceRoleTenureId: input.opportunity.sourceRoleTenureId,
  sourcePlayerId: input.opportunity.sourcePlayerId,
  sourceSeatNumber: input.opportunity.sourceSeatNumber,
  sourceRole: cloneRoleSetupSnapshot(input.opportunity.sourceRole),
  opportunityCharacterStateRevision: input.opportunity.sourceCharacterStateRevision,
  settlementCharacterStateRevision: input.settlementCharacterStateRevision
});

export const hasClosedSeamstressOpportunityForSettlement = (
  state: FirstNightActionOpportunityState | undefined,
  settlement: Pick<ScheduledTaskSettlement, "taskId" | "taskType" | "characterStateRevision">
): boolean =>
  state?.opportunities.some((opportunity) =>
    opportunity.opportunityKind === "SEAMSTRESS_FIRST_NIGHT_ACTION" &&
    opportunity.opportunityStatus === "CLOSED" &&
    opportunity.taskId === settlement.taskId &&
    opportunity.taskType === settlement.taskType &&
    (isSeamstressActionOpportunityV2(opportunity)
      ? settlement.characterStateRevision >= opportunity.sourceCharacterStateRevision
      : opportunity.sourceCharacterStateRevision === settlement.characterStateRevision)
  ) ?? false;

export const isSupportedFirstNightRoleActionTaskType = (
  taskType: FirstNightTaskType
): taskType is "PHILOSOPHER_ACTION" | "SNAKE_CHARMER_ACTION" | "WITCH_ACTION" | "CERENOVUS_ACTION" | "DREAMER_ACTION" | "SEAMSTRESS_ACTION" =>
  taskType === "PHILOSOPHER_ACTION" ||
  taskType === "SNAKE_CHARMER_ACTION" ||
  taskType === "WITCH_ACTION" ||
  taskType === "CERENOVUS_ACTION" ||
  taskType === "DREAMER_ACTION" ||
  taskType === "SEAMSTRESS_ACTION";

export const isSupportedFirstNightRoleActionTask = (
  task: ScheduledTask
): boolean =>
  task.taskType === "PHILOSOPHER_ACTION" ||
  (
    task.taskType === "SNAKE_CHARMER_ACTION" &&
    task.source.kind === "ROLE" &&
    task.source.role.roleId === SNAKE_CHARMER_ROLE_ID
  ) ||
  (
    task.taskType === "SNAKE_CHARMER_ACTION" &&
    task.source.kind === "PHILOSOPHER_GAINED_ABILITY" &&
    task.source.sourceRole.roleId === PHILOSOPHER_ROLE_ID &&
    task.source.chosenRole.roleId === SNAKE_CHARMER_ROLE_ID
  ) ||
  (
    task.taskType === "WITCH_ACTION" &&
    task.source.kind === "ROLE" &&
    task.source.role.roleId === WITCH_ROLE_ID
  ) ||
  (
    task.taskType === "CERENOVUS_ACTION" &&
    task.source.kind === "ROLE" &&
    task.source.role.roleId === CERENOVUS_ROLE_ID
  ) ||
  (
    task.taskType === "DREAMER_ACTION" &&
    task.source.kind === "ROLE" &&
    task.source.role.roleId === DREAMER_ROLE_ID
  ) ||
  (
    task.taskType === "SEAMSTRESS_ACTION" &&
    task.source.kind === "ROLE" &&
    task.source.role.roleId === SEAMSTRESS_ROLE_ID
  ) ||
  (
    task.taskType === "SEAMSTRESS_ACTION" &&
    task.source.kind === "PHILOSOPHER_GAINED_ABILITY" &&
    task.source.sourceRole.roleId === PHILOSOPHER_ROLE_ID &&
    task.source.chosenRole.roleId === SEAMSTRESS_ROLE_ID
  );
