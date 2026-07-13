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
  | SettleMathematicianInformationCommandPayload;
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
  | SettleMathematicianInformationCommand;
