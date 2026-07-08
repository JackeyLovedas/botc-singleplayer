import { describe, expect, it } from "vitest";
import { InitialPrivateKnowledgeBuilder } from "@botc/information-engine";
import type { CharacterAssignmentSet, InitialKnowledgeEntry, PlayerId } from "@botc/domain-core";
import { playerId, roleId } from "@botc/domain-core";
import {
  charactersAssignedEvent,
  playerRosterCreatedEvent,
  setupGeneratedEvent
} from "@botc/test-harness";

const buildInput = () => ({
  roster: playerRosterCreatedEvent().payload.entries,
  assignment: charactersAssignedEvent().payload.assignments,
  setup: setupGeneratedEvent().payload
});

const buildKnowledge = () => {
  const result = new InitialPrivateKnowledgeBuilder().generate(buildInput());
  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return result.knowledge;
};

const entriesFor = (entries: readonly InitialKnowledgeEntry[], recipientPlayerId: PlayerId): readonly InitialKnowledgeEntry[] =>
  entries.filter((entry) => entry.recipientPlayerId === recipientPlayerId);

describe("InitialPrivateKnowledgeBuilder", () => {
  it("generates deterministic initial private knowledge with canonical ordering", () => {
    const first = buildKnowledge();
    const second = buildKnowledge();

    expect(first).toStrictEqual(second);
    expect(first.knowledgeModelVersion).toBe("initial-private-knowledge-v1");
    expect(first.entries.filter((entry) => entry.kind === "OWN_CHARACTER")).toHaveLength(12);
    expect(first.entries.filter((entry) => entry.kind === "DEMON_IDENTITY")).toHaveLength(2);
    expect(first.entries.filter((entry) => entry.kind === "MINION_IDENTITIES")).toHaveLength(3);
    expect(first.entries.filter((entry) => entry.kind === "DEMON_BLUFFS")).toHaveLength(1);
  });

  it("gives every player exactly one own character matching assignment", () => {
    const input = buildInput();
    const knowledge = buildKnowledge();

    for (const assignment of input.assignment) {
      const own = entriesFor(knowledge.entries, assignment.playerId).find((entry) => entry.kind === "OWN_CHARACTER");

      expect(own).toBeDefined();
      expect(own).toMatchObject({
        kind: "OWN_CHARACTER",
        role: assignment.role
      });
    }
  });

  it("gives the demon all minions and exactly setup demon bluffs", () => {
    const input = buildInput();
    const knowledge = buildKnowledge();
    const demon = input.assignment.find((assignment) => assignment.role.characterType === "DEMON");
    if (demon === undefined) {
      throw new Error("Expected demon assignment");
    }

    const demonEntries = entriesFor(knowledge.entries, demon.playerId);
    const minions = demonEntries.find((entry) => entry.kind === "MINION_IDENTITIES");
    const bluffs = demonEntries.find((entry) => entry.kind === "DEMON_BLUFFS");

    expect(minions?.kind).toBe("MINION_IDENTITIES");
    expect(minions?.minions).toHaveLength(2);
    expect(bluffs?.kind).toBe("DEMON_BLUFFS");
    expect(bluffs?.roles).toStrictEqual(input.setup.demonBluffs);
  });

  it("gives each minion the demon and only the other minion without role fields", () => {
    const input = buildInput();
    const knowledge = buildKnowledge();
    const demon = input.assignment.find((assignment) => assignment.role.characterType === "DEMON");
    const minions = input.assignment.filter((assignment) => assignment.role.characterType === "MINION");
    if (demon === undefined || minions.length !== 2) {
      throw new Error("Expected demon and two minions");
    }

    for (const minion of minions) {
      const minionEntries = entriesFor(knowledge.entries, minion.playerId);
      const demonIdentity = minionEntries.find((entry) => entry.kind === "DEMON_IDENTITY");
      const visibleMinions = minionEntries.find((entry) => entry.kind === "MINION_IDENTITIES");

      expect(demonIdentity?.kind).toBe("DEMON_IDENTITY");
      expect(demonIdentity?.demon).toStrictEqual({ playerId: demon.playerId, seatNumber: demon.seatNumber });
      expect(Object.keys(demonIdentity?.demon ?? {}).sort()).toStrictEqual(["playerId", "seatNumber"]);
      expect(visibleMinions?.kind).toBe("MINION_IDENTITIES");
      expect(visibleMinions?.minions).toHaveLength(1);
      expect(visibleMinions?.minions[0]?.playerId).not.toBe(minion.playerId);
      expect(Object.keys(visibleMinions?.minions[0] ?? {}).sort()).toStrictEqual(["playerId", "seatNumber"]);
    }
  });

  it("gives good players only their own character", () => {
    const input = buildInput();
    const knowledge = buildKnowledge();
    const goodAssignments = input.assignment.filter((assignment) => assignment.role.defaultAlignment === "GOOD");

    for (const assignment of goodAssignments) {
      expect(entriesFor(knowledge.entries, assignment.playerId).map((entry) => entry.kind)).toStrictEqual(["OWN_CHARACTER"]);
    }
  });

  it("defensively copies output so mutation cannot affect future generation", () => {
    const first = buildKnowledge();
    const mutableOwn = first.entries.find((entry) => entry.kind === "OWN_CHARACTER");
    if (mutableOwn === undefined || mutableOwn.kind !== "OWN_CHARACTER") {
      throw new Error("Expected own-character entry");
    }
    (mutableOwn.role as { roleId: string }).roleId = "mutated-role";

    const second = buildKnowledge();

    expect(second.entries.find((entry) => entry.kind === "OWN_CHARACTER")).not.toMatchObject({
      role: { roleId: "mutated-role" }
    });
  });

  it("returns InvalidRoster for malformed rosters", () => {
    const input = buildInput();
    const result = new InitialPrivateKnowledgeBuilder().generate({
      ...input,
      roster: input.roster.slice(1)
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "InvalidRoster" });
  });

  it("returns InvalidAssignment for assignments that do not match roster", () => {
    const input = buildInput();
    const first = input.assignment[0];
    if (first === undefined) {
      throw new Error("Expected assignment");
    }
    const result = new InitialPrivateKnowledgeBuilder().generate({
      ...input,
      assignment: [{ ...first, playerId: playerId("unknown-player") }, ...input.assignment.slice(1)] as CharacterAssignmentSet
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "InvalidAssignment" });
  });

  it("returns MissingDemon and InvalidMinionCount for malformed setup role composition", () => {
    const input = buildInput();
    const noDemon = new InitialPrivateKnowledgeBuilder().generate({
      ...input,
      setup: {
        ...input.setup,
        actualRoles: input.setup.actualRoles.map((role) =>
          role.characterType === "DEMON"
            ? { ...role, characterType: "TOWNSFOLK", defaultAlignment: "GOOD" }
            : role
        )
      }
    });
    const oneMinion = new InitialPrivateKnowledgeBuilder().generate({
      ...input,
      setup: {
        ...input.setup,
        actualRoles: input.setup.actualRoles.map((role, index) =>
          role.characterType === "MINION" && input.setup.actualRoles.findIndex((candidate) => candidate.characterType === "MINION") === index
            ? { ...role, characterType: "TOWNSFOLK", defaultAlignment: "GOOD" }
            : role
        )
      }
    });

    expect(noDemon).toMatchObject({ status: "failure", failureCode: "MissingDemon" });
    expect(oneMinion).toMatchObject({ status: "failure", failureCode: "InvalidMinionCount" });
  });

  it("returns InvalidDemonBluffs for malformed bluff payloads", () => {
    const input = buildInput();
    const result = new InitialPrivateKnowledgeBuilder().generate({
      ...input,
      setup: {
        ...input.setup,
        demonBluffs: input.setup.demonBluffs.slice(1)
      }
    });

    expect(result).toMatchObject({ status: "failure", failureCode: "InvalidDemonBluffs" });
  });

  it("rejects demon bluff roles that are not present in the current role catalog", () => {
    const input = buildInput();
    const lastBluff = input.setup.demonBluffs.at(-1);
    if (lastBluff === undefined) {
      throw new Error("Expected demon bluff");
    }

    const result = new InitialPrivateKnowledgeBuilder().generate({
      ...input,
      setup: {
        ...input.setup,
        demonBluffs: [
          ...input.setup.demonBluffs.slice(0, -1),
          {
            ...lastBluff,
            roleId: roleId("zzz_forged_good_bluff")
          }
        ]
      }
    });

    expect(result).toMatchObject({ status: "failure" });
  });

  it("rejects demon bluff snapshots that differ from the catalog role with the same roleId", () => {
    const input = buildInput();
    const lastBluff = input.setup.demonBluffs.at(-1);
    if (lastBluff === undefined) {
      throw new Error("Expected demon bluff");
    }

    const result = new InitialPrivateKnowledgeBuilder().generate({
      ...input,
      setup: {
        ...input.setup,
        demonBluffs: [
          ...input.setup.demonBluffs.slice(0, -1),
          {
            ...lastBluff,
            characterType: lastBluff.characterType === "TOWNSFOLK" ? "OUTSIDER" : "TOWNSFOLK",
            defaultAlignment: "GOOD",
            setupModifier: {
              outsiderDelta: 0,
              townsfolkDelta: 0
            }
          }
        ]
      }
    });

    expect(result).toMatchObject({ status: "failure" });
  });

  it("rejects role catalog signatures that do not match the supported catalog", () => {
    const input = buildInput();
    const result = new InitialPrivateKnowledgeBuilder().generate({
      ...input,
      setup: {
        ...input.setup,
        roleCatalogSignature: "canonical-role-catalog-v1:deadbeef"
      }
    });

    expect(result).toMatchObject({ status: "failure" });
  });

  it("does not mutate the input object while producing legal initial private knowledge", () => {
    const input = buildInput();
    const before = JSON.stringify(input);
    const result = new InitialPrivateKnowledgeBuilder().generate(input);

    expect(result).toMatchObject({ status: "success" });
    expect(JSON.stringify(input)).toBe(before);
  });
});
