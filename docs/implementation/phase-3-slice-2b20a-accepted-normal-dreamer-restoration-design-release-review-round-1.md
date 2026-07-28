# Phase 3 Slice 2B20A — Accepted Normal Dreamer Restoration Design Release Review Round 1

- `archiveKind`: `COMPLETE_INDEPENDENT_REVIEWER_OUTPUT`
- `reviewedHead`: `9c3fae097484e04eb85bc3e6b12eddda39982826`
- `bodyHandling`: The content between the boundary markers is preserved verbatim.

<!-- REVIEWER_BODY_BEGIN -->
reviewedHead: `9c3fae097484e04eb85bc3e6b12eddda39982826`  
reviewTimestamp: `2026-07-28T07:03:55Z`  
reviewScope: Phase 3 Slice 2B20A Accepted Normal Dreamer Restoration V1 独立 Design Release Review  
worktree: clean  
filesModifiedByReviewer: none

审查权威：

- regression audit SHA-256：`06b441d15f28c5b22a0d4ed4e97d5e167d0cba929b98258aab89c4b6c2b36d19`
- restoration appendix SHA-256：`67c7dc990388345e3309efa984da02c68363869703f1ced039257095ec24ef23`
- 已独立核对 accepted main、当前 resolver、完整相关 diff、生产代码、测试、规则证据、用户 override、官方 Dreamer/Philosopher/Vortox 规则、中文 Wiki 固定版本、官方 nightsheet 固定提交及角色覆盖矩阵。
- 确认当前缺陷是真实 accepted-behavior regression：accepted main 对已经通过唯一 Demon 与 catalog exact-match 的健康非 No Dashii、非 Vortox 基础 Dreamer 返回 `NORMAL_INFORMATION_SUPPORTED`；当前代码错误地将非 Fang Gu 健康路径归类为 `CURRENT_DEMON_CATALOG_MISMATCH`。
- Dreamer 覆盖状态仍为 `PARTIAL`，未发现新的独立 P0/P1 当前可达产品缺陷。

15 项检查结果：

1. 真实 accepted behavior regression：满足。
2. 恢复 accepted main 且不扩展规则：满足。
3. 生产边界仅 `dreamer.ts` 一个文件、一个 resolver：满足。
4. Fang Gu canonical-drunk V7：保持不变。
5. healthy Fang Gu normal：保持不变。
6. healthy non-Fang-Gu normal：设计正确恢复。
7. canonical-drunk non-Fang-Gu：保持 represented impaired。
8. No Dashii/Vortox：保持不变。
9. 真实 catalog mismatch：继续 fail closed。
10. application evidence：设计使用真实 `GameApplicationService`。
11. V2 replay：目标正确，但 primary authority 与 validator 输入合同不完整。
12. R/T/primary layer：RST-C01、C02、C04 正确；RST-C03 存在物理 primary-authority 冲突。
13. 不需要新通用机制：满足。
14. 不重新设计 AP1/AP2：产品设计满足，但 RST-C03 当前绑定会破坏既有 primary 分类。
15. Stop-Loss 范围：产品范围可信；下面两项均可由一次有界 docs-only correction 关闭。

findings:

1. `BLOCKER — RST_C03_PRIMARY_AUTHORITY_LAYER_COLLISION`

   - 文件/位置：[phase-3-slice-2b20a-accepted-normal-dreamer-restoration-v1.md](C:/Users/wjl/Documents/血染钟楼/docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-v1.md:97)、同文件 V2 replay 设计第 160–186 行。
   - 冲突权威：[phase-3-slice-2b19a3b1-test-traceability.md](C:/Users/wjl/Documents/血染钟楼/docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md:57)。
   - 失败场景：RST-C03 要求 `LEGACY_REPLAY_COMPATIBILITY / R2 / T1`，但设计把它承载在 `[2B19A3B1-C08/C30/C36-S14/S16/S17] ...` 物理测试中。该测试的已接受 primary 分类是 `HOSTILE_REPLAY_REJECTION / R3 / T1`；S16/S17 又是 structural supporting subcases。将其作为 RST-C03 的 legacy primary 会造成一个物理 identity 拥有冲突 primary layer，或令 RST-C03 实际没有合法 primary，同时违反保持 `37/37` 和不重做 AP1 分类的约束。
   - 现有合法承载者：[rebuild.test.ts](C:/Users/wjl/Documents/血染钟楼/packages/domain-core/src/rebuild.test.ts:4816) 中 `[2B20A-C30] rebuilds accepted legacy Dreamer information for an EVIL target without reinterpretation` 已是 canonical、非 borrowed 的 legacy replay primary。
   - 必需修正：将 RST-C03 primary 明确绑定到现有 `[2B20A-C30]`。允许扩展 `rebuild.test.ts`；若取得真实 Vigormortis application stream 确有必要，可仅参数化现有 test-harness helper并保持默认 Fang Gu fixture 输出逐字节不变。当前 A3B1 application 测试只能保留为 hostile/tamper supporting authority，不能成为 RST-C03 legacy primary。不得新增 title、marker、logical group 或 primary identity。
   - 必需回归：现有 C30 title 不变；用真实 `GameApplicationService` 产生的 Vigormortis V2 accepted stream完成完整 stream validation、rebuild、语义保持、V2 不重解释为 V7，以及 semantic/terminal-batch tamper rejection；inventory 保持 `1572 / 37 / 37`。

2. `BLOCKER — RST_C03_PUBLIC_VALIDATOR_INPUT_CONTRACT_INCOMPLETE`

   - 文件/位置：[phase-3-slice-2b20a-accepted-normal-dreamer-restoration-v1.md](C:/Users/wjl/Documents/血染钟楼/docs/implementation/phase-3-slice-2b20a-accepted-normal-dreamer-restoration-v1.md:175)。
   - 运行时权威：[dreamer.ts](C:/Users/wjl/Documents/血染钟楼/packages/domain-core/src/dreamer.ts:2879)。
   - 失败场景：appendix 列出 public `validateDreamerInformationDeliveredPayload` 的 choices、setup、current state、impairments、opportunities、plan、progress、role tenures，却遗漏其必需输入 `deliveries`。实现者无法从该设计获得完整 exact-shape 调用合同，也无法明确证明 opportunity 对应 delivery 的重复防护使用正确 prefix state。
   - 必需修正：冻结完整输入，显式指定 `deliveries: prefixState.dreamerInformation`；prefix state 必须是 `DreamerTargetChosen` 后、`DreamerInformationDelivered` 前的 canonical state。其余字段继续来自同一 prefix state，禁止从最终状态或手工重组状态取值。
   - 必需回归：同一 C30 物理测试证明真实 V2 payload 在完整输入下返回 `{ valid: true }`；shape-valid semantic tamper 被拒绝；完整 stream rebuild 一致。无需新增测试 identity。

remainingBlockers:

- `RST_C03_PRIMARY_AUTHORITY_LAYER_COLLISION`
- `RST_C03_PUBLIC_VALIDATOR_INPUT_CONTRACT_INCOMPLETE`

两项均属于本次单一 normal/replay restoration 的有界文档合同修正，不要求第二个生产文件、新规则、新事件版本、新通用机制或 Product Repair Round 3。

DESIGN_RELEASE_FIX_REQUIRED
<!-- REVIEWER_BODY_END -->
