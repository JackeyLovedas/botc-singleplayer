# Phase 3 Slice 2B17 Design: Clockmaker First-Night Information

Design round: `3 / 3`
Status: implementation unauthorized pending independent `RULE_DESIGN_PASS`.

User continuation authorization:

- The user explicitly authorized one additional design round beyond the previous `2 / 2` limit.
- This round may close only the single stored Vortox historical-identity blocker.
- It does not authorize production changes, test implementation, branch creation or scope expansion.

Evidence remains unchanged:

- `docs/rules/evidence/2B17.md`
- SHA-256: `db1fb83335e6a2083f85797b83516b8b646538ee3afcfd5ac92319147432d97e`
- terminal verdict: `RULE_READY`
- coverage: `PARTIAL`
- no applicable user override
- no unresolved source conflict.

Round-2 design:

- SHA-256: `0892e4e8b74279f445100a7912f1b5220aba9ab51369aac8ce3a8603d62a1787`

Round-2 review:

- `docs/implementation/phase-3-slice-2b17-design-review-round-2.md`
- SHA-256: `148d756129a1eb08678d30b5d094e88b90ebd0842b4021e7dee1bed5fad5be8d`
- verdict: `RULE_DESIGN_FIX_REQUIRED`
- remaining blockers: one.

Round 3 closes only:

```text
stored native Demon snapshot
↔ Vortox constraint
↔ preserved active/effective Vortox tenure
```

at `settlementCharacterStateRevision`.

No rule conclusion, supported history, event, command, production boundary or coverage claim is expanded.

## ruleClaims

1. Clockmaker learns the seated distance from the current Demon to the nearest current Minion.
2. Native identity is determined exclusively by settlement-time `CurrentCharacterState.role.characterType`, never alignment.
3. The supported 12-player setup has exactly one native Demon and two native Minions.
4. Both Demon–Minion pairs are calculated; the minimum is the native truth.
5. Adjacent seats have distance `1`; opposite seats have distance `6`.
6. Canonical native truth is `1..6`.
7. The complete numeric domain is `0..6`; `0` is sourced for unsupported no-Demon/no-Minion histories.
8. Base Clockmaker resolves after Snake Charmer.
9. Philosopher-gained Clockmaker resolves after Philosopher and before Minion information.
10. Philosopher choosing Clockmaker canonically makes the original Clockmaker drunk.
11. Drunk without Vortox retains all `0..6` as legal information, including truth.
12. The deterministic drunk policy selects the smallest false value while preserving truth in the legal set.
13. An effective current Vortox permits only false values.
14. Vortox plus Clockmaker drunkenness still excludes truth.
15. Poison has the same pure candidate legality as drunkenness but no canonical poisoned-Clockmaker producer exists.
16. Stored `KNOWN_DRUNK` requires the exact preserved canonical impairment fact.
17. Stored `VORTOX_FALSE_REQUIRED` requires the exact active and effective preserved Vortox tenure.
18. At settlement revision, `VORTOX_FALSE_REQUIRED` exists if and only if the delivery’s single historical native Demon is the exact setup-catalog Vortox.
19. When that biconditional is true, the native Demon, constraint and tenure must describe the same player, seat and exact Vortox role.
20. When it is false, the native Demon must not be Vortox and no active Vortox tenure may conflict with `NONE`.
21. Delivered information is historical and is not recomputed from later state or later unrelated impairments.

## supportedCanonicalHistories

The exact supported canonical history set remains seven entries:

```ts
type SupportedClockmakerCanonicalHistory =
  | "BASE_EFFECTIVE_NATIVE"
  | "BASE_EFFECTIVE_AFTER_SNAKE_CHARMER_SWAP"
  | "PHILOSOPHER_GAINED_EFFECTIVE_NATIVE"
  | "ORIGINAL_BASE_DRUNK_AFTER_PHILOSOPHER_GAIN"
  | "BASE_EFFECTIVE_WITH_VORTOX"
  | "ORIGINAL_BASE_DRUNK_WITH_VORTOX"
  | "PHILOSOPHER_GAINED_EFFECTIVE_WITH_VORTOX";
```

1. `BASE_EFFECTIVE_NATIVE`
   - base source;
   - one non-Vortox native Demon;
   - two native Minions;
   - no source impairment;
   - `vortoxConstraint.kind === "NONE"`.

2. `BASE_EFFECTIVE_AFTER_SNAKE_CHARMER_SWAP`
   - canonical Demon-hit precedes base Clockmaker;
   - delivery uses the new current Demon seat.

3. `PHILOSOPHER_GAINED_EFFECTIVE_NATIVE`
   - exact grant and insertion;
   - resolves before `MINION_INFO`.

4. `ORIGINAL_BASE_DRUNK_AFTER_PHILOSOPHER_GAIN`
   - exact duplicate-role impairment;
   - original base Clockmaker resolves drunk.

5. `BASE_EFFECTIVE_WITH_VORTOX`
   - the stored native Demon is exact Vortox;
   - exact active/effective matching Vortox tenure;
   - false-only candidates.

6. `ORIGINAL_BASE_DRUNK_WITH_VORTOX`
   - exact source drunkenness;
   - stored native Demon is exact Vortox;
   - exact active/effective matching tenure;
   - truth excluded.

7. `PHILOSOPHER_GAINED_EFFECTIVE_WITH_VORTOX`
   - exact grant/insertion;
   - stored native Demon is exact Vortox;
   - exact active/effective matching tenure;
   - truth excluded.

Every supported history requires:

- a direct accepted event-history test;
- identical-command retry;
- the same accepted summary;
- `idempotent: true`;
- zero append;
- unchanged version.

Constructed `GameState` alone is not canonical reachability evidence.

## unsupportedCanonicalHistories

Only pure helpers or fail-closed guards may cover:

- poisoned player who remains Clockmaker;
- Spy, Recluse or Summoner registration;
- zero Demons or Minions;
- multiple Demons;
- Minion count other than two;
- Travellers;
- death/revival/life state;
- impaired current Vortox;
- multiple current Vortox;
- Vortox without one exact active tenure;
- Vortox constraint inconsistent with the stored native Demon;
- general character/alignment changes;
- later-night Philosopher acquisition;
- recurring Clockmaker behavior.

No successful canonical event may claim these histories.

## identityModel

Use:

```ts
type ClockmakerIdentityModel = "NATIVE_CHARACTER_TYPE_ONLY";
```

The resolver selects only:

```ts
entry.role.characterType === "DEMON"
entry.role.characterType === "MINION"
```

It never classifies by alignment.

Canonical requirements:

- exactly one native Demon reference;
- exactly two native Minion references;
- distinct players and seats;
- exact setup-catalog role snapshots;
- roster identity equality;
- numeric seat ordering.

Failures:

- `INVALID_CURRENT_CHARACTER_STATE`
- `INVALID_NATIVE_DEMON_COUNT`
- `INVALID_NATIVE_MINION_COUNT`
- `DUPLICATE_NATIVE_REFERENCE`
- `UNSUPPORTED_REGISTRATION_REQUIRED`

Registration and alignment approximations are forbidden. The Seamstress tenure grammar is not extended to Clockmaker.

## distanceFormula

For distinct seats `d` and `m` in `1..12`:

```text
clockwise     = (m - d + 12) % 12
counter       = (d - m + 12) % 12
pairDistance  = min(clockwise, counter)
```

Directional values are `1..11`; nearest distance is `1..6`.

Truth:

```text
truth = min(
  distance(demonSeat, minionSeatA),
  distance(demonSeat, minionSeatB)
)
```

Pair snapshots sort by:

1. Demon seat;
2. Minion seat;
3. stable `<`/`>` player-ID comparison.

Locale-sensitive ordering is forbidden.

## candidateDomain

```ts
type ClockmakerDistance = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const CLOCKMAKER_DISTANCE_DOMAIN =
  [0, 1, 2, 3, 4, 5, 6] as const;
```

Rules:

- canonical truth: `1..6`;
- output domain: exact dense ordered `0..6`;
- reject negative, `>6`, fractional, nonfinite, string, sparse, duplicate or unordered values;
- false candidates differ from truth;
- an empty required false set fails closed;
- unsupported missing-type histories do not create canonical `0` deliveries.

## sourceEffectiveness

```ts
type ClockmakerSourceEffectiveness =
  | {
      kind: "EFFECTIVE";
      representedImpairmentIds: readonly [];
    }
  | {
      kind: "KNOWN_DRUNK";
      representedImpairmentIds: readonly [AbilityImpairmentId];
      sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE";
    };
```

Base source:

- no relevant impairment: `EFFECTIVE`;
- exactly one valid Philosopher duplicate impairment: `KNOWN_DRUNK`;
- duplicate, malformed or cross-linked impairment: fail closed;
- Snake Charmer poison affecting a current Clockmaker: unsupported/fail closed.

Gained source:

- supported gained source is effective;
- original Clockmaker impairment does not impair the Philosopher source;
- an impairment affecting the gained source is unsupported/fail closed.

Pure helpers may model drunk or poisoned legality. Canonical payloads contain only `EFFECTIVE` or `KNOWN_DRUNK`.

### Exact preserved impairment contract

For `KNOWN_DRUNK`, the sole represented impairment ID binds to exactly one preserved `AbilityImpairmentApplied` fact with exact:

```text
impairmentId
kind === DRUNK
sourceKind === PHILOSOPHER_CHOSEN_DUPLICATE
sourcePlayerId
affectedPlayerId
affectedSeatNumber
affectedRole
chosenRoleId === clockmaker
sourceCharacterStateRevision
```

It additionally binds:

- affected player/seat/role to the base Clockmaker source;
- impairment source to the exact Philosopher choice/grant;
- encoded source and affected seats;
- choice/grant revision;
- revision at or before settlement;
- reproducible canonical impairment ID;
- exactly one choice/grant/impairment chain.

Missing, duplicate, forged or cross-linked represented impairment is invalid.

Later unrelated impairment facts do not recompute the delivery and cannot replace the represented impairment.

## vortoxConstraint

```ts
type ClockmakerVortoxConstraint =
  | { kind: "NONE" }
  | {
      kind: "VORTOX_FALSE_REQUIRED";
      evaluatedCharacterStateRevision: number;
      vortoxPlayerId: PlayerId;
      vortoxSeatNumber: SeatNumber;
      vortoxRoleTenureId: RoleTenureId;
    };
```

### Runtime Vortox resolution

`VORTOX_FALSE_REQUIRED` requires at settlement:

- exactly one current exact-catalog Vortox;
- exactly one matching active Vortox tenure;
- matching player and seat;
- role `vortox`;
- acquisition revision at or before settlement;
- no end revision at or before settlement;
- canonical parsed tenure ID;
- no represented impairment disabling that tenure.

`NONE` is allowed only if:

- current state is valid;
- the current native Demon is not Vortox;
- no active Vortox tenure conflicts with that absence;
- no malformed Vortox tenure/impairment makes effectiveness indeterminate.

Fail closed rather than returning `NONE` for:

- current Vortox with missing tenure;
- multiple matching tenures;
- cross-linked tenure;
- multiple current Vortox;
- malformed relevant impairment;
- settlement-time impaired Vortox;
- conflicting active Vortox tenure.

Do not copy the Seamstress missing-tenure-to-`NONE` behavior.

### Strict historical Vortox biconditional

At `delivery.settlementCharacterStateRevision`, stored validation must enforce:

```text
delivery.vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED"
iff
delivery.nativeDemonReferences[0].role
  is the exact setup-catalog Vortox snapshot
```

This is a strict biconditional, not two optional independent validations.

When true:

1. `nativeDemonReferences` has exactly one entry.
2. That reference’s exact role snapshot equals the setup-catalog Vortox.
3. The constraint’s player equals the native Demon player.
4. The constraint’s seat equals the native Demon seat.
5. `evaluatedCharacterStateRevision` equals settlement revision.
6. Exactly one preserved tenure matches `vortoxRoleTenureId`.
7. The tenure player and seat equal both the constraint and native Demon.
8. The tenure role is `vortox`.
9. The tenure’s catalog role snapshot identity is the same exact Vortox role represented by the native Demon.
10. The tenure is active at settlement revision.
11. The tenure ID reproduces seat, role and acquisition revision.
12. No represented impairment disabled that tenure at or before settlement.

When false:

1. the stored native Demon role is not Vortox;
2. the constraint is exactly `{kind: "NONE"}`;
3. no preserved Vortox tenure is active at settlement revision;
4. no conflicting active Vortox tenure or malformed relevant impairment makes absence indeterminate.

The validator must reject:

- native Vortox plus missing tenure plus constraint downgraded to `NONE`;
- native Vortox plus constraint cross-linked to another player or seat;
- non-Vortox native Demon plus forged `VORTOX_FALSE_REQUIRED`;
- valid-looking Vortox tenure/constraint whose player, seat or role snapshot differs from the native Demon.

Stored historical validation uses only:

- the delivery’s immutable native Demon snapshot;
- setup catalog;
- preserved tenure history;
- preserved impairment history;
- settlement revision.

It must not consult later current character state to redetermine whether the historical Demon was Vortox.

A later post-settlement impairment does not invalidate an historically effective Vortox.

## simulationPolicy

```ts
const CLOCKMAKER_SIMULATION_POLICY_VERSION =
  "clockmaker-distance-selection-v1";
```

| Source | Vortox | Legal candidates | Selected |
|---|---|---|---|
| effective | none | `[truth]` | truth |
| drunk | none | `[0..6]`, including truth | smallest false |
| poisoned pure helper | none | `[0..6]`, including truth | smallest false |
| effective | active | `[0..6] - truth` | smallest false |
| drunk | active | `[0..6] - truth` | smallest false |
| poisoned pure helper | active | `[0..6] - truth` | smallest false |

Reasons:

- `RULE_CORRECT_REQUIRED`
- `DETERMINISTIC_SMALLEST_FALSE_HARMFUL_DEFAULT`
- `VORTOX_FALSE_REQUIRED_SMALLEST`

Reliability:

- `RULE_CORRECT_EFFECTIVE`
- `DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS`
- `VORTOX_CONSTRAINED_FALSE`

Truth, effectiveness, Vortox constraint, legality and policy remain separate.

## baseSourceContract

```ts
type BaseClockmakerSourceContract = {
  kind: "BASE_CLOCKMAKER";
  taskId: ScheduledTaskId;
  sourcePlayerId: PlayerId;
  sourceSeatNumber: SeatNumber;
  sourceRole: RoleSetupSnapshot;
  taskPlanVersion: string;
};
```

Require:

- exact next unsettled Clockmaker task;
- class `ROLE_INFORMATION`;
- source kind `ROLE`;
- canonical task ID and encoded seat;
- exact catalog Clockmaker/Townsfolk;
- one current matching source;
- current role still exact Clockmaker;
- current settlement revision.

This tuple is the bounded base source identity.

## philosopherGainedSourceContract

```ts
type PhilosopherGainedClockmakerSourceContract = {
  kind: "PHILOSOPHER_GAINED_CLOCKMAKER";
  taskId: ScheduledTaskId;
  sourcePlayerId: PlayerId;
  sourceSeatNumber: SeatNumber;
  sourceRole: RoleSetupSnapshot;
  gainedRole: RoleSetupSnapshot;
  grantId: GrantedAbilityId;
  grantedAtTaskId: ScheduledTaskId;
  grantedAtOpportunityId: ActionOpportunityId;
  insertionCharacterStateRevision: number;
};
```

Require exactly one matching:

- gained-ability task source;
- Philosopher grant;
- task insertion;
- source player/seat;
- Philosopher source role;
- Clockmaker gained role;
- grant ID;
- grant task/opportunity;
- inserted task ID;
- insertion revision;
- order `{100,1}`;
- current bounded Philosopher source.

The grant and task/source tuple is the gained source identity.

## commands

Add only:

```ts
type SettleClockmakerInformationCommandPayload = {
  commandType: "SettleClockmakerInformation";
  taskId: ScheduledTaskId;
};
```

No actor-supplied answer, source, identity, truth, candidates, impairment, Vortox, policy or revision.

Actors:

- System and Storyteller allowed;
- Human and AI rejected.

Exact keys:

```text
commandType
taskId
```

Precise new rejection codes where needed:

- `InvalidClockmakerInformationCommand`
- `UnsupportedClockmakerInformationTask`
- `InformationSourceNoLongerValid`

Existing prerequisite, task and version codes remain authoritative.

## events

Exactly two events:

1. `ClockmakerInformationDelivered`
2. `ScheduledTaskSettled`

Settlement outcome:

```ts
"CLOCKMAKER_INFORMATION_DELIVERED"
```

No additional event is introduced.

## eventOrder

Healthy batch:

```text
ClockmakerInformationDelivered
ScheduledTaskSettled
```

Envelopes share metadata and use consecutive sequences.

Full official order remains external evidence:

- commit: `3d6d930a9e600321f93b2567a2e88948a675bc1e`
- SHA-256: `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- Philosopher `14`
- Minion info `20`
- Demon info `24`
- Snake Charmer `37`
- Clockmaker `60`
- Dreamer `61`
- Seamstress `62`

Runtime subset:

```text
SNAKE_CHARMER_ACTION
<
CLOCKMAKER_INFORMATION
<
DREAMER_ACTION
```

Gained order:

```text
PHILOSOPHER_ACTION {100,0}
<
gained CLOCKMAKER_INFORMATION {100,1}
<
MINION_INFO {200,0}
```

No test-local literal may claim official-order proof.

## payloadShapes

`ClockmakerInformationDeliveredPayload` exact keys:

```ts
{
  rulesBaselineVersion;
  informationModelVersion: "clockmaker-information-v1";
  knowledgeStage: "CLOCKMAKER_INFORMATION";
  deliveryId;
  nightNumber: 1;
  taskId;
  taskType: "CLOCKMAKER_INFORMATION";
  sourceContract;
  settlementCharacterStateRevision;
  identityModel: "NATIVE_CHARACTER_TYPE_ONLY";
  ringSeatCount: 12;
  nativeDemonReferences;
  nativeMinionReferences;
  pairDistanceSnapshots;
  ruleCorrectDistance;
  sourceEffectiveness;
  vortoxConstraint;
  outputDomain;
  legalCandidateDistances;
  selectedDistance;
  simulationPolicyVersion;
  simulationReason;
  informationReliability;
}
```

Reference snapshot:

```ts
{
  playerId;
  seatNumber;
  role: RoleSetupSnapshot;
}
```

Pair snapshot:

```ts
{
  demonPlayerId;
  demonSeatNumber;
  minionPlayerId;
  minionSeatNumber;
  clockwiseDistance;
  counterClockwiseDistance;
  nearestDistance;
}
```

Invariants include:

- one native Demon;
- two sorted native Minions;
- two exact pair snapshots;
- reproducible geometry;
- truth equals minimum;
- exact domain/candidates/policy;
- exact catalog snapshots;
- exact nested keys;
- strict native-Demon/Vortox biconditional.

## stateChanges

Add:

```ts
clockmakerInformation?: {
  deliveries: readonly ClockmakerInformationDeliveredPayload[];
};
```

Delivery:

- validates against pre-event state;
- appends one historical delivery;
- rejects duplicate delivery/task;
- does not settle.

Settlement:

- requires one exact delivery;
- appends task settlement;
- changes no character, impairment, tenure, grant or setup state.

## historicalSnapshot

The delivery stores:

- exact source contract;
- settlement revision;
- native Demon and Minion snapshots;
- pair calculations;
- truth;
- source effectiveness;
- represented impairment ID;
- Vortox constraint and tenure ID;
- candidates;
- selected result;
- policy and reliability.

Replay reconstructs against pre-event state.

Stored validation uses the delivery snapshot and preserved histories to verify:

1. source/task/grant/insertion;
2. exact represented source impairment;
3. exact Demon/Minion geometry;
4. strict Vortox biconditional;
5. exact matching Vortox tenure when the native Demon is Vortox;
6. no active conflicting Vortox tenure when the native Demon is not Vortox;
7. settlement-time Vortox effectiveness;
8. candidates and policy.

It does not use later current state to reconstruct historical identity or answer.

## privateProjection

Expose only:

```ts
clockmakerInformation?: {
  distance: ClockmakerDistance;
};

clockmakerKnowledgeModelVersion?: "clockmaker-information-v1";
```

Stage:

```ts
"CLOCKMAKER_INFORMATION"
```

Only the source receives it. Player and AI views are identical.

Never expose identities, pairs, truth, candidates, impairment, Vortox, tenure, policy, assignment, task or canonical state.

## storedValidation

Before projection require:

- dense exact delivery collection;
- exact baseline/version/shape;
- unique delivery/task;
- one exact task;
- exact source contract;
- exact grant/insertion when gained;
- one exact settlement;
- revision equality;
- reproducible geometry/truth/candidates/policy;
- exact source viewer;
- no orphan facts.

For `KNOWN_DRUNK`, require the exact preserved impairment chain.

For Vortox, enforce the strict biconditional:

```text
constraint is VORTOX_FALSE_REQUIRED
iff
the single stored native Demon role snapshot is exact catalog Vortox
```

True branch requires:

- constraint player/seat equals native Demon;
- exact Vortox role equality;
- exactly one matching active/effective preserved tenure;
- no settlement-time disabling impairment.

False branch requires:

- native Demon is not Vortox;
- constraint is `NONE`;
- no active preserved Vortox tenure conflicts with that absence.

Stored validation explicitly rejects:

1. native Vortox + missing tenure + downgraded `NONE`;
2. native Vortox + constraint cross-linked to another player/seat;
3. non-Vortox native Demon + forged `VORTOX_FALSE_REQUIRED`;
4. valid-looking tenure/constraint whose player/seat/role differs from the stored native Demon.

Later role, alignment or impairment state is not used to recompute the result. A later unrelated or post-settlement impairment is ignored only after the required historical facts validate.

## replayValidation

Event application must:

1. require first-night canonical prerequisites;
2. resolve the exact next Clockmaker task;
3. validate source;
4. resolve native identity;
5. resolve exact source impairment;
6. resolve current Vortox and active tenure;
7. enforce at settlement that current native Demon is Vortox if and only if `VORTOX_FALSE_REQUIRED`;
8. require constraint, native Demon and tenure identity equality;
9. fail closed for indeterminate or impaired Vortox;
10. rebuild the complete delivery;
11. compare every field;
12. reject duplicate delivery;
13. append delivery;
14. accept only its exact settlement.

Replay rejects the same four Vortox/native-Demon identity corruptions required by stored validation, in addition to all previous naked, reordered, forged and mixed batches.

## batchSemantics

Require exactly:

```text
ClockmakerInformationDelivered
ScheduledTaskSettled
```

Validate shared metadata, consecutive sequence, exact payload, settlement linkage and no extra event. The batch remains atomic.

## prospectiveValidation

The prospective pipeline applies the complete batch before persistence.

Any source, impairment, native identity, Vortox biconditional, tenure, pair, truth, candidate, selection, revision or settlement corruption fails with:

- no append;
- no receipt;
- no version advancement;
- task pending;
- same command retryable.

No production fault injection is introduced.

## receiptSemantics

Accepted summary:

```ts
{
  resultSchemaVersion: "accepted-event-summary-v1";
  eventDisclosure: "EVENT_TYPES_ONLY";
  eventCount: 2;
  eventTypes: [
    "ClockmakerInformationDelivered",
    "ScheduledTaskSettled"
  ];
}
```

All seven supported histories require exact idempotent retry with zero append. Changed fingerprints conflict. Retryable failures write no receipt.

## failureBoundary

Add:

```ts
"first-night-role-information"
```

| Failure | Result |
|---|---|
| deterministic validation | stored rejection |
| unsupported poison/registration/count/life | `ApplicationNotConfigured` |
| missing/conflicting Vortox tenure | `ApplicationNotConfigured` |
| Vortox/native-Demon biconditional mismatch | `ApplicationNotConfigured` or prospective/replay rejection according to boundary |
| impaired/malformed Vortox | `ApplicationNotConfigured` |
| resolver/construction throw | `DependencyExecutionFailed` |
| metadata | `MetadataGenerationFailed` |
| prospective | `DependencyExecutionFailed` |
| commit | `EventStoreAppendFailed` |

Retryable failures preserve state and command availability.

## deterministicIds

Use:

```text
clockmaker-delivery-v1:<exact-task-id>:settlement-revision-<positive integer>
```

Require exact base/gained task grammar and byte-for-byte reproduction.

No random, clock-derived, UUID, locale or insertion-order-derived canonical identity.

## testPlan

The original 95 tests remain required and unweakened. Four independent direct stored-corruption tests are added, producing continuous rows `1..99`.

1. `clockmaker.test.ts` — `returns distance one for adjacent Demon and Minion seats`
2. `clockmaker.test.ts` — `keeps clockwise and counterclockwise wrap-around symmetric`
3. `clockmaker.test.ts` — `returns distance six for opposite seats`
4. `clockmaker.test.ts` — `rejects identical hostile and out-of-range seat values without throwing`
5. `clockmaker.test.ts` — `calculates both canonical Minion pairs and selects the nearest distance`
6. `clockmaker.test.ts` — `orders references and pair snapshots numerically independent of input order`
7. `clockmaker.test.ts` — `defines the exact dense Clockmaker domain zero through six`
8. `clockmaker.test.ts` — `rejects malformed sparse duplicate unordered and nonfinite candidate values`
9. `clockmaker.test.ts` — `fails closed when a required false candidate set is empty`
10. `clockmaker.test.ts` — `keeps truth effectiveness Vortox legality and simulation reason separate`
11. `clockmaker.test.ts` — `classifies a good Demon and excludes an evil Townsfolk by native character type`
12. `clockmaker.test.ts` — `requires exactly one native Demon`
13. `clockmaker.test.ts` — `requires exactly two native Minions`
14. `clockmaker.test.ts` — `rejects duplicate player or seat native references`
15. `clockmaker.test.ts` — `fails closed for a state requiring registration`
16. `clockmaker.test.ts` — `fails closed for no Demon or no Minion without fabricating a positive result`
17. `clockmaker.test.ts` — `fails closed for multiple Demons or a noncanonical Minion count`
18. `clockmaker.test.ts` — `effective source without Vortox permits and selects only truth`
19. `clockmaker.test.ts` — `drunk source without Vortox retains every domain value including truth`
20. `clockmaker.test.ts` — `drunk source selects the deterministic smallest false value`
21. `clockmaker.test.ts` — `pure poisoned helper retains truth and selects the smallest false value without Vortox`
22. `clockmaker.test.ts` — `effective Vortox excludes truth`
23. `clockmaker.test.ts` — `drunk plus Vortox excludes truth`
24. `clockmaker.test.ts` — `pure poisoned plus Vortox excludes truth`
25. `clockmaker.test.ts` — `fails closed when a current Vortox has no active tenure`
26. `clockmaker.test.ts` — `fails closed for multiple or conflicting active Vortox tenures`
27. `clockmaker.test.ts` — `fails closed for malformed Vortox impairment and represented impaired Vortox`
28. `clockmaker.test.ts` — `validates base source task role current source and encoded seat`
29. `clockmaker.test.ts` — `rejects a base source that no longer currently holds Clockmaker`
30. `clockmaker.test.ts` — `validates the exact Philosopher Clockmaker grant and insertion source`
31. `clockmaker.test.ts` — `rejects independently mismatched gained grant insertion opportunity player seat role and revision`
32. `philosopher-ability.test.ts` — `inserts gained Clockmaker after Philosopher and before Minion information`
33. `first-night-task-planner.test.ts` — `orders supported Snake Charmer before base Clockmaker before Dreamer`
34. `EXTERNAL_RULE_EVIDENCE` — `independent review verifies pinned nightsheet commit 3d6d930a9e600321f93b2567a2e88948a675bc1e and SHA-256 99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
35. `clockmaker.test.ts` — `reproduces canonical base gained and delivery identifiers`
36. `game-application-service.test.ts` — `allows System to settle the next base Clockmaker task`
37. `game-application-service.test.ts` — `allows Storyteller to settle the next Clockmaker task`
38. `game-application-service.test.ts` — `rejects Human and AI Clockmaker settlement actors without events`
39. `game-application-service.test.ts` — `rejects extra or hostile Clockmaker command fields with a stored receipt`
40. `game-application-service.test.ts` — `rejects missing unknown and non-Clockmaker tasks`
41. `game-application-service.test.ts` — `rejects Clockmaker settlement while another task is next`
42. `game-application-service.test.ts` — `rejects duplicate Clockmaker settlement`
43. `game-application-service.test.ts` — `rejects stale Clockmaker expected game version`
44. `game-application-service.test.ts` — `rejects Clockmaker settlement outside first night and before prerequisites`
45. `clockmaker.test.ts` — `creates the exact effective base delivery snapshot`
46. `clockmaker.test.ts` — `creates the exact Philosopher-gained delivery snapshot`
47. `clockmaker.test.ts` — `validates every exact top-level and nested Clockmaker payload key`
48. `clockmaker.test.ts` — `rejects hostile primitives sparse arrays and extra nested properties without throwing`
49. `clockmaker.test.ts` — `recomputes every reference pair truth candidate and selection from the payload`
50. `clockmaker.test.ts` — `creates and binds CLOCKMAKER_INFORMATION_DELIVERED settlement`
51. `clockmaker.test.ts` — `keeps poisoned Clockmaker outside canonical event creation`
52. `game-application-service.test.ts` — `returns only the exact two-event Clockmaker summary`
53. `game-application-service.test.ts` — `commits shared metadata and consecutive Clockmaker event sequences`
54. `clockmaker-replay.test.ts` — `replays the exact two-event Clockmaker batch`
55. `clockmaker-replay.test.ts` — `rejects each naked Clockmaker event`
56. `clockmaker-replay.test.ts` — `rejects reversed partial duplicate and extra Clockmaker batches`
57. `clockmaker-replay.test.ts` — `rejects mismatched batch command version baseline and sequence metadata`
58. `clockmaker-replay.test.ts` — `rejects PhaseTransitioned mixed into a Clockmaker batch`
59. `clockmaker-replay.test.ts` — `rejects independently forged source grant insertion impairment and revisions`
60. `clockmaker-replay.test.ts` — `rejects independently forged native references and pair snapshots`
61. `clockmaker-replay.test.ts` — `rejects independently forged truth effectiveness Vortox candidates and policy`
62. `clockmaker-replay.test.ts` — `rejects effective replay against canonical source drunkenness`
63. `clockmaker-replay.test.ts` — `rejects truth delivery under an exact active Vortox tenure`
64. `game-application-service.test.ts` — `keeps Clockmaker batch and event identifier failures retryable`
65. `game-application-service.test.ts` — `keeps each Clockmaker event clock failure retryable`
66. `game-application-service.test.ts` — `keeps Clockmaker construction failure retryable`
67. `game-application-service.test.ts` — `keeps corrupted Clockmaker prospective batch atomic and retryable`
68. `game-application-service.test.ts` — `keeps Clockmaker pre-commit and during-commit failures atomic and retryable`
69. `game-application-service.test.ts` — `keeps deterministic Clockmaker rejection receipts idempotent`
70. `game-application-service.test.ts` — `rejects changed Clockmaker fingerprints on the same command identifier`
71. `game-application-service.test.ts` — `fails unsupported Clockmaker histories without receipt event version or settlement`
72. `game-application-service.test.ts` — `uses exact Clockmaker failure codes stages and same-command retry boundaries`
73. `clockmaker-private-knowledge.test.ts` — `projects only distance model and stage to the base source`
74. `clockmaker-private-knowledge.test.ts` — `projects gained Clockmaker information only to the Philosopher source`
75. `clockmaker-private-knowledge.test.ts` — `keeps player and AI views identical and hides information from non-sources`
76. `clockmaker-private-knowledge.test.ts` — `hides identities pairs truth candidates impairment Vortox policy state assignment and task facts`
77. `clockmaker-private-knowledge.test.ts` — `rejects orphan Clockmaker delivery or settlement`
78. `clockmaker-private-knowledge.test.ts` — `rejects duplicate sparse hostile extra-key and unsupported-version stored facts`
79. `clockmaker-private-knowledge.test.ts` — `rejects independently cross-linked base source task and catalog facts`
80. `clockmaker-private-knowledge.test.ts` — `rejects independently cross-linked gained grant insertion and opportunity facts`
81. `clockmaker-private-knowledge.test.ts` — `rejects KNOWN_DRUNK stored delivery when its represented impairment is missing`
82. `clockmaker-private-knowledge.test.ts` — `rejects every forged represented impairment identity kind source affected role chosen role and revision field`
83. `clockmaker-private-knowledge.test.ts` — `rejects a represented impairment cross-linked from another Clockmaker source or delivery`
84. `clockmaker-private-knowledge.test.ts` — `rejects stored Vortox constraint with missing multiple conflicting or inactive tenure`
85. `clockmaker-private-knowledge.test.ts` — `rejects malformed or settlement-time impaired Vortox but ignores a later post-settlement impairment`
86. `clockmaker-private-knowledge.test.ts` — `rejects native Vortox with missing tenure when its constraint is downgraded to NONE`
87. `clockmaker-private-knowledge.test.ts` — `rejects native Vortox whose constraint is cross-linked to another player or seat`
88. `clockmaker-private-knowledge.test.ts` — `rejects forged VORTOX_FALSE_REQUIRED when the stored native Demon is not Vortox`
89. `clockmaker-private-knowledge.test.ts` — `rejects valid-looking Vortox tenure and constraint whose player seat or role differs from the stored native Demon`
90. `clockmaker-private-knowledge.test.ts` — `preserves historical distance after later role alignment and unrelated impairment changes`
91. `game-application-service.test.ts` — `settles canonical BASE_EFFECTIVE_NATIVE`
92. `game-application-service.test.ts` — `settles canonical BASE_EFFECTIVE_AFTER_SNAKE_CHARMER_SWAP using the new Demon seat`
93. `game-application-service.test.ts` — `settles canonical PHILOSOPHER_GAINED_EFFECTIVE_NATIVE before Minion information`
94. `game-application-service.test.ts` — `settles canonical ORIGINAL_BASE_DRUNK_AFTER_PHILOSOPHER_GAIN with the smallest false distance`
95. `game-application-service.test.ts` — `settles canonical BASE_EFFECTIVE_WITH_VORTOX with false-only information`
96. `game-application-service.test.ts` — `settles canonical ORIGINAL_BASE_DRUNK_WITH_VORTOX with truth excluded`
97. `game-application-service.test.ts` — `settles canonical PHILOSOPHER_GAINED_EFFECTIVE_WITH_VORTOX with truth excluded`
98. `game-application-service.test.ts` — `retries every one of the seven supported Clockmaker histories idempotently without append`
99. `private-knowledge-view.test.ts` — `preserves prior Dreamer Seamstress Cerenovus Evil Twin Witch and team projection contracts after Clockmaker`

Row 34 remains definitively `EXTERNAL_RULE_EVIDENCE`, not a catalog unit test.

Rows 86–89 are four independent direct assertions. They may not be combined into a generic named test without each corruption being separately constructed and asserted.

## explicitOutOfScope

Unchanged:

- registration;
- Spy/Recluse/Summoner execution;
- missing/multiple native type histories;
- Travellers;
- death/revival;
- canonical poisoned Clockmaker;
- canonical impaired Vortox;
- later-night acquisition;
- recurring Clockmaker;
- generic tenure/ability refactor;
- general character/alignment change;
- Storyteller UI;
- AI decisions;
- first-night completion;
- UI/Electron/SQLite;
- Slice 2B18.

## completionCriteria

1. Independent reviewer returns `RULE_DESIGN_PASS` for this exact user-authorized round-3 design.
2. Production changes remain within the previously reviewed bounded files.
3. The exact two-event contract remains unchanged.
4. Stored validation implements the strict native-Demon/Vortox-constraint biconditional.
5. The true branch binds native Demon, constraint and one active/effective tenure to the same player, seat and exact role.
6. The false branch requires a non-Vortox native Demon and no conflicting active Vortox tenure.
7. Rows 86–89 independently reject all four named stored corruptions.
8. All seven supported canonical histories have direct accepted event-history tests.
9. Row 98 retries all seven histories and verifies zero append.
10. `KNOWN_DRUNK` binds its exact preserved impairment.
11. Missing/multiple/conflicting Vortox tenure and impaired/malformed Vortox fail closed.
12. All 99 trace rows contain real assertions or row 34’s explicit external-evidence classification.
13. Poison, registration, death and unsupported counts receive no canonical support claim.
14. Targeted tests, typecheck, lint, full tests, coverage and `git diff --check` pass.
15. PR body is complete before freeze.
16. Exact frozen-head Ubuntu and Windows CI pass.
17. Complete final review returns both pass verdicts and no blockers.
18. Both verbatim audit comments are re-read and verified.
19. Coverage matrix remains `PARTIAL`, never `COMPLETE`.

Recommended production changes remain:

- new `packages/domain-core/src/clockmaker.ts`
- `packages/domain-core/src/index.ts`
- `packages/domain-core/src/command.ts`
- `packages/domain-core/src/events.ts`
- `packages/domain-core/src/errors.ts`
- `packages/domain-core/src/game-state.ts`
- `packages/domain-core/src/first-night-task-plan.ts`
- `packages/domain-core/src/event-applier.ts`
- `packages/domain-core/src/domain-batch-semantics.ts`
- `packages/domain-core/src/initial-private-knowledge.ts`
- `packages/application/src/command-result.ts`
- `packages/application/src/command-fingerprint.ts`
- `packages/application/src/game-application-service.ts`
- `packages/projections/src/index.ts`

Recommended test changes remain:

- new `packages/domain-core/src/clockmaker.test.ts`
- new `packages/domain-core/src/clockmaker-replay.test.ts`
- new `packages/projections/src/clockmaker-private-knowledge.test.ts`
- `packages/application/src/game-application-service.test.ts`
- `packages/domain-core/src/philosopher-ability.test.ts`
- `packages/task-engine/src/first-night-task-planner.test.ts`
- `packages/projections/src/private-knowledge-view.test.ts`

`packages/rules-snv/src/catalog.test.ts` is not modified for external full-order proof.

Documentation after implementation:

- `docs/implementation/phase-3-slice-2b17-status.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- controller state/log files
- complete PR traceability.

Forbidden production changes remain:

- setup generation or fixed role counts;
- task ordering values;
- Philosopher insertion behavior;
- Snake Charmer transition behavior;
- prior role semantics;
- generic registration, life, poison or character-change systems;
- Slice 2B18.

Required PR body headings remain exactly:

1. `Summary`
2. `Bounded Scope`
3. `Rule Evidence`
4. `Rule Claims Implemented`
5. `Rule Claims Not Implemented`
6. `Explicitly Unsupported Rules`
7. `Rule Source Revisions`
8. `Rule-to-Test Traceability`
9. `Source Identity And Settlement Timing`
10. `Candidate Legality And Simulation Policy`
11. `Vortox And Impairment Boundary`
12. `Event And State Contract`
13. `Projection And Information Safety`
14. `Replay Stored And Prospective Validation`
15. `Receipt Failure And Determinism`
16. `Local Validation And Exact-Head CI`
17. `Coverage Status And Next Gate`

## coverageStatus

`PARTIAL`

After acceptance, Clockmaker may become `PARTIAL` for:

- base first-night native information;
- Philosopher-gained first-night information;
- canonical Philosopher drunkenness;
- current effective Vortox with exact native-Demon/tenure provenance;
- Snake Charmer settlement-time interaction;
- historical source-only projection.

It remains incomplete for poison reachability, registration, death, Travellers, unsupported native counts, later-night acquisition, general character changes and full Storyteller discretion.

READY_FOR_RULE_DESIGN_REVIEW
