import { describe, expect, it } from "vitest";
import { DomainError, playerId, rebuildGameState } from "@botc/domain-core";
import type { GameState } from "@botc/domain-core";
import { buildAiPrivateKnowledgeView, buildPlayerPrivateKnowledgeView } from "@botc/projections";
import {
  charactersAssignedEvent,
  charactersAssignedPhaseTransitionedEvent,
  firstNightInitializedEvent,
  firstNightTaskPlanCreatedEvent,
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

const stateWithTaskPlan = (): GameState => rebuildGameState([
  gameCreatedEvent(),
  scriptSelectedEvent(),
  phaseTransitionedEvent(),
  setupGeneratedEvent(),
  setupPhaseTransitionedEvent(),
  playerRosterCreatedEvent(),
  charactersAssignedEvent(),
  charactersAssignedPhaseTransitionedEvent(),
  firstNightInitializedEvent(),
  initialPrivateKnowledgeEstablishedEvent(),
  firstNightTaskPlanCreatedEvent()
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

const expectPrivateKnowledgeUnavailable = (action: () => void): void => {
  let caught: unknown;
  try {
    action();
  } catch (error) {
    caught = error;
  }

  expect(caught).toBeInstanceOf(DomainError);
  expect((caught as DomainError).code).toBe("PrivateKnowledgeUnavailable");
};

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

  it("gives minions only their own role before MINION_INFO is delivered", () => {
    const state = stateWithPrivateKnowledge();
    const minions = state.assignment?.assignments.filter((assignment) => assignment.role.characterType === "MINION") ?? [];
    const minion = minions[0];
    if (minion === undefined) {
      throw new Error("Expected minion assignment");
    }

    const view = buildPlayerPrivateKnowledgeView(state, minion.playerId);

    expect(view.ownCharacter).toStrictEqual(minion.role);
    expect("knownDemon" in view).toBe(false);
    expect(view.knownMinions).toStrictEqual([]);
    expect(view.demonBluffs).toStrictEqual([]);
    for (const otherMinion of minions.filter((candidate) => candidate.playerId !== minion.playerId)) {
      expect(JSON.stringify(view)).not.toContain(otherMinion.playerId);
      expect(JSON.stringify(view)).not.toContain(otherMinion.role.roleId);
    }
  });

  it("gives the demon only their own role before DEMON_INFO is delivered", () => {
    const state = stateWithPrivateKnowledge();
    const demon = state.assignment?.assignments.find((assignment) => assignment.role.characterType === "DEMON");
    const minions = state.assignment?.assignments.filter((assignment) => assignment.role.characterType === "MINION") ?? [];
    if (demon === undefined) {
      throw new Error("Expected demon assignment");
    }

    const view = buildPlayerPrivateKnowledgeView(state, demon.playerId);

    expect(view.ownCharacter).toStrictEqual(demon.role);
    expect("knownDemon" in view).toBe(false);
    expect(view.knownMinions).toStrictEqual([]);
    expect(view.demonBluffs).toStrictEqual([]);
    for (const minion of minions) {
      expect(JSON.stringify(view)).not.toContain(minion.playerId);
      expect(JSON.stringify(view)).not.toContain(minion.role.roleId);
    }
    for (const bluff of state.setup?.demonBluffs ?? []) {
      expect(JSON.stringify(view)).not.toContain(bluff.roleId);
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

  it("does not expose first-night task plans through player or AI private knowledge views", () => {
    const state = stateWithTaskPlan();
    const viewer = state.roster?.entries[0];
    if (viewer === undefined) {
      throw new Error("Expected viewer");
    }

    const playerView = buildPlayerPrivateKnowledgeView(state, viewer.playerId);
    const aiView = buildAiPrivateKnowledgeView(state, viewer.playerId);
    const playerSerialized = JSON.stringify(playerView);
    const aiSerialized = JSON.stringify(aiView);

    expect(Object.keys(playerView).sort()).toStrictEqual(viewKeys.filter((key) => key !== "knownDemon").sort());
    expect(Object.keys(aiView).sort()).toStrictEqual(Object.keys(playerView).sort());
    for (const serialized of [playerSerialized, aiSerialized]) {
      expect(serialized).not.toContain("taskPlan");
      expect(serialized).not.toContain("tasks");
      expect(serialized).not.toContain("taskType");
      expect(serialized).not.toContain("sourcePlayerId");
      expect(serialized).not.toContain("pendingRoleTasks");
      expect(serialized).not.toContain("PHILOSOPHER_ACTION");
      expect(serialized).not.toContain("MINION_INFO");
      expect(serialized).not.toContain("DEMON_INFO");
    }
  });

  it("fails before projection when canonical private knowledge contains an unknown entry kind", () => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.roster?.entries[0];
    if (viewer === undefined || state.initialPrivateKnowledge === undefined) {
      throw new Error("Expected viewer and private knowledge");
    }

    const tamperedState = {
      ...state,
      initialPrivateKnowledge: {
        ...state.initialPrivateKnowledge,
        entries: [
          ...state.initialPrivateKnowledge.entries,
          {
            kind: "FULL_SECRET_DUMP",
            recipientPlayerId: viewer.playerId,
            fullAssignments: state.assignment?.assignments
          }
        ]
      }
    } as unknown as GameState;

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(tamperedState, viewer.playerId));
    expectPrivateKnowledgeUnavailable(() => buildAiPrivateKnowledgeView(tamperedState, viewer.playerId));
  });

  it("fails before projection when canonical private knowledge carries extra secret fields", () => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.roster?.entries[0];
    if (viewer === undefined || state.initialPrivateKnowledge === undefined) {
      throw new Error("Expected viewer and private knowledge");
    }

    const tamperedState = {
      ...state,
      initialPrivateKnowledge: {
        ...state.initialPrivateKnowledge,
        entries: state.initialPrivateKnowledge.entries.map((entry) =>
          entry.kind === "OWN_CHARACTER" && entry.recipientPlayerId === viewer.playerId
            ? { ...entry, allAssignments: state.assignment?.assignments }
            : entry
        )
      }
    } as unknown as GameState;

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(tamperedState, viewer.playerId));
    expectPrivateKnowledgeUnavailable(() => buildAiPrivateKnowledgeView(tamperedState, viewer.playerId));
  });

  it.each([
    [
      "extra field",
      (state: GameState) => ({
        ...state.firstNight,
        storytellerNotes: "hidden"
      })
    ],
    [
      "unsupported initializationVersion",
      (state: GameState) => ({
        ...state.firstNight,
        initializationVersion: "unsupported-first-night"
      })
    ],
    [
      "rosterVersion mismatch",
      (state: GameState) => ({
        ...state.firstNight,
        rosterVersion: "wrong-roster-version"
      })
    ],
    [
      "assignmentAlgorithmVersion mismatch",
      (state: GameState) => ({
        ...state.firstNight,
        assignmentAlgorithmVersion: "wrong-assignment-version"
      })
    ],
    [
      "roleCatalogSignature mismatch",
      (state: GameState) => ({
        ...state.firstNight,
        roleCatalogSignature: "canonical-role-catalog-v1:deadbeef"
      })
    ]
  ])("fails before projection when FirstNightInitialized payload has %s", (_name, mutateFirstNight) => {
    const state = stateWithPrivateKnowledge();
    const viewer = state.roster?.entries[0];
    if (viewer === undefined) {
      throw new Error("Expected viewer");
    }

    const tamperedState = {
      ...state,
      firstNight: mutateFirstNight(state)
    } as unknown as GameState;

    expectPrivateKnowledgeUnavailable(() => buildPlayerPrivateKnowledgeView(tamperedState, viewer.playerId));
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
