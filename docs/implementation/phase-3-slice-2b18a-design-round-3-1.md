# Phase 3 Slice 2B18A Design Round 3.1 — First-Night Ability Outcome Ledger Foundation

## designMetadata

- `sliceId`: `2B18A`
- `designRound`: `3.1`
- `authorization`: `DESIGN_ROUND_3_1_CONTRACT_COMPLETION`
- `behaviorDesignFrozen`: `true`
- `parentDesign`: `docs/implementation/phase-3-slice-2b18a-design-round-3.md`
- `parentDesignSha256`: `08d23c8cdef156edd7a90f7f1ee8725ae7b6d29c3809d967343221c1d37eebe8`
- `parentReview`: `docs/implementation/phase-3-slice-2b18a-design-review-round-3.md`
- `parentReviewSha256`: `5d43e80a7591785b7825113a27bd7d1b9c7ff724eebfb78e32b403c785625d1b`
- `resolvedEvidence`: `docs/rules/evidence/2B18-resolved.md`
- `resolvedEvidenceSha256`: `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`
- `terminalRuleVerdict`: `RULE_READY`
- `rulesBaselineVersion`: `Phase One v2.1`
- `coverageStatus`: `PARTIAL`

本文件完整继承Design Round 3已经冻结的全部行为，是2B18A后续实现的唯一设计权威。它只补齐类型、ID、exact-shape、验证和export合同，不改变任何行为结论。

## ruleOverrides

不新增override，也不修改既有四项固定12人单机模拟策略：

- `BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1`
- `BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1`
- `BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1`
- `BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1`

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
```

Exact keys按code-unit顺序冻结为：

```ts
const MATHEMATICIAN_AUDIT_OVERRIDE_VERSION_KEYS = [
  "duplicateHolderTemporal",
  "firstNightWindow",
  "numericDomain",
  "overrideSetVersion",
  "ownAbilityExclusion"
] as const;
```

不得缺失、增加或替换literal。state-based resolver内部从固定常量构造该对象；不从GameState、command或调用者输入读取override对象，不持久化，不进入projection。

## resolvedConflictMapping

- scheduling：使用accepted 2B17.2 V2顺序；2B17.3不改变该语义。
- first-night window：`FirstNightInitialized.eventSequence`为exclusive下界；当前resolution开始前`state.lastEventSequence`为inclusive上界。
- own ability：只排除相同source player与相同canonical ability instance。
- numeric domain：固定12人无Traveller，true count为`0..11`。
- duplicate holder：base先，gained按source seat及taskId code-unit；later可见earlier，earlier不可见future，历史结果不重算。

## sharedValidationContract

```ts
export type OutcomeLedgerValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };
```

所有runtime validator必须：

1. 先以`isCanonicalDataValue`拒绝Proxy、revoked Proxy、accessor、symbol、cycle、非plain object、非standard array、负零和非safe integer；
2. 数组再以`isDenseCanonicalArray`验证strict density；
3. 对象使用`isPlainRecord`和`hasExactEnumerableKeys`；
4. 不调用getter；
5. 不泄漏`TypeError`；
6. public boundary把未知异常转换为本设计冻结的`DomainError`；
7. clone逐字段创建新对象和新数组，不返回输入引用；
8. 比较使用`sameCanonicalDataValue`及显式stable comparator，不使用raw `JSON.stringify`。

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
```

Exact keys：

```ts
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

`FirstNightInitialized`应用时从完整event envelope保存eventId、gameId和eventSequence。窗口只包含：

```text
startEventSequence < fact.sourceEventSequence <= endEventSequence
```

唯一public resolver内部固定：

```text
endEventSequence = stateBeforeResolution.lastEventSequence
```

调用者不能提供window。本Slice不建立general dawn、day、second night或rolling reset。

## canonicalAbilityInstanceIdentity

```ts
export type FirstNightAbilityInstanceId =
  string & { readonly __brand: "FirstNightAbilityInstanceId" };
```

四类canonical ID：

```text
first-night-ability-instance-v1:base-task:<taskId>
first-night-ability-instance-v1:philosopher-gained-v1:<taskId>:grant:<grantId>
first-night-ability-instance-v1:philosopher-gained-v2:<taskId>:grant:<grantId>
first-night-ability-instance-v1:explicit:<roleId>:<existingInstanceId>
```

Public formatters：

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
```
Parser结果完整联合：

```ts
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
  | {
      readonly valid: false;
      readonly reason: string;
    };

export const parseFirstNightAbilityInstanceId = (
  value: unknown
): ParsedFirstNightAbilityInstanceId;
```

解析规则：

- value必须是trimmed、non-empty primitive string；
- 必须恰好匹配四个prefix之一；
- base remainder必须是non-empty taskId；
- gained格式在prefix后必须恰有一个`:grant:`分隔，taskId和grantId均non-empty；嵌入值自身含`:grant:`时拒绝；
- explicit格式在prefix后以第一个`:`分开roleId与existingInstanceId；roleId必须符合accepted canonical role ID并且两部分均non-empty；
- whitespace、control character、额外结构分隔、空segment、非canonical seat/leading-zero task编码及prefix大小写变体拒绝；
- parser必须用对应formatter重建并要求exact string equality；
- internal provenance validator还必须将embedded task/grant/role/existing instance与canonical task、grant、insertion或domain instance交叉验证。

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
  "abilityInstanceId",
  "abilityRoleId",
  "kind",
  "provenanceVersion",
  "sourcePlayerId",
  "sourceSeatNumber",
  "taskId"
] as const;

const PHILOSOPHER_GAINED_TASK_V1_PROVENANCE_KEYS = [
  "abilityInstanceId",
  "abilityRoleId",
  "grantId",
  "kind",
  "philosopherOpportunityId",
  "provenanceVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceSeatNumber",
  "taskId"
] as const;

const PHILOSOPHER_GAINED_TASK_V2_PROVENANCE_KEYS = [
  "abilityInstanceId",
  "abilityRoleId",
  "grantId",
  "kind",
  "philosopherOpportunityId",
  "provenanceVersion",
  "schedulingVersion",
  "sourceCharacterStateRevision",
  "sourcePlayerId",
  "sourceSeatNumber",
  "taskId"
] as const;

const EXPLICIT_DOMAIN_INSTANCE_PROVENANCE_KEYS = [
  "abilityInstanceId",
  "abilityRoleId",
  "existingInstanceId",
  "kind",
  "provenanceVersion",
  "sourcePlayerId",
  "sourceRoleTenureId",
  "sourceSeatNumber",
  "taskId"
] as const;
```

V1必须从task、唯一insertion、唯一grant及opportunity恢复grantId。V2必须使用insertion内grantId并验证完整链。Seamstress、Cerenovus将accepted existing instance包装进explicit统一ID，不直接把外部ID当统一ID。

## abilityOutcomeEvidenceReference

```ts
export type AbilityOutcomeEvidenceReference =
  | {
      readonly kind: "SOURCE_EVENT";
      readonly eventId: EventId;
      readonly eventType: DomainEventType;
      readonly eventSequence: number;
      readonly batchId: BatchId;
    }
  | {
      readonly kind: "TASK";
      readonly taskId: ScheduledTaskId;
      readonly taskType: FirstNightTaskType;
    }
  | {
      readonly kind: "ACTION_OPPORTUNITY";
      readonly opportunityId: ActionOpportunityId;
      readonly taskId: ScheduledTaskId;
    }
  | {
      readonly kind: "ABILITY_IMPAIRMENT";
      readonly impairmentId: AbilityImpairmentId;
      readonly impairmentKind: "DRUNK" | "POISONED";
      readonly affectedPlayerId: PlayerId;
      readonly appliedCharacterStateRevision: number;
    }
  | {
      readonly kind: "ROLE_TENURE";
      readonly roleTenureId: RoleTenureId;
      readonly playerId: PlayerId;
      readonly roleId: RoleId;
      readonly acquiredCharacterStateRevision: number;
    }
  | {
      readonly kind: "CHARACTER_STATE";
      readonly characterStateRevision: number;
    }
  | {
      readonly kind: "PLAYER_ROLE_AT_REVISION";
      readonly playerId: PlayerId;
      readonly seatNumber: SeatNumber;
      readonly roleId: RoleId;
      readonly characterStateRevision: number;
    }
  | {
      readonly kind: "DOMAIN_RECORD";
      readonly recordType:
        | "PHILOSOPHER_GRANT"
        | "FIRST_NIGHT_TASK_INSERTION"
        | "SNAKE_CHARMER_RESOLUTION"
        | "EVIL_TWIN_PAIR"
        | "WITCH_MARKER"
        | "CERENOVUS_INSTRUCTION"
        | "CLOCKMAKER_DELIVERY"
        | "DREAMER_DELIVERY"
        | "SEAMSTRESS_DELIVERY";
      readonly recordId: string;
    };
```

Variant exact keys：

```ts
const SOURCE_EVENT_EVIDENCE_KEYS =
  ["batchId", "eventId", "eventSequence", "eventType", "kind"] as const;
const TASK_EVIDENCE_KEYS =
  ["kind", "taskId", "taskType"] as const;
const ACTION_OPPORTUNITY_EVIDENCE_KEYS =
  ["kind", "opportunityId", "taskId"] as const;
const ABILITY_IMPAIRMENT_EVIDENCE_KEYS = [
  "affectedPlayerId",
  "appliedCharacterStateRevision",
  "impairmentId",
  "impairmentKind",
  "kind"
] as const;
const ROLE_TENURE_EVIDENCE_KEYS = [
  "acquiredCharacterStateRevision",
  "kind",
  "playerId",
  "roleId",
  "roleTenureId"
] as const;
const CHARACTER_STATE_EVIDENCE_KEYS =
  ["characterStateRevision", "kind"] as const;
const PLAYER_ROLE_AT_REVISION_EVIDENCE_KEYS = [
  "characterStateRevision",
  "kind",
  "playerId",
  "roleId",
  "seatNumber"
] as const;
const DOMAIN_RECORD_EVIDENCE_KEYS =
  ["kind", "recordId", "recordType"] as const;
```

排序kind rank：

```text
SOURCE_EVENT = 0
TASK = 1
ACTION_OPPORTUNITY = 2
ABILITY_IMPAIRMENT = 3
ROLE_TENURE = 4
CHARACTER_STATE = 5
PLAYER_ROLE_AT_REVISION = 6
DOMAIN_RECORD = 7
```

同kind主ID顺序分别为eventId、taskId、opportunityId、impairmentId、roleTenureId、characterStateRevision、playerId、`recordType`后recordId；字符串使用code-unit comparator，数值使用升序。完全canonical equal reference去重。相同kind及主身份但其他内容冲突抛`InvalidFirstNightAbilityOutcomeEvidence`。

evidence数组必须strict dense、canonical sorted、无symbol/accessor/Proxy/cycle/nonplain object。
## outcomeStatuses

```ts
export type AbilityOutcomeStatus =
  | "NORMAL"
  | "ABNORMAL"
  | "UNRESOLVED"
  | "PENDING_TRIGGER";

export type AbilityOutcomeCause =
  | "NO_OTHER_CHARACTER_ABILITY"
  | "SOURCE_DRUNKENNESS"
  | "SOURCE_POISONING"
  | "VORTOX_FALSE_INFORMATION"
  | "DREAMER_VORTOX_CONSTRAINT_UNRECORDED"
  | "VORTOX_APPLICABILITY_NOT_PROVEN"
  | "CAUSE_NOT_PROVEN";
```

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
```

Fact ID格式：

```text
first-night-ability-outcome-fact-v1:<sourceEventId>
```

Parser要求non-empty primitive string、exact prefix、non-empty source event ID及formatter round-trip equality。

```ts
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
```

```ts
const FIRST_NIGHT_ABILITY_OUTCOME_FACT_KEYS = [
  "abilityInstance",
  "abilityRoleId",
  "abilityTaskId",
  "auditFactId",
  "auditModelVersion",
  "causeKind",
  "causedByAnotherCharacterAbility",
  "detectedAtEventSequence",
  "evaluatedCharacterStateRevision",
  "evidenceReferences",
  "outcomeStatus",
  "sourceBatchId",
  "sourceEventId",
  "sourceEventSequence",
  "sourcePlayerId",
  "sourceSeatNumber",
  "windowVersion"
] as const;
```

合法状态组合冻结为：

- `NORMAL`：`causeKind="NO_OTHER_CHARACTER_ABILITY"`且`causedByAnotherCharacterAbility=false`。
- `ABNORMAL`：cause只能为`SOURCE_DRUNKENNESS`、`SOURCE_POISONING`或`VORTOX_FALSE_INFORMATION`，且boolean必须为true。
- `UNRESOLVED`：cause只能为`DREAMER_VORTOX_CONSTRAINT_UNRECORDED`、`VORTOX_APPLICABILITY_NOT_PROVEN`或`CAUSE_NOT_PROVEN`，且boolean必须为false。
- `PENDING_TRIGGER`：当前只允许`abilityRoleId="witch"`；cause只能为`SOURCE_DRUNKENNESS`或`SOURCE_POISONING`；boolean必须为true。

其他不变量：

- `detectedAtEventSequence===sourceEventSequence`；
- auditFactId必须与sourceEventId round-trip一致；
- ability instance的player、seat、role、task必须与fact一致；
- evidenceReferences至少包含唯一匹配的`SOURCE_EVENT`及`TASK`；
- `SOURCE_EVENT`必须匹配source event ID/type/sequence/batch；
- effective `NORMAL`可只用最小SOURCE_EVENT+TASK证据；
- impaired-but-normal仍按本合同记录`NORMAL/NO_OTHER_CHARACTER_ABILITY/false`，其impairment可作为附加evidence，但不是异常cause；
- evidence必须非空、dense、canonical sorted。

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
  "auditModelVersion",
  "facts",
  "ledgerVersion",
  "windowAnchor"
] as const;
```

`GameState`增加：

```ts
readonly firstNightAbilityOutcomeLedger?: FirstNightAbilityOutcomeLedger;
```

ledger是derived canonical state，不新增domain event，不修改accepted payload、command、receipt、settlement或batch。

`event-applier.ts`使用单一内部接入：

```ts
deriveFirstNightAbilityOutcomeFact({
  stateBefore,
  event
}): FirstNightAbilityOutcomeFact | undefined;
```

顺序固定为：现有validation成功 → 用完整terminal envelope及pre-event state派生 → 计算现有next state → append fact → 返回。各case不得复制adapter实现。

### Terminal allowlist

生成fact：

- `PhilosopherActionDeferred`
- `PhilosopherAbilityGranted`
- `SnakeCharmerNoSwapResolved`
- `SnakeCharmerIneffectiveResolved`
- `SnakeCharmerDemonSwapApplied`
- `EvilTwinInformationDelivered`
- `WitchDeathPendingMarked`
- `WitchIneffectiveResolved`
- `CerenovusMadnessInstructionDelivered`
- `ClockmakerInformationDelivered`
- `DreamerInformationDelivered`
- `SeamstressInformationDelivered`

不生成fact：

- `WitchTargetChosen`
- `CerenovusChoiceRecorded`
- `CerenovusMadnessMarked`
- `SnakeCharmerTargetChosen`
- `DreamerTargetChosen`
- `SeamstressTargetsChosen`
- setup、assignment、bootstrap、planning、insertion、opportunity、impairment、system information
- `ScheduledTaskSettled`
- allowlist外的choice/intermediate marker
- 无event的fail-closed路径

`WitchDeathPendingMarked`是effective Witch terminal `NORMAL`的明确marker例外。

## perRoleAuditAdapters

- Philosopher：DEFER=`NORMAL`；grant=`NORMAL`；duplicate DRUNK marker不直接生成受影响玩家异常。
- Snake Charmer：effective non-Demon/no swap=`NORMAL`；effective Demon/swap=`NORMAL`；impaired non-Demon/no swap=`NORMAL`；impaired Demon/no swap=`ABNORMAL`；历史target role不足=`UNRESOLVED`；禁止后来状态重算。
- Evil Twin：完整pair与mutual information在`EvilTwinInformationDelivered`生成一个`NORMAL`；胜负、死亡、both-alive不产fact。
- Witch：`WitchDeathPendingMarked`生成且只生成一个`NORMAL`；`WitchIneffectiveResolved`生成且只生成一个`PENDING_TRIGGER`；settlement不重复。
- Cerenovus：marker不产fact；完整instruction terminal=`NORMAL`；impaired fail-closed无event、无fact。
- Clockmaker：只读stored truth、selected、cause、revision。相等=`NORMAL`；已证明impairment/Vortox导致不等=`ABNORMAL`；原因不可证=`UNRESOLVED`。
- Dreamer：使用下述Historical Vortox三态矩阵。
- Seamstress：只比较stored correct/delivered。相等=`NORMAL`；已证明impairment/Vortox导致不等=`ABNORMAL`；原因不可证=`UNRESOLVED`。
- Mathematician：本Slice不产delivery fact。

## historicalVortoxApplicability

此联合及其resolver为module-private：

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

只能读取`DreamerInformationDelivered`terminal的pre-event current character state、role tenure、已表示impairment、payload和先前target choice。

矩阵：

- `NO_EFFECTIVE_VORTOX_PROVEN` + effective source + normal pair → `NORMAL`。
- `NO_EFFECTIVE_VORTOX_PROVEN` + impaired source + normal pair → `NORMAL`。
- `NO_EFFECTIVE_VORTOX_PROVEN` + represented DRUNK/POISONED + abnormal pair → 对应`ABNORMAL`。
- `NO_EFFECTIVE_VORTOX_PROVEN` + effective source + abnormal pair → 抛`InvalidFirstNightAbilityOutcomeFact`，不产fact。
- `EFFECTIVE_VORTOX_PROVEN` → `UNRESOLVED/DREAMER_VORTOX_CONSTRAINT_UNRECORDED`。
- `VORTOX_APPLICABILITY_UNRESOLVED` → `UNRESOLVED/VORTOX_APPLICABILITY_NOT_PROVEN`。

normal pair要求GOOD/EVIL结构合法且包含target在terminal pre-state的exact真实角色。禁止读取terminal后或latest状态。

## pendingTriggerBoundary

仅`WitchIneffectiveResolved`产生`PENDING_TRIGGER`。它进入ignored pending集合，不计数、不阻塞，不提前升级。`WitchDeathPendingMarked`是已正常建立诅咒的terminal `NORMAL`，不因缺少未来提名而变成`UNRESOLVED`。
## internalResolvingMathematicianContext

以下类型、keys、builder、validator和context resolver均无`export`：

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
    | "ROLE"
    | "PHILOSOPHER_GAINED_ABILITY";
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
```

Exact keys：

```ts
const INTERNAL_RESOLVING_MATHEMATICIAN_ROSTER_ENTRY_KEYS = [
  "displayName",
  "playerId",
  "playerKind",
  "seatNumber"
] as const;

const INTERNAL_RESOLVING_MATHEMATICIAN_ROSTER_SNAPSHOT_KEYS = [
  "entries",
  "rosterVersion"
] as const;

const INTERNAL_RESOLVING_MATHEMATICIAN_CONTEXT_KEYS = [
  "abilityInstance",
  "applicableOverrides",
  "contextVersion",
  "gameId",
  "resolutionCharacterStateRevision",
  "resolutionLastEventSequence",
  "rosterSnapshot",
  "rulesBaselineVersion",
  "sourceAbilityRoleId",
  "sourcePlayerId",
  "sourceSeatNumber",
  "taskId",
  "taskPlanVersion",
  "taskSourceKind",
  "window"
] as const;
```

内部builder必须从同一个pre-resolution GameState验证并构造：

- state为canonical plain data；
- game、baseline、phase=`FIRST_NIGHT`、firstNight、ledger、roster、current character state、task plan和progress有效；
- rosterVersion及12个完整entry与state.roster一致，1 HUMAN、11 AI，按seat 1..12排序；
- ledger anchor匹配game、baseline及firstNight；
- `resolutionLastEventSequence===window.endEventSequence===state.lastEventSequence`；
- 当前唯一next unsettled pending task为`MATHEMATICIAN_INFORMATION`；
- base source与task、roster、current role和seat一致；
- gained source具有唯一匹配V1或V2 insertion、grant、opportunity，plan/scheduling version、task、player、seat、role、revision完整一致；
- 禁止base/gained伪装及V1/V2混合；
- sourceAbilityRoleId固定为`mathematician`；
- abilityInstance由该canonical链内部格式化并parser round-trip；
- applicableOverrides由内部固定常量构造。

该context不进入GameState、event、command、receipt或projection；application不能调用；每次public resolver调用重新派生。

## unresolvedBoundary

内部计数流水线固定为：

1. validate state、ledger和internal context；
2. 按window分离future；
3. 排除exact own instance；
4. 从剩余fact选择`ABNORMAL && causedByAnotherCharacterAbility`；
5. 仅对这些retained qualifying abnormal按player去重；
6. 仅当unresolved玩家已经存在于retained abnormal player set时，把它列为redundant；其余unresolved阻塞。

future、window外或own-excluded abnormal不能令unresolved冗余。

## playerDeduplication

fact按事件记录，count按`sourcePlayerId`去重。同玩家多个qualifying abnormal只计1。players按seatNumber，再按playerId code-unit排序。

## ownAbilityExclusion

内部仅在以下同时满足时排除：

```ts
fact.sourcePlayerId === context.sourcePlayerId &&
sameCanonicalDataValue(
  fact.abilityInstance,
  context.abilityInstance
)
```

不得按roleId全局排除，不得排除其他玩家的earlier Mathematician或当前玩家其他instance。

## duplicateHolderTemporalPolicy

base Math先，gained按source seat再taskId code-unit。window upper由当前state last sequence固定。later可读取earlier已完成fact；earlier不读取future；历史结果不重算。

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
const MATHEMATICIAN_COUNT_DISTINCT_PLAYER_KEYS = [
  "playerId",
  "seatNumber",
  "supportingFactIds"
] as const;

const MATHEMATICIAN_COUNT_UNRESOLVED_FACT_KEYS = [
  "abilityRoleId",
  "abilityTaskId",
  "auditFactId",
  "causeKind",
  "sourcePlayerId",
  "sourceSeatNumber"
] as const;
const MATHEMATICIAN_COUNT_RESOLVED_KEYS = [
  "distinctAbnormalPlayers",
  "evaluatedThroughEventSequence",
  "excludedOwnFactIds",
  "ignoredFutureFactIds",
  "ignoredNormalFactIds",
  "ignoredPendingFactIds",
  "qualifyingAbnormalFactIds",
  "redundantUnresolvedFactIds",
  "resolutionModelVersion",
  "resolvingAbilityInstanceId",
  "resolvingSourcePlayerId",
  "status",
  "trueCount",
  "window"
] as const;

const MATHEMATICIAN_COUNT_UNRESOLVED_KEYS = [
  "currentPartialCount",
  "distinctAbnormalPlayers",
  "evaluatedThroughEventSequence",
  "excludedOwnFactIds",
  "ignoredFutureFactIds",
  "ignoredNormalFactIds",
  "ignoredPendingFactIds",
  "qualifyingAbnormalFactIds",
  "redundantUnresolvedFactIds",
  "resolutionModelVersion",
  "resolvingAbilityInstanceId",
  "resolvingSourcePlayerId",
  "status",
  "unresolvedFacts",
  "window"
] as const;
```

Result invariants：

- `RESOLVED`有trueCount，无unresolvedFacts/currentPartialCount。
- `UNRESOLVED`有非空unresolvedFacts及currentPartialCount，无trueCount。
- trueCount/currentPartialCount是`0..11` safe integer，并等于distinctAbnormalPlayers.length。
- 所有数组strict dense、无重复、canonical sorted。
- fact ID分类顺序使用ledger中的`sourceEventSequence`，再用fact ID code-unit；standalone shape validator检查dense/unique，内部semantic validator结合ledger检查该顺序。
- distinct players按seatNumber再playerId code-unit；seat/player必须匹配roster。
- supportingFactIds非空、只含该player的qualifying IDs、稳定排序。
- unresolvedFacts按source seat、source player、auditFactId排序。
- 同一fact不得出现在互斥集合。
- 经过window、future和own过滤后，每个ledger fact必须恰好进入`qualifyingAbnormalFactIds`、`excludedOwnFactIds`、`ignoredFutureFactIds`、`ignoredNormalFactIds`、`ignoredPendingFactIds`、`redundantUnresolvedFactIds`或`unresolvedFacts`之一；不存在隐式遗漏。
- clone和resolver结果不得共享state、ledger或context引用。

Public helpers：

```ts
export const validateMathematicianCountResolutionShape = (
  value: unknown
): OutcomeLedgerValidationResult;

export const cloneMathematicianCountResolution = (
  value: MathematicianCountResolution
): MathematicianCountResolution;
```

## pureCountResolver

唯一公共resolver：

```ts
export const resolveFirstNightMathematicianTrueCountFromState = (
  stateBeforeResolution: unknown
): MathematicianCountResolution;
```

它不接受caller-supplied ledger、context、source、task、window、instance、roster或override。

内部顺序：

1. hostile-safe验证unknown state所需canonical子图；
2. 从state读取ledger；
3. 内部构造并验证`InternalResolvingMathematicianContext`；
4. 内部生成own instance和window upper；
5. 调用非公开validated counter；
6. 验证result exact shape及ledger分类完整性；
7. 返回deep clone。

以下内容不得export：

```text
InternalResolvingMathematicianContext
InternalResolvingMathematicianRosterEntry
InternalResolvingMathematicianRosterSnapshot
buildInternalResolvingMathematicianContext
validateInternalResolvingMathematicianContext
resolveValidatedFirstNightMathematicianCount
HistoricalVortoxApplicability
resolveHistoricalVortoxApplicability
deriveFirstNightAbilityOutcomeFact的per-role adapters
任何接受caller-supplied ledger/context的resolver
```

## runtimeShapeValidation

必须实现并测试：

- `validateFirstNightAbilityOutcomeWindowAnchorShape`
- `validateFirstNightAbilityOutcomeWindowSnapshotShape`
- `validateFirstNightAbilityInstanceProvenanceShape`
- `validateAbilityOutcomeEvidenceReferenceShape`
- `validateFirstNightAbilityOutcomeFactShape`
- `validateFirstNightAbilityOutcomeLedgerShape`
- `validateMathematicianCountResolutionShape`
- 对应public clone helpers
- internal context及state-subgraph validators

所有validators执行exact keys、literal、cross-link、dense array、canonical order和状态组合验证。

## domainErrorContract

冻结新增错误码：

- `InvalidFirstNightAbilityOutcomeLedger`
- `InvalidFirstNightAbilityOutcomeFact`
- `InvalidFirstNightAbilityOutcomeWindow`
- `InvalidFirstNightAbilityInstance`
- `InvalidFirstNightAbilityOutcomeEvidence`
- `InvalidResolvingMathematicianContext`
- `DuplicateFirstNightAbilityOutcomeFactConflict`
- `InvalidMathematicianCountResolutionInput`

缺失state、non-next、settled、伪造base/gained链、upper mismatch、V1/V2混合使用`InvalidResolvingMathematicianContext`。public resolver输入、ledger/state交叉不一致、result分类遗漏/重复或计数超过11使用`InvalidMathematicianCountResolutionInput`。Dreamer accepted invariant violation使用`InvalidFirstNightAbilityOutcomeFact`。hostile helper未知异常必须转换为对应DomainError。

## canonicalComparison

Facts按sourceEventSequence，再按auditFactId code-unit排序。相同fact ID且canonical equal时append幂等；相同ID内容不同抛`DuplicateFirstNightAbilityOutcomeFactConflict`。禁止`localeCompare`、`Intl.Collator`、raw JSON semantic equality、random、time ID及UUID。

Evidence和result排序按本文件各自明确规则执行，不依赖对象插入顺序。

## replayDeterminism

fact只来自完整event envelope、accepted payload、terminal pre-event state及固定literal。相同stream在Windows和Ubuntu产生canonical equal ledger与result。后来Vortox、source impairment、target role、character或alignment变化不改写已派生fact。

## stateRebuild

`FirstNightInitialized`创建window anchor和空facts。统一derive入口只在terminal allowlist事件应用时追加。accepted历史stream无需迁移或修改payload。缺少初始化envelope的旧snapshot不得补造anchor；snapshot migration不在本Slice。

## privateProjectionBoundary

不得向player、AI或public projection泄漏ledger、fact、window、evidence、internal context或count。internal context只在public resolver调用期间pure derive，不持久化。

## acceptedEventCompatibility

以下完全不变：

- `DomainEventPayloadByType`
- 所有accepted payload
- event version
- command
- event/task ID
- atomic batch
- settlement
- receipt
- V1 replay
- V2 scheduling

`MATHEMATICIAN_INFORMATION`继续：

```text
ApplicationNotConfigured
retryable = true
```

不写receipt、不产event、不settle、不增加gameVersion。

## publicApiContract

`packages/domain-core/src/index.ts`允许且必须显式导出：

### Constants

- `FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION`
- `FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION`
- `FIRST_NIGHT_ABILITY_OUTCOME_WINDOW_VERSION`
- `FIRST_NIGHT_MATHEMATICIAN_COUNT_RESOLUTION_MODEL_VERSION`
- `MATHEMATICIAN_AUDIT_OVERRIDE_SET_VERSION`

### Public types

- `OutcomeLedgerValidationResult`
- `FirstNightAbilityOutcomeWindowAnchor`
- `FirstNightAbilityOutcomeWindowSnapshot`
- `FirstNightAbilityInstanceId`
- `ParsedFirstNightAbilityInstanceId`
- `FirstNightAbilityInstanceProvenance`
- `AbilityOutcomeEvidenceReference`
- `AbilityOutcomeStatus`
- `AbilityOutcomeCause`
- `FirstNightAbilityOutcomeFactId`
- `ParsedFirstNightAbilityOutcomeFactId`
- `FirstNightAbilityOutcomeFact`
- `FirstNightAbilityOutcomeLedger`
- `MathematicianAuditOverrideVersions`
- `MathematicianCountDistinctPlayer`
- `MathematicianCountUnresolvedFact`
- `MathematicianCountResolved`
- `MathematicianCountUnresolved`
- `MathematicianCountResolution`

### Public functions

- `formatBaseFirstNightAbilityInstanceId`
- `formatPhilosopherGainedV1AbilityInstanceId`
- `formatPhilosopherGainedV2AbilityInstanceId`
- `formatExplicitFirstNightAbilityInstanceId`
- `parseFirstNightAbilityInstanceId`
- `formatFirstNightAbilityOutcomeFactId`
- `parseFirstNightAbilityOutcomeFactId`
- `validateFirstNightAbilityOutcomeWindowAnchorShape`
- `validateFirstNightAbilityOutcomeWindowSnapshotShape`
- `validateFirstNightAbilityInstanceProvenanceShape`
- `validateAbilityOutcomeEvidenceReferenceShape`
- `validateFirstNightAbilityOutcomeFactShape`
- `validateFirstNightAbilityOutcomeLedgerShape`
- `validateMathematicianCountResolutionShape`
- `cloneFirstNightAbilityOutcomeWindowSnapshot`
- `cloneFirstNightAbilityInstanceProvenance`
- `cloneAbilityOutcomeEvidenceReference`
- `cloneFirstNightAbilityOutcomeFact`
- `cloneFirstNightAbilityOutcomeLedger`
- `cloneMathematicianCountResolution`
- `resolveFirstNightMathematicianTrueCountFromState`

Package root禁止导出：

- internal context types/builders/validators
- context-based counter
- raw ledger/context counter
- `HistoricalVortoxApplicability`
- Historical Vortox resolver
- per-role adapters
- uniform derive hook

uniform derive hook可作为domain-core内部模块export供`event-applier.ts`使用，但不得从package root导出。
## failureBoundary

非法state、ledger、fact、window、instance、evidence、result、伪造task链、non-next、settled、upper mismatch、duplicate conflict或超过11均fail closed。只有合法身份和历史下规则证据不足返回semantic `UNRESOLVED`。无terminal event则无fact。

## testPlan

完整保留Round 3全部测试，包括：

- ledger determinism、ID、sorting、duplicate、exact/sparse/extra/hostile；
- window anchor、exclusive lower、inclusive upper和state-bound upper；
- Philosopher、Snake Charmer、Evil Twin、Witch、Cerenovus、Clockmaker、Dreamer、Seamstress全部分类；
- player dedup、own instance、earlier/later holder；
- strict unresolved pipeline；
- package-root唯一state resolver及forged context/source/instance/window/task拒绝；
- Witch terminal allowlist；
- Dreamer/Vortox三态矩阵与terminal pre-state稳定性；
- projection non-leakage；
- `MATHEMATICIAN_INFORMATION`继续fail closed；
- accepted payload/batch零变化；
- full gates及Windows/Ubuntu一致。

Design 3.1新增强制测试：

1. 每个evidence variant exact shape通过；
2. 每个variant缺字段拒绝；
3. 每个variant额外字段拒绝；
4. evidence排序稳定；
5. duplicate equal evidence去重；
6. same identity conflicting evidence拒绝；
7. base ID round-trip；
8. gained V1 ID round-trip；
9. gained V2 ID round-trip；
10. explicit ID round-trip；
11. embedded task mismatch拒绝；
12. embedded grant mismatch拒绝；
13. embedded role/existing instance mismatch拒绝；
14. whitespace、extra separator、noncanonical encoding和known task leading-zero variant拒绝；
15. override exact shape通过；
16. override缺失、额外、错误literal拒绝；
17. `RESOLVED` exact shape通过；
18. `RESOLVED`含unresolved专属字段拒绝；
19. `UNRESOLVED` exact shape通过；
20. `UNRESOLVED`含trueCount拒绝；
21. result互斥集合重复fact拒绝；
22. result遗漏ledger fact拒绝；
23. distinct player空supportingFactIds拒绝；
24. trueCount与distinct players数量不一致拒绝；
25. currentPartialCount与distinct players数量不一致拒绝；
26. result数组非canonical顺序、duplicate或sparse拒绝；
27. returned result不共享state、ledger、context引用；
28. package-root exact public export surface；
29. internal context/builder/validator/context resolver未导出；
30. raw ledger/context resolver未导出；
31. public resolver拒绝旧式`{ledger,context}`；
32. hostile state/ID/evidence/result统一DomainError且getter零调用。

质量门禁：

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
git diff --check
```

并扫描禁止locale、random/time canonical ID、raw JSON semantic comparison、sparse `.every`、public context injection及projection leakage。

## explicitOutOfScope

- `MathematicianInformationDelivered`
- `SettleMathematicianInformation`
- `MATHEMATICIAN_INFORMATION` settlement
- Mathematician private number
- candidate/output selection
- Vortox Mathematician final number
- Mathematician resolved event
- general dawn/day/later night
- nomination、execution、death
- Witch trigger lifecycle
- Cerenovus execution
- Evil Twin victory/death lifecycle
- continuous poison
- registration
- Traveller、Pit-Hag、Barber
- AI、UI、Electron、SQLite
- phase transition
- snapshot migration
- 2B18B
- 2B19

## completionCriteria

实现前必须由新的独立reviewer返回`RULE_DESIGN_PASS`。实现完成还必须满足：

1. behavior与Round 3完全一致；
2. implementer无需回读Round 2或自行发明字段；
3. 唯一public resolver只接受unknown pre-resolution state；
4. internal context不可注入、持久化或投影；
5. evidence、instance ID、fact、result、override均满足本文件exact合同；
6. Witch terminal例外和Dreamer/Vortox矩阵精确实现；
7. accepted payload、event、batch、receipt、settlement零变化；
8. Mathematician仍fail closed且无数字交付；
9. hostile、replay、projection、角色回归和跨平台门禁全部通过；
10. 不开始2B18B或2B19。

## coverageStatus

`PARTIAL`

本Slice只建立第一夜ledger、terminal adapters、state-bound true-count resolver及其安全合同。Mathematician信息交付、candidate selection、私有投影、task settlement、后续夜晚和多项交互仍未实现，不得标记`COMPLETE`。

READY_FOR_RULE_DESIGN_REVIEW_ROUND_3_1
