reviewedHead: `1d51e5e99e8bde5b4d34addfee511d466dd03954`

reviewTimestamp: `2026-07-25T08:15:43.8305186Z`

reviewScope:

- 独立只读审查 corrected design：
  `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design.md`
- corrected design SHA-256：
  `34622f6d4cec94289bf8cebb3ededd1023ae82ed05638c2aae1def50f6fe7b3e`
- 原设计审查 SHA-256：
  `332dcf4150441b93daedac3e1ab4802c6b5901ece6b0ef0636868f47a10848a2`
- 审查差异：
  `38f52cfa7c712a6c7dc7e140c3db776281d7896e..1d51e5e99e8bde5b4d34addfee511d466dd03954`
- 分支：
  `phase-3/reachable-base-dreamer-settleability-closure`
- worktree：`clean`
- PR #46：`OPEN / MERGEABLE`
- PR远程HEAD：
  `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`
- 本审查没有编辑、提交、push或修改PR。

filesReviewed:

- `AGENTS.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design.md`
- `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design-review.md`
- `docs/implementation/phase-3-slice-2b20a-product-repair-round-1-implementation-review.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/ids.ts`
- `packages/domain-core/src/setup-types.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/application/src/game-application-service.test.ts`

sourcesReviewed:

- `docs/rules/USER_OVERRIDES.md`
- 中国Wiki：首页 oldid `5855`
- 中国Wiki：筑梦师 oldid `3046`
- 中国Wiki：哲学家 oldid `5125`
- 中国Wiki：醉酒 oldid `5720`
- 中国Wiki：中毒 oldid `6294`
- 中国Wiki：数学家 oldid `6442`
- 中国Wiki：涡流 oldid `6198`
- Official Dreamer oldid `2904`
- Official Philosopher oldid `2421`
- Official States oldid `1039`
- Official Rules Explanation oldid `1310`
- Official Glossary oldid `2874`
- Official Mathematician oldid `3109`
- Official Vortox oldid `3017`
- Official nightsheet commit
  `915347e627c3f6cd1f438f82b6001784e11b3e8b`

sourceVerification:

- 所有固定外部来源均可访问。
- 所有固定来源的实时字节 SHA-256 均与
  `docs/rules/evidence/2B20A-resolved.md` 完全一致。
- nightsheet SHA-256：
  `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- 独立计算首夜位置：
  - Philosopher：`14`
  - Dreamer：`61`
  - Mathematician：`77`
- 未发现本修复范围内的规则冲突。
- Dreamer覆盖状态仍为 `PARTIAL`。

correctedFindingClosureAudit:

- `C34_ROUND_2_ALREADY_VALID_INVENTORY_IS_FALSE`：
  corrected design 已将 sparse impairment 从有效T2库存移除，并明确归入
  `R3 / T1 / STRUCTURAL_VALIDATION` supporting/regression evidence。该部分已关闭。
- `C34_ROUND_2_MATRIX_MIXES_T1_STRUCTURAL_CASES_INTO_T2_POLICY_AUTHORITY`：
  M01–M05及原M07已从C34 primary required list移除，分类说明正确；但新M06仍然是T1无效输入，因此该finding尚未完全关闭。

findings:

- findingId: `C34_ROUND_2_M06_IS_STILL_T1_INVALID_OPPORTUNITY_PROVENANCE`
  - severity: `P1`
  - classification: `DESIGN_BLOCKER`
  - affected blocker:
    `C34_ROUND_2_MATRIX_MIXES_T1_STRUCTURAL_CASES_INTO_T2_POLICY_AUTHORITY`
  - file/section:
    - `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design.md`
      的 `C34-R2-M06`
    - `packages/domain-core/src/first-night-action-opportunity.ts`
      的 `hasExactBaseDreamerV2SourceContractShape`、
      Dreamer V3 opportunity validation
    - `packages/domain-core/src/dreamer.ts`
      的 `resolveBaseDreamerV2NormalCapability`
  - evidence:
    - M06把
      `sourceContract.sourceAbilityInstanceId`
      改为从
      `first-night-v1:DREAMER_ACTION:seat-12`
      生成的BASE ability ID，但保留seat-01的：
      `opportunity.taskId`、`sourceSeatNumber`、task、source与tenure。
    - `isDreamerActionOpportunityV3`在resolver进入T2策略检查前即要求：
      - parsed ability taskId等于opportunity taskId；
      - embedded seat等于source seat；
      - sourceAbilityInstanceId等于
        `formatBaseFirstNightAbilityInstanceId(opportunity.taskId)`。
    - 因此该M06 opportunity本身无法通过现有T1 canonical opportunity验证。
      把同一无效clone同时放入直接参数和opportunity state不会使其成为canonical。
    - resolver确实会返回
      `EFFECTIVENESS_UNRESOLVED / SOURCE_PROVENANCE_INVALID`，
      但失败发生于T1 opportunity/provenance admission gate，而不是设计宣称的
      `R1 / T2 / PURE_POLICY_SEAM` source-ability semantic policy seam。
  - failureScenario:
    - implementer按当前设计新增M06后，测试会得到预期kind/reason并变绿，但C34仍会把一个未通过canonical opportunity admission的R3/T1对象声明成T2 primary evidence。
    - 这会再次产生“测试通过但冻结T2矩阵未真正闭合”的虚假完成声明。
  - requiredCorrection:
    - 执行允许的 bounded Design Correction V2。
    - 删除当前M06构造及其
      `ROUND_2_M06_REQUIRED`
      T2声明。
    - 重新审计第9行“unprovable source ability/provenance”。
    - replacement必须让opportunity、source contract、ability ID、required fields、版本和ID grammar全部独立通过现有canonical T1验证，再只破坏一个T2历史/状态关系。
    - 一个可审查方向是保持原canonical ability ID和完整canonical opportunity不变，仅使用结构合法的canonical plan/state关系，使该ability identity无法由计划或历史证明；设计必须明确证明该fixture仍通过
      `isDreamerActionOpportunityV3`，且失败不是missing field、invalid ID、invalid version、cast或其他T1结构问题。
    - 如果无法构造这样的合法T2 fixture，则必须把第9行标为
      `EVIDENCE_GAP`，并按现有授权停止于
      `C34_VALID_T2_EVIDENCE_GAP_REQUIRES_SCOPE_REVIEW`。
    - 不得通过修改resolver、第二生产文件、schema、POISONED、No Dashii、gained行为、ownership或CI关闭该缺口。
  - requiredRegressionTests:
    - corrected M06必须先证明完整opportunity及source contract通过现有canonical validator。
    - 必须使用当前正式类型和canonical ID formatter。
    - 必须精确断言：
      `EFFECTIVENESS_UNRESOLVED / SOURCE_PROVENANCE_INVALID`。
    - 必须证明只改变一个T2 plan/history/state semantic relation。
    - M08保持为独立的state/catalog semantic mismatch case。

c34FrozenRequirementMappingAudit:

1. canonical DRUNK + Fang Gu：
   `EXISTING_VALID_T2_EVIDENCE`
2. legal POISONED：
   `EXISTING_VALID_T2_EVIDENCE`
3. duplicate impairment：
   `EXISTING_VALID_T2_EVIDENCE`
4. conflicting impairment：
   `EXISTING_VALID_T2_EVIDENCE`
5. stale revision/provenance：
   `EXISTING_VALID_T2_EVIDENCE`
6. No Dashii：
   `EXISTING_VALID_T2_EVIDENCE`
7. effective Vortox：
   `EXISTING_VALID_T2_EVIDENCE`
8. another current Demon：
   `EXISTING_VALID_T2_EVIDENCE`
9. unprovable source ability/provenance：
   `EVIDENCE_GAP`；当前M06不是合法T2 primary evidence
10. state/catalog semantic mismatch：
    `ROUND_2_M08_REQUIRED`；设计构造有效
11. normal base control：
    `VALID_CONTROL_NOT_PRIMARY`
12. gained unchanged control：
    `VALID_CONTROL_NOT_PRIMARY`

f01Audit:

- F01合同保持不变且设计有效。
- 只要求numeric element descriptor的
  `enumerable === true`。
- 没有错误要求array `length`可枚举。
- 没有新增writable/configurable限制。
- C20 direct/public/stored、getter count `0`和合法控制要求完整。
- 无需第二生产文件、schema或行为设计变更。

m08Audit:

- `{ outsiderDelta: 1, townsfolkDelta: -1 }`是整数、总数保持且post-count合法的Demon setup modifier。
- 修改后的Fang Gu state snapshot与catalog snapshot分别满足
  `RoleSetupSnapshot`正式结构和领域约束。
- 两者仅在setupModifier语义关系上不一致。
- 现有resolver会精确返回：
  `EFFECTIVENESS_UNRESOLVED / CURRENT_DEMON_CATALOG_MISMATCH`。
- M08是有效T2 semantic state/catalog case。

allowlistAudit:

- production allowlist仅：
  `packages/domain-core/src/dreamer.ts`
- test allowlist仅：
  `packages/domain-core/src/dreamer.test.ts`
- resolver明确禁止修改。
- application test、C37、Mathematician、ledger、schema、rule evidence、role matrix、ownership、routing、workflow与CI均保持只读。
- allowlist本身可信。

authorizationAndStopLossAudit:

- corrected design完整记录：
  `productRepairRoundBefore=1/2`
- design correction和design review不消耗repair round。
- 首次产品/正式测试变更才消耗最终
  `2/2`。
- 只有独立
  `RULE_DESIGN_PASS`
  且
  `remainingDesignBlockers=[]`
  才自动授权实施。
- Round 2 implementation review若仍有产品或正式测试blocker，必须
  `HUMAN_BLOCKED / PRODUCT_REPAIR_STOP_LOSS_REACHED`。
- 不允许Round 3。
- 下游ownership/Linux/Windows blockers未被错误用于本设计判定。

behaviorDesignChanged: `false`

ruleSemanticsChanged: `false`

eventSchemaChanged: `false`

resolverChangeRequired: `false`

EVIDENCE_GAP: `true — frozen requirement #9`

designVerdict: `RULE_DESIGN_FIX_REQUIRED`

remainingDesignBlockers:

- `C34_ROUND_2_MATRIX_MIXES_T1_STRUCTURAL_CASES_INTO_T2_POLICY_AUTHORITY`
- `C34_VALID_T2_EVIDENCE_GAP_FOR_UNPROVABLE_SOURCE_ABILITY_PROVENANCE`

boundedDesignCorrectionV2Allowed: `true`

downstreamPRBlockersExcludedFromDesignVerdict:

- `OWNERSHIP_SUPERSESSION_AND_ROUTING_REQUIRED`
- `LINUX_WORKER_RPC_CI_BLOCKER`
- `WINDOWS_W7_UNKNOWN_EXIT_BLOCKER`
