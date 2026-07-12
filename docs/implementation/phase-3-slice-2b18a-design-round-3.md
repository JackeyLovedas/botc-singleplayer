# Phase 3 Slice 2B18A Design Round 3 — First-Night Ability Outcome Ledger Foundation

## designMetadata

- `sliceId`: `2B18A`
- `designRound`: `3 / 3`
- `parentDesign`: `docs/implementation/phase-3-slice-2b18a-design.md`
- `parentDesignSha256`: `62a83e4f7161d8bf5bd9adda6c24e353edf7e0b6b4d752846e426c0f55e8cb59`
- `reviewRound2`: `docs/implementation/phase-3-slice-2b18a-design-review-round-2.md`
- `reviewRound2Sha256`: `004d80f4b806ccd108736223f32f86577864a0c355ef27cac2015d671ac6e730`
- `resolvedEvidence`: `docs/rules/evidence/2B18-resolved.md`
- `resolvedEvidenceSha256`: `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`
- `terminalRuleVerdict`: `RULE_READY`
- `rulesBaselineVersion`: `Phase One v2.1`
- `coverageStatus`: `PARTIAL`

本文件是2B18A后续实现的唯一设计权威，不是第二轮设计的errata。

## ruleOverrides

仅使用既有四项固定12人单机模拟策略，不新增override，也不将其表述为官方规则：

- `BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1`
- `BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1`
- `BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1`
- `BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1`

## resolvedConflictMapping

- scheduling：使用2B17.2 V2顺序；2B17.3不改变该语义。
- window：`FirstNightInitialized.eventSequence`为exclusive下界；当前resolution开始前`state.lastEventSequence`为inclusive上界。
- own ability：只排除相同source player与相同canonical ability instance。
- numeric domain：固定12人无Traveller，true count为`0..11`。
- duplicate holder：base先，gained按source seat及taskId code-unit；later可见earlier，earlier不可见future，历史结果不重算。

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

`FirstNightInitialized`应用时从完整event envelope保存eventId、gameId、eventSequence。计数只保留：

```text
startEventSequence < fact.sourceEventSequence <= endEventSequence
```

唯一公共resolver内部固定`endEventSequence = stateBeforeResolution.lastEventSequence`；调用者无权提供或缩短/扩张上界。本Slice不建立general dawn、day、second-night或rolling reset。

## derivedLedgerArchitecture

新增`packages/domain-core/src/first-night-ability-outcome-ledger.ts`，并给`GameState`增加：

```ts
readonly firstNightAbilityOutcomeLedger?: FirstNightAbilityOutcomeLedger;
```

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

ledger是derived canonical state。不得新增或修改domain event、payload、command、receipt、settlement或atomic batch。

`event-applier.ts`只使用一个统一派生入口：

```ts
deriveFirstNightAbilityOutcomeFact({
  stateBefore: state,
  event
}): FirstNightAbilityOutcomeFact | undefined
```

每个相关case严格按现有validation → 用pre-event state和完整envelope派生 → 计算原next state → append fact → 返回新state执行。不得在case中复制adapter版本或规则。

### terminal allowlist

只允许以下事件生成ability outcome fact：

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

明确不生成fact：

- `WitchTargetChosen`
- `CerenovusChoiceRecorded`
- `CerenovusMadnessMarked`
- `SnakeCharmerTargetChosen`
- `DreamerTargetChosen`
- `SeamstressTargetsChosen`
- setup、assignment、bootstrap、planning、insertion、opportunity、impairment、system information
- `ScheduledTaskSettled`
- terminal allowlist外的选择或中间marker
- 无canonical event的fail-closed路径

`WitchDeathPendingMarked`虽建立pending marker，但它是effective Witch当前受支持夜间能力的terminal role-outcome事件，是中间marker排除规则的明确例外。

## auditFactIdentity

新增brand `FirstNightAbilityOutcomeFactId`。ID固定为：

```text
first-night-ability-outcome-fact-v1:<sourceEventId>
```

ability provenance使用exact union：

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

V1必须从task、唯一insertion、唯一grant及opportunity交叉恢复grantId；V2使用insertion内grantId并验证完整链。Seamstress、Cerenovus保留accepted explicit instance ID。

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
  "VORTOX_APPLICABILITY_NOT_PROVEN" |
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

- Philosopher：DEFER=`NORMAL`；grant=`NORMAL`；duplicate DRUNK marker不直接产受影响玩家异常。
- Snake Charmer：effective non-Demon/no swap=`NORMAL`；effective Demon/swap=`NORMAL`；impaired non-Demon/no swap=`NORMAL`；impaired Demon/no swap=`ABNORMAL`；历史target role不足=`UNRESOLVED`。禁止按later state重算。
- Evil Twin：完整pair与mutual information在`EvilTwinInformationDelivered`产一个`NORMAL`；胜负、死亡、both-alive不产fact。
- Witch：`WitchDeathPendingMarked`是effective terminal，产且只产一个`NORMAL`；`WitchIneffectiveResolved`是impaired terminal，产且只产一个`PENDING_TRIGGER`；对应settlement不重复。
- Cerenovus：`CerenovusMadnessMarked`不产fact；完整instruction terminal产`NORMAL`；impaired fail-closed无事件、无fact。
- Clockmaker：仅比较stored truth、selected、cause、revision。相等=`NORMAL`；已证明impairment/Vortox导致不等=`ABNORMAL`；原因不可证=`UNRESOLVED`。
- Dreamer：严格使用下述Historical Vortox矩阵。
- Seamstress：仅比较stored correct/delivered。相等=`NORMAL`，包括represented impairment；已证明impairment/Vortox导致不等=`ABNORMAL`；原因不可证=`UNRESOLVED`。
- Mathematician：本Slice不产delivery fact。

## HistoricalVortoxApplicability

Dreamer terminal adapter内部使用非公开判别联合：

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

判定只能读取`DreamerInformationDelivered`完整envelope的pre-event canonical state：

- 该时点`CurrentCharacterState`
- 该时点role tenure
- 该时点已表示的`AbilityImpairments`
- terminal payload
- 先前`DreamerTargetChosen`

不得读取terminal之后或“最新”状态、setup初始Demon、后来角色/阵营变化。

三态定义：

- `NO_EFFECTIVE_VORTOX_PROVEN`：可靠证明该历史时点无current Vortox；或唯一current Vortox拥有完整、合法、当前支持模型明确表示的失效事实。
- `EFFECTIVE_VORTOX_PROVEN`：唯一current Vortox、唯一匹配active tenure、player/seat/role/revision完整一致，且当前支持effectiveness模型证明其有效。
- `VORTOX_APPLICABILITY_UNRESOLVED`：身份不唯一、tenure缺失/冲突、effectiveness证据不完整/冲突，或判断依赖未实现continuous effect、registration、角色生命周期。

Dreamer矩阵：

| Historical Vortox | Dreamer source/result | Ledger结果 |
|---|---|---|
| `NO_EFFECTIVE_VORTOX_PROVEN` | source effective，正常pair | `NORMAL / NO_OTHER_CHARACTER_ABILITY` |
| `NO_EFFECTIVE_VORTOX_PROVEN` | represented DRUNK/POISONED，正常pair | `NORMAL / SOURCE_DRUNKENNESS`或`SOURCE_POISONING` |
| `NO_EFFECTIVE_VORTOX_PROVEN` | represented DRUNK/POISONED，pair不含历史真实角色 | `ABNORMAL`，对应impairment cause，`causedByAnotherCharacterAbility=true` |
| `NO_EFFECTIVE_VORTOX_PROVEN` | source effective，但pair不含历史真实角色 | accepted terminal invariant violation，抛`InvalidFirstNightAbilityOutcomeFact`；不产任何fact |
| `EFFECTIVE_VORTOX_PROVEN` | 任意表面pair | `UNRESOLVED / DREAMER_VORTOX_CONSTRAINT_UNRECORDED` |
| `VORTOX_APPLICABILITY_UNRESOLVED` | 任意表面pair | `UNRESOLVED / VORTOX_APPLICABILITY_NOT_PROVEN` |

正常pair要求GOOD/EVIL结构合法，且其中一个exact role snapshot等于target在terminal pre-state的真实角色。effective Vortox即使表面pair为假也不得事后补造payload未保存的Vortox constraint、tenure、effectiveness或false-only candidate因果事实。

fact生成后，later Vortox出现/离场/受损、Dreamer impairment变化或target角色变化均不得改写。

## pendingTriggerBoundary

仅`WitchIneffectiveResolved`产生`PENDING_TRIGGER`。它进入`ignoredPendingFacts`，不计数、不阻塞，不提前升级为`ABNORMAL`。`WitchDeathPendingMarked`是effective夜间施法已成功建立诅咒的`NORMAL` terminal fact，不因尚无提名而变成`UNRESOLVED`。

## unresolvedBoundary

resolver严格执行：

1. validate state与ledger；
2. window过滤并分离future；
3. exact own-instance排除；
4. 从剩余fact选择`ABNORMAL && causedByAnotherCharacterAbility`；
5. 仅对这些retained qualifying abnormal按player去重；
6. 仅当unresolved玩家已在该retained abnormal set中时，标记`redundantUnresolvedFacts`；其他unresolved阻塞。

future、window外、own-excluded abnormal均不能令unresolved冗余。

## playerDeduplication

fact按事件记录；count按`sourcePlayerId`去重。同玩家多个qualifying abnormal只计1。distinct players按roster seat，再按playerId code-unit排序。

## ownAbilityExclusion

内部只在以下同时满足时排除：

```ts
fact.sourcePlayerId === internalContext.sourcePlayerId &&
sameCanonicalDataValue(
  fact.abilityInstance,
  internalContext.abilityInstance
)
```

不得按roleId全局排除，不得排除其他玩家的earlier Mathematician或当前玩家其他instance。

## duplicateHolderTemporalPolicy

base Math先；gained按source seat再taskId code-unit。内部context把上界固定为当前state last sequence。later可读取earlier已完成fact；earlier不读取future；结果不重算。

## pureCountResolver

### 唯一公共入口
domain-core package root只公开一个count resolver：

```ts
export const resolveFirstNightMathematicianTrueCountFromState = (
  stateBeforeResolution: unknown
): MathematicianCountResolution;
```

它不接受caller-supplied ledger、context、source、task、window、instance、roster或override。

内部固定流程：

1. 对unknown state执行hostile-safe canonical preflight；
2. 验证所需GameState子图；
3. 从state读取ledger；
4. 内部重建current resolving context；
5. 内部生成own ability instance；
6. 固定window upper=`state.lastEventSequence`；
7. 执行计数；
8. 返回clone后的判别联合。

module-private、无`export`的实现细节可包括：

```ts
type InternalResolvingMathematicianContext = { /* canonical fields */ };

buildInternalResolvingMathematicianContext(
  state: GameState
): InternalResolvingMathematicianContext;

resolveValidatedFirstNightMathematicianCount(
  ledger: FirstNightAbilityOutcomeLedger,
  context: InternalResolvingMathematicianContext
): MathematicianCountResolution;
```

上述type、builder、validator、context resolver不得由模块或package root导出，不写入GameState/event/projection，application不得直接调用。测试只能通过state-based公共入口观察。

内部context必须验证：

- plain canonical state、game、baseline、`FIRST_NIGHT`、firstNight、ledger、12人roster、current character state、plan、progress；
- ledger anchor匹配game/baseline；
- upper严格等于`state.lastEventSequence`；
- 当前唯一next unsettled pending task为`MATHEMATICIAN_INFORMATION`；
- base路径与task、roster、current state一致；
- gained路径具有唯一V1/V2 insertion、grant、opportunity，且plan/scheduling version、task、player、seat、role、revision完全一致；
- 不允许base/gained伪装或V1/V2混用。

`RESOLVED`返回window、qualifying facts、distinct players、own/future/normal/pending/redundant列表及`trueCount`。`UNRESOLVED`返回相同审计列表及unresolved IDs/players/causes/tasks、`currentPartialCount`，不得含`trueCount`。计数必须为`0..11`。

## runtimeShapeValidation

实现ledger、fact、window、instance、evidence的validate/clone/equality/append。公开resolver对unknown state先用`isCanonicalDataValue`，数组用`isDenseCanonicalArray`，再做exact keys和canonical子图验证；复用`sameCanonicalDataValue`和`compareStableId`。

Proxy、revoked Proxy、getter/accessor、symbol、cycle、sparse、extra field、非标准prototype、负零、非safe integer均fail closed，getter调用次数必须为0，不得泄漏TypeError。

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

state缺失、非next、已settled、伪造base/gained链、upper mismatch、V1/V2混用使用`InvalidResolvingMathematicianContext`；公共resolver错误输入、ledger/state交叉不一致或计数超过11使用`InvalidMathematicianCountResolutionInput`；Dreamer accepted invariant violation使用`InvalidFirstNightAbilityOutcomeFact`。公共边界将未知helper异常转换为对应DomainError。

## canonicalComparison

facts按source sequence后auditFactId code-unit排序。同ID且canonical equal时append幂等；同ID不同内容抛duplicate conflict。禁止locale comparison、random、time ID、UUID及raw JSON语义比较。

## replayDeterminism

fact只来自完整envelope、accepted payload、terminal pre-state及固定literal。相同stream在Windows/Ubuntu得到canonical equal ledger；对象key插入顺序不得改变结果。

## stateRebuild

`FirstNightInitialized`创建anchor和空facts；统一derive入口在allowlist terminal事件应用时追加。accepted stream无需迁移或改payload。缺初始化envelope的旧snapshot不得补造anchor；snapshot migration不在本Slice。

## privateProjectionBoundary

不得向player/AI/public projection泄漏ledger、fact、window、internal context、cause、evidence或count。internal context仅在公共resolver调用期间pure derive，不持久化。

## acceptedEventCompatibility

`DomainEventPayloadByType`、全部payload、event version、command、ID、batch、settlement、receipt、V1 replay、V2 scheduling完全不变。

`MATHEMATICIAN_INFORMATION`继续：

```text
ApplicationNotConfigured
retryable = true
```

不写receipt、不产事件、不settle、不增加gameVersion。

## failureBoundary

非法state/ledger/fact/window/instance/evidence、伪造task链、non-next、settled、upper mismatch、duplicate冲突或超过11均fail closed。只有合法身份下的规则证据不足返回semantic `UNRESOLVED`。无terminal event则无fact。

## testPlan

保留前两轮全部68项测试映射，并新增强制覆盖：

### Public API安全

1. canonical pre-resolution state成功解析；
2. 旧式`{ledger,context}`输入拒绝；
3. package root只导出state-based resolver；
4. 不导出context type/builder/validator/context resolver；
5. forged source、instance、early/late upper均不可注入；
6. next非Math或Math已settled拒绝；
7. base seat/task不匹配拒绝；
8. gained缺grant/insertion/opportunity拒绝；
9. V1/V2混用拒绝；
10. anchor/state mismatch与altered last sequence拒绝；
11. Proxy、revoked Proxy、getter、symbol、cycle、nonplain state统一DomainError，getter零调用。

### UNRESOLVED流水线

- future unresolved不阻塞；
- own unresolved不阻塞；
- retained abnormal同玩家令unresolved冗余；
- unresolved早于retained abnormal仍冗余；
- own-excluded abnormal不能令unresolved冗余；
- future/window外 abnormal不能令in-window unresolved冗余；
- 当前玩家其他instance abnormal保留；
- 另一holder earlier abnormal保留。

### Witch/Cerenovus allowlist

- Witch target不产fact；
- Witch pending marked只产一个`NORMAL`；
- Witch ineffective只产一个`PENDING_TRIGGER`；
- settlement不重复；
- replay不duplicate；
- effective Witch不因缺提名变`UNRESOLVED`；
- impaired Witch不提前变`ABNORMAL`；
- Cerenovus marker不产fact；
- Cerenovus instruction产`NORMAL`；
- allowlist外marker不产fact。

### Dreamer/Vortox矩阵

- no effective Vortox + effective source + normal pair=`NORMAL`；
- no effective Vortox + impaired source + normal pair=`NORMAL`；
- no effective Vortox + DRUNK abnormal pair=`ABNORMAL`；
- no effective Vortox + POISONED abnormal pair=`ABNORMAL`；
- effective Vortox proven=`UNRESOLVED`；
- Vortox applicability unresolved=`UNRESOLVED`；
- effective source/no Vortox/abnormal pair抛指定DomainError；
- Vortox tenure缺失或effectiveness冲突=`UNRESOLVED`；
- terminal后Vortox、source impairment、target role变化不改fact；
- 不读取later/latest state；
- Dreamer unresolved按既有严格冗余规则阻塞。

继续运行typecheck、lint、full tests、coverage、diff-check及Windows/Ubuntu exact-head CI。

## explicitOutOfScope

Mathematician settlement、delivery、private number、candidate selection、Vortox Math output、Math resolved event、general dawn/day/later night、nomination、execution、death、Witch trigger、Cerenovus execution、Evil Twin胜负/死亡、continuous poison、registration、Traveller、Pit-Hag、Barber、AI、UI、Electron、SQLite、phase transition、snapshot migration、2B18B、2B19。

## completionCriteria

实现前必须由独立reviewer返回`RULE_DESIGN_PASS`。实现完成还必须满足：唯一state-bound公共resolver；internal context不可注入；Witch terminal例外与Dreamer/Vortox三态矩阵精确实现；accepted payload/batch零变化；Math仍fail closed且无数字交付；全部hostile、replay、projection、角色回归和跨平台门禁通过；角色覆盖不得高于`PARTIAL`；不开始2B18B或2B19。

## coverageStatus

`PARTIAL`

本Slice只建立第一夜ledger、terminal adapters及state-bound pure true-count foundation。Mathematician信息交付、候选选择、私有投影、task settlement、后续夜晚及多项交互仍未实现，不得标记`COMPLETE`。

READY_FOR_RULE_DESIGN_REVIEW_ROUND_3
