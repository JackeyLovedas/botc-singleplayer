reviewedPR: LOCAL_ONLY_NO_PR

reviewedHead: 030b935862a477a7ac3a66f59933a16c27e1cbf9

reviewTimestamp: 2026-08-03T14:18:09+08:00

reviewScope:

- 完整审查 `01ba8260e720921023dabcbb815fc3ee01aaea90..34c60205cecad2c4c7885531f4f8805ef1355478` 的 5-file implementation diff。
- 完整审查 `34c60205cecad2c4c7885531f4f8805ef1355478..030b935862a477a7ac3a66f59933a16c27e1cbf9` 的 3-doc evidence-child diff。
- 核对 E 是 H 的直接 docs-only child；E 与 H 的 `packages` tree、validator/Catalog test blob、static verifier/self-test blob完全一致。
- 审查 CE governance、rule evidence、Design、Design Review、Traceability、local status、dual-worktree manifest。
- 审查受影响测试、静态审计脚本、自测脚本及其依赖的 C production contracts。
- 核对外部证据目录中的 4 个 JSON、18 个日志及全部记录的 SHA-256。
- 核对 default/LF worktree 均为 exact H、clean，且各八项门禁均以 exit code 0 完成。
- 核对 protected old worktree 仍为 `7fc337325f274c669a356a30c7485e2fdf134643`、11/11 dirty paths、11/11 SHA-256 全部保持。
- 未修改文件、未提交、未推送、未运行正式仓库门禁；只执行了只读静态审计验证。

productionFilesReviewed:

- `packages/domain-core/src/canonical-domain-event.ts`
- `packages/domain-core/src/domain-event-structural-validator.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/domain-event-structural-schema-ast.ts`
- `packages/domain-core/src/canonical-runtime-value.ts`
- `packages/domain-core/src/canonical-runtime-hash.ts`
- C production frozen hashes分别保持：
  - `41020fbbc0cc23194c565c2b0ace5ce907942e86204e8373b29449a94b07a5b3`
  - `a7d7cd0294c877317ba35957f957859fda586c459aeec40a361fb8853d1531e6`
  - `ac142d2c83a77c73aae244dc2bd3d6da9e7f01ca923fff4d22139ed10c024353`
- `01ba826..H` 和 `H..E` 均无 production、A、B、C1、event definition、semantic validator、Catalog、workflow、coverage或ownership改动。

testFilesReviewed:

- `packages/domain-core/src/domain-event-structural-validator.test.ts`
- `packages/domain-core/src/domain-event-structural-schema-catalog.test.ts`
- `scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs`
- `scripts/verify-p2f1r-c-static-diagnostic-bindings.test.mjs`
- `docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md`
- default/LF focused、domain-core、typecheck、lint、full ordinary日志。

ruleEvidenceReviewed:

- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20B-P2F1R-CE.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- [官方 BOTC Wiki Main Page oldid 3035](https://wiki.bloodontheclocktower.com/index.php?title=Main_Page&oldid=3035)
- 用户指定中文 Wiki `oldid=5855`：以 browser-compatible header 独立读取成功，HTTP 200、UTF-8 7071 bytes。
- [官方 nightsheet](https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json)
- CE不改变角色、夜间顺序、能力、事件语义、醉酒/中毒、Vortox、角色变化、阵营变化或说书人裁量；角色覆盖不变。

findings:

1. `CE-FINAL-CODE-F01_STATIC_AUDIT_ACCEPTS_DEAD_DECOY_RETURN`

   - classification: `BLOCKER`
   - severity: `HIGH`
   - basis: 冻结设计违反（A）及虚假测试/证据声明（G）。
   - file/symbol:
     - `scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs:107-112`
       `branchMatches`
     - `scripts/verify-p2f1r-c-static-diagnostic-bindings.mjs:277`
       `invalidReturn: 0`
     - `scripts/verify-p2f1r-c-static-diagnostic-bindings.test.mjs`
   - failureScenario: verifier只要求一个目标 AST node 的规范化全文包含若干字符串，并未证明预期 return 是目标 guard 的实际控制流结果。将真实 F18 分支改成：
     ```ts
     if (match === undefined) {
       if (false) {
         return failure(F18, discriminatorPath(current.discriminatorOrdinal));
       }
       return failure(F19, discriminatorPath(current.discriminatorOrdinal));
     }
     ```
     后，审计仍返回 `mapped=16`。因此不可达的正确文本可掩盖实际错误返回。
   - observedEvidence: 独立只读 in-memory mutant 验证得到：
     `{"mutant":"F18_GHOST_RETURN","accepted":true,"mapped":16}`。
   - impact: C-C15d并未证明设计要求的 exact branch/return/no-fallthrough；`invalidReturn=0`、`16/16 exact`、`MechanismMatch=PASS`及两套静态审计日志均建立在可绕过机制上。
   - requiredCorrection:
     - 通过 AST 结构直接验证 guard 条件、直接 consequent、实际 `ReturnStatement`/assignment及调用参数；
     - 拒绝嵌套或不可达 decoy、同一 branch 中的额外返回、错误实际返回和 fallthrough；
     - `invalidReturn`等计数必须来自真实分析结果，不得固定返回零。
   - requiredRegressionTests:
     - 不可达正确 return + 实际错误 return；
     - 嵌套 decoy return；
     - 同一 guard 内正确调用存在但未被返回；
     - 正确文本位于错误子分支；
     - 实际 fallthrough但存在不可达正确 return。
   - disposition: `OPEN`

2. `CE-FINAL-CODE-F02_AP1_IDENTITY_IS_HAND_AUTHORED_NOT_COLLECTED`

   - classification: `BLOCKER`
   - severity: `HIGH`
   - basis: 冻结设计违反（A）及虚假身份权威声明（G）。
   - file/symbol:
     - `packages/domain-core/src/domain-event-structural-validator.test.ts:1942-1966`
       `collectedTitles` / `inventory`
     - `docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md`
       AP1 metadata
   - failureScenario: 当前测试用源码 regex 提取 `it("...")` 标题，然后手工为每项拼入固定的 project、file和ancestor path。它没有使用设计冻结的 public Vitest lifecycle/candidate-list inventory，也没有调用 `canonicalizeRawVitestInventory`、`canonicalizeStructuredVitestIdentities`、`structuredInventoryBytes`或`structuredInventorySha256`。
   - impact: 测试被移动到不同 suite ancestor、由实际 Vitest 以不同 identity 收集、或 canonical repository path/project发生偏差时，手工拼装的 hash仍可能保持原值。记录的 `ap1CollectedVitestInventorySha256`并非“收集得到的 AP1 inventory”。
   - requiredCorrection:
     - 从现有 public Vitest lifecycle 或已批准 candidate-list inventory取得真实 collected identities；
     - 使用 `scripts/vitest-ownership-contracts.mjs` 中冻结的 canonicalization与hash工具；
     - 对 project、canonical file、ancestor path、title、缺失、重复、意外和歧义身份进行真实校验。
   - requiredRegressionTests:
     - suite ancestor改变但title不变时必须失败；
     - project/file不匹配必须失败；
     - duplicate、missing、unexpected identity必须失败；
     - collected inventory与手工源码title集合不一致必须失败。
   - disposition: `OPEN`

3. `CE-FINAL-CODE-F03_TRACEABILITY_MECHANISM_MATCH_IS_SELF_ATTESTED`

   - classification: `BLOCKER`
   - severity: `HIGH`
   - basis: 冻结设计违反（A）及虚假MechanismMatch/符号有效性声明（G）。
   - file/symbol:
     - `packages/domain-core/src/domain-event-structural-validator.test.ts:1900-1980`
       C-C15a traceability parser
     - `docs/implementation/phase-3-slice-2b20b-p2f1r-c-test-traceability.md:26,46-86`
   - failureScenario: C-C15a只验证19列、`MechanismMatch`字符串为`PASS`、SUP为`NONE`、标题存在和物理身份唯一。它没有：
     - 比较 ExpectedReachability 与 ActualReachability；
     - 比较 ExpectedTrust 与 ActualTrust；
     - 比较 ExpectedPrimaryLayer 与 ActualPrimaryLayer；
     - 解析并验证 `ProductionEntry` 中的声明级真实符号；
     - 证明ActualTest实际满足CompletionCriterion与RequiredEvidenceMechanism。
   - impact: 将任一 active row 的 ActualPrimaryLayer、ActualTrust、ActualReachability或ProductionEntry改为错误值，同时保留`PASS`，当前测试仍可通过。文档中的`invalidPrimarySymbolCount=0`和`mechanismMatch=28/28 PASS`不是由现有审计机制证明的。
   - requiredCorrection:
     - 对33/5/28表实施真正的语义审计；
     - 对每一 active row校验Expected/Actual R/T/Primary一致性；
     - 通过 declaration-scoped AST或等价可靠机制验证ProductionEntry；
     - 将ActualTest绑定到真实收集的AP1身份或已批准static primary；
     - 只有真实机制满足CompletionCriterion时才允许`MechanismMatch=PASS`。
   - requiredRegressionTests:
     - 错误ActualPrimaryLayer、ActualTrust、ActualReachability各自必须失败；
     - 不存在或错误declaration的ProductionEntry必须失败；
     - `MechanismMatch=PASS`但所需机制缺失必须失败；
     - duplicate/borrowed/missing primary及错误static/Vitest primary类型必须失败。
   - disposition: `OPEN`

verifiedNonBlockers:

- E是H的直接子提交，E仅修改3个允许的文档。
- H/E `packages` tree均为
  `3d5efd704cc55955f302d7d71533303ccabf61a0`。
- 外部4 JSON和18日志的bytes/hash与manifest逐项一致。
- default与LF均为clean exact-H worktree；记录的八项门禁均exit 0。
- default/LF结果分别为validator `28/28`、Catalog `21/21`、domain-core `503/503`、full ordinary `1712/1712`，typecheck/lint通过。
- PowerShell日志中的`NativeCommandError`为已披露的stderr转录包装；对应进程exit code均为0，无隐藏 assertion failure。
- Catalog blob/raw/generated identity与CRLF/LF checkout分类一致。
- protected old worktree仍为11/11 dirty且全部SHA匹配。
- coverage、ownership、hosted CI和P2F1R-D均未运行，也未被误称为已运行。
- 未发现生产行为、事件版本、replay、batch、receipt、projection或角色规则变更。

codeVerdict: CODE_REVIEW_FIX_REQUIRED

ruleVerdict: RULE_REVIEW_PASS

ruleVerdictBoundary:

- 这是本次Code Review中的规则边界核验，不替代后续fresh independent Rule Review。
- CE无规则语义或角色覆盖变化，强制来源与nightsheet未发现冲突。
- 三个阻塞均为冻结Evidence/Traceability实现及虚假PASS问题，不要求规则解释或产品行为变更。
- 因Code Review未通过，按既定顺序不得开始后续final Rule Review或宣告technical freeze。

overallDecision: FIX_REQUIRED

remainingBlockers:

- `CE-FINAL-CODE-F01_STATIC_AUDIT_ACCEPTS_DEAD_DECOY_RETURN`
- `CE-FINAL-CODE-F02_AP1_IDENTITY_IS_HAND_AUTHORED_NOT_COLLECTED`
- `CE-FINAL-CODE-F03_TRACEABILITY_MECHANISM_MATCH_IS_SELF_ATTESTED`

requiredNextAction: 使用剩余的CE Evidence Closure Round 2/2，仅修复上述三个证据合同；随后生成新的source/evidence HEAD、重新执行default/LF完整门禁，并对新exact HEAD重新进行fresh complete independent Code Review。不得开始Rule Review、D或P2F。
