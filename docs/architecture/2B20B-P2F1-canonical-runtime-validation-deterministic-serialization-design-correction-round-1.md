# Phase 3 Slice 2B20B-P2F1 — Canonical Runtime Validation and Deterministic Serialization Design Correction Round 1

## Metadata

- sliceId: `2B20B-P2F1`
- designRound: `1`
- correctionRound: `1`
- documentType: `STANDALONE_DESIGN_CORRECTION`
- authorization: `USER_AUTHORIZED_PHASE_3_SLICE_2B20B_P2F1_DESIGN_CORRECTION_ROUND_1_ONLY`
- authorizationScope: `DESIGN_CORRECTION_ONLY`
- parentDesignPath: `docs/architecture/2B20B-P2F1-canonical-runtime-validation-deterministic-serialization-design-round-1.md`
- parentDesignSha256: `85152ec636b87b08b253c20dcaba9f961ba26eaa2e46b75fd80ac108a026cf2a`
- branch: `phase-3/canonical-drunk-vigormortis-settleability-closure`
- designPackage: `@botc/domain-core`
- reviewStatus: `NOT_REVIEWED`
- implementationAuthorized: `false`
- eventSchemaChanged: `false`
- replayAuthorityChanged: `false`
- stateAuthorityChanged: `false`
- acceptedBehaviorChanged: `false`
- BOTCRuleChanged: `false`
- P2FDesignChanged: `false`
- P2FStatus: `HUMAN_BLOCKED_PENDING_P2F1`

This correction is self-contained for D01 through D06. Its definitions supersede conflicting D01-D06 definitions in the parent. Parent provisions outside those corrected definitions remain in force. This document awaits independent review and authorizes no implementation.

## D01 — Corrected boundary and scope

P2F1 provides:

1. descriptor-safe capture into process-local opaque tokens;
2. exact context-free validation for the 14-field domain-event envelope and all 40 payload schemas;
3. deterministic TLV serialization;
4. exact raw-byte, canonical-value, canonical-state-role, and aggregate-binding SHA-256 integrity results;
5. bounded secret-safe diagnostics;
6. additive domain-core exports and deterministic test/CI evidence.

P2F1 does not:

- parse replay JSON;
- detect duplicate JSON keys;
- approve replay artifacts;
- establish accepted-history provenance;
- run event replay;
- rebuild or validate `GameState`;
- compare, select, repair, or reject snapshots semantically;
- own quarantine;
- issue trusted-history authority;
- issue canonical-state authority;
- change events, payloads, IDs, state, receipts, snapshots, commands, persistence, roles, projections, workflows, dependencies, or product behavior.

Structural success is not semantic success. Existing stream, batch, prospective, event-applier, rebuild, historical-knowledge, and settlement validation remain unchanged and mandatory for later consumers.

## D02 — Opaque process-local capture and canonical TLV

### Opaque captured-token types

```ts
declare const capturedCanonicalValueType: unique symbol;
declare const capturedRawBytesType: unique symbol;
declare const capturedAggregateBindingV1Type: unique symbol;

export type CapturedCanonicalValue = {
  readonly [capturedCanonicalValueType]: never;
};

export type CapturedRawBytes = {
  readonly [capturedRawBytesType]: never;
};

export type CapturedAggregateBindingV1 = {
  readonly [capturedAggregateBindingV1Type]: never;
};
```

The three unique symbols are module-private. No brand symbol, issuer, registry, backing value, copied bytes, or mutable builder is exported.

Each runtime token is created exactly as a frozen, null-prototype, zero-own-key object:

```ts
Object.freeze(Object.create(null))
```

Each token type has its own module-private `WeakSet<object>` and `WeakMap<object, BackingRecord>`. Only these functions issue tokens:

```ts
captureCanonicalRuntimeValue(input: unknown)
captureRawBytes(input: unknown)
captureAggregateBindingV1(input: unknown)
```

Serialization and hashing APIs take the candidate token as their first positional `unknown` argument. Validation order is:

1. reject primitive or `null`;
2. inside `try/catch`, call the correct private `WeakSet.has`;
3. only after membership succeeds, read the private `WeakMap`;
4. never inspect a caller property, key, descriptor, prototype, iterator, stringification, or serialization.

Clones, spreads, JSON round trips, `structuredClone`, lookalikes, wrong token kinds, and tokens from another module instance fail. Tokens are structural-capture capability only and are never history or state authority.

### Canonical value versions

```ts
CANONICAL_RUNTIME_VALUE_VERSION =
  "botc-canonical-runtime-value-v1"

CANONICAL_RUNTIME_SERIALIZATION_VERSION =
  "botc-canonical-runtime-tlv-be-v1"

CANONICAL_RUNTIME_DIGEST_ALGORITHM =
  "SHA-256"
```

### Canonical value domain

Accepted:

- `null`;
- boolean;
- scalar string with no lone UTF-16 surrogate;
- safe integer excluding negative zero;
- dense standard array of admitted values;
- plain record with `Object.prototype` or `null` prototype and enumerable string-keyed data properties.

Rejected:

- `undefined`;
- fraction, `NaN`, infinity, unsafe integer, or negative zero;
- bigint, symbol, or function;
- accessor;
- Proxy or revoked Proxy;
- cycle;
- sparse or keyed array;
- array with invalid prototype or modified length descriptor;
- nonplain object;
- `Map`, `Set`, `Date`, `RegExp`, `Error`, `Promise`;
- `ArrayBuffer`, `SharedArrayBuffer`, `DataView`, or typed array;
- class instance;
- lone surrogate;
- symbol key;
- non-enumerable property.

Repeated acyclic references are detached and captured by value. Each occurrence is traversed and counted independently.

### Capture precedence

The exact generic capture precedence is:

1. `types.isProxy` failure returns `PROXY_VALUE`;
2. already-counted resource limit;
3. cycle;
4. nonplain object or invalid array prototype;
5. symbol key;
6. accessor;
7. non-enumerable property;
8. sparse array, keyed array, or invalid length descriptor;
9. scalar-domain failure;
10. successful detached, deep-frozen backing value.

The implementation never invokes a getter, setter, iterator, `toString`, `valueOf`, `toJSON`, inspection hook, caller method, or species constructor. Caller objects are never retained.

### Resource limits

```text
maxDepth                 128, root depth 0
maxNodes                 100000
maxArrayLength           10000
maxObjectKeys            10000
maxStringUtf8Bytes       1048576
maxObjectKeyUtf8Bytes    65535
maxSerializedBytes       16777216
```

Every scalar, array, and record occurrence counts as one node. Repeated references recount. Limit failure is `RESOURCE_LIMIT_EXCEEDED` and returns no partial token, value, bytes, event, or digest.

### Canonical failure codes

```ts
type CanonicalFailureCode =
  | "PROXY_VALUE"
  | "UNDEFINED_VALUE"
  | "UNSUPPORTED_VALUE_TYPE"
  | "INVALID_NUMBER"
  | "LONE_SURROGATE"
  | "ACCESSOR_PROPERTY"
  | "SYMBOL_KEY"
  | "CYCLIC_VALUE"
  | "SPARSE_ARRAY"
  | "KEYED_ARRAY"
  | "INVALID_ARRAY_LENGTH_DESCRIPTOR"
  | "NONPLAIN_OBJECT"
  | "NON_ENUMERABLE_PROPERTY"
  | "RESOURCE_LIMIT_EXCEEDED"
  | "SERIALIZATION_FAILED"
  | "INVALID_CAPTURED_CANONICAL_VALUE";
```

### Safe diagnostic

```ts
type SafePathSegment =
  | { readonly kind: "KNOWN_FIELD"; readonly field: KnownSchemaFieldName }
  | { readonly kind: "ARRAY_INDEX"; readonly index: number }
  | { readonly kind: "OBJECT_KEY_ORDINAL"; readonly sortedOrdinal: number }
  | { readonly kind: "TRUNCATED" };

type CanonicalDiagnostic = {
  readonly code: CanonicalFailureCode;
  readonly path: readonly SafePathSegment[];
  readonly valueKind:
    | "primitive"
    | "array"
    | "record"
    | "proxy"
    | "unknown";
};
```

Paths contain at most 32 segments. A deeper path retains its first 31 safe segments and ends in `TRUNCATED`. Numeric array indices are allowed. A known field name is allowed only after recognition of that fixed schema node. Generic record keys and extra schema keys are represented only by raw-UTF-16-sorted zero-based ordinal.

No diagnostic contains a caller key, value, ID, byte, hash, state, event content, receipt, or retained input.

Generic canonical capture has no quarantine or advisory field.

### Exact TLV

The serialization begins once with:

```text
42 4F 54 43 43 52 56 01
```

This is ASCII `BOTCCRV` plus byte `01`.

| Tag | Meaning | Body |
|---|---|---|
| `00` | null | none |
| `01` | false | none |
| `02` | true | none |
| `03` | integer | signed two's-complement `i64be` |
| `04` | string | `u32be` UTF-8 byte length, strict UTF-8 bytes |
| `05` | array | `u32be` count, child nodes in order |
| `06` | object | `u32be` count, sorted entries |

Each object entry is `u32be key UTF-8 byte length`, key UTF-8 bytes, then its child node. Object keys have no string tag. Child values have no header.

Strings reject lone surrogates before WHATWG `TextEncoder`. There is no Unicode normalization, case conversion, trimming, locale, or platform-default encoding. CR, LF, and CRLF remain distinct. Object keys use raw JavaScript UTF-16 ordering:

```ts
left < right ? -1 : left > right ? 1 : 0
```

Arrays retain order. The eight-byte header counts toward `maxSerializedBytes`.

### Canonical APIs

```ts
captureCanonicalRuntimeValue(
  input: unknown
): CaptureCanonicalRuntimeValueResult

serializeCanonicalRuntimeValue(
  captured: unknown
): SerializeCanonicalRuntimeValueResult
```

Successful capture returns only `CapturedCanonicalValue`. Successful serialization returns a new non-shared `Uint8Array`, the value version, and serialization version. Invalid token identity returns `INVALID_CAPTURED_CANONICAL_VALUE`.

## D03 — Exact event and payload schemas

### Closed schema DSL

```text
S       admitted scalar string, preserved exactly, no trim
ID      string with value.trim().length > 0; accepted value unchanged
I       JavaScript safe integer excluding negative zero
NN      I >= 0
PI      I >= 1
Seat    I in [1,12]
Arr<T>  dense standard array of T
[A,B]   exact two-element tuple
Rec()   exact-key plain record
U()     closed union
Lit(x)  exact literal x
```

Every record and union branch rejects missing or extra keys. A question mark is the only notation for an optional key; no schema below has an optional key. `ID` applies only where explicitly written. It checks the existing branded-ID admission rule without trimming or rewriting.

### Common exact types

```text
Role = {
  roleId:ID,
  characterType:U("TOWNSFOLK","OUTSIDER","MINION","DEMON"),
  defaultAlignment:U("GOOD","EVIL"),
  edition:Lit("sects-and-violets"),
  setupModifier:{outsiderDelta:I,townsfolkDelta:I}
}

PlayerRef = {playerId:ID,seatNumber:Seat}

StateEntry = {
  playerId:ID,
  seatNumber:Seat,
  role:Role,
  currentAlignment:U("GOOD","EVIL")
}

TaskType = U(
  "PHILOSOPHER_ACTION","MINION_INFO","DEMON_INFO",
  "SNAKE_CHARMER_ACTION","EVIL_TWIN_SETUP","WITCH_ACTION",
  "CERENOVUS_ACTION","CLOCKMAKER_INFORMATION","DREAMER_ACTION",
  "SEAMSTRESS_ACTION","MATHEMATICIAN_INFORMATION"
)

TaskClass = U(
  "SYSTEM_INFORMATION","ROLE_ACTION","ROLE_INFORMATION","ROLE_SETUP"
)

SettlementPolicy = U(
  "REEVALUATE_SOURCE_AT_SETTLEMENT",
  "RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT"
)

TaskSource = U(
  {kind:"ROLE",playerId:ID,seatNumber:Seat,role:Role},
  {kind:"SYSTEM",systemTaskType:U("MINION_INFO","DEMON_INFO")},
  {
    kind:"PHILOSOPHER_GAINED_ABILITY",
    playerId:ID,
    seatNumber:Seat,
    sourceRole:Role,
    chosenRole:Role,
    opportunityId:ID,
    sourceCharacterStateRevision:PI
  }
)

Task = {
  taskId:ID,
  taskType:TaskType,
  taskClass:TaskClass,
  orderKey:{baseOrder:I,insertionOrder:I},
  source:TaskSource,
  status:"PENDING",
  settlementPolicy:SettlementPolicy
}
```

### Exact 14-field envelope

```text
{
  category:"domain",
  eventId:ID,
  gameId:ID,
  eventSequence:PI,
  batchId:ID,
  gameVersion:PI,
  eventType:DomainEventTypeV1,
  eventVersion:1,
  rulesBaselineVersion:S,
  commandId:ID,
  createdAt:S,
  correlationId:ID,
  causationId:ID,
  payload:PayloadByEventTypeV1[eventType]
}
```

`createdAt` is preserved exactly and included in canonical event value. P2F1 does not parse, normalize, reformat, or impose an ISO rule.

`DomainEventTypeV1` is the closed union of the registry below. `PayloadByEventTypeV1` is the exact mapping from each registry member to its numbered payload schema in this correction.

### Exact event registry

```text
GameCreated
ScriptSelected
SeamstressResolutionCapabilityDeclared
SetupGenerated
PlayerRosterCreated
CharactersAssigned
PhaseTransitioned
FirstNightInitialized
InitialPrivateKnowledgeEstablished
FirstNightTaskPlanCreated
FirstNightActionOpportunityCreated
PhilosopherActionDeferred
SeamstressActionDeferred
SeamstressTargetsChosen
SeamstressAbilitySpent
SeamstressInformationDelivered
PhilosopherAbilityChosen
PhilosopherAbilityGranted
AbilityImpairmentApplied
FirstNightTaskInserted
FirstNightTaskInsertedV2
SnakeCharmerTargetChosen
SnakeCharmerDemonSwapApplied
SnakeCharmerNoSwapResolved
SnakeCharmerIneffectiveResolved
WitchTargetChosen
WitchDeathPendingMarked
WitchIneffectiveResolved
CerenovusChoiceRecorded
CerenovusMadnessMarked
CerenovusMadnessInstructionDelivered
DreamerTargetChosen
DreamerInformationDelivered
ClockmakerInformationDelivered
MathematicianInformationDelivered
EvilTwinPairEstablished
EvilTwinInformationDelivered
MinionInformationDelivered
DemonInformationDelivered
ScheduledTaskSettled
```

The compile-time mapped registry and runtime literal list each contain these 40 names exactly once and no other name.

### Payload schemas 1–10

```text
01 GameCreated = {
  gameId:ID,rootSeed:S,rulesBaselineVersion:S,
  playerCount:I,humanPlayerCount:I,aiPlayerCount:I,storytellerCount:I
}

02 ScriptSelected = {
  rulesBaselineVersion:S,scriptId:S,scriptName:S,
  edition:"sects-and-violets"
}

03 SeamstressResolutionCapabilityDeclared = {
  rulesBaselineVersion:S,
  capabilityVersion:"seamstress-snv-first-night-resolution-v1",
  scriptId:"sects-and-violets",
  supportedRoleCatalogSignature:"canonical-role-catalog-v1:60ac4718",
  targetPopulationModel:"FIXED_ROSTER_WITHOUT_LIFE_OR_TRAVELLER_STATE",
  alignmentModel:"NATIVE_CURRENT_ALIGNMENT_ONLY",
  sourceEffectCoverage:"REPRESENTED_IMPAIRMENTS_WITH_UNRESOLVED_CONTINUOUS_EFFECTS",
  deliveryPolicyVersion:"seamstress-truth-favoring-delivery-policy-v1"
}

04 SetupGenerated = {
  scriptId:"sects-and-violets",
  setupAlgorithmVersion:S,
  randomAlgorithmVersion:S,
  randomStream:S,
  roleCatalogVersion:S,
  roleCatalogSnapshot:{
    scriptId:"sects-and-violets",edition:"sects-and-violets",
    roleCatalogVersion:S,roles:Arr<Role>,canonicalSignature:S
  },
  roleCatalogSignature:S,
  roleCatalogSignatureAlgorithm:S,
  constraintsSnapshot:{
    lockedRoleIds:Arr<ID>,excludedRoleIds:Arr<ID>,exactRoleIds:Arr<ID>
  },
  preModifierCounts:{TOWNSFOLK:I,OUTSIDER:I,MINION:I,DEMON:I},
  postModifierCounts:{TOWNSFOLK:I,OUTSIDER:I,MINION:I,DEMON:I},
  actualRoles:Arr<Role>,
  demonRole:Role,
  setupModifiersApplied:Arr<{roleId:ID,outsiderDelta:I,townsfolkDelta:I}>,
  demonBluffs:Arr<Role>,
  validationSummary:{
    actualRoleCount:I,demonBluffCount:I,roleIdsUnique:boolean,
    demonRoleCount:I,minionRoleCount:I,
    actualRolesMatchPostModifierCounts:boolean
  },
  rulesBaselineVersion:S
}

05 PlayerRosterCreated = {
  rulesBaselineVersion:S,rosterVersion:S,
  entries:Arr<{
    playerId:ID,seatNumber:Seat,playerKind:U("HUMAN","AI"),displayName:S
  }>
}

06 CharactersAssigned = {
  rulesBaselineVersion:S,rosterVersion:S,assignmentAlgorithmVersion:S,
  randomAlgorithmVersion:S,randomStream:S,roleCatalogSignature:S,
  assignments:Arr<{playerId:ID,seatNumber:Seat,role:Role}>
}

GamePhase = U(
  "GAME_CREATION","SCRIPT_SELECTION","SETUP_GENERATION",
  "CHARACTER_ASSIGNMENT","FIRST_NIGHT","DAWN_RESOLUTION",
  "DAY_DISCUSSION","NOMINATION_WINDOW","VOTING",
  "EXECUTION_RESOLUTION","NIGHT_TASKS","GAME_ENDED"
)

TransitionReason = U(
  "SCRIPT_SELECTED","SETUP_GENERATED","CHARACTERS_ASSIGNED",
  "FIRST_NIGHT_COMPLETED","DAWN_COMPLETED","NOMINATION_OPENED",
  "VOTE_OPENED","VOTE_COMPLETED","NOMINATIONS_CLOSED",
  "EXECUTION_RESOLVED","NIGHT_TASKS_COMPLETED","GAME_ENDED"
)

07 PhaseTransitioned = {
  rulesBaselineVersion:S,fromPhase:GamePhase,toPhase:GamePhase,
  transitionReason:TransitionReason,
  dayNumberBefore:NN,dayNumberAfter:NN,
  nightNumberBefore:NN,nightNumberAfter:NN
}

08 FirstNightInitialized = {
  rulesBaselineVersion:S,initializationVersion:S,nightNumber:1,
  rosterVersion:S,assignmentAlgorithmVersion:S,roleCatalogSignature:S
}

09 InitialPrivateKnowledgeEstablished = {
  rulesBaselineVersion:S,knowledgeModelVersion:S,knowledgeStage:S,
  rosterVersion:S,assignmentAlgorithmVersion:S,roleCatalogSignature:S,
  entries:Arr<{kind:"OWN_CHARACTER",recipientPlayerId:ID,role:Role}>
}

10 FirstNightTaskPlanCreated = {
  nightNumber:1,
  taskPlanVersion:U("first-night-task-plan-v1","first-night-task-plan-v2"),
  taskCatalogVersion:"snv-first-night-task-catalog-v1",
  taskCatalogSignatureAlgorithm:"canonical-first-night-task-catalog-v1",
  taskCatalogSignature:S,
  taskCatalogSnapshot:{
    taskCatalogVersion:"snv-first-night-task-catalog-v1",
    taskCatalogSignatureAlgorithm:"canonical-first-night-task-catalog-v1",
    taskCatalogSignature:S,
    definitions:Arr<U(
      {
        taskType:TaskType,taskClass:TaskClass,baseOrder:I,
        sourceKind:"ROLE",
        settlementPolicy:"REEVALUATE_SOURCE_AT_SETTLEMENT",
        roleId:ID
      },
      {
        taskType:U("MINION_INFO","DEMON_INFO"),
        taskClass:"SYSTEM_INFORMATION",baseOrder:I,sourceKind:"SYSTEM",
        settlementPolicy:"RESOLVE_CURRENT_EVIL_TEAM_AT_SETTLEMENT",
        systemTaskType:U("MINION_INFO","DEMON_INFO")
      }
    )>
  },
  rosterVersion:S,assignmentAlgorithmVersion:S,roleCatalogSignature:S,
  knowledgeModelVersion:"initial-own-character-knowledge-v1",
  knowledgeStage:"OWN_CHARACTER_BOOTSTRAP",
  tasks:Arr<Task>,rulesBaselineVersion:S
}
```

### Payload schema 11

```text
ActionBase<T> = {
  taskId:ID,taskType:T,sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceRole:Role,sourceCharacterStateRevision:PI
}

BaseDreamerSource = {
  sourceContractVersion:"dreamer-base-source-contract-v1",kind:"BASE",
  taskPlanVersion:"first-night-task-plan-v2",taskId:ID,
  taskType:"DREAMER_ACTION",sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceRoleId:"dreamer",sourceRoleTenureId:ID,
  sourceCharacterStateRevision:PI,sourceAbilityInstanceId:ID
}

GainedDreamerSource = {
  sourceContractVersion:"dreamer-philosopher-gained-source-contract-v1",
  kind:"PHILOSOPHER_GAINED_V2",
  taskPlanVersion:"first-night-task-plan-v2",
  schedulingVersion:"philosopher-gained-first-night-scheduling-v2",
  taskId:ID,taskType:"DREAMER_ACTION",
  taskSourceKind:"PHILOSOPHER_GAINED_ABILITY",
  sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceRoleId:"philosopher",chosenRoleId:"dreamer",
  sourceRoleTenureId:ID,sourceCharacterStateRevision:PI,
  philosopherOpportunityId:ID,grantId:ID,sourceAbilityInstanceId:ID,
  abilityInstance:{
    provenanceVersion:"first-night-ability-instance-provenance-v1",
    kind:"PHILOSOPHER_GAINED_TASK_V2",abilityInstanceId:ID,
    abilityRoleId:"dreamer",taskId:ID,sourcePlayerId:ID,
    sourceSeatNumber:Seat,philosopherOpportunityId:ID,grantId:ID,
    sourceCharacterStateRevision:PI,
    schedulingVersion:"philosopher-gained-first-night-scheduling-v2"
  },
  grantReference:{
    kind:"PHILOSOPHER_GRANT_V1",grantId:ID,philosopherOpportunityId:ID,
    sourcePlayerId:ID,sourceSeatNumber:Seat,sourceRoleId:"philosopher",
    chosenRoleId:"dreamer",sourceCharacterStateRevision:PI
  },
  taskInsertionReference:{
    kind:"FIRST_NIGHT_TASK_INSERTION_V2",taskId:ID,
    taskPlanVersion:"first-night-task-plan-v2",
    schedulingVersion:"philosopher-gained-first-night-scheduling-v2",
    philosopherOpportunityId:ID,grantId:ID,sourcePlayerId:ID,
    sourceSeatNumber:Seat,sourceRoleId:"philosopher",
    chosenRoleId:"dreamer",sourceCharacterStateRevision:PI
  }
}

11 FirstNightActionOpportunityCreated = U(
  ActionBase<"PHILOSOPHER_ACTION"> & {
    rulesBaselineVersion:S,nightNumber:1,opportunityId:ID,
    opportunityKind:"PHILOSOPHER_FIRST_NIGHT_ACTION",
    opportunityStatus:U("OPEN","CLOSED"),
    visibility:{
      canDefer:true,
      supportedDecisionKinds:["DEFER","CHOOSE_GOOD_CHARACTER"],
      futureUnsupportedDecisionKinds:[]
    }
  },
  ActionBase<"SNAKE_CHARMER_ACTION"> & {
    rulesBaselineVersion:S,nightNumber:1,opportunityId:ID,
    opportunityKind:"SNAKE_CHARMER_FIRST_NIGHT_ACTION",
    opportunityStatus:U("OPEN","CLOSED"),
    visibility:{
      canChooseTarget:true,supportedDecisionKinds:["CHOOSE_PLAYER"],
      targetSchema:"ANY_LIVING_PLAYER"
    }
  },
  ActionBase<"WITCH_ACTION"> & {
    rulesBaselineVersion:S,nightNumber:1,opportunityId:ID,
    opportunityKind:"WITCH_FIRST_NIGHT_ACTION",
    opportunityStatus:U("OPEN","CLOSED"),
    visibility:{
      canChooseTarget:true,supportedDecisionKinds:["CHOOSE_PLAYER"],
      targetSchema:"ANY_PLAYER"
    }
  },
  ActionBase<"CERENOVUS_ACTION"> & {
    rulesBaselineVersion:S,nightNumber:1,opportunityId:ID,
    opportunityKind:"CERENOVUS_FIRST_NIGHT_ACTION",
    opportunityStatus:U("OPEN","CLOSED"),
    sourceRoleTenureId:ID,sourceAbilityInstanceId:ID,
    abilitySource:{
      kind:"ROLE_TENURE",abilityRoleId:"cerenovus",roleTenureId:ID,
      acquiredCharacterStateRevision:PI
    },
    visibility:{
      canChooseTarget:true,canChooseCharacter:true,
      supportedDecisionKinds:["CHOOSE_PLAYER_AND_CHARACTER"],
      targetSchema:"ANY_MODELED_ROSTER_PLAYER",
      characterSchema:"ON_SCRIPT_TOWNSFOLK_OR_OUTSIDER"
    }
  },
  ActionBase<"DREAMER_ACTION"> & {
    rulesBaselineVersion:S,nightNumber:1,opportunityId:ID,
    opportunityKind:"DREAMER_FIRST_NIGHT_ACTION",
    opportunityStatus:U("OPEN","CLOSED"),
    visibility:{
      canChooseTarget:true,supportedDecisionKinds:["CHOOSE_PLAYER"],
      targetSchema:"OTHER_NON_TRAVELLER_PLAYER"
    }
  },
  ActionBase<"DREAMER_ACTION"> & {
    rulesBaselineVersion:S,
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v2",
    nightNumber:1,opportunityId:ID,
    opportunityKind:"DREAMER_FIRST_NIGHT_ACTION_V2",
    opportunityStatus:U("OPEN","CLOSED"),sourceContract:BaseDreamerSource,
    visibility:{
      visibilitySchemaVersion:"dreamer-first-night-action-visibility-v2",
      canChooseTarget:false,supportedDecisionKinds:[],
      futureUnsupportedDecisionKinds:["CHOOSE_PLAYER"],
      futureTargetSchema:"OTHER_NON_TRAVELLER_PLAYER"
    }
  },
  ActionBase<"DREAMER_ACTION"> & {
    rulesBaselineVersion:S,
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v3",
    nightNumber:1,opportunityId:ID,
    opportunityKind:"DREAMER_FIRST_NIGHT_ACTION_V3",
    opportunityStatus:U("OPEN","CLOSED"),sourceContract:BaseDreamerSource,
    visibility:{
      visibilitySchemaVersion:"dreamer-first-night-action-visibility-v3",
      canChooseTarget:true,supportedDecisionKinds:["CHOOSE_PLAYER"],
      futureUnsupportedDecisionKinds:[],
      targetSchema:"OTHER_NON_TRAVELLER_MODELED_PLAYER"
    }
  },
  ActionBase<"DREAMER_ACTION"> & {
    rulesBaselineVersion:S,
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v4",
    nightNumber:1,opportunityId:ID,
    opportunityKind:"DREAMER_FIRST_NIGHT_ACTION_V4",
    opportunityStatus:U("OPEN","CLOSED"),sourceContract:GainedDreamerSource,
    visibility:{
      visibilitySchemaVersion:"dreamer-first-night-action-visibility-v4",
      canChooseTarget:true,supportedDecisionKinds:["CHOOSE_PLAYER"],
      futureUnsupportedDecisionKinds:[],
      targetSchema:"OTHER_NON_TRAVELLER_MODELED_PLAYER"
    }
  },
  ActionBase<"SEAMSTRESS_ACTION"> & {
    rulesBaselineVersion:S,nightNumber:1,opportunityId:ID,
    opportunityKind:"SEAMSTRESS_FIRST_NIGHT_ACTION",
    opportunityStatus:U("OPEN","CLOSED"),
    visibility:{
      canDefer:true,supportedDecisionKinds:["DEFER"],
      futureUnsupportedDecisionKinds:["CHOOSE_TWO_PLAYERS"]
    }
  },
  ActionBase<"SEAMSTRESS_ACTION"> & {
    rulesBaselineVersion:S,nightNumber:1,opportunityId:ID,
    opportunityKind:"SEAMSTRESS_FIRST_NIGHT_ACTION",
    opportunityStatus:U("OPEN","CLOSED"),sourceRoleTenureId:ID,
    abilitySource:U(
      {
        kind:"ROLE_TENURE",abilityRoleId:"seamstress",roleTenureId:ID,
        acquiredCharacterStateRevision:PI
      },
      {
        kind:"PHILOSOPHER_GRANT",abilityRoleId:"seamstress",grantId:ID,
        sourceRoleTenureId:ID,acquiredCharacterStateRevision:PI
      }
    ),
    abilityInstanceId:ID,abilityUseEntitlementId:ID,
    visibility:{
      visibilitySchemaVersion:"seamstress-first-night-action-v2",
      resolutionCapabilityVersion:"seamstress-snv-first-night-resolution-v1",
      canDefer:true,canChooseTargets:true,
      supportedDecisionKinds:["DEFER","CHOOSE_TWO_PLAYERS"],
      futureUnsupportedDecisionKinds:[],
      targetSchema:"EXACTLY_TWO_DISTINCT_OTHER_MODELED_PLAYERS"
    }
  }
)
```

The union has exactly ten branches. Intersection notation means one merged exact key set.

### Payload schemas 12–21

```text
12 PhilosopherActionDeferred =
  ActionBase<"PHILOSOPHER_ACTION"> & {
    rulesBaselineVersion:S,nightNumber:1,opportunityId:ID,
    decisionKind:"DEFER"
  }

13 SeamstressActionDeferred = U(
  ActionBase<"SEAMSTRESS_ACTION"> & {
    rulesBaselineVersion:S,nightNumber:1,opportunityId:ID,
    decisionKind:"DEFER"
  },
  {
    rulesBaselineVersion:S,
    deferSchemaVersion:"seamstress-action-deferred-v2",
    nightNumber:1,taskId:ID,taskType:"SEAMSTRESS_ACTION",
    opportunityId:ID,decisionKind:"DEFER",abilityInstanceId:ID,
    abilityUseEntitlementId:ID,sourceRoleTenureId:ID,
    sourcePlayerId:ID,sourceSeatNumber:Seat,sourceRole:Role,
    opportunityCharacterStateRevision:PI,
    settlementCharacterStateRevision:PI
  }
)

14 SeamstressTargetsChosen = {
  rulesBaselineVersion:S,actionSchemaVersion:"seamstress-action-v2",
  nightNumber:1,taskId:ID,taskType:"SEAMSTRESS_ACTION",
  opportunityId:ID,decisionKind:"CHOOSE_TWO_PLAYERS",
  abilityInstanceId:ID,abilityUseEntitlementId:ID,sourceRoleTenureId:ID,
  sourcePlayerId:ID,sourceSeatNumber:Seat,sourceRole:Role,
  opportunityCharacterStateRevision:PI,
  settlementCharacterStateRevision:PI,
  targetPlayerIds:[ID,ID],targetSeatNumbers:[Seat,Seat]
}

15 SeamstressAbilitySpent = {
  rulesBaselineVersion:S,
  spendModelVersion:"seamstress-ability-spend-v1",
  nightNumber:1,taskId:ID,taskType:"SEAMSTRESS_ACTION",
  opportunityId:ID,abilityInstanceId:ID,abilityUseEntitlementId:ID,
  sourceRoleTenureId:ID,sourcePlayerId:ID,sourceSeatNumber:Seat,
  opportunityCharacterStateRevision:PI,
  settlementCharacterStateRevision:PI,
  spendReason:"LEGAL_TWO_PLAYER_SELECTION"
}

ImpEvidence = {
  impairmentId:ID,impairmentKind:U("DRUNK","POISONED"),
  impairmentSourceKind:U(
    "PHILOSOPHER_CHOSEN_DUPLICATE","SNAKE_CHARMER_DEMON_HIT"
  ),
  appliedCharacterStateRevision:PI
}

AnswerCandidate = {
  candidateId:ID,answer:U("YES","NO"),truthValue:U("TRUE","FALSE")
}

16 SeamstressInformationDelivered = {
  rulesBaselineVersion:S,
  informationModelVersion:"seamstress-information-model-v1",
  knowledgeStage:"SEAMSTRESS_INFORMATION",
  nightNumber:1,taskId:ID,taskType:"SEAMSTRESS_ACTION",
  opportunityId:ID,abilityInstanceId:ID,abilityUseEntitlementId:ID,
  sourceRoleTenureId:ID,sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceRole:Role,opportunityCharacterStateRevision:PI,
  settlementCharacterStateRevision:PI,
  targetPlayerIds:[ID,ID],targetSeatNumbers:[Seat,Seat],
  comparison:{
    characterStateRevision:PI,
    alignmentModel:"NATIVE_CURRENT_ALIGNMENT_ONLY",
    targets:[
      {playerId:ID,seatNumber:Seat,currentAlignment:U("GOOD","EVIL")},
      {playerId:ID,seatNumber:Seat,currentAlignment:U("GOOD","EVIL")}
    ],
    ruleCorrectAnswer:U("YES","NO")
  },
  sourceEffectiveness:U(
    {
      kind:"KNOWN_INEFFECTIVE",
      representedImpairments:[ImpEvidence,ImpEvidence],
      unresolvedEffectKinds:["CONTINUOUS_POISON_NOT_MODELED"]
    },
    {
      kind:"NOT_PROVEN",representedImpairments:[],
      unresolvedEffectKinds:["CONTINUOUS_POISON_NOT_MODELED"]
    }
  ),
  deliveryConstraint:U(
    {kind:"NONE"},
    {
      kind:"VORTOX_FALSE_REQUIRED",evaluatedCharacterStateRevision:PI,
      vortoxPlayerId:ID,vortoxSeatNumber:Seat,vortoxRoleTenureId:ID
    }
  ),
  answerCandidateSet:{
    candidateModelVersion:"seamstress-answer-candidates-v1",
    candidates:[AnswerCandidate,AnswerCandidate],
    legalityKnowledge:U(
      {kind:"COMPLETE",legalCandidateIds:U([ID],[ID,ID])},
      {kind:"PARTIAL",knownLegalCandidateIds:[ID],unresolvedCandidateIds:[ID]}
    ),
    selectedCandidateId:ID
  },
  informationReliability:U(
    "RULE_CORRECT_SELECTED_WITH_EFFECTIVENESS_NOT_PROVEN",
    "RULE_CORRECT_SELECTED_WITH_KNOWN_IMPAIRMENT",
    "VORTOX_CONSTRAINED_FALSE"
  ),
  simulationReason:U(
    "TRUTH_FAVORING_DEFAULT","TRUTH_ALLOWED_WHILE_REPRESENTED_IMPAIRED",
    "FALSE_REQUIRED_BY_VORTOX"
  ),
  deliveredAnswer:U("YES","NO")
}

17 PhilosopherAbilityChosen = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,
  taskType:"PHILOSOPHER_ACTION",opportunityId:ID,
  decisionKind:"CHOOSE_GOOD_CHARACTER",sourcePlayerId:ID,
  sourceSeatNumber:Seat,sourceRole:Role,sourceCharacterStateRevision:PI,
  chosenRole:Role,chosenRoleId:ID,roleCatalogSignature:S
}

18 PhilosopherAbilityGranted = {
  grantId:ID,sourcePlayerId:ID,sourceSeatNumber:Seat,sourceRole:Role,
  sourceCharacterStateRevision:PI,chosenRole:Role,chosenRoleId:ID,
  chosenRoleCatalogSignature:S,grantedAtTaskId:ID,
  grantedAtOpportunityId:ID,rulesBaselineVersion:S,
  nightNumber:1,taskId:ID,opportunityId:ID
}

19 AbilityImpairmentApplied = U(
  {
    impairmentId:ID,kind:"DRUNK",
    sourceKind:"PHILOSOPHER_CHOSEN_DUPLICATE",sourcePlayerId:ID,
    affectedPlayerId:ID,affectedSeatNumber:Seat,affectedRole:Role,
    chosenRoleId:ID,sourceCharacterStateRevision:PI,
    rulesBaselineVersion:S
  },
  {
    impairmentId:ID,kind:"POISONED",
    sourceKind:"SNAKE_CHARMER_DEMON_HIT",sourcePlayerId:ID,
    affectedPlayerId:ID,affectedSeatNumber:Seat,affectedRole:Role,
    sourceCharacterStateRevision:PI,rulesBaselineVersion:S
  }
)

20 FirstNightTaskInserted = {
  taskPlanVersion:S,taskId:ID,taskType:TaskType,taskClass:TaskClass,
  orderKey:{baseOrder:100,insertionOrder:1},
  source:{
    kind:"PHILOSOPHER_GAINED_ABILITY",playerId:ID,seatNumber:Seat,
    sourceRole:Role,chosenRole:Role,opportunityId:ID,
    sourceCharacterStateRevision:PI
  },
  status:"PENDING",settlementPolicy:SettlementPolicy,
  insertionReason:"PHILOSOPHER_GAINED_ABILITY",
  insertedByPlayerId:ID,insertedByOpportunityId:ID,
  sourceCharacterStateRevision:PI,chosenRole:Role,
  rulesBaselineVersion:S,nightNumber:1
}

21 FirstNightTaskInsertedV2 = {
  rulesBaselineVersion:S,nightNumber:1,
  schedulingVersion:"philosopher-gained-first-night-scheduling-v2",
  taskPlanVersion:"first-night-task-plan-v2",taskCatalogVersion:S,
  taskCatalogSignatureAlgorithm:S,taskCatalogSignature:S,
  taskId:ID,taskType:TaskType,taskClass:TaskClass,targetRoleId:ID,
  targetCatalogBaseOrder:I,effectiveBaseOrder:I,
  tieBreakPolicy:"BASE_THEN_GAINED_BY_SOURCE_SEAT_THEN_TASK_ID_CODE_UNIT",
  tieBreakSourceSeatNumber:Seat,sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceRole:Role,chosenRole:Role,philosopherOpportunityId:ID,
  grantId:ID,sourceCharacterStateRevision:PI,status:"PENDING",
  settlementPolicy:SettlementPolicy,
  insertionReason:"PHILOSOPHER_GAINED_ABILITY"
}
```

### Payload schemas 22–31

```text
22 SnakeCharmerTargetChosen = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,
  taskType:"SNAKE_CHARMER_ACTION",opportunityId:ID,
  decisionKind:"CHOOSE_PLAYER",sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceRole:Role,sourceCharacterStateRevision:PI,
  targetPlayerId:ID,targetSeatNumber:Seat
}

23 SnakeCharmerDemonSwapApplied = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,
  taskType:"SNAKE_CHARMER_ACTION",opportunityId:ID,
  sourcePlayerId:ID,sourceSeatNumber:Seat,targetPlayerId:ID,
  targetSeatNumber:Seat,previousCharacterStateRevision:PI,
  nextCharacterStateRevision:PI,sourceBefore:StateEntry,
  targetBefore:StateEntry,sourceAfter:StateEntry,targetAfter:StateEntry,
  swapReason:"SNAKE_CHARMER_DEMON_HIT"
}

24 SnakeCharmerNoSwapResolved = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,
  taskType:"SNAKE_CHARMER_ACTION",opportunityId:ID,
  sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceCharacterStateRevision:PI,targetPlayerId:ID,
  targetSeatNumber:Seat,outcomeType:"NON_DEMON_TARGET_NO_SWAP"
}

25 SnakeCharmerIneffectiveResolved = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,
  taskType:"SNAKE_CHARMER_ACTION",opportunityId:ID,
  sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceCharacterStateRevision:PI,targetPlayerId:ID,targetSeatNumber:Seat,
  outcomeType:"SOURCE_IMPAIRED_NO_EFFECT",
  reason:U("SOURCE_DRUNK","SOURCE_POISONED"),
  sourceImpairmentId:ID,sourceImpairmentKind:U("DRUNK","POISONED")
}

26 WitchTargetChosen = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,taskType:"WITCH_ACTION",
  opportunityId:ID,decisionKind:"CHOOSE_PLAYER",sourcePlayerId:ID,
  sourceSeatNumber:Seat,sourceRole:Role,sourceCharacterStateRevision:PI,
  targetPlayerId:ID,targetSeatNumber:Seat
}

27 WitchDeathPendingMarked = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,taskType:"WITCH_ACTION",
  opportunityId:ID,sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceCharacterStateRevision:PI,targetPlayerId:ID,targetSeatNumber:Seat,
  pendingDeathId:S,trigger:"TARGET_NOMINATES_TOMORROW",
  markerVersion:"witch-death-pending-v1"
}

28 WitchIneffectiveResolved = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,taskType:"WITCH_ACTION",
  opportunityId:ID,sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceCharacterStateRevision:PI,targetPlayerId:ID,targetSeatNumber:Seat,
  outcomeType:"SOURCE_IMPAIRED_NO_EFFECT",
  reason:U("SOURCE_DRUNK","SOURCE_POISONED"),
  sourceImpairmentId:ID,sourceImpairmentKind:U("DRUNK","POISONED")
}

29 CerenovusChoiceRecorded = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,
  taskType:"CERENOVUS_ACTION",opportunityId:ID,sourcePlayerId:ID,
  sourceSeatNumber:Seat,sourceRole:Role,sourceRoleTenureId:ID,
  sourceAbilityInstanceId:ID,
  abilitySource:{
    kind:"ROLE_TENURE",abilityRoleId:"cerenovus",roleTenureId:ID,
    acquiredCharacterStateRevision:PI
  },
  opportunityCharacterStateRevision:PI,
  settlementCharacterStateRevision:PI,
  modelVersion:"cerenovus-choice-v1",choiceId:S,
  decisionKind:"CHOOSE_PLAYER_AND_CHARACTER",targetPlayerId:ID,
  targetSeatNumber:Seat,chosenGoodRoleId:ID,chosenGoodRole:Role,
  roleCatalogSignature:S
}

30 CerenovusMadnessMarked = {
  rulesBaselineVersion:S,markerVersion:"cerenovus-madness-marker-v1",
  nightNumber:1,appliedNightNumber:1,markerId:S,choiceId:S,
  taskId:ID,taskType:"CERENOVUS_ACTION",opportunityId:ID,
  sourcePlayerId:ID,sourceSeatNumber:Seat,sourceRole:Role,
  sourceRoleTenureId:ID,sourceAbilityInstanceId:ID,
  abilitySource:{
    kind:"ROLE_TENURE",abilityRoleId:"cerenovus",roleTenureId:ID,
    acquiredCharacterStateRevision:PI
  },
  sourceCharacterStateRevision:PI,targetPlayerId:ID,targetSeatNumber:Seat,
  madAboutRoleId:ID,madAboutRole:Role,roleCatalogSignature:S,
  markerStatus:"ESTABLISHED",instructionWindow:"TOMORROW_DAY_AND_NIGHT",
  removalRule:"NEXT_DAWN_OR_SOURCE_DEATH_OR_LEAVES_PLAY",
  sourceAbilityDependency:{
    kind:"SOURCE_ABILITY_INSTANCE",permanentLossPolicy:"REMOVE_MARKER",
    reacquisitionPolicy:"NEW_INSTANCE_DOES_NOT_RESUME"
  }
}

31 CerenovusMadnessInstructionDelivered = {
  rulesBaselineVersion:S,
  modelVersion:"cerenovus-madness-instruction-v1",
  nightNumber:1,deliveryId:S,choiceId:S,markerId:S,taskId:ID,
  taskType:"CERENOVUS_ACTION",opportunityId:ID,recipientPlayerId:ID,
  recipientSeatNumber:Seat,selectedByCharacter:"cerenovus",
  madAboutRoleId:ID,madAboutRole:Role,roleCatalogSignature:S,
  instructionWindow:"TOMORROW_DAY_AND_NIGHT",
  deliveryCharacterStateRevision:PI,deliveryStatus:"DELIVERED"
}
```

### Payload schemas 32–33

```text
TargetCommon = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,
  taskType:"DREAMER_ACTION",opportunityId:ID,
  decisionKind:"CHOOSE_PLAYER",sourcePlayerId:ID,sourceSeatNumber:Seat,
  sourceRole:Role,sourceCharacterStateRevision:PI,
  targetPlayerId:ID,targetSeatNumber:Seat
}

32 DreamerTargetChosen = U(
  TargetCommon,
  TargetCommon & {
    targetSchemaVersion:"dreamer-target-chosen-v2",
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v3",
    sourceContract:BaseDreamerSource
  },
  TargetCommon & {
    targetSchemaVersion:"dreamer-target-chosen-v3",
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v4",
    evaluatedCharacterStateRevision:PI,
    sourceContract:GainedDreamerSource,
    abilityRoleId:"dreamer"
  }
)

DeliveryCore = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,
  taskType:"DREAMER_ACTION",opportunityId:ID,
  knowledgeModelVersion:"dreamer-information-model-v1",
  knowledgeStage:"DREAMER_INFORMATION",sourcePlayerId:ID,
  sourceSeatNumber:Seat,sourceCharacterStateRevision:PI,
  targetPlayerId:ID,targetSeatNumber:Seat
}

VortoxConstraint = {
  constraintVersion:"dreamer-vortox-constraint-v1",
  kind:"VORTOX_FORCED_FALSE_REQUIRED",vortoxPlayerId:ID,
  vortoxSeatNumber:Seat,vortoxRoleId:"vortox",vortoxRoleTenureId:ID,
  evaluatedCharacterStateRevision:PI
}

DrunkSource = {
  impairmentId:ID,kind:"DRUNK",
  sourceKind:"PHILOSOPHER_CHOSEN_DUPLICATE",sourcePlayerId:ID,
  affectedPlayerId:ID,affectedSeatNumber:Seat,affectedRole:Role,
  chosenRoleId:"dreamer",sourceCharacterStateRevision:PI
}

PairCandidate = {
  candidateId:ID,goodRole:Role,evilRole:Role,
  truthClassification:U("TRUE","FALSE")
}

33 DreamerInformationDelivered = U(
  DeliveryCore & {
    informationReliability:U(
      {kind:"EFFECTIVE"},
      {
        kind:"SOURCE_IMPAIRED",reason:U("SOURCE_DRUNK","SOURCE_POISONED"),
        sourceImpairmentId:ID,sourceImpairmentKind:U("DRUNK","POISONED")
      }
    ),
    goodRole:Role,evilRole:Role,
    falseRolePolicyVersion:"dreamer-false-role-policy-v1"
  },
  DeliveryCore & {
    deliverySchemaVersion:"dreamer-information-delivered-v2",
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v3",
    sourceContract:BaseDreamerSource,informationReliability:{kind:"EFFECTIVE"},
    goodRole:Role,evilRole:Role,
    falseRolePolicyVersion:"dreamer-false-role-policy-v1"
  },
  DeliveryCore & {
    deliverySchemaVersion:"dreamer-information-delivered-v3",
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v3",
    sourceContract:BaseDreamerSource,
    informationReliability:{kind:"VORTOX_FORCED_FALSE"},
    vortoxConstraint:VortoxConstraint,goodRole:Role,evilRole:Role,
    falseRolePolicyVersion:"dreamer-false-role-policy-v1"
  },
  DeliveryCore & {
    deliverySchemaVersion:"dreamer-information-delivered-v4",
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v3",
    evaluatedCharacterStateRevision:PI,sourceContract:BaseDreamerSource,
    informationReliability:{
      kind:"VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK"
    },
    sourceImpairment:DrunkSource,vortoxConstraint:VortoxConstraint,
    goodRole:Role,evilRole:Role,
    falseRolePolicyVersion:"dreamer-false-role-policy-v1"
  },
  DeliveryCore & {
    deliverySchemaVersion:"dreamer-information-delivered-v5",
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v4",
    evaluatedCharacterStateRevision:PI,sourceContract:GainedDreamerSource,
    abilityRoleId:"dreamer",
    informationReliability:{kind:"PHILOSOPHER_GAINED_EFFECTIVE"},
    goodRole:Role,evilRole:Role,
    falseRolePolicyVersion:"dreamer-false-role-policy-v1"
  },
  DeliveryCore & {
    deliverySchemaVersion:"dreamer-information-delivered-v6",
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v4",
    evaluatedCharacterStateRevision:PI,sourceContract:GainedDreamerSource,
    abilityRoleId:"dreamer",
    informationReliability:{kind:"VORTOX_FORCED_FALSE"},
    vortoxConstraint:VortoxConstraint,goodRole:Role,evilRole:Role,
    falseRolePolicyVersion:"dreamer-false-role-policy-v1"
  },
  DeliveryCore & {
    deliverySchemaVersion:"dreamer-information-delivered-v7",
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v3",
    evaluatedCharacterStateRevision:PI,sourceContract:BaseDreamerSource,
    informationReliability:{
      kind:"CANONICAL_SOURCE_DRUNK_APPARENT_INFORMATION"
    },
    sourceImpairment:DrunkSource,
    currentDemonConstraint:{
      constraintVersion:"dreamer-non-vortox-current-demon-constraint-v1",
      kind:"UNIQUE_CURRENT_FANG_GU",demonPlayerId:ID,demonSeatNumber:Seat,
      demonRole:Role,evaluatedCharacterStateRevision:PI
    },
    apparentPairDecision:{
      candidateModelVersion:"dreamer-apparent-pair-candidate-model-v1",
      simulationPolicyVersion:"dreamer-canonical-drunk-pair-selection-policy-v1",
      legalCandidates:Arr<PairCandidate>,selectedCandidateId:ID
    },
    goodRole:Role,evilRole:Role
  },
  DeliveryCore & {
    deliverySchemaVersion:"dreamer-information-delivered-v8",
    opportunitySchemaVersion:"dreamer-first-night-action-opportunity-v3",
    evaluatedCharacterStateRevision:PI,sourceContract:BaseDreamerSource,
    informationReliability:{
      kind:"REPRESENTED_IMPAIRED_APPARENT_INFORMATION"
    },
    sourceImpairment:DrunkSource,
    currentDemonContext:{
      contextVersion:"dreamer-represented-impaired-current-demon-context-v1",
      kind:"UNIQUE_CURRENT_VIGORMORTIS_BOUNDED_SETTLEMENT_CONTEXT",
      demonPlayerId:ID,demonSeatNumber:Seat,demonRole:Role,
      evaluatedCharacterStateRevision:PI
    },
    apparentPairDecision:{
      candidateModelVersion:"dreamer-apparent-pair-candidate-model-v1",
      simulationPolicyVersion:"dreamer-represented-impaired-pair-selection-policy-v1",
      legalCandidates:Arr<PairCandidate>,selectedCandidateId:ID
    },
    goodRole:Role,evilRole:Role
  }
)
```

Every intersection above is one merged exact key set. No branch has an optional key.

### Payload schemas 34–40

```text
Distance = U(0,1,2,3,4,5,6)

DistanceSnapshot = {
  demonPlayerId:ID,demonSeatNumber:Seat,
  minionPlayerId:ID,minionSeatNumber:Seat,
  clockwiseDistance:I,counterClockwiseDistance:I,nearestDistance:Distance
}

34 ClockmakerInformationDelivered = {
  rulesBaselineVersion:S,informationModelVersion:"clockmaker-information-v1",
  knowledgeStage:"CLOCKMAKER_INFORMATION",deliveryId:S,nightNumber:1,
  taskId:ID,taskType:"CLOCKMAKER_INFORMATION",
  sourceContract:U(
    {
      kind:"BASE_CLOCKMAKER",taskId:ID,sourcePlayerId:ID,
      sourceSeatNumber:Seat,sourceRole:Role,taskPlanVersion:S
    },
    {
      kind:"PHILOSOPHER_GAINED_CLOCKMAKER",taskId:ID,sourcePlayerId:ID,
      sourceSeatNumber:Seat,sourceRole:Role,gainedRole:Role,grantId:ID,
      grantedAtTaskId:ID,grantedAtOpportunityId:ID,
      insertionCharacterStateRevision:PI
    }
  ),
  settlementCharacterStateRevision:PI,
  identityModel:"NATIVE_CHARACTER_TYPE_ONLY",ringSeatCount:12,
  nativeDemonReferences:[{playerId:ID,seatNumber:Seat,role:Role}],
  nativeMinionReferences:[
    {playerId:ID,seatNumber:Seat,role:Role},
    {playerId:ID,seatNumber:Seat,role:Role}
  ],
  pairDistanceSnapshots:[DistanceSnapshot,DistanceSnapshot],
  ruleCorrectDistance:Distance,
  sourceEffectiveness:U(
    {kind:"EFFECTIVE",representedImpairmentIds:[]},
    {
      kind:"KNOWN_DRUNK",representedImpairmentIds:[ID],
      sourceKind:"PHILOSOPHER_CHOSEN_DUPLICATE"
    }
  ),
  vortoxConstraint:U(
    {kind:"NONE"},
    {
      kind:"VORTOX_FALSE_REQUIRED",evaluatedCharacterStateRevision:PI,
      vortoxPlayerId:ID,vortoxSeatNumber:Seat,vortoxRoleTenureId:ID
    }
  ),
  outputDomain:[0,1,2,3,4,5,6],
  legalCandidateDistances:Arr<Distance>,selectedDistance:Distance,
  simulationPolicyVersion:"clockmaker-distance-selection-v1",
  simulationReason:U(
    "RULE_CORRECT_REQUIRED","DETERMINISTIC_SMALLEST_FALSE_HARMFUL_DEFAULT",
    "VORTOX_FALSE_REQUIRED_SMALLEST"
  ),
  informationReliability:U(
    "RULE_CORRECT_EFFECTIVE","DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS",
    "VORTOX_CONSTRAINED_FALSE"
  )
}

AbilityProvenanceBase = {
  provenanceVersion:"first-night-ability-instance-provenance-v1",
  abilityInstanceId:ID,abilityRoleId:ID,taskId:ID,
  sourcePlayerId:ID,sourceSeatNumber:Seat
}

AbilityInstance = U(
  AbilityProvenanceBase & {kind:"BASE_ROLE_TASK"},
  AbilityProvenanceBase & {
    kind:"PHILOSOPHER_GAINED_TASK_V1",philosopherOpportunityId:ID,
    grantId:ID,sourceCharacterStateRevision:PI
  },
  AbilityProvenanceBase & {
    kind:"PHILOSOPHER_GAINED_TASK_V2",philosopherOpportunityId:ID,
    grantId:ID,sourceCharacterStateRevision:PI,
    schedulingVersion:"philosopher-gained-first-night-scheduling-v2"
  },
  AbilityProvenanceBase & {
    kind:"EXPLICIT_DOMAIN_INSTANCE",sourceRoleTenureId:ID,existingInstanceId:ID
  }
)

RoleTenure = {
  roleTenureId:ID,playerId:ID,seatNumber:Seat,
  roleId:U("mathematician","philosopher","vortox"),
  acquiredCharacterStateRevision:PI,endedCharacterStateRevision:U(null,PI)
}

MatSourceCommon = {
  taskId:ID,sourcePlayerId:ID,sourceSeatNumber:Seat,sourceRole:Role,
  sourceRoleAtSettlement:Role,sourceRoleTenure:RoleTenure,
  settlementCharacterStateRevision:PI
}

MatSource = U(
  MatSourceCommon & {
    kind:"BASE_MATHEMATICIAN",
    taskPlanVersion:U("first-night-task-plan-v1","first-night-task-plan-v2"),
    abilityInstance:AbilityProvenanceBase & {kind:"BASE_ROLE_TASK"}
  },
  MatSourceCommon & {
    kind:"PHILOSOPHER_GAINED_MATHEMATICIAN_V1",
    taskPlanVersion:"first-night-task-plan-v1",chosenRole:Role,
    philosopherTaskId:ID,philosopherOpportunityId:ID,grantId:ID,
    sourceCharacterStateRevision:PI,
    abilityInstance:AbilityProvenanceBase & {
      kind:"PHILOSOPHER_GAINED_TASK_V1",philosopherOpportunityId:ID,
      grantId:ID,sourceCharacterStateRevision:PI
    }
  },
  MatSourceCommon & {
    kind:"PHILOSOPHER_GAINED_MATHEMATICIAN_V2",
    taskPlanVersion:"first-night-task-plan-v2",
    schedulingVersion:"philosopher-gained-first-night-scheduling-v2",
    chosenRole:Role,philosopherTaskId:ID,philosopherOpportunityId:ID,
    grantId:ID,sourceCharacterStateRevision:PI,
    abilityInstance:AbilityProvenanceBase & {
      kind:"PHILOSOPHER_GAINED_TASK_V2",philosopherOpportunityId:ID,
      grantId:ID,sourceCharacterStateRevision:PI,
      schedulingVersion:"philosopher-gained-first-night-scheduling-v2"
    }
  }
)

RepresentedImpairment = {
  impairmentId:ID,kind:U("DRUNK","POISONED"),
  sourceKind:U("PHILOSOPHER_CHOSEN_DUPLICATE","SNAKE_CHARMER_DEMON_HIT"),
  sourcePlayerId:ID,affectedPlayerId:ID,affectedSeatNumber:Seat,
  affectedRoleId:ID,affectedRole:Role,appliedCharacterStateRevision:PI,
  appliedByEventId:ID,appliedByEventSequence:PI
}

MatCount = U(0,1,2,3,4,5,6,7,8,9,10,11)

35 MathematicianInformationDelivered = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,
  taskType:"MATHEMATICIAN_INFORMATION",deliveryId:ID,
  deliveryEventSequence:PI,sourceContract:MatSource,
  resolutionModelVersion:"mathematician-first-night-count-resolution-v1",
  windowSnapshot:{
    windowVersion:"first-night-ability-outcome-window-v1",gameId:ID,
    nightNumber:1,rulesBaselineVersion:S,firstNightInitializedEventId:ID,
    startEventSequence:PI,startBoundary:"EXCLUSIVE",
    endEventSequence:PI,endBoundary:"INCLUSIVE"
  },
  ledgerVersion:"first-night-ability-outcome-ledger-v1",
  auditModelVersion:"first-night-ability-outcome-audit-v1",
  resolvingAbilityInstanceId:ID,qualifyingAbnormalFactIds:Arr<ID>,
  distinctAbnormalPlayers:Arr<{
    playerId:ID,seatNumber:Seat,supportingFactIds:Arr<ID>
  }>,
  excludedResolvingSourceFactIds:Arr<ID>,excludedOwnAbilityFactIds:Arr<ID>,
  ignoredNormalFactIds:Arr<ID>,ignoredPendingFactIds:Arr<ID>,
  redundantUnresolvedFactIds:Arr<ID>,trueCount:MatCount,
  numberDomainVersion:"mathematician-fixed-12-number-domain-v1",
  candidateDomain:[0,1,2,3,4,5,6,7,8,9,10,11],
  legalCandidateCounts:Arr<MatCount>,selectedCount:MatCount,
  sourceEffectiveness:U(
    {kind:"EFFECTIVE",representedImpairments:[]},
    {kind:"KNOWN_DRUNK",representedImpairments:[RepresentedImpairment]},
    {kind:"KNOWN_POISONED",representedImpairments:[RepresentedImpairment]}
  ),
  vortoxConstraint:U(
    {kind:"NONE_NO_CURRENT_VORTOX",evaluatedCharacterStateRevision:PI},
    {
      kind:"NONE_CURRENT_VORTOX_KNOWN_IMPAIRED",
      evaluatedCharacterStateRevision:PI,vortoxPlayerId:ID,
      vortoxSeatNumber:Seat,vortoxRoleSnapshot:Role,
      vortoxRoleTenure:RoleTenure,impairment:RepresentedImpairment
    },
    {
      kind:"VORTOX_FALSE_REQUIRED",evaluatedCharacterStateRevision:PI,
      vortoxPlayerId:ID,vortoxSeatNumber:Seat,
      vortoxRoleSnapshot:Role,vortoxRoleTenure:RoleTenure
    }
  ),
  simulationPolicyVersion:"mathematician-smallest-false-policy-v1",
  informationReliability:U(
    "DETERMINISTIC_FALSE_WITH_KNOWN_DRUNKENNESS",
    "VORTOX_CONSTRAINED_FALSE","RULE_CORRECT",
    "DETERMINISTIC_FALSE_WITH_KNOWN_POISONING"
  ),
  knowledgeModelVersion:"mathematician-knowledge-v1",
  knowledgeStage:"MATHEMATICIAN_INFORMATION",
  settlementCharacterStateRevision:PI
}

36 EvilTwinPairEstablished = {
  pairId:S,nightNumber:1,taskId:ID,taskType:"EVIL_TWIN_SETUP",
  evilTwinPlayer:PlayerRef,goodTwinPlayer:PlayerRef,
  evilTwinRole:Role,goodTwinRole:Role,
  evilTwinAlignment:"EVIL",goodTwinAlignment:"GOOD",
  characterStateRevision:PI,
  pairingPolicyVersion:"evil-twin-pairing-policy-v1",
  rulesBaselineVersion:S
}

37 EvilTwinInformationDelivered = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,
  taskType:"EVIL_TWIN_SETUP",pairId:S,
  knowledgeModelVersion:"evil-twin-knowledge-model-v1",
  knowledgeStage:"EVIL_TWIN_SETUP_INFORMATION",
  characterStateRevision:PI,
  entries:Arr<{
    recipientPlayerId:ID,kind:"EVIL_TWIN_PAIR",counterpart:PlayerRef
  }>
}

38 MinionInformationDelivered = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,taskType:"MINION_INFO",
  knowledgeModelVersion:"first-night-team-knowledge-v1",
  knowledgeStage:"MINION_INFORMATION",characterStateRevision:PI,
  resolvedEvilTeam:{
    characterStateRevision:PI,demon:PlayerRef,minions:Arr<PlayerRef>
  },
  rosterVersion:S,roleCatalogSignature:S,
  entries:Arr<U(
    {kind:"DEMON_IDENTITY",recipientPlayerId:ID,demon:PlayerRef},
    {kind:"MINION_IDENTITIES",recipientPlayerId:ID,minions:Arr<PlayerRef>}
  )>
}

39 DemonInformationDelivered = {
  rulesBaselineVersion:S,nightNumber:1,taskId:ID,taskType:"DEMON_INFO",
  knowledgeModelVersion:"first-night-team-knowledge-v1",
  knowledgeStage:"DEMON_INFORMATION",characterStateRevision:PI,
  resolvedEvilTeam:{
    characterStateRevision:PI,demon:PlayerRef,minions:Arr<PlayerRef>
  },
  rosterVersion:S,roleCatalogSignature:S,
  entries:Arr<U(
    {kind:"MINION_IDENTITIES",recipientPlayerId:ID,minions:Arr<PlayerRef>},
    {kind:"DEMON_BLUFFS",recipientPlayerId:ID,roles:Arr<Role>}
  )>
}

40 ScheduledTaskSettled = {
  taskId:ID,taskType:TaskType,nightNumber:1,
  settlementVersion:"scheduled-task-settlement-v1",
  outcomeType:U(
    "MINION_INFORMATION_DELIVERED","DEMON_INFORMATION_DELIVERED",
    "PHILOSOPHER_DEFERRED","PHILOSOPHER_ABILITY_CHOSEN",
    "SNAKE_CHARMER_NON_DEMON_NO_SWAP","SNAKE_CHARMER_INEFFECTIVE",
    "SNAKE_CHARMER_DEMON_HIT_SWAP","EVIL_TWIN_PAIR_ESTABLISHED",
    "WITCH_DEATH_PENDING_MARKED","WITCH_INEFFECTIVE",
    "CERENOVUS_MADNESS_MARKED","CLOCKMAKER_INFORMATION_DELIVERED",
    "DREAMER_INFORMATION_DELIVERED","SEAMSTRESS_INFORMATION_DELIVERED",
    "SEAMSTRESS_DEFERRED","MATHEMATICIAN_INFORMATION_DELIVERED"
  ),
  characterStateRevision:PI,rulesBaselineVersion:S
}
```

### Exact event-result contract

```ts
type UnknownEventAdvisory =
  | "NONE"
  | "QUARANTINE_SOURCE_IF_PERSISTED_OR_PREVIOUSLY_ACCEPTED";

type ValidateUnknownDomainEventResult =
  | {
      readonly valid: true;
      readonly event: AnyDomainEventEnvelope;
      readonly captured: CapturedCanonicalValue;
      readonly advisory: "NONE";
    }
  | {
      readonly valid: false;
      readonly diagnostic: EventDiagnostic;
      readonly advisory:
        "QUARANTINE_SOURCE_IF_PERSISTED_OR_PREVIOUSLY_ACCEPTED";
    };
```

The advisory is conditional and non-operative. P2F1 never performs quarantine. Generic capture has no advisory.

The only raw-to-domain cast is module-internal and occurs after complete canonical capture, envelope validation, type/version selection, and exact matching payload validation. A collection-wide or earlier cast is forbidden.

Any event failure rejects the whole candidate. There is no skip, downgrade, conversion, repair, partial event, partial payload, partial token, or partial digest.

## D04 — Deterministic event diagnostics and hashes

### Event failure codes

```ts
type EventFailureCode =
  | CanonicalFailureCode
  | "EVENT_ENVELOPE_MISSING_KEY"
  | "EVENT_ENVELOPE_EXTRA_KEY"
  | "EVENT_ENVELOPE_FIELD_TYPE"
  | "UNKNOWN_EVENT_TYPE"
  | "UNSUPPORTED_EVENT_VERSION"
  | "EVENT_PAYLOAD_MISSING_KEY"
  | "EVENT_PAYLOAD_EXTRA_KEY"
  | "EVENT_PAYLOAD_FIELD_TYPE"
  | "UNSUPPORTED_PAYLOAD_VERSION_LITERAL"
  | "INVALID_EVENT_PAYLOAD";
```

### Exact event-validation precedence

1. `types.isProxy` returns `PROXY_VALUE`.
2. Apply canonical capture resource, ancestry, prototype, key, descriptor, array, and scalar precedence from D02.
3. Captured root not a record returns `EVENT_ENVELOPE_FIELD_TYPE` at root.
4. Scan the fixed 14-key envelope declaration order; first absent key returns `EVENT_ENVELOPE_MISSING_KEY`.
5. Raw-UTF-16-sort envelope extras; report only `OBJECT_KEY_ORDINAL` with `EVENT_ENVELOPE_EXTRA_KEY`.
6. Scan recognized envelope fields in declaration order; first primitive, ID, integer, range, or literal failure returns `EVENT_ENVELOPE_FIELD_TYPE`.
7. Unknown `eventType` returns `UNKNOWN_EVENT_TYPE`.
8. `eventVersion` other than `1` returns `UNSUPPORTED_EVENT_VERSION`.
9. Payload not a record returns `EVENT_PAYLOAD_FIELD_TYPE`.
10. Select a payload branch using only the shown discriminator/version literals. A correctly typed unsupported discriminator or version returns `UNSUPPORTED_PAYLOAD_VERSION_LITERAL`; wrong primitive kind returns `EVENT_PAYLOAD_FIELD_TYPE`.
11. Scan selected-branch declaration order; first absent key returns `EVENT_PAYLOAD_MISSING_KEY`.
12. Raw-UTF-16-sort payload extras; report only `OBJECT_KEY_ORDINAL` with `EVENT_PAYLOAD_EXTRA_KEY`.
13. Depth-first branch-declaration order; first wrong nested primitive, ID, range, tuple, dense array, or literal returns `EVENT_PAYLOAD_FIELD_TYPE`.
14. A closed-union combination matching no branch after discriminator processing returns `INVALID_EVENT_PAYLOAD`.

No error contains raw keys, values, IDs, bytes, hashes, state, or receipts. `null` admits only where a schema explicitly contains `null`. Present `undefined` fails capture with `UNDEFINED_VALUE`. An absent required key uses the relevant missing-key code.

### Raw-byte token boundary

```text
MAX_RAW_BYTE_HASH_INPUT_BYTES = 16777216
```

Exact failures:

```ts
type RawByteCaptureFailureCode =
  | "RAW_BYTE_PROXY_VALUE"
  | "RAW_BYTE_NOT_UINT8_ARRAY"
  | "RAW_BYTE_SHARED_ARRAY_BUFFER"
  | "RAW_BYTE_DETACHED_OR_INVALID_VIEW"
  | "RAW_BYTE_RESOURCE_LIMIT_EXCEEDED"
  | "RAW_BYTE_COPY_FAILED"
  | "INVALID_CAPTURED_RAW_BYTES";
```

`captureRawBytes(unknown)`:

1. calls `types.isProxy` before reflection;
2. rejects Proxy and revoked Proxy;
3. uses `node:util` brand checks to require a genuine `Uint8Array`;
4. rejects other typed arrays, views, buffers, getters, lookalikes, and primitives;
5. reads backing, offset, and length only through intrinsic typed-array operations;
6. rejects `SharedArrayBuffer`;
7. rejects detached or invalid views;
8. enforces the byte limit;
9. allocates one non-shared copy;
10. copies once through intrinsic typed-array operations without caller code;
11. stores the copy only in the private raw-token `WeakMap`.

P2F1 does not decode or parse these bytes. Strict replay JSON, duplicate-key handling, and artifact approval remain outside this Slice.

### Hash result contracts

All digests are lowercase 64-hex SHA-256. Hashes are integrity evidence, never source authority.

```ts
type RawByteHashV1 = {
  readonly hashVersion: "botc-raw-byte-sha256-v1";
  readonly digestAlgorithm: "SHA-256";
  readonly sourceByteLength: number;
  readonly sha256Hex: string;
};

type CanonicalValueHashV1 = {
  readonly hashVersion: "botc-canonical-value-sha256-v1";
  readonly digestAlgorithm: "SHA-256";
  readonly serializedByteLength: number;
  readonly preimageByteLength: number;
  readonly sha256Hex: string;
};

type CanonicalStateHashV1 = {
  readonly hashVersion: "botc-canonical-state-sha256-v1";
  readonly digestAlgorithm: "SHA-256";
  readonly serializedByteLength: number;
  readonly preimageByteLength: number;
  readonly sha256Hex: string;
};

type AggregateBindingHashV1 = {
  readonly hashVersion: "botc-aggregate-binding-sha256-v1";
  readonly digestAlgorithm: "SHA-256";
  readonly bindingSerializedByteLength: number;
  readonly preimageByteLength: number;
  readonly sha256Hex: string;
};
```

#### RawByteHashV1

```text
hashVersion       botc-raw-byte-sha256-v1
digestAlgorithm   SHA-256
preimage          exact private copied bytes only
result length     sourceByteLength
result digest     sha256Hex
```

`hashRawBytes(captured: unknown)` first validates the private raw token. It never accepts a raw object, view, or byte array directly.

#### Common framed hash preimage

```text
ASCII "BOTC-HASH-V1"
u32be domain UTF-8 byte length
domain UTF-8 bytes
u32be serialization-version UTF-8 byte length
UTF-8 "botc-canonical-runtime-tlv-be-v1"
u64be canonical TLV byte length
canonical TLV bytes including the BOTCCRV header
```

#### CanonicalValueHashV1

```text
hashVersion       botc-canonical-value-sha256-v1
domain            BOTC_CANONICAL_VALUE_V1
input             CapturedCanonicalValue token only
result lengths    serializedByteLength, preimageByteLength
result digest     sha256Hex
```

#### CanonicalStateHashV1

```text
hashVersion       botc-canonical-state-sha256-v1
domain            BOTC_CANONICAL_STATE_V1
input             CapturedCanonicalValue token only
result lengths    serializedByteLength, preimageByteLength
result digest     sha256Hex
```

The state role does not inspect, rebuild, validate, compare, or authorize `GameState`. It is a distinct hash domain over a token that a later semantic owner may classify.

#### AggregateBindingHashV1

The only admitted binding record is:

```text
{
  bindingVersion:"botc-aggregate-binding-sha256-v1",
  serializationVersion:"botc-canonical-runtime-tlv-be-v1",
  gameId:ID,
  rulesBaselineVersion:S,
  finalGameVersion:PI,
  finalEventSequence:PI,
  orderedEventHashes:Arr<LowercaseSha256Hex> with length <= 100000,
  orderedBatchHashes:Arr<LowercaseSha256Hex> with length <= 100000,
  orderedReceiptHashes:Arr<LowercaseSha256Hex> with length <= 100000,
  canonicalStateHash:U(LowercaseSha256Hex,null)
}
```

Only `captureAggregateBindingV1(unknown)` issues `CapturedAggregateBindingV1`. It applies generic safe capture, exact keys, exact literals, branded-ID admission, positive integers, dense-array limits, and lowercase SHA shape.

```text
hashVersion       botc-aggregate-binding-sha256-v1
domain            BOTC_AGGREGATE_BINDING_V1
input             CapturedAggregateBindingV1 token only
result lengths    bindingSerializedByteLength, preimageByteLength
result digest     sha256Hex
```

Array order is retained. No hash is sorted, deduplicated, substituted, or omitted. `hashAggregateBindingV1(captured: unknown)` validates private token identity first.

Exact token/API failures are:

```ts
type CapturedTokenFailureCode =
  | "INVALID_CAPTURED_CANONICAL_VALUE"
  | "INVALID_CAPTURED_RAW_BYTES"
  | "INVALID_CAPTURED_AGGREGATE_BINDING_V1";
```

Exact signatures are:

```ts
captureCanonicalRuntimeValue(input: unknown):
  CaptureCanonicalRuntimeValueResult

serializeCanonicalRuntimeValue(captured: unknown):
  SerializeCanonicalRuntimeValueResult

captureRawBytes(input: unknown):
  CaptureRawBytesResult

hashRawBytes(captured: unknown):
  RawByteHashV1 | CapturedTokenFailure

hashCanonicalValue(captured: unknown):
  CanonicalValueHashV1 | CapturedTokenFailure

hashCanonicalState(captured: unknown):
  CanonicalStateHashV1 | CapturedTokenFailure

captureAggregateBindingV1(input: unknown):
  CaptureAggregateBindingV1Result

hashAggregateBindingV1(captured: unknown):
  AggregateBindingHashV1 | CapturedTokenFailure
```

Each serializer/hash entry applies primitive/null rejection and private `WeakSet.has` inside `try/catch` before private backing lookup. No raw record, byte view, or `GameState` is a direct hash input.

### Snapshot boundary

Snapshot is `CACHE_ONLY`. P2F1 may capture and hash snapshot-shaped data only as an ordinary canonical token. It does not rebuild, compare, select, repair, semantically reject, or authorize a snapshot. Snapshot/event relation remains later P2F and replay ownership.

### Non-authority rule

Tokens and hashes prove only that P2F1 safely captured and deterministically processed structural data in this process. They do not prove acceptance, persistence, receipt authenticity, batch atomicity, stream completeness, replay success, state truth, artifact approval, or source authority.

## D05 — Design-time Governance Traceability V1.1

```text
ExpectedR1PrimarySet = []
ExpectedR2PrimarySet = []
```

The design contains no accepted-stream or replay primary.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `P2F1-C01_EXHAUSTIVE_REGISTRY` | The 40-event registry is exact | Compile-time map and runtime list contain each name once | Test title `[P2F1-C01] rejects registry parity drift` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | mismatch fails | event union is supporting authority |
| `P2F1-C02_PROXY_FIRST` | Proxy rejects before reflection | Proxy and revoked Proxy invoke zero traps | Test title `[P2F1-C02] rejects proxy before reflection` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | `PROXY_VALUE` | Node brand check is supporting authority |
| `P2F1-C03_DESCRIPTOR_CAPTURE` | Capture invokes no caller behavior | hostile descriptors and containers fail with exact precedence | Test title `[P2F1-C03] captures descriptors without caller execution` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | token or safe diagnostic only | detached control is supporting authority |
| `P2F1-C04_EXACT_ENVELOPE` | Envelope has exactly 14 fields | missing, extra, kind, ID, integer, and literal cases follow precedence | Test title `[P2F1-C04] validates the exact fourteen-field envelope` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | only exact envelope advances | D03 envelope is supporting authority |
| `P2F1-C05_EXACT_PAYLOADS` | All 40 payload schemas are closed | every branch admits; every missing, extra, nested, and literal mutation rejects | Test title `[P2F1-C05] validates all closed payload branches` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact per-event result | D03 schemas are supporting authority |
| `P2F1-C06_UNKNOWN_TYPE_VERSION` | Unknown type/version fails closed | discriminator precedence and codes match D04 | Test title `[P2F1-C06] rejects unknown event and payload versions` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | no cast, skip, or downgrade | registry and version 1 support |
| `P2F1-C07_CANONICAL_DOMAIN` | Canonical domain is closed | all accepted and rejected runtime kinds match D02 | Test title `[P2F1-C07] enforces the closed canonical value domain` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | opaque token or exact failure | value-version literal |
| `P2F1-C08_NULL_UNDEFINED_MISSING` | Null, undefined, and missing differ | explicit null admits only in schema; undefined and absence use distinct codes | Test title `[P2F1-C08] distinguishes null undefined and missing` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | no substitution | exact schema is supporting authority |
| `P2F1-C09_UNICODE_NEWLINE` | Unicode and newline bytes are exact | scalar, surrogate, normalization, CR, LF, and CRLF vectors match | Test title `[P2F1-C09] freezes unicode and newline TLV bytes` | `R4` | `T3` | `PURE_POLICY_SEAM` | literal TLV bytes | Windows/Linux execution supports |
| `P2F1-C10_ORDERING` | Object and array order is deterministic | code-unit key order and array order vectors match | Test title `[P2F1-C10] freezes object and array ordering` | `R4` | `T3` | `PURE_POLICY_SEAM` | literal TLV bytes | comparator is supporting authority |
| `P2F1-C11_RESOURCE_LIMITS` | Limits fail atomically | each at-limit and one-over case returns exact result | Test title `[P2F1-C11] enforces every capture and serialization limit` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | no partial output | D02 limits |
| `P2F1-C12_TIMESTAMP_OPACITY` | `createdAt` is opaque | exact content serializes with no date parsing or normalization | Test title `[P2F1-C12] preserves opaque createdAt content` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | exact admitted string | event field is supporting authority |
| `P2F1-C13_SERIALIZATION_VERSION` | TLV version is immutable | header, tags, lengths, endianness, and version vectors match | Test title `[P2F1-C13] freezes canonical TLV version one` | `R4` | `T3` | `PURE_POLICY_SEAM` | exact versioned bytes | literal vectors |
| `P2F1-C14A_RAW_BYTE_CAPTURE` | Raw input is genuine copied bytes | Proxy, brand, shared, detached, bound, and one-copy cases match | Test title `[P2F1-C14A] captures genuine nonshared raw bytes` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | opaque raw token or exact code | Node typed-array intrinsics |
| `P2F1-C14B_RAW_BYTE_DIGEST` | Raw SHA covers copied bytes only | literal SHA vectors match with no framing | Test title `[P2F1-C14B] hashes exact private copied bytes` | `R4` | `T3` | `PURE_POLICY_SEAM` | exact raw hash result | validated raw token |
| `P2F1-C15_CANONICAL_VALUE_HASH` | Canonical value hash uses exact framing | literal preimage, length, domain, and digest vectors match | Test title `[P2F1-C15] hashes canonical value framing` | `R4` | `T3` | `PURE_POLICY_SEAM` | exact value hash | canonical token |
| `P2F1-C16_CANONICAL_STATE_HASH` | State role is distinct and nonsemantic | domain separation works and no state inspection occurs | Test title `[P2F1-C16] separates canonical state hash role` | `R4` | `T3` | `PURE_POLICY_SEAM` | exact state-role hash | later semantic owner only |
| `P2F1-C17_AGGREGATE_BINDING_HASH` | Aggregate record is exact and ordered | token capture, exact keys, bounds, null, order, and framed hash match | Test title `[P2F1-C17] captures and hashes aggregate binding v1` | `R4` | `T3` | `PURE_POLICY_SEAM` | exact aggregate hash | member hashes are supporting only |
| `P2F1-C18_HASH_NOT_AUTHORITY` | Token/hash is not authority | clones and self-consistent caller data cannot bypass issuers | Test title `[P2F1-C18] rejects token lookalikes and authority claims` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | integrity evidence only | later P2F issuer remains required |
| `P2F1-C19_SNAPSHOT_BOUNDARY` | Snapshot remains cache-only | no rebuild, comparison, selection, repair, rejection, or authority API exists | Test title `[P2F1-C19] keeps snapshot handling structural only` | `R4` | `T3` | `PURE_POLICY_SEAM` | capture/hash only | later P2F/replay owns relation |
| `P2F1-C20_SAFE_DIAGNOSTICS` | Diagnostics are bounded and secret-safe | fixed names, ordinals, indices, truncation, and advisory separation match | Test title `[P2F1-C20] emits bounded nonsecret diagnostics` | `R3` | `T1` | `STRUCTURAL_VALIDATION` | no caller content leak | schema declaration order |
| `P2F1-C21_COMPATIBILITY` | Foundation is additive and nonmigrating | fingerprint and canonical-data behavior vectors remain unchanged | Test title `[P2F1-C21] preserves legacy canonical and fingerprint behavior` | `R4` | `T3` | `PURE_POLICY_SEAM` | no behavior alias or migration | static allowlist/diff is supporting only |
| `P2F1-C22_CROSS_PLATFORM` | Bytes and hashes are platform-independent | Linux and Windows assert literal TLV and four SHA results | Test title `[P2F1-C22] matches literal cross-platform vectors` | `R4` | `T3` | `CROSS_PLATFORM_CI` | identical literal outputs | exact source/profile-child HEAD CI |

Each physical test identity may host multiple criteria only through distinct exact test titles. No physical test identity or test title is primary for two criteria. Supporting authority never changes a row's primary layer.

## D06 — Exact implementation, ownership, coverage, and CI plan

Implementation remains unauthorized until independent design review passes and the user separately authorizes it.

### Production allowlist — maximum five

1. new `packages/domain-core/src/canonical-runtime-value.ts`
2. new `packages/domain-core/src/canonical-runtime-hash.ts`
3. new `packages/domain-core/src/domain-event-payload-shape-v1.ts`
4. new `packages/domain-core/src/unknown-domain-event.ts`
5. existing `packages/domain-core/src/index.ts`, additive exports only

Production additions are estimated at 1300–1800 lines and have a hard maximum of 2000 added lines.

### Formal test allowlist — only four

1. new `packages/domain-core/src/canonical-runtime-value.test.ts`
2. new `packages/domain-core/src/canonical-runtime-hash.test.ts`
3. new `packages/domain-core/src/domain-event-payload-shape-v1.test.ts`
4. new `packages/domain-core/src/unknown-domain-event.test.ts`

No test identity, title, or slice marker is borrowed from another Slice.

### Governance and CI modification allowlist — only four

1. `.github/workflows/ci.yml`
2. `scripts/verify-coverage-obligations.mjs`
3. `scripts/vitest-ownership-contracts.mjs`
4. one P2F1 implementation traceability/status document

`scripts/verify-vitest-ownership-contracts.mjs` is execution-only and is not modified.

Explicitly unchanged because existing routing already owns execution:

- `vitest.workspace.ts`
- `scripts/run-vitest-logical-group.mjs`
- `scripts/verify-vitest-coverage-groups.mjs`
- `scripts/verify-vitest-windows-application-groups.mjs`

No other infrastructure file may change.

### Test ownership

Append the four new physical test identities to the authoritative inventory in `scripts/vitest-ownership-contracts.mjs`.

Each receives:

```text
ordinary owner:
  logicalGroup = domain-core-rest
  project = domain-core

coverage owner:
  logicalGroup = domain-core-rest
  project = domain-core
```

Only mechanically derived inventory counts and hashes in that registry may update. No logical group or project is created.

Required ownership checks:

```text
node scripts/verify-vitest-ownership-contracts.mjs
existing ownership-verifier self-tests
```

### Coverage profile

Append one profile to `scripts/verify-coverage-obligations.mjs`; do not edit an older profile.

The exact ID algorithm is:

```ts
`phase-3-slice-2b20b-p2f1-${sourceHead.slice(0, 7).toLowerCase()}-v1`
```

`sourceHead` is the full exact implementation source commit created before the profile-only child. The profile child contains the computed literal ID and full source SHA. It contains no unresolved token.

The profile:

- uses `domain-core-rest`;
- records exact post-source production and test inventories;
- records exact counts;
- records obligations and positive-to-zero checks;
- passes the repository's existing profile audit.

### Workflow

`.github/workflows/ci.yml` changes only:

1. active coverage selector from `phase-3-slice-2b20b-p1-2f09f1f-v1` to the computed P2F1 literal;
2. adds this Windows command with no timeout, environment, or dependency change:

```text
pnpm exec vitest run --workspace vitest.workspace.ts --project=domain-core packages/domain-core/src/canonical-runtime-value.test.ts packages/domain-core/src/canonical-runtime-hash.test.ts packages/domain-core/src/domain-event-payload-shape-v1.test.ts packages/domain-core/src/unknown-domain-event.test.ts
```

Linux ordinary and coverage execution remains in `domain-core-rest`. The Windows step asserts literal expected TLV hex and four literal expected SHA-256 outputs. It never compares one platform's output to another platform's generated output.

### Local release gates

- file-scoped Vitest for changed test files;
- file-scoped ESLint for changed TypeScript files;
- ownership verifier and existing self-tests;
- coverage-profile audit;
- `pnpm typecheck`;
- `pnpm lint`;
- `pnpm test`;
- `pnpm test:coverage`.

### Hosted release gates

- exact source/profile-child HEAD Linux push and PR workflows;
- explicit Windows vector step;
- all repository-required checks;
- independent final review on the frozen final feature HEAD.

This design claims no passing review or CI result.

### Exact denylist

No event schema/type/ID module, replay, state, role, application, command store, projection, persistence, dependency, lockfile, timeout, or existing coverage profile may change. No production, test, governance, CI, or documentation file outside the allowlists may change.

### Compatibility and rollback

Existing events, payloads, receipts, snapshots, command fingerprints, `canonical-data.ts`, replay, persistence, and application behavior remain unchanged. No old digest is relabeled. No migration or history rewrite occurs.

Rollback removes the four new production files, four new tests, additive `index.ts` exports, the appended ownership entries and mechanically derived inventory values, the appended coverage profile, the two permitted workflow changes, and the P2F1 implementation status document. Rollback performs no data rewrite.

### Stop-loss

Stop and reslice if:

- any D03 schema cannot be represented exactly;
- any missing, extra, range, tuple, discriminator, or literal rule is unresolved;
- any sixth production file is required;
- any infrastructure file outside D06 must change;
- production additions exceed 2000 lines;
- any event, schema, type, ID, replay, state, role, application, projection, persistence, dependency, lockfile, timeout, or older coverage profile must change;
- any existing stateful validator must weaken or move;
- any cast occurs before full event validation;
- any input can skip, downgrade, convert, repair, or partially return;
- token issuers, brand symbols, registries, or backing values must be exported;
- token validation requires caller property access;
- generic capture gains quarantine metadata;
- diagnostics expose caller content;
- raw bytes are shared, detached, unbounded, retained, or not copied once;
- replay JSON parsing or artifact approval enters P2F1;
- TLV, Unicode, ordering, resource, framing, or hash contracts change;
- a hash becomes authority;
- snapshot semantic work enters P2F1;
- C21 cannot remain `R4 / T3 / PURE_POLICY_SEAM`;
- a new test logical group/project or altered routing is required;
- a required literal vector differs on Linux and Windows;
- independent review does not pass.

## Correction disposition

- reviewStatus: `NOT_REVIEWED`
- implementationAuthorized: `false`
- eventSchemaChanged: `false`
- replayAuthorityChanged: `false`
- stateAuthorityChanged: `false`
- acceptedBehaviorChanged: `false`
- BOTCRuleChanged: `false`
- P2FStatus: `HUMAN_BLOCKED_PENDING_P2F1`
- nextRequiredAction: `INDEPENDENT_RULE_DESIGN_REVIEW_P2F1_CORRECTION_ROUND_1`

READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW_P2F1_CORRECTION_ROUND_1
