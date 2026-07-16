import type { AnyDomainEventEnvelope } from "@botc/domain-core";
import capturedFixture from "./fixtures/dreamer-v3-accepted-stream.json" with { type: "json" };

export type AcceptedDreamerV3StreamFixture = {
  readonly events: readonly AnyDomainEventEnvelope[];
  readonly targetEventIndex: number;
  readonly deliveryEventIndex: number;
  readonly settlementEventIndex: number;
};

const acceptedBaseDreamerV3NormalStreamFixture =
  capturedFixture as unknown as AcceptedDreamerV3StreamFixture;

export const loadAcceptedBaseDreamerV3NormalStreamFixture =
  (): AcceptedDreamerV3StreamFixture => structuredClone(
    acceptedBaseDreamerV3NormalStreamFixture
  );
