# PR 46 Final Code Review Archive

- `pr`: `46`
- `frozenFeatureHead`: `37891002e6144b984f58ac4f5b819398500f97b0`
- `mergeSha`: `ff5c824b890f7a4d5d33b4b35184d3cdc6b1e16c`
- `originalCommentUrl`: `https://github.com/JackeyLovedas/botc-singleplayer/pull/46#issuecomment-5102226458`
- `originalCommentTimestamp`: `2026-07-28T09:15:42Z`
- `originalCommentBodySha256`: `39a05d24bc5222c10a325714c85f25e382553f344bc7e58bfa2bd6d510047c8d`
- `originalCommentBodyBytes`: `8546`
- `bodyHandling`: Excluding the delimiter-adjacent LF bytes, the content between the boundary markers is the exact original UTF-8 comment body.

<!-- ORIGINAL_COMMENT_BODY_BEGIN -->
<!-- BOTC_FINAL_CODE_REVIEW
reviewedHead=37891002e6144b984f58ac4f5b819398500f97b0
-->

reviewedPR: `#46 — https://github.com/JackeyLovedas/botc-singleplayer/pull/46`

reviewedHead: `37891002e6144b984f58ac4f5b819398500f97b0`

reviewTimestamp: `2026-07-28T09:13:52.021Z`

reviewScope:

- 对 `main@5a69c90f2d3947556ff45c15c467902b1e28ca43...37891002e6144b984f58ac4f5b819398500f97b0` 的完整 PR 差异执行独立只读终审，包括 96 个变更文件、原 2B20A 设计、Product Repair Round 1/2、evidence-only stop-loss、2B20AP1、2B20AP2、PR #47 合入的测试证据基础设施、accepted-behavior restoration 及其 profile child。
- 独立核验 PR 为 `OPEN / ready / MERGEABLE`，远程 HEAD 与 reviewedHead 完全一致，本地工作区干净。
- 独立核验 live PR body SHA-256 为 `6aaacd77ff0b46cc1d45299a7988e95a82a8a703390a4a666aab7e5e379c3519`，且正文包含全部必需章节：`Rule Evidence`、`Rule Claims Implemented`、`Explicitly Unsupported Rules`、`Rule Source Revisions`、`Rule-to-Test Traceability`。正文没有预先宣称最终验收或合并授权。
- 独立复核七条历史 GitHub 自动审查意见：
  1. V7 数组数字索引 accessor 已改为 descriptor-safe、零 getter、fail-closed 验证；C20 包含 getter、throwing getter、Proxy、revoked Proxy、symbol、cycle、sparse、nonplain 与非 enumerable 数据描述符证据。
  2. 活跃 2B20A 状态中的旧 reslice stop 标志已清除。
  3. 顶层状态使用规范枚举 `WAITING_CI`；阶段细节独立记录。
  4. C34 已覆盖有效 POISONED、重复/冲突/稀疏 impairment、No Dashii、有效/冲突 Vortox、Fang Gu、Vigormortis、真实 catalog mismatch、Demon 非唯一及 source provenance 不可证矩阵。
  5. C37 通过正式 `SettleMathematicianInformation` application command 验证 FALSE V7 仅把 base Dreamer 计为 1，Philosopher 和目标均为 0，并验证 receipt、重试幂等、ledger、投影和 replay。
  6. 原产品提交 `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8` 及后续 AI 提交包含必需 `Co-Authored-By: Codex GPT-5 <noreply@openai.com>`；`70ee998...` 是 GitHub 生成的 PR #47 merge commit。
  7. `currentFeatureHead` 已绑定历史冻结产品候选 `70ee998...`；restoration HEAD 及其 CI 由更高权威的 live PR HEAD、exact-head CI 和 PR body 提供，符合阶段化证据优先级，未用未来 SHA 自引用分支文档。
- 独立核验历史唯一最终 blocker `BASE_DREAMER_NON_FANG_GU_NORMAL_AND_REPLAY_REGRESSION`：restoration source commit `4d576e205cb20c37ba913b923a1cd39e8d800d18` 只修改 `packages/domain-core/src/dreamer.ts::resolveBaseDreamerV2NormalCapability`，把已经通过唯一 Demon 与 exact catalog snapshot 门禁、且不是 Vortox/No Dashii、source 健康的最终 fallback 恢复为 `NORMAL_INFORMATION_SUPPORTED`。真实 catalog mismatch 仍在更早门禁返回 `CURRENT_DEMON_CATALOG_MISMATCH`。
- 核验 restoration 保持 healthy Fang Gu normal、canonical-drunk Fang Gu V7、canonical-drunk 非 Fang Gu represented-impaired、POISONED represented-impaired、No Dashii unresolved、Vortox forced-false、gained Dreamer、V1–V7 schema、ledger、projection、receipt 与 idempotency 语义不变。
- 核验真实 Vigormortis application stream 经过 `GameApplicationService`，原子接受 V2 target/delivery/settlement，产生一个 receipt 和一次 append；相同 commandId 重试不追加第二批事件。
- 核验 V2 replay 使用完整 accepted stream：`validateDomainEventStream`、`rebuildGameState`/`rebuildOptionalGameState`、公共 delivery validator 均接受合法历史；语义篡改、缺失 settlement、重排终端 batch 与 catalog mismatch 继续拒绝。
- 核验 V7 私有投影只向 source player/AI 暴露目标与一善一恶角色；不暴露 impairment、Philosopher provenance、truth classification、candidate policy、Demon constraint、ledger metadata 或 canonical state。状态单独投影对 V3–V7 继续要求 accepted-stream authority。
- 核验 AP1/AP2 ownership、supersession、traceability、LF-safe identity、public Vitest lifecycle、诊断脱敏、ordinary/coverage/Windows routing、blob/sidecar 与 exact profile 机制未被 restoration 改写或弱化；没有新增 `.skip`、`.only`、timeout、dependency、Vitest project 或 logical group。
- 独立核验 exact-head push run `30344384777` 与 pull-request run `30344390996`：
  - 均绑定 reviewedHead；
  - 均为 attempt 1；
  - 均 completed/success；
  - 均为 24/24 jobs success、0 non-success；
  - 均有 21 个未过期产物；
  - test merge 与 coverage merge semantic gates 均成功；
  - coverage aggregate 为 1572；
  - 两个 coverage merge 均实际请求并匹配 `phase-3-slice-2b20a-4d576e2-final-restoration-v1`。
- 历史 runs `30327867061`、`30327870216` 保持 attempt 1 且绑定 `70ee998...`；没有被重跑或继承为 restoration HEAD 的门禁。
- `git diff --check` 仅报告已归档 Markdown 审查记录中的显式 hard-break 尾随空格；没有产品、测试或脚本 whitespace finding。

productionFilesReviewed:

- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/projections/src/index.ts`
- `.github/workflows/ci.yml`
- `scripts/run-vitest-logical-group.mjs`
- `scripts/verify-coverage-obligations.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `scripts/vitest-ownership-contracts.mjs`

testFilesReviewed:

- `packages/domain-core/src/dreamer.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/test-harness/src/dreamer-v3-accepted-stream.ts`
- 重点核验身份：`[2B20A-C20]`、`[2B20A-C28]`、`[2B20A-C29]`、`[2B20A-C30]`、`[2B20A-C34]`、`[2B20A-C37]`、`[2B19A2-C07]` 及 A3B1 hostile replay supporting authority。
- 冻结 inventory：ordinary 9 logical groups / coverage 11 logical groups / 1572 identities；Windows inventory 305；primary authority 37/37；supporting authority 37/37。

ruleEvidenceReviewed:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20A.md`
- `docs/rules/evidence/2B20A-resolved.md`，SHA-256 `47e6c5a70b1eae70f51e9a4e0d78c8ab0d2ddf272babb3f9c76e51970c893189`
- `docs/rules/evidence/2B20AP2.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
- `docs/implementation/phase-3-slice-2b20a-traceability-classification-correction-v1.md`
- 原 2B20A design/review、Product Repair Round 1/2 design/review/implementation、evidence-only stop-loss review、AP1/AP2 design/review/implementation/final-review 链。
- `docs/implementation/phase-3-slice-2b20a-final-accepted-behavior-regression-audit.md`
- `docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-v1.md`
- `docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-v1-correction-1.md`
- `docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-design-release-review-correction-1.md`
- `docs/implementation/phase-3-slice-2b20a-final-restoration-coverage-profile-audit.md`
- `docs/implementation/phase-3-slice-2b20a-final-restoration-coverage-profile-review.md`
- `docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-implementation-review.md`
- 用户指定中文 Wiki 固定 oldid：主页 5855、筑梦师 3046、哲学家 5125、醉酒 5720、中毒 6294、数学家 6442、涡流 6198；七个 live raw 内容哈希均与 evidence 记录一致。
- 官方 BOTC Wiki：Dreamer oldid 2904、Philosopher oldid 2421、Mathematician oldid 3109、Vortox oldid 3017，以及 evidence 固定的 States、Rules Explanation、Glossary 修订。
- 官方 nightsheet commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`；首夜顺序 Philosopher 14、Dreamer 61、Mathematician 77。
- 规则结论：base Dreamer 是行动、信息、ledger 与 Mathematician counted-player source；Philosopher 仅是该 canonical DRUNK 的因果 provenance。V7 TRUE 为正常贡献 0，V7 FALSE 为一个 `SOURCE_DRUNKENNESS` abnormal contribution。没有实质来源冲突。

findings: `[]`

codeVerdict: `CODE_REVIEW_PASS`

ruleVerdict: `RULE_REVIEW_PASS`

remainingBlockers: `[]`
<!-- ORIGINAL_COMMENT_BODY_END -->
