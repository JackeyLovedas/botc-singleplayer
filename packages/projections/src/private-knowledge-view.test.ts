import { describe, expect, it } from "vitest";
import { DomainError, playerId, rebuildGameState } from "@botc/domain-core";
import type { GameState } from "@botc/domain-core";
import { buildAiPrivateKnowledgeView, buildPlayerPrivateKnowledgeView } from "@botc/projections";
import {
  charactersAssignedEvent,
  charactersAssignedPhaseTransitionedEvent,
  firstNightInitializedEvent,
  gameCreatedEvent,
  initialPrivateKnowledgeEstablishedEvent,
  phaseTransitionedEvent,
  playerRosterCreatedEvent,
  scriptSelectedEvent,
  setupGeneratedEvent,
  setupPhaseTransitionedEvent,
} from "@botc/test-harness";

const stateWithPrivateKnowledge = (): GameState => rebuildGameState([
  gameCreatedEvent(),
  scriptSelectedEvent(),
  phaseTransitionedEvent(),
  setupGeneratedEvent(),
  setupPhaseTransitionedEvent(),
  playerRosterCreatedEvent(),
  charactersAssignedEvent(),
  charactersAssignedPhaseTransitionedEvent(),
  firstNightInitializedEvent(),
  initialPrivateKnowledgeEstablishedEvent()
]);

const viewKeys = [
  "demonBluffs",
  "knowledgeModelVersion",
  "knownDemon",
  "knownMinions",
  "ownCharacter",
  "viewerDisplayName",
  "viewerPlayerId",
  "viewerSeatNumber"
];

describe("private knowledge projections", () => {
  it("gives good players only their own character and no evil-team private facts", () => {
    const state = stateWithPrivateKnowledge();
    const good = state.assignment?.assignments.find((assignment) => assignment.role.defaultAlignment === "GOOD");
    if (good === undefined) {
      throw new Error("Expected good assignment");
    }

    const view = buildPlayerPrivateKnowledgeView(state, good.playerId);

    expect(Object.keys(view).sort()).toStrictEqual(viewKeys.filter((key) => key !== "knownDemon").sort());
    expect(view.ownCharacter).toStrictEqual(good.role);
    expect(view.knownMinions).toStrictEqual([]);
    expect(view.demonBluffs).toStrictEqual([]);
    expect("knownDemon" in view).toBe(false);
    expect(JSON.stringify(view)).not.toContain("assignments");
  });

  it("gives minions their own role, the demon reference, and only the other minion reference", () => {
    const state = stateWithPrivateKnowledge();
    const demon = state.assignment?.assignments.find((assignment) => assignment.role.characterType === "DEMON");
    const minions = state.assignment?.assignments.filter((assignment) => assignment.role.characterType === "MINION") ?? [];
    const minion = minions[0];
    if (demon === undefined || minion === undefined) {
      throw new Error("Expected demon and minion assignments");
    }

    const view = buildPlayerPrivateKnowledgeView(state, minion.playerId);

    expect(view.ownCharacter).toStrictEqual(minion.role);
    expect(view.knownDemon).toStrictEqual({ playerId: demon.playerId, seatNumber: demon.seatNumber });
    expect(Object.keys(view.knownDemon ?? {}).sort()).toStrictEqual(["playerId", "seatNumber"]);
    expect(view.knownMinions).toHaveLength(1);
    expect(view.knownMinions[0]?.playerId).not.toBe(minion.playerId);
    expect(Object.keys(view.knownMinions[0] ?? {}).sort()).toStrictEqual(["playerId", "seatNumber"]);
    expect(view.demonBluffs).toStrictEqual([]);
    expect(JSON.stringify(view)).not.toContain(minions.find((candidate) => candidate.playerId !== minion.playerId)?.role.roleId);
  });

  it("gives the demon minion references and demon bluffs without minion roles", () => {
    const state = stateWithPrivateKnowledge();
    const demon = state.assignment?.assignments.find((assignment) => assignment.role.characterType === "DEMON");
    const minions = state.assignment?.assignments.filter((assignment) => assignment.role.characterType === "MINION") ?? [];
    if (demon === undefined) {
      throw new Error("Expected demon assignment");
    }

    const view = buildPlayerPrivateKnowledgeView(state, demon.playerId);

    expect(view.ownCharacter).toStrictEqual(demon.role);
    expect(view.knownMinions).toHaveLength(2);
    expect(view.demonBluffs).toStrictEqual(state.setup?.demonBluffs);
    expect("knownDemon" in view).toBe(false);
    for (const minion of minions) {
      expect(JSON.stringify(view.knownMinions)).toContain(minion.playerId);
      expect(JSON.stringify(view)).not.toContain(minion.role.roleId);
    }
  });

  it("builds the AI private knowledge view with the same leakage boundary as the player view", () => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.assignment?.assignments.find((assignment) => assignment.role.characterType === "DEMON");
    if (viewer === undefined) {
      throw new Error("Expected viewer");
    }

    expect(buildAiPrivateKnowledgeView(state, viewer.playerId)).toStrictEqual(buildPlayerPrivateKnowledgeView(state, viewer.playerId));
  });

  it("fails explicitly for an unknown viewer", () => {
    const state = stateWithPrivateKnowledge();

    expect(() => buildPlayerPrivateKnowledgeView(state, playerId("missing-player")))
      .toThrow(DomainError);
  });

  it("does not expose complete assignments, role catalog, truth labels, or storyteller internals", () => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.roster?.entries[0];
    if (viewer === undefined) {
      throw new Error("Expected viewer");
    }

    const serialized = JSON.stringify(buildPlayerPrivateKnowledgeView(state, viewer.playerId));

    expect(serialized).not.toContain("actualRoles");
    expect(serialized).not.toContain("roleCatalogSnapshot");
    expect(serialized).not.toContain("candidateSet");
    expect(serialized).not.toContain("semanticTruth");
    expect(serialized).not.toContain("reliability");
    expect(serialized).not.toContain("truthConstraint");
    expect(serialized).not.toContain("registrationDecision");
    expect(serialized).not.toContain("storyteller");
  });

  it("defensively copies projection results", () => {
    const state = stateWithPrivateKnowledge();
    const demon = state.assignment?.assignments.find((assignment) => assignment.role.characterType === "DEMON");
    if (demon === undefined) {
      throw new Error("Expected demon assignment");
    }

    const first = buildPlayerPrivateKnowledgeView(state, demon.playerId);
    (first.ownCharacter as { roleId: string }).roleId = "mutated-role";
    const bluff = first.demonBluffs[0];
    if (bluff !== undefined) {
      (bluff as { roleId: string }).roleId = "mutated-bluff";
    }
    const minionReference = first.knownMinions[0];
    if (minionReference !== undefined) {
      (minionReference as { playerId: string }).playerId = "mutated-player";
    }

    const second = buildPlayerPrivateKnowledgeView(state, demon.playerId);

    expect(second.ownCharacter.roleId).not.toBe("mutated-role");
    expect(second.demonBluffs[0]?.roleId).not.toBe("mutated-bluff");
    expect(second.knownMinions[0]?.playerId).not.toBe("mutated-player");
  });
});
