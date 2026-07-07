# 20 Character Interactions 角色互动矩阵 v2.1

访问日期：2026-07-06

验证状态：v2.1 targeted patch

| 角色A | 角色B/系统 | 触发场景 | 正确结果 | 关联测试 |
| --- | --- | --- | --- | --- |
| 麻脸巫婆 | 已在场角色 | 选择已在场角色 | 选择合法但无变化；不得拒绝或要求重选 | SV-PITHAG-IN-PLAY-CHARACTER-NO-CHANGE |
| 洗脑师 | 死亡玩家 | 夜间选择死亡玩家 | 死亡玩家获得疯狂要求；可在下一白天或夜晚被疯狂处决 | SV-CERENOVUS-CAN-TARGET-DEAD |
| 洗脑师 | 私聊证据 | 玩家私聊否认疯狂声明 | 自动说书人可读取作裁量证据，但不得泄露给其他玩家 | SV-CERENOVUS-PRIVATE-CONTRADICTION-EVIDENCE |
| 亡骨魔 | 镜像双子 | 亡骨魔亲自杀死镜像双子 | 死亡镜像双子保留善良双子被处决邪恶胜利能力；不保留双方都存活阻断 | SV-VIGORMORTIS-EVILTWIN-GOOD-TWIN-EXECUTED |
| 亡骨魔 | 镜像双子 | 亡骨魔失去能力 | 死亡镜像双子失去保留能力 | SV-VIGORMORTIS-LOSES-ABILITY-EVILTWIN-STOPS |
| 女巫 | 三名存活 | 恶魔夜杀后只剩三名存活玩家 | 女巫诅咒立即移除，第二天原诅咒目标可安全提名 | SV-WITCH-THREE-ALIVE-CURSE-REMOVED |
| 数学家 | 涡流 | 涡流导致镇民信息异常 | 异常写入 MathematicianAbnormalityLedger；数学家最终数字在涡流下也必须为假 | SV-MATHEMATICIAN-VORTOX-ABNORMAL-COUNT |
