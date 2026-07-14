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
- Phase Three Slice 2B16：Cerenovus First-Night Madness Marker 已合并
- Phase Three Slice 2B17：Clockmaker First-Night Distance Information 已合并
- Phase Three Slice 2B17.1：Clockmaker Validation Hardening 已合并
- Phase Three Slice 2B17.2：Philosopher-Gained First-Night Scheduling V2 已合并
- Phase Three Slice 2B17.3：Legacy Philosopher No-Insertion Compatibility 已合并
- Phase Three Slice 2B18A：First-Night Ability Outcome Ledger Foundation 已合并

当前代码覆盖领域事件脊柱、阶段状态机核心、阶段转换策略、命令串行入口、固定种子可复现的 12 人《梦殒春宵》真实配板基础、固定 12 人座位名单、可复现角色分配基础、首夜初始化事实、初始自身角色私有知识生成、玩家/AI 私有知识安全投影、首夜 `ScheduledTask` 计划骨架，`MINION_INFO`/`DEMON_INFO` 有序系统信息结算，Philosopher 首夜能力选择、能力授予事实、重复在场角色醉酒标记、获得能力首夜任务动态插入基础，Philosopher 获得的 Snake Charmer 行动机会、非恶魔目标无交换结算、恶魔命中后的当前角色/阵营交换和旧恶魔中毒标记，基础 Snake Charmer 行动与有效性求值，Evil Twin 配对与双子私有知识，以及 Witch 首夜目标选择、待死亡标记和无效结算。它不包含 Witch 实际死亡、提名触发结算、3 alive 失去能力、AI 决策、完整昼夜可玩流程、UI、Electron 或 SQLite 正式适配器。

当前已接受实现还包括 Dreamer 首夜历史信息交付、Seamstress 基础/Philosopher 获得能力的首夜双目标选择与私有历史投影、Cerenovus 有效路径、Clockmaker 首夜距离信息与严格运行时验证，以及 Slice 2B18A 的 ledger-only 首夜能力结果账本基础。相关角色覆盖仍为 `PARTIAL`，不代表完整角色实现。2B18A 不包含数学家计数、数字交付、私有计数投影或结算。

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
- `docs/implementation/phase-3-slice-2b16-status.md`
- `docs/implementation/phase-3-slice-2b17-status.md`
- `docs/implementation/phase-3-slice-2b17-2-status.md`
- `docs/implementation/phase-3-slice-2b17-3-status.md`
- `docs/implementation/phase-3-slice-2b18a-status.md`

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
- Drunk/poison simulation, Vortox runtime, character/alignment lifecycle, actual madness judgment, execution/death/cleanup, other-night recurrence, gained-Cerenovus interactions, UI, Electron, and persistence remain unsupported for Cerenovus.
- This governed run completed its configured maximum of one slice and is paused. See `docs/implementation/phase-3-slice-2b16-status.md` and the verbatim final-review archives in `docs/reviews/`.

## Slice 2B17 Closeout

- Phase Three Slice 2B17 merged through PR #19 at merge SHA `4b29a3f7b05d521a9d8468ffc33c77eec3cb16c4`.
- The final reviewed feature HEAD is `04237a2053a64301a515fffeb417958a381a0dc6`; its push and pull-request CI passed, and both merge-SHA main/tag push runs passed.
- Clockmaker now supports the bounded base and Philosopher-gained first-night distance pipeline, canonical Philosopher duplicate drunkenness, settlement-time Snake Charmer state, effective Vortox false information, strict historical validation, and source-only private projection.
- Clockmaker remains `PARTIAL`. Registration, Travellers, death/revival, canonical poisoned Clockmaker, impaired Vortox, unsupported native counts, later-night acquisition, recurrence, general lifecycle machinery, free-form Storyteller selection, UI, Electron, and persistence remain unsupported.
- This governed run completed its configured maximum of one slice and has no active next slice. Slice 2B18 was not started. See `docs/implementation/phase-3-slice-2b17-status.md` and the verbatim PR #19 final-review archives in `docs/reviews/`.

## Slice 2B17.1 Validation Hardening Closeout

- Phase Three Slice 2B17.1 merged through PR #20 at merge SHA `19923f4aa62c86cc2db995587d65b586fd365b8a`; accepted tag `phase-3-slice-2b17-1-clockmaker-validation-hardening` points to that merge.
- The final reviewed feature HEAD is `9caaa07a9f3f50bdf8564e48bf50345fed976a4c`; push `29151838214`, pull-request `29151839311`, merge-main `29152171989`, and merge-tag `29152177469` all passed.
- The hotfix enforces strict dense standard arrays, hostile-value fail-closed validation, key-order-independent canonical comparison, and guarded stored-delivery reads. Rule, event, candidate, Vortox, impairment, and private projection semantics are unchanged (`ruleSemanticsChanged=false`).
- Clockmaker remains `PARTIAL`; all previously unsupported boundaries remain unsupported. Slice 2B18 was not started. See `docs/implementation/phase-3-slice-2b17-status.md` and the verbatim PR #20 final-review archives in `docs/reviews/`.

## Slice 2B17.2 Philosopher-Gained Scheduling V2 Closeout

- Phase Three Slice 2B17.2 merged through PR #21 at merge SHA `44248dc8172b59a994ceba13e91e1bc32cbe561a`; accepted tag `phase-3-slice-2b17-2-philosopher-gained-task-scheduling-v2` points directly to that merge.
- The final reviewed feature HEAD is `880c4c363dcde292493f2fbc6ebde20a0dfc09c9`; product-head push `29177463850`, pull-request `29177464877`, merge-main `29177743946`, and merge-tag `29177757002` all passed.
- New games use versioned V2 Philosopher-gained task insertion at signed catalog positions, with deterministic base/seat/task-ID ordering. Accepted V1 history remains replayable, while new V1 planner output and V1/V2 mixing fail closed.
- Final independent review returned `CODE_REVIEW_PASS / RULE_REVIEW_PASS`. Verbatim audit comments are archived in `docs/reviews/pr-21-code-review-final.md` and `docs/reviews/pr-21-rule-review-final.md`.
- Philosopher remains `PARTIAL`; Mathematician remains `SKELETON`. Slice 2B17.2 resolves only the scheduling prerequisite for Slice 2B18. Four rule conflicts remain, so Slice 2B18 is still `HUMAN_BLOCKED` and requires a future explicit user rescope or approved interpretation. Slice 2B19 was not started.

## Slice 2B17.3 Legacy Philosopher Compatibility Closeout

- Phase Three Slice 2B17.3 merged through PR #22 at merge SHA `139616d2706a193079bf779898b8adeb9f3d049a`; accepted tag `phase-3-slice-2b17-3-philosopher-legacy-no-insertion-compatibility` points to that merge.
- The final reviewed feature HEAD is `d6c567838419fc34b6e6406468899e55d46b2979`; product push `29179615504`, pull-request `29179616613`, merge-main `29179930675`, and merge-tag `29179940573` all passed.
- Accepted legacy V1 histories can now grant and settle Philosopher choices with no first-night insertion mapping. Mapped V1 choices remain fail closed; V2 payloads, task IDs, positions, ordering, replay, and projections remain unchanged.
- Final independent review returned `CODE_REVIEW_PASS / RULE_REVIEW_PASS`, `ruleSemanticsChanged=false`, and no blockers. Verbatim final comments are archived in `docs/reviews/`.
- Philosopher remains `PARTIAL`; Mathematician remains `SKELETON`. Slice 2B18 remains `HUMAN_BLOCKED` on four conflicts, and Slice 2B19 was not started.

## Slice 2B18A Ledger-Only Closeout

- Phase Three Slice 2B18A merged through PR #23 at merge SHA `00a12062e2dc7a99ef01b2fbddc3a5dc4d666fa6`; accepted tag `phase-3-slice-2b18a-first-night-ability-outcome-ledger` points to that merge.
- The final reviewed feature HEAD is `671622b9f368a6201840ea0cb3d5b8254065bff8`. Product push/PR CI `29226220051 / 29226221291` and merge-main/tag CI `29227191271 / 29227406815` passed.
- The accepted boundary is the derived first-night ability outcome ledger foundation, replay provenance, supported terminal adapters, and exact gained V1/V2 terminal-opportunity revision binding while preserving historical `N < M` semantics.
- This slice has no public true-count resolver, no `MathematicianCountResolution`, no Mathematician number, no private count projection, and no Mathematician delivery or settlement. `MATHEMATICIAN_INFORMATION` remains fail closed.
- Final independent review returned `CODE_REVIEW_PASS / RULE_REVIEW_PASS` with no blockers. Verbatim comments are archived in `docs/reviews/pr-23-code-review-final.md` and `docs/reviews/pr-23-rule-review-final.md`.
- Mathematician remains `PARTIAL`; no role is `COMPLETE`. At the Slice 2B18A closeout, Slice 2B18B and Slice 2B19 had not started and no next slice was then authorized.

## Slice 2B19 Dreamer V2 Published PR

- Slice 2B19 remains unaccepted in ready PR [#25](https://github.com/JackeyLovedas/botc-singleplayer/pull/25) on `phase-3/dreamer-v2-completion`. Prior reviewed head `af089791...` passed exact-head CI but independent review returned `CODE_REVIEW_FIX_REQUIRED / RULE_REVIEW_PASS`. The user-authorized acceptance-closure repair round `4 / 4` implementation is committed at `cc69e6ed9d3afff8b4c09b029b4b52e4a25033fa`, passes all local gates, and awaits an authorized push; the live PR head after push remains the only feature-head authority, and fresh exact-head CI, independent dual review, acceptance, and merge remain pending. No Round 5 exists. Dreamer remains `PARTIAL`; FIRST_NIGHT, DAY, and Phase 2C have not advanced.
- The bounded fixed-roster first-night path covers base and Philosopher-gained V2 opportunity, target choice, deterministic GOOD/EVIL delivery, represented source impairment, effective Vortox forced-false behavior, accepted Snake Charmer current-role truth, exact outcome-ledger facts, hostile replay rejection, and trusted source-only player/AI projection.
- Accepted V1 no-Vortox Dreamer completion remains V1. Current-Vortox V1 and mapped V1 gained paths fail receipt-free. No accepted V1 history is upgraded or reordered.
- Dreamer remains `PARTIAL`. Other-night behavior, Travellers, life/death/revival, free Storyteller false-role choice, general poison production, UI, persistence, FIRST_NIGHT completion, DAY transition, and Phase 2C remain unsupported or out of scope.
- See `docs/implementation/phase-3-slice-2b19-status.md` and `docs/implementation/phase-3-slice-2b19-test-traceability.md`.
