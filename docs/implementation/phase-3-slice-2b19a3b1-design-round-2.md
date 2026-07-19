# Phase 3 Slice 2B19A3B1 Design Round 2 — Canonical Drunk Dreamer Vortox Core

## Metadata

- `sliceId`: `2B19A3B1`
- `sliceName`: `Canonical Drunk Dreamer Vortox Core`
- `taskType`: `PRODUCT_SLICE`
- `designRound`: `2/2`
- `maxDesignRounds`: `2`
- `designStatus`: `PENDING_INDEPENDENT_RULE_DESIGN_REVIEW_ROUND_2`
- `implementationAuthorized`: `false`
- `rulesBaseline`: `Phase One v2.1`
- `governanceBaseline`: `Engineering Governance Traceability V1.1`
- `primaryRisk`: `CANONICAL_DRUNK_BASE_DREAMER_VORTOX_DELIVERY_AND_LEDGER_CORE`
- `sliceCoverage`: `PARTIAL`
- `implementationLabel`: `CANONICAL_DRUNK_VORTOX_CORE_ONLY`
- `parentRound1Design`: `docs/implementation/phase-3-slice-2b19a3b1-design.md`
- `parentRound1DesignSha256`: `bbcb781fe00cd8cfd259ad4e24dc3da2520e88f8676d3d0c922b82412e0c4266`
- `parentRound1Review`: `docs/implementation/phase-3-slice-2b19a3b1-design-review-round-1.md`
- `parentRound1ReviewSha256`: `0d6f0e68ae3b532e7b685f491fec931f8e9ca949f8baf7ec2832264c5493e8f4`
- `parentFailedSlice`: `2B19A3B / RESLICE_REQUIRED / UNACCEPTED`
- `parentFailedSliceRound2Design`: `docs/implementation/phase-3-slice-2b19a3b-design-round-2.md`
- `parentFailedSliceRound2DesignSha256`: `0cba266e40ea4ce792e1d45fcec656b8389392ed9f6feaef511aefaa19021a0c`
- `resliceAuthorization`: `USER_AUTHORIZED_2B19A3B_RESLICE_TO_CORE_AND_DEFER_COMBINED_MATHEMATICIAN_INTEGRATION`
- `round2AuthorizationBasis`: explicit user authorization for the final 2B19A3B1 Design Round 2 and the single no-commit archive recovery command frozen below
- `ruleEvidence`: `docs/rules/evidence/2B19A3B1.md`
- `ruleEvidenceSha256`: `ae48ce51ddbcd6ba3bae2dc49ab6441769e77c55f994aa8c2e043e98e58a2653`
- `ruleEvidenceRetrieval`: `2026-07-18T21:38:04+08:00`
- `ruleVerdict`: `RULE_READY`
- `unresolvedConflicts`: `[]`
- `governanceRecord`: `docs/architecture/2B19A3B1-go-no-go-under-governance-v1.md`
- `governanceRecordSha256`: `e566256966764d3fb53141ad0f2529b6ebe9005928b60454f497216a65911b1b`
- `governanceDecision`: `GO`
- `acceptedBaseHead`: `45a467cec81703d911914de464180e5192fc7714`
- `archivedExperimentCommit`: `ef51b62777751ecf0480f14fb98b378197f6ef21`
- `archivedExperimentPatchSha256`: `b271c2db780c0940e001bd0dec596ff21fd70950a0af6cee6ec861b9aa5a8a6c`
- `ruleSemanticsChangedFromRound1`: `false`
- `overrideChangedFromRound1`: `false`
- `eventOrStateSchemaChangedFromRound1`: `false`

This is the complete standalone Round 2 implementation-authority candidate. If and only if an independent reviewer returns `RULE_DESIGN_PASS`, this document replaces Round 1 as the sole implementation authority. Round 1 and its review remain immutable history. This document does not itself authorize implementation and does not claim `RULE_DESIGN_PASS`.

## Round 1 Blocker Disposition

All five Round 1 blockers are closed prospectively as follows:

1. `TRACEABILITY_AXES_ARE_NOT_SINGLETON_ENUMS`: every C/S row below has exactly one value from `R1|R2|R3|R4`, exactly one value from `T1|T2|T3`, and exactly one allowed primary layer. Other mechanisms are supporting authority only.
2. `UNREACHABLE_OR_HOSTILE_IMPAIRMENT_STATES_ARE_FALSELY_CLASSIFIED_R1`: C15/C16 are `R3/T1/HOSTILE_REPLAY_REJECTION`; C17 and C34 are `R4/T3/PURE_POLICY_SEAM`; C41 is limited to representable hostile persisted Vortox provenance and excludes death. Vortox death/lifecycle is R4 and out of scope.
3. `POSITIVE_NONCIRCULAR_PRE_EVENT_PROOF_LOST_FROM_CRITERION_AUTHORITY`: C10 is restored as the positive `R1/T1/ACCEPTED_STREAM_INTEGRATION` authority for successful prospective reconstruction before append; C32 separately owns stored semantic mutation under R3.
4. `COVERAGE_PROFILE_ACCEPTANCE_CONTRACT_IS_INCOMPLETE`: C37 and the complete Coverage Profile Contract below freeze three independent nine-shard candidates, stable obligation identity, exact product `sourceHead`, prior-profile preservation, a separate profile-only commit, and exact verifier behavior.
5. `RECOVERY_METHOD_CONTRADICTS_EXPLICIT_USER_AUTHORIZATION`: exactly one recovery method is selected: `git cherry-pick --no-commit ef51b62777751ecf0480f14fb98b378197f6ef21`. The exact eight-file experiment may enter the worktree only as unaccepted input and must then undergo the frozen audit/removal process.

No fix adds a rule, override, event, state field, evidence variant, gained-Dreamer producer, Seamstress prerequisite, or formal Mathematician total.

## Authority and Governance Correction

Rule truth remains controlled by fresh evidence and its recorded external sources, with approved user overrides first. Code, tests, archived experiments, old designs, README files, and model memory remain non-authoritative for BOTC rule truth.

Accepted authority remains:

- 2B19A1 base Dreamer V2 opportunity;
- 2B19A2 effective native/base Dreamer V2 normal information;
- 2B19A3A effective native/base Dreamer V3 Vortox forced-false information and Vortox provenance;
- accepted ownership/traceability infrastructure and the unchanged active A3A record.

The explicit Round 2 user authorization supersedes only Round 1 governance Stop Condition 10 and equivalent Round 1 design wording that prohibited wholesale no-commit cherry-pick recovery. The governance `GO`, every other governance gate, every other stop condition, the five-file production boundary, exact Slice stop-loss, and the rule/non-goal boundary remain in force. The archive remains unaccepted evidence/input, never rule truth or design authority.

## Single Authorized Recovery Method

After and only after independent `RULE_DESIGN_PASS`, the sole writer may execute exactly:

```text
git cherry-pick --no-commit ef51b62777751ecf0480f14fb98b378197f6ef21
```

No `git apply`, selective hunk restore, merge, ordinary cherry-pick commit, or other recovery path is authorized.

Preconditions and audit are exact:

1. begin on the reviewed 2B19A3B1 feature branch with no unrelated production/test changes;
2. verify the archive commit identity and that it contains exactly these eight paths:
   - `packages/application/src/game-application-service.test.ts`
   - `packages/application/src/game-application-service.ts`
   - `packages/domain-core/src/domain-batch-semantics.ts`
   - `packages/domain-core/src/dreamer.test.ts`
   - `packages/domain-core/src/dreamer.ts`
   - `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
   - `packages/projections/src/index.ts`
   - `packages/projections/src/private-knowledge-view.test.ts`
3. run the exact no-commit command once; it creates no accepted commit and grants no authority to any applied hunk;
4. conflicts are permitted only within those eight paths and must be resolved against this Round 2 design and current base; any conflict or touched path outside the eight is a stop condition and the recovery is aborted;
5. audit every applied production/test hunk against this design, current accepted V1/V2/V3 behavior, and the fresh rule evidence;
6. delete the old formal-Mathematician/C24 assertion and any fixture/progression whose purpose is to skip or cross the Philosopher-gained Dreamer boundary;
7. replace the old continuation assertion with the exact C31 next-unsettled gained-Dreamer boundary;
8. update every Slice test marker, traceability reference, title prefix, and local identifier from `2B19A3B` to `2B19A3B1` where it belongs to this Slice;
9. verify no gained-Dreamer production execution, formal Mathematician total, new rule/override, or out-of-scope behavior remains;
10. verify the resulting production diff is confined to the five production allowlist paths and the test diff to the six test allowlist paths; the three archive tests are merely the initial recovered subset;
11. only the post-audit worktree may be developed and tested; the raw recovered state is never committable, publishable, or reviewable as completed implementation.

If the no-commit operation cannot be reduced to the frozen scope without weakening accepted history or adding R4 work, return `RESLICE_REQUIRED`. Do not retry through a second recovery method.

## Parent Failure and Exact Reslice

The failed parent Slice crossed an unsupported Philosopher-gained Dreamer task and treated one native/base contribution as a final combined Mathematician total. Round 2 retains only:

- native/base V4 delivery;
- exact three-event atomic settlement;
- one Vortox-attributed terminal fact;
- one canonical DRUNK evidence reference;
- safe historical projection;
- the next-unsettled gained-Dreamer boundary.

There is no `C24`, no formal Mathematician settlement, no future combined `trueCount`, and no Seamstress continuation. `2B19A3B2_COMBINED_MATHEMATICIAN_INTEGRATION` remains deferred until after accepted `2B19B_PHILOSOPHER_GAINED_DREAMER_EXECUTION`.

## Scope and Successful Vertical Path

The successful R1 path is exactly:

1. a real formal Philosopher command chooses Dreamer;
2. accepted events create the Philosopher grant/gained task and the canonical Philosopher-caused DRUNK effect on the original/native Dreamer;
3. existing scheduling exposes the native/base Dreamer V3 opportunity and exact base source contract;
4. a real formal Dreamer command chooses a legal non-self, non-Traveller target;
5. current validated state resolves exactly one canonical DRUNK source plus one effective current alive Vortox to `CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED`;
6. deterministic policy selects one native Townsfolk/Outsider and one native Minion/Demon, both different from target settlement-time truth;
7. successful prospective validation independently reconstructs the exact V4 from batch-start/immediate pre-delivery state before append;
8. one atomic batch appends existing target V2, delivery V4, and existing scheduled-task settlement;
9. replay independently reconstructs V4 from the immediate pre-delivery state and reproduces exact canonical state;
10. ledger derivation creates exactly one `ABNORMAL / VORTOX_FALSE_INFORMATION / true` terminal fact with exactly one canonical DRUNK `ABILITY_IMPAIRMENT` evidence reference;
11. authorized player/AI source views expose only target/good/evil historical knowledge; non-sources omit it;
12. the next unsettled task is the Philosopher-gained Dreamer V2 task, which remains unexecuted and unsettled.

## Explicit Non-goals

This Slice does not implement or require:

- successful Philosopher-gained Dreamer execution;
- final/combined Mathematician close, count, delivery, or `trueCount=1`;
- Seamstress continuation;
- successful POISONED Dreamer behavior;
- successful impaired/ineffective Vortox behavior;
- Vortox death/lifecycle semantics;
- No Dashii or any other impairment source;
- later-night Dreamer;
- generic effect, precedence, evidence, ledger, Storyteller-choice, projection, event, state, or audit infrastructure;
- a new event type, top-level state field, evidence union member, public trust boundary, persistence migration, package, dependency, workflow topology, timeout, threshold, or CI infrastructure change;
- rewriting V1/V2/V3, assignment, setup, tenure, task-plan, or accepted history.

POISONED Dreamer success, impaired Vortox success, Vortox death/lifecycle, No Dashii, gained Dreamer, combined Mathematician integration, later nights, and free Storyteller choice are all `R4 / FUTURE_HYPOTHETICAL_STATE`. Their pure non-selection seams may be checked only where frozen below; they have no producer, receipt, accepted-stream, or current integration prerequisite.

## Reachability and Trust

Each criterion below owns exactly one primary reachability and trust value.

- `R1 CURRENTLY_REACHABLE_APPLICATION_PATH`: real formal native/base success, real failures/retries, accepted-stream projection, exact coverage execution, and current plan boundary.
- `R2 LEGACY_OR_IMPORTED_ACCEPTED_HISTORY`: valid V1/V2/V3 replay compatibility.
- `R3 HOSTILE_OR_CORRUPTED_HISTORY`: manually tampered persisted/imported V4, impairment/Vortox provenance, batch, ledger, or state-only projection.
- `R4 FUTURE_HYPOTHETICAL_STATE`: no current producer/accepted event creates the state; only private pure non-selection may be asserted.

- `T1 EXTERNAL_OR_PERSISTED_BOUNDARY`: formal commands, event envelopes, persisted/imported history, direct unknown payload validation, projection viewer/input, CI/profile/verifier input.
- `T2 CANONICAL_DERIVED_STATE`: fully validated rebuilt state, plan/progress, accepted impairment aggregate, task/source/target cross-links, and derived ledger.
- `T3 MODULE_PRIVATE_PURE_CORE`: closed capability resolver result, candidate policy, clone, and equality.

The only primary layers are the eight V1.1 enums. Supporting paths never change a row's primary R/T/layer. One physical test identity has one primary layer; if reused, it is referenced only as supporting authority for other rows.

## Exact V4 Runtime Contract

Add only `DreamerInformationDeliveredPayloadV4`:

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

Its exact 22 enumerable top-level keys are:

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

`BaseDreamerV2SourceContract` remains the exact eleven-key existing base contract: `sourceContractVersion`, `kind="BASE"`, `taskPlanVersion="first-night-task-plan-v2"`, `taskId`, `taskType="DREAMER_ACTION"`, `sourcePlayerId`, `sourceSeatNumber`, `sourceRoleId="dreamer"`, `sourceRoleTenureId`, `sourceCharacterStateRevision`, `sourceAbilityInstanceId`.

The exact nine-key impairment carrier is:

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

The exact seven-key Vortox constraint is:

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

`RoleSetupSnapshot` stays exactly `roleId`, `characterType`, `defaultAlignment`, `edition`, `setupModifier`; modifier stays exactly `outsiderDelta`, `townsfolkDelta`. Reliability has exactly one key/kind. All shapes are validated from `unknown` through exception-safe canonical-data gates. Missing/extra keys, wrong literals/types, noncanonical IDs, unsafe revisions/seats, symbols, accessors, proxies, cycles, sparse arrays, and nonplain values fail closed.

V4 clone is fieldwise and reference-isolated. Equality compares every top-level and nested semantic field. V1/V2/V3 remain separate exact variants; no discriminator is migrated or reinterpreted.

## Canonical DRUNK and Vortox Capability

V4 requires exactly one accepted active impairment matching all nine carrier fields, the native/base Dreamer, real Philosopher source, chosen Dreamer role, exact accepted source contract/tenure/ability instance, and temporally valid revisions. Caller lookalikes, missing/duplicate/conflicting markers, wrong player/seat/role/source/chosen-role/revision, or POISONED never establish V4.

The existing resolver adds only:

```text
CANONICAL_DRUNK_SOURCE_VORTOX_FORCED_FALSE_INFORMATION_SUPPORTED
```

with existing evaluation model/revision, base tenure/ability-instance identity, exact cloned impairment, and exact Vortox constraint.

Precedence is closed:

1. zero source impairment + no effective Vortox -> existing V2;
2. zero source impairment + effective current Vortox -> existing V3;
3. one exact canonical Philosopher DRUNK + effective current Vortox -> V4;
4. canonical DRUNK without effective Vortox -> current formal `ApplicationNotConfigured` boundary;
5. POISONED -> R4 pure seam never V4;
6. duplicate/conflicting source impairment -> hostile R3 persisted provenance rejection;
7. hypothetical impaired/unproven Vortox -> R4 pure seam never V4;
8. representable forged Vortox player/seat/role/tenure/revision/catalog provenance -> hostile R3 rejection;
9. Vortox death/lifecycle and No Dashii -> R4 out of scope.

Effective Vortox on the successful path requires exactly one current catalog-bound `vortox` Demon, one continuous active matching parsed tenure, exact evaluation revision, and no applicable Vortox impairment. Stored V4 records settlement-time proof; later state never reinterprets it.

## Deterministic Forced-false Candidates

GOOD candidates are native Townsfolk/Outsiders; EVIL candidates are native Minions/Demons. Both exclude target settlement-time true `roleId`. Exact catalog snapshots are sorted by raw UTF-16 stable-ID order; the first legal candidate in each category is chosen. Input/in-play order does not alter selection. Empty/ambiguous categories fail before metadata and remain retryable. `localeCompare`, `Intl.Collator`, locale, `Date.now`, `Math.random`, random UUIDs, and insertion-order dependence are forbidden. The persisted pair is historical knowledge and is never recomputed.

## Positive Pre-event and Prospective Proof

The formal successful command rebuilds and validates the complete accepted prefix before metadata. It resolves source, target, canonical DRUNK, Vortox, candidates, and one immutable target-V2/V4/settlement proposal.

The successful prospective validator is independent primary authority, not a replay-only negative:

1. start from validated batch-start state;
2. apply the candidate target event through the real event applier;
3. from the immediate pre-delivery prospective state, rerun source/contract/tenure/impairment/Vortox/target/catalog/candidate proof without trusting stored V4 fields;
4. construct the expected V4 field by field;
5. exact-compare expected V4 with the candidate delivery;
6. apply the delivery, then settlement, validating each prefix and final state;
7. append only after the complete prospective result succeeds.

C10 requires this positive `R1/T1/ACCEPTED_STREAM_INTEGRATION` mechanism. C32 separately proves that a persisted semantic mutation cannot self-authenticate under `R3/T1/HOSTILE_REPLAY_REJECTION`. Shape validation is never provenance, and a future event never retroactively proves an earlier delivery.

Replay applies accepted target choice, reruns the same proof from immediate pre-delivery state, exact-compares V4, then applies delivery/settlement. Target choice changes no capability fact. Rebuild must reproduce canonical state exactly.

## Atomic Batch

Success appends exactly, in order:

1. existing `DreamerTargetChosen` V2;
2. exact `DreamerInformationDelivered` V4;
3. existing `ScheduledTaskSettled` Dreamer settlement.

They share one batch/command/correlation identity, contiguous sequence/indexes, one expected starting version, one version increment, and one success receipt. Opportunity/task close only after complete application.

Naked, partial, reordered, duplicated, split, cross-batch, noncontiguous, metadata-mismatched, wrong task/opportunity/source/target/revision, mixed-generation, or previously settled chains reject atomically. No failure leaves target, delivery, progress, ledger, receipt, or version partially committed.

## Ledger Contribution

Reuse the existing closed ledger/evidence union. One accepted V4 delivery derives exactly one terminal fact:

```text
sourcePlayerId = native/base Dreamer
abilityRoleId = dreamer
outcomeStatus = ABNORMAL
causeKind = VORTOX_FALSE_INFORMATION
causedByAnotherCharacterAbility = true
terminalFactCountForDelivery = 1
```

It preserves base ability instance, task, source event/batch/sequence, evaluated revision, and exact evidence. V4 adds exactly one existing `ABILITY_IMPAIRMENT`:

```text
kind = ABILITY_IMPAIRMENT
impairmentId = stored exact V4 impairmentId
impairmentKind = DRUNK
affectedPlayerId = native/base Dreamer
affectedSeatNumber = native/base Dreamer seat
affectedRoleId = dreamer
sourceKind = PHILOSOPHER_CHOSEN_DUPLICATE
appliedCharacterStateRevision = exact canonical impairment revision
```

It cross-links to accepted impairment and V4 once in canonical order. Existing standard evidence remains exact; canonical coalescing yields 10 entries when target is Vortox and 11 otherwise. V3 remains 9/10 with zero impairment. Missing, added, substituted, reordered, duplicated, or conflicting evidence rejects.

C20–C23 are atomic:

- C20: exactly one native/base terminal fact;
- C21: exact `ABNORMAL / VORTOX_FALSE_INFORMATION / true` triple;
- C22: exactly one canonical DRUNK evidence reference;
- C23: no second fact, cause array, or `SOURCE_DRUNKENNESS` fact/cause.

The fact preserves base source-player and ability-instance identity for future distinct-player aggregation, but this Slice performs no formal Mathematician close/count and freezes no combined total.

## Projection and Historical Knowledge

The private Dreamer knowledge shape remains exactly target plus good/evil `RoleSetupSnapshot`. Source AI equals source player; non-sources omit it. No player/AI view exposes V4 version, reliability, impairment/DRUNK/Philosopher, Vortox identity/tenure/revision, truth, source contract, task plan, ledger, candidates, canonical target role, assignment, or Storyteller data.

Projection is a T1 boundary and accepts only replay-authenticated historical delivery. State-only/manual V3/V4 injection rejects/omits. Repeated rebuild/projection, mutation of caller-owned clones, and idempotent retrieval preserve exact persisted V4 bytes/pair. No later role/effect mutation producer is claimed; true later mutation stability remains R4.

## Receipt, Retry, and Failure Contract

| Case | Primary classification | Required result |
|---|---|---|
| exact successful chain | R1/T1/ACCEPTED_STREAM_INTEGRATION | exact three events, one version/receipt, replay/ledger/projection agree |
| identical successful command retry | R1/T1/APPLICATION_COMMAND_INTEGRATION | existing idempotent result, no append/version/history change |
| same ID/different body | R1/T1/APPLICATION_COMMAND_INTEGRATION | deterministic command conflict, no mutation |
| actor/phase/version/target/opportunity rejection | R1/T1/APPLICATION_COMMAND_INTEGRATION | existing rejection policy, no accepted mutation |
| canonical DRUNK without effective Vortox | R1/T1/APPLICATION_COMMAND_INTEGRATION | exact `ApplicationNotConfigured`, stage `first-night-role-action`, no receipt/events/version change, OPEN and retryable |
| dependency/candidate/resolver/construction failure | R1/T1/APPLICATION_COMMAND_INTEGRATION | exact existing dependency failure before metadata, no receipt/events/version change, retryable |
| metadata failure | R1/T1/APPLICATION_COMMAND_INTEGRATION | distinct metadata stage, no append/receipt/version change |
| prospective failure | R1/T1/APPLICATION_COMMAND_INTEGRATION | reject whole proposal before append, no mutation |
| append/commit-store/receipt failure | R1/T1/APPLICATION_COMMAND_INTEGRATION | existing atomic boundary, no duplicate semantic effect, safe identical recovery |
| malformed/forged persisted V4, impairment, Vortox, ledger, or batch | R3/T1/HOSTILE_REPLAY_REJECTION | replay/rebuild fails before projection/ledger acceptance |
| malformed direct shape | R3/T1/STRUCTURAL_VALIDATION | exact exception-safe rejection |
| POISONED success or impaired-Vortox success | R4/T3/PURE_POLICY_SEAM | pure capability never selects V4; no command/receipt/accepted-stream claim |
| Vortox death/lifecycle, No Dashii, gained Dreamer, formal Math | R4 out of scope | no current acceptance authority |

Planner/resolver/candidate/dependency/prospective/metadata failures do not burn retryable command IDs. Deterministic actor/phase/version/body conflicts retain existing rejected-receipt semantics. After a repairable injected failure, C29 proves an identical formal command succeeds exactly once.

## Legacy Replay

V1, V2 normal, and accepted A3A V3 retain exact shapes and meanings. V3 has `VORTOX_FORCED_FALSE` and zero source impairment. V4 is a separate closed variant. No accepted payload is upgraded, migrated, normalized, or reserialized. Clone/equality/rebuild dispatch by exact discriminant before variant fields. Valid V1/V2/V3 replay is C30 primary R2 authority; unknown/mixed hostile versions are supporting R3 rejection, not a second primary classification for C30.

## Current Stop Boundary and Nightsheet

After accepted native/base settlement/projection, the exact Philosopher-gained Dreamer V2 task is the next unsettled task. It is not executed, skipped, forged, or settled. No gained delivery, Seamstress action, Mathematician delivery/close, or later progress exists. The plan preserves official order: Philosopher 14/80, native Dreamer 61/80, Mathematician 77/80, and no Vortox wake task.

A separate current formal invocation may retain its existing gained-Dreamer `ApplicationNotConfigured` rejection as supporting authority only; this Slice's successful path stops before invocation.

## Complete Coverage Profile Contract

The accepted nine-process topology, `VITEST_MAX_FORKS=1`, thresholds, shard mapping, merge algorithm, dependencies, timeouts, and all prior coverage profiles are immutable.

### Product implementation commit

First create one product implementation commit containing the audited bounded production, tests, fixtures, implementation traceability, ownership record, and required product-status documentation, but not the new A3B1 exact coverage profile selection. Record its full SHA as `productImplementationHead`. The worktree used for all candidate runs must resolve exactly to that SHA.

### Three independent candidate runs

At the exact same `productImplementationHead`, run the complete nine-shard coverage candidate workflow three independent times. Each candidate consists of all nine coverage shards plus the official deterministic blob merge and required ownership verification. Every shard and merge must pass with zero timeout/RPC failure.

Each candidate manifest records:

- full `sourceHead = productImplementationHead`;
- unique run identifier and timestamps;
- all nine shard result identifiers/hashes and merge result;
- the same canonical source-file obligation count/SHA;
- the same uncovered-statement obligation count/SHA;
- the same uncovered-function obligation count/SHA;
- the same uncovered-line obligation count/SHA;
- the same uncovered-branch-arm obligation count/SHA;
- ownership semantic/project/authority inventory identities/hashes;
- zero missing, duplicate, unexpected, ambiguous, or wrong-owner entries.

The stable obligation set is the ordered five-tuple of those exact count/SHA pairs. All three manifests must have byte/semantic-identical sourceHead, topology identity, ownership inventory identity, and five-tuple. Candidate output is evidence only and may not edit or teach the verifier its expected result.

### Exact A3B1 profile

Only after all three candidates agree, create exactly one deterministic profile:

```text
profileId=phase-3-slice-2b19a3b1-<first-7-productImplementationHead>-ownership-v2-1
sourceHead=<full productImplementationHead>
sourceKind=PRODUCT_IMPLEMENTATION_STABLE_NINE_PROCESS_BASELINE
```

The profile records the five exact count/SHA pairs and links all three actual candidate manifests/runs. It is exact data, not a range, learned fallback, wildcard, or latest-profile selection. Every prior profile remains byte-identical and selectable only by its existing identity.

### Separate profile-only commit

The exact profile is introduced in a separate child commit whose parent is `productImplementationHead`. Its diff may contain only:

- `scripts/verify-coverage-obligations.mjs`, only the exact A3B1 profile data/selection support allowed by the accepted verifier design;
- `.github/workflows/ci.yml`, only if needed to select the exact A3B1 profile by deterministic identity;
- `docs/implementation/phase-3-slice-2b19a3b1-coverage-profile.md`;
- required A3B1 status, traceability, PR-body source, and agent-loop control documents.

It must change no production file, test body/title/marker, fixture, ownership criterion inventory, dependency, workspace, shard topology, timeout, threshold, merge algorithm, or prior profile bytes. The profile-only commit becomes the frozen feature HEAD for exact-head CI/review, but `sourceHead` remains the full parent product implementation SHA; CI status is never inherited between them.

### Exact verifier

On the profile-only frozen HEAD, the verifier must fail closed for absent/unknown/duplicate/ambiguous profile identity, wrong `sourceHead`, wrong parent relationship, any of the five count/SHA mismatches, candidate disagreement, old-profile mutation, ownership inventory mismatch, missing shard/merge evidence, or any attempt to learn expectations from current coverage output. It must pass only the exact A3B1 profile against the exact product implementation source tree and recorded stable nine-shard obligations.

Non-identical candidates, inability to represent exact obligations without weakening verification, or required topology/timeout/threshold changes is `CI_TEST_INFRASTRUCTURE_FAILURE`; stop the product PR and open a separately governed infrastructure task. It is not a product repair or BOTC rule change.

## Ownership and Two-phase Traceability

After physical tests and implementation traceability exist, add exactly one active registry record:

- marker prefix `[2B19A3B1-`;
- owner project `application-service-dreamer-vortox`;
- traceability `docs/implementation/phase-3-slice-2b19a3b1-test-traceability.md`;
- support prefix `SUP-2B19A3B1-`;
- criteria exactly `C01`–`C23`, `C25`–`C41`, `S01`–`S20`;
- no C24, suffix ID, planned/inactive record, predicted count/hash/title, or preregistration of A3B2/B19B.

The accepted A3A record remains byte-identical. Tests/traceability are materialized first; only then calculate every accepted twelve-field frozen-baseline value from actual bytes and append the ACTIVE data record. Registry self-test/verifier must report zero missing/duplicate/unexpected/ambiguous/wrong-owner and prove invalid ownership cases fail.

Implementation traceability retains all nine frozen design fields and adds exact actual file/title/layer/R/T/support/mechanism bindings. One physical identity owns one primary layer. Every `SUP-2B19A3B1-NNN` resolves once with producer, source, `ACCEPTED|LEGACY|HOSTILE`, consumers, and mutation disposition. A layer-only correction uses the accepted correction gate; false authority, changed mechanism, R3-as-R1, or direct-validator-as-accepted-stream is a blocker.

## Production, Test, and Documentation Allowlists

Production changes are limited to:

1. `packages/domain-core/src/dreamer.ts`
2. `packages/domain-core/src/domain-batch-semantics.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
4. `packages/application/src/game-application-service.ts`
5. `packages/projections/src/index.ts`

Tests are limited to:

1. `packages/domain-core/src/dreamer.test.ts`
2. `packages/domain-core/src/domain-batch-semantics.test.ts`
3. `packages/domain-core/src/first-night-ability-outcome-ledger.test.ts`
4. `packages/domain-core/src/rebuild.test.ts`
5. `packages/application/src/game-application-service.test.ts`
6. `packages/projections/src/private-knowledge-view.test.ts`

`packages/domain-core/src/mathematician-information.test.ts` is excluded and unchanged. Existing Mathematician regressions run but no final-total assertion is edited/added.

Expected production size is five files and 650–950 added lines. Suggested ceiling is at most six production files/1,000 added production lines. More than eight files or 1,500 lines is immediately `RESLICE_REQUIRED`; any non-allowlisted production file requires authorized design correction even below the numeric ceiling.

Documentation/data changes are limited to Round 2/review, A3B1 traceability/status/profile/PR-body source, role matrix, ownership ACTIVE data record, exact-profile verifier/workflow selection, required final review/archive/closeout records, and agent-loop control docs. Fresh evidence, old governance except the explicit supersession record, Round 1/review, failed parent history, accepted A3A artifacts/record, and prior coverage profiles remain immutable.

## Coverage and Role Claims

Slice remains `PARTIAL / CANONICAL_DRUNK_VORTOX_CORE_ONLY`. Dreamer, Philosopher, and Mathematician remain `PARTIAL`; Vortox remains `NOT_STARTED` under the current matrix convention. No role becomes `COMPLETE`. The matrix may record only accepted native/base canonical-DRUNK Vortox behavior after merge and must preserve unsupported gained/poisoned/generic/death/later-night cells.

## Full Gates and Stop Conditions

Required local gates are `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm test:coverage`, plus focused affected tests, exact ownership verification, exact-profile verification, static deterministic scan, and diff/allowlist audit. Frozen profile-only HEAD CI must pass Linux validation, ownership self-test, all ordinary shards/merge, all coverage shards/merge, and Windows deterministic execution.

Stop with `RESLICE_REQUIRED` if a new event/state/evidence/public boundary/migration/generic subsystem is needed; gained Dreamer, Seamstress, formal Math, or Vortox lifecycle becomes prerequisite; exact replay/prospective/projection cannot close; stop-loss is exceeded; recovery touches/conflicts outside the exact eight paths; or profile exactness requires infrastructure weakening. Rule conflict/source unavailability is `HUMAN_BLOCKED`.

Before merge, rollback is bounded feature-branch reversion; after merge, use a normal revert PR with exact-head CI/review. Never rewrite accepted V4 history. Complete final review and two verbatim GitHub audit comments must bind the exact frozen profile-only HEAD; no commit follows pass.

## Design-time Completion Criteria

Every row has exactly one primary R enum, T enum, and primary layer. Other paths are supporting only.

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| C01 | Real Philosopher choice creates canonical native-Dreamer DRUNK | Formal choice accepts once and rebuild contains exact grant/gained task/DRUNK | Real command→append→receipt→rebuild | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Exact accepted prefix | PLANNED: real Philosopher prefix, mutation NONE |
| C02 | Only exact Philosopher-produced Dreamer DRUNK is eligible | Rebuilt impairment exactly matches source/chosen/affected identity and revisions | Derived assertion over accepted C01 prefix | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | One canonical marker | PLANNED: C01 accepted prefix |
| C03 | Native/base V3 opportunity and base contract remain authority | Formal chain resolves base opportunity; gained task remains distinct | Real commands plus rebuilt plan/opportunity/contract | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Exact base authority | PLANNED: accepted prefix |
| C04 | GOOD target receives forced-false native pair | Real success stores one native GOOD and EVIL, both not target truth | Full successful command/append/rebuild/ledger/projection | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Exact V4 success | PLANNED: legal catalog and real V4 stream |
| C05 | EVIL target receives forced-false native pair | Separate real success stores both roles different from EVIL target truth | Full successful chain | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Exact V4 success | PLANNED: legal catalog and real V4 stream |
| C06 | Candidate policy is native, truth-excluding, deterministic | Permutations return same raw-UTF-16 first legal pair; empty set fails | Direct private candidate policy | R1 | T3 | PURE_POLICY_SEAM | Stable exact pair | NONE |
| C07 | Canonical positive V4 shape is exact | Direct validator accepts exact real-derived 22-key V4 | Direct unknown-value exact validator | R1 | T1 | STRUCTURAL_VALIDATION | Canonical V4 accepted | PLANNED: real V4 value as unmutated support |
| C08 | Accepted V3 meaning remains exact | Accepted A3A V3 replays/projects with zero DRUNK evidence | Replay accepted V3 history | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | No V4 reinterpretation | PLANNED: accepted A3A V3 history |
| C09 | Real accepted V4 is exactly replayable | Persisted real V4 independently rebuilds identical state/ledger/view | Produce, persist, independent rebuild | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Exact replay equality | PLANNED: real V4 stream |
| C10 | Successful prospective proof is non-circular | Before append, prospective validator reconstructs expected V4 from batch-start/immediate pre-delivery state and exact-compares it | Instrumented real successful formal command and prospective path | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Proof succeeds before append; stored V4 is not authority | PLANNED: accepted prefix and captured prospective evidence |
| C11 | Wrong impairment identity cannot authenticate V4 | Mutated persisted impairment ID rejects replay | Accepted stream clone→persisted mutation→replay | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | PLANNED: real V4 clone, PERSISTED_OR_IMPORTED_MUTATED |
| C12 | Impairment player/seat/role links are exact | Each wrong affected identity/role rejects | Mutated persisted V4 replay table | R3 | T1 | HOSTILE_REPLAY_REJECTION | Every mismatch rejected | PLANNED: accepted V4 clone |
| C13 | Source kind/player/chosen role are exact | Wrong sourceKind/source player/chosenRole rejects | Mutated persisted V4 replay | R3 | T1 | HOSTILE_REPLAY_REJECTION | No alternate provenance | PLANNED: accepted V4 clone |
| C14 | Revisions are exact and temporal | Zero/future/stale/mismatched revisions reject | Persisted semantic mutations and replay | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | PLANNED: accepted V4 clone |
| C15 | Duplicate DRUNK provenance is hostile | Accepted support with duplicated persisted canonical marker rejects rebuild | Accepted support→clone duplicate provenance→replay/rebuild | R3 | T1 | HOSTILE_REPLAY_REJECTION | Conflict; no projection/ledger acceptance | PLANNED: accepted stream clone |
| C16 | DRUNK plus POISONED persisted provenance is hostile | Accepted support with added conflicting POISONED marker rejects rebuild | Accepted support→clone conflicting provenance→replay/rebuild | R3 | T1 | HOSTILE_REPLAY_REJECTION | Conflict; no output | PLANNED: accepted stream clone |
| C17 | POISONED success is future, not current | Private hypothetical POISONED capability never returns V4 | Closed resolver/policy seam only | R4 | T3 | PURE_POLICY_SEAM | Impaired/unresolved, never V4 | NONE |
| C18 | Canonical DRUNK without effective Vortox remains unsupported | Real formal command returns exact receipt-free OPEN failure and retryable ID | Formal command with accepted canonical prefix | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | `ApplicationNotConfigured`; zero events/version | PLANNED: accepted non-Vortox canonical prefix |
| C19 | Settlement is exactly atomic | Real success appends target V2+V4+settlement contiguously once | Real command and persisted batch inspection | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Three events, one version/receipt | PLANNED: real V4 stream |
| C20 | Native/base delivery creates one fact | Derived ledger has exactly one base-source terminal fact | Ledger derivation from accepted V4 | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Fact count one | PLANNED: real V4 stream |
| C21 | Sole attribution is Vortox abnormality | Sole fact is exact ABNORMAL/VORTOX_FALSE_INFORMATION/true | Derived fact assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Exact triple | PLANNED: C20 ledger |
| C22 | DRUNK is exact positive evidence once | Sole fact has one matching DRUNK ABILITY_IMPAIRMENT and exact 10/11 cardinality | Canonical ledger derivation | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | One matching evidence | PLANNED: C20 ledger and accepted impairment |
| C23 | No multi-cause/second fact is authorized | Whole ledger has no second fact/cause array/SOURCE_DRUNKENNESS fact | Whole-ledger negative assertion | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | One fact only | PLANNED: accepted V4 ledger |
| C25 | Only source player receives bounded knowledge | Source view is target/good/evil only | Accepted-stream player projection | R1 | T1 | PROJECTION | Exact safe view | PLANNED: real V4 stream |
| C26 | Source AI equals source player | AI view deep-equals player view and omits metadata | Accepted-stream AI projection | R1 | T1 | PROJECTION | Equality/no leak | PLANNED: real V4 stream |
| C27 | Non-sources receive nothing | Every other player/AI omits delivery | Accepted-stream projection for alternate viewers | R1 | T1 | PROJECTION | Omitted | PLANNED: real V4 stream |
| C28 | Precommit failures are stage-correct and atomic | Dependency/metadata/prospective/append/commit/receipt faults match frozen outcomes | Formal command with real port fault injection | R1 | T1 | APPLICATION_COMMAND_INTEGRATION | No partial effect; retry boundary preserved | PLANNED: accepted prefix and real fault ports |
| C29 | Retry after repair succeeds exactly once | Identical command after retryable failure commits one batch/receipt; post-success retry appends none | Formal failure→repair→identical success→idempotent retry | R1 | T1 | ACCEPTED_STREAM_INTEGRATION | Exactly one semantic success | PLANNED: accepted prefix and fault history |
| C30 | V1/V2/V3 replay meanings remain immutable | Each valid legacy history rebuilds/projects exactly | Separate accepted legacy replay fixtures | R2 | T1 | LEGACY_REPLAY_COMPATIBILITY | No migration/mutation | PLANNED: V1/V2/V3 histories; hostile mixed version supporting only |
| C31 | Slice stops at next reachable boundary | After base V4, exact gained-Dreamer V2 task is next/unsettled and no later action exists | Full real base chain then inspect admitted plan/progress | R1 | T2 | ACCEPTED_STREAM_INTEGRATION | Boundary preserved | PLANNED: accepted chain with gained task |
| C32 | Stored V4 cannot self-prove | Mutating any semantic V4 field in persisted history rejects reconstruction before ledger/projection | Accepted V4 clone→semantic mutation→replay | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed independently of C10 | PLANNED: accepted V4 clone |
| C33 | Product is cross-platform deterministic | Frozen exact HEAD passes required Linux/Windows deterministic jobs | Exact-head CI | R1 | T1 | CROSS_PLATFORM_CI | Required jobs SUCCESS | NONE |
| C34 | Hypothetical impaired/unproven Vortox success is future | Private capability state never returns V4 | Closed resolver/policy seam only | R4 | T3 | PURE_POLICY_SEAM | Unsupported/unresolved | NONE |
| C35 | Candidate order ignores insertion/locale/time/random | Catalog permutations/edge IDs produce same pair; forbidden APIs absent | Pure policy and deterministic static scan | R1 | T3 | PURE_POLICY_SEAM | Same pair | NONE |
| C36 | V3/V4 ledger evidence cardinalities are closed | V3 9/10 zero impairment; V4 10/11 one; every mutation rejects | Hostile ledger/fact clone mutation and rebuild/validation | R3 | T1 | HOSTILE_REPLAY_REJECTION | Every noncanonical set rejected | PLANNED: valid V3/V4 facts cloned |
| C37 | Coverage obligations and profile binding are exact | Three nine-shard candidates agree; exact A3B1 profile binds full product sourceHead; profile-only HEAD verifier passes | Frozen candidate manifests plus exact-profile CI/verifier | R1 | T1 | CROSS_PLATFORM_CI | Three identical five-tuples; exact source/profile match | NONE |
| C38 | State-only V4 is not projection provenance | Manual state-only V4 player/AI projection rejects/omits | Direct public projection boundary | R3 | T1 | PROJECTION | No knowledge leak | NONE |
| C39 | Historical V4 knowledge is reference-stable | Rebuild/project twice; mutate returned clone; reproject and idempotently retrieve unchanged pair | Accepted-stream projection/retrieval | R1 | T1 | PROJECTION | Persisted bytes/view unchanged | PLANNED: real V4 stream |
| C40 | Nightsheet and current stop order remain exact | Generated admitted plan preserves Philosopher→native Dreamer→gained boundary; Vortox has no task | Structural assertion over rebuilt plan/progress | R1 | T2 | STRUCTURAL_VALIDATION | Exact official order | PLANNED: official nightsheet and real plan |
| C41 | Representable forged Vortox provenance cannot authorize V4 | Wrong/missing/duplicate/stale player/seat/role/tenure/revision/catalog proof rejects persisted replay; no death branch | Accepted V4 support→persisted provenance mutation→replay | R3 | T1 | HOSTILE_REPLAY_REJECTION | Fail closed | PLANNED: accepted V4 clone; Vortox death is R4 out of scope |

## Structural and Safety Criteria

| CriterionId | RuleClaim | CompletionCriterion | RequiredEvidenceMechanism | ExpectedReachability | ExpectedTrust | ExpectedPrimaryLayer | ExpectedResult | SupportingAuthorityRequirement |
|---|---|---|---|---|---|---|---|---|
| S01 | V4 top-level shape is closed | Every missing key and representative extra key rejects; exact 22-key value passes | Direct unknown-value shape matrix | R3 | T1 | STRUCTURAL_VALIDATION | Exact keys only | PLANNED: real-derived valid V4 seed |
| S02 | Reliability is exact | Only exact one-key canonical-DRUNK Vortox reliability passes | Direct nested shape mutation | R3 | T1 | STRUCTURAL_VALIDATION | Wrong/missing/extra rejects | PLANNED: valid V4 seed |
| S03 | Impairment carrier is exact | Exact nine keys/domains pass; every wrong/missing/extra value rejects | Direct nested impairment matrix | R3 | T1 | STRUCTURAL_VALIDATION | Frozen carrier only | PLANNED: accepted impairment seed |
| S04 | Vortox constraint is exact | Exact seven keys/literals/IDs/tenure/revision pass; variants reject | Direct nested constraint matrix | R3 | T1 | STRUCTURAL_VALIDATION | Frozen constraint only | PLANNED: accepted constraint seed |
| S05 | Base source contract is exact | Missing/extra/wrong base task/source/tenure/instance/revision rejects | Direct source-contract matrix | R3 | T1 | STRUCTURAL_VALIDATION | No gained/widened contract | PLANNED: accepted base contract seed |
| S06 | Role snapshots/catalog links are exact | Wrong role/modifier keys, domains, or catalog mismatch rejects | Direct role/catalog validation | R3 | T1 | STRUCTURAL_VALIDATION | Exact catalog snapshots | PLANNED: accepted catalog seeds |
| S07 | Version/stage/policy literals are closed | Unknown/mismatched delivery/opportunity/model/stage/constraint/policy values reject | Direct literal mutation table | R3 | T1 | STRUCTURAL_VALIDATION | Frozen constants only | PLANNED: valid V4 seed |
| S08 | IDs, seats, revisions are canonical | Empty/trimmed/control/malformed IDs, invalid seats, unsafe/nonpositive revisions reject | Direct boundary matrix | R3 | T1 | STRUCTURAL_VALIDATION | Fail closed | NONE |
| S09 | T1 canonical data is exception-safe | Symbols/getters/throwing or revoked proxies/cycles/functions/nonplain/sparse values reject with no exception/getter call | Hostile-object boundary tests | R3 | T1 | STRUCTURAL_VALIDATION | Deterministic safe rejection | NONE |
| S10 | V4 clone is isolated | Mutating original/clone nested values cannot affect the other | Private fieldwise clone test | R1 | T3 | PURE_POLICY_SEAM | Distinct references, same initial value | PLANNED: valid V4 |
| S11 | V4 equality covers every semantic field | Equal clone true; each one-field mutation false; no serialization equality | Private comparator table/static scan | R1 | T3 | PURE_POLICY_SEAM | Exact fieldwise result | PLANNED: valid V4 pair |
| S12 | Cross-links are not shape-only | Individually valid but mismatched task/opportunity/source/target/contract/revision rejects | Direct validator against admitted canonical context | R3 | T2 | STRUCTURAL_VALIDATION | Cross-link mismatch rejected | PLANNED: two admitted contexts swapped |
| S13 | Categories and truth exclusion are validated | Non-native/wrong-category/same-role/truth-containing pair rejects | Direct payload/context matrix | R3 | T1 | STRUCTURAL_VALIDATION | Only legal false GOOD+EVIL | PLANNED: catalog and target truth |
| S14 | Event envelopes/settlement are exact | Malformed target/delivery/settlement envelope, IDs, metadata, revision rejects | Direct event/batch boundary validation | R3 | T1 | STRUCTURAL_VALIDATION | No malformed event admitted | PLANNED: real batch seed |
| S15 | Batch structure is exact | Partial/orphan/duplicate/reordered/split/cross-batch/noncontiguous/mixed generation rejects | Mutated persisted batch replay | R3 | T1 | HOSTILE_REPLAY_REJECTION | Whole stream rejected atomically | PLANNED: real batch clone |
| S16 | ABILITY_IMPAIRMENT evidence remains closed | Exact existing eight-key DRUNK evidence passes; field/duplicate/conflict mutations reject | Direct evidence validator/canonicalizer | R3 | T1 | STRUCTURAL_VALIDATION | Exactly one canonical reference | PLANNED: valid derived evidence |
| S17 | Terminal fact identity/triple/order is exact | Wrong keys/audit/source/task/instance/triple/evidence order rejects | Direct fact/ledger matrix | R3 | T1 | STRUCTURAL_VALIDATION | Only exact V4 fact accepted | PLANNED: valid derived fact |
| S18 | Projection viewer/provenance boundary is exact | Malformed viewer or unproven state-only V4 rejects/omits and leaks nothing | Direct public projection boundary | R3 | T1 | PROJECTION | Fail closed/no leak | NONE |
| S19 | Unknown/ambiguous discriminants fail closed | Unknown or ambiguous delivery version rejects before variant-specific field access | Direct union-dispatch hostile table | R3 | T1 | STRUCTURAL_VALIDATION | No cross-version fallthrough | PLANNED: valid V1/V2/V3/V4 as comparison support |
| S20 | Canonical ordering uses deterministic primitives | Catalog/evidence permutations serialize/order identically; forbidden APIs cannot affect result | Pure ordering test and static scan | R1 | T3 | PURE_POLICY_SEAM | Stable canonical order | NONE |

## Planned Supporting Authority Purposes

No final SUP ID, title, hash, or fixture identity is frozen before implementation. Planned purposes are:

1. real accepted Philosopher prefix with grant, gained task, canonical native-Dreamer DRUNK, and V3 opportunity; `ACCEPTED`, mutation `NONE`;
2. real accepted full native/base V4 stream; `ACCEPTED`, mutation `NONE`;
3. defensive persisted/imported hostile clones of item 2; `HOSTILE`, mutation `PERSISTED_OR_IMPORTED_MUTATED` or `CLONE_MUTATED` as actual;
4. accepted/legacy V1/V2/V3 streams; actual `ACCEPTED|LEGACY`, mutation `NONE`;
5. exact catalog/roster/tenure/current-state contexts used by the producer;
6. real dependency/metadata/prospective/append/commit/receipt fault ports;
7. three candidate coverage manifests and exact profile verifier evidence, which support C37 but do not create a second primary layer.

Every referenced support later receives one unique `SUP-2B19A3B1-NNN`, resolves exactly once, and records producer, source, authority status, consuming criteria, and mutation disposition.

## Criterion Inventory and Mechanical Governance Check

The frozen inventory is exactly:

```text
C01 C02 C03 C04 C05 C06 C07 C08 C09 C10
C11 C12 C13 C14 C15 C16 C17 C18 C19 C20
C21 C22 C23 C25 C26 C27 C28 C29 C30 C31
C32 C33 C34 C35 C36 C37 C38 C39 C40 C41
S01 S02 S03 S04 S05 S06 S07 S08 S09 S10
S11 S12 S13 S14 S15 S16 S17 S18 S19 S20
```

All 60 IDs are unique and match `^[A-Z][0-9]{2}$`; C24 is absent. Before implementation authorization, mechanically parse both tables and require:

- `ExpectedReachability` exactly one of `R1|R2|R3|R4`;
- `ExpectedTrust` exactly one of `T1|T2|T3`;
- `ExpectedPrimaryLayer` exactly one of the eight V1.1 layers;
- no compound arrow, slash, range, prose suffix, or second primary mechanism in those fields;
- every criterion can bind one physical primary identity.

## Exact Implementation Sequence

1. Obtain independent `RULE_DESIGN_PASS` on this exact Round 2 file; no implementation/recovery before it.
2. Run the single authorized no-commit recovery command once.
3. Audit the exact eight-file input; resolve only in-scope conflicts; remove old C24/formal-total/gained-boundary-crossing material; update A3B1 markers; prove diff scope.
4. Complete bounded production and six-file test authority without adding R4 behavior.
5. Materialize all physical primary tests, actual traceability, supporting authorities, and then the ACTIVE ownership record.
6. Pass focused tests, typecheck, lint, full test/coverage, ownership, deterministic, exact-shape, diff, and stop-loss audits.
7. Create the product implementation commit and record its full SHA.
8. Run three complete independent nine-shard candidates on exactly that product SHA and prove the stable five-tuple/ownership identity.
9. Materialize the exact A3B1 profile in one separate profile-only child commit; preserve all prior profiles and product/test/fixture bytes.
10. Run required exact-head CI on the profile-only HEAD, including exact-profile verifier and Windows; freeze code/docs/PR body.
11. Obtain complete independent final review and publish/re-read both verbatim GitHub audit comments on the exact frozen HEAD.
12. Merge only with pass verdicts, empty blockers, exact HEAD equality, clean worktree, and no post-review commit.

## Acceptance Checks

Implementation is complete only when:

- the single recovery method and post-recovery audit satisfy every frozen restriction;
- GOOD and EVIL real success paths produce exact V4 and exact atomic batch;
- C10 positively proves non-circular successful prospective reconstruction before append;
- C32 independently rejects stored semantic self-proof;
- C15/C16 are hostile R3 histories, not fabricated R1;
- C17/C34 remain R4 pure non-selection with no producer claim;
- C41 contains no Vortox death branch and lifecycle remains R4;
- C20–C23 prove one fact/exact triple/one DRUNK evidence/no second cause, with no C24/formal Math total;
- C31 stops at the next gained-Dreamer boundary without Seamstress/Mathematician;
- every C/S row has singleton R/T/layer and one physical primary authority;
- all V1/V2/V3 replay, atomicity, retry, privacy, historical stability, and determinism contracts pass;
- ownership A3B1 is active only after actual authority exists and A3A remains byte-identical;
- three candidates agree exactly, profile sourceHead equals full product commit, old profiles remain byte-identical, the profile-only diff is exact, and verifier/CI pass on its own HEAD;
- production/test/docs allowlists and exact stop-loss hold;
- Slice/role coverage remains honest and partial;
- full local and exact-head CI gates pass;
- final independent report is complete with `CODE_REVIEW_PASS`, `RULE_REVIEW_PASS`, `remainingBlockers=[]`, and both GitHub comments are re-read against current HEAD.

## Deferred Dependencies

`2B19A3B2_COMBINED_MATHEMATICIAN_INTEGRATION` remains blocked on accepted `2B19B_PHILOSOPHER_GAINED_DREAMER_EXECUTION`. Future work must independently design gained-Dreamer execution, distinct-player deduplication across base/gained sources, formal combined Mathematician close/count and Vortox-false number, and any continuation. This Round 2 freezes none of those values; a future combined total is not assumed to be one.

## Independent Round 2 Review Questions

The reviewer must independently verify:

1. all Round 1 passing rule/V4/batch/ledger/projection/non-goal semantics are fully present;
2. all 60 rows have singleton exact R/T/layer values and one primary mechanism;
3. C15/C16, C17/C34, C41, C10/C32 classifications close the exact review findings without false R1 authority;
4. coverage contract freezes three nine-shard candidates, stable five-tuple, exact product sourceHead, old profiles, profile-only diff, and fail-closed verifier;
5. exactly one authorized recovery command is selected and its raw eight-file result remains unaccepted until full audit/C24 removal/marker correction;
6. only governance Stop Condition 10's old recovery prohibition is superseded; all other GO/stop-loss boundaries remain;
7. no gained Dreamer, Seamstress continuation, formal Mathematician total, new rule/override/event/state/evidence/public boundary/generic engine enters scope;
8. allowlists, coverage claims, rollback, CI, ownership, and final-review gates are implementable and exact.

The only valid independent review verdicts are `RULE_DESIGN_PASS`, `RULE_DESIGN_FIX_REQUIRED`, or `HUMAN_BLOCKED`. No implementation is authorized by this document alone.

`READY_FOR_RULE_DESIGN_REVIEW_ROUND_2`
