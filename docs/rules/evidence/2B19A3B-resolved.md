# Phase 3 Slice 2B19A3B Resolved Rule Evidence

## Metadata

- `sliceId`: `2B19A3B-resolved`
- `involvedRoles`: `dreamer`, `philosopher`, `vortox`, `mathematician`; `no-dashii` is referenced only as an explicitly out-of-scope poisoning source.
- `retrievalDate`: `2026-07-18T15:30:38+08:00`
- `retrievalTimezone`: `Asia/Shanghai`
- `ruleCoverageStatus`: `PARTIAL`
- `ruleSemanticsChanged`: `false`
- `simulatorAuditPolicyAdded`: `true`
- `approvedSnapshotsUsed`: `[]`
- `externalSourceRevisionChanged`: `false`
- `externalSourceHashChanged`: `false`
- `unresolvedConflicts`: `[]`

## Resolution basis

- Original immutable evidence: `docs/rules/evidence/2B19A3B.md`, SHA-256 `5412f6926edabea465b55c4727b2ced236ad43469f4995567a4c0c05df0ee3c2`.
- Original immutable governance precheck: `docs/architecture/2B19A3B-go-no-go-under-governance-v1.md`, SHA-256 `372cf3ddddc18a53cf8d0f71a69b4510c410ecd649c3830839afb4468968fde9`.
- Role coverage authority: `docs/rules/ROLE_COVERAGE_MATRIX.md`, SHA-256 `a32d8e32c98eb65e2b5960b966aab1450f3fc84402e3a0d20c4563968aad7f64`.
- Approved policy: `BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1`.
- Authorization: `USER_AUTHORIZED_BOTC_SIM_DREAMER_VORTOX_DRUNK_LEDGER_ATTRIBUTION_V1`.
- The original evidence returned `RULE_CONFLICT` only because mandatory external sources do not specify internal ledger cause cardinality. The approved policy closes that simulator-only ambiguity without rewriting the original evidence or changing any external rule claim.

## User-approved authority

- Source: `docs/rules/USER_OVERRIDES.md` at repository baseline `1767333e5ba634eb0016743e35f61fc7d6b2faa0`.
- Previous file SHA-256: `2052994a6bf17be4715ac50a8e67be43fa7bfc457df5f694589bcd2f59430624`.
- Current file SHA-256: `2512a55464d7ebab4c5fadd9b7ca1a3a054c3b20b56245c855c69cb17662cb5c`.
- The only change is the exact approved `BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1` record; no prior override is modified or removed.
- Applicable existing policies: `BOTC-SIM-PHILOSOPHER-FIRST-NIGHT-SCHEDULING-V1`, `BOTC-SIM-MATHEMATICIAN-FIRST-NIGHT-WINDOW-V1`, `BOTC-SIM-MATHEMATICIAN-OWN-ABILITY-EXCLUSION-V1`, `BOTC-SIM-MATHEMATICIAN-NUMERIC-DOMAIN-V1`, and `BOTC-SIM-MATHEMATICIAN-DUPLICATE-HOLDER-TEMPORAL-V1`.
- No external source claim is overridden. The new record supplies only deterministic simulator audit attribution.

## Source URLs, revisions, timestamps, and hashes

All sources below were retrieved live. The generic connector returned HTTP 403 for the Chinese Wiki, but its rendered pages and pinned `oldid` raw endpoints returned HTTP 200 and matched the recorded live revisions and hashes.

| Source | URL | Revision | Revision timestamp | SHA-256 |
|---|---|---:|---|---|
| Chinese Wiki 首页 | https://clocktower-wiki.gstonegames.com/index.php?title=%E9%A6%96%E9%A1%B5&oldid=5855 | `5855` | `2026-01-26 19:51+08:00` | `2a26fff7526bd1b6b20cd0f4044288dd7b348d39a1f933fd65a67c3f242ddb49` |
| Chinese Wiki 筑梦师 | https://clocktower-wiki.gstonegames.com/index.php?title=%E7%AD%91%E6%A2%A6%E5%B8%88&oldid=3046&action=raw | `3046` | `2023-04-18 12:58+08:00` | `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7` |
| Chinese Wiki 哲学家 | https://clocktower-wiki.gstonegames.com/index.php?title=%E5%93%B2%E5%AD%A6%E5%AE%B6&oldid=5125&action=raw | `5125` | `2025-03-27 19:33+08:00` | `9b1c00ed6cef563836b1a7b1eeae9d531ed19674fce690138dff7e29436601be` |
| Chinese Wiki 涡流 | https://clocktower-wiki.gstonegames.com/index.php?title=%E6%B6%A1%E6%B5%81&oldid=6198&action=raw | `6198` | `2026-06-13 11:21+08:00` | `36716eb890bd93b2fed5d27f67ccdc6c7a13fa67900a4a11a685580c0c3608ff` |
| Chinese Wiki 醉酒 | https://clocktower-wiki.gstonegames.com/index.php?title=%E9%86%89%E9%85%92&oldid=5720&action=raw | `5720` | `2025-12-09 10:27+08:00` | `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e` |
| Chinese Wiki 中毒 | https://clocktower-wiki.gstonegames.com/index.php?title=%E4%B8%AD%E6%AF%92&oldid=6294&action=raw | `6294` | `2026-07-01 16:21+08:00` | `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0` |
| Chinese Wiki 数学家 | https://clocktower-wiki.gstonegames.com/index.php?title=%E6%95%B0%E5%AD%A6%E5%AE%B6&oldid=6214&action=raw | `6214` | `2026-06-13 20:07+08:00` | `171fe4a63517059c4a918cdb1d8f172cc2f5bcbd67910ed568b721548c8feb6e` |
| Official Main Page | https://wiki.bloodontheclocktower.com/index.php?title=Main_Page&oldid=3035 | `3035` | `2025-12-10T10:19:41Z` | `7511e03e6813d4c100b8c01a21e5468d9d255b1235626b118a7d4be4042d13c1` |
| Official Dreamer | https://wiki.bloodontheclocktower.com/index.php?title=Dreamer&oldid=2904 | `2904` | `2025-09-24T08:39:30Z` | `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c` |
| Official Philosopher | https://wiki.bloodontheclocktower.com/index.php?title=Philosopher&oldid=2421 | `2421` | `2024-10-07T14:56:47Z` | `a1e732b502b18dd2edf5dc33bc82cd8fac80c20dccf9563f11236ed96991f365` |
| Official Vortox | https://wiki.bloodontheclocktower.com/index.php?title=Vortox&oldid=3017 | `3017` | `2025-11-19T16:16:01Z` | `4630f76e5bf06ee9e9990854708fabed2a25b9d3c6ea170e2fd4598ef5f5cf07` |
| Official Mathematician | https://wiki.bloodontheclocktower.com/index.php?title=Mathematician&oldid=3109 | `3109` | `2026-07-08T12:25:10Z` | `a4a636789b745fd6f7452f11647a561bc51f1f46ed6ee5623f6b8d1652f33e8b` |
| Official States | https://wiki.bloodontheclocktower.com/index.php?title=States&oldid=1039 | `1039` | `2023-03-23T01:23:10Z` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| Official Abilities | https://wiki.bloodontheclocktower.com/index.php?title=Abilities&oldid=1376 | `1376` | `2023-04-18T15:12:18Z` | `7cc7632e73e8ebf3f07d747bd15b3c5ff6db7db20e45c3889e16bc601a479b40` |
| Official nightsheet live main | https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/main/resources/data/nightsheet.json | repository `915347e627c3f6cd1f438f82b6001784e11b3e8b`; file change `3d6d930a9e600321f93b2567a2e88948a675bc1e` | repository `2026-07-08T11:49:08Z`; file change `2026-05-11T12:28:53Z` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |
| Official nightsheet pinned | https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/915347e627c3f6cd1f438f82b6001784e11b3e8b/resources/data/nightsheet.json | repository `915347e627c3f6cd1f438f82b6001784e11b3e8b` | `2026-07-08T11:49:08Z` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |
| Official nightsheet file-change pin | https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/3d6d930a9e600321f93b2567a2e88948a675bc1e/resources/data/nightsheet.json | file change `3d6d930a9e600321f93b2567a2e88948a675bc1e` | `2026-05-11T12:28:53Z` | `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75` |

## abilityRules

1. Dreamer selects a player and learns one native GOOD character and one native EVIL character; under normal effective information one of those characters is the target's actual character.
2. Philosopher gains the chosen character ability without becoming that character. If the chosen character is already in play, the original character is drunk.
3. A drunk character has no ability, while the Storyteller continues the apparent procedure and may provide information consistent with drunkenness.
4. While Vortox is canonically effective, Townsfolk information must be false even when the information source is drunk or poisoned.
5. Therefore the fixed interaction still delivers exactly one native GOOD and one native EVIL character, and both must exclude the target's settlement-time true character.
6. The approved override does not alter these external mechanics; it fixes only the simulator's terminal ledger attribution.

## firstNightOrder

- Official first-night list length: `80`.
- Philosopher: zero-based `13`, one-based `14`.
- Dreamer: zero-based `60`, one-based `61`.
- Mathematician: zero-based `76`, one-based `77`.
- Vortox has no first-night wake entry.
- Philosopher therefore resolves before Dreamer. The approved scheduling policy keeps base-role tasks before Philosopher-gained tasks where duplicate holders are supported.

## otherNightOrder

- Official other-night list length: `99`.
- Philosopher: zero-based `10`, one-based `11`.
- Vortox: zero-based `46`, one-based `47`.
- Dreamer: zero-based `78`, one-based `79`.
- Mathematician: zero-based `95`, one-based `96`.
- Other-night behavior is recorded for source completeness and is explicitly out of scope for this Slice.

## interactions

- The accepted Philosopher choice produces canonical positive historical DRUNK evidence for the original base Dreamer.
- With exactly one canonically effective current Vortox, that drunk Dreamer's pair must be false: one native GOOD and one native EVIL role, both excluding the target's settlement-time true role.
- The resolved audit policy creates exactly one Dreamer terminal fact: `ABNORMAL / VORTOX_FALSE_INFORMATION / causedByAnotherCharacterAbility=true`.
- The exact Philosopher-produced DRUNK remains mandatory `ABILITY_IMPAIRMENT` evidence. It creates neither a second cause entry nor a second terminal fact.
- This is a simulator primary-audit attribution policy, not an external-rule claim that Vortox is the only real-world cause.
- Mathematician counts the qualifying Dreamer player at most once, not once per mechanic, evidence item, cause field, or ledger edge.

## drunkennessRules

- A canonical drunk Dreamer has no ability but may receive apparent Dreamer procedure and information.
- Without effective Vortox, apparent drunk information may be true or false while retaining the Dreamer output shape.
- With effective Vortox, the information must be false.
- Exact positive Philosopher-produced DRUNK evidence is mandatory for the approved success path.
- Missing, mismatched, duplicate, or conflicting impairment histories are not authorized success paths and must fail closed.

## poisoningRules

- External sources establish that effective Vortox also forces poisoned Townsfolk information false.
- The approved override excludes POISONED plus Vortox, and the current accepted repository has no R1 canonical base-Dreamer poisoning producer.
- No poisoned-source success path is authorized by this evidence.

## VortoxRules

- The success path requires exactly one current, alive, canonically effective Vortox.
- Vortox is a continuous false-information constraint; it does not change Dreamer's one-GOOD/one-EVIL output shape.
- Drunk, poisoned, dead, duplicate, stale, or otherwise unprovable Vortox applicability is unsupported and must fail closed.
- This evidence does not authorize a generic modifier-precedence engine.

## characterChangeRules

- Philosopher gaining an ability is not a character change.
- Dreamer target truth is evaluated at settlement time. A change before settlement updates the truth used; a later change must not rewrite delivered historical information.
- General character-change producers and gained-Dreamer settlement remain out of scope.

## alignmentChangeRules

- Alignment and native character type are independent; the pair remains one native GOOD and one native EVIL character.
- An alignment-only change is not an excluded character change and does not by itself alter the target's character identity.
- Alignment-change notices are not Vortox Townsfolk information.
- General alignment-change producers are out of scope.

## storytellerDiscretion

- Without effective Vortox, a drunk Dreamer's apparent information may be true or false.
- With effective Vortox, the delivered pair cannot contain the target's true character.
- Selection among legal false candidates remains Storyteller discretion and the roles need not be out of play.
- Free Storyteller-choice persistence is out of scope, and the approved override does not change candidate legality or selection policy.

## Resolved ledger attribution

```text
terminalFactCount=1
outcomeStatus=ABNORMAL
causeKind=VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility=true
philosopherProducedDrunkEvidence=REQUIRED_EXACT_POSITIVE_ABILITY_IMPAIRMENT
secondCauseEntry=false
secondTerminalFact=false
```

- `multiCauseRequired=false` only within the fixed approved scope.
- This does not decide or constrain a future general multi-cause model.
- The existing Mathematician distinct-player model counts the Dreamer source at most once.

## explicitOutOfScope

- POISONED plus Vortox.
- Multiple, duplicate, or conflicting impairments.
- Drunk, poisoned, dead, duplicate, stale, or ineffective Vortox.
- No Dashii poisoning derivation.
- Philosopher-gained Dreamer and multiple-Dreamer attribution.
- Later nights, death, and general impairment lifecycle.
- Travellers and free Storyteller-choice persistence.
- General character-change or alignment-change producers.
- A general multi-cause ledger, cause array, cause graph, new evidence variant, new event type, new `GameState` field, or generic effect engine.
- Reinterpretation of accepted histories, role `COMPLETE`, architectural design, implementation, or final review claims.

## requiredRegressionTests

1. An accepted Philosopher command chooses Dreamer and produces the exact canonical DRUNK impairment for the original base Dreamer.
2. The impairment is active before the base Dreamer resolves.
3. Exactly one current effective Vortox forces false information.
4. The output remains exactly one native GOOD and one native EVIL character.
5. A GOOD target's settlement-time true role is excluded from both results.
6. An EVIL target's settlement-time true role is excluded from both results.
7. Exactly one terminal fact has `ABNORMAL / VORTOX_FALSE_INFORMATION / true`.
8. The terminal fact contains the exact positive `ABILITY_IMPAIRMENT` evidence.
9. No second `SOURCE_DRUNKENNESS` cause or terminal fact is produced.
10. Mathematician counts the Dreamer player exactly once within the applicable window.
11. Missing, stale, wrong-source, wrong-target, wrong-kind, duplicate, or conflicting impairment evidence fails closed.
12. Missing, duplicate, stale, conflicting, or ineffective Vortox authority fails closed.
13. Accepted 2B19A3A effective-source Vortox behavior remains unchanged.
14. Drunk Dreamer without effective Vortox remains unsupported by this Slice and does not gain a new success path.
15. Poisoned Dreamer does not gain a success path.
16. Drunk, poisoned, dead, or otherwise ineffective Vortox does not gain a success path.
17. Accepted V1, V2, and V3 history meanings remain unchanged.
18. Later character-state changes do not rewrite delivered historical information.
19. First-night ordering matches the pinned official nightsheet and approved scheduler policy.
20. Player, AI, and non-source projections do not expose DRUNK, Philosopher, Vortox, causes, tenure, or target truth.
21. Hostile runtime shapes and unprovable canonical histories fail closed without a receipt.

## roleCoverageStatus

- Dreamer: `PARTIAL`.
- Philosopher: `PARTIAL`.
- Mathematician: `PARTIAL`.
- Vortox: `NOT_STARTED` in the role coverage matrix.
- The current implementation baseline still treats source impairment plus Vortox as unsupported until a reviewed implementation lands. No role is promoted to `COMPLETE`.

## Rule-gate result

- Mandatory external sources are available and mutually consistent for the behavior claims.
- The sole former ambiguity is resolved by the approved narrow simulator audit policy.
- `unresolvedConflicts=[]`.
- `ruleCoverageStatus=PARTIAL`.
- This verdict authorizes bounded architecture design only; it is not `RULE_DESIGN_PASS` and does not authorize production or test changes.

RULE_READY
