import { cloneRoleSetupSnapshot } from "./character-assignment.js";
import type { CharacterAssignmentSet } from "./character-assignment.js";
import type { PlayerId } from "./ids.js";
import type { KnownPlayerReference } from "./initial-private-knowledge.js";
import {
  hasExactEnumerableKeys,
  hasExactRoleSetupSnapshotShape,
  isPlainRecord
} from "./initial-private-knowledge.js";
import type { PlayerRoster, SeatNumber } from "./player-roster.js";
import { validatePlayerRoster } from "./player-roster.js";
import type { GeneratedSetup, RoleSetupSnapshot } from "./setup-types.js";
import { sameRoleSetupSnapshot } from "./setup-types.js";

export type CurrentCharacterStateRevision = number;
export type CurrentAlignment = "GOOD" | "EVIL";

export type CurrentCharacterState = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly role: RoleSetupSnapshot;
  readonly currentAlignment: CurrentAlignment;
};

export type CurrentCharacterStateSet = {
  readonly revision: CurrentCharacterStateRevision;
  readonly entries: readonly CurrentCharacterState[];
};

export type CurrentEvilTeamSnapshot = {
  readonly characterStateRevision: CurrentCharacterStateRevision;
  readonly demon: KnownPlayerReference;
  readonly minions: readonly KnownPlayerReference[];
};

export type CurrentCharacterStateValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

export type CurrentEvilTeamFailureCode =
  | "InvalidCurrentCharacterState"
  | "InvalidDemonCount"
  | "InvalidMinionCount"
  | "RosterCharacterStateMismatch";

export type CurrentEvilTeamResolutionFailure = {
  readonly status: "failure";
  readonly failureCode: CurrentEvilTeamFailureCode;
  readonly message: string;
  readonly conflictingPlayerIds: readonly PlayerId[];
};

export type CurrentEvilTeamResolutionSuccess = {
  readonly status: "success";
  readonly team: CurrentEvilTeamSnapshot;
};

export type CurrentEvilTeamResolutionResult =
  | CurrentEvilTeamResolutionSuccess
  | CurrentEvilTeamResolutionFailure;

const CURRENT_CHARACTER_STATE_SET_KEYS = ["entries", "revision"] as const;
const CURRENT_CHARACTER_STATE_KEYS = ["currentAlignment", "playerId", "role", "seatNumber"] as const;

const fail = (reason: string): CurrentCharacterStateValidationResult => ({ valid: false, reason });

const isDenseArray = (value: readonly unknown[]): boolean => {
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      return false;
    }
  }

  return true;
};

const isCurrentAlignment = (value: unknown): value is CurrentAlignment =>
  value === "GOOD" || value === "EVIL";

const hasExactCurrentCharacterStateShape = (value: unknown): value is CurrentCharacterState => {
  if (!isPlainRecord(value) || !hasExactEnumerableKeys(value, CURRENT_CHARACTER_STATE_KEYS)) {
    return false;
  }

  return (
    typeof value.playerId === "string" &&
    value.playerId.trim().length > 0 &&
    typeof value.seatNumber === "number" &&
    Number.isInteger(value.seatNumber) &&
    value.seatNumber >= 1 &&
    value.seatNumber <= 12 &&
    hasExactRoleSetupSnapshotShape(value.role) &&
    isCurrentAlignment(value.currentAlignment)
  );
};

const playerReference = (entry: CurrentCharacterState): KnownPlayerReference => ({
  playerId: entry.playerId,
  seatNumber: entry.seatNumber
});

export const cloneCurrentCharacterState = (entry: CurrentCharacterState): CurrentCharacterState => ({
  playerId: entry.playerId,
  seatNumber: entry.seatNumber,
  role: cloneRoleSetupSnapshot(entry.role),
  currentAlignment: entry.currentAlignment
});

export const cloneCurrentCharacterStateSet = (stateSet: CurrentCharacterStateSet): CurrentCharacterStateSet => ({
  revision: stateSet.revision,
  entries: stateSet.entries.map(cloneCurrentCharacterState)
});

export const deriveInitialCurrentCharacterStateSet = (input: {
  readonly roster: PlayerRoster;
  readonly assignment: CharacterAssignmentSet;
  readonly setup: GeneratedSetup;
}): CurrentCharacterStateSet => {
  const stateSet: CurrentCharacterStateSet = {
    revision: 1,
    entries: [...input.assignment]
      .sort((left, right) => left.seatNumber - right.seatNumber)
      .map((assignment) => ({
        playerId: assignment.playerId,
        seatNumber: assignment.seatNumber,
        role: cloneRoleSetupSnapshot(assignment.role),
        currentAlignment: assignment.role.defaultAlignment
      }))
  };

  const validation = validateInitialCurrentCharacterStateSet({
    currentCharacterState: stateSet,
    roster: input.roster,
    assignment: input.assignment,
    setup: input.setup
  });
  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  return stateSet;
};

export const validateCurrentCharacterStateSet = (input: {
  readonly currentCharacterState: unknown;
  readonly roster: PlayerRoster;
  readonly setup?: GeneratedSetup;
}): CurrentCharacterStateValidationResult => {
  const rosterValidation = validatePlayerRoster(input.roster);
  if (!rosterValidation.valid) {
    return fail(rosterValidation.reason);
  }

  if (!isPlainRecord(input.currentCharacterState) || !hasExactEnumerableKeys(input.currentCharacterState, CURRENT_CHARACTER_STATE_SET_KEYS)) {
    return fail("CurrentCharacterStateSet must have exact runtime shape");
  }

  const { revision, entries } = input.currentCharacterState;
  if (typeof revision !== "number" || !Number.isInteger(revision) || revision <= 0) {
    return fail("CurrentCharacterStateSet revision must be a positive integer");
  }

  if (!Array.isArray(entries) || !isDenseArray(entries)) {
    return fail("CurrentCharacterStateSet entries must be a dense array");
  }

  if (entries.length !== 12) {
    return fail("CurrentCharacterStateSet must contain exactly 12 entries");
  }

  if (entries.some((entry) => !hasExactCurrentCharacterStateShape(entry))) {
    return fail("CurrentCharacterState entries must have exact runtime shape");
  }

  const currentEntries = entries as readonly CurrentCharacterState[];
  const rosterByPlayerId = new Map(input.roster.map((entry) => [entry.playerId, entry]));
  const catalogByRoleId = input.setup === undefined
    ? undefined
    : new Map(input.setup.roleCatalogSnapshot.roles.map((role) => [role.roleId, role]));
  const seenPlayerIds = new Set<PlayerId>();
  const seenSeatNumbers = new Set<number>();

  for (const [index, entry] of currentEntries.entries()) {
    if (entry.seatNumber !== index + 1) {
      return fail("CurrentCharacterState entries must be sorted by ascending seatNumber from 1 to 12");
    }

    const rosterEntry = rosterByPlayerId.get(entry.playerId);
    if (rosterEntry === undefined || rosterEntry.seatNumber !== entry.seatNumber) {
      return fail("CurrentCharacterState entries must match roster playerId and seatNumber");
    }

    if (seenPlayerIds.has(entry.playerId)) {
      return fail("CurrentCharacterState playerId values must be unique");
    }

    if (seenSeatNumbers.has(entry.seatNumber)) {
      return fail("CurrentCharacterState seatNumber values must be unique");
    }

    if (catalogByRoleId !== undefined) {
      const catalogRole = catalogByRoleId.get(entry.role.roleId);
      if (catalogRole === undefined || !sameRoleSetupSnapshot(entry.role, catalogRole)) {
        return fail("CurrentCharacterState role snapshots must exist in setup role catalog");
      }
    }

    seenPlayerIds.add(entry.playerId);
    seenSeatNumbers.add(entry.seatNumber);
  }

  if (seenPlayerIds.size !== input.roster.length) {
    return fail("CurrentCharacterState entries must cover every roster player exactly once");
  }

  return { valid: true };
};

export const validateInitialCurrentCharacterStateSet = (input: {
  readonly currentCharacterState: unknown;
  readonly roster: PlayerRoster;
  readonly assignment: CharacterAssignmentSet;
  readonly setup: GeneratedSetup;
}): CurrentCharacterStateValidationResult => {
  const validation = validateCurrentCharacterStateSet({
    currentCharacterState: input.currentCharacterState,
    roster: input.roster,
    setup: input.setup
  });
  if (!validation.valid) {
    return validation;
  }

  const currentCharacterState = input.currentCharacterState as CurrentCharacterStateSet;
  if (currentCharacterState.revision !== 1) {
    return fail("Initial CurrentCharacterStateSet revision must be 1");
  }

  const assignmentByPlayerId = new Map(input.assignment.map((assignment) => [assignment.playerId, assignment]));
  for (const entry of currentCharacterState.entries) {
    const assignment = assignmentByPlayerId.get(entry.playerId);
    if (
      assignment === undefined ||
      assignment.seatNumber !== entry.seatNumber ||
      !sameRoleSetupSnapshot(entry.role, assignment.role)
    ) {
      return fail("Initial CurrentCharacterState entries must match character assignment exactly");
    }

    if (entry.currentAlignment !== entry.role.defaultAlignment) {
      return fail("Initial CurrentCharacterState currentAlignment must match role.defaultAlignment");
    }
  }

  return { valid: true };
};

const evilTeamFailure = (
  failureCode: CurrentEvilTeamFailureCode,
  message: string,
  conflictingPlayerIds: readonly PlayerId[] = []
): CurrentEvilTeamResolutionFailure => ({
  status: "failure",
  failureCode,
  message,
  conflictingPlayerIds: [...conflictingPlayerIds].sort()
});

export const resolveCurrentEvilTeam = (input: {
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly roster: PlayerRoster;
}): CurrentEvilTeamResolutionResult => {
  const validation = validateCurrentCharacterStateSet({
    currentCharacterState: input.currentCharacterState,
    roster: input.roster
  });
  if (!validation.valid) {
    const rosterPlayers = new Set(input.roster.map((entry) => entry.playerId));
    const statePlayers = Array.isArray(input.currentCharacterState.entries)
      ? input.currentCharacterState.entries
        .filter((entry): entry is CurrentCharacterState => hasExactCurrentCharacterStateShape(entry))
        .map((entry) => entry.playerId)
      : [];
    const mismatch = statePlayers.filter((playerIdValue) => !rosterPlayers.has(playerIdValue));
    return evilTeamFailure(
      validation.reason.includes("roster") ? "RosterCharacterStateMismatch" : "InvalidCurrentCharacterState",
      validation.reason,
      mismatch
    );
  }

  const demons = input.currentCharacterState.entries.filter((entry) => entry.role.characterType === "DEMON");
  if (demons.length !== 1) {
    return evilTeamFailure("InvalidDemonCount", "Current evil team requires exactly one current demon", demons.map((entry) => entry.playerId));
  }

  const minions = input.currentCharacterState.entries.filter((entry) => entry.role.characterType === "MINION");
  if (minions.length !== 2) {
    return evilTeamFailure("InvalidMinionCount", "Current evil team requires exactly two current minions", minions.map((entry) => entry.playerId));
  }

  const demon = demons[0];
  if (demon === undefined) {
    return evilTeamFailure("InvalidDemonCount", "Current evil team requires exactly one current demon");
  }

  return {
    status: "success",
    team: {
      characterStateRevision: input.currentCharacterState.revision,
      demon: playerReference(demon),
      minions: minions.map(playerReference).sort((left, right) => left.seatNumber - right.seatNumber)
    }
  };
};
