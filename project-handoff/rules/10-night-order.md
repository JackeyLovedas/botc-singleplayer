# 10 Night Order 夜间任务表

访问日期：2026-07-06

验证状态：v2 corrected specification

本版不再使用简单布尔字段。每个角色按任务类型、触发条件、输入、输出、队列生命周期和失效模拟分开记录。

| 角色 | 首夜任务 | 后续夜任务 | 条件任务 | 具体触发条件 | 执行顺序 | 合法输入 | 输出 | 是否需要唤醒 | 醉酒/中毒时是否模拟 | 使用后是否退出队列 | 角色变化后是否当夜插入 | 死亡后是否继续 | 官方来源 | 验证状态 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 钟表匠 | FIRST_NIGHT_INFORMATION | NO_SCHEDULED_WAKE | new-character start-knowing trigger | new-character start-knowing trigger | 首夜信息槽；若游戏中获得该能力，按获得时点给一次信息 | 无玩家输入 | 整数距离 | 是 | 是，给合法格式但不可靠的数字 | 是 | 成为钟表匠或获得该能力时插入一次信息任务 | 否 | https://wiki.bloodontheclocktower.com/Clockmaker | verified |
| 筑梦师 | EVERY_NIGHT_ACTION | EVERY_NIGHT_ACTION | none | none | 官方 Dreamer 夜间槽 | 选择一名非自己且非旅行者玩家 | 一个善良角色与一个邪恶角色，其中一个正确 | 是 | 是，信息不可靠；涡流有效时必须为假 | 否 | 若变成筑梦师，当夜后续是否插入按夜间队列位置；未过槽位可插入 | 否 | https://wiki.bloodontheclocktower.com/Dreamer | verified |
| 舞蛇人 | EVERY_NIGHT_ACTION | EVERY_NIGHT_ACTION | demon hit swaps | demon hit swaps | 官方 Snake Charmer 夜间槽 | 选择一名存活玩家 | 若目标为恶魔，双方角色和阵营交换，旧恶魔中毒 | 是 | 是，选择可模拟但交换不发生 | 否 | 获得能力后按当前夜间槽处理 | 否 | https://wiki.bloodontheclocktower.com/Snake_Charmer | verified |
| 数学家 | EVERY_NIGHT_ACTION | EVERY_NIGHT_ACTION | abnormal ability counter | abnormal ability counter | 官方 Mathematician 夜间槽 | 无 | 从黎明至唤醒时异常生效的玩家数量 | 是 | 是，给不可靠数字；涡流有效时必须为假 | 否 | 获得能力后按夜间槽处理 | 否 | https://wiki.bloodontheclocktower.com/Mathematician | verified |
| 卖花女孩 | NO_SCHEDULED_WAKE | OTHER_NIGHT_ACTION | today demon vote check | today demon vote check | 后续夜信息槽 | 无 | 今天恶魔是否投票 | 是 | 是，给不可靠 yes/no；涡流有效时必须为假 | 否 | 成为卖花女孩后从下个适用夜开始 | 否 | https://wiki.bloodontheclocktower.com/Flowergirl | verified |
| 城镇公告员 | NO_SCHEDULED_WAKE | OTHER_NIGHT_ACTION | today minion nomination check | today minion nomination check | 后续夜信息槽 | 无 | 今天爪牙是否提名 | 是 | 是，给不可靠 yes/no；涡流有效时必须为假 | 否 | 成为城镇公告员后从下个适用夜开始 | 否 | https://wiki.bloodontheclocktower.com/Town_Crier | verified |
| 神谕者 | NO_SCHEDULED_WAKE | OTHER_NIGHT_ACTION | dead evil count | dead evil count | 后续夜信息槽 | 无 | 死亡玩家中邪恶玩家数量 | 是 | 是，给不可靠数字；涡流有效时必须为假 | 否 | 成为神谕者后从下个适用夜开始 | 否 | https://wiki.bloodontheclocktower.com/Oracle | verified |
| 博学者 | DAY_ACTION | DAY_ACTION | private daytime visit | private daytime visit | 白天私聊说书人，不在夜间队列 | 请求两条信息 | 两条陈述，一真一假；涡流有效时两条均假 | 否 | 醉酒/中毒时可给不可靠陈述；涡流有效时镇民能力信息必须假 | 否 | 获得能力后可在白天使用 | 死亡通常无能力 | https://wiki.bloodontheclocktower.com/Savant | verified |
| 女裁缝 | UNTIL_USED_NIGHT_ACTION | UNTIL_USED_NIGHT_ACTION | may defer | may defer | 每夜直到使用 | 选择暂不使用，或选择两名非自己玩家 | 两名目标阵营是否相同 | 是 | 是，选择可模拟；信息不可靠；涡流有效时必须为假 | 使用后退出队列 | 获得未使用的女裁缝能力后进入队列 | 死亡通常无能力 | https://wiki.bloodontheclocktower.com/Seamstress | verified |
| 哲学家 | UNTIL_USED_NIGHT_ACTION | UNTIL_USED_NIGHT_ACTION | gained ability may insert immediately | gained ability may insert immediately | 每夜直到使用 | 选择暂不使用，或选择一个善良角色图标 | 获得该能力；若原角色在场则该玩家醉酒 | 是 | 是，选择可模拟但不获得能力、不使他人醉酒 | 选择后退出哲学家选择队列 | 获得首夜能力时当晚立即处理；获得夜间能力时按其夜间槽处理 | 若获得的能力死后有效则继续，否则否 | https://wiki.bloodontheclocktower.com/Philosopher | verified |
| 艺术家 | DAY_ACTION | DAY_ACTION | once per game question | once per game question | 白天私问，不在夜间队列 | 一个 yes/no 问题 | yes/no 答案；涡流有效时必须为假 | 否 | 醉酒/中毒时可给不可靠 yes/no；涡流有效时必须假 | 使用后退出 | 成为艺术家后获得一次新机会 | 死亡通常无能力 | https://wiki.bloodontheclocktower.com/Artist | verified |
| 杂耍艺人 | FIRST_DAY_THEN_NIGHT_INFORMATION | NO_SCHEDULED_WAKE | first day guesses then same night info | first day guesses then same night info | 首日公开记录，首夜后当晚信息槽 | 首日公开最多五个玩家-角色猜测 | 当晚得知正确数量 | 条件唤醒 | 若猜测时醉酒/中毒但当晚清醒健康，给真实数量；当晚醉酒/中毒则不可靠；涡流有效时必须假 | 当晚信息后退出队列 | 游戏中变成杂耍艺人后，下个白天可猜，随后当晚得信息 | 若当晚前死亡通常不触发 | https://wiki.bloodontheclocktower.com/Juggler | verified |
| 贤者 | NO_SCHEDULED_WAKE | CONDITIONAL_NIGHT_TRIGGER | only if killed by Demon | only if killed by Demon | 恶魔杀死贤者后的夜间触发 | 无 | 两个候选玩家，其中一人为杀死自己的恶魔 | 条件唤醒 | 醉酒/中毒时可给错误候选；涡流有效时必须假 | 触发一次后结束 | 成为贤者后可从之后恶魔击杀触发 | 可在死亡后因该能力被唤醒 | https://wiki.bloodontheclocktower.com/Sage | verified |
| 畸形秀演员 | DAY_PASSIVE | DAY_PASSIVE | madness claim check | madness claim check | 白天/夜晚发言监听 | 玩家声明 | 可能被处决事件 | 否 | 醉酒/中毒时不应产生处决惩罚 | 否 | 成为畸形秀演员后开始监听 | 死亡通常无能力 | https://wiki.bloodontheclocktower.com/Mutant | verified |
| 心上人 | NO_SCHEDULED_WAKE | CONDITIONAL_NIGHT_TRIGGER | when dies | when dies | 死亡结算触发 | 无 | 一名玩家开始醉酒 | 否 | 醉酒/中毒时死亡不创建醉酒效果 | 否 | 死亡后才变成心上人不追溯 | 死亡触发后效果持续 | https://wiki.bloodontheclocktower.com/Sweetheart | verified |
| 理发师 | NO_SCHEDULED_WAKE | DEATH_TRIGGER_RESOLVED_AT_NIGHT | if died today or tonight | if died today or tonight | 理发师死亡当晚创建恶魔选择任务 | 恶魔可拒绝，或选择两名玩家 | 交换两名玩家角色并通知新角色 | 唤醒恶魔和被交换玩家 | 理发师醉酒/中毒时不创建交换任务 | 触发后移除 HAIRCUTS TONIGHT | 死亡后才变成理发师不追溯 | 死亡后任务当晚仍处理 | https://wiki.bloodontheclocktower.com/Barber | verified |
| 呆瓜 | NO_SCHEDULED_WAKE | CONDITIONAL_NIGHT_TRIGGER | when learns they died | when learns they died | 得知死亡时公开触发 | 公开选择一名存活玩家 | 若目标邪恶，其阵营失败 | 否 | 醉酒/中毒时选择不产生失败效果 | 触发一次 | 死亡后才变成呆瓜不追溯 | 死亡后触发公开选择 | https://wiki.bloodontheclocktower.com/Klutz | verified |
| 镜像双子 | FIRST_NIGHT_INFORMATION | CONTINUOUS_PASSIVE | twin relation change | twin relation change | 设置/首夜双子互认；之后持续胜利阻断 | 无 | 两名双子互认，并分别得知对方角色 | 是，首夜同时唤醒双子 | 醉酒/中毒时双子能力失效；普通胜利阻断不适用 | 否 | 新镜像双子或双方同阵营时说书人重新指定双子关系 | 死亡镜像双子无能力 | https://wiki.bloodontheclocktower.com/Evil_Twin | verified |
| 女巫 | EVERY_NIGHT_ACTION | EVERY_NIGHT_ACTION | curse nominee tomorrow | curse nominee tomorrow | 官方 Witch 夜间槽 | 选择一名玩家 | 目标若明天提名则死亡；仅剩3存活时失去能力 | 是 | 是，选择可模拟但不创建诅咒 | 否 | 获得女巫能力后按夜间槽处理 | 死亡通常无能力；亡骨魔杀死例外 | https://wiki.bloodontheclocktower.com/Witch | verified |
| 洗脑师 | EVERY_NIGHT_ACTION | EVERY_NIGHT_ACTION | madness until tomorrow night | madness until tomorrow night | 官方 Cerenovus 夜间槽 | 选择一名玩家和一个善良角色 | 目标疯狂，否则可能被处决 | 是 | 是，选择可模拟但不创建疯狂要求 | 否 | 获得能力后按夜间槽处理 | 死亡通常无能力；亡骨魔杀死例外 | https://wiki.bloodontheclocktower.com/Cerenovus | verified |
| 麻脸巫婆 | NO_SCHEDULED_WAKE | OTHER_NIGHT_ACTION | CHARACTER_CHANGE_NIGHT_ACTION | CHARACTER_CHANGE_NIGHT_ACTION | 后续夜角色变化槽 | 选择一名玩家和当前角色表/自定义剧本中的角色图标 | 若角色未在场，目标变成该角色；若角色已在场，选择合法但什么也不发生；若创造恶魔，当晚死亡任意 | 是 | 是，选择可模拟但不改变角色 | 否 | 获得能力后后续夜处理；若当夜槽未过可插入 | 死亡通常无能力；亡骨魔杀死例外 | https://wiki.bloodontheclocktower.com/Pit-Hag | verified |
| 方古 | NO_SCHEDULED_WAKE | OTHER_NIGHT_ACTION | demon kill or transfer | demon kill or transfer | 后续夜恶魔击杀槽 | 选择任意玩家 | 非外来者或转移已用则目标死亡；首次有效杀外来者时转移 | 是 | 是，选择可模拟但不杀人/不转移 | 否 | 新方古从之后恶魔击杀槽行动 | 死亡恶魔通常无能力 | https://wiki.bloodontheclocktower.com/Fang_Gu | verified |
| 亡骨魔 | NO_SCHEDULED_WAKE | OTHER_NIGHT_ACTION | demon kill plus dead-minion continuous effects | demon kill plus dead-minion continuous effects | 后续夜恶魔击杀槽 | 选择任意玩家 | 目标死亡；若亲自杀死爪牙，爪牙保留能力并毒一名邻近镇民 | 是 | 是，选择可模拟但不杀人/不保留能力 | 否 | 成为亡骨魔后重算死亡爪牙保留能力和中毒 | 死亡或失去能力时效果停止 | https://wiki.bloodontheclocktower.com/Vigormortis | verified |
| 诺-达鲺 | CONTINUOUS_PASSIVE | OTHER_NIGHT_ACTION | neighbor poisoning plus demon kill | neighbor poisoning plus demon kill | 首夜准备时放置中毒；后续夜恶魔击杀槽 | 选择任意玩家 | 目标死亡；顺/逆最近镇民中毒 | 击杀时唤醒 | 是，击杀可模拟；中毒效果在失效时移除 | 否 | 新诺-达鲺立即重算中毒目标 | 死亡或失去能力时旧目标恢复健康 | https://wiki.bloodontheclocktower.com/No_Dashii | verified |
| 涡流 | CONTINUOUS_PASSIVE | OTHER_NIGHT_ACTION | false townsfolk info plus dusk execution check | false townsfolk info plus dusk execution check | 后续夜恶魔击杀槽；每日黄昏检查处决 | 选择任意玩家 | 目标死亡；镇民能力信息必须假；无处决日邪恶胜利 | 击杀时唤醒 | 即使镇民醉酒/中毒，镇民能力信息仍必须假；涡流自己醉酒/中毒时效果无效 | 否 | 成为涡流后从能力有效时开始强制假信息和处决检查 | 死亡或失去能力时强制假信息停止 | https://wiki.bloodontheclocktower.com/Vortox | verified |

## 队列规则

- `FIRST_NIGHT_INFORMATION`、`UNTIL_USED_NIGHT_ACTION`、`FIRST_DAY_THEN_NIGHT_INFORMATION` 和 `DEATH_TRIGGER_RESOLVED_AT_NIGHT` 都会产生真实夜间任务，不得折叠为 `passive/static`。
- 动态角色变化后，若该角色的任务槽位尚未经过，可当夜插入；若已经过，进入下一次适用窗口。哲学家获得首夜能力时按官方说明当晚立即处理。
- 能力失效时可保留可见流程，但必须把 `abilityActive=false` 与 `presentationRequired=true` 分开记录。
- 亡骨魔死亡爪牙、诺-达鲺邻近镇民和涡流强制假信息是持续效果，不是一次性夜间数组项。


## v2.1 定向修正

- 麻脸巫婆选择已在场角色是合法夜间输入；结算为 `NoChangeBecauseCharacterInPlay`，不得产生 `InvalidTargetRejected` 或要求重新选择。
- 洗脑师可选择存活或死亡玩家，也可选择自己；疯狂要求持续到下一次洗脑师行动替换或结束。
- 女巫存活玩家数降为3时立即失去能力并移除当前诅咒，可能发生在夜间恶魔击杀后。
- 数学家夜间任务使用 `MathematicianAbnormalityLedger`，不使用普通计数器。
