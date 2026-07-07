# 18 Sects And Violets Roles 梦殒春宵角色规格 v2.1

访问日期：2026-07-06

验证状态：v2.1 targeted patch

## 钟表匠 / Clockmaker

| 字段 | v2.1规格 |
| --- | --- |
| roleId | clockmaker |
| 名称 | 钟表匠 / Clockmaker |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | You start knowing how many steps from the Demon to its nearest Minion. |
| 合法目标/输入 | 无玩家输入 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | 整数距离 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | NOT_APPLICABLE |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=FIRST_NIGHT_INFORMATION；后续=NO_SCHEDULED_WAKE；条件=new-character start-knowing trigger |
| 关联测试 | SV-CLOCKMAKER-FIRST-NIGHT-DISTANCE |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Clockmaker |

## 筑梦师 / Dreamer

| 字段 | v2.1规格 |
| --- | --- |
| roleId | dreamer |
| 名称 | 筑梦师 / Dreamer |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | Each night, choose a player (not yourself or Travellers): you learn 1 good & 1 evil character, 1 of which is correct. |
| 合法目标/输入 | 选择一名非自己且非旅行者玩家 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | 一个善良角色与一个邪恶角色，其中一个正确 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | NOT_APPLICABLE |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=EVERY_NIGHT_ACTION；后续=EVERY_NIGHT_ACTION；条件=none |
| 关联测试 | SV-DREAMER-VALID-TARGETS, SV-DREAMER-POISONED-INFO-UNRELIABLE |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Dreamer |

## 舞蛇人 / Snake Charmer

| 字段 | v2.1规格 |
| --- | --- |
| roleId | snake_charmer |
| 名称 | 舞蛇人 / Snake Charmer |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | Each night, choose an alive player: a chosen Demon swaps characters & alignments with you & is then poisoned. |
| 合法目标/输入 | 选择一名存活玩家 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 若目标为恶魔，双方角色和阵营交换，旧恶魔中毒 |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=EVERY_NIGHT_ACTION；后续=EVERY_NIGHT_ACTION；条件=demon hit swaps |
| 关联测试 | SV-SNAKECHARMER-DEMON-SWAP |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Snake_Charmer |

## 数学家 / Mathematician

| 字段 | v2.1规格 |
| --- | --- |
| roleId | mathematician |
| 名称 | 数学家 / Mathematician |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | Each night, you learn how many players' abilities worked abnormally (since dawn) due to another character's ability. |
| 合法目标/输入 | NOT_APPLICABLE |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | 维护 MathematicianAbnormalityLedger：每当玩家能力因其他角色异常工作时记录 entry；排除数学家自身。 |
| 产生的信息 | MathematicianAbnormalityLedger 的结算数字；涡流有效时数学家最终得到的数字也必须为假。 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | 创建并清理 ABNORMAL 提醒；不改变其他玩家状态。 |
| 禁止产生的领域事件 | 不得把醉酒/中毒状态本身计入；不得统计数学家自己的异常；不得把恰好正确的不可靠信息计为异常。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=EVERY_NIGHT_ACTION；后续=EVERY_NIGHT_ACTION；条件=abnormal ability counter |
| 关联测试 | SV-MATHEMATICIAN-ABNORMAL-COUNT, SV-MATHEMATICIAN-VORTOX-ABNORMAL-COUNT, SV-MATHEMATICIAN-DOES-NOT-COUNT-SELF, SV-MATHEMATICIAN-POISONED-TRUE-INFO-NOT-ABNORMAL, SV-MATHEMATICIAN-POISONED-FALSE-INFO-ABNORMAL |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/Mathematician |

## 卖花女孩 / Flowergirl

| 字段 | v2.1规格 |
| --- | --- |
| roleId | flowergirl |
| 名称 | 卖花女孩 / Flowergirl |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | Each night*, you learn if a Demon voted today. |
| 合法目标/输入 | 无 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | 今天恶魔是否投票 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | NOT_APPLICABLE |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=NO_SCHEDULED_WAKE；后续=OTHER_NIGHT_ACTION；条件=today demon vote check |
| 关联测试 | SV-FLOWERGIRL-DEMON-VOTED, SV-FLOWERGIRL-VORTOX-FALSE |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Flowergirl |

## 城镇公告员 / Town Crier

| 字段 | v2.1规格 |
| --- | --- |
| roleId | town_crier |
| 名称 | 城镇公告员 / Town Crier |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | Each night*, you learn if a Minion nominated today. |
| 合法目标/输入 | 无 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | 今天爪牙是否提名 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | NOT_APPLICABLE |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=NO_SCHEDULED_WAKE；后续=OTHER_NIGHT_ACTION；条件=today minion nomination check |
| 关联测试 | SV-TOWNCRIER-MINION-NOMINATED, SV-TOWNCRIER-VORTOX-FALSE |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Town_Crier |

## 神谕者 / Oracle

| 字段 | v2.1规格 |
| --- | --- |
| roleId | oracle |
| 名称 | 神谕者 / Oracle |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | Each night*, you learn how many dead players are evil. |
| 合法目标/输入 | 无 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | 死亡玩家中邪恶玩家数量 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | NOT_APPLICABLE |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=NO_SCHEDULED_WAKE；后续=OTHER_NIGHT_ACTION；条件=dead evil count |
| 关联测试 | SV-ORACLE-DEAD-EVIL-COUNT, SV-ORACLE-POISONED-FALSE-COUNT |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Oracle |

## 博学者 / Savant

| 字段 | v2.1规格 |
| --- | --- |
| roleId | savant |
| 名称 | 博学者 / Savant |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | Each day, you may visit the Storyteller to learn 2 things in private: 1 is true & 1 is false. |
| 合法目标/输入 | 请求两条信息 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | 两条陈述，一真一假；涡流有效时两条均假 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | NOT_APPLICABLE |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=DAY_ACTION；后续=DAY_ACTION；条件=private daytime visit |
| 关联测试 | SV-SAVANT-VORTOX-BOTH-FALSE, SV-SAVANT-POISONED-STATEMENTS-UNRELIABLE |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Savant |

## 女裁缝 / Seamstress

| 字段 | v2.1规格 |
| --- | --- |
| roleId | seamstress |
| 名称 | 女裁缝 / Seamstress |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | Once per game, at night, choose 2 players (not yourself): you learn if they are the same alignment. |
| 合法目标/输入 | 选择暂不使用，或选择两名非自己玩家 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | 两名目标阵营是否相同 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | NOT_APPLICABLE |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=UNTIL_USED_NIGHT_ACTION；后续=UNTIL_USED_NIGHT_ACTION；条件=may defer |
| 关联测试 | SV-SEAMSTRESS-DEFER-THEN-USE, SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Seamstress |

## 哲学家 / Philosopher

| 字段 | v2.1规格 |
| --- | --- |
| roleId | philosopher |
| 名称 | 哲学家 / Philosopher |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | Once per game, at night, choose a good character: gain that ability. If this character is in play, they are drunk. |
| 合法目标/输入 | 选择暂不使用，或选择一个善良角色图标 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 获得该能力；若原角色在场则该玩家醉酒 |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=UNTIL_USED_NIGHT_ACTION；后续=UNTIL_USED_NIGHT_ACTION；条件=gained ability may insert immediately |
| 关联测试 | SV-PHILOSOPHER-ORIGINAL-DRUNK, SV-PHILOSOPHER-FIRST-NIGHT-ABILITY-IMMEDIATE, SV-PHILOSOPHER-POISONED-NO-GAIN, SV-PHILOSOPHER-ROLE-CHANGE-REMOVES-DRUNK |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/Philosopher |

## 艺术家 / Artist

| 字段 | v2.1规格 |
| --- | --- |
| roleId | artist |
| 名称 | 艺术家 / Artist |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | Once per game, during the day, privately ask the Storyteller any yes/no question. |
| 合法目标/输入 | 一个 yes/no 问题 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | yes/no 答案；涡流有效时必须为假 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | NOT_APPLICABLE |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=DAY_ACTION；后续=DAY_ACTION；条件=once per game question |
| 关联测试 | SV-ARTIST-VORTOX-FALSE-YESNO, SV-ARTIST-POISONED-ANSWER-UNRELIABLE |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Artist |

## 杂耍艺人 / Juggler

| 字段 | v2.1规格 |
| --- | --- |
| roleId | juggler |
| 名称 | 杂耍艺人 / Juggler |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | On your 1st day, publicly guess up to 5 players' characters. That night, you learn how many you got correct. |
| 合法目标/输入 | 首日公开最多五个玩家-角色猜测 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | 当晚得知正确数量 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | NOT_APPLICABLE |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=FIRST_DAY_THEN_NIGHT_INFORMATION；后续=NO_SCHEDULED_WAKE；条件=first day guesses then same night info |
| 关联测试 | SV-JUGGLER-FIRST-DAY-THEN-NIGHT, SV-JUGGLER-DRUNK-GUESS-SOBER-INFO-TRUE |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Juggler |

## 贤者 / Sage

| 字段 | v2.1规格 |
| --- | --- |
| roleId | sage |
| 名称 | 贤者 / Sage |
| 角色类型 | 镇民 |
| 默认阵营 | Good |
| 官方能力文本 | If the Demon kills you, you learn that it is 1 of 2 players. |
| 合法目标/输入 | 无 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | 两个候选玩家，其中一人为杀死自己的恶魔 |
| 信息真假约束 | 清醒健康时按真实规则；醉酒/中毒时不可靠；涡流有效时镇民能力信息必须为假。 |
| 产生的机械效果 | NOT_APPLICABLE |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=NO_SCHEDULED_WAKE；后续=CONDITIONAL_NIGHT_TRIGGER；条件=only if killed by Demon |
| 关联测试 | SV-SAGE-DEMON-KILL-CANDIDATES, SV-SAGE-PITHAG-DEATH-NO_WAKE |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Sage |

## 畸形秀演员 / Mutant

| 字段 | v2.1规格 |
| --- | --- |
| roleId | mutant |
| 名称 | 畸形秀演员 / Mutant |
| 角色类型 | 外来者 |
| 默认阵营 | Good |
| 官方能力文本 | If you are "mad" about being an Outsider, you might be executed. |
| 合法目标/输入 | 玩家声明 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 可能被处决事件 |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=DAY_PASSIVE；后续=DAY_PASSIVE；条件=madness claim check |
| 关联测试 | SV-MUTANT-MADNESS-NOT-KEYWORD |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Mutant |

## 心上人 / Sweetheart

| 字段 | v2.1规格 |
| --- | --- |
| roleId | sweetheart |
| 名称 | 心上人 / Sweetheart |
| 角色类型 | 外来者 |
| 默认阵营 | Good |
| 官方能力文本 | When you die, 1 player is drunk from now on. |
| 合法目标/输入 | 无 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 一名玩家开始醉酒 |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=NO_SCHEDULED_WAKE；后续=CONDITIONAL_NIGHT_TRIGGER；条件=when dies |
| 关联测试 | SV-SWEETHEART-DEATH-DRUNK, SV-SWEETHEART-POISONED-DEATH-NO-DRUNK |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Sweetheart |

## 理发师 / Barber

| 字段 | v2.1规格 |
| --- | --- |
| roleId | barber |
| 名称 | 理发师 / Barber |
| 角色类型 | 外来者 |
| 默认阵营 | Good |
| 官方能力文本 | If you died today or tonight, the Demon may choose 2 players (not another Demon) to swap characters. |
| 合法目标/输入 | 恶魔可拒绝，或选择两名玩家 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 交换两名玩家角色并通知新角色 |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=NO_SCHEDULED_WAKE；后续=DEATH_TRIGGER_RESOLVED_AT_NIGHT；条件=if died today or tonight |
| 关联测试 | SV-BARBER-SWAP-DEAD-PLAYER, SV-BARBER-DEMON-CHOOSES-SELF, SV-BARBER-NO-ALIGNMENT-SWAP, SV-BARBER-POISONED-NO-SWAP-TASK, SV-BARBER-BECOMES-AFTER-DEATH-NO-RETRO |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/Barber |

## 呆瓜 / Klutz

| 字段 | v2.1规格 |
| --- | --- |
| roleId | klutz |
| 名称 | 呆瓜 / Klutz |
| 角色类型 | 外来者 |
| 默认阵营 | Good |
| 官方能力文本 | When you learn that you died, publicly choose 1 alive player: if they are evil, your team loses. |
| 合法目标/输入 | 公开选择一名存活玩家 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 若目标邪恶，其阵营失败 |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=NO_SCHEDULED_WAKE；后续=CONDITIONAL_NIGHT_TRIGGER；条件=when learns they died |
| 关联测试 | SV-KLUTZ-CHOOSES-EVIL-LOSES |
| 覆盖状态 | PARTIAL |
| 规则来源 | https://wiki.bloodontheclocktower.com/Klutz |

## 镜像双子 / Evil Twin

| 字段 | v2.1规格 |
| --- | --- |
| roleId | evil_twin |
| 名称 | 镜像双子 / Evil Twin |
| 角色类型 | 爪牙 |
| 默认阵营 | Evil |
| 官方能力文本 | You & an opposing player know each other. If the good player is executed, evil wins. Good can't win if you both live. |
| 合法目标/输入 | 无 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 首夜双子互认；善良双子被处决时邪恶胜利；双方都存活时阻断善良胜利。亡骨魔杀死的死亡镜像双子保留处决善良双子的胜利能力，但不满足双方都存活阻断。 |
| 禁止产生的领域事件 | 普通死亡镜像双子不得继续使善良双子处决触发邪恶胜利；不得把死亡镜像双子当作仍存活。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=FIRST_NIGHT_INFORMATION；后续=CONTINUOUS_PASSIVE；条件=twin relation change |
| 关联测试 | SV-EVILTWIN-FIRST-NIGHT-PAIR, SV-EVILTWIN-GOOD-TWIN-EXECUTED, SV-EVILTWIN-DEAD-NO-LONGER-BLOCKS, SV-EVILTWIN-ROLE-CHANGE-REPAIR-PAIR, SV-VIGORMORTIS-EVILTWIN-GOOD-TWIN-EXECUTED, SV-VIGORMORTIS-EVILTWIN-NO-LIVE-BLOCK, SV-VIGORMORTIS-LOSES-ABILITY-EVILTWIN-STOPS |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/Evil_Twin |

## 女巫 / Witch

| 字段 | v2.1规格 |
| --- | --- |
| roleId | witch |
| 名称 | 女巫 / Witch |
| 角色类型 | 爪牙 |
| 默认阵营 | Evil |
| 官方能力文本 | Each night, choose a player: if they nominate tomorrow, they die. If just 3 players live, you lose this ability. |
| 合法目标/输入 | 任意玩家，包含死亡玩家和自己。 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | 监听下一白天目标是否发起提名；当存活玩家数变为3时立即移除诅咒。 |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE；女巫不产生角色能力信息。 |
| 产生的机械效果 | CurseApplied；目标下一白天提名时死亡；诅咒只持续一天；三人存活时立即移除。 |
| 禁止产生的领域事件 | 不得等到女巫下一次行动才移除三人存活时的诅咒。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=EVERY_NIGHT_ACTION；后续=EVERY_NIGHT_ACTION；条件=curse nominee tomorrow |
| 关联测试 | SV-WITCH-CURSED-NOMINATOR-DIES, SV-WITCH-THREE-ALIVE-CURSE-REMOVED, SV-WITCH-CURSE-LASTS-ONE-DAY, SV-WITCH-DEAD-TARGET-LEGAL |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/Witch |

## 洗脑师 / Cerenovus

| 字段 | v2.1规格 |
| --- | --- |
| roleId | cerenovus |
| 名称 | 洗脑师 / Cerenovus |
| 角色类型 | 爪牙 |
| 默认阵营 | Evil |
| 官方能力文本 | Each night, choose a player & a good character: they are "mad" they are this character tomorrow, or might be executed. |
| 合法目标/输入 | 任意玩家，包含存活、死亡和自己；任意当前角色表中的镇民或外来者图标。 |
| 非法目标/输入 | 爪牙、恶魔、旅行者、传奇/实验角色；当前角色表外图标。 |
| 说书人输入 | 判断公开发言、私聊、暗示、否认和行为是否构成未真诚尝试；自动说书人可读取私聊用于裁量。 |
| 产生的信息 | 向目标私密告知被洗脑师选择及需疯狂证明的善良角色。 |
| 信息真假约束 | NOT_APPLICABLE；洗脑师不产生镇民能力信息，不受涡流强制假信息影响。 |
| 产生的机械效果 | MadnessRequirementCreated，持续到下一次洗脑师行动时替换或结束；可在下一白天或夜晚处决目标。 |
| 禁止产生的领域事件 | 不得泄露私聊内容给无权玩家；中毒/醉酒洗脑师不得创建疯狂要求。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=EVERY_NIGHT_ACTION；后续=EVERY_NIGHT_ACTION；条件=madness until tomorrow night |
| 关联测试 | SV-CERENOVUS-MUTANT-DUAL-MADNESS, SV-CERENOVUS-CAN-TARGET-DEAD, SV-CERENOVUS-PRIVATE-CONTRADICTION-EVIDENCE, SV-CERENOVUS-EXECUTION-USES-DAILY-EXECUTION, SV-CERENOVUS-POISONED-NO-MADNESS |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/Cerenovus |

## 麻脸巫婆 / Pit-Hag

| 字段 | v2.1规格 |
| --- | --- |
| roleId | pit_hag |
| 名称 | 麻脸巫婆 / Pit-Hag |
| 角色类型 | 爪牙 |
| 默认阵营 | Evil |
| 官方能力文本 | Each night*, choose a player & a character they become (if not in play). If a Demon is made, deaths tonight are arbitrary. |
| 合法目标/输入 | 任意玩家 + 当前角色表/当前自定义剧本中的任意角色图标；已在场角色也是合法选择。 |
| 非法目标/输入 | 当前角色表/自定义剧本外角色图标；标准模式下非标准沙盒角色。 |
| 说书人输入 | 如果所选角色未在场，执行角色变化；如果已在场，选择合法但无变化。 |
| 产生的信息 | 角色变化通知；不是镇民能力信息，不受涡流强制假信息影响。 |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | CharacterChangeAttempted；未在场时 CharacterChanged；已在场时 NoChangeBecauseCharacterInPlay；创造恶魔时开启当晚任意死亡窗口。 |
| 禁止产生的领域事件 | 不得拒绝已在场角色选择；不得要求重新选择；不得创建重复角色；不得产生 InvalidTargetRejected。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=NO_SCHEDULED_WAKE；后续=OTHER_NIGHT_ACTION；条件=CHARACTER_CHANGE_NIGHT_ACTION |
| 关联测试 | SV-PITHAG-STANDARD-POOL-ONLY, SV-PITHAG-CREATE-DEMON-ARBITRARY-DEATH, SV-PITHAG-IN-PLAY-CHARACTER-NO-CHANGE, SV-PITHAG-POISONED-NO-CHARACTER-CHANGE, SV-PITHAG-ROLE-CHANGE-NEW-NIGHT-TASK |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/Pit-Hag |
