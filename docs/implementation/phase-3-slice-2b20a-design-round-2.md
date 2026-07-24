# Phase 3 Slice 2B20A Frozen Implementation Design — Round 2

## Metadata

- sliceId: `2B20A`
- name: `Reachable Base Dreamer Settleability Closure`
- authorization: `USER_AUTHORIZED_2B20_RESLICE_BASE_DREAMER_SETTLEABILITY_CLOSURE`
- parentSlice: `2B20 — RESLICE_REQUIRED / UNACCEPTED`
- branch: `phase-3/reachable-base-dreamer-settleability-closure`
- designBaseHead: `a834d4b0f79a1779360cf43ede8ba76b7f37cbc6`
- designRound: `2 / 2`
- governancePath: `docs/architecture/2B20A-go-no-go-under-governance-v1.md`
- governanceSha256: `9ab18f66a1a64372b3a629a8ab42fad1c8455de61647b11c167ef6d862ee2bf1`
- ruleEvidencePath: `docs/rules/evidence/2B20A-resolved.md`
- ruleEvidenceSha256: `47e6c5a70b1eae70f51e9a4e0d78c8ab0d2ddf272babb3f9c76e51970c893189`
- parentRound1DesignPath: `docs/implementation/phase-3-slice-2b20a-design.md`
- parentRound1DesignSha256: `9323681b5aa61106b81d1580c0502eaf085f56ee5f51801aaa7fe771e15cdf02`
- round1ReviewPath: `docs/implementation/phase-3-slice-2b20a-design-review-round-1.md`
- round1ReviewSha256: `7a94445b31fb49b1c504d37fcb842d8c92ee96e78149ca3c50f9d0645a02543e`
- ruleVerdict: `RULE_READY`
- ruleCoverageStatus: `PARTIAL`
- coverageTarget: `PARTIAL / REACHABLE_BASE_DREAMER_SETTLEABILITY_ONLY`
- DreamerRoleCoverage: `PARTIAL`
- ruleSemanticsChanged: `false`
- behaviorScopeChangedFromRound1: `false`
- acceptedBehaviorChanged: `true`
- implementationAuthorized: `false`
- productionFileCeiling: `5`
- addedProductionLocCeiling: `1000`
- currentPR: `none`
- phase2CStarted: `false`

This is the sole complete implementation authority for 2B20A. It is standalone,
not an erratum or addendum, and does not require the implementer to consult the
Round 1 design for a missing contract. Implementation remains prohibited until
an independent reviewer returns `RULE_DESIGN_PASS` for this exact document.

## 1. Round 1 Blocker Closure

| Blocker | Closure |
|---|---|
| `2B20A_RULE_EVIDENCE_MATHEMATICIAN_COUNTED_PLAYER_ATTRIBUTION_CONFLICT` | `CLOSED` — the base Dreamer is the delivery fact source and counted/affected player; Philosopher is causal impairment provenance only |
| `2B20A_V7_ACCEPTED_STREAM_PROJECTION_PROVENANCE_GATE_MISSING` | `CLOSED` — `packages/projections/src/index.ts` replaces `event-applier.ts` in the exact five-file production allowlist and receives an accepted-stream-only V7 gate |
| `2B20A_DESIGN_TRACEABILITY_V1_1_FIELDS_AND_PRIMARY_CLASSIFICATION_MISSING` | `CLOSED` — C01–C33 each contain the exact nine Governance Traceability V1.1 fields and exactly one primary authority/layer |

No closure changes an official rule, user override, accepted normal/Vortox
behavior, event version, command shape, state schema, or scope.

## 2. Bounded Product Outcome

The only newly accepted behavior is the reachable accepted stream where:

- the planned task is the original base `DREAMER_ACTION`;
- source is base Dreamer `ai-seat-01`, seat `1`;
- Philosopher `ai-seat-10`, seat `10`, chose `dreamer`;
- accepted history contains exactly one applicable source impairment:
  `DRUNK / PHILOSOPHER_CHOSEN_DUPLICATE / chosenRoleId=dreamer`;
- the unique current Demon is catalog-backed Fang Gu;
- current Vortox and current No Dashii are absent;
- the existing V3 Dreamer opportunity is `OPEN`;
- the submitted target is legal.

For this stream, `SubmitDreamerAction` changes from retryable
`ApplicationNotConfigured` to one atomic batch:

1. `DreamerTargetChosen` with existing V2 target payload;
2. `DreamerInformationDelivered` with new V7 delivery payload;
3. `ScheduledTaskSettled` with existing Dreamer settlement payload.

The opportunity becomes terminal, the planned base task becomes formally
settled, and the existing receipt/idempotency contract applies. All other
unsupported states remain fail closed. Existing normal base Dreamer,
effective-current-Vortox base Dreamer, canonical-drunk/effective-Vortox base
Dreamer, Philosopher-gained Dreamer, and V1–V6 delivery behavior are unchanged.

## 3. Explicit Non-Goals

The implementation must not add or infer:

- poisoned Dreamer success;
- No Dashii derivation or settlement;
- Philosopher-gained Dreamer impairment;
- impaired, poisoned, drunk, dead, or ineffective Vortox handling;
- generic impairment or effect engines;
- other-night Dreamer behavior;
- first-night completion or any first-night/day phase transition;
- nomination, voting, execution, death, or day mechanics;
- Phase 2C;
- a top-level `GameState` field;
- a new command type, command payload, event type, or opportunity schema;
- a new ledger schema, evidence variant, or Mathematician aggregation model;
- a new player/AI projection field;
- a caller truth/candidate selector;
- promotion of Dreamer beyond `PARTIAL`.

## 4. New Version Constants

`packages/domain-core/src/dreamer.ts` adds exactly:

```ts
export const DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION =
  "dreamer-information-delivered-v7" as const;

export const DREAMER_APPARENT_PAIR_CANDIDATE_MODEL_VERSION =
  "dreamer-apparent-pair-candidate-model-v1" as const;

export const DREAMER_CANONICAL_DRUNK_PAIR_SELECTION_POLICY_VERSION =
  "dreamer-canonical-drunk-pair-selection-policy-v1" as const;

export const DREAMER_NON_VORTOX_CURRENT_DEMON_CONSTRAINT_VERSION =
  "dreamer-non-vortox-current-demon-constraint-v1" as const;
```

No existing constant changes.

## 5. Exact New Types

### 5.1 Candidate identity

```ts
export type DreamerApparentPairCandidateId = string & {
  readonly __brand: "DreamerApparentPairCandidateId";
};
```

Canonical grammar:

```text
dreamer-apparent-pair-v1:good:<goodRoleId>:evil:<evilRoleId>
```

Role IDs are canonical non-empty identifiers containing neither colon nor
control characters. Parsing must round-trip through the formatter. Identity is
derived only from role IDs and never time, randomness, locale, UUID, array
position, or object identity.

### 5.2 Candidate

```ts
export type DreamerApparentPairCandidate = {
  readonly candidateId: DreamerApparentPairCandidateId;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly truthClassification: "TRUE" | "FALSE";
};
```

This is an exact four-key record. `goodRole.characterType` is `TOWNSFOLK` or
`OUTSIDER`; `evilRole.characterType` is `MINION` or `DEMON`. Both snapshots are
exact catalog snapshots.

`truthClassification` is recomputed at settlement:

- `TRUE` iff either role ID equals the target's actual settlement-time role ID;
- `FALSE` otherwise.

Stored classification is never trusted.

### 5.3 Apparent pair decision

```ts
export type DreamerApparentPairDecision = {
  readonly candidateModelVersion:
    typeof DREAMER_APPARENT_PAIR_CANDIDATE_MODEL_VERSION;
  readonly simulationPolicyVersion:
    typeof DREAMER_CANONICAL_DRUNK_PAIR_SELECTION_POLICY_VERSION;
  readonly legalCandidates: readonly DreamerApparentPairCandidate[];
  readonly selectedCandidateId: DreamerApparentPairCandidateId;
};
```

This is an exact four-key record. Candidates are complete, non-empty,
duplicate-free, canonically ordered, and include at least one `TRUE` and one
`FALSE`. The selected ID identifies exactly one candidate.

### 5.4 Current Demon constraint

```ts
export type DreamerNonVortoxCurrentDemonConstraint = {
  readonly constraintVersion:
    typeof DREAMER_NON_VORTOX_CURRENT_DEMON_CONSTRAINT_VERSION;
  readonly kind: "UNIQUE_CURRENT_FANG_GU";
  readonly demonPlayerId: PlayerId;
  readonly demonSeatNumber: SeatNumber;
  readonly demonRole: RoleSetupSnapshot;
  readonly evaluatedCharacterStateRevision: number;
};
```

This is an exact six-key record. `demonRole` equals the setup catalog's unique
`fang_gu` snapshot. At the recorded revision exactly one current character-state
entry is a Demon and it matches player, seat, role, and catalog. Zero, duplicate,
different, stale, Vortox, No Dashii, mismatched, or unprovable results fail closed.

### 5.5 Reliability

```ts
export type DreamerCanonicalDrunkApparentInformationReliability = {
  readonly kind: "CANONICAL_SOURCE_DRUNK_APPARENT_INFORMATION";
};
```

This exact one-key record says the stored pair was apparently delivered while
the source Dreamer was canonically drunk. It does not reveal truth to projections.

### 5.6 V7 delivery exact shape

```ts
export type DreamerInformationDeliveredPayloadV7 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion:
    typeof DREAMER_INFORMATION_DELIVERED_V7_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  readonly knowledgeModelVersion:
    typeof SUPPORTED_DREAMER_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_INFORMATION_STAGE;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability:
    DreamerCanonicalDrunkApparentInformationReliability;
  readonly sourceImpairment:
    DreamerCanonicalPhilosopherDrunkSourceImpairment;
  readonly currentDemonConstraint:
    DreamerNonVortoxCurrentDemonConstraint;
  readonly apparentPairDecision: DreamerApparentPairDecision;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
};
```

The exact enumerable key set is:

```text
rulesBaselineVersion
deliverySchemaVersion
nightNumber
taskId
taskType
opportunityId
opportunitySchemaVersion
knowledgeModelVersion
knowledgeStage
sourcePlayerId
sourceSeatNumber
sourceCharacterStateRevision
evaluatedCharacterStateRevision
sourceContract
targetPlayerId
targetSeatNumber
informationReliability
sourceImpairment
currentDemonConstraint
apparentPairDecision
goodRole
evilRole
```

There are exactly 22 keys. V7 excludes `vortoxConstraint`,
`falseRolePolicyVersion`, caller candidate/selector data, and hidden enumerable
keys. Top-level roles exactly clone the selected candidate.
`DreamerInformationDeliveredPayload` adds V7 as one union member; V1–V6 remain
unchanged.

## 6. Capability Resolution

`BaseDreamerV2NormalCapability` adds:

```ts
{
  readonly kind:
    "CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED";
  readonly evaluationModelVersion:
    typeof DREAMER_BASE_SOURCE_EFFECTIVENESS_MODEL_VERSION;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
  readonly sourceImpairment:
    DreamerCanonicalPhilosopherDrunkSourceImpairment;
  readonly currentDemonConstraint:
    DreamerNonVortoxCurrentDemonConstraint;
}
```

`resolveBaseDreamerV2NormalCapability` preserves this order:

1. canonical-data preflight without accessors;
2. prove V3 opportunity, base task, source player/seat/role, base ability
   instance, active continuous tenure, and revisions;
3. resolve applicable source impairments;
4. fail closed for multiple, duplicate, conflicting, stale, noncanonical, or
   unprovable impairments;
5. recognize only the exact canonical Philosopher-caused Dreamer `DRUNK`;
6. resolve exactly one current catalog-backed Demon;
7. preserve `NO_DASHII_EFFECT_UNRESOLVED` for No Dashii;
8. preserve existing Vortox applicability and effective normal/drunk paths;
9. for exact Fang Gu, preserve normal support without impairment, add the new
   support only for the exact single canonical impairment, and preserve
   existing fail-closed results for every other impairment;
10. fail closed for every other current Demon.

No gained-Dreamer resolver behavior changes.

## 7. Apparent Pair Construction and Selection

GOOD domain is every exact catalog role with character type `TOWNSFOLK` or
`OUTSIDER`. EVIL domain is every exact catalog role with character type
`MINION` or `DEMON`. Legal candidates are the full Cartesian product
`GOOD × EVIL`; no in-play, setup-assignment, player-alignment, or caller filter
is allowed.

Construction:

1. validate every catalog snapshot and reject duplicate IDs or mismatches;
2. format each candidate ID;
3. classify truth using settlement-time target role;
4. sort by raw UTF-16 code-unit order of candidate ID;
5. reject duplicate IDs;
6. require at least one `TRUE` and one `FALSE`.

Raw UTF-16 comparison walks code units left-to-right and breaks a shared prefix
by string length. `localeCompare`, `Intl.Collator`, environment locale,
filesystem/object order, timestamps, and randomness are forbidden.

Selection material is exactly:

```text
<impairmentId>\0<targetPlayerId>\0<targetRoleId>
```

Compute:

```ts
let sum = 0;
for (let index = 0; index < material.length; index += 1) {
  sum += material.charCodeAt(index);
}
```

Even selects class `TRUE`; odd selects `FALSE`; select the first canonical
candidate in that class. Persist the complete candidates and selected ID.
This is deterministic simulator policy, not an official rule. The builder
accepts no caller pair, candidate list, ID, truth class, parity, seed, or override.

## 8. Builder Contract

The V7 builder accepts only:

- `rulesBaselineVersion`;
- existing V2 target choice;
- accepted setup;
- settlement-time current character state;
- exact supported capability.

It canonical-preflights all inputs, re-proves source/target, Fang Gu, impairment,
and revisions, builds the complete candidate set, selects deterministically,
deep-clones nested values, and returns the exact 22-key payload. Any
inconsistency throws `InvalidDreamerInformationDeliveredPayload`; the
application boundary maps it to the existing retryable, receipt-free,
mutation-free dependency failure.

## 9. Validation, Equality, Clone, and Re-resolution

Canonical-data preflight precedes `Object.keys`, `Object.getPrototypeOf`, reads,
spread, iteration, clone, and equality. Getter calls must be exactly zero.

The public shape validator, stored validator, candidate parser/formatter,
candidate/decision/constraint/reliability validators, clone, equality, and
prospective/replay re-resolution reject safely:

- missing/extra keys and wrong type/literal/version;
- accessors at any depth, throwing Proxy, revoked Proxy;
- symbol keys/values, cycles, forbidden shared references;
- array-in-record, sparse arrays, nonplain objects, invalid null prototypes;
- duplicate/unsorted candidates or invalid ID round-trip;
- absent/duplicate selected ID, truth mismatch, selected/top-level role mismatch;
- catalog, source, target, revision, task, opportunity, tenure, impairment, or
  Demon mismatch.

Clone/equality first validate, then use known exact keys. Equality includes the
complete ordered candidate vector, selected ID, role snapshots, impairment,
source contract, and Demon constraint. No public validator throws for hostile
input.

## 10. Application Command and Atomic Batch

`SubmitDreamerAction`, fingerprint, actor/target rules, decision shape, and V3
opportunity schema remain unchanged. The internal prepared union adds:

```ts
{
  readonly kind: "BASE_DREAMER_CANONICAL_DRUNK_FANG_GU_APPARENT_V7";
  readonly targetChoice: DreamerTargetChosenPayloadV2;
  readonly delivery: DreamerInformationDeliveredPayloadV7;
  readonly settlement: DreamerInformationDeliveredScheduledTaskSettlement;
}
```

Preparation builds target V2, delivery V7, and existing settlement. Creation
emits exactly three events with consecutive sequences, one batch ID, and one
new game version:

```text
DreamerTargetChosen
DreamerInformationDelivered
ScheduledTaskSettled
```

No append occurs before complete prospective validation. Missing, partial,
reordered, duplicate, cross-batch, cross-version, or sequence-gap batches fail.

Success closes the opportunity through accepted history, settles the task,
stores one receipt, returns stored result for same command ID/fingerprint, and
rejects same ID/different fingerprint. Unsupported, malformed, stale, or
dependency failure stores no receipt, appends nothing, changes no version,
leaves opportunity `OPEN`, and leaves task pending.

## 11. Prospective and Replay Semantics

`domain-batch-semantics.ts` accepts V7 only in the exact three-event batch. From
the immediate pre-delivery state it re-resolves target, source contract, active
base tenure, base ability instance, impairment, current Fang Gu, ordered
candidates, truth classifications, parity/class, selected ID, top-level roles,
exact V7 shape, settlement task, and revision.

`event-applier.ts` is not modified. Its existing generic accepted-event
application and stored Dreamer delivery validator/union path must accept the
new validated union member without special V7 code. If implementation proves
that both `event-applier.ts` and `packages/projections/src/index.ts` require
production changes, stop `RESLICE_REQUIRED`; do not exceed the five-file ceiling.

Replay rejects V7 without matching immediately preceding target or matching
settlement; target without V7; reordering/duplication; mutated roles, candidates,
selection, policy, reliability, impairment, Demon, source contract, target, or
revision; later-state construction; non-Fang-Gu/Vortox/No-Dashii/ambiguous
Demon; and absent/duplicate/poisoned/conflicting/stale/forged impairment.
Accepted V1–V6 replay remains unchanged.

## 12. Outcome Ledger and Mathematician

No ledger version, fact schema, evidence variant/order, ability identity, or
aggregation algorithm changes. Each accepted V7 creates exactly one base
Dreamer `FirstNightAbilityOutcomeFact`:

- `sourcePlayerId = ai-seat-01`;
- `sourceSeatNumber = 1`;
- `abilityRoleId = dreamer`;
- `abilityTaskId` is the base task;
- `abilityInstance.kind = BASE_ROLE_TASK`;
- the base Dreamer is delivery fact source and counted/affected player;
- Philosopher `ai-seat-10` is causal impairment provenance only and must never
  replace the fact source or become a second counted player.

Exact outcome matrix:

| Delivery | Fact source | outcomeStatus | causeKind | causedByAnotherCharacterAbility | Mathematician contribution |
|---|---|---|---|---:|---|
| TRUE | base Dreamer `ai-seat-01` | `NORMAL` | `NO_OTHER_CHARACTER_ABILITY` | `false` | `0` |
| FALSE | base Dreamer `ai-seat-01` | `ABNORMAL` | `SOURCE_DRUNKENNESS` | `true` | base Dreamer once |
| no delivery | no fact | none | none | none | `0` |

False outcome causally references the Philosopher impairment evidence but counts
the base Dreamer fact source once. Dreamer cannot be counted twice, and
Dreamer plus Philosopher cannot both be counted.

The fact contains exactly these nine existing evidence variants in canonical order:

1. `SOURCE_EVENT` — V7 delivery event;
2. `TASK` — base `DREAMER_ACTION`;
3. `ACTION_OPPORTUNITY` — matching V3 opportunity;
4. `CHARACTER_STATE` — evaluated settlement revision;
5. `PLAYER_ROLE_AT_REVISION` — base Dreamer;
6. `PLAYER_ROLE_AT_REVISION` — target;
7. `ROLE_TENURE` — active base Dreamer tenure;
8. `ABILITY_IMPAIRMENT` — exact Philosopher-caused `DRUNK`;
9. `DREAMER_DELIVERY` — V7 summary.

No new evidence kind exists. Every entry is validated against accepted history.

## 13. Projection Contract

`packages/projections/src/index.ts` adds V7 to the existing accepted-stream
Dreamer delivery allowlist only. This is not a state-only shape trust grant.

Projection provenance matrix:

| Input authority | Source player/AI | Other player/AI |
|---|---|---|
| validated accepted V7 stream | existing private target reference plus delivered good/evil pair only | omit delivery |
| state-only V7 object without accepted-history provenance | reject with existing `PrivateKnowledgeUnavailable` guard | reject with existing `PrivateKnowledgeUnavailable` guard |
| malformed, stale, forged, or noncanonical V7 | reject with existing `PrivateKnowledgeUnavailable` guard | reject with existing `PrivateKnowledgeUnavailable` guard |

The source player/AI never receives V7 version, reliability, drunkenness,
impairment ID/kind, Philosopher identity/choice/grant/causal role, target actual
role, truth class, candidates, selected ID, policy/parity, Fang Gu/current Demon,
ledger, or Mathematician data. Public and Storyteller projection behavior and
projection output shapes remain unchanged. V1–V6 projection behavior is unchanged.

## 14. Production and Test Allowlists

Implementation may modify exactly a subset of these five production files:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

Added production LOC across them is at most `1000`.

`packages/domain-core/src/event-applier.ts` is explicitly unchanged and relies
only on its existing generic validated-union application path. If it needs a
change in addition to projection, return `RESLICE_REQUIRED`.

Explicitly forbidden are `events.ts`, game-state files, task planning,
opportunity production, Philosopher/Mathematician production, every sixth
production file, and all workflow/dependency/profile/ownership infrastructure.

Only these tests may change:

1. `packages/domain-core/src/dreamer.test.ts`
2. `packages/domain-core/src/domain-batch-semantics.test.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
4. `packages/domain-core/src/rebuild.test.ts`
5. `packages/application/src/game-application-service.test.ts`
6. `packages/projections/src/private-knowledge-view.test.ts`

No fixture, harness, snapshot, workflow, timeout, dependency, ownership, shard,
coverage profile, threshold, or topology change is authorized.

## 15. Governance Traceability V1.1 Authorities

These identifiers define evidence purposes, not physical test IDs:

- `AUTH-A`: real accepted application command and event-stream authority;
- `AUTH-B`: direct pure domain capability/builder/policy authority;
- `AUTH-C`: exact structural payload and canonical-data validation authority;
- `AUTH-D`: hostile-input exception-safety and zero-getter authority;
- `AUTH-E`: prospective atomic batch semantics authority;
- `AUTH-F`: full replay/rebuild accepted-history authority;
- `AUTH-G`: first-night outcome-ledger and Mathematician derivation authority;
- `AUTH-H`: accepted-stream projection provenance/privacy authority;
- `AUTH-I`: governance documentation, diff-scope, full-gate, and exact-head CI authority.

Each criterion below has one primary authority and one primary layer. Supporting
authority is corroborative only.

## 16. Governance Traceability V1.1 — C01–C33

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C01 | Exact accepted stream is reachable | Real commands prove base Dreamer `ai-seat-01/1`, Philosopher `ai-seat-10/10`, canonical impairment, Fang Gu, no Vortox/No Dashii | `REAL_ACCEPTED_APPLICATION_COMMAND_CHAIN` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `ACCEPTED_STREAM_INTEGRATION` | exact precondition snapshot | `AUTH-A`; governance probe corroboration |
| C02 | New capability is narrowly gated | Exact canonical drunk base Dreamer plus unique Fang Gu resolves new capability; adjacent states do not | `CANONICAL_CAPABILITY_RESOLUTION_MATRIX` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `ACCEPTED_STREAM_INTEGRATION` | supported only for frozen path | `AUTH-B`; C01 accepted setup support |
| C03 | TRUE delivery is reachable | A real command naturally selects TRUE without caller selector | `REAL_ACCEPTED_TRUE_COMMAND_STREAM` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `ACCEPTED_STREAM_INTEGRATION` | exact target/V7/settlement batch | `AUTH-A`; C16 policy support |
| C04 | FALSE delivery is reachable | A real command naturally selects FALSE without caller selector | `REAL_ACCEPTED_FALSE_COMMAND_STREAM` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `ACCEPTED_STREAM_INTEGRATION` | exact target/V7/settlement batch | `AUTH-A`; C17 policy support |
| C05 | Successful task settles atomically | Accepted stream closes V3 opportunity and planned base task in one version | `REAL_ACCEPTED_SETTLEMENT_STREAM` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `ACCEPTED_STREAM_INTEGRATION` | opportunity terminal; task settled | `AUTH-A`; C21 replay support |
| C06 | TRUE fact source is base Dreamer | TRUE yields source `ai-seat-01`, NORMAL, NO_OTHER_CHARACTER_ABILITY, false, count 0 | `CANONICAL_TRUE_OUTCOME_LEDGER_DERIVATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `ACCEPTED_STREAM_INTEGRATION` | exact TRUE matrix | `AUTH-G`; C03 source event support |
| C07 | FALSE fact source/count is base Dreamer | FALSE yields source `ai-seat-01`, ABNORMAL, SOURCE_DRUNKENNESS, true, Dreamer once | `CANONICAL_FALSE_OUTCOME_LEDGER_DERIVATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `ACCEPTED_STREAM_INTEGRATION` | exact FALSE matrix | `AUTH-G`; C04 source event support |
| C08 | Philosopher is causal provenance only | Ledger rejects Philosopher/target as fact source and prevents double count | `CANONICAL_LEDGER_SOURCE_ATTRIBUTION_VALIDATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `ACCEPTED_STREAM_INTEGRATION` | reject substitution/double count | `AUTH-G`; resolved evidence authority |
| C09 | No delivery means no fact | Unsupported/failed command yields no V7 fact and contribution 0 | `CANONICAL_NO_DELIVERY_LEDGER_DERIVATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `ACCEPTED_STREAM_INTEGRATION` | no fact; zero | `AUTH-G`; application failure support |
| C10 | Evidence remains existing nine variants | V7 fact has exact nine ordered evidence entries and no new kind | `CANONICAL_NINE_ENTRY_LEDGER_EVIDENCE_VALIDATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `ACCEPTED_STREAM_INTEGRATION` | exact nine-entry vector | `AUTH-G`; replay corroboration |
| C11 | Self target fails | Real command selecting source Dreamer is rejected without mutation/receipt | `SELF_TARGET_COMMAND_REJECTION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | fail closed | `AUTH-A`; direct target validator support |
| C12 | Traveller target fails | Real command selecting Traveller is rejected without mutation/receipt | `TRAVELLER_TARGET_COMMAND_REJECTION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | fail closed | `AUTH-A`; direct target validator support |
| C13 | Opportunity provenance fails closed | Missing/forged/stale/closed/mismatched V3 opportunity is rejected | `OPPORTUNITY_PROVENANCE_COMMAND_REJECTION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | no batch/receipt/version change | `AUTH-A`; structural support |
| C14 | Receipt/idempotency is preserved | Success stores one receipt; same fingerprint replays; different fingerprint rejects | `COMMAND_RECEIPT_AND_IDEMPOTENCY_SEQUENCE` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | existing receipt semantics | `AUTH-A`; persisted stream support |
| C15 | Dependency/unsupported failure is retryable | Builder/capability failure stores no receipt and leaves opportunity/task open | `RETRYABLE_DEPENDENCY_FAILURE_COMMAND_SEQUENCE` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | retryable and mutation-free | `AUTH-A`; direct capability support |
| C16 | Candidate model is complete/canonical | Full GOOD×EVIL, exact snapshots/IDs, raw UTF-16 order, TRUE/FALSE present | `PURE_CANDIDATE_CONSTRUCTION_POLICY` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T3 MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | exact ordered candidate vector | `AUTH-B`; structural candidate validation |
| C17 | Selection policy is exact | NUL material, code-unit sum, even TRUE/odd FALSE, first canonical member | `PURE_DETERMINISTIC_PAIR_SELECTION_POLICY` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T3 MODULE_PRIVATE_PURE_CORE` | `PURE_POLICY_SEAM` | deterministic selected ID | `AUTH-B`; C03/C04 accepted reachability |
| C18 | V7 exact shape is enforced | Exactly 22 keys, exact literals/nested records, forbidden fields absent | `EXACT_V7_PAYLOAD_SHAPE_VALIDATION` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | valid accept; malformed reject | `AUTH-C`; builder output support |
| C19 | Canonical nested structures are enforced | Candidate, decision, constraint, reliability, snapshots, clone/equality reject malformed shape | `NESTED_CANONICAL_STRUCTURE_VALIDATION` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | fail closed | `AUTH-C`; replay structural support |
| C20 | Hostile inputs are exception-safe | Getters, throwing/revoked Proxy, symbol, cycle, sparse, nonplain fail with getter calls 0 | `HOSTILE_CANONICAL_DATA_PREFLIGHT_MATRIX` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` | reject without escaped exception | `AUTH-D`; all public boundary inventory |
| C21 | Accepted V7 replay succeeds | Full accepted target/V7/settlement stream rebuilds identically from immediate state | `FULL_ACCEPTED_V7_REPLAY_REBUILD` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `ACCEPTED_STREAM_INTEGRATION` | deterministic rebuilt state | `AUTH-F`; C05 batch support |
| C22 | Hostile replay ordering fails | Partial/reordered/duplicate/missing-member/cross-batch stream rejects | `HOSTILE_REPLAY_ORDERING_MUTATION_MATRIX` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `HOSTILE_REPLAY_REJECTION` | fail closed | `AUTH-F`; prospective batch support |
| C23 | Hostile replay payload fails | Mutated role/candidate/policy/impairment/Demon/source/target/revision rejects | `HOSTILE_REPLAY_PAYLOAD_MUTATION_MATRIX` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `HOSTILE_REPLAY_REJECTION` | fail closed | `AUTH-F`; structural validator support |
| C24 | Ledger provenance is replay-bound | Forged/missing/mismatched nine-entry evidence or source substitution rejects | `HOSTILE_REPLAY_LEDGER_PROVENANCE_MUTATION` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `HOSTILE_REPLAY_REJECTION` | fail closed | `AUTH-F`; `AUTH-G` derivation support |
| C25 | Accepted source projection works | Accepted V7 source player sees existing target reference and pair only | `ACCEPTED_STREAM_SOURCE_PRIVATE_PROJECTION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `PROJECTION` | exact existing private shape | `AUTH-H`; C21 accepted replay support |
| C26 | Other players receive no delivery | Same accepted V7 stream omits Dreamer knowledge for every other player/AI | `ACCEPTED_STREAM_OTHER_VIEWER_PROJECTION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `PROJECTION` | omitted | `AUTH-H`; accepted source stream support |
| C27 | Accepted projection leaks no secret | Source view omits impairment, Philosopher, truth, candidates, policy, Demon, ledger | `ACCEPTED_STREAM_PROJECTION_SECRET_AUDIT` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `PROJECTION` | zero forbidden fields | `AUTH-H`; exact output-shape support |
| C28 | State-only V7 is not provenance | Player and AI projection reject a valid-shape V7 lacking accepted-stream provenance with `PrivateKnowledgeUnavailable` | `STATE_ONLY_V7_PROJECTION_REJECTION` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `PROJECTION` | `PrivateKnowledgeUnavailable` | `AUTH-H`; existing V3–V6 guard authority |
| C29 | Hostile V7 projection fails closed | Malformed/getter/Proxy/stale/forged V7 rejects with `PrivateKnowledgeUnavailable` and getter calls 0 | `HOSTILE_V7_PROJECTION_REJECTION` | `R3 HOSTILE_OR_CORRUPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `PROJECTION` | `PrivateKnowledgeUnavailable`; zero getter calls | `AUTH-H`; `AUTH-D` canonical preflight support |
| C30 | Legacy replay/projection is unchanged | Representative V1–V6 accepted histories rebuild/project without reinterpretation | `LEGACY_V1_TO_V6_REPLAY_COMPATIBILITY_MATRIX` | `R2 LEGACY_OR_IMPORTED_ACCEPTED_HISTORY` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `LEGACY_REPLAY_COMPATIBILITY` | unchanged | `AUTH-F`; existing projection regression |
| C31 | Official first-night order is preserved | Accepted chain proves Philosopher 14, Dreamer 61, Mathematician 77 and no lifecycle transition | `ACCEPTED_FIRST_NIGHT_ORDER_STREAM` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2 CANONICAL_DERIVED_STATE` | `ACCEPTED_STREAM_INTEGRATION` | order preserved; task only | `AUTH-A`; nightsheet authority |
| C32 | All required gates pass | Targeted tests plus typecheck, lint, full test, coverage and exact-head CI succeed | `EXACT_HEAD_FULL_GATE_EXECUTION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `CROSS_PLATFORM_CI` | all green on exact HEAD | `AUTH-I`; C01–C31 evidence inventory |
| C33 | Diff and coverage scope remain bounded | Exact file/LOC allowlists, no infrastructure/schema drift, Dreamer remains PARTIAL | `EXACT_HEAD_DIFF_AND_COVERAGE_AUDIT` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `CROSS_PLATFORM_CI` | scope exact; no forbidden change | `AUTH-I`; role coverage matrix update |

## 17. Hostile-Input Matrix

Every applicable boundary covers:

| Input | Result |
|---|---|
| valid exact plain data | accept |
| missing/extra key | reject |
| wrong primitive/literal/version | reject |
| top-level or nested getter | reject; getter calls `0` |
| throwing or revoked Proxy | reject without escaped exception |
| symbol key/value | reject |
| cycle or prohibited shared reference | reject |
| array in record position or sparse candidate array | reject |
| nonplain object or invalid prototype | reject |
| duplicate/unsorted candidate or bad ID round-trip | reject |
| missing/duplicate selected candidate | reject |
| truth or selected/top-level role mismatch | reject |
| catalog/state/revision/source/target/tenure/impairment/Demon mismatch | reject |

The matrix applies to direct validation, prospective batch validation, replay,
ledger derivation, and projection ingestion according to C18–C20, C22–C24,
and C29.

## 18. TRUE/FALSE Reachability Stop Condition

Both truth classes must be produced through real `SubmitDreamerAction` commands
and accepted streams using naturally even/odd frozen material. No caller
selector, builder override, test-only production branch, direct-event-only
acceptance proof, or accepted-history mutation may force the class.

If both cannot be reached inside existing allowed tests without a new fixture
file or scope expansion, stop `HUMAN_BLOCKED`.

## 19. Acceptance Gates

Acceptance requires:

1. exact five-production/six-test allowlists and production LOC `<=1000`;
2. no forbidden fixture, harness, workflow, dependency, ownership, profile,
   timeout, threshold, or topology change;
3. C01–C33 each executed by its one primary mechanism;
4. real TRUE and FALSE application streams;
5. hostile matrices with zero getter calls;
6. normal, Vortox, V4, gained, legacy, replay, projection, and ledger regression;
7. immediate-pre-delivery re-resolution for batch/replay/ledger/projection;
8. `event-applier.ts` unchanged;
9. Dreamer coverage remains `PARTIAL`;
10. complete PR rule evidence and traceability sections.

Before push run:

```text
pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/dreamer.test.ts
pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/domain-batch-semantics.test.ts
pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/first-night-ability-outcome-ledger.test.ts
pnpm exec vitest run --workspace vitest.workspace.ts packages/domain-core/src/rebuild.test.ts
pnpm exec vitest run --workspace vitest.workspace.ts packages/application/src/game-application-service.test.ts
pnpm exec vitest run --workspace vitest.workspace.ts packages/projections/src/private-knowledge-view.test.ts
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
```

CI must pass required checks on the exact pushed product HEAD. One
evidence-supported transient failed-job rerun may be operational recovery;
repeatable product/schema/replay/privacy/assertion failure is a blocker.

## 20. Documentation, PR, and Coverage Updates

The product commit updates the role coverage matrix, four control documents,
log, bounded implementation status/traceability, and PR sections:

- Rule Evidence;
- Rule Claims Implemented;
- Explicitly Unsupported Rules;
- Rule Source Revisions;
- Rule-to-Test Traceability.

Dreamer remains `PARTIAL`; slice coverage is exactly
`PARTIAL / REACHABLE_BASE_DREAMER_SETTLEABILITY_ONLY`.

## 21. Rollback

Before acceptance, rollback is a clean revert of the future product commit.
V7 is additive: V1–V6 remain valid; no migration, destructive rewrite, state
field, command, event type, or projection output schema removal exists.

After accepted V7 history exists, removing V7 readers is forbidden because it
breaks replay. Any post-merge repair must be forward compatible and separately
reviewed.

## 22. Stop Conditions

Return `HUMAN_BLOCKED` without scope expansion if:

- mandatory sources conflict;
- Round 2 review is not `RULE_DESIGN_PASS`;
- more than five production files or 1000 added LOC are needed;
- both `event-applier.ts` and projection require modification;
- any forbidden production/test/infrastructure file is needed;
- a new command/event/state/ledger/evidence/projection field/engine/selector is needed;
- TRUE and FALSE real command streams cannot both be produced;
- V7 cannot be re-resolved from immediate accepted state;
- hostile input cannot fail closed with zero getters;
- accepted normal/Vortox/V4/gained/legacy behavior changes;
- replay, persistence, privacy, receipt, idempotency, or compatibility fails;
- a formal assertion or repeatable exact-head CI fails.

No Design Round 3 is authorized.

## 23. Independent Review Handoff

The reviewer must independently read mandatory external sources or pinned
revisions, `USER_OVERRIDES.md`, resolved evidence, official nightsheet, role
coverage matrix, this complete design, all allowed production/test files, and
accepted V1–V6/replay/ledger/projection history.

Only `RULE_DESIGN_PASS` authorizes implementation. Until then:

```text
ruleReady=true
ruleDesignPass=false
implementationAuthorized=false
```

READY_FOR_RULE_DESIGN_REVIEW_ROUND_2
