# Architecture Input

本文件只整理第二阶段技术架构设计的输入和约束，不选择最终技术方案，不编写代码。

## 1. 核心实体

```text
Game
ScriptDefinition
GameSetup
CharacterAssignment
Player
Seat
CharacterDefinition
CharacterState
AlignmentState
PlayerKnowledge
PlayerClaim
PrivateConversation
Nomination
Vote
Execution
Death
NightTask
EffectInstance
ReminderToken
RegistrationCheck
MadnessRequirement
StorytellerDecision
VictoryCandidate
GameEvent
ReplayRecord
```

## 2. 必须分离的状态

```text
canonicalGameState
storytellerView
publicGameState
playerKnowledgeView
aiPrivateMemory
playerClaims
replayTruth
```

## 3. 必须分离的概念

```text
script
setup
assignment
actual character
registered character
believed character
actual alignment
known alignment
execution
death
ability failure
unreliable information
false information
```

## 4. 必须支持的动态能力

- 动态夜间任务
- 条件唤醒
- 一次性夜间能力
- 角色变化
- 阵营变化
- 能力复制
- 能力抑制
- 持续效果暂停和恢复
- 死亡角色保留能力
- 环形座位邻居
- 疯狂裁量
- 强制假信息
- 特殊胜利条件
- 领域事件回放

## 5. 技术架构需要回答的问题

1. 使用何种桌面技术栈？
2. 规则引擎与 AI 如何隔离？
3. 规则数据与角色代码如何组织？
4. 是否采用事件溯源？
5. 如何保证固定种子可复现？
6. 如何生成每名玩家的合法视图？
7. 如何防止 AI 读取 canonical state？
8. 如何实现动态夜间任务？
9. 如何实现状态效果生命周期？
10. 如何执行胜利检查？
11. 如何保存和恢复游戏？
12. 如何生成回放？
13. AI 模型调用如何隔离和审计？
14. 离线规则引擎如何与在线 AI 接口分离？
15. 如何为每个角色建立独立测试夹具？
