import { describe, expect, it } from "vitest";
import { evaluatePhaseTransition } from "@botc/domain-core";
import type { GamePhase } from "@botc/domain-core";

const transition = (
  fromPhase: GamePhase,
  toPhase: GamePhase,
  dayNumber: number,
  nightNumber: number
) => evaluatePhaseTransition({ fromPhase, toPhase, dayNumber, nightNumber });

describe("phase transition policy", () => {
  it("describes the expected complete phase path", () => {
    const path: GamePhase[] = [
      "SCRIPT_SELECTION",
      "SETUP_GENERATION",
      "CHARACTER_ASSIGNMENT",
      "FIRST_NIGHT",
      "DAWN_RESOLUTION",
      "DAY_DISCUSSION",
      "NOMINATION_WINDOW",
      "VOTING",
      "NOMINATION_WINDOW",
      "EXECUTION_RESOLUTION",
      "NIGHT_TASKS",
      "DAWN_RESOLUTION",
      "DAY_DISCUSSION"
    ];

    let dayNumber = 0;
    let nightNumber = 0;
    for (let index = 0; index < path.length - 1; index += 1) {
      const result = transition(path[index] as GamePhase, path[index + 1] as GamePhase, dayNumber, nightNumber);
      expect(result.allowed).toBe(true);
      expect(result.reasonCode).toBeDefined();
      dayNumber = result.dayNumber;
      nightNumber = result.nightNumber;
    }

    expect(dayNumber).toBe(2);
    expect(nightNumber).toBe(2);
  });

  it("returns from VOTING to NOMINATION_WINDOW without changing counters", () => {
    const result = transition("VOTING", "NOMINATION_WINDOW", 1, 1);

    expect(result).toMatchObject({
      allowed: true,
      nextPhase: "NOMINATION_WINDOW",
      reasonCode: "VOTE_COMPLETED",
      dayNumber: 1,
      nightNumber: 1
    });
  });

  it("sets first night number to 1", () => {
    const result = transition("CHARACTER_ASSIGNMENT", "FIRST_NIGHT", 0, 0);

    expect(result.allowed).toBe(true);
    expect(result.reasonCode).toBe("CHARACTERS_ASSIGNED");
    expect(result.nightNumber).toBe(1);
  });

  it("sets first day number to 1", () => {
    const result = transition("DAWN_RESOLUTION", "DAY_DISCUSSION", 0, 1);

    expect(result.allowed).toBe(true);
    expect(result.reasonCode).toBe("DAWN_COMPLETED");
    expect(result.dayNumber).toBe(1);
  });

  it("increments later nights and days correctly", () => {
    const night = transition("EXECUTION_RESOLUTION", "NIGHT_TASKS", 1, 1);
    const dawn = transition("NIGHT_TASKS", "DAWN_RESOLUTION", night.dayNumber, night.nightNumber);
    const day = transition("DAWN_RESOLUTION", "DAY_DISCUSSION", dawn.dayNumber, dawn.nightNumber);

    expect(night.nightNumber).toBe(2);
    expect(day.dayNumber).toBe(2);
  });

  it("rejects illegal backward transitions with a reason", () => {
    const result = transition("DAY_DISCUSSION", "SCRIPT_SELECTION", 1, 1);

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("cannot transition");
    expect(result.nextPhase).toBe("DAY_DISCUSSION");
  });

  it("does not allow SCRIPT_SELECTION to jump directly into FIRST_NIGHT", () => {
    const result = transition("SCRIPT_SELECTION", "FIRST_NIGHT", 0, 0);

    expect(result.allowed).toBe(false);
    expect(result.nextPhase).toBe("SCRIPT_SELECTION");
  });

  it("allows GAME_ENDED from active rule phases only", () => {
    const allowedCases: Array<readonly [GamePhase, number, number]> = [
      ["FIRST_NIGHT", 0, 1],
      ["DAWN_RESOLUTION", 0, 1],
      ["DAY_DISCUSSION", 1, 1],
      ["NOMINATION_WINDOW", 1, 1],
      ["VOTING", 1, 1],
      ["EXECUTION_RESOLUTION", 1, 1],
      ["NIGHT_TASKS", 1, 2]
    ];

    for (const [fromPhase, dayNumber, nightNumber] of allowedCases) {
      const result = transition(fromPhase, "GAME_ENDED", dayNumber, nightNumber);
      expect(result).toMatchObject({
        allowed: true,
        nextPhase: "GAME_ENDED",
        reasonCode: "GAME_ENDED"
      });
    }
  });

  it("does not allow setup phases or ended games to enter GAME_ENDED or active phases directly", () => {
    expect(transition("SCRIPT_SELECTION", "GAME_ENDED", 0, 0).allowed).toBe(false);
    expect(transition("SETUP_GENERATION", "GAME_ENDED", 0, 0).allowed).toBe(false);
    expect(transition("CHARACTER_ASSIGNMENT", "GAME_ENDED", 0, 0).allowed).toBe(false);
    expect(transition("GAME_ENDED", "DAY_DISCUSSION", 1, 1).allowed).toBe(false);
  });

  it("rejects illegal phase counter combinations before transition", () => {
    expect(transition("CHARACTER_ASSIGNMENT", "FIRST_NIGHT", 1, 1)).toMatchObject({ allowed: false });
    expect(transition("FIRST_NIGHT", "DAWN_RESOLUTION", 1, 1)).toMatchObject({ allowed: false });
    expect(transition("DAY_DISCUSSION", "NOMINATION_WINDOW", 1, 2)).toMatchObject({ allowed: false });
    expect(transition("DAWN_RESOLUTION", "DAY_DISCUSSION", 1, 1)).toMatchObject({ allowed: false });
  });
});
