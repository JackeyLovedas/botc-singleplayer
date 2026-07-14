# Phase 3 Slice 2B19 Design — Dreamer V2 Completion

## Metadata

```text
sliceId: 2B19
phase: Phase 3
designRound: 1 / 2
ruleEvidence: docs/rules/evidence/2B19.md
ruleVerdict: RULE_READY
implementationAuthorized: false
selectedEventStrategy: A_NEW_EVENT_TYPES
coverageStatus: PARTIAL
```

## ruleAuthority

唯一规则证据是 `docs/rules/evidence/2B19.md`。实现必须使用其中固定的来源修订、哈希及以下结论：

1. 正常筑梦师信息始终是一名 GOOD 角色和一名 EVIL 角色，且恰有一项等于目标在结算时的真实当前角色。
2. 有效涡流要求最终信息为假：两项所示角色均不得等于目标真实当前角色，但一 GOOD、一 EVIL 的输出结构不变。
3. 醉酒或中毒而没有有效涡流时，信息可以为真或为假。
4. 醉酒或中毒与有效涡流同时存在时，涡流的强制虚假优先。
5. 候选角色可以在场；不存在必须选择不在场角色的规则。
6. 角色的原生类型决定 GOOD/EVIL 候选侧，玩家当前阵营不改变答案。
7. 目标在结算时的 `CurrentCharacterState` 是真值；之后的角色、阵营、醉酒、中毒或涡流变化不得重写历史信息。
8. 哲学家获得筑梦师能力时，来源玩家是哲学家本人，来源角色仍是哲学家，能力角色是筑梦师。
9. 哲学家复制筑梦师造成的原筑梦师醉酒只影响原筑梦师，不自动影响哲学家来源。
10. V1 已验收历史保持原样；V1 gained 不获准执行；V2 gained 必须绑定完整的哲学家选择、grant 和 V2 insertion 链。
11. 同位置顺序使用已批准的 `BOTC-SIM-PHILOSOPHER-FIRST-NIGHT-SCHEDULING-V1`：base 在前，gained 按来源座位，再按 task ID UTF-16 code-unit 顺序。
12. 候选不足或规则证据无法证明时必须失败关闭，不得使用模型记忆补值。

本设计不得把代码、现有测试、README 或模型判断提升为规则真值。

## supportMatrix

| 计划/来源 | 无当前涡流 | 当前涡流已证明无效 | 当前有效涡流 | 醉酒/中毒 | 新执行 |
|---|---|---|---|---|---|
| V1 base | 保持既有行为 | 失败关闭 | 失败关闭 | 保持既有无涡流行为 | 仅兼容路径 |
| V1 gained | 不支持 | 不支持 | 不支持 | 不支持 | 失败关闭 |
| V2 base | 支持 | 支持 | 支持强制虚假 | 支持 | 支持 |
| V2 gained | 支持 | 支持 | 支持强制虚假 | 只评估哲学家来源自身状态 | 支持 |

“当前涡流已证明无效”包括具有唯一当前涡流、唯一连续 active tenure，以及可验证的当前醉酒或中毒证据。由于 V1 payload 没有保存该证明，新 V1 命令遇到任何当前涡流角色都失败关闭；已验收 V1 历史仍按原回放规则读取。

## legacyV1Boundary

以下 V1 合同不可修改：

- `DreamerTargetChosen`
- `DreamerInformationDelivered`
- `dreamer-information-model-v1`
- `dreamer-false-role-policy-v1`
- V1 payload exact key set
- V1 三事件顺序
- V1 opportunity ID
- V1 accepted replay
- V1 state rebuild
- V1 source-only projection
- 既有 V1 ledger 分类，包括没有已记录涡流约束时的 `UNRESOLVED`

不得给 V1 payload 增加可选字段、版本字段、source union、Vortox 字段或候选数组。

新 V1 base 命令仅在结算状态中不存在当前 `vortox` 角色时走原行为。存在当前 `vortox`、涡流身份冲突或涡流证明不完整时，返回 retryable failure，不生成事件、不写 receipt、不改变版本。

V1 gained task 即使已经存在于已验收 V1 计划中，也不得打开可执行筑梦师 V2 opportunity，不得生成 V1 或 V2 筑梦师结果。其执行尝试返回 `ApplicationNotConfigured`，且不生成事件、不写 receipt、不改变版本。

## v2CapabilityBoundary

V2 仅适用于：

- `first-night-task-plan-v2`
- base `DREAMER_ACTION`
- `FirstNightTaskInsertedV2` 产生的 Philosopher-gained `DREAMER_ACTION`
- 第一夜、`dayNumber=0`、`nightNumber=1`
- 固定的已验证 Sects & Violets role-catalog snapshot
- 当前系统已表示的醉酒、中毒、角色 tenure 和 Philosopher grant/insertion 事实
- 无 Traveller 的当前固定十二人产品

V2 不完成整个第一夜，不进入 DAY，不实现其他夜晚筑梦师。

## exactTypeAuthority

以下现有类型按仓库当前定义导入，不得在本 Slice 改变其 exact shape：

```ts
import type {
  AbilityImpairmentId,
  ActionOpportunityId,
  EventId,
  GrantedAbilityId,
  PlayerId,
  RoleId,
  RoleTenureId,
  ScheduledTaskId
} from "./ids.js";
import type { SeatNumber } from "./player-roster.js";
import type {
  RoleCatalogSnapshot,
  RoleSetupSnapshot
} from "./setup-types.js";
import type {
  FirstNightAbilityInstanceId,
  FirstNightAbilityInstanceProvenance
} from "./first-night-ability-outcome-ledger.js";
```

新合同常量为：

```ts
export const DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION =
  "dreamer-first-night-action-v2" as const;

export const DREAMER_V2_RESOLUTION_CAPABILITY_VERSION =
  "dreamer-first-night-resolution-capability-v2" as const;

export const DREAMER_V2_SOURCE_CONTRACT_VERSION =
  "dreamer-source-contract-v2" as const;

export const DREAMER_V2_GAINED_ENTITLEMENT_VERSION =
  "dreamer-philosopher-gained-entitlement-v2" as const;

export const DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION =
  "dreamer-target-choice-v2" as const;

export const DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION =
  "dreamer-information-delivery-v2" as const;

export const DREAMER_V2_INFORMATION_MODEL_VERSION =
  "dreamer-information-model-v2" as const;

export const DREAMER_V2_RESOLUTION_MODEL_VERSION =
  "dreamer-resolution-model-v2" as const;

export const DREAMER_V2_CANDIDATE_DOMAIN_VERSION =
  "dreamer-candidate-domain-v2" as const;

export const DREAMER_V2_SIMULATION_POLICY_VERSION =
  "dreamer-smallest-legal-role-code-unit-v1" as const;

export const DREAMER_V2_INFORMATION_STAGE =
  "DREAMER_INFORMATION" as const;
```

## baseV2Source

```ts
export type BaseDreamerV2SourceContract = {
  readonly sourceContractVersion:
    typeof DREAMER_V2_SOURCE_CONTRACT_VERSION;
  readonly kind: "BASE_DREAMER_V2";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly abilityRole: RoleSetupSnapshot;
  readonly opportunityCharacterStateRevision: number;
  readonly abilityInstance:
    FirstNightAbilityInstanceProvenance & {
      readonly kind: "BASE_ROLE_TASK";
    };
};
```

约束：

- `sourceRole.roleId === "dreamer"`。
- `abilityRole` 与 `sourceRole` exact-equal。
- task 必须是当前 next unsettled task。
- task source 必须是 exact `ROLE` source，并与来源玩家、座位和角色一致。
- plan 必须为 V2。
- 当前来源玩家在 opportunity 创建时必须仍为同一 base Dreamer。
- `abilityInstance` 必须等于现有 canonical base formatter 对该 task ID 的结果。
- `opportunityCharacterStateRevision` 必须等于创建 opportunity 时的当前角色状态 revision。

## gainedV2Source

```ts
export type DreamerV2GainedEntitlement = {
  readonly entitlementVersion:
    typeof DREAMER_V2_GAINED_ENTITLEMENT_VERSION;
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly schedulingVersion:
    "philosopher-gained-first-night-scheduling-v2";
  readonly insertedTaskId: ScheduledTaskId;
  readonly insertedTaskType: "DREAMER_ACTION";
  readonly philosopherTaskId: ScheduledTaskId;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly grantId: GrantedAbilityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly sourceRole: RoleSetupSnapshot;
  readonly chosenRole: RoleSetupSnapshot;
  readonly originalOpportunityKind:
    "PHILOSOPHER_FIRST_NIGHT_ACTION";
  readonly originalOpportunityStatus: "CLOSED";
  readonly insertionEventType: "FirstNightTaskInsertedV2";
};

export type PhilosopherGainedDreamerV2SourceContract = {
  readonly sourceContractVersion:
    typeof DREAMER_V2_SOURCE_CONTRACT_VERSION;
  readonly kind: "PHILOSOPHER_GAINED_DREAMER_V2";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly schedulingVersion:
    "philosopher-gained-first-night-scheduling-v2";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly abilityRole: RoleSetupSnapshot;
  readonly opportunityCharacterStateRevision: number;
  readonly gainedEntitlement: DreamerV2GainedEntitlement;
  readonly abilityInstance:
    FirstNightAbilityInstanceProvenance & {
      readonly kind: "PHILOSOPHER_GAINED_TASK_V2";
    };
};

export type DreamerV2SourceContract =
  | BaseDreamerV2SourceContract
  | PhilosopherGainedDreamerV2SourceContract;
```

gained chain 必须唯一且全部满足：

- task source kind 为 `PHILOSOPHER_GAINED_ABILITY`。
- source role 为 `philosopher`。
- chosen role 和 ability role 为 `dreamer`。
- plan 为 `first-night-task-plan-v2`。
- 有且仅有一个原始 Philosopher opportunity，且状态为 `CLOSED`。
- 有且仅有一个与该 opportunity、玩家、座位、revision 和 Dreamer role 一致的 choice。
- 有且仅有一个与 choice 一致的 grant。
- 有且仅有一个 `FirstNightTaskInsertedV2`，绑定该 grant、task、玩家、座位、revision、Dreamer role 和 scheduling version。
- task ID、grant ID 和现有 V2 canonical ability-instance ID parser/formatter全部 round-trip。
- 当前来源玩家在 opportunity 创建和结算时仍是同一哲学家；不得要求其当前角色是筑梦师。
- 原 base Dreamer 的 impairment 不得匹配 gained source。只有 `affectedPlayerId` 是哲学家来源、`affectedSeatNumber` 相同、`affectedRole` 与当前哲学家角色一致的 impairment 才适用。
- 任一 uniqueness、revision、角色、座位、grant、insertion 或 identity 检查失败即 dependency failure。

## opportunity

V2 opportunity 使用现有 `FirstNightActionOpportunityCreated` 事件，但其 payload union 增加一个严格判别的新 exact shape；V1 shape 不变。

```ts
export type DreamerActionOpportunityVisibilityV2 = {
  readonly visibilitySchemaVersion:
    typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly resolutionCapabilityVersion:
    typeof DREAMER_V2_RESOLUTION_CAPABILITY_VERSION;
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds:
    readonly ["CHOOSE_PLAYER"];
  readonly targetSchema:
    "OTHER_NON_TRAVELLER_MODELED_PLAYER";
};

export type DreamerActionOpportunityV2 = {
  readonly opportunitySchemaVersion:
    typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind:
    "DREAMER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: "OPEN" | "CLOSED";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: DreamerV2SourceContract;
  readonly visibility:
    DreamerActionOpportunityVisibilityV2;
};
```

ID 格式：

```text
base:
first-night-v2:DREAMER_ACTION:BASE:seat-XX:opportunity-01

gained:
first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-XX:from-dreamer:opportunity-01
```

parser 必须：

- 区分 V1/V2；
- round-trip task type、source kind、seat 和 index；
- gained 格式仅接受 `DREAMER_ACTION/from-dreamer`；
- 拒绝非两位 seat、seat 0/13、非正 index、额外段和大小写变化；
- 通过 source contract 的 task/grant identity 解决同座位身份，不从 ID 猜测 grant。

V2 opportunity 只可为当前 next unsettled V2 Dreamer task 创建一次。不存在重开、重复 OPEN 或为已结算 task 创建。

## candidateDomain

```ts
export type DreamerV2CandidateDomainSnapshot = {
  readonly candidateDomainVersion:
    typeof DREAMER_V2_CANDIDATE_DOMAIN_VERSION;
  readonly roleCatalogVersion: string;
  readonly roleCatalogSignature: string;
  readonly roleCatalogCanonicalSignature: string;
  readonly goodCandidates:
    readonly RoleSetupSnapshot[];
  readonly evilCandidates:
    readonly RoleSetupSnapshot[];
};

export type DreamerV2TargetTruth = {
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly targetCharacterStateRevision: number;
  readonly targetTrueRole: RoleSetupSnapshot;
  readonly targetNativeSide: "GOOD" | "EVIL";
};

export type ResolveDreamerV2CandidatesInput = {
  readonly roleCatalogSnapshot: RoleCatalogSnapshot;
  readonly roleCatalogSignature: string;
  readonly targetTruth: DreamerV2TargetTruth;
  readonly sourceEffectiveness:
    DreamerV2SourceEffectiveness;
  readonly vortoxConstraint:
    DreamerV2VortoxConstraint;
};

export type DreamerV2CandidateResolutionFailureCode =
  | "INVALID_ROLE_CATALOG_SNAPSHOT"
  | "SPARSE_ROLE_CATALOG"
  | "DUPLICATE_ROLE_ID"
  | "UNKNOWN_TARGET_ROLE"
  | "ROLE_NATIVE_SIDE_MISMATCH"
  | "NO_GOOD_CANDIDATE"
  | "NO_EVIL_CANDIDATE"
  | "NO_VORTOX_FALSE_GOOD_CANDIDATE"
  | "NO_VORTOX_FALSE_EVIL_CANDIDATE";

export type DreamerV2CandidateResolution =
  | {
      readonly kind: "READY";
      readonly candidateDomain:
        DreamerV2CandidateDomainSnapshot;
      readonly selectedGoodRole:
        RoleSetupSnapshot;
      readonly selectedEvilRole:
        RoleSetupSnapshot;
      readonly truthOutcome:
        "TARGET_INCLUDED" | "TARGET_EXCLUDED";
      readonly informationReliability:
        DreamerV2InformationReliability;
    }
  | {
      readonly kind: "DEPENDENCY_FAILURE";
      readonly failureCode:
        DreamerV2CandidateResolutionFailureCode;
      readonly message: string;
    };
```

候选构造规则：

1. 输入 role array 必须是真实、dense、无重复的 exact snapshots。
2. catalog metadata 必须与 setup 的已签名 snapshot exact 一致。
3. GOOD 仅包含 `TOWNSFOLK` 或 `OUTSIDER`，且 `defaultAlignment === "GOOD"`。
4. EVIL 仅包含 `MINION` 或 `DEMON`，且 `defaultAlignment === "EVIL"`。
5. 两侧分别按现有 `compareStableId` 的 UTF-16 code-unit 顺序排序。
6. 不使用 input order、object/map iteration order、locale、随机、时钟或 UUID。
7. 目标真实角色必须 exact 存在于该 snapshot。
8. candidate snapshot 保存完整排序后的两个角色数组；不得只保存最终选择。
9. 在场角色不被排除。

确定性选择：

- 正常有效、无有效涡流：
  - GOOD 目标：GOOD 为真实角色，EVIL 为排序后首个 EVIL。
  - EVIL 目标：EVIL 为真实角色，GOOD 为排序后首个 GOOD。
- 来源醉酒/中毒、无有效涡流：
  - 两侧先选择排序后首个不等于目标真实角色的候选。
  - 目标原生侧没有替代角色时，回退到真实角色；这产生规则允许的真信息。
  - 非目标侧选择排序后首个候选。
- 有效涡流：
  - 两侧均过滤目标真实角色后选择排序后首项。
  - 目标原生侧不存在替代角色时失败关闭。
  - 结果必须是 `TARGET_EXCLUDED`。
- 候选解析器必须是一个共享纯函数，由命令决策、prospective validation 和 replay validation 使用。

## impairmentEvidence

```ts
export type DreamerV2RepresentedImpairment = {
  readonly impairmentId: AbilityImpairmentId;
  readonly impairmentKind: "DRUNK" | "POISONED";
  readonly sourceKind:
    | "PHILOSOPHER_CHOSEN_DUPLICATE"
    | "SNAKE_CHARMER_DEMON_HIT";
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRoleId: RoleId;
  readonly affectedRole: RoleSetupSnapshot;
  readonly appliedCharacterStateRevision: number;
};

export type DreamerV2SourceEffectiveness =
  | {
      readonly kind: "EFFECTIVE";
      readonly representedImpairments: readonly [];
    }
  | {
      readonly kind: "KNOWN_DRUNK";
      readonly primaryImpairmentId:
        AbilityImpairmentId;
      readonly representedImpairments:
        readonly DreamerV2RepresentedImpairment[];
    }
  | {
      readonly kind: "KNOWN_POISONED";
      readonly primaryImpairmentId:
        AbilityImpairmentId;
      readonly representedImpairments:
        readonly DreamerV2RepresentedImpairment[];
    };
```

非空 impairment 数组必须 dense、按 impairment ID code-unit 排序、无重复，并且每项与 canonical impairment state exact 一致。首项是 primary；kind 由首项决定。该排序只解决产品确定性，不声明醉酒优先于中毒或相反的外部规则。

## vortoxInformation

```ts
export type DreamerV2RoleTenureSnapshot = {
  readonly roleTenureId: RoleTenureId;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: RoleId;
  readonly acquiredCharacterStateRevision: number;
  readonly statusAtEvaluation: "ACTIVE";
};

export type DreamerV2VortoxConstraint =
  | {
      readonly kind:
        "NONE_NO_CURRENT_VORTOX";
      readonly evaluatedCharacterStateRevision: number;
    }
  | {
      readonly kind:
        "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleSnapshot:
        RoleSetupSnapshot;
      readonly vortoxRoleTenure:
        DreamerV2RoleTenureSnapshot;
      readonly impairment:
        DreamerV2RepresentedImpairment;
    }
  | {
      readonly kind:
        "VORTOX_FALSE_REQUIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleSnapshot:
        RoleSetupSnapshot;
      readonly vortoxRoleTenure:
        DreamerV2RoleTenureSnapshot;
    };
```

解析要求：

- 无当前 `vortox`：`NONE_NO_CURRENT_VORTOX`。
- 一个当前 Vortox 且存在唯一连续 active tenure：
  - 有与当前 Vortox 玩家、座位、角色匹配的 canonical impairment：`NONE_CURRENT_VORTOX_KNOWN_IMPAIRED`。
  - 无 impairment：`VORTOX_FALSE_REQUIRED`。
- 多个当前 Vortox、缺失/重复 tenure、tenure 与当前角色不一致、impairment 不可验证或 revision 不连续：dependency failure。
- 不得修改或复用成不同语义的公共 Mathematician state-bound resolver。可抽取仅处理 canonical Vortox identity/tenure/impairment 的无角色信息语义内部 helper，但 Dreamer constraint 类型、false proposition 和验证必须独立。

## normalInformation

正常有效来源且 constraint 为 `NONE_NO_CURRENT_VORTOX` 或 `NONE_CURRENT_VORTOX_KNOWN_IMPAIRED` 时：

```text
selectedGoodRole.defaultAlignment = GOOD
selectedEvilRole.defaultAlignment = EVIL
exactly one selected roleId = targetTrueRole.roleId
informationReliability = RULE_CORRECT
truthOutcome = TARGET_INCLUDED
```

当前玩家阵营不参与判定。

## impairedInformation

```ts
export type DreamerV2InformationReliability =
  | "RULE_CORRECT"
  | "DETERMINISTIC_TRUE_WITH_KNOWN_DRUNKENNESS"
  | "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"
  | "DETERMINISTIC_TRUE_WITH_KNOWN_POISONING"
  | "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING"
  | "VORTOX_CONSTRAINED_FALSE";
```

无有效涡流时：

- `KNOWN_DRUNK` 且 `TARGET_EXCLUDED`：
  `DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS`。
- `KNOWN_DRUNK` 且 `TARGET_INCLUDED`：
  `DETERMINISTIC_TRUE_WITH_KNOWN_DRUNKENNESS`。
- `KNOWN_POISONED` 且 `TARGET_EXCLUDED`：
  `DETERMINISTIC_FALSE_WITH_KNOWN_POISONING`。
- `KNOWN_POISONED` 且 `TARGET_INCLUDED`：
  `DETERMINISTIC_TRUE_WITH_KNOWN_POISONING`。

不得把醉酒/中毒允许为真的规则改写成强制为假。

## vortoxPlusImpairment

只要 constraint 为 `VORTOX_FALSE_REQUIRED`，无论来源 effectiveness 是 EFFECTIVE、KNOWN_DRUNK 或 KNOWN_POISONED：

```text
truthOutcome = TARGET_EXCLUDED
informationReliability = VORTOX_CONSTRAINED_FALSE
selectedGoodRole.roleId != targetTrueRole.roleId
selectedEvilRole.roleId != targetTrueRole.roleId
```

来源 impairment 仍保存在 payload 隐藏证据中；ledger 的 controlling cause 必须为 `VORTOX_FALSE_INFORMATION`。

## commands

外部 command exact shape 不变：

```ts
export type SubmitDreamerActionCommandPayload = {
  readonly commandType: "SubmitDreamerAction";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly decision: {
    readonly kind: "CHOOSE_PLAYER";
    readonly targetPlayerId: PlayerId;
  };
};
```

不得允许 command 提交：

- selected role；
- candidate list；
- source kind；
- grant ID；
- ability instance；
- impairment；
- Vortox constraint；
- correctness；
- reliability；
- revision。

Human 和 AI actor 必须都等于 opportunity 的 `sourcePlayerId`。System/Storyteller 的既有权限不扩张。

内部决策合同：

```ts
export type DreamerV2ResolutionFailureKind =
  | "INVALID_ACCEPTED_EVENT_STREAM"
  | "PIPELINE_STATE_MISMATCH"
  | "UNSUPPORTED_V1_GAINED_SOURCE"
  | "V1_VORTOX_EVIDENCE_UNREPRESENTABLE"
  | "INVALID_V2_SOURCE_CHAIN"
  | "SOURCE_NO_LONGER_VALID"
  | "INVALID_TARGET_STATE"
  | "VORTOX_EVIDENCE_UNAVAILABLE"
  | "SOURCE_IMPAIRMENT_EVIDENCE_UNAVAILABLE"
  | "CANDIDATE_DOMAIN_UNAVAILABLE";

export type InternalDreamerV2Resolution =
  | {
      readonly kind: "READY";
      readonly sourceContract:
        DreamerV2SourceContract;
      readonly targetTruth:
        DreamerV2TargetTruth;
      readonly candidateResolution:
        Extract<
          DreamerV2CandidateResolution,
          { readonly kind: "READY" }
        >;
      readonly sourceEffectiveness:
        DreamerV2SourceEffectiveness;
      readonly vortoxConstraint:
        DreamerV2VortoxConstraint;
      readonly settlementCharacterStateRevision: number;
    }
  | {
      readonly kind: "DEPENDENCY_FAILURE";
      readonly failureKind:
        DreamerV2ResolutionFailureKind;
      readonly message: string;
    };
```

该 resolver 从完整 accepted event stream 重建 canonical state，再与 application pipeline state 比较。它不得从调用者传入未验证的候选、ledger、constraint 或 source evidence。

## events

选择方案 A：新增事件类型。

理由：

- V1 payload 没有 Vortox、候选 snapshot、source union、grant identity 或 settlement revision 证据。
- 给 V1 增加可选字段会破坏 exact-shape 和 hostile replay 合同。
- 新事件类型可让 batch、replay、ledger 和 projection 明确拒绝 V1/V2 混合。
- 既有 V1 事件和 2B18B Mathematician payload 不需要改变。

新 ID：

```ts
export type DreamerV2TargetChoiceId =
  string & {
    readonly __brand: "DreamerV2TargetChoiceId";
  };

export type DreamerV2DeliveryId =
  string & {
    readonly __brand: "DreamerV2DeliveryId";
  };
```

格式：

```text
dreamer-target-choice-v2:<taskId>
dreamer-delivery-v2:<taskId>
```

formatter/parser 必须验证 canonical task ID，且 parse 后重新 format 等于原值。

```ts
export type DreamerTargetChosenV2Payload = {
  readonly rulesBaselineVersion: string;
  readonly targetChoiceSchemaVersion:
    typeof DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly targetChoiceId: DreamerV2TargetChoiceId;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourceContract: DreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly settlementCharacterStateRevision: number;
};

export type DreamerInformationDeliveredV2Payload = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion:
    typeof DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly targetChoiceId: DreamerV2TargetChoiceId;
  readonly deliveryId: DreamerV2DeliveryId;
  readonly sourceContract: DreamerV2SourceContract;
  readonly targetTruth: DreamerV2TargetTruth;
  readonly candidateDomain:
    DreamerV2CandidateDomainSnapshot;
  readonly selectedGoodRole: RoleSetupSnapshot;
  readonly selectedEvilRole: RoleSetupSnapshot;
  readonly truthOutcome:
    "TARGET_INCLUDED" | "TARGET_EXCLUDED";
  readonly sourceEffectiveness:
    DreamerV2SourceEffectiveness;
  readonly vortoxConstraint:
    DreamerV2VortoxConstraint;
  readonly informationReliability:
    DreamerV2InformationReliability;
  readonly resolutionModelVersion:
    typeof DREAMER_V2_RESOLUTION_MODEL_VERSION;
  readonly simulationPolicyVersion:
    typeof DREAMER_V2_SIMULATION_POLICY_VERSION;
  readonly knowledgeModelVersion:
    typeof DREAMER_V2_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage:
    typeof DREAMER_V2_INFORMATION_STAGE;
  readonly settlementCharacterStateRevision: number;
};
```

新增：

```ts
DomainEventPayloadByType["DreamerTargetChosenV2"]
DomainEventPayloadByType["DreamerInformationDeliveredV2"]
```

现有 `ScheduledTaskSettled` 不新增版本：

```text
taskType = DREAMER_ACTION
outcomeType = DREAMER_INFORMATION_DELIVERED
characterStateRevision =
  DreamerInformationDeliveredV2.settlementCharacterStateRevision
```

## eventVersioning

- envelope `eventVersion` 仍为现有受支持 domain event version。
- payload 通过新 event type 和内部 schema version 双重判别。
- V1 event type 只接受原 exact keys。
- V2 event type 只接受上述 exact keys。
- V1 payload 发送给 V2 type、V2 payload 发送给 V1 type、缺字段、额外字段或错误版本均拒绝。
- `DreamerTargetChoiceSet.choices` 成为 V1/V2 payload 的严格 union。
- `DreamerInformationSet.deliveries` 成为 V1/V2 payload 的严格 union。
- clone、same、append 和 export 必须分别走明确分支，不得使用字段存在性猜测语义，除非先验证 exact discriminator。
- 2B18B `MathematicianInformationDelivered` 类型和 payload 完全不变。

## batchSemantics

成功的 V2 `SubmitDreamerAction` 必须原子地产生且仅产生：

1. `DreamerTargetChosenV2`
2. `DreamerInformationDeliveredV2`
3. `ScheduledTaskSettled`

约束：

- 三事件同 batch、command、correlation、causation、game version。
- event sequence 连续递增。
- target choice、delivery、settlement 的 task ID exact 相同。
- opportunity ID exact 相同。
- target choice ID exact 相同。
- source contract canonical-data exact 相同。
- target player/seat exact 相同。
- settlement revision exact 相同。
- delivery 是该 task/opportunity 的唯一 V2 delivery。
- settlement 是该 task 的唯一 settlement。
- opportunity 由 target event 或 delivery/settlement链关闭；不得在同批加入额外 close event。
- 不允许 target-only、delivery-only、settlement-only、倒序、重复 delivery、混合 V1/V2 或夹入 `PhaseTransitioned`。
- 整批只增加一次逻辑 game version。
- 任一事件失败时整批不追加，state、ledger、receipt 和 version 均不改变。

## ledgerAdapter

新增 terminal type：

```text
DreamerInformationDeliveredV2
```

新增 evidence variant：

```ts
export type DreamerV2DeliveryEvidence = {
  readonly kind: "DREAMER_V2_DELIVERY";
  readonly deliveryId: DreamerV2DeliveryId;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly abilityInstanceId:
    FirstNightAbilityInstanceId;
  readonly targetPlayerId: PlayerId;
  readonly targetTrueRoleId: RoleId;
  readonly deliveredGoodRoleId: RoleId;
  readonly deliveredEvilRoleId: RoleId;
  readonly candidateDomainVersion:
    typeof DREAMER_V2_CANDIDATE_DOMAIN_VERSION;
  readonly roleCatalogSignature: string;
  readonly informationReliability:
    DreamerV2InformationReliability;
  readonly vortoxConstraintKind:
    DreamerV2VortoxConstraint["kind"];
  readonly terminalEventId: EventId;
};
```

`AbilityOutcomeEvidenceReference` 只增加该新 union member；已有 member exact shape 和 canonical ordering 不变。

V2 fact 的 `abilityInstance` 必须从 canonical plan/grant/insertion chain 独立重建，并与 payload source contract exact 相等。不得仅信任 payload。

分类：

| 条件 | outcomeStatus | causeKind | causedByAnotherCharacterAbility |
|---|---|---|---|
| RULE_CORRECT | NORMAL | NO_OTHER_CHARACTER_ABILITY | false |
| impaired 且 TARGET_INCLUDED | NORMAL | NO_OTHER_CHARACTER_ABILITY | false |
| drunk 且 TARGET_EXCLUDED | ABNORMAL | SOURCE_DRUNKENNESS | true |
| poisoned 且 TARGET_EXCLUDED | ABNORMAL | SOURCE_POISONING | true |
| VORTOX_CONSTRAINED_FALSE | ABNORMAL | VORTOX_FALSE_INFORMATION | true |

有效 V2 delivery 不再产生：

- `DREAMER_VORTOX_CONSTRAINT_UNRECORDED`
- `VORTOX_APPLICABILITY_NOT_PROVEN`

如果证明不完整，命令在事件前失败，不产生 terminal fact。

V2 evidence 至少包括：

- SOURCE_EVENT；
- TASK；
- CHARACTER_STATE；
- source player role；
- V2 action opportunity；
- target player role at settlement revision；
- DREAMER_V2_DELIVERY；
- source impairment evidence；
- Vortox player role和active tenure evidence；
- 已知无效 Vortox 的 impairment evidence；
- gained 路径原始 Philosopher opportunity、grant 和 V2 insertion evidence。

V1 fact derivation和evidence order不得变化。Mathematician 后续只读取既有 ledger fact fields；不得改变 Mathematician event contract。

## storedValidation

所有 V2 exact-shape validator 必须：

- 先验证 plain canonical object；
- 使用 exact enumerable key set；
- 拒绝 symbol、accessor、prototype trick、非有限数、非安全整数；
- 对全部数组验证真实数组、dense、顺序、唯一性；
- 对 snapshots 执行 exact role snapshot validation；
- 对所有 IDs 执行 parser/formatter round-trip；
- 对 source、target、candidate、Vortox、impairment、grant、insertion 和 revision 逐字段交叉验证；
- 不使用 raw `JSON.stringify` 作为语义等价判断；
- 不依赖 locale。

`validateStoredDreamerInformationDeliveredV2` 的输入必须至少包含：

```ts
export type StoredDreamerV2ValidationInput = {
  readonly rulesBaselineVersion: string;
  readonly setupRoleCatalogSnapshot:
    RoleCatalogSnapshot;
  readonly setupRoleCatalogSignature: string;
  readonly rosterPlayerIds:
    readonly PlayerId[];
  readonly firstNightTaskPlanVersion:
    "first-night-task-plan-v2";
  readonly targetChoices:
    readonly DreamerTargetChosenV2Payload[];
  readonly sourceOpportunities:
    readonly DreamerActionOpportunityV2[];
  readonly settlements:
    readonly {
      readonly taskId: ScheduledTaskId;
      readonly taskType: "DREAMER_ACTION";
      readonly nightNumber: 1;
      readonly settlementVersion:
        "scheduled-task-settlement-v1";
      readonly outcomeType:
        "DREAMER_INFORMATION_DELIVERED";
      readonly characterStateRevision: number;
    }[];
};
```

状态中的 V2 delivery 只能作为缓存。可信回放必须从 accepted events 重建并逐事件验证。缺失 accepted-stream provenance 时，state-only projection 对存在 V2 history 的状态失败关闭；V1 state-only projection保持兼容。

## privateProjection

对 source player 暴露的唯一 V2 信息为：

```ts
export type PlayerDreamerInformationViewV2 = {
  readonly target: {
    readonly playerId: PlayerId;
    readonly seatNumber: SeatNumber;
  };
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
};

export type PlayerDreamerV2ProjectionFields = {
  readonly dreamerInformation:
    PlayerDreamerInformationViewV2;
  readonly dreamerKnowledgeModelVersion:
    typeof DREAMER_V2_INFORMATION_MODEL_VERSION;
};
```

`DREAMER_INFORMATION` 只通过现有 `deliveredKnowledgeStages` 暴露。

不得投影：

- source contract；
- source kind；
- Philosopher grant/insertion；
- target true role；
- candidate arrays；
- truth outcome；
- correctness；
- source impairment；
- Vortox identity、tenure 或 constraint；
- reliability；
- simulation policy；
- ledger cause。

规则：

- base source 只看自己的 delivery。
- gained source 是哲学家玩家，只看自己的 gained delivery。
- 其他玩家看不到。
- Human player view 与 AI memory boundary 使用相同 source filter。
- accepted-event-stream player/AI builder验证完整 V2 triplet 后才投影。
- 后续角色、阵营、醉酒、中毒或涡流变化不重算历史 delivery。
- 一个 viewer 在本 Slice 支持范围内若出现多个第一夜 Dreamer delivery，projection 失败关闭；不得静默选 first/last。

## replay

1. V1 accepted history按现有 validators 原样重放。
2. V2 只接受新 event types。
3. replay 按事件发生时的 pre-event state验证，不按最终角色状态重算。
4. V2 target event 验证当时 source contract、opportunity、target roster/state 和 revision。
5. V2 delivery 重新运行 source、Vortox、impairment和candidate resolver，并要求结果与payload canonical exact相等。
6. settlement验证唯一 target、唯一 delivery、唯一 ledger fact及其证据。
7. V1/V2 event混合、V1 plan配V2 insertion、V2 plan配V1 gained execution全部拒绝。
8. 之后的角色或阵营变化不修改已保存的 target truth 或输出。
9. trusted checkpoint只有在完整 accepted prefix 已验证后可使用；checkpoint不得把 state shape validation替代为历史来源证明。
10. Windows和Ubuntu必须产生相同 task/opportunity/choice/delivery ID、candidate order和selected roles。

## prospectiveValidation

新增：

```ts
export type ProspectiveDreamerV2TripletValidation =
  | {
      readonly valid: true;
      readonly resultingGameVersion: number;
      readonly resultingLastEventSequence: number;
    }
  | {
      readonly valid: false;
      readonly reason: string;
    };
```

`validateProspectiveDreamerV2Triplet` 接收 prior accepted events 和三个候选事件，必须：

- 从 prior events 独立 rebuild；
- 确认 pipeline state fingerprint一致；
- 确认 exact 3-event顺序；
- 逐事件应用 exact validators；
- 确认 delivery 后正好新增一个 terminal ledger fact；
- 确认 settlement 后 task settled、opportunity closed；
- 确认无其他 state field 非法变化；
- 返回最终 version/sequence；
- 任一失败映射到 retryable `DependencyExecutionFailed`，stage 为 `prospective-validation`。

普通 `validateDomainBatchSemantics` 和 `applyDomainEventBatch` 仍必须随后运行；该专用 validator 不能替代通用 gate。

## receiptBoundary

以下是可记录 rejection receipt 的确定性客户端错误：

- command exact shape错误；
- unknown task/opportunity；
- closed opportunity；
- actor/source不匹配；
- task不是next；
- target不存在；
- target是source；
- 不支持的phase。

以下返回 retryable failure，且不得写 receipt：

- candidate domain不足或损坏；
- Vortox identity/tenure/impairment证据不可证明；
- source impairment canonical evidence不可证明；
- gained grant/choice/insertion/instance链缺失或冲突；
- V1 gained execution；
- 新V1命令存在当前Vortox；
- pipeline state与accepted-stream rebuild不一致；
- batch构建、metadata或prospective validation失败。

candidate和V2 dependency failure使用：

```text
status = failed
code = DependencyExecutionFailed
failureStage =
  first-night-role-action
retryable = true
```

V1 gained 可使用现有 `ApplicationNotConfigured`，同样不写 receipt。

成功时：

- 写一个 accepted receipt；
- 同一 command ID、同一 fingerprint重试返回idempotent accepted；
- 同一 command ID、不同fingerprint按既有冲突规则处理；
- 失败关闭后可修复依赖并用同一 command ID重试，因为没有旧 receipt。

## failureBoundary

必须在生成 batch ID、event ID、timestamp 和 accepted receipt 之前完成：

- command capture；
- canonical rebuild；
- source chain；
- target truth；
- Vortox constraint；
- source impairment；
- candidate resolution。

metadata生成失败后仍不得追加部分事件。

禁止：

- 候选不足时选择未知角色；
- 缺 tenure 时假设 Vortox 有效或无效；
- 缺 grant 时把 gained 当 base；
- V1 gained 自动迁移成V2；
- source mismatch时改用当前base Dreamer；
- ledger失败后仍提交delivery；
- projection validator失败时暴露未验证payload。

## implementationFiles

允许修改与本 Slice 直接相关的文件：

- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/index.ts`
- `packages/application/src/game-application-service.ts`
- `packages/application/src/command-result.ts`，仅在无需新增语义而补充现有failure routing时
- `packages/projections/src/index.ts`
- 对应测试和test-harness builders
- `README.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- 2B19 status、traceability和review文档

不得改变2B18B Mathematician payload、数字域、计数策略或Option A分类。

## tests

以下74项是最低语义矩阵。每项必须具有唯一测试ID和直接断言；一个大集成测试运行成功不能替代逐项断言。

| ID | Design claim | Required assertion |
|---|---|---|
| D19-001 | normal GOOD target | GOOD等于target true，EVIL为合法候选 |
| D19-002 | normal EVIL target | EVIL等于target true，GOOD为合法候选 |
| D19-003 | drunk source | 候选充分时输出false并记录drunk |
| D19-004 | poisoned source | 候选充分时输出false并记录poison |
| D19-005 | Vortox GOOD target | 两项均不等于target true |
| D19-006 | Vortox EVIL target | 两项均不等于target true |
| D19-007 | Vortox plus drunk | reliability为VORTOX_CONSTRAINED_FALSE |
| D19-008 | Vortox plus poison | reliability为VORTOX_CONSTRAINED_FALSE |
| D19-009 | candidate shortage | retryable failure且零事件/receipt/version变化 |
| D19-010 | gained opportunity | 创建strict V2 opportunity |
| D19-011 | gained Human source | matching Philosopher可提交 |
| D19-012 | gained AI source | matching Philosopher可提交 |
| D19-013 | non-source actor | ActorPlayerMismatch |
| D19-014 | missing grant | fail closed |
| D19-015 | missing insertion | fail closed |
| D19-016 | original Philosopher opportunity mismatch | fail closed |
| D19-017 | gained Dreamer opportunity mismatch | reject/fail before events |
| D19-018 | role segment mismatch | parser/chain拒绝 |
| D19-019 | exact gained revision mismatch | chain拒绝 |
| D19-020 | base duplicate impairment isolation | base drunk不影响gained |
| D19-021 | gained source impairment | Philosopher自身impairment适用 |
| D19-022 | gained normal information | 一GOOD一EVIL且恰一真 |
| D19-023 | gained Vortox | 一GOOD一EVIL且均假 |
| D19-024 | base before gained | official position内base先 |
| D19-025 | multiple gained order | seat后task ID code-unit |
| D19-026 | V1 replay | accepted V1 exact重放 |
| D19-027 | V1 exact shape | 新字段/缺字段均拒绝 |
| D19-028 | V1 no Vortox | 保持既有执行 |
| D19-029 | new V1 current Vortox | fail closed无receipt |
| D19-030 | V1 gained | unsupported无settlement |
| D19-031 | mixed V1/V2 batch | batch拒绝 |
| D19-032 | GOOD domain | 仅TF/Outsider且排序稳定 |
| D19-033 | EVIL domain | 仅Minion/Demon且排序稳定 |
| D19-034 | code-unit order | 不使用locale |
| D19-035 | normal truth preservation | target true必须包含 |
| D19-036 | Vortox exclusion | target true从两项排除 |
| D19-037 | sparse candidates | 拒绝 |
| D19-038 | duplicate candidates | 拒绝 |
| D19-039 | unknown catalog role | 拒绝 |
| D19-040 | input order independence | 乱序输入结果相同 |
| D19-041 | valid V2 triplet | accepted |
| D19-042 | naked target | 拒绝 |
| D19-043 | naked delivery | 拒绝 |
| D19-044 | naked settlement | 拒绝 |
| D19-045 | reversed triplet | 拒绝 |
| D19-046 | source mismatch | 拒绝 |
| D19-047 | target mismatch | 拒绝 |
| D19-048 | candidate tamper | replay拒绝 |
| D19-049 | reliability tamper | replay拒绝 |
| D19-050 | Vortox constraint tamper | replay拒绝 |
| D19-051 | extra fields | exact-shape拒绝 |
| D19-052 | duplicate delivery | 拒绝 |
| D19-053 | mixed PhaseTransitioned | batch拒绝 |
| D19-054 | ledger normal | NORMAL/NO_OTHER |
| D19-055 | ledger drunk false | ABNORMAL/SOURCE_DRUNKENNESS |
| D19-056 | ledger poison false | ABNORMAL/SOURCE_POISONING |
| D19-057 | ledger Vortox false | ABNORMAL/VORTOX_FALSE_INFORMATION |
| D19-058 | no V2 Vortox unresolved | valid V2不产生UNRESOLVED |
| D19-059 | gained ledger source | source为Philosopher holder |
| D19-060 | Math consumption | 后续Math读取fact且Math event shape不变 |
| D19-061 | base projection | 仅target/two roles/model/stage |
| D19-062 | gained projection | Philosopher只见自己的delivery |
| D19-063 | other player projection | 无Dreamer信息 |
| D19-064 | AI boundary | 与player source filter相同 |
| D19-065 | hide Vortox | 不投影constraint/identity |
| D19-066 | hide impairment | 不投影impairment |
| D19-067 | hide correctness | 不投影truth/reliability |
| D19-068 | historical immutability | 后续状态变化不重算 |
| D19-069 | 2B18B regression | 全部既有Math测试绿 |
| D19-070 | Clockmaker regression | 行为不变 |
| D19-071 | Seamstress regression | 行为不变 |
| D19-072 | Mathematician regression | payload和行为不变 |
| D19-073 | Philosopher V1/V2 regression | choice/grant/insertion/order不变 |
| D19-074 | cross-platform | Windows/Ubuntu canonical结果相同 |

额外必须覆盖：

- impaired无Vortox且缺同侧false替代时回退为真；
- 当前Vortox已证明醉酒时按无有效Vortox解析；
- 缺失Vortox tenure；
- conflicting current Vortox identities；
- target仅阵营变化不改变答案；
- target结算前角色变化使用新角色；
- delivery后角色变化不重写projection；
- candidate role在场仍合法；
- opportunity ID和choice/delivery ID hostile parser；
- accessors、symbol keys、稀疏数组和extra key；
- failure后同command ID可重试；
- metadata失败和prospective失败均无部分提交；
- V2 state-only projection失败关闭，accepted-stream projection成功；
- ledger evidence包含gained chain和Vortox chain；
- V1 ledger evidence顺序不变。

## ruleToTestTraceability

| Rule/design claim | Tests |
|---|---|
| 正常恰一真 | D19-001, D19-002, D19-022, D19-035 |
| Vortox两项均假 | D19-005–008, D19-023, D19-036, D19-050, D19-057–058 |
| impairment允许真/假 | D19-003–004及impaired fallback额外测试 |
| gained source identity | D19-010–023, D19-059 |
| V1/V2隔离 | D19-026–031 |
| deterministic candidate domain | D19-032–040, D19-074 |
| atomic history | D19-041–053 |
| ledger terminal fact | D19-054–060 |
| private boundary | D19-061–068 |
| accepted dependency compatibility | D19-069–073 |

实现分支必须增加 `docs/implementation/phase-3-slice-2b19-test-traceability.md`，记录每个ID对应的测试文件、测试名称和直接生产入口。

## explicitOutOfScope

- 其他夜晚筑梦师；
- 第一夜整体完成；
- DAY；
- general dawn reset；
- Traveller目标；
- Spy、Recluse及其他registration；
- 自由Storyteller候选选择；
- UI、Electron、SQLite；
- AI策略；
- 通用poison生产或失效引擎；
- 新角色变化命令；
- 新阵营变化命令；
- death interaction；
- Phase 2C；
- 修改V1 Dreamer payload/history；
- 修改2B18B Mathematician event contract；
- 把Dreamer、Vortox、Philosopher或Mathematician标为COMPLETE。

## documentationCloseout

当前已确认的文档漂移必须在功能分支内与实现一起修正，不得另建main docs提交：

- README不得继续声称2B18B未开始。
- CURRENT_TASK不得继续保留2B18B closeout步骤或禁止2B19的旧指令。
- CURRENT_TASK在实现期间指向2B19；合并closeout后准确记录2B19完成状态。
- ROLE_COVERAGE_MATRIX更新Dreamer base first-night、gained V2、drunk、poison、Vortox、projection和character-change historical behavior，但状态保持PARTIAL。
- Philosopher、Vortox和Mathematician覆盖不得被提升为COMPLETE。
- AUTOPILOT_STATE保持单Slice、单分支、单PR事实。

## completionCriteria

只有全部满足才可认为2B19实现完成：

1. evidence保持`RULE_READY`。
2. 独立reviewer返回`RULE_DESIGN_PASS`后才建分支。
3. 分支名为`phase-3/dreamer-v2-completion`。
4. V1 exact shape、三事件历史和accepted replay无变化。
5. V2 base与gained source合同全部实现。
6. V2正常、drunk、poison、Vortox和组合路径实现。
7. candidate shortage及证据不足失败关闭且不写receipt。
8. V2三事件batch、rebuild、ledger、projection和trusted replay全部闭环。
9. 2B18B Mathematician event合同无变化。
10. 74项最低矩阵及额外hostile测试通过。
11. `pnpm typecheck`、`pnpm lint`、`pnpm test`、`pnpm test:coverage`和`git diff --check`通过。
12. README/CURRENT_TASK drift在同一功能分支修正。
13. ROLE_COVERAGE_MATRIX仍标记Dreamer为PARTIAL。
14. 不完成FIRST_NIGHT，不进入DAY，不开始Phase 2C。
15. 冻结feature HEAD的CI成功。
16. 独立final reviewer完整返回`CODE_REVIEW_PASS`和`RULE_REVIEW_PASS`，`remainingBlockers=[]`。
17. 两个GitHub audit comments逐字发布并重新读取验证。
18. passing review后无新commit。
19. merge、accepted tag和post-merge closeout满足REVIEW_PROTOCOL。

## coverageStatus

`PARTIAL`

原因：

- 其他夜晚筑梦师未实现；
- Traveller目标限制未实现；
- registration未实现；
- 自由Storyteller选择未实现；
- 通用poison/失效生命周期未实现；
- death及更广泛角色/阵营交互未实现；
- 第一夜生命周期尚未完成。

READY_FOR_RULE_DESIGN_REVIEW_ROUND_1
