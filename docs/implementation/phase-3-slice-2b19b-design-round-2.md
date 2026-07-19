# Phase 3 Slice 2B19B Implementation Design Round 2: Philosopher-Gained Dreamer Effective-Source First-Night Execution

> This is the complete, standalone and sole implementation authority proposed for Slice `2B19B`. It supersedes Round 1 in full; it is not an addendum, erratum, or diff. No implementation is authorized until an independent read-only reviewer returns `RULE_DESIGN_PASS` for this exact Round 2 document.

## Metadata

- `sliceId`: `2B19B`
- `phase`: `Phase 3 — controlled vertical slices`
- `designRound`: `2 / 2`
- `taskType`: `PRODUCT_SLICE`
- `primaryRisk`: `PHILOSOPHER_GAINED_DREAMER_SOURCE_PROVENANCE_AND_EXECUTION`
- `branch`: `phase-3/philosopher-gained-dreamer-effective-source`
- `acceptedBaseHead`: `5ddaa2fd02e0cb73e2a5363b222e7f08c353d389`
- `githubMainHead`: `5ddaa2fd02e0cb73e2a5363b222e7f08c353d389`
- `latestAcceptedMainCI`: `29674623200 / SUCCESS / 22 of 22`
- `openPullRequestsAtDesign`: `0`
- `ruleEvidence`: `docs/rules/evidence/2B19B.md`
- `ruleEvidenceSha256`: `e1f038f32171d7cea1f89345b1cac958e30a79f47005ca444a0dc2633abe3187`
- `ruleVerdict`: `RULE_READY`
- `unresolvedRuleConflicts`: `[]`
- `governancePrecheck`: `docs/architecture/2B19B-go-no-go-under-governance-v1.md`
- `governancePrecheckSha256`: `8584df7cad510bd00a49d69b9a2d794d6a4443d7be2fc9bf3dbfd7bc79128da1`
- `governanceVerdict`: `GO`
- `parentRound1Design`: `docs/implementation/phase-3-slice-2b19b-design.md`
- `parentRound1DesignSha256`: `dca87df75bebcc9b44d396043ab03d0afcfd1f17417d1355f97c72778ec4d181`
- `parentRound1Review`: `docs/implementation/phase-3-slice-2b19b-design-review-round-1.md`
- `parentRound1ReviewSha256`: `937af88b24ab5b5cac8ba9dd1657d344b5af73e12359382a6df416d33089a1fb`
- `parentRound1ReviewVerdict`: `RULE_DESIGN_FIX_REQUIRED`
- `ruleCoverageStatus`: `PARTIAL`
- `targetSliceCoverage`: `PARTIAL / PHILOSOPHER_GAINED_EFFECTIVE_SOURCE_FIRST_NIGHT_ONLY`
- `targetDreamerCoverage`: `PARTIAL`
- `targetPhilosopherCoverage`: `PARTIAL`
- `targetMathematicianCoverage`: unchanged `PARTIAL`
- `targetVortoxCoverage`: unchanged `NOT_STARTED`
- `implementationAuthorized`: `false`
- `authorizationCondition`: one independent reviewer returns `RULE_DESIGN_PASS` for the exact materialized Round 2 bytes
- `maxProductionFiles`: `6`
- `estimatedAddedProductionLoc`: `1050–1400`
- `stopLossProductionFiles`: `>10`
- `stopLossAddedProductionLoc`: `>1800`
- `maxDesignRounds`: `2`
- `maxProductRepairRounds`: `2`

At design time the worktree contains control/design/evidence changes only. No production or test implementation exists, no PR is open, and this document does not change those facts.

## Governance classification and bounded scope

This Slice extends one real formal R1 path:

```text
SubmitPhilosopherAction
→ PhilosopherAbilityChosen
→ PhilosopherAbilityGranted
→ FirstNightTaskInsertedV2
→ canonical PHILOSOPHER_GAINED_ABILITY / DREAMER_ACTION task
→ OpenFirstNightRoleActionOpportunity
→ SubmitDreamerAction
```

It replaces the current V2 gained-Dreamer unsupported boundary with:

1. one exact actionable gained-Dreamer opportunity;
2. one target other than the Philosopher source;
3. one normal V5 delivery or one effective-Vortox V6 delivery;
4. one atomic target/delivery/settlement batch;
5. one gained ability-instance ledger fact;
6. source-only player and AI historical projection;
7. replay, prospective validation, retry, receipt and idempotency protection;
8. an accepted prefix that stops immediately before Mathematician.

The source player remains the Philosopher. The current source character remains `philosopher`. The ability role is `dreamer`. The Slice creates no Dreamer tenure, assignment transition, current-character transition, event family, top-level `GameState` field, evidence variant, generic gained-ability framework, or formal Mathematician behavior.

## Round 1 blocker closure

### F-01: public projection exact shape

The accepted public contract is frozen unchanged:

```ts
dreamerInformation: {
  readonly target: KnownPlayerReference;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
};

dreamerKnowledgeModelVersion: "dreamer-information-model-v1";

deliveredKnowledgeStages: readonly PlayerPrivateKnowledgeStage[];
```

For a projected V5 or V6 delivery, `deliveredKnowledgeStages` contains `DREAMER_INFORMATION`.

`dreamerInformation` has exactly three enumerable keys:

```text
target
goodRole
evilRole
```

It must not contain `sourcePlayerId`, source kind, Philosopher provenance, opportunity, grant, insertion, ability instance, role tenure, Vortox constraint, reliability, truth marker, ledger status, ledger cause, `knowledgeStage`, or `knowledgeModelVersion`.

`packages/domain-core/src/initial-private-knowledge.ts` is reuse-only and remains unchanged.

### F-02: reachability and authority

- formal V1 gained-Dreamer command rejection is `R1 / APPLICATION_COMMAND_INTEGRATION`;
- valid V1 replay is separately `R2 / LEGACY_REPLAY_COMPATIBILITY`;
- Traveller, candidate shortage, source DRUNK, source POISONED, and impaired-Vortox behavior are `R4 / PURE_POLICY_SEAM`;
- missing, forged, duplicate, stale, or conflicting persisted source/Vortox provenance is `R3 / HOSTILE_REPLAY_REJECTION`;
- exact accepted ledger evidence cardinality is `R1 / ACCEPTED_STREAM_INTEGRATION`;
- current historical projection authority is limited to accepted replay, repeated projection and clone isolation;
- no current claim requires a nonexistent post-delivery character/effect producer;
- receipt and retry promises apply only to real formal commands and real fault ports;
- no R4 or R3 scenario is promised a receipt, game version, or surviving OPEN opportunity.

### F-03: exact CI profile selection

A separate profile-only child commit is mandatory. Its parent is the complete product implementation HEAD. `.github/workflows/ci.yml` is allowed in that child only for the exact `--profile` selector substitution. Topology, shards, commands, timeout, dependencies, forks, merge behavior and `onTaskUpdate` remain byte-for-byte unchanged.

## Rule delta and night order

The authoritative evidence freezes:

1. Philosopher may choose Dreamer and gain its ability without becoming Dreamer.
2. A gained night ability acts at the chosen character’s normal night position.
3. First-night order is Philosopher `14/80`, Dreamer `61/80`, Mathematician `77/80`; Vortox has no first-night wake.
4. At Dreamer’s position, the approved deterministic override orders base Dreamer first, then gained Dreamers by ascending source seat, then raw UTF-16 task-ID order.
5. Dreamer chooses another non-Traveller player.
6. Normal information is one native GOOD and one native EVIL character, exactly one matching settlement-time target truth.
7. With one effective current Vortox, the same GOOD/EVIL shape is preserved and neither role matches settlement-time target truth.
8. Native Dreamer drunkenness caused by the duplicate Philosopher choice affects the native Dreamer, not the Philosopher source.
9. Delivered knowledge is historical.
10. V1 gained-Dreamer settlement remains unsupported.
11. No formal Mathematician count or settlement is part of this Slice.
12. No new override is introduced.

## Reachability

### R1 — currently reachable application paths

- real V2 Philosopher choice, grant and task insertion;
- real opening of the exact gained V4 opportunity;
- real effective-source normal V5 settlement;
- real effective-source/effective-current-Vortox V6 settlement;
- native Dreamer V4 followed by independent gained V6;
- formal V1 gained-Dreamer `ApplicationNotConfigured` rejection;
- deterministic command rejection;
- real dependency-read, state-rebuild, metadata, prospective-validation, accepted-commit and rejected-receipt-write fault ports;
- retry, recovery and idempotency;
- accepted replay, ledger derivation and source-only projection.

A hand-built `GameState` is never R1 authority.

### R2 — legacy or imported accepted history

- Dreamer opportunity V1, V2 and V3;
- Dreamer target V1 and V2;
- Dreamer delivery V1, V2, V3 and V4;
- V1 Philosopher-gained insertion history;
- valid V2 Philosopher choice/grant/insertion history;
- accepted current-character, tenure, task-plan, task-progress and ledger history.

R2 history is not migrated or reinterpreted.

### R3 — hostile or corrupted history

- wrong, missing, duplicate or conflicting Philosopher opportunity, choice, grant or insertion;
- wrong task generation, source, seat, role, chosen role, revision, schedule or ability instance;
- missing, duplicate, stale or ended Philosopher tenure;
- forged Vortox identity or tenure;
- V6 without one accepted effective current Vortox;
- malformed or mixed opportunity, target, delivery, settlement, fact or evidence;
- base/gained version mixing;
- partial, naked, reversed, split, duplicate or noncontiguous batch;
- payload-supplied provenance without matching accepted history;
- proxy, getter, symbol, cycle, sparse array, function, class instance or nonplain canonical input.

R3 fails replay/rebuild closed. It receives no receipt or OPEN-opportunity promise.

### R4 — future or hypothetical behavior

- successful source-Philosopher DRUNK or POISONED information;
- hypothetical valid source impairment capability;
- impaired or dead Vortox fallback;
- hypothetical unresolved but otherwise non-hostile Vortox capability;
- Traveller representation and targeting;
- candidate shortage under a noncanonical catalog;
- No Dashii poisoning;
- post-delivery canonical character/effect mutation without a current producer;
- other-night gained Dreamer;
- complete Storyteller free choice;
- general death/lifecycle or general character/alignment producers;
- formal combined Mathematician settlement or `trueCount`;
- `2B19A3B2`;
- FIRST_NIGHT completion, DAY, Phase 2C;
- generic gained-ability infrastructure.

R4 is tested only through bounded module-private pure seams where listed. It creates no application, receipt, event, version, or opportunity claim.

## Trust boundaries

### T1 — external or persisted

Commands, event envelopes, imported streams, stored opportunities, targets, deliveries, grants, insertions, tenures, setup/catalog snapshots, ledger evidence, projection inputs and command-store results.

T1 rejects without throwing or invoking getters:

- proxies and revoked proxies;
- accessors;
- symbol keys or values;
- cycles or repeated object references;
- functions and nonplain prototypes;
- sparse arrays;
- missing or extra enumerable keys;
- wrong primitives or literals;
- invalid IDs, seats, revisions or role snapshots.

### T2 — canonical derived state

Only values derived from a fully validated accepted prefix:

- next unsettled task;
- unique choice/grant/insertion chain;
- active Philosopher tenure;
- gained source contract and ability instance;
- settlement-time source and target state;
- effective Vortox constraint;
- expected target, delivery, settlement and ledger fact;
- authorized projection.

### T3 — module-private pure core

Dreamer-specific:

- canonical ID format/parse;
- exact key comparison;
- fieldwise clone/equality;
- UTF-16 comparator;
- native character-type classification;
- candidate filtering/selection;
- R4 capability non-selection;
- version-first predicates.

No T3 helper becomes a public generic capability engine.

## Legacy compatibility

These remain exact and unchanged:

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

No optional field may be added to an accepted base contract. Old discriminators must not accept gained shapes. Old fixtures and events are not rewritten.

Formal V1 gained-task action remains:

```text
status = failed
code = ApplicationNotConfigured
failureStage = first-night-role-action
retryable = true
receipt = absent
events = []
gameVersion = unchanged
new opportunity = absent
```

## Canonical identifiers

For source seat `SS` (`01` through `12`):

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

The last value is one continuous string. IDs reject whitespace, control characters, noncanonical seats, wrong task or chosen role, grant/task disagreement, and failure to round-trip.

## Exact gained source, grant and insertion contracts

```ts
export const DREAMER_PHILOSOPHER_GAINED_SOURCE_CONTRACT_VERSION =
  "dreamer-philosopher-gained-source-contract-v1" as const;

export type PhilosopherGainedDreamerAbilityInstanceV2 = {
  readonly provenanceVersion: "first-night-ability-instance-provenance-v1";
  readonly kind: "PHILOSOPHER_GAINED_TASK_V2";
  readonly abilityInstanceId: FirstNightAbilityInstanceId;
  readonly abilityRoleId: "dreamer";
  readonly taskId: ScheduledTaskId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly grantId: GrantedAbilityId;
  readonly sourceCharacterStateRevision: number;
  readonly schedulingVersion: "philosopher-gained-first-night-scheduling-v2";
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
  readonly schedulingVersion: "philosopher-gained-first-night-scheduling-v2";
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
  readonly schedulingVersion: "philosopher-gained-first-night-scheduling-v2";
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

Exact key sets:

```ts
const PHILOSOPHER_GAINED_DREAMER_ABILITY_INSTANCE_V2_KEYS = [
  "provenanceVersion", "kind", "abilityInstanceId", "abilityRoleId",
  "taskId", "sourcePlayerId", "sourceSeatNumber",
  "philosopherOpportunityId", "grantId",
  "sourceCharacterStateRevision", "schedulingVersion"
] as const; // 11

const PHILOSOPHER_GAINED_DREAMER_GRANT_REFERENCE_V1_KEYS = [
  "kind", "grantId", "philosopherOpportunityId", "sourcePlayerId",
  "sourceSeatNumber", "sourceRoleId", "chosenRoleId",
  "sourceCharacterStateRevision"
] as const; // 8

const PHILOSOPHER_GAINED_DREAMER_INSERTION_REFERENCE_V1_KEYS = [
  "kind", "taskId", "taskPlanVersion", "schedulingVersion",
  "philosopherOpportunityId", "grantId", "sourcePlayerId",
  "sourceSeatNumber", "sourceRoleId", "chosenRoleId",
  "sourceCharacterStateRevision"
] as const; // 11

const PHILOSOPHER_GAINED_DREAMER_SOURCE_CONTRACT_V1_KEYS = [
  "sourceContractVersion", "kind", "taskPlanVersion", "schedulingVersion",
  "taskId", "taskType", "taskSourceKind", "sourcePlayerId",
  "sourceSeatNumber", "sourceRoleId", "chosenRoleId",
  "sourceRoleTenureId", "sourceCharacterStateRevision",
  "philosopherOpportunityId", "grantId", "sourceAbilityInstanceId",
  "abilityInstance", "grantReference", "taskInsertionReference"
] as const; // 19
```

Every repeated value must agree exactly. `sourceAbilityInstanceId` equals `abilityInstance.abilityInstanceId`.

The accepted prefix must prove exactly one mutually consistent closed Philosopher opportunity, choice, grant, V2 insertion, scheduled task and active Philosopher tenure. It must prove there is no gained Dreamer tenure.

## Exact V4 opportunity and visibility

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

Exact key sets:

```ts
const DREAMER_ACTION_OPPORTUNITY_VISIBILITY_V4_KEYS = [
  "visibilitySchemaVersion", "canChooseTarget", "supportedDecisionKinds",
  "futureUnsupportedDecisionKinds", "targetSchema"
] as const; // 5

const DREAMER_ACTION_OPPORTUNITY_V4_KEYS = [
  "opportunitySchemaVersion", "nightNumber", "opportunityId",
  "opportunityKind", "opportunityStatus", "taskId", "taskType",
  "sourcePlayerId", "sourceSeatNumber", "sourceRole",
  "sourceCharacterStateRevision", "sourceContract", "visibility"
] as const; // 13
```

The producer creates only `OPEN`. Stored replay accepts a canonical `OPEN` or the exact `CLOSED` form produced by successful settlement. Closing changes only status.

Opening proves phase, V2 plan, next unsettled task, gained source, exact ID, unique choice/grant/insertion/tenure/instance, no prior opportunity for the task and no settlement. Provenance failure is not a legal OPEN opportunity.

## Exact V3 target

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

Exact keys:

```ts
const DREAMER_TARGET_CHOSEN_V3_KEYS = [
  "rulesBaselineVersion", "targetSchemaVersion", "nightNumber", "taskId",
  "taskType", "opportunityId", "opportunitySchemaVersion", "decisionKind",
  "sourcePlayerId", "sourceSeatNumber", "sourceRole",
  "sourceCharacterStateRevision", "evaluatedCharacterStateRevision",
  "sourceContract", "abilityRoleId", "targetPlayerId", "targetSeatNumber"
] as const; // 17
```

The target must be one other current modeled roster player and occur exactly once in the current character state. Self and missing targets are formal R1 rejections. Traveller restriction remains an R4 pure-policy seam because the current role model has no canonical Traveller producer.

The target payload carries no target role, target alignment, truth marker, Vortox status, reliability or ledger result.

## Exact normal V5 delivery

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

Exact keys:

```ts
const PHILOSOPHER_GAINED_DREAMER_EFFECTIVE_RELIABILITY_KEYS =
  ["kind"] as const;

const DREAMER_INFORMATION_DELIVERED_V5_KEYS = [
  "rulesBaselineVersion", "deliverySchemaVersion", "nightNumber", "taskId",
  "taskType", "opportunityId", "opportunitySchemaVersion",
  "knowledgeModelVersion", "knowledgeStage", "sourcePlayerId",
  "sourceSeatNumber", "sourceCharacterStateRevision",
  "evaluatedCharacterStateRevision", "sourceContract", "abilityRoleId",
  "targetPlayerId", "targetSeatNumber", "informationReliability",
  "goodRole", "evilRole", "falseRolePolicyVersion"
] as const; // 21
```

V5 requires an effective Philosopher source, no current Vortox, one native GOOD role, one native EVIL role, and exactly one delivered role equal to target truth at the evaluation revision.

## Exact Vortox V6 delivery

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

The existing Vortox constraint remains exact:

```ts
const DREAMER_VORTOX_CONSTRAINT_KEYS = [
  "constraintVersion", "kind", "vortoxPlayerId", "vortoxSeatNumber",
  "vortoxRoleId", "vortoxRoleTenureId",
  "evaluatedCharacterStateRevision"
] as const; // 7
```

Exact V6 keys:

```ts
const PHILOSOPHER_GAINED_DREAMER_VORTOX_RELIABILITY_KEYS =
  ["kind"] as const;

const DREAMER_INFORMATION_DELIVERED_V6_KEYS = [
  "rulesBaselineVersion", "deliverySchemaVersion", "nightNumber", "taskId",
  "taskType", "opportunityId", "opportunitySchemaVersion",
  "knowledgeModelVersion", "knowledgeStage", "sourcePlayerId",
  "sourceSeatNumber", "sourceCharacterStateRevision",
  "evaluatedCharacterStateRevision", "sourceContract", "abilityRoleId",
  "targetPlayerId", "targetSeatNumber", "informationReliability",
  "vortoxConstraint", "goodRole", "evilRole", "falseRolePolicyVersion"
] as const; // 22
```

V6 requires exactly one current effective Vortox with one active tenure, an effective Philosopher source, one native GOOD and one native EVIL role, and neither role equal to target truth.

A stored V6 whose Vortox identity, tenure, revision or effectiveness is not proven by accepted history is hostile R3 and rejects replay/rebuild. Hypothetical impaired-Vortox selection remains R4.

## Shared nested shapes

Every new `RoleSetupSnapshot` uses exactly:

```ts
const ROLE_SETUP_SNAPSHOT_KEYS = [
  "roleId", "characterType", "defaultAlignment", "edition", "setupModifier"
] as const;

const SETUP_MODIFIER_KEYS = [
  "outsiderDelta", "townsfolkDelta"
] as const;
```

Every new validator dispatches by version first and then validates exact closed fields. Clone and equality are fieldwise. JSON serialization, pre-validation spread, nested reference equality and schema widening are forbidden.

## Capability and non-selection matrix

| Context | Reachability | Authority | Result |
|---|---|---|---|
| Effective gained source; no current Vortox | R1 | accepted stream | select V5 |
| Effective gained source; exactly one effective current Vortox | R1 | accepted stream | select V6 |
| Native Dreamer is canonically DRUNK; Philosopher source effective; no Vortox | R1 | accepted stream | select V5 |
| Native Dreamer is canonically DRUNK; Philosopher source effective; effective Vortox | R1 | accepted stream | select V6 |
| Formal V1 gained task | R1 | application command | receipt-free `ApplicationNotConfigured`; no new opportunity/event |
| Valid historical V1 gained task | R2 | legacy replay | exact replay; no migration |
| Forged/missing source grant, insertion or tenure | R3 | hostile replay | replay/rebuild rejection |
| Forged/missing Vortox identity or tenure in V6 | R3 | hostile replay | replay/rebuild rejection |
| Source DRUNK | R4 | pure policy seam | no V5/V6 selected; no application/receipt/opportunity claim |
| Source POISONED | R4 | pure policy seam | no V5/V6 selected; no application/receipt/opportunity claim |
| Impaired/dead Vortox | R4 | pure policy seam | no V5/V6 selected; no application/receipt/opportunity claim |
| Traveller target | R4 | pure policy seam | ineligible; no application/receipt claim |
| Candidate shortage | R4 | pure policy seam | no legal pair selected; no application/receipt claim |

## Deterministic candidate policy

GOOD means native `TOWNSFOLK` or `OUTSIDER`; EVIL means native `MINION` or `DEMON`. Player alignment is irrelevant.

Role IDs are compared by raw UTF-16 code units, left to right; the shorter exact prefix sorts first.

Forbidden:

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

Normal:

- GOOD target: truth in `goodRole`; first sorted legal EVIL in `evilRole`;
- EVIL target: truth in `evilRole`; first sorted legal GOOD in `goodRole`.

Vortox:

- first sorted legal GOOD excluding target truth;
- first sorted legal EVIL excluding target truth.

Catalog permutations produce identical results. Candidate shortage is only an R4 pure-policy non-selection test because canonical R1 setup contains the fixed legal role catalog.

## Base/gained isolation

| Concern | Base Dreamer | Gained Dreamer |
|---|---|---|
| current source role | `dreamer` | `philosopher` |
| ability role | `dreamer` | `dreamer` |
| task source | `ROLE` | `PHILOSOPHER_GAINED_ABILITY` |
| tenure | Dreamer tenure | Philosopher tenure |
| ability instance | `BASE_ROLE_TASK` | `PHILOSOPHER_GAINED_TASK_V2` |
| opportunity | V1/V2/V3 | V4 |
| target | V1/V2 | V3 |
| delivery | V1/V2/V3/V4 | V5/V6 |

A valid base shape never satisfies a gained validator, and vice versa.

## Source tenure and provenance

The source contract refers to one existing Philosopher tenure:

- exactly one matching tenure exists;
- player and seat match source;
- role is `philosopher`;
- acquisition revision is not later than evaluation;
- end revision is absent or later than evaluation;
- current source role is `philosopher`.

The prefix additionally proves the closed Philosopher opportunity, choice of Dreamer, canonical grant, V2 insertion, task catalog binding, exact scheduling, exact revision cross-links, base-before-gained order, absence of V1 mixing, and no duplicates.

Payload shape is never provenance.

## Prospective accepted-prefix proof

Before append, a Dreamer-specific validator receives:

```ts
{
  readonly priorAcceptedEvents: readonly AnyDomainEventEnvelope[];
  readonly targetEvent: DomainEventEnvelope<"DreamerTargetChosen">;
  readonly deliveryEvent:
    DomainEventEnvelope<"DreamerInformationDelivered">;
  readonly settlementEvent: DomainEventEnvelope<"ScheduledTaskSettled">;
}
```

It must:

1. validate all inputs exception-safely;
2. rebuild the full accepted prefix;
3. prove phase, plan, progress, roster, setup, current-character state, grants, insertions, tenures, impairments, opportunities and ledger;
4. prove the exact next V2 gained Dreamer task;
5. prove choice/grant/insertion/tenure/instance provenance;
6. prove one unique OPEN V4 opportunity;
7. validate the target;
8. read target truth at the pre-event evaluation revision;
9. resolve source effectiveness;
10. resolve effective current Vortox;
11. build deterministic candidates;
12. reconstruct exact V3 and V5 or V6 payloads;
13. reconstruct settlement;
14. compare all fields;
15. validate one atomic three-event batch;
16. prospectively apply it;
17. derive exactly one new gained ledger fact;
18. prove opportunity CLOSED, task settled and phase still FIRST_NIGHT.

Caller-supplied truth, capability, source contract, Vortox decision, tenure or ledger is forbidden. A stored delivery cannot prove itself.

## Atomic batch and replay

A successful V4 submission emits exactly:

1. `DreamerTargetChosen` V3;
2. `DreamerInformationDelivered` V5 or V6;
3. existing `ScheduledTaskSettled`.

All three share command ID, batch ID, committed game version, rules baseline, correlation and causation chain, and use contiguous sequences.

Settlement is:

```text
taskId = gained task ID
taskType = DREAMER_ACTION
nightNumber = 1
settlementVersion = scheduled-task-settlement-v1
outcomeType = DREAMER_INFORMATION_DELIVERED
characterStateRevision = evaluatedCharacterStateRevision
```

The batch closes only the matching V4 opportunity, settles only the matching gained task, remains in FIRST_NIGHT, emits no phase transition, changes no assignment/grant/insertion/role/tenure history, and emits no base event.

Replay rejects naked, partial, reversed, split, noncontiguous, duplicated or mixed V5/V6/base/gained batches and wrong metadata or settlement.

## Ledger

No new fact type, cause, status, evidence variant or public Mathematician contract is added.

### V5 fact

```text
sourcePlayerId = Philosopher player
sourceSeatNumber = Philosopher seat
abilityRoleId = dreamer
abilityTaskId = gained task
abilityInstance.kind = PHILOSOPHER_GAINED_TASK_V2
outcomeStatus = NORMAL
causeKind = NO_OTHER_CHARACTER_ABILITY
causedByAnotherCharacterAbility = false
```

Accepted-stream derivation yields exactly 11 canonically ordered references:

1. `SOURCE_EVENT`;
2. `TASK`;
3. `CHARACTER_STATE`;
4. source `PLAYER_ROLE_AT_REVISION` for Philosopher;
5. gained V4 `ACTION_OPPORTUNITY`;
6. active Philosopher `ROLE_TENURE`;
7. original closed Philosopher `ACTION_OPPORTUNITY`;
8. `PHILOSOPHER_GRANT`;
9. `FIRST_NIGHT_TASK_INSERTION`;
10. target `PLAYER_ROLE_AT_REVISION`;
11. `DREAMER_DELIVERY`.

### V6 fact

```text
sourcePlayerId = Philosopher player
sourceSeatNumber = Philosopher seat
abilityRoleId = dreamer
abilityTaskId = gained task
abilityInstance.kind = PHILOSOPHER_GAINED_TASK_V2
outcomeStatus = ABNORMAL
causeKind = VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility = true
```

It has exactly the V5 eleven plus:

12. Vortox `PLAYER_ROLE_AT_REVISION`;
13. active Vortox `ROLE_TENURE`.

`ScheduledTaskSettled` creates no second fact. No Dreamer tenure evidence is fabricated.

## Private projection

Only the source Philosopher player and the AI controlling that player receive the gained Dreamer result.

Their public entry is exactly:

```ts
{
  target: KnownPlayerReference;
  goodRole: RoleSetupSnapshot;
  evilRole: RoleSetupSnapshot;
}
```

The sibling fields are:

```ts
dreamerKnowledgeModelVersion: "dreamer-information-model-v1";
deliveredKnowledgeStages: [
  /* existing canonical prior stages */,
  "DREAMER_INFORMATION"
];
```

All non-source player and AI views omit both `dreamerInformation` and `dreamerKnowledgeModelVersion` and do not add the Dreamer stage.

Projection requires accepted-stream provenance. A state-only V5/V6 representation is rejected or omitted. The accepted stored pair is projected directly and never recomputed from current source, target, impairment or Vortox state.

Current R1 historical-stability authority is:

- exact accepted replay;
- repeated projection returns the same value;
- mutating a caller-owned clone cannot mutate stored history or later projection.

A true later canonical mutation producer is not claimed by this Slice and remains R4. Future producers must preserve the frozen no-recomputation invariant.

## Receipts, failures and retry

### Deterministic formal rejections

These use the existing rejected-receipt path and append zero events:

- unauthorized actor;
- stale expected version;
- malformed command;
- wrong task or opportunity;
- CLOSED opportunity;
- self target;
- target absent from the modeled roster/current state.

A changed command must use a new command ID. Same ID with different content retains the existing idempotency-conflict contract.

### Receipt-free real failures

Only actual formal paths and fault ports are promised:

| Real R1 failure | Code | Stage | Receipt | Events | Version |
|---|---|---|---:|---:|---|
| V1 gained formal action | `ApplicationNotConfigured` | `first-night-role-action` | none | 0 | unchanged |
| command-store read | `CommandStoreReadFailed` | `event-load` | none | 0 | unchanged/unknown as existing result permits |
| canonical rebuild | `CanonicalStateRebuildFailed` | `state-rebuild` | none | 0 | unchanged/unknown as existing result permits |
| metadata generation | `MetadataGenerationFailed` | `event-metadata` | none | 0 | unchanged |
| prospective validation | existing `DependencyExecutionFailed` | `prospective-validation` | none | 0 | unchanged |
| accepted commit | `EventStoreAppendFailed` | `accepted-commit` | none | 0 accepted | unchanged |
| rejected receipt write | `CommandReceiptWriteFailed` | `rejected-receipt-write` | none | 0 accepted | unchanged |

All are `retryable=true`. The identical command ID may be retried after the real fault is repaired. After success it commits one batch and one accepted receipt; subsequent identical retries return the accepted result idempotently and append nothing.

Source DRUNK/POISONED, impaired Vortox, Traveller and shortage carry no receipt contract because they are R4. Forged provenance carries no receipt contract because it is R3 replay rejection.

`commitAcceptedCommand` remains the sole atomic accepted write. Adapter append/receipt sub-failure must not leave a partial event or receipt.

## 2B19A3B2 bridge boundary

One real accepted scenario must establish:

```text
Philosopher chooses Dreamer
→ native Dreamer becomes canonically DRUNK
→ effective Vortox is current
→ base Dreamer V4 settles
→ gained V4 opens
→ gained V6 settles
→ next unsettled task is MATHEMATICIAN_INFORMATION
```

It proves:

- base source is native Dreamer;
- gained source is Philosopher;
- source IDs differ;
- ability-instance IDs differ;
- base instance is `BASE_ROLE_TASK`;
- gained instance is `PHILOSOPHER_GAINED_TASK_V2`;
- the ledger contains exactly two distinct terminal Dreamer facts;
- native Dreamer DRUNK does not impair the gained source;
- the gained fact is Vortox abnormal;
- no Mathematician command, delivery, settlement or `trueCount` exists.

This is future supporting authority only. Implementation stops before Mathematician.

## Ownership contract

All application tests whose title begins `[2B19B-` belong to:

```text
application-service-dreamer-vortox
```

Traceability:

```text
docs/implementation/phase-3-slice-2b19b-test-traceability.md
```

Supporting authority prefix:

```text
SUP-2B19B-
```

The active 2B19B registry record may be added only in the full product implementation commit after final tests and traceability exist. It must cover exactly `C01–C60` and `S01–S20`.

A3A and A3B1 records remain semantically and byte-for-byte unchanged. No preregistration, empty registration, candidate learning, tenth project/group, registry schema change, cross-contract test binding, cross-contract support reference or unknown marker is allowed.

## Planned supporting authorities

Final IDs are assigned only after materialization. Permitted purposes are:

1. accepted V2 Philosopher choice/grant/insertion/tenure chain;
2. accepted V5 GOOD-target stream;
3. accepted V5 EVIL-target stream;
4. accepted V6 GOOD-target stream;
5. accepted V6 EVIL-target stream;
6. accepted base-V4-to-gained-V6 bridge;
7. valid legacy V1–V4 histories;
8. hostile clones for provenance, versions, batch, facts and evidence;
9. real command-store, rebuild, metadata, prospective, commit and receipt fault ports;
10. exact player/AI accepted-stream projection;
11. three independent full coverage candidates and manifests.

R4 pure seams require no accepted-stream support.

Each materialized support records producer, source identity, `ACCEPTED|LEGACY|HOSTILE`, mutation disposition, consuming criteria and immutable hash where applicable.

## Design-time traceability

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C01 | Philosopher gains Dreamer | Real V2 command creates exact choice, grant and insertion | Accepted command and stream inspection | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Canonical chain | Accepted V2 chain |
| C02 | Gained task acts at Dreamer position | Rebuilt plan orders Philosopher, base Dreamer, gained Dreamer | Accepted plan replay | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact order | Accepted V2 chain |
| C03 | Base precedes gained | Same-position base task sorts before gained | Direct canonical-order assertion | R1 | T2 | STRUCTURAL_VALIDATION | Base first | Accepted plan |
| C04 | Task ID is canonical | V2 gained ID round-trips exact grammar | Pure formatter/parser | R1 | T3 | PURE_POLICY_SEAM | Exact ID | NONE |
| C05 | Grant ID is canonical | Grant ID binds seat and Dreamer | Pure formatter/parser | R1 | T3 | PURE_POLICY_SEAM | Exact ID | NONE |
| C06 | Ability instance is gained V2 | Exact 11-key instance round-trips | Direct validator plus accepted chain | R1 | T2 | STRUCTURAL_VALIDATION | `PHILOSOPHER_GAINED_TASK_V2` | Accepted V2 chain |
| C07 | Source remains Philosopher | Current source role and active tenure are Philosopher | Accepted replay | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | No role change | Accepted V2 chain |
| C08 | Ability role is Dreamer | Contract, task and fact use `dreamer` | Accepted replay and ledger | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Dreamer ability | Accepted gained stream |
| C09 | No fake Dreamer tenure | Exactly one Philosopher tenure; no gained Dreamer tenure | Whole-stream assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | No fake tenure | Accepted gained stream |
| C10 | V4 producer and accepted transition are exact | Real producer creates exact OPEN; successful accepted settlement yields exact CLOSED | Formal command, append and rebuild | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | OPEN then CLOSED | Accepted V4 stream |
| C11 | Opportunity ID is canonical | Exact gained opportunity ID round-trips | Pure formatter/parser | R1 | T3 | PURE_POLICY_SEAM | Exact ID | NONE |
| C12 | Formal V1 action remains unsupported | Real V1 command returns exact receipt-free failure | Formal application command | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | No event/opportunity | Valid V1 prefix |
| C13 | Grant provenance is exact | Mutated stored grant rejects whole stream | Hostile accepted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | Rejected | Hostile grant clone |
| C14 | Insertion provenance is exact | Mutated stored insertion rejects whole stream | Hostile accepted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | Rejected | Hostile insertion clone |
| C15 | Source revision is exact | Any revision disagreement rejects | Hostile accepted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | Rejected | Hostile revision clone |
| C16 | Active Philosopher tenure is required | Missing, duplicate, stale, ended or wrong tenure rejects | Hostile accepted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | Rejected | Hostile tenure clones |
| C17 | Target excludes source | Real self-target command rejects with zero events | Formal application command | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Rejected receipt | Accepted OPEN V4 |
| C18 | Target is modeled | Missing roster/current-state target rejects | Formal application command | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Rejected receipt | Accepted OPEN V4 |
| C19 | Traveller is unsupported | Pure target policy marks represented Traveller ineligible | Dreamer-specific pure seam | R4 | T3 | PURE_POLICY_SEAM | No eligible target | NONE |
| C20 | Truth is settlement-time truth | Existing accepted pre-settlement character change is used | Accepted stream with real producer | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Current role used | Accepted change prefix |
| C21 | Normal GOOD target includes truth | V5 GOOD slot equals target truth | Real accepted command | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exactly one truth | Accepted V5 GOOD |
| C22 | Normal EVIL target includes truth | V5 EVIL slot equals target truth | Real accepted command | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exactly one truth | Accepted V5 EVIL |
| C23 | Normal pair has one truth | Stored both-true/both-false V5 rejects | Hostile delivery mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Rejected | Hostile V5 clones |
| C24 | Vortox GOOD target is false | V6 excludes GOOD target truth | Real accepted command | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Both false | Accepted V6 GOOD |
| C25 | Vortox EVIL target is false | V6 excludes EVIL target truth | Real accepted command | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Both false | Accepted V6 EVIL |
| C26 | Vortox preserves categories | V6 is one native GOOD plus one native EVIL | Accepted stream and catalog | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact categories | Accepted V6 streams |
| C27 | Candidate order is deterministic | Catalog permutations produce same pair | Pure selector | R1 | T3 | PURE_POLICY_SEAM | Identical output | NONE |
| C28 | Candidate policy is locale-free | Edge IDs follow UTF-16 code-unit order | Pure comparator | R1 | T3 | PURE_POLICY_SEAM | Frozen order | NONE |
| C29 | Shortage cannot create illegal pair | Pure noncanonical shortage context selects no pair | Dreamer-specific pure seam | R4 | T3 | PURE_POLICY_SEAM | No selection | NONE |
| C30 | Native Dreamer DRUNK is isolated | Affected native player differs from Philosopher source | Accepted duplicate chain | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Source remains effective | Accepted bridge |
| C31 | Native DRUNK does not block V5 | Gained normal resolution succeeds independently | Real accepted stream | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | V5 success | Accepted native-DRUNK V5 |
| C32 | Native DRUNK does not block V6 | Gained Vortox resolution succeeds after base V4 | Real accepted bridge | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | V6 success | Accepted bridge |
| C33 | Source DRUNK success is unsupported | Pure capability seam never selects V5/V6 | Dreamer-specific pure seam | R4 | T3 | PURE_POLICY_SEAM | Unsupported non-selection | NONE |
| C34 | Source POISONED success is unsupported | Pure capability seam never selects V5/V6 | Dreamer-specific pure seam | R4 | T3 | PURE_POLICY_SEAM | Unsupported non-selection | NONE |
| C35 | Hostile Vortox provenance cannot authorize V6 | Missing/forged/stale Vortox link rejects replay | Hostile accepted clone | R3 | T1 | HOSTILE_REPLAY_REJECTION | Rejected | Hostile V6 clones |
| C36 | Impaired Vortox success is unsupported | Pure capability seam never selects V5/V6 fallback | Dreamer-specific pure seam | R4 | T3 | PURE_POLICY_SEAM | Unsupported non-selection | NONE |
| C37 | Success is exactly atomic | Target, delivery and settlement commit together | Formal accepted command | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Three contiguous events | Accepted V5/V6 |
| C38 | Partial batch is hostile | Every missing suffix rejects replay | Persisted truncation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Rejected | Hostile batch clones |
| C39 | Reversed/mixed batch is hostile | Reorder and V5/V6 mixing reject | Persisted mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Rejected | Hostile batch clones |
| C40 | Prospective proof is non-circular | Full prefix reconstructs expected batch before commit | Formal accepted command with proof seam | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Proof precedes append | Accepted prefix |
| C41 | Stored delivery cannot self-prove | Semantic stored mutation rejects reconstruction | Persisted mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Rejected | Hostile delivery clone |
| C42 | Normal ledger fact is exact | V5 creates one NORMAL/no-other-ability fact | Accepted ledger derivation | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact fact | Accepted V5 |
| C43 | Vortox ledger fact is exact | V6 creates one ABNORMAL/Vortox fact | Accepted ledger derivation | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact fact | Accepted V6 |
| C44 | Settlement creates no second fact | Ledger increases by exactly one per gained delivery | Accepted pre/post ledger | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | No duplicate | Accepted V5/V6 |
| C45 | Evidence uses exact existing variants | Accepted V5 derives 11 and V6 derives 13 references | Accepted-stream ledger derivation | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact cardinality/set | Accepted V5/V6 facts |
| C46 | Source player receives knowledge | Source view has exact three-key Dreamer entry | Accepted-stream projection | R1 | T1 | PROJECTION | Safe entry | Accepted projection stream |
| C47 | Source AI receives same knowledge | Source AI Dreamer result deep-equals player result | Accepted-stream AI projection | R1 | T1 | PROJECTION | Same safe entry | Accepted projection stream |
| C48 | Non-sources receive nothing | All other player/AI views omit entry/version/stage | Accepted-stream projection | R1 | T1 | PROJECTION | Omitted | Accepted projection stream |
| C49 | Projection leaks no provenance | Forbidden source, grant, Vortox, truth and reliability fields absent | Exact public-view assertion | R1 | T1 | PROJECTION | No leakage | Accepted projection stream |
| C50 | Current historical projection is stable | Accepted replay and repeated projection are identical; caller-clone mutation is isolated | Accepted-stream projection/replay | R1 | T1 | PROJECTION | Stored pair retained | Accepted projection stream |
| C51 | Real retryable faults have no receipt | Read/rebuild/metadata/prospective/commit/receipt fault ports write no accepted unit | Real fault injection | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Retryable, version-safe | Real fault ports |
| C52 | Same-command recovery succeeds once | Repair, retry, then repeat yields one semantic success | Formal retry sequence | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | One batch/receipt | Real fault and recovery |
| C53 | Accepted commit is atomic | Append/receipt sub-fault leaves no partial write | Atomic store fault | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Version unchanged | Commit-store faults |
| C54 | Legacy versions remain immutable | Valid V1–V4 and V1 gained histories replay unchanged | Public legacy replay | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | Exact prior meaning | Legacy fixtures |
| C55 | Base validators reject gained shapes | Valid gained shapes cannot enter base dispatch | Cross-version direct matrix | R3 | T1 | STRUCTURAL_VALIDATION | Rejected | Valid base/gained seeds |
| C56 | Gained validators reject base shapes | Valid base shapes cannot enter gained dispatch | Cross-version direct matrix | R3 | T1 | STRUCTURAL_VALIDATION | Rejected | Valid base/gained seeds |
| C57 | Bridge has two distinct facts | Base V4 and gained V6 have distinct sources/instances | Accepted bridge ledger | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exactly two facts | Accepted bridge |
| C58 | Bridge stops before Mathematician | Next task is unsettled Math; no Math event exists | Accepted task inspection | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | No count/settlement | Accepted bridge |
| C59 | Ownership contracts are isolated | A3A, A3B1 and 2B19B exact audits pass | Ownership verifier | R1 | T1 | CROSS_PLATFORM_CI | All pass | Frozen ownership inventory |
| C60 | Exact profile and selector are stable | Three full candidates share tuple/ownership; exact-head CI requests and consumes exact 2B19B profile | Candidate manifests, scoped diff and CI | R1 | T1 | CROSS_PLATFORM_CI | Exact profile match | Three frozen manifests |
| S01 | Source contract shape is closed | Exact 19 keys pass; missing/extra reject | Direct shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed | Valid contract |
| S02 | Ability instance shape is closed | Exact 11 keys/literals required | Direct nested matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed | Valid contract |
| S03 | Grant reference shape is closed | Exact 8 keys required | Direct nested matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed | Valid contract |
| S04 | Insertion reference shape is closed | Exact 11 keys required | Direct nested matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed | Valid contract |
| S05 | Opportunity V4 shape is closed | Exact 13 keys required | Direct matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed | Valid V4 |
| S06 | Visibility V4 shape is closed | Exact 5 keys and tuple literals required | Direct matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed | Valid visibility |
| S07 | Target V3 shape is closed | Exact 17 keys required | Direct matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed | Valid V3 |
| S08 | Delivery V5 shape is closed | Exact 21 keys required | Direct matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed | Valid V5 |
| S09 | Delivery V6 shape is closed | Exact 22 keys required | Direct matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed | Valid V6 |
| S10 | Role snapshots are closed | Exact role/modifier keys required | Nested matrix | R3 | T1 | STRUCTURAL_VALIDATION | Closed | Valid snapshots |
| S11 | IDs/revisions are canonical | Invalid seats, revisions, unsafe/stale IDs reject | Boundary matrix | R3 | T1 | STRUCTURAL_VALIDATION | Fail closed | NONE |
| S12 | T1 validation is exception-safe | Proxies/getters/symbols/cycles/nonplain/sparse reject without getter invocation | Hostile-object matrix | R3 | T1 | STRUCTURAL_VALIDATION | No throw; getter count 0 | NONE |
| S13 | Dispatch is version-first | Unknown/ambiguous discriminator rejects before variant access | Union-dispatch matrix | R3 | T1 | STRUCTURAL_VALIDATION | No fallthrough | Valid versions |
| S14 | Clone is isolated | Original/clone nested mutations do not cross-affect | Pure clone boundary | R1 | T3 | PURE_POLICY_SEAM | Independent references | Valid new shapes |
| S15 | Equality covers semantic fields | Equal clone true; every one-field mutation false | Pure comparator matrix | R1 | T3 | PURE_POLICY_SEAM | Exact equality | Valid new shapes |
| S16 | Cross-links are not shape-only | Swapped individually valid chains reject | Direct cross-link matrix | R3 | T2 | STRUCTURAL_VALIDATION | Rejected | Two valid chains |
| S17 | Event envelopes are exact | Wrong metadata, sequence, batch, command or version rejects | Persisted mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Stream rejected | Accepted batch clone |
| S18 | Ledger evidence is closed | Missing, extra, duplicate or conflicting reference rejects | Direct fact/evidence mutation | R3 | T1 | STRUCTURAL_VALIDATION | Canonical set only | Valid facts |
| S19 | State-only projection is not provenance | Hand-built V5/V6 state rejects or omits knowledge | Public projection boundary | R3 | T1 | PROJECTION | No leak | NONE |
| S20 | Forbidden nondeterminism is absent | Static scan and cross-platform output match | Static audit and CI | R1 | T3 | CROSS_PLATFORM_CI | Deterministic | NONE |

Exactly 80 rows exist: `C01–C60` and `S01–S20`. Each row has one reachability, one trust class and one primary layer.

## Implementation-time traceability

After physical tests exist, create:

```text
docs/implementation/phase-3-slice-2b19b-test-traceability.md
```

Each criterion retains the nine design fields and records:

- `CriterionId`
- `ActualTestFile`
- `ActualTestTitle`
- `ActualPrimaryLayer`
- `ActualReachability`
- `ActualTrust`
- `SupportingAuthorityId`
- `MainAssertion`
- `ProductionEntry`
- `FaultMechanism`
- `MechanismMatch`

Every row must have `MechanismMatch=PASS`. One physical test identity has one primary layer. Supporting authority never substitutes for the primary mechanism.

## Product production allowlist

Only these six product production files may change:

1. `packages/domain-core/src/first-night-action-opportunity.ts`
2. `packages/domain-core/src/dreamer.ts`
3. `packages/domain-core/src/domain-batch-semantics.ts`
4. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
5. `packages/application/src/game-application-service.ts`
6. `packages/projections/src/index.ts`

Reuse-only includes:

- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/mathematician.ts`
- `packages/domain-core/src/mathematician-internal.ts`
- event union, assignment, current-character, tenure and evidence types
- Mathematician public contracts.

A required semantic change to a reuse-only item is `RESLICE_REQUIRED`.

## Product test and ownership allowlist

Semantic test changes are limited to:

1. `packages/domain-core/src/first-night-action-opportunity.test.ts`
2. `packages/domain-core/src/dreamer.test.ts`
3. `packages/domain-core/src/domain-batch-semantics.test.ts`
4. `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
5. `packages/domain-core/src/rebuild.test.ts`
6. `packages/application/src/game-application-service.test.ts`
7. `packages/projections/src/private-knowledge-view.test.ts`

The full product implementation commit may also change:

- `scripts/vitest-ownership-contracts.mjs`, solely to materialize the exact active 2B19B ownership record after tests and traceability exist;
- `docs/implementation/phase-3-slice-2b19b-test-traceability.md`;
- authorized status/control documents;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`, without marking any affected role COMPLETE.

It must not contain a coverage profile or CI selector change.

## Separate profile-only child commit

Let:

- `P` = full 40-character product implementation HEAD after production, tests, traceability, supporting authorities, ownership contract, matrix and product-status materialization;
- `Q` = the profile-only child commit;
- required relation: `Q^ = P` exactly.

Before creating `Q`, run three fresh complete nine-process coverage candidates from exact `P`.

Freeze:

```text
profileId =
phase-3-slice-2b19b-<first-7-lowercase-hex-of-P>-ownership-v2-1

sourceHead = P
sourceKind = PRODUCT_IMPLEMENTATION_STABLE_NINE_PROCESS_BASELINE
topology = NINE_PROCESS_COVERAGE_OWNERSHIP_V2_1
```

Before final exact-head CI, freeze the exact three candidate identities:

- `candidate-run-1` manifest SHA-256;
- `candidate-run-2` manifest SHA-256;
- `candidate-run-3` manifest SHA-256;

and for each candidate record the run window, nine shard identities, test inventory hash, ownership inventory hash, merged coverage semantic audit hash and manifest hash.

All three candidates must have identical:

- source-file count and hash;
- zero-hit statement count and hash;
- zero-hit function count and hash;
- zero-hit line count and hash;
- zero-hit branch-arm count and hash;
- merged test inventory;
- ownership identities;
- nine-process group identities.

`Q` may change only:

1. `scripts/verify-coverage-obligations.mjs`
   - append one immutable exact 2B19B profile;
   - do not modify or delete old profiles;
2. `.github/workflows/ci.yml`
   - replace only the explicit `--profile <old-id>` value with the exact 2B19B profile ID;
3. `docs/implementation/phase-3-slice-2b19b-coverage-profile.md`;
4. `docs/implementation/phase-3-slice-2b19b-test-traceability.md`
   - only the C60 exact candidate/profile binding;
5. necessary 2B19B status/control metadata:
   - `docs/implementation/phase-3-slice-2b19b-status.md`
   - `docs/agent-loop/AUTOPILOT_STATE.json`
   - `docs/agent-loop/CURRENT_TASK.md`
   - `docs/agent-loop/PROJECT_STATE.md`
   - `docs/agent-loop/AUTOPILOT_LOG.md`.

No production, test, fixture, ownership registry, dependency or role-matrix change is allowed in `Q`.

The scoped diff must prove `.github/workflows/ci.yml` changed only one exact selector token. Forbidden workflow changes include topology, job or matrix identity, shard count, commands, merge path, timeout, environment, dependency, fork count, caching, artifact behavior and `onTaskUpdate`.

The verifier must fail closed for an absent, old, duplicate, ambiguous, wrong-source or mismatching requested profile. Exact-head CI on `Q` must show the coverage job requested and consumed the exact 2B19B profile. CI for `P` does not transfer to `Q`.

## Documentation allowlist

The Slice may create/update only:

- this Round 2 design;
- one independent Round 2 design-review document;
- 2B19B traceability, coverage-profile and status documents;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`;
- authorized control documents;
- post-merge review archives required by `AGENTS.md`.

Round 1 design, Round 1 review, rule evidence and prior accepted archives remain immutable.

## Size estimate

| Production file | Added LOC estimate |
|---|---:|
| `first-night-action-opportunity.ts` | 220–300 |
| `dreamer.ts` | 390–500 |
| `domain-batch-semantics.ts` | 120–170 |
| `first-night-ability-outcome-ledger.ts` | 100–140 |
| `game-application-service.ts` | 180–240 |
| `projections/src/index.ts` | 40–50 |
| Total | `1050–1400` |

The CI YAML selector is profile-only infrastructure selection and does not count as product production scope or LOC.

## Acceptance checks and tests

Focused tests must cover the exact 80 criteria without a fixed physical test count. Required semantic groups include:

- V2 choice/grant/insertion/order/instance/tenure;
- V4 opportunity and V3 target exact shapes;
- V5 GOOD and EVIL targets;
- V6 GOOD and EVIL targets;
- native Dreamer DRUNK isolation;
- atomic batch and prospective reconstruction;
- 11/13-reference ledger facts and no duplicate fact;
- exact three-key public projection, sibling model version and stage;
- non-source omission and state-only rejection;
- formal V1 receipt-free failure and separate valid V1 replay;
- hostile source/Vortox provenance and batch rejection;
- R4 pure source impairment, impaired Vortox, Traveller and shortage non-selection;
- real fault-port receipt/version/retry behavior;
- A3B2 bridge stop boundary;
- ownership isolation;
- three-candidate exact profile and exact CI selection;
- hostile T1 and deterministic cross-platform matrices.

No hand-built state may be recorded as R1 application or accepted-stream authority.

## Local and CI gates

After implementation:

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
node scripts/verify-vitest-ownership-contracts.mjs --self-test
git diff --check
```

The formal pipeline must retain:

- nine ordinary processes and merge;
- dynamic inventory audit;
- nine coverage processes and merge;
- coverage obligation audit;
- ownership verification;
- Windows deterministic execution;
- no disabled tests;
- no dependency, timeout, topology or `onTaskUpdate` change.

The frozen final feature HEAD `Q` requires successful push and PR CI for exact `Q`, a complete PR body, then one complete independent final review. Any later commit invalidates CI/review authority and requires fresh gates.

## Rollback

Before merge, rollback is abandoning the unmerged feature branch.

After merge, a compatibility rollback may disable only new V4/V5/V6 production. It must retain validation, replay and safe projection of already accepted histories. Accepted events may not be deleted, migrated, downgraded or rewritten. Exact old profiles remain immutable.

## Stop conditions

Return `RESLICE_REQUIRED` if implementation needs:

- more than six planned product production files without fresh authorization;
- more than eight planned or ten actual production files;
- more than 1,500 estimated or 1,800 actual added production LOC;
- a new event family, `GameState` field, evidence variant or tenure type;
- assignment/current-character transition;
- base schema widening;
- modification of `initial-private-knowledge.ts`;
- generic gained-ability/capability infrastructure;
- source-impairment or impaired-Vortox success;
- formal Mathematician settlement/count;
- weakened replay, atomicity, prospective validation, retry or privacy;
- workflow change beyond the one exact profile selector;
- an architectural blocker remaining after Round 2.

Return `HUMAN_BLOCKED` for:

- substantive rule conflict;
- required rule source unavailable without approved snapshot;
- inability to prove canonical Philosopher tenure;
- required reinterpretation of the accepted schedule override;
- unsafe history rewrite;
- permission failure preventing independent review.

Repeated identical implementation failure follows repository stop policy.

## Explicit non-goals

- source Philosopher DRUNK or POISONED successful information;
- native Dreamer impairment propagation to the Philosopher source;
- impaired/dead Vortox fallback;
- No Dashii;
- V1 gained settlement;
- current Traveller application integration;
- current candidate-shortage application integration;
- complete Storyteller choice;
- other-night behavior;
- general death/lifecycle or character/alignment producers;
- post-delivery canonical mutation producer;
- formal Mathematician settlement or final count;
- combined base/gained Mathematician aggregation;
- `2B19A3B2`;
- FIRST_NIGHT completion, DAY or Phase 2C;
- generic gained-ability infrastructure;
- a new override;
- any COMPLETE role claim;
- a later Slice.

## Independent Round 2 rule-design review requirements

The reviewer independently re-reads the fixed external rule sources or approved snapshots, official nightsheet, evidence, coverage matrix, governance ADR, go/no-go, actual code boundaries, Round 1 design and complete Round 1 review.

The reviewer must verify:

1. all three Round 1 blockers are closed;
2. source remains Philosopher and ability role remains Dreamer;
3. no Dreamer tenure is fabricated;
4. every exact shape and cross-link is closed;
5. V5 and V6 semantics match sourced rules;
6. native Dreamer DRUNK remains isolated;
7. R3 and R4 states are not misrepresented as R1;
8. receipts are promised only for real formal paths/fault ports;
9. accepted ledger cardinality is 11/13 through accepted-stream authority;
10. public Dreamer information is exactly three keys with sibling version and stage;
11. `initial-private-knowledge.ts` is reuse-only;
12. V1 formal rejection and valid replay are separate R1/R2 claims;
13. no current post-delivery mutation producer is invented;
14. product and profile-only commits have disjoint allowlists;
15. `Q^ = P`, profile `sourceHead=P`, three candidates are frozen, and CI selects the exact profile;
16. `.github/workflows/ci.yml` changes only the selector;
17. all 80 traceability rows have semantically correct R/T/layer assignments;
18. six product files and `1050–1400` LOC satisfy governance;
19. role coverage remains partial/not-started as recorded;
20. implementation remains unauthorized pending the review verdict.

Allowed review verdicts are exactly:

```text
RULE_DESIGN_PASS
RULE_DESIGN_FIX_REQUIRED
HUMAN_BLOCKED
```

`implementationAuthorized` remains `false`.

`READY_FOR_RULE_DESIGN_REVIEW_ROUND_2`
