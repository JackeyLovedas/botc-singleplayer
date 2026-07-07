# 22 Twelve Player AI Model 12人AI信息隔离

访问日期：2026-07-06

验证状态：source-backed draft

## 固定范围

- 1 名真人玩家。
- 11 名 AI 玩家。
- 1 个自动说书人，不计入 12 名普通玩家。

## 每名AI独立状态

```text
selfBelievedCharacter, selfKnownAlignment, receivedInformation,
publicHistory, privateConversations, knownClaims, suspicionModel,
trustScores, demonHypotheses, setupHypotheses, nominationStrategy,
voteStrategy, nightTargetStrategy, bluffPlan, madnessRequirements,
characterHistoryKnown, alignmentHistoryKnown
```

## 禁止读取

- canonicalGameState。
- 真实配板和其他玩家真实角色。
- 其他AI私聊。
- 说书人隐藏裁量。
- 信息真值元数据。
- 未合法获知的角色变化和阵营变化。

## 讨论控制

- 每日发言预算和私聊并发限制。
- 真人可插话、跳过、请求摘要。
- 系统维护关键声明表、角色声明冲突表、投票意向摘要。
- 不能让多数AI长期沉默来规避复杂度。

## 来源

- Official Rules Explanation: https://wiki.bloodontheclocktower.com/Rules_Explanation
- Official Glossary: https://wiki.bloodontheclocktower.com/Glossary
