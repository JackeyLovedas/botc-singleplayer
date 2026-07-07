import { describe, expect, it } from "vitest";
import { DomainError, rebuildGameState } from "@botc/domain-core";
import type { AnyDomainEventEnvelope } from "@botc/domain-core";
import {
  auditEvent,
  gameCreatedEvent,
  infrastructureEvent,
  scriptSelectedEvent
} from "@botc/test-harness";

describe("domain event rebuild", () => {
  it("has explicit empty event stream behavior", () => {
    expect(() => rebuildGameState([])).toThrow(DomainError);
    expect(() => rebuildGameState([])).toThrow("empty domain event stream");
  });

  it("applies GameCreated into minimal canonical state", () => {
    const state = rebuildGameState([gameCreatedEvent()]);

    expect(state).toMatchObject({
      gameVersion: 1,
      lastEventSequence: 1,
      created: true,
      rootSeed: "seed-1",
      playerCounts: {
        playerCount: 12,
        humanPlayerCount: 1,
        aiPlayerCount: 11,
        storytellerCount: 1
      }
    });
  });

  it("requires ScriptSelected to follow GameCreated", () => {
    const event = scriptSelectedEvent({ eventSequence: 1, gameVersion: 1 });

    expect(() => rebuildGameState([event])).toThrow("First domain event must be GameCreated");
  });

  it("rejects duplicate GameCreated", () => {
    const duplicate = gameCreatedEvent({
      eventSequence: 2,
      gameVersion: 2
    });

    expect(() => rebuildGameState([gameCreatedEvent(), duplicate])).toThrow("GameCreated cannot be applied twice");
  });

  it("rejects event sequence jumps", () => {
    const jumped = scriptSelectedEvent({ eventSequence: 3 });

    expect(() => rebuildGameState([gameCreatedEvent(), jumped])).toThrow("continuous");
  });

  it("rejects repeated event sequences", () => {
    const repeated = scriptSelectedEvent({ eventSequence: 1 });

    expect(() => rebuildGameState([gameCreatedEvent(), repeated])).toThrow("continuous");
  });

  it("rejects unsupported event versions", () => {
    const unsupported = {
      ...gameCreatedEvent(),
      eventVersion: 2
    } as unknown as AnyDomainEventEnvelope;

    expect(() => rebuildGameState([unsupported])).toThrow("Unsupported domain event version");
  });

  it("rebuilds the same event stream deterministically", () => {
    const events = [gameCreatedEvent(), scriptSelectedEvent()];

    expect(rebuildGameState(events)).toStrictEqual(rebuildGameState(events));
  });

  it("does not mutate input events", () => {
    const events = [gameCreatedEvent(), scriptSelectedEvent()];
    const before = JSON.stringify(events);

    rebuildGameState(events);

    expect(JSON.stringify(events)).toBe(before);
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
