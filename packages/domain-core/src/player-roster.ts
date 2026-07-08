import { playerId } from "./ids.js";
import type { PlayerId } from "./ids.js";

export const SUPPORTED_ROSTER_VERSION = "fixed-12-player-roster-v1" as const;
export type SupportedRosterVersion = typeof SUPPORTED_ROSTER_VERSION;

export type SeatNumber = number & { readonly __brand: "SeatNumber" };
export type PlayerKind = "HUMAN" | "AI";

export type PlayerRosterEntry = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly playerKind: PlayerKind;
  readonly displayName: string;
};

export type PlayerRoster = readonly PlayerRosterEntry[];

export type FixedPlayerRosterInput = {
  readonly humanPlayerId: PlayerId;
  readonly humanDisplayName: string;
  readonly humanSeatNumber: number;
};

export type PlayerRosterValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

export const MAX_PLAYER_DISPLAY_NAME_LENGTH = 64;
const EXPECTED_PLAYER_COUNT = 12;

const padSeat = (value: number): string => value.toString().padStart(2, "0");
const hasControlCharacter = (value: string): boolean => {
  for (const character of value) {
    const code = character.codePointAt(0);
    if (code !== undefined && ((code >= 0x0000 && code <= 0x001F) || code === 0x007F || (code >= 0x0080 && code <= 0x009F))) {
      return true;
    }
  }

  return false;
};

export const isSeatNumberValue = (value: number): boolean =>
  Number.isInteger(value) && value >= 1 && value <= EXPECTED_PLAYER_COUNT;

export const seatNumber = (value: number): SeatNumber => {
  if (!isSeatNumberValue(value)) {
    throw new Error("SeatNumber must be an integer from 1 to 12");
  }

  return value as SeatNumber;
};

export const compareSeatNumber = (left: SeatNumber, right: SeatNumber): number => left - right;

export const normalizeDisplayName = (value: string): string => value.trim();

export const validateDisplayName = (value: string): PlayerRosterValidationResult => {
  const normalized = normalizeDisplayName(value);
  if (hasControlCharacter(value)) {
    return { valid: false, reason: "displayName must not contain control characters" };
  }

  if (value !== normalized) {
    return { valid: false, reason: "displayName must already be trimmed" };
  }

  if (normalized.length === 0) {
    return { valid: false, reason: "displayName must not be empty after trimming" };
  }

  if (normalized.length > MAX_PLAYER_DISPLAY_NAME_LENGTH) {
    return { valid: false, reason: "displayName must not exceed 64 characters" };
  }

  return { valid: true };
};

export const validatePlayerRoster = (entries: readonly PlayerRosterEntry[]): PlayerRosterValidationResult => {
  if (entries.length !== EXPECTED_PLAYER_COUNT) {
    return { valid: false, reason: "PlayerRoster must contain exactly 12 entries" };
  }

  const playerIds = new Set<PlayerId>();
  const seatNumbers = new Set<number>();
  let humanCount = 0;
  let aiCount = 0;

  for (const [index, entry] of entries.entries()) {
    if (entry.playerKind !== "HUMAN" && entry.playerKind !== "AI") {
      return { valid: false, reason: "PlayerRoster entries must be HUMAN or AI players" };
    }

    if (!isSeatNumberValue(entry.seatNumber)) {
      return { valid: false, reason: "PlayerRoster seatNumber must be from 1 to 12" };
    }

    if (entry.seatNumber !== index + 1) {
      return { valid: false, reason: "PlayerRoster entries must be sorted by consecutive seatNumber" };
    }

    if (playerIds.has(entry.playerId)) {
      return { valid: false, reason: "PlayerRoster playerId values must be unique" };
    }

    if (seatNumbers.has(entry.seatNumber)) {
      return { valid: false, reason: "PlayerRoster seatNumber values must be unique" };
    }

    const displayNameValidation = validateDisplayName(entry.displayName);
    if (!displayNameValidation.valid) {
      return displayNameValidation;
    }

    playerIds.add(entry.playerId);
    seatNumbers.add(entry.seatNumber);
    if (entry.playerKind === "HUMAN") {
      humanCount += 1;
    } else {
      aiCount += 1;
    }
  }

  if (humanCount !== 1 || aiCount !== 11) {
    return { valid: false, reason: "PlayerRoster must contain exactly 1 HUMAN and 11 AI players" };
  }

  return { valid: true };
};

export const createFixedPlayerRoster = (input: FixedPlayerRosterInput): PlayerRoster => {
  const humanSeat = seatNumber(input.humanSeatNumber);
  if (hasControlCharacter(input.humanDisplayName)) {
    throw new Error("displayName must not contain control characters");
  }

  const humanDisplayName = normalizeDisplayName(input.humanDisplayName);
  const displayNameValidation = validateDisplayName(humanDisplayName);
  if (!displayNameValidation.valid) {
    throw new Error(displayNameValidation.reason);
  }

  const entries: PlayerRosterEntry[] = [];
  for (let value = 1; value <= EXPECTED_PLAYER_COUNT; value += 1) {
    const currentSeat = seatNumber(value);
    if (currentSeat === humanSeat) {
      entries.push({
        playerId: input.humanPlayerId,
        seatNumber: currentSeat,
        playerKind: "HUMAN",
        displayName: humanDisplayName
      });
      continue;
    }

    entries.push({
      playerId: playerId(`ai-seat-${padSeat(value)}`),
      seatNumber: currentSeat,
      playerKind: "AI",
      displayName: `AI ${padSeat(value)}`
    });
  }

  const validation = validatePlayerRoster(entries);
  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  return entries;
};
