# 11 Drunk And Poison 醉酒与中毒

访问日期：2026-07-06

验证状态：source-backed draft

## 核心原则

- 醉酒或中毒玩家通常没有有效能力。
- 玩家不知道自己醉酒或中毒。
- 说书人仍可模拟唤醒、目标选择和信息反馈。
- 信息不可靠，可真可假；正确信息不能证明清醒健康，错误信息不能单独证明醉酒或中毒。
- 不能机械取反；必须先计算能力格式下的合法候选集合。

## 15个必答点

| 问题 | 回答 |
| --- | --- |
| 共同点 | 都使玩家没有有效能力但不自知。 |
| 来源差异 | 醉酒常来自角色或状态；中毒常来自其他角色能力。工程上保留来源字段。 |
| 没有能力 | 能力不产生真实机械效果，信息能力结果不可靠。 |
| 仍可能被唤醒 | 为隐藏状态并维持游戏流程，模拟正常角色流程。 |
| 仍可能选择目标 | 选择可被记录为模拟选择，不必然产生效果。 |
| 仍可能得到信息 | 说书人可给符合格式的信息。 |
| 信息可正确 | 不可靠信息允许恰好真实。 |
| 信息可错误 | 也允许在格式内虚假。 |
| 信息格式约束 | 仍需符合角色能力的输出类型和值域。 |
| 机械效果通常不生效 | 杀人、保护、中毒、角色变化等真实效果通常不发生，逐角色验证。 |
| 持续效果 | 需按来源、创建时状态、抑制原因和恢复条件建模。 |
| 恢复清醒 | 不自动回溯过去未生效能力，持续效果是否恢复需逐角色验证。 |
| 与涡流 | 有效涡流强制镇民信息为假；醉酒/中毒不能用一个布尔覆盖涡流约束。 |
| 与登记 | 登记可能改变候选真值判断，但不改变真实角色。 |
| 禁止机械取反 | 多值信息、组合信息和说书人陈述没有通用取反。 |

## 持续效果字段

```text
EffectInstance(sourcePlayer, sourceRole, target, type, createdAt, expiresAt,
  isActive, suppressionReason, resumeCondition, removalReason)
```

## 来源

- Official Rules Explanation: https://wiki.bloodontheclocktower.com/Rules_Explanation
- Official Glossary: https://wiki.bloodontheclocktower.com/Glossary
- Vortox: https://wiki.bloodontheclocktower.com/Vortox
