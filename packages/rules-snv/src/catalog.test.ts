import { describe, expect, it } from "vitest";
import {
  SUPPORTED_ROLE_CATALOG_SIGNATURE,
  SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM,
  SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE,
  calculateRoleCatalogSignature,
  calculateFirstNightTaskCatalogSignature,
  compareStableId,
  roleId
} from "@botc/domain-core";
import type { FirstNightTaskDefinition, RoleDefinition, ScriptDefinition } from "@botc/domain-core";
import {
  SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_CATALOG,
  SECTS_AND_VIOLETS_ROLES,
  assertValidSectsAndVioletsCatalog
} from "@botc/rules-snv";

const cloneRole = (role: RoleDefinition): RoleDefinition => ({
  ...role,
  setupModifier: { ...role.setupModifier }
});

const firstCatalogRole = (): RoleDefinition => {
  const role = SECTS_AND_VIOLETS_ROLES[0];
  if (role === undefined) {
    throw new Error("Missing first catalog role");
  }

  return role;
};

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

  it("matches the supported canonical role catalog signature", () => {
    expect(calculateRoleCatalogSignature(scriptWithRoles(SECTS_AND_VIOLETS_ROLES))).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
    expect(SUPPORTED_ROLE_CATALOG_SIGNATURE).toMatch(new RegExp(`^${SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM}:[0-9a-f]{8}$`));
  });

  it("changes the signature when a role type changes", () => {
    const changed = scriptWithRole("clockmaker", { characterType: "OUTSIDER" });

    expect(calculateRoleCatalogSignature(changed)).not.toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
  });

  it("changes the signature when a setup modifier changes", () => {
    const changed = scriptWithRole("fang_gu", {
      setupModifier: {
        outsiderDelta: -1,
        townsfolkDelta: 1
      }
    });

    expect(calculateRoleCatalogSignature(changed)).not.toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
  });

  it("changes the signature when roles are added or removed", () => {
    expect(calculateRoleCatalogSignature(scriptWithRoles(SECTS_AND_VIOLETS_ROLES.slice(1)))).not.toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
    expect(calculateRoleCatalogSignature(scriptWithRoles([
      ...SECTS_AND_VIOLETS_ROLES,
      {
        ...cloneRole(firstCatalogRole()),
        roleId: roleId("extra_role")
      }
    ]))).not.toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
  });

  it("keeps the signature stable when the source catalog order changes", () => {
    expect(calculateRoleCatalogSignature(scriptWithRoles([...SECTS_AND_VIOLETS_ROLES].reverse()))).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
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

describe("Sects & Violets first-night task catalog", () => {
  const definitions = SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_CATALOG.definitions;

  it("contains exactly 11 canonical first-night task definitions", () => {
    expect(definitions.map((definition) => definition.taskType)).toStrictEqual([
      "PHILOSOPHER_ACTION",
      "MINION_INFO",
      "DEMON_INFO",
      "SNAKE_CHARMER_ACTION",
      "EVIL_TWIN_SETUP",
      "WITCH_ACTION",
      "CERENOVUS_ACTION",
      "CLOCKMAKER_INFORMATION",
      "DREAMER_ACTION",
      "SEAMSTRESS_ACTION",
      "MATHEMATICIAN_INFORMATION"
    ]);
  });

  it("uses unique taskType and baseOrder values", () => {
    expect(new Set(definitions.map((definition) => definition.taskType)).size).toBe(11);
    expect(new Set(definitions.map((definition) => definition.baseOrder)).size).toBe(11);
  });

  it("uses the fixed official catalog signature", () => {
    expect(SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_CATALOG.taskCatalogSignature).toBe(SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE);
    expect(calculateFirstNightTaskCatalogSignature(SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_CATALOG)).toBe(
      "canonical-first-night-task-catalog-v1:20514c1a"
    );
  });

  it("changes the task catalog signature when order, class, or settlement policy changes", () => {
    const swappedOrder = definitions.map((definition) => {
      if (definition.taskType === "MINION_INFO") {
        return { ...definition, baseOrder: 300 };
      }

      if (definition.taskType === "DEMON_INFO") {
        return { ...definition, baseOrder: 200 };
      }

      return definition;
    });
    const changedClass = definitions.map((definition) =>
      definition.taskType === "WITCH_ACTION" ? { ...definition, taskClass: "ROLE_INFORMATION" as const } : definition
    );
    const changedPolicy = definitions.map((definition) =>
      definition.taskType === "DEMON_INFO"
        ? { ...definition, settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT" as const }
        : definition
    ) as readonly FirstNightTaskDefinition[];

    expect(calculateFirstNightTaskCatalogSignature({
      taskCatalogVersion: SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_CATALOG.taskCatalogVersion,
      definitions: swappedOrder
    })).not.toBe(SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE);
    expect(calculateFirstNightTaskCatalogSignature({
      taskCatalogVersion: SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_CATALOG.taskCatalogVersion,
      definitions: changedClass
    })).not.toBe(SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE);
    expect(calculateFirstNightTaskCatalogSignature({
      taskCatalogVersion: SECTS_AND_VIOLETS_FIRST_NIGHT_TASK_CATALOG.taskCatalogVersion,
      definitions: changedPolicy
    })).not.toBe(SUPPORTED_FIRST_NIGHT_TASK_CATALOG_SIGNATURE);
  });

  it("does not create first-night base tasks for Pit-Hag or demons", () => {
    const roleTaskRoleIds = definitions
      .filter((definition): definition is Extract<FirstNightTaskDefinition, { readonly sourceKind: "ROLE" }> => definition.sourceKind === "ROLE")
      .map((definition) => definition.roleId)
      .sort(compareStableId);

    expect(roleTaskRoleIds).not.toContain("pit_hag");
    expect(roleTaskRoleIds).not.toContain("fang_gu");
    expect(roleTaskRoleIds).not.toContain("vigormortis");
    expect(roleTaskRoleIds).not.toContain("no_dashii");
    expect(roleTaskRoleIds).not.toContain("vortox");
  });
});
