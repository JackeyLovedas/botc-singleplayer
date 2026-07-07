import { describe, expect, it } from "vitest";
import { compareStableId, roleId } from "@botc/domain-core";
import type { RoleDefinition, ScriptDefinition } from "@botc/domain-core";
import { SECTS_AND_VIOLETS_ROLES, assertValidSectsAndVioletsCatalog } from "@botc/rules-snv";

const cloneRole = (role: RoleDefinition): RoleDefinition => ({
  ...role,
  setupModifier: { ...role.setupModifier }
});

const scriptWithRoles = (roles: readonly RoleDefinition[]): ScriptDefinition => ({
  scriptId: "sects-and-violets",
  scriptName: "Sects & Violets",
  edition: "sects-and-violets",
  roles
});

const scriptWithRole = (roleIdValue: string, patch: Partial<RoleDefinition>): ScriptDefinition =>
  scriptWithRoles(SECTS_AND_VIOLETS_ROLES.map((role) => (role.roleId === roleIdValue ? { ...cloneRole(role), ...patch } : cloneRole(role))));

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
      .sort(compareStableId);

    expect(modified).toStrictEqual(["fang_gu", "vigormortis"]);
    expect(() => assertValidSectsAndVioletsCatalog()).not.toThrow();
  });

  it("rejects Fang Gu when its setup modifier is reversed", () => {
    expect(() =>
      assertValidSectsAndVioletsCatalog(scriptWithRole("fang_gu", {
        setupModifier: {
          outsiderDelta: -1,
          townsfolkDelta: 1
        }
      }))
    ).toThrow("role metadata");
  });

  it("rejects Vigormortis when its setup modifier is wrong", () => {
    expect(() =>
      assertValidSectsAndVioletsCatalog(scriptWithRole("vigormortis", {
        setupModifier: {
          outsiderDelta: 0,
          townsfolkDelta: 0
        }
      }))
    ).toThrow("role metadata");
  });

  it("rejects swapped character types even when aggregate counts are maintained", () => {
    const roles = SECTS_AND_VIOLETS_ROLES.map((role) => {
      if (role.roleId === "clockmaker") {
        return { ...cloneRole(role), characterType: "OUTSIDER" as const };
      }

      if (role.roleId === "mutant") {
        return { ...cloneRole(role), characterType: "TOWNSFOLK" as const };
      }

      return cloneRole(role);
    });

    expect(() => assertValidSectsAndVioletsCatalog(scriptWithRoles(roles))).toThrow("role metadata");
  });

  it("rejects an unknown roleId replacing an expected role", () => {
    expect(() =>
      assertValidSectsAndVioletsCatalog(scriptWithRole("clockmaker", {
        roleId: roleId("unknown_role")
      }))
    ).toThrow("exact expected role ids");
  });

  it("rejects a setup modifier on a non-demon role", () => {
    expect(() =>
      assertValidSectsAndVioletsCatalog(scriptWithRole("clockmaker", {
        setupModifier: {
          outsiderDelta: 1,
          townsfolkDelta: -1
        }
      }))
    ).toThrow("role metadata");
  });

  it("rejects a type and default alignment mismatch", () => {
    expect(() =>
      assertValidSectsAndVioletsCatalog(scriptWithRole("clockmaker", {
        defaultAlignment: "EVIL"
      }))
    ).toThrow("role metadata");
  });
});
