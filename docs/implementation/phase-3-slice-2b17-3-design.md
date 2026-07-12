# Phase 3 Slice 2B17.3 — Legacy Philosopher No-Insertion Choice Compatibility

依据：用户批准的热修复合同、已接受的 Slice 2B17.2 V1/V2 边界及当前代码。`ruleSemanticsChanged=false`；本设计不授权恢复 2B18 或开始 2B19。

## rootCause

`GameApplicationService` 的 legacy 前置门禁只拒绝 `first-night-task-plan-v1` 上具有首夜任务映射的选择。无映射选择通过门禁后，应用层仍无条件调用 `createFirstNightTaskInsertedV2Payload`。

该领域构造器当前先要求 `first-night-task-plan-v2`，之后才调用 `firstNightTaskTypeForPhilosopherChoice`。因此 V1 + Artist、Barber、Philosopher 等本应无插入的合法选择，在构造器能够返回 `undefined` 前错误抛出 V2 plan incompatibility。PR #21 自动审查 `discussion_r3565486420` 指出的根因与当前代码一致。

## legacyNoInsertionContract

在 accepted V1 计划上选择无首夜任务映射的合法善良角色时：

- 正常产生 `PhilosopherAbilityChosen`、`PhilosopherAbilityGranted`、可选 `AbilityImpairmentApplied` 和 `ScheduledTaskSettled`。
- 不产生 `FirstNightTaskInserted` 或 `FirstNightTaskInsertedV2`。
- 正常关闭 Philosopher opportunity，并以既有 chosen settlement outcome 结算 `PHILOSOPHER_ACTION`。
- 一个命令批次只使 `gameVersion` 增加一次，并写入 accepted receipt。
- 相同 `commandId` 重试返回既有 accepted 结果，不追加事件或版本。
- 不改变 grant ID、choice/grant/impairment/settlement payload、投影或 V1 历史。

## legacyMappedRoleFailClosedContract

V1 计划选择以下 mapped 角色时继续在应用前置门禁失败：

- `snake_charmer`
- `clockmaker`
- `dreamer`
- `seamstress`
- `mathematician`

结果必须保持：

- `status=failed`
- `code=ApplicationNotConfigured`
- `failureStage=first-night-role-action`
- `retryable=true`
- 零事件、零 receipt、零 `gameVersion` 变化
- Philosopher opportunity 保持 `OPEN`

不得生成 V1 insertion、V2 insertion，或自动迁移计划。

## v2UnchangedContract

- V2 + 无映射角色继续正常 chosen/grant/[impairment]/settlement，且无 insertion。
- V2 + mapped 角色继续产生精确 `FirstNightTaskInsertedV2`。
- V2 payload、task ID、catalog/signature/provenance、position、base-first、source-seat/task-ID tie-break 均不改变。
- 五个 mapped 位置仍为 Snake Charmer 400、Clockmaker 800、Dreamer 900、Seamstress 1000、Mathematician 1100。
- `MINION_INFO` 200 与 `DEMON_INFO` 300 不被 gained task 越过。
- V1/V2 insertion 与 plan generation 仍禁止混用。

## domainBuilderOrdering

`createFirstNightTaskInsertedV2Payload` 必须严格按以下顺序执行：

1. 仅从 `input.choice.chosenRoleId` 调用 `firstNightTaskTypeForPhilosopherChoice`。
2. 映射为 `undefined` 时立即返回 `undefined`。
3. 只有 mapped 输入才要求 `taskPlanVersion === first-night-task-plan-v2`。
4. 随后才读取并验证 catalog definition、choice/grant 绑定以及其余 V2 合同。
5. mapped 输入的任何 plan、catalog、grant 或 provenance 异常继续 fail closed。

no-op 路径不得读取 `taskCatalogSnapshot.definitions` 或 grant insertion 字段。应用层可先解析 mapping 并跳过无意义调用，但这只是优化；不得替代领域构造器自身的安全顺序和直接单元测试。

## applicationBehavior

保留现有 V1 mapped-role 前置门禁。V1 no-mapping 选择进入既有 CHOOSE 流程后，由安全构造器返回 `undefined`，应用只省略 insertion event，其余 choice、grant、duplicate impairment、settlement 和 receipt 流程不分叉。

应用层若增加同一 mapping 预判，必须复用 `firstNightTaskTypeForPhilosopherChoice`，不得维护第二份角色表；领域构造器仍必须独立满足 no-op 合同。现有错误分层和 retryability 不变。

## eventAndBatchExpectations

- V1/V2 no-mapping、无 duplicate：`Chosen → Granted → Settled`。
- V1/V2 no-mapping、有 duplicate：`Chosen → Granted → AbilityImpairmentApplied → Settled`。
- V2 mapped：`Chosen → Granted → [AbilityImpairmentApplied] → FirstNightTaskInsertedV2 → Settled`。
- V1 mapped：不创建 batch。
- 同批事件共享 command/batch/version metadata，sequence 连续；prospective batch validation 与最终 stream rebuild 均通过。
- `ScheduledTaskSettled` 是关闭 Philosopher opportunity 和推进任务前缀的唯一既有事实，不新增兼容事件。
- atomic append 失败不得留下部分事件或 receipt。
- V1 accepted-history fixture 必须是完整、可 rebuild、可继续写入的 validated event stream；成功路径不得使用只读 seed store 假装追加成功。

## regressionTests

1. V1 + Artist：V2 builder 返回 `undefined`，不抛错。  
2. V1 + Barber：返回 `undefined`，不抛错。  
3. V1 + Philosopher：返回 `undefined`，不抛错。  
4. V2 + Artist：返回 `undefined`。  
5. V2 + Barber：返回 `undefined`。  
6. V1 + Snake Charmer：mapped 后明确拒绝非 V2 plan。  
7. V1 + Clockmaker：mapped 后明确拒绝非 V2 plan。  
8. V2 + Clockmaker：产生逐字段精确 V2 payload。  
9. mapped V2 的 malformed plan/catalog/grant/provenance 继续 fail closed。  
10. no-op 输入用抛错 getter/等价访问探针证明不读取 catalog definition 或 grant insertion 字段。  
11. 构造并验证完整 accepted V1 history，正常命令入口选择不在场 Artist 成功。  
12. 该命令事件类型精确为 `Chosen, Granted, Settled`。  
13. 不产生 `FirstNightTaskInserted`。  
14. 不产生 `FirstNightTaskInsertedV2`。  
15. 不产生 `AbilityImpairmentApplied`。  
16. Philosopher opportunity 关闭。  
17. `PHILOSOPHER_ACTION` 以既有 outcome settled。  
18. 多事件 batch 只增加一次 `gameVersion`。  
19. 下一任务保持 V1 `MINION_INFO`。  
20. 写入 accepted command receipt。  
21. 同 `commandId` 重试返回同一结果且无追加。  
22. 追加后完整 V1 stream 通过 `validateDomainEventStream` 与 rebuild。  
23. batch semantics、连续 sequence、原子提交通过。  
24. 使用合法确定性 fixture 选择当前在场且无映射的善良角色（优先 Flowergirl）成功。  
25. duplicate fixture 产生一条精确 `AbilityImpairmentApplied`。  
26. duplicate fixture 不产生任一 insertion event。  
27. 原角色持有者获得既有 `PHILOSOPHER_CHOSEN_DUPLICATE` DRUNK marker。  
28. choice、grant、settlement 顺序和绑定正常。  
29. duplicate V1 history 追加后 replay/rebuild 通过。  
30. player/AI/private projection 不新增 plan、insertion、grant 或 DRUNK 真值泄漏，既有可见边界不变。  
31. V1 + Snake Charmer 保持统一 fail-closed 断言。  
32. V1 + Clockmaker 保持统一 fail-closed 断言。  
33. V1 + Dreamer 保持统一 fail-closed 断言。  
34. V1 + Seamstress 保持统一 fail-closed 断言。  
35. V1 + Mathematician 保持统一 fail-closed 断言。  
36. V2 + Artist 成功并且无 insertion。  
37. V2 + mapped 角色继续产生唯一 `FirstNightTaskInsertedV2`。  
38. V2 gained Snake Charmer 仍位于 400。  
39. V2 gained Clockmaker 仍位于 800。  
40. V2 gained Dreamer 仍位于 900。  
41. V2 gained Seamstress 仍位于 1000。  
42. V2 gained Mathematician 仍位于 1100 且执行仍 fail closed。  
43. 同位置 base-first、gained 按 source seat 后按 task-ID code-unit 的 24 permutations 结果不变。  
44. `MINION_INFO`、`DEMON_INFO` 继续先于全部 gained mapped tasks。  
45. 既有 accepted V1 insertion fixture、task ID、旧顺序和 replay 逐值不变。  
46. V1-plan/V2-insertion、V2-plan/V1-insertion及 mixed batch 继续拒绝。  
47. 全部既有测试通过且无测试删除、跳过或断言弱化。  
48. Ubuntu 与 Windows CI 对 builder、应用、replay、projection 和 ordering 回归均通过。  

## unchangedRuleSemantics

`ruleSemanticsChanged=false`。

本修复只把无 insertion 的合法输入恢复为 no-op，不改变 Philosopher 获得能力、duplicate DRUNK、官方行动时点或用户批准的 V2 tie-break。无需新增规则 evidence、override 或角色覆盖升级；2B18 evidence 不得修改。

## completionCriteria

- builder 在 plan/catalog/grant 前解析 mapping，并对 `undefined` 立即返回。
- V1 no-mapping 的真实 accepted history 可继续 chosen/grant/[DRUNK]/settle、幂等和 replay。
- 五个 V1 mapped 角色全部保持统一 fail closed。
- V2 no-mapping 与 mapped 行为、五角色位置及 tie-break 逐值不变。
- 事件、batch、receipt、版本、projection 和 mixed-generation 边界全部通过直接测试。
- typecheck、lint、全量 test、coverage、diff check、禁止模式扫描及 Ubuntu/Windows CI 通过。
- 独立 reviewer 确认兼容性修复且 `ruleSemanticsChanged=false`。
- 2B18 仍为 `HUMAN_BLOCKED`、remaining conflicts 仍为 4；2B19 未开始。

## explicitOutOfScope

不修改角色规则、官方 Philosopher timing、V2 tie-break、V1 insertion 语义、V2 payload、task ID、plan version、投影模型或角色能力结果；不迁移 accepted history；不实现 Mathematician；不解释或解决 2B18 四项冲突；不创建 2B18/2B19 设计或分支；不重构整个 task engine。

`READY_FOR_COMPATIBILITY_REVIEW`
