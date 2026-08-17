# 2B20B-P2F1R-D2W Canonical Checkout Byte Portability Governance v1

## 1. Governance identity

```text
sliceId=2B20B-P2F1R-D2W
documentKind=CANONICAL_CHECKOUT_BYTE_PORTABILITY_GOVERNANCE
governanceBaseline=4f53f6c357d4de5566cc24bfe32d2fcdc09d2e2e
oldUnacceptedD2Head=0fc4288c9b0e22787eee3e2c87d7b0c54e432769
ruleEvidencePath=docs/rules/evidence/2B20B-P2F1R-D2W.md
ruleEvidenceSha256=f26ee4656c3431536a6a67dfcdf0e420e26bffaacca9b0994b738b26626e0d2b
ruleVerdict=RULE_READY
governanceVerdict=GO
remainingBlockers=[]
```

本文件只决定 D2W 的 canonical-checkout byte-portability 治理边界。它不是 D2W 实现设计，不授权修改 D2、D3、Hosted evidence、coverage 或旧 H，也不接受 `0fc4288`。

## 2. Authority and prerequisites

本轮已按项目治理顺序读取：

- 根 `AGENTS.md`；
- `project-handoff/00-README-FIRST.md` 指定的 handoff authority；
- `docs/agent-loop/AUTOPILOT_PROMPT.md`；
- `docs/agent-loop/REVIEW_PROTOCOL.md`；
- current task/state/status authority；
- `docs/rules/USER_OVERRIDES.md`；
- `docs/rules/ROLE_COVERAGE_MATRIX.md`；
- D2W rule evidence；
- D2 rule evidence及 current final design；
- D0 Catalog portability governance、design、evidence和测试；
- D1 ownership contracts；
- D1.5R profile artifact、registry和 authority consolidation；
- D1.5E evidence bundle；
- D2 old H diff及完整 blocker `D2-H-CR-002`。

D2W rule evidence在基线 `4f53f6c` 上的 SHA-256 为：

```text
f26ee4656c3431536a6a67dfcdf0e420e26bffaacca9b0994b738b26626e0d2b
```

rule-research verdict 是 `RULE_READY`。`involvedRoles=[]`，四项 role-impact flag 均为 `false`，不存在需要架构解释的规则冲突。D2W 不修改 role coverage matrix。

D2 的 current design authority仍是：

```text
docs/architecture/2B20B-P2F1R-D2-minimal-exact-head-publication-evidence-final-design-v1.md
```

其 design HEAD `075000fc181ee50a110157f4ce62f89972323c77` 是 `4f53f6c` 的祖先。旧 H `0fc4288` 不是本治理基线的祖先且从未被接受。

## 3. Problem statement

`D2-H-CR-002` 已证明旧 H 在标准 Git for Windows checkout 下不可执行：

- classification：`BLOCKER`
- severity：`P1`
- affected criteria：`R4`、`T1`
- dependency：existing deterministic-windows exact-H capture
- failure：

```text
BASELINE_MANIFEST_INVALID: canonical bytes mismatch
```

`run-vitest-logical-group.mjs::verifyD15Baseline` 从工作树读取：

```text
docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5-routing-baseline-manifest.json
```

并对 `jsonBytes(d15BaselineManifest(), true)` 做原始 `Buffer.equals`。基线没有 `.gitattributes`，该文件的 Git attribute 为 `text/eol unspecified`。其 blob 是 3208 bytes、118 LF；`core.autocrlf=true` checkout 是 3326 bytes、118 CRLF。验证在任何 503 runtime output、capture或upload形成前失败，因此 D-C16A 不可达。

当前 workflow使用 `actions/checkout@v5`，没有 repository-specific EOL override。旧 H 的 Windows run/capture/upload不能通过改变本地机器设置来获得可复核的仓库级保证。

## 4. Existing repository EOL governance

基线 `4f53f6c`：

```text
.gitattributes=ABSENT
.editorconfig=ABSENT
```

`.editorconfig` 即使存在也只约束支持它的编辑器，不参与 Git checkout filter，不足以建立 canonical checkout byte contract。因此本治理不得以 `.editorconfig` 代替 `.gitattributes`。

仓库目前已有两种不同且均已冻结的 byte authority：

1. D0 Catalog V2：Git blob是审计 authority；工作树只提供诊断分类，Windows CRLF checkout已被明确接受。
2. Routing baseline与D1.5R standalone profile：当前运行时 verifier直接读取工作树并要求 canonical serialization的原始字节相等。

这不是允许任意多重 authority。它表明 portability contract必须按已冻结的 artifact role精确划界，不能用全仓统一 LF 覆盖 D0。

## 5. Complete byte-contract inventory

| Path/Pattern | Artifact Role | Git Blob Canonical? | Worktree Canonical? | Expected EOL | Raw SHA Used? | Consumer | Current Windows Behavior | Required Contract |
|---|---|---:|---:|---|---:|---|---|---|
| `/.gitattributes` | Repository checkout policy | N/A，基线不存在 | 语义文件，不要求自身成为产品 artifact | 任意可解析；本轮候选内容以 LF author | No | Git checkout machinery | ABSENT | 新增最小、路径限定的 repository contract |
| `/.editorconfig` | Editor hint | No | No | N/A | No | Supporting editors | ABSENT | 不新增为 EOL authority；不得替代 Git attributes |
| `/docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5-routing-baseline-manifest.json` | Runner frozen baseline manifest | Yes | **Yes** | LF | Yes，且直接 `Buffer.equals` canonical JSON | `run-vitest-logical-group.mjs::verifyD15Baseline`、runner self-test、D2 exact Windows dependency | 3208/LF blob变成3326/118 CRLF；SHA变为 `d568b5f96ee4c591095df28c2cdd2713f7048b071f9ca25091eff41ee4c80503`；exit 22 | Exact path `text eol=lf` |
| `/docs/implementation/coverage-profiles/*.json` | D1.5R standalone full profile authority | Yes | **Yes** | LF | Yes，canonical serialization及embedded profile SHA | `verify-coverage-obligations.mjs::validateProfileArtifactBytes`、registry resolution | 当前唯一profile由3160/102 LF变成3262/102 CRLF；SHA变为 `73c4299a81a24d1f28e2f0f54e6b61e835f0c5bc822698b6bb44b6a15e677dc1` | Narrow directory pattern `text eol=lf` |
| `scripts/coverage-profile-registry.mjs` | Metadata-only profile registry module | Blob保留源码，但不是profile artifact authority | No；模块语义是authority | Source-semantic | No raw source SHA authority | Node module import；profile selector/metadata lookup | 11704/322 LF变成12026/322 CRLF；模块仍可解析 | 不匹配；不得把registry升级成第二份full profile authority |
| `docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5e-evidence-bundle.json` | 已接受D1.5E repository evidence | Yes，historical Git/object audit | No current runtime worktree authority | Blob LF；worktree diagnostic | Yes，evidence SHA | Historical exact-E/offline Git-object audit | 39515/364 LF变成39879/364 CRLF | 不匹配；保持既有Git-object authority |
| `docs/architecture/2B20B-P2F1R-C1-generated-structural-schema-catalog-v2.md` | Catalog V2 audit artifact | **Yes，sole D0 authority** | **No，diagnostic only** | Blob LF；Windows CRLF允许 | Yes | D0 catalog test通过 `git rev-parse`/raw blob读取；D2记录冻结Catalog事实 | 264855/626 LF、SHA `e0f788db370eca7ad1d1097f2a271bd9257fb5966d28081c930458d3dea85ef6` 变成265481/626 CRLF、SHA `7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7` | **明确不匹配**；继续执行D0 `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY` |
| D1 ownership accepted candidate output，临时路径由 verifier创建 | Generated immutable accepted ownership artifact；不是tracked manifest | N/A | Generated bytes是authority | Generator emits LF | Yes：391257 bytes、SHA `d8ae2d1f76958460173daaf84663b0c680c8dead7c052b446c2fcd037eab9129` | `vitest-ownership-contracts.mjs`、`verify-vitest-ownership-contracts.mjs` | 由Node生成，不经checkout转换 | 不新增attribute；继续对generated/persisted temp bytes做exact compare |
| Coverage maps、reports、blob copies、logical manifests、verification、segment evidence及diagnostics | Generated runtime artifacts | N/A | Generated bytes是当前run authority | 各generator冻结格式 | Yes | `collect-vitest-shard-diagnostics.mjs`、`verify-vitest-coverage-groups.mjs`、Windows application verifier、runner | 不属于tracked checkout输入 | 不新增attribute；保持generator和atomic-write contract |
| `scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs` 读取的TypeScript sources | Static syntax/AST contract input | Source blob retained | No raw byte authority | Source-semantic | No raw source SHA contract | TypeScript parser | CRLF仍解析为相同语法 | 不匹配 |
| `scripts/vitest-ownership-contracts.mjs` 读取的workflow、traceability及test sources | Structural marker/ownership input | Source blob retained | No raw canonical checkout authority | Text-semantic | Generated outputs使用raw SHA | Parser、regex和inventory builder | CRLF由消费者的text parsing处理 | 不匹配 |
| `scripts/run-vitest-logical-group.mjs` 本身 | Runtime implementation source | Source blob retained | No source-byte authority | Source-semantic | Runtime outputs用SHA；自身不作为canonical data artifact | Node | 97542/1879 LF变成99421/1879 CRLF，self-test在manifest修复后仍通过 | 不匹配 |
| `scripts/verify-coverage-obligations.mjs` 本身 | Coverage verifier source | Source blob retained | No source-byte authority | Source-semantic | Yes for artifacts, not verifier source | Node | 71463/1565 LF变成73028/1565 CRLF，仍可执行 | 不匹配 |
| `scripts/verify-vitest-ownership-contracts.mjs` | Ownership verifier source | Source blob retained | No source-byte authority | Source-semantic | Yes for generated candidate/output | Node | CRLF source仍可执行 | 不匹配 |
| `scripts/verify-vitest-windows-application-groups.mjs` | Generated Windows report verifier | Source blob retained | No source-byte authority | Source-semantic | Yes for generated reports | Node | CRLF source仍可执行 | 不匹配 |
| H-only `scripts/verify-p2f1r-d2-publication-evidence.mjs` | D2 capture/acquisition/final bundle verifier | Old H不被接受 | Generated input/output bytes canonical | UTF-8 LF | Yes | D2 future audit command | 旧 H 在它可获得503输入前已被routing manifest阻断 | 不从旧 H 搬运；D2重启后按current design独立materialize |
| `/docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json` | Future tracked D2 final evidence bundle | Future blob必须canonical | **Yes**，D2 verifier要求input bytes等于recursive canonical serialization | UTF-8 LF | Yes | Future D2 verifier、independent review、offline audit | 基线尚不存在；若不预声明，未来Windows checkout会重复同类风险 | 预声明exact future path `text eol=lf` |
| D2 `d2-capture.json`、`logical-manifest.json`、`verification.json`、acquisition files及provider downloads | Future generated D2 evidence inputs | N/A unless later committed | Generated bytes/opaque provider bytes按D2 design验证 | D2-owned JSON为LF；provider blobs opaque | Yes | Future D2 verifier | 当前失败发生在这些文件形成前；没有可接受的“失败manifest”替代503 evidence | 不通过checkout属性修改runtime/provider bytes |
| `.github/workflows/ci.yml` | Workflow orchestration | Source blob retained | No source-byte authority | YAML semantic | No raw workflow SHA for D2 validity | GitHub Actions | Checkout无EOL override；D2 H Windows step受manifest失败阻断 | 不加checkout override，不加`dos2unix` |
| Git/EOL governance docs和tests | Governance evidence | Git history retained | Text semantic，除Catalog外 | Mixed allowed by existing Git policy | D0 test对Catalog blob使用raw SHA | D0 governance/design/test；D2W future docs/review | Windows CRLF不改变Markdown语义 | 不做全仓LF迁移 |

## 6. Raw-byte consumer audit

基线 `4f53f6c` 下，`scripts/*.mjs` 中包含 raw file read、SHA、byte equality或其组合的完整文件集合为：

1. `scripts/collect-vitest-shard-diagnostics.mjs`
2. `scripts/run-vitest-logical-group.mjs`
3. `scripts/verify-coverage-obligations.mjs`
4. `scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs`
5. `scripts/verify-vitest-coverage-groups.mjs`
6. `scripts/verify-vitest-ownership-contracts.mjs`
7. `scripts/verify-vitest-windows-application-groups.mjs`
8. `scripts/vitest-ownership-contracts.mjs`

旧 H 另有：

9. `scripts/verify-p2f1r-d2-publication-evidence.mjs`

审计结论：

- 只有routing baseline manifest和standalone coverage profile是“tracked checkout input + current runtime canonical byte equality”的现存集合。
- D0 Catalog故意从Git blob读取，不属于该集合。
- D1 ownership accepted artifact和多数coverage/logical artifacts是运行时生成物，不属于checkout policy。
- registry、workflow、TypeScript/JavaScript source由semantic parser或module loader读取，不以工作树原始SHA为authority。
- Future D2 final bundle是已冻结的canonical tracked JSON path，应在首次materialize前获得同一精确checkout contract。

## 7. Empirical clean-checkout audit

所有实验均在隔离临时克隆中进行；未修改共享仓库、global Git config或persistent repository config。

### 7.1 Baseline with `core.autocrlf=false`

```text
routing manifest:
  bytes=3208
  sha256=1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12
  LF=118
  CRLF=0

standalone profile:
  bytes=3160
  sha256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
  LF=102
  CRLF=0

runner self-test:
  PASS 40/40
```

### 7.2 Baseline with `core.autocrlf=true`

```text
routing manifest:
  bytes=3326
  sha256=d568b5f96ee4c591095df28c2cdd2713f7048b071f9ca25091eff41ee4c80503
  LF=0
  CRLF=118

standalone profile:
  bytes=3262
  sha256=73c4299a81a24d1f28e2f0f54e6b61e835f0c5bc822698b6bb44b6a15e677dc1
  LF=0
  CRLF=102

runner self-test:
  exit=22
  BASELINE_MANIFEST_INVALID: canonical bytes mismatch
```

### 7.3 Candidate repository contract under `core.autocrlf=true`

被实测的候选属性恰为：

```gitattributes
/docs/implementation/phase-3-slice-2b20b-p2f1r-d1-5-routing-baseline-manifest.json text eol=lf
/docs/implementation/coverage-profiles/*.json text eol=lf
/docs/implementation/phase-3-slice-2b20b-p2f1r-d2-publication-evidence-bundle.json text eol=lf
```

重新checkout受影响的现存tracked files后：

```text
routing manifest:
  attr/text eol=lf
  bytes=3208
  sha256=1b2f2269b804c653afd966bfb30535b5951be2293259dec6c15990c42013cf12
  LF=118
  CRLF=0

standalone profile:
  attr/text eol=lf
  bytes=3160
  sha256=2c84662b2fdf9ac368eae3e08a2eda51bcb5f45c78790bfd0bec7cbc236ae567
  LF=102
  CRLF=0

runner self-test:
  PASS 40/40
```

Catalog path仍为：

```text
text=unspecified
eol=unspecified
bytes=265481
sha256=7d912c085c61ab34d06c46d0cbfd5f3def8e10465339d608566a73eaf93763b7
CRLF=626
```

因此候选contract修复了D2 dependency，同时没有改变D0 Windows classification。

对两个现存匹配文件执行renormalization audit没有产生staged content diff；唯一candidate diff是新增 `.gitattributes`。

## 8. Alternatives

### A. Minimal repository `.gitattributes` EOL contract

这是唯一接受的治理方向。

Authority statement：

> 对本文件列出的worktree-canonical artifact class，repository-declared `.gitattributes` contract是唯一checkout portability authority。Git blob保存canonical LF bytes；工作树是该blob经repository contract形成的受约束projection，不是第二份authority。

优点：

- checkout行为由仓库声明，不依赖用户机器或runner image配置；
- 保持现有runtime verifier的worktree byte equality；
- 不引入Git subprocess作为产品运行时依赖；
- 不改变canonical serializers；
- 不改变现有blob；
- 精确避开Catalog；
- 在standard Windows checkout下已经实测通过；
- future D2 bundle在materialize前即获得确定性边界。

### B. Make Git blob the runtime authority

拒绝用于routing manifest和standalone profile。

理由：

- runner和coverage verifier当前明确验证persisted worktree artifact bytes；
- 改成 `git show`、`git cat-file` 或其他object lookup会改变D1.5R和runner runtime boundary；
- 会为普通本地验证引入Git executable、repository state和object availability依赖；
- 会让修改后的工作树artifact被忽略，弱化当前fail-closed contract；
- D0已经采用此模型，但D0的artifact role和消费者不同，不能机械推广；
- 旧 H 的三路径repair scope已经耗尽，不能把该变化伪装成H内修补。

### C. Local normalization

拒绝。

包括但不限于：

- 设置global或local `core.autocrlf`；
- workflow中执行 `dos2unix`；
- verifier读取前替换 `\r\n`；
- checkout后重写文件；
- editor-specific保存规则；
- 用平台条件跳过byte equality。

这些方案会让仓库本身无法声明和复现输入字节，并可能掩盖非EOL mutation。

## 9. D0 compatibility

D0的冻结决定保持不变：

```text
catalogAuthority=GIT_BLOB
catalogWorktreeRole=DIAGNOSTIC_ONLY
acceptedWindowsClassification=LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY
```

候选属性不使用：

```gitattributes
* text=auto eol=lf
*.json text eol=lf
*.md text eol=lf
*.mjs text eol=lf
```

Catalog精确路径不匹配任何候选pattern。实测 Windows worktree仍为265481 bytes、626 CRLF，D0 test所需raw blob仍为264855 bytes及原SHA。因此D2W不是对D0 authority的改写。

## 10. Exact scope and affected count

### Required repository change

下一设计只能考虑新增根 `.gitattributes`，内容必须保持为第7.3节的三个精确规则，或经独立review证明语义完全等价且不扩大匹配集合的形式。

### Existing tracked matches

```text
existingTrackedMatchedPaths=2
```

分别是：

1. routing baseline manifest exact path；
2. 当前唯一standalone profile JSON。

### Future declared path

```text
futureDeclaredMatchedPaths=1
```

即D2 final publication evidence bundle exact path。

### New policy file

```text
newPolicyFiles=1
```

### Existing content renormalization

```text
renormalizationRequired=false
renormalizedExistingFileCount=0
expectedExistingArtifactContentDiffCount=0
```

两个existing targets的index blob已经是LF canonical bytes。实现review必须运行renormalization audit；若出现任何existing content diff，立即停止，不能把它作为“EOL cleanup”提交。

## 11. Required verifier and workflow effects

```text
existingVerifierLogicChangesRequired=0
workflowCheckoutOverridesRequired=0
ciNormalizationStepsRequired=0
```

不得修改：

- `run-vitest-logical-group.mjs::verifyD15Baseline`；
- `verify-coverage-obligations.mjs::validateProfileArtifactBytes`；
- ownership verifier byte contracts；
- D0 Catalog blob reader或classification；
- checkout action EOL配置；
- workflow中的文件内容；
- D2 H run/capture/upload；
- D2 verifier。

Repository attributes本身应使standard checkout产生既有verifier要求的字节。若后续设计需要修改上述任何consumer来使测试通过，说明治理假设失效，必须返回governance review。

## 12. Product, test and authority impacts

```text
domainBehaviorChange=false
ruleTruthChange=false
eventShapeChange=false
runtimePayloadShapeChange=false
eventOrderingChange=false
eventSourcingChange=false
replayChange=false
atomicBatchChange=false
prospectiveValidationChange=false
retryBoundaryChange=false
historicalKnowledgeChange=false
projectionChange=false
roleCoverageChange=false
coverageThresholdChange=false
coverageProfileIdentityChange=false
coverageProfileSemanticChange=false
coverageRegistrySemanticChange=false
coverageSelectorChange=false
ownershipIdentityChange=false
physicalTestFileSetChange=false
logicalGroupTopologyChange=false
catalogBlobChange=false
catalogAuthorityChange=false
catalogWindowsClassificationChange=false
```

standalone profile在Windows工作树中的表示会从CRLF变成其已经登记的canonical LF bytes；其Git blob、profile ID、source head、embedded hash、registry metadata和selector均不变。这是checkout portability修复，不是profile authority迁移。

## 13. Required acceptance evidence for the next design

下一步若进入D2W design，至少必须要求：

1. 在基线 `4f53f6c` 或其明确允许的D2W descendant上验证exact attribute match set。
2. fresh `core.autocrlf=false` checkout：
   - routing manifest为3208 bytes及冻结SHA；
   - profile为3160 bytes及冻结SHA；
   - runner self-test `PASS 40/40`。
3. fresh `core.autocrlf=true` checkout：
   - 两个existing targets仍为LF及冻结SHA；
   - runner self-test `PASS 40/40`；
   - profile contract audit通过。
4. Catalog仍为D0接受的Windows CRLF classification，blob SHA不变。
5. `git add --renormalize` 对existing targets产生零content diff。
6. `.gitattributes`没有命中Catalog、source files、workflow、Markdown docs、D1.5E bundle或generated temp outputs。
7. Linux routing/topology/ancestry/protected baseline保持不变。
8. ownership accepted artifact保持391257 bytes及冻结SHA。
9. no coverage run；D2W不得改变coverage profile或threshold。
10. worktree clean，且只包含经reviewed design允许的D2W文件。

D2的503 identities、fixed-root capture/upload及D-C16A仍是后续D2 regression，不属于D2W governance或本轮验证。不得用D2W的GO声称D2已经通过。

## 14. CI and documentation boundary

本治理不要求workflow mutation。repository attributes会被普通 `actions/checkout` 自动应用。未来D2 Windows exact command必须继续在没有local normalization或checkout override的条件下运行，以证明repository contract本身充分。

D2W后续允许的documentation范围仅能记录：

- governance authority；
- reviewed D2W design；
- implementation status；
- independent design/code/rule review；
- required agent-loop progress记录。

不得在本治理轮materialize design、修改AUTOPILOT状态、提交、push、创建PR或运行Hosted jobs。

GitHub-hosted runner是每个job新建的VM，`windows-latest`映射可能随runner image迁移；因此机器默认设置不能替代仓库contract。[GitHub-hosted runners reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)及[official runner-images repository](https://github.com/actions/runner-images)是环境事实的外部来源，当前仓库checkout实现见[official actions/checkout repository](https://github.com/actions/checkout)。

## 15. Rollback

若D2W实现尚未被D2或其他新artifact依赖，rollback应只撤销D2W commit中新加的 `.gitattributes` 和对应D2W文档，不改写历史、不修改global config、不重写existing artifact blobs。

若D2已经基于该contract形成证据，不得单独移除属性。此时必须先停止D2并重新建立其input byte authority；否则rollback会重新引入已知Windows failure。

## 16. Stop conditions

出现任一情况必须停止，不能由architect猜测：

- D2W rule evidence不再是 `RULE_READY`；
- exact match set超过本文件列出的2个existing paths和1个future path；
- Catalog被任何属性规则命中；
- renormalization产生existing artifact content diff；
- `core.autocrlf=true` checkout仍不能恢复冻结SHA；
- 修复需要global/local Git config、`dos2unix`或read-time normalization；
- 修复需要改变runner、coverage verifier、profile authority、registry或workflow；
- 实现试图直接复用或接受旧 H；
- 需要修改D2/D3/Hosted evidence/coverage；
- worktree污染无法与D2W隔离；
- Git object、required source或independent review不可用。

## 17. Governance conclusion

```text
selectedOption=A_MINIMAL_REPOSITORY_GITATTRIBUTES_EOL_CONTRACT
rejectedOptionB=GIT_BLOB_AS_RUNTIME_AUTHORITY_FOR_SCOPED_WORKTREE_ARTIFACTS
rejectedOptionC=LOCAL_OR_CI_NORMALIZATION
canonicalCheckoutAuthority=REPOSITORY_DECLARED_PATH_SCOPED_GIT_ATTRIBUTES
catalogAuthorityPreserved=GIT_BLOB
d0Compatible=true
existingTrackedMatchedPaths=2
futureDeclaredMatchedPaths=1
renormalizedExistingFileCount=0
governanceVerdict=GO
remainingBlockers=[]
nextAuthorizedStage=D2W_READ_ONLY_DESIGN
d2ImplementationAuthorized=false
oldHAccepted=false
```

`GO` 只表示治理问题已经得到唯一、可实测且与D0兼容的边界，下一步可以进入一次独立的D2W read-only design。此文件不包含也不替代该设计。

---

单列结果：

```text
governanceVerdict=GO
remainingBlockers=[]
downstreamD2Status=BLOCKED_PENDING_D2W_DESIGN_IMPLEMENTATION_AND_REVIEW
oldHStatus=UNACCEPTED
```
