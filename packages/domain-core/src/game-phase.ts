export const GAME_PHASES = [
  "GAME_CREATION",
  "SCRIPT_SELECTION",
  "SETUP_GENERATION",
  "CHARACTER_ASSIGNMENT",
  "FIRST_NIGHT",
  "DAWN_RESOLUTION",
  "DAY_DISCUSSION",
  "NOMINATION_WINDOW",
  "VOTING",
  "EXECUTION_RESOLUTION",
  "NIGHT_TASKS",
  "GAME_ENDED"
] as const;

export type GamePhase = (typeof GAME_PHASES)[number];

export type PhaseCounters = {
  readonly dayNumber: number;
  readonly nightNumber: number;
};
