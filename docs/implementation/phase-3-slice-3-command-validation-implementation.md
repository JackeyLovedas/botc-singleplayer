# Phase 3 Slice 3 Command Validation Surface Implementation

## Binding

- `implementationHead`: `PENDING_FINAL_REVIEW`
- `designContract`: `docs/architecture/phase-3-slice-3-command-validation-design-contract-closure.md`
- `ruleEvidence`: `docs/rules/evidence/phase-3-slice-3-command-validation.md`
- `implementationCorrectionCount`: `2/3`
- `productionFilesChanged`: `2`
- `testFilesChanged`: `1`
- `newCommands`: `0`
- `newDomainEvents`: `0`
- `workflowCoverageOwnershipRoutingChanges`: `0`

This is the implementation-time traceability binding for the bounded Slice 3
command-validation surface. It does not create a registry or verifier. The
planned acceptance identities are now materialized by exact test titles below;
supporting authority is limited to existing accepted repository behavior.

## Criterion bindings

| CriterionId | ActualTestFile | ActualTestTitle | ActualPrimaryLayer | ActualReachability | ActualTrust | SupportingAuthorityId | Producer | AuthorityStatus | UsedByCriteria | MutationDisposition | MechanismMatch | Main assertion / entry / failure mechanism |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `S3-C01` | `packages/application/src/game-application-service.test.ts` | `[S3-C01] accepts living nomination and dead nominee through the real command boundary` | `APPLICATION_COMMAND_INTEGRATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `SUP-S3-001` | `GameApplicationService.execute` | `ACCEPTED` | `S3-C01` | `NONE` | `PASS` | Canonical first-day `PlayerDied` precedes a living nomination of the dead nominee; the accepted receipt is idempotently replayed without events, and the same nominator's second nomination is receipt-only rejected. |
| `S3-C02` | `packages/application/src/game-application-service.test.ts` | `[S3-C02] rejects dead nominator and illegal nomination boundaries with receipt-only audit` | `APPLICATION_COMMAND_INTEGRATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `SUP-S3-002` | `GameApplicationService.execute` | `ACCEPTED` | `S3-C02` | `NONE` | `PASS` | Canonical death precedes a dead-nominator invocation; dead actor and wrong-day opening rejections each persist receipts and leave events, rebuilt state, and version unchanged. |
| `S3-C03` | `packages/application/src/game-application-service.test.ts` | `[S3-C03] validates living vote, ghost first use, no-vote, and second-use rejection` | `APPLICATION_COMMAND_INTEGRATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `SUP-S3-003` | `GameApplicationService.execute` and `rebuildOptionalGameState` | `ACCEPTED` | `S3-C03` | `NONE` | `PASS` | Nomination A records a real living `YES` and dead `NO`; later legal nomination B consumes one dead `YES`, duplicate use on B is rejected, and later nomination C rejects exhausted `YES` receipt-only; forged provenance fails replay. |
| `S3-C04` | `packages/application/src/game-application-service.test.ts` | `[S3-C04] rejects incomplete execution lifecycle and preserves execution/death provenance` | `APPLICATION_COMMAND_INTEGRATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `SUP-S3-004` | `GameApplicationService.execute` | `ACCEPTED` | `S3-C04` | `NONE` | `PASS` | The accepted block proves leader count meets threshold without tie, and execution declaration/resolution/death causality remains linked; an uncompleted later vote cannot close and is receipt-only rejected. |
| `S3-C05` | `packages/application/src/game-application-service.test.ts` | `[S3-C05] enforces the exact current command actor-phase-prerequisite matrix` | `APPLICATION_COMMAND_INTEGRATION` | `R1 CURRENTLY_REACHABLE_APPLICATION_PATH` | `T1 EXTERNAL_OR_PERSISTED_BOUNDARY` | `SUP-S3-005` | `GameApplicationService.execute` | `ACCEPTED` | `S3-C05` | `NONE` | `PASS` | All eleven current phase-flow command union entries have representative rejection assertions with receipt-only/event-state invariants; legal DeclareNomination, OpenVote, and CompleteVote entries are also exercised. |

Each physical identity has exactly one primary layer. Replay and structural
checks are supporting assertions and do not substitute for the application
command primary.

`S3-C05` rejection coverage names every current phase-flow command explicitly:
`OpenNominations`, `DeclareNomination`, `OpenVote`, `CastVote`, `CompleteVote`,
`CloseNominations`, `ResolveExecution`, `CompleteNight`, `PublishDawn`,
`BeginNight`, and `SettleOrdinaryNightTask`. The same test accepts the legal
`DeclareNomination` → `OpenVote` → `CompleteVote` path before checking the
completed-nomination reopen rejection.

## Supporting authority registry

The following IDs resolve exactly once. They are existing accepted repository
tests, not the new acceptance identities and not mutated fixtures.

| SupportingAuthorityId | Producer | SourceTestOrFixture | AuthorityStatus | UsedByCriteria | MutationDisposition |
| --- | --- | --- | --- | --- | --- |
| `SUP-S3-001` | `GameApplicationService.execute` | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | `ACCEPTED` | `S3-C01` | `NONE` |
| `SUP-S3-002` | `GameApplicationService.execute` | `packages/application/src/game-application-service.test.ts` — `records rejected commands by game id without changing canonical state` | `ACCEPTED` | `S3-C02` | `NONE` |
| `SUP-S3-003` | `GameApplicationService.execute` / `rebuildOptionalGameState` | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | `ACCEPTED` | `S3-C03` | `NONE` |
| `SUP-S3-004` | `GameApplicationService.execute` / `rebuildOptionalGameState` | `packages/application/src/game-application-service.test.ts` — `accepts CompleteNight and reaches day, vote, execution, and ordinary-night planning` | `ACCEPTED` | `S3-C04` | `NONE` |
| `SUP-S3-005` | `GameApplicationService.execute` | `packages/application/src/game-application-service.test.ts` — `rejects human and AI actors for PlanFirstNightTasks and allows Storyteller` | `ACCEPTED` | `S3-C05` | `NONE` |

## Frozen contract audit

- `plannedAcceptanceIdentitiesImplemented`: `S3-C01-PA-001, S3-C02-PA-001, S3-C03-PA-001, S3-C04-PA-001, S3-C05-PA-001`.
- `plannedSupportingAuthorityCount`: `5`.
- `unresolvableSupportingAuthorityCount`: `0`.
- `newCommands`: `0`; `newDomainEvents`: `0`; `newRejectionCodes`: `0`.
- `rejectedCommandAuditRepresentation`: `RECEIPT_ONLY`.
- `ruleEvidenceChanged`: `false`; dead nomination, dead nominee, ghost-vote, execution/death, actor/phase, C/C1, coverage, ownership, routing, and 2B18 contracts are unchanged.
- `workflowChanged`: `false`; Hosted CI was not run by the implementer.

The implementation remains subject to a fresh independent code/rule review on
the committed implementation HEAD. No acceptance, push, PR, merge, or Phase 4
start is implied by this artifact.
