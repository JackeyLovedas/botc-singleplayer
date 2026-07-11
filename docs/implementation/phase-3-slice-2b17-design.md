# Phase 3 Slice 2B17 Design: Clockmaker First-Night Information

Design round: `2 / 2`  
Status: implementation unauthorized pending independent `RULE_DESIGN_PASS`.

Evidence independently read and verified:

- `docs/rules/evidence/2B17.md`
- SHA-256: `db1fb83335e6a2083f85797b83516b8b646538ee3afcfd5ac92319147432d97e`
- terminal verdict: `RULE_READY`
- coverage: `PARTIAL`
- `docs/rules/USER_OVERRIDES.md`: no applicable override
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/agent-loop/REVIEW_PROTOCOL.md`
- CurrentCharacterState, task-plan, Philosopher grant/insertion/impairment, Snake Charmer transitions, Vortox tenure, replay, batch, stored projection, receipts and application code/tests.

Round-1 design:

- SHA-256: `c35e45b8f863167af6d18311a3072d7100d696d112377f361c1d36121ff0aa51`
- verdict: `RULE_DESIGN_FIX_REQUIRED`

Round 2 closes only:

1. exact historical impairment provenance;
2. exact historical Vortox tenure/effectiveness provenance;
3. supported-history and idempotency trace consistency;
4. explicit external-evidence classification for full nightsheet order.

No rule conclusion, event contract, production boundary or coverage claim is expanded.

## ruleClaims

1. Clockmaker learns the seated distance from the current Demon to the nearest current Minion.
2. Native identity is determined exclusively by settlement-time `CurrentCharacterState.role.characterType`, never alignment.
3. The supported 12-player setup has exactly one native Demon and two native Minions.
4. Both Demon–Minion pairs must be calculated; the minimum distance is the native truth.
5. Adjacent seats have distance `1`; opposite seats have distance `6`.
6. Canonical native truth is `1..6`.
7. The complete numeric information domain is `0..6`; `0` is sourced for no-Demon/no-Minion cases, which are not canonical in this slice.
8. Base Clockmaker resolves after Snake Charmer and sees a preceding canonical Demon-hit swap.
9. Philosopher-gained Clockmaker resolves after Philosopher and before Minion information.
10. A Philosopher choosing Clockmaker canonically makes the original Clockmaker drunk.
11. Drunk without Vortox retains all `0..6` as rule-legal information, including truth.
12. The deterministic single-player drunk policy selects the smallest false value while preserving truth in the recorded legal set.
13. Current effective Vortox permits only false values.
14. Vortox plus canonical Clockmaker drunkenness still excludes truth.
15. Poison uses the same pure candidate-legality rule as drunkenness, but a poisoned current Clockmaker is not canonically reachable.
16. A stored `KNOWN_DRUNK` delivery is valid only when its represented impairment ID binds to the exact preserved canonical impairment fact.
17. A stored `VORTOX_FALSE_REQUIRED` delivery is valid only when its constraint binds to the exact active Vortox tenure and no represented impairment disabled that tenure at settlement.
18. Delivered information is historical and is not recomputed from later state or later unrelated impairments.

## supportedCanonicalHistories

The exact supported canonical history set contains seven entries:

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

Meaning:

1. `BASE_EFFECTIVE_NATIVE`
   - one base Clockmaker;
   - one current native Demon;
   - two current native Minions;
   - no represented source impairment;
   - no active Vortox constraint.

2. `BASE_EFFECTIVE_AFTER_SNAKE_CHARMER_SWAP`
   - canonical Snake Charmer Demon-hit occurs before base Clockmaker;
   - Clockmaker uses the new current Demon seat.

3. `PHILOSOPHER_GAINED_EFFECTIVE_NATIVE`
   - exact grant and inserted task;
   - resolves after Philosopher and before `MINION_INFO`.

4. `ORIGINAL_BASE_DRUNK_AFTER_PHILOSOPHER_GAIN`
   - Philosopher gains Clockmaker;
   - exact preserved duplicate-role impairment makes the original Clockmaker drunk;
   - original base task later resolves using drunk candidate legality.

5. `BASE_EFFECTIVE_WITH_VORTOX`
   - base Clockmaker effective;
   - one exact effective Vortox tenure active at settlement;
   - false-only candidate set.

6. `ORIGINAL_BASE_DRUNK_WITH_VORTOX`
   - canonical original-Clockmaker drunkenness;
   - exact effective Vortox tenure active;
   - Vortox excludes truth.

7. `PHILOSOPHER_GAINED_EFFECTIVE_WITH_VORTOX`
   - exact Philosopher grant/insertion;
   - gained source effective;
   - exact effective Vortox tenure active;
   - false-only candidate set.

Every one of these seven histories must have:

- a direct accepted event-history integration test;
- a direct idempotent retry assertion using the identical command;
- zero events on retry;
- the same stored accepted summary.

Constructed `GameState` alone does not establish canonical reachability.

## unsupportedCanonicalHistories

These may be exercised only through pure helpers or fail-closed guards:

- poisoned player who remains Clockmaker;
- Spy, Recluse or Summoner registration;
- zero Demons;
- zero Minions;
- multiple Demons;
- Minion count other than exactly two;
- Travellers;
- life/death/revival;
- impaired current Vortox;
- multiple current Vortox entries;
- current Vortox without one exact active tenure;
- general Pit-Hag, Barber or other character change;
- general alignment-change machinery;
- later-night Philosopher acquisition;
- recurring other-night Clockmaker execution.

No successful canonical settlement event may be created for these histories.

## identityModel

Use:

```ts
type ClockmakerIdentityModel = "NATIVE_CHARACTER_TYPE_ONLY";
```

The Clockmaker-specific resolver validates the full 12-entry current state and selects only:

```ts
entry.role.characterType === "DEMON"
entry.role.characterType === "MINION"
```

It never uses `currentAlignment` for classification.

Canonical requirements:

- exactly one Demon reference;
- exactly two Minion references;
- distinct player and seat identity;
- exact setup-catalog role snapshots;
- exact roster player/seat identity;
- numeric seat ordering.

Clockmaker-specific resolution failures:

- `INVALID_CURRENT_CHARACTER_STATE`
- `INVALID_NATIVE_DEMON_COUNT`
- `INVALID_NATIVE_MINION_COUNT`
- `DUPLICATE_NATIVE_REFERENCE`
- `UNSUPPORTED_REGISTRATION_REQUIRED`

Do not reuse current-alignment or registration approximations. Do not extend the Seamstress tenure grammar to Clockmaker.

## distanceFormula

For distinct seats `d` and `m` in `1..12`:

```text
clockwise     = (m - d + 12) % 12
counter       = (d - m + 12) % 12
pairDistance  = min(clockwise, counter)
```

Directional values must be `1..11`; the nearest value must be `1..6`.

Canonical truth:

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

No locale-sensitive comparison is permitted.

## candidateDomain

```ts
type ClockmakerDistance = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const CLOCKMAKER_DISTANCE_DOMAIN =
  [0, 1, 2, 3, 4, 5, 6] as const;
```

Rules:

- canonical native truth is `1..6`;
- output domain is exactly dense ordered `0..6`;
- negative, `>6`, fractional, `NaN`, infinity, string, sparse, duplicate or unordered values are invalid;
- false candidates are domain values unequal to truth;
- an empty required false set fails closed;
- no-Demon/no-Minion does not create a canonical `0` delivery in this slice.

## sourceEffectiveness

Use:

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

Base source resolution:

- zero matching represented impairments: `EFFECTIVE`;
- exactly one valid canonical Philosopher duplicate impairment: `KNOWN_DRUNK`;
- more than one relevant impairment: fail closed;
- matching Snake Charmer poison: unsupported/fail closed;
- malformed or cross-linked impairment: fail closed.

Gained source resolution:

- exact supported gained source is effective;
- impairment of the original Clockmaker does not impair the Philosopher source;
- any impairment of the gained source is unsupported/fail closed.

Pure candidate helpers may accept `DRUNK` and `POISONED`; canonical events may contain only `EFFECTIVE` or `KNOWN_DRUNK`.

### Exact preserved impairment contract

For a `KNOWN_DRUNK` delivery, its single `representedImpairmentIds[0]` must bind to exactly one preserved `AbilityImpairmentApplied` fact in `state.abilityImpairments`.

The matching impairment must satisfy every field:

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

Additional binding:

- `affectedPlayerId` equals the base Clockmaker source;
- `affectedSeatNumber` equals the base source seat;
- `affectedRole` equals the exact stored/catalog Clockmaker source role;
- the impairment source player equals the exact Philosopher choice/grant source that chose Clockmaker;
- the impairment source seat encoded in the canonical impairment ID equals that Philosopher source seat;
- the affected seat encoded in the ID equals the base source seat;
- `sourceCharacterStateRevision` equals the matching Philosopher choice/grant revision;
- the revision is not after Clockmaker settlement;
- the canonical impairment ID is reproduced exactly;
- exactly one matching choice/grant/impairment chain exists.

Stored validation rejects:

- missing represented impairment;
- duplicate matching impairment;
- forged ID;
- wrong kind or source kind;
- wrong Philosopher source;
- wrong affected player, seat or role;
- wrong chosen role;
- wrong revision;
- an impairment cross-linked from another delivery/source.

Later unrelated impairments are ignored for historical recomputation, but do not replace the represented fact.

## vortoxConstraint

Use:

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

At settlement, `VORTOX_FALSE_REQUIRED` requires:

- exactly one current exact-catalog Vortox role;
- exactly one matching active Vortox tenure;
- tenure player and seat equal the current Vortox;
- tenure role is `vortox`;
- tenure acquisition revision is at or before settlement;
- tenure has no end revision at or before settlement;
- parsed tenure ID reproduces role, seat and acquisition revision;
- no canonical represented impairment disabled that tenure at settlement.

Zero current Vortox yields `NONE` only when:

- CurrentCharacterState is otherwise valid;
- no active Vortox tenure conflicts with the absence;
- no malformed Vortox-related tenure or impairment makes effectiveness indeterminate.

The following fail closed and must never degrade to `NONE`:

- current Vortox with no active tenure;
- multiple matching active tenures;
- a tenure ID cross-linked to another player/seat/revision;
- multiple current Vortox entries;
- malformed Vortox-related impairment;
- a represented impairment that disables the current Vortox at settlement;
- conflicting active Vortox tenure state.

Do not copy Seamstress behavior that maps missing tenure to `NONE`.

### Historical Vortox binding

Stored validation of `VORTOX_FALSE_REQUIRED` uses preserved tenure and impairment history at `settlementCharacterStateRevision`, not later current role state.

It requires:

1. exactly one role-tenure record with the stored `vortoxRoleTenureId`;
2. exact player/seat/role/acquisition identity;
3. activity at the stored settlement revision;
4. no matching impairment whose applicable revision is within that tenure and at or before settlement;
5. no malformed relevant impairment preventing a safe effectiveness decision.

For stored `NONE`, validation requires no active preserved Vortox tenure at settlement revision.

A later impairment with a revision after settlement does not rewrite or invalidate a historically effective Vortox constraint.

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

Simulation reasons:

- `RULE_CORRECT_REQUIRED`
- `DETERMINISTIC_SMALLEST_FALSE_HARMFUL_DEFAULT`
- `VORTOX_FALSE_REQUIRED_SMALLEST`

Reliability:

- `RULE_CORRECT_EFFECTIVE`
- `DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS`
- `VORTOX_CONSTRAINED_FALSE`

Truth, source effectiveness, Vortox constraint, legal candidates and policy remain distinct fields.

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

- exact next unsettled `CLOCKMAKER_INFORMATION`;
- class `ROLE_INFORMATION`;
- source kind `ROLE`;
- canonical task ID with encoded seat equal to source seat;
- exact catalog Clockmaker/Townsfolk role;
- one current matching source player/seat;
- current role still exact Clockmaker;
- settlement at current revision.

The tuple is the bounded base ability identity.

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

- `PHILOSOPHER_GAINED_ABILITY` task source;
- Philosopher grant;
- task insertion;
- source player/seat;
- exact Philosopher source role;
- exact Clockmaker gained role;
- grant ID;
- grant task/opportunity;
- inserted task ID;
- insertion revision;
- order key `{baseOrder: 100, insertionOrder: 1}`;
- current source still matching the bounded Philosopher source.

The grant ID plus exact task/source tuple is the gained ability identity.

## commands

Add only:

```ts
type SettleClockmakerInformationCommandPayload = {
  commandType: "SettleClockmakerInformation";
  taskId: ScheduledTaskId;
};
```

No actor-supplied distance, source, identity, truth, candidates, impairment, Vortox, policy or revision.

Actors:

- System: allowed;
- Storyteller: allowed;
- Human/AI: `ActorNotAllowed`.

Exact payload keys:

```text
commandType
taskId
```

Precise new rejection codes where required:

- `InvalidClockmakerInformationCommand`
- `UnsupportedClockmakerInformationTask`
- `InformationSourceNoLongerValid`

Existing prerequisite, stale-version, task-not-found, already-settled and task-not-next codes remain authoritative.

## events

Exactly two events:

1. `ClockmakerInformationDelivered`
2. `ScheduledTaskSettled`

Settlement outcome:

```ts
"CLOCKMAKER_INFORMATION_DELIVERED"
```

No choice, opportunity, impairment, registration, truth-only or Storyteller-selection event is added.

## eventOrder

Healthy batch:

```text
ClockmakerInformationDelivered
ScheduledTaskSettled
```

Envelopes share batch ID, command ID, committed version, baseline, timestamp, correlation and causation. Sequences are consecutive.

Full official order is external evidence:

- official nightsheet commit: `3d6d930a9e600321f93b2567a2e88948a675bc1e`
- pinned SHA-256: `99a2815bb31bcec3e107bf7f1c2fb305e301d317981d855704d3d954ec4c3f75`
- positions including dusk:
  - Philosopher `14`
  - Minion info `20`
  - Demon info `24`
  - Snake Charmer `37`
  - Clockmaker `60`
  - Dreamer `61`
  - Seamstress `62`

Runtime supported-subset test:

```text
SNAKE_CHARMER_ACTION
<
CLOCKMAKER_INFORMATION
<
DREAMER_ACTION
```

Gained runtime order:

```text
PHILOSOPHER_ACTION {100,0}
<
gained CLOCKMAKER_INFORMATION {100,1}
<
MINION_INFO {200,0}
```

No unit test may claim to prove the official order using a test-local literal.

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

Invariants:

- one Demon reference;
- two sorted Minion references;
- two sorted pair snapshots;
- exact reference links;
- reproducible pair distances;
- truth equals the pair minimum;
- output domain exact `0..6`;
- legal candidates reproduce effectiveness/Vortox rules;
- selected value is legal and reproduces policy;
- exact catalog role snapshots;
- exact keys and dense arrays.

## stateChanges

Add:

```ts
clockmakerInformation?: {
  deliveries: readonly ClockmakerInformationDeliveredPayload[];
};
```

Delivery application:

- validates against pre-event state;
- appends one immutable delivery;
- rejects duplicate delivery ID or task;
- does not settle the task.

Settlement application:

- requires one exact matching Clockmaker delivery;
- appends ordinary task settlement;
- does not modify character state, impairments, tenure, grants, insertion or setup.

## historicalSnapshot

The delivery stores:

- exact source contract;
- settlement revision;
- native Demon/Minion references;
- pair calculations;
- truth;
- source effectiveness;
- represented impairment ID when drunk;
- Vortox constraint and tenure ID;
- candidates;
- selected result;
- policy and reliability.

Replay recomputes against the pre-event state.

Stored validation later validates the preserved historical chains:

- exact represented impairment fact;
- exact Vortox tenure/effectiveness fact;
- exact source/task/grant/insertion;
- internal computation.

It does not recompute from later current role, alignment or unrelated impairment state.

## privateProjection

Extend the private view with:

```ts
clockmakerInformation?: {
  distance: ClockmakerDistance;
};

clockmakerKnowledgeModelVersion?: "clockmaker-information-v1";
```

Add stage:

```ts
"CLOCKMAKER_INFORMATION"
```

Only the exact source receives distance, model and stage. Player/AI views are identical.

Never expose identities, seats, pairs, truth, candidates, impairment, Vortox, source contract, grant, task, revision, policy, assignment or canonical state.

Place Clockmaker after own-character bootstrap and before team-information stages in the fixed private-view ordering. Runtime task order remains separately enforced.

## storedValidation

Before projection require:

- dense exact delivery collection;
- exact baseline/model/shape;
- unique delivery and task ID;
- one exact planned task;
- exact base or gained source contract;
- exact grant/insertion for gained source;
- one exact matching settlement;
- settlement revision equals delivery revision;
- internally reproducible identities, pairs, truth, candidates and policy;
- exact source viewer;
- no orphan delivery or settlement.

For `KNOWN_DRUNK`, additionally require the exact preserved impairment contract described under `sourceEffectiveness`.

For `VORTOX_FALSE_REQUIRED`, additionally require the exact preserved active tenure and no settlement-time disabling impairment described under `vortoxConstraint`.

For `NONE`, require no preserved active Vortox tenure at settlement.

Historical validation may ignore:

- current role/alignment after settlement;
- unrelated impairment facts;
- impairments whose applicable revision is strictly after settlement.

It may not ignore a missing or forged represented impairment or Vortox tenure.

## replayValidation

Event application must:

1. require first night/night 1/day 0;
2. require setup, roster, current state and task plan;
3. resolve exact next Clockmaker task;
4. validate source contract;
5. resolve current native identity;
6. resolve exact source impairment;
7. resolve exact current Vortox and active tenure;
8. fail closed for indeterminate or impaired Vortox;
9. rebuild the full delivery;
10. compare every field;
11. reject an existing task delivery;
12. append delivery;
13. accept settlement only after that delivery.

Reject naked, reversed, partial, duplicate, extra, metadata-mismatched, source-forged, grant-forged, impairment-forged, tenure-forged, revision-forged, identity-forged, candidate-forged and mixed-lifecycle batches.

## batchSemantics

Require exactly:

```text
ClockmakerInformationDelivered
ScheduledTaskSettled
```

Validate:

- shared metadata;
- consecutive sequence;
- exact delivery shape;
- settlement task/type/revision/outcome;
- one-to-one linkage;
- no unrelated event;
- no second delivery/settlement.

The batch is atomic.

## prospectiveValidation

The existing prospective pipeline applies the complete batch before persistence.

Corruption of source, grant, impairment, Vortox tenure, identity, pairs, truth, candidates, selection, policy, revision or settlement fails with:

- no append;
- no receipt;
- no version advancement;
- task still pending;
- same command ID retryable after fault removal.

No production fault-injection API is added.

## receiptSemantics

Accepted disclosure:

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

No canonical payload is returned.

For every one of the seven supported histories:

- identical retry returns the stored summary;
- `idempotent: true`;
- no append;
- unchanged game version.

Changed fingerprint with the same command ID returns `CommandIdempotencyConflict`.

Deterministic rejections persist receipts. Dependency, metadata, prospective and accepted-commit failures do not.

## failureBoundary

Add:

```ts
"first-night-role-information"
```

| Failure | Result |
|---|---|
| deterministic actor/phase/version/task/payload/source error | stored rejected receipt |
| unsupported poison/registration/count/life history | `ApplicationNotConfigured`, role-information stage, retryable |
| missing/multiple/conflicting Vortox tenure | `ApplicationNotConfigured`, role-information stage, retryable |
| malformed or impaired current Vortox | `ApplicationNotConfigured`, role-information stage, retryable |
| Clockmaker resolution/construction throw | `DependencyExecutionFailed`, role-information stage |
| metadata failure | `MetadataGenerationFailed`, event-metadata stage |
| prospective rejection | `DependencyExecutionFailed`, prospective-validation stage |
| commit failure | `EventStoreAppendFailed`, accepted-commit stage |

Retryable failures preserve events, version, settlement, receipt absence and command-ID availability.

## deterministicIds

Use:

```text
clockmaker-delivery-v1:<exact-task-id>:settlement-revision-<positive integer>
```

Parser requirements:

- string only;
- exact base or gained Clockmaker task grammar;
- task ID reproduced exactly;
- positive safe revision;
- full ID reproduced byte-for-byte.

No clock/random/UUID/locale/insertion-order-derived canonical identity. Pair/candidate order is numeric.

## testPlan

Every named test must contain the direct assertions described. Literal test-name presence is not traceability.

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
86. `clockmaker-private-knowledge.test.ts` — `preserves historical distance after later role alignment and unrelated impairment changes`
87. `game-application-service.test.ts` — `settles canonical BASE_EFFECTIVE_NATIVE`
88. `game-application-service.test.ts` — `settles canonical BASE_EFFECTIVE_AFTER_SNAKE_CHARMER_SWAP using the new Demon seat`
89. `game-application-service.test.ts` — `settles canonical PHILOSOPHER_GAINED_EFFECTIVE_NATIVE before Minion information`
90. `game-application-service.test.ts` — `settles canonical ORIGINAL_BASE_DRUNK_AFTER_PHILOSOPHER_GAIN with the smallest false distance`
91. `game-application-service.test.ts` — `settles canonical BASE_EFFECTIVE_WITH_VORTOX with false-only information`
92. `game-application-service.test.ts` — `settles canonical ORIGINAL_BASE_DRUNK_WITH_VORTOX with truth excluded`
93. `game-application-service.test.ts` — `settles canonical PHILOSOPHER_GAINED_EFFECTIVE_WITH_VORTOX with truth excluded`
94. `game-application-service.test.ts` — `retries every one of the seven supported Clockmaker histories idempotently without append`
95. `private-knowledge-view.test.ts` — `preserves prior Dreamer Seamstress Cerenovus Evil Twin Witch and team projection contracts after Clockmaker`

Row 34 is definitively `EXTERNAL_RULE_EVIDENCE`. It is not a `catalog.test.ts` test and may not be implemented as a test-local literal. The reviewer independently retrieves the pinned artifact and validates its hash and positions.

## explicitOutOfScope

- registration engine;
- Spy, Recluse and Summoner execution;
- zero-Demon/zero-Minion canonical delivery;
- multiple-Demon or non-two-Minion canonical history;
- Travellers;
- death/revival/life eligibility;
- canonical poisoned Clockmaker;
- canonical impaired Vortox;
- other-night Philosopher acquisition;
- recurring Clockmaker behavior;
- general tenure/ability-instance refactor;
- Pit-Hag/Barber/general character change;
- general alignment change;
- Storyteller free-choice UI;
- AI decisions;
- first-night completion;
- UI, Electron, SQLite;
- Slice 2B18.

## completionCriteria

1. Independent reviewer returns `RULE_DESIGN_PASS` for this exact round-2 design.
2. Production changes remain within the previously reviewed bounded files.
3. The exact two-event contract is unchanged.
4. All seven supported canonical histories have direct accepted event-history tests.
5. Row 94 directly retries all seven supported histories and verifies zero append.
6. `KNOWN_DRUNK` stored projection binds the exact preserved impairment fact.
7. Vortox stored projection binds the exact active settlement-time tenure and effectiveness.
8. Missing/multiple/conflicting Vortox tenure, malformed impairment and impaired Vortox fail closed.
9. All 95 trace rows contain real assertions or the explicit row-34 external-evidence classification.
10. Poison, registration and unsupported counts receive no canonical support claim.
11. Targeted tests, typecheck, lint, full tests, coverage and `git diff --check` pass.
12. PR body is complete before branch freeze.
13. Exact frozen-head Ubuntu and Windows CI pass.
14. One complete final report returns `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`, and empty blockers.
15. Both verbatim GitHub audit comments are re-read and verified.
16. Coverage matrix is updated to `PARTIAL`, never `COMPLETE`.

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

`packages/rules-snv/src/catalog.test.ts` is not modified for external full-order proof. Existing runtime subset tests may be extended only where they inspect real production catalog/task definitions.

Documentation after implementation:

- `docs/implementation/phase-3-slice-2b17-status.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- current controller state/log files
- complete PR traceability.

Forbidden production changes remain:

- setup generation or fixed role counts;
- task-planner ordering values;
- Philosopher insertion behavior;
- Snake Charmer transition behavior;
- Seamstress/Dreamer/Cerenovus semantics;
- generic registration, life, Traveller, poison or character-change frameworks;
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

After acceptance, Clockmaker may advance from `SKELETON` to `PARTIAL` for:

- base first-night native information;
- Philosopher-gained first-night information;
- exact canonical Philosopher drunkenness provenance;
- current effective Vortox false constraint with exact tenure provenance;
- Snake Charmer settlement-time interaction;
- validated historical private projection.

It remains incomplete for poison reachability, registration, death, Travellers, multiple/no-Demon histories, later-night acquisition, general character changes and full Storyteller discretion.

READY_FOR_RULE_DESIGN_REVIEW
