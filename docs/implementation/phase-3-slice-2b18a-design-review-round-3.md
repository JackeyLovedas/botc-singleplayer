reviewedHead:
- `952199ff005182eb44a31de66837ba8f9e576d8d`
- branch: `main`
- local HEAD = origin/main = GitHub main HEAD
- exact-head CI: `29185767026` — `SUCCESS`
- open PRs: `0`
- worktree: clean

reviewedDesign:
- `docs/implementation/phase-3-slice-2b18a-design-round-3.md`
- SHA-256: `08d23c8cdef156edd7a90f7f1ee8725ae7b6d29c3809d967343221c1d37eebe8`
- design round: `3 / 3`
- terminal line: `READY_FOR_RULE_DESIGN_REVIEW_ROUND_3`

parentDesign:
- `docs/implementation/phase-3-slice-2b18a-design.md`
- SHA-256: `62a83e4f7161d8bf5bd9adda6c24e353edf7e0b6b4d752846e426c0f55e8cb59`

reviewRound2:
- `docs/implementation/phase-3-slice-2b18a-design-review-round-2.md`
- SHA-256: `004d80f4b806ccd108736223f32f86577864a0c355ef27cac2015d671ac6e730`

ruleEvidenceReviewed:
- `docs/rules/evidence/2B18.md`
- `docs/rules/evidence/2B18-resolved.md`
- resolved evidence SHA-256: `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/rules/evidence/2B18-prerequisite-status.md`
- `docs/implementation/phase-3-slice-2b18a-design-review-round-1.md`
- `docs/implementation/phase-3-slice-2b18a-design-review-round-2.md`
- user authorization attachment `C:\Users\wjl\.codex\attachments\a588abf2-9f5f-469f-aba9-52aa1ba3baba\pasted-text.txt`

approvedOverridesReviewed:
- `BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1`
- `BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1`
- `BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1`
- `BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1`
- no new override was introduced

externalSourcesReviewed:
- Official Mathematician oldid `3109`; live raw SHA-256 reverified as `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`
- Official Dreamer oldid `2904`; live raw SHA-256 reverified as `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`
- Official Vortox oldid `3017`; live raw SHA-256 reverified as `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`
- Official Witch oldid `2682`; live raw SHA-256 reverified as `330953478cfc8a035a49fcbf379edff35d5f50c9efa37310323ccc40b2f364ef`
- Chinese 数学家 oldid `6214`; live raw SHA-256 reverified as `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`
- Chinese 筑梦师 oldid `3046`; live raw SHA-256 reverified as `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`
- Chinese 女巫 oldid `4971`; live raw SHA-256 reverified as `3c1a75e2f88d7098e5816508d469b5ecc316fd0a721a9c3bf712799839cac0b2`
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`; SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- nightsheet confirms first-night order: Philosopher 13, Snake Charmer 36, Evil Twin 40, Witch 41, Cerenovus 42, Clockmaker 59, Dreamer 60, Seamstress 61, Mathematician 76, dawn 77
- no new material external-rule conflict was found; `RULE_READY` remains valid

productionFilesReviewed:
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/event-stream-validator.ts`
- `packages/domain-core/src/prospective-events.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/current-character-state.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/snake-charmer.ts`
- `packages/domain-core/src/witch.ts`
- `packages/domain-core/src/cerenovus.ts`
- `packages/domain-core/src/clockmaker.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/evil-twin.ts`
- `packages/domain-core/src/index.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`
- `packages/task-engine/src/index.ts`

testFilesReviewed:
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/philosopher-ability.test.ts`
- `packages/domain-core/src/snake-charmer.test.ts`
- `packages/domain-core/src/witch.test.ts`
- `packages/domain-core/src/cerenovus.test.ts`
- `packages/domain-core/src/cerenovus-replay.test.ts`
- `packages/domain-core/src/clockmaker.test.ts`
- `packages/domain-core/src/clockmaker-replay.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/seamstress.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/task-engine/src/first-night-task-planner.test.ts`

A-Q verification:

- A. `PASS` — 唯一公共计数入口冻结为 `resolveFirstNightMathematicianTrueCountFromState(stateBeforeResolution: unknown)`，其语义要求完整canonical pre-resolution state。
- B. `PASS` — 公共入口不接受caller-supplied context。
- C. `PASS` — 公共入口不接受caller-supplied ledger。
- D. `PASS` — context type、builder、validator及context resolver被要求保持module-private，不从模块或package root导出，不由application直接调用。
- E. `PASS` — next task、source、ability instance、window upper及last sequence均要求从state内部重建；base和Philosopher-gained V1/V2链必须交叉验证。
- F. `PASS` — `WitchDeathPendingMarked`被明确列为terminal allowlist例外，只生成一个`NORMAL` fact。
- G. `PASS` — `WitchIneffectiveResolved`明确只生成一个`PENDING_TRIGGER` fact，不提前升级为`ABNORMAL`。
- H. `PASS` — 设计使用显式terminal allowlist及明确的非产出事件清单；不再依赖无例外的“marker-only不产fact”泛化句。
- I. `PASS` — 无有效Vortox、source effective、正常Dreamer pair明确为`NORMAL`。
- J. `PASS` — 无有效Vortox、represented impairment、正常pair明确为`NORMAL`。
- K. `PASS` — 无有效Vortox、represented DRUNK/POISONED且pair异常明确为`ABNORMAL`，并要求匹配impairment provenance。
- L. `PASS` — `EFFECTIVE_VORTOX_PROVEN`与`VORTOX_APPLICABILITY_UNRESOLVED`均明确为`UNRESOLVED`，且cause不同。
- M. `PASS` — effective Dreamer source、无有效Vortox、pair异常明确为accepted terminal invariant violation，抛`InvalidFirstNightAbilityOutcomeFact`且不产fact。
- N. `PASS` — 统一派生入口使用terminal完整envelope与`stateBefore`；Dreamer/Vortox矩阵明确禁止读取terminal后或latest状态。
- O. `PASS` — 设计明确保持`DomainEventPayloadByType`、payload、event version、command、ID、batch、settlement、receipt、V1 replay及V2 scheduling不变。
- P. `PASS` — 不新增`MathematicianInformationDelivered`，不交付私有数字，不settle `MATHEMATICIAN_INFORMATION`；现有`ApplicationNotConfigured / retryable=true`边界保留。
- Q. `PASS` — `2B18B`和`2B19`均明确未开始且在范围外。

findings:

1. `PASS — 原BLOCKER 1已按行为和信任边界要求闭合`
   - 旧的public `{ledger, context}` resolver被删除。
   - 唯一公共入口接收unknown state，并要求hostile-safe canonical validation。
   - ledger、context、source、task、window和instance都从该state内部取得或派生。
   - internal context不可持久化、不可投影、不可由外部注入。
   - hostile state、旧式输入、altered task/last-sequence/grant/insertion及V1/V2混用测试均已列入计划。

2. `PASS — 原BLOCKER 2已闭合`
   - Witch choice、effective terminal、ineffective terminal和settlement被分开。
   - `WitchDeathPendingMarked`是明确terminal `NORMAL`例外。
   - `WitchIneffectiveResolved`是`PENDING_TRIGGER`。
   - `ScheduledTaskSettled`不重复产fact。
   - Cerenovus marker与instruction terminal也得到明确区分。

3. `PASS — 原BLOCKER 3已闭合`
   - `HistoricalVortoxApplicability`保留三态。
   - Dreamer六格结果矩阵明确。
   - 判定来源限定为terminal pre-state、历史target choice、payload、current-character revision、role tenure及已表示impairment。
   - later Vortox、source impairment或target角色变化不得改写fact。

4. `BLOCKER — round-3文件未满足“后续实现唯一权威所需的完整类型和接口”要求`
   - 文件明确声明自己不是errata，而是后续实现的唯一设计权威；用户授权也要求它“包含完整类型、接口、错误码、adapter、测试和范围”。
   - 但关键安全对象仍写成占位符：

   ```ts
   type InternalResolvingMathematicianContext = { /* canonical fields */ };
   ```

   - `FirstNightAbilityOutcomeFact`引用了`AbilityOutcomeEvidenceReference`，但round-3文件没有定义该判别联合的完整字段、exact-key合同或各kind所需ID/revision字段。
   - public resolver返回`MathematicianCountResolution`，但round-3文件没有定义其`RESOLVED`/`UNRESOLVED`判别联合、exact字段和clone/runtime-shape合同。
   - `FirstNightAbilityInstanceProvenance`包含`abilityInstanceId`，但round-3唯一权威没有冻结base、V1、V2 canonical ability-instance ID构造；这些构造只存在于已被声明不再是实现权威的round-2设计。
   - applicable override exact-shape载体及其四个literal字段在round-3中也没有定义。
   - 因此implementer若只遵循round-3，必须自行发明context字段、result shape、evidence-reference shape和ability-instance ID格式；若回读round-2补齐，则违反“round-3是唯一实现权威”的明示边界。
   - 这不是新的BOTC规则冲突，但会直接影响own-instance exclusion、public API导出、hostile exact validation、replay determinism和rule-to-test traceability，不能作为非阻塞文档瑕疵处理。

ruleSemantics:
- 四个批准override保持不变。
- 外部规则、resolved evidence与round-3的Witch/Dreamer/Vortox行为矩阵之间没有发现新实质冲突。
- `RULE_READY`仍成立。
- A-Q要求的三个原设计BLOCKER在行为层面全部关闭。
- 当前失败原因是第三轮设计作为“唯一实现权威”仍含未定义或占位的安全关键类型合同，无法在不自行补充设计判断的情况下实现。

requiredFix:
- 将`InternalResolvingMathematicianContext`写成完整、exact的内部字段合同。
- 在round-3文件内完整定义`AbilityOutcomeEvidenceReference`。
- 在round-3文件内完整定义`MathematicianCountResolution`的`RESOLVED`和`UNRESOLVED`联合。
- 冻结base、Philosopher-gained V1/V2 ability-instance ID格式。
- 冻结四项override exact-shape载体。
- 上述内容必须直接位于round-3唯一权威内，不能仅引用round-2补全。

remainingBlockers:
- `docs/implementation/phase-3-slice-2b18a-design-round-3.md`仍不是可独立执行的完整设计：四组安全关键类型/identity合同缺失或为占位符。

RULE_DESIGN_FIX_REQUIRED
