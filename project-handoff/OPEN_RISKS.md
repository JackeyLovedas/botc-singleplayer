# Open Risks

| riskId | category | description | impact | probability | mitigation | ownerStage | blocking |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RISK-RULES-001 | RULES | 部分角色仍为 PARTIAL。 | 实现这些角色时可能遗漏主要分支。 | Medium | 实现前先补对应测试；不得改状态伪装完成。 | Phase 9 | No for Phase 2 |
| RISK-AI-001 | AI | AI 疯狂判断存在自然语言裁量复杂度。 | 可能错误处决或放过玩家。 | High | 把私聊、公开发言、暗示、否认和行为转为可审计证据。 | Phase 8/10 | No for Phase 2 |
| RISK-AI-002 | AI | 11 名 AI 同时讨论可能造成成本和响应时间问题。 | 运行成本高、节奏慢。 | Medium | 设计轮次、摘要、节流和模型分层策略。 | Phase 10/11 | No |
| RISK-SEC-001 | SECURITY | AI 上下文隔离必须通过程序强制。 | AI 看到隐藏真相会破坏游戏。 | High | 只传 playerProjection，不传 canonicalGameState。 | Phase 2/10 | Yes before AI |
| RISK-ARCH-001 | ARCHITECTURE | 角色变化与动态夜间队列复杂。 | 夜间顺序、一次性能力和新角色唤醒可能错误。 | High | 建立 NightTask 生命周期和角色变化事件测试。 | Phase 2/7 | No for Phase 2 |
| RISK-RULES-002 | RULES | 数学家异常账本需要严格事件记录。 | 异常计数不稳定。 | Medium | 使用 MathematicianAbnormalityLedger，不用普通计数器。 | Phase 6 | No |
| RISK-PROD-001 | PRODUCT | 存档和回放必须避免泄露隐藏状态。 | 玩家提前看到真相。 | High | 分离 replayTruth 和玩家可见回放。 | Phase 12 | No for Phase 2 |
| RISK-PROD-002 | PRODUCT | 自定义剧本可能产生低质量但规则合法的配板。 | 体验差但不一定违法。 | Medium | 区分合法性验证与质量建议。 | Phase 4 | No |
| RISK-RULES-003 | RULES | 自动说书人策略不能破坏规则公平性。 | 胜利、死亡或信息选择越权。 | High | 所有裁量记录合法候选和最终选择。 | Phase 2/8 | No for Phase 2 |
| RISK-AI-003 | AI | AI 输出不能直接修改 canonical state。 | LLM 幻觉进入真实状态。 | High | LLM 输出转为候选命令并经规则验证。 | Phase 10 | Yes before AI |
| RISK-TEST-001 | TESTING | 测试数量不能替代覆盖质量。 | 误判角色已完整验证。 | Medium | 保留 VERIFIED_CORE/PARTIAL/BLOCKED 状态。 | All phases | No |
