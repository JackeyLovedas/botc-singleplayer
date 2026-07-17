import { rebuildGameState } from "@botc/domain-core";
import type { AnyDomainEventEnvelope, GameState } from "@botc/domain-core";
import capturedFixture from "./fixtures/dreamer-vortox-v3-accepted-stream.json" with { type: "json" };

export type DreamerVortoxV3TargetKind = "GOOD" | "NON_VORTOX_EVIL" | "VORTOX";

export type AcceptedDreamerVortoxV3StreamFixture = {
  readonly events: readonly AnyDomainEventEnvelope[];
  readonly finalState: GameState;
  readonly opportunityEventIndex: number;
  readonly targetEventIndex: number;
  readonly deliveryEventIndex: number;
  readonly settlementEventIndex: number;
};

type StoredAcceptedDreamerVortoxV3StreamFixture = Omit<
  AcceptedDreamerVortoxV3StreamFixture,
  "finalState"
>;

type AcceptedDreamerVortoxV3StreamFixtureSet = {
  readonly fixtureVersion: "dreamer-vortox-v3-accepted-stream-fixture-v1";
  readonly captures: Readonly<
    Record<DreamerVortoxV3TargetKind, StoredAcceptedDreamerVortoxV3StreamFixture>
  >;
};

const fixtureSet = capturedFixture as unknown as AcceptedDreamerVortoxV3StreamFixtureSet;
const cachedFixtures = new Map<
  DreamerVortoxV3TargetKind,
  AcceptedDreamerVortoxV3StreamFixture
>();

export const loadAcceptedBaseDreamerVortoxV3StreamFixture = (
  targetKind: DreamerVortoxV3TargetKind = "GOOD"
): AcceptedDreamerVortoxV3StreamFixture => {
  let fixture = cachedFixtures.get(targetKind);
  if (fixture === undefined) {
    const storedFixture = structuredClone(fixtureSet.captures[targetKind]);
    fixture = {
      ...storedFixture,
      finalState: rebuildGameState(storedFixture.events)
    };
    cachedFixtures.set(targetKind, fixture);
  }
  return structuredClone(fixture);
};
