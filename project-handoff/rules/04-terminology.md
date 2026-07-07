# 04 Terminology 术语表

访问日期：2026-07-06

验证状态：source-backed draft

| 英文 | 中文 | 工程语义 |
| --- | --- | --- |
| script | 剧本 | 允许出现的角色范围。官方剧本或自定义角色池。 |
| custom script | 自定义剧本 | 玩家选择的一批允许出现角色，不等于实际入场组合。 |
| setup | 实际配板 | 从角色池中选出的本局实际入场角色集合。 |
| assignment | 角色分配 | 把实际配板中的角色分配给具体玩家或座位。 |
| demon bluff | 恶魔伪装 | 给恶魔的未入场好人角色信息，供邪恶伪装。 |
| reminder token | 提醒标记 | 说书人辅助记录，不替代正式状态模型。 |
| drunk | 醉酒 | 没有有效能力但玩家不知道，可能被模拟唤醒并收到不可靠信息。 |
| poisoned | 中毒 | 与醉酒在能力失效上相同，来源通常为角色效果。 |
| sober | 清醒 | 不是醉酒。 |
| healthy | 健康 | 不是中毒。 |
| mad | 疯狂 | 真诚试图说服群体某事为真，或避免说服某事为真。 |
| register | 登记 | 在特定规则检查中视作某角色/阵营，但不改变真实状态。 |
| ability | 能力 | 角色标记、角色表和角色年鉴定义的特殊效果。 |
| nomination | 提名 | 发起对玩家处决投票的公开行动。 |
| vote | 投票 | 对提名目标举手计票；死亡玩家通常只剩一票。 |
| on the block | 上台/待处决 | 当前票数足够且领先、若无更高票将被处决的状态。 |
| execution | 处决 | 白天投票产生的处决事件，不必然导致死亡。 |
| death | 死亡 | 玩家从存活变为死亡；不必然来自处决。 |
| exile | 流放 | 旅行者相关机制；第一版禁用但需保留术语。 |
| true information | 真实信息 | 符合真相和能力约束的信息。 |
| false information | 虚假信息 | 在该能力语义下不为真的合法信息。 |
| unreliable information | 不可靠信息 | 醉酒/中毒/模拟等情况下给出的信息，可真可假。 |
| character change | 角色变化 | actualCharacter 改变，通常不自动改变阵营。 |
| alignment change | 阵营变化 | actualAlignment 改变，通常不自动改变角色。 |

## 术语约束

- `script -> setup -> assignment` 是单向流程，不能把上游概念写成下游结果。
- `register` 不得通过修改真实角色或真实阵营实现。
- `execution` 与 `death` 是两个事件，允许处决未死亡、死亡未处决。
- `drunk` 和 `poisoned` 不等于“必得假信息”。

## 来源

- Official Glossary: https://wiki.bloodontheclocktower.com/Glossary
- 中文首页: https://clocktower-wiki.gstonegames.com/index.php?title=首页
