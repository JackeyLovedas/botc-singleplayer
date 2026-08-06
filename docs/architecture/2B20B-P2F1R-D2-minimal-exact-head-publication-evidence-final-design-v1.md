# 2B20B-P2F1R-D2：最小 exact-HEAD 公共发布证据设计 v1

## 1. 文档身份与状态

- 目标路径：`docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md`
- `AuthorityStatus=CURRENT_AND_COMPLETE_D2_DESIGN_AUTHORITY`
- `SliceId=2B20B-P2F1R-D2`
- `DesignCorrection=1/1`
- 本文只定义一个 D2 纵向切片，不包含 D3。
- 本文不是 `RULE_DESIGN_PASS`。该判定只能由后续独立只读 reviewer 给出。
- 本设计权威已经物化；其 Git commit 和本文件 SHA-256 不在文件内部自引用，由 §29 的两个 external binding token 按固定 Git/byte 算法解析。
- 规则证据基线仍为提交 `418b2fdb1c68578fa279fe915307efb802402247`，其唯一父提交是 E；该提交不是本设计的 current HEAD。

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

```text
Linux capture step:
name=Capture D2 Linux domain-core-rest evidence
id=d2-linux-domain-core-rest-capture
job=jobs.test-shard
condition=matrix.group == 'domain-core-rest'

Linux upload step:
name=Upload D2 Linux domain-core-rest evidence
id=d2-linux-domain-core-rest-upload
job=jobs.test-shard
condition=matrix.group == 'domain-core-rest'

Windows execution step:
name=D2 Windows domain-core-rest evidence
id=d2-windows-domain-core-rest-run
job=jobs.deterministic-windows

Windows capture step:
name=Capture D2 Windows domain-core-rest evidence
id=d2-windows-domain-core-rest-capture
job=jobs.deterministic-windows

Windows upload step:
name=Upload D2 Windows domain-core-rest evidence
id=d2-windows-domain-core-rest-upload
job=jobs.deterministic-windows
```

这些 ID 是 §18 mechanism location 的封闭 locator；不得换名、复用或增加第二组 step。

## 11. 单一临时 verifier、JSON 与失败发行合同

唯一允许的新脚本：

`scripts/verify-p2f1r-d2-publication-evidence.mjs`

约束：

- 只能使用 Node 标准库。
- 如需 Git，只能使用 `spawn`/`spawnSync` 且 `shell:false`。
- 不得联网，不得 import 生产代码，不得修改 profile、测试、catalog 或 runner。
- 除 mode 声明的临时文件或最终 `--output` 外不得写仓库。
- verifier 只有 `self-test`、`capture-runner`、`audit-bundle` 三种 mode；未知 mode、重复 CLI option、缺 option、额外 positional argument 均失败。

`capture-runner` 输入固定为：

```text
--platform linux|windows
--source-head <Sha40>
--parent-artifact-head <P>
--parent-evidence-head <E>
--runner-output <path>
--output <path>
```

`audit-bundle` 输入固定为：

```text
--source-head <H>
--parent-artifact-head <P>
--parent-evidence-head <E>
--acquisition-root <absolute-temporary-path>
--design-contract docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md
--output docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json
```

成功 stdout 恰为一行：

```text
D2_CAPTURE_OK <platform> <H> <capture-sha256>
```

或：

```text
D2_PUBLICATION_BUNDLE_OK <H> <run-id> <bundle-sha256>
```

失败合同：

- schema/semantic failure exit 1；internal/tool failure exit 2；stdout 为空；stderr 第一 token 是稳定错误码。
- `MechanismMatch` 的治理 enum 恰为 `PASS|FAIL`，大小写敏感；`MATCH`、未知值、错误大小写和缺失均失败。
- 成功 final bundle 中 D-C16A/B 的 `MechanismMatch` 必须都为 `PASS`。
- 任一机制为 `FAIL` 时，`audit-bundle` 必须失败且不得发行 final bundle、不得发行任何 Actual record、不得留下 success-looking 文件。
- `audit-bundle` 的 `--output` 在调用前必须不存在；已存在即失败且不得修改。实现先在同目录创建唯一临时文件，完全验证并 close/fsync 后原子 rename；任一失败删除临时文件。禁止部分写入、失败 JSON、用旧成功文件遮蔽失败或覆盖既有文件。

所有 D2 自有 JSON 使用唯一 canonical serialization：

1. UTF-8、无 BOM、LF、文件末尾恰一个 `\n`。
2. 对按本节 schema 顺序构造的对象执行 `JSON.stringify(value, null, 2) + "\n"`。
3. 所有 object key 顺序必须与 schema 列表完全相同；禁止 integer-like key。
4. array 必须 dense，并使用 schema 指定顺序；禁止 hole。
5. 禁止 `null`、optional key、`undefined`、NaN、Infinity、负零、lone surrogate 和非 NFC string。
6. JSON number 只能是本节允许范围内的 safe integer。
7. 在 `JSON.parse` 前用同一脚本内的无依赖 scanner 拒绝任意深度 duplicate JSON key；parse 后递归拒绝额外 key。
8. verifier 对 capture、acquisition manifest 和 final bundle 重新 canonical serialize；输入 bytes 不完全相等即失败。

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

## 13. `d2-capture.json` 完整递归 exact schema

下列 notation 是规范，不是示例：`object[k:T,...]` 表示 required、non-null、无额外 key 且 key order 正是列出顺序；`tuple[A,B]` 表示长度和顺序固定；`const(x)` 表示 byte-for-byte 字符串或精确 JSON literal；`enum(a|b)` 表示大小写敏感；所有未声明值均非法。

基础类型：

```text
Sha40       = string /^[0-9a-f]{40}$/
Sha256      = string /^[0-9a-f]{64}$/
DecId       = string /^(?:[1-9][0-9]{0,19})$/ 且数值 <= 18446744073709551615
SafeUInt    = JSON integer 0..9007199254740991
PositiveInt = JSON integer 1..9007199254740991
UInt32      = JSON integer 0..4294967295
UnixMs      = JSON integer 0..9007199254740991
UtcTime     = string `YYYY-MM-DDTHH:mm:ss.sssZ`，必须可解析且 round-trip 相同
HttpsUrl    = 有效 absolute HTTPS URL string，1..2048 UTF-8 bytes，无 fragment/userinfo
RelPath     = NFC POSIX relative path，1..512 UTF-8 bytes；非绝对、无空/`.`/`..` segment、无 `\`、NUL、控制字符
Printable   = NFC string，1..512 UTF-8 bytes，只含 U+0020..U+007E
Platform    = enum(linux|windows)
```

`d2-capture.json` 的 schema 恰为：

```text
Capture = object[
  schemaVersion: const("2B20B-P2F1R-D2-capture-v1"),
  criterionComponent: const("D-C16A"),
  platform: Platform,
  sourceHead: Sha40,
  parentArtifactHead: const("0bf487afc49069f6191dd7409362d5c227aa50dc"),
  parentEvidenceHead: const("15b7e61682d3b34e45401cf132fa1a77b6347c22"),
  settledBaselineHead: const("8898f62ceb90433634cf02e83ad5d4ff95db4499"),
  ruleEvidenceHead: const("418b2fdb1c68578fa279fe915307efb802402247"),
  acceptedProfileSourceHead: const("4d576e205cb20c37ba913b923a1cd39e8d800d18"),
  github: CaptureGithub,
  runner: CaptureRunner,
  toolchain: CaptureToolchain,
  invocation: CaptureInvocation,
  ancestry: CaptureAncestry,
  result: CaptureResult,
  runnerOutput: CaptureRunnerOutput,
  captureVerdict: const("D2_CAPTURE_VALID")
]

CaptureGithub = object[
  workflowName: const("CI"),
  eventName: const("push"),
  runId: DecId,
  runAttempt: PositiveInt,
  githubSha: Sha40,
  workflowJobId: enum(test-shard|deterministic-windows)
]

CaptureRunner = object[
  os: enum(Linux|Windows),
  arch: const("X64"),
  imageOs: Printable,
  imageVersion: Printable
]

CaptureToolchain = object[
  nodeVersion: const("v24.15.0"),
  pnpmVersion: const("11.7.0"),
  vitestVersion: const("3.2.6")
]

CaptureInvocation = object[
  commandArgv: tuple[
    const("node"),
    const("scripts/run-vitest-logical-group.mjs"),
    const("run"),
    const("--mode"),
    const("ordinary"),
    const("--logical-group-id"),
    const("domain-core-rest")
  ],
  mode: const("ordinary"),
  logicalGroupId: const("domain-core-rest")
]

CaptureAncestry = object[
  checkoutHead: Sha40,
  repositoryIsShallow: const(false),
  sourceObjectReadable: const(true),
  parentArtifactObjectReadable: const(true),
  parentEvidenceObjectReadable: const(true),
  settledBaselineObjectReadable: const(true),
  ruleEvidenceObjectReadable: const(true),
  acceptedProfileSourceObjectReadable: const(true),
  parentArtifactIsAncestorOfSource: const(true),
  parentEvidenceIsAncestorOfSource: const(true),
  settledBaselineIsAncestorOfSource: const(true),
  ruleEvidenceIsAncestorOfSource: const(true),
  acceptedProfileSourceIsReachable: const(true),
  evidenceParentEqualsArtifact: const(true),
  artifactParentEqualsSettled: const(true)
]

CaptureResult = object[
  startedAtUnixMs: UnixMs,
  endedAtUnixMs: UnixMs,
  processExitCode: const(0),
  selectedIdentityCount: const(503),
  selectedIdentitySha256: Sha256,
  failedCount: const(0),
  skippedCount: const(0),
  todoCount: const(0),
  globalErrorCount: const(0),
  manifestRelativePath: const("logical-manifest.json"),
  manifestSha256: Sha256,
  verificationRelativePath: const("verification.json"),
  verificationReportSha256: Sha256
]

CaptureRunnerOutput = object[
  relativeRoot: const("runner-output"),
  fileCount: PositiveInt,
  byteLength: SafeUInt,
  canonicalTreeSha256: Sha256
]
```

递归语义：

- `platform=linux` iff `workflowJobId=test-shard` and `runner.os=Linux`。
- `platform=windows` iff `workflowJobId=deterministic-windows` and `runner.os=Windows`。
- `sourceHead=github.githubSha=ancestry.checkoutHead`。
- `endedAtUnixMs >= startedAtUnixMs`。
- 两个平台的 `selectedIdentitySha256` 必须相等。
- manifest 和 verification 必须位于 runner-output root 的固定相对路径、为普通文件，且经现有 runner 自身 exact verifier 成功；D2 不重新定义 runner 内部 schema。
- `runner-output/**` 是不经换行、mtime 或权限规范化的完整复制；tree hash 使用 §14 算法。
- artifact root 只能包含顶层 `d2-capture.json` 和 `runner-output/`；其他顶层条目失败。
- `selectedIdentitySha256 = SHA256(UTF8(JSON.stringify(logical-manifest.json.selectedIdentities) + "\n"))`；该 array 必须先通过现有 logical runner verifier，保持其已冻结 ordinal 顺序，不再排序或规范化。
- `manifestSha256` 与 `verificationReportSha256` 分别是两个固定文件的原始 bytes SHA-256。
- `startedAtUnixMs` 是所有 `segment-evidence/*.json.process.startedAtUnixMs` 的最小值；`endedAtUnixMs` 是最大值；`processExitCode=0` 表示所有 segment process exitCode=0 且 logical manifest `mergeEligibility=true`、verification `result=PASS`。
- `failedCount/skippedCount/todoCount/globalErrorCount` 分别是所有已由 runner verifier 验证的 segment task/global records 的精确和；四者必须为 0。不得从 stdout 文本推断。

## 14. 公共 run、artifact、log 与 acquisition manifest exact schema

只能接受一个冻结 H 的 `push` workflow run：workflow name=`CI`、event=`push`、head SHA=`H`、status=`completed`、conclusion=`success`；Linux 和 Windows 必须来自相同 `runId + runAttempt`，两个 job 均成功。不得混用 attempt、PR merge ref、不同 run 或不同 H。

acquisition root 恰为：

```text
acquisition-manifest.json
api/run.json
api/jobs/linux.json
api/jobs/windows.json
api/artifacts.json
downloads/artifacts/linux.zip
downloads/artifacts/windows.zip
downloads/logs/linux.bin
downloads/logs/windows.bin
artifacts/linux/d2-capture.json
artifacts/linux/runner-output/**
artifacts/windows/d2-capture.json
artifacts/windows/runner-output/**
```

GitHub `api/*.json` 和下载 blob 是 T1 provider payload/opaque bytes，不是 D2-issued schema；verifier 只通过封闭 JSON Pointer allowlist 读取 required provider fields，拒绝 required field 缺失/类型错误，但不会将 provider 的扩展字段复制入 D2 output。D2 自有 `acquisition-manifest.json` 必须符合：

```text
AcquisitionManifest = object[
  schemaVersion: const("2B20B-P2F1R-D2-acquisition-v1"),
  sourceHead: Sha40,
  acquiredAtUtc: UtcTime,
  workflowApi: ApiBlob,
  jobApis: tuple[LinuxJobApi, WindowsJobApi],
  artifactsApi: ArtifactsApi,
  artifactArchives: tuple[LinuxArchive, WindowsArchive],
  artifactTrees: tuple[LinuxTree, WindowsTree],
  jobLogs: tuple[LinuxLogBlob, WindowsLogBlob]
]

ApiBlob = object[
  recordId: const("api-workflow"),
  relativePath: const("api/run.json"),
  sourceUrl: HttpsUrl,
  byteLength: PositiveInt,
  sha256: Sha256
]

LinuxJobApi = object[
  recordId: const("api-job-linux"),
  jobRef: const("job-linux"),
  relativePath: const("api/jobs/linux.json"),
  sourceUrl: HttpsUrl,
  byteLength: PositiveInt,
  sha256: Sha256
]

WindowsJobApi = LinuxJobApi with exact substitutions:
  recordId="api-job-windows"; jobRef="job-windows";
  relativePath="api/jobs/windows.json"

ArtifactsApi = object[
  recordId: const("api-artifacts"),
  relativePath: const("api/artifacts.json"),
  sourceUrl: HttpsUrl,
  byteLength: PositiveInt,
  sha256: Sha256
]

LinuxArchive = object[
  recordId: const("archive-linux"),
  jobRef: const("job-linux"),
  relativePath: const("downloads/artifacts/linux.zip"),
  sourceUrl: HttpsUrl,
  byteLength: PositiveInt,
  sha256: Sha256
]

WindowsArchive = LinuxArchive with exact substitutions:
  recordId="archive-windows"; jobRef="job-windows";
  relativePath="downloads/artifacts/windows.zip"

LinuxTree = object[
  recordId: const("tree-linux"),
  archiveRef: const("archive-linux"),
  relativeRoot: const("artifacts/linux"),
  fileCount: PositiveInt,
  byteLength: SafeUInt,
  canonicalTreeSha256: Sha256
]

WindowsTree = LinuxTree with exact substitutions:
  recordId="tree-windows"; archiveRef="archive-windows";
  relativeRoot="artifacts/windows"

LinuxLogBlob = object[
  recordId: const("log-download-linux"),
  jobRef: const("job-linux"),
  relativePath: const("downloads/logs/linux.bin"),
  sourceUrl: HttpsUrl,
  byteLength: PositiveInt,
  sha256: Sha256
]

WindowsLogBlob = LinuxLogBlob with exact substitutions:
  recordId="log-download-windows"; jobRef="job-windows";
  relativePath="downloads/logs/windows.bin"
```

`with exact substitutions` 只允许列出的 constant value 替换；key、key order、type 和 cardinality 不变。

Canonical artifact tree hash：递归枚举普通文件；拒绝 symlink、junction、设备文件、绝对/回退路径及 Unicode-normalized 或大小写碰撞；相对路径转 POSIX 并按 UTF-8 bytes 排序；每个文件依次输入 `pathLength:uint32be || pathUtf8 || 0x00 || fileLength:uint64be || sha256(fileBytes)`；最终 SHA-256 不使用 ZIP 元数据、mtime、权限或枚举顺序。原始 job-log bytes 不规范化换行或编码。

所有 `recordId` 全局唯一；所有 `jobRef/archiveRef` 必须恰解析一次。manifest 自报 hash 必须与实际 bytes/tree 重算值一致。

GitHub provider allowlist 必须从该 raw response 取得恰好两个目标 artifact 的 `id/name/size_in_bytes/expired/expires_at/archive_download_url`；要求 `expired=false`、名称与 H 精确匹配、无同名重复。final Bundle 的 artifact metadata 必须来自该 API 并与 archive download URL/bytes/tree 交叉验证。

## 15. E2 final bundle 完整递归 exact schema

唯一持久化证据包路径保持：

`docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json`

采用 §13 notation 和 §11 canonical bytes。完整 schema：

```text
Bundle = object[
  schemaVersion: const("2B20B-P2F1R-D2-publication-evidence-v1"),
  sourceHead: Sha40,
  parentArtifactHead: const("0bf487afc49069f6191dd7409362d5c227aa50dc"),
  parentEvidenceHead: const("15b7e61682d3b34e45401cf132fa1a77b6347c22"),
  workflow: Workflow,
  ancestry: BundleAncestry,
  jobs: tuple[LinuxJob, WindowsJob],
  artifacts: tuple[LinuxArtifact, WindowsArtifact],
  logs: tuple[LinuxLog, WindowsLog],
  retention: Retention,
  catalogReconciliation: CatalogReconciliation,
  designExpectedBindings: tuple[D16Expected, D16AExpected, D16BExpected],
  actualBindings: tuple[D16AActual, D16BActual],
  d3Handoff: D3Handoff,
  finalStructuralVerdict: const("D2_PUBLICATION_EVIDENCE_BUNDLE_VALID")
]

Workflow = object[
  recordId: const("workflow-ci-push"),
  workflowName: const("CI"),
  event: const("push"),
  runId: DecId,
  runAttempt: PositiveInt,
  headSha: Sha40,
  status: const("completed"),
  conclusion: const("success"),
  htmlUrl: HttpsUrl,
  createdAtUtc: UtcTime,
  updatedAtUtc: UtcTime
]

BundleAncestry = object[
  recordId: const("ancestry-proof"),
  settledBaselineHead: const("8898f62ceb90433634cf02e83ad5d4ff95db4499"),
  ruleEvidenceHead: const("418b2fdb1c68578fa279fe915307efb802402247"),
  acceptedProfileSourceHead: const("4d576e205cb20c37ba913b923a1cd39e8d800d18"),
  components: tuple[LinuxAncestry, WindowsAncestry]
]

AncestryComponent = object[
  recordId: enum(ancestry-linux|ancestry-windows),
  jobRef: enum(job-linux|job-windows),
  platform: Platform,
  checkoutHead: Sha40,
  githubSha: Sha40,
  repositoryIsShallow: const(false),
  sourceObjectReadable: const(true),
  parentArtifactObjectReadable: const(true),
  parentEvidenceObjectReadable: const(true),
  settledBaselineObjectReadable: const(true),
  ruleEvidenceObjectReadable: const(true),
  acceptedProfileSourceObjectReadable: const(true),
  parentArtifactIsAncestorOfSource: const(true),
  parentEvidenceIsAncestorOfSource: const(true),
  settledBaselineIsAncestorOfSource: const(true),
  ruleEvidenceIsAncestorOfSource: const(true),
  acceptedProfileSourceIsReachable: const(true),
  evidenceParentEqualsArtifact: const(true),
  artifactParentEqualsSettled: const(true)
]
LinuxAncestry = AncestryComponent with recordId="ancestry-linux", jobRef="job-linux", platform="linux".
WindowsAncestry = AncestryComponent with recordId="ancestry-windows", jobRef="job-windows", platform="windows".

Job = object[
  recordId: enum(job-linux|job-windows),
  workflowRef: const("workflow-ci-push"),
  workflowJobId: enum(test-shard|deterministic-windows),
  jobDisplayName: Printable,
  jobDatabaseId: DecId,
  platform: Platform,
  runnerOs: enum(Linux|Windows),
  runnerArch: const("X64"),
  imageOs: Printable,
  imageVersion: Printable,
  nodeVersion: const("v24.15.0"),
  pnpmVersion: const("11.7.0"),
  vitestVersion: const("3.2.6"),
  commandArgv: tuple[const("node"),const("scripts/run-vitest-logical-group.mjs"),const("run"),const("--mode"),const("ordinary"),const("--logical-group-id"),const("domain-core-rest")],
  startedAtUtc: UtcTime,
  completedAtUtc: UtcTime,
  processStartedAtUnixMs: UnixMs,
  processEndedAtUnixMs: UnixMs,
  conclusion: const("success"),
  processExitCode: const(0),
  logicalGroupId: const("domain-core-rest"),
  mode: const("ordinary"),
  selectedIdentityCount: const(503),
  selectedIdentitySha256: Sha256,
  failedCount: const(0),
  skippedCount: const(0),
  todoCount: const(0),
  globalErrorCount: const(0),
  manifestSha256: Sha256,
  verificationReportSha256: Sha256,
  captureSha256: Sha256,
  artifactRef: enum(artifact-linux|artifact-windows),
  logRef: enum(log-linux|log-windows)
]

LinuxJob = Job with exact constants:
  recordId="job-linux"; workflowJobId="test-shard";
  jobDisplayName="test shard (domain-core-rest)"; platform="linux";
  runnerOs="Linux"; artifactRef="artifact-linux"; logRef="log-linux".

WindowsJob = Job with exact constants:
  recordId="job-windows"; workflowJobId="deterministic-windows";
  jobDisplayName="deterministic setup/assignment/knowledge/projections/tasks/system-info/role-actions/philosopher-choice/snake-charmer/evil-twin/witch/dreamer/clockmaker";
  platform="windows"; runnerOs="Windows";
  artifactRef="artifact-windows"; logRef="log-windows".

Artifact = object[
  recordId: enum(artifact-linux|artifact-windows),
  jobRef: enum(job-linux|job-windows),
  artifactId: DecId,
  name: Printable,
  sourceHead: Sha40,
  retentionDays: const(7),
  expiresAtUtc: UtcTime,
  sizeInBytes: PositiveInt,
  downloadedFileCount: PositiveInt,
  downloadedTreeSha256: Sha256,
  captureFileSha256: Sha256
]

LinuxArtifact = Artifact with exact constants:
  recordId="artifact-linux"; jobRef="job-linux";
  name="d2-linux-domain-core-rest-" + Bundle.sourceHead.
WindowsArtifact = Artifact with exact constants:
  recordId="artifact-windows"; jobRef="job-windows";
  name="d2-windows-domain-core-rest-" + Bundle.sourceHead.

Log = object[
  recordId: enum(log-linux|log-windows),
  jobRef: enum(job-linux|job-windows),
  jobDatabaseId: DecId,
  downloadUrl: HttpsUrl,
  byteLength: PositiveInt,
  downloadedBlobSha256: Sha256
]
LinuxLog = Log with recordId="log-linux", jobRef="job-linux".
WindowsLog = Log with recordId="log-windows", jobRef="job-windows".

Retention = object[
  policy: const("GITHUB_ACTIONS_ARTIFACT_RETENTION"),
  retentionDays: const(7),
  hostedAvailability: const("EXPIRES_AFTER_RETENTION"),
  historicalBinding: const("HASH_REMAINS_AFTER_EXPIRY")
]

CatalogReconciliation = object[
  recordId: const("catalog-support"),
  path: const("docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md"),
  blobOid: const("4f9a376e56f19b241d76ce2a75be83b70859ae25"),
  rawLength: const(264855),
  rawSha256: const("e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6"),
  lfCount: const(626),
  windowsCheckoutLength: const(265481),
  windowsCheckoutSha256: const("7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7"),
  classification: const("LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY"),
  runtimeAuthority: const(false)
]

ExpectedBinding = object[
  CriterionId: enum(D-C16|D-C16A|D-C16B),
  RuleClaim: Printable,
  CompletionCriterion: Printable,
  RequiredEvidenceMechanism: Printable,
  ExpectedReachability: const("R4_FUTURE_HYPOTHETICAL_STATE"),
  ExpectedTrust: const("T1_EXTERNAL_OR_PERSISTED_BOUNDARY"),
  ExpectedPrimaryLayer: enum(NONE|CROSS_PLATFORM_CI|STRUCTURAL_VALIDATION),
  ExpectedResult: Printable,
  SupportingAuthorityRequirement: const("NONE")
]
D16Expected/D16AExpected/D16BExpected 的九个值必须分别与 §18 三张 corrected normative row byte-for-byte 相同；不得自由文本变体。

ActualBinding = object[
  CriterionId: enum(D-C16A|D-C16B),
  ActualTestFile: RelPath,
  ActualTestTitle: Printable,
  ActualPrimaryLayer: enum(CROSS_PLATFORM_CI|STRUCTURAL_VALIDATION),
  ActualReachability: const("R4_FUTURE_HYPOTHETICAL_STATE"),
  ActualTrust: const("T1_EXTERNAL_OR_PERSISTED_BOUNDARY"),
  SupportingAuthorityId: const("NONE"),
  MechanismMatch: enum(PASS|FAIL)
]
D16AActual/D16BActual 的 exact values 与 §18 相同；成功 Bundle 语义额外要求两者 `MechanismMatch=PASS`。D-C16 Actual 非法。

D3Handoff = object[
  recordId: const("d3-handoff"),
  designAuthorityPath: const("docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md"),
  designAuthorityCommit: Sha40,
  designAuthorityBlobSha256: Sha256,
  sourceHeadRef: const("source-head"),
  parentArtifactHeadRef: const("parent-artifact-head"),
  parentEvidenceHeadRef: const("parent-evidence-head"),
  workflowRef: const("workflow-ci-push"),
  jobRefs: tuple[const("job-linux"),const("job-windows")],
  artifactRefs: tuple[const("artifact-linux"),const("artifact-windows")],
  logRefs: tuple[const("log-linux"),const("log-windows")],
  bundleRef: const("d2-final-bundle"),
  archiveCategories: tuple[const("E2_FINAL_EVIDENCE_BUNDLE"),const("H_SOURCE_STATUS_RECORD"),const("FINAL_CODE_REVIEW_VERBATIM"),const("FINAL_RULE_REVIEW_VERBATIM")],
  deleteAfterD3Categories: tuple[const("TEMPORARY_VERIFIER"),const("D2_WORKFLOW_STEPS_AND_CHECKOUT_DELTAS"),const("TEMPORARY_D2_BRANCH"),const("LOCAL_DOWNLOADED_ARTIFACTS"),const("RAW_JOB_LOGS"),const("TEMPORARY_WORKTREES"),const("ACQUISITION_ROOT_AND_MANIFEST"),const("SELF_TEST_NEGATIVE_FIXTURES")],
  keepOperationalAssetCount: const(0),
  cleanupRequired: const(true)
]
```

```text
source-head             -> JSON Pointer /sourceHead
parent-artifact-head    -> JSON Pointer /parentArtifactHead
parent-evidence-head    -> JSON Pointer /parentEvidenceHead
workflow-ci-push        -> /workflow/recordId
job-linux               -> /jobs/0/recordId
job-windows             -> /jobs/1/recordId
artifact-linux          -> /artifacts/0/recordId
artifact-windows        -> /artifacts/1/recordId
log-linux               -> /logs/0/recordId
log-windows             -> /logs/1/recordId
d2-final-bundle         -> document root /
```

每个 reference literal 只能按此表解析一次；top-level scalar/root tokens 是显式合法 target，不要求额外 `recordId`。任何其他 target、duplicate 或 dangling ref 失败。

递归 cross-field/ref 合同：

- `Bundle.sourceHead=workflow.headSha=jobs[*] capture sourceHead=artifacts[*].sourceHead`。
- workflow `runId/runAttempt` 与两个 capture 及 provider API 相同。
- 所有 record ID 全局唯一；每个 ref 恰解析一次；禁止 duplicate、dangling 或 cross-platform ref。
- Linux ancestry/job/artifact/log/capture 只能互引 Linux；Windows 同理。
- job `jobDatabaseId` 必须等于对应 log `jobDatabaseId` 和 provider job ID。
- artifact `captureFileSha256` 必须等于提取的 `d2-capture.json` bytes SHA；tree SHA/size/count 必须等于重算值。
- 两 job 的 selected identity SHA 相同；各字段与其 capture/runner manifest 完全一致。
- 时间必须 `created <= job started <= job completed <= workflow updated`，process end >= process start，artifact expiry 晚于 workflow completion。
- `designAuthorityCommit` 由 §29 external algorithm 解析；该 commit 上目标 path 的 blob bytes SHA 必须等于 `designAuthorityBlobSha256`，且 H 上同 path 内容相同。
- object key、array order、cardinality、nullability、enum、range、canonical bytes 和 no-extra 递归适用于所有层级。

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

`audit-bundle` 内部必须有且只有 `runSelfTestMode`、`runCaptureRunnerMode`、`runAuditBundleMode` 三个 mode entry；D-C16 校验函数位置固定为 `validateD16A` 和 `validateD16B`；成功写入位置固定为 `issueFinalBundleAtomically`。函数可在同一脚本中分解纯 helper，但不得产生第二 verifier 或第二发行路径。

`validateD16A` 和 `validateD16B` 任一失败，内部机制结果为 `FAIL`，立即停止且不构造 `actualBindings`。只有两者都成功时，`issueFinalBundleAtomically` 一次性构造两条 `PASS` Actual 并发行整个 Bundle。成功 Bundle 含 `FAIL`、`MATCH` 或缺 Actual 必须被 verifier 自身 reread 拒绝。

## 18. Governance V1.1 与 exact Actual mechanism mapping

D-C16 仍是 grouping-only，不得拥有 Actual、primary identity 或 SUP ledger。其九字段 row 恰为：

```text
CriterionId=D-C16
RuleClaim=D2 public publication evidence grouping
CompletionCriterion=D-C16A and D-C16B both PASS for the same sourceHead
RequiredEvidenceMechanism=GROUPING_ONLY
ExpectedReachability=R4_FUTURE_HYPOTHETICAL_STATE
ExpectedTrust=T1_EXTERNAL_OR_PERSISTED_BOUNDARY
ExpectedPrimaryLayer=NONE
ExpectedResult=Both child criteria PASS atomically; no third primary
SupportingAuthorityRequirement=NONE
```

D-C16A 九字段 row 恰为：

```text
CriterionId=D-C16A
RuleClaim=One exact-H push run supplies Linux and Windows ordinary domain-core-rest publication evidence
CompletionCriterion=One successful runId/runAttempt binds exact H, two required jobs, two captures, two artifacts, two raw job logs, complete ancestry, and identical 503-test identity SHA
RequiredEvidenceMechanism=CROSS_PLATFORM_CI
ExpectedReachability=R4_FUTURE_HYPOTHETICAL_STATE
ExpectedTrust=T1_EXTERNAL_OR_PERSISTED_BOUNDARY
ExpectedPrimaryLayer=CROSS_PLATFORM_CI
ExpectedResult=The same successful push run proves both platform components without stale, partial, cross-swapped, or mixed-attempt evidence
SupportingAuthorityRequirement=NONE
```

D-C16B 九字段 row 恰为：

```text
CriterionId=D-C16B
RuleClaim=One offline T1 verifier validates and atomically issues the closed recursive D2 publication evidence bundle
CompletionCriterion=The verifier accepts exact canonical capture, acquisition, Git/API/artifact/log bindings, recursive schema, reference graph, expected/actual mappings, catalog support facts, and D3 handoff, then atomically writes one bundle
RequiredEvidenceMechanism=STRUCTURAL_VALIDATION
ExpectedReachability=R4_FUTURE_HYPOTHETICAL_STATE
ExpectedTrust=T1_EXTERNAL_OR_PERSISTED_BOUNDARY
ExpectedPrimaryLayer=STRUCTURAL_VALIDATION
ExpectedResult=One canonical bundle is issued only after all checks PASS; every malformed or failed input leaves no bundle and no Actual record
SupportingAuthorityRequirement=NONE
```

成功 Bundle 的两条 Actual 必须按 D-C16A、D-C16B 排序并精确为：

```text
D-C16A
CriterionId=D-C16A
ActualTestFile=.github/workflows/ci.yml
ActualTestTitle=D-C16A GitHub push run <workflow.runId>/<workflow.runAttempt> at <sourceHead>: linux+windows domain-core-rest 503/503
ActualPrimaryLayer=CROSS_PLATFORM_CI
ActualReachability=R4_FUTURE_HYPOTHETICAL_STATE
ActualTrust=T1_EXTERNAL_OR_PERSISTED_BOUNDARY
SupportingAuthorityId=NONE
MechanismMatch=PASS
```

其中 angle expression 必须用当前 Bundle 对应值替换，不得保留 `<`/`>`。

```text
D-C16B
CriterionId=D-C16B
ActualTestFile=scripts/verify-p2f1r-d2-publication-evidence.mjs
ActualTestTitle=D-C16B audit-bundle at <sourceHead>: 2B20B-P2F1R-D2-publication-evidence-v1
ActualPrimaryLayer=STRUCTURAL_VALIDATION
ActualReachability=R4_FUTURE_HYPOTHETICAL_STATE
ActualTrust=T1_EXTERNAL_OR_PERSISTED_BOUNDARY
SupportingAuthorityId=NONE
MechanismMatch=PASS
```

同样必须替换 `<sourceHead>`。`MechanismMatch` base enum 是 `PASS|FAIL`；final success Bundle 只允许 PASS。`MATCH` 永远非法。D-C16 Actual、重复 A/B、A/B cross-swap、新 `SUP-*` 或第三 Actual 均非法。

Exact mechanism locations：

| Criterion | Main assertion | Formal entry | Fault mechanism |
|---|---|---|---|
| D-C16A | `scripts/verify-p2f1r-d2-publication-evidence.mjs::validateD16A` 对 Bundle `/workflow`、`/ancestry`、`/jobs/0..1`、`/artifacts/0..1`、`/logs/0..1` 与两 capture 的 same-H/same-run/503/identity/hash/ref conjunction | `.github/workflows/ci.yml::on.push -> jobs.test-shard(matrix.group=domain-core-rest).steps[id=d2-linux-domain-core-rest-capture] + jobs.deterministic-windows.steps[id=d2-windows-domain-core-rest-run,d2-windows-domain-core-rest-capture]` | `scripts/verify-p2f1r-d2-publication-evidence.mjs::runSelfTestMode::N1,N2,N3,N4,N5` 及 N6/N7 中适用于 D-C16A subtree 的 table rows |
| D-C16B | `scripts/verify-p2f1r-d2-publication-evidence.mjs::validateD16B` 完成 recursive schema/canonical/ref/actual/catalog/D3 checks，并由 `issueFinalBundleAtomically` 一次发行 | `node scripts/verify-p2f1r-d2-publication-evidence.mjs audit-bundle` 的唯一 `runAuditBundleMode` entry | `scripts/verify-p2f1r-d2-publication-evidence.mjs::runSelfTestMode::N1..N7`，尤其 N6/N7 的全递归 mutation table |

这些 locator 是 §15 八字段 Actual 的规范性解释，不新增 JSON key、不建立新 ledger。缺 locator、实现位置改名、主 assertion 不匹配、formal entry 不匹配或 fault table 不覆盖均使 `MechanismMatch=FAIL`，并触发 §11 无发行行为。

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
- verifier self-test 通过 §21 恰好七个负面类别的全部 table-generated rows；逐层覆盖 capture、acquisition manifest、final Bundle、A/B Actual 和 ref graph。
- verifier 对两个正例执行 canonical reread：唯一正确 A/B Actual 被接受；external design commit/path/blob 解析一致；不得接受 parent evidence head、stale materialization marker 或 content/path mismatch。
- H status 文档只记录设计期望和实际本地 gate 结果，不记录未来 hosted 事实。
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm test:coverage`
- fresh local Code Review 完整通过。
- fresh local Rule Review 完整通过。
- H 提交后 worktree clean。
- H 一旦进入评审即冻结；任何提交都使评审失效。
- static audit 确认 `MechanismMatch` 代码 enum 只有 PASS/FAIL，发行路径只写 PASS，任何 FAIL 不产生 output。
- static audit 确认 `validateD16A`、`validateD16B`、`issueFinalBundleAtomically` 及 §18 step IDs/locations 唯一存在。

## 21. 七类 table-driven 负面合同

负面治理计数仍恰为七个类别 N1–N7；每一类别由一个 table 定义多个单点 mutation row。row 数不产生新行为类别，也不得拆成第八类。每个 row 从同一 canonical positive fixture clone，仅应用一个 mutation，验证固定错误 token、无 output、无残留 temp file。

| Category | Table-generated mutation domain | Required token |
|---|---|---|
| N1 | 对 capture、workflow、job、artifact 或 Actual title 中每个 source-head leaf 单独替换错误 Sha40；包括把 external design commit 错绑为 parent evidence head | `D2_SOURCE_HEAD_MISMATCH` |
| N2 | 分别删除 Linux/Windows required job、capture、artifact 或 log；令 jobs/artifacts/logs/ancestry cardinality 为 0/1/3；重复 D-C16A 或 D-C16B Actual；加入 D-C16 Actual | `D2_REQUIRED_JOB_MISSING` 或 cardinality 子码 `D2_CARDINALITY_INVALID` |
| N3 | 分别只改 archive SHA、tree SHA、capture SHA、manifest SHA、verification SHA、log SHA 或 acquisition blob SHA | `D2_ARTIFACT_SHA_MISMATCH` |
| N4 | 单独交换任意 Linux/Windows platform、jobRef、artifactRef、logRef、workflowJobId、display name、capture、Actual A/B identity；包括 duplicate record ID 与 dangling/cross-platform ref | `D2_PLATFORM_JOB_MAPPING_MISMATCH` |
| N5 | 单独令 shallow=true、required object readable=false、required ancestor=false、parent equality=false、checkout/GITHUB SHA 不同或 required commit object unavailable | `D2_ANCESTRY_UNPROVABLE` |
| N6 | 对 §13–§15 每个 object 的每个 required key 做 deletion；对每个 scalar 做 wrong JSON type；对每个 enum/const/range做 invalid value/case；对每个 tuple 做 wrong cardinality/order；注入 duplicate JSON key、duplicate record ID、dangling ref；对每个 Actual 的 file/title/layer/R/T/SUP/mechanism 值及 §18 locator 做 missing/mismatch；测试 successful Bundle 含 FAIL、MATCH、unknown、wrong-case 或 missing MechanismMatch；测试 §29 external resolution 的 stale parent/pending-materialization/stale-action/content/path mismatch | `D2_BUNDLE_REQUIRED_FIELD_MISSING`，或更具体的 `D2_TYPE_INVALID` / `D2_ENUM_INVALID` / `D2_CARDINALITY_INVALID` / `D2_ORDER_INVALID` / `D2_DUPLICATE_ID` / `D2_DANGLING_REF` / `D2_ACTUAL_BINDING_INVALID` |
| N7 | 对 Capture、其每个 nested object、AcquisitionManifest、其每个 nested object、Bundle 及其每个 nested object 分别添加一个 unknown key；对 fixed artifact root 添加未知顶层 entry | `D2_BUNDLE_UNEXPECTED_FIELD` |

分类优先级固定为：duplicate-key scanner → unexpected/missing/key-order → type/null/range/enum → tuple cardinality/order → duplicate ID/ref graph/cross-swap → hash → ancestry → criterion semantics。一个 mutation 只期待该优先级下的一个 token。

Positive table 必须恰有：一个 Linux Capture、一个 Windows Capture、一个 AcquisitionManifest、一个成功 Bundle；成功 Bundle 恰有 A/B 两 Actual 且值与 §18 唯一匹配。禁止 fuzz framework、第二 verifier、第二 schema 文件或新增 Vitest 文件。

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

在 acquisition 后、发行前，`audit-bundle` 必须先解析 §29 external tokens：

```text
EXTERNAL_DESIGN_COMMIT = git log -1 --format=%H <H> -- <designPath>
EXTERNAL_DESIGN_BLOB_SHA256 = SHA256(raw bytes from git show EXTERNAL_DESIGN_COMMIT:<designPath>)
```

要求 commit 是 H 的祖先、不是 `418b2f...`、其 path blob 与 H 上同 path blob byte-identical；结果只写入 future Bundle 的 `d3Handoff.designAuthorityCommit/designAuthorityBlobSha256`，不回写设计文件。解析失败不发行。

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

将任何“fresh review”理解为 correction commit exact HEAD 的全新 review，旧 `87c5df6...` 的 `RULE_DESIGN_FIX_REQUIRED` 不可复用。不得在 fresh rereview 前实施、运行 workflow、CI、push 或 PR。

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
- negative categories：恰为 7；table-generated mutation rows：按完整递归 schema 派生，不计为新类别
- final JSON bundle：恰为 1

修复预算：

- `DesignCorrection=1/1`
- `ImplementationRepair=0/2`
- 禁止第三次设计修正或第三次实现修复。
- 不采用旧 D2 的机械 LOC ceiling；边界由文件、行为类别和资产数量控制。
- DesignCorrection 预算已耗尽；fresh rereview 再发现任何实质设计缺陷即 HUMAN_BLOCKED，不得创建 correction 2。

## 29. 当前交接报告与 external authority binding

本文件已经物化，禁止在其正文写入承载本文件的 commit SHA 或本文件自身 digest。两个 token 是规范性 external binding 名称，不是 pending placeholder：

```text
EXTERNAL_DESIGN_COMMIT := git log -1 --format=%H <reviewed-or-source-head> -- docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md
EXTERNAL_DESIGN_BLOB_SHA256 := SHA256(raw blob bytes at EXTERNAL_DESIGN_COMMIT:docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md)
```

独立 reviewer 必须在其外部报告中记录解析出的实际 40-hex commit 和 64-hex SHA-256，并验证 reviewed HEAD 上该 path 的 blob bytes 完全相同。不得把规则证据提交 `418b2f...`、父提交、工作树文件、不同 path 或内容不一致 blob 当作本设计 binding。

```text
authorization=READ_ONLY_ARCHITECT_DESIGN_CORRECTION_ONLY
designMaterializationStatus=COMPLETE
designAuthorityBinding=EXTERNAL_GIT_COMMIT_AND_RAW_BLOB_SHA256
designCommitBindingToken=EXTERNAL_DESIGN_COMMIT
designBlobSHA256BindingToken=EXTERNAL_DESIGN_BLOB_SHA256
designPath=docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md
authorityStatus=CURRENT_AND_COMPLETE_D2_DESIGN_AUTHORITY
designCorrection=1/1
ruleEvidence=docs/rules/evidence/2B20B-P2F1R-D2.md
ruleEvidenceSHA256=671827090c071cc1062dd9c2199da09dd27f983b24f80855bc976d9d0eeb6505
ruleEvidenceHead=418b2fdb1c68578fa279fe915307efb802402247
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
D2Scope=EXACT_ANCESTRY+WINDOWS_DOMAIN_CORE_REST+LINUX_WINDOWS_EVIDENCE_UPLOAD
linuxJobId=test-shard
windowsJobId=deterministic-windows
windowsDomainCoreEvidence=DESIGNED_NOT_EXECUTED
captureSchema=2B20B-P2F1R-D2-capture-v1
acquisitionSchema=2B20B-P2F1R-D2-acquisition-v1
bundleSchema=2B20B-P2F1R-D2-publication-evidence-v1
recursiveSchemaStatus=CLOSED_EXACT_NO_EXTRA
t1Verifier=ONE_TEMPORARY_SCRIPT_THREE_MODES
mechanismMatchEnum=PASS|FAIL
successBundleMechanismMatch=PASS_FOR_BOTH_ACTUALS
failedIssuanceBehavior=NO_BUNDLE_NO_ACTUAL_NO_SUCCESS_LOOKING_OUTPUT
negativeCategoryCount=7
negativeExecution=TABLE_DRIVEN_RECURSIVE_SINGLE_MUTATION
workflowFilesModified=1
newWorkflowCount=0
newJobCount=0
newMatrixCount=0
D-C16Disposition=GROUPING_ONLY_NO_ACTUAL_BINDING
d-C16APrimary=CROSS_PLATFORM_CI
d-C16BPrimary=STRUCTURAL_VALIDATION
supportingAuthorityLedger=NONE
reviewSequence=LOCAL_CODE_LOCAL_RULE_FREEZE_H_PUSH_CI_ACQUIRE_AUDIT_E2_FINAL_CODE_FINAL_RULE_D3_HANDOFF
d3CleanupRequired=true
keepOperationalAssets=0
archiveCategories=4
deleteAfterD3Categories=8
permanentProductionFiles=0
permanentTestFiles=0
permanentOperationalConceptsAfterD3=0
temporaryVerifierMax=1
implementationAllowlistCountH=3
implementationAllowlistCountE2=1
designCorrectionBudget=1/1
implementationRepairBudget=0/2
productImpact=false
eventSchemaImpact=false
testIdentityImpact=false
profileImpact=false
selectorImpact=false
ownershipImpact=false
routingImpact=false
coverageImpact=false
priorDesignReviewHead=87c5df6f732ec2c87c110e6f4fbe555e7ef7a617
priorDesignVerdict=RULE_DESIGN_FIX_REQUIRED
priorDesignFindingsClosedByThisCorrection=[D2-FRESH-DR-F01_GOVERNANCE_MECHANISM_MATCH_ENUM,D2-FRESH-DR-F02_RECURSIVE_BUNDLE_SCHEMA_NOT_CLOSED,D2-FRESH-DR-F03_STALE_CURRENT_AUTHORITY_HANDOFF,D2-FRESH-DR-F04_ACTUAL_MECHANISM_TRACEABILITY_UNFROZEN]
remainingDesignBlockers=[]
remainingDesignGate=FRESH_INDEPENDENT_RULE_DESIGN_REREVIEW_REQUIRED
implementationAuthorized=false
architectFilesChanged=0
architectCommitCreated=false
coverageExecuted=false
hostedCIExecuted=false
pushPerformed=false
pullRequestCreated=false
d3DesignedOrStarted=false
requiredNextAction=FRESH_INDEPENDENT_RULE_DESIGN_REREVIEW
```

当前只授权 sole writer 将本 Correction 1/1 物化为同文件的 docs-only direct descendant；物化完成后唯一允许动作是 fresh independent rule-design rereview。不得实施 H、修改 workflow/verifier、运行 hosted CI、push 或创建 PR。
