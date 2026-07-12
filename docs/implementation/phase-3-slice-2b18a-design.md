# Phase 3 Slice 2B18A Design — First-Night Ability Outcome Ledger Foundation

## ruleOverrides
权威证据`docs/rules/evidence/2B18-resolved.md` hash `7df3eb026e3db36ff7e29610207749d613646caaa2470c69fbe9afb2edc4811e`，`RULE_READY`。四个override仅为固定12人模拟策略：FIRST-NIGHT-WINDOW-V1、OWN-ABILITY-EXCLUSION-V1、NUMERIC-DOMAIN-V1、DUPLICATE-HOLDER-TEMPORAL-V1。resolver exact input必须携带四个完整literal，错误版本为非法输入。

## resolvedConflictMapping
scheduling采用2B17.2 V2；window以FirstNightInitialized sequence exclusive起，resolution前最后sequence inclusive止；own ability仅相同player+instance；numeric 0..11；duplicate base先、gained按seat/taskId，later见earlier、earlier不见future且不重算。

## firstNightWindowModel
版本：ledger `first-night-ability-outcome-ledger-v1`，audit `first-night-ability-outcome-audit-v1`，window `first-night-ability-outcome-window-v1`。WindowAnchor exact字段：windowVersion,gameId,nightNumber=1,rulesBaselineVersion,firstNightInitializedEventId,startEventSequence,startBoundary=EXCLUSIVE；snapshot再加endEventSequence,endBoundary=INCLUSIVE。FirstNightInitialized应用时从完整envelope保存anchor；resolver只取start<source<=end，上界为resolution前state.lastEventSequence；无dawn/day/second-night。

## derivedLedgerArchitecture
新增`packages/domain-core/src/first-night-ability-outcome-ledger.ts`和GameState optional ledger。Ledger exact字段ledgerVersion,auditModelVersion,windowAnchor,facts。derived canonical state，不新增/修改event,payload,command,receipt,batch。applier先现有验证，再用pre-event state+完整envelope派生fact；rebuild确定性，后续状态不重算。
派生terminal events：PhilosopherActionDeferred/AbilityGranted；Snake NoSwap/Ineffective/DemonSwap；EvilTwinInformationDelivered；WitchDeathPendingMarked/IneffectiveResolved；CerenovusMadnessInstructionDelivered；Clockmaker/Dreamer/SeamstressInformationDelivered。setup/assignment/bootstrap/planning/insertion/opportunity/choice/impairment/system info/ScheduledTaskSettled/task存在/no-event均不产fact。

## auditFactIdentity
新增branded FirstNightAbilityOutcomeFactId=`first-night-ability-outcome-fact-v1:<sourceEventId>`，validator重算。AbilityInstance exact discriminated union：BASE_ROLE_TASK；PHILOSOPHER_GAINED_TASK_V1（opportunity+revision）；PHILOSOPHER_GAINED_TASK_V2（opportunity+grant+revision+schedulingVersion）；EXPLICIT_DOMAIN_INSTANCE（现有abilityInstanceId+roleTenureId）。生成instance ID分别为base-task:<taskId>、gained-v1:<taskId>:opportunity:<id>、gained-v2:<taskId>:grant:<id>。V1/V2与task/insertion/grant/player/seat/role/revision交叉验证；Seamstress/Cerenovus保留现有instance ID。
EvidenceReference exact union支持SOURCE_EVENT,TASK,ACTION_OPPORTUNITY,ABILITY_IMPAIRMENT,ROLE_TENURE,CHARACTER_STATE,PLAYER_ROLE_AT_REVISION,DOMAIN_RECORD；固定kind rank/code-unit排序。

## outcomeStatuses
Status=NORMAL|ABNORMAL|UNRESOLVED|PENDING_TRIGGER。Cause=NO_OTHER_CHARACTER_ABILITY|SOURCE_DRUNKENNESS|SOURCE_POISONING|VORTOX_FALSE_INFORMATION|DREAMER_VORTOX_CONSTRAINT_UNRECORDED|CAUSE_NOT_PROVEN。
Fact exact最低字段：auditFactId,auditModelVersion,windowVersion,sourcePlayerId/sourceSeatNumber,abilityRoleId/abilityTaskId,abilityInstance,sourceEventId/sourceBatchId/sourceEventSequence,evaluatedCharacterStateRevision,outcomeStatus,causeKind,causedByAnotherCharacterAbility,evidenceReferences,detectedAtEventSequence。detected==source sequence；ABNORMAL必须causedByAnother=true；UNRESOLVED/PENDING不得转NORMAL。

## perRoleAuditAdapters
Philosopher DEFER/grant NORMAL；duplicate DRUNK不改变其fact也不直接生成受影响玩家异常。Snake effective nonDemon no-swap NORMAL、effective Demon swap NORMAL、impaired nonDemon NORMAL、impaired Demon no-swap ABNORMAL、历史target不足UNRESOLVED；swap用payload before/after，其他在terminal时固化pre-event role。EvilTwin在完整pair+mutual delivery生成一个NORMAL，不伪造未支持事实。Witch有效pending marker NORMAL；Ineffective=PENDING_TRIGGER并保留cause，不预测日后触发。Cerenovus完整effective chain在instruction delivery NORMAL；impaired无event无fact。Clockmaker只读stored correct/selected/effectiveness/Vortox/revision：相等NORMAL；证明impairment/Vortox导致不等ABNORMAL；原因不证UNRESOLVED。Dreamer固化target历史角色：pair含truth且结构正确NORMAL；impaired且不含truth ABNORMAL；impaired仍正常则NORMAL；effective/ambiguous Vortox因payload不足UNRESOLVED。Seamstress只比stored correct与delivered：相等NORMAL含impaired；证明impairment/Vortox不等ABNORMAL；原因不证UNRESOLVED。Math无delivery fact。

## pendingTriggerBoundary
当前仅impaired Witch=PENDING_TRIGGER，保留ledger并列入ignoredPending，不计、不阻塞、不提前ABNORMAL；有效marker NORMAL。

## unresolvedBoundary
UNRESOLVED仅合法身份下证据不足且可能改变count；非法shape/identity/cross-link/duplicate/window直接DomainError。玩家已有qualifying ABNORMAL时，同玩家UNRESOLVED列redundantUnresolvedFacts而不阻塞。

## playerDeduplication
facts按incident，count按sourcePlayerId去重；players按roster seat再playerId code-unit。

## ownAbilityExclusion
仅`fact.sourcePlayerId===resolverSource && sameCanonicalDataValue(fact.abilityInstance,resolvingInstance)`排除；不得按roleId全局排除、不得排另一玩家earlier Math或当前玩家其他instance。

## duplicateHolderTemporalPolicy
sourceSequence>end列excludedFutureFacts；later可读earlier完成fact，earlier不读future，不重算；本Slicepure fixtures证明。

## pureCountResolver
返回RESOLVED或UNRESOLVED exact union。共同含windowSnapshot,evaluatedThrough,qualifyingAbnormalFacts,distinctAbnormalPlayerIds,excludedOwnAbilityFacts,excludedFutureFacts,ignoredNormalFacts,ignoredPendingFacts,redundantUnresolvedFacts。RESOLVED含trueCount；UNRESOLVED含unresolvedFactIds/Players/Reasons/Tasks/currentPartialCount且不得trueCount。
输入ledger,resolver source/exact instance,window,canonical12-player roster,rosterSize12,四override versions。只统计window内ABNORMAL&&causedByAnother，按player去重、自身instance排除。PENDING不计不阻塞；count-relevant unresolved返回UNRESOLVED。0..11，超过11抛canonical contradiction不截断。

## runtimeShapeValidation
实现fact/ledger/window/instance/evidence validate/clone/equality/append。所有入口isCanonicalDataValue，数组isDenseCanonicalArray，再plain record+exact keys；复用sameCanonicalDataValue/compareStableId。拒绝sparse,extra,symbol,getter,Proxy/revoked,cycle,非标准prototype,-0/非safe int。逐字段clone，无JSON roundtrip。

## canonicalComparison
facts按sourceEventSequence再auditFactId code-unit。同ID canonical equal幂等，不同内容抛DuplicateFirstNightAbilityOutcomeFactConflict。禁locale/Intl/raw JSON semantic/random/time UUID。

## replayDeterminism
只依赖envelope、accepted payload、该sequence pre-state与固定版本；同stream rebuild/Windows/Ubuntu canonical equal；key插入顺序无影响。

## stateRebuild
FirstNightInitialized创建空ledger+anchor；列出的terminal追加。accepted stream无需迁移event。缺完整初始化envelope的legacy snapshot无法补anchor，snapshot migration out-of-scope，post-init缺anchor fail closed。

## privateProjectionBoundary
不改PlayerPrivateKnowledgeView，不泄漏ledger/fact/cause/window/count/evidence到player/AI。用sentinel ledger直接验证；resolver不由projection调用。

## acceptedEventCompatibility
DomainEventPayloadByType/payload/event version/commands/IDs/batches/settlements/receipts/V1 replay/V2 scheduling全部不变；ledger非event。MATHEMATICIAN_INFORMATION继续ApplicationNotConfigured retryable、无receipt/event/settlement/version。

## failureBoundary
非法shape/anchor/roster/source-seat/task-instance/provenance/duplicate/sequence/>11抛DomainError；仅合法身份证据不足返回semantic UNRESOLVED；无terminal event无fact。

## testPlan
新增ledger test并扩展rebuild/application/projection/角色测试。映射68项：1-10 ledger determinism/ID/order/duplicate/exact/sparse/extra/hostile/leak；11-16 anchor/lower/upper/self future/setup/system；17-20 Philosopher；21-25 Snake；26-31 Twin/Witch/Cerenovus；32-36 Clockmaker；37-40 Dreamer；41-45 Seamstress；46-56 count/dedup/status/self/otherMath/time/0..11；57-60 Math failclosed/no delivery/unsettled/accepted payload；61-66角色全回归；67全门禁；68双平台CI。

## explicitOutOfScope
Math settlement/delivery/private number/candidate/Vortox output/resolved event；dawn/day/later-night；nomination/execution/death/Witch trigger/Cerenovus execution/Twin胜负；continuous poison/registration/Traveller/Pit-Hag/Barber/AI/UI/Electron/SQLite/phase/snapshot migration；2B18B/2B19。

## completionCriteria
RULE_READY+独立RULE_DESIGN_PASS；全部types/adapters/resolver/hostile/replay/leak tests；accepted payload/batch零变化；Math task仍fail closed且无数字；full+Windows/Ubuntu gates；coverage不高于PARTIAL；未开始2B18B/2B19。

## coverageStatus
`PARTIAL`。仅第一夜ledger与pure true-count基础，Math delivery/candidate/projection/settlement/later night和多交互仍缺，禁止COMPLETE。

READY_FOR_RULE_DESIGN_REVIEW
