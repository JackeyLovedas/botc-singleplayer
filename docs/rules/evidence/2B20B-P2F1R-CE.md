# Phase 3 Slice 2B20B-P2F1R-CE Rule Evidence

## Metadata

- `sliceId`: `2B20B-P2F1R-CE`
- `sliceName`: `C Evidence, Traceability, and Local Portability Closure`
- `retrievalDate`: `2026-08-03`
- `retrievalTimestamp`: `2026-08-03T12:58:36+08:00`
- `researchWorktree`: `C:\Users\wjl\AppData\Local\Temp\botc-ce-20260802-222509`
- `requestedResearchBaseHead`: `ac65163d3952ed4ea1b3955c5a7d712b4191a2a9`
- `governanceReentryHeadObservedDuringResearch`: `2861afcf4fe8d10e65d95e6ba89592962a86cb00`
- `branch`: `phase-3/2b20b-p2f1r-ce-c-evidence-portability-closure`
- `involvedRoles`: `[]`
- `structuralFixturesDoNotCreateInvolvedRoles`: `true`
- `applicableOverrides`: `[]`
- `coverageStatus`: `SKELETON`
- `ruleCoverageStatus`: `SKELETON`
- `sliceCoverageTarget`: `NON_ROLE_EVIDENCE_CLOSURE`
- `roleCoverageImpact`: `NONE`
- `roleCoverageChanged`: `false`
- `ruleSemanticsChanged`: `false`
- `acceptedBehaviorChanged`: `false`
- `productionBehaviorChanged`: `false`
- `snapshotUsed`: `false`
- `snapshotPath`: `NOT_USED`
- `snapshotHash`: `NOT_USED`
- `fixedRevisionManifestUsedAsLocator`: `true`
- `fixedRevisionManifestIsSnapshot`: `false`

CE closes only the still-open C evidence findings identified as F01, F02, F04, and F05: callable test evidence, declaration/branch-scoped static evidence, valid implementation traceability, and the resulting local evidence closure. D0 has already closed the separate Catalog checkout-portability prerequisite.

CE does not introduce, modify, interpret, validate, or implement a BOTC ability, role interaction, night order, event business meaning, accepted-history meaning, impairment rule, Vortox rule, character or alignment transition, or Storyteller decision. Existing C test data may contain role-named event structures, including Seamstress- or Mathematician-related structures, but those are non-authoritative structural fixtures and do not make those roles involved in CE.

## sourceUrls

SHA-256 values cover the exact canonical Git blob or fetched HTTP response bytes stated in each row.

| Source | Canonical source | Successfully verified fixed identity | retrievalDate | sourceRevision or oldid | Source timestamp | Availability and SHA-256 |
|---|---|---|---|---|---|---|
| User-approved overrides | `docs/rules/USER_OVERRIDES.md` | Git blob `180f3c6200667cb5dd8a4cf3106a0408e09454a9` | `2026-08-03` | containing commit `7b12e707a3015b0c6434f7ff9b8e71458bc90838` | `2026-07-18T15:37:59+08:00` | Canonical blob available; `11,434` bytes; SHA-256 `2512a55464d7ebab4c5fadd9b7ca1a3a054c3b20b56245c855c69cb17662cb5c`. Default-Windows checkout is `11,571` bytes with SHA-256 `9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5`; the difference is checkout CRLF representation only. |
| User-specified Chinese Wiki home | `https://clocktower-wiki.gstonegames.com/index.php?title=首页` | `https://clocktower-wiki.gstonegames.com/index.php?title=首页&oldid=5855&action=raw` | `2026-08-03` | `oldid/revid=5855`; parent `5617` | `2026-01-26T11:51:39Z` | Live fixed revision available with browser-compatible request headers; HTTP 200; `7,071` bytes; raw SHA-256 `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49`. Fixed revision API response was also live: `7,527` bytes; SHA-256 `328fc817d3b522d1e56a75412f1ae221df54ec821628c6caea04e58800cad681`. |
| Official BOTC Wiki | `https://wiki.bloodontheclocktower.com/` | `https://wiki.bloodontheclocktower.com/api.php?action=query&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&format=json&formatversion=2&revids=3035` | `2026-08-03` | Main Page `oldid/revid=3035`; parent `2946` | `2025-12-10T10:19:41Z` | Live fixed API revision available; HTTP 200; `3,093` bytes; SHA-256 `06745ee02a529a72407dc7753d7f7f6caf9fca9580e0e951c4e225fc14fc02e0`. The live current-revision query also returned `revid=3035`. |
| Official nightsheet | `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json` | `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json` | `2026-08-03` | last file-changing commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`; repository main observed at `915347e627c3f6cd1f438f82b6001784e11b3e8b` | file commit `2026-05-11T12:28:53Z`; main head `2026-07-08T11:49:08Z` | Pinned and main URLs both live; HTTP 200; `2,923` bytes; SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`; `80` first-night and `99` other-night entries. |

All four mandatory sources were independently read or retrieved. A generic automated request initially received HTTP 403 from the Chinese Wiki, but the same live fixed revision was then retrieved successfully with browser-compatible headers and its complete raw bytes matched the recorded fixed identity. Therefore the source is available and no fallback snapshot is needed.

No repository summary, code, test, README, prior evidence conclusion, or model memory was substituted for rule truth.

## fixedRevisionManifest

- `path`: `docs/rules/evidence/2B20B-P2F1R-D0-fixed-source-snapshot-manifest.md`
- `GitBlob`: `64816f361b90976f8b7c2180269f73b52878671c`
- `canonicalByteLength`: `6157`
- `canonicalSHA256`: `1f36f3f8b0261ec3fa71e15dd4dd4c1d2b8d79d3e1d2bec267b29e0e7c7d77e4`
- `classification`: `FIXED_REVISION_MANIFEST_NO_LOCAL_SNAPSHOT`
- `approvedSnapshotCount`: `0`
- `useInThisResearch`: The manifest supplied fixed identities to verify independently. It was not used as source-content fallback and cannot substitute for an approved snapshot if a live fixed source later becomes unavailable.

## sourceRevisionOrOldid

- User overrides: containing commit `7b12e707a3015b0c6434f7ff9b8e71458bc90838`; canonical blob `180f3c6200667cb5dd8a4cf3106a0408e09454a9`.
- Chinese Wiki home: `oldid=5855`; parent `5617`.
- Official BOTC Wiki Main Page: `oldid=3035`; parent `2946`.
- Official nightsheet: last file-changing commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`; observed repository main `915347e627c3f6cd1f438f82b6001784e11b3e8b`.

## User override applicability

Every approved record in `docs/rules/USER_OVERRIDES.md` was reviewed. None applies to CE:

- CE does not schedule Philosopher-gained abilities.
- CE does not define a Mathematician audit window.
- CE does not define duplicate-holder exclusion or temporal semantics.
- CE does not define the Mathematician numeric domain.
- CE does not attribute Dreamer/Vortox/drunkenness ledger causes.
- CE does not alter any accepted override or its scope.

`applicableOverrides: []`

## abilityRules

`NOT_APPLICABLE_TO_CE`.

CE makes no ability claim and implements or expands no role ability. A structurally valid role-named event fixture cannot establish that the named ability is correctly implemented, semantically legal, historically accepted, or complete.

## firstNightOrder

`UNCHANGED_AND_OUT_OF_SCOPE`.

The official nightsheet contains `80` first-night entries at the verified revision. CE does not add, remove, reorder, schedule, or settle a night task. No user-approved scheduling override is exercised or changed.

## otherNightOrder

`UNCHANGED_AND_OUT_OF_SCOPE`.

The official nightsheet contains `99` other-night entries at the verified revision. CE does not implement or modify other-night behavior or ordering.

## interactions

`NONE`.

CE adds no role interaction. Structural evidence for an existing event shape does not prove the corresponding role interaction, ability outcome, impairment cause, or accepted history.

The C structural boundary remains nonsemantic:

```text
STRUCTURALLY_VALID_ONLY
NOT_SEMANTICALLY_ACCEPTED
```

## drunkennessRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

CE neither derives nor evaluates drunkenness. Structural presence of an impairment-related field or array does not establish that a player is drunk, that an impairment source is genuine, or that the represented ability outcome follows BOTC rules.

## poisoningRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

CE neither derives nor evaluates poisoning. Structural validation or test coverage cannot establish poisoning provenance, duration, effectiveness, or information truth.

## VortoxRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

CE does not evaluate Townsfolk information, false-information constraints, Vortox effectiveness, lifecycle, death, or any Vortox interaction.

## characterChangeRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

CE performs no character change and does not validate character-change legality, timing, provenance, or historical meaning.

## alignmentChangeRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

CE performs no alignment change and does not validate alignment-change legality, timing, provenance, or historical meaning.

## storytellerDiscretion

`UNCHANGED_AND_OUT_OF_SCOPE`.

CE adds no Storyteller choice, legal-candidate computation, final selection, deterministic ruling, information policy, or discretion model.

## Rule-claim boundary

CE is a non-role engineering evidence closure. Its callable tests, static source audit, collected Vitest identities, traceability records, and cross-checkout local execution may prove only the frozen C structural-validation evidence mechanism.

They cannot prove that:

- a domain event actually occurred;
- an event came from an authorized producer;
- a payload is semantically or historically legal;
- a history is accepted, trusted, replayable, or canonical;
- an ability worked correctly;
- an impairment, character, alignment, Vortox, or Storyteller fact is true;
- a structural token authorizes append, rebuild, projection, or state mutation;
- Catalog V2 is runtime or rule authority;
- D0 constitutes P2F1R-D publication;
- any role gained implementation coverage;
- green tests replace independent rule verification.

D0’s Git-blob mechanism is test-time audit evidence only. The C1 typed structural schema AST remains the existing runtime structural-authority boundary. CE may not alter either boundary.

## explicitOutOfScope

- `BOTC_ABILITY_IMPLEMENTATION_OR_CHANGE`
- `ROLE_BEHAVIOR_IMPLEMENTATION_OR_CHANGE`
- `ROLE_INTERACTION_IMPLEMENTATION_OR_CHANGE`
- `FIRST_NIGHT_ORDER_CHANGE`
- `OTHER_NIGHT_ORDER_CHANGE`
- `EVENT_TYPE_OR_PAYLOAD_LANGUAGE_CHANGE`
- `EVENT_BUSINESS_SEMANTICS_CHANGE`
- `EVENT_PRODUCER_CHANGE`
- `SEMANTIC_VALIDATOR_CHANGE`
- `C_PRODUCTION_BEHAVIOR_CHANGE`
- `C1_AST_AUTHORITY_CHANGE`
- `C1_CATALOG_GENERATION_CHANGE`
- `CATALOG_V2_CONTENT_OR_EXPECTED_DIGEST_CHANGE`
- `CATALOG_V2_RUNTIME_OR_RULE_AUTHORITY`
- `DRUNKENNESS_OR_POISONING_BEHAVIOR`
- `IMPAIRMENT_PROVENANCE_TRUTH`
- `VORTOX_BEHAVIOR`
- `CHARACTER_CHANGE_OR_ALIGNMENT_CHANGE`
- `STORYTELLER_DISCRETION`
- `ACCEPTED_HISTORY_OR_REPLAY_AUTHORITY`
- `CANONICAL_STATE_OR_SNAPSHOT_AUTHORITY`
- `APPLICATION_COMMAND_OR_ACCEPTED_STREAM_AUTHORITY`
- `P2F_TRUSTED_ACCEPTED_HISTORY_AUTHORITY`
- `P2F1R_D_PUBLICATION`
- `HOSTED_CI_PUBLICATION_EVIDENCE`
- `OWNERSHIP_OR_COVERAGE_PROFILE_CHANGE`
- `WORKFLOW_OR_GIT_POLICY_CHANGE`
- `ROLE_COVERAGE_PROMOTION`
- `PROTECTED_OLD_WORKTREE_MUTATION`
- `NEW_ROLE_TEST_FIXTURE_AS_RULE_AUTHORITY`
- `NEW_USER_OVERRIDE`

## unresolvedConflicts

`[]`

No substantive source conflict exists:

- No approved user override applies to CE.
- The Chinese Wiki and official BOTC Wiki do not define repository test identities, static source-audit mechanisms, implementation traceability fields, or checkout representations.
- The official nightsheet defines night-order data but does not govern CE’s evidence mechanism.
- CE makes no BOTC semantic claim on which the mandatory sources disagree.
- Source silence about engineering evidence must not be reinterpreted as a BOTC rule.

## requiredRegressionTests

These are rule-boundary obligations, not frozen physical test titles, fixture IDs, primary layers, or engineering traceability bindings.

1. Prove CE changes no production source, event definition, payload language, semantic validator, producer, replay behavior, state behavior, projection behavior, or application behavior.
2. Preserve the boundary that structural validation establishes shape only and never establishes semantic validity, accepted history, producer authority, replay authority, or role correctness.
3. Ensure every role-named structural case remains explicitly non-normative and cannot be cited as implementation of that role’s ability or interaction.
4. Preserve all first-night and other-night ordering; CE must add, remove, or reorder no nightsheet entry.
5. Preserve all approved user overrides unchanged and make no claim that CE exercises or completes one.
6. Preserve drunkenness, poisoning, Vortox, character-change, alignment-change, and Storyteller semantics as unchanged and outside CE.
7. Preserve C1’s typed structural schema AST as runtime structural authority; no test, Catalog file, hash, manifest, or traceability document may replace it.
8. Preserve Catalog V2 as audit-only and checkout-independent under D0; no worktree representation, Git blob, digest, or portability result may become rule, runtime, semantic, or accepted-history authority.
9. Prove callable and static evidence closure does not change the accepted runtime input set or public diagnostic behavior.
10. Prove traceability correction reports only real evidence and does not manufacture semantic proof, accepted-stream proof, or rule completeness.
11. Prove no role coverage row or status is promoted because of CE.
12. Treat all green tests and local dual-checkout results as engineering evidence only; independent rule-source verification remains mandatory.
13. Preserve all unsupported role behavior as unsupported.
14. Stop if closing an evidence finding requires a production, rule-semantic, role-behavior, C1-authority, Catalog-content, nightsheet, override, or role-coverage change.

## Coverage conclusion

- `coverageStatus`: `SKELETON`
- `ruleCoverageStatus`: `SKELETON`
- `sliceCoverageTarget`: `NON_ROLE_EVIDENCE_CLOSURE`
- `involvedRoles`: `[]`
- `roleCoverageImpact`: `NONE`
- `roleCoverageChanged`: `false`
- `ruleSemanticsChanged`: `false`
- `acceptedBehaviorChanged`: `false`
- `ROLE_COVERAGE_MATRIX status promotion required`: `false`

`SKELETON` is required because the evidence schema permits only `SKELETON`, `PARTIAL`, or `COMPLETE`, while CE implements no role-rule mechanism. `PARTIAL` or `COMPLETE` would falsely imply new BOTC behavior coverage. No role may be promoted because callable evidence, static evidence, traceability, or checkout portability became stronger.

## Final rule verdict

All four mandatory sources were available and independently checked at fixed identities. No approved snapshot or model-memory substitution was used. No substantive external-rule disagreement applies to this nonsemantic evidence-only slice.

`RULE_READY`
