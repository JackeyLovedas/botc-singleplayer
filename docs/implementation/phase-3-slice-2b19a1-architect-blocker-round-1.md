# Phase 3 Slice 2B19A1 Architect Round 1

## prerequisiteAssessment

- accepted main: `7158d12afd05b926658b97b7d30606c5c45dd1ef`
- rule evidence: `docs/rules/evidence/2B19A1.md`
- evidence SHA-256: `03efe35093bc4facaa3053cb8947c6c13066308cafa64204c59c50a86ee4670d`
- rule verdict: `RULE_READY`
- canonical base Dreamer ability-instance support: **存在**
- canonical active base Dreamer role-tenure support: **不存在**
- design emitted: **否**
- files modified by architect: **无**

## blockingFinding

Accepted main 无法为 base Dreamer 提供设计所强制要求的 canonical active role-tenure 证明：

1. `packages/domain-core/src/seamstress.ts` 的 `SeamstressRelevantRoleId` 只允许：
   - `cerenovus`
   - `mathematician`
   - `philosopher`
   - `seamstress`
   - `vortox`

   不包含 `dreamer`。

2. 同文件的 `isRelevantRoleId`、`formatRoleTenureId` 输入域和 `parseRoleTenureId` canonical grammar 均排除 `dreamer`。

3. `bootstrapRoleTenuresFromCharactersAssigned` 会过滤所有非上述角色，因此 `CharactersAssigned` 不会生成 Dreamer tenure record。

4. Snake Charmer 角色变化的 tenure transition reconciliation 使用同一受限角色集合，无法建立或结束 Dreamer tenure。

5. `GameState` 只有该受限的 `seamstressRoleTenureState`，没有另一个 accepted canonical tenure history 可供 Dreamer 使用。

6. 2B18A 已验收的 `formatBaseFirstNightAbilityInstanceId(taskId)` 能为 canonical base Dreamer task 形成：

   `first-night-ability-instance-v1:base-task:<taskId>`

   但 ability-instance ID 不能替代缺失的 role-tenure record、tenure lifecycle 或 active-tenure uniqueness proof。

7. 只读检查旧 PR #26 分支显示，它必须修改共享 `seamstress.ts` 的 role-tenure角色域、识别器及 parser grammar 才能加入 Dreamer。这进一步证明该能力并不存在于 accepted main。

因此，任何满足 2B19A1 合同的实现都必须先扩展共享 role-tenure schema、bootstrap、transition/replay validation及其回归测试。这会引入独立于 `BASE_DREAMER_V2_OPPORTUNITY_CONTRACT` 的通用 tenure 风险，违反本 Slice 单一风险与不得扩范围的门禁。

用户已明确规定：accepted main 缺少足够 canonical tenure record 时立即 `HUMAN_BLOCKED`。故不得通过 current-character snapshot、初始 assignment、caller-supplied tenure或旧分支代码绕过，也不得生成无法实现的 Round 1 设计。

## requiredUnblock

先建立并独立验收一个受限的 canonical Dreamer role-tenure prerequisite Slice，然后重新启动 2B19A1 设计门禁。

architectStatus: `HUMAN_BLOCKED`
