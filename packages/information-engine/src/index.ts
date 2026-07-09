import {
  INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
  DEMON_INFORMATION_KNOWLEDGE_STAGE,
  MINION_INFORMATION_KNOWLEDGE_STAGE,
  SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
  SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
  cloneDeliveredEvilTeamSnapshot,
  cloneInitialOwnCharacterKnowledgeEntry,
  cloneFirstNightSystemInformationResolution,
  cloneRoleSetupSnapshot,
  expectedDemonInformationEntries,
  expectedMinionInformationEntries,
  resolveCurrentEvilTeam,
  validateCurrentCharacterStateSet,
  validateCharacterAssignments,
  validateInitialKnowledgeSourceFacts,
  validateInitialOwnCharacterKnowledgeEntries,
  validatePlayerRoster
} from "@botc/domain-core";
import type {
  InitialPrivateKnowledge,
  InitialPrivateKnowledgeGenerationFailure,
  InitialPrivateKnowledgeGenerationFailureCode,
  InitialPrivateKnowledgeGenerationResult,
  InitialPrivateKnowledgeGeneratorInput,
  InitialOwnCharacterKnowledgeEntry,
  FirstNightSystemInformationFailureCode,
  FirstNightSystemInformationResolutionFailure,
  FirstNightSystemInformationResolutionResult,
  FirstNightSystemInformationResolverInput,
  PlayerId,
  RoleId
} from "@botc/domain-core";

const failure = (
  failureCode: InitialPrivateKnowledgeGenerationFailureCode,
  message: string,
  conflictingPlayerIds: readonly PlayerId[] = [],
  conflictingRoleIds: readonly RoleId[] = []
): InitialPrivateKnowledgeGenerationFailure => ({
  status: "failure",
  failureCode,
  message,
  conflictingPlayerIds: [...conflictingPlayerIds],
  conflictingRoleIds: [...conflictingRoleIds]
});

const validateSetupForInitialKnowledge = (
  input: InitialPrivateKnowledgeGeneratorInput
): InitialPrivateKnowledgeGenerationFailure | undefined => {
  const actualRoles = input.setup.actualRoles;
  if (actualRoles.length !== 12) {
    return failure("InvalidSetup", "setup.actualRoles must contain exactly 12 roles");
  }

  const actualRoleIds = new Set<RoleId>();
  for (const role of actualRoles) {
    if (actualRoleIds.has(role.roleId)) {
      return failure("InvalidSetup", "setup.actualRoles role ids must be unique", [], [role.roleId]);
    }
    actualRoleIds.add(role.roleId);
  }

  const demons = actualRoles.filter((role) => role.characterType === "DEMON");
  if (demons.length === 0) {
    return failure("MissingDemon", "setup.actualRoles must contain one demon");
  }

  if (demons.length !== 1) {
    return failure("InvalidDemonCount", "setup.actualRoles must contain exactly one demon", [], demons.map((role) => role.roleId));
  }

  const minions = actualRoles.filter((role) => role.characterType === "MINION");
  if (minions.length !== 2) {
    return failure("InvalidMinionCount", "setup.actualRoles must contain exactly two minions", [], minions.map((role) => role.roleId));
  }

  if (input.setup.demonBluffs.length !== 3) {
    return failure("InvalidDemonBluffs", "setup.demonBluffs must contain exactly three roles");
  }

  const bluffRoleIds = new Set<RoleId>();
  for (const [index, bluff] of input.setup.demonBluffs.entries()) {
    if (index > 0 && (input.setup.demonBluffs[index - 1]?.roleId ?? "") >= bluff.roleId) {
      return failure("InvalidDemonBluffs", "setup.demonBluffs must be sorted by ASCII roleId", [], [bluff.roleId]);
    }

    if (bluffRoleIds.has(bluff.roleId)) {
      return failure("InvalidDemonBluffs", "setup.demonBluffs role ids must be unique", [], [bluff.roleId]);
    }
    bluffRoleIds.add(bluff.roleId);

    if (actualRoleIds.has(bluff.roleId) || bluff.defaultAlignment !== "GOOD") {
      return failure("InvalidDemonBluffs", "setup.demonBluffs must be good non-actual roles", [], [bluff.roleId]);
    }
  }

  return undefined;
};

export class InitialPrivateKnowledgeBuilder {
  public generate(input: InitialPrivateKnowledgeGeneratorInput): InitialPrivateKnowledgeGenerationResult {
    const rosterValidation = validatePlayerRoster(input.roster);
    if (!rosterValidation.valid) {
      return failure("InvalidRoster", rosterValidation.reason);
    }

    const setupValidation = validateSetupForInitialKnowledge(input);
    if (setupValidation !== undefined) {
      return setupValidation;
    }

    const assignmentValidation = validateCharacterAssignments({
      assignments: input.assignment,
      roster: input.roster,
      actualRoles: input.setup.actualRoles,
      roleCatalogRoles: input.setup.roleCatalogSnapshot.roles
    });
    if (!assignmentValidation.valid) {
      return failure("InvalidAssignment", assignmentValidation.reason);
    }

    const sourceFactsValidation = validateInitialKnowledgeSourceFacts(input);
    if (!sourceFactsValidation.valid) {
      const failureCode = sourceFactsValidation.reason.toLowerCase().includes("assignment")
        ? "InvalidAssignment"
        : "InvalidSetup";
      return failure(failureCode, sourceFactsValidation.reason);
    }

    const assignmentByPlayerId = new Map(input.assignment.map((assignment) => [assignment.playerId, assignment]));
    const orderedRoster = [...input.roster].sort((left, right) => left.seatNumber - right.seatNumber);
    const entries: InitialOwnCharacterKnowledgeEntry[] = [];

    for (const rosterEntry of orderedRoster) {
      const assignment = assignmentByPlayerId.get(rosterEntry.playerId);
      if (assignment === undefined) {
        return failure("InvalidAssignment", "assignment must cover every roster player", [rosterEntry.playerId]);
      }

      entries.push({
        kind: "OWN_CHARACTER",
        recipientPlayerId: rosterEntry.playerId,
        role: cloneRoleSetupSnapshot(assignment.role)
      });
    }

    const knowledge: InitialPrivateKnowledge = {
      knowledgeModelVersion: SUPPORTED_INITIAL_KNOWLEDGE_MODEL_VERSION,
      knowledgeStage: INITIAL_OWN_CHARACTER_KNOWLEDGE_STAGE,
      entries
    };
    const resultValidation = validateInitialOwnCharacterKnowledgeEntries({
      roster: input.roster,
      assignment: input.assignment,
      setup: input.setup,
      entries: knowledge.entries
    });
    if (!resultValidation.valid) {
      return failure("InvalidKnowledgeResult", resultValidation.reason);
    }

    return {
      status: "success",
      knowledge: {
        knowledgeModelVersion: knowledge.knowledgeModelVersion,
        knowledgeStage: knowledge.knowledgeStage,
        entries: knowledge.entries.map(cloneInitialOwnCharacterKnowledgeEntry)
      }
    };
  }
}

const systemInformationFailure = (
  failureCode: FirstNightSystemInformationFailureCode,
  message: string,
  conflictingPlayerIds: readonly PlayerId[] = []
): FirstNightSystemInformationResolutionFailure => ({
  status: "failure",
  failureCode,
  message,
  conflictingPlayerIds: [...conflictingPlayerIds].sort()
});

export class FirstNightSystemInformationResolver {
  public resolve(input: FirstNightSystemInformationResolverInput): FirstNightSystemInformationResolutionResult {
    if (input.taskType !== "MINION_INFO" && input.taskType !== "DEMON_INFO") {
      return systemInformationFailure("InvalidTaskType", "First-night system information only supports MINION_INFO and DEMON_INFO");
    }

    const rosterValidation = validatePlayerRoster(input.roster);
    if (!rosterValidation.valid) {
      return systemInformationFailure("InvalidRoster", rosterValidation.reason);
    }

    const currentValidation = validateCurrentCharacterStateSet({
      currentCharacterState: input.currentCharacterState,
      roster: input.roster,
      setup: input.setup
    });
    if (!currentValidation.valid) {
      return systemInformationFailure("InvalidCurrentCharacterState", currentValidation.reason);
    }

    if (input.setup.demonBluffs.length !== 3) {
      return systemInformationFailure("InvalidSetup", "setup.demonBluffs must contain exactly three roles");
    }

    const team = resolveCurrentEvilTeam({
      currentCharacterState: input.currentCharacterState,
      roster: input.roster
    });
    if (team.status === "failure") {
      return systemInformationFailure("InvalidEvilTeam", team.message, team.conflictingPlayerIds);
    }

    const resolvedEvilTeam = cloneDeliveredEvilTeamSnapshot(team.team);
    const entries = input.taskType === "MINION_INFO"
      ? expectedMinionInformationEntries(resolvedEvilTeam.demon, resolvedEvilTeam.minions)
      : expectedDemonInformationEntries(resolvedEvilTeam.demon, resolvedEvilTeam.minions, input.setup.demonBluffs);

    const resolution = {
      taskId: input.taskId,
      taskType: input.taskType,
      characterStateRevision: resolvedEvilTeam.characterStateRevision,
      resolvedEvilTeam,
      knowledgeModelVersion: SUPPORTED_FIRST_NIGHT_TEAM_KNOWLEDGE_MODEL_VERSION,
      knowledgeStage: input.taskType === "MINION_INFO"
        ? MINION_INFORMATION_KNOWLEDGE_STAGE
        : DEMON_INFORMATION_KNOWLEDGE_STAGE,
      entries
    };

    return {
      status: "success",
      resolution: cloneFirstNightSystemInformationResolution(resolution)
    };
  }
}
