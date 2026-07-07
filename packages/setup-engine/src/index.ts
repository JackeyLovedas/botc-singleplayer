import {
  BASE_TWELVE_PLAYER_COUNTS,
  SUPPORTED_SCRIPT_ID,
  isSupportedScriptMetadata
} from "@botc/domain-core";
import type {
  CharacterType,
  GeneratedSetup,
  RoleCountSet,
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

export const SETUP_ALGORITHM_VERSION = "snv-12-setup-v1";
export const RANDOM_ALGORITHM_VERSION = "xmur3-sfc32-rejection-v1";
export const SETUP_RANDOM_STREAM = "setup/sects-and-violets/12/v1";

const CHARACTER_TYPES: readonly CharacterType[] = ["TOWNSFOLK", "OUTSIDER", "MINION", "DEMON"];
const TYPE_ORDER = new Map<CharacterType, number>(CHARACTER_TYPES.map((type, index) => [type, index]));

const stableRoleSort = <TRole extends { readonly roleId: RoleId; readonly characterType?: CharacterType }>(roles: readonly TRole[]): TRole[] =>
  [...roles].sort((left, right) => {
    const leftType = left.characterType === undefined ? 0 : TYPE_ORDER.get(left.characterType) ?? 0;
    const rightType = right.characterType === undefined ? 0 : TYPE_ORDER.get(right.characterType) ?? 0;
    if (leftType !== rightType) {
      return leftType - rightType;
    }

    return left.roleId.localeCompare(right.roleId);
  });

const countRolesByType = (roles: readonly RoleDefinition[] | readonly RoleSetupSnapshot[]): RoleCountSet => ({
  TOWNSFOLK: roles.filter((role) => role.characterType === "TOWNSFOLK").length,
  OUTSIDER: roles.filter((role) => role.characterType === "OUTSIDER").length,
  MINION: roles.filter((role) => role.characterType === "MINION").length,
  DEMON: roles.filter((role) => role.characterType === "DEMON").length
});

const countTotal = (counts: RoleCountSet): number => counts.TOWNSFOLK + counts.OUTSIDER + counts.MINION + counts.DEMON;

const sameCounts = (left: RoleCountSet, right: RoleCountSet): boolean =>
  CHARACTER_TYPES.every((type) => left[type] === right[type]);

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

  return [...duplicates].sort();
};

const normalizeConstraints = (constraints: SetupGenerationConstraints): SetupGenerationConstraintsSnapshot => ({
  lockedRoleIds: [...(constraints.lockedRoleIds ?? [])].sort(),
  excludedRoleIds: [...(constraints.excludedRoleIds ?? [])].sort(),
  exactRoleIds: [...(constraints.exactRoleIds ?? [])].sort()
});

const snapshotRole = (role: RoleDefinition): RoleSetupSnapshot => ({
  roleId: role.roleId,
  characterType: role.characterType,
  defaultAlignment: role.defaultAlignment,
  edition: role.edition,
  setupModifier: role.setupModifier
});

const applyDemonModifier = (demon: RoleDefinition): RoleCountSet => ({
  TOWNSFOLK: BASE_TWELVE_PLAYER_COUNTS.TOWNSFOLK + demon.setupModifier.townsfolkDelta,
  OUTSIDER: BASE_TWELVE_PLAYER_COUNTS.OUTSIDER + demon.setupModifier.outsiderDelta,
  MINION: BASE_TWELVE_PLAYER_COUNTS.MINION,
  DEMON: BASE_TWELVE_PLAYER_COUNTS.DEMON
});

const modifierIsValid = (counts: RoleCountSet): boolean =>
  countTotal(counts) === 12 && CHARACTER_TYPES.every((type) => counts[type] >= 0);

const appliedModifiersFor = (demon: RoleDefinition): readonly SetupModifierApplied[] =>
  demon.setupModifier.outsiderDelta === 0 && demon.setupModifier.townsfolkDelta === 0
    ? []
    : [{
        roleId: demon.roleId,
        outsiderDelta: demon.setupModifier.outsiderDelta,
        townsfolkDelta: demon.setupModifier.townsfolkDelta
      }];

const xmur3 = (input: string): (() => number) => {
  let hash = 1779033703 ^ input.length;
  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(hash ^ input.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
};

class DeterministicRandom {
  private a: number;
  private b: number;
  private c: number;
  private d: number;

  public constructor(seed: string) {
    const seedGenerator = xmur3(seed);
    this.a = seedGenerator();
    this.b = seedGenerator();
    this.c = seedGenerator();
    this.d = seedGenerator();
  }

  public nextUint32(): number {
    this.a >>>= 0;
    this.b >>>= 0;
    this.c >>>= 0;
    this.d >>>= 0;
    const result = (this.a + this.b + this.d) >>> 0;
    this.d = (this.d + 1) >>> 0;
    this.a = (this.b ^ (this.b >>> 9)) >>> 0;
    this.b = (this.c + (this.c << 3)) >>> 0;
    this.c = ((this.c << 21) | (this.c >>> 11)) >>> 0;
    this.c = (this.c + result) >>> 0;
    return result;
  }

  public nextInt(maxExclusive: number): number {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      throw new Error("maxExclusive must be a positive integer");
    }

    const range = 0x100000000;
    const limit = range - (range % maxExclusive);
    let value = this.nextUint32();
    while (value >= limit) {
      value = this.nextUint32();
    }

    return value % maxExclusive;
  }
}

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

const assertUsableScript = (script: ScriptDefinition): void => {
  if (!isSupportedScriptMetadata(script.scriptId, script.scriptName, script.edition)) {
    throw new Error("Setup generator only supports Sects & Violets");
  }

  const roleIds = new Set(script.roles.map((role) => role.roleId));
  if (script.roles.length !== 25 || roleIds.size !== 25) {
    throw new Error("Setup generator requires a complete 25-role Sects & Violets catalog");
  }
};

export class SeededSectsAndVioletsSetupGenerator {
  private readonly rolesById: ReadonlyMap<RoleId, RoleDefinition>;

  public constructor(private readonly script: ScriptDefinition) {
    assertUsableScript(script);
    this.rolesById = new Map(script.roles.map((role) => [role.roleId, role]));
  }

  public generate(input: SetupGeneratorInput): SetupGenerationResult {
    const constraintsSnapshot = normalizeConstraints(input.constraints);
    const random = new DeterministicRandom(
      `${input.rootSeed}|${SETUP_RANDOM_STREAM}|${SETUP_ALGORITHM_VERSION}|${RANDOM_ALGORITHM_VERSION}`
    );
    const failure = (
      failureCode: SetupFailureCode,
      message: string,
      conflictingRoleIds: readonly RoleId[] = [],
      requestedCounts: RoleCountSet | undefined = undefined,
      availableCounts: RoleCountSet | undefined = undefined
    ): SetupGenerationFailure => ({
      status: "failure",
      failureCode,
      message,
      conflictingRoleIds: [...conflictingRoleIds].sort(),
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
    failure: (
      failureCode: SetupFailureCode,
      message: string,
      conflictingRoleIds?: readonly RoleId[],
      requestedCounts?: RoleCountSet,
      availableCounts?: RoleCountSet
    ) => SetupGenerationFailure
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
    failure: (
      failureCode: SetupFailureCode,
      message: string,
      conflictingRoleIds?: readonly RoleId[],
      requestedCounts?: RoleCountSet,
      availableCounts?: RoleCountSet
    ) => SetupGenerationFailure
  ): SetupGenerationResult {
    const excluded = new Set(constraintsSnapshot.excludedRoleIds);
    const lockedRoles = constraintsSnapshot.lockedRoleIds.map((roleIdValue) => this.rolesById.get(roleIdValue)).filter((role): role is RoleDefinition => role !== undefined);
    const lockedDemons = lockedRoles.filter((role) => role.characterType === "DEMON");
    if (lockedDemons.length > 1) {
      return failure("MultipleLockedDemons", "Only one demon can be locked into a 12-player setup", lockedDemons.map((role) => role.roleId));
    }

    const demonCandidates = stableRoleSort(
      this.script.roles.filter((role) => role.characterType === "DEMON" && !excluded.has(role.roleId))
    );
    const demon = lockedDemons[0] ?? chooseOne(random, demonCandidates);
    if (demon === undefined) {
      return failure("InsufficientCandidates", "No legal demon candidates are available", [], BASE_TWELVE_PLAYER_COUNTS, countRolesByType(demonCandidates));
    }

    const postModifierCounts = applyDemonModifier(demon);
    if (!modifierIsValid(postModifierCounts)) {
      return failure("InvalidModifierResult", "Demon setup modifier produced invalid role counts", [demon.roleId]);
    }

    const selectedById = new Map<RoleId, RoleDefinition>([[demon.roleId, demon]]);
    for (const role of lockedRoles) {
      selectedById.set(role.roleId, role);
    }

    const selectedRoles = [...selectedById.values()];
    const selectedCounts = countRolesByType(selectedRoles);
    const overflowingTypes = CHARACTER_TYPES.filter((type) => selectedCounts[type] > postModifierCounts[type]);
    if (overflowingTypes.length > 0) {
      return failure("TooManyLockedRolesForType", "Locked roles exceed post-modifier type capacity", constraintsSnapshot.lockedRoleIds, postModifierCounts, selectedCounts);
    }

    for (const type of CHARACTER_TYPES) {
      const needed = postModifierCounts[type] - selectedCounts[type];
      if (needed === 0) {
        continue;
      }

      const candidates = stableRoleSort(
        this.script.roles.filter(
          (role) => role.characterType === type && !excluded.has(role.roleId) && !selectedById.has(role.roleId)
        )
      );
      if (candidates.length < needed) {
        return failure("InsufficientCandidates", `Not enough ${type} candidates are available`, [], postModifierCounts, countRolesByType(candidates));
      }

      for (const role of chooseMany(random, candidates, needed)) {
        selectedById.set(role.roleId, role);
      }
    }

    return this.buildSuccess([...selectedById.values()], demon, constraintsSnapshot, random, failure);
  }

  private buildSuccess(
    actualRoleDefinitions: readonly RoleDefinition[],
    demon: RoleDefinition,
    constraintsSnapshot: SetupGenerationConstraintsSnapshot,
    random: DeterministicRandom,
    failure: (
      failureCode: SetupFailureCode,
      message: string,
      conflictingRoleIds?: readonly RoleId[],
      requestedCounts?: RoleCountSet,
      availableCounts?: RoleCountSet
    ) => SetupGenerationFailure
  ): SetupGenerationResult {
    const actualRoles = stableRoleSort(actualRoleDefinitions).map(snapshotRole);
    const actualRoleIds = new Set(actualRoles.map((role) => role.roleId));
    const excluded = new Set(constraintsSnapshot.excludedRoleIds);
    const demonBluffCandidates = stableRoleSort(
      this.script.roles.filter(
        (role) => role.defaultAlignment === "GOOD" && !actualRoleIds.has(role.roleId) && !excluded.has(role.roleId)
      )
    );
    if (demonBluffCandidates.length < 3) {
      return failure("InsufficientDemonBluffs", "Not enough legal demon bluff candidates are available", [], undefined, countRolesByType(demonBluffCandidates));
    }

    const demonBluffs = stableRoleSort(chooseMany(random, demonBluffCandidates, 3)).map(snapshotRole);
    const postModifierCounts = applyDemonModifier(demon);
    const actualCounts = countRolesByType(actualRoles);
    const setup: GeneratedSetup = {
      scriptId: SUPPORTED_SCRIPT_ID,
      setupAlgorithmVersion: SETUP_ALGORITHM_VERSION,
      randomAlgorithmVersion: RANDOM_ALGORITHM_VERSION,
      randomStream: SETUP_RANDOM_STREAM,
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
