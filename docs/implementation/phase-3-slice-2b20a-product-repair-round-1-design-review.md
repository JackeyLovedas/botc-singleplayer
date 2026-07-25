reviewedHead：
627dc709dcbf94e92b61a82cef0b75020b936146

reviewedDesign：
docs/implementation/phase-3-slice-2b20a-product-repair-round-1-design.md

reviewedDesignSha256：
eb8f23f5f8696125ff106a214031c57c4901f67031c270b94f8c9ba74980d6e8

repairBaseHead：
dbfa424c96a8bcf06a0d2a77205626a532aa2ec8

reviewTimestamp：
2026-07-25T01:09:03.8290038Z

reviewScope：
PR #46 的完整 25 文件产品差异、repair base 至本地 design head 的完整五文件文档/控制差异、F01/C20、F04/C34、F05/C37、受影响生产代码及测试、正式 Mathematician 命令链、规则/夜序/角色覆盖、回放和批次语义、收据/幂等、信息隔离、确定性、实现状态、控制状态、三个指定 GitHub review thread，以及 repair-base 精确 CI。未编辑、提交、推送、修改 PR、重跑 CI 或开始实现。

authoritiesReviewed：
- AGENTS.md、project-handoff/00-README-FIRST.md 指定的完整交接顺序、docs/agent-loop/AUTOPILOT_PROMPT.md、docs/agent-loop/REVIEW_PROTOCOL.md。
- docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md；其实际 SHA-256 为 f32bcbc92feb710afb9d12f6105c89e8223a7ea98bd1d73ce249b15b3d59a432。
- 冻结 Round 2 design、traceability classification correction、design release review、当前 implementation status、test traceability、AUTOPILOT_STATE、CURRENT_TASK、PROJECT_STATE、AUTOPILOT_LOG。
- docs/rules/USER_OVERRIDES.md、docs/rules/evidence/2B20A-resolved.md、当前 docs/rules/ROLE_COVERAGE_MATRIX.md。
- 独立读取并核验 Chinese Wiki 固定版本：首页 5855、Dreamer 3046、Philosopher 5125、Drunk 5720、Poisoned 6294、Mathematician 6442、Vortox 6198。
- 独立读取并核验 Official BOTC Wiki 固定版本：Dreamer 2904、Philosopher 2421、States 1039、Rules Explanation 1310、Glossary 2874、Mathematician 3109、Vortox 3017。
- Official nightsheet 固定 commit 915347e627c3f6cd1f438f82b6001784e11b3e8b；核验首夜位置 Philosopher 14、Dreamer 61、Mathematician 77。
- PR #46 discussion_r3643950980、discussion_r3643950989、discussion_r3643950990。
- repair-base push run 30077541075 与 pull-request run 30077586762；两者均只绑定 dbfa424c96a8bcf06a0d2a77205626a532aa2ec8，且均失败。本地 design head 没有被错误赋予或继承 CI 权威。

productionFilesReviewed：
- packages/domain-core/src/dreamer.ts
- packages/domain-core/src/domain-batch-semantics.ts
- packages/domain-core/src/first-night-ability-outcome-ledger.ts
- packages/domain-core/src/mathematician-internal.ts
- packages/domain-core/src/philosopher-ability.ts
- packages/application/src/game-application-service.ts
- packages/projections/src/index.ts

testFilesReviewed：
- packages/domain-core/src/dreamer.test.ts
- packages/application/src/game-application-service.test.ts
- packages/application/src/mathematician-test-fixtures.ts
- packages/projections/src/private-knowledge-view.test.ts

findingAudit：
- F01/C20：确认现有 array 分支通过 candidate[index] 读取数值索引，能够调用攻击者 getter。设计要求 own descriptor、data descriptor、descriptor.value 递归、零 getter 调用及 Proxy/revoked controls，修复方向准确且只需 dreamer.ts。
- F04/C34：确认现有测试只有成功例和保留 DRUNK-only 字段的伪 POISONED 例，不能证明完整相邻状态矩阵。设计列出的合法 POISONED、冲突/陈旧 impairment、Fang Gu、No Dashii、Vortox、其他 Demon、非唯一 Demon、catalog mismatch、provenance failure 和 gained-Dreamer control 与当前 resolver 的既有结果一致，不授权行为变化。
- F05/C37：确认现有测试只过滤 ledger，没有调用正式 Mathematician resolver/command aggregation。设计要求在同一 service/store 上执行真实 SettleMathematicianInformation，验证两个终端事件、trueCount/selectedCount=1、Dreamer 单一归因、收据、幂等、原子追加和重建，且现有生产路径足以完成，无需第二个生产文件。
- 规则没有冲突：醉酒 Dreamer 可收到结构合法但真或假的表观信息；Mathematician 计数对象是能力异常的 Dreamer，Philosopher 仅为致因来源；当前无 Vortox。
- 当前角色覆盖保持 Dreamer、Philosopher、Mathematician 为 PARTIAL，Vortox 为 NOT_STARTED，没有角色被错误提升为 COMPLETE。

scopeAudit：
- 生产白名单严格为 packages/domain-core/src/dreamer.ts。
- 测试白名单严格为 dreamer.test.ts 与 game-application-service.test.ts。
- behaviorDesignChanged=false、ruleSemanticsChanged=false；不新增事件、命令、状态字段、投影或 Mathematician 行为。
- 本地 design head 627dc709dcbf94e92b61a82cef0b75020b936146 与远程 repair base/PR HEAD 分开记录；currentFeatureHead 没有被错误改写为本地文档 commit。
- design-only 差异仅包含新 design 与四个 agent-loop 控制文件；没有生产、测试、脚本、workflow、profile 或 dependency 变化。
- repairRound 仍为 0/2，productRepairRoundConsumed=false；设计和本次审查未消耗 repair。
- 旧 2B20 在专用 archive 对象和历史章节中正确标为 archive，但顶层 implementationBranch 仍错误指向其旧分支，见 finding 3。

stopLossAudit：
- 设计已要求：出现额外行为缺陷、需要第二生产文件、规则/事件/历史兼容性变化、需要实现 POISONED/No Dashii、或 C37 无法使用现有正式命令链时立即停止。
- F01/F04/F05 均可在当前生产/测试白名单内实现，未触发产品行为 reslice。
- ownership supersession、Linux worker-RPC 和 Windows W7 属于独立后续验收/合并工作，不应成为开始本轮产品实现的先决条件；当前设计和控制文本对此仍存在相反或不明确的表述，见 finding 2。

findings：
1.
severity：P1
file/symbol：docs/implementation/phase-3-slice-2b20a-product-repair-round-1-design.md，Metadata governanceAdr / governanceAdrSha256
failure scenario：design 指向不存在的 docs/architecture/ADR-0004-test-traceability-classification-and-acceptance.md。记录的 SHA-256 实际对应 docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md。按 design 路径读取的 implementer/reviewer 无法取得强制治理权威，也无法在声明路径上完成 path/hash 完整性验证。
required correction：将 governanceAdr 改为实际存在的 ADR-reachability-trust-boundaries-and-review-governance-v1.md，保留并重新核验匹配 hash；重新计算 design hash，并在新 design head 上重新审查。
required regression tests：对 design 中所有 path/hash 元数据执行“文件存在且 SHA-256 精确匹配”的静态检查；不存在路径或 hash mismatch 必须失败。

2.
severity：P1
file/symbol：phase-3-slice-2b20a-product-repair-round-1-design.md 的 Ownership and Supersession Dependency、Verification Gates；CURRENT_TASK.md 当前 blockers；PROJECT_STATE.md 当前 blockers；AUTOPILOT_STATE.json 的 slice2B20AGate.remainingBlockers 与顶层 remainingBlockers
failure scenario：design 将 ownership、Linux CI 和 Windows observability 称为“三个独立 prerequisites”，控制面又把它们与 design review 一起列为当前 blockers，但没有明确限定为实现后的验收/合并门。独立 design review 结束后，控制器无法无歧义地判断 F01/F04/F05 实现是否已获准，可能违反“产品实现不依赖先完成 ownership 或 CI infrastructure”的冻结约束。
required correction：明确规定本轮产品实现的唯一前置门是修正后的独立 design review；将 ownership supersession、Linux 和 Windows 工作限定为实现后的独立验收/合并门。同步 design、CURRENT_TASK、PROJECT_STATE 和 AUTOPILOT_STATE 的 implementation gate、remaining blockers 与 next action；不得在本轮实现中修改 ownership 或 CI 基础设施。
required regression tests：控制 JSON 解析后断言 implementation authorization 不依赖 ownership/Linux/Windows；审查门关闭后 next action 必须直接指向仅 F01/F04/F05 的实现；diff-scope 检查必须证明没有 ownership、workflow、profile、dependency 或 CI-infrastructure 文件进入实现白名单。

3.
severity：P1
file/symbol：docs/agent-loop/AUTOPILOT_STATE.json，顶层 implementationBranch
failure scenario：currentBranch 和 slice2B20AGate.branch 均为 phase-3/reachable-base-dreamer-settleability-closure，但顶层 implementationBranch 仍为已归档 2B20 的 phase-3/first-night-completion-day-entry。写入代理若遵循该字段，会在旧 reslice 分支开始实现，破坏“旧 2B20 仅 archive”、单 slice/单 branch 和冻结 repair-base 约束。
required correction：将顶层 implementationBranch 同步为当前 2B20A 分支，或在实现获准前置为 null 并在获准时原子设置为当前分支；旧分支只能保留在 slice2B20Archive 或明确的历史记录中。
required regression tests：解析 AUTOPILOT_STATE.json，断言实现开始时 implementationBranch、currentBranch、slice2B20AGate.branch 三者一致；断言活动控制字段不引用旧 2B20 分支；同时确认 repairBaseHead 仍为 dbfa424c96a8bcf06a0d2a77205626a532aa2ec8，且本地 design head 仅作为独立审查绑定记录。

designVerdict：
RULE_DESIGN_FIX_REQUIRED

remainingBlockers：
- GOVERNANCE_ADR_PATH_DOES_NOT_RESOLVE
- IMPLEMENTATION_GATE_AMBIGUOUSLY_DEPENDS_ON_OWNERSHIP_AND_CI
- ACTIVE_IMPLEMENTATION_BRANCH_POINTS_TO_ARCHIVED_2B20
