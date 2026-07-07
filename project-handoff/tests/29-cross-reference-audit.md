# 29 Cross Reference Audit 交叉引用审计

访问日期：2026-07-06

验证状态：v2 references verified

| sourceFile | sourceSection | oldTestId | actualOldTestTitle | matchedOrNot | newTestId | newTestTitle | status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 20-character-interactions.md | 心上人死亡 | TC-070 | 12人配板与角色分配 扩展用例 23 | matched=no | SV-SWEETHEART-DEATH-DRUNK | 心上人死亡造成一名玩家醉酒 | fixed |
| 20-character-interactions.md | 舞蛇人与恶魔 | TC-071 | 12人配板与角色分配 扩展用例 24 | matched=no | SV-SNAKECHARMER-DEMON-SWAP | 舞蛇人选中恶魔交换角色和阵营 | fixed |
| 20-character-interactions.md | 方古与呆瓜 | TC-086 | 自定义剧本 扩展用例 14 | matched=no | SV-FANGGU-KLUTZ-NO-DEATH-ABILITY | 方古转移到呆瓜不触发呆瓜死亡能力 | fixed |
| 20-character-interactions.md | 亡骨魔与洗脑师 | TC-089 | 自定义剧本 扩展用例 17 | matched=no | SV-VIGORMORTIS-CERENOVUS-DEAD-MINION-ACTS | 亡骨魔杀死的洗脑师死亡后继续行动 | fixed |
| 20-character-interactions.md | 洗脑师与畸形秀演员 | TC-090 | 自定义剧本 扩展用例 18 | matched=no | SV-CERENOVUS-MUTANT-DUAL-MADNESS | 洗脑师与畸形秀演员疯狂约束分开 | fixed |
| 20-character-interactions.md | 哲学家与原角色 | TC-095 | 醉酒、中毒和信息真假 扩展用例 5 | matched=no | SV-PHILOSOPHER-ORIGINAL-DRUNK | 哲学家选择在场角色使原角色醉酒 | fixed |

自动检查结论：所有 `newTestId` 均存在于 `25-rule-test-cases.md`，并且角色/场景与引用行一致。
