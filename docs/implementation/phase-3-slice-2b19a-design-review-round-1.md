reviewedDesign:
- `docs/implementation/phase-3-slice-2b19a-design.md`
- commit: `e11ca1d1adbbc0327131fc084ec4f0fb8a80daf2`
- SHA-256: `26bace844cd7697b5e2d411cddf7c14dc1c497516a1221f7d07995797ef8ba70`
- branch/worktree: `phase-3/dreamer-v2-base-vortox`, clean

sourcesReviewed:
- `AGENTS.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/CURRENT_TASK.md`
- 用户授权附件 `pasted-text.txt`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- handoff 阅读顺序文件及相关 night-order、drunk/poison、information、character-change、Storyteller、Dreamer、Vortox、interaction、priority 和测试材料
- Official Dreamer `oldid=2904`
- Official Vortox `oldid=3017`
- Official Philosopher `oldid=2421`
- Official States `oldid=1039`
- Official Abilities `oldid=1376`
- Chinese 筑梦师 `oldid=3046`
- Chinese 涡流 `oldid=6198`
- Chinese 哲学家 `oldid=5125`
- Official nightsheet commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- accepted-main Dreamer、opportunity、task-plan、role-tenure、events、event applier、batch semantics、rebuild、ledger、application service、command result、projection、memory store 和相关状态文件

findings:
- BLOCKER 1 — 完整 accepted-stream 边界尚未闭合。设计把公开 `rebuildGameState` 放宽为允许最终 Dreamer V2 target/delivery 前缀，并新增严格的 `rebuildCompleteAcceptedGameState`，但没有明确规定现有 `rebuildOptionalGameState` 的语义，也没有列出并冻结所有从 command store 加载 accepted history 的调用点。accepted main 的应用服务一般状态载入仍通过 `rebuildOptionalGameState(events)`。若它随公开 rebuild 一起放宽，不完整 V2 尾部可被当作命令验证用 canonical state，甚至据此生成拒绝 receipt；这与“不完整尾部永不成为 accepted/trusted history”冲突。Round 2 必须定义严格 optional complete-rebuild API，迁移所有 accepted-store、命令决策、幂等冲突、commit/staged validation、ledger 和 projection 调用点，并直接测试：通用 prospective replay 只接受最终精确 V2 前缀，而所有 accepted-history 入口拒绝该尾部且不写 receipt/event/version。
- BLOCKER 2 — 成功命令结果绕过投影的泄漏边界未设计。accepted main 中 `SubmitDreamerAction` 不在 `acceptedWithEventSummary` 分支内，因此成功结果使用 `accepted(...)` 返回完整事件。V2 delivery 载荷含 `targetTruth`、candidate domain、source impairment、Vortox constraint、truth outcome、reliability 和内部 source contract；即使 trusted private projection 正确隐藏这些字段，Human/AI 命令调用方仍可从成功结果及保存的 receipt 直接获得它们。Round 2 必须规定 V2 Dreamer 成功结果和幂等重放仅返回事件类型摘要或等价的安全红化结果，并在 41 项六字段 traceability 中加入同一投影安全层的直接断言。
- PASS — 外部规则来源及固定哈希无实质冲突；Dreamer 一善一恶、正常恰一真、有效 Vortox 两者均假、醉酒/中毒可真可假且 Vortox 优先的语义正确。
- PASS — 固定 nightsheet 独立核对为首夜 Philosopher index 13、Dreamer index 60；后续夜 Philosopher/Vortox/Dreamer 为 10/46/78。
- PASS — 设计严格排除了 gained source contract、entitlement、opportunity、revision、ordering 和 traceability；gained task 明确 receipt-free `ApplicationNotConfigured`。
- PASS — base identity、exact-shape V1/V2 closed unions、settlement-time target truth、role tenure、candidate resolver、normal/DRUNK/POISONED pure seam/Vortox/Vortox+source impairment边界总体可实现。
- PASS — target、delivery、final 三条路径均明确使用完整 `priorAcceptedEvents` 调用真实 `rebuildGameState`，具有独立 direct 状态、固定 mismatch reason、零事件/零 receipt/零版本变化和同 commandId 可重试语义。
- PASS — 三事件原子顺序、ledger 分类、stored historical validation、V1 payload 不变、V1 current-Vortox fail-closed、41 项连续 traceability 与 `PARTIAL` 状态均已明确；除上述两个阻断点外未发现规则冲突。

verdict: `RULE_DESIGN_FIX_REQUIRED`

remainingBlockers:
1. 闭合所有 accepted-stream/optional rebuild 调用点，证明放宽的前缀 replay 不会进入 canonical accepted-history 命令或 receipt 路径。
2. 封闭 V2 Dreamer 成功结果和幂等 receipt 的隐藏事件载荷泄漏，并补入 41 项可追踪直接测试。
