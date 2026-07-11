BEGIN RULE DESIGN REVIEW REPORT
## 独立规则设计复审报告

- `reviewedBranch`: `phase-3/cerenovus-first-night-madness-marker`
- `reviewedHead`: `86d973485e940c0ef0469dd169db3ab1dc7a417d`
- `evidenceHash`: `5204b8995a40b8cee237f2b004f59f16e0751667ffdd3b9b5691265f425d9cb0`
- `designHash`: `858698463994f4c6a70911fc4255a42a4b77691b1e5dae1cbab437c7d5fd3c9b`
- `historicalFinalReviewHash`: `7af520124ee01a5c195ca5d1aecd146a86b5ed109ef8ba4795c5be4847e0ab3c`
- `reviewTimestamp`: `2026-07-11T12:34:28+08:00`
- `reviewScope`: PR #18 repair round 1 的规则证据、修复设计、控制状态、代码契约和测试追溯；不审定尚未实施的修复代码。

### sourcesReviewed

- `docs/rules/USER_OVERRIDES.md`
- 中文 Wiki：洗脑师，页面修订 `4198`
- 中文 Wiki：涡流，页面修订 `6198`
- 官方 Wiki：Cerenovus，页面修订 `3048`
- 官方 Wiki：Vortox，页面修订 `3017`
- 官方 Wiki：States，页面修订 `1039`
- 官方 Wiki：Glossary，页面修订 `2874`
- 官方 Wiki：Abilities，页面修订 `1376`
- 官方 Wiki：Character Types，页面修订 `1495`
- 官方 `nightsheet.json`，SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- 当前规则证据及其中记录的全部来源修订、抓取日期与内容哈希

夜间顺序已独立确认：

- 首夜：`eviltwin → witch → cerenovus → fearmonger → harpy`
- 其他夜晚：`devilsadvocate → witch → cerenovus → pithag → fearmonger`

### filesReviewed

规则、设计与控制文件：

- `docs/rules/evidence/2B16.md`
- `docs/implementation/phase-3-slice-2b16-design.md`
- `docs/implementation/phase-3-slice-2b16-final-review-round-1.md`
- `docs/implementation/phase-3-slice-2b16-status.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- PR #18 当前正文

生产契约及相应测试边界：

- `packages/domain-core/src/cerenovus.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`
- 设计追溯矩阵列出的 domain、replay、application、projection 和 rules-snv 测试文件

### blockerResolution

| 原阻断项 | 复审结论 | 依据 |
|---|---|---|
| 规则证据缺少完整 schema、Vortox 与阵营变化结论 | `RESOLVED_IN_DESIGN` | 证据字段完整，来源修订与哈希已记录；Vortox 和角色类型/阵营结论有独立来源，未支持的运行时交互明确保持范围外。 |
| 来源身份可伪造，能力权限依赖 payload 来源 | `RESOLVED_IN_DESIGN` | 设计要求机会、任务、角色任期、能力实例和 choice 的全部来源字段严格一致；所有能力检查统一使用机会记录中的来源玩家。 |
| 恶意 primitive 可在验证前进入格式化器并抛错 | `RESOLVED_IN_DESIGN` | 设计要求先验证 canonical ID、primitive 类型和接收者座位，再调用任何格式化器；恶意输入必须非抛异常地失败关闭。 |
| 缺少高风险直接测试及精确规则到测试追溯 | `RESOLVED_IN_DESIGN` | 62 项规则声明全部映射到明确测试文件、精确测试名称和实施状态；第 27、43 项各自包含两个有意拆分的直接测试，因此矩阵共 64 行。 |

### findings

- 修复设计覆盖应用、回放、批处理、前瞻验证和历史投影的同一来源绑定链，没有只修单一路径。
- 四事件有效链和原 Slice 范围保持不变，没有借修复扩大角色机制范围。
- 历史投影明确使用已存储的机会、任期和事件链，不根据后续角色、醉酒、中毒、Vortox 或阵营状态重新计算。
- Vortox不改变该 Minion 标记/私密指示链；阵营变化运行时仍未实现。两项均被诚实标记为范围外，没有伪装为完整支持。
- 覆盖矩阵中的 Cerenovus 仍为 `PARTIAL`，各未实现交互保持明确状态。
- 当前生产代码仍是此前审查发现缺陷的冻结版本；工作区不存在 `packages/` 差异。控制文件和 PR 正文均明确暂停实施、撤回旧完成声明，并要求重新审批后才可修复。
- 旧 CI 和旧最终审查仅作为历史记录，没有被用作当前修复通过证明。
- 修复实施后仍须运行新精确 HEAD 的完整测试、CI 和独立最终审查；这些是后续实施门禁，不是本次设计缺陷。

### remainingBlockers

`[]`

### designVerdict

RULE_DESIGN_PASS
END RULE DESIGN REVIEW REPORT
