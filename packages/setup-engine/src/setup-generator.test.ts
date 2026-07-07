import { describe, expect, it, vi } from "vitest";
import { roleId } from "@botc/domain-core";
import type { RoleCountSet, RoleId, SetupGenerationResult } from "@botc/domain-core";
import { SECTS_AND_VIOLETS_SCRIPT } from "@botc/rules-snv";
import {
  RANDOM_ALGORITHM_VERSION,
  SETUP_ALGORITHM_VERSION,
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

describe("SeededSectsAndVioletsSetupGenerator", () => {
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
    const actualRoleIds = roleIds(generate({ scriptId: "sects-and-violets", rootSeed: "golden-seed", playerCount: 12, constraints: {} }));

    expect(actualRoleIds).toStrictEqual([
      "flowergirl",
      "juggler",
      "oracle",
      "philosopher",
      "savant",
      "seamstress",
      "town_crier",
      "barber",
      "mutant",
      "cerenovus",
      "evil_twin",
      "no_dashii"
    ]);
  });

  it("records algorithm versions with the golden output", () => {
    const setup = expectSuccess(generate({ scriptId: "sects-and-violets", rootSeed: "golden-seed", playerCount: 12, constraints: {} }));

    expect(setup.setupAlgorithmVersion).toBe(SETUP_ALGORITHM_VERSION);
    expect(setup.randomAlgorithmVersion).toBe(RANDOM_ALGORITHM_VERSION);
    expect(SETUP_ALGORITHM_VERSION).toBe("snv-12-setup-v1");
    expect(RANDOM_ALGORITHM_VERSION).toBe("xmur3-sfc32-rejection-v1");
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
    })).sort()).toStrictEqual(exactRoleIds.map(String).sort());
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
