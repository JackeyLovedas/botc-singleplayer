# Storyteller Decision Model

## Role

The automated Storyteller applies rules, chooses among legal candidates, records decisions, and builds legal projections. It is not a player and does not choose winners freely.

## Decision Types

| Type | Description |
| --- | --- |
| `HARD_RULE` | No choice; must execute |
| `LEGAL_CANDIDATE_SELECTION` | Choose one or more legal candidates |
| `UNRELIABLE_INFORMATION` | Choose true or false legal-format information when allowed |
| `FORCED_FALSE_INFORMATION` | Choose a candidate that is false under role semantics |
| `REGISTRATION_CHOICE` | Choose check-time apparent role/type/alignment where rules allow |
| `MADNESS_JUDGMENT` | Judge evidence and possible penalty |
| `CHARACTER_CHANGE_CHOICE` | Resolve allowed transformation or swap candidates |
| `DEATH_OR_PROTECTION_CHOICE` | Resolve death, prevention, replacement, or arbitrary death windows |

## Decision Log

```text
StorytellerDecision(
  decisionId,
  decisionType,
  sourceEventId,
  ruleBasis,
  legalCandidates,
  selectedCandidate,
  strategyBasis,
  randomStreamId,
  selectedIndex,
  truthStatus,
  affectedPlayers,
  hiddenFromPlayers
)
```

## Madness

Madness is evidence plus judgment, not keyword matching. Public statements, private messages, implications, denials, consistency, opportunity, and behavior may be evidence. The Storyteller may read private chats for madness judgment, but must not reveal private content to unauthorized players.

## Randomness

If the Storyteller chooses randomly among legal candidates, the candidate list and selected index must be recorded with the named random stream.

## Prohibitions

- Do not violate hard rules.
- Do not choose a winner outside the victory resolver.
- Do not output information outside the role's legal format.
- Do not leak truth labels to players or AI.
- Do not use hidden AI-inaccessible truth to produce unfair player-facing explanations.
