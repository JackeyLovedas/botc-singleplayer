# 08 Setup Generator 配板生成器需求

访问日期：2026-07-06

验证状态：source-backed draft

## 输入

- 剧本角色池、玩家数 12、随机种子。
- 锁定入场角色、排除角色、完全指定实际配板、指定真人角色。
- 平衡策略参数和说书人裁量策略。

## 输出

- `actualSetupRoles[12]`。
- `setupModifiersApplied[]`。
- `demonBluffs[]`。
- `assignment[]`。
- `validationReport`。

## 约束求解顺序

1. 验证角色池和类型。
2. 应用完全指定实际配板时，只做合法性校验，不再随机。
3. 应用锁定和排除。
4. 按 7/2/2/1 建立类型需求。
5. 预处理配置修正角色的存在性。
6. 随机或平衡选择角色。
7. 计算配置修正后的类型需求。
8. 若不满足，回溯或报告无解。
9. 生成恶魔伪装。
10. 分配座位并投影玩家视图。

## 验证字段

| 字段 | 用途 |
| --- | --- |
| seed | 复现随机结果 |
| preModifierCounts | 配置修正前类型数量 |
| postModifierCounts | 配置修正后类型数量 |
| selectedRoles | 实际入场角色 |
| excludedRoles | 本局排除 |
| lockedRoles | 强制入场 |
| errors | 硬性冲突 |
| warnings | 可运行但需说书人注意 |

## 来源

- Official Setup: https://wiki.bloodontheclocktower.com/Setup
