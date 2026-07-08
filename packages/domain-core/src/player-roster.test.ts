import { describe, expect, it } from "vitest";
import {
  SUPPORTED_ROSTER_VERSION,
  createFixedPlayerRoster,
  playerId,
  seatNumber,
  validatePlayerRoster
} from "@botc/domain-core";

describe("PlayerRoster", () => {
  it("creates a fixed 12-player roster with one human and eleven AI players", () => {
    const roster = createFixedPlayerRoster({
      humanPlayerId: playerId("human-1"),
      humanDisplayName: " Human ",
      humanSeatNumber: 5
    });

    expect(SUPPORTED_ROSTER_VERSION).toBe("fixed-12-player-roster-v1");
    expect(roster).toHaveLength(12);
    expect(roster.map((entry) => entry.seatNumber)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(roster.filter((entry) => entry.playerKind === "HUMAN")).toHaveLength(1);
    expect(roster.filter((entry) => entry.playerKind === "AI")).toHaveLength(11);
    expect(roster[4]).toStrictEqual({
      playerId: "human-1",
      seatNumber: 5,
      playerKind: "HUMAN",
      displayName: "Human"
    });
    expect(roster[0]).toMatchObject({ playerId: "ai-seat-01", displayName: "AI 01" });
    expect(roster[11]).toMatchObject({ playerId: "ai-seat-12", displayName: "AI 12" });
    expect(validatePlayerRoster(roster)).toStrictEqual({ valid: true });
  });

  it("rejects invalid seat numbers", () => {
    expect(() => seatNumber(0)).toThrow("SeatNumber");
    expect(() => seatNumber(13)).toThrow("SeatNumber");
    expect(() => seatNumber(1.5)).toThrow("SeatNumber");
  });

  it("rejects empty, overlong, and control-character display names", () => {
    expect(() => createFixedPlayerRoster({ humanPlayerId: playerId("human-1"), humanDisplayName: "   ", humanSeatNumber: 1 })).toThrow("displayName");
    expect(() => createFixedPlayerRoster({ humanPlayerId: playerId("human-1"), humanDisplayName: "x".repeat(65), humanSeatNumber: 1 })).toThrow("displayName");
    expect(() => createFixedPlayerRoster({ humanPlayerId: playerId("human-1"), humanDisplayName: "Human\u0007", humanSeatNumber: 1 })).toThrow("displayName");
    expect(() => createFixedPlayerRoster({ humanPlayerId: playerId("human-1"), humanDisplayName: "\nHuman", humanSeatNumber: 1 })).toThrow("displayName");
    expect(() => createFixedPlayerRoster({ humanPlayerId: playerId("human-1"), humanDisplayName: "Human\tName", humanSeatNumber: 1 })).toThrow("displayName");
    expect(() => createFixedPlayerRoster({ humanPlayerId: playerId("human-1"), humanDisplayName: "Human\u007F", humanSeatNumber: 1 })).toThrow("displayName");
    expect(() => createFixedPlayerRoster({ humanPlayerId: playerId("human-1"), humanDisplayName: "Human\u0085", humanSeatNumber: 1 })).toThrow("displayName");
  });

  it("allows legal internal spaces, Chinese, and emoji display names", () => {
    expect(createFixedPlayerRoster({ humanPlayerId: playerId("human-1"), humanDisplayName: "Alice Smith", humanSeatNumber: 1 })[0]?.displayName).toBe("Alice Smith");
    expect(createFixedPlayerRoster({ humanPlayerId: playerId("human-1"), humanDisplayName: "玩家 一", humanSeatNumber: 1 })[0]?.displayName).toBe("玩家 一");
    expect(createFixedPlayerRoster({ humanPlayerId: playerId("human-1"), humanDisplayName: "Alice 😀", humanSeatNumber: 1 })[0]?.displayName).toBe("Alice 😀");
  });

  it("rejects untrimmed display names in roster events while command creation trims input", () => {
    const roster = createFixedPlayerRoster({
      humanPlayerId: playerId("human-1"),
      humanDisplayName: "  Alice  ",
      humanSeatNumber: 1
    });

    expect(roster[0]?.displayName).toBe("Alice");
    expect(validatePlayerRoster(roster).valid).toBe(true);
    expect(validatePlayerRoster(roster.map((entry, index) => index === 0 ? { ...entry, displayName: " Alice" } : entry)).valid).toBe(false);
    expect(validatePlayerRoster(roster.map((entry, index) => index === 0 ? { ...entry, displayName: "Alice " } : entry)).valid).toBe(false);
    expect(validatePlayerRoster(roster.map((entry, index) => index === 0 ? { ...entry, displayName: "  Alice  " } : entry)).valid).toBe(false);
  });

  it("rejects duplicate player ids and storyteller-like roster entries", () => {
    expect(() => createFixedPlayerRoster({
      humanPlayerId: playerId("ai-seat-02"),
      humanDisplayName: "Human",
      humanSeatNumber: 1
    })).toThrow("playerId");

    const invalidKind = createFixedPlayerRoster({
      humanPlayerId: playerId("human-1"),
      humanDisplayName: "Human",
      humanSeatNumber: 1
    }).map((entry, index) => index === 0 ? { ...entry, playerKind: "STORYTELLER" as "HUMAN" } : entry);
    expect(validatePlayerRoster(invalidKind).valid).toBe(false);
  });
});
