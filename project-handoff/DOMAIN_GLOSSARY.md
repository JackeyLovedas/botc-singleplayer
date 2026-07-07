# Domain Glossary

| 中文名 | English | 严格定义 | 不应混用 | 推荐代码标识 |
| --- | --- | --- | --- | --- |
| 剧本 | Script | 允许出现在一局游戏中的角色池。 | 实际配板、角色分配 | scriptDefinition |
| 自定义剧本 | Custom Script | 用户选择的角色池配置，必须仍遵守基础规则和产品范围。 | 自定义角色能力脚本 | customScript |
| 设置 | Setup | 根据玩家数和角色规则生成合法配板前的配置过程。 | 角色分配 | gameSetup |
| 分配 | Assignment | 把实际角色秘密分给具体玩家。 | 剧本、配板 | characterAssignment |
| 恶魔伪装 | Demon Bluff | 说书人给恶魔的非在场角色伪装信息。 | 实际角色 | demonBluffs |
| 提醒标记 | Reminder Token | 辅助说书人跟踪持续效果或角色状态的标记。 | 真实状态唯一来源 | reminderToken |
| 醉酒 | Drunk | 能力失效但玩家通常不知道；信息可以正确也可以错误。 | 机械取反 | drunk |
| 中毒 | Poisoned | 因其他能力导致能力失效；信息可以正确也可以错误。 | 机械取反 | poisoned |
| 清醒 | Sober | 未醉酒。 | 健康 | sober |
| 健康 | Healthy | 未中毒。 | 清醒 | healthy |
| 疯狂 | Mad | 玩家需要表现为某个声明或不能表现为某个声明，违背时可能被处决。 | 真实角色 | madnessRequirement |
| 登记 | Register | 某玩家或角色在特定检查中被视为另一阵营、类型或角色。 | 修改实际角色 | registrationCheck |
| 提名 | Nomination | 白天由玩家发起处决候选的公开动作。 | 处决 | nomination |
| 投票 | Vote | 玩家对当前提名进行表决。 | 提名 | vote |
| 上断头台 | On the Block | 当前获得最高票且可能被处决的候选状态。 | 已经处决 | onTheBlock |
| 处决 | Execution | 白天由投票或疯狂等规则造成的唯一处决事件。 | 死亡 | execution |
| 死亡 | Death | 玩家生命状态变为死亡。 | 失去全部能力 | death |
| 放逐 | Exile | 旅行者相关流程，第一版不启用。 | 处决 | exile |
| 真实信息 | True Information | 与 canonical state 相符的信息。 | 可靠信息 | trueInformation |
| 假信息 | False Information | 在角色能力语义下为假的信息。 | 随机信息 | falseInformation |
| 不可靠信息 | Unreliable Information | 因醉酒或中毒等原因不保证真假的信息。 | 假信息 | unreliableInformation |
| 角色变化 | Character Change | 玩家实际角色改变。 | 登记 | characterChange |
| 阵营变化 | Alignment Change | 玩家实际阵营改变。 | 角色变化 | alignmentChange |
| 夜间任务 | Night Task | 夜间队列中的一次唤醒、选择或结算任务。 | 固定数组项 | nightTask |
| 效果实例 | Effect Instance | 持续、暂停、恢复或到期的规则效果。 | 角色本身 | effectInstance |
| 标准状态 | Canonical State | 完整真实游戏状态，只允许规则引擎和说书人视图使用。 | 玩家视图 | canonicalGameState |
| 玩家投影 | Player Projection | 从标准状态投影出的某玩家合法可见信息。 | 全局隐藏状态 | playerProjection |
