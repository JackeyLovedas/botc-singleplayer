import type { CommandId, CorrelationId, GameId, PlayerId, ScheduledTaskId } from "./ids.js";
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

export type SupportedCommandPayload =
  | CreateGameCommandPayload
  | SelectScriptCommandPayload
  | GenerateSetupCommandPayload
  | CreatePlayerRosterCommandPayload
  | AssignCharactersCommandPayload
  | InitializeFirstNightCommandPayload
  | PlanFirstNightTasksCommandPayload
  | SettleFirstNightSystemTaskCommandPayload;
export type CreateGameCommand = CommandEnvelope<CreateGameCommandPayload>;
export type SelectScriptCommand = CommandEnvelope<SelectScriptCommandPayload>;
export type GenerateSetupCommand = CommandEnvelope<GenerateSetupCommandPayload>;
export type CreatePlayerRosterCommand = CommandEnvelope<CreatePlayerRosterCommandPayload>;
export type AssignCharactersCommand = CommandEnvelope<AssignCharactersCommandPayload>;
export type InitializeFirstNightCommand = CommandEnvelope<InitializeFirstNightCommandPayload>;
export type PlanFirstNightTasksCommand = CommandEnvelope<PlanFirstNightTasksCommandPayload>;
export type SettleFirstNightSystemTaskCommand = CommandEnvelope<SettleFirstNightSystemTaskCommandPayload>;
export type SupportedCommandEnvelope =
  | CreateGameCommand
  | SelectScriptCommand
  | GenerateSetupCommand
  | CreatePlayerRosterCommand
  | AssignCharactersCommand
  | InitializeFirstNightCommand
  | PlanFirstNightTasksCommand
  | SettleFirstNightSystemTaskCommand;
