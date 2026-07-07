import { describe, expect, it, vi } from "vitest";
import {
  SUPPORTED_ROLE_CATALOG_SIGNATURE,
  SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM,
  calculateRoleCatalogSignature,
  compareRoleSetupSnapshot,
  compareStableId,
  roleId
} from "@botc/domain-core";
import type { RoleCountSet, RoleDefinition, RoleId, RoleSetupSnapshot, ScriptDefinition, SetupGenerationResult } from "@botc/domain-core";
import { SECTS_AND_VIOLETS_SCRIPT } from "@botc/rules-snv";
import {
  DeterministicRandom,
  RANDOM_ALGORITHM_VERSION,
  ROLE_CATALOG_VERSION,
  ROLE_CATALOG_SIGNATURE_ALGORITHM,
  SETUP_ALGORITHM_VERSION,
  SETUP_RANDOM_STREAM,
  SeededSectsAndVioletsSetupGenerator
} from "@botc/setup-engine";

const generator = () => new SeededSectsAndVioletsSetupGenerator(SECTS_AND_VIOLETS_SCRIPT);
const id = (value: string): RoleId => roleId(value);

const generate = (overrides: Parameters<SeededSectsAndVioletsSetupGenerator["generate"]>[0] = {
  scriptId: "sects-and-violets",
  rootSeed: "seed-1",
  playerCount: 12,
  constraints: {}
}): SetupGenerationResult => generator().generate(overrides);

const expectSuccess = (result: SetupGenerationResult) => {
  expect(result.status).toBe("success");
  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return result.setup;
};

const roleIds = (result: SetupGenerationResult): string[] =>
  expectSuccess(result).actualRoles.map((role) => role.roleId);

const counts = (result: SetupGenerationResult): RoleCountSet => expectSuccess(result).postModifierCounts;

const makeScript = (roles: readonly RoleDefinition[]): ScriptDefinition => ({
  ...SECTS_AND_VIOLETS_SCRIPT,
  roles
});

const cloneRole = (role: RoleDefinition): RoleDefinition => ({
  ...role,
  setupModifier: { ...role.setupModifier }
});

const withRole = (roleIdValue: RoleId, patch: Partial<RoleDefinition>): ScriptDefinition =>
  makeScript(SECTS_AND_VIOLETS_SCRIPT.roles.map((role) => (role.roleId === roleIdValue ? { ...cloneRole(role), ...patch } : cloneRole(role))));

const reversedScript = (): ScriptDefinition => makeScript([...SECTS_AND_VIOLETS_SCRIPT.roles].reverse().map(cloneRole));

const snapshotRole = (role: RoleDefinition): RoleSetupSnapshot => ({
  roleId: role.roleId,
  characterType: role.characterType,
  defaultAlignment: role.defaultAlignment,
  edition: role.edition,
  setupModifier: { ...role.setupModifier }
});

const generateWithScript = (
  script: ScriptDefinition,
  overrides: Parameters<SeededSectsAndVioletsSetupGenerator["generate"]>[0]
): SetupGenerationResult => new SeededSectsAndVioletsSetupGenerator(script).generate(overrides);

describe("SeededSectsAndVioletsSetupGenerator", () => {
  it("uses fixed standard sfc32 nextUint32 vectors", () => {
    const random = new DeterministicRandom("vector-seed");

    expect(Array.from({ length: 10 }, () => random.nextUint32())).toStrictEqual([
      4192517003,
      1065224812,
      2124141431,
      4225418798,
      39656548,
      229722173,
      1759554890,
      569041450,
      1103139648,
      3514609012
    ]);
  });

  it("uses fixed rejection-sampled nextInt vectors", () => {
    const random = new DeterministicRandom("vector-seed");

    expect(Array.from({ length: 10 }, () => random.nextInt(17))).toStrictEqual([4, 1, 16, 16, 2, 0, 14, 8, 9, 10]);
  });

  it("produces 7/2/2/1 for an unmodified locked No Dashii setup", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-1",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("no_dashii")] }
    });

    expect(counts(result)).toStrictEqual({ TOWNSFOLK: 7, OUTSIDER: 2, MINION: 2, DEMON: 1 });
  });

  it("produces 6/3/2/1 for Fang Gu", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-1",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("fang_gu")] }
    });

    expect(counts(result)).toStrictEqual({ TOWNSFOLK: 6, OUTSIDER: 3, MINION: 2, DEMON: 1 });
  });

  it("produces 8/1/2/1 for Vigormortis", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-1",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("vigormortis")] }
    });

    expect(counts(result)).toStrictEqual({ TOWNSFOLK: 8, OUTSIDER: 1, MINION: 2, DEMON: 1 });
  });

  it("produces 7/2/2/1 for No Dashii", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-no-dashii",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("no_dashii")] }
    });

    expect(counts(result)).toStrictEqual({ TOWNSFOLK: 7, OUTSIDER: 2, MINION: 2, DEMON: 1 });
  });

  it("produces 7/2/2/1 for Vortox", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-vortox",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("vortox")] }
    });

    expect(counts(result)).toStrictEqual({ TOWNSFOLK: 7, OUTSIDER: 2, MINION: 2, DEMON: 1 });
  });

  it("selects exactly 12 actual roles", () => {
    expect(expectSuccess(generate()).actualRoles).toHaveLength(12);
  });

  it("does not duplicate actual roles", () => {
    const actualRoleIds = roleIds(generate());

    expect(new Set(actualRoleIds).size).toBe(actualRoleIds.length);
  });

  it("selects exactly one demon", () => {
    const setup = expectSuccess(generate());

    expect(setup.actualRoles.filter((role) => role.characterType === "DEMON")).toHaveLength(1);
  });

  it("returns deeply equal output for the same seed and constraints", () => {
    const first = generate();
    const second = generate();

    expect(second).toStrictEqual(first);
  });

  it("does not let other calls alter the deterministic stream", () => {
    const first = roleIds(generate({ scriptId: "sects-and-violets", rootSeed: "seed-stable", playerCount: 12, constraints: {} }));
    generate({ scriptId: "sects-and-violets", rootSeed: "different-seed", playerCount: 12, constraints: {} });
    const second = roleIds(generate({ scriptId: "sects-and-violets", rootSeed: "seed-stable", playerCount: 12, constraints: {} }));

    expect(second).toStrictEqual(first);
  });

  it("does not use Math.random", () => {
    const spy = vi.spyOn(Math, "random").mockImplementation(() => {
      throw new Error("Math.random must not be used");
    });

    expect(() => generate()).not.toThrow();
    spy.mockRestore();
  });

  it("keeps the golden seed role set stable", () => {
    const setup = expectSuccess(generate({ scriptId: "sects-and-violets", rootSeed: "golden-seed", playerCount: 12, constraints: {} }));

    expect({
      actualRoles: setup.actualRoles.map((role) => role.roleId),
      demonRole: setup.demonRole.roleId,
      demonBluffs: setup.demonBluffs.map((role) => role.roleId)
    }).toStrictEqual({
      actualRoles: [
        "dreamer",
        "flowergirl",
        "juggler",
        "oracle",
        "philosopher",
        "sage",
        "savant",
        "town_crier",
        "mutant",
        "evil_twin",
        "witch",
        "vigormortis"
      ],
      demonRole: "vigormortis",
      demonBluffs: ["mathematician", "snake_charmer", "sweetheart"]
    });
  });

  it("records algorithm versions with the golden output", () => {
    const setup = expectSuccess(generate({ scriptId: "sects-and-violets", rootSeed: "golden-seed", playerCount: 12, constraints: {} }));

    expect(setup.setupAlgorithmVersion).toBe(SETUP_ALGORITHM_VERSION);
    expect(setup.randomAlgorithmVersion).toBe(RANDOM_ALGORITHM_VERSION);
    expect(setup.randomStream).toBe(SETUP_RANDOM_STREAM);
    expect(setup.roleCatalogVersion).toBe(ROLE_CATALOG_VERSION);
    expect(setup.roleCatalogSignature).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
    expect(setup.roleCatalogSnapshot.canonicalSignature).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
    expect(setup.roleCatalogSignatureAlgorithm).toBe(ROLE_CATALOG_SIGNATURE_ALGORITHM);
    expect(SETUP_ALGORITHM_VERSION).toBe("snv-12-setup-v1");
    expect(RANDOM_ALGORITHM_VERSION).toBe("xmur3-sfc32-rejection-v1");
    expect(SETUP_RANDOM_STREAM).toBe("setup/sects-and-violets/12/v1");
    expect(ROLE_CATALOG_VERSION).toBe("snv-role-catalog-v1");
    expect(ROLE_CATALOG_SIGNATURE_ALGORITHM).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM);
  });

  it("emits a replayable complete role catalog snapshot", () => {
    const setup = expectSuccess(generate());
    const expectedRoles = SECTS_AND_VIOLETS_SCRIPT.roles.map(snapshotRole).sort(compareRoleSetupSnapshot);

    expect(setup.roleCatalogSnapshot).toStrictEqual({
      scriptId: "sects-and-violets",
      edition: "sects-and-violets",
      roleCatalogVersion: ROLE_CATALOG_VERSION,
      roles: expectedRoles,
      canonicalSignature: SUPPORTED_ROLE_CATALOG_SIGNATURE
    });
    expect(calculateRoleCatalogSignature(setup.roleCatalogSnapshot)).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
  });

  it("keeps the catalog signature stable across source order changes and platforms", () => {
    const setup = expectSuccess(generateWithScript(reversedScript(), {
      scriptId: "sects-and-violets",
      rootSeed: "seed-catalog-signature",
      playerCount: 12,
      constraints: {}
    }));

    expect(setup.roleCatalogSignature).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
    expect(setup.roleCatalogSnapshot.canonicalSignature).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
  });

  it("always includes locked roles", () => {
    expect(roleIds(generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-locked",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("clockmaker"), id("witch")] }
    }))).toEqual(expect.arrayContaining(["clockmaker", "witch"]));
  });

  it("excludes roles from actual setup and demon bluffs", () => {
    const setup = expectSuccess(generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-excluded",
      playerCount: 12,
      constraints: { excludedRoleIds: [id("artist"), id("savant")] }
    }));

    expect(setup.actualRoles.map((role) => role.roleId)).not.toEqual(expect.arrayContaining(["artist", "savant"]));
    expect(setup.demonBluffs.map((role) => role.roleId)).not.toEqual(expect.arrayContaining(["artist", "savant"]));
  });

  it("fails when locked and excluded constraints overlap", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-conflict",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("clockmaker")], excludedRoleIds: [id("clockmaker")] }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "LockedAndExcludedConflict" });
  });

  it("fails when a constraint list contains duplicate roles", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-duplicate",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("clockmaker"), id("clockmaker")] }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "DuplicateConstraintRole" });
  });

  it("fails when two demons are locked", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-two-demons",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("fang_gu"), id("vortox")] }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "MultipleLockedDemons" });
  });

  it("fails when locked roles exceed post-modifier type capacity", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-too-many-outsiders",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("no_dashii"), id("mutant"), id("sweetheart"), id("barber")] }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "TooManyLockedRolesForType" });
  });

  it("succeeds with two locked outsiders by excluding infeasible demon plans", () => {
    const setup = expectSuccess(generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-two-outsiders",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("mutant"), id("sweetheart")] }
    }));

    expect(setup.actualRoles.map((role) => role.roleId)).toEqual(expect.arrayContaining(["mutant", "sweetheart"]));
    expect(setup.demonRole.roleId).not.toBe("vigormortis");
  });

  it("selects Fang Gu when three outsiders are locked", () => {
    const setup = expectSuccess(generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-three-outsiders",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("barber"), id("mutant"), id("sweetheart")] }
    }));

    expect(setup.demonRole.roleId).toBe("fang_gu");
  });

  it("selects Vigormortis when eight townsfolk are locked", () => {
    const setup = expectSuccess(generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-eight-townsfolk",
      playerCount: 12,
      constraints: {
        lockedRoleIds: [
          id("clockmaker"),
          id("dreamer"),
          id("snake_charmer"),
          id("mathematician"),
          id("flowergirl"),
          id("town_crier"),
          id("oracle"),
          id("savant")
        ]
      }
    }));

    expect(setup.demonRole.roleId).toBe("vigormortis");
  });

  it("selects Vigormortis when only one outsider candidate remains", () => {
    const setup = expectSuccess(generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-one-outsider",
      playerCount: 12,
      constraints: { excludedRoleIds: [id("barber"), id("mutant"), id("sweetheart")] }
    }));

    expect(setup.demonRole.roleId).toBe("vigormortis");
  });

  it("only fails after every demon plan is infeasible", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-all-demons-infeasible",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("barber"), id("klutz"), id("mutant"), id("sweetheart")] }
    });

    expect(result).toMatchObject({
      status: "failure",
      failureCode: "TooManyLockedRolesForType"
    });
  });

  it("keeps feasible demon planning stable when the script array insertion order changes", () => {
    const input = {
      scriptId: "sects-and-violets",
      rootSeed: "seed-plan-order",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("mutant"), id("sweetheart")] }
    } as const;

    expect(generateWithScript(reversedScript(), input)).toStrictEqual(generateWithScript(SECTS_AND_VIOLETS_SCRIPT, input));
  });

  it("does not let infeasible demon plans consume the final role-selection stream", () => {
    const input = {
      scriptId: "sects-and-violets",
      rootSeed: "seed-infeasible-stream",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("mutant"), id("sweetheart")] }
    } as const;

    const setup = expectSuccess(generateWithScript(reversedScript(), input));

    expect(setup.demonRole.roleId).not.toBe("vigormortis");
    expect(setup).toStrictEqual(expectSuccess(generateWithScript(SECTS_AND_VIOLETS_SCRIPT, input)));
  });

  it("uses legal exactRoleIds as the actual setup set", () => {
    const exactRoleIds = [
      "clockmaker",
      "dreamer",
      "snake_charmer",
      "mathematician",
      "flowergirl",
      "town_crier",
      "mutant",
      "sweetheart",
      "barber",
      "evil_twin",
      "witch",
      "fang_gu"
    ].map(id);

    expect(roleIds(generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-exact",
      playerCount: 12,
      constraints: { exactRoleIds }
    })).sort(compareStableId)).toStrictEqual(exactRoleIds.map(String).sort(compareStableId));
  });

  it("fails when exactRoleIds does not contain 12 roles", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-exact-wrong-size",
      playerCount: 12,
      constraints: { exactRoleIds: [id("clockmaker")] }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "ExactSetupWrongSize" });
  });

  it("fails when exactRoleIds is combined with other constraints", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-exact-conflict",
      playerCount: 12,
      constraints: { exactRoleIds: [id("clockmaker")], lockedRoleIds: [id("dreamer")] }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "ExactSetupCannotUseOtherConstraints" });
  });

  it("fails when exactRoleIds do not match setup-modified counts", () => {
    const exactRoleIds = [
      "clockmaker",
      "dreamer",
      "snake_charmer",
      "mathematician",
      "flowergirl",
      "town_crier",
      "oracle",
      "mutant",
      "sweetheart",
      "evil_twin",
      "witch",
      "fang_gu"
    ].map(id);
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-exact-invalid",
      playerCount: 12,
      constraints: { exactRoleIds }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "NoLegalSetup" });
  });

  it("fails when candidates are insufficient", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-insufficient",
      playerCount: 12,
      constraints: {
        lockedRoleIds: [id("no_dashii")],
        excludedRoleIds: [
          id("clockmaker"),
          id("dreamer"),
          id("snake_charmer"),
          id("mathematician"),
          id("flowergirl"),
          id("town_crier"),
          id("oracle")
        ]
      }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "InsufficientCandidates" });
  });

  it("fails on unknown roles", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-unknown",
      playerCount: 12,
      constraints: { lockedRoleIds: [id("unknown_role")] }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "UnknownRole" });
  });

  it("fails when demon bluff candidates are insufficient", () => {
    const result = generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-no-bluffs",
      playerCount: 12,
      constraints: {
        lockedRoleIds: [
          id("no_dashii"),
          id("clockmaker"),
          id("dreamer"),
          id("snake_charmer"),
          id("mathematician"),
          id("flowergirl"),
          id("town_crier"),
          id("oracle"),
          id("mutant"),
          id("sweetheart"),
          id("evil_twin"),
          id("witch")
        ],
        excludedRoleIds: [
          id("savant"),
          id("seamstress"),
          id("philosopher"),
          id("artist"),
          id("juggler"),
          id("sage"),
          id("barber"),
          id("klutz")
        ]
      }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "InsufficientDemonBluffs" });
  });

  it("defensively copies the script catalog at construction time", () => {
    const mutableRoles = SECTS_AND_VIOLETS_SCRIPT.roles.map(cloneRole);
    const script = makeScript(mutableRoles);
    const seededGenerator = new SeededSectsAndVioletsSetupGenerator(script);
    mutableRoles.splice(0, mutableRoles.length);

    const result = seededGenerator.generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-defensive-copy",
      playerCount: 12,
      constraints: {}
    });

    expect(result.status).toBe("success");
  });

  it("returns catalog snapshots that cannot mutate the generator's internal catalog", () => {
    const seededGenerator = new SeededSectsAndVioletsSetupGenerator(SECTS_AND_VIOLETS_SCRIPT);
    const first = expectSuccess(seededGenerator.generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-snapshot-copy",
      playerCount: 12,
      constraints: {}
    }));
    const mutableRoles = first.roleCatalogSnapshot.roles as RoleSetupSnapshot[];
    mutableRoles.splice(0, mutableRoles.length);

    const second = expectSuccess(seededGenerator.generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-snapshot-copy",
      playerCount: 12,
      constraints: {}
    }));

    expect(first.roleCatalogSnapshot.roles).toHaveLength(0);
    expect(second.roleCatalogSnapshot.roles).toHaveLength(25);
    expect(second.roleCatalogSignature).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
  });

  it("does not let post-generation external catalog mutations change generated catalog evidence", () => {
    const mutableRoles = SECTS_AND_VIOLETS_SCRIPT.roles.map(cloneRole);
    const script = makeScript(mutableRoles);
    const seededGenerator = new SeededSectsAndVioletsSetupGenerator(script);
    const first = expectSuccess(seededGenerator.generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-external-mutation",
      playerCount: 12,
      constraints: {}
    }));

    const firstMutableRole = mutableRoles[0];
    if (firstMutableRole === undefined) {
      throw new Error("Expected role");
    }
    mutableRoles[0] = {
      ...firstMutableRole,
      roleId: roleId("mutated_after_generation")
    };
    mutableRoles.splice(1, mutableRoles.length - 1);

    const second = expectSuccess(seededGenerator.generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-external-mutation",
      playerCount: 12,
      constraints: {}
    }));

    expect(first.roleCatalogSnapshot.roles).toHaveLength(25);
    expect(first.roleCatalogSignature).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
    expect(second.roleCatalogSnapshot.roles).toHaveLength(25);
    expect(second.roleCatalogSignature).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
  });

  it("rejects a script with corrupted type counts", () => {
    expect(() => new SeededSectsAndVioletsSetupGenerator(withRole(id("clockmaker"), { characterType: "OUTSIDER" }))).toThrow(
      "13/4/4/4"
    );
  });

  it("rejects a script where type and default alignment disagree", () => {
    expect(() => new SeededSectsAndVioletsSetupGenerator(withRole(id("clockmaker"), { defaultAlignment: "EVIL" }))).toThrow(
      "invalid role setup metadata"
    );
  });

  it("rejects a script where a non-demon has a setup modifier", () => {
    expect(() =>
      new SeededSectsAndVioletsSetupGenerator(withRole(id("clockmaker"), {
        setupModifier: {
          outsiderDelta: 1,
          townsfolkDelta: -1
        }
      }))
    ).toThrow("invalid role setup metadata");
  });

  it("rejects a script where a demon modifier changes the total role count", () => {
    expect(() =>
      new SeededSectsAndVioletsSetupGenerator(withRole(id("fang_gu"), {
        setupModifier: {
          outsiderDelta: 1,
          townsfolkDelta: 0
        }
      }))
    ).toThrow("invalid role setup metadata");
  });

  it("generates exactly 3 demon bluffs", () => {
    expect(expectSuccess(generate()).demonBluffs).toHaveLength(3);
  });

  it("generates unique demon bluffs", () => {
    const bluffRoleIds = expectSuccess(generate()).demonBluffs.map((role) => role.roleId);

    expect(new Set(bluffRoleIds).size).toBe(3);
  });

  it("uses only good roles as demon bluffs", () => {
    expect(expectSuccess(generate()).demonBluffs.every((role) => role.defaultAlignment === "GOOD")).toBe(true);
  });

  it("keeps demon bluffs outside actual setup", () => {
    const setup = expectSuccess(generate());
    const actualRoleIds = new Set(setup.actualRoles.map((role) => role.roleId));

    expect(setup.demonBluffs.every((role) => !actualRoleIds.has(role.roleId))).toBe(true);
  });

  it("keeps demon bluffs inside the selected script", () => {
    const scriptRoleIds = new Set(SECTS_AND_VIOLETS_SCRIPT.roles.map((role) => role.roleId));

    expect(expectSuccess(generate()).demonBluffs.every((role) => scriptRoleIds.has(role.roleId))).toBe(true);
  });

  it("does not use excluded roles as demon bluffs", () => {
    const setup = expectSuccess(generate({
      scriptId: "sects-and-violets",
      rootSeed: "seed-bluffs",
      playerCount: 12,
      constraints: { excludedRoleIds: [id("artist"), id("savant"), id("oracle")] }
    }));

    expect(setup.demonBluffs.map((role) => role.roleId)).not.toEqual(expect.arrayContaining(["artist", "savant", "oracle"]));
  });
});
