import { describe, expect, it } from "vitest";
import {
  canonicalizeAbilityOutcomeEvidenceReferences,
  cloneFirstNightAbilityOutcomeLedger,
  FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,
  FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION,
  FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION,
  formatBaseFirstNightAbilityInstanceId,
  formatFirstNightAbilityOutcomeFactId,
  formatPhilosopherGainedV2AbilityInstanceId,
  parseFirstNightAbilityInstanceId,
  resolveFirstNightMathematicianTrueCountFromState,
  validateAbilityOutcomeEvidenceReference,
  validateFirstNightAbilityInstanceProvenance,
  validateFirstNightAbilityOutcomeFact,
  validateFirstNightAbilityOutcomeLedger,
  validateFirstNightAbilityOutcomeWindowAnchor
} from "./first-night-ability-outcome-ledger.js";
import { DomainError } from "./errors.js";
import { batchId, eventId, gameId, grantedAbilityId, playerId, roleId, scheduledTaskId } from "./ids.js";
import type { FirstNightAbilityOutcomeFact, FirstNightAbilityOutcomeLedger, SourceEventEvidence } from "./first-night-ability-outcome-ledger.js";
import type { GameState } from "./game-state.js";
import { seatNumber } from "./player-roster.js";

const taskId = scheduledTaskId("task-10");
const sourceEventId = eventId("event-20");
const sourceEvidence = (): SourceEventEvidence => ({
  kind: "SOURCE_EVENT", eventId: sourceEventId, eventType: "WitchDeathPendingMarked",
  eventSequence: 20, batchId: batchId("batch-20")
});
const fact = (status: FirstNightAbilityOutcomeFact["outcomeStatus"] = "NORMAL"): FirstNightAbilityOutcomeFact => ({
  auditFactId: formatFirstNightAbilityOutcomeFactId(sourceEventId),
  auditModelVersion: FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,
  windowVersion: FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION,
  sourcePlayerId: playerId("player-1"), sourceSeatNumber: seatNumber(1), abilityRoleId: roleId("witch"), abilityTaskId: taskId,
  abilityInstance: { provenanceVersion: "first-night-ability-instance-provenance-v1", kind: "BASE_ROLE_TASK", abilityInstanceId: formatBaseFirstNightAbilityInstanceId(taskId), abilityRoleId: roleId("witch"), taskId, sourcePlayerId: playerId("player-1"), sourceSeatNumber: seatNumber(1) },
  sourceEventId, sourceBatchId: batchId("batch-20"), sourceEventSequence: 20, evaluatedCharacterStateRevision: 1,
  outcomeStatus: status, causeKind: status === "ABNORMAL" ? "SOURCE_POISONING" : "NO_OTHER_CHARACTER_ABILITY",
  causedByAnotherCharacterAbility: status === "ABNORMAL", evidenceReferences: [sourceEvidence(), { kind: "TASK", taskId, taskType: "WITCH_ACTION" }], detectedAtEventSequence: 20
});
const ledger = (facts: readonly FirstNightAbilityOutcomeFact[] = [fact()]): FirstNightAbilityOutcomeLedger => ({
  ledgerVersion: FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION,
  auditModelVersion: FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION,
  windowAnchor: { windowVersion: FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION, gameId: gameId("game-1"), nightNumber: 1, rulesBaselineVersion: "Phase One v2.1", firstNightInitializedEventId: eventId("event-10"), startEventSequence: 10, startBoundary: "EXCLUSIVE" },
  facts
});

describe("first-night ability outcome ledger", () => {
  it("round-trips base and gained V2 canonical ability instance identities", () => {
    expect(parseFirstNightAbilityInstanceId(formatBaseFirstNightAbilityInstanceId(taskId))).toMatchObject({ valid: true, kind: "BASE_ROLE_TASK", taskId });
    const gained = formatPhilosopherGainedV2AbilityInstanceId({ taskId, grantId: grantedAbilityId("grant-1") });
    expect(parseFirstNightAbilityInstanceId(gained)).toMatchObject({ valid: true, kind: "PHILOSOPHER_GAINED_TASK_V2", taskId, grantId: "grant-1" });
    expect(parseFirstNightAbilityInstanceId(`${gained}:grant:other`)).toMatchObject({ valid: false });
  });

  it("requires exact provenance variants", () => {
    const provenance = fact().abilityInstance;
    expect(validateFirstNightAbilityInstanceProvenance(provenance)).toStrictEqual({ valid: true });
    expect(validateFirstNightAbilityInstanceProvenance({ ...provenance, extra: true })).toMatchObject({ valid: false });
  });

  it("validates an exact first-night window anchor", () => {
    expect(validateFirstNightAbilityOutcomeWindowAnchor(ledger().windowAnchor)).toStrictEqual({ valid: true });
    expect(validateFirstNightAbilityOutcomeWindowAnchor({ ...ledger().windowAnchor, startBoundary: "INCLUSIVE" })).toMatchObject({ valid: false });
  });

  it("accepts all closed evidence shapes and rejects extra fields", () => {
    expect(validateAbilityOutcomeEvidenceReference(sourceEvidence())).toStrictEqual({ valid: true });
    expect(validateAbilityOutcomeEvidenceReference({ ...sourceEvidence(), recordId: "open" })).toMatchObject({ valid: false });
    expect(validateAbilityOutcomeEvidenceReference({ kind: "DOMAIN_RECORD", recordId: "open" })).toMatchObject({ valid: false });
  });

  it("canonicalizes evidence independent of input order and removes equal duplicates", () => {
    const task = { kind: "TASK" as const, taskId, taskType: "WITCH_ACTION" as const };
    expect(canonicalizeAbilityOutcomeEvidenceReferences([task, sourceEvidence(), sourceEvidence()])).toStrictEqual([sourceEvidence(), task]);
  });

  it("rejects conflicting content with the same primary identity", () => {
    const conflict = { ...sourceEvidence(), eventSequence: 21 };
    expect(() => canonicalizeAbilityOutcomeEvidenceReferences([sourceEvidence(), conflict])).toThrowError(DomainError);
  });

  it("treats player plus revision as the player-role primary identity", () => {
    const base = { kind: "PLAYER_ROLE_AT_REVISION" as const, playerId: playerId("player-1"), seatNumber: 1 as const, roleId: roleId("witch"), characterType: "MINION" as const, defaultAlignment: "EVIL" as const, characterStateRevision: 1 };
    expect(canonicalizeAbilityOutcomeEvidenceReferences([base, { ...base, characterStateRevision: 2 }])).toHaveLength(2);
    expect(() => canonicalizeAbilityOutcomeEvidenceReferences([base, { ...base, roleId: roleId("cerenovus") }])).toThrowError(DomainError);
  });

  it("validates facts and ledgers and deep-clones their arrays", () => {
    expect(validateFirstNightAbilityOutcomeFact(fact())).toStrictEqual({ valid: true });
    expect(validateFirstNightAbilityOutcomeLedger(ledger())).toStrictEqual({ valid: true });
    const copied = cloneFirstNightAbilityOutcomeLedger(ledger());
    expect(copied).toStrictEqual(ledger());
    expect(copied).not.toBe(ledger());
    expect(copied.facts).not.toBe(ledger().facts);
  });

  it("rejects duplicate or out-of-order fact identities", () => {
    expect(validateFirstNightAbilityOutcomeLedger(ledger([fact(), fact()]))).toMatchObject({ valid: false });
  });

  it("fails hostile getters, proxies, sparse arrays, cycles, symbols and nonplain values closed", () => {
    let calls = 0;
    const getter = Object.defineProperty({}, "kind", { enumerable: true, get: () => { calls += 1; return "SOURCE_EVENT"; } });
    const revoked = Proxy.revocable({}, {}); revoked.revoke();
    const sparse: unknown[] = []; sparse.length = 1;
    const cycle: Record<string, unknown> = {}; cycle.self = cycle;
    for (const hostile of [getter, revoked.proxy, sparse, cycle, { kind: Symbol("x") }, new Date()]) {
      expect(() => validateAbilityOutcomeEvidenceReference(hostile)).not.toThrow();
      expect(validateAbilityOutcomeEvidenceReference(hostile)).toMatchObject({ valid: false });
    }
    expect(calls).toBe(0);
  });

  it("resolves a state-bound count with player deduplication", () => {
    const abnormal2 = { ...fact("ABNORMAL"), auditFactId: formatFirstNightAbilityOutcomeFactId(eventId("event-21")), sourceEventId: eventId("event-21"), sourceEventSequence: 21, detectedAtEventSequence: 21, evidenceReferences: [{ ...sourceEvidence(), eventId: eventId("event-21"), eventSequence: 21 }, { kind: "TASK" as const, taskId, taskType: "WITCH_ACTION" as const }] };
    const state = {
      lastEventSequence: 30,
      firstNightAbilityOutcomeLedger: ledger([fact("ABNORMAL"), abnormal2]),
      firstNightTaskPlan: { taskPlanVersion: "first-night-task-plan-v2", tasks: [{ taskId: scheduledTaskId("math-task"), taskType: "MATHEMATICIAN_INFORMATION", taskClass: "ROLE_INFORMATION", orderKey: { baseOrder: 100, insertionOrder: 0 }, source: { kind: "ROLE", playerId: playerId("math-player"), seatNumber: 12, role: { roleId: roleId("mathematician") } }, status: "PENDING", settlementPolicy: "REEVALUATE_SOURCE_AT_SETTLEMENT" }] },
      firstNightTaskProgress: { settlements: [] }
    } as unknown as GameState;
    expect(resolveFirstNightMathematicianTrueCountFromState(state)).toMatchObject({ status: "RESOLVED", trueCount: 1, qualifyingAbnormalFactIds: ["first-night-ability-outcome-fact-v1:event-20", "first-night-ability-outcome-fact-v1:event-21"] });
  });

  it("returns UNRESOLVED without inventing a final count", () => {
    const unresolved = { ...fact(), outcomeStatus: "UNRESOLVED" as const, causeKind: "VORTOX_APPLICABILITY_NOT_PROVEN" as const };
    const state = { lastEventSequence: 30, firstNightAbilityOutcomeLedger: ledger([unresolved]), firstNightTaskPlan: { taskPlanVersion: "first-night-task-plan-v1", tasks: [{ taskId: scheduledTaskId("math-task"), taskType: "MATHEMATICIAN_INFORMATION", source: { kind: "ROLE", playerId: playerId("math-player"), seatNumber: 12, role: { roleId: roleId("mathematician") } } }] }, firstNightTaskProgress: { settlements: [] } } as unknown as GameState;
    const result = resolveFirstNightMathematicianTrueCountFromState(state);
    expect(result).toMatchObject({ status: "UNRESOLVED", currentPartialCount: 0 });
    expect(result).not.toHaveProperty("trueCount");
  });
});
