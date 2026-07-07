# System Context

## Product Boundary

The product is a Windows local single-player application for one human player, eleven AI players, and one automated Storyteller. The automated Storyteller is a system actor and is not counted among the twelve players.

## In Scope

- Official Sects & Violets role pool.
- Custom role pools as allowed character sets.
- Twelve-player legal setup.
- Fixed random seed setup and assignment.
- Day/night phase flow.
- Nomination, voting, execution, death, and victory checks.
- Dynamic night tasks.
- Madness evidence and Storyteller judgment.
- Role and alignment changes.
- AI player commands through legal projections.
- Save, replay, and truth review.

## Out of Scope

- Travellers.
- Fabled characters.
- Experimental characters.
- Online multiplayer.
- Voice recognition.
- Live streaming mode.
- Mobile support.
- User-authored role ability scripts.
- Cross-edition full role support.

## External Systems

| External Surface | Purpose | Boundary Rule |
| --- | --- | --- |
| AI provider | Generate AI discussion, private chat, nominations, votes, and night choices | Receives only player projection plus that AI memory |
| Local filesystem | Save files, replay exports, logs | Must not expose live hidden truth through player-visible files |
| Future desktop shell | Windows packaging and UI | Must consume projections, not canonical state |

## Trust Boundary

The trusted core is the deterministic domain kernel plus persistence integrity checks. AI, user text, imported scripts, and future UI inputs are untrusted and must enter as commands or candidate commands.

## Data Visibility Boundary

```text
canonicalGameState
  -> storytellerView
  -> publicGameState
  -> playerKnowledgeView(playerId)
  -> aiPrivateMemory(aiPlayerId)
  -> replayTruth(after game end or explicit truth-review mode)
```

No boundary may be bypassed for convenience.
