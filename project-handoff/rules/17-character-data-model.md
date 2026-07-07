# 17 Character Data Model 角色能力数据模型

访问日期：2026-07-06

验证状态：source-backed draft

## 统一字段

```text
id
nameZh
nameEn
edition
characterType
defaultAlignment
abilityTextZh
abilityTextEn
abilitySummary
setupModifier
firstNightOrder
otherNightOrder
wakesAtNight
actionType
targetRules
informationSchema
informationTruthRules
canReceiveUnreliableInformation
mechanicalEffectType
drunkPoisonBehavior
registrationRules
madnessRules
characterChangeRules
alignmentChangeRules
deathTriggers
executionTriggers
nominationTriggers
voteTriggers
dayTriggers
nightTriggers
winConditionModifiers
oncePerGame
abilityDuration
reminderTokens
storytellerDecisions
interactionNotes
sourceUrls
verificationStatus
```

## 角色初步归类

| 角色 | English | 类型 | 配置修正 | 动作类型 | 验证状态 |
| --- | --- | --- | --- | --- | --- |

## 抽象能力类型

- 事件监听器：如贤者死亡、女巫提名死亡。
- 事件替换器：如方古外来者转化、死亡被阻止。
- 配置修饰器：方古、亡骨魔。
- 状态修饰器：心上人醉酒、诺-达鲺中毒。
- 信息生成器：钟表匠、筑梦师、神谕者等。
- 疯狂要求：畸形秀演员、洗脑师。
- 角色/阵营变化：舞蛇人、方古、理发师、麻脸巫婆、哲学家。
- 胜利条件修饰器：镜像双子、呆瓜、涡流。

## 来源

- Official Sects & Violets role pages: https://wiki.bloodontheclocktower.com/Sects_%26_Violets


## v2 修正

动作类型以 `10-night-order.md` 的任务类型为准；旧版 `passive/static` 汇总不得用于实现。
