# Phase 3 Slice 2B19 Design Round 2 — Dreamer V2 Completion

## Metadata

```text
sliceId: 2B19
phase: Phase 3
designRound: 2 / 2
parentRound1Design: docs/implementation/phase-3-slice-2b19-design.md
parentRound1DesignSha256: c73e4c85f32dfaf63b2d2df87ad9226bbd95fa6423e3feb52a7c666e8a6a36fd
round1Review: docs/implementation/phase-3-slice-2b19-design-review-round-1.md
round1ReviewSha256: 30ff865c3578c574425f2d224eaa25ec005880e7d6dd4540c7dd3b748a5593c7
ruleEvidence: docs/rules/evidence/2B19.md
ruleEvidenceSha256: 76f9a13d8f04d9ab92bd40a3d341034eee2d0ab1619e74795a72181706fbf363
ruleVerdict: RULE_READY
implementationAuthorized: false
selectedEventStrategy: A_NEW_EVENT_TYPES
coverageStatus: PARTIAL
```

本文是实现阶段的完整独立设计权威。实现者不需要回读 Round 1 获得任何类型、输入、边界、测试或排序定义。

## ruleAuthority

规则权威仅为 `docs/rules/evidence/2B19.md` 记录的用户 override、官方 BOTC Wiki、用户指定中文 Wiki 和官方 nightsheet 修订。

冻结的规则结论：

1. 正常筑梦师信息是一名 GOOD 角色和一名 EVIL 角色，且恰有一项等于目标在信息结算时的真实当前角色。
2. 有效且存活的涡流要求 Townsfolk 信息为假。对筑梦师而言，两项角色均不得等于目标真实角色，但一 GOOD、一 EVIL 的结构不变。
3. 醉酒或中毒来源在没有有效涡流时可以收到真信息或假信息。
4. 有效涡流与来源醉酒或中毒并存时，涡流的强制虚假优先。
5. false candidate 可以是在场角色。
6. 角色原生类型决定 GOOD/EVIL 字段；玩家当前阵营不改变答案。
7. 目标在结算时的 `CurrentCharacterState` 是真值。之后的角色、阵营、impairment 或涡流变化不得重写历史 delivery。
8. Philosopher-gained Dreamer 的来源玩家是哲学家本人，来源角色仍为 `philosopher`，能力角色为 `dreamer`。
9. Philosopher 复制 Dreamer 造成的 base Dreamer 醉酒不自动影响 Philosopher-gained 来源。
10. V1 accepted history 保持不变；V1 gained settlement 不获授权。
11. V2 gained 使用 Dreamer 的官方首夜位置；同位置按已批准 override 执行 base、source seat、task ID code-unit 排序。
12. 候选、tenure、impairment、grant、insertion 或 accepted-stream provenance 无法证明时失败关闭。

代码、测试、README、旧设计和模型记忆均不得覆盖这些结论。

## supportMatrix

### Product execution support

| Path | Canonical producer | Application accepted-stream | Replay | Pure resolver |
|---|---|---:|---:|---:|
| V1 base, no current Vortox | accepted V1 history/open opportunity | compatibility only | supported unchanged | existing V1 |
| V1 base, any current Vortox | V1 payload cannot carry proof | fail closed | accepted history remains replayable | not expanded |
| V1 gained | accepted scheduling history only | unsupported | scheduling history replay only | unsupported |
| V2 base normal | base Dreamer task | supported | supported | supported |
| V2 base DRUNK | Philosopher duplicates Dreamer | supported | supported | supported |
| V2 base active Vortox | base Vortox tenure | supported | supported | supported |
| V2 base DRUNK + active Vortox | Philosopher duplicates Dreamer while Vortox is active | supported | supported | supported |
| V2 gained normal | Philosopher choice/grant/V2 insertion | supported | supported | supported |
| V2 gained active Vortox | gained chain plus base Vortox tenure | supported | supported | supported |
| V2 source POISONED | no current canonical producer leaves resolving Dreamer/Philosopher source poisoned | not reachable | no fabricated history accepted | policy seam only |
| V2 gained source independently impaired | no current canonical producer | not reachable | no fabricated history accepted | policy seam only |
| Current Vortox impaired | no current canonical producer leaves a current Vortox impaired | not reachable | no fabricated history accepted | constraint seam only |
| Candidate shortage | fixed signed S&V catalog has sufficient candidates | not reachable in canonical product | corrupted history rejected | candidate seam only |

“Policy seam only” means the pure internal rule function is directly tested with exact values. It does not mean a synthetic `GameState` or fabricated accepted event stream may pass replay or application gates。

### Coverage claim

2B19 implements the semantic resolver for represented `POISONED`, gained-own impairment and impaired-Vortox values so future canonical producers need not reinterpret Dreamer rules. It does not implement those producers and does not claim those paths as end-to-end product behavior。

## legacyV1Boundary

The following exact V1 contracts remain byte-compatible:

- `DreamerTargetChosen`
- `DreamerInformationDelivered`
- `dreamer-information-model-v1`
- `dreamer-false-role-policy-v1`
- V1 target/delivery key sets
- V1 three-event batch
- V1 opportunity payload and ID
- V1 accepted replay and rebuild
- V1 state-only private projection
- V1 ledger evidence shape, rank, primary identity and ordering
- V1 unresolved Vortox classification

No optional V2 field may be added to a V1 payload.

### Existing V1 OPEN compatibility

An accepted V1 OPEN Dreamer opportunity may be completed only through the existing V1 event pair plus settlement when all of the following hold:

- it is a base Dreamer source;
- it remains the next unsettled task;
- source and target pass existing V1 validation;
- no current `vortox` character exists at settlement.

An accepted V1 OPEN opportunity is never upgraded to V2.

A current Vortox, conflicting Vortox identities or unavailable Vortox proof causes a retryable receipt-free failure before V1 events.

V1 gained execution remains `ApplicationNotConfigured`, receipt-free and event-free.

## v2CapabilityBoundary

V2 applies only to:

- a canonical `first-night-task-plan-v2`;
- base `DREAMER_ACTION`;
- `FirstNightTaskInsertedV2` gained `DREAMER_ACTION`;
- `FIRST_NIGHT`, day 0, night 1;
- the fixed validated S&V role catalog;
- currently represented role tenures and ability impairments;
- no-Traveller fixed twelve-player games;
- a complete validated accepted event stream.

V2 does not complete FIRST_NIGHT, enter DAY, implement another night, add a poison producer, add death, or begin Phase 2C.

## existingTypeAuthority

These existing types are imported unchanged:

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
import type { SeatNumber, PlayerRoster } from "./player-roster.js";
import type {
  GeneratedSetup,
  RoleCatalogSnapshot,
  RoleSetupSnapshot
} from "./setup-types.js";
import type {
  CurrentCharacterStateSet
} from "./current-character-state.js";
import type {
  AnyDomainEventEnvelope,
  DomainEventEnvelope,
  FirstNightTaskPlanCreatedPayload
} from "./events.js";
import type {
  FirstNightTaskPlan,
  FirstNightTaskProgress,
  ScheduledTask
} from "./first-night-task-plan.js";
import type {
  FirstNightActionOpportunityState
} from "./first-night-action-opportunity.js";
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
import type {
  MathematicianImpairmentEventProvenanceState
} from "./mathematician.js";
import type {
  RoleTenureState
} from "./seamstress.js";
import type { GamePhase } from "./game-phase.js";
import type { GameState } from "./game-state.js";
```

## versionConstants

```ts
export const DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION =
  "dreamer-first-night-action-v2" as const;

export const DREAMER_V2_RESOLUTION_CAPABILITY_VERSION =
  "dreamer-first-night-resolution-capability-v2" as const;

export const DREAMER_V2_SOURCE_CONTRACT_VERSION =
  "dreamer-source-contract-v2" as const;

export const DREAMER_V2_GAINED_ENTITLEMENT_VERSION =
  "dreamer-philosopher-gained-entitlement-v2" as const;

export const DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION =
  "dreamer-target-choice-v2" as const;

export const DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION =
  "dreamer-information-delivery-v2" as const;

export const DREAMER_V2_INFORMATION_MODEL_VERSION =
  "dreamer-information-model-v2" as const;

export const DREAMER_V2_RESOLUTION_MODEL_VERSION =
  "dreamer-resolution-model-v2" as const;

export const DREAMER_V2_CANDIDATE_DOMAIN_VERSION =
  "dreamer-candidate-domain-v2" as const;

export const DREAMER_V2_SIMULATION_POLICY_VERSION =
  "dreamer-smallest-legal-role-code-unit-v1" as const;

export const DREAMER_V2_INFORMATION_STAGE =
  "DREAMER_INFORMATION" as const;

export const DREAMER_V2_CANONICAL_CONTEXT_VERSION =
  "dreamer-canonical-context-v2" as const;

export const DREAMER_V2_PIPELINE_FINGERPRINT_VERSION =
  "dreamer-pipeline-state-fingerprint-v2" as const;

export const DREAMER_V2_PROJECTION_TRUST_VERSION =
  "dreamer-projection-trust-v2" as const;
```

## roleTenureAndAliveContract

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
```

An active tenure must be unique, acquired at or before the evaluated revision, and have no ended revision at or before that revision.

The current accepted FIRST_NIGHT event schema contains no death event and no alive-state mutation. Therefore every modeled player is alive throughout the supported 2B19 window. Vortox applicability uses this explicit current-schema invariant.

If a death-capable event or alive-state field is introduced later, Dreamer V2 must fail with `ALIVE_EVIDENCE_MODEL_UNSUPPORTED` until an exact alive-at-resolution proof is added. Current-role identity alone must not silently become a permanent substitute for alive evidence.

## sourceImpairmentContract

```ts
export type DreamerV2RepresentedImpairment = {
  readonly impairmentId: AbilityImpairmentId;
  readonly impairmentKind: "DRUNK" | "POISONED";
  readonly sourceKind:
    | "PHILOSOPHER_CHOSEN_DUPLICATE"
    | "SNAKE_CHARMER_DEMON_HIT";
  readonly sourcePlayerId: PlayerId;
  readonly affectedPlayerId: PlayerId;
  readonly affectedSeatNumber: SeatNumber;
  readonly affectedRoleId: RoleId;
  readonly affectedRole: RoleSetupSnapshot;
  readonly appliedCharacterStateRevision: number;
};

export type DreamerV2SourceEffectiveness =
  | {
      readonly kind: "EFFECTIVE";
      readonly representedImpairments: readonly [];
    }
  | {
      readonly kind: "KNOWN_DRUNK";
      readonly representedImpairments:
        readonly [DreamerV2RepresentedImpairment];
    }
  | {
      readonly kind: "KNOWN_POISONED";
      readonly representedImpairments:
        readonly [DreamerV2RepresentedImpairment];
    };
```

Applicability requires matching source player, seat, current source-holder role snapshot and a revision not later than settlement.

Exactly zero applicable impairments produces `EFFECTIVE`.

Exactly one produces `KNOWN_DRUNK` or `KNOWN_POISONED`.

More than one produces `MULTIPLE_APPLICABLE_SOURCE_IMPAIRMENTS` and fails closed. Dreamer does not introduce a new priority rule. This matches the existing Mathematician safety policy.

## baseV2Source

```ts
export type BaseDreamerV2SourceContract = {
  readonly sourceContractVersion:
    typeof DREAMER_V2_SOURCE_CONTRACT_VERSION;
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
  readonly abilityInstance:
    FirstNightAbilityInstanceProvenance & {
      readonly kind: "BASE_ROLE_TASK";
    };
};
```

Creation requirements:

- task is the next unsettled `DREAMER_ACTION`;
- plan is V2;
- task source kind is `ROLE`;
- base task ID uses the accepted base task grammar;
- task source, current source entry and active tenure identify one exact Dreamer;
- `sourceRole` and `abilityRole` are exact-equal Dreamer snapshots;
- ability instance is the canonical base task instance.

Settlement requirements:

- same player and seat remain present;
- current role remains exact-equal to the source Dreamer snapshot;
- the same tenure remains continuously active from opportunity revision through settlement revision;
- settlement revision is not earlier than opportunity revision;
- no source character-change gap is permitted.

Failure is `SOURCE_NO_LONGER_VALID`, receipt-free and event-free.

## gainedV2Source

```ts
export type DreamerV2GainedEntitlement = {
  readonly entitlementVersion:
    typeof DREAMER_V2_GAINED_ENTITLEMENT_VERSION;
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly schedulingVersion:
    "philosopher-gained-first-night-scheduling-v2";
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
  readonly originalOpportunityKind:
    "PHILOSOPHER_FIRST_NIGHT_ACTION";
  readonly originalOpportunityStatus: "CLOSED";
  readonly insertionEventType: "FirstNightTaskInsertedV2";
};

export type PhilosopherGainedDreamerV2SourceContract = {
  readonly sourceContractVersion:
    typeof DREAMER_V2_SOURCE_CONTRACT_VERSION;
  readonly kind: "PHILOSOPHER_GAINED_DREAMER_V2";
  readonly taskPlanVersion: "first-night-task-plan-v2";
  readonly schedulingVersion:
    "philosopher-gained-first-night-scheduling-v2";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly abilityRole: RoleSetupSnapshot;
  readonly sourceRoleTenure: DreamerV2RoleTenureSnapshot;
  readonly opportunityCharacterStateRevision: number;
  readonly gainedEntitlement: DreamerV2GainedEntitlement;
  readonly abilityInstance:
    FirstNightAbilityInstanceProvenance & {
      readonly kind: "PHILOSOPHER_GAINED_TASK_V2";
    };
};

export type DreamerV2SourceContract =
  | BaseDreamerV2SourceContract
  | PhilosopherGainedDreamerV2SourceContract;
```

The gained chain requires one exact closed original Philosopher opportunity, one choice, one grant, one V2 insertion and one canonical V2 ability-instance identity.

The holder remains `philosopher`; `abilityRole.roleId` and chosen role are `dreamer`.

The same Philosopher tenure must remain continuously active through settlement.

An impairment on a base Dreamer does not match this source. Only an impairment whose affected player, seat and role snapshot match the Philosopher holder can apply.

## opportunityGenerationAndParser

### Base task ID rule

Both V1 and V2 plans retain the accepted base task ID:

```text
first-night-v1:DREAMER_ACTION:seat-XX
```

The task ID does not select resolution capability.

Capability is selected by:

1. task-plan version;
2. accepted opportunity payload schema;
3. accepted opportunity ID generation;
4. event type.

For a V2 plan with no existing opportunity, application must create a V2 Dreamer opportunity. A base task’s V1 task ID must not cause creation of a V1 opportunity.

### Opportunity exact shape

```ts
export type DreamerActionOpportunityVisibilityV2 = {
  readonly visibilitySchemaVersion:
    typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly resolutionCapabilityVersion:
    typeof DREAMER_V2_RESOLUTION_CAPABILITY_VERSION;
  readonly canChooseTarget: true;
  readonly supportedDecisionKinds:
    readonly ["CHOOSE_PLAYER"];
  readonly targetSchema:
    "OTHER_NON_TRAVELLER_MODELED_PLAYER";
};

export type DreamerActionOpportunityV2 = {
  readonly opportunitySchemaVersion:
    typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind:
    "DREAMER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: "OPEN" | "CLOSED";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly sourceContract: DreamerV2SourceContract;
  readonly visibility:
    DreamerActionOpportunityVisibilityV2;
};
```

IDs:

```text
V2 base:
first-night-v2:DREAMER_ACTION:BASE:seat-XX:opportunity-01

V2 gained:
first-night-v2:PHILOSOPHER_GAINED:DREAMER_ACTION:seat-XX:from-dreamer:opportunity-01
```

### Parser exact union

```ts
export type ParsedFirstNightActionOpportunityId =
  | {
      readonly valid: true;
      readonly generation: "V1";
      readonly sourceKind: "BASE";
      readonly taskType:
        | "PHILOSOPHER_ACTION"
        | "SNAKE_CHARMER_ACTION"
        | "WITCH_ACTION"
        | "CERENOVUS_ACTION"
        | "DREAMER_ACTION"
        | "SEAMSTRESS_ACTION";
      readonly seatNumber: SeatNumber;
      readonly opportunityIndex: number;
    }
  | {
      readonly valid: true;
      readonly generation: "V1";
      readonly sourceKind: "PHILOSOPHER_GAINED";
      readonly taskType:
        | "SNAKE_CHARMER_ACTION"
        | "SEAMSTRESS_ACTION";
      readonly abilityRoleId:
        | "snake_charmer"
        | "seamstress";
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
  | {
      readonly valid: false;
      readonly reason: string;
    };
```

V1 parser branches retain their accepted grammar.

V2 parser rejects malformed padding, seat 0/13, non-positive index, extra segments, wrong role segment and case changes.

Replay selects V1 or V2 validator from the accepted opportunity payload exact shape and parsed generation. It never infers generation from the base task ID.

## targetAndCandidateDomain

```ts
export type DreamerV2TargetTruth = {
  readonly targetPlayerId: PlayerId;
  readonly targetSeatNumber: SeatNumber;
  readonly targetCharacterStateRevision: number;
  readonly targetTrueRole: RoleSetupSnapshot;
  readonly targetNativeSide: "GOOD" | "EVIL";
};

export type DreamerV2CandidateDomainSnapshot = {
  readonly candidateDomainVersion:
    typeof DREAMER_V2_CANDIDATE_DOMAIN_VERSION;
  readonly roleCatalogVersion: string;
  readonly roleCatalogSignature: string;
  readonly roleCatalogCanonicalSignature: string;
  readonly goodCandidates:
    readonly RoleSetupSnapshot[];
  readonly evilCandidates:
    readonly RoleSetupSnapshot[];
};

export type ResolveDreamerV2CandidatesInput = {
  readonly roleCatalogSnapshot: RoleCatalogSnapshot;
  readonly roleCatalogSignature: string;
  readonly targetTruth: DreamerV2TargetTruth;
  readonly sourceEffectiveness:
    DreamerV2SourceEffectiveness;
  readonly vortoxConstraint:
    DreamerV2VortoxConstraint;
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
      readonly candidateDomain:
        DreamerV2CandidateDomainSnapshot;
      readonly selectedGoodRole:
        RoleSetupSnapshot;
      readonly selectedEvilRole:
        RoleSetupSnapshot;
      readonly truthOutcome:
        "TARGET_INCLUDED" | "TARGET_EXCLUDED";
      readonly informationReliability:
        DreamerV2InformationReliability;
    }
  | {
      readonly kind: "DEPENDENCY_FAILURE";
      readonly failureCode:
        DreamerV2CandidateResolutionFailureCode;
      readonly message: string;
    };
```

Candidate arrays must be dense, exact, unique and code-unit sorted.

GOOD is Townsfolk/Outsider. EVIL is Minion/Demon.

Normal effective information includes the true role exactly once.

Impaired information without effective Vortox selects the lowest non-true candidate on the native side when present; otherwise it falls back to the true role. The opposite side selects its lowest candidate.

Effective Vortox filters the true role from both sides and fails if the required false candidate is unavailable.

Input order, locale, map order, random, clock and UUID cannot affect selection.

## vortoxInformation

```ts
export type DreamerV2VortoxConstraint =
  | {
      readonly kind:
        "NONE_NO_CURRENT_VORTOX";
      readonly evaluatedCharacterStateRevision: number;
      readonly aliveEvidence:
        "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT";
    }
  | {
      readonly kind:
        "NONE_CURRENT_VORTOX_KNOWN_IMPAIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly aliveEvidence:
        "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT";
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleSnapshot:
        RoleSetupSnapshot;
      readonly vortoxRoleTenure:
        DreamerV2RoleTenureSnapshot;
      readonly representedImpairments:
        readonly [DreamerV2RepresentedImpairment];
    }
  | {
      readonly kind:
        "VORTOX_FALSE_REQUIRED";
      readonly evaluatedCharacterStateRevision: number;
      readonly aliveEvidence:
        "FIRST_NIGHT_SCHEMA_HAS_NO_DEATH_EVENT";
      readonly vortoxPlayerId: PlayerId;
      readonly vortoxSeatNumber: SeatNumber;
      readonly vortoxRoleSnapshot:
        RoleSetupSnapshot;
      readonly vortoxRoleTenure:
        DreamerV2RoleTenureSnapshot;
    };
```

Resolver policy:

- zero current Vortox → `NONE_NO_CURRENT_VORTOX`;
- one current Vortox plus one unique active tenure:
  - zero applicable impairments → `VORTOX_FALSE_REQUIRED`;
  - one applicable impairment → `NONE_CURRENT_VORTOX_KNOWN_IMPAIRED`;
  - more than one → fail `VORTOX_EFFECTIVENESS_CONFLICT`;
- zero or multiple matching tenures → fail;
- multiple current Vortox identities → fail;
- any death-capable history → fail `ALIVE_EVIDENCE_MODEL_UNSUPPORTED`.

No impairment priority is invented.

The public Mathematician state-bound resolver and its result type remain unchanged.

## normalInformation

```text
selectedGoodRole.defaultAlignment = GOOD
selectedEvilRole.defaultAlignment = EVIL
exactly one selected roleId = targetTrueRole.roleId
truthOutcome = TARGET_INCLUDED
informationReliability = RULE_CORRECT
```

## impairedInformation

Without effective Vortox:

- DRUNK false → `DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS`;
- DRUNK true fallback → `DETERMINISTIC_TRUE_WITH_KNOWN_DRUNKENNESS`;
- POISONED false → `DETERMINISTIC_FALSE_WITH_KNOWN_POISONING`;
- POISONED true fallback → `DETERMINISTIC_TRUE_WITH_KNOWN_POISONING`.

POISONED paths are resolver-only in the current product because no canonical producer reaches them.

## vortoxPlusImpairment

When `vortoxConstraint.kind === "VORTOX_FALSE_REQUIRED"`:

```text
truthOutcome = TARGET_EXCLUDED
informationReliability = VORTOX_CONSTRAINED_FALSE
selectedGoodRole.roleId != targetTrueRole.roleId
selectedEvilRole.roleId != targetTrueRole.roleId
```

Source impairment remains hidden evidence. Ledger controlling cause is `VORTOX_FALSE_INFORMATION`.

## completeCanonicalContext

```ts
const canonicalDreamerV2ContextBrand: unique symbol =
  Symbol("canonicalDreamerV2ContextBrand");

type CanonicalDreamerV2Context = {
  readonly contextVersion:
    typeof DREAMER_V2_CANONICAL_CONTEXT_VERSION;
  readonly gameId: GameId;
  readonly rulesBaselineVersion: string;
  readonly phase: "FIRST_NIGHT";
  readonly dayNumber: 0;
  readonly nightNumber: 1;
  readonly evaluatedThroughEventSequence: number;
  readonly expectedTargetEventSequence: number;
  readonly firstNightInitializationProvenance:
    FirstNightInitializationEnvelopeProvenance;
  readonly setup: GeneratedSetup;
  readonly roster: PlayerRoster;
  readonly taskPlan: FirstNightTaskPlanCreatedPayload;
  readonly taskProgress: FirstNightTaskProgress;
  readonly targetTaskId: ScheduledTaskId;
  readonly targetTask: ScheduledTask;
  readonly requestedOpportunityId: ActionOpportunityId;
  readonly requestedTargetPlayerId: PlayerId;
  readonly currentCharacterState:
    CurrentCharacterStateSet;
  readonly roleTenures: RoleTenureState;
  readonly philosopherChoices:
    PhilosopherAbilityChoiceSet;
  readonly grants: GrantedAbilitySet;
  readonly insertions: FirstNightTaskInsertion;
  readonly opportunities:
    FirstNightActionOpportunityState;
  readonly abilityImpairments:
    AbilityImpairmentSet;
  readonly impairmentEventProvenance:
    MathematicianImpairmentEventProvenanceState;
  readonly existingTargetChoices:
    DreamerTargetChoiceSet;
  readonly existingDeliveries:
    DreamerInformationSet;
  readonly ledger:
    FirstNightAbilityOutcomeLedger;
  readonly [canonicalDreamerV2ContextBrand]: true;
};
```

`DreamerTargetChoiceSet` and `DreamerInformationSet` are defined below as exact V1/V2 unions.

Only two internal builders may attach the non-enumerable brand:

1. complete accepted-stream rebuild;
2. replay pre-event state for a received V2 event.

No public function accepts a caller-created `CanonicalDreamerV2Context`.

## pipelineFingerprint

```ts
export type DreamerV2PipelineStateFingerprint = {
  readonly fingerprintVersion:
    typeof DREAMER_V2_PIPELINE_FINGERPRINT_VERSION;
  readonly gameId: GameId;
  readonly gameVersion: number;
  readonly lastEventSequence: number;
  readonly phase: GamePhase;
  readonly dayNumber: number;
  readonly nightNumber: number;
  readonly setup: GeneratedSetup;
  readonly roster: PlayerRoster;
  readonly nextTask: ScheduledTask | null;
  readonly taskPlan: FirstNightTaskPlan;
  readonly taskProgress: FirstNightTaskProgress;
  readonly currentCharacterState:
    CurrentCharacterStateSet;
  readonly roleTenures: RoleTenureState;
  readonly philosopherChoices:
    PhilosopherAbilityChoiceSet;
  readonly grants: GrantedAbilitySet;
  readonly insertions: FirstNightTaskInsertion;
  readonly opportunities:
    FirstNightActionOpportunityState;
  readonly abilityImpairments:
    AbilityImpairmentSet;
  readonly impairmentEventProvenance:
    MathematicianImpairmentEventProvenanceState;
  readonly dreamerTargetChoices:
    DreamerTargetChoiceSet;
  readonly dreamerInformation:
    DreamerInformationSet;
  readonly ledger:
    FirstNightAbilityOutcomeLedger;
};
```

Every field is cloned canonical data. Pipeline and accepted-stream fingerprints must be canonical-data equal before decision output is used.

## commandsAndResolveInput

The public command remains:

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
```

No hidden information is accepted from the caller.

```ts
export type ResolveDreamerV2Input = {
  readonly acceptedEvents:
    readonly AnyDomainEventEnvelope[];
  readonly pipelineStateFingerprint:
    DreamerV2PipelineStateFingerprint;
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
  | "CANDIDATE_DOMAIN_UNAVAILABLE";

export type InternalDreamerV2Resolution =
  | {
      readonly kind: "READY";
      readonly rebuiltState: GameState;
      readonly rebuiltStateFingerprint:
        DreamerV2PipelineStateFingerprint;
      readonly sourceContract:
        DreamerV2SourceContract;
      readonly targetTruth:
        DreamerV2TargetTruth;
      readonly candidateResolution:
        Extract<
          DreamerV2CandidateResolution,
          { readonly kind: "READY" }
        >;
      readonly sourceEffectiveness:
        DreamerV2SourceEffectiveness;
      readonly vortoxConstraint:
        DreamerV2VortoxConstraint;
      readonly settlementCharacterStateRevision: number;
    }
  | {
      readonly kind: "DEPENDENCY_FAILURE";
      readonly failureKind:
        DreamerV2ResolutionFailureKind;
      readonly message: string;
    };
```

The resolver clones and validates `acceptedEvents`, rebuilds state, constructs the private branded context, compares the full fingerprint, and derives the result exclusively from that context.

## events

Strategy A is final: new event types.

```ts
export type DreamerV2TargetChoiceId =
  string & {
    readonly __brand: "DreamerV2TargetChoiceId";
  };

export type DreamerV2DeliveryId =
  string & {
    readonly __brand: "DreamerV2DeliveryId";
  };
```

IDs:

```text
dreamer-target-choice-v2:<taskId>
dreamer-delivery-v2:<taskId>
```

Both parser/formatter pairs validate the canonical base or gained task ID and require exact round-trip.

```ts
export type DreamerTargetChosenV2Payload = {
  readonly rulesBaselineVersion: string;
  readonly targetChoiceSchemaVersion:
    typeof DREAMER_V2_TARGET_CHOICE_SCHEMA_VERSION;
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
  readonly deliverySchemaVersion:
    typeof DREAMER_V2_INFORMATION_DELIVERY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly targetChoiceId: DreamerV2TargetChoiceId;
  readonly deliveryId: DreamerV2DeliveryId;
  readonly sourceContract: DreamerV2SourceContract;
  readonly targetTruth: DreamerV2TargetTruth;
  readonly candidateDomain:
    DreamerV2CandidateDomainSnapshot;
  readonly selectedGoodRole: RoleSetupSnapshot;
  readonly selectedEvilRole: RoleSetupSnapshot;
  readonly truthOutcome:
    "TARGET_INCLUDED" | "TARGET_EXCLUDED";
  readonly sourceEffectiveness:
    DreamerV2SourceEffectiveness;
  readonly vortoxConstraint:
    DreamerV2VortoxConstraint;
  readonly informationReliability:
    DreamerV2InformationReliability;
  readonly resolutionModelVersion:
    typeof DREAMER_V2_RESOLUTION_MODEL_VERSION;
  readonly simulationPolicyVersion:
    typeof DREAMER_V2_SIMULATION_POLICY_VERSION;
  readonly knowledgeModelVersion:
    typeof DREAMER_V2_INFORMATION_MODEL_VERSION;
  readonly knowledgeStage:
    typeof DREAMER_V2_INFORMATION_STAGE;
  readonly settlementCharacterStateRevision: number;
};
```

```ts
export type DreamerTargetChoice =
  | DreamerTargetChosenPayload
  | DreamerTargetChosenV2Payload;

export type DreamerInformationDelivery =
  | DreamerInformationDeliveredPayload
  | DreamerInformationDeliveredV2Payload;

export type DreamerTargetChoiceSet = {
  readonly choices: readonly DreamerTargetChoice[];
};

export type DreamerInformationSet = {
  readonly deliveries:
    readonly DreamerInformationDelivery[];
};
```

`DomainEventPayloadByType` adds only:

```ts
readonly DreamerTargetChosenV2:
  DreamerTargetChosenV2Payload;
readonly DreamerInformationDeliveredV2:
  DreamerInformationDeliveredV2Payload;
```

The existing Mathematician event map entry is unchanged.

## eventVersioning

Envelope `eventVersion` is unchanged.

V1 event types accept only V1 exact payloads.

V2 event types accept only V2 exact payloads.

V1/V2 state unions branch on event type during apply and on exact schema discriminator during stored validation.

A V1 payload in a V2 event, a V2 payload in a V1 event, missing fields, extra fields or wrong versions are rejected.

## batchSemantics

A successful V2 command emits exactly:

```ts
export type DreamerV2ProspectiveEventTuple = readonly [
  DomainEventEnvelope<"DreamerTargetChosenV2">,
  DomainEventEnvelope<"DreamerInformationDeliveredV2">,
  DomainEventEnvelope<"ScheduledTaskSettled">
];
```

The three events share game, batch, command, version, timestamp, correlation, causation and rules baseline. Their sequences are consecutive.

Task, opportunity, source contract, target, target-choice ID and settlement revision cross-link exactly.

Settlement remains:

```text
taskType = DREAMER_ACTION
outcomeType = DREAMER_INFORMATION_DELIVERED
characterStateRevision =
  delivery.settlementCharacterStateRevision
```

Naked, reversed, duplicated, V1/V2 mixed-within-one-task, or phase-transition-containing batches are invalid.

A V1 batch remains the accepted V1 three-event batch.

## prospectiveValidation

```ts
export type ValidateProspectiveDreamerV2TripletInput = {
  readonly priorAcceptedEvents:
    readonly AnyDomainEventEnvelope[];
  readonly pipelineStateFingerprint:
    DreamerV2PipelineStateFingerprint;
  readonly events:
    DreamerV2ProspectiveEventTuple;
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
  | {
      readonly valid: true;
      readonly prospectiveStateFingerprint:
        DreamerV2PipelineStateFingerprint;
    }
  | {
      readonly valid: false;
      readonly code:
        DreamerV2ProspectiveValidationFailureCode;
      readonly reason: string;
    };
```

The validator:

1. resolves a new READY decision from `priorAcceptedEvents`;
2. compares the supplied pipeline fingerprint;
3. compares the exact target, delivery and settlement payloads with the READY result;
4. validates all envelope metadata and exact sequence;
5. runs generic batch validation;
6. validates the prospective complete stream;
7. rebuilds the prospective state;
8. independently applies the three events;
9. compares full fingerprints;
10. verifies exactly one new V2 terminal fact after delivery and no second fact at settlement.

Any failure is retryable, receipt-free and event-free.

## storedValidation

```ts
export type DreamerV2DeliveryCheckpoint = {
  readonly targetEventIndex: number;
  readonly deliveryEventIndex: number;
  readonly settlementEventIndex: number;
  readonly preTargetStateFingerprint:
    DreamerV2PipelineStateFingerprint;
  readonly targetEvent:
    DomainEventEnvelope<"DreamerTargetChosenV2">;
  readonly stateAfterTargetFingerprint:
    DreamerV2PipelineStateFingerprint;
  readonly deliveryEvent:
    DomainEventEnvelope<"DreamerInformationDeliveredV2">;
  readonly stateAfterDeliveryFingerprint:
    DreamerV2PipelineStateFingerprint;
  readonly settlementEvent:
    DomainEventEnvelope<"ScheduledTaskSettled">;
  readonly stateAfterSettlementFingerprint:
    DreamerV2PipelineStateFingerprint;
};

export type ValidateStoredDreamerV2Input = {
  readonly acceptedEvents:
    readonly AnyDomainEventEnvelope[];
  readonly checkpoint:
    DreamerV2DeliveryCheckpoint;
  readonly finalStateFingerprint:
    DreamerV2PipelineStateFingerprint;
};

export type StoredDreamerV2ValidationResult =
  | {
      readonly valid: true;
    }
  | {
      readonly valid: false;
      readonly reason: string;
    };
```

There is no partial state-facts input.

The validator clones and validates the complete accepted stream, confirms the three exact indexes are consecutive in one batch, rebuilds every checkpoint, compares every fingerprint, validates the canonical source context and confirms the final state still contains exactly one matching target, delivery, settlement and ledger fact.

All required provenance comes from:

- accepted envelopes;
- first-night initialization provenance;
- signed setup/catalog;
- roster;
- complete task plan/progress;
- current character history as reconstructed at each event;
- role tenures;
- impairment records and event provenance;
- Philosopher choices, grants and insertions;
- both action opportunities;
- existing Dreamer choices/deliveries;
- terminal ledger.

A caller-supplied standalone payload or `GameState` cannot authenticate V2 history.

## exactShapeValidation

All V2 validators require:

- plain canonical objects;
- exact enumerable key sets;
- no symbol or accessor input;
- safe finite integers;
- dense arrays;
- unique IDs;
- canonical code-unit order;
- exact snapshots;
- ID parser/formatter round-trip;
- complete cross-links;
- no raw JSON semantic comparison;
- no locale-sensitive comparison.

## ledgerAdapter

### New terminal and evidence variants

```ts
export type DreamerV2ActionOpportunityEvidence = {
  readonly kind:
    "DREAMER_V2_ACTION_OPPORTUNITY";
  readonly opportunityVersion:
    "first-night-action-opportunity-v2";
  readonly opportunitySchemaVersion:
    typeof DREAMER_V2_OPPORTUNITY_SCHEMA_VERSION;
  readonly nightNumber: 1;
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind:
    "DREAMER_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: "OPEN";
  readonly taskId: ScheduledTaskId;
  readonly taskType: "DREAMER_ACTION";
  readonly sourceKind:
    | "BASE_DREAMER_V2"
    | "PHILOSOPHER_GAINED_DREAMER_V2";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly abilityInstanceId:
    FirstNightAbilityInstanceId;
};

export type DreamerV2DeliveryEvidence = {
  readonly kind: "DREAMER_V2_DELIVERY";
  readonly deliveryId: DreamerV2DeliveryId;
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly sourcePlayerId: PlayerId;
  readonly abilityInstanceId:
    FirstNightAbilityInstanceId;
  readonly targetPlayerId: PlayerId;
  readonly targetTrueRoleId: RoleId;
  readonly deliveredGoodRoleId: RoleId;
  readonly deliveredEvilRoleId: RoleId;
  readonly candidateDomainVersion:
    typeof DREAMER_V2_CANDIDATE_DOMAIN_VERSION;
  readonly roleCatalogSignature: string;
  readonly informationReliability:
    DreamerV2InformationReliability;
  readonly vortoxConstraintKind:
    DreamerV2VortoxConstraint["kind"];
  readonly terminalEventId: EventId;
};
```

`TerminalAbilityOutcomeEventType` adds `DreamerInformationDeliveredV2`.

`AbilityOutcomeEvidenceReference` adds the two new variants. Existing variants are unchanged.

### Frozen rank and primary identity

Legacy ranks remain exactly:

```text
0 SOURCE_EVENT
1 TASK
2 ACTION_OPPORTUNITY
3 ABILITY_IMPAIRMENT
4 ROLE_TENURE
5 CHARACTER_STATE
6 PLAYER_ROLE_AT_REVISION
7 PHILOSOPHER_GRANT
8 FIRST_NIGHT_TASK_INSERTION
9 SNAKE_CHARMER_RESOLUTION
10 EVIL_TWIN_PAIR
11 WITCH_PENDING_MARKER
12 CERENOVUS_INSTRUCTION
13 CLOCKMAKER_DELIVERY
14 DREAMER_DELIVERY
15 SEAMSTRESS_DELIVERY
16 MATHEMATICIAN_DELIVERY
```

New generic ranks are appended:

```text
17 DREAMER_V2_ACTION_OPPORTUNITY
18 DREAMER_V2_DELIVERY
```

Primary identities:

```text
DREAMER_V2_ACTION_OPPORTUNITY -> opportunityId
DREAMER_V2_DELIVERY -> deliveryId
```

No legacy rank shifts. V1 canonical arrays remain byte-for-byte and order-for-order unchanged.

### V2 slot order

Dreamer V2 uses a dedicated slot sorter before duplicate-primary validation:

```text
1  SOURCE_EVENT
2  TASK
3  DREAMER_V2_ACTION_OPPORTUNITY
4  CHARACTER_STATE
5  source PLAYER_ROLE_AT_REVISION
6  source ROLE_TENURE
7  target PLAYER_ROLE_AT_REVISION
8  source ABILITY_IMPAIRMENT
9  Vortox PLAYER_ROLE_AT_REVISION
10 Vortox ROLE_TENURE
11 Vortox ABILITY_IMPAIRMENT
12 original Philosopher ACTION_OPPORTUNITY
13 PHILOSOPHER_GRANT
14 FIRST_NIGHT_TASK_INSERTION
15 DREAMER_V2_DELIVERY
```

Slot 8 exists only for one source impairment.

Slots 9–10 exist for either active or known-impaired current Vortox.

Slot 11 exists only for known-impaired Vortox.

Slots 12–14 exist only for gained V2.

Base and gained both require exactly one source tenure.

No unlisted evidence kind is legal for a V2 Dreamer fact.

### Ledger classification

| Delivery | outcomeStatus | causeKind | causedByAnotherCharacterAbility |
|---|---|---|---|
| RULE_CORRECT | NORMAL | NO_OTHER_CHARACTER_ABILITY | false |
| impaired true fallback | NORMAL | NO_OTHER_CHARACTER_ABILITY | false |
| drunk false | ABNORMAL | SOURCE_DRUNKENNESS | true |
| poisoned false | ABNORMAL | SOURCE_POISONING | true |
| Vortox false | ABNORMAL | VORTOX_FALSE_INFORMATION | true |

A valid V2 delivery never produces Dreamer Vortox `UNRESOLVED`; unavailable proof prevents event creation.

The ability instance is independently reconstructed from task/grant/insertion history and compared with source contract and both new evidence variants.

The 2B18B Mathematician event contract remains unchanged. It consumes the resulting ledger fact through existing fields.

## privateProjectionTrust

```ts
const trustedDreamerV2ProjectionBrand: unique symbol =
  Symbol("trustedDreamerV2ProjectionBrand");

type TrustedDreamerV2ProjectionState = {
  readonly trustVersion:
    typeof DREAMER_V2_PROJECTION_TRUST_VERSION;
  readonly finalState: GameState;
  readonly checkpoints:
    readonly DreamerV2DeliveryCheckpoint[];
  readonly [trustedDreamerV2ProjectionBrand]: true;
};
```

Only the internal complete-stream replay function can attach the non-enumerable brand.

It:

1. clones and validates the accepted event stream;
2. validates every batch;
3. captures every V2 Dreamer checkpoint;
4. validates every checkpoint through `ValidateStoredDreamerV2Input`;
5. brands the final state only after all checks pass.

The projection package imports this internal function directly. No public caller can construct or pass the branded object.

### State-only behavior

`buildPlayerPrivateKnowledgeView(state, viewer)`:

- remains supported for V1-only Dreamer state;
- fails `PrivateKnowledgeUnavailable` if any of these contain V2:
  - Dreamer V2 opportunity;
  - `DreamerTargetChosenV2Payload`;
  - `DreamerInformationDeliveredV2Payload`;
- does not infer V2 from settlement alone;
- preserves existing Mathematician state-only restrictions.

### Accepted-stream behavior

`buildPlayerPrivateKnowledgeViewFromAcceptedEventStream` supports:

- V1-only history;
- V2-only history;
- V1 and V2 in different valid task batches;
- never V1 and V2 for the same task/opportunity.

For one viewer:

- zero Dreamer deliveries → no Dreamer information;
- exactly one validated V1 or V2 delivery → project it;
- more than one validated Dreamer delivery → fail closed.

Different source viewers may each own one delivery.

AI accepted-stream projection calls the same trusted player builder.

### Exposed V2 view

```ts
export type PlayerDreamerInformationViewV2 = {
  readonly target: {
    readonly playerId: PlayerId;
    readonly seatNumber: SeatNumber;
  };
  readonly goodRole: RoleSetupSnapshot;
  readonly evilRole: RoleSetupSnapshot;
};

export type PlayerDreamerV2ProjectionFields = {
  readonly dreamerInformation:
    PlayerDreamerInformationViewV2;
  readonly dreamerKnowledgeModelVersion:
    typeof DREAMER_V2_INFORMATION_MODEL_VERSION;
};
```

Only target, two roles, model and existing stage are exposed.

Source contract, candidate domain, truth, reliability, impairment, Vortox, grant, insertion and ledger cause remain hidden.

Historical projection uses stored delivery and never recomputes from later state.

## replay

- V1 accepted events use unchanged V1 validation.
- V2 events use branded canonical pre-event context.
- Opportunity payload schema and event type select generation.
- Base V1 task grammar does not select V1 resolution.
- Accepted V1 OPEN completion remains V1.
- New V2-plan opportunity creation is V2.
- V1/V2 mixing for one task is rejected.
- Candidate, reliability, source, tenure, Vortox and evidence tampering are rejected.
- Complete stream validation precedes trusted projection.
- Windows and Ubuntu must produce identical IDs, ordering, candidates, payloads and evidence arrays.

## receiptBoundary

Recorded deterministic rejections:

- invalid command shape;
- unknown task/opportunity;
- closed opportunity;
- actor mismatch;
- task not next;
- target missing;
- target is source;
- invalid phase.

Receipt-free retryable failures:

- incomplete or conflicting accepted history;
- pipeline fingerprint mismatch;
- invalid gained chain;
- source continuity loss;
- multiple source impairments;
- Vortox identity/tenure/effectiveness conflict;
- unsupported alive evidence;
- candidate failure;
- V1 gained;
- V1 current Vortox;
- metadata failure;
- prospective failure.

V2 dependency failures use:

```text
status = failed
code = DependencyExecutionFailed
failureStage = first-night-role-action
retryable = true
```

V1 gained may use `ApplicationNotConfigured`.

No failure writes an accepted or rejected receipt unless it is one of the listed deterministic command rejections.

## failureBoundary

Source, target, tenure, impairment, Vortox, candidate and pipeline decisions complete before metadata generation.

No partial event append, settlement, ledger fact, receipt or version increment is allowed.

Missing evidence never falls back to model memory, current final state, V1 shape or another role’s resolver.

## tests

The original D19-001–D19-074 matrix remains mandatory. The layer and direct production entry are frozen below.

| ID range | Layer | Direct production entry |
|---|---|---|
| D19-001–002 | application accepted-stream | `SubmitDreamerAction` → complete-stream V2 resolver |
| D19-003 | application accepted-stream | base Dreamer canonical DRUNK producer |
| D19-004 | domain policy seam | candidate resolver with exact POISONED input |
| D19-005–007 | application accepted-stream | V2 resolver and triplet |
| D19-008 | domain policy seam | Vortox-plus-POISONED candidate resolver |
| D19-009 | domain candidate seam | candidate resolver failure; application mapping separately asserted |
| D19-010–020 | application/replay | V2 opportunity and gained-chain validators |
| D19-021 | domain policy seam | gained-source effectiveness policy; not accepted-stream E2E |
| D19-022–025 | application accepted-stream | gained resolver and scheduler |
| D19-026–031 | replay/application compatibility | V1/V2 exact discriminators |
| D19-032–040 | domain candidate seam | shared candidate resolver |
| D19-041–053 | batch/replay/prospective | V2 triplet validators |
| D19-054–060 | ledger | V2 terminal adapter and existing Math consumer |
| D19-061–068 | projection | trusted accepted-stream and state-only boundaries |
| D19-069–073 | regression | existing role suites |
| D19-074 | CI | Windows/Ubuntu canonical output gate |

D19-004, D19-008, D19-009 and D19-021 must not construct or claim a valid accepted event stream.

### Original 74 semantic assertions

| ID | Assertion |
|---|---|
| D19-001 | normal GOOD target contains exact true GOOD role |
| D19-002 | normal EVIL target contains exact true EVIL role |
| D19-003 | canonical base DRUNK selects false when alternative exists |
| D19-004 | POISONED policy selects false when alternative exists |
| D19-005 | active Vortox GOOD target excludes true role |
| D19-006 | active Vortox EVIL target excludes true role |
| D19-007 | active Vortox plus canonical base DRUNK is Vortox-constrained false |
| D19-008 | active Vortox plus POISONED policy is Vortox-constrained false |
| D19-009 | candidate shortage returns dependency failure and maps to zero mutation |
| D19-010 | gained V2 opportunity exact creation |
| D19-011 | matching gained Human submission |
| D19-012 | matching gained AI submission |
| D19-013 | non-source actor rejection |
| D19-014 | missing grant fail closed |
| D19-015 | missing insertion fail closed |
| D19-016 | original Philosopher opportunity mismatch fail closed |
| D19-017 | terminal gained opportunity mismatch fail closed |
| D19-018 | role segment mismatch rejected |
| D19-019 | gained revision mismatch rejected |
| D19-020 | base Dreamer impairment does not affect gained source |
| D19-021 | gained-own impairment policy applies only to holder |
| D19-022 | gained normal information |
| D19-023 | gained active-Vortox information |
| D19-024 | base before gained |
| D19-025 | multiple gained seat/task order |
| D19-026 | V1 accepted replay unchanged |
| D19-027 | V1 exact shape unchanged |
| D19-028 | accepted V1 OPEN no-Vortox compatibility |
| D19-029 | new V1 current-Vortox command fails closed |
| D19-030 | V1 gained settlement unsupported |
| D19-031 | one-task V1/V2 batch mixing rejected |
| D19-032 | exact GOOD domain |
| D19-033 | exact EVIL domain |
| D19-034 | code-unit ordering |
| D19-035 | normal path preserves target truth |
| D19-036 | Vortox path excludes target truth |
| D19-037 | sparse candidates rejected |
| D19-038 | duplicate candidates rejected |
| D19-039 | unknown catalog role rejected |
| D19-040 | input order independent |
| D19-041 | valid V2 triplet accepted |
| D19-042 | naked target rejected |
| D19-043 | naked delivery rejected |
| D19-044 | naked settlement rejected |
| D19-045 | reversed triplet rejected |
| D19-046 | source mismatch rejected |
| D19-047 | target mismatch rejected |
| D19-048 | candidate tamper rejected |
| D19-049 | reliability tamper rejected |
| D19-050 | Vortox constraint tamper rejected |
| D19-051 | extra fields rejected |
| D19-052 | duplicate delivery rejected |
| D19-053 | mixed PhaseTransitioned rejected |
| D19-054 | ledger normal classification |
| D19-055 | ledger DRUNK false classification |
| D19-056 | ledger POISONED false policy classification |
| D19-057 | ledger Vortox false classification |
| D19-058 | valid V2 never emits Vortox unresolved |
| D19-059 | gained ledger source is Philosopher holder |
| D19-060 | Math consumes fact without event-contract change |
| D19-061 | base source-only projection |
| D19-062 | gained source-only projection |
| D19-063 | other player cannot see delivery |
| D19-064 | AI boundary equals player boundary |
| D19-065 | Vortox evidence hidden |
| D19-066 | impairment evidence hidden |
| D19-067 | correctness hidden |
| D19-068 | later state does not rewrite history |
| D19-069 | existing 2B18B suite green |
| D19-070 | Clockmaker unchanged |
| D19-071 | Seamstress unchanged |
| D19-072 | Mathematician unchanged |
| D19-073 | Philosopher V1/V2 unchanged |
| D19-074 | cross-platform canonical equality |

### Additional stable tests

| ID | Layer | Direct production entry | Assertion |
|---|---|---|---|
| D19-075 | domain candidate | candidate resolver | impaired no-Vortox true fallback |
| D19-076 | domain constraint | Vortox constraint seam | exact impaired-current-Vortox value; explicitly not E2E |
| D19-077 | application accepted-stream | complete-stream resolver | missing Vortox tenure fails |
| D19-078 | application accepted-stream | complete-stream resolver | conflicting Vortox identities fail |
| D19-079 | domain candidate | target truth resolver | alignment-only change does not change answer |
| D19-080 | application accepted-stream | target truth resolver | pre-resolution character change uses current role |
| D19-081 | projection | trusted replay | post-delivery character change does not rewrite |
| D19-082 | domain candidate | candidate resolver | in-play false role remains legal |
| D19-083 | domain parser | opportunity/choice/delivery parsers | hostile IDs rejected |
| D19-084 | domain exact shape | all V2 validators | accessor, symbol, sparse and extra-key inputs rejected |
| D19-085 | application | receipt boundary | receipt-free failure permits same command-ID retry |
| D19-086 | application/prospective | metadata and triplet validators | no partial mutation on either failure |
| D19-087 | projection | state-only and accepted-stream builders | V2 state-only fails, trusted stream succeeds |
| D19-088 | ledger | V2 fact derivation | base/gained/Vortox evidence slots exact |
| D19-089 | ledger regression | V1 fact derivation | V1 evidence bytes/order unchanged |
| D19-090 | replay reachability | complete-stream validator | fabricated poison/gained-own/Vortox-impaired history rejected |
| D19-091 | domain constraint | alive-evidence gate | death-capable history fails unsupported |
| D19-092 | application accepted-stream | source continuity | base role/seat/tenure discontinuity fails |
| D19-093 | application/opportunity | V2 opener | V1 base task ID produces V2 capability on V2 plan |
| D19-094 | ledger canonicalization | rank and slot sorters | legacy ranks fixed; V2 ranks and primary IDs exact |
| D19-095 | projection | trusted mixed-history replay | valid cross-task V1/V2 allowed; same-task or same-viewer duplicate fails |

`docs/implementation/phase-3-slice-2b19-test-traceability.md` must map D19-001–095 to exact test file, test title, layer and production entry.

## explicitOutOfScope

- other-night Dreamer;
- complete FIRST_NIGHT;
- DAY;
- general dawn reset;
- Traveller;
- registration;
- free Storyteller choice;
- general poison producer;
- gained-source impairment producer;
- Vortox impairment producer;
- death or alive-state engine;
- UI, Electron or SQLite;
- AI strategy;
- Phase 2C;
- V1 payload migration;
- Mathematician event changes;
- role status `COMPLETE`.

## documentationCloseout

The feature branch must:

- update README so it no longer says 2B18B is unstarted;
- replace stale CURRENT_TASK 2B18B closeout instructions with accurate 2B19 state;
- update AUTOPILOT state/log and PROJECT_STATE;
- update ROLE_COVERAGE_MATRIX for Dreamer base/gained V2, represented DRUNK, semantic POISON policy, active Vortox, historical projection and character-change timing;
- distinguish canonical E2E support from resolver-only policy;
- keep Dreamer, Philosopher, Vortox and Mathematician `PARTIAL`.

No separate main documentation commit is permitted.

## completionCriteria

1. Independent Round 2 review returns `RULE_DESIGN_PASS`.
2. Branch is created only after that verdict.
3. Branch is `phase-3/dreamer-v2-completion`.
4. V1 exact payload, replay, opportunity compatibility and ledger bytes/order remain unchanged.
5. New V2-plan base opportunity is selected despite the accepted V1 base task ID grammar.
6. V2 base and gained source chains are exact and continuous through settlement.
7. Active Vortox, canonical base DRUNK and their combination execute end to end.
8. POISONED, gained-own impairment and impaired-Vortox semantics are tested only at their declared pure seams.
9. Fabricated accepted streams cannot make resolver-only paths look supported.
10. V2 target/delivery/settlement triplet is atomic.
11. Complete accepted-stream, pipeline fingerprint, prospective and stored inputs are implemented exactly.
12. Ledger new ranks, primary identities and V2 slots are exact; V1 order is unchanged.
13. Trusted projection cannot be forged.
14. D19-001–095 have direct traceability.
15. 2B18B Mathematician event contract remains unchanged.
16. README and CURRENT_TASK drift are corrected on the feature branch.
17. Dreamer remains `PARTIAL`.
18. FIRST_NIGHT is not completed, DAY is not entered and Phase 2C is not started.
19. Typecheck, lint, full tests, coverage and diff check pass.
20. Frozen exact-head CI passes before final review.
21. Final independent review returns both required pass verdicts with no blockers.
22. Passing review is followed by no new feature commit.
23. GitHub audit comments, merge, accepted tag and closeout obey `REVIEW_PROTOCOL.md`.

## coverageStatus

`PARTIAL`

Unimplemented coverage includes other-night Dreamer, Travellers, registration, free Storyteller choice, general poison and impairment production, death/alive mechanics, broader lifecycle interactions and full first-night completion.

READY_FOR_RULE_DESIGN_REVIEW_ROUND_2
