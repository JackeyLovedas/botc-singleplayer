# Phase 3 Slice 2B19A3B — Canonical Drunk Base Dreamer under Effective Vortox Design Round 2

## Metadata

- `sliceId`: `2B19A3B`
- `authorization`: `USER_AUTHORIZED_2B19A3B_DESIGN_ROUND_2_CLASSIFICATION_AND_TRACEABILITY_REPAIR`
- `designRound`: `2 / 2`
- `maxDesignRounds`: `2`
- `branch`: `phase-3/dreamer-vortox-canonical-drunk-precedence`
- `designBaseHead`: `9c6b2c8d86368b89a9be1e9e3c4b07bca4a63c71`
- `acceptedMain`: `868cf259c3400ab182c09eb4d9be95202fb22de1`
- `parentRound1Design`: `docs/implementation/phase-3-slice-2b19a3b-design.md`
- `parentRound1DesignSha256`: `4937f3dbc741c638d7715502e64a79d603c78b2500dec06ca928cb638c00ce4b`
- `parentRound1Review`: `docs/implementation/phase-3-slice-2b19a3b-design-review-round-1.md`
- `parentRound1ReviewSha256`: `6fc6b954f4f4e976ae672971efdd05beb5e5cfa04c4f5e66fbf5a58c15a676ba`
- `ruleEvidence`: `docs/rules/evidence/2B19A3B-resolved.md`
- `ruleEvidenceSha256`: `e2e9b86c93b93ec7778565778bab5fa959c5fefe70c2f5e1c63e4f96187a61b4`
- `ruleResearchVerdict`: `RULE_READY`
- `governancePrecheck`: `docs/architecture/2B19A3B-go-no-go-resolved-under-governance-v1.md`
- `governancePrecheckSha256`: `52b06f360bfe7abd122ddc662aaf4ba7d6f11c59bf80f27b8345220d81115d4c`
- `approvedOverride`: `BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1`
- `coverageStatus`: `PARTIAL / CANONICAL_DRUNK_SOURCE_VORTOX_PRECEDENCE_ONLY`
- `behaviorDesignChanged`: `false`
- `ruleSemanticsChanged`: `false`
- `overrideChanged`: `false`
- `eventTypeChanged`: `false`
- `gameStateChanged`: `false`
- `ledgerEvidenceUnionChanged`: `false`
- `ownershipInfrastructureChanged`: `false`
- `implementationAuthorized`: `false`

This is the complete standalone Round 2 implementation authority candidate. It retains the Round 1 behavior, rule, override, event, ledger, projection, receipt, allowlist and stop-loss contracts; it repairs only classification, traceability and authority definitions. It is not an erratum and does not require an implementer to read Round 1 for missing definitions.

## Pre-design classification audit and blocker disposition

The repository and canonical LF hashes match the authorization. The worktree is clean, no PR is open, all listed A3B history commits are ancestors of the current HEAD, and the accepted ownership-registry prerequisite is closed by PR #39. The active registry still contains only `2B19A3A`; no A3B contract is pre-registered.

The true blocker judgments are frozen as follows:

1. `C07`: its assertion is the canonical positive V4 exact-shape case, not malformed history. Therefore `R1 / T1 / STRUCTURAL_VALIDATION`. The direct validator is primary; the future accepted V4 producer is supporting authority only.
2. `C15`: it starts from accepted support, manually duplicates persisted DRUNK provenance, then invokes replay/rebuild rejection. Therefore `R3 / T1 / HOSTILE_REPLAY_REJECTION`.
3. `C16`: it starts from accepted support, manually introduces conflicting DRUNK-plus-POISONED provenance, then invokes replay/rebuild rejection. Therefore `R3 / T1 / HOSTILE_REPLAY_REJECTION`.
4. `C34`: the Round 1 compound criterion is atomized without changing behavior. Because the accepted registry schema permits only `^[A-Z][0-9]{2}$`, suffix IDs such as `C34A` are not used. `C34` owns the R4/T3 pure capability classification; new `C41` owns the R3/T1 hostile persisted-provenance rejection.
5. `C39`: no current accepted producer changes a role, impairment, or relevant current-character fact after Dreamer delivery. The executable authority is narrowed to real accepted later-event continuation: formal Seamstress opportunity opening and `SubmitSeamstressAction` append accepted events, rebuild, and projection without rewriting the stored V4 delivery. Evidence paths are `packages/application/src/game-application-service.ts` (`SubmitSeamstressAction` validation/event creation), `packages/application/src/game-application-service.test.ts` (accepted 2B19A3A C48 Dreamer→Seamstress chain), and `docs/implementation/phase-3-slice-2b19a3a-test-traceability.md` (accepted C48 binding). Thus C39 is `R1 / T1 / ACCEPTED_STREAM_INTEGRATION`. True later role/impairment mutation stability remains `R4 / FUTURE_HYPOTHETICAL_STATE`, `BACKLOG_NORMAL`, and out of this Slice.
6. `S01`–`S15` are direct hostile structural boundaries: `R3 / T1 / STRUCTURAL_VALIDATION`. `S16`, `S17`, and atomized `S18`–`S20` are pure clone/comparison contracts with one reachability each. No S row contains an implementation-time field.

A classification-only audit of every C/S row found no new behavior, schema, provenance, ledger, or public trust-boundary blocker. The only additional pure correction is C18 trust `T1`, because its primary entry is the formal application command rather than the already-derived capability state.

## Control state during Round 2

```text
status=RUNNING
taskType=PRODUCT_SLICE
currentSlice=2B19A3B
currentBranch=phase-3/dreamer-vortox-canonical-drunk-precedence
currentPR=null
implementationAuthorized=false
ruleReady=true
ruleDesignPass=false
designRound=2
maxDesignRounds=2
repairRound=0
maxRepairRounds=2
productRepairRoundConsumed=false
phase2CStarted=false
remainingBlockers=[PENDING_DESIGN_ROUND_2_REVIEW]
```

No Design Round 3 exists.

## Scope

Implement one first-night accepted-stream interaction:

1. A real accepted Philosopher command chooses the already-in-play Dreamer.
2. The original base Dreamer receives exactly one canonical `AbilityImpairmentApplied` with `kind="DRUNK"` and `sourceKind="PHILOSOPHER_CHOSEN_DUPLICATE"`.
3. The base Dreamer task remains scheduled and its accepted V3 OPEN opportunity remains actionable.
4. Exactly one current, canonically effective Vortox is proved from the complete accepted prefix.
5. The base Dreamer chooses another modeled player.
6. Delivery contains one native GOOD and one native EVIL role, both excluding the target’s settlement-time true role.
7. One atomic batch appends `DreamerTargetChosen` V2, `DreamerInformationDelivered` V4, and `ScheduledTaskSettled`.
8. Replay derives exactly one terminal Dreamer fact: `ABNORMAL / VORTOX_FALSE_INFORMATION / causedByAnotherCharacterAbility=true`.
9. The fact contains exactly one positive existing `ABILITY_IMPAIRMENT` evidence item for the Philosopher DRUNK marker and no second cause/fact.
10. Existing Mathematician distinct-player consumption counts this Dreamer source exactly once.
11. Accepted-stream source player/AI projection exposes only the historical target and GOOD/EVIL pair.

No new event type, top-level `GameState` field, evidence variant, Mathematician public contract, generic effect engine, or multi-cause model is introduced.

## Frozen override and rules

The sole new audit authority is:

```text
BOTC-SIM-DREAMER-VORTOX-DRUNK-LEDGER-ATTRIBUTION-V1
terminalFactCount=1
outcomeStatus=ABNORMAL
causeKind=VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility=true
exactPhilosopherProducedDrunkEvidence=REQUIRED
secondCauseEntry=false
secondTerminalFact=false
```

External behavior remains unchanged: Philosopher makes the original in-play Dreamer drunk; a drunk character has no ability but may receive apparent procedure; effective Vortox makes Townsfolk information false even if the source is drunk or poisoned; Dreamer output remains one native GOOD plus one native EVIL; forced-false output excludes target truth; Mathematician counts qualifying players, not evidence edges.

## Governance classification

Reachability is mutually exclusive per criterion:

- `R1 / CURRENTLY_REACHABLE_APPLICATION_PATH`: real Philosopher→DRUNK→Dreamer OPEN chain; V4 success; no-Vortox formal rejection; failure/retry boundaries; Mathematician and Seamstress continuation; accepted-stream projection; canonical positive direct shape.
- `R2 / LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`: accepted Dreamer V1, normal V2 and effective-source Vortox V3 replay/projection compatibility.
- `R3 / HOSTILE_OR_CORRUPTED_HISTORY`: malformed shapes, tampered streams/provenance/ledger/batches, duplicate/conflicting markers, and unauthorized state-only V4 projection.
- `R4 / FUTURE_HYPOTHETICAL_STATE`: POISONED success, impaired Vortox success, No Dashii derivation, gained Dreamer, later role/impairment mutation producer, death/lifecycle, other-night, Travellers, and free Storyteller choice.

Trust is independent:

- `T1 / EXTERNAL_OR_PERSISTED_BOUNDARY`: command/event/persisted-stream input, runtime V4 shape, replay/rebuild, state-only and accepted-stream projection boundary, persisted ledger, CI/ownership input.
- `T2 / CANONICAL_DERIVED_STATE`: complete rebuilt `GameState`, pre-event state, plan/progress, tenures, impairment aggregate, choice and derived ledger.
- `T3 / MODULE_PRIVATE_PURE_CORE`: closed capability selection, deterministic candidates, exact clone and fieldwise equality.

The only primary-layer values are `ACCEPTED_STREAM_INTEGRATION`, `APPLICATION_COMMAND_INTEGRATION`, `LEGACY_REPLAY_COMPATIBILITY`, `HOSTILE_REPLAY_REJECTION`, `STRUCTURAL_VALIDATION`, `PURE_POLICY_SEAM`, `PROJECTION`, and `CROSS_PLATFORM_CI`.

## Delivery versioning and exact contracts

V1 and V2 are unchanged. Accepted V3 remains the exact 20-key contract and retains zero applicable source impairment:

```ts
export const DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION =
  "dreamer-information-delivered-v3" as const;

export type DreamerInformationDeliveredPayloadV3 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion: typeof DREAMER_INFORMATION_DELIVERED_V3_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion: "dreamer-first-night-action-opportunity-v3";
  readonly knowledgeModelVersion: "dreamer-information-model-v1";
  readonly knowledgeStage: "DREAMER_INFORMATION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: { readonly kind: "VORTOX_FORCED_FALSE" };
  readonly vortoxConstraint: DreamerVortoxConstraint;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: "dreamer-false-role-policy-v1";
};
```

The existing source contract remains exactly:

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

Its ability instance is `first-night-ability-instance-v1:base-task:<taskId>`.

The existing Vortox constraint remains exactly:

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

The additive source impairment and V4 contracts are:

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

export const DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION =
  "dreamer-information-delivered-v4" as const;

export type DreamerCanonicalDrunkVortoxInformationReliability = {
  readonly kind: "VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK";
};

export type DreamerInformationDeliveredPayloadV4 = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion: typeof DREAMER_INFORMATION_DELIVERED_V4_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunitySchemaVersion: "dreamer-first-night-action-opportunity-v3";
  readonly knowledgeModelVersion: "dreamer-information-model-v1";
  readonly knowledgeStage: "DREAMER_INFORMATION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly informationReliability: DreamerCanonicalDrunkVortoxInformationReliability;
  readonly sourceImpairment: DreamerCanonicalPhilosopherDrunkSourceImpairment;
  readonly vortoxConstraint: DreamerVortoxConstraint;
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
  readonly falseRolePolicyVersion: "dreamer-false-role-policy-v1";
};
```

V4 has exactly 22 enumerable own keys. Nested key counts are exact: reliability 1, source impairment 9, Vortox constraint 7, source contract 11, role snapshot 5, setup modifier 2. Exact validators reject missing/extra keys, wrong literals/types, unsafe values, noncanonical IDs, accessors, symbols, proxies, cycles, sparse arrays, and nonplain records with getter count zero.

V4 cross-binds source/player/seat/task/opportunity/contract/tenure/base instance; all three evaluation revisions; source impairment affected identity, role, chosen role and tenure-bounded revision; the sole accepted impairment ID and all nine marker fields; proven Vortox player/seat/role/tenure/revision; native GOOD/EVIL categories; target-truth exclusion; distinct and catalog-bound role IDs. The union is V1 | V2 | V3 | V4; no discriminator is reinterpreted.

## Canonical DRUNK provenance and capability precedence

V4 requires a complete rebuilt accepted prefix containing the real Philosopher choice/grant and canonical impairment event. The aggregate is exact, has one applicable source marker, and that marker exactly matches the nine-field carrier, the base Dreamer identity and active tenure. The carrier is defensively cloned. Caller-created lookalikes do not establish provenance.

`resolveBaseDreamerV2NormalCapability` remains the sole exported resolver and adds only:

```ts
{
  readonly kind: "CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED";
  readonly evaluationModelVersion: "dreamer-base-source-effectiveness-v1";
  readonly evaluatedCharacterStateRevision: number;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceAbilityInstanceId: FirstNightAbilityInstanceId;
  readonly sourceImpairment: DreamerCanonicalPhilosopherDrunkSourceImpairment;
  readonly vortoxConstraint: DreamerVortoxConstraint;
}
```

Precedence is closed: zero source impairment + non-Vortox gives existing V2; zero impairment + effective Vortox gives existing V3; one exact canonical Philosopher DRUNK + effective Vortox gives V4; canonical DRUNK without effective Vortox remains unsupported; POISONED never gives V4; wrong/duplicate/conflicting impairment fails closed; No Dashii remains unresolved; impaired/duplicate/stale/unproven Vortox never gives V4; invalid source provenance remains unresolved. No generic precedence API is added.

## Vortox applicability, candidates and pre-event proof

Effective Vortox requires exactly one current catalog-bound Demon `vortox`, exactly one continuous active matching tenure, exact tenure ID parsing, complete dense impairment aggregate, zero applicable Vortox DRUNK/POISONED marker, and matching current evaluation revision. Missing, duplicate, stale, ended, cross-linked, impaired or unprovable authority fails closed.

V4 reuses V3 deterministic false-role policy: GOOD candidates are native Townsfolk/Outsider excluding target truth; EVIL candidates are native Minion/Demon excluding target truth; order is stable UTF-16 code-unit order; choose the first of each; input order and in-play status do not alter selection; empty category fails; locale/time/random APIs are forbidden.

At command time, rebuild the complete prefix, resolve once, and prepare one immutable target-V2/V4/settlement result before metadata. Prospective validation independently reruns the same proof from batch-start state and exact-compares V4 fieldwise. Replay applies target choice, uses immediate pre-delivery state, reruns source/impairment/Vortox/target/candidate proof, reconstructs and exact-compares V4, then applies delivery and settlement. Target choice changes no capability fact. Latest state never reinterprets older V4.

## Atomic batch, ledger and Mathematician

Success appends exactly target V2, delivery V4 and settlement in one batch, with one batch ID, contiguous sequences/indexes, one incremented game version, shared command/correlation metadata, one receipt, and opportunity close only after complete application. Naked, partial, reordered, duplicated, split, cross-batch or metadata-mismatched chains fail atomically.

V4 derives exactly one fact:

```text
abilityRoleId=dreamer
outcomeStatus=ABNORMAL
causeKind=VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility=true
sourceEventType=DreamerInformationDelivered
terminalFactCountForDelivery=1
```

Existing evidence only: one SOURCE_EVENT, TASK, ACTION_OPPORTUNITY, CHARACTER_STATE, active Dreamer ROLE_TENURE, active Vortox ROLE_TENURE, exact Philosopher DRUNK ABILITY_IMPAIRMENT, source PLAYER_ROLE_AT_REVISION, target PLAYER_ROLE_AT_REVISION, Vortox PLAYER_ROLE_AT_REVISION, and DREAMER_DELIVERY. Canonical coalescing yields 10 entries when target is Vortox and 11 otherwise. V3 stays 9/10 with zero impairment. V4 requires exactly one matching impairment; wrong/removal/addition/duplicate/reorder/substitution rejects. No new evidence member, second terminal fact, cause array, or SOURCE_DRUNKENNESS fact exists.

No Mathematician production contract changes. Existing distinct-player grouping yields normal V2 `0`, V3 `1`, V4 `1`. A later formal `SettleMathematicianInformation` command over a window containing only this V4 abnormality must produce `trueCount=1`; the Vortox and DRUNK evidence edges do not increase the count.

## Projection

The player-visible shape remains:

```ts
{
  dreamerInformation: {
    target: { playerId: PlayerId; seatNumber: SeatNumber };
    goodRole: RoleSetupSnapshot;
    evilRole: RoleSetupSnapshot;
  };
  dreamerKnowledgeModelVersion: "dreamer-information-model-v1";
}
```

Only the source player receives it; the source AI view is equal; non-sources omit it. No view exposes V4 version, reliability, impairment, DRUNK, Philosopher, Vortox, tenure, cause, source contract, ability instance, evaluation revision, candidates or target truth. State-only projection rejects V3/V4. Accepted-stream projection must replay/authenticate before output. A later accepted event may extend the stream, but projection uses the persisted historical delivery rather than recomputing it from latest state.

## Receipts and retry boundaries

Successful first execution is accepted, returns exactly three events, increments version once, stores one receipt, closes the V3 opportunity, and rebuilds to the same V4 and one ledger fact. Identical command ID plus identical command returns the idempotent result and appends nothing.

Canonical DRUNK without effective Vortox returns:

```text
status=failed
code=ApplicationNotConfigured
failureStage=first-night-role-action
receipt=absent
newEvents=0
gameVersion=unchanged
opportunityStatus=OPEN
```

Unprovable capability or canonical-result construction returns `DependencyExecutionFailed` at `first-night-role-action` with no receipt/event/version change and OPEN opportunity. Unexpected prospective failure retains `prospective-validation`. Existing metadata and commit-store codes/stages remain unchanged. After the injected dependency is repaired, identical command succeeds exactly once. No command carries delivery, reliability, Vortox, impairment, candidate, ledger or truth fields.

## Failure matrix

| Failure | Reachability / trust | Required result |
|---|---|---|
| malformed V4, missing/extra/wrong fields/literals/types/IDs; getters/proxies/symbol/cycle/nonplain/sparse input | R3 / T1 | direct exact validator rejects; no exception escape; getter count 0 |
| wrong source contract/task/opportunity/source/target cross-link | R3 / T1 | fail closed before accepted interpretation |
| wrong/missing/duplicate/conflicting/stale impairment | R3 / T1 persisted tamper, or R4/T3 pure unsupported state | hostile replay rejects, or pure capability never returns V4 |
| POISONED source | R4 / T3 | never V4; no success producer |
| canonical DRUNK without effective Vortox | R1 / T1 formal command | exact `ApplicationNotConfigured`; receipt-free; OPEN |
| missing/duplicate/stale/ended/mismatched/impaired Vortox | R3/T1 tamper or R4/T3 hypothetical | no V4; hostile replay/pure seam according to actual mechanism |
| truth-containing forced-false pair or empty candidate category | R3/T1 or R4/T3 according to entry | fail closed |
| naked/partial/reordered/split/cross-batch chain | R3 / T1 | hostile replay rejects atomically |
| V3 with impairment evidence or V4 without exact impairment | R3 / T1 | ledger/replay rejects |
| duplicate terminal fact | R3 / T1 | rebuild/ledger rejects |
| state-only V4 projection | R3 / T1 | `PrivateKnowledgeUnavailable`; no leak |
| resolver/construction/prospective/metadata/commit injected failure | R1 / T1 | exact stage/code; no receipt/events/version change; OPEN; retry succeeds after repair |

## Completion criteria

Every row has exactly one reachability, trust class, primary layer, expected result, evidence mechanism and supporting-authority requirement. `PLANNED_TEST_AUTHORITY` and `PLANNED_SUPPORTING_AUTHORITY` are design-time placeholders only; they are not physical titles, fixture IDs, SUP IDs, hashes or implementation claims.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C01 | Philosopher choosing in-play Dreamer canonically drunks the original | Real chain begins with accepted Philosopher choice | Formal commands→events→receipt→append→rebuild→V4 continuation | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Accepted canonical chain | PLANNED_SUPPORTING_AUTHORITY: canonical DRUNK/Vortox OPEN prefix |
| C02 | Impairment is positive canonical history | One exact nine-field marker matches the source | Inspect accepted impairment event and rebuilt state in successful chain | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exactly one matching marker | PLANNED_SUPPORTING_AUTHORITY: canonical prefix |
| C03 | Drunkenness does not remove apparent base task | Base task remains next and opens V3 opportunity | Real scheduler/open commands | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Base task and OPEN V3 | PLANNED_SUPPORTING_AUTHORITY: canonical prefix |
| C04 | Effective Vortox forces false GOOD-target output | GOOD target succeeds with both roles false | Complete command/event/receipt/append/rebuild/projection | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Accepted V4 false pair | PLANNED_SUPPORTING_AUTHORITY: canonical prefix |
| C05 | Same rule applies to EVIL target | EVIL target succeeds with both roles false | Separate complete accepted chain | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Accepted V4 false pair | PLANNED_SUPPORTING_AUTHORITY: canonical prefix |
| C06 | Both roles exclude target truth | GOOD and EVIL IDs differ from settlement truth | Deterministic pure candidate policy | R1 | T3 | PURE_POLICY_SEAM | Native GOOD/native EVIL, neither truth | NONE |
| C07 | V4 is closed and additive | Canonical 22-key V4 and exact nested shapes validate | Direct exact-shape validation; accepted producer is support only | R1 | T1 | STRUCTURAL_VALIDATION | Canonical positive V4 accepted | PLANNED_SUPPORTING_AUTHORITY: accepted V4 producer after implementation |
| C08 | Accepted V3 is unchanged | Existing V3 bytes/replay/fact/projection remain exact | Frozen accepted V3 replay | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | No reinterpretation | PLANNED_SUPPORTING_AUTHORITY: legacy Dreamer streams |
| C09 | V4 requires canonical proof | Complete accepted V4 stream rebuilds exactly | Full accepted V4 replay/rebuild | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Exact delivery/fact/state | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C10 | Delivery cannot self-prove capability | Batch-start and pre-delivery proof reconstruct identical V4 | Prospective full-batch proof plus pre-event replay | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Fieldwise expected V4 equality | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C11 | Impairment identity is authoritative | Wrong impairment identity rejects | Mutate defensive accepted-stream clone; replay | R3 | T1 | HOSTILE_REPLAY_REJECTION | DomainError; no reinterpretation | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream, clone mutated |
| C12 | Affected source facts must match | Wrong affected player/seat/role rejects | Hostile replay mutation matrix | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream, clone mutated |
| C13 | Approved path is Dreamer-specific | Wrong chosen role/source kind rejects | Hostile replay mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream, clone mutated |
| C14 | Historical revision must be exact | Wrong/stale/future/mismatched revisions reject | Hostile replay mutation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream, clone mutated |
| C15 | Multiple source markers are unsupported | Duplicate DRUNK in persisted history rejects | Accepted support→clone duplicate provenance→replay/rebuild | R3 | T1 | HOSTILE_REPLAY_REJECTION | Source impairment conflict; no output/receipt mutation | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream, clone mutated |
| C16 | Conflicting impairment success is unsupported | DRUNK plus POISONED in persisted history rejects | Accepted support→clone conflicting provenance→replay/rebuild | R3 | T1 | HOSTILE_REPLAY_REJECTION | Source impairment conflict; no output/receipt mutation | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream, clone mutated |
| C17 | POISONED success is unimplemented | Poisoned pure capability cannot return V4 | Closed private capability seam | R4 | T3 | PURE_POLICY_SEAM | Impaired/unresolved, never V4 | NONE |
| C18 | Drunk without effective Vortox remains unsupported | Real canonical chain fails receipt-free | Formal `SubmitDreamerAction`, stores/state asserted | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Exact failure; zero events; OPEN | PLANNED_SUPPORTING_AUTHORITY: canonical prefix |
| C19 | Settlement is atomic | Success is exactly target V2 + V4 + settlement | Real accepted command and persisted stream | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Three contiguous events; one version/receipt | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C20 | One resolution creates one fact | Exactly one terminal fact references V4 | Ledger derivation/rebuild from accepted V4 | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Fact count 1 | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C21 | Primary audit cause is Vortox | Fact has exact ABNORMAL/VORTOX/true triple | Canonical pre-event derivation | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact triple | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C22 | DRUNK remains positive evidence | One exact ABILITY_IMPAIRMENT and 10/11 total evidence | Canonical ledger derivation | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact positive DRUNK evidence | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C23 | Multi-cause representation is unauthorized | No second fact/cause/array/SOURCE_DRUNKENNESS fact | Inspect accepted ledger and event count | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | One fact only | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C24 | Mathematician counts players, not edges | Later formal Mathematician command counts once | Accepted V4 prefix→formal Mathematician settlement | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | trueCount=1 | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C25 | Only source player receives knowledge | Source view is target/GOOD/EVIL only | Accepted-stream player projection | R1 | T1 | PROJECTION | Exact view, no hidden fields | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C26 | AI surface equals player surface | Source AI equals source player, no hidden metadata | Accepted-stream AI projection | R1 | T1 | PROJECTION | Exact equality/no leak | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C27 | Non-sources learn nothing | Every non-source omits V4 knowledge | Accepted-stream projection | R1 | T1 | PROJECTION | Omitted | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C28 | Pre-commit failures are retryable | All bounded failures make no receipt/mutation | Formal command with real bounded failure injection | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Exact code/stage; zero events; OPEN | PLANNED_SUPPORTING_AUTHORITY: canonical prefix |
| C29 | Failed command ID is recoverable | Identical command succeeds after repair | Formal failure then identical formal success | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | One accepted receipt/batch after repair | PLANNED_SUPPORTING_AUTHORITY: canonical prefix |
| C30 | V1/V2/V3 meanings are immutable | Frozen streams rebuild/project exactly | Existing streams and fieldwise equality | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | No migration/mutation | PLANNED_SUPPORTING_AUTHORITY: legacy Dreamer streams |
| C31 | V4 permits later terminal action | Real V4 success continues through Seamstress | Full formal command chain | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Both terminal settlements accepted/replayable | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C32 | T1 V4 structures fail closed | S01–S15 direct hostile structural matrix rejects safely | Direct exact validators; replay support is non-primary | R3 | T1 | STRUCTURAL_VALIDATION | All malformed structures reject; getters 0 | NONE |
| C33 | Result is cross-platform deterministic | Exact final HEAD passes required Ubuntu/Windows jobs | Exact-head CI | R1 | T1 | CROSS_PLATFORM_CI | Required jobs SUCCESS | NONE |
| C34 | Hypothetical impaired/unproven Vortox is not success | Pure capability state never returns V4 | Closed private capability seam | R4 | T3 | PURE_POLICY_SEAM | Unsupported/unresolved, never V4 | NONE |
| C35 | Candidate order is deterministic | Catalog reversal yields identical pair; forbidden APIs absent | Pure policy plus static deterministic scan | R1 | T3 | PURE_POLICY_SEAM | Same exact pair | NONE |
| C36 | V3/V4 evidence cardinalities remain closed | V3 9/10 zero impairment; V4 10/11 one; mutations reject | Canonical support plus hostile ledger mutation as primary | R3 | T1 | HOSTILE_REPLAY_REJECTION | Every noncanonical set rejects | PLANNED_SUPPORTING_AUTHORITY: legacy and accepted V4 streams, clone mutated |
| C37 | Coverage obligations are exact/stable | Three product-head nine-shard candidates agree and exact profile passes | Candidate runs and exact-head CI | R1 | T1 | CROSS_PLATFORM_CI | Three identical candidates; exact profile match | NONE |
| C38 | State-only projection is not provenance | State-only V4 player/AI projection rejects | Direct state-only projection boundary | R3 | T1 | PROJECTION | PrivateKnowledgeUnavailable | PLANNED_SUPPORTING_AUTHORITY: accepted V4 state clone |
| C39 | Accepted continuation cannot rewrite historical delivery | Real Seamstress continuation leaves V4 bytes and projected pair unchanged | Open/submit Seamstress formal commands→accepted events→append→rebuild→projection | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Original persisted V4 and source view unchanged | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream |
| C40 | Night order remains official | Philosopher precedes Dreamer; Dreamer 61/80; Vortox no first-night task | Catalog/nightsheet mapping regression | R1 | T2 | STRUCTURAL_VALIDATION | Exact order retained | NONE |
| C41 | Hostile Vortox provenance cannot authorize V4 | Missing/duplicate/stale/impaired persisted Vortox proof rejects | Accepted support→mutated provenance→replay/rebuild | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed; no V4 | PLANNED_SUPPORTING_AUTHORITY: accepted V4 stream, clone mutated |

## Structural criteria S01–S20

These are design-time criteria only. No `ActualTestFile`, `ActualTestTitle`, actual layer/reachability/trust, supporting ID, physical line, fixture ID, coverage hash, or implementation result is claimed.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| S01 | V4 top-level keys are closed | Delete each required key | Direct missing-key matrix | R3 | T1 | STRUCTURAL_VALIDATION | Every deletion rejects | PLANNED_TEST_AUTHORITY |
| S02 | V4 rejects extensions | Add any extra top-level key | Direct exact-key validator | R3 | T1 | STRUCTURAL_VALIDATION | Reject | PLANNED_TEST_AUTHORITY |
| S03 | V4 literals are exact | Wrong schema/opportunity/task/model/stage/policy/night literal | Direct wrong-literal matrix | R3 | T1 | STRUCTURAL_VALIDATION | Every wrong literal rejects | PLANNED_TEST_AUTHORITY |
| S04 | V4 primitive and canonical domains are exact | Wrong types, unsafe revisions/seats, empty/noncanonical IDs | Direct primitive/domain matrix | R3 | T1 | STRUCTURAL_VALIDATION | Reject safely | PLANNED_TEST_AUTHORITY |
| S05 | Source contract is exact | Each missing/extra/wrong-type/wrong-literal field | Direct nested exact-shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Reject | PLANNED_TEST_AUTHORITY |
| S06 | Reliability is exact | Missing/extra/wrong literal/type | Direct nested exact-shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Reject | PLANNED_TEST_AUTHORITY |
| S07 | Source impairment is exact | Missing/extra/wrong literal/type | Direct nested exact-shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Reject | PLANNED_TEST_AUTHORITY |
| S08 | Vortox constraint is exact | Missing/extra/wrong literal/type | Direct nested exact-shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Reject | PLANNED_TEST_AUTHORITY |
| S09 | Accessors are forbidden | Top-level/nested accessor input | Descriptor-first validator; count calls | R3 | T1 | STRUCTURAL_VALIDATION | Reject; getter count 0 | PLANNED_TEST_AUTHORITY |
| S10 | Throwing proxies fail closed | Throwing Proxy input | Exception-safe direct boundary | R3 | T1 | STRUCTURAL_VALIDATION | Reject; no escape | PLANNED_TEST_AUTHORITY |
| S11 | Revoked proxies fail closed | Revoked Proxy input | Exception-safe direct boundary | R3 | T1 | STRUCTURAL_VALIDATION | Reject; no escape | PLANNED_TEST_AUTHORITY |
| S12 | Symbols are forbidden | Enumerable symbol-bearing input | Direct key validation | R3 | T1 | STRUCTURAL_VALIDATION | Reject | PLANNED_TEST_AUTHORITY |
| S13 | Cycles are forbidden | Cyclic input | Canonical-data/shape boundary | R3 | T1 | STRUCTURAL_VALIDATION | Reject; no escape | PLANNED_TEST_AUTHORITY |
| S14 | Records must be plain | Nonplain prototype input | Direct plain-record boundary | R3 | T1 | STRUCTURAL_VALIDATION | Reject | PLANNED_TEST_AUTHORITY |
| S15 | Arrays must be dense/canonical | Sparse catalog or other represented array | Direct dense-array boundary | R3 | T1 | STRUCTURAL_VALIDATION | Reject | PLANNED_TEST_AUTHORITY |
| S16 | Current V4 cloning is isolated | Clone V4 and mutate nested clone | Private clone seam | R1 | T3 | PURE_POLICY_SEAM | Original unchanged; references distinct | PLANNED_TEST_AUTHORITY |
| S17 | V4 semantic equality is fieldwise | Equal and one-field-different V4 comparisons | Private comparator plus static no-serialization scan | R1 | T3 | PURE_POLICY_SEAM | Exact fieldwise true/false; no JSON equality | PLANNED_TEST_AUTHORITY |
| S18 | Legacy clone behavior remains isolated | Clone V1/V2/V3 independently | Existing private clone seam | R2 | T3 | PURE_POLICY_SEAM | Originals unchanged; references distinct | PLANNED_SUPPORTING_AUTHORITY: legacy payloads |
| S19 | V4 is unequal to every legacy version | Compare canonical V4 against V1/V2/V3 | Private exhaustive discriminator/comparator | R1 | T3 | PURE_POLICY_SEAM | Every V4/legacy comparison false | PLANNED_SUPPORTING_AUTHORITY: legacy payloads |
| S20 | Legacy versions remain pairwise unequal | Compare V1/V2/V3 pairs | Existing private comparator | R2 | T3 | PURE_POLICY_SEAM | Every cross-version comparison false | PLANNED_SUPPORTING_AUTHORITY: legacy payloads |

Hostile replay support for S01–S15 is non-primary and is separately owned by C11–C16, C36 and C41. No physical test identity may serve as primary authority for two different layers.

## Ownership contract materialization plan

The accepted registry prerequisite is closed. The active registry currently and correctly contains only `2B19A3A`. Round 2 does not modify `scripts/vitest-ownership-contracts.mjs` and does not invent future baseline values.

Implementation must proceed in this order:

1. Materialize the A3B application tests and `docs/implementation/phase-3-slice-2b19a3b-test-traceability.md` first.
2. Every A3B application test identity uses exact leading marker prefix `[2B19A3B-`.
3. Owner project is exactly `application-service-dreamer-vortox`.
4. Traceability file is exactly `docs/implementation/phase-3-slice-2b19a3b-test-traceability.md`.
5. Supporting-authority prefix is exactly `SUP-2B19A3B-`.
6. The registered criterion set is exactly `C01` through `C41` plus `S01` through `S20`.
7. Only after tests and traceability physically exist may a separate implementation-time contract-materialization change append one active `2B19A3B` closed record to `scripts/vitest-ownership-contracts.mjs`.
8. The record must use the accepted exact schema: `contractId`, `markerPrefix`, `markerPattern`, `applicationTestFile`, `ownerProject`, `traceabilityFile`, `criterionIds`, `supportingAuthorityPrefix`, `frozenBaseline`, `status`; its `frozenBaseline` uses the accepted twelve exact fields.
9. Every count and SHA in that baseline is calculated from the real implementation commit inventory and independently verified. No value is copied, predicted, learned from CI candidate input, left empty, or marked provisional.
10. No inactive/planned contract may enter the registry. `status` is `ACTIVE` only when all referenced material exists.
11. A3A contract bytes, criterion set, prefixes and frozen hashes remain unchanged.
12. Registry self-test and full ownership verification must prove missing, duplicate, foreign, wrong-owner and unregistered A3B identities fail; dynamic inventory reports zero missing/duplicate/unexpected/ambiguous.

No semantic inventory SHA, authority inventory SHA, project inventory SHA, physical file SHA, supporting-authority count, dynamic-test count, physical title, or final SUP ID is frozen in this design.

## Planned supporting-authority purposes

Implementation-time traceability may assign real `SUP-2B19A3B-NNN` IDs only after materialization:

- canonical DRUNK/Vortox OPEN prefix: real formal commands through Philosopher choice, exact DRUNK, scheduling and V3 opportunity opening; expected `ACCEPTED`; mutation `NONE`; supports success, no-Vortox failure/retry and provenance criteria.
- accepted V4 stream: real successful V4 formal chain; expected `ACCEPTED`; mutation `NONE`; defensive hostile clones use `CLONE_MUTATED`; supports replay, ledger, Mathematician, projection, Seamstress and hostile criteria.
- legacy Dreamer streams: existing V1/V2/V3 histories; expected `LEGACY` or `ACCEPTED` according to actual source; mutation `NONE`; supports compatibility criteria.

These are purposes, not final supporting IDs or physical fixtures. Supporting authority never determines primary layer.

## Test plan and allowlist

Only these test files may change:

1. `packages/domain-core/src/dreamer.test.ts`
2. `packages/domain-core/src/domain-batch-semantics.test.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
4. `packages/domain-core/src/rebuild.test.ts`
5. `packages/application/src/game-application-service.test.ts`
6. `packages/application/src/mathematician-information.test.ts`
7. `packages/projections/src/private-knowledge-view.test.ts`

No new public test-harness export or immutable fixture is required. Existing V1/V2/V3 fixtures remain unchanged. Tests must materialize every C/S criterion through its required primary mechanism, use one physical identity per primary layer, and add implementation-time actual fields only to the traceability document. Application tests use the A3B marker and must execute under exactly one owner.

Required validation includes focused affected tests; typecheck; full lint; all nine ordinary shards plus merge; all nine coverage shards plus official blob merge; ownership self-test and verifier; exact uncovered obligations; Windows deterministic; no disabled test, timeout increase, topology change, dependency change, `onTaskUpdate` workaround, locale/time/random ordering, or serialization equality.

## Coverage-profile workflow

The accepted nine-process topology, `VITEST_MAX_FORKS=1`, thresholds and old profiles are immutable. At the exact product implementation commit, run the full nine-shard coverage candidate three independent times. All shards/merges must pass; canonical count/SHA pairs for source files and zero-hit statement/function/line/branch-arm sets must match across all three; ownership inventory identity/hash must match with zero missing/duplicate/unexpected/ambiguous and zero timeout/RPC failure.

Only after stability, create a separate exact profile with deterministic ID `phase-3-slice-2b19a3b-<first-7-product-head>-ownership-v2-1`, `sourceHead` equal to the full product commit and `sourceKind="PRODUCT_IMPLEMENTATION_STABLE_NINE_PROCESS_BASELINE"`. It records the five exact count/hash pairs and links all candidate runs. The profile commit may change only `scripts/verify-coverage-obligations.mjs`, `.github/workflows/ci.yml` solely to select the exact profile, `docs/implementation/phase-3-slice-2b19a3b-coverage-profile.md`, and required status/traceability/control docs. It cannot alter production, test bodies, fixtures, topology, timeouts, dependencies, thresholds or semantics. Old profiles remain byte-identical; exact equality is mandatory; CI cannot learn its expected profile.

Non-identical candidates, ambiguous profile matching, or inability to represent the exact profile without weakening verification is `CI_TEST_INFRASTRUCTURE_FAILURE` and stops the product PR for a separate infrastructure task.

## Production allowlist and size

Exactly these production files may change:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

`event-applier.ts`, `rebuild.ts`, event type maps, `GameState`, opportunity production, Philosopher production, Mathematician production, workflows, dependencies and Vitest workspace are not production-change surfaces.

Expected production scope is five files and 650–950 added lines. Suggested ceiling is six files/1000 lines. Hard stop is eight files/1500 lines; exceeding it is `RESLICE_REQUIRED`.

## Documentation allowlist

In addition to this Round 2 design and its independent Round 2 review, implementation may update only:

- `docs/implementation/phase-3-slice-2b19a3b-test-traceability.md`
- `docs/implementation/phase-3-slice-2b19a3b-status.md`
- `docs/implementation/phase-3-slice-2b19a3b-coverage-profile.md`
- `docs/rules/ROLE_COVERAGE_MATRIX.md`
- `docs/agent-loop/AUTOPILOT_STATE.json`
- `docs/agent-loop/CURRENT_TASK.md`
- `docs/agent-loop/PROJECT_STATE.md`
- `docs/agent-loop/AUTOPILOT_LOG.md`
- `scripts/vitest-ownership-contracts.mjs`, only for the post-materialization active A3B data record described above; no schema/control-flow change.

The original and resolved evidence/governance histories, Round 1 design/review, accepted A3A artifacts and A3A contract remain immutable. The PR body must contain `Rule Evidence`, `Rule Claims Implemented`, `Explicitly Unsupported Rules`, `Rule Source Revisions`, and `Rule-to-Test Traceability`.

## Round 1 → Round 2 criterion mapping

| Round 1 | Round 2 | Reason |
|---|---|---|
| C01–C06 | unchanged IDs/behavior; classifications audited | no defect |
| C07 | C07 | canonical positive direct-shape reachability corrected to R1; T1/STRUCTURAL retained |
| C08–C14 | unchanged IDs/behavior; classifications audited | no defect |
| C15 | C15 | trust corrected T2→T1; hostile replay remains R3/HOSTILE |
| C16 | C16 | trust corrected T2→T1; hostile replay remains R3/HOSTILE |
| C17 | C17 | unchanged R4/T3/PURE |
| C18 | C18 | formal application entry trust corrected T2→T1 |
| C19–C31 | unchanged IDs/behavior; classifications audited | no defect |
| C32 | C32 plus independently materialized S01–S20 | blanket mixed matrix narrowed to atomic T1 structural contract; pure seams remain separate |
| C33 | C33 | unchanged |
| C34 | C34, C41 | `COMPOUND_CRITERION_ATOMIZED_WITHOUT_BEHAVIOR_CHANGE`; suffix IDs avoided because accepted registry schema rejects them |
| C35–C38 | unchanged IDs/behavior; classifications audited | no defect |
| C39 | C39 plus explicit R4 deferral | executable claim narrowed to real accepted Seamstress continuation; unavailable role/impairment mutation producer is not fabricated |
| C40 | C40 | unchanged |
| S01–S15 | S01–S15 | all nine design-time fields materialized; direct structural classification frozen |
| S16 | S16, S18, S19, S20 | clone and cross-version assertions atomized by R1/R2 without behavior change |
| S17 | S17 | V4 fieldwise equality/no-serialization pure seam materialized |

Final registry criterion inventory is exactly C01–C41 and S01–S20. There are no compound R/T/layer values and no suffix criterion IDs.

## Explicit out of scope

- POISONED Dreamer plus Vortox success.
- Drunk/poisoned/dead/duplicate/stale Vortox success.
- No Dashii derivation.
- Drunk Dreamer information without effective Vortox.
- Duplicate/conflicting impairment success.
- General multi-cause ledger or new evidence variant.
- New event type, state field, generic impairment/effect engine or public context.
- Philosopher-gained Dreamer, multiple Dreamers or multiple duplicate interactions.
- Free Storyteller false-role choice persistence, Travellers, death/life state.
- Actual later role/impairment mutation historical-stability integration until a separately authorized accepted producer exists; this is R4/BACKLOG_NORMAL.
- Other-night Dreamer, FIRST_NIGHT completion, DAY, Phase 2C, 2B19A3C, 2B19B or later Slice.
- Any role coverage `COMPLETE` promotion.

## Rollback

Before merge, abandon/revert only the feature branch/PR; never rewrite accepted main or V1/V2/V3 history. After merge, any behavioral rollback is a forward commit that disables new V4 production while retaining V4 replay compatibility. Removing V4 from the accepted union or reinterpreting stored V4 is forbidden. Ownership/profile records may be superseded only by separately reviewed exact records, never deleted or weakened.

## Stop-Loss

Return `RESLICE_REQUIRED` before implementation or during implementation if any new event, state field, evidence variant, cause array/graph, generic effect engine, POISONED success, impaired-Vortox success, Mathematician production/public change, public trust boundary, Vitest topology/dependency/timeout/threshold change, V3 reinterpretation, unlisted production path, more than eight production files, more than 1500 added production lines, three independent subsystem risks, R4 behavior as current acceptance authority, ownership schema/control-flow change, or substantive architecture blocker is required.

Return `HUMAN_BLOCKED` for a new external-rule conflict, unavailable mandatory source without approved snapshot, unsafe history rewrite or permission failure. Because this is design round 2/2, an independent result other than `RULE_DESIGN_PASS` with no remaining blockers stops the Slice; no Round 3 may be inferred.

## Acceptance and terminal state

Implementation can begin only after a fresh independent read-only reviewer re-reads external sources/snapshots, resolved evidence/governance, USER_OVERRIDES, official nightsheet, role matrix, accepted ADR/V1.1, ownership registry/schema, A3A authority, this Round 2 design and all relevant code, then returns exactly `RULE_DESIGN_PASS` with `remainingBlockers=[]`.

A later release additionally requires complete implementation traceability; contract materialization from real inventory; production/test/docs allowlist compliance; typecheck/lint/tests; stable coverage candidates and exact profile; exact-head required CI; complete frozen PR body; one complete independent final report on the exact HEAD; `CODE_REVIEW_PASS`; `RULE_REVIEW_PASS`; empty blockers; both verbatim GitHub audit comments re-read against current PR HEAD; no post-review commit; clean worktree; Dreamer/Philosopher/Mathematician remain PARTIAL and Vortox remains NOT_STARTED.

This design itself keeps `implementationAuthorized=false` and makes no review verdict.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_2
