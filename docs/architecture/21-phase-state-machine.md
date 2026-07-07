# Phase State Machine

## Principle

Avoid a generic production `AdvancePhase` command. Use semantic commands that say which rule boundary is being crossed.

## States

### GAME_CREATION

- Entry: no game exists.
- Exit: `CreateGame` accepted.
- Legal commands: `CreateGame`.
- Required tasks: validate product scope.
- Automatic triggers: initialize game version and root seed.
- Victory check: none.
- Interruptions: invalid configuration rejection.
- Must not skip: product scope validation.

### SCRIPT_SELECTION

- Entry: `GameCreated`.
- Exit: `SelectScript` accepted.
- Legal commands: `SelectScript`.
- Required tasks: validate official Sects & Violets or custom role pool.
- Automatic triggers: script role pool validation.
- Victory check: none.
- Interruptions: invalid script or out-of-scope role rejection.
- Must not skip: custom script is role pool, not setup.

### SETUP_GENERATION

- Entry: valid script selected.
- Exit: `GenerateSetup` accepted and setup validated.
- Legal commands: `GenerateSetup`.
- Required tasks: 12-player count, setup modifiers, locks, exclusions, seed, demon bluffs.
- Automatic triggers: setup validation report.
- Victory check: none.
- Interruptions: unsatisfied role pool or bluff candidate shortage.
- Must not skip: fixed seed and candidate set recording.

### CHARACTER_ASSIGNMENT

- Entry: setup generated.
- Exit: `AssignCharacters` accepted.
- Legal commands: `AssignCharacters`.
- Required tasks: assign exactly 12 setup roles to seats and create initial legal knowledge.
- Automatic triggers: evil initial information, demon bluff knowledge, player self-knowledge.
- Victory check: none.
- Interruptions: assignment conflict.
- Must not skip: setup and assignment separation.

### FIRST_NIGHT

- Entry: characters assigned.
- Exit: all first-night scheduled tasks complete.
- Legal commands: `BeginFirstNight`, `SubmitScheduledTaskInput`, `ApplyStorytellerChoice`, system follow-ups.
- Required tasks: first-night `ScheduledTask`, start-knowing information, initial continuous rule calculation.
- Automatic triggers: task queue building, ability evaluations, projection publishing.
- Victory check: after any event that changes Demon status or triggers special win.
- Interruptions: role changes that insert first-night information.
- Must not skip: information delivery and hidden truth projection.

### DAY_DISCUSSION

- Entry: first night or dawn published.
- Exit: `CloseDiscussion` or `OpenNominations`.
- Legal commands: `RecordPublicClaim`, `SendPrivateMessage`, `UseActionOpportunity`, `OpenNominations`.
- Required tasks: public/private communication, day opportunities, madness evidence.
- Automatic triggers: public fact observation and private message knowledge events.
- Victory check: after day actions that can trigger victory or death.
- Interruptions: Cerenovus/Mutant madness execution candidate.
- Must not skip: evidence capture for madness.

### NOMINATION_WINDOW

- Entry: nominations opened.
- Exit: `OpenVote` after a valid `DeclareNomination`, or `CloseNominations` when no more nominations will occur.
- Legal commands: `DeclareNomination`, `OpenVote`, `CloseNominations`, `RecordPublicClaim`, `SendPrivateMessage`.
- Required tasks: validate nominator and target rights.
- Automatic triggers: Witch curse subscription on nomination.
- Victory check: after death or special result from nomination trigger.
- Interruptions: cursed nominator death, madness execution.
- Must not skip: one nomination per nominator and target constraints.

Nomination and voting cycle:

```text
NOMINATION_WINDOW
-> DeclareNomination
-> OpenVote
-> VOTING
-> CompleteVote
-> BlockStateUpdated
-> NOMINATION_WINDOW
```

Every completed vote returns to `NOMINATION_WINDOW` so later nominations remain possible. Only `CloseNominations` leaves the nomination window for execution or day-end handling.

### VOTING

- Entry: `OpenVote` after a valid nomination.
- Exit: `CompleteVote`, then `BlockStateUpdated`, then return to `NOMINATION_WINDOW`.
- Legal commands: `CastVote`, `CompleteVote`.
- Required tasks: count votes, consume ghost votes, update on-the-block state.
- Automatic triggers: `BlockStateUpdated`.
- Victory check: none unless a vote-triggered event causes death or special condition.
- Interruptions: command validation failure.
- Must not skip: ghost vote consumption rules.

### EXECUTION_RESOLUTION

- Entry: nominations closed with a valid block state or madness execution candidate.
- Exit: execution resolved and day closes.
- Legal commands: `ResolveExecution`, `ApplyStorytellerChoice` where legal.
- Required tasks: record execution separately from death, resolve death attempt/prevention/replacement.
- Automatic triggers: death subscriptions, victory checks.
- Victory check: required after execution and death resolution.
- Interruptions: death replacement, Evil Twin, Klutz, Vortox-related checks.
- Must not skip: execution/death separation.

If there is a player on the block:

```text
CloseNominations
-> ExecutionDeclared
-> death attempt and related effects
-> ExecutionResolved
-> victory checks
-> BeginNight or GameEnded
```

If there is no player on the block:

```text
CloseNominations
-> DayClosedWithoutExecution
-> Vortox and other day-end checks
-> BeginNight or GameEnded
```

`DayClosedWithoutExecution` is a domain event. It is not an execution and must not satisfy rules that require an execution.

### NIGHT_TASKS

- Entry: `BeginNight`.
- Exit: all required scheduled tasks and event-triggered night follow-ups complete.
- Legal commands: `SubmitScheduledTaskInput`, `ApplyStorytellerChoice`, system follow-ups.
- Required tasks: build scheduled tasks dynamically, resolve task inputs, evaluate abilities, apply effects.
- Automatic triggers: continuous rule recalculation and event subscriptions.
- Victory check: after Demon death, role/alignment change, death resolution, or special triggers.
- Interruptions: role changes that add or defer tasks.
- Must not skip: ability evaluation at settlement.

### DAWN_RESOLUTION

- Entry: night tasks completed.
- Exit: `PublishDawn`.
- Legal commands: `PublishDawn`, system victory checks.
- Required tasks: publish dawn-visible deaths, clean expired effects, open next day.
- Automatic triggers: projection publication.
- Victory check: before opening next day if night events may end the game.
- Interruptions: unresolved victory candidate or pending mandatory task.
- Must not skip: event-derived knowledge and projection safety.

### GAME_ENDED

- Entry: `VictoryResolved` and `GameEnded`.
- Exit: none.
- Legal commands: replay export, truth review export, archive.
- Required tasks: freeze live command queue, expose truth review mode only after end.
- Automatic triggers: final replay package generation if requested.
- Victory check: none.
- Interruptions: none.
- Must not skip: final public result before truth reveal.

## Semantic Phase Commands

Preferred phase commands:

- `BeginFirstNight`
- `CloseDiscussion`
- `OpenNominations`
- `OpenVote`
- `CompleteVote`
- `CloseNominations`
- `DayClosedWithoutExecution`
- `ResolveExecution`
- `BeginNight`
- `CompleteNight`
- `PublishDawn`

Generic `AdvancePhase` is restricted to tests or migration tooling.
