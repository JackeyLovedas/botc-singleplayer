# Phase 3 Slice 2B20B-P2F1R-D Rule Evidence

## Metadata

- `sliceId`: `2B20B-P2F1R-D`
- `sliceName`: `Publication Governance`
- `retrievalDate`: `2026-08-03`
- `retrievalTimestamp`: `2026-08-03T18:58:05+08:00`
- `researchHead`: `f937c9830bb0618b0249bf103b64ce9e88950e7e`
- `branch`: `phase-3/2b20b-p2f1r-ce-c-evidence-portability-closure`
- `involvedRoles`: `[]`
- `applicableOverrides`: `[]`
- `ruleCoverageStatus`: `SKELETON`
- `sliceCoverageTarget`: `NON_ROLE_PUBLICATION_GOVERNANCE`
- `requiredRuleChanges`: `none`
- `ruleSemanticsChanged`: `false`
- `acceptedBehaviorChanged`: `false`
- `roleCoverageChanged`: `false`
- `snapshotUsed`: `false`
- `snapshotPath`: `NOT_USED`
- `snapshotHash`: `NOT_USED`

P2F1R-D is a non-role publication-governance slice. It may publish and verify
ownership, routing, exact-source coverage, hosted cross-platform evidence, and
complete review-output bindings for the already frozen A, B, C1, C, D0, and CE
work. It does not introduce, modify, interpret, validate, or implement a BOTC
ability, role interaction, night order, impairment rule, Vortox rule,
character or alignment transition, Storyteller decision, event business
meaning, accepted-history meaning, or trusted-history authority.

## Mandatory source URLs, revisions, timestamps, and hashes

SHA-256 values cover the exact canonical Git blob or fetched HTTP response
bytes identified in each row.

| Source | Canonical source | Exact fixed input | Revision authority | Source timestamp | Availability and exact bytes |
|---|---|---|---|---|---|
| User-approved overrides | `docs/rules/USER_OVERRIDES.md` | `git-object://180f3c6200667cb5dd8a4cf3106a0408e09454a9` | last-changing/containing commit `7b12e707a3015b0c6434f7ff9b8e71458bc90838`; blob `180f3c6200667cb5dd8a4cf3106a0408e09454a9` | `2026-07-18T15:37:59+08:00` | Live canonical repository object; `11,434` bytes; SHA-256 `2512a55464d7ebab4c5fadd9b7ca1a3a054c3b20b56245c855c69cb17662cb5c` |
| User-specified Chinese Wiki home | `https://clocktower-wiki.gstonegames.com/index.php?title=%E9%A6%96%E9%A1%B5` | API: `https://clocktower-wiki.gstonegames.com/api.php?action=query&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&format=json&formatversion=2&revids=5855`; raw: `https://clocktower-wiki.gstonegames.com/index.php?title=%E9%A6%96%E9%A1%B5&oldid=5855&action=raw` | `oldid/revid=5855`; parent `5617` | `2026-01-26T11:51:39Z` | Both fixed inputs live; API `7,527` bytes, SHA-256 `328fc817d3b522d1e56a75412f1ae221df54ec821628c6caea04e58800cad681`; raw `7,071` bytes, SHA-256 `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49` |
| Official BOTC Wiki | `https://wiki.bloodontheclocktower.com/` | `https://wiki.bloodontheclocktower.com/api.php?action=query&prop=revisions&rvprop=ids%7Ctimestamp%7Ccontent&rvslots=main&format=json&formatversion=2&revids=3035` | Main Page `oldid/revid=3035`; parent `2946` | `2025-12-10T10:19:41Z` | Live fixed API response; `3,093` bytes; SHA-256 `06745ee02a529a72407dc7753d7f7f6caf9fca9580e0e951c4e225fc14fc02e0` |
| Official nightsheet | `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json` | `https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json` | last file-changing commit `3d6d930a9e600321f93b2567a2e88948a675bc1e`; repository main observed at `915347e627c3f6cd1f438f82b6001784e11b3e8b` | file commit `2026-05-11T12:28:53Z`; observed main `2026-07-08T11:49:08Z` | Pinned and main inputs live; `2,923` bytes; SHA-256 `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`; `80` first-night and `99` other-night entries |

All four mandatory sources were live at their fixed identities. No repository
snapshot, approved snapshot, cached rule summary, code behavior, test behavior,
README statement, or model memory was substituted for rule truth.

## Fixed-source and predecessor evidence identities

These hashes identify predecessor evidence context; they do not replace the
mandatory live source review above.

| Evidence context | Canonical SHA-256 | Classification |
|---|---|---|
| Historical `docs/rules/evidence/2B20B-P2F1R-C.md` | `5e8e45da7e1f0f3fba7b10514f67d8545a8f7032e540c5b3beec163ff73b13d1` | Absent at requested HEAD; recovered historical Git object only; non-authoritative context |
| `docs/rules/evidence/2B20B-P2F1R-C1.md` | `a484067a98056e83d11f9b41fadfa1140d738c811850a139075bd57cfe0650fe` | Predecessor boundary evidence |
| `docs/rules/evidence/2B20B-P2F1R-CE.md` | `30dd9af61008298a6202bca0f4b7008d59b9ca8a8ecd95b2b10aaeb5e0df75fb` | Predecessor evidence-closure boundary |
| `docs/rules/evidence/2B20B-P2F1R-D0.md` | `928d645e4f20b5e51b33ecb096f0b052cf41249988e626c9e2af6ee616046edf` | Predecessor portability-foundation boundary |
| `docs/rules/evidence/2B20B-P2F1R-D0-fixed-source-snapshot-manifest.md` | `1f36f3f8b0261ec3fa71e15dd4dd4c1d2b8d79d3e1d2bec267b29e0e7c7d77e4` | Fixed-revision locator manifest; no local snapshot |
| `docs/rules/ROLE_COVERAGE_MATRIX.md` | `71518aeb76ce392814799e9fbc0c21ab384339fef0bb1f3fee84edced6cdec15` | Current role-status authority to preserve |

The D0 manifest was used only to cross-check fixed identities. It is
`FIXED_REVISION_MANIFEST_NO_LOCAL_SNAPSHOT`, has no copied source body, and is
not a fallback snapshot.

## User override applicability

Every entry in the exact canonical `USER_OVERRIDES.md` blob was reviewed. None
applies to publication mechanics:

- D does not schedule Philosopher-gained abilities;
- D does not define a Mathematician window, value domain, duplicate-holder
  exclusion, or temporal rule;
- D does not attribute Dreamer, Vortox, or drunkenness causes;
- D changes no override text, scope, ordering, applicability, or accepted
  behavior.

The override blob must remain byte-identical. `applicableOverrides=[]`.

## abilityRules

`NOT_APPLICABLE_TO_D`.

D makes no ability claim. Publication of a test identity, ownership record,
coverage tuple, artifact, log, or green gate cannot establish that an ability
is correct, supported, accepted, replayable, or complete.

## firstNightOrder

`UNCHANGED_AND_OUT_OF_SCOPE`.

At the fixed official nightsheet revision there are `80` entries. The exact
zero-based indices relevant to the frozen predecessor context are Dreamer `60`,
Seamstress `61`, and Mathematician `76`. D does not add, remove, reorder,
schedule, open, settle, or reinterpret a first-night task.

## otherNightOrder

`UNCHANGED_AND_OUT_OF_SCOPE`.

At the fixed official nightsheet revision there are `99` entries. The exact
zero-based indices relevant to the frozen predecessor context are Dreamer `78`,
Seamstress `82`, and Mathematician `95`. D does not add, remove, reorder,
schedule, open, settle, or reinterpret an other-night task.

## interactions

`NONE`.

D introduces no role interaction. Cross-file identity, routing, coverage, or
platform evidence is an engineering relation, not a BOTC interaction.

## impairmentRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

D neither derives nor evaluates an impairment, its source, effectiveness,
duration, provenance, or consequence.

## drunkennessRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

D adds no drunkenness behavior or evidence of drunkenness truth.

## poisoningRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

D adds no poisoning behavior or evidence of poisoning truth.

## VortoxRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

D does not evaluate information truth, Vortox effectiveness, false-information
constraints, lifecycle, attribution, or interaction.

## characterChangeRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

D performs no character change and validates no character-change legality,
state, or history.

## alignmentChangeRules

`UNCHANGED_AND_OUT_OF_SCOPE`.

D performs no alignment change and validates no alignment-change legality,
state, or history.

## storytellerDiscretion

`UNCHANGED_AND_OUT_OF_SCOPE`.

D supplies no Storyteller choice, candidate set, final selection, information
policy, deterministic ruling, or discretion model.

## Rule-claim boundary

Ownership registries, test routing, exact-source coverage profiles, checkout
representations, hashes, artifacts, logs, CI results, and review-publication
records are engineering evidence only. They are not BOTC rule authority,
runtime structural authority, semantic event authority, accepted-history
authority, replay authority, canonical-state authority, or trusted-history
authority.

The C1 typed structural schema AST remains the sole runtime structural-authority
boundary. D must not promote Catalog V2, a generated document, a digest, a test,
a coverage profile, a traceability record, or hosted evidence to structural or
semantic authority.

D must not claim that green evidence proves:

- an event occurred or came from an authorized producer;
- a payload or event is semantically or historically valid;
- a stream is accepted, replayable, canonical, or trusted;
- an impairment, Vortox, character, alignment, or Storyteller fact is true;
- a role ability or interaction is implemented or complete;
- unsupported behavior became supported.

## explicitOutOfScope

- `BOTC_ABILITY_IMPLEMENTATION_OR_CHANGE`
- `ROLE_BEHAVIOR_IMPLEMENTATION_OR_CHANGE`
- `ROLE_INTERACTION_IMPLEMENTATION_OR_CHANGE`
- `FIRST_NIGHT_ORDER_CHANGE`
- `OTHER_NIGHT_ORDER_CHANGE`
- `EVENT_TYPE_PAYLOAD_OR_BUSINESS_SEMANTICS_CHANGE`
- `EVENT_PRODUCER_OR_SEMANTIC_VALIDATOR_CHANGE`
- `DRUNKENNESS_POISONING_OR_IMPAIRMENT_BEHAVIOR`
- `VORTOX_BEHAVIOR_OR_ATTRIBUTION`
- `CHARACTER_OR_ALIGNMENT_CHANGE`
- `STORYTELLER_DISCRETION`
- `C1_AST_RUNTIME_AUTHORITY_CHANGE`
- `CATALOG_V2_RUNTIME_AUTHORITY`
- `ACCEPTED_HISTORY_REPLAY_OR_TRUSTED_HISTORY_AUTHORITY`
- `CANONICAL_STATE_OR_SNAPSHOT_AUTHORITY`
- `USER_OVERRIDE_CHANGE`
- `NIGHTSHEET_CHANGE`
- `TEST_IDENTITY_OR_TRACEABILITY_CHANGE_FOR_RULE_CONVENIENCE`
- `ROLE_COVERAGE_PROMOTION`
- `DREAMER_SEAMSTRESS_PHILOSOPHER_MATHEMATICIAN_OR_VORTOX_EXPANSION`
- `P2F_PRODUCT_INTEGRATION`
- `D_IMPLEMENTATION_BEFORE_RULE_AND_DESIGN_GATES`

## unresolvedConflicts

`[]`

No substantive rule conflict exists:

- no approved user override applies to publication governance;
- the Chinese and official Wikis do not define repository ownership, routing,
  coverage profiles, checkout bytes, hosted artifacts, or review archives;
- the official nightsheet defines order data but does not govern D publication
  mechanics;
- source silence about engineering evidence is not a BOTC rule;
- D makes no BOTC semantic claim on which the mandatory sources disagree.

## requiredRegressionTests

These are rule-boundary obligations for the future bounded D design. They do
not freeze a physical test title, fixture ID, routing implementation, workflow
step, coverage tuple, or ownership-registry shape.

1. Prove D changes zero production behavior, event meaning, semantic validation, accepted behavior, or rule semantics.
2. Preserve the C1 typed structural schema AST as the sole runtime structural authority; no Catalog, digest, document, test, profile, traceability row, or hosted artifact may replace it.
3. Treat ownership, routing, coverage, checkout, log, artifact, CI, and review-publication results only as engineering evidence, never as game-rule or semantic proof.
4. Establish no accepted-history, replay, canonical-state, or trusted-history authority, and do not weaken any existing provenance boundary.
5. Preserve `docs/rules/USER_OVERRIDES.md` byte-identically and preserve every override's meaning, scope, and applicability.
6. Preserve the official nightsheet byte/order authority and the exact Dreamer, Seamstress, and Mathematician first/other-night indices; add, remove, or reorder no entry.
7. Preserve every unsupported behavior as unsupported; absence of a failing test or presence of green evidence cannot promote support.
8. Preserve role coverage exactly: Dreamer `PARTIAL`, Seamstress `PARTIAL`, Philosopher `PARTIAL`, Mathematician `PARTIAL`, and Vortox `NOT_STARTED`.
9. Permit only a no-status-change documentation update to `docs/rules/ROLE_COVERAGE_MATRIX.md` if D publication provenance must be recorded; no role may be promoted or reclassified.
10. Treat green local, cross-worktree, coverage, ownership, or hosted evidence as engineering evidence only; it cannot replace fresh independent rule review.
11. Stop immediately if D publication requires a production, rule-semantic, accepted-behavior, role-behavior, night-order, override, C1-authority, trusted-history, test-identity, Traceability, or role-status change.

## Coverage conclusion

- `ruleCoverageStatus`: `SKELETON`
- `sliceCoverageTarget`: `NON_ROLE_PUBLICATION_GOVERNANCE`
- `involvedRoles`: `[]`
- `applicableOverrides`: `[]`
- `requiredRuleChanges`: `none`
- `ruleSemanticsChanged`: `false`
- `acceptedBehaviorChanged`: `false`
- `roleCoverageChanged`: `false`
- `DreamerRoleCoverage`: `PARTIAL`
- `SeamstressRoleCoverage`: `PARTIAL`
- `PhilosopherRoleCoverage`: `PARTIAL`
- `MathematicianRoleCoverage`: `PARTIAL`
- `VortoxRoleCoverage`: `NOT_STARTED`
- `ROLE_COVERAGE_MATRIX status promotion required`: `false`

`SKELETON` is required because the evidence schema permits only `SKELETON`,
`PARTIAL`, or `COMPLETE`, while D implements no role-rule mechanism. `PARTIAL`
or `COMPLETE` would falsely claim new BOTC behavior coverage.

## Final rule verdict

All four mandatory fixed sources were live and independently reviewed. No
snapshot or model-memory substitution was used. No approved override applies,
no source conflict exists, and D requires no rule or accepted-behavior change.
This verdict authorizes only the separately controlled bounded D design gate;
it does not authorize implementation, ownership execution, coverage execution,
workflow mutation, hosted CI, push, PR, merge, publication acceptance, or
trusted-history authority.

RULE_READY
