import { describe, expect, it } from "vitest";
import {
  DomainError,
  CANONICAL_ROLE_TENURE_TRACKED_ROLE_IDS,
  RULES_BASELINE_VERSION,
  abilityImpairmentId,
  actionOpportunityId,
  appendPhilosopherGrantedSeamstressAbility,
  applyRoleTenureTransitionFact,
  bootstrapRoleTenuresFromCharactersAssigned,
  bootstrapSeamstressAbilityState,
  canonicalizeSeamstressTargets,
  cloneRoleTenureState,
  cloneFirstNightActionOpportunityState,
  createSeamstressActionDeferredPayloadV2,
  createSeamstressAbilitySpentPayload,
  createSeamstressInformationDeliveredPayload,
  createSeamstressInformationDeliveredScheduledTaskSettlement,
  createSeamstressResolutionCapabilityDeclaredPayload,
  createSeamstressTargetsChosenPayload,
  eventId,
  formatBaseSeamstressAbilityInstanceId,
  formatPhilosopherGrantedSeamstressAbilityInstanceId,
  formatRoleTenureId,
  formatRoleTenureTransitionFactId,
  formatSeamstressAbilityUseEntitlementId,
  formatSeamstressAnswerCandidateId,
  findUniqueActiveRoleTenure,
  grantedAbilityId,
  isRoleTenureContinuousAcross,
  isRoleTenureActiveAt,
  isCanonicalRoleTenureTrackedRoleId,
  isSeamstressActionOpportunityV2,
  parseRoleTenureId,
  parseRoleTenureTransitionFactId,
  parseSeamstressAbilityInstanceId,
  parseSeamstressAbilityUseEntitlementId,
  parseSeamstressAnswerCandidateId,
  playerId,
  reconcileSeamstressAbilityStateWithRoleTenures,
  resolveSeamstressDeliveryConstraint,
  resolveSeamstressSourceEffectiveness,
  roleId,
  sameOpportunityCore,
  scheduledTaskId,
  seatNumber,
  spendSeamstressAbilityEntitlement,
  validateRoleTenureTransitionFact,
  validateRoleTenureStateAgainstCurrentCharacterState,
  validateRoleTenureStateExact,
  validateSeamstressActionDecisionForOpportunity,
  validateSeamstressChoiceSpendChain,
  validateSeamstressInformationAgainstCanonicalState,
  validateSeamstressInformationDeliveredPayloadShape,
  validateSeamstressResolutionCapabilityDeclaredPayload,
  validateSeamstressTargetsChosenPayloadShape,
  validateStoredSeamstressInformationDelivered
} from "@botc/domain-core";
import type {
  AbilityImpairmentSet,
  CharacterAssignmentSet,
  CurrentCharacterStateSet,
  DomainErrorCode,
  PhilosopherGrantedAbility,
  RoleSetupSnapshot,
  RoleTenureRecord,
  RoleTenureState,
  RoleTenureTransitionFact,
  SeamstressAbilityState,
  SeamstressActionOpportunityV1,
  SeamstressActionOpportunityV2,
  SeamstressTargetsChosenPayload
} from "@botc/domain-core";

const role = (
  id: string,
  characterType: RoleSetupSnapshot["characterType"] = "TOWNSFOLK",
  defaultAlignment: RoleSetupSnapshot["defaultAlignment"] = "GOOD"
): RoleSetupSnapshot => ({
  roleId: roleId(id),
  characterType,
  defaultAlignment,
  edition: "sects-and-violets",
  setupModifier: { outsiderDelta: 0, townsfolkDelta: 0 }
});

const seamstressRole = role("seamstress");
const philosopherRole = role("philosopher");
const vortoxRole = role("vortox", "DEMON", "EVIL");
const dreamerRole = role("dreamer");
const witchRole = role("witch", "MINION", "EVIL");

const assignments: CharacterAssignmentSet = [
  { playerId: playerId("target-good"), seatNumber: seatNumber(1), role: dreamerRole },
  { playerId: playerId("target-evil"), seatNumber: seatNumber(2), role: witchRole },
  { playerId: playerId("source-seamstress"), seatNumber: seatNumber(3), role: seamstressRole },
  { playerId: playerId("current-vortox"), seatNumber: seatNumber(4), role: vortoxRole },
  { playerId: playerId("source-philosopher"), seatNumber: seatNumber(5), role: philosopherRole }
];

const bootstrapTenures = (): RoleTenureState => bootstrapRoleTenuresFromCharactersAssigned({
  assignments,
  sourceEventId: eventId("characters-assigned-event"),
  sourceEventSequence: 10
});

const characterState = (
  revision = 1,
  firstAlignment: "GOOD" | "EVIL" = "GOOD",
  secondAlignment: "GOOD" | "EVIL" = "EVIL",
  withVortox = false
): CurrentCharacterStateSet => ({
  revision,
  entries: [
    { playerId: playerId("target-good"), seatNumber: seatNumber(1), role: dreamerRole, currentAlignment: firstAlignment },
    { playerId: playerId("target-evil"), seatNumber: seatNumber(2), role: witchRole, currentAlignment: secondAlignment },
    { playerId: playerId("source-seamstress"), seatNumber: seatNumber(3), role: seamstressRole, currentAlignment: "GOOD" },
    ...(withVortox
      ? [{ playerId: playerId("current-vortox"), seatNumber: seatNumber(4), role: vortoxRole, currentAlignment: "EVIL" as const }]
      : []),
    { playerId: playerId("source-philosopher"), seatNumber: seatNumber(5), role: philosopherRole, currentAlignment: "GOOD" }
  ]
});

const baseAbility = (tenures = bootstrapTenures()): {
  readonly tenure: RoleTenureRecord;
  readonly state: SeamstressAbilityState;
  readonly instance: SeamstressAbilityState["instances"][number];
  readonly entitlement: SeamstressAbilityState["entitlements"][number];
} => {
  const tenure = tenures.records.find((entry) => entry.roleId === "seamstress");
  const state = bootstrapSeamstressAbilityState(tenures);
  const instance = state.instances[0];
  const entitlement = state.entitlements[0];
  if (tenure === undefined || instance === undefined || entitlement === undefined) {
    throw new Error("Expected base Seamstress tenure and ability");
  }
  return { tenure, state, instance, entitlement };
};

const choiceAt = (
  currentCharacterState: CurrentCharacterStateSet,
  targetPlayerIds = [playerId("target-evil"), playerId("target-good")] as const,
  tenures = bootstrapTenures()
): { readonly choice: SeamstressTargetsChosenPayload; readonly tenure: RoleTenureRecord; readonly ability: ReturnType<typeof baseAbility> } => {
  const ability = baseAbility(tenures);
  const choice = createSeamstressTargetsChosenPayload({
    rulesBaselineVersion: RULES_BASELINE_VERSION,
    taskId: scheduledTaskId("first-night-v1:SEAMSTRESS_ACTION:seat-03"),
    opportunityId: actionOpportunityId("first-night-v1:SEAMSTRESS_ACTION:seat-03:opportunity-01"),
    abilityInstanceId: ability.instance.abilityInstanceId,
    abilityUseEntitlementId: ability.entitlement.abilityUseEntitlementId,
    sourceRoleTenureId: ability.tenure.roleTenureId,
    sourcePlayerId: playerId("source-seamstress"),
    sourceSeatNumber: seatNumber(3),
    sourceRole: seamstressRole,
    opportunityCharacterStateRevision: 1,
    currentCharacterState,
    targetPlayerIds
  });
  return { choice, tenure: ability.tenure, ability };
};

const sourceImpairment = (revision = 1): AbilityImpairmentSet => ({
  impairments: [{
    impairmentId: abilityImpairmentId(`source-drunk-${revision}`),
    kind: "DRUNK",
    sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE",
    sourcePlayerId: playerId("source-philosopher"),
    affectedPlayerId: playerId("source-seamstress"),
    affectedSeatNumber: seatNumber(3),
    affectedRole: seamstressRole,
    chosenRoleId: roleId("seamstress"),
    sourceCharacterStateRevision: revision
  }]
});

const vortoxImpairment = (input: {
  readonly affectedPlayerId?: string;
  readonly revision: number;
}): AbilityImpairmentSet => ({
  impairments: [{
    impairmentId: abilityImpairmentId(`vortox-poison-${input.affectedPlayerId ?? "current-vortox"}-${input.revision}`),
    kind: "POISONED",
    sourceKind: "SNAKE_CHARMER_DEMON_HIT",
    sourcePlayerId: playerId("snake-charmer"),
    affectedPlayerId: playerId(input.affectedPlayerId ?? "current-vortox"),
    affectedSeatNumber: seatNumber(input.affectedPlayerId === "wrong-player" ? 6 : 4),
    affectedRole: vortoxRole,
    sourceCharacterStateRevision: input.revision
  }]
});

const transition = (input: {
  readonly sequence: number;
  readonly previousRevision: number;
  readonly nextRevision: number;
  readonly beforeRole: RoleSetupSnapshot;
  readonly afterRole: RoleSetupSnapshot;
}): RoleTenureTransitionFact => ({
  transitionFactId: formatRoleTenureTransitionFactId({
    sourceEventSequence: input.sequence,
    seatNumber: seatNumber(3),
    nextCharacterStateRevision: input.nextRevision
  }),
  sourceEventId: eventId(`synthetic-role-transition-${input.sequence}`),
  sourceEventSequence: input.sequence,
  playerId: playerId("source-seamstress"),
  seatNumber: seatNumber(3),
  previousCharacterStateRevision: input.previousRevision,
  nextCharacterStateRevision: input.nextRevision,
  beforeRole: input.beforeRole,
  afterRole: input.afterRole
});

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

describe("Seamstress v3 domain model", () => {
  it("declares only the exact public Sects & Violets capability literal and shape", () => {
    const capability = createSeamstressResolutionCapabilityDeclaredPayload(RULES_BASELINE_VERSION);

    expect(capability.scriptId).toBe("sects-and-violets");
    expect(validateSeamstressResolutionCapabilityDeclaredPayload(capability)).toStrictEqual({ valid: true });
    for (const alias of ["sects_and_violets", "Sects-And-Violets", " sects-and-violets "]) {
      expect(validateSeamstressResolutionCapabilityDeclaredPayload({ ...capability, scriptId: alias })).toMatchObject({ valid: false });
    }
    expect(validateSeamstressResolutionCapabilityDeclaredPayload({ ...capability, hidden: true })).toMatchObject({ valid: false });
  });

  it("round-trips canonical tenure, transition, instance, entitlement, and candidate IDs", () => {
    const tenureId = formatRoleTenureId({ seatNumber: seatNumber(3), roleId: "seamstress", acquiredCharacterStateRevision: 1 });
    const factId = formatRoleTenureTransitionFactId({ sourceEventSequence: 20, seatNumber: seatNumber(3), nextCharacterStateRevision: 2 });
    const instanceId = formatBaseSeamstressAbilityInstanceId(tenureId);
    const entitlementId = formatSeamstressAbilityUseEntitlementId(instanceId);
    const candidateId = formatSeamstressAnswerCandidateId({
      opportunityId: actionOpportunityId("first-night-v1:SEAMSTRESS_ACTION:seat-03:opportunity-01"),
      answer: "YES"
    });

    expect(parseRoleTenureId(tenureId)).toMatchObject({ valid: true, seatNumber: 3, roleId: "seamstress", acquiredCharacterStateRevision: 1 });
    expect(parseRoleTenureTransitionFactId(factId)).toMatchObject({ valid: true, sourceEventSequence: 20, seatNumber: 3, nextCharacterStateRevision: 2 });
    expect(parseSeamstressAbilityInstanceId(instanceId)).toMatchObject({ valid: true, sourceKind: "ROLE_TENURE", sourceRoleTenureId: tenureId });
    expect(parseSeamstressAbilityUseEntitlementId(entitlementId)).toStrictEqual({ valid: true, abilityInstanceId: instanceId });
    expect(parseSeamstressAnswerCandidateId(candidateId)).toMatchObject({ valid: true, answer: "YES" });
    expect(instanceId).not.toContain("task");

    for (const invalid of [
      "role-tenure-v1:seat-3:role-seamstress:acquired-revision-1",
      "role-tenure-v1:seat-03:role-seamstress:acquired-revision-01",
      "role-tenure-v1:seat-13:role-seamstress:acquired-revision-1",
      "role-tenure-v1:seat-03:role-snake_charmer:acquired-revision-1"
    ]) expect(parseRoleTenureId(invalid)).toMatchObject({ valid: false });
    expect(parseRoleTenureId("role-tenure-v1:seat-03:role-dreamer:acquired-revision-1"))
      .toMatchObject({ valid: true, roleId: "dreamer" });
    expect(parseSeamstressAbilityInstanceId("seamstress-ability-instance-v1:ROLE_TENURE:seat-03:role-philosopher:acquired-revision-1"))
      .toMatchObject({ valid: false });
  });

  it("bootstraps only relevant role tenures in stable seat order and one base entitlement", () => {
    const tenures = bootstrapTenures();
    const ability = bootstrapSeamstressAbilityState(tenures);

    expect(tenures.records.map((entry) => [entry.seatNumber, entry.roleId])).toStrictEqual([
      [1, "dreamer"],
      [3, "seamstress"],
      [4, "vortox"],
      [5, "philosopher"]
    ]);
    expect(ability.instances).toHaveLength(1);
    expect(ability.entitlements).toStrictEqual([{
      abilityUseEntitlementId: formatSeamstressAbilityUseEntitlementId(ability.instances[0]!.abilityInstanceId),
      abilityInstanceId: ability.instances[0]!.abilityInstanceId,
      entitlementKind: "BASE_ONCE_PER_GAME",
      status: "UNSPENT"
    }]);
  });

  it("[D19T-001..009, D19T-021] treats Dreamer as a canonical tracked tenure at assignment revision one", () => {
    const tenures = bootstrapTenures();
    const dreamer = tenures.records.find((entry) => entry.roleId === "dreamer")!;

    expect(CANONICAL_ROLE_TENURE_TRACKED_ROLE_IDS).toStrictEqual([
      "cerenovus", "dreamer", "mathematician", "philosopher", "seamstress", "vortox"
    ]);
    expect(isCanonicalRoleTenureTrackedRoleId("dreamer")).toBe(true);
    for (const alias of ["Dreamer", " dreamer", "dreamer ", "snake_charmer"]) {
      expect(isCanonicalRoleTenureTrackedRoleId(alias)).toBe(false);
    }
    for (const invalidId of [
      "role-tenure-v1:seat-01:role-Dreamer:acquired-revision-1",
      "role-tenure-v1:seat-01:role-dreamer_:acquired-revision-1",
      "role-tenure-v1:seat-01:role-dreamer:acquired-revision-1:extra",
      `role-tenure-v1:seat-01:role-dreamer:acquired-revision-${Number.MAX_SAFE_INTEGER + 1}`
    ]) {
      expect(parseRoleTenureId(invalidId)).toMatchObject({ valid: false });
    }
    expect(validateRoleTenureStateExact(tenures)).toStrictEqual({ valid: true });
    expect(dreamer).toMatchObject({
      playerId: "target-good",
      seatNumber: 1,
      acquiredCharacterStateRevision: 1,
      startedBy: { kind: "CHARACTERS_ASSIGNED", sourceEventId: "characters-assigned-event", sourceEventSequence: 10 }
    });
    expect(isRoleTenureActiveAt(dreamer, 1)).toBe(true);
    expect(parseRoleTenureId(dreamer.roleTenureId)).toMatchObject({ valid: true, roleId: "dreamer" });
    expectDomainCode(() => bootstrapRoleTenuresFromCharactersAssigned({
      assignments: [...assignments, { playerId: playerId("duplicate-role"), seatNumber: seatNumber(6), role: dreamerRole }],
      sourceEventId: eventId("characters-assigned-event"),
      sourceEventSequence: 10
    }), "InvalidRoleTenureState");
    for (const invalidInput of [
      {
        assignments: [assignments[0]!, { ...assignments[1]!, playerId: assignments[0]!.playerId }],
        sourceEventId: eventId("characters-assigned-event"), sourceEventSequence: 10
      },
      {
        assignments: [assignments[0]!, { ...assignments[1]!, seatNumber: assignments[0]!.seatNumber }],
        sourceEventId: eventId("characters-assigned-event"), sourceEventSequence: 10
      },
      { assignments, sourceEventId: eventId("characters-assigned-event"), sourceEventSequence: 0 },
      { assignments, sourceEventId: eventId("characters-assigned-event"), sourceEventSequence: Number.MAX_SAFE_INTEGER + 1 }
    ]) {
      expectDomainCode(() => bootstrapRoleTenuresFromCharactersAssigned(invalidInput), "InvalidRoleTenureState");
    }
    const sparseAssignments = new Array<(typeof assignments)[number]>(2);
    sparseAssignments[1] = assignments[0]!;
    expectDomainCode(() => bootstrapRoleTenuresFromCharactersAssigned({
      assignments: sparseAssignments,
      sourceEventId: eventId("characters-assigned-event"),
      sourceEventSequence: 10
    }), "InvalidRoleTenureState");
  });

  it("[D19T-010..015, D19T-022..023, D19T-041] reconciles Dreamer enter, leave, and half-open intervals immutably", () => {
    const empty = bootstrapRoleTenuresFromCharactersAssigned({
      assignments: [{ playerId: playerId("target-evil"), seatNumber: seatNumber(2), role: witchRole }],
      sourceEventId: eventId("single-assignment"),
      sourceEventSequence: 10
    });
    const enter: RoleTenureTransitionFact = {
      transitionFactId: formatRoleTenureTransitionFactId({ sourceEventSequence: 20, seatNumber: seatNumber(2), nextCharacterStateRevision: 2 }),
      sourceEventId: eventId("enter-dreamer"), sourceEventSequence: 20,
      playerId: playerId("target-evil"), seatNumber: seatNumber(2),
      previousCharacterStateRevision: 1, nextCharacterStateRevision: 2,
      beforeRole: witchRole, afterRole: dreamerRole
    };
    const entered = applyRoleTenureTransitionFact(empty, enter);
    const dreamer = entered.records[0]!;
    const leave: RoleTenureTransitionFact = {
      transitionFactId: formatRoleTenureTransitionFactId({ sourceEventSequence: 21, seatNumber: seatNumber(2), nextCharacterStateRevision: 3 }),
      sourceEventId: eventId("leave-dreamer"), sourceEventSequence: 21,
      playerId: playerId("target-evil"), seatNumber: seatNumber(2),
      previousCharacterStateRevision: 2, nextCharacterStateRevision: 3,
      beforeRole: dreamerRole, afterRole: witchRole
    };
    const left = applyRoleTenureTransitionFact(entered, leave);
    const closed = left.records[0]!;

    expect(empty).toStrictEqual({ records: [], processedTransitionFactIds: [] });
    expect(dreamer.startedBy).toMatchObject({
      kind: "ROLE_TENURE_TRANSITION", transitionFactId: enter.transitionFactId,
      sourceEventId: enter.sourceEventId, previousCharacterStateRevision: 1, nextCharacterStateRevision: 2
    });
    expect(isRoleTenureActiveAt(dreamer, 1)).toBe(false);
    expect(isRoleTenureActiveAt(dreamer, 2)).toBe(true);
    expect(isRoleTenureActiveAt(closed, 3)).toBe(false);
    expect(isRoleTenureContinuousAcross(closed, 2, 2)).toBe(true);
    expect(isRoleTenureContinuousAcross(closed, 2, 3)).toBe(false);
    expect(validateRoleTenureStateExact(left)).toStrictEqual({ valid: true });
    expectDomainCode(() => applyRoleTenureTransitionFact(left, leave), "InvalidRoleTenureState");

    const trackedInitial = bootstrapTenures();
    const trackedToDreamer = transition({
      sequence: 30, previousRevision: 1, nextRevision: 2,
      beforeRole: seamstressRole, afterRole: dreamerRole
    });
    const dreamerState = applyRoleTenureTransitionFact(trackedInitial, trackedToDreamer);
    const endedSeamstress = dreamerState.records.find((record) => record.roleId === "seamstress")!;
    const dreamerSuccessor = dreamerState.records.find((record) =>
      record.seatNumber === 3 && record.roleId === "dreamer" && record.acquiredCharacterStateRevision === 2)!;
    expect(endedSeamstress.endedCharacterStateRevision).toBe(2);
    expect(dreamerSuccessor.startedBy).toStrictEqual({
      kind: "ROLE_TENURE_TRANSITION",
      transitionFactId: trackedToDreamer.transitionFactId,
      sourceEventId: trackedToDreamer.sourceEventId,
      sourceEventSequence: trackedToDreamer.sourceEventSequence,
      previousCharacterStateRevision: 1,
      nextCharacterStateRevision: 2
    });
    expect(trackedInitial.records.find((record) => record.roleId === "seamstress")?.endedCharacterStateRevision)
      .toBeUndefined();

    const dreamerToTracked = transition({
      sequence: 31, previousRevision: 2, nextRevision: 3,
      beforeRole: dreamerRole, afterRole: seamstressRole
    });
    const trackedAgain = applyRoleTenureTransitionFact(dreamerState, dreamerToTracked);
    const endedDreamer = trackedAgain.records.find((record) => record.roleTenureId === dreamerSuccessor.roleTenureId)!;
    const seamstressSuccessor = trackedAgain.records.find((record) =>
      record.seatNumber === 3 && record.roleId === "seamstress" && record.acquiredCharacterStateRevision === 3)!;
    expect(endedDreamer.endedCharacterStateRevision).toBe(3);
    expect(seamstressSuccessor.startedBy).toMatchObject({
      kind: "ROLE_TENURE_TRANSITION",
      transitionFactId: dreamerToTracked.transitionFactId,
      sourceEventId: dreamerToTracked.sourceEventId,
      sourceEventSequence: 31,
      previousCharacterStateRevision: 2,
      nextCharacterStateRevision: 3
    });
    expect(validateRoleTenureStateExact(trackedAgain)).toStrictEqual({ valid: true });
    expect(dreamerState.records.find((record) => record.roleTenureId === dreamerSuccessor.roleTenureId)
      ?.endedCharacterStateRevision).toBeUndefined();
  });

  it("[D19T-018, D19T-024, D19T-040, D19T-042] exact-validates topology and returns only deep-cloned unique active records", () => {
    const state = bootstrapTenures();
    const clone = cloneRoleTenureState(state);
    const found = findUniqueActiveRoleTenure({
      state, playerId: playerId("target-good"), seatNumber: seatNumber(1), roleId: "dreamer", revision: 1
    });

    expect(clone).toStrictEqual(state);
    expect(clone).not.toBe(state);
    expect(clone.records).not.toBe(state.records);
    expect(clone.records[0]?.startedBy).not.toBe(state.records[0]?.startedBy);
    expect(found).toStrictEqual(state.records[0]);
    expect(found).not.toBe(state.records[0]);
    expect(findUniqueActiveRoleTenure({
      state, playerId: playerId("missing"), seatNumber: seatNumber(6), roleId: "dreamer", revision: 1
    })).toBeUndefined();

    const duplicateId = { records: [...state.records, { ...state.records[0] }], processedTransitionFactIds: [] };
    expect(validateRoleTenureStateExact(duplicateId)).toMatchObject({ valid: false });

    const enterDreamer = transition({ sequence: 20, previousRevision: 1, nextRevision: 2, beforeRole: seamstressRole, afterRole: dreamerRole });
    const transitioned = applyRoleTenureTransitionFact(state, enterDreamer);
    const overlapping = {
      ...transitioned,
      records: transitioned.records.map((record) => record.roleId === "seamstress"
        ? { roleTenureId: record.roleTenureId, playerId: record.playerId, seatNumber: record.seatNumber,
            roleId: record.roleId, acquiredCharacterStateRevision: record.acquiredCharacterStateRevision,
            startedBy: { ...record.startedBy } }
        : { ...record, startedBy: { ...record.startedBy } })
    };
    expect(validateRoleTenureStateExact(overlapping)).toMatchObject({ valid: false });
    expectDomainCode(() => findUniqueActiveRoleTenure({
      state: overlapping, playerId: playerId("source-seamstress"), seatNumber: seatNumber(3),
      roleId: "dreamer", revision: 2
    }), "InvalidRoleTenureState");
  });

  it("[D19T-020] requires bidirectional correspondence with exact current character state", () => {
    const tenures = bootstrapTenures();
    expect(validateRoleTenureStateAgainstCurrentCharacterState({
      roleTenures: tenures,
      currentCharacterState: characterState(1, "GOOD", "EVIL", true)
    })).toStrictEqual({ valid: true });
    expect(validateRoleTenureStateAgainstCurrentCharacterState({
      roleTenures: tenures,
      currentCharacterState: {
        ...characterState(1, "GOOD", "EVIL", true),
        entries: characterState(1, "GOOD", "EVIL", true).entries.map((entry) =>
          entry.seatNumber === 1 ? { ...entry, role: witchRole } : entry)
      }
    })).toMatchObject({ valid: false });
  });

  it("[D19T-031..039] rejects hostile raw states before clone, search, or getter invocation", () => {
    const validFact = transition({ sequence: 20, previousRevision: 1, nextRevision: 2, beforeRole: seamstressRole, afterRole: dreamerRole });
    expectDomainCode(() => applyRoleTenureTransitionFact(undefined, validFact), "InvalidRoleTenureState");
    const rawExtraState = { ...bootstrapTenures(), extra: "raw-only-invalidity" };
    const rawExtraSnapshot = structuredClone(rawExtraState);
    expect(validateRoleTenureStateExact(rawExtraState)).toMatchObject({ valid: false });
    expect(validateRoleTenureStateExact(cloneRoleTenureState(rawExtraState))).toStrictEqual({ valid: true });
    expectDomainCode(() => applyRoleTenureTransitionFact(rawExtraState, validFact), "InvalidRoleTenureState");
    expect(rawExtraState).toStrictEqual(rawExtraSnapshot);

    const sparseRecords = new Array(2);
    sparseRecords[1] = bootstrapTenures().records[0];
    expect(validateRoleTenureStateExact({ records: sparseRecords, processedTransitionFactIds: [] })).toMatchObject({ valid: false });
    const sparseIds = new Array(1);
    expect(validateRoleTenureStateExact({ records: [], processedTransitionFactIds: sparseIds })).toMatchObject({ valid: false });

    let getterCalls = 0;
    const accessor = Object.defineProperty({ processedTransitionFactIds: [] }, "records", {
      enumerable: true, get: () => { getterCalls += 1; return []; }
    });
    expect(validateRoleTenureStateExact(accessor)).toMatchObject({ valid: false });
    expect(getterCalls).toBe(0);

    const transparentProxy = new Proxy({ records: [], processedTransitionFactIds: [] }, {});
    expect(validateRoleTenureStateExact(transparentProxy)).toMatchObject({ valid: false });
    const revocable = Proxy.revocable({ records: [], processedTransitionFactIds: [] }, {});
    revocable.revoke();
    expect(validateRoleTenureStateExact(revocable.proxy)).toMatchObject({ valid: false });
    const cyclic: { records: unknown[]; processedTransitionFactIds: unknown[]; self?: unknown } = {
      records: [], processedTransitionFactIds: []
    };
    cyclic.self = cyclic;
    expect(validateRoleTenureStateExact(cyclic)).toMatchObject({ valid: false });
  });

  it("[D19T-018, D19T-031..038] exact validator rejects representative hostile shapes and topologies", () => {
    const base = bootstrapTenures();
    const baseDreamer = base.records.find((record) => record.roleId === "dreamer")!;
    const transitioned = applyRoleTenureTransitionFact(base, transition({
      sequence: 40, previousRevision: 1, nextRevision: 2,
      beforeRole: seamstressRole, afterRole: dreamerRole
    }));
    const processedId = transitioned.processedTransitionFactIds[0]!;
    const duplicateProcessed = {
      ...transitioned,
      processedTransitionFactIds: [processedId, processedId]
    };
    expect(validateRoleTenureStateExact(duplicateProcessed)).toMatchObject({ valid: false });

    const closedOverlap = {
      ...transitioned,
      records: transitioned.records.map((record) => record.roleId === "seamstress"
        ? { ...record, endedCharacterStateRevision: 4 }
        : record)
    };
    const duplicateActive = {
      ...transitioned,
      records: transitioned.records.map((record) => record.roleId === "seamstress"
        ? {
            roleTenureId: record.roleTenureId,
            playerId: record.playerId,
            seatNumber: record.seatNumber,
            roleId: record.roleId,
            acquiredCharacterStateRevision: record.acquiredCharacterStateRevision,
            startedBy: { ...record.startedBy }
          }
        : record)
    };
    const nonPlain = cloneRoleTenureState(base);
    Object.setPrototypeOf(nonPlain, { hostilePrototype: true });
    const symbolKey = { ...base, [Symbol("hostile")]: true };
    const hostileStates: readonly unknown[] = [
      null,
      false,
      "role-tenure-state",
      1,
      1n,
      Symbol("hostile"),
      () => undefined,
      [base],
      nonPlain,
      { records: base.records },
      symbolKey,
      { records: [{}], processedTransitionFactIds: [] },
      { records: [{ ...baseDreamer, startedBy: { kind: "CHARACTERS_ASSIGNED" } }], processedTransitionFactIds: [] },
      { records: [{ ...baseDreamer, playerId: "" }], processedTransitionFactIds: [] },
      { records: [{ ...baseDreamer, seatNumber: 0 }], processedTransitionFactIds: [] },
      { records: [{ ...baseDreamer, roleId: "snake_charmer" }], processedTransitionFactIds: [] },
      { records: [{ ...baseDreamer, roleTenureId: "noncanonical-tenure-id" }], processedTransitionFactIds: [] },
      { records: [{ ...baseDreamer, acquiredCharacterStateRevision: Number.MAX_SAFE_INTEGER + 1 }], processedTransitionFactIds: [] },
      { records: [{ ...baseDreamer, acquiredCharacterStateRevision: -0 }], processedTransitionFactIds: [] },
      closedOverlap,
      duplicateActive
    ];
    for (const hostile of hostileStates) {
      expect(validateRoleTenureStateExact(hostile)).toMatchObject({ valid: false });
    }
  });

  it("[D19T-044..045] classifies malformed facts and direct IDs independently of hostile state", () => {
    const malformed = { ...transition({ sequence: 20, previousRevision: 1, nextRevision: 2, beforeRole: seamstressRole, afterRole: dreamerRole }), extra: true };
    expectDomainCode(
      () => applyRoleTenureTransitionFact(undefined, malformed),
      "InvalidRoleTenureTransitionFact"
    );
    expectDomainCode(
      () => formatRoleTenureId({ seatNumber: seatNumber(3), roleId: "dreamer", acquiredCharacterStateRevision: Number.MAX_SAFE_INTEGER + 1 }),
      "InvalidRoleTenureId"
    );
  });

  it("preserves exact V1/V2 opportunity branches through clone, equality, and decision validation", () => {
    const ability = baseAbility();
    const common = {
      nightNumber: 1 as const,
      opportunityId: actionOpportunityId("first-night-v1:SEAMSTRESS_ACTION:seat-03:opportunity-01"),
      opportunityKind: "SEAMSTRESS_FIRST_NIGHT_ACTION" as const,
      opportunityStatus: "OPEN" as const,
      taskId: scheduledTaskId("first-night-v1:SEAMSTRESS_ACTION:seat-03"),
      taskType: "SEAMSTRESS_ACTION" as const,
      sourcePlayerId: playerId("source-seamstress"),
      sourceSeatNumber: seatNumber(3),
      sourceRole: seamstressRole,
      sourceCharacterStateRevision: 1
    };
    const v1: SeamstressActionOpportunityV1 = {
      ...common,
      visibility: {
        canDefer: true,
        supportedDecisionKinds: ["DEFER"],
        futureUnsupportedDecisionKinds: ["CHOOSE_TWO_PLAYERS"]
      }
    };
    const v2: SeamstressActionOpportunityV2 = {
      ...common,
      sourceRoleTenureId: ability.tenure.roleTenureId,
      abilitySource: { ...ability.instance.source },
      abilityInstanceId: ability.instance.abilityInstanceId,
      abilityUseEntitlementId: ability.entitlement.abilityUseEntitlementId,
      visibility: {
        visibilitySchemaVersion: "seamstress-first-night-action-v2",
        resolutionCapabilityVersion: "seamstress-snv-first-night-resolution-v1",
        canDefer: true,
        canChooseTargets: true,
        supportedDecisionKinds: ["DEFER", "CHOOSE_TWO_PLAYERS"],
        futureUnsupportedDecisionKinds: [],
        targetSchema: "EXACTLY_TWO_DISTINCT_OTHER_MODELED_PLAYERS"
      }
    };
    const cloned = cloneFirstNightActionOpportunityState({ opportunities: [v1, v2] });

    expect(Object.keys(v1)).not.toContain("sourceRoleTenureId");
    expect(Object.keys(v1.visibility)).not.toContain("visibilitySchemaVersion");
    expect(isSeamstressActionOpportunityV2(cloned.opportunities[0]!)).toBe(false);
    expect(isSeamstressActionOpportunityV2(cloned.opportunities[1]!)).toBe(true);
    expect(sameOpportunityCore(cloned.opportunities[0]!, v1)).toBe(true);
    expect(sameOpportunityCore(cloned.opportunities[1]!, v2)).toBe(true);
    expect(sameOpportunityCore(v1, v2)).toBe(false);
    expect(validateSeamstressActionDecisionForOpportunity({ kind: "DEFER" }, v1)).toStrictEqual({ valid: true });
    expect(validateSeamstressActionDecisionForOpportunity({
      kind: "CHOOSE_TWO_PLAYERS",
      targetPlayerIds: [playerId("target-good"), playerId("target-evil")]
    }, v1)).toMatchObject({ valid: false, code: "UnsupportedSeamstressActionDecision" });
    expect(validateSeamstressActionDecisionForOpportunity({
      kind: "CHOOSE_TWO_PLAYERS",
      targetPlayerIds: [playerId("target-good"), playerId("target-evil")]
    }, v2)).toStrictEqual({ valid: true });
    expect(createSeamstressActionDeferredPayloadV2({
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      opportunity: v2,
      settlementCharacterStateRevision: 2
    })).toMatchObject({
      deferSchemaVersion: "seamstress-action-deferred-v2",
      opportunityCharacterStateRevision: 1,
      settlementCharacterStateRevision: 2,
      abilityInstanceId: v2.abilityInstanceId,
      abilityUseEntitlementId: v2.abilityUseEntitlementId
    });
  });

  it("closes the original tenure, creates a fresh reacquired tenure, and rejects duplicate transition facts", () => {
    const initial = bootstrapTenures();
    const leave = transition({ sequence: 20, previousRevision: 1, nextRevision: 2, beforeRole: seamstressRole, afterRole: dreamerRole });
    const reacquire = transition({ sequence: 21, previousRevision: 2, nextRevision: 3, beforeRole: dreamerRole, afterRole: seamstressRole });

    expect(validateRoleTenureTransitionFact(leave)).toStrictEqual({ valid: true });
    const left = applyRoleTenureTransitionFact(initial, leave);
    const reacquired = applyRoleTenureTransitionFact(left, reacquire);
    const initialSeamstress = initial.records.find((entry) => entry.roleId === "seamstress")!;
    const oldTenure = reacquired.records.find((entry) => entry.roleTenureId === initialSeamstress.roleTenureId)!;
    const newTenure = reacquired.records.find((entry) => entry.acquiredCharacterStateRevision === 3)!;

    expect(oldTenure.endedCharacterStateRevision).toBe(2);
    expect(isRoleTenureContinuousAcross(oldTenure, 1, 1)).toBe(true);
    expect(isRoleTenureContinuousAcross(oldTenure, 1, 3)).toBe(false);
    expect(newTenure.roleTenureId).toBe(formatRoleTenureId({ seatNumber: seatNumber(3), roleId: "seamstress", acquiredCharacterStateRevision: 3 }));
    expect(() => applyRoleTenureTransitionFact(reacquired, reacquire)).toThrowError(DomainError);

    const reconciled = reconcileSeamstressAbilityStateWithRoleTenures(bootstrapSeamstressAbilityState(initial), reacquired);
    expect(reconciled.instances).toHaveLength(2);
    expect(reconciled.instances[0]?.endedCharacterStateRevision).toBe(2);
    expect(reconciled.instances[1]?.acquiredCharacterStateRevision).toBe(3);
    expect(reconciled.instances[0]?.abilityInstanceId).not.toBe(reconciled.instances[1]?.abilityInstanceId);
  });

  it("derives distinct Philosopher-granted instances from distinct source tenures", () => {
    const firstTenure = bootstrapTenures().records.find((entry) => entry.roleId === "philosopher")!;
    const secondTenure: RoleTenureRecord = {
      ...firstTenure,
      roleTenureId: formatRoleTenureId({ seatNumber: seatNumber(5), roleId: "philosopher", acquiredCharacterStateRevision: 3 }),
      acquiredCharacterStateRevision: 3,
      startedBy: {
        kind: "ROLE_TENURE_TRANSITION",
        transitionFactId: formatRoleTenureTransitionFactId({ sourceEventSequence: 30, seatNumber: seatNumber(5), nextCharacterStateRevision: 3 }),
        sourceEventId: eventId("philosopher-reacquired"),
        sourceEventSequence: 30,
        previousCharacterStateRevision: 2,
        nextCharacterStateRevision: 3
      }
    };
    const grantFor = (tenure: RoleTenureRecord): PhilosopherGrantedAbility => ({
      grantId: grantedAbilityId("philosopher-grant-v1:seat-05:from-seamstress"),
      sourcePlayerId: tenure.playerId,
      sourceSeatNumber: tenure.seatNumber,
      sourceRole: philosopherRole,
      sourceCharacterStateRevision: tenure.acquiredCharacterStateRevision,
      chosenRole: seamstressRole,
      chosenRoleId: roleId("seamstress"),
      chosenRoleCatalogSignature: "canonical-role-catalog-v1:60ac4718",
      grantedAtTaskId: scheduledTaskId("first-night-v1:PHILOSOPHER_ACTION:seat-05"),
      grantedAtOpportunityId: actionOpportunityId("first-night-v1:PHILOSOPHER_ACTION:seat-05:opportunity-01")
    });
    const firstId = formatPhilosopherGrantedSeamstressAbilityInstanceId({
      sourceRoleTenureId: firstTenure.roleTenureId,
      grantId: grantFor(firstTenure).grantId,
      grant: grantFor(firstTenure),
      tenure: firstTenure
    });
    const secondId = formatPhilosopherGrantedSeamstressAbilityInstanceId({
      sourceRoleTenureId: secondTenure.roleTenureId,
      grantId: grantFor(secondTenure).grantId,
      grant: grantFor(secondTenure),
      tenure: secondTenure
    });

    expect(firstId).not.toBe(secondId);
    expect(parseSeamstressAbilityInstanceId(firstId)).toMatchObject({ valid: true, sourceKind: "PHILOSOPHER_GRANT", acquiredCharacterStateRevision: 1 });
    expect(parseSeamstressAbilityInstanceId(secondId)).toMatchObject({ valid: true, sourceKind: "PHILOSOPHER_GRANT", acquiredCharacterStateRevision: 3 });

    const withGrant = appendPhilosopherGrantedSeamstressAbility({
      state: bootstrapSeamstressAbilityState(bootstrapTenures()),
      roleTenures: bootstrapTenures(),
      grant: grantFor(firstTenure)
    });
    expect(withGrant.instances.map((entry) => entry.source.kind)).toStrictEqual(["ROLE_TENURE", "PHILOSOPHER_GRANT"]);
  });

  it("canonicalizes exactly two distinct non-self modeled targets by seat", () => {
    const state = characterState();
    expect(canonicalizeSeamstressTargets({
      sourcePlayerId: playerId("source-seamstress"),
      targetPlayerIds: [playerId("target-evil"), playerId("target-good")],
      currentCharacterState: state
    })).toStrictEqual({
      valid: true,
      targetPlayerIds: [playerId("target-good"), playerId("target-evil")],
      targetSeatNumbers: [1, 2]
    });
    for (const targets of [
      [playerId("target-good"), playerId("target-good")],
      [playerId("source-seamstress"), playerId("target-good")],
      [playerId("unknown"), playerId("target-good")]
    ] as const) {
      expect(canonicalizeSeamstressTargets({ sourcePlayerId: playerId("source-seamstress"), targetPlayerIds: targets, currentCharacterState: state }))
        .toMatchObject({ valid: false });
    }
  });

  it("uses settlement-time native alignments and keeps comparison, candidates, reliability, and simulation separate", () => {
    const tenures = bootstrapTenures();
    const { choice, tenure } = choiceAt(characterState(2, "GOOD", "GOOD"), undefined, tenures);
    const spend = createSeamstressAbilitySpentPayload(choice);
    const delivery = createSeamstressInformationDeliveredPayload({
      choice,
      currentCharacterState: characterState(2, "GOOD", "GOOD"),
      sourceRoleTenure: tenure,
      roleTenures: tenures,
      abilityImpairments: undefined
    });

    expect(choice.opportunityCharacterStateRevision).toBe(1);
    expect(choice.settlementCharacterStateRevision).toBe(2);
    expect(delivery.comparison.ruleCorrectAnswer).toBe("YES");
    expect(delivery.sourceEffectiveness.kind).toBe("NOT_PROVEN");
    expect(delivery.deliveryConstraint).toStrictEqual({ kind: "NONE" });
    expect(delivery.answerCandidateSet.legalityKnowledge).toMatchObject({ kind: "PARTIAL" });
    expect(delivery.informationReliability).toBe("RULE_CORRECT_SELECTED_WITH_EFFECTIVENESS_NOT_PROVEN");
    expect(delivery.simulationReason).toBe("TRUTH_FAVORING_DEFAULT");
    expect(delivery.deliveredAnswer).toBe("YES");
    expect(validateSeamstressChoiceSpendChain({ choice, spend })).toStrictEqual({ valid: true });
    expect(validateSeamstressInformationAgainstCanonicalState({
      choice,
      spend,
      delivery,
      currentCharacterState: characterState(2, "GOOD", "GOOD"),
      roleTenures: tenures,
      abilityImpairments: undefined
    })).toStrictEqual({ valid: true });
  });

  it("stores NO for mixed alignment and selects truth under unresolved effectiveness", () => {
    const tenures = bootstrapTenures();
    const { choice, tenure } = choiceAt(characterState());
    const delivery = createSeamstressInformationDeliveredPayload({
      choice,
      currentCharacterState: characterState(),
      sourceRoleTenure: tenure,
      roleTenures: tenures,
      abilityImpairments: undefined
    });

    expect(delivery.comparison.ruleCorrectAnswer).toBe("NO");
    expect(delivery.deliveredAnswer).toBe("NO");
    expect(delivery.answerCandidateSet.candidates).toEqual(expect.arrayContaining([
      expect.objectContaining({ answer: "YES", truthValue: "FALSE" }),
      expect.objectContaining({ answer: "NO", truthValue: "TRUE" })
    ]));
  });

  it("records represented source impairment as known ineffective while still selecting an allowed true answer", () => {
    const tenures = bootstrapTenures();
    const { choice, tenure } = choiceAt(characterState(1, "GOOD", "GOOD"));
    const impairments = sourceImpairment();
    const effectiveness = resolveSeamstressSourceEffectiveness({
      sourcePlayerId: choice.sourcePlayerId,
      sourceSeatNumber: choice.sourceSeatNumber,
      sourceRoleTenure: tenure,
      settlementCharacterStateRevision: 1,
      abilityImpairments: impairments
    });
    const delivery = createSeamstressInformationDeliveredPayload({
      choice,
      currentCharacterState: characterState(1, "GOOD", "GOOD"),
      sourceRoleTenure: tenure,
      roleTenures: tenures,
      abilityImpairments: impairments
    });

    expect(effectiveness).toMatchObject({ kind: "KNOWN_INEFFECTIVE" });
    expect(delivery.answerCandidateSet.legalityKnowledge).toMatchObject({ kind: "COMPLETE" });
    expect(delivery.answerCandidateSet.legalityKnowledge.kind === "COMPLETE"
      ? delivery.answerCandidateSet.legalityKnowledge.legalCandidateIds
      : []).toHaveLength(2);
    expect(delivery.deliveredAnswer).toBe("YES");
    expect(delivery.informationReliability).toBe("RULE_CORRECT_SELECTED_WITH_KNOWN_IMPAIRMENT");
    expect(delivery.simulationReason).toBe("TRUTH_ALLOWED_WHILE_REPRESENTED_IMPAIRED");
  });

  it.each([
    ["correct YES", "GOOD", "GOOD", "NO"],
    ["correct NO", "GOOD", "EVIL", "YES"]
  ] as const)("effective Vortox forces the false-only candidate for %s", (_name, first, second, expected) => {
    const tenures = bootstrapTenures();
    const state = characterState(1, first, second, true);
    const { choice, tenure } = choiceAt(state);
    const delivery = createSeamstressInformationDeliveredPayload({
      choice,
      currentCharacterState: state,
      sourceRoleTenure: tenure,
      roleTenures: tenures,
      abilityImpairments: sourceImpairment()
    });

    expect(delivery.sourceEffectiveness.kind).toBe("KNOWN_INEFFECTIVE");
    expect(delivery.deliveryConstraint).toMatchObject({ kind: "VORTOX_FALSE_REQUIRED", vortoxPlayerId: playerId("current-vortox") });
    expect(delivery.answerCandidateSet.legalityKnowledge).toMatchObject({ kind: "COMPLETE" });
    expect(delivery.deliveredAnswer).toBe(expected);
    expect(delivery.informationReliability).toBe("VORTOX_CONSTRAINED_FALSE");
  });

  it("disables Vortox only for an impairment matching the current Vortox player and tenure window", () => {
    const currentTenure: RoleTenureRecord = {
      roleTenureId: formatRoleTenureId({ seatNumber: seatNumber(4), roleId: "vortox", acquiredCharacterStateRevision: 3 }),
      playerId: playerId("current-vortox"),
      seatNumber: seatNumber(4),
      roleId: "vortox",
      acquiredCharacterStateRevision: 3,
      startedBy: {
        kind: "ROLE_TENURE_TRANSITION",
        transitionFactId: formatRoleTenureTransitionFactId({ sourceEventSequence: 40, seatNumber: seatNumber(4), nextCharacterStateRevision: 3 }),
        sourceEventId: eventId("vortox-reacquired"),
        sourceEventSequence: 40,
        previousCharacterStateRevision: 2,
        nextCharacterStateRevision: 3
      }
    };
    const tenures: RoleTenureState = { records: [baseAbility().tenure, currentTenure], processedTransitionFactIds: [] };
    const state = characterState(5, "GOOD", "GOOD", true);

    expect(resolveSeamstressDeliveryConstraint({ currentCharacterState: state, roleTenures: tenures, abilityImpairments: undefined }))
      .toMatchObject({ kind: "VORTOX_FALSE_REQUIRED" });
    expect(resolveSeamstressDeliveryConstraint({ currentCharacterState: state, roleTenures: tenures, abilityImpairments: vortoxImpairment({ revision: 1 }) }))
      .toMatchObject({ kind: "VORTOX_FALSE_REQUIRED" });
    expect(resolveSeamstressDeliveryConstraint({ currentCharacterState: state, roleTenures: tenures, abilityImpairments: vortoxImpairment({ affectedPlayerId: "wrong-player", revision: 4 }) }))
      .toMatchObject({ kind: "VORTOX_FALSE_REQUIRED" });
    expect(resolveSeamstressDeliveryConstraint({ currentCharacterState: state, roleTenures: tenures, abilityImpairments: vortoxImpairment({ revision: 4 }) }))
      .toStrictEqual({ kind: "NONE" });
  });

  it("spends one entitlement exactly once, including represented-impaired use", () => {
    const { choice, ability } = choiceAt(characterState());
    const spend = createSeamstressAbilitySpentPayload(choice);
    const spent = spendSeamstressAbilityEntitlement(ability.state, spend);

    expect(spent.entitlements[0]?.status).toBe("SPENT");
    expect(() => spendSeamstressAbilityEntitlement(spent, spend)).toThrowError(
      "Seamstress ability entitlement is already spent"
    );
  });

  it("rejects old-tenure settlement after leave and reacquire even when visible role facts match again", () => {
    const initial = bootstrapTenures();
    const leave = transition({ sequence: 20, previousRevision: 1, nextRevision: 2, beforeRole: seamstressRole, afterRole: dreamerRole });
    const reacquire = transition({ sequence: 21, previousRevision: 2, nextRevision: 3, beforeRole: dreamerRole, afterRole: seamstressRole });
    const changedTenures = applyRoleTenureTransitionFact(applyRoleTenureTransitionFact(initial, leave), reacquire);
    const { choice, tenure } = choiceAt(characterState(3, "GOOD", "GOOD"), undefined, initial);
    const spend = createSeamstressAbilitySpentPayload(choice);
    const delivery = createSeamstressInformationDeliveredPayload({
      choice,
      currentCharacterState: characterState(3, "GOOD", "GOOD"),
      sourceRoleTenure: tenure,
      roleTenures: initial,
      abilityImpairments: undefined
    });

    expect(validateSeamstressInformationAgainstCanonicalState({
      choice,
      spend,
      delivery,
      currentCharacterState: characterState(3, "GOOD", "GOOD"),
      roleTenures: changedTenures,
      abilityImpairments: undefined
    })).toMatchObject({ valid: false });
  });

  it("validates exact payload shapes and rejects cross-linked or tampered information dimensions", () => {
    const tenures = bootstrapTenures();
    const { choice, tenure } = choiceAt(characterState());
    const spend = createSeamstressAbilitySpentPayload(choice);
    const delivery = createSeamstressInformationDeliveredPayload({
      choice,
      currentCharacterState: characterState(),
      sourceRoleTenure: tenure,
      roleTenures: tenures,
      abilityImpairments: undefined
    });

    expect(validateSeamstressTargetsChosenPayloadShape(choice)).toStrictEqual({ valid: true });
    expect(validateSeamstressInformationDeliveredPayloadShape(delivery)).toStrictEqual({ valid: true });
    expect(validateSeamstressTargetsChosenPayloadShape({ ...choice, hidden: true })).toMatchObject({ valid: false });
    expect(validateSeamstressInformationDeliveredPayloadShape({ ...delivery, deliveredAnswer: delivery.deliveredAnswer === "YES" ? "NO" : "YES" }))
      .toMatchObject({ valid: false });
    expect(validateSeamstressChoiceSpendChain({ choice, spend: { ...spend, settlementCharacterStateRevision: 2 } }))
      .toMatchObject({ valid: false });
  });

  it("requires exactly one settled historical choice/spend/delivery chain", () => {
    const tenures = bootstrapTenures();
    const { choice, tenure } = choiceAt(characterState());
    const spend = createSeamstressAbilitySpentPayload(choice);
    const delivery = createSeamstressInformationDeliveredPayload({
      choice,
      currentCharacterState: characterState(),
      sourceRoleTenure: tenure,
      roleTenures: tenures,
      abilityImpairments: undefined
    });
    const settlementPayload = createSeamstressInformationDeliveredScheduledTaskSettlement(delivery);
    const settlement = {
      taskId: settlementPayload.taskId,
      taskType: settlementPayload.taskType,
      nightNumber: settlementPayload.nightNumber,
      settlementVersion: settlementPayload.settlementVersion,
      outcomeType: settlementPayload.outcomeType,
      characterStateRevision: settlementPayload.characterStateRevision
    };

    expect(validateStoredSeamstressInformationDelivered({
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      delivery,
      choices: { choices: [choice] },
      spends: { spends: [spend] },
      settlements: [settlement]
    })).toStrictEqual({ valid: true });
    expect(validateStoredSeamstressInformationDelivered({
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      delivery,
      choices: { choices: [choice, choice] },
      spends: { spends: [spend] },
      settlements: [settlement]
    })).toMatchObject({ valid: false });
    expect(validateStoredSeamstressInformationDelivered({
      rulesBaselineVersion: RULES_BASELINE_VERSION,
      delivery,
      choices: { choices: [choice] },
      spends: undefined,
      settlements: [settlement]
    })).toMatchObject({ valid: false });
  });
});
