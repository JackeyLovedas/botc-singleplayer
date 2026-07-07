# Command And Event Model

## Principle

Commands express requested actions. Domain events express validated game facts that happened. Audit events and infrastructure events record process or technical facts, but they must not rebuild `canonicalGameState`.

No AI output, UI input, or Storyteller text may become a domain event without command validation and rule resolution.

## Command Envelope

Every command entering the application layer must carry:

```text
CommandEnvelope(
  commandId,
  gameId,
  expectedGameVersion,
  actor,
  issuedAt,
  correlationId,
  payload
)
```

Rules:

- Repeated `commandId` is idempotent and must not settle twice.
- `expectedGameVersion` mismatch is rejected or forces reload/revalidation.
- Human commands, AI commands, system tasks, and Storyteller choices use the same serial command queue.
- AI asynchronous responses must be revalidated against the current game version when they return.
- AI responses must not continue from stale state.

## Command Types

| Command | Actor | Result |
| --- | --- | --- |
| `CreateGame` | Human/system | Validates product scope and creates game shell |
| `SelectScript` | Human/system | Sets official or custom script role pool |
| `GenerateSetup` | System/Storyteller | Produces setup candidates and selected setup |
| `AssignCharacters` | System | Assigns roles to seats |
| `BeginFirstNight` | System | Opens first-night task processing |
| `CloseDiscussion` | System/Storyteller policy | Ends the current discussion window |
| `OpenNominations` | System/Storyteller policy | Opens nomination window |
| `DeclareNomination` | Player/AI/human UI | Validates nomination rights |
| `CastVote` | Player/AI/human UI | Validates vote and ghost vote use |
| `CloseNominations` | System/Storyteller policy | Ends nomination window |
| `ResolveExecution` | System/Storyteller policy | Resolves current block state |
| `BeginNight` | System | Opens night task processing |
| `SubmitScheduledTaskInput` | Player/AI/Storyteller | Validates current scheduled task input |
| `UseActionOpportunity` | Player/AI | Uses a legal day action such as Artist or Savant |
| `ApplyStorytellerChoice` | Storyteller policy | Selects from legal candidates |
| `CompleteNight` | System | Completes all required night tasks |
| `PublishDawn` | System | Publishes dawn-visible results and opens day |
| `RecordPublicClaim` | Player/AI/human UI | Records a statement in claims layer |
| `SendPrivateMessage` | Player/AI/human UI | Records private conversation if participants are legal |
| `CheckVictory` | System | Runs victory resolver after trigger events |

Use broad `AdvancePhase` only in tests or tooling where the exact semantic command is already known and recorded. Production flow should prefer explicit phase commands.

## DomainEvent

`DomainEvent` changes or explains game domain state. Only domain events rebuild canonical state.

Examples:

- `GameCreated`
- `ScriptSelected`
- `SetupGenerated`
- `SetupValidated`
- `DemonBluffsGenerated`
- `CharactersAssigned`
- `PhaseTransitioned`
- `ScheduledTaskQueued`
- `ScheduledTaskPresented`
- `ScheduledTaskInputRecorded`
- `ScheduledTaskResolved`
- `ActionOpportunityOpened`
- `ActionOpportunityUsed`
- `EventSubscriptionTriggered`
- `ContinuousRuleActivated`
- `ContinuousRuleRecalculated`
- `SimulatedChoiceRecorded`
- `InformationCandidateSetBuilt`
- `InformationDelivered`
- `RegistrationCheckRecorded`
- `StorytellerDecisionRecorded`
- `EffectCreated`
- `EffectSuppressed`
- `EffectResumed`
- `EffectExpired`
- `EffectRemoved`
- `CharacterChanged`
- `AlignmentChanged`
- `KnowledgeGranted`
- `CharacterKnowledgeChanged`
- `AlignmentKnowledgeChanged`
- `PublicFactObserved`
- `PrivateMessageReceived`
- `PlayerClaimRecorded`
- `PrivateConversationRecorded`
- `NominationDeclared`
- `VoteCast`
- `BlockStateUpdated`
- `ExecutionDeclared`
- `ExecutionResolved`
- `DeathAttempted`
- `DeathResolved`
- `DeathPrevented`
- `MadnessRequirementCreated`
- `MadnessEvidenceRecorded`
- `MadnessJudgmentRecorded`
- `VictoryCheckRequested`
- `VictoryCandidateCollected`
- `VictoryBlocked`
- `VictoryResolved`
- `GameEnded`

## AuditEvent

`AuditEvent` records inputs, rejections, and decision process. It does not change canonical state.

Examples:

- `AICommandCandidateReceived`
- `AICommandCandidateRejected`
- `AICommandCandidateAcceptedForValidation`
- `InvalidCommandRejected`
- `DuplicateCommandIgnored`
- `ExpectedVersionMismatchRejected`
- `ProjectionLeakageCheckFailed`
- `StorytellerCandidateSetAudited`
- `AIPromptProjectionHashRecorded`

An accepted AI candidate command still must pass through command validation and produce ordinary domain events. The audit event itself is not game state.

## InfrastructureEvent

`InfrastructureEvent` records technical operations. It does not change canonical state.

Examples:

- `SnapshotSaved`
- `SnapshotSaveFailed`
- `DatabaseMigrated`
- `ExportCreated`
- `ReplayPackageCreated`
- `ProjectionCacheUpdated`

Infrastructure events can support diagnostics and recovery, but must not be used by the domain event applier.

## Hidden Candidate Boundary

Commands and task inputs must separate:

```text
visibleInputSchema
visibleOptions
hiddenValidationRules
storytellerLegalCandidates
```

Rules:

- `visibleInputSchema` describes what shape of answer the player or AI may submit.
- `visibleOptions` must not reveal hidden role, alignment, poisoning, drunkenness, registration, or truth metadata.
- `hiddenValidationRules` can validate against canonical state inside the rules engine.
- `storytellerLegalCandidates` are visible to Storyteller policy only.
- If a player submits a surface-valid option that hidden rules disallow, handle it according to the role rule; do not expose the hidden reason through disabled buttons or error text.

## Validation Rules

- Validate actor visibility and permissions before command acceptance.
- Validate phase, target legality, once-per-game state, alive/dead restrictions, and role-specific rules.
- Validate AI candidate commands exactly like human commands.
- Validate Storyteller choices against the legal candidate list.
- Record forbidden or rejected commands as audit events, not domain facts.

## Event Metadata

Each domain event should include:

- event id;
- game id;
- game version after append;
- event sequence number;
- event version;
- rules baseline version;
- command id or system trigger id;
- actor id if any;
- phase and day/night index;
- deterministic random stream id if random was used;
- causation id and correlation id;
- visibility tags.

Audit and infrastructure events may share correlation ids with domain events, but must be stored and replayed through separate channels.
