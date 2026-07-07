import type { GameId } from "./ids.js";
import type { PlayerCounts, ScriptSelectedPayload } from "./events.js";
import type { GamePhase } from "./game-phase.js";

export type GameState = {
  readonly gameId: GameId;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly phase: GamePhase;
  readonly dayNumber: number;
  readonly nightNumber: number;
  readonly created: true;
  readonly rootSeed: string;
  readonly rulesBaselineVersion: string;
  readonly playerCounts: PlayerCounts;
  readonly selectedScript?: ScriptSelectedPayload;
};
