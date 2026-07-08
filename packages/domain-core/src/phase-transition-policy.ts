import type { GamePhase, PhaseCounters } from "./game-phase.js";

export type PhaseTransitionReason =
  | "SCRIPT_SELECTED"
  | "SETUP_GENERATED"
  | "CHARACTERS_ASSIGNED"
  | "FIRST_NIGHT_COMPLETED"
  | "DAWN_COMPLETED"
  | "NOMINATION_OPENED"
  | "VOTE_OPENED"
  | "VOTE_COMPLETED"
  | "NOMINATIONS_CLOSED"
  | "EXECUTION_RESOLVED"
  | "NIGHT_TASKS_COMPLETED"
  | "GAME_ENDED";

export const INTEGRATED_TRANSITION_REASONS = ["SCRIPT_SELECTED", "SETUP_GENERATED", "CHARACTERS_ASSIGNED"] as const;

export type IntegratedTransitionReason = (typeof INTEGRATED_TRANSITION_REASONS)[number];

export const isIntegratedTransitionReason = (reason: PhaseTransitionReason): reason is IntegratedTransitionReason =>
  INTEGRATED_TRANSITION_REASONS.includes(reason as IntegratedTransitionReason);

export type PhaseTransitionPolicyInput = PhaseCounters & {
  readonly fromPhase: GamePhase;
  readonly toPhase: GamePhase;
};

export type PhaseTransitionPolicyResult = PhaseCounters & {
  readonly allowed: boolean;
  readonly reason: string;
  readonly reasonCode: PhaseTransitionReason | undefined;
  readonly nextPhase: GamePhase;
};

type TransitionRule = {
  readonly toPhase: GamePhase;
  readonly reason: string;
  readonly reasonCode: PhaseTransitionReason;
  readonly nextCounters: (counters: PhaseCounters) => PhaseCounters;
};

export type PhaseCounterValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

const sameCounters = (counters: PhaseCounters): PhaseCounters => counters;

export const validatePhaseCounters = (
  phase: GamePhase,
  dayNumber: number,
  nightNumber: number
): PhaseCounterValidationResult => {
  if (dayNumber < 0 || nightNumber < 0) {
    return { valid: false, reason: "dayNumber and nightNumber cannot be negative" };
  }

  switch (phase) {
    case "GAME_CREATION":
    case "SCRIPT_SELECTION":
    case "SETUP_GENERATION":
    case "CHARACTER_ASSIGNMENT":
      return dayNumber === 0 && nightNumber === 0
        ? { valid: true }
        : { valid: false, reason: `${phase} requires dayNumber = 0 and nightNumber = 0` };

    case "FIRST_NIGHT":
      return dayNumber === 0 && nightNumber === 1
        ? { valid: true }
        : { valid: false, reason: "FIRST_NIGHT requires dayNumber = 0 and nightNumber = 1" };

    case "DAWN_RESOLUTION":
    case "NIGHT_TASKS":
      return nightNumber === dayNumber + 1 && nightNumber >= 1
        ? { valid: true }
        : { valid: false, reason: `${phase} requires nightNumber = dayNumber + 1 and nightNumber >= 1` };

    case "DAY_DISCUSSION":
    case "NOMINATION_WINDOW":
    case "VOTING":
    case "EXECUTION_RESOLUTION":
      return dayNumber === nightNumber && dayNumber >= 1
        ? { valid: true }
        : { valid: false, reason: `${phase} requires dayNumber = nightNumber and dayNumber >= 1` };

    case "GAME_ENDED":
      return dayNumber === nightNumber || nightNumber === dayNumber + 1
        ? { valid: true }
        : { valid: false, reason: "GAME_ENDED requires inherited legal phase counters" };
  }
};

const transitions: Readonly<Record<GamePhase, readonly TransitionRule[]>> = {
  GAME_CREATION: [],
  SCRIPT_SELECTION: [
    {
      toPhase: "SETUP_GENERATION",
      reason: "script selected",
      reasonCode: "SCRIPT_SELECTED",
      nextCounters: sameCounters
    }
  ],
  SETUP_GENERATION: [
    {
      toPhase: "CHARACTER_ASSIGNMENT",
      reason: "setup generated",
      reasonCode: "SETUP_GENERATED",
      nextCounters: sameCounters
    }
  ],
  CHARACTER_ASSIGNMENT: [
    {
      toPhase: "FIRST_NIGHT",
      reason: "characters assigned",
      reasonCode: "CHARACTERS_ASSIGNED",
      nextCounters: (counters) => ({ ...counters, nightNumber: 1 })
    }
  ],
  FIRST_NIGHT: [
    {
      toPhase: "DAWN_RESOLUTION",
      reason: "first night completed",
      reasonCode: "FIRST_NIGHT_COMPLETED",
      nextCounters: sameCounters
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      reasonCode: "GAME_ENDED",
      nextCounters: sameCounters
    }
  ],
  DAWN_RESOLUTION: [
    {
      toPhase: "DAY_DISCUSSION",
      reason: "dawn resolved",
      reasonCode: "DAWN_COMPLETED",
      nextCounters: (counters) => ({ ...counters, dayNumber: counters.dayNumber + 1 })
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      reasonCode: "GAME_ENDED",
      nextCounters: sameCounters
    }
  ],
  DAY_DISCUSSION: [
    {
      toPhase: "NOMINATION_WINDOW",
      reason: "nominations opened",
      reasonCode: "NOMINATION_OPENED",
      nextCounters: sameCounters
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      reasonCode: "GAME_ENDED",
      nextCounters: sameCounters
    }
  ],
  NOMINATION_WINDOW: [
    {
      toPhase: "VOTING",
      reason: "vote opened",
      reasonCode: "VOTE_OPENED",
      nextCounters: sameCounters
    },
    {
      toPhase: "EXECUTION_RESOLUTION",
      reason: "nominations closed",
      reasonCode: "NOMINATIONS_CLOSED",
      nextCounters: sameCounters
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      reasonCode: "GAME_ENDED",
      nextCounters: sameCounters
    }
  ],
  VOTING: [
    {
      toPhase: "NOMINATION_WINDOW",
      reason: "vote completed",
      reasonCode: "VOTE_COMPLETED",
      nextCounters: sameCounters
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      reasonCode: "GAME_ENDED",
      nextCounters: sameCounters
    }
  ],
  EXECUTION_RESOLUTION: [
    {
      toPhase: "NIGHT_TASKS",
      reason: "execution resolved",
      reasonCode: "EXECUTION_RESOLVED",
      nextCounters: (counters) => ({ ...counters, nightNumber: counters.nightNumber + 1 })
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      reasonCode: "GAME_ENDED",
      nextCounters: sameCounters
    }
  ],
  NIGHT_TASKS: [
    {
      toPhase: "DAWN_RESOLUTION",
      reason: "night tasks completed",
      reasonCode: "NIGHT_TASKS_COMPLETED",
      nextCounters: sameCounters
    },
    {
      toPhase: "GAME_ENDED",
      reason: "game ended",
      reasonCode: "GAME_ENDED",
      nextCounters: sameCounters
    }
  ],
  GAME_ENDED: []
};

export const evaluatePhaseTransition = (input: PhaseTransitionPolicyInput): PhaseTransitionPolicyResult => {
  const fromCounterValidation = validatePhaseCounters(input.fromPhase, input.dayNumber, input.nightNumber);
  if (!fromCounterValidation.valid) {
    return {
      allowed: false,
      reason: fromCounterValidation.reason,
      reasonCode: undefined,
      nextPhase: input.fromPhase,
      dayNumber: input.dayNumber,
      nightNumber: input.nightNumber
    };
  }

  if (input.fromPhase === "GAME_ENDED" && input.toPhase !== "GAME_ENDED") {
    return {
      allowed: false,
      reason: "GAME_ENDED cannot transition back to an active phase",
      reasonCode: undefined,
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
      reasonCode: undefined,
      nextPhase: input.fromPhase,
      dayNumber: input.dayNumber,
      nightNumber: input.nightNumber
    };
  }

  const nextCounters = rule.nextCounters({
    dayNumber: input.dayNumber,
    nightNumber: input.nightNumber
  });

  const toCounterValidation = validatePhaseCounters(rule.toPhase, nextCounters.dayNumber, nextCounters.nightNumber);
  if (!toCounterValidation.valid) {
    return {
      allowed: false,
      reason: toCounterValidation.reason,
      reasonCode: undefined,
      nextPhase: input.fromPhase,
      dayNumber: input.dayNumber,
      nightNumber: input.nightNumber
    };
  }

  return {
    allowed: true,
    reason: rule.reason,
    reasonCode: rule.reasonCode,
    nextPhase: rule.toPhase,
    dayNumber: nextCounters.dayNumber,
    nightNumber: nextCounters.nightNumber
  };
};
