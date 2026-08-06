# 2B20B-P2F1R-D2：最小 exact-HEAD 公共发布证据设计 v1

## 1. 文档身份与状态

- 目标路径：`docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md`
- `AuthorityStatus=CURRENT_AND_COMPLETE_D2_DESIGN_AUTHORITY`
- `SliceId=2B20B-P2F1R-D2`
- `DesignCorrection=0/1`
- 本文只定义一个 D2 纵向切片，不包含 D3。
- 本文不是 `RULE_DESIGN_PASS`。该判定只能由后续独立只读 reviewer 给出。
- 当前设计基线为规则证据提交 `418b2fdb1c68578fa279fe915307efb802402247`，其唯一父提交是 E。

## 2. 唯一设计目标

在不改变产品、规则、测试身份或既有 CI 拓扑的前提下，为一个冻结的未来 D2 源提交 H 建立最小、可复核的公共发布证据：

1. 同一个 exact-HEAD `push` workflow run 中，Linux 和 Windows 都执行普通 `domain-core-rest` 逻辑组。
2. 两个平台都证明执行的是同一组 503 个测试身份。
3. 两个平台都证明 checkout 的确切 HEAD、P/E/S 和已接受 profile 来源可达。
4. 保存两个 job、两个 artifact 和两个原始 job-log 下载物的可验证绑定。
5. 由一个离线 T1 verifier 生成一个封闭 JSON 证据包。
6. JSON 证据包由 H 的唯一直接子提交 E2 持久化，供独立最终证据评审和 D3 清理使用。

D2 只包含三个行为类别：

- exact ancestry evidence；
- Windows `domain-core-rest` evidence；
- Linux/Windows evidence upload。

不得加入第四个行为类别。

## 3. 已满足的规则设计前置条件

- 规则证据：`docs/rules/evidence/2B20B-P2F1R-D2.md`
- 证据提交：`418b2fdb1c68578fa279fe915307efb802402247`
- 文件 SHA-256：`671827090c071cc1062dd9c2199da09dd27f983b24f80855bc976d9d0eeb6505`
- 唯一父提交：E=`15b7e61682d3b34e45401cf132fa1a77b6347c22`
- 规则研究判定：`RULE_READY`
- `involvedRoles=[]`
- 角色覆盖状态：`SKELETON`
- 规则、产品语义、事件 schema、测试身份、profile、selector、ownership、routing、coverage 变化标志均为 `false`。
- 当前 `docs/rules/ROLE_COVERAGE_MATRIX.md` 已读；D2 不修改角色状态。

固定规则来源包括用户覆盖、中国 Wiki revid 5855、官方 Wiki revid 3035、官方 nightsheet 固定提交及哈希。代码、测试、README 和模型记忆均未用作规则真相。

## 4. 基线与旧 D2 处置

固定基线：

- S=`8898f62ceb90433634cf02e83ad5d4ff95db4499`
- P=`0bf487afc49069f6191dd7409362d5c227aa50dc`
- E=`15b7e61682d3b34e45401cf132fa1a77b6347c22`
- P profile token=`phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1`
- profile body SHA-256=`4f047c39739b22ac0b4a04dda8eddc8125d902a8bcd281d448d8f61626986426`
- profile artifact SHA-256=`2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567`
- inventory=`1712 tests / 36 physical files`
- inventory SHA-256=`540e2f2a92132ad43b299e95c6515d2349c514f66db4e1054b6eb0f9474cf7d2`
- coverage tuple census SHA-256=`79db242f87a5f22ceca3365a75045d977cb9acee9f9616e82723258110979cfb`
- normalized tuple-set binding SHA-256=`8c7bc3f7633053d80e97785147bcf1f70c42cad341b60b2ee51bc41fc0fc2a54`

旧 D2 分支 `ff92a1c12c...` 不以 E 为祖先，其与 E 的 merge-base 是 `4bca4e5...`。旧 D2 的初始设计、correction 1、correction 2、review 和规则证据统一标记：

`HISTORICAL_UNACCEPTED_SUPERSEDED`

不得恢复、修补、引用为当前设计权威，也不得创建 correction 3。

## 5. 范围

D2 未来实现范围仅包括：

- 在现有 Linux `test-shard` 的 `domain-core-rest` matrix 实例上采集证据。
- 在现有 Windows `deterministic-windows` job 中增加一次普通 `domain-core-rest` 执行。
- 两个现有 job 的 exact ancestry 证明。
- 两个 D2 专用、七天保留的 artifact 上传。
- 一个临时、无网络、Node 标准库实现的 verifier。
- 一个 H 内的来源状态/期望追踪文档。
- 一个 E2 内的最终封闭 JSON 证据包。
- H 与 E2 的独立代码及规则评审。
- 明确交给 D3 的清理契约。

## 6. 非目标

D2 不得：

- 修改 BOTC 规则、角色能力或角色覆盖矩阵。
- 修改生产代码、domain event、command、projection、snapshot 或 runtime payload。
- 修改测试内容、测试标题、测试 identity、logical group membership 或 profile。
- 修改 selector、ownership、routing、coverage 或 registry。
- 增加 workflow、job、matrix、trigger、依赖或常驻框架。
- 修改 P、E、S 或被接受的 profile。
- 生成、修改或验证结构 catalog。
- 创建 PR、合并、打 accepted tag、关闭 Phase 3 或设计 D3。
- 宣称 D2 验证了产品规则、事件语义、replay 或 projection 正确性。
- 把 runner 输出、artifact 上传成功或字段形状验证误称为 accepted-history provenance。

## 7. 不变的系统边界

D2 不触碰下列边界；任何触碰都必须停止：

- domain events 仍是 canonical truth。
- snapshots 仍仅是可重建缓存。
- audit/infrastructure events 不参与 game-state rebuild。
- 所有命令仍经过单串行队列和单逻辑 writer。
- AI 输出仍仅为 candidate command。
- player view、AI memory、public state、Storyteller state 和 replay truth 仍分离。
- delivered knowledge 仍是历史事实，不得按新角色状态重算。
- ability effectiveness 仍在 settlement 时求值。
- exact runtime validation、replay validation、atomic batch、prospective validation 和 retry boundary 均保持原状。
- canonical ID 和顺序不得引入时间、随机 UUID 或 locale 依赖。
- D2 只增加 CI 证据，不改变跨平台确定性的产品实现。

## 8. 两提交拓扑

未来实现必须形成：

```text
E -> 418b2f... -> [design-only descendants, if any] -> H -> E2
```

约束：

- H 是冻结的 D2 源提交。
- E2 的唯一直接父提交必须是 H。
- H 包含 workflow、verifier 和来源状态文档。
- H 不得记录自己的 SHA、未来 run ID、job ID、artifact ID、log SHA、E2 SHA、评审结果、PR 或 D3 结果。
- E2 只增加最终证据包，不修改 H 的任何文件。
- E2 不记录自己的 SHA，也不自证 `parent(E2)=H`。
- `parent(E2)=H` 由 E2 创建后的独立只读 reviewer 通过 Git 对象验证。
- H 后的任何源代码或 workflow 修订都会产生新的 H，并使旧 run 和旧评审失效。

## 9. 复用的现有 CI 拓扑

必须复用以下现有标识：

- Workflow：`CI`
- Linux job ID：`test-shard`
- Linux job display name：`test shard (domain-core-rest)`
- Linux matrix value：`domain-core-rest`
- Windows job ID：`deterministic-windows`
- Windows完整 display name：
  `deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice/snake-charmer/evil-twin/witch/dreamer/clockmaker`
- Workflow trigger：现有 `push`
- Runner：现有 Ubuntu 和 Windows hosted runners
- Node：`24.15.0`
- pnpm：`11.7.0`
- Vitest：`3.2.6`
- 逻辑组 runner：`scripts/run-vitest-logical-group.mjs`
- 普通组命令：
  `node scripts/run-vitest-logical-group.mjs run --mode ordinary --logical-group-id domain-core-rest`
- 期望身份数量：503。

不得复制 job、增加 D2 workflow、扩大 matrix 或新增 trigger。

## 10. `.github/workflows/ci.yml` 的最小变化

只允许修改一个现有 workflow 文件。

Linux `test-shard`：

- 保留现有 checkout step。
- `fetch-depth` 必须使用矩阵条件，使只有 `domain-core-rest` 获得完整历史；其他 shard 保持 depth 1：

```yaml
fetch-depth: ${{ matrix.group == 'domain-core-rest' && '0' || '1' }}
```

- 现有 `Test shard` 命令保持不变。
- 仅在 `matrix.group == 'domain-core-rest'` 时运行 D2 capture step。
- capture 读取现有 `.vitest-test/segmented/domain-core-rest` 输出，不再次执行测试。
- 上传 D2 专用 Linux artifact，`retention-days: 7`，`if-no-files-found: error`。
- 现有 `test-evidence-${{ matrix.group }}` artifact 保持不变。

Windows `deterministic-windows`：

- 在现有 checkout step 增加 `fetch-depth: 0`。
- 保留现有 Windows 测试和 W1–W7 evidence 步骤。
- 追加一次普通 `domain-core-rest` runner 命令。
- 对该输出执行 D2 capture。
- 上传 D2 专用 Windows artifact，`retention-days: 7`，`if-no-files-found: error`。

D2 artifact 名称必须确定性生成：

- `d2-linux-domain-core-rest-${{ github.sha }}`
- `d2-windows-domain-core-rest-${{ github.sha }}`

不得更改现有 job ID、display name、矩阵和 required-check 名称。

## 11. 单一临时 verifier 契约

唯一允许的新脚本：

`scripts/verify-p2f1r-d2-publication-evidence.mjs`

约束：

- 只能使用 Node 标准库。
- 如需 Git，只能使用 `spawn`/`spawnSync` 且 `shell:false`。
- 不得联网。
- 不得 import 生产代码。
- 不得修改 profile、测试、catalog 或 runner。
- 除明确的输出路径外不得写仓库。
- JSON 使用 UTF-8、LF、无 BOM、稳定键序和单个终止换行。
- 文件遍历使用 POSIX 相对路径的 UTF-8 字节序，不使用 locale。
- verifier 只有三种 mode：

```text
self-test
capture-runner
audit-bundle
```

`capture-runner` 输入：

```text
--platform linux|windows
--source-head <40-lowercase-hex>
--parent-artifact-head <P>
--parent-evidence-head <E>
--runner-output <path>
--output <path>
```

`audit-bundle` 输入：

```text
--source-head <H>
--parent-artifact-head <P>
--parent-evidence-head <E>
--acquisition-root <absolute-temporary-path>
--design-contract <repo-relative-path>
--output docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json
```

成功只输出一行：

```text
D2_CAPTURE_OK <platform> <H> <capture-sha256>
```

或：

```text
D2_PUBLICATION_BUNDLE_OK <H> <run-id> <bundle-sha256>
```

验证失败退出 1，stdout 为空，stderr 以单一稳定错误 token 开头。内部错误退出 2。不得静默降级或写部分最终 bundle。

## 12. Exact ancestry 证明

两个平台的 capture 都必须验证：

- `GITHUB_EVENT_NAME == push`
- checkout `HEAD == GITHUB_SHA == H`
- H、P、E、S 都是本地可读 Git 对象
- P 是 H 的祖先
- E 是 H 的祖先
- S 是 H 的祖先
- 已接受 profile 来源提交 `4d576e205cb20c37ba913b923a1cd39e8d800d18` 可达
- history 不是 shallow，或至少 Git 可完整证明上述关系
- 规则证据提交 `418b2f...` 是 H 的祖先
- P 的父是 S，E 的父是 P；这些固定关系与现有权威一致

checkout history 不完整、对象缺失、Git 返回不确定结果或祖先关系不可证明时必须失败，不得把未知当作 false 后继续。

E2 的直接父关系不在 H 的 hosted run 中伪造；它由最终 E2 reviewer 单独验证。

## 13. 两个平台的 runner 证据

每个平台的 D2 artifact 包含：

```text
d2-capture.json
runner-output/**
```

`runner-output/**` 是该平台 `domain-core-rest` runner 输出目录的完整、未经规范化复制。`d2-capture.json` 是封闭对象，至少准确记录：

- schema version；
- platform；
- H、P、E、S；
- GitHub run ID、run attempt、event 和 `GITHUB_SHA`；
- workflow job ID；
- runner OS、arch、`ImageOS`、`ImageVersion`；
- Node、pnpm 和 Vitest 版本；
- exact command argv；
- logical group ID 和 mode；
- process exit code；
- start/end Unix 毫秒；
- selected identity count；
- selected identity SHA-256；
- runner manifest SHA-256；
- verification report SHA-256；
- 完整 `runner-output` canonical-tree SHA-256；
- capture verdict。

成功条件：

- 两个平台都为普通 `domain-core-rest`；
- 两个平台 selected identity count 都是 503；
- 两个平台 selected identity SHA-256 完全相同；
- 两个平台 process exit code 为 0；
- manifest 和 verification 均有效；
- capture 中不得出现本机绝对路径。

## 14. 公共 run、artifact 与 job-log 采集

只能接受一个冻结 H 的 `push` workflow run：

- workflow name=`CI`
- event=`push`
- head SHA=`H`
- workflow conclusion=`success`
- Linux 和 Windows 都来自相同 `runId + runAttempt`
- 两个 job conclusion 均为 `success`
- 不得混用 rerun attempt、PR merge ref 或不同 run 的证据

离线 acquisition root 固定布局：

```text
acquisition-manifest.json
api/run.json
api/jobs/linux.json
api/jobs/windows.json
artifacts/linux/**
artifacts/windows/**
logs/linux.bin
logs/windows.bin
captures/linux/d2-capture.json
captures/windows/d2-capture.json
```

`acquisition-manifest.json` 记录每个输入的来源 URL、获取时间、字节长度和 SHA-256。它是临时采集物，不提交。

Artifact canonical-tree SHA-256 算法：

1. 递归枚举普通文件，拒绝 symlink、junction 和设备文件。
2. 相对路径转为 `/`，拒绝 `..`、绝对路径和大小写碰撞。
3. 按路径 UTF-8 字节序排序。
4. 对每个文件依次哈希：
   `pathLength:uint32be || pathUtf8 || 0x00 || fileLength:uint64be || sha256(fileBytes)`。
5. 最终 SHA-256 不使用 ZIP 时间戳、权限位或文件枚举顺序。

两个 `logs/*.bin` 是各自 GitHub job-log 下载响应的原始字节；记录字节长度和 SHA-256，不对换行或编码做规范化。

## 15. E2 最终证据包的封闭 schema

唯一持久化证据包：

`docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json`

顶层键必须且只能是：

```text
schemaVersion
sourceHead
parentArtifactHead
parentEvidenceHead
workflow
ancestry
jobs
artifacts
logs
retention
catalogReconciliation
designExpectedBindings
actualBindings
d3Handoff
finalStructuralVerdict
```

固定约束：

- `schemaVersion="2B20B-P2F1R-D2-publication-evidence-v1"`
- `sourceHead=H`
- `parentArtifactHead=P`
- `parentEvidenceHead=E`
- `workflow` 记录 workflow name、十进制字符串 run ID、attempt、event、head SHA、status、conclusion、URL 和 API 时间戳。
- `ancestry` 记录两个平台各自的 checkout/ancestor 结果以及固定 P/E/S/profile-source 可达性；所有 required boolean 必须为 `true`。
- `jobs` 必须恰有两个有序记录：`linux-domain-core-rest`、`windows-domain-core-rest`。
- 每个 job 记录 workflow job ID、完整 display name、GitHub numeric job ID、平台/runner/image、工具链、exact argv、起止时间、conclusion、exit code、identity count、identity SHA、manifest SHA、verification SHA、artifact ref 和 log ref。
- `artifacts` 必须恰有两个记录，包含 artifact ID、名称、job ref、H、保留天数、到期时间、字节长度、文件数和 canonical-tree SHA-256。
- `logs` 必须恰有两个记录，包含 job ref、下载 URL、字节长度和原始 SHA-256。
- `retention` 固定为 7 天，并声明 hosted artifact 过期后 E2 哈希仍是历史证据，而不是可下载性保证。
- `catalogReconciliation` 只能记录第 17 节的支持性 catalog 事实。
- `designExpectedBindings` 恰有 D-C16、D-C16A、D-C16B 三条设计记录。
- `actualBindings` 恰有 D-C16A、D-C16B 两条实际记录。
- `d3Handoff` 只能通过稳定 record ID 引用 H、P、E、run、jobs、artifacts、logs、bundle 和清理类别；不得重复大块 payload。
- `finalStructuralVerdict="D2_PUBLICATION_EVIDENCE_BUNDLE_VALID"`。

缺字段、额外字段、错误顺序、未知 enum、重复 record ID、悬空引用或类型不精确均失败。

## 16. 每个证据字段的消费者

| 字段组 | 唯一消费者 |
|---|---|
| `schemaVersion` | verifier、最终 reviewer、D3 |
| `sourceHead` / P / E | ancestry 审计、最终 reviewer、D3 |
| `workflow` | D-C16A、最终 reviewer |
| `ancestry` | D-C16A、最终 reviewer |
| `jobs` | D-C16A 的同 run、平台、身份和 runner 绑定 |
| `artifacts` | D-C16A 的公共证据；D-C16B 的离线结构审计 |
| `logs` | D-C16A/D-C16B 的失败不可隐藏和执行 provenance |
| `retention` | D3 生命周期审计 |
| `catalogReconciliation` | D-C16B 支持性对账 |
| `designExpectedBindings` | D-C16B 对本文预期契约的封闭匹配 |
| `actualBindings` | 最终 reviewer 和 D3 |
| `d3Handoff` | D3 清理与保留审计 |
| `finalStructuralVerdict` | D-C16B 成功输出 |

不得增加仅用于展示、营销、重复摘要或推测未来状态的字段。

## 17. T1 离线 verifier 边界与 catalog 地位

`audit-bundle` 是 T1 外部/持久边界检查：

- 输入是从 GitHub 下载到临时 acquisition root 的不可信材料。
- verifier 不信任 artifact 名称、API JSON、capture JSON、日志或目录名。
- 它重新计算所有字节哈希、tree hash、交叉引用和 Git 关系。
- 它只有在全部检查成功后，才将最终 JSON 写到临时文件，`fsync/close` 后原子 rename 到目标。
- 失败时不得留下或覆盖一个看似有效的最终 bundle。
- bundle 形状验证不等于接受历史；独立 reviewer 仍须验证 E2、H 和实际 Git/GitHub 状态。

结构 catalog 仅是支持性输入，不是 runtime authority，也不参与测试发现。固定事实：

- path=`docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md`
- blob OID=`4f9a376e56f19b241d76ce2a75be83b70859ae25`
- raw/generated length=`264855`
- raw/generated SHA-256=`e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6`
- LF count=`626`
- Windows CRLF-only checkout length=`265481`
- Windows checkout SHA-256=`7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7`
- classification=`LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY`
- `runtimeAuthority=false`

D2 不生成、不修改、不添加 catalog verifier。

## 18. Governance V1.1 映射

D-C16 是分组 criterion，不是 active primary：

| 字段 | D-C16 |
|---|---|
| `CriterionId` | `D-C16` |
| `RuleClaim` | D2 公共发布证据分组 |
| `CompletionCriterion` | D-C16A 和 D-C16B 均完成 |
| `RequiredEvidenceMechanism` | grouping only |
| `ExpectedReachability` | `R4 FUTURE_HYPOTHETICAL_STATE` |
| `ExpectedTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `ExpectedPrimaryLayer` | `NONE` |
| `ExpectedResult` | 子 criterion 全部通过 |
| `SupportingAuthorityRequirement` | `NONE` |

两个 active criterion：

| 字段 | D-C16A | D-C16B |
|---|---|---|
| `CriterionId` | `D-C16A` | `D-C16B` |
| `RuleClaim` | 同一 exact-H push run 产生 Linux/Windows 普通组公共证据 | 离线 verifier 对完整发布证据执行封闭结构验证 |
| `CompletionCriterion` | 两个 required job、artifact、log、ancestry 和 503 身份绑定均成功 | 封闭 schema、哈希、引用、期望/实际映射和 D3 handoff 均成功 |
| `RequiredEvidenceMechanism` | `CROSS_PLATFORM_CI` | `STRUCTURAL_VALIDATION` |
| `ExpectedReachability` | `R4 FUTURE_HYPOTHETICAL_STATE` | `R4 FUTURE_HYPOTHETICAL_STATE` |
| `ExpectedTrust` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` |
| `ExpectedPrimaryLayer` | `CROSS_PLATFORM_CI` | `STRUCTURAL_VALIDATION` |
| `ExpectedResult` | 同 run 双平台成功证据 | 原子生成有效封闭 bundle |
| `SupportingAuthorityRequirement` | `NONE` | `NONE` |

`actualBindings` 每条必须且只能包含：

```text
CriterionId
ActualTestFile
ActualTestTitle
ActualPrimaryLayer
ActualReachability
ActualTrust
SupportingAuthorityId
MechanismMatch
```

- D-C16A 的 `ActualTestFile` 绑定 H 的 `.github/workflows/ci.yml`。
- D-C16B 的 `ActualTestFile` 绑定 H 的 verifier。
- 两条 `SupportingAuthorityId=NONE`。
- 两条 `MechanismMatch` 只能在实际证据满足设计后写为 `MATCH`。
- 分组 D-C16 不得伪造 actual binding。
- Catalog 是支持性对账材料，但不建立新的 Governance supporting-authority ledger。

## 19. 文件 allowlist

设计阶段从 E 起仅允许两个文件：

1. `docs/rules/evidence/2B20B-P2F1R-D2.md`
2. `docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md`

未来 H 实现 allowlist 恰为：

1. `.github/workflows/ci.yml`
2. `scripts/verify-p2f1r-d2-publication-evidence.mjs`
3. `docs/implementation/phase-3-slice-2b20b-p2f1r-d2-source-head-status.md`

未来 E2 allowlist 恰为：

1. `docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json`

发现任何其他生产、测试、workflow、配置、锁文件、profile、registry 或文档变化都必须停止。

## 20. H 的接受检查

H 冻结前必须满足：

- Git diff 只涉及 H allowlist。
- workflow YAML 可解析。
- workflow/job/matrix/trigger 集合与 E 完全相同。
- Linux 只有 `domain-core-rest` 获得 `fetch-depth:0`。
- Windows 现有 job 获得 `fetch-depth:0`。
- Windows 使用现有普通逻辑组 runner，预期 503。
- 只有两个 D2 artifact upload，均保留 7 天。
- verifier 仅一个文件、三种 mode、无网络和生产 import。
- verifier self-test 通过全部七个负例。
- H status 文档只记录设计期望和实际本地 gate 结果，不记录未来 hosted 事实。
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm test:coverage`
- fresh local Code Review 完整通过。
- fresh local Rule Review 完整通过。
- H 提交后 worktree clean。
- H 一旦进入评审即冻结；任何提交都使评审失效。

## 21. 最小测试矩阵

不得新增 Vitest 测试文件。verifier self-test 必须恰好覆盖七类单点变异：

| ID | 唯一变异 | 必须错误 token |
|---|---|---|
| N1 | `sourceHead` 改为错误 SHA | `D2_SOURCE_HEAD_MISMATCH` |
| N2 | 删除一个 required Linux 或 Windows job | `D2_REQUIRED_JOB_MISSING` |
| N3 | 只修改一个 artifact SHA | `D2_ARTIFACT_SHA_MISMATCH` |
| N4 | 只交换一个 platform/job mapping | `D2_PLATFORM_JOB_MAPPING_MISMATCH` |
| N5 | 使 ancestry 不可证明 | `D2_ANCESTRY_UNPROVABLE` |
| N6 | 删除一个 required bundle field | `D2_BUNDLE_REQUIRED_FIELD_MISSING` |
| N7 | 添加一个未知 bundle field | `D2_BUNDLE_UNEXPECTED_FIELD` |

每个 fixture 只能包含一个目标变异。不得进行组合爆炸、模糊测试、性能框架或第二套 verifier。

## 22. Hosted CI 执行契约

H 冻结后：

1. 推送 exact H 到临时 D2 分支。
2. 只接受该 H 的一个 `push` workflow run。
3. 等待整个 `CI` workflow 成功。
4. 从同一个 `runId + runAttempt` 获取两个 required jobs。
5. 获取两个 D2 artifacts 和两个 job logs。
6. 不接受 `pull_request` run、merge ref、不同 HEAD 或混合 attempt。
7. 在本地临时目录构造 acquisition root。
8. 运行 `audit-bundle`。
9. verifier 成功后才允许 sole writer 提交 E2。

若 H 不变且失败被明确分类为 hosted runner 的瞬时外部故障，可对同一 run 执行一次 rerun；新 attempt 必须完整替代旧 attempt，不得混合。相同失败再次发生即停止。实现或契约故障必须产生新 H，并重新执行全部 review 和 CI。

当前设计阶段不运行 hosted CI。

## 23. 强制评审顺序

顺序不得调整：

1. implementer 创建未来 H。
2. 运行全部本地 gates。
3. fresh local Code Review 检查 H。
4. fresh local Rule Review 检查 H、规则来源、规则证据、nightsheet 和角色矩阵。
5. 冻结 H。
6. 推送 exact H 到临时分支。
7. 运行一个 exact-H `push` CI。
8. 采集 run、job、artifact 和 log。
9. 离线 verifier 原子生成最终 bundle。
10. sole writer 创建唯一直接父为 H 的 docs/evidence-only E2。
11. fresh final evidence Code Review 检查 E2、H、GitHub run 和全部输入。
12. fresh final evidence Rule Review 独立复核来源、证据、nightsheet 和角色矩阵。
13. 冻结 D2 evidence head。
14. 仅在两个最终 review 均通过且 blocker 为空后，交给 D3。

最终 reviewer 必须输出完整且不截断的规定字段，包括 `reviewedPR`、`reviewedHead`、时间、scope、生产/测试/规则文件清单、findings、两个 verdict 和 blockers。当前无 PR 时 `reviewedPR=NONE_NOT_PUBLISHED`。控制器不得自行合成 PASS。

## 24. 文档要求

H status 文档必须包含：

- authority 指向本文；
- E/P/S/profile/inventory 固定值；
- H 的文件 allowlist 和三个行为类别；
- expected D-C16/A/B 追踪；
- 本地 gate 的命令、实际状态和时间；
- hosted 证据仍为 `NOT_YET_EXECUTED`；
- 不得提前写 H SHA、run、job、artifact、E2 或 reviewer verdict。

E2 bundle 是唯一提交的 hosted evidence 数据文件。

D2 不更新：

- `ROLE_COVERAGE_MATRIX.md`
- 当前产品 README
- profile
- agent-loop 的完成状态
- post-merge archive

最终 review 输出保留在外部，待 D3 按原文归档；不得为归档 review 而修改冻结 E2。

## 25. 资产生命周期与 D3 handoff

D2 特有 operational asset：

- `KEEP=0`

需要长期归档的类别恰为四类：

1. E2 最终证据包；
2. H 来源状态/期望追踪记录；
3. 完整最终 Code Review 原文；
4. 完整最终 Rule Review 原文。

D3 后必须删除的类别恰为八类：

1. 临时 verifier；
2. `.github/workflows/ci.yml` 中全部 D2 专用 step 和 D2 checkout delta；
3. 临时 D2 分支；
4. 本地下载的 artifacts；
5. 原始 job logs；
6. 临时 worktrees；
7. acquisition root 及中间 acquisition manifest；
8. self-test 一次性负例 fixtures。

Hosted artifacts 由七天 retention 自动过期。

D3 清理审计必须验证：

- verifier 文件和仓库引用均消失；
- 两个 D2 upload 和 Windows D2 普通组步骤消失；
- D2 checkout delta 消失；
- 普通既有 CI 仍工作；
- E2 bundle 和最终 review archive 完整；
- P/E/profile/selector/ownership/routing/coverage 未改变；
- 如 workflow 已发生介入性漂移，D3 停止并要求重新评审，不得覆盖他人变化。

## 26. 回滚与重试边界

- 设计未接受前：只丢弃隔离 worktree 中的 D2 设计材料，不改共享工作树。
- H 尚未推送且发现问题：用后继修复提交形成新的候选 H；不得 amend、rebase 或改写历史。
- H 已推送或评审后发生任何源变化：旧评审、CI 和证据全部失效，建立新 H 并从本地 review 重来。
- hosted 瞬时故障：仅允许同一冻结 H 的一次分类明确 rerun；不得混用 attempt。
- E2 创建失败：保留未接受失败证据，修复 acquisition/verifier 输入后重新从同一 H 创建新的直接子候选；若已有错误 E2 提交，不 amend 或 force-push。
- E2 内容缺陷：消耗 implementation repair 预算并创建新的可审计后继路径；不得把非直接子伪装成合格 E2。
- D3 清理是后续独立切片，不得在 D2 提前执行。
- 禁止 reset-hard、历史改写、force push 或删除既有权威提交。

## 27. 停止条件

任一条件发生即停止并报告 `HUMAN_BLOCKED` 或需要新设计，而不是扩展范围：

- 规则判定不再是 `RULE_READY`。
- 需要修改 P、E、profile、registry、selector、ownership、routing、coverage、产品代码或测试。
- 需要新 workflow、job、matrix、trigger 或第二个 verifier。
- 需要常驻证据框架或新 traceability ledger。
- 需要恢复旧 D2。
- H/P/E/S/profile-source ancestry 无法证明。
- 无法从同一个 run/attempt 获得 Linux 与 Windows 证据。
- E2 无法成为 H 的唯一直接子提交。
- 需要在 H 或 E2 中加入 self-reference 或未来事实。
- 无法取得 artifact tree SHA 或原始 job-log SHA。
- D2 operational asset 无法在 D3 删除。
- 出现第四个行为类别。
- 发现 artifact/log/API 数据之间有实质冲突。
- 设计修正或实现修复预算耗尽。
- 相同失败连续重复。
- 独立 reviewer 返回 `RULE_DESIGN_FIX_REQUIRED`、`HUMAN_BLOCKED` 或不完整报告。
- 所需固定来源不可用或出现实质规则冲突。

## 28. 复杂度与修复预算

永久结构预算：

- permanent production files：0
- permanent test files：0
- permanent workflows：0
- permanent jobs：0
- permanent matrices：0
- new triggers：0
- dependencies：0
- registries：0
- long-term operational concepts after D3：0

临时预算：

- verifier：最多 1
- verifier modes：恰为 3
- modified workflow files：最多 1
- D2 behavior classes：恰为 3
- H files：恰为 3
- E2 files：恰为 1
- hosted required jobs：恰为 2
- D2 artifacts：恰为 2
- D2 raw job logs：恰为 2
- negative cases：恰为 7
- final JSON bundle：恰为 1

修复预算：

- `DesignCorrection=0/1`
- `ImplementationRepair=0/2`
- 禁止第三次设计修正或第三次实现修复。
- 不采用旧 D2 的机械 LOC ceiling；边界由文件、行为类别和资产数量控制。

## 29. 当前交接报告

```text
currentHead=418b2fdb1c68578fa279fe915307efb802402247
authorization=READ_ONLY_ARCHITECT_DESIGN_ONLY
ruleEvidence=docs/rules/evidence/2B20B-P2F1R-D2.md
ruleEvidenceSHA256=671827090c071cc1062dd9c2199da09dd27f983b24f80855bc976d9d0eeb6505
ruleVerdict=RULE_READY
involvedRoles=[]
parentArtifactHeadP=0bf487afc49069f6191dd7409362d5c227aa50dc
parentEvidenceHeadE=15b7e61682d3b34e45401cf132fa1a77b6347c22
settledBaselineS=8898f62ceb90433634cf02e83ad5d4ff95db4499
profileToken=phase-3-slice-2b20b-p2f1r-d1-5r-8898f62-routing-coverage-v1
profileBodySHA256=4f047c39739b22ac0b4a04dda8eddc8125d902a8bcd281d448d8f61626986426
profileArtifactSHA256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
inventory=1712_tests_36_physical_files
historicalOldD2=HISTORICAL_UNACCEPTED_SUPERSEDED
designPath=docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md
designSHA256=PENDING_SOLE_WRITER_MATERIALIZATION
authorityStatus=CURRENT_AND_COMPLETE_D2_DESIGN_AUTHORITY
D2Scope=EXACT_ANCESTRY+WINDOWS_DOMAIN_CORE_REST+LINUX_WINDOWS_EVIDENCE_UPLOAD
linuxJobId=test-shard
windowsJobId=deterministic-windows
windowsDomainCoreEvidence=DESIGNED_NOT_EXECUTED
bundleSchema=2B20B-P2F1R-D2-publication-evidence-v1
T1Verifier=ONE_TEMPORARY_SCRIPT_THREE_MODES
negativeCaseCount=7
workflowFilesModified=1
newWorkflowCount=0
newJobCount=0
newMatrixCount=0
D-C16Disposition=GROUPING_ONLY_NO_ACTUAL_BINDING
D-C16APrimary=CROSS_PLATFORM_CI
D-C16BPrimary=STRUCTURAL_VALIDATION
reviewSequence=LOCAL_CODE_LOCAL_RULE_FREEZE_H_PUSH_CI_ACQUIRE_AUDIT_E2_FINAL_CODE_FINAL_RULE_D3_HANDOFF
D3CleanupRequired=true
keepOperationalAssets=0
archiveCategories=4
deleteAfterD3Categories=8
permanentProductionFiles=0
permanentTestFiles=0
permanentOperationalConceptsAfterD3=0
temporaryVerifierMax=1
implementationAllowlistCountH=3
implementationAllowlistCountE2=1
designCorrectionBudget=0/1
implementationRepairBudget=0/2
productImpact=false
eventSchemaImpact=false
testIdentityImpact=false
profileImpact=false
selectorImpact=false
ownershipImpact=false
routingImpact=false
coverageImpact=false
designReviewer=PENDING_FRESH_INDEPENDENT_READ_ONLY_REVIEW
designVerdict=PENDING_NOT_ISSUED
remainingDesignBlockers=[]
remainingDesignGates=[SOLE_WRITER_MATERIALIZE_DESIGN,FRESH_INDEPENDENT_RULE_DESIGN_REVIEW]
implementationAuthorized=false
architectFilesChanged=0
architectCommitCreated=false
coverageExecuted=false
hostedCIExecuted=false
pushPerformed=false
pullRequestCreated=false
D3DesignedOrStarted=false
requiredNextAction=SOLE_WRITER_MATERIALIZE_THIS_EXACT_DESIGN_THEN_REQUEST_FRESH_INDEPENDENT_RULE_DESIGN_REVIEW
```

未发现实质规则冲突或不可实现的现有 CI seam。实现仍未获授权；必须先由 sole writer 原样物化本文，再取得独立 `RULE_DESIGN_PASS`。
