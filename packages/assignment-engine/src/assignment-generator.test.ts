import { describe, expect, it, vi } from "vitest";
import {
  SUPPORTED_ASSIGNMENT_ALGORITHM_VERSION,
  SUPPORTED_ASSIGNMENT_RANDOM_STREAM,
  SUPPORTED_RANDOM_ALGORITHM_VERSION,
  SUPPORTED_ROLE_CATALOG_SIGNATURE,
  compareStableId,
  createFixedPlayerRoster,
  playerId,
  roleId
} from "@botc/domain-core";
import { SECTS_AND_VIOLETS_SCRIPT } from "@botc/rules-snv";
import { SeededSectsAndVioletsSetupGenerator } from "@botc/setup-engine";
import {
  ASSIGNMENT_ALGORITHM_VERSION,
  ASSIGNMENT_RANDOM_STREAM,
  RANDOM_ALGORITHM_VERSION,
  SeededCharacterAssignmentGenerator
} from "@botc/assignment-engine";

const setupGenerator = new SeededSectsAndVioletsSetupGenerator(SECTS_AND_VIOLETS_SCRIPT);
const assignmentGenerator = () => new SeededCharacterAssignmentGenerator();

const goldenSetup = () => {
  const result = setupGenerator.generate({
    scriptId: "sects-and-violets",
    rootSeed: "golden-seed",
    playerCount: 12,
    constraints: {}
  });

  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return result.setup;
};

const roster = (displayName = "Human Player") => createFixedPlayerRoster({
  humanPlayerId: playerId("human-1"),
  humanDisplayName: displayName,
  humanSeatNumber: 5
});

const generate = (displayName = "Human Player") => assignmentGenerator().generate({
  rootSeed: "golden-seed",
  roster: roster(displayName),
  actualRoles: goldenSetup().actualRoles,
  roleCatalogSignature: goldenSetup().roleCatalogSignature
});

const expectSuccess = (result: ReturnType<SeededCharacterAssignmentGenerator["generate"]>) => {
  expect(result.status).toBe("success");
  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return result.assignment;
};

describe("SeededCharacterAssignmentGenerator", () => {
  it("records assignment algorithm versions", () => {
    const assignment = expectSuccess(generate());

    expect(assignment.assignmentAlgorithmVersion).toBe(SUPPORTED_ASSIGNMENT_ALGORITHM_VERSION);
    expect(assignment.randomAlgorithmVersion).toBe(SUPPORTED_RANDOM_ALGORITHM_VERSION);
    expect(assignment.randomStream).toBe(SUPPORTED_ASSIGNMENT_RANDOM_STREAM);
    expect(assignment.roleCatalogSignature).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
    expect(ASSIGNMENT_ALGORITHM_VERSION).toBe("snv-12-assignment-v1");
    expect(ASSIGNMENT_RANDOM_STREAM).toBe("assignment/sects-and-violets/12/v1");
    expect(RANDOM_ALGORITHM_VERSION).toBe("xmur3-sfc32-rejection-v1");
  });

  it("returns deeply equal assignments for the same seed, roster, and setup", () => {
    expect(generate()).toStrictEqual(generate());
  });

  it("does not let unrelated calls affect assignment output", () => {
    const first = generate();
    assignmentGenerator().generate({
      rootSeed: "other-seed",
      roster: roster(),
      actualRoles: goldenSetup().actualRoles,
      roleCatalogSignature: goldenSetup().roleCatalogSignature
    });

    expect(generate()).toStrictEqual(first);
  });

  it("does not let displayName affect role assignment", () => {
    expect(expectSuccess(generate("Human Player")).assignments).toStrictEqual(expectSuccess(generate("Renamed Human")).assignments);
  });

  it("does not use ambient random or time", () => {
    const randomSpy = vi.spyOn(Math, "random").mockImplementation(() => {
      throw new Error("Math.random must not be used");
    });
    const nowSpy = vi.spyOn(Date, "now").mockImplementation(() => {
      throw new Error("Date.now must not be used");
    });

    expect(() => generate()).not.toThrow();
    randomSpy.mockRestore();
    nowSpy.mockRestore();
  });

  it("keeps the golden seed seat-to-role mapping stable", () => {
    const assignment = expectSuccess(generate());

    expect(assignment.assignments.map((entry) => [entry.seatNumber, entry.role.roleId])).toStrictEqual([
      [1, "savant"],
      [2, "evil_twin"],
      [3, "sage"],
      [4, "town_crier"],
      [5, "philosopher"],
      [6, "juggler"],
      [7, "vigormortis"],
      [8, "witch"],
      [9, "flowergirl"],
      [10, "oracle"],
      [11, "mutant"],
      [12, "dreamer"]
    ]);
  });

  it("assigns each player, seat, and actual role exactly once without using demon bluffs", () => {
    const setup = goldenSetup();
    const assignment = expectSuccess(generate());
    const assignedRoleIds = assignment.assignments.map((entry) => entry.role.roleId);

    expect(assignment.assignments).toHaveLength(12);
    expect(new Set(assignment.assignments.map((entry) => entry.playerId)).size).toBe(12);
    expect(new Set(assignment.assignments.map((entry) => entry.seatNumber)).size).toBe(12);
    expect(new Set(assignedRoleIds).size).toBe(12);
    expect([...assignedRoleIds].sort(compareStableId)).toStrictEqual(setup.actualRoles.map((role) => role.roleId).sort(compareStableId));
    expect(assignedRoleIds).not.toEqual(expect.arrayContaining(setup.demonBluffs.map((role) => role.roleId)));
  });

  it("keeps assignments sorted by seat and treats the human as a normal shuffled seat", () => {
    const assignment = expectSuccess(generate());

    expect(assignment.assignments.map((entry) => entry.seatNumber)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(assignment.assignments[4]).toMatchObject({
      playerId: "human-1",
      seatNumber: 5,
      role: {
        roleId: "philosopher"
      }
    });
  });

  it("fails on invalid rosters, invalid actual role counts, and duplicate roles", () => {
    expect(assignmentGenerator().generate({
      rootSeed: "golden-seed",
      roster: roster().slice(1),
      actualRoles: goldenSetup().actualRoles,
      roleCatalogSignature: SUPPORTED_ROLE_CATALOG_SIGNATURE
    })).toMatchObject({ status: "failure", failureCode: "InvalidRoster" });

    expect(assignmentGenerator().generate({
      rootSeed: "golden-seed",
      roster: roster(),
      actualRoles: goldenSetup().actualRoles.slice(1),
      roleCatalogSignature: SUPPORTED_ROLE_CATALOG_SIGNATURE
    })).toMatchObject({ status: "failure", failureCode: "InvalidActualRoles" });

    const duplicateRoles = [...goldenSetup().actualRoles];
    const firstRole = duplicateRoles[0];
    if (firstRole === undefined) {
      throw new Error("Expected first role");
    }
    duplicateRoles[1] = firstRole;
    expect(assignmentGenerator().generate({
      rootSeed: "golden-seed",
      roster: roster(),
      actualRoles: duplicateRoles,
      roleCatalogSignature: SUPPORTED_ROLE_CATALOG_SIGNATURE
    })).toMatchObject({ status: "failure", failureCode: "InvalidActualRoles" });
  });

  it("fails on an empty role catalog signature", () => {
    expect(assignmentGenerator().generate({
      rootSeed: "golden-seed",
      roster: roster(),
      actualRoles: goldenSetup().actualRoles,
      roleCatalogSignature: " "
    })).toMatchObject({ status: "failure", failureCode: "InvalidRoleCatalogSignature" });
  });

  it("does not invent roles outside actualRoles", () => {
    const setup = goldenSetup();
    const fakeActualRoles = setup.actualRoles.map((role, index) =>
      index === 0
        ? {
            ...role,
            roleId: roleId("fake_role")
          }
        : role
    );

    const assignment = expectSuccess(assignmentGenerator().generate({
      rootSeed: "golden-seed",
      roster: roster(),
      actualRoles: fakeActualRoles,
      roleCatalogSignature: setup.roleCatalogSignature
    }));

    expect(assignment.assignments.map((entry) => entry.role.roleId)).toEqual(expect.arrayContaining(["fake_role"]));
    expect(assignment.assignments.map((entry) => entry.role.roleId)).not.toEqual(expect.arrayContaining([setup.demonBluffs[0]?.roleId]));
  });
});
