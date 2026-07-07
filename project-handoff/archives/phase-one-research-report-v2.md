# 第一阶段：梦殒春宵12人规则研究报告 v2

访问日期：2026-07-06

## 1. 已修复BLOCKER

- DEF-001 测试模板复制：已重写并去重。
- DEF-002 夜间任务遗漏/错误：已用任务类型表覆盖25个角色。
- DEF-003 角色规格不可实现：已为25个角色建立字段化规格。
- DEF-004 胜利冲突裁量兜底：已删除，改为确定性解析或BLOCKER。

## 2. 剩余BLOCKER

- 0。

## 3. 测试去重前后数量

- 原测试数：287。
- 完全重复组数：9。
- 重复测试数：215。
- 最终有效测试数：51。

## 4. 25个角色的有效测试数量

| 角色 | English | 有效测试数量 |
| --- | --- | --- |
| 钟表匠 | Clockmaker | 2 |
| 筑梦师 | Dreamer | 1 |
| 舞蛇人 | Snake Charmer | 1 |
| 数学家 | Mathematician | 1 |
| 卖花女孩 | Flowergirl | 1 |
| 城镇公告员 | Town Crier | 1 |
| 神谕者 | Oracle | 1 |
| 博学者 | Savant | 1 |
| 女裁缝 | Seamstress | 1 |
| 哲学家 | Philosopher | 4 |
| 艺术家 | Artist | 1 |
| 杂耍艺人 | Juggler | 1 |
| 贤者 | Sage | 1 |
| 畸形秀演员 | Mutant | 2 |
| 心上人 | Sweetheart | 1 |
| 理发师 | Barber | 5 |
| 呆瓜 | Klutz | 2 |
| 镜像双子 | Evil Twin | 4 |
| 女巫 | Witch | 1 |
| 洗脑师 | Cerenovus | 2 |
| 麻脸巫婆 | Pit-Hag | 10 |
| 方古 | Fang Gu | 3 |
| 亡骨魔 | Vigormortis | 5 |
| 诺-达鲺 | No Dashii | 4 |
| 涡流 | Vortox | 7 |

## 5. 夜间任务完整性

- 25/25 角色均在 `10-night-order.md` 中列出。
- 已覆盖 FIRST_NIGHT_INFORMATION、EVERY_NIGHT_ACTION、OTHER_NIGHT_ACTION、UNTIL_USED_NIGHT_ACTION、CONDITIONAL_NIGHT_TRIGGER、DEATH_TRIGGER_RESOLVED_AT_NIGHT、FIRST_DAY_THEN_NIGHT_INFORMATION、DAY_ACTION、DAY_PASSIVE、CONTINUOUS_PASSIVE、NO_SCHEDULED_WAKE。

## 6. 已关闭open questions

- 麻脸巫婆池外角色、理发师死亡玩家/恶魔自己/阵营交换、亡骨魔持续期限、诺-达鲺死亡镇民与角色变化重算均已关闭。详见 `open-question-resolution.md`。

## 7. 尚未关闭的问题

- 保留4项：非标准沙盒政策、私聊是否计入疯狂证据、罕见多胜利同步官方判例、涡流复合信息候选集合算法。均已标注临时策略和阻塞范围。

## 8. 错误测试引用修复结果

- TC-070、TC-071、TC-086、TC-089、TC-090、TC-095 均替换为存在且场景匹配的新测试编号。详见 `29-cross-reference-audit.md`。

## 9. 第一阶段是否真正通过

- 通过 v2 规则规格验收。
- 通过范围：梦殒春宵12人标准规则研究规格、夜间任务、角色规格、关键互动、测试套件和审计文档。
- 限制：不得自行进入技术架构、UI、AI代码、规则引擎、Electron 或 Windows 打包。
