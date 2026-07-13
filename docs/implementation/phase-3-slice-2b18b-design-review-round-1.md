独立规则设计审查报告

reviewedDesign: `docs/implementation/phase-3-slice-2b18b-design.md`  
reviewedDesignSha256: `4267e60199db1ecc5e4cf6c96179dbf532b21f9e27b33730ca28cc5f9963867f`  
resolvedEvidence: `docs/rules/evidence/2B18B-resolved.md`  
resolvedEvidenceSha256: `0c4893de8f38dfc05876f89744976a7c54afc6bd41465f2e1198d22b0844a4c8`  
historicalEvidenceSha256: `eae53e0eed5d54c5c4a78d31543749787359f61b2e9b7c3f0ceb27069d2471c1`  
reviewScope: Phase 3 Slice 2B18B Option A，design round `1 / 2`，只读规则设计审查。

### 独立来源核验

已独立读取并交叉检查：

- `docs/rules/USER_OVERRIDES.md`
- 官方 Mathematician `oldid=3109`
- 官方 Philosopher `oldid=2421`
- 官方 States `oldid=1039`
- 官方 Vortox `oldid=3017`
- 中文数学家 `oldid=6214`
- 中文哲学家 `oldid=5125`
- 中文涡流 `oldid=6198`
- official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`
- nightsheet SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- 2B18、2B17.2/V2、2B17.3/V1、2B18A accepted ledger-only authority、PR #23最终审查档案及角色覆盖矩阵。

规则真值确认：

- 数学家按玩家而非异常次数计数；
- 不检测自身能力；
- 醉酒/中毒状态本身不计，只有实际异常结果才计；
- 涡流下镇民能力信息必须为假，即使镇民醉酒或中毒；
- 哲学家获得夜间能力时在该角色应行动的时点行动；
- Option A是产品支持边界，不是官方规则修正或新override；
- 外部来源没有新增实质冲突；
- 官方首夜相关顺序仍为 Philosopher → Snake Charmer → Witch → Cerenovus → Clockmaker → Dreamer → Seamstress → Mathematician → Dawn；
- 2B19未开始。

### 实际实现基础核验

重点读取：

- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/player-roster.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/application/src/game-application-service.ts`
- `packages/application/src/command-result.ts`
- `packages/application/src/ports/command-commit-store.ts`
- `packages/projections/src/index.ts`
- 相关 ledger、rebuild、application、projection 测试。

当前仍只有设计、规则证据及控制文档变化；没有2B18B生产代码、测试、功能分支或PR。

## 原2B18B重点22项

1. 按玩家而非incident计数：符合。
2. resolving source排除：符合。
3. 当前ability instance排除：符合。
4. 其他玩家的较早Mathematician异常可计：符合。
5. FirstNightInitialized exclusive至当前pre-resolution事件 inclusive窗口：符合。
6. 非冗余UNRESOLVED阻塞：符合。
7. 同玩家已有qualifying异常时UNRESOLVED冗余：符合。
8. PENDING_TRIGGER不阻塞：符合。
9. impaired但得到正确信息不计：符合。
10. 数字域严格0..11：符合。
11. impaired合法候选包含真值、确定性策略选择最小false：符合。
12. Vortox强制false：行为语义符合，但exact Vortox合同不完整，见BLOCKER 5。
13. Vortox与source impairment并存仍false：行为语义符合，但证据判别联合不完整。
14. base/V1/V2来源：三种来源已区分，但Option A分类前的完整V1来源链未冻结，见BLOCKER 6。
15. complete-event-stream唯一入口：输入方向符合，但package-root返回泄漏不符合本轮明确审查要求，见BLOCKER 1。
16. 不存在public state/ledger resolver：没有接受state/ledger的resolver，但公开结果直接返回完整GameState及隐藏resolution，仍未满足完整信任边界。
17. 当前delivery不进入自身count：符合。
18. later holder读取earlier fact：符合。
19. earlier不读取future：行为合同符合，但stored-validation数据流尚不可实现，见BLOCKER 2。
20. projection只显示count：目标正确，实际API及exact view合同不完整，见BLOCKER 2、3。
21. 结算后保持FIRST_NIGHT：符合。
22. 2B19未开始：符合。

## Option A重点14项

1. V1/base-only可结算：符合。
2. V1/gained-only可结算：符合行为目标。
3. V1 base+gained在任何Math delivery前失败：目标正确，但应用调用顺序未完全冻结，见BLOCKER 4。
4. 不允许部分进度后才发现冲突：目标正确，同受BLOCKER 4影响。
5. V1 task plan不重排：符合。
6. V1不迁移为V2：符合。
7. V2 base+gained保持base-first：符合。
8. earlier/later统计合同不变：符合。
9. failure不写receipt：目标正确，但exact application result/异常映射未完成，见BLOCKER 4。
10. same command ID未来可重试：符合目标，同受BLOCKER 4影响。
11. replay接受合法V1历史且不改序：符合。
12. 不新增override：符合。
13. 玩家/AI投影不泄漏legacy limitation：目标正确，但投影数据流及exact shape未完成，见BLOCKER 2、3。
14. 2B19未开始：符合。

## 完整BLOCKER

### BLOCKER 1 — package-root resolver公开返回全部隐藏canonical数据

设计第39–92行把resolver及`MathematicianEventStreamResolution`从domain-core package root导出，并直接返回：

- `rebuiltState: GameState`
- 含source、window、trueCount、玩家/fact IDs、candidate domain、impairment、Vortox和simulation policy的完整delivery payload
- BLOCKED的fact IDs
- legacy base/gained task IDs。

这违反本轮明确要求的“无public state/ledger/context/window/source/trueCount/candidate/override注入或返回泄漏”。原始用户合同要求应用比较rebuilt state，但不要求这些内容成为package-root公开返回面。Round 2必须冻结内部应用边界与公开边界，保证只有受信任内部命令路径获得canonical结果，玩家、AI及普通package consumers没有公开隐藏结果API。

### BLOCKER 2 — stored validator与现有projection API之间没有可实现的数据路径

设计冻结：

```ts
validateStoredMathematicianInformationDelivered(
  acceptedEvents,
  deliveryEvent
)
```

但当前：

```ts
buildPlayerPrivateKnowledgeView(state, viewerPlayerId)
buildAiPrivateKnowledgeView(state, viewerPlayerId)
```

只接收`GameState`，而`GameState.mathematicianInformation`只保存payload，不保存完整accepted stream或delivery envelope。设计没有授权或定义：

- projection API如何取得完整accepted event stream；
- 是否新增event-stream projection入口；
- 如何避免把caller-created state重新当作accepted-history证明；
- 所有现有projection调用方如何迁移；
- stored validator如何避免在`validateDomainEventStream`应用Math delivery时递归调用自身；
- replay时使用pre-event canonical state的验证器与projection时使用完整stream的验证器如何分层。

因此“投影前必须做完整历史验证”目前无法按设计实现。Round 2必须给出无递归的exact validation pipeline和实际调用签名。

### BLOCKER 3 — private view的exact public contract未定义

设计定义的`MathematicianPrivateKnowledge`不是当前真实`PlayerPrivateKnowledgeView`的完整扩展合同。它没有冻结：

- `PlayerPrivateKnowledgeView`新增的exact optional keys；
- `PlayerPrivateKnowledgeStage`新增`MATHEMATICIAN_INFORMATION`；
- stage deterministic order；
- `deliveredKnowledgeStages`何时加入该stage；
- `mathematicianInformation`、`mathematicianKnowledgeModelVersion`及stage之间的biconditional；
- player/AI exact-shape validator更新；
- 多delivery到单一私有slot的具体失败条件。

此外，`MATHEMATICIAN_INFORMATION_MODEL_VERSION`被定义却没有出现在delivery payload、state或view的任何合同中。Round 2必须决定将其纳入exact payload，或删除该无绑定版本常量。

### BLOCKER 4 — resolver/application错误联合、Option A调用顺序和receipt映射不完整

`MathematicianEventStreamResolution`只定义READY、三个宽泛BLOCKED原因和Option A unsupported。它没有冻结以下resolver结果或throw映射：

- task不存在；
- task类型错误；
- task已settled；
- task非next；
- source provenance错误；
- canonical stream/plan错误；
- candidate或payload构造错误。

当前application在resolver之前已有通用task validation和可持久化rejected receipt逻辑。若未明确重排，指定base task可能先得到`ScheduledTaskNotNext`并写receipt，而不是Option A要求的统一retryable、receipt-free failure。

同时设计声称Option A返回exact stable details，但当前`CommandExecutionFailed`没有`details`字段，设计没有给出应用结果的完整判别联合、exact enumerable keys和现有其他failure variant兼容方式。`BLOCKED`也把所有原因统一绑定`blockingFactIds`，使source/Vortox unresolved允许无意义或错误的fact-ID形状。

Round 2必须冻结：

1. 基础actor/game/version检查；
2. complete-stream resolver；
3. Option A precheck；
4. deterministic task拒绝；
5. count/effectiveness/Vortox；
6. metadata/append；

的精确顺序，以及每一失败的result、receipt与throw映射。

### BLOCKER 5 — Vortox exact-shape及impairment biconditional不完整

当前`MathematicianVortoxConstraint`的`NONE` variant允许无效交叉组合：

- `NO_CURRENT_VORTOX`同时携带一项impairment；
- `CURRENT_VORTOX_KNOWN_IMPAIRED`同时携带空tuple。

KNOWN-impaired Vortox variant还没有冻结：

- Vortox player、seat、role snapshot；
- exact active tenure ID；
- impairment必须影响同一Vortox player/seat；
- `affectedRoleId`必须为`vortox`；
- impairment应用revision必须落在该tenure有效区间并不晚于settlement；
- canonical impairment ID/source chain；
- active tenure与current role的biconditional。

“复用Clockmaker/Seamstress primitive”不能替代该新payload的exact variant和stored-validation合同。source effectiveness部分也需要明确“应用revision不晚于settlement且当时/结算时仍适用”，不能用“match settlement revision”留下等值或区间歧义。

### BLOCKER 6 — Option A V1 duplicate分类前的完整canonical链未冻结

resolved evidence要求`hasV1GainedMathematicianTask`在分类前验证完整：

- task；
- V1 insertion；
- choice；
- grant；
- original Philosopher opportunity；
- source/player/seat/role；
- canonical revision；
- ability-instance provenance；
- 无V2字段。

设计第478行的gained predicate只明确V1 plan/insertion、chosen Math和unique insertion reconstruction。其他章节定义了支持结算时的source contract，但没有明确这些完整cross-links是“判定为Option A unsupported”之前的分类前置条件。

这会让malformed V1 chain可能被误报为受支持边界失败，而不是canonical-history错误。Round 2必须给出分类输入、validation顺序和malformed-history结果。

### BLOCKER 7 — Mathematician terminal ledger evidence exact集合和顺序未定义

设计新增`MathematicianDeliveryEvidence`，但没有直接给出更新后的完整`AbilityOutcomeEvidenceReference`判别联合，也没有冻结Math terminal fact在base/V1/V2、DRUNK、POISONED和Vortox各分支必须包含哪些existing evidence、每种exact key set及canonical order。

必须至少明确：

- SOURCE_EVENT；
- TASK；
- CHARACTER_STATE；
- PLAYER_ROLE_AT_REVISION；
- base或V1/V2 ability-instance provenance链；
- 条件性的ABILITY_IMPAIRMENT；
- 条件性的ROLE_TENURE；
- 条件性的PHILOSOPHER_GRANT/FIRST_NIGHT_TASK_INSERTION；
- MATHEMATICIAN_DELIVERY；

之间的required/forbidden集合、顺序和cross-links。仅定义新evidence shape不足以满足2B18A闭合ledger和stored replay验证要求。

### BLOCKER 8 — POISONED与character-change必测项没有安全、非伪造的测试路径

原140项要求直接覆盖POISONED、Vortox+POISONED和POISONED ledger classification；Option A第43/45项要求证明current-role变化不能绕过plan conflict。

当前accepted first-night事件模型中，POISONED Mathematician source及base Mathematician变成其他角色不可达。用户明确禁止伪造accepted集成历史。设计同时要求内部state/ledger/source/candidate helpers不公开，但没有指定可测试的非package-root纯resolver/replay seam。

因此185项虽然逐号列出，部分项无法在不伪造accepted history、不公开禁用helper的前提下成为直接测试。Round 2必须冻结：

- 哪些是complete-stream集成测试；
- 哪些是内部纯resolver/ledger/replay contract测试；
- 内部测试入口如何保持不从package root或application root导出；
- 不可达POISONED与character-change fixture如何证明纯语义而不冒充accepted history；
- 原140与Option A 45项必须是独立直接断言，不能仅以一个共享用例重复计数。

## 非BLOCKER确认

- 规则来源可访问，固定revision和nightsheet可独立核验。
- 没有新的外部规则冲突。
- Option A未新增override、未修改五项批准策略、未重排或迁移V1历史。
- V1 base-only/gained-only与V2完整支持矩阵的行为方向正确。
- first-night window、玩家去重、source/own exclusion、UNRESOLVED/PENDING分类、0..11 domain、smallest-false策略、Vortox false、batch顺序、FIRST_NIGHT保持和2B19停止边界均有正确行为意图。
- 所有BLOCKER均可在获准的design round 2内通过合同补全解决，无需新规则解释或HUMAN_BLOCKED。

RULE_DESIGN_FIX_REQUIRED
