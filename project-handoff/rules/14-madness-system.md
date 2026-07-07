# 14 Madness System 疯狂机制

访问日期：2026-07-06

验证状态：source-backed draft

## 十个必答点

| 问题 | 结论 |
| --- | --- |
| 疯狂是什么？ | 试图让群体相信某事为真，或避免让群体相信某事为真。 |
| 不是什么？ | 不是关键词匹配，不是必须说特定句子，不是系统自动读心。 |
| 玩家是否可拒绝？ | 可以不配合，但可能承受角色规则允许的惩罚。 |
| 何时可惩罚？ | 说书人认为玩家没有真诚尝试满足疯狂要求时。 |
| 是否必须惩罚？ | 通常是 `might` 裁量，不应写成必然惩罚。 |
| 公开和私聊是否计入？ | 公开发言显然计入；私聊是否计入需按角色文本和说书人建议记录为待验证策略点。 |
| 沉默如何判断？ | 沉默可能不构成真诚尝试，需要结合局势、机会和历史发言。 |
| 关键词为何不足？ | 玩家可能说出角色名但明显不在说服，也可能不用角色名但实质在说服。 |
| 如何判断真诚尝试？ | 收集表达意图、语境、一致性、反驳反应、主动程度和持续性证据。 |
| 真人和AI如何统一？ | 统一为 evidence collection + storyteller judgment，AI不读取隐藏真相。 |

## 工程模型

```text
MadnessRequirement(sourceRole, targetPlayer, claimConstraint, startsAt,
  expiresAt, publicEvidence, privateEvidence, judgment, penaltyCandidate)
```

## 相关角色

- 畸形秀演员：若公开宣称自己是外来者，可能被处决。
- 洗脑师：每日令一名玩家对某善良角色疯狂，否则可能被处决。

## 来源

- Official Glossary: https://wiki.bloodontheclocktower.com/Glossary
- Mutant: https://wiki.bloodontheclocktower.com/Mutant
- Cerenovus: https://wiki.bloodontheclocktower.com/Cerenovus


## v2.1 洗脑师疯狂裁量补充

- 洗脑师可以选择存活或死亡玩家，也可以选择自己。
- 被选择角色必须是当前角色表中的镇民或外来者。
- 疯狂要求持续到下一次洗脑师行动时被替换或结束。
- 玩家可以在下一白天或夜晚被说书人处决；该处决属于当天唯一一次处决。
- 死亡玩家仍然可以因洗脑师疯狂被处决。
- 私聊、公开发言、暗示、否认和行为均可成为疯狂判断证据。
- 自动说书人可以读取私聊用于疯狂裁量；私聊内容仍不得泄露给无权查看的其他玩家。

`OQ-V2-002` 已关闭。
