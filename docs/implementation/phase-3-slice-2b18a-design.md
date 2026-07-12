# Phase 3 Slice 2B18A Design — First-Night Ability Outcome Ledger Foundation

## designMetadata

- `sliceId`: `2B18A`
- `designRound`: `2/2`
- `rulesBaselineVersion`: `Phase One v2.1`
- `resolvedEvidence`: `docs/rules/evidence/2B18-resolved.md`
- `resolvedEvidenceSha256`: `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`
- `terminalRuleVerdict`: `RULE_READY`
- `coverageStatus`: `PARTIAL`

## ruleOverrides

以下是固定12人单机模拟策略，不是官方规则原文：

- `BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1`
- `BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1`
- `BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1`
- `BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1`

使用exact-shape对象承载四个literal；缺失、额外或错误值必须拒绝。

## resolvedConflictMapping

- scheduling：采用2B17.2 V2顺序；2B17.3保持其语义。
- first-night window：`FirstNightInitialized.eventSequence`为exclusive下界；resolution开始前`lastEventSequence`为inclusive上界。
- own ability：仅排除相同source player与相同ability instance。
- numeric domain：固定12人无Traveller，真实计数为`0..11`。
- duplicate holder：base先，gained按source seat及taskId code-unit；later可见earlier，earlier不可见future，不重算历史结果。

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

`FirstNightInitialized`应用时从完整event envelope保存eventId、gameId、eventSequence。窗口只接受：

```text
startEventSequence < fact.sourceEventSequence <= endEventSequence
```

本Slice不建立通用dawn、day、second-night或rolling reset。

## derivedLedgerArchitecture

新增：

```text
packages/domain-core/src/first-night-ability-outcome-ledger.ts
```

并由`packages/domain-core/src/index.ts`显式导出所有公开constants、types、validators、builders、resolver；禁止消费者深路径导入。

```ts
export type FirstNightAbilityOutcomeLedger = {
  readonly ledgerVersion:
    typeof FIRST_NIGHT_ABILITY_OUTCOME_LEDGER_VERSION;
  readonly auditModelVersion:
    typeof FIRST_NIGHT_ABILITY_OUTCOME_AUDIT_MODEL_VERSION;
  readonly windowAnchor: FirstNightAbilityOutcomeWindowAnchor;
  readonly facts: readonly FirstNightAbilityOutcomeFact[];
};
```

`GameState`增加可选字段：

```ts
readonly firstNightAbilityOutcomeLedger?: FirstNightAbilityOutcomeLedger;
```

`FirstNightInitialized`创建空ledger。ledger是derived canonical state，不新增domain event，不修改accepted payload、command、receipt或atomic batch。

`event-applier.ts`只使用一个统一入口：

```ts
deriveFirstNightAbilityOutcomeFact({
  stateBefore: state,
  event
}): FirstNightAbilityOutcomeFact | undefined
```

每个现有case必须按固定顺序：

1. 执行该事件全部现有validation；
2. 基于未应用事件的`stateBefore`及完整envelope调用统一derive入口；
3. 计算该case原有`nextStateWithoutLedger`；
4. 若有fact，将其append到`stateBefore.firstNightAbilityOutcomeLedger`；
5. 返回`nextStateWithoutLedger`加新ledger。

不得在event-applier各case复制adapter逻辑或版本常量。`sourceEventId`、`sourceBatchId`、`sourceEventSequence`必须来自完整envelope；历史revision来自validated pre-event state/payload。

仅以下terminal事件产fact：Philosopher defer/grant；Snake Charmer三种terminal；Evil Twin information；Witch effective/ineffective terminal；Cerenovus instruction；Clockmaker、Dreamer、Seamstress information。setup、bootstrap、planning、choice、marker-only、impairment、system information、settlement及无事件fail-closed路径不产fact。

## auditFactIdentity

新增brand `FirstNightAbilityOutcomeFactId`，固定ID：

```text
first-night-ability-outcome-fact-v1:<sourceEventId>
```

```ts
export type FirstNightAbilityInstanceProvenance =
 | {
     readonly provenanceVersion:
       "first-night-ability-instance-provenance-v1";
     readonly kind: "BASE_ROLE_TASK";
     readonly abilityInstanceId: AbilityInstanceId;
     readonly abilityRoleId: RoleId;
     readonly taskId: ScheduledTaskId;
     readonly sourcePlayerId: PlayerId;
     readonly sourceSeatNumber: SeatNumber;
   }
 | {
     readonly provenanceVersion:
       "first-night-ability-instance-provenance-v1";
     readonly kind: "PHILOSOPHER_GAINED_TASK_V1";
     readonly abilityInstanceId: AbilityInstanceId;
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
     readonly abilityInstanceId: AbilityInstanceId;
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
     readonly abilityInstanceId: AbilityInstanceId;
     readonly abilityRoleId: RoleId;
     readonly taskId: ScheduledTaskId;
     readonly sourcePlayerId: PlayerId;
     readonly sourceSeatNumber: SeatNumber;
     readonly sourceRoleTenureId: RoleTenureId;
   };
```

V1 insertion没有直接grantId时，builder必须从同一player、seat、opportunity、chosen role、task source及revision找到唯一grant；零个或多个均拒绝。V2必须使用insertion内grantId并验证完整grant链。

生成ID：

```text
first-night-ability-instance-v1:base-task:<taskId>
first-night-ability-instance-v1:philosopher-gained-v1:<taskId>:grant:<grantId>
first-night-ability-instance-v1:philosopher-gained-v2:<taskId>:grant:<grantId>
```

Seamstress、Cerenovus保留现有explicit instance ID。

`evidenceReferences`为exact discriminated union，支持`SOURCE_EVENT`、`TASK`、`ACTION_OPPORTUNITY`、`ABILITY_IMPAIRMENT`、`ROLE_TENURE`、`CHARACTER_STATE`、`PLAYER_ROLE_AT_REVISION`及带recordType/recordId的`DOMAIN_RECORD`；按固定kind rank和code-unit排序。

## outcomeStatuses

```ts
export type AbilityOutcomeStatus =
  "NORMAL" | "ABNORMAL" | "UNRESOLVED" | "PENDING_TRIGGER";

export type AbilityOutcomeCause =
  "NO_OTHER_CHARACTER_ABILITY" |
  "SOURCE_DRUNKENNESS" |
  "SOURCE_POISONING" |
  "VORTOX_FALSE_INFORMATION" |
  "DREAMER_VORTOX_CONSTRAINT_UNRECORDED" |
  "CAUSE_NOT_PROVEN";
```

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

`detectedAtEventSequence===sourceEventSequence`。`ABNORMAL`必须有other-character cause。`UNRESOLVED/PENDING_TRIGGER`不得转换为`NORMAL`。

## perRoleAuditAdapters

- Philosopher：DEFER=`NORMAL`；grant=`NORMAL`；duplicate DRUNK marker不改变Philosopher fact，也不直接为受影响玩家产异常。
- Snake Charmer：effective non-Demon/no swap=`NORMAL`；effective Demon/swap=`NORMAL`；impaired non-Demon/no swap=`NORMAL`；impaired Demon/no swap=`ABNORMAL`；历史target role不足=`UNRESOLVED`。swap使用payload before/after，禁止读后来状态。
- Evil Twin：完整pair+mutual information在`EvilTwinInformationDelivered`产一个`NORMAL`；胜负、死亡、both-alive不产fact。
- Witch：有效pending marker=`NORMAL`；ineffective=`PENDING_TRIGGER`并保留DRUNK/POISONED cause。
- Cerenovus：完整effective choice-marker-instruction链=`NORMAL`；impaired fail-closed无事件、无fact。
- Clockmaker：只比较stored truth/selected/cause/revision。相等=`NORMAL`；已证明impairment/Vortox导致不等=`ABNORMAL`；不等但原因不可证=`UNRESOLVED`。
- Dreamer：terminal时固化target历史role。正常pair=`NORMAL`；impaired且pair异常=`ABNORMAL`；impaired但pair仍正常=`NORMAL`；effective或无法可靠证明Vortox状态时=`UNRESOLVED`。
- Seamstress：只比较stored `ruleCorrectAnswer`和`deliveredAnswer`。相等=`NORMAL`；已证明impairment/Vortox导致不等=`ABNORMAL`；原因不可证=`UNRESOLVED`。
- Mathematician：本Slice不产delivery fact。

## pendingTriggerBoundary

当前仅impaired Witch产生`PENDING_TRIGGER`。它进入`ignoredPendingFacts`，不计数、不阻塞，不提前升级。有效Witch marker为`NORMAL`。

## unresolvedBoundary

`UNRESOLVED`仅表示身份与历史有效，但证据不足且可能改变计数。非法shape、身份、cross-link、window或duplicate直接DomainError。

resolver流水线必须严格为：

1. validate全部输入；
2. 按window选择并分离future；
3. 排除exact own instance；
4. 从剩余fact选取qualifying `ABNORMAL && causedByAnotherCharacterAbility`；
5. 仅对这些retained qualifying abnormal按player去重；
6. 仅当某unresolved玩家已存在于该retained abnormal player set时，才将其标为`redundantUnresolvedFacts`；其余unresolved阻塞。

不得让future abnormal、own abnormal、NORMAL、PENDING或被过滤fact使unresolved冗余。fact原始顺序不得改变判断。

## playerDeduplication

fact按事件记录，计数按`sourcePlayerId`去重。同玩家多个qualifying abnormal只计1。玩家按roster seat，再按playerId code-unit排序。

## ownAbilityExclusion

仅当以下同时满足才排除：

```ts
fact.sourcePlayerId === context.sourcePlayerId &&
sameCanonicalDataValue(
  fact.abilityInstance,
  context.abilityInstance
)
```

不得按roleId全局排除，不得排除其他玩家的earlier Mathematician或当前玩家其他ability instance。

## duplicateHolderTemporalPolicy

base Math先于gained Math；gained按source seat再按taskId code-unit。later通过更大的validated upper bound读取earlier事实；earlier不读取future；历史结果不重算。

## ResolvingMathematicianContext

新增pure-derived、非event、非GameState持久字段：

```ts
export const RESOLVING_MATHEMATICIAN_CONTEXT_VERSION =
  "resolving-mathematician-context-v1" as const;

export type ResolvingMathematicianContext = {
  readonly contextVersion:
    typeof RESOLVING_MATHEMATICIAN_CONTEXT_VERSION;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly abilityRoleId: "mathematician";
  readonly taskId: ScheduledTaskId;
  readonly resolutionCharacterStateRevision: number;
  readonly abilityInstance: FirstNightAbilityInstanceProvenance;
  readonly window: FirstNightAbilityOutcomeWindowSnapshot;
  readonly roster: PlayerRoster;
  readonly rosterSize: 12;
  readonly applicableOverrides: MathematicianAuditOverrideVersions;
};
```

唯一builder：

```ts
buildResolvingMathematicianContext(
  stateBeforeResolution: GameState
): ResolvingMathematicianContext
```

它必须验证：

- game、rules baseline、first-night ledger anchor、first-night plan、progress、roster及current character state均存在且exact；
- anchor game/baseline与state一致；
- `window.endEventSequence===state.lastEventSequence`；
- 当前next unsettled pending task唯一存在、未settled、taskType为`MATHEMATICIAN_INFORMATION`；
- base路径：task source为`ROLE`、role为mathematician、source player/seat与canonical roster/current state一致；
- gained路径：唯一匹配V1或V2 insertion；唯一grant；唯一Philosopher opportunity；task/player/seat/chosen role/opportunity/grant/revision/plan version/scheduling version完整一致；
- 不允许base伪装gained、gained伪装base或V1/V2混合；
- 输出canonical source、seat、instance、window、roster和override versions。

同时提供`validateResolvingMathematicianContextShape(value)`。builder和validator必须返回clone，不保留调用者可变引用。

## pureCountResolver

```ts
resolveFirstNightMathematicianTrueCount(input: {
  readonly ledger: FirstNightAbilityOutcomeLedger;
  readonly context: ResolvingMathematicianContext;
}): MathematicianCountResolution
```

resolver不得再接受裸source、裸instance、裸window、裸roster或裸override。它必须重新验证ledger与context、确认context anchor等于ledger anchor，再执行固定流水线。

`RESOLVED`包含window、evaluatedThrough、qualifying facts、distinct players、own/future/normal/pending/redundant列表及`trueCount`。

`UNRESOLVED`包含同样审计列表，加`unresolvedFactIds`、players、causes、tasks及`currentPartialCount`，不得包含`trueCount`。计数必须为`0..11`；超过11拒绝，不截断。

## runtimeShapeValidation

实现ledger、fact、window、instance、evidence、context的validate/clone/equality/append。入口先用`isCanonicalDataValue`，数组用`isDenseCanonicalArray`，再用`isPlainRecord`和`hasExactEnumerableKeys`；比较复用`sameCanonicalDataValue`与`compareStableId`。

所有hostile Proxy、revoked Proxy、getter/accessor、symbol、cycle、sparse、extra field、非标准prototype、负零、非safe integer必须转换为指定DomainError，不得泄漏TypeError。

## domainErrorContract

在`errors.ts`冻结新增`DomainErrorCode`：

- `InvalidFirstNightAbilityOutcomeLedger`
- `InvalidFirstNightAbilityOutcomeFact`
- `InvalidFirstNightAbilityOutcomeWindow`
- `InvalidFirstNightAbilityInstance`
- `InvalidFirstNightAbilityOutcomeEvidence`
- `InvalidResolvingMathematicianContext`
- `DuplicateFirstNightAbilityOutcomeFactConflict`
- `InvalidMathematicianCountResolutionInput`

触发边界：

- 对应shape/semantic validator使用其专属`Invalid...`；
- 相同fact ID但内容不同使用`Duplicate...Conflict`；
- context builder的缺状态、非next、已settled、伪造链、upper mismatch、V1/V2混合均用`InvalidResolvingMathematicianContext`；
- resolver的ledger/context交叉不一致、非法roster/domain、超过11使用`InvalidMathematicianCountResolutionInput`；
- helper内部所有未知异常必须在公共边界转换为对应DomainError，原`DomainError`可原样传播。

## canonicalComparison

facts按source sequence后auditFactId code-unit排序。相同ID且canonical equal时append幂等；不同内容抛duplicate conflict。禁止locale、随机、时间ID、UUID及raw JSON语义比较。

## replayDeterminism

fact只来自envelope、accepted payload、pre-event canonical state及固定literal。相同stream在Windows/Ubuntu得到canonical equal ledger；key插入顺序不得影响结果。

## stateRebuild

`FirstNightInitialized`创建anchor和空facts；统一derive入口在terminal事件应用时追加。accepted stream无需迁移或改payload。缺完整初始化envelope的旧snapshot不得补造anchor；snapshot migration不在本Slice。

## privateProjectionBoundary

不得修改`PlayerPrivateKnowledgeView`，不得向player/AI projection泄漏ledger、fact、window、context、cause、evidence或count。context只在未来settlement边界即时pure derive，不持久化、不投影。

## acceptedEventCompatibility

`DomainEventPayloadByType`、所有payload、event version、command、ID、batch、settlement、receipt、V1 replay、V2 scheduling完全不变。

`MATHEMATICIAN_INFORMATION`继续`ApplicationNotConfigured / retryable=true`，不写receipt、不产事件、不settle、不增version。

## failureBoundary

非法ledger/fact/window/instance/evidence/context、伪造task链、非next、已settled、upper mismatch、duplicate冲突或超过11均fail closed。只有合法身份下的规则证据不足返回semantic `UNRESOLVED`。无terminal事件则无fact。

## testPlan

原68项全部保留，并增加/明确：

- 1–10 ledger determinism、ID、排序、duplicate、exact/sparse/extra/hostile及projection。
- 11–16 anchor和window、self future、setup/bootstrap/system无fact。
- 17–45逐角色全部指定分类及历史不重算。
- 46–56 player dedup、状态过滤、own instance、duplicate temporal及0..11。
- 57–60 Math仍fail closed、无delivery、无settlement/version、payload不变。
- 61–68角色回归、full gates、Windows/Ubuntu。

Context伪造测试必须覆盖：base伪造、gained伪造、seat、task、grant、opportunity、revision、plan/scheduling version、non-next、already-settled、upper不等于last sequence、V1/V2 mixed generation。

UNRESOLVED流水线至少六类：

1. future unresolved不阻塞；
2. own-instance unresolved不阻塞；
3. retained abnormal同玩家使unresolved冗余；
4. unresolved在数组中早于abnormal仍冗余；
5. own-excluded abnormal不能使同玩家unresolved冗余；
6. future abnormal不能使同玩家in-window unresolved冗余。

另测所有公共helper对Proxy/getter/revoked Proxy只抛冻结的DomainError code，不抛TypeError。

## explicitOutOfScope

Mathematician settlement/delivery/private number、candidate selection、Vortox Math output、Math resolved event、general dawn/day/later night、nomination、execution、death、Witch trigger、Cerenovus execution、Evil Twin胜负/死亡、continuous poison、registration、Traveller、Pit-Hag、Barber、AI、UI、Electron、SQLite、phase transition、snapshot migration、2B18B、2B19。

## completionCriteria

必须满足RULE_READY、独立`RULE_DESIGN_PASS`、统一derive入口、validated context-only resolver、固定DomainError合同、全部adapter/hostile/replay/context/pipeline/projection测试、accepted payload/batch零变化、Math仍fail closed、无数字交付、full local及Windows/Ubuntu exact-head CI通过。角色覆盖不得高于`PARTIAL`，不得开始2B18B或2B19。

## coverageStatus

`PARTIAL`

本Slice仅建立第一夜审计账本、validated resolution context及纯true-count基础。Mathematician交付、候选选择、私有投影、settlement、后续夜晚及多项交互仍未实现。

READY_FOR_RULE_DESIGN_REVIEW_ROUND_2
