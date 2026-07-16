# Phase 3 Slice 2B19A2 — Effective Base Dreamer V2 Normal Target and Information Delivery Frozen Design Round 2

## Metadata

- sliceId: `2B19A2`
- authorization: `USER_AUTHORIZED_2B19A2_EFFECTIVE_BASE_DREAMER_V2_NORMAL_INFORMATION`
- designRound: `2 / 2`
- acceptedMain: `8b390b50f5d314b34535bc7cf9fad36ece76f85e`
- parentRound1Design: `docs/implementation/phase-3-slice-2b19a2-design.md`
- parentRound1DesignSha256: `fe7187b9b027c4579a21d3a0ccf2fd77a3625dfbc0f95ea638ea926c5982cfe0`
- parentRound1Review: `docs/implementation/phase-3-slice-2b19a2-design-review-round-1.md`
- parentRound1ReviewSha256: `bc588436e2622b801576c4f6477907d9ce1adf54768fe59148ff4a9727fb44fd`
- governancePrecheck: `docs/architecture/2B19A2-go-no-go-under-governance-v1.md`
- governancePrecheckSha256: `abc0a75b0b8267542d2e1a3bd0bbaeaad8ee9b11052c442ec38aee9558df4b1f`
- governanceConclusion: `GO`
- ruleEvidence: `docs/rules/evidence/2B19A2.md`
- ruleEvidenceSha256: `e24038e7399cb7311204b6b3f001623b7ab0323034af61ee3bb64aa8e9a3c829`
- ruleVerdict: `RULE_READY`
- coverageStatus: `PARTIAL / NORMAL_INFORMATION_ONLY`
- dreamerRoleCoverage: `PARTIAL`
- ruleSemanticsChanged: `false`
- implementationAuthorized: `false` until independent Round 2 review returns `RULE_DESIGN_PASS`

本文件完整替代Round 1，是实现阶段唯一设计权威。它不是addendum或errata；实现者不得回读Round 1补全合同。

## governanceClassification

### Reachability

- `R1 CURRENTLY_REACHABLE_ACCEPTED_STREAM`
  - 新V2-plan base Dreamer open command生成actionable V3 opportunity。
  - base Dreamer选择另一名modeled player。
  - 无source impairment、无有效Vortox、当前Demon非No Dashii时生成normal信息。
  - target、delivery、settlement作为一个原子batch提交。
  - delivery生成一个NORMAL ledger fact和source-only player/AI私有知识。
  - represented DRUNK可由现有Philosopher duplicate-ability impairment路径到达。
  - 初始Vortox和No Dashii可由accepted setup到达。
- `R2 LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`
  - V1 opportunity/target/delivery/settlement。
  - V2-plan + legacy V1 history。
  - 2B19A1 non-actionable V2 opportunity。
- `R3 HOSTILE_OR_CORRUPTED_HISTORY`
  - malformed/mixed schema、noncanonical identity、source/task/tenure/ability/revision错配。
  - duplicate、naked、reversed、partial、cross-batch events。
  - damaged impairment、receipt或projection history。
- `R4 FUTURE_HYPOTHETICAL_STATE`
  - 当前没有accepted producer能对base Dreamer产生POISONED marker；该closed capability branch只接受未来单独授权后可达的canonical represented state，不得称为当前accepted-stream integration。
  - Vortox forced-false、DRUNK/POISONED信息生成、No Dashii邻座推导、gained Dreamer、Storyteller自由选择、Traveller、other-night、life/death、FIRST_NIGHT完成、DAY及Phase 2C。

### Trust

- `T1`：command、persisted opportunity/target/delivery、event envelope/batch、replay stream及projection viewer。
- `T2`：accepted stream rebuild出的setup、roster、CurrentCharacterState、first-night plan/progress、opportunity state、role-tenure、represented impairments及ledger。
- `T3`：ID formatter/parser、stable comparator、normal information policy和closed effectiveness resolver。

任何direct builder、手工GameState或直接event-applier调用不得标成`ACCEPTED_STREAM_INTEGRATION`。

## versionedProducerTransition

1. 新actionable opportunity固定为：
   - schema `dreamer-first-night-action-opportunity-v3`
   - kind `DREAMER_FIRST_NIGHT_ACTION_V3`
2. 新V2-plan base Dreamer open只生成V3。
3. 2B19A1 V2永久保持：
   - `dreamer-first-night-action-opportunity-v2`
   - `DREAMER_FIRST_NIGHT_ACTION_V2`
   - `canChooseTarget=false`
   - `supportedDecisionKinds=[]`
4. V1 runtime bytes、producer及replay不变。
5. V1、V2和V3不得在同task混合。
6. 不迁移、不补optional字段、不改写stored events。

## legacyV1Boundary

现有V1 target和delivery exact runtime shapes不变。absence of新schema discriminator只进入V1 validator/builder。

V1继续使用：

```text
opportunityKind = DREAMER_FIRST_NIGHT_ACTION
knowledgeModelVersion = dreamer-information-model-v1
knowledgeStage = DREAMER_INFORMATION
falseRolePolicyVersion = dreamer-false-role-policy-v1
```

V1 information reliability union继续允许既有`EFFECTIVE`和`SOURCE_IMPAIRED`历史。2B19A2不得重新解释、收紧或重写V1 accepted bytes。

## legacy2B19A1V2Boundary

以下既有合同不变：

```ts
export const DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION =
  "dreamer-first-night-action-opportunity-v2" as const;

export const DREAMER_V2_VISIBILITY_SCHEMA_VERSION =
  "dreamer-first-night-action-visibility-v2" as const;

export const DREAMER_BASE_SOURCE_CONTRACT_VERSION =
  "dreamer-base-source-contract-v1" as const;

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
```

OPEN旧V2 submit继续在既有guard中receipt-free返回`ApplicationNotConfigured`，不得进入新normal resolver。

## actionableOpportunity

```ts
export const DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION =
  "dreamer-first-night-action-opportunity-v3" as const;

export const DREAMER_V3_VISIBILITY_SCHEMA_VERSION =
  "dreamer-first-night-action-visibility-v3" as const;

export type DreamerActionOpportunityVisibilityV3 = {
  readonly visibilitySchemaVersion:
    typeof DREAMER_V3_VISIBILITY_SCHEMA_VERSION;
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly futureUnsupportedDecisionKinds: readonly [];
  readonly targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER";
};

export type DreamerActionOpportunityV3 = {
  readonly opportunitySchemaVersion:
    typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION_V3";
  readonly opportunityStatus: ActionOpportunityStatus;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly visibility: DreamerActionOpportunityVisibilityV3;
};
```

V3 exact top-level keys只能是：

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

event payload仅再加`rulesBaselineVersion`。

复用既有：

```ts
formatBaseDreamerV2FirstNightActionOpportunityId
parseBaseDreamerV2FirstNightActionOpportunityId
```

V3不得调用V1 `parseFirstNightActionOpportunityId`证明opportunity identity。

Canonical grammar：

```text
first-night-v2:DREAMER_ACTION:seat-(0[1-9]|1[0-2]):opportunity-01
```

Task grammar：

```text
first-night-v1:DREAMER_ACTION:seat-XX
```

Ability instance：

```ts
formatBaseFirstNightAbilityInstanceId(taskId)
parseFirstNightAbilityInstanceId(...)
```

parser结果必须为`BASE_ROLE_TASK`、generation `BASE`、task type `DREAMER_ACTION`、embedded seat等于source seat。

## sourceEffectiveness

### Exact resolver input

Round 2选择“完整canonical plan/progress重证”模型，不依赖caller声称V3已验证：

```ts
export const DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION =
  "dreamer-base-source-effectiveness-v1" as const;

export const resolveBaseDreamerV2NormalCapability = (input: {
  readonly opportunity: DreamerActionOpportunityV3;
  readonly firstNightTaskPlan: FirstNightTaskPlan;
  readonly firstNightTaskProgress: FirstNightTaskProgress | undefined;
  readonly firstNightActionOpportunities:
    FirstNightActionOpportunityState;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly setup: Pick<GeneratedSetup, "roleCatalogSnapshot">;
  readonly roleTenures: RoleTenureState;
  readonly abilityImpairments: AbilityImpairmentSet | undefined;
}): BaseDreamerV2NormalCapability;
```

### Exact result union

```ts
export type BaseDreamerV2NormalCapability =
  | {
      readonly kind: "NORMAL_INFORMATION_SUPPORTED";
      readonly evaluationModelVersion:
        typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
      readonly evaluatedCharacterStateRevision: number;
      readonly sourceRoleTenureId: RoleTenureId;
      readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
    }
  | {
      readonly kind: "SOURCE_REPRESENTED_IMPAIRED";
      readonly impairmentId: AbilityImpairmentId;
      readonly impairmentKind: "DRUNK" | "POISONED";
    }
  | {
      readonly kind: "VORTOX_FORCED_FALSE_UNSUPPORTED";
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleTenureId: RoleTenureId;
    }
  | {
      readonly kind: "NO_DASHII_EFFECT_UNRESOLVED";
      readonly noDashiiPlayerId: PlayerId;
      readonly noDashiiSeatNumber: SeatNumber;
    }
  | {
      readonly kind: "EFFECTIVENESS_UNRESOLVED";
      readonly reason:
        | "SOURCE_PROVENANCE_INVALID"
        | "SOURCE_IMPAIRMENT_CONFLICT"
        | "CURRENT_DEMON_IDENTITY_NOT_UNIQUE"
        | "CURRENT_DEMON_CATALOG_MISMATCH"
        | "VORTOX_TENURE_MISSING_OR_INCONSISTENT"
        | "VORTOX_EFFECTIVENESS_CONFLICT";
    };
```

### Task/source provenance revalidation

Resolver必须依次证明：

1. plan exact-valid且`taskPlanVersion="first-night-task-plan-v2"`。
2. `opportunity.taskId`在plan中恰好出现一次。
3. task未settled且是`getNextUnsettledFirstNightTask`返回的next task。
4. task type/class/source严格为：
   - `DREAMER_ACTION`
   - `ROLE_ACTION`
   - source kind `ROLE`
   - source role exact catalog Dreamer
5. task/player/seat/role、opportunity top-level及nested sourceContract逐字段一致。
6. task ID等于`roleScheduledTaskId("DREAMER_ACTION", sourceSeatNumber)`。
7. opportunity state exact-valid，按opportunityId和taskId均恰好找到同一个V3 OPEN record；无V1/V2/V3 duplicate或mixing。
8. current source player/seat仍唯一对应exact catalog Dreamer。
9. current revision不小于opening revision。
10. source tenure由`findUniqueActiveRoleTenure`查询，ID等于sourceContract ID。
11. source tenure在opening revision和settlement revision均active，并由`isRoleTenureContinuousAcross(record, openingRevision, settlementRevision)`证明连续。
12. base ability instance按existing formatter/parser重算并等于sourceContract。

任一步失败返回`EFFECTIVENESS_UNRESOLVED/SOURCE_PROVENANCE_INVALID`；不得接受另一份caller task/context。

### Exact represented-impairment applicability

当前`AbilityImpairment`合同没有tenure ID、ability-instance ID、ended revision或clear event。不得发明这些字段。

一个source impairment仅在以下全部成立时applicable：

```text
marker.affectedPlayerId === sourceContract.sourcePlayerId
marker.affectedSeatNumber === sourceContract.sourceSeatNumber
sameRoleSetupSnapshot(marker.affectedRole, opportunity.sourceRole)
marker.affectedRole.roleId === dreamer
marker.kind is DRUNK or POISONED
marker.sourceKind is PHILOSOPHER_CHOSEN_DUPLICATE or SNAKE_CHARMER_DEMON_HIT
marker.sourceCharacterStateRevision >= sourceTenure.acquiredCharacterStateRevision
marker.sourceCharacterStateRevision >= sourceContract.sourceCharacterStateRevision
marker.sourceCharacterStateRevision <= settlementCharacterStateRevision
source tenure is continuous opening through settlement
source tenure has no end at or before settlement
```

`sourceCharacterStateRevision`是现有marker合同中的application revision。

当前没有impairment-clear/ended字段，因此：

- applicable marker在当前accepted模型中持续represented；
- 不得根据时间经过、absence of新marker或caller assertion推断clear；
- earlier-tenure、future-start、ended-tenure、wrong-player、wrong-seat、wrong-role、wrong-snapshot、unknown-sourceKind marker不适用于当前source；
- malformed impairment set不是empty；
- `abilityImpairments===undefined`才按accepted historical empty set处理；
- exact一个applicable marker返回`SOURCE_REPRESENTED_IMPAIRED`；
- 多个applicable marker、同ID冲突、DRUNK/POISONED重叠或任何无法唯一解释的applicable set返回`SOURCE_IMPAIRMENT_CONFLICT`。

Marker不携带tenure/ability ID，因此绑定由marker revision、exact affected role及V3 sourceContract中的tenure/ability共同证明；不得新增marker字段。

### Vortox applicability

1. settlement-time current Demon必须恰好一个且exact匹配catalog。
2. 当前Vortox必须有唯一active canonical Vortox tenure。
3. Vortox impairment使用相同player/seat/exact-role/revision/tenure-continuity公式。
4. 0个applicable Vortox impairment表示有效Vortox，返回`VORTOX_FORCED_FALSE_UNSUPPORTED`。
5. exact一个表示Vortox已知无效，继续normal。
6. multiple/conflicting返回`VORTOX_EFFECTIVENESS_CONFLICT`。

### No Dashii control flow

当唯一current Demon的exact catalog roleId为`no_dashii`时，无条件返回：

```ts
{
  kind: "NO_DASHII_EFFECT_UNRESOLVED",
  noDashiiPlayerId,
  noDashiiSeatNumber
}
```

本Slice没有canonical No Dashii adjacency或“Dreamer未受影响”proof，因此不得：

- 检查座位距离并推断安全；
- 从roster顺序推断邻座；
- 从absence of POISONED marker推断安全；
- 从caller assertion推断安全；
- 把No Dashii描述为已证明effective或ineffective；
- 继续normal。

未来canonical unaffected proof只能由单独reviewed Slice引入。

## normalTargetRule

Decision保持：

```ts
{
  readonly kind: "CHOOSE_PLAYER";
  readonly targetPlayerId: PlayerId;
}
```

Target必须存在于modeled roster与settlement-time CurrentCharacterState，seat一致，且不是source。Traveller未建模；不得增加alive限制。

Target true role取settlement-time current role。opening后、settlement前的角色变化使用新role；alignment-only变化不改变role truth或native GOOD/EVIL分类。

## normalInformationRule

仅`NORMAL_INFORMATION_SUPPORTED`可生成delivery：

- role必须来自exact roleCatalogSnapshot；
- Townsfolk/Outsider为GOOD；
- Minion/Demon为EVIL；
- characterType与defaultAlignment必须满足existing catalog validator；
- GOOD target：goodRole是真role，evilRole为deterministic false EVIL；
- EVIL target：evilRole是真role，goodRole为deterministic false GOOD；
- 两个role ID不同；
- 恰好一个等于target true role；
- 不持久化truth marker。

## falseRolePolicy

继续使用：

```text
dreamer-false-role-policy-v1
dreamer-information-model-v1
```

按`compareStableId` code-unit顺序选择最小合法反侧roleId。不得依赖catalog输入顺序、localeCompare、Intl.Collator、random、UUID、Date.now或raw JSON semantic comparison。

Candidate不足返回receipt-free`DependencyExecutionFailed`，不实现Storyteller自由选择。

## commands

复用`SubmitDreamerAction` exact command。

- source Human/AI允许；
- Storyteller/System允许；
- non-source Human/AI、wrong task/opportunity、CLOSED、settled、non-next、self/unknown target及stale version确定性拒绝并可写rejected receipt。

执行顺序：

```text
receipt lookup
event load
canonical rebuild
expectedGameVersion
legacy V2 guard
deterministic command validation
V3 effectiveness resolution
normal information resolution
metadata/batch construction
prospective validation
atomic append
accepted receipt
```

Secret effectiveness不得在deterministic validation前求值或泄漏。

## events

保留event types：

```text
DreamerTargetChosen
DreamerInformationDelivered
ScheduledTaskSettled
```

新增：

```ts
export const DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION =
  "dreamer-target-chosen-v2" as const;

export const DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION =
  "dreamer-information-delivered-v2" as const;
```

### Target V2

```ts
export type DreamerTargetChosenPayloadV2 = {
  readonly rulesBaselineVersion: string;
  readonly targetSchemaVersion:
    typeof DREAMER_TARGET_CHOSEN_V2_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
};
```

Top-level source revision表示settlement revision；nested sourceContract revision表示opening revision。

### Delivery V2

```ts
export type DreamerInformationDeliveredPayloadV2 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion:
    typeof DREAMER_INFORMATION_DELIVERED_V2_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly knowledgeModelVersion:
    typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: { readonly kind: "EFFECTIVE" };
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion:
    typeof DREAMER_FALSE_ROLE_POLICY_VERSION;
};
```

Target/delivery validators按schema discriminator分派；absence schema仅V1。Unknown/mixed schema、missing/extra key、nonplain/getter/Proxy/symbol/cycle及任何source/target/task/revision cross-link错误fail closed。

## batch

成功batch固定：

1. target V2
2. delivery V2
3. existing settlement

三event同gameId、batchId、commandId、resulting gameVersion，sequence连续。Game version只增1。

Settlement：

```text
taskType = DREAMER_ACTION
outcomeType = DREAMER_INFORMATION_DELIVERED
characterStateRevision = delivery.sourceCharacterStateRevision
```

Delivery关闭V3；settlement只settle同task；phase保持FIRST_NIGHT。Naked、partial、duplicate、reversed、mixed或cross-batch history拒绝。

## replay

`event-applier.ts`必须：

1. 用state-before验证target V2；
2. append target；
3. 用包含target的state验证delivery V2；
4. append delivery并关闭V3；
5. 验证settlement；
6. settle task；
7. 通过outcome-ledger applier从delivery生成唯一fact。

V1/V2/V3 union dispatch exhaustive。V1和2B19A1 V2历史不迁移。

## ledger

不得增加generic evidence。V3 normal fact使用现有closed evidence逐字段映射如下。

### Fact identity

| Fact field | Canonical source |
|---|---|
| `auditFactId` | `formatFirstNightAbilityOutcomeFactId(deliveryEnvelope.eventId)` |
| `sourceEventId` | delivery envelope `eventId` |
| `sourceBatchId` | delivery envelope `batchId` |
| `sourceEventSequence` | delivery envelope `eventSequence` |
| `detectedAtEventSequence` | delivery envelope `eventSequence` |
| `evaluatedCharacterStateRevision` | delivery `sourceCharacterStateRevision` |
| `sourcePlayerId/sourceSeatNumber` | validated V3 sourceContract and delivery |
| `abilityRoleId` | canonical task source role `dreamer` |
| `abilityTaskId` | unique canonical Dreamer task |
| `abilityInstance` | canonical base task instance |
| `outcomeStatus` | `NORMAL` |
| `causeKind` | `NO_OTHER_CHARACTER_ABILITY` |
| `causedByAnotherCharacterAbility` | `false` |

### Closed evidence mapping

1. `SOURCE_EVENT`
   - eventId = delivery envelope eventId
   - eventType = `DreamerInformationDelivered`
   - eventSequence = delivery envelope sequence
   - batchId = delivery envelope batchId
2. `TASK`
   - taskId = delivery/sourceContract taskId
   - taskType = `DREAMER_ACTION`
   - task is the unique canonical V2-plan base ROLE Dreamer task
3. `CHARACTER_STATE`
   - revision = delivery settlement revision
4. source `PLAYER_ROLE_AT_REVISION`
   - player/seat = sourceContract
   - roleId = `dreamer`
   - characterType/defaultAlignment = exact source catalog snapshot
   - revision = settlement revision
5. target `PLAYER_ROLE_AT_REVISION`
   - player/seat = delivery target
   - role fields = settlement-time target CurrentCharacterState
   - revision = settlement revision
6. V3 `ACTION_OPPORTUNITY`
   - opportunityId = delivery opportunityId
   - kind = `DREAMER_FIRST_NIGHT_ACTION_V3`
   - status before terminal delivery = `OPEN`
   - task/source/opening revision = exact stored V3 opportunity
   - existing evidence `opportunityVersion="first-night-action-opportunity-v1"` remains the closed evidence-model version, not the V3 payload schema
7. source `ROLE_TENURE`
   - roleTenureId = sourceContract.sourceRoleTenureId
   - player/seat/role = source Dreamer
   - acquired revision from canonical tenure
   - statusAtEvaluation = `ACTIVE`
8. fact `abilityInstance`
   - provenance kind = `BASE_ROLE_TASK`
   - ID = `formatBaseFirstNightAbilityInstanceId(taskId)`
   - role/task/player/seat match sourceContract
9. `DREAMER_DELIVERY`
   - taskId/opportunityId/sourcePlayerId/targetPlayerId from delivery
   - deliveredGoodRoleId = delivery.goodRole.roleId
   - deliveredEvilRoleId = delivery.evilRole.roleId
   - terminalEventId = delivery envelope eventId

### V3 implied version proof

Before evidence derivation, exact V3 validation proves：

```text
opportunityKind = DREAMER_FIRST_NIGHT_ACTION_V3
opportunitySchemaVersion = dreamer-first-night-action-opportunity-v3
sourceContractVersion = dreamer-base-source-contract-v1
taskPlanVersion = first-night-task-plan-v2
taskType = DREAMER_ACTION
sourceRoleId = dreamer
```

The V3 opportunity ID must be validated with`parseBaseDreamerV2FirstNightActionOpportunityId`, not theV1 parser. The closedACTION_OPPORTUNITY evidence does not add schema/sourceContract fields; those facts are implied by the exact V3 discriminator validation and cross-bound throughTASK、ROLE_TENURE、abilityInstance及source fields.

If this mapping cannot be expressed with existing closed variants, return`RESLICE_REQUIRED`. Settlement不得生成第二fact。Mathematician可读NORMAL fact但不计数。

## projection

不得修改projection生产文件。

Source player及对应AI view可见：

```text
dreamerInformation.target
dreamerInformation.goodRole
dreamerInformation.evilRole
dreamerKnowledgeModelVersion
DREAMER_INFORMATION stage
```

其他玩家/AI不可见。不得泄漏truth marker、target真实role/alignment、哪个为真、candidate set、effectiveness、impairment、Vortox、No Dashii、tenure、ability instance、assignment、CurrentCharacterState或ledger。

Projection从historical delivery读取，不从later current state回算。

## receipts

| Capability/failure | Result | Receipt |
|---|---|---|
| deterministic invalid command | rejected | allowed |
| represented DRUNK/POISONED | `ApplicationNotConfigured`, stage `first-night-role-action`, retryable | none |
| effective Vortox | `ApplicationNotConfigured`, stage `first-night-role-action`, retryable | none |
| current No Dashii unresolved | `ApplicationNotConfigured`, stage `first-night-role-action`, retryable | none |
| effectiveness conflict | `DependencyExecutionFailed`, stage `first-night-role-action`, retryable | none |
| candidate/catalog dependency | `DependencyExecutionFailed`, stage `first-night-role-action`, retryable | none |
| metadata/prospective/append failure | existing retryable failed result | none |
| success | accepted | accepted receipt |

Retryable failure生成0 events、0 facts，不settle、不关闭V3、不改变version；same commandId可在依赖恢复后重试。Message必须generic，不泄漏source impairment、Demon或candidate原因。

## failures

Canonical prerequisite缺失且能由command validation确定时走deterministic rejection；command validation通过后发现T2矛盾时走receipt-free dependency failure。不得把DomainError或secret reason泄漏给actor。

## tests

每个ID对应一个physical primary test；不得把同一physical test声明成多个primary authority。

| ID | Criterion | Exact file | Primary layer | Fixture authority |
|---|---|---|---|---|
| `2B19A2-C01` | V1 history exact replay | `packages/domain-core/src/rebuild.test.ts` | `LEGACY_REPLAY_COMPATIBILITY` | frozen accepted V1 envelopes; rebuild only |
| `2B19A2-C02` | 2B19A1 V2 history exact replay | `packages/domain-core/src/rebuild.test.ts` | `LEGACY_REPLAY_COMPATIBILITY` | frozen PR33 accepted envelope fixture; no migration |
| `2B19A2-C03` | new producer emits only V3 | `packages/application/src/game-application-service.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | real prerequisite commands, command-store append, open command, rebuild |
| `2B19A2-C04` | V3 exact opportunity shape | `packages/domain-core/src/first-night-action-opportunity.test.ts` | `STRUCTURAL_VALIDATION` | canonical builder output plus exhaustive missing/extra/wrong/hostile mutations |
| `2B19A2-C05` | V3 canonical ID round-trip | `packages/domain-core/src/first-night-action-opportunity.test.ts` | `PURE_POLICY_SEAM` | existing V2 formatter/parser seats1/9/10/12 and alias table |
| `2B19A2-C06` | self target rejected | `packages/application/src/game-application-service.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | real V3 open stream, submit command, rejected receipt, rebuild unchanged |
| `2B19A2-C07` | other modeled player accepted | `packages/application/src/game-application-service.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | real command/append/rebuild success |
| `2B19A2-C08` | GOOD target normal pair | `packages/domain-core/src/dreamer.test.ts` | `PURE_POLICY_SEAM` | exact catalog/current-target pure resolver |
| `2B19A2-C09` | EVIL target normal pair | `packages/domain-core/src/dreamer.test.ts` | `PURE_POLICY_SEAM` | exact catalog/current-target pure resolver |
| `2B19A2-C10` | stable false role | `packages/domain-core/src/dreamer.test.ts` | `PURE_POLICY_SEAM` | code-unit candidate table |
| `2B19A2-C11` | catalog permutation invariant | `packages/domain-core/src/dreamer.test.ts` | `PURE_POLICY_SEAM` | all selected catalog permutations |
| `2B19A2-C12` | atomic three-event batch | `packages/application/src/game-application-service.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | real submit, persisted envelopes, shared metadata, one committed version |
| `2B19A2-C13` | accepted V3 restart replay | `packages/domain-core/src/rebuild.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | event stream produced and appended by real application commands, then rebuilt |
| `2B19A2-C14` | hostile duplicate/reversed/naked/partial/mixed/cross-batch rejection | `packages/domain-core/src/rebuild.test.ts` | `HOSTILE_REPLAY_REJECTION` | copy of real accepted stream mutated only after capture; explicitly hostile |
| `2B19A2-C15` | represented DRUNK receipt-free | `packages/application/src/game-application-service.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | real Philosopher duplicate-Dreamer accepted command/event chain, then Dreamer submit |
| `2B19A2-C16` | represented POISONED closed branch | `packages/domain-core/src/dreamer.test.ts` | `PURE_POLICY_SEAM` | exact validated closed impairment value; explicitly R4/non-accepted-stream |
| `2B19A2-C17` | effective Vortox receipt-free | `packages/application/src/game-application-service.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | real Vortox setup, tenure rebuild, V3 open and submit |
| `2B19A2-C18` | No Dashii unconditional unresolved | `packages/application/src/game-application-service.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | real No Dashii setup; varied seats and marker absence cannot bypass |
| `2B19A2-C19` | candidate shortage | `packages/domain-core/src/dreamer.test.ts` | `PURE_POLICY_SEAM` | exact catalog lacking one opposite side |
| `2B19A2-C20` | retryable paths write no receipt | `packages/application/src/game-application-service.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | real DRUNK/Vortox/NoDashii paths plus injected dependency/prospective failure; receipt store asserted |
| `2B19A2-C21` | same command succeeds after recovery | `packages/application/src/game-application-service.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | injected dependency failure, same commandId retry, real append/rebuild |
| `2B19A2-C22` | one NORMAL ledger fact | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | real application-produced success stream rebuilt through ledger applier |
| `2B19A2-C23` | settlement adds no fact | `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts` | `STRUCTURAL_VALIDATION` | captured accepted pre-settlement ledger then settlement application |
| `2B19A2-C24` | source player projection | `packages/projections/src/private-knowledge-view.test.ts` | `PROJECTION` | accepted-event-stream projection builder over real success stream |
| `2B19A2-C25` | source AI projection | `packages/projections/src/private-knowledge-view.test.ts` | `PROJECTION` | accepted-event-stream AI builder over same real stream |
| `2B19A2-C26` | non-source views omit delivery | `packages/projections/src/private-knowledge-view.test.ts` | `PROJECTION` | all non-source roster viewers over accepted stream |
| `2B19A2-C27` | no truth/effectiveness leakage | `packages/projections/src/private-knowledge-view.test.ts` | `PROJECTION` | recursive exact-key/value scan of player and AI projections |
| `2B19A2-C28` | later role state does not rewrite historical delivery | `packages/projections/src/private-knowledge-view.test.ts` | `PROJECTION` | explicitly non-R1 projection compatibility fixture with validated historical delivery and later canonical current-state revision |
| `2B19A2-C29` | phase remains FIRST_NIGHT | `packages/application/src/game-application-service.test.ts` | `ACCEPTED_STREAM_INTEGRATION` | real submit/append/rebuild, noPhaseTransitioned |
| `2B19A2-C30` | V1/Mathematician/Seamstress/tenure regression | `packages/domain-core/src/rebuild.test.ts` | `LEGACY_REPLAY_COMPATIBILITY` | frozen accepted streams for each existing subsystem |
| `2B19A2-C31` | Ubuntu/Windows deterministic parity | `packages/domain-core/src/dreamer.test.ts` | `CROSS_PLATFORM_CI` | deterministic vector test executed unchanged by existing Ubuntu ordinary/single-fork coverage and Windows jobs |

### Structural mutation ownership

`2B19A2-C04` owns every V3 opportunity/visibility/sourceContract missing, extra, wrong literal, sparse array, null, array, nonplain object, accessor, enumerable symbol, cycle and throwing Proxy mutation。

Add two separately named supporting tests without primary-criterion reuse：

- `2B19A2-S01` in `dreamer.test.ts`: exhaustive V2 target/delivery key and nested reliability/sourceContract mutation matrix。
- `2B19A2-S02` in `rebuild.test.ts`: source/task/player/seat/role/revision/tenure/ability/catalog/opportunity cross-link hostile replay matrix built by mutating a captured real accepted stream。

Supporting tests have layers`STRUCTURAL_VALIDATION`and`HOSTILE_REPLAY_REJECTION`respectively and are not relabeledaccepted-stream integration。

## productionFileAllowlist

仅允许：

1. `packages/domain-core/src/first-night-action-opportunity.ts`
2. `packages/domain-core/src/dreamer.ts`
3. `packages/domain-core/src/domain-batch-semantics.ts`
4. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
5. `packages/domain-core/src/event-applier.ts`
6. `packages/application/src/game-application-service.ts`

预计新增生产LOC：`1100–1450`。

不得修改：

- `events.ts`
- `game-state.ts`
- projection生产文件
- workflow
- dependency/lockfile
- timeout
- Vitest配置
- public Mathematician contract

超过8生产文件或1500行先停下复核；超过10文件/2000行、新GameState/context/effect engine/projection system/generic evidence或第二shared risk时`RESLICE_REQUIRED`。

## outOfScope

- DRUNK/POISONED Dreamer信息生成
- Vortox forced-false
- No Dashii adjacency/unaffected proof
- Sweetheart、Barista及其他unmodeled impairment
- gained Dreamer
- Storyteller自由选择
- Traveller
- life/death
- other-night
- FIRST_NIGHT completion
- DAY
- 2B19A3
- 2B19B
- Phase 2C
- V1或2B19A1 V2 migration
- generic evidence/context/effect/projection infrastructure
- Dreamer `COMPLETE`

## completionCriteria

实现完成必须同时满足：

1. Round 2独立review返回`RULE_DESIGN_PASS`。
2. 六文件allowlist与1100–1450 LOC估算成立。
3. V1和2B19A1 V2 exact bytes不变。
4. 新V2-plan base producer只产V3。
5. Resolver从完整plan/progress/opportunity state重证source/task authority。
6. Impairment applicability严格使用Round 2公式。
7. No Dashii无条件unresolved，不推断unaffected。
8. V3 normal target/information满足规则与determinism。
9. 三事件batch、replay、settlement与version合同成立。
10. Ledger严格使用既有closed evidence逐字段映射，且只产一个NORMAL fact。
11. Source player/AI projection正确且无泄漏。
12. Retryable failure无receipt、无mutation并可same-command retry。
13. 31个唯一primary IDs及S01/S02通过，test layer无冒充。
14. `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm test:coverage`及`git diff --check`通过。
15. Exact-head Ubuntu ordinary/single-fork coverage与Windows deterministic通过。
16. Dreamer matrix保持`PARTIAL`，Slice为`PARTIAL / NORMAL_INFORMATION_ONLY`。
17. 不开始2B19A3、2B19B或Phase 2C。

## coverageStatus

- Slice: `PARTIAL / NORMAL_INFORMATION_ONLY`
- Dreamer: `PARTIAL`
- Vortox information:未实现
- impairment information:未实现
- No Dashii derivation:未实现
- gained Dreamer:未实现
- FIRST_NIGHT:未完成
- DAY/Phase 2C:未开始

READY_FOR_RULE_DESIGN_REVIEW_ROUND_2
