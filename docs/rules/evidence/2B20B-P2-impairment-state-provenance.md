# Phase 3 Slice 2B20B-P2 — Impairment State Provenance Governance Precheck

## Metadata

- sliceId: `2B20B-P2`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2_IMPAIRMENT_STATE_PROVENANCE_GOVERNANCE_PRECHECK_ONLY`
- retrievalDate: `2026-07-29`
- currentBranch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- currentHead: `bef395287d5400043565acd5b794d02810d7bbca`
- acceptedMain: `0dc046aa62b3a72cbd97d99808e0932bf408a09c`
- evidencePurpose: `RULE_EVIDENCE_AND_GOVERNANCE_PRECHECK_ONLY`
- ruleVerdict: `RULE_READY`
- designVerdict: `RESLICE_REQUIRED`
- ruleCoverageStatus: `PARTIAL`
- unresolvedConflicts: `[]`
- requiredRuleChange: `false`
- requiredArchitectureChange: `true`
- requiredProductChange: `true (future bounded prerequisite only; not authorized here)`
- implementationAuthorized: `false`

This document is a self-contained rule-evidence and governance precheck. It is
not an implementation design, does not authorize product work, and does not
change any previously accepted Dreamer behavior.

## Involved roles and concerns

- Dreamer / 筑梦师: the downstream information ability whose effective state
  must be evaluated without conflating its execution identity with the source
  of impairment.
- Drunk / 醉酒: an effective state in which the character has no ability but is
  treated procedurally as if healthy.
- Poisoned / 中毒: an effective state in which the character has no ability but
  is treated procedurally as if healthy.
- Vigormortis / 亡骨魔: a Demon whose retained-dead-Minion ability creates a
  continuous, source-dependent, recalculating poison effect.
- Philosopher: an already accepted producer of a specific canonical DRUNK
  history in the current simulator.
- Snake Charmer: the only current closed-union producer of the simulator's
  canonical POISONED `AbilityImpairmentApplied` history.
- No Dashii: an existing unresolved continuous-effect boundary. Its authority
  cannot be reused as authority for a poisoned Dreamer.
- Storyteller: owns legal information choice and hidden-state adjudication
  within the applicable rules; that discretion does not authorize illegal
  output shapes or privacy leakage.
- Replay/import boundary: must establish trusted canonical history before an
  effective-condition or provenance fact can be used.
- Player and AI projections: must expose only delivered apparent information,
  never canonical impairment, its producer, or hidden causal history.

## Source register

### User-approved rules and internal rule baseline

| Source | Revision / commit | SHA-256 | Use |
|---|---|---|---|
| `docs/rules/USER_OVERRIDES.md` | `7b12e707a3015b0c6434f7ff9b8e71458bc90838` | `9e2b8e9701a35559d9cc67d8c2185d979ec222b3186fa3a9cd16140dd2f68ad5` | Highest-priority user-approved simulator rule adjustments |
| `project-handoff/rules/11-drunk-and-poison.md` | relevant handoff rules commit `cc682d149589c26518e8514d182d2282dad5ec86` | not separately supplied | Drunk/poison state model |
| `project-handoff/rules/12-information-model.md` | relevant handoff rules commit `cc682d149589c26518e8514d182d2282dad5ec86` | not separately supplied | Information reliability and privacy |
| `project-handoff/rules/16-storyteller-decisions.md` | relevant handoff rules commit `cc682d149589c26518e8514d182d2282dad5ec86` | not separately supplied | Storyteller discretion |
| `project-handoff/rules/19-sects-and-violets-demons.md` | relevant handoff rules commit `cc682d149589c26518e8514d182d2282dad5ec86` | not separately supplied | Vigormortis and other Demon interactions |
| `project-handoff/rules/24-rule-priority.md` | relevant handoff rules commit `cc682d149589c26518e8514d182d2282dad5ec86` | not separately supplied | Rule priority |

Also consulted from the same handoff baseline:
`project-handoff/rules/04-terminology.md`,
`project-handoff/rules/18-sects-and-violets-roles.md`,
`project-handoff/rules/20-character-interactions.md`, and
`project-handoff/rules/30-v2.1-defect-resolution.md`.

The user overrides do not state that DRUNK or POISONED requires a universally
complete, machine-queryable source chain. Existing Dreamer, Philosopher,
ledger, and audit identity requirements are simulator security and audit
contracts, not external BOTC rule claims.

### Official BOTC sources

| Source | Exact URL | Revision date | SHA-256 |
|---|---|---|---|
| States | https://wiki.bloodontheclocktower.com/index.php?title=States&oldid=1039 | `2023-03-23T01:23:10Z` | `9d99771412548f80e1d1d49c280fc6f92b92e4abe4b965ad6635d9b4cc31d440` |
| Rules Explanation | https://wiki.bloodontheclocktower.com/index.php?title=Rules_Explanation&oldid=1310 | `2023-04-03T01:12:13Z` | `dcc318218842d92c908ec9382494f7001929e95e62474bcf62e04cd383d91189` |
| Vigormortis | https://wiki.bloodontheclocktower.com/index.php?title=Vigormortis&oldid=3015 | `2025-11-19T16:15:21Z` | `9f0eef75059ccf4b9dea02aac7daa4b102920e0860cfdb1d055c569141597a6f` |
| Dreamer | https://wiki.bloodontheclocktower.com/index.php?title=Dreamer&oldid=2904 | `2025-09-24T08:39:30Z` | `8841959a3c7b8bb7a6429b229c4fa1ffe70a3df282bfaa5549959afbffca4a7c` |
| Drunk character | https://wiki.bloodontheclocktower.com/index.php?title=Drunk&oldid=3110 | `2026-07-08T12:25:28Z` | `f5701d2aee89ed7d5a02c6bcf9318cb117d3d93014e2cb9914a97d46ada1501a` |

There is no substantive official `Poisoned` character page: the MediaWiki API
reports it missing. Generic poisoned-state authority therefore comes from
`States` and `Rules Explanation`. The official `Drunk` page describes the
Drunk character and must not be substituted for the complete generic-state
rules.

### User-specified Chinese Wiki

| Source | Exact URL | Revision date | SHA-256 |
|---|---|---|---|
| 醉酒 | https://clocktower-wiki.gstonegames.com/index.php?title=%E9%86%89%E9%85%92&oldid=5720 | `2025-12-09T02:27:54Z` | `be4951627fa6f27b99dcab3a2041983612b4aeb7d3edabdf161d4b2c43b4f76e` |
| 中毒 | https://clocktower-wiki.gstonegames.com/index.php?title=%E4%B8%AD%E6%AF%92&oldid=6294 | `2026-07-01T08:21:17Z` | `1576253552de2a0e1c5c5a86925ff3bd1686c4eab03918d04d0860dbc9d883a0` |
| 亡骨魔 | https://clocktower-wiki.gstonegames.com/index.php?title=%E4%BA%A1%E9%AA%A8%E9%AD%94&oldid=6134 | `2026-06-13T02:37:52Z` | `9520bd0c20fc21a274ac6450e7bb2490ce6ee34bb53e8880e035185ac836d275` |
| 筑梦师 | https://clocktower-wiki.gstonegames.com/index.php?title=%E7%AD%91%E6%A2%A6%E5%B8%88&oldid=3046 | `2023-04-18T04:58:54Z` | `53ca18c52267b871c0041d1b4101f486f83bace0005aa7261493b3aa4cacfdf7` |

The Chinese Wiki provides terminology and localized explanation. No
substantive conflict was found between these revisions, the official sources,
and the user-approved rules.

### Official night order

- repository commit:
  `915347e627c3f6cd1f438f82b6001784e11b3e8b`
- exact URL:
  https://raw.githubusercontent.com/ThePandemoniumInstitute/botc-release/915347e627c3f6cd1f438f82b6001784e11b3e8b/resources/data/nightsheet.json
- SHA-256:
  `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- Dreamer first night: after Clockmaker and before Seamstress.
- Dreamer other nights: after Undertaker and before Flowergirl.
- Vigormortis: other nights only, after Lord of Typhon and before Ojo.

Night order establishes execution order. It does not establish a persistence,
provenance, or ability-instance data contract.

### Existing project evidence

| Evidence | SHA-256 |
|---|---|
| `docs/rules/evidence/2B19A1.md` | `b08745e9367b3475378dd5b70600a3eb44d0a8079ee095e211705bdea015c2b1` |
| `docs/rules/evidence/2B19A2.md` | `f4d2736e6977e90f3625e0fadc268cbeb1d050f71c436d95a493d9ad41bb2821` |
| `docs/rules/evidence/2B19A3.md` | `01016c31b5e74891440af9b553eda2305eb0778ea3cdf6a138eecfc4c51e0d06` |
| `docs/rules/evidence/2B19A3A.md` | `e9685d950244928362c5f2f35745104683ed8a845f19a08e009e7eae9f620f1d` |
| `docs/rules/evidence/2B19A3B.md` | `51a9090bf68dba5f86f33943ab97bb46b1a336746905e32e7f05cd25f4ccb53c` |
| `docs/rules/evidence/2B19A3B1.md` | `257631714be207ea2800a6deae08998a6a0d4e8ccdaa99fe3dae797e8b0994d3` |
| `docs/rules/evidence/2B19A3B2.md` | `dd12782565d96263bdc2c5dd6885e9e02e542f078f26c74e2778232afe70ac03` |
| `docs/rules/evidence/2B19A3B-resolved.md` | `960df000a2192c377bcab33ab60ed7db30fbd6898fa78d76ea74503b29986faf` |
| `docs/rules/evidence/2B20A.md` | `5d182d7ff32449e6fda594ba38a618e8ee4dbfb5828543180d0fd218729b0921` |
| `docs/rules/evidence/2B20AP2.md` | `59508769af76bc39e1bfd5214c7fde61757809866232283f998b06b07070f538` |
| `docs/rules/evidence/2B20A-resolved.md` | `f6eee8cfbc7973fd8433ead5eaf93229a953d5601deb39876b3956134363ca98` |

These records preserve an important distinction: base-Dreamer source
provenance, atomic batches, ledgers, receipts, task identities, and replay
cross-links are project audit/security contracts. They are not external BOTC
requirements. In particular, `2B19A1` classifies the base-source provenance
contract as product attribution, while `2B20A-resolved` distinguishes Dreamer
ability identity from the Philosopher-caused impairment source.

## Ability rules

### DRUNK

1. DRUNK is an effective state. A drunk character has no ability, although the
   player is handled as if healthy for waking, choices, prompts, and apparent
   information.
2. External rules do not universally require DRUNK to be represented by a
   source ability or a complete machine-queryable causal chain.
3. DRUNK is independent of the player's current character identity. A
   character change does not inherently erase an already established drunk
   state unless the governing effect ends.
4. The Storyteller may provide true or false information to a drunk
   information character, normally choosing what is disadvantageous, but must
   still use a legal output shape and legal role domain.
5. A player is not told that they are drunk. Player/AI views must not reveal
   the source, true candidate set, truth classification, or canonical
   impairment state.
6. The simulator may require more evidence than the tabletop rules at an
   untrusted replay/import boundary. That is a product audit and security
   policy, not a change to DRUNK semantics.

### POISONED

1. POISONED is an effective state with the same mechanical consequence for the
   affected character's ability: it does not function, while the player is
   handled procedurally as if healthy.
2. Poison is commonly caused by another character ability, but the generic
   rules do not require every effective poisoned state to expose a complete,
   machine-queryable causal ability-instance chain to downstream rules.
3. Poison can be continuous. An already active or permanent ability pauses
   while its source is drunk or poisoned and resumes when that source becomes
   healthy, if its other lifecycle conditions still hold.
4. Demon-caused poison is represented semantically by the Demon ability, the
   affected player, the current poisoned/healthy state, and the
   character-specific duration, movement, or termination conditions.
5. The cause and source of poison are hidden from players. They are
   Storyteller/audit truth, not player/AI projection data.
6. A trusted simulator may preserve exact causal provenance for replay and
   audit. Failure to establish that provenance at an untrusted boundary may
   fail closed, but absence of a universally queryable chain is not an
   external rule statement that the character is healthy.

### Vigormortis

1. Each dead Minion killed by the Vigormortis and still retaining its Minion
   ability continuously poisons one adjacent Townsfolk.
2. When both adjacent living neighbors are Townsfolk, the Storyteller chooses
   which side is poisoned.
3. If the Vigormortis dies or loses its ability, the dead Minions cease
   retaining their abilities and the linked poison ends.
4. If the dead Minion ceases to be a Minion, the retained-ability effect and
   linked poison end.
5. If the dead Minion itself is drunk or poisoned, its retained ability pauses;
   it resumes when healthy if the governing Vigormortis effect remains active.
6. These rules require semantic lifecycle facts: the killing Vigormortis, the
   dead Minion, retained-ability status, adjacency, Storyteller selection, and
   current source effectiveness. They do not prescribe a machine-queryable
   event ID, tenure ID, or full ability-instance chain.
7. Vigormortis identity, the dead Minion, and the poisoned neighbor are hidden
   canonical/Storyteller truth and must not appear in player/AI Dreamer
   projections.

## Effective-state model

The minimum semantic vocabulary is:

- `NONE`
- `DRUNK`
- `POISONED`

These labels describe conditions, not causal producers. A simplified enum may
be useful at a single-condition seam, but the canonical model must permit a
character to be simultaneously DRUNK and POISONED. It therefore cannot rely on
a mutually exclusive enum as the sole persisted or derived truth. An
implementation design should model an effective condition set, independently
active condition facts, or an equivalent representation whose result can
contain both conditions.

For ability effectiveness, either DRUNK or POISONED disables the character
ability. The preserved distinction remains necessary for lifecycle,
provenance, audit, future interaction rules, and Storyteller diagnostics.

## Provenance model

The audit/replay/Storyteller provenance vocabulary is:

- `ABILITY_SOURCE`: the condition derives from a specific character ability
  whose canonical source and lifecycle are established.
- `ROLE_EFFECT`: the condition derives from an established canonical role or
  effect record where the simulator does not expose a downstream
  ability-instance identity.
- `UNKNOWN_SOURCE`: the condition is established by a trusted canonical/import
  boundary, but the original causal source is unavailable in the retained
  history.

`UNKNOWN_SOURCE` is allowed only after a trusted canonical or import boundary
has positively established the condition. It is not permission to accept a
hostile, forged, partial, shape-only, or otherwise untrusted state. A missing
or unverifiable source at an untrusted replay boundary must continue to fail
closed.

Three identities must remain separate:

1. **Ability source** — the character ability whose execution is being
   resolved, such as the base Dreamer's current ability instance.
2. **Effect source** — the causal rule, role, ability, or retained effect that
   created DRUNK or POISONED.
3. **Dreamer execution identity** — the scheduled task, opportunity, source
   player, source role tenure, and Dreamer ability instance used for the
   current Dreamer action.

The Dreamer execution identity cannot substitute for impairment provenance,
and impairment provenance cannot substitute for proof that the current Dreamer
task is canonical and actionable.

## Event history and replay evidence

Event history answers what canonical facts were accepted and in what order.
Replay evidence answers whether those facts, their producer/lifecycle links,
batch ordering, and versioned payload contracts can be revalidated from the
stored stream. The two concerns must not be collapsed into shape validation.

A future producer-neutral effective-condition interface must:

- derive the condition at an exact event revision from trusted canonical
  producer history;
- preserve a separate provenance reference;
- reject missing, forged, reordered, duplicated, or incompatible producer
  history;
- preserve atomic delivery, settlement, ledger, receipt, and idempotency
  contracts;
- avoid recomputing delivered historical knowledge from newer character state;
- retain versioned replay compatibility; and
- fail closed at hostile import/replay boundaries.

## Player and AI visibility

Player and AI projections may receive only the apparent information actually
delivered to the source player, including the selected target and apparent
GOOD/EVIL roles where the accepted Dreamer contract permits them.

They must not receive:

- `DRUNK` or `POISONED`;
- impairment provenance kind or source ID;
- Philosopher, Snake Charmer, Vigormortis, or No Dashii causal identity;
- dead-Minion or adjacent-target lifecycle facts;
- true role, truth classification, candidate pool, or Storyteller selection
  material;
- canonical event revisions, audit cross-links, ledger internals, or
  source/effect identity records.

## Current architecture classification

### Classification: `A`

The current model requires complete producer-specific source history before a
downstream Dreamer path recognizes an impairment. That is a product
architecture and trust-boundary choice; it is not an external BOTC rule
requirement.

Concrete evidence:

- `packages/domain-core/src/dreamer.ts` around lines `1353-1397` and
  `1465-1496` derives impairment directly from a source-specific historical
  marker matched to current role tenure. There is no independent
  active-effective-condition authority.
- `packages/domain-core/src/philosopher-ability.ts` around lines `107-147` and
  `1080-1197`, together with
  `packages/domain-core/src/snake-charmer.ts` around lines `1108-1141`, define
  a closed `AbilityImpairmentSet` union containing Philosopher duplicate-role
  DRUNK and Snake Charmer Demon-hit POISONED variants. Each requires its full
  producer-specific chain.
- `packages/domain-core/src/first-night-action-opportunity.ts` around lines
  `277-288`, `1114-1148`, and `2397-2415` uses
  `sourceAbilityInstanceId` to identify the base Dreamer task/ability instance.
  It is Dreamer execution identity, not an impairment-source identity.
- `packages/domain-core/src/event-applier.ts` around lines `1073-1096` and
  `2353-2376` applies append-only `AbilityImpairmentApplied` facts; the current
  POISONED replay path requires a matching Snake Charmer swap.
- `packages/domain-core/src/rebuild.ts` around lines `27-69` and
  `packages/domain-core/src/domain-batch-semantics.ts` around lines
  `1061-1279` revalidate event order, batch semantics, canonical source,
  impairment, delivery, and settlement.
- `packages/projections/src/index.ts` around lines `282-325`, `602-626`, and
  `698-710` validates versioned Dreamer history fail closed while projecting
  only target and apparent GOOD/EVIL information.

### Accepted architecture contrast

`docs/architecture/09-effect-lifecycle.md` separates effect source, lifecycle,
dependency, target, and visibility; derives active effects at an event version;
and derives final drunk/poison conditions across all active effects. It also
describes source-dependent recalculation for No Dashii and the Vigormortis
retained-dead-Minion relationship.

`docs/architecture/08-night-task-model.md` classifies No Dashii and Vigormortis
as `ContinuousRule`, not `ScheduledTask`.

`docs/architecture/2B20B-go-no-go-under-governance-v1.md` records that the
runtime does not yet have the authoritative `EffectInstance` model needed for
that full architecture.

The architectural separation is:

`accepted canonical producer history`
→ `lifecycle-aware active effect`
→ `effective condition at revision`
→ `downstream ability effectiveness`.

The current implementation instead largely uses:

`producer-specific historical marker`
→ `downstream ability effectiveness`.

The accepted architecture supports a broader future model, but this precheck
does not authorize implementing a generic effect engine.

## P1 traceability reassessment

### P1-C19

P1-C19 mixes three different assertions:

1. the effective behavior of an impaired Dreamer;
2. whether a canonical producer makes that state reachable; and
3. whether the required provenance is present and trusted.

Its frozen matrix includes missing or forged impairment provenance and a
future otherwise-legal producer that the current closed union cannot
represent. Persisted forged provenance is an R3 hostile-replay concern; a
future legal but unavailable producer is an R4/unimplemented reachability
concern. Neither is automatically R1 accepted-stream evidence.

Future design must split these assertions into separate criteria. The current
P1-C19 `MechanismMatch` remains `FAIL`.

### P1-C20

P1-C20 also mixes effective behavior, reachability, and provenance. The current
actual R1 accepted-stream authority is only the unresolved No Dashii
continuous-effect path. It does not prove that a POISONED base Dreamer is
reachable or settleable.

`SUP-2B20B-P1-011` remains valid only for its actual No Dashii authority. It
cannot establish poisoned-Dreamer authority and must not be promoted,
relabelled, or reused as such.

Future design must split the No Dashii unresolved behavior from any separately
sourced POISONED Dreamer criterion. The current P1-C20 `MechanismMatch` remains
`FAIL`.

## Governance decision

### Verdict: `RESLICE_REQUIRED`

A bounded prerequisite slice is required before any POISONED base-Dreamer
settlement slice can be credible. The recommended prerequisite is a
producer-neutral separation between:

1. the effective impairment condition at an exact revision; and
2. a distinct provenance reference derived from trusted canonical producer
   history.

The preferred future seam is an `effective-condition-at-revision` interface
whose input is trusted canonical producer history and whose output preserves a
separate provenance reference. It must allow simultaneous DRUNK and POISONED,
and it must retain replay fail-closed behavior.

A complete `EffectInstance` / `ContinuousRule` engine is valid broader
architecture work, but is out of scope for this bounded prerequisite.
Adding another producer-specific closed-union variant would be smaller but
would repeat the current condition/provenance conflation. Adding an
unproven direct effective-state flag or import marker is rejected.

### Scope of a future, separately authorized prerequisite

- Define a producer-neutral effective-condition-at-revision contract.
- Keep canonical producer/effect provenance separate from Dreamer execution
  identity.
- Derive effective conditions only from trusted canonical history.
- Preserve hostile replay/import rejection and historical compatibility.
- Establish explicit behavior for `NONE`, `DRUNK`, `POISONED`, and simultaneous
  `DRUNK + POISONED`.
- Keep private causal information out of player/AI projections.

### Explicitly out of scope and not authorized

- POISONED Dreamer settlement or success behavior.
- No Dashii impairment derivation or resolution.
- Vigormortis kill, death, retained-Minion, adjacency, or other-night behavior.
- Any generalized impairment engine or generic effect engine.
- A new event type, payload version, persisted schema, or top-level
  `GameState` field.
- Changes to Dreamer opportunity, target, delivery, settlement, ledger,
  receipt, replay, or projection behavior.
- Changes to accepted normal, Fang Gu, Vortox, No Dashii unresolved, canonical
  Philosopher-caused DRUNK, or gained-Dreamer behavior.
- First-night completion, day entry, nomination, vote, execution, death, or
  Phase 2C.
- Production code, tests, fixtures, workflows, dependencies, branches,
  commits, pushes, pull requests, tags, or CI.

## Conflicts and coverage

- unresolvedConflicts: `[]`
- ruleVerdict: `RULE_READY`
- ruleCoverageStatus: `PARTIAL`
- Dreamer role coverage remains `PARTIAL`.
- The external rules are sufficiently clear for this governance decision.
- `RULE_READY` does not authorize implementation; the architecture gap requires
  a new bounded design authorization.

## Phase 3 Slice 2B20B-P2 Governance Precheck报告

currentHead: `bef395287d5400043565acd5b794d02810d7bbca`

branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`

scope: `RULE_EVIDENCE_AND_GOVERNANCE_PRECHECK_ONLY`

officialRuleSources: `official BOTC States oldid 1039, Rules Explanation oldid 1310, Vigormortis oldid 3015, Dreamer oldid 2904, Drunk oldid 3110; Chinese Wiki 醉酒 oldid 5720, 中毒 oldid 6294, 亡骨魔 oldid 6134, 筑梦师 oldid 3046; official nightsheet commit 915347e627c3f6cd1f438f82b6001784e11b3e8b`

drunkRuleConclusion: `DRUNK_IS_AN_INDEPENDENT_EFFECTIVE_STATE_AND_DOES_NOT_UNIVERSALLY_REQUIRE_A_MACHINE_QUERYABLE_SOURCE_ABILITY_CHAIN`

poisonRuleConclusion: `POISONED_IS_AN_EFFECTIVE_STATE_WITH_HIDDEN_CAUSAL_SOURCE_AND_MAY_BE_CONTINUOUS;_EXTERNAL_RULES_DO_NOT_REQUIRE_A_COMPLETE_DOWNSTREAM_QUERYABLE_CHAIN`

vigormortisRuleConclusion: `VIGORMORTIS_POISON_REQUIRES_SOURCE_DEPENDENT_RECALCULATING_LIFECYCLE_FACTS_BUT_NOT_RULE_MANDATED_EVENT_TENURE_OR_ABILITY_INSTANCE_IDENTIFIERS`

effectiveStateModel: `SET_CAPABLE_OF_NONE_DRUNK_POISONED_AND_SIMULTANEOUS_DRUNK_PLUS_POISONED`

provenanceModel: `ABILITY_SOURCE_OR_ROLE_EFFECT_OR_TRUSTED_CANONICAL_UNKNOWN_SOURCE_SEPARATE_FROM_DREAMER_EXECUTION_IDENTITY`

stateProvenanceCouplingValid: `false`

currentArchitectureConflict: `CLASSIFICATION_A_CLOSED_PRODUCER_SPECIFIC_ABILITY_IMPAIRMENT_SET_CONFLATES_EFFECTIVE_CONDITION_WITH_SOURCE_PROVENANCE`

C19Assessment: `MECHANISM_MATCH_FAIL_BECAUSE_EFFECTIVE_BEHAVIOR_REACHABILITY_AND_PROVENANCE_ARE_MIXED_AND_MUST_BE_SPLIT`

C20Assessment: `MECHANISM_MATCH_FAIL_BECAUSE_CURRENT_R1_AUTHORITY_IS_ONLY_NO_DASHII_UNRESOLVED_AND_DOES_NOT_ESTABLISH_POISONED_DREAMER_REACHABILITY`

SUP_2B20B_P1_011Assessment: `VALID_ONLY_FOR_ACTUAL_NO_DASHII_AUTHORITY_AND_CANNOT_ESTABLISH_POISONED_DREAMER_AUTHORITY`

requiredArchitectureChange: `true`

requiredRuleChange: `false`

requiredProductChange: `true (future bounded prerequisite only; not authorized)`

recommendedNextSlice: `BOUNDED_PRODUCER_NEUTRAL_EFFECTIVE_IMPAIRMENT_AND_EFFECT_PROVENANCE_SEPARATION_PREREQUISITE`

designVerdict: `RESLICE_REQUIRED`

implementationAuthorized: `false`

filesChanged: `1`

commitCreated: `false`

pushPerformed: `false`

PRCreated: `false`

CIrerunPerformed: `false`

requiredNextAction: `AWAIT_USER_AUTHORIZATION_FOR_2B20B_P2_DESIGN_OR_RESLICE`
