# Phase 3 Slice 2B14 Status: Seamstress First-Night DEFER Skeleton

## Status

Implemented for review on branch `phase-3/seamstress-first-night-defer-skeleton` from main revision `b9a60fe48368938416178c9362a37494681ae493`.

Slice 2B13 was accepted before this branch and is tagged `phase-3-slice-2b13-dreamer-action-information-skeleton`.

Rules baseline: Phase One v2.1. The reviewed 2B14 evidence verdict is `RULE_READY`, and the independent design verdict is `RULE_DESIGN_PASS`.

## Scope Delivered

- Enabled deterministic first-night action opportunities for a current base `seamstress` task only.
- Added `SubmitSeamstressAction` with the sole supported decision `{ kind: "DEFER" }`.
- Added the canonical `SeamstressActionDeferred` event.
- Added `ScheduledTaskSettled.outcomeType = SEAMSTRESS_DEFERRED`.
- Closed the opportunity and settled the current wake in one exact two-event batch.
- Added exact runtime, prospective, batch, event-application, and replay validation.
- Preserved `assignment`, `setup`, `currentCharacterState`, the original task plan, impairments, and private knowledge.
- Kept player and AI private projection shapes unchanged and added explicit non-leakage coverage.
- Kept the first-night task catalog and its signature unchanged.

## Opportunity And Command Contract

The opportunity id is:

```text
first-night-v1:SEAMSTRESS_ACTION:seat-<NN>:opportunity-01
```

Its visible schema is exactly:

```text
canDefer = true
supportedDecisionKinds = [DEFER]
futureUnsupportedDecisionKinds = [CHOOSE_TWO_PLAYERS]
```

The command payload contains exactly:

```text
commandType = SubmitSeamstressAction
taskId
opportunityId
decision = { kind: DEFER }
```

Matching source Human and AI actors, Storyteller, and System may submit. Human and AI actors must match `opportunity.sourcePlayerId`. Storyteller and System remain available for orchestration. Opportunity opening remains limited to Storyteller or System.

The base task must still be next and unsettled, and the source player, seat, exact Seamstress role snapshot, and character-state revision must still match. Philosopher-gained Seamstress execution is rejected as `UnsupportedRoleActionOpportunity`.

`CHOOSE_TWO_PLAYERS` is recognized but rejected as `UnsupportedSeamstressActionDecision`. Malformed, extra, or hidden input rejects as `InvalidSeamstressActionDecision`. Deterministic rejections save receipts and write no domain events.

## Event And Settlement Contract

The only valid deferral batch is:

```text
SeamstressActionDeferred
ScheduledTaskSettled(outcomeType = SEAMSTRESS_DEFERRED)
```

Both events share command metadata, batch id, and game version, and use consecutive event sequences. The settlement task identity and character-state revision must match the deferral event.

`SeamstressActionDeferred` records only the historical task, opportunity, `DEFER` decision, source role snapshot, and source character-state revision. It contains no player choices, same-alignment answer, impairment, truth, reliability, registration, Vortox state, Storyteller choice, or ability-spent state.

Deferral closes and settles only the first-night wake. The next task is derived from the actual task plan. This slice creates no recurrence and does not claim that the Seamstress will be awakened on a later night.

## Rule Claim Traceability

### `2B14-C1`: first-night wake order

The unchanged supported catalog places Dreamer at base order `900` and Seamstress at `1000`. Its signature remains:

```text
canonical-first-night-task-catalog-v1:20514c1a
```

The regression proves only the supported subset `Dreamer -> Seamstress`. Steward is outside the current task catalog, so the full official-order evidence test 6 remains unsupported.

### `2B14-C2`: defer without consumption

Exact first-night `DEFER` closes and settles the current wake without creating ability-use or ability-spent state. This covers only the first-night deferral/non-consumption half of evidence regression test 3. Its later-night recurrence half remains unsupported.

### `2B14-C3`: unsupported input fails closed

Future choice input, malformed or extra input, hidden fields, mismatched task or opportunity, and unauthorized actors reject with no domain events or ability state. This covers the unsupported-input boundary portion of evidence regression test 5. Self-target, target count, duplicate targets, target eligibility, and same-alignment legality are not implemented because `CHOOSE_TWO_PLAYERS` is not implemented.

## Stale Repository Contradiction

Fresh reviewed evidence says that a drunk or poisoned Seamstress who completes a legal two-player use still expends the once-per-game ability. The Phase One handoff test `SV-SEAMSTRESS-DRUNK-DOES-NOT-SPEND` says otherwise and remains preserved as historical input.

The stale example in `docs/architecture/10-information-model.md` was corrected to distinguish legal use from deferral. This slice does not interpret or implement impaired legal use. It adds no drunk, poison, information, or consumption behavior. Any such behavior requires a separate evidence-backed design review.

## Atomicity, Replay, And Failure Boundary

Replay and batch validation reject naked, incomplete, reversed, overlong, mixed, duplicate, malformed, and cross-field-mismatched Seamstress batches. A settlement cannot be applied without the matching deferral and closed opportunity.

Metadata generation failures remain retryable `MetadataGenerationFailed` at `event-metadata`. Construction and prospective-validation domain failures remain retryable `DependencyExecutionFailed` at `first-night-role-action`. Retryable failures save no receipt and write no event. An accepted duplicate command id returns the original result without appending a second batch.

Canonical ids and ordering do not use time, randomness, UUIDs, locale collation, or environment-dependent ordering.

## Projection Boundary

No production projection model changed. Player and AI views do not expose:

- Seamstress task or opportunity ids;
- `SEAMSTRESS_ACTION`, `SEAMSTRESS_FIRST_NIGHT_ACTION`, `DEFER`, or `SeamstressActionDeferred`;
- source role or source character-state revision;
- `CHOOSE_TWO_PLAYERS`;
- impairment, ability-use, truth, reliability, registration, or answer details.

Canonical replay retains the closed opportunity and settlement. Those facts are not player or AI knowledge.

## Coverage Status

Seamstress remains overall `SKELETON`.

- Base ability: `SKELETON`; first-night `DEFER` only, with choice, information, and spending unsupported.
- First-night behavior: `PARTIAL`; base opportunity and `DEFER` settlement only.
- Other-night behavior: `NOT_IMPLEMENTED`.
- Philosopher interaction: `SKELETON`; gained-task mapping only, execution unsupported.
- Projection behavior: `SKELETON`; private non-leakage guards only.
- Drunk, poisoned, Vortox, registration, character change, alignment change, death, resurrection, Barista, and Storyteller discretion remain unevaluated or unsupported.

## Verification

Focused verification after implementation:

```text
pnpm typecheck: passed
five focused test files: passed, 446 tests
changed TypeScript ESLint: passed with zero warnings
pnpm --filter @botc/application test: passed, 3 files / 156 tests
pnpm lint: passed with zero warnings
pnpm test: passed, 19 files / 626 tests
pnpm test:coverage: passed, 19 files / 626 tests
coverage: 84.38% statements, 77.52% branches, 97.53% functions
```

The focused set covers application orchestration, event replay, batch semantics, projection non-leakage, and the unchanged catalog order/signature. A repeated fixture rebuild discovered by the first coverage run was removed without changing assertions; the final ordinary and coverage runs both passed.

## Non-Goals

- No two-player choice or target validation.
- No same-alignment answer or private Seamstress information projection.
- No ability consumption, `NO ABILITY`, or future-wake removal.
- No other-night recurrence.
- No drunk, poison, Vortox, Barista, Spy, Recluse, registration, truth, reliability, or simulation.
- No Philosopher-gained Seamstress execution.
- No character/alignment change, death, resurrection, Traveller, or living-state behavior.
- No AI choice policy, UI, Electron, SQLite, persistence adapter, or first-night completion.

## Merge Gate

Merge remains gated on focused and full local checks, independent `CODE_REVIEW_PASS` and `RULE_REVIEW_PASS`, required CI, reviewed HEAD equality with PR HEAD, and a clean worktree. This branch must not merge itself.
