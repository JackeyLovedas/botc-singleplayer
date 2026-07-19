# Phase 3 Slice 2B19A3B1 Design — Canonical Drunk Dreamer Vortox Core

## Metadata

- `sliceId`: `2B19A3B1`
- `sliceName`: `Canonical Drunk Dreamer Vortox Core`
- `taskType`: `PRODUCT_SLICE`
- `designRound`: `1/2`
- `designStatus`: `READY_FOR_RULE_DESIGN_REVIEW_ROUND_1`
- `implementationAuthorized`: `false`
- `rulesBaseline`: `Phase One v2.1`
- `governanceBaseline`: `Engineering Governance Traceability V1.1`
- `primaryRisk`: `CANONICAL_DRUNK_BASE_DREAMER_VORTOX_DELIVERY_AND_LEDGER_CORE`
- `sliceCoverage`: `PARTIAL`
- `implementationLabel`: `CANONICAL_DRUNK_VORTOX_CORE_ONLY`
- `parentFailedSlice`: `2B19A3B / RESLICE_REQUIRED / UNACCEPTED`
- `parentDesignAuthorityRead`: `docs/implementation/phase-3-slice-2b19a3b-design-round-2.md`
- `parentDesignCanonicalLfSha256`: `0cba266e40ea4ce792e1d45fcec656b8389392ed9f6feaef511aefaa19021a0c`
- `resliceAuthorization`: `USER_AUTHORIZED_2B19A3B_RESLICE_TO_CORE_AND_DEFER_COMBINED_MATHEMATICIAN_INTEGRATION`
- `ruleEvidence`: `docs/rules/evidence/2B19A3B1.md`
- `ruleEvidenceCanonicalLfSha256`: `ae48ce51ddbcd6ba3bae2dc49ab6441769e77c55f994aa8c2e043e98e58a2653`
- `ruleEvidenceRetrieval`: `2026-07-18T21:38:04+08:00`
- `ruleVerdict`: `RULE_READY`
- `governanceRecord`: `docs/architecture/2B19A3B1-go-no-go-under-governance-v1.md`
- `governanceDecision`: `GO`
- `acceptedBaseHead`: `45a467cec81703d911914de464180e5192fc7714`
- `archivedExperimentCommit`: `ef51b62777751ecf0480f14fb98b378197f6ef21`
- `archivedExperimentPatchSha256`: `b271c2db780c0940e001bd0dec596ff21fd70950a0af6cee6ec861b9aa5a8a6c`

This document is the complete standalone Round 1 specification for independent rule design review. It does not claim `RULE_DESIGN_PASS`, does not authorize implementation, and does not make the archived experiment accepted authority.

## Authorities and Precedence

Rule truth is controlled only by the fresh evidence and its recorded sources, with approved user overrides first. Code, tests, old designs, README files, the archive experiment, and model memory are non-authoritative for BOTC rule truth.

The design preserves accepted authority from:

- Slice 2B19A1: base Dreamer V2 opportunity contract;
- Slice 2B19A2: effective native/base Dreamer V2 normal information;
- Slice 2B19A3A: effective native/base Dreamer V3 Vortox forced-false information and stored Vortox provenance;
- accepted ownership/traceability infrastructure and the active 2B19A3A ownership record.

When implementation is authorized later, it may use exactly one controlled recovery method: selectively reimplement or selectively apply reviewed hunks from the external patch/archive into the current branch after confirming every hunk against this design and current base. Wholesale restore, merge, cherry-pick, or treating the archive commit as authority is forbidden.

## Parent Failure and Exact Reslice

The failed parent Slice attempted to cross the unsupported Philosopher-gained Dreamer task and formally settle Mathematician. That made its former `C24` unreachable and incorrectly equated the native/base Dreamer's one contribution with a final combined total.

This reslice:

- keeps the valid native/base Dreamer V4 delivery, atomic settlement, ledger fact, and private projection;
- deletes the formal Mathematician total claim;
- replaces the valid part of former `C24` with four atomic criteria `C20`–`C23`;
- contains no `C24` criterion;
- stops at the next currently reachable boundary, which is the still-unsettled Philosopher-gained Dreamer task;
- does not continue to Seamstress;
- defers combined settlement to `2B19A3B2_COMBINED_MATHEMATICIAN_INTEGRATION`, after `2B19B_PHILOSOPHER_GAINED_DREAMER_EXECUTION`.

## Scope

The successful R1 vertical path is exactly:

1. a real formal Philosopher command chooses Dreamer;
2. accepted events establish the Philosopher's gained ability and the canonical DRUNK effect on the original/native Dreamer;
3. existing scheduling and opportunity authority expose the native/base Dreamer V3 opportunity;
4. a real formal target command chooses a legal non-self, non-Traveller target;
5. source effectiveness resolves to the new exact capability branch `CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED` only when the canonical DRUNK provenance and effective current alive Vortox both validate;
6. deterministic policy chooses one native GOOD role and one native EVIL role, both different from the target's settlement-time true role;
7. one atomic batch appends the existing V2 target event, the exact V4 delivery event, and the existing scheduled-task settlement event;
8. prospective validation from batch-start state and replay validate the whole batch and reconstruct the exact V4 from pre-delivery facts;
9. ledger derivation creates exactly one terminal abnormal fact for the base Dreamer with the approved triple and exactly one DRUNK evidence entry;
10. authorized player and AI source projections expose only the historical target/good/evil pair;
11. the next scheduled boundary is the Philosopher-gained Dreamer task, which remains unsettled and is not executed or skipped.

## Explicit Non-goals

This Slice does not implement or authorize:

- successful Philosopher-gained Dreamer execution;
- a final or combined Mathematician count, ledger close, number delivery, or assertion that `trueCount=1`;
- Seamstress continuation as a Slice acceptance prerequisite;
- poisoned Dreamer successful settlement;
- impaired/ineffective Vortox successful information semantics beyond preserving the accepted applicability/rejection seams;
- No Dashii or any other impairment source;
- later-night Dreamer;
- Storyteller free-choice UI/API or randomness;
- a generic impairment, false-information, evidence, ledger, event, state, projection, or audit framework;
- a new event type, canonical state field, evidence union member, persistence schema, public trust boundary, package, dependency, migration, or CI infrastructure change;
- changing accepted V1/V2/V3 payload meaning, existing role tenure, assignment, setup, task plan, or coverage claims.

## Reachability Classification

- `R1 CURRENTLY_REACHABLE_APPLICATION_PATH`: the real native/base Dreamer success chain, real formal failures/retries, source projection, and the reachable `ApplicationNotConfigured` rejection if a gained-Dreamer command is invoked. The successful Slice path stops before invoking that command.
- `R2 LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`: exact replay compatibility for Dreamer V1, V2 normal, and V3 effective-source Vortox history.
- `R3 HOSTILE_OR_CORRUPTED_HISTORY`: malformed/forged V4, provenance mismatch, duplicate/conflicting impairment, malformed/partial/mixed batch, duplicate delivery/settlement, or hostile object shape.
- `R4 FUTURE_HYPOTHETICAL_STATE`: successful gained Dreamer, combined Mathematician integration, poisoned Dreamer success, impaired Vortox variants, No Dashii, later nights, and generic engines.

No R4 behavior is a current acceptance prerequisite.

## Trust Classification

- `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`: formal command inputs; event envelopes/persisted/imported history; V4 runtime validation; replay; projection viewer/public input. It requires exact enumerable keys, exception-safe plain data, dense arrays, supported versions, canonical IDs, no symbols/getters/proxies/cycles/nonplain values, and fail-closed provenance.
- `T2 CANONICAL_DERIVED_STATE`: validated rebuilt state, pre-event canonical state, task/opportunity/source/target/tenure cross-links, ledger derivation, and deterministic projection construction.
- `T3 MODULE_PRIVATE_PURE_CORE`: exact canonical DRUNK predicate, Vortox capability resolution, candidate selection, raw UTF-16 comparison, clone/equality, and V4 construction.

## Exact V4 Runtime Contract

Add only `DreamerInformationDeliveredPayloadV4` with:

- `deliverySchemaVersion = "dreamer-information-delivered-v4"`;
- `informationReliability = { kind: "VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK" }`;
- existing `knowledgeModelVersion = "dreamer-information-model-v1"`;
- existing `knowledgeStage = "DREAMER_INFORMATION"`;
- existing `falseRolePolicyVersion = "dreamer-false-role-policy-v1"`;
- existing V3 opportunity schema and existing base-source contract;
- one exact embedded canonical DRUNK snapshot;
- one exact existing Vortox constraint snapshot.

The exact top-level enumerable key set is:

```text
deliverySchemaVersion
evaluatedCharacterStateRevision
evilRole
falseRolePolicyVersion
goodRole
informationReliability
knowledgeModelVersion
knowledgeStage
nightNumber
opportunityId
opportunitySchemaVersion
rulesBaselineVersion
sourceCharacterStateRevision
sourceContract
sourceImpairment
sourcePlayerId
sourceSeatNumber
targetPlayerId
targetSeatNumber
taskId
taskType
vortoxConstraint
```

The semantic shape is:

```ts
type DreamerInformationDeliveredPayloadV4 = {
  rulesBaselineVersion: string;
  deliverySchemaVersion: "dreamer-information-delivered-v4";
  nightNumber: 1;
  taskId: ScheduledTaskId;
  taskType: "DREAMER_ACTION";
  opportunityId: ActionOpportunityId;
  opportunitySchemaVersion: typeof DREAMER_V3_OPPORTUNITY_SCHEMA_VERSION;
  knowledgeModelVersion: "dreamer-information-model-v1";
  knowledgeStage: "DREAMER_INFORMATION";
  sourcePlayerId: PlayerId;
  sourceSeatNumber: SeatNumber;
  sourceCharacterStateRevision: positiveSafeInteger;
  evaluatedCharacterStateRevision: positiveSafeInteger;
  sourceContract: BaseDreamerV2SourceContract;
  targetPlayerId: PlayerId;
  targetSeatNumber: SeatNumber;
  informationReliability: {
    kind: "VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK";
  };
  sourceImpairment: DreamerCanonicalPhilosopherDrunkSourceImpairment;
  vortoxConstraint: DreamerVortoxConstraint;
  goodRole: RoleSetupSnapshot;
  evilRole: RoleSetupSnapshot;
  falseRolePolicyVersion: "dreamer-false-role-policy-v1";
};
```

`BaseDreamerV2SourceContract` remains exact with these eleven keys and meanings: `sourceContractVersion`, `kind="BASE"`, `taskPlanVersion="first-night-task-plan-v2"`, `taskId`, `taskType="DREAMER_ACTION"`, `sourcePlayerId`, `sourceSeatNumber`, `sourceRoleId="dreamer"`, `sourceRoleTenureId`, `sourceCharacterStateRevision`, and `sourceAbilityInstanceId`.

`DreamerCanonicalPhilosopherDrunkSourceImpairment` has exactly nine enumerable keys:

```ts
{
  impairmentId: AbilityImpairmentId;
  kind: "DRUNK";
  sourceKind: "PHILOSOPHER_CHOSEN_DUPLICATE";
  sourcePlayerId: PlayerId;
  affectedPlayerId: PlayerId;
  affectedSeatNumber: SeatNumber;
  affectedRole: RoleSetupSnapshot;
  chosenRoleId: "dreamer";
  sourceCharacterStateRevision: positiveSafeInteger;
}
```

Its exact key set is `affectedPlayerId`, `affectedRole`, `affectedSeatNumber`, `chosenRoleId`, `impairmentId`, `kind`, `sourceCharacterStateRevision`, `sourceKind`, `sourcePlayerId`.

`DreamerVortoxConstraint` retains exactly seven enumerable keys:

```ts
{
  constraintVersion: "dreamer-vortox-constraint-v1";
  evaluatedCharacterStateRevision: positiveSafeInteger;
  kind: "VORTOX_FORCED_FALSE_REQUIRED";
  vortoxPlayerId: PlayerId;
  vortoxRoleId: "vortox";
  vortoxRoleTenureId: RoleTenureId;
  vortoxSeatNumber: SeatNumber;
}
```

`RoleSetupSnapshot` retains exactly `roleId`, `characterType`, `defaultAlignment`, `edition`, and `setupModifier`; `setupModifier` retains exactly `outsiderDelta` and `townsfolkDelta`. V4 construction and admission use the existing exact snapshot/catalog validators, not structural TypeScript trust.

All V4/nested clones are fieldwise and reference-isolated. Equality is semantic fieldwise equality across the entire V4, including source contract, impairment, Vortox constraint, role snapshots, revisions, and reliability. Extra/missing fields and accessor/proxy/symbol/cycle/nonplain inputs fail closed before observation can escape.

## Canonical DRUNK Provenance

V4 is eligible only for exactly one active impairment matching all of:

- `kind="DRUNK"`;
- `sourceKind="PHILOSOPHER_CHOSEN_DUPLICATE"`;
- `chosenRoleId="dreamer"`;
- `affectedPlayerId`, seat, role, and revision agree with the native/base Dreamer and its accepted source contract/current validated state;
- the impairment source player is the real Philosopher whose accepted choice created it;
- the source/effect revisions are temporally consistent with target choice and evaluation;
- there is no duplicate DRUNK, no DRUNK+POISONED conflict, and no conflicting impairment.

Canonical DRUNK without effective Vortox must not fall through to V2 normal information or manufacture V4. Through the formal R1 application command it returns the existing `ApplicationNotConfigured` boundary, emits no events, advances no game version, leaves the task/opportunity open, and consumes no retryable command ID.

POISONED never selects V4. Successful poisoned information remains R4.

## Effective Vortox Applicability

Extend the accepted `resolveBaseDreamerV2NormalCapability` seam with exactly one branch:

```text
CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED
```

It contains the existing evaluation model/revision, base Dreamer tenure/ability-instance identities, exact canonical DRUNK snapshot, and exact existing Vortox constraint.

Precedence is fixed:

1. exact effective native/base Dreamer with no impairment and no effective Vortox -> existing V2 normal branch;
2. exact effective native/base Dreamer with no impairment and effective current alive Vortox -> existing V3 branch;
3. exact canonical Philosopher-caused DRUNK plus effective current alive Vortox -> V4 branch;
4. canonical DRUNK without effective Vortox -> formal unsupported boundary;
5. POISONED, duplicate/conflicting impairment, unresolved No Dashii, invalid source provenance, non-unique current Demon, catalog mismatch, missing/inconsistent Vortox tenure, or Vortox-effectiveness conflict -> fail closed under existing unresolved/impaired results, never V4.

Vortox applicability is evaluated at settlement from validated current state, accepted tenure, catalog, and impairment facts. Vortox itself must be current, alive, uniquely identified, catalog-consistent, have continuous matching Vortox tenure, and have no conflicting effectiveness impairment. Stored V4 preserves the evaluation snapshot; later state must not reinterpret old delivery.

## Forced-false Candidate Policy

At settlement:

- `goodRole` candidates are native catalog roles whose `characterType` is `TOWNSFOLK` or `OUTSIDER`;
- `evilRole` candidates are native catalog roles whose `characterType` is `MINION` or `DEMON`;
- both exclude the target's settlement-time true `roleId`, regardless of default alignment or registration;
- candidates must be exact catalog snapshots and legal under the existing script/catalog contract;
- sort by the repository's raw UTF-16 stable-ID comparator and select the first legal candidate in each set;
- candidate order must not depend on insertion order, environment locale, `localeCompare`, `Intl.Collator`, time, random UUIDs, `Math.random`, or `Date.now`;
- empty or ambiguous candidate sets fail before metadata/commit and remain retryable;
- the stored pair is historical delivered knowledge and is never recomputed from later character state.

The result is exactly one native GOOD-category role and one native EVIL-category role, and neither equals the target truth; this satisfies forced-false semantics for either GOOD or EVIL targets.

## Pre-event Proof and Non-circular Validation

Every formal command begins by rebuilding the complete accepted prefix and validating setup, task plan/progress, opportunities, current character state, tenure, impairments, existing choices/deliveries, and command/version/actor authority.

The V4 proof is non-circular:

1. resolve the base source, target, exact canonical DRUNK, and effective Vortox from the accepted prefix and validated prospective pre-delivery state;
2. derive the deterministic legal role pair from that settlement-time state;
3. construct the expected V4 field by field;
4. compare the submitted/generated delivery with that expected V4;
5. only then admit and apply the delivery.

A stored V4 payload is never considered its own proof. Shape validation alone is not accepted-history provenance. Replay must reconstruct the expected exact V4 from the state immediately before the delivery and reject any mismatch.

Prospective validation starts from the batch-start state, applies each candidate event in order through the real event applier, revalidates cross-event invariants after each step, and requires the exact final state before append. A future event cannot retroactively justify an earlier event.

## Atomic Batch Contract

The successful settlement is one ordered, contiguous, same-command, same-batch append containing exactly:

1. `DreamerTargetChosen` using the existing V2 target payload;
2. `DreamerInformationDelivered` using exact V4;
3. `ScheduledTaskSettled` using the existing Dreamer settlement shape.

The batch uses contiguous event sequences, one batch identity, one command identity, one expected starting version, and one committed game-version advance. It closes the opportunity and task exactly once and produces one successful receipt.

Reject before commit:

- delivery without the matching target;
- settlement without target and delivery;
- target-only or target+delivery partial batch;
- wrong order;
- wrong task/opportunity/source/target/revision cross-link;
- mixed V2/V3/V4 generation;
- duplicate target, delivery, or settlement;
- non-contiguous sequence or different batch/command identity;
- a prior accepted delivery/settlement for the same opportunity/task;
- any prospective state that would be invalid after a prefix or at final state.

No failure may leave target, delivery, task progress, ledger, receipt, or game version partially committed.

## Ledger Contribution Contract

The existing `FirstNightAbilityOutcomeLedger` and closed evidence union are reused unchanged. V4 derivation creates exactly one `FirstNightAbilityOutcomeFact` for the native/base Dreamer terminal delivery:

```text
sourcePlayerId = native/base Dreamer player
abilityRoleId = dreamer
outcomeStatus = ABNORMAL
causeKind = VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility = true
```

The fact preserves its base `abilityInstance`, Dreamer task, source event/batch/sequence, evaluated character-state revision, and standard exact evidence matrix. In addition to the existing V3 Vortox proof, V4 includes exactly one existing `ABILITY_IMPAIRMENT` evidence reference with:

```text
kind = ABILITY_IMPAIRMENT
impairmentId = exact stored V4 impairmentId
impairmentKind = DRUNK
affectedPlayerId = native/base Dreamer
affectedSeatNumber = native/base Dreamer seat
affectedRoleId = dreamer
sourceKind = PHILOSOPHER_CHOSEN_DUPLICATE
appliedCharacterStateRevision = exact canonical impairment revision
```

The evidence reference must cross-link exactly to V4, accepted impairment state, source contract, player/seat/role, and evaluated revision. It appears once in canonical evidence order. Duplicate or conflicting evidence fails closed.

The approved attribution is one terminal fact, not two causes:

- no second fact with `SOURCE_DRUNKENNESS`;
- no second fact of any cause for the same native/base Dreamer terminal delivery;
- no new evidence variant;
- no `SOURCE_DRUNKENNESS` companion cause;
- no combined Mathematician total.

The valid base Dreamer fact retains its exact `sourcePlayerId` and base ability-instance identity so a future integration can count that distinct player at most once. This Slice does not perform that future aggregation.

The four atomic contribution criteria are:

- `C20`: exactly one terminal fact for the native/base Dreamer;
- `C21`: exact `ABNORMAL / VORTOX_FALSE_INFORMATION / true` triple;
- `C22`: exactly one canonical DRUNK `ABILITY_IMPAIRMENT` evidence reference;
- `C23`: no second terminal fact and no `SOURCE_DRUNKENNESS` fact/cause.

There is no `C24`.

## Projection and Historical Knowledge

The authorized private source-player view for V4 is byte-for-byte the same public shape as accepted V2/V3 Dreamer knowledge:

```ts
{
  target: { playerId, seatNumber },
  goodRole: RoleSetupSnapshot,
  evilRole: RoleSetupSnapshot
}
```

The source AI view equals the source player view. A non-source player/AI view omits the delivery. No player or AI view may expose:

- `informationReliability`;
- `sourceImpairment`, DRUNK, impairment ID/source/revision, or Philosopher identity;
- `vortoxConstraint`, Vortox identity/tenure/revision;
- truth/correctness markers;
- canonical target role, full assignment, task plan/progress, ledger, Storyteller notes, or internal candidate sets.

Projection accepts only replay-authenticated historical delivered knowledge. State-only/manual injection of V3 or V4 delivery without accepted event provenance fails closed. Viewer input remains T1 and is exact-validated.

Later character, alignment, impairment, Demon, Vortox, tenure, or catalog changes cannot alter a stored accepted V4 pair. Repeated rebuild/projection and same-command idempotent retrieval return the same historical pair without recomputation or mutation.

## Receipt, Retry, and Failure Matrix

| Case | Reachability / layer | Required result |
|---|---|---|
| Successful exact chain | R1 / `ACCEPTED_STREAM_INTEGRATION` | Exact three-event batch commits once; game version advances once; opportunity/task close once; one success receipt; rebuild, ledger, and projection agree. |
| Same successful `commandId` and identical command retried | R1 / `APPLICATION_COMMAND_INTEGRATION` | Return the existing successful receipt/idempotent result; append no event; do not advance version or mutate historical V4. |
| Same `commandId` with different command body | R1 / `APPLICATION_COMMAND_INTEGRATION` | Existing deterministic command-conflict rejection; no event/state/version change. |
| Actor, phase, expected-version, target, or opportunity rejection | R1 / `APPLICATION_COMMAND_INTEGRATION` | Existing deterministic rejected-receipt policy where applicable; no accepted event or canonical mutation. |
| Canonical DRUNK but no effective Vortox | R1 / `APPLICATION_COMMAND_INTEGRATION` | Exact `ApplicationNotConfigured` at the first-night role-action boundary; zero events/receipts/version change; task/opportunity remain open; retryable command ID is not burned. |
| POISONED or duplicate/conflicting impairment | R1 rejection / `APPLICATION_COMMAND_INTEGRATION`; hypothetical success R4 | Never V4; fail closed through existing unsupported/unresolved contract; no commit. |
| Candidate/dependency lookup fails | R1 / `APPLICATION_COMMAND_INTEGRATION` | Fail before metadata; zero events/receipt/version change; command ID remains retryable. |
| Event metadata generation fails | R1 / `APPLICATION_COMMAND_INTEGRATION` | Distinct metadata failure stage; zero append/receipt/version change; retryable. |
| Prospective validation fails | R1 / `APPLICATION_COMMAND_INTEGRATION` | Reject entire candidate batch before append; zero receipt/version/state mutation; retryable. |
| Event append fails | R1 / `APPLICATION_COMMAND_INTEGRATION` | No committed event or success receipt; state/version unchanged; identical retry can succeed. |
| Commit-store fails after staged append | R1 / `APPLICATION_COMMAND_INTEGRATION` | Existing atomic rollback/commit protocol leaves no visible partial batch or successful receipt; identical retry is safe. |
| Receipt persistence fails | R1 / `APPLICATION_COMMAND_INTEGRATION` | Existing receipt boundary must not permit duplicate effects; recovery/retry returns exactly one committed semantic result. |
| Malformed/forged persisted V4 or batch | R3 / `HOSTILE_REPLAY_REJECTION` | Replay/rebuild fails closed; no projection or ledger accepted. |
| Direct malformed V4 shape | R3 / `STRUCTURAL_VALIDATION` | Exact validator rejects without throw leakage or partial observation. |
| Gained-Dreamer task encountered | Successful behavior R4; callable rejection R1 / `APPLICATION_COMMAND_INTEGRATION` | This Slice stops before invocation. If separately invoked, existing `ApplicationNotConfigured`; never skip/settle to reach Mathematician. |

Planner, resolver, candidate, dependency, prospective-validation, and metadata failures do not burn a retryable command ID. Deterministic actor/phase/version/body conflicts retain existing rejected-receipt semantics and must not be reclassified as successful accepted-stream integration.

## Legacy Replay Compatibility

- V1 Dreamer payloads retain their exact legacy interpretation.
- V2 normal-information payloads retain `EFFECTIVE` semantics and existing OPEN/settlement constraints.
- V3 payloads retain `VORTOX_FORCED_FALSE` semantics and accepted A3A provenance/evidence cardinality.
- V4 is a new closed variant; it does not widen or weaken V1/V2/V3 validators.
- No existing accepted event is rewritten, migrated, normalized, or reserialized as V4.
- Clone/equality/rebuild must discriminate the exact schema version before touching variant-specific fields.
- Mixed-version target/delivery/batch provenance fails closed.

## Currently Reachable Stop Boundary

After the accepted native/base Dreamer batch and its projection, the canonical first-night plan must identify the Philosopher-gained Dreamer V2 task as the next unsettled task. The authority test asserts its exact task identity/generation and `unsettled` status, and asserts that no gained-Dreamer delivery/settlement, Seamstress action, Mathematician delivery/ledger close, or later task was fabricated.

The test must not call a helper that skips unsupported work. It must not modify task progress to reach a later role. It may separately preserve the existing formal `ApplicationNotConfigured` rejection as supporting R1 application-command evidence, but that rejection is not accepted-stream success.

## Ownership Contract

After implementation creates the physical tests and complete traceability document, and only then, add one active registry record under the existing schema:

- `marker`: `[2B19A3B1-`
- `owner`: `application-service-dreamer-vortox`
- `traceabilityDoc`: `docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md`
- `supportingAuthorityPrefix`: `SUP-2B19A3B1-`
- `criterionIds`: exactly `C01`–`C23`, `C25`–`C41`, and `S01`–`S20` (with no `C24`)

The active A3A ownership record must remain byte-unchanged. Do not preregister 2B19A3B2 or 2B19B. Do not invent frozen test titles, counts, hashes, or supporting IDs before the actual files exist. Registration occurs only after every criterion has one physical primary authority and the registry's exact frozen-baseline fields can be computed from actual bytes.

## Production Allowlist and Size

Only these five production files may change:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

Expected added production code: 650–950 lines.

Slice stop-loss is inherited exactly from the user-authorized parent Round 2:

- suggested ceiling: no more than 6 changed production files and no more than 1,000 added production lines;
- hard stop: more than 8 changed production files or more than 1,500 added production lines is immediately `RESLICE_REQUIRED`;
- any production file outside the five-file allowlist requires explicit design correction before edit, even if still below the numeric ceiling.

## Test Allowlist

Only these test files may change:

1. `packages/domain-core/src/dreamer.test.ts`
2. `packages/domain-core/src/domain-batch-semantics.test.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
4. `packages/domain-core/src/rebuild.test.ts`
5. `packages/application/src/game-application-service.test.ts`
6. `packages/projections/src/private-knowledge-view.test.ts`

`packages/domain-core/src/mathematician-information.test.ts` is deliberately excluded. Existing Mathematician tests remain required regressions but must not be edited to assert a final total for this Slice.

## Documentation Allowlist

The sole writer may materialize/update only the bounded Slice records required by the agent loop and accepted governance:

- this governance record and design;
- independent design-review record;
- implementation traceability;
- Slice implementation/final status and PR-body source;
- coverage profile and role coverage matrix after accepted implementation evidence;
- ownership registry/data after physical authority exists;
- agent-loop control/state/log files;
- final independent-review/archive and post-merge closeout records required by protocol.

Fresh rule evidence is immutable input unless the rule researcher produces a new separately hashed verdict. No old A3B or accepted A3A record is rewritten.

## Coverage Contract

At implementation completion and after acceptance:

- Slice coverage: `PARTIAL`;
- implementation label: `CANONICAL_DRUNK_VORTOX_CORE_ONLY`;
- Dreamer: remains `PARTIAL`;
- Philosopher: remains `PARTIAL`;
- Mathematician: remains `PARTIAL`;
- Vortox: remains `NOT_STARTED` unless the independent reviewer identifies an already-defined matrix convention that permits only a bounded cell annotation without changing status;
- no role becomes `COMPLETE`;
- 2B19A3B1 does not claim gained Dreamer, combined Mathematician, poisoned Dreamer, generic Vortox, or complete Storyteller discretion.

The matrix update may record only the accepted native/base canonical-DRUNK Vortox path and must preserve all unsupported cells.

## CI and Acceptance Gates

Before final review on the frozen feature HEAD:

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm test:coverage
```

Required CI must execute and pass for that exact HEAD, including Linux validation, ownership-contract self-test, all ordinary Vitest shards and merge, all coverage shards and merge, and Windows deterministic execution. Focused tests are useful diagnostics but cannot replace full gates.

The PR body must contain the exact rule-evidence sections required by `REVIEW_PROTOCOL.md`. Freeze code, tests, docs, generated profile, ownership, traceability, and PR body before review. One complete independent reviewer report must cover exact PR/HEAD and contain every required field, `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`, and `remainingBlockers=[]`. Publish it verbatim under both exact GitHub markers, re-read both comments, verify HEAD equality, and make no post-review commit. Product-head, merge-commit, and closeout CI remain separate provenance records.

## Stop Conditions and Rollback

Return `RESLICE_REQUIRED` immediately if implementation needs a new event/state/evidence kind, public boundary, persistence migration, generic subsystem, successful gained-Dreamer producer, Seamstress continuation, formal Mathematician settlement, combined total, file/LOC hard-stop breach, or archive wholesale restore. Return `HUMAN_BLOCKED` for rule conflict or unavailable required source.

Any material change to rule semantics, V4 shape, batch, receipt/failure, replay, projection, allowlist, size, reachability, trust, coverage, or criterion mechanism requires authorized design correction and fresh design review; it cannot be hidden as implementation repair.

Before merge, rollback is bounded feature-branch reversion/deletion while preserving accepted main/A3A and both experiment archives. After merge, rollback is a normal revert PR with exact-head CI and independent review. Never rewrite persisted accepted V4 history.

## Design-time Traceability — Completion Criteria

Every row freezes exactly: `CriterionId`, `RuleClaim`, `CompletionCriterion`, `RequiredEvidenceMechanism`, `ExpectedReachability`, `ExpectedTrust`, `ExpectedPrimaryLayer`, `ExpectedResult`, and `SupportingAuthorityRequirement`. Physical test titles, final support IDs, counts, and hashes are intentionally deferred until implementation.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C01 | A real healthy Philosopher may choose Dreamer and canonically make the original Dreamer DRUNK. | Formal Philosopher command accepts once, rebuild contains the gained-Dreamer grant/task and exact canonical DRUNK on the native Dreamer. | Real command, append, receipt, and rebuild; no hand-built state. | R1 | T1→T2 | ACCEPTED_STREAM_INTEGRATION | Accepted prefix contains exact Philosopher grant/DRUNK facts. | PLANNED: real accepted Philosopher prefix, unmutated. |
| C02 | Only approved canonical Philosopher-caused Dreamer DRUNK is V4-eligible. | Rebuilt impairment has exact kind/source/chosen-role/source/affected player-seat-role/revision and identity. | Real accepted prefix plus exact derived-state cross-link assertion. | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | One exact canonical DRUNK; no alternate impairment qualifies. | PLANNED: C01 accepted prefix. |
| C03 | The native/base Dreamer opportunity remains the accepted V3 opportunity and base contract. | After Philosopher choice, formal Dreamer action resolves the existing base V3 opportunity without replacing it with gained-source authority. | Real chain; inspect rebuilt task/opportunity/source contract. | R1 | T1→T2 | ACCEPTED_STREAM_INTEGRATION | Base opportunity/source contract exact; gained task distinct and unsettled. | PLANNED: real accepted chain. |
| C04 | Vortox forces a false native good/evil pair for a GOOD target even when Dreamer is canonically DRUNK. | Real formal base Dreamer settlement on a GOOD target commits V4 whose native GOOD and EVIL roles both differ from target truth. | Full producer→batch→append→rebuild→ledger→projection chain. | R1 | T1→T2 | ACCEPTED_STREAM_INTEGRATION | Exact forced-false pair, one commit. | PLANNED: deterministic catalog with legal alternatives. |
| C05 | The same forced-false rule applies to an EVIL target. | Real formal settlement on an EVIL target commits V4 with both role IDs different from target truth. | Separate full real successful chain with EVIL target. | R1 | T1→T2 | ACCEPTED_STREAM_INTEGRATION | Exact forced-false pair, one commit. | PLANNED: deterministic catalog with legal alternatives. |
| C06 | Candidate choice is native-category, truth-excluding, and deterministic. | Pure policy returns first raw-UTF-16-sorted Townsfolk/Outsider and first Minion/Demon after truth exclusion; permutations match. | Direct pure policy tests over catalog permutations and empty/boundary sets. | R1 policy used by producer | T3 | PURE_POLICY_SEAM | Same pair on all platforms/input order; empty set fails. | NONE |
| C07 | V4 has one exact closed runtime shape. | Real successful delivery has exactly 22 top-level keys and exact nested reliability/DRUNK/Vortox/source-contract/role shapes and constants. | Inspect real accepted V4 after rebuild; structural hostile variants are S criteria. | R1 | T1→T2 | ACCEPTED_STREAM_INTEGRATION | Exact V4, no extra/missing data. | PLANNED: C04 real accepted stream. |
| C08 | Accepted V3 effective-source Vortox history keeps exact meaning. | Existing valid V3 accepted/imported history replays identically and produces no DRUNK evidence. | Replay accepted A3A V3 fixture/history through current rebuild. | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | V3 unchanged; no V4 reinterpretation. | PLANNED: accepted A3A V3 history, unmutated. |
| C09 | Accepted V4 history is exactly replayable. | A V4 produced by real command rebuilds to byte/semantic-equivalent delivery, task progress, ledger, and source view. | Real successful producer, persist envelopes, independent rebuild and compare. | R1 | T1→T2 | ACCEPTED_STREAM_INTEGRATION | Rebuild reproduces exact historical result. | PLANNED: real V4 event stream. |
| C10 | Stored V4 cannot prove itself. | Mutating a produced V4 field while keeping surrounding accepted prefix causes replay to reconstruct expected pre-event V4 and reject. | Clone accepted stream, mutate one semantic field, replay. | R3 | T1→T2 | HOSTILE_REPLAY_REJECTION | Fail closed before ledger/projection. | PLANNED: accepted V4 prefix cloned then persisted/imported mutation. |
| C11 | Wrong impairment identity is invalid. | Replacing `impairmentId` with an unbacked canonical ID rejects replay. | Mutated accepted V4 replay. | R3 | T1 | HOSTILE_REPLAY_REJECTION | Rejected; no projection/fact. | PLANNED: accepted V4 clone mutated. |
| C12 | Impairment player/seat/role cross-links are exact. | Each wrong affected player, seat, or non-Dreamer role snapshot rejects. | Table-driven mutated accepted V4 replay. | R3 | T1→T2 | HOSTILE_REPLAY_REJECTION | Every mismatch fails closed. | PLANNED: accepted V4 clone plus alternate roster/catalog entries. |
| C13 | Only Philosopher duplicate-choice DRUNK for chosen Dreamer is eligible. | Wrong `sourceKind`, source player, or `chosenRoleId` rejects. | Mutated accepted V4 replay. | R3 | T1→T2 | HOSTILE_REPLAY_REJECTION | No alternate provenance admitted. | PLANNED: accepted V4 clone mutated. |
| C14 | Impairment and evaluation revisions are temporally/cross-field exact. | Zero, future, stale, unequal, or out-of-window source/evaluated/impairment revisions reject. | Structural and replay mutations against real accepted stream. | R3 | T1→T2 | HOSTILE_REPLAY_REJECTION | All invalid revision relations rejected. | PLANNED: accepted V4 clone mutated. |
| C15 | Duplicate canonical DRUNK provenance is ambiguous and unsupported. | Adding a duplicate matching DRUNK prevents V4 producer acceptance and commits nothing. | Formal command over real prefix fault/fixture with duplicate active impairment. | R1 rejection | T1→T2 | APPLICATION_COMMAND_INTEGRATION | No events/receipt/version change; retryable. | PLANNED: accepted prefix extended through canonical test fixture authority, no forged accepted delivery. |
| C16 | DRUNK plus POISONED conflict must not select V4. | Formal base Dreamer command with both exact DRUNK and POISONED fails closed before metadata/commit. | Real formal command over validated conflicting derived state. | R1 rejection; success R4 | T1→T2 | APPLICATION_COMMAND_INTEGRATION | Never V4; zero commit. | PLANNED: validated impairment-state fixture. |
| C17 | POISONED Dreamer success is not implemented by this Slice. | POISONED-only formal command never emits V2/V3/V4 and preserves retry boundary. | Real formal application command. | R1 rejection; success R4 | T1→T2 | APPLICATION_COMMAND_INTEGRATION | Existing unsupported/unresolved result; zero commit. | PLANNED: validated POISONED prefix. |
| C18 | Canonical DRUNK without effective Vortox is formally unsupported. | Real formal Dreamer command returns exact `ApplicationNotConfigured`, zero events/receipt/version change, open task/opportunity, reusable command ID. | Real command plus before/after store and retry assertions. | R1 | T1→T2 | APPLICATION_COMMAND_INTEGRATION | Exact no-commit retryable boundary. | PLANNED: accepted canonical DRUNK prefix without Vortox. |
| C19 | Target, V4 delivery, and settlement are one atomic batch. | Successful real command appends exactly those three ordered contiguous events in one batch/version and closes once. | Inspect append and rebuilt state from real successful command. | R1 | T1→T2 | ACCEPTED_STREAM_INTEGRATION | Exact three-event atomic result. | PLANNED: real accepted V4 stream. |
| C20 | The native/base Dreamer contributes exactly one terminal ledger fact. | Derived ledger contains exactly one fact whose source player/task/base ability instance/source event identify the native Dreamer delivery. | Derive ledger from real accepted V4 stream; filter by exact source/delivery identity. | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Fact count for base Dreamer terminal delivery is exactly one. | PLANNED: real accepted V4 stream. |
| C21 | The approved terminal attribution is Vortox abnormality. | That sole fact is exactly `ABNORMAL / VORTOX_FALSE_INFORMATION / true`. | Assert exact triple on ledger derived from real accepted stream. | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact approved triple. | PLANNED: C20 real accepted V4 stream. |
| C22 | Canonical DRUNK must be proven once in the Vortox fact. | Sole fact contains exactly one `ABILITY_IMPAIRMENT` whose fields exactly match stored/accepted canonical DRUNK. | Cross-link V4, accepted impairment, and canonicalized ledger evidence. | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | One and only one exact DRUNK evidence reference. | PLANNED: C20 stream and accepted impairment state. |
| C23 | DRUNK is evidence, not a second terminal cause/fact. | No second terminal fact exists and no fact for the delivery has `SOURCE_DRUNKENNESS`. | Whole-ledger negative assertion from real accepted stream. | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | One fact total; zero `SOURCE_DRUNKENNESS` companion facts. | PLANNED: C20 real accepted V4 stream. |
| C25 | Source player receives only historical Dreamer pair. | Source private view equals target/good/evil shape and omits all secret metadata. | Project from replay-authenticated accepted V4 stream. | R1 | T1→T2 | PROJECTION | Exact safe source view. | PLANNED: accepted V4 stream. |
| C26 | Source AI receives the same bounded pair, never canonical state. | AI source view deep-equals player source view and omits reliability/impairment/Vortox/truth/task/ledger data. | AI projection from same accepted stream. | R1 | T1→T2 | PROJECTION | Exact equality and non-leakage. | PLANNED: accepted V4 stream. |
| C27 | Non-source viewers learn nothing from V4. | Every non-source player/AI view omits the delivery and all metadata. | Project same stream for non-source identities. | R1 | T1→T2 | PROJECTION | No unauthorized knowledge. | PLANNED: accepted V4 stream plus alternate viewers. |
| C28 | All precommit failures are atomic and stage-correct. | Dependency, metadata, prospective-validation, append, commit-store, and receipt fault cases match frozen matrix with no partial semantic effect. | Formal application fault injection at each real production port; before/after event/version/receipt/state checks. | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Exact stage; no hidden partial commit; retry boundary preserved. | PLANNED: real ports/fault injectors and accepted pre-command prefix. |
| C29 | Identical retries are idempotent and body conflicts reject. | Retry after success returns same result without append; retry after retryable failure may succeed once; same ID/different body rejects. | Formal command sequences over real stores and faults. | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | Exactly-once semantic effect and deterministic conflicts. | PLANNED: real successful and faulted command histories. |
| C30 | V1, V2, V3, and V4 remain discriminated. | Valid histories retain version-specific meaning; mixed/unknown versions reject; no upgrade/rewrite occurs. | Separate accepted legacy replay fixtures plus mixed hostile clone. | R2 valid / R3 mixed | T1 | LEGACY_REPLAY_COMPATIBILITY | V1/V2/V3 unchanged; V4 distinct; mixed invalid. | PLANNED: accepted V1/V2/V3 histories; mixed clone is supporting only. |
| C31 | Slice stops at the next currently reachable boundary. | After base V4 settlement, next unsettled task is exact Philosopher-gained Dreamer V2 task; no gained delivery/settlement, Seamstress, Mathematician close/delivery, or later progress exists. | Full real base chain, then inspect canonical task plan/progress without executing/skipping next task. | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Boundary proven and preserved. | PLANNED: real accepted chain including Philosopher-created gained task. |
| C32 | Hostile V4 and malformed batches fail replay closed. | The complete S01–S15 hostile set and partial/orphaned/wrong-order/duplicate/mixed batch mutations reject before projection/ledger. | Replay mutated clones of a real accepted stream; each mutation has one main hostile assertion. | R3 | T1→T2 | HOSTILE_REPLAY_REJECTION | Every hostile history rejected. | PLANNED: accepted V4 stream cloned and mutated; S criteria supply structural authorities. |
| C33 | Canonical output is cross-platform deterministic. | Required Windows and Linux exact-head CI produce passing deterministic policy/replay/serialization tests without locale/time/random dependencies. | Exact-head required CI jobs. | R1/R2/R3 covered | T1–T3 | CROSS_PLATFORM_CI | Both platforms pass exact same contracts. | NONE |
| C34 | Impaired/ineffective Vortox cannot authorize V4. | Real formal command with conflicting Vortox effectiveness commits no V4; hypothetical alternate successful semantics remain unclaimed. | Formal application command over validated Vortox impairment/conflict state. | R1 rejection; success R4 | T1→T2 | APPLICATION_COMMAND_INTEGRATION | Fail closed, zero commit. | PLANNED: validated Vortox conflict state. |
| C35 | Candidate selection is stable under catalog insertion permutations. | Multiple permutations and edge role IDs yield identical raw-UTF-16-selected pair and do not call locale/random/time APIs. | Pure comparator/policy tests with spies/static guard where repository convention permits. | R1 policy | T3 | PURE_POLICY_SEAM | Identical exact pair. | NONE |
| C36 | V3 and V4 ledger evidence cardinalities remain closed. | Exact valid V3 evidence has zero source-impairment entries; exact V4 has one; zero/two/conflicting V4 entries and any V3 impairment entry reject. | Direct exact fact/ledger validation and canonicalization variants. | R3 validator; valid shapes derive from R1/R2 | T1 | STRUCTURAL_VALIDATION | Only frozen cardinalities accepted. | PLANNED: valid V3 and V4 derived facts as starting values. |
| C37 | Coverage remains honest and partial. | Executable boundary tests prove unsupported gained/poisoned/formal-Math paths are not silently implemented; profile/matrix state `PARTIAL / CANONICAL_DRUNK_VORTOX_CORE_ONLY`. | Primary real boundary command/test; profile and matrix are supporting reviewed artifacts. | R1 boundary / R4 non-claim | T1→T2 | APPLICATION_COMMAND_INTEGRATION | No false completeness claim. | PLANNED: C18/C31 behavior plus generated coverage profile. |
| C38 | State-only V4 injection cannot become player knowledge. | Calling projection with manually injected/unproven V4 state rejects or omits rather than projecting it. | Direct T1 projection input without accepted event provenance. | R3 | T1 | PROJECTION | Fail closed; no leaked pair. | NONE |
| C39 | Historical V4 knowledge is stable without crossing the boundary. | Repeated rebuild/projection and idempotent same-command retrieval preserve the exact stored pair after mutation of caller-owned returned objects; canonical history remains unchanged. | Replay/project same accepted stream twice; mutate returned clones; reproject and compare. | R1 | T1→T2 | PROJECTION | Exact historical stability and reference isolation. | PLANNED: accepted V4 stream. |
| C40 | Official nightsheet order is preserved. | Philosopher remains before native Dreamer, native Dreamer before gained-Dreamer insertion boundary, and Mathematician is not reached by skipping; Vortox adds no wake task. | Inspect accepted generated plan/progress from real setup and command chain. | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact ordering and stop boundary. | PLANNED: official nightsheet-backed real plan. |
| C41 | Vortox provenance must be exact and current at settlement. | Wrong Vortox player/seat/role/tenure/revision, dead/non-unique Demon, catalog mismatch, or impairment conflict rejects producer/replay and cannot validate V4. | Formal rejection for reachable state conflicts plus mutated accepted-history replay for forged stored constraint. | R1 rejection / R3 hostile | T1→T2 | HOSTILE_REPLAY_REJECTION | No unproven Vortox constraint admitted. | PLANNED: accepted V4 stream cloned for persisted mutations; formal rejection is supporting authority. |

## Design-time Traceability — Structural and Safety Criteria

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| S01 | V4 top-level shape is closed. | Each missing key and representative extra/string/symbol key is rejected; exact 22-key value is accepted. | Direct unknown-value V4 validator matrix. | R3 | T1 | STRUCTURAL_VALIDATION | Exact shape only. | PLANNED: one valid V4 derived from real accepted stream as seed. |
| S02 | Reliability is one exact closed object. | Only `{kind:"VORTOX_FORCED_FALSE_WITH_CANONICAL_SOURCE_DRUNK"}` with exactly one enumerable key passes. | Direct nested-shape mutations. | R3 | T1 | STRUCTURAL_VALIDATION | Missing/extra/wrong kind rejected. | PLANNED: valid derived V4 seed. |
| S03 | Canonical DRUNK snapshot is exact. | Exact nine keys and valid primitive values pass; wrong/missing/extra values fail. | Direct nested impairment validator matrix. | R3 | T1 | STRUCTURAL_VALIDATION | Only frozen impairment shape admitted. | PLANNED: valid accepted impairment snapshot. |
| S04 | Vortox constraint retains its exact seven-key contract. | Exact constant/kind/player-seat-role-tenure/revision shape passes; all key/value variants fail. | Direct nested constraint validator matrix. | R3 | T1 | STRUCTURAL_VALIDATION | Only accepted A3A constraint shape admitted. | PLANNED: accepted A3A/V4 constraint seed. |
| S05 | Base source contract remains the exact existing eleven-key contract. | Missing/extra/wrong kind/task/source/tenure/ability/revision values reject V4. | Direct V4/source-contract validator matrix. | R3 | T1 | STRUCTURAL_VALIDATION | No widened base/gained source contract. | PLANNED: accepted base V3 source contract seed. |
| S06 | Role snapshots and setup modifiers remain exact catalog snapshots. | Extra/missing role/setup keys, unknown type/alignment/edition, nonnumeric deltas, or catalog mismatch reject. | Direct validator/catalog mutation tests. | R3 | T1 | STRUCTURAL_VALIDATION | Exact catalog-backed snapshots only. | PLANNED: accepted catalog snapshots. |
| S07 | All V4 version/stage/policy constants are closed. | Unknown/legacy/mismatched delivery, opportunity, model, stage, constraint, or policy values reject. | Direct version-field mutation table. | R3 | T1 | STRUCTURAL_VALIDATION | Only frozen constants pass. | PLANNED: valid V4 seed. |
| S08 | Canonical IDs, seats, and revisions are exact. | Empty/trimmed/control/noncanonical IDs, invalid seats, unsafe/zero/negative revisions, and malformed tenure IDs reject. | Direct boundary-value validator table. | R3 | T1 | STRUCTURAL_VALIDATION | Every invalid primitive fails closed. | NONE |
| S09 | T1 canonical data is exception-safe. | Sparse arrays, symbol properties, getters, throwing accessors, proxies, cycles, functions, dates/maps/sets, and nonplain prototypes reject without leaked exception/partial read. | Direct hostile-object validator tests. | R3 | T1 | STRUCTURAL_VALIDATION | Deterministic fail-closed result. | NONE |
| S10 | V4 cloning is fieldwise and reference-isolated. | Mutating original or clone nested objects cannot change the other; revalidation still passes only for valid clone. | Clone valid V4, mutate every nested reference class, compare/revalidate. | R1-derived helper | T3 | PURE_POLICY_SEAM | No shared mutable nested references. | PLANNED: valid derived V4. |
| S11 | V4 equality covers every semantic field. | Equal fieldwise clones compare equal; changing each top-level/nested semantic field makes equality false. | Table-driven pure equality tests. | R1/R2 helper | T3 | PURE_POLICY_SEAM | No ignored semantic field. | PLANNED: valid derived V4 pair. |
| S12 | Payload cross-links are exact, not shape-only. | Wrong task/opportunity/source/target/contract/revision relation rejects even when every individual shape is valid. | Direct validated payload against mismatched canonical T2 inputs. | R3 | T2 | STRUCTURAL_VALIDATION | Cross-link mismatch rejected. | PLANNED: two valid accepted contexts swapped fieldwise. |
| S13 | V4 role categories and truth exclusion are validated. | Non-native role, wrong GOOD/EVIL category, same role twice, or either role equal to settlement-time target truth rejects. | Direct payload/context validation matrix. | R3 | T1→T2 | STRUCTURAL_VALIDATION | Only one legal false GOOD and one legal false EVIL admitted. | PLANNED: accepted catalog/target truth. |
| S14 | Event envelopes and settlement retain exact shapes. | Malformed V4 event envelope, target payload, or scheduled-task settlement shape/IDs/revisions reject before apply. | Direct event/batch boundary validation. | R3 | T1 | STRUCTURAL_VALIDATION | No malformed event admitted. | PLANNED: exact real three-event batch seed. |
| S15 | Batch semantics reject partial, orphaned, duplicate, reordered, and mixed generation. | Every target/delivery/settlement omission, duplication, reorder, cross-batch, noncontiguous, or V2/V3/V4 mix rejects prospectively/replay. | Mutated clone of real three-event batch through batch/replay validator. | R3 | T1→T2 | HOSTILE_REPLAY_REJECTION | Whole history fails; no partial state. | PLANNED: real accepted V4 batch cloned and mutated. |
| S16 | `ABILITY_IMPAIRMENT` remains a closed existing evidence variant. | Exact eight-key DRUNK evidence passes; missing/extra/wrong kind/source/player-seat-role/revision rejects; duplicates/conflicts reject canonicalization. | Direct evidence validator/canonicalizer matrix. | R3 | T1 | STRUCTURAL_VALIDATION | Exactly one valid canonical evidence reference. | PLANNED: V4-derived evidence seed. |
| S17 | Terminal fact shape, combination, identity, and evidence order remain exact. | Extra/missing fact key, wrong audit/source/task/instance cross-link, noncanonical evidence order, or any triple except frozen V4 triple rejects. | Direct fact/ledger validation matrix. | R3 | T1 | STRUCTURAL_VALIDATION | Exact sole fact accepted; malformed fact rejected. | PLANNED: valid V4-derived fact seed. |
| S18 | Projection boundary validates viewer and accepted provenance. | Malformed viewer identity/input and manually injected V4 state reject/omit; no secret metadata is returned. | Direct T1 projection hostile-input and state-only tests. | R3 | T1 | PROJECTION | Fail closed and no leak. | NONE |
| S19 | Delivery discriminant is exhaustive and version-safe. | V1/V2/V3/V4 dispatch only to matching validator/clone/equality/apply path; unknown or ambiguous discriminant rejects before variant field access. | Direct union-dispatch version table including hostile objects. | R2 valid / R3 invalid | T1 | STRUCTURAL_VALIDATION | No cross-version fallthrough. | PLANNED: accepted V1/V2/V3 plus valid V4 seeds. |
| S20 | Canonical serialization/order uses repository deterministic primitives only. | IDs/evidence/candidates serialize/order identically across permutations and platform; forbidden locale/time/random calls cannot affect output. | Pure deterministic ordering tests plus required exact-head cross-platform CI support. | R1/R2/R3 | T3 | PURE_POLICY_SEAM | Stable canonical bytes/order. | NONE |

## Planned Supporting Authority Purposes

Before implementation, these are purposes only; no final IDs, files, titles, or hashes are frozen:

1. a real accepted Philosopher-choice prefix containing the grant, gained task, and canonical native-Dreamer DRUNK;
2. a real accepted full native/base Dreamer V4 stream;
3. accepted unmodified V1, V2, and A3A V3 histories;
4. exact catalog/roster/tenure/current-state contexts used by the real producer;
5. clones of accepted V4 streams mutated only for R3 tests, with mutation disposition recorded;
6. real fault-injection ports for dependency, metadata, prospective validation, append, commit-store, and receipt stages;
7. generated coverage profile/matrix as supporting reviewed documentation, never behavioral primary authority.

At implementation time each referenced support receives one unique `SUP-2B19A3B1-NNN`, resolves exactly once, and records producer, source fixture/test, `ACCEPTED|LEGACY|HOSTILE`, consuming criteria, and `NONE|CLONE_MUTATED|PERSISTED_OR_IMPORTED_MUTATED`. A mutated clone never makes its accepted source hostile and never changes the primary layer.

## Criterion Inventory

The frozen inventory is exactly:

```text
C01 C02 C03 C04 C05 C06 C07 C08 C09 C10
C11 C12 C13 C14 C15 C16 C17 C18 C19 C20
C21 C22 C23 C25 C26 C27 C28 C29 C30 C31
C32 C33 C34 C35 C36 C37 C38 C39 C40 C41
S01 S02 S03 S04 S05 S06 S07 S08 S09 S10
S11 S12 S13 S14 S15 S16 S17 S18 S19 S20
```

All IDs satisfy `^[A-Z][0-9]{2}$`; all are unique; `C24` is intentionally absent. No suffix IDs or formal-Mathematician criterion are permitted.

## Implementation-time Traceability Requirements

`docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md` must retain each design field and add exactly the actual bindings required by V1.1:

- `ActualTestFile`;
- `ActualTestTitle`;
- `ActualPrimaryLayer`;
- `ActualReachability`;
- `ActualTrust`;
- `SupportingAuthorityId`;
- `MechanismMatch=PASS|FAIL`;
- sufficient identification of actual main assertion, entry path, and fault mechanism.

Each criterion must have one physical primary authority. One physical test identity has exactly one primary layer; if it supports another criterion, it appears there only as supporting authority. A layer-only mismatch with unchanged mechanism requires `TRACEABILITY_CORRECTION_REQUIRED`; false authority, R3-as-R1, direct-validator-as-accepted-stream, changed mechanism, or behavior change is a blocker/reslice under the ADR.

## Acceptance Checks

Implementation is complete only if all of the following are true:

1. independent design review returns exact `RULE_DESIGN_PASS` for this document with no blockers before any production/test edit;
2. only the five production files and six test files in the allowlists change;
3. successful GOOD- and EVIL-target real chains produce exact V4 and exact atomic three-event settlement;
4. every exact-shape, provenance, replay, batch, ledger, receipt, retry, projection, and deterministic criterion above has physical primary authority;
5. the four contribution criteria C20–C23 pass without any formal Mathematician settlement or total assertion;
6. C31 proves the gained-Dreamer task is next and unsettled, without skipping to Seamstress or Mathematician;
7. legacy V1/V2/V3 replay remains exact;
8. player/AI projections leak none of the frozen secrets and historical knowledge remains stable;
9. ownership registration occurs only after actual traceability/tests exist and leaves A3A byte-unchanged;
10. coverage profile and role matrix honestly state `PARTIAL / CANONICAL_DRUNK_VORTOX_CORE_ONLY` and no role is marked complete;
11. production size remains within the suggested Slice ceiling; any hard stop returns `RESLICE_REQUIRED`;
12. full local gates and exact-head required CI pass;
13. complete independent final review and both re-read GitHub audit comments satisfy the exact frozen-HEAD protocol;
14. worktree is clean at merge and no commit follows passing review.

## Deferred Dependencies

`2B19A3B2_COMBINED_MATHEMATICIAN_INTEGRATION` is blocked on accepted `2B19B_PHILOSOPHER_GAINED_DREAMER_EXECUTION`. That later work must independently research/design:

- successful gained-Dreamer execution and settlement;
- contribution deduplication across native/base and gained Dreamer sources by distinct player;
- the final combined Mathematician ledger close/true count and Vortox-false number delivery;
- any continuation past that settlement.

This document freezes none of those values or mechanisms. In particular, it does not assert that a future combined total is `1`.

## Independent Design Review Questions

The reviewer must independently verify:

1. fresh sources and approved override support exact forced-false V4 and single-fact attribution;
2. the Slice stops before gained Dreamer and does not smuggle in formal Mathematician or Seamstress;
3. V4 exact shape and pre-event provenance preserve V1/V2/V3;
4. atomic/prospective/replay/receipt boundaries are sufficient;
5. C20–C23 are atomic, legal, and make no final-count claim;
6. all C/S rows have the exact nine design fields and correct reachability/trust/primary layer;
7. allowlists and exact stop-loss values are closed;
8. coverage remains partial and honest;
9. no new event/state/evidence/public-boundary/generic-engine requirement is hidden.

The only valid review terminals are `RULE_DESIGN_PASS`, `RULE_DESIGN_FIX_REQUIRED`, or `HUMAN_BLOCKED`.

`READY_FOR_RULE_DESIGN_REVIEW_ROUND_1`
