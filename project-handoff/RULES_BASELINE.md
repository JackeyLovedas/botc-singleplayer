# Rules Baseline

## 1. 已确认规则模块

| 模块 | 状态 | 主要文件 | 说明 |
| --- | --- | --- | --- |
| 12人基础类型构成 | VERIFIED_CORE | 07-twelve-player-setup.md | 12 人《梦殒春宵》固定范围 |
| 方古配置修正 | VERIFIED_CORE | 07-twelve-player-setup.md; 19-sects-and-violets-demons.md | 12 人局外来者数量修正 |
| 亡骨魔配置修正 | VERIFIED_CORE | 07-twelve-player-setup.md; 19-sects-and-violets-demons.md | 爪牙死亡保留能力和邻近镇民中毒 |
| 自定义剧本 | PRODUCT_POLICY | 06-custom-script.md | 定义角色池，不等于实际配板 |
| 配板 | VERIFIED_CORE | 08-setup-generator.md | 合法配板与固定随机种子 |
| 角色分配 | VERIFIED_CORE | 05-script-setup-assignment.md | 实际角色从当前剧本池产生 |
| 恶魔伪装 | VERIFIED_CORE | 05-script-setup-assignment.md | 恶魔伪装与实际角色分离 |
| 提名 | VERIFIED_CORE | 09-nomination-voting-execution.md | 提名资格与公开流程 |
| 投票 | VERIFIED_CORE | 09-nomination-voting-execution.md | 投票、上断头台和打破平票 |
| 处决 | VERIFIED_CORE | 09-nomination-voting-execution.md | 每日最多一次处决 |
| 死亡 | VERIFIED_CORE | 03-game-flow.md; 09-nomination-voting-execution.md | 死亡不等于失去全部能力，需按角色判定 |
| 醉酒 | VERIFIED_CORE | 11-drunk-and-poison.md | 不等于信息取反 |
| 中毒 | VERIFIED_CORE | 11-drunk-and-poison.md | 不等于信息取反 |
| 涡流强制假信息 | VERIFIED_CORE | 12-information-model.md; 19-sects-and-violets-demons.md | 按角色能力语义强制为假 |
| 疯狂 | VERIFIED_CORE | 14-madness-system.md | 含洗脑师、畸形秀演员、私聊证据和处决限制 |
| 角色变化 | VERIFIED_CORE | 15-character-and-alignment-changes.md | 麻脸巫婆、理发师、方古等动态变化 |
| 阵营变化 | VERIFIED_CORE | 15-character-and-alignment-changes.md | 阵营状态与角色状态分离 |
| 夜间任务 | VERIFIED_CORE | 10-night-order.md | 动态队列，不使用单一永久顺序数组 |
| 胜利检查 | VERIFIED_CORE | 21-special-win-conditions.md | 特殊胜利和同步胜利组合 |
| AI信息隔离 | VERIFIED_CORE | 22-twelve-player-ai-model.md | AI 只能读取合法视图 |
| 旅行者 | OUT_OF_SCOPE | PRODUCT_SCOPE.md | 第一版不启用 |
| 传奇角色 | OUT_OF_SCOPE | PRODUCT_SCOPE.md | 第一版不启用 |
| 实验角色 | OUT_OF_SCOPE | PRODUCT_SCOPE.md | 第一版不启用 |

## 2. 25 个角色状态

| 角色 | 英文名 | 状态 | 有效测试数 | 主要规格文件 | 关联测试 | 实现前是否需要补测 |
| --- | --- | --- | --- | --- | --- | --- |
| 钟表匠 | Clockmaker | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-CLOCKMAKER-FIRST-NIGHT-DISTANCE, SV-PHILOSOPHER-FIRST-NIGHT-ABILITY-IMMEDIATE | 是 |
| 筑梦师 | Dreamer | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-DREAMER-POISONED-INFO-UNRELIABLE, SV-DREAMER-VALID-TARGETS | 是 |
| 舞蛇人 | Snake Charmer | PARTIAL | 1 | rules/18-sects-and-violets-roles.md | SV-SNAKECHARMER-DEMON-SWAP | 是 |
| 数学家 | Mathematician | VERIFIED_CORE | 6 | rules/18-sects-and-violets-roles.md | SV-MATHEMATICIAN-ABNORMAL-COUNT, SV-MATHEMATICIAN-DOES-NOT-COUNT-SELF, SV-MATHEMATICIAN-POISONED-FALSE-INFO-ABNORMAL, SV-MATHEMATICIAN-POISONED-TRUE-INFO-NOT-ABNORMAL, SV-MATHEMATICIAN-VORTOX-ABNORMAL-COUNT, SV-ORACLE-POISONED-FALSE-COUNT | 否 |
| 卖花女孩 | Flowergirl | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-FLOWERGIRL-DEMON-VOTED, SV-FLOWERGIRL-VORTOX-FALSE | 是 |
| 城镇公告员 | Town Crier | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-TOWNCRIER-MINION-NOMINATED, SV-TOWNCRIER-VORTOX-FALSE | 是 |
| 神谕者 | Oracle | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-ORACLE-DEAD-EVIL-COUNT, SV-ORACLE-POISONED-FALSE-COUNT | 是 |
| 博学者 | Savant | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-SAVANT-POISONED-STATEMENTS-UNRELIABLE, SV-SAVANT-VORTOX-BOTH-FALSE | 是 |
| 女裁缝 | Seamstress | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-SEAMSTRESS-DEFER-THEN-USE, SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND | 是 |
| 哲学家 | Philosopher | VERIFIED_CORE | 4 | rules/18-sects-and-violets-roles.md | SV-PHILOSOPHER-FIRST-NIGHT-ABILITY-IMMEDIATE, SV-PHILOSOPHER-ORIGINAL-DRUNK, SV-PHILOSOPHER-POISONED-NO-GAIN, SV-PHILOSOPHER-ROLE-CHANGE-REMOVES-DRUNK | 否 |
| 艺术家 | Artist | PARTIAL | 3 | rules/18-sects-and-violets-roles.md | SV-ARTIST-POISONED-ANSWER-UNRELIABLE, SV-ARTIST-VORTOX-FALSE-YESNO, SV-PHILOSOPHER-ORIGINAL-DRUNK | 是 |
| 杂耍艺人 | Juggler | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-JUGGLER-DRUNK-GUESS-SOBER-INFO-TRUE, SV-JUGGLER-FIRST-DAY-THEN-NIGHT | 是 |
| 贤者 | Sage | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-SAGE-DEMON-KILL-CANDIDATES, SV-SAGE-PITHAG-DEATH-NO_WAKE | 是 |
| 畸形秀演员 | Mutant | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-CERENOVUS-MUTANT-DUAL-MADNESS, SV-MUTANT-MADNESS-NOT-KEYWORD | 是 |
| 心上人 | Sweetheart | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-SWEETHEART-DEATH-DRUNK, SV-SWEETHEART-POISONED-DEATH-NO-DRUNK | 是 |
| 理发师 | Barber | VERIFIED_CORE | 5 | rules/18-sects-and-violets-roles.md | SV-BARBER-BECOMES-AFTER-DEATH-NO-RETRO, SV-BARBER-DEMON-CHOOSES-SELF, SV-BARBER-NO-ALIGNMENT-SWAP, SV-BARBER-POISONED-NO-SWAP-TASK, SV-BARBER-SWAP-DEAD-PLAYER | 否 |
| 呆瓜 | Klutz | PARTIAL | 2 | rules/18-sects-and-violets-roles.md | SV-FANGGU-KLUTZ-NO-DEATH-ABILITY, SV-KLUTZ-CHOOSES-EVIL-LOSES | 是 |
| 镜像双子 | Evil Twin | VERIFIED_CORE | 7 | rules/18-sects-and-violets-roles.md | SV-EVILTWIN-DEAD-NO-LONGER-BLOCKS, SV-EVILTWIN-FIRST-NIGHT-PAIR, SV-EVILTWIN-GOOD-TWIN-EXECUTED, SV-EVILTWIN-ROLE-CHANGE-REPAIR-PAIR, SV-VIGORMORTIS-EVILTWIN-GOOD-TWIN-EXECUTED, SV-VIGORMORTIS-EVILTWIN-NO-LIVE-BLOCK, SV-VIGORMORTIS-LOSES-ABILITY-EVILTWIN-STOPS | 否 |
| 女巫 | Witch | VERIFIED_CORE | 5 | rules/18-sects-and-violets-roles.md | SV-VIGORMORTIS-MINION-KEEPS-ABILITY, SV-WITCH-CURSE-LASTS-ONE-DAY, SV-WITCH-CURSED-NOMINATOR-DIES, SV-WITCH-DEAD-TARGET-LEGAL, SV-WITCH-THREE-ALIVE-CURSE-REMOVED | 否 |
| 洗脑师 | Cerenovus | VERIFIED_CORE | 6 | rules/18-sects-and-violets-roles.md | SV-CERENOVUS-CAN-TARGET-DEAD, SV-CERENOVUS-EXECUTION-USES-DAILY-EXECUTION, SV-CERENOVUS-MUTANT-DUAL-MADNESS, SV-CERENOVUS-POISONED-NO-MADNESS, SV-CERENOVUS-PRIVATE-CONTRADICTION-EVIDENCE, SV-VIGORMORTIS-CERENOVUS-DEAD-MINION-ACTS | 否 |
| 麻脸巫婆 | Pit-Hag | VERIFIED_CORE | 12 | rules/18-sects-and-violets-roles.md | SV-BARBER-BECOMES-AFTER-DEATH-NO-RETRO, SV-EVILTWIN-ROLE-CHANGE-REPAIR-PAIR, SV-NODASHII-ROLE-CHANGE-RECALCULATES, SV-PHILOSOPHER-ROLE-CHANGE-REMOVES-DRUNK, SV-PITHAG-CREATE-DEMON-ARBITRARY-DEATH, SV-PITHAG-IN-PLAY-CHARACTER-NO-CHANGE, SV-PITHAG-POISONED-NO-CHARACTER-CHANGE, SV-PITHAG-ROLE-CHANGE-NEW-NIGHT-TASK, SV-PITHAG-STANDARD-POOL-ONLY, SV-SAGE-PITHAG-DEATH-NO_WAKE, SV-VIGORMORTIS-DEAD-MINION-CHANGES-NON-MINION, SV-VORTOX-ROLE-CHANGE-STARTS-FORCED-FALSE | 否 |
| 方古 | Fang Gu | VERIFIED_CORE | 3 | rules/19-sects-and-violets-demons.md | SV-FANGGU-FIRST-OUTSIDER-TRANSFER, SV-FANGGU-KLUTZ-NO-DEATH-ABILITY, SV-FANGGU-SECOND-OUTSIDER-DIES | 否 |
| 亡骨魔 | Vigormortis | VERIFIED_CORE | 8 | rules/19-sects-and-violets-demons.md | SV-VIGORMORTIS-CERENOVUS-DEAD-MINION-ACTS, SV-VIGORMORTIS-DEAD-MINION-CHANGES-NON-MINION, SV-VIGORMORTIS-EVILTWIN-GOOD-TWIN-EXECUTED, SV-VIGORMORTIS-EVILTWIN-NO-LIVE-BLOCK, SV-VIGORMORTIS-LOSES-ABILITY-EVILTWIN-STOPS, SV-VIGORMORTIS-LOST-ABILITY-STOPS, SV-VIGORMORTIS-MINION-KEEPS-ABILITY, SV-VIGORMORTIS-POISONED-KILL-SIMULATED | 否 |
| 诺-达鲺 | No Dashii | VERIFIED_CORE | 4 | rules/19-sects-and-violets-demons.md | SV-NODASHII-DEAD-TOWNSFOLK-STAYS, SV-NODASHII-LOST-ABILITY-HEALTHY, SV-NODASHII-ROLE-CHANGE-RECALCULATES, SV-NODASHII-SKIPS-NON-TOWNSFOLK | 否 |
| 涡流 | Vortox | VERIFIED_CORE | 10 | rules/19-sects-and-violets-demons.md | SV-ARTIST-VORTOX-FALSE-YESNO, SV-FLOWERGIRL-VORTOX-FALSE, SV-MATHEMATICIAN-VORTOX-ABNORMAL-COUNT, SV-SAVANT-VORTOX-BOTH-FALSE, SV-TOWNCRIER-VORTOX-FALSE, SV-VORTOX-DRUNK-TOWNSFOLK-STILL-FALSE, SV-VORTOX-EXECUTION-NO-DEATH-SATISFIES, SV-VORTOX-NO-EXECUTION-EVIL-WINS, SV-VORTOX-POISONED-NO-FORCED-FALSE, SV-VORTOX-ROLE-CHANGE-STARTS-FORCED-FALSE | 否 |

不得改变现有覆盖状态。`PARTIAL` 表示已有关键测试但不能宣称完整；实现前需要补充对应测试。

## 3. 规则来源优先级

1. 当前有效官方英文百科。
2. 官方角色页面和运行说明。
3. 官方基础规则。
4. 中文百科用于翻译和本地化交叉检查。
5. 产品策略不得伪装成官方规则。

## 4. 版本锁定

- Phase One 版本：Phase One v2.1
- 交接日期：2026-07-06
- 相关 ZIP：`archives/phase-one-research-package-v2.zip`，`archives/phase-one-v2.1-patch.zip`
- 规则文档目录：`rules/`
- 测试文档目录：`tests/`
- 当前有效测试数：76
- 当前阶段状态：有条件通过
- 当前无 `blocksDevelopment = Yes` 问题
