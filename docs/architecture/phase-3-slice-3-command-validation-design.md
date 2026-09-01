# Phase 3 Slice 3 — Command Validation Surface Design

## Status and authority

- `sliceId`: `PHASE_3_SLICE_3_COMMAND_VALIDATION_SURFACE`
- `designStatus`: `PENDING_INDEPENDENT_RULE_DESIGN_REVIEW`
- `baseMainHead`: `585a73c2ad020c282b116f62a73d674c0182273f`
- `ruleEvidence`: `docs/rules/evidence/phase-3-slice-3-command-validation.md`
- `ruleVerdict`: `RULE_READY`
- `designCorrectionBudget`: `1/2`
- `implementationCorrectionBudget`: `0/3`
- `implementationAuthorized`: `false` until an independent `RULE_DESIGN_PASS`

Phase 3 and Slice 2C remain accepted and closed. 2B18 remains
`HUMAN_BLOCKED_UNCHANGED`. This design keeps the historical name “Phase 3 Slice
3” and does not reopen or renumber Phase 3.

## Bounded objective

Harden the existing command-validation surface for the basic nomination, vote,
execution, and phase commands. Reuse the existing serial application command
path, domain batch prospective validation, rejected-command receipt store,
canonical event types, and replay validator. This is validation-surface
hardening, not a flow rewrite or a new command framework.

Out of scope: Storyteller UI or protocol, multiplayer transport, AI decision
logic, special-role legality, Traveller/exile, game-over checks, Slice 4
projection work, 2B18, new dependencies, workflow changes, and new logical
group topology.

## Existing capability census disposition

| Capability | Disposition | Design consequence |
|---|---|---|
| nomination validation | `ALREADY_ACCEPTED_REUSABLE_FOUNDATION` | Preserve canonical `NominationDeclared`; add real-path boundary evidence. |
| vote validation | `PARTIALLY_IMPLEMENTED` at Slice 3 edge | Preserve `VoteCast`; close dead-token first-use/second-use evidence and phase/actor boundaries. |
| execution validation | `PARTIALLY_IMPLEMENTED` at Slice 3 edge | Preserve `ExecutionDeclared`/`ExecutionResolved`; add threshold/tie/incomplete-lifecycle evidence. |
| phase-command validation | `ALREADY_ACCEPTED_REUSABLE_FOUNDATION` | Preserve existing phase policy and command names; reject exact illegal phase. |
| illegal actor/phase rejection | `PARTIALLY_IMPLEMENTED` for 2C commands | Use existing receipt path and rejection codes; no parallel matrix implementation. |
| rejected receipt persistence/idempotency | `ALREADY_ACCEPTED_REUSABLE_FOUNDATION` | Keep `recordRejectedCommand`, fingerprint, conflict, and retry semantics. |
| rejected command audit | `ALREADY_ACCEPTED_REUSABLE_FOUNDATION` | Receipt-only audit; zero domain events. |
| dead nomination rejection | `PARTIALLY_IMPLEMENTED` evidence | Exercise real death event then real command. |
| ghost vote consumption | `PARTIALLY_IMPLEMENTED` evidence | Exercise real death, counted hand-up consumption, and second-use rejection. |

## Rejected Command Audit Boundary

`rejectedCommandAuditRepresentation = RECEIPT_ONLY`.

An invalid command is validated before event creation. A successful rejection
must persist one deterministic rejected receipt, append zero domain events,
leave `gameVersion` unchanged, and leave canonical state unchanged. Rejected
receipts are audit data and are excluded from `rebuildGameState`.

Accepted commands, rejected commands, and failed command execution remain three
distinct outcomes. A rejected-receipt write failure returns the existing
retryable `CommandExecutionFailed` with `failureStage=rejected-receipt-write`;
it must not claim a persisted rejection. No `InvalidCommandRejected` domain
event or other parallel rejection event is introduced.

## Rule-bound validation contract

### Nomination

- Legal phase is the existing nomination window.
- Actor must be a roster player and alive; human/AI actor player identity must
  match the command actor.
- Actor may nominate at most once per day.
- Nominee must be a roster player and may be alive or dead; a player may be
  nominated at most once per day.
- Only one nomination may be active at once; existing `NominationDeclared`
  remains canonical.

### Voting

- Legal phase is the existing vote window for an existing active nomination.
- Actor must be a roster player; human/AI identity must match.
- Living players may vote repeatedly during the day as rules allow.
- A dead player has one remaining vote token for the game. A counted raised-hand
  vote consumes it. A hand-down/no-vote (the application `NO` representation,
  if retained) does not consume it. There is no distinct BOTC “raised NO” act.
- A second counted dead-player vote is rejected. `VoteCast.ghostVoteConsumed`
  remains the canonical event field; no `GhostVoteConsumed` event is added.

### Execution

- Resolution requires the current nomination/vote lifecycle to be complete.
- The candidate must have a nonzero tally, at least half of living players,
  and strictly more votes than every other nominee. A tie or below-threshold
  tally yields no execution.
- At most one execution occurs per day. Execution and death remain distinct;
  existing `ExecutionResolved` and optional `PlayerDied` semantics are reused.

### Phase commands

Only commands actually present in the current command union are covered:
`CompleteNight`, `PublishDawn`, `OpenNominations`, `DeclareNomination`,
`OpenVote`, `CastVote`, `CompleteVote`, `CloseNominations`, `ResolveExecution`,
`BeginNight`, and `SettleOrdinaryNightTask`. No speculative command is added.
Each command must satisfy the existing exact payload validator, actor policy,
phase policy, and canonical prerequisites before events are produced.

## Actor matrix (representative current surface)

| Command family | human | ai | storyteller | system |
|---|---:|---:|---:|---:|
| `DeclareNomination`, `CastVote` | ALLOW when actor/player and phase are legal | ALLOW when actor/player and phase are legal | REJECT | REJECT |
| `OpenNominations`, `OpenVote`, `CompleteVote`, `CloseNominations`, `ResolveExecution`, `PublishDawn`, `CompleteNight`, `BeginNight`, `SettleOrdinaryNightTask` | REJECT | REJECT | ALLOW only where existing policy permits | ALLOW only where existing policy permits |

This matrix is an acceptance target for current commands, not a new actor
authorization subsystem. Existing repository conventions decide the exact
rejection code (`ActorNotAllowed`, `ActorPlayerMismatch`, or
`CommandNotAllowedInPhase`) rather than inventing names.

## Acceptance and hostile evidence matrix

The implementation must add focused real-path tests for these equivalence
classes and boundaries (exact criterion IDs follow repository convention):

1. legal living nomination accepted;
2. dead nominator rejected after canonical `PlayerDied`;
3. illegal nomination actor rejected;
4. nomination in wrong phase rejected;
5. dead nominee remains allowed;
6. legal living vote accepted;
7. first legal counted ghost vote consumes the token;
8. hand-down/`NO` no-vote leaves token available;
9. second counted ghost vote rejected;
10. illegal vote actor and wrong phase rejected;
11. execution before vote lifecycle completion rejected;
12. valid execution accepted with execution/death separation;
13. phase command wrong actor and wrong phase rejected;
14. every rejection writes zero domain events and leaves state/version unchanged;
15. same command ID and fingerprint returns the original rejection idempotently;
16. same command ID with a different fingerprint preserves conflict behavior;
17. accepted events plus rejected receipts rebuild identically;
18. hostile replay cannot forge ghost-vote state, voter identity, nomination
    identity, or event ordering.

No test manually mutates a dead flag. Death is introduced only through the
canonical `PlayerDied` event chain and then replayed through the real command
entry point.

## Rejection taxonomy boundary

Prefer existing stable codes: `ActorNotAllowed`, `ActorPlayerMismatch`,
`CommandNotAllowedInPhase`, `CommandIdempotencyConflict`,
`DomainValidationFailed`, and existing command-specific codes where already
defined. Add a new code only if an existing code cannot preserve deterministic,
user/audit-meaningful semantics for a Slice 3 boundary; any such addition must
be justified in the implementation review. Do not create one code per `if`,
duplicate domain-error internals, or leak hidden role/death-cause information.

## Governance and boundary invariants

- No product behavior or accepted Slice 2C event semantics are changed.
- No new domain event, command family, state machine, dependency, or workflow.
- Rejected receipts remain outside C1 event inventory; C1 counts and approved
  structural deltas remain unchanged.
- New tests use existing logical groups and live ownership; historical
  ownership baselines are immutable. A new logical group or unexplained
  identity loss is a stop condition.
- Coverage is forward append-only from
  `phase-3-slice-2c-closure-52c4e97-coverage-v1`; test-only deltas may be
  `sourceDelta=0`, but final counts are captured only after stable tests.
- Existing behavior is reused where correct; implementation changes are
  limited to demonstrated validation gaps.

## Stop-loss and release chain

Design corrections are capped at `2`; implementation corrections at `3`.
Stop for a new rule conflict, broad receipt redesign, new topology, C1
structural delta, special-role expansion, dependency, unexplained ownership or
coverage loss, or any need to reopen Phase 3/2C/2B18.

After independent `RULE_DESIGN_PASS`: implementation → local evidence and
gates → fresh code and rule reviews → exact-head publication/CI/PR → merge and
post-merge closeout. Slice 3 success must leave Phase 3 and Slice 2C accepted,
2B18 blocked unchanged, and no automatic Slice 4 start.

## Design Correction 1 — frozen traceability and exact boundaries

### Governance V1.1 criterion matrix

Each criterion has one primary mechanism and the complete nine-field design
contract below. Supporting evidence may be attached later without changing the
primary layer.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| `S3-C01` | A legal living-player nomination and an allowed dead nominee produce the existing nomination fact. | Real `GameApplicationService` path accepts both cases with canonical `NominationDeclared`, correct actor/phase/once-per-day checks, and deterministic receipt/replay. | `APPLICATION_COMMAND_INTEGRATION` plus accepted-stream replay. | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | Accepted receipt, one domain event, deterministic state/version advance. | `PLANNED_SUPPORTING_AUTHORITY: Rule claims S3-R01..S3-R04; existing nomination event/schema evidence.` |
| `S3-C02` | Dead players cannot nominate; illegal nomination actor/phase/lifecycle commands are rejected. | Real death event precedes a dead-nominator command; each representative actor/phase/lifecycle rejection persists a receipt and writes zero domain events. | `APPLICATION_COMMAND_INTEGRATION` rejection/no-event matrix. | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | Deterministic rejected receipt; state/version/events unchanged. | `PLANNED_SUPPORTING_AUTHORITY: Rule claims S3-R01..S3-R04; command/receipt architecture.` |
| `S3-C03` | Living and dead voting follow the bounded ghost-token contract. | Living vote accepted; dead `YES` (counted raised hand) consumes once; dead `NO` (hand-down/no-vote) is recorded as non-counting and does not consume; second counted dead use rejects. | `APPLICATION_COMMAND_INTEGRATION` plus accepted/rejected replay and hostile forged-event cases. | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | Correct `VoteCast.ghostVoteConsumed`, tally and receipts; no hidden-role leakage. | `PLANNED_SUPPORTING_AUTHORITY: Rule claims S3-R05..S3-R11; VoteCast schema and replay validator.` |
| `S3-C04` | Execution resolves only after the active nomination/vote lifecycle and applies threshold/leader/tie rules. | Incomplete/stale lifecycle rejects with receipt-only; complete lifecycle yields existing `BlockStateUpdated` and execution/death-separated events or the existing no-execution close path. | `APPLICATION_COMMAND_INTEGRATION` plus replay/hostile provenance. | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1` | `APPLICATION_COMMAND_INTEGRATION` | Accepted execution or deterministic no-execution outcome; no fabricated candidate. | `PLANNED_SUPPORTING_AUTHORITY: Rule claims S3-R12..S3-R14; block/tally provenance and existing event semantics.` |
| `S3-C05` | Phase and actor boundaries are enforced without a parallel state machine. | Every current Slice3 command has an exact actor set, legal phase, and prerequisite row tested for representative allow/reject cases. | `STRUCTURAL_VALIDATION` for payloads plus `APPLICATION_COMMAND_INTEGRATION` for actor/phase. | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1` | `STRUCTURAL_VALIDATION` | Exact existing rejection codes; zero events on rejected invocation. | `PLANNED_SUPPORTING_AUTHORITY: Rule claims S3-R15..S3-R16; existing phase-transition policy and command union.` |

No criterion claims a new domain rejection event, role rule, or Slice 4 behavior.

### Exact `CastVote` mapping

The current payload remains `{ commandType: "CastVote", nominationId,
choice: "YES" | "NO" }`. Slice 3 freezes the application mapping as follows:

- `choice=YES` means the actor raises their hand; it is a counted vote and is
  included in the existing yes tally.
- `choice=NO` means the actor keeps their hand down; it is not a BOTC vote, is
  excluded from the yes tally, and is represented by one `VoteCast` with
  `ghostVoteConsumed=false`.
- There is no supported “raised-hand NO” variant. Any future payload attempting
  to encode one is rejected as malformed/unsupported and is outside this slice.
- For a dead voter, only a counted `YES` consumes the one token. A dead `NO`
  receipt/event does not consume it, but the same command identity cannot be
  repeated for the same nomination because command idempotency and one-vote-
  per-nomination constraints remain separate from token consumption.
- A dead voter may issue a later legal `YES` on a later nomination after an
  earlier `NO`; that first counted `YES` consumes the token. Any later counted
  use rejects. Death transition itself never consumes the token.

The existing repository command contract also permits at most one `CastVote`
command per voter per nomination. This is an application idempotency/lifecycle
constraint, not a new BOTC rule claim; it applies equally to repeated `NO`
commands and does not alter the one-token semantics above.

The prospective validator and replay validator must derive and compare
`ghostVoteConsumed === dead(voter) && choice === "YES"`; a forged mismatch is
hostile replay rejection.

### Exact current command actor/phase/prerequisite matrix

The following rows cover the complete current basic-flow command union; no
“where policy permits” placeholder remains.

| Command | human | ai | storyteller | system | Exact legal phase | Required prerequisite |
|---|---|---|---|---|---|---|
| `OpenNominations` | REJECT | REJECT | ALLOW | ALLOW | `DAY_DISCUSSION` | Day is open; no active nomination. |
| `DeclareNomination` | ALLOW | ALLOW | REJECT | REJECT | `NOMINATION_WINDOW` | Actor roster+alive; target roster; actor/target daily limits; no active nomination. |
| `OpenVote` | REJECT | REJECT | ALLOW | ALLOW | `NOMINATION_WINDOW` | Referenced nomination is current and active. |
| `CastVote` | ALLOW | ALLOW | REJECT | REJECT | `VOTING` | Current active nomination; actor roster; alive actor or unused dead token; no duplicate vote for this nomination. |
| `CompleteVote` | REJECT | REJECT | ALLOW | ALLOW | `VOTING` | Current nomination has an opened vote; tally can be computed. |
| `CloseNominations` | REJECT | REJECT | ALLOW | ALLOW | `NOMINATION_WINDOW` | Current day and nomination window are open; no unresolved active vote. |
| `ResolveExecution` | REJECT | REJECT | ALLOW | ALLOW | `EXECUTION_RESOLUTION` | Current block is complete and tied to the latest nomination/vote result. |
| `CompleteNight` | REJECT | REJECT | ALLOW | ALLOW | `FIRST_NIGHT` or `NIGHT_TASKS` | Existing plan version and all required tasks settled. |
| `PublishDawn` | REJECT | REJECT | ALLOW | ALLOW | `DAWN_RESOLUTION` | Current night complete; canonical dawn boundary. |
| `BeginNight` | REJECT | REJECT | ALLOW | ALLOW | `NIGHT_TASKS` | Day execution/close completed; first-night tasks settled. |
| `SettleOrdinaryNightTask` | REJECT | REJECT | ALLOW | ALLOW | `NIGHT_TASKS` | Referenced task exists, is next, and is unsettled. |

Actor-kind mismatch returns existing `ActorNotAllowed`; human/AI player
identity mismatch returns `ActorPlayerMismatch`; phase or prerequisite mismatch
returns `CommandNotAllowedInPhase` or existing `DomainValidationFailed` at the
same boundary already used by the application. No new taxonomy is required by
this design.

### Execution lifecycle and provenance

`ResolveExecution` is not a generic “close day” command. Its accepted path must
be preceded by the current nomination’s `OpenVote → CastVote* → CompleteVote`
chain and the resulting `BlockStateUpdated` for that nomination. The block’s
`nominationId`, `dayNumber`, living-player count, threshold, leader nomination,
leader tally, and tie bit are the sole provenance inputs. A missing, stale,
foreign, or incomplete block is a rejected command: receipt-only, zero events,
unchanged version/state. This is distinct from a complete block whose leader is
absent, tied, or below threshold; that legal no-execution case uses the existing
`DayClosedWithoutExecution` plus phase transition batch. A resolvable leader
uses the existing `ExecutionDeclared → ExecutionResolved` chain and optional
`PlayerDied`, preserving execution/death separation. Duplicate resolution of
the same block is rejected/idempotent under existing command identity rules.

### Frozen file and size budget

Only these files may change during implementation (plus the required D1-style
Slice3 traceability/review document under `docs/implementation/`):

- Production: `packages/application/src/game-application-service.ts`,
  `packages/domain-core/src/command.ts`,
  `packages/domain-core/src/domain-batch-semantics.ts`,
  `packages/domain-core/src/event-stream-validator.ts`.
- Tests: `packages/application/src/game-application-service.test.ts`,
  `packages/domain-core/src/domain-batch-semantics.test.ts`, and focused tests
  colocated with the above modules only.
- Documentation: this design, the Slice3 implementation traceability, and
  independent review artifacts.

Production file budget: maximum `4` files and `+220` net lines; test file
budget: maximum `4` files and `+650` net lines; documentation is unbounded but
must remain Slice3-specific. No workflow, dependency, coverage-profile,
ownership-registry, C1 descriptor, event-definition, or semantic-validator
schema changes are authorized. Exceeding any budget is a stop/rescope.

Baseline scope bindings are frozen to current main: C1 event inventory and
approved structural delta unchanged; active coverage profile remains
`phase-3-slice-2c-closure-52c4e97-coverage-v1`; role coverage remains unchanged
and no role may be marked `COMPLETE`; ownership/routing must remain in existing
application/domain groups with zero unexplained identity loss.
