import type { ActionOpportunityId, CommandId, CorrelationId, GameId, PlayerId, ScheduledTaskId } from "./ids.js";
import type { PhilosopherActionDecision } from "./first-night-action-opportunity.js";
import type { SnakeCharmerActionDecision } from "./snake-charmer.js";
import type { SetupGenerationConstraints } from "./setup-types.js";

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

export type SupportedCommandPayload =
  | CreateGameCommandPayload
  | SelectScriptCommandPayload
  | GenerateSetupCommandPayload
  | CreatePlayerRosterCommandPayload
  | AssignCharactersCommandPayload
  | InitializeFirstNightCommandPayload
  | PlanFirstNightTasksCommandPayload
  | SettleFirstNightSystemTaskCommandPayload
  | OpenFirstNightRoleActionOpportunityCommandPayload
  | SubmitPhilosopherActionCommandPayload
  | SubmitSnakeCharmerActionCommandPayload;
export type CreateGameCommand = CommandEnvelope<CreateGameCommandPayload>;
export type SelectScriptCommand = CommandEnvelope<SelectScriptCommandPayload>;
export type GenerateSetupCommand = CommandEnvelope<GenerateSetupCommandPayload>;
export type CreatePlayerRosterCommand = CommandEnvelope<CreatePlayerRosterCommandPayload>;
export type AssignCharactersCommand = CommandEnvelope<AssignCharactersCommandPayload>;
export type InitializeFirstNightCommand = CommandEnvelope<InitializeFirstNightCommandPayload>;
export type PlanFirstNightTasksCommand = CommandEnvelope<PlanFirstNightTasksCommandPayload>;
export type SettleFirstNightSystemTaskCommand = CommandEnvelope<SettleFirstNightSystemTaskCommandPayload>;
export type OpenFirstNightRoleActionOpportunityCommand = CommandEnvelope<OpenFirstNightRoleActionOpportunityCommandPayload>;
export type SubmitPhilosopherActionCommand = CommandEnvelope<SubmitPhilosopherActionCommandPayload>;
export type SubmitSnakeCharmerActionCommand = CommandEnvelope<SubmitSnakeCharmerActionCommandPayload>;
export type SupportedCommandEnvelope =
  | CreateGameCommand
  | SelectScriptCommand
  | GenerateSetupCommand
  | CreatePlayerRosterCommand
  | AssignCharactersCommand
  | InitializeFirstNightCommand
  | PlanFirstNightTasksCommand
  | SettleFirstNightSystemTaskCommand
  | OpenFirstNightRoleActionOpportunityCommand
  | SubmitPhilosopherActionCommand
  | SubmitSnakeCharmerActionCommand;
