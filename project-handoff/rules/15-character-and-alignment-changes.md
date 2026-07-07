# 15 Character And Alignment Changes 角色与阵营变化

访问日期：2026-07-06

验证状态：source-backed draft

| 角色 | 变化模型 | 关键边界 |
| --- | --- | --- |
| 舞蛇人 | 选择恶魔时与恶魔交换角色和阵营；双方认知需更新，历史保留。 | 真实角色与真实阵营同时变化 |
| 方古 | 首次成功杀死外来者时，外来者成为邪恶方古，原方古死亡。 | 新方古不自动获得旧恶魔的所有私有历史 |
| 理发师 | 死亡后恶魔可交换两名玩家角色。 | 交换角色，不交换座位、玩家身份、记忆或声明 |
| 麻脸巫婆 | 夜间使一名玩家成为指定角色，可能导致死亡。 | 需处理重复角色、恶魔数量和夜间队列重建 |
| 哲学家 | 选择获得他人能力并使原角色醉酒。 | 能力来源、原角色抑制、持续效果要记录 |

## 状态历史

```text
CharacterHistory(playerId, fromCharacter, toCharacter, source, atPhase, visibleTo)
AlignmentHistory(playerId, fromAlignment, toAlignment, source, atPhase, visibleTo)
```

## AI认知更新

- AI只更新合法知道的变化。
- 未被告知的角色/阵营变化只影响其外部观察和推理，不写入私有真相。
- 发生阵营变化后，保留过去合法获得的信息、私聊记录和历史声明，并按新阵营重规划策略。

## 来源

- Snake Charmer: https://wiki.bloodontheclocktower.com/Snake_Charmer
- Fang Gu: https://wiki.bloodontheclocktower.com/Fang_Gu
- Barber: https://wiki.bloodontheclocktower.com/Barber
- Pit-Hag: https://wiki.bloodontheclocktower.com/Pit-Hag
- Philosopher: https://wiki.bloodontheclocktower.com/Philosopher
