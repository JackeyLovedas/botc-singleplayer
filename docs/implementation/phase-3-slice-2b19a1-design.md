# Phase 3 Slice 2B19A1 — Base Dreamer V2 Opportunity Contract Frozen Design

## Metadata

- sliceId: `2B19A1`
- title: `Base Dreamer V2 Opportunity Contract`
- authorization: `USER_AUTHORIZED_2B19A1_BASE_DREAMER_V2_OPPORTUNITY_CONTRACT`
- designRound: `1 / 2`
- acceptedMain: `9c4938aca1416995b7607589b73b0238ef4f6ea4`
- ruleEvidence: `docs/rules/evidence/2B19A1.md`
- ruleEvidenceSha256: `505456357b498c063e8d579aaabef025fd7cb5437f11264915cd810b470da4e6`
- ruleVerdict: `RULE_READY`
- ruleCoverageStatus: `SKELETON`
- roleCoverageStatus: `Dreamer PARTIAL`（保持不变）
- implementationAuthorized: `false`，直到独立 reviewer 返回 `RULE_DESIGN_PASS`
- expectedProductionFiles: `2`
- expectedAddedProductionLOC: `360–480`
- stopLossPrecheck: `PASS`；本设计不要求新共享基础设施、新 GameState 字段、新 event type、projection/ledger 生产修改、target/delivery/Vortox/impairment/gained Dreamer 实现，也不超过 4 个生产文件或 800 行新增生产代码

## Authority and Scope

本文件是 2B19A1 实现阶段的完整、独立、唯一设计权威。实现者不需要回读其他设计文件补全类型、literal、分支或测试责任，但仍必须遵守 `AGENTS.md`、治理 ADR、review protocol 和 rule evidence。

本 Slice 只实现：`first-night-task-plan-v2` 下 base Dreamer 的 V2 opening opportunity；V2 exact runtime contract；canonical task/opportunity identity；base source contract；accepted Dreamer role tenure 与 canonical base ability-instance 绑定；application opening；accepted replay；duplicate 与 V1/V2 same-task mixing protection；OPEN V2 `SubmitDreamerAction` receipt-free fail closed。

明确不实现：target 选择、Dreamer information delivery、GOOD/EVIL candidates、Storyteller false-role choice、Vortox、DRUNK/POISONED 求值、terminal outcome、ledger fact、V2 private knowledge、Philosopher-gained Dreamer execution、first-night completion、DAY、2B19A2、2B19A3、2B19B、Phase 2C。

## Governance Classification

### Reachability

- `R1 — current accepted path`：V2 plan 的 base Dreamer 新命令产生一个 V2 opportunity；该事件可被 accepted replay；相同 commandId 的已接受命令仍由现有 receipt 机制幂等；第二个 opportunity 与 same-task V1/V2 mixing 被拒绝；OPEN V2 submit fail closed。
- `R2 — legacy accepted history`：V1 plan + V1 Dreamer opportunity 精确 replay；V2 plan + legacy V1 Dreamer opportunity 精确 replay；V1 target/information 后续历史不迁移、不重写、不重新解释。
- `R3 — hostile/corrupted history`：malformed/unknown schema、noncanonical ID、duplicate、same-task V1/V2 mixing、task/source/seat/role/revision/tenure/ability-instance mismatch、extra/missing field、nonplain/Proxy/getter/symbol/cycle 等 T1 输入 fail closed。
- `R4 — future capability`：target、delivery、candidate、Vortox、impairment、ledger、private knowledge 与 gained Dreamer 保持未实现；本 Slice 不预建这些 producer/resolver。

### Trust

- `T1`：Open command 输入、`FirstNightActionOpportunityCreated` V2 payload、persisted replay、Submit command 输入。执行 exact keys、canonical data、plain record、dense array、额外/缺失字段、unknown discriminator、适用的 Proxy/getter/symbol/cycle 防御，异常统一 fail closed。
- `T2`：rebuild 后 GameState、task plan/progress、current character state、role-tenure state、pre-event opportunity state。验证领域不变量、state-before provenance、deterministic rebuild 与 exact cross-link；不把 T2 当作免验证的调用者事实。
- `T3`：module-private pure constructors、canonical formatter/parser、expected-opportunity builder。仅要求封闭类型、确定性、exhaustive branch 与关键边界测试；不得把 T3 扩大成新的公共 hostile-input 基础设施。

## 7.1 V1 Compatibility Contract

1. 现有 V1 exact payload 不变。现有 V1 kind literal 保持 `DREAMER_FIRST_NIGHT_ACTION`；V1 不新增 schema 字段、tenure 字段、ability-instance 字段或 source contract。
2. 将当前 V1 类型显式命名为 `DreamerActionOpportunityVisibilityV1` 与 `DreamerActionOpportunityV1`；`DreamerActionOpportunity` 成为 `DreamerActionOpportunityV1 | DreamerActionOpportunityV2`。这只是类型显式化，不改变 V1 runtime shape。
3. `first-night-task-plan-v1` 上的新 `OpenFirstNightRoleActionOpportunity` 继续生成 V1。
4. 新增 module-private legacy expected builder：
   - `tryCreateLegacyDreamerFirstNightActionOpportunity`
   - throwing wrapper 如现有结构需要可命名 `createLegacyDreamerFirstNightActionOpportunity`
   - 它接受 V1 plan，也接受仅用于 replay 的 V2 plan + legacy V1 history；只接受 base ROLE Dreamer task；产生原 V1 exact shape 与原 V1 ID。
5. 普通 generation dispatcher 绝不能在 V2 plan 上选择 legacy builder；payload replay validator 遇到 kind `DREAMER_FIRST_NIGHT_ACTION` 时必须显式选择 legacy builder，因此 accepted V2 plan + legacy V1 event 保持可 replay。
6. legacy event 不升级为 V2，不产生替换事件，不改变 event bytes。
7. 同一 taskId 在 opportunity state 中至多一个 opportunity，不论 kind/version/status。V1 与 V2 的 ID 不同也不能绕过 same-task uniqueness。

## 7.2 V2 Generation Contract

只有以下组合可以生成 V2：

- `firstNightTaskPlan.taskPlanVersion === "first-night-task-plan-v2"`
- task 唯一存在且 `taskType === "DREAMER_ACTION"`
- `taskClass === "ROLE_ACTION"`
- `task.source.kind === "ROLE"`
- `task.source.role.roleId === "dreamer"`
- task source 与 current base Dreamer、active tenure、canonical task ID 完整一致。

V1 plan 不得生成 V2；`PHILOSOPHER_GAINED_ABILITY` Dreamer task 不得进入 V2 base builder；其他 role/task 不得生成 V2。public Dreamer dispatcher 按 plan version 分派：V1 -> legacy V1 builder；V2 -> base V2 builder。V2 gained Dreamer 由 application receipt-free guard 截断，不落入 receipt rejection。

## 7.3 Exact V2 Opportunity Runtime Contract

必须直接定义以下 constants 与类型；literal、字段名和 readonly shape 均冻结：

```ts
export const DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION =
  "dreamer-first-night-action-opportunity-v2" as const;

export const DREAMER_V2_VISIBILITY_SCHEMA_VERSION =
  "dreamer-first-night-action-visibility-v2" as const;

export const DREAMER_BASE_SOURCE_CONTRACT_VERSION =
  "dreamer-base-source-contract-v1" as const;

export type DreamerActionOpportunityVisibilityV1 = {
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly targetSchema: "OTHER_NON_TRAVELLER_PLAYER";
};

export type DreamerActionOpportunityVisibilityV2 = {
  readonly visibilitySchemaVersion:
    typeof DREAMER_V2_VISIBILITY_SCHEMA_VERSION;
  readonly canChooseTarget: false;
  readonly supportedDecisionKinds: readonly [];
  readonly futureUnsupportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly futureTargetSchema: "OTHER_NON_TRAVELLER_PLAYER";
};

export type BaseDreamerV2SourceContract = {
  readonly sourceContractVersion:
    typeof DREAMER_BASE_SOURCE_CONTRACT_VERSION;
  readonly kind: "BASE";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRoleId: "dreamer";
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceCharacterStateRevision: number;
  readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
};

export type DreamerActionOpportunityV1 = DreamerActionOpportunitySource & {
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly visibility: DreamerActionOpportunityVisibilityV1;
};

export type DreamerActionOpportunityV2 = DreamerActionOpportunitySource & {
  readonly opportunitySchemaVersion:
    typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V2";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly visibility: DreamerActionOpportunityVisibilityV2;
};

export type DreamerActionOpportunity =
  | DreamerActionOpportunityV1
  | DreamerActionOpportunityV2;
```

`FirstNightAbilityInstanceId` 从现有 outcome-ledger API 导入；不得新建第二种 ability ID。`ActionOpportunityKind` 必须加入 distinct literal `DREAMER_FIRST_NIGHT_ACTION_V2`，同时保留 V1 literal。

V2 opportunity object 的 exact enumerable keys 是且只能是：

```text
nightNumber
opportunityId
opportunityKind
opportunitySchemaVersion
opportunityStatus
sourceCharacterStateRevision
sourceContract
sourcePlayerId
sourceRole
sourceSeatNumber
taskId
taskType
visibility
```

V2 `FirstNightActionOpportunityCreated` payload 的 exact enumerable keys 是上述 13 项再加：

```text
rulesBaselineVersion
```

`BaseDreamerV2SourceContract` exact enumerable keys 是且只能是：

```text
kind
sourceAbilityInstanceId
sourceCharacterStateRevision
sourceContractVersion
sourcePlayerId
sourceRoleId
sourceRoleTenureId
sourceSeatNumber
taskId
taskPlanVersion
taskType
```

V2 visibility exact enumerable keys 是且只能是：

```text
canChooseTarget
futureTargetSchema
futureUnsupportedDecisionKinds
supportedDecisionKinds
visibilitySchemaVersion
```

两数组必须是 dense canonical arrays，长度分别为 0 与 1，且唯一 future literal 是 `CHOOSE_PLAYER`。V2 status 创建时只能为 `OPEN`。V2 payload 不得包含 target、candidate、information、reliability、impairment、Vortox、ledger、grant、insertion、entitlement 或 Philosopher 数据。

新增 type guard `isDreamerActionOpportunityV2`。判定必须同时依赖 distinct kind 与 exact schema literal，不能仅以某字段存在为充分证明；T1 validation 仍须做完整 exact-shape 检查。

## 7.4 Canonical Identity Contract

Base Dreamer task 继续复用既有 canonical grammar 和 formatter：

```text
first-night-v1:DREAMER_ACTION:seat-XX
```

expected task ID 必须等于 `roleScheduledTaskId("DREAMER_ACTION", sourceSeatNumber)`；V2 plan 不改变 base task grammar。

V2 opportunity 使用唯一 grammar：

```text
first-night-v2:DREAMER_ACTION:seat-(0[1-9]|1[0-2]):opportunity-01
```

必须新增并只新增以下 formatter/parser：

```ts
export const formatBaseDreamerV2FirstNightActionOpportunityId = (input: {
  readonly seatNumber: SeatNumber;
}): ActionOpportunityId;

export const parseBaseDreamerV2FirstNightActionOpportunityId = (
  value: unknown
):
  | {
      readonly valid: true;
      readonly canonicalId: ActionOpportunityId;
      readonly taskType: "DREAMER_ACTION";
      readonly seatNumber: SeatNumber;
      readonly opportunityIndex: 1;
    }
  | { readonly valid: false; readonly reason: string };
```

formatter 只输出 `opportunity-01`。parser 只接受 primitive string、exact grammar、seat 01–12，并以 formatter round-trip 拒绝大小写、空白、替代分隔符、seat alias、`opportunity-1`、`opportunity-001`、其他 index、V1 prefix 或其他 task type。不得接受多个字符串别名。

V2 exact validation 交叉绑定：parsed seat = top-level sourceSeatNumber = sourceContract.sourceSeatNumber = task source seat；taskId = top-level/sourceContract taskId = `roleScheduledTaskId(...)`；task type 均为 `DREAMER_ACTION`；source player/seat/revision 在 top-level、task/current state、source contract、tenure 中一致。

V1 formatter/parser 与 V1 ID grammar 完全不变。

## 7.5 Base Source Contract

V2 source contract 只证明 base Dreamer opening provenance，不代表 target 或 ability resolution。canonical builder 必须从 state 派生整个 object；caller 不得提供 source contract、tenure ID、ability instance 或 opportunity ID。

所有 cross-link 必须成立：

1. `sourceContractVersion === DREAMER_BASE_SOURCE_CONTRACT_VERSION`。
2. `kind === "BASE"`。
3. `taskPlanVersion === "first-night-task-plan-v2"`，并等于 state plan version。
4. contract task ID/type 等于 top-level 与唯一 target task。
5. source player/seat 等于 task ROLE source、current state entry 与 top-level。
6. `sourceRoleId === "dreamer"`；task source snapshot、current snapshot、top-level sourceRole 使用 `sameRoleSetupSnapshot` 精确一致且 roleId 为 dreamer。
7. source revision 等于 top-level 与 `currentCharacterState.revision`，且为 positive safe integer。
8. 使用 accepted 2B19T 的 `findUniqueActiveRoleTenure`，参数固定为 canonical role-tenure state、player、seat、`roleId: "dreamer"`、current revision。返回必须恰好一个 active tenure；missing/duplicate/corrupt state fail closed。
9. tenure record 的 player/seat/role/revision interval 与 source 一致；`parseRoleTenureId` round-trip 必须证明 seat、role dreamer 与 acquired revision。
10. `sourceAbilityInstanceId === formatBaseFirstNightAbilityInstanceId(task.taskId)`；`parseFirstNightAbilityInstanceId` 必须返回 valid、kind `BASE_ROLE_TASK`、generation `BASE`、同 taskId、taskType `DREAMER_ACTION`、embedded seat 与 source seat 一致。

不得建立 Dreamer 专用 ability-state、entitlement 或新 GameState 字段。

## 7.6 Canonical Builder and Validation Dispatch

在 `packages/domain-core/src/first-night-action-opportunity.ts` 内实现 module-private canonical V2 expected builder（try + throwing wrapper 命名与现有约定一致）。它从 `OpportunityValidationInput` 读取完整 `FirstNightTaskPlan`（不再只 Pick tasks）与现有 `seamstressRoleTenureState` 通用 tenure state；不得新增输入字段或第三个生产文件。

V2 builder 顺序检查：

1. plan night 1、version V2；
2. taskId 在 tasks 中恰好一次；
3. task 未 settled；
4. task 是 current next unsettled；
5. task type/class/source 是 base ROLE Dreamer；
6. canonical base task ID；
7. current source entry 唯一匹配 task player/seat/role snapshot；
8. current revision valid；
9. unique active Dreamer tenure；
10. canonical base ability instance；
11. pre-event state 中该 taskId 没有任何 V1/V2 opportunity（OPEN/CLOSED 均不允许）；
12. 派生 canonical V2 ID、source contract、OPEN status 与 non-actionable visibility。

`tryCreateFirstNightRoleActionOpportunity` 的 Dreamer 分支必须按 plan version dispatch；其他角色行为不变。

`validateFirstNightActionOpportunityCreatedPayload` 必须先做 canonical-data/plain/exact-key/discriminator 验证，然后按 kind 选择 expected builder：

- `DREAMER_FIRST_NIGHT_ACTION` -> legacy V1 builder（V1 或 V2 plan replay 均允许）；
- `DREAMER_FIRST_NIGHT_ACTION_V2` -> canonical V2 builder；
- 其他已支持 kind -> 现有路径。

expected object 与 payload 必须字段级深比较，包括 nested source contract、visibility arrays 和 role snapshot；禁止 raw `JSON.stringify` 语义比较。clone、state shape、sameOpportunityCore/exhaustive union 必须覆盖 V2，保留 readonly/dense canonical data。任何 unknown discriminator、schema mismatch、extra/missing field 或 getter/Proxy throw 都返回 invalid 或抛既有 `InvalidFirstNightActionOpportunityCreatedPayload` DomainError，不能泄漏非领域异常。

`validateFirstNightActionOpportunityStateShape` 除现有 opportunityId uniqueness 外，新增 taskId uniqueness；因此 duplicate V2 与 V1/V2 same-task mixing 均 fail closed。不得以不同 ID 绕过。

## 7.7 Application Contract

生产改动仅在 `packages/application/src/game-application-service.ts` 增加两类 receipt-free guard，并让现有 open path 使用 version-aware domain builder。

### Open base V2

在合法 V2 base Dreamer next task 上，`OpenFirstNightRoleActionOpportunity` 创建且仅创建一个 `FirstNightActionOpportunityCreated`，event type 不变，payload 为 7.3 exact V2 shape。现有 event metadata、atomic batch、prospective replay、accepted receipt/idempotency 不变。相同 accepted commandId 返回现有幂等 accepted result，不新增事件。

已有 same-task opportunity 时保留 deterministic rejection：OPEN -> `ActionOpportunityAlreadyOpen`；CLOSED -> `ActionOpportunityAlreadyClosed`。不得产生第二事件。

### V2 gained Dreamer open guard

在 `execute` 完成 receipt read、event load、canonical rebuild、expectedGameVersion 检查之后，但在 `validate`/`recordRejected` 与 batch construction 之前，检测：

- command type `OpenFirstNightRoleActionOpportunity`；
- plan version V2；
- requested task 存在且正是 current next unsettled；
- task type `DREAMER_ACTION`；
- task source kind `PHILOSOPHER_GAINED_ABILITY`。

返回 exact retryable failure：

```text
status = failed
code = ApplicationNotConfigured
failureStage = first-night-role-action
retryable = true
currentGameVersion = rebuilt current version
message = Philosopher-gained Dreamer V2 opportunity is not configured in Slice 2B19A1
```

该路径不得调用 `recordRejected`，不得写 receipt，不得追加事件，不得改变 gameVersion/progress/ledger/opportunities；同 commandId 重试返回等价 failure。无效的非-next/不存在 task 继续走原 deterministic validation，不被此 guard 掩盖。

## 7.8 Accepted Replay Contract

`FirstNightActionOpportunityCreated` event type 不变；event applier 不需要生产修改，因为它已把 state-before task plan/progress/current state/opportunity state/role-tenure state 传给 domain validator。

Accepted V2 replay 必须从 state-before 调用同一个 canonical V2 expected builder，精确重算并比较全部字段。以下任一项必须抛 `InvalidFirstNightActionOpportunityCreatedPayload` 并拒绝 stream：wrong plan/version/task/task class/source kind/player/seat/role snapshot/revision/tenure/ability instance/source contract/schema/kind/ID/status/visibility；missing/extra field；unknown discriminator；duplicate ID；duplicate task；V1/V2 same-task mixing。

Accepted V1 replay 仍调用 legacy builder；V2 plan + legacy V1 event 仍精确通过。不得把手工拼接的 state 当作 accepted-stream primary authority；accepted replay primary tests 必须从真实事件流重建或由 event-applier 接受完整前序历史。

## 7.9 V2 Submit Receipt-Free Fail-Closed Contract

在 `execute` 完成 receipt read、event load、canonical rebuild、expectedGameVersion 检查之后，但在 `validate`、target validation、`recordRejected`、metadata/batch construction 之前，按 command opportunityId 查找 canonical stored opportunity。当：

- command type `SubmitDreamerAction`；
- opportunity 存在；
- `isDreamerActionOpportunityV2(opportunity)`；
- `opportunityStatus === "OPEN"`；

立即返回：

```text
status = failed
code = ApplicationNotConfigured
failureStage = first-night-role-action
retryable = true
currentGameVersion = rebuilt current version
message = Dreamer V2 target submission is not configured in Slice 2B19A1
```

结果必须：不写 accepted/rejected receipt；不生成 target/delivery/settlement event；不关闭 opportunity；不改变 task progress、ledger、gameVersion、private knowledge；同 commandId 可安全重试且不被消费。

不存在、CLOSED、非 Dreamer 或 V1 opportunity 继续走现有 validation。尤其 V1 `SubmitDreamerAction` 的 actor、decision、target、settlement与 delivery 行为完全不变。

## 7.10 Projection and Ledger Non-Effect

不修改任何 projection 或 ledger 生产文件。OPEN V2 opportunity 不是 knowledge delivery，也不是 terminal outcome：

- player private view 与 AI private view 不新增字段、不出现 Dreamer V2 information；
- 不创建 Dreamer target fact、delivery fact、outcome-ledger fact；
- `FirstNightAbilityOutcomeLedger` bytes/facts 不变；
- Mathematician count 不变；
- first-night task 不 settle，phase 不进入 DAY。

这部分由 projection/ledger non-effect tests 证明，不通过生产代码占位实现。

## Production File Allowlist and LOC

唯一允许修改的生产文件：

1. `packages/domain-core/src/first-night-action-opportunity.ts`
2. `packages/application/src/game-application-service.ts`

预计新增生产 LOC：`360–480`。测试与文档不计生产文件/LOC。允许修改现有 test 文件或新增专用 test 文件，但不得修改 workflow、dependency、timeout、Vitest fork 配置。

若实现实际需要第 3 个生产文件，不立即算 stop-loss；但必须先停下并由 controller 核对是否仍属已有基础设施。若需要超过 4 个生产文件、超过 800 新增生产 LOC、新共享基础设施、新 GameState 顶层字段、新 event type、projection/ledger 生产修改、target/delivery/Vortox/impairment/gained Dreamer 实现，则 `RESLICE_REQUIRED`。

当前设计本身无需触发 stop-loss。

## Completion Criteria and Primary Authority Tests

每个 criterion 至少一个 primary authority test；一个 physical test 只能声明一个 primary layer。允许同一测试附带次要断言，但不得重复冒充多层 primary authority。

| # | Completion criterion | Primary layer | Required primary authority test |
|---:|---|---|---|
| 1 | V1 plan 新命令仍生成原 V1 opportunity exact shape | `ACCEPTED_STREAM_INTEGRATION` | application service 从真实 V1 history 执行 open，断言 accepted event exact V1 payload且无 V2 keys |
| 2 | accepted V1 plan + V1 opportunity 精确 replay | `LEGACY_REPLAY_COMPATIBILITY` | `rebuild.test.ts` 完整 V1 event stream rebuild 等于既有 state |
| 3 | accepted V2 plan + legacy V1 opportunity 精确 replay | `LEGACY_REPLAY_COMPATIBILITY` | V2 plan 前序 accepted stream 加原 V1 payload可 rebuild，且 payload未迁移 |
| 4 | V2 base Dreamer 新命令生成唯一 V2 opportunity | `ACCEPTED_STREAM_INTEGRATION` | application open accepted，eventCount 1，kind/schema/status/source 均 exact |
| 5 | V2 payload/visibility/source contract exact shape | `STRUCTURAL_VALIDATION` | domain table tests 覆盖每个 missing/extra/wrong literal 与 dense arrays |
| 6 | V2 ID formatter/parser canonical round-trip | `PURE_POLICY_SEAM` | seats 1/9/10/12 round-trip且固定 opportunity-01 |
| 7 | noncanonical opportunity ID aliases 全拒绝 | `STRUCTURAL_VALIDATION` | whitespace/case/prefix/seat/index/task aliases table |
| 8 | source contract 完整交叉绑定 task/player/seat/role/revision | `PURE_POLICY_SEAM` | canonical builder expected object及逐字段 source-fact tamper |
| 9 | Dreamer tenure 必须唯一 active 且与 current source 一致 | `HOSTILE_REPLAY_REJECTION` | missing/duplicate/ended/wrong player-seat-role-revision tenure event replay拒绝 |
| 10 | sourceAbilityInstanceId 是 canonical base task instance | `PURE_POLICY_SEAM` | formatter/parser kind BASE_ROLE_TASK/task/seat/role round-trip，gained/alias ID拒绝 |
| 11 | accepted V2 event 可由 state-before 精确 replay | `ACCEPTED_STREAM_INTEGRATION` | open command生成的真实 event stream重启/rebuild得到同一 OPEN V2 state |
| 12 | duplicate opportunity 被拒绝 | `HOSTILE_REPLAY_REJECTION` | 第二个同 ID 或不同 ID 同 task event均拒绝 |
| 13 | same-task V1/V2 mixing 被拒绝 | `HOSTILE_REPLAY_REJECTION` | V1 后 V2、V2 后 V1 两个完整 stream均拒绝 |
| 14 | malformed T1 payload fail closed | `STRUCTURAL_VALIDATION` | nonplain/null/array/Proxy/getter/symbol/cycle/unknown schema/extra/missing tests，不泄漏非领域异常 |
| 15 | OPEN V2 Submit 返回 exact receipt-free retryable failure | `ACCEPTED_STREAM_INTEGRATION` | application exact status/code/stage/retryable/message/current version，receipt undefined |
| 16 | V2 submit 不改变 events/version/settlement/ledger/opportunity | `ACCEPTED_STREAM_INTEGRATION` | before/after event bytes与 rebuild state exact相等，OPEN 保持，same command retry等价 |
| 17 | OPEN V2 opportunity 不改变 player/AI private knowledge | `PROJECTION` | 对同一 pre/post-open state构建 player 与 AI view，Dreamer knowledge及完整 view相等 |
| 18 | ledger facts 与 Mathematician count 不变 | `ACCEPTED_STREAM_INTEGRATION` | pre/post-open 与 failed submit 的 ledger exact相等，新增 terminal fact为 0 |
| 19 | V1 open/submit/delivery 现有行为完整回归 | `ACCEPTED_STREAM_INTEGRATION` | 现有 V1 Dreamer happy path 保持 accepted event sequence/result |
| 20 | Ubuntu/Windows deterministic 与 full gates | `CROSS_PLATFORM_CI` | required CI：Ubuntu typecheck/lint/test/single-fork coverage 与 Windows deterministic 全绿 |

建议测试落点：domain exact/pure seam 放在新增或现有 `packages/domain-core/src/first-night-action-opportunity.test.ts`；accepted/receipt/idempotency 放在 `packages/application/src/game-application-service.test.ts`；legacy/hostile replay 放在 `packages/domain-core/src/rebuild.test.ts`；projection non-effect 放在 `packages/projections/src/private-knowledge-view.test.ts`；ledger non-effect 可由 application accepted-stream test 主断言，避免修改 ledger 生产代码。测试文件选择可按现有 fixture 可维护性微调，但 primary layer 与 criterion 不得改变。

## Definition of Done

独立 design reviewer 必须确认：

- R1/R2/R3/R4 与 T1/T2/T3 分类准确；
- 只实现 opening opportunity contract；
- V1 exact shape 与两类 legacy replay 均保留；
- V2 kind/schema/visibility/source contract/ID exact literals 完整；
- V2 producer 从 V2 base Dreamer 可达；
- 2B19T tenure 与现有 base ability-instance API 被复用并交叉绑定；
- event type 不变且 replay 使用同 canonical expected builder；
- duplicate 与 same-task mixing 双重阻断；
- V2 submit 与 V2 gained open 均在 `recordRejected` 前 receipt-free fail closed；
- V1 submit 不变；
- projection/ledger/first-night completion 无生产效果；
- 生产 allowlist 2 文件，估算 360–480 LOC，无 stop-loss；
- 20 criteria 均有一个 primary authority test；
- 明确 out-of-scope 未被伪装为实现。

Design review 仅可返回 `RULE_DESIGN_PASS`、`RULE_DESIGN_FIX_REQUIRED`、`RESLICE_REQUIRED` 或 `HUMAN_BLOCKED`。没有 `RULE_DESIGN_PASS` 不得修改生产代码或测试。

## Implementation Verification Gates

实现后必须运行：

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
git diff --check
```

coverage 继续使用 accepted `VITEST_MAX_FORKS=1`。静态扫描确认无 target/delivery/candidate/Vortox/impairment/gained Dreamer/ledger/projection/GameState/event-type 扩 scope；无 `localeCompare`、`Intl.Collator`、`Math.random`、canonical `Date.now`、UUID、raw `JSON.stringify` 语义比较、稀疏数组遗漏、skip/only/todo、timeout/workflow/dependency 修改。

## Frozen Outcome

通过本设计后，2B19A1 Slice coverage 只能记录为 `FOUNDATION / OPPORTUNITY_CONTRACT`；Dreamer 角色 coverage 保持 `PARTIAL`，rule evidence 保持 `SKELETON`。FIRST_NIGHT 未完成、DAY 未开始、2B19A2/2B19A3/2B19B/Phase 2C 均未开始。

READY_FOR_RULE_DESIGN_REVIEW_ROUND_1
