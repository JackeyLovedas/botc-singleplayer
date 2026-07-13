reviewedScope: `Phase 3 Slice 2B18A Ledger-Only Rescope`

reviewedScopeDocument: `docs/implementation/phase-3-slice-2b18a-ledger-only-rescope.md`

reviewedScopeSha256: `eeb880140342ff8938e980e6ca095657c1d8f788fab408896d9f69c0fe27d75f`

reviewedBaseMain: `89143b56ba7cb2e8c6aa6a2ce97c7a5dbe82794f`

reviewedPR: `#23`

reviewedPRHead: `3e822ee004b5dc32dc6fe49383169b45805d03ea`

reviewMode: `independent read-only`

sources:

- 用户授权附件 `f7e31e05-6b73-47df-94f0-e5d4faf93d9c/pasted-text.txt`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B18-resolved.md`
- `docs/implementation/phase-3-slice-2b18a-design-round-3-2.md`
- 三份2B18A最终审查报告
- PR #23完整变更及当前实现
- base main生产合同与测试
- 当前Autopilot状态、CURRENT_TASK、PROJECT_STATE及REVIEW_PROTOCOL

productionFilesReviewed:

- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/application/src/game-application-service.ts`

testFilesReviewed:

- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- base main对应测试集合

findings:

1. `PASS`：这是实现范围收缩，不是BOTC规则变更。四项数学家override未修改，resolved evidence仍为`RULE_READY / PARTIAL`。
2. `PASS`：Design 3.2的`NORMAL / ABNORMAL / UNRESOLVED / PENDING_TRIGGER`分类以及Witch、Dreamer/Vortox、Snake Charmer、Clockmaker、Seamstress、Cerenovus、Philosopher和Evil Twin行为均被冻结保留。
3. `PASS`：文档保留canonical replay-derived ledger、terminal pre-state派生、exact fact equality、anchor/roster绑定、base/V1/V2 provenance hardening、角色cross-link、shape-not-provenance边界、确定性重放和projection non-leakage。
4. `PASS`：`MATHEMATICIAN_INFORMATION`仍要求`ApplicationNotConfigured`、`retryable=true`、无receipt、无event、无settlement、无game-version increment。
5. `PASS`：2B18B和2B19均未开始；数字求值、Vortox最终数字、私有交付和settlement均明确推迟。
6. `PASS`：拟删除的resolver、count-result、internal context、runtime override carrier和两个专用错误码均不存在于base main生产代码，属于PR #23尚未验收的新增实现。
7. `PASS`：base main没有测试被当前PR删除；范围文档仅允许删除PR #23新增且只验证取消合同的测试，并要求替换为范围边界测试。
8. `PASS`：PR #23仍开放、非draft、未合并，base仍为指定main；可在同一功能分支和同一PR原地缩减，无需回到main、创建新分支或新PR。
9. `BLOCKER`：删除清单没有完整移除count-result window snapshot合同。范围文档第5节仍公开保留`FirstNightAbilityOutcomeWindowSnapshot`、`validateFirstNightAbilityOutcomeWindowSnapshotShape`和相应clone helper。当前实现证明该snapshot的`endEventSequence/endBoundary`仅被`InternalResolvingMathematicianContext`、`CountCommon`和count-result validator使用，不参与ledger anchor或fact派生。用户授权只允许公开window anchor，并要求public resolver/result/context/override runtime carrier整体推迟至2B18B。因此这些snapshot合同必须加入第4节删除清单，并从第5节保留合同中移除；内部的snapshot keys、validator和clone也应随resolver-only代码删除。
10. `BLOCKER`：`docs/agent-loop/CURRENT_TASK.md:55`仍声明2B18A包含pure true-count resolver，`:84`仍要求实现internal context、window/count invariants。它是项目的当前任务权威，与新授权及ledger-only范围直接冲突。必须在生产实现授权前改为ledger-only边界，明确resolver、count result、resolving context及其snapshot整体推迟至2B18B。

remainingBlockers:

- 从2B18A保留公共合同中移除`FirstNightAbilityOutcomeWindowSnapshot`及其validator/clone，并将其明确列入resolver/result系列删除项。
- 清除`CURRENT_TASK.md`中仍授权pure true-count resolver和window/count/context实现的冲突指令。

implementationAuthorized: `false`

SCOPE_REVIEW_FIX_REQUIRED
