# BOTC Singleplayer

Windows 本地《血染钟楼》单机游戏项目。

当前范围：

- 12 名普通玩家
- 1 名真人玩家
- 11 名 AI 玩家
- 1 个自动说书人，不计入 12 名玩家
- 第一版剧本：《梦殒春宵》

当前阶段：

- Phase One v2.1：规则研究，有条件通过
- Phase Two / Phase 2.1：技术架构定稿
- Phase Three Slice 1：Domain Event Spine 已合并
- Phase Three Slice 2A：Phase State Machine Core 已合并
- Phase Three Slice 2B1：Seeded Sects & Violets Setup Foundation 已合并
- Phase Three Slice 2B2：Seat Roster and Character Assignment 已合并
- Phase Three Slice 2B3：First Night Private Knowledge Bootstrap 已合并
- Phase Three Slice 2B4：First Night Task Plan and ScheduledTask Skeleton 已合并
- Phase Three Slice 2B5：MINION_INFO and DEMON_INFO Ordered Settlement 已合并
- Phase Three Slice 2B6：Philosopher Action Opportunity and Defer Settlement 已合并
- Phase Three Slice 2B7：Philosopher Ability Choice and Dynamic Task Insertion Foundation 评审中

当前代码覆盖领域事件脊柱、阶段状态机核心、阶段转换策略、命令串行入口、固定种子可复现的 12 人《梦殒春宵》真实配板基础、固定 12 人座位名单、可复现角色分配基础、首夜初始化事实、初始自身角色私有知识生成、玩家/AI 私有知识安全投影、首夜 `ScheduledTask` 计划骨架，`MINION_INFO`/`DEMON_INFO` 有序系统信息结算，以及 Philosopher 首夜能力选择、能力授予事实、重复在场角色醉酒标记和获得能力首夜任务动态插入基础。它不包含插入任务执行、获得能力实际结算、醉酒效果应用、Snake Charmer 交换、完整昼夜可玩流程、AI 决策、UI、Electron 或 SQLite 正式适配器。

重要文档：

- `AGENTS.md`
- `project-handoff/00-README-FIRST.md`
- `project-handoff/RULES_BASELINE.md`
- `docs/architecture/15-vertical-slice-plan.md`
- `docs/architecture/24-phase-2-final-status.md`
- `docs/implementation/phase-3-slice-1-status.md`
- `docs/implementation/phase-3-slice-2a-status.md`
- `docs/implementation/phase-3-slice-2b1-status.md`
- `docs/implementation/phase-3-slice-2b2-status.md`
- `docs/implementation/phase-3-slice-2b3-status.md`
- `docs/implementation/phase-3-slice-2b4-status.md`
- `docs/implementation/phase-3-slice-2b5-status.md`
- `docs/implementation/phase-3-slice-2b6-status.md`
- `docs/implementation/phase-3-slice-2b7-status.md`
