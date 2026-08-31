import type { ActionOpportunityId, CommandId, CorrelationId, GameId, PlayerId, ScheduledTaskId } from "./ids.js";
import type { PhilosopherActionDecision, SeamstressActionDecision } from "./first-night-action-opportunity.js";
import type { SnakeCharmerActionDecision } from "./snake-charmer.js";
import type { WitchActionDecision } from "./witch.js";
import type { DreamerActionDecision } from "./dreamer.js";
import type { CerenovusActionDecision } from "./cerenovus.js";
import type { SetupGenerationConstraints } from "./setup-types.js";
import { hasExactEnumerableKeys, isPlainRecord } from "./initial-private-knowledge.js";

export type HumanActor = {
  readonly kind: "human";
  readonly playerId: PlayerId;
};

export type AIActor = {
  readonly kind: "ai";
  readonly playerId: PlayerId;
};

export type SystemActor = {
  readonly kind: "system";
  readonly systemId: "application" | "scheduler" | "test";
};

export type StorytellerActor = {
  readonly kind: "storyteller";
};

export type CommandActor = HumanActor | AIActor | SystemActor | StorytellerActor;

export type CommandEnvelope<TPayload> = {
  readonly commandId: CommandId;
  readonly gameId: GameId;
  readonly expectedGameVersion: number;
  readonly actor: CommandActor;
  readonly issuedAt: string;
  readonly correlationId: CorrelationId;
  readonly payload: TPayload;
};

export type CreateGameCommandPayload = {
  readonly commandType: "CreateGame";
  readonly rootSeed: string;
  readonly rulesBaselineVersion: string;
  readonly playerCount: number;
  readonly humanPlayerCount: number;
  readonly aiPlayerCount: number;
  readonly storytellerCount: number;
};

export type SelectScriptCommandPayload = {
  readonly commandType: "SelectScript";
  readonly scriptId: string;
  readonly scriptName: string;
  readonly edition: string;
};

export type GenerateSetupCommandPayload = {
  readonly commandType: "GenerateSetup";
  readonly constraints: SetupGenerationConstraints;
};

export type CreatePlayerRosterCommandPayload = {
  readonly commandType: "CreatePlayerRoster";
  readonly humanPlayerId: PlayerId;
  readonly humanDisplayName: string;
  readonly humanSeatNumber: number;
};

export type AssignCharactersCommandPayload = {
  readonly commandType: "AssignCharacters";
};

export type InitializeFirstNightCommandPayload = {
  readonly commandType: "InitializeFirstNight";
};

export type PlanFirstNightTasksCommandPayload = {
  readonly commandType: "PlanFirstNightTasks";
};

export type SettleFirstNightSystemTaskCommandPayload = {
  readonly commandType: "SettleFirstNightSystemTask";
  readonly taskId: ScheduledTaskId;
};

export type SettleEvilTwinSetupCommandPayload = {
  readonly commandType: "SettleEvilTwinSetup";
  readonly taskId: ScheduledTaskId;
};

export type OpenFirstNightRoleActionOpportunityCommandPayload = {
  readonly commandType: "OpenFirstNightRoleActionOpportunity";
  readonly taskId: ScheduledTaskId;
};

export type SubmitPhilosopherActionCommandPayload = {
  readonly commandType: "SubmitPhilosopherAction";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly decision: PhilosopherActionDecision;
};

export type SubmitSnakeCharmerActionCommandPayload = {
  readonly commandType: "SubmitSnakeCharmerAction";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly decision: SnakeCharmerActionDecision;
};

export type SubmitWitchActionCommandPayload = {
  readonly commandType: "SubmitWitchAction";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly decision: WitchActionDecision;
};

export type SubmitDreamerActionCommandPayload = {
  readonly commandType: "SubmitDreamerAction";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly decision: DreamerActionDecision;
};

export type SubmitCerenovusActionCommandPayload = {
  readonly commandType: "SubmitCerenovusAction";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly decision: CerenovusActionDecision;
};

export type SubmitSeamstressActionCommandPayload = {
  readonly commandType: "SubmitSeamstressAction";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly decision: SeamstressActionDecision;
};

export type SettleClockmakerInformationCommandPayload = {
  readonly commandType: "SettleClockmakerInformation";
  readonly taskId: ScheduledTaskId;
};

export const validateSettleClockmakerInformationCommandPayload = (value: unknown):
  | { readonly valid: true; readonly payload: SettleClockmakerInformationCommandPayload }
  | { readonly valid: false; readonly reason: string } => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["commandType", "taskId"]) || value.commandType !== "SettleClockmakerInformation" ||
      typeof value.taskId !== "string" || !/^(?:first-night-v1:CLOCKMAKER_INFORMATION:seat-(?:0[1-9]|1[0-2])|first-night-v[12]:PHILOSOPHER_GAINED:CLOCKMAKER_INFORMATION:seat-(?:0[1-9]|1[0-2]):from-clockmaker)$/.test(value.taskId)) {
    return { valid: false, reason: "SettleClockmakerInformation must contain only its command type and canonical Clockmaker task ID" };
  }
  return { valid: true, payload: value as unknown as SettleClockmakerInformationCommandPayload };
};

export const canActorSettleClockmakerInformation = (actor: CommandActor): actor is SystemActor | StorytellerActor =>
  actor.kind === "system" || actor.kind === "storyteller";

export type SettleMathematicianInformationCommandPayload = {
  readonly commandType: "SettleMathematicianInformation";
  readonly taskId: ScheduledTaskId;
};

export type CompleteNightCommandPayload = { readonly commandType: "CompleteNight"; readonly phase: "FIRST_NIGHT" | "NIGHT_TASKS"; readonly planVersion: string; readonly nightNumber: number; readonly window?: "OTHER_NIGHT" };
export type PublishDawnCommandPayload = { readonly commandType: "PublishDawn"; readonly phase: "DAWN_RESOLUTION"; readonly nightNumber: number };
export type OpenNominationsCommandPayload = { readonly commandType: "OpenNominations"; readonly dayNumber: number };
export type DeclareNominationCommandPayload = { readonly commandType: "DeclareNomination"; readonly targetPlayerId: PlayerId };
export type OpenVoteCommandPayload = { readonly commandType: "OpenVote"; readonly nominationId: string };
export type CastVoteCommandPayload = { readonly commandType: "CastVote"; readonly nominationId: string; readonly choice: "YES" | "NO" };
export type CompleteVoteCommandPayload = { readonly commandType: "CompleteVote"; readonly nominationId: string };
export type CloseNominationsCommandPayload = { readonly commandType: "CloseNominations"; readonly dayNumber: number };
export type ResolveExecutionCommandPayload = { readonly commandType: "ResolveExecution"; readonly blockId: string };
export type BeginNightCommandPayload = { readonly commandType: "BeginNight"; readonly dayNumber: 1; readonly nightNumber: 2; readonly planVersion: "ordinary-night-v1"; readonly window: "OTHER_NIGHT" };
export type SettleOrdinaryNightTaskCommandPayload = { readonly commandType: "SettleOrdinaryNightTask"; readonly taskId: string };

type BasicCommandValidation<T> =
  | { readonly valid: true; readonly payload: T }
  | { readonly valid: false; readonly reason: string };

const validateExactBasicCommand = <T>(value: unknown, keys: readonly string[], commandType: string, extra: (record: Record<string, unknown>) => boolean): BasicCommandValidation<T> => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, keys) || value.commandType !== commandType || !extra(value)) {
    return { valid: false, reason: `${commandType} payload shape is invalid` };
  }
  return { valid: true, payload: value as unknown as T };
};

const nonEmptyBasicString = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const safeBasicInteger = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

export const validateCompleteNightCommandPayload = (value: unknown): BasicCommandValidation<CompleteNightCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "phase", "planVersion", "nightNumber"], "CompleteNight", (record) =>
    (record.phase === "FIRST_NIGHT" || record.phase === "NIGHT_TASKS") && nonEmptyBasicString(record.planVersion) && safeBasicInteger(record.nightNumber));
export const validatePublishDawnCommandPayload = (value: unknown): BasicCommandValidation<PublishDawnCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "phase", "nightNumber"], "PublishDawn", (record) => record.phase === "DAWN_RESOLUTION" && safeBasicInteger(record.nightNumber));
export const validateOpenNominationsCommandPayload = (value: unknown): BasicCommandValidation<OpenNominationsCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "dayNumber"], "OpenNominations", (record) => safeBasicInteger(record.dayNumber));
export const validateDeclareNominationCommandPayload = (value: unknown): BasicCommandValidation<DeclareNominationCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "targetPlayerId"], "DeclareNomination", (record) => nonEmptyBasicString(record.targetPlayerId));
export const validateOpenVoteCommandPayload = (value: unknown): BasicCommandValidation<OpenVoteCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "nominationId"], "OpenVote", (record) => nonEmptyBasicString(record.nominationId));
export const validateCastVoteCommandPayload = (value: unknown): BasicCommandValidation<CastVoteCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "nominationId", "choice"], "CastVote", (record) => nonEmptyBasicString(record.nominationId) && (record.choice === "YES" || record.choice === "NO"));
export const validateCompleteVoteCommandPayload = (value: unknown): BasicCommandValidation<CompleteVoteCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "nominationId"], "CompleteVote", (record) => nonEmptyBasicString(record.nominationId));
export const validateCloseNominationsCommandPayload = (value: unknown): BasicCommandValidation<CloseNominationsCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "dayNumber"], "CloseNominations", (record) => safeBasicInteger(record.dayNumber));
export const validateResolveExecutionCommandPayload = (value: unknown): BasicCommandValidation<ResolveExecutionCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "blockId"], "ResolveExecution", (record) => nonEmptyBasicString(record.blockId));
export const validateBeginNightCommandPayload = (value: unknown): BasicCommandValidation<BeginNightCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "dayNumber", "nightNumber", "planVersion", "window"], "BeginNight", (record) => record.dayNumber === 1 && record.nightNumber === 2 && record.planVersion === "ordinary-night-v1" && record.window === "OTHER_NIGHT");
export const validateSettleOrdinaryNightTaskCommandPayload = (value: unknown): BasicCommandValidation<SettleOrdinaryNightTaskCommandPayload> =>
  validateExactBasicCommand(value, ["commandType", "taskId"], "SettleOrdinaryNightTask", (record) => nonEmptyBasicString(record.taskId));

export const validateBasicPhaseFlowCommandPayload = (value: unknown): { readonly valid: true } | { readonly valid: false; readonly reason: string } => {
  if (!isPlainRecord(value)) return { valid: false, reason: "command payload must be a plain record" };
  switch (value.commandType) {
    case "CompleteNight": return validateCompleteNightCommandPayload(value);
    case "PublishDawn": return validatePublishDawnCommandPayload(value);
    case "OpenNominations": return validateOpenNominationsCommandPayload(value);
    case "DeclareNomination": return validateDeclareNominationCommandPayload(value);
    case "OpenVote": return validateOpenVoteCommandPayload(value);
    case "CastVote": return validateCastVoteCommandPayload(value);
    case "CompleteVote": return validateCompleteVoteCommandPayload(value);
    case "CloseNominations": return validateCloseNominationsCommandPayload(value);
    case "ResolveExecution": return validateResolveExecutionCommandPayload(value);
    case "BeginNight": return validateBeginNightCommandPayload(value);
    case "SettleOrdinaryNightTask": return validateSettleOrdinaryNightTaskCommandPayload(value);
    default: return { valid: true };
  }
};

export const validateSettleMathematicianInformationCommandPayload = (value: unknown):
  | { readonly valid: true; readonly payload: SettleMathematicianInformationCommandPayload }
  | { readonly valid: false; readonly reason: string } => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, ["commandType", "taskId"]) ||
      value.commandType !== "SettleMathematicianInformation" || typeof value.taskId !== "string" ||
      !/^(?:first-night-v1:MATHEMATICIAN_INFORMATION:seat-(?:0[1-9]|1[0-2])|first-night-v[12]:PHILOSOPHER_GAINED:MATHEMATICIAN_INFORMATION:seat-(?:0[1-9]|1[0-2]):from-mathematician)$/.test(value.taskId)) {
    return { valid: false, reason: "SettleMathematicianInformation must contain only its command type and canonical Mathematician task ID" };
  }
  return { valid: true, payload: value as unknown as SettleMathematicianInformationCommandPayload };
};

export const canActorSettleMathematicianInformation = (actor: CommandActor): actor is SystemActor | StorytellerActor =>
  actor.kind === "system" || actor.kind === "storyteller";

export type SupportedCommandPayload =
  | CreateGameCommandPayload
  | SelectScriptCommandPayload
  | GenerateSetupCommandPayload
  | CreatePlayerRosterCommandPayload
  | AssignCharactersCommandPayload
  | InitializeFirstNightCommandPayload
  | PlanFirstNightTasksCommandPayload
  | SettleFirstNightSystemTaskCommandPayload
  | SettleEvilTwinSetupCommandPayload
  | OpenFirstNightRoleActionOpportunityCommandPayload
  | SubmitPhilosopherActionCommandPayload
  | SubmitSnakeCharmerActionCommandPayload
  | SubmitWitchActionCommandPayload
  | SubmitCerenovusActionCommandPayload
  | SubmitDreamerActionCommandPayload
  | SubmitSeamstressActionCommandPayload
  | SettleClockmakerInformationCommandPayload
  | SettleMathematicianInformationCommandPayload
  | CompleteNightCommandPayload | PublishDawnCommandPayload | OpenNominationsCommandPayload
  | DeclareNominationCommandPayload | OpenVoteCommandPayload | CastVoteCommandPayload
  | CompleteVoteCommandPayload | CloseNominationsCommandPayload | ResolveExecutionCommandPayload
  | BeginNightCommandPayload | SettleOrdinaryNightTaskCommandPayload;
export type CreateGameCommand = CommandEnvelope<CreateGameCommandPayload>;
export type SelectScriptCommand = CommandEnvelope<SelectScriptCommandPayload>;
export type GenerateSetupCommand = CommandEnvelope<GenerateSetupCommandPayload>;
export type CreatePlayerRosterCommand = CommandEnvelope<CreatePlayerRosterCommandPayload>;
export type AssignCharactersCommand = CommandEnvelope<AssignCharactersCommandPayload>;
export type InitializeFirstNightCommand = CommandEnvelope<InitializeFirstNightCommandPayload>;
export type PlanFirstNightTasksCommand = CommandEnvelope<PlanFirstNightTasksCommandPayload>;
export type SettleFirstNightSystemTaskCommand = CommandEnvelope<SettleFirstNightSystemTaskCommandPayload>;
export type SettleEvilTwinSetupCommand = CommandEnvelope<SettleEvilTwinSetupCommandPayload>;
export type OpenFirstNightRoleActionOpportunityCommand = CommandEnvelope<OpenFirstNightRoleActionOpportunityCommandPayload>;
export type SubmitPhilosopherActionCommand = CommandEnvelope<SubmitPhilosopherActionCommandPayload>;
export type SubmitSnakeCharmerActionCommand = CommandEnvelope<SubmitSnakeCharmerActionCommandPayload>;
export type SubmitWitchActionCommand = CommandEnvelope<SubmitWitchActionCommandPayload>;
export type SubmitCerenovusActionCommand = CommandEnvelope<SubmitCerenovusActionCommandPayload>;
export type SubmitDreamerActionCommand = CommandEnvelope<SubmitDreamerActionCommandPayload>;
export type SubmitSeamstressActionCommand = CommandEnvelope<SubmitSeamstressActionCommandPayload>;
export type SettleClockmakerInformationCommand = CommandEnvelope<SettleClockmakerInformationCommandPayload>;
export type SettleMathematicianInformationCommand = CommandEnvelope<SettleMathematicianInformationCommandPayload>;
export type CompleteNightCommand = CommandEnvelope<CompleteNightCommandPayload>;
export type PublishDawnCommand = CommandEnvelope<PublishDawnCommandPayload>;
export type OpenNominationsCommand = CommandEnvelope<OpenNominationsCommandPayload>;
export type DeclareNominationCommand = CommandEnvelope<DeclareNominationCommandPayload>;
export type OpenVoteCommand = CommandEnvelope<OpenVoteCommandPayload>;
export type CastVoteCommand = CommandEnvelope<CastVoteCommandPayload>;
export type CompleteVoteCommand = CommandEnvelope<CompleteVoteCommandPayload>;
export type CloseNominationsCommand = CommandEnvelope<CloseNominationsCommandPayload>;
export type ResolveExecutionCommand = CommandEnvelope<ResolveExecutionCommandPayload>;
export type BeginNightCommand = CommandEnvelope<BeginNightCommandPayload>;
export type SettleOrdinaryNightTaskCommand = CommandEnvelope<SettleOrdinaryNightTaskCommandPayload>;
export type SupportedCommandEnvelope =
  | CreateGameCommand
  | SelectScriptCommand
  | GenerateSetupCommand
  | CreatePlayerRosterCommand
  | AssignCharactersCommand
  | InitializeFirstNightCommand
  | PlanFirstNightTasksCommand
  | SettleFirstNightSystemTaskCommand
  | SettleEvilTwinSetupCommand
  | OpenFirstNightRoleActionOpportunityCommand
  | SubmitPhilosopherActionCommand
  | SubmitSnakeCharmerActionCommand
  | SubmitWitchActionCommand
  | SubmitCerenovusActionCommand
  | SubmitDreamerActionCommand
  | SubmitSeamstressActionCommand
  | SettleClockmakerInformationCommand
  | SettleMathematicianInformationCommand
  | CompleteNightCommand | PublishDawnCommand | OpenNominationsCommand | DeclareNominationCommand
  | OpenVoteCommand | CastVoteCommand | CompleteVoteCommand | CloseNominationsCommand
  | ResolveExecutionCommand | BeginNightCommand | SettleOrdinaryNightTaskCommand;
