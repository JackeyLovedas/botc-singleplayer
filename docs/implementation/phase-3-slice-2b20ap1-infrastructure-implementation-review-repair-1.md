reviewedHead: `2e7ecb95e589eceff38484d928017260314bfb36`

reviewTimestamp: `2026-07-26T21:04:47.0587327+08:00`

reviewScope: `Phase 3 Slice 2B20AP1 Infrastructure Repair 1/2；完整审查 d0faf387..2e7ecb95 的 11 文件差异、冻结设计链、生命周期 Correction 1、相关脚本/测试/控制状态，并独立重跑全部获授权本地门禁。未运行 full coverage、hosted CI 或 profile refresh。`

filesReviewed:

- `AGENTS.md`
- `project-handoff/00-README-FIRST.md` 规定的 handoff/rules/tests/architecture/status 链
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md`
- `docs/implementation/phase-3-slice-2b20ap1-design-round-3.md`
- `docs/implementation/phase-3-slice-2b20ap1-design-review-round-3.md`
- 完整 LF-safe amendment、Correction 1/2、review 链
- `docs/implementation/phase-3-slice-2b20ap1-public-vitest-lifecycle-override-v1.md`
- `docs/implementation/phase-3-slice-2b20ap1-public-vitest-lifecycle-override-v1-correction-1.md`
- `docs/implementation/phase-3-slice-2b20ap1-public-vitest-lifecycle-override-review-final.md`
- `.github/workflows/ci.yml`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/vitest-ownership-contracts.mjs`
- Vitest 3.2.6 public declarations and installed close implementation

productionFilesReviewed:

- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/application/src/game-application-service.ts`
- 上述生产文件在审查区间内差异为零。

testFilesReviewed:

- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- 以及 traceability 引用的 Dreamer、projection 和 accepted-history 测试身份。

ruleEvidenceReviewed:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- 用户指定中文 Wiki、官方 BOTC Wiki、官方 nightsheet 及其当前证据链
- 本次为非产品基础设施变更，没有新增或改变规则 claim。

findings:

1. severity: `BLOCKER`
   file/symbol: `scripts/verify-vitest-ownership-contracts.mjs:57-70 safeDiagnostic；:207-254 executeCandidateLifecycle；:576-588 runCandidateCommand；:1458-1472 top-level catch`
   failureScenario: Correction 1 冻结的外部诊断必须严格序列化为 `phase,classification,source,ordinal,name,message` 六键且顺序固定。实现实际输出 `channel,classification,name,message,...`，缺少 `phase/source`，增加 `sha256`，使用未批准的 channel/source 值；warning 的正文被替换为空字符串；capture-invalid 被折叠为普通 `CLOSE_FAILED`；生命周期 JSON 后还追加非 JSON 的裸错误码行。因此 close rejection、fulfilled-with-close-error、warning-only 或 capture-integrity failure 均不能满足冻结 exact-shape 和确定性诊断合同。
   requiredCorrection: Repair 2/2 中建立唯一诊断序列化边界，严格输出六键及固定顺序；只使用 `PUBLIC_PROMISE_REJECTION`、`PUBLIC_INJECTED_STDERR`、`PUBLIC_INJECTED_STDERR_CAPTURE`；保留正确 phase、分类、安全归一化后的真实 message 和按类别从零开始的 ordinal；capture-invalid 保持其专属分类；生命周期诊断不得追加非合同裸行。
   requiredRegressionTests: 对 create/collect/validation/encoding primary、close Promise rejection、fulfilled sentinel、primary+close rejection、primary+close stderr、invalid capture、warning-only 分别捕获真实 stderr；逐行验证可解析 JSON、own-key 集合与顺序、固定 source/phase/classification、message 保留、ordinal 和重复运行字节一致。

2. severity: `BLOCKER`
   file/symbol: `scripts/verify-vitest-ownership-contracts.mjs:1225-1436 runCompleteSelfTest`
   failureScenario: 输出虽为 `37/37`，但没有实际证明冻结的十二生命周期组。所谓 validation failure 只在 `encode` 回调抛错，没有独立 validation/encoding 注入；没有 primary+close Promise rejection；原子发布测试只有成功路径，没有 temporary write/close/rename failure；没有明确证明 create rejection 时 collection/close 均为零；没有单独证明 repository collection-wrapper entry 恰好一次；确定性重复仅依赖审查时外部双 emit，而非冻结 self-test group。绿的 `37/37` 因而不能作为所声明十二组已闭合的证据。
   requiredCorrection: Repair 2/2 中保留现有测试并补齐冻结十二组的真实注入点和断言；若需要，拆分 validation 与 encoding 生命周期回调，并给原子发布边界加入仅供自测的可控 write/close/rename 注入。
   requiredRegressionTests: 精确覆盖 create、clean success、collect、validation、encoding、两种 close failure、两种 primary+close failure、write/close/rename 原子失败且无 partial final、重复字节、wrapper-entry=1、真实 1572/12、真实 public close/no-hang；报告仍不得创建第十三组。

3. severity: `BLOCKER`
   file/symbol: `scripts/verify-vitest-ownership-contracts.mjs:321-440 collectSemanticInventory，尤其 :376`
   failureScenario: 实现读取 `test.task?.result?.state`。Vitest 3.2.6 的 public `TestCase` 声明暴露的是 `result(): TestResult`，没有公开 `.task`。这违反仅使用 public structured API 和 `privateFieldsInspected=false` 的冻结合同；如果 runtime 隐藏该私有字段，已执行的 passed/failed 测试会因 optional chaining返回 undefined 而被错误接受。
   requiredCorrection: Repair 2/2 中只调用 public `test.result()`，验证其返回 exact supported state，并对非 `pending` 的已执行或跳过状态 fail closed；删除所有 `.task` 读取。
   requiredRegressionTests: 使用只有公开成员、没有 `.task` 的 TestCase double 验证 pending 可接受；passed/failed/skipped、缺失或非函数 `result`、throwing result 均 fail closed；增加静态断言禁止候选采集路径访问 `.task`。

implementationReviewVerdict: `INFRASTRUCTURE_IMPLEMENTATION_REVIEW_FIX_REQUIRED`

remainingBlockers:

- `LFC_IMPLEMENTATION_EXTERNAL_DIAGNOSTIC_EXACT_SHAPE_VIOLATION`
- `LFC_IMPLEMENTATION_MANDATORY_LIFECYCLE_SELF_TEST_GROUPS_INCOMPLETE`
- `LFC_IMPLEMENTATION_PRIVATE_TESTCASE_TASK_ACCESS`

lifecycleAudit: `FAIL — 正常真实 Vitest 3.2.6 生命周期、clean close 和自然退出通过；错误诊断合同、自测覆盖和 public-only TestCase 边界未通过。`

candidateAudit: `PASS_HAPPY_PATH / FAIL_FAILURE_CONTRACT — 两次独立 emit 字节一致，verify 通过，1572 identities、12 LF titles、candidate SHA d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129；错误通道受 finding 1-3 阻塞。`

ownershipAudit: `PASS — 5/5 contracts；2B20A 22 application executions；accepted supersession/provenance、canonical、duplicate、borrowed、unregistered checks 通过；旧 accepted baseline hashes 未改变。`

traceabilityAudit: `PASS — 37/37 criteria、37/37 supporting authorities、SUP37 exact link；C32 static PASS/hosted pending。`

routingAudit: `PASS — ordinary 9 groups、coverage 11 groups、总计 1572；zero missing/duplicate/unexpected/wrong-owner；Windows W1-W7=9/90/52/73/9/26/46，inventory 305。`

gateResults:

- Node `v24.15.0`：PASS
- pnpm `11.7.0`：PASS
- ownership self-test：命令 PASS `37/37`，但证据充分性 FAIL，见 finding 2
- coverage self-test：PASS `7/7`
- candidate emit/verify/repeat：PASS，真实 close stderr 为零
- focused application：PASS `296/296`
- focused rebuild：PASS `207/207`
- targeted ESLint：PASS
- `pnpm typecheck`：PASS
- `pnpm lint`：PASS
- `pnpm test`：PASS，`35 files / 1572 tests`
- `git diff --check`：PASS
- full local coverage：未运行，按授权排除
- hosted CI/profile：未运行，按授权排除
- 最终 worktree：clean

allowlistAudit: `PASS — 差异恰为批准的 11 个文件；生产、规则、ROLE_COVERAGE_MATRIX、profile、workspace、dependency、lockfile、timeout 和 process-group 文件差异均为零。`

titleAudit: `PASS — application 测试仅 22 个前缀移除；rebuild 仅 C30 标题替换；测试正文和断言不变；.only=0，.skip=0。`

productBehaviorChanged: `false`

ruleSemanticsChanged: `false`

InfrastructureRepair: `1/2 已消耗；需要且只允许一次精确 Repair 2/2，范围限定为上述三个生命周期实现 blocker 及相应控制状态同步。`

budgetAudit: `Product Repair round 未消耗；Infrastructure Repair 尚余 1 次；不得创建 Infrastructure Repair 3/2。Linux worker-RPC 与 Windows W7 是后续独立 hosted/downstream gate，不属于本次三个本地实现 blocker。`
