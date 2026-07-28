reviewedBranch: `phase-3/reachable-base-dreamer-settleability-closure`

reviewedHead: `26e2dab7b4f7edec0745ad7c930fa9b0e1f95553`

designBaseHead: `844c7db5666dcb9d738a3bff12425bffd6df9d54`

reviewedDesign: `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design.md`

reviewedDesignSha256: `7aabfc579508172625fcb9ca5812ee320e858a731a6cd32c9ddfbf96b015d894`

reviewTimestamp: `2026-07-25T06:53:46.1279214Z`

reviewScope:

- 独立、只读审查设计提交 `844c7db5666dcb9d738a3bff12425bffd6df9d54..26e2dab7b4f7edec0745ad7c930fa9b0e1f95553` 的完整五文件、`872` 行新增/`69` 行删除差异。
- 完整审查 Round 2 设计、Round 1 implementation review 原始 findings、Round 1 产品差异，以及 C20、C34、C37 相关生产实现、正式类型、运行时验证器、ID formatter/parser、测试和控制状态。
- 独立核验外部规则、固定 revision/hash、官方 nightsheet 和当前 role coverage matrix。
- 审查 C34 的冻结 `R1 / T2 / PURE_POLICY_SEAM` 分类、M01–M08 fixture 合法性、resolver 不变性、范围、门禁、stop-loss 和 repair accounting。
- 未编辑、提交、推送或修改 PR；未运行产品测试、coverage、ownership、Windows W1–W7 或 GitHub CI；未提供最终 PR 审查结论。
- 审查结束时 branch、HEAD、parent、design hash、Round 1 review hash、开放 PR #46 远端 HEAD 和 clean worktree 均与冻结锚点一致。

authoritiesReviewed:

- `AGENTS.md`
- `project-handoff/00-README-FIRST.md` 及其指定顺序中的：
  - `project-handoff/PROJECT_HANDOFF.md`
  - `project-handoff/PRODUCT_SCOPE.md`
  - `project-handoff/RULES_BASELINE.md`
  - `project-handoff/ARCHITECTURE_INPUT.md`
  - `project-handoff/IMPLEMENTATION_GUARDRAILS.md`
  - `project-handoff/OPEN_RISKS.md`
  - `project-handoff/DEVELOPMENT_ROADMAP.md`
- `docs/agent-loop/AUTOPILOT_PROMPT.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B20A-resolved.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/implementation/phase-3-slice-2b20a-design-round-2.md`
- `docs/implementation/phase-3-slice-2b20a-traceability-classification-correction-v1.md`
- `docs/implementation/phase-3-slice-2b20a-design-release-review.md`
- `docs/implementation/phase-3-slice-2b20a-product-repair-round-1-design.md`
- `docs/implementation/phase-3-slice-2b20a-product-repair-round-1-design-review.md`
- `docs/implementation/phase-3-slice-2b20a-product-repair-round-1-design-rereview.md`
- `docs/implementation/phase-3-slice-2b20a-product-repair-round-1-implementation-review.md`; SHA-256 `913df42266cb97bdd9ba60943bf9430e80f30774ad9731c83590447d87c7a298`
- `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design.md`
- `packages/domain-core/src/dreamer.ts`
- `packages/domain-core/src/dreamer.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/setup-types.ts`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- 独立读取并按原始字节核验全部固定外部来源：
  - Chinese Wiki：首页 oldid `5855`, SHA-256 `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49`
  - Chinese Wiki 筑梦师 oldid `3046`, SHA-256 `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`
  - Chinese Wiki 哲学家 oldid `5125`, SHA-256 `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be`
  - Chinese Wiki 醉酒 oldid `5720`, SHA-256 `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e`
  - Chinese Wiki 中毒 oldid `6294`, SHA-256 `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0`
  - Chinese Wiki 数学家 oldid `6442`, SHA-256 `cdd2002b0110a09463e0084c2415e334aef0024f7635d7b914814a9a89233e1c`
  - Chinese Wiki 涡流 oldid `6198`, SHA-256 `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff`
  - Official Dreamer oldid `2904`, SHA-256 `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`
  - Official Philosopher oldid `2421`, SHA-256 `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365`
  - Official States oldid `1039`, SHA-256 `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440`
  - Official Rules Explanation oldid `1310`, SHA-256 `dcc318218842d92c908ec9382494f7001929e95e62474bcf62e04cd383d91189`
  - Official Glossary oldid `2874`, SHA-256 `75a4ce2fae80808172b90401f87041a2ab8a5101a8330b115739ddd9fc414fee`
  - Official Mathematician oldid `3109`, SHA-256 `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b`
  - Official Vortox oldid `3017`, SHA-256 `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07`
  - Official nightsheet commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`, SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- 所有固定外部来源均返回 HTTP 200，字节 hash 与证据记录一致。官方首夜位置独立算得 Philosopher `14`、Dreamer `61`、Mathematician `77`。未发现影响本设计的规则冲突。
- 当前 coverage matrix 仍将 Dreamer、Philosopher、Mathematician 标为 `PARTIAL`，Fang Gu 为 `SKELETON`，Vortox 为 `NOT_STARTED`；没有错误提升到 `COMPLETE`。

round1FindingExtractionAudit:

- F01 原始 finding 的唯一剩余代码缺陷确实是：`packages/domain-core/src/dreamer.ts` 的 `isExceptionSafeCanonicalDreamerData` 数组循环读取 `descriptor.value`，但未强制 numeric own data descriptor 的 `enumerable === true`。Round 2 设计对此描述准确，没有遗漏或增加第二个 F01 产品缺陷。
- F04 原始 finding 确实逐项列出：
  - malformed plan；
  - malformed opportunity；
  - malformed tenure；
  - malformed source contract；
  - missing `sourceAbilityInstanceId`；
  - well-formed but unprovable `sourceAbilityInstanceId`；
  - mismatched/wrong-generation `sourceAbilityInstanceId`；
  - real state/catalog mismatch。
- Round 2 M01–M08 与这八个原始文字项目一一对应，没有遗漏，也没有新增第九个未由 Round 1 reviewer 要求的 case。
- 但“文字映射完整”不等于“工程分类有效”。冻结 classification appendix 明确规定 C34 是 `R1 / T2 / PURE_POLICY_SEAM`；治理 ADR 将缺字段、错误版本、无效 ID grammar、直接 shape validator 归入 `R3/T1/STRUCTURAL_VALIDATION`。Round 2 设计把原 reviewer 的部分结构性措辞直接提升为 C34 primary authority，违反现行 classification gate。
- 因而不存在“无法建立 Round 1 到 Round 2 的映射”；实际问题是映射后的 primary-layer 分类错误。

f01DesignAudit:

- `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design.md` 的 F01 contract 精确限定为 numeric element own descriptor：
  - descriptor 必须存在；
  - 必须是 data descriptor；
  - `enumerable` 必须严格为 `true`；
  - 递归值仅取自 `descriptor.value`；
  - accessor 在读取前拒绝；
  - Proxy/descriptor 异常继续 fail closed。
- 设计正确区分 numeric element 与数组 `length`；没有要求 `length.enumerable === true`。
- 设计没有新增 `writable` 或 `configurable` 约束。
- 设计没有改变合法 V1–V7/V7 payload 语义，没有要求第二个生产文件、通用 plain-data validator 重写、新公共 API 或新 schema。
- F01 生产 allowlist 仅为 `packages/domain-core/src/dreamer.ts`，方向和范围可信。

c20EvidenceAudit:

- 设计要求从合法 `v7FangGuFacts()` 深克隆，并只把现有 `legalCandidates["0"]` 从 enumerable own data descriptor 改成 `enumerable:false`。
- 设计要求保留原 `value`、`writable`、`configurable`，并直接证明该属性仍是 own data property、无 getter/setter、值未改变。
- 设计覆盖：
  - C20 direct hostile matrix；
  - `validateDreamerInformationDeliveredPayload` 的精确失败结果；
  - `validateStoredDreamerInformationDelivered` 的精确失败结果；
  - 原 numeric accessor getter count `0`；
  - 合法 enumerable V7 的 direct/stored controls；
  - V1–V6 和完整 `dreamer.test.ts` 回归。
- 未要求 application-service 测试变化、新 validator 或第二个生产文件。
- C20 仍保持 `R3 / T1 / STRUCTURAL_VALIDATION`，与该 hostile canonical-data boundary 相符。

c34ClassificationAudit:

- 冻结权威：
  - Reachability：`R1 CURRENTLY_REACHABLE_APPLICATION_PATH`
  - Trust：`T2 CANONICAL_DERIVED_STATE`
  - Primary layer：`PURE_POLICY_SEAM`
  - Mechanism：`DIRECT_CANONICAL_CAPABILITY_RESOLUTION_MATRIX`
- 治理 ADR 明确规定 invalid/malformed/impossible state 优先归入 `R3`；缺字段、错误 literal、无效 ID grammar、直接 exact-shape 验证归入 `STRUCTURAL_VALIDATION`。resolver 内部捕获异常并返回 `SOURCE_PROVENANCE_INVALID` 不会把 T1 shape corruption 变成 T2 policy evidence。
- 强制五项分类：
  - malformed plan：`INVALID_T1_STRUCTURAL_CASE`
  - malformed opportunity：`INVALID_T1_STRUCTURAL_CASE`
  - malformed tenure state：`INVALID_T1_STRUCTURAL_CASE`
  - malformed source contract：`INVALID_T1_STRUCTURAL_CASE`
  - missing `sourceAbilityInstanceId`：`INVALID_T1_STRUCTURAL_CASE`
- 其余分类：
  - M06 parser-valid、字段完整但与 canonical task 不可建立关系：有效 T2 semantic cross-link case。
  - M07 当前设计并非 parser-valid wrong-generation case；formatter 输入的是 BASE task ID，生成字符串不满足 gained-v2 嵌套 task grammar，因此仍是 T1 invalid-ID case。
  - M08 两侧 RoleSetupSnapshot 分别合法但相互不一致：有效 T2 semantic state/catalog case。

c34Round2CaseAudit:

1. Case ID: `C34-R2-M01`
   - 对应冻结 requirement：malformed first-night plan fails provenance closed。
   - Round 1 证据为何不足：仅有 canonical plan 和合法 task-source player mismatch，没有缺 `taskPlanVersion` 的输入。
   - fixture 结构是否合法：否；`FirstNightTaskPlan.taskPlanVersion` 是 required field。
   - 是否 T2 canonical-derived input：否。
   - 相比成功 control 只改变的维度：删除 required `taskPlanVersion`，属于 shape corruption，不是合法领域维度。
   - 是否依赖非法 cast/删除 required field：是。
   - exact resolver kind：`EFFECTIVENESS_UNRESOLVED`
   - exact resolver reason：`SOURCE_PROVENANCE_INVALID`
   - 是否真正需要在 Round 2 新增：不能作为 C34 primary case；若需要该证据，只能由独立的 R3/T1 structural authority 承担。
   - reviewer 结论：`INVALID_PRIMARY_CASE`

2. Case ID: `C34-R2-M02`
   - 对应冻结 requirement：malformed V3 opportunity fails provenance closed。
   - Round 1 证据为何不足：现有 C34 没有缺 `visibility` 的 V3 object。
   - fixture 结构是否合法：否；`visibility` 是 V3 opportunity required property，stored state exact-shape validation 必然失败。
   - 是否 T2 canonical-derived input：否。
   - 相比成功 control 只改变的维度：删除 required `visibility`，是结构损坏。
   - 是否依赖非法 cast/删除 required field：是。
   - exact resolver kind：`EFFECTIVENESS_UNRESOLVED`
   - exact resolver reason：`SOURCE_PROVENANCE_INVALID`
   - 是否真正需要在 Round 2 新增：不能用于关闭 C34；只能作为 R3/T1 opportunity-shape evidence。
   - reviewer 结论：`INVALID_PRIMARY_CASE`

3. Case ID: `C34-R2-M03`
   - 对应冻结 requirement：malformed role-tenure-state shape fails provenance closed。
   - Round 1 证据为何不足：现有 `{records:[], processedTransitionFactIds:[]}` 是结构合法的 missing-active-tenure semantic case；没有缺 container field 的输入。
   - fixture 结构是否合法：否；`processedTransitionFactIds` 是 `RoleTenureState` required field，`validateRoleTenureStateExact` 要求精确两个 keys。
   - 是否 T2 canonical-derived input：否。
   - 相比成功 control 只改变的维度：删除 required tenure-container field。
   - 是否依赖非法 cast/删除 required field：是。
   - exact resolver kind：`EFFECTIVENESS_UNRESOLVED`
   - exact resolver reason：`SOURCE_PROVENANCE_INVALID`
   - 是否真正需要在 Round 2 新增：不属于 C34；合法的 missing-active-tenure T2 case已经存在。
   - reviewer 结论：`INVALID_PRIMARY_CASE`

4. Case ID: `C34-R2-M04`
   - 对应冻结 requirement：malformed base-Dreamer source contract fails provenance closed。
   - Round 1 证据为何不足：现有 contract source-player mismatch 是完整 shape 的 semantic mismatch；没有 unsupported version literal。
   - fixture 结构是否合法：否；unsupported `sourceContractVersion` 违反 exact version contract。
   - 是否 T2 canonical-derived input：否。
   - 相比成功 control 只改变的维度：把 supported version 改成 unsupported literal，是 T1 version attack。
   - 是否依赖非法 cast/删除 required field：需要绕过正式 literal type；虽未删字段，仍依赖非法 version cast。
   - exact resolver kind：`EFFECTIVENESS_UNRESOLVED`
   - exact resolver reason：`SOURCE_PROVENANCE_INVALID`
   - 是否真正需要在 Round 2 新增：不能作为 C34 primary case；若保留，只能归入 R3/T1 structural validation。
   - reviewer 结论：`INVALID_PRIMARY_CASE`

5. Case ID: `C34-R2-M05`
   - 对应冻结 requirement：missing source ability instance fails provenance closed。
   - Round 1 证据为何不足：现有 C34 没有改动该字段。
   - fixture 结构是否合法：否；`sourceAbilityInstanceId` 是 `BaseDreamerV2SourceContract` required field，并包含在 exact key set 中。
   - 是否 T2 canonical-derived input：否。
   - 相比成功 control 只改变的维度：删除 required ability-instance field。
   - 是否依赖非法 cast/删除 required field：是。
   - exact resolver kind：`EFFECTIVENESS_UNRESOLVED`
   - exact resolver reason：`SOURCE_PROVENANCE_INVALID`
   - 是否真正需要在 Round 2 新增：不能作为 C34 primary case；应改为字段存在、grammar 合法、但 canonical relation 不可证明的 semantic case。
   - reviewer 结论：`INVALID_PRIMARY_CASE`

6. Case ID: `C34-R2-M06`
   - 对应冻结 requirement：well-formed but unprovable base ability instance。
   - Round 1 证据为何不足：现有 C34 从未改变 `sourceAbilityInstanceId`。
   - fixture 结构是否合法：是；`first-night-v1:DREAMER_ACTION:seat-12` 是 canonical BASE task grammar，formatter 生成 parser-valid BASE ability ID，keys/version/required fields完整。
   - 是否 T2 canonical-derived input：是；失败点是该 seat-12 ability identity 无法与当前 seat-01 task/plan/source relation 建立 canonical cross-link。
   - 相比成功 control 只改变的维度：仅 ability instance 指向的 base task identity。
   - 是否依赖非法 cast/删除 required field：否；仅需要构建同类型的 canonical ID。
   - exact resolver kind：`EFFECTIVENESS_UNRESOLVED`
   - exact resolver reason：`SOURCE_PROVENANCE_INVALID`
   - 是否真正需要在 Round 2 新增：是；当前 C34 没有独立 source-ability identity mismatch。
   - reviewer 结论：`REQUIRED_VALID_CASE`

7. Case ID: `C34-R2-M07`
   - 对应冻结 requirement：wrong-generation/mismatched source ability instance。
   - Round 1 证据为何不足：现有 C34 没有改变 ability generation。
   - fixture 结构是否合法：否，按当前设计构造。`formatPhilosopherGainedV2AbilityInstanceId` 不会自行规范化输入；parser 要求嵌套 task ID 匹配 `first-night-v2:PHILOSOPHER_GAINED:<taskType>:seat-XX:from-<role>`。设计传入 `facts.opportunity.taskId`，它是 `first-night-v1:DREAMER_ACTION:seat-01` BASE task，因此生成字符串不能通过 `parseFirstNightAbilityInstanceId`。
   - 是否 T2 canonical-derived input：否；当前构造先在 ID grammar 层失败。
   - 相比成功 control 只改变的维度：声称只改变 generation，实际同时产生了非法 gained-ID grammar。
   - 是否依赖非法 cast/删除 required field：未删字段，但 formatter 的 branded return type掩盖了无效嵌套 task grammar；仍属于 invalid grammar。
   - exact resolver kind：`EFFECTIVENESS_UNRESOLVED`
   - exact resolver reason：`SOURCE_PROVENANCE_INVALID`
   - 是否真正需要在 Round 2 新增：需要 wrong-generation semantic case，但必须改用 parser-valid gained-v2 task ID及相匹配的 canonical grant ID，再仅让它与 BASE contract/current task relation不一致。
   - reviewer 结论：`INVALID_PRIMARY_CASE`

8. Case ID: `C34-R2-M08`
   - 对应冻结 requirement：real current Demon/catalog snapshot mismatch。
   - Round 1 证据为何不足：`anotherDemonState` 与 `anotherDemonSetup` 都使用相同 Vigormortis snapshot，只证明“另一 catalog Demon”，不证明两侧 mismatch。
   - fixture 结构是否合法：是；设计要求 current-state Fang Gu snapshot 与 catalog Fang Gu snapshot 各自具有合法 role ID、type、alignment、edition 和 setup modifier。
   - 是否 T2 canonical-derived input：是；两个分别合法的 canonical structures 在 snapshot equality 上不一致。
   - 相比成功 control 只改变的维度：current Demon RoleSetupSnapshot 的合法 `setupModifier`。
   - 是否依赖非法 cast/删除 required field：否。
   - exact resolver kind：`EFFECTIVENESS_UNRESOLVED`
   - exact resolver reason：`CURRENT_DEMON_CATALOG_MISMATCH`
   - 是否真正需要在 Round 2 新增：是；现有 matching Vigormortis fixture不覆盖该关系。
   - reviewer 结论：`REQUIRED_VALID_CASE`

c34AlreadyValidAudit:

- canonical DRUNK/Fang Gu：存在独立 canonical fixture；精确 supported `kind`，有效 T2。
- legal POISONED：使用无 DRUNK-only `chosenRoleId` 的完整 POISONED record；精确 `SOURCE_REPRESENTED_IMPAIRED/POISONED`，有效 T2。
- duplicate impairment：两个完整 canonical records，精确 `SOURCE_IMPAIRMENT_CONFLICT`，有效 T2。
- conflicting impairment：完整 DRUNK 与完整 POISONED records，精确 `SOURCE_IMPAIRMENT_CONFLICT`，有效 T2。
- sparse impairment：确有独立输入和精确 reason，但通过删除数组索引构造；这是 T1 structural corruption，不是合法 T2 C34 primary evidence。Round 2 设计在第 359 行将其标成“Truly proved”使 already-valid inventory 不准确。
- stale impairment：完整 opportunity、state、contract 和 impairment，通过 revision window 语义使旧 impairment 不再适用；精确 `NORMAL_INFORMATION_SUPPORTED` kind，有效 T2。
- current No Dashii：state/catalog 同时使用合法 No Dashii snapshot；精确 `NO_DASHII_EFFECT_UNRESOLVED`，有效 T2。
- canonical DRUNK + current Vortox：独立 canonical fixture，精确 supported kind，有效 T2。
- effective Vortox without source impairment：独立 canonical fixture，精确 supported kind，有效 T2。
- Vortox conflict：两个完整、适用的 POISONED records；精确 `VORTOX_EFFECTIVENESS_CONFLICT`，有效 T2。
- another catalog Demon with DRUNK：state/catalog 同时使用 Vigormortis；精确 `SOURCE_REPRESENTED_IMPAIRED/DRUNK`，有效 T2。
- another catalog Demon without impairment：同一 matching Vigormortis state/catalog，精确返回 `CURRENT_DEMON_CATALOG_MISMATCH`；它只证明当前 resolver 对“另一个支持目录 Demon”的冻结分支，不能被称为真实 snapshot mismatch。
- non-unique Demon：第二个完整 Demon state entry 和 catalog role；精确 `CURRENT_DEMON_IDENTITY_NOT_UNIQUE`，有效 T2。
- missing active tenure：`{records:[], processedTransitionFactIds:[]}` 结构完整，精确 `SOURCE_PROVENANCE_INVALID`，有效 T2 semantic absence。
- current assignment mismatch：current source role改为合法 Flowergirl snapshot，其他关系保持；精确 reason，有效 T2。
- task-source mismatch：完整 plan/task shape，canonical player ID但与 source relation 不一致；精确 reason，有效 T2。
- contract-source mismatch：完整 contract shape，canonical player ID但与 task/source relation 不一致；精确 reason，有效 T2。
- normal base control：独立无 impairment Fang Gu fixture，精确 supported kind。
- gained control：独立 gained-Dreamer fixture，精确 supported kind。
- 当前 C34 没有宽泛 `not.toBe(success)`；所有 unresolved cases 使用 exact `kind/reason`。Supported variants使用包含精确 `kind` 的 `toMatchObject`，且其 union variant没有 `reason` 字段。
- 除 sparse impairment 外，设计列出的 already-valid inventory 与当前测试相符；sparse 项使该 inventory 不能作为完整可信的 C34 T2 清单。

resolverImmutabilityAudit:

- 设计明确禁止修改 `resolveBaseDreamerV2NormalCapability` 和 `resolvePhilosopherGainedDreamerCapability`。
- `844c7db..26e2dab` 没有生产或测试变更。
- 静态分支审查确认 M06 和 M08 的预期结果来自现有 resolver；修正为 parser-valid gained-v2 ID 后的 M07 也应由现有 provenance comparison 返回精确 `SOURCE_PROVENANCE_INVALID`。
- M01–M05 及当前 M07 的 resolver 结果来自 shape/version/grammar failure 或 catch，不能用来证明 resolver 的 T2 policy seam。
- 没有发现需要修改 resolver 的合法 T2 行为缺陷；`ADDITIONAL_PRODUCT_BEHAVIOR_DEFECT_REQUIRES_FINAL_REPAIR_SCOPE_REVIEW` 当前未触发。
- 唯一授权生产修改仍可保持为 F01 enumerability check。

scopeAudit:

- 设计提交实际只修改五个授权 docs/control 文件，提交 trailer 精确包含 `Co-Authored-By: Codex GPT-5 <noreply@openai.com>`，`git diff --check` 无错误。
- 未来 production allowlist 仅 `packages/domain-core/src/dreamer.ts`。
- 未来 formal-test allowlist 仅 `packages/domain-core/src/dreamer.test.ts`。
- `packages/application/src/game-application-service.test.ts` 明确为只读 C37 回归。
- F05/C37、Mathematician ledger、projection、rebuild、atomic batch、receipt、idempotency、historical knowledge 和 attribution 均保持关闭且不授权修改。
- 设计没有授权事件/schema/state/public API、POISONED、No Dashii、gained impairment、FIRST_NIGHT→DAY、traceability、ownership、SUP、routing、workflow、profile、timeout、dependency 或 CI 修改。
- `behaviorDesignChanged=false`、`ruleSemanticsChanged=false`、`eventSchemaChanged=false` 和 Dreamer `PARTIAL` 均与权威一致。
- 当前唯一范围风险来自错误的 C34 authority 分类：修正版必须先决定 M01–M05/M07 的正确 authority，不能在实现阶段静默以非法 cast 填满“八个 case”数量。

localGateDesignAudit:

- 设计列出的八项未来本地命令覆盖 focused C20、focused C34、focused C37、完整两个测试文件、typecheck、lint 和 ordinary suite。
- 设计正确排除 coverage、ownership、GitHub CI、Windows W1–W7 和 final PR review 作为本地 Round 2 implementation 前置条件。
- 本审查未执行这些命令。
- 本地 gate 的“C34 contains eight independent missing-case fixtures”验收条款不成立：M01–M05 和当前 M07 不是合法 T2 C34 primary cases。该 gate 必须随设计 correction 改为只验收经分类审查确认的有效 semantic cases，并分别处理 structural cases。
- 其余 C20、C37 read-only regression、allowlist、`git diff --check` 和无隐藏异常条款合理。

stopLossAudit:

- 设计明确保持 Product Repair `1/2`；设计和设计审查不消费 Round 2。
- 只有首次未来 production/formal-test 修改才消费最后的 `2/2`。
- 设计明确禁止 Round 3、测试削弱、静默扩展文件、resolver 修改和行为重写。
- 最终 Round 2 implementation review 若仍有产品或正式测试 blocker，将进入 `HUMAN_BLOCKED`，后续只能请求 stop-loss override、reslice 或放弃 PR #46。
- 当前设计分类缺陷发生在实现前，可先做 bounded design correction；不得用最后 repair round实现当前无效 case table。
- 下游 ownership/Linux/Windows blockers保持独立，不影响本设计 finding 的真实性，也不能被本设计关闭。

controlStateAudit:

- 最终复核：
  - branch 精确匹配；
  - HEAD 精确为 `26e2dab7b4f7edec0745ad7c930fa9b0e1f95553`；
  - parent 精确为 `844c7db5666dcb9d738a3bff12425bffd6df9d54`；
  - worktree clean；
  - design hash 与冻结值一致；
  - Round 1 review hash 与冻结值一致；
  - 设计提交仅修改规定五文件；
  - commit trailer 匹配；
  - PR #46 为 OPEN、未合并，remote HEAD 仍为 `dbfa424c96a8bcf06a0d2a77205626a532aa2ec8`。
- `AUTOPILOT_STATE.json` 可解析，当前正确记录：
  - `status=HUMAN_BLOCKED`
  - `detailedStatus=READY_FOR_INDEPENDENT_PRODUCT_REPAIR_ROUND_2_DESIGN_REVIEW`
  - `implementationAuthorized=false`
  - `productRepairRound=1`
  - `productRepairRoundConsumed=true`
  - `productRepairRoundConsumedByDesign=false`
- 当前 control state 对“审查前等待独立 reviewer”是准确的。
- 根据本报告，后续唯一 writer 同步时不得授权实现；应进入 `PRODUCT_REPAIR_ROUND_2_DESIGN_CORRECTION_AUTHORIZATION_REQUIRED`，保持 round `1/2` 和 `implementationAuthorized=false`。本 reviewer 未执行同步。

findings:

- findingId: `C34_ROUND_2_MATRIX_MIXES_T1_STRUCTURAL_CASES_INTO_T2_POLICY_AUTHORITY`
  - severity: `P1`
  - classification: `DESIGN_BLOCKER`
  - exact file/section/case:
    - `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design.md`, `C34 Missing-Case Table`, lines 390–396
    - cases `C34-R2-M01`, `M02`, `M03`, `M04`, `M05`, `M07`
    - `packages/domain-core/src/first-night-action-opportunity.ts`, `hasExactBaseDreamerV2SourceContractShape`、`hasExactFirstNightActionOpportunityShape`
    - `packages/domain-core/src/seamstress.ts`, `validateRoleTenureStateExact`
    - `packages/domain-core/src/first-night-ability-outcome-ledger.ts`, `parseFirstNightAbilityInstanceId`
  - evidence:
    - M01、M02、M03、M05 直接删除 required fields。
    - M04 使用 unsupported version literal。
    - M07 把 BASE `facts.opportunity.taskId` 传入 gained-v2 formatter；parser 要求嵌套 task ID 自身是 canonical gained-v2 task，因此生成值是 invalid grammar，而不是合法 wrong-generation identity。
    - resolver 返回 `SOURCE_PROVENANCE_INVALID` 只证明 fail closed；不能改变 fixture 的 R3/T1 性质。
  - violated contract:
    - C34 冻结为 `R1 / T2 / PURE_POLICY_SEAM`。
    - ADR 明确将 missing field、invalid version、invalid ID grammar 和 exact-shape验证归入 `R3/T1/STRUCTURAL_VALIDATION`。
    - 用户要求不得因 resolver catch 将 T1 corruption 重分类为 T2。
  - failure scenario:
    - implementer逐字实现当前表格后，六个结构损坏输入都得到预期 reason，测试可能为绿，但 C34 仍没有相应 T2 semantic authority；最终会错误宣称冻结 policy matrix 已关闭。
  - required correction:
    - 从 C34 primary table 移除或重新分类 M01–M05。
    - 若这些结构证明仍需保留，必须映射到独立 R3/T1 structural authority，不能计入 C34 case 数量。
    - M07 必须改用 canonical gained-v2 scheduled task ID及匹配 seat/role 的 canonical grant ID，使整个 ability ID parser-valid，再仅制造其与 BASE contract/current task relation 的 semantic mismatch。
    - 更新所有“八个 C34 case”验收、local gate 和 handoff 表述。
  - required regression tests:
    - C34 只保留结构、版本、required fields、ID grammar均合法的 T2 semantic fixtures，并精确断言 `kind/reason`。
    - M06、修正后的 M07、M08 必须各有独立 fixture和成功 control。
    - 任何 M01–M05 structural evidence若仍在范围内，必须由正确的 structural-validation test identity证明，不得作为 C34 primary evidence。

- findingId: `C34_ROUND_2_ALREADY_VALID_INVENTORY_IS_FALSE`
  - severity: `P1`
  - classification: `DESIGN_BLOCKER`
  - exact file/section/case:
    - `docs/implementation/phase-3-slice-2b20a-product-repair-round-2-design.md`, `C34 frozen-requirement audit`, line 359
    - `packages/domain-core/src/dreamer.test.ts`, `[2B20A-C34]`, lines 676–679
    - sparse impairment case
  - evidence:
    - 当前测试通过 `Reflect.deleteProperty(sparseImpairments, "0")` 创建 sparse array。
    - 设计把该 malformed impairment-set shape 标为“Truly proved; preserve”，并纳入 C34 already-valid inventory。
    - sparse array 是明确的 T1 structural corruption，不是合法 T2 canonical-derived input。
  - violated contract:
    - C34 `R1/T2/PURE_POLICY_SEAM` primary matrix 必须使用结构完整的 canonical-derived inputs。
    - 用户明确列出 sparse array 不得作为 C34 primary case。
    - REVIEW_PROTOCOL 要求一个物理 test identity不能混合需要不同 primary layers 的独立 primary assertions。
  - failure scenario:
    - 设计将一个已有的 structural negative assertion当作 T2 C34 coverage，导致 already-valid inventory虚假，并掩盖 primary authority仍不纯。
  - required correction:
    - 将 sparse impairment 从 C34 T2 “already proved” inventory中移除。
    - 若为回归保留该 assertion，必须明确它只具 structural supporting/regression地位，不决定 C34 completion；若它需要独立 primary authority，则设计必须允许正确的独立 test identity和 traceability。
    - 保持 duplicate/conflicting legal impairment cases作为有效 T2 authority，不得用 sparse case替代它们。
  - required regression tests:
    - C34 impairment primary matrix仅使用 dense、exact-shape records/arrays。
    - sparse impairment仍需测试时，由 R3/T1 structural authority精确断言 fail-closed result。
    - 审查应确认 C34 primary success/adjacent cases不依赖 sparse、accessor、Proxy、missing field或invalid literal。

designVerdict: `RULE_DESIGN_FIX_REQUIRED`

remainingDesignBlockers:

- `C34_ROUND_2_MATRIX_MIXES_T1_STRUCTURAL_CASES_INTO_T2_POLICY_AUTHORITY`
- `C34_ROUND_2_ALREADY_VALID_INVENTORY_IS_FALSE`

downstreamPRBlockers:

- `OWNERSHIP_SUPERSESSION_AND_ROUTING_REQUIRED`
- `LINUX_WORKER_RPC_CI_BLOCKER`
- `WINDOWS_W7_UNKNOWN_EXIT_BLOCKER`
