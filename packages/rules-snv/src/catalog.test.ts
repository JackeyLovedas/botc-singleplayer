import { describe, expect, it } from "vitest";
import { SECTS_AND_VIOLETS_ROLES, assertValidSectsAndVioletsCatalog } from "@botc/rules-snv";

describe("Sects & Violets role catalog", () => {
  it("contains exactly 25 roles", () => {
    expect(SECTS_AND_VIOLETS_ROLES).toHaveLength(25);
  });

  it("contains 13 townsfolk", () => {
    expect(SECTS_AND_VIOLETS_ROLES.filter((role) => role.characterType === "TOWNSFOLK")).toHaveLength(13);
  });

  it("contains 4 outsiders", () => {
    expect(SECTS_AND_VIOLETS_ROLES.filter((role) => role.characterType === "OUTSIDER")).toHaveLength(4);
  });

  it("contains 4 minions", () => {
    expect(SECTS_AND_VIOLETS_ROLES.filter((role) => role.characterType === "MINION")).toHaveLength(4);
  });

  it("contains 4 demons", () => {
    expect(SECTS_AND_VIOLETS_ROLES.filter((role) => role.characterType === "DEMON")).toHaveLength(4);
  });

  it("has unique roleIds", () => {
    const roleIds = new Set(SECTS_AND_VIOLETS_ROLES.map((role) => role.roleId));

    expect(roleIds.size).toBe(SECTS_AND_VIOLETS_ROLES.length);
  });

  it("matches character types to default alignments", () => {
    for (const role of SECTS_AND_VIOLETS_ROLES) {
      expect(role.defaultAlignment).toBe(role.characterType === "MINION" || role.characterType === "DEMON" ? "EVIL" : "GOOD");
    }
  });

  it("only gives setup modifiers to Fang Gu and Vigormortis", () => {
    const modified = SECTS_AND_VIOLETS_ROLES
      .filter((role) => role.setupModifier.outsiderDelta !== 0 || role.setupModifier.townsfolkDelta !== 0)
      .map((role) => role.roleId)
      .sort();

    expect(modified).toStrictEqual(["fang_gu", "vigormortis"]);
    expect(() => assertValidSectsAndVioletsCatalog()).not.toThrow();
  });
});
