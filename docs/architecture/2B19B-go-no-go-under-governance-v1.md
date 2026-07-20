# Phase 3 Slice 2B19B Governance Go/No-Go V1

## Metadata

- sliceId: `2B19B`
- task: Philosopher-gained Dreamer effective-source execution
- reviewType: read-only governance precheck
- reviewDate: `2026-07-19`
- branch: `phase-3/philosopher-gained-dreamer-effective-source`
- baseHead: `5ddaa2fd02e0cb73e2a5363b222e7f08c353d389`
- githubMainHead: `5ddaa2fd02e0cb73e2a5363b222e7f08c353d389`
- openPullRequests: `0`
- latestMainCI: `29674623200`
- latestMainCIStatus: `SUCCESS`
- ruleEvidence: `docs/rules/evidence/2B19B.md`
- ruleEvidenceSha256: `e1f038f32171d7cea1f89345b1cac958e30a79f47005ca444a0dc2633abe3187`
- ruleVerdict: `RULE_READY`
- ruleCoverageStatus: `PARTIAL`

## Preconditions Verified

The local branch and GitHub `main` share the same accepted anchor. The working tree contains only the authorized control-document updates and untracked `2B19B` rule evidence. No production or test file is modified.

Fresh rule evidence records the required user override, Chinese Wiki, official BOTC Wiki, and official nightsheet sources. It reports no unresolved conflict and terminates with `RULE_READY`.

The current role coverage matrix was read before this governance decision:

- Dreamer: `PARTIAL`
- Philosopher: `PARTIAL`
- Mathematician: `PARTIAL`
- Vortox: `NOT_STARTED`

This slice must not promote any of these roles to `COMPLETE`.

## Governance Classification

### Existing R1 Reachability

The current repository already exposes a real formal application path:

1. `SubmitPhilosopherAction` accepts a real Philosopher first-night command.
2. The application service creates `PhilosopherAbilityChosen`.
3. It creates `PhilosopherAbilityGranted`.
4. It inserts the gained Dreamer task through `FirstNightTaskInsertedV2`.
5. The scheduled-task plan advances to the canonical gained `DREAMER_ACTION`.
6. A caller can invoke the real first-night action command at that task.
7. The application currently rejects that exact task at the intentional unsupported boundary without appending events or a command receipt.

A callable formal path that currently fails remains R1 under the accepted governance ADR. The currently successful gained-Dreamer settlement behavior is not yet implemented; it becomes R1 only by extending this same formal producer during 2B19B.

### Target R1 Outcomes

The bounded future design may cover only these outcomes on the real V2 gained task:

- Effective Philosopher source under normal world conditions.
- Effective Philosopher source under effective Vortox conditions.
- Atomic rejection for malformed, stale, ineligible, or otherwise unsupported source state.

It must preserve the current unsupported behavior for V1 gained tasks and all explicitly excluded impairment cases.

### R2 Accepted History

R2 includes accepted historical Philosopher grants, V1/V2 insertion records, existing role-tenure records, and previously accepted base Dreamer event versions. They remain replayable under their original semantics.

No new V1 settlement behavior is authorized.

### R3 Hostile or Corrupt History

R3 includes malformed grant/insertion linkage, fabricated task identity, wrong source player or seat, missing or mismatched Philosopher tenure, noncanonical opportunity or delivery history, duplicate settlement, malformed payload shape, and proxy/getter/cycle/nonplain hostile inputs.

These inputs must fail closed and must never be normalized into valid provenance.

### R4 Future or Hypothetical Behavior

The following remain R4 or explicitly unsupported:

- source Philosopher `DRUNK` or `POISONED` successful execution;
- impaired-source Vortox success;
- No Dashii interaction;
- new V1 gained-Dreamer settlement;
- formal Mathematician integration;
- other-night Dreamer behavior;
- Traveller targeting;
- a generic gained-ability execution platform;
- new role-assignment or character-state semantics.

## Existing Canonical Reuse Chain

| Concern | Existing authority that must be reused |
|---|---|
| Philosopher command entry | `SubmitPhilosopherAction` |
| Ability selection | `PhilosopherAbilityChosen` |
| Ability grant | `PhilosopherAbilityGranted` |
| V2 task insertion | `FirstNightTaskInsertedV2` |
| Scheduling version | `PHILOSOPHER_GAINED_FIRST_NIGHT_SCHEDULING_VERSION` |
| Order policy | base task, then gained task by source seat and code-unit task ID |
| Canonical gained task identity | existing V2 gained task ID construction |
| Ability-instance provenance | `PHILOSOPHER_GAINED_TASK_V2` |
| Canonical gained ability-instance ID | existing task-and-grant formatter |
| Source tenure | active Philosopher role tenure |
| Outcome storage | existing first-night ability outcome ledger |
| Source evidence | existing Philosopher grant and first-night task-insertion evidence variants |
| Dreamer knowledge | existing Dreamer target and information collections |
| Projection ownership | existing `sourcePlayerId` projection boundary |
| Atomicity | existing domain-batch validation and application serial command queue |

The slice must not fabricate a Dreamer role tenure for the Philosopher. The player remains the Philosopher and gains the Dreamer ability.

## Trust Classification

### T1 Persisted or External Inputs

T1 includes commands, stored opportunities, stored target choices and deliveries, accepted event streams, grants, task insertions, role tenures, and ledger evidence.

Future design must require exact runtime shape validation before property use and exception-safe rejection of proxies, revoked proxies, getters, symbols, cycles, nonplain objects, missing keys, extra keys, and wrong literals or types.

### T2 Canonical Derived Values

T2 includes the current scheduled task, active source tenure, prospective state, resolved world condition, canonical candidate ordering, and derived ability-instance provenance.

These values must be derived only from already validated canonical state and accepted history.

### T3 Module-Private Pure Values

T3 includes local deterministic comparisons, canonical ID formatting, bounded candidate calculations, and version-specific internal helpers.

No T3 helper may become a generic public gained-ability capability layer in this slice.

## Fourteen Authorization Conditions

| # | Condition | Result | Evidence |
|---:|---|---|---|
| 1 | Real R1 V2 gained task exists | PASS | A real Philosopher command creates and schedules the canonical V2 gained Dreamer task; the real action command reaches the current unsupported boundary. |
| 2 | Existing grant/insertion flow is reusable | PASS | `PhilosopherAbilityGranted` and `FirstNightTaskInsertedV2` already form the canonical accepted-history chain. |
| 3 | `PHILOSOPHER_GAINED_TASK_V2` is reusable | PASS | Existing first-night ability provenance and ledger logic already recognize this source kind. |
| 4 | Philosopher tenure is reusable | PASS | Existing gained-ability provenance binds the source to the active Philosopher tenure. |
| 5 | No fake Dreamer tenure is required | PASS | Gained Seamstress and Mathematician provenance establish the accepted pattern: retain the Philosopher tenure. |
| 6 | No assignment change is required | PASS | The source remains assigned Philosopher while gaining an ability. |
| 7 | No `CurrentCharacterState` change is required | PASS | Effectiveness can be resolved from existing canonical source state and tenure history. |
| 8 | No new domain event is required | PASS | Existing opportunity, target, delivery, scheduled settlement, and ledger flows are sufficient; only new closed versions inside existing event families may be considered. |
| 9 | No new top-level `GameState` field is required | PASS | Existing opportunity, Dreamer knowledge, task, grant, tenure, and ledger collections cover the state transition. |
| 10 | No new ledger evidence variant is required | PASS | Existing source-event, task, opportunity, role-tenure, player-role, Philosopher-grant, task-insertion, and Dreamer-delivery evidence variants are sufficient. |
| 11 | No generic gained platform is required | PASS | A Dreamer-specific branch can extend the current formal gained-task boundary without adding public generic capability infrastructure. |
| 12 | No formal Mathematician integration is required | PASS | The slice may settle gained Dreamer and stop before Mathematician information processing. |
| 13 | Estimated production files are at most 8 | PASS | Six production files form the proposed maximum allowlist. |
| 14 | Estimated added production LOC are at most 1500 | PASS | Current architectural estimate is approximately `1,050–1,400` added production lines. |

## Frozen Production Allowlist for Design

The later independent architecture design may modify at most these six production files:

1. `packages/domain-core/src/first-night-action-opportunity.ts`
2. `packages/domain-core/src/dreamer.ts`
3. `packages/domain-core/src/domain-batch-semantics.ts`
4. `packages/domain-core/src/first-night-ability-outcome-ledger.ts`
5. `packages/application/src/game-application-service.ts`
6. `packages/projections/src/index.ts`

The following are reuse-only and must not require semantic changes:

- `philosopher-ability.ts`
- `first-night-task-plan.ts`
- `seamstress.ts`
- `mathematician.ts`
- `mathematician-internal.ts`
- `event-applier.ts`
- canonical event union definitions
- top-level `GameState`

## Test and Infrastructure Boundaries

Expected direct test ownership is limited to the corresponding opportunity, Dreamer, batch, ledger, rebuild, application, and private-knowledge projection suites.

The existing `application-service-dreamer-vortox` process shard can own the application test path. The ownership registry may receive a new active 2B19B contract after exact test markers and traceability exist. No Vitest workspace topology or GitHub Actions topology change is justified.

Any fixture or live-capture support must be slice-local, immutable, and bounded. It must not create a generic replay or gained-ability framework.

## Acceptance Constraints for Independent Design

The next architecture document must freeze, without expanding scope:

- a new closed and versioned gained-Dreamer opportunity path while preserving every accepted base opportunity version;
- separate closed normal and effective-Vortox delivery paths;
- exact grant, insertion, task, ability-instance, source-player, source-seat, and Philosopher-tenure linkage;
- settlement-time effectiveness evaluation;
- atomic target, delivery, scheduled settlement, and ledger outcome behavior;
- prospective validation before append;
- retry and duplicate-command behavior;
- replay compatibility for all prior event versions;
- historical knowledge stability after later character or alignment changes;
- source-player projection without exposing canonical truth or reliability metadata;
- accepted-stream validation before projection;
- deterministic candidate and event ordering;
- continued receipt-free rejection for V1 gained Dreamer and excluded impairment states;
- no formal Mathematician outcome or counter update.

This governance decision deliberately does not define exact payload fields, runtime shapes, event version names, batch indexes, or implementation algorithms. Those belong to the bounded architecture design and independent rule-design review.

## Stop-Loss Conditions

Before implementation authorization, reslice if the reviewed design:

- requires more than 8 production files;
- estimates more than 1,500 added production lines;
- changes assignment or current-character-state semantics;
- introduces a new top-level `GameState` field;
- introduces a new domain-event family or ledger evidence variant;
- changes existing accepted base Dreamer versions;
- requires a generic gained-ability execution platform;
- requires formal Mathematician behavior;
- cannot preserve exact replay, atomicity, prospective validation, or historical knowledge.

More than 10 production files or more than 1,800 added production lines is an unconditional hard stop under the user authorization.

A substantive rule conflict, unavailable required source, inability to prove canonical Philosopher tenure, or need to reinterpret the approved scheduling override maps to `HUMAN_BLOCKED`.

## Rollback Boundary

Before merge, rollback consists only of abandoning the unmerged feature branch. Existing accepted event versions, state fields, scheduling behavior, and projection contracts remain untouched.

After merge, compatibility rollback must disable only the newly added gained-Dreamer producer while retaining replay and validation support for any already accepted new event versions. Accepted history must never be rewritten or downgraded.

## Decision Basis

The repository already contains the canonical Philosopher grant, V2 insertion, gained-task scheduling, gained ability-instance provenance, Philosopher-tenure linkage, first-night ledger, Dreamer storage, projection, replay, and deterministic ordering primitives needed for this slice.

The missing behavior is a bounded Dreamer-specific extension at an existing real R1 application boundary. It does not require new event families, top-level state, ledger evidence kinds, assignment semantics, generic infrastructure, or formal Mathematician behavior. The six-file and estimated-LOC boundaries satisfy all authorized governance conditions.

GO
