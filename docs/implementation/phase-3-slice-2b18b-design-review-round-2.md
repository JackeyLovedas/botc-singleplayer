# Phase 3 Slice 2B18B Option A — Round 2/2 独立规则设计审查

reviewedDesign: `docs/implementation/phase-3-slice-2b18b-design.md`
reviewedDesignSha256: `51b69de1c2dc94377e6e7824e36905a6792a7457a30039fdd9a6e085d21779c5`
reviewedDesignRound: `2 / 2`
reviewTimestamp: `2026-07-13T09:14:09.4148222Z`
resolvedEvidence: `docs/rules/evidence/2B18B-resolved.md`
resolvedEvidenceSha256: `0c4893de8f38dfc05876f89744976a7c54afc6bd41465f2e1198d22b0844a4c8`
historicalEvidence: `docs/rules/evidence/2B18B.md`
historicalEvidenceSha256: `eae53e0eed5d54c5c4a78d31543749787359f61b2e9b7c3f0ceb27069d2471c1`
round1Review: `docs/implementation/phase-3-slice-2b18b-design-review-round-1.md`
round1ReviewSha256: `cf1e2ac0abbd805be3f0dae1eb8b9b3d30a5bb4c60d9303a4b8d7fad7125e9bf`
reviewScope: `Phase 3 Slice 2B18B Option A, final rule-design review only`
implementationAuthorized: `false`

## 独立读取的规则与证据

- 两份用户授权附件：原2B18B Goal与Option A恢复授权。
- `AGENTS.md`、`AUTOPILOT_PROMPT.md`、`REVIEW_PROTOCOL.md`及handoff规定顺序中的项目、范围、规则基线、架构输入、guardrails、风险与路线图。
- `USER_OVERRIDES.md`中的五项已批准策略；原始2B18B冲突证据；resolved evidence；`2B18-resolved.md`。
- 2B17.2 V2设计/accepted状态、2B17.3 V1兼容设计/accepted状态、2B18A accepted状态与PR #23双审查档案、当前角色覆盖矩阵。
- 官方Mathematician oldid 3109、Philosopher oldid 2421、States oldid 1039、Vortox oldid 3017；中文数学家oldid 6214、哲学家oldid 5125、涡流oldid 6198。
- official nightsheet固定提交`3d6d930a9e600321f93b2567a2e88948a675bc1e`；本次取得字节SHA-256仍为`99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`。

外部语义没有新增冲突：数学家按玩家计数、排除自身能力；醉酒/中毒状态本身不计且正确结果不计异常；有效涡流强制镇民信息为假；哲学家获得夜间能力在对应角色行动时点行动。Option A仍是产品支持边界，不是新override。固定首夜顺序仍为Philosopher → Snake Charmer → Witch → Cerenovus → Clockmaker → Dreamer → Seamstress → Mathematician → Dawn。2B19未开始。

## 独立读取的实现基础

- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `first-night-task-plan.ts`、`philosopher-ability.ts`、`first-night-action-opportunity.ts`
- `current-character-state.ts`、`player-roster.ts`、`seamstress.ts`
- `events.ts`、`game-state.ts`、`event-stream-validator.ts`、`domain-batch-semantics.ts`、`event-applier.ts`、`rebuild.ts`
- `initial-private-knowledge.ts`、`packages/projections/src/index.ts`
- `packages/application/src/game-application-service.ts`、`command-result.ts`、`ports/command-commit-store.ts`
- domain/application/projections的package manifests、根tsconfig和相关测试。

当前主分支仍是`main`，HEAD为`f11f72425827796e5a0ccf456f453bbfe9093c0e`；工作区只有2B18B证据、设计、审查历史和控制文档，没有生产代码或测试修改。

## 原2B18B重点22项复审

1–14：玩家去重、source排除、own-instance排除、其他玩家较早Math可计、首夜窗口、UNRESOLVED blocking/redundancy、PENDING nonblocking、impaired-correct不计、0..11、impaired候选、Vortox false、Vortox+impairment、base/V1/V2行为目标均正确。

15–17：无package-root hidden decision resolver、无public state/ledger resolver、当前delivery不进入自身窗口，设计方向正确。

18–19：later读earlier、earlier不读future语义正确，但实际Layer A调用合同仍有BLOCKER 1。

20–22：私有投影只显示count、phase保持FIRST_NIGHT、2B19未开始，合同正确。

## Option A重点14项复审

1–14的行为边界均保持：V1 base-only与gained-only支持；V1 base+gained在任何Math delivery前receipt-free retryable fail closed；不部分推进、不重排、不迁移；V2 base-first；later/earlier不变；合法V1 replay保留；无新override；不向玩家/AI泄漏限制；2B19未开始。完整V1 chain在unsupported分类前验证，malformed history归入canonical-invalid，Round 1的该项已关闭。

## 精确合同核对

- `MathematicianInformationDeliveredPayload`列出的enumerable keys实际恰为31个。
- command payload恰为`commandType`与`taskId`两个键。
- Vortox三个持久化variant是互斥exact-shape；source/Vortox impairment与tenure、角色、seat、revision和source event均有双条件绑定。
- private view新增字段、stage、stage order、三方biconditional、player/AI一致性、多delivery fail-closed均已冻结。
- Option A优先于next/settled/source receipt路径，公共failed result不泄漏diagnostic。
- domain-core/application package manifests只公开`.`；repository-relative internal module在当前单一根tsconfig下可编译，且没有root export。
- coverage保持`PARTIAL`，未扩展到other night、dawn reset、Storyteller自由数字、Traveller、life/death或2B19。

## Round 1八项BLOCKER关闭状态

1. root hidden resolver/return泄漏：已关闭。
2. 非递归Layer A/B及真实调用链：未关闭，见BLOCKER 1。
3. private view/stage/order/biconditional：已关闭。
4. result/application ordering/receipt映射及Option A优先级：已达到可审查的行为闭合。
5. Vortox/source impairment tenure/event biconditional：已关闭。
6. V1完整chain在Option分类前：已关闭。
7. closed ledger evidence union/order/matrix：未关闭，见BLOCKER 2。
8. 185项分层与unreachable seam诚实性：设计已逐项编号并区分CSI/APP/INT/RSP/EXP/HRS/REG；不可达POISONED未伪装为accepted history。该项本身不新增BLOCKER。

## findings

### BLOCKER 1 — Layer A签名与现有replay/event-applier调用形态不可同时实现

Round 2第99行冻结：

`validateMathematicianDeliveryAgainstPreEventState({preEventState, deliveryEvent, settlementEvent})`

并声明`validateDomainEventStream`、batch semantics和event applier在replay时都使用Layer A；第122行又声明full-stream流程的“两遍”均使用Layer A。

实际接口是：

- `validateDomainEventStream(events)`只校验stream/envelope/batch元数据，没有`preEventState`；
- `applyDomainEvent(state,event)`逐事件调用，只能取得当前delivery，不能取得尚未应用的下一条settlement；
- 只有`validateDomainBatchSemantics(currentState,events)`同时拥有pre-state、delivery和settlement。

因此按冻结签名，batch validator可以调用Layer A，但event applier和stream validator不能调用。若让event applier改为接收batch/lookahead，会改变全局replay API及所有调用方，设计没有定义或授权；若event applier只做shape检查，则违反“event applier使用Layer A”的唯一权威；若Layer A拆成payload/pre-state与pair两个验证器，设计也没有给出拆分签名、调用顺序或各自责任。`replayTrustedMathematicianProjectionStream`的“两遍均用Layer A”同样无法由当前第一遍metadata-only validator满足。

这不是实现细节偏好，而是Round 1要求的“非递归Layer A/B与真实event-stream projection调用”仍存在互斥合同。implementer必须猜测或改写权威，故不得开始实现。

### BLOCKER 2 — 必需SOURCE_EVENT无法按设计所称“完整closed union”表示Math terminal event

Round 2第501行给出完整`AbilityOutcomeEvidenceReference`联合，第517行要求每个Math fact的`SOURCE_EVENT`精确绑定Math envelope的ID/type/sequence/batch。

实际`SourceEventEvidence.eventType`类型是`TerminalAbilityOutcomeEventType`；当前closed literal union只到`SeamstressInformationDelivered`，不包含`MathematicianInformationDelivered`。Round 2没有直接冻结把该新literal加入`TerminalAbilityOutcomeEventType`，其implementation file plan也没有给出这个exact extension。

结果是：按当前真实类型，设计同时要求的Math `SOURCE_EVENT`不可构造；若implementer自行扩展terminal event union，则是在补写被宣称为“complete implementation authority”的缺失合同。Round 1第7项要求的是完整closed evidence union/order/required-forbidden matrix，不能靠推断补齐，因此该BLOCKER仍未关闭。

## 非阻塞确认

- 31-key payload数量正确。
- internal package import在当前仓库构建结构中可行。
- state-backed projection在出现Math delivery/settlement时fail closed、event-stream projection验证后才投影的边界明确。
- V1 base+gained的unsupported分类依据validated historical plan/insertion chain，而不是latest holder count。
- 规则来源、官方夜序和Option A支持矩阵没有新的实质冲突。

## remainingBlockers

1. 冻结一个可由现有`validateDomainEventStream`、`validateDomainBatchSemantics`、`applyDomainEvent`和Layer B实际调用的非递归Layer A合同，或明确修改这些全局签名及完整调用迁移；不得继续同时要求逐事件applier取得未来settlement。
2. 在完整设计权威中精确定义`TerminalAbilityOutcomeEventType`加入`MathematicianInformationDelivered`，并确认SOURCE_EVENT exact parser/validator、terminal adapter与stored replay共同使用该closed literal。

由于`designRound = 2 / 2`且仍有实质BLOCKER，本设计不能授权实现。没有发现外部规则冲突或来源不可用，因此本审查不把规则真值误报为`HUMAN_BLOCKED`；控制器应按轮次上限停止并请求新的明确设计修正授权，不得自行推断Round 3。

RULE_DESIGN_FIX_REQUIRED
