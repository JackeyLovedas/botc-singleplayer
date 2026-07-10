# Phase 3 Slice 2B16 Design — Cerenovus First-Night Skeleton

## Provenance

- Design authority: `docs/rules/evidence/2B16.md`.
- Evidence SHA-256: `1ee54550a4e886e27e6f665c2275f21d4d04b5d67c68eab3f1bdd598cc0594ca`.
- Rule-research verdict: `RULE_READY`.
- Repository baseline: `00c3c01e35b2a117db28a72e007e6c7079bb9990`.
- Baseline CI: run `29098986989`, green.
- This design is deliberately bounded to the first-night Cerenovus choice, represented effective/impaired settlement, canonical target notification, replay-safe storage, and private projection. It does not implement actual madness judgment, enforcement, execution, death, or lifecycle processing.

## ruleClaims

1. The Cerenovus acts on the first night.
2. The Cerenovus chooses one player and one Townsfolk or Outsider character shown on the current script; the character need not be assigned or in play.
3. The selected player privately learns that the Cerenovus selected them and learns the selected character.
4. For an effective first-night selection, the sourced natural window is day 1 and the following night, ending on entry to `DAWN_RESOLUTION(dayNumber=1, nightNumber=2)`.
5. The sourced requirement can end earlier if the exact source ability instance permanently ends. A later Cerenovus tenure or ability instance is a new identity and cannot resume the earlier requirement.
6. A drunk or poisoned Cerenovus still performs a normal-looking legal choice.
7. A target selected by a drunk or poisoned Cerenovus receives the same private notification as a target selected by an effective Cerenovus.
8. Impairment at settlement creates no real requirement, marker authority, enforcement authority, or execution authority.
9. Official raw first-night order is `witch -> cerenovus -> fearmonger`.
10. Official raw other-night order is `witch -> cerenovus -> pithag`; the human label for `pithag` is “Pit-Hag.”
11. This slice records only the bounded first-night choice, represented settlement, historical requirement-at-creation metadata, notification, and settlement chain. It does not execute duration expiry, source-loss termination, madness judgment, enforcement, execution, death, or general lifecycle behavior.

## invariants

- Domain events remain canonical truth; projections are rebuildable.
- One accepted Cerenovus command appends one atomic four-event batch.
- Effective and impaired accepted branches expose the same accepted-response shape, event count, and ordered event-type list.
- The command uses the repository’s generic `CommandEnvelope<TPayload>` contract and places `commandType`, task, opportunity, and decision under `payload`.
- Only a `human` or `ai` actor whose `playerId` equals the opportunity source player may submit the choice. `storyteller` and `system` actors are rejected with `ActorNotAllowed`; this command has no privileged transport mode.
- The real scheduled-task source contract is `task.source.kind === "ROLE"` with a complete `task.source.role` snapshot. Player, seat, role snapshot, opportunity, role-tenure identity, ability-instance identity, opportunity revision, and settlement revision must form one exact chain.
- The notification payload is derived only from the recorded choice, never from the effective/impaired resolution variant.
- The target notification is identical across effective, drunk, and poisoned source branches.
- Impaired resolution cannot contain requirement, marker, duration, enforcement, execution, death, or lifecycle fields.
- An effective resolution records only historical requirement creation facts and exact temporal anchors; it does not activate a general effect runtime.
- An effective creation record is bound to one immutable `sourceRoleTenureId` and one immutable `sourceAbilityInstanceId`.
- The requirement’s fixed natural interval covers day 1 and the following night and ends at entry to `DAWN_RESOLUTION(dayNumber=1, nightNumber=2)`.
- Permanent end of the referenced source ability instance caps the requirement before its natural end. A later reacquisition has a different tenure and ability-instance ID and never resumes the old requirement.
- This slice records those dependency semantics but introduces no active-effect query, termination event, suppression/resumption engine, enforcement engine, or execution authority.
- The chosen character is validated against the script catalog and must have the Townsfolk or Outsider type. It need not be assigned or in play.
- The chosen target must be a modeled roster player. Self-selection is legal.
- Only the base scheduled Cerenovus task is supported. No gained-ability source is inferred.
- Private projection requires one complete, globally unique, closed historical chain: opportunity, choice, represented resolution, notification, and matching task settlement.
- Stored facts are validated before projection; later character or impairment state does not rewrite delivered knowledge.
- Canonical identifiers and ordering are deterministic and locale-independent.

## domainTypes

Add the following literal model versions:

```ts
export const CERENOVUS_CHOICE_MODEL_VERSION = "cerenovus-choice-v1";
export const CERENOVUS_RESOLUTION_MODEL_VERSION = "cerenovus-resolution-v1";
export const CERENOVUS_REQUIREMENT_MODEL_VERSION =
  "cerenovus-madness-requirement-creation-v1";
export const CERENOVUS_DURATION_MODEL_VERSION =
  "cerenovus-first-night-duration-v1";
export const CERENOVUS_PRIVATE_NOTIFICATION_MODEL_VERSION =
  "cerenovus-private-notification-v1";
export const CERENOVUS_INFORMATION_STAGE = "CERENOVUS_INFORMATION";
```

The decision is exactly:

```ts
type CerenovusActionDecision = {
  readonly kind: "CHOOSE_PLAYER_AND_CHARACTER";
  readonly targetPlayerId: PlayerId;
  readonly chosenRoleId: RoleId;
};
```

Add a Cerenovus opportunity visibility contract:

```ts
type CerenovusActionOpportunityVisibility = {
  readonly canChooseTarget: true;
  readonly canChooseCharacter: true;
  readonly supportedDecisionKinds: readonly [
    "CHOOSE_PLAYER_AND_CHARACTER"
  ];
  readonly targetSchema: "ANY_MODELED_ROSTER_PLAYER";
  readonly characterSchema: "ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER";
};
```

Add the exact source opportunity contract:

```ts
type CerenovusAbilitySourceDescriptor = {
  readonly kind: "ROLE_TENURE";
  readonly abilityRoleId: "cerenovus";
  readonly roleTenureId: RoleTenureId;
  readonly acquiredCharacterStateRevision: number;
};

type CerenovusActionOpportunity = {
  readonly nightNumber: 1;
  readonly taskId: ScheduledTaskId;
  readonly taskType: "CERENOVUS_ACTION";
  readonly opportunityId: ActionOpportunityId;
  readonly opportunityKind: "CERENOVUS_FIRST_NIGHT_ACTION";
  readonly opportunityStatus: "OPEN" | "CLOSED";
  readonly sourcePlayerId: PlayerId;
  readonly sourceSeatNumber: SeatNumber;
  readonly sourceRole: RoleSetupSnapshot;
  readonly sourceCharacterStateRevision: number;
  readonly sourceRoleTenureId: RoleTenureId;
  readonly sourceAbilityInstanceId: AbilityInstanceId;
  readonly abilitySource: CerenovusAbilitySourceDescriptor;
  readonly visibility: CerenovusActionOpportunityVisibility;
};
```

Extend the existing deterministic role-tenure projection minimally so that its tracked role-ID union, canonical formatter/parser, assignment bootstrap, and transition handling include `cerenovus`. Do not create a second tenure system.

For a base Cerenovus tenure, IDs are:

```text
role-tenure-v1:seat-SS:role-cerenovus:acquired-revision-R
cerenovus-ability-instance-v1:ROLE_TENURE:seat-SS:role-cerenovus:acquired-revision-R
```

`R` is the tenure’s actual acquired character-state revision, not the command, opportunity, or current revision. The ability-instance parser must reproduce the embedded role-tenure identity exactly.

The currently represented impairment reference is a closed union:

```ts
type CerenovusRepresentedImpairmentReference =
  | {
      readonly impairmentId: AbilityImpairmentId;
      readonly impairmentKind: "DRUNK";
      readonly impairmentSourceKind:
        "PHILOSOPHER_CHOSEN_DUPLICATE";
      readonly impairmentSourcePlayerId: PlayerId;
      readonly impairmentAppliedCharacterStateRevision: number;
    }
  | {
      readonly impairmentId: AbilityImpairmentId;
      readonly impairmentKind: "POISONED";
      readonly impairmentSourceKind:
        "SNAKE_CHARMER_DEMON_HIT";
      readonly impairmentSourcePlayerId: PlayerId;
      readonly impairmentAppliedCharacterStateRevision: number;
    };
```

No string-typed fallback is permitted. A future impairment source requires a reviewed union and model-version change.

## commands

Define the command using the real generic envelope:

```ts
type SubmitCerenovusActionCommandPayload = {
  readonly commandType: "SubmitCerenovusAction";
  readonly taskId: ScheduledTaskId;
  readonly opportunityId: ActionOpportunityId;
  readonly decision: CerenovusActionDecision;
};

type SubmitCerenovusActionCommand =
  CommandEnvelope<SubmitCerenovusActionCommandPayload>;
```

Add the payload and envelope to the existing supported command unions.

Actor policy is exact:

- `human`: allowed only when `actor.playerId === opportunity.sourcePlayerId`;
- `ai`: allowed only when `actor.playerId === opportunity.sourcePlayerId`;
- `storyteller`: rejected with `ActorNotAllowed`;
- `system`: rejected with `ActorNotAllowed`.

Storyteller and System do not act as transport and cannot select a target or character.

The command accepts no actor-supplied role snapshot, seat, role-tenure ID, ability-instance ID, character-state revision, impairment, effectiveness, requirement, marker, duration, notification content, enforcement, or execution fact.

The task/opportunity/source validation is exact:

```text
task.taskType === "CERENOVUS_ACTION"
task.taskClass === "ROLE_ACTION"
task.source.kind === "ROLE"
task.source.role.roleId === "cerenovus"
task.source.playerId === opportunity.sourcePlayerId
task.source.seatNumber === opportunity.sourceSeatNumber
sameRoleSetupSnapshot(task.source.role, opportunity.sourceRole)
opportunity.taskId === task.taskId
opportunity.taskType === task.taskType
opportunity.opportunityKind === "CERENOVUS_FIRST_NIGHT_ACTION"
opportunity.opportunityStatus === "OPEN"
```

The opportunity’s tenure and ability-instance IDs must parse canonically and identify the exact active base Cerenovus tenure. Settlement uses the current character-state revision and requires that same tenure to be continuous from the opportunity revision through settlement.

## events

Add three canonical domain events:

1. `CerenovusChoiceRecorded`
2. `CerenovusResolutionRecorded`
3. `CerenovusPrivateNotificationDelivered`

Reuse `ScheduledTaskSettled` as the fourth event with the neutral outcome:

```ts
outcomeType: "CERENOVUS_ACTION_RECORDED"
```

Add `CERENOVUS_ACTION_RECORDED` to `ScheduledTaskSettlementOutcomeType`.

The matching standard settlement payload is:

```ts
{
  rulesBaselineVersion: string;
  nightNumber: 1;
  taskId: ScheduledTaskId;
  taskType: "CERENOVUS_ACTION";
  settlementVersion: "scheduled-task-settlement-v1";
  outcomeType: "CERENOVUS_ACTION_RECORDED";
  characterStateRevision: number;
}
```

Its `characterStateRevision` equals the three Cerenovus events’ `settlementCharacterStateRevision`.

No runtime effect, madness judgment, execution, death, or lifecycle event is introduced.

## eventOrder

The accepted atomic batch order is fixed:

1. `CerenovusChoiceRecorded`
2. `CerenovusResolutionRecorded`
3. `CerenovusPrivateNotificationDelivered`
4. `ScheduledTaskSettled`

This order makes the choice available before its resolution, records represented rule truth before delivery, records the delivered historical knowledge before task settlement, and gives replay one deterministic sequence.

Night-order catalog behavior remains explicit:

- Official raw first-night metadata: `witch -> cerenovus -> fearmonger`.
- Official raw other-night metadata: `witch -> cerenovus -> pithag`; display label “Pit-Hag.”
- Supported first-night subset remains Witch `600`, Cerenovus `700`, Clockmaker `800`. Clockmaker is not claimed as the official immediate successor.

## payloadShapes

`CerenovusChoiceRecorded` has the exact payload:

```ts
{
  rulesBaselineVersion: string;
  modelVersion: "cerenovus-choice-v1";
  nightNumber: 1;
  choiceId: string;
  taskId: ScheduledTaskId;
  taskType: "CERENOVUS_ACTION";
  opportunityId: ActionOpportunityId;
  decisionKind: "CHOOSE_PLAYER_AND_CHARACTER";
  sourcePlayerId: PlayerId;
  sourceSeatNumber: SeatNumber;
  sourceRole: RoleSetupSnapshot;
  sourceRoleTenureId: RoleTenureId;
  sourceAbilityInstanceId: AbilityInstanceId;
  abilitySource: {
    kind: "ROLE_TENURE";
    abilityRoleId: "cerenovus";
    roleTenureId: RoleTenureId;
    acquiredCharacterStateRevision: number;
  };
  opportunityCharacterStateRevision: number;
  settlementCharacterStateRevision: number;
  targetPlayerId: PlayerId;
  targetSeatNumber: SeatNumber;
  chosenRoleId: RoleId;
  chosenRole: RoleSetupSnapshot;
  roleCatalogSignature: string;
}
```

`abilitySource.roleTenureId` equals `sourceRoleTenureId`. The chosen role snapshot and catalog signature are copied from the stored setup catalog, not actor input.

`CerenovusResolutionRecorded` has the exact payload:

```ts
{
  rulesBaselineVersion: string;
  modelVersion: "cerenovus-resolution-v1";
  nightNumber: 1;
  resolutionId: string;
  choiceId: string;
  taskId: ScheduledTaskId;
  taskType: "CERENOVUS_ACTION";
  opportunityId: ActionOpportunityId;
  sourcePlayerId: PlayerId;
  sourceSeatNumber: SeatNumber;
  sourceRole: RoleSetupSnapshot;
  sourceRoleTenureId: RoleTenureId;
  sourceAbilityInstanceId: AbilityInstanceId;
  abilitySource: {
    kind: "ROLE_TENURE";
    abilityRoleId: "cerenovus";
    roleTenureId: RoleTenureId;
    acquiredCharacterStateRevision: number;
  };
  opportunityCharacterStateRevision: number;
  settlementCharacterStateRevision: number;
  targetPlayerId: PlayerId;
  targetSeatNumber: SeatNumber;
  chosenRoleId: RoleId;
  chosenRole: RoleSetupSnapshot;
  roleCatalogSignature: string;
  resolution: CerenovusResolution;
}
```

The effective nested variant is exactly:

```ts
{
  kind: "REPRESENTED_EFFECTIVE_REQUIREMENT_CREATED";
  requirementModelVersion:
    "cerenovus-madness-requirement-creation-v1";
  requirementId: string;
  creationRecordStatus: "RECORDED";
  requiredRoleId: RoleId;
  sourceAbilityDependency: {
    kind: "SOURCE_ABILITY_INSTANCE";
    sourceRoleTenureId: RoleTenureId;
    sourceAbilityInstanceId: AbilityInstanceId;
    evaluatedAtCharacterStateRevision: number;
    permanentLossPolicy: "END_REQUIREMENT";
    reacquisitionPolicy: "NEW_INSTANCE_DOES_NOT_RESUME";
  };
  duration: {
    modelVersion: "cerenovus-first-night-duration-v1";
    starts: {
      anchor: "PHASE_ENTERED";
      phase: "DAY_DISCUSSION";
      dayNumber: 1;
      nightNumber: 1;
    };
    followingNight: {
      phase: "NIGHT_TASKS";
      dayNumber: 1;
      nightNumber: 2;
    };
    ends: {
      anchor: "PHASE_ENTERED";
      phase: "DAWN_RESOLUTION";
      dayNumber: 1;
      nightNumber: 2;
    };
  };
  markerAtCreation: {
    markerKind: "MAD";
    placementAtCreation: "PLACED";
    targetPlayerId: PlayerId;
  };
}
```

The dependency IDs equal the outer payload IDs, and
`evaluatedAtCharacterStateRevision === settlementCharacterStateRevision`.

This is immutable future-safe history, not an active effect engine. Its declared validity is capped by the referenced ability instance permanently ending; a different later instance never resumes it. This slice emits no termination or resumption event and performs no enforcement.

The impaired nested variant is exactly:

```ts
{
  kind: "REPRESENTED_SOURCE_IMPAIRED_SIMULATION";
  simulationRecordStatus: "RECORDED";
  simulationReason: "SOURCE_DRUNK" | "SOURCE_POISONED";
  sourceImpairment: CerenovusRepresentedImpairmentReference;
}
```

`SOURCE_DRUNK` pairs only with the closed `DRUNK /
PHILOSOPHER_CHOSEN_DUPLICATE` variant. `SOURCE_POISONED` pairs only with
`POISONED / SNAKE_CHARMER_DEMON_HIT`.

Exact-key validation forbids requirement, dependency, marker, duration, enforcement, execution, death, and lifecycle keys in the impaired variant.

`CerenovusPrivateNotificationDelivered` has the exact payload:

```ts
{
  rulesBaselineVersion: string;
  modelVersion: "cerenovus-private-notification-v1";
  nightNumber: 1;
  notificationId: string;
  choiceId: string;
  taskId: ScheduledTaskId;
  taskType: "CERENOVUS_ACTION";
  opportunityId: ActionOpportunityId;
  sourcePlayerId: PlayerId;
  sourceSeatNumber: SeatNumber;
  sourceRole: RoleSetupSnapshot;
  sourceRoleTenureId: RoleTenureId;
  sourceAbilityInstanceId: AbilityInstanceId;
  abilitySource: {
    kind: "ROLE_TENURE";
    abilityRoleId: "cerenovus";
    roleTenureId: RoleTenureId;
    acquiredCharacterStateRevision: number;
  };
  opportunityCharacterStateRevision: number;
  settlementCharacterStateRevision: number;
  recipientPlayerId: PlayerId;
  recipientSeatNumber: SeatNumber;
  chosenRoleId: RoleId;
  chosenRole: RoleSetupSnapshot;
  roleCatalogSignature: string;
  tokens: readonly [
    {
      kind: "INFORMATION_TOKEN";
      token: "THIS_CHARACTER_SELECTED_YOU";
    },
    {
      kind: "CHARACTER_TOKEN";
      role: "cerenovus";
    },
    {
      kind: "CHARACTER_TOKEN";
      role: RoleId;
    }
  ];
}
```

The notification constructor receives the validated stored choice only. Every provenance field is copied from that choice, the recipient equals its target, and the third token equals its chosen role. It never receives or branches on the represented resolution.

## stateChanges

Replay applies the batch as follows:

- `CerenovusChoiceRecorded` stores an immutable choice fact indexed by `choiceId` and `opportunityId`.
- `CerenovusResolutionRecorded` stores one immutable represented resolution fact linked to the choice.
- Replay stores the source role-tenure and ability-instance identity with every chain fact.
- An effective resolution stores its requirement-creation history and anchors as historical facts only.
- The effective record’s declared validity is tied to that exact ability instance. A future lifecycle reader must cap it at permanent end of that instance and must not match a later reacquired instance.
- An impaired resolution stores simulation/impairment evidence only and creates no requirement or marker fact.
- `CerenovusPrivateNotificationDelivered` stores immutable delivered-knowledge history for its recipient.
- `ScheduledTaskSettled` settles the task with `CERENOVUS_ACTION_RECORDED` through the existing task-settlement state.
- This slice does not create mutable active requirement state, an effect instance collection, expiry work, termination events, suppression/resumption state, enforcement state, or execution state.
- Applying `CerenovusChoiceRecorded` closes the matching Cerenovus opportunity using the same deterministic close semantics as other role-action choices.
- No general `EffectInstance`, active madness state, enforcement state, execution state, death state, or later-night scheduled task is created.

## privateProjection

Add the exact persisted private stage:

```ts
export const CERENOVUS_INFORMATION_STAGE =
  "CERENOVUS_INFORMATION" as const;
```

Extend `PlayerPrivateKnowledgeStage` and its persisted order to:

```ts
[
  "OWN_CHARACTER_BOOTSTRAP",
  "MINION_INFORMATION",
  "DEMON_INFORMATION",
  "EVIL_TWIN_SETUP_INFORMATION",
  "CERENOVUS_INFORMATION",
  "DREAMER_INFORMATION",
  "SEAMSTRESS_INFORMATION"
]
```

The anchors are the actual repository literals
`EVIL_TWIN_SETUP_INFORMATION` and `DREAMER_INFORMATION`.

Add target-only optional view fields:

```ts
{
  cerenovusNotification?: {
    selectedByRoleId: "cerenovus";
    chosenRoleId: RoleId;
    tokens: readonly [
      {
        kind: "INFORMATION_TOKEN";
        token: "THIS_CHARACTER_SELECTED_YOU";
      },
      {
        kind: "CHARACTER_TOKEN";
        role: "cerenovus";
      },
      {
        kind: "CHARACTER_TOKEN";
        role: RoleId;
      }
    ];
  };
  cerenovusKnowledgeModelVersion?:
    "cerenovus-private-notification-v1";
}
```

Before projecting any Cerenovus value to either player or AI views, validate globally that each candidate delivery has exactly one complete chain:

1. one matching `CERENOVUS_FIRST_NIGHT_ACTION` opportunity with status `CLOSED`;
2. one matching `CerenovusChoiceRecorded`;
3. one matching `CerenovusResolutionRecorded`;
4. one matching `CerenovusPrivateNotificationDelivered`;
5. one matching `ScheduledTaskSettled` with task type `CERENOVUS_ACTION`, outcome type `CERENOVUS_ACTION_RECORDED`, and matching settlement revision.

The opportunity-kind literal in production code must be spelled
`CERENOVUS_FIRST_NIGHT_ACTION`.

Validate exact model versions and shapes; deterministic IDs; rules baseline; task, opportunity, choice, role-tenure, ability-instance, player, seat, role snapshot, catalog signature, opportunity revision, settlement revision, recipient, chosen role, and token linkage.

Enforce global uniqueness in both directions:

- no duplicate IDs of any Cerenovus fact type;
- no opportunity, task, choice, resolution, notification, or settlement reused across chains;
- no Cerenovus chain without exactly one matching settlement;
- no Cerenovus settlement without exactly one complete chain;
- no cross-link to another role’s opportunity or settlement.

Missing, duplicate, malformed, extra-key, unsupported-version, cross-reused, or mismatched facts fail closed with `PrivateKnowledgeUnavailable`. Do not emit a partial view.

Stage/value/version coupling is exact:

- `CERENOVUS_INFORMATION` occurs exactly once iff a validated notification is projected;
- `cerenovusNotification` and `cerenovusKnowledgeModelVersion` are either both present or both absent;
- when present, the model version is exactly `cerenovus-private-notification-v1`;
- the stage cannot exist without the fields, and the fields cannot exist without the stage;
- delivered stages remain unique and in persisted order.

The projector validates the complete hidden chain but returns only the notification value. It never exposes source player, source seat, internal IDs, revisions, effectiveness, impairment, resolution kind, requirement, marker, duration, execution eligibility, or Storyteller notes.

## storedValidation

Exact runtime validation must establish:

- generic command-envelope and command-payload shape;
- event-envelope metadata and payload rules-baseline consistency;
- exact payload and nested-union keys and model versions;
- deterministic ID equality;
- real scheduled-task source shape and complete role snapshot;
- exactly one base Cerenovus role tenure and canonical ability instance;
- opportunity/task/source player, seat, role, tenure, instance, and revision linkage;
- continuity of the same tenure from opportunity revision through settlement revision;
- target player and seat membership in the modeled roster;
- chosen role ID and complete role snapshot in the stored script catalog;
- selected role type exactly Townsfolk or Outsider;
- role-catalog signature equality;
- one choice, resolution, notification, and settlement per opportunity/task;
- full provenance equality across all three Cerenovus events;
- effective dependency identity and exact day-1/following-night/dawn anchors;
- impaired source reference equality to exactly one fact in the closed represented impairment union;
- no effective-only fields in the impaired variant;
- exact notification recipient, seat, chosen role, and token tuple;
- settlement version, `outcomeType`, and character-state revision;
- global chain uniqueness and reverse settlement-to-chain completeness.

Any mismatch fails closed before state mutation or projection.

## replayValidation

Replay must reject:

- resolution before choice;
- notification before choice or resolution;
- settlement before choice, resolution, and notification;
- duplicate or cross-reused opportunity, task, choice, resolution, notification, settlement, tenure, or ability-instance linkage;
- an opportunity that is absent, not closed, wrong-kind, or does not exactly match its task source;
- source player, seat, role snapshot, tenure, instance, catalog signature, or revision disagreement;
- target player/seat or chosen role/snapshot disagreement;
- noncanonical tenure, ability-instance, event, requirement, or notification IDs;
- an effective dependency whose IDs or evaluated revision differ from outer provenance;
- an effective record without exact day-1, following-night, and dawn anchors;
- an impaired variant outside the closed impairment union or inconsistent with the stored impairment fact;
- any effective-only key on an impaired resolution;
- a notification with the wrong recipient, seat, role, or token tuple;
- a settlement whose `outcomeType` is not `CERENOVUS_ACTION_RECORDED`;
- any Cerenovus settlement without exactly one complete chain or any chain without exactly one settlement;
- extra keys, unknown variants, or unsupported model versions.

A valid replay rebuilds immutable choice, represented resolution, delivered notification, closed opportunity, tenure/ability provenance, and settled-task history without implementing requirement expiry or enforcement.

## batchSemantics

The four-event batch is prospective-validated against a clone of current canonical state and appended atomically.

- If any event fails construction, exact validation, prospective application, or persistence, append none.
- No notification can be committed without its choice and represented resolution.
- No task can be settled without its notification.
- Retries use existing command fingerprint and receipt semantics and cannot append a partial or second batch.
- The persisted ordering is exactly the order in `eventOrder`.

## prospectiveValidation

Before append, apply the proposed batch to an isolated prospective state using the same replay validators used for persisted events. Acceptance requires all of the following:

- current phase/task/opportunity state permits this first-night Cerenovus action;
- the matching Cerenovus role tenure exists and remains continuous through settlement;
- the ability-instance ID is the canonical instance for that exact tenure;
- the target and chosen character remain legal at settlement;
- represented source impairment is evaluated from current canonical state at settlement, not from actor input;
- the selected effective or impaired variant agrees with represented impairment state;
- current settlement revision equals every event’s settlement revision and the settlement’s `characterStateRevision`;
- all four events apply in order with exact linkages and no duplicate state;
- the full prospective chain passes the same global completeness and uniqueness checks used by replay and projection;
- applying the choice closes exactly the matching opportunity;
- the resulting task is settled exactly once;
- the target's stored delivered-knowledge fact is projectable from the prospective state;
- no unsupported runtime effect or authority is introduced.

Prospective failure returns the normal command failure contract and persists neither domain events nor an accepted receipt.

## receiptSemantics

Successful first execution returns exactly:

```ts
{
  status: "accepted";
  resultSchemaVersion: "accepted-event-summary-v1";
  eventDisclosure: "EVENT_TYPES_ONLY";
  gameId: GameId;
  gameVersion: number;
  eventCount: 4;
  eventTypes: [
    "CerenovusChoiceRecorded",
    "CerenovusResolutionRecorded",
    "CerenovusPrivateNotificationDelivered",
    "ScheduledTaskSettled"
  ];
  idempotent: false;
}
```

The existing command fingerprint covers the exact command payload, including task, opportunity, target, and chosen role. A retry with the same command ID and identical fingerprint returns the stored accepted receipt with `idempotent: true`, the same `gameVersion`, `eventCount`, and ordered `eventTypes`, and appends nothing. Reuse of a command ID with a different fingerprint fails through the existing conflict contract.

Receipts disclose neither event payloads nor branch identity. Effective, drunk, and poisoned accepted executions therefore have the same result schema, disclosure mode, count, and event-type sequence.

Add `SubmitCerenovusAction` to the application’s `acceptedWithEventSummary` selection and to both role-action retryable-failure classification lists.

## failureBoundary

Reject before append when:

- command envelope, decision, task ID, opportunity ID, target ID, or role ID is malformed;
- the task/opportunity does not exist, does not belong to the actor, is already settled, or is not the base first-night Cerenovus action;
- the source is not exactly the represented base Cerenovus role source;
- the target is not a modeled roster player;
- the chosen role is absent from the script or is not Townsfolk/Outsider;
- source impairment facts are malformed or ambiguous under existing deterministic precedence;
- deterministic IDs collide with non-identical stored facts;
- event construction, exact validation, replay validation, prospective validation, persistence, or receipt storage fails.

Every event-construction, dependency-execution, event-metadata, prospective-validation, and accepted-commit failure returns `status: "failed"` with `retryable: true`, persists no event or receipt, does not close the opportunity, does not settle the task, and does not burn the command ID.

Expected mappings are:

- Cerenovus domain construction/dependency failure:
  `DependencyExecutionFailed`, stage `first-night-role-action`;
- metadata generator failure:
  `MetadataGenerationFailed`, stage `event-metadata`;
- prospective application failure:
  `DependencyExecutionFailed`, stage `first-night-role-action` for the current role-action domain-error path, or `prospective-validation` for an unknown prospective exception, matching the existing service contract;
- atomic accepted commit failure:
  `EventStoreAppendFailed`, stage `accepted-commit`.

A retry after any such failed result with the same command ID and unchanged payload must execute normally because no accepted or rejected receipt was stored.

## deterministicIds

Use canonical string construction only:

```text
first-night-v1:CERENOVUS_ACTION:seat-SS:opportunity-01
role-tenure-v1:seat-SS:role-cerenovus:acquired-revision-R
cerenovus-ability-instance-v1:ROLE_TENURE:seat-SS:role-cerenovus:acquired-revision-R
cerenovus-choice-v1:<opportunityId>
cerenovus-resolution-v1:<opportunityId>
cerenovus-madness-requirement-v1:<opportunityId>
cerenovus-private-notification-v1:<opportunityId>:recipient-seat-SS
```

`R` is the actual tenure acquisition revision. The effective-only requirement ID is absent from impaired resolution. Existing deterministic event metadata, command fingerprints, batch IDs, event sequences, and receipts remain authoritative.

Do not use wall-clock time, randomness, random UUIDs, locale comparison, environment locale, or insertion-order dependence for canonical values.

## branchInvariantDisclosureProof

Let `E` be an effective source settlement, `D` a represented-drunk settlement, and `P` a represented-poisoned settlement for the same canonical choice inputs.

For all three branches:

```text
eventCount = 4
```

and:

```text
eventTypes = [
  CerenovusChoiceRecorded,
  CerenovusResolutionRecorded,
  CerenovusPrivateNotificationDelivered,
  ScheduledTaskSettled
]
```

The hidden resolution payload differs by branch, but its event type does not. The notification event is constructed only from the choice, so equivalent choices produce identical notification payloads in effective, drunk, and poisoned branches. The settlement always uses `outcomeType: "CERENOVUS_ACTION_RECORDED"`.

Projection validates the complete opportunity/choice/resolution/notification/settlement chain, including branch validity, but returns only the choice-derived notification. It never returns the resolution branch or impairment metadata. Therefore the submitter’s event-type-only receipt and the target’s private view remain branch-invariant.

## repositoryChanges

The implementer owns only the bounded production, test, and documentation changes needed for this design. Expected touch points are:

- domain event/type definitions and exact validators for the three new events;
- game-state storage and replay application for choice, represented resolution, delivered notification, and neutral task settlement;
- command definition, command dispatch, Cerenovus handler, batch construction, prospective validation, and receipt integration;
- scheduled-task/action-opportunity decision metadata for the existing first-night Cerenovus catalog entry;
- extend the existing deterministic role-tenure formatter/parser/bootstrap/transition projection to track `cerenovus`;
- add the Cerenovus ability-instance formatter/parser derived from one role tenure;
- add Cerenovus opportunity source provenance and exact closed-opportunity validation;
- private projection types, deterministic stage ordering, and Cerenovus notification projection;
- add complete projection chain and stage/value/model-version coupling validation;
- add `SubmitCerenovusAction` to existing retryable role-action and accepted-event-summary paths;
- focused unit/integration/replay/projection/receipt tests;
- `docs/rules/ROLE_COVERAGE_MATRIX.md` update preserving `PARTIAL` status;
- current implementation/status documentation required by repository workflow.

Do not refactor Witch semantics to share behavior: Witch's current effective/impaired event shapes and notification behavior are materially different. Reuse shared infrastructure only where its contract already matches this design.

## compatibilityMigration

- All new event types and model versions are additive.
- Existing games without Cerenovus events replay unchanged.
- Existing accepted-result schema `accepted-event-summary-v1` is reused without shape change.
- Existing command fingerprint, receipt, serial queue, task settlement, impairment fact, role catalog, and projection infrastructure remain compatible.
- Existing canonical events are not rewritten.
- Role-tenure state is derived replay state. Snapshots created before Cerenovus tenure tracking must be invalidated and rebuilt from assignment and transition events when a Cerenovus is present; they must not silently default to an empty Cerenovus tenure.
- Existing games without Cerenovus events continue to replay without Cerenovus choice, resolution, notification, or settlement history.
- The new role-tenure and ability-instance identities are provenance only for this slice; no active effect or lifecycle migration is introduced.
- No migration synthesizes Cerenovus notification, requirement, or impairment facts for old games.
- Unknown future Cerenovus model versions fail closed under exact validation.

## testPlan

Add focused regressions covering:

1. Exact `CommandEnvelope<SubmitCerenovusActionCommandPayload>` shape and `payload.commandType`.
2. Rejection of top-level `type`, task, opportunity, or decision fields.
3. Human source actor accepted; mismatched human rejected.
4. AI source actor accepted; mismatched AI rejected.
5. Storyteller and System rejected with `ActorNotAllowed`.
6. Exact `task.source.kind`, player, seat, complete role snapshot, opportunity, and revision linkage.
7. Cerenovus tenure bootstrap, canonical parser/formatter, and transition identity.
8. Canonical Cerenovus ability-instance identity derived from the exact tenure.
9. Stale, ended, reacquired, mismatched, closed, non-next, and gained-ability sources rejected.
10. Legal effective base first-night choice appends the exact four-event order.
11. All three events contain exact rules baseline, night, task, source, seat, role, tenure, ability-instance, catalog, and revision provenance.
12. Standard settlement uses `outcomeType: "CERENOVUS_ACTION_RECORDED"`.
13. Effective resolution contains exact dependency identity, marker-at-creation, and day-1/following-night/dawn anchors.
14. Later reacquisition produces a different tenure/instance and cannot match or resume the old requirement record.
15. Drunk resolution uses only the closed `PHILOSOPHER_CHOSEN_DUPLICATE` reference.
16. Poisoned resolution uses only the closed `SNAKE_CHARMER_DEMON_HIT` reference.
17. Unknown or cross-paired impairment kinds/source kinds fail closed.
18. Effective, drunk, and poisoned notification payloads are deep-equal for equivalent choices.
19. Effective, drunk, and poisoned accepted event summaries have identical count and ordered event types.
20. Target human and AI private views receive the exact token tuple.
21. Non-target views receive no Cerenovus notification.
22. Projection uses stored history and does not recompute after later state changes.
23. Projection requires exactly one closed opportunity, choice, resolution, notification, and settlement.
24. Projection fails closed for each missing, duplicate, malformed, cross-reused, extra-key, unsupported-version, ID, catalog, revision, recipient, and token mismatch.
25. Reverse validation rejects a Cerenovus settlement without one complete chain.
26. `CERENOVUS_INFORMATION` is ordered between actual literals `EVIL_TWIN_SETUP_INFORMATION` and `DREAMER_INFORMATION`.
27. Stage/value/model-version coupling is tested in both presence and absence directions.
28. Existing Evil Twin, Dreamer, and Seamstress projections remain unchanged.
29. Self-targeting and any modeled roster target are accepted.
30. On-script unassigned Townsfolk and Outsiders are accepted.
31. Ordinary Minion, Demon, Traveller, Fabled, unknown, off-script, and Goblin selections fail closed.
32. Replay rejects every order inversion, duplicate, cross-link, provenance mismatch, and deterministic-ID error.
33. Event construction/dependency failure returns retryable `first-night-role-action`, persists no receipt, and permits same-command retry.
34. Event-metadata failure returns retryable `event-metadata`, persists no receipt, and permits retry.
35. Prospective failure returns the existing retryable role-action/prospective stage, persists no receipt, and permits retry.
36. Accepted-commit failure returns retryable `accepted-commit`, persists no partial batch or receipt, and permits retry.
37. Same command ID and fingerprint after success returns the idempotent stored receipt without appending.
38. Same command ID with changed target or role returns the existing idempotency conflict.
39. Raw nightsheet metadata asserts `witch -> cerenovus -> fearmonger` and `witch -> cerenovus -> pithag`; display metadata maps `pithag` to “Pit-Hag.”
40. Supported subset order remains `600/700/800` without claiming Clockmaker is the official immediate successor.
41. Coverage remains `PARTIAL`, and all forbidden lifecycle/enforcement dimensions remain incomplete.

Run focused tests and lint for touched files, then `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:coverage`.

## evidenceRegressionTraceability

All 23 required regressions from `docs/rules/evidence/2B16.md` remain mandatory:

1. Raw nightsheet order — assert first night `witch -> cerenovus -> fearmonger` and other night `witch -> cerenovus -> pithag`; map only the display label to “Pit-Hag.”
2. Supported subset — preserve `WITCH_ACTION(600) -> CERENOVUS_ACTION(700) -> CLOCKMAKER_INFORMATION(800)` without an official-neighbor claim.
3. Opportunity identity — require exact base task, role source, player, seat, role snapshot, tenure, ability instance, and revisions; reject stale, mismatched, closed, non-next, and unsupported opportunities.
4. Safe decision surface — expose only target player and chosen script character.
5. Self-target — accept.
6. Modeled roster target — accept without claiming life/Traveller completeness.
7. On-script Townsfolk/Outsider — accept whether assigned/in play or not.
8. Ordinary unsupported character types and off-script roles — reject.
9. Goblin — fail closed because the jinx capability is out of scope.
10. Effective atomic chain — choice, stable source-bound historical requirement/marker creation, notification, and settlement.
11. Impaired atomic chain — choice, closed-union simulation evidence, identical notification, no requirement/marker/execution authority.
12. Stale no-notification assertion — replaced by indistinguishable private notification.
13. Token semantics — selected-by token, Cerenovus token, chosen-character token in exact order.
14. Recipient restriction — selected target’s player and AI views only.
15. Hidden branch — no effectiveness, impairment, marker truth, execution eligibility, IDs, or Storyteller notes in receipt/view.
16. Complete chain — projection requires exactly one closed opportunity, choice, resolution, notification, and settlement and fails closed on every malformed or cross-reused fact.
17. Duration — day 1 plus following night, natural end at dawn; stable source ability identity records earlier permanent-loss dependency without implementing lifecycle.
18. Forbidden events — no death, execution, day transition, recurrence, life state, Traveller, character-change, or chat-evidence event.
19. Computed outcomes — reject actor-supplied impairment, effectiveness, marker, target role/alignment, requirement, or execution facts.
20. Validation/failures — exact shapes, replay, ordering, atomicity, prospective application, duplicates, and retryable construction/dependency/metadata/persistence failures.
21. Determinism — canonical IDs/comparison; no time, randomness, UUID, locale, environment locale, or insertion-order authority.
22. Witch preservation — do not generalize Witch’s impaired behavior.
23. Projection preservation — actual stage literals and coupling preserve Evil Twin, Dreamer, and Seamstress and prevent leakage.

If any trace is absent from tests or an explicit bounded out-of-scope assertion, the corrected design is not ready for rereview.

## riskAlternatives

Primary risks and mitigations:

- **Branch leakage through accepted event summaries.** Mitigated by identical canonical event types/count and a neutral settlement outcome.
- **Branch leakage through target projection.** Mitigated by constructing and projecting notification solely from the stored choice.
- **Accidental active madness runtime.** Mitigated by historical `creationRecordStatus`, no general effect instance, and explicit forbidden state/events.
- **Impaired branch accidentally gaining authority.** Mitigated by a closed exact-key union and replay rejection of effective-only keys.
- **Recomputing historical knowledge.** Mitigated by immutable delivered-notification storage and stored-fact projection.
- **Using current supported catalog order as official rule order.** Mitigated by separately recording official relative metadata and supported numeric catalog order.
- **Overgeneralizing Witch behavior.** Mitigated by a dedicated Cerenovus flow because Witch's impaired behavior is not contract-compatible.
- **Premature shared effect abstraction.** Rejected for this slice because downstream madness judgment/lifecycle semantics are intentionally unmodeled.
- **Single neutral resolution without internal variants.** Rejected because it would lose canonical represented truth needed for future rule-safe expansion.
- **Different effective/impaired event types.** Rejected because `accepted-event-summary-v1` would disclose the source branch.
- **Omitting the effective creation record entirely.** Rejected because it would fail the sourced effective-rule evidence and make future replay-safe expansion ambiguous.
- **Player plus role is not a stable source identity.** Mitigated by reusing the existing deterministic role-tenure projection and adding a Cerenovus ability-instance ID derived from that tenure.
- **Opportunity ID alone as ability identity.** Rejected because it does not encode acquisition tenure or future permanent-loss/reacquisition semantics.
- **New active effect/lifecycle subsystem.** Rejected for this slice. The effective payload records dependency semantics only.
- **Later reacquisition reviving old history.** Prevented because reacquisition creates a different tenure and ability-instance ID.
- **Projection accepting an orphan notification.** Prevented by complete bidirectional chain and settlement validation.

## explicitOutOfScope

- Judging whether the target is or is not mad.
- Observing speech, claims, nominations, votes, chat, or behavior for madness compliance.
- Storyteller enforcement decisions.
- Execution opportunity, execution command, execution event, or execution resolution.
- Death, survival, prevention, resurrection, or lifecycle consequences.
- Active-effect queries, expiration jobs, cleanup events, or general madness effect engines.
- Other-night Cerenovus command execution or repeated selection.
- Philosopher-gained, Alchemist-gained, Cannibal-gained, or other gained/copied Cerenovus abilities.
- Goblin, Vigormortis, Pit-Hag, Witch, Fearmonger, or other role interactions beyond order metadata needed to place this task.
- Changing alignments, character assignments, registrations, or script composition.
- UI controls, animations, Electron behavior, AI policy, LLM prompting, or autonomous target/role selection.
- Public or Storyteller-facing projection of hidden Cerenovus facts.
- Notifications to the source player beyond the existing command receipt.
- Random selection, Storyteller candidate ranking, or heuristic choices.
- Executing source-ability termination, temporary suppression/resumption, natural expiry, or marker removal.
- Creating mutable active requirement/effect-instance state.
- Treating a later Cerenovus tenure or ability instance as continuation of the recorded first-night source instance.
- Storyteller/System transport or delegated choice authority for `SubmitCerenovusAction`.
- Marking Cerenovus or any incomplete dimension `COMPLETE`.

## completionCriteria

The design is implemented only when all of the following are true:

- The command uses the real generic envelope and exact Human/AI-only source-actor policy.
- The exact command, three canonical events, neutral settlement, and deterministic IDs are implemented.
- All event payloads carry compatible rules-baseline, night, task, source, seat, role snapshot, tenure, ability-instance, catalog, and revision provenance.
- Settlement uses the standard shape and `outcomeType: "CERENOVUS_ACTION_RECORDED"`.
- Effective and represented-drunk/poisoned branches append the same ordered four event types.
- The effective historical creation record is bound to one stable role tenure and ability instance, declares permanent-loss termination and no-resume-on-reacquisition semantics, and creates no lifecycle engine.
- Impaired resolution records only impairment/simulation evidence and cannot contain or create requirement/marker/enforcement authority.
- The chosen target receives the exact same stored and projected notification across effective and impaired branches.
- Human and AI private views remain recipient-only and branch-invariant.
- Projection validates exactly one complete closed chain with global uniqueness and reverse settlement completeness.
- `CERENOVUS_INFORMATION` is coupled to its value/model version and ordered between `EVIL_TWIN_SETUP_INFORMATION` and `DREAMER_INFORMATION`.
- Exact stored validation, replay validation, prospective validation, atomic batch behavior, command fingerprinting, and idempotent receipts are covered by tests.
- All 23 evidence findings are traceable to tests or explicit bounded out-of-scope assertions.
- Duration language consistently states day 1 and the following night, ending at `DAWN_RESOLUTION(dayNumber=1, nightNumber=2)`; no earlier-day-end claim remains.
- Official raw other-night metadata is exactly `pithag`.
- Construction, dependency, metadata, prospective, and accepted-commit failures are retryable, persist no partial state or receipt, and do not burn the command ID.
- Official night-order claims and current supported-catalog order are both represented without conflation.
- Existing games and receipts remain compatible; snapshots remain rebuildable.
- `docs/rules/ROLE_COVERAGE_MATRIX.md` remains honest: base ability, first-night, drunk, poison, and private projection may advance only to `PARTIAL`; other-night, Philosopher-gained, Goblin, Vigormortis, judgment, enforcement, execution, death, lifecycle, UI, and AI-policy dimensions remain `NOT_IMPLEMENTED` or `UNEVALUATED` as appropriate; overall Cerenovus status remains `PARTIAL`.
- Evidence and design hashes are regenerated, and the corrected exact HEAD receives a new independent rule-design review.
- Cerenovus remains overall `PARTIAL`; implementation remains unauthorized until that review passes.
- Focused validation and all full repository gates pass.
- No forbidden scope is introduced.

READY_FOR_RULE_DESIGN_REREVIEW
