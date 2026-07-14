reviewedDesignPath: `docs/implementation/phase-3-slice-2b19-design.md`

reviewedDesignSha256: `c73e4c85f32dfaf63b2d2df87ad9226bbd95fa6423e3feb52a7c666e8a6a36fd`

reviewTimestamp: `2026-07-14T09:37:47+08:00`

reviewScope:

- Phase 3 Slice 2B19 Round 1 规则设计独立审查。
- 核对外部规则、夜间顺序、用户 override、rule evidence、覆盖矩阵、已验收 V1/V2 边界。
- 核对 Dreamer V1、V2 task insertion、Philosopher grant/ability-instance、opportunity、events/rebuild/batch、ledger、application、private projection。
- 审查 exact-shape、来源身份、Vortox/impairment 优先级、候选不足、V1/V2 隔离、原子三事件、receipt/prospective failure 和测试可实现性。

sourcesIndependentlyRead:

- Official Dreamer `oldid=2904`
- Official Vortox `oldid=3017`
- Official Philosopher `oldid=2421`
- Official States `oldid=1039`
- Official Abilities `oldid=1376`
- 中文 Wiki 筑梦师 `oldid=3046`
- 中文 Wiki 涡流 `oldid=6198`
- 中文 Wiki 哲学家 `oldid=5125`
- Official nightsheet commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`
- nightsheet SHA-256 independently verified as `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- first-night indexes independently verified: Philosopher `13`, Dreamer `60`
- other-night indexes independently verified: Philosopher `10`, Vortox `46`, Dreamer `78`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- accepted status documents for 2B13, 2B17.2, 2B18A and 2B18B

codeFilesRead:

- `packages/domain-core/src/ids.ts`
- `packages/domain-core/src/setup-types.ts`
- `packages/domain-core/src/command.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/mathematician.ts`
- `packages/domain-core/src/mathematician-internal.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`

findings:

1. BLOCKER — stored/replay/prospective validation 输入合同不完整。

   - 设计 `storedValidation` 第 838–865 行只定义“至少包含”的 `StoredDreamerV2ValidationInput`。
   - 该类型没有完整 task plan、current-character historical state、role tenures、ability impairments、Philosopher choices/grants/insertions 或 accepted event stream，却要求验证 source、target、candidate、Vortox、impairment、grant、insertion 和 revision。
   - `InternalDreamerV2Resolution` 只冻结输出，没有冻结完整输入。
   - `validateProspectiveDreamerV2Triplet` 只有返回类型和 prose，没有 exact prior-events、pipeline fingerprint、三事件 envelope tuple 和 metadata 输入类型。
   - 实现者只能自行发明安全关键合同，违反本设计的 exact-shape 目标。

2. BLOCKER — claimed impairment support 与 canonical accepted-history 可达性冲突。

   - `supportMatrix`、D19-004、D19-008、D19-021 及额外“当前 Vortox 已证明醉酒”测试声称这些路径可由 V2 command/replay 支持。
   - 当前 canonical producers 中，Philosopher duplicate 只能选择善良角色，不能使 Vortox 醉酒；Snake Charmer Demon-hit 的受影响玩家交换后是 Snake Charmer，不再是当前 Vortox。
   - 当前也没有 canonical producer 可让结算时的 Dreamer 或 Philosopher-gained Dreamer 来源保持 `POISONED`。
   - 设计同时排除通用 poison/impairment producer，并要求 resolver 从完整 accepted stream 重建。因此这些路径最多能作为纯函数构造态测试，不能按当前文本成为 accepted-stream/application 支持。
   - 必须逐项标明 canonical end-to-end、internal resolver-only 或 unsupported；不得用伪造 state 测试冒充 accepted-history 支持。

3. BLOCKER — V1/V2 base opportunity 选择和 replay 判别未冻结。

   - 当前新游戏已经使用 `first-night-task-plan-v2`，但 base Dreamer task ID 仍是 canonical `first-night-v1:DREAMER_ACTION:seat-XX`。
   - 设计同时允许 V1 base compatibility 和 V2 base execution，却没有冻结：
     - 新 application path 必须生成 V2 opportunity；
     - V1 opportunity 仅作为已接受历史/已存在 OPEN opportunity 兼容；
     - replay 如何按 exact payload schema 验证历史 V1，而不把 base task 错当为新的 V2 task；
     - opportunity parser 的 exact result union，包括 generation/source kind。
   - 仅靠 prose “区分 V1/V2”不足以保护 accepted V1 replay 和防止自动迁移。

4. BLOCKER — ledger 新 evidence 的 canonical identity/order 未定义。

   - `ledgerAdapter` 只说增加 `DREAMER_V2_DELIVERY` member，并保持已有 member ordering 不变。
   - 当前 ledger canonicalization 依赖 `evidenceKeys` rank 和 `primary()` identity。设计没有指定新 member 的固定 rank、primary key 或与现有 `DREAMER_DELIVERY` 的相对位置。
   - 当前 `ACTION_OPPORTUNITY` evidence 固定为 `opportunityVersion: "first-night-action-opportunity-v1"`，但设计要求保存 V2 action-opportunity evidence，同时又禁止修改现有 member exact shape。
   - 必须定义 V2 opportunity 到旧 evidence shape 的确切降维映射，或定义新的 evidence variant；还必须冻结 V1 evidence byte/order 不变及 V2 完整 evidence slot 顺序。

5. BLOCKER — Vortox/source effectiveness 多重证据和 base settlement validity 未完全定义。

   - `DreamerV2SourceEffectiveness` 为多 impairment 定义了排序和 primary。
   - `DreamerV2VortoxConstraint` 只携带单个 impairment，但没有规定多个 canonical matching impairments时是 fail closed、选择 code-unit 最小项，还是保存全部。
   - 当前 Mathematician resolver 对数量不等于一时失败关闭；Dreamer 设计不得让实现者自行选择另一政策。
   - `baseV2Source` 只明确 opportunity 创建时来源仍是 base Dreamer；`gainedV2Source` 则明确创建及结算时均为同一 Philosopher。base 结算时角色/座位/snapshot/revision连续性需要同样冻结。
   - Vortox 官方能力只在存活时有效。当前首夜模型没有死亡事件，因此设计可声明“当前支持历史中所有玩家仍存活”的明确前置条件；不能无说明地把“当前角色是 Vortox”永久等同于有效存活 Vortox。

6. MAJOR — private projection trust seam 仍是 prose。

   - 当前 projection 已为 Mathematician 使用显式 accepted-stream trust seam。
   - Dreamer 设计要求 V2 state-only fail closed、accepted-stream projection 成功，但没有冻结对应 internal builder 参数/brand、V1-only state behavior、V1+V2 mixed history behavior或 viewer 多 delivery判定范围。
   - 必须定义一个不可由 public caller伪造的 accepted-stream trust path，并明确 state-only 检测 V2 history 的判据。

7. MAJOR — 额外必测项没有稳定测试 ID。

   - D19-001 至 D19-074 的主体矩阵覆盖广泛。
   - 第 1138–1154 行列出的 hostile、reachability、projection 和 evidence 测试没有独立 ID，但 closeout traceability 要求每个 ID 对应测试文件、测试名和直接生产入口。
   - 应在 Round 2 为全部额外项分配稳定 ID，并标出属于 application accepted-stream、domain resolver、replay、ledger 或 projection 层。

ruleCorrectness:

- 正常 Dreamer 的“一 GOOD、一 EVIL、恰一真”正确。
- 有效 Vortox 下两项均不得为目标真实角色且保持一 GOOD、一 EVIL，正确。
- Vortox 对醉酒/中毒 Townsfolk 信息仍强制虚假，优先级正确。
- 醉酒/中毒且无有效 Vortox 时允许真或假，正确。
- 角色原生类型而非玩家阵营决定 GOOD/EVIL 侧，正确。
- Philosopher 获得能力但不成为该角色、按 Dreamer 正常时点行动，正确。
- 目标结算时当前角色为真值，历史 delivery 不因后续变化重算，正确。
- 在场角色可以作为 false candidate，规则正确。
- Traveller、registration、自由 Storyteller 选择和其他夜晚保持 out of scope，覆盖状态 `PARTIAL` 正确。
- 没有发现外部规则之间的实质冲突，也没有来源不可用问题。

contractCompleteness: `FAIL — five blocking exact-contract gaps`

implementationSafety: `FAIL — canonical reachability、replay discrimination、provenance validation和evidence ordering尚未冻结`

testCoverage: `FIX_REQUIRED — semantic breadth充分，但多个必测路径当前无法经canonical accepted history到达，额外测试也缺稳定ID`

scopeCompliance:

- 未扩展到 DAY、完整 FIRST_NIGHT、其他夜晚、Phase 2C 或通用 poison producer。
- 未修改 Mathematician event contract。
- `PARTIAL` 状态正确。
- 但不能在排除 impairment producer 的同时，把不可达 impairment 路径宣称为 application/accepted-stream 完成。

requiredFixes:

1. 定义完整 exact `ResolveDreamerV2Input`、stored validator input 和 prospective triplet input，包括 accepted events、pipeline fingerprint、完整三事件 tuple，以及 provenance 所需全部 canonical facts。
2. 为每个 drunk/poison/Vortox-impaired/gained-impaired路径标明真实 canonical producer和测试层；不可达路径改为 resolver-only或 unsupported，不得伪装成 end-to-end 支持。
3. 冻结 base task ID 仍为 accepted V1 grammar、V2 opportunity/event capability的选择规则、V1 historical opportunity replay规则和 parser exact result union。
4. 冻结 `DREAMER_V2_DELIVERY` evidence rank、primary identity、完整 V2 evidence slot顺序，以及 V2 opportunity evidence 的确切表示。
5. 冻结多个 source/Vortox impairments 的唯一处理政策；补齐 base source settlement validity和当前无死亡模型下的 Vortox alive前置条件。
6. 定义不可伪造的 accepted-stream projection trust seam及 V1/V2/mixed/multiple-delivery行为。
7. 给全部额外必测项分配稳定测试 ID 和直接生产入口。

remainingBlockers:

- `B1_EXACT_VALIDATION_INPUTS_UNDEFINED`
- `B2_CANONICAL_IMPAIRMENT_PATHS_UNREACHABLE_AS_CLAIMED`
- `B3_V1_V2_BASE_OPPORTUNITY_DISCRIMINATION_UNDEFINED`
- `B4_V2_LEDGER_EVIDENCE_ORDER_AND_IDENTITY_UNDEFINED`
- `B5_VORTOX_MULTIPLICITY_AND_BASE_SETTLEMENT_VALIDITY_UNDEFINED`

verdict: `RULE_DESIGN_FIX_REQUIRED`

RULE_DESIGN_FIX_REQUIRED
