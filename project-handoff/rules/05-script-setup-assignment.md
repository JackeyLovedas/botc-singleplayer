# 05 Script Setup Assignment 剧本、配板与分配

访问日期：2026-07-06

验证状态：source-backed draft

## 数据关系

```text
ScriptRolePool
  -> SetupCandidatePool
  -> ActualSetupRoles[12]
  -> Assignment[seatId -> roleId]
  -> PlayerKnowledgeView
```

## 约束

- 剧本是角色池，不是本局实际入场清单。
- 自定义剧本只定义允许范围。正常配板必须满足 `实际入场角色集合 ⊆ 当前剧本角色池`。
- 实际配板在角色分配前完成，12人局最终必须恰好 12 个普通角色。
- 角色分配只改变“谁拿到哪个实际入场角色”，不得改变实际配板集合。
- 恶魔伪装来自未入场角色信息。若自定义角色池不足，必须报错或要求用户调整，不得静默补池外角色。

## 实体字段草案

| 实体 | 关键字段 | 不可混用点 |
| --- | --- | --- |
| Script | id, name, rolePool, source, version | 不记录座位和实际入场状态 |
| Setup | seed, counts, selectedRoles, modifiers, validation | 不记录玩家私有认知 |
| Assignment | seatId, playerId, roleId, assignedAt | 不重新抽角色 |
| DemonBluff | demonId, bluffRoles, sourcePool, generatedAt | 不代表真实角色 |
| ReminderToken | tokenId, sourceRole, target, lifecycle | 不替代状态字段 |

## 来源

- Official Setup: https://wiki.bloodontheclocktower.com/Setup
- Official Glossary: https://wiki.bloodontheclocktower.com/Glossary
