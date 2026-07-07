# Test Coverage Summary

- 有效测试总数：76
- 测试文件位置：`tests/25-rule-test-cases.md`
- 覆盖报告位置：`tests/31-test-coverage-report.md`
- 测试 ID 规则：使用 `SV-ROLE-SCENARIO` 风格，必须唯一。
- 规则测试边界：验证规则状态、事件、输入合法性和可见信息；不测试 AI 文风、话术质量或 UI 表现。
- 测试数量不是完成质量的唯一指标；覆盖状态以 `VERIFIED_CORE`、`PARTIAL`、`BLOCKED` 为准。

## 每个角色测试状态

| 角色 | English | 有效测试数 | 覆盖状态 | 实现前是否优先补测 |
| --- | --- | --- | --- | --- |
| 钟表匠 | Clockmaker | 2 | PARTIAL | 是 |
| 筑梦师 | Dreamer | 2 | PARTIAL | 是 |
| 舞蛇人 | Snake Charmer | 1 | PARTIAL | 是 |
| 数学家 | Mathematician | 6 | VERIFIED_CORE | 否 |
| 卖花女孩 | Flowergirl | 2 | PARTIAL | 是 |
| 城镇公告员 | Town Crier | 2 | PARTIAL | 是 |
| 神谕者 | Oracle | 2 | PARTIAL | 是 |
| 博学者 | Savant | 2 | PARTIAL | 是 |
| 女裁缝 | Seamstress | 2 | PARTIAL | 是 |
| 哲学家 | Philosopher | 4 | VERIFIED_CORE | 否 |
| 艺术家 | Artist | 3 | PARTIAL | 是 |
| 杂耍艺人 | Juggler | 2 | PARTIAL | 是 |
| 贤者 | Sage | 2 | PARTIAL | 是 |
| 畸形秀演员 | Mutant | 2 | PARTIAL | 是 |
| 心上人 | Sweetheart | 2 | PARTIAL | 是 |
| 理发师 | Barber | 5 | VERIFIED_CORE | 否 |
| 呆瓜 | Klutz | 2 | PARTIAL | 是 |
| 镜像双子 | Evil Twin | 7 | VERIFIED_CORE | 否 |
| 女巫 | Witch | 5 | VERIFIED_CORE | 否 |
| 洗脑师 | Cerenovus | 6 | VERIFIED_CORE | 否 |
| 麻脸巫婆 | Pit-Hag | 12 | VERIFIED_CORE | 否 |
| 方古 | Fang Gu | 3 | VERIFIED_CORE | 否 |
| 亡骨魔 | Vigormortis | 8 | VERIFIED_CORE | 否 |
| 诺-达鲺 | No Dashii | 4 | VERIFIED_CORE | 否 |
| 涡流 | Vortox | 10 | VERIFIED_CORE | 否 |

## VERIFIED_CORE 角色

Mathematician, Philosopher, Barber, Evil Twin, Witch, Cerenovus, Pit-Hag, Fang Gu, Vigormortis, No Dashii, Vortox

## PARTIAL 角色

Clockmaker, Dreamer, Snake Charmer, Flowergirl, Town Crier, Oracle, Savant, Seamstress, Artist, Juggler, Sage, Mutant, Sweetheart, Klutz

## 参数化测试建议

- 对同一角色的合法目标、非法目标、醉酒/中毒、涡流和角色变化影响使用参数化夹具。
- 不要通过复制模板凑数量；每个用例必须覆盖真实分支。
- `PARTIAL` 角色实现前先补关键互动或失效测试。
