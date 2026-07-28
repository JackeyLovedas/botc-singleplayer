reviewedHead: `5d8827626d092e05999d8c1888ce2d36afe9bdc9`

reviewTimestamp: `2026-07-26T06:42:16.9841751Z`

reviewScope:
- 独立只读 2B20AP1 Design Round 2 review。
- 分支：`infra/2b20ap1-ownership-supersession-routing-v1`。
- worktree：clean。
- Round 2 设计 SHA-256：`aac241bc6207af83d78125c0ac311d608207113d1f3340f9cb846a88c74747bc`，与指定值一致。
- 审查了 base `167d800e20bed5431764092877085886df4b7c93` 至 reviewed HEAD 的完整 docs-only diff；无 PR、无 push、无 CI/coverage 运行。
- 实际执行 `pnpm exec vitest list --workspace vitest.workspace.ts --json`；返回 `1572` 项，真实 raw shape 恰为 `{name,file,projectName}`，Windows `file` 为绝对路径。
- D01–D09 结论：
  - D01：exact 10 contract keys、12 baseline keys、字符串 marker/status/frozenBaseline shape 已关闭。
  - D02：真实 traceability path、Windows verifier path 及 `inventory --output ABS_JSON` CLI 已关闭。
  - D03：未关闭；大量 frozen physical ancestor identities 与真实 Vitest identity 不符。
  - D04：C30 已选择 canonical、nonborrowed 的现有 rebuild test；拟议 title 与现有 V1/EVIL-target body scope 相符。
  - D05：六字段 SUP schema 与 `ACCEPTED|LEGACY|HOSTILE`、`NONE|CLONE_MUTATED|PERSISTED_OR_IMPORTED_MUTATED` 域已关闭。
  - D06：本地无 full coverage/hosted gate，已关闭。
  - D07：未完全关闭；candidate CLI 缺少 raw Vitest inventory 到 canonical identity 的精确转换与两个 provenance hash 算法，且 coverage negative self-tests 没有可执行入口。
  - D08：未完全关闭；future implementation allowlist 允许修改已审查设计本身，且 correction-budget 控制与用户 B4 不一致。
  - D09：统一 graph identity、A2 locator、sentinel、长度与 SHA 均经真实 accepted blob 验证，已关闭。
- 规则语义、产品行为、production、profile、topology、process group、timeout、dependency 均未要求改变。

filesReviewed:
- `AGENTS.md`
- 用户附件 `C:\Users\wjl\.codex\attachments\8b6439c5-adeb-4beb-82e7-4a6b7d257783\pasted-text.txt`
- `project-handoff/00-README-FIRST.md`
- `project-handoff/PROJECT_HANDOFF.md`
- `project-handoff/PRODUCT_SCOPE.md`
- `project-handoff/RULES_BASELINE.md`
- `project-handoff/ARCHITECTURE_INPUT.md`
- `project-handoff/IMPLEMENTATION_GUARDRAILS.md`
- `project-handoff/OPEN_RISKS.md`
- `project-handoff/DEVELOPMENT_ROADMAP.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md`
- `docs/implementation/phase-3-slice-2b20ap1-design.md`
- `docs/implementation/phase-3-slice-2b20ap1-design-review-round-1.md`
- `docs/implementation/phase-3-slice-2b20ap1-design-round-2.md`
- `docs/implementation/phase-3-slice-2b20a-status.md`
- `docs/implementation/phase-3-slice-2b20a-test-traceability.md`
- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`
- `scripts/verify-coverage-obligations.mjs`
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
- 中国 Wiki 固定版本：首页 `5855`、筑梦师 `3046`、哲学家 `5125`、醉酒 `5720`、中毒 `6294`、数学家 `6442`、涡流 `6198`；全部 live HTTP 200，raw SHA-256 与 evidence 完全一致。
- 官方 Wiki 固定版本：Dreamer `2904`、Philosopher `2421`、States `1039`、Rules Explanation `1310`、Glossary `2874`、Mathematician `3109`、Vortox `3017`；全部 live HTTP 200，raw SHA-256 与 evidence 完全一致。
- 官方 nightsheet commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`，raw SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`；Philosopher/Dreamer/Mathematician 首夜位置为 `14/61/77`。
- 未发现 BOTC 规则冲突；Dreamer 保持 `PARTIAL`。

findings:

1. id: `R2_D03_EXACT_PHYSICAL_IDENTITIES_STILL_FALSE`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol:
   - `docs/implementation/phase-3-slice-2b20ap1-design-round-2.md`, “D03/D04 — exact 37 unique physical primaries”
   - `EXPLICIT_UNMARKED_2B20A_PRIMARIES`
   evidence:
   - 设计把所有 `app` identity 的 ancestor 冻结为 `GameApplicationService`。真实 Vitest inventory 中以下 21 项 ancestor 均为 `Phase 3 Slice 2B19A3B1 canonical-drunk Vortox Dreamer`：C01、C03–C07、C10、C12–C14、C21–C23、C25–C27、C31、C37–C40。
   - C28/C29 的真实 `ancestorPath=[]`；源码在它们之前已经关闭 `Phase 3 Slice 2B19A3A accepted-stream Dreamer projection` describe。设计错误冻结了该 describe ancestor。
   - C33 真实 ancestor 为 `Dreamer information model`；设计写成 `Dreamer domain model`。
   failureScenario: exact whitelist、37-row binding、candidate traceability validation或最终 identity audit按设计实现时无法解析这些真实 tests，或实现者只能擅自偏离冻结设计。
   requiredCorrection:
   - 用真实 Vitest list 的 exact `{file,ancestorPath,title}` 重写全部 37 mapping。
   - 21 个 application rows 使用真实 Slice ancestor；C28/C29 使用空 ancestor；C33 使用 `Dreamer information model`。
   - 保持 title/body/assertions 不变。
   requiredRegressionTests:
   - 从真实 Vitest list 证明 37 rows 各解析一次、37 distinct physical keys。
   - wrong/extra/missing ancestor deterministic rejection。
   - C28/C29 empty ancestor 与 C33 exact ancestor 单独回归。
   - zero borrowed/cross-contract/compound/duplicate primary。

2. id: `R2_D07_CANDIDATE_CANONICALIZATION_AND_PROVENANCE_HASH_UNFROZEN`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: Round 2 “complete candidate-baseline CLI contract”
   evidence:
   - 真实 Vitest list 的 `file` 是环境相关绝对路径，例如 `C:/Users/wjl/Documents/血染钟楼/...`。
   - 设计要求使用 live-audit identity/hash 算法，却没有冻结 raw `{name,file,projectName}` 到 `{project,file,ancestorPath,title}` 的转换、repo-relative path normalization、outside-repo rejection或 `name` 的 ancestor/title split。
   - `inventorySha256` 与 `traceabilitySha256` 的精确输入字节、LF/terminal-LF和排序算法未定义。
   - 当前 live audit 接收的已经是 `verify-vitest-coverage-groups.mjs` canonicalized inventory；candidate CLI直接接收 raw Vitest JSON，二者不是同一输入形态。
   failureScenario: Windows绝对仓库路径被纳入 SHA，candidate baseline 随机器路径变化；或 candidate SHA 与 live ownership audit 的 repo-relative identity不一致，导致复制 literals 后仍 `OWNERSHIP_FROZEN_BASELINE_MISMATCH`。
   requiredCorrection:
   - 冻结并复用单一 canonicalization：绝对文件必须位于 repo root；转为 `/` 分隔的 repo-relative path；`name` 按精确 `" > "` 分割，末项为 title、前项为 ancestorPath；拒绝空值、额外 key、重复 identity、outside-repo path。
   - 明确定义 `inventorySha256`、`traceabilitySha256` 的确切 canonical lines/UTF-8/LF/terminal-LF规则。
   - candidate与live audit复用同一 exported helper，避免复制漂移。
   requiredRegressionTests:
   - 同一 inventory 在不同绝对 repo roots、Windows/POSIX separators下产生相同 baseline。
   - top-level C28/C29产生空 ancestor。
   - outside-repo、duplicate、bad name/key shape拒绝。
   - LF/CRLF、重复 emit/verify、old-contract isolation保持确定。

3. id: `R2_D07_COVERAGE_NEGATIVE_SELF_TESTS_HAVE_NO_EXECUTABLE_GATE`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol:
   - Round 2 “Self-test and acceptance matrix”
   - Round 2 “Authorized local gates”
   - `scripts/verify-vitest-coverage-groups.mjs` CLI dispatcher
   evidence:
   - 设计要求 coverage self-tests 覆盖 canonical 2B20A route 及 missing/unexpected/wrong-owner/intersection negatives。
   - 真实 coverage verifier没有 `--self-test` mode；未知参数会直接失败。
   - 授权门禁只运行普通 `node scripts/verify-vitest-coverage-groups.mjs`，没有任何命令执行这些隔离负例。
   failureScenario: 实现可以声明负例已添加，但本地 acceptance 不会执行它们；selector/classifier fail-open 缺陷可能由 live happy-path inventory掩盖。
   requiredCorrection:
   - 冻结可执行的 no-filesystem-mutation `--self-test` mode，或明确把这些 fixture checks并入已执行 ownership self-test。
   - 把相应命令加入授权 local gates。
   requiredRegressionTests:
   - 2B20A exactly-once positive。
   - missing、unexpected、wrong-owner、pairwise intersection各自独立失败。
   - gained/core交叉和未知 marker拒绝。

4. id: `R2_D08_APPROVED_DESIGN_IS_MUTABLE_DURING_IMPLEMENTATION`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol: Round 2 “D08 — exact allowlists”
   evidence:
   - future implementation allowlist明确包含 “the Round-2 design”。
   - local gates只冻结 governance/parent/review hashes，没有要求通过后的最终设计 SHA 保持不变。
   - rollback也未明确恢复或校验被实现阶段修改的设计。
   failureScenario: implementer可在获得设计 PASS 后修改冻结 contract，并仍通过 allowlist，从而使实现依据与 reviewer审查的 SHA 分离。
   requiredCorrection:
   - 最终通过审查的设计文件必须从 implementation allowlist移除并按 exact SHA read-only冻结。
   - 只允许四个真实 control files同步实现状态。
   - rollback与allowlist audit都必须校验最终设计 SHA。
   requiredRegressionTests:
   - design byte mutation被allowlist/hash gate拒绝。
   - control-only status更新仍允许。
   - rollback恢复所有真正可变文件且保持设计 SHA。

5. id: `R2_D08_DESIGN_CORRECTION_BUDGET_AND_STOP_LOSS_INCONSISTENT`
   classification: `BLOCKER`
   severity: `P1`
   file/symbol:
   - Round 2 Metadata：`designRound:2/2; maxDesignRounds:2`
   - Round 2 stop-loss
   - 用户附件 B4
   - active control files
   evidence:
   - 用户 B4 允许首次 FIX 后“最多两次 docs-only 修正和新的独立复审”。
   - Round 2 是原设计后的第 `1` 次 docs-only correction；active controls也记录 `designCorrectionRound=1`。
   - Round 2 却把当前 review定义为最后 `2/2`，并规定本次不 PASS 即立即停止，错误消耗了仍授权的一次最终 correction。
   failureScenario: controller会过早进入终止状态，或为使用剩余授权而违反设计自身 stop condition。
   requiredCorrection:
   - 明确当前为 `designCorrectionRound=1/2`。
   - 本次 FIX 后只允许一次、也是最后一次 docs-only correction，可记录为 `designRound=3 / designCorrectionRound=2/2`。
   - 最终 correction后若仍无独立 PASS，或修正超出 ownership/routing/docs、要求 product/rule/profile/process/topology，则触发 stop-loss。
   requiredRegressionTests:
   - CURRENT_TASK/PROJECT_STATE/AUTOPILOT_STATE/LOG correction counters一致。
   - 不允许第三次 correction。
   - implementation在最终独立 PASS 前始终 unauthorized。

designVerdict: `RULE_DESIGN_FIX_REQUIRED`

remainingBlockers:
- `R2_D03_EXACT_PHYSICAL_IDENTITIES_STILL_FALSE`
- `R2_D07_CANDIDATE_CANONICALIZATION_AND_PROVENANCE_HASH_UNFROZEN`
- `R2_D07_COVERAGE_NEGATIVE_SELF_TESTS_HAVE_NO_EXECUTABLE_GATE`
- `R2_D08_APPROVED_DESIGN_IS_MUTABLE_DURING_IMPLEMENTATION`
- `R2_D08_DESIGN_CORRECTION_BUDGET_AND_STOP_LOSS_INCONSISTENT`

stopLoss:
- 这些 blocker 全部仍位于授权的 ownership/routing/docs 范围，不要求产品行为、BOTC 规则、profile、process group、topology、timeout或dependency变化。
- 用户 B4 仍允许一次且仅一次最终 docs-only correction；该次必须记录为 correction `2/2` 并重新接受全新独立审查。
- 若最终 correction仍不能获得无 blocker 的独立 PASS，或修正需要越出上述范围，则停止整个 2B20AP1 实现路径并转为人工阻塞状态。

behaviorDesignChanged: `false`

ruleSemanticsChanged: `false`

profileChangeRequired: `false`

newProcessGroupRequired: `false`

implementationAuthorized: `false`
