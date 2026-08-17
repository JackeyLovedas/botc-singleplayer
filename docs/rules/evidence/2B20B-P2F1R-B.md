# Phase 3 Slice 2B20B-P2F1R-B Rule Evidence

## Metadata

- sliceId: `2B20B-P2F1R-B`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1R_B_DETERMINISTIC_INTEGRITY_HASH_GOVERNANCE_PRECHECK_ONLY`
- retrievalDate: `2026-07-30`
- branch: `phase-3/2b20b-p2f1r-a-canonical-runtime-capture-tlv`
- currentHead: `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`
- scope: `RULE_EVIDENCE_FOR_DETERMINISTIC_INTEGRITY_HASH_GOVERNANCE_PRECHECK_ONLY`
- involvedRoles: `[]`
- applicableOverrides: `[]`
- ruleCoverageStatus: `SKELETON`
- sliceCoverageTarget: `FOUNDATION`
- roleCoverageImpact: `NONE`

## Frozen A dependency provenance

- A production source commit:
  `f3be36c7b195c3743df4d8213734d72908fed7e5`.
- Frozen reviewed A dependency and current HEAD:
  `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`.
- Direct-child proof:
  `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d^` is exactly
  `f3be36c7b195c3743df4d8213734d72908fed7e5`.
- The child changes only
  `packages/domain-core/src/canonical-runtime-value.test.ts` and
  `docs/implementation/phase-3-slice-2b20b-p2f1r-a-test-traceability.md`.
- A production is byte-identical across the two commits:
  `packages/domain-core/src/canonical-runtime-value.ts` has Git blob
  `8ec669c0f0cdafcc246c7b64f564f40fbff8ec73`, and
  `packages/domain-core/src/index.ts` has Git blob
  `29d1b9790332f9caf89330363171cc493b2c3915`, at both commits.
- Therefore the correct `AInputCommit` for later B governance is the frozen
  reviewed dependency `bdb3d52eb8ce020fefeb48291b516d3f636a4e0d`,
  with production provenance at
  `f3be36c7b195c3743df4d8213734d72908fed7e5`.

## Source URLs, revisions, and hashes

| Source | Exact source | Revision authority | SHA-256 |
|---|---|---|---|
| User-approved overrides | `docs/rules/USER_OVERRIDES.md` | containing commit `7b12e707a3015b0c6434f7ff9b8e71458bc90838` | `9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5` |
| Chinese Wiki home | https://clocktower-wiki.gstonegames.com/index.php?title=%E9%A6%96%E9%A1%B5&oldid=5855&action=raw | oldid `5855` | `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49` |
| Chinese Wiki 醉酒 | https://clocktower-wiki.gstonegames.com/index.php?title=%E9%86%89%E9%85%92&oldid=5720&action=raw | oldid `5720` | `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e` |
| Chinese Wiki 中毒 | https://clocktower-wiki.gstonegames.com/index.php?title=%E4%B8%AD%E6%AF%92&oldid=6294&action=raw | oldid `6294` | `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0` |
| Official BOTC Wiki Main Page | https://wiki.bloodontheclocktower.com/index.php?title=Main_Page&oldid=3035&action=raw | oldid `3035` | `7511e03e6813d4c100b8c01a21e5468d9d255b1235626b118a7d4be4042d13c1` |
| Official BOTC Wiki Rules Explanation | https://wiki.bloodontheclocktower.com/index.php?title=Rules_Explanation&oldid=1310 | oldid `1310` | `dcc318218842d92c908ec9382494f7001929e95e62474bcf62e04cd383d91189` |
| Official BOTC Wiki States | https://wiki.bloodontheclocktower.com/index.php?title=States&oldid=1039 | oldid `1039` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| Official nightsheet, last file-changing commit | https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json | commit `3d6d930a9e600321f93b2567a2e88948a675bc1e` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |
| Official nightsheet, pinned repository revision | https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/915347e627c3f6cd1f438f82b6001784e11b3e8b/resources/data/nightsheet.json | commit `915347e627c3f6cd1f438f82b6001784e11b3e8b` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |
| Existing relevant P2 evidence | `docs/rules/evidence/2B20B-P2-impairment-state-provenance.md` | Git bytes at current HEAD, `25768` bytes | `80a7697104de4ce8e1b08a4e501931a680d7e0537ba2400bca74a551a2c3e358` |

The two pinned nightsheet revisions contain identical bytes. No night-order
claim is made by this Slice.

## Rule-claim boundary

- BOTCRuleClaims: `[]`
- nightOrderClaims: `[]`
- abilityRules: `N/A`
- firstNightOrder: `N/A`
- otherNightOrder: `N/A`
- interactions: `N/A`
- drunkennessRules: `N/A`
- poisoningRules: `N/A`
- VortoxRules: `N/A`
- characterChangeRules: `N/A`
- alignmentChangeRules: `N/A`
- storytellerDiscretion: `N/A`
- explicitOutOfScope: `ALL_BOTC_BEHAVIOR`
- unresolvedConflicts: `[]`
- requiredRegressionTests:
  `ENGINEERING_ONLY_DEFERRED_TO_DESIGN_AND_NOT_RULE_CLAIMS`

P2F1R-B is a generic engineering integrity foundation. It does not implement,
reinterpret, validate, or change any BOTC ability, state, night order,
interaction, Storyteller choice, event meaning, accepted-history rule, or role
coverage. No role-matrix edit is authorized.

## Rule verdict

ruleVerdict: `RULE_READY`

`RULE_READY` authorizes only the separately controlled architecture/design
gate. It does not authorize production code, tests, a branch operation,
publication, CI, or implementation.
