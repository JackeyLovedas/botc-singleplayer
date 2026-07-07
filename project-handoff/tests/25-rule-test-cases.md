# 25 Rule Test Cases 规则测试用例

访问日期：2026-07-06

验证状态：v2.1 targeted test patch

最终有效测试数：76

v2.1 只新增和修正定向测试；未重新扩充无关模板测试。

## SV-CLOCKMAKER-FIRST-NIGHT-DISTANCE 钟表匠首夜计算最近爪牙距离

- testId: SV-CLOCKMAKER-FIRST-NIGHT-DISTANCE
- title: 钟表匠首夜计算最近爪牙距离
- characters: Clockmaker
- ruleIds: clockmaker.distance
- preconditions: 钟表匠清醒健康且首夜
- canonicalState: 恶魔与两名爪牙有座位距离；一个邪恶旅行者邻近恶魔
- playerVisibleState: 钟表匠只知道自己角色
- Given: 恶魔顺时针3步有爪牙，逆时针2步有邪恶旅行者后4步有爪牙
- When: 首夜唤醒钟表匠
- Then: 给出数字3或4中的最近真实爪牙距离；邪恶旅行者不计为爪牙，本例应给3
- expectedEvents: InformationDelivered(distance=3)
- forbiddenEvents: CharacterChanged; DeathResolved
- expectedStateChanges: clockmaker.abilitySpent=true
- forbiddenStateChanges: countEvilTravellerAsMinion=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Clockmaker
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-SEAMSTRESS-DEFER-THEN-USE 女裁缝可延后并在使用后退出队列

- testId: SV-SEAMSTRESS-DEFER-THEN-USE
- title: 女裁缝可延后并在使用后退出队列
- characters: Seamstress
- ruleIds: seamstress.once
- preconditions: 女裁缝未使用能力
- canonicalState: 两个目标阵营相同
- playerVisibleState: 女裁缝知道自己未使用
- Given: 前三夜女裁缝摇头不使用
- When: 第四夜选择两名非自己玩家
- Then: 收到 yes；能力标记为已使用；后续夜不再唤醒
- expectedEvents: InformationDelivered(yes); AbilitySpent
- forbiddenEvents: AbilitySpent before target choice
- expectedStateChanges: nightQueue.remove(seamstress)
- forbiddenStateChanges: wakeSeamstressAfterSpent=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Seamstress
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-PHILOSOPHER-ORIGINAL-DRUNK 哲学家选择在场角色使原角色醉酒

- testId: SV-PHILOSOPHER-ORIGINAL-DRUNK
- title: 哲学家选择在场角色使原角色醉酒
- characters: Philosopher, Artist
- ruleIds: philosopher.gain, drunk.source
- preconditions: 哲学家清醒健康且未使用；艺术家在场
- canonicalState: artistPlayer.sober=true
- playerVisibleState: 哲学家只知道自己选择
- Given: 哲学家选择艺术家能力
- When: 哲学家能力结算
- Then: 哲学家获得艺术家能力但actualCharacter仍为Philosopher；原艺术家醉酒
- expectedEvents: AbilityGained(Artist); DrunkApplied(source=Philosopher)
- forbiddenEvents: CharacterChanged(Philosopher,Artist)
- expectedStateChanges: philosopher.gainedAbility=Artist; artist.drunk=true
- forbiddenStateChanges: philosopher.actualCharacter=Artist
- sourceUrl: https://wiki.bloodontheclocktower.com/Philosopher
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-PHILOSOPHER-FIRST-NIGHT-ABILITY-IMMEDIATE 哲学家获得首夜能力当晚立即处理

- testId: SV-PHILOSOPHER-FIRST-NIGHT-ABILITY-IMMEDIATE
- title: 哲学家获得首夜能力当晚立即处理
- characters: Philosopher, Clockmaker
- ruleIds: philosopher.firstNightAbility
- preconditions: 哲学家夜间选择钟表匠能力
- canonicalState: 恶魔与最近爪牙距离已知
- playerVisibleState: 哲学家不知道距离
- Given: 哲学家在第三夜选择钟表匠
- When: 选择结算后
- Then: 当晚立即给哲学家一次钟表匠距离信息
- expectedEvents: AbilityGained(Clockmaker); InformationDelivered(distance)
- forbiddenEvents: waitUntilNextGame
- expectedStateChanges: philosopher.hasStartKnowingResult=true
- forbiddenStateChanges: skipStartKnowing=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Philosopher
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-EVILTWIN-FIRST-NIGHT-PAIR 镜像双子首夜互认

- testId: SV-EVILTWIN-FIRST-NIGHT-PAIR
- title: 镜像双子首夜互认
- characters: Evil Twin
- ruleIds: evilTwin.firstNight
- preconditions: 镜像双子入场且说书人指定善良双子
- canonicalState: evilTwin.alive=true; goodTwin.alive=true
- playerVisibleState: 两人未互认
- Given: 首夜到达镜像双子任务
- When: 同时唤醒两名双子
- Then: 双方互认；善良双子得知镜像双子角色，镜像双子得知善良双子角色
- expectedEvents: TwinInfoDelivered
- forbiddenEvents: NoScheduledWake
- expectedStateChanges: twinPair.active=true
- forbiddenStateChanges: skipMutualRecognition=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Evil_Twin
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-EVILTWIN-GOOD-TWIN-EXECUTED 善良双子被处决邪恶胜利

- testId: SV-EVILTWIN-GOOD-TWIN-EXECUTED
- title: 善良双子被处决邪恶胜利
- characters: Evil Twin
- ruleIds: evilTwin.win
- preconditions: 两名双子都存活且镜像双子能力有效
- canonicalState: goodTwin.alignment=Good
- playerVisibleState: 公开处决事件即将发生
- Given: 善良双子被合法处决
- When: 处决结算后胜利检查
- Then: 输出邪恶胜利
- expectedEvents: ExecutionResolved; VictoryDeclared(Evil)
- forbiddenEvents: StorytellerChoosesWinner
- expectedStateChanges: game.winner=Evil
- forbiddenStateChanges: continueGame=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Evil_Twin
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-JUGGLER-FIRST-DAY-THEN-NIGHT 杂耍艺人首日猜测当晚给数量

- testId: SV-JUGGLER-FIRST-DAY-THEN-NIGHT
- title: 杂耍艺人首日猜测当晚给数量
- characters: Juggler
- ruleIds: juggler.guess
- preconditions: 首日杂耍艺人公开声明使用能力并清醒健康
- canonicalState: 三组公开猜测中两个正确
- playerVisibleState: 所有玩家听到猜测，不知道正确数
- Given: 杂耍艺人公开三组玩家-角色猜测
- When: 当晚唤醒杂耍艺人
- Then: 给出数字2并清除CORRECT提醒
- expectedEvents: PublicGuessRecorded; InformationDelivered(count=2)
- forbiddenEvents: PrivateGuessAccepted
- expectedStateChanges: juggler.nightTokenRemoved=true
- forbiddenStateChanges: leaveCorrectRemindersVisible=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Juggler
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-SAGE-DEMON-KILL-CANDIDATES 贤者被恶魔杀死获得两个候选

- testId: SV-SAGE-DEMON-KILL-CANDIDATES
- title: 贤者被恶魔杀死获得两个候选
- characters: Sage
- ruleIds: sage.demonKill
- preconditions: 贤者清醒健康
- canonicalState: 恶魔A夜间杀死贤者
- playerVisibleState: 贤者不知道恶魔
- Given: 恶魔击杀贤者
- When: 死亡结算后
- Then: 唤醒贤者并展示两个玩家，其中一个是恶魔A
- expectedEvents: DeathResolved(Sage); InformationDelivered(twoCandidates)
- forbiddenEvents: ExecutionResolved
- expectedStateChanges: sage.receivedCandidates.includes(demonA)=true
- forbiddenStateChanges: bothCandidatesNonDemon=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Sage
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-SWEETHEART-DEATH-DRUNK 心上人死亡造成一名玩家醉酒

- testId: SV-SWEETHEART-DEATH-DRUNK
- title: 心上人死亡造成一名玩家醉酒
- characters: Sweetheart
- ruleIds: sweetheart.death
- preconditions: 心上人清醒健康
- canonicalState: 候选玩家B可被醉酒
- playerVisibleState: 公开只知道心上人死亡
- Given: 心上人死亡
- When: 死亡触发结算
- Then: 一名玩家开始醉酒并记录来源Sweetheart
- expectedEvents: DeathResolved(Sweetheart); DrunkApplied
- forbiddenEvents: AlignmentChanged
- expectedStateChanges: target.drunk=true
- forbiddenStateChanges: publicRevealDrunkTarget=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Sweetheart
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-SNAKECHARMER-DEMON-SWAP 舞蛇人选中恶魔交换角色和阵营

- testId: SV-SNAKECHARMER-DEMON-SWAP
- title: 舞蛇人选中恶魔交换角色和阵营
- characters: Snake Charmer, Demon
- ruleIds: snakeCharmer.swap
- preconditions: 舞蛇人清醒健康且选择存活恶魔
- canonicalState: snake=Good Snake Charmer; demon=Evil Fang Gu
- playerVisibleState: 双方只知自身旧身份
- Given: 舞蛇人夜间选择恶魔
- When: 能力结算
- Then: 双方交换角色和阵营；原恶魔现为善良舞蛇人且中毒
- expectedEvents: CharacterChanged; AlignmentChanged; PoisonedApplied(oldDemon)
- forbiddenEvents: DeathResolved
- expectedStateChanges: snake.actualCharacter=FangGu; snake.alignment=Evil
- forbiddenStateChanges: oldDemon.learnsMinionsAgain=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Snake_Charmer
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-BARBER-SWAP-DEAD-PLAYER 理发师允许交换死亡玩家

- testId: SV-BARBER-SWAP-DEAD-PLAYER
- title: 理发师允许交换死亡玩家
- characters: Barber
- ruleIds: barber.swap
- preconditions: 理发师今天死亡且能力有效
- canonicalState: 恶魔选择存活玩家A和死亡玩家B
- playerVisibleState: 玩家不知道将被交换
- Given: 夜晚唤醒恶魔选择A与B
- When: 恶魔确认交换
- Then: A与B交换角色并分别得知新角色；阵营不变
- expectedEvents: CharacterTokensSwapped; NewCharacterInfoDelivered
- forbiddenEvents: AlignmentChanged
- expectedStateChanges: A.character=oldB; B.character=oldA
- forbiddenStateChanges: rejectDeadTarget=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Barber
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-BARBER-DEMON-CHOOSES-SELF 理发师允许恶魔选择自己

- testId: SV-BARBER-DEMON-CHOOSES-SELF
- title: 理发师允许恶魔选择自己
- characters: Barber, Demon
- ruleIds: barber.self
- preconditions: 理发师死亡当晚
- canonicalState: 恶魔选择自己和非恶魔玩家A
- playerVisibleState: 恶魔知道理发师死亡任务
- Given: 恶魔选择自己与A
- When: 交换结算
- Then: 恶魔与A交换角色但阵营不变；若恶魔变为非恶魔角色仍为邪恶
- expectedEvents: CharacterTokensSwapped
- forbiddenEvents: RejectSelfSelection
- expectedStateChanges: demon.character=oldA; A.character=oldDemon
- forbiddenStateChanges: alignmentSwapped=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Barber
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-BARBER-NO-ALIGNMENT-SWAP 理发师只交换角色不交换阵营

- testId: SV-BARBER-NO-ALIGNMENT-SWAP
- title: 理发师只交换角色不交换阵营
- characters: Barber
- ruleIds: barber.alignment
- preconditions: 理发师交换发生
- canonicalState: 善良玩家A与邪恶玩家B交换角色
- playerVisibleState: 双方将被告知新角色
- Given: 角色标记交换
- When: 通知玩家
- Then: A仍善良，B仍邪恶；若角色颜色不匹配可倒置标记提醒
- expectedEvents: CharacterTokensSwapped; AlignmentPreserved
- forbiddenEvents: AlignmentChanged
- expectedStateChanges: A.alignment=Good; B.alignment=Evil
- forbiddenStateChanges: swapMemories=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Barber
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-FANGGU-FIRST-OUTSIDER-TRANSFER 方古首次有效杀外来者转移

- testId: SV-FANGGU-FIRST-OUTSIDER-TRANSFER
- title: 方古首次有效杀外来者转移
- characters: Fang Gu, Outsider
- ruleIds: fangGu.transfer
- preconditions: 方古清醒健康，ONCE未放置
- canonicalState: 目标外来者存活且本应被杀死
- playerVisibleState: 目标不知道会转化
- Given: 方古夜间选择外来者
- When: 杀戮结算
- Then: 目标成为邪恶方古且不死亡；原方古死亡；ONCE永久消耗；新方古不自动知道爪牙
- expectedEvents: DeathResolved(oldFangGu); CharacterChanged(target,FangGu); AlignmentChanged(target,Evil); FangGuOnceConsumed
- forbiddenEvents: DeathResolved(target); TargetDeathAbilityTriggered
- expectedStateChanges: target.alive=true; oldFangGu.alive=false
- forbiddenStateChanges: target.learnsMinions=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Fang_Gu
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-FANGGU-KLUTZ-NO-DEATH-ABILITY 方古转移到呆瓜不触发呆瓜死亡能力

- testId: SV-FANGGU-KLUTZ-NO-DEATH-ABILITY
- title: 方古转移到呆瓜不触发呆瓜死亡能力
- characters: Fang Gu, Klutz
- ruleIds: fangGu.klutz
- preconditions: 方古首次有效攻击呆瓜且呆瓜为外来者
- canonicalState: klutz.alive=true; fangGuOnce=false
- playerVisibleState: 呆瓜不知道即将变恶魔
- Given: 方古选择呆瓜
- When: 结算转移
- Then: 呆瓜成为邪恶方古并存活；原方古死亡；呆瓜不公开选择玩家
- expectedEvents: CharacterChanged(Klutz,FangGu); AlignmentChanged(Evil); DeathResolved(oldFangGu)
- forbiddenEvents: DeathResolved(Klutz); KlutzChoicePrompted
- expectedStateChanges: klutz.alive=true
- forbiddenStateChanges: klutz.teamLosesCheck=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Fang_Gu
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-FANGGU-SECOND-OUTSIDER-DIES 方古转移机会消耗后外来者正常死亡

- testId: SV-FANGGU-SECOND-OUTSIDER-DIES
- title: 方古转移机会消耗后外来者正常死亡
- characters: Fang Gu, Outsider
- ruleIds: fangGu.once
- preconditions: ONCE已在魔典中心
- canonicalState: 新方古攻击外来者
- playerVisibleState: 目标只知自己角色
- Given: 方古选择外来者
- When: 杀戮结算
- Then: 目标死亡，不发生第二次转移
- expectedEvents: DeathResolved(target)
- forbiddenEvents: CharacterChanged(target,FangGu); AlignmentChanged(target,Evil)
- expectedStateChanges: target.alive=false
- forbiddenStateChanges: fangGuOnce=false
- sourceUrl: https://wiki.bloodontheclocktower.com/Fang_Gu
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-VIGORMORTIS-MINION-KEEPS-ABILITY 亡骨魔亲自杀死爪牙保留能力

- testId: SV-VIGORMORTIS-MINION-KEEPS-ABILITY
- title: 亡骨魔亲自杀死爪牙保留能力
- characters: Vigormortis, Minion, Witch
- ruleIds: vigormortis.deadMinion
- preconditions: 亡骨魔清醒健康
- canonicalState: 亡骨魔选择爪牙Witch
- playerVisibleState: 公开只会看到夜间死亡
- Given: 亡骨魔夜间杀死女巫
- When: 死亡结算
- Then: 女巫死亡但保留能力；说书人在两个方向最近镇民中选一名中毒
- expectedEvents: DeathResolved(Witch); DeadMinionKeepsAbility; PoisonedApplied
- forbiddenEvents: RemoveMinionAbility
- expectedStateChanges: witch.alive=false; witch.hasAbility=true
- forbiddenStateChanges: poisonOutsider=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vigormortis
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-VIGORMORTIS-CERENOVUS-DEAD-MINION-ACTS 亡骨魔杀死的洗脑师死亡后继续行动

- testId: SV-VIGORMORTIS-CERENOVUS-DEAD-MINION-ACTS
- title: 亡骨魔杀死的洗脑师死亡后继续行动
- characters: Vigormortis, Cerenovus
- ruleIds: vigormortis.cerenovus
- preconditions: 亡骨魔曾亲自杀死洗脑师且亡骨魔仍有能力
- canonicalState: cerenovus.alive=false; cerenovus.hasAbility=true
- playerVisibleState: 玩家知道洗脑师死亡
- Given: 夜间到达洗脑师槽
- When: 死亡洗脑师被唤醒
- Then: 可选择玩家和善良角色创建疯狂要求
- expectedEvents: NightWake(Cerenovus); MadnessRequirementCreated
- forbiddenEvents: SkipDeadMinionAbility
- expectedStateChanges: cerenovus.lastChoiceRecorded=true
- forbiddenStateChanges: cerenovusCannotActBecauseDead=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vigormortis
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-VIGORMORTIS-LOST-ABILITY-STOPS 亡骨魔失去能力停止死亡爪牙效果

- testId: SV-VIGORMORTIS-LOST-ABILITY-STOPS
- title: 亡骨魔失去能力停止死亡爪牙效果
- characters: Vigormortis
- ruleIds: vigormortis.suppression
- preconditions: 亡骨魔亲自杀死过两个爪牙
- canonicalState: 两个死亡爪牙保留能力且各毒一名镇民
- playerVisibleState: 公开知道死亡但不知道中毒
- Given: 亡骨魔死亡或变成非亡骨魔
- When: 持续效果重算
- Then: 死亡爪牙不再保留能力；由亡骨魔造成的中毒移除
- expectedEvents: EffectRemoved(deadMinionAbility); PoisonedRemoved
- forbiddenEvents: KeepDeadMinionAbilityActive
- expectedStateChanges: poisonTargets.healthy=true
- forbiddenStateChanges: deadMinionActsTonight=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vigormortis
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-NODASHII-SKIPS-NON-TOWNSFOLK 诺-达鲺跳过非镇民寻找最近镇民

- testId: SV-NODASHII-SKIPS-NON-TOWNSFOLK
- title: 诺-达鲺跳过非镇民寻找最近镇民
- characters: No Dashii
- ruleIds: noDashii.neighbor
- preconditions: 诺-达鲺有效
- canonicalState: 顺时针邻座是爪牙，再下一位是外来者，再下一位是镇民
- playerVisibleState: 玩家不知道中毒
- Given: 初始化或重算诺-达鲺中毒
- When: 选择目标
- Then: 顺时针镇民中毒，爪牙和外来者被跳过
- expectedEvents: PoisonedApplied(Townsfolk)
- forbiddenEvents: PoisonedApplied(Minion); PoisonedApplied(Outsider)
- expectedStateChanges: nearestClockwiseTownsfolk.poisoned=true
- forbiddenStateChanges: immediateNeighborOnly=true
- sourceUrl: https://wiki.bloodontheclocktower.com/No_Dashii
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-NODASHII-DEAD-TOWNSFOLK-STAYS 诺-达鲺不跳过死亡镇民

- testId: SV-NODASHII-DEAD-TOWNSFOLK-STAYS
- title: 诺-达鲺不跳过死亡镇民
- characters: No Dashii
- ruleIds: noDashii.dead
- preconditions: 诺-达鲺有效
- canonicalState: 最近镇民已死亡但仍是镇民
- playerVisibleState: 公开知道该镇民死亡
- Given: 中毒目标重算
- When: 检查邻居
- Then: 死亡镇民仍作为最近镇民中毒，不因死亡跳过
- expectedEvents: PoisonedApplied(deadTownsfolk)
- forbiddenEvents: RecalculatePastDeadTownsfolk
- expectedStateChanges: deadTownsfolk.poisoned=true
- forbiddenStateChanges: nextAliveTownsfolk.poisoned=true
- sourceUrl: https://wiki.bloodontheclocktower.com/No_Dashii
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-NODASHII-ROLE-CHANGE-RECALCULATES 诺-达鲺目标变非镇民立即重算

- testId: SV-NODASHII-ROLE-CHANGE-RECALCULATES
- title: 诺-达鲺目标变非镇民立即重算
- characters: No Dashii, Pit-Hag
- ruleIds: noDashii.recalc
- preconditions: 诺-达鲺有效且A为最近镇民中毒
- canonicalState: 麻脸巫婆把A变成外来者
- playerVisibleState: A只知道自己新角色
- Given: 角色变化结算
- When: 持续中毒重算
- Then: A恢复健康；下一个最近镇民B中毒
- expectedEvents: CharacterChanged; PoisonedRemoved(A); PoisonedApplied(B)
- forbiddenEvents: KeepPoisonOnNonTownsfolk
- expectedStateChanges: A.poisoned=false; B.poisoned=true
- forbiddenStateChanges: waitUntilNextNight=true
- sourceUrl: https://wiki.bloodontheclocktower.com/No_Dashii
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-PITHAG-STANDARD-POOL-ONLY 麻脸巫婆标准模式只能选当前角色池角色

- testId: SV-PITHAG-STANDARD-POOL-ONLY
- title: 麻脸巫婆标准模式只能选当前角色池角色
- characters: Pit-Hag
- ruleIds: pitHag.pool
- preconditions: 标准规则模式，自定义剧本角色池不含Chef
- canonicalState: 麻脸巫婆清醒健康
- playerVisibleState: 麻脸巫婆看到当前角色表
- Given: 麻脸巫婆选择玩家A和Chef图标
- When: 目标合法性检查
- Then: 选择非法，A不改变角色，记录非法输入
- expectedEvents: InvalidTargetRejected
- forbiddenEvents: CharacterChanged(A,Chef)
- expectedStateChanges: A.characterUnchanged=true
- forbiddenStateChanges: allowSandboxPoolLeak=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Pit-Hag
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-PITHAG-CREATE-DEMON-ARBITRARY-DEATH 麻脸巫婆创造恶魔开启任意死亡窗口

- testId: SV-PITHAG-CREATE-DEMON-ARBITRARY-DEATH
- title: 麻脸巫婆创造恶魔开启任意死亡窗口
- characters: Pit-Hag, Demon
- ruleIds: pitHag.demon
- preconditions: 麻脸巫婆清醒健康且目标角色Demon未在场
- canonicalState: A可变成恶魔
- playerVisibleState: A不知道将变化
- Given: 麻脸巫婆选择A成为恶魔
- When: 角色变化结算
- Then: A成为恶魔；当晚死亡可由说书人任意杀死或保护以平衡
- expectedEvents: CharacterChanged(A,Demon); ArbitraryDeathWindowOpened
- forbiddenEvents: DuplicateCharacterCreated
- expectedStateChanges: A.actualCharacter=Demon
- forbiddenStateChanges: alignmentAutoChanges=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Pit-Hag
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-VORTOX-DRUNK-TOWNSFOLK-STILL-FALSE 涡流下醉酒镇民信息仍必须为假

- testId: SV-VORTOX-DRUNK-TOWNSFOLK-STILL-FALSE
- title: 涡流下醉酒镇民信息仍必须为假
- characters: Vortox, Townsfolk
- ruleIds: vortox.false
- preconditions: 涡流有效，镇民信息角色醉酒
- canonicalState: 真实答案为yes
- playerVisibleState: 玩家不知道涡流和醉酒
- Given: 该镇民能力产生信息
- When: 说书人选择信息
- Then: 输出必须为规则意义上的false，不能给yes
- expectedEvents: InformationDelivered(falseTruthStatus=FORCED_FALSE)
- forbiddenEvents: InformationDelivered(RELIABLE_TRUE); InformationDelivered(UNRELIABLE_BUT_TRUE)
- expectedStateChanges: truthStatus=FORCED_FALSE
- forbiddenStateChanges: allowTrueBecauseDrunk=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vortox
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-VORTOX-NO-EXECUTION-EVIL-WINS 涡流当天无处决邪恶胜利

- testId: SV-VORTOX-NO-EXECUTION-EVIL-WINS
- title: 涡流当天无处决邪恶胜利
- characters: Vortox
- ruleIds: vortox.execution
- preconditions: 涡流有效
- canonicalState: 当天有提名、投票、女巫杀人和旅行者流放，但无Execution事件
- playerVisibleState: 公开知道无人被处决
- Given: 进入黄昏检查
- When: 胜利解析
- Then: 邪恶胜利
- expectedEvents: VictoryDeclared(Evil)
- forbiddenEvents: TreatExileAsExecution; TreatWitchDeathAsExecution
- expectedStateChanges: game.winner=Evil
- forbiddenStateChanges: continueGame=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vortox
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-VORTOX-EXECUTION-NO-DEATH-SATISFIES 涡流处决未死亡仍满足处决要求

- testId: SV-VORTOX-EXECUTION-NO-DEATH-SATISFIES
- title: 涡流处决未死亡仍满足处决要求
- characters: Vortox
- ruleIds: vortox.execution
- preconditions: 涡流有效
- canonicalState: 玩家A被合法处决但死亡被阻止
- playerVisibleState: 公开知道处决发生
- Given: 黄昏检查涡流条件
- When: 检查Execution事件
- Then: 不因涡流无处决条件宣布邪恶胜利
- expectedEvents: ExecutionResolved; VortoxExecutionRequirementSatisfied
- forbiddenEvents: VictoryDeclared(Evil due no execution)
- expectedStateChanges: day.executionOccurred=true
- forbiddenStateChanges: requiresDeath=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vortox
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-CERENOVUS-MUTANT-DUAL-MADNESS 洗脑师与畸形秀演员疯狂约束分开

- testId: SV-CERENOVUS-MUTANT-DUAL-MADNESS
- title: 洗脑师与畸形秀演员疯狂约束分开
- characters: Cerenovus, Mutant
- ruleIds: madness.dual
- preconditions: 畸形秀演员被洗脑师指定疯狂为Clockmaker
- canonicalState: 玩家同时有Mutant自带疯狂风险
- playerVisibleState: 公开发言可被记录
- Given: 玩家公开说自己是外来者且不是Clockmaker
- When: 疯狂判断
- Then: 分别记录违反畸形秀演员和洗脑师约束的证据；惩罚候选带来源
- expectedEvents: MadnessEvidenceRecorded(source=Mutant); MadnessEvidenceRecorded(source=Cerenovus)
- forbiddenEvents: SingleMergedMadnessFlag
- expectedStateChanges: twoRequirementsTracked=true
- forbiddenStateChanges: keywordOnlyDecision=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Cerenovus
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-PHILOSOPHER-POISONED-NO-GAIN 中毒哲学家选择能力不产生机械效果

- testId: SV-PHILOSOPHER-POISONED-NO-GAIN
- title: 中毒哲学家选择能力不产生机械效果
- characters: Philosopher
- ruleIds: philosopher.disabled
- preconditions: 哲学家中毒且未使用
- canonicalState: 原艺术家清醒健康
- playerVisibleState: 哲学家不知道自己中毒
- Given: 哲学家选择艺术家能力
- When: 结算选择
- Then: 可模拟选择流程，但哲学家不获得艺术家能力，原艺术家不醉酒
- expectedEvents: SimulatedChoiceRecorded
- forbiddenEvents: AbilityGained; DrunkApplied
- expectedStateChanges: philosopher.abilitySpentPolicy=storytellerRecordedSimulation
- forbiddenStateChanges: artist.drunk=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Philosopher
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-PHILOSOPHER-ROLE-CHANGE-REMOVES-DRUNK 哲学家失去能力解除原角色醉酒

- testId: SV-PHILOSOPHER-ROLE-CHANGE-REMOVES-DRUNK
- title: 哲学家失去能力解除原角色醉酒
- characters: Philosopher, Pit-Hag
- ruleIds: philosopher.roleChange
- preconditions: 哲学家已选择在场艺术家并使其醉酒
- canonicalState: 麻脸巫婆把哲学家变成外来者
- playerVisibleState: 艺术家不知道自己是否醉酒
- Given: 哲学家角色变化完成
- When: 持续效果重算
- Then: 哲学家造成的醉酒移除或暂停，艺术家恢复健康
- expectedEvents: CharacterChanged(Philosopher); DrunkRemoved(source=Philosopher)
- forbiddenEvents: KeepDrunkAfterSourceLost
- expectedStateChanges: artist.drunk=false
- forbiddenStateChanges: philosopherStillHasGainedAbility=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Philosopher
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-EVILTWIN-DEAD-NO-LONGER-BLOCKS 死亡镜像双子不再阻断善良胜利

- testId: SV-EVILTWIN-DEAD-NO-LONGER-BLOCKS
- title: 死亡镜像双子不再阻断善良胜利
- characters: Evil Twin
- ruleIds: evilTwin.disabled
- preconditions: 镜像双子不是被亡骨魔亲自杀死，且没有其他能力保留来源；镜像双子已死亡，善良双子仍存活
- canonicalState: 恶魔死亡；deadEvilTwin.hasAbility=false
- playerVisibleState: 公开知道镜像双子死亡
- Given: 胜利检查
- When: 应用镜像双子状态
- Then: 不再因镜像双子能力阻断善良普通胜利
- expectedEvents: VictoryCandidate(Good)
- forbiddenEvents: WinBlockedByDeadEvilTwin
- expectedStateChanges: evilTwin.active=false
- forbiddenStateChanges: goodCannotWin=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Evil_Twin
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-EVILTWIN-ROLE-CHANGE-REPAIR-PAIR 双子同阵营或新镜像双子时重新指定双子关系

- testId: SV-EVILTWIN-ROLE-CHANGE-REPAIR-PAIR
- title: 双子同阵营或新镜像双子时重新指定双子关系
- characters: Evil Twin, Pit-Hag
- ruleIds: evilTwin.roleChange
- preconditions: 麻脸巫婆创建新的镜像双子或双子变为同阵营
- canonicalState: 当前 twinPair 无法合法表达对立阵营
- playerVisibleState: 玩家只知道被告知的信息
- Given: 角色变化结算
- When: 双子关系维护
- Then: 说书人选择新的合法双子关系并重新交付必要信息
- expectedEvents: TwinPairReassigned; TwinInfoDelivered
- forbiddenEvents: KeepInvalidTwinPair
- expectedStateChanges: twinPair.valid=true
- forbiddenStateChanges: bothTwinsSameAlignment=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Evil_Twin
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-BARBER-POISONED-NO-SWAP-TASK 中毒理发师死亡不创建交换任务

- testId: SV-BARBER-POISONED-NO-SWAP-TASK
- title: 中毒理发师死亡不创建交换任务
- characters: Barber
- ruleIds: barber.disabled
- preconditions: 理发师中毒
- canonicalState: 理发师白天死亡
- playerVisibleState: 公开知道理发师死亡
- Given: 进入当晚夜间队列
- When: 检查理发师能力
- Then: 不唤醒恶魔，不创建 HAIRCUTS TONIGHT 交换任务
- expectedEvents: DeathResolved(Barber)
- forbiddenEvents: BarberSwapTaskCreated; WakeDemonForBarber
- expectedStateChanges: barberSwapTask.exists=false
- forbiddenStateChanges: swapCharacters=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Barber
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-BARBER-BECOMES-AFTER-DEATH-NO-RETRO 死亡后才变成理发师不追溯触发

- testId: SV-BARBER-BECOMES-AFTER-DEATH-NO-RETRO
- title: 死亡后才变成理发师不追溯触发
- characters: Barber, Pit-Hag
- ruleIds: barber.roleChange
- preconditions: 玩家A今晚早些时候已死亡且当时不是理发师
- canonicalState: 麻脸巫婆稍后把A变成理发师
- playerVisibleState: A得知新角色
- Given: 夜间队列检查理发师死亡任务
- When: 判断死亡时间与角色时间
- Then: 不创建本夜恶魔交换任务
- expectedEvents: CharacterChanged(A,Barber)
- forbiddenEvents: BarberSwapTaskCreated
- expectedStateChanges: A.character=Barber
- forbiddenStateChanges: retroactiveDeathTrigger=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Barber
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-PITHAG-POISONED-NO-CHARACTER-CHANGE 中毒麻脸巫婆不改变角色

- testId: SV-PITHAG-POISONED-NO-CHARACTER-CHANGE
- title: 中毒麻脸巫婆不改变角色
- characters: Pit-Hag
- ruleIds: pitHag.disabled
- preconditions: 麻脸巫婆中毒
- canonicalState: 选择A变成未在场理发师
- playerVisibleState: A不知道被选择
- Given: 麻脸巫婆夜间行动
- When: 结算选择
- Then: 可模拟选择，但A不改变角色，不得通知A新角色
- expectedEvents: SimulatedChoiceRecorded
- forbiddenEvents: CharacterChanged; NewCharacterInfoDelivered
- expectedStateChanges: A.characterUnchanged=true
- forbiddenStateChanges: A.learnedNewCharacter=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Pit-Hag
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-PITHAG-ROLE-CHANGE-NEW-NIGHT-TASK 玩家变成麻脸巫婆后进入后续夜角色变化队列

- testId: SV-PITHAG-ROLE-CHANGE-NEW-NIGHT-TASK
- title: 玩家变成麻脸巫婆后进入后续夜角色变化队列
- characters: Pit-Hag
- ruleIds: pitHag.roleChange
- preconditions: 玩家A在夜间被变成麻脸巫婆
- canonicalState: 当前麻脸巫婆任务槽位未经过
- playerVisibleState: A得知自己新角色
- Given: 夜间队列重建
- When: 检查角色变化插入
- Then: A获得麻脸巫婆能力；若本夜槽位未过，可插入角色变化任务，否则从下一夜开始
- expectedEvents: CharacterChanged(A,Pit-Hag); NightQueueRebuilt
- forbiddenEvents: IgnoreNewNightAbility
- expectedStateChanges: A.hasAbility=true
- forbiddenStateChanges: scheduleNever=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Pit-Hag
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-VIGORMORTIS-POISONED-KILL-SIMULATED 中毒亡骨魔夜间选择不杀人

- testId: SV-VIGORMORTIS-POISONED-KILL-SIMULATED
- title: 中毒亡骨魔夜间选择不杀人
- characters: Vigormortis
- ruleIds: vigormortis.disabled
- preconditions: 亡骨魔中毒
- canonicalState: 选择一名爪牙
- playerVisibleState: 亡骨魔不知道自己中毒
- Given: 夜间击杀任务
- When: 结算选择
- Then: 可模拟选择，但目标不死亡、不保留能力、不产生邻近镇民中毒
- expectedEvents: SimulatedDemonChoiceRecorded
- forbiddenEvents: DeathResolved; DeadMinionKeepsAbility; PoisonedApplied
- expectedStateChanges: target.alive=true
- forbiddenStateChanges: target.alive=false
- sourceUrl: https://wiki.bloodontheclocktower.com/Vigormortis
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-VIGORMORTIS-DEAD-MINION-CHANGES-NON-MINION 亡骨魔死亡爪牙变非爪牙后失去保留能力

- testId: SV-VIGORMORTIS-DEAD-MINION-CHANGES-NON-MINION
- title: 亡骨魔死亡爪牙变非爪牙后失去保留能力
- characters: Vigormortis, Pit-Hag
- ruleIds: vigormortis.roleChange
- preconditions: 亡骨魔亲自杀死过女巫，女巫死亡后保留能力
- canonicalState: 麻脸巫婆把死亡女巫变成外来者
- playerVisibleState: 公开知道女巫死亡
- Given: 角色变化结算
- When: 持续效果重算
- Then: 死亡玩家不再保留爪牙能力，其造成的镇民中毒移除
- expectedEvents: CharacterChanged(deadMinion,Outsider); EffectRemoved; PoisonedRemoved
- forbiddenEvents: KeepDeadMinionAbility
- expectedStateChanges: deadPlayer.hasAbility=false
- forbiddenStateChanges: deadPlayerCanActAsWitch=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vigormortis
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-NODASHII-LOST-ABILITY-HEALTHY 诺-达鲺失去能力旧目标恢复健康

- testId: SV-NODASHII-LOST-ABILITY-HEALTHY
- title: 诺-达鲺失去能力旧目标恢复健康
- characters: No Dashii
- ruleIds: noDashii.disabled
- preconditions: 诺-达鲺有效且两名镇民被其毒
- canonicalState: 诺-达鲺中毒或变成非恶魔
- playerVisibleState: 目标玩家不知道中毒来源
- Given: 失效状态生效
- When: 持续效果重算
- Then: 两个旧目标恢复健康
- expectedEvents: PoisonedRemoved(source=NoDashii)
- forbiddenEvents: KeepPoisoned
- expectedStateChanges: oldTargets.poisoned=false
- forbiddenStateChanges: oldTargets.poisoned=true
- sourceUrl: https://wiki.bloodontheclocktower.com/No_Dashii
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-VORTOX-POISONED-NO-FORCED-FALSE 涡流失去能力后不强制镇民假信息

- testId: SV-VORTOX-POISONED-NO-FORCED-FALSE
- title: 涡流失去能力后不强制镇民假信息
- characters: Vortox, Townsfolk
- ruleIds: vortox.disabled
- preconditions: 涡流中毒
- canonicalState: 镇民能力真实答案为yes
- playerVisibleState: 镇民不知道涡流是否有效
- Given: 镇民信息能力结算
- When: 生成信息候选
- Then: 不应用FORCED_FALSE；可按正常清醒能力给真实yes
- expectedEvents: InformationDelivered(RELIABLE_TRUE)
- forbiddenEvents: InformationDelivered(FORCED_FALSE)
- expectedStateChanges: truthStatus=RELIABLE_TRUE
- forbiddenStateChanges: forceFalseDespiteVortoxPoisoned=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vortox
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-VORTOX-ROLE-CHANGE-STARTS-FORCED-FALSE 玩家变成涡流后开始强制假信息和处决检查

- testId: SV-VORTOX-ROLE-CHANGE-STARTS-FORCED-FALSE
- title: 玩家变成涡流后开始强制假信息和处决检查
- characters: Vortox, Pit-Hag
- ruleIds: vortox.roleChange
- preconditions: 麻脸巫婆把恶魔变成涡流
- canonicalState: 之后同夜仍有镇民信息将产生
- playerVisibleState: 玩家只知道合法通知
- Given: 角色变化完成
- When: 后续信息能力结算
- Then: 从涡流能力有效时起，后续镇民能力信息必须为假；当天黄昏检查处决
- expectedEvents: CharacterChanged(Demon,Vortox); VortoxEffectActivated
- forbiddenEvents: DelayVortoxUntilNextGame
- expectedStateChanges: vortox.active=true
- forbiddenStateChanges: townsfolkInfoCanBeTrue=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vortox
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-WITCH-CURSED-NOMINATOR-DIES 女巫诅咒目标提名时死亡

- testId: SV-WITCH-CURSED-NOMINATOR-DIES
- title: 女巫诅咒目标提名时死亡
- characters: Witch
- ruleIds: witch.nomination
- preconditions: 女巫清醒健康夜间选择玩家A，且存活玩家多于3
- canonicalState: A.cursedByWitch=true
- playerVisibleState: A不知道被诅咒
- Given: A白天发起合法提名
- When: 提名成立后
- Then: A死亡；记录死亡来源为Witch curse
- expectedEvents: NominationDeclared; DeathResolved(source=Witch)
- forbiddenEvents: ExecutionResolved
- expectedStateChanges: A.alive=false
- forbiddenStateChanges: curseTriggersOnVote=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Witch
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-MUTANT-MADNESS-NOT-KEYWORD 畸形秀演员疯狂不是关键词匹配

- testId: SV-MUTANT-MADNESS-NOT-KEYWORD
- title: 畸形秀演员疯狂不是关键词匹配
- characters: Mutant
- ruleIds: madness.intent
- preconditions: 畸形秀演员在场
- canonicalState: 玩家多次暗示并说服他人自己是外来者但未说出外来者名称
- playerVisibleState: 公开发言记录存在
- Given: 说书人评估疯狂
- When: 判断证据
- Then: 可以记录为正在疯狂证明自己是外来者；不得仅因没有关键词而忽略
- expectedEvents: MadnessEvidenceRecorded
- forbiddenEvents: KeywordMatchedOnly
- expectedStateChanges: evidence.intent=outsiderClaim
- forbiddenStateChanges: requiresExactWord=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Mutant
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-KLUTZ-CHOOSES-EVIL-LOSES 呆瓜得知死亡后选邪恶玩家导致己方失败

- testId: SV-KLUTZ-CHOOSES-EVIL-LOSES
- title: 呆瓜得知死亡后选邪恶玩家导致己方失败
- characters: Klutz
- ruleIds: klutz.loss
- preconditions: 呆瓜清醒健康并得知自己死亡
- canonicalState: 存活玩家E为邪恶
- playerVisibleState: 公开知道呆瓜要选择
- Given: 呆瓜公开选择E
- When: 选择结算
- Then: 呆瓜当前阵营失败
- expectedEvents: PublicChoiceRecorded; TeamLoses(KlutzAlignment)
- forbiddenEvents: DeathResolved(E)
- expectedStateChanges: winnerAgainstKlutzTeam=true
- forbiddenStateChanges: privateChoiceAccepted=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Klutz
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-ARTIST-VORTOX-FALSE-YESNO 涡流下艺术家答案必须为假

- testId: SV-ARTIST-VORTOX-FALSE-YESNO
- title: 涡流下艺术家答案必须为假
- characters: Artist, Vortox
- ruleIds: artist.info, vortox.false
- preconditions: 艺术家清醒健康且涡流有效
- canonicalState: 艺术家问题真实答案为yes
- playerVisibleState: 艺术家不知道涡流
- Given: 艺术家白天问yes/no问题
- When: 说书人回答
- Then: 必须回答no
- expectedEvents: InformationDelivered(false)
- forbiddenEvents: InformationDelivered(true)
- expectedStateChanges: truthStatus=FORCED_FALSE
- forbiddenStateChanges: truthStatus=RELIABLE_TRUE
- sourceUrl: https://wiki.bloodontheclocktower.com/Artist
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-SAVANT-VORTOX-BOTH-FALSE 涡流下博学者两条信息均为假

- testId: SV-SAVANT-VORTOX-BOTH-FALSE
- title: 涡流下博学者两条信息均为假
- characters: Savant, Vortox
- ruleIds: savant.info, vortox.false
- preconditions: 涡流有效且博学者清醒健康
- canonicalState: 可构造两条均假陈述
- playerVisibleState: 博学者只知道收到两条信息
- Given: 博学者白天访问说书人
- When: 生成信息
- Then: 两条陈述均必须为假
- expectedEvents: InformationDelivered(twoFalseStatements)
- forbiddenEvents: OneTrueOneFalseDelivered
- expectedStateChanges: truthStatuses=[FORCED_FALSE,FORCED_FALSE]
- forbiddenStateChanges: oneTrueRequired=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Savant
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-DREAMER-VALID-TARGETS 筑梦师不能选择自己或旅行者

- testId: SV-DREAMER-VALID-TARGETS
- title: 筑梦师不能选择自己或旅行者
- characters: Dreamer
- ruleIds: dreamer.target
- preconditions: 筑梦师夜间行动
- canonicalState: 自己和旅行者在场
- playerVisibleState: 筑梦师知道可选玩家
- Given: 筑梦师选择自己或旅行者
- When: 目标合法性检查
- Then: 拒绝目标并要求重新选择合法非自己非旅行者玩家
- expectedEvents: InvalidTargetRejected
- forbiddenEvents: InformationDelivered
- expectedStateChanges: noStateChange=true
- forbiddenStateChanges: allowSelfTarget=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Dreamer
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-MATHEMATICIAN-ABNORMAL-COUNT 数学家统计因其他角色能力异常生效人数

- testId: SV-MATHEMATICIAN-ABNORMAL-COUNT
- title: 数学家统计因其他角色能力异常生效人数
- characters: Mathematician
- ruleIds: mathematician.count
- preconditions: 数学家清醒健康
- canonicalState: 从黎明起有2名玩家能力因其他角色异常
- playerVisibleState: 数学家不知道异常列表
- Given: 数学家夜间醒来
- When: 结算信息
- Then: 得知数字2
- expectedEvents: InformationDelivered(count=2)
- forbiddenEvents: RevealWhichPlayers
- expectedStateChanges: receivedNumber=2
- forbiddenStateChanges: countSelfDrunkWithoutOtherAbility=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Mathematician
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-FLOWERGIRL-DEMON-VOTED 卖花女孩检测今天恶魔是否投票

- testId: SV-FLOWERGIRL-DEMON-VOTED
- title: 卖花女孩检测今天恶魔是否投票
- characters: Flowergirl
- ruleIds: flowergirl.vote
- preconditions: 卖花女孩清醒健康后续夜
- canonicalState: 恶魔今天投过票
- playerVisibleState: 公开投票历史存在但恶魔身份隐藏
- Given: 夜间唤醒卖花女孩
- When: 结算信息
- Then: 得知yes
- expectedEvents: InformationDelivered(yes)
- forbiddenEvents: RevealDemonIdentity
- expectedStateChanges: flowergirl.received=yes
- forbiddenStateChanges: countNominationAsVote=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Flowergirl
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-TOWNCRIER-MINION-NOMINATED 城镇公告员检测今天爪牙是否提名

- testId: SV-TOWNCRIER-MINION-NOMINATED
- title: 城镇公告员检测今天爪牙是否提名
- characters: Town Crier
- ruleIds: townCrier.nomination
- preconditions: 城镇公告员清醒健康后续夜
- canonicalState: 一名爪牙今天发起合法提名
- playerVisibleState: 公开提名历史存在但爪牙身份隐藏
- Given: 夜间唤醒城镇公告员
- When: 结算信息
- Then: 得知yes
- expectedEvents: InformationDelivered(yes)
- forbiddenEvents: RevealMinionIdentity
- expectedStateChanges: townCrier.received=yes
- forbiddenStateChanges: countVoteAsNomination=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Town_Crier
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-ORACLE-DEAD-EVIL-COUNT 神谕者统计死亡邪恶玩家数量

- testId: SV-ORACLE-DEAD-EVIL-COUNT
- title: 神谕者统计死亡邪恶玩家数量
- characters: Oracle
- ruleIds: oracle.count
- preconditions: 神谕者清醒健康后续夜
- canonicalState: 死亡玩家中2名邪恶
- playerVisibleState: 公开知道谁死亡但不知道阵营
- Given: 夜间唤醒神谕者
- When: 结算信息
- Then: 得知数字2
- expectedEvents: InformationDelivered(count=2)
- forbiddenEvents: RevealWhichDeadAreEvil
- expectedStateChanges: oracle.received=2
- forbiddenStateChanges: countLivingEvil=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Oracle
- sourceSection: Summary / How to Run
- verificationStatus: verified against official page

## SV-PITHAG-IN-PLAY-CHARACTER-NO-CHANGE 麻脸巫婆选择已在场角色合法但无变化

- testId: SV-PITHAG-IN-PLAY-CHARACTER-NO-CHANGE
- title: 麻脸巫婆选择已在场角色合法但无变化
- characters: Pit-Hag
- ruleIds: pitHag.duplicateChoice
- preconditions: 麻脸巫婆清醒健康，目标角色已经在场
- canonicalState: playerA.actualCharacter=Dreamer; chosenCharacter=Artist; Artist already in play
- playerVisibleState: 麻脸巫婆只看到当前角色表图标
- Given: 麻脸巫婆选择玩家A和已经在场的艺术家图标
- When: 结算麻脸巫婆选择
- Then: 选择合法；玩家A不变成艺术家；不要求重新选择
- expectedEvents: PitHagChoiceAccepted; NoChangeBecauseCharacterInPlay
- forbiddenEvents: CharacterChanged; InvalidTargetRejected; RechooseRequired
- expectedStateChanges: playerA.actualCharacter=Dreamer
- forbiddenStateChanges: duplicateCharacterCreated=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Pit-Hag
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-CERENOVUS-CAN-TARGET-DEAD 洗脑师可以选择死亡玩家

- testId: SV-CERENOVUS-CAN-TARGET-DEAD
- title: 洗脑师可以选择死亡玩家
- characters: Cerenovus
- ruleIds: cerenovus.target
- preconditions: 洗脑师清醒健康
- canonicalState: deadPlayer.alive=false; chosenGoodCharacter=Clockmaker
- playerVisibleState: 死亡玩家仍可接收私密通知
- Given: 洗脑师选择死亡玩家和钟表匠
- When: 夜间结算
- Then: 死亡玩家获得疯狂要求，持续到下一次洗脑师行动替换或结束
- expectedEvents: MadnessRequirementCreated; PrivateInfoDelivered
- forbiddenEvents: InvalidTargetRejected
- expectedStateChanges: deadPlayer.madAbout=Clockmaker
- forbiddenStateChanges: deadPlayerExcluded=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Cerenovus
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-CERENOVUS-PRIVATE-CONTRADICTION-EVIDENCE 洗脑师疯狂可使用私聊矛盾作为证据

- testId: SV-CERENOVUS-PRIVATE-CONTRADICTION-EVIDENCE
- title: 洗脑师疯狂可使用私聊矛盾作为证据
- characters: Cerenovus
- ruleIds: cerenovus.madnessEvidence
- preconditions: 玩家受洗脑师疯狂要求
- canonicalState: privateChat contradicts public claim
- playerVisibleState: 私聊内容只对参与者和自动说书人可见
- Given: 玩家公开努力声称自己是钟表匠，但私聊中明确告诉他人自己不是钟表匠且只是被迫装作
- When: 自动说书人评估疯狂
- Then: 私聊、公开发言、暗示、否认和行为均可作为裁量证据；私聊不得泄露给无权玩家
- expectedEvents: MadnessEvidenceRecorded(privateContradiction); StorytellerJudgmentQueued
- forbiddenEvents: PrivateChatLeakedToUnauthorizedPlayers
- expectedStateChanges: evidence.privateUsableByStoryteller=true
- forbiddenStateChanges: publicState.includesPrivateChat=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Cerenovus
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-CERENOVUS-EXECUTION-USES-DAILY-EXECUTION 洗脑师疯狂处决消耗当天唯一处决

- testId: SV-CERENOVUS-EXECUTION-USES-DAILY-EXECUTION
- title: 洗脑师疯狂处决消耗当天唯一处决
- characters: Cerenovus
- ruleIds: cerenovus.execution
- preconditions: 玩家未真诚满足洗脑师疯狂要求
- canonicalState: day.executionUsed=false
- playerVisibleState: 公开尚未处决
- Given: 说书人白天宣布因洗脑师疯狂处决该玩家
- When: 处决结算
- Then: 该处决属于当天唯一一次处决；进入夜晚，不允许再进行普通处决
- expectedEvents: ExecutionResolved(source=CerenovusMadness); DayEnds
- forbiddenEvents: SecondExecutionAllowed
- expectedStateChanges: day.executionUsed=true
- forbiddenStateChanges: normalExecutionStillAvailable=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Cerenovus
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-CERENOVUS-POISONED-NO-MADNESS 中毒洗脑师不创建疯狂要求

- testId: SV-CERENOVUS-POISONED-NO-MADNESS
- title: 中毒洗脑师不创建疯狂要求
- characters: Cerenovus
- ruleIds: cerenovus.disabled
- preconditions: 洗脑师中毒
- canonicalState: selectedPlayer=alivePlayer; selectedCharacter=Clockmaker
- playerVisibleState: 洗脑师不知道自己中毒
- Given: 洗脑师夜间选择玩家和角色
- When: 结算选择
- Then: 可模拟选择，但不创建疯狂要求，不通知目标
- expectedEvents: SimulatedChoiceRecorded
- forbiddenEvents: MadnessRequirementCreated; PrivateInfoDelivered
- expectedStateChanges: target.madnessRequirementsUnchanged=true
- forbiddenStateChanges: targetReceivesCerenovusInfo=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Cerenovus
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-VIGORMORTIS-EVILTWIN-GOOD-TWIN-EXECUTED 亡骨魔杀死的镜像双子保留善良双子处决胜利

- testId: SV-VIGORMORTIS-EVILTWIN-GOOD-TWIN-EXECUTED
- title: 亡骨魔杀死的镜像双子保留善良双子处决胜利
- characters: Vigormortis, Evil Twin
- ruleIds: vigormortis.evilTwin
- preconditions: 亡骨魔亲自杀死镜像双子，亡骨魔仍存活且有能力
- canonicalState: evilTwin.alive=false; evilTwin.hasAbility=true; goodTwin.alive=true
- playerVisibleState: 公开知道镜像双子死亡
- Given: 善良双子被处决
- When: 胜利检查
- Then: 邪恶仍因镜像双子保留能力获胜
- expectedEvents: ExecutionResolved(goodTwin); VictoryDeclared(Evil)
- forbiddenEvents: IgnoreDeadVigormortisEvilTwinAbility
- expectedStateChanges: game.winner=Evil
- forbiddenStateChanges: goodTwinExecutionDoesNotMatter=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vigormortis
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-VIGORMORTIS-EVILTWIN-NO-LIVE-BLOCK 亡骨魔死亡镜像双子不再满足双方都存活阻断

- testId: SV-VIGORMORTIS-EVILTWIN-NO-LIVE-BLOCK
- title: 亡骨魔死亡镜像双子不再满足双方都存活阻断
- characters: Vigormortis, Evil Twin
- ruleIds: vigormortis.evilTwin.liveBlock
- preconditions: 亡骨魔亲自杀死镜像双子，镜像双子保留能力但已死亡
- canonicalState: evilTwin.alive=false; goodTwin.alive=true
- playerVisibleState: 公开知道镜像双子死亡
- Given: 恶魔随后死亡
- When: 胜利检查
- Then: 双方都存活的善良胜利阻断不成立；按其他胜利条件判断
- expectedEvents: VictoryCandidate(Good)
- forbiddenEvents: GoodWinBlockedBecauseBothTwinsLive
- expectedStateChanges: bothTwinsAlive=false
- forbiddenStateChanges: treatDeadTwinAsAlive=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vigormortis
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-VIGORMORTIS-LOSES-ABILITY-EVILTWIN-STOPS 亡骨魔失去能力后死亡镜像双子保留能力停止

- testId: SV-VIGORMORTIS-LOSES-ABILITY-EVILTWIN-STOPS
- title: 亡骨魔失去能力后死亡镜像双子保留能力停止
- characters: Vigormortis, Evil Twin
- ruleIds: vigormortis.evilTwin.stop
- preconditions: 亡骨魔亲自杀死镜像双子后又死亡或失去能力
- canonicalState: evilTwin.alive=false; evilTwin.hasAbility=true
- playerVisibleState: 公开知道亡骨魔相关死亡事实不一定公开
- Given: 亡骨魔失去能力
- When: 持续效果重算
- Then: 死亡镜像双子失去保留能力；善良双子之后被处决不触发镜像双子邪恶胜利
- expectedEvents: EffectRemoved(deadEvilTwinHasAbility)
- forbiddenEvents: KeepDeadEvilTwinAbility
- expectedStateChanges: evilTwin.hasAbility=false
- forbiddenStateChanges: goodTwinExecutionWinsEvil=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Vigormortis
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-WITCH-THREE-ALIVE-CURSE-REMOVED 三名存活时女巫诅咒立即移除

- testId: SV-WITCH-THREE-ALIVE-CURSE-REMOVED
- title: 三名存活时女巫诅咒立即移除
- characters: Witch
- ruleIds: witch.threeAlive
- preconditions: 女巫夜间已诅咒玩家A
- canonicalState: 恶魔击杀后 aliveCount=3
- playerVisibleState: A不知道诅咒是否仍存在
- Given: 夜间死亡结算使存活玩家数变为3
- When: 女巫能力状态更新
- Then: 女巫立即失去能力，已放置诅咒移除；A第二天可安全提名
- expectedEvents: CurseRemoved; AbilitySuppressed(Witch)
- forbiddenEvents: WaitUntilNextWitchAction
- expectedStateChanges: A.cursedByWitch=false
- forbiddenStateChanges: cursePersistsAtThreeAlive=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Witch
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-WITCH-CURSE-LASTS-ONE-DAY 女巫诅咒只持续到下一白天

- testId: SV-WITCH-CURSE-LASTS-ONE-DAY
- title: 女巫诅咒只持续到下一白天
- characters: Witch
- ruleIds: witch.duration
- preconditions: 女巫清醒健康夜间诅咒玩家A且存活人数多于3
- canonicalState: A does not nominate the next day
- playerVisibleState: A不知道自己被诅咒
- Given: 下一白天结束且A未提名
- When: 进入夜晚清理日间效果
- Then: 诅咒到期移除，除非女巫下一夜再次诅咒A
- expectedEvents: CurseExpired
- forbiddenEvents: CurseCarriesIndefinitely
- expectedStateChanges: A.cursedByWitch=false
- forbiddenStateChanges: curseStillActiveTomorrow=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Witch
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-WITCH-DEAD-TARGET-LEGAL 女巫可以诅咒死亡玩家

- testId: SV-WITCH-DEAD-TARGET-LEGAL
- title: 女巫可以诅咒死亡玩家
- characters: Witch
- ruleIds: witch.target
- preconditions: 女巫清醒健康
- canonicalState: deadPlayer.alive=false; aliveCount>3
- playerVisibleState: 死亡玩家不知道被诅咒
- Given: 女巫夜间选择死亡玩家
- When: 目标合法性检查
- Then: 选择合法，放置诅咒；若该死亡玩家次日提名则死亡事件通常无新增死亡但提名仍成立
- expectedEvents: CurseApplied(deadPlayer)
- forbiddenEvents: InvalidTargetRejected
- expectedStateChanges: deadPlayer.cursedByWitch=true
- forbiddenStateChanges: deadTargetIllegal=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Witch
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-MATHEMATICIAN-VORTOX-ABNORMAL-COUNT 数学家记录涡流造成的镇民信息异常并自身数字必须为假

- testId: SV-MATHEMATICIAN-VORTOX-ABNORMAL-COUNT
- title: 数学家记录涡流造成的镇民信息异常并自身数字必须为假
- characters: Mathematician, Vortox
- ruleIds: mathematician.vortox
- preconditions: 涡流有效，多个镇民得到假信息
- canonicalState: ledger has five non-Mathematician townsfolk abnormal entries; Math true count would be 5
- playerVisibleState: 数学家不知道账本明细
- Given: 数学家夜间唤醒
- When: 生成数学家信息
- Then: MathematicianAbnormalityLedger记录5个异常；数学家因涡流也必须得到假数字，不能得到5
- expectedEvents: LedgerClosed(count=5); InformationDelivered(FORCED_FALSE)
- forbiddenEvents: InformationDelivered(count=5)
- expectedStateChanges: mathematician.truthStatus=FORCED_FALSE
- forbiddenStateChanges: mathCountsSelfFailure=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Mathematician
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-MATHEMATICIAN-DOES-NOT-COUNT-SELF 数学家不统计自己的能力异常

- testId: SV-MATHEMATICIAN-DOES-NOT-COUNT-SELF
- title: 数学家不统计自己的能力异常
- characters: Mathematician
- ruleIds: mathematician.self
- preconditions: 数学家因其他角色影响收到错误数字
- canonicalState: only Mathematician's own ability abnormal
- playerVisibleState: 数学家不知道自身信息是否异常
- Given: 数学家结算账本
- When: 计算异常数量
- Then: 账本不把数学家自身失败计入数学家数字
- expectedEvents: LedgerClosed(count=0)
- forbiddenEvents: LedgerEntry(player=Mathematician)
- expectedStateChanges: ledger.excludesSelf=true
- forbiddenStateChanges: selfCounted=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Mathematician
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-MATHEMATICIAN-POISONED-TRUE-INFO-NOT-ABNORMAL 中毒信息角色恰好得真信息通常不计异常

- testId: SV-MATHEMATICIAN-POISONED-TRUE-INFO-NOT-ABNORMAL
- title: 中毒信息角色恰好得真信息通常不计异常
- characters: Mathematician
- ruleIds: mathematician.poisonTrue
- preconditions: 一名信息角色中毒但收到恰好正确的信息
- canonicalState: poisonedInfoRole.result=trueAndMatchesReality
- playerVisibleState: 数学家不知道该玩家中毒
- Given: 从黎明到数学家唤醒
- When: 更新异常账本
- Then: 不因醉酒/中毒本身计数；能力结果未异常工作时不记ABNORMAL
- expectedEvents: NoLedgerEntry(poisonedInfoRole)
- forbiddenEvents: LedgerEntry(poisonedInfoRole)
- expectedStateChanges: ledger.countUnchanged=true
- forbiddenStateChanges: poisonStatusAloneCounts=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Mathematician
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-MATHEMATICIAN-POISONED-FALSE-INFO-ABNORMAL 中毒信息角色得到假信息计为异常

- testId: SV-MATHEMATICIAN-POISONED-FALSE-INFO-ABNORMAL
- title: 中毒信息角色得到假信息计为异常
- characters: Mathematician
- ruleIds: mathematician.poisonFalse
- preconditions: 一名信息角色中毒且收到错误信息
- canonicalState: poisonedInfoRole.result=falseAgainstReality
- playerVisibleState: 数学家不知道该玩家中毒
- Given: 从黎明到数学家唤醒
- When: 更新异常账本
- Then: 该玩家能力因其他角色中毒而异常工作，记一条ABNORMAL
- expectedEvents: LedgerEntry(poisonedInfoRole, reason=poisonedFalseInfo)
- forbiddenEvents: NoLedgerEntry
- expectedStateChanges: ledger.count += 1
- forbiddenStateChanges: falseInfoIgnored=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Mathematician
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-DREAMER-POISONED-INFO-UNRELIABLE 中毒筑梦师信息不可靠且不得泄露中毒

- testId: SV-DREAMER-POISONED-INFO-UNRELIABLE
- title: 中毒筑梦师信息不可靠且不得泄露中毒
- characters: Dreamer
- ruleIds: dreamer.poisoned
- preconditions: 筑梦师中毒
- canonicalState: target.actualCharacter=GoodCharacter; storyteller supplies legal pair
- playerVisibleState: 筑梦师不知道自己中毒
- Given: 筑梦师选择合法目标
- When: 信息结算
- Then: 给出符合格式的一善一恶角色组合，真值标记仅说书人可见
- expectedEvents: InformationDelivered(twoCharacters); TruthMetadataHidden
- forbiddenEvents: PoisonStatusRevealed
- expectedStateChanges: playerView.omitsTruthStatus=true
- forbiddenStateChanges: aiSeesPoisoned=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Dreamer
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-FLOWERGIRL-VORTOX-FALSE 涡流下卖花女孩信息必须为假

- testId: SV-FLOWERGIRL-VORTOX-FALSE
- title: 涡流下卖花女孩信息必须为假
- characters: Flowergirl, Vortox
- ruleIds: flowergirl.vortox
- preconditions: 涡流有效，卖花女孩清醒健康
- canonicalState: 真实情况：恶魔今天投过票
- playerVisibleState: 卖花女孩不知道恶魔身份
- Given: 卖花女孩后续夜唤醒
- When: 结算信息
- Then: 必须得知 no
- expectedEvents: InformationDelivered(no, truthStatus=FORCED_FALSE)
- forbiddenEvents: InformationDelivered(yes)
- expectedStateChanges: truthStatus=FORCED_FALSE
- forbiddenStateChanges: trueInfoAllowed=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Flowergirl
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-TOWNCRIER-VORTOX-FALSE 涡流下城镇公告员信息必须为假

- testId: SV-TOWNCRIER-VORTOX-FALSE
- title: 涡流下城镇公告员信息必须为假
- characters: Town Crier, Vortox
- ruleIds: townCrier.vortox
- preconditions: 涡流有效，城镇公告员清醒健康
- canonicalState: 真实情况：今天有爪牙提名
- playerVisibleState: 城镇公告员不知道爪牙身份
- Given: 城镇公告员后续夜唤醒
- When: 结算信息
- Then: 必须得知 no
- expectedEvents: InformationDelivered(no, truthStatus=FORCED_FALSE)
- forbiddenEvents: InformationDelivered(yes)
- expectedStateChanges: truthStatus=FORCED_FALSE
- forbiddenStateChanges: trueInfoAllowed=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Town_Crier
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-ORACLE-POISONED-FALSE-COUNT 中毒神谕者错误死亡邪恶数计入数学家异常

- testId: SV-ORACLE-POISONED-FALSE-COUNT
- title: 中毒神谕者错误死亡邪恶数计入数学家异常
- characters: Oracle, Mathematician
- ruleIds: oracle.poisoned, mathematician.ledger
- preconditions: 神谕者中毒且数学家在场
- canonicalState: deadEvilCount=2; oracleReceives=1
- playerVisibleState: 神谕者不知道自己中毒
- Given: 神谕者后续夜得到数字1
- When: 数学家账本更新
- Then: 神谕者信息异常，MathematicianAbnormalityLedger记录神谕者
- expectedEvents: InformationDelivered(count=1); LedgerEntry(Oracle)
- forbiddenEvents: LedgerIgnoresOracle
- expectedStateChanges: ledger.includes=Oracle
- forbiddenStateChanges: wrongCountNotRecorded=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Oracle
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-SAVANT-POISONED-STATEMENTS-UNRELIABLE 中毒博学者两条陈述不保证一真一假

- testId: SV-SAVANT-POISONED-STATEMENTS-UNRELIABLE
- title: 中毒博学者两条陈述不保证一真一假
- characters: Savant
- ruleIds: savant.poisoned
- preconditions: 博学者中毒
- canonicalState: storyteller chooses two legal-format statements
- playerVisibleState: 博学者不知道自己中毒
- Given: 博学者白天访问说书人
- When: 生成两条信息
- Then: 可给两真、两假或一真一假；不得把一真一假当硬约束
- expectedEvents: InformationDelivered(twoStatements, truthStatus=UNRELIABLE)
- forbiddenEvents: EnforceOneTrueOneFalse
- expectedStateChanges: truthMetadataHidden=true
- forbiddenStateChanges: playerKnowsPoisoned=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Savant
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND 醉酒女裁缝使用不应消耗真实能力

- testId: SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND
- title: 醉酒女裁缝使用不应消耗真实能力
- characters: Seamstress
- ruleIds: seamstress.drunk
- preconditions: 女裁缝醉酒且未使用能力
- canonicalState: targets have same alignment
- playerVisibleState: 女裁缝不知道自己醉酒
- Given: 女裁缝选择两名非自己玩家
- When: 结算信息
- Then: 可模拟给yes或no，但真实一次性能力不应被消耗
- expectedEvents: InformationDelivered(unreliable)
- forbiddenEvents: AbilitySpent(real)
- expectedStateChanges: seamstress.realAbilitySpent=false
- forbiddenStateChanges: realAbilitySpent=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Seamstress
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-ARTIST-POISONED-ANSWER-UNRELIABLE 中毒艺术家答案不可靠且不证明中毒

- testId: SV-ARTIST-POISONED-ANSWER-UNRELIABLE
- title: 中毒艺术家答案不可靠且不证明中毒
- characters: Artist
- ruleIds: artist.poisoned
- preconditions: 艺术家中毒且未使用能力
- canonicalState: 真实答案为yes
- playerVisibleState: 艺术家不知道自己中毒
- Given: 艺术家白天问是非问题
- When: 说书人回答
- Then: 可回答yes或no，均不向玩家暴露中毒状态；真实一次性能力按失效模拟记录
- expectedEvents: InformationDelivered(unreliableYesNo)
- forbiddenEvents: PoisonStatusRevealed
- expectedStateChanges: truthMetadataHidden=true
- forbiddenStateChanges: playerKnowsPoisoned=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Artist
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-JUGGLER-DRUNK-GUESS-SOBER-INFO-TRUE 杂耍艺人猜测时醉酒但当晚清醒则给真实数量

- testId: SV-JUGGLER-DRUNK-GUESS-SOBER-INFO-TRUE
- title: 杂耍艺人猜测时醉酒但当晚清醒则给真实数量
- characters: Juggler
- ruleIds: juggler.drunkTiming
- preconditions: 杂耍艺人首日猜测时醉酒，夜晚唤醒前恢复清醒健康
- canonicalState: three guesses; two correct
- playerVisibleState: 公开听到三组猜测
- Given: 杂耍艺人首日公开三组猜测
- When: 当晚信息结算
- Then: 给真实正确数量2
- expectedEvents: InformationDelivered(count=2)
- forbiddenEvents: TreatGuessTimeDrunkAsInvalid
- expectedStateChanges: receivedNumber=2
- forbiddenStateChanges: receivedNumberCanBeFalseBecauseWasDrunkDuringGuess=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Juggler
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-SAGE-PITHAG-DEATH-NO_WAKE 麻脸巫婆任意死亡杀死贤者不触发贤者

- testId: SV-SAGE-PITHAG-DEATH-NO_WAKE
- title: 麻脸巫婆任意死亡杀死贤者不触发贤者
- characters: Sage, Pit-Hag
- ruleIds: sage.nonDemonDeath
- preconditions: 麻脸巫婆创造恶魔导致当晚死亡任意
- canonicalState: Sage dies from Pit-Hag arbitrary death, not Demon attack
- playerVisibleState: 贤者只知道自己死亡
- Given: 贤者当晚死亡
- When: 夜间触发检查
- Then: 贤者不被唤醒，不获得两个恶魔候选
- expectedEvents: DeathResolved(Sage)
- forbiddenEvents: InformationDelivered(twoCandidates)
- expectedStateChanges: sage.receivedCandidates=false
- forbiddenStateChanges: treatPitHagDeathAsDemonKill=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Sage
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE

## SV-SWEETHEART-POISONED-DEATH-NO-DRUNK 中毒心上人死亡不使玩家醉酒

- testId: SV-SWEETHEART-POISONED-DEATH-NO-DRUNK
- title: 中毒心上人死亡不使玩家醉酒
- characters: Sweetheart
- ruleIds: sweetheart.poisoned
- preconditions: 心上人中毒
- canonicalState: 心上人死亡
- playerVisibleState: 公开知道心上人死亡
- Given: 死亡触发结算
- When: 检查心上人能力
- Then: 不创建新的醉酒效果
- expectedEvents: DeathResolved(Sweetheart)
- forbiddenEvents: DrunkApplied(source=Sweetheart)
- expectedStateChanges: noNewDrunk=true
- forbiddenStateChanges: target.drunk=true
- sourceUrl: https://wiki.bloodontheclocktower.com/Sweetheart
- sourceSection: Summary / How to Run
- verificationStatus: VERIFIED_CORE
