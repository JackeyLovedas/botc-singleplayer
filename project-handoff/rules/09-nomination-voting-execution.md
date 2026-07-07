# 09 Nomination Voting Execution 提名、投票、处决和死亡

访问日期：2026-07-06

验证状态：source-backed draft

| 概念 | 规则摘要 | 关键限制 | 交互风险 |
| --- | --- | --- | --- |
| nomination | 存活玩家每天通常可提名一次；每名玩家每天通常可被提名一次。 | 死亡玩家不能提名。 | Witch 会让被诅咒者提名时死亡。 |
| vote | 投票公开计票。存活玩家可投多次。 | 死亡玩家只有一张幽灵票，举手投票时才消耗。 | 平票无人被处决。 |
| on the block | 当前票数达到门槛且领先者处于待处决状态。 | 被更高票替换。 | 仅状态，不等于已处决。 |
| execution | 白天最多一次处决，可发生但不导致死亡。 | 处决后通常白天结束。 | Evil Twin、Klutz、Vortox 需胜利检查。 |
| death | 死亡改变 alive=false 并失去能力，除非角色规则保留。 | 夜晚、处决、角色能力均可造成。 | Vigormortis 死亡爪牙是例外模型。 |
| demon kill | 恶魔夜间能力导致死亡或替代效果。 | 受醉酒/中毒、保护、方古跳转影响。 | 不等于处决。 |
| ability kill | 女巫、贤者、方古等角色效果造成或响应死亡。 | 逐角色验证。 | 需记录来源能力。 |
| exile | 旅行者流放。 | 第一版禁用。 | 保留术语但不实现流程。 |

## 事件顺序建议

```text
NominationDeclared
-> NominationValidated
-> VoteStarted
-> VoteCounted
-> BlockStateUpdated
-> ExecutionDeclared
-> DeathAttempted
-> DeathResolved or DeathPrevented
-> AbilityTriggers
-> VictoryCheck
```

## 来源

- Official Rules Explanation: https://wiki.bloodontheclocktower.com/Rules_Explanation
- Official Glossary: https://wiki.bloodontheclocktower.com/Glossary
- Witch: https://wiki.bloodontheclocktower.com/Witch
- Evil Twin: https://wiki.bloodontheclocktower.com/Evil_Twin
