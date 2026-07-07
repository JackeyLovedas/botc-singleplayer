# 12 Information Model 信息模型

访问日期：2026-07-06

验证状态：source-backed draft

## 信息真实性状态

| 状态 | 语义 |
| --- | --- |
| RELIABLE_TRUE | 能力有效且结果真实 |
| UNRELIABLE_BUT_TRUE | 能力无效或不可靠，但给出的结果恰好真实 |
| UNRELIABLE_AND_FALSE | 能力无效或不可靠，给出的结果为合法虚假 |
| ALTERED_BY_REGISTRATION | 因登记机制改变了检查对象的表观身份或阵营 |
| FORCED_TRUE | 规则强制真信息 |
| FORCED_FALSE | 涡流等规则强制假信息 |
| SIMULATED_WITHOUT_ABILITY | 没有有效能力但仍模拟了能力流程 |
| PUBLIC_FACT | 公开可知事实，不是角色能力信息 |
| PLAYER_CLAIM | 玩家声明，可能真也可能假 |
| NOT_APPLICABLE | 该事件不产生信息真值 |

## 视图分层

| 层 | 说明 |
| --- | --- |
| canonicalGameState | 真实状态；只有说书人和回放真相可见 |
| storytellerView | 说书人视图；含裁量候选、真值元数据和提醒标记 |
| publicGameState | 所有玩家共同可见的公开事件 |
| playerKnowledgeView | 某一玩家合法知道的信息 |
| aiPrivateMemory | AI个人记忆、声明、推理、私聊 |
| playerClaims | 声明层，不写入真实状态 |
| replayTruth | 游戏结束后的真相复盘 |

## 候选集合流程

```text
真实状态 -> 登记投影 -> 能力格式 -> 有效规则约束 -> 真/假约束 -> 合法候选集合 -> 说书人选择 -> 玩家视图
```

## 来源

- Official Glossary: https://wiki.bloodontheclocktower.com/Glossary
- Official Rules Explanation: https://wiki.bloodontheclocktower.com/Rules_Explanation
