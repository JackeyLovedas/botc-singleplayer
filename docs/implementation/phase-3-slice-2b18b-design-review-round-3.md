# Phase 3 Slice 2B18B — Design Round 3 独立规则设计审查

- `reviewedHead`: `0c5cac5d2db26d70a7983bf3790637c9f2ac252d`
- `reviewedCI`: GitHub Actions run `29243702315`, exact `headSha=0c5cac5d2db26d70a7983bf3790637c9f2ac252d`, `completed/success`
- `reviewTimestamp`: `2026-07-13T10:56:22.7809833Z`
- `reviewedDesign`: `docs/implementation/phase-3-slice-2b18b-design-round-3.md`
- `reviewedDesignSha256`: `066be05f5ee8c0fccb83b00fd8471e439e7e6d2c8c8366af8c86aebceac0a792`
- `authorization`: `USER_AUTHORIZED_2B18B_DESIGN_ROUND_3_REPLAY_ADAPTER`
- `designRound`: `3 / 3`
- `reviewScope`: 仅审查2B18B Round 3是否在不改变规则、Option A或既有模拟策略的前提下，完整关闭Round 2剩余的逐事件回放合同与terminal-event closed-union两个BLOCKER；不审查或授权尚不存在的生产实现。

## 独立读取的规则、授权与控制证据

- 用户附件：Option A `OPTION_A_LEGACY_V1_GAINED_MATHEMATICIAN_ONLY_WITHOUT_BASE_TASK`；Round 3授权 `USER_AUTHORIZED_2B18B_DESIGN_ROUND_3_REPLAY_ADAPTER`。
- `AGENTS.md`；`docs/agent-loop/AUTOPILOT_PROMPT.md`、`AUTOPILOT_STATE.json`、`CURRENT_TASK.md`、`PROJECT_STATE.md`、`REVIEW_PROTOCOL.md`。
- `project-handoff/00-README-FIRST.md`及其规定顺序中的`PROJECT_HANDOFF.md`、`PRODUCT_SCOPE.md`、`RULES_BASELINE.md`、`ARCHITECTURE_INPUT.md`、`IMPLEMENTATION_GUARDRAILS.md`、`OPEN_RISKS.md`、`DEVELOPMENT_ROADMAP.md`。
- 相关规则/测试：`rules/10-night-order.md`、`11-drunk-and-poison.md`、`12-information-model.md`、`15-character-and-alignment-changes.md`、`16-storyteller-decisions.md`、`18-sects-and-violets-roles.md`、`19-sects-and-violets-demons.md`、`20-character-interactions.md`、`24-rule-priority.md`、`30-v2.1-defect-resolution.md`、`tests/25-rule-test-cases.md`、`tests/31-test-coverage-report.md`。
- `docs/rules/USER_OVERRIDES.md`、`docs/rules/evidence/2B18.md`、`2B18-resolved.md`、`2B18B.md`、`2B18B-resolved.md`、`docs/rules/ROLE_COVERAGE_MATRIX.md`。
- 历史设计与审查：`phase-3-slice-2b18b-design.md`、`phase-3-slice-2b18b-design-review-round-1.md`、`phase-3-slice-2b18b-design-review-round-2.md`。
- 外部固定来源：官方Mathematician oldid `3109`、Philosopher `2421`、States `1039`、Vortox `3017`；中文数学家 `6214`、哲学家 `5125`、涡流 `6198`；官方nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`。固定nightsheet实时复核SHA-256仍为`99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`，首夜Mathematician位置76、Dawn位置77，相关角色顺序与证据一致。

## 独立读取的实际代码与包边界

- `packages/domain-core/src/event-applier.ts`、`rebuild.ts`、`event-stream-validator.ts`、`domain-batch-semantics.ts`、`first-night-ability-outcome-ledger.ts`、`game-state.ts`、`events.ts`、`command.ts`、`first-night-task-plan.ts`、`philosopher-ability.ts`、`seamstress.ts`、`index.ts`。
- `packages/application/src/game-application-service.ts`、`command-result.ts`、`ports/command-commit-store.ts`、`index.ts`。
- `packages/projections/src/index.ts`。
- 根`tsconfig.json`、domain/application `package.json`、`packages/test-harness/src/architecture-boundary.test.ts`及ESLint配置。

## findings

1. **授权、锚点与范围一致。** 本地`main`、`origin/main`和审查锚点均为`0c5cac5d...`；工作区clean；开放PR为0；精确HEAD CI成功。Round 3文件hash、parent Round 2 hash、resolved evidence hash和终止行均匹配。没有生产代码或测试变更，没有功能分支，2B19未开始。
2. **规则语义未改变。** 官方/中文来源继续支持数学家“自黎明起、因其他角色能力而异常工作的玩家数量”、不检测自身能力异常、醉/毒本身不计但造成异常结果可计，以及有效涡流下镇民信息必须为假。Round 3只适配回放架构并补齐closed terminal literal；没有新增/修改`USER_OVERRIDES`，Option A仍是透明的实现支持边界。
3. **Layer A合同闭合。** 唯一命令决策入口只接收完整accepted event stream与`taskId`，执行dense/stream validation、rebuild、canonical inventory/Option A、ledger/window/count/effectiveness/Vortox/candidate/decision；不接受caller-created state、ledger、context、count或candidate，且明确禁止在replay调用。
4. **Layer B合同闭合。** 只在append前接收完整prior stream与严格两事件pair；独立重跑Layer A，精确重建并比较31-key delivery与settlement，验证metadata/order/batch/prospective full stream/rebuild；不信任application的READY对象。
5. **Layer C合同闭合且适配现有调用链。** 输入严格为`stateBefore + current delivery`，不要求完整stream、EventStore、CommandStore或未来settlement；不调用A/B，不生成新选择，只重算并校验已存在delivery。现有`validateDomainEventStream → validateDomainBatchSemantics → applyDomainEvent`签名无需修改。内部validator不从package root导出；现有公开`applyDomainEvent`只是通用事件应用边界，间接执行C仍不会返回或生成新的count decision，因此不构成新的public state resolver。
6. **A/C共享同一纯核心。** 两个内部builder产出同一exact branded context，由唯一`deriveMathematicianResolutionFromCanonicalContext`计算。impairment envelope所缺的event ID/sequence由明确的rebuildable、非权威、非投影provenance cache补足；A从完整stream、C从canonical pre-event replay state得到相同上下文。七项差分测试冻结决策、candidate、source、impairment/Vortox和Option A等价。
7. **replay upper正确。** A使用最后prior event sequence；C要求`stateBefore.lastEventSequence === delivery.eventSequence - 1`，并要求window end等于该pre-event sequence。当前delivery/fact不进入自身窗口，settlement不作为upper，C不扫描未来历史。
8. **逐事件顺序正确。** 成功批次严格为delivery后settlement。delivery在task仍PENDING/next时由C校验并保存；随后现有outcome-ledger wrapper从`stateBefore + delivery`派生唯一Math fact；settlement看到delivery和fact后才推进task。settlement不重跑A/B且不产生第二fact。结构batch validator拥有pair并验证同时性/顺序，而event applier不需要未来settlement，实际调用可实现且非递归。
9. **terminal closed union完整。** 设计直接冻结`TerminalAbilityOutcomeEventType`加入`MathematicianInformationDelivered`，并要求所有terminal set、exact event union、event→task/role map、SOURCE_EVENT parser/validator、derivation/clone/replay/exhaustive switch同步使用该literal；映射精确为`MATHEMATICIAN_INFORMATION`/`mathematician`。`ScheduledTaskSettled`明确不进入terminal union且不派生fact。
10. **evidence合同闭合。** 新`MATHEMATICIAN_DELIVERY`为七键exact variant，以`deliveryId`为identity；最低证据、base/gained V1/V2、source impairment、Vortox各分支的required/forbidden矩阵和13-slot顺序完整。gained information task只引用原Philosopher opportunity，不伪造Math terminal action opportunity。SOURCE_EVENT、TASK、角色/tenure、grant/insertion、impairment envelope、Vortox、delivery/fact均有精确cross-link。
11. **incoming与stored职责分离。** incoming C只验证pre-event state+当前event；stored-chain validator只消费完整trusted replay生成的checkpoint，验证post-delivery、adjacent settlement、ledger fact和final-state不变性。旧state-only projection遇到Math历史fail closed；安全player/AI路径从完整stream重放并逐checkpoint验证后仅投影`{count:selectedCount}`。
12. **Option A在A/B/C一致。** 同一六值classifier在完整canonical plan/recorded insertion链验证后使用。V1 base-only与gained-only支持；V1 base+gained在command端为receipt-free、retryable `ApplicationNotConfigured`且无event/进度/version变化，在replay已有delivery时抛`DomainError`；V1不迁移/重排。V2 base-first、later可读earlier、earlier不读future保持不变。
13. **exact-shape与结果/错误合同足够。** 31个delivery enumerable keys复核无缺漏；command为两键；internal result、失败stage/receipt映射、canonical IDs、source/effectiveness/Vortox unions、state、private-view biconditional与deterministic ordering均冻结。未要求implementer自行选择语义。
14. **测试追溯完整。** Round 3保留原140项与Option A 45项，并新增用户要求的40项，合计225项独立断言；覆盖A/C差分、逐事件应用、upper、API export边界、terminal type/evidence、Option A、accepted replay、projection和跨平台回归。HRS不可达语义seam明确不伪装为accepted integration。
15. **范围与覆盖诚实。** 仅first night、固定12人、无Traveller；general dawn reset、other-night、通用poison engine、自由Storyteller数字选择、V1迁移、2B19均明确out of scope。Mathematician保持`PARTIAL`，未标`COMPLETE`。

## Round 2两个BLOCKER关闭结论

1. **逐事件回放/Layer A互斥BLOCKER：CLOSED。** Round 3不再要求replay/event-applier取得future settlement或调用完整stream Layer A。A、B、C职责、签名、调用顺序、共享pure core、incoming/stored validator和现有全局签名全部独立冻结，可按当前代码路径实现，无递归合同。
2. **TerminalAbilityOutcomeEventType缺失Math literal BLOCKER：CLOSED。** 新literal、完整union、SOURCE_EVENT、terminal map/set/switch、Math evidence adapter、fact derivation、stored replay与测试全部直接定义；无需implementer推断。

## remainingBlockers

`[]`

设计已满足用户列出的15项Round 3审查条件，也没有外部规则冲突、来源不可用、范围扩张或需要Design Round 4的缺口。该结论仅解除设计门禁；生产实现仍须由sole writer在控制器更新`implementationAuthorized=true`后开始，并继续受完整测试、CI和最终双审查约束。

RULE_DESIGN_PASS
