import {
  SUPPORTED_SCRIPT_EDITION,
  SUPPORTED_SCRIPT_ID,
  SUPPORTED_SCRIPT_NAME,
  roleId
} from "@botc/domain-core";
import type { CharacterType, DefaultAlignment, RoleDefinition, ScriptDefinition, SetupModifier } from "@botc/domain-core";

const zeroModifier: SetupModifier = {
  outsiderDelta: 0,
  townsfolkDelta: 0
};

const role = (
  id: string,
  nameZh: string,
  nameEn: string,
  characterType: CharacterType,
  verificationStatus: RoleDefinition["verificationStatus"],
  setupModifier: SetupModifier = zeroModifier
): RoleDefinition => {
  const defaultAlignment: DefaultAlignment = characterType === "MINION" || characterType === "DEMON" ? "EVIL" : "GOOD";

  return {
    roleId: roleId(id),
    nameZh,
    nameEn,
    edition: SUPPORTED_SCRIPT_EDITION,
    characterType,
    defaultAlignment,
    setupModifier,
    sourceDocument:
      characterType === "DEMON"
        ? "project-handoff/rules/19-sects-and-violets-demons.md"
        : "project-handoff/rules/18-sects-and-violets-roles.md",
    verificationStatus
  };
};

export const SECTS_AND_VIOLETS_ROLES: readonly RoleDefinition[] = [
  role("clockmaker", "钟表匠", "Clockmaker", "TOWNSFOLK", "PARTIAL"),
  role("dreamer", "筑梦师", "Dreamer", "TOWNSFOLK", "PARTIAL"),
  role("snake_charmer", "舞蛇人", "Snake Charmer", "TOWNSFOLK", "PARTIAL"),
  role("mathematician", "数学家", "Mathematician", "TOWNSFOLK", "VERIFIED_CORE"),
  role("flowergirl", "卖花女孩", "Flowergirl", "TOWNSFOLK", "PARTIAL"),
  role("town_crier", "城镇公告员", "Town Crier", "TOWNSFOLK", "PARTIAL"),
  role("oracle", "神谕者", "Oracle", "TOWNSFOLK", "PARTIAL"),
  role("savant", "博学者", "Savant", "TOWNSFOLK", "PARTIAL"),
  role("seamstress", "女裁缝", "Seamstress", "TOWNSFOLK", "PARTIAL"),
  role("philosopher", "哲学家", "Philosopher", "TOWNSFOLK", "VERIFIED_CORE"),
  role("artist", "艺术家", "Artist", "TOWNSFOLK", "PARTIAL"),
  role("juggler", "杂耍艺人", "Juggler", "TOWNSFOLK", "PARTIAL"),
  role("sage", "贤者", "Sage", "TOWNSFOLK", "PARTIAL"),
  role("mutant", "畸形秀演员", "Mutant", "OUTSIDER", "PARTIAL"),
  role("sweetheart", "心上人", "Sweetheart", "OUTSIDER", "PARTIAL"),
  role("barber", "理发师", "Barber", "OUTSIDER", "VERIFIED_CORE"),
  role("klutz", "呆瓜", "Klutz", "OUTSIDER", "PARTIAL"),
  role("evil_twin", "镜像双子", "Evil Twin", "MINION", "VERIFIED_CORE"),
  role("witch", "女巫", "Witch", "MINION", "VERIFIED_CORE"),
  role("cerenovus", "洗脑师", "Cerenovus", "MINION", "VERIFIED_CORE"),
  role("pit_hag", "麻脸巫婆", "Pit-Hag", "MINION", "VERIFIED_CORE"),
  role("fang_gu", "方古", "Fang Gu", "DEMON", "VERIFIED_CORE", {
    outsiderDelta: 1,
    townsfolkDelta: -1
  }),
  role("vigormortis", "亡骨魔", "Vigormortis", "DEMON", "VERIFIED_CORE", {
    outsiderDelta: -1,
    townsfolkDelta: 1
  }),
  role("no_dashii", "诺-达鲺", "No Dashii", "DEMON", "VERIFIED_CORE"),
  role("vortox", "涡流", "Vortox", "DEMON", "VERIFIED_CORE")
];

export const SECTS_AND_VIOLETS_SCRIPT: ScriptDefinition = {
  scriptId: SUPPORTED_SCRIPT_ID,
  scriptName: SUPPORTED_SCRIPT_NAME,
  edition: SUPPORTED_SCRIPT_EDITION,
  roles: SECTS_AND_VIOLETS_ROLES
};

const expectedAlignment = (characterType: CharacterType): DefaultAlignment =>
  characterType === "MINION" || characterType === "DEMON" ? "EVIL" : "GOOD";

export const assertValidSectsAndVioletsCatalog = (script: ScriptDefinition = SECTS_AND_VIOLETS_SCRIPT): void => {
  const roles = [...script.roles];
  const roleIds = new Set(roles.map((candidate) => candidate.roleId));
  const nonZeroModifiers = roles.filter(
    (candidate) => candidate.setupModifier.outsiderDelta !== 0 || candidate.setupModifier.townsfolkDelta !== 0
  );

  if (
    script.scriptId !== SUPPORTED_SCRIPT_ID ||
    script.scriptName !== SUPPORTED_SCRIPT_NAME ||
    script.edition !== SUPPORTED_SCRIPT_EDITION
  ) {
    throw new Error("Sects & Violets script metadata is invalid");
  }

  if (roles.length !== 25 || roleIds.size !== 25) {
    throw new Error("Sects & Violets catalog must contain exactly 25 unique roles");
  }

  const counts = {
    TOWNSFOLK: roles.filter((candidate) => candidate.characterType === "TOWNSFOLK").length,
    OUTSIDER: roles.filter((candidate) => candidate.characterType === "OUTSIDER").length,
    MINION: roles.filter((candidate) => candidate.characterType === "MINION").length,
    DEMON: roles.filter((candidate) => candidate.characterType === "DEMON").length
  };

  if (counts.TOWNSFOLK !== 13 || counts.OUTSIDER !== 4 || counts.MINION !== 4 || counts.DEMON !== 4) {
    throw new Error("Sects & Violets catalog type counts are invalid");
  }

  if (
    roles.some(
      (candidate) =>
        candidate.nameZh.trim().length === 0 ||
        candidate.nameEn.trim().length === 0 ||
        candidate.edition !== SUPPORTED_SCRIPT_EDITION ||
        candidate.defaultAlignment !== expectedAlignment(candidate.characterType)
    )
  ) {
    throw new Error("Sects & Violets catalog role metadata is invalid");
  }

  const nonZeroModifierIds = nonZeroModifiers.map((candidate) => candidate.roleId).sort();
  if (nonZeroModifierIds.join(",") !== "fang_gu,vigormortis") {
    throw new Error("Only Fang Gu and Vigormortis may define setup modifiers in Sects & Violets");
  }
};

assertValidSectsAndVioletsCatalog();
