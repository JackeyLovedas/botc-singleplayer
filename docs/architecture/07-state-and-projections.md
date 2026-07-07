# State And Projections

## Canonical State

`canonicalGameState` contains full truth:

- actual setup and assignments;
- actual characters and alignments;
- hidden effects;
- drunk and poisoned sources;
- role and alignment histories;
- private conversations;
- Storyteller decisions;
- information truth metadata;
- legal candidate sets;
- replay truth.

Only the domain kernel, projection engine, persistence layer, and Storyteller view construction may read canonical state.

## Projection Types

| Projection | Reader | Contents | Must Exclude |
| --- | --- | --- | --- |
| `storytellerView` | Automated Storyteller policy | Canonical truth, legal candidates, decision metadata, reminders | Nothing needed for legal rule execution |
| `publicGameState` | All players | Public phase, alive/dead, nominations, votes, executions, public claims | Hidden roles, alignments, truth labels |
| `playerKnowledgeView` | One player | Event-derived legal knowledge, self role, legal private info, own messages, public history | Other hidden roles, hidden candidate sets, truth metadata |
| `aiPrivateMemory` | One AI player | That AI's legal memories, claims, hypotheses, strategy notes | Canonical truth, other AI private chats |
| `playerClaims` | Discussion and replay | Statements and assertions | Treating claims as facts |
| `replayTruth` | Post-game truth review | Full truth timeline and decision reasoning | Live player access before game end |

## Projection Rules

- Projections are derived, not manually edited.
- Projection output must carry visibility tags.
- `playerKnowledgeView` must be derived from `KnowledgeGranted`, `InformationDelivered`, `CharacterKnowledgeChanged`, `AlignmentKnowledgeChanged`, `PrivateMessageReceived`, `PublicFactObserved`, `PlayerClaimRecorded`, and other public domain events.
- Live player and AI views must omit `InformationEvaluation`, display truth labels, hidden candidate sets, `selectedFromHiddenCandidates`, hidden source roles, and hidden effect causes unless the player legally learned them.
- AI hypotheses, trust scores, and bluff plans are AI private memory, not player knowledge facts.
- Truth review must be a distinct mode and must not share components that can accidentally appear during live play.

## Hidden Candidate Safety

Task and command projections must separate:

```text
visibleInputSchema
visibleOptions
hiddenValidationRules
storytellerLegalCandidates
```

Only `visibleInputSchema` and safe `visibleOptions` may appear in player or AI projections. `hiddenValidationRules` and `storytellerLegalCandidates` remain internal to the rules engine or Storyteller view.

Do not reveal hidden role, alignment, poisoning, drunkenness, registration, or Vortox truth constraints through button availability, option lists, validation messages, or logs visible to players.

## Canonical Write Path

```text
command -> validation -> legal result -> event -> event applier -> canonical state
```

No UI form, AI message, log viewer, or replay screen may write directly to canonical state.

## Leakage Tests

Every projection type needs tests that assert forbidden fields are absent. AI projection leakage tests are release-blocking before Phase 10.

Required leakage test cases:

- Player projection contains no `canonicalGameState` path or hidden assignment.
- AI projection contains no truth labels or `InformationEvaluation`.
- Visible options do not reveal hidden role or alignment legality.
- Private conversations are visible only to authorized participants and Storyteller madness judgment.
- Replay truth cannot be rendered through live player projection components.
