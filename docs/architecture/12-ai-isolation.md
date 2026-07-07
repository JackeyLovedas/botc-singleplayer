# AI Isolation

## Boundary

AI players are untrusted actors. They receive legal projections and return candidate commands. They never receive `canonicalGameState`, hidden truth metadata, hidden Storyteller decisions, or other AI private memory.

## Per-AI State

Each AI has separate memory:

- self-believed character;
- self-known alignment;
- received information;
- public history;
- own private conversations;
- known claims;
- suspicion model;
- trust scores;
- demon hypotheses;
- setup hypotheses;
- nomination and vote strategy;
- night target strategy;
- bluff plan;
- madness requirements;
- legally known character and alignment history.

Do not use one global prompt to represent all AI players.

## AI Call Contract

```text
PlayerProjection + AI private memory + allowed action schema
-> AI model
-> candidate command
-> parser/schema validation
-> expectedGameVersion check
-> command validator
-> accepted command or rejection audit
```

## Allowed Outputs

AI may propose:

- public statement;
- private message to legal participants;
- nomination;
- vote;
- night task choice;
- day action question;
- claim update;
- request for summary.

AI may not output domain events, hidden facts, direct state mutations, or Storyteller decisions.

## Async Response Rule

AI responses are stale by default until revalidated. When an AI response returns:

1. Parse it as a candidate command.
2. Compare its `expectedGameVersion` with the current game version.
3. Reject or rebuild the AI prompt if the version no longer matches.
4. Run ordinary command validation against current phase, actor rights, visible options, and hidden validation rules.
5. Append domain events only after successful validation.

An AI response must not continue operating on the snapshot that existed when the prompt was sent.

## Audit Records

Record:

- AI player id;
- projection id and hash;
- prompt template version;
- model metadata;
- response id or raw response reference;
- parsed candidate command;
- validation result;
- rejection reason if rejected.

Do not store secrets or API keys in audit records.

## Replay

Replay uses recorded accepted commands and events. It must not call the AI model again to reproduce a past game.

## Phase Gate

Before Phase 10 AI work, add leakage tests that prove AI projections do not contain canonical truth, hidden role assignments, truth statuses, hidden effect causes, or unauthorized private chats.
