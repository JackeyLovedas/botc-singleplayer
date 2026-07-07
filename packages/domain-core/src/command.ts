import type { CommandId, CorrelationId, GameId, PlayerId } from "./ids.js";

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
  readonly edition: "sects-and-violets" | "custom";
};

export type SupportedCommandPayload = CreateGameCommandPayload | SelectScriptCommandPayload;
export type CreateGameCommand = CommandEnvelope<CreateGameCommandPayload>;
export type SelectScriptCommand = CommandEnvelope<SelectScriptCommandPayload>;
export type SupportedCommandEnvelope = CreateGameCommand | SelectScriptCommand;
