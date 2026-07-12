# Phase 3 Slice 2B18A Design Round 3.2 — First-Night Ability Outcome Ledger Foundation

## designMetadata

- `sliceId`: `2B18A`
- `designRound`: `3.2`
- `authorization`: `DESIGN_ROUND_3_2_EVIDENCE_CONTRACT_SIMPLIFICATION`
- `behaviorDesignFrozen`: `true`
- `finalDesignCompletionRound`: `true`
- `parentDesign`: `docs/implementation/phase-3-slice-2b18a-design-round-3-1.md`
- `parentDesignSha256`: `97456a3769d29b616af31c1e83dc5b1717809ffbe5a56ab0d86decd800c9710c`
- `parentReview`: `docs/implementation/phase-3-slice-2b18a-design-review-round-3-1.md`
- `parentReviewSha256`: `0a4269be1b19a303fab1eb08e0bcd0c9212aed5ec4c2e068c3eb2e9502a99444`
- `resolvedEvidence`: `docs/rules/evidence/2B18-resolved.md`
- `resolvedEvidenceSha256`: `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`
- `terminalRuleVerdict`: `RULE_READY`
- `rulesBaselineVersion`: `Phase One v2.1`
- `coverageStatus`: `PARTIAL`

本文件完整继承Design 3.1全部已通过合同，是2B18A唯一实现权威。它仅以封闭、强类型evidence合同替换Design 3.1的开放式`DOMAIN_RECORD`；其他行为、类型、ID、resolver、count、override、API、accepted contract和范围均不改变。

## ruleOverrides

不新增或修改override：

```ts
export const MATHEMATICIAN_AUDIT_OVERRIDE_SET_VERSION =
  "mathematician-audit-override-set-v1" as const;

export type MathematicianAuditOverrideVersions = {
  readonly overrideSetVersion:
    typeof MATHEMATICIAN_AUDIT_OVERRIDE_SET_VERSION;
  readonly firstNightWindow:
    "BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1";
  readonly ownAbilityExclusion:
    "BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1";
  readonly numericDomain:
    "BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1";
  readonly duplicateHolderTemporal:
    "BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1";
};

const MATHEMATICIAN_AUDIT_OVERRIDE_VERSION_KEYS = [
  "duplicateHolderTemporal",
  "firstNightWindow",
  "numericDomain",
  "overrideSetVersion",
  "ownAbilityExclusion"
] as const;
```

resolver内部从固定literal构造，不从state、command或调用者读取，不持久化，不投影。

## resolvedConflictMapping

- scheduling：accepted 2B17.2 V2，2B17.3不改变语义。
- window：`FirstNightInitialized.eventSequence` exclusive；当前resolution前`state.lastEventSequence` inclusive。
- own ability：仅相同source player与相同canonical instance。
- numeric domain：固定12人无Traveller，`0..11`。
- duplicate holder：base先，gained按seat及taskId code-unit；later可见earlier，earlier不可见future，不重算。

## sharedValidationContract

```ts
export type OutcomeLedgerValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };
```

所有validator先用`isCanonicalDataValue`，数组再用`isDenseCanonicalArray`，对象使用`isPlainRecord`与`hasExactEnumerableKeys`。必须拒绝Proxy、revoked Proxy、getter/accessor、symbol、cycle、sparse/nonstandard array、nonplain object、负零及非safe integer；getter调用次数为0；不得泄漏`TypeError`。clone逐字段建立新对象/数组；比较使用`sameCanonicalDataValue`和显式code-unit comparator，不使用raw JSON语义比较。

## firstNightWindowModel

```ts
export const FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION =
  "first-night-ability-outcome-ledger-v1" as const;
export const FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION =
  "first-night-ability-outcome-audit-v1" as const;
export const FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION =
  "first-night-ability-outcome-window-v1" as const;

export type FirstNightAbilityOutcomeWindowAnchor = {
  readonly windowVersion:
    typeof FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION;
  readonly gameId: GameId;
  readonly nightNumber: 1;
  readonly rulesBaselineVersion: string;
  readonly firstNightInitializedEventId: EventId;
  readonly startEventSequence: number;
  readonly startBoundary: "EXCLUSIVE";
};

export type FirstNightAbilityOutcomeWindowSnapshot =
  FirstNightAbilityOutcomeWindowAnchor & {
    readonly endEventSequence: number;
    readonly endBoundary: "INCLUSIVE";
  };

const FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_ANCHOR_KEYS = [
  "firstNightInitializedEventId",
  "gameId",
  "nightNumber",
  "rulesBaselineVersion",
  "startBoundary",
  "startEventSequence",
  "windowVersion"
] as const;

const FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_SNAPSHOT_KEYS = [
  "endBoundary",
  "endEventSequence",
  "firstNightInitializedEventId",
  "gameId",
  "nightNumber",
  "rulesBaselineVersion",
  "startBoundary",
  "startEventSequence",
  "windowVersion"
] as const;
```

计数窗口：

```text
startEventSequence < sourceEventSequence <= endEventSequence
endEventSequence = stateBeforeResolution.lastEventSequence
```

调用者不能提供window。本Slice无general dawn/day/later-night reset。

## canonicalAbilityInstanceIdentity

```ts
export type FirstNightAbilityInstanceId =
  string & { readonly __brand: "FirstNightAbilityInstanceId" };
```

格式：

```text
first-night-ability-instance-v1:base-task:<taskId>
first-night-ability-instance-v1:philosopher-gained-v1:<taskId>:grant:<grantId>
first-night-ability-instance-v1:philosopher-gained-v2:<taskId>:grant:<grantId>
first-night-ability-instance-v1:explicit:<roleId>:<existingInstanceId>
```

```ts
export const formatBaseFirstNightAbilityInstanceId = (
  taskId: ScheduledTaskId
): FirstNightAbilityInstanceId;

export const formatPhilosopherGainedV1AbilityInstanceId = (input: {
  readonly taskId: ScheduledTaskId;
  readonly grantId: GrantedAbilityId;
}): FirstNightAbilityInstanceId;

export const formatPhilosopherGainedV2AbilityInstanceId = (input: {
  readonly taskId: ScheduledTaskId;
  readonly grantId: GrantedAbilityId;
}): FirstNightAbilityInstanceId;

export const formatExplicitFirstNightAbilityInstanceId = (input: {
  readonly roleId: RoleId;
  readonly existingInstanceId: AbilityInstanceId;
}): FirstNightAbilityInstanceId;

export type ParsedFirstNightAbilityInstanceId =
  | {
      readonly valid: true;
      readonly kind: "BASE_ROLE_TASK";
      readonly canonicalId: FirstNightAbilityInstanceId;
      readonly taskId: ScheduledTaskId;
    }
  | {
      readonly valid: true;
      readonly kind: "PHILOSOPHER_GAINED_TASK_V1";
      readonly canonicalId: FirstNightAbilityInstanceId;
      readonly taskId: ScheduledTaskId;
      readonly grantId: GrantedAbilityId;
    }
  | {
      readonly valid: true;
      readonly kind: "PHILOSOPHER_GAINED_TASK_V2";
      readonly canonicalId: FirstNightAbilityInstanceId;
      readonly taskId: ScheduledTaskId;
      readonly grantId: GrantedAbilityId;
    }
  | {
      readonly valid: true;
      readonly kind: "EXPLICIT_DOMAIN_INSTANCE";
      readonly canonicalId: FirstNightAbilityInstanceId;
      readonly roleId: RoleId;
      readonly existingInstanceId: AbilityInstanceId;
    }
  | { readonly valid: false; readonly reason: string };

export const parseFirstNightAbilityInstanceId = (
  value: unknown
): ParsedFirstNightAbilityInstanceId;
```

Parser要求trimmed non-empty primitive string、exact prefix、合法segment及formatter exact round-trip。gained prefix后只能有一个结构性`:grant:`；explicit以role后的第一个`:`分隔existing ID。whitespace、control、空segment、extra structural separator、大小写变体、known task leading-zero/noncanonical编码拒绝。internal validator将embedded task/grant/role/existing instance与canonical chain交叉验证。
```ts
export type FirstNightAbilityInstanceProvenance =
  | {
      readonly provenanceVersion:
        "first-night-ability-instance-provenance-v1";
      readonly kind: "BASE_ROLE_TASK";
      readonly abilityInstanceId: FirstNightAbilityInstanceId;
      readonly abilityRoleId: RoleId;
      readonly taskId: ScheduledTaskId;
      readonly sourcePlayerId: PlayerId;
      readonly sourceSeatNumber: SeatNumber;
    }
  | {
      readonly provenanceVersion:
        "first-night-ability-instance-provenance-v1";
      readonly kind: "PHILOSOPHER_GAINED_TASK_V1";
      readonly abilityInstanceId: FirstNightAbilityInstanceId;
      readonly abilityRoleId: RoleId;
      readonly taskId: ScheduledTaskId;
      readonly sourcePlayerId: PlayerId;
      readonly sourceSeatNumber: SeatNumber;
      readonly philosopherOpportunityId: ActionOpportunityId;
      readonly grantId: GrantedAbilityId;
      readonly sourceCharacterStateRevision: number;
    }
  | {
      readonly provenanceVersion:
        "first-night-ability-instance-provenance-v1";
      readonly kind: "PHILOSOPHER_GAINED_TASK_V2";
      readonly abilityInstanceId: FirstNightAbilityInstanceId;
      readonly abilityRoleId: RoleId;
      readonly taskId: ScheduledTaskId;
      readonly sourcePlayerId: PlayerId;
      readonly sourceSeatNumber: SeatNumber;
      readonly philosopherOpportunityId: ActionOpportunityId;
      readonly grantId: GrantedAbilityId;
      readonly sourceCharacterStateRevision: number;
      readonly schedulingVersion:
        "philosopher-gained-first-night-scheduling-v2";
    }
  | {
      readonly provenanceVersion:
        "first-night-ability-instance-provenance-v1";
      readonly kind: "EXPLICIT_DOMAIN_INSTANCE";
      readonly abilityInstanceId: FirstNightAbilityInstanceId;
      readonly abilityRoleId: RoleId;
      readonly taskId: ScheduledTaskId;
      readonly sourcePlayerId: PlayerId;
      readonly sourceSeatNumber: SeatNumber;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly existingInstanceId: AbilityInstanceId;
    };
```

Exact keys：

```ts
const BASE_ROLE_TASK_PROVENANCE_KEYS = [
  "abilityInstanceId", "abilityRoleId", "kind", "provenanceVersion",
  "sourcePlayerId", "sourceSeatNumber", "taskId"
] as const;

const PHILOSOPHER_GAINED_TASK_V1_PROVENANCE_KEYS = [
  "abilityInstanceId", "abilityRoleId", "grantId", "kind",
  "philosopherOpportunityId", "provenanceVersion",
  "sourceCharacterStateRevision", "sourcePlayerId",
  "sourceSeatNumber", "taskId"
] as const;

const PHILOSOPHER_GAINED_TASK_V2_PROVENANCE_KEYS = [
  "abilityInstanceId", "abilityRoleId", "grantId", "kind",
  "philosopherOpportunityId", "provenanceVersion",
  "schedulingVersion", "sourceCharacterStateRevision",
  "sourcePlayerId", "sourceSeatNumber", "taskId"
] as const;

const EXPLICIT_DOMAIN_INSTANCE_PROVENANCE_KEYS = [
  "abilityInstanceId", "abilityRoleId", "existingInstanceId", "kind",
  "provenanceVersion", "sourcePlayerId", "sourceRoleTenureId",
  "sourceSeatNumber", "taskId"
] as const;
```

## outcomeStatuses

```ts
export type AbilityOutcomeStatus =
  | "NORMAL" | "ABNORMAL" | "UNRESOLVED" | "PENDING_TRIGGER";

export type AbilityOutcomeCause =
  | "NO_OTHER_CHARACTER_ABILITY"
  | "SOURCE_DRUNKENNESS"
  | "SOURCE_POISONING"
  | "VORTOX_FALSE_INFORMATION"
  | "DREAMER_VORTOX_CONSTRAINT_UNRECORDED"
  | "VORTOX_APPLICABILITY_NOT_PROVEN"
  | "CAUSE_NOT_PROVEN";
```

## terminalEventType

```ts
export type TerminalAbilityOutcomeEventType =
  | "PhilosopherActionDeferred"
  | "PhilosopherAbilityGranted"
  | "SnakeCharmerNoSwapResolved"
  | "SnakeCharmerIneffectiveResolved"
  | "SnakeCharmerDemonSwapApplied"
  | "EvilTwinInformationDelivered"
  | "WitchDeathPendingMarked"
  | "WitchIneffectiveResolved"
  | "CerenovusMadnessInstructionDelivered"
  | "ClockmakerInformationDelivered"
  | "DreamerInformationDelivered"
  | "SeamstressInformationDelivered";
```

## abilityOutcomeEvidenceReference

`DOMAIN_RECORD`及任何generic `recordType:string/recordId:string`彻底删除。

### 完整封闭联合

```ts
export type SourceEventEvidence = {
  readonly kind: "SOURCE_EVENT";
  readonly eventId: EventId;
  readonly eventType: TerminalAbilityOutcomeEventType;
  readonly eventSequence: number;
  readonly batchId: BatchId;
};

export type TaskEvidence = {
  readonly kind: "TASK";
  readonly taskId: ScheduledTaskId;
  readonly taskType: FirstNightTaskType;
};

export type ActionOpportunityEvidence = {
  readonly kind: "ACTION_OPPORTUNITY";
  readonly opportunityId: ActionOpportunityId;
  readonly taskId: ScheduledTaskId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
};

export type AbilityImpairmentEvidence = {
  readonly kind: "ABILITY_IMPAIRMENT";
  readonly impairmentId: AbilityImpairmentId;
  readonly impairmentKind: "DRUNK" | "POISONED";
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRoleId: RoleId;
  readonly sourceKind:
    | "PHILOSOPHER_CHOSEN_DUPLICATE"
    | "SNAKE_CHARMER_DEMON_HIT";
  readonly appliedCharacterStateRevision: number;
};

export type RoleTenureEvidence = {
  readonly kind: "ROLE_TENURE";
  readonly roleTenureId: RoleTenureId;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: RoleId;
  readonly acquiredCharacterStateRevision: number;
  readonly statusAtEvaluation: "ACTIVE" | "INACTIVE";
};

export type CharacterStateEvidence = {
  readonly kind: "CHARACTER_STATE";
  readonly characterStateRevision: number;
};

export type PlayerRoleAtRevisionEvidence = {
  readonly kind: "PLAYER_ROLE_AT_REVISION";
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: RoleId;
  readonly characterType:
    | "TOWNSFOLK" | "OUTSIDER" | "MINION" | "DEMON";
  readonly defaultAlignment: "GOOD" | "EVIL";
  readonly characterStateRevision: number;
};

export type PhilosopherGrantEvidence = {
  readonly kind: "PHILOSOPHER_GRANT";
  readonly grantId: GrantedAbilityId;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly chosenRoleId: RoleId;
  readonly sourceCharacterStateRevision: number;
};

export type FirstNightTaskInsertionEvidence = {
  readonly kind: "FIRST_NIGHT_TASK_INSERTION";
  readonly taskId: ScheduledTaskId;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly chosenRoleId: RoleId;
  readonly generation:
    | {
        readonly kind: "V1";
        readonly taskPlanVersion: "first-night-task-plan-v1";
      }
    | {
        readonly kind: "V2";
        readonly taskPlanVersion: "first-night-task-plan-v2";
        readonly grantId: GrantedAbilityId;
        readonly schedulingVersion:
          "philosopher-gained-first-night-scheduling-v2";
      };
};

export type SnakeCharmerResolutionEvidence = {
  readonly kind: "SNAKE_CHARMER_RESOLUTION";
  readonly resolutionKind:
    | "NON_DEMON_NO_SWAP"
    | "INEFFECTIVE_NO_SWAP"
    | "DEMON_HIT_SWAP";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly targetRoleIdAtResolution: RoleId;
  readonly resolutionEventId: EventId;
};

export type EvilTwinPairEvidence = {
  readonly kind: "EVIL_TWIN_PAIR";
  readonly pairId: string;
  readonly evilTwinPlayerId: PlayerId;
  readonly goodTwinPlayerId: PlayerId;
  readonly establishedTaskId: ScheduledTaskId;
  readonly informationDeliveryEventId: EventId;
};

export type WitchPendingMarkerEvidence = {
  readonly kind: "WITCH_PENDING_MARKER";
  readonly pendingDeathId: string;
  readonly sourcePlayerId: PlayerId;
  readonly targetPlayerId: PlayerId;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly terminalEventId: EventId;
};
export type CerenovusInstructionEvidence = {
  readonly kind: "CERENOVUS_INSTRUCTION";
  readonly deliveryId: string;
  readonly choiceId: string;
  readonly markerId: string;
  readonly sourcePlayerId: PlayerId;
  readonly targetPlayerId: PlayerId;
  readonly chosenRoleId: RoleId;
  readonly taskId: ScheduledTaskId;
  readonly terminalEventId: EventId;
};

export type ClockmakerDeliveryEvidence = {
  readonly kind: "CLOCKMAKER_DELIVERY";
  readonly deliveryId: string;
  readonly taskId: ScheduledTaskId;
  readonly sourcePlayerId: PlayerId;
  readonly ruleCorrectDistance: number;
  readonly selectedDistance: number;
  readonly terminalEventId: EventId;
};

export type DreamerDeliveryEvidence = {
  readonly kind: "DREAMER_DELIVERY";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly targetPlayerId: PlayerId;
  readonly deliveredGoodRoleId: RoleId;
  readonly deliveredEvilRoleId: RoleId;
  readonly terminalEventId: EventId;
};

export type SeamstressDeliveryEvidence = {
  readonly kind: "SEAMSTRESS_DELIVERY";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly firstTargetPlayerId: PlayerId;
  readonly secondTargetPlayerId: PlayerId;
  readonly ruleCorrectAnswer: "YES" | "NO";
  readonly deliveredAnswer: "YES" | "NO";
  readonly terminalEventId: EventId;
};

export type AbilityOutcomeEvidenceReference =
  | SourceEventEvidence
  | TaskEvidence
  | ActionOpportunityEvidence
  | AbilityImpairmentEvidence
  | RoleTenureEvidence
  | CharacterStateEvidence
  | PlayerRoleAtRevisionEvidence
  | PhilosopherGrantEvidence
  | FirstNightTaskInsertionEvidence
  | SnakeCharmerResolutionEvidence
  | EvilTwinPairEvidence
  | WitchPendingMarkerEvidence
  | CerenovusInstructionEvidence
  | ClockmakerDeliveryEvidence
  | DreamerDeliveryEvidence
  | SeamstressDeliveryEvidence;
```

这是16个顶层强类型variant。`FirstNightTaskInsertionEvidence.generation`内部有两个exact分支，从而避免optional `grantId`；顶层kind仍唯一为`FIRST_NIGHT_TASK_INSERTION`。

### Exact keys

```ts
const SOURCE_EVENT_EVIDENCE_KEYS =
  ["batchId", "eventId", "eventSequence", "eventType", "kind"] as const;

const TASK_EVIDENCE_KEYS =
  ["kind", "taskId", "taskType"] as const;

const ACTION_OPPORTUNITY_EVIDENCE_KEYS = [
  "kind", "opportunityId", "sourcePlayerId", "sourceSeatNumber", "taskId"
] as const;

const ABILITY_IMPAIRMENT_EVIDENCE_KEYS = [
  "affectedPlayerId", "affectedRoleId", "affectedSeatNumber",
  "appliedCharacterStateRevision", "impairmentId", "impairmentKind",
  "kind", "sourceKind"
] as const;

const ROLE_TENURE_EVIDENCE_KEYS = [
  "acquiredCharacterStateRevision", "kind", "playerId", "roleId",
  "roleTenureId", "seatNumber", "statusAtEvaluation"
] as const;

const CHARACTER_STATE_EVIDENCE_KEYS =
  ["characterStateRevision", "kind"] as const;

const PLAYER_ROLE_AT_REVISION_EVIDENCE_KEYS = [
  "characterStateRevision", "characterType", "defaultAlignment",
  "kind", "playerId", "roleId", "seatNumber"
] as const;

const PHILOSOPHER_GRANT_EVIDENCE_KEYS = [
  "chosenRoleId", "grantId", "kind", "philosopherOpportunityId",
  "sourceCharacterStateRevision", "sourcePlayerId", "sourceSeatNumber"
] as const;

const FIRST_NIGHT_TASK_INSERTION_EVIDENCE_KEYS = [
  "chosenRoleId", "generation", "kind", "philosopherOpportunityId",
  "sourcePlayerId", "sourceSeatNumber", "taskId"
] as const;

const FIRST_NIGHT_TASK_INSERTION_V1_GENERATION_KEYS =
  ["kind", "taskPlanVersion"] as const;

const FIRST_NIGHT_TASK_INSERTION_V2_GENERATION_KEYS = [
  "grantId", "kind", "schedulingVersion", "taskPlanVersion"
] as const;

const SNAKE_CHARMER_RESOLUTION_EVIDENCE_KEYS = [
  "kind", "opportunityId", "resolutionEventId", "resolutionKind",
  "targetPlayerId", "targetRoleIdAtResolution",
  "targetSeatNumber", "taskId"
] as const;

const EVIL_TWIN_PAIR_EVIDENCE_KEYS = [
  "establishedTaskId", "evilTwinPlayerId", "goodTwinPlayerId",
  "informationDeliveryEventId", "kind", "pairId"
] as const;

const WITCH_PENDING_MARKER_EVIDENCE_KEYS = [
  "kind", "opportunityId", "pendingDeathId", "sourcePlayerId",
  "targetPlayerId", "taskId", "terminalEventId"
] as const;

const CERENOVUS_INSTRUCTION_EVIDENCE_KEYS = [
  "choiceId", "chosenRoleId", "deliveryId", "kind", "markerId",
  "sourcePlayerId", "targetPlayerId", "taskId", "terminalEventId"
] as const;

const CLOCKMAKER_DELIVERY_EVIDENCE_KEYS = [
  "deliveryId", "kind", "ruleCorrectDistance", "selectedDistance",
  "sourcePlayerId", "taskId", "terminalEventId"
] as const;

const DREAMER_DELIVERY_EVIDENCE_KEYS = [
  "deliveredEvilRoleId", "deliveredGoodRoleId", "kind",
  "opportunityId", "sourcePlayerId", "targetPlayerId",
  "taskId", "terminalEventId"
] as const;

const SEAMSTRESS_DELIVERY_EVIDENCE_KEYS = [
  "deliveredAnswer", "firstTargetPlayerId", "kind", "opportunityId",
  "ruleCorrectAnswer", "secondTargetPlayerId", "sourcePlayerId",
  "taskId", "terminalEventId"
] as const;
```

### Primary identity、canonical source及fact cross-link

1. `SOURCE_EVENT`
   - identity：`eventId`
   - source：实际terminal envelope
   - cross-link：eventId/type/sequence/batch分别等于fact source字段；sequence还等于detected sequence
   - 每个fact恰好一个。

2. `TASK`
   - identity：`taskId`
   - source：pre-event task plan唯一task
   - cross-link：taskId等于fact.abilityTaskId和instance.taskId；taskType等于canonical task及terminal映射
   - 每个fact恰好一个。
   - 映射：Philosopher→`PHILOSOPHER_ACTION`；Snake→`SNAKE_CHARMER_ACTION`；Evil Twin→`EVIL_TWIN_SETUP`；Witch→`WITCH_ACTION`；Cerenovus→`CERENOVUS_ACTION`；Clockmaker→`CLOCKMAKER_INFORMATION`；Dreamer→`DREAMER_ACTION`；Seamstress→`SEAMSTRESS_ACTION`。

3. `ACTION_OPPORTUNITY`
   - identity：`opportunityId`
   - source：pre-event opportunities唯一记录
   - cross-link：task、source player/seat等于fact及terminal chain。

4. `ABILITY_IMPAIRMENT`
   - identity：`impairmentId`
   - source：pre-event`abilityImpairments.impairments`唯一记录
   - cross-link：affected player/seat/role等于fact source；kind/source/revision等于canonical impairment；DRUNK/POISON cause必须对应kind。
   - impaired normal允许携带但fact cause仍`NO_OTHER_CHARACTER_ABILITY`。

5. `ROLE_TENURE`
   - identity：`roleTenureId`
   - source：pre-event tenure唯一记录
   - cross-link：player/seat/role/acquired revision完全一致；status由evaluation revision计算。source tenure匹配fact source；Vortox tenure要求role=`vortox`。

6. `CHARACTER_STATE`
   - identity：数值`characterStateRevision`
   - source：terminal pre-event current state
   - cross-link：等于fact.evaluatedCharacterStateRevision和adapter历史revision；需要角色/阵营判断的fact恰好一个。

7. `PLAYER_ROLE_AT_REVISION`
   - compound identity：`(playerId, characterStateRevision)`
   - canonical key：`<playerId>@revision-<characterStateRevision>`
   - source：terminal pre-event current character entry及setup catalog snapshot
   - cross-link：seat/role/type/defaultAlignment exact；source player时seat等于fact；target player必须等于对应choice/delivery target
   - 同player不同revision合法；同player同revision不同内容冲突。

8. `PHILOSOPHER_GRANT`
   - identity：`grantId`
   - source：`state.philosopherGrantedAbilities.abilities[].grantId`
   - cross-link：opportunity、source player/seat、chosen role、revision匹配canonical grant；gained instance的grantId必须相同。

9. `FIRST_NIGHT_TASK_INSERTION`
   - compound identity：`(generation.kind, taskId)`
   - source：V1 `FirstNightTaskInserted.payload.taskId`；V2 `FirstNightTaskInsertedV2.payload.taskId`
   - cross-link：task、opportunity、source、seat、chosen role匹配fact/instance/grant
   - V1 generation没有grantId；V2 generation必须有grantId和accepted scheduling version。

10. `SNAKE_CHARMER_RESOLUTION`
    - identity：`resolutionEventId`
    - source：Snake terminal envelope
    - cross-link：eventId等于SOURCE_EVENT；task/opportunity/target与choice及payload一致；target role来自terminal pre-state或swap before snapshot；resolutionKind与event type一致。

11. `EVIL_TWIN_PAIR`
    - identity：accepted `pairId`
    - source：`EvilTwinPairEstablishedPayload.pairId`
    - cross-link：task、evil/good players与pair及information payload一致；informationDeliveryEventId等于terminal SOURCE_EVENT。
    - 不创建第二套pair ID。

12. `WITCH_PENDING_MARKER`
    - identity：accepted `pendingDeathId`
    - source：`WitchDeathPendingPayload.pendingDeathId`
    - cross-link：source、target、task、opportunity与payload/choice一致；terminalEventId等于SOURCE_EVENT。
    - 无`markerId`别名。
13. `CERENOVUS_INSTRUCTION`
    - identity：accepted `deliveryId`
    - source：`CerenovusMadnessInstructionDeliveredPayload.deliveryId`
    - cross-link：choiceId、markerId、task、source、recipient target、chosen role从唯一choice-marker-delivery链取得；terminalEventId等于SOURCE_EVENT。
    - 不创建instruction别名ID。

14. `CLOCKMAKER_DELIVERY`
    - identity：accepted `deliveryId`
    - source：`ClockmakerInformationDeliveredPayload.deliveryId`
    - cross-link：task/source/truth/selected与payload一致；terminalEventId等于SOURCE_EVENT；fact status/cause与truth-selected-effectiveness/Vortox一致。

15. `DREAMER_DELIVERY`
    - identity：`terminalEventId`
    - source：Dreamer terminal envelope；accepted payload没有独立deliveryId
    - cross-link：task/opportunity/source/target及GOOD/EVIL delivered role IDs与payload一致；terminalEventId等于SOURCE_EVENT。
    - 不存在deliveryIdentity或新造delivery ID。

16. `SEAMSTRESS_DELIVERY`
    - identity：`terminalEventId`
    - source：Seamstress terminal envelope；accepted payload没有独立deliveryId
    - cross-link：task/opportunity/source、规范化first/second targets、stored correct answer、delivered answer与payload一致；terminalEventId等于SOURCE_EVENT。
    - 不创建deliveryId。

### Canonical排序、duplicate与conflict

Kind rank：

```text
SOURCE_EVENT=0
TASK=1
ACTION_OPPORTUNITY=2
ABILITY_IMPAIRMENT=3
ROLE_TENURE=4
CHARACTER_STATE=5
PLAYER_ROLE_AT_REVISION=6
PHILOSOPHER_GRANT=7
FIRST_NIGHT_TASK_INSERTION=8
SNAKE_CHARMER_RESOLUTION=9
EVIL_TWIN_PAIR=10
WITCH_PENDING_MARKER=11
CERENOVUS_INSTRUCTION=12
CLOCKMAKER_DELIVERY=13
DREAMER_DELIVERY=14
SEAMSTRESS_DELIVERY=15
```

先按kind rank。同kind按上述primary identity排序；字符串code-unit，数值升序；insertion先V1后V2再taskId；player-role先playerId再revision。完全相同reference去重。同kind+同primary identity但内容不同抛`InvalidFirstNightAbilityOutcomeEvidence`。不同kind即使字符串相同也不是重复。禁止locale ordering和输入顺序依赖。

## terminalAdapterEvidenceSets

所有fact必须恰好有一个`SOURCE_EVENT`和一个`TASK`。只允许下列集合；条件项满足时必须存在，不满足时不得伪造。

### PhilosopherActionDeferred

必需：

- SOURCE_EVENT
- TASK
- ACTION_OPPORTUNITY
- CHARACTER_STATE
- PLAYER_ROLE_AT_REVISION(source)

### PhilosopherAbilityGranted

必需：

- SOURCE_EVENT
- TASK
- ACTION_OPPORTUNITY
- CHARACTER_STATE
- PLAYER_ROLE_AT_REVISION(source)
- PHILOSOPHER_GRANT

同batch中位于grant之后的insertion不是grant fact的pre-event证据，不得引用。

### Snake Charmer terminals

必需：

- SOURCE_EVENT
- TASK
- ACTION_OPPORTUNITY
- CHARACTER_STATE
- PLAYER_ROLE_AT_REVISION(source)
- PLAYER_ROLE_AT_REVISION(target)
- SNAKE_CHARMER_RESOLUTION

source impaired时必须增加ABILITY_IMPAIRMENT。

### EvilTwinInformationDelivered

必需：

- SOURCE_EVENT
- TASK
- CHARACTER_STATE
- PLAYER_ROLE_AT_REVISION(evil twin)
- PLAYER_ROLE_AT_REVISION(good twin)
- EVIL_TWIN_PAIR

### WitchDeathPendingMarked

必需：

- SOURCE_EVENT
- TASK
- ACTION_OPPORTUNITY
- CHARACTER_STATE
- PLAYER_ROLE_AT_REVISION(source)
- PLAYER_ROLE_AT_REVISION(target)
- WITCH_PENDING_MARKER

### WitchIneffectiveResolved

必需：

- SOURCE_EVENT
- TASK
- ACTION_OPPORTUNITY
- CHARACTER_STATE
- PLAYER_ROLE_AT_REVISION(source)
- PLAYER_ROLE_AT_REVISION(target)
- ABILITY_IMPAIRMENT

禁止WITCH_PENDING_MARKER及任何未来提名/死亡证据。

### CerenovusMadnessInstructionDelivered

必需：

- SOURCE_EVENT
- TASK
- ACTION_OPPORTUNITY
- CHARACTER_STATE
- PLAYER_ROLE_AT_REVISION(source)
- PLAYER_ROLE_AT_REVISION(target)
- CERENOVUS_INSTRUCTION

explicit source instance存在时必须增加ROLE_TENURE(source)。

### ClockmakerInformationDelivered

必需：

- SOURCE_EVENT
- TASK
- CHARACTER_STATE
- PLAYER_ROLE_AT_REVISION(source)
- CLOCKMAKER_DELIVERY

source represented impaired时增加ABILITY_IMPAIRMENT。Vortox constraint已证明时增加PLAYER_ROLE_AT_REVISION(Vortox)及ROLE_TENURE(Vortox)。

### DreamerInformationDelivered

必需：

- SOURCE_EVENT
- TASK
- ACTION_OPPORTUNITY
- CHARACTER_STATE
- PLAYER_ROLE_AT_REVISION(source)
- PLAYER_ROLE_AT_REVISION(target)
- DREAMER_DELIVERY

source impaired时增加ABILITY_IMPAIRMENT。`EFFECTIVE_VORTOX_PROVEN`时增加PLAYER_ROLE_AT_REVISION(Vortox)和ROLE_TENURE(Vortox)。`VORTOX_APPLICABILITY_UNRESOLVED`时只引用实际可验证证据；缺失tenure时禁止伪造ROLE_TENURE。

### SeamstressInformationDelivered

必需：

- SOURCE_EVENT
- TASK
- ACTION_OPPORTUNITY
- CHARACTER_STATE
- PLAYER_ROLE_AT_REVISION(source)
- PLAYER_ROLE_AT_REVISION(first target)
- PLAYER_ROLE_AT_REVISION(second target)
- SEAMSTRESS_DELIVERY

explicit source instance必须增加ROLE_TENURE(source)。source represented impaired时增加ABILITY_IMPAIRMENT。Vortox constraint已证明时增加PLAYER_ROLE_AT_REVISION(Vortox)和ROLE_TENURE(Vortox)。

### Gained及explicit provenance条件

任何terminal fact的instance kind为`PHILOSOPHER_GAINED_TASK_V1/V2`时，额外必须有PHILOSOPHER_GRANT与FIRST_NIGHT_TASK_INSERTION，且完整cross-link。任何`EXPLICIT_DOMAIN_INSTANCE`必须有匹配source ROLE_TENURE。

缺少、多出不允许的kind、重复identity冲突或cross-link错误均为非法accepted-history invariant，抛相应DomainError且不产fact。规则明确允许证据不足的Dreamer Vortox仅生成实际可验证reference并返回UNRESOLVED；不得伪造缺失tenure。PENDING只引用现有source、target、task、opportunity、impairment及terminal event。

## firstNightAbilityOutcomeFact

```ts
export type FirstNightAbilityOutcomeFactId =
  string & { readonly __brand: "FirstNightAbilityOutcomeFactId" };

export const formatFirstNightAbilityOutcomeFactId = (
  sourceEventId: EventId
): FirstNightAbilityOutcomeFactId;

export type ParsedFirstNightAbilityOutcomeFactId =
  | {
      readonly valid: true;
      readonly canonicalId: FirstNightAbilityOutcomeFactId;
      readonly sourceEventId: EventId;
    }
  | { readonly valid: false; readonly reason: string };

export const parseFirstNightAbilityOutcomeFactId = (
  value: unknown
): ParsedFirstNightAbilityOutcomeFactId;

export type FirstNightAbilityOutcomeFact = {
  readonly auditFactId: FirstNightAbilityOutcomeFactId;
  readonly auditModelVersion:
    typeof FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION;
  readonly windowVersion:
    typeof FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly abilityRoleId: RoleId;
  readonly abilityTaskId: ScheduledTaskId;
  readonly abilityInstance: FirstNightAbilityInstanceProvenance;
  readonly sourceEventId: EventId;
  readonly sourceBatchId: BatchId;
  readonly sourceEventSequence: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly outcomeStatus: AbilityOutcomeStatus;
  readonly causeKind: AbilityOutcomeCause;
  readonly causedByAnotherCharacterAbility: boolean;
  readonly evidenceReferences:
    readonly AbilityOutcomeEvidenceReference[];
  readonly detectedAtEventSequence: number;
};
const FIRST_NIGHT_ABILITY_OUTCOME_FACT_KEYS = [
  "abilityInstance", "abilityRoleId", "abilityTaskId", "auditFactId",
  "auditModelVersion", "causeKind", "causedByAnotherCharacterAbility",
  "detectedAtEventSequence", "evaluatedCharacterStateRevision",
  "evidenceReferences", "outcomeStatus", "sourceBatchId",
  "sourceEventId", "sourceEventSequence", "sourcePlayerId",
  "sourceSeatNumber", "windowVersion"
] as const;
```

Fact ID：`first-night-ability-outcome-fact-v1:<sourceEventId>`，必须formatter/parser round-trip。

状态组合：

- NORMAL：`NO_OTHER_CHARACTER_ABILITY/false`
- ABNORMAL：`SOURCE_DRUNKENNESS|SOURCE_POISONING|VORTOX_FALSE_INFORMATION/true`
- UNRESOLVED：`DREAMER_VORTOX_CONSTRAINT_UNRECORDED|VORTOX_APPLICABILITY_NOT_PROVEN|CAUSE_NOT_PROVEN/false`
- PENDING_TRIGGER：仅Witch，`SOURCE_DRUNKENNESS|SOURCE_POISONING/true`

`detectedAtEventSequence===sourceEventSequence`；instance与fact source/seat/role/task一致；evidence符合terminal最低/条件集合、exact shape、canonical sorting和全部cross-link。

## derivedLedgerArchitecture

```ts
export type FirstNightAbilityOutcomeLedger = {
  readonly ledgerVersion:
    typeof FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION;
  readonly auditModelVersion:
    typeof FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION;
  readonly windowAnchor: FirstNightAbilityOutcomeWindowAnchor;
  readonly facts: readonly FirstNightAbilityOutcomeFact[];
};

const FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_KEYS = [
  "auditModelVersion", "facts", "ledgerVersion", "windowAnchor"
] as const;
```

`GameState`增加可选`firstNightAbilityOutcomeLedger`。ledger为derived canonical state，不新增event或修改accepted contract。

event-applier统一调用：

```ts
deriveFirstNightAbilityOutcomeFact({
  stateBefore,
  event
}): FirstNightAbilityOutcomeFact | undefined;
```

顺序：现有validation成功 → 完整terminal envelope与pre-state派生 → 原next state → append → return。不得在case复制adapter。

Terminal allowlist即`TerminalAbilityOutcomeEventType`。choice、中间marker、impairment、planning、system information及`ScheduledTaskSettled`不产fact。`WitchDeathPendingMarked`是marker terminal `NORMAL`明确例外。

## perRoleAuditAdapters

- Philosopher：DEFER/grant NORMAL；duplicate DRUNK marker本身不计。
- Snake：effective non-Demon no-swap NORMAL；effective Demon swap NORMAL；impaired non-Demon NORMAL；impaired Demon no-swap ABNORMAL；历史target不足UNRESOLVED。
- Evil Twin：完整pair+mutual information NORMAL；未实现胜负/死亡不产fact。
- Witch：pending marked NORMAL；ineffective PENDING_TRIGGER；settlement不重复。
- Cerenovus：marker不产；instruction NORMAL；impaired无event无fact。
- Clockmaker：stored truth=selected NORMAL；已证明impairment/Vortox mismatch ABNORMAL；原因不可证UNRESOLVED。
- Dreamer：使用冻结三态矩阵。
- Seamstress：stored correct=delivered NORMAL；已证明impairment/Vortox mismatch ABNORMAL；原因不可证UNRESOLVED。
- Mathematician：本Slice不产delivery fact。

## historicalVortoxApplicability

Module-private：

```ts
type HistoricalVortoxApplicability =
  | { readonly kind: "NO_EFFECTIVE_VORTOX_PROVEN" }
  | {
      readonly kind: "EFFECTIVE_VORTOX_PROVEN";
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleTenureId: RoleTenureId;
      readonly evaluatedCharacterStateRevision: number;
    }
  | {
      readonly kind: "VORTOX_APPLICABILITY_UNRESOLVED";
      readonly reason:
        | "CURRENT_VORTOX_NOT_UNIQUE"
        | "VORTOX_TENURE_MISSING_OR_CONFLICTING"
        | "VORTOX_EFFECTIVENESS_EVIDENCE_CONFLICTING"
        | "UNSUPPORTED_CONTINUOUS_EFFECT"
        | "UNSUPPORTED_REGISTRATION_OR_LIFECYCLE";
    };
```

只使用Dreamer terminal pre-state。矩阵：

- no effective Vortox + effective normal pair → NORMAL
- no effective Vortox + impaired normal pair → NORMAL
- no effective Vortox + impaired abnormal pair → ABNORMAL
- no effective Vortox + effective abnormal pair → `InvalidFirstNightAbilityOutcomeFact`
- effective Vortox proven → UNRESOLVED/DREAMER constraint unrecorded
- applicability unresolved → UNRESOLVED/VORTOX applicability not proven

later state不改写fact。

## pendingTriggerBoundary

仅`WitchIneffectiveResolved`产生PENDING_TRIGGER；不计、不阻塞、不提前升级。`WitchDeathPendingMarked`为NORMAL，不因未来提名缺失变UNRESOLVED。

## internalResolvingMathematicianContext

全部module-private：

```ts
type InternalResolvingMathematicianRosterEntry = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly playerKind: "HUMAN" | "AI";
  readonly displayName: string;
};

type InternalResolvingMathematicianRosterSnapshot = {
  readonly rosterVersion: string;
  readonly entries:
    readonly InternalResolvingMathematicianRosterEntry[];
};

type InternalResolvingMathematicianContext = {
  readonly contextVersion:
    "resolving-mathematician-context-v1";
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceAbilityRoleId: RoleId;
  readonly taskId: ScheduledTaskId;
  readonly taskPlanVersion: FirstNightTaskPlanVersion;
  readonly taskSourceKind:
    | "ROLE" | "PHILOSOPHER_GAINED_ABILITY";
  readonly resolutionCharacterStateRevision: number;
  readonly resolutionLastEventSequence: number;
  readonly abilityInstance:
    FirstNightAbilityInstanceProvenance;
  readonly window:
    FirstNightAbilityOutcomeWindowSnapshot;
  readonly rosterSnapshot:
    InternalResolvingMathematicianRosterSnapshot;
  readonly applicableOverrides:
    MathematicianAuditOverrideVersions;
};

const INTERNAL_RESOLVING_MATHEMATICIAN_ROSTER_ENTRY_KEYS = [
  "displayName", "playerId", "playerKind", "seatNumber"
] as const;

const INTERNAL_RESOLVING_MATHEMATICIAN_ROSTER_SNAPSHOT_KEYS = [
  "entries", "rosterVersion"
] as const;

const INTERNAL_RESOLVING_MATHEMATICIAN_CONTEXT_KEYS = [
  "abilityInstance", "applicableOverrides", "contextVersion", "gameId",
  "resolutionCharacterStateRevision", "resolutionLastEventSequence",
  "rosterSnapshot", "rulesBaselineVersion", "sourceAbilityRoleId",
  "sourcePlayerId", "sourceSeatNumber", "taskId", "taskPlanVersion",
  "taskSourceKind", "window"
] as const;
```

内部builder从同一pre-resolution state验证game/baseline/phase/firstNight/ledger/12人roster/current character/plan/progress；anchor一致；upper等于last sequence；唯一next unsettled pending task为Math；base或唯一V1/V2 insertion-grant-opportunity链完整；无generation混用；内部生成instance和override。context不export、不持久化、不投影。

## unresolvedBoundary

固定流水线：validate → window/future → own exclusion → retained qualifying abnormal → player dedup → unresolved redundancy。只有retained abnormal能使同玩家unresolved冗余；future/window外/own abnormal不能。

## playerDeduplication

按sourcePlayerId去重；players按seat后playerId code-unit。同玩家多个qualifying fact计1。

## ownAbilityExclusion

仅：

```ts
fact.sourcePlayerId === context.sourcePlayerId &&
sameCanonicalDataValue(
  fact.abilityInstance,
  context.abilityInstance
)
```

不得按roleId全局排除。

## duplicateHolderTemporalPolicy

base先；gained按seat再taskId。later可见earlier，earlier不见future，不重算。

## mathematicianCountResolution

```ts
export const FIRST_NIGHT_MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION =
  "first-night-mathematician-count-resolution-v1" as const;

export type MathematicianCountDistinctPlayer = {
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly supportingFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
};

export type MathematicianCountUnresolvedFact = {
  readonly auditFactId: FirstNightAbilityOutcomeFactId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly abilityRoleId: RoleId;
  readonly abilityTaskId: ScheduledTaskId;
  readonly causeKind: AbilityOutcomeCause;
};
export type MathematicianCountResolved = {
  readonly status: "RESOLVED";
  readonly resolutionModelVersion:
    typeof FIRST_NIGHT_MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION;
  readonly window: FirstNightAbilityOutcomeWindowSnapshot;
  readonly resolvingSourcePlayerId: PlayerId;
  readonly resolvingAbilityInstanceId:
    FirstNightAbilityInstanceId;
  readonly evaluatedThroughEventSequence: number;
  readonly qualifyingAbnormalFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly distinctAbnormalPlayers:
    readonly MathematicianCountDistinctPlayer[];
  readonly excludedOwnFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredFutureFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredNormalFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredPendingFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly redundantUnresolvedFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly trueCount: number;
};

export type MathematicianCountUnresolved = {
  readonly status: "UNRESOLVED";
  readonly resolutionModelVersion:
    typeof FIRST_NIGHT_MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION;
  readonly window: FirstNightAbilityOutcomeWindowSnapshot;
  readonly resolvingSourcePlayerId: PlayerId;
  readonly resolvingAbilityInstanceId:
    FirstNightAbilityInstanceId;
  readonly evaluatedThroughEventSequence: number;
  readonly qualifyingAbnormalFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly distinctAbnormalPlayers:
    readonly MathematicianCountDistinctPlayer[];
  readonly excludedOwnFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredFutureFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredNormalFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly ignoredPendingFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly redundantUnresolvedFactIds:
    readonly FirstNightAbilityOutcomeFactId[];
  readonly unresolvedFacts:
    readonly MathematicianCountUnresolvedFact[];
  readonly currentPartialCount: number;
};

export type MathematicianCountResolution =
  | MathematicianCountResolved
  | MathematicianCountUnresolved;
```

Exact keys：

```ts
const MATHEMATICIAN_COUNT_DISTINCT_PLAYER_KEYS =
  ["playerId", "seatNumber", "supportingFactIds"] as const;

const MATHEMATICIAN_COUNT_UNRESOLVED_FACT_KEYS = [
  "abilityRoleId", "abilityTaskId", "auditFactId",
  "causeKind", "sourcePlayerId", "sourceSeatNumber"
] as const;

const MATHEMATICIAN_COUNT_RESOLVED_KEYS = [
  "distinctAbnormalPlayers", "evaluatedThroughEventSequence",
  "excludedOwnFactIds", "ignoredFutureFactIds", "ignoredNormalFactIds",
  "ignoredPendingFactIds", "qualifyingAbnormalFactIds",
  "redundantUnresolvedFactIds", "resolutionModelVersion",
  "resolvingAbilityInstanceId", "resolvingSourcePlayerId",
  "status", "trueCount", "window"
] as const;

const MATHEMATICIAN_COUNT_UNRESOLVED_KEYS = [
  "currentPartialCount", "distinctAbnormalPlayers",
  "evaluatedThroughEventSequence", "excludedOwnFactIds",
  "ignoredFutureFactIds", "ignoredNormalFactIds",
  "ignoredPendingFactIds", "qualifyingAbnormalFactIds",
  "redundantUnresolvedFactIds", "resolutionModelVersion",
  "resolvingAbilityInstanceId", "resolvingSourcePlayerId",
  "status", "unresolvedFacts", "window"
] as const;
```

RESOLVED仅有trueCount；UNRESOLVED仅有非空unresolvedFacts/currentPartialCount。count为0..11并等于distinct player数量。数组dense、unique、stable。supporting IDs非空。每个ledger fact恰好进入qualifying、own、future、normal、pending、redundant unresolved或blocking unresolved之一。clone不共享引用。

## pureCountResolver

唯一public入口：

```ts
export const resolveFirstNightMathematicianTrueCountFromState = (
  stateBeforeResolution: unknown
): MathematicianCountResolution;
```

不接受caller ledger/context/source/task/window/instance/roster/override。内部验证unknown state、读取ledger、构造context、固定upper、计数、验证完整分类并deep clone。

## runtimeShapeValidation

必须实现：

- window anchor/snapshot validators
- ability instance parser/provenance validator
- 16类evidence及generation nested validator
- fact/ledger validator
- count result validator
- 对应clone helpers
- internal context/state-subgraph validators

所有exact keys、primary identity、canonical source、cross-link、minimum/conditional evidence、dense/sort/conflict规则均为验证责任。

## domainErrorContract

冻结：

- `InvalidFirstNightAbilityOutcomeLedger`
- `InvalidFirstNightAbilityOutcomeFact`
- `InvalidFirstNightAbilityOutcomeWindow`
- `InvalidFirstNightAbilityInstance`
- `InvalidFirstNightAbilityOutcomeEvidence`
- `InvalidResolvingMathematicianContext`
- `DuplicateFirstNightAbilityOutcomeFactConflict`
- `InvalidMathematicianCountResolutionInput`

Evidence shape、identity、cross-link、minimum set、sort或conflict错误使用`InvalidFirstNightAbilityOutcomeEvidence`。Dreamer accepted invariant violation使用`InvalidFirstNightAbilityOutcomeFact`。context链错误使用`InvalidResolvingMathematicianContext`。public count输入/完整分类错误使用`InvalidMathematicianCountResolutionInput`。

## canonicalComparison

Facts按source sequence再fact ID。Evidence按固定kind rank及primary identity。Equal duplicate去重；same identity conflicting content拒绝。Result按ledger fact order和player order。禁止locale、random/time ID、UUID及raw JSON semantic equality。

## replayDeterminism

相同event stream及不同输入evidence排列必须得到相同canonical facts、ledger和result。所有证据来自terminal envelope、accepted payload及pre-event state；不得发明record ID或读取later state。

## stateRebuild

`FirstNightInitialized`创建anchor和空facts；terminal allowlist追加。accepted stream无需迁移。旧snapshot补造不在范围。

## privateProjectionBoundary

ledger、fact、evidence、window、context及count不得进入player/AI/public projection。

## acceptedEventCompatibility

全部accepted event、payload、version、command、ID、batch、receipt、settlement、V1 replay、V2 scheduling不变。

`MATHEMATICIAN_INFORMATION`继续`ApplicationNotConfigured / retryable=true`，无receipt/event/settlement/version变化。

## publicApiContract

Package root必须导出：

### Constants

- ledger/audit/window/count-resolution版本
- override set版本

### Types

- validation result
- window anchor/snapshot
- ability instance ID/parser result/provenance
- TerminalAbilityOutcomeEventType
- 16个evidence variant及总union
- statuses/causes
- fact ID/parser result/fact/ledger
- override carrier
- count distinct/unresolved/resolved/result types

### Functions

- 四个ability instance formatter及parser
- fact ID formatter/parser
- window、instance、evidence、fact、ledger、result validators
- 对应clone helpers
- `resolveFirstNightMathematicianTrueCountFromState`

禁止package-root导出internal context、context builder/validator/resolver、Historical Vortox、per-role adapters、uniform derive hook或raw ledger/context resolver。uniform derive仅供domain-core sibling内部使用。

## failureBoundary

非法state、ledger、fact、evidence、identity/cross-link、minimum set、window、instance、result、task chain或count均fail closed。只有规则允许的合法证据不足返回UNRESOLVED；不存在的tenure/record不得伪造。

## testPlan

必须覆盖原68项、Design 3/3.1全部安全测试，以及：

1. 16个variant合法exact shape；
2. 每variant缺失/额外字段拒绝；
3. 每variant正确及错误cross-link；
4. 每primary identity equal duplicate去重；
5. 每primary identity conflicting content拒绝；
6. player-role同player不同revision合法；
7. 同player同revision不同role/seat/type拒绝；
8. insertion V1/V2 nested exact shape、identity及grant差异；
9. Dreamer/Seamstress只用terminal event ID；
10. Witch使用accepted pendingDeathId；
11. Cerenovus使用accepted deliveryId；
12. Clockmaker使用accepted deliveryId；
13. Evil Twin使用accepted pairId；
14. 每terminal最低/条件evidence集合；
15. 缺必需或多不允许evidence拒绝；
16. gained必须grant+insertion；
17. explicit必须source tenure；
18. Dreamer missing Vortox tenure不伪造ROLE_TENURE；
19. Witch pending不引用future event；
20. evidence输入顺序变化不改变canonical fact；
21. Proxy/getter/sparse/cycle/symbol/nonplain fail closed；
22. replay、projection、state-only resolver、own/dedup/temporal及Math fail-closed回归；
23. typecheck、lint、full tests、coverage、diff-check及Windows/Ubuntu exact-head CI。

## explicitOutOfScope

Mathematician delivery、settlement、private count、candidate selection、Vortox final number、resolved event、general dawn/day/later night、nomination/execution/death、Witch trigger lifecycle、Cerenovus execution、Evil Twin later lifecycle、continuous poison、registration、Traveller、Pit-Hag、Barber、AI、UI、Electron、SQLite、phase transition、snapshot migration、2B18B、2B19。

## completionCriteria

实现前必须取得新的独立`RULE_DESIGN_PASS`。实现必须证明：

1. Design 3.1冻结行为完全不变；
2. `DOMAIN_RECORD`不存在；
3. 16个variant均有exact shape、identity、canonical source、fact cross-link；
4. terminal adapters具有冻结最低/条件证据；
5. player-role identity为player+revision；
6. Dreamer/Seamstress不发明delivery ID；
7. state-only resolver、internal context、window、dedup、own/temporal合同不变；
8. accepted event/payload/batch/receipt/settlement零变化；
9. Math仍fail closed且无数字；
10. 全部门禁通过；
11. 不开始2B18B或2B19。

## coverageStatus

`PARTIAL`

本Slice仅建立第一夜ledger、terminal adapters、封闭evidence及state-bound true-count foundation。Mathematician信息交付、candidate selection、私有投影、task settlement、后续夜晚及多项交互仍未实现，不得标记`COMPLETE`。

READY_FOR_RULE_DESIGN_REVIEW_ROUND_3_2
