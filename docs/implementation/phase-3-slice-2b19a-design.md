# Phase 3 Slice 2B19A Design Round 1

```text
sliceId: 2B19A
title: Base Dreamer V2 and Vortox First-Night Information
baseHead: 405f13ac2afbdaf33a20d54ece727b68199f152f
designRound: 1 / 2
maxDesignRounds: 2
ruleEvidence: docs/rules/evidence/2B19.md
ruleEvidenceSha256: 76f9a13d8f04d9ab92bd40a3d341034eee2d0ab1619e74795a72181706fbf363
ruleReady: true
coverageStatus: PARTIAL
implementationAuthorized: false
```

## Authority and bounded outcome

This is the sole Round 1 implementation design for Slice 2B19A. It implements only the base Dreamer first-night V2 path and the effective-Vortox information constraint. It does not authorize implementation until a fresh independent reviewer returns `RULE_DESIGN_PASS` for this exact document.

The supported command path is the base `DREAMER_ACTION` in `first-night-task-plan-v2`. It covers effective normal Dreamer, represented DRUNK, represented POISONED as a pure-policy seam, effective Vortox, and Vortox combined with source impairment. A successful command produces exactly `DreamerTargetChosenV2`, `DreamerInformationDeliveredV2`, and `ScheduledTaskSettled`.

All Philosopher-gained Dreamer execution is excluded. The implementation must not define or migrate `PhilosopherGainedDreamerV2SourceContract`, `DreamerV2GainedEntitlement`, gained task grammar, gained source opportunity, gained revision chains, gained ordering, or gained traceability. When `task.source.kind === "PHILOSOPHER_GAINED_ABILITY"`, the application returns receipt-free retryable `ApplicationNotConfigured` at `failureStage = "first-night-role-action"`, emits no V2 event, settles no task, appends no ledger fact, and changes no version.

## Versions and canonical identifiers

```ts
export const DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION = "dreamer-first-night-action-v2" as const;
export const DREAMER_V2_RESOLUTION_CAPABILITY_VERSION = "dreamer-first-night-resolution-capability-v2" as const;
export const DREAMER_V2_SOURCE_CONTRACT_VERSION = "dreamer-source-contract-v2" as const;
export const DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION = "dreamer-target-choice-v2" as const;
export const DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION = "dreamer-information-delivery-v2" as const;
export const DREAMER_V2_INFORMATION_MODEL_VERSION = "dreamer-information-model-v2" as const;
export const DREAMER_V2_RESOLUTION_MODEL_VERSION = "dreamer-resolution-model-v2" as const;
export const DREAMER_V2_CANDIDATE_DOMAIN_VERSION = "dreamer-candidate-domain-v2" as const;
export const DREAMER_V2_SIMULATION_POLICY_VERSION = "dreamer-smallest-legal-role-code-unit-v1" as const;
export const DREAMER_V2_INFORMATION_STAGE = "DREAMER_INFORMATION" as const;
export const DREAMER_V2_CANONICAL_CONTEXT_VERSION = "dreamer-base-canonical-context-v2" as const;
export const DREAMER_V2_PIPELINE_FINGERPRINT_VERSION = "dreamer-base-pipeline-state-fingerprint-v2" as const;
export const DREAMER_V2_RESOLUTION_BOUNDARY_VERSION = "dreamer-resolution-boundary-v2" as const;
export const DREAMER_V2_PROJECTION_TRUST_VERSION = "dreamer-projection-trust-v2" as const;

export type DreamerV2TargetChoiceId = string & { readonly __brand: "DreamerV2TargetChoiceId" };
export type DreamerV2DeliveryId = string & { readonly __brand: "DreamerV2DeliveryId" };
```

The accepted base task ID remains `first-night-v1:DREAMER_ACTION:seat-XX`. That legacy-looking task ID does not select event generation. V2 generation is selected jointly by the V2 task-plan version, exact V2 opportunity payload, canonical V2 opportunity ID, and V2 event types.

The only new opportunity grammar is:

```text
first-night-v2:DREAMER_ACTION:BASE:seat-XX:opportunity-N
```

`XX` is exactly two decimal digits for seats 01 through 12. `N` is a canonical positive decimal integer with no leading zero. Formatter/parser round-trip is mandatory for indexes 1, 9, 10, 11, 99, and 100. `010`, zero, negative values, extra segments, wrong case, wrong task type, and a gained source segment are invalid.

Choice and delivery identifiers bind the complete task ID:

```text
dreamer-target-choice-v2:<taskId>
dreamer-delivery-v2:<taskId>
```

Their parsers accept only the canonical base Dreamer task grammar and require exact formatter round-trip.

## Base source and opportunity contracts

```ts
export type DreamerV2RoleTenureSnapshot = {
  readonly roleTenureId: RoleTenureId;
  readonly playerId: PlayerId;
  readonly seatNumber: SeatNumber;
  readonly roleId: RoleId;
  readonly acquiredCharacterStateRevision: number;
  readonly endedCharacterStateRevision: number | null;
  readonly statusAtEvaluation: "ACTIVE";
};

export type DreamerV2RepresentedImpairment = {
  readonly impairmentId: AbilityImpairmentId;
  readonly impairmentKind: "DRUNK" | "POISONED";
  readonly sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE" | "SNAKE_CHARMER_DEMON_HIT";
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRoleId: RoleId;
  readonly affectedRole: RoleSetupSnapshot;
  readonly appliedCharacterStateRevision: number;
};

export type DreamerV2SourceEffectiveness =
  | { readonly kind: "EFFECTIVE"; readonly representedImpairments: readonly [] }
  | { readonly kind: "KNOWN_DRUNK"; readonly representedImpairments: readonly [DreamerV2RepresentedImpairment] }
  | { readonly kind: "KNOWN_POISONED"; readonly representedImpairments: readonly [DreamerV2RepresentedImpairment] };

export type BaseDreamerV2SourceContract = {
  readonly sourceContractVersion: typeof DREAMER_V2_SOURCE_CONTRACT_VERSION;
  readonly kind: "BASE_DREAMER_V2";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly abilityRole: RoleSetupSnapshot;
  readonly sourceRoleTenure: DreamerV2RoleTenureSnapshot;
  readonly opportunityCharacterStateRevision: number;
  readonly abilityInstance: FirstNightAbilityInstanceProvenance & { readonly kind: "BASE_ROLE_TASK" };
};

export type DreamerActionOpportunityVisibilityV2 = {
  readonly visibilitySchemaVersion: typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly resolutionCapabilityVersion: typeof DREAMER_V2_RESOLUTION_CAPABILITY_VERSION;
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds: readonly ["CHOOSE_PLAYER"];
  readonly targetSchema: "OTHER_NON_TRAVELLER_MODELED_PLAYER";
};

export type DreamerActionOpportunityV2 = {
  readonly opportunitySchemaVersion: typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: "OPEN" | "CLOSED";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly visibility: DreamerActionOpportunityVisibilityV2;
};
```

The base source is valid only when the V2 task plan contains one base `DREAMER_ACTION`, there is one matching OPEN V2 opportunity, assignment and current state identify the same source player and seat as Dreamer, and exactly one continuous ACTIVE Dreamer tenure covers the opportunity through settlement. The ability instance is the canonical `BASE_ROLE_TASK` identity derived from the task and source. A gained ability instance can never satisfy this contract.

Exactly zero applicable source impairments yields `EFFECTIVE`; exactly one yields `KNOWN_DRUNK` or `KNOWN_POISONED`; more than one fails closed. Missing tenure, discontinuity, conflicting source identity, or future death-capable evidence fails before any event is created. `RoleTenureState` must support `dreamer` in its canonical role-ID domain, bootstrap, transition validation, parser, formatter, and exact validation; this adds no character-change producer.

## Settlement-time target truth, candidates, and Vortox

```ts
export type DreamerV2TargetTruth = {
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly targetCharacterStateRevision: number;
  readonly targetTrueRole: RoleSetupSnapshot;
  readonly targetNativeSide: "GOOD" | "EVIL";
};

export type DreamerV2CandidateDomainSnapshot = {
  readonly candidateDomainVersion: typeof DREAMER_V2_CANDIDATE_DOMAIN_VERSION;
  readonly roleCatalogVersion: string;
  readonly roleCatalogSignature: string;
  readonly roleCatalogCanonicalSignature: string;
  readonly goodCandidates: readonly RoleSetupSnapshot[];
  readonly evilCandidates: readonly RoleSetupSnapshot[];
};

export type DreamerV2VortoxConstraint =
  | {
      readonly kind: "NONE_NO_CURRENT_VORTOX";
      readonly evaluatedCharacterStateRevision: number;
      readonly aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT";
    }
  | {
      readonly kind: "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT";
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleSnapshot: RoleSetupSnapshot;
      readonly vortoxRoleTenure: DreamerV2RoleTenureSnapshot;
      readonly representedImpairments: readonly [DreamerV2RepresentedImpairment];
    }
  | {
      readonly kind: "VORTOX_FALSE_REQUIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly aliveEvidence: "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT";
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleSnapshot: RoleSetupSnapshot;
      readonly vortoxRoleTenure: DreamerV2RoleTenureSnapshot;
    };

export type DreamerV2InformationReliability =
  | "RULE_CORRECT"
  | "DETERMINISTIC_TRUE_WITH_KNOWN_DRUNKENNESS"
  | "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS"
  | "DETERMINISTIC_TRUE_WITH_KNOWN_POISONING"
  | "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING"
  | "VORTOX_CONSTRAINED_FALSE";

export type DreamerV2CandidateResolution =
  | {
      readonly kind: "READY";
      readonly candidateDomain: DreamerV2CandidateDomainSnapshot;
      readonly selectedGoodRole: RoleSetupSnapshot;
      readonly selectedEvilRole: RoleSetupSnapshot;
      readonly truthOutcome: "TARGET_INCLUDED" | "TARGET_EXCLUDED";
      readonly informationReliability: DreamerV2InformationReliability;
    }
  | {
      readonly kind: "DEPENDENCY_FAILURE";
      readonly failureCode:
        | "INVALID_ROLE_CATALOG_SNAPSHOT"
        | "SPARSE_ROLE_CATALOG"
        | "DUPLICATE_ROLE_ID"
        | "UNKNOWN_TARGET_ROLE"
        | "ROLE_NATIVE_SIDE_MISMATCH"
        | "NO_GOOD_CANDIDATE"
        | "NO_EVIL_CANDIDATE"
        | "NO_VORTOX_FALSE_GOOD_CANDIDATE"
        | "NO_VORTOX_FALSE_EVIL_CANDIDATE";
      readonly message: string;
    };
```

Target truth is derived from settlement-time current character state. The role's native type determines GOOD or EVIL; current alignment does not. The target must be a modeled non-Traveller player and cannot be the source.

The signed setup role catalog is the sole candidate domain. Candidate arrays are dense, unique, and sorted by explicit UTF-16 code-unit `roleId` order. GOOD contains Townsfolk and Outsider snapshots; EVIL contains Minion and Demon snapshots. Normal effective information includes the true role exactly once. Without effective Vortox, DRUNK or POISONED selects the lowest legal non-true candidate on the target's native side when one exists, otherwise falls back to truth; the opposite side uses its lowest candidate. Effective Vortox excludes the true role from both sides and dominates source impairment.

Vortox resolution allows zero or one current Vortox identity. One identity requires exactly one matching ACTIVE tenure. Zero applicable Vortox impairment yields `VORTOX_FALSE_REQUIRED`; exactly one yields `NONE_CURRENT_VORTOX_KNOWN_IMPAIRED`; multiple identities, missing or conflicting tenure, more than one impairment, or death-capable evidence fails closed. The public Mathematician state-bound resolver is unchanged.

## Canonical base context and structured fingerprint

```ts
export type DreamerV2ResolutionBoundary = {
  readonly boundaryVersion: typeof DREAMER_V2_RESOLUTION_BOUNDARY_VERSION;
  readonly stage: "PRE_TARGET" | "PRE_DELIVERY" | "PRE_SETTLEMENT";
  readonly opportunityId: ActionOpportunityId;
  readonly targetPlayerId: PlayerId;
  readonly targetChoiceId: DreamerV2TargetChoiceId | null;
  readonly deliveryId: DreamerV2DeliveryId | null;
};

const canonicalBaseDreamerV2ContextBrand: unique symbol = Symbol("canonicalBaseDreamerV2ContextBrand");

type CanonicalBaseDreamerV2Context = {
  readonly contextVersion: typeof DREAMER_V2_CANONICAL_CONTEXT_VERSION;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly phase: "FIRST_NIGHT";
  readonly dayNumber: 0;
  readonly nightNumber: 1;
  readonly firstNight: FirstNightInitializedPayload;
  readonly firstNightInitializationProvenance: FirstNightInitializationEnvelopeProvenance;
  readonly initialPrivateKnowledge: InitialPrivateKnowledgeEstablishedPayload;
  readonly setup: SetupGeneratedPayload;
  readonly roster: PlayerRosterCreatedPayload;
  readonly assignment: CharactersAssignedPayload;
  readonly currentCharacterState: CurrentCharacterStateSet;
  readonly firstNightTaskPlan: FirstNightTaskPlanCreatedPayload;
  readonly firstNightTaskProgress: FirstNightTaskProgress;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState;
  readonly abilityImpairments: AbilityImpairmentSet;
  readonly impairmentEventProvenance: MathematicianImpairmentEventProvenanceState;
  readonly roleTenures: RoleTenureState;
  readonly dreamerTargetChoices: DreamerTargetChoiceSet;
  readonly dreamerInformationDeliveries: DreamerInformationSet;
  readonly firstNightAbilityOutcomeLedger: FirstNightAbilityOutcomeLedger;
  readonly targetTask: ScheduledTask;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly sourceAbilityInstance: FirstNightAbilityInstanceProvenance & { readonly kind: "BASE_ROLE_TASK" };
  readonly resolutionBoundary: DreamerV2ResolutionBoundary;
  readonly [canonicalBaseDreamerV2ContextBrand]: true;
};
```

This context contains no Philosopher choice, grant, insertion, gained entitlement, or gained ability instance. Generic game-state collections may be retained only in the full pipeline fingerprint so unrelated accepted-state changes cannot evade equality; they are never base-source preconditions.

Required collections normalize only as follows: missing task progress becomes `{ settlements: [] }`; missing action opportunities becomes `{ opportunities: [] }`; missing impairments becomes `{ impairments: [] }`; missing role tenures becomes `{ records: [], processedTransitionFactIds: [] }`; missing Dreamer choices becomes `{ choices: [] }`; missing Dreamer deliveries becomes `{ deliveries: [] }`; and missing impairment provenance becomes `{ entries: [] }`. Present values are never replaced, reordered, or repaired. Required first-night, initialization provenance, initial knowledge, setup, roster, assignment, current character state, task plan, and ledger values may not normalize to empty.

The internal builder exact-validates every object and dense array, validates all cross-links, performs `structuredClone`, revalidates the clone, and then attaches the non-enumerable private brand. No caller may construct or brand this context. Accessors, symbol keys, unexpected keys, non-plain prototypes, sparse arrays, duplicate identities, unsafe integers, orphan facts, noncanonical IDs, or invalid V1/V2 union discriminators are rejected before cloning and again after cloning.

The pipeline fingerprint is complete structured data, not a digest. It deep-clones game identity, baseline, version, event sequence, phase/day/night, first-night payload and initialization provenance, initial knowledge, setup, roster, assignment, current state, complete task plan and progress, action opportunities, impairments and provenance, role tenures, Dreamer choices and deliveries, ledger, target task, next unsettled task, base source contract, base ability instance, and resolution boundary. It also includes canonical fingerprints of generic insertion, Philosopher choice, and grant collections solely to detect unrelated accepted-state divergence; those fields cannot establish base-source validity.

`sameCanonicalDataValue` over the entire structured fingerprint is the only equality authority. Raw `JSON.stringify`, hashes, object identity, partial-key equality, locale ordering, and collection resorting are prohibited.

## Command decision and exact event payloads

```ts
export type SubmitDreamerActionCommandPayload = {
  readonly commandType: "SubmitDreamerAction";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly decision: {
    readonly kind: "CHOOSE_PLAYER";
    readonly targetPlayerId: PlayerId;
  };
};

export type DreamerTargetChosenV2Payload = {
  readonly rulesBaselineVersion: string;
  readonly targetChoiceSchemaVersion: typeof DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly targetChoiceId: DreamerV2TargetChoiceId;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly settlementCharacterStateRevision: number;
};

export type DreamerInformationDeliveredV2Payload = {
  readonly rulesBaselineVersion: string;
  readonly deliverySchemaVersion: typeof DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly targetChoiceId: DreamerV2TargetChoiceId;
  readonly deliveryId: DreamerV2DeliveryId;
  readonly sourceContract: BaseDreamerV2SourceContract;
  readonly targetTruth: DreamerV2TargetTruth;
  readonly candidateDomain: DreamerV2CandidateDomainSnapshot;
  readonly selectedGoodRole: RoleSetupSnapshot;
  readonly selectedEvilRole: RoleSetupSnapshot;
  readonly truthOutcome: "TARGET_INCLUDED" | "TARGET_EXCLUDED";
  readonly sourceEffectiveness: DreamerV2SourceEffectiveness;
  readonly vortoxConstraint: DreamerV2VortoxConstraint;
  readonly informationReliability: DreamerV2InformationReliability;
  readonly resolutionModelVersion: typeof DREAMER_V2_RESOLUTION_MODEL_VERSION;
  readonly simulationPolicyVersion: typeof DREAMER_V2_SIMULATION_POLICY_VERSION;
  readonly knowledgeModelVersion: typeof DREAMER_V2_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage: typeof DREAMER_V2_INFORMATION_STAGE;
  readonly settlementCharacterStateRevision: number;
};

export type DreamerTargetChoice = DreamerTargetChosenPayload | DreamerTargetChosenV2Payload;
export type DreamerInformationDelivery = DreamerInformationDeliveredPayload | DreamerInformationDeliveredV2Payload;
export type DreamerTargetChoiceSet = { readonly choices: readonly DreamerTargetChoice[] };
export type DreamerInformationSet = { readonly deliveries: readonly DreamerInformationDelivery[] };
```

V1 payload types remain byte-for-byte unchanged. Event type and exact schema discriminator select V1 or V2. Every V2 validator requires the exact enumerable key set and the full canonical cross-links described above.

## Atomic batch and three independent prefix rebuilds

A successful command creates one atomic batch containing target, delivery, and settlement in that order. The envelopes share game, batch, command, game version, timestamp, correlation, causation, and baseline metadata; sequences are consecutive. Settlement uses `taskType = "DREAMER_ACTION"`, `outcomeType = "DREAMER_INFORMATION_DELIVERED"`, and the delivery's settlement revision. Naked, reversed, duplicated, same-task mixed-generation, or phase-transition-containing complete batches are invalid.

The internal replay primitive is:

```ts
replayGameState(
  events,
  mode: "REQUIRE_COMPLETE_BATCHES" | "ALLOW_FINAL_DREAMER_V2_PREFIX"
): GameState
```

Public `rebuildGameState` uses `ALLOW_FINAL_DREAMER_V2_PREFIX`. Only the final batch may be the exact prefix `DreamerTargetChosenV2` or `DreamerTargetChosenV2 + DreamerInformationDeliveredV2`; every preceding batch, every complete triplet, and every other event type still runs the unchanged strict `validateDomainBatchSemantics`. `rebuildCompleteAcceptedGameState` uses `REQUIRE_COMPLETE_BATCHES`. Accepted-stream resolution, stored validation, ledger trust, and private projection must use `rebuildCompleteAcceptedGameState`, so an incomplete tail can never become accepted or trusted history.

Prospective validation performs these independent paths without reusing a state variable as a substitute for replay:

```ts
const targetEvents = [...priorAcceptedEvents, targetEvent];
const targetDirect = applyDomainEvent(priorState, targetEvent);
const targetRebuilt = rebuildGameState(targetEvents);
assertSameFingerprint("PRE_DELIVERY", targetDirect, targetRebuilt);

const deliveryEvents = [...priorAcceptedEvents, targetEvent, deliveryEvent];
const deliveryDirect = applyDomainEvent(targetDirect, deliveryEvent);
const deliveryRebuilt = rebuildGameState(deliveryEvents);
assertSameFingerprint("PRE_SETTLEMENT", deliveryDirect, deliveryRebuilt);

const finalEvents = [...priorAcceptedEvents, targetEvent, deliveryEvent, settlementEvent];
const finalDirect = applyDomainEvent(deliveryDirect, settlementEvent);
const finalRebuilt = rebuildGameState(finalEvents);
assertSameCanonicalDataValue(finalDirect, finalRebuilt);
```

The fixed mismatch reasons are `TARGET_PREFIX_REBUILD_MISMATCH`, `DELIVERY_PREFIX_REBUILD_MISMATCH`, and `FINAL_TRIPLET_REBUILD_MISMATCH`. Each maps to receipt-free retryable `DependencyExecutionFailed` with `failureStage = "first-night-role-action"`. Any failure produces zero accepted events, zero receipt, zero version increment, zero settlement, and zero ledger fact; after the dependency is repaired, the same command ID may be retried. Only after all three independent rebuild comparisons pass may the entire triplet be committed atomically.

## Ledger, stored validation, and projection

Delivery appends exactly one Dreamer V2 terminal ledger fact; settlement appends none. Existing evidence ranks 0 through 16 do not move. Append rank 17 for `DREAMER_V2_ACTION_OPPORTUNITY` and rank 18 for `DREAMER_V2_DELIVERY`; their primary identities are opportunity ID and delivery ID. Base V2 evidence includes source event, task, V2 opportunity, character state, source player-role-at-revision, source tenure, target player-role-at-revision, optional single source impairment, optional Vortox player-role/tenure/impairment, and V2 delivery. Philosopher grant, Philosopher opportunity, and insertion evidence are prohibited.

Classification is exact:

| Result | outcomeStatus | causeKind | causedByAnotherCharacterAbility |
|---|---|---|---:|
| normal correct or impaired true fallback | `NORMAL` | `NO_OTHER_CHARACTER_ABILITY` | false |
| DRUNK false | `ABNORMAL` | `SOURCE_DRUNKENNESS` | true |
| POISONED false | `ABNORMAL` | `SOURCE_POISONING` | true |
| effective Vortox false | `ABNORMAL` | `VORTOX_FALSE_INFORMATION` | true |

A valid V2 Dreamer delivery never produces Vortox `UNRESOLVED`; unavailable proof prevents event creation. The accepted 2B18B Mathematician event contract and public resolver remain unchanged.

Stored validation accepts only a complete accepted stream. It locates consecutive target/delivery/settlement events in one valid batch, rebuilds target, delivery, and final prefixes, reconstructs each historical boundary with the same canonical builder, validates exact source/candidate derivation, and confirms exactly one matching ledger fact. A standalone state or partial bundle is never provenance. Later character, alignment, impairment, or Vortox state cannot rewrite historical delivered information.

Trusted projection is branded only by complete accepted-stream replay plus stored validation. The base source player sees only target player/seat, selected GOOD role, selected EVIL role, knowledge model version, and stage. Other players see no delivery. AI uses the same viewer boundary. Source contract, true role, candidate domain, correctness, reliability, impairment, Vortox evidence, simulation policy, ledger cause, and all internal fingerprints remain hidden. State-only projection stays valid for V1-only state and fails closed if any V2 opportunity, choice, or delivery exists.

## V1 compatibility and failure boundary

Accepted V1 base replay, exact payload validation, ledger bytes, evidence ordering, and private projection remain unchanged. A V1 base command with no current Vortox retains existing behavior. A new V1 command under current Vortox fails receipt-free because the V1 payload cannot represent required Vortox evidence. V1 gained Dreamer settlement remains unsupported. Same-task V1/V2 mixing is rejected, while valid different-task history may contain both generations.

Deterministic command-shape, phase, actor, target, next-task, and closed-opportunity errors retain recorded rejection receipts. Missing or conflicting accepted history, source continuity, impairment or Vortox proof, candidate failure, prefix mismatch, metadata failure, V1 current-Vortox execution, and all gained execution fail receipt-free and retryable before event creation.

## Implementation file boundary

Implementation may change only directly required Dreamer files and their tests in domain-core, `events.ts`, `event-applier.ts`, `game-state.ts`, `first-night-action-opportunity.ts`, `seamstress.ts` for tenure domain support, `domain-batch-semantics.ts`, `rebuild.ts`, `first-night-ability-outcome-ledger.ts`, `initial-private-knowledge.ts`, domain-core exports, the application service and tests, private-knowledge projection and tests, plus 2B19A traceability/control/role-matrix documents. It must not copy the old PR diff wholesale and must not modify Mathematician event contracts.

## Required traceability and tests

`docs/implementation/phase-3-slice-2b19a-test-traceability.md` records exactly `ID | TestFile | ExactTestTitle | Layer | ProductionEntry | ExpectedResult`. IDs are continuous `D19A-001` through `D19A-041`, and each physical authority test has one primary layer.

- `D19A-001`–`008`: GOOD, EVIL, DRUNK, POISONED pure policy, Vortox GOOD/EVIL, Vortox plus DRUNK/POISONED.
- `D19A-009`–`016`: target/delivery/final direct-rebuild equality; three mismatch termination points; all mismatch failures have zero mutation; same-command-ID retry.
- `D19A-017`–`025`: initialization and ledger anchor; V1/V2 choice and delivery closed unions; assignment and Snake Charmer transition tenures; orphan rejection; validation before clone, revalidation after clone, and safe private brand.
- `D19A-026`–`030`: base task, target-choice ID, and delivery ID round-trip; opportunity indexes 1/9/10/11/99/100; `010` rejection.
- `D19A-031`–`034`: V1 base replay, V1 no-Vortox behavior, V1 current-Vortox receipt-free failure, and gained task receipt-free `ApplicationNotConfigured`.
- `D19A-035`–`041`: normal, DRUNK false, and Vortox false ledger facts; base source player view; other-player hiding; identical AI boundary; later state does not rewrite history.

The test layers are `ACCEPTED_STREAM_INTEGRATION`, `HOSTILE_REPLAY_REJECTION`, `PURE_POLICY_SEAM`, `STRUCTURAL_VALIDATION`, `PROJECTION`, and `CROSS_PLATFORM_CI`. Fabricated state never counts as accepted-stream evidence. POISONED production, Vortox-impairment production, orphan transitions, and hostile clone/brand inputs remain honestly labeled pure or hostile seams.

## Explicit out of scope

- Philosopher-gained Dreamer execution, source contracts, opportunities, grants, insertions, revisions, and ordering
- other-night Dreamer
- completing FIRST_NIGHT, entering DAY, or Phase 2C
- Travellers and registration effects
- free Storyteller candidate choice
- general poison, gained-own-impairment, or Vortox-impairment production
- death/alive engine
- UI, Electron, SQLite, and AI strategy
- V1 migration
- Mathematician event or resolver changes
- `COMPLETE` status for Dreamer, Philosopher, Vortox, or Mathematician

## Completion gates

1. A fresh independent review of this exact Round 1 document returns `RULE_DESIGN_PASS` before production or test implementation.
2. Base V2 normal, impairment, effective Vortox, candidate, event, batch, ledger, projection, and V1-compatibility contracts are implemented without gained contracts.
3. Target, delivery, and final prefixes each call the real `rebuildGameState` over the complete prefix and compare against independent direct application.
4. Complete accepted/trusted history still requires complete batches.
5. All 41 D19A traceability entries pass at their declared single primary layer.
6. Typecheck, lint, full test, coverage, and diff checks pass locally and on the frozen exact feature HEAD.
7. The independent final reviewer returns both `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS` with `remainingBlockers = []`.
8. Dreamer remains `PARTIAL`; 2B19B and Phase 2C do not start automatically.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_1
