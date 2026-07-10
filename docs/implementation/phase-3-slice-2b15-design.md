# Phase 3 Slice 2B15 Proposed Design: Seamstress Modifier-Free First-Night Choice, Spend, and Private Information

Baseline: `main` at `12a3edc04215f1d16fcad87f44438ec862f3c39b`.

Rule evidence: `docs/rules/evidence/2B15.md`.

Rule-research verdict: `RULE_READY`.

No files were modified by the architect.

## 1. Bounded scope

Implement the Seamstress’s base, modifier-free, first-night action:

```text
Open first-night opportunity
→ submit CHOOSE_TWO_PLAYERS
→ record canonical target selection
→ explicitly spend the ability
→ determine the rule-correct answer from current alignments
→ separately record the delivered answer
→ settle the scheduled task atomically
→ expose only the delivered historical information to the source player
```

The existing `DEFER` path remains unchanged.

### Included

- Exactly two distinct, non-self existing players.
- Target canonicalization by numeric seat.
- Current target alignments at settlement.
- `YES` for matching alignments; `NO` for mixed alignments.
- Explicit target-selection, ability-spent, and information-delivered events.
- Separation of rule-correct and delivered answers.
- Private source-player projection.
- Exact validation, replay validation, prospective validation, and atomic append.
- Retry, idempotency, command receipts, and deterministic identifiers.
- Backward-compatible replay of existing Seamstress opportunity visibility.

### Non-goals

- Other-night Seamstress scheduling or use.
- Drunk, poisoned, Vortox, registration, Barista, or Philosopher-gained behavior.
- Storyteller discretionary answer selection.
- Death, revival, or Traveller modeling.
- New character-changing or alignment-changing mechanics.
- AI policy, UI, Electron, persistence, or network work.
- Broad implementation of all 39 evidence scenarios.

## 2. Evidence mapping

| Claim | Slice treatment |
|---|---|
| R01 — choose exactly two distinct non-self players | Fully implemented |
| R02 — living, dead, and Travellers may be legal | Existing modeled participants are not filtered by role or alignment. Death and Travellers remain outside this slice because those concepts are not represented |
| R03 — invalid selection forms are illegal | Fully implemented for missing, malformed, wrong count, duplicate, self, and unknown targets |
| R04 — invalid input does not consume the ability | Fully implemented |
| R05 — valid use consumes the once-per-game ability | Fully implemented with an explicit spend event and duplicate-opportunity prevention |
| R06 — impaired legal use still consumes | Not implemented; impaired source contexts fail closed before use |
| R07 — evaluate actual alignments at settlement | Fully implemented |
| R08 — good/good and evil/evil produce YES; mixed produces NO | Fully implemented |
| R09 — registration may affect the result | Not implemented; registration contexts fail closed |
| R10 — answer is private | Fully implemented |
| R11 — rule-correct and delivered information are separate | Structurally implemented; modifier-driven divergence is out of scope |
| R12 — delivered information is historical | Fully implemented |
| R13 — DEFER is not use | Existing behavior preserved |

The stale scenario `SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND` must not be implemented because it contradicts the current sourced rule evidence.

## 3. Modifier-free capability boundary

This slice may resolve `CHOOSE_TWO_PLAYERS` only when all of the following are true:

- The opportunity belongs to the base Seamstress role source.
- The source player, seat, and role remain the expected source.
- The source remains in the default supported base-role context.
- The source has no active impairment relevant to the resolution.
- No current Vortox condition applies.
- No registration, ability-source substitution, or other unsupported modifier model is required.

Unsupported modifier contexts return:

```text
UnsupportedSeamstressModifiedResolution
```

The rejection must:

- disclose no hidden modifier or alignment information;
- append no events;
- spend nothing;
- leave the opportunity open.

This is an implementation capability boundary, not a ruling that the Seamstress cannot act under those game conditions.

## 4. Opportunity contract and compatibility

Legacy replay visibility remains accepted exactly:

```ts
{
  canDefer: true,
  supported: ["DEFER"],
  futureUnsupported: ["CHOOSE_TWO_PLAYERS"]
}
```

Newly created first-night Seamstress opportunities use:

```ts
{
  visibilitySchemaVersion: "seamstress-first-night-action-v2",
  canDefer: true,
  canChooseTargets: true,
  supportedDecisionKinds: ["DEFER", "CHOOSE_TWO_PLAYERS"],
  futureUnsupportedDecisionKinds: [],
  targetSchema: "EXACTLY_TWO_DISTINCT_OTHER_PLAYERS"
}
```

Rules:

- The current opportunity creator emits V2.
- Exact replay validation accepts both V1 and V2.
- V1 remains defer-only.
- V1 payloads must not be silently widened or rewritten.
- The existing opportunity identity and scheduled-task association remain stable.

## 5. Command contract

Extend the existing Seamstress action decision union to:

```ts
type SeamstressActionDecision =
  | { kind: "DEFER" }
  | {
      kind: "CHOOSE_TWO_PLAYERS";
      targetPlayerIds: [PlayerId, PlayerId];
    };
```

Runtime validation must reject:

- absent or extra decision fields;
- unsupported decision kinds;
- a non-array target value;
- target count other than two;
- duplicate targets;
- the source player;
- unknown player IDs;
- malformed player IDs.

Rejection categories:

```text
InvalidSeamstressActionDecision
InvalidSeamstressTarget
UnsupportedSeamstressActionDecision
UnsupportedSeamstressModifiedResolution
```

Target order supplied by the caller is not canonical truth. Accepted targets are stored in ascending numeric-seat order without locale-aware comparison.

## 6. Canonical event flow

A successful choice appends exactly one atomic four-event batch:

```text
1. SeamstressTargetsChosen
2. SeamstressAbilitySpent
3. SeamstressInformationDelivered
4. ScheduledTaskSettled(SEAMSTRESS_INFORMATION_DELIVERED)
```

No prefix may survive if any later event fails prospective validation.

The existing `DEFER` path remains its current exact two-event batch and emits no target, spend, or information event.

### 6.1 `SeamstressTargetsChosen`

The exact payload records:

- schema/model version;
- Phase One v2.1 baseline;
- night number;
- scheduled-task ID;
- action-opportunity ID;
- source player and base Seamstress role;
- character-state revision captured by the opportunity;
- character-state revision used for settlement;
- exactly two canonical target player IDs.

This event records the accepted choice, not its answer.

### 6.2 `SeamstressAbilitySpent`

The payload records:

- spend model version;
- scheduled-task and opportunity IDs;
- source player and role;
- relevant character-state revision;
- spend reason;
- deterministic ability-instance ID.

The ability-instance ID is derived without time or randomness:

```text
seamstress-base-ability-v1:<scheduledTaskId>
```

Only a valid `CHOOSE_TWO_PLAYERS` path emits this event. It is emitted exactly once and closes ordinary use of that ability instance.

### 6.3 `SeamstressInformationDelivered`

The payload records a complete historical fact:

- model version `seamstress-information-model-v1`;
- stage `SEAMSTRESS_INFORMATION`;
- task, opportunity, source, and ability-instance IDs;
- canonical target IDs;
- settlement character-state revision;
- target-alignment comparison snapshot;
- `ruleCorrectAnswer`;
- deterministic candidate-set snapshot;
- orthogonal effectiveness, truth, reliability, constraint, registration, and simulation fields;
- separately stored `deliveredAnswer`.

For this modifier-free slice, the evaluation is fixed to:

```text
effectiveness: EFFECTIVE
truth: TRUE
reliability: RELIABLE
constraint: NONE
registration: none
simulationReason: none
```

The comparison snapshot contains both targets’ current alignments and derives:

```text
same alignment  → YES
mixed alignment → NO
```

The candidate snapshot contains deterministic `YES` and `NO` candidates. Only the rule-correct candidate is legal and selected in this slice. Candidate-set, candidate, and evaluation IDs derive deterministically from the opportunity ID.

Even though `ruleCorrectAnswer === deliveredAnswer` here, they must remain separate fields so later modifiers cannot overwrite historical truth.

### 6.4 Settlement

The final settlement event uses the exact outcome:

```text
SEAMSTRESS_INFORMATION_DELIVERED
```

It must reference the same opportunity and scheduled task as all preceding events.

## 7. Current-alignment semantics

Targets are validated as existing players when the command settles.

The answer uses their actual alignment at the settlement character-state revision, not:

- the alignment at opportunity creation;
- role-default alignment;
- a cached earlier projection;
- a later replay-time state.

Target choice and ability spend do not themselves alter character state, so the four-event batch shares the same relevant settlement revision.

After delivery, projections validate and display the stored snapshot. They never recalculate the answer from newer character state.

## 8. State and projection changes

Canonical replay state adds historical collections equivalent to:

```ts
seamstressTargetChoices
seamstressAbilityUses
seamstressInformation
```

They must preserve enough identifiers and revisions to cross-check the complete event chain.

The source player’s private view adds only the player-facing historical result:

```ts
{
  modelVersion: "seamstress-information-model-v1",
  targetPlayerIds: [PlayerId, PlayerId],
  answer: "YES" | "NO"
}
```

It must not expose:

- target alignments;
- rule-correct versus delivered divergence machinery;
- candidate sets or candidate IDs;
- effectiveness, truth, reliability, or constraints;
- registration or simulation details;
- spend internals;
- hidden source conditions.

Public state and other players’ private views receive no Seamstress answer.

The Storyteller/canonical state may retain validation data, but player, AI-memory, public, replay, and Storyteller projections must remain distinct.

## 9. Validation requirements

### Runtime validation

Every new command and event payload uses exact-shape validation:

- no missing keys;
- no excess keys;
- exact literals;
- exact two-element tuples;
- valid canonical IDs;
- exact nested candidate and comparison structures.

### Prospective validation

Before append, replay the proposed four-event batch against a prospective state and require:

- scheduled task exists and remains unsettled;
- opportunity exists, is open, and belongs to the task;
- V2 visibility authorizes `CHOOSE_TWO_PLAYERS`;
- source association remains valid;
- modifier-free guard passes;
- both targets are legal;
- no existing ability spend exists;
- choice precedes spend;
- spend precedes information;
- information precedes settlement;
- all identifiers and revisions agree;
- the stored correct answer matches the stored comparison snapshot;
- the selected candidate is the only legal candidate;
- delivered answer matches the selected candidate;
- settlement outcome matches information delivery.

Any failure rejects the whole batch.

### Replay validation

Replay must reject streams containing:

- information without choice or spend;
- spend without a valid choice;
- duplicate choice, spend, or delivery;
- delivery after DEFER settlement;
- choice after the opportunity closes;
- task/opportunity/source mismatches;
- changed target order or membership across events;
- noncanonical target order;
- revision mismatches;
- answer/comparison mismatches;
- malformed candidate sets;
- illegal selected candidates;
- settlement before delivery;
- duplicate settlement;
- later events that reinterpret delivered historical information.

Replay validates stored historical facts against their own event chain and stored snapshots, never against the latest character state.

## 10. Actors, receipts, retries, and determinism

- Use the same authorized actor path as the existing Seamstress `DEFER` decision.
- Do not introduce a new privileged actor.
- Human, AI, Storyteller, and System commands continue through the single serial command queue and one logical writer.
- A successful retry with the same command ID and identical body returns the original receipt and appends nothing.
- Reusing a command ID with a different body is rejected as an idempotency conflict.
- A new command against an already closed opportunity is rejected with no events.
- Concurrent submissions serialize; at most the first valid use succeeds.
- Invalid commands append nothing and cannot reserve or consume the ability.
- IDs and ordering must use existing deterministic factories and numeric ordering—never `Date.now`, `Math.random`, random UUIDs, `localeCompare`, or environment locale.

## 11. Acceptance tests

At minimum, add focused tests proving:

1. V2 opportunity advertises `DEFER` and `CHOOSE_TWO_PLAYERS`.
2. Legacy V1 replay remains exact and defer-only.
3. Two distinct non-self targets are accepted.
4. Reversed caller order produces the same seat-canonical event order.
5. Missing, one, or three targets are rejected with zero events.
6. Duplicate targets are rejected with zero events.
7. Self-selection is rejected with zero events.
8. Unknown targets are rejected with zero events.
9. Invalid exact payload shapes are rejected.
10. Good/good produces rule-correct and delivered `YES`.
11. Evil/evil produces `YES`.
12. Mixed alignment produces `NO`.
13. The settlement-time alignment revision is used rather than the opportunity-time alignment.
14. A valid choice emits the exact four-event batch in order.
15. A valid choice emits exactly one explicit spend.
16. A second use or duplicate opportunity cannot spend again.
17. Existing `DEFER` remains the exact two-event non-spending path.
18. Unsupported impairment, Vortox, registration, or modified-source contexts fail closed without events or spend.
19. Failure of any later proposed event rolls back the whole batch.
20. Replay rejects missing, reordered, duplicated, or cross-linked events.
21. Only the source private view receives the historical delivered answer, and later character-state changes do not alter it.

### Evidence regression coverage

Expected coverage of the 39 evidence scenarios:

- Fully covered: 1–6, 11–14, 19, 21–23, 38.
- Partially covered by the bounded base model: 7, 8, 15, 20.
- Explicitly unsupported in this slice: 9–10, 16–18, 24–37.
- Scenario 39 remains a governance prohibition rather than executable behavior.

Tests must not encode unsupported modifier behavior as though it were a completed rule.

## 12. Expected implementation surface

Minimum expected surface:

- New focused domain module:
  - `packages/domain-core/src/seamstress.ts`
  - `packages/domain-core/src/seamstress.test.ts`
- Existing domain event union and exact runtime validators.
- Game-state shape, event applier, replay, and prospective validation.
- First-night Seamstress opportunity creation and visibility validation.
- Application-service Seamstress command handling and receipt/idempotency path.
- Source-player private-view projection and privacy tests.
- Shared deterministic test builders where necessary.
- `docs/rules/ROLE_COVERAGE_MATRIX.md`.
- `docs/agent-loop/AUTOPILOT_LOG.md` and the normal slice implementation-status material.

The implementer should keep the file surface as narrow as the existing repository organization permits.

## 13. Coverage-matrix delta

After implementation and passing review:

- Seamstress base ability: `PARTIAL`.
- First-night choice and settlement: `PARTIAL`.
- Private information projection: `PARTIAL`.
- Overall Seamstress role: `PARTIAL`.
- Other-night use: unsupported.
- Impairment, Vortox, registration, Barista, Philosopher-gained ability, death/revival, and Traveller interactions: unsupported.

No incomplete role or modifier family may be marked `COMPLETE`.

## 14. Required independent design review

Before implementation, the read-only reviewer must independently inspect:

- `docs/rules/USER_OVERRIDES.md`;
- the sourced Chinese Wiki material or approved snapshot;
- the official BOTC Wiki material or approved snapshot;
- the official nightsheet;
- `docs/rules/evidence/2B15.md`;
- `docs/rules/ROLE_COVERAGE_MATRIX.md`;
- this proposed design.

Implementation is authorized only by:

```text
RULE_DESIGN_PASS
```

`RULE_DESIGN_FIX_REQUIRED` requires design correction and renewed review. Any source conflict or unavailable mandatory source maps to `HUMAN_BLOCKED`.

## 15. PR traceability

The slice PR must contain:

- evidence path and source revisions/dates or approved snapshot hashes;
- R01–R13 implementation mapping;
- the independent `RULE_DESIGN_PASS`;
- exact command, opportunity, event, and projection contracts;
- modifier-free fail-closed boundary;
- acceptance-test-to-evidence mapping;
- coverage-matrix delta;
- full gate results;
- reviewed commit SHA and confirmation that reviewed HEAD equals PR HEAD;
- final independent `CODE_REVIEW_PASS`;
- final independent `RULE_REVIEW_PASS`.

Merge remains blocked if either final verdict is missing, CI is red, the reviewed commit differs from PR HEAD, or the worktree is dirty.

## 16. Risks, rollback, and stop conditions

Primary risks:

- accidentally treating impairment as non-consumption;
- recomputing historical information from later state;
- leaking target alignments or truth machinery;
- widening V1 replay visibility;
- partially appending spend before delivery;
- inventing death, Traveller, registration, or modifier semantics;
- using nondeterministic ordering or IDs.

Rollback is the ordinary clean reversal of this bounded slice’s event, validation, command, projection, test, and documentation changes. Do not rewrite existing event history.

Stop immediately if:

- rule evidence becomes conflicting or unavailable;
- exact V1 compatibility cannot be preserved;
- the current state model cannot represent the required historical fact safely;
- implementation would require guessing modifier, registration, death, Traveller, or other-night rules;
- an unsafe history rewrite is proposed;
- permissions fail;
- the same gate failure repeats without a materially different corrective action.

`PROPOSED_DESIGN_STATUS: READY_FOR_INDEPENDENT_RULE_DESIGN_REVIEW`
