reviewedDesign: `docs/implementation/phase-3-slice-2b19a1-design.md`

reviewedDesignSha256: `1526a95bcdb7c4d1288a457b068f3fb632d76cebdcc805629469f26310a427dc`

reviewTimestamp: `2026-07-16T15:11:47.0387417+08:00`

sourcesRead:

- `AGENTS.md`
- 用户授权附件 `0a8952ef-e210-4078-ae65-0339ef65e1c2/pasted-text.txt`
- `project-handoff/00-README-FIRST.md` 及其规定顺序的全部七份交接文件
- `project-handoff/rules/10-night-order.md`
- `project-handoff/rules/11-drunk-and-poison.md`
- `project-handoff/rules/12-information-model.md`
- `project-handoff/rules/18-sects-and-violets-roles.md` Dreamer 规格
- `project-handoff/tests/25-rule-test-cases.md` 中两项 Dreamer 规则测试
- `project-handoff/tests/31-test-coverage-report.md`
- `docs/rules/USER_OVERRIDES.md`
- `docs/rules/evidence/2B19A1.md`，已确认 SHA-256 为 `505456357b498c063e8d579aaabef025fd7cb5437f11264915cd810b470da4e6`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- 官方 Dreamer `oldid=2904`：revision `2025-09-24T08:39:30Z`，wikitext SHA-256 `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c`
- 用户指定中文 Wiki 首页：实时可访问
- 中文筑梦师 `oldid=3046`：revision `2023-04-18T04:58:54Z`，wikitext SHA-256 `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7`
- 官方 nightsheet commit `915347e627c3f6cd1f438f82b6001784e11b3e8b`：SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `docs/architecture/2B19A1-go-no-go-under-governance-v1.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- `docs/implementation/phase-3-slice-2b19t-status.md`
- `docs/implementation/vitest-coverage-single-fork-v1.md`

productionFilesInspected:

- `packages/domain-core/src/first-night-action-opportunity.ts`
- `packages/application/src/game-application-service.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
- `packages/domain-core/src/seamstress.ts`
- `packages/domain-core/src/rebuild.ts`
- `packages/domain-core/src/event-stream-validator.ts`
- `packages/domain-core/src/canonical-data.ts`
- `packages/domain-core/src/dreamer.ts`
- `packages/projections/src/index.ts`

testFilesInspected:

- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/rebuild.test.ts`
- `packages/domain-core/src/seamstress.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

findings:

- severity: `NONE`
  evidence: 设计文件哈希精确匹配，内容完整独立，未发现占位符、省略号类型、未定义自定义类型或要求实现者自行决定的安全关键合同。
  fix: `无需修正。`

- severity: `PASS_CONFIRMATION`
  evidence: `FirstNightAbilityInstanceId`、`formatBaseFirstNightAbilityInstanceId`、`parseFirstNightAbilityInstanceId`、`roleScheduledTaskId`、`findUniqueActiveRoleTenure` 与 `parseRoleTenureId` 均为真实现有 API，设计没有发明不存在的 authority。
  fix: `实现时按冻结字段和交叉绑定直接复用。`

- severity: `PASS_CONFIRMATION`
  evidence: `event-applier.ts` 已将完整 task plan、progress、current character state、opportunity state 和 `seamstressRoleTenureState` 传给同一 payload validator；事件类型由既有 opportunity 联合类型承载。因此设计所述 V2 replay 可以仅修改 domain opportunity 模块，无需修改 event applier 或新增 event type。
  fix: `无需第三个生产文件。`

- severity: `PASS_CONFIRMATION`
  evidence: 应用执行顺序真实为 receipt read、event load、canonical rebuild、expected-version check、validation、batch creation、prospective replay、commit。7.7 gained-open guard 与 7.9 V2-submit guard 均能准确落在 version check 后、`validate`/`recordRejected` 前，从而实现 receipt-free retryable failure。
  fix: `按冻结落点实现，不得下移到 validation 或 batch 阶段。`

- severity: `PASS_CONFIRMATION`
  evidence: V2 distinct kind/schema、独立 parser、字段级比较、nested exact shape、taskId uniqueness、clone 与 exhaustive dispatch 已被明确冻结；实现上不会被现有仅支持 V1 ID 的 parser 阻断，因为设计要求在 generic legacy parser 之前按 V2 kind/schema 分派。
  fix: `实现必须保持 discriminator-first dispatch。`

R/T判定:

- `R1`: `PASS`。V2 base producer、accepted replay、command idempotency、duplicate protection 与 OPEN V2 submit fail-closed 均有真实可达 application/event/rebuild 路径。
- `R2`: `PASS`。V1 plan + V1 opportunity，以及 V2 plan + legacy V1 opportunity 均由独立 legacy builder 保留精确历史含义；不迁移、不重解释。
- `R3`: `PASS`。malformed schema/shape、noncanonical identity、source/tenure/instance mismatch、duplicate 与 same-task mixing 均冻结为 fail-closed。
- `R4`: `PASS`。target、delivery、candidate、Vortox、impairment、ledger outcome、private knowledge 与 gained Dreamer execution 均明确留在未来范围，未成为本 Slice 前置。
- `T1`: `PASS`。command capture、V2 event payload、persisted replay 与 submit input 均要求 exact shape、canonical data、dense arrays、extra/missing-field 和适用 hostile-object 防御。
- `T2`: `PASS`。task plan、progress、current state、tenure、ability instance 与 state-before provenance 均由 canonical builder 交叉绑定。
- `T3`: `PASS`。formatter/parser、source constructor 与 expected builder 均为确定性封闭 seam，没有被错误扩张为新公共基础设施。

7.1-7.10判定:

- `7.1 V1 compatibility`: `PASS`
- `7.2 V2 generation`: `PASS`
- `7.3 exact V2 runtime contract`: `PASS`
- `7.4 canonical identity`: `PASS`
- `7.5 base source contract`: `PASS`
- `7.6 canonical builder/validation dispatch`: `PASS`
- `7.7 application opening and gained-open guard`: `PASS`
- `7.8 accepted replay`: `PASS`
- `7.9 V2 submit receipt-free fail closed`: `PASS`
- `7.10 projection/ledger non-effect`: `PASS`

completionCriteria:

- `PASS`。20 项 completion criteria 均有一个明确 primary layer 和可执行 primary authority test。
- V1 exact compatibility 同时覆盖新命令、V1 replay 与 V2-plan legacy replay。
- V2 producer、exact shape、canonical identity、tenure、ability instance、accepted replay、duplicate/mixing、receipt-free submit、projection non-effect、ledger non-effect与跨平台 CI 均有独立权威落点。
- 设计允许新增专用 domain 测试文件；该文件当前不存在不构成 blocker。

stopLoss:

- primaryRisk: `BASE_DREAMER_V2_OPPORTUNITY_CONTRACT`
- productionFileAllowlist: `2`
- expectedAddedProductionLOC: `360–480`
- newSharedInfrastructure: `false`
- newGameStateField: `false`
- newEventType: `false`
- projectionProductionChange: `false`
- ledgerProductionChange: `false`
- targetOrDeliveryImplementation: `false`
- VortoxOrImpairmentImplementation: `false`
- gainedDreamerImplementation: `false`
- result: `PASS`

remainingBlockers: `[]`

verdict: `RULE_DESIGN_PASS`

RULE_DESIGN_PASS
