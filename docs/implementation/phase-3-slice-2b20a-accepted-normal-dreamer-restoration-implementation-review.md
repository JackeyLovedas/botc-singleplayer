# Phase 3 Slice 2B20A — Accepted-Normal Dreamer Restoration Implementation Review

- `archiveKind`: `COMPLETE_INDEPENDENT_REVIEWER_OUTPUT`
- `reviewedHead`: `0326c2cd08eed768d4f6097f11dad671f0271143`
- `bodyHandling`: The content between the boundary markers is preserved verbatim.

<!-- REVIEWER_BODY_BEGIN -->
reviewedPR: `46`（本地实现复核；未读取或修改远程 PR 状态）

reviewedHead: `0326c2cd08eed768d4f6097f11dad671f0271143`

reviewTimestamp: `2026-07-28T08:48:31.0884124Z`

reviewScope:

- Phase 3 Slice 2B20A accepted-normal Dreamer restoration 的完整独立只读实现复核。
- 对比失败基线 `70ee998a631a347ced5975dc71923a71072fa5cb`。
- 核验 source implementation `4d576e205cb20c37ba913b923a1cd39e8d800d18`。
- 核验 coverage-profile child `3cdb60b7de12b010a5b076800f3c8ab705b0108a`。
- 核验 profile-review archive checkpoint `0326c2cd08eed768d4f6097f11dad671f0271143`。
- 全程未修改受版本控制文件、未提交、未推送、未修改 PR 或 CI。

productionFilesReviewed:

- `packages/domain-core/src/dreamer.ts` — 本次唯一修改的生产文件；唯一修改符号为 `resolveBaseDreamerV2NormalCapability`。
- `packages/application/src/game-application-service.ts` — 只读检查真实命令链、receipt、原子提交和重试路径。
- `packages/domain-core/src/rebuild.ts` — 只读检查 accepted-history rebuild 与终态批次验证。
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts` — 只读检查 Dreamer/Mathematician 既有事实归因边界。

testFilesReviewed:

- `packages/domain-core/src/dreamer.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/test-harness/src/dreamer-v3-accepted-stream.ts`
- `packages/application/src/mathematician-information.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`

ruleEvidenceReviewed:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20A.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b20a-design.md`
- `docs/implementation/phase-3-slice-2b20a-design-round-2.md`
- `docs/implementation/phase-3-slice-2b20a-product-repair-round-1-design.md`
- `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design.md`
- `docs/implementation/phase-3-slice-2b20ap1-design.md`
- `docs/implementation/phase-3-slice-2b20ap2-design-round-2.md`
- `docs/implementation/phase-3-slice-2b20a-final-accepted-behavior-regression-audit.md`
- `docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-v1.md`
- `docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-v1-correction-1.md`
- `docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-design-release-review-round-1.md`
- `docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-design-release-review-correction-1.md`
- `docs/implementation/phase-3-slice-2b20a-final-restoration-coverage-profile-audit.md`
- `docs/implementation/phase-3-slice-2b20a-final-restoration-coverage-profile-review.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `AGENTS.md`
- `project-handoff/00-README-FIRST.md` 及其规定顺序中的七份 handoff 文件。

implementationAssessment:

- Delta 只修改一个生产文件和一个生产符号。
- 当前 Demon 唯一性及 snapshot/catalog 精确匹配仍在恢复 fallback 之前验证；真实 catalog mismatch 继续返回 `CURRENT_DEMON_CATALOG_MISMATCH`。
- healthy Fang Gu 继续返回 `NORMAL_INFORMATION_SUPPORTED`。
- healthy、catalog-matching Vigormortis 已恢复为完整 `NORMAL_INFORMATION_SUPPORTED`，包括既有 effectiveness model、current revision、source tenure 和 ability-instance identity。
- canonical Philosopher-caused DRUNK + Fang Gu 继续走原 V7 apparent-information capability，payload 未改变。
- canonical DRUNK + non-Fang-Gu 继续返回 `SOURCE_REPRESENTED_IMPAIRED`。
- 其他 represented DRUNK/POISONED impairment 仍在 Demon 分支前 fail closed/represented-impaired；没有扩展 poisoned-success 支持。
- No Dashii、有效或受损 Vortox、gained Dreamer 解析器均未被修改。
- 没有新增事件版本、状态字段、公共 API、通用 impairment/effect engine 或 2B20A coverage claim。
- Dreamer coverage 继续为 `PARTIAL`。

applicationAndReplayAssessment:

- `[2B19A2-C07]` 使用真实 `GameApplicationService` 和合法 Vigormortis setup。
- 成功路径生成一个原子批次：
  `DreamerTargetChosen` → `DreamerInformationDelivered` V2 → `ScheduledTaskSettled`。
- 验证了连续 sequence、单 batch、单 append、receipt、CLOSED opportunity、正式 task settlement、EFFECTIVE reliability、正确 good/evil pair 和 target actual role。
- 同一 command ID 重试为 idempotent，不追加第二批事件、不创建第二份 receipt，rebuild 状态不变。
- `[2B20A-C30]` 使用真实 accepted Vigormortis V2 stream；完整 stream 独立通过 validation、`rebuildGameState` 和 `rebuildOptionalGameState`。
- 公共 V2 validator 输入全部来自同一 canonical `DreamerTargetChosen` 后、delivery 前 prefix，包括：
  `choices`、`deliveries`、`setup`、`currentCharacterState`、`abilityImpairments`、`firstNightActionOpportunities`、`firstNightTaskPlan`、`firstNightTaskProgress`、`roleTenures`。
- 单事件 application 仅用于生成 validator prefix；完整 accepted stream 仍是 replay authority。
- shape-valid semantic tamper、缺失 settlement 和 terminal-batch 重排均被 rebuild fail closed。
- V2 delivery 保持 V2，未重解释成 V7。
- A3B1 hostile replay 测试继续只是 supporting authority，未抢占 C30 的 legacy replay primary。
- V1–V7、receipt、atomic batch、idempotency、Mathematician attribution及玩家/AI隐私回归均通过。

gates:

- Environment：Node `24.15.0`；Corepack pnpm `11.7.0`；Vitest `3.2.6`。
- Focused C34：PASS，`1/1`。
- Focused real application C07：PASS，`1/1`。
- Focused C20 retryable/receipt-free boundary：PASS，`1/1`。
- Focused canonical V2 replay C30：PASS，`1/1`。
- Focused A3B1 hostile supporting replay：PASS，`1/1`。
- Focused Mathematician C37：PASS，`1/1`。
- 完整相关测试文件：PASS，`7` project-file executions，`580/580` tests。
- Typecheck：PASS。
- Full lint：PASS，零 warning。
- Full ordinary：PASS，`35/35` files，`1572/1572` tests。
- Ownership self-test：`OWNERSHIP_CONTRACT_SELF_TEST_PASS 37/37`。
- Logical runner self-test：PASS `36/36`。
- Coverage-group self-test：PASS `7/7`。
- Candidate emit/verify：PASS；`1572` structured identities；`12` LF identities；`391257` bytes；SHA-256 `d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129`。
- Ownership/traceability：2B20A `37` traceability rows、`37` unique primary authorities、`37` supporting authorities；全部解析且无 ownership 冲突。
- Ordinary topology：`9` logical groups，semantic union `1572`，missing/duplicate/unexpected `0`。
- Coverage topology：`11` logical groups，semantic union `1572`，intersection/missing/duplicate/unexpected/wrongOwner `0`。
- Dreamer/Vortox partition：core `36`、gained `10`、intersection `0`。
- Windows inventory：PASS，baseline `305`；W1–W7=`9/90/52/73/9/26/46`；missing/duplicate/unexpected `0`。
- Fresh AP2 segmented coverage：
  `12` physical blobs → `11` logical groups → `1572` identities，全部自然退出，failure codes `[]`。
- Fresh group counts：
  `207 / 363 / 465 / 90 / 52 / 73 / 9 / 26 / 36 / 10 / 241 = 1572`。
- Fresh exact profile：
  `COVERAGE_APPROVED_PROFILE_MATCH`，
  profile `phase-3-slice-2b20a-4d576e2-final-restoration-v1`。
- Fresh obligation tuple：
  source `63 / f2373c250e1a0757dd6bb329a16417f16b9459a9dabac7eeb56b81e930c3e691`；
  statements `3213 / b493744842f7a96e4bb82b54584d0db416c87719b6a69fcb39140fe2aeeff81a`；
  functions `23 / f4c97e3e3270830939cf6a337358de3dbe4ce0ae354f000d3e6001c7cb7a00be`；
  lines `3213 / e611244a0d6e1f1720db6b1f83260ae17dd40af34a04b035a9c1116a318d0c86`；
  branches `1807 / 6637b557feb45600e3904a16373b00bc65d76500d3e339c594879a745e0d96a3`。
- Profile child only appended the new profile and changed the exact workflow selector；旧 AP2 profile未被改写。
- 独立 profile review有效：`COVERAGE_PROFILE_REVIEW_PASS`，`findings=[]`，`remainingBlockers=[]`。
- Raw legacy single-process coverage：本次未运行；既有 `35/1572` assertions green 后 `onTaskUpdate` exit-1 诊断未被伪装成产品 PASS。
- 最终 branch、HEAD 与冻结对象一致；tracked worktree clean。

findings: `[]`

backlogNonGating: `[]`

verdict: `ACCEPTED_BEHAVIOR_RESTORATION_REVIEW_PASS`

remainingBlockers: `[]`
<!-- REVIEWER_BODY_END -->
