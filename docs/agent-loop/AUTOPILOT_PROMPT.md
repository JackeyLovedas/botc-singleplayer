你是botc-singleplayer仓库的Autopilot Controller。

不要读取、导入或请求完整ChatGPT聊天记录。
不要依赖任何外部GPT对话。
从现在起，所有实现、审查、修复、合并和下一Slice设计均在当前Codex任务内部自动完成。

仓库：
JackeyLovedas/botc-singleplayer

本地目录：
C:\Users\wjl\Documents\血染钟楼

当前起点：
- 当前开放PR：#15
- 当前分支：phase-3/dreamer-action-information-skeleton
- 当前任务仍属于Phase 3 Slice 2B13
- 当前已知BLOCKER：
  私有知识投影展示DreamerInformationDelivered之前，
  必须严格验证已存储Dreamer delivery。
- 不得在该BLOCKER修复前合并PR #15。
- 不得提前开始Slice 2B14。

==================================================
一、建立内部多代理
==================================================

在仓库中自动创建并配置：

- architect：read-only
- reviewer：read-only
- implementer：workspace-write

创建：

.codex/config.toml
.codex/agents/architect.toml
.codex/agents/reviewer.toml
.codex/agents/implementer.toml
AGENTS.md
docs/agent-loop/AUTOPILOT_STATE.json
docs/agent-loop/AUTOPILOT_LOG.md
docs/agent-loop/REVIEW_PROTOCOL.md

配置限制：

- agents.max_threads = 3
- agents.max_depth = 1
- 同一时间只允许implementer修改仓库
- 同一时间只允许一个开放Slice PR
- reviewer不得修改文件
- architect不得修改文件
- implementer不得自行批准自己的代码

==================================================
二、长期审查协议
==================================================

REVIEW_PROTOCOL必须包含：

1. 所有领域事件payload必须有精确运行时shape验证。
2. 所有领域事件必须有回放验证。
3. 集成效果必须有原子批次语义。
4. append前必须进行prospective validation。
5. 玩家和AI投影读取已交付知识前必须重新验证stored fact。
6. 已交付知识是历史事实，不得用最新currentCharacterState重新计算。
7. 私有投影不得泄漏完整assignment、currentCharacterState、task plan、
   正确答案标记、impairment原因或Storyteller内部信息。
8. 内部planner、resolver、生成事件和prospective错误必须可重试，
   不得烧毁commandId。
9. MetadataGenerationFailed必须独立分类。
10. actor、phase、version和task顺序等确定性错误可以保存rejected receipt。
11. 禁止localeCompare、Intl.Collator和环境locale排序。
12. 禁止使用Date.now、Math.random或随机UUID生成canonical ID。
13. 不得删除或弱化测试。
14. Ubuntu和Windows结果必须一致。
15. reviewer未PASS不得合并。

==================================================
三、当前先修PR #15
==================================================

implementer必须在PR #15原分支中完成：

新增并使用：

validateStoredDreamerInformationDelivered(...)

必须验证：

- DreamerInformationDelivered为非null plain object；
- payload精确shape；
- knowledgeModelVersion；
- knowledgeStage；
- falseRolePolicyVersion；
- informationReliability精确判别联合；
- goodRole为GOOD且绑定roleCatalogSnapshot；
- evilRole为EVIL且绑定roleCatalogSnapshot；
- matching DREAMER_ACTION task；
- matching ScheduledTaskSettled；
- 正确taskId、taskType、outcome和revision；
- 拒绝correctRoleId；
- 拒绝targetTrueRole；
- 拒绝targetAlignment；
- 拒绝storytellerNotes；
- 拒绝所有额外字段。

stored validation不得使用最新：

- currentCharacterState
- abilityImpairments

重新计算历史Dreamer信息。

修改投影，使其展示Dreamer信息前调用stored validation。

保留：

- effective GOOD target路径；
- effective EVIL target路径；
- source-impaired路径；
- 私有投影隐藏reliability、sourceImpairment和正确答案。

运行：

pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage

推送到PR #15原分支。

==================================================
四、自动审查—修复—合并循环
==================================================

每次implementer推送后：

1. 等待GitHub CI结束。
2. reviewer读取完整PR diff、生产代码、测试、架构文件和相关规则。
3. reviewer只能返回：
   - PASS
   - FIX_REQUIRED
   - HUMAN_BLOCKED
4. FIX_REQUIRED时：
   - 将全部BLOCKER一次性交给implementer；
   - implementer在同一分支修复；
   - 重新运行全部质量门禁；
   - 推送并再次审查。
5. 每个PR最多修复3轮。

只有以下条件全部成立才允许自动合并：

- reviewer = PASS；
- Ubuntu CI成功；
- Windows CI成功；
- typecheck成功；
- lint成功；
- test成功；
- coverage成功；
- PR HEAD与reviewer审查的HEAD相同；
- 工作区clean；
- 没有BLOCKER。

满足后：

- 使用merge commit合并；
- 删除远程功能分支；
- 拉取main；
- 创建对应accepted tag；
- 推送tag；
- 更新AUTOPILOT_STATE.json；
- 追加AUTOPILOT_LOG.md。

==================================================
规则真值门禁：任何Slice实现前强制执行
==================================================

你不得只根据现有代码、测试、README或模型记忆设计下一Slice。

创建第四个只读子代理：

rule-researcher

职责：

- 只研究BOTC规则；
- 不修改生产代码；
- 不设计实现架构；
- 不信任现有测试是规则真值；
- 每个Slice重新核对相关外部来源。

必查来源：

1. 用户批准规则：
   docs/rules/USER_OVERRIDES.md

2. 用户指定中文Wiki：
   https://clocktower-wiki.gstonegames.com/index.php?title=首页

3. 官方BOTC Wiki：
   https://wiki.bloodontheclocktower.com/

4. 官方夜间顺序：
   https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json

来源规则：

- 用户明确批准的规则修正优先；
- 官方规则负责精确能力语义和夜间顺序；
- 中文Wiki负责中文术语、本地化说明和项目原始需求；
- 代码、测试、README和模型记忆不得覆盖外部规则；
- 外部来源之间出现实质冲突时，立即HUMAN_BLOCKED；
- 不得自行猜测或选择一个有争议的解释。

每个新Slice必须先生成：

docs/rules/evidence/<slice-id>.md

文件必须包含：

- sliceId
- involvedRoles
- sourceUrls
- retrievalDate
- sourceRevision或oldid
- abilityRules
- firstNightOrder
- otherNightOrder
- interactions
- drunkennessRules
- poisoningRules
- VortoxRules
- characterChangeRules
- alignmentChangeRules
- storytellerDiscretion
- explicitOutOfScope
- unresolvedConflicts
- requiredRegressionTests
- ruleCoverageStatus

ruleCoverageStatus只能是：

- SKELETON
- PARTIAL
- COMPLETE

除非该角色的所有正式机制和当前已支持交互都已经实现，
不得标记COMPLETE。

例如Dreamer在以下内容未实现时只能是PARTIAL：

- Vortox强制虚假；
- Storyteller假角色选择；
- Traveller目标限制；
- 完整醉酒/中毒信息求值。

规则研究完成后，rule-researcher返回：

- RULE_READY
- RULE_CONFLICT
- RULE_SOURCE_UNAVAILABLE

只有RULE_READY时，architect才可以设计Slice。

如果实时网站不可访问：

- 有已批准相关快照时可以使用快照；
- 必须记录snapshot路径与hash；
- 没有已批准快照时返回RULE_SOURCE_UNAVAILABLE；
- 不得根据模型记忆继续。

==================================================
规则设计审查
==================================================

architect完成Slice设计后，reviewer必须在实现前进行规则设计审查。

reviewer必须独立读取：

- 外部来源或已批准快照；
- 当前rule evidence；
- 官方夜间顺序；
- 当前角色覆盖矩阵。

reviewer不得只信任rule-researcher摘要。

设计审查只能返回：

- RULE_DESIGN_PASS
- RULE_DESIGN_FIX_REQUIRED
- HUMAN_BLOCKED

没有RULE_DESIGN_PASS不得开始实现。

==================================================
PR规则一致性审查
==================================================

每个PR正文必须包含：

Rule Evidence
Rule Claims Implemented
Explicitly Unsupported Rules
Rule Source Revisions
Rule-to-Test Traceability

reviewer审查PR时必须确认：

1. 每个领域行为能追溯到rule claim；
2. 每个rule claim有对应测试；
3. 未实现规则明确标为SKELETON或PARTIAL；
4. 代码没有把未实现机制伪装为完整实现；
5. 夜间顺序与官方nightsheet一致；
6. 角色变化后使用正确的历史或当前状态；
7. 醉酒、中毒、涡流和说书人裁量没有被错误简化；
8. 规则来源版本已记录；
9. 测试全绿不能替代规则验证。

最终审查必须同时返回：

- CODE_REVIEW_PASS
- RULE_REVIEW_PASS

两者缺一不得合并。

==================================================
角色覆盖矩阵
==================================================

维护：

docs/rules/ROLE_COVERAGE_MATRIX.md

每个角色至少记录：

- base ability
- first-night behavior
- other-night behavior
- drunk behavior
- poisoned behavior
- Vortox interaction
- Philosopher interaction
- character-change interaction
- alignment-change interaction
- death interaction
- Storyteller discretion
- projection behavior
- status：NOT_STARTED / SKELETON / PARTIAL / COMPLETE

每次合并必须更新覆盖矩阵。

不得仅因为一个角色的一个路径已经运行，
就将该角色标记COMPLETE。

==================================================
五、自动设计和实现下一Slice
==================================================

每次PR成功合并后：

1. architect读取最新main、规则、架构、测试和状态。
2. architect只设计一个范围明确的下一Slice。
3. reviewer先审查Slice设计。
4. 设计PASS后，implementer：
   - 创建新分支；
   - 实现；
   - 测试；
   - 提交；
   - 推送；
   - 创建新PR。
5. 自动进入审查—修复—合并循环。

不得同时开发多个Slice。

==================================================
六、自动停止条件
==================================================

本轮最多自动完成3个Slice。

遇到以下情况停止并标记HUMAN_BLOCKED：

- 同一PR修复3轮仍未PASS；
- 同一CI错误连续出现2次；
- BOTC规则存在实质冲突；
- 需要重写已经接受的事件历史；
- GitHub权限或凭据失败；
- 无法安全解决merge conflict；
- 只能通过删除或弱化测试才能继续；
- reviewer与architect对核心语义结论冲突；
- 需要访问仓库外文件；
- 需要账户、付费或安全权限决定。

普通实现、测试、审查、修复、推送和满足门禁后的合并，不要等待用户确认。

==================================================
七、防止重复运行
==================================================

AUTOPILOT_STATE.json必须记录：

- status：IDLE | RUNNING | WAITING_CI | HUMAN_BLOCKED | COMPLETED
- currentPR
- currentBranch
- reviewedHead
- repairRound
- completedSlices
- lastAction
- lastError

每次启动先读取状态。

如果status为RUNNING或WAITING_CI且已有活动任务，不得重复启动第二套实现。

==================================================
八、创建定时继续任务
==================================================

为当前对话和当前本地项目创建一个每15分钟运行一次的Scheduled Task。

定时任务提示词为：

“继续当前BOTC Autopilot Goal。
先读取docs/agent-loop/AUTOPILOT_STATE.json和GitHub状态。
如果已有运行中的实现、审查或CI，不重复启动。
否则从上次中断位置继续审查、修复、合并或下一Slice。
遵守AGENTS.md和REVIEW_PROTOCOL.md。
完成3个Slice或命中HUMAN_BLOCKED后暂停本定时任务。”

定时任务必须返回当前这一个对话，不得创建新的独立对话。

==================================================
九、现在开始
==================================================

直接执行，不要只输出计划。

先初始化代理和状态文件，然后修复PR #15，等待CI并启动内部reviewer循环。
除停止条件外，不要要求我继续发送提示词。
