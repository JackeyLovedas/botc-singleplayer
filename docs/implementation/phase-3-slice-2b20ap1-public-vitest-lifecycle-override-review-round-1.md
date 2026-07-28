reviewedHead: `99be3e69957bc4ca53b9cab9785b079be73fbf8d`

reviewTimestamp: `2026-07-26T11:34:14.0459835Z`

filesReviewed:

- `AGENTS.md`
- `project-handoff/00-README-FIRST.md`及其要求的规则、测试、架构和实现状态交接文件
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `docs/architecture/2B20AP1-go-no-go-under-governance-v1.md`
- `docs/implementation/phase-3-slice-2b20ap1-design-round-3.md`
- `docs/implementation/phase-3-slice-2b20ap1-design-review-round-3.md`
- 完整 LF amendment、Correction 1、Correction 2及三份独立审查链
- `docs/implementation/phase-3-slice-2b20ap1-public-vitest-lifecycle-override-v1.md`
- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `vitest.workspace.ts`
- 锁定的 `vitest@3.2.6` package exports、公开类型和实际 `collect`/`collectTests`/`close`实现

evidenceReviewed:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20A.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- 用户指定中文 Wiki
- 官方 Dreamer、Philosopher、Mathematician、Vortox Wiki修订
- 官方 nightsheet固定提交
- override SHA-256：`f944d431e9003a52eb4b0d1c8d5f5fcc20e820430d185f3649521e1605010d0b`
- governance SHA-256：`583f1778582c168935b380b19e453117b000d8caf18dd3a4cd7731365cdb3537`
- Round 3 SHA-256：`4f2fab7b877ca98e1fb46974661874353dd78a1c6b388cb91d3031c59608e003`
- LF Correction 2 SHA-256：`2b07ac52427a9bd95ee535e71de37d6d0a7c2eb662b28048115ce4377d09b10c`
- 最终 LF blocked review SHA-256：`df96cfa33fb2c23e570896ab3722d1ceece6f223568301a3459eac135960a1b9`

findings:

1. `LFC1-PUBLIC-CLOSE-FULFILLED-WITH-ERROR-DIAGNOSTIC`

   - severity: `BLOCKER`
   - file/symbol:
     - `phase-3-slice-2b20ap1-public-vitest-lifecycle-override-v1.md` §§4.2、4.6、4.8、self-test groups 2/6/7
     - `vitest/node`公开 `VitestOptions.stderr`
     - `Vitest.close(): Promise<void>`
   - failure scenario: override仅在 `await vitest.close()` reject时设置 `closeError`。锁定的 Vitest 3.2.6 对 project、pool及 `_onClose` rejection使用 `Promise.allSettled`，通过注入的公开 stderr记录 `error during close`，但 `close()` Promise仍可 fulfilled。此时当前伪代码会把close视为成功并发布candidate，尽管关闭阶段已经公开报告真实资源关闭失败。
   - actual risk: 资源可能未完全关闭；错误candidate可被发布。若此前已有primary failure，close错误也会丢失，违反“双错误均保留”合同。这属于用户允许升级的真实资源关闭和错误artifact风险，不是私有hook顺序或`closingPromise`证明问题。
   - required correction:
     - 明确定义close成功必须同时满足：公开 `close()` Promise fulfilled，且公开注入stderr在`CLOSING`阶段没有规范化的close-error记录。
     - 将锁定版本公开可观察的close-error诊断映射为`CLOSE_FAILED`，即使Promise fulfilled。
     - 保留primary和close诊断，禁止candidate发布并丢弃内存candidate bytes。
     - 不读取私有字段，不冻结plugin hook顺序。
   - required regression tests:
     - close reject：`CLOSE_FAILED`，无candidate。
     - close fulfilled但产生close-error诊断：`CLOSE_FAILED`，无candidate。
     - primary failure加fulfilled-with-close-error：两个诊断均保留。
     - close fulfilled且无close-error诊断：candidate才可发布。
     - 真实Vitest集成证明close阶段无close-error诊断且进程自然退出。
     - 可在既有十二个self-test group内扩展groups 2、6、7，无需增加第十三组。

designVerdict: `RULE_DESIGN_FIX_REQUIRED`

remainingBlockers:

- `LFC1-PUBLIC-CLOSE-FULFILLED-WITH-ERROR-DIAGNOSTIC`

createContract: `PASS` — rejected create无返回实例、无close义务、无candidate；未重新引入历史pre-return要求。

collectContract: `PASS` — 仓库wrapper入口最多一次；公开`collect`或`globTestSpecifications`加`collectTests`均可；内部glob次数不是验收权威。

closeContract: `FIX_REQUIRED` — exact-once调用和reject路径明确，但fulfilled-with-observable-close-error未被定义为失败。

candidatePublicationContract: `FIX_REQUIRED` — 原子发布合同充分，但其“close成功”前置条件因上述缺口可能被错误满足。

nonBlockerAudit:

- `LF3-DIAGNOSTIC_PHASE_PRECEDES_CREATEVITEST_RETURN`已正确由公共阶段诊断合同替换。
- `LF1-GLOB_INVOCATION_COUNT_CONTRADICTION`已正确降为非权威内部行为。
- `LF3-CREATEVITEST_PRE_RETURN_CLOSE_UNPROVABLE`已正确替换为returned-instance-only close义务。
- 未要求私有`closingPromise`、plugin hook顺序、`configureServer`关闭或create rejection后的伪close。
- 上述历史finding均未被重新包装为blocker。

LFCompatibility: `PASS_STATIC` — 1572/12、四元组、LF-safe encoding、candidate-v2、旧accepted hashes与dispositions均保持不变；本次按授权未运行candidate或集成测试。

topologyAudit: `PASS_STATIC` — ordinary 9、coverage 11、Windows W1–W7、C32 Static/Hosted拆分及37/37 ownership/SUP合同未被override改变。

allowlistAudit: `PASS` — override保留Round 3十一文件上限，禁止生产代码、workspace、依赖、timeout、profile、新project/process group及Linux/Windows修复。

implementationAuthorized: `false`

stopLossAudit:

- 当前public-lifecycle docs correction：`0/2`
- 本finding属于用户授权的公共生命周期范围，可使用Correction `1/2`
- Infrastructure Repair仍为`0/2`，本次不消耗
- 修正后必须由新的独立只读reviewer复审
- 未取得无blocker的通过结论前不得实现、运行candidate或进入Infrastructure Repair
