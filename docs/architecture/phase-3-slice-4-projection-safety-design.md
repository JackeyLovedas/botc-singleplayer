# Phase 3 Slice 4 Projection Safety Design

authorization: `USER_AUTHORIZED_PHASE_3_SLICE_4_PROJECTION_SAFETY_END_TO_END_CLOSURE`
baseMainHead: `ad0e3ff86d7ff37e1db5a14fd908be5c46d9d57d`

## Scope

This slice adds only a public-safe projection and a viewer-bound general player
projection. Existing role-specific private knowledge builders remain the sole
private-information authority. Storyteller views, AI memory, UI/network DTOs,
persistence adapters, new rules, commands, events, and C1 descriptors are out
of scope.

## Source authority and composition

`buildPublicGameProjection(state)` consumes canonical `GameState`. The accepted
event-stream convenience builder first calls the existing replay/rebuild path,
then delegates to that same state builder. `buildGeneralPlayerProjection`
composes the public result with `buildPlayerPrivateKnowledgeView`; it never
redacts a copied `GameState` and never reimplements private knowledge rules.
The bounded implementation may extend the existing `packages/projections/src/index.ts`
module so no second projection package or dependency is introduced.

## Closed schemas

`PublicGameProjection` contains only:

- version, game identity, game version, phase and day/night counters;
- roster `playerId`, `seatNumber`, `displayName`, and derived `ALIVE`/`DEAD`;
- canonical nominations and public vote choices/counts;
- execution declarations and public execution outcome marker;
- final alive/dead state.

No role, alignment, truth, reliability, impairment, effect cause, task,
opportunity, tenure, entitlement, ledger, receipt, command, or event identity
is emitted. `GeneralPlayerProjection` is `{ public, privateKnowledge }` with a
required `viewerPlayerId`; unknown viewers fail closed.

## Execution/death

`ExecutionResolved` and `PlayerDied` remain distinct. Public execution records
do not infer death from execution; alive/dead is derived only from canonical
death state. A `DID_NOT_DIE` execution therefore remains publicly executed but
the target remains `ALIVE`.

## Leakage and parity contract

Tests use structural key audits and positive assertions. They cover full
assignment, truth/reliability, hidden effect causes, task/opportunity internals,
receipt/audit metadata, cross-player private isolation, legal private-history
preservation, and state-vs-accepted-stream parity. Replay validation remains in
the existing rebuild boundary; this slice does not duplicate event validation.

## Acceptance identities

The implementation binds ten bounded criteria: safe public projection;
assignment/truth/effect-cause exclusion; player composition; cross-player
isolation; task/opportunity and receipt exclusion; execution/death separation;
and live/replay parity. Existing projection identities and private-history
tests remain unchanged and are regression authorities.

## Non-goals

No Storyteller projection, general AI surface, AI memory, UI, Electron,
network, persistence, projection database, CQRS layer, role ability, rule
change, Slice 5 interaction, Mathematician expansion, or 2B18 restoration.

## Design correction addendum (S4-DESIGN-F01..F07)

This addendum is normative and supersedes any parent wording that conflicts
with it. It is a design-only correction (`1/2`); it does not authorize the
uncommitted implementation diff. Implementation remains unauthorized until a
fresh independent reviewer returns `RULE_DESIGN_PASS`.

### Closed authority and file/size budget

`buildPublicGameProjection(state)` and
`buildGeneralPlayerProjection(state, viewerId)` are T2-only consumers of an
already validated canonical `GameState`. They do not replay events, validate
receipts, inspect command stores, or infer hidden truth. The accepted-stream
builders are the T1 boundary: they call `rebuildGameState(events)` once and
delegate to the state builders. Missing roster, missing private knowledge, or
unknown viewer fails closed through the existing domain error boundary. Every
returned object and nested array is a fresh copy.

The implementation allowlist is: `packages/projections/src/index.ts` (or one
additional file in that package), projection tests under the same directory,
this design plus one Slice 4 traceability report, and an append-only ownership
record only if the existing inventory needs it. Production source is at most
2 files and 220 added LOC; no domain events, commands, C1 descriptors,
semantic validators, workflow, dependencies, Storyteller/AI/UI/network/
persistence surfaces, or Slice 5 files may change. Existing logical group
`projections / engines-and-projections` is retained. Expected deltas are
`newCommands=0`, `newDomainEvents=0`, `newDependencies=0`, `newC1Descriptors=0`,
and `newApprovedStructuralDeltaCount=0`; test identity loss is zero and role
coverage remains unchanged.

### Corrected closed schemas and canonical identity boundary

The public schema is exactly (votes and counts are nested under their
ordinally identified nomination, so no internal relation identifier is
needed):

```text
projectionVersion: "public-game-projection-v1"
gameId, gameVersion, phase, dayNumber, nightNumber
roster[]: playerId, seatNumber, displayName, lifeStatus(ALIVE|DEAD)
nominations[]: nominatorPlayerId, nomineePlayerId, dayNumber, nominationOrdinal,
  votes[]: voterPlayerId, choice(YES|NO),
  voteCounts: yesCount, noCount
executions[]: targetPlayerId, dayNumber, status(EXECUTED), targetLifeStatus
```

`nominationOrdinal` is the only public relation key. Votes are nested and
ordered within their enclosing nomination; no internal relation identifier is
emitted. `nominationId`, `voteId`, `executionId`, `blockId`,
`ghostVoteConsumed`, command/event metadata, receipt IDs, fingerprints,
rules-baseline fields, task/opportunity IDs, and audit diagnostics are all
forbidden. Public-safe fields are game identity, player identity/seat/name,
phase/counters, nomination participants, vote choices/counts, execution
marker, and final life status. `GeneralPlayerProjection` is exactly
`{projectionVersion, viewerPlayerId, public, privateKnowledge}`; the private
portion is the existing viewer-bound historical private view only.

### Determinism, consistency, and execution/death

Roster ordering is ascending numeric seat; nominations are ordered by
`(dayNumber, nominationOrdinal)`; votes retain canonical accepted order within
each nomination; counts follow nomination order; executions are ordered by
`(dayNumber, canonical execution order)`. Incidental `Map` insertion order is
not authority. T1 replay rejects duplicate, missing, reordered, or
cross-linked hostile history; T2 assumes canonical consistency and fails closed
on missing required relations rather than inferring them.

`ExecutionResolved` and `PlayerDied` remain separate. Slice 4 adds no outcome
field to `GameState` and does not claim to expose `DID_NOT_DIE` as a stored
outcome. It emits only an `EXECUTED` marker for an execution declaration;
`targetLifeStatus` is read solely from canonical death state. Execution plus
`ALIVE` therefore expresses execution without inferred death; execution plus
`DEAD` reflects the separately recorded death fact. No death event is
synthesized from execution.

### Governance V1.1 traceability freeze

Every criterion has all nine required design-time fields:
`CriterionId`, `RuleClaim`, `CompletionCriterion`, `RequiredEvidenceMechanism`,
`ExpectedReachability`, `ExpectedTrust`, `ExpectedPrimaryLayer`,
`ExpectedResult`, and `SupportingAuthorityRequirement`.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| S4-C01 | public schema is closed and safe | all emitted keys allowlisted and safe fields present | structural schema + positive assertion | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | PROJECTION | PASS | `PLANNED_SUPPORTING_AUTHORITY`: accepted roster fixture, no mutation |
| S4-C02 | assignments, roles, alignment, truth and impairment never leak | recursive audit finds none | forbidden-field audit | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | PROJECTION | PASS | `PLANNED_SUPPORTING_AUTHORITY`: accepted private-view fixture, clone-only |
| S4-C03 | hidden causes and other-player private facts are excluded | no cause/source/private-answer/other-player key | structural leakage + cross-view comparison | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | PROJECTION | PASS | `PLANNED_SUPPORTING_AUTHORITY`: accepted role-specific fixtures, none |
| S4-C04 | general player view composes public and own historical private view | viewer-bound composition; unknown viewer fails closed | composition/fail-closed test | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | PROJECTION | PASS | `PLANNED_SUPPORTING_AUTHORITY`: existing private builder, none |
| S4-C05 | nomination/vote visibility is public-safe and deterministic | ordinal relation, choices, counts, ordering match replay | accepted-stream projection test | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | PROJECTION | PASS | `PLANNED_SUPPORTING_AUTHORITY`: accepted nomination/vote events, no mutation |
| S4-C06 | execution and death remain distinct | marker present; life status only from canonical death state | execution/death separation test | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | PROJECTION | PASS | `PLANNED_SUPPORTING_AUTHORITY`: accepted 2C evidence, none |
| S4-C07 | replay boundary rejects hostile history | rebuild occurs before projection and rejects tampering | replay/rebuild rejection test | R3_HOSTILE_OR_CORRUPTED_HISTORY | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | HOSTILE_REPLAY_REJECTION | PASS | `PLANNED_SUPPORTING_AUTHORITY`: hostile mutated accepted prefix |
| S4-C08 | output is deterministic and mutation-isolated | repeated builds equal; output mutation cannot alter state | determinism + defensive-copy test | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T2_CANONICAL_DERIVED_STATE | PROJECTION | PASS | `PLANNED_SUPPORTING_AUTHORITY`: accepted state fixture, clone-only |
| S4-C09 | receipt/audit metadata is outside the dependency graph | builder accepts no receipt store and emits no such key | signature/dependency structural validation | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | STRUCTURAL_VALIDATION | PASS | `PLANNED_SUPPORTING_AUTHORITY`: architecture-boundary test, none |
| S4-C10 | direct and replay projections are equal | live/state and accepted-stream public/player outputs equal | state/replay parity test | R1_CURRENTLY_REACHABLE_APPLICATION_PATH | T1_EXTERNAL_OR_PERSISTED_BOUNDARY | PROJECTION | PASS | `PLANNED_SUPPORTING_AUTHORITY`: accepted stream, no mutation |

Implementation traceability must add actual file/title, actual layer,
reachability/trust, a unique `SUP-<slice>-NNN` or `NONE`, and semantic
`MechanismMatch`. A physical test has exactly one primary layer; hostile R3
rejection is never relabeled accepted integration.

### Leakage, receipt exclusion, lifecycle, and stop-loss

The minimum regression matrix includes recursive forbidden-key checks for
assignments, roles/alignment, truth/reliability/impairment, hidden effect
causes, task/opportunity/ability internals, tenure/entitlement/ledger,
command/event/receipt/audit IDs, ghost-vote state, and other-player private
facts; positive safe-field checks; nomination/vote/count/execution visibility;
execution plus final `ALIVE`; malformed/reordered replay rejection;
unknown-viewer and missing-roster fail-closed behavior; defensive-copy
isolation; dependency/signature proof that no receipt store is consumed; and
all existing private-information tests. No projection layer receives receipt
input, so receipt exclusion is an architecture boundary claim, not a hidden
`GameState` field.

Normal source/tests are accepted implementation assets. Generated evidence is
`ARCHIVE`; temporary diagnostics are `DELETE_AFTER_SLICE_4`; no registry or
permanent framework is retained. Design correction budget is `1/2`, bounded
implementation repair is at most `3` rounds, and any scope/behavior/dependency/
workflow/C1/identity-generation/canonical-state expansion is an immediate
stop requiring reslice.

## Final design-correction addendum (S4-DC2-F01..F07)

This is the final bounded design correction (`2/2`) and supersedes conflicting
tokens or wording above.

### Legal Governance V1.1 vocabulary

The only reachability values are `R1_CURRENTLY_REACHABLE_APPLICATION_PATH`,
`R2_LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`, `R3_HOSTILE_OR_CORRUPTED_HISTORY`,
and `R4_FUTURE_HYPOTHETICAL_STATE`. The only trust values are
`T1_EXTERNAL_OR_PERSISTED_BOUNDARY`, `T2_CANONICAL_DERIVED_STATE`, and
`T3_MODULE_PRIVATE_PURE_CORE`. Every row below uses these exact enums. `R3`
is reserved for a real hostile persisted/imported history passed to replay; a
static architecture test is not an R3 primary.

### Public/general private-information boundary

`S4-C02` and `S4-C03` apply to `PublicGameProjection` and to the public member
of `GeneralPlayerProjection` only. They prohibit hidden assignment, role,
alignment, truth/reliability/impairment metadata, hidden effect causes, and
other-player private facts. They do not prohibit the separately composed
viewer-bound `privateKnowledge`: the viewer may retain their own character,
known Demon/Minions, Dreamer delivered roles, Seamstress delivered answer,
Clockmaker facts, and Mathematician historical information. Delivered private
facts remain historical and are not recomputed; their truth/reliability/cause
metadata never enters the public member. Tests must prove own legal facts are
present, other-player facts are absent, and public has neither.

### Exact vote relation and deterministic ordering

Each nomination object contains its own ordered `votes[]` and `voteCounts`:

```text
nominations[]: {
  nominatorPlayerId, nomineePlayerId, dayNumber, nominationOrdinal,
  votes[]: { voterPlayerId, choice(YES|NO) },
  voteCounts: { yesCount, noCount }
}
```

There is no flat unbound vote array and no internal relation identifier. Votes
retain accepted order within their enclosing nomination; `ghostVoteConsumed`
and voter seat are never emitted. Roster order is ascending numeric seat;
nominations are `(dayNumber, nominationOrdinal)`; executions are `dayNumber`
only because the canonical model permits at most one execution per day. Any
duplicate/missing/cross-link relation is rejected by the T1 rebuild boundary;
incidental insertion order is not an authority. Regression fixtures include at
least two nominations with multiple votes and executions on multiple days.

### Separate builder preconditions

`buildPublicGameProjection(T2 GameState)` requires only public canonical facts,
including a valid roster, phase and counters; it does **not** require private
knowledge. A rostered canonical state with no private knowledge still yields a
public view. `buildGeneralPlayerProjection(T2 GameState, viewerId)` additionally
requires a known viewer and the existing valid private-knowledge chain; missing
knowledge or unknown viewer fails closed. Both accepted-stream builders are T1
wrappers that replay/rebuild first and then delegate. No projection builder
repeats event validation.

### Receipt boundary and corrected criterion classification

Receipt exclusion is a projection/architecture boundary claim. `S4-C09` is
therefore `R1_CURRENTLY_REACHABLE_APPLICATION_PATH`,
`T1_EXTERNAL_OR_PERSISTED_BOUNDARY`, primary `STRUCTURAL_VALIDATION`, with a
real package dependency/signature audit entry point. It proves that the
projection package depends only on `@botc/domain-core`, builder signatures take
no receipt/command store, and output contains no receipt/fingerprint/rejection
metadata. It is not hostile replay. The audit may also support S4-C01/C03/C08.

### Slice coverage and identity budget

At design time Slice 4 coverage is `SKELETON` with target `ACCEPTED`; the
existing active profile remains immutable. Expected coverage source delta is
`0` when extending `index.ts` and `+1` only if a second projection source is
actually required. Expected test identity delta is append-only: `added=10`
planned acceptance identities (or fewer when an existing identity is reused),
`removed=0`, `unexpected=0`; all identities remain in the existing
`projections / engines-and-projections` logical group. The implementation
report must bind each criterion to one physical test identity with one primary
layer, preserve all existing identities, and record actual source/test counts.
Ownership, routing, coverage-profile, and role-matrix audits must prove these
budgets; role statuses remain exactly as before and no role becomes `COMPLETE`.

The corrected traceability rows are therefore:

| CriterionId | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer |
|---|---|---|---|
| S4-C01 | `R1_CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2_CANONICAL_DERIVED_STATE` | `PROJECTION` |
| S4-C02 | `R1_CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2_CANONICAL_DERIVED_STATE` | `PROJECTION` |
| S4-C03 | `R1_CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2_CANONICAL_DERIVED_STATE` | `PROJECTION` |
| S4-C04 | `R1_CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2_CANONICAL_DERIVED_STATE` | `PROJECTION` |
| S4-C05 | `R1_CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `PROJECTION` |
| S4-C06 | `R1_CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2_CANONICAL_DERIVED_STATE` | `PROJECTION` |
| S4-C07 | `R3_HOSTILE_OR_CORRUPTED_HISTORY` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `HOSTILE_REPLAY_REJECTION` |
| S4-C08 | `R1_CURRENTLY_REACHABLE_APPLICATION_PATH` | `T2_CANONICAL_DERIVED_STATE` | `PROJECTION` |
| S4-C09 | `R1_CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `STRUCTURAL_VALIDATION` |
| S4-C10 | `R1_CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1_EXTERNAL_OR_PERSISTED_BOUNDARY` | `PROJECTION` |

All other nine-field values for S4-C01…S4-C10 remain those in the preceding
Governance V1.1 table; no new criterion, primary layer, support framework, or
authority system is introduced.
