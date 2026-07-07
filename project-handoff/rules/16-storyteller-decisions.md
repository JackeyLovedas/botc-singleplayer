# 16 Storyteller Decisions 说书人裁量

访问日期：2026-07-06

验证状态：source-backed draft

| 裁量类型 | 定义 | 示例 |
| --- | --- | --- |
| 强制规则 | 无选择空间，必须执行 | 配置修正、合法提名门槛 |
| 合法候选中选择 | 多个合法结果，记录候选和选择 | 博学者陈述、贤者两个候选 |
| 不可靠信息选择 | 醉酒/中毒下选择真或假候选 | 醉酒筑梦师信息 |
| 强制假信息 | 必须产生规则意义上的假信息 | 涡流镇民能力信息 |
| 登记选择 | 在特定检查中选择登记方式 | 扩展角色的登记机制 |
| 疯狂判断 | 判断真诚尝试与是否惩罚 | 畸形秀演员、洗脑师 |
| 角色变化选择 | 选择新角色或交换对象 | 麻脸巫婆、理发师 |
| 死亡与保护选择 | 死亡替代、保护或目标选择 | 恶魔攻击、保护效果 |

## 决策日志字段

```text
decisionType, legalCandidates, selectedCandidate, ruleBasis,
strategyBasis, randomSeed, truthStatus, affectedPlayers, hiddenFromPlayers
```

## 禁止行为

- 违反硬规则。
- 根据 AI 不该知道的隐藏推理针对某方。
- 生成能力格式外的信息。
- 泄露真实配板、角色变化、阵营变化或说书人隐藏裁量。

## 来源

- Official Storyteller Advice: https://wiki.bloodontheclocktower.com/Storyteller_Advice
- Official Glossary: https://wiki.bloodontheclocktower.com/Glossary
