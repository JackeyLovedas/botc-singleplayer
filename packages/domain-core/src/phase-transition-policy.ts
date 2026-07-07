import type { GamePhase, PhaseCounters } from "./game-phase.js";

export type PhaseTransitionReason =
  | "SCRIPT_SELECTED"
  | "SETUP_GENERATED"
  | "CHARACTERS_ASSIGNED"
  | "FIRST_NIGHT_COMPLETED"
  | "DAWN_COMPLETED"
  | "DAY_DISCUSSION_OPENED"
  | "NOMINATION_OPENED"
  | "VOTE_OPENED"
  | "VOTE_COMPLETED"
  | "NOMINATIONS_CLOSED"
  | "EXECUTION_RESOLVED"
  | "NIGHT_TASKS_COMPLETED"
  | "GAME_ENDED";

export type PhaseTransitionPolicyInput = PhaseCounters & {
  readonly fromPhase: GamePhase;
  readonly toPhase: GamePhase;
};

export type PhaseTransitionPolicyResult = PhaseCounters & {
  readonly allowed: boolean;
  readonly reason: string;
  readonly nextPhase: GamePhase;
};

type TransitionRule = {
  readonly toPhase: GamePhase;
  readonly reason: string;
  readonly nextCounters: (counters: PhaseCounters) => PhaseCounters;
};

const sameCounters = (counters: PhaseCounters): PhaseCounters => counters;

const transitions: Readonly<Record<GamePhase, readonly TransitionRule[]>> = {
  GAME_CREATION: [],
  SCRIPT_SELECTION: [
    {
      toPhase: "SETUP_GENERATION",
      reason: "script selected",
      nextCounters: sameCounters
    }
  ],
  SETUP_GENERATION: [
    {
      toPhase: "CHARACTER_ASSIGNMENT",
      reason: "setup generated",
      nextCounters: sameCounters
    }
  ],
  CHARACTER_ASSIGNMENT: [
    {
      toPhase: "FIRST_NIGHT",
      reason: "characters assigned",
      nextCounters: (counters) => ({ ...counters, nightNumber: 1 })
    }
  ],
  FIRST_NIGHT: [
    {
      toPhase: "DAWN_RESOLUTION",
      reason: "first night completed",
      nextCounters: sameCounters
    }
  ],
  DAWN_RESOLUTION: [
    {
      toPhase: "DAY_DISCUSSION",
      reason: "dawn resolved",
      nextCounters: (counters) => ({ ...counters, dayNumber: counters.dayNumber + 1 })
    }
  ],
  DAY_DISCUSSION: [
    {
      toPhase: "NOMINATION_WINDOW",
      reason: "nominations opened",
      nextCounters: sameCounters
    }
  ],
  NOMINATION_WINDOW: [
    {
      toPhase: "VOTING",
      reason: "vote opened",
      nextCounters: sameCounters
    },
    {
      toPhase: "EXECUTION_RESOLUTION",
      reason: "nominations closed",
      nextCounters: sameCounters
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      nextCounters: sameCounters
    }
  ],
  VOTING: [
    {
      toPhase: "NOMINATION_WINDOW",
      reason: "vote completed",
      nextCounters: sameCounters
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      nextCounters: sameCounters
    }
  ],
  EXECUTION_RESOLUTION: [
    {
      toPhase: "NIGHT_TASKS",
      reason: "execution resolved",
      nextCounters: (counters) => ({ ...counters, nightNumber: counters.nightNumber + 1 })
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      nextCounters: sameCounters
    }
  ],
  NIGHT_TASKS: [
    {
      toPhase: "DAWN_RESOLUTION",
      reason: "night tasks completed",
      nextCounters: sameCounters
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      nextCounters: sameCounters
    }
  ],
  GAME_ENDED: []
};

export const evaluatePhaseTransition = (input: PhaseTransitionPolicyInput): PhaseTransitionPolicyResult => {
  if (input.dayNumber < 0 || input.nightNumber < 0) {
    return {
      allowed: false,
      reason: "dayNumber and nightNumber cannot be negative",
      nextPhase: input.fromPhase,
      dayNumber: input.dayNumber,
      nightNumber: input.nightNumber
    };
  }

  if (input.fromPhase === "GAME_ENDED" && input.toPhase !== "GAME_ENDED") {
    return {
      allowed: false,
      reason: "GAME_ENDED cannot transition back to an active phase",
      nextPhase: input.fromPhase,
      dayNumber: input.dayNumber,
      nightNumber: input.nightNumber
    };
  }

  const rule = transitions[input.fromPhase].find((candidate) => candidate.toPhase === input.toPhase);
  if (rule === undefined) {
    return {
      allowed: false,
      reason: `${input.fromPhase} cannot transition to ${input.toPhase}`,
      nextPhase: input.fromPhase,
      dayNumber: input.dayNumber,
      nightNumber: input.nightNumber
    };
  }

  const nextCounters = rule.nextCounters({
    dayNumber: input.dayNumber,
    nightNumber: input.nightNumber
  });

  return {
    allowed: true,
    reason: rule.reason,
    nextPhase: rule.toPhase,
    dayNumber: nextCounters.dayNumber,
    nightNumber: nextCounters.nightNumber
  };
};
