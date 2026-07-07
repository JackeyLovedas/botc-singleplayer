# Domain Model

## Aggregates

### Game

Owns the current phase, day/night number, player seats, setup summary, active effects, current night tasks, nominations, votes, execution state, victory state, and event cursor.

### ScriptDefinition

Defines the allowed role pool. It is not the actual setup and not the assignment.

### GameSetup

Represents the selected twelve actual roles after setup generation and setup modifiers. It includes seed, constraints, selected roles, applied setup modifiers, demon bluffs, and validation report.

### CharacterAssignment

Maps actual setup roles to seats and players. It must not add, remove, or replace setup roles.

### Player and Seat

`Player` owns identity, human/AI kind, and public name. `Seat` owns seating order and neighbor calculations.

## Core State Records

| Record | Purpose |
| --- | --- |
| `CharacterState` | Actual character, current ability sources, ability spent flags, role history |
| `AlignmentState` | Actual alignment and alignment history |
| `LifeState` | Alive/dead, death cause history, ghost vote state |
| `KnowledgeEvent` | Source event for what a player legally knows |
| `PlayerClaim` | Public or private statements, never canonical truth |
| `PrivateConversation` | Private messages and participants |
| `Nomination` | Nominator, target, day, legality, status |
| `Vote` | Voter, nomination, count status, ghost vote consumption |
| `Execution` | Executed player, source, day, whether it caused death |
| `Death` | Player death or attempted death, source, prevention/replacement |
| `ScheduledTask` | Scheduled night task requiring input or presentation |
| `ActionOpportunity` | Day action or non-scheduled opportunity |
| `EventSubscription` | Rule listener for domain events |
| `ContinuousRule` | Recalculated ongoing rule pressure |
| `EffectInstance` | Ongoing, suppressed, resumed, expired, or removed rule effect |
| `RegistrationCheck` | Check-time apparent role/type/alignment projection |
| `MadnessRequirement` | Claim constraint, evidence, judgment, and possible penalty |
| `StorytellerDecision` | Legal candidates, selected candidate, rule basis, seed basis |
| `VictoryCandidate` | A possible outcome collected after a trigger |
| `ReplayRecord` | Event and projection material needed for replay |

## Important Separations

- `scriptDefinition` is not `gameSetup`.
- `gameSetup` is not `characterAssignment`.
- `actualCharacter` is not `registeredCharacter`.
- `actualAlignment` is not `knownAlignment`.
- `execution` is not `death`.
- `abilityFailure` is not automatic false information.
- `unreliableInformation` is not always false.
- `playerClaim` is not canonical truth.

## Knowledge Source Model

Player knowledge is event-derived. Do not maintain a manually editable `PlayerKnowledge` truth object outside the event log.

Use knowledge-bearing domain events such as:

- `KnowledgeGranted`
- `InformationDelivered`
- `CharacterKnowledgeChanged`
- `AlignmentKnowledgeChanged`
- `PrivateMessageReceived`
- `PublicFactObserved`
- `PlayerClaimRecorded`

`playerKnowledgeView` is derived from these events plus public domain events. It answers what a player legally knows at a specific event version.

AI suspicion, trust scores, hypotheses, and bluff plans remain AI private memory. They are not player knowledge facts and must not become canonical truth.

## Character And Alignment History

Character and alignment changes append history records:

```text
CharacterHistory(playerId, fromCharacter, toCharacter, sourceEventId, phase, visibility)
AlignmentHistory(playerId, fromAlignment, toAlignment, sourceEventId, phase, visibility)
```

History supports replay, truth review, AI legal knowledge updates, and victory resolution.

## Role And Alignment Change Model

Role and alignment changes are domain events, not setup regeneration and not registration.

| Source | Character Change | Alignment Change | Notes |
| --- | --- | --- | --- |
| Snake Charmer | Swaps actual characters with chosen Demon | Swaps actual alignments | Old Demon becomes poisoned; old Demon does not learn minions again |
| Fang Gu | First effective Outsider kill makes target Fang Gu | Target becomes Evil; old Fang Gu dies | Target does not die, so death abilities such as Klutz do not trigger |
| Barber | Demon may swap two players' characters | No alignment swap | Seats, memories, claims, and player identity stay unchanged |
| Pit-Hag | Target becomes selected not-in-play character | No automatic alignment change unless role rule says so | In-play character choice is legal and resolves as no change |
| Philosopher | Gains another ability | No actual character change | Original in-play role may become drunk through an effect |

Each change must produce visibility-specific knowledge updates. A player may learn their own new character while other players only see public consequences. AI players update only from their legal projection, not from hidden history.

Role changes can trigger:

- active effect recalculation;
- night task insertion or deferral;
- victory check if Demon count or special win modifiers changed;
- projection updates for legally informed players;
- replay truth history.

## Setup Modifiers

Setup modifiers apply only during setup. Fang Gu and Vigormortis setup modifiers must not rerun because of later role changes. Runtime role changes are modeled as events and effect recalculations, not as setup regeneration.
