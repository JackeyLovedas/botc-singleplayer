import {
  BASE_TWELVE_PLAYER_COUNTS,
  CHARACTER_TYPES,
  SUPPORTED_RANDOM_ALGORITHM_VERSION,
  SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM,
  SUPPORTED_ROLE_CATALOG_VERSION,
  SUPPORTED_SCRIPT_ID,
  SUPPORTED_SETUP_ALGORITHM_VERSION,
  SUPPORTED_SETUP_RANDOM_STREAM,
  DeterministicRandom,
  compareStableId,
  createRoleCatalogSnapshot,
  isZeroSetupModifier,
  validateScriptDefinitionForSetup
} from "@botc/domain-core";
import type {
  CharacterType,
  GeneratedSetup,
  RoleCountSet,
  RoleCatalogSnapshot,
  RoleDefinition,
  RoleId,
  RoleSetupSnapshot,
  ScriptDefinition,
  SetupFailureCode,
  SetupGenerationConstraints,
  SetupGenerationConstraintsSnapshot,
  SetupGenerationFailure,
  SetupGenerationResult,
  SetupGeneratorInput,
  SetupModifierApplied
} from "@botc/domain-core";

export const SETUP_ALGORITHM_VERSION = SUPPORTED_SETUP_ALGORITHM_VERSION;
export const RANDOM_ALGORITHM_VERSION = SUPPORTED_RANDOM_ALGORITHM_VERSION;
export const SETUP_RANDOM_STREAM = SUPPORTED_SETUP_RANDOM_STREAM;
export const ROLE_CATALOG_VERSION = SUPPORTED_ROLE_CATALOG_VERSION;
export const ROLE_CATALOG_SIGNATURE_ALGORITHM = SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM;

const TYPE_ORDER = new Map<CharacterType, number>(CHARACTER_TYPES.map((type, index) => [type, index]));

const stableRoleSort = <TRole extends { readonly roleId: RoleId; readonly characterType?: CharacterType }>(roles: readonly TRole[]): TRole[] =>
  [...roles].sort((left, right) => {
    const leftType = left.characterType === undefined ? 0 : TYPE_ORDER.get(left.characterType) ?? 0;
    const rightType = right.characterType === undefined ? 0 : TYPE_ORDER.get(right.characterType) ?? 0;
    if (leftType !== rightType) {
      return leftType - rightType;
    }

    return compareStableId(left.roleId, right.roleId);
  });

const stableRoleIdSort = <TRole extends { readonly roleId: RoleId }>(roles: readonly TRole[]): TRole[] =>
  [...roles].sort((left, right) => compareStableId(left.roleId, right.roleId));

const countRolesByType = (roles: readonly RoleDefinition[] | readonly RoleSetupSnapshot[]): RoleCountSet => ({
  TOWNSFOLK: roles.filter((role) => role.characterType === "TOWNSFOLK").length,
  OUTSIDER: roles.filter((role) => role.characterType === "OUTSIDER").length,
  MINION: roles.filter((role) => role.characterType === "MINION").length,
  DEMON: roles.filter((role) => role.characterType === "DEMON").length
});

const countTotal = (counts: RoleCountSet): number => counts.TOWNSFOLK + counts.OUTSIDER + counts.MINION + counts.DEMON;

const sameCounts = (left: RoleCountSet, right: RoleCountSet): boolean =>
  CHARACTER_TYPES.every((type) => left[type] === right[type]);

const subtractCounts = (left: RoleCountSet, right: RoleCountSet): RoleCountSet => ({
  TOWNSFOLK: left.TOWNSFOLK - right.TOWNSFOLK,
  OUTSIDER: left.OUTSIDER - right.OUTSIDER,
  MINION: left.MINION - right.MINION,
  DEMON: left.DEMON - right.DEMON
});

const duplicateRoleIds = (roleIds: readonly RoleId[]): readonly RoleId[] => {
  const seen = new Set<RoleId>();
  const duplicates = new Set<RoleId>();
  for (const roleIdValue of roleIds) {
    if (seen.has(roleIdValue)) {
      duplicates.add(roleIdValue);
      continue;
    }
    seen.add(roleIdValue);
  }

  return [...duplicates].sort(compareStableId);
};

const normalizeConstraints = (constraints: SetupGenerationConstraints): SetupGenerationConstraintsSnapshot => ({
  lockedRoleIds: [...(constraints.lockedRoleIds ?? [])].sort(compareStableId),
  excludedRoleIds: [...(constraints.excludedRoleIds ?? [])].sort(compareStableId),
  exactRoleIds: [...(constraints.exactRoleIds ?? [])].sort(compareStableId)
});

const snapshotRole = (role: RoleDefinition): RoleSetupSnapshot => ({
  roleId: role.roleId,
  characterType: role.characterType,
  defaultAlignment: role.defaultAlignment,
  edition: role.edition,
  setupModifier: {
    outsiderDelta: role.setupModifier.outsiderDelta,
    townsfolkDelta: role.setupModifier.townsfolkDelta
  }
});

const copyRole = (role: RoleDefinition): RoleDefinition => ({
  ...role,
  setupModifier: {
    outsiderDelta: role.setupModifier.outsiderDelta,
    townsfolkDelta: role.setupModifier.townsfolkDelta
  }
});

const copyScript = (script: ScriptDefinition): ScriptDefinition => ({
  scriptId: script.scriptId,
  scriptName: script.scriptName,
  edition: script.edition,
  roles: stableRoleSort(script.roles.map(copyRole))
});

const copyRoleCatalogSnapshot = (snapshot: RoleCatalogSnapshot): RoleCatalogSnapshot => ({
  scriptId: snapshot.scriptId,
  edition: snapshot.edition,
  roleCatalogVersion: snapshot.roleCatalogVersion,
  roles: snapshot.roles.map((role) => ({
    ...role,
    setupModifier: {
      outsiderDelta: role.setupModifier.outsiderDelta,
      townsfolkDelta: role.setupModifier.townsfolkDelta
    }
  })),
  canonicalSignature: snapshot.canonicalSignature
});

const applyDemonModifier = (demon: RoleDefinition | RoleSetupSnapshot): RoleCountSet => ({
  TOWNSFOLK: BASE_TWELVE_PLAYER_COUNTS.TOWNSFOLK + demon.setupModifier.townsfolkDelta,
  OUTSIDER: BASE_TWELVE_PLAYER_COUNTS.OUTSIDER + demon.setupModifier.outsiderDelta,
  MINION: BASE_TWELVE_PLAYER_COUNTS.MINION,
  DEMON: BASE_TWELVE_PLAYER_COUNTS.DEMON
});

const modifierIsValid = (counts: RoleCountSet): boolean =>
  countTotal(counts) === 12 && CHARACTER_TYPES.every((type) => counts[type] >= 0);

const appliedModifiersFor = (demon: RoleDefinition): readonly SetupModifierApplied[] =>
  isZeroSetupModifier(demon.setupModifier)
    ? []
    : [{
        roleId: demon.roleId,
        outsiderDelta: demon.setupModifier.outsiderDelta,
        townsfolkDelta: demon.setupModifier.townsfolkDelta
      }];

const chooseOne = <TValue>(random: DeterministicRandom, candidates: readonly TValue[]): TValue | undefined => {
  if (candidates.length === 0) {
    return undefined;
  }

  return candidates[random.nextInt(candidates.length)];
};

const chooseMany = <TValue extends { readonly roleId: RoleId; readonly characterType?: CharacterType }>(
  random: DeterministicRandom,
  candidates: readonly TValue[],
  count: number
): readonly TValue[] => {
  if (candidates.length < count) {
    throw new Error("Cannot choose more candidates than are available");
  }

  const pool = stableRoleSort(candidates);
  const selected: TValue[] = [];
  while (selected.length < count) {
    const index = random.nextInt(pool.length);
    const [role] = pool.splice(index, 1);
    if (role !== undefined) {
      selected.push(role);
    }
  }

  return stableRoleSort(selected);
};

const chooseManyByRoleId = <TValue extends { readonly roleId: RoleId }>(
  random: DeterministicRandom,
  candidates: readonly TValue[],
  count: number
): readonly TValue[] => {
  if (candidates.length < count) {
    throw new Error("Cannot choose more candidates than are available");
  }

  const pool = stableRoleIdSort(candidates);
  const selected: TValue[] = [];
  while (selected.length < count) {
    const index = random.nextInt(pool.length);
    const [role] = pool.splice(index, 1);
    if (role !== undefined) {
      selected.push(role);
    }
  }

  return stableRoleIdSort(selected);
};

export type DemonSetupPlan = {
  readonly demon: RoleDefinition;
  readonly postModifierCounts: RoleCountSet;
  readonly lockedCounts: RoleCountSet;
  readonly remainingCounts: RoleCountSet;
  readonly availableCounts: RoleCountSet;
  readonly eligibleBluffCount: number;
};

export type DemonFeasibilityResult =
  | {
      readonly status: "feasible";
      readonly plan: DemonSetupPlan;
    }
  | {
      readonly status: "infeasible";
      readonly demon: RoleDefinition;
      readonly failureCode: SetupFailureCode;
      readonly message: string;
      readonly conflictingRoleIds: readonly RoleId[];
      readonly requestedCounts: RoleCountSet | undefined;
      readonly availableCounts: RoleCountSet | undefined;
    };

export type DemonFeasibilityInput = {
  readonly demon: RoleDefinition;
  readonly lockedRoles: readonly RoleDefinition[];
  readonly excludedRoleIds: readonly RoleId[];
  readonly scriptRoles: readonly RoleDefinition[];
};

const compareDemonSetupPlan = (left: DemonSetupPlan, right: DemonSetupPlan): number =>
  compareStableId(left.demon.roleId, right.demon.roleId);

export const evaluateDemonFeasibility = (input: DemonFeasibilityInput): DemonFeasibilityResult => {
  const excluded = new Set(input.excludedRoleIds);
  const postModifierCounts = applyDemonModifier(input.demon);
  if (!modifierIsValid(postModifierCounts)) {
    return {
      status: "infeasible",
      demon: input.demon,
      failureCode: "InvalidModifierResult",
      message: "Demon setup modifier produced invalid role counts",
      conflictingRoleIds: [input.demon.roleId],
      requestedCounts: undefined,
      availableCounts: undefined
    };
  }

  const selectedById = new Map<RoleId, RoleDefinition>([[input.demon.roleId, input.demon]]);
  for (const role of input.lockedRoles) {
    selectedById.set(role.roleId, role);
  }

  const selectedRoles = [...selectedById.values()];
  const lockedCounts = countRolesByType(selectedRoles);
  const remainingCounts = subtractCounts(postModifierCounts, lockedCounts);
  const overflowingTypes = CHARACTER_TYPES.filter((type) => remainingCounts[type] < 0);
  if (overflowingTypes.length > 0) {
    const conflictingRoleIds = selectedRoles
      .filter((role) => overflowingTypes.includes(role.characterType))
      .map((role) => role.roleId)
      .sort(compareStableId);
    return {
      status: "infeasible",
      demon: input.demon,
      failureCode: "TooManyLockedRolesForType",
      message: "Locked roles exceed post-modifier type capacity",
      conflictingRoleIds,
      requestedCounts: postModifierCounts,
      availableCounts: lockedCounts
    };
  }

  const availableRoles = input.scriptRoles.filter((role) => !excluded.has(role.roleId) && !selectedById.has(role.roleId));
  const availableCounts = countRolesByType(availableRoles);
  if (CHARACTER_TYPES.some((type) => availableCounts[type] < remainingCounts[type])) {
    return {
      status: "infeasible",
      demon: input.demon,
      failureCode: "InsufficientCandidates",
      message: "Not enough candidates are available for the demon plan",
      conflictingRoleIds: [],
      requestedCounts: remainingCounts,
      availableCounts
    };
  }

  const availableGoodRoleCount = input.scriptRoles.filter(
    (role) => role.defaultAlignment === "GOOD" && !excluded.has(role.roleId)
  ).length;
  const eligibleBluffCount = availableGoodRoleCount - postModifierCounts.TOWNSFOLK - postModifierCounts.OUTSIDER;
  if (eligibleBluffCount < 3) {
    return {
      status: "infeasible",
      demon: input.demon,
      failureCode: "InsufficientDemonBluffs",
      message: "Not enough legal demon bluff candidates are available",
      conflictingRoleIds: [],
      requestedCounts: undefined,
      availableCounts
    };
  }

  return {
    status: "feasible",
    plan: {
      demon: input.demon,
      postModifierCounts,
      lockedCounts,
      remainingCounts,
      availableCounts,
      eligibleBluffCount
    }
  };
};

type FailureBuilder = (
  failureCode: SetupFailureCode,
  message: string,
  conflictingRoleIds?: readonly RoleId[],
  requestedCounts?: RoleCountSet,
  availableCounts?: RoleCountSet
) => SetupGenerationFailure;

export class SeededSectsAndVioletsSetupGenerator {
  private readonly script: ScriptDefinition;
  private readonly rolesById: ReadonlyMap<RoleId, RoleDefinition>;
  private readonly roleCatalogSnapshot: RoleCatalogSnapshot;

  public constructor(script: ScriptDefinition) {
    this.script = copyScript(script);
    validateScriptDefinitionForSetup(this.script);
    this.roleCatalogSnapshot = createRoleCatalogSnapshot(this.script);
    this.rolesById = new Map(this.script.roles.map((role) => [role.roleId, role]));
  }

  public generate(input: SetupGeneratorInput): SetupGenerationResult {
    const constraintsSnapshot = normalizeConstraints(input.constraints);
    const random = new DeterministicRandom(
      `${input.rootSeed}|${SETUP_RANDOM_STREAM}|${SETUP_ALGORITHM_VERSION}|${RANDOM_ALGORITHM_VERSION}`
    );
    const failure: FailureBuilder = (
      failureCode,
      message,
      conflictingRoleIds = [],
      requestedCounts = undefined,
      availableCounts = undefined
    ) => ({
      status: "failure",
      failureCode,
      message,
      conflictingRoleIds: [...conflictingRoleIds].sort(compareStableId),
      requestedCounts,
      availableCounts,
      constraintsSnapshot
    });

    if (input.scriptId !== SUPPORTED_SCRIPT_ID || input.playerCount !== 12) {
      return failure("NoLegalSetup", "Only 12-player Sects & Violets setup is supported");
    }

    const allConstraintIds = [
      ...constraintsSnapshot.lockedRoleIds,
      ...constraintsSnapshot.excludedRoleIds,
      ...constraintsSnapshot.exactRoleIds
    ];
    const unknownRoleIds = allConstraintIds.filter((roleIdValue) => !this.rolesById.has(roleIdValue));
    if (unknownRoleIds.length > 0) {
      return failure("UnknownRole", "All constrained roles must belong to the selected script", unknownRoleIds);
    }

    const duplicateIds = [
      ...duplicateRoleIds(constraintsSnapshot.lockedRoleIds),
      ...duplicateRoleIds(constraintsSnapshot.excludedRoleIds),
      ...duplicateRoleIds(constraintsSnapshot.exactRoleIds)
    ];
    if (duplicateIds.length > 0) {
      return failure("DuplicateConstraintRole", "Constraint role ids must be unique within each constraint list", duplicateIds);
    }

    const excluded = new Set(constraintsSnapshot.excludedRoleIds);
    const lockedAndExcluded = constraintsSnapshot.lockedRoleIds.filter((roleIdValue) => excluded.has(roleIdValue));
    if (lockedAndExcluded.length > 0) {
      return failure("LockedAndExcludedConflict", "A role cannot be both locked and excluded", lockedAndExcluded);
    }

    if (input.constraints.exactRoleIds !== undefined) {
      if (constraintsSnapshot.lockedRoleIds.length > 0 || constraintsSnapshot.excludedRoleIds.length > 0) {
        return failure("ExactSetupCannotUseOtherConstraints", "exactRoleIds cannot be combined with locked or excluded roles");
      }

      if (constraintsSnapshot.exactRoleIds.length !== 12) {
        return failure("ExactSetupWrongSize", "exactRoleIds must contain exactly 12 roles", constraintsSnapshot.exactRoleIds);
      }

      return this.generateExactSetup(constraintsSnapshot, random, failure);
    }

    return this.generateRandomSetup(constraintsSnapshot, random, failure);
  }

  private generateExactSetup(
    constraintsSnapshot: SetupGenerationConstraintsSnapshot,
    random: DeterministicRandom,
    failure: FailureBuilder
  ): SetupGenerationResult {
    const actualRoles = constraintsSnapshot.exactRoleIds.map((roleIdValue) => this.rolesById.get(roleIdValue)).filter((role): role is RoleDefinition => role !== undefined);
    const demons = actualRoles.filter((role) => role.characterType === "DEMON");
    if (demons.length !== 1) {
      return failure("NoLegalSetup", "exactRoleIds must contain exactly one demon", demons.map((role) => role.roleId));
    }

    const demon = demons[0];
    if (demon === undefined) {
      return failure("NoLegalSetup", "exactRoleIds must contain exactly one demon");
    }

    const postModifierCounts = applyDemonModifier(demon);
    if (!modifierIsValid(postModifierCounts)) {
      return failure("InvalidModifierResult", "Demon setup modifier produced invalid role counts", [demon.roleId]);
    }

    const actualCounts = countRolesByType(actualRoles);
    if (!sameCounts(actualCounts, postModifierCounts)) {
      return failure("NoLegalSetup", "exactRoleIds do not match required post-modifier counts", constraintsSnapshot.exactRoleIds, postModifierCounts, actualCounts);
    }

    return this.buildSuccess(actualRoles, demon, constraintsSnapshot, random, failure);
  }

  private generateRandomSetup(
    constraintsSnapshot: SetupGenerationConstraintsSnapshot,
    random: DeterministicRandom,
    failure: FailureBuilder
  ): SetupGenerationResult {
    const excluded = new Set(constraintsSnapshot.excludedRoleIds);
    const lockedRoles = constraintsSnapshot.lockedRoleIds.map((roleIdValue) => this.rolesById.get(roleIdValue)).filter((role): role is RoleDefinition => role !== undefined);
    const lockedDemons = lockedRoles.filter((role) => role.characterType === "DEMON");
    if (lockedDemons.length > 1) {
      return failure("MultipleLockedDemons", "Only one demon can be locked into a 12-player setup", lockedDemons.map((role) => role.roleId));
    }

    const demonCandidates = lockedDemons.length === 1
      ? lockedDemons
      : stableRoleSort(this.script.roles.filter((role) => role.characterType === "DEMON" && !excluded.has(role.roleId)));
    if (demonCandidates.length === 0) {
      return failure("InsufficientCandidates", "No legal demon candidates are available", [], BASE_TWELVE_PLAYER_COUNTS, countRolesByType(demonCandidates));
    }

    const feasibilityResults = demonCandidates.map((demon) =>
      evaluateDemonFeasibility({
        demon,
        lockedRoles,
        excludedRoleIds: constraintsSnapshot.excludedRoleIds,
        scriptRoles: this.script.roles
      })
    );
    const feasiblePlans = feasibilityResults
      .filter((result): result is Extract<DemonFeasibilityResult, { readonly status: "feasible" }> => result.status === "feasible")
      .map((result) => result.plan)
      .sort(compareDemonSetupPlan);

    const selectedPlan = chooseOne(random, feasiblePlans);
    if (selectedPlan === undefined) {
      const firstFailure = feasibilityResults.find(
        (result): result is Extract<DemonFeasibilityResult, { readonly status: "infeasible" }> => result.status === "infeasible"
      );
      return failure(
        firstFailure?.failureCode ?? "NoLegalSetup",
        firstFailure?.message ?? "No legal setup exists for the given constraints",
        firstFailure?.conflictingRoleIds ?? [],
        firstFailure?.requestedCounts,
        firstFailure?.availableCounts
      );
    }

    return this.buildSetupFromPlan(selectedPlan, lockedRoles, constraintsSnapshot, random, failure);
  }

  private buildSetupFromPlan(
    plan: DemonSetupPlan,
    lockedRoles: readonly RoleDefinition[],
    constraintsSnapshot: SetupGenerationConstraintsSnapshot,
    random: DeterministicRandom,
    failure: FailureBuilder
  ): SetupGenerationResult {
    const excluded = new Set(constraintsSnapshot.excludedRoleIds);
    const selectedById = new Map<RoleId, RoleDefinition>([[plan.demon.roleId, plan.demon]]);
    for (const role of lockedRoles) {
      selectedById.set(role.roleId, role);
    }

    for (const type of CHARACTER_TYPES) {
      const needed = plan.remainingCounts[type];
      if (needed === 0) {
        continue;
      }

      const candidates = stableRoleSort(
        this.script.roles.filter(
          (role) => role.characterType === type && !excluded.has(role.roleId) && !selectedById.has(role.roleId)
        )
      );
      if (candidates.length < needed) {
        return failure("InsufficientCandidates", `Not enough ${type} candidates are available`, [], plan.remainingCounts, countRolesByType(candidates));
      }

      for (const role of chooseMany(random, candidates, needed)) {
        selectedById.set(role.roleId, role);
      }
    }

    return this.buildSuccess([...selectedById.values()], plan.demon, constraintsSnapshot, random, failure);
  }

  private buildSuccess(
    actualRoleDefinitions: readonly RoleDefinition[],
    demon: RoleDefinition,
    constraintsSnapshot: SetupGenerationConstraintsSnapshot,
    random: DeterministicRandom,
    failure: FailureBuilder
  ): SetupGenerationResult {
    const actualRoles = stableRoleSort(actualRoleDefinitions).map(snapshotRole);
    const actualRoleIds = new Set(actualRoles.map((role) => role.roleId));
    const excluded = new Set(constraintsSnapshot.excludedRoleIds);
    const demonBluffCandidates = stableRoleIdSort(
      this.script.roles.filter(
        (role) => role.defaultAlignment === "GOOD" && !actualRoleIds.has(role.roleId) && !excluded.has(role.roleId)
      )
    );
    if (demonBluffCandidates.length < 3) {
      return failure("InsufficientDemonBluffs", "Not enough legal demon bluff candidates are available", [], undefined, countRolesByType(demonBluffCandidates));
    }

    const demonBluffs = chooseManyByRoleId(random, demonBluffCandidates, 3).map(snapshotRole);
    const postModifierCounts = applyDemonModifier(demon);
    const actualCounts = countRolesByType(actualRoles);
    const roleCatalogSnapshot = copyRoleCatalogSnapshot(this.roleCatalogSnapshot);
    const setup: GeneratedSetup = {
      scriptId: SUPPORTED_SCRIPT_ID,
      setupAlgorithmVersion: SETUP_ALGORITHM_VERSION,
      randomAlgorithmVersion: RANDOM_ALGORITHM_VERSION,
      randomStream: SETUP_RANDOM_STREAM,
      roleCatalogVersion: ROLE_CATALOG_VERSION,
      roleCatalogSnapshot,
      roleCatalogSignature: roleCatalogSnapshot.canonicalSignature,
      roleCatalogSignatureAlgorithm: ROLE_CATALOG_SIGNATURE_ALGORITHM,
      constraintsSnapshot,
      preModifierCounts: BASE_TWELVE_PLAYER_COUNTS,
      postModifierCounts,
      actualRoles,
      demonRole: snapshotRole(demon),
      setupModifiersApplied: appliedModifiersFor(demon),
      demonBluffs,
      validationSummary: {
        actualRoleCount: actualRoles.length,
        demonBluffCount: demonBluffs.length,
        roleIdsUnique: new Set(actualRoles.map((role) => role.roleId)).size === actualRoles.length,
        demonRoleCount: actualCounts.DEMON,
        minionRoleCount: actualCounts.MINION,
        actualRolesMatchPostModifierCounts: sameCounts(actualCounts, postModifierCounts)
      }
    };

    return {
      status: "success",
      setup
    };
  }
}

export const createSeededSectsAndVioletsSetupGenerator = (
  script: ScriptDefinition
): SeededSectsAndVioletsSetupGenerator => new SeededSectsAndVioletsSetupGenerator(script);
