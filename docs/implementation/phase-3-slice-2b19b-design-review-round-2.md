# Phase 3 Slice 2B19B 独立规则设计审查报告

## reviewedDesign

`docs/implementation/phase-3-slice-2b19b-design-round-2.md`

## reviewedDesignSha256

`f915fd4c51c21cd7d43a873cf6345bccd97462431ba6631f161ae58077ece10b`

与控制器提供的预期 SHA-256 完全一致。

## reviewTimestamp

`2026-07-19T17:02:03.1233545+08:00`

## reviewScope

独立只读审查了：

- 2B19B Round 2 完整冻结设计；
- Round 1 设计及完整 Round 1 审查；
- 2B19B 新鲜规则证据和固定外部来源；
- 官方夜间顺序；
- 用户批准 override；
- 当前角色覆盖矩阵；
- Governance V1/V1.1 ADR、Review Protocol 和 2B19B go/no-go；
- 当前生产代码、测试边界、ownership verifier、Vitest workspace、coverage profile verifier 和 CI selector；
- 用户授权附件；
- 20 项 Round 2 必审要求；
- `C01–C60`、`S01–S20` 共 80 项设计时 traceability。

本次只审查设计，不授权任何未冻结的语义扩展，不写入文件或 GitHub。

## externalSourcesReviewed

- `docs/rules/USER_OVERRIDES.md`
  - `BOTC-SIM-PHILOSOPHER-FIRST-NIGHT-SCHEDULING-V1`
  - SHA-256：`9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5`
- 中文 Wiki 固定 revision：
  - 首页 `oldid=5855`
  - 哲学家 `oldid=5125`
  - 筑梦师 `oldid=3046`
  - 涡流 `oldid=6198`
  - 醉酒 `oldid=5720`
  - 中毒 `oldid=6294`
- 官方 BOTC Wiki 固定 revision：
  - Philosopher `oldid=2421`
  - Dreamer `oldid=2904`
  - Vortox `oldid=3017`
  - States `oldid=1039`
  - Abilities `oldid=1376`
- 官方 nightsheet：
  - repository revision `915347e627c3f6cd1f438f82b6001784e11b3e8b`
  - SHA-256：`99a2815bb31bcec3f6cd1f2fb305e301d317981d855704d3d954ec4c3f75`

固定来源可访问，独立取得的内容与 evidence 记录的 revision/hash 一致。未发现来源之间的实质冲突。

## ruleEvidenceReviewed

- `docs/rules/evidence/2B19B.md`
  - SHA-256：`e1f038f32171d7cea1f89345b1cac958e30a79f47005ca444a0dc2633abe3187`
  - verdict：`RULE_READY`
  - coverage：`PARTIAL`
- `docs/rules/evidence/2B19.md`
- `docs/rules/evidence/2B19A3B1.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/architecture/2B19B-go-no-go-under-governance-v1.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/implementation/phase-3-slice-2b19b-design.md`
- `docs/implementation/phase-3-slice-2b19b-design-review-round-1.md`
- 用户授权附件 `c4e1aaed-b994-4bb8-a3b4-e34366668783/pasted-text.txt`
  - SHA-256：`e18b318136dc14b0ec956c22dfe94791d7715799521706418c7e7000c38756ea`

## productionFilesReviewed

- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/philosopher-ability.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/mathematician.ts`
- `packages/domain-core/src/mathematician-internal.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`
- `scripts/vitest-ownership-contracts.mjs`
- `scripts/verify-vitest-ownership-contracts.mjs`
- `scripts/run-vitest-coverage-process-shards.mjs`
- `scripts/verify-coverage-obligations.mjs`
- `vitest.workspace.ts`
- `.github/workflows/ci.yml`

## testFilesReviewed

- `packages/domain-core/src/first-night-action-opportunity.test.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/domain-core/src/domain-batch-semantics.test.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`
- `packages/information-engine/src/initial-private-knowledge.test.ts`
- 现有 2B19A3A、2B19A3B1 ownership/traceability/profile 资料

## findings

1. `F01` 已关闭。Round 2 将公开 Dreamer 信息冻结为准确的三个 enumerable key：`target`、`goodRole`、`evilRole`；knowledge model version 和 delivered stage 是兄弟字段，未泄露 source、provenance、truth、reliability、Vortox 或 ledger 信息。

2. `F02` 已关闭。设计将：
   - 正式 V1 命令拒绝归为 `R1 / APPLICATION_COMMAND_INTEGRATION`；
   - 合法旧历史归为 `R2 / LEGACY_REPLAY_COMPATIBILITY`；
   - hostile provenance 归为 `R3`；
   - Traveller、shortage、source impairment、impaired Vortox 等未实现成功路径归为 `R4`；
   - receipt/fault 断言仅绑定真实 application entry 和真实 fault ports。

3. `F03` 已关闭。产品 HEAD `P` 与 profile-only 子提交 `Q` 的修改集合分离；`Q^=P`，profile `sourceHead=P`，CI workflow 仅允许替换一个明确的 `--profile` selector token。

4. 所有新增 V4/V3/V5/V6 载体及三个 nested source-contract 载体都定义了闭合字段集、版本 literal、ID/revision/cross-link、clone/equality 和 exception-safe T1 验证要求。没有留给 implementer 的自选字段或未定义类型。

5. 设计保留真实身份语义：
   - source player 仍是 Philosopher；
   - current source character 仍是 `philosopher`；
   - ability role 是 `dreamer`；
   - source tenure 是 Philosopher tenure；
   - 不创建或伪造 Dreamer tenure。

6. V5 与 V6 符合来源：
   - V5：一个原生 GOOD、一个原生 EVIL，且恰好一个是真实角色；
   - V6：仍为一个原生 GOOD、一个原生 EVIL，但两者均不得是真实角色；
   - target 的当前真实角色在 settlement revision 求值；
   - native Dreamer 的 Philosopher-induced DRUNK 不传播到 Philosopher source。

7. ledger 合同不增加 evidence variant：
   - V5 恰好 11 个 canonical reference；
   - V6 加入有效 Vortox player-role 与 tenure，共 13 个；
   - 每次 gained delivery 只产生一个 terminal fact；
   - 不使用 Dreamer tenure 作为 gained-source 证据。

8. 当前 projection 已使用三键 Dreamer entry，Round 2 只在允许的 `packages/projections/src/index.ts` 扩展 V5/V6 accepted-stream admission；`packages/domain-core/src/initial-private-knowledge.ts` 保持 reuse-only，可满足设计。

9. 当前 application service 确有真实 V2 gained-Dreamer formal entry，并在现状返回 receipt-free `ApplicationNotConfigured`。因此设计所称 R1 前置边界真实存在，不是伪造 producer。

10. 未发现阻止六文件实现方案的架构缺口。设计预计新增生产代码 `1050–1400` 行，未超过用户硬门禁的 10 文件/1800 行，也未引入新 event family、顶层 state、ledger evidence variant 或 generic gained-ability platform。

## 20-item verification matrix

| # | 结论 | 审查结果 |
|---:|---|---|
| 1 | F01/F02/F03 全部关闭 | PASS |
| 2 | source 保持 Philosopher，ability role 为 Dreamer | PASS |
| 3 | 不伪造 Dreamer tenure | PASS |
| 4 | exact shape 与 cross-link 全部冻结 | PASS |
| 5 | V5/V6 符合来源规则 | PASS |
| 6 | native Dreamer DRUNK 与 gained source 隔离 | PASS |
| 7 | R3/R4 未伪装成 R1 | PASS |
| 8 | receipt 仅绑定真实 formal path/fault port | PASS |
| 9 | ledger 11/13 由 accepted-stream authority 证明 | PASS |
| 10 | public Dreamer entry 恰好三键，version/stage 为兄弟字段 | PASS |
| 11 | `initial-private-knowledge.ts` reuse-only | PASS |
| 12 | V1 formal rejection 与合法 replay 分为 R1/R2 | PASS |
| 13 | 未虚构当前不存在的 post-delivery mutation producer | PASS |
| 14 | 产品提交与 profile-only 提交 allowlist 分离 | PASS |
| 15 | `Q^=P`、`sourceHead=P`、三次 candidate 和 exact profile 已冻结 | PASS |
| 16 | CI workflow 只允许 selector 替换 | PASS |
| 17 | 80 行 R/T/layer 语义分类成立 | PASS |
| 18 | 六个生产文件、1050–1400 LOC 满足治理边界 | PASS |
| 19 | Dreamer/Philosopher/Mathematician 保持 PARTIAL；Vortox 保持 NOT_STARTED | PASS |
| 20 | 审查前 implementation 保持 unauthorized | PASS |

## 80-item traceability audit

### C01–C10

- `C01` PASS — 真实 V2 choice/grant/insertion chain，R1/T1/accepted-stream。
- `C02` PASS — accepted plan 重建证明夜间位置与顺序。
- `C03` PASS — canonical same-position ordering 是结构验证主断言。
- `C04` PASS — task ID formatter/parser 为 R1/T3 pure seam。
- `C05` PASS — grant ID formatter/parser 为 R1/T3 pure seam。
- `C06` PASS — 11-key gained V2 instance 为 structural authority。
- `C07` PASS — accepted history 证明 source 仍为 Philosopher。
- `C08` PASS — accepted delivery/ledger 证明 ability role 为 Dreamer。
- `C09` PASS — accepted whole stream 证明无 fake Dreamer tenure。
- `C10` PASS — real producer OPEN 和 accepted settlement CLOSED 均为 R1 accepted-stream。

### C11–C20

- `C11` PASS — opportunity ID 纯 formatter/parser。
- `C12` PASS — V1 formal rejection 正确归类 R1 application integration。
- `C13` PASS — hostile grant mutation 为 R3 replay rejection。
- `C14` PASS — hostile insertion mutation 为 R3 replay rejection。
- `C15` PASS — revision mismatch 为 R3 replay rejection。
- `C16` PASS — tenure 缺失、重复、过期或错误为 R3 replay rejection。
- `C17` PASS — self-target 是 real formal command rejection。
- `C18` PASS — roster/current-state 缺失目标是 real formal rejection。
- `C19` PASS — Traveller 成功路径保持 R4 pure policy。
- `C20` PASS — settlement-time truth 使用既有真实 accepted character-change producer。

### C21–C30

- `C21` PASS — V5 GOOD target accepted stream 恰好一真。
- `C22` PASS — V5 EVIL target accepted stream 恰好一真。
- `C23` PASS — V5 both-true/both-false mutation 为 R3。
- `C24` PASS — V6 GOOD target 两项均假。
- `C25` PASS — V6 EVIL target 两项均假。
- `C26` PASS — V6 保持原生 GOOD/EVIL 分类。
- `C27` PASS — candidate order 为 deterministic pure selector。
- `C28` PASS — raw UTF-16 code-unit comparator，无 locale 依赖。
- `C29` PASS — shortage 仅为 R4 pure seam，不宣称 producer。
- `C30` PASS — accepted duplicate chain 证明 native DRUNK 与 source 分离。

### C31–C40

- `C31` PASS — native DRUNK 不阻止 gained V5。
- `C32` PASS — base V4 后 gained V6 bridge 为真实 accepted stream。
- `C33` PASS — source DRUNK success 保持 R4 unsupported。
- `C34` PASS — source POISONED success 保持 R4 unsupported。
- `C35` PASS — forged/stale Vortox provenance 为 R3 hostile rejection。
- `C36` PASS — impaired Vortox success 保持 R4 unsupported。
- `C37` PASS — target/delivery/settlement 是三事件原子 accepted batch。
- `C38` PASS — missing suffix 为 R3 truncated history。
- `C39` PASS — reordered/mixed V5/V6 batch 为 R3。
- `C40` PASS — prospective validation 在 append 前由完整 prefix 重建，不循环自证。

### C41–C50

- `C41` PASS — stored delivery mutation 不得自证。
- `C42` PASS — V5 恰好一个 NORMAL/no-other-ability fact。
- `C43` PASS — V6 恰好一个 ABNORMAL/Vortox fact。
- `C44` PASS — gained settlement 不产生第二个 fact。
- `C45` PASS — accepted V5/V6 分别证明 11/13 evidence cardinality/set。
- `C46` PASS — source player 得到准确三键投影。
- `C47` PASS — source AI 与 player safe result 深度一致。
- `C48` PASS — non-source player/AI 省略 entry/version/stage。
- `C49` PASS — projection 明确禁止 provenance/truth/reliability 泄漏。
- `C50` PASS — 当前可证明的稳定性限于 replay、重复 projection、clone isolation。

### C51–C60

- `C51` PASS — read/rebuild/metadata/prospective/commit/receipt 是真实 fault-port authority。
- `C52` PASS — repair/retry/repeat 证明一次语义成功与幂等。
- `C53` PASS — accepted commit append/receipt 子故障保持原子。
- `C54` PASS — V1–V4 与 V1 gained 历史归类 R2 legacy。
- `C55` PASS — base validator 对 gained shape 的拒绝是 structural。
- `C56` PASS — gained validator 对 base shape 的拒绝是 structural。
- `C57` PASS — bridge 有两个不同 source/instance terminal facts。
- `C58` PASS — bridge 停于未结算 Mathematician，不宣称 count。
- `C59` PASS — ownership isolation 为 exact CI/verifier authority。
- `C60` PASS — P/Q、三候选 profile、exact selector 与 exact-head CI 合同闭合。

### S01–S10

- `S01` PASS — source contract 恰好 19 keys。
- `S02` PASS — ability instance 恰好 11 keys。
- `S03` PASS — grant reference 恰好 8 keys。
- `S04` PASS — insertion reference 恰好 11 keys。
- `S05` PASS — opportunity V4 恰好 13 keys。
- `S06` PASS — visibility V4 恰好 5 keys及冻结 tuple literals。
- `S07` PASS — target V3 恰好 17 keys。
- `S08` PASS — delivery V5 恰好 21 keys。
- `S09` PASS — delivery V6 恰好 22 keys。
- `S10` PASS — role snapshot/modifier 的 nested shapes 闭合。

### S11–S20

- `S11` PASS — canonical IDs、seat、revision、staleness 边界 fail closed。
- `S12` PASS — proxy、revoked proxy、getter、symbol、cycle、nonplain、sparse hostile matrix 完整，getter count 必须为 0。
- `S13` PASS — union dispatch version-first，无 discriminator fallthrough。
- `S14` PASS — deep clone 引用隔离。
- `S15` PASS — equality 覆盖每个语义字段。
- `S16` PASS — individually valid 但 cross-link swapped 的链必须拒绝。
- `S17` PASS — envelope metadata/sequence/batch/command/version mutation 为 R3 hostile replay。
- `S18` PASS — ledger evidence 缺失、额外、重复、冲突均拒绝。
- `S19` PASS — hand-built state-only V5/V6 不是 accepted provenance，不得投影泄漏。
- `S20` PASS — static nondeterminism audit 与 cross-platform CI 分类正确。

机械核对结果：恰好 80 行，覆盖 `C01–C60` 和 `S01–S20`，无缺号、无重复；每行均具有一个 reachability、一个 trust class 和一个 primary layer。

## verdict

`RULE_DESIGN_PASS`

## remainingBlockers

`[]`

RULE_DESIGN_PASS
