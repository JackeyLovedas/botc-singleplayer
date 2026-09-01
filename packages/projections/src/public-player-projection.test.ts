import { describe, expect, it } from "vitest";
import type { GameState } from "@botc/domain-core";
import {
  buildGeneralPlayerProjection,
  buildGeneralPlayerProjectionFromAcceptedEventStream,
  buildPublicGameProjection,
  buildPublicGameProjectionFromAcceptedEventStream
} from "@botc/projections";
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
  setupPhaseTransitionedEvent
} from "@botc/test-harness";
import { rebuildGameState } from "@botc/domain-core";

const acceptedEvents = () => [
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
];

const baseState = (): GameState => rebuildGameState(acceptedEvents());

describe("Slice 4 public and general player projections", () => {
  it("projects only safe public state and derives the same bytes from accepted replay", () => {
    const state = baseState();
    const direct = buildPublicGameProjection(state);
    const replayed = buildPublicGameProjectionFromAcceptedEventStream(acceptedEvents());

    expect(replayed).toStrictEqual(direct);
    expect(direct).toMatchObject({
      projectionVersion: "public-game-projection-v1",
      gameId: state.gameId,
      phase: state.phase,
      dayNumber: state.dayNumber,
      nightNumber: state.nightNumber
    });
    expect(direct.roster).toHaveLength(12);
    expect(direct.roster[0]?.seatNumber).toBe(1);
    expect(typeof direct.roster[0]?.playerId).toBe("string");
    expect(typeof direct.roster[0]?.displayName).toBe("string");
    expect(direct.roster[0]?.lifeStatus).toBe("ALIVE");
    expect(JSON.stringify(direct)).not.toMatch(/role|alignment|truth|impair|cause|task|opportunity|receipt|eventId/i);
  });

  it("composes public state with viewer-bound private knowledge without exposing other state", () => {
    const state = baseState();
    const viewer = state.roster!.entries[0]!;
    const projection = buildGeneralPlayerProjection(state, viewer.playerId);
    const replayed = buildGeneralPlayerProjectionFromAcceptedEventStream(acceptedEvents(), viewer.playerId);

    expect(replayed).toStrictEqual(projection);
    expect(projection.viewerPlayerId).toBe(viewer.playerId);
    expect(projection.public).toStrictEqual(buildPublicGameProjection(state));
    expect(projection.privateKnowledge.viewerPlayerId).toBe(viewer.playerId);
    expect(projection.privateKnowledge.ownCharacter).toBeDefined();
    const serialized = JSON.stringify(projection);
    expect(serialized).not.toContain("roleCatalogSnapshot");
    expect(serialized).not.toContain("actualRoles");
    expect(serialized).not.toContain("semanticTruth");
    expect(serialized).not.toContain("truthConstraint");
    expect(serialized).not.toContain("currentCharacterState");
  });

  it("keeps distinct viewer private facts isolated and parity-stable", () => {
    const state = baseState();
    const [firstViewer, secondViewer] = state.roster!.entries;
    if (!firstViewer || !secondViewer) throw new Error("Expected two viewer fixtures");
    const first = buildGeneralPlayerProjection(state, firstViewer.playerId);
    const second = buildGeneralPlayerProjection(state, secondViewer.playerId);
    const firstReplay = buildGeneralPlayerProjectionFromAcceptedEventStream(acceptedEvents(), firstViewer.playerId);
    const secondReplay = buildGeneralPlayerProjectionFromAcceptedEventStream(acceptedEvents(), secondViewer.playerId);

    expect(first.public).toStrictEqual(second.public);
    expect(first.privateKnowledge.viewerPlayerId).toBe(firstViewer.playerId);
    expect(second.privateKnowledge.viewerPlayerId).toBe(secondViewer.playerId);
    expect(first.privateKnowledge.ownCharacter).not.toStrictEqual(second.privateKnowledge.ownCharacter);
    expect(first.privateKnowledge).not.toStrictEqual(expect.objectContaining({ viewerPlayerId: secondViewer.playerId }));
    expect(second.privateKnowledge).not.toStrictEqual(expect.objectContaining({ viewerPlayerId: firstViewer.playerId }));
    expect(firstReplay).toStrictEqual(first);
    expect(secondReplay).toStrictEqual(second);
  });

  it("projects public nomination, vote counts, execution and independent life status", () => {
    const state = baseState();
    const [nominator, nominee, voter] = state.roster!.entries;
    if (nominator === undefined || nominee === undefined || voter === undefined) throw new Error("Expected roster fixture");
    const populated: GameState = {
      ...state,
      phase: "NOMINATION_WINDOW",
      dayNumber: 1,
      nominations: [{ rulesBaselineVersion: state.rulesBaselineVersion, nominationId: "nomination-v1:1:1", nominatorPlayerId: nominator.playerId, nomineePlayerId: nominee.playerId, dayNumber: 1, nominationOrdinal: 1 }],
      votes: [{ rulesBaselineVersion: state.rulesBaselineVersion, voteId: "vote-v1:nomination-v1:1:1:1", nominationId: "nomination-v1:1:1", voterPlayerId: voter.playerId, voterSeatNumber: voter.seatNumber, choice: "YES", ghostVoteConsumed: false }],
      executions: [{ rulesBaselineVersion: state.rulesBaselineVersion, executionId: "execution-v1:1:01", blockId: "block-v1:1:1", targetPlayerId: nominee.playerId, dayNumber: 1 }],
      deadPlayerIds: [nominee.playerId]
    };
    const projection = buildPublicGameProjection(populated);

    expect(projection.nominations[0]).toEqual(expect.objectContaining({ nominatorPlayerId: nominator.playerId, nomineePlayerId: nominee.playerId, nominationOrdinal: 1 }));
    expect(projection.nominations[0]?.votes).toStrictEqual([{ voterPlayerId: voter.playerId, choice: "YES" }]);
    expect(projection.nominations[0]?.votes[0]).not.toHaveProperty("ghostVoteConsumed");
    expect(projection.nominations[0]?.voteCounts).toStrictEqual({ yesCount: 1, noCount: 0 });
    expect(projection.executions[0]).toMatchObject({ status: "EXECUTED", targetPlayerId: nominee.playerId, targetLifeStatus: "DEAD" });
    expect(projection.roster.find((entry) => entry.playerId === nominee.playerId)?.lifeStatus).toBe("DEAD");
  });

  it("associates votes and counts with each public nomination ordinal", () => {
    const state = baseState();
    const [firstNominator, firstNominee, firstVoter, secondNominator, secondNominee, secondVoter] = state.roster!.entries;
    if (!firstNominator || !firstNominee || !firstVoter || !secondNominator || !secondNominee || !secondVoter) throw new Error("Expected roster fixture");
    const populated: GameState = {
      ...state,
      nominations: [
        { rulesBaselineVersion: state.rulesBaselineVersion, nominationId: "n-1", nominatorPlayerId: firstNominator.playerId, nomineePlayerId: firstNominee.playerId, dayNumber: 1, nominationOrdinal: 1 },
        { rulesBaselineVersion: state.rulesBaselineVersion, nominationId: "n-2", nominatorPlayerId: secondNominator.playerId, nomineePlayerId: secondNominee.playerId, dayNumber: 1, nominationOrdinal: 2 }
      ],
      votes: [
        { rulesBaselineVersion: state.rulesBaselineVersion, voteId: "v-1", nominationId: "n-1", voterPlayerId: firstVoter.playerId, voterSeatNumber: firstVoter.seatNumber, choice: "YES", ghostVoteConsumed: false },
        { rulesBaselineVersion: state.rulesBaselineVersion, voteId: "v-2", nominationId: "n-2", voterPlayerId: secondVoter.playerId, voterSeatNumber: secondVoter.seatNumber, choice: "NO", ghostVoteConsumed: false }
      ]
    };
    const projection = buildPublicGameProjection(populated);
    expect(projection.nominations).toHaveLength(2);
    expect(projection.nominations.map(({ nominationOrdinal, votes, voteCounts }) => ({ nominationOrdinal, votes, voteCounts }))).toStrictEqual([
      { nominationOrdinal: 1, votes: [{ voterPlayerId: firstVoter.playerId, choice: "YES" }], voteCounts: { yesCount: 1, noCount: 0 } },
      { nominationOrdinal: 2, votes: [{ voterPlayerId: secondVoter.playerId, choice: "NO" }], voteCounts: { yesCount: 0, noCount: 1 } }
    ]);
  });

  it("builds public state without private knowledge", () => {
    const state = baseState();
    const { initialPrivateKnowledge: _privateKnowledge, ...publicState } = state;
    void _privateKnowledge;
    const publicOnly: GameState = publicState;
    expect(buildPublicGameProjection(publicOnly).roster).toHaveLength(12);
  });

  it("orders executions by day and keeps execution independent from death", () => {
    const state = baseState();
    const [firstTarget, secondTarget] = state.roster!.entries;
    if (!firstTarget || !secondTarget) throw new Error("Expected roster fixture");
    const projection = buildPublicGameProjection({
      ...state,
      executions: [
        { rulesBaselineVersion: state.rulesBaselineVersion, executionId: "e-2", blockId: "b-2", targetPlayerId: secondTarget.playerId, dayNumber: 2 },
        { rulesBaselineVersion: state.rulesBaselineVersion, executionId: "e-1", blockId: "b-1", targetPlayerId: firstTarget.playerId, dayNumber: 1 }
      ],
      deadPlayerIds: [firstTarget.playerId]
    });
    expect(projection.executions.map(({ dayNumber }) => dayNumber)).toStrictEqual([1, 2]);
    expect(projection.executions[0]?.status).toBe("EXECUTED");
    expect(projection.executions[0]?.targetLifeStatus).toBe("DEAD");
    expect(projection.executions[1]?.targetLifeStatus).toBe("ALIVE");
  });

  it("rejects a vote whose nomination relation is absent", () => {
    const state = baseState();
    const voter = state.roster!.entries[0]!;
    expect(() => buildPublicGameProjection({
      ...state,
      votes: [{ rulesBaselineVersion: state.rulesBaselineVersion, voteId: "v-missing", nominationId: "missing", voterPlayerId: voter.playerId, voterSeatNumber: voter.seatNumber, choice: "YES", ghostVoteConsumed: false }]
    })).toThrow(/nomination-linked votes/);
  });

  it("rejects malformed accepted history before projection", () => {
    expect(() => buildPublicGameProjectionFromAcceptedEventStream([])).toThrow();
  });

  it("rejects a mutated accepted prefix before projection", () => {
    const hostile = acceptedEvents();
    const mutated = hostile[1];
    if (!mutated) throw new Error("Expected accepted prefix event");
    (mutated as { eventSequence: number }).eventSequence = 99;
    expect(() => buildPublicGameProjectionFromAcceptedEventStream(hostile)).toThrow();
  });

  it("returns fresh nested projection containers", () => {
    const state = baseState();
    const first = buildPublicGameProjection(state);
    const second = buildPublicGameProjection(state);
    expect(first).not.toBe(second);
    expect(first.roster).not.toBe(second.roster);
    expect(first.nominations).not.toBe(second.nominations);
  });

  it("fails closed for an unknown viewer", () => {
    const state = baseState();
    expect(() => buildGeneralPlayerProjection(state, "missing-player" as never)).toThrow(/viewerPlayerId does not exist/);
  });

  it("keeps public and player projections free of receipts, causes, assignments and provenance", () => {
    const state = baseState();
    const viewer = state.roster!.entries[0]!;
    const projection = buildGeneralPlayerProjection(state, viewer.playerId);
    const forbiddenKeys = new Set([
      "assignment", "assignments", "actualRoleId", "roleCatalogSnapshot", "currentAlignment", "semanticTruth",
      "truthStatus", "truthConstraint", "informationReliability", "sourceImpairmentId", "causeEventId",
      "taskId", "taskType", "opportunityId", "abilityInstanceId", "entitlementId", "roleTenureId",
      "commandFingerprint", "receipt", "auditType", "nominationId", "voteId", "executionId", "blockId",
      "ghostVoteConsumed", "rulesBaselineVersion", "eventId", "commandId"
    ]);
    const scan = (value: unknown): void => {
      if (Array.isArray(value)) return value.forEach(scan);
      if (value !== null && typeof value === "object") {
        for (const [key, nested] of Object.entries(value)) {
          expect(forbiddenKeys.has(key), `forbidden projection key ${key}`).toBe(false);
          scan(nested);
        }
      }
    };
    scan(projection);
  });
});
