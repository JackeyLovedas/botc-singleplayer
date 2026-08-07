# Rule Evidence — Phase 3 Slice 2B20B-P2F1R-D2W

## Metadata

- `sliceId`: `2B20B-P2F1R-D2W`
- `sliceName`: `Canonical Checkout Byte Portability Foundation`
- `retrievalDate`: `2026-08-07`
- `retrievalTimestamp`: `2026-08-07T14:45:29+08:00`
- `rulesBaseline`: `Phase One v2.1`
- `involvedRoles`: `[]`
- `applicableUserOverrides`: `[]`
- `requiredRuleChange`: `false`
- `productBehaviorChanged`: `false`
- `ruleSemanticsChanged`: `false`
- `eventSchemaChanged`: `false`
- `ruleCoverageStatus`: `SKELETON`
- `approvedSnapshotUsed`: `false`
- `approvedSnapshotPath`: `NOT_APPLICABLE_LIVE_SOURCES_AVAILABLE`
- `approvedSnapshotSha256`: `NOT_APPLICABLE_LIVE_SOURCES_AVAILABLE`

## Rule Boundary

D2W is a repository/check-out byte-portability foundation slice. It neither introduces nor changes a BOTC role, ability, interaction, night-order position, registration rule, impairment rule, Storyteller decision, character/alignment transition, product-visible game behavior, or domain-event schema.

The Mandatory Rule-Truth inquiry is therefore limited to confirming that the existing D2 no-rule-change boundary remains valid. This report does not select or define technical canonical-byte authority, Git storage policy, checkout normalization, or implementation architecture.

## Mandatory Sources

### 1. User overrides

- Path: `docs/rules/USER_OVERRIDES.md`
- Git blob at D2 design head `075000fc181ee50a110157f4ce62f89972323c77`: `180f3c6200667cb5dd8a4cf3106a0408e09454a9`
- Git blob at current inspected HEAD: `180f3c6200667cb5dd8a4cf3106a0408e09454a9`
- SHA-256: `2512a55464d7ebab4c5fadd9b7ca1a3a054c3b20b56245c855c69cb17662cb5c`
- Last changing commit: `7b12e707a3015b0c6434f7ff9b8e71458bc90838`
- Last changing commit timestamp: `2026-07-18T15:37:59+08:00`
- Retrieval date: `2026-08-07`
- Result: none of the six approved overrides applies to D2W.

### 2. User-specified Chinese Wiki

Current-page check:

- URL: `https://clocktower-wiki.gstonegames.com/?title=%E9%A6%96%E9%A1%B5`
- Retrieval date: `2026-08-07`
- HTTP status: `200`
- Retrieved bytes: `49,750`
- Response SHA-256: `63773bc829859af543c74d1f71eba102adbf046461fe37ac774781235916238e`
- Page metadata: `wgRevisionId=5855`, `wgCurRevisionId=5855`

Pinned live revision check:

- URL: `https://clocktower-wiki.gstonegames.com/api.php?action=query&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&format=json&formatversion=2&revids=5855`
- Retrieval date: `2026-08-07`
- HTTP status: `200`
- Revision: `5855`
- Parent revision: `5617`
- Revision timestamp: `2026-01-26T11:51:39Z`
- Retrieved bytes: `7,527`
- API-response SHA-256: `328fc817d3b522d1e56a75412f1ae221df54ec821628c6caea04e58800cad681`

The previously recorded raw `index.php?...oldid=5855&action=raw` route returned HTTP 403 to this client on 2026-08-07. This is not source unavailability: the live current page and the live pinned MediaWiki API both succeeded and independently identify revision `5855`.

### 3. Official BOTC Wiki

Current revision check:

- URL: `https://wiki.bloodontheclocktower.com/api.php?action=query&prop=revisions&titles=Main%20Page&rvprop=ids%7Ctimestamp&rvlimit=1&format=json&formatversion=2`
- Retrieval date: `2026-08-07`
- HTTP status: `200`
- Revision: `3035`
- Parent revision: `2946`
- Revision timestamp: `2025-12-10T10:19:41Z`
- Retrieved bytes: `205`
- API-response SHA-256: `9c28eebb430b96b687bbe38655107cad26fc120a1c0375c485a298371eec50bf`

Pinned live revision check:

- URL: `https://wiki.bloodontheclocktower.com/api.php?action=query&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&format=json&formatversion=2&revids=3035`
- Retrieval date: `2026-08-07`
- HTTP status: `200`
- Revision: `3035`
- Parent revision: `2946`
- Revision timestamp: `2025-12-10T10:19:41Z`
- Retrieved bytes: `3,093`
- API-response SHA-256: `06745ee02a529a72407dc7753d7f7f6caf9fca9580e0e951c4e225fc14fc02e0`
- Main-page URL: `https://wiki.bloodontheclocktower.com/`

### 4. Official nightsheet

- Main URL: `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json`
- Pinned URL: `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json`
- Pinned commit: `3d6d930a9e600321f93b2567a2e88948a675bc1e`
- Retrieval date: `2026-08-07`
- HTTP status for both URLs: `200`
- Retrieved bytes for both URLs: `2,923`
- SHA-256 for both responses: `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- Observed counts: `firstNight=80`, `otherNight=99`
- Result: the current main file is byte-identical to the pinned D2 source.

## D2 Evidence Reuse Chain

The repository evidence below supports the boundary classification but does not replace the fresh four-source check above.

### Direct reused evidence

- Path: `docs/rules/evidence/2B20B-P2F1R-D2.md`
- Original rule-evidence head recorded by D2: `418b2fdb1c68578fa279fe915307efb802402247`
- Verified unchanged at D2 design head: `075000fc181ee50a110157f4ce62f89972323c77`
- Git blob: `aca5f8935029151dd4dc8cbec0e89f28914942b4`
- SHA-256: `671827090c071cc1062dd9c2199da09dd27f983b24f80855bc976d9d0eeb6505`
- D2 verdict: `RULE_READY`
- D2 involved roles: `[]`
- D2 flags: all four impact flags `false`
- Reuse result: sufficient for D2W because D2W preserves the same no-role/no-rule/no-product/no-event-schema boundary and the mandatory live sources were freshly verified.

### Earlier supporting chain

- `docs/rules/evidence/2B20B-P2F1R-D.md`
  - Git blob: `cc6c8987f81f2dce73b112d8494acd27d5bd93d8`
  - SHA-256: `74703e74f478699a59b17f594708c963d820f8b7021593b8e78d9885c879ca53`
- `docs/rules/evidence/2B20B-P2F1R-D1.5R.md`
  - Git blob: `e5866a11d4e0ead799c472c32612db690fd2aff0`
  - SHA-256: `9c2d1a5b2a32268b599ab08bdbab02143955a73bffb54ea6f73f4ee3042249d4`
- `docs/rules/evidence/2B20B-P2F1R-D1.5E.md`
  - Git blob: `6ac1c5b3d5bd2576ebf0e0a5e9f705c40c1777bd`
  - SHA-256: `a9f37a0e87ed572f8349c15de55dd953fec1ff70b282ded29196d4b9ee08a981`
- `docs/rules/evidence/2B20B-P2F1R-D0.md`
  - Git blob: `8fa61186543c4778d092c6456fb29b7657795f69`
  - SHA-256: `928d645e4f20b5e51b33ecb096f0b052cf41249988e626c9e2af6ee616046edf`

## D0 Compatibility Classification

- `D0Compatibility`: `ENGINEERING_FACT_NOT_RULE_TRUTH`
- Historical D0 observation: `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY`
- Rule-truth result: this classifies repository checkout-byte behavior only. It does not constitute a BOTC rule, override, product behavior, event semantic, or rule-source conflict.
- Governance boundary: the architect/governance process must verify that any D2W design preserves the historical D0 contract. This rule report neither selects a canonical-byte authority nor adjudicates a technical implementation.

## Required Rule Evidence Fields

- `abilityRules`: `NONE_NOT_APPLICABLE`
- `firstNightOrder`: `UNCHANGED_AND_OUT_OF_SCOPE`
- `otherNightOrder`: `UNCHANGED_AND_OUT_OF_SCOPE`
- `interactions`: `NONE_NOT_APPLICABLE`
- `drunkennessRules`: `UNCHANGED_AND_OUT_OF_SCOPE`
- `poisoningRules`: `UNCHANGED_AND_OUT_OF_SCOPE`
- `VortoxRules`: `UNCHANGED_AND_OUT_OF_SCOPE`
- `characterChangeRules`: `UNCHANGED_AND_OUT_OF_SCOPE`
- `alignmentChangeRules`: `UNCHANGED_AND_OUT_OF_SCOPE`
- `storytellerDiscretion`: `UNCHANGED_AND_OUT_OF_SCOPE`

## Explicit Out of Scope

- Any role, ability, interaction, registration, reminder-token, or night-order change.
- Drunkenness, poisoning, Vortox, character-change, alignment-change, and Storyteller-discretion semantics.
- Product-visible behavior and domain-event schema changes.
- Existing test identity, profiles, selectors, ownership, routing, coverage, registries, and role-coverage promotion.
- Selection or definition of canonical-byte authority or repository normalization architecture.
- D2 recovery, D3 work, Hosted CI, or any implementation activity.

## Required Regression Obligations

1. D2W must retain all four impact flags as `false`.
2. `involvedRoles` must remain `[]`; no role-coverage status may be promoted.
3. No BOTC ability, interaction, registration, or night-order source data may change.
4. No approved user override may be reinterpreted or newly applied.
5. The D0 `LF_TO_CRLF_CHECKOUT_CONVERSION_ONLY` classification must remain an engineering compatibility fact, not rule authority.
6. D2 evidence may support the unchanged boundary, but byte checks, code, tests, CI, and repository summaries remain non-authoritative for BOTC rule truth.
7. Any later design that changes a role, rule semantic, product behavior, event schema, or one of the four impact flags requires a fresh Mandatory Rule-Truth gate.

## Conflicts and Coverage

- `unresolvedConflicts`: `[]`
- `substantiveSourceConflicts`: `[]`
- `sourceAvailability`: `ALL_FOUR_MANDATORY_SOURCES_AVAILABLE`
- `ruleCoverageStatus`: `SKELETON`
- `roleCoverageMatrixChangeRequired`: `false`
- Rationale: D2W is a non-role engineering foundation slice and implements no role mechanism; `PARTIAL` or `COMPLETE` coverage would be unsupported.

## Final Rule Verdict

`RULE_READY`
