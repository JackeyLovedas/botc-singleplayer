# Phase 3 Slice 2B20A Frozen Implementation Design

## Metadata

- sliceId: `2B20A`
- name: `Reachable Base Dreamer Settleability Closure`
- authorization: `USER_AUTHORIZED_2B20_RESLICE_BASE_DREAMER_SETTLEABILITY_CLOSURE`
- parentSlice: `2B20 — RESLICE_REQUIRED / UNACCEPTED`
- branch: `phase-3/reachable-base-dreamer-settleability-closure`
- designBaseHead: `04672e045881c0c566d1233f597b3885a755fd1f`
- designRound: `1 / 2`
- governancePath: `docs/architecture/2B20A-go-no-go-under-governance-v1.md`
- governanceSha256: `9ab18f66a1a64372b3a629a8ab42fad1c8455de61647b11c167ef6d862ee2bf1`
- ruleEvidencePath: `docs/rules/evidence/2B20A.md`
- ruleEvidenceSha256: `1a51a2aebae79e831ca2146aaae47f423b472108bb9759cfc3d452dc344efe00`
- ruleVerdict: `RULE_READY`
- ruleCoverageStatus: `PARTIAL`
- coverageTarget: `PARTIAL / REACHABLE_BASE_DREAMER_SETTLEABILITY_ONLY`
- DreamerRoleCoverage: `PARTIAL`
- ruleSemanticsChanged: `false`
- acceptedBehaviorChanged: `true`
- implementationAuthorized: `false`
- productionFileCeiling: `5`
- addedProductionLocCeiling: `1000`
- currentPR: `none`
- phase2CStarted: `false`

This is the sole Round 1 implementation authority for 2B20A. It is complete and
standalone. It does not authorize implementation until an independent reviewer
returns `RULE_DESIGN_PASS`.

## 1. Bounded Product Outcome

The only newly accepted behavior is the exact reachable accepted stream where:

- the planned task is the original base `DREAMER_ACTION`;
- the source is base Dreamer `ai-seat-01`, seat `1`;
- Philosopher `ai-seat-10`, seat `10`, has chosen `dreamer`;
- accepted history contains exactly one applicable canonical source impairment:
  `DRUNK / PHILOSOPHER_CHOSEN_DUPLICATE / chosenRoleId=dreamer`;
- the unique current Demon is the exact catalog Fang Gu;
- current Vortox is absent;
- current No Dashii is absent;
- the existing V3 Dreamer opportunity is open and the submitted target is legal.

For this stream, `SubmitDreamerAction` changes from retryable
`ApplicationNotConfigured` to one accepted atomic three-event batch:

1. `DreamerTargetChosen` with the existing V2 target payload;
2. `DreamerInformationDelivered` with the new V7 payload;
3. `ScheduledTaskSettled` with the existing Dreamer settlement payload.

All other previously unsupported source states remain fail closed. Existing normal
base Dreamer, effective-current-Vortox base Dreamer, canonical-drunk/effective-Vortox
base Dreamer, Philosopher-gained Dreamer, and all historical V1–V6 deliveries retain
their accepted behavior and schema.

## 2. Explicit Non-Goals

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
- a new command type or command payload;
- a new Dreamer opportunity schema;
- a new ledger schema, evidence variant, or Mathematician aggregation model;
- projection shape expansion;
- promotion of Dreamer beyond `PARTIAL`.

## 3. New Version Constants

`packages/domain-core/src/dreamer.ts` adds exactly these public constants:

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

No existing constant changes value.

## 4. Exact New Types

### 4.1 Candidate identity

```ts
export type DreamerApparentPairCandidateId = string & {
  readonly __brand: "DreamerApparentPairCandidateId";
};
```

Canonical grammar:

```text
dreamer-apparent-pair-v1:good:<goodRoleId>:evil:<evilRoleId>
```

Both role IDs must be canonical non-empty role identifiers with no colon or control
character. Parsing must round-trip through the formatter. IDs are derived from role
IDs only and never use time, randomness, locale, UUIDs, array position, or object
identity.

### 4.2 Candidate

```ts
export type DreamerApparentPairCandidate = {
  readonly candidateId: DreamerApparentPairCandidateId;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly truthClassification: "TRUE" | "FALSE";
};
```

This is an exact four-key record. `goodRole` must be an exact role-catalog snapshot
whose character type is `TOWNSFOLK` or `OUTSIDER`. `evilRole` must be an exact
role-catalog snapshot whose character type is `MINION` or `DEMON`.

`truthClassification` is recomputed from the settlement-time target role:

- `TRUE` iff `goodRole.roleId` or `evilRole.roleId` equals the target's actual
  settlement-time role ID;
- `FALSE` otherwise.

The validator never trusts stored `truthClassification`.

### 4.3 Apparent pair decision

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

This is an exact four-key record. `legalCandidates` is complete, non-empty,
duplicate-free, canonically ordered, deeply immutable by contract, and contains at
least one `TRUE` and one `FALSE` candidate. `selectedCandidateId` must identify
exactly one member.

### 4.4 Current Demon constraint

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

This is an exact six-key record. `demonRole` must be byte-equivalent to the unique
`fang_gu` role snapshot in the accepted setup catalog. At
`evaluatedCharacterStateRevision`, exactly one current character-state entry has
character type `DEMON`; it must match `demonPlayerId`, `demonSeatNumber`, and the
catalog Fang Gu snapshot. Any zero, duplicate, different, stale, mismatched, Vortox,
No Dashii, or unprovable Demon result fails closed.

### 4.5 Reliability

```ts
export type DreamerCanonicalDrunkApparentInformationReliability = {
  readonly kind: "CANONICAL_SOURCE_DRUNK_APPARENT_INFORMATION";
};
```

This exact one-key record means the stored pair is apparent information delivered
while the source Dreamer is canonically drunk. It does not state whether the pair is
true or false to projections.

### 4.6 V7 delivery: exact 22-key shape

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

There are exactly 22 keys. V7 must not contain `vortoxConstraint`,
`falseRolePolicyVersion`, caller-supplied candidate data, or hidden enumerable keys.
`goodRole` and `evilRole` must exactly clone the selected candidate.

`DreamerInformationDeliveredPayload` adds V7 as one new union member. Existing V1–V6
types are unchanged.

## 5. Capability Resolution

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

### 5.1 Frozen resolver order

`resolveBaseDreamerV2NormalCapability` preserves these decisions in order:

1. Validate canonical input data without invoking accessors.
2. Prove the V3 base Dreamer opportunity, base task, source player/seat/role,
   base ability instance, active continuous role tenure, and revisions.
3. Resolve applicable source impairments.
4. If multiple, duplicated, conflicting, stale, noncanonical, or unprovable
   impairments exist, return existing fail-closed unresolved/unsupported output.
5. Recognize canonical Philosopher-caused Dreamer `DRUNK` only when all exact
   `DreamerCanonicalPhilosopherDrunkSourceImpairment` fields match accepted history.
6. Resolve exactly one current catalog-backed Demon.
7. If current Demon is No Dashii, preserve
   `NO_DASHII_EFFECT_UNRESOLVED`.
8. If current Demon is Vortox, preserve the existing Vortox applicability resolution:
   - normal effective source => existing
     `VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED`;
   - exact canonical-drunk source and effective current Vortox => existing
     `CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED`;
   - impaired/unprovable Vortox => existing fail-closed result.
9. If current Demon is exact catalog Fang Gu:
   - no applicable source impairment => existing `NORMAL_INFORMATION_SUPPORTED`;
   - exact single canonical Philosopher-caused Dreamer `DRUNK` =>
     `CANONICAL_DRUNK_SOURCE_FANG_GU_APPARENT_INFORMATION_SUPPORTED`;
   - any other impairment => existing `SOURCE_REPRESENTED_IMPAIRED` or fail-closed
     unresolved result.
10. Any other current Demon remains unsupported and fails closed.

No gained-Dreamer resolver behavior changes.

## 6. Apparent Pair Candidate Construction

The V7 builder independently constructs the complete legal set from accepted setup
catalog and settlement-time target facts.

### 6.1 Candidate domains

- GOOD domain: every exact catalog role whose `characterType` is `TOWNSFOLK` or
  `OUTSIDER`.
- EVIL domain: every exact catalog role whose `characterType` is `MINION` or
  `DEMON`.
- Candidate set: full Cartesian product `GOOD × EVIL`.

No current-in-play filter, setup-assignment filter, target-alignment filter, or
caller filter is permitted. Each pair has one GOOD and one EVIL role by construction.

### 6.2 Canonical ordering

1. Validate every catalog role snapshot and reject duplicate role IDs or mismatched
   snapshots.
2. Format each candidate ID from the two role IDs.
3. Sort candidates by raw UTF-16 code-unit order of `candidateId`.
4. Do not use `localeCompare`, `Intl.Collator`, environment locale, filesystem order,
   object enumeration order, random values, or timestamps.
5. Reject duplicate candidate IDs.
6. Require at least one `TRUE` and one `FALSE` candidate.

Raw UTF-16 comparison walks code units left-to-right, returns on the first unequal
unit, and breaks an exact shared prefix by string length.

### 6.3 Deterministic simulation policy

Selection material is the exact JavaScript string:

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

- even sum => select truth class `TRUE`;
- odd sum => select truth class `FALSE`;
- from that class, select the first candidate in canonical order.

The full ordered candidates and selected ID are persisted in
`apparentPairDecision`. This parity rule is an approved deterministic simulator
policy, not an official BOTC rule or the only legal Storyteller choice.

The builder accepts no pair, candidate list, selected ID, truth class, parity, seed,
or policy override from its caller.

## 7. V7 Builder Contract

Add one builder in `dreamer.ts` whose inputs are only:

- `rulesBaselineVersion`;
- existing V2 target choice;
- accepted setup;
- settlement-time current character state;
- exact supported capability.

The builder:

1. validates all inputs as canonical data;
2. re-proves target and source facts;
3. re-proves the unique current Fang Gu constraint at the evaluated revision;
4. re-proves the exact canonical Philosopher-caused Dreamer impairment;
5. builds and sorts the complete candidate set;
6. derives deterministic truth parity and selected candidate;
7. deep-clones all stored nested values;
8. returns the exact V7 22-key payload.

Any inconsistency throws `InvalidDreamerInformationDeliveredPayload`; the application
boundary maps construction failure to the existing retryable, receipt-free,
mutation-free dependency failure contract.

## 8. Validation, Equality, Clone, and Re-resolution

All V7 surfaces must be exception-safe:

- public payload shape validator;
- stored delivery validator;
- candidate ID parser/formatter;
- candidate validator;
- decision validator;
- current Demon constraint validator;
- reliability validator;
- deep clone;
- equality comparison;
- replay/prospective re-resolution.

Every entry runs the canonical-data preflight before `Object.keys`,
`Object.getPrototypeOf`, property reads, spreading, iteration, cloning, or equality.
All getters must be invoked exactly zero times.

Reject, without throwing across the public validation boundary:

- missing keys;
- extra keys;
- wrong types or literals;
- accessor properties at any depth;
- throwing Proxy;
- revoked Proxy;
- symbol keys or symbol values;
- cycles or shared-reference structures prohibited by canonical data;
- arrays where records are required;
- sparse arrays;
- nonplain objects;
- null-prototype mismatches where the existing canonical contract rejects them;
- duplicate candidates or IDs;
- unsorted candidates;
- missing TRUE or FALSE class;
- selected ID absent or duplicated;
- candidate truth mismatch;
- selected roles not matching top-level `goodRole`/`evilRole`;
- catalog snapshot mismatch;
- source, target, revision, task, opportunity, tenure, impairment, or Demon mismatch.

Clone and equality helpers must first validate and then operate only on known exact
keys. Equality includes the complete ordered candidate vector, selected ID, nested
role snapshots, impairment, source contract, and current Demon constraint.

## 9. Application Command and Atomic Batch

`SubmitDreamerAction` command type, fingerprint schema, decision shape, actor rules,
target rules, and V3 opportunity schema remain unchanged.

The internal prepared submission union adds one member:

```ts
{
  readonly kind: "BASE_DREAMER_CANONICAL_DRUNK_FANG_GU_APPARENT_V7";
  readonly targetChoice: DreamerTargetChosenPayloadV2;
  readonly delivery: DreamerInformationDeliveredPayloadV7;
  readonly settlement: DreamerInformationDeliveredScheduledTaskSettlement;
}
```

For the new supported capability, preparation builds V2 target, V7 delivery, and the
existing scheduled-task settlement. Event creation emits exactly three events in one
batch, consecutive event sequences, and one new game version:

```text
DreamerTargetChosen
DreamerInformationDelivered
ScheduledTaskSettled
```

No event may be written before the complete batch passes prospective validation.
Partial append, missing member, reordering, duplicate member, different batch ID,
different game version, or sequence gap is invalid.

On success:

- the V3 opportunity becomes terminal through accepted target/delivery history;
- the planned base Dreamer task is formally settled;
- exactly one accepted command receipt is stored;
- same command ID and same fingerprint returns the stored idempotent result;
- same command ID and different fingerprint is rejected by existing rules.

On any unsupported, malformed, stale, or dependency-failure state:

- result remains retryable failure where currently applicable;
- no receipt is stored;
- no event or game-version mutation occurs;
- the opportunity remains `OPEN`;
- the task remains pending.

## 10. Prospective and Replay Semantics

`domain-batch-semantics.ts` accepts V7 only in the exact three-event Dreamer batch.
It re-resolves from the immediate pre-delivery state and compares:

- target V2;
- source contract and active base Dreamer tenure;
- base ability instance;
- exact canonical impairment;
- unique current catalog Fang Gu constraint;
- complete ordered candidate list;
- every candidate truth classification;
- parity material and selected class;
- selected candidate ID;
- top-level roles;
- V7 exact shape;
- settlement task and revision.

`event-applier.ts` performs the same stored-delivery validation before adding the V7
delivery to existing Dreamer information state. It adds no top-level state field.

Full replay must reject:

- V7 without its immediately preceding matching target;
- target without matching V7;
- V7 without matching settlement;
- reordered or duplicated events;
- mutated pair, candidate vector, selected ID, policy version, reliability,
  impairment, Demon constraint, source contract, target, or revision;
- a delivery built from a later state rather than the immediate pre-delivery state;
- a non-Fang-Gu, Vortox, No Dashii, ambiguous, or catalog-mismatched current Demon;
- source impairment absent, duplicated, poisoned, conflicting, stale, or forged.

Accepted V1–V6 history remains replayable without reinterpretation.

## 11. Outcome Ledger and Mathematician

No ledger constant, fact schema, evidence variant, evidence ordering model, ability
instance identity, or Mathematician aggregation algorithm changes.

Each accepted V7 delivery yields exactly one base Dreamer
`FirstNightAbilityOutcomeFact`:

- `sourcePlayerId = ai-seat-01`;
- `sourceSeatNumber = 1`;
- `abilityRoleId = dreamer`;
- `abilityTaskId` is the base Dreamer task;
- `abilityInstance.kind = BASE_ROLE_TASK`;
- counted source remains the Dreamer ability holder;
- Philosopher `ai-seat-10` appears only as causal impairment provenance and is not
  the fact's counted `sourcePlayerId`.

### 11.1 TRUE selected candidate

```text
outcomeStatus = NORMAL
causeKind = NO_OTHER_CHARACTER_ABILITY
causedByAnotherCharacterAbility = false
Mathematician contribution = 0
```

### 11.2 FALSE selected candidate

```text
outcomeStatus = ABNORMAL
causeKind = SOURCE_DRUNKENNESS
causedByAnotherCharacterAbility = true
Mathematician contribution = base Dreamer source player once
```

The false outcome is causally linked to the Philosopher impairment evidence, but
aggregation counts the Dreamer fact's source player once under the existing model.
It must not count Philosopher separately, count Dreamer twice, or create a second
fact.

### 11.3 No delivery

An unsupported or failed command creates no delivery and therefore no V7 outcome
fact or Mathematician contribution.

### 11.4 Exact nine evidence entries

The fact contains exactly nine existing evidence variants, in canonical evidence
ordering:

1. `SOURCE_EVENT` — the V7 `DreamerInformationDelivered` event;
2. `TASK` — the base `DREAMER_ACTION`;
3. `ACTION_OPPORTUNITY` — the matching open/accepted-history V3 opportunity;
4. `CHARACTER_STATE` — the evaluated settlement revision;
5. `PLAYER_ROLE_AT_REVISION` — base Dreamer source at that revision;
6. `PLAYER_ROLE_AT_REVISION` — selected target at that revision;
7. `ROLE_TENURE` — active base Dreamer tenure;
8. `ABILITY_IMPAIRMENT` — exact canonical Philosopher-caused `DRUNK`;
9. `DREAMER_DELIVERY` — the V7 delivery summary.

No new evidence kind is added. Evidence must validate against accepted event history,
task/opportunity identity, current character state, tenure, impairment, and delivery.

## 12. Projection Contract

Production projection code is not modified.

The existing private Dreamer projection consumes the unioned stored delivery and
continues to expose only the existing projection shape to the source player/AI:

- target player/seat reference;
- delivered good role;
- delivered evil role;
- existing supported knowledge model marker where already present.

It must not expose:

- V7 schema/version;
- reliability kind;
- `DRUNK`;
- impairment ID or `PHILOSOPHER_CHOSEN_DUPLICATE`;
- Philosopher player, seat, choice, grant, or causal role;
- target actual role or truth classification;
- legal candidates or selected candidate ID;
- candidate/policy versions or parity material;
- Fang Gu identity or current Demon constraint;
- ledger fact or Mathematician internals.

Other players and AIs receive no Dreamer delivery. Public and Storyteller projection
behavior is unchanged. Projection validation must fail closed on damaged V7 stored
data even though no projection production file changes.

## 13. Production File Allowlist

Implementation may modify at most these five production files:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/event-applier.ts`
4. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
5. `packages/application/src/game-application-service.ts`

The total added production LOC across these files must not exceed `1000`.

Explicitly forbidden production files include:

- `packages/domain-core/src/events.ts`;
- any `game-state` file;
- `packages/domain-core/src/first-night-task-plan.ts`;
- `packages/domain-core/src/first-night-action-opportunity.ts`;
- Philosopher production files;
- Mathematician production files;
- all projection production files;
- all workflow, dependency, profile, and ownership infrastructure.

If implementation requires a forbidden production file, sixth production file, new
event type, new command, new state field, new ledger variant, or more than 1000 added
production LOC, stop as `HUMAN_BLOCKED`; do not expand the design silently.

## 14. Test File Allowlist

Implementation may modify only these six test files:

1. `packages/domain-core/src/dreamer.test.ts`
2. `packages/domain-core/src/domain-batch-semantics.test.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
4. `packages/domain-core/src/rebuild.test.ts`
5. `packages/application/src/game-application-service.test.ts`
6. `packages/projections/src/private-knowledge-view.test.ts`

No fixture, harness, snapshot, workflow, timeout, dependency, test ownership, shard,
coverage profile, threshold, or project topology change is authorized.

## 15. Rule-Claim-to-Test Traceability

| ID | Frozen requirement | Primary test authority |
|---|---|---|
| RC-01 | Real accepted chain proves source Dreamer `ai-seat-01/1`, Philosopher `ai-seat-10/10`, exact canonical impairment, Fang Gu, no Vortox/No Dashii | `game-application-service.test.ts` |
| RC-02 | New capability only for exact canonical Philosopher-drunk base Dreamer plus unique catalog Fang Gu | `dreamer.test.ts` |
| RC-03 | Existing normal, Vortox, canonical-drunk/Vortox, gained, No Dashii, poisoned, ambiguous paths are unchanged/fail closed | `dreamer.test.ts`, `game-application-service.test.ts` |
| RC-04 | Candidate ID grammar formats/parses canonically | `dreamer.test.ts` |
| RC-05 | Full GOOD × EVIL Cartesian product, exact snapshots, unique IDs, raw UTF-16 order | `dreamer.test.ts` |
| RC-06 | Truth iff pair contains settlement-time target role; at least one TRUE and FALSE | `dreamer.test.ts` |
| RC-07 | Exact NUL-delimited parity material, code-unit sum, even TRUE/odd FALSE, first canonical member | `dreamer.test.ts` |
| RC-08 | Builder accepts no caller pair/candidate/selector and produces exact V7 22-key shape | `dreamer.test.ts` |
| RC-09 | V7 excludes `vortoxConstraint` and `falseRolePolicyVersion` | `dreamer.test.ts`, `rebuild.test.ts` |
| RC-10 | Exact current Fang Gu constraint is catalog/state/revision bound | `dreamer.test.ts`, `rebuild.test.ts` |
| RC-11 | All validators, clone, equality, and re-resolution reject hostile canonical-data inputs with zero getter calls | all four domain-core test files |
| RC-12 | Real TRUE selection succeeds through `SubmitDreamerAction` with no caller selector | `game-application-service.test.ts` |
| RC-13 | Real FALSE selection succeeds through `SubmitDreamerAction` with no caller selector | `game-application-service.test.ts` |
| RC-14 | Target V2 + delivery V7 + settlement are one exact atomic batch | `game-application-service.test.ts`, `domain-batch-semantics.test.ts` |
| RC-15 | Partial, reordered, duplicated, forged, or mutated batches/replay fail | `domain-batch-semantics.test.ts`, `rebuild.test.ts` |
| RC-16 | Success stores receipt and is idempotent; unsupported/dependency failures are receipt-free and mutation-free | `game-application-service.test.ts` |
| RC-17 | TRUE V7 derives NORMAL / NO_OTHER_CHARACTER_ABILITY / false / count 0 | `first-night-ability-outcome-ledger.test.ts` |
| RC-18 | FALSE V7 derives ABNORMAL / SOURCE_DRUNKENNESS / true / Dreamer source once | `first-night-ability-outcome-ledger.test.ts` |
| RC-19 | No delivery gives no fact/count; no Philosopher/Dreamer double count | `first-night-ability-outcome-ledger.test.ts` |
| RC-20 | V7 fact has exactly the nine frozen existing evidence variants | `first-night-ability-outcome-ledger.test.ts`, `rebuild.test.ts` |
| RC-21 | Source player/AI sees only target and pair; all impairment, truth, candidate, policy, Demon, and ledger data stays hidden | `private-knowledge-view.test.ts` |
| RC-22 | Official first-night interaction order and coverage remain PARTIAL; no lifecycle behavior starts | `game-application-service.test.ts`, documentation diff audit |

All RC rows require positive, negative, replay, and source-contract assertions
appropriate to their layer. Passing unrelated tests cannot replace a missing RC row.

## 16. Hostile-Input Matrix

Each applicable validator boundary must test:

| Input class | Required result |
|---|---|
| valid exact plain record | accept |
| missing required key | reject |
| extra enumerable key | reject |
| wrong primitive type | reject |
| wrong literal/version | reject |
| top-level getter | reject; getter calls `0` |
| nested getter in role, candidate, decision, impairment, contract, or constraint | reject; getter calls `0` |
| throwing Proxy | reject without escaping exception |
| revoked Proxy | reject without escaping exception |
| symbol key | reject |
| symbol value | reject |
| direct or nested cycle | reject |
| array in record position | reject |
| sparse `legalCandidates` array | reject |
| nonplain object | reject |
| duplicate/unsorted candidates | reject |
| invalid candidate ID round-trip | reject |
| selected candidate missing/duplicated | reject |
| truth classification mismatch | reject |
| top-level selected roles mismatch | reject |
| catalog/state/revision mismatch | reject |

The matrix applies to direct validators, prospective validation, event application,
full replay, outcome-ledger derivation, and private projection ingestion as relevant.

## 17. TRUE/FALSE Reachability Stop Condition

Both truth classes must be exercised through real `SubmitDreamerAction` commands and
accepted event streams. Tests may choose different legal targets or exact accepted
setup facts whose frozen parity material naturally yields even and odd sums.

Tests and production must not add:

- a caller truth selector;
- a caller candidate selector;
- a builder override;
- a test-only production branch;
- direct event construction as the sole application acceptance proof;
- mutation of accepted history to force parity.

If the existing real command/fixture authority cannot produce both a TRUE and FALSE
accepted V7 stream without any such selector or mutation, implementation stops
`HUMAN_BLOCKED`. The implementer must not add a new fixture file or broaden the
allowlist.

## 18. Acceptance Gates

Implementation acceptance requires all of:

1. Exact five-production/six-test allowlists.
2. Added production LOC `<= 1000`.
3. No forbidden production, fixture, harness, workflow, dependency, ownership,
   profile, timeout, threshold, or topology change.
4. All RC-01 through RC-22 tests pass.
5. Both real TRUE and FALSE application streams pass.
6. Hostile-input matrix passes with zero getter calls.
7. Existing normal, Vortox, V4, gained, legacy, replay, projection, and ledger
   regressions pass.
8. V7 accepted batch/replay/ledger facts re-resolve from immediate pre-delivery
   canonical state.
9. Coverage matrix remains Dreamer `PARTIAL`.
10. Documentation and PR rule traceability are complete.

## 19. Local and CI Gates

Before push:

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

CI must pass all required checks on the exact pushed product HEAD. A transient,
evidence-supported failed-job rerun remains operational recovery only under repository
governance; a repeatable exact-head product, schema, replay, privacy, assertion, or
compatibility failure is a product blocker.

No timeout, dependency, workflow, shard, ownership, or profile adjustment is
authorized by this design.

## 20. Documentation and Coverage Updates at Implementation

After implementation but before final review, the same product commit must update:

- `docs/rules/ROLE_COVERAGE_MATRIX.md` for the new reachable base Dreamer path;
- `docs/agent-loop/AUTOPILOT_STATE.json`;
- `docs/agent-loop/CURRENT_TASK.md`;
- `docs/agent-loop/PROJECT_STATE.md`;
- `docs/agent-loop/AUTOPILOT_LOG.md`;
- one bounded implementation status/traceability document if required by the review
  protocol;
- the complete PR body sections: Rule Evidence, Rule Claims Implemented, Explicitly
  Unsupported Rules, Rule Source Revisions, and Rule-to-Test Traceability.

Dreamer remains `PARTIAL`; coverage wording is exactly
`PARTIAL / REACHABLE_BASE_DREAMER_SETTLEABILITY_ONLY`.

## 21. Rollback

Rollback is the clean revert of the future 2B20A product commit before it is accepted.
Because V7 is additive:

- V1–V6 history remains valid;
- no migration or destructive rewrite is needed;
- no top-level state field must be removed;
- no command or event type is removed;
- no projection schema rollback is needed.

After any accepted V7 history exists, reverting V7 readers without an explicit
compatibility plan is forbidden because replay would fail. Pre-merge rollback must
therefore happen before acceptance; post-merge repair requires a separately reviewed
forward-compatible change.

## 22. Stop Conditions

Immediately return `HUMAN_BLOCKED` and do not broaden scope if:

- mandatory rule sources conflict for an in-scope claim;
- independent design review does not return `RULE_DESIGN_PASS` within round `2 / 2`;
- implementation needs more than five production files or 1000 added production LOC;
- a forbidden production/test/infrastructure file is required;
- a new command, event type, top-level state field, ledger schema, evidence variant,
  projection field, generic impairment engine, or caller selector is required;
- real TRUE and FALSE command streams cannot both be produced;
- V7 cannot be fully re-resolved from immediate pre-delivery accepted state;
- hostile data cannot fail closed with zero getter calls;
- accepted normal/Vortox/V4/gained/legacy behavior changes;
- replay, persistence, privacy, receipt, idempotency, or schema compatibility fails;
- a formal assertion fails or exact-head CI fails repeatably.

## 23. Design Review Handoff

The independent reviewer must read:

- all mandatory external sources or their exact pinned revisions;
- `docs/rules/USER_OVERRIDES.md`;
- `docs/rules/evidence/2B20A.md`;
- the official nightsheet;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`;
- this entire design;
- all allowed production and test files;
- accepted Dreamer V2/V3/V4/V5/V6 and ledger/replay/projection history.

The only passing design verdict is `RULE_DESIGN_PASS`. Until that exact verdict is
returned, `implementationAuthorized=false`.

READY_FOR_RULE_DESIGN_REVIEW
