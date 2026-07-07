# 19 Sects And Violets Demons 梦殒春宵恶魔规格 v2.1

访问日期：2026-07-06

验证状态：v2.1 targeted patch

## 方古 / Fang Gu

| 字段 | v2.1规格 |
| --- | --- |
| roleId | fang_gu |
| 名称 | 方古 / Fang Gu |
| 角色类型 | 恶魔 |
| 默认阵营 | Evil |
| 官方能力文本 | Each night*, choose a player: they die. The 1st Outsider this kills becomes an evil Fang Gu & you die instead. [+1 Outsider] |
| 合法目标/输入 | 选择任意玩家 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 非外来者或转移已用则目标死亡；首次有效杀外来者时转移 |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=NO_SCHEDULED_WAKE；后续=OTHER_NIGHT_ACTION；条件=demon kill or transfer |
| 关联测试 | SV-FANGGU-FIRST-OUTSIDER-TRANSFER, SV-FANGGU-KLUTZ-NO-DEATH-ABILITY, SV-FANGGU-SECOND-OUTSIDER-DIES |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/Fang_Gu |

## 亡骨魔 / Vigormortis

| 字段 | v2.1规格 |
| --- | --- |
| roleId | vigormortis |
| 名称 | 亡骨魔 / Vigormortis |
| 角色类型 | 恶魔 |
| 默认阵营 | Evil |
| 官方能力文本 | Each night*, choose a player: they die. Minions you kill keep their ability & poison 1 Townsfolk neighbor. [-1 Outsider] |
| 合法目标/输入 | 选择任意玩家 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 目标死亡；若亲自杀死爪牙，爪牙保留能力并毒一名邻近镇民 |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=NO_SCHEDULED_WAKE；后续=OTHER_NIGHT_ACTION；条件=demon kill plus dead-minion continuous effects |
| 关联测试 | SV-VIGORMORTIS-MINION-KEEPS-ABILITY, SV-VIGORMORTIS-CERENOVUS-DEAD-MINION-ACTS, SV-VIGORMORTIS-LOST-ABILITY-STOPS, SV-VIGORMORTIS-EVILTWIN-GOOD-TWIN-EXECUTED, SV-VIGORMORTIS-EVILTWIN-NO-LIVE-BLOCK, SV-VIGORMORTIS-LOSES-ABILITY-EVILTWIN-STOPS |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/Vigormortis |

## 诺-达鲺 / No Dashii

| 字段 | v2.1规格 |
| --- | --- |
| roleId | no_dashii |
| 名称 | 诺-达鲺 / No Dashii |
| 角色类型 | 恶魔 |
| 默认阵营 | Evil |
| 官方能力文本 | Each night*, choose a player: they die. Your 2 Townsfolk neighbors are poisoned. |
| 合法目标/输入 | 选择任意玩家 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 目标死亡；顺/逆最近镇民中毒 |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=CONTINUOUS_PASSIVE；后续=OTHER_NIGHT_ACTION；条件=neighbor poisoning plus demon kill |
| 关联测试 | SV-NODASHII-SKIPS-NON-TOWNSFOLK, SV-NODASHII-DEAD-TOWNSFOLK-STAYS, SV-NODASHII-ROLE-CHANGE-RECALCULATES, SV-NODASHII-LOST-ABILITY-HEALTHY |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/No_Dashii |

## 涡流 / Vortox

| 字段 | v2.1规格 |
| --- | --- |
| roleId | vortox |
| 名称 | 涡流 / Vortox |
| 角色类型 | 恶魔 |
| 默认阵营 | Evil |
| 官方能力文本 | Each night*, choose a player: they die. Townsfolk abilities yield false info. Each day, if no-one is executed, evil wins. |
| 合法目标/输入 | 选择任意玩家 |
| 非法目标/输入 | NOT_APPLICABLE |
| 说书人输入 | NOT_APPLICABLE |
| 产生的信息 | NOT_APPLICABLE |
| 信息真假约束 | NOT_APPLICABLE |
| 产生的机械效果 | 目标死亡；镇民能力信息必须假；无处决日邪恶胜利 |
| 禁止产生的领域事件 | 不得产生与该角色能力无关的领域事件。 |
| 醉酒/中毒处理 | 能力无效；可模拟可见流程；不得产生真实机械效果。 |
| 死亡处理 | 死亡后通常无能力；亡骨魔亲自杀死爪牙等保留来源单独处理。 |
| 夜间/白天队列 | 首夜=CONTINUOUS_PASSIVE；后续=OTHER_NIGHT_ACTION；条件=false townsfolk info plus dusk execution check |
| 关联测试 | SV-VORTOX-DRUNK-TOWNSFOLK-STILL-FALSE, SV-VORTOX-NO-EXECUTION-EVIL-WINS, SV-VORTOX-EXECUTION-NO-DEATH-SATISFIES, SV-VORTOX-POISONED-NO-FORCED-FALSE, SV-VORTOX-ROLE-CHANGE-STARTS-FORCED-FALSE, SV-MATHEMATICIAN-VORTOX-ABNORMAL-COUNT |
| 覆盖状态 | VERIFIED_CORE |
| 规则来源 | https://wiki.bloodontheclocktower.com/Vortox |
