# Phase 3 Slice 2B19A3B — Canonical Drunk Base Dreamer under Effective Vortox Design

## Authority Metadata

- `sliceId`: `2B19A3B`
- `designRound`: `1 / 2`
- `authorization`: `USER_AUTHORIZED_BOTC_SIM_DREAMER_VORTOX_DRUNK_LEDGER_ATTRIBUTION_V1`
- `approvedOverride`: `BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1`
- `branch`: `phase-3/dreamer-vortox-canonical-drunk-precedence`
- `designBaseHead`: `7b12e707a3015b0c6434f7ff9b8e71458bc90838`
- `ruleEvidence`: `docs/rules/evidence/2B19A3B-resolved.md`
- `ruleEvidenceSha256`: `e2e9b86c93b93ec7778565778bab5fa959c5fefe70c2f5e1c63e4f96187a61b4`
- `ruleResearchVerdict`: `RULE_READY`
- `unresolvedConflicts`: `[]`
- `governancePrecheck`: `docs/architecture/2B19A3B-go-no-go-resolved-under-governance-v1.md`
- `governancePrecheckSha256`: `52b06f360bfe7abd122ddc662aaf4ba7d6f11c59bf80f27b8345220d81115d4c`
- `governanceConclusion`: `GO`
- `roleCoverageMatrix`: `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `roleCoverageMatrixSha256`: `a32d8e32c98eb65e2b5960b966aab1450f3fc84402e3a0d20c4563968aad7f64`
- `acceptedPredecessor`: `2B19A3A / PARTIAL / EFFECTIVE_SOURCE_VORTOX_FALSE_ONLY`
- `targetSliceCoverage`: `PARTIAL / CANONICAL_DRUNK_SOURCE_VORTOX_PRECEDENCE_ONLY`
- `DreamerRoleCoverageAfterAcceptance`: `PARTIAL`
- `PhilosopherRoleCoverageAfterAcceptance`: `PARTIAL`
- `MathematicianRoleCoverageAfterAcceptance`: `PARTIAL`
- `VortoxRoleCoverageAfterAcceptance`: `NOT_STARTED`
- `ruleSemanticsChanged`: `false`
- `implementationAuthorized`: `false`
- `maxDesignRounds`: `2`
- `maxRepairRounds`: `2`

This document is a complete standalone Design Round 1 specification. It does not incorporate the immutable conflict evidence by reference as missing design content, does not claim `RULE_DESIGN_PASS`, and does not authorize production or test edits before independent rule-design review.

## scope

Implement exactly one first-night accepted-stream interaction:

1. A real accepted Philosopher command chooses the already-in-play Dreamer.
2. The original base Dreamer receives exactly one canonical `AbilityImpairmentApplied` marker with `kind="DRUNK"` and `sourceKind="PHILOSOPHER_CHOSEN_DUPLICATE"`.
3. The base Dreamer task remains scheduled and its accepted V3 OPEN opportunity remains actionable.
4. Exactly one current, canonically effective Vortox is proven from the accepted prefix.
5. The base Dreamer selects another modeled player.
6. The delivered information is one native GOOD role plus one native EVIL role, both excluding the target’s settlement-time true role.
7. The command atomically appends `DreamerTargetChosen` V2, `DreamerInformationDelivered` V4, and `ScheduledTaskSettled`.
8. Replay derives exactly one Dreamer terminal outcome fact:
   - `outcomeStatus="ABNORMAL"`
   - `causeKind="VORTOX_FALSE_INFORMATION"`
   - `causedByAnotherCharacterAbility=true`
9. The fact retains exactly one positive existing `ABILITY_IMPAIRMENT` evidence entry for the Philosopher-produced DRUNK marker.
10. The existing Mathematician distinct-player consumer counts that Dreamer source exactly once.
11. Accepted-stream player and AI projection shows only the historical target and GOOD/EVIL pair to the Dreamer source.

No new event type, top-level `GameState` field, ledger evidence variant, Mathematician public contract, generic effect engine, or general multi-cause model is introduced.

## governanceClassification

### Reachability

| Class | Paths in this Slice |
|---|---|
| `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | Accepted Philosopher choice; canonical base-Dreamer DRUNK marker; surviving base Dreamer task and V3 OPEN opportunity; canonical DRUNK source plus effective Vortox V4 success; canonical DRUNK source without effective Vortox application rejection; retryable resolver/construction/prospective/metadata/commit failures; same-command recovery; later Mathematician and Seamstress command continuation; accepted-stream projection. |
| `R2 LEGACY_OR_IMPORTED_ACCEPTED_HISTORY` | Accepted Dreamer V1 history, normal V2 history, effective-source Vortox V3 history, their replay and historical projection meanings. |
| `R3 HOSTILE_OR_CORRUPTED_HISTORY` | Missing, extra, malformed, forged, mismatched, duplicated, stale, reordered, split-batch, cross-batch, wrong-impairment, conflicting-impairment, wrong-Vortox, hostile V4, hostile ledger, or manually mutated accepted-prefix clones. |
| `R4 FUTURE_HYPOTHETICAL_STATE` | Canonical base-Dreamer POISONED success, impaired Vortox success, No Dashii poisoning derivation, gained Dreamer, multiple Dreamers, general character/death lifecycle, other-night Dreamer, Travellers, and free Storyteller choice. |

A real formal command that rejects canonical DRUNK without effective Vortox is `R1 + APPLICATION_COMMAND_INTEGRATION`. The unsupported poisoned success behavior remains R4 even if a private pure resolver can classify a constructed poisoned marker.

### Trust

| Class | Entry points |
|---|---|
| `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `GameApplicationService.execute`, command envelopes, domain-event envelopes, persisted/imported streams, V4 payload shape validation, stored-delivery validation, replay/rebuild, projection viewer input, ledger persisted shape, and coverage-profile input. |
| `T2 CANONICAL_DERIVED_STATE` | Complete `GameState` rebuilt from accepted complete batches; current characters; task plan/progress; role tenures; impairment aggregate; target choice; pre-delivery state; derived ledger. |
| `T3 MODULE_PRIVATE_PURE_CORE` | Capability branch selection after canonical validation, exact impairment comparison, code-unit candidate ordering, payload construction, clone, and semantic equality. |

No callable T1 entry is downgraded because a private helper uses typed inputs. Shape validation does not prove accepted-history provenance.

### Primary-layer vocabulary

Only these Governance Traceability V1.1 values are valid:

```text
ACCEPTED_STREAM_INTEGRATION
APPLICATION_COMMAND_INTEGRATION
LEGACY_REPLAY_COMPATIBILITY
HOSTILE_REPLAY_REJECTION
STRUCTURAL_VALIDATION
PURE_POLICY_SEAM
PROJECTION
CROSS_PLATFORM_CI
```

## actualReachability

The new successful R1 chain is:

1. The formal Philosopher command accepts and persists its choice, grant, exact DRUNK impairment, insertion, receipt, and rebuilt state.
2. The V2 plan keeps the base Dreamer task at the official Dreamer position.
3. The formal opportunity-opening command persists one OPEN `DREAMER_FIRST_NIGHT_ACTION_V3` opportunity.
4. `SubmitDreamerAction` is captured and validated without hidden outcome fields.
5. The application rebuilds the complete accepted prefix.
6. The existing base-source contract, base ability-instance ID, active Dreamer tenure, exact source task, and OPEN opportunity cross-bind.
7. The complete impairment aggregate contains exactly one applicable source marker, and that marker is the exact accepted Philosopher-produced Dreamer DRUNK marker.
8. Current canonical state contains exactly one Demon and it is catalog-bound `vortox`.
9. Exactly one active continuous Vortox tenure is valid at evaluation, and no applicable Vortox impairment exists.
10. The target is another roster-bound current player.
11. Deterministic native GOOD and EVIL false candidates exist.
12. The application prepares the full V2/V4/settlement result before event creation.
13. Prospective complete-batch validation re-proves the same result from the accepted batch-start state.
14. Append and receipt commit atomically.
15. Replay re-proves V4 immediately before delivery from the accepted pre-delivery prefix.
16. Ledger, Mathematician, and accepted-stream projection consume the canonical result.

The successful path must not rely on a handwritten `GameState`, direct event-applier call, payload-carried effectiveness boolean, payload-carried impairment absence, or delivery self-attestation.

## overrideAuthority

The exact approved override is:

```text
BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1
```

It authorizes only this audit representation:

```text
terminalFactCount=1
outcomeStatus=ABNORMAL
causeKind=VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility=true
exactPhilosopherProducedDrunkEvidence=REQUIRED
secondCauseEntry=false
secondTerminalFact=false
```

It does not override external BOTC behavior, authorize poisoned-source success, authorize impaired-Vortox success, or establish a general causality model.

## ruleDelta

External behavior truth is unchanged:

- Philosopher choosing an in-play Dreamer makes the original Dreamer drunk.
- A drunk character has no ability but may receive apparent ability procedure.
- Effective Vortox requires Townsfolk information to be false even when the source is drunk or poisoned.
- Dreamer output remains one native GOOD role and one native EVIL role.
- For forced-false Dreamer information, both roles exclude target settlement-time truth.
- Mathematician counts qualifying players, not internal cause edges.

The implementation delta is only that the previously receipt-free canonical-DRUNK-plus-effective-Vortox branch becomes an accepted V4 delivery under the approved narrow audit-attribution policy.

## causeAttribution

The V4 delivery creates exactly one terminal fact and never creates a second `SOURCE_DRUNKENNESS` fact.

The single `causeKind` is the canonical primary simulator audit attribution, not a claim that real-world drunkenness is absent. Positive drunkenness provenance is retained in:

1. the accepted `AbilityImpairmentApplied` history;
2. the exact V4 `sourceImpairment`;
3. the terminal fact’s existing `ABILITY_IMPAIRMENT` evidence.

No cause array, `secondaryCause`, cause graph, duplicate terminal fact, or new evidence union member is permitted.

## deliveryVersioning

### Existing exact referenced types

`SeatNumber` is a safe integer in `1..12`.

`PlayerId`, `ScheduledTaskId`, `ActionOpportunityId`, `RoleTenureId`, `FirstNightAbilityInstanceId`, and `AbilityImpairmentId` are canonical non-empty strings and must satisfy their existing canonical grammar/parser where one exists.

`RoleSetupSnapshot` is exactly:

```ts
type RoleSetupSnapshot = {
  readonly roleId: RoleId;
  readonly characterType: "TOWNSFOLK" | "OUTSIDER" | "MINION" | "DEMON";
  readonly defaultAlignment: "GOOD" | "EVIL";
  readonly edition: "sects-and-violets";
  readonly setupModifier: {
    readonly outsiderDelta: number;
    readonly townsfolkDelta: number;
  };
};
```

Both `RoleSetupSnapshot` and `setupModifier` reject extra/missing keys, accessors, symbols, nonplain records, and unsupported primitives.

`BaseDreamerV2SourceContract` remains exactly:

```ts
type BaseDreamerV2SourceContract = {
  readonly sourceContractVersion: "dreamer-base-source-contract-v1";
  readonly kind: "BASE";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRoleId: "dreamer";
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceCharacterStateRevision: number;
  readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
};
```

Its ability instance is exactly the base task instance:

```text
first-night-ability-instance-v1:base-task:<taskId>
```

`DreamerVortoxConstraint` remains exactly:

```ts
type DreamerVortoxConstraint = {
  readonly constraintVersion: "dreamer-vortox-constraint-v1";
  readonly kind: "VORTOX_FORCED_FALSE_REQUIRED";
  readonly vortoxPlayerId: PlayerId;
  readonly vortoxSeatNumber: SeatNumber;
  readonly vortoxRoleId: "vortox";
  readonly vortoxRoleTenureId: RoleTenureId;
  readonly evaluatedCharacterStateRevision: number;
};
```

### V1, V2, and V3

V1 and V2 payload definitions, validation, replay, clone, equality, ledger meaning, and projection meaning remain unchanged.

Accepted V3 remains the same 20-key payload and must not be edited in place:

```ts
export const DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION =
  "dreamer-information-delivered-v3" as const;

export type DreamerInformationDeliveredPayloadV3 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion:
    typeof DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    "dreamer-first-night-action-opportunity-v3";
  readonly knowledgeModelVersion: "dreamer-information-model-v1";
  readonly knowledgeStage: "DREAMER_INFORMATION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: {
    readonly kind: "VORTOX_FORCED_FALSE";
  };
  readonly vortoxConstraint: DreamerVortoxConstraint;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: "dreamer-false-role-policy-v1";
};
```

V3 continues to require an effective source and exactly zero applicable source impairments. V3 replay and ledger continue to require zero `ABILITY_IMPAIRMENT` evidence.

### New exact source impairment carrier

```ts
export type DreamerCanonicalPhilosopherDrunkSourceImpairment = {
  readonly impairmentId: AbilityImpairmentId;
  readonly kind: "DRUNK";
  readonly sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE";
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRole: RoleSetupSnapshot;
  readonly chosenRoleId: "dreamer";
  readonly sourceCharacterStateRevision: number;
};
```

This is an exact clone of the canonical marker’s nine fields. It is not a new ledger evidence variant and contains no absence flag or redundant `sourceWasDrunk` boolean.

### New V4 exact contract

```ts
export const DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION =
  "dreamer-information-delivered-v4" as const;

export type DreamerCanonicalDrunkVortoxInformationReliability = {
  readonly kind:
    "VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK";
};

export type DreamerInformationDeliveredPayloadV4 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion:
    typeof DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion:
    "dreamer-first-night-action-opportunity-v3";
  readonly knowledgeModelVersion: "dreamer-information-model-v1";
  readonly knowledgeStage: "DREAMER_INFORMATION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability:
    DreamerCanonicalDrunkVortoxInformationReliability;
  readonly sourceImpairment:
    DreamerCanonicalPhilosopherDrunkSourceImpairment;
  readonly vortoxConstraint: DreamerVortoxConstraint;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: "dreamer-false-role-policy-v1";
};
```

V4 has exactly 22 enumerable own keys. Its nested key sets are exact:

- `informationReliability`: exactly `kind`;
- `sourceImpairment`: exactly the nine fields above;
- `vortoxConstraint`: exactly seven fields;
- `sourceContract`: exactly eleven fields;
- each role snapshot: exactly five fields;
- each setup modifier: exactly two fields.

V4 cross-validation requires:

- `sourcePlayerId`, `sourceSeatNumber`, `taskId`, opportunity, source contract, active Dreamer tenure, and base ability instance all cross-bind;
- `evaluatedCharacterStateRevision === sourceCharacterStateRevision`;
- `evaluatedCharacterStateRevision === vortoxConstraint.evaluatedCharacterStateRevision`;
- the evaluation revision equals the pre-delivery current-character revision;
- `sourceImpairment.affectedPlayerId === sourcePlayerId`;
- `sourceImpairment.affectedSeatNumber === sourceSeatNumber`;
- `sourceImpairment.affectedRole` exactly equals the current/catalog base Dreamer role;
- `sourceImpairment.chosenRoleId === "dreamer"`;
- `sourceImpairment.sourceCharacterStateRevision` lies inside the active Dreamer tenure and not after evaluation;
- `sourceImpairment` equals, field for field, the sole applicable canonical marker in rebuilt pre-event state;
- its impairment ID equals the accepted Philosopher marker identity and must not be caller-generated;
- the Vortox player, seat, role, tenure ID, and revision equal the proven current Vortox;
- `goodRole.characterType` is `TOWNSFOLK` or `OUTSIDER`;
- `evilRole.characterType` is `MINION` or `DEMON`;
- both role IDs differ from target settlement-time role ID;
- GOOD and EVIL role IDs are distinct and catalog-bound.

The payload union becomes V1 | V2 | V3 | V4. No existing discriminator meaning changes.

## canonicalDrunkProvenance

A V4 success requires all of the following:

1. The current application state was rebuilt from the complete accepted prefix.
2. That prefix contains the real accepted Philosopher choice/grant and canonical `AbilityImpairmentApplied`.
3. Replay of the impairment event already validated it against the Philosopher choice, the chosen role, and the unique current holder.
4. The complete current impairment aggregate passes exact runtime validation.
5. Exactly one marker applies to the source Dreamer tenure and evaluation window.
6. The marker has the exact nine-field Philosopher DRUNK shape.
7. `chosenRoleId` is exactly `dreamer`.
8. The affected player, seat, role snapshot, and revision cross-bind to the base Dreamer.
9. The marker is copied defensively into V4.
10. Replay reconstructs and compares the expected V4 from the pre-delivery state.

A delivery cannot prove its own drunkenness. Direct construction of an identically shaped marker is not accepted-stream provenance. Missing, stale, wrong, duplicated, or conflicting marker history fails closed.

## vortoxApplicability

After classifying source impairments, the same existing capability resolver proves Vortox applicability:

1. Exactly one current entry has native `characterType="DEMON"`.
2. That entry exactly matches one catalog role.
3. Its role ID is `vortox`.
4. Exactly one active role tenure exists for that player, seat, and role at evaluation.
5. The tenure ID parses as `vortox` at the same seat.
6. The tenure is continuous from acquisition through evaluation.
7. The complete impairment aggregate is exact and dense.
8. Zero applicable DRUNK or POISONED marker applies to the Vortox tenure.
9. The positive constraint revision equals current evaluation.
10. The fixed supported prefix contains no death transition; death remains out of scope.

Missing, duplicate, stale, ended, cross-linked, impaired, or otherwise unprovable Vortox authority returns an unresolved capability and never V4.

## capabilityPrecedence

`resolveBaseDreamerV2NormalCapability` remains the sole exported capability resolver. It gains one additive closed success member:

```ts
{
  readonly kind:
    "CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
  readonly evaluationModelVersion:
    "dreamer-base-source-effectiveness-v1";
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
  readonly sourceImpairment:
    DreamerCanonicalPhilosopherDrunkSourceImpairment;
  readonly vortoxConstraint: DreamerVortoxConstraint;
}
```

The complete precedence is frozen:

| Condition | Result |
|---|---|
| Zero applicable source impairment + effective non-Vortox Demon | existing `NORMAL_INFORMATION_SUPPORTED`, V2 |
| Zero applicable source impairment + effective Vortox | existing `VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED`, V3 |
| Exactly one canonical Philosopher-produced base-Dreamer DRUNK + effective Vortox | new canonical-drunk Vortox member, V4 |
| Exactly one canonical Philosopher-produced DRUNK + no effective Vortox | existing source-impaired unsupported classification; formal command fails receipt-free |
| One source POISONED marker | source-impaired unsupported; never V4 |
| One DRUNK marker not matching the approved Philosopher/Dreamer contract | source-impaired or unresolved; never V4 |
| Duplicate DRUNK | `SOURCE_IMPAIRMENT_CONFLICT` |
| DRUNK + POISONED | `SOURCE_IMPAIRMENT_CONFLICT` |
| No Dashii | existing `NO_DASHII_EFFECT_UNRESOLVED` |
| Vortox impaired, duplicate, stale, or unprovable | `VORTOX_EFFECTIVENESS_CONFLICT` or existing tenure unresolved reason |
| Invalid source provenance | `SOURCE_PROVENANCE_INVALID` |

No generic modifier-precedence API or public context is added.

## preEventReplayProof

### Command time

`GameApplicationService.execute` first loads the persisted stream and calls the existing canonical rebuild. Only that rebuilt state is supplied to the capability resolver.

The application prepares one immutable submission before event creation:

```ts
{
  readonly kind:
    "BASE_DREAMER_CANONICAL_DRUNK_VORTOX_FALSE_V4";
  readonly targetChoice: DreamerTargetChosenPayloadV2;
  readonly delivery: DreamerInformationDeliveredPayloadV4;
  readonly settlement: ScheduledTaskSettlement;
}
```

No later stage recomputes a different command result.

### Prospective complete-batch proof

`validateDomainBatchSemantics` validates the exact three-event proposal against the canonical batch-start state. It reruns the same capability resolver and deterministic V4 constructor. The proposed delivery must be semantically equal field by field to the expected V4.

### Replay proof

During replay:

1. Rebuild the maximal accepted complete-batch prefix.
2. Apply the validated V2 target choice.
3. Immediately before V4 delivery, use event-applier pre-event state.
4. Rerun the same source, impairment, Vortox, target, and candidate proof.
5. Reconstruct expected V4.
6. Compare every primitive, nested literal, role snapshot, ID, revision, and constraint field.
7. Apply delivery.
8. Apply settlement.
9. Derive the ledger fact from that same pre-delivery state.

The target-choice event changes no character, tenure, impairment, catalog, or Demon fact, so batch-start and pre-delivery capability inputs must be equal. A naked target-choice prefix is not accepted history.

Latest state must never reinterpret an older V4. Historical projection uses the persisted delivery after accepted replay authentication.

## candidatePolicy

V4 reuses the accepted V3 deterministic false-role policy:

- GOOD candidate set: catalog roles with native character type `TOWNSFOLK` or `OUTSIDER`, excluding target settlement-time role ID.
- EVIL candidate set: catalog roles with native character type `MINION` or `DEMON`, excluding target settlement-time role ID.
- Sort by stable UTF-16 code-unit order.
- Select the first candidate from each set.
- Candidate-set input order does not affect output.
- In-play status does not exclude a role.
- Empty GOOD or EVIL set throws `InvalidDreamerInformationDeliveredPayload`.
- No `localeCompare`, `Intl.Collator`, time, random UUID, `Date.now`, `Math.random`, or insertion-order dependence.

This is deterministic simulator policy, not free Storyteller-choice persistence.

## batch

The successful command appends exactly:

1. `DreamerTargetChosen` with accepted V2 target schema;
2. `DreamerInformationDelivered` with V4 payload;
3. `ScheduledTaskSettled` with:
   - `taskType="DREAMER_ACTION"`
   - `outcomeType="DREAMER_INFORMATION_DELIVERED"`
   - matching task ID and evaluation revision.

All three events must:

- share one batch ID;
- use contiguous event sequences;
- use one incremented game version;
- share canonical command/correlation metadata;
- commit with one command receipt;
- close the referenced opportunity only after the complete batch;
- fail atomically for naked, partial, reordered, duplicated, split, cross-batch, or mismatched metadata.

No event type or settlement type is added.

## ledger

`deriveFirstNightAbilityOutcomeFact` gains a V4 branch. It first revalidates the exact canonical V4 against pre-delivery state, then derives exactly one fact.

The fact is:

```text
abilityRoleId=dreamer
outcomeStatus=ABNORMAL
causeKind=VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility=true
sourceEventType=DreamerInformationDelivered
terminalFactCountForDelivery=1
```

Its evidence uses only existing variants:

- exactly one `SOURCE_EVENT`;
- exactly one `TASK`;
- exactly one `ACTION_OPPORTUNITY`;
- exactly one `CHARACTER_STATE`;
- exactly one active Dreamer `ROLE_TENURE`;
- exactly one active Vortox `ROLE_TENURE`;
- exactly one Philosopher-produced DRUNK `ABILITY_IMPAIRMENT`;
- one source `PLAYER_ROLE_AT_REVISION`;
- one target `PLAYER_ROLE_AT_REVISION`;
- one Vortox `PLAYER_ROLE_AT_REVISION`;
- exactly one `DREAMER_DELIVERY`.

Canonicalization coalesces identical player-role evidence. Therefore:

- target is Vortox: exactly 10 evidence entries;
- target is not Vortox: exactly 11 evidence entries.

The V4 impairment evidence must be:

```text
kind=ABILITY_IMPAIRMENT
impairmentId=<V4 sourceImpairment.impairmentId>
impairmentKind=DRUNK
affectedPlayerId=<Dreamer source>
affectedSeatNumber=<Dreamer source seat>
affectedRoleId=dreamer
sourceKind=PHILOSOPHER_CHOSEN_DUPLICATE
appliedCharacterStateRevision=<canonical marker revision>
```

No `AbilityOutcomeEvidenceReference` member is added.

The standalone fact-shape validator may accept either zero or one source impairment for a Dreamer `VORTOX_FALSE_INFORMATION` fact because V3 and V4 share the same fact schema. If one exists, it must be exactly one source-affecting Philosopher DRUNK entry. Event-version-specific authority remains closed by canonical source derivation:

- V3 canonical derivation requires zero impairment evidence;
- V4 canonical derivation requires exactly one;
- adding impairment to V3 or removing it from V4 fails canonical source equality;
- wrong, duplicate, reordered, or substituted evidence fails closed.

No second fact or `SOURCE_DRUNKENNESS` cause is generated.

## mathematician

No file under `packages/domain-core/src/mathematician*.ts` and no Mathematician command, event, payload, projection, temporal window, own-instance exclusion, number domain, or public resolver changes.

The accepted distinct-player algorithm continues to group qualifying abnormal facts by `sourcePlayerId`. The V4 Dreamer produces one qualifying fact, so:

```text
normal V2 Dreamer contribution = 0
effective-source Vortox V3 Dreamer contribution = 1
canonical-DRUNK-source effective-Vortox V4 contribution = 1
```

The presence of both Vortox tenure evidence and DRUNK impairment evidence does not increase the count. A direct later formal `SettleMathematicianInformation` command must demonstrate `trueCount=1` for a window containing only this qualifying V4 Dreamer source.

## projection

The accepted player-visible shape remains:

```ts
{
  dreamerInformation: {
    target: {
      playerId: PlayerId;
      seatNumber: SeatNumber;
    };
    goodRole: RoleSetupSnapshot;
    evilRole: RoleSetupSnapshot;
  };
  dreamerKnowledgeModelVersion: "dreamer-information-model-v1";
}
```

Projection requirements:

- only the Dreamer source receives the information;
- source AI view equals source player view;
- every non-source view omits it;
- no V4 view exposes `deliverySchemaVersion`, `informationReliability`, `sourceImpairment`, impairment ID, DRUNK, Philosopher identity, Vortox identity, Vortox tenure, cause, source contract, ability-instance ID, evaluated revision, or target truth;
- state-only private projection rejects V3 and V4 because state shape alone cannot authenticate their historical applicability;
- accepted-event-stream projection rebuilds and authenticates before projecting;
- later character or impairment state cannot rewrite stored historical target/roles;
- V1 and V2 state-only behavior remains unchanged.

## receipts

### Success

The first execution:

- returns `accepted`;
- contains exactly three events;
- increments game version once;
- stores one receipt;
- closes the V3 opportunity;
- rebuilds to the same V4 delivery and one ledger fact.

An identical command ID plus identical command returns the existing idempotent result and appends nothing.

### Unsupported canonical DRUNK without effective Vortox

The formal command returns:

```text
status=failed
code=ApplicationNotConfigured
failureStage=first-night-role-action
receipt=absent
newEvents=0
gameVersion=unchanged
opportunityStatus=OPEN
```

### Retryable dependency and construction failures

Unprovable capability or canonical result construction returns:

```text
status=failed
code=DependencyExecutionFailed
failureStage=first-night-role-action
receipt=absent
newEvents=0
gameVersion=unchanged
opportunityStatus=OPEN
```

Unexpected prospective-validation failure retains the accepted generic `prospective-validation` stage. Existing metadata and commit-store failure codes/stages remain unchanged.

A same-command retry after the injected dependency is repaired must succeed once and store one receipt.

No command input carries delivery, reliability, Vortox, impairment, candidate, ledger, or truth fields.

## failures

Fail closed for:

- missing or extra V4 fields;
- wrong schema/reliability/constraint/source literals;
- wrong primitive type or unsafe revision;
- noncanonical IDs;
- wrong or malformed source contract;
- wrong task/opportunity/source/target cross-link;
- wrong impairment ID;
- wrong affected player, seat, role, source, kind, chosen role, or revision;
- missing, duplicate, or conflicting source impairment;
- POISONED source;
- canonical DRUNK without effective Vortox;
- missing, duplicate, stale, ended, mismatched, or impaired Vortox;
- truth-containing forced-false pair;
- missing GOOD or EVIL candidate;
- naked/partial/reordered/split/cross-batch event chains;
- V3 with impairment evidence;
- V4 without its exact impairment evidence;
- duplicate terminal facts;
- unauthorized state-only V4 projection;
- throwing/revoked proxies, getters/accessors, symbols, cycles, sparse arrays, or nonplain records.

Getter invocation count must remain zero. Unexpected exceptions must not escape T1 application/persistence boundaries.

## testOwnership

All new application-service tests with a `2B19A3B` identity belong only to:

```text
application-service-dreamer-vortox
```

They must be registered inside the existing `dreamer-vortox` shard owner. No new `2B19A3B` application test may execute under the four legacy application-service projects.

The dynamic inventory must show:

- exactly one owner for each new application test;
- missing `0`;
- duplicate `0`;
- unexpected `0`;
- ambiguous `0`.

### Test-file allowlist

Only these test files may change:

1. `packages/domain-core/src/dreamer.test.ts`
2. `packages/domain-core/src/domain-batch-semantics.test.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
4. `packages/domain-core/src/rebuild.test.ts`
5. `packages/application/src/game-application-service.test.ts`
6. `packages/application/src/mathematician-information.test.ts`
7. `packages/projections/src/private-knowledge-view.test.ts`

No new public test-harness export or immutable accepted-history fixture is required. Existing V1/V2/V3 fixtures remain unchanged. If implementation cannot stay within this test allowlist, return for design correction or reslice.

### Planned supporting authorities

1. `PLANNED_SUPPORTING_AUTHORITY_CANONICAL_DRUNK_VORTOX_OPEN_PREFIX`
   - Producer: real formal commands through accepted Philosopher choice, exact canonical DRUNK state, scheduler advancement, and real V3 opportunity opening.
   - Expected status: `ACCEPTED`.
   - Mutation expectation: `NONE`.
   - Used by canonical success, unsupported-no-Vortox, failure, recovery, and provenance criteria.

2. `PLANNED_SUPPORTING_AUTHORITY_ACCEPTED_V4_STREAM`
   - Producer: the real successful V4 application chain.
   - Expected status: `ACCEPTED`.
   - Mutation expectation: `NONE` for accepted consumers; hostile tests use defensive clones with `CLONE_MUTATED`.
   - Used by replay, ledger, Mathematician, projection, and Seamstress criteria.

3. `PLANNED_SUPPORTING_AUTHORITY_LEGACY_DREAMER_STREAMS`
   - Producer: already accepted V1, V2, and V3 histories.
   - Expected status: `LEGACY` or `ACCEPTED` according to the existing fixture.
   - Mutation expectation: `NONE`.
   - Used by compatibility criteria.

Implementation traceability must assign each a unique `SUP-2B19A3B-NNN` identity resolving exactly once.

## T1 exact-shape and reliability matrix

At minimum, structural and hostile authority must cover:

| ID | Required assertion |
|---|---|
| `S01` | Deleting each required V4 top-level key rejects. |
| `S02` | Any extra top-level key rejects. |
| `S03` | Wrong V4 schema, opportunity, task, model, stage, policy, and night literals reject. |
| `S04` | Wrong primitive types, unsafe revisions/seats, empty or noncanonical IDs reject. |
| `S05` | Every missing/extra/wrong-type/wrong-literal source-contract field rejects. |
| `S06` | Reliability missing/extra/wrong literal/wrong type rejects. |
| `S07` | Source-impairment missing/extra/wrong literal/wrong type rejects. |
| `S08` | Vortox-constraint missing/extra/wrong literal/wrong type rejects. |
| `S09` | Top-level and nested getters reject with getter invocation count `0`. |
| `S10` | Throwing Proxy rejects without escaping. |
| `S11` | Revoked Proxy rejects without escaping. |
| `S12` | Enumerable symbol rejects. |
| `S13` | Cycle rejects. |
| `S14` | Nonplain record rejects. |
| `S15` | Sparse role-catalog or other array representation rejects. |
| `S16` | V1/V2/V3/V4 clones are reference-independent and pairwise cross-version equality is false. |
| `S17` | Semantic equality uses fieldwise comparison, not JSON serialization. |

Direct shape validation is `R3 + T1 + STRUCTURAL_VALIDATION`; it is never accepted-stream authority.

## coverageProfile

The accepted nine-process ordinary and coverage topology is immutable for this product Slice:

- nine ordinary groups plus official merge;
- nine coverage groups plus official blob merge;
- `application-service-dreamer-vortox` unique ownership;
- dynamic inventory;
- strict semantic ownership;
- exact uncovered-obligation gate;
- Windows deterministic job;
- `VITEST_MAX_FORKS=1`;
- no timeout increase;
- no `onTaskUpdate` workaround;
- no dependency, lockfile, threshold, Vitest workspace, or sharding-topology change.

### Product commit

The product implementation commit contains production code, tests, and product traceability only. It does not change the CI selector or approved coverage profiles.

After that exact product commit:

1. Run the complete nine-shard coverage pipeline three independent times.
2. Require all nine shards and official merge to succeed each time.
3. Require identical canonical count/SHA-256 pairs for:
   - source files;
   - zero-hit statements;
   - zero-hit functions;
   - zero-hit lines;
   - zero-hit branch arms.
4. Require identical inventory identity/hash, zero missing/duplicate/unexpected/ambiguous tests, and zero timeouts/worker RPC failures.
5. Raw V8 numeric IDs and raw JSON serialization hashes are diagnostic only.

### Independent profile commit

Only after three stable runs, create one exact profile whose deterministic ID is:

```text
phase-3-slice-2b19a3b-<first-7-hex-of-product-commit>-ownership-v2-1
```

The profile must record:

- the full product implementation commit as `sourceHead`;
- `sourceKind="PRODUCT_IMPLEMENTATION_STABLE_NINE_PROCESS_BASELINE"`;
- the five exact count/hash pairs observed identically three times;
- an audit record linking all three candidate runs.

The profile commit may modify only:

- `scripts/verify-coverage-obligations.mjs`;
- `.github/workflows/ci.yml` only to select the exact new profile;
- `docs/implementation/phase-3-slice-2b19a3b-coverage-profile.md`;
- implementation status/traceability and agent-control documentation.

It must not modify production code, test bodies, expectations, fixtures, Vitest topology, timeouts, dependencies, thresholds, or BOTC semantics.

Every old approved profile remains byte-for-byte present. The new profile uses exact equality, not subset or `<=`. CI cannot learn or infer the profile from its candidate. The profile refers to the product commit, not its own commit.

If three candidate obligation sets are not identical, if the candidate matches multiple profiles, or if a legitimate exact profile cannot be represented without weakening the verifier, classify it `CI_TEST_INFRASTRUCTURE_FAILURE` and stop this product PR pending a separate infrastructure task.

## productionAllowlistAndSize

### Production allowlist

Exactly these five production files may change:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

`event-applier.ts`, `rebuild.ts`, event type maps, `GameState`, first-night opportunity production, Philosopher production, Mathematician production, workflows, dependencies, and Vitest workspace are not product-change surfaces.

### Size

- expected changed production files: `5`;
- expected added production LOC: `650–950`;
- suggested ceiling: `6 files / 1000 added production LOC`;
- hard stop-loss: `8 files / 1500 added production LOC`.

Any unlisted production path requires independent design correction. Exceeding the hard limit requires `RESLICE_REQUIRED`.

## outOfScope

- POISONED Dreamer plus Vortox success.
- Drunk/poisoned/ineffective Vortox success.
- No Dashii poisoning derivation.
- Drunk Dreamer information without effective Vortox.
- Duplicate or conflicting impairment success.
- General multi-cause ledger, cause array, secondary cause, or cause graph.
- New ledger evidence variant.
- New event type or top-level state field.
- Generic impairment or effect-precedence engine.
- Philosopher-gained Dreamer execution.
- Multiple Dreamers or multiple Philosopher duplicate interactions.
- Storyteller free false-role choice persistence.
- Travellers.
- Death and life-state integration.
- General character-change or alignment-change producers.
- Other-night Dreamer.
- FIRST_NIGHT completion.
- DAY.
- Phase 2C.
- 2B19A3C, 2B19B, or any later Slice.
- Role coverage `COMPLETE`.

## completionCriteria

Each criterion below is frozen with the exact Governance Traceability V1.1 design-time fields. Final physical titles are implementation-time bindings and are not frozen here.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `C01` | Philosopher choosing an in-play Dreamer canonically drunks the original | Real full command chain begins with accepted Philosopher choice of Dreamer | Formal commands, accepted events, receipt, append, rebuild, then successful V4 continuation | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Accepted canonical Philosopher chain | CANONICAL_DRUNK_VORTOX_OPEN_PREFIX |
| `C02` | The impairment is positive canonical history | Exactly one nine-field Philosopher DRUNK marker exists and matches source Dreamer | Inspect rebuilt state and original accepted impairment event in the successful full chain | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | One exact marker; no duplicate | CANONICAL_DRUNK_VORTOX_OPEN_PREFIX |
| `C03` | Drunkenness does not remove the apparent base task | Base Dreamer task remains next/reachable and opens V3 opportunity | Real scheduler and opportunity-opening commands in successful chain | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Base task and OPEN V3 opportunity | CANONICAL_DRUNK_VORTOX_OPEN_PREFIX |
| `C04` | Effective Vortox forces the drunk Dreamer’s GOOD-target information false | GOOD target succeeds through formal command | Complete command/event/receipt/append/rebuild/projection chain | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Accepted V4, false pair | CANONICAL_DRUNK_VORTOX_OPEN_PREFIX |
| `C05` | Same rule applies for an EVIL target | EVIL target succeeds through formal command | Separate complete command/event/receipt/append/rebuild/projection chain | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Accepted V4, false pair | CANONICAL_DRUNK_VORTOX_OPEN_PREFIX |
| `C06` | Both roles must exclude target truth | GOOD and EVIL role IDs both differ from settlement-time target role | Deterministic candidate-policy authority over canonical target/catalog | R1 | T3 | PURE_POLICY_SEAM | One native GOOD, one native EVIL, neither true role | NONE |
| `C07` | V4 is closed and additive | Valid 22-key V4 and every nested exact shape validates | Direct exact-shape validator | R1 | T1 | STRUCTURAL_VALIDATION | Valid V4 accepted by shape validator | NONE |
| `C08` | Accepted V3 remains unchanged | Existing V3 bytes, replay, fact, and projection remain exact | Existing accepted V3 history replay | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | No V3 reinterpretation | LEGACY_DREAMER_STREAMS |
| `C09` | V4 is accepted history only with canonical proof | Complete V4 stream rebuilds exactly | Full accepted V4 stream replay/rebuild | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Exact rebuilt delivery/fact/state | ACCEPTED_V4_STREAM |
| `C10` | Delivery cannot self-prove impairment or Vortox | Batch-start and pre-delivery accepted-prefix proof reconstruct identical V4 | Prospective batch plus event-applier pre-event replay | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact expected V4 equality | ACCEPTED_V4_STREAM |
| `C11` | Impairment identity is authoritative | Wrong impairment ID rejects | Clone accepted stream, mutate V4/linked marker identity, replay | R3 | T1 | HOSTILE_REPLAY_REJECTION | DomainError; no accepted reinterpretation | ACCEPTED_V4_STREAM / CLONE_MUTATED |
| `C12` | Affected source facts must match | Wrong affected player, seat, or role rejects | Hostile replay mutation matrix | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | ACCEPTED_V4_STREAM / CLONE_MUTATED |
| `C13` | Approved path is Dreamer-specific | Wrong `chosenRoleId` or source kind rejects | Hostile replay mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | ACCEPTED_V4_STREAM / CLONE_MUTATED |
| `C14` | Historical revision must be exact and in tenure | Wrong, stale, future, or mismatched impairment/evaluation revision rejects | Hostile replay mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | ACCEPTED_V4_STREAM / CLONE_MUTATED |
| `C15` | Multiple source markers are unsupported | Duplicate DRUNK rejects | Accepted prefix clone with duplicate marker/history | R3 | T2 | HOSTILE_REPLAY_REJECTION | Source impairment conflict | ACCEPTED_V4_STREAM / CLONE_MUTATED |
| `C16` | Conflicting impairment success is unsupported | DRUNK plus POISONED rejects | Accepted prefix clone with conflicting marker | R3 | T2 | HOSTILE_REPLAY_REJECTION | Source impairment conflict | ACCEPTED_V4_STREAM / CLONE_MUTATED |
| `C17` | POISONED success is not implemented | A poisoned-source pure capability cannot return V4 | Closed private capability seam | R4 | T3 | PURE_POLICY_SEAM | Source-impaired/unresolved, never V4 | NONE |
| `C18` | Drunk information without effective Vortox remains unsupported | Real canonical Philosopher DRUNK chain without Vortox fails receipt-free | Formal `SubmitDreamerAction`, assert stores/state | R1 | T2 | APPLICATION_COMMAND_INTEGRATION | `ApplicationNotConfigured`; no receipt/events/version change; OPEN | CANONICAL_DRUNK_VORTOX_OPEN_PREFIX |
| `C19` | Settlement is atomic | Successful V4 is exactly V2 target + V4 delivery + settlement in one batch | Real accepted command result and persisted stream | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Three contiguous events, one version/receipt | ACCEPTED_V4_STREAM |
| `C20` | One ability resolution creates one fact | Exactly one terminal fact references V4 delivery | Derive/rebuild ledger from accepted V4 stream | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Fact count `1` | ACCEPTED_V4_STREAM |
| `C21` | Approved audit primary cause is Vortox | Fact is exact `ABNORMAL/VORTOX_FALSE_INFORMATION/true` | Canonical pre-event derivation | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact triple | ACCEPTED_V4_STREAM |
| `C22` | DRUNK remains positive evidence | Fact contains exactly one matching existing `ABILITY_IMPAIRMENT` entry | Canonical ledger derivation, including 10/11 cardinality | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact positive DRUNK evidence | ACCEPTED_V4_STREAM |
| `C23` | No multi-cause representation is authorized | No second fact, cause entry, array, or `SOURCE_DRUNKENNESS` fact exists | Inspect accepted ledger and event count | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | One fact only | ACCEPTED_V4_STREAM |
| `C24` | Mathematician counts players, not evidence edges | Later real Mathematician command counts V4 Dreamer exactly once | Full accepted V4 prefix plus formal Mathematician settlement | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | `trueCount=1`; one Dreamer player | ACCEPTED_V4_STREAM |
| `C25` | Only the source player receives Dreamer knowledge | Source player view shows only target/GOOD/EVIL | Accepted-event-stream player projection | R1 | T1 | PROJECTION | Exact public view; no hidden fields | ACCEPTED_V4_STREAM |
| `C26` | AI has the same authorized knowledge surface | Source AI view equals source player view and omits hidden metadata | Accepted-event-stream AI projection | R1 | T1 | PROJECTION | Exact equality, no leak | ACCEPTED_V4_STREAM |
| `C27` | Non-sources do not learn the pair | Every non-source view omits V4 knowledge | Accepted-event-stream projection | R1 | T1 | PROJECTION | Omitted | ACCEPTED_V4_STREAM |
| `C28` | Pre-commit failures are retryable | Resolver/construction/prospective/metadata/commit failures produce no receipt or mutation | Real formal command with existing bounded failure injection | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Exact code/stage; zero events; OPEN | CANONICAL_DRUNK_VORTOX_OPEN_PREFIX |
| `C29` | A failed command ID is recoverable | Same command succeeds after dependency repair | Formal failure then identical formal success | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | One accepted receipt/batch after repair | CANONICAL_DRUNK_VORTOX_OPEN_PREFIX |
| `C30` | V1/V2/V3 history meanings are immutable | V1, normal V2, and V3 rebuild/project exactly as accepted | Existing frozen streams and equality checks | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | No migration or mutation | LEGACY_DREAMER_STREAMS |
| `C31` | V4 does not prevent later terminal role action | Real accepted V4 Dreamer success continues through terminal Seamstress command | Full formal command chain | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Both terminal settlements accepted and replayable | ACCEPTED_V4_STREAM |
| `C32` | T1 data must fail closed | Complete S01–S17 matrix, getters invoked zero times | Direct validators and hostile replay where appropriate | R3 | T1 | STRUCTURAL_VALIDATION | All hostile inputs reject safely | NONE |
| `C33` | Canonical result is cross-platform deterministic | Exact final HEAD passes Ubuntu and Windows required jobs | Exact-head CI | R1 | T1 | CROSS_PLATFORM_CI | Required jobs SUCCESS | NONE |
| `C34` | Impaired/unproven Vortox is not a success path | Missing/duplicate/stale/impaired Vortox never produces V4 | Private capability seam plus hostile replay provenance mutations | R3 or R4 per case | T2/T3 | HOSTILE_REPLAY_REJECTION | Fail closed; no V4 | ACCEPTED_V4_STREAM when mutated |
| `C35` | Candidate order is deterministic | Catalog reversal yields identical pair; forbidden APIs absent | Pure policy and static deterministic scan | R1 | T3 | PURE_POLICY_SEAM | Same exact pair | NONE |
| `C36` | V3 and V4 ledger evidence cardinalities remain closed | V3 remains 9/10 with zero impairment; V4 is 10/11 with one impairment; removal/addition/duplicate/reorder rejects | Canonical derivation plus hostile ledger mutations | R3 | T1 | HOSTILE_REPLAY_REJECTION | Every noncanonical set rejects | LEGACY_DREAMER_STREAMS and ACCEPTED_V4_STREAM |
| `C37` | Coverage obligations are exact and stable | Three product-head nine-shard runs agree and final exact profile passes | Nine-process candidate runs plus final exact-head CI | R1 | T1 | CROSS_PLATFORM_CI | Three stable candidates and exact profile match | NONE |
| `C38` | State-only projection is not accepted provenance | State-only V4 player and AI projection rejects | Direct state-only projection boundary | R3 | T1 | PROJECTION | `PrivateKnowledgeUnavailable` | ACCEPTED_V4_STREAM state clone |
| `C39` | Historical knowledge is immutable | Later canonical-state change does not rewrite V4 bytes or projected pair | Accepted replay/projection with later-state supporting mutation | R2 | T2 | PROJECTION | Original historical pair unchanged | ACCEPTED_V4_STREAM |
| `C40` | Night ordering remains official | Philosopher precedes Dreamer; Dreamer remains 61/80; Vortox has no first-night task | Catalog/nightsheet mapping regression | R1 | T2 | STRUCTURAL_VALIDATION | Exact order retained | NONE |

Implementation-time traceability must add the Governance V1.1 actual fields, unique supporting IDs, actual entry/main assertion/fault mechanism, and `MechanismMatch`. One physical test identity has one primary layer; supporting reuse does not change its layer.

## documentation

Implementation may update only the following product/governance documents in addition to already materialized immutable evidence and this design:

- `docs/implementation/phase-3-slice-2b19a3b-test-traceability.md`
- `docs/implementation/phase-3-slice-2b19a3b-status.md`
- `docs/implementation/phase-3-slice-2b19a3b-coverage-profile.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`

The original conflict evidence and original NO-GO governance document remain immutable. The resolved evidence and resolved GO document also remain immutable after design review.

The PR body must contain the exact sections:

- `Rule Evidence`
- `Rule Claims Implemented`
- `Explicitly Unsupported Rules`
- `Rule Source Revisions`
- `Rule-to-Test Traceability`

## rollback

Before merge, rollback is branch/PR abandonment only; do not rewrite accepted main or existing V1/V2/V3 history.

After merge, any behavioral rollback must use a new forward commit that disables new V4 production while retaining V4 replay compatibility. Removing V4 from the accepted payload union or reinterpreting stored V4 history is forbidden.

The exact coverage profile may be superseded only by a separately reviewed explicit profile; it is never deleted or weakened.

## stopLoss

Return `RESLICE_REQUIRED` immediately if any of these is required:

- a new domain event type;
- a new top-level `GameState` field;
- a new ledger evidence variant;
- a cause array, secondary cause, or multi-cause graph;
- a generic impairment/effect lifecycle engine;
- a POISONED success path;
- an impaired-Vortox success path;
- a new Mathematician public or production contract;
- a new public trust boundary or application dependency port;
- a Vitest topology, dependency, timeout, or coverage-threshold change;
- modification of accepted V3 shape or meaning;
- more than eight production files;
- more than 1500 added production LOC;
- three or more independent subsystem risks;
- R4 behavior required as current acceptance authority;
- a substantive architecture blocker after Design Round 2.

Return `HUMAN_BLOCKED` for a new external-rule conflict, unavailable mandatory source without approved snapshot, unsafe history rewrite, or permissions failure.

If implementation needs only an expected/actual primary-layer correction with unchanged behavior and evidence mechanism, use the Governance V1.1 traceability-correction gate; do not silently redesign.

## completionAndReleaseConditions

Implementation may begin only after an independent reviewer returns `RULE_DESIGN_PASS` for this exact materialized design.

Release requires:

- all criteria and supporting matrices bound in implementation traceability;
- production/test/docs changes confined to the frozen allowlists;
- typecheck and lint pass;
- all nine ordinary shards and merge pass;
- three stable nine-shard coverage candidates at the product implementation commit;
- exact new profile committed separately without product/test semantic changes;
- all nine coverage shards and merge pass on final feature HEAD;
- Windows deterministic pass;
- no timeout or `onTaskUpdate` workaround;
- complete PR body frozen before review;
- exact final feature HEAD pushed and CI green;
- one complete independent final report on that exact HEAD;
- `CODE_REVIEW_PASS`;
- `RULE_REVIEW_PASS`;
- `remainingBlockers=[]`;
- both verbatim GitHub audit comments re-read and verified against current PR HEAD;
- no commit after passing review;
- clean worktree;
- Dreamer remains `PARTIAL`;
- no later Slice or Phase 2C begins.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_1
