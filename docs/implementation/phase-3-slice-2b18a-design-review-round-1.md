reviewedDesign:
- `docs/implementation/phase-3-slice-2b18a-design.md`
- SHA-256: `caf7dc9d7d30867f596070f419afaf150f5d9be83028cdad99c783cd8b097ada`

sourcesReviewed:
- `docs/rules/evidence/2B18.md` — SHA-256 `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`
- `docs/rules/evidence/2B18-resolved.md` — SHA-256 `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`
- `docs/rules/USER_OVERRIDES.md` — SHA-256 `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`
- `docs/rules/evidence/2B17-2.md` — SHA-256 `ced6042dcfcbb2e14d86ef97c15b4c8bae2a263bd8aa30332a16b54683143eab`
- `docs/implementation/phase-3-slice-2b17-2-design.md` — SHA-256 `773c6df23cf40e83f9c1facd79719e7d992b3aa4cc6946910a78fe7bf5d7f9ed`
- `docs/implementation/phase-3-slice-2b17-2-status.md` — SHA-256 `0a9a49e29c009a55c626a5f1ff798a8aebd404ae4286c18f73c10e8798e8f0df`
- `docs/implementation/phase-3-slice-2b17-3-status.md` — SHA-256 `aac057144f0f0e3049e2ee35e2f06468acbdbd5a6f3295e689c72db9f5a8ca4a`
- `docs/rules/evidence/2B18-prerequisite-status.md` — SHA-256 `f29f4788f85af22fdd2cfcb12a4619c9acdae12f3fa258c087b271b0a559bdda`
- `docs/rules/ROLE_COVERAGE_MATRIX.md` — SHA-256 `ccc2e66f9bd19c4a9c7a24d16406815a2f8fd17ba499fd818bf7c5c08d74dc20`
- Official Mathematician oldid 3109 — live raw hash verified as `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`
- Official States oldid 1039 — `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`
- Official Vortox oldid 3017 — `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`
- Official Philosopher oldid 2421 — `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`
- Chinese Mathematician oldid 6214 — `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e` — `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`

productionFilesReviewed:
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/event-stream-validator.ts`
- `packages/domain-core/src/prospective-events.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/canonical-data.ts`
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
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/task-engine/src/first-night-task-planner.test.ts`

findings:

1. **P1 — 当前解析者的能力实例无法由设计中的 resolver 输入证明**

   设计第17行要求 V1/V2 ability instance 与任务、插入、grant、player、seat、role 和 revision 交叉验证，第64行又要求非法 task-instance/provenance 抛出 `DomainError`；但第44行的 pure resolver 输入只有 ledger、原始 source/instance、window、roster 和 override versions。

   2B18A 明确不生成 Mathematician delivery fact，因此 ledger 中没有当前解析者的可信身份事实。仅凭调用者提供的 instance，无法证明：

   - base instance 对应真实、未结算且当前应执行的 `MATHEMATICIAN_INFORMATION` task；
   - gained V1/V2 instance 对应唯一 insertion、grant、opportunity、source seat 和 revision；
   - source 确实是当前任务持有者；
   - upper boundary 确实是该解析开始前的 `state.lastEventSequence`；
   - task 不是 future、已结算、非 next 或伪造 task ID。

   这会直接削弱 own-instance exclusion 和 duplicate-holder temporal policy，并使伪造 source/instance/window 绕过 fail-closed 校验成为可能。现有 accepted payload 无需改变即可修复。

2. **P1 — `redundantUnresolvedFacts` 的判定顺序不充分**

   第31行只说同玩家已有 qualifying `ABNORMAL` 时，其 `UNRESOLVED` 可视为冗余，但没有冻结“qualifying”的计算顺序。必须明确只有在完成：

   - window lower/upper filtering；
   - future exclusion；
   - resolving-own-instance exclusion；
   - `ABNORMAL && causedByAnotherCharacterAbility` 校验

   之后仍保留的同玩家异常事实，才能令该玩家的 unresolved fact 冗余。

   否则，若同玩家唯一的 abnormal fact 是当前自身实例、future fact 或窗口外 fact，resolver 可能错误返回可信整数而非 `UNRESOLVED`。

3. **P2 — 错误码与模块接入契约尚未冻结**

   设计只明确命名了 `DuplicateFirstNightAbilityOutcomeFactConflict`，其余非法 ledger、anchor、fact、instance、resolving context、window、roster 和 sequence 情形只笼统写为 `DomainError`。同时未明确新模块从 `packages/domain-core/src/index.ts` 导出，以及 applier 中统一派生 hook 的调用/返回顺序。

   这不足以保证 hostile input 始终转换为稳定的领域错误，而不是泄漏 `TypeError` 或在各 event branch 中产生不一致行为。

confirmedPasses:
- 四项 override 都明确标注为固定单机模拟策略，没有伪装成官方规则，也没有覆盖外部规则文字。
- 原始 `2B18.md` 字节与 SHA-256 未变。
- `FirstNightInitialized` exclusive lower bound 和 resolution 前 inclusive upper bound符合批准记录；当前自身结果排除在窗口外。
- 设计按 `sourcePlayerId` 去重，不按 incident 计数。
- own exclusion 采用 player + instance，而非全局 `mathematician` role ID。
- V2 base-first、gained seat/task-ID 顺序，以及 later-may-observe-earlier/no-future/no-recompute 语义正确。
- impairment event 本身不产生 fact；impaired but correct 归类 `NORMAL`。
- Vortox 已证明导致的错误信息归类 `ABNORMAL`。
- Dreamer + Vortox 缺少历史约束字段时归类 `UNRESOLVED`，没有从后续最新状态重算；派生发生在该 envelope 的 pre-event state，方向正确。
- Witch effective marker 为 `NORMAL`，impaired path 为 `PENDING_TRIGGER`，不提前计数或阻塞。
- terminal event 选择与现有 batch 顺序相容：前序 choice/pair/marker/spend 已进入 pre-event state，settlement 尚未发生。
- Snake Charmer before/after payload、Clockmaker stored correct/selected/effectiveness/Vortox、Seamstress stored comparison/cause 均足以安全分类。
- Cerenovus instruction terminal 可通过 pre-state choice/marker 链恢复 source；无 impaired canonical event 时不伪造 fact。
- accepted event type、payload、batch、receipt、settlement、V1 replay 和V2 scheduling均声明保持不变。
- ledger 是 derived `GameState`，设计禁止进入 player/AI/public projection。
- Mathematician settlement/delivery/private number、2B18B 和2B19均未实现。
- coverage 保持 `PARTIAL`，没有错误标记 `COMPLETE`。

requiredFixes:
1. 新增 exact `ResolvingMathematicianContext` 及 builder/validator。它必须从当前 pre-resolution canonical `GameState` 验证并固化：
   - game/window anchor 与 `endEventSequence === state.lastEventSequence`；
   - 当前 next、pending、unsettled `MATHEMATICIAN_INFORMATION` task；
   - base task source，或唯一匹配的 V1/V2 insertion、grant、opportunity、source seat、role、revision、scheduling version；
   - resolving player、seat和 canonical ability instance。
   Pure resolver只能接受该已验证 context，或直接接受并验证上述 canonical collections；不得接受无法验证的裸 source/instance/window。
2. 增加伪造 base/gained instance、错误 seat/task/grant/opportunity/revision/version、非 next、已 settled、伪造 upper bound 和 V1/V2混代测试。
3. 明确 unresolved pipeline，并增加：
   - excluded-own abnormal + 同玩家 unresolved；
   - future abnormal + earlier unresolved；
   - window外 abnormal + 窗口内 unresolved；
   - 当前玩家其他 instance abnormal；
   - 另一持有者 earlier abnormal；
   - retained qualifying abnormal + 同玩家 unresolved
   的直接回归测试。
4. 冻结所有新增领域错误码及触发条件；确保 hostile/accessor/proxy/helper异常统一转成指定 `DomainError`。
5. 明确新模块由 domain-core `index.ts` 导出，并规定 event-applier 在现有 payload/state 验证成功后、返回新状态前调用单一派生函数；各事件分支不得复制不同版本的 ledger 逻辑。

ruleSemantics:
- `RULE_READY` 证据本身成立，没有发现新的外部规则冲突。
- 14项重点规则语义均与批准 override 和外部来源一致。
- 当前问题属于设计完整性和 canonical provenance 验证缺口，不要求改变任何 accepted event payload、batch 或历史事件。
- 修复后仍必须维持 `PARTIAL`。

remainingBlockers:
- 未定义可信的 resolving Mathematician context/provenance。
- unresolved redundancy 顺序尚未冻结。
- 新模块错误码和接入边界尚未完整定义。
- 在这些设计缺口修复并重新独立审查前，不得授权实现。

RULE_DESIGN_FIX_REQUIRED
