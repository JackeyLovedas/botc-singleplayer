# Phase 3 Slice 2B19B Implementation Design: Philosopher-Gained Dreamer Effective-Source First-Night Execution

> Canonical Round 1 replacement: this standalone document supersedes every unmaterialized Phase 3 Slice 2B19B Round 1 draft. It remains Design Round `1 / 2`; it is not Round 2.

## Metadata

- sliceId: `2B19B`
- phase: `Phase 3 — controlled vertical slices`
- designRound: `1 / 2`
- taskType: `PRODUCT_SLICE`
- branch: `phase-3/philosopher-gained-dreamer-effective-source`
- acceptedBaseHead: `5ddaa2fd02e0cb73e2a5363b222e7f08c353d389`
- ruleEvidence: `docs/rules/evidence/2B19B.md`
- ruleEvidenceSha256: `e1f038f32171d7cea1f89345b1cac958e30a79f47005ca444a0dc2633abe3187`
- ruleVerdict: `RULE_READY`
- governancePrecheck: `docs/architecture/2B19B-go-no-go-under-governance-v1.md`
- governancePrecheckSha256: `8584df7cad510bd00a49d69b9a2d794d6a4443d7be2fc9bf3dbfd7bc79128da1`
- governanceVerdict: `GO`
- ruleCoverageStatus: `PARTIAL`
- targetSliceCoverage: `PARTIAL / PHILOSOPHER_GAINED_EFFECTIVE_SOURCE_FIRST_NIGHT_ONLY`
- targetDreamerCoverage: `PARTIAL`
- targetPhilosopherCoverage: `PARTIAL`
- implementationAuthorized: `false`
- authorizationCondition: one independent reviewer must return `RULE_DESIGN_PASS` on this exact standalone design before production or test implementation begins
- primaryRisk: `PHILOSOPHER_GAINED_DREAMER_SOURCE_PROVENANCE_AND_EXECUTION`
- maxProductionFiles: `6`
- estimatedAddedProductionLoc: `1050–1400`
- stopLossProductionFiles: `>10`
- stopLossAddedProductionLoc: `>1800`
- maxDesignRounds: `2`
- maxProductRepairRounds: `2`

## Governance classification

This Slice extends one existing real formal R1 path. It does not create a new command, event family, aggregate, top-level state field, assignment transition, role-tenure type, ledger evidence type, generic gained-ability platform, or Mathematician public contract.

The accepted path is:

```text
SubmitPhilosopherAction
→ PhilosopherAbilityChosen
→ PhilosopherAbilityGranted
→ FirstNightTaskInsertedV2
→ canonical PHILOSOPHER_GAINED_ABILITY DREAMER_ACTION
→ OpenFirstNightRoleActionOpportunity
→ current receipt-free unsupported boundary
```

The Slice replaces only the last unsupported boundary for an exact V2 Philosopher-gained Dreamer task. The source player remains the Philosopher player. The player’s current character remains `philosopher`. The ability role is `dreamer`. No Dreamer character tenure is created for that player.

The following accepted authorities are reused without semantic changes:

- `SubmitPhilosopherAction`;
- `PhilosopherAbilityChosen`;
- `PhilosopherAbilityGranted`;
- `FirstNightTaskInsertedV2`;
- `philosopher-gained-first-night-scheduling-v2`;
- base-before-gained same-position ordering;
- existing V2 gained task ID construction;
- `PHILOSOPHER_GAINED_TASK_V2`;
- existing Philosopher role tenure;
- existing `DreamerTargetChosen` and `DreamerInformationDelivered` event families;
- existing `ScheduledTaskSettled`;
- existing first-night ability-outcome ledger and evidence union;
- existing private player and AI projection boundaries;
- existing serial command queue and atomic `commitAcceptedCommand`.

The eight permitted primary evidence layers are exactly:

```text
ACCEPTED_STREAM_INTEGRATION
APPLICATION_COMMAND_INTEGRATION
LEGACY_REPLAY_COMPATIBILITY
HOSTILE_REPLAY_REJECTION
STRUCTURAL_VALIDATION
PURE_POLICY_SEAM
PROJECTION
CROSS_PLATFORM_CI
```

No completion criterion may claim more than one primary layer.

## Rule delta

The rule delta is limited to the following already sourced claims:

1. A Philosopher who chooses Dreamer gains the Dreamer ability but remains the Philosopher.
2. The gained Dreamer ability acts at Dreamer’s normal first-night position.
3. The V2 scheduling override orders the base Dreamer before gained Dreamer tasks at that position, then gained tasks by source seat and stable task-ID code-unit order.
4. The gained Dreamer chooses one other modeled non-Traveller player.
5. With an effective Philosopher source and no effective Vortox, the result is one native GOOD character and one native EVIL character, exactly one of which is the target’s true current character at settlement.
6. With an effective Philosopher source and an effective Vortox, the result remains one native GOOD and one native EVIL character, and neither equals the target’s true current character at settlement.
7. Native/base Dreamer drunkenness created by the Philosopher duplicate choice affects the native Dreamer player only. It is not source impairment for the Philosopher-gained Dreamer ability.
8. A represented DRUNK or POISONED Philosopher source is outside the success capability of this Slice.
9. An impaired, ambiguous, stale, conflicting, or otherwise unproved Vortox does not authorize either a normal or forced-false success.
10. Previously delivered information is historical and is not recomputed from later character, alignment, impairment, or Vortox state.
11. V1 gained-Dreamer settlement remains unsupported.
12. No formal Mathematician count or settlement is added.
13. No new rule override is added.

## R1

R1 contains the actual application commands and accepted streams reachable from a real game:

- real V2 Philosopher choice of Dreamer;
- exact grant and exact V2 insertion;
- opening the exact gained-Dreamer V4 opportunity;
- effective gained-source normal settlement;
- effective gained-source Vortox forced-false settlement;
- base Dreamer V4 settlement followed by independent gained-Dreamer settlement;
- application rejection, retry, idempotency, atomic commit, ledger derivation, and source-only projection.

A success claim requires a real command, real event metadata, real atomic commit port, real accepted stream, formal `rebuildGameState`, and public projection or ledger entry point as applicable. A hand-built `GameState` is never R1 authority.

## R2

R2 contains accepted immutable history:

- Dreamer opportunity V1;
- non-actionable Dreamer opportunity V2;
- base actionable Dreamer opportunity V3;
- Dreamer target V1;
- base Dreamer target V2;
- Dreamer delivery V1;
- base normal delivery V2;
- base effective-Vortox delivery V3;
- base canonical-DRUNK/effective-Vortox delivery V4;
- V1 Philosopher-gained Dreamer insertion history;
- V2 Philosopher choice, grant, and insertion history;
- current role-tenure, current-character-state, task-plan, task-progress, and ledger histories.

Valid legacy streams rebuild and project under their original meanings. No legacy payload is migrated, normalized, widened, or rewritten.

## R3

R3 contains hostile or corrupted inputs and persisted histories:

- wrong Philosopher opportunity, choice, grant, or insertion;
- wrong task generation or task ID;
- V1/V2 task mixing;
- wrong source player, seat, role, chosen role, or revision;
- wrong Philosopher tenure;
- wrong gained ability-instance ID or fields;
- malformed opportunity, visibility, source contract, target, delivery, settlement, ledger fact, or evidence;
- mixed base/gained schemas;
- mixed V5/V6 deliveries;
- duplicate opportunity, target, delivery, settlement, grant, insertion, or tenure;
- naked, reversed, partial, split, or noncontiguous batch;
- payload-supplied provenance without matching accepted history;
- throwing proxy, revoked proxy, accessor, symbol key, cycle, sparse array, function, class instance, or other nonplain canonical-data input.

All R3 inputs fail closed and create no accepted canonical state.

## R4

R4 remains future or unsupported:

- successful source-Philosopher DRUNK information;
- successful source-Philosopher POISONED information;
- impaired or dead Vortox fallback behavior;
- No Dashii poisoning;
- V1 gained-Dreamer commands or settlement;
- other-night gained Dreamer;
- Traveller targeting;
- complete Storyteller free-choice support;
- general death or lifecycle behavior;
- general character-change or alignment-change producers;
- formal combined Mathematician settlement;
- final Mathematician `trueCount`;
- `2B19A3B2`;
- FIRST_NIGHT completion;
- transition to DAY;
- Phase 2C;
- a generic gained-ability capability engine.

## T1

T1 includes:

- incoming commands;
- accepted and imported event envelopes;
- stored opportunities;
- stored target and delivery payloads;
- grant, insertion, tenure, impairment, and current-character-state records;
- setup and role-catalog snapshots;
- ledger facts and evidence;
- projection inputs;
- command-store results.

Every new T1 entry point first applies exception-safe canonical-data validation. It must reject without throwing and without invoking getters:

- throwing proxies;
- revoked proxies;
- accessors;
- symbol keys or symbol values;
- cycles or repeated object references;
- functions;
- nonplain prototypes;
- sparse arrays;
- missing enumerable keys;
- extra enumerable keys;
- wrong primitive types;
- wrong literals;
- invalid IDs, seats, revisions, or role snapshots.

Getter invocation count must remain exactly zero.

## T2

T2 includes values derived only from validated accepted history:

- next unsettled task;
- exact grant and insertion chain;
- unique active Philosopher tenure;
- gained source contract;
- gained ability instance;
- settlement-time source and target states;
- effective-Vortox constraint;
- deterministic legal candidate sets;
- expected target, delivery, settlement, ledger fact, and safe projection.

No caller may submit a source contract, capability, target truth, Vortox applicability decision, ledger, role tenure, or expected delivery.

## T3

T3 includes module-private pure helpers:

- canonical ID formatting and parsing;
- exact enumerable-key comparison;
- fieldwise cloning and equality;
- UTF-16 code-unit comparison;
- native character-type classification;
- candidate filtering and selection;
- version-dispatch predicates.

T3 helpers remain Dreamer-specific. They do not become a generic gained-ability API or public trust boundary.

## Legacy compatibility

The following accepted shapes remain byte- and meaning-compatible:

```text
DreamerActionOpportunityV1
DreamerActionOpportunityV2
DreamerActionOpportunityV3
DreamerActionOpportunityVisibilityV1
DreamerActionOpportunityVisibilityV2
DreamerActionOpportunityVisibilityV3
DreamerTargetChosenPayloadV1
DreamerTargetChosenPayloadV2
DreamerInformationDeliveredPayloadV1
DreamerInformationDeliveredPayloadV2
DreamerInformationDeliveredPayloadV3
DreamerInformationDeliveredPayloadV4
BaseDreamerV2SourceContract
```

The implementation must not:

- add optional fields to any accepted base contract;
- convert `BaseDreamerV2SourceContract` into a union;
- allow an old discriminator to accept a new gained shape;
- modify old fixtures to resemble gained history;
- migrate or rewrite old events;
- change assignment, `CurrentCharacterState`, role-tenure records, event envelopes, event versions, or `GameState`;
- change V1 gained history into V2;
- make V1 gained Dreamer actionable.

For a V1 gained Dreamer task:

```text
result = ApplicationNotConfigured
failureStage = first-night-role-action
retryable = true
receipt = absent
events = []
gameVersion = unchanged
```

The V1 task remains unsettled.

## Frozen canonical identifiers

For source seat `SS`, where `SS` is a two-digit value from `01` through `12`, the exact identifiers are:

```text
taskId =
first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-SS:from-dreamer

grantId =
philosopher-grant-v1:seat-SS:from-dreamer

opportunityId =
first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-SS:from-dreamer:opportunity-01

sourceAbilityInstanceId =
first-night-ability-instance-v1:philosopher-gained-v2:
<taskId>:grant:<grantId>
```

The ability-instance string is one continuous string formed by concatenating the displayed prefix, exact `taskId`, `:grant:`, and exact `grantId`.

All formatters reject noncanonical seats, task types, chosen roles, grant/task disagreement, leading or trailing whitespace, control characters, and non-round-tripping IDs.

## Exact gained source contract

```ts
export const DREAMER_PHILOSOPHER_GAINED_SOURCE_CONTRACT_VERSION =
  "dreamer-philosopher-gained-source-contract-v1" as const;

export type PhilosopherGainedDreamerAbilityInstanceV2 = {
  readonly provenanceVersion:
    "first-night-ability-instance-provenance-v1";
  readonly kind: "PHILOSOPHER_GAINED_TASK_V2";
  readonly abilityInstanceId: FirstNightAbilityInstanceId;
  readonly abilityRoleId: "dreamer";
  readonly taskId: ScheduledTaskId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly grantId: GrantedAbilityId;
  readonly sourceCharacterStateRevision: number;
  readonly schedulingVersion:
    "philosopher-gained-first-night-scheduling-v2";
};

export type PhilosopherGainedDreamerGrantReferenceV1 = {
  readonly kind: "PHILOSOPHER_GRANT_V1";
  readonly grantId: GrantedAbilityId;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRoleId: "philosopher";
  readonly chosenRoleId: "dreamer";
  readonly sourceCharacterStateRevision: number;
};

export type PhilosopherGainedDreamerTaskInsertionReferenceV1 = {
  readonly kind: "FIRST_NIGHT_TASK_INSERTION_V2";
  readonly taskId: ScheduledTaskId;
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly schedulingVersion:
    "philosopher-gained-first-night-scheduling-v2";
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly grantId: GrantedAbilityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRoleId: "philosopher";
  readonly chosenRoleId: "dreamer";
  readonly sourceCharacterStateRevision: number;
};

export type PhilosopherGainedDreamerSourceContractV1 = {
  readonly sourceContractVersion:
    typeof DREAMER_PHILOSOPHER_GAINED_SOURCE_CONTRACT_VERSION;
  readonly kind: "PHILOSOPHER_GAINED_V2";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly schedulingVersion:
    "philosopher-gained-first-night-scheduling-v2";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly taskSourceKind: "PHILOSOPHER_GAINED_ABILITY";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRoleId: "philosopher";
  readonly chosenRoleId: "dreamer";
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceCharacterStateRevision: number;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly grantId: GrantedAbilityId;
  readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
  readonly abilityInstance: PhilosopherGainedDreamerAbilityInstanceV2;
  readonly grantReference: PhilosopherGainedDreamerGrantReferenceV1;
  readonly taskInsertionReference:
    PhilosopherGainedDreamerTaskInsertionReferenceV1;
};
```

Exact enumerable key sets:

```ts
export const PHILOSOPHER_GAINED_DREAMER_ABILITY_INSTANCE_V2_KEYS = [
  "provenanceVersion",
  "kind",
  "abilityInstanceId",
  "abilityRoleId",
  "taskId",
  "sourcePlayerId",
  "sourceSeatNumber",
  "philosopherOpportunityId",
  "grantId",
  "sourceCharacterStateRevision",
  "schedulingVersion"
] as const;

export const PHILOSOPHER_GAINED_DREAMER_GRANT_REFERENCE_V1_KEYS = [
  "kind",
  "grantId",
  "philosopherOpportunityId",
  "sourcePlayerId",
  "sourceSeatNumber",
  "sourceRoleId",
  "chosenRoleId",
  "sourceCharacterStateRevision"
] as const;

export const PHILOSOPHER_GAINED_DREAMER_INSERTION_REFERENCE_V1_KEYS = [
  "kind",
  "taskId",
  "taskPlanVersion",
  "schedulingVersion",
  "philosopherOpportunityId",
  "grantId",
  "sourcePlayerId",
  "sourceSeatNumber",
  "sourceRoleId",
  "chosenRoleId",
  "sourceCharacterStateRevision"
] as const;

export const PHILOSOPHER_GAINED_DREAMER_SOURCE_CONTRACT_V1_KEYS = [
  "sourceContractVersion",
  "kind",
  "taskPlanVersion",
  "schedulingVersion",
  "taskId",
  "taskType",
  "taskSourceKind",
  "sourcePlayerId",
  "sourceSeatNumber",
  "sourceRoleId",
  "chosenRoleId",
  "sourceRoleTenureId",
  "sourceCharacterStateRevision",
  "philosopherOpportunityId",
  "grantId",
  "sourceAbilityInstanceId",
  "abilityInstance",
  "grantReference",
  "taskInsertionReference"
] as const;
```

All repeated fields must be exactly equal. `sourceAbilityInstanceId` must equal `abilityInstance.abilityInstanceId`. The exact ability instance must round-trip through the existing V2 formatter/parser and have `kind = PHILOSOPHER_GAINED_TASK_V2`.

The source contract is accepted only when the formal accepted prefix contains exactly one mutually consistent:

- closed Philosopher action opportunity;
- `PhilosopherAbilityChosen`;
- `PhilosopherAbilityGranted`;
- `FirstNightTaskInsertedV2`;
- scheduled gained Dreamer task;
- active Philosopher tenure.

The contract does not create or require a Dreamer tenure.

## New versioned opportunity and visibility

```ts
export const DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION =
  "dreamer-first-night-action-opportunity-v4" as const;

export const DREAMER_V4_VISIBILITY_SCHEMA_VERSION =
  "dreamer-first-night-action-visibility-v4" as const;

export type DreamerActionOpportunityVisibilityV4 = {
  readonly visibilitySchemaVersion:
    typeof DREAMER_V4_VISIBILITY_SCHEMA_VERSION;
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly futureUnsupportedDecisionKinds: readonly [];
  readonly targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER";
};

export type DreamerActionOpportunityV4 = {
  readonly opportunitySchemaVersion:
    typeof DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V4";
  readonly opportunityStatus: "OPEN" | "CLOSED";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: PhilosopherGainedDreamerSourceContractV1;
  readonly visibility: DreamerActionOpportunityVisibilityV4;
};
```

Exact enumerable key sets:

```ts
export const DREAMER_ACTION_OPPORTUNITY_VISIBILITY_V4_KEYS = [
  "visibilitySchemaVersion",
  "canChooseTarget",
  "supportedDecisionKinds",
  "futureUnsupportedDecisionKinds",
  "targetSchema"
] as const;

export const DREAMER_ACTION_OPPORTUNITY_V4_KEYS = [
  "opportunitySchemaVersion",
  "nightNumber",
  "opportunityId",
  "opportunityKind",
  "opportunityStatus",
  "taskId",
  "taskType",
  "sourcePlayerId",
  "sourceSeatNumber",
  "sourceRole",
  "sourceCharacterStateRevision",
  "sourceContract",
  "visibility"
] as const;
```

Creation emits only `OPEN`. Stored replay accepts only legal `OPEN` or `CLOSED`. Submission accepts only `OPEN`. Closing preserves every other field byte-for-byte.

Opening requires:

1. `phase = FIRST_NIGHT`;
2. V2 task plan;
3. exact next unsettled task;
4. task source `PHILOSOPHER_GAINED_ABILITY`;
5. chosen role `dreamer`;
6. exact V2 task ID;
7. exact source player and seat;
8. exactly one closed Philosopher opportunity;
9. exactly one choice;
10. exactly one grant;
11. exactly one V2 insertion;
12. exact grant/insertion/source revision agreement;
13. exactly one active Philosopher tenure;
14. exact `PHILOSOPHER_GAINED_TASK_V2` ability instance;
15. no existing Dreamer opportunity of any generation for the same task;
16. no task settlement.

Opening does not require the source or Vortox to be effective. Capability is evaluated at submission settlement. This allows unsupported source impairment to fail with the already-open opportunity unchanged.

## New versioned target

```ts
export const DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION =
  "dreamer-target-chosen-v3" as const;

export type DreamerTargetChosenPayloadV3 = {
  readonly rulesBaselineVersion: string;
  readonly targetSchemaVersion:
    typeof DREAMER_TARGET_CHOSEN_V3_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    typeof DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceContract: PhilosopherGainedDreamerSourceContractV1;
  readonly abilityRoleId: "dreamer";
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
};
```

Exact enumerable key set:

```ts
export const DREAMER_TARGET_CHOSEN_V3_KEYS = [
  "rulesBaselineVersion",
  "targetSchemaVersion",
  "nightNumber",
  "taskId",
  "taskType",
  "opportunityId",
  "opportunitySchemaVersion",
  "decisionKind",
  "sourcePlayerId",
  "sourceSeatNumber",
  "sourceRole",
  "sourceCharacterStateRevision",
  "evaluatedCharacterStateRevision",
  "sourceContract",
  "abilityRoleId",
  "targetPlayerId",
  "targetSeatNumber"
] as const;
```

The target must be exactly one other modeled roster player, must exist exactly once in current character state, must not be the source player, and must not be a Traveller. Because Traveller behavior is unsupported, any represented Traveller target fails closed.

The target event does not carry target role, alignment, truth membership, Vortox status, reliability, grant metadata outside the source contract, or ledger outcome.

## Separate normal delivery V5

```ts
export const DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION =
  "dreamer-information-delivered-v5" as const;

export type PhilosopherGainedDreamerEffectiveReliability = {
  readonly kind: "PHILOSOPHER_GAINED_EFFECTIVE";
};

export type DreamerInformationDeliveredPayloadV5 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion:
    typeof DREAMER_INFORMATION_DELIVERED_V5_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    typeof DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION;
  readonly knowledgeModelVersion: "dreamer-information-model-v1";
  readonly knowledgeStage: "DREAMER_INFORMATION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceContract: PhilosopherGainedDreamerSourceContractV1;
  readonly abilityRoleId: "dreamer";
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability:
    PhilosopherGainedDreamerEffectiveReliability;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: "dreamer-false-role-policy-v1";
};
```

Exact enumerable key sets:

```ts
export const PHILOSOPHER_GAINED_DREAMER_EFFECTIVE_RELIABILITY_KEYS = [
  "kind"
] as const;

export const DREAMER_INFORMATION_DELIVERED_V5_KEYS = [
  "rulesBaselineVersion",
  "deliverySchemaVersion",
  "nightNumber",
  "taskId",
  "taskType",
  "opportunityId",
  "opportunitySchemaVersion",
  "knowledgeModelVersion",
  "knowledgeStage",
  "sourcePlayerId",
  "sourceSeatNumber",
  "sourceCharacterStateRevision",
  "evaluatedCharacterStateRevision",
  "sourceContract",
  "abilityRoleId",
  "targetPlayerId",
  "targetSeatNumber",
  "informationReliability",
  "goodRole",
  "evilRole",
  "falseRolePolicyVersion"
] as const;
```

V5 is valid only when:

- the source Philosopher is effective at `evaluatedCharacterStateRevision`;
- there is no current Vortox;
- `goodRole` has native `TOWNSFOLK` or `OUTSIDER` type;
- `evilRole` has native `MINION` or `DEMON` type;
- exactly one of `goodRole.roleId` and `evilRole.roleId` equals the target’s true role at that revision.

## Separate Vortox delivery V6

```ts
export const DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION =
  "dreamer-information-delivered-v6" as const;

export type PhilosopherGainedDreamerVortoxReliability = {
  readonly kind: "VORTOX_FORCED_FALSE";
};

export type DreamerInformationDeliveredPayloadV6 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion:
    typeof DREAMER_INFORMATION_DELIVERED_V6_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    typeof DREAMER_V4_OPPORTUNITY_SCHEMA_VERSION;
  readonly knowledgeModelVersion: "dreamer-information-model-v1";
  readonly knowledgeStage: "DREAMER_INFORMATION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceContract: PhilosopherGainedDreamerSourceContractV1;
  readonly abilityRoleId: "dreamer";
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability:
    PhilosopherGainedDreamerVortoxReliability;
  readonly vortoxConstraint: DreamerVortoxConstraint;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: "dreamer-false-role-policy-v1";
};
```

The accepted existing `DreamerVortoxConstraint` remains unchanged and has this exact seven-key set:

```ts
export const DREAMER_VORTOX_CONSTRAINT_KEYS = [
  "constraintVersion",
  "kind",
  "vortoxPlayerId",
  "vortoxSeatNumber",
  "vortoxRoleId",
  "vortoxRoleTenureId",
  "evaluatedCharacterStateRevision"
] as const;
```

Exact V6 enumerable key sets:

```ts
export const PHILOSOPHER_GAINED_DREAMER_VORTOX_RELIABILITY_KEYS = [
  "kind"
] as const;

export const DREAMER_INFORMATION_DELIVERED_V6_KEYS = [
  "rulesBaselineVersion",
  "deliverySchemaVersion",
  "nightNumber",
  "taskId",
  "taskType",
  "opportunityId",
  "opportunitySchemaVersion",
  "knowledgeModelVersion",
  "knowledgeStage",
  "sourcePlayerId",
  "sourceSeatNumber",
  "sourceCharacterStateRevision",
  "evaluatedCharacterStateRevision",
  "sourceContract",
  "abilityRoleId",
  "targetPlayerId",
  "targetSeatNumber",
  "informationReliability",
  "vortoxConstraint",
  "goodRole",
  "evilRole",
  "falseRolePolicyVersion"
] as const;
```

V6 is valid only when:

- the source Philosopher is effective;
- exactly one current Vortox is proven;
- the Vortox has exactly one active Vortox tenure at the evaluation revision;
- no represented Vortox impairment applies;
- `goodRole` is natively GOOD;
- `evilRole` is natively EVIL;
- neither delivered role equals the target’s true role.

## Shared exact nested shapes

Every `RoleSetupSnapshot` in a new shape has exactly:

```ts
export const ROLE_SETUP_SNAPSHOT_KEYS = [
  "roleId",
  "characterType",
  "defaultAlignment",
  "edition",
  "setupModifier"
] as const;

export const SETUP_MODIFIER_KEYS = [
  "outsiderDelta",
  "townsfolkDelta"
] as const;
```

Every new validator must use version-first closed dispatch. An unknown, missing, duplicated, accessor-backed, or ambiguous discriminator is rejected before any version-specific property access.

New clone and equality functions must be fieldwise:

- no JSON serialization;
- no object spread before hostile-input validation;
- no reference equality for nested values;
- no omission of any semantic field;
- no widening between base and gained variants.

A one-field mutation of any enumerable semantic field must make equality false and validation fail where the mutation violates canonical history.

## Capability matrix

| Source state | Vortox state | Result |
|---|---|---|
| Effective Philosopher gained source | No current Vortox | V5 normal delivery |
| Effective Philosopher gained source | Exactly one effective current Vortox | V6 forced-false delivery |
| Native/base Dreamer has canonical DRUNK, Philosopher source effective | No current Vortox | V5; native DRUNK is ignored for gained-source effectiveness |
| Native/base Dreamer has canonical DRUNK, Philosopher source effective | Effective Vortox | V6; native DRUNK remains isolated |
| Philosopher source represented DRUNK | Any | receipt-free `ApplicationNotConfigured`; zero events; OPEN opportunity |
| Philosopher source represented POISONED | Any | receipt-free `ApplicationNotConfigured`; zero events; OPEN opportunity |
| Philosopher source provenance, tenure, or current role unresolved | Any | receipt-free `ApplicationNotConfigured`; zero events; OPEN opportunity |
| Effective Philosopher source | Vortox identity or tenure unresolved | receipt-free `ApplicationNotConfigured`; zero events; OPEN opportunity |
| Effective Philosopher source | Vortox represented impaired | receipt-free `ApplicationNotConfigured`; zero events; OPEN opportunity |
| Effective Philosopher source | Candidate shortage | receipt-free `ApplicationNotConfigured`; zero events; OPEN opportunity |
| V1 gained Dreamer task | Any | receipt-free `ApplicationNotConfigured`; zero events; no new opportunity |

No source-impairment branch produces V5 or V6.

## Deterministic candidate policy

The candidate source is the validated current role catalog. Character native type, not player alignment, controls GOOD and EVIL classification.

The comparator compares `roleId` UTF-16 code units from left to right. At the first differing code unit, the smaller numeric code unit sorts first. When one string is an exact prefix of the other, the shorter string sorts first.

Forbidden mechanisms:

```text
localeCompare
Intl.Collator
Date.now
Math.random
random UUID
filesystem order
object insertion order
catalog input order
environment locale
```

Normal policy:

- GOOD target: `goodRole = target true role`; `evilRole = first legal EVIL candidate`.
- EVIL target: `evilRole = target true role`; `goodRole = first legal GOOD candidate`.
- the false candidate is selected from the canonical catalog after stable code-unit sorting.

Vortox policy:

- select the first legal GOOD candidate not equal to target truth;
- select the first legal EVIL candidate not equal to target truth;
- both sets are independently sorted by the frozen comparator.

Catalog permutation must not change the result. Empty legal candidate sets fail closed.

## Base/gained isolation

The base and gained lines are isolated by all of:

- opportunity discriminator;
- opportunity schema version;
- opportunity ID grammar;
- source contract version and `kind`;
- target schema version;
- delivery schema version;
- source current role;
- ability role;
- ability-instance kind;
- task source kind;
- grant and insertion provenance.

The exact identities are:

| Concern | Base Dreamer | Gained Dreamer |
|---|---|---|
| source current role | `dreamer` | `philosopher` |
| ability role | `dreamer` | `dreamer` |
| task source | `ROLE` | `PHILOSOPHER_GAINED_ABILITY` |
| tenure | Dreamer tenure | Philosopher tenure |
| ability instance | `BASE_ROLE_TASK` | `PHILOSOPHER_GAINED_TASK_V2` |
| opportunity | V1/V2/V3 | V4 only |
| target | V1/V2 | V3 only |
| delivery | V1/V2/V3/V4 | V5/V6 only |

The gained source must never satisfy a base validator, and a base source must never satisfy a gained validator.

## Grant and insertion provenance

The gained source is accepted only when the prefix proves:

1. one canonical Philosopher V1 action opportunity, CLOSED;
2. one matching `PhilosopherAbilityChosen` choosing `dreamer`;
3. one matching `PhilosopherAbilityGranted`;
4. exact canonical `grantId`;
5. one matching `FirstNightTaskInsertedV2`;
6. exact V2 task ID;
7. exact scheduling version;
8. exact source player and seat;
9. exact source role snapshot `philosopher`;
10. exact chosen role snapshot `dreamer`;
11. exact source revision across opportunity, choice, grant, task source, insertion, ability instance, and source contract;
12. exact task catalog role/order/signature bindings;
13. exact base-before-gained canonical ordering;
14. no V1 insertion mixed into the V2 chain;
15. no duplicate grant, insertion, task, or original opportunity.

Payload shape alone cannot prove this chain.

## Ability instance

The only allowed gained ability instance is:

```text
kind = PHILOSOPHER_GAINED_TASK_V2
abilityRoleId = dreamer
sourcePlayerId = Philosopher player
sourceSeatNumber = Philosopher seat
taskId = exact V2 gained Dreamer task
philosopherOpportunityId = exact original Philosopher opportunity
grantId = exact Dreamer grant
sourceCharacterStateRevision = exact grant/insertion revision
schedulingVersion = philosopher-gained-first-night-scheduling-v2
```

`sourceAbilityInstanceId` must round-trip through the accepted formatter and parser. No explicit-domain instance, base instance, or V1 gained instance is accepted.

## Source role tenure

The source contract carries exactly one existing Philosopher tenure ID. At settlement:

- the tenure must exist exactly once;
- player and seat must equal the source;
- role must be `philosopher`;
- acquired revision must be no later than the evaluation revision;
- ended revision must be absent or later than the evaluation revision;
- current source role must remain `philosopher`.

The Slice creates no tenure record and performs no role transition.

## Pre-event accepted-prefix proof

Before appending the gained target or delivery, the application must call a Dreamer-specific prospective validator with:

```ts
{
  readonly priorAcceptedEvents: readonly AnyDomainEventEnvelope[];
  readonly targetEvent: DomainEventEnvelope<"DreamerTargetChosen">;
  readonly deliveryEvent: DomainEventEnvelope<"DreamerInformationDelivered">;
  readonly settlementEvent: DomainEventEnvelope<"ScheduledTaskSettled">;
}
```

The validator must:

1. exception-safely validate the four inputs;
2. rebuild the entire prior accepted prefix with formal `rebuildGameState`;
3. prove the game, rules baseline, phase, task plan, task progress, roster, setup, current character state, grants, insertions, tenures, impairments, opportunities, and ledger are canonical;
4. prove the target task is the exact next unsettled V2 gained Dreamer task;
5. prove the original Philosopher opportunity, choice, grant, and insertion chain;
6. prove the active Philosopher tenure;
7. derive the exact gained source contract;
8. derive the exact `PHILOSOPHER_GAINED_TASK_V2` ability instance;
9. prove the submitted V4 opportunity is unique and OPEN;
10. prove the target is legal;
11. read target truth from the pre-event current character state at `evaluatedCharacterStateRevision`;
12. resolve source effectiveness;
13. resolve Vortox applicability;
14. build the canonical legal candidate sets;
15. reconstruct the expected V3 target payload;
16. reconstruct the expected V5 or V6 delivery;
17. reconstruct the expected settlement;
18. compare each event fieldwise with the expected value;
19. validate exact three-event batch semantics;
20. apply the batch prospectively;
21. validate the prospective ledger contains exactly one new gained fact;
22. validate the opportunity becomes CLOSED, the task becomes settled, and the phase remains FIRST_NIGHT.

Only after all steps pass may `commitAcceptedCommand` run.

The validator must not accept:

- caller-supplied source contract;
- caller-supplied truth;
- caller-supplied Vortox result;
- caller-supplied ledger;
- caller-supplied role tenure;
- state-only provenance;
- a stored delivery that attempts to prove itself.

## Atomic batch

A successful `SubmitDreamerAction` for V4 emits exactly:

1. `DreamerTargetChosen` with V3 payload;
2. `DreamerInformationDelivered` with V5 or V6 payload;
3. `ScheduledTaskSettled` with existing settlement payload.

The three events have:

- one command ID;
- one batch ID;
- one committed game version;
- contiguous event sequences;
- one rules baseline;
- one correlation and causation chain.

Settlement is exactly:

```text
taskId = gained task ID
taskType = DREAMER_ACTION
nightNumber = 1
settlementVersion = scheduled-task-settlement-v1
outcomeType = DREAMER_INFORMATION_DELIVERED
characterStateRevision = evaluatedCharacterStateRevision
```

The batch:

- closes only the matching V4 opportunity;
- settles only the matching gained task;
- leaves the phase FIRST_NIGHT;
- emits no `PhaseTransitioned`;
- emits no base Dreamer event;
- changes no grant, insertion, assignment, current-role, or tenure history.

Replay rejects naked delivery, reversed order, partial batch, split batch, duplicate target, duplicate delivery, duplicate settlement, noncontiguous sequence, wrong batch identity, wrong settlement, mixed V5/V6, and base/gained mixing.

## Outcome ledger

No new evidence variant, fact type, cause, status, ledger field, or public Mathematician contract is added.

### V5 fact

Exactly one terminal fact is derived from the V5 delivery:

```text
sourcePlayerId = Philosopher player
sourceSeatNumber = Philosopher seat
abilityRoleId = dreamer
abilityTaskId = gained Dreamer task
abilityInstance.kind = PHILOSOPHER_GAINED_TASK_V2
outcomeStatus = NORMAL
causeKind = NO_OTHER_CHARACTER_ABILITY
causedByAnotherCharacterAbility = false
```

Its canonical evidence set contains exactly 11 references after canonical ordering:

- one `SOURCE_EVENT`;
- one `TASK`;
- one `CHARACTER_STATE`;
- one source `PLAYER_ROLE_AT_REVISION` showing `philosopher`;
- one gained V4 `ACTION_OPPORTUNITY`;
- one active Philosopher `ROLE_TENURE`;
- one original closed Philosopher `ACTION_OPPORTUNITY`;
- one `PHILOSOPHER_GRANT`;
- one `FIRST_NIGHT_TASK_INSERTION`;
- one target `PLAYER_ROLE_AT_REVISION`;
- one `DREAMER_DELIVERY`.

### V6 fact

Exactly one terminal fact is derived from the V6 delivery:

```text
sourcePlayerId = Philosopher player
sourceSeatNumber = Philosopher seat
abilityRoleId = dreamer
abilityTaskId = gained Dreamer task
abilityInstance.kind = PHILOSOPHER_GAINED_TASK_V2
outcomeStatus = ABNORMAL
causeKind = VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility = true
```

Its canonical evidence set contains exactly 13 references: the V5 set plus exactly one Vortox `PLAYER_ROLE_AT_REVISION` and exactly one active Vortox `ROLE_TENURE`.

No Dreamer tenure evidence is fabricated for the Philosopher. No source-impairment evidence appears on either success path. `ScheduledTaskSettled` creates no second fact.

## Private projection

A validated V5 or V6 delivery is visible only to:

- the source Philosopher player;
- the AI controlling that same source Philosopher player.

The visible entry remains:

```ts
{
  readonly sourcePlayerId: PlayerId;
  readonly target: KnownPlayerReference;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly knowledgeStage: "DREAMER_INFORMATION";
  readonly knowledgeModelVersion: "dreamer-information-model-v1";
}
```

The projection must not reveal:

- gained-source kind;
- Philosopher identity as provenance metadata;
- original Philosopher opportunity;
- grant ID;
- insertion;
- ability instance;
- role-tenure ID;
- Vortox;
- information reliability;
- ledger status or cause;
- target true role;
- which delivered role is true or false;
- native Dreamer DRUNK.

Every other player and AI receives no gained Dreamer entry.

Projection requires accepted-stream provenance. State-only V5 or V6 data is unavailable. Projection clones are reference-stable; caller mutation cannot alter stored history or later projections. Later character, alignment, impairment, or Vortox changes do not recompute delivered knowledge.

## Receipt and retry contract

### Deterministic command rejection

The following produce a normal rejected-command receipt and zero events:

- unauthorized actor;
- stale expected game version;
- malformed command shape;
- wrong task ID;
- wrong opportunity ID;
- CLOSED opportunity;
- self target;
- missing target;
- unsupported Traveller target.

A retry that changes the command content must use a new command ID. Reusing the same command ID with different content returns the existing idempotency conflict behavior.

### Retryable receipt-free failure

The following return `CommandExecutionFailed`, write no receipt, append zero events, preserve game version, preserve the OPEN opportunity, and allow the identical command ID after repair:

- source Philosopher DRUNK;
- source Philosopher POISONED;
- invalid or unresolved source provenance;
- invalid or unresolved Philosopher tenure;
- unresolved or impaired Vortox;
- candidate shortage;
- dependency read failure;
- canonical-state rebuild failure;
- metadata generation failure;
- prospective validation failure;
- atomic accepted-commit failure.

Capability failures use:

```text
code = ApplicationNotConfigured
failureStage = first-night-role-action
retryable = true
```

Infrastructure and validation failures retain their existing exact failure codes and stages.

`commitAcceptedCommand` is the sole atomic accepted write. Adapter-level append, commit-store, or accepted-receipt sub-failure must roll back the entire accepted unit and surface:

```text
code = EventStoreAppendFailed
failureStage = accepted-commit
receipt = absent
events accepted = zero
gameVersion = unchanged
```

A failure while writing a deterministic rejected receipt surfaces:

```text
code = CommandReceiptWriteFailed
failureStage = rejected-receipt-write
```

No accepted event is written in that path.

### Successful retry and idempotency

After a retryable failure is repaired, the identical command commits exactly one three-event batch and one accepted receipt. A later identical retry returns the accepted receipt idempotently and appends no events.

## Failure matrix

| Failure | Result | Receipt | Events | Opportunity |
|---|---|---:|---:|---|
| Unauthorized actor | rejected | one rejected receipt | 0 | OPEN |
| Stale expected version | rejected | one rejected receipt | 0 | OPEN |
| Wrong task/opportunity | rejected | one rejected receipt | 0 | unchanged |
| Self or invalid target | rejected | one rejected receipt | 0 | OPEN |
| V1 gained task | `ApplicationNotConfigured` | none | 0 | absent |
| Source DRUNK | `ApplicationNotConfigured` | none | 0 | OPEN |
| Source POISONED | `ApplicationNotConfigured` | none | 0 | OPEN |
| Source provenance unresolved | `ApplicationNotConfigured` | none | 0 | OPEN |
| Philosopher tenure unresolved | `ApplicationNotConfigured` | none | 0 | OPEN |
| Vortox unresolved/impaired | `ApplicationNotConfigured` | none | 0 | OPEN |
| Candidate shortage | `ApplicationNotConfigured` | none | 0 | OPEN |
| Metadata failure | existing metadata failure | none | 0 | OPEN |
| Prospective failure | `DependencyExecutionFailed` | none | 0 | OPEN |
| Atomic commit failure | `EventStoreAppendFailed` | none | 0 | OPEN |
| Rejected-receipt failure | `CommandReceiptWriteFailed` | none | 0 | unchanged |
| Successful first execution | accepted | one accepted receipt | 3 | CLOSED |
| Identical retry after success | idempotent accepted result | existing receipt | 0 | CLOSED |
| Same ID, different command | idempotency conflict | existing receipt retained | 0 | unchanged |

## Exact 2B19A3B2 accepted-stream bridge

One real accepted-stream scenario must establish:

```text
Philosopher chooses Dreamer
→ native/base Dreamer becomes canonical DRUNK
→ effective Vortox is present
→ base Dreamer V4 target/delivery/settlement succeeds
→ gained Dreamer V4 opportunity opens
→ gained Dreamer V6 target/delivery/settlement succeeds
→ next unsettled task is MATHEMATICIAN_INFORMATION
```

The scenario must prove:

- base fact source is the native Dreamer player;
- gained fact source is the Philosopher player;
- source player IDs differ;
- ability-instance IDs differ;
- base instance is `BASE_ROLE_TASK`;
- gained instance is `PHILOSOPHER_GAINED_TASK_V2`;
- the ledger contains exactly two distinct terminal Dreamer facts;
- native Dreamer DRUNK does not impair the gained source;
- the gained fact has Vortox abnormal classification;
- no Mathematician command executes;
- no Mathematician delivery or settlement exists;
- no `trueCount` is computed or asserted;
- the next task remains unsettled `MATHEMATICIAN_INFORMATION`.

This scenario is supporting authority for future `2B19A3B2_COMBINED_MATHEMATICIAN_INTEGRATION` only. It is not formal Mathematician integration.

## Ownership contract

All application tests whose title begins with:

```text
[2B19B-
```

belong to:

```text
application-service-dreamer-vortox
```

Implementation traceability is:

```text
docs/implementation/phase-3-slice-2b19b-test-traceability.md
```

Supporting authority IDs begin with:

```text
SUP-2B19B-
```

The ownership registry entry may be materialized only after:

- physical tests exist;
- all marker titles are final;
- all criteria have actual traceability rows;
- every supporting authority exists and resolves exactly once;
- the owner project actually executes every owned test;
- no cross-contract test binding exists;
- no cross-contract supporting-authority reference exists.

The implementation must not:

- pre-register or empty-register 2B19B;
- auto-learn tests from candidates;
- change A3A or A3B1 contract semantics;
- change ownership registry schema;
- add a tenth Vitest project;
- add a tenth ordinary or coverage group;
- change workflow topology.

A3A, A3B1, and 2B19B contracts must all pass together. Unknown markers fail closed.

## Planned supporting authority purposes

Final SUP IDs are assigned only after materialization. The permitted purposes are:

1. real accepted V2 Philosopher choice, grant, insertion, gained task, and active Philosopher tenure;
2. real accepted gained normal GOOD-target stream;
3. real accepted gained normal EVIL-target stream;
4. real accepted gained Vortox GOOD-target stream;
5. real accepted gained Vortox EVIL-target stream;
6. real base-V4-then-gained-V6 bridge stream;
7. valid legacy V1/V2/V3/V4 Dreamer histories;
8. hostile persisted clones of valid opportunities, targets, deliveries, batches, facts, and evidence;
9. real command-store, metadata, prospective, and atomic-commit fault ports;
10. exact role-catalog permutation and candidate-shortage contexts;
11. exact player and AI projection streams;
12. three complete coverage candidates and exact-profile verification.

Each materialized authority records:

- unique SUP ID;
- producer;
- source file and identity;
- `ACCEPTED`, `LEGACY`, or `HOSTILE`;
- mutation disposition;
- consuming criteria;
- immutable hash where applicable.

A supporting authority never replaces a criterion’s primary layer.

## Design-time traceability

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C01 | Philosopher may gain Dreamer | Real V2 command creates exact choice, grant, and insertion | Real accepted command and stream inspection | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Exact canonical chain | PLANNED: accepted V2 Philosopher chain |
| C02 | Gained task acts at Dreamer position | Plan orders Philosopher before base Dreamer before gained Dreamer | Rebuilt task-plan order assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact official and override order | PLANNED: accepted plan |
| C03 | Base precedes gained | Same-position base task is before gained task | Canonical order-key assertion | R1 | T2 | STRUCTURAL_VALIDATION | Base first | PLANNED: accepted plan |
| C04 | Gained task ID is canonical | ID round-trips exact V2 grammar | Formatter/parser boundary | R1 | T3 | PURE_POLICY_SEAM | Exact ID | NONE |
| C05 | Grant ID is canonical | Grant ID binds seat and dreamer | Formatter/parser boundary | R1 | T3 | PURE_POLICY_SEAM | Exact ID | NONE |
| C06 | Ability instance is gained V2 | Exact 11-key instance round-trips | Instance validator and accepted chain | R1 | T2 | STRUCTURAL_VALIDATION | `PHILOSOPHER_GAINED_TASK_V2` | PLANNED: accepted chain |
| C07 | Source remains Philosopher | Current source role and tenure are Philosopher | Accepted current-state and tenure proof | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | No role change | PLANNED: accepted chain |
| C08 | Ability role is Dreamer | Contract, instance, task, and ledger use dreamer | Accepted stream and ledger assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `abilityRoleId=dreamer` | PLANNED: accepted gained stream |
| C09 | No fake Dreamer tenure | Gained source uses one Philosopher tenure only | Whole-stream tenure/evidence assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | No gained Dreamer tenure | PLANNED: accepted gained stream |
| C10 | V4 opportunity is closed and exact | Producer creates only OPEN and replay accepts legal OPEN/CLOSED | Producer plus stored-shape matrix | R1 | T1 | STRUCTURAL_VALIDATION | Exact V4 behavior | PLANNED: valid V4 opportunity |
| C11 | Opportunity ID is canonical | Exact gained opportunity ID round-trips | Formatter/parser boundary | R1 | T3 | PURE_POLICY_SEAM | Exact ID | NONE |
| C12 | V1 gained remains unsupported | Formal open/submit returns receipt-free failure | Real application command | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | No event or settlement | PLANNED: V1 history |
| C13 | Grant provenance is exact | Wrong grant rejects | Accepted clone with grant mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Whole stream rejected | PLANNED: hostile grant clone |
| C14 | Insertion provenance is exact | Wrong insertion rejects | Accepted clone with insertion mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Whole stream rejected | PLANNED: hostile insertion clone |
| C15 | Source revision is exact | Every revision cross-link agrees | Accepted and mutated stream comparison | R3 | T1 | HOSTILE_REPLAY_REJECTION | Mismatch rejected | PLANNED: hostile revision clones |
| C16 | Active Philosopher tenure is required | Missing, duplicate, stale, ended, or wrong tenure rejects | Accepted clone mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | PLANNED: hostile tenure clones |
| C17 | Gained target excludes self | Real self-target command is rejected | Formal application command | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Zero events | PLANNED: OPEN V4 opportunity |
| C18 | Gained target is modeled | Missing roster/current-state target rejects | Formal application command | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Zero events | PLANNED: OPEN V4 opportunity |
| C19 | Traveller target is unsupported | Represented Traveller target rejects | Formal application boundary | R4 | T1 | APPLICATION_COMMAND_INTEGRATION | No settlement | PLANNED: bounded Traveller context |
| C20 | Target truth is settlement-time truth | Character changed before settlement uses current true role | Real accepted stream with pre-settlement change | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | New current role used | PLANNED: accepted change prefix |
| C21 | Normal GOOD target includes truth | V5 GOOD slot is target truth | Real accepted GOOD-target stream | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exactly one true role | PLANNED: normal GOOD stream |
| C22 | Normal EVIL target includes truth | V5 EVIL slot is target truth | Real accepted EVIL-target stream | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exactly one true role | PLANNED: normal EVIL stream |
| C23 | Normal pair has one truth | Both true and both false normal pairs reject | Payload and replay mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Only one truth accepted | PLANNED: normal stream clones |
| C24 | Vortox GOOD target is false | V6 excludes GOOD target truth | Real accepted Vortox GOOD stream | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Both roles false | PLANNED: Vortox GOOD stream |
| C25 | Vortox EVIL target is false | V6 excludes EVIL target truth | Real accepted Vortox EVIL stream | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Both roles false | PLANNED: Vortox EVIL stream |
| C26 | Vortox pair preserves categories | V6 contains one native GOOD and one native EVIL | Real accepted streams and catalog assertions | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact categories | PLANNED: Vortox streams |
| C27 | Candidate order is deterministic | Catalog permutations produce same pair | Pure candidate policy | R1 | T3 | PURE_POLICY_SEAM | Identical output | PLANNED: catalog permutations |
| C28 | Candidate policy is locale-free | Edge role IDs follow UTF-16 comparator | Pure comparator boundary | R1 | T3 | PURE_POLICY_SEAM | Frozen order | NONE |
| C29 | Candidate shortage cannot create illegal output | Empty legal side fails receipt-free | Formal application command | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | OPEN opportunity, zero events | PLANNED: shortage catalog |
| C30 | Native Dreamer DRUNK is isolated | Native affected player differs from Philosopher source | Real accepted duplicate chain | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Gained source remains effective | PLANNED: bridge prefix |
| C31 | Native DRUNK does not block V5 | Gained normal resolution succeeds after native DRUNK | Real accepted stream | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | V5 success | PLANNED: native DRUNK normal stream |
| C32 | Native DRUNK does not block V6 | Gained Vortox resolution succeeds after base V4 | Real accepted bridge | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | V6 success | PLANNED: A3B2 bridge |
| C33 | Source DRUNK success is unsupported | Submission fails receipt-free | Formal application command | R4 | T1 | APPLICATION_COMMAND_INTEGRATION | OPEN, zero events | PLANNED: source DRUNK prefix |
| C34 | Source POISONED success is unsupported | Submission fails receipt-free | Formal application command | R4 | T1 | APPLICATION_COMMAND_INTEGRATION | OPEN, zero events | PLANNED: source POISONED prefix |
| C35 | Unresolved Vortox cannot authorize output | Submission fails receipt-free | Formal application command | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | OPEN, zero events | PLANNED: unresolved Vortox prefix |
| C36 | Impaired Vortox cannot authorize output | Submission fails receipt-free | Formal application command | R4 | T1 | APPLICATION_COMMAND_INTEGRATION | OPEN, zero events | PLANNED: impaired Vortox prefix |
| C37 | Success is exactly atomic | Target, delivery, settlement commit together | Real batch and accepted stream | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Three contiguous events | PLANNED: normal and Vortox streams |
| C38 | Partial batch is hostile | Every missing suffix rejects replay | Persisted batch truncation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Whole stream rejected | PLANNED: hostile batch clones |
| C39 | Reversed or mixed batch is hostile | Reorder and V5/V6 mixing reject | Persisted batch mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Whole stream rejected | PLANNED: hostile batch clones |
| C40 | Prospective proof is non-circular | Full accepted prefix reconstructs expected batch before append | Real command with proof instrumentation | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Proof precedes commit | PLANNED: real accepted prefix |
| C41 | Stored delivery cannot self-prove | Semantic stored mutation rejects reconstruction | Persisted delivery mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | PLANNED: hostile delivery clones |
| C42 | Normal ledger fact is exact | V5 creates one NORMAL/no-other-ability fact | Derived ledger from accepted V5 | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact fact | PLANNED: normal stream |
| C43 | Vortox ledger fact is exact | V6 creates one ABNORMAL/Vortox fact | Derived ledger from accepted V6 | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact fact | PLANNED: Vortox stream |
| C44 | Settlement creates no second fact | Whole ledger increases by one only | Pre/post ledger assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | No duplicate fact | PLANNED: accepted gained streams |
| C45 | Evidence uses existing variants | V5 has 11 and V6 has 13 exact references | Fact/evidence validation | R1 | T2 | STRUCTURAL_VALIDATION | Exact sets | PLANNED: accepted ledger facts |
| C46 | Source player receives knowledge | Philosopher player sees exact bounded view | Accepted-stream projection | R1 | T1 | PROJECTION | One safe entry | PLANNED: source projection stream |
| C47 | Source AI receives same knowledge | AI view deep-equals player view | Accepted-stream AI projection | R1 | T1 | PROJECTION | Same safe entry | PLANNED: source AI stream |
| C48 | Non-sources receive nothing | All other player and AI views omit entry | Accepted-stream projection | R1 | T1 | PROJECTION | Omitted | PLANNED: source projection stream |
| C49 | Projection leaks no provenance | Forbidden fields absent from player and AI views | Public-view exact-shape assertion | R1 | T1 | PROJECTION | No grant, Philosopher, or Vortox leakage | PLANNED: source projections |
| C50 | Historical knowledge is stable | Later state changes do not alter delivered pair | Rebuild, mutate later state, reproject | R1 | T1 | PROJECTION | Original pair retained | PLANNED: accepted historical stream |
| C51 | Retryable failures have no receipt | Source/Vortox/shortage/prospective failures write nothing | Real fault injection | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Same command retryable | PLANNED: fault ports |
| C52 | Same-command recovery succeeds once | Failure, repair, success, repeat yields one batch | Formal retry sequence | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | One semantic success | PLANNED: fault and recovery stream |
| C53 | Accepted commit is atomic | Append/receipt sub-fault leaves no partial write | Atomic store fault injection | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Version unchanged | PLANNED: commit-store faults |
| C54 | Legacy base versions remain immutable | V1/V2/V3/V4 streams replay and project unchanged | Legacy fixtures through public replay | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | Exact previous meaning | PLANNED: legacy streams |
| C55 | Base validators reject gained shapes | Valid gained shapes cannot enter base dispatch | Cross-version shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Rejected | PLANNED: base and gained seeds |
| C56 | Gained validators reject base shapes | Valid base shapes cannot enter gained dispatch | Cross-version shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Rejected | PLANNED: base and gained seeds |
| C57 | A3B2 bridge has two distinct facts | Base V4 and gained V6 yield distinct sources and instances | Real accepted bridge ledger | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exactly two facts | PLANNED: A3B2 bridge |
| C58 | Bridge stops before Mathematician | Next task is unsettled Mathematician and no Math event exists | Real accepted bridge task inspection | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | No settlement or count | PLANNED: A3B2 bridge |
| C59 | Ownership contracts remain isolated | A3A, A3B1, and 2B19B exact audits pass | Ownership verifier self-test | R1 | T1 | CROSS_PLATFORM_CI | All contracts PASS | NONE |
| C60 | Exact profile is stable | Three full nine-process candidates have identical exact tuple | Candidate manifests and verifier | R1 | T1 | CROSS_PLATFORM_CI | Exact hashes agree | NONE |
| S01 | Source contract shape is closed | Exact 19 keys pass; every missing or extra key rejects | Direct shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed shape | PLANNED: valid source contract |
| S02 | Ability instance shape is closed | Exact 11 keys and literals required | Direct nested shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed shape | PLANNED: valid source contract |
| S03 | Grant reference shape is closed | Exact eight keys required | Direct nested shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed shape | PLANNED: valid source contract |
| S04 | Insertion reference shape is closed | Exact 11 keys required | Direct nested shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed shape | PLANNED: valid source contract |
| S05 | Opportunity V4 shape is closed | Exact 13 keys required | Direct opportunity matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed shape | PLANNED: valid V4 |
| S06 | Visibility V4 shape is closed | Exact five keys and tuple literals required | Direct visibility matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed shape | PLANNED: valid visibility |
| S07 | Target V3 shape is closed | Exact 17 keys required | Direct target matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed shape | PLANNED: valid target |
| S08 | Delivery V5 shape is closed | Exact 21 keys required | Direct V5 matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed shape | PLANNED: valid V5 |
| S09 | Delivery V6 shape is closed | Exact 22 keys required | Direct V6 matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed shape | PLANNED: valid V6 |
| S10 | Role snapshots are closed | Exact role and modifier keys required | Nested role matrix | R3 | T1 | STRUCTURAL_VALIDATION | No widened snapshot | PLANNED: valid role snapshots |
| S11 | IDs and revisions are canonical | Invalid IDs, seats, zero, negative, unsafe, stale revisions reject | Boundary-value matrix | R3 | T1 | STRUCTURAL_VALIDATION | Fail closed | NONE |
| S12 | T1 validation is exception-safe | Proxies, getters, symbols, cycles, nonplain, sparse inputs reject | Hostile-object matrix | R3 | T1 | STRUCTURAL_VALIDATION | No throw; getter count zero | NONE |
| S13 | Dispatch is version-first | Unknown or ambiguous discriminator rejects before field access | Union-dispatch hostile matrix | R3 | T1 | STRUCTURAL_VALIDATION | No fallthrough | PLANNED: all valid versions |
| S14 | Clone is isolated | Original and clone nested mutations do not cross-affect | Private clone boundary | R1 | T3 | PURE_POLICY_SEAM | Independent references | PLANNED: valid new shapes |
| S15 | Equality covers every semantic field | Equal clone true; each one-field mutation false | Fieldwise comparator matrix | R1 | T3 | PURE_POLICY_SEAM | Exact equality | PLANNED: valid new shapes |
| S16 | Cross-links are not shape-only | Individually valid but swapped chains reject | Two accepted contexts swapped | R3 | T2 | STRUCTURAL_VALIDATION | Mismatch rejected | PLANNED: two accepted chains |
| S17 | Event envelopes are exact | Wrong metadata, sequence, batch, command, version rejects | Persisted envelope mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Stream rejected | PLANNED: accepted batch clone |
| S18 | Ledger evidence is closed | Missing, extra, duplicate, or conflicting reference rejects | Fact/evidence mutation | R3 | T1 | STRUCTURAL_VALIDATION | Only canonical set accepted | PLANNED: valid facts |
| S19 | State-only projection is not provenance | Hand-built V5/V6 state omits or rejects knowledge | Public projection boundary | R3 | T1 | PROJECTION | No leak | NONE |
| S20 | Forbidden nondeterminism is absent | Static scan and cross-platform output match | Static and exact-head CI checks | R1 | T3 | CROSS_PLATFORM_CI | Deterministic output | NONE |

The criterion inventory is exactly:

```text
C01 C02 C03 C04 C05 C06 C07 C08 C09 C10
C11 C12 C13 C14 C15 C16 C17 C18 C19 C20
C21 C22 C23 C24 C25 C26 C27 C28 C29 C30
C31 C32 C33 C34 C35 C36 C37 C38 C39 C40
C41 C42 C43 C44 C45 C46 C47 C48 C49 C50
C51 C52 C53 C54 C55 C56 C57 C58 C59 C60
S01 S02 S03 S04 S05 S06 S07 S08 S09 S10
S11 S12 S13 S14 S15 S16 S17 S18 S19 S20
```

All 80 IDs are unique. Each row has one R classification, one T classification, one permitted primary layer, one expected result, and at most one supporting-authority purpose.

## Implementation-time traceability contract

After physical tests exist, create:

```text
docs/implementation/phase-3-slice-2b19b-test-traceability.md
```

Every criterion row must contain:

- `CriterionId`;
- `ActualTestFile`;
- `ActualTestTitle`;
- `ActualPrimaryLayer`;
- `ActualReachability`;
- `ActualTrust`;
- `SupportingAuthorityId`;
- `MainAssertion`;
- `ProductionEntry`;
- `FaultMechanism`;
- `MechanismMatch`.

Every row must have:

```text
MechanismMatch = PASS
```

Every actual layer, reachability, and trust value must equal this design. No row may cite a helper test as the primary authority for an accepted command, replay, projection, or CI claim.

## Coverage-profile contract

After the product implementation commit:

1. run three complete fresh coverage candidates;
2. each candidate runs all nine coverage processes;
3. each candidate runs the same merged test inventory;
4. all candidates must have identical ownership inventory;
5. all candidates must have identical source-file set;
6. all candidates must have identical zero-hit statements;
7. all candidates must have identical zero-hit functions;
8. all candidates must have identical zero-hit lines;
9. all candidates must have identical zero-hit branch arms;
10. all canonical hashes must match.

The exact profile records:

- product source HEAD;
- source-file count and SHA-256;
- zero-hit statement count and SHA-256;
- zero-hit function count and SHA-256;
- zero-hit line count and SHA-256;
- zero-hit branch-arm count and SHA-256;
- merged test inventory and ownership identity;
- three candidate run identities.

`sourceHead` binds the product implementation commit, not the profile-only commit. The profile commit may change only the exact profile, selector, coverage audit documentation, and necessary control metadata.

Forbidden:

- subset profiling;
- inequality thresholds as the exact profile;
- percentage-only comparison;
- candidate auto-learning;
- CI candidate auto-adoption;
- modification or deletion of earlier profiles;
- timeout or `onTaskUpdate` changes.

## Production allowlist

Only these six production files may change:

1. `packages/domain-core/src/first-night-action-opportunity.ts`
2. `packages/domain-core/src/dreamer.ts`
3. `packages/domain-core/src/domain-batch-semantics.ts`
4. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
5. `packages/application/src/game-application-service.ts`
6. `packages/projections/src/index.ts`

The following remain reuse-only:

- `packages/domain-core/src/philosopher-ability.ts`;
- `packages/domain-core/src/first-night-task-plan.ts`;
- `packages/domain-core/src/event-applier.ts`;
- `packages/domain-core/src/seamstress.ts`;
- `packages/domain-core/src/mathematician.ts`;
- `packages/domain-core/src/mathematician-internal.ts`;
- domain event union definitions;
- `GameState`;
- assignment and current-character-state types;
- role-tenure types;
- ledger evidence union;
- Mathematician public contracts.

If implementation requires a semantic change to a reuse-only item, stop with `RESLICE_REQUIRED`.

## Test allowlist

Only these semantic test files may change:

1. `packages/domain-core/src/first-night-action-opportunity.test.ts`
2. `packages/domain-core/src/dreamer.test.ts`
3. `packages/domain-core/src/domain-batch-semantics.test.ts`
4. `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
5. `packages/domain-core/src/rebuild.test.ts`
6. `packages/application/src/game-application-service.test.ts`
7. `packages/projections/src/private-knowledge-view.test.ts`

Infrastructure registration may change only:

- `scripts/vitest-ownership-contracts.mjs`;
- the exact coverage-profile selector consumed by `scripts/verify-coverage-obligations.mjs`, if the repository’s existing profile mechanism requires it.

No Vitest workspace, test-project, shard-count, process-isolation, timeout, dependency, or GitHub Actions topology change is allowed.

## Documentation allowlist

The Slice may create or update only:

- `docs/implementation/phase-3-slice-2b19b-design.md`;
- one independent design-review document for each consumed design round;
- `docs/implementation/phase-3-slice-2b19b-test-traceability.md`;
- `docs/implementation/phase-3-slice-2b19b-coverage-profile.md`;
- `docs/implementation/phase-3-slice-2b19b-status.md`;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`;
- `docs/agent-loop/AUTOPILOT_STATE.json`;
- `docs/agent-loop/CURRENT_TASK.md`;
- `docs/agent-loop/PROJECT_STATE.md`;
- `docs/agent-loop/AUTOPILOT_LOG.md`;
- final PR review archives required by `AGENTS.md` after merge.

Rule evidence and accepted prior design/review archives remain immutable.

## Size estimate

Estimated added production lines:

| File | Estimated added LOC |
|---|---:|
| `first-night-action-opportunity.ts` | 220–300 |
| `dreamer.ts` | 390–500 |
| `domain-batch-semantics.ts` | 120–170 |
| `first-night-ability-outcome-ledger.ts` | 100–140 |
| `game-application-service.ts` | 180–240 |
| `projections/src/index.ts` | 40–50 |
| Total | `1050–1400` |

The estimate is within the governance maximum of 1,500 and the six-file allowlist.

## Local acceptance and CI

After implementation, run focused tests first, then:

```text
pnpm typecheck
pnpm lint
node scripts/verify-vitest-ownership-contracts.mjs --self-test
nine ordinary process shards
ordinary merge
dynamic inventory
nine coverage process shards
coverage merge
coverage obligation audit
Windows deterministic equivalent
git diff --check
```

Required results:

- all focused tests pass;
- typecheck and lint pass;
- no disabled tests;
- ownership duplicate count `0`;
- ownership missing count `0`;
- ownership unexpected count `0`;
- A3A exact contract passes unchanged;
- A3B1 exact contract passes unchanged;
- 2B19B exact contract passes;
- every traceability row has `MechanismMatch=PASS`;
- all nine ordinary groups pass;
- all nine coverage groups pass;
- merged test inventory is complete;
- all three coverage candidates match exactly;
- exact profile passes;
- Windows result is deterministic;
- no timeout change;
- no `onTaskUpdate`;
- no dependency change;
- no workflow topology change;
- production scope and LOC checks pass.

The frozen final feature HEAD requires both push CI and PR CI SUCCESS for that exact SHA before independent final review.

## Rollback

Before merge, rollback is abandoning the unmerged feature branch.

After merge, compatibility rollback may disable only the new V4 gained-opportunity producer and V5/V6 producer. Validators, replay support, and projection safety for already accepted new histories must remain. No accepted event may be deleted, migrated, downgraded, or rewritten.

## Stop-Loss and stop conditions

Return `RESLICE_REQUIRED` immediately if any of the following becomes necessary:

- more than eight planned production files;
- more than 1,500 estimated added production LOC;
- more than ten actual production files;
- more than 1,800 actual added production LOC;
- a new event family;
- a new top-level `GameState` field;
- a new ledger evidence variant;
- a new role-tenure type;
- assignment or current-character-state transition;
- accepted base schema modification;
- `BaseDreamerV2SourceContract` widening;
- generic gained-ability framework;
- generic capability engine;
- source-impairment success;
- impaired-Vortox success;
- formal Mathematician settlement or count;
- inability to preserve exact replay, atomicity, prospective validation, retry, or projection safety;
- an architectural blocker remaining after Design Round 2.

Return `HUMAN_BLOCKED` for:

- substantive rule conflict;
- required rule source becoming unavailable without approved snapshot;
- inability to prove the canonical Philosopher tenure;
- need to reinterpret the accepted scheduling override;
- unsafe history rewrite;
- permission failure preventing required independent review.

Implementation stops after 2B19B closeout. It must not start 2B19A3B2, another role Slice, FIRST_NIGHT completion, DAY, or Phase 2C.

## Explicit out of scope

- source Philosopher DRUNK successful information;
- source Philosopher POISONED successful information;
- native Dreamer DRUNK propagation to the gained source;
- impaired or dead Vortox successful fallback;
- No Dashii poisoning;
- V1 gained-Dreamer commands or settlement;
- Traveller targets;
- complete Storyteller candidate choice;
- other-night Dreamer;
- death and lifecycle processing;
- general character-change producers;
- general alignment-change producers;
- formal Mathematician settlement;
- final Mathematician `trueCount`;
- combined base/gained Mathematician aggregation;
- `2B19A3B2`;
- FIRST_NIGHT completion;
- phase transition to DAY;
- Phase 2C;
- generic gained-ability infrastructure;
- new override;
- marking Dreamer, Philosopher, Vortox, or Mathematician `COMPLETE`.

## Independent rule-design review requirements

The reviewer must independently read the external sources or approved fixed revisions, `docs/rules/evidence/2B19B.md`, the official nightsheet, `docs/rules/ROLE_COVERAGE_MATRIX.md`, the governance ADR, the governance precheck, accepted V1/V2 insertion history, and accepted Dreamer V1–V4 contracts.

The reviewer must confirm:

1. V2 gained task is real R1;
2. V1 settlement remains unsupported;
3. accepted base schemas are unchanged;
4. the gained source contract is closed;
5. source current role is Philosopher;
6. ability role is Dreamer;
7. no Dreamer tenure is fabricated;
8. grant, insertion, tenure, and ability-instance provenance is complete;
9. V5 normal semantics are correct;
10. V6 Vortox semantics are correct;
11. native Dreamer DRUNK is isolated;
12. source impairment success is absent;
13. unresolved or impaired Vortox fails closed;
14. target truth is settlement-time truth;
15. the three-event batch is atomic;
16. prospective proof uses the accepted prefix;
17. normal and Vortox ledger facts are exact;
18. no second fact is produced;
19. projection is source-player and source-AI only;
20. V1 and base V2/V3/V4 replay remain exact;
21. the A3B2 bridge is real and stops before Mathematician;
22. no formal count is claimed;
23. ownership can materialize without pre-registration;
24. traceability has one exact primary layer per criterion;
25. coverage profiling is exact and source-HEAD-bound;
26. production scope and size satisfy Stop-Loss;
27. coverage remains `PARTIAL`;
28. no later Slice begins.

The only design-review verdicts are:

```text
RULE_DESIGN_PASS
RULE_DESIGN_FIX_REQUIRED
RESLICE_REQUIRED
HUMAN_BLOCKED
```

No implementation is authorized by this document alone.

`READY_FOR_RULE_DESIGN_REVIEW_ROUND_1`
