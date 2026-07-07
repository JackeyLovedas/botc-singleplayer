import {
  DeterministicRandom,
  SUPPORTED_ASSIGNMENT_ALGORITHM_VERSION,
  SUPPORTED_ASSIGNMENT_RANDOM_STREAM,
  SUPPORTED_RANDOM_ALGORITHM_VERSION,
  SUPPORTED_ROSTER_VERSION,
  canonicalActualRoles,
  cloneRoleSetupSnapshot,
  compareCharacterAssignment,
  validateCharacterAssignments,
  validatePlayerRoster
} from "@botc/domain-core";
import type {
  AssignmentFailureCode,
  AssignmentGenerationFailure,
  AssignmentGenerationResult,
  AssignmentGeneratorInput,
  CharacterAssignment,
  PlayerId,
  RoleId,
  RoleSetupSnapshot
} from "@botc/domain-core";

export const ASSIGNMENT_ALGORITHM_VERSION = SUPPORTED_ASSIGNMENT_ALGORITHM_VERSION;
export const ASSIGNMENT_RANDOM_STREAM = SUPPORTED_ASSIGNMENT_RANDOM_STREAM;
export const RANDOM_ALGORITHM_VERSION = SUPPORTED_RANDOM_ALGORITHM_VERSION;

const roleIds = (roles: readonly RoleSetupSnapshot[]): readonly RoleId[] => roles.map((role) => role.roleId);

const failure = (
  failureCode: AssignmentFailureCode,
  message: string,
  conflictingPlayerIds: readonly PlayerId[] = [],
  conflictingRoleIds: readonly RoleId[] = []
): AssignmentGenerationFailure => ({
  status: "failure",
  failureCode,
  message,
  conflictingPlayerIds,
  conflictingRoleIds
});

const shuffleRoles = (
  random: DeterministicRandom,
  roles: readonly RoleSetupSnapshot[]
): readonly RoleSetupSnapshot[] => {
  const shuffled = roles.map(cloneRoleSetupSnapshot);
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = random.nextInt(index + 1);
    const current = shuffled[index];
    const swap = shuffled[swapIndex];
    if (current === undefined || swap === undefined) {
      throw new Error("Fisher-Yates index out of range");
    }
    shuffled[index] = swap;
    shuffled[swapIndex] = current;
  }

  return shuffled;
};

export class SeededCharacterAssignmentGenerator {
  public generate(input: AssignmentGeneratorInput): AssignmentGenerationResult {
    const rosterValidation = validatePlayerRoster(input.roster);
    if (!rosterValidation.valid) {
      return failure("InvalidRoster", rosterValidation.reason);
    }

    if (input.roleCatalogSignature.trim().length === 0) {
      return failure("InvalidRoleCatalogSignature", "roleCatalogSignature must be non-empty");
    }

    const canonicalRoles = canonicalActualRoles(input.actualRoles);
    if (canonicalRoles.length !== 12) {
      return failure("InvalidActualRoles", "actualRoles must contain exactly 12 roles", [], roleIds(canonicalRoles));
    }

    if (new Set(canonicalRoles.map((role) => role.roleId)).size !== canonicalRoles.length) {
      return failure("InvalidActualRoles", "actualRoles must contain unique roleIds", [], roleIds(canonicalRoles));
    }

    const random = new DeterministicRandom([
      input.rootSeed,
      ASSIGNMENT_RANDOM_STREAM,
      ASSIGNMENT_ALGORITHM_VERSION,
      RANDOM_ALGORITHM_VERSION,
      input.roleCatalogSignature
    ].join("|"));
    const shuffledRoles = shuffleRoles(random, canonicalRoles);
    const sortedRoster = [...input.roster].sort((left, right) => left.seatNumber - right.seatNumber);
    const assignments: CharacterAssignment[] = sortedRoster.map((entry, index) => {
      const role = shuffledRoles[index];
      if (role === undefined) {
        throw new Error("Missing shuffled role for roster entry");
      }

      return {
        playerId: entry.playerId,
        seatNumber: entry.seatNumber,
        role: cloneRoleSetupSnapshot(role)
      };
    }).sort(compareCharacterAssignment);

    const assignmentValidation = validateCharacterAssignments({
      assignments,
      roster: input.roster,
      actualRoles: canonicalRoles,
      roleCatalogRoles: canonicalRoles
    });
    if (!assignmentValidation.valid) {
      return failure("InvalidAssignment", assignmentValidation.reason, assignments.map((assignment) => assignment.playerId), roleIds(assignments.map((assignment) => assignment.role)));
    }

    return {
      status: "success",
      assignment: {
        rosterVersion: SUPPORTED_ROSTER_VERSION,
        assignmentAlgorithmVersion: ASSIGNMENT_ALGORITHM_VERSION,
        randomAlgorithmVersion: RANDOM_ALGORITHM_VERSION,
        randomStream: ASSIGNMENT_RANDOM_STREAM,
        roleCatalogSignature: input.roleCatalogSignature,
        assignments
      }
    };
  }
}

export const createSeededCharacterAssignmentGenerator = (): SeededCharacterAssignmentGenerator =>
  new SeededCharacterAssignmentGenerator();
