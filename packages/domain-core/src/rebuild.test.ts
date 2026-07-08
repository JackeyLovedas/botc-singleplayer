import { describe, expect, it } from "vitest";
import {
  applyDomainEvent,
  DomainError,
  RULES_BASELINE_VERSION,
  SUPPORTED_ROLE_CATALOG_SIGNATURE,
  SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM,
  SUPPORTED_ROSTER_VERSION,
  batchId,
  calculateRoleCatalogSignature,
  compareRoleSetupSnapshot,
  commandId,
  compareStableId,
  eventId,
  applyDomainEventBatch,
  playerId,
  roleId,
  rebuildGameState,
  validateDomainEventStream
} from "@botc/domain-core";
import type {
  AnyDomainEventEnvelope,
  CharactersAssignedPayload,
  DomainErrorCode,
  RoleCatalogSnapshot,
  RoleId,
  RoleSetupSnapshot,
  SetupGeneratedPayload
} from "@botc/domain-core";
import {
  auditEvent,
  charactersAssignedEvent,
  charactersAssignedPhaseTransitionedEvent,
  firstNightInitializedEvent,
  gameCreatedEvent,
  infrastructureEvent,
  initialPrivateKnowledgeEstablishedEvent,
  otherGameId,
  phaseTransitionedEvent,
  playerRosterCreatedEvent,
  scriptSelectedEvent,
  setupGeneratedEvent,
  setupPhaseTransitionedEvent,
  testSetupGenerator
} from "@botc/test-harness";

const expectDomainCode = (action: () => void, code: DomainErrorCode): void => {
  let caught: unknown;
  try {
    action();
  } catch (error) {
    caught = error;
  }

  expect(caught).toBeInstanceOf(DomainError);
  expect((caught as DomainError).code).toBe(code);
};

const setupEventStream = (setupEvent = setupGeneratedEvent()): readonly AnyDomainEventEnvelope[] => [
  gameCreatedEvent(),
  scriptSelectedEvent(),
  phaseTransitionedEvent(),
  setupEvent,
  setupPhaseTransitionedEvent()
];

const rosterEventStream = (rosterEvent = playerRosterCreatedEvent()): readonly AnyDomainEventEnvelope[] => [
  ...setupEventStream(),
  rosterEvent
];

const assignmentEventStream = (
  assignmentEvent = charactersAssignedEvent(),
  transitionEvent = charactersAssignedPhaseTransitionedEvent()
): readonly AnyDomainEventEnvelope[] => [
  ...rosterEventStream(),
  assignmentEvent,
  transitionEvent
];

const firstNightEventStream = (
  firstNightEvent = firstNightInitializedEvent(),
  knowledgeEvent = initialPrivateKnowledgeEstablishedEvent()
): readonly AnyDomainEventEnvelope[] => [
  ...assignmentEventStream(),
  firstNightEvent,
  knowledgeEvent
];

const generatedPayloadFor = (constraints: Parameters<typeof testSetupGenerator.generate>[0]["constraints"]): SetupGeneratedPayload => {
  const result = testSetupGenerator.generate({
    scriptId: "sects-and-violets",
    rootSeed: "seed-1",
    playerCount: 12,
    constraints
  });

  if (result.status === "failure") {
    throw new Error(result.message);
  }

  return {
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    ...result.setup
  };
};

const mutateSetupPayload = (
  mutate: (payload: SetupGeneratedPayload) => SetupGeneratedPayload
): ReturnType<typeof setupGeneratedEvent> => setupGeneratedEvent({ payload: mutate(setupGeneratedEvent().payload) });

const mutateCharactersAssignedPayload = (
  mutate: (payload: CharactersAssignedPayload) => CharactersAssignedPayload
): ReturnType<typeof charactersAssignedEvent> => charactersAssignedEvent({ payload: mutate(charactersAssignedEvent().payload) });

const setupRoleIds = (roles: readonly RoleSetupSnapshot[]): readonly RoleId[] =>
  roles.map((role) => role.roleId).sort(compareStableId);

const cloneRoleSnapshot = (role: RoleSetupSnapshot): RoleSetupSnapshot => ({
  ...role,
  setupModifier: { ...role.setupModifier }
});

const roleCatalogWithRoles = (
  payload: SetupGeneratedPayload,
  roles: readonly RoleSetupSnapshot[]
): RoleCatalogSnapshot => {
  const snapshotWithoutSignature = {
    scriptId: payload.roleCatalogSnapshot.scriptId,
    edition: payload.roleCatalogSnapshot.edition,
    roleCatalogVersion: payload.roleCatalogSnapshot.roleCatalogVersion,
    roles: roles.map(cloneRoleSnapshot)
  };

  return {
    ...snapshotWithoutSignature,
    canonicalSignature: calculateRoleCatalogSignature(snapshotWithoutSignature)
  };
};

const payloadWithCatalogRoles = (
  payload: SetupGeneratedPayload,
  roles: readonly RoleSetupSnapshot[]
): SetupGeneratedPayload => {
  const roleCatalogSnapshot = roleCatalogWithRoles(payload, roles);

  return {
    ...payload,
    roleCatalogSnapshot,
    roleCatalogSignature: roleCatalogSnapshot.canonicalSignature
  };
};

const absentRoleId = (payload: SetupGeneratedPayload): RoleId => {
  const actualRoleIds = new Set(payload.actualRoles.map((role) => role.roleId));
  const candidates = [
    "clockmaker",
    "dreamer",
    "snake_charmer",
    "mathematician",
    "flowergirl",
    "town_crier",
    "oracle",
    "savant",
    "seamstress",
    "philosopher",
    "artist",
    "juggler",
    "sage",
    "mutant",
    "sweetheart",
    "barber",
    "klutz"
  ].map(roleId);
  const candidate = candidates.find((roleIdValue) => !actualRoleIds.has(roleIdValue));
  if (candidate === undefined) {
    throw new Error("Expected at least one absent role candidate");
  }

  return candidate;
};

describe("domain event rebuild", () => {
  it("has explicit empty event stream behavior", () => {
    expectDomainCode(() => rebuildGameState([]), "EmptyEventStream");
    expect(() => rebuildGameState([])).toThrow("empty domain event stream");
  });

  it("applies GameCreated into minimal canonical state", () => {
    const state = rebuildGameState([gameCreatedEvent()]);

    expect(state).toMatchObject({
      gameVersion: 1,
      lastEventSequence: 1,
      created: true,
      rootSeed: "seed-1",
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      phase: "SCRIPT_SELECTION",
      dayNumber: 0,
      nightNumber: 0,
      playerCounts: {
        playerCount: 12,
        humanPlayerCount: 1,
        aiPlayerCount: 11,
        storytellerCount: 1
      }
    });
  });

  it("rebuilds the initial phase and counters after GameCreated", () => {
    const state = rebuildGameState([gameCreatedEvent()]);

    expect(state.phase).toBe("SCRIPT_SELECTION");
    expect(state.dayNumber).toBe(0);
    expect(state.nightNumber).toBe(0);
    expect(rebuildGameState([gameCreatedEvent()])).toStrictEqual(state);
  });

  it("requires ScriptSelected to follow GameCreated", () => {
    const event = scriptSelectedEvent({ eventSequence: 1, gameVersion: 1 });

    expectDomainCode(() => rebuildGameState([event]), "MissingGameCreated");
  });

  it("rejects duplicate GameCreated", () => {
    const duplicate = gameCreatedEvent({
      eventId: eventId("event-2"),
      eventSequence: 2,
      batchId: scriptSelectedEvent().batchId,
      commandId: scriptSelectedEvent().commandId,
      gameVersion: 2
    });
    const state = rebuildGameState([gameCreatedEvent()]);

    expectDomainCode(() => applyDomainEvent(state, duplicate), "DuplicateGameCreated");
  });

  it("rejects event sequence jumps", () => {
    const jumped = scriptSelectedEvent({ eventSequence: 3 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), jumped]), "EventSequenceJump");
  });

  it("rejects repeated event sequences", () => {
    const repeated = scriptSelectedEvent({ eventSequence: 1 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), repeated]), "EventSequenceJump");
  });

  it("rejects unsupported event versions", () => {
    const unsupported = {
      ...gameCreatedEvent(),
      eventVersion: 2
    } as unknown as AnyDomainEventEnvelope;

    expectDomainCode(() => rebuildGameState([unsupported]), "UnsupportedEventVersion");
  });

  it("rebuilds the same event stream deterministically", () => {
    const events = [gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()];

    expect(rebuildGameState(events)).toStrictEqual(rebuildGameState(events));
  });

  it("does not mutate input events", () => {
    const events = [gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()];
    const before = JSON.stringify(events);

    rebuildGameState(events);

    expect(JSON.stringify(events)).toBe(before);
  });

  it("rejects a first event whose gameVersion is not 1", () => {
    const event = gameCreatedEvent({ gameVersion: 2 });

    expectDomainCode(() => validateDomainEventStream([event]), "EventGameVersionMismatch");
  });

  it("rejects gameVersion jumps between batches", () => {
    const event = scriptSelectedEvent({ gameVersion: 3 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), event]), "EventGameVersionMismatch");
  });

  it("rejects gameVersion retreat between batches", () => {
    const event = scriptSelectedEvent({ gameVersion: 0 });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), event]), "EventGameVersionMismatch");
  });

  it("rejects different gameVersion values inside one batch", () => {
    const created = gameCreatedEvent();
    const selected = scriptSelectedEvent({
      batchId: created.batchId,
      commandId: created.commandId,
      eventSequence: 2,
      gameVersion: 2
    });

    expectDomainCode(() => rebuildGameState([created, selected]), "EventGameVersionMismatch");
  });

  it("rejects different commandId values inside one batch", () => {
    const created = gameCreatedEvent();
    const selected = scriptSelectedEvent({
      batchId: created.batchId,
      eventSequence: 2,
      gameVersion: 1,
      commandId: commandId("other-command")
    });

    expectDomainCode(() => rebuildGameState([created, selected]), "EventCommandMismatch");
  });

  it("rejects different gameId values inside one stream", () => {
    const created = gameCreatedEvent();
    const selected = scriptSelectedEvent({
      batchId: created.batchId,
      commandId: created.commandId,
      eventSequence: 2,
      gameVersion: 1,
      gameId: otherGameId()
    });

    expectDomainCode(() => rebuildGameState([created, selected]), "EventGameMismatch");
  });

  it("rejects rules baseline changes inside one stream", () => {
    const selected = scriptSelectedEvent({
      rulesBaselineVersion: "Phase One v0",
      payload: {
        ...scriptSelectedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "EventRulesBaselineMismatch");
  });

  it("rejects duplicate event ids", () => {
    const selected = scriptSelectedEvent({ eventId: gameCreatedEvent().eventId });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "DuplicateEventId");
  });

  it("rejects one commandId associated with two successful batches", () => {
    const selected = scriptSelectedEvent({ commandId: gameCreatedEvent().commandId });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "DuplicateCommandBatch");
  });

  it("rejects event metadata rules baseline that differs from payload", () => {
    const event = gameCreatedEvent({
      payload: {
        ...gameCreatedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([event]), "EventRulesBaselineMismatch");
  });

  it("rejects ScriptSelected when its rules baseline differs from GameState", () => {
    const selected = scriptSelectedEvent({
      rulesBaselineVersion: "Phase One v0",
      payload: {
        ...scriptSelectedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), selected]), "EventRulesBaselineMismatch");
  });

  it("rebuilds a legal SelectScript multi-event batch", () => {
    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);

    expect(state.gameVersion).toBe(2);
    expect(state.lastEventSequence).toBe(3);
    expect(state.selectedScript).toMatchObject({ scriptId: "sects-and-violets" });
    expect(state.phase).toBe("SETUP_GENERATION");
  });

  it("applies PhaseTransitioned into SETUP_GENERATION after ScriptSelected", () => {
    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);

    expect(state.phase).toBe("SETUP_GENERATION");
    expect(state.dayNumber).toBe(0);
    expect(state.nightNumber).toBe(0);
    expect(state.gameVersion).toBe(2);
    expect(state.lastEventSequence).toBe(3);
  });

  it("rejects ScriptSelected after the game has already reached SETUP_GENERATION", () => {
    const duplicate = scriptSelectedEvent({
      eventId: eventId("event-4"),
      eventSequence: 4,
      batchId: batchId("batch-3"),
      commandId: commandId("command-3"),
      gameVersion: 3
    });

    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);

    expectDomainCode(() => applyDomainEvent(state, duplicate), "InvalidScriptSelectedPhase");
  });

  it("rejects two ScriptSelected events in one stream before phase transition", () => {
    const duplicate = scriptSelectedEvent({
      eventId: eventId("event-3"),
      eventSequence: 3,
      batchId: batchId("batch-3"),
      commandId: commandId("command-3"),
      gameVersion: 3
    });

    const state = applyDomainEvent(rebuildGameState([gameCreatedEvent()]), scriptSelectedEvent());

    expectDomainCode(() => applyDomainEvent(state, duplicate), "DuplicateScriptSelected");
  });

  it("rejects PhaseTransitioned when reasonCode does not match policy", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        transitionReason: "SETUP_GENERATED"
      }
    });

    const state = applyDomainEvent(rebuildGameState([gameCreatedEvent()]), scriptSelectedEvent());

    expectDomainCode(() => applyDomainEvent(state, event), "InvalidPhaseTransitionReason");
  });

  it("keeps transitionReason as a typed replay fact", () => {
    const event = phaseTransitionedEvent();
    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), event]);

    expect(event.payload.transitionReason).toBe("SCRIPT_SELECTED");
    expect(state.phase).toBe("SETUP_GENERATION");
  });

  it("rejects semantically invalid prospective batches without mutating inputs", () => {
    const currentState = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);
    const invalid = [scriptSelectedEvent({
      eventId: eventId("event-4"),
      eventSequence: 4,
      batchId: batchId("batch-3"),
      commandId: commandId("command-3"),
      gameVersion: 3
    })];
    const stateBefore = JSON.stringify(currentState);
    const eventsBefore = JSON.stringify(invalid);

    expectDomainCode(() => applyDomainEventBatch(currentState, invalid), "InvalidDomainBatchSemantics");
    expect(JSON.stringify(currentState)).toBe(stateBefore);
    expect(JSON.stringify(invalid)).toBe(eventsBefore);
  });

  it("does not allow arbitrary transitionReason strings at the type boundary", () => {
    const event = phaseTransitionedEvent();
    // @ts-expect-error transitionReason must be a PhaseTransitionReason value
    const invalid: typeof event.payload.transitionReason = "SCRIPT_SELECTION_TO_SETUP_GENERATION";

    void invalid;
    expect(event.payload.transitionReason).toBe("SCRIPT_SELECTED");
  });

  it("rejects PhaseTransitioned when fromPhase does not match state", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        fromPhase: "DAY_DISCUSSION"
      }
    });

    const state = applyDomainEvent(rebuildGameState([gameCreatedEvent()]), scriptSelectedEvent());

    expectDomainCode(() => applyDomainEvent(state, event), "InvalidPhaseTransition");
  });

  it("rejects negative phase counters", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        dayNumberAfter: -1
      }
    });

    const state = applyDomainEvent(rebuildGameState([gameCreatedEvent()]), scriptSelectedEvent());

    expectDomainCode(() => applyDomainEvent(state, event), "InvalidPhaseCounter");
  });

  it("rejects illegal phase jumps", () => {
    const event = phaseTransitionedEvent({
      payload: {
        ...phaseTransitionedEvent().payload,
        toPhase: "FIRST_NIGHT"
      }
    });

    const state = applyDomainEvent(rebuildGameState([gameCreatedEvent()]), scriptSelectedEvent());

    expectDomainCode(() => applyDomainEvent(state, event), "InvalidPhaseTransition");
  });

  it("rejects PhaseTransitioned rules baseline mismatch", () => {
    const event = phaseTransitionedEvent({
      rulesBaselineVersion: "Phase One v0",
      payload: {
        ...phaseTransitionedEvent().payload,
        rulesBaselineVersion: "Phase One v0"
      }
    });

    expectDomainCode(() => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), event]), "EventRulesBaselineMismatch");
  });

  it("rebuilds a legal GenerateSetup batch into CHARACTER_ASSIGNMENT", () => {
    const state = rebuildGameState([
      gameCreatedEvent(),
      scriptSelectedEvent(),
      phaseTransitionedEvent(),
      setupGeneratedEvent(),
      setupPhaseTransitionedEvent()
    ]);

    expect(state.phase).toBe("CHARACTER_ASSIGNMENT");
    expect(state.gameVersion).toBe(3);
    expect(state.lastEventSequence).toBe(5);
  });

  it("rebuilds setup while leaving assignment absent", () => {
    const state = rebuildGameState([
      gameCreatedEvent(),
      scriptSelectedEvent(),
      phaseTransitionedEvent(),
      setupGeneratedEvent(),
      setupPhaseTransitionedEvent()
    ]);

    expect(state.setup?.actualRoles).toHaveLength(12);
    expect("assignment" in state).toBe(false);
  });

  it("rejects SETUP_GENERATED transition when setup fact is missing", () => {
    const state = rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent()]);

    expectDomainCode(() => applyDomainEvent(state, setupPhaseTransitionedEvent({ eventSequence: 4 })), "MissingTransitionPrerequisite");
  });

  it("rejects damaged SetupGenerated payloads during replay", () => {
    const damaged = setupGeneratedEvent({
      payload: {
        ...setupGeneratedEvent().payload,
        actualRoles: setupGeneratedEvent().payload.actualRoles.slice(1)
      }
    });

    expectDomainCode(
      () => rebuildGameState([gameCreatedEvent(), scriptSelectedEvent(), phaseTransitionedEvent(), damaged, setupPhaseTransitionedEvent()]),
      "InvalidSetupGeneratedPayload"
    );
  });

  it("accepts a legal complete role catalog snapshot", () => {
    const state = rebuildGameState(setupEventStream());

    expect(state.setup?.roleCatalogSnapshot.roles).toHaveLength(25);
    expect(state.setup?.roleCatalogSignature).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE);
    expect(state.setup?.roleCatalogSignatureAlgorithm).toBe(SUPPORTED_ROLE_CATALOG_SIGNATURE_ALGORITHM);
  });

  it("rejects roleCatalogSnapshot when one role is missing", () => {
    const damaged = mutateSetupPayload((payload) => payloadWithCatalogRoles(payload, payload.roleCatalogSnapshot.roles.slice(1)));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects roleCatalogSnapshot when an extra role is present", () => {
    const damaged = mutateSetupPayload((payload) => {
      const firstRole = payload.roleCatalogSnapshot.roles[0];
      if (firstRole === undefined) {
        throw new Error("Expected catalog role");
      }

      return payloadWithCatalogRoles(payload, [
        ...payload.roleCatalogSnapshot.roles,
        {
          ...cloneRoleSnapshot(firstRole),
          roleId: roleId("extra_role")
        }
      ]);
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects duplicate role ids in roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map(cloneRoleSnapshot);
      const firstRole = roles[0];
      const secondRole = roles[1];
      if (firstRole === undefined || secondRole === undefined) {
        throw new Error("Expected catalog roles");
      }
      roles[1] = {
        ...secondRole,
        roleId: firstRole.roleId
      };

      return payloadWithCatalogRoles(payload, roles);
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects roleCatalogSnapshot outside canonical order", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map(cloneRoleSnapshot);
      const firstRole = roles[0];
      const secondRole = roles[1];
      if (firstRole === undefined || secondRole === undefined) {
        throw new Error("Expected catalog roles");
      }
      roles[0] = secondRole;
      roles[1] = firstRole;

      return payloadWithCatalogRoles(payload, roles);
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects a wrong roleCatalogSignature", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      roleCatalogSignature: "canonical-role-catalog-v1:00000000"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects a wrong roleCatalogSignatureAlgorithm", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      roleCatalogSignatureAlgorithm: "other-catalog-signature-v1"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects roleCatalogSignature mismatches with catalog content", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map(cloneRoleSnapshot);
      const fangGuIndex = roles.findIndex((role) => role.roleId === roleId("fang_gu"));
      const fangGu = roles[fangGuIndex];
      if (fangGu === undefined) {
        throw new Error("Expected Fang Gu");
      }
      roles[fangGuIndex] = {
        ...fangGu,
        setupModifier: {
          outsiderDelta: -1,
          townsfolkDelta: 1
        }
      };

      return {
        ...payload,
        roleCatalogSnapshot: {
          ...payload.roleCatalogSnapshot,
          roles
        }
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects actualRoles containing a role absent from roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role, index) =>
        index === 0
          ? {
              ...role,
              roleId: roleId("aaa_unknown_actual_role")
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demonBluffs containing a role absent from roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      demonBluffs: payload.demonBluffs.map((role, index) =>
        index === 0
          ? {
              ...role,
              roleId: roleId("aaa_unknown_bluff_role")
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects excludedRoleIds containing a role absent from roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        excludedRoleIds: [roleId("unknown_excluded_role")]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects lockedRoleIds containing a role absent from roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        lockedRoleIds: [roleId("unknown_locked_role")]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects exactRoleIds containing a role absent from roleCatalogSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        lockedRoleIds: [],
        excludedRoleIds: [],
        exactRoleIds: [roleId("unknown_exact_role"), ...setupRoleIds(payload.actualRoles).slice(1)].sort(compareStableId)
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects actualRoles whose known role type differs from the catalog", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role, index) =>
        index === 0
          ? {
              ...role,
              characterType: "OUTSIDER" as const
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects actualRoles whose known role alignment differs from the catalog", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role, index) =>
        index === 0
          ? {
              ...role,
              defaultAlignment: "EVIL" as const
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects actualRoles whose known role modifier differs from the catalog", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role, index) =>
        index === 0
          ? {
              ...role,
              setupModifier: {
                outsiderDelta: 1,
                townsfolkDelta: -1
              }
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demonBluff snapshots that differ from the catalog", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      demonBluffs: payload.demonBluffs.map((role, index) =>
        index === 0
          ? {
              ...role,
              defaultAlignment: "EVIL" as const
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demonRole snapshots that differ from the catalog", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      demonRole: {
        ...payload.demonRole,
        setupModifier: {
          outsiderDelta: payload.demonRole.setupModifier.outsiderDelta + 1,
          townsfolkDelta: payload.demonRole.setupModifier.townsfolkDelta - 1
        }
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects Vortox carrying Fang Gu setup modifiers in the catalog", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map((role) =>
        role.roleId === roleId("vortox")
          ? {
              ...cloneRoleSnapshot(role),
              setupModifier: {
                outsiderDelta: 1,
                townsfolkDelta: -1
              }
            }
          : cloneRoleSnapshot(role)
      );

      return payloadWithCatalogRoles(payload, roles);
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects No Dashii carrying Vigormortis setup modifiers in the catalog", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map((role) =>
        role.roleId === roleId("no_dashii")
          ? {
              ...cloneRoleSnapshot(role),
              setupModifier: {
                outsiderDelta: -1,
                townsfolkDelta: 1
              }
            }
          : cloneRoleSnapshot(role)
      );

      return payloadWithCatalogRoles(payload, roles);
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects fake catalog roles even when generic type counts remain legal", () => {
    const damaged = mutateSetupPayload((payload) => {
      const roles = payload.roleCatalogSnapshot.roles.map((role) =>
        role.roleId === roleId("clockmaker")
          ? {
              ...cloneRoleSnapshot(role),
              roleId: roleId("clockmaker_fake")
            }
          : cloneRoleSnapshot(role)
      );

      return payloadWithCatalogRoles(payload, roles.sort(compareRoleSetupSnapshot));
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("accepts SetupGenerated when demonRole deeply matches the actual demon snapshot", () => {
    const state = rebuildGameState(setupEventStream());
    const actualDemon = state.setup?.actualRoles.find((role) => role.characterType === "DEMON");

    expect(state.phase).toBe("CHARACTER_ASSIGNMENT");
    expect(state.setup?.demonRole).toStrictEqual(actualDemon);
  });

  it("rejects demonRole reusing a townsfolk roleId while claiming to be a demon", () => {
    const damaged = mutateSetupPayload((payload) => {
      const townsfolk = payload.actualRoles.find((role) => role.characterType === "TOWNSFOLK");
      if (townsfolk === undefined) {
        throw new Error("Expected townsfolk in setup");
      }

      return {
        ...payload,
        demonRole: {
          ...townsfolk,
          characterType: "DEMON",
          defaultAlignment: "EVIL"
        }
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demonRole modifier values that differ from the actual demon snapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      demonRole: {
        ...payload.demonRole,
        setupModifier: {
          outsiderDelta: payload.demonRole.setupModifier.outsiderDelta + 1,
          townsfolkDelta: payload.demonRole.setupModifier.townsfolkDelta - 1
        }
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects townsfolk snapshots with EVIL default alignment", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role) =>
        role.characterType === "TOWNSFOLK" ? { ...role, defaultAlignment: "EVIL" as const } : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demon snapshots with GOOD default alignment", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role) =>
        role.characterType === "DEMON" ? { ...role, defaultAlignment: "GOOD" as const } : role
      ),
      demonRole: {
        ...payload.demonRole,
        defaultAlignment: "GOOD" as const
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects non-demon role snapshots carrying setup modifiers", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      actualRoles: payload.actualRoles.map((role) =>
        role.characterType === "TOWNSFOLK"
          ? {
              ...role,
              setupModifier: {
                outsiderDelta: 1,
                townsfolkDelta: -1
              }
            }
          : role
      )
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects zero-modifier demons with setupModifiersApplied records", () => {
    const payload = generatedPayloadFor({ lockedRoleIds: [roleId("no_dashii")] });
    const damaged = setupGeneratedEvent({
      payload: {
        ...payload,
        setupModifiersApplied: [{
          roleId: roleId("no_dashii"),
          outsiderDelta: 0,
          townsfolkDelta: 0
        }]
      }
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects non-zero demon modifiers with extra zero-value records", () => {
    const payload = generatedPayloadFor({ lockedRoleIds: [roleId("fang_gu")] });
    const damaged = setupGeneratedEvent({
      payload: {
        ...payload,
        setupModifiersApplied: [
          ...payload.setupModifiersApplied,
          {
            roleId: roleId("clockmaker"),
            outsiderDelta: 0,
            townsfolkDelta: 0
          }
        ]
      }
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects locked roles that did not enter actualRoles", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        lockedRoleIds: [absentRoleId(payload)]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects excluded roles that appear in actualRoles", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        excludedRoleIds: [payload.actualRoles[0]?.roleId ?? roleId("clockmaker")]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects excluded roles that appear as demon bluffs", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        excludedRoleIds: [payload.demonBluffs[0]?.roleId ?? roleId("clockmaker")]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects exactRoleIds that do not match actualRoles", () => {
    const damaged = mutateSetupPayload((payload) => {
      const actualRoleIds = setupRoleIds(payload.actualRoles);
      const replacement = payload.demonBluffs[0]?.roleId;
      if (replacement === undefined) {
        throw new Error("Expected demon bluff");
      }

      return {
        ...payload,
        constraintsSnapshot: {
          lockedRoleIds: [],
          excludedRoleIds: [],
          exactRoleIds: [...actualRoleIds.slice(1), replacement].sort(compareStableId)
        }
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects duplicate role ids inside constraintsSnapshot", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      constraintsSnapshot: {
        ...payload.constraintsSnapshot,
        lockedRoleIds: [payload.actualRoles[0]?.roleId ?? roleId("clockmaker"), payload.actualRoles[0]?.roleId ?? roleId("clockmaker")]
      }
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects locked and excluded constraint overlap", () => {
    const damaged = mutateSetupPayload((payload) => {
      const lockedRoleId = payload.actualRoles[0]?.roleId ?? roleId("clockmaker");

      return {
        ...payload,
        constraintsSnapshot: {
          lockedRoleIds: [lockedRoleId],
          excludedRoleIds: [lockedRoleId],
          exactRoleIds: []
        }
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects unsupported setup algorithm versions", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      setupAlgorithmVersion: "snv-12-setup-v0"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects unsupported random algorithm versions", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      randomAlgorithmVersion: "xmur3-custom-v0"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects unsupported random streams", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      randomStream: "setup/other"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects unsupported role catalog versions", () => {
    const damaged = mutateSetupPayload((payload) => ({
      ...payload,
      roleCatalogVersion: "snv-role-catalog-v0"
    }));

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects actualRoles outside canonical order", () => {
    const damaged = mutateSetupPayload((payload) => {
      const actualRoles = [...payload.actualRoles];
      const first = actualRoles[0];
      const second = actualRoles[1];
      if (first === undefined || second === undefined) {
        throw new Error("Expected at least two actual roles");
      }
      actualRoles[0] = second;
      actualRoles[1] = first;

      return {
        ...payload,
        actualRoles
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rejects demonBluffs outside canonical roleId order", () => {
    const damaged = mutateSetupPayload((payload) => {
      const demonBluffs = [...payload.demonBluffs];
      const first = demonBluffs[0];
      const second = demonBluffs[1];
      if (first === undefined || second === undefined) {
        throw new Error("Expected at least two demon bluffs");
      }
      demonBluffs[0] = second;
      demonBluffs[1] = first;

      return {
        ...payload,
        demonBluffs
      };
    });

    expectDomainCode(() => rebuildGameState(setupEventStream(damaged)), "InvalidSetupGeneratedPayload");
  });

  it("rebuilds a legal SetupGenerated event stream into CHARACTER_ASSIGNMENT", () => {
    const state = rebuildGameState(setupEventStream());

    expect(state.phase).toBe("CHARACTER_ASSIGNMENT");
    expect(state.setup?.actualRoles).toHaveLength(12);
    expect(state.setup?.demonBluffs).toHaveLength(3);
  });

  it("rebuilds a legal PlayerRosterCreated event stream while staying in CHARACTER_ASSIGNMENT", () => {
    const state = rebuildGameState(rosterEventStream());

    expect(state.phase).toBe("CHARACTER_ASSIGNMENT");
    expect(state.roster?.rosterVersion).toBe(SUPPORTED_ROSTER_VERSION);
    expect(state.roster?.entries).toHaveLength(12);
    expect(state.roster?.entries.filter((entry) => entry.playerKind === "HUMAN")).toHaveLength(1);
    expect(state.roster?.entries.filter((entry) => entry.playerKind === "AI")).toHaveLength(11);
    expect(state.assignment).toBeUndefined();
  });

  it("rejects PlayerRosterCreated with an unsupported roster version", () => {
    const damaged = playerRosterCreatedEvent({
      payload: {
        ...playerRosterCreatedEvent().payload,
        rosterVersion: "unsupported-roster-version"
      }
    });

    expectDomainCode(() => rebuildGameState(rosterEventStream(damaged)), "InvalidPlayerRosterCreatedPayload");
  });

  it("rejects PlayerRosterCreated with an incomplete roster", () => {
    const damaged = playerRosterCreatedEvent({
      payload: {
        ...playerRosterCreatedEvent().payload,
        entries: playerRosterCreatedEvent().payload.entries.slice(1)
      }
    });

    expectDomainCode(() => rebuildGameState(rosterEventStream(damaged)), "InvalidPlayerRosterCreatedPayload");
  });

  it("rejects PlayerRosterCreated with untrimmed display names", () => {
    const damaged = playerRosterCreatedEvent({
      payload: {
        ...playerRosterCreatedEvent().payload,
        entries: playerRosterCreatedEvent().payload.entries.map((entry, index) =>
          index === 0 ? { ...entry, displayName: ` ${entry.displayName}` } : entry
        )
      }
    });

    expectDomainCode(() => rebuildGameState(rosterEventStream(damaged)), "InvalidPlayerRosterCreatedPayload");
  });

  it("rejects duplicate PlayerRosterCreated facts", () => {
    const state = rebuildGameState(rosterEventStream());

    expectDomainCode(() => applyDomainEvent(state, playerRosterCreatedEvent({ eventSequence: 7 })), "DuplicatePlayerRosterCreated");
  });

  it("rejects CharactersAssigned when a roster is missing", () => {
    const state = rebuildGameState(setupEventStream());

    expectDomainCode(() => applyDomainEvent(state, charactersAssignedEvent({ eventSequence: 6 })), "InvalidCharactersAssignedPayload");
  });

  it("rebuilds a legal CharactersAssigned event stream into FIRST_NIGHT", () => {
    const state = rebuildGameState(assignmentEventStream());

    expect(state.phase).toBe("FIRST_NIGHT");
    expect(state.dayNumber).toBe(0);
    expect(state.nightNumber).toBe(1);
    expect(state.roster?.entries).toHaveLength(12);
    expect(state.assignment?.assignments).toHaveLength(12);
    expect(state.assignment?.assignments.map((assignment) => assignment.seatNumber)).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("rebuilds first night initialization and initial private knowledge while staying in FIRST_NIGHT", () => {
    const state = rebuildGameState(firstNightEventStream());

    expect(state.phase).toBe("FIRST_NIGHT");
    expect(state.dayNumber).toBe(0);
    expect(state.nightNumber).toBe(1);
    expect(state.gameVersion).toBe(6);
    expect(state.lastEventSequence).toBe(10);
    expect(state.firstNight?.initializationVersion).toBe("first-night-initialization-v1");
    expect(state.initialPrivateKnowledge?.knowledgeModelVersion).toBe("initial-private-knowledge-v1");
    expect(state.initialPrivateKnowledge?.entries.filter((entry) => entry.kind === "OWN_CHARACTER")).toHaveLength(12);
    expect(state.initialPrivateKnowledge?.entries.filter((entry) => entry.kind === "DEMON_IDENTITY")).toHaveLength(2);
    expect(state.initialPrivateKnowledge?.entries.filter((entry) => entry.kind === "MINION_IDENTITIES")).toHaveLength(3);
    expect(state.initialPrivateKnowledge?.entries.filter((entry) => entry.kind === "DEMON_BLUFFS")).toHaveLength(1);
  });

  it("rejects bare first night initialization during replay", () => {
    expectDomainCode(
      () => rebuildGameState([...assignmentEventStream(), firstNightInitializedEvent()]),
      "InvalidDomainBatchSemantics"
    );
  });

  it("rejects initial private knowledge without FirstNightInitialized during replay", () => {
    const knowledge = initialPrivateKnowledgeEstablishedEvent({
      eventId: eventId("event-9-private-knowledge"),
      eventSequence: 9
    });

    expectDomainCode(() => rebuildGameState([...assignmentEventStream(), knowledge]), "InvalidDomainBatchSemantics");
  });

  it("rejects reversed first night initialization event order during replay", () => {
    const knowledge = initialPrivateKnowledgeEstablishedEvent({
      eventId: eventId("event-9-private-knowledge"),
      eventSequence: 9
    });
    const initialized = firstNightInitializedEvent({
      eventId: eventId("event-10-first-night"),
      eventSequence: 10
    });

    expectDomainCode(() => rebuildGameState([...assignmentEventStream(), knowledge, initialized]), "InvalidDomainBatchSemantics");
  });

  it("rejects first night metadata that does not match assignment facts", () => {
    const initialized = firstNightInitializedEvent({
      payload: {
        ...firstNightInitializedEvent().payload,
        assignmentAlgorithmVersion: "unsupported-assignment"
      }
    });

    expectDomainCode(
      () => rebuildGameState(firstNightEventStream(initialized)),
      "InvalidFirstNightInitializedPayload"
    );
  });

  it("rejects non-canonical initial private knowledge entry order", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const first = payload.entries[0];
    const second = payload.entries[1];
    if (first === undefined || second === undefined) {
      throw new Error("Expected initial private knowledge entries");
    }

    const knowledge = initialPrivateKnowledgeEstablishedEvent({
      payload: {
        ...payload,
        entries: [second, first, ...payload.entries.slice(2)]
      }
    });

    expectDomainCode(() => rebuildGameState(firstNightEventStream(firstNightInitializedEvent(), knowledge)), "InvalidInitialPrivateKnowledgeEstablishedPayload");
  });

  it("rejects OWN_CHARACTER entries that do not match character assignment", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const firstOwnIndex = payload.entries.findIndex((entry) => entry.kind === "OWN_CHARACTER");
    const secondOwn = payload.entries.find((entry, index) => index !== firstOwnIndex && entry.kind === "OWN_CHARACTER");
    const firstOwn = payload.entries[firstOwnIndex];
    if (firstOwn === undefined || firstOwn.kind !== "OWN_CHARACTER" || secondOwn === undefined || secondOwn.kind !== "OWN_CHARACTER") {
      throw new Error("Expected two own-character entries");
    }

    const entries = [...payload.entries];
    entries[firstOwnIndex] = {
      ...firstOwn,
      role: secondOwn.role
    };
    const knowledge = initialPrivateKnowledgeEstablishedEvent({
      payload: {
        ...payload,
        entries
      }
    });

    expectDomainCode(() => rebuildGameState(firstNightEventStream(firstNightInitializedEvent(), knowledge)), "InvalidInitialPrivateKnowledgeEstablishedPayload");
  });

  it("rejects known player references that carry hidden role fields", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const minionIdentityIndex = payload.entries.findIndex((entry) => entry.kind === "MINION_IDENTITIES" && entry.minions.length > 0);
    const entry = payload.entries[minionIdentityIndex];
    if (entry === undefined || entry.kind !== "MINION_IDENTITIES") {
      throw new Error("Expected minion identities entry");
    }

    const firstReference = entry.minions[0];
    if (firstReference === undefined) {
      throw new Error("Expected minion reference");
    }

    const entries = [...payload.entries];
    entries[minionIdentityIndex] = {
      ...entry,
      minions: [{
        ...firstReference,
        roleId: roleId("witch")
      } as typeof firstReference, ...entry.minions.slice(1)]
    };
    const knowledge = initialPrivateKnowledgeEstablishedEvent({
      payload: {
        ...payload,
        entries
      }
    });

    expectDomainCode(() => rebuildGameState(firstNightEventStream(firstNightInitializedEvent(), knowledge)), "InvalidInitialPrivateKnowledgeEstablishedPayload");
  });

  it("rejects demon bluffs that do not deeply equal setup demonBluffs", () => {
    const payload = initialPrivateKnowledgeEstablishedEvent().payload;
    const demonBluffIndex = payload.entries.findIndex((entry) => entry.kind === "DEMON_BLUFFS");
    const entry = payload.entries[demonBluffIndex];
    const actualRole = setupGeneratedEvent().payload.actualRoles[0];
    if (entry === undefined || entry.kind !== "DEMON_BLUFFS" || actualRole === undefined) {
      throw new Error("Expected demon bluff entry and actual role");
    }

    const entries = [...payload.entries];
    entries[demonBluffIndex] = {
      ...entry,
      roles: [actualRole, ...entry.roles.slice(1)]
    };
    const knowledge = initialPrivateKnowledgeEstablishedEvent({
      payload: {
        ...payload,
        entries
      }
    });

    expectDomainCode(() => rebuildGameState(firstNightEventStream(firstNightInitializedEvent(), knowledge)), "InvalidInitialPrivateKnowledgeEstablishedPayload");
  });

  it("rejects CHARACTERS_ASSIGNED transition when assignment fact is missing", () => {
    const state = rebuildGameState(rosterEventStream());

    expectDomainCode(
      () => applyDomainEvent(state, charactersAssignedPhaseTransitionedEvent({ eventSequence: 7 })),
      "MissingTransitionPrerequisite"
    );
  });

  it("rejects duplicate CharactersAssigned facts", () => {
    const assignedState = applyDomainEvent(rebuildGameState(rosterEventStream()), charactersAssignedEvent());

    expectDomainCode(() => applyDomainEvent(assignedState, charactersAssignedEvent({ eventSequence: 8 })), "DuplicateCharactersAssigned");
  });

  it("rejects CharactersAssigned with an unsupported assignment algorithm version", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => ({
      ...payload,
      assignmentAlgorithmVersion: "unsupported-assignment-version"
    }));

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned with an unsupported random stream", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => ({
      ...payload,
      randomStream: "unsupported-assignment-stream"
    }));

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned with a role catalog signature mismatch", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => ({
      ...payload,
      roleCatalogSignature: "tampered-role-catalog-signature"
    }));

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned when rosterVersion differs from the applied roster", () => {
    const state = rebuildGameState(rosterEventStream());
    if (state.roster === undefined) {
      throw new Error("Expected roster state");
    }

    const stateWithFutureRosterVersion = {
      ...state,
      roster: {
        ...state.roster,
        rosterVersion: "future-roster-version"
      }
    };

    expectDomainCode(() => applyDomainEvent(stateWithFutureRosterVersion, charactersAssignedEvent()), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned when player and seat do not match the roster", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => {
      const [first, ...rest] = payload.assignments;
      if (first === undefined) {
        throw new Error("test assignment missing first entry");
      }

      return {
        ...payload,
        assignments: [
          {
            ...first,
            playerId: playerId("unknown-player")
          },
          ...rest
        ]
      };
    });

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned with duplicate role ids", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => {
      const first = payload.assignments[0];
      const second = payload.assignments[1];
      if (first === undefined || second === undefined) {
        throw new Error("test assignment missing entries");
      }

      return {
        ...payload,
        assignments: [first, { ...second, role: first.role }, ...payload.assignments.slice(2)]
      };
    });

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned with role snapshots that do not match setup.actualRoles", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => {
      const [first, ...rest] = payload.assignments;
      if (first === undefined) {
        throw new Error("test assignment missing first entry");
      }

      return {
        ...payload,
        assignments: [
          {
            ...first,
            role: {
              ...first.role,
              setupModifier: {
                ...first.role.setupModifier,
                outsiderDelta: first.role.setupModifier.outsiderDelta + 1
              }
            }
          },
          ...rest
        ]
      };
    });

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("rejects CharactersAssigned when assignments are not sorted by seat", () => {
    const damaged = mutateCharactersAssignedPayload((payload) => {
      const first = payload.assignments[0];
      const second = payload.assignments[1];
      if (first === undefined || second === undefined) {
        throw new Error("test assignment missing entries");
      }

      return {
        ...payload,
        assignments: [second, first, ...payload.assignments.slice(2)]
      };
    });

    expectDomainCode(() => rebuildGameState(assignmentEventStream(damaged)), "InvalidCharactersAssignedPayload");
  });

  it("does not allow AuditEvent streams at the type boundary", () => {
    const auditEvents = [auditEvent()];
    // @ts-expect-error audit events are not domain events and cannot rebuild canonical state
    const rejectedDomainEvents: Parameters<typeof rebuildGameState>[0] = auditEvents;

    void rejectedDomainEvents;
    expect(auditEvents[0]?.category).toBe("audit");
  });

  it("does not allow InfrastructureEvent streams at the type boundary", () => {
    const infrastructureEvents = [infrastructureEvent()];
    // @ts-expect-error infrastructure events are not domain events and cannot rebuild canonical state
    const rejectedDomainEvents: Parameters<typeof rebuildGameState>[0] = infrastructureEvents;

    void rejectedDomainEvents;
    expect(infrastructureEvents[0]?.category).toBe("infrastructure");
  });
});
