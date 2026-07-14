# Phase 3 Slice 2B19 Design Round 3 — Dreamer V2 Completion

## Metadata

```text
sliceId: 2B19
phase: Phase 3
authorization: USER_AUTHORIZED_2B19_DESIGN_ROUND_3_CANONICAL_CAPTURE_COMPLETION
parentDesign: docs/implementation/phase-3-slice-2b19-design-round-2.md
parentDesignSha256: b169a34d18334dd403a08fece16a7932a54a4259a724495c7e95fca7c29d0c00
ruleEvidence: docs/rules/evidence/2B19.md
ruleEvidenceSha256: 76f9a13d8f04d9ab92bd40a3d341034eee2d0ab1619e74795a72181706fbf363
behaviorDesignChanged: false
contractCompletionOnly: true
designRound: 3 / 3
ruleVerdict: RULE_READY
implementationAuthorized: false
selectedEventStrategy: A_NEW_EVENT_TYPES
coverageStatus: PARTIAL
```

This document is the complete, independent, sole implementation authority for Slice 2B19. Round 1 and Round 2 remain immutable history and are not implementation inputs. This document preserves every approved Round 2 behavior contract and completes only canonical state capture, normalization, structured fingerprinting, and test-layer classification.

## ruleAuthority

The sole rule authority is `docs/rules/evidence/2B19.md` at the SHA-256 recorded in Metadata. The frozen behavior is:

1. Normal Dreamer information contains exactly one GOOD character and one EVIL character, and exactly one selected role is the target's true current character at resolution.
2. An alive, effective Vortox requires both selected roles to differ from the target's true current character while preserving one GOOD and one EVIL result.
3. Without an effective Vortox, a DRUNK or POISONED source may receive true-containing or fully false information. The deterministic simulation selects a false pair when legal alternatives exist and falls back to a true-containing pair only when the native-side alternative is unavailable.
4. Effective Vortox false-information constraint controls the result when source impairment is also present.
5. In-play roles remain legal false candidates.
6. Character native type determines the GOOD or EVIL field; player alignment does not.
7. Settlement-time `CurrentCharacterState` supplies target truth. Later state changes never rewrite a stored delivery.
8. A Philosopher-gained Dreamer source is the Philosopher holder. The source character remains `philosopher`; the ability role is `dreamer`.
9. Duplicate-base-Dreamer drunkenness does not impair the Philosopher holder unless a separate canonical impairment matches that holder.
10. V1 accepted history remains exact. New V1 Vortox execution and V1 gained settlement remain unsupported and fail closed.
11. V2 gained execution uses Dreamer's first-night position. At that position, base precedes gained tasks; gained tasks order by ascending source seat and then UTF-16 code-unit task ID.
12. Missing source, target, tenure, impairment, Vortox, candidate, grant, insertion, opportunity, accepted-stream, or initialization provenance fails closed.

Code, tests, README text, prior design prose, and model memory cannot override these rules.

## supportMatrix

| Path | Canonical producer | Accepted-stream application | Replay | Pure seam |
|---|---|---:|---:|---:|
| V1 base without current Vortox | accepted V1 OPEN opportunity | compatibility only | unchanged | existing V1 |
| V1 base with any current Vortox identity or unavailable Vortox proof | V1 cannot record the required proof | fail closed | accepted historical V1 remains replayable | not expanded |
| V1 gained | accepted scheduling history only | unsupported | scheduling history only | unsupported |
| V2 base normal | V2 plan base Dreamer task | supported | supported | supported |
| V2 base DRUNK | Philosopher duplicates base Dreamer | supported | supported | supported |
| V2 base active Vortox | unique current Vortox tenure | supported | supported | supported |
| V2 base DRUNK plus active Vortox | duplicate impairment plus unique active Vortox | supported | supported | supported |
| V2 gained normal | choice, grant, V2 insertion, V2 opportunity | supported | supported | supported |
| V2 gained active Vortox | gained chain plus unique active Vortox | supported | supported | supported |
| V2 source POISONED | no current canonical producer leaves the resolving source poisoned | not reachable | fabricated history rejected | policy seam only |
| V2 gained source independently impaired | no current canonical producer | not reachable | fabricated history rejected | policy seam only |
| Current Vortox impaired | no current canonical producer leaves a current Vortox impaired | not reachable | fabricated history rejected | constraint seam only |
| Candidate shortage | fixed signed catalog has sufficient candidates | not reachable | corrupted history rejected | candidate seam only |

A pure seam proves resolver semantics only. It does not establish an accepted product history.

## legacyV1Boundary

The exact V1 contracts remain unchanged: `DreamerTargetChosen`, `DreamerInformationDelivered`, `dreamer-information-model-v1`, `dreamer-false-role-policy-v1`, target and delivery key sets, three-event batch, opportunity payload and ID, replay, rebuild, state-only projection, ledger evidence shape, evidence rank, primary identity, and unresolved-Vortox classification. No V2 field is optional on a V1 payload.

An accepted V1 OPEN base opportunity may execute only when it is next, its source and target pass existing V1 validation, and settlement state contains no current Vortox identity. It is never upgraded to V2. Any current Vortox identity, conflicting identity, or unavailable proof yields retryable receipt-free failure before event construction. V1 gained execution yields receipt-free, event-free `ApplicationNotConfigured`.

## v2CapabilityBoundary

V2 is limited to a canonical `first-night-task-plan-v2`, base `DREAMER_ACTION`, `FirstNightTaskInsertedV2` gained `DREAMER_ACTION`, `FIRST_NIGHT`, day 0, night 1, the fixed validated Sects & Violets catalog, represented role tenure and impairment facts, no-Traveller fixed roster, and a complete validated accepted event stream. It does not complete FIRST_NIGHT, enter DAY, implement other-night Dreamer, introduce poison or death producers, or begin Phase 2C.

## existingTypeAuthority

The implementation imports these existing types without changing their current exact shapes:

```ts
import type {
  AbilityImpairmentId,
  ActionOpportunityId,
  EventId,
  GameId,
  GrantedAbilityId,
  PlayerId,
  RoleId,
  RoleTenureId,
  ScheduledTaskId
} from "./ids.js";
import type { SeatNumber } from "./player-roster.js";
import type {
  CharactersAssignedPayload,
  FirstNightInitializedPayload,
  FirstNightTaskPlanCreatedPayload,
  InitialPrivateKnowledgeEstablishedPayload,
  PlayerRosterCreatedPayload,
  SetupGeneratedPayload,
  AnyDomainEventEnvelope,
  DomainEventEnvelope
} from "./events.js";
import type { DreamerInformationDeliveredPayload, DreamerTargetChosenPayload } from "./dreamer.js";
import type { RoleCatalogSnapshot, RoleSetupSnapshot } from "./setup-types.js";
import type { CurrentCharacterStateSet } from "./current-character-state.js";
import type {
  FirstNightTaskProgress,
  ScheduledTask
} from "./first-night-task-plan.js";
import type { FirstNightActionOpportunityState } from "./first-night-action-opportunity.js";
import type {
  AbilityImpairmentSet,
  FirstNightTaskInsertion,
  GrantedAbilitySet,
  PhilosopherAbilityChoiceSet
} from "./philosopher-ability.js";
import type {
  FirstNightAbilityInstanceId,
  FirstNightAbilityInstanceProvenance,
  FirstNightAbilityOutcomeLedger,
  FirstNightInitializationEnvelopeProvenance
} from "./first-night-ability-outcome-ledger.js";
import type { MathematicianImpairmentEventProvenanceState } from "./mathematician.js";
import type { RoleTenureState } from "./seamstress.js";
import type { GamePhase } from "./game-phase.js";
import type { GameState } from "./game-state.js";
```

## versionConstants

```ts
export const DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION = "dreamer-first-night-action-v2" as const;
export const DREAMER_V2_RESOLUTION_CAPABILITY_VERSION = "dreamer-first-night-resolution-capability-v2" as const;
export const DREAMER_V2_SOURCE_CONTRACT_VERSION = "dreamer-source-contract-v2" as const;
export const DREAMER_V2_GAINED_ENTITLEMENT_VERSION = "dreamer-philosopher-gained-entitlement-v2" as const;
export const DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION = "dreamer-target-choice-v2" as const;
export const DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION = "dreamer-information-delivery-v2" as const;
export const DREAMER_V2_INFORMATION_MODEL_VERSION = "dreamer-information-model-v2" as const;
export const DREAMER_V2_RESOLUTION_MODEL_VERSION = "dreamer-resolution-model-v2" as const;
export const DREAMER_V2_CANDIDATE_DOMAIN_VERSION = "dreamer-candidate-domain-v2" as const;
export const DREAMER_V2_SIMULATION_POLICY_VERSION = "dreamer-smallest-legal-role-code-unit-v1" as const;
export const DREAMER_V2_INFORMATION_STAGE = "DREAMER_INFORMATION" as const;
export const DREAMER_V2_CANONICAL_CONTEXT_VERSION = "dreamer-canonical-context-v2" as const;
export const DREAMER_V2_PIPELINE_FINGERPRINT_VERSION = "dreamer-pipeline-state-fingerprint-v2" as const;
export const DREAMER_V2_RESOLUTION_BOUNDARY_VERSION = "dreamer-resolution-boundary-v2" as const;
export const DREAMER_V2_PROJECTION_TRUST_VERSION = "dreamer-projection-trust-v2" as const;
```

## sourceContracts

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

export type DreamerV2GainedEntitlement = {
  readonly entitlementVersion: typeof DREAMER_V2_GAINED_ENTITLEMENT_VERSION;
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly schedulingVersion: "philosopher-gained-first-night-scheduling-v2";
  readonly insertedTaskId: ScheduledTaskId;
  readonly insertedTaskType: "DREAMER_ACTION";
  readonly philosopherTaskId: ScheduledTaskId;
  readonly philosopherOpportunityId: ActionOpportunityId;
  readonly grantId: GrantedAbilityId;
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceCharacterStateRevision: number;
  readonly sourceRole: RoleSetupSnapshot;
  readonly chosenRole: RoleSetupSnapshot;
  readonly originalOpportunityKind: "PHILOSOPHER_FIRST_NIGHT_ACTION";
  readonly originalOpportunityStatus: "CLOSED";
  readonly insertionEventType: "FirstNightTaskInsertedV2";
};

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

export type PhilosopherGainedDreamerV2SourceContract = {
  readonly sourceContractVersion: typeof DREAMER_V2_SOURCE_CONTRACT_VERSION;
  readonly kind: "PHILOSOPHER_GAINED_DREAMER_V2";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly schedulingVersion: "philosopher-gained-first-night-scheduling-v2";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly abilityRole: RoleSetupSnapshot;
  readonly sourceRoleTenure: DreamerV2RoleTenureSnapshot;
  readonly opportunityCharacterStateRevision: number;
  readonly gainedEntitlement: DreamerV2GainedEntitlement;
  readonly abilityInstance: FirstNightAbilityInstanceProvenance & { readonly kind: "PHILOSOPHER_GAINED_TASK_V2" };
};

export type DreamerV2SourceContract = BaseDreamerV2SourceContract | PhilosopherGainedDreamerV2SourceContract;
```

A base source requires one V2-plan ROLE task, one exact Dreamer roster/current-role match, one continuously active Dreamer tenure from opportunity revision through settlement, exact Dreamer source and ability snapshots, and the canonical base ability-instance ID. A gained source requires one closed original Philosopher opportunity, one choice, one grant, one V2 insertion, one gained V2 ability-instance ID, and one continuously active Philosopher tenure. Source player, seat, revision, snapshots, opportunity, grant, insertion, task, and instance must cross-link exactly. Exactly zero applicable source impairments is EFFECTIVE; exactly one is KNOWN_DRUNK or KNOWN_POISONED; more than one fails `MULTIPLE_APPLICABLE_SOURCE_IMPAIRMENTS`. The current no-death first-night schema is the only alive proof. A future death-capable history fails `ALIVE_EVIDENCE_MODEL_UNSUPPORTED`.

## opportunityContract

The accepted base task ID remains `first-night-v1:DREAMER_ACTION:seat-XX`. Task ID does not select capability. V2 capability is selected jointly by V2 task-plan version, exact V2 opportunity payload, V2 opportunity ID, and V2 event type. New V2-plan tasks always open V2 opportunities.

```ts
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
  readonly sourceContract: DreamerV2SourceContract;
  readonly visibility: DreamerActionOpportunityVisibilityV2;
};
```

V2 base ID is `first-night-v2:DREAMER_ACTION:BASE:seat-XX:opportunity-01`. V2 gained ID is `first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-XX:from-dreamer:opportunity-01`. The exact parser union distinguishes V1 base, supported V1 gained Snake Charmer or Seamstress, V2 base Dreamer, V2 gained Dreamer, and invalid input. It rejects bad padding, seats outside 1 through 12, non-positive index, extra segments, wrong role segment, and case changes. Replay selects generation from exact accepted opportunity payload plus parsed ID, never from base task ID.

## opportunityParser

```ts
export type ParsedFirstNightActionOpportunityId =
  | {
      readonly valid: true;
      readonly generation: "V1";
      readonly sourceKind: "BASE";
      readonly taskType: "PHILOSOPHER_ACTION" | "SNAKE_CHARMER_ACTION" | "WITCH_ACTION" | "CERENOVUS_ACTION" | "DREAMER_ACTION" | "SEAMSTRESS_ACTION";
      readonly seatNumber: SeatNumber;
      readonly opportunityIndex: number;
    }
  | {
      readonly valid: true;
      readonly generation: "V1";
      readonly sourceKind: "PHILOSOPHER_GAINED";
      readonly taskType: "SNAKE_CHARMER_ACTION" | "SEAMSTRESS_ACTION";
      readonly abilityRoleId: "snake_charmer" | "seamstress";
      readonly seatNumber: SeatNumber;
      readonly opportunityIndex: number;
    }
  | {
      readonly valid: true;
      readonly generation: "V2";
      readonly sourceKind: "BASE";
      readonly taskType: "DREAMER_ACTION";
      readonly abilityRoleId: "dreamer";
      readonly seatNumber: SeatNumber;
      readonly opportunityIndex: number;
    }
  | {
      readonly valid: true;
      readonly generation: "V2";
      readonly sourceKind: "PHILOSOPHER_GAINED";
      readonly taskType: "DREAMER_ACTION";
      readonly abilityRoleId: "dreamer";
      readonly seatNumber: SeatNumber;
      readonly opportunityIndex: number;
    }
  | { readonly valid: false; readonly reason: string };
```

## targetCandidateAndVortoxContracts

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

export type ResolveDreamerV2CandidatesInput = {
  readonly roleCatalogSnapshot: RoleCatalogSnapshot;
  readonly roleCatalogSignature: string;
  readonly targetTruth: DreamerV2TargetTruth;
  readonly sourceEffectiveness: DreamerV2SourceEffectiveness;
  readonly vortoxConstraint: DreamerV2VortoxConstraint;
};

export type DreamerV2CandidateResolutionFailureCode =
  | "INVALID_ROLE_CATALOG_SNAPSHOT"
  | "SPARSE_ROLE_CATALOG"
  | "DUPLICATE_ROLE_ID"
  | "UNKNOWN_TARGET_ROLE"
  | "ROLE_NATIVE_SIDE_MISMATCH"
  | "NO_GOOD_CANDIDATE"
  | "NO_EVIL_CANDIDATE"
  | "NO_VORTOX_FALSE_GOOD_CANDIDATE"
  | "NO_VORTOX_FALSE_EVIL_CANDIDATE";

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
      readonly failureCode: DreamerV2CandidateResolutionFailureCode;
      readonly message: string;
    };
```

Candidate arrays are dense, exact, unique, and sorted by UTF-16 code-unit `roleId`. GOOD contains Townsfolk and Outsider snapshots. EVIL contains Minion and Demon snapshots. The signed historical setup catalog is the sole domain. Normal effective information includes the true role exactly once. Impaired information without effective Vortox selects the lowest non-true native-side candidate when present and otherwise uses the true role; the opposite side selects its lowest candidate. Effective Vortox excludes the true role from both sides. Input order, locale, object iteration, Map iteration, random values, clock values, and UUID values cannot affect selection.

Vortox resolution requires zero or one current Vortox identity. One identity requires exactly one active matching tenure. Zero applicable Vortox impairments yields `VORTOX_FALSE_REQUIRED`; exactly one yields `NONE_CURRENT_VORTOX_KNOWN_IMPAIRED`; more than one fails `VORTOX_EFFECTIVENESS_CONFLICT`. Missing or multiple tenures, multiple current identities, or death-capable history fails closed. The public Mathematician state-bound resolver remains unchanged.

## canonicalResolutionBoundary

```ts
export type DreamerV2TargetChoiceId = string & { readonly __brand: "DreamerV2TargetChoiceId" };
export type DreamerV2DeliveryId = string & { readonly __brand: "DreamerV2DeliveryId" };

export type DreamerV2ResolutionBoundary = {
  readonly boundaryVersion: typeof DREAMER_V2_RESOLUTION_BOUNDARY_VERSION;
  readonly stage: "PRE_TARGET" | "PRE_DELIVERY" | "PRE_SETTLEMENT";
  readonly opportunityId: ActionOpportunityId;
  readonly targetPlayerId: PlayerId;
  readonly targetChoiceId: DreamerV2TargetChoiceId | null;
  readonly deliveryId: DreamerV2DeliveryId | null;
};
```

`PRE_TARGET` requires null target-choice and delivery IDs and an OPEN V2 opportunity. `PRE_DELIVERY` requires a canonical target-choice ID, null delivery ID, exactly one matching stored V2 target choice, and the same OPEN V2 opportunity. `PRE_SETTLEMENT` requires canonical target-choice and delivery IDs, exactly one matching V2 target choice and delivery, and the same CLOSED V2 opportunity. Every boundary object has the exact six enumerable keys shown above.

## canonicalContextCapture

The sole capture entry is module-private in `packages/domain-core/src/dreamer-v2-internal.ts` and is not exported from the domain-core package root:

```ts
const canonicalDreamerV2ContextBrand: unique symbol = Symbol("canonicalDreamerV2ContextBrand");

type CanonicalDreamerV2Context = {
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
  readonly firstNightTaskInsertions: FirstNightTaskInsertion;
  readonly philosopherAbilityChoices: PhilosopherAbilityChoiceSet;
  readonly philosopherGrantedAbilities: GrantedAbilitySet;
  readonly firstNightActionOpportunities: FirstNightActionOpportunityState;
  readonly abilityImpairments: AbilityImpairmentSet;
  readonly impairmentEventProvenance: MathematicianImpairmentEventProvenanceState;
  readonly roleTenures: RoleTenureState;
  readonly dreamerTargetChoices: DreamerTargetChoiceSet;
  readonly dreamerInformationDeliveries: DreamerInformationSet;
  readonly firstNightAbilityOutcomeLedger: FirstNightAbilityOutcomeLedger;
  readonly targetTask: ScheduledTask;
  readonly sourceContract: DreamerV2SourceContract;
  readonly sourceAbilityInstance: FirstNightAbilityInstanceProvenance;
  readonly resolutionBoundary: DreamerV2ResolutionBoundary;
  readonly [canonicalDreamerV2ContextBrand]: true;
};

const buildCanonicalDreamerV2ContextFromState = (
  state: GameState,
  taskId: ScheduledTaskId,
  boundary: DreamerV2ResolutionBoundary
): CanonicalDreamerV2Context;
```

`DreamerTargetChoiceSet` and `DreamerInformationSet` are the exact V1/V2 unions defined in the Events section of this document.

The builder is used by application command capture, accepted-stream decision replay, prospective validation at all three prefixes, per-event replay validation, stored delivery checkpoint validation, trusted private projection replay, and pipeline fingerprint creation. No other Dreamer V2 path may select, omit, default, or normalize state fields.

### required rejection

The builder throws `DomainError` code `InvalidDreamerV2CanonicalContext` before returning a context when any of these conditions holds: `gameId` is empty or noncanonical; `rulesBaselineVersion` is empty or noncanonical; phase/day/night is not FIRST_NIGHT/0/1; `firstNight`, `firstNightInitializationProvenance`, `initialPrivateKnowledge`, `setup`, `roster`, `assignment`, `currentCharacterState`, `firstNightTaskPlan`, or `firstNightAbilityOutcomeLedger` is absent; the target task is absent; task type is not `DREAMER_ACTION`; plan is not V2; the boundary is not exact; the referenced V2 opportunity is absent or wrong for the boundary stage; source contract or source ability instance cannot be reconstructed uniquely; source tenure is absent, discontinuous, or conflicting; or any required payload fails exact validation. No empty object can replace a required fact.

The V2 source-continuity contract requires `RoleTenureState` to represent `dreamer` in addition to its current role-ID domain. Slice 2B19 therefore adds `dreamer` to the existing tenure role-ID union, parser, formatter, assignment bootstrap, transition handling, and exact validation. This is the storage completion of the already frozen base-Dreamer continuity contract; it does not add a character-change producer.

### exact optional normalization

The builder applies these unique normalizations before validation and cloning:

```ts
state.philosopherAbilityChoices ?? { choices: [] }
state.philosopherGrantedAbilities ?? { abilities: [] }
state.firstNightTaskInsertions ?? { insertions: [] }
state.firstNightActionOpportunities ?? { opportunities: [] }
state.abilityImpairments ?? { impairments: [] }
state.seamstressRoleTenureState ?? { records: [], processedTransitionFactIds: [] }
state.dreamerTargetChoices ?? { choices: [] }
state.dreamerInformation ?? { deliveries: [] }
state.mathematicianImpairmentEventProvenance ?? { entries: [] }
state.firstNightTaskProgress ?? { settlements: [] }
```

No normalized context field is undefined. Missing `firstNightTaskProgress` is legal after task-plan creation and before the first settlement, because the accepted settlement applier already treats absence as an empty settlement sequence. The normalized `{ settlements: [] }` is validated against the full task plan. A present progress value is never replaced or reordered.

### full payload mappings

Roster uses option A and retains the complete accepted `PlayerRosterCreatedPayload`: `rulesBaselineVersion`, `rosterVersion`, and `entries`. `entries` must be a dense twelve-entry array in ascending seat order with unique player and seat identities. The builder maps `roster: structuredClone(state.roster)` after exact payload and roster validation.

Setup uses option A and retains the complete accepted `SetupGeneratedPayload`: `rulesBaselineVersion`, `scriptId`, `setupAlgorithmVersion`, `randomAlgorithmVersion`, `randomStream`, `roleCatalogVersion`, `roleCatalogSnapshot`, `roleCatalogSignature`, `roleCatalogSignatureAlgorithm`, `constraintsSnapshot`, `preModifierCounts`, `postModifierCounts`, `actualRoles`, `demonRole`, `setupModifiersApplied`, `demonBluffs`, and `validationSummary`. The role catalog snapshot supplies the candidate resolver. The builder maps `setup: structuredClone(state.setup)` after exact key, nested shape, signature, and source-fact validation.

Assignment retains the complete accepted `CharactersAssignedPayload`: `rulesBaselineVersion`, `rosterVersion`, `assignmentAlgorithmVersion`, `randomAlgorithmVersion`, `randomStream`, `roleCatalogSignature`, and `assignments`. It is cloned only after exact key validation and exact roster/setup assignment validation.

Task plan uses option A and retains the complete accepted `FirstNightTaskPlanCreatedPayload`: `rulesBaselineVersion`, `nightNumber`, `taskPlanVersion`, `taskCatalogVersion`, `taskCatalogSignatureAlgorithm`, `taskCatalogSignature`, `taskCatalogSnapshot`, `rosterVersion`, `assignmentAlgorithmVersion`, `roleCatalogSignature`, `knowledgeModelVersion`, `knowledgeStage`, and `tasks`. It is cloned only after `validateFirstNightTaskPlanCreatedPayload` and `validateFirstNightTaskPlanRuntimeState` succeed against the complete setup, `roster.entries`, `assignment.assignments`, first-night payload, initial private knowledge from state, and normalized insertion-derived tasks.

`firstNight` retains the complete `FirstNightInitializedPayload`: `rulesBaselineVersion`, `initializationVersion`, `nightNumber`, `rosterVersion`, `assignmentAlgorithmVersion`, and `roleCatalogSignature`. Initialization provenance retains exactly `provenanceVersion`, `gameId`, `rulesBaselineVersion`, `eventId`, and `eventSequence`; it must match game identity, baseline, ledger window anchor, and the accepted initialization envelope when an accepted stream is available.

`initialPrivateKnowledge` retains the complete accepted `InitialPrivateKnowledgeEstablishedPayload`. The builder maps `initialPrivateKnowledge: structuredClone(state.initialPrivateKnowledge)` only after the existing exact payload validator and source-fact validator succeed.

### validation clone and brand

`validateCanonicalDreamerV2ContextInternal` is module-private. It requires exact enumerable keys on every object; canonical primitive values; no accessors, symbol keys, or noncanonical prototype; dense arrays; unique identities; safe integers; exact nested role snapshots; exact V1/V2 union discriminators; and all state cross-links. It invokes the existing exact payload validators and adds exact set-level validation for each normalized container. The set-level validators preserve array order and reject duplicate identities or orphaned choice, grant, insertion, opportunity, impairment, tenure, target-choice, or delivery records.

After validation, every field is recursively deep-cloned with `structuredClone`; no returned field shares an input object or array reference. The clone is revalidated. Only the builder attaches the non-enumerable brand with `Object.defineProperty`. Callers cannot supply partial context, attach the brand, use `Object.assign` to widen the object, or substitute raw JSON serialization for validation or equality.

## structuredPipelineFingerprint

The fingerprint is canonical structured data. It contains no integrity hash and no semantic decision depends on a hash.

```ts
export type DreamerV2PipelineStateFingerprint = {
  readonly fingerprintVersion: typeof DREAMER_V2_PIPELINE_FINGERPRINT_VERSION;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly phase: GamePhase;
  readonly dayNumber: number;
  readonly nightNumber: number;
  readonly firstNight: FirstNightInitializedPayload;
  readonly firstNightInitializationProvenance: FirstNightInitializationEnvelopeProvenance;
  readonly initialPrivateKnowledgeFingerprint: InitialPrivateKnowledgeEstablishedPayload;
  readonly setupFingerprint: SetupGeneratedPayload;
  readonly rosterFingerprint: PlayerRosterCreatedPayload;
  readonly assignmentFingerprint: CharactersAssignedPayload;
  readonly currentCharacterStateFingerprint: CurrentCharacterStateSet;
  readonly taskPlanFingerprint: FirstNightTaskPlanCreatedPayload;
  readonly taskProgressFingerprint: FirstNightTaskProgress;
  readonly insertionFingerprint: FirstNightTaskInsertion;
  readonly philosopherChoiceFingerprint: PhilosopherAbilityChoiceSet;
  readonly philosopherGrantFingerprint: GrantedAbilitySet;
  readonly actionOpportunityFingerprint: FirstNightActionOpportunityState;
  readonly impairmentFingerprint: AbilityImpairmentSet;
  readonly impairmentEventProvenanceFingerprint: MathematicianImpairmentEventProvenanceState;
  readonly roleTenureFingerprint: RoleTenureState;
  readonly dreamerChoiceFingerprint: DreamerTargetChoiceSet;
  readonly dreamerDeliveryFingerprint: DreamerInformationSet;
  readonly ledgerFingerprint: FirstNightAbilityOutcomeLedger;
  readonly targetTaskFingerprint: ScheduledTask;
  readonly nextTaskFingerprint: ScheduledTask | null;
  readonly sourceContractFingerprint: DreamerV2SourceContract;
  readonly sourceAbilityInstanceFingerprint: FirstNightAbilityInstanceProvenance;
  readonly resolutionBoundaryFingerprint: DreamerV2ResolutionBoundary;
};

const buildDreamerV2PipelineStateFingerprint = (
  context: CanonicalDreamerV2Context
): DreamerV2PipelineStateFingerprint;
```

The fingerprint builder accepts only the branded canonical context. Every field is a fresh deep clone of the corresponding normalized context field, including `initialPrivateKnowledgeFingerprint` from `context.initialPrivateKnowledge`. `nextTaskFingerprint` is computed with `getNextUnsettledFirstNightTask(context.firstNightTaskPlan, context.firstNightTaskProgress)` and is null when all tasks are settled. Equality authority is `sameCanonicalDataValue` over the entire structured fingerprint. No digest, stringification, object identity, partial-key comparison, or hash-collision assumption is permitted.

Application capture uses an internal-module export that is not re-exported from the package root:

```ts
export type CaptureDreamerV2PipelineFingerprintInput = {
  readonly state: GameState;
  readonly taskId: ScheduledTaskId;
  readonly boundary: DreamerV2ResolutionBoundary;
};

export const captureDreamerV2PipelineFingerprintForInternalApplication = (
  input: CaptureDreamerV2PipelineFingerprintInput
): DreamerV2PipelineStateFingerprint;
```

This wrapper calls only `buildCanonicalDreamerV2ContextFromState` and `buildDreamerV2PipelineStateFingerprint`. The accepted-stream resolver clones and validates envelopes, rebuilds state, calls the same context builder with the same task ID and boundary, then calls the same fingerprint builder. Pipeline and rebuild match only when `sameCanonicalDataValue(pipelineFingerprint, rebuiltFingerprint)` is true.

Collection order is frozen:

- setup catalog, actual roles, bluffs, modifiers, constraints, roster entries, assignments, current-character entries, task catalog definitions, task-plan tasks, and `initialPrivateKnowledge.entries` retain their validated canonical payload order;
- task settlements retain accepted settlement event order;
- insertions, Philosopher choices, grants, action opportunities, impairments, role-tenure records, processed transition IDs, impairment provenance entries, Dreamer choices, Dreamer deliveries, and ledger facts retain accepted event-history order;
- the fingerprint builder performs no collection sorting;
- candidate GOOD and EVIL arrays are the sole arrays sorted during policy derivation, using explicit UTF-16 code-unit role-ID order;
- no order depends on locale, `Intl.Collator`, default object-key order, Map insertion order, random values, or clock values.

A pipeline/rebuild mismatch returns retryable dependency failure with code `CanonicalStateRebuildFailed`, `failureStage = first-night-role-action`, and a player-safe message. It writes no receipt, emits no event, settles no task, changes no game version, and permits retry with the same command ID. Hidden fingerprint content is never exposed to player or AI output.

## commandsAndResolution

The public command remains exact:

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

export type ResolveDreamerV2Input = {
  readonly acceptedEvents: readonly AnyDomainEventEnvelope[];
  readonly pipelineStateFingerprint: DreamerV2PipelineStateFingerprint;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly targetPlayerId: PlayerId;
};

export type DreamerV2ResolutionFailureKind =
  | "INVALID_ACCEPTED_EVENT_STREAM"
  | "PIPELINE_STATE_MISMATCH"
  | "UNSUPPORTED_V1_GAINED_SOURCE"
  | "V1_VORTOX_EVIDENCE_UNREPRESENTABLE"
  | "INVALID_V2_SOURCE_CHAIN"
  | "SOURCE_NO_LONGER_VALID"
  | "INVALID_TARGET_STATE"
  | "MULTIPLE_APPLICABLE_SOURCE_IMPAIRMENTS"
  | "SOURCE_IMPAIRMENT_EVIDENCE_UNAVAILABLE"
  | "VORTOX_IDENTITY_NOT_UNIQUE"
  | "VORTOX_TENURE_MISSING_OR_INCONSISTENT"
  | "VORTOX_EFFECTIVENESS_CONFLICT"
  | "ALIVE_EVIDENCE_MODEL_UNSUPPORTED"
  | "CANDIDATE_DOMAIN_UNAVAILABLE"
  | "CANONICAL_STATE_REBUILD_FAILED";

export type InternalDreamerV2Resolution =
  | {
      readonly kind: "READY";
      readonly rebuiltState: GameState;
      readonly rebuiltStateFingerprint: DreamerV2PipelineStateFingerprint;
      readonly sourceContract: DreamerV2SourceContract;
      readonly targetTruth: DreamerV2TargetTruth;
      readonly candidateResolution: Extract<DreamerV2CandidateResolution, { readonly kind: "READY" }>;
      readonly sourceEffectiveness: DreamerV2SourceEffectiveness;
      readonly vortoxConstraint: DreamerV2VortoxConstraint;
      readonly settlementCharacterStateRevision: number;
    }
  | {
      readonly kind: "DEPENDENCY_FAILURE";
      readonly failureKind: DreamerV2ResolutionFailureKind;
      readonly message: string;
    };
```

The command decision constructs a `PRE_TARGET` boundary from command task, opportunity, and target; captures the pipeline fingerprint through the internal wrapper; clones and validates accepted events; rebuilds state; constructs the matching branded context; compares full fingerprints; derives source, target truth, source effectiveness, Vortox constraint, and candidates exclusively from that context; and returns READY only after every cross-link succeeds. Caller input never supplies hidden rule facts.

## eventsAndVersioning

Strategy A is final. IDs are `dreamer-target-choice-v2:<taskId>` and `dreamer-delivery-v2:<taskId>`. Parser and formatter validate canonical base or gained task IDs and exact round-trip.

```ts
export type DreamerTargetChosenV2Payload = {
  readonly rulesBaselineVersion: string;
  readonly targetChoiceSchemaVersion: typeof DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly targetChoiceId: DreamerV2TargetChoiceId;
  readonly decisionKind: "CHOOSE_PLAYER";
  readonly sourceContract: DreamerV2SourceContract;
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
  readonly sourceContract: DreamerV2SourceContract;
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

`DreamerTargetChosenPayload` and `DreamerInformationDeliveredPayload` are the existing imported V1 types from `dreamer.ts`. `DomainEventPayloadByType` adds only `DreamerTargetChosenV2` and `DreamerInformationDeliveredV2`. Envelope `eventVersion` is unchanged. Event type and exact schema discriminator select V1 or V2. Missing keys, extra keys, wrong generation, wrong version, and V1/V2 payload substitution are rejected.

## batchSemantics

```ts
export type DreamerV2ProspectiveEventTuple = readonly [
  DomainEventEnvelope<"DreamerTargetChosenV2">,
  DomainEventEnvelope<"DreamerInformationDeliveredV2">,
  DomainEventEnvelope<"ScheduledTaskSettled">
];
```

A successful command emits exactly target, delivery, settlement in that order. All three share game, batch, command, game version, timestamp, correlation, causation, and rules baseline; sequences are consecutive. Task, opportunity, source contract, target, target-choice ID, delivery ID, and settlement revision cross-link exactly. Settlement has `taskType = DREAMER_ACTION`, `outcomeType = DREAMER_INFORMATION_DELIVERED`, and `characterStateRevision = delivery.settlementCharacterStateRevision`. Naked, reversed, duplicated, same-task mixed-generation, or phase-transition-containing batches are invalid. V1 batch semantics remain unchanged.

## prospectiveValidation

```ts
export type ValidateProspectiveDreamerV2TripletInput = {
  readonly priorAcceptedEvents: readonly AnyDomainEventEnvelope[];
  readonly pipelineStateFingerprint: DreamerV2PipelineStateFingerprint;
  readonly events: DreamerV2ProspectiveEventTuple;
};

export type DreamerV2ProspectiveValidationFailureCode =
  | "PIPELINE_STATE_MISMATCH"
  | "EXPECTED_TARGET_MISMATCH"
  | "EXPECTED_DELIVERY_MISMATCH"
  | "EXPECTED_SETTLEMENT_MISMATCH"
  | "BATCH_CONTRACT_INVALID"
  | "PROSPECTIVE_STREAM_INVALID"
  | "PROSPECTIVE_REBUILD_MISMATCH"
  | "LEDGER_FACT_MISMATCH";

export type ProspectiveDreamerV2TripletValidation =
  | { readonly valid: true; readonly prospectiveStateFingerprint: DreamerV2PipelineStateFingerprint }
  | { readonly valid: false; readonly code: DreamerV2ProspectiveValidationFailureCode; readonly reason: string };
```

Prospective validation independently resolves READY from the validated prior stream; compares the PRE_TARGET fingerprint; compares exact target, delivery, and settlement payloads; validates envelope metadata and generic batch semantics; validates the complete prospective stream; rebuilds each prefix; constructs PRE_DELIVERY and PRE_SETTLEMENT contexts with the same canonical builder; compares each structured fingerprint; independently applies the tuple; and verifies exactly one new V2 terminal ledger fact at delivery and no second fact at settlement. Every failure is retryable, receipt-free, and event-free.

## storedValidation

```ts
export type DreamerV2DeliveryCheckpoint = {
  readonly targetEventIndex: number;
  readonly deliveryEventIndex: number;
  readonly settlementEventIndex: number;
  readonly preTargetStateFingerprint: DreamerV2PipelineStateFingerprint;
  readonly targetEvent: DomainEventEnvelope<"DreamerTargetChosenV2">;
  readonly stateAfterTargetFingerprint: DreamerV2PipelineStateFingerprint;
  readonly deliveryEvent: DomainEventEnvelope<"DreamerInformationDeliveredV2">;
  readonly stateAfterDeliveryFingerprint: DreamerV2PipelineStateFingerprint;
  readonly settlementEvent: DomainEventEnvelope<"ScheduledTaskSettled">;
  readonly stateAfterSettlementFingerprint: DreamerV2PipelineStateFingerprint;
};

export type ValidateStoredDreamerV2Input = {
  readonly acceptedEvents: readonly AnyDomainEventEnvelope[];
  readonly checkpoint: DreamerV2DeliveryCheckpoint;
  readonly finalStateFingerprint: DreamerV2PipelineStateFingerprint;
};

export type StoredDreamerV2ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };
```

Stored validation accepts no partial fact bundle and no standalone state. It clones and validates the complete accepted stream, requires consecutive target/delivery/settlement indexes in one batch, rebuilds each prefix, calls the same canonical builder with PRE_TARGET, PRE_DELIVERY, and PRE_SETTLEMENT boundaries, builds all fingerprints with the same fingerprint builder, validates source and candidate derivation at historical resolution, and confirms one matching target, delivery, settlement, and ledger fact in final state. Later state cannot replace historical checkpoint state.

## exactShapeValidation

All V2 validators require canonical plain objects, exact enumerable key sets, no symbol keys or accessors, safe finite integers, dense arrays, unique identities, canonical UTF-16 code-unit order where sorting is specified, exact role snapshots, ID parser/formatter round-trip, complete cross-links, and exact accepted-envelope provenance. Raw JSON serialization and locale-sensitive comparison are prohibited.

## ledgerAdapter

```ts
export type DreamerV2ActionOpportunityEvidence = {
  readonly kind: "DREAMER_V2_ACTION_OPPORTUNITY";
  readonly opportunityVersion: "first-night-action-opportunity-v2";
  readonly opportunitySchemaVersion: typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "DREAMER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: "OPEN";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourceKind: "BASE_DREAMER_V2" | "PHILOSOPHER_GAINED_DREAMER_V2";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly abilityInstanceId: FirstNightAbilityInstanceId;
};

export type DreamerV2DeliveryEvidence = {
  readonly kind: "DREAMER_V2_DELIVERY";
  readonly deliveryId: DreamerV2DeliveryId;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly abilityInstanceId: FirstNightAbilityInstanceId;
  readonly targetPlayerId: PlayerId;
  readonly targetTrueRoleId: RoleId;
  readonly deliveredGoodRoleId: RoleId;
  readonly deliveredEvilRoleId: RoleId;
  readonly candidateDomainVersion: typeof DREAMER_V2_CANDIDATE_DOMAIN_VERSION;
  readonly roleCatalogSignature: string;
  readonly informationReliability: DreamerV2InformationReliability;
  readonly vortoxConstraintKind: DreamerV2VortoxConstraint["kind"];
  readonly terminalEventId: EventId;
};
```

`TerminalAbilityOutcomeEventType` adds `DreamerInformationDeliveredV2`. `AbilityOutcomeEvidenceReference` adds the two variants without changing existing members. Existing generic evidence ranks remain 0 through 16 in their current order. New ranks append `17 DREAMER_V2_ACTION_OPPORTUNITY` and `18 DREAMER_V2_DELIVERY`. Primary identities are opportunity ID and delivery ID. No legacy rank shifts.

V2 slot order is: SOURCE_EVENT, TASK, DREAMER_V2_ACTION_OPPORTUNITY, CHARACTER_STATE, source PLAYER_ROLE_AT_REVISION, source ROLE_TENURE, target PLAYER_ROLE_AT_REVISION, source ABILITY_IMPAIRMENT, Vortox PLAYER_ROLE_AT_REVISION, Vortox ROLE_TENURE, Vortox ABILITY_IMPAIRMENT, original Philosopher ACTION_OPPORTUNITY, PHILOSOPHER_GRANT, FIRST_NIGHT_TASK_INSERTION, DREAMER_V2_DELIVERY. Source impairment slot exists only for one source impairment. Vortox slots exist only for a current Vortox; Vortox impairment exists only for its one impairment. Philosopher slots exist only for gained V2. Every V2 fact has exactly one source tenure. No other evidence kind is legal in a V2 Dreamer fact.

Classification is frozen:

| Information reliability | outcomeStatus | causeKind | causedByAnotherCharacterAbility |
|---|---|---|---:|
| RULE_CORRECT | NORMAL | NO_OTHER_CHARACTER_ABILITY | false |
| impaired true fallback | NORMAL | NO_OTHER_CHARACTER_ABILITY | false |
| drunk false | ABNORMAL | SOURCE_DRUNKENNESS | true |
| poisoned false | ABNORMAL | SOURCE_POISONING | true |
| Vortox false | ABNORMAL | VORTOX_FALSE_INFORMATION | true |

A valid V2 delivery never produces Dreamer Vortox UNRESOLVED. Unavailable proof prevents event creation. Ability instance is independently reconstructed from task, grant, and insertion history. The 2B18B Mathematician event contract remains unchanged.

## privateProjection

```ts
const trustedDreamerV2ProjectionBrand: unique symbol = Symbol("trustedDreamerV2ProjectionBrand");

type TrustedDreamerV2ProjectionState = {
  readonly trustVersion: typeof DREAMER_V2_PROJECTION_TRUST_VERSION;
  readonly finalState: GameState;
  readonly checkpoints: readonly DreamerV2DeliveryCheckpoint[];
  readonly [trustedDreamerV2ProjectionBrand]: true;
};

export type PlayerDreamerInformationViewV2 = {
  readonly target: { readonly playerId: PlayerId; readonly seatNumber: SeatNumber };
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
};

export type PlayerDreamerV2ProjectionFields = {
  readonly dreamerInformation: PlayerDreamerInformationViewV2;
  readonly dreamerKnowledgeModelVersion: typeof DREAMER_V2_INFORMATION_MODEL_VERSION;
};
```

Only the internal complete-stream replay function can attach the non-enumerable trust brand. It clones and validates the accepted stream, validates every batch, captures each V2 checkpoint, runs stored validation, and brands final state only after every check succeeds. State-only projection remains supported for V1-only state and fails `PrivateKnowledgeUnavailable` when any V2 opportunity, V2 target choice, or V2 delivery exists. Settlement alone does not infer V2.

Accepted-stream projection supports V1-only, V2-only, and valid V1/V2 histories in different task batches. Same-task mixing is invalid. A viewer with zero owned Dreamer deliveries receives none; exactly one validated owned V1 or V2 delivery is projected; more than one owned delivery fails closed. Different source viewers may each own one delivery. AI projection calls the same trusted player builder. Only target, GOOD role, EVIL role, model, and delivered knowledge stage are exposed. Source contract, candidate domain, truth, reliability, impairment, Vortox, grant, insertion, simulation policy, and ledger cause remain hidden. Historical projection reads the stored delivery and never recomputes it.

## replay

V1 events use unchanged V1 validation. V2 events use the branded canonical pre-event context. Opportunity payload schema and event type select generation. The base V1 task grammar does not select resolution. Accepted V1 OPEN completion stays V1; a new V2-plan opening is V2. Same-task V1/V2 mixing, candidate tampering, reliability tampering, source tampering, tenure tampering, Vortox tampering, evidence tampering, and hostile IDs are rejected. Complete stream validation precedes trusted projection. Windows and Ubuntu must produce identical IDs, ordering, candidates, payloads, fingerprints, and evidence arrays.

## receiptAndFailureBoundary

Recorded deterministic rejections are invalid command shape, unknown task or opportunity, closed opportunity, actor mismatch, task not next, target missing, target equals source, and invalid phase.

Receipt-free retryable failures are incomplete or conflicting accepted history, pipeline fingerprint mismatch, invalid gained chain, source continuity loss, multiple source impairments, Vortox identity, tenure, or effectiveness conflict, unsupported alive evidence, candidate failure, V1 gained execution, V1 current-Vortox execution, metadata failure, and prospective failure. V2 dependency failures return `status = failed`, `code = DependencyExecutionFailed`, `failureStage = first-night-role-action`, and `retryable = true`. V1 gained may return `ApplicationNotConfigured`.

Source, target, tenure, impairment, Vortox, candidate, canonical capture, and pipeline equality finish before metadata generation. Every failure emits zero events, writes zero accepted or rejected receipt unless it is a listed deterministic rejection, settles zero tasks, appends zero ledger facts, and increments no game version. A receipt-free failure permits retry with the same command ID. Missing evidence never falls back to current final state, V1 shape, another role resolver, README text, or model memory.

## acceptedStreamDefinition

The only history that may carry layer `ACCEPTED_STREAM_INTEGRATION` is produced from real accepted domain event envelopes, passed through `validateDomainEventStream`, rebuilt by `rebuildGameState`, and then submitted through the application command pipeline. A hand-written `GameState`, a directly mutated clone, a missing canonical event, an impossible duplicate role, missing tenure, an artificial multiple-gained-task state, or any fabricated event stream is not accepted-stream evidence.

Every test uses exactly one of these primary layers:

- `ACCEPTED_STREAM_INTEGRATION`
- `HOSTILE_REPLAY_REJECTION`
- `PURE_POLICY_SEAM`
- `STRUCTURAL_VALIDATION`
- `PROJECTION`
- `CROSS_PLATFORM_CI`

`HOSTILE_SOURCE_CONTINUITY_SEAM` is the named source-continuity subtype of `HOSTILE_REPLAY_REJECTION` required for D19-092.

## testMatrix

The following D19-001 through D19-095 assertions are mandatory. `docs/implementation/phase-3-slice-2b19-test-traceability.md` must record each ID, exact test file, exact test title, primary layer, and direct production entry.

| ID | Primary layer | Direct production entry | Required assertion |
|---|---|---|---|
| D19-001 | ACCEPTED_STREAM_INTEGRATION | SubmitDreamerAction to V2 resolver | normal GOOD target contains exact true GOOD role |
| D19-002 | ACCEPTED_STREAM_INTEGRATION | SubmitDreamerAction to V2 resolver | normal EVIL target contains exact true EVIL role |
| D19-003 | ACCEPTED_STREAM_INTEGRATION | canonical duplicate impairment to V2 resolver | base DRUNK selects false when a legal alternative exists |
| D19-004 | PURE_POLICY_SEAM | candidate resolver | POISONED selects false when a legal alternative exists |
| D19-005 | ACCEPTED_STREAM_INTEGRATION | V2 resolver and triplet | active Vortox excludes true GOOD target role |
| D19-006 | ACCEPTED_STREAM_INTEGRATION | V2 resolver and triplet | active Vortox excludes true EVIL target role |
| D19-007 | ACCEPTED_STREAM_INTEGRATION | V2 resolver and triplet | active Vortox plus canonical base DRUNK is Vortox-constrained false |
| D19-008 | PURE_POLICY_SEAM | candidate resolver | active Vortox plus POISONED is Vortox-constrained false |
| D19-009 | PURE_POLICY_SEAM | candidate resolver and application failure mapper | candidate shortage is retryable and maps to zero mutation |
| D19-010 | ACCEPTED_STREAM_INTEGRATION | V2 opportunity opener | gained V2 opportunity has exact shape |
| D19-011 | ACCEPTED_STREAM_INTEGRATION | Human SubmitDreamerAction | matching gained Human source submits |
| D19-012 | ACCEPTED_STREAM_INTEGRATION | AI command pipeline | matching gained AI source submits |
| D19-013 | ACCEPTED_STREAM_INTEGRATION | application actor gate | non-source actor is rejected |
| D19-014 | HOSTILE_REPLAY_REJECTION | gained-chain validator | missing grant fails closed |
| D19-015 | HOSTILE_REPLAY_REJECTION | gained-chain validator | missing insertion fails closed |
| D19-016 | HOSTILE_REPLAY_REJECTION | gained-chain validator | original Philosopher opportunity mismatch fails closed |
| D19-017 | HOSTILE_REPLAY_REJECTION | gained-chain validator | terminal Dreamer opportunity mismatch fails closed |
| D19-018 | STRUCTURAL_VALIDATION | opportunity and task ID parsers | role segment mismatch is rejected |
| D19-019 | HOSTILE_REPLAY_REJECTION | gained-chain validator | gained revision mismatch is rejected |
| D19-020 | ACCEPTED_STREAM_INTEGRATION | gained source-effectiveness resolver | base Dreamer impairment does not affect gained source |
| D19-021 | PURE_POLICY_SEAM | gained source-effectiveness resolver | gained-own impairment applies only to holder |
| D19-022 | ACCEPTED_STREAM_INTEGRATION | gained V2 resolver | gained normal information contains exactly one true role |
| D19-023 | ACCEPTED_STREAM_INTEGRATION | gained V2 resolver | gained active-Vortox information excludes target truth |
| D19-024 | ACCEPTED_STREAM_INTEGRATION | V2 scheduler | base resolves before gained |
| D19-025 | PURE_POLICY_SEAM | scheduler order classifier | artificial multiple gained tasks order by sourceSeatNumber then task ID code-unit order |
| D19-026 | ACCEPTED_STREAM_INTEGRATION | complete V1 replay | accepted V1 replay is unchanged |
| D19-027 | STRUCTURAL_VALIDATION | V1 exact payload validators | V1 exact shape rejects added or missing keys |
| D19-028 | ACCEPTED_STREAM_INTEGRATION | V1 OPEN compatibility path | V1 no-Vortox completion remains accepted |
| D19-029 | ACCEPTED_STREAM_INTEGRATION | V1 compatibility command gate | new V1 current-Vortox command fails receipt-free |
| D19-030 | ACCEPTED_STREAM_INTEGRATION | V1 gained compatibility command gate | V1 gained settlement remains unsupported |
| D19-031 | HOSTILE_REPLAY_REJECTION | batch and event-stream validators | same-task V1/V2 mixing is rejected |
| D19-032 | PURE_POLICY_SEAM | candidate resolver | exact GOOD candidate domain |
| D19-033 | PURE_POLICY_SEAM | candidate resolver | exact EVIL candidate domain |
| D19-034 | PURE_POLICY_SEAM | candidate resolver | UTF-16 code-unit ordering is stable |
| D19-035 | PURE_POLICY_SEAM | candidate resolver | normal path preserves target truth |
| D19-036 | PURE_POLICY_SEAM | candidate resolver | Vortox path excludes target truth |
| D19-037 | STRUCTURAL_VALIDATION | candidate input validator | sparse candidates are rejected |
| D19-038 | STRUCTURAL_VALIDATION | candidate input validator | duplicate candidates are rejected |
| D19-039 | STRUCTURAL_VALIDATION | candidate input validator | unknown catalog role is rejected |
| D19-040 | PURE_POLICY_SEAM | candidate resolver | input permutation does not change result |
| D19-041 | ACCEPTED_STREAM_INTEGRATION | prospective triplet validator | valid V2 triplet is accepted |
| D19-042 | HOSTILE_REPLAY_REJECTION | batch validator | naked target is rejected |
| D19-043 | HOSTILE_REPLAY_REJECTION | batch validator | naked delivery is rejected |
| D19-044 | HOSTILE_REPLAY_REJECTION | batch validator | naked settlement is rejected |
| D19-045 | HOSTILE_REPLAY_REJECTION | batch validator | reversed triplet is rejected |
| D19-046 | HOSTILE_REPLAY_REJECTION | replay validator | source mismatch is rejected |
| D19-047 | HOSTILE_REPLAY_REJECTION | replay validator | target mismatch is rejected |
| D19-048 | HOSTILE_REPLAY_REJECTION | replay candidate resolver | candidate snapshot tampering is rejected |
| D19-049 | HOSTILE_REPLAY_REJECTION | replay validator | reliability tampering is rejected |
| D19-050 | HOSTILE_REPLAY_REJECTION | replay Vortox resolver | Vortox constraint tampering is rejected |
| D19-051 | STRUCTURAL_VALIDATION | all V2 exact validators | extra fields are rejected |
| D19-052 | HOSTILE_REPLAY_REJECTION | stream and stored validators | duplicate delivery is rejected |
| D19-053 | HOSTILE_REPLAY_REJECTION | batch validator | mixed PhaseTransitioned batch is rejected |
| D19-054 | ACCEPTED_STREAM_INTEGRATION | terminal ledger adapter | normal V2 maps to NORMAL |
| D19-055 | ACCEPTED_STREAM_INTEGRATION | terminal ledger adapter | DRUNK false maps to ABNORMAL and SOURCE_DRUNKENNESS |
| D19-056 | PURE_POLICY_SEAM | terminal classification resolver | POISONED false maps to ABNORMAL and SOURCE_POISONING |
| D19-057 | ACCEPTED_STREAM_INTEGRATION | terminal ledger adapter | Vortox false maps to ABNORMAL and VORTOX_FALSE_INFORMATION |
| D19-058 | ACCEPTED_STREAM_INTEGRATION | terminal ledger adapter | valid V2 Vortox never emits UNRESOLVED |
| D19-059 | ACCEPTED_STREAM_INTEGRATION | gained terminal ledger adapter | source identity is Philosopher holder |
| D19-060 | ACCEPTED_STREAM_INTEGRATION | later Mathematician resolver | Math consumes fact without event-contract change |
| D19-061 | PROJECTION | trusted accepted-stream player projection | base source sees only target, roles, model, and stage |
| D19-062 | PROJECTION | trusted accepted-stream player projection | gained source sees only its own delivery |
| D19-063 | PROJECTION | trusted accepted-stream player projection | other player sees no Dreamer delivery |
| D19-064 | PROJECTION | trusted accepted-stream AI projection | AI boundary equals player boundary |
| D19-065 | PROJECTION | V2 projection formatter | Vortox evidence is hidden |
| D19-066 | PROJECTION | V2 projection formatter | impairment evidence is hidden |
| D19-067 | PROJECTION | V2 projection formatter | correctness and reliability are hidden |
| D19-068 | PROJECTION | trusted checkpoint projection | later state does not rewrite delivery |
| D19-069 | ACCEPTED_STREAM_INTEGRATION | existing 2B18B suite | 2B18B regression remains green |
| D19-070 | ACCEPTED_STREAM_INTEGRATION | existing Clockmaker suite | Clockmaker remains unchanged |
| D19-071 | ACCEPTED_STREAM_INTEGRATION | existing Seamstress suite | Seamstress remains unchanged |
| D19-072 | ACCEPTED_STREAM_INTEGRATION | existing Mathematician suite | Mathematician payload and behavior remain unchanged |
| D19-073 | ACCEPTED_STREAM_INTEGRATION | existing Philosopher V1/V2 suite | choice, grant, insertion, and order remain unchanged |
| D19-074 | CROSS_PLATFORM_CI | Windows and Ubuntu required CI | canonical IDs, payloads, fingerprints, candidates, and evidence match |
| D19-075 | PURE_POLICY_SEAM | candidate resolver | impaired no-Vortox true fallback is legal and deterministic |
| D19-076 | PURE_POLICY_SEAM | Vortox constraint resolver | exact impaired-current-Vortox value is resolver-only |
| D19-077 | HOSTILE_REPLAY_REJECTION | replay validator and Vortox constraint resolver | missing Vortox tenure throws DomainError or returns fail-closed unresolved and emits no delivery |
| D19-078 | HOSTILE_REPLAY_REJECTION | replay validator and Vortox constraint resolver | conflicting current Vortox identities fail closed and emit no delivery |
| D19-079 | PURE_POLICY_SEAM | target truth resolver | alignment-only change does not change answer |
| D19-080 | ACCEPTED_STREAM_INTEGRATION | target truth resolver after accepted character-state transition | pre-resolution character change uses current role |
| D19-081 | PROJECTION | trusted historical checkpoint | post-delivery state change does not rewrite output |
| D19-082 | PURE_POLICY_SEAM | candidate resolver | in-play false role remains legal |
| D19-083 | STRUCTURAL_VALIDATION | opportunity, choice, and delivery parsers | hostile IDs are rejected |
| D19-084 | STRUCTURAL_VALIDATION | all V2 validators | accessor, symbol, sparse, prototype, and extra-key inputs are rejected |
| D19-085 | ACCEPTED_STREAM_INTEGRATION | application receipt boundary | receipt-free failure permits same command-ID retry |
| D19-086 | STRUCTURAL_VALIDATION | metadata and prospective validators | metadata or prospective failure causes no partial mutation |
| D19-087 | PROJECTION | state-only and accepted-stream builders | V2 state-only fails and trusted accepted stream succeeds |
| D19-088 | ACCEPTED_STREAM_INTEGRATION | V2 ledger fact derivation | base, gained, and Vortox evidence slots are exact |
| D19-089 | ACCEPTED_STREAM_INTEGRATION | V1 ledger fact derivation | V1 evidence bytes and order remain unchanged |
| D19-090 | HOSTILE_REPLAY_REJECTION | complete-stream validator | fabricated poison, gained-own-impairment, or Vortox-impaired history is rejected |
| D19-091 | HOSTILE_REPLAY_REJECTION | alive-evidence gate | death-capable history fails unsupported |
| D19-092 | HOSTILE_SOURCE_CONTINUITY_SEAM | source continuity validator | fabricated base Dreamer role, seat, or tenure discontinuity is rejected |
| D19-093 | ACCEPTED_STREAM_INTEGRATION | V2 opportunity opener | V1-format base task ID opens V2 capability on V2 plan |
| D19-094 | STRUCTURAL_VALIDATION | ledger rank and slot canonicalizers | legacy ranks stay fixed and V2 ranks and primary IDs are exact |
| D19-095 | PROJECTION | trusted mixed-history replay | valid cross-task V1/V2 is allowed; same-task or same-viewer duplicate fails |

D19-025 cannot be an application accepted-stream test. The current product has unique actual roles, one Philosopher, and one settled Philosopher choice, so it cannot produce multiple gained Dreamer tasks. The test passes an exact synthetic scheduler-policy input and asserts source seat and task-ID ordering only.

D19-077 and D19-078 are corrupted-history tests. Valid assignment, current-character, and tenure rebuild guarantees unique identity and bootstrapped tenure. The tests must either submit hostile envelopes to replay and require `DomainError`, or call the pure Vortox constraint resolver and require fail-closed unresolved. They cannot claim normal product reachability.

D19-092 is a hostile source-continuity seam. No current canonical character-change producer creates a base Dreamer or Philosopher-source discontinuity. The test fabricates the discontinuity only at the continuity validator input and requires rejection; it cannot be labeled accepted-stream integration.

## implementationFiles

Implementation may modify only the directly required domain-core Dreamer, opportunity, event, event-applier, batch, game-state, role-tenure, ledger, private-knowledge, internal export, application service, projection, matching test harness and test files, plus README and 2B19 control, status, traceability, review, and role-coverage documents. It must not modify the accepted 2B18B Mathematician payload, count domain, counting policy, Option A classification, or public state-bound resolver.

## documentationCloseout

The feature branch corrects the known README 2B18B drift and stale CURRENT_TASK instructions; updates AUTOPILOT_STATE, AUTOPILOT_LOG, PROJECT_STATE, 2B19 status and traceability; updates ROLE_COVERAGE_MATRIX with exact canonical end-to-end versus pure-seam support; and keeps Dreamer, Philosopher, Vortox, and Mathematician PARTIAL. No separate main documentation commit is permitted.

## explicitOutOfScope

- other-night Dreamer
- completing FIRST_NIGHT
- DAY
- dawn reset
- Travellers
- registration effects
- free Storyteller selection
- general poison production
- gained-source impairment production
- Vortox impairment production
- death or alive-state engine
- UI, Electron, or SQLite
- AI strategy
- Phase 2C
- V1 payload migration
- Mathematician event changes
- COMPLETE status for Dreamer, Philosopher, Vortox, or Mathematician

## completionCriteria

1. Independent Round 3 review returns RULE_DESIGN_PASS.
2. Branch creation occurs only after that verdict and uses `phase-3/dreamer-v2-completion`.
3. V1 payloads, replay, OPEN compatibility, ledger bytes, ranks, and ordering remain unchanged.
4. New V2-plan base opportunity is selected despite the V1-format base task ID.
5. V2 base and gained source contracts remain exact and continuous through settlement.
6. Active Vortox, canonical base DRUNK, and their combination execute end to end.
7. POISONED, gained-own impairment, impaired Vortox, multiple gained ordering, corrupted Vortox state, and fabricated source discontinuity remain at their declared pure or hostile seams.
8. Every application and rebuild fingerprint originates from the same canonical builder and same normalized structured data.
9. Setup, roster, assignment, first-night payload, initialization provenance, task plan, progress, optional collections, target task, source contract, ability instance, and boundary are all exact and deep-cloned.
10. Fingerprint equality is full `sameCanonicalDataValue` equality and is not hash-only.
11. V2 target, delivery, and settlement form one atomic triplet.
12. Prospective, replay, stored validation, ledger, and trusted projection use the canonical builder at each historical prefix.
13. D19-001 through D19-095 have direct traceability and pass at the declared layer.
14. Fabricated history never counts as accepted-stream support.
15. The 2B18B Mathematician event contract remains unchanged.
16. README and CURRENT_TASK drift are corrected only on the feature branch.
17. Dreamer remains PARTIAL.
18. FIRST_NIGHT is not completed, DAY is not entered, and Phase 2C is not started.
19. Typecheck, lint, full tests, coverage, and diff check pass.
20. Frozen exact-head CI passes before final review.
21. One independent final review returns CODE_REVIEW_PASS and RULE_REVIEW_PASS with no blockers.
22. No feature commit follows a passing review.
23. GitHub audit comments, merge, accepted tag, and closeout obey REVIEW_PROTOCOL.

## coverageStatus

`PARTIAL`

Unimplemented coverage includes other-night Dreamer, Travellers, registration, free Storyteller choice, general poison and impairment production, death and alive mechanics, broader lifecycle interactions, and full first-night completion.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_3
