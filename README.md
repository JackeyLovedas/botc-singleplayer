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
- Phase Three Slice 2B7：Philosopher Ability Choice and Dynamic Task Insertion Foundation 已合并
- Phase Three Slice 2B8：Philosopher-Gained Snake Charmer Non-Demon Settlement 已合并
- Phase Three Slice 2B9：Snake Charmer Demon-Hit Swap and Poison Marker 已合并
- Phase Three Slice 2B10：Base Snake Charmer Action and Effectiveness Gate 已合并
- Phase Three Slice 2B11：Evil Twin Setup and Pair Knowledge 已合并
- Phase Three Slice 2B12：Witch Action Target Selection and Deferred Death Marker 已合并
- Phase Three Slice 2B13：Dreamer Action Opportunity and Information Skeleton 已合并
- Phase Three Slice 2B14：Seamstress First-Night DEFER Skeleton 已合并
- Phase Three Slice 2B15：Seamstress First-Night Choice and Private Information 已合并

当前代码覆盖领域事件脊柱、阶段状态机核心、阶段转换策略、命令串行入口、固定种子可复现的 12 人《梦殒春宵》真实配板基础、固定 12 人座位名单、可复现角色分配基础、首夜初始化事实、初始自身角色私有知识生成、玩家/AI 私有知识安全投影、首夜 `ScheduledTask` 计划骨架，`MINION_INFO`/`DEMON_INFO` 有序系统信息结算，Philosopher 首夜能力选择、能力授予事实、重复在场角色醉酒标记、获得能力首夜任务动态插入基础，Philosopher 获得的 Snake Charmer 行动机会、非恶魔目标无交换结算、恶魔命中后的当前角色/阵营交换和旧恶魔中毒标记，基础 Snake Charmer 行动与有效性求值，Evil Twin 配对与双子私有知识，以及 Witch 首夜目标选择、待死亡标记和无效结算。它不包含 Witch 实际死亡、提名触发结算、3 alive 失去能力、AI 决策、完整昼夜可玩流程、UI、Electron 或 SQLite 正式适配器。

当前评审分支还包括 Dreamer 首夜历史信息交付，以及 Seamstress 基础/Philosopher 获得能力的首夜双目标选择、稳定能力身份、消耗、受限修正信息与来源私有历史投影；覆盖仍为 `PARTIAL`，不代表完整角色实现。

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
- `docs/implementation/phase-3-slice-2b8-status.md`
- `docs/implementation/phase-3-slice-2b9-status.md`
- `docs/implementation/phase-3-slice-2b10-status.md`
- `docs/implementation/phase-3-slice-2b11-status.md`
- `docs/implementation/phase-3-slice-2b12-status.md`
- `docs/implementation/phase-3-slice-2b13-status.md`
- `docs/implementation/phase-3-slice-2b14-status.md`
- `docs/implementation/phase-3-slice-2b15-status.md`

## Current Delivery Update

- Phase Three Slices 2B13, 2B14, and 2B15 are accepted; Slice 2B15 merged through PR #17 as `ee77565e1935701084b51ae7d4dd8764023d2352`.
- Accepted Slice 2B15 tag: `phase-3-slice-2b15-seamstress-first-night-choice-information`.
- Slice 2B15 adds the public V2 resolution capability, base and Philosopher-granted first-night two-player choice, stable tenure/instance/entitlement identity, legal spend, private historical information, represented impairment/Vortox behavior, and exact replay validation.
- Accepted Seamstress results disclose only ordered event types/count; full canonical payloads remain in the event store. Structural command fingerprints now reject command-ID reuse with a different command without exposing fingerprint material.
- Seamstress is overall `PARTIAL`, never `COMPLETE`. Other-night recurrence, life/revival, Travellers, registration, Barista, No Dashii poison derivation, AI choice, UI, Electron, SQLite, and production persistence remain unsupported.
- This governed autopilot run completed its maximum three slices (2B13 through 2B15) and is paused with no active next slice.
- See `docs/implementation/phase-3-slice-2b15-status.md` for the exact implemented boundary, rule traceability, exclusions, and verification evidence.

## Slice 2B16 Closeout

- Phase Three Slice 2B16 merged through PR #18 at merge SHA `8a7ba648513a84e3a91dcd2d268634440cf27585`.
- The accepted feature HEAD is `8f88250273cd119089ba3529aa27724d99d11306`; its push and pull-request product CI passed, and both merge-SHA main/tag push runs passed.
- Cerenovus effective-only first-night choice, madness marker, target-private instruction, settlement, semantic provenance validation, and historical target projection are accepted.
- Cerenovus remains `PARTIAL`. Source-impaired behavior remains `UNSUPPORTED_UNREACHABLE_IN_CURRENT_CANONICAL_HISTORY` and fail-closed; no generic impairment source was added.
- Drunk/poison simulation, Vortox runtime, character/alignment lifecycle, actual madness judgment, execution/death/cleanup, other-night recurrence, gained-Cerenovus interactions, UI, Electron, persistence, and Slice 2B17 remain unsupported.
- This governed run completed its configured maximum of one slice and is paused. See `docs/implementation/phase-3-slice-2b16-status.md` and the verbatim final-review archives in `docs/reviews/`.
