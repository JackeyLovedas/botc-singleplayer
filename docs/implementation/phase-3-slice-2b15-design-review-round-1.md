RULE_DESIGN_FIX_REQUIRED

Reviewed HEAD: `a31562b5d0751128b94b82289c2d21e954ea5ad7`

来源可用且无实质冲突。中文 Wiki、[Seamstress](https://wiki.bloodontheclocktower.com/index.php?title=Seamstress&oldid=1999)、[States](https://wiki.bloodontheclocktower.com/index.php?title=States&oldid=1039)、[Glossary](https://wiki.bloodontheclocktower.com/index.php?title=Glossary&oldid=2874)、[Abilities](https://wiki.bloodontheclocktower.com/index.php?title=Abilities&oldid=1376)及 nightsheet 均支持 R01–R13；夜序确认为首夜 `dreamer → seamstress → steward`、后续夜 `oracle → seamstress → juggler`。

实现前必须修正：

1. Legacy V1 示例不是现有 exact shape
   [设计第 99 行](C:/Users/wjl/Documents/血染钟楼/docs/implementation/phase-3-slice-2b15-design.md:99)错误写成 `supported`、`futureUnsupported`。现有契约是 `supportedDecisionKinds`、`futureUnsupportedDecisionKinds`，且 V1 没有 `visibilitySchemaVersion`。此外当前 clone 逻辑会把具有两个 decision kind 的 V2 Seamstress visibility误判成 Philosopher visibility。必须定义明确的 V1/V2 判别联合，并覆盖 exact validation、clone、equality、application 与 replay。

2. Modifier fail-closed 既不可完整判定，也会泄露隐藏状态
   当前 impairment 模型只表达 Philosopher duplicate 与 Snake Charmer poison；No Dashii 邻座中毒尚未建模，因此无法证明“modifier-free”。而在人类/AI提交相同合法命令时，成功与 `UnsupportedSeamstressModifiedResolution` 的差异会成为 Vortox、醉酒或中毒存在性的可观察 oracle，违反隐藏候选边界。
   必须选择一种安全方案：
   - 实现所有当前可达隐藏修饰下的规则正确模拟；或
   - 在隐藏分配发生前建立公开、非秘密的能力边界，使玩家命令不会根据隐藏状态条件性失败。
   Registration 当前不可表示，不得声称或测试其“fail closed”。

3. Ability-instance 不能从 `scheduledTaskId` 派生
   `ScheduledTask` 是一次唤醒，once-per-game ability instance 跨多个夜间任务持续；复活或重新成为 Seamstress 则获得新实例。当前方案会让后续夜产生假新实例，或让复活后的新能力被旧 spend 阻断，也无法正确表达 Barista 额外使用。应引入由角色/能力取得 tenure 派生的稳定 `AbilityInstanceId`，让每次任务引用它；spend 按实例结算，复活/重新获得能力创建新实例。

4. Opportunity revision 与 settlement revision 的分离不安全
   现有 2B14 契约要求全局当前 revision 等于 opportunity creation revision。设计要求目标在两者之间改变 alignment，却未定义如何证明 Seamstress 的同一能力实例持续存在。
   必须精确定义：
   - creation revision `N`；
   - settlement revision `M`；
   - 哪些事件字段绑定 `N`、哪些绑定 `M`；
   - settlement 与比较快照统一绑定 `M`；
   - 通过 ability-instance/tenure 连续性排除“离开 Seamstress 后又重新成为 Seamstress”。
   测试需同时覆盖目标 alignment 改变可结算，以及来源失去或重新取得能力时拒绝旧 opportunity。

5. R01–R13/39 项映射存在过度声称
   - R05 不能标为 fully implemented：同一 opportunity 防重复不等于阻止未来普通夜间任务。
   - 场景 23 不能标为 fully covered：death、revival、registration 均未建模，只能证明现有 character/alignment snapshot 不被重算。
   - 场景 15 依赖上述 revision 修正。
   - acceptance test 18 对 registration 和通用 modified contexts 的声明当前不可执行。
   - R02 只能声明固定 roster 中普通、当前模型可表达的玩家子集；死亡与 Traveller 测试 9–10 必须继续明确 unsupported。

6. 私有投影契约仍不够精确
   必须定义 exact `SEAMSTRESS_INFORMATION` stage、模型版本与字段存在性联动；投影前须验证 matching choice、spend、delivery、settlement 完整链。仅 source 可见 targets 与 delivered answer；alignment、rule-correct answer、candidate/effectiveness/registration 元数据必须隐藏。考虑复活与 Barista 可产生多次历史 delivery，不能冻结为无法扩展的单一结果结构。

四事件原子顺序本身合理，但只有在 ability identity、双 revision 及 stored-fact projection 校验修正后才能进入实现。工作区保持 clean，未修改任何文件。
