reviewedHead: `43c764f3e6542afd93994032338f045d121965ae`

reviewTimestamp: `2026-07-26T05:56:16.5292898Z`

reviewScope:
- 独立只读 2B20AP1 design review。
- 已核对分支 `infra/2b20ap1-ownership-supersession-routing-v1`、指定 HEAD、clean worktree、设计/治理文件哈希。
- 当前分支无 PR；审查了从基础提交 `167d800e20bed5431764092877085886df4b7c93` 至 reviewed HEAD 的完整文件范围。
- 未修改文件、未运行 CI、未运行 coverage、未 push/commit/PR。

filesReviewed:
- `C:\Users\wjl\.codex\attachments\8b6439c5-adeb-4beb-82e7-4a6b7d257783\pasted-text.txt`
- `AGENTS.md`
- `project-handoff/00-README-FIRST.md`
- `project-handoff/PROJECT_HANDOFF.md`
- `project-handoff/PRODUCT_SCOPE.md`
- `project-handoff/RULES_BASELINE.md`
- `project-handoff/ARCHITECTURE_INPUT.md`
- `project-handoff/IMPLEMENTATION_GUARDRAILS.md`
- `project-handoff/OPEN_RISKS.md`
- `project-handoff/DEVELOPMENT_ROADMAP.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20A.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md`, SHA-256 `583f1778582c168935b380b19e453117b000d8caf18dd3a4cd7731365cdb3537`
- `docs/implementation/phase-3-slice-2b20ap1-design.md`, SHA-256 `622d5e8572e933a38c5503fa80ee342c8acee084b62ed1578ede0569a3e22c46`
- `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
- `docs/implementation/phase-3-slice-2b20a-traceability-classification-correction-v1.md`
- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `.github/workflows/ci.yml`
- `vitest.workspace.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

ruleEvidenceReviewed:
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20A.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- 中国 Wiki 固定版本：筑梦师 `oldid=3046`、哲学家 `oldid=5125`、醉酒 `oldid=5720`、数学家 `oldid=6442`、涡流 `oldid=6198`；实时内容哈希与证据记录一致。
- 官方 Wiki 固定版本：Dreamer `oldid=2904`、Philosopher `oldid=2421`、States `oldid=1039`、Mathematician `oldid=3109`、Vortox `oldid=3017`；实时内容哈希与证据记录一致。
- 官方 nightsheet commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`，SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`；确认首夜 Philosopher `14`、Dreamer `61`、Mathematician `77`。
- 未发现 BOTC 规则冲突；本设计不需要改变角色语义或 coverage matrix。

findings:

1. id: `D01_OWNERSHIP_CONTRACT_RUNTIME_SHAPE_INVALID`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: `docs/implementation/phase-3-slice-2b20ap1-design.md:53`; `scripts/vitest-ownership-contracts.mjs` `CONTRACT_KEYS` / `validateContractsInner`
   evidence: 设计声称采用“existing contract shape”，却冻结 `traceabilityPath`、`supportingAuthorityPattern`、RegExp `markerPattern` 和顶层计数。真实 exact runtime shape 要求 `traceabilityFile`、`supportingAuthorityPrefix`、字符串 `markerPattern`、`status:"ACTIVE"` 以及完整 `frozenBaseline` 对象。
   failureScenario: implementer 按设计物化对象后立即得到 `INVALID_OWNERSHIP_CONTRACT_REGISTRY`，无法注册 2B20A contract。
   requiredCorrection: 用当前 validator 的 exact key set、类型和嵌套结构重写完整 2B20A contract；明确全部 frozen-baseline 字段及生成/复制规则。
   requiredRegressionTests:
   - exact valid 2B20A contract fixture passes；
   - missing/extra/wrong-type contract key fixtures fail with exact deterministic code；
   - RegExp-vs-string、缺 `status`、缺 `frozenBaseline` 均直接拒绝。

2. id: `D02_REAL_PATHS_AND_CLI_DO_NOT_MATCH`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: design lines 53, 187, 201–206；实际 scripts/docs paths
   evidence:
   - 设计使用不存在的 `docs/implementation/phase-3-slice-2b20a-traceability.md`；真实文件是 `phase-3-slice-2b20a-test-traceability.md`。
   - 设计调用不存在的 `scripts/verify-vitest-windows-inventory.mjs`。
   - 真实 Windows verifier 是 `verify-vitest-windows-application-groups.mjs`，CLI 仅支持 `inventory --output <absolute-json>` 或 `run|verify --output-dir <absolute-dir>`，没有 `--self-test` 或无参 audit。
   failureScenario: contract import、allowlist检查和本地门禁均会因文件/CLI 不存在而失败。
   requiredCorrection: 冻结真实 traceability path；把 Windows 验证写成真实、可执行且不触发 hosted/W7-exit investigation 的 inventory 命令，并明确临时绝对输出路径和清理方式。
   requiredRegressionTests:
   - contract traceability path exists；
   - Windows inventory 命令按冻结 CLI 成功；
   - 错误 mode、相对输出路径和缺参数均非零退出。

3. id: `D03_C28_C29_PHYSICAL_IDENTITIES_INCORRECT`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: design lines 85–86, 195
   evidence: 设计写成 `packages/projections/src/player-views.test.ts`，且标题分别为 “projects only...” / “keeps hostile...”。真实身份位于 `packages/projections/src/private-knowledge-view.test.ts`，标题为：
   - `[2B20A-C28] rejects state-only V7 for both player and AI projection authority`
   - `[2B20A-C29] rejects hostile state-only V7 accessors and proxies without invoking getters`
   设计自身明确规定 projection-path mismatch 是 design-review fix condition，implementer 不得猜测。
   failureScenario: traceability binding 找不到实际 primary，或实现者被迫自行替换冻结 identity。
   requiredCorrection: 用真实 file/ancestor/title 冻结 C28/C29，或明确设计授权的 title migration；不可把决定留给 implementer。
   requiredRegressionTests:
   - C28/C29 各解析为且仅解析为一个 physical identity；
   - wrong path/title/ancestor 各自 deterministic rejection。

4. id: `D04_C30_IS_STILL_A_BORROWED_REGISTERED_PRIMARY`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: design lines 87, 99；`scripts/vitest-ownership-contracts.mjs` `RAW_OWNERSHIP_CONTRACTS`
   evidence: 设计把 `[2B19A3B2-LEGACY] preserves accepted legacy and prior Dreamer authorities without migration` 称为“marker is not a registered ownership prefix”。实际 `2B19A3B2` 已是 ACTIVE registered contract，prefix 为 `[2B19A3B2-`。
   failureScenario: C30 继续借用 A3B2 primary，违反 37 exact unique primaries、zero borrowed/cross-contract primaries。
   requiredCorrection: 为 C30 选择一个真实非注册、唯一 primary，或将该 A3B2 authority 降为 supporting-only 并冻结独立合法 C30 primary。
   requiredRegressionTests:
   - alias/registered A3B2 test cannot become 2B20A primary；
   - 37 rows resolve to 37 unique keys；
   - zero cross-contract primary collisions。

5. id: `D05_SUP_REGISTRY_VIOLATES_REVIEW_PROTOCOL_SCHEMA`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: design lines 103–149；`REVIEW_PROTOCOL.md` Supporting Authority Gate
   evidence: 设计表头为 `ProducerKind | ProducerIdentity | AuthorityRole...`，没有协议要求的 `Producer`、`SourceTestOrFixture`、`AuthorityStatus`。其 disposition 值 `SUPERSEDED_PREDECESSOR_ONLY` / `PRESERVED_UNCHANGED` 也不属于协议冻结的 `NONE|CLONE_MUTATED|PERSISTED_OR_IMPORTED_MUTATED`。
   failureScenario: registry 即使被当前宽松 parser 读取，也不能证明支持证据的 accepted/legacy/hostile 状态和 mutation provenance。
   requiredCorrection: 按 REVIEW_PROTOCOL 的 implementation-time exact fields/value domains 重写 37 条 registry；如需额外 supersession 属性，作为附加独立字段定义，不能替换协议字段。
   requiredRegressionTests:
   - 37 definitions/37 references bijective；
   - missing/duplicate/unused/foreign ID rejection；
   - invalid AuthorityStatus/MutationDisposition rejection；
   - supporting authority 永不成为 primary。

6. id: `D06_LOCAL_GATE_EXCEEDS_USER_B6_AUTHORITY`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: design lines 197–214；governance lines 527–547；用户附件 B6
   evidence: 设计强制本地运行 `pnpm test:coverage` 并在 review 前要求该 gate；治理 GO 明确 full coverage execution 不是本地 acceptance requirement，用户 B6 仅要求本地 inventory、focused、typecheck、lint、full ordinary，且本任务不要求/授权 full coverage process、GitHub Actions 或 hosted Windows。
   failureScenario: implementation 被已知 worker-RPC coverage-process 风险重新阻断，越过本基础设施里程碑授权边界。
   requiredCorrection: 从本地 acceptance gate 删除 full coverage process 和 GitHub CI 成功要求；只保留用户 B6 的本地门禁。未运行的 coverage/CI 必须记录为未运行或 C32 hosted pending。
   requiredRegressionTests:
   - local gate manifest 不包含 `pnpm test:coverage`、GitHub/hosted run；
   - C32 static 可本地 PASS；
   - HostedEvidenceStatus 始终为 `PENDING_EXACT_HEAD_CI`。

7. id: `D07_CANDIDATE_BASELINE_CLI_AND_OUTPUT_UNDEFINED`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: design line 53；`scripts/verify-vitest-ownership-contracts.mjs` CLI dispatcher
   evidence: 设计要求执行 `--emit-candidate-baseline 2B20A`，但真实 verifier 仅接受 `--self-test`。设计没有明确授权新增该 CLI、输出 schema、三项或完整 baseline 字段、stderr/exit contract，也没有说明候选值如何在旧 contracts 尚失败时独立计算。
   failureScenario: implementer 必须自行设计 CLI 和 candidate-baseline 算法，或无法取得冻结 literals。
   requiredCorrection: 在设计中完整冻结新增 CLI 的输入、输出 JSON schema、计算域、顺序、错误码和旧-contract drift 隔离；或者预先计算并冻结全部 literals，禁止 implementer 自选 baseline。
   requiredRegressionTests:
   - candidate output deterministic across LF/CRLF and repeated runs；
   - only requested contract emitted；
   - existing accepted baselines cannot be refreshed；
   - differing second emission触发明确 stop code。

8. id: `D08_CONTROL_DOC_ALLOWLIST_IS_INCOMPLETE_AND_NAMES_NONEXISTENT_FILES`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: design lines 178–195, 218
   evidence: allowlist列出不存在的 `docs/agent-loop/IMPLEMENTATION_STATUS.md`、`project-handoff/01-PROJECT-CONTROL.md`、`project-handoff/03-IMPLEMENTATION-STATUS.md`，却遗漏当前实际权威 `docs/agent-loop/AUTOPILOT_STATE.json` 与 `docs/agent-loop/PROJECT_STATE.md`。用户授权要求任务/控制状态同步。
   failureScenario: 实现通过后要么留下权威控制状态 stale，要么为同步而违反 allowlist。
   requiredCorrection: 用实际存在的 active control files 重写 allowlist；明确哪些文件必须同步、哪些不可创建，保持 production/rule/profile 文件禁止不变。
   requiredRegressionTests:
   - allowlist中每个既有路径存在；
   - required control files全覆盖；
   - production/profile/lockfile/rule evidence/role matrix diff 均拒绝。

9. id: `D09_SUPERSESSION_GRAPH_AND_SUBCASE_PROOF_NOT_SELF_CONTAINED`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: design lines 40, 47, 49, 172–174
   evidence: predecessor key包含 `acceptedHead`，successor key明确省略该字段，但设计又要求 DFS cycle/self-cycle；未定义两种不同 key 如何组成同一图节点。A2/C20 的 canonical subcase key 也未定义如何从 accepted blob 中验证，历史源码不存在该新 key token。
   failureScenario: cycle检测可能永远无法连接 successor 与后继 predecessor；subcase记录可能只验证非空字符串而没有证明 accepted historical subcase。
   requiredCorrection: 冻结统一、无歧义的 graph node identity和 edge matching规则；定义跨 generation/head 的匹配；定义 A2/C20 subcase 的可审计历史 locator/hash/结构证据及 exact verification。
   requiredRegressionTests:
   - self-cycle、2-node cycle、multi-generation cycle；
   - identical/different multiple successor；
   - historical subcase present、missing、renamed、wrong body/hash；
   - whole/subcase overlap。

designVerdict: `RULE_DESIGN_FIX_REQUIRED`

remainingBlockers:
- `D01_OWNERSHIP_CONTRACT_RUNTIME_SHAPE_INVALID`
- `D02_REAL_PATHS_AND_CLI_DO_NOT_MATCH`
- `D03_C28_C29_PHYSICAL_IDENTITIES_INCORRECT`
- `D04_C30_IS_STILL_A_BORROWED_REGISTERED_PRIMARY`
- `D05_SUP_REGISTRY_VIOLATES_REVIEW_PROTOCOL_SCHEMA`
- `D06_LOCAL_GATE_EXCEEDS_USER_B6_AUTHORITY`
- `D07_CANDIDATE_BASELINE_CLI_AND_OUTPUT_UNDEFINED`
- `D08_CONTROL_DOC_ALLOWLIST_IS_INCOMPLETE_AND_NAMES_NONEXISTENT_FILES`
- `D09_SUPERSESSION_GRAPH_AND_SUBCASE_PROOF_NOT_SELF_CONTAINED`

behaviorDesignChanged: `false`

ruleSemanticsChanged: `false`

profileChangeRequired: `false`

newProcessGroupRequired: `false`

implementationAuthorized: `false`
