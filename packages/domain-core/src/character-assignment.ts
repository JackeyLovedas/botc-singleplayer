import type { PlayerId, RoleId } from "./ids.js";
import type { PlayerRoster } from "./player-roster.js";
import { compareSeatNumber } from "./player-roster.js";
import type { RoleSetupSnapshot } from "./setup-types.js";
import { compareRoleSetupSnapshot, sameRoleSetupSnapshot } from "./setup-types.js";
import type { SeatNumber } from "./player-roster.js";

export const SUPPORTED_ASSIGNMENT_ALGORITHM_VERSION = "snv-12-assignment-v1" as const;
export const SUPPORTED_ASSIGNMENT_RANDOM_STREAM = "assignment/sects-and-violets/12/v1" as const;

export type SupportedAssignmentAlgorithmVersion = typeof SUPPORTED_ASSIGNMENT_ALGORITHM_VERSION;
export type SupportedAssignmentRandomStream = typeof SUPPORTED_ASSIGNMENT_RANDOM_STREAM;

export type CharacterAssignment = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly role: RoleSetupSnapshot;
};

export type CharacterAssignmentSet = readonly CharacterAssignment[];

export type GeneratedCharacterAssignment = {
  readonly rosterVersion: string;
  readonly assignmentAlgorithmVersion: string;
  readonly randomAlgorithmVersion: string;
  readonly randomStream: string;
  readonly roleCatalogSignature: string;
  readonly assignments: CharacterAssignmentSet;
};

export type AssignmentFailureCode =
  | "InvalidRoster"
  | "InvalidActualRoles"
  | "InvalidRoleCatalogSignature"
  | "InvalidAssignment";

export type AssignmentGenerationFailure = {
  readonly status: "failure";
  readonly failureCode: AssignmentFailureCode;
  readonly message: string;
  readonly conflictingPlayerIds: readonly PlayerId[];
  readonly conflictingRoleIds: readonly RoleId[];
};

export type AssignmentGenerationSuccess = {
  readonly status: "success";
  readonly assignment: GeneratedCharacterAssignment;
};

export type AssignmentGenerationResult = AssignmentGenerationSuccess | AssignmentGenerationFailure;

export type AssignmentGeneratorInput = {
  readonly rootSeed: string;
  readonly roster: PlayerRoster;
  readonly actualRoles: readonly RoleSetupSnapshot[];
  readonly roleCatalogSignature: string;
};

export type CharacterAssignmentValidationInput = {
  readonly assignments: CharacterAssignmentSet;
  readonly roster: PlayerRoster;
  readonly actualRoles: readonly RoleSetupSnapshot[];
  readonly roleCatalogRoles: readonly RoleSetupSnapshot[];
};

export type CharacterAssignmentValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

export const cloneRoleSetupSnapshot = (role: RoleSetupSnapshot): RoleSetupSnapshot => ({
  ...role,
  setupModifier: {
    outsiderDelta: role.setupModifier.outsiderDelta,
    townsfolkDelta: role.setupModifier.townsfolkDelta
  }
});

export const compareCharacterAssignment = (left: CharacterAssignment, right: CharacterAssignment): number =>
  compareSeatNumber(left.seatNumber, right.seatNumber);

const roleIdsAreUnique = (roles: readonly RoleSetupSnapshot[]): boolean =>
  new Set(roles.map((role) => role.roleId)).size === roles.length;

const assignmentsAreSorted = (assignments: CharacterAssignmentSet): boolean =>
  assignments.every((assignment, index) => index === 0 || compareSeatNumber(assignments[index - 1]?.seatNumber ?? assignment.seatNumber, assignment.seatNumber) < 0);

export const canonicalActualRoles = (roles: readonly RoleSetupSnapshot[]): readonly RoleSetupSnapshot[] =>
  roles.map(cloneRoleSetupSnapshot).sort(compareRoleSetupSnapshot);

export const validateCharacterAssignments = (
  input: CharacterAssignmentValidationInput
): CharacterAssignmentValidationResult => {
  const { assignments, roster, actualRoles, roleCatalogRoles } = input;
  if (assignments.length !== 12) {
    return { valid: false, reason: "CharacterAssignmentSet must contain exactly 12 assignments" };
  }

  if (!assignmentsAreSorted(assignments)) {
    return { valid: false, reason: "CharacterAssignmentSet must be sorted by seatNumber" };
  }

  if (actualRoles.length !== 12 || !roleIdsAreUnique(actualRoles)) {
    return { valid: false, reason: "actualRoles must contain exactly 12 unique roles" };
  }

  const rosterBySeat = new Map<number, PlayerId>();
  for (const entry of roster) {
    rosterBySeat.set(entry.seatNumber, entry.playerId);
  }

  const actualByRoleId = new Map<RoleId, RoleSetupSnapshot>(actualRoles.map((role) => [role.roleId, role]));
  const catalogByRoleId = new Map<RoleId, RoleSetupSnapshot>(roleCatalogRoles.map((role) => [role.roleId, role]));
  const seenPlayers = new Set<PlayerId>();
  const seenSeats = new Set<number>();
  const seenRoles = new Set<RoleId>();

  for (const assignment of assignments) {
    const rosterPlayerId = rosterBySeat.get(assignment.seatNumber);
    if (rosterPlayerId === undefined || rosterPlayerId !== assignment.playerId) {
      return { valid: false, reason: "Assignment playerId and seatNumber must match the roster" };
    }

    if (seenPlayers.has(assignment.playerId)) {
      return { valid: false, reason: "Assignment playerId values must be unique" };
    }

    if (seenSeats.has(assignment.seatNumber)) {
      return { valid: false, reason: "Assignment seatNumber values must be unique" };
    }

    if (seenRoles.has(assignment.role.roleId)) {
      return { valid: false, reason: "Assignment roleId values must be unique" };
    }

    const actualRole = actualByRoleId.get(assignment.role.roleId);
    if (actualRole === undefined || !sameRoleSetupSnapshot(assignment.role, actualRole)) {
      return { valid: false, reason: "Assignment role snapshots must match setup.actualRoles" };
    }

    const catalogRole = catalogByRoleId.get(assignment.role.roleId);
    if (catalogRole === undefined || !sameRoleSetupSnapshot(assignment.role, catalogRole)) {
      return { valid: false, reason: "Assignment role snapshots must match the role catalog" };
    }

    seenPlayers.add(assignment.playerId);
    seenSeats.add(assignment.seatNumber);
    seenRoles.add(assignment.role.roleId);
  }

  if (seenPlayers.size !== roster.length || seenRoles.size !== actualRoles.length) {
    return { valid: false, reason: "Assignments must cover every roster player and actual role exactly once" };
  }

  return { valid: true };
};
