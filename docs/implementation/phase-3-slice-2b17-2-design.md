# Phase 3 Slice 2B17.2 — Philosopher-Gained First-Night Task Scheduling V2

依据：`docs/rules/evidence/2B17-2.md`（`RULE_READY`）及 override `BOTC-SIM-PHILOSOPHER-FIRST-NIGHT-SCHEDULING-V1`。本设计仅修复调度，不授权实现 2B18。

## rootCause
V1 `FirstNightTaskInserted`把gained task固定为`first-night-v1:PHILOSOPHER_GAINED:<TASK_TYPE>:seat-<NN>:from-<roleId>`与`orderKey={baseOrder:100,insertionOrder:1}`。现有 comparator 按`baseOrder -> insertionOrder -> compareStableId(taskId)`排序，故越过MINION_INFO/DEMON_INFO。不得修改 comparator 或 next-task函数重解释accepted V1。

## officialTimingRule
Philosopher获得夜间能力后在该角色通常位置行动；首夜专属能力当夜使用。catalog顺序：PHILOSOPHER、MINION_INFO、DEMON_INFO、SNAKE_CHARMER、EVIL_TWIN、WITCH、CERENOVUS、CLOCKMAKER、DREAMER、SEAMSTRESS、MATHEMATICIAN。官方未定义同位置内部顺序。

## userApprovedSimulationTieBreak
同位置base先、gained后；多个gained按sourceSeatNumber升序，再按taskId显式UTF-16 code-unit升序。不得依赖locale或迭代顺序；不解释Mathematician冲突。

## legacyV1Contract
`eventType=FirstNightTaskInserted`、`taskPlanVersion=first-night-task-plan-v1`、V1 ID、`{100,1}`、exact payload、旧顺序/batch/replay/provenance与未转换fixture逐值不变，标记`LEGACY_ACCEPTED_HISTORY`；新command不生成V1。

## newV2Contract
选择方案A新增`FirstNightTaskInsertedV2`，避免扩大V1接受面。exact payload必含：rulesBaselineVersion；nightNumber=1；schedulingVersion=`philosopher-gained-first-night-scheduling-v2`；taskPlanVersion=`first-night-task-plan-v2`；taskCatalogVersion/signatureAlgorithm/signature；taskId/taskType/taskClass；targetRoleId；targetCatalogBaseOrder；effectiveBaseOrder；tieBreakPolicy=`BASE_THEN_GAINED_BY_SOURCE_SEAT_THEN_TASK_ID_CODE_UNIT`；tieBreakSourceSeatNumber；sourcePlayerId/sourceSeatNumber/sourceRole/chosenRole；philosopherOpportunityId；grantId；sourceCharacterStateRevision；status=PENDING；settlementPolicy；insertionReason=PHILOSOPHER_GAINED_ABILITY。source/chosen/grant/opportunity/revision须一致；sourceSeat=tieBreakSeat；role/task/class/order/policy须匹配plan签名catalog。

## eventVersioning
Envelope eventVersion=1不变，以新event type区分。events/applier/batch/type map新增V2；rebuild算法不变。Choice/Granted/Impairment/Settlement及角色结果shape不变。

## taskIdVersioning
V2 ID：`first-night-v2:PHILOSOPHER_GAINED:<TASK_TYPE>:seat-<NN>:from-<roleId>`。V1/V2 formatter分离；seat 01..12；基础task/grant/action-opportunity ID不改；禁止时间/随机/UUID/locale。

## taskPlanVersionCompatibility
新增LEGACY=`first-night-task-plan-v1`、CURRENT=`first-night-task-plan-v2`；保留V1常量alias，新planner只产V2。FirstNightTaskPlanCreated key set不变、按字面量判别。V1只接受V1 insertion，V2只接受V2。V1 active plan的mapped choice返回ApplicationNotConfigured/first-night-role-action，零事件/receipt/version；DEFER及无mapping不受影响。

## catalogOrderResolution
生产只保留role→taskType mapping；baseOrder/class/policy从game已验证taskCatalogSnapshot解析，V2 event记录catalog元数据。Snake在DEMON_INFO后/EVIL_TWIN前；Clockmaker在CERENOVUS后/Dreamer前；Dreamer在Clockmaker后/Seamstress前；Seamstress在Dreamer后/Mathematician前；Mathematician在Seamstress后/catalog最后。

## samePositionOrdering
保留 comparator。V2 runtime orderKey：baseOrder=effectiveBaseOrder，insertionOrder=tieBreakSourceSeatNumber。

## baseBeforeGainedPolicy
Base同baseOrder且insertionOrder=0；gained为1..12，故base严格先。

## multipleGainedOrdering
允许多个同代且唯一task/grant/opportunity的V2 facts；按seat再taskId code-unit。重复规范task ID拒绝；可达性不替代合同测试。

## mixedVersionRejection
V1 plan+V2 event、V2 plan+V1 event、state/batch混代、event/ID前缀不符、错误schedulingVersion、runtime/fact代际不符均fail closed，不转换/忽略。

## commandsAffected
PlanFirstNightTasks shape不变只产V2。SubmitPhilosopherAction保持choice/grant/可选DRUNK/V2 insertion/settlement且不产V1。现有Snake/Clockmaker/Seamstress入口接受精确V2 provenance但结果不变；gained Dreamer仍unsupported；Mathematician到位fail closed。

## eventsAffected
新增FirstNightTaskInsertedV2；FirstNightTaskPlanCreated只扩展planVersion字面量。其他事件字段不变；Clockmaker仅加V1/V2 provenance分支。

## eventBatchChanges
V2 batch：Chosen, Granted, [Impairment], [InsertedV2], Settled；旧replay仍允许InsertedV1。3–5事件，impairment先于insertion，一次choice最多一个insertion，metadata共享、sequence连续，只settle Philosopher。

## replayCompatibility
V1原样replay。V2需V2 plan及matching choice/grant/catalog/provenance，applier派生exact task。不得按当前catalog重算、迁移snapshot/event。

## prospectiveValidation
提交前完整batch semantics+逐事件apply；插入后验证plan、fact/task一对一、顺序和next。错误零append/receipt/version且可重试。

## runtimeShapeValidation
拒绝extra/missing/accessor/symbol/non-enumerable、class/Proxy、稀疏数组、非法seat/order/revision、非canonical snapshot、错误ID/catalog/role/task/grant/opportunity/tie-break。复用exact-key/plain-record/dense-array/canonical-data/catalog signature/compareStableId；禁raw JSON.stringify语义比较和Array.every稀疏检测。

## storedStateValidation
Insertion state为V1/V2 exact union。V1仍最多一个且{100,1}。V2允许多个同代，每fact与runtime task一对一并绑定grant/catalog；tasks严格排序；base source-facts验证不变；settlements仍为prefix；Clockmaker/projection分别验证V1/V2。

## failureBoundary
确定性错误保留stored rejection；V1 mapped choice为ApplicationNotConfigured；planner/catalog走planning边界；V2构造/prospective异常为DependencyExecutionFailed；metadata/append分别保持MetadataGenerationFailed/EventStoreAppendFailed；retryable失败不烧ID或task。

## privateProjectionBoundary
不新增player/AI/public字段，不泄漏event、plan/catalog、signature、order/tie-break、source-seat、grant/task internals；既有私有信息与历史验证不变。

## migrationBoundary
不迁移event stream/snapshot/active V1，不改next-task隐藏升级，不批量改fixture，不改2B18.md。

## testPlan
1 schedulingVersion；2 planner V2；3 V1 fixture；4 V2 ID；5 ID不冲突；6 exact keys；7 extra拒绝；8 missing拒绝；9 prefix拒绝；10 seat拒绝；11 embedded seat mismatch；12 role/task mismatch；13 source role；14 tieBreak seat；15 revision；16 catalog version；17 signature algorithm；18 signature；19 definition缺失；20 definition kind；21 role binding；22 catalog order；23 effective order；24 class；25 policy；26 missing grant；27 duplicate grant；28 grantId；29 opportunity；30 source player；31 source role；32 chosen snapshot；33 duplicate task ID；34 V1 stream replay；35 V1 exact shape；36 V1 ID；37 V1 old order；38 V1 Clockmaker；39 V2 replay；40 V1 plan+V2；41 V2 plan+V1；42 mixed state；43 mixed batch；44 ID/event generation；45 duplicate V2；46 naked insertion；47 reversed batch；48 prospective/replay；49 Snake after DEMON；50 Snake before Twin；51 Clockmaker after Cerenovus；52 Clockmaker before Dreamer；53 Dreamer after Clockmaker；54 Dreamer before Seamstress；55 Seamstress after Dreamer；56 Seamstress before Math；57 Math after Seamstress；58 Math last；59 five choices next MINION；60 MINION then DEMON；61 base first；62 gained by seat；63 same seat taskId；64 reversed input deterministic；65 dual-platform；66 DEFER；67 no mapping；68 new command only V2；69 only Philosopher settled；70 gained pending；71 Snake next at position；72 Clockmaker next；73 Seamstress progression；74 V1 active fail closed；75 receipt idempotency；76 changed fingerprint；77 atomic batch；78 metadata failure；79 Snake no-swap；80 Snake demon-hit；81 Clockmaker regression；82 Dreamer unsupported；83 Seamstress regression；84 Mathematician fail closed；85 no Math event；86 no ledger；87 base regressions；88 player no leak；89 AI no leak；90 hostile stored fail closed；91 typecheck；92 lint；93 test；94 coverage；95 diff check；96 forbidden scan；97 Ubuntu；98 Windows；99 four2B18 conflicts retained；100 no test weakening。

## explicitOutOfScope
Mathematician window/false domain/duplicates/own exclusion/information/ledger及全部2B18代码；other-night/dawn/通用生命周期/poison/registration/death/UI/AI/Electron/SQLite/2B19；任何能力结果语义修改。

## completionCriteria
独立RULE_DESIGN_PASS；V1不变；新planner/command只V2；V2字段/ID/catalog绑定；五角色位置/tie-break直接测试；系统信息不被跨越；混代拒绝；不重解释历史；角色能力/投影不变；Math只调度fail closed；原子/幂等/failure保持；全门禁双平台CI；coverage不COMPLETE；不恢复2B18/2B19。

## designReadiness
`READY_FOR_RULE_DESIGN_REVIEW`（不授权实现）。

## knownRisks
V1/V2 union触及多validator；Clockmaker硬编码V1需保留并加精确V2；gained action-opportunity ID的独立V1前缀不应误作task ID；多gained主要是合同测试；Dreamer/Mathematician不得因调度正确被误报实现。
