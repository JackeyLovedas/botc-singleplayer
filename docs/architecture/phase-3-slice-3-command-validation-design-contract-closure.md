# Phase 3 Slice 3 — Design Contract Closure Reslice

## Authority and disposition

- `authorization`: `USER_AUTHORIZED_PHASE_3_SLICE_3_DESIGN_CONTRACT_CLOSURE_RESLICE_AND_AUTOMATIC_CONTINUATION`
- `sliceId`: `PHASE_3_SLICE_3_COMMAND_VALIDATION_SURFACE`
- `priorDesignHead`: `6a26ebe98c006b041a88139ae484b2f21fb0415b`
- `priorDesignCorrectionCount`: `2/2` (historical; not reset)
- `priorDesignDisposition`: `RULE_DESIGN_FIX_REQUIRED`
- `closureCorrectionBudget`: `0/1`
- `implementationAuthorized`: `false` pending a fresh independent `RULE_DESIGN_PASS`
- `ruleEvidencePath`: `docs/rules/evidence/phase-3-slice-3-command-validation.md`
- `ruleEvidenceSha256`: `1c9aa4fd13bc8d024b9ce4ba81ff2754308ea4905b2884c4e5eb03b916f568d5`
- `ruleEvidenceChanged`: `false`
- `governanceAuthorityPath`: `docs/architecture/ADR-reachability-trust-boundaries-and-review-governance-v1.md`
- `governanceAuthoritySha256`: `f32bcbc92feb710afb9d12f6105c89e8223a7ea98bd1d73ce249b15b3d59a432`

This document is the only active closure artifact. The prior design remains
historical and is not rewritten. All accepted Slice 2C semantics, rule
evidence, actor/phase matrix, ghost-vote mapping, execution provenance, file
budget, and stop-loss limits are inherited unchanged except for the two
governance rows explicitly closed below.

## Closure of the two review blockers

### S3-C05 historical claim and correction

The complete historical row was:

- `criterionId`: `S3-C05`
- `exactClaim`: `Phase and actor boundaries are enforced without a parallel state machine.`
- `oldPrimaryLayer`: `STRUCTURAL_VALIDATION`
- `oldReachability`: `R1 CURRENTLY_REACHABLE_APPLICATION_PATH`
- `oldTrust`: `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`
- `oldSupportingAuthorities`: planned text claiming `S3-R15..S3-R16`, existing phase-transition policy, and command union
- `oldPlannedAcceptanceIdentity`: none (the old acceptance list was not an explicit identity)

The structural payload validator is not the primary mechanism for this claim.
The final row narrows completion to the real application command path; payload
shape validation is supporting-only. No criterion split is necessary because
the claim does not assert hostile replay or a standalone structural parser.

### Final nine-field criterion contract

| criterionId | exactClaim | completionCriterion | requiredEvidenceMechanism | reachabilityClass | trustClass | primaryLayer | expectedResult | designAuthorityKind |
|---|---|---|---|---|---|---|---|---|
| `S3-C01` | A legal living-player nomination and an allowed dead nominee produce the existing nomination fact. | Real application accepts both with canonical `NominationDeclared`, actor/phase/once-per-day checks, receipt and replay. | `APPLICATION_COMMAND_INTEGRATION` plus accepted-stream replay | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | One accepted receipt, one canonical event, deterministic state/version advance. | `RULE_PRIMARY + REPOSITORY_EXISTING_BEHAVIOR_SUPPORT + PLANNED_ACCEPTANCE_IDENTITY` |
| `S3-C02` | Dead players cannot nominate; illegal nomination actor, phase, and lifecycle commands are rejected. | Real death precedes dead-nominator invocation; representative rejections persist receipts and append zero domain events. | `APPLICATION_COMMAND_INTEGRATION` rejection/no-event matrix | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | Deterministic rejected receipt; state, version, and events unchanged. | `RULE_PRIMARY + REPOSITORY_EXISTING_BEHAVIOR_SUPPORT + PLANNED_ACCEPTANCE_IDENTITY` |
| `S3-C03` | Living and dead voting follow the bounded ghost-token contract. | Living vote accepted; dead counted `YES` consumes once; `NO` hand-down does not consume; second counted use rejects; replay rejects forged provenance. | `APPLICATION_COMMAND_INTEGRATION` plus accepted/rejected replay and hostile provenance | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | Correct `VoteCast.ghostVoteConsumed`, tally, receipts, and replay result. | `RULE_PRIMARY + REPOSITORY_EXISTING_BEHAVIOR_SUPPORT + PLANNED_ACCEPTANCE_IDENTITY` |
| `S3-C04` | Execution resolves only after the active nomination/vote lifecycle and applies threshold, leader, and tie rules. | Incomplete lifecycle rejects receipt-only; complete lifecycle uses existing block provenance and execution/death-separated events or no-execution path. | `APPLICATION_COMMAND_INTEGRATION` plus replay/hostile provenance | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | Accepted execution or deterministic no-execution outcome; no fabricated candidate. | `RULE_PRIMARY + REPOSITORY_EXISTING_BEHAVIOR_SUPPORT + PLANNED_ACCEPTANCE_IDENTITY` |
| `S3-C05` | The existing application command path enforces the exact actor, phase, and prerequisite boundary for every current Slice 3 command without a parallel state machine. | Each command-union row has a representative legal invocation and illegal actor/phase/prerequisite invocation through `GameApplicationService`; rejected invocations are receipt-only and event-free. | `APPLICATION_COMMAND_INTEGRATION`; structural payload validation is supporting-only | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `APPLICATION_COMMAND_INTEGRATION` | Existing deterministic rejection codes; unchanged state/version; zero domain events on rejection. | `RULE_PRIMARY + REPOSITORY_EXISTING_BEHAVIOR_SUPPORT + PLANNED_ACCEPTANCE_IDENTITY` |

`primaryLayer` is unique per criterion and no row mixes primary mechanisms.
The five rows retain the same five-criterion scope; `criterionSplitCount=0`.

## Complete authority binding table

The closure audit uses one explicit authority record per criterion. `ruleAuthority`
identifies only the already-frozen rule-evidence claims; repository authority is
the implementation seam whose behavior will be tested. `plannedHostileIdentity`
is `NONE` where no new hostile identity is needed. `crossLayerSupportingOnly`
prevents payload-shape or replay material from becoming a second primary.

| criterionId | exactClaim | primaryLayer | reachabilityClass | trustClass | designAuthorityKind | ruleAuthority | repositoryAuthority | existingSupportingAuthorities | plannedAcceptanceIdentity | plannedHostileIdentity if applicable | crossLayerSupportingOnly | currentEvidenceStatus |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `S3-C01` | Legal living nomination and allowed dead nominee produce the existing nomination fact. | `APPLICATION_COMMAND_INTEGRATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `RULE_PRIMARY + REPOSITORY_EXISTING_BEHAVIOR_SUPPORT + PLANNED_ACCEPTANCE_IDENTITY` | `S3-R01..S3-R04` in frozen rule evidence | `packages/application/src/game-application-service.ts` nomination command path | `game-application-service.test.ts :: accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` (`ACCEPTED`) | `S3-C01-PA-001` | `NONE` | Payload shape and accepted-stream replay are supporting only. | `DESIGN_ONLY_PENDING_IMPLEMENTATION` |
| `S3-C02` | Dead players cannot nominate and illegal nomination boundaries reject. | `APPLICATION_COMMAND_INTEGRATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `RULE_PRIMARY + REPOSITORY_EXISTING_BEHAVIOR_SUPPORT + PLANNED_ACCEPTANCE_IDENTITY` | `S3-R01..S3-R04` in frozen rule evidence | `packages/application/src/game-application-service.ts` actor/death/phase preflight and rejected receipt path | `game-application-service.test.ts :: records rejected commands by game id without changing canonical state` (`ACCEPTED`) | `S3-C02-PA-001` | `NONE` | Structural payload and receipt-store details are supporting only. | `DESIGN_ONLY_PENDING_IMPLEMENTATION` |
| `S3-C03` | Living and dead voting follow the bounded ghost-token contract. | `APPLICATION_COMMAND_INTEGRATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `RULE_PRIMARY + REPOSITORY_EXISTING_BEHAVIOR_SUPPORT + PLANNED_ACCEPTANCE_IDENTITY` | `S3-R05..S3-R11` in frozen rule evidence | `packages/application/src/game-application-service.ts` `CastVote` producer and replay path | `game-application-service.test.ts :: accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` (`ACCEPTED`) | `S3-C03-PA-001` | `NONE` | Forged-event replay checks are supporting only. | `DESIGN_ONLY_PENDING_IMPLEMENTATION` |
| `S3-C04` | Execution resolves only after the active lifecycle and applies threshold/leader/tie rules. | `APPLICATION_COMMAND_INTEGRATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `RULE_PRIMARY + REPOSITORY_EXISTING_BEHAVIOR_SUPPORT + PLANNED_ACCEPTANCE_IDENTITY` | `S3-R12..S3-R14` in frozen rule evidence | `packages/application/src/game-application-service.ts` `ResolveExecution` producer and block provenance | `game-application-service.test.ts :: accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` (`ACCEPTED`) | `S3-C04-PA-001` | `NONE` | Hostile provenance and replay checks are supporting only. | `DESIGN_ONLY_PENDING_IMPLEMENTATION` |
| `S3-C05` | The existing application command path enforces the exact actor, phase, and prerequisite boundary for the current command union. | `APPLICATION_COMMAND_INTEGRATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `RULE_PRIMARY + REPOSITORY_EXISTING_BEHAVIOR_SUPPORT + PLANNED_ACCEPTANCE_IDENTITY` | `S3-R15..S3-R16` in frozen rule evidence, limited to phase/flow boundaries | `packages/application/src/game-application-service.ts` actor/phase preflight and command union | `game-application-service.test.ts :: rejects Human and AI actors for PlanFirstNightTasks and allows Storyteller` (`ACCEPTED`); `game-application-service.test.ts :: records rejected commands by game id without changing canonical state` (`ACCEPTED`) | `S3-C05-PA-001` | `NONE` | Structural payload validation is supporting only; no second primary. | `DESIGN_ONLY_PENDING_IMPLEMENTATION` |

The supporting authorities above are intentionally fragmentary: they anchor
existing repository conventions but do not claim that the planned Slice 3
identities already exist. Therefore `unresolvableExistingSupportingAuthorityCount=0`
and `plannedSupportingAuthorityCount=0` without manufacturing evidence.

## Supporting authority materialization

Supporting authority is limited to existing accepted repository behavior. A
supporting row is not an acceptance identity and does not authorize
implementation. Planned supporting authority is deliberately zero.

| criterionId | repositoryAuthority | existingSupportingAuthorities | supported claim fragment |
|---|---|---|---|
| `S3-C01` | `packages/application/src/game-application-service.ts` real command boundary | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` — status `ACCEPTED` | Existing serial application path reaches nomination, vote, and execution commands with canonical events and rebuild. |
| `S3-C02` | `packages/application/src/game-application-service.ts` rejected receipt path | `packages/application/src/game-application-service.test.ts` — `records rejected commands by game id without changing canonical state` — status `ACCEPTED` | Rejected command receipts are persisted without canonical state mutation. |
| `S3-C03` | `packages/application/src/game-application-service.ts` `CastVote` producer and replay path | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` — status `ACCEPTED` | Existing vote command and replay path are repository foundations; ghost-token cases remain planned acceptance work. |
| `S3-C04` | `packages/application/src/game-application-service.ts` `ResolveExecution` producer and block provenance | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` — status `ACCEPTED` | Existing execution/death-separated event chain and phase transition are preserved. |
| `S3-C05` | `packages/application/src/game-application-service.ts` actor/phase preflight and command union | `packages/application/src/game-application-service.test.ts` — `rejects Human and AI actors for PlanFirstNightTasks and allows Storyteller` — status `ACCEPTED`; `packages/application/src/game-application-service.test.ts` — `records rejected commands by game id without changing canonical state` — status `ACCEPTED` | Existing actor policy and receipt-only rejection conventions; Slice 3 command rows remain acceptance work. |

All listed authorities are real paths and exact current test titles. They are
supporting fragments only; none is substituted for a Slice 3 primary.

## Planned acceptance identities (not supporting authority)

| plannedAcceptanceIdentity | criterionId | planned file | planned exact title | expected primary | status |
|---|---|---|---|---|---|
| `S3-C01-PA-001` | `S3-C01` | `packages/application/src/game-application-service.test.ts` | `[S3-C01] accepts living nomination and dead nominee through the real command boundary` | `APPLICATION_COMMAND_INTEGRATION` | `NOT_YET_IMPLEMENTED` |
| `S3-C02-PA-001` | `S3-C02` | `packages/application/src/game-application-service.test.ts` | `[S3-C02] rejects dead nominator and illegal nomination boundaries with receipt-only audit` | `APPLICATION_COMMAND_INTEGRATION` | `NOT_YET_IMPLEMENTED` |
| `S3-C03-PA-001` | `S3-C03` | `packages/application/src/game-application-service.test.ts` | `[S3-C03] validates living vote, ghost first use, no-vote, and second-use rejection` | `APPLICATION_COMMAND_INTEGRATION` | `NOT_YET_IMPLEMENTED` |
| `S3-C04-PA-001` | `S3-C04` | `packages/application/src/game-application-service.test.ts` | `[S3-C04] rejects incomplete execution lifecycle and preserves execution/death provenance` | `APPLICATION_COMMAND_INTEGRATION` | `NOT_YET_IMPLEMENTED` |
| `S3-C05-PA-001` | `S3-C05` | `packages/application/src/game-application-service.test.ts` | `[S3-C05] enforces the exact current command actor-phase-prerequisite matrix` | `APPLICATION_COMMAND_INTEGRATION` | `NOT_YET_IMPLEMENTED` |

`plannedSupportingAuthorityCount=0`; planned acceptance identities are future
test identities and cannot be cited as present support. No planned hostile
identity is required because hostile replay is consumed by the existing
replay-oriented acceptance identities and has no new primary layer.

## Governance self-audit

| field | value |
|---|---:|
| `mixedPrimaryCriterionCount` | `0` |
| `missingPrimaryCriterionCount` | `0` |
| `invalidReachabilityTokenCount` | `0` |
| `invalidTrustTokenCount` | `0` |
| `plannedSupportingAuthorityCount` | `0` |
| `unresolvableExistingSupportingAuthorityCount` | `0` |
| `plannedAcceptanceIdentityMissingCount` | `0` |
| `duplicateCriterionIdentityCount` | `0` |
| `productSemanticDeltaCount` | `0` |
| `ruleSemanticDeltaCount` | `0` |

`S3-C05_PRIMARY_LAYER_STILL_WRONG = CLOSED`.
`PLANNED_SUPPORTING_AUTHORITY_INCOMPLETE = CLOSED`.

## Inherited frozen contracts

The following are explicitly unchanged: rule evidence and its SHA; dead
nomination rejection and dead nominee allowance; counted ghost-vote
consumption, `NO` hand-down non-consumption, and second-use rejection; receipt-
only rejected-command audit with no domain event; exact actor/phase matrix;
execution provenance and execution/death separation; no new commands/events;
the four-file production and four-file test budgets; C1 event count and
approved structural delta; active coverage profile; ownership/routing; 2B18
`HUMAN_BLOCKED_UNCHANGED`; and `Phase3FinalAccepted`.

The closure artifact does not change workflow, product behavior, rule
semantics, C/C1, coverage, ownership, routing, dependencies, or publication.
Implementation remains unauthorized until a fresh independent reviewer reads
this artifact at its committed HEAD and returns `RULE_DESIGN_PASS`.
