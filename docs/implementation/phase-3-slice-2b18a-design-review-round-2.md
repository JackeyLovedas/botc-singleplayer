reviewedHead:
- `f2929b016b5bf3d052bed670f79d0751f3f0e1a2`
- branch: `main`
- exact-head CI: `29185053326` — `SUCCESS`
- worktree: clean

reviewedDesign:
- `docs/implementation/phase-3-slice-2b18a-design.md`
- SHA-256: `62a83e4f7161d8bf5bd9adda6c24e353edf7e0b6b4d752846e426c0f55e8cb59`
- design round: `2/2`

sourcesReviewed:
- `docs/implementation/phase-3-slice-2b18a-design-review-round-1.md`
- `docs/rules/evidence/2B18.md` — `9f7564f4fe5be6399ec10ebc7475ab07f4e49c5aa5bcdb6752af61a928fdfa1a`
- `docs/rules/evidence/2B18-resolved.md` — `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`
- `docs/rules/USER_OVERRIDES.md` — `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`
- `docs/rules/evidence/2B17-2.md`
- `docs/implementation/phase-3-slice-2b17-2-design.md`
- `docs/implementation/phase-3-slice-2b17-2-status.md`
- `docs/implementation/phase-3-slice-2b17-3-status.md`
- `docs/rules/evidence/2B18-prerequisite-status.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md` — `ccc2e66f9bd19c4a9c7a24d16406815a2f8fd17ba499fd818bf7c5c08d74dc20`
- Official Mathematician oldid 3109 — live raw hash reverified: `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`
- Official States oldid 1039 — `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`
- Official Vortox oldid 3017 — `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`
- Official Philosopher oldid 2421 — `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`
- Chinese Mathematician oldid 6214 — `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e`
- Official nightsheet commit `3d6d930a9e600321f93b2567a2e88948a675bc1e` — `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`

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

round1FixVerification:

1. `ResolvingMathematicianContext`：**部分修复，未闭合**
   - builder 已规定从完整 pre-resolution `GameState` 验证 next task、plan、progress、V1/V2 insertion、grant、opportunity、seat、revision和upper boundary。
   - 但 public resolver 仍只接收结构化 `{ ledger, context }`，无法证明 context 确由 builder 产生。

2. unresolved pipeline：**已闭合**
   - 已冻结 validate → window/future → own exclusion → retained qualifying abnormal → player dedup → redundant unresolved 的顺序。
   - 已要求 own/future abnormal 不得令 unresolved 冗余，并补充直接测试。

3. 错误码与统一接入：**已闭合**
   - 已列出新增 `DomainErrorCode`、触发边界和 hostile-exception 转换规则。
   - 已要求 domain-core public export。
   - 已规定 event-applier 只通过一个 derive 入口，并冻结 validation/derive/next-state/append 顺序。

findings:

1. **P1 — resolver仍信任可伪造的结构化context，核心provenance缺口未完全修复**

   `buildResolvingMathematicianContext(stateBeforeResolution)` 的验证要求本身充分，但 `ResolvingMathematicianContext` 是普通导出的结构化对象。TypeScript类型和“唯一builder”不是运行时信任边界。

   Public resolver签名仍为：

   ```ts
   resolveFirstNightMathematicianTrueCount({
     ledger,
     context
   })
   ```

   context只携带派生后的source、task ID、instance、window和roster；它不携带供resolver重新核对的task plan、progress、insertion、grant、opportunity或`state.lastEventSequence`。`validateResolvingMathematicianContextShape`以及context/ledger anchor equality只能证明结构自洽，不能证明：

   - task真实存在并且是当前next unsettled task；
   - source、seat和instance来自该task；
   - gained instance来自唯一合法grant/insertion/opportunity；
   - end sequence等于真实pre-resolution state的last sequence；
   - context确由builder生成，而不是调用者手工构造。

   因此调用者仍可构造结构合法但伪造的context，改变own-instance exclusion或时间上界。这正是第1轮P1风险的剩余部分。

   安全设计应让public resolver：

   - 直接接受`stateBeforeResolution`并在内部调用builder、从state读取ledger；或
   - 同时接受state和context，并重新build expected context后用canonical equality核对。

   仅导出builder并要求调用方遵守，不能构成fail-closed保证。此修复不需要改变accepted event、payload或batch。

2. **P2 — Witch terminal与“marker-only不产fact”存在文字冲突**

   设计要求effective Witch在pending marker时生成`NORMAL` fact，但统一事件列表随后又说“marker-only不产fact”。当前effective Witch的terminal事件正是`WitchDeathPendingMarked`。

   必须显式冻结：

   - `WitchDeathPendingMarked`是本Slice允许产fact的terminal exception；
   - `CerenovusMadnessMarked`等非terminal marker-only事件不产fact。

   否则实现者可能按“marker-only不产fact”跳过effective Witch结果。

3. **P2 — Dreamer/Vortox条件需要消除歧义**

   设计写为“effective或无法可靠证明Vortox状态时=`UNRESOLVED`”。如果“effective”被解释为Dreamer source effective，则会把正常、无Vortox且pair正确的Dreamer错误标成`UNRESOLVED`。

   必须明确为：

   - 无有效Vortox且正常pair：`NORMAL`；
   - represented impairment但pair仍正常：`NORMAL`；
   - represented impairment导致pair异常：`ABNORMAL`；
   - 在该历史时点证明有effective Vortox，或Vortox适用性无法可靠证明：`UNRESOLVED`；
   - 只能使用terminal envelope的pre-event historical state，不得读取后来最新状态。

confirmedPasses:
- 四项override仍严格标为固定12人模拟策略，不伪装成官方规则。
- 原`2B18.md`及resolved evidence未被篡改。
- first-night window、player dedup、instance级own exclusion、duplicate temporal顺序均符合批准策略。
- impairment本身不计；impaired correct为`NORMAL`。
- 已证明的Vortox错误为`ABNORMAL`。
- Witch impaired路径保持`PENDING_TRIGGER`，不提前计数。
- 当前accepted terminal payload足以支持已列角色；Dreamer/Vortox不足时采用`UNRESOLVED`。
- ledger保持derived state，不进入player/AI/public projection。
- `DomainEventPayloadByType`、payload、event version、command、batch、receipt、settlement、V1 replay和V2 scheduling均声明不变。
- `MATHEMATICIAN_INFORMATION`仍为`ApplicationNotConfigured`、retryable、无receipt/event/settlement/version变化。
- 2B18B和2B19均明确在范围外。
- coverage保持`PARTIAL`，没有冒充完整Mathematician实现。

requiredFixes:
1. 将public count resolver绑定到真实`stateBeforeResolution`；不得只信任调用者提供的结构化context。
2. 增加“手工构造、结构完全合法但并非由当前state生成的context”必须被resolver拒绝的直接测试。
3. 明确`WitchDeathPendingMarked`是可生成`NORMAL` fact的terminal事件，不受marker-only排除。
4. 将Dreamer/Vortox条件改写为无歧义的历史状态判定规则。

ruleSemantics:
- 外部规则和批准override之间没有新冲突。
- `RULE_READY`仍然成立。
- 本轮问题是设计信任边界及两处可导致错误实现的文字歧义。
- 所有问题都可在不改变accepted event contract的情况下修复。
- 由于这是design round `2/2`，后续是否转换为流程级`HUMAN_BLOCKED`应由controller按repair-round上限执行；reviewer不伪造通过结论。

remainingBlockers:
- public resolver尚不能证明context绑定当前canonical state。
- Witch terminal marker例外未明确。
- Dreamer/Vortox条件仍有可导致错误分类的歧义。

RULE_DESIGN_FIX_REQUIRED
